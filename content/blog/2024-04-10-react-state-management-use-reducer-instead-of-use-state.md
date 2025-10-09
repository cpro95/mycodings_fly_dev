---
slug: 2024-04-10-react-state-management-use-reducer-instead-of-use-state
title: React 상태관리는 이제 useState 말고 useReducer 쓰세요
date: 2024-04-10 10:30:53.268000+00:00
summary: useReducer 훅으로 하는 React 상태관리
tags: ["useReducer", "react"]
contributors: []
draft: false
---

![](https://blogger.googleusercontent.com/img/a/AVvXsEj8gH2MK7C26HNf8FmuD1z5DWv7fj-uMjzuERDZY7Zcp0F_aUMMsQrj25od00UwtMxCaIk3rzOT2YfbS-HY2mywrI5ukFSzRp3YScywyKhD1VRd7JyF4cjTrmfJsernFyx7mnUq1Kvfak6h6pxFSD3cY3Bumpv8n4CWVeaDt9kLldhKFiUBYnhLcsGq064)

안녕하세요?

오늘은 React의 useReducer 훅에 대해 조금 더 친숙해지기 위해 공부해 볼까 합니다.

제가 공부하고 잊어버리지 않기 위해 적은 거라 수준이 낮을 수 있는데요.

참고 바랍니다.

## Counter 앱을 useState 훅으로 만들기

React 공부하다 보면 가장 기본 앱이 바로 카운트인데요.

useState로 상태 관리하는 가장 기본 코드입니다.

```js
import React from 'react'

const App = () => {
  const [count, setCount] = React.useState(0)

  const handleDecrement = () => {
    setCount(count - 1)
  }
  const handleIncrement = () => {
    setCount(count + 1)
  }
  const handleReset = () => {
    setCount(0)
  }

  return (
    <div>
      <div>
        <input type='button' value='Decrement' onClick={handleDecrement} />
        <span style={{ margin: '10px' }}>{count}</span>
        <input type='button' value='Increment' onClick={handleIncrement} />
      </div>
      <input type='button' value='Reset count' onClick={handleReset} />
    </div>
  )
}

export default App
```

코드는 여기저기 많이 보셨던 카운터 앱입니다.

이제 이걸 useReducer 훅으로 상태 관리하는 코드로 바꾸면서 useReducer 훅을 공부해 나가겠습니다.

## Reducer 패턴

초창기 클래스 컴포넌트로 React 코드를 짤 때 FaceBook에서 Flux 패턴을 제안했었는데요.

그 Flux 패턴을 구현한 게 바로 Redux입니다.

Redux나 Flux 패턴 모두 Reducer 패턴인데요.

그림을 보면서 설명해 보겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgMCMrK3Egg7UlnkcaaL91SpUhb-Dz8rA_nV1n9Uwnb0aDEV27iB95MutwrZ8Xbm4z-n-G5lLMRX2lT7At0RglnBevKdrNUcwn3ZHlaYM0JxYpbJjw3Ec_kE0LEUNg2qI8lQm40NxchqCMSm23ZQN2KTS3bc42JpaadyHGo7AU_gPhvoTX1QY2sgPmc1q4)

위와 같이 Dispatch 라는 독특한 구조를 이용해서 Reducer라는 로직이 상태관리를 하고 있습니다.

Dispatch는 Observer 패턴에서도 많이 나오는데요.

뭔가 이상한 움직임을 감지하면 바로 경고를 Dispatch합니다.

Dispatch 라는 영어를 한국어로 번역하면 "전송", "발송" 쯤으로 번역이 되는데요.

그런데 그냥 "디스패치"라고 하는 게 조금 더 번역이 세련된 거 같네요.

여기서 중요한 점은 Reducer에 Action을 전달하는데요.

이 Action이 바로 실제 일어나는 모든 상황 중에서 우리가 필요로 하는 상황만을 코드로 전환한 거라고 보면 됩니다.

보통 Action은 Type 과 Args 로 나누는 게 편합니다.

그리고 "디스패치" 될 때 Action이 Reducer로 전달되는데 useReducer 훅은 자동으로 현재 상태를 같이 Reducer로 보내줍니다.

그래서 프로그래머가 현재 상태를 직접 전달할 필요가 없죠.

---

## 카운트 앱을 Flux 패턴으로 코드화하기

