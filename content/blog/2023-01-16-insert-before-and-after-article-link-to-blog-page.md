---
slug: 2023-01-16-insert-before-and-after-article-link-to-blog-page
title: Remix Speed Metal Stack 블로그에 다음 글 이전 글 링크 추가하기
date: 2023-01-16 02:01:25.019000+00:00
summary: Remix Speed Metal Stack 블로그에 다음 글 이전 글 링크 추가하기, 글 목록 링크도 추가하기
tags: ["remix", "speed-metal-stack", "before-article-link", "after-article-link"]
contributors: []
draft: false
---

안녕하세요?

오늘은 기존에 제 블로그 사이트를 어떻게 만들었는지 상세히 설명한 아래 두 개의 글에 이어 블로그 기능 개선을 추가해 볼까 합니다.

블로그 글을 읽다 보면 다른 글을 보고 싶을 때 친절하게 이전 글, 다음 글 링크가 밑에 나와 있으면 쉽게 다른 글을 클릭할 수 있게 유도할 수 있는데요.

제 블로그 시스템에는 그게 없어서 다시 전체 글 목록 리스트로 돌아가야 하는 불편함이 있었는데요.

오늘은 아래 그림처럼 이전 글, 다음 글, 글 목록 보기 기능을 추가해 보겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgxRnsbR2-_rDw50IGF32glsnla2_mJItkWjEzz58g8oa3CTYMuPlpGTJD4PYOO0lrkwYw2hM6mDHnFvtw5GsPHtRE3Qbg6dJHlABamTR6UPAtIhdB8XI333u-6ROFg4vhc32ur48RfHzHs33EEepsh5UCS-p-9Ag3mcKDaLB5Tc8sEW8K_mfvLvazB)
*(사진 설명) 다음 글, 이전 글, 목록 보기 구현한 실제 화면*

<br />

위와 같이 구현하는 게 오늘의 목표입니다.

---

## loader 함수에서 원하는 정보 불러오기

먼저, 이전 글과 다음 글에 대한 정보를 불러와야 하는데요.

Remix Framework에서는 loader 함수에서 서버 사이드 작업을 수행합니다.

일단 다음과 같이 `beforeAfterSlugList` 정보를 땡겨와야 하는데요.

```js
import { getBeforeAfterSlug } from '~/model/content.server'

...
...

export const loader: LoaderFunction = async ({ params }) => {
  const slug = params.slug
  invariant(typeof slug === 'string', 'Slug should be a string, and defined')

  const mdxPage = await getMdxPage({ contentDirectory: 'blog', slug })

  if (!mdxPage) {
    throw json(null, { status: 404 })
  }

  const beforeAfterSlugList = await getBeforeAfterSlug({
    slug,
    contentDirectory: 'blog',
  })

  return json(
    { mdxPage, beforeAfterSlugList },
    {
      headers: { 'cache-control': 'private, max-age: 60', Vary: 'Cookie' },
    },
  )
}
```

추가된 부분은 getBeforeAfterSlug 함수를 통해 원하는 블로그 리스트를 땡겨와야 합니다.

그리고 그걸 json 형태로 return 하면 클라이언트 사이드 쪽에서 받아서 화면에 뿌려주기만 하면 됩니다.

```js
import BeforeAfterLink from '~/components/before-after-link'

...
...

export default function Blog() {
  const { mdxPage, beforeAfterSlugList } = useLoaderData()
  const links = mdxPage.frontmatter.meta.keywords || []

  const Component = React.useMemo(
    () => getMDXComponent(mdxPage.code),
    [mdxPage],
  )

  return (
    <>
      <article className='prose prose-zinc mx-auto min-h-screen max-w-4xl dark:prose-invert lg:prose-lg'>
        <br />
        <Component />
        <KeywordsLink links={links} />
        <BeforeAfterLink
          beforeAfter={beforeAfterSlugList}
          contentDirectory='blog'
        />
        <Utterances />
      </article>
    </>
  )
}
```

UI 코드 부분은 간단합니다.

BeforeAfterLink라는 컴포넌트에 데이터를 전달해서 그 정보를 화면에 뿌려주면 됩니다.

---

## 서버 사이드 쪽 로직 구현하기

그럼 loader 함수에서 실행한 getBeforeAfterSlug 함수에 대해 구현해 볼까요?

app/model/content.server.ts 파일에 아래와 같이 getBeforeAfterSlug 함수를 추가하면 됩니다.

