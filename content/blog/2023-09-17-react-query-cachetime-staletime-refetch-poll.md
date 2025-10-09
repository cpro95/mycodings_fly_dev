---
slug: 2023-07-17-react-query-cachetime-staletime-refetch-poll
title: React Query 강좌 2편. 캐시로 움직이는 useQuery 작동 원리 - cacheTime, staleTime, refetchOnMount, polling(refetchInterval)
date: 2023-09-17 08:31:33.528000+00:00
summary: cacheTime vs staleTime, 그리고 refetch와 polling
tags: ["react-query", "react", "usequery", "cacheTime", "staleTime"]
contributors: []
draft: false
---

안녕하세요?

두 번째 React Query 강좌 시리즈입니다

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

1. [useQuery의 cacheTime 캐시 시스템](#1-usequery의-cachetime-캐시-시스템)
2. [isFetching 주기는 staleTime으로 지정 가능](#2-isfetching-주기는-staletime으로-지정-가능)
3. [refetch 방법 바꾸기](#3-refetch-방법-바꾸기)
4. [강제로 refetch 하기(Polling)](#4-강제로-refetch-하기polling)
---

## 1. useQuery의 cacheTime 캐시 시스템

지난 시간에는 react-query의 맛보기로 예전보다 훨씬 쉽게 React에서 data fetching 작업을 했었는데요.

그래서 React-Query는 실제로 현재 가장 좋은 Server Side State 관리 툴입니다.

그럼, react-query의 useQuery 훅이 어떤 방식으로 작동하는지 살펴봐야 하는데요.

결론은 소제목에서도 알 수 있듯이 캐시 시스템으로 움직입니다.

지난 시간에 만든 ReactQuery.jsx 파일을 수정해서 작업해 나가도록 하겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhiGRfK-7rKIGcG8DUVYUXT8VrzJg7BBUon_OFKTS0sLUWyQRM1I0M-VJSh4mkK3S_zqhON4YpGFx1GPpibOWGF4wKu-XM8SSl_cJTRFwv91rMCiMeOfK9XPWBQBfKmxn5jhD3YyQEIIdAV1q5Fo4KghhB0EhiIm85OS6lsyTKvfZcNc4vz2R3VeZjD0lM)

위 그림에서 보듯이 'get-product'라는 queryKey라는 이름이 있는데요.

react-query는 이렇듯 queryKey 라는 이름으로 캐시를 구분 짓습니다.

useQuery로 처음으로 data를 fetching하게 되면, 실제 해당 API 서버로 이동합니다.

그리고 사용자가 지정한 queryKey 이름으로 해당 결과를 캐시로 저장하는데요.

그리고 사용자가 다른 라우팅으로 갔다가 다시 react-query의 useQuery가 있는 라우팅으로 오면 이번에는 그냥 캐시에 있던 내용을 돌려보내줍니다.

그래서 isLoading 값이 false가 되면서 Loading... 문구가 보이지 않게 됩니다.

캐시에서 결과를 바로 얻었기 때문에 isLoading 값이 거짓이 되는 거죠.

그러면 실제 API 값이 변경되었다면 어떻게 될까요?

react-query는 백그라운드에서 사용자가 모르게 isFetching 하고 있습니다.

즉, 계속 백그라운드로 API 호출을 해서 캐시에 있는 데이터를 최신화시키는 거죠.

그래서 isLoading은 false로 거짓이 되지만 isFetching이라는 값은 true로 변하게 됩니다.

코드를 다음과 같이 바꿔 보겠습니다.

```js
const { isLoading, isFetching, data, isError, error } = useQuery(
  'get-product',
  fetchProducts,
)

console.log({ isLoading, isFetching })
```

useQuery는 isFetching 값도 리턴 해 주는데요.

이제 콘솔 창을 유심히 살펴보겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiNZlG71HXr8Gy3Z9L_SKC4VsQPKdxBsIp9YXdMQOt1pZANT5FyZxabUo8ChHWRWLP0YE4jauQabJKuzHb7UqugxbbaHs34A0szcFJvEgthHiUX4Pl2jOJ4Mx-jNGA3Cin67CC5PvC-kwQt6s6EPLLYqtvpX7k4e5cQO3-ZwxCpJj098s3z3q5eluMlw6k)

일단 위와 같이 나오는데요.

리액트 개발 서버라 콘솔 로그가 두 번 나옵니다.

위 그림처럼 처음 react-query를 실행하면 isLoading과 isFetching 두 개가 true가 됩니다.

isFetching은 서버에 연결해서 데이터를 fetching 하고 있다는 뜻이죠.

일단 Data Fetching 작업이 끝나면 isLoading, isFetching 값은 모두 false가 됩니다.

그런데, 이 상태로 pocketbase에서 monitor 항목의 가격 값을 변경해 보면 변경 된 값이 아래 그림과 같이 업데이트 됩니다.

아무 버튼도 누르지 않았는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhNi_VpHxXJqqgaRvEOH_W0lm9-bBek9jFvdtsezFqEPnZUYd5fV9w83RdXMlX0M6mxdK8nKhH57s0pUmra7ROh6xsSFFgpvntRdDcjYDINPabZ-57-giN2wwpeSp-oO3o9rF7OLAKwW0jUop-GHwWSt_g77Ec3dJI17nh4yMySmEZVi0fplfmQ2OKrUS0)

즉, 백그라운드에서 계속 cacheTime이 지나면 isFetching 하고 있다는 얘기입니다.

위 그림에서 보듯이, 백그라운드에서 react-query가 계속해서 API 호출을 통해 캐시를 업데이트하고 있습니다.

물론, Home으로 옮겼다가 다시 돌아와도 isLoading은 false를 유지하고 있을 겁니다.

왜냐하면 isFetching으로 계속해서 'get-product'라는 캐시의 값을 업데이트해 주고 있으니까요!

그래서 실제 사용자는 Loading... 문구도 보지 못할 정도로 빠른 데이터를 화면에 바로 볼 수 있는 거죠.

그러면 'get-product'같은 캐시의 기본 유지 시간은 얼마일까요?

바로 5분입니다.

useQuery는 세 번째 인자로 객체를 받을 수 있는데요.

여기서 각종 옵션을 수정할 수 있습니다.

캐시의 기본 시간은 cacheTime 값으로 수정할 수 있습니다.

```js
const { isLoading, isFetching, data, isError, error } = useQuery(
  'get-product',
  fetchProducts,
  {
    cacheTime: 5000,
  },
)
```

위와 같이 cacheTime을 5000으로 주면 5초가 캐시타임입니다.

캐시타임이 5초라는 얘기는 아래 그림을 보고 설명드리겠습니다.

테스트를 위해 크롬에서 리로드 아이콘을 오래 누르고 있으면 아래 그림처럼 캐시까지 지우고 다시 리로드 하라는 옵션이 있는데요.

이 옵션도 ReactQueryDevTools에서 제공하는 기능입니다.

이걸 사용하셔야 합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhJVIxarG7J30MGnZn9xgSNX8bFGfIO_QvLK6Y1Iweh841fvQAubsxfeG2cOimyCZWW1PoFaf3HS5lCoH7mRswFjImtFD4OTgcHp73AWaOnkpg8so4VBigScjMl1fDAirFRJyo9N3TMa8h7ScqWHd4EQ44uSw49cAexpyIyO_u1hY0EpNZddayJpGcJ_C8)

