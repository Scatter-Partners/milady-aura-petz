// app/services/auth.server.ts
import { Authenticator } from "remix-auth";
import { SiweStrategy } from "@sloikaxyz/remix-auth-siwe";

import { sessionStorage } from "~/services/session.server";
import type { User } from "~/services/session.server";
import { ActionFunction } from "@remix-run/node";

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export let authenticator = new Authenticator<User>(sessionStorage, {
  sessionKey: "sessionKey", // keep in sync
  sessionErrorKey: "sessionErrorKey", // keep in sync
});

authenticator.use(
  new SiweStrategy({ domain: "localhost:4000" }, async ({ message }) => {
    return await Promise.resolve({ address: message.address });
  }),
  "siwe"
);

export const action: ActionFunction = async ({ request, context }) => {
  await authenticator.authenticate("siwe", request, {
    successRedirect: "/",
    failureRedirect: "/login",
    context, // optional
  });
};
