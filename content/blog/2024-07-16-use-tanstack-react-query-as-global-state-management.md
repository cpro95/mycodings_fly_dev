---
slug: 2024-07-16-use-tanstack-react-query-as-global-state-management
title: React Query로 구현하는 간단하고 강력한 상태 관리 솔루션
date: 2024-07-16 12:49:15.747000+00:00
summary: React Query를 활용하여 Redux나 Zustand 대신 간단하고 강력한 상태 관리 시스템을 구현하는 방법을 소개합니다. 기존 데이터 페칭 라이브러리를 사용해 비동기 상태 관리도 함께 다루어봅니다.
tags: ["tanstack query", "react", "react query", "state management"]
contributors: []
draft: false
---

안녕하세요!

오늘은 리액트 애플리케이션에서 상태 관리를 다루는 새로운 방법을 소개해드리려고 합니다.

우리가 흔히 알고 있는 Redux, Zustand, MobX 같은 전통적인 상태 관리 라이브러리 대신, 조금 색다른 접근법을 사용해볼 건데요.

물론 라이브러리를 사용하긴 하지만, 일반적으로 상태 관리에 쓰이지 않는 것을 활용할 겁니다.

자, 이제 본격적으로 시작해볼까요?

```sh
➜ npm create vite@latest react-state-management-test
Need to install the following packages:
create-vite@5.4.0
Ok to proceed? (y)
✔ Select a framework: › React
✔ Select a variant: › TypeScript

Scaffolding project in /Users/cpro95/Codings/blog/react-state-management-test...

Done. Now run:

  cd react-state-management-test
  npm install
  npm run dev

npm notice
npm notice New minor version of npm available! 10.5.0 -> 10.8.2
npm notice Changelog: https://github.com/npm/cli/releases/tag/v10.8.2
npm notice Run npm install -g npm@10.8.2 to update!
npm notice
➜ cd react-state-management-test
➜ npm install
➜ npm run dev
```

위 터미널에서 보시는 것처럼 아주 간단한 애플리케이션을 준비했습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgatC7D7SZM-q6in4JOPjbC4tCrJzA00vIxXma2Wf3CWldmxZ84-wxmcEKk_wc3UcskK_z1ONtrio060GVCaFxiqNF5Zcaws4xylsIyFQxyA3m-Z7UBb-_B1Ln4rYvTVoMv0SRRthCt3RZvOioUXLr7zTdAf6YwdkzbFFQO22Z_5-NgXv0x2Djdowne6_0)

지금은 위 그림처럼 `Vite + React` 앱처럼 아무것도 없지만, 이제부터 리액트에서 상태를 관리하는 방법을 알아 보겠습니다.

앞서 말씀드렸듯이, Redux나 Zustand, MobX 같은 전통적인 상태 관리 라이브러리는 사용하지 않을 겁니다.

대신 다른 것을 사용할 건데요, 바로 `Tanstack Query`, 예전이름으로는 `React Query`입니다. 

`React Query`를 이용해서 간단하면서도 강력한 상태 관리 솔루션을 구현해볼 생각입니다.

이 방법은 Redux나 Zustand에서 볼 수 있는 것과 비슷한 수준의 기능을 제공할 수 있는데요.

많은 개발자들이 모르는 사실이지만, React Query는 단순히 데이터를 가져오는 라이브러리가 아닙니다.

물론 데이터 fetching에 주로 사용되긴 하지만, 공식 문서에서도 볼 수 있듯이 React, Solid, Vue, Svelte, Angular를 위한 강력한 비동기 상태 관리 솔루션입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiqRSC47KNzGOCjZQJRI7_L6wXFZN6GZUvtKYDz_PMiiP1bUI7HO9wpVsakLV5ZoX3onzKnmd_CRJypnZnbw0Wmf0vSN9E_DbXEmfZLmpna9J2gQfwkTVI-sDFovnK-GOKABRksL4rBQGooYTj60aGcYNXn8DSqAkhKsKpz0gIXgrENTHLY8-iXtFwFuhg)

TanStack Query 홈페이지에서 캡쳐한 위 그림을 보시면 중요한 점은 이게 'Powerful asynchronous state management(비동기 상태 관리)'라는 겁니다.

단순히 데이터 fetching이 아니라, 비동기 작업을 다루는 상태 관리라는 거죠.

즉, 우리가 원하는 상태 관리 솔루션을 만드는 데 완벽하다는 얘기입니다.

이제 React Query를 이용해 상태 관리를 어떻게 구현하는지 보여드리겠습니다.

