---
slug: 2024-09-18-understanding-react-zustand-deep-dive
title: React Zustand 상태관리 실전 예제로 마스터하기
date: 2024-09-18 05:47:44.720000+00:00
summary: React 상태관리는 이제 Zustand로 마스터하십시요.
tags: ["zustand", "react", "state management"]
contributors: []
draft: false
---

![](https://blogger.googleusercontent.com/img/a/AVvXsEg7mcVIOyXh4i3u1uAW4uGOjdGgtW5l112J0aZPvZDDcgnzfnBVAqBSvwqxafLMJ4hdA4fEKWR_AuTSNM6yZBVcCxKiOVHBTorUEUuD65suPPBKl9lnkro7MSHeADT5Wuml2n0re64C-Xcgh7VPuaR12IJ7nV1NEc5bovBYf1nneu6Fo8n9e0YRZmn4sdE)

안녕하세요?

React로 상태 관리를 하려면 보통 Redux나 Context API가 먼저 떠오르는데요, 초보자 입장에서는 꽤 어렵게 느껴질 수 있습니다.

Redux를 사용해 본 사람도 설정이 가물가물해서 문서를 찾아보거나 다른 코드를 참고하는 경우가 종종 있죠.

Redux 외에도 다양한 상태 관리 라이브러리가 있는데, 이 글에서는 Zustand를 소개하려고 합니다.

Zustand는 설정이 간단해서 초보자도 쉽게 사용할 수 있고, 특히 Redux를 경험해 본 사람이라면 더욱 쉽게 느껴질 겁니다.

몇 번만 사용해 보면 초기 설정 코드도 외울 정도로 코드량이 적습니다.

상태 관리 라이브러리를 사용하지 않으면 컴포넌트 간 데이터 전달을 props로 해야 하는데요, Zustand와 같은 상태 관리 라이브러리를 사용하면 애플리케이션의 모든 컴포넌트에서 접근 가능한 변수를 설정하여 props 없이 데이터를 공유할 수 있습니다.

이 글에서는 간단한 코드를 통해 Zustand의 설정 방법과 기본 기능을 설명하겠습니다.

## React 환경 구축

Vite를 사용하여 React 프로젝트를 생성합니다.

`npm create vite@latest` 명령어를 실행하면 프로젝트 이름, 프레임워크, variant를 선택하라는 질문이 나오는데, 여기서는 "zustand-test", "React", "Typescript"를 선택합니다.

```bash
npm create vite@latest
✔ Project name: … zustand-test
✔ Select a framework: › React
✔ Select a variant: › TypeScript

Scaffolding project in /Users/cpro95/Codings/blog/zustand-test...

Done. Now run:

  cd zustand-test
  npm install
  npm run dev
```

명령어 실행이 완료되면 설정한 프로젝트 이름과 같은 디렉터리가 생성됩니다.

해당 디렉터리로 이동하여 `npm install` 명령어를 실행합니다.

```bash
➜  cd zustand-test
➜  npm i
```

### Zustand 설치

zustand 라이브러리 설치는 npm 명령어를 사용합니다.

```bash
npm install zustand
```

설치 후 `package.json` 파일을 열어 설치된 라이브러리와 버전을 확인해 보세요.

```json
{
  "name": "zustand-test",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "zustand": "^5.0.0-rc.2"
  },
  "devDependencies": {
    "@eslint/js": "^9.9.0",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "eslint": "^9.9.0",
    "eslint-plugin-react-hooks": "^5.1.0-rc.0",
    "eslint-plugin-react-refresh": "^0.4.9",
    "globals": "^15.9.0",
    "typescript": "^5.5.3",
    "typescript-eslint": "^8.0.1",
    "vite": "^5.4.1"
  }
}
```

기본으로 설정된 스타일을 해제하기 위해 `main.tsx` 파일에서 `import './index.css'` 부분을 주석 처리합니다.

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
// import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

## Counter로 동작 확인, 해볼까요?

버튼을 클릭하면 카운트 숫자가 업데이트되는 간단한 카운터 기능을 통해 Zustand의 기본 사용법을 확인해 보겠습니다.

### Store 생성

먼저 모든 컴포넌트에서 접근 가능한 공간(store)을 생성합니다.

`src` 폴더에 `store.ts` 파일을 만들고 다음 코드를 작성합니다.

```javascript
import { create } from "zustand";

interface countState {
  count: number;
  increase: () => void;
  decrease: () => void;
  reset: () => void;
}

const useStore = create<countState>((set) => ({
  count: 1,
  increase: () => set((state) => ({ count: state.count + 1 })),
  decrease: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set(() => ({ count: 0 })),
}));

export default useStore;
```

`zustand`에서 `create` 함수를 import합니다.

`create` 함수 내부의 콜백 함수에서 공유할 변수의 초기값과 함수를 설정하는데요, 여기서는 `count` 변수에 1이라는 초기값을 설정했습니다.

함수를 설정할 때는 `set` 함수를 사용하여 변수를 업데이트할 수 있습니다.

`create` 함수의 반환값인 함수를 `useStore`에 저장하고 export하면 `create` 함수 내부에서 정의한 변수와 함수에 접근할 수 있습니다.

`set` 함수뿐만 아니라 `get` 함수도 사용할 수 있는데요, `get` 함수를 사용하면 다음과 같이 `count`에 접근할 수도 있습니다.

```javascript
import { create } from "zustand";

interface countState {
  count: number;
  increase: () => void;
  decrease: () => void;
  reset: () => void;
}

const useStore = create<countState>((set, get) => ({
  count: 1,
  increase: () => set({ count: get().count + 1 }),
  decrease: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set(() => ({ count: 0 })),
}));

export default useStore;
```

#### `count` 값에 접근해보기

모든 컴포넌트에서 접근 가능한 공간(store)을 설정했으니, 이제 App 컴포넌트에서 `count` 값에 접근할 수 있는지 확인해 보겠습니다.

`useStore`를 import하고, `useStore`에서 `count`를 추출합니다.

```jsx
import useStore from "./store";

function App() {
  const { count } = useStore();
  return (
    <div style={{ margin: "1em" }}>
      <h1>Count</h1>
      <div>{count}</div>
    </div>
  );
}
export default App;
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEiDQpfdnNpFv7S6UTz-9e-kn1rRvj47O611tcDe55bmIRU3OPUv_rr0VtmODBVcbM7n2Yb9UYIf4vgiwv0GPfbrvaBY62g8Osxx9dkJG5Hg_XKSp85PNRu5SA60dQwJby1U9pqs40clpAs3Uezxecetex02F5jxusmHEWtel9aFYERn2wfhM3FoMV9eh14)

`store.ts`에서 초기값으로 설정한 1이 표시되면 Zustand가 정상적으로 설정된 겁니다.

### `count` 값, 제대로 표시되는지 확인!

참고로, `store.ts` 파일안에서 `create` 함수의 `count` 초기값을 변경하면 표시되는 `count` 숫자도 바뀌는지 확인해 보세요.

---

App 컴포넌트뿐만 아니라 다른 컴포넌트에서도 접근할 수 있는지 확인하기 위해 `components` 폴더를 만들고 `Count.tsx` 파일을 생성합니다.

```jsx
import useStore from "../store";

const Count = () => {
  const count = useStore((state) => state.count);
  return <div>{count}</div>;
};

export default Count;
```

`count`를 추출하는 방식이 조금 달라졌는데요, `useStore`에서는 selector를 사용하여 `count` 값만 가져올 수 있습니다.

위 코드에서는 selector를 사용한 방식인데요.

count를 가져올 때 맨 처음 보았던 객체 안에서 구조분해할당으로 가져온 방식을 사용하지 않고 직접 count를 가져왔습니다.

이런 방식을 selector를 사용한 방식이라고 합니다.

나중에 selector를 사용하는 경우와 구조 분해 할당을 사용하는 경우의 차이점을 설명하겠습니다.

App 컴포넌트에서 생성한 `Count` 컴포넌트를 import합니다.

```jsx
import Count from "./components/Count";
import useStore from "./store";

function App() {
  const { count } = useStore();
  return (
    <div style={{ margin: "1em" }}>
      <h1>Count</h1>
      <div>{count}</div>
      <Count />
    </div>
  );
}
export default App;
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEi5bNXDv_pH5lyahhVlDXBQP5tw0Jp88YePkAx4iPm2uk5guHzeZ-LsxmkIcdnrVoleHRGrdM8d16_qjgewKdXA4QRvitas2eNGY-2aBuKVLCPGgL6hNwpKIHdOCs4U54b0jFLAyj6vuxzOzLO6rKI1g7WfBeAxxhSN2IJJGzUraF7qcvSyMJr8I7UHSD4)

