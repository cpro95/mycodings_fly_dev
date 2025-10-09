---
slug: 2023-09-24-react-query-paginated-query-and-infinite-query
title: React Query 강좌 7편. 페이지네이션 구현하기와 useInfiniteQuery로 무한스크롤 구현하기
date: 2023-09-24 11:23:47.548000+00:00
summary: 페이지네이션 구현하기와 useInfiniteQuery로 무한스크롤 구현하기
tags: ["react query", "react", "pagination", "paginated query", "infinite scroll", "useInfiniteQuery"]
contributors: []
draft: false
---

안녕하세요?

일곱 번째 React Query 강좌 시리즈입니다

전체 시리즈 링크는 아래와 같습니다.

1. [React Query 강좌 1편. useQuery 사용법 기초](https://mycodings.fly.dev/blog/2023-09-17-how-to-use-react-query-and-usequery)

2. [React Query 강좌 2편. 캐시로 움직이는 useQuery 작동 원리(cachetime,staletime,refetch,poll)](https://mycodings.fly.dev/blog/2023-09-17-react-query-cachetime-staletime-refetch-poll)

3. [React Query 강좌 3편. 클릭시 fetch하는 방법과 커스텀 콜백함수 작성, useQuery에서 데이터 변환, 커스텀 훅 만들기](https://mycodings.fly.dev/blog/2023-09-24-react-query-refetch-on-click-success-callback-data-transformation)

4. [React Query 강좌 4편. id로 특정 항목만 가져오는 쿼리 방법(query by id)과 병렬 쿼리(parallel queries) 방법](https://mycodings.fly.dev/blog/2023-09-24-react-query-tutorial-query-by-id-and-parallel-queries)

5. [React Query 강좌 5편. 동적 병렬 쿼리(dynamic parallel queries)와 필요충분 쿼리 만들기(dependent query)](https://mycodings.fly.dev/blog/2023-09-24-react-query-dynamic-parallel-queries-and-dependent-query)

6. [React Query 강좌 6편. useQueryClient와 initialData를 이용해서 캐시된 데이터 활용하여 상세 페이지에서 보여주기](https://mycodings.fly.dev/blog/2023-09-24-react-query-usequeryclient-initialdata-using-cache)

7. [React Query 강좌 7편. 페이지네이션 구현하기와 useInfiniteQuery로 무한스크롤 구현하기](https://mycodings.fly.dev/blog/2023-09-24-react-query-paginated-query-and-infinite-query)

8. [React Query 강좌 8편. useMutation 사용법과 Optimistic Updates](https://mycodings.fly.dev/blog/2023-10-02-react-query-howto-usemutation-in-depth)

---

** 목 차 **

1. [페이지네이션(Pagination) 구현하기](#1-페이지네이션pagination-구현하기)
2. [useInfiniteQuery 사용법](#2-useinfinitequery-사용법)
3. [무한 스크롤 구현하기](#3-무한-스크롤-구현하기)
4. [Intersection Observer 사용하여 무한 스크롤 구현하기](#4-intersection-observer-사용하여-무한-스크롤-구현하기)
---

## 1. 페이지네이션(Pagination) 구현하기

우리가 API를 통해 데이터를 가져오면 보통 10개씩 보여줍니다.

10개씩 보여주는 거는 디폴트 값이고, 아래와 같이 사용자가 직접 몇 개씩 가져올지 정할 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiw0tdKbglhc0WBfag3iXM6kAKe21ojyRrZru6SZi0_jvTQSCKDPm-nkP00dSZhCZymNn7nfHo5xKzhWBGObWFZePq4ODUJI9QcD2vfTpZn76viQKGLl1K53Pr__w-ZNR2GwvzjrJSyKej7PLzaiugpfU6y35dsIYwtu4pC-p8pS4SwJVStqqQpicPdCYU)

위 그림은 pocketbase가 제공하는 페이지네이션 관련 정보인데요.

page와 perPage 등 관련 정보가 제공되고 있네요.

보통 좋은 API면 totalItems와 totalPages 관련 정보도 꼭 제공해 줘야 합니다.

그래야 게시판 같은 걸 만들 때 처음과 끝을 계산해서 페이지 정보를 보여줄 수 있기 때문입니다.

오늘은 React Query로 페이지네이션을 구현해 보겠습니다.

PaginatedQuery.jsx 컴포넌트를 새로 만들겠습니다.

그래서 App.jsx 파일에 아래와 같이 라우팅을 꼭 추가해야 합니다.

```js
import { PaginatedQuery } from "./PaginatedQuery";
...
...
<Route path="/paginated-query" element={<PaginatedQuery />} />
```

이제 PaginatedQuery 컴포넌트를 만들겠습니다.

사실 지금까지 배운 useQuery 관련 정보를 응용하는 건데요.

```js
import { useState } from 'react'
import { useQuery } from 'react-query'
import axios from 'axios'

const fetchProducts = pageParam => {
  return axios.get(
    `https://mypocketbase.fly.dev/api/collections/products/records/?perPage=4&page=${pageParam}`,
  )
}
export const PaginatedQuery = () => {
  const [pageNumber, setPageNumber] = useState(1)
  const { data, isLoading, isFetching } = useQuery(
    ['get-paginated', pageNumber],
    () => fetchProducts(pageNumber),
  )
  if (isLoading) return <div>Loading...</div>

  return (
    <>
      <div className='text-4xl'>ReactQuery</div>

      <h2>current Page number : {pageNumber}</h2>
      <ul className='list-disc p-4'>
        {data &&
          data.data?.items?.map(product => (
            <li key={product.id}>{product.name}</li>
          ))}
      </ul>
      <div className='space-x-4'>
        <button
          onClick={() => setPageNumber(page => page - 1)}
          disabled={pageNumber === 1}
        >
          Prev
        </button>
        <button
          onClick={() => setPageNumber(page => page + 1)}
          disabled={pageNumber === 3}
        >
          Next
        </button>
      </div>
      <div>{isFetching && 'Fetching...'}</div>
    </>
  )
}
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEgga-_X-IPNiPxMPM3PVi3cjp9OThn3pMp_pzGv5CQ7wTVCUE_YSGWgRtZWLTLOWIgaIX2rG2FYWd-3McGKU1yw3cYA4hMVlsUNUQ0uj_TlbG2e-rzKP2Z_fdbqMBBETUupHDYjbJ4cxgMDaJM6qLHl_UV5FjhwgkrFUxd5HH5K_nB6y5wWzVQUMnhvbQc)

위와 같이 'get-paginated'라는 쿼리가 pageNumber에 의해 구분되어서 잘 실행되고 있습니다.

실제 작동 순서는 다음과 같습니다.

Next 버튼을 누르면 쿼리가 작동하고 실제 데이터 fetching이 일어나고 그러 화면에 뿌려줍니다.

그런데, 우리가 React Query를 쓰는 이유가 있죠. 캐시 된 데이터를 활용하는 건데요.

여기서 useQuery가 제공해 주는 강력한 추가 기능이 있습니다.

Next 버튼이나 Prev 버튼을 눌렀을 때 캐시 된 데이터를 화면에 먼저 보여주는 겁니다.

그러고 나서 fetching을 해서 기존 데이터와 같으면 UI를 바꾸지 않고, 만약 틀리다면 그제야 UI를 바꾸는 겁니다.

캐시 된 데이터를 fetching이 일어나기 전에 화면에 먼저 보여주는 게 왜 중요한지 알려드리겠습니다.

여러분이 방대한 양의 게시판을 작성한다고 할 때 서버에서 데이터를 fetch하는 속도가 느릴 겁니다.

fetch한 자료를 UI에 보여줘야 하는데, 서버 사이드 렌더링이 아니라 React를 이용해서 클라이언트 렌더링을 하게 된다면,

fetching 하고 있을 때 UI가 사라지게 됩니다.

그러면 그 UI 부분이 없어져서 전체적인 화면의 Layout이 깨지게 되는데요.

그래서 React에서는 Skeleton UI 같은 걸 제공해 주는 이유가 여기에 있습니다.

아주 복잡한 CSS 구조로 되어 있으면 데이터 로딩 중에 Layout이 틀어져 보일 수 있기 때문이죠.

그래서 ReactQuery 에서는 이 부분을 방지하고자, 캐시 된 데이터를 먼저 보여주고 나중에 fetching이 끝난 다음 다시 화면에 데이터를 업데이트해 주는 방식을 제공합니다.

이 기능은 옵션을 주면 되는데요.

```js
const { data, isLoading, isFetching } = useQuery(
  ['get-paginated', pageNumber],
  () => fetchProducts(pageNumber),
  {
    keepPreviousData: true,
  },
)
```

위와 같이 'keepPreviousData' 항목을 true라고 해주면 됩니다.

---

## 2. useInfiniteQuery 사용법

모바일에서 구글 검색하면 페이지 밑으로 스크롤 하면 다음 페이지 내용이 자동으로 로딩되는 걸 본 적이 있는데요.

바로 무한 스크롤을 사용했기 때문입니다.

무한 스크롤을 구현하기 위해서는 useInfiniteQuery 함수를 사용해야 하는데요.

무한 스크롤 구현 전에 먼저, useInfiniteQuery 함수 사용법을 간단하게 익혀 보겠습니다.

PaginatedQuery 컴포넌트를 수정해서 사용하겠습니다.

```js
import { Fragment } from 'react'
import { useInfiniteQuery } from 'react-query'
import axios from 'axios'

const fetchProducts = (page) => {
  return axios.get(
    `https://mypocketbase.fly.dev/api/collections/products/records/?perPage=4&page=${page}`,
  )
}

export const PaginatedQuery = () => {
  const {ƒ
    data,
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ['get-paginated'],
    ({ pageParam = 1 }) => fetchProducts(pageParam),
    {
      getNextPageParam: (_lastPage, pages) => {
        if (pages.length < 3) {
          return pages.length + 1
        } else return undefined
      },
    },
  )
  if (isLoading) return <div>Loading...</div>

  return (
    <>
      <div className='text-4xl'>ReactQuery</div>

      {data &&
        data.pages?.map((group, i) => (
          <Fragment key={i}>
            {group &&
              group?.data.items.map(p => <div key={p.id}>{p.name}</div>)}
          </Fragment>
        ))}
      <div className='space-x-4'>
        <button
          className='border'
          onClick={fetchNextPage}
          disabled={!hasNextPage}
        >
          Load More
        </button>
      </div>
      <div>{isFetching && !isFetchingNextPage ? 'Fetching...' : null}</div>
    </>
  )
}
```

예전 useQuery 함수의 사용법과 사뭇 많이 다릅니다.

먼저, fetchProducts 함수를 볼까요?

page라는 함수 인자를 받고 있습니다.

그러면 fetchProducts 함수 호출 부분을 볼까요?

useInfiniteQuery에 넘겨진 함수 부분인데요.
```js
({ pageParam = 1 }) => fetchProducts(pageParam)
```
위 코드처럼 pageParam 값을 디폴트 값으로 1로 지정해서 넘겨줘야 합니다.

그리고 useInfiniteQuery 함수가 제공하는 pageParam 값을 함수 인자로 넘겨주면 됩니다.

pageParam은 useInfiniteQuery 가 fetchProducts 함수를 제어할 때 내부적으로 제공하는 변수입니다.

이걸로 몇 페이지, 몇 페이지를 직접 찾는 거죠.

그리고 useInfiniteQuery 함수의 사용법입니다.

<b>주의 사항</b>

useInfiniteQuery는 queryKey를 꼭 배열로 제공해 줘야 합니다.

fetch 함수는 위와 같이 인자 없이 그냥 전달 했구요.

마지막으로 옵션에 넣어줄 항목이 바로 'getNextPageParam' 콜백 함수입니다.

이 콜백 함수는 말 그대로 다음 페이지의 pageParam 값을 제공하는 겁니다.

우리 예제에서는 총 3 페이지기 때문에 위와 같이 작성 했구요.

꼭 undefined를 리턴하는 코드도 작성해야 합니다.

<b>주의 사항</b>

UI 부분에서 사용하는 데이터가 data.data가 아니라 data.pages입니다.

즉, useInfiniteQuery는 페이지 정보를 가져다주고, 실제 그 pages에는 해당 페이지가 있고, group이란 항목이 있습니다.

그래서 위와 같이 map 메서드를 두 번 써야 됩니다.

```js
{
  data &&
    data.pages?.map((group, i) => (
      <Fragment key={i}>
        {group && group?.data.items.map(p => <div key={p.id}>{p.name}</div>)}
      </Fragment>
    ))
}
```

조금은 복잡할 수 있으니까요?

테스트 여러 번 해보시면 금방 이해될 겁니다.

그러면 다음 페이지는 어떻게 수행할까요?

바로 fetchNextPage 콜백 함수를 사용하면 됩니다.

```js
<button className='border' onClick={fetchNextPage} disabled={!hasNextPage}>
  Load More
</button>
```

우리가 위와 같이 버튼을 작성했고 onClick 핸들러로 fetchNextPage를 지정해 줬습니다.

그래서 이 버튼만 누르면 useInfiniteQuery의 다음 페이지 찾기가 작동되는 겁니다.

또, hasNextPage 값으로 disabled 값도 조정할 수 있고요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEisrCEMv5bR5n-TQ_AZP89tfdDau7VVCw9WoF7fe7P_-BVFYTr_dovanIDnCPPVEQoPn7RbTB3LrKkOag5ZcHeKRC3csa11rZ_B3iq2Pc57anzvV8NxZ-d2ws_Cx7MCT_i3XJIz8y3In321TvVF2j5TzljIdSDFTBvfAafhd-GtCEpbUYvwYV5zcvfaUfs)

위 그림과 같이 Load More 버튼을 누르면 계속 데이터가 나타날 겁니다.

---

## 3. 무한 스크롤 구현하기

useInfiniteQuery는 말 그래도 무한 스크롤을 구현하게 해 주는데요.

브라우저에서 기본적으로 제공하는 DOM Element의 scrollHeight, scrollTop, clientHeight 등을 통해 무한 스크롤을 구현해 보겠습니다.

```js
useEffect(() => {
    let fetching = false;
    const handleScroll = async (e) => {
      const { scrollHeight, scrollTop, clientHeight } =
        e.target.scrollingElement;
      if (!fetching && scrollHeight - scrollTop <= clientHeight * 1.2) {
        fetching = true;
        if (hasNextPage) await fetchNextPage();
        fetching = false;
      }
    };
    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [fetchNextPage, hasNextPage]);
```

hasNextPage 값과 fetchNextPage 함수를 이용해서 브라우저에서 스크롤이 발생했을 때 fetchNextPage() 함수를 수행하라고 하는 코드입니다.

위 useEffect 코드는 꼭 useInfiniteQuery 코드 다음에 작성해야 합니다.

그래야지 useEffect에서 fetchNextPage, hasNextPage 변수를 참조할 수 있기 때문입니다.

아마도, useInfiniteQuery 함수가 useEffect 보다 먼저 실행되는 걸로 보입니다.

```js
import { Fragment, useEffect } from "react";
import { useInfiniteQuery } from "react-query";
import axios from "axios";

const fetchProducts = (page) => {
  return axios.get(
    `https://mypocketbase.fly.dev/api/collections/products/records/?perPage=4&page=${page}`
  );
};

export const PaginatedQuery = () => {
  const { data, isLoading, hasNextPage, fetchNextPage } = useInfiniteQuery(
    ["get-paginated"],
    ({ pageParam = 1 }) => fetchProducts(pageParam),
    {
      getNextPageParam: (_lastPage, pages) => {
        if (pages.length < 3) {
          return pages.length + 1;
        } else return undefined;
      },
    }
  );

  useEffect(() => {
    let fetching = false;
    const handleScroll = async (e) => {
      const { scrollHeight, scrollTop, clientHeight } =
        e.target.scrollingElement;
      if (!fetching && scrollHeight - scrollTop <= clientHeight * 1.2) {
        fetching = true;
        if (hasNextPage) await fetchNextPage();
        fetching = false;
      }
    };
    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [fetchNextPage, hasNextPage]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <div className="text-4xl">ReactQuery</div>

      {data &&
        data.pages?.map((group, i) => (
          <Fragment key={i}>
            {group &&
              group?.data.items.map((p) => <div key={p.id}>{p.name}</div>)}
          </Fragment>
        ))}
    </>
  );
};
```

실행 결과를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEiyxt-REhwgCKVuILd4Sged1xZiNGUzzXKRRO_Oo-TuI73OXkpPgrYb6ZVrENTSFk1ml308pihCepiMQvzBNhysZ8bvRVFCQ22EgtIgB7s4hGp9gw5CCyfjwjIZyEHF0S9mxrQIm0cclBAsV_WgGcgoNc01bG32NpogE04mkC5ZP4sLtIuCpdbHHngoaLQ)

![](https://blogger.googleusercontent.com/img/a/AVvXsEhS114zITONboJG50m6ttAa6PYshDL4v-m_pArCxJqPp-nc8aXUHlOBPK91Mk2AQ2eNcbX7pPV7RWQ0ANJWdnU2iUF-uQtA8Zno6BfeHuRHthqsft6HbPJnJT3bTqrSrHw0__z3MkwZxtjPkuYyw9XuMEGMj1iD0JJkE7etfB9OWCR336WUJG-wIHPF6HU)

위 두 개의 그림처럼 스크롤 하면 useInfiniteQuery가 정상적으로 작동합니다.

---

## 4. Intersection Observer 사용하여 무한 스크롤 구현하기

[Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

Intersection Observer API 라는게 있는데요.

최신 브라우저에는 모두 있는 겁니다.

이걸 이용해 볼 건데요.

PaginatedQuery2를 만들어 보겠습니다.

라우팅에도 추가해야겠죠.

```js
import { Fragment, useEffect, useRef, useCallback } from "react";
import { useInfiniteQuery } from "react-query";
import axios from "axios";

const fetchProducts = (page) => {
  return axios.get(
    `https://mypocketbase.fly.dev/api/collections/products/records/?perPage=4&page=${page}`
  );
};

export const PaginatedQuery2 = () => {
  const observerElem = useRef(null);

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      ["get-paginated"],
      ({ pageParam = 1 }) => fetchProducts(pageParam),
      {
        getNextPageParam: (_lastPage, pages) => {
          if (pages.length < 3) {
            return pages.length + 1;
          } else return undefined;
        },
      }
    );

  const handleObserver = useCallback(
    (entries) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage]
  );

  useEffect(() => {
    const element = observerElem.current;

    let options = {
      root: null,
      rootMargin: "0px",
      threshold: 1,
    };

    const observer = new IntersectionObserver(handleObserver, options);
    if (element) observer.observe(element);
    return () => {
      if (element) observer.unobserve(element);
    };
  }, [fetchNextPage, hasNextPage, handleObserver]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <div className="text-4xl">ReactQuery</div>

      {data &&
        data.pages?.map((group, i) => (
          <Fragment key={i}>
            {group &&
              group?.data.items.map((p) => <div key={p.id}>{p.name}</div>)}
          </Fragment>
        ))}
      <div className="loader" ref={observerElem}>
        {isFetchingNextPage && hasNextPage ? "Loading..." : "No search left"}
      </div>
    </>
  );
};
```

여기서 가장 중요한 useEffect 함수를 살펴볼까요?

```js
  useEffect(() => {
    const element = observerElem.current;

    let options = {
      root: null,
      rootMargin: "0px",
      threshold: 1,
    };

    const observer = new IntersectionObserver(handleObserver, options);
    if (element) observer.observe(element);
    return () => {
      if (element) observer.unobserve(element);
    };
  }, [fetchNextPage, hasNextPage, handleObserver]);
```

IntersectionObserver 객체를 observer 변수에 넣었고, 그걸 이용해서 element DOM 노드를 감사하는 겁니다.

여기서 element는 observerElem인데요.

우리가 마지막에 넣었던 div 태그입니다.

아래 코드처럼요.

```js
<div className="loader" ref={observerElem}>
  {isFetchingNextPage && hasNextPage ? "Loading..." : "No search left"}
</div>
```

useRef로 넘겨주기 때문에 꼭 observerElem.current로 DOM 노드를 넘겨줘야 합니다.

안 그러면 Failed to execute 'observe' on 'IntersectionObserver': parameter 1 is not of type 'Element'. 에러가 발생됩니다

그리고 가장 중요한 부분이 바로 observer.observe 하기 전에 꼭 element가 있는지 없는지 if 문으로 체크해야 합니다.

unobserve에서도 꼭 element가 있는지 없는지 if 문으로 체크해야 합니다.

이 if 문이 없으면 Failed to execute 'observe' on 'IntersectionObserver': parameter 1 is not of type 'Element'. 에러가 발생됩니다.

useEffect가 React 코드의 useRef 보다 먼저 실행되기 때문에 그렇습니다.

실행해 보시면 아까랑 같이 잘 작동할 겁니다.

그럼.
