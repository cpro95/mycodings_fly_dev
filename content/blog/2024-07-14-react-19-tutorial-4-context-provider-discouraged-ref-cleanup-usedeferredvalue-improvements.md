---
slug: 2024-07-14-react-19-tutorial-4-context-provider-discouraged-ref-cleanup-usedeferredvalue-improvements
title: React 19 강좌 4편 - Context Provider 비추천화, ref 콜백 클린업, useDeferredValue 초기값 및 에러 핸들링 개선
date: 2024-07-14 08:25:04.628000+00:00
summary: React 19에서의 주요 변경 사항과 개선된 기능들을 포괄적으로 다루고 있다는 점을 강조합니다.(Context.Provider 비추천화, ref 콜백 클린업, useDeferredValue 초기값, 에러 핸들링 개선)
tags: ["react", "react 19", "ref callback", "useDeferredValue"]
contributors: []
draft: false
---

안녕하세요?

React 19 강좌 전체 리스트입니다.

1. [React 19 강좌 1편 - 액션과 useTransition으로 비동기 작업 처리하기 기본 사용법과 폼 처리 변화](https://mycodings.fly.dev/blog/2024-07-14-react-19-tutorial-1-usetransition-and-new-form-api)

2. [React 19 강좌 2편 - 폼 요소의 액션과 useActionState useFormStatus 조합으로 비동기 작업 처리하기](https://mycodings.fly.dev/blog/2024-07-14-react-19-tutorial-2-handling-async-tasks-with-react-19-form-elements-actions-useactionstate-useformstatus)

3. [React 19 강좌 3편 - FormData와 Server Actions, useActionState의 조합으로 폼 제출 최적화하기](https://mycodings.fly.dev/blog/2024-07-14-react-19-tutorial-3-react-19-formdata-server-actions-useactionstate-optimization)

4. [React 19 강좌 4편 - Context Provider 비추천화, ref 콜백 클린업, useDeferredValue 초기값 및 에러 핸들링 개선](https://mycodings.fly.dev/blog/2024-07-14-react-19-tutorial-4-context-provider-discouraged-ref-cleanup-usedeferredvalue-improvements)

5. [React 19 강좌 5편 - React 19 주요 변경 사항 - propTypes와 defaultProps의 폐지, Legacy Context의 제거, ref 개선 및 useReducer 타입 시그니처 변경](https://mycodings.fly.dev/blog/2024-07-14-react-19-tutorial-5-breaking-changes-prop-types-context-ref)

---

** 목 차 **

- [React 19 강좌 4편 - Context Provider 비추천화, ref 콜백 클린업, useDeferredValue 초기값 및 에러 핸들링 개선](#react-19-강좌-4편---context-provider-비추천화-ref-콜백-클린업-usedeferredvalue-초기값-및-에러-핸들링-개선)
  - [`<Context.Provider>`의 비추천화](#contextprovider의-비추천화)
    - [이전 방식](#이전-방식)
      - [예제: 기존 방식](#예제-기존-방식)
    - [새로운 방식](#새로운-방식)
      - [예제: 새로운 방식](#예제-새로운-방식)
    - [설명](#설명)
    - [요약](#요약)
  - [ref 콜백의 클린업 함수](#ref-콜백의-클린업-함수)
    - [ref 콜백의 기존 사양](#ref-콜백의-기존-사양)
      - [예제: ref 콜백의 기존 사양](#예제-ref-콜백의-기존-사양)
    - [ref 콜백과 재렌더링](#ref-콜백과-재렌더링)
      - [예제: ref 콜백과 재렌더링](#예제-ref-콜백과-재렌더링)
    - [ref 콜백을 메모이제이션하는 예](#ref-콜백을-메모이제이션하는-예)
      - [예제: ref 콜백을 메모이제이션하는 방법](#예제-ref-콜백을-메모이제이션하는-방법)
    - [ref 콜백과 useEffect의 유사성과 차이점](#ref-콜백과-useeffect의-유사성과-차이점)
      - [예제: useEffect로 DOM 조작](#예제-useeffect로-dom-조작)
    - [문제 있는 컴포넌트](#문제-있는-컴포넌트)
    - [ref 콜백을 사용하는 예](#ref-콜백을-사용하는-예)
  - [요약](#요약-1)
  - [ref를 prop으로 전달할 수 있는 개선](#ref를-prop으로-전달할-수-있는-개선)
    - [React 18의 ref 동작](#react-18의-ref-동작)
      - [예제: React 18의 ref 동작](#예제-react-18의-ref-동작)
    - [forwardRef 사용법](#forwardref-사용법)
      - [예제: forwardRef 사용법](#예제-forwardref-사용법)
    - [React 19의 ref 동작](#react-19의-ref-동작)
      - [예제: React 19의 ref 동작](#예제-react-19의-ref-동작)
    - [설명](#설명-1)
    - [요약](#요약-2)
  - [useDeferredValue의 초기값](#usedeferredvalue의-초기값)
    - [useDeferredValue란](#usedeferredvalue란)
    - [예시](#예시)
    - [React 19의 새로운 기능](#react-19의-새로운-기능)
      - [예제: 초기값 설정](#예제-초기값-설정)
    - [설명](#설명-2)
  - [요약](#요약-3)
  - [에러 핸들링의 개선](#에러-핸들링의-개선)
    - [기존의 문제점](#기존의-문제점)
    - [React 19의 개선](#react-19의-개선)
      - [예제: onCaughtError 사용](#예제-oncaughterror-사용)
    - [설명](#설명-3)
    - [onUncaughtError 사용](#onuncaughterror-사용)
      - [예제: onUncaughtError 사용](#예제-onuncaughterror-사용)
    - [설명](#설명-4)
    - [요약](#요약-4)

---

## `<Context.Provider>`의 비추천화

React 19에서는 기존의 `Context.Provider`를 비추천하고, 대신 `<Context>` 자체를 Provider로 사용하는 새로운 방식을 도입했습니다.

이 변경은 Context API를 더 간단하게 사용하고, 코드의 일관성을 높이는 데 도움을 줍니다.

### 이전 방식

기존에는 `Context.Provider`를 사용하여 Context 값을 하위 컴포넌트에 전달했습니다.

이 방식은 `Context.Provider`와 `Context.Consumer`를 쌍으로 사용하여 Context의 값을 제공하고 소비했습니다.

#### 예제: 기존 방식

```jsx
import React, { createContext, useState } from 'react';

// Context 생성
const MyContext = createContext();

// 부모 컴포넌트
const ParentComponent = () => {
  const [value, setValue] = useState('Hello');

  return (
    // Context.Provider를 사용하여 값 전달
    <MyContext.Provider value={value}>
      <ChildComponent />
    </MyContext.Provider>
  );
};

// 자식 컴포넌트
const ChildComponent = () => {
  return (
    <MyContext.Consumer>
      {value => <div>Value: {value}</div>}
    </MyContext.Consumer>
  );
};

export default ParentComponent;
```

- **`MyContext.Provider`**: `value`를 하위 컴포넌트인 `ChildComponent`에 전달합니다.

- **`MyContext.Consumer`**: `value`를 받아서 화면에 표시합니다.

이 방식은 `Context.Provider`와 `Context.Consumer`를 쌍으로 사용하는 방식으로, Context 값을 제공하고 소비하는 데 필요한 코드가 비교적 복잡했습니다.

### 새로운 방식

React 19에서는 `Context` 자체를 Provider로 사용할 수 있게 되었습니다.

이제는 `Context.Provider`와 `Context.Consumer`를 사용하는 대신, `Context`를 직접 Provider로 사용하여 더 간단하게 Context를 관리할 수 있습니다.

#### 예제: 새로운 방식

```jsx
import React, { createContext, useState, useContext } from 'react';

// Context 생성
const MyContext = createContext('Default Value');

// 부모 컴포넌트
const ParentComponent = () => {
  const [value, setValue] = useState('Hello');

  return (
    // Context 자체를 Provider로 사용
    <MyContext.Provider value={value}>
      <ChildComponent />
    </MyContext.Provider>
  );
};

// 자식 컴포넌트
const ChildComponent = () => {
  const value = useContext(MyContext);
  return <div>Value: {value}</div>;
};

export default ParentComponent;
```

### 설명

1. **`createContext`**: Context를 생성합니다. 생성 시 기본값을 설정할 수 있습니다. 기본값은 `useContext`를 사용할 때 Context가 제공되지 않으면 사용됩니다.

   ```jsx
   const MyContext = createContext('Default Value');
   ```

2. **`Context.Provider`**: Context를 제공하는 Provider 역할을 합니다. `value` 속성에 제공할 값을 설정합니다.

   ```jsx
   <MyContext.Provider value={value}>
     <ChildComponent />
   </MyContext.Provider>
   ```

3. **`useContext`**: Context 값을 읽어오는 훅입니다. 함수 컴포넌트에서 사용하여 Context의 값을 쉽게 가져올 수 있습니다.

   ```jsx
   const value = useContext(MyContext);
   ```

4. **`MyContext`**: 이제 `MyContext`를 직접 Provider로 사용하여 Context 값을 제공할 수 있습니다. `useContext`를 사용하여 값을 읽어올 수 있습니다. 이로 인해 `Context.Provider`와 `Context.Consumer`의 비대칭 상태가 해소됩니다.

### 요약

- **`Context.Provider` 비추천화**: React 19에서 `Context.Provider` 대신 `<Context>`를 직접 Provider로 사용할 수 있게 되었습니다. 이를 통해 코드가 더 간단하고 일관되게 관리됩니다.

- **`createContext`와 `useContext` 사용**: `createContext`로 Context를 생성하고, `useContext`를 사용하여 Context 값을 읽어오는 방식으로 변경되었습니다.

- **예제**: 새로운 Context API를 사용하여 Context를 제공하고, 함수 컴포넌트에서 Context 값을 쉽게 읽어오는 방법을 설명했습니다.

---

## ref 콜백의 클린업 함수

React 19에서는 `ref` 콜백 함수에서 클린업 함수를 반환할 수 있는 기능이 추가되었습니다.

이를 통해 DOM 노드가 제거되거나 변경될 때 클린업 작업을 더 간편하게 처리할 수 있습니다.

이 기능을 활용하면, DOM 노드의 생성과 제거를 보다 효율적으로 관리할 수 있습니다.

### ref 콜백의 기존 사양

기존에는 ref 콜백 함수에서 DOM 노드가 제거될 때 `null`이 인자로 전달되었습니다.

이를 통해 클린업 작업을 수행할 수 있었습니다.

#### 예제: ref 콜백의 기존 사양

```jsx
import React, { useState } from 'react';

const MyComponent: React.FC = () => {
  const refCallback = (node: HTMLDivElement | null) => {
    if (node) {
      console.log('Node mounted:', node);
    } else {
      console.log('Node unmounted');
    }
  };

  return <div ref={refCallback}>Hello</div>;
};

export default MyComponent;
```

이 예제에서는 `refCallback` 함수가 DOM 노드가 마운트되거나 언마운트될 때 호출됩니다.

`node`가 `null`로 전달될 때는 DOM 노드가 제거되었음을 알 수 있으며, 이를 통해 클린업 작업을 수행할 수 있습니다.

### ref 콜백과 재렌더링

컴포넌트가 재렌더링될 때마다 ref 콜백이 호출됩니다.

이 메커니즘은 이전 콜백 함수가 `null`을 전달받아 역할을 종료하고, 새로운 콜백 함수가 현재 DOM 노드를 전달받는 방식입니다.

#### 예제: ref 콜백과 재렌더링

```jsx
import React, { useState, useCallback } from 'react';

const MyComponent: React.FC = () => {
  const [count, setCount] = useState(0);

  const refCallback = (node: HTMLDivElement | null) => {
    console.log(count, node);
  };

  return (
    <div ref={refCallback}>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
};

export default MyComponent;
```

이 경우, 버튼 클릭으로 인해 컴포넌트가 재렌더링되며, `refCallback` 함수도 호출됩니다.

이 메커니즘 덕분에 이전 콜백 함수는 `null`을 전달받아 역할을 종료하고, 새로운 콜백 함수는 현재 DOM 노드를 전달받습니다.

### ref 콜백을 메모이제이션하는 예

`useCallback` 훅을 사용하여 ref 콜백 함수를 메모이제이션하면, DOM 노드가 변경되거나 컴포넌트가 재렌더링되더라도 ref 콜백이 재호출되지 않게 할 수 있습니다.

#### 예제: ref 콜백을 메모이제이션하는 방법

```jsx
import React, { useState, useCallback } from 'react';

const MyComponent: React.FC = () => {
  const [count, setCount] = useState(0);

  const refCallback = useCallback((node: HTMLDivElement | null) => {
    console.log(node);
  }, []); // 빈 배열로 메모이제이션

  return (
    <div ref={refCallback}>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
};

export default MyComponent;
```

이 예제에서 `refCallback`은 `useCallback`으로 메모이제이션됩니다.

`refCallback`이 빈 의존 배열 `[]`로 메모이제이션되어, DOM 노드가 변경되거나 컴포넌트가 재렌더링되더라도 동일한 콜백 함수가 유지됩니다.

### ref 콜백과 useEffect의 유사성과 차이점

`ref` 콜백과 `useEffect`는 모두 이전 상태를 클린업하고 새로운 상태를 설정하는 방식으로 작동하지만, 클린업 방법이 다릅니다.

`useEffect`는 클린업 함수를 반환하여 이전 이펙트를 정리하고, `ref` 콜백은 이전 콜백에 `null`을 전달하여 클린업 작업을 수행합니다.

#### 예제: useEffect로 DOM 조작

```jsx
import React, { useRef, useEffect, useState } from 'react';

const MyComponent: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const node = ref.current;
      const controller = new AbortController();
      node.addEventListener('transitionstart', () => {
        console.log('transition start');
      }, {
        signal: controller.signal,
      });

      return () => {
        controller.abort();
        console.log('cleanup', node);
      };
    }
  }, []);

  return (
    <div>
      <div ref={ref}>...</div>
    </div>
  );
};

export default MyComponent;
```

이 예제에서는 `useEffect`를 사용하여 `transitionstart` 이벤트를 설정하고, 컴포넌트가 언마운트될 때 클린업 작업을 수행합니다.

`useEffect`는 컴포넌트가 처음 렌더링될 때 `ref`의 DOM 노드에 이벤트를 추가하고, 컴포넌트가 제거될 때 이벤트 리스너를 제거하는 클린업 함수를 반환합니다.

### 문제 있는 컴포넌트

리렌더링 시 DOM 노드가 변경될 때 문제를 발생시킬 수 있습니다. 예를 들어:

```jsx
import React, { useState, useEffect, useRef } from 'react';

const MyComponent: React.FC = () => {
  const [isShown, setIsShown] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const node = ref.current;
      const controller = new AbortController();
      node.addEventListener('transitionstart', () => {
        console.log('transition start');
      }, {
        signal: controller.signal,
      });

      return () => {
        controller.abort();
        console.log('cleanup', node);
      };
    }
  }, []);

  return (
    <div>
      {isShown ? <div ref={ref}>...</div> : null}
      <button onClick={() => setIsShown(s => !s)}>Toggle</button>
    </div>
  );
};

export default MyComponent;
```

이 컴포넌트는 버튼 클릭 시 `isShown` 상태에 따라 `<div>` 요소를 토글합니다.

`useEffect`의 의존 배열이 빈 배열 `[]`로 설정되어 있기 때문에, `useEffect`는 최초 렌더링 시에만 호출되고 이후에는 호출되지 않습니다.

이로 인해 `transitionstart` 이벤트를 추가한 DOM 노드가 제거될 때 클린업되지 않고, 새 DOM 노드가 추가될 때 이벤트가 추가되지 않습니다.

이 문제를 해결하기 위해 `useEffect`의 의존 배열에 `[isShown]`을 추가할 수 있지만, 이는 바람직하지 않을 수 있습니다. 

이런 상황에서는 ref 콜백을 사용하여 문제를 해결할 수 있습니다.

### ref 콜백을 사용하는 예

```jsx
import React, { useState, useCallback } from 'react';

const MyComponent: React.FC = () => {
  const [isShown, setIsShown] = useState(false);

  const refCallback = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      const controller = new AbortController();
      node.addEventListener('transitionstart', () => {
        console.log('transition start');
      }, {
        signal: controller.signal,
      });

      return () => {
        controller.abort();
        console.log('cleanup', node);
      };
    }
  }, []);

  return (
    <div>
      {isShown ? <div ref={refCallback}>...</div> : null}
      <button onClick={() => setIsShown(s => !s)}>Toggle</button>
    </div>
  );
};

export default MyComponent;
```

이 예제에서 `useCallback`을 사용하여 ref 콜백을 메모이제이션합니다.

`refCallback` 함수는 DOM 노드가 마운트될 때 `transitionstart` 이벤트를 설정하고, DOM 노드가 언마운트될 때 클린업 작업을 수행합니다.

`useCallback`을 사용하면, ref 콜백 함수는 DOM 노드가 변경될 때만 호출되며, 재렌더링 시에도 동일한 콜백이 유지됩니다.

## 요약

- **ref 콜백의 클린업 함수**: React 19에서 ref 콜백 함수가 클린업 함수를 반환할 수 있게 되었습니다. 이를 통해 DOM 노드가 제거되거나 변경될 때 클린업 작업을 더 간편하게 처리할 수 있습니다.

- **`useEffect`와의 유사성과 차이점**: `useEffect`와 ref 콜백은 모두 상태를 클린업하고 새로운 상태를 설정하는 방식으로 작동하지만, 클린업 방법이 다릅니다. `useEffect`는 클린업 함수를 반환하여 이전 이펙트를 정리하고, ref 콜백은 이전 콜백에 `null`을 전달하여 클린업 작업을 수행합니다.

- **직접 기억하는 예**: ref 콜백에서 직접 클린업 작업을 기억할 수 있지만, 이는 다소 불편할 수 있습니다. React 19에서는 클린업 함수를 반환할 수 있는 기능이 추가되어, `useEffect`와 유사한 방식으로 클린업 작업을 처리할 수 있습니다.

- **useEffect로 DOM 조작하는 예**: `useEffect`를 사용하여 DOM 노드에 이벤트를 설정하고, 컴포넌트 언마운트 시 클린업 작업을 수행하는 예제를 통해 `useEffect`의 사용법을 설명하였습니다.

- **문제 있는 컴포넌트**: 컴포넌트가 재렌더링될 때 DOM 노드가 변경되면서 발생할 수 있는 문제와 이를 해결하기 위한 방법으로 ref 콜백을 사용한 예제를 제공하였습니다.

- **ref 콜백을 사용하는 예**: `useCallback`을 사용하여 ref 콜백을 메모이제이션하고, 클린업 작업을 수행하는 방법을 설명했습니다. 이로 인해 DOM 노드의 생성과 제거를 보다 효율적으로 관리할 수 있습니다.

---

## ref를 prop으로 전달할 수 있는 개선

React 19에서는 `ref`를 prop으로 직접 전달할 수 있는 기능이 추가되었습니다.

이전에는 `ref`를 prop으로 직접 전달할 수 없었고, `forwardRef`를 사용하여 ref를 전달할 수 있도록 했습니다.

이 변경은 코드의 복잡성을 줄이고, 컴포넌트의 사용을 더 직관적으로 만들어 줍니다.

### React 18의 ref 동작

React 18에서는 `ref`를 prop으로 직접 전달할 수 없었습니다. 대신, `forwardRef`를 사용하여 ref를 전달할 수 있었습니다.

#### 예제: React 18의 ref 동작

```jsx
import React from 'react';

// ref를 prop으로 전달해도...
const MyComponent = ({ ref }) => {
  // ref는 undefined로 설정됨
  return <div ref={ref}>Hello</div>;
};

// 사용 예
const myRef = React.createRef<HTMLDivElement>();

export default function App() {
  return <MyComponent ref={myRef} />;
}
```

이 예제에서 `ref`는 `MyComponent`로 전달되지만, `prop`으로 전달된 `ref`는 `undefined`로 설정됩니다.

이 경우, `MyComponent`에서는 `ref`를 사용할 수 없으며, `forwardRef`를 사용해야만 ref를 전달할 수 있었습니다.

### forwardRef 사용법

`forwardRef`는 ref를 직접 전달받을 수 있는 컴포넌트를 생성하는 데 사용됩니다.

#### 예제: forwardRef 사용법

```jsx
import React from 'react';

// forwardRef를 사용하여 ref를 전달받는 컴포넌트 생성
const MyComponent = React.forwardRef((props, ref) => {
  return <div ref={ref}>Hello</div>;
});

// 사용 예
const myRef = React.createRef<HTMLDivElement>();

export default function App() {
  return <MyComponent ref={myRef} />;
}
```

이 코드에서 `React.forwardRef`를 사용하여 `MyComponent`가 `ref`를 직접 전달받을 수 있게 됩니다.

`MyComponent`는 `props`와 `ref`를 인자로 받아, `ref`를 `div` 요소에 설정합니다.

### React 19의 ref 동작

React 19에서는 ref를 prop으로 직접 전달할 수 있게 되었습니다.

이제는 `forwardRef`를 사용할 필요가 없으며, ref를 prop으로 직접 전달하고 사용할 수 있습니다.

#### 예제: React 19의 ref 동작

```jsx
import React from 'react';

// ref를 prop으로 직접 전달받는 컴포넌트
const MyComponent: React.FC<{ ref?: React.Ref<HTMLDivElement> }> = ({ ref }) => {
  return <div ref={ref}>Hello</div>;
};

// 사용 예
const myRef = React.createRef<HTMLDivElement>();

export default function App() {
  return <MyComponent ref={myRef} />;
}
```

### 설명

1. **`ref`를 prop으로 직접 전달**: React 19에서는 ref를 prop으로 직접 전달할 수 있습니다.
2. 
3. 이로 인해 `forwardRef`를 사용할 필요가 없어졌습니다.
4. 
5. `MyComponent`는 `ref`를 prop으로 직접 받아, `div` 요소에 설정합니다.

   ```jsx
   const MyComponent: React.FC<{ ref?: React.Ref<HTMLDivElement> }> = ({ ref }) => {
     return <div ref={ref}>Hello</div>;
   };
   ```

6. **컴포넌트 사용**: `MyComponent`를 사용할 때, `ref`를 prop으로 전달합니다.
7. 
8. 이 방식은 코드의 간결성을 높여주며, 컴포넌트가 ref를 쉽게 처리할 수 있게 해줍니다.

   ```jsx
   const myRef = React.createRef<HTMLDivElement>();

   export default function App() {
     return <MyComponent ref={myRef} />;
   }
   ```

### 요약

- **`ref`를 prop으로 직접 전달**: React 19에서는 `ref`를 prop으로 직접 전달할 수 있으며, `forwardRef`를 사용할 필요가 없습니다. 이로 인해 코드가 더 간결해지고, 컴포넌트의 사용이 직관적으로 개선되었습니다.

- **실제 예제**: `ref`를 prop으로 직접 전달받아 사용하는 컴포넌트와 이를 사용하는 방법을 실제 코드 예제로 설명했습니다.

---

## useDeferredValue의 초기값

### useDeferredValue란

`useDeferredValue`는 React 18에서 도입된 훅으로, 비동기 상태 업데이트를 지연시켜 UI의 성능을 최적화하는 데 유용합니다.

이 훅을 사용하면 상태가 변화할 때 그 변화를 즉시 반영하기보다는 일정 시간 동안 지연시켜서 부드러운 사용자 경험을 제공할 수 있습니다.

비동기 작업이 완료될 때까지 UI를 안정적으로 유지할 수 있도록 도와줍니다.

### 예시

다음은 `useDeferredValue`를 사용하는 기본적인 예제입니다:

```jsx
import React, { useState } from 'react';
import { useDeferredValue } from 'react';

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <SearchResults query={deferredQuery} />
    </div>
  );
};

const SearchResults: React.FC<{ query: string }> = ({ query }) => {
  // 이 컴포넌트는 `query`가 변경될 때마다 다시 렌더링됩니다.
  return <div>Search results for: {query}</div>;
};
```

이 예제에서, 사용자가 입력 필드에 텍스트를 입력하면 `query` 상태가 업데이트됩니다.

`useDeferredValue`를 사용하여 `deferredQuery`를 생성하며, 이 값은 지연되어 업데이트됩니다.

그 결과, `SearchResults` 컴포넌트는 입력 필드에서 텍스트를 입력하는 동안 지연된 검색어를 사용하여 결과를 렌더링합니다.

이로 인해 사용자 입력에 따라 UI가 부드럽게 반응하도록 돕습니다.

### React 19의 새로운 기능

React 19에서는 `useDeferredValue`의 두 번째 인자로 초기값을 설정할 수 있는 기능이 추가되었습니다. 이 기능은 컴포넌트의 최초 렌더링 시에도 트랜지션을 적용하여 사용자 인터페이스를 부드럽게 제공할 수 있도록 합니다.

#### 예제: 초기값 설정

다음은 `useDeferredValue`의 두 번째 인자로 초기값을 설정하는 예제입니다:

```jsx
import React, { useState } from 'react';
import { useDeferredValue } from 'react';

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query, '');

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <SearchResults query={deferredQuery} />
    </div>
  );
};

const SearchResults: React.FC<{ query: string }> = ({ query }) => {
  // 이 컴포넌트는 `query`가 변경될 때마다 다시 렌더링됩니다.
  return <div>Search results for: {query}</div>;
};
```

### 설명

1. **초기값 설정**: 새로운 기능으로 `useDeferredValue`의 두 번째 인자로 초기값을 설정할 수 있습니다. 이 초기값은 컴포넌트의 최초 렌더링 시에 사용됩니다. 위 예제에서는 빈 문자열 `''`을 초기값으로 설정했습니다.

   ```jsx
   const deferredQuery = useDeferredValue(query, '');
   ```

   이 초기값은 컴포넌트의 최초 렌더링 시 `deferredQuery`에 설정되며, 이후 `query`의 값이 업데이트되면 새로운 값으로 트랜지션이 발생합니다.

2. **트랜지션 처리**: 초기값을 사용하면 트랜지션을 통해 상태가 즉시 업데이트되기 전에 부드러운 사용자 인터페이스를 제공할 수 있습니다. 예를 들어, 입력 필드에서 텍스트를 입력하는 동안 `deferredQuery`는 지연된 값을 사용하여 검색 결과를 렌더링합니다. 이는 입력 필드의 변화에 즉시 반응하지 않고, 지연된 값을 사용하여 결과를 표시함으로써 사용자 인터페이스를 부드럽게 유지합니다.

   ```jsx
   <SearchResults query={deferredQuery} />
   ```

   이로 인해 사용자 입력의 반응이 부드럽고, UI의 성능이 향상됩니다.

## 요약

- **`useDeferredValue`**: 비동기 상태 업데이트의 트랜지션을 지연시키는 훅으로, 사용자 인터페이스의 성능을 최적화합니다.

- **초기값 설정**: React 19에서는 `useDeferredValue`의 두 번째 인자로 초기값을 설정할 수 있습니다. 이로 인해 최초 렌더링 시에도 트랜지션을 적용할 수 있습니다.

- **예제**: `useDeferredValue`를 사용해 상태 업데이트를 지연시키고, 사용자 입력에 따라 부드러운 UI를 제공하는 방법을 설명했습니다.

---

## 에러 핸들링의 개선

React 19에서는 에러 핸들링을 세밀하게 제어할 수 있는 새로운 기능이 도입되었습니다.

이제 `createRoot`와 `hydrateRoot` 메서드에서 `onCaughtError`와 `onUncaughtError` 옵션을 사용하여 에러 처리 방식을 조정할 수 있습니다.

### 기존의 문제점

기존에는 `Error Boundary`를 사용하여 에러를 잡았지만, 여전히 콘솔에 `console.error`로 에러가 출력되는 문제가 있었습니다.

이로 인해 개발자는 에러가 정상적으로 처리되었음에도 불구하고 불필요한 에러 메시지를 보게 되었고, 이는 개발 과정에서 혼란을 초래할 수 있었습니다.

### React 19의 개선

React 19에서는 에러 핸들링을 더 세밀하게 제어할 수 있는 방법이 제공됩니다.

`createRoot`와 `hydrateRoot`의 `onCaughtError` 및 `onUncaughtError` 옵션을 사용하여 콘솔에 에러 메시지를 출력하는 기본 동작을 덮어쓸 수 있습니다.

#### 예제: onCaughtError 사용

`onCaughtError`는 `Error Boundary`가 잡은 에러를 처리할 때 사용됩니다.

이 옵션을 사용하여 에러가 콘솔에 기록되는 방식을 제어할 수 있습니다.

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';

const App: React.FC = () => {
  // 의도적으로 에러를 발생시키는 컴포넌트
  throw new Error('Something went wrong!');
  return <div>Hello, React 19!</div>;
};

// createRoot를 사용하여 에러 핸들링 설정
ReactDOM.createRoot(document.getElementById('root')!, {
  onCaughtError: (error) => {
    // 에러를 info로 기록
    console.info('Caught an error:', error);
  },
}).render(<App />);
```

### 설명

1. **`createRoot` 사용**: `ReactDOM.createRoot` 메서드를 사용하여 루트를 생성하고, `onCaughtError` 옵션을 설정합니다.

   ```jsx
   ReactDOM.createRoot(document.getElementById('root')!, {
     onCaughtError: (error) => {
       console.info('Caught an error:', error);
     },
   }).render(<App />);
   ```

   이 코드에서 `onCaughtError` 옵션에 제공된 함수는 `Error Boundary`가 잡은 에러를 처리합니다. 기본적으로 `console.error`로 출력되는 에러를 `console.info`로 기록하여 개발자 혼란을 줄일 수 있습니다.

2. **에러 발생**: `App` 컴포넌트에서 의도적으로 에러를 발생시킵니다. 이 에러는 `createRoot`의 `onCaughtError` 옵션에 의해 처리됩니다.

   ```jsx
   const App: React.FC = () => {
     throw new Error('Something went wrong!');
     return <div>Hello, React 19!</div>;
   };
   ```

   이 경우, `onCaughtError`는 `Error Boundary`가 잡은 에러를 `console.info`로 기록합니다.

### onUncaughtError 사용

`onUncaughtError`는 `Error Boundary`가 잡지 못한 에러를 처리하는 옵션입니다.

이 옵션을 사용하면 애플리케이션 전체에서 발생한 예기치 않은 에러를 처리할 수 있습니다.

#### 예제: onUncaughtError 사용

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';

const App: React.FC = () => {
  // 의도적으로 에러를 발생시키는 컴포넌트
  throw new Error('Something went wrong!');
  return <div>Hello, React 19!</div>;
};

// createRoot를 사용하여 에러 핸들링 설정
ReactDOM.createRoot(document.getElementById('root')!, {
  onCaughtError: (error) => {
    console.info('Caught an error:', error);
  },
  onUncaughtError: (error) => {
    console.error('Uncaught error:', error);
  },
}).render(<App />);
```

### 설명

1. **`onUncaughtError` 옵션**: 이 옵션에 제공된 함수는 `Error Boundary`가 잡지 못한 에러를 처리합니다. 이러한 에러는 애플리케이션 전체에서 발생할 수 있는 예기치 않은 에러입니다.

   ```jsx
   onUncaughtError: (error) => {
     console.error('Uncaught error:', error);
   }
   ```

   `onUncaughtError`를 사용하여, 애플리케이션에서 발생한 에러를 `console.error`로 기록합니다. 이는 `Error Boundary`가 에러를 잡지 못한 경우에 유용합니다.

2. **에러 발생**: `App` 컴포넌트에서 발생한 에러는 `onCaughtError`와 `onUncaughtError` 옵션에 의해 처리됩니다. `onCaughtError`는 `Error Boundary`가 잡은 에러를 처리하고, `onUncaughtError`는 잡지 못한 에러를 처리합니다.

### 요약

- **`onCaughtError`**: `Error Boundary`가 잡은 에러를 처리하는 옵션입니다. 기본적으로 `console.error`로 출력되는 에러를 `console.info`로 기록하여 개발자의 혼란을 줄일 수 있습니다.

- **`onUncaughtError`**: `Error Boundary`가 잡지 못한 에러를 처리하는 옵션입니다. 애플리케이션 전체에서 발생한 예기치 않은 에러를 `console.error`로 기록합니다.

- **예제**: `createRoot`를 사용하여 `onCaughtError`와 `onUncaughtError` 옵션을 설정하고, 에러를 처리하는 방법을 실제 코드 예제로 설명했습니다.