위 그림과 같이 App 컴포넌트와 Count 컴포넌트 모두에서 `count` 값에 접근할 수 있음을 확인할 수 있습니다. 이로써 모든 컴포넌트에서 접근 가능하다는 것을 알 수 있습니다.

### 함수를 이용해서 `count` 값 업데이트해보기

변수 `count`에 접근하는 방법을 이해했으니, 이제 `create` 함수에서 정의한 `increase`, `decrease` 함수를 사용하여 `count`를 업데이트할 수 있는지 확인해 보겠습니다.

`App.tsx`를 업데이트해볼까요?

함수를 `useStore`에서 추출하는 방법은 `Count.tsx`의 `count`와 마찬가지로 selector에 가져올 함수를 지정합니다.

```jsx
import Count from "./components/Count";
import useStore from "./store";

function App() {
  const { count } = useStore();
  const increase = useStore((state) => state.increase);
  const decerase = useStore((state) => state.decrease);
  return (
    <div style={{ margin: "1em" }}>
      <h1>Count</h1>
      <div>{count}</div>
      <Count />
      <div>
        <button onClick={() => increase()}>+</button>
        <button onClick={() => decerase()}>-</button>
      </div>
    </div>
  );
}
export default App;
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEiYvEsQi7mpCCdCLdql7Jx9Hk7qQtxiyuokmug9QApFsaDXqMsE9IDouVGtrGrjqG-xlPQXlK_NO02ZnK3vPx99_c6CB1Jdr040KdD8mszHF-XaeG7GtGiNx7emxexD7Z3xYo-ZlhaFZMvB3EYAjnKBdHs_Tz1KfC3YNeA6fbnrRvdC4Z6fbFNfF9mrkL0)

브라우저에 "+" 및 "-" 버튼이 표시되므로 버튼을 클릭하여 `count` 숫자가 변경되는지 확인해보세요.

이제 `count`를 업데이트할 수 있다면 접근뿐만 아니라 업데이트도 가능하다는 것을 알 수 있습니다.

### selector 대신 구조 분해 할당을 사용해도 동작은 똑같습니다.

```javascript
const { increase, decrease } = useStore();
```

#### `count` 업데이트 시 재렌더링, 꼼꼼하게 살펴보기

selector와 구조 분해 할당을 사용해도 카운터는 잘 동작하는데요,  둘 사이의 차이점을  알아볼까요?

selector를 사용하면 `count`가 업데이트될 때 발생하는 컴포넌트의 재렌더링을 막을 수 있습니다.

먼저 구조 분해 할당을 사용하여 동작을 확인합니다.

재렌더링을 확인하기 위해 `console.log`를 사용합니다.

App 컴포넌트에서 `count`를 삭제했습니다.

```jsx
import useStore from './store';
import Count from './components/Count';

