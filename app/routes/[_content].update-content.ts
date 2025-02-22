import type { Route } from "./+types/[_content].update-content";
import nodepath from "path";
import { refreshAllContent, setRequiresUpdate } from "~/model/content.server";
import { getMdxListItems } from "~/utils/mdx.server";
import { setContentSHA } from "~/model/content-state.server";
import { data } from "react-router";

type Body = {
  refreshAll?: boolean;
  paths?: Array<string>;
  sha: string;
};

export const action = async ({ request }: Route.ActionArgs) => {
  // console.log(
  //   "아래 REFRESH_TOKEN는 Fly.io의 secrets에 의해 지정된다."
  // );
  if (request.headers.get("auth") !== process.env.REFRESH_TOKEN) {
    return data({ message: "Not Authorised" }, { status: 401 });
  }

  const body = (await request.json()) as Body;

  if ("refreshAll" in body && body.refreshAll === true) {
    await refreshAllContent();
    void getMdxListItems({
      contentDirectory: "blog",
      page: 1,
      itemsPerPage: 100000,
    });
    void getMdxListItems({
      contentDirectory: "life",
      page: 1,
      itemsPerPage: 100000,
    });

    console.log(`🌀 Refreshing all contents. SHA: ${body.sha}`);

    return data(
      { message: "refreshing all contents" },
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  if ("paths" in body && Array.isArray(body.paths)) {
    const refreshPaths = [];
    for (const path of body.paths) {
      const [contentDirectory, dirOrFile] = path.split("/");
      if (!contentDirectory || !dirOrFile) {
        continue;
      }
      const slug = nodepath.parse(dirOrFile).name;
      await setRequiresUpdate({ slug, contentDirectory });

      refreshPaths.push(path);
    }
    if (refreshPaths.some((p) => p.startsWith("blog"))) {
      void getMdxListItems({
        contentDirectory: "blog",
        page: 1,
        itemsPerPage: 100000,
      });
    }
    if (refreshPaths.some((p) => p.startsWith("life"))) {
      void getMdxListItems({
        contentDirectory: "life",
        page: 1,
        itemsPerPage: 100000,
      });
    }
    if ("sha" in body) {
      void setContentSHA(body.sha);
    }

    console.log("💿 Updating content", {
      sha: body.sha,
      refreshPaths,
      message: "refreshing content paths",
    });

    return new Response(
      JSON.stringify({
        sha: body.sha,
        refreshPaths,
        message: "refreshing content paths",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return data({ message: "no action" }, { status: 400 });
};