이 방법은 매우 간단하고 효율적이며, 필요하다면 복잡한 애플리케이션으로 확장할 수도 있습니다.

물론 꼭 React Query를 이용해서 상태 관리를 할 필요는 없지만, 원한다면 충분히 가능한 훌륭한 솔루션입니다.

먼저, Tanstack Query를 설치합시다.

```sh
npm i @tanstack/react-query
```

먼저 src 폴더 안에 'state'라는 새 폴더를 만듭니다.

이 폴더에 React Query를 이용한 상태 관리 솔루션에 필요한 모든 파일을 넣을 예정인데요.

먼저, 이 폴더 안에 'index.ts' 파일을 만듭니다.

이게 우리의 상태 관리 솔루션의 메인 파일이 될 겁니다.

여기에 상태를 만드는 함수를 작성할 건데, 이 함수가 상태 생성의 모든 로직을 처리할 겁니다.

그리고 이 함수를 이용해 개별 상태들을 만들고, 그걸 애플리케이션의 여러 컴포넌트에서 공유해서 사용할 수 있습니다.

자, 이제 'createGlobalState'라는 함수를 만들어 만듭시다.

이 함수는 특이하게도 그냥 함수를 반환할겁니다.

전체적인 윤곽은 아래와 같습니다.

```typescript
export function createGlobalState() {
    return () => {
      // 나머지 로직이 여기에 들어갈 거예요
    }
}
```

`createGlobalState` 함수는 전역 상태를 만드는 데 사용할 거고, 반환되는 함수는 개별 컴포넌트에서 사용하게 될 겁니다.

모든 React Query 관련 상태 관리 로직은 이 내부 함수에 들어갈 건데요.

먼저, React Query의 캐시를 조작할 거기 때문에, 이 함수 내에서 queryClient에 접근할 수 있어야 합니다.

그래서 useQueryClient 훅을 사용할 겁니다.

```typescript
import { useQueryClient } from '@tanstack/react-query';

export function createGlobalState() {
  return () => {
    const queryClient = useQueryClient();
    // 나머지 로직이 여기에 들어갈 거예요
  }
}
```

이 함수가 각 컴포넌트에서 커스텀 훅으로 사용될 거라서, 여기에 다른 커스텀 훅을 넣을 수 있습니다.

바로 훅의 규칙을 따르는 거죠.

그 다음으로 React Query의 가장 많이 사용되는 Hook인 useQuery를 사용할 겁니다.

```typescript
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function createGlobalState<T>(
  queryKey: unknown,
  initialData: T | null = null
) {
  return () => {
    const queryClient = useQueryClient();
    const { data } = useQuery({
      queryKey: [queryKey],
      queryFn: () => Promise.resolve(initialData),
      refetchInterval: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchIntervalInBackground: false,
    });

    return { data };
  };
}
```

여기서 queryKey와 initialData는 이 함수의 매개변수로 받을 건데요.

Tanstack Query에서 queryKey의 타입은 아래와 같습니다.

```ts
type QueryKey = ReadonlyArray<unknown>;
```

그래서 `createGlobalState` 함수의 매개변수로 첫번째 오는 queryKey 타입을 `unknown`으로 지정했습니다.

그리고 초기 데이터 값인 initialData는 타입스크립트의 제너릭을 이용해서 초기화 했습니다.

`T | null = null` 로 지정해서 T 아니면 null 인데, 초기값은 null인 타입이 되는겁니다.

이렇게 하면 개별 상태를 만들 때 queryKey와 초기 데이터(initialData는)를 지정할 수 있게 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjCWjutYdUAwIsNCW3rQ0vV9BQBk-JL2xcW0u-V2tEk7S_01ZO0QfZa9PfeFs08OLdJSIf_jPERPr51Ht9aoKiLi26iKLxWW5QoVwN9vWc9aEms61inQ8cUUYmviV2aNKgcA-Mboqud9w7hOIcvYf3GTXo27Pwv2ByXoUURDWBCu5D-NGmKrKTVvTMh8OE)

위 그림처럼 data의 타입은 `Awaited<T>` 또는 `null` 또는 `undefined`가 됩니다.

Awaited는 Promise라서 예상한 타입이 왔고, null 도 우리가 예상한 타입인데, `undefined`는 예상하지 못했는데요.

`undefined`는 useQuery 초기 실행때문에 생기는거라서 무시해도 됩니다.

그냥 `Awaited<T> | null` 타입이라고 보면 됩니다.