```js
export async function getBeforeAfterSlug({
  slug,
  contentDirectory,
}: {
  slug: string,
  contentDirectory: string,
}) {
  const contents = await db.content.findMany({
    where: { contentDirectory, published: true },
    select: {
      slug: true,
      title: true,
    },
    orderBy: { timestamp: 'desc' },
  })

  let targetSlugNumber = contents.findIndex(s => s.slug === slug)
  let totalSlugNumber = contents.length
  let page = Math.floor(targetSlugNumber / 10) + 1

  if (targetSlugNumber === 0) {
    return {
      before: contents[targetSlugNumber + 1],
      page: page,
      after: null,
    }
  } else if (targetSlugNumber === totalSlugNumber - 1) {
    return {
      before: null,
      page: page,
      after: contents[targetSlugNumber - 1],
    }
  } else {
    return {
      before: contents[targetSlugNumber + 1],
      page: page,
      after: contents[targetSlugNumber - 1],
    }
  }
}
```

제 블로그 글을 저장하는 DB에는 id가 난수 부분인데요.

그냥 1,2,3,4 이런 식이 아닙니다.

그래서 현재 읽고 있는 글이 어느 위치에 있는지 파악이 안 됩니다.

그래서 BlogList에서 기준으로 정한 timestampe: desc 정렬 방식에 의해 모든 slug, title을 가져와서 현재 글의 slug를 비교 분석해야 합니다.

이때 사용한 함수가 바로 findIndex 함수인데요.

```js
let targetSlugNumber = contents.findIndex(s => s.slug === slug)
```

위와 같이 하면 전체 contents라는 배열에서 원하는 항목의 인덱스 값을 얻을 수 있습니다.

그리고 page 부분도 10개씩 계산해서 정해주고,

targetSlugNumber 값의 앞뒤 글 목록을 리턴 해주면 끝입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjC_-LH8k5Nm-iCWa2BdGQ8tXl-ZW3GNL5RQuB58MFtxEnNMpoBV9F1FeIUlam90cWJddXQhuAWMGxcesH5Z0Fk67siZPLHrT8jJdzyIr6cHcSpce-EpeeUl1Nk9m4V5sqK5OjXfkUulIC8M-umq3QVgXCxv6ppsaxDhysqk5RXS05E1YdE_Bl5tTPh)
*(사진 설명) 다음 글, 이전 글 정보의 예*

<br />

위 그림에서 볼 수 있듯이 console.log 한 beforeAfterSlugList 값입니다.

사실 현재 글이 가장 최신 글이라 after 값이 null로 나옵니다.

다른 글을 조회하면 당연히 after 값도 제대로 나올 겁니다.

---

## BeforeAfterLink 컴포넌트 작성하기

이제 UI에 뿌려줘야 하는데요.

아래처럼 components 폴더에 해당 컴포넌트는 아래처럼 작성하면 됩니다.

```js
import LinkOrAnchor from './link-or-anchor'

type BeforeAfterSlugListType = {
  before: {
    slug: string
    title: string
  }
  page: string
  after: {
    slug: string
    title: string
  }
}

export default function BeforeAfterLink({
  beforeAfter,
  contentDirectory = 'blog',
}: {
  beforeAfter: BeforeAfterSlugListType
  contentDirectory: string
}) {
  const linkStyle =
    'text-gray-600 text-md font-medium items-center px-4 py-2 mb-2 dark:text-gray-300'
  return (
    <>
      <hr />
      <div className='flex flex-col flex-wrap'>
        {beforeAfter.after && (
          <LinkOrAnchor
            href={`/${contentDirectory}/${beforeAfter.after.slug}`}
            className={linkStyle}
          >
            다음 글 : {beforeAfter.after.title}
          </LinkOrAnchor>
        )}
        {beforeAfter.page && (
          <LinkOrAnchor
            href={`/${contentDirectory}?page=${beforeAfter.page}`}
            className={linkStyle}
          >
            목록 보기
          </LinkOrAnchor>
        )}
        {beforeAfter.before && (
          <LinkOrAnchor
            href={`/${contentDirectory}/${beforeAfter.before.slug}`}
            className={linkStyle}
          >
            이전 글 : {beforeAfter.before.title}
          </LinkOrAnchor>
        )}
      </div>
      <hr />
    </>
  )
}
```

UI 부분은 제 이전 글을 보셨다면 쉽게 이해할 수 있을 겁니다.

이제 이전 글, 다음 글, 글 목록 보기 링크 구현도 완성되었네요.

---

## my-pagination 로직 업데이트 하기

이번에 업데이트한 부분이 이전 글, 다음 글 보기만 있는 게 아니라 페이지네이션 로직도 업데이트했는데요.

