---
slug: 2022-08-06-add-page-nav-and-search-form-and-keywords-in-remix-speed-metal-stack
title: Remix Speed Metal Stack 블로그에 페이지 내비게이션, 검색창, 키워드 달기
date: 2022-08-06 00:36:41.981000+00:00
summary: Remix Speed Metal Stack 블로그에 페이지 내비게이션과 검색창 추가, 주요 키워드 방식 검색 추가
tags: ["remix", "speed-metal-stack", "page-nav", "search", "keyword"]
contributors: []
draft: false
---

안녕하세요?

지난 시간에는 Remix 프레임워크의 Speed Metal Stack을 통해 블로그 만들기 편을 올렸는데요.

Speed Metal Stack은 전체적인 구조만 보여주는 스택이라 세부적으로는 블로그 시스템과 맞지 않는 부분이 많습니다.

먼저, 블로그가 10개, 20개씩 쌓이면 한 페이지에 모두 다 나오는데요.

그러고 나서 또 한 가지 문제는 검색을 할 수가 없다는 겁니다.

또한 베스트 키워드 보여주기 등 핫한 아이템을 보여줄 수가 없는데요.

오늘은 지난 시간에 만든 블로그에 페이지 내비게이션 달기, 검색창 추가, 그리고 베스트 키워드 보여주는 걸 추가해서 설명드리겠습니다.

완성형을 보여드릴게요.

먼저, 페이지 내비게이션입니다.

![mycodings.fly.dev-add-page-nav-and-search-form-and-keywords-in-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEhj9w4G2KRmMXJ71A2fHyENoXfTuUSoeXxlhA4FbyopKf0ozmSnowuuLGxHSB32tOD5WKaqDRtjnd9dt3aAZv_rk9wdQWQhNZSYOgOsLEcuWo3kx5a1GZQaxI6QktiODyPfdn-lB2YNfVBbm0Z8ibBEVl054BdTHkoPojQuhTtGVYzSlTF8uKrv_D0D=s16000)

두 번째, 검색창입니다.

![mycodings.fly.dev-add-page-nav-and-search-form-and-keywords-in-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEhCPhK4B-bIaKA7yxkxkDUOual2PAT1ALQzZvvTT9P8yym_G9miupTerfWHN04YL_pi6ey3R8lwhdRzDxbyOyirIIN96SjCWbFIEfkEn8vgJk8QjQJgUq-6EEnfVnt-MUaYjikuj9xk6pczLz7OQsYNwr5kx241KQBTW2-k6IbrgN_9f2l100NMPgMR=s16000)

세 번째, 베스트 키워드 보여주기입니다.

![mycodings.fly.dev-add-page-nav-and-search-form-and-keywords-in-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEj-wmM82RntoP4HTfhRPLChAXjUefZzUaJJFR3fIg8zHKTmmKPIp-DIz-kxSm1VoTVUPcy9P5mwoXXeYpm_Euzbma5nvfQPk9SQIIZK6Pr79_I5tRFu0CSlpy3akW2Q9VDK2sUQRXNT2ykc3DvzUCIYULNaz2LXUxz3WrUeDWRMIA0b-ssVqWXKqyVg=s16000)

---

## 사전 준비

먼저, 기존에 만들었던 블로그 한 개를 가짜 페이지로 계속 복사를 해야 합니다.

한 페이지에 10개씩 나오게 하는데 목표인데요.

그래서 블로그 글 개수가 11개 이상은 되어야 합니다.

폴더 트리에서 `content/blog`에 들어가셔서 터미널에서 `cp` 명령어로 가짜 블로그 글을 계속 만들어 줍시다.

![mycodings.fly.dev-add-page-nav-and-search-form-and-keywords-in-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEiIT1zrZVOYmctyjAHvqYK7751EDpiCVxqQYsRGPWlf2wfZja1JMdZ9-6F5oNSSOSx61bjjZLwS9oBg0fOTBHsYR9ZwFDGvaq9KATSQ4hphypF-mRlap-PVxcL5GkNEFeETQbWiYfprBLo-PDQsdcDfbRruBXN4FVhWqlUvw0GXJikVphbqyyBxrUsg=s16000)

