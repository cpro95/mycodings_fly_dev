---
slug: 2024-09-21-react-19-cheat-sheet-1-server-component-actions
title: React 19 완벽 가이드 1편 - 서버 컴포넌트, Actions, Async Script 지원, 서드파티 스크립트 호환성 향상
date: 2024-09-21 03:58:35.479000+00:00
summary: React 19 치트 시트입니다. 서버 컴포넌트, Actions, Async Script 지원, 서드파티 스크립트 호환성 향상에 대해 알아봅시다.
tags: ["react", "React Server Components", "Actions", "useActionState", "useFormStatus", "useOptimistic", "Async Script Support", "Improved Third-Party Script Compatibility"]
contributors: []
draft: false
---

안녕하세요?

React 19의 배포가 얼마 안 남았는데요.

오늘은 Remix Framework을 이용한 [Epic React](https://www.epicreact.dev/)로 유명한 Kent C. Dodds님이 제공해 주신 React 19 치트 시트를 바탕으로 React 19에 대해 공부해 볼까 합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhai9Zpuud2ukp0J5JjN7PNlUZ9inrYLL9SD5knW0n6U0fR6mETdxiD-HYX-EPjk0CyZuYDHAtB6rP--3mEUwvhFgYm2g_B45N3Yk2Arf5In4S2j8WkWLHtkC33BJO_BbNDo4Mc5V0smdOh78U1ihzOHRJ2Vh_sQToI_0wUxNHQDwODSIuoEbsj3paj988)

먼저, Kent C. Dodds님이 제공해주시는 React 19 치트시트는 아래 링크에서 받으실 수 있는데요.

[PDF 다운로드](https://res.cloudinary.com/epic-web/image/upload/v1725974609/react-19-cheat-sheet.pdf)

React 19에서 여러 가지 기능이 추가되거나 변하게 되는데 1편과 2편에 걸쳐 해당 기능에 대해 쉬운 설명과 예제 코드를 가져가도록 해 보겠습니다.

---

**목차**

- [React 19 완벽 가이드 1편 - 서버 컴포넌트, Actions, Async Script 지원, 서드파티 스크립트 호환성 향상](#react-19-완벽-가이드-1편---서버-컴포넌트-actions-async-script-지원-서드파티-스크립트-호환성-향상)
  - [**React Server Components**](#react-server-components)
    - [상세 설명](#상세-설명)
    - [코드 설명](#코드-설명)
      - [1. **비동기 함수와 `await` 사용**:](#1-비동기-함수와-await-사용)
      - [2. **클라이언트 측 컴포넌트와 데이터 전달**:](#2-클라이언트-측-컴포넌트와-데이터-전달)
    - [서버 컴포넌트를 사용하는 이유](#서버-컴포넌트를-사용하는-이유)
    - [추가 팁](#추가-팁)
  - [**Actions**와 관련 훅](#actions와-관련-훅)
    - [**Actions**](#actions)
    - [**useActionState**](#useactionstate)
      - [**사용 예시**:](#사용-예시)
    - [**useFormStatus**](#useformstatus)
      - [**활용 예시**:](#활용-예시)
    - [**useOptimistic**](#useoptimistic)
      - [**예시**:](#예시)
    - [종합 정리](#종합-정리)
  - [**Async Script Support**, **Improved Third-Party Script Compatibility**](#async-script-support-improved-third-party-script-compatibility)
    - [Async Script Support (비동기 스크립트 지원)](#async-script-support-비동기-스크립트-지원)
      - [비동기 스크립트란?](#비동기-스크립트란)
      - [초보자를 위한 팁:](#초보자를-위한-팁)
    - [Improved Third-Party Script Compatibility (서드파티 스크립트 호환성 향상)](#improved-third-party-script-compatibility-서드파티-스크립트-호환성-향상)
      - [서드파티 스크립트란?](#서드파티-스크립트란)
      - [호환성 문제](#호환성-문제)
      - [초보자를 위한 팁:](#초보자를-위한-팁-1)
    - [요약](#요약)
  - [**'use client'**, **'use server'**](#use-client-use-server)
    - ['use client' – 클라이언트 코드에서 사용하는 기능](#use-client--클라이언트-코드에서-사용하는-기능)
      - ['use client'가 필요한 이유는?](#use-client가-필요한-이유는)
      - [초보자를 위한 핵심:](#초보자를-위한-핵심)
    - ['use server' – 서버 측 함수 사용](#use-server--서버-측-함수-사용)
      - [서버에서 함수 실행하기](#서버에서-함수-실행하기)
      - [초보자를 위한 핵심:](#초보자를-위한-핵심-1)
    - ['use client'와 'use server'의 차이점 요약](#use-client와-use-server의-차이점-요약)
    - [요약](#요약-1)

---

## **React Server Components**

![](https://blogger.googleusercontent.com/img/a/AVvXsEgeeJP5Rfk9yj6Po03ZfQ0ezj5cZYtRMscabyqL3vAsXStV7FtP_z4kEsnLb4QSgSzHXG1zVPUPlRxTVsmbN24I1rZe2opaogZa_AQhkuEjTRRUAichBZca09pEmUnwgoWv8iJ38We0owH1XbUoQUYzQxWnXzuhSlw2ZErLZdL7oUCTMeOdk9vAY8DOXLQ)

Server-rendered components that execute at build time or per request.

```tsx
// dashboard.tsx
import * as db from './db.ts'
import { createOrg } from './org-actions.ts'
import { OrgPicker } from './org-picker.tsx'

// look! it's async!
export async function Dashboard() {
  // look! await!
  const orgs = await db.getOrgs()
  return (
    {/* this is all server-only code */}
    <div>
      <h1>Dashboard</h1>
      {/* OrgPicker is a client-side component and we can pass it server stuff! */}
      <OrgPicker orgs={orgs} onCreateOrg={createOrg} />
    </div>
  )
}
```

### 상세 설명

React 19의 **서버 컴포넌트(React Server Components)**는 애플리케이션의 일부를 서버에서 렌더링하고, 나머지는 클라이언트에서 처리하도록 분리할 수 있는 기능을 제공합니다.

이렇게 하면 클라이언트에서 불필요하게 큰 JavaScript 번들을 로드하지 않고도 빠른 초기 로딩과 성능 향상을 꾀할 수 있습니다.

React 서버 컴포넌트는 빌드 시 또는 요청 당시에 실행되며, 서버에서 데이터를 받아 렌더링하는 작업을 처리하는 데 매우 유용합니다.

클라이언트 쪽 코드에서는 그 데이터를 받아 표시만 하면 됩니다.

다음과 같은 두 가지 주요 장점이 있습니다:

1. **서버에서 처리되는 데이터 로드**: 서버에서만 데이터베이스에 접근하거나 서버 전용 로직을 처리할 수 있습니다. 이 경우 클라이언트는 단순히 결과물만 받아 사용자에게 보여줍니다.
2. **클라이언트의 부하 감소**: 클라이언트에서는 오직 UI 렌더링에만 집중하고, 비즈니스 로직과 데이터 처리는 서버에서 수행되기 때문에 브라우저의 부담을 줄일 수 있습니다.

### 코드 설명

```tsx
// dashboard.tsx
import * as db from './db.ts'
import { createOrg } from './org-actions.ts'
import { OrgPicker } from './org-picker.tsx'
```

여기서는 React 서버 컴포넌트에서 사용할 여러 모듈을 불러오고 있습니다.

`db`는 데이터베이스와 상호작용하는 모듈로, 데이터를 서버에서 가져올 수 있게 해줍니다.

`createOrg`는 새로운 조직?을 생성하는 함수일거고, `OrgPicker`는 클라이언트 쪽에서 UI 요소로 사용될 컴포넌트입니다.

```tsx
export async function Dashboard() {
  const orgs = await db.getOrgs()
  return (
    <div>
      <h1>Dashboard</h1>
      <OrgPicker orgs={orgs} onCreateOrg={createOrg} />
    </div>
  )
}
```

#### 1. **비동기 함수와 `await` 사용**:

`Dashboard` 함수는 **비동기(async)** 함수로 정의되었으며, 데이터베이스에서 조직(Org)? 목록을 가져오기 위해 `await db.getOrgs()`를 사용합니다.

`await` 키워드는 해당 데이터가 서버에서 받아올 때까지 기다리게 해줍니다.

이 부분이 **서버에서만 실행되는 코드**라는 점이 중요합니다.

브라우저에서는 이러한 데이터베이스 호출이 불가능하므로 서버에서 미리 처리하고 클라이언트에게 결과만 전달합니다.

#### 2. **클라이언트 측 컴포넌트와 데이터 전달**:

```tsx
{/* OrgPicker is a client-side component and we can pass it server stuff! */}
<OrgPicker orgs={orgs} onCreateOrg={createOrg} />
```

`OrgPicker`는 클라이언트에서 렌더링되는 컴포넌트입니다.

서버에서 가져온 `orgs` 데이터는 이 컴포넌트의 props로 전달되며, 클라이언트에서 그 데이터를 바탕으로 UI가 렌더링됩니다.

즉, **서버에서 받은 데이터**가 클라이언트에서 **유저 인터페이스(UI)**로 변환되는 과정이죠.

이 부분에서는 `OrgPicker` 컴포넌트에 `orgs`라는 데이터를 전달하고 있으며, 사용자가 새로운 조직을 생성할 수 있도록 `createOrg` 함수를 prop으로 넘겨주고 있습니다.

### 서버 컴포넌트를 사용하는 이유

React 서버 컴포넌트는 성능 최적화와 사용자 경험을 개선하는 데 중점을 둡니다.

예를 들어:

- **더 빠른 페이지 로드**: 서버에서 미리 필요한 데이터를 가져와 렌더링하므로, 클라이언트는 그 데이터를 기다리지 않고 즉시 화면에 보여줄 수 있습니다.
- **SEO(검색 엔진 최적화) 개선**: 클라이언트에서만 렌더링하는 방식은 크롤러가 제대로 데이터를 수집하지 못할 수 있지만, 서버에서 렌더링된 컴포넌트는 검색 엔진 크롤러도 쉽게 접근할 수 있습니다.
- **클라이언트의 처리 부담 감소**: 서버에서 무거운 작업을 처리하므로, 브라우저에서 처리해야 할 JavaScript 양이 줄어들어 앱이 더욱 반응성을 갖습니다.

### 추가 팁

- 서버 컴포넌트는 **상태**나 **이벤트**를 관리하지 않습니다. 이러한 처리는 여전히 클라이언트 측에서 해야 합니다.
- 서버에서 렌더링된 컴포넌트는 클라이언트에서 재사용할 수 없습니다. 따라서 서버 컴포넌트에서 클라이언트 컴포넌트를 호출할 수는 있지만, 반대는 불가능합니다.

React 19의 **서버 컴포넌트**는 특히 대규모 애플리케이션에서 사용자가 페이지를 로드할 때마다 서버와 클라이언트 간의 최적의 데이터 처리 방식을 찾는 데 유용합니다.

---

## **Actions**와 관련 훅

React 19는 다양한 기능을 통해 더 나은 사용자 경험을 제공하는 데 중점을 둡니다. 여기서 소개하는 **Actions**, **useActionState**, **useFormStatus**, 그리고 **useOptimistic**는 React에서 폼(form) 관리를 최적화하고, 비동기 요청을 처리하는 데 큰 도움이 되는 주요 도구들입니다.

각 항목을 자세히 설명하면서 React 19를 처음 접하는 사람들을 위해 쉽게 이해할 수 있도록 추가 설명을 제공하겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgvZddksY0XqHRqzQACOvGcGXFV6D9sy0FqQCl2o-vZm-qxCPUV8qdT61YBpAq23JyTwsSPREiP_gQDh8grgF9j4sEWmRFVsrBPVwmZwpTIAL1q65Jr6EEfjBwknz3WoLSQdyRndDk1q8cxEZ8_yPu2uoLPcC_JNjQkHVOOA5TYv9eICiO7RelaRyu7mMY)

### **Actions**

Async functions that handle form submission, error states, and optimistic updates automatically.

```html
<form action={createOrg} />
```
**Actions**는 비동기 함수로, 주로 폼 제출과 같은 사용자 이벤트에 대한 처리를 담당합니다.

사용자가 폼을 제출할 때, 서버와의 통신이 필요하거나 여러 단계의 검증 작업을 해야 할 때 매우 유용합니다.

React 19에서는 이러한 폼 제출, 오류 상태 처리, 그리고 **낙관적 업데이트(Optimistic Updates)**를 자동으로 처리해줍니다.

```html
<form action={createOrg} />
```

위 코드는 폼 제출이 `createOrg`라는 비동기 함수로 연결된다는 것을 보여줍니다.

이 함수는 서버에 폼 데이터를 전송하고, 응답을 처리하는 역할을 하죠. **낙관적 업데이트(Optimistic Updates)**란 서버로부터 응답을 받기 전에, 사용자가 입력한 데이터를 일단 화면에 반영하는 방식입니다.

이로써 사용자 경험이 더욱 즉각적이고 매끄럽게 느껴집니다.

---

### **useActionState**

Manages form state, providing degraded experiences when JavaScript is unavailable.

```jsx
const [error, submitAction, isPending] = useActionState(async () => {...}, null);
```

`useActionState`는 폼 상태를 관리하는 Hook입니다.

특히, **JavaScript가 비활성화되었거나 네트워크가 느릴 때**에도 폼의 상태를 잘 관리할 수 있도록 도와줍니다.

이 Hook을 통해 폼의 오류 상태, 제출된 액션, 그리고 요청 대기 중 여부를 추적할 수 있습니다.

```jsx
const [error, submitAction, isPending] = useActionState(async () => {...}, null);
```

여기서 `error`는 폼 제출 과정에서 발생한 오류를 나타내고, `submitAction`은 폼을 제출하는 액션을 담고 있습니다.

`isPending`은 현재 폼 제출이 진행 중인지(대기 중인지)를 확인할 수 있는 변수입니다.

이러한 상태 값들은 폼 제출 과정에서 발생할 수 있는 문제를 관리하고, 사용자에게 적절한 피드백을 제공하는 데 매우 유용합니다.

#### **사용 예시**:

- 사용자가 폼을 제출할 때 로딩 스피너를 표시하려면 `isPending` 값을 확인해 로딩 중인 상태를 표시할 수 있습니다.
- 폼 제출 후 오류가 발생했을 때는 `error` 값을 통해 오류 메시지를 사용자에게 보여줄 수 있습니다.

---

### **useFormStatus**

Access the status of a parent form without prop drilling.

```jsx
const { pending, data, method, action } = useFormStatus();
```

`useFormStatus`는 부모 폼의 상태에 접근할 수 있도록 해주는 Hook입니다.

기존 방식에서는 상태를 자식 컴포넌트로 전달하기 위해 **prop drilling**이 필요했는데, React 19에서는 이러한 과정 없이 간편하게 상태를 참조할 수 있습니다.

```jsx
const { pending, data, method, action } = useFormStatus();
```

이 코드를 통해 폼의 상태를 받아올 수 있습니다:
- `pending`: 폼 제출이 진행 중인지 여부를 나타냅니다.
- `data`: 폼에 입력된 데이터를 담고 있습니다.
- `method`: 폼이 제출될 때 사용된 HTTP 메서드(예: GET, POST)를 나타냅니다.
- `action`: 폼이 제출된 액션을 나타냅니다.

이 Hook을 사용하면 폼 상태를 컴포넌트 간에 손쉽게 공유할 수 있어, 폼 관리가 더욱 간편해집니다.

#### **활용 예시**:

폼의 전송 상태에 따라 사용자에게 피드백을 제공하거나, 폼이 제출되었을 때 데이터를 기반으로 추가적인 작업을 실행할 수 있습니다.

---

### **useOptimistic**

Show optimistic state while async requests are in progress.

```jsx
const [optimisticName, setOptimisticName] = useOptimistic(name);
```

`useOptimistic`는 비동기 요청이 진행되는 동안, 사용자가 입력한 데이터를 미리 화면에 반영하는 **낙관적 업데이트(Optimistic Updates)**를 가능하게 해주는 Hook입니다.

이는 서버에서 응답을 기다리지 않고, 사용자의 입력 결과를 미리 보여줌으로써 더 빠른 사용자 경험을 제공합니다.

```jsx
const [optimisticName, setOptimisticName] = useOptimistic(name);
```

위 코드는 `name`이라는 값을 서버 응답 전에 미리 화면에 반영하는 예시입니다.

`optimisticName`은 미리 보여줄 데이터이며, `setOptimisticName`은 이를 업데이트할 수 있는 함수입니다. 

낙관적 업데이트를 사용하면, 서버 응답이 느리더라도 사용자에게는 즉각적인 응답을 제공하여 사용 경험이 크게 향상됩니다.

예를 들어, 사용자가 폼에서 이름을 입력하고 제출했을 때, 서버로부터 확인 응답을 받기 전에 화면에 이름이 바로 반영되도록 할 수 있습니다.

#### **예시**:

1. 사용자가 새로운 게시글을 작성하고 제출할 때, 서버가 응답하기 전에 게시글이 이미 추가된 것처럼 보이도록 UI를 업데이트할 수 있습니다.
2. 사용자가 프로필 사진을 업로드할 때, 서버로부터 사진 업로드가 완료되기 전에 미리 사진이 화면에 표시될 수 있습니다.

### 종합 정리

React 19에서 제공하는 **Actions**와 관련된 Hook들은 폼 제출과 비동기 요청을 간편하게 처리할 수 있는 강력한 도구들입니다.

특히 비동기 요청에서 발생할 수 있는 지연 시간 문제를 해결하고, 사용자가 더 빠르고 직관적인 피드백을 받을 수 있도록 돕습니다.

- **Actions**: 폼 제출 및 비동기 처리.
- **useActionState**: 폼 상태 관리.
- **useFormStatus**: 부모 폼 상태에 접근.
- **useOptimistic**: 낙관적 업데이트 처리.

이 기능들을 잘 활용하면, React 19에서 폼을 사용한 다양한 사용자 경험을 쉽게 구현할 수 있습니다.

초보자라면 이 Hook들을 통해 복잡한 상태 관리 없이도 강력한 폼 기능을 구현할 수 있죠.

---

## **Async Script Support**, **Improved Third-Party Script Compatibility**  

React 19에서 소개된 **Async Script Support**와 **Improved Third-Party Script Compatibility** 기능은 성능과 호환성을 향상시키는 중요한 업데이트입니다.

React를 처음 접하는 초보자들이 이 개념을 이해할 수 있도록 쉽게 설명해 보겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhFTRrk9-Fl-pQucB7Vn1jaj69h-H9kNzioFHj3pYxDvpgSupoKKbwXElRS6Rw7vZdPsVvq_2asKb-E5A4z_wipQA1auci6XjZs5VU-VSYL5YyeRbIulCzC8Mcf70FBgIjNbJav8pkWufMSDHC5qaXL4UP0qGp5VGPflrvz9qwIlzi09E7OtBsDJlWTWsI)

### Async Script Support (비동기 스크립트 지원)

Render async scripts anywhere in your component tree, with automatic deduplication.
```html
<script async src="https://example.com/script.js"></script>
```

#### 비동기 스크립트란?

웹 페이지가 로딩될 때, HTML 파일에 `<script>` 태그로 자바스크립트 파일을 포함시키는 경우가 많습니다.

하지만 이 스크립트들은 기본적으로 페이지 로딩을 방해할 수 있습니다.

예를 들어, `<script>` 태그가 있는 경우, 브라우저는 해당 스크립트를 다 다운로드받고 실행할 때까지 페이지 로딩을 잠시 멈추게 됩니다.

React 19에서는 비동기 스크립트를 쉽게 지원합니다.

**비동기 스크립트**는 페이지 로딩과 동시에 스크립트를 병렬로 불러오게 하여, 페이지 로딩 속도에 영향을 미치지 않도록 합니다. 비동기 스크립트는 아래와 같이 사용할 수 있습니다:

```html
<script async src="https://example.com/script.js"></script>
```

여기서 `async` 속성은 스크립트가 비동기적으로 로드되고, 로드가 완료되면 즉시 실행된다는 것을 의미합니다.

React 19는 이 비동기 스크립트를 **어느 위치에서나** 사용할 수 있게 했으며, **자동 중복 제거**(deduplication) 기능도 지원합니다.

중복된 스크립트를 여러 번 실행하지 않도록 자동으로 관리해 주기 때문에 개발자가 일일이 신경 쓰지 않아도 됩니다.

#### 초보자를 위한 팁:

비동기 스크립트를 사용하면 페이지 성능이 향상될 수 있지만, 스크립트가 언제 실행될지 명확하지 않으므로, 중요한 초기화 작업은 비동기 스크립트보다는 일반 스크립트를 사용하는 것이 좋습니다.

### Improved Third-Party Script Compatibility (서드파티 스크립트 호환성 향상)

Unexpected tags in `<head>` and `<body>` are skipped during hydration, avoiding mismatch errors.

#### 서드파티 스크립트란?

**서드파티 스크립트**는 우리가 직접 작성하지 않은 외부 자바스크립트 파일을 말합니다.

예를 들어, Google Analytics, 광고 스크립트, 혹은 소셜 미디어 위젯 같은 것들이 이에 해당합니다.

이러한 스크립트는 React 애플리케이션에서 로드되며, 종종 HTML의 `<head>`나 `<body>` 태그에 예상치 않은 방식으로 삽입될 수 있습니다.

#### 호환성 문제

React에서 렌더링할 때, 페이지의 상태가 클라이언트(브라우저)와 서버 사이에서 일치하지 않으면 **"hydration"** 단계에서 문제가 발생할 수 있습니다.

이 과정에서 **예상치 못한 태그**가 삽입되면 페이지가 제대로 로드되지 않거나, 일종의 불일치 오류가 발생할 수 있습니다.

React 19는 이러한 **서드파티 스크립트와 태그 문제를 자동으로 해결**합니다.

즉, `<head>`나 `<body>`에 예상하지 못한 태그가 추가되어도 React가 이를 인식하고, 이러한 문제를 건너뛰기 때문에 더 이상 불일치 오류가 발생하지 않습니다.

이로 인해 다양한 서드파티 스크립트를 사용하는 웹사이트에서도 React 애플리케이션을 안정적으로 실행할 수 있습니다.

#### 초보자를 위한 팁:
서드파티 스크립트를 사용할 때는 항상 해당 스크립트가 페이지의 성능이나 동작에 어떤 영향을 미칠지 잘 고려해야 합니다.

React 19는 이러한 스크립트와의 충돌 문제를 많이 해결했지만, 여전히 스크립트 로드 순서나 스크립트 간의 의존성을 신경 써야 할 때가 있습니다.

### 요약
- **Async Script Support**: 비동기적으로 스크립트를 로드하여 페이지 성능을 향상시키며, React 19는 스크립트 중복을 자동으로 제거해 준다.
- **Improved Third-Party Script Compatibility**: 외부에서 삽입된 태그로 인해 발생할 수 있는 페이지 로딩 오류를 React가 자동으로 처리해 준다.

이러한 기능은 성능을 최적화하고 외부 스크립트와의 호환성을 개선하는 데 큰 도움을 줍니다.

처음 React를 배울 때는 이와 같은 성능 최적화 기능이 당장 눈에 보이지 않을 수 있지만, 규모가 커지거나 복잡한 애플리케이션을 만들 때 매우 중요한 요소가 될 것입니다.

---

## **'use client'**, **'use server'**

React 19에서 새롭게 도입된 **'use client'**와 **'use server'**는 클라이언트와 서버 간의 경계를 더욱 명확히 하여 개발자가 쉽게 관리할 수 있도록 도와줍니다.

이 두 기능은 React 애플리케이션의 성능과 유연성을 높이기 위한 중요한 업데이트이며, 처음 React를 접하는 분들도 이해할 수 있도록 차근차근 설명해 드리겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgAzov1mBd77xqKJL_-tk8C4RQdl8c0DHwy53VvsZyhh8i5om8o4F6iFQAGI7pvmp9atZnpT3e3cz03_qzZ0Kk821GMd3KmYJNMQVk8zU2JyNQpCWTplAzeoqjIn43KJD6LL2W1ySGZK5xom86efsZgaBmZJAX81X3dMYmFfARk5YlEiPXiAZ184mxHvbc)

### 'use client' – 클라이언트 코드에서 사용하는 기능

Marks code that can be referenced by the server component and can use client-side React features.

```tsx
// org-picker.tsx
'use client'

// regular component like we've been building for years
export function OrgPicker({ orgs, onCreateOrg }) {
  // The `orgs` and `onCreateOrg` props can come from a server component!
  // This component can use useState, useActionState, useEffect, useRef, etc etc etc...

  return <div />
}
```

React에서는 클라이언트와 서버 모두에서 컴포넌트를 렌더링할 수 있습니다.

React 19는 이러한 구분을 더욱 명확하게 하기 위해 **'use client'**라는 디렉티브(지시자)를 도입했습니다.

클라이언트에서 실행되는 컴포넌트의 경우, 이 디렉티브를 명시해야 합니다.

#### 'use client'가 필요한 이유는?

React 애플리케이션에서는 클라이언트와 서버에서 각각 다른 작업을 수행하는 경우가 많습니다

 예를 들어, 서버 컴포넌트는 데이터베이스와 통신하거나 API 요청을 처리할 수 있지만, 클라이언트 컴포넌트는 상태 관리(예: `useState`), 사용자 입력 처리, 이벤트 핸들링 등 브라우저 내에서만 가능한 작업을 수행합니다.

**'use client'**를 사용하면, 해당 컴포넌트가 클라이언트에서 실행된다는 것을 명시적으로 알릴 수 있으며, 아래와 같은 React 훅들(`useState`, `useEffect` 등)을 사용할 수 있습니다. 

```tsx
// org-picker.tsx
'use client'

// 예전처럼 일반적인 React 컴포넌트를 작성할 수 있습니다.
export function OrgPicker({ orgs, onCreateOrg }) {
  // 클라이언트 측 상태 관리나 이벤트 처리에 필요한 훅들을 자유롭게 사용할 수 있습니다.
  const [selectedOrg, setSelectedOrg] = useState(null);

  return (
    <div>
      {/* 서버에서 전달된 orgs를 사용해 UI를 렌더링합니다 */}
      <ul>
        {orgs.map(org => (
          <li key={org.id} onClick={() => setSelectedOrg(org)}>
            {org.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

#### 초보자를 위한 핵심:

- **클라이언트 컴포넌트**는 브라우저에서 실행되며, 사용자와의 상호작용(이벤트 처리, 상태 관리 등)을 담당합니다.
- **'use client'**는 클라이언트에서만 실행되는 컴포넌트를 명확히 지정하는 방식입니다.
- `useState`, `useEffect` 등과 같은 클라이언트 측 훅을 사용할 때 필수적으로 사용됩니다.

---

### 'use server' – 서버 측 함수 사용

Marks server-side functions callable from client-side code.

```ts
// org-actions.ts
'use server'

// this function can be called by the client!
export async function createOrg(prevResult, formData) {
  // create an org with the db
  // return a handy result
}
```

**'use server'**는 서버에서 실행되는 함수들을 정의하는 데 사용됩니다.

서버 함수는 클라이언트에서 호출할 수 있지만, 실제로는 서버에서 실행됩니다.

이를 통해 보안이 중요한 작업이나 서버에서만 가능한 작업(예: 데이터베이스 작업)을 서버 측에서 처리하고, 결과만 클라이언트에 전달할 수 있습니다.

#### 서버에서 함수 실행하기

React 19에서는 서버 함수가 클라이언트 코드에서 호출되지만, 그 실행은 서버에서 이루어집니다.

이는 서버가 데이터베이스와 통신하거나 API를 호출하는 작업을 쉽게 처리할 수 있게 합니다.

예를 들어, 아래 코드는 새로운 조직을 데이터베이스에 추가하는 서버 측 함수를 정의한 예시입니다.

```ts
// org-actions.ts
'use server'

// 이 함수는 클라이언트에서 호출되지만 서버에서 실행됩니다.
export async function createOrg(prevResult, formData) {
  // 데이터베이스와 통신하여 새로운 조직을 생성합니다.
  const newOrg = await db.createOrganization(formData);

  // 결과를 클라이언트로 반환합니다.
  return newOrg;
}
```

이 함수는 클라이언트 코드에서 호출되지만, 데이터베이스와 직접 상호작용하는 작업은 서버에서 실행되기 때문에 보안이나 성능 면에서 이점이 있습니다.

#### 초보자를 위한 핵심:

- **서버 함수**는 보통 서버에서만 할 수 있는 작업(데이터베이스 접근, 인증 처리 등)을 담당합니다.
- **'use server'**는 이 함수가 서버에서 실행되어야 한다는 것을 명시합니다.
- 서버에서만 처리할 수 있는 작업은 클라이언트에서 실행되면 안 되므로, 이를 명확히 구분하기 위해 사용합니다.

### 'use client'와 'use server'의 차이점 요약

1. **'use client'**: 클라이언트에서만 실행되는 컴포넌트를 정의합니다. 상태 관리(`useState`)나 이벤트 핸들링과 같은 브라우저 관련 작업에 적합합니다.
2. **'use server'**: 서버에서만 실행되는 함수를 정의합니다. 보안이 중요한 데이터베이스 작업이나 서버 측 비즈니스 로직을 처리하는 데 적합합니다.

### 요약

React 19에서는 클라이언트와 서버의 경계를 명확히 하고, 각각의 역할을 구분할 수 있는 **'use client'**와 **'use server'** 디렉티브를 도입했습니다. 

이를 통해 개발자는 더 효율적이고 안전한 방식으로 React 애플리케이션을 구축할 수 있습니다.

- **'use client'**는 클라이언트에서 실행되는 코드에 사용됩니다. 상태 관리나 이벤트 처리에 적합합니다.
- **'use server'**는 서버에서 실행되는 함수를 정의하며, 데이터베이스와 같은 서버 자원을 안전하게 사용할 수 있습니다.

이 개념을 잘 이해하면 클라이언트와 서버의 역할을 분리하여 더욱 최적화된 애플리케이션을 만들 수 있습니다.

React 19의 이러한 기능은 복잡한 애플리케이션에서도 높은 성능과 안정성을 유지할 수 있도록 도와줍니다.

---

1편 끝.
