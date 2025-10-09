---
slug: 2024-07-14-react-19-tutorial-1-usetransition-and-new-form-api
title: React 19 강좌 1편 - 액션과 useTransition으로 비동기 작업 처리하기 기본 사용법과 폼 처리 변화
date: 2024-07-14 07:52:12.254000+00:00
summary: React 19의 두 주요 기능인 액션과 useTransition, 그리고 폼 처리의 변화를 포괄적으로 다루고 있음을 강조합니다.
tags: ["react", "react 19", "useTransition", "useActionState"]
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

- [React 19 강좌 1편 - 액션과 useTransition으로 비동기 작업 처리하기 기본 사용법과 폼 처리 변화](#react-19-강좌-1편---액션과-usetransition으로-비동기-작업-처리하기-기본-사용법과-폼-처리-변화)
  - [액션 개념과 useTransition](#액션-개념과-usetransition)
    - [액션(Actions)이란?](#액션actions이란)
    - [useTransition이란?](#usetransition이란)
    - [액션과 useTransition의 조합](#액션과-usetransition의-조합)
      - [기존의 useTransition](#기존의-usetransition)
        - [예제: 기존 useTransition](#예제-기존-usetransition)
      - [useTransition의 액션 대응](#usetransition의-액션-대응)
        - [예제: useTransition과 액션의 조합](#예제-usetransition과-액션의-조합)
    - [에러 처리](#에러-처리)
      - [예제: 에러 처리](#예제-에러-처리)
      - [설명](#설명)
    - [요약](#요약)
  - [`useActionState`와 폼의 변화: 상세 가이드와 예제](#useactionstate와-폼의-변화-상세-가이드와-예제)
    - [`useActionState` 훅](#useactionstate-훅)
      - [`useActionState` API](#useactionstate-api)
      - [`useActionState` 사용법과 주요 포인트](#useactionstate-사용법과-주요-포인트)
      - [예제: 카운터 컴포넌트](#예제-카운터-컴포넌트)
      - [코드 설명](#코드-설명)
    - [폼 처리의 변화](#폼-처리의-변화)
      - [새로운 폼 API](#새로운-폼-api)
        - [예제: 유효성 검사와 제출 처리](#예제-유효성-검사와-제출-처리)
      - [코드 설명](#코드-설명-1)

---

## 액션 개념과 useTransition

React 19에서는 비동기 작업을 처리하는 새로운 방식인 **액션(Actions)**과 상태 업데이트를 부드럽게 처리하는 훅인 **`useTransition`**이 도입되었습니다.

이 글에서는 액션의 개념과 `useTransition`의 사용법, 그리고 이 두 가지를 조합하여 비동기 작업을 효과적으로 관리하는 방법을 설명하겠습니다.

### 액션(Actions)이란?

액션은 비동기 작업을 처리하는 함수입니다. 서버에 데이터를 보내거나 데이터베이스를 업데이트하는 등의 작업을 비동기적으로 처리할 때 사용됩니다.

React 19에서 도입된 액션은 이러한 비동기 작업을 더 효과적으로 관리할 수 있도록 도와줍니다.

액션의 주요 역할은 서버와의 상호작용이나 데이터 업데이트 등 시간이 걸리는 작업을 처리할 때, UI를 적절히 업데이트하고 사용자에게 피드백을 제공하는 것입니다.

예를 들어, 사용자가 버튼을 클릭하여 서버에 데이터를 보내는 작업을 수행할 때, 액션을 통해 비동기 작업을 처리하고 UI를 업데이트할 수 있습니다.

### useTransition이란?

`useTransition`은 상태 업데이트를 부드럽게 처리하는 훅입니다.

상태 업데이트가 시간이 걸리는 작업일 때, 다른 상태 업데이트가 우선 처리되도록 하여 UI가 끊기지 않도록 합니다. 

React 19에서는 `useTransition`이 비동기 함수와 함께 사용할 수 있도록 개선되었습니다.

`useTransition`은 상태 업데이트를 '트랜지션' 상태로 처리하여, 사용자에게 부드러운 UI를 제공합니다.

예를 들어, 긴 작업을 수행하는 동안 다른 상태 업데이트가 먼저 처리되도록 하여, UI의 반응을 부드럽게 유지할 수 있습니다.

### 액션과 useTransition의 조합

액션과 `useTransition`을 함께 사용하면 비동기 작업을 더 부드럽게 처리할 수 있습니다.

예를 들어, 서버에 데이터를 요청하고 UI를 즉시 업데이트하려고 할 때 유용합니다.

#### 기존의 useTransition

기존 `useTransition`는 상태 업데이트를 '트랜지션' 상태로 처리하여, 사용자에게 부드러운 UI를 제공했습니다. 

다음은 기존 `useTransition`의 사용 예제입니다:

##### 예제: 기존 useTransition

```jsx
import React, { useState, useTransition } from 'react';

const Counter: React.FC = () => {
  const [count, setCount] = useState(0);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    // 상태 업데이트를 트랜지션으로 처리
    startTransition(() => {
      setCount(count + 1);
    });
  };

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={handleClick} disabled={isPending}>
        Increment
      </button>
    </div>
  );
};

export default Counter;
```

이 예제에서 `startTransition`은 상태 업데이트가 긴 작업을 수행하는 동안 다른 상태 업데이트가 먼저 처리되도록 합니다.

`isPending`은 현재 트랜지션이 진행 중인지 여부를 나타내며, 버튼의 비활성화 상태를 제어할 수 있습니다.

#### useTransition의 액션 대응

React 19에서는 `useTransition`이 비동기 함수와 함께 사용할 수 있게 되었습니다.

즉, 비동기 작업을 포함하는 액션을 `useTransition`으로 감싸서 부드럽게 처리할 수 있습니다.

##### 예제: useTransition과 액션의 조합

```jsx
import React, { useState, useTransition } from 'react';

const Counter: React.FC = () => {
  const [count, setCount] = useState(0);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      // 비동기 작업을 수행
      await fetch('https://api.example.com/increment', {
        method: 'POST',
      });
      // 상태 업데이트
      setCount(count + 1);
    });
  };

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={handleClick} disabled={isPending}>
        Increment
      </button>
    </div>
  );
};

export default Counter;
```

이 예제에서 버튼을 클릭하면 `startTransition`이 호출되고, 비동기 작업을 수행합니다.

`fetch`로 서버에 POST 요청을 보내고, 성공하면 카운트를 증가시킵니다.

`isPending`은 비동기 작업이 진행 중인 상태를 나타내며, 버튼의 비활성화 상태를 제어합니다.

### 에러 처리

비동기 작업에서는 에러가 발생할 수 있습니다.

React 19에서는 이러한 에러를 효과적으로 처리할 수 있는 방법도 제공합니다.

비동기 작업 중 에러가 발생하면, React는 이를 `Error Boundary`를 통해 잡아서 적절히 처리할 수 있습니다.

#### 예제: 에러 처리

다음은 비동기 작업 중 에러를 처리하는 예제입니다:

```jsx
import React, { useState, useTransition } from 'react';

const Counter: React.FC = () => {
  const [count, setCount] = useState(0);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      try {
        const response = await fetch('https://api.example.com/increment', {
          method: 'POST',
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        setCount(count + 1);
      } catch (error) {
        console.error('Failed to increment count:', error);
        // 에러 처리 로직 추가 가능
      }
    });
  };

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={handleClick} disabled={isPending}>
        Increment
      </button>
    </div>
  );
};

export default Counter;
```

#### 설명

1. **비동기 작업 처리**: `startTransition`을 사용하여 비동기 작업을 수행합니다. `fetch`로 서버에 POST 요청을 보내고, 응답이 성공적일 경우 상태를 업데이트합니다.

2. **에러 처리**: `try-catch` 블록을 사용하여 비동기 작업 중 발생할 수 있는 에러를 잡아내고, 콘솔에 에러를 기록합니다. 이로써 에러 발생 시 적절한 처리를 할 수 있습니다.

### 요약

- **액션**: 비동기 작업을 처리하는 함수로, 서버와의 상호작용이나 데이터 업데이트를 다룹니다.

- **`useTransition`**: 상태 업데이트를 부드럽게 처리하는 훅으로, React 19에서는 비동기 함수와 함께 사용할 수 있습니다.

- **액션과 `useTransition`의 조합**: 비동기 작업을 부드럽게 처리하고 UI를 즉시 업데이트할 때 유용합니다.

- **에러 처리**: 비동기 작업 중 발생할 수 있는 에러를 `Error Boundary`를 통해 잡아내고 적절히 처리할 수 있습니다.

---

## `useActionState`와 폼의 변화: 상세 가이드와 예제

React 19에서는 상태 관리와 비동기 작업 처리의 편의성을 높이기 위해 `useActionState` 훅이 도입되었습니다. 

이 훅은 비동기 작업을 수행하며 상태를 효율적으로 관리할 수 있는 강력한 도구입니다.

또한, React 19에서 폼 처리에 대한 많은 변화가 있었으므로 이와 관련된 새로운 기능도 함께 살펴보겠습니다.

### `useActionState` 훅

`useActionState`는 비동기 작업을 수행하면서 상태를 관리하는데 유용한 훅입니다.

이 훅은 비동기 작업을 처리하고 그에 따른 상태를 업데이트하는 데 필요한 기능을 제공합니다.

서버와의 상호작용이나 데이터 업데이트가 포함된 작업에서 특히 유용합니다.

#### `useActionState` API

`useActionState`의 기본 API는 다음과 같습니다:

```jsx
const [state, runAction, isPending] = useActionState(
  async (currentState, payload) => {
    // 비동기 액션 처리
    // 예를 들어, 서버에 데이터 전송
    const response = await fetch('https://api.example.com/update', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error('Failed to update');

    // 새로운 상태 반환
    return { ...currentState, ...payload };
  },
  initialState,
);
```

- **`state`**: 현재 상태를 나타냅니다. 비동기 작업의 결과에 따라 업데이트됩니다.

- **`runAction`**: 비동기 작업을 실행하는 함수입니다. 주어진 상태와 페이로드를 기반으로 새로운 상태를 반환하는 비동기 함수입니다.

- **`isPending`**: 액션이 진행 중인지 여부를 나타내는 불리언 값입니다.

#### `useActionState` 사용법과 주요 포인트

1. **비동기 함수 전달**: `runAction`에 전달하는 함수는 반드시 비동기 함수여야 하며, 상태 업데이트를 위한 로직을 포함해야 합니다. 이 함수는 현재 상태와 페이로드를 인자로 받아 새로운 상태를 반환합니다.
   
2. **상태 관리**: `state`는 비동기 작업의 결과를 반영하는 상태입니다. 작업이 완료되면 이 상태가 업데이트되며, 컴포넌트는 자동으로 리렌더링됩니다.

3. **로딩 상태**: `isPending`을 사용하여 비동기 작업의 진행 상태를 관리할 수 있습니다. 이를 통해 사용자에게 작업이 진행 중임을 알릴 수 있으며, UI에서 로딩 스피너를 표시하거나 버튼을 비활성화하는 등의 처리를 할 수 있습니다.

#### 예제: 카운터 컴포넌트

다음은 `useActionState`를 활용한 간단한 카운터 컴포넌트의 예제입니다.

이 컴포넌트는 버튼 클릭 시 카운트를 서버에 전송하고, 서버의 응답에 따라 카운트를 증가시킵니다.

```jsx
import React, { useState } from 'react';
import { useActionState } from 'react';

const Counter: React.FC = () => {
  const [count, setCount] = useState(0);
  const [state, increment, isPending] = useActionState(
    async (currentCount) => {
      const response = await fetch('https://api.example.com/increment', {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to increment');
      return currentCount + 1;
    },
    count
  );

  const handleClick = () => {
    increment();
  };

  return (
    <div>
      <h1>Count: {state}</h1>
      <button onClick={handleClick} disabled={isPending}>
        Increment
      </button>
      {isPending && <p>Loading...</p>}
    </div>
  );
};

export default Counter;
```

#### 코드 설명

1. **상태 초기화**: `useState` 훅을 사용하여 `count` 상태를 초기화합니다.

2. **`useActionState` 사용**: 
   - `useActionState` 훅을 호출하여 `state`, `increment`, `isPending`을 반환받습니다. 
   - `increment`는 비동기 작업을 실행하는 함수입니다. 이 함수는 현재 카운트를 서버에 전송하고, 서버의 응답에 따라 카운트를 1 증가시킵니다.
   
3. **비동기 작업 처리**:
   - `increment` 함수는 현재 카운트를 서버에 전송합니다.
   - 서버의 응답이 성공적이면 새로운 카운트를 반환하여 상태를 업데이트합니다.
   - 요청이 진행 중일 때는 `isPending`이 `true`로 설정되며, 이로 인해 버튼이 비활성화되고 "Loading..." 메시지가 표시됩니다.

4. **컴포넌트 렌더링**:
   - 현재 카운트를 `h1` 태그로 표시합니다.
   - 버튼 클릭 시 `increment` 함수가 호출됩니다.
   - `isPending` 값에 따라 버튼을 비활성화하고 로딩 상태를 표시합니다.

이 예제는 `useActionState`를 사용하여 비동기 작업을 처리하고 사용자 인터페이스를 동적으로 업데이트하는 방식의 단순한 예를 보여줍니다.

이 패턴을 활용하면 다양한 비동기 작업을 쉽게 관리할 수 있으며, 사용자 경험을 개선할 수 있습니다.

### 폼 처리의 변화

React 19에서는 폼 처리와 관련된 몇 가지 중요한 변화가 있습니다.

새로운 훅과 API가 도입되어 폼 상태 관리가 더욱 직관적이고 효율적으로 변했습니다.

`useActionState`와 함께 이러한 새로운 기능을 활용하면 복잡한 폼 처리도 간편하게 해결할 수 있습니다.

#### 새로운 폼 API

React 19에서는 폼 요소의 상태를 관리하기 위한 새로운 API가 도입되었습니다.

이 API는 폼의 유효성 검사, 제출 처리, 필드 상태 관리 등을 보다 쉽게 할 수 있도록 돕습니다.

##### 예제: 유효성 검사와 제출 처리

다음은 새로운 폼 API를 사용한 유효성 검사와 제출 처리 예제입니다:

```jsx
import React, { useState } from 'react';
import { useForm } from 'react';

const MyForm: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({ name: '', email: '' });

  const validateForm = () => {
    const errors = { name: '', email: '' };
    if (!formState.name) errors.name = 'Name is required';
    if (!formState.email || !/\S+@\S+\.\S+/.test(formState.email)) errors.email = 'Valid email is required';
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.values(formErrors).some(error => error)) {
      setErrors(formErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch('https://api.example.com/submit', {
        method: 'POST',
        body: JSON.stringify(formState),
      });
      if (!response.ok) throw new Error('Failed to submit form');
      alert('Form submitted successfully!');
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:
          <input
            type="text"
            name="name"
            value={formState.name}
            onChange={handleChange}
          />
          {errors.name && <span>{errors.name}</span>}
        </label>
      </div>
      <div>
        <label>Email:
          <input
            type="email"
            name="email"
            value={formState.email}
            onChange={handleChange}
          />
          {errors.email && <span>{errors.email}</span>}
        </label>
      </div>
      <button type="submit" disabled={isSubmitting}>
        Submit
      </button>
      {isSubmitting && <p>Submitting...</p>}
    </form>
  );
};

export default MyForm;
```

#### 코드 설명

1. **상태 초기화**: `useState` 훅을 사용하여 폼 상태, 제출 상태, 오류 상태를 초기화합니다.

2. **유효성 검사**:
   - `validateForm` 함수는 폼 필드의 유효성을 검사하고 오류 메시지를 반환합니다.

   - 제출 시 유효성 검사를 수행하고, 오류가 있으면 상태를 업데이트하여 사용자에게 오류를 표시합니다.

3. **폼 제출 처리**:
   - `handleSubmit` 함수는 폼 제출 시 호출됩니다.

   - 유효성 검사를 통과하면, `isSubmitting` 상태를 `true`로 설정하여 제출 중임을 나타냅니다.

   - 비동기 로직을 사용하여 서버에 데이터를 전송합니다.

   - 서버 응답이 성공적이면 사용자에게 성공 메시지를 표시하고, 실패하면 오류 메시지를 표시합니다.

   - 마지막으로, `isSubmitting` 상태를 `false`로 설정하여 제출 중이 아님을 나타냅니다.

4. **입력 변경 처리**:
   - `handleChange` 함수는 사용자가 입력 필드를 변경할 때 호출됩니다.

   - 입력 값을 업데이트하여 폼 상태를 최신 상태로 유지합니다.

5. **폼 렌더링**:
   - JSX를 사용하여 폼 요소를 렌더링합니다.

   - 각 입력 필드는 `name`과 `value` 속성을 가지고 있으며, `onChange` 이벤트 핸들러를 통해 `handleChange` 함수를 연결합니다.

   - 유효성 검사 중에 발견된 오류 메시지를 필드 아래에 표시합니다.

   - 제출 버튼은 `isSubmitting` 상태에 따라 활성화 또는 비활성화됩니다.

   - 제출 중일 때는 "Submitting..."이라는 메시지를 표시합니다.

이 예제에서는 React의 새로운 폼 API를 사용하지 않고, 기존의 `useState` 훅과 `useEffect` 훅을 사용하여 폼의 상태 관리와 제출 처리를 구현했습니다.

React 19에서 도입된 `useForm`, `useActionState`, `useFormStatus` 훅은 이러한 작업을 더욱 간편하게 할 수 있도록 도와줍니다.

새로운 폼 API를 사용하면 상태 관리와 유효성 검사, 제출 로직을 더욱 체계적으로 관리할 수 있습니다.