function App() {
  console.log('재렌더링');
  const { increase, decrease } = useStore();

  return (
    <div style={{ margin: '1em' }}>
      <h1>Count</h1>
      <Count />
      <div>
        <button onClick={() => increase()}>+</button>
        <button onClick={() => decrease()}>-</button>
      </div>
    </div>
  );
}

export default App;
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEicZVkhIiR9Jq9iZLvOqxV8X69YpkyUV4GWIa-Q84otvPJ4QwgxwFQ83DU4oyFHWX8PO7YdBLrWJ7bCK-p205wfzoxa4gohMYyBc10pvSiLvfZZz8pTQfSjRhP3E5cfvZ3gOuGS8O2k1ULzJOT-5lpiAxSa08uMYthbtbggOoa0Nux9iLKPdKvZkO-HcvI)

위 그림에서 총 6번의 "재랜더링" 문자열이 콘솔에 표시되었는데요.

첫 두개의 표시는 React 첫 실행시 개발모드에서는 두번의 렌더링이 일어나서 그렇습니다.

그래서 총 2번의 + 버튼을 눌렀는데 총 여섯개의 "재렌더링" 문자열이 표시되었네요.

즉, App 컴포넌트는 `count` 업데이트와 함께 2번 재렌더링됩니다.

이번에는 selector를 사용한 경우의 동작을 확인해 보겠습니다.

