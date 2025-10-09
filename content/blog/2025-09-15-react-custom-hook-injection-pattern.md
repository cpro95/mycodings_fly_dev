---
slug: 2025-09-15-react-custom-hook-injection-pattern
title: 리액트 컴포넌트 아직도 UI와 로직을 섞어 쓰시나요
date: 2025-09-16 13:12:03.394000+00:00
summary: 리액트 컴포넌트에서 UI와 비즈니스 로직을 완벽하게 분리하는 커스텀 훅 주입 패턴을 소개합니다. 테스트와 재사용성이 극대화되는 새로운 개발 경험을 만나보세요.
tags: ["React", "react", "커스텀 훅", "디자인 패턴", "의존성 주입", "테스트", "Storybook"]
contributors: []
draft: false
---

리액트로 개발하다 보면 컴포넌트 하나가 걷잡을 수 없이 비대해지는 경험, 다들 한 번쯤은 해보셨을 텐데요.<br />

UI를 그리는 JSX 코드와 상태를 관리하는 `useState`, `useEffect` 그리고 서버와 통신하는 API 호출 로직까지, 그야말로 모든 것이 한데 뒤섞여버리는 순간입니다.<br />

이렇게 되면 코드는 점점 읽기 어려워지고, 작은 기능을 하나 수정하려 해도 어디를 봐야 할지 막막해지거든요.<br />

마치 UI와 로직이 겹겹이 쌓인 '밀푀유 케이크'처럼 되어버리는 셈이죠.<br />

물론 리액트의 함수형 컴포넌트와 훅은 정말 훌륭한 도구지만, 가끔은 '아, 여기서 딱 한 걸음만 더 나아갈 수 있다면' 하는 아쉬움이 들 때가 있습니다.<br />

오늘은 바로 그 아쉬움을 해결해 줄 아주 흥미로운 패턴 하나를 소개해 드리려고 하는데요.<br />

바로 컴포넌트의 '행위'를 커스텀 훅에 완전히 위임하고, 이 훅을 컴포넌트에 '주입'하는 방식입니다.<br />
저는 이 패턴을 '커스텀 훅 주입 패턴'이라고 부르고 싶네요.<br />

## 핵심은 분리 그리고 주입

이 패턴의 아이디어는 정말 단순 명료한데요.<br />

컴포넌트는 오직 '보여주는 일(UI)'에만 집중하고, 상태 관리나 데이터 로딩 같은 복잡한 '행위(Logic)'는 모두 커스텀 훅이 책임지는 구조입니다.<br />

그리고 이 둘을 연결하는 방식이 바로 `props`를 통해 커스텀 훅 자체를 전달하는, 일종의 '의존성 주입(Dependency Injection)'입니다.<br />

말로만 들으면 조금 막연할 수 있으니, 아주 간단한 카운터 예제로 바로 살펴보시죠.<br />

### 기본 카운터 예제

먼저, 컴포넌트와 커스텀 훅의 역할이 어떻게 나뉘는지 코드로 보여드릴게요.<br />

**1. 행위를 정의하는 커스텀 훅 `useCounter`**<br />

이 훅은 카운터의 상태(`count`)와 그 상태를 변경하는 함수(`increase`)를 가지고 있습니다.<br />

오직 카운터의 로직에만 집중하는 순수한 자바스크립트 코드 덩어리입니다.<br />

```typescript
// useCounter.ts
import { useState } from 'react';<br />

export type UseCounter = () => {
  count: number;
  increase: () => void;
};<br />

export const useCounter: UseCounter = () => {
  const [count, setCount] = useState(0);<br />
  const increase = () => setCount(count + 1);<br />
  return { count, increase };<br />
};
```

**2. 화면을 그리는 `Counter` 컴포넌트**<br />

`Counter` 컴포넌트는 이제 스스로 상태를 갖지 않는데요.<br />

대신 `useCounter`라는 `prop`을 통해 카운터의 '행위'를 통째로 주입받습니다.<br />

그리고 주입받은 훅을 실행해서 얻은 `count`와 `increase`를 그저 화면에 렌더링할 뿐입니다.<br />