components 폴더에 my-pagination.tsx 파일을 아래와 같이 다시 바꿔 봅시다.

```js
import { Link } from '@remix-run/react'

type PaginationType = {
  q: string
  page: number
  itemsPerPage: number
  total_pages: number
}

export default function MyPagination({
  q,
  page,
  itemsPerPage,
  total_pages,
}: PaginationType) {
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

  const linkStyle =
    'px-2 sm:px-4 py-1 sm:py-2 mx-1 sm:mx-1 text-gray-700 transition-colors duration-200 transform bg-white rounded-md sm:inline dark:bg-gray-900 dark:text-gray-200 hover:bg-blue-500 dark:hover:bg-blue-500 hover:text-white dark:hover:text-gray-200'

  const currentLinkStyle =
    'px-2 sm:px-4 py-1 sm:py-2 mx-1 sm:mx-1 text-gray-700 rounded-md sm:inline bg-blue-500 text-white dark:bg-blue-500 dark:text-gray-200'

  // 라이프 섹션에 아무것도 없을 때 에러 처리
  if (total_pages === 0) total_pages = 1
  
  return (
    <nav
      aria-label='Pagination'
      className='mt-4 mb-8 -ml-4 flex justify-evenly py-4 sm:justify-start'
    >
      <Link
        to={`?q=${q}&page=${
          page === 1 ? 1 : page - 1
        }&itemsPerPage=${itemsPerPage}`}
        className={linkStyle}
      >
        <span className='sr-only'>Previous</span>
        {leftArrow}
      </Link>

      {page === 3 ? (
        <Link
          to={`?q=${q}&page=1&itemsPerPage=${itemsPerPage}`}
          className={linkStyle}
        >
          1
        </Link>
      ) : (
        <></>
      )}

      {/* 처음 ... 보여주기 */}
      {page > 3 ? (
        <>
          <Link
            to={`?q=${q}&page=1&itemsPerPage=${itemsPerPage}`}
            className={linkStyle}
          >
            1
          </Link>
          <button disabled className={linkStyle}>
            ...
          </button>
        </>
      ) : (
        <></>
      )}

      {/* 이전 페이지인데 1페이지만 스킵 */}
      {page !== 1 ? (
        <Link
          to={`?q=${q}&page=${page - 1}&itemsPerPage=${itemsPerPage}`}
          className={linkStyle}
        >
          {page - 1}
        </Link>
      ) : (
        <></>
      )}

      {/* 현재 페이지 */}
      <Link
        to={`?q=${q}&page=${page}&itemsPerPage=${itemsPerPage}`}
        className={currentLinkStyle}
      >
        {page}
      </Link>

      {/* 다음 페이지인데 끝에서 두번째만 아니면 보여준다. */}
      {page < total_pages - 1 ? (
        <Link
          to={`?q=${q}&page=${page + 1}&itemsPerPage=${itemsPerPage}`}
          className={linkStyle}
        >
          {page + 1}
        </Link>
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
        <Link
          to={`?q=${q}&page=${total_pages}&itemsPerPage=${itemsPerPage}`}
          className={linkStyle}
        >
          {total_pages}
        </Link>
      ) : (
        <></>
      )}

      <Link
        to={`?q=${q}&page=${
          page === total_pages ? total_pages : page + 1
        }&itemsPerPage=${itemsPerPage}`}
        className={linkStyle}
      >
        <span className='sr-only'>Next</span>
        {rightArrow}
      </Link>
    </nav>
  )
}

```

<br />

![](https://blogger.googleusercontent.com/img/a/AVvXsEgQM_NqyOpV-F0ocSCGknEoVEjJ0eZDM7mvOypIT-ptQD-7ALBaG6bzxt4KV3DJ69cbvWc1nrmwzoJdX7PC3E67F16fgivtmR4PyYhCHXFdZobhCpCgWDSKSpYtzuAxbPd7JLCsR5fcAnPHWLm5osLi6uKSBQOg6POvFJm8opRil99kbzmPSrOIbaNR)
*(사진 설명) 페이지네이션 구현*

<br />

위와 같이 현재 페이지를 기준으로 앞뒤 페이지를 보여주고 항상 처음과 끝을 보여주는 로직으로 바꿨습니다.

만약 페이지 숫자가 100개 이상일 경우에는 조금 불편한데요.

제 블로그 글 숫자가 그만큼 커지려면 시간이 오래 걸릴 거 같아 그때 가서 생각해 보기로 했습니다.

그럼.


