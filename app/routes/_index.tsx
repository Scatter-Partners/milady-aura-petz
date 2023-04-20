import type { ActionFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import { useActionData } from "@remix-run/react"
import { useEffect, useState } from "react"
import { SiweMessage } from "~/lib/utils/siwe.server"
// import { SiweStrategy } from "@sloikaxyz/remix-auth-siwe";
import { ConnectWithSelect } from "~/components/ConnectWithSelect"
import { hooks, metaMask } from "~/lib/connectors/metaMask"
import EventEmitter from "~/lib/utils/eventemitter.server"
import { MintSection } from "~/components/MintSection"
import { Card } from "~/components/Card"

const {
  useChainId,
  useAccounts,
  useIsActivating,
  useIsActive,
  useProvider,
  useENSNames,
} = hooks

// export const action = async ({ request }: ActionArgs) => {
//   const formData = await request.formData();
//   const project = await createProject(formData);
//   return redirect(`/projects/${project.id}`);
// };

export const action: ActionFunction = async ({ request, context }) => {
  console.log("doing the action")
  const formData = await request.formData()
  console.log({ formData })
  const address = formData.get("address") as string
  const statement = formData.get("statement") as string
  // const project = await createProject(body);
  const EE = new EventEmitter()

  console.log({ EE })

  // console.log({siwe, SiweMessage})
  // console.log({siwe})
  console.log({ context })

  try {
    const siweOptions = {
      domain: "localhost:4000",
      address,
      statement,
      uri: "https://localhost:4000/",
      version: "1",
      chainId: 1,
    }
    console.log({ siweOptions })
    const message = new SiweMessage(siweOptions)

    const preparedMessage = message.prepareMessage()
    console.log({ message })
    console.log(preparedMessage)
    return json({ message: preparedMessage })
  } catch (error) {
    console.log({ error })
    return json({ error })
  }
  // sign siwe message

  // const signer = provider?.getSigner();

  // const signature = await signer.signMessage(message);

  // let authenticator = new Authenticator<IUser>(sessionStorage, {
  //   sessionKey: "sessionKey", // keep in sync
  //   sessionErrorKey: "sessionErrorKey", // keep in sync
  // });

  // authenticator.use(
  //   new SiweStrategy({ domain: "localhost:4000" }, async ({ message }) => {
  //     return await Promise.resolve({
  //       address: message.address,
  //       username: "bozo-the-clown",
  //     });
  //   }),
  //   "siwe"
  // );

  // const formData = new FormData();
  // formData.append("message", message);
  // formData.append("signature", signature);
  // submit(formData, {
  //   action: { YOUR_LOGIN_ACTION },
  //   method: "post",
  //   replace: true,
  // });

  // await authenticator.authenticate("siwe", request, {
  //   successRedirect: "/",
  //   failureRedirect: "/login",
  //   context, // optional
  // });
}

export default function Index() {
  // const authenticate = useCallback(async () => {
  //   // siweMessageOptions: null;
  //   // create siwe message
  // }, [submit]);
  const actionData = useActionData<typeof action>()
  console.log({ actionData })

  const chainId = useChainId()
  const accounts = useAccounts()
  const isActivating = useIsActivating()

  const isActive = useIsActive()

  const provider = useProvider()
  const ENSNames = useENSNames(provider)

  // const signer = provider?.getSigner()

  // console.log({
  //   chainId,
  //   accounts,
  //   isActivating,
  //   isActive,
  //   provider,
  //   ENSNames,
  //   signer,
  // })

  const [error, setError] = useState<Error>()
  //
  // const statement = "This is a test statement."

  // attempt to connect eagerly on mount
  useEffect(() => {
    console.log("eagerly connecting to MM")

    void metaMask.connectEagerly().catch(() => {
      console.debug("Failed to connect eagerly to metamask")
    })
  }, [])

  useEffect(() => {
    ;(async function getSignature() {
      if (!actionData?.message || !provider) {
        return
      }

      const signer = provider?.getSigner()

      const signature = await signer.signMessage(actionData.message)

      console.log({ signature })
    })()
  }, [actionData?.message, provider])

  const backgroundImageUrl =
    "https://pixelady.s3.amazonaws.com/aura-petz/BLACK_CRT.webp"

  return (
    <div
      className="bg-repeat h-full min-h-screen text-white"
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
    >
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
    </div>
  )
}

{
  /* <Form method="post">
        <input
          type="hidden"
          name="address"
          value={accounts ? accounts[0] : ""}
        />
        <input type="hidden" name="statement" value={statement} />
        <button type="submit">Sign In</button>
        {/* <button type="submit">Sign In</button> */
}
