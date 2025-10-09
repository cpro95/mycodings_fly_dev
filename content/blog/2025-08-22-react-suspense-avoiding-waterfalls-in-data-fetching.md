---
slug: 2025-08-22-react-suspense-avoiding-waterfalls-in-data-fetching
title: React Suspense, 잘못 쓰면 폭포수처럼 느려집니다 (워터폴 피하는 법)
date: 2025-08-23 10:39:09.497000+00:00
summary: React의 Suspense는 비동기 UI를 위한 강력한 도구지만, 자칫하면 데이터 로딩이 순차적으로 지연되는 워터폴 현상을 유발할 수 있습니다. 중첩된 Suspense와 병렬 Suspense의 차이점을 이해하고, 워터폴을 피하는 세 가지 실전 패턴을 알아봅니다.
tags: ["React", "Suspense", "데이터 로딩", "워터폴", "성능 최적화", "React Server Components"]
contributors: []
draft: false
---

[원본 링크](https://sergiodxa.com/md/tutorials/avoid-waterfalls-in-react-suspense?)

여기 아주 좋은 해외 기술 아티클이 하나 있는데요, 이 글의 핵심만 전체적으로 살펴볼까 힙니다.<br /><br />React의 `Suspense`는 비동기 UI 렌더링을 조율하는 정말 훌륭한 도구죠.<br /><br />하지만 이 강력한 도구를 잘못 사용하면, 하나의 비동기 작업이 다른 작업이 끝나기를 불필요하게 기다렸다가 시작되는, 이른바 '워터폴(waterfall)' 현상을 쉽게 만들어낼 수 있거든요.<br /><br />오늘은 `Suspense` 경계가 어떻게 동작하는지, 그리고 이 워터폴 문제를 피하기 위해 데이터 페칭 구조를 어떻게 설계해야 하는지 그 비법을 깊이 있게 파헤쳐 보겠습니다.<br /><br />

## Suspense 경계와 Promise 패턴의 놀라운 평행이론

`Suspense` 경계를 이해하는 가장 좋은 방법은 이걸 자바스크립트의 `async` 함수라고 생각하는 건데요.<br /><br />'중첩된(nested)' Suspense와 '병렬적인(sibling)' Suspense의 동작 방식은, 우리가 `await` 키워드를 어떻게 쓰는지와 아주 밀접한 관련이 있습니다.<br /><br />

### 중첩된 Suspense는 순차적인 await과 같다

`Suspense` 경계를 중첩해서 사용하면, 안쪽 경계는 바깥쪽 경계의 렌더링이 끝날 때까지 로딩을 시작조차 하지 않는데요.<br /><br />이건 마치 자바스크립트에서 이렇게 코드를 짜는 것과 똑같습니다.<br /><br />

```typescript
let d1 = await getData1();
let d2 = await getData2();
```

이 코드에서 `getData2()`는 `getData1()`이 완전히 끝날 때까지 시작조차 못 하는 거죠.<br /><br />이것이 바로 우리가 피해야 할 '워터폴' 문제입니다.<br /><br />

### 병렬적인 Suspense는 Promise.all과 같다

만약 두 `Suspense` 경계를 형제(sibling) 관계로 나란히 배치한다면, 이 둘은 병렬적으로 로딩될 수 있는데요.<br /><br />마치 `Promise.all`을 사용하는 것과 같다고 볼 수 있죠.<br /><br />

```typescript
let [d1, d2] = await Promise.all([getData1(), getData2()]);
```

이 경우 두 Promise는 즉시 동시에 실행을 시작하거든요.<br /><br />React는 심지어 `d2`를 아직 기다리는 동안에도 `d1`에 의존하는 UI를 먼저 렌더링할 수도 있습니다.<br /><br />이게 바로 병렬 처리의 힘이죠.<br /><br />

### 워터폴 없는 중첩 구조 만들기

그런데 여기서 진짜 문제가 발생하는데요.<br /><br />UI 구조상으로는 분명히 중첩되어야 하는데, 데이터 의존성은 서로 독립적인 경우가 많거든요.<br /><br />레이아웃 때문에 중첩 구조는 유지하면서, 데이터 로딩은 병렬적으로 처리하고 싶을 때 어떻게 해야 할까요?<br /><br />바로 두 번째 데이터 요청을 '미리 시작'해서 워터폴을 숨겨버리는 겁니다.<br /><br />

```typescript
let p2 = getData2(); // d2 요청을 미리 시작!
let d1 = await getData1();
let d2 = await p2; // 나중에 결과를 기다림
```

이 코드를 보세요.<br /><br />`getData2()`는 `getData1()`을 기다리지 않고 즉시 시작되죠.<br /><br />나중에 `await p2`로 결과를 기다리긴 하지만, 이미 요청은 한참 전에 시작되었기 때문에 워터폴이 발생하지 않는 겁니다.<br /><br />이 원리만 이해하면, 이제 어떤 복잡한 비동기 UI라도 최적화할 수 있습니다.<br /><br />

## 실전 코드에 적용하는 세 가지 패턴

이제 이 원리를 실제 React 코드에 어떻게 적용하는지 세 가지 강력한 패턴을 통해 알아보죠.<br /><br />

### 패턴 1 React Router의 로더 활용하기

React Router의 로더(loader)는 이 문제를 해결하기에 아주 완벽한 장소인데요.<br /><br />로더 함수 안에서 두 데이터 요청을 동시에 시작할 수 있기 때문입니다.<br /><br />

```tsx
import type { Route } from "./+types";
import { Suspense } from "react";

export async function loader() {
  let p2 = getData2(); // d2 요청을 먼저 시작
  let d1 = await getData1(); // d1 데이터는 기다려서 받음
  return { d1, p2 }; // d1은 데이터, p2는 Promise 자체를 반환
}

export default function Component({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <UI1 data1={loaderData.d1} />
      <Suspense fallback={<LoadingD2 />}>
        {loaderData.p2.then((d2) => (
          <UI2 data2={d2} />
        ))}
      </Suspense>
    </>
  );
}
```

이 로더 함수가 정말 영리한데요.<br /><br />`getData2()`를 먼저 호출해서 요청을 날려두고, 그동안 페이지의 첫 렌더링에 필요한 `getData1()`을 `await`으로 기다립니다.<br /><br />그리고 `return` 할 때는, 이미 받아온 `d1` 데이터와 아직 처리 중인 `p2` Promise 객체 자체를 함께 반환하죠.<br /><br />컴포넌트에서는 `loaderData.d1`을 사용해서 즉시 `UI1`을 렌더링하고, `loaderData.p2` Promise는 `Suspense` 경계 안에서 `.then()`을 사용해 처리합니다.<br /><br />덕분에 `getData2()`가 로딩되는 동안에도 사용자는 `UI1`을 먼저 볼 수 있게 되어 워터폴을 완벽하게 피할 수 있습니다.<br /><br />

### 패턴 2 서버 컴포넌트와 `React.cache`

React 서버 컴포넌트(RSC) 환경에서도 이 원리를 똑같이 적용할 수 있는데요.<br /><br />`React.cache`를 활용하면 아주 깔끔하게 구현할 수 있습니다.<br /><br />

```tsx
const getData2Cached = React.cache(getData2);

export default async function Page() {
  // d2 요청을 미리 시작해서 캐시를 채우기 시작
  getData2Cached();

  let d1 = await getData1();
  return (
    <>
      <UI1 data={d1} />
      <Suspense fallback={<LoadingD2 />}>
        <Child />
      </Suspense>
    </>
  );
}

async function Child() {
  // 여기서 await 하지만, 요청은 이미 부모에서 시작되었음
  let d2 = await getData2Cached();
  return <UI2 data={d2} />;
}
```

`Page` 부모 컴포넌트의 맨 위에서 `getData2Cached()`를 한번 호출해주기만 하면 되는데요.<br /><br />이 호출은 Promise를 반환하지만 우리는 `await` 하지 않습니다.<br /><br />그저 데이터 요청을 미리 '시작'하는 것이 목적이죠.<br /><br />나중에 `Child` 컴포넌트가 렌더링되고 `await getData2Cached()`를 호출할 때쯤이면, 이미 데이터 요청은 한창 진행 중이거나 끝나있을 겁니다.<br /><br />덕분에 `Child` 컴포넌트는 `Page` 컴포넌트의 `getData1()`이 끝날 때까지 기다릴 필요가 전혀 없게 되는 거죠.<br /><br />

### 패턴 3 서버 컴포넌트에서 클라이언트 컴포넌트로 Promise 전달하기

마지막으로, 서버 컴포넌트에서 클라이언트 컴포넌트로 Promise 객체 자체를 prop으로 넘겨주는 아주 세련된 방법도 있는데요.<br /><br />

```tsx
// Server Component
import ClientComponent from "./client-component";

export default async function Page() {
  let p2 = getData2(); // p2 Promise를 생성
  let d1 = await getData1();
  return (
    <>
      <UI1 data={d1} />
      <Suspense fallback={<LoadingD2 />}>
        <ClientComponent promise={p2} /> {/* Promise를 prop으로 전달 */}
      </Suspense>
    </>
  );
}
```

서버 컴포넌트인 `Page`는 `getData2()`를 호출해서 `p2` Promise를 만들고, 이걸 `ClientComponent`에 `promise`라는 이름의 prop으로 그대로 전달합니다.<br /><br />이제 클라이언트 컴포넌트의 코드를 보시죠.<br /><br />

```tsx
// Client Component
"use client";
import { use } from "react";

interface Props {
  promise: ReturnType<typeof getData2>;
}

export default function ClientComponent({ promise }: Props) {
  let d2 = use(promise); // use 훅으로 Promise를 풀어냄
  return <UI2 data={d2} />;
}
```

클라이언트 컴포넌트는 `use` 훅을 사용해서 서버에서 받은 Promise를 풀어내는데요.<br /><br />이 `use(promise)` 코드가 실행되는 순간 `Suspense`가 발동해서, Promise가 resolve될 때까지 `fallback` UI를 보여줍니다.<br /><br />서버에서 시작된 비동기 작업을 클라이언트에서 자연스럽게 이어받아 처리하는 아주 강력하고 우아한 패턴이죠.<br /><br />

## 마치며

React `Suspense`의 워터폴 문제는 결국 '언제 데이터 요청을 시작하는가'의 문제로 귀결되는데요.<br /><br />오늘 살펴본 모든 패턴의 핵심은 단 하나입니다.<br /><br />'데이터 로딩의 시작점을, 그 데이터를 사용하는 컴포넌트가 렌더링되는 시점이 아니라, 그 데이터가 필요해질 것이라는 사실을 알게 된 가장 이른 시점으로 앞당기는 것'이죠.<br /><br />React Router의 로더, `React.cache`를 이용한 사전 호출, 그리고 Promise를 prop으로 전달하는 이 세 가지 패턴을 잘 기억해두신다면, 앞으로 어떤 복잡한 비동기 UI를 마주하더라도 폭포수처럼 느려지는 일 없이, 물 흐르듯 부드러운 사용자 경험을 만들어내실 수 있을 겁니다.<br /><br />
