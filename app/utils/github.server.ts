import nodepath from "path";
import { Octokit } from "@octokit/rest";
import { throttling } from "@octokit/plugin-throttling";
import { LRUCache } from "lru-cache";
import type { GitHubFile } from "~/types";

function getGHOwner() {
  // server side file must use nodejs env aka process.env
  return process.env.GITHUB_REPOSITORY?.split("/")[0] as string;
}

function getGHRepository() {
  // server side file must use nodejs env aka process.env
  return process.env.GITHUB_REPOSITORY?.split("/")[1] as string;
}

const MyOctokit = Octokit.plugin(throttling);

const octokit = new MyOctokit({
  auth: process.env.GITHUB_TOKEN as string,
  throttle: {
    onRateLimit: (retryAfter, options) => {
      console.warn(
        `Request quota exhausted for request ${options.method} ${options.url}. Retrying after ${retryAfter} seconds.`
      );
      return true; // Retry the request
    },
    onSecondaryRateLimit: (retryAfter: number, options) => {
      console.warn(
        `Secondary quota detected for request ${options.method} ${options.url}.`
      );
    },
  },
});

const cache = new LRUCache({
  max: 500,
  maxSize: 5000 * 2,
  ttl: 1000 * 60, // Updated option for time-to-live
  sizeCalculation: (value) => Buffer.byteLength(JSON.stringify(value)), // Updated option for calculating size
});

function cachify<TArgs extends {}, TReturn>(
  fn: (args: TArgs) => Promise<TReturn>
) {
  return async function (args: TArgs): Promise<TReturn> {
    if (cache.has(args)) {
      return cache.get(args) as TReturn;
    }
    const result = await fn(args);
    /*
        result != null은 null과 undefined를 모두 배제합니다.
        result !== undefined는 undefined만 배제합니다.
    */
    if (result != null) cache.set(args, result);
    return result;
  };
}

async function downloadDirectoryListImpl(path: string) {
  const { data } = await octokit.repos.getContent({
    owner: getGHOwner(),
    repo: getGHRepository(),
    path,
  });

  if (!Array.isArray(data)) {
    throw new Error(
      `GitHub should always return an array, not sure what happened for the path ${path}`
    );
  }

  return data;
}

async function downloadFileByShaImpl(sha: string) {
  const { data } = await octokit.request(
    "GET /repos/{owner}/{repo}/git/blobs/{file_sha}",
    {
      owner: getGHOwner(),
      repo: getGHRepository(),
      file_sha: sha,
    }
  );

  const encoding = data.encoding as Parameters<typeof Buffer.from>["1"];
  return Buffer.from(data.content, encoding).toString();
}

export const downloadFileBySha = cachify(downloadFileByShaImpl);

async function downloadFirstMdxFileImpl(
  list: Array<{ name: string; sha: string; type: string }>
) {
  const filesOnly = list.filter(({ type }) => type === "file");

  for (const extension of [".mdx", ".md"]) {
    const file = filesOnly.find(({ name }) => name.endsWith(extension));
    if (file) {
      return downloadFileBySha(file.sha);
    }
  }

  return null;
}

const downloadFirstMdxFile = cachify(downloadFirstMdxFileImpl);
export const downloadDirectoryList = cachify(downloadDirectoryListImpl);

async function downloadDirectoryImpl(path: string): Promise<Array<GitHubFile>> {
  const fileOrDirectoryList = await downloadDirectoryList(path);

  const results: Array<GitHubFile> = [];

  for (const fileOrDirectory of fileOrDirectoryList) {
    switch (fileOrDirectory.type) {
      case "file": {
        const content = await downloadFileBySha(fileOrDirectory.sha);
        results.push({ path: fileOrDirectory.path, content });
        break;
      }
      case "dir": {
        const fileList = await downloadDirectoryImpl(fileOrDirectory.path);
        results.push(...fileList);
        break;
      }
      default:
        throw new Error(
          `Unknown file type returned for the file ${fileOrDirectory.path}`
        );
    }
  }

  return results;
}

export const downloadDirectory = cachify(downloadDirectoryImpl);

export async function downloadMdxOrDirectory(relativePath: string) {
  const path = `content/${relativePath}`;

  const directory = nodepath.dirname(path);
  const basename = nodepath.basename(path);
  const nameWithoutExt = nodepath.parse(path).name;

  const directoryList = await downloadDirectoryList(directory);

  const potentials = directoryList.filter(({ name }) =>
    name.startsWith(basename)
  );
  const potentialDirectory = potentials.find(({ type }) => type === "dir");
  const exactMatch = potentials.find(
    ({ name }) => nodepath.parse(name).name === nameWithoutExt
  );

  const content = await downloadFirstMdxFile(
    exactMatch ? [exactMatch] : potentials
  );

  let entry = path;
  let files: Array<GitHubFile> = [];

  if (content) {
    entry =
      path.endsWith(".mdx") || path.endsWith(".md") ? path : `${path}.mdx`;
    files = [{ path: nodepath.join(path, "index.mdx"), content }];
  } else if (potentialDirectory) {
    entry = potentialDirectory.path;
    files = await downloadDirectory(path);
  }

  return { entry, files };
}