```typescript
// Counter.tsx
import type { UseCounter } from './useCounter';<br />

export const Counter = (props: { useCounter: UseCounter }) => {
  const { count, increase } = props.useCounter();<br />
  return <button onClick={increase}>Count: {count}</button>;<br />
};
```

**3. 조립하는 `App` 컴포넌트**<br />

마지막으로 `App` 컴포넌트에서 이 둘을 합쳐주면 되는데요.<br />

`Counter` 컴포넌트의 `useCounter` prop에 우리가 만든 `useCounter` 훅을 넘겨주면 끝입니다.<br />

```typescript
// App.tsx
import { Counter } from './Counter';<br />
import { useCounter } from './useCounter';<br />

export const App = () => {
  return <Counter useCounter={useCounter} />;
};
```

어떤가요?<br />

컴포넌트는 이제 `count`가 어떻게 관리되는지, `increase`가 정확히 무슨 일을 하는지 전혀 알 필요가 없게 되었습니다.<br />

그저 '이런 모양의 훅이 들어오면, 나는 이렇게 그려주겠다'는 약속만 지키면 되는 거죠.<br />

## 그래서 이게 왜 강력한가요

'관심사의 분리'나 '재사용성' 같은 원론적인 이야기는 잠시 접어두고, 이 패턴이 실제 개발 현장에서 어떤 강력한 이점을 가져다주는지 말씀드릴게요.<br />

### 첫째, 테스트가 놀랍도록 쉬워집니다

이 패턴의 가장 큰 미덕은 바로 '테스트 용이성'인데요.<br />

우리는 이제 복잡한 로직과 까다로운 UI를 각각 따로 떼어내서 테스트할 수 있습니다.<br />

로직을 테스트할 때는 더 이상 리액트 컴포넌트를 렌더링하고 버튼 클릭을 시뮬레이션할 필요가 없습니다.<br />

그냥 `useCounter` 훅을 테스트 환경에서 실행하고, 반환된 `increase` 함수를 호출한 뒤 `count` 값이 제대로 변했는지 확인하면 그만입니다.<br />

반대로 UI 컴포넌트를 테스트할 때는 실제 로직이 담긴 `useCounter`를 쓸 필요가 없거든요.<br />

테스트 목적에 맞는 '가짜 훅(Mock Hook)'을 즉석에서 만들어 주입하면 됩니다.<br />

예를 들어, `count`가 999일 때 UI가 깨지지 않는지 보고 싶다면, 그냥 `count`가 999를 반환하는 목 훅을 전달하면 끝입니다.<br />

```typescript
// Counter.test.tsx
it('카운트가 999일 때도 올바르게 렌더링된다', () => {
  const useCounterMock = () => ({
    count: 999,
    increase: () => {}, // 아무것도 안 함
  });<br />

  render(<Counter useCounter={useCounterMock} />);<br />
  expect(screen.getByText('Count: 999')).toBeInTheDocument();<br />
});
```

### 둘째, Storybook과의 궁합이 환상적입니다

UI 개발자에게 Storybook은 정말 중요한 도구인데요.<br />

이 패턴을 사용하면 Storybook에서 컴포넌트의 다양한 모습을 훨씬 쉽게 확인할 수 있습니다.<br />

API 로딩 중일 때의 스피너, 에러가 발생했을 때의 메시지, 데이터가 비어있을 때의 플레이스홀더 등 모든 UI 상태를 '목 훅'을 갈아 끼우는 것만으로 손쉽게 구현하고 문서화할 수 있습니다.<br />

더 이상 `msw` 같은 라이브러리로 API를 모킹하는 복잡한 설정에 머리 아파할 필요가 없는 거죠.<br />

UI 개발자는 오직 UI에만, 로직 개발자는 오직 로직에만 온전히 집중할 수 있는 환경이 만들어집니다.<br />

## 실전 예제 TodoItem 컴포넌트

이 패턴은 사실 `Counter` 같은 간단한 예제보다는 API 통신처럼 외부 의존성이 있는 컴포넌트에서 진짜 위력을 발휘하는데요.<br />