이제, react-query가 있는 곳을 클릭하면 아래와 같이 ReactQueryDevTools에서 'get-product'라는 캐시가 보일 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiX4CXx1vLVJ-p6jhWDPKIzH538og496fqDOLxW4CtNJEVTcqZVpt39onafhpFSFKU_Y64MFRB1a9d0tj6gyz6N-nuoFSX0QOS0p1geOpBJzOXmh782swl-RyqaZPBhV4A9esxZNm84fXeRHFD3k4CN8Yd0s_hg-ION1oqZRuLMMD49GHWxXEZC2HDrrqg)

react-query의 useQuery가 있는 페이지에 계속 있으면 캐시타임도 소용 없어집니다.

그래서 'get-product' 캐시는 계속 남아 있는데요.

라우팅을 Home으로 이동해 보겠습니다.

그러면 5초 후에 아래처럼 'get-product' 캐시가 사라집니다.

즉, 'get-product' 캐시는 가비지 컬렉팅(Garbage Collecting)됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgheH3PUFN5eo2N0w3uZZLqo-qc9Jch77vmbcK_huxg1hAmSF__2XlH_uRLXYqFKvF44sMwNoutom3j7lWWEGOWRwDsGb2-Ta7yw2i53Cugu9WqeVZUWBghffHOkG4YS_MecdfsSyxHNfTtlCdDarMmDilGzogGh1ufPIILYuG0umftV4Ty71aZIwydG10)

위 그림에서 보이면 'get-product'라는 캐시가 사라진 게 보일 겁니다.

즉, 캐시에서 없어졌다는 뜻이죠.

