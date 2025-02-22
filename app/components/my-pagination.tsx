import { ArrowLeft, ArrowRight } from "lucide-react";
import LinkOrAnchor from "./link-or-anchor";

type PaginationType = {
  q: string | null;
  page: number;
  total_pages: number;
};

export default function MyPagination({ q, page, total_pages }: PaginationType) {
  const linkStyle =
    "px-2 sm:px-4 py-1 sm:py-2 mx-1 sm:mx-1 text-gray-700 transition-colors duration-200 transform bg-white rounded-md sm:inline dark:bg-gray-900 dark:text-gray-200 hover:bg-blue-500 dark:hover:bg-blue-500 hover:text-white dark:hover:text-gray-200";

  const currentLinkStyle =
    "px-2 sm:px-4 py-1 sm:py-2 mx-1 sm:mx-1 text-gray-700 rounded-md sm:inline bg-blue-500 text-white dark:bg-blue-500 dark:text-gray-200";

  // 라이프 섹션에 아무것도 없을 때 에러 처리
  if (total_pages === 0) total_pages = 1;

  return (
    <nav
      aria-label="Pagination"
      className="mt-4 mb-8 -ml-4 flex justify-evenly py-4 sm:justify-start"
    >
      <LinkOrAnchor
        to={`?${q !== null ? `q=${q}&` : ""}page=${page === 1 ? 1 : page - 1}`}
        className={linkStyle}
      >
        <span className="sr-only">Previous</span>
        <ArrowLeft />
      </LinkOrAnchor>

      {page === 3 ? (
        <LinkOrAnchor
          to={`?${q !== null ? `q=${q}&` : ""}page=1`}
          className={linkStyle}
        >
          1
        </LinkOrAnchor>
      ) : (
        <></>
      )}

      {/* 처음 ... 보여주기 */}
      {page > 3 ? (
        <>
          <LinkOrAnchor
            to={`?${q !== null ? `q=${q}&` : ""}page=1`}
            className={linkStyle}
          >
            1
          </LinkOrAnchor>
          <button disabled className={linkStyle}>
            ...
          </button>
        </>
      ) : (
        <></>
      )}

      {/* 이전 페이지인데 1페이지만 스킵 */}
      {page !== 1 ? (
        <LinkOrAnchor
          to={`?${q !== null ? `q=${q}&` : ""}page=${page - 1}`}
          className={linkStyle}
        >
          {page - 1}
        </LinkOrAnchor>
      ) : (
        <></>
      )}

      {/* 현재 페이지 */}
      <LinkOrAnchor
        to={`?${q !== null ? `q=${q}&` : ""}page=${page}`}
        className={currentLinkStyle}
      >
        {page}
      </LinkOrAnchor>

      {/* 다음 페이지인데 끝에서 두번째만 아니면 보여준다. */}
      {page < total_pages - 1 ? (
        <LinkOrAnchor
          to={`?${q !== null ? `q=${q}&` : ""}page=${page + 1}`}
          className={linkStyle}
        >
          {page + 1}
        </LinkOrAnchor>
      ) : (
        <></>
      )}

      {/* 마지막 ... 보여주기 */}
      {page < total_pages - 2 ? (
        <button disabled className={linkStyle}>
          ...
        </button>
      ) : (
        <></>
      )}

      {/* 마지막 페이지 보여주기 */}
      {page !== total_pages ? (
        <LinkOrAnchor
          to={`?${q !== null ? `q=${q}&` : ""}page=${total_pages}`}
          className={linkStyle}
        >
          {total_pages}
        </LinkOrAnchor>
      ) : (
        <></>
      )}

      <LinkOrAnchor
        to={`?${q !== null ? `q=${q}&` : ""}page=${
          page === total_pages ? total_pages : page + 1
        }`}
        className={linkStyle}
      >
        <span className="sr-only">Next</span>
        <ArrowRight />
      </LinkOrAnchor>
    </nav>
  );
}