예를 들어, `TodoItem`이라는 컴포N넌트가 있다고 상상해 봅시다.<br />

각 아이템은 자신의 완료 상태를 토글하는 기능과 삭제하는 기능이 필요할 겁니다.<br />

이때 우리는 `createUseTodoItem`이라는 '훅 팩토리'를 만들 수 있습니다.<br />

이 팩토리는 `todoId`를 인자로 받아서, 해당 ID에 대한 상태 토글 및 삭제 로직이 담긴 전용 훅을 반환해 주는 거죠.<br />

```typescript
// use-todo-item.ts
// 특정 todoId에 대한 로직을 생성하는 훅 팩토리
export const createUseTodoItem = (todoId: string) => {
  // 반환되는 것이 바로 TodoItem 컴포넌트에 주입될 '전용 훅'
  return () => {
    const [todo, setTodo] = useTodoState(todoId); // Recoil, Zustand 등 전역 상태
    
    const toggleComplete = async () => {
      // API 호출 로직...
    };<br />

    const deleteTodo = async () => {
      // API 호출 로직...
    };<br />

    return { todo, toggleComplete, deleteTodo };<br />
  };<br />
};
```

그리고 `TodoItem` 컴포넌트는 이 전용 훅을 주입받아 사용하기만 하면 됩니다.<br />

```typescript
// TodoItem.tsx
// useTodoItem은 createUseTodoItem(id)의 결과물
const TodoItem = ({ useTodoItem }) => {
  const { todo, toggleComplete, deleteTodo } = useTodoItem();<br />
  // ... JSX 렌더링
};
```
이렇게 하면 각 `TodoItem`은 다른 아이템의 상태와 완전히 격리된 채 자신만의 로직을 갖게 되고, 테스트와 재사용성은 극대화됩니다.<br />

## 언제 사용하고, 언제 피해야 할까

물론 이 패턴이 만병통치약은 아닌데요.<br />

모든 컴포넌트에 이 패턴을 적용하는 것은 오히려 코드 구조를 불필요하게 복잡하게 만들 수 있습니다.<br />

이 패턴은 주로 API 호출처럼 '외부 세계'와 소통해야 하는, 비즈니스 로직이 중요한 컴포넌트에 적용했을 때 가장 효과적입니다.<br />

반면에 단순히 부모에게서 받은 `props`를 보여주거나, 컴포넌트 내부에서만 사용하는 간단한 상태(`useState`, `useRef`)만 가진 컴포넌트에는 굳이 적용할 필요가 없습니다.<br />

또한, 훅을 `prop`으로 넘기는 방식이 익숙하지 않은 팀원에게는 코드의 흐름을 추적하기 어렵게 느껴질 수 있다는 단점도 분명히 존재합니다.<br />

따라서 팀 내에서 충분한 공감대를 형성하고, 파일 구조나 네이밍 컨벤션을 명확히 정립하는 과정이 꼭 필요합니다.<br />

## 정리를 마치며

오늘 소개해 드린 '커스텀 훅 주입 패턴'은 리액트 컴포넌트를 설계하는 또 하나의 새로운 관점을 제시하는데요.<br />

컴포넌트의 '모양'과 '행위'를 완전히 분리함으로써, 우리는 개발의 각 단계에서 훨씬 더 집중할 수 있는 환경을 만들 수 있습니다.<br />

특히 테스트 코드 작성을 중요하게 생각하거나, Storybook을 통해 체계적인 디자인 시스템을 구축하려는 팀에게는 정말 강력한 무기가 될 수 있을 겁니다.<br />

물론 처음에는 약간의 학습 비용과 코드 구조의 복잡성 증가라는 트레이드오프가 존재하지만, 그 이상의 가치를 제공한다고 저는 확신합니다.<br />

작은 토이 프로젝트나 팀의 사이드 프로젝트에서 이 패턴을 한 번 시도해 보시는 건 어떨까요?<br />

아마 여러분의 리액트 개발 경험을 한 단계 더 높은 수준으로 끌어올려 줄 멋진 계기가 될지도 모릅니다.<br />

---