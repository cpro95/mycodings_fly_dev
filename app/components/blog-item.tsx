import type { getMdxListItems } from "~/utils/mdx.server";
import LinkOrAnchor from "./link-or-anchor";

type BlogItemType = Awaited<ReturnType<typeof getMdxListItems>>[0];

type contentDirectoryType = {
  contentDirectory: string;
};
type BlogItemType2 = BlogItemType & contentDirectoryType;

export default function BlogItem({
  description,
  slug,
  title,
  contentDirectory,
}: BlogItemType2) {
  return (
    <li className="py-4">
      <LinkOrAnchor
        to={`/${contentDirectory}/${slug}`}
        className="flex flex-col gap-2"
      >
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-50">
          {title}
        </h2>
        <p className="text-base text-gray-600 dark:text-gray-200">
          {description}
        </p>
        <div className="text-base font-bold text-gray-800 dark:text-gray-100">
          Read more
        </div>
      </LinkOrAnchor>
    </li>
  );
}
