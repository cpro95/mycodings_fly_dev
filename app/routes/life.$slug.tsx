import * as React from "react";
import type { Route } from "./+types/life.$slug";
import { getMDXComponent } from "mdx-bundler/client";
import { getMdxPage } from "~/utils/mdx.server";
import invariant from "tiny-invariant";

import styles from "highlight.js/styles/vs2015.min.css?url";

import MultiplexAds from "~/components/ads/multiplex-ads";
import { getBeforeAfterSlug } from "~/model/content.server";
import { data } from "react-router";
import ContentsAds from "~/components/ads/contents-ads";
import KeywordsLink from "~/components/keywords-link";
import BeforeAfterLink from "~/components/before-after-link";
import { siteConfig } from "~/utils/seo";
import Utterances from "~/components/utterances";

export const meta = ({ data }: Route.MetaArgs) => {
  const post = data?.mdxPage;

  if (!post)
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

  const { keywords = [] } = data.mdxPage.frontmatter.meta ?? {};

  const seoMeta = [
    { title: `${post?.title}` },
    { name: "description", content: `${post?.description}` },
    { name: "author", content: `${siteConfig.siteAuthor}` },
    { property: "article:author", content: `${siteConfig.siteAuthor}` },
    { property: "og:type", content: `article` },
    {
      property: "og:site_name",
      content: `${siteConfig.siteTitle}`,
    },
    { property: "og:title", content: `${post?.title}` },
    { property: "og:description", content: `${post?.description}` },
    {
      property: "og:url",
      content: `${siteConfig.siteUrl}/post/${post?.slug}`,
    },
    { name: "twitter:title", content: `${post?.title}` },
    {
      name: "twitter:description",
      content: `${post?.description}`,
    },
    {
      name: "twitter:url",
      content: `${siteConfig.siteUrl}/post/${post?.slug}`,
    },
    { name: "keywords", content: `${keywords.join(", ")}` },
  ];

  return seoMeta;
};

export const links: Route.LinksFunction = () => [
  { rel: "stylesheet", href: styles },
];

export const loader = async ({ params }: Route.LoaderArgs) => {
  const slug = params.slug;
  invariant(typeof slug === "string", "Slug should be a string, and defined");

  const mdxPage = await getMdxPage({ contentDirectory: "life", slug });

  if (!mdxPage) {
    throw data(null, { status: 404 });
  }

  const beforeAfterSlugList = await getBeforeAfterSlug({
    slug,
    contentDirectory: "life",
  });

  return data(
    { mdxPage, beforeAfterSlugList },
    {
      headers: { "cache-control": "private, max-age: 60", Vary: "Cookie" },
    }
  );
};

export default function Blog({ loaderData }: Route.ComponentProps) {
  const { mdxPage, beforeAfterSlugList } = loaderData;
  const { keywords = [] } = mdxPage.frontmatter.meta ?? {};

  const Component = React.useMemo(
    () => getMDXComponent(mdxPage.code),
    [mdxPage]
  );

  return (
    <>
      <article className="prose prose-zinc mx-auto min-h-screen max-w-4xl dark:prose-invert lg:prose-lg">
        <div className="mx-auto max-w-4xl">
          {/* 콘텐츠삽입광고 */}
          <ContentsAds />
          {/* 콘텐츠삽입광고 */}
        </div>
        <br />
        <br />
        <Component />
        <KeywordsLink keywords={keywords} contentDirectory="life" />
        <BeforeAfterLink
          beforeAfter={beforeAfterSlugList}
          contentDirectory="blog"
        />

        <div className="mx-auto max-w-4xl">
          {/* 멀티플렉스광고 */}
          <MultiplexAds />
          {/* 멀티플렉스광고 */}
        </div>
        <Utterances />
      </article>
    </>
  );
}
