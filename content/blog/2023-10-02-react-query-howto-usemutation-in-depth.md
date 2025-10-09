---
slug: 2023-10-02-react-query-howto-usemutation-in-depth
title: React Query 강좌 8편. useMutation 사용법과 Optimistic Updates
date: 2023-10-02 11:07:53.455000+00:00
summary: React Query에서 useMutaion 사용법과 최상의 UX를 위한 Optimistic Updates 구현하기
tags: ["react query", "useMutation", "Optimistic Updates"]
contributors: []
draft: false
---

안녕하세요?

여덟 번째 React Query 강좌 시리즈입니다

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

1. [useMutaion 기본 사용법](#1-usemutaion-기본-사용법)

2. [POST 액션 후 바로 쿼리 갱신시키기](#2-post-액션-후-바로-쿼리-갱신시키기)

3. [invalidateQueries 말고 setQueryData로 직접 쿼리에 데이터 추가하기](#3-invalidatequeries-말고-setquerydata로-직접-쿼리에-데이터-추가하기)

4. [Optimistic Updates 구현](#4-optimistic-updates-구현)
---

## 1. useMutaion 기본 사용법

React Query를 이용해서 Data를 POST 할 수 있는데요.

이때 사용하는 React Query의 훅이 useMutaion입니다.

리액트에서 POST 액션을 위한 기본적인 input, button을 만들어야겠죠.

기존 ReactQuery.jsx 파일에 아래와 같이 추가합시다.

```js
import { useState } from "react";
...
...
...

export const ReactQuery = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);

  ...
  ...
  ...
  const handleCreate = () => {
    console.log({ name, price });
  };

  return (
    <>
      <div className="text-4xl">ReactQuery</div>
      <div className="space-x-2">
        <input
          className="border"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border"
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
        <button className="border" onClick={handleCreate}>
          Create
        </button>
      </div>
      ...
      ...
    </>
  );
}
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEhrnf2W5xGabw9qxCL9yoIhNPGlxCaJkcRiGRjROm32yI4n0Ppv6Ar0j_CJ6WI9t8g_o4Cp355Z9oqwC1kcIS97zO-3jwQCtl0IboA1uq7UF1dUBcCZMlxO3Any-5CiFSIamD-WIXSeSzZE-TSvZlFTzTVXlll05R59a4RdQ7VaDw4hffe4sOwK_e1MP6M)

위와 같이 나오네요.

콘솔창에 우리가 입력했던 데이터도 잘 출력되고 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjrlYS3gINlA29eO5NogbPIV7nPpJkXQrVIiRzEBy-OoRDYuHsFjJ3eK7ahTCcl9l74gKke8Vgkm48mh3M4ZN-d15ex_jysmuSAzMelNE1w0OJ8EqMcbZIOmMJMG14KZGCFa2DsfYMbudJzPqlau05fVYRHem5BGj4IT3O_FnSLl6Mjtj2rJvieqkUzJuA)

UI를 완성했으니까 이제, useMutaion 코드를 작성해야 하는데요.

먼저, 기존에 사용했던 `/src/hooks/useProductName` 파일에 커스텀 useMutaion 훅을 만들어 보겠습니다.

참고로 기존의 fly.io 서버 말고 로컬에서 돌리는 pocketbase 서버를 이용했습니다.

```js
import { useQuery, useMutation } from "react-query";

...
...
...

const addProduct = (product) => {
  return axios.post(
    "http://127.0.0.1:8090/api/collections/products/records", product
  );
};

...
...
...
export const useAddProduct = () => {
  return useMutation(addProduct)
}
```

우리가 만들 커스텀 훅은 단순하게 그냥 useMutaion 훅을 리턴하면 되는데요.

useMutaion이 받는 인자는 POST 액션을 위한 axios 콜백함수면 됩니다.

그냥 콜백함수만 넘기면 됩니다.

이제, 우리가 만든 커스텀 useAddProduct 훅을 ReactQuery.jsx 컴포넌트에서 사용해 볼까요?

```js
import { useProductName, useAddProduct } from './hooks/useProductName'
...
...

const { mutate: addProduct } = useAddProduct()

const handleCreate = () => {
  console.log({ name, price })
  const data = { name, price }
  addProduct(data)
}
```

useAddProduct 훅에서 useMutation 훅을 받는데 거기서 mutate라는 함수만 받습니다.

그리고 mutate 함수의 이름을 addProduct라고 alias 형태로 새로 이름 지었습니다.

그리고 마지막으로 handleCreate 함수에서 addProduct 함수를 실행시키면 됩니다.

addProduct 함수에 우리가 입력받았던 데이터를 객체 형태로 인자로 넣어주면 되죠.

테스트를 해보면 나중에 밑에 추가된 리스트가 보입니다.

왜냐하면 React Query의 useQuery 훅에 의해 백그라운드에서 fetch가 계속 일어나고 있으니까요.

그래서 우리가 DB에 업데이트된 게 보일 겁니다.

그러면 pocketbase 서버에 제대로 되어 있는지 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEi1vcCH2FwiZ6Ijeg8Yw3fpFFP0YH1-JclDgJQUpKVKeRlXXh0RXqcS7-IR50AMT2YZOSUSdQr9NPrXlHLkVVayYtOKxWMcdRQoUF--xwLJ9F0JS8QvyvYxomZzG4uGgLDTIALE8dCH8rN1YDZlgWYkEsiqWmy35i-riZr725T-7Mh-hlmuBP7oqfragM4)

위와 같이 정상 작동하네요.

pocketbase의 POST 액션 작동을 위해 API Rule을 아래와 같이 다 오픈해주면 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjSiqdHn-vzG-3ap-HujQ_18-IZ4bw5RLSejfCh8I1HxzvXm5qAxIQSNs4F709aiSmxKrE3SPhWCzKlLEcQcuUaE2wJMMb-6s0CtKBWcb3_tbYzKp6jelsCbadQniW80MFdICINBiTP5xibKvWrD5muqDFyUGxb8QwEg6J6x9rDkGJ6cOuZHzCFbrE-pzo)

위와 같이 해주시면 API를 이용해서 POST, DELETE, PUT 등 여러 가지 HTTP 액션을 이용할 수 있습니다.

---

## 2. POST 액션 후 바로 쿼리 갱신시키기

위에서 새로운 아이템을 추가하는 버튼을 누르면 백그라운드로 React Query가 fetching 하게 되는데요.

조금 시간이 걸립니다.

유저 입장에서는 조금 난감한 상황인데요.

빠른 반응을 위해 useMutaion 이 성공했을 때 바로 쿼리를 갱신하는 방법이 있습니다.

바로 우리가 useQuery로 등록했던 쿼리 이름(queryKey)를 이용해서 invalidate 하는 방식인데요.

다음과 같이 하면 됩니다.

커스텀 훅으로 만들었던 useAddProduct 훅을 아래와 같이 고치면 됩니다.

```js
import { useQuery, useMutation, useQueryClient } from 'react-query'

export const useAddProduct = () => {
  const queryClient = useQueryClient()
  return useMutation(addProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries('get-product')
    },
  })
}
```

useMutaion 함수는 두 번째 인자로 옵션 객체를 받을 수 있는데요. 여기서 onSuccess 항목을 이용한 겁니다.

useQueryClient를 이용해서 메모리상의 queryClient 객체를 얻어서 바로 invalidateQueries 함수를 실행하는 건데요.

invalidateQueries 함수에는 우리가 useQeury 훅을 이용해서 만들었던 queryKey를 넣어주면 됩니다.

invalidateQueries 함수는 queryKey의 쿼리를 즉시 무효화 시키고 다시 fetching 시키게 되는데요.

그래서 POST 액션 후에 잠깐의 시간 지체없이 바로 화면에 업데이트된 정보가 보이게 됩니다.

---

## 3. invalidateQueries 말고 setQueryData로 직접 쿼리에 데이터 추가하기

invalidateQueries를 이용하면 메모리에 있던 쿼리가 다시 fetching 하게 되는데요.

여기서 우리가 입력했던 데이터를 우리가 알고 있기 때문에 클라이언트 상에서 메모리의 쿼리에 직접 데이터를 업데이트하여 useQuery가 feching을 하지 않게 만들 수 있습니다.

즉, POST 액션 후에 GET 액션이 무조건 일어나는데 POST 액션 후에 일어나는 GET 액션을 방지하는 거죠.

불필요한 GET 액션을 없애는 건데요.

기존 useAddProduct 커스텀 훅에 아래와 같이 작성하면 됩니다.

```js
export const useAddProduct = () => {
  const queryClient = useQueryClient()
  return useMutation(addProduct, {
    onSuccess: data => {
      // queryClient.invalidateQueries("get-product");
      queryClient.setQueryData('get-product', oldProductData => {
        return {
          ...oldProductData,
          data: [...oldProductData.data.items, data.data],
        }
      })
    },
  })
}
```

위 코드에서 data 항목에 ...oldProductData.data.items라고 쓴 이유는 제 pocketbase의 데이터가 items 항목안에 있어서 그런겁니다.

즉, pocketbase가 리턴하는 데이터에서 items가 우리가 원하는 배열이기 때문입니다.

다른 DB를 사용하시면 꼭 data 객체 밑에 배열인 부분을 꼭 찾으시기 바랍니다.

실행 결과는 아래와 같습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjSj4NhMFx3aR10qZdNhbIuNTJjzZrp_6rEkFSK1My2HqWXnufEAJ0hYIF2pkPkf3XualJ8GIjaXnCKEoIl8t1BY8V72YAfjJMRyffKJq9fedJr7EtnsdLVX94xp2e8cG7_icYRM4nAIr24P8DT82-OBu2uLH8v78nQx38a613sp9kFgpoP7WE2--3pqNE)

위와 같이 실행 결과를 보시면 queryClient의 setQueryData 함수로 직접 데이터를 추가했습니다.

그리고 추가된 데이터는 DEV Tools에서 보듯이 추가가 완료되어 나오고 있네요.

---

## 4. Optimistic Updates 구현

가장 이상적인 POST 액션은 클라이언트 상에서 유저가 입력을 마치고 버튼을 누르면 바로 화면에 반응이 나타나고,

실제 POST 액션은 백그라운드로 실행되는 것을 뜻합니다.

그리고 이런 걸 바로 Optimistic Updates라고 하는데요.

React Query를 이용해서 Optimistic Updates를 구현해 보겠습니다.

이때 사용하는 콜백이 바로 onMutate와 onError, onSettled 인데요.

아래와 같이 각각 구현해 보겠습니다.

그리고, async 방식을 사용해야 합니다.

```js
import { v4 as uuid } from 'uuid';
...
...
...
export const useAddProduct = () => {
  const queryClient = useQueryClient();
  return useMutation(addProduct, {
    // onSuccess: (data) => {
    //   // queryClient.invalidateQueries("get-product");
    //   queryClient.setQueryData("get-product", (oldProductData) => {
    //     return {
    //       ...oldProductData,
    //       data: [...oldProductData, data.data],
    //     };
    //   });
    // },
    onMutate: async (newProduct) => {
      await queryClient.cancelQueries("get-product");
      const previousProductData = queryClient.getQueryData("get-product");
      queryClient.setQueryData("get-product", (oldProductData) => {
        return {
          ...oldProductData,
          data: [...oldProductData.data.items, { id: uuid(), ...newProduct }],
        };
      });
      return {
        previousProductData,
      };
    },
  });
};
```
onMutate 항목에서 중요한 점은 setQueryData의 콜백함수에 리턴되는 항목을 잘 보시면 data 부분에 oldProductData.data.items라고 되어 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjXgKUdOWRLYGbdWRrmGIfda2ilIqxDnxc30qU87klyv3sH7buJPtV7UsZ8eNvbaiEYeLS-eZCIESenanADO3nzqy_tNkXg31MIdwdNltCsjyZLfk9MgkD4wLteQMTEAtVnFuXK0ZPq3pq24CsVermi34u3FIX6N8RGrw_PsZNTi318NinMUttdOKkc6LE)

저는 pocketbase를 사용했기 때문에 위 그림과 같이 data 다음에 items라는 항목이 더 있는데요.

실제 items 항목이 배열로써 iterable한 데이터가 되는 겁니다.

그래서 ...oldProductData.data.items라고 사용했습니다.

본인이 사용하는 DB가 리턴하는 JSON 데이터의 형식을 꼭 확인하고 숙지해야 하는 거죠.

일반적으로 React Query는 객체 뒤에 data 항목을 이름으로 이용하기 때문에 꼭 ...oldProductData.data 라고 써야 합니다.

먼저, onSuccess는 사용하지 않을 거라 주석 처리하시면 됩니다.

그리고 onMutate 항목을 async로 작동되게 하고, 위와 같이 작성하시면 되는데요.

작동 원리는 'get-product' 쿼리를 먼저 취소하고, 그다음 예전 'get-product' 데이터를 previousProductData에 불러옵니다.

그리고 setQueryData를 이용해서 직접 데이터를 수작업으로 쿼리에 업데이트하는데요.

여기서 중요한 거는 바로 pocketbase의 id 부분인데요.

pocketbase의 id는 아래 그림과 같이 랜덤 텍스트인데요.

uuid 패키지를 이용해서 만들면 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjSj4NhMFx3aR10qZdNhbIuNTJjzZrp_6rEkFSK1My2HqWXnufEAJ0hYIF2pkPkf3XualJ8GIjaXnCKEoIl8t1BY8V72YAfjJMRyffKJq9fedJr7EtnsdLVX94xp2e8cG7_icYRM4nAIr24P8DT82-OBu2uLH8v78nQx38a613sp9kFgpoP7WE2--3pqNE)

그래서 위와 같이 직접 id 부분을 uuid로 작성해야 합니다.

```bash
npm i uuid
```

마지막으로 previousProductData 를 리턴해 주는 이유는 onError 항목에서 처리하기 위합니다.

즉, 실제 POST 액션이 에러가 나서 취소가 됐을 때 원상복구하기 위함입니다.

```js
onError: (_error, _product, context) => {
  queryClient.setQueryData('get-product', context.previousProductData)
}
```

onError 항목은 간단한데요.

인자로 첫 번째는 error 객체, 두 번째는 사용자가 입력한 데이터, 세 번째가 바로 query 컨텍스트입니다.

위와 같이 previousProductData로 원상복구(setQueryData)하시면 됩니다.

세 번째, onSettled 항목만 남았네요.

onSettled 항목이 실행되는 조건은 POST 액션이 에러가 났거나 아니면 성공했을 때 실행되는 항목입니다.

그래서 onSettled에서는 단순하게 'get-product' 쿼리를 무효화시켜서 쿼리를 다시 fetching 하게끔 하면 됩니다.

```js
export const useAddProduct = () => {
  const queryClient = useQueryClient()
  return useMutation(addProduct, {
    onMutate: async (newProduct) => {
      await queryClient.cancelQueries("get-product");
      const previousProductData = queryClient.getQueryData("get-product");
      queryClient.setQueryData("get-product", (oldProductData) => {
        return {
          ...oldProductData,
          data: [...oldProductData.data.items, { id: uuid(), ...newProduct }],
        };
      });
      return {
        previousProductData,
      };
    },
    onError: (_error, _product, context) => {
      queryClient.setQueryData('get-product', context.previousProductData)
    },
    onSettled: () => {
      queryClient.invalidateQueries('get-product')
    },
  })
}
```

이제 테스트해 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEjK84I4MxFT6rLmQZxHTjDI5xAaAeCQiMvlGr08lqTVUVuW99kIiVLDQN6GA9maSDWRaRvl7uOF4MejRLYqKeb7cr2jXHjJSyIvGqOFfjA6xYHYeds6raqnHV0CSfJQ8vcoJdUGlaPtWKs4vXewh1LLO3uXbI5uu2n2BKlqDAtgOFEPQsYEqpRaw-0es94)

위와 같이 입력하면 아래와 같이 DEV Tools에 바로 data가 업데이트됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEg8SPKZJn_UGpdglcLOsNsk2mS3HPBayNRd8n3OaF3-LhTgiGRtwSh14y-Q5MhWUZiwM6HxSsvJ9Y2HPmHNGLa_i6yiBU3Aq0wRwm7SCOLZeHerOPCZBTHyi-Lso4gowIsQkUCGJw0bSQWTDq0dfKg7-VFwmO1IWxGvFUk68E32kcZuw4C5QDaR3Kt0jiE)

그리고 pocketbase DB도 살펴볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEhgh5K6QjkzfeBVvZhG8jgXk4LgFT-GRKKR05ApCNkWVXl18oIWeiXvnwUl0dYeGzW01B8Edgs8rDM9loU2idNKqoxiiQmhNuKmCmCp9Tb9puO52IgdwZi6WAQ-rc8mv5qC7Z_Rs_duKv65Qlhao_OtfyahbPm1j8BNfVUsWk5sn2ie0xB99rqQqDQiVPk)

위와 같이 정상 작동되고 있네요.

---

지금까지 useMutaion을 사용하는 기본적인 방식을 배웠는데요.

위와 같이 Optimistic Updates 방식 말고도 여러 가지 방식이 있으니 꼭 여건에 맞는 방식을 사용해서 유저 경험을 조금 더 빠릿하게 해주시기 바랍니다.

