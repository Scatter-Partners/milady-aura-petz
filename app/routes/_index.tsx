import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useEffect, useState } from "react";
import { SiweMessage } from "~/lib/utils/siwe.server";
import { ConnectWithSelect } from "~/components/ConnectWithSelect";
import { hooks, metaMask } from "~/lib/connectors/metaMask";
import EventEmitter from "~/lib/utils/eventemitter.server";
import { MintSection } from "~/components/MintSection";

const { useChainId, useIsActivating, useIsActive, useProvider } = hooks;

export const action: ActionFunction = async ({ request, context }) => {
  console.log("doing the action");
  const formData = await request.formData();
  console.log({ formData });
  const address = formData.get("address") as string;
  const statement = formData.get("statement") as string;
  // const project = await createProject(body);
  const EE = new EventEmitter();

  console.log({ EE });

  console.log({ context });

  try {
    const siweOptions = {
      domain: "localhost:4000",
      address,
      statement,
      uri: "https://localhost:4000/",
      version: "1",
      chainId: 1,
    };
    console.log({ siweOptions });
    const message = new SiweMessage(siweOptions);

    const preparedMessage = message.prepareMessage();
    console.log({ message });
    console.log(preparedMessage);
    return json({ message: preparedMessage });
  } catch (error) {
    console.log({ error });
    return json({ error });
  }
};

export default function Index() {
  const chainId = useChainId();
  const isActivating = useIsActivating();

  const isActive = useIsActive();

  const provider = useProvider();

  // console.log({
  //   chainId,
  //   accounts,
  //   isActivating,
  //   isActive,
  //   provider,
  //   ENSNames,
  //   signer,
  // })

  const [error, setError] = useState<Error>();

  useEffect(() => {
    console.log("eagerly connecting to MM");

    void metaMask.connectEagerly().catch(() => {
      console.debug("Failed to connect eagerly to metamask");
    });
  }, []);

  return (
    <div className="max-w-screen-2xl mx-auto h-screen flex flex-col items-center justify-center px-8 lg:px-0">
      <div className="flex flex-col items-center justify-center">
        <div className="max-w-3xl mx-auto">
          <img
            src="https://pixelady.s3.amazonaws.com/aura-petz/website_logo.webp"
            width="1037"
            height="172"
            alt="milady aura petz"
          />
        </div>

        {/* <Card
            connector={metaMask}
            activeChainId={chainId}
            isActivating={isActivating}
            isActive={isActive}
            error={error}
            chainIds={[1, 11155111]}
            setError={setError}
            accounts={accounts}
            provider={provider}
            ENSNames={ENSNames}
          /> */}
        {/* <Form method="post">
            <input
              type="hidden"
              name="address"
              value={accounts ? accounts[0] : ""}
            />
            <input type="hidden" name="statement" value={statement} />
            <button type="submit" className="text-white">
              Sign In
            </button>
          </Form> */}

        <div className="w-72">
          <img
            src="https://pixelady.s3.amazonaws.com/aura-petz/bunny.webp"
            width="352"
            height="436"
            alt="bunny pet"
          />
        </div>

        {isActive ? (
          <div className="mt-2">
            <MintSection provider={provider} />
          </div>
        ) : (
          <div className="w-[360px] -mt-10">
            <ConnectWithSelect
              connector={metaMask}
              activeChainId={chainId}
              chainIds={[1, 11155111]}
              isActivating={isActivating}
              isActive={isActive}
              error={error}
              setError={setError}
            />
          </div>
        )}
      </div>
    </div>
  );
}
