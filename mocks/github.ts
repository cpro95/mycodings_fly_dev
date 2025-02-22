import nodepath from "path";
import fs from "fs-extra";
import { http, HttpResponse } from "msw";

async function isDirectory(d: any) {
  try {
    return (await fs.lstat(d)).isDirectory();
  } catch {
    return false;
  }
}
async function isFile(d: any) {
  try {
    return (await fs.lstat(d)).isFile();
  } catch {
    return false;
  }
}

export const GitHubMocks = [
  http.get(
    "https://api.github.com/repos/:owner/:repo/contents/:path",
    async ({ params }) => {
      const { owner, repo } = params;

      if (typeof params.path !== "string") {
        throw new Error("Path should be a string");
      }
      const path = decodeURIComponent(params.path).trim();

      console.log(`mock process1 ${process.env.GITHUB_REPOSITORY}`);
      if (
        `${owner}/${repo}` !== process.env.GITHUB_REPOSITORY ||
        !path.startsWith("content")
      ) {
        throw new Error(
          `Trying to fetch resource for unmockable resource: ${owner}/${repo}/${path}`
        );
      }

      const localPath = nodepath.resolve(process.cwd(), path);
      const isLocalDir = await isDirectory(localPath);
      const isLocalFile = await isFile(localPath);

      if (!isLocalDir && !isLocalFile) {
        // return an empty array when there are no blogs inside content/blogs
        return HttpResponse.json([], { status: 200 });
      }

      if (isLocalFile) {
        const file = fs.readFileSync(localPath, { encoding: "utf-8" });
        const encoding = "base64";

        return HttpResponse.json(
          {
            content: Buffer.from(file, "utf-8").toString(encoding),
            encoding,
          },
          { status: 200 }
        );
      }

      const dirList = await fs.readdir(localPath);

      const dirContent = await Promise.all(
        dirList.map(async (name) => {
          const relativePath = nodepath.join(path, name);
          const sha = relativePath;
          const fullPath = nodepath.resolve(process.cwd(), relativePath);
          const isDir = await isDirectory(fullPath);

          return {
            name,
            path: relativePath,
            sha,
            type: isDir ? "dir" : "file",
          };
        })
      );

      return HttpResponse.json(dirContent, { status: 200 });
    }
  ),
  http.get(
    "https://api.github.com/repos/:owner/:repo/git/blobs/:sha",
    async ({ params }) => {
      const { repo, owner } = params;

      if (typeof params.sha !== "string") {
        throw new Error("sha should be a string");
      }
      const sha = decodeURIComponent(params.sha).trim();

      console.log(`mock process2 ${process.env.GITHUB_REPOSITORY}`);

      if (`${owner}/${repo}` !== process.env.GITHUB_REPOSITORY) {
        throw new Error(
          `Trying to fetch resource for unmockable resource: ${owner}/${repo}`
        );
      }

      if (!sha.includes("/")) {
        throw new Error(`No mockable data found for the given sha: ${sha}`);
      }

      const fullPath = nodepath.resolve(process.cwd(), sha);

      const encoding = "base64";

      try {
        if (!fs.existsSync(fullPath)) {
          return HttpResponse.json(
            { error: "File not found", sha },
            { status: 404 }
          );
        }

        const content = fs.readFileSync(fullPath, { encoding: "utf-8" });

        return HttpResponse.json(
          {
            sha,
            content: Buffer.from(content, "utf-8").toString(encoding),
            encoding,
          },
          { status: 200 }
        );
      } catch (error: any) {
        console.error("Error reading file:", error);
        return HttpResponse.json(
          { error: "Internal Server Error", details: error.message },
          { status: 500 }
        );
      }
    }
  ),
  http.get(
    "https://api.github.com/repos/:owner/:repo/contents/*", // `*` 사용하여 전체 경로 매칭
    async ({ request, params }) => {
      const { owner, repo } = params;

      // URL에서 직접 경로 추출 (params.path 대신 request.url 사용)
      const url = new URL(request.url);
      const encodedPath = url.pathname.split("/contents/")[1] || "";
      const decodedPath = decodeURIComponent(encodedPath).trim();

      console.log(
      `mock process 3 GITHUB_REPOSITORY: ${process.env.GITHUB_REPOSITORY}`
      );

      if (!process.env.GITHUB_REPOSITORY) {
        throw new Error("GITHUB_REPOSITORY is not defined");
      }

      if (
        `${owner}/${repo}` !== process.env.GITHUB_REPOSITORY ||
        !decodedPath.startsWith("content")
      ) {
        throw new Error(
          `Trying to fetch resource for unmockable resource: ${owner}/${repo}/${decodedPath}`
        );
      }

      const fullPath = nodepath.resolve(process.cwd(), decodedPath);

      if (!fs.existsSync(fullPath)) {
        return HttpResponse.json({ error: "File not found" }, { status: 404 });
      }

      const content = fs.readFileSync(fullPath, { encoding: "utf-8" });
      const encoding = "base64";

      return HttpResponse.json(
        {
          sha: decodedPath,
          content: Buffer.from(content, "utf-8").toString(encoding),
          encoding,
        },
        { status: 200 }
      );
    }
  ),
  http.get(
    "https://api.github.com/repos/:owner/:repo/git/blobs/*", // `*` 사용하여 전체 경로 매칭
    async ({ request, params }) => {
      const { owner, repo } = params;

      // URL에서 직접 경로 추출 (params.path 대신 request.url 사용)
      const url = new URL(request.url);
      const encodedPath = url.pathname.split("/blobs/")[1] || "";
      const decodedPath = decodeURIComponent(encodedPath).trim();

      console.log(
        `mock process 4 GITHUB_REPOSITORY: ${process.env.GITHUB_REPOSITORY}`
      );

      if (!process.env.GITHUB_REPOSITORY) {
        throw new Error("GITHUB_REPOSITORY is not defined");
      }

      if (
        `${owner}/${repo}` !== process.env.GITHUB_REPOSITORY ||
        !decodedPath.startsWith("content")
      ) {
        throw new Error(
          `Trying to fetch resource for unmockable resource: ${owner}/${repo}/${decodedPath}`
        );
      }

      const fullPath = nodepath.resolve(process.cwd(), decodedPath);

      if (!fs.existsSync(fullPath)) {
        return HttpResponse.json({ error: "File not found" }, { status: 404 });
      }

      const content = fs.readFileSync(fullPath, { encoding: "utf-8" });
      const encoding = "base64";

      return HttpResponse.json(
        {
          sha: decodedPath,
          content: Buffer.from(content, "utf-8").toString(encoding),
          encoding,
        },
        { status: 200 }
      );
    }
  ),
];
