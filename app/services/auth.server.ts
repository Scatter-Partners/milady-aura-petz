// app/services/auth.server.ts
import { Authenticator } from "remix-auth";
// import { SiweStrategy } from "@sloikaxyz/remix-auth-siwe";

import { sessionStorage } from "~/services/session.server";
import type { IUser } from "~/services/session.server";

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
// export let authenticator = new Authenticator<IUser>(sessionStorage, {
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
