---
slug: 2023-09-24-react-query-refetch-on-click-success-callback-data-transformation
title: React Query 강좌 3편. 클릭시 fetch하는 방법과 커스텀 콜백함수 작성, useQuery에서 데이터 변환, 커스텀 훅 만들기
date: 2023-09-24 01:32:52.076000+00:00
summary: 유저 클릭시 useQury 작동, 커스텀 콜백함수 추가, 데이터 변환, 커스텀 훅 만들기
tags: ["react-query", "react", "refetch", "custom callbak", "data transformation"]
contributors: []
draft: false
---

안녕하세요?

세 번째 React Query 강좌 시리즈입니다

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

1. [유저 클릭시 useQuery 작동시키기](#1-유저-클릭시-usequery-작동시키기)
2. [커스텀 콜백 함수 만들기 (onSuccess, onError)](#2-커스텀-콜백-함수-만들기-onsuccess-onerror)
3. [데이터 변환해서 받기](#3-데이터-변환해서-받기)
4. [useQuery를 커스텀 훅으로 만들어서 재사용하기](#4-usequery를-커스텀-훅으로-만들어서-재사용하기)

---

## 1. 유저 클릭시 useQuery 작동시키기

React Query의 useQuery는 기본적으로 Reat 컴포넌트가 마운트 되면 자동으로 시작되는데요.

useQuery의 세 번째 인자는 옵션 부분에서 'enabled' 항목이 기본 세팅이 'true'로 되어 있어 그런 겁니다.

간혹 UI를 작성하다 보면 유저의 요청에 의해 데이터를 가져와야 할 때가 있죠.

이럴 경우 사용하라고 React Query가 제공해 주는 콜백함수가 있습니다.

먼저, 'enabled' 기본 세팅을 false로 바꿔서 진행해 보겠습니다.

```js
  const { isLoading, isFetching, data, isError, error, refetch } = useQuery(
    "get-product",
    fetchProducts,
    {
      enabled: false,
    }
  );

  if (isLoading || isFetching) return <>Loading...</>;
  if (isError) return <>{error.message}</>;

return (
  <>
  <div className="text-4xl">ReactQuery</div>
      <button
        onClick={refetch}
        className="py-2 px-4 border bg-slate-100 rounded-md"
      >
        fetch data
      </button>
      <ul className="p-4 list-disc">
</>
)
```

그리고 UI 부분에 button을 추가했습니다.

실행해 보면 아래 그림처럼 데이터 fetching이 일어나지 않는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiu1IDEUqMvNaXWDN3nqpANpQK6Zyu-Vsjh46b1afEQ9SlvRb0WiHoCAX5GRlZsNNPAjbWqrKULA6UcEC4lKasocHZAD0qXQPRA2IzJ0Pjj64qsOz0JP3UIGuNpVKDk-DEpOex4cncyhRpTxufVcmWWl5UkX4kMz53VLehhmaQySENMwUKvakBie_5SNu4)

이제 button을 눌렀을 경우 실행하는 refetch 함수를 useQuery에서 가져와야 합니다.

위 코드에서 볼 수 있듯이 'refetch' 콜백 함수가 그것입니다.

그리고 유저 클릭 시 fetching 작업이 일어나기 때문에 isLoading과 함께 isFetching으로 'Loadin...' 문구를 나타내 줘야 합니다.

이제 네트워크를 느린 3G로 바꾼다면 테스트해 보면

![](https://blogger.googleusercontent.com/img/a/AVvXsEhUUkGy50nYscsRJGPQ4KJikpNOdsDcqkWbpidpnl9dbAHQl0H-c-oet5Kql7ODwTnBi35l4ODCalSYaogUwjg3gyb0AQGoUbQ4-pxi_HMoNdK8ZXGsVdPCHyQGRfb5p8PRYTYSzeFfCZGmDCAI-kxWCUKFfsGv8pf-XRNkkuorin3_Kk-DY4qReqK26Zc)

![](https://blogger.googleusercontent.com/img/a/AVvXsEi3lT7nV6EA1o-Jlqwv5p8Uj05_-sJaUQoyFDMPzo92ZnEk5JD6aTnxCgLSEnUkAdrkW_ofiWspiJnaP0bRh_o2dqcfwWaCsUmxr-CksknM4T0c2vm6HMphfQTbcmBHSTNadd_ywIpC3dpq5v2NCyjAORCQYXpZlo6QxLw5-D11m6yhvmabfiKSFTmmuFY)

위 그림과 같이 Loading... 문구와 함께 정상적으로 데이터가 fetching 되는 걸 보실 수 있을 겁니다.

---

## 2. 커스텀 콜백 함수 만들기 (onSuccess, onError)

useQuery와 함께 커스텀 콜백(callbacks) 함수를 사용하는 방법을 배워보겠습니다.

데이터 가져오기를 할 때, 때로는 쿼리가 완료될 때 사이드 이펙트를 수행하고 싶을 수 있습니다.

예를 들어 모달 대화창(modal dialog) 열기, 다른 경로로 이동 또는 토스트 알림(toast alarm) 표시 같은 것이 그건데요.

이걸 처리하기 위해 React Query는 useQuery 훅에서 성공(success), 실패(error) 했을 경우 커스텀 콜백을 지정할 수 있게 해 줍니다.

먼저, 쿼리가 데이터를 성공적으로 가져올 때 호출될 onSuccess라는 함수를 만들어 보겠습니다.

함수 이름은 다르게 해도 됩니다. 여기서는 React Query를 쉽게 배우는 Tutorial이기 때문에 표준 이름을 사용했습니다.

아래와 같이 콘솔에 간단한 메시지를 로깅하는 코드를 넣었습니다.

```js
const onSuccess = data => {
  console.log('데이터 가져오기 후 사이드 이펙트 수행', data)
}
```

두 번째로 쿼리가 데이터를 가져오는 도중 오류가 발생하면 호출될 onError라는 함수를 정의합니다.

오류 처리에 대한 콘솔 로그 메시지를 정의하는 코드입니다.

```js
const onError = error => {
  console.log('오류 발생 후 사이드 이펙트 수행', error)
}
```

이제 이 커스텀 콜백함수를 useQuery에 연결하기 위해 옵션으로 onSuccess와 onError 항목에 지정하면 됩니다.

```js
const fetchProducts = () => {
  return axios.get(
    "https://mypocketbase.fly.dev/api/collections/products/records"
  );
};


export const ReactQuery = () => {

  const onSuccess = (data) => {
    console.log("데이터 가져오기 후 사이드 이펙트 수행", data);
  };

  const onError = (error) => {
    console.log("오류 발생 후 사이드 이펙트 수행", error);
  };

  const { isLoading, isFetching, data, isError, error } = useQuery(
    "get-product",
    fetchProducts,
    {
      onSuccess: onSuccess,
      onError: onError,
    }
  );

  console.log({ isLoading, isFetching });
...
...
...
}
```

위 코드를 보시면 onSuccess: onSuccess라고 했는데요.

ES6 문법에 따르면 다음과 같이 손쉽게 줄일 수 있습니다.

```js
  {
    onSuccess, // 성공 콜백
    onError,   // 실패 콜백
  }
```

그래서 커스텀 콜백함수를 onSuccess, onError라고 이름 지은 겁니다.

실행 결과를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEg23tg8rV9Hoc5lm582DdnB-VQQXO8rTSs_whvNJxjXPxmVy-ydSowXgqgVGrw1gJgBRbd_bEPJpZiXehk0xXu7PUqwS3ODtVR7boJbD2w2kFHQVfdGWgxyjzvjp9Pf6E_KOZnBCX-brgbeGu4XQD7WMrKjbqdrdZH251-znGd4_sCHX9dduAgOtmtExKo)

위와 같이 콘솔 창에 잘 로깅(loggin)되고 있습니다.

onError를 위해 fetchProducts 함수의 URL을 수정해 보겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjMeUv5_gr3YGSrZy4MKN_DET3DmMIAKDJ5F5fk5TZyyADfzEKMbIjXY9WDNak3_LJYRwq6GWiBQeOZ_JD2WDMD-TG8-DwaZa-TXfHUihd4ziqUPUjlUV0w0dyXIipsEW-c_kZzV9wLJZaMDjMjiNxuFmGUix2uouB2W8u505tIEVcR7m6lBtXH2zy-5-Y)

위 그림과 같이 useQuery 훅이 몇 번의 재 시도 후에 onError 콜백함수를 실행하고 있네요.

이제 useQuery를 이용해서 데이터를 가져올 때 성공과 실패했을 때 사이드 이펙트를 수행할 수 있게 되었는데요.

보통 onSuccess 콜백에서는 데이터를 활용하는 코드를 작성하고, onError 콜백에서는 오류를 처리하는 작업을 합니다.

또, React Query는 커스텀 콜백 함수에 직접 feching한 데이터나 발생한 오류를 자동으로 주입하므로, 콜백 함수 내에서 데이터에 직접 접근할 수 있고, 또 오류에 직접 접근할 수 있습니다.

아래 그림을 보시면 실제 fetching 된 데이터가 보입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiKxWkfOxP8qDkiWjTFXkGu_j3hcfV0uI-EdLtjKWD29Bkp2Y7Ayzw3yfzk31YU2DY3H9TWeKZtKMW0SedT5gPqdC1XMWUKnS1qor8R7upNgM7C58VnDvoBSN23xyCWTaHs1BRTud6f5qxRDF68mVnTb1WksVy6D4SM89Q8wSlPqixZirZJEVvytg_jlQQ)

---

## 3. 데이터 변환해서 받기

API에서 데이터를 가져온 적이 있다면, 백 엔드와 프론트 엔드 컴포넌트가 데이터 형식을 다르게 필요로 할 때 변환 작업이 필요한 상황에 직면한 적이 있을 것입니다.

백엔드 개발자와 프론트 엔드 개발자 간에 데이터 형식의 차이가 있을 수 있습니다.

이러한 상황을 다루기 위해 React Query는 useQuery에 select 항목이라는 옵션을 제공합니다.

실제 기존 코드에서는 아래와 같이 UI 부분에서 배열의 map을 이용해서 보여줬는데요.

```js
<ul className='list-disc p-4'>
  {data &&
    data.data?.items?.map(product => (
      <li key={product.id}>
        {product.name} / {product.price}
      </li>
    ))}
</ul>
```

이렇게 UI에서 map을 통해 원하는 데이터를 얻었는데요.

useQuery의 select 항목을 이용해서 백 엔드에서 직접 필요한 항목을 선택할 수 있습니다.

위 코드에서는 product.name 항목만 선택 후 UI로 보내 보겠습니다.

먼저, UI 부분 코드를 보겠습니다.

```js
<>
  <div className='text-4xl'>ReactQuery</div>

  <ul className='list-disc p-4'>
    {/* {data &&
          data.data?.items?.map((product) => (
            <li key={product.id}>
              {product.name} / {product.price}
            </li>
          ))} */}
    {data && data.map(productName => <li key={productName}>{productName}</li>)}
  </ul>
</>
```

위 코드에서 볼 수 있듯이 우리가 가져올 거는 백 엔드에서 작업한 productName 항목입니다.

이렇게 간단하게 처리하면 프론트 엔드 개발자가 좀 더 직관적으로 코드를 짤 수 있겠죠.

그럼, select 항목을 작성해 보겠습니다.

```js
const { isLoading, isFetching, data, isError, error } = useQuery(
  'get-product',
  fetchProducts,
  {
    onSuccess: onSuccess,
    onError: onError,
    select: data => {
      const productName = data.data?.items.map(p => p.name)
      return productName
    },
  },
)
```

위와 같이 select 항목에 작성한 배열을 그냥 return 하면 최종적으로 data라는 항목으로 사용할 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhHNj5qMU7s-zMYpNcuT-LlSjMajPP5iml57-XeB8ckOvn4kZS1TMjfu6IIUeUVRmbImB5dSe85ie9jL2aGUr9yjle6YBvAFNXZtj3oF4pb3l8VFCaeYGLp45BuUZ72M_Gr3vU-GHEUzjEGA6BTJBvl0pw3bbXQqYFVRSIOL-HQKkOsRYkTclkt9UOdaqA)

위 그림과 같이 작성한 코드가 정상 작동하는 걸 볼 수 있습니다.

우리가 select 항목에서 map 메서드를 사용했는데요.

filter 메서드도 사용할 수 있습니다.

price가 9 이하인 항목만 가져와 볼까요?

```js
select: data => {
  const productName = data.data?.items
    .filter(p => parseInt(p.price) <= 9)
    .map(p => p.name)
  return productName
}
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEjGBgEM42Bm45lk2nOmqVdYWyviD25_rhuwnwg_7C4L0hNqLDfFzXnXdNK0dPYA6oytJt_iqnvh0bklU7dmdyNJGwNNBLl4B3LkjRopL89kKTuDdKl-_eA4eNr_YRb80nkD-Xh9e5AEqrWS_PZYtR2EmMqEO0MsAlb_ElbxNCD-VccPh8NNFXT8njkSPRc)

위와 같이 정상적으로 작동하네요.

---

## 4. useQuery를 커스텀 훅으로 만들어서 재사용하기

앱이 커지면 동일한 데이터를 여러 컴포넌트에서 재사용해야 할 때가 있는데요.

예를 들어, 동일한 쿼리가 다른 컴포넌트에서도 필요한 경우입니다.

이런 경우를 대비하여 커스텀 쿼리 훅을 만드는 게 좋습니다.

먼저, 커스텀 훅을 'hooks' 폴더에 넣는 것으로 가정하고, 'src' 폴더 안에 'hooks'라는 새로운 폴더를 만들고, 그 안에 'useProductName.js'라는 파일을 만들겠습니다.

파일 이름은 개인적인 취향이고, 리액트 훅이기 때문에 'use'로 시작하면 됩니다.

리액트에서 Hook은 결국 함수인데요.

```js
import { useQuery } from "react-query";
import axios from "axios";

const fetchProducts = () => {
  return axios.get(
    "https://mypocketbase.fly.dev/api/collections/products/records"
  );
};

export const useProductName = (onSuccess, onError) => {
  return useQuery("get-product", fetchProducts, {
    onSuccess: onSuccess,
    onError: onError,
    select: (data) => {
      const productName = data.data?.items
        .filter((p) => parseInt(p.price) <= 9)
        .map((p) => p.name);
      return productName;
    },
  });
};
```

위와 같이 useProductName 훅을 만들었습니다.

onSuccess, onError 함수는 호출하는 컴포넌트에서 작성해서 넘겨주는 게 나중에 UI 부분을 다룰 때 좋습니다.

이제 리액트 컴포넌트로 가서 코드를 작성해 볼까요?

```js
import { useProductName  } from "./hooks/useProductName";

export const ReactQuery = () => {
  const onSuccess = (data) => {
    console.log("데이터 가져오기 후 사이드 이펙트 수행", data);
  };

  const onError = (error) => {
    console.log("오류 발생 후 사이드 이펙트 수행", error);
  };

  const { isLoading, isFetching, data, isError, error } = useProductName(
    onSuccess,
    onError
  );

...
...
...
}
```
위와 같이 useProductName 훅을 import 하고 사용해 주시면 됩니다.

어떤까요?

코드가 좀 더 깔끔해졌고, useQuery를 이용해서 실제 여러 가지 훅을 작성하면 이 컴포넌트 말고 다른 컴포넌트에서도 쉽게 useProductName 훅을 이용해서 데이터 fetching을 할 수 있을 겁니다.

그럼.

