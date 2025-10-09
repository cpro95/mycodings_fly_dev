---
slug: 2024-07-14-react-19-tutorial-5-breaking-changes-prop-types-context-ref
title: React 19 강좌 5편 - React 19 주요 변경 사항 - propTypes와 defaultProps의 폐지, Legacy Context의 제거, ref 개선 및 useReducer 타입 시그니처 변경
date: 2024-07-14 08:31:38.568000+00:00
summary: React 19에서의 주요 변경 사항인 propTypes와 defaultProps의 폐지, Legacy Context의 제거, ref의 개선, 그리고 useReducer 타입 시그니처 변경을 포괄적으로 다루고 있음을 강조합니다.
tags: ["react", "react 19", "propTypes", "defaultProps", "Legacy Context", "ref", "useReducer"]
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

- [React 19 강좌 5편 - React 19 주요 변경 사항 - propTypes와 defaultProps의 폐지, Legacy Context의 제거, ref 개선 및 useReducer 타입 시그니처 변경](#react-19-강좌-5편---react-19-주요-변경-사항---proptypes와-defaultprops의-폐지-legacy-context의-제거-ref-개선-및-usereducer-타입-시그니처-변경)
  - [propTypes와 defaultProps의 일부 폐지](#proptypes와-defaultprops의-일부-폐지)
    - [propTypes란?](#proptypes란)
      - [예제: propTypes](#예제-proptypes)
    - [defaultProps란?](#defaultprops란)
      - [예제: defaultProps](#예제-defaultprops)
    - [TypeScript로의 전환](#typescript로의-전환)
      - [예제: TypeScript를 사용한 props 검증 및 기본 값 설정](#예제-typescript를-사용한-props-검증-및-기본-값-설정)
    - [요약](#요약)
  - [Legacy Context의 폐지](#legacy-context의-폐지)
    - [Legacy Context란?](#legacy-context란)
    - [예제: Legacy Context 사용법](#예제-legacy-context-사용법)
    - [새로운 Context API](#새로운-context-api)
    - [예제: 새로운 Context API 사용법](#예제-새로운-context-api-사용법)
    - [설명](#설명)
    - [Legacy Context와 새로운 Context API의 차이점](#legacy-context와-새로운-context-api의-차이점)
    - [요약](#요약-1)
  - [string ref의 폐지](#string-ref의-폐지)
    - [string ref란?](#string-ref란)
    - [예제: string ref](#예제-string-ref)
    - [문제점](#문제점)
    - [`ref` 콜백으로 대체하기](#ref-콜백으로-대체하기)
      - [예제: ref 콜백 사용](#예제-ref-콜백-사용)
    - [설명](#설명-1)
    - [요약](#요약-2)
  - [ReactDOM.render의 폐지](#reactdomrender의-폐지)
    - [이전 방식](#이전-방식)
    - [새로운 방식](#새로운-방식)
    - [설명](#설명-2)
    - [실제 예제](#실제-예제)
      - [App.js](#appjs)
      - [index.js](#indexjs)
  - [요약](#요약-3)
  - [useRef에 인자가 필수로 변경](#useref에-인자가-필수로-변경)
    - [useRef란?](#useref란)
    - [이전 코드](#이전-코드)
    - [수정된 코드](#수정된-코드)
    - [예제: useRef의 활용](#예제-useref의-활용)
    - [설명](#설명-3)
    - [요약](#요약-4)
  - [useReducer의 시그니처 변경](#usereducer의-시그니처-변경)
    - [이전 타입](#이전-타입)
    - [새로운 타입](#새로운-타입)
    - [새로운 타입의 예제](#새로운-타입의-예제)
    - [설명](#설명-4)
  - [요약](#요약-5)

---

## propTypes와 defaultProps의 일부 폐지

React 19에서는 `propTypes`와 `defaultProps`의 사용이 폐지되었습니다.

이 두 기능은 컴포넌트의 props 타입을 검증하고 기본 값을 설정하는 데 사용되었습니다.

그러나 현재는 TypeScript와 같은 타입 시스템이 이러한 기능을 대체할 수 있기 때문에, 이들 기능이 더 이상 권장되지 않습니다.

### propTypes란?

`propTypes`는 컴포넌트의 props 타입을 런타임에 검증하는 메커니즘입니다.

이를 통해 잘못된 타입의 props가 전달되는 것을 방지할 수 있습니다.

#### 예제: propTypes

```jsx
import React from 'react';
import PropTypes from 'prop-types';

const MyComponent = ({ name }) => {
  return <div>Hello, {name}</div>;
};

// propTypes 설정
MyComponent.propTypes = {
  name: PropTypes.string.isRequired,
};

export default MyComponent;
```

이 예제에서 `propTypes`는 `name` prop이 문자열이어야 하고 필수로 제공되어야 한다는 것을 검증합니다.

그러나 React 19에서 `propTypes`는 더 이상 사용되지 않습니다.

### defaultProps란?

`defaultProps`는 컴포넌트의 props에 기본 값을 설정하는 데 사용됩니다.

이를 통해 prop이 제공되지 않았을 경우 기본 값을 설정할 수 있습니다.

#### 예제: defaultProps

```jsx
import React from 'react';

const MyComponent: React.FC<{ name?: string }> = ({ name }) => {
  return <div>Hello, {name}</div>;
};

// defaultProps 설정
MyComponent.defaultProps = {
  name: 'World',
};

export default MyComponent;
```

이 예제에서 `defaultProps`는 `name` prop이 제공되지 않았을 경우 'World'라는 기본 값을 설정합니다.

그러나 React 19에서는 함수 컴포넌트에서 `defaultProps` 사용이 폐지되었습니다.

### TypeScript로의 전환

React 19에서는 `propTypes`와 `defaultProps`를 사용하는 대신 TypeScript와 같은 정적 타입 시스템을 사용하여 props를 검증하고 기본 값을 설정하는 것이 권장됩니다.

TypeScript는 컴파일 타임에 타입 검사를 수행하므로, 런타임 오류를 줄이고 코드의 안정성을 높일 수 있습니다.

#### 예제: TypeScript를 사용한 props 검증 및 기본 값 설정

```tsx
import React from 'react';

// TypeScript를 사용하여 props 타입 정의
interface MyComponentProps {
  name?: string;
}

// 기본 값 설정은 함수 컴포넌트 내에서 직접 처리
const MyComponent: React.FC<MyComponentProps> = ({ name = 'World' }) => {
  return <div>Hello, {name}</div>;
};

export default MyComponent;
```

이 예제에서 `MyComponentProps` 인터페이스를 사용하여 `name` prop의 타입을 정의합니다.

기본 값은 함수 컴포넌트의 파라미터에서 직접 설정하며, TypeScript가 컴파일 타임에 타입 검사를 수행합니다.

### 요약

- **`propTypes` 폐지**: `propTypes`는 더 이상 사용되지 않으며, TypeScript와 같은 정적 타입 검사를 통해 props를 검증하는 것이 권장됩니다.

- **`defaultProps` 폐지**: 함수 컴포넌트에서 `defaultProps` 사용이 폐지되었으며, 기본 값 설정은 함수 파라미터에서 직접 처리합니다.

- **TypeScript의 사용**: TypeScript를 사용하여 props의 타입을 정의하고, 기본 값을 설정하여 코드의 안정성과 타입 안전성을 강화합니다.

---

## Legacy Context의 폐지

`Legacy Context`는 React의 초기 버전에서 제공된 Context API로, 주로 클래스 컴포넌트에서 사용되었습니다.

하지만 새로운 Context API가 도입되면서 `Legacy Context`는 비추천되었고, React 19에서는 완전히 폐지되었습니다.

새로운 Context API는 함수 컴포넌트와 훅을 통해 보다 현대적이고 강력한 방식으로 Context를 관리할 수 있습니다.

### Legacy Context란?

Legacy Context는 React의 초기 Context API로, 클래스 컴포넌트에서 Context를 제공하고 소비하는 기능을 지원했습니다.

이 API는 `contextTypes`와 `childContextTypes`를 사용하여 Context를 설정하고 읽어왔습니다.

### 예제: Legacy Context 사용법

다음은 Legacy Context를 사용하는 클래스 컴포넌트의 예제입니다:

```jsx
import React from 'react';

// Legacy Context 생성
const MyContext = React.createContext();

class ParentComponent extends React.Component {
  getChildContext() {
    return { value: 'Hello from Context' };
  }

  render() {
    return <ChildComponent />;
  }
}

ParentComponent.childContextTypes = {
  value: React.PropTypes.string
};

const ChildComponent = (props, context) => {
  return <div>Value: {context.value}</div>;
};

ChildComponent.contextTypes = {
  value: React.PropTypes.string
};

export default ParentComponent;
```

이 예제에서 `ParentComponent`는 `getChildContext` 메서드를 통해 Context 값을 제공합니다.

`ChildComponent`는 `contextTypes`를 사용하여 Context 값을 읽어옵니다.

그러나 이 방식은 새로운 Context API가 도입되면서 비추천되었습니다.

### 새로운 Context API

새로운 Context API는 함수 컴포넌트와 훅을 통해 Context를 보다 간편하게 관리할 수 있습니다.

`React.createContext`를 사용하여 Context를 생성하고, `useContext` 훅을 사용하여 Context 값을 읽어올 수 있습니다.

### 예제: 새로운 Context API 사용법

다음은 새로운 Context API를 사용하는 함수 컴포넌트의 예제입니다:

```jsx
import React, { createContext, useContext, useState } from 'react';

// 새로운 Context 생성
const MyContext = createContext<string | undefined>(undefined);

const ParentComponent: React.FC = () => {
  const [value, setValue] = useState('Hello from Context');

  return (
    <MyContext.Provider value={value}>
      <ChildComponent />
    </MyContext.Provider>
  );
};

const ChildComponent: React.FC = () => {
  const contextValue = useContext(MyContext);
  return <div>Value: {contextValue}</div>;
};

export default ParentComponent;
```

### 설명

1. **`createContext`**: 새로운 Context를 생성합니다. 기본값은 `undefined`로 설정되어 있으며, Context의 타입을 명시할 수 있습니다.

   ```jsx
   const MyContext = createContext<string | undefined>(undefined);
   ```

2. **`MyContext.Provider`**: Context 값을 제공하는 Provider입니다. `value` 속성에 제공할 값을 설정합니다.

   ```jsx
   <MyContext.Provider value={value}>
     <ChildComponent />
   </MyContext.Provider>
   ```

3. **`useContext`**: Context 값을 읽어오는 훅입니다. 함수 컴포넌트에서 Context 값을 쉽게 사용할 수 있습니다.

   ```jsx
   const contextValue = useContext(MyContext);
   ```

   이 훅을 사용하여 `MyContext`에서 제공하는 값을 읽어옵니다.

### Legacy Context와 새로운 Context API의 차이점

- **함수 컴포넌트와 훅 지원**: 새로운 Context API는 함수 컴포넌트와 훅을 지원하여 더 현대적이고 간편한 방식으로 Context를 관리할 수 있습니다.

- **명확한 타입 정의**: TypeScript와 함께 사용할 때, 새로운 Context API는 더 명확한 타입 정의를 지원합니다.

- **비추천된 API**: Legacy Context는 클래스 컴포넌트에서만 사용되었으며, 새로운 Context API가 도입되면서 비추천되었습니다.

### 요약

- **Legacy Context**: React의 초기 Context API로, 클래스 컴포넌트에서만 사용되었습니다. 새로운 Context API와의 호환성 문제로 폐지되었습니다.

- **새로운 Context API**: 함수 컴포넌트와 훅을 지원하며, `createContext`와 `useContext`를 통해 Context를 쉽고 명확하게 관리할 수 있습니다.

- **예제**: 새로운 Context API를 사용하여 Context를 생성하고, Provider와 Consumer 역할을 수행하는 방법을 코드 예제로 설명했습니다.

---

## string ref의 폐지

`string ref`는 문자열을 `ref`로 전달하는 방식을 의미하며, 클래스 컴포넌트에서만 사용되었습니다.

이 방식은 성능과 표현력 측면에서 제한적이었기 때문에 React 19에서는 폐지되었습니다.

대신, `ref` 콜백이나 `React.createRef()`를 사용하여 DOM 요소에 접근하는 방식이 권장됩니다.

### string ref란?

`string ref`는 문자열을 `ref` 속성에 직접 전달하여 DOM 요소에 접근할 수 있는 방식입니다.

이는 오래된 방식으로, 클래스 컴포넌트에서만 사용되었으며, 표현력이 부족하고 성능적인 문제도 있었습니다.

### 예제: string ref

다음은 `string ref`를 사용하는 기존 방식의 예제입니다:

```jsx
import React from 'react';

class MyComponent extends React.Component {
  componentDidMount() {
    // string ref를 사용하여 input 요소에 포커스를 설정합니다.
    this.refs.myInput.focus();
  }

  render() {
    return <input ref="myInput" />;
  }
}

export default MyComponent;
```

이 예제에서 `ref="myInput"`는 문자열을 `ref` 속성에 전달하여 DOM 요소를 참조합니다.

`this.refs.myInput`을 통해 `input` 요소에 접근하고, `componentDidMount` 라이프사이클 메서드에서 포커스를 설정합니다.

### 문제점

`string ref` 방식의 주요 문제점은 다음과 같습니다:

1. **성능 문제**: 문자열을 `ref`로 사용하면, React가 내부적으로 문자열을 객체로 변환해야 하므로 성능이 저하될 수 있습니다.

2. **표현력 부족**: 문자열 `ref`는 `ref` 콜백이나 `React.createRef()`에 비해 코드의 명확성과 유지보수성이 떨어집니다.

3. **타입 안전성 부족**: TypeScript와 같은 타입 시스템을 사용할 때, 문자열 `ref`는 타입 안전성을 보장하지 않습니다.

### `ref` 콜백으로 대체하기

`string ref`는 `ref` 콜백으로 대체할 수 있으며, 이 방식은 성능과 표현력 측면에서 더 나은 해결책을 제공합니다.

`ref` 콜백을 사용하면, DOM 요소가 마운트될 때와 언마운트될 때의 상태를 더 잘 관리할 수 있습니다.

#### 예제: ref 콜백 사용

다음은 `string ref`를 `ref` 콜백으로 대체한 예제입니다:

```jsx
import React, { useRef, useEffect } from 'react';

const MyComponent: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // ref 콜백을 사용하여 input 요소에 포커스를 설정합니다.
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return <input ref={inputRef} />;
};

export default MyComponent;
```

### 설명

1. **`useRef` 사용**: `useRef` 훅을 사용하여 `inputRef`를 생성합니다. 이 훅은 DOM 요소를 참조할 수 있는 `ref` 객체를 반환합니다.
   
   ```jsx
   const inputRef = useRef<HTMLInputElement>(null);
   ```

   여기서 `null`은 초기값으로, DOM 요소가 아직 마운트되지 않았음을 나타냅니다.

2. **`useEffect`에서 ref 접근**: `useEffect` 훅을 사용하여 컴포넌트가 마운트된 후 `inputRef.current`를 통해 DOM 요소에 포커스를 설정합니다.

   ```jsx
   useEffect(() => {
     if (inputRef.current) {
       inputRef.current.focus();
     }
   }, []);
   ```

   `inputRef.current`가 `null`이 아닌 경우에만 포커스를 설정합니다. 이는 컴포넌트가 마운트된 후 DOM 요소에 접근할 수 있도록 보장합니다.

3. **렌더링**: `ref` 콜백을 사용하여 `input` 요소에 `inputRef`를 전달합니다. 이렇게 하면 `inputRef.current`를 통해 DOM 요소에 접근할 수 있습니다.

   ```jsx
   return <input ref={inputRef} />;
   ```

### 요약

- **`string ref`의 폐지**: `string ref`는 성능과 표현력 측면에서 문제가 있었기 때문에 React 19에서 폐지되었습니다.

- **`ref` 콜백으로의 대체**: `ref` 콜백을 사용하여 DOM 요소에 접근할 수 있으며, 성능과 표현력 측면에서 더 나은 해결책을 제공합니다.

- **예제**: `useRef`와 `useEffect`를 사용하여 DOM 요소에 접근하고, 상태를 관리하는 방법을 실제 코드 예제로 설명했습니다.

---

## ReactDOM.render의 폐지

React 19에서는 `ReactDOM.render`가 폐지되었으며, 모든 렌더링 작업은 `createRoot`를 사용하여 수행해야 합니다.

이 변경은 React의 렌더링 API를 더 효율적으로 관리할 수 있도록 도와줍니다.

### 이전 방식

기존의 `ReactDOM.render` 메서드를 사용하여 애플리케이션을 렌더링하는 방식은 다음과 같았습니다:

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// 이전 방식
ReactDOM.render(<App />, document.getElementById('root'));
```

이 코드에서 `ReactDOM.render`는 `App` 컴포넌트를 `root`라는 ID를 가진 DOM 요소에 렌더링합니다.

이 방식은 React 18까지 사용되었으며, React 19에서는 `createRoot`로 대체되었습니다.

### 새로운 방식

React 19에서는 `ReactDOM.createRoot` 메서드를 사용하여 렌더링 작업을 수행합니다.

`createRoot` 메서드는 React의 새로운 렌더링 API를 사용하여 더 나은 성능과 효율성을 제공합니다.

다음은 `createRoot`를 사용하는 새로운 렌더링 방식의 예제입니다:

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 새로운 방식
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
```

### 설명

1. **`ReactDOM.createRoot`**: 이 메서드는 렌더링할 DOM 요소를 선택하고, 새로운 React 루트를 생성합니다. `createRoot`는 React 19에서 도입된 새로운 렌더링 API입니다.
   
   ```jsx
   const root = ReactDOM.createRoot(document.getElementById('root')!);
   ```

   여기서 `document.getElementById('root')!`는 렌더링할 DOM 요소를 선택합니다. `!`는 TypeScript의 널 체크를 무시하는 연산자로, `document.getElementById('root')`가 `null`이 아님을 보장합니다.

2. **`root.render`**: 생성된 루트 객체의 `render` 메서드를 호출하여 컴포넌트를 렌더링합니다.

   ```jsx
   root.render(<App />);
   ```

   이 메서드는 `App` 컴포넌트를 `root` DOM 요소에 렌더링합니다. `ReactDOM.render`와 동일한 역할을 하지만, `createRoot`를 통해 성능과 효율성 개선을 제공합니다.

### 실제 예제

다음은 간단한 React 애플리케이션을 `createRoot`를 사용하여 렌더링하는 예제입니다.

이 예제는 `App` 컴포넌트를 `root` 요소에 렌더링합니다.

#### App.js

```jsx
import React from 'react';

const App: React.FC = () => {
  return <h1>Hello, React 19!</h1>;
};

export default App;
```

#### index.js

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 새로운 렌더링 방식
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
```

이 예제에서 `index.js` 파일은 `App` 컴포넌트를 `root` DOM 요소에 렌더링하는 역할을 합니다.

`createRoot`를 사용하여 루트를 생성하고, `render` 메서드를 호출하여 컴포넌트를 렌더링합니다.

## 요약

- **`ReactDOM.render`의 폐지**: React 19에서는 `ReactDOM.render`가 폐지되고, 모든 렌더링 작업은 `ReactDOM.createRoot`를 사용하여 수행해야 합니다.

- **`createRoot` 사용**: `createRoot` 메서드는 새로운 렌더링 API를 제공하며, 더 나은 성능과 효율성을 위해 사용됩니다.

- **실제 예제**: `createRoot`를 사용하여 `App` 컴포넌트를 `root` DOM 요소에 렌더링하는 방법을 보여주었습니다.

---

## useRef에 인자가 필수로 변경

React 19에서는 `useRef` 훅의 인자가 필수로 변경되었습니다.

이전에는 `useRef`를 호출할 때 인자를 생략할 수 있었지만, 이제는 초기값을 명시해야 합니다.

이 변경은 타입 정의의 일관성을 유지하고, 코드의 명확성을 높이는 데 기여합니다.

### useRef란?

`useRef` 훅은 컴포넌트가 다시 렌더링될 때도 같은 객체를 유지하고, DOM 요소에 접근할 수 있도록 하는 데 사용됩니다.

주로 DOM 요소에 접근하거나, 렌더링 사이클을 넘어서 값을 유지하는 데 유용합니다.

### 이전 코드

이전에는 `useRef`를 호출할 때 초기값을 생략할 수 있었습니다:

```jsx
import React, { useRef } from 'react';

const MyComponent: React.FC = () => {
  const ref = useRef<HTMLDivElement>();

  return (
    <div ref={ref}>Hello</div>
  );
};
```

위 코드에서 `useRef<HTMLDivElement>()`는 초기값을 생략하고 `undefined`로 설정되었습니다.

이 방식은 타입 정의를 명확히 하지 않아 코드의 일관성이 떨어질 수 있었습니다.

### 수정된 코드

React 19에서는 `useRef` 훅의 인자를 필수로 설정해야 하며, 초기값을 명시해야 합니다. 예를 들어:

```jsx
import React, { useRef } from 'react';

const MyComponent: React.FC = () => {
  // 초기값을 undefined로 명시적으로 설정
  const ref = useRef<HTMLDivElement>(undefined);

  return (
    <div ref={ref}>Hello</div>
  );
};
```

이 수정된 코드에서는 `useRef<HTMLDivElement>(undefined)`로 초기값을 명시적으로 설정했습니다.

이 변경은 코드의 명확성을 높이고, 타입 정의를 일관되게 유지하는 데 도움이 됩니다.

### 예제: useRef의 활용

다음은 `useRef`를 활용하여 DOM 요소에 접근하고, 상태를 관리하는 예제입니다:

```jsx
import React, { useRef, useEffect, useState } from 'react';

const FocusableInput: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState('Hello, world!');

  useEffect(() => {
    // 컴포넌트가 마운트된 후, input 요소에 포커스를 설정합니다.
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
      />
      <p>Current value: {value}</p>
    </div>
  );
};

export default FocusableInput;
```

### 설명

- **초기값 설정**: `useRef<HTMLInputElement>(null)`과 같이 초기값을 명시적으로 설정합니다. `null`은 DOM 요소가 아직 마운트되지 않았음을 나타내며, 이후 `inputRef.current`를 통해 실제 DOM 요소에 접근할 수 있습니다.

- **DOM 요소에 접근**: `useRef`를 사용하여 `inputRef`를 통해 `<input>` 요소에 접근하고, `useEffect`에서 컴포넌트가 마운트된 후 `inputRef.current.focus()`를 호출하여 입력 필드에 포커스를 설정합니다.

- **상태 관리**: `useState`를 사용하여 입력 필드의 값을 상태로 관리하고, `onChange` 이벤트로 상태를 업데이트합니다.

### 요약

- **인자 필수화**: `useRef`의 인자가 필수로 변경되었으며, 초기값을 명시해야 합니다. 이 변경은 타입 정의의 일관성을 유지하고 코드의 명확성을 높입니다.

- **초기값 설정**: `useRef`에 초기값을 명시적으로 설정하여 코드의 일관성을 유지합니다.

- **예제 활용**: `useRef`를 사용하여 DOM 요소에 접근하고, 상태를 관리하는 방법을 실제 코드 예제로 설명했습니다.

---

## useReducer의 시그니처 변경

React 19에서는 `useReducer` 훅의 타입 시그니처가 변경되었습니다.

이 변경은 타입 정의를 더 깔끔하고 명확하게 만들어 주며, 상태와 액션의 타입을 별도로 지정할 수 있게 합니다.

### 이전 타입

기존에는 `useReducer`의 타입을 함수 전체에 대해 지정하는 방식으로 사용되었습니다. 예를 들어:

```jsx
// 이전 타입
const [state, dispatch] = useReducer<React.Reducer<State, Action>>(reducer, initialState);
```

여기서 `React.Reducer<State, Action>`는 `reducer` 함수의 전체 타입을 지정합니다.

이 방식은 `reducer` 함수의 타입을 포함하여 상태와 액션의 타입을 모두 포함하는 복잡한 타입을 요구했습니다.

### 새로운 타입

새로운 시그니처에서는 상태와 액션의 타입을 별도로 지정할 수 있습니다. 예를 들어:

```jsx
// 새로운 타입
const [state, dispatch] = useReducer<State, Action>(reducer, initialState);
```

여기서 `State`는 상태의 타입을, `Action`은 액션의 타입을 지정합니다.

이 방식은 상태와 액션의 타입을 분리하여 더 명확하게 타입을 정의할 수 있도록 해줍니다.

### 새로운 타입의 예제

다음은 새로운 타입 시그니처를 사용한 `useReducer`의 구체적인 예제입니다.

이 예제에서는 카운터 애플리케이션을 구현합니다.

```jsx
import React, { useReducer } from 'react';

// 상태의 타입
type State = {
  count: number;
};

// 액션의 타입
type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'reset' };

// 리듀서 함수
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    default:
      return state;
  }
};

// 초기 상태
const initialState: State = { count: 0 };

const Counter: React.FC = () => {
  // 새로운 타입 시그니처를 사용한 useReducer
  const [state, dispatch] = useReducer<State, Action>(reducer, initialState);

  return (
    <div>
      <h1>Count: {state.count}</h1>
      <button onClick={() => dispatch({ type: 'increment' })}>Increment</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>Decrement</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  );
};

export default Counter;
```

### 설명

- **상태의 타입 (`State`)**: `State` 타입은 카운트 값을 포함하는 객체를 정의합니다.

- **액션의 타입 (`Action`)**: `Action` 타입은 상태를 변경할 수 있는 다양한 액션 타입을 정의합니다. 이 예제에서는 'increment', 'decrement', 'reset' 액션을 사용합니다.

- **리듀서 함수 (`reducer`)**: `reducer` 함수는 현재 상태와 액션을 받아 새로운 상태를 반환합니다. 액션 타입에 따라 상태를 적절히 업데이트합니다.

- **`useReducer` 사용**: 새로운 타입 시그니처를 사용하여 `State`와 `Action`을 명확히 지정합니다. `reducer` 함수와 초기 상태를 함께 전달하여 상태 관리를 수행합니다.

이 변경된 시그니처는 상태와 액션의 타입을 별도로 지정함으로써 코드의 명확성을 높이고, 타입 정의를 더 깔끔하게 만들어 줍니다.

이러한 변화는 React 애플리케이션의 타입 안전성을 향상시키는 데 도움을 줍니다.

---

## 요약

React 19에서는 다음과 같은 주요 변경 사항이 있습니다:

- **`useDeferredValue`의 초기값**: 비동기 상태 업데이트의 트랜지션을 지연시키는 훅으로, 초기값을 설정할 수 있어 최초 렌더링 시에도 트랜지션을 적용할 수 있습니다.

- **에러 핸들링 개선**: `createRoot`와 `hydrateRoot`의 `onCaughtError` 및 `onUncaughtError` 옵션을 사용하여 에러 핸들링을 개선할 수 있습니다.

- **`<Context.Provider>` 비추천화**: 이제 `<Context>` 자체를 Provider로 사용하여 Context를 더 간단하게 관리할 수 있습니다.

- **ref 콜백의 클린업 함수**: ref 콜백에서 클린업 함수를 반환하여 DOM 노드가 제거될 때 클린업 작업을 간편하게 처리할 수 있습니다.

- **ref를 prop으로 전달할 수 있는 개선**: React 19에서 ref를 prop으로 직접 전달할 수 있게 되어, `forwardRef`를 사용할 필요가 없어졌습니다.

- **useRef의 인자 필수화**: `useRef` 훅의 인자가 필수로 변경되어 초기값을 명시해야 합니다.

- **useReducer의 시그니처 변경**: `useReducer`의 타입 시그니처가 개선되어 상태와 액션의 타입을 별도로 지정할 수 있게 되었습니다.
