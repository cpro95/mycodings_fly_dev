import type { getMdxListItems } from "~/utils/mdx.server";
import BlogItem from "./blog-item";

type BlogListType = Awaited<ReturnType<typeof getMdxListItems>>;

export default function BlogList({
  blogList,
  contentDirectory,
}: {
  blogList: BlogListType;
  contentDirectory: string;
}) {
  return (
    <ol className="flex flex-col">
      {blogList.map((blogItem) => (
        <BlogItem
          key={blogItem.slug}
          contentDirectory={contentDirectory}
          {...blogItem}
        />
      ))}
    </ol>
  );
}
