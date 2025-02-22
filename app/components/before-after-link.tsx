import LinkOrAnchor from "./link-or-anchor";

type BeforeAfterSlugListType = {
  before: {
    slug: string;
    title: string;
  } | null;
  page: number;
  after: {
    slug: string;
    title: string;
  } | null;
};

export default function BeforeAfterLink({
  beforeAfter,
  contentDirectory = "blog",
}: {
  beforeAfter: BeforeAfterSlugListType;
  contentDirectory: string;
}) {
  const linkStyle =
    "text-gray-600 text-md font-medium items-center px-4 py-2 mb-2 dark:text-gray-300";
  return (
    <>
      <hr />
      <div className="flex flex-col flex-wrap">
        {beforeAfter.after && (
          <LinkOrAnchor
            to={`/${contentDirectory}/${beforeAfter.after.slug}`}
            className={linkStyle}
          >
            다음 글 : {beforeAfter.after.title}
          </LinkOrAnchor>
        )}
        {beforeAfter.page && (
          <LinkOrAnchor
            to={`/${contentDirectory}?page=${beforeAfter.page}`}
            className={linkStyle}
          >
            목록 보기
          </LinkOrAnchor>
        )}
        {beforeAfter.before && (
          <LinkOrAnchor
            to={`/${contentDirectory}/${beforeAfter.before.slug}`}
            className={linkStyle}
          >
            이전 글 : {beforeAfter.before.title}
          </LinkOrAnchor>
        )}
      </div>
      <hr />
    </>
  );
}