그리고 가짜로 만든 블로그 mdx 파일을 하나씩 불려 들어서 각각 내용이 틀리게 하는 게 나중에 검색창 만들 때 좋습니다.

```js
---
slug: test06
title: test06
date: 2022-08-05T11:23:11.527Z
description: test06
meta:
  keywords:
    - speed-metal-stack
    - next.js
published: true
---

# test06

안녕하세요?

test06
```

위와 같이 slug, title, description, 본문 내용도 각각 다르게 만들어 주시고요.

그리고 keywords 부분에 몇 개씩 다르게 여러분이 관심 갖는 주제를 넣어주시기 바랍니다.

그래서 블로그 글 중에서 키워드가 여러 번 중복되면 그 키워드가 인기가 많다고 나중에 베스트 키워드로 보여주게 되거든요.

저는 'react', 'remix', 'next.js', 'javascript', 'typescipt', 'speed-metal-stack' 등 여러 가지 키워드를 몇 개씩만 중복되게 넣었습니다.

이제 준비가 다 끝났네요.

'npm run dev'를 통해 개발 서버를 돌려 볼까요?

![mycodings.fly.dev-add-page-nav-and-search-form-and-keywords-in-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEhCjH9Eso64B47HWcS7TW7xT5fTAGgGIovmIn0wRMybp_JDDZGcbxZWONi-md2HtbQ33aiky1ZrWcn_3U6b1VcLUUiS1dlFIKyi4mqk1W924vQ-aENNQ0Hpivi33Y8QnjejHCYBqzkMOlSeo0SkPuIh43ejywBpvwsuMC-3vMqzwU0H1rdc11EezQOo=s16000)

여러 개의 블로그 글이 있는 게 보이실 겁니다.

참고로 메인 페이지는 loader 함수 마지막쯤에 아래 코드로 인해 블로그를 10개만 보여주게 되어 있습니다.

'app/routes/index.tsx'
```js
   return json<LoaderData>(
    { blogList: blogList.slice(0, 10) },
    { headers: { 'cache-control': 'private, max-age=60' } },
  )
```

---

## 페이지 내비게이션과 검색창 달기

그럼 본격적으로 `app/routes/blog.tsx` 파일을 수정해 보겠습니다.

```js
export const loader: LoaderFunction = async () => {
  const blogList = await getMdxListItems({ contentDirectory: 'blog' })

  return json<LoaderData>(
    { blogList },
    {
      headers: { 'cache-control': 'private, max-age=60', Vary: 'Cookie' },
    },
  )
}

export default function Blog() {
  const { blogList } = useLoaderData<LoaderData>()

  return (
    <section className='mx-auto min-h-screen max-w-4xl pt-24'>
      <BlogList blogList={blogList} />
    </section>
  )
}
```

'app/routes/blog.tsx'이 바로 주소가 'http://localhost:3000/blog'가 됩니다.

위 코드에서 보면 서버사이드 함수인 loader() 함수에서 getMdxListItems() 함수를 통해 blogList를 통째로 가져오는데요.

그걸 loader() 함수가 blogList라고 json 형태로 리턴하면,

클라이언트 사이드 쪽인 Blog() 컴포넌트에서는 useLoaderData() 함수를 통해 또다시 blogList 변수에 전달해서 그리고 그걸 `<BlogList>` 컴포넌트를 통해 브라우저에 보여주게 됩니다.

일단 페이지 내비게이션과 검색창을 추가해 보겠습니다.

```js
export default function Blog() {
  const { blogList } = useLoaderData<LoaderData>()

  return (
    <section className='mx-auto min-h-screen max-w-4xl pt-24'>
      <SearchForm method='get' action='.' />
      <BlogList blogList={blogList} />
      <MyPagination
        q={q}
        page={page}
        itemsPerPage={itemsPerPage}
        total_pages={Math.ceil(Number(blogCount) / itemsPerPage)}
      />
    </section>
  )
}
```

Blog() 컴포넌트에 기존 `<BlogList>` 위아래에 `<SearchForm>`과 `<MyPagination>` 컴포넌트를 추가했는데요.

먼저, MyPagination 컴포넌트는 props로 4개가 필요로 합니다.

"q"는 검색창에 필요한 검색 쿼리고요.

"page"는 현재 페이지가 몇 번째 페이지인지, "itemsPerPage"는 한 페이지에 몇 개의 블로그가 나타나게 할 건지,