```javascript
console.log('재렌더링');
const increase = useStore((state) => state.increase);
const decrease = useStore((state) => state.decrease);
// const { increase, decrease } = useStore();
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEhqAHcD23MQLir1YQ2hxsCVDRh3pTRDbx0VW_oojXzbP0iPn8FKaWqEg8rrlQT6xE-i2a2-nNmr9galmCP7615wsoThfd_YpLJdhAi1toaOhOKBNRrsy6ZHwaSzEW-dHMy_u9tYg2JX4bQzqlOXdSuy78HePtQsd1r5_26SArY4yHzN41lRu49d-n5q2cA)

아까와는 다르게 접근 시 재렌더링은 한 번 표시되지만, 이후 버튼을 눌러도 App 컴포넌트가 재렌더링되지 않습니다.

이 동작에 대해서는 GitHub 페이지의 "Fetching everything" 부분에 자세한 설명이 있습니다.

"You can, but bear in mind that it will cause the component to update on every state change!"라는 문장의 의미를 이제  실제 동작을 통해  이해할 수 있겠죠?

`const state = useStore()`처럼 `increase`, `decrease`를 한 줄씩 가져왔는데요, `useShallow` hook을 사용하면 다음과 같이 한 번에 여러 함수를 가져올 수 있습니다.

```jsx
import useStore from './store';
import Count from './components/Count';
import { useShallow } from "zustand/shallow";

function App() {
  console.log('재렌더링');
  const { increase, decrease } = useStore(
    useShallow((state) => ({
      increase: state.increase,
      decrease: state.decrease,
    }))
  );
  // ...
}
```

`useShallow` hook이 없어도 위 코드는 동작하지만, 그 경우 `count`를 업데이트할 때마다 컴포넌트가 재렌더링된다는 점, 기억해두시면 됩니다.

---

### `reset` 함수를 설정해볼까요?

App 컴포넌트 외에도 다른 컴포넌트에서 `count`를 업데이트할 수 있는지 확인하기 위해 `components` 폴더에 `Reset.tsx` 파일을 생성합니다.

```jsx
import useStore from '../store';

const Reset = () => {
  const reset = useStore((state) => state.reset);
  return (
    <div>
      <button onClick={() => reset()}>Reset</button>
    </div>
  );
};

export default Reset;
```

`App.tsx` 파일에서 `Reset.tsx` 파일을 import합니다.

```jsx
import useStore from './store';
import Count from './components/Count';
import Reset from './components/Reset';
import { useShallow } from 'zustand/react/shallow';

function App() {
  console.log('재렌더링');
  const { increase, decrease } = useStore(
    useShallow(
      (state) => ({
        increase: state.increase,
        decrease: state.decrease,
      })
    )
  );

  return (
    <div style={{ textAlign: 'center', margin: '1em' }}>
      <h1>Count</h1>
      <Count />
      <div>
        <button onClick={() => increase()}>+</button>
        <button onClick={() => decrease()}>-</button>
      </div>
      <Reset />
    </div>
  );
}

