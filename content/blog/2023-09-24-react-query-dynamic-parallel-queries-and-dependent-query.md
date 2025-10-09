---
slug: 2023-09-24-react-query-dynamic-parallel-queries-and-dependent-query
title: React Query 강좌 5편. 동적 병렬 쿼리(dynamic parallel queries)와 필요충분 쿼리 만들기(dependent query)
date: 2023-09-24 07:45:20.743000+00:00
summary: 동적 병렬 쿼리(dynamic parallel queries)와 필요충분 쿼리 만들기(dependent query)
tags: ["react query", "react", "dynamic parallel queries", "dependent query"]
contributors: []
draft: false
---

안녕하세요?

다섯 번째 React Query 강좌 시리즈입니다

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

1. [동적 병렬 쿼리 만들기(dynamic parallel queries)](#1-동적-병렬-쿼리-만들기dynamic-parallel-queries)
2. [필요충분 쿼리 만들기(dependent qurey)](#2-필요충분-쿼리-만들기dependent-qurey)

---

## 1. 동적 병렬 쿼리 만들기(dynamic parallel queries)

이번 시간에는 풀 스택 앱을 만들 때 발생할 수 있는 조건을 상정해서 React Query를 다뤄 보겠습니다.

```js
<Route
  path='/dynamic-parallel-queries'
  element={
    <DynamicParallelQueries
      productIds={['xly14egfwv2d4sc', 'c9lvtphkzowmwvs']}
    />
  }
/>
```

위와 같이 productIds에 하나의 값이 아니라 여러 개의 값이 있는 배열이 전달된 경우 어떻게 useQuery를 수행해야 할까요?

이런 경우가 바로 동적 병렬 쿼리 방식인데요.

바로 코드 작성에 들어가 보겠습니다.

DynamicParallelQueries.jsx 파일을 만들면 됩니다.

```js
import { useQueries } from 'react-query'
import axios from 'axios'

const fetchProducts = productId => {
  return axios.get(
    `https://mypocketbase.fly.dev/api/collections/products/records/${productId}`,
  )
}
export const DynamicParallelQueries = ({ productIds }) => {
  console.log(productIds)
  const results = useQueries(
    productIds.map(id => {
      return {
        queryKey: ['get-product', id],
        queryFn: () => fetchProducts(id),
      }
    }),
  )

  console.log({ results })

  return <div>DynamicParallelQueries</div>
}
```

<i> 참고로 UI 부분인 JSX 코딩은 생략했습니다. </i>

동적 병렬 쿼리를 위해서는 useQuery 말고 여러 개의 쿼리를 수행하기 위한 useQueries 함수를 불러와야 합니다.

위 코드를 보시면 DynamicParallelQueries 컴포넌트가 받은 productIds 배열에 따라 queryKey와 queryFn 항목만 지정해서 리턴하면 useQueries 함수가 알아서 처리해 줍니다.

아래 그림처럼 Dev Tools 에 병렬로 두 개의 쿼리가 수행된 걸 볼 수 있을 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjJ2xmZfYT3RJ54tVw3pREwQEOtLOQik12TjcGqutj72eQPlng_4Q_F4-nIVY1FRkqNUwKiu7XHHbcbyFP59Qn11--Wq04CNiQZ7WpfCbS6qSJWltGetIHVeL9mcq6Yav_66zKZFummbA4r42-6BinSx0mgQCSExP1lvKD2Fo_Be-jLcZLKcjTOS35y-hA)

그리고 useQueries 함수의 리턴값을 results 변수에 넣었는데요.

아래 그림처럼 results는 그냥 값을 담고 있는 배열입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgNbsXec7eDh6lurc5Nk9Sy-FCnoIaEhwhOAsi-VPHLM_ckCbRBIdRp_ZrL9k6tyP1bwwmCnsfhQSsI5BoK6c1xeyIeV4INNgM7cBlfe4dFG9-ZxoCe_b77LH0joEmtqGoYSSnkNGjjmcmTSaqb3lhfh_j0ctOIHMLC7pEAasYm47E5V_AVdkQgoCnZfx4)

UI 부분은 직접 작성해 보시기 바랍니다.

---

## 2. 필요충분 쿼리 만들기(dependent qurey)

풀 스택 앱을 만들 때 다음 상황을 가정할 수 있는데요.

userId에 해당하는 유저 정보를 가져오고, 유저 정보에서 유저 이름을 가져와서 다시 products 리스트에서 유저 이름에 해당하는 것만 가져오는 겁니다.

관계형 DB를 작성하고 prisma 같은 툴을 사용하면 쉽게 작성할 수 있는데요.

만약, DB에서 제공해 주는 쿼리가 관계형 데이터를 리턴해 주지 않을 때는 수작업으로 쿼리를 두 번 작성해야 하는데요.

이럴 경우에도 React Query는 아주 훌륭한 방법을 제공해 줍니다.

즉, 첫 번째 쿼리인 userId 부분에서 성공적으로 유저 이름을 가져왔을 때만 다음 쿼리를 수행하게끔 만드는 건데요.

일단, 이 같은 경우의 예제를 위해 제 pocketbase의 products 컬렉션에 아래와 같이 usename을 추가했습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiyVkcR9zLxPxmr9JfU01zlQ7toCyZwKQ-rfw9wLuoNp1uEQ2I7gcz4486DLkq7pTSevz7wztC_o2zpte1b50mjAmMcH981YE5BmX0Mwa8cpLCnpzDoZD7dH3nFuwTfab9AXb5LRqSkziW3prny2D3nuaXlZQ1hLQp0ngDTknPcb8vF3Wipun3zdCeM9Kk)

물론 users 컬렉션은 아래와 같습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjLn8agamFjLjP5a8O9hE2z1ANsNoZ0cvxF-uJjA9fZUEOMWw5OSCchki-uu32sj1XeFMkrQ40g4oIi0G2JpvfnG-VH4GVZCQzvTM6E2E_8BlxENMKrKkWc5Cd6o48Na_SLpa7FCW3cfzGUjebLcWW7Oy1e3eLgCZuwm-6QNnPVlrepWrZl8kytISFb0zE)

이제 DB 준비는 끝났네요.

예제를 위해 App.jsx 파일에서 라우팅 부분을 아래와 같이 강제로 userId를 넣어 보겠습니다.

```js
<Route
  path="/depent-query"
  element={<DepentQuery userId="xt7betjc4jjfwph" />}