캐시 타임(cache Time)이 5초로 설정되어 있어서 그런 겁니다.

그러면, 가장 좋은 cacheTime은 얼마일까요?

5분이 가장 좋다고 대다수 개발자가 동의해서 그런지 디폴트 값으로 5분이 세팅되어 있으니 굳이 cacheTime 옵션을 신경 쓰지 않아도 될 듯합니다.

---

## 2. isFetching 주기는 staleTime으로 지정 가능

react-query가 백그라운드에서 주기적으로 isFetching 하는 시간을 지정할 수 있는데요.

바로 staleTime입니다.

먼저, stale이라는 문구가 생소할 거라고 보는데요.

fresh와 반대말입니다.

stale은 채소나 음식이 시간이 지나서 신선하지 않다는 뜻입니다.

즉, 데이터가 시간이 지나서 최신상태가 아니다는 뜻이죠.

그러면, staletime 효과를 직접 눈으로 확인해 볼까요?

```js
const { isLoading, isFetching, data, isError, error } = useQuery(
  'get-product',
  fetchProducts,
  { staleTime: 60000 },
)
```

위와 같이 staleTime을 60000 즉, 60초로 줬습니다.

그러면 아래 그림과 같이 처음 react-query가 있는 화면으로 가면 ReactQueryDevTools에서 fresh라는 상태에 있는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgsffiSsGj-rWHkv_B5_LvCwFnw8EgM0q6NJPGjy9SblHzqRFo4xJAsqC3xNoZzINjsxVLNYzPs18JTV7zCPDibspRh4qBuOajA65VC2zb1wRb9zbU5OVEyfwvVk0UyetFqo29A71z9kG3gpfbWW5gIRw8tQyyhcfnwLz6a9Mmcd7LD-FHbo_ShmHBnG1A)

60초가 지나면 아래와 같이 stale 상태로 바뀝니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgo8NwebuxrwS5hEmFH5XPLIewwDjQIVToSJB73G6Vwzii1AKdDaxm77fPVIKnH4zjp6eSd-ZLV6-y0XY_RGdZirOFV2043j4LFV6xrp9czDPQJk5XDNqdkZM1LI8tv5HRscVIdQWXH9zZ1P58YEvCiTwE6NykbEzVe8JYkICFuaJfmOM7BjeaESVOlKnw)

예를 들면, fresh 상태일 때 백엔드 서버인 pocketbase에서 monitor 항목의 가격 값을 변경시켜도 화면에서는 변화가 없습니다.

staleTime 값이 60초로 세팅되어서 그런 겁니다.

60초 후에 정확히 브라우저에서 monitor 가격이 바뀌게 되는데요.

바로 이 staleTime으로 백그라운드에서 일어나는 isFetching 을 제어하기 때문입니다.

react-query의 캐시 상태는 아래 그림과 같이 총 4가지인데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiAzekKmLLskOYIGnlV6sH46HTKxblrYelOH975jsFeCwffUYKGSCTFauHxXP5qcCXQsQ1Dfh_BGN9OF6a4_teqOg3r2y6p0kfMxjgVh8AQKfoJhM89k8vzTdZBeD82GSmIqxFslxTin53QiZ2lzqTX9jcyhDHfB2aNg1dsPwQ09TyHiUqOCQkWwuz_pvQ)

작동 순서는 다음과 같습니다.

inactive -> fetching -> fresh -> stale

즉, Home 화면에 있으면 inactive가 되는 거고, ReactQuery 가 있는 곳으로 라우팅 되면 fetching이 일어나고 캐시 값이 fresh 상태가 되었다가 다시 stale 값으로 변하게 됩니다.

그러다가 백엔드 데이터가 변경되었다면 stale 상태에서 fetching 상태로 가고 다시 fresh 상태로 가게 됩니다.

백엔드에서는 staleTime 마다 계속 백엔드 값을 체크하는 겁니다.

그러면 staleTime의 기본값은 얼마일까요?

바로 0인데요.

그래서 계속 isFetching 으로 백그라운드에서 데이터 fetching이 일어났던 겁니다.

개발자는 staleTime을 잘 조절해서 무분별한 API 호출이 일어나지 않도록 해야 합니다.

보여주는 Data의 특성에 맞게 staleTime을 잘 조절하도록 합시다.

---

## 3. refetch 방법 바꾸기

지금까지 useQuery 의 세 번째 인자인 옵션 객체에 대해 알아봤는데요.

cacheTime, staleTime 외에도 여러 가지 옵션이 있습니다.