React Query는 주로 데이터 fetching에 사용되지만, 우리는 단순히 데이터 저장소로 사용할 겁니다.

그래서 queryFn 함수는 단순하게 Promise를 resolve만 합니다.

그리고 마지막으로 data를 리턴하면 됩니다.

그리고 자동 리페치 같은 기본 설정들을 비활성화할 필요가 있는데요.

아래와 같이 refetch 옵션을 false로 설정합니다.

```typescript
  refetchInterval: false,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  refetchIntervalInBackground: false, 
```

이제 데이터를 설정하고 초기화하는 함수를 만들어야 합니다.

```typescript
function setData(newData: Partial<T>) {
  queryClient.setQueryData([queryKey], newData);
}
```

위 코드를 보시면 setData 함수의 newData 타입이 Partial이라는 타입스크립트 유틸리티 타입을 써서 T 타입의 일부만 주어져도 setData가 작동하게끔 했습니다.

이론적으로 initialData에서 일부만 수정할 수 있으니까 Partial을 쓰는게 타당한거죠.

setData를 이용해서 상태 데이터를 업데이트하면 queryFn 함수가 작동하면서 캐시를 업데이트하는데, 우리가 만든 queryFn 함수는 그냥 Promise.resolve 함수라서 비동기식으로 데이터가 캐시에 업데이트됩니다.

두 번째로, resetData 함수입니다.

```typescript
function resetData() {
  queryClient.invalidateQueries({ queryKey: [queryKey] });
  queryClient.refetchQueries({ queryKey: [queryKey] });
}
```

위 코드를 보시면 invalidateQueries로 query를 초기화하고 다시 query를 refetchg 하는데요.

그러면 아까 useQuery에서 만든 queryFn 함수가 실행되서 초기 initialData 값을 리턴하는 Promise가 지정됩니다.

그리고, 마지막으로 지금까지 만든 함수들을 반환하면 됩니다.

```typescript
return { data, setData, resetData };
```

이렇게 해서 createGlobalState 함수가 완성됐습니다.

```ts
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function createGlobalState<T>(
  queryKey: unknown,
  initialData: T | null = null
) {
  return () => {
    const queryClient = useQueryClient();
    const { data } = useQuery({
      queryKey: [queryKey],
      queryFn: () => Promise.resolve(initialData),
      refetchInterval: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchIntervalInBackground: false,
    });

    function setData(newData: Partial<T>) {
      queryClient.setQueryData([queryKey], newData);
    }

    function resetData() {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.refetchQueries({ queryKey: [queryKey] });
    }
    return { data, setData, resetData };
  };
}
```

이 함수를 이용해 개별 상태를 만들고, 컴포넌트에서 사용할 수 있게 되는 거죠.

이제 실제로 이 함수를 사용해 상태를 만들어 보겠습니다.

'state' 폴더에 'user.ts' 파일을 만들고, 다음과 같이 작성합시다.

```typescript
import { createGlobalState } from ".";

type UserState = {
  name: string;
  isSignedIn: boolean;
};

export const useUserState = createGlobalState<UserState>("user", {
  name: "mycodings",
  isSignedIn: false,
});
```

간단한 테스트를 위해 UserState를 이름과 로그인 여부만 넣었습니다.

그리고 React의 Hook 방식으로 만들려고 `use`라는 이름으로 함수 이름을 작성했습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhc3i9E8sPuP_VZhHVZaC2rrVKzIwNckDUcGgSsRzX6wFnX75_VjIHkCma8GLmz7PygDL6qJfWvAQvaVFm5rOShmttbviPA2uzLxYbXshDjclU1ll5eRv7mMzPfwxgcZkdOi3fIZfqGkeAPUqOFW5rnvnG5ouGia-hfwCNG5ifgsdJo5_9gASxJ5y3xM7M)

위 그림처럼 useUserState 훅은 data, setData, resetData를 사용할 수 있는 Custom React Hook이 되었습니다.

이제 이 useUserState 훅을 컴포넌트에서 사용해 보겠습니다.

App.tsx에서 아래와 같이 사용해 보겠습니다.

```tsx
import { useUserState } from "./state/user";

function App() {
  const { data } = useUserState();

  return (
    <>
      <h1>{data?.name}</h1>
    </>
  );
}

export default App;
```

이론상 이렇게 하면 브라우저에 initialData의 디폴트값인 'mycodigns' 값이 나와야 하는데요.

아무런 표시도 일어나지 않습니다.