/>
```

당연히 실전에서는 userId 부분도 동적으로 작성되겠죠.

이제, DepentQuery.jsx 파일을 만들도록 하겠습니다.

```js
import { useQuery } from "react-query";
import axios from "axios";

export const DepentQuery = ({ userId }) => {
  const fetchUserById = (userId) => {
    return axios.get(
      `https://mypocketbase.fly.dev/api/collections/users/records/?filter=(id='${userId}')`
    );
  };

  const { data: user } = useQuery(["get-user", userId], () =>
    fetchUserById(userId)
  );
  
  const userName = user?.data.items[0].username;
  
  return <div>Dependent queries</div>
};

```

일단 위와 같이 userId를 받아와서 해당 users 데이터를 받는 useQuery를 만들었습니다.

그리고 userName 상수를 구하는데요.

user? 처럼 옵셔널 체이닝 방식으로 작성해야 합니다.

왜냐하면 컴포넌트가 마운트 됐을 때 user는 undefined 이기 때문입니다.

useQuery가 수행되고 data가 리턴 됐을 때 바로 userName 값이 얻어지게 되는 거죠.

그러면 userName을 이용해서 계속해서 products 를 얻는 코드를 작성해 보겠습니다.

```js
import { useQuery } from "react-query";
import axios from "axios";

export const DepentQuery = ({ userId }) => {
  const fetchUserById = (userId) => {
    return axios.get(
      `https://mypocketbase.fly.dev/api/collections/users/records/?filter=(id='${userId}')`
    );
  };

  const fetchProductsByUsername = (username) => {
    return axios.get(
      `https://mypocketbase.fly.dev/api/collections/products/records/?filter=(username='${username}')`
    );
  };
  const { data: user } = useQuery(["get-user", userId], () =>
    fetchUserById(userId)
  );
  const userName = user?.data.items[0].username;

  const { data: userProducts } = useQuery(
    ["get-product-by-username", userName],
    () => fetchProductsByUsername(userName),
    {
      enabled: !!userName,
    }
  );

  return (
    <div>
      {userProducts &&
        userProducts.data?.items.map((p) => <div key={p.id}>{p.name}</div>)}
    </div>
  );
};
```

이 코드의 핵심은 바로 `enabled: !!userName` 옵션에 있습니다.

enabled 항목이 false면 해당 쿼리는 시작하지 않는다고 했는데요.

그래서 '!!userName'과 같이 부정연산자 두 개를 연달아 쓰게 되면 해당 연산자를 수행하게 됩니다.

즉, userName이 첫 번째 쿼리에 의해 구해지면 두 번째 쿼리의 enabled 항목이 true가 되는 거죠.

실제, Dev Tools 에서 보면 컴포넌트 초기에는 아래와 같이 get-product-by-username 쿼리는 null 값이고 disable 되어 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgpv-5T-DYyQYEdnMXOOATnTjTskTYTGMR8NcuZC_DjLhv7BbVXYVeZVFp9NHA4qL4xZGVZea2Ytjt5KAGgZtyrR9GiOwb3wSSznfioVI2rhPchqaCXADC_Mk70DEs6JCoB-FMByJZFi82jnlMfbg8Arq0WJIJ288zwRJZ9wKU2gG2uT8Ux-0G9VuswUAI)

그러다가 userName이 구해지면 바로 위 그림의 처음에 보이는 `['get-product-by-username', 'users85932']` 쿼리에 의해 쿼리 작업이 수행됩니다.

이 방식이 바로 필요충분 쿼리 작동 방식인데요.

영어로는 의존적 쿼리 작동이라고 합니다.

그럼.

