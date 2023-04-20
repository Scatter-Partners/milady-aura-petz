import type { Web3Provider } from "@ethersproject/providers";
import type { Contract } from "ethers";
import { ethers } from "ethers";
import { MintButton } from "./MintButton";
import { useEffect, useState } from "react";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

export const ETHERSCAN_DOMAIN = "https://etherscan.io";
// export const API_URL = "https://scatter-api.fly.dev"
export const API_URL = "https://scatter-api-testing.fly.dev";

const address = "0xc8FAFEe7E6f3B3359A5FA850605C74520e19a5B6"; // pixelady test goerli
const root =
  "0x66e915aa20ae05002bc22942644e1520cf77a628aefadff9248f0b42c4d80bd0";

const abi = require("../lib/abi/ArchetypeV51.json");

async function getMaxQuantity(nftContract: Contract) {
  let maxQuantity = 0;

  // check invite limit
  let invite = await nftContract.invites(ethers.constants.HashZero);
  console.log({ invite });

  let limit = invite["limit"];

  console.log({ limit });

  let currentBalance = await nftContract.balanceOf(
    nftContract.signer.getAddress()
  );
  maxQuantity = Number(limit) - currentBalance;

  // check max batch size
  let config = await nftContract.config();
  let maxBatch = config["maxBatchSize"];
  maxQuantity = maxQuantity < maxBatch ? maxQuantity : maxBatch;

  // check contract max supply
  let maxSupply = config["maxSupply"];
  let curSupply = await nftContract.totalSupply();
  let diff = maxSupply - curSupply;

  maxQuantity = maxQuantity < diff ? maxQuantity : diff;
  return maxQuantity;
}

export type IMintModalDataV40 = {
  txnHash: string;
  tokenIds: number[];
  quantity: number;
  price: string;
  currencyAddress?: string;
};

