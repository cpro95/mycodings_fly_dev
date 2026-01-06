---
slug: 2026-01-05-remix-3-component-library-tutorial-closure-state
title: "리믹스(Remix) 3의 새로운 컴포넌트 완전 정복: 훅(Hooks) 없이 클로저로 개발하는 완벽 가이드"
summary: "리액트의 훅을 벗어나 클로저와 웹 표준 API로 상태를 관리하는 @remix-run/component의 핵심 개념과 튜토리얼을 상세히 정리했습니다."
date: 2026-01-05T13:19:50.211Z
draft: false
weight: 50
tags: ["Remix", "React", "Component", "Hooks", "Closure", "Tutorial", "Web Standards", "State Management"]
contributors: []
---

- [**리액트와는 다른 길, 리믹스의 새로운 도전**](#리액트와는-다른-길-리믹스의-새로운-도전)
- [**@remix-run/component란 무엇인가?**](#remix-runcomponent란-무엇인가)
- [**시작하기: 설치 및 기본 구조**](#시작하기-설치-및-기본-구조)
- [**핵심 개념: 상태 관리와 렌더링 라이프사이클**](#핵심-개념-상태-관리와-렌더링-라이프사이클)
  - [**1. 상태가 없는(Non-stateful) 컴포넌트**](#1-상태가-없는non-stateful-컴포넌트)
  - [**2. 상태가 있는(Stateful) 컴포넌트**](#2-상태가-있는stateful-컴포넌트)
- [**프롭스(Props)를 다루는 두 가지 방법**](#프롭스props를-다루는-두-가지-방법)
- [**이벤트 처리와 웹 표준의 활용**](#이벤트-처리와-웹-표준의-활용)
  - [**전역 이벤트 리스너**](#전역-이벤트-리스너)
- [**스타일링과 DOM 접근**](#스타일링과-dom-접근)
- [**고급 기능: 비동기 작업과 컨텍스트**](#고급-기능-비동기-작업과-컨텍스트)
- [**마무리하며**](#마무리하며)


### **리액트와는 다른 길, 리믹스의 새로운 도전**

최근 '리믹스(Remix)' 팀이 개발 중인 `@remix-run/component`를 직접 사용해 보고 깊이 파헤쳐 봤는데요.

리액트 생태계에 익숙한 우리에게는 '훅(Hooks)' 없는 컴포넌트라는 개념이 다소 낯설면서도 신선하게 다가옵니다.

이 라이브러리는 리액트 라우터(React Router) v7과는 또 다른 접근 방식으로, 리액트 의존성을 걷어내고 순수 자바스크립트와 DOM 프리미티브(Primitives)에 집중한 독자적인 모델을 제시하고 있습니다.

이번 글에서는 공식 문서와 README 내용을 바탕으로 기본 튜토리얼부터 심화 기능까지, 이 새로운 라이브러리를 어떻게 다뤄야 하는지 완벽하게 정리해 드립니다.


### **@remix-run/component란 무엇인가?**

이 라이브러리는 리믹스 팀이 실험적으로 선보인 경량 컴포넌트 시스템인데요.

가장 큰 특징은 훅을 전혀 사용하지 않고, 자바스크립트의 기본 기능인 '변수'와 '클로저'만으로 상태를 관리한다는 점입니다.

또한 브라우저의 웹 표준 API(EventTarget, AbortSignal 등)를 적극적으로 활용하여 불필요한 추상화를 줄였습니다.


### **시작하기: 설치 및 기본 구조**

우선 라이브러리를 설치하는 방법부터 알아볼까요?


```bash
npm install @remix-run/component
```

설치가 끝났다면 가장 기본적인 'Hello World' 격인 카운터 앱을 만들어 보겠습니다.

리액트의 `ReactDOM.createRoot`와 유사한 방식으로 진입점을 설정합니다.


```tsx
import { createRoot, type Handle } from '@remix-run/component'

function App(this: Handle) {
  let count = 0
  return () => (
    <button
      on={{
        click: () => {
          count++
          this.update()
        },
      }}
    >
      Count: {count}
    </button>
  )
}

createRoot(document.body).render(<App />)
```

코드를 보면 `this: Handle`을 통해 컴포넌트의 컨텍스트에 접근하고, `count` 변수를 직접 수정하는 것을 볼 수 있는데요.

상태 변경 후에는 `this.update()`를 호출하여 명시적으로 재렌더링을 예약해야 한다는 점이 리액트와의 결정적인 차이입니다.


### **핵심 개념: 상태 관리와 렌더링 라이프사이클**

리액트와 가장 큰 차이점은 컴포넌트가 실행되는 방식, 즉 '멘탈 모델'이 완전히 다르다는 것인데요.

리액트 컴포넌트는 재렌더링 될 때마다 함수 전체가 다시 실행되지만, `@remix-run/component`는 초기화 시점에 딱 한 번만 실행됩니다.


#### **1. 상태가 없는(Non-stateful) 컴포넌트**

단순히 JSX를 반환하는 컴포넌트는 상태를 유지하지 않습니다.

부모가 업데이트될 때마다 이 함수도 매번 새로 실행되므로, 스코프가 초기화됩니다.


```tsx
function Greeting(this: Handle, props: { name: string }) {
  return <h1>Hello, {props.name}!</h1>
}
```

#### **2. 상태가 있는(Stateful) 컴포넌트**

값을 기억해야 한다면 함수 내부에서 '렌더 함수'를 반환(return)하는 구조를 취해야 합니다.

이때 컴포넌트는 두 가지 페이즈로 나뉘게 됩니다.


*   **셋업(Setup) 페이즈**: 바깥쪽 함수가 실행되는 단계로, 컴포넌트 생성 시 **단 1회**만 실행됩니다. 여기서 변수(상태)를 초기화하고 이벤트 리스너를 등록합니다.

*   **렌더(Render) 페이즈**: 반환된 내부 함수가 실행되는 단계로, `update()`가 호출될 때마다 실행됩니다.


```tsx
function Counter(this: Handle, setupProps: { initial: number }) {
  // [셋업 페이즈] 1회 실행
  let count = setupProps.initial

  // [렌더 페이즈] 매 업데이트마다 실행
  return (renderProps: { label?: string }) => (
    <div>
      {renderProps.label || 'Count'}: {count}
      <button
        on={{
          click: () => {
            count++
            this.update()
          },
        }}
      >
        Increment
      </button>
    </div>
  )
}
```

이 구조 덕분에 우리는 `useState`나 `useEffect` 같은 훅 없이도, 단순히 변수 `count`를 클로저에 가둬두는 것만으로 상태를 유지할 수 있는 것입니다.


### **프롭스(Props)를 다루는 두 가지 방법**

위 예제에서 보셨듯이 프롭스를 받는 위치도 중요한데요.

초기화에만 필요한 값은 바깥쪽 함수의 인자(`setupProps`)로 받고, 시간이 지남에 따라 변할 수 있는 값은 안쪽 함수의 인자(`renderProps`)로 받아야 합니다.

보통 `initial`이나 `defaultValue` 같은 설정값은 셋업 프롭스로, `label`이나 `disabled` 같은 UI 속성은 렌더 프롭스로 처리합니다.


### **이벤트 처리와 웹 표준의 활용**

이벤트 핸들링은 `on` 프롭을 사용하며, `@remix-run/interaction` 라이브러리가 내부적으로 DOM 이벤트를 처리해 주는데요.

여기서 아주 강력한 기능이 하나 등장합니다.

바로 이벤트 핸들러의 두 번째 인자로 전달되는 `AbortSignal`입니다.


```tsx
function SearchInput(this: Handle) {
  let query = ''

  return () => (
    <input
      type="text"
      value={query}
      on={{
        input: (event, signal) => {
          query = event.currentTarget.value
          this.update()

          // 비동기 통신 시 경쟁 상태(Race Condition) 방지
          fetch(`/search?q=${query}`, { signal })
            .then((res) => res.json())
            .then((results) => {
              if (signal.aborted) return
              // 결과 업데이트 로직
            })
        },
      }}
    />
  )
}
```

사용자가 빠르게 타이핑할 때 이전 요청을 자동으로 취소하거나, 컴포넌트가 사라질 때 메모리 누수를 방지하는 코드를 별도의 `useEffect` 없이 이벤트 핸들러 내부에서 직관적으로 작성할 수 있습니다.


#### **전역 이벤트 리스너**

`window`나 `document` 같은 전역 객체의 이벤트도 `this.on()` 메서드를 사용하면 아주 깔끔하게 처리할 수 있는데요.

컴포넌트가 연결 해제(Unmount)될 때 자동으로 리스너를 정리(Cleanup)해 주기 때문에 개발자가 신경 쓸 부분이 확 줄어듭니다.


```tsx
function KeyboardTracker(this: Handle) {
  let keys: string[] = []

  this.on(document, {
    keydown: (event) => {
      keys.push(event.key)
      this.update()
    },
  })

  return () => <div>Keys: {keys.join(', ')}</div>
}
```

### **스타일링과 DOM 접근**

스타일링은 `css` 프롭을 통해 인라인 스타일 객체로 정의하는데요.

단순한 인라인 스타일을 넘어, 중첩(Nesting) 구문이나 의사 선택자(Pseudo-selectors), 미디어 쿼리까지 지원하는 강력한 기능을 내장하고 있습니다.


```tsx
function Button(this: Handle) {
  return () => (
    <button
      css={{
        color: 'white',
        backgroundColor: 'blue',
        '&:hover': {
          backgroundColor: 'darkblue',
        },
        '@media (max-width: 768px)': {
          padding: '8px',
        },
      }}
    >
      Click me
    </button>
  )
}
```

DOM 요소에 직접 접근해야 할 때는 리액트의 `ref` 대신 `connect` 프롭을 사용합니다.

이 콜백 역시 `AbortSignal`을 제공하므로, `ResizeObserver` 같은 API를 연결하고 해제하는 작업이 매우 수월해집니다.


```tsx
function Component(this: Handle) {
  return () => (
    <div
      connect={(node, signal) => {
        let observer = new ResizeObserver(() => { /* ... */ })
        observer.observe(node)

        // 요소가 DOM에서 제거될 때 자동 실행
        signal.addEventListener('abort', () => {
          observer.disconnect()
        })
      }}
    >
      Content
    </div>
  )
}
```

### **고급 기능: 비동기 작업과 컨텍스트**

화면을 그린 직후에 포커스를 이동하거나 스크롤을 해야 한다면 `this.queueTask()`를 활용하세요.

이 메서드는 다음 업데이트가 완료된 직후에 실행될 작업을 예약해 줍니다.


컨텍스트(Context) API 또한 제공되는데요.

다만, 컨텍스트 값을 변경한다고 해서 하위 컴포넌트가 자동으로 재렌더링 되지는 않습니다.

이 문제를 해결하기 위한 리믹스 팀의 권장 패턴은 컨텍스트 값 자체를 `EventTarget`으로 만드는 것입니다.


```tsx
// 1. EventTarget을 상속받은 상태 클래스 정의
class Theme extends TypedEventTarget<{ change: Event }> {
  #value = 'light'
  get value() { return this.#value }
  setValue(val) {
    this.#value = val
    this.dispatchEvent(new Event('change')) // 변경 알림 발송
  }
}

// 2. 소비하는 컴포넌트에서 구독
function ThemedContent(this: Handle) {
  let theme = this.context.get(App)

  // 변경 이벤트 구독 -> 업데이트 트리거
  this.on(theme, { change: () => this.update() })

  return () => (
    <div css={{ backgroundColor: theme.value === 'dark' ? '#000' : '#fff' }}>
      Current theme: {theme.value}
    </div>
  )
}
```

이렇게 하면 값이 바뀔 때 필요한 부분만 정확하게 업데이트할 수 있어 성능 최적화에도 유리합니다.


### **마무리하며**

지금까지 `@remix-run/component`의 핵심 기능들을 훑어보았는데요.

리액트의 방대한 생태계와 훅의 편리함도 좋지만, 클로저와 웹 표준 API만으로 이렇게 깔끔하게 컴포넌트를 구성할 수 있다는 점이 매우 인상적입니다.

물론 아직 SSR이나 비동기 컴포넌트 미지원 등 제약 사항이 있어 실무에 바로 투입하기엔 이르지만, 리믹스 팀이 그리는 '웹 표준 중심의 미래'를 엿볼 수 있는 좋은 기회였습니다.

여러분도 가볍게 사이드 프로젝트로 이 새로운 패러다임을 경험해 보시는 건 어떨까요?
