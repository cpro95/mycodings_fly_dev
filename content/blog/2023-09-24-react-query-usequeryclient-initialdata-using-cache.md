---
slug: 2023-09-24-react-query-usequeryclient-initialdata-using-cache
title: React Query 강좌 6편. useQueryClient와 initialData를 이용해서 캐시된 데이터 활용하여 상세 페이지에서 보여주기
date: 2023-09-24 08:40:41.360000+00:00
summary: useQueryClient와 initialData를 이용해서 캐시된 데이터 활용
tags: ["initialData", "useQueryClient"]
contributors: []
draft: false
---

안녕하세요?

여섯 번째 React Query 강좌 시리즈입니다

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

1. [useQueryClient와 initialData 옵션 활용하기](#1-usequeryclient와-initialdata-옵션-활용하기)

---

## 1. useQueryClient와 initialData 옵션 활용하기

이번에는 UX(user experience)를 개선하는 데 도움이 되는 React Query의 또 다른 기능을 소개하려고 합니다.

이 기능은 React Query의 아주 강력한 기능인데요.

바로 initial query data입니다.

initial query data가 뭔지 살펴보겠습니다.

React Query 강좌 4편에서 query by id로 작동하는 코드를 기억하실 겁니다.

전체 products 리스트를 화면에 뿌려주고, 특정 product를 클릭하면 다시 상세페이지로 이동하는 코드인데요.

이 부분은 웹 애플리케이션의 가장 기본입니다.

여기서 이런 생각을 할 수 있는데요.

전체 리스트 페이지에서 한번 쿼리 작업을 수행했는데, 상세 페이지로 들어가서 또 쿼리 작업을 수행합니다.

각 쿼리마다 네트워크 fetching 작업이 일어납니다.

전체 리스트 페이지에서 우리가 원하는 모든 데이터를 얻었으면 상세 페이지에서는 또 쿼리 작업을 하지 말고 앞에서 구한 데이터를 캐시로부터 가져와서 쓰면 네트워크 사용량을 절약할 수 있는 거죠.

먼저, ReactQueryDetails 컴포넌트에서 isLoading값을 출력하는 console.log 코드를 넣어 보았습니다.

그리고, 각각의 항목을 눌러 상세 페이지로 들어갔다가 나갔다를 반복해 보겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgb_S1iWtxP9a5EfifH_5JTjFbE4YKKh6k0A-hHe-hCUL0VLZFxOHSVXpe0RmOxT-m3VXhvSsth-_eocvds-QI2q4mhlAHMGBX5I8w0OYhNlJkNiilmKwGFJ-5jc7DHeMT4x3-Y8YdkQ0MJbFS2YRE0KlmQuoj7cRq8eXCm3qLMuNl8m1o8v_tC05Y6dOE)

위 그림처럼 상세 페이지로 들어갈 때 isLoading 값이 다시 true로 변하는 걸 볼 수 있습니다.

즉, 백그라운드로 fetching 작업이 일어나고 있는거죠.

이미 전체 리스트를 보여주는 컴포넌트에서 상세 데이터를 가져왔으므로 세부 페이지에서 해당 데이터를 사용할 수 없을까요?

앞에서도 얘기했지만 가능합니다.

상세 페이지에 있는 useQuery 함수에 initialData 옵션과 queryClient를 사용해서 앞에서 일어났던 query 캐시를 가져와서 사용하는 겁니다.

이렇게 하면 로딩 중인 상태 대신 백그라운드에서 다시 가져오기(refetch)가 시작되며 한 번 세부 정보가 검색되면 initialData에서 그걸 처리하게 됩니다.

그래서 다음부터는 아래 그림과 같이 isLoading 값이 계속 false가 될겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhH11Rxg81vxVCX0s13jBkgIDHV_Brs8-SefuSnjofAXBSwDjat5syj4TGD4Mq9xCtHW8uNjZLHg1BPJCweJaJ1_bCFJg8sOxfGqc88X5exvkH0LiHIh15gh25atUFzdzU3Nm1eqfgkaDmPLfGHrgF7EnG1f3J-y4TsVf0Tb6zMzudlYcVIySQxZynqdPc)

목록을 클릭하면 이 컴포넌트의 로딩 상태가 제거되고,

이전 쿼리에서 이미 캐시에 있는 데이터가 사용되어 사용자에게 데이터를 보여주는 데 사용됩니다.

사용자 관점에서는 데이터가 즉시 검색된 것처럼 보이지만 실제로는 백그라운드에서 데이터가 검색되는 중입니다.

이제 코드를 작성해 보겠습니다.

예전에 만들었던 ReactQueryDetails 컴포넌트에서 사용했던 useProductId 라는 커스텀 훅을 고쳐서 사용하면 됩니다.

```js
import { useQuery, useQueryClient } from "react-query";
import axios from "axios";

const fetchProductDetails = (productId) => {
  return axios.get(
    `https://mypocketbase.fly.dev/api/collections/products/records/${productId}`
  );
};

export const useProductId = (productId) => {
  const queryClient = useQueryClient();
  return useQuery(
    ["product-id", productId],
    () => fetchProductDetails(productId),
    {
      initialData: () => {
        const product = queryClient
          .getQueryData("get-product")
          ?.data?.items.find((p) => p.id === productId);

        if (product) {
          return {
            data: product,
          };
        } else return undefined;
      },
    }
  );
};
```

바뀐 부분은 useQueryClient로 queryClient를 가져왔고, queryClient가 가지고 있는 'get-product' 쿼리 캐시 정보를 이용한다는 겁니다.

'get-product' 쿼리는 ReactQuery 컴포넌트에서 불러왔던 useProductName 커스텀 훅에서 작성한 쿼리입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiLlSaCgbkTfEALYa1HctFPfi5XTuyBD8hApNg9Tw7tvred-fv4D32BRloyYYfUyisRmq4QS3InVyl8vJz0c5wuuSDn_nOpIAacr5u8X2kPOTl2-RufMTM-WB2qUJiKeLpgOi9yuwPYPWFvShU5YIaWXTNQF_ZOmQgKDtK6EmVYYLwCYl5NO___SsSdfho)

위 그림과 같이 'get-product' 쿼리는 우리가 원하는 모든 데이터를 data.items 항목에 보관하고 있습니다.

그래서 이 data.items 배열에서 원하는 것만 찾으면 되는 거죠.

그래서 위에서 initialData 항목에 콜백 함수를 작성할 때, getQueryData('get-product') 함수를 이용해서 'get-product' 쿼리를 가져왔고,

여기서 data.items 배열에서 find 항목으로 우리가 원하는 productId를 찾으면 되는 거죠.

<b>주의사항</b>

initialData 항목의 콜백 함수에서 중요한 한 가지는 두 가지인데요.

먼저, 찾은 데이터를 아래와 같은 형식으로 사용해야 합니다.

```js
return {
  data: product
}
```

왜냐하면 ReactQueryDetails 컴포넌트에서 data.data로 사용했기 때문입니다.

두 번째로 중요한 점은 바로 원하는 값을 찾지 못했을 경우 꼭 undefined를 리턴해야 합니다.

그래야 React Query가 해당 쿼리를 수행하지 않기 때문입니다.

그럼.