마지막으로 "total_pages"는 "itemsPerPage"에 전체 블로그 숫자를 나눠서 "page"가 몇 개가 되는지 넣는 props입니다.

그럼 MyPagination 컴포넌트를 실제로 만들어 볼까요?

---

### MyPagination 만들기

위치는 `app/components/my-pagination.tsx` 파일입니다.

다 만들었으면 `app/routes/blog.tsx` 파일에서 MyPagination 컴포넌트를 import 하는 걸 잊지 마시고요.

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
      {page === 1 ? (
        <></>
      ) : (
        <>
          <Link
            to={`?q=${q}&page=${page - 1}&itemsPerPage=${itemsPerPage}`}
            aria-current='page'
            className={linkStyle}
          >
            {page - 1}
          </Link>
        </>
      )}
      <Link
        to={`?q=${q}&page=${page}&itemsPerPage=${itemsPerPage}`}
        aria-current='page'
        className={linkStyle}
      >
        {page}
      </Link>
      {page === total_pages ? (
        <></>
      ) : (
        <Link
          to={`?q=${q}&page=${page + 1}&itemsPerPage=${itemsPerPage}`}
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
            to={`?q=${q}&page=${total_pages - 1}&itemsPerPage=${itemsPerPage}`}
            className={linkStyle}
          >
            {total_pages - 1}
          </Link>

          <Link
            to={`?q=${q}&page=${total_pages}&itemsPerPage=${itemsPerPage}`}
            className={linkStyle}
          >
            {total_pages}
          </Link>
        </>
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

코드를 보면 리믹스의 Link 컴포넌트로 페이지 간 이동하는데요.

그냥 이동하는 게 아니라 params를 넣어서 이동하고 있습니다.

`http://localhost:3000/blog?q=react&page=1&itemsPerPage=10` 같은 형식입니다.

위 주소에 따르면 q, page, itemsPerPage가 주소창에 전달되면 그걸 이용해서 블로그 DB에서 원하는 위치의 블로그만 가져오게 하는 원리입니다.

그럼 `http://localhost:3000/blog?q=react&page=1&itemsPerPage=10` 주소로 이동했다면 불러오는 컴포넌트는 `app/routes/blog.tsx` 파일인데요.

현재 우리가 고치고 있는 파일입니다.

그럼 위에서 주소창에 있는 params을 분석해야 하는데요.

어떻게 해야 할까요?

바로 react-route-dom에 있는 useSearchParams 훅을 이용하면 됩니다.

```js
import { useLoaderData, useSearchParams } from '@remix-run/react'
```

실제로는 위 코드처럼 remix에서 불러오면 됩니다.

그럼 Blog() 컴포넌트에서 useSearchParams 훅을 이용해서 params을 분석하는 로직을 만들어 볼까요?

```js
export default function Blog() {
  const { blogList, blogCount } = useLoaderData<LoaderData>()
  const [myParams] = useSearchParams()

  type paramsType = {
    [key: string]: string
  }

  let paramsArray: paramsType[] = []
  myParams.forEach((value, name) => paramsArray.push({ [name]: value }))

  let q: string = ''
  let page: number = 1
  let itemsPerPage: number = 10

  paramsArray.map(p => (p.hasOwnProperty('q') ? (q = String(p.q)) : {}))

  paramsArray.map(p =>
    p.hasOwnProperty('page') ? (page = Number(p.page)) : {},
  )

  paramsArray.map(p =>
    p.hasOwnProperty('itemsPerPage')
      ? (itemsPerPage = Number(p.itemsPerPage))
      : {},
  )

  return (
    <section className='mx-auto min-h-screen max-w-4xl pt-24'>
      <BlogList blogList={blogList} />
      <MyPagination
        q={q}
        page={page}
        itemsPerPage={itemsPerPage}
        total_pages={Math.ceil(Number(blogCount) / itemsPerPage)}
      />
    </section>
  )
}
```

위 코드를 보시면 Blog() 컴포넌트는 클라이언트 상에서 페이지가 보여주게 되고 자바스크립트도 실행되게 됩니다.

useSearchParams 훅을 통해 myParams에 그 정보를 담는데요.

그러고 나서 그걸 다시 배열로 전환하는데요.

배열이 조금 더 편합니다.

그리고 각각 q, page, itemsPerPage 변수를 'let'으로 선언 및 디폴트 값을 부여합니다.

그리고 myParams로 브라우저의 주소창에 있는 정보를 분석해서 다시 q, page, itemsPerPage 변수에 할당하게 됩니다.

그리고 이 세 개의 변수를 바로 MyPagination 컴포넌트에 props로 넣어 전달하는 거죠.

---

### SearchForm 만들기

먼저, 'app/components' 폴더에 'search-form.tsx' 파일을 만들고 다음과 같이 코드를 추가합시다.

```js
import { Form, useTransition } from '@remix-run/react'
import type { FormMethod } from '@remix-run/react'
import { z } from 'zod'
import { useFormInputProps } from 'remix-params-helper'

const searchQSchema = z.object({
  q: z.string().min(2, 'Minimum length is 2'),
})

export default function SearchForm({
  method,
  action,
}: {
  method?: FormMethod
  action?: string
}) {
  const inputProps = useFormInputProps(searchQSchema)
  const transition = useTransition()

  let isSubmitting =
    transition.state === 'submitting' || transition.state === 'loading'

  return (
    <Form method={method} action={action} replace className='py-4 max-w-lg'>
      <div className='flex-cols mx-auto flex w-full'>
        <label htmlFor='simple-search' className='sr-only'>
          Search
        </label>
        <div className='relative w-full'>
          <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
            <svg
              className='h-5 w-5 text-gray-500 dark:text-gray-400'
              fill='currentColor'
              viewBox='0 0 20 20'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fillRule='evenodd'
                d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
                clipRule='evenodd'
              ></path>
            </svg>
          </div>
          <input
            {...inputProps('q')}
            className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'
            placeholder='Search'
            type='text'
            name='q'
          />
        </div>
        <button
          className='ml-2 rounded-lg border border-blue-700 bg-blue-700 p-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
          type='submit'
          disabled={isSubmitting}
        >
          <svg
            className='h-5 w-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
            ></path>
          </svg>
        </button>
      </div>
    </Form>
  )
}
```

SearchForm 컴포넌트는 HTML 기본 형식인 Form 관련 헬퍼 유틸리티인 'zod'와 'remix-params-helper' 패키지가 필요합니다.

개발 서버를 중단하고 아래와 같이 위 패키지를 인스톨합시다.

```bash
npm install zod remix-params-helper
```

설치가 끝나면 다시 개발 서버를 돌리시고요.

SearchForm은 'zod' 패키지를 통해 쿼리가 최소한 2글자 이상이어야 하고, 기타 form과 input을 점검해 줍니다.

리믹스는 form을 이용해서 서버 사이드로 정보를 전달하는데요.

form을 method='get' 방식으로 전달하면,

브라우저 input 창에 'test'라고 썼고,

input 속성에 name='q'라고 적으면 주소창에 '?q=test' 형식으로 서버에 전달하고 페이지가 리프레시됩니다.

form을 submit하면 주소창이 '?q=test' 형식으로 변하는데 이제 이걸 Blog() 컴포넌트에서 params를 분석하여 DB 부분을 불러와야 하는데요.

다시 Blog() 컴포넌트가 있는 'app/routes/blog.tsx' 파일로 돌아가서 서버 사이드 쪽인 loader() 함수를 고쳐보겠습니다.

```js
import { getMdxListItems, getMdxListItemsWithQ } from '~/utils/mdx.server'
import {
  getMdxCount,
  getMdxCountWithQ,
} from '~/model/content.server'
import MyPagination from '~/components/my-pagination'
import SearchForm from '~/components/search-form'
import { z } from 'zod'
import { getSearchParams } from 'remix-params-helper'

type LoaderData = {
  blogList: Awaited<ReturnType<typeof getMdxListItems>>
  blogCount: number
}

const filterBlogSchema = z.object({
  index: z.void().optional(),
  q: z.string().optional(),
  page: z.string().optional(),
  itemsPerPage: z.string().optional(),
})

export const loader: LoaderFunction = async ({ request }) => {
  const query = getSearchParams(request, filterBlogSchema)

  let q = query.data?.q as string
  let page: number = 1
  let itemsPerPage: number = 10

  if (query.data?.page && !isNaN(Number(query.data?.page)))
    page = Number(query.data?.page)

  if (query.data?.itemsPerPage && !isNaN(Number(query.data?.itemsPerPage)))
    itemsPerPage = Number(query.data?.itemsPerPage)

  let blogList
  let blogCount
  if (q === undefined) {
    blogList = await getMdxListItems({
      contentDirectory: 'blog',
      page: page,
      itemsPerPage: itemsPerPage,
    })
    blogCount = await getMdxCount('blog')
  } else {
    blogList = await getMdxListItemsWithQ({
      contentDirectory: 'blog',
      q: q,
      page: page,
      itemsPerPage: itemsPerPage,
    })
    blogCount = await getMdxCountWithQ('blog', q)
  }

  return json<LoaderData>(
    { blogList, blogCount },
    {
      headers: { 'cache-control': 'private, max-age=60', Vary: 'Cookie' },
    },
  )
}
```

코드가 좀 더 복잡해졌는데요.

서버 사이드 쪽이라서 그렇습니다.

일단 LoaderData 타입을 새로 정의했고요.

zod를 통해서 filterBlogSchema를 만들었습니다.

왜냐하면 loader() 함수에서 params를 좀 더 쉽게 분리할 수 있는 getSearchParams 훅을 쓰기 위해서죠.

getSearchParams는 remix-params-helper 패키지에 있습니다.

loader() 함수에서도 로직은 비슷합니다.

우리가 필요한 게 바로 q, page, itemsPerPage이기 때문에 이걸 params에서 분리해 내고,

이에 따라 DB 부분에서 블로그를 추출하는 코드인데요.

먼저, page와 itemsPerPage는 쌍으로 움직입니다.

그러나 q는 있을 수도 있고 없을 수도 있죠.

그래서 q가 있느냐 없는냐도 염두에 둬야 합니다.

그리고 blogCount라고 전체 블로그 글 개수를 저장하는 변수인데요.

blogCount는 기본으로 Speed Metal Stack에 있는 getMdxCount()함수에 의해 그 숫자를 얻을 수 있습니다.

이제 Prisma를 이용한 DB 쪽 함수인 getMdxListItems를 수정할 거고,

그다음 q를 필요로 하는 getMdxListItemsWithQ 함수도 새로 만들 겁니다.

마지막으로 blogCount에 필요한 getMdxCount, getMdxCountWithQ 함수도 만들 겁니다.

각각의 위치는 아래 코드처럼 import 되는 위치를 보면 됩니다.

```js
import { getMdxListItems, getMdxListItemsWithQ } from '~/utils/mdx.server'
import {
  getMdxCount,
  getMdxCountWithQ,
} from '~/model/content.server'
```

먼저, mdx.server.ts 파일에서 getMdxListItems 함수를 수정해 보겠습니다.

```js
export async function getMdxListItemsWithQ({
  contentDirectory, q, page, itemsPerPage
}: {
  contentDirectory: string; q: string, page: number, itemsPerPage: number
}) {
  return getContentListWithQ(contentDirectory, q, page, itemsPerPage)
}

export async function getMdxListItems({
  contentDirectory,
  page,
  itemsPerPage,
}: {
  contentDirectory: string;
  page: number;
  itemsPerPage: number;
}) {
  const [count, pagesToUpdates] = await Promise.all([
    getMdxCount(contentDirectory),
    requiresUpdate(contentDirectory),
  ])

  if (count === 0) {
    await populateMdx(contentDirectory)
  }
  if (pagesToUpdates && pagesToUpdates.length > 0) {
    await updateMdx(pagesToUpdates, contentDirectory)
  }
  return getContentList(contentDirectory, page, itemsPerPage)
}
```

getMdxListItems 함수는 props에 page와 itemsPerPage를 추가했습니다.

그런데 실제로 DB 부분에서 데이터를 불러오는 함수는 getContentList와 getContentListWithQ 함수인데요.

이것도 수정해야 합니다.

위치는 아래 import 정보를 보시면 됩니다.

```js
import {
  getContentList,
  getContentListWithQ,
} from '~/model/content.server'
```

이제 content.server.ts 파일을 열어 아래와 같이 해달 함수를 수정하거나 새로 만듭시다.

```js
export async function getContentListWithQ(contentDirectory = 'blog', q: string, page = 1, itemsPerPage = 10) {
  const contents = await db.content.findMany({
    where: {
      AND: [
        { published: true, contentDirectory }
      ],
      OR: [
        {
          title: {
            contains: q,

          },
        },
        {
          description: {
            contains: q,
          },
        },
        {
          frontmatter: {
            contains: q,
          },
        },
      ],
    },
    select: {
      slug: true,
      title: true,
      timestamp: true,
      description: true,
      frontmatter: true,
    },
    orderBy: { timestamp: 'desc' },
    skip: page === 1 ? 0 : (page - 1) * itemsPerPage,
    take: itemsPerPage,
  })

  return contents
}

export async function getContentList(contentDirectory = 'blog', page = 1, itemsPerPage = 10) {
  const contents = await db.content.findMany({
    where: { published: true, contentDirectory },
    select: {
      slug: true,
      title: true,
      timestamp: true,
      description: true,
      frontmatter: true,
    },
    orderBy: { timestamp: 'desc' },
    skip: page === 1 ? 0 : (page - 1) * itemsPerPage,
    take: itemsPerPage,
  })

  return contents
}
```

이 부분은 Prisma 부분인데요.

getContentList는 page와 itemsPerPage에 의해 skip과 take 조건을 달아서 DB 추출하고 있습니다.

그리고 getContentListWithQ는 좀 더 복잡하게 q에 따라 where 조건을 달아서 검색하고 있습니다.

Prisma를 좀 더 공부하시면 쉽게 이해할 수 있을 겁니다.

이제 getMdxCount와 getMdxCountWithQ 함수입니다.

이 함수도 content.server.ts 파일에 있습니다.

```js
export async function getMdxCountWithQ(contentDirectory: string, q: string) {
  const count = await db.content.aggregate({
    _count: { _all: true },
    where: {
      AND: [
        { published: true, contentDirectory }
      ],
      OR: [
        {
          title: {
            contains: q,

          },
        },
        {
          description: {
            contains: q,
          },
        },
        {
          frontmatter: {
            contains: q,
          },
        },
      ],
    },
  })

  return count._count._all
}

export async function getMdxCount(contentDirectory: string) {
  const count = await db.content.aggregate({
    _count: { _all: true },
    where: { published: true, contentDirectory },
  })

  return count._count._all
}
```

Prisma에서 콘텐츠 개수를 불러오는 코드는 aggregate라고 하고 거기서 _count를 이용하면 됩니다.

getMdxCount는 q 없이 전체 블로그 숫자이고, getMdxCountWithQ는 q를 이용해서 검색했을 때의 블로그 숫자입니다.

이제 테스트해볼까요?

먼저, 페이지 부분입니다.

![mycodings.fly.dev-add-page-nav-and-search-form-and-keywords-in-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEjuXnb9harF-lVS2_nVMCEBf8VvkB26_yrZDeRrzduDY6xavOi1HI3SdWvL6tsZTfydgHJqZIX-qpqRZV6eVWDO0T6caI297S_kTTGMjQ86IE1M_gp0Kp2ifmItsLOQYJD0M14WbM6a6Faq3OypW9R4aG2XQ4MvK9-a1U6rpb1tqpst_xviK6kCa15R=s16000)


전체 블로그 숫자가 12개라서 1페이지, 2페이지만 보입니다.

두번 째 페이지로 넘어가 볼까요?

![mycodings.fly.dev-add-page-nav-and-search-form-and-keywords-in-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEiveY_DKYl_bD4dqwvxCzRq3i_O4AuIWzzKM8t6FpHchETaR8zSVoAg84QNPFh6tclOlrPHoPqPJBOV7KRZJegP3CT7U-K2rFJG8e1FY6aCiXLu1-tm7tKF_EH7d5uRJ1toMF1lFnL8Fffef1cjuzR-OvH0CDSdguqSvCqhlLsT9zlFiYYIq_POhj4G=s16000)

주소창에도 관련 params 정보가 잘 전달되고 있습니다.

이제 검색을 해볼까요?

검색 조건은 Prisma 코드를 보시면 slug, title, description, 그리고 frontmatter에서 검색합니다.

일단 react라고 적어볼까요?

![mycodings.fly.dev-add-page-nav-and-search-form-and-keywords-in-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEgNA1MXs4j4QO0TP6roF2xsFvzsGgDXXUEe9GEGrkNn7N_RhqdwP9qEJBnhKrJnkVHxEpOSyPE8pgP87eVaRGsni-76OzQ-1dlLu19_o8EG1VPhtW4N3X-IoUKf53lpxfmmyk5epyi5Z6-nTEf8gQtF6Tbm3G4tdwfE5bujZEsmC5INgRydyH-FLSlq=s16000)

정말 잘 작동하고 있는데요.

만약 검색 조건이 2페이지 분량이라면 당연히 밑에 페이지가 2페이지로 나올 겁니다.

---

## 베스트 키워드 달기

이제 마지막으로 키워드 횟수에 의해 이 블로그는 도대체 어떤 키워드 글이 많은지 보여주는 로직을 작성할 건데요.

일단 완성형을 다시 보시죠!

![mycodings.fly.dev-add-page-nav-and-search-form-and-keywords-in-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEj-wmM82RntoP4HTfhRPLChAXjUefZzUaJJFR3fIg8zHKTmmKPIp-DIz-kxSm1VoTVUPcy9P5mwoXXeYpm_Euzbma5nvfQPk9SQIIZK6Pr79_I5tRFu0CSlpy3akW2Q9VDK2sUQRXNT2ykc3DvzUCIYULNaz2LXUxz3WrUeDWRMIA0b-ssVqWXKqyVg=s16000)

다시 Blog() 컴포넌트에 BestTags 컴포넌트를 추가합시다.

```js
return (
    <section className='mx-auto max-w-4xl pt-8'>
      <BestTags bestTags={arrayOfBestPool} />
      <SearchForm method='get' action='.' />
      <BlogList blogList={blogList} />
      <MyPagination
        q={q}
        page={page}
        itemsPerPage={itemsPerPage}
        total_pages={Math.ceil(Number(blogCount) / itemsPerPage)}
      />
    </section>
  )
```

return 부분만 가져왔는데요.

BestTags 컴포넌트는 bestTags props에 arrayOfBestPool 배열을 전달하고 있습니다.

arrayOfBestPool 배열을 loader() 함수에서 만들기 전에 먼저, UI 부분인 BestTags 컴포넌트를 만들어 볼까요?

`app/components/best-tags.tsx`파일입니다.

```js
import LinkOrAnchor from './link-or-anchor'

export default function BestTags({ bestTags }: { bestTags: Array<string> }) {
  const linkStyle =
    'bg-gray-100 text-gray-800 text-md font-medium items-center px-4 py-2 rounded mr-2 mb-2 dark:bg-gray-700 dark:text-gray-300 focus:bg-blue-300 hover:bg-blue-100 focus:dark:bg-cyan-700 hover:dark:bg-cyan-600'
  return (
    <>
      <div className='flex flex-row flex-wrap' role='group'>
        <LinkOrAnchor href={`.`} className={linkStyle}>
          all
        </LinkOrAnchor>
        {bestTags ? (
          bestTags.map(b => (
            <LinkOrAnchor href={`?q=${b}`} className={linkStyle} key={b}>
              {b}
            </LinkOrAnchor>
          ))
        ) : (
          <></>
        )}
      </div>
    </>
  )
}
```

이제 loader() 함수에서 arrayOfBestPool 배열 정보를 얻어 볼까요?

```js
type LoaderData = {
  blogList: Awaited<ReturnType<typeof getMdxListItems>>
  blogCount: number
  arrayOfBestPool: Array<string>
}
```
일단 위와 같이 LoaderData 타입을 변경합시다.

loader() 함수가 클라이언트 쪽인 Blog() 컴포넌트로 넘기는 데이터입니다.

```js
const allFrontmatterList = await getFrontmatterList()

  let Pool = new Map<string, number>()

  allFrontmatterList.map(af =>
    JSON.parse(af.frontmatter).meta.keywords.map(k =>
      Pool.set(k, Pool.has(k) ? Pool.get(k)! + 1 : 1),
    ),
  )
  // console.log(new Map([...Pool].sort()))

  const sortedPool = new Map([...Pool].sort((a, b) => b[1] - a[1]))

  const bestPool = new Map([...sortedPool].filter(a => a[1] > 2))
  // console.log(bestPool)
  const arrayOfBestPool: Array<string> = [...bestPool.keys()]
  // console.log(arrayOfBestPool)

  return json<LoaderData>(
    { blogList, blogCount, arrayOfBestPool: arrayOfBestPool.slice(0, 6) },
    {
      headers: { 'cache-control': 'private, max-age=60', Vary: 'Cookie' },
    },
  )

```

위 코드를 loader() 함수에서 `return json<LoaderData>` 부분 바로 위에 삽입하시면 됩니다.

또 return 부분에도 arrayOfBestPool 코드도 추가합시다.

저는 slice 메서드를 통해 6개만 추려내기로 했습니다.

위 코드를 보시면 console.log() 부분이 많이 보이시죠?

디버그 할 때 쓴 겁니다. 삭제하셔도 됩니다.

그런데 또 필요한 함수가 있는데요. 바로 getFrontmatterList() 함수입니다.

'content.server.ts' 파일에 아래와 같이 getFrontmatterList() 함수를 추가합시다.

```js
export async function getFrontmatterList(contentDirectory = 'blog') {
  const contents = await db.content.findMany({
    where: { published: true, contentDirectory },
    select: {
      frontmatter: true,
    },
    orderBy: { timestamp: 'desc' },
  })

  return contents
}
```

getFrontmatterList 함수는 frontmatter 정보만 불러오는 함수입니다.

이걸 이용해서 loader() 함수에서는 Map 타입에 넣는데 Map 타입의 keyword 부분이 중복되면 value 부분에 1씩 증가해서 횟수를 저장하고 있습니다.

그리고 그걸 다시 정렬하고, 다시 bestPool에서 횟수가 2 이상인 것만 추려내고 다시 keys() 함수를 통해 키워드만 추려냅니다.

마지막으로 클라이언트 쪽인 Blog() 컴포넌트에서 useLoaderData 부분을 아래와 같이 고치면 됩니다.

```js
const { blogList, blogCount, arrayOfBestPool } = useLoaderData()
```

이제 모든 게 끝났습니다.

한번 테스트 결과를 볼까요?

![mycodings.fly.dev-add-page-nav-and-search-form-and-keywords-in-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEhCUc9TB2Vbm71sM5HP5i7LSNg0Gp-rgCGytyFfMEwNWuSTDHNssF9OOO9u2QtKwmmuncfmxpCMuQBGNZ--aZykzppfKN6kPQB6KRD0V-R2dgoBpzo2OpjSyp9Q_fOr7BxuXM0_n6b4MZhNJefwdO0PXzhn9yPyxMFlCaDR4JtaeFH3arNhzcXeKUp7=s16000)

그리고 실제로 키워드 부분을 클릭해 볼까요?

![mycodings.fly.dev-add-page-nav-and-search-form-and-keywords-in-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEiAXMXCW6m3DX0OHQulG28bakjLlLkDVp2X4a8g9tqCyD0qCmjM4oC068MDKUSn9eu9gZeGKoUeCsAX08Ogi-DrGTTrLfQYWIUTI4XxBAOy9czLDJhYjy5smyZ2ybdQ9ZXMfE5iMUF63BlPVZFUWb8ovvsXUX6By-PKXEbhC-tw-HOW5obDrQ6HMQVx=s16000)

위 그림처럼 주소창을 보시면 "?q=speed-metal-stack"이라고 검색 조건이 달렸습니다.

베스트 키워드도 결국은 검색인 거죠.

대신에 횟수 중복이 가장 많은 걸 보여주는 겁니다. 저는 총 6개만 보여주게 했습니다.

---

## 마무리

지금까지 페이지 달기, 검색창 달기, 베스트 키워드 보여주기 등 여러가 지를 했는데요.

한 가지 여러분이 해보셔야 할 게 바로 베스트 키워드를 눌렀을 때 검색창에 해당 키워드가 기본 값으로 들어가게 하는 겁니다.

클라이언트 쪽 React 부분이니까 한번 도전해 보시는 것도 좋을 듯합니다.

당연히 'all' 버튼을 클릭하면 검색창이 초기화되도록 하는 것도 잊지 마시고요.

그럼.