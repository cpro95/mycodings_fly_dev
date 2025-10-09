---
slug: 2024-02-24-sneak-peak-of-react-19-useformstate
title: 미리보는 React 19 신기능 - useFormState
date: 2024-02-24 04:10:22.972000+00:00
summary: React 19에서 로딩 상태를 관리하지 않아도 됩니다
tags: ["react"]
contributors: []
draft: false
---

안녕하세요?

오늘은 한참 화두인 React 19의 신기능에 대해 잠깐 살펴보는 시간을 갖도록 하겠습니다.

** 목 차 **

- [미리보는 React 19 신기능 - useFormState](#미리보는-react-19-신기능---useformstate)
  - [React 19에서 로딩 상태를 관리하지 않아도 됩니다](#react-19에서-로딩-상태를-관리하지-않아도-됩니다)
  - [소개](#소개)
  - [읽기 처리 상태 비교](#읽기-처리-상태-비교)
    - [React 17](#react-17)
    - [React 18](#react-18)
  - [작성 처리 상태 처리 방법 비교](#작성-처리-상태-처리-방법-비교)


## React 19에서 로딩 상태를 관리하지 않아도 됩니다

## 소개

React 18까지 우리는 비동기 처리를 수행할 때 서버와 통신하거나 다른 비동기 작업을 할 때, 처리 상태를 UI에 표시하기 위해 상태 관리가 필요했었는데요.

하지만 React 19부터는 이러한 상태 관리가 필요 없어져서 코드를 더 깔끔하게 작성할 수 있게 되었습니다.

(여기서 중요한 점은 아쉽게도 React 19는 아직 릴리스되지 않았다는 거죠. 참고만 바랍나다.)

## 읽기 처리 상태 비교

### React 17

React 17까지는 처리 상태를 정의하고, 처리 상황을 반영하는 코드를 아래와 같은 방시으로 작성해야 했습니다.

예를 들어 페이지를 열 때 데이터를 가져와 표시하는 경우 (React 17): 로딩 상태 관리

```jsx
function Component() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    getAsynchronously().then(res => {
      setData(res.data)
      setLoading(false)
    })
  }, [])

  return (
    <div>
      {loading && <p>로딩 중...</p>}
      {data && <p>{data}</p>}
    </div>
  )
}
```

### React 18

React 18에서는 Suspense가 등장했습니다.

비동기 읽기 처리 상태를 관리할 필요가 없어졌습니다.

예를 들어 페이지를 열 때 데이터를 가져와 표시하는 경우 (React 18): 로딩 상태 관리가 불필요합니다.

```jsx
function Component() {
  const getPromise = getAsynchronously()  return (
    <div>
      <Suspense fallback={<p>로딩 중...</p>}>
        <Data getPromise={getPromise} />
      </Suspense>
    </div>
  )
}

// use는 실험적인 기능이며, React 공식 문서에서는 유사한 기능을 가진 타사 라이브러리 사용을 권장합니다.
// https://ko.react.dev/reference/react/Suspense#usage 참조
function Data({ getPromise }) {
  const { data } = use(getPromise)
  return <p>{data}</p>
}
```
![](https://blogger.googleusercontent.com/img/a/AVvXsEj1qK6iNv5q0te6lfbfpQt7iE4QV5PT3j20XHlsaRFLint_47YT4NV1tMzttjRayJnUH4o2dCkaxZtD8HmcgfHkWFa52Tm8VxoiQmscrb2FLuA3Os2VJjPxwVddoxmxrpmrkaFzncRZlaitEGqdag7_wFxDV5lw7lJnBdFQtnavrU2vJW_CgxxlEnNv79g)

---

## 작성 처리 상태 처리 방법 비교

작성 시에도 마찬가지로 처리 상태를 정의하고, 상태를 반영하는 코드를 작성해야 했습니다.

버튼 클릭 시 데이터 전송 예제 (React 18): pending 관리

```jsx
function Component() {
  const [pending, setPending] = useState(false);

  const post = () => {
    setPending(true);
    postAsynchronously().then(() => {
      setPending(false);
    });
  };

  return <button onClick={post}>{pending ? "전송 중..." : "게시"}</button>;
}
```

이제 React 19에서는 form이 등장했습니다.

Suspense와 같은 새로운 기능이 아니라 기존의 form을 약간 개선한 것으로 보이는데요.

버튼 클릭 시 데이터 전송 예제 (React 19): pending 관리 불필요

```jsx
function Component() {
  const post = async () => {
    await postAsynchronously();
  };

  return (
    <form action={post}>
      <Button />
    </form>
  );
}

function Button() {
  const { pending } = useFormState();
  return <button>{pending ? "전송 중..." : "글 작성 완료"}</button>;
}
```

앞으로 React 19에서는 비동기 작업 처리시 상태 관리가 더 이상 필요하지 않을거 같네요.

예를 들어 글을 작성하는 form이 경우, form 내부의 컴포넌트에서 useFormState를 사용하여 글 작성 상태를 가져오고, 글 작성 중인 UI("전송 중")와 글 작성 후의 UI("글 작성 완료")만 선언하면 됩니다.

이제 React 19가 도입되면, 비동기적인 읽기와 쓰기도 깔끔하게 표현할 수 있어 정말 좋아질 거 같네요.

전체적인 데모 코드도 같이 살펴볼까요?

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React canary</title>
    <script type="importmap">
      {
        "imports": {
          "@jsxImportSource": "https://esm.sh/react@18.3.0-canary-a9cc32511-20240215",
          "react": "https://esm.sh/react@18.3.0-canary-a9cc32511-20240215",
          "react-dom": "https://esm.sh/react-dom@18.3.0-canary-a9cc32511-20240215",
          "react-dom/client": "https://esm.sh/react-dom@18.3.0-canary-a9cc32511-20240215/client"
        }
      }
    </script>
    <script type="module" src="https://esm.sh/run" defer></script>
  </head>

  <body>
    <div id="root"></div>
    <script type="text/babel">
      import { createRoot } from "react-dom/client";
      import { use, Suspense, useState, useEffect, useRef } from "react";
      import { useFormStatus } from "react-dom";

      function React17Get() {
        const [data, setData] = useState(null);
        const [loading, setLoading] = useState(false);

        useEffect(() => {
          setLoading(true);
          getAsynchronously().then((res) => {
            setData(res.data);
            setLoading(false);
          });
        }, []);

        return (
          <div>
            {loading && <p>loading...</p>}
            {data && <p>{data}</p>}
          </div>
        );
      }

      function React18() {
        const getPromise = getAsynchronously();
        return (
          <div>
            <Suspense fallback={<p>loading...</p>}>
              <Data getPromise={getPromise} />
            </Suspense>
          </div>
        );
      }

      function Data({ getPromise }) {
        const { data } = use(getPromise);
        return <p>{data}</p>;
      }

      function React17Post() {
        const [pending, setPending] = useState(false);

        const post = () => {
          setPending(true);
          postAsynchronously().then(() => {
            setPending(false);
          });
        };

        return (
          <button onClick={post}>{pending ? "sending..." : "post"}</button>
        );
      }

      function React19() {
        const post = async () => {
          await postAsynchronously();
        };
        return (
          <form action={post}>
            <Button />
          </form>
        );
      }

      function Button() {
        const { pending } = useFormStatus();
        return <button>{pending ? "sending..." : "post"}</button>;
      }

      function App() {
        return (
          <>
            <React17Get />
            <React18 />
            <React17Post />
            <React19 />
          </>
        );
      }

      const root = createRoot(document.querySelector("#root"));
      root.render(<App />);

      async function getAsynchronously() {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return { data: "hello world" };
      }

      async function postAsynchronously() {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return { data: "hello world" };
      }
    </script>
  </body>
</html>
```