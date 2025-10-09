---
slug: 2024-03-01-progressive-enhancement-using-server-action-and-useformstate-in-nextjs
title: Next.js에서 Server Action과 useFormState을 활용한 Progressive Enhancement
date: 2024-03-01 06:00:20.854000+00:00
summary: Server Action과 useFormState을 통한 최적화
tags: ["server action", "useformstate", "progressive enhancement", "next.js", "react"]
contributors: []
draft: false
---

안녕하세요?

지난 시간에 React 19의 신기능이라고 useFormState에 대해 잠깐 쓴 글이 있었는데요.

오늘은 Next.js에서 사용하는 **useFormState**에 대한 내용입니다.

** 목 차 **

- [Server Action과 Client Action](#server-action과-client-action)
- [확장된 form 요소](#확장된-form-요소)
- [React Action을 위한 React 표준 Hook](#react-action을-위한-react-표준-hook)
  - [useFormStatus](#useformstatus)
  - [useFormState](#useformstate)
- [Server Action과 Client Action의 차이점은 무엇일까요?](#server-action과-client-action의-차이점은-무엇일까요)
- [Progressive Enhancement가 유지되지 않은 예](#progressive-enhancement가-유지되지-않은-예)
- [Progressive Enhancement가 유지되고 있는 예](#progressive-enhancement가-유지되고-있는-예)

---

참고로 **Server Action**을 사용하면 API 클라이언트를 사용하지 않고 브라우저에서 직접 서버 측 함수를 실행할 수 있습니다.

간단하게 **Server Action**의 장점을 알아 보겠습니다.

1. **API 클라이언트가 필요 없어집니다.**
2. **하이드레이션을 기다리지 않고 반응할 수 있습니다.**
3. **Progressive Enhancement를 유지할 수 있습니다.**

**useFormState**에 대해 이야기하기 전에 먼저, **Server Action**에 대해 간단히 알고 지나갈 필요가 있는데요.

---

## Server Action과 Client Action

"Server Action"이라는 용어는 많은 분들이 알고 있을 것으로 생각됩니다.

그러나 "Client Action"은 아직 익숙하지 않은 용어일 수 있는데요.

React와 Next.js의 공식 문서에서는 아직 명확하게 구분하여 설명되어 있지는 않지만,  "Client Action"은 "Server Action"과는 약간 다른 개념입니다.

Server Component가 "use client" 디렉티브를 경계로 Client Component가 되도록, Client 모듈로 처리되는 함수는 "Client Action"이 됩니다.

Next.js 공식 문서에서 소개하고 있는 Server Action을 Client Component에서 사용하는 예시를 살펴보겠습니다.

`myAction` 함수는 서버 코드이므로 `process.env.MY_SECRET_VALUE`를 참조하고 서버로 로그를 출력합니다.

이것은 누가 봐도 명확한 "Server Action"이죠.

```jsx
// ClientComponent.tsx
"use client";
import { myAction } from "./actions";

export default function ClientComponent() {
  return (
    <form action={myAction}>
      <button type="submit">Add to Cart</button>
    </form>
  );
}
```

```ts
// actions.ts
"use server";
export async function myAction() {
  console.log(process.env.MY_SECRET_VALUE);
}
```

이제 `actions.ts`의 "use server" 지시문을 "use client" 디렉티브로 변경해 볼까요?

그러면 브라우저에 로그가 출력되는데, 출력된 로그는 `undefined`입니다.

```js
// actions.ts
"use client";

export async function myAction() {
  console.log(process.env.MY_SECRET_VALUE);
}
```

디렉티브를 변경했을 뿐이지만, 이 두 가지는 다른 것으로 간주됩니다.

`Client` 모듈로 가져온 후자는 브라우저용으로 번들링되는 모듈입니다.

따라서 `process.env.MY_SECRET_VALUE`와 같은 기밀 정보는 번들되지 않도록 조치되는거죠.

이것이 "클라이언트 액션"입니다.

이 예시에서는 파일을 별도로 분할할 필요가 없습니다.

`Client Component`에서 선언한 함수도 "클라이언트 액션"으로 간주됩니다.

아래 예시는 처음 보면 "서버 액션" 샘플처럼 보일 수 있지만, 사실은 "클라이언트 액션" 샘플입니다.

```tsx
// ClientComponent.tsx
"use client";

export default function ClientComponent() {
  async function myAction() {
    console.log(process.env.MY_SECRET_VALUE);
  }
  return (
    <form action={myAction}>
      <button type="submit">Add to Cart</button>
    </form>
  );
}
```

즉, `action` 속성에 전달되는 함수는 단순히 "서버 액션"으로 일관적으로 부르기 어렵습니다.

Next.js 공식 문서에서는 위와 같이 보이는 동일한 "서버 액션 / 클라이언트 액션"을 "React 액션"으로 통합하여 지칭하고 있는 것 같습니다.

"React 액션"은 서버와 클라이언트 모두에서 진보적인 기능을 지원하며, 두 가지 전략 중 하나를 사용하는데요.

이 글에서는 "서버 액션 / 클라이언트 액션"을 통칭하여 "React 액션"이라고 부르겠습니다.

(현재 공식 명칭은 아니지만, 편의상 이렇게 부르도록 하겠습니다.)

---

## 확장된 form 요소

React Canary에서는 "React Action" 추가와 함께 `<form>` 요소에 변경 사항이 있는데요.

기존에는 URL 문자열만 전달할 수 있었던 action 속성에는 이제 "함수 = React Action"을 전달할 수 있게 되었습니다.

action 속성은 Server Action에만 국한되지 않고 React Action을 전달할 수 있습니다.

극단적으로 말하면, React Action 내에서 "외부 API 서버와 통신하여 데이터 업데이트"와 같은 처리는 필수가 아닙니다.

Client Action에서 window.alert를 호출해 보겠습니다.

이 동작은 Server Action이 아닌 Client Action에서 작동합니다.

```tsx
"use client";

export function MyForm() {
  function formAction(formData: FormData) {
    window.alert(`Hello ${formData.get("message")}`);
  }
  return (
    <form action={formAction}>
      <input type="hidden" name="message" value={"world"} />
      <button>window.alert</button>
    </form>
  );
}
```

---

## React Action을 위한 React 표준 Hook

React Action을 사용하는 코드는 React Action을 위한 React 표준 Hook을 사용할 수 있습니다.

이들은 모두 Canary 상태의 Hook이지만 React Action과 연동하기 위한 Hook입니다.

### useFormStatus

useFormStatus Hook은 Form이 전송 중인 상태를 참조할 수 있습니다.

아래의 예제를 통해 비동기 함수를 실행해 보겠습니다.

이전과 달리 버튼을 클릭하면 1000ms 후에 window.alert가 호출됩니다.

1000ms 경과 전에는 Form이 "전송 중"임으로 버튼이 비활성화됩니다.

```tsx
"use client";

import { useFormStatus } from "react-dom";

function Button() {
  // Form이 전송 중인 경우 pending: true
  const { pending } = useFormStatus();
  return <button disabled={pending}>window.alert</button>;
}

export function MyForm() {
  async function formAction(formData: FormData) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    window.alert(`Hello ${formData.get("message")}`);
  }
  return (
    <form action={formAction}>
      <input type="hidden" name="message" value={"world"} />
      <Button />
    </form>
  );
}
```

useFormStatusHook은 최상위 `<form>` 요소의 상태를 참조합니다.

반환값인 pending은 Form이 전송 중인지 여부를 나타내는 불리언(boolean) 값으로 사용할 수 있습니다.


### useFormState

`useFormState`를 사용하여 버튼을 누를 때마다 값을 증가시키는 예제를 만들어 보겠습니다.

`useFormState` 훅은 첫 번째 인수로 React Action을, 두 번째 인수로 초기값을 받습니다.

초기값은 0에서 시작하며 버튼을 누르면 100ms 지연 후에 증가합니다.

이전과 마찬가지로 Form이 전송 중일 때 버튼은 비활성화됩니다.

```tsx
"use client";

import { useFormState, useFormStatus } from "react-dom";

function Button() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>increment</button>;
}

export function MyForm() {
  async function formAction(prevValue: number) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return prevValue + 1;
  }
  // count는 React Action의 반환값으로 업데이트됩니다.
  const [count, formDispatch] = useFormState(formAction, 0);
  return (
    <form action={formDispatch}>
      <p>count: {count}</p>
      <Button />
    </form>
  );
}
```

---

## Server Action과 Client Action의 차이점은 무엇일까요?

이전에 설명한 대로, React Action을 위한 React 표준 Hook은 "Server Action / Client Action"을 구분하지 않고 모두 사용할 수 있습니다.

그러나 Client Action으로 사용하는 경우, 앞서 소개한 "Server Action"의 이점을 모두 충족시킬 수 없습니다.

1. **API 클라이언트가 불필요해집니다.**
2. **하이드레이션을 기다리지 않고 반응할 수 있습니다.**
3. **Progressive Enhancement를 유지할 수 있습니다.**

Server Action을 조사하면 "Progressive Enhancement"라는 용어를 자주 볼 수 있는데요.

Progressive Enhancement는 "기본 기능을 손상시키지 않으면서 JS가 활성화된 환경에서 최상의 경험을 제공하는" 구현 방식입니다.

Form의 경우, 전송이 가능하고 백엔드 처리가 가능한 상태까지가 기본 기능입니다.

이전에 소개한 코드는 브라우저에서 작동했기 때문에 JS를 끄면 Form의 기본 기능이 작동하지 않게 됩니다.

"action" 속성에 "Server Action"을 전달하여 브라우저에서 수행되던 업데이트 처리를 서버 측에서 수행함으로써 기본 기능을 손상시키지 않을 수 있습니다.

클라이언트 측의 실시간 유효성 검사(전송 전 유효성 검사)를 "최상의 경험"의 일부로 제공하는 것은 Progressive Enhancement라고 할 수 있습니다.

즉, "action" 속성에 함수를 전달했다고 해서 반드시 "Progressive Enhancement를 유지할 수 있다"고 말할 수는 없습니다.

---

## Progressive Enhancement가 유지되지 않은 예

**Progressive Enhancement**를 유지하는 것은 실제로 꽤 어렵습니다.

문서에 기술되어 있는 내용을 그대로 따라가면 언제나 Progressive Enhancement를 유지할 수 있는 것은 아닙니다.

**에러 처리**와 **피드백 표시**를 예시로 살펴보겠습니다.

아래와 같이 **Client Action** 내에서 **Server Action**을 호출할 수 있습니다.

이 예제에서는 Server Action의 반환값을 `setState`를 사용하여 저장하고 에러를 표시하고 있지만, Progressive Enhancement를 유지하지 못하고 있습니다.

이는 Client Action을 `action` 속성에 전달했기 때문에 JS를 끈 환경에서는 작동하지 않기 때문입니다.

동시에 하이드레이션을 기다리지 않고 반응할 수 있는 측면도 손상됩니다.

```tsx
"use client";

import { useState } from "react";
import { serverAction } from "./action";

export function MyForm() {
  const [message, setMessage] = useState<string | null>(null);
  const clientAction = async (formData: FormData) => {
    const res = await serverAction(formData);
    setMessage(res.message);
  };
  return (
    <form action={clientAction}>
      {message && <p>error: {message}</p>}
      <button>push</button>
    </form>
  );
}
```


```tsx
// action.ts
"use server";
export async function serverAction(formData: FormData) {
  if (Math.random() < 0.5) {
    return { message: "Internal Server Error" };
  }
  return { message: `${new Date().toLocaleTimeString()}` };
}
```

이처럼 Client Action을 `action` 속성에 전달했다고 해서 반드시 "Progressive Enhancement를 유지할 수 있다"고 말할 수는 없습니다.

---

## Progressive Enhancement가 유지되고 있는 예

**Progressive Enhancement**를 유지하면서 작동시키기 위해 **Server Action**과 **useFormState**을 사용해야 합니다.

JS를 끈 상태에서 버튼을 누르면 화면이 매번 다시 로드됩니다.

그러나 상태가 업데이트되고 표시되는 것을 확인할 수 있습니다.

"useFormState를 왜 사용할까요?"라는 질문에 대답하자면, Progressive Enhancement를 유지하기 위해서입니다.

```tsx
// MyForm.tsx
"use client";

import { serverAction } from "./action";
import { useFormState } from "react-dom";
import { State, initialState } from "./state";

export function MyForm() {
  const [formState, formDispatch] = useFormState(serverAction, initialState);
  return (
    <form action={formDispatch}>
      {formState.message && <p>error: {formState.message}</p>}
      <button>push me</button>
    </form>
  );
}
```


```tsx
// action.ts
"use server";

import { State } from "./state";

export async function serverAction(
  _: State,
  formData: FormData
): Promise<State> {
  if (Math.random() < 0.5) {
    return { message: "Internal Server Error" };
  }
  return { message: `${new Date().toLocaleTimeString()}` };
}
```


```tsx
// state.ts
export type State = {
  message: string | null;
};

export const initialState: State = {
  message: null,
};
```

그러나 이 formState의 업데이트는 Server Action을 통해서만 가능합니다.

이제까지는 JS가 기본적으로 활성화된 환경에서 구현했기 때문에 Progressive Enhancement를 유지하기 위한 기술이 필요하지 않았습니다.

하지만 이제는 Progressive Enhancement를 유지하기 위한 기술이 필요해질 것입니다.

---

**결론**:

Next.js 문서에서는 "Server Action"이 강조되고 있으며 Progressive Enhancement가 권장되고 있습니다.

Server Action이 탄생한 배경을 고려하면 Client Action에 초점을 맞출 필요는 없을 것 같지만, 이러한 지식을 갖고 있으면 구현 방향을 고려하는 데 도움이 될 겁니다.

- Server Action으로 묶인 코드는 항상 Server Action은 아닐 수 있습니다.
- Server Action으로 생각했던 함수가 실제로는 Client Action일 수 있습니다.
- Server Action을 사용하더라도 모든 이점을 최대한 활용할 수 있는 것은 아닙니다.
- Progressive Enhancement를 유지하기 위해서는 창의적인 접근이 필요합니다.
- 유지할 것인지 여부를 고려할 때, 초기에 검토하는 것이 좋습니다.
- Client Action이라고 해서 반드시 문제가 되는 것은 아닙니다.
- 오히려 React Action과 연동할 수 있는 React 표준 Hook을 활용할 수 있습니다.
- Static Exports를 사용한 Next.js에서도 Client Action을 실행할 수 있습니다.
- 개인적으로 Client Action은 API 클라이언트 코드를 줄일 수 있는 측면만으로도 메리트가 있으므로 가능한 경우 적극적으로 사용하고 싶습니다.

그럼.

