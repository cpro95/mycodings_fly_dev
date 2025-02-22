import type { Route } from "./+types/life";
import BlogList from "~/components/blog-list";
import { getMdxListItems, getMdxListItemsWithQ } from "~/utils/mdx.server";
import {
  getFrontmatterList,
  getMdxCount,
  getMdxCountWithQ,
} from "~/model/content.server";

import MultiplexAds from "~/components/ads/multiplex-ads";
import InfeedAds from "~/components/ads/infeed-ads";
import { data } from "react-router";
import BestTags from "~/components/best-tags";
import MyPagination from "~/components/my-pagination";
import SearchForm from "~/components/search-form";
import { siteConfig } from "~/utils/seo";

export function meta({}: Route.MetaArgs) {
  return [
    { title: `${siteConfig.siteTitle}` },
    { name: "description", content: `${siteConfig.siteDescription}` },
    { name: "author", content: `${siteConfig.siteAuthor}` },
    { property: "article:author", content: `${siteConfig.siteAuthor}` },
    { property: "og:type", content: `article` },
    {
      property: "og:site_name",
      content: `${siteConfig.siteTitle}`,
    },
    { property: "og:title", content: `${siteConfig.siteTitle}` },
    { property: "og:description", content: `${siteConfig.siteDescription}` },
    {
      property: "og:url",
      content: `${siteConfig.siteUrl}`,
    },
    { name: "twitter:title", content: `${siteConfig.siteTitle}}` },
    {
      name: "twitter:description",
      content: `${siteConfig.siteDescription}`,
    },
    {
      name: "twitter:url",
      content: `${siteConfig.siteUrl}`,
    },
  ];
}

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const page = Number(url.searchParams.get("page")) || 1;
  const itemsPerPage = siteConfig.perPage;

  let blogList;
  let blogCount;

  if (q === null) {
    blogList = await getMdxListItems({
      contentDirectory: "life",
      page: page,
      itemsPerPage: itemsPerPage,
    });
    blogCount = await getMdxCount("life");
  } else {
    blogList = await getMdxListItemsWithQ({
      contentDirectory: "life",
      q: q,
      page: page,
      itemsPerPage: itemsPerPage,
    });
    blogCount = await getMdxCountWithQ("life", q);
  }

  const allFrontmatterList = await getFrontmatterList("life");

  let Pool = new Map<string, number>();

  allFrontmatterList.map((af) =>
    JSON.parse(af.frontmatter).meta.keywords.map((k: any) =>
      Pool.set(k, Pool.has(k) ? Pool.get(k)! + 1 : 1)
    )
  );

  const sortedPool = new Map([...Pool].sort((a, b) => b[1] - a[1]));
  const bestPool = new Map([...sortedPool].filter((a) => a[1] > 2));
  const arrayOfBestPool: Array<string> = [...bestPool.keys()];

  return data(
    {
      blogList,
      blogCount,
      arrayOfBestPool: arrayOfBestPool.slice(0, 6),
      q,
      page,
    },
    {
      headers: { "cache-control": "private, max-age=60", Vary: "Cookie" },
    }
  );
};

export default function Life({ loaderData }: Route.ComponentProps) {
  const { blogList, blogCount, arrayOfBestPool, q, page } = loaderData;

  const itemsPerPage = siteConfig.perPage;

  return (
    <section className="mx-auto max-w-4xl pt-8">
      <BestTags bestTags={arrayOfBestPool} />
      <SearchForm method="GET" action="." />

      <div className="mt-2 max-w-lg">
        {/* 인피드광고 */}
        <InfeedAds />
        {/* 인피드광고 */}
      </div>

      <BlogList blogList={blogList} contentDirectory="life" />
      <MyPagination
        q={q}
        page={page}
        total_pages={Math.ceil(Number(blogCount) / itemsPerPage)}
      />
      <div className="mx-auto max-w-4xl">
        {/* 멀티플렉스광고 */}
        <MultiplexAds />
        {/* 멀티플렉스광고 */}
      </div>
    </section>
  );
}