useReducer가 어떤 형태로 코드화되는지 먼저 살펴봐야 하는데요.

```js
const [state, dispatch] = React.useReducer(reducer, initialState)
```

위와 같이 reducer와 initialState를 필요로 합니다.

그러면 useReducer가 현상태를 나타내는 state와 dispatch 함수를 리턴해 주죠.

그러면 우리가 useReducer 훅을 사용하기 위해서 필요한 건 바로 initialState와 reducer입니다.

먼저, initialState를 만들어 보겠습니다.

```js
export type State = {
  count: number
};

export initialState : State = {
  count: 0
};
```

위 코드에서 볼 수 있듯이 State라는 타입을 설정하는게 편합니다.

우리가 원하는 상태의 타입을 정하면 그 이후는 쉽게 코드화되거든요.

그래서 initialState는 State 타입인데, count 가 '0'인 값을 갖게 되는 겁니다.

두 번째로 reducer 함수를 만들어야 하는데요.

reducer 함수는 쉽게 말해 Dispatch가 Action을 전달하면 해당 Action에 맞게 로직을 구현해서 상태를 리턴하면 됩니다.

여기서 리턴하는 상태는 바로 State 타입이 되겠죠.

먼저, Action 타입을 정의해 봅시다.

```js
export type Action =
  | {
      type: 'INCREMENT',
      args: { delta: number },
    }
  | {
      type: 'DECREMENT',
      args: { delta: number },
    }
  | {
      type: 'RESET',
    }
```

Action 타입은 위와 같이 3가지 유형으로 정의했습니다.

위 셋 중에 한 가지 형태로만 Action이 Dispatch 된다는 뜻이죠.

이제 reducer 함수를 만들어 보겠습니다.

```js
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + action.args.delta }
    case 'DECREMENT':
      return { count: state.count - action.args.delta }
    case 'RESET':
      return { count: 0 }
  }
}
```

reducer 함수는 현 상태인 state와 뭘 하는지 알려주는 Action 타입 action을 필요로 합니다.

우리가 나중에 Action을 디스패치하면 그 Action이 바로 'action'이 되는 거고,

state는 아까도 말씀드렸지만 현상태의 state는 useReducer가 알아서 같이 전송해 줍니다.

그리고 reducer 함수는 꼭 State를 리턴해야 합니다.

그래서 단순하게 switch 문으로 해당 액션에 맞게 로직을 구현한 후 State 타입에 맞게 리턴해주면 끝입니다.

지금까지 useReducer 훅에 필요한 reducer 함수와 initialState 값을 만들었는데요.

최종 코드는 보통 counter-controller.ts 이름 같은 파일에 넣어 따로 보관하는 게 좋습니다.

```js
export type State = { count: number }
export const initialState: State = { count: 0 }

export type Action =
  | {
      type: 'INCREMENT',
      args: { delta: number },
    }
  | {
      type: 'DECREMENT',
      args: { delta: number },
    }
  | {
      type: 'RESET',
    }

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + action.args.delta }
    case 'DECREMENT':
      return { count: state.count - action.args.delta }
    case 'RESET':
      return { count: 0 }
  }
}
```

## App 컴포넌트에서 useReducer 훅 사용하기

이제 우리가 만든 controller를 실제로 사용하면 됩니다.

```js
import { useReducer } from 'react'

import { reducer, initialState } from './counter-controller'

export const Counter = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const handleDecrement = () => {
    dispatch({ type: 'DECREMENT', args: { delta: 1 } })
  }
  const handleIncrement = () => {
    dispatch({ type: 'INCREMENT', args: { delta: 1 } })
  }
  const handleReset = () => {
    dispatch({ type: 'RESET' })
  }

  return (
    <div>
      <div>
        <input type='button' value='Decrement' onClick={handleDecrement} />
        <span>{state.count}</span>
        <input type='button' value='Increment' onClick={handleIncrement} />
      </div>
      <input type='button' value='Reset count' onClick={handleReset} />
    </div>
  )
}
```

어떤가요?

handleDecrement, handleIncrement, handleReset 함수만 위와 같이 dispatch 함수를 이용해서 작성해 주변 끝입니다.

이제 useReducer로 리액트 상태관리에 도전해 보세요.

코드가 조금 더 명확해집니다.

그럼.
