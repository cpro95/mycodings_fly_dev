---
slug: 2024-07-14-react-19-tutorial-2-handling-async-tasks-with-react-19-form-elements-actions-useactionstate-useformstatus
title: React 19 강좌 2편 - 폼 요소의 액션과 useActionState useFormStatus 조합으로 비동기 작업 처리하기
date: 2024-07-14 07:59:10.196000+00:00
summary: useActionState와 useFormStatus를 사용하여 폼 제출 시 비동기 작업을 처리하는 방법을 중점적으로 다루고 있다는 점을 강조합니다.
tags: ["react", "react 19", "useActionState", "useFormStatus"]
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

- [React 19 강좌 2편 - 폼 요소의 액션과 useActionState useFormStatus 조합으로 비동기 작업 처리하기](#react-19-강좌-2편---폼-요소의-액션과-useactionstate-useformstatus-조합으로-비동기-작업-처리하기)
  - [폼 요소의 액션: 상세 가이드와 예제](#폼-요소의-액션-상세-가이드와-예제)
    - [폼 요소의 액션](#폼-요소의-액션)
    - [`useActionState`와 폼 요소의 `action` 속성](#useactionstate와-폼-요소의-action-속성)
    - [예제: 폼 제출과 비동기 작업 처리](#예제-폼-제출과-비동기-작업-처리)
    - [코드 설명](#코드-설명)
    - [폼 요소의 `action` 속성 활용](#폼-요소의-action-속성-활용)
    - [결론](#결론)
  - [`useActionState`와 폼의 `action` 속성, 그리고 `useFormStatus`의 조합](#useactionstate와-폼의-action-속성-그리고-useformstatus의-조합)
    - [`useActionState`와 폼의 `action` 속성](#useactionstate와-폼의-action-속성)
      - [예제: `useActionState`와 폼의 `action` 속성 조합](#예제-useactionstate와-폼의-action-속성-조합)
    - [`useFormStatus`와의 조합](#useformstatus와의-조합)
      - [예제: `useFormStatus` 사용](#예제-useformstatus-사용)
    - [`useActionState`와 `useFormStatus`의 조합](#useactionstate와-useformstatus의-조합)

---

## 폼 요소의 액션: 상세 가이드와 예제

React 19에서는 폼 제출 시 비동기 작업을 더 쉽게 처리할 수 있도록 폼 요소에 직접 액션을 지정하는 기능이 도입되었습니다.

이 새로운 기능은 폼 제출과 동시에 비동기 작업을 수행할 수 있게 해줍니다.

여기서는 `useActionState` 훅과 폼 요소의 `action` 속성을 활용한 예제를 통해 이 기능을 자세히 설명하겠습니다.

### 폼 요소의 액션

기존의 React에서는 폼 제출 시 `onSubmit` 이벤트 핸들러를 사용하여 폼 데이터를 처리했습니다.

이 방식은 폼 제출 시 비동기 작업을 처리하기 위해 추가적인 로직을 구현해야 했습니다.

React 19에서는 폼의 `action` 속성에 비동기 함수를 지정하여 폼 제출과 동시에 비동기 작업을 수행할 수 있는 기능이 추가되었습니다.

이 기능을 활용하면 폼 제출과 데이터 처리를 더 간편하게 할 수 있습니다.

### `useActionState`와 폼 요소의 `action` 속성

`useActionState` 훅을 사용하면 폼 제출 시 비동기 작업을 수행하고, 상태를 관리하며, 로딩 상태를 체크할 수 있습니다. 이 훅과 폼 요소의 `action` 속성을 함께 사용하면 비동기 작업을 더 직관적으로 처리할 수 있습니다.

### 예제: 폼 제출과 비동기 작업 처리

다음은 `useActionState` 훅과 폼 요소의 `action` 속성을 사용하여 폼 제출 시 비동기 작업을 처리하는 예제입니다.

```jsx
import React, { useState } from 'react';
import { useActionState } from 'react';

// 비동기 작업을 수행하는 함수
const submitFormData = async (data) => {
  const response = await fetch('https://api.example.com/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to submit form');
  return data; // 서버에서 받은 데이터 또는 새로운 상태를 반환
};

const MyForm: React.FC = () => {
  const [formData, setFormData] = useState({ name: '' });
  const [state, submitForm, isPending] = useActionState(
    submitFormData, // 비동기 작업 함수
    formData // 초기 상태
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    submitForm(); // 비동기 작업 실행
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </label>
      </div>
      <button type="submit" disabled={isPending}>
        Submit
      </button>
      {isPending && <p>Submitting...</p>}
      {state && <p>Form submitted with name: {state.name}</p>}
    </form>
  );
};

export default MyForm;
```

### 코드 설명

1. **상태 초기화**:
   - `useState` 훅을 사용하여 `formData` 상태를 초기화합니다. 이 상태는 폼 필드의 값들을 저장합니다.

2. **비동기 작업 함수**:
   - `submitFormData` 함수는 폼 데이터를 서버에 전송하는 비동기 작업을 수행합니다. 이 함수는 `fetch` API를 사용하여 POST 요청을 보내며, 서버 응답이 성공적이지 않으면 에러를 던집니다.

3. **`useActionState` 훅 사용**:
   - `useActionState` 훅을 호출하여 `state`, `submitForm`, `isPending`을 반환받습니다. 이 훅은 비동기 작업 함수와 초기 상태를 인자로 받아 비동기 작업을 처리하고 상태를 업데이트합니다.

4. **폼 필드 변경 처리**:
   - `handleChange` 함수는 폼 필드의 값이 변경될 때 호출됩니다. 이 함수는 `formData` 상태를 업데이트하여 폼 필드의 값을 반영합니다.

5. **폼 제출 처리**:
   - `handleSubmit` 함수는 폼 제출 시 호출됩니다. 이 함수는 기본 동작을 방지하고, `submitForm` 함수를 호출하여 비동기 작업을 실행합니다.

6. **렌더링**:
   - 폼 필드와 제출 버튼을 렌더링합니다. `isPending` 값에 따라 버튼을 비활성화하고, 제출 중임을 나타내는 메시지를 표시합니다.

   - 폼 제출이 완료되면 `state`를 사용하여 제출된 데이터를 표시합니다.

### 폼 요소의 `action` 속성 활용

React 19에서 새롭게 도입된 폼 요소의 `action` 속성은 비동기 작업을 폼 제출과 동시에 처리할 수 있게 해줍니다.

이 속성에 비동기 함수를 직접 지정하면, 폼 제출 시 자동으로 해당 함수가 실행되며, 폼 데이터를 서버로 전송하거나 필요한 작업을 수행할 수 있습니다.

이 방식은 폼 제출 로직을 더 간결하게 작성할 수 있게 해주며, 비동기 작업과 상태 관리를 통합적으로 처리할 수 있습니다.

---

## `useActionState`와 폼의 `action` 속성, 그리고 `useFormStatus`의 조합

React 19에서는 폼 제출과 비동기 작업을 효율적으로 처리하기 위한 다양한 기능이 도입되었습니다.

이 중에서 `useActionState`와 폼의 `action` 속성, 그리고 `useFormStatus` 훅을 조합하여 사용하는 방법을 알아보겠습니다.

이 조합을 통해 폼 제출 시 비동기 작업을 간편하게 처리하고, 사용자에게 폼 제출 상태를 명확히 알릴 수 있습니다.

### `useActionState`와 폼의 `action` 속성

React 19에서 새롭게 도입된 폼의 `action` 속성은 폼 제출 시 비동기 작업을 간편하게 처리할 수 있는 기능을 제공합니다.

`useActionState`와 함께 사용하면 폼의 제출과 상태 관리를 통합적으로 처리할 수 있습니다.

#### 예제: `useActionState`와 폼의 `action` 속성 조합

다음은 `useActionState`와 폼의 `action` 속성을 조합하여 사용하는 예제입니다:

```jsx
import React, { useState } from 'react';
import { useActionState } from 'react';

const MyForm: React.FC = () => {
  const [formData, setFormData] = useState({ name: '' });
  const [state, submitForm, isPending] = useActionState(
    async (data) => {
      const response = await fetch('https://api.example.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to submit form');
      return data;
    },
    formData
  );

  return (
    <form action={submitForm}>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <button type="submit" disabled={isPending}>
        Submit
      </button>
      {isPending && <p>Submitting...</p>}
      {state && <p>Form submitted with name: {state.name}</p>}
    </form>
  );
};

export default MyForm;
```

**코드 설명:**

1. **상태 초기화**:
   - `useState` 훅을 사용하여 `formData` 상태를 초기화합니다. 이 상태는 폼 필드의 값을 저장합니다.

2. **`useActionState` 훅 사용**:
   - `useActionState` 훅을 사용하여 `state`, `submitForm`, `isPending`을 반환받습니다. `submitForm`은 비동기 작업을 수행하는 함수입니다.

   - `submitForm` 함수는 폼 데이터를 서버로 전송하고, 서버의 응답에 따라 상태를 업데이트합니다.

3. **폼 필드 변경 처리**:
   - `onChange` 이벤트 핸들러를 사용하여 폼 필드 값이 변경될 때 `formData`를 업데이트합니다.

4. **폼 제출 처리**:
   - `action` 속성에 `submitForm` 함수를 지정하여 폼 제출 시 비동기 작업을 처리합니다.

   - `isPending` 값을 사용하여 제출 중에는 버튼을 비활성화하고, 제출 진행 상태를 사용자에게 알립니다.

5. **렌더링**:
   - 폼 필드와 버튼을 렌더링하며, 제출 중에는 "Submitting..." 메시지를 표시합니다.

   - `state`를 사용하여 제출된 데이터가 있으면 이를 표시합니다.

### `useFormStatus`와의 조합

`useFormStatus`는 폼의 제출 상태를 감지하고 관리하는 데 유용한 훅입니다.

이 훅을 사용하면 폼의 제출 상태를 쉽게 추적할 수 있으며, 이를 통해 사용자에게 폼 제출 상태를 명확히 알릴 수 있습니다.

#### 예제: `useFormStatus` 사용

다음은 `useFormStatus`를 사용하여 폼 제출 상태를 관리하는 예제입니다:

```jsx
import React, { useState } from 'react';
import { useFormStatus } from 'react';

const MyForm: React.FC = () => {
  const [formData, setFormData] = useState({ name: '' });
  const { isPending } = useFormStatus();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch('https://api.example.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to submit form');
      // 성공적으로 제출된 경우의 처리
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <button type="submit" disabled={isPending}>
        Submit
      </button>
      {isPending && <p>Submitting...</p>}
    </form>
  );
};

export default MyForm;
```

**코드 설명:**

1. **상태 초기화**:
   - `useState` 훅을 사용하여 `formData` 상태를 초기화합니다.

2. **`useFormStatus` 훅 사용**:
   - `useFormStatus` 훅을 호출하여 `isPending` 값을 얻습니다. 이 값은 폼 제출 상태를 나타냅니다.

3. **폼 제출 처리**:
   - `handleSubmit` 함수는 폼 제출 시 호출됩니다. 이 함수는 비동기 작업을 수행하고, 오류가 발생할 경우 이를 처리합니다.

4. **렌더링**:
   - 폼 필드와 버튼을 렌더링하며, `isPending` 값을 사용하여 제출 중에는 버튼을 비활성화하고 "Submitting..." 메시지를 표시합니다.

### `useActionState`와 `useFormStatus`의 조합

`useActionState`와 `useFormStatus`를 함께 사용하면 폼 제출과 상태 관리를 더욱 효율적으로 할 수 있습니다.

`useActionState`는 비동기 작업을 관리하고, `useFormStatus`는 폼의 제출 상태를 추적합니다.

이 두 훅을 조합하여 사용하면, 폼 제출 시 비동기 작업과 상태 관리를 직관적으로 처리할 수 있습니다.

다음은 `useActionState`와 `useFormStatus`를 조합하여 사용하는 예제입니다:

```jsx
import React, { useState } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react';

const MyForm: React.FC = () => {
  const [formData, setFormData] = useState({ name: '' });
  const [state, submitForm, isPending] = useActionState(
    async (data) => {
      const response = await fetch('https://api.example.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to submit form');
      return data;
    },
    formData
  );
  const { isPending: formStatusPending } = useFormStatus();

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      submitForm(); // 비동기 작업 실행
    }}>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <button type="submit" disabled={isPending || formStatusPending}>
        Submit
      </button>
      {(isPending || formStatusPending) && <p>Submitting...</p>}
      {state && <p>Form submitted with name: {state.name}</p>}
    </form>
  );
};

export default MyForm;
```

**코드 설명:**

1. **상태 초기화**:
   - `useState` 훅을 사용하여 `formData` 상태를 초기화합니다.

2. **`useActionState` 훅 사용**:
   - `useActionState` 훅을 사용하여 비동기 작업을 처리하고 상태를 업데이트합니다.

3. **`useFormStatus` 훅 사용**:
   - `useFormStatus` 훅을 사용하여 폼의 제출 상태를 추적합니다.

4. **폼 제출 처리**:
   - `onSubmit` 이벤트 핸들러에서 `submitForm` 함수를 호출하여 비동기 작업을 실행합니다.

5. **렌더링**:
   - `isPending`과 `formStatusPending` 값을 사용하여 버튼을 비활성화하고, 제출 중임을 사용자에게 알립니다.
   
   - 제출된 데이터가 있으면 이를 표시합니다.

이렇게 함으로써 폼 제출 시 비동기 작업과 상태 관리를 효율적으로 처리할 수 있으며, 사용자에게 명확한 피드백을 제공할 수 있습니다

