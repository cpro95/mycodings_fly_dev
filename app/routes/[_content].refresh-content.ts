import { data } from "react-router";
import type { Route } from "./+types/[_content].refresh-content";

export const action = async ({ request }: Route.ActionArgs) => {
  // console.log(
  //   "아래 REFRESH_TOKEN는 Fly.io의 secrets에 의해 지정된다."
  // );
  if (request.headers.get("auth") !== process.env.REFRESH_TOKEN) {
    return data({ message: "Not Authorised" }, { status: 401 });
  }

  const body = await request.text();

  // const queryParams = new URLSearchParams();
  // queryParams.set("_data", "routes/_content/update-content");

  // console.log(
  //   "아래 FLY_APP_NAME는 Fly.io의 secrets에 의해 지정된다."
  // );
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:5173"
      : `https://${process.env.FLY_APP_NAME}.fly.dev`;

  const response = await fetch(`${baseUrl}/_content/update-content`, {
    method: "POST",
    body,
    headers: {
      auth: process.env.REFRESH_TOKEN,
      "content-type": "application/json",
      "content-length": Buffer.byteLength(body).toString(),
    },
  });

  return data(response);
};
