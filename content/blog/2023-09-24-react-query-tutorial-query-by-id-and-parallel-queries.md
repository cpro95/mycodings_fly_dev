---
slug: 2023-09-24-react-query-tutorial-query-by-id-and-parallel-queries
title: React Query 강좌 4편. id로 특정 항목만 가져오는 쿼리 방법(query by id)과 병렬 쿼리(parallel queries) 방법
date: 2023-09-24 05:39:45.969000+00:00
summary: id로 특정 항목만 가져오는 쿼리 방법(query by id)과 병렬 쿼리(parallel queries) 방법
tags: ["react query", "react", "query by id", "parallel queries"]
contributors: []
draft: false
---

안녕하세요?

네 번째 React Query 강좌 시리즈입니다

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

1. [id로 특정 항목만 가져오는 쿼리 방법(query by id)](#1-id로-특정-항목만-가져오는-쿼리-방법query-by-id)
2. [병렬 쿼리(parallel queries) 방법](#2-병렬-쿼리parallel-queries-방법)

---

## 1. id로 특정 항목만 가져오는 쿼리 방법(query by id)

UI를 만들다 보면 전체 리스트가 있고 해당 리스트를 클릭하면 상세 페이지로 이동하는 경우가 많은데요.

이 경우 id로 특정 항목만 가져오는 쿼리를 만들 필요가 있습니다.

먼저, 리액트 라우터를 이용해서 상세페이지의 경우 다이내믹 라우터를 만들어 보겠습니다.

App.jsx 파일입니다.

```js
import { ReactQuery } from "./ReactQuery";
import { ReactQueryDetails } from "./ReactQueryDetails";


<Route path="/react-query" element={<ReactQuery />} />
<Route path="/react-query/:productId" element={<ReactQueryDetails />} />
```

react-query 경로 다음에 productId라는 다이내믹 라우팅을 구성했는데요.

이제 ReactQueryDetails 컴포넌트를 만들어 보겠습니다.

위치는 ReactQuery.jsx 파일과 같은 곳에 두면 됩니다.

```js
import { useParams } from 'react-router-dom'
import { useProductId } from './hooks/useProductId'

export const ReactQueryDetails = () => {
  const { productId } = useParams()
  const { isLoading, isError, error, data } = useProductId(productId)
  console.log(data)
  if (isLoading) return <>Loading...</>
  if (isError) return <>{error.message}</>

  return (
    <>
      {data && (
        <div>
          <h1>ID : {data.data.id}</h1>
          <h1>NAME : {data.data.name}</h1>
          <h2>PRICE : {data.data.price}</h2>
        </div>
      )}
    </>
  )
}
```

상세 페이지는 useProductId 라는 훅을 이용합니다.

이 훅을 만들어 볼까요?

hooks 폴더 밑에 위치시키면 됩니다.

```js
import { useQuery } from 'react-query'
import axios from 'axios'

const fetchProductDetails = productId => {
  return axios.get(
    `https://mypocketbase.fly.dev/api/collections/products/records/${productId}`,
  )
}

export const useProductId = productId => {
  return useQuery(['product-id', productId], () =>
    fetchProductDetails(productId),
  )
}
```

제가 사용하는 pocketbase의 API는 위와 같이 마지막에 id를 넣으면 해당 id에 대한 아이템만 리턴합니다.

아래 그림처럼요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgyPpl7E8YfflDTl2MJ0_LhOwpSKPA62KfAF5af1wYwDQFORH8BZgq7MlrSoLCfW5w5HtLQ9zqHsUMfdZZskBW023D0-hE1HJXOjlMhk8Fp0j7HPjWrbEhH4U_Lir-AqMPAMfYjMeNa84x-ZXWORuwWAkA--uDe2MHr3co8lI-W6o4R94BAip3XYGsm8hQ)

여기서 useProductId 훅에 쓰인 useQuery함수에서 첫 번째 인자인 queryKey를 자세히 볼 필요가 있는데요.

queryKey에 배열이 들어가 있습니다.

즉, 다이내믹 라우팅에 쓰이는 방식인데요.

배열의 첫 번째 항목에 전체적인 query 이름을 적고, 배열의 두 번째 항목에 다이내믹으로 변하는 변수를 넣어주면 됩니다.

이제, ReactQuery.jsx 파일에 Link를 걸어야 됩니다.

```js
import { useProductName } from "./hooks/useProductName";
import { Link } from "react-router-dom";

