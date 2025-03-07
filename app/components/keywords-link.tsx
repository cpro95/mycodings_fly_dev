import LinkOrAnchor from "./link-or-anchor";

export default function KeywordsLink({
  keywords,
  contentDirectory = "blog",
}: {
  keywords: Array<string>;
  contentDirectory: string;
}) {
  const linkStyle =
    "bg-gray-100 text-gray-800 text-md font-medium items-center px-4 py-2 rounded mr-2 mb-2 dark:bg-gray-700 dark:text-gray-300 focus:bg-blue-300 hover:bg-blue-100 focus:dark:bg-cyan-700 hover:dark:bg-cyan-600";
  return (
    <>
      <div className="flex flex-row flex-wrap" role="group">
        {keywords ? (
          keywords.map((b: any) => (
            <LinkOrAnchor
              to={`/${contentDirectory}?q=${encodeURIComponent(b)}`}
              className={linkStyle}
              key={b}
            >
              {b}
            </LinkOrAnchor>
          ))
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