크롬 개발자 콘솔창을 들여다 보면 `QueryClientProvider`를 제공하라고 나오는데요.

맞습니다.

React Query를 사용하려면 꼭 `QueryClientProvider`를 지정해야 합니다.

main.tsx 파일을 아래와 같이 수정합시다.

```ts
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
```

React Query를 사용해서 데이터 fetching을 하려고 할 때 그리고 이 때 전역 상태 관리를 사용하고 싶을 때 이 방법을 쓰면 좋을거 같네요.

이제 화면에 아래 그림과 같이 나올겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiphSJGoYYtbo0p30rfEM9uJ1sx7dDszC8f6t7s8HNVa6eB3rIgTydN4zj6rIhfZLlc16I4RA7tEH_qaO1BEq3lMsxx7kuloGi-tEYQcu3Z3-yZpMrY9CwbbQIX9rtVXWF3Hd3pfyFtxVIJ-EtM1kJNQB91frLh-uQCZG4iJ3_Tk81O8jwwshSqVVAe24A)

코드를 조금 더 확장해 보겠습니다.

먼저, UserCard라는 다른 컴포넌트를 만들겠습니다.

편의상 App.tsx 파일안에 넣었지만 다른 파일에 넣어도 똑같습니다.

```ts
import { useUserState } from "./state/user";

function App() {

  return (
    <>
      <UserCard />
    </>
  );
}

export default App;

function UserCard() {
  const { data } = useUserState();

  return (
    <>
      <h1>{data?.name}</h1>
    </>
  );
}
```

일단 위와 같이 해도 브라우저에서는 똑같이 나올겁니다.

이제 input 태그를 넣어서 데이터를 변경해 보겠습니다.

```ts
import { useUserState } from "./state/user";

function App() {
  const { data, setData } = useUserState();

  return (
    <>
      <UserCard />
      <input
        value={data?.name}
        onChange={(e) => setData({ name: e.target.value })}
      />
    </>
  );
}

export default App;

function UserCard() {
  const { data } = useUserState();

  return (
    <>
      <h1>{data?.name}</h1>
    </>
  );
}
```

위와 같이 하면 아래와 같이 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjbJP6Sdn5L47VN09bvUa5yDlOg0pSbc_AwglkoLDSOav7kCUhwypW1QY7X1tLiX8Mo4VKICosTTsKncrNIhkeCAQEX8tJFgc1znLBVRoAQRIVomeVWaXXcGd8Q0skRAinzRTrmVuAI6bnZJWWUWSSu2h-qgOWvvO61gvBFRax6jWA2KDO1xS8pqT5AJPs)

이 상태에서 input 태그 안에 글자를 변경하면 useState 훅 처럼 데이터가 연동됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhglPPByGSKjvmqiiaWn9dgKNc2Dlca62rOTmkkabhVLf5hT1pV3IWH7QpsO8tDI8VNcuEmtTZeArUXjS3wskPBpSkuciE_t7gT-YrcjiQ9dCf8i-gYWSLiYwHdGQJtjOpaT5NRlSF3GQIYrst0E-i46tiCHIoNaoWvXJVdw-vTAKstLaTnV7ikgHv-8_M)

그리고 resetData 함수를 사용하기 위해 아래와 같이 button 태그도 추가해 보겠습니다.

```ts
function App() {
  const { data, setData, resetData } = useUserState();

  return (
    <>
      <UserCard />
      <input
        value={data?.name}
        onChange={(e) => setData({ name: e.target.value })}
      />
      <button onClick={resetData}>Reset</button>
    </>
  );
}
```

아래 그림과 같이 상태에서 reset 버튼을 클릭하면 initialData 값으로 초기화 되는 걸 볼 수 있을 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhRSbh6YObkpN1nUJLFSp_mBfgXYOcntOtFPyZcUhZ8hmBHlwkZ-Q9nKqGJsASo_3e-7PhJQBLBdGr_B1QrRAdnMfKwAS3CQK0KyC8ONIrfNSBtXH9NYLln3RGSiNE4vD5XSpKXv9cv-6gkZRGbxNYgrQY70OLgNLmX_T_LMNDK3zfhFmK3MbZIlO3lSeE)

여기서 중요한 점은 App 컴포넌트에서 변경한 데이터가 UserCard라는 다른 컴포넌트에서 그냥 불러온 data 변수에 그대로 반영된다는 점입니다.

이게 바로 글로벌(전역) 상태 관리라는 거죠.

