// learn more: https://fly.io/docs/reference/configuration/#services-http_checks
import type { Route } from "./+types/healthcheck";
// import { getMdxListItems } from "~/utils/mdx.server";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const host =
    request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");

  try {
    const url = new URL("/", `http://${host}`);
    // if we can connect to the database and make a simple query
    // and make a HEAD request to ourselves, then we're good.
    await Promise.all([
      // getMdxListItems({ contentDirectory: "blog", page: 1, itemsPerPage: 10 }),
      fetch(url.toString(), { method: "HEAD" }).then((r) => {
        if (!r.ok) return Promise.reject(r);
      }),
    ]);
    return new Response("OK");
  } catch (error: unknown) {
    console.log("healthcheck ❌", { error });
    return new Response("ERROR", { status: 500 });
  }
};