export const ReactQuery = () => {
  const onSuccess = (data) => {
    console.log("데이터 가져오기 후 사이드 이펙트 수행", data);
  };

  const onError = (error) => {
    console.log("오류 발생 후 사이드 이펙트 수행", error);
  };

  const { isLoading, data, isError, error } = useProductName(
    onSuccess,
    onError
  );

  if (isLoading) return <>Loading...</>;
  if (isError) return <>{error.message}</>;

  return (
    <>
      <div className="text-4xl">ReactQuery</div>

      <ul className="p-4 list-disc">
        {data &&
          data.data?.items?.map((product) => (
            <li key={product.id}>
              <Link to={`/react-query/${product.id}`}>{product.name}</Link>
            </li>
          ))}
      </ul>
    </>
  );
};
```

이제, Product 리스트에서 해당 아이템을 클릭하면 아래와 같이 React Query가 2개의 쿼리를 작동시킬 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjaKq_mGe2u_6A5uYb11vHgRVVIPiJPH8f474lut3a5tm2WMVbje5SpoqOl45t40Tx2ebzpCvPUS7YqNPBbb62gyos0r7G3peeGqFKdcWQ1perQnQoYmFVhkknv9u6VtCTDMod_yzw4kegi_T0vYJeaVKJeHwtpZWVOlZhDKvq0dis_UMJh7LyKZ2YjMGQ)

위 그림을 보시면 'get-product' 쿼리와 'product-id' 두개가 보일 텐데요.

'product-id' 쿼리는 또다시 id로 구분되어집니다.

id를 한 번 더 눌러보시면 아래와 같이 변합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhSZmZ8nUrBuf2QdY4fyiptXvZ1nt81IT1oOYfNF7kh4U7osgM0tCRpzoKwtBjzKT88vEk5wgQJlHw9QjK2vxZUdjKqnJdUvQSni4_AUfOFdAWR1v-3JR1MjS4X6SwhSzx7BFC5xROiIbM0ent5mEAT61-0iOJIqqRFoJ1PsRN__xAL0N7ODb-mTsNeI6w)

위 그림을 보시면 id를 두 개 눌렀을 경우 쿼리가 각각 따로 생기게 됩니다.

지금까지 특정 항목을 가져오는 쿼리 작성에 대해 알아봤습니다.

---

## 2. 병렬 쿼리(parallel queries) 방법

때로는 하나의 컴포넌트에서 필요한 데이터를 여러 곳에서 가져오기 위해 여러 API를 호출해야 할 때가 있습니다.

React Query를 사용하면 useQuery를 두 번 호출하는 것만으로도 간단하게 처리할 수 있습니다.

먼저, pocketbase의 products 컬렉션과 users 컬렉션을 모두 가져오는 예제 코드를 만들겠습니다.

파일 이름은 ParallelQuery.jsx 파일이고 src 파일 밑에 두시면 됩니다.

리액트 라우터 돔으로 라우팅을 아래처럼 정해주고, 

```js
<Route path="/react-query/:productId" element={<ReactQueryDetails />} />
```

Headers.jsx 파일에 헤더 부분 링크를 추가합니다.

```js
<Link to="/parallel-query">Parallel Query</Link>
```

이제 ParallelQuery.jsx 파일을 아래와 같이 만들겠습니다.

```js
import { useQuery } from "react-query";
import axios from "axios";

const fetchProducts = () => {
  return axios.get(
    "https://mypocketbase.fly.dev/api/collections/products/records"
  );
};

const fetchUsers = () => {
  return axios.get(
    "https://mypocketbase.fly.dev/api/collections/users/records"
  );
};

export const ParallelQuery = () => {
  useQuery("parallel-get-product", fetchProducts);
  useQuery("parallel-get-users", fetchUsers);
  return <div>ParallelQuery</div>;
};
```

UI 부분은 생략했는데요.

React Query Dev Tools에서 확인해 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEhXdAfWxCvl7ACZ5_RPjp5gRUdC1qQn00v5JhZfT-xUKGIQz4a0w-yXKoJLj71Q5OeLKpO7Ojzr2eJLaohTGHpetnuUijmKA69njxyWN_FQEwMxoQ5375iCQe47_pH4WXo_bG53gdksudpROgq5I09PGbyMT6KOjSUePoC9BMYeOARbXYlbTXcXUcLwyb0)

![](https://blogger.googleusercontent.com/img/a/AVvXsEhpRiWQSqT9sgUEZC2R44c7tzCMWoZ6edLOcUMlLwpmud111q6X8C5nt2LVaogxqrbnwfIzLrc0QWx_GocxkXzrqrB66Jfi4LAZ3GDzgyCuoaOckB4A0_ZUzCqnjlb8bc0kNdntUNtpcSqXvQFkZfOYZ1LXnOklYJ4nxFtV2-9VCuvSw9JnYxUNQL95JHs)

위 그림과 같이 실제 두 개의 쿼리가 병렬로 처리되면서 데이터도 정상적으로 가지고 옵니다.

그러면, 쿼리가 두 개이면 어떻게 구분할까요?

다음과 같이 하시면 됩니다.

```js
export const ParallelQuery = () => {
  const productsData = useQuery("parallel-get-product", fetchProducts);
  const usersData = useQuery("parallel-get-users", fetchUsers);
  return (
    <div>
      {JSON.stringify(productsData)}
      {JSON.stringify(usersData)}
    </div>
  );
};
```

위와 같이 해도 되고, 아래처럼 별칭(alias) 기능을 사용하면 됩니다.

```js
  const {
    data: productsData,
    isLoading: productsLoading,
    isError: productsError,
  } = useQuery("parallel-get-product", fetchProducts);
```

alias를 사용하면 데이터를 구조화할 수 있고 충돌을 방지할 수 있습니다.

그럼.