이렇게 React Query를 이용한 간단한 상태 관리 시스템이 완성됐습니다.

이 방식은 프로젝트의 규모와 목적에 따라 유용할 수 있고 그렇지 않을 수도 있는데요.

특히 이미 React Query를 사용 중이라면 아주 유용할 수 있을겁니다.

하지만 대규모 프로젝트나 복잡한 상태 관리가 필요한 경우에는 Redux나 Zustand 같은 검증된 라이브러리를 사용하는 것이 더 안전할 수 있습니다.

## React Query를 사용한 상태관리의 장점

자, 이제 우리가 만든 상태 관리 시스템을 조금 더 자세히 살펴볼까요?

먼저, 이 방식의 장점 중 하나는 타입 안정성입니다.

TypeScript를 사용하고 있기 때문에, 상태의 타입을 명확히 정의할 수 있고 이를 통해 런타임 에러를 줄일 수 있습니다.

```typescript
import { createGlobalState } from ".";

type UserState = {
  name: string;
  isSignedIn: boolean;
};

export const useUserState = createGlobalState<UserState>("user", {
  name: "mycodings",
  isSignedIn: false,
});
```

이렇게 정의된 UserState 타입은 createGlobalState 함수에 전달되어, 반환된 훅에서 사용되는 data, setData 함수 등의 타입을 정확하게 추론할 수 있게 해줍니다.

또 다른 장점은 코드의 재사용성입니다.

createGlobalState 함수를 한 번 정의해두면, 이를 이용해 여러 개의 상태를 쉽게 만들 수 있는데요.

예를 들어, 다크모드 설정을 위한 상태를 추가로 만들고 싶다면 다음과 같이 할 수 있습니다.

```typescript
type ThemeSettings = {
  theme: 'light' | 'dark';
  notifications: boolean;
};

export const useThemeSettings = createGlobalState<ThemeSettings>('themeSettings', {
  theme: 'light',
  notifications: true,
});
```

이렇게 만든 useThemeSettings 훅은 useUserState와 완전히 독립적으로 동작하면서도, 같은 로직을 재사용하고 있습니다.

React Query를 사용함으로써 얻는 또 다른 이점은 캐싱과 동기화입니다.

React Query는 내부적으로 강력한 캐싱 메커니즘을 가지고 있어, 동일한 데이터에 대한 중복 요청을 방지하고 성능을 최적화합니다. 

예를 들어, 여러 컴포넌트에서 useUserState를 사용하더라도 실제로는 하나의 데이터 소스만 유지되며, 이 데이터가 변경될 때 모든 관련 컴포넌트가 자동으로 업데이트됩니다.

```tsx
function UserProfile() {
  const { data } = useUserState();
  return <div>Hello, {data?.name}</div>;
}

function Settings() {
  const { data, setData } = useUserState();
  return (
    <input
      value={data?.name}
      onChange={(e) => setData({ name: e.target.value })}
    />
  );
}
```

위의 예시에서 Settings 컴포넌트에서 이름을 변경하면, UserProfile 컴포넌트도 자동으로 업데이트됩니다.

이는 React Query가 내부적으로 처리해주는 기능입니다.

마지막으로, 이 방식은 확장성이 뛰어납니다.

필요에 따라 createGlobalState 함수를 수정하여 더 많은 기능을 추가할 수 있는데요.

예를 들어, 상태 변경 로깅, 비동기 상태 업데이트, 혹은 상태 변경에 대한 구독 기능 등을 쉽게 추가할 수 있습니다.

```typescript
export function createGlobalState<T>(queryKey: unknown, initialData: T | null = null) {
  return () => {
    const queryClient = useQueryClient();
    const { data } = useQuery({
      queryKey: [queryKey],
      queryFn: () => Promise.resolve(initialData),
      refetchInterval: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchIntervalInBackground: false,
    });

    function setData(newData: Partial<T>) {
      queryClient.setQueryData([queryKey], newData);
      console.log(`State updated: ${queryKey}`, newData); // 로깅 추가
    }

    function resetData() {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.refetchQueries({ queryKey: [queryKey] });
      console.log(`State reset: ${queryKey}`); // 로깅 추가
    }

    return { data, setData, resetData };
  };
}
```

이렇게 React Query를 이용한 상태 관리는 간단하면서도 강력한 솔루션이 될 수 있습니다.

특히 이미 React Query를 사용 중인 프로젝트에서는 추가적인 라이브러리 없이도 효과적인 상태 관리를 구현할 수 있죠.

그럼.