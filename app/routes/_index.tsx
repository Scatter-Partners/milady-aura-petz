import type { V2_MetaFunction } from "@remix-run/react";
   import { useSubmit } from '@remix-run/react';
import { useCallback } from "react";
   import { SiweMessage } from 'siwe';

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

export default function Index() {
      const submit = useSubmit();

      function authenticate = useCallback(() => {
         // create siwe message
         const message = await new SiweMessage({ siweMessageOptions });
         // sign siwe message
         const signature = await signer.signMessage(message);

         const formData = new FormData();
         formData.append('message', message);
         formData.append('signature', signature);
         submit(formData, {
            action: {YOUR_LOGIN_ACTION},
            method: 'post',
            replace: true,
         });
      }, [submit])

  return (
    <div>
      <h1 className="text-3xl text-amber-600 font-bold underline">
        Hello Tailwind!
      </h1>
      <h1>Welcome to Remix</h1>
      <ul>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/jokes"
            rel="noreferrer"
          >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>
    </div>
  );
}
