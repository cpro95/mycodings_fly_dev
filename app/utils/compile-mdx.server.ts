import { bundleMDX } from "mdx-bundler";
import type { GitHubFile } from "~/types";
import { getQueue } from "./p-queue.server";

async function compileMdxImpl<FrontmatterType extends Record<string, unknown>>({
  slug,
  files,
}: {
  slug: string;
  files: Array<GitHubFile>;
}) {
  // prettier-ignore
  // const { default: remarkAutolinkHeader } = await import("remark-autolink-headings");
  // const { default: remarkSlug } = await import("remark-slug");
  const { default: rehypeAutolinkHeadings } = await import("rehype-autolink-headings");
  const { default: remarkGfm } = await import("remark-gfm");
  const { default: rehypeSlug } = await import("rehype-slug");
  const { default: rehypeHighlight } = await import("rehype-highlight");

  const indexPattern = /index.mdx?$/;
  const indexFile = files.find(({ path }) => path.match(indexPattern));
  if (!indexFile) {
    return null;
  }

  const rootDir = indexFile.path.replace(indexPattern, "");
  const relativeFiles = files.map(({ path, content }) => ({
    path: path.replace(rootDir, "./"),
    content,
  }));

  const filesObject = arrayToObject(relativeFiles, {
    keyname: "path",
    valuename: "content",
  });

  try {
    const { code, frontmatter } = await bundleMDX({
      source: indexFile.content,
      files: filesObject,
      mdxOptions: (options) => ({
        remarkPlugins: [
          ...(options.remarkPlugins ?? []),
          remarkGfm, // remark 플러그인만 여기에 둡니다.
        ],
        rehypePlugins: [
          ...(options.rehypePlugins ?? []),
          rehypeSlug, // 👈 이쪽으로 이동
          [rehypeAutolinkHeadings, { behavior: "wrap" }], // 👈 이쪽으로 이동
          rehypeHighlight,
        ],
      }),
    });

    return { code, frontmatter: frontmatter as FrontmatterType };
  } catch (e) {
    // 1. 터미널에 상세 에러를 즉시 출력해서 개발자가 바로 볼 수 있게 합니다.
    console.error(`\n--- MDX Compilation Error for slug: "${slug}" ---`);
    console.error(e);
    console.error(`--- End of MDX Compilation Error ---\n`);

    // 2. 원본 에러를 포함하여 새로운 에러를 던져서,
    //    스택 트레이스나 다른 에러 처리 시스템에서도 원인을 놓치지 않게 합니다.
    throw new Error(`MDX Compilation failed for ${slug}`, { cause: e });
  }
}

function arrayToObject<Item extends Record<string, unknown>>(
  array: Array<Item>,
  { keyname, valuename }: { keyname: keyof Item; valuename: keyof Item }
) {
  const obj: Record<string, Item[keyof Item]> = {};

  for (const item of array) {
    const key = item[keyname];
    if (typeof key !== "string") {
      throw new Error(`Type of ${key} should be a string`);
    }
    const value = item[valuename];
    obj[key] = value;
  }

  return obj;
}

async function queuedCompileMdx<
  FrontmatterType extends Record<string, unknown>
>(...params: Parameters<typeof compileMdxImpl>) {
  const queue = await getQueue();

  const result = await queue.add(() =>
    compileMdxImpl<FrontmatterType>(...params)
  );

  return result;
}

export { queuedCompileMdx as compileMdx };
