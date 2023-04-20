import { createCookieSessionStorage } from "@remix-run/node";

// export the whole sessionStorage object
export let sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session", // use any name you want here
    sameSite: "lax", // this helps with CSRF
    path: "/", // remember to add this so the cookie will work in all routes
    httpOnly: true, // for security reasons, make this cookie http only
    secrets: ["s3cr3t"], // replace this with an actual secret
    secure: process.env.NODE_ENV === "production", // enable this in prod only
  },
});

// you can also export the methods individually for your own usage
export let { getSession, commitSession, destroySession } = sessionStorage;

export type IUser = {
  // _id?: string;
  username: string | null;
  // address: string;
  // address_lowercase: string;
  // avatar_uri: string;
  // banner_uri: string;
  // description: string;
  // joined_time: Date;
  // token?: string;
  // nonce: number;
  // signature?: string;
  // isActiveUser?: boolean;
  // accessToken?: string;
  // is_valid_affiliate?: boolean;
  // ens?: string;
};