export default App;
```

"+" 및 "-" 버튼으로 `count` 숫자가 업데이트되는 것을 확인하고 "Reset" 버튼을 클릭해보세요.

0이 되면 다른 컴포넌트에서도 `count`가 업데이트될 수 있다는 것을 알 수 있습니다.

지금까지 간단한 코드로 카운터를 만들어봤는데요, Zustand의 설정이 정말 간단하다는 것을 알 수 있을겁니다.

---

### Redux devtools 사용하기

Zustand에서는 Redux devtools를 사용할 수 있습니다.

설정은 `create` 함수에서 지정한 콜백 함수를 `devtools`로 감싸면 됩니다.

`devtools`는 `zustand/middleware`에서 import합니다.

```javascript
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface countState {
  count: number;
  increase: () => void;
  decrease: () => void;
  reset: () => void;
}

const useStore = create<countState>()(
  devtools((set, get) => ({
    count: 1,
    increase: () => set({ count: get().count + 1 }),
    decrease: () => set((state) => ({ count: state.count - 1 })),
    reset: () => set(() => ({ count: 0 })),
  }))
);

export default useStore;
```

`create` 함수와 함께 countState 인터페이스를 이용해서 타입을 전달해 줬고 그 다음에 `()` 형식으로 썼는데요.

왜 이렇게 쓰는지는 [공식문서](https://zustand.docs.pmnd.rs/guides/typescript)에서 확인하시면 됩니다.

AI에 물어보면 아래와 같이 대답하니까 참고 바랍니다.

```
TypeScript에서 Zustand를 사용할 때, `create` 함수를 호출할 때 추가적인 `<T>` 타입 파라미터를 지정해야 합니다. 이때, `create<T>()` 형식으로 작성해야 하는데, 여기서 `T`는 상태(state)의 타입을 나타냅니다.

이유는 TypeScript의 제네릭 타입 시스템 때문입니다. 제네릭 타입은 함수나 클래스가 다양한 타입의 데이터를 처리할 수 있도록 해줍니다. Zustand의 `create` 함수도 제네릭 타입을 사용하는데, 상태의 타입을 명시적으로 지정할 수 있습니다.

예를 들어, 상태가 `{ count: number }` 타입일 때, `create<{ count: number }>()` 형식으로 작성하면 Zustand가 상태의 타입을 알 수 있습니다. 이로 인해 TypeScript는 Zustand가 반환하는 상태의 타입을 올바르게 추론할 수 있습니다.

그럼, 추가적인 `()`는 왜 필요한 걸까요? 이는 TypeScript의 문법의 특징 때문입니다. 제네릭 타입을 사용할 때, `<T>` 타입 파라미터를 지정한 후에 함수를 호출할 때도 괄호를 추가해야 합니다. 이것은 TypeScript가 제네릭 타입을 올바르게 해석할 수 있도록 도와줍니다.

결론적으로, `create<T>()` 형식은 Zustand에서 TypeScript를 사용할 때 상태의 타입을 명시적으로 지정할 수 있도록 해줍니다. 이로 인해 Zustand가 반환하는 상태의 타입을 올바르게 추론할 수 있으며, 코드의 안정성과 가독성을 향상시킬 수 있습니다.
```

크롬 브라우저에서 Redux devtools를 사용하려면 브라우저 확장 프로그램으로 Redux Devtools를 설치해야 합니다.

이것만으로 설정이 완료됩니다!

브라우저의 Redux devtools를 열면 `count` 정보도 확인할 수 있습니다.

---

### 페이지 새로고침 후에도 값 유지하기

현재 설정에서는 페이지를 새로 고침하면 `count` 숫자가 초기화되는데요, 페이지 새로 고침 후에도 `count` 값을 유지하고 싶다면 미들웨어 `persist`를 사용할 수 있습니다.

`devtools`와 마찬가지로 `create`의 콜백 함수를 `persist`로 감싸고 `name`에 고유한 이름을 지정해야 합니다.

`name`이 없으면 "TypeError: Cannot use 'in' operator to search for 'getStorage' in undefined" 오류가 발생한답니다.

```javascript
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface countState {
  count: number;
  increase: () => void;
  decrease: () => void;
  reset: () => void;
}

const useStore = create<countState>()(
  persist(
    (set, get) => ({
      count: 1,
      increase: () => set({ count: get().count + 1 }),
      decrease: () => set((state) => ({ count: state.count - 1 })),
      reset: () => set(() => ({ count: 0 })),
    }),
    {
      name: "count-store",
    }
  )
);

export default useStore;
```

버튼을 사용하여 `count` 값을 업데이트한 후 브라우저를 새로 고침하여 `count` 값이 유지되는지 확인해보세요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEinhCkrd97hR51bpUXyM5sHD279_gI4d2ZuZ0P_LC_Z5ewXTx_jikWxsZ2vkGtnhORwzL0DExr6W-qtV6MgVzFwcm7ggWH6ncOznUiA2rm63b-tNtd1wLpWJiwmghC3RkrGaO3vhuWcbYtPEApSe7xqgc0ModutaZnAbI_Znon2hkf5f0XJMZbuNlaD2PA)

`count` 값은 로컬 스토리지에 저장되므로 개발자 도구의 Application 탭에서  현재 값을 확인할 수 있습니다.

---

### 외부 리소스에서 데이터 가져오기

실제 애플리케이션을 구축할 때는 초기값을 외부 서버에서 가져오는 경우도 많습니다.

JSON PlaceHolder에서 실제 데이터를 가져와 브라우저에 사용자 정보를 표시하는 방법을 알아보겠습니다.

사용자 정보를 가져올 URL은 `https://jsonplaceholder.typicode.com/users`입니다.

이제 store를 하나 더 만듭시다.

`src` 폴더에 `user-store.ts`로 이름을 정합시다.

`getUsers` 함수를 추가하고 `async`, `await`, `fetch` 함수를 사용하여 사용자 정보를 가져옵니다.

Zustand에서는 `create` 함수 내부에서 `async`를 사용할 수 있습니다.

참고로 Zustand는 React Hook을 이용한 라이브러리라서 이름을 지을 때 앞에 'use'란 접두사를 써야 합니다.

일종의 Hook이거든요.

```javascript
import { create } from "zustand";

interface UserState {
  users: [];
  getUsers: () => Promise<void>;
}

const useUserStore = create<UserState>()((set) => ({
  users: [],
  getUsers: async () => {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    set({ users: await response.json() });
  },
}));

export default useUserStore;

```

App 컴포넌트에서는 React Hook의 `useEffect` 내부에서 `getUsers`를 실행하여 사용자 목록을 가져오고 `map` 함수로 `users`를 펼쳐서 표시합니다.

```jsx
import { useEffect } from "react";
import useUserStore from "./user-store";

function App() {
  const getUsers = useUserStore((state) => state.getUsers);
  const users = useUserStore((state) => state.users);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <div style={{ margin: "1em" }}>
      <h1>User</h1>
      {users.map((user: any) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}

export default App;
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEi_c1y4MHYRva92S1QxJh9W5XeWtUn916sP3HZxQ2Zcgxo7ZgkZOnH70dJVmJ9_doKXqRnf5U1J1peJUNykf2Gf_uQ1DyUZQCWlahCscdGOaPOSqOapPgnW3PphKOMigIYTh5WG3ZLpGjXQRf16u7H0XgMWV_eWiL27cobz8WkKYSIUw1jTCuCXk6D9JPA)

위 그림과 같이 브라우저에 사용자 목록이 표시됩니다.

이렇듯 Zustand를 사용하여 외부 리소스에서 정보를 가져올 수 있었습니다.

### 상태 변화, 감지할 수 있을까요?

Zustand에서는 설정한 state의 상태 변화를 감지하는 기능도 제공합니다.

새롭게 `deleteUser` 함수를 추가하여 가져온 사용자 목록에서 사용자 정보를 삭제하는 기능을 추가해 보겠습니다.

```javascript
import { create } from "zustand";

interface UserState {
  users: any[]; // 중요부분
  getUsers: () => Promise<void>;
  deleteUser: (id: number) => void;
}

const useUserStore = create<UserState>()((set) => ({
  users: [],
  getUsers: async () => {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    set({ users: await response.json() });
  },
  deleteUser: (id) =>
    set((state) => ({ users: state.users.filter((user) => user.id !== id) })),
}));

export default useUserStore;
```

deleteUser 함수 추가하면 users 부분의 타입 에러가 나는데 UserState 인터페이스에서 users를 임시로 `any[]`으로 정해놓읍시다.

원래는 User 타입을 정하고 `users: User[]` 형식으로 지정해야 하는데 코드가 너무 길어져서 간단하게 쓰기 위해 위와 같이 `any[]` 방식을 사용했습니다.

이름 옆에 "X" 버튼을 추가하고, 클릭하면 `deleteUser` 함수가 실행되도록 `App.tsx` 파일을 업데이트합니다.

```jsx
import { useEffect } from "react";
import useUserStore from "./user-store";

function App() {
  const getUsers = useUserStore((state) => state.getUsers);
  const users = useUserStore((state) => state.users);
  const deleteUser = useUserStore((state) => state.deleteUser);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <div style={{ margin: "1em" }}>
      <h1>User</h1>
      {users.map((user: any) => (
        <div key={user.id}>
          {user.name} <span onClick={() => deleteUser(user.id)}>X</span>
        </div>
      ))}
    </div>
  );
}

export default App;
```

브라우저에서 확인해보면 "X" 버튼이 표시되고, 클릭하면 클릭한 사용자가 삭제됩니다.

사용자 삭제를 다른 컴포넌트에서 감지할 수 있도록 `components` 폴더에 `Subscribe.tsx` 파일을 새로 생성합니다.

`useUserStore`를 import하고 `subscribe` 메서드에 `console.log`를 지정합니다.

`useEffect` 내부에서 감지를 시작하고 unmount 시 삭제할 수 있도록 `unsub1`의 클린업을 수행합니다.

```jsx
import { useEffect } from 'react';
import useUserStore from "./user-store";

const Subscribe = () => {
  useEffect(() => {
    const unsub1 = useUserStore.subscribe(console.log, (state) => state.users);
    return () => {
      unsub1();
    };
  }, []);
  return <div>subscribe</div>;
};

export default Subscribe;
```

`App.tsx` 파일에서 생성한 `Subscribe` 컴포넌트를 import합니다.

```jsx
import { useEffect } from 'react';
import useStore from './store';
import Subscribe from './components/Subscribe';

function App() {
  // ... (기존 코드 유지)

  return (
    <div style={{ textAlign: 'center', margin: '1em' }}>
      <Subscribe />
      <h1>User</h1>
      {users.map((user) => (
        <div key={user.id}>
          {user.name} <span onClick={() => deleteUser(user.id)}>X</span>
        </div>
      ))}
    </div>
  );
}

export default App;
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEjEcpeQrFZT0RNz2LruiRu7HLQn7tBUVWaZ3HBvWGs3dCgE0D0YB5k2UFPHpZrSC_sQMxLFRhmstxSlxS4TcD7xfneAqIuvzvvOiYyczq0qhorBT9J20emb319YkLtHIycJBmx_W5wuHICsLAQ5dfx8el_aI495d1AImhLacsDQxaDNq3_qGOkZYAGj7Ik)

삭제 버튼을 누르면 브라우저 콘솔에 `create` 함수에서 정의한 변수, 함수 모두가 표시되는 것을 확인할 수 있습니다.

`Subscribe` 컴포넌트에서 설정한 `subscribe` 함수가 업데이트를 감지하고 있기 때문입니다.

모든 state 정보가 표시되는데, 사용자 정보만 보고 싶다면 다음과 같이 작성해서 `users`만 추출할 수 있습니다.

```javascript
const unsub1 = useStore.subscribe(
  (state) => console.log(state.users),
  (state) => state.users
);
```

Zustand의 모든 기능을 설명드린 건 아니지만, Redux에 비해  훨씬 간단하고 미들웨어를 통해 기능 확장도 가능하다는 것을 이해하셨을 거라 생각합니다.

Zustand, 상태 관리 라이브러리 선택지에 한번 추가해보는 건 어떨까요?

그럼.

---

