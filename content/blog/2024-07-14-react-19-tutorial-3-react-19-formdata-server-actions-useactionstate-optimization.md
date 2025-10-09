---
slug: 2024-07-14-react-19-tutorial-3-react-19-formdata-server-actions-useactionstate-optimization
title: React 19 강좌 3편 - FormData와 Server Actions, useActionState의 조합으로 폼 제출 최적화하기
date: 2024-07-14 08:18:28.888000+00:00
summary: FormData, Server Actions, 그리고 useActionState를 조합하여 폼 제출을 최적화하는 방법을 중점적으로 다룬다는 점을 강조합니다.
tags: ["react", "react 19", "FormData", "Server Actions", "useActionState"]
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

- [React 19 강좌 3편 - FormData와 Server Actions, useActionState의 조합으로 폼 제출 최적화하기](#react-19-강좌-3편---formdata와-server-actions-useactionstate의-조합으로-폼-제출-최적화하기)
  - [`FormData` 지원 및 `useFormStatus`와의 조합](#formdata-지원-및-useformstatus와의-조합)
    - [`FormData` 객체](#formdata-객체)
      - [기본 사용법](#기본-사용법)
    - [예제: `FormData` 사용](#예제-formdata-사용)
    - [`useFormStatus`와 `FormData`의 조합](#useformstatus와-formdata의-조합)
      - [예제: `useFormStatus`와 `FormData` 조합](#예제-useformstatus와-formdata-조합)
  - [폼과 Server Actions의 관계 및 `useActionState`의 조합](#폼과-server-actions의-관계-및-useactionstate의-조합)
    - [Server Actions](#server-actions)
      - [기본 사용법](#기본-사용법-1)
    - [예제: Server Actions 사용](#예제-server-actions-사용)
    - [`useActionState`와 폼 요소의 `action` 속성 조합](#useactionstate와-폼-요소의-action-속성-조합)
      - [예제: `useActionState`와 폼의 `action` 속성 조합](#예제-useactionstate와-폼의-action-속성-조합)
    - [`useActionState`와 Server Actions의 조합](#useactionstate와-server-actions의-조합)
      - [예제: `useActionState`와 Server Actions 조합](#예제-useactionstate와-server-actions-조합)

---

## `FormData` 지원 및 `useFormStatus`와의 조합

React 19에서는 폼 처리와 데이터 전송을 더 간편하게 할 수 있는 여러 기능이 추가되었습니다.

그 중 `FormData` 객체의 지원과 `useFormStatus` 훅을 활용한 폼 상태 관리가 특히 유용합니다.

이 두 가지 기능을 조합하여 폼 제출을 더 효율적으로 처리할 수 있습니다.

아래에서는 `FormData`와 `useFormStatus`의 사용법을 자세히 설명하고, 이를 조합하여 사용하는 예제를 제공합니다.

### `FormData` 객체

`FormData` 객체는 폼 데이터를 쉽게 다룰 수 있는 API로, 폼 제출 시 데이터를 효율적으로 처리할 수 있게 도와줍니다.

이 객체는 폼 필드의 값을 쉽게 수집하고, 서버로 전송할 수 있도록 합니다.

#### 기본 사용법

`FormData` 객체는 HTML 폼 요소를 기반으로 데이터를 수집합니다.

이를 통해 폼 필드의 값을 쉽게 추출하고, 이를 서버에 전송할 수 있습니다.

### 예제: `FormData` 사용

다음은 `FormData`를 사용하여 폼 데이터를 수집하고 서버에 제출하는 예제입니다:

```jsx
import React, { useState } from 'react';

const MyForm: React.FC = () => {
  const [formData, setFormData] = useState({ name: '' });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formElement = event.currentTarget as HTMLFormElement;
    const data = new FormData(formElement);

    try {
      const response = await fetch('https://api.example.com/submit', {
        method: 'POST',
        body: data,
      });
      if (!response.ok) throw new Error('Failed to submit form');
      alert('Form submitted successfully!');
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
      <button type="submit">Submit</button>
    </form>
  );
};

export default MyForm;
```

**코드 설명:**

1. **상태 초기화**:
   - `useState` 훅을 사용하여 `formData` 상태를 관리합니다. 이 상태는 폼 필드의 값을 저장합니다.

2. **폼 제출 처리**:
   - `handleSubmit` 함수는 폼 제출 시 호출됩니다. 이 함수에서는 `FormData` 객체를 생성하여 폼 데이터를 수집합니다.

   - `FormData` 객체는 폼 요소를 인자로 받아, 폼의 모든 데이터(입력 필드, 선택 상자 등)를 수집합니다.

   - 수집된 데이터는 `fetch` API를 사용하여 서버로 POST 요청을 보내는 데 사용됩니다.

3. **렌더링**:
   - 폼 필드와 제출 버튼을 렌더링합니다. 폼 제출 시 `handleSubmit` 함수가 호출되어 비동기 작업을 처리합니다.

### `useFormStatus`와 `FormData`의 조합

`useFormStatus` 훅은 폼의 제출 상태를 관리하고, 사용자에게 폼 제출의 진행 상태를 시각적으로 알릴 수 있게 해줍니다.

`FormData`와 함께 사용하면 폼의 제출 상태를 추적하면서 폼 데이터를 효율적으로 처리할 수 있습니다.

#### 예제: `useFormStatus`와 `FormData` 조합

다음은 `useFormStatus`와 `FormData`를 조합하여 사용하는 예제입니다:

```jsx
import React, { useState } from 'react';
import { useFormStatus } from 'react';

const MyForm: React.FC = () => {
  const [formData, setFormData] = useState({ name: '' });
  const { isPending } = useFormStatus();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formElement = event.currentTarget as HTMLFormElement;
    const data = new FormData(formElement);
    
    try {
      const response = await fetch('https://api.example.com/submit', {
        method: 'POST',
        body: data,
      });
      if (!response.ok) throw new Error('Failed to submit form');
      alert('Form submitted successfully!');
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
   - `useFormStatus` 훅을 호출하여 `isPending` 값을 얻습니다. 이 값은 폼 제출 중임을 나타냅니다.

3. **폼 제출 처리**:
   - `handleSubmit` 함수에서 `FormData` 객체를 사용하여 폼 데이터를 수집합니다.

   - 수집된 데이터는 `fetch` API를 사용하여 서버로 POST 요청을 보냅니다.

   - `isPending` 값을 사용하여 폼 제출 중일 때 버튼을 비활성화하고, 제출 진행 상태를 사용자에게 알립니다.

4. **렌더링**:
   - 폼 필드와 제출 버튼을 렌더링합니다. 제출 중에는 버튼을 비활성화하고 "Submitting..." 메시지를 표시하여 사용자에게 진행 상태를 알립니다.

---

## 폼과 Server Actions의 관계 및 `useActionState`의 조합

React 19에서는 폼 요소와 서버 사이의 상호작용을 개선하기 위한 여러 기능이 추가되었습니다.

그 중에서도 **Server Actions**와 **`useActionState`**는 폼 제출 시 비동기 작업을 더 효과적으로 처리할 수 있게 해줍니다.

### Server Actions

**Server Actions**는 서버에서 실행되는 비동기 함수를 정의하고 사용하는 기능입니다.

이를 통해 클라이언트에서 서버로 데이터를 전송하고, 서버에서 직접 비즈니스 로직을 처리할 수 있습니다.

폼 제출 시 서버 측에서 직접 데이터를 처리할 수 있으므로, 클라이언트 측에서 복잡한 비즈니스 로직을 피할 수 있습니다.

#### 기본 사용법

`Server Actions`를 사용하면 서버에서 실행될 비동기 작업을 정의하고, 이를 폼 제출 시 서버에서 실행되도록 할 수 있습니다.

`Server Actions`는 폼의 `action` 속성에 직접 할당하여 사용할 수 있습니다.

### 예제: Server Actions 사용

다음은 `Server Actions`을 사용하여 폼 제출을 처리하는 예제입니다:

```jsx
import React from 'react';

async function submitForm(data: FormData) {
  "use server"; // Server Actions을 사용함을 나타냅니다.
  const response = await fetch('https://api.example.com/submit', {
    method: 'POST',
    body: data,
  });
  if (!response.ok) throw new Error('Failed to submit form');
}

const MyForm: React.FC = () => {
  return (
    <form action={submitForm}>
      <input type="text" name="name" />
      <button type="submit">Submit</button>
    </form>
  );
};

export default MyForm;
```

**코드 설명:**

1. **`submitForm` 함수 정의**:
   - `submitForm` 함수는 서버에서 실행될 비동기 작업을 정의합니다. 이 함수는 `FormData` 객체를 받아서 서버로 POST 요청을 보냅니다.

   - `"use server"` 지시어를 사용하여 이 함수가 서버에서 실행될 것임을 나타냅니다.

2. **폼 정의**:
   - `form` 요소의 `action` 속성에 `submitForm` 함수를 할당하여, 폼 제출 시 이 함수가 서버에서 실행되도록 합니다.

3. **렌더링**:
   - 폼 필드와 제출 버튼을 렌더링합니다. 폼 제출 시 `submitForm` 함수가 서버에서 실행되어 데이터를 처리합니다.

### `useActionState`와 폼 요소의 `action` 속성 조합

**`useActionState`**는 폼 제출 시 비동기 작업을 처리할 때 상태를 관리할 수 있는 훅입니다.

`useActionState`와 폼 요소의 `action` 속성을 조합하여 사용할 수 있으며, 이 조합은 비동기 작업을 더 쉽게 관리할 수 있게 해줍니다.

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
        body: data,
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
   - `useState` 훅을 사용하여 `formData` 상태를 관리합니다. 이 상태는 폼 필드의 값을 저장합니다.

2. **`useActionState` 훅 사용**:
   - `useActionState` 훅을 사용하여 비동기 작업을 처리합니다. `submitForm` 함수는 `FormData`를 사용하여 서버로 POST 요청을 보냅니다.

   - `isPending`은 비동기 작업의 진행 상태를 나타냅니다.

3. **폼 필드 변경 처리**:
   - `onChange` 이벤트 핸들러를 사용하여 폼 필드의 값을 `formData` 상태에 반영합니다.

4. **폼 제출 처리**:
   - `action` 속성에 `submitForm` 함수를 할당하여 폼 제출 시 비동기 작업을 처리합니다.

   - `isPending`을 사용하여 제출 중에는 버튼을 비활성화하고, 제출 진행 상태를 사용자에게 알립니다.

5. **렌더링**:
   - 폼 필드와 버튼을 렌더링하며, 제출 중에는 "Submitting..." 메시지를 표시합니다.

   - 제출된 데이터가 있으면 이를 표시합니다.

### `useActionState`와 Server Actions의 조합

`useActionState`와 **Server Actions**를 조합하면, 비동기 작업과 서버 측 작업을 효과적으로 처리할 수 있습니다.

이 조합을 통해 비동기 작업의 상태를 관리하면서 서버에서 실행되는 작업을 정의할 수 있습니다.

#### 예제: `useActionState`와 Server Actions 조합

다음은 `useActionState`와 **Server Actions**을 조합하여 사용하는 예제입니다:

```jsx
import React, { useState } from 'react';

async function submitForm(data: FormData) {
  "use server"; // Server Actions을 사용함을 나타냅니다.
  const response = await fetch('https://api.example.com/submit', {
    method: 'POST',
    body: data,
  });
  if (!response.ok) throw new Error('Failed to submit form');
  return data; // 서버 응답 데이터를 반환
}

const MyForm: React.FC = () => {
  const [formData, setFormData] = useState({ name: '' });
  const [state, submit, isPending] = useActionState(submitForm, formData);

  return (
    <form action={submit}>
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

1. **`submitForm` 함수 정의**:
   - `submitForm` 함수는 서버에서 실행될 비동기 작업을 정의합니다. 이 함수는 폼 데이터를 서버로 전송하고, 서버의 응답을 반환합니다.

   - `"use server"` 지시어를 사용하여 이 함수가 서버에서 실행될 것임을 나타냅니다.

2. **`useActionState` 훅 사용**:
   - `useActionState` 훅을 사용하여 폼 제출 시 비동기 작업을 처리합니다. 이 훅은 `submitForm` 함수와 `formData`를 인자로 받아 비동기 작업을 수행하고 상태를 관리합니다.

3. **폼 필드 변경 처리**:
   - `onChange` 이벤트 핸들러를 사용하여 폼 필드의 값을 `formData` 상태에 반영합니다.

4. **폼 제출 처리**:
   - `action` 속성에 `submit` 함수를 할당하여 폼 제출 시 비동기 작업을 처리합니다.

   - `isPending`을 사용하여 제출 중에는 버튼을 비활성화하고, 제출 진행 상태를 사용자에게 알립니다.

5. **렌더링**:
   - 폼 필드와 버튼을 렌더링하며, 제출 중에는 "Submitting..." 메시지를 표시합니다.

   - 제출된 데이터가 있으면 이를 표시합니다.
