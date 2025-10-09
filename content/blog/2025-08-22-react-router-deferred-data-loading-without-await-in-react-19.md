---
slug: 2025-08-22-react-router-deferred-data-loading-without-await-in-react-19
title: React Router 로더, 아직도 await 쓰세요? (React 19 시대의 비동기 UI)
date: 2025-08-23 10:26:22.527000+00:00
summary: React Router v7과 React 19를 활용해 로더에서 await를 사용하지 않고 데이터를 지연 로딩하는 방법을 알아봅니다. Await, React.use, 그리고 렌더링 가능한 Promise를 통해 즉각적인 페이지 전환과 더 나은 사용자 경험을 구현하세요.
tags: ["React", "React Router", "데이터 로딩", "Suspense", "React 19", "비동기 UI"]
contributors: []
draft: false
---

[원본 링크](https://sergiodxa.com/md/tutorials/handle-deferred-data-in-react-router)

여기 아주 좋은 해외 기술 아티클이 하나 있는데요, 이 글의 핵심만 전체적으로 살펴볼까 힙니다.<br /><br />React Router를 사용하다 보면, 특히 데이터 로딩이 느린 페이지에서 사용자 경험이 뚝 끊기는 느낌을 받을 때가 있거든요.<br /><br />바로 로더(loader) 함수에서 데이터를 전부 받아올 때까지 `await`으로 기다리기 때문이죠.<br /><br />사용자는 링크를 클릭하고 다음 페이지가 보일 때까지 하염없이 기다려야만 합니다.<br /><br />그런데 만약 페이지는 즉시 보여주고, 데이터 로딩은 컴포넌트 내부에서 처리할 수 있다면 어떨까요?<br /><br />사용자 경험이 훨씬 부드러워지지 않을까요?<br /><br />오늘은 React Router v7과 곧 출시될 React 19의 새로운 기능들을 활용해서, 로더에서 `await`를 사용하지 않고 '지연된 데이터(deferred data)'를 우아하게 처리하는 세 가지 방법을 알아보려고 합니다.<br /><br />

## 로딩 UI의 패러다임 전환

기존에는 로더가 Promise를 완전히 resolve하고 데이터를 반환할 때까지 페이지 전환이 시작되지 않았는데요.<br /><br />이제는 로더가 'pending 상태의 Promise 자체'를 반환할 수 있게 되었습니다.<br /><br />이렇게 하면 React Router는 일단 페이지 전환부터 시켜주고, Promise가 resolve되기를 기다리는 동안 컴포넌트 안에서 로딩 상태를 보여줄 수 있죠.<br /><br />마치 Remix v2의 `defer` 헬퍼와 유사한 방식인데요.<br /><br />React Router v7에서는 별도의 헬퍼 없이도 이게 가능해졌습니다.<br /><br />

## 방법 1 React Router의 공식 무기, Await 컴포넌트

가장 먼저 살펴볼 방법은 React Router가 공식적으로 제공하는 `<Await>` 컴포넌트를 사용하는 건데요.<br /><br />이게 바로 표준적인 접근 방식이라고 할 수 있습니다.<br /><br />

```tsx
import { Suspense } from "react";
import { Await, useLoaderData } from "react-router-dom";

// 가상의 느린 데이터 페칭 함수
const fetchSlowData = () => new Promise((resolve) => {
  setTimeout(() => {
    resolve("오래 기다리셨습니다! 데이터 도착!");
  }, 2000); // 2초 딜레이
});

export function loader() {
  // await 하지 않고 Promise 자체를 반환합니다.
  return fetchSlowData();
}

export default function MyComponent() {
  const loaderData = useLoaderData();

  return (
    <div>
      <h1>내 컴포넌트</h1>
      <Suspense fallback={<p>데이터를 불러오는 중입니다...</p>}>
        <Await resolve={loaderData}>
          {(data) => <p>{data}</p>}
        </Await>
      </Suspense>
    </div>
  );
}
```

코드가 어떻게 동작하는지 하나씩 뜯어보죠.<br /><br />우선 `loader` 함수가 더 이상 `await fetchSlowData()`를 하지 않고, `fetchSlowData()`가 반환하는 'Promise 객체 자체'를 바로 `return`하는 것을 볼 수 있는데요.<br /><br />이게 바로 핵심입니다.<br /><br />이제 컴포넌트에서는 `useLoaderData`를 통해 이 Promise를 `loaderData`로 받게 되죠.<br /><br />그리고 JSX 부분을 보면, `Suspense` 컴포넌트가 로딩 중에 보여줄 `fallback` UI를 감싸고 있는데요.<br /><br />`Suspense`의 자식으로 있는 `<Await>` 컴포넌트가 바로 마법을 부리는 주인공입니다.<br /><br />`<Await>`의 `resolve` prop으로 우리가 로더에서 받은 `loaderData` (Promise)를 넘겨주면, 이 Promise가 resolve될 때까지 기다렸다가, resolve가 완료되면 그 결과값(`data`)을 자식 함수(render prop)로 전달해주는 거죠.<br /><br />덕분에 사용자는 페이지에 즉시 진입해서 '데이터를 불러오는 중입니다...'라는 메시지를 보고, 2초 뒤에 데이터가 도착하면 해당 부분이 실제 데이터로 스르륵 바뀌는 것을 보게 됩니다.<br /><br />

## 방법 2 React 19의 새로운 비밀 병기, `React.use`

두 번째 방법은 React 19에 새로 도입된 `use` 훅을 사용하는 건데요.<br /><br />이 훅은 Promise를 인자로 받아서, 그 Promise가 resolve될 때까지 컴포넌트의 렌더링을 '일시 중단'시키는 아주 특별한 능력을 가지고 있습니다.<br /><br />

```tsx
import { Suspense, use } from "react";
import { useLoaderData } from "react-router-dom";

// loader 함수는 위와 동일합니다.
export function loader() {
  return fetchSlowData();
}

// Promise를 처리하기 위한 별도의 컴포넌트
function Result({ promise }: { promise: Promise<string> }) {
  const data = use(promise);
  return <p>{data}</p>;
}

export default function MyComponent() {
  const loaderData = useLoaderData();

  return (
    <div>
      <h1>내 컴포넌트</h1>
      <Suspense fallback={<p>데이터를 불러오는 중입니다...</p>}>
        <Result promise={loaderData} />
      </Suspense>
    </div>
  );
}
```

`<Await>`를 사용할 때와 비교해서 한 가지 달라진 점이 있는데요.<br /><br />바로 `Result`라는 새로운 컴포넌트를 만들어야 한다는 점입니다.<br /><br />`use` 훅은 컴포넌트의 최상위 레벨에서만 호출할 수 있다는 규칙 때문에, Promise를 직접 사용하는 로직을 별도의 컴포넌트로 분리해야 하거든요.<br /><br />`MyComponent`는 로더에서 받은 Promise를 `Result` 컴포넌트에 `promise` prop으로 전달하고요.<br /><br />`Result` 컴포넌트 안에서 `const data = use(promise);` 코드가 실행되는 순간, React는 이 `promise`가 resolve될 때까지 `Result` 컴포넌트의 렌더링을 멈추고 가장 가까운 `Suspense`의 `fallback`을 대신 보여줍니다.<br /><br />그리고 Promise가 resolve되면, `use` 훅은 그 결과값을 `data`에 반환하고 렌더링을 재개하죠.<br /><br />`<Await>` 컴포넌트보다 조금 더 많은 보일러플레이트가 필요하지만, `use` 훅은 React Router에 종속되지 않는 React의 범용적인 기능이라는 점에서 더 유연하게 활용될 수 있습니다.<br /><br />

## 방법 3 가장 간단하고 우아한 방법, 렌더링 가능한 Promise

하지만 React 19에는 이보다 훨씬 더 간단하고 우아한, 잘 알려지지 않은 비밀 기능이 숨겨져 있었더라고요.<br /><br />바로 'Promise를 JSX에서 직접 렌더링 가능한 노드로 사용'하는 기능입니다.<br /><br />이게 무슨 말이냐고요?<br /><br />백문이 불여일견, 바로 코드를 보시죠.<br /><br />

```tsx
import { Suspense } from "react";
import { useLoaderData } from "react-router-dom";

// loader 함수는 여전히 동일합니다.
export function loader() {
  return fetchSlowData();
}

export default function MyComponent() {
  const loaderData = useLoaderData();

  return (
    <div>
      <h1>내 컴포넌트</h1>
      <Suspense fallback={<p>데이터를 불러오는 중입니다...</p>}>
        {loaderData.then((data) => (
          <p>{data}</p>
        ))}
      </Suspense>
    </div>
  );
}
```

정말 놀랍도록 간단해지지 않았나요?<br /><br />우리는 그저 `loaderData`라는 Promise에 `.then()`을 붙여서, resolve되었을 때 렌더링할 JSX를 반환해주기만 하면 됩니다.<br /><br />React 19는 `Suspense` 경계 안에서 이런 패턴을 발견하면, 해당 Promise가 resolve될 때까지 `fallback`을 보여주고, resolve가 완료되면 `.then()` 안의 JSX를 렌더링해주는 거죠.<br /><br />React Router의 `<Await>` 컴포넌트도 필요 없고, `React.use`를 위한 별도의 래퍼 컴포넌트도 필요 없습니다.<br /><br />그저 우리가 평소에 사용하던 Promise의 `.then()` 문법을 JSX 안에 그대로 녹여내기만 하면 되죠.<br /><br />

## 마치며

오늘은 React Router에서 `await` 없이 비동기 데이터를 처리하는 세 가지 방법을 알아봤는데요.<br />
*   **`<Await>` 컴포넌트**: React Router가 제공하는 표준적이고 안정적인 방법입니다.<br /><br />
*   **`React.use` 훅**: React 19의 범용적인 기능으로, 더 넓은 활용 가능성을 가집니다.<br /><br />
*   **렌더링 가능한 Promise**: React 19에서 가장 간단하고 직관적인 방법으로, 코드의 복잡성을 획기적으로 줄여주죠.

이제 더 이상 사용자를 페이지 전환 앞에서 하염없이 기다리게 만들 필요가 없습니다.<br /><br />로더에서는 과감하게 Promise를 바로 반환하고, 로딩 상태는 컴포넌트 안에서 `Suspense`와 함께 우아하게 처리해보세요.<br /><br />이 작은 변화 하나가 여러분의 애플리케이션에 즉각적인 탐색이라는 놀라운 사용자 경험을 선사해 줄 겁니다.<br /><br />