refetch 옵션에 대해 알아보겠습니다.

우리가 ReactQuery 가 있는 화면으로 가면 fetching 후에 캐시가 fresh가 된 다음, staleTime 후에 상태가 stale이 되는데요.

그러다가 다시 Home으로 잠시 이동 후에 다시 ReactQuery 가 있는 곳으로 가면 isFetching 값이 true로 바뀌면서 fetching 이 일어 납니다.

이게 왜 이렇게 되냐면 바로 refetchOnMount 항목이 true라고 기본값으로 세팅되어 있어서입니다.

```js
const { isLoading, isFetching, data, isError, error } = useQuery(
  'get-product',
  fetchProducts,
  { staleTime: 3000, refetchOnMount: false },
)
```

위와 같이 refetchOnMount 값을 false로 두면 Mount 됐을 때 fetching 작업이 일어나지 않게 됩니다.

여기서 Mount라는 건 ReactQuery 가 있는 리액트 컴포넌트가 Mount 됐다는 뜻입니다.

refetchOnMount 값으로 문자열 'always'가 올 수 있는데요.

아래와 같이 'always' 값으로 설정하면

```js
const { isLoading, isFetching, data, isError, error } = useQuery(
  'get-product',
  fetchProducts,
  { staleTime: 3000, refetchOnMount: 'always' },
)
```

마운트 됐을 때 staleTime 값과 상관없이 항상 refetch 한다는 뜻입니다.

기본값은 true이니까 그냥 둬도 될 듯싶네요.

두 번째, refetch 관련 옵션은 refetchOnWindowFocus 항목입니다.

```js
const { isLoading, isFetching, data, isError, error } = useQuery(
  'get-product',
  fetchProducts,
  { staleTime: 30000, refetchOnMount: 'always', refetchOnWindowFocus: true },
)
```

기본값은 true인데요.

즉, 브라우저 활성화 되었느냐 아니냐에 따라서 refetch 방식을 결정하는 겁니다.

여기에도 true, false 외에 'always'가 올 수 있습니다.

refetch 옵션은 웬만하면 그냥 설정 안 하셔도 되니까 알고만 계시면 될 거 같네요.

---

## 4. 강제로 refetch 하기(Polling)

React Query를 사용하여 Polling(정기적 데이터 가져오기)을 할 수 있는데요.

Polling은 주기적으로 데이터를 가져오는 프로세스를 말하는데요.

즉, 예를 들어 주식 거래 앱을 만든다고 할 때, UI에 보이는 값을 실제로 실시간 주식 가격 데이터와 동기화하려는 경우에 사용됩니다.

이 Polling 작업은 React Query에서는 refetchInterval이라는 옵션으로 수행할 수 있는데요.

refetchInterval 값은 기본값이 false입니다.

즉, refetchOnMount 나 refetchOnWindowFocus 옵션에 의해 ReactQuery 가 refecth를 수행하도록 놔두는 거죠.

이 말은 유저의 행위에 의존한다는 뜻입니다.

유저가 ReactQuery가 있는 컴포넌트를 클릭했을 때나, 아니면 마우스를 다시 ReactQuery가 있는 컴포넌트로 옮겼다라든가, 이런 행위로 인해 refetchOnMount, refetchOnWindowFocus 옵션이 영향을 받게 됩니다.

반대로, 유저의 행위와는 별도로 Polling 작업을 수행할 수 있는 옵션이 바로 refetchInterval이라는 옵션입니다.

이 항목 값으로 기본값인 false 외에 숫자를 넣을 수 있습니다.

2000이라는 숫자를 넣으면 2초마다 fetching이 일어난다는 뜻이죠.

Polling은 주기적으로 데이터가 변경되는 앱에서 매우 유용한데요.

앱이 포커스를 잃을 때에도 데이터를 정기적으로 가져오려면 백그라운드에서 다시 가져오기 간격을 설정할 수 있습니다.

바로 refetchIntervalInBackground 항목인데요.

기본값은 false입니다.

이 값을 true라고 바꾸면 앱이 비활성화되었더라도 백그라운드에서 fetching 작업이 계속 일어날 겁니다.

```js
const { isLoading, isFetching, data, isError, error } = useQuery(
  'get-product',
  fetchProducts,
  {
    refetchInterval: 2000,
    refetchIntervalInBackground: true,
  },
)
```

위와 같이 코드를 짜면 ReactQueryDevTools 에서 보시면 2초마다 fetching과 stale 상태로 왔다 갔다 하는 걸 보실 수 있을 겁니다.

---

