import type { Route } from "./+types/[_content].refresh-content[.]json";
import { getContentState } from "~/model/content-state.server";

export const loader = async ({}: Route.LoaderArgs) => {
  const rows = await getContentState();
  const returnedData = rows || {};

  return new Response(JSON.stringify(returnedData), {
    headers: {
      "content-length": Buffer.byteLength(
        JSON.stringify(returnedData)
      ).toString(),
    },
  });
};
