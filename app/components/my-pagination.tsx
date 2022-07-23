import { Link } from '@remix-run/react'

type PaginationType = {
  page: number
  itemsPerPage: number
  total_pages: number
}

export default function MyPagination({
  page,
  itemsPerPage,
  total_pages,
}: PaginationType) {
  const leftDoubleArrow = (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className='h-5 w-5'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      strokeWidth='2'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M11 19l-7-7 7-7m8 14l-7-7 7-7'
      />
    </svg>
  )

  const leftArrow = (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className='h-5 w-5'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      strokeWidth='2'
    >
      <path strokeLinecap='round' strokeLinejoin='round' d='M15 19l-7-7 7-7' />
    </svg>
  )

  const rightArrow = (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className='h-5 w-5'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      strokeWidth='2'
    >
      <path strokeLinecap='round' strokeLinejoin='round' d='M9 5l7 7-7 7' />
    </svg>
  )

  const rightDoubleArrow = (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className='h-5 w-5'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      strokeWidth='2'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M13 5l7 7-7 7M5 5l7 7-7 7'
      />
    </svg>
  )

  const linkStyle =
    'px-2 sm:px-4 py-1 sm:py-2 sm:mx-1 text-gray-700 transition-colors duration-200 transform bg-white rounded-md sm:inline dark:bg-gray-900 dark:text-gray-200 hover:bg-blue-500 dark:hover:bg-blue-500 hover:text-white dark:hover:text-gray-200'

  return (
    <nav aria-label='Pagination' className='mt-4 mb-8 flex py-4'>
      <Link
        to={`?page=${1}&itemsPerPage=${itemsPerPage}`}
        className={linkStyle}
      >
        <span className='sr-only'>First</span>
        {leftDoubleArrow}
      </Link>

      <Link
        to={`?page=${page === 1 ? 1 : page - 1}&itemsPerPage=${itemsPerPage}`}
        className={linkStyle}
      >
        <span className='sr-only'>Previous</span>
        {leftArrow}
      </Link>
      {page === 1 ? (
        <></>
      ) : (
        <>
          <Link
            to={`?page=${page - 1}&itemsPerPage=${itemsPerPage}`}
            aria-current='page'
            className={linkStyle}
          >
            {page - 1}
          </Link>
        </>
      )}
      <Link
        to={`?page=${page}&itemsPerPage=${itemsPerPage}`}
        aria-current='page'
        className={linkStyle}
      >
        {page}
      </Link>
      {page === total_pages ? (
        <></>
      ) : (
        <Link
          to={`?page=${page + 1}&itemsPerPage=${itemsPerPage}`}
          className={linkStyle}
        >
          {page + 1}
        </Link>
      )}

      {page < total_pages - 3 ? (
        <>
          <button disabled className={linkStyle}>
            ...
          </button>

          <Link
            to={`?page=${total_pages - 1}&itemsPerPage=${itemsPerPage}`}
            className={linkStyle}
          >
            {total_pages - 1}
          </Link>

          <Link
            to={`?page=${total_pages}&itemsPerPage=${itemsPerPage}`}
            className={linkStyle}
          >
            {total_pages}
          </Link>
        </>
      ) : (
        <></>
      )}

      <Link
        to={`?page=${
          page === total_pages ? total_pages : page + 1
        }&itemsPerPage=${itemsPerPage}`}
        className={linkStyle}
      >
        <span className='sr-only'>Next</span>
        {rightArrow}
      </Link>

      <Link
        to={`?page=${total_pages}&itemsPerPage=${itemsPerPage}`}
        className={linkStyle}
      >
        <span className='sr-only'>Last</span>
        {rightDoubleArrow}
      </Link>
    </nav>
  )
}