export function MintSection({ provider }: { provider?: Web3Provider }) {
  const [quantity, setQuantity] = useState<number>(1);
  const [proof, setProof] = useState<{
    status: "fetching" | "idle";
    theProof: string[];
  }>({ status: "idle", theProof: [] });

  const [modalData, setModalData] = useState<IMintModalDataV40>({
    txnHash: "",
    tokenIds: [],
    quantity: 0,
    price: "0",
    currencyAddress: ethers.constants.AddressZero,
  });

  useEffect(() => {
    (async function fetchProof() {
      if (!provider) {
        return;
      }

      setProof({ status: "fetching", theProof: [] });

      console.log({ address });
      const account = await provider.getSigner().getAddress();

      const listsRes = await fetch(
        `${API_URL}/api/collections/${address}/eligiblelists/${account}`
      );
      const lists = await listsRes.json();
      console.log({ lists });

      if (lists.length <= 1) {
        setProof({ status: "idle", theProof: [] });
        return;
      }

      const proofRes = await fetch(
        `${API_URL}/api/collections/${address}/root/${root}/account/${account}`
      );
      const _proof = await proofRes.json();

      console.log({ proof: _proof.body.proof });
      setProof({ status: "idle", theProof: _proof.body.proof });
    })();
  }, []);

  async function mintPublic() {
    if (!provider) {
      throw new Error("no provider!");
    }

    const nftContract = new ethers.Contract(address, abi, provider.getSigner());

    if (quantity > (await getMaxQuantity(nftContract))) {
      console.log("Max quantity exceeded");
      return;
    }

    let invite = await nftContract.invites(ethers.constants.HashZero);

    let price = (invite["price"] * quantity).toString();
    let auth = [ethers.constants.HashZero, []];
    let affiliate = ethers.constants.AddressZero;
    let affiliateSigner = ethers.constants.HashZero;

    let estimatedGas = 0;
    try {
      const estimatedGasFromContract = await nftContract.estimateGas.mint(
        auth,
        quantity,
        affiliate,
        affiliateSigner,
        { value: price, gasLimit: 0 }
      );
      estimatedGas = estimatedGasFromContract.toNumber();
    } catch (error) {
      console.log("User has insufficient funds for mint");
      console.log(error);
    }

    try {
      const tx = await nftContract.mint(
        auth,
        quantity,
        affiliate,
        affiliateSigner,
        { value: price, gasLimit: estimatedGas }
      );
      console.log(`Transaction hash: ${tx.hash}`);

      setModalData((prev) => ({
        ...prev,
        txnHash: tx.hash,
      }));

      const receipt = await tx?.wait();

      const transferEvents = (receipt as any).events.filter(
        (evt: any) => evt.event === "Transfer"
      );

      const tokenIds = transferEvents.map((evt: any) =>
        evt.args.tokenId.toString()
      );

      setModalData((prev) => ({
        ...prev,
        tokenIds,
        txnHash: receipt.transactionHash,
      }));

      console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
      console.log(`Gas used: ${receipt.gasUsed.toString()}`);
      // callback(true)
    } catch (error) {
      console.log("rejected mint");
      console.log(error);
      // callback(false)
    }
  }

  async function mintPrivate() {
    if (!provider) {
      throw new Error("no provider!");
    }

    const nftContract = new ethers.Contract(address, abi, provider.getSigner());

    if (quantity > (await getMaxQuantity(nftContract))) {
      console.log("Max quantity exceeded");
      return;
    }

    const privateListRoot =
      "0x66e915aa20ae05002bc22942644e1520cf77a628aefadff9248f0b42c4d80bd0";

    let invite = await nftContract.invites(privateListRoot);

    let price = (invite["price"] * quantity).toString();
    let auth = [privateListRoot, proof];
    let affiliate = ethers.constants.AddressZero;
    let affiliateSigner = ethers.constants.HashZero;

    let estimatedGas = 0;
    try {
      const estimatedGasFromContract = await nftContract.estimateGas.mint(
        auth,
        1,
        affiliate,
        affiliateSigner,
        { value: price, gasLimit: 0 }
      );
      estimatedGas = estimatedGasFromContract.toNumber();
    } catch (error) {
      console.log("User has insufficient funds for mint");
      console.log(error);
    }

    try {
      const tx = await nftContract.mint(auth, 1, affiliate, affiliateSigner, {
        value: price,
        gasLimit: estimatedGas,
      });
      console.log(`Transaction hash: ${tx.hash}`);

      setModalData((prev) => ({
        ...prev,
        txnHash: tx.hash,
      }));

      const receipt = await tx?.wait();

      const transferEvents = (receipt as any).events.filter(
        (evt: any) => evt.event === "Transfer"
      );

      const tokenIds = transferEvents.map((evt: any) =>
        evt.args.tokenId.toString()
      );

      setModalData((prev) => ({
        ...prev,
        tokenIds,
        txnHash: receipt.transactionHash,
      }));

      console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
      console.log(`Gas used: ${receipt.gasUsed.toString()}`);
      // callback(true)
    } catch (error) {
      console.log("rejected mint");
      console.log(error);
      // callback(false)
    }
  }

  const congratsUi = (
    <div className="flex flex-col text-white items-center relative">
      <div className="absolute -top-80 -left-80">
        <img
          src="https://pixelady.s3.amazonaws.com/aura-petz/exclamation_l.webp"
          width="316"
          height="485"
          alt="!"
        />
      </div>
      <div className="absolute -top-80 -right-80">
        <img
          src="https://pixelady.s3.amazonaws.com/aura-petz/exclamation_r.webp"
          width="333"
          height="481"
          alt="!"
        />
      </div>
      <div>
        <img
          src="https://pixelady.s3.amazonaws.com/aura-petz/congratz.webp"
          width="575"
          height="112"
          alt="congratz on yr new pet"
        />
      </div>

      <div className="mt-8 mb-4 text-center">
        <p className="text-sm text-gray-500">
          Pet
          {(modalData.tokenIds?.length || 1) > 1 ? "z" : ""} minted:
        </p>
        <div className="mt-3 space-y-2">
          {modalData.tokenIds?.map((id) => (
            <p key={id} className="">
              <a
                className="underline hover:no-underline text-sky-200"
                target="_blank"
                rel="noopener noreferrer"
                href={`https://scatter.art/milady-aura-petz/${id}`}
              >
                Pet #{id}
              </a>
            </p>
          ))}
        </div>
      </div>
    </div>
  );

  const pendingUi = (
    <div className="flex flex-col text-white items-center">
      <div className="flex items-center mx-auto text-center justify-center text-sm text-sky-300 group mt-2 mb-3 flex-col">
        <img
          src="https://pixelady.s3.amazonaws.com/aura-petz/loading.webp"
          width="334"
          height="77"
          alt="loading..."
        />
        <div className="flex flex-row items-center justify-center mt-4">
          <a
            href={`${ETHERSCAN_DOMAIN}/tx/${modalData.txnHash}`}
            target="_blank"
            rel="noreferrer"
            className="underline group-hover:no-underline text-base mr-1"
          >
            View Transaction
          </a>{" "}
          <ArrowTopRightOnSquareIcon
            className="ml-1 h-4 w-4 text-slate-500 group-hover:text-slate-600 group-hover:translate-x-1 transition-all"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );

  const MintUi = ({
    merkleProof,
  }: {
    merkleProof: {
      status: "fetching" | "idle";
      theProof: string[];
    };
  }) => (
    <div className="flex flex-col text-white items-center">
      <div className="flex flex-row justify-between items-center space-x-10">
        <div className="text-5xl font-normal">
          <button
            className=""
            onClick={() =>
              setQuantity((prev) => {
                return prev > 1 ? prev - 1 : 1;
              })
            }
          >
            -
          </button>
        </div>
        <div className="w-36">
          <label htmlFor="email" className="sr-only">
            quantity
          </label>
          <input
            type="text"
            name="quantity"
            id="quantity"
            className="block w-full border-2 bg-transparent border-white py-2  shadow-sm  placeholder:text-gray-600 sm:text-3xl ring-white sm:leading-6 text-center text-white"
            placeholder="you@example.com"
            min={1}
            max={1888}
            value={!Number.isNaN(quantity) ? quantity : 1}
            onChange={(e) => {
              setQuantity(Number(e.target.value));
            }}
          />
        </div>
        <div className="text-5xl font-normal">
          <button className="" onClick={() => setQuantity((prev) => prev + 1)}>
            +
          </button>
        </div>
      </div>
      <div className="text-lg mt-4 font-semibold">.025ETH</div>

      <div className="w-48 mt-8">
        <MintButton
          image="https://pixelady.s3.amazonaws.com/aura-petz/mint_button_selected_small.webp"
          imageHover="https://pixelady.s3.amazonaws.com/aura-petz/mint_button_unselected_small.webp"
          handleClick={mintPublic}
        />
      </div>

      <div className="w-48 mt-8 border-t border-gray-200 pt-12 text-center">
        {merkleProof.status === "fetching"
          ? "Checking free mint eligibility..."
          : null}

        {merkleProof.theProof.length ? (
          <MintButton
            image="https://pixelady.s3.amazonaws.com/aura-petz/free_mint_button.webp"
            imageHover="https://pixelady.s3.amazonaws.com/aura-petz/free_mint_button_hover.webp"
            handleClick={mintPrivate}
          />
        ) : merkleProof.status === "idle" ? (
          "No free mint"
        ) : null}
      </div>
    </div>
  );

  return modalData.tokenIds.length ? (
    congratsUi
  ) : modalData.txnHash ? (
    pendingUi
  ) : (
    <MintUi merkleProof={proof} />
  );
}
