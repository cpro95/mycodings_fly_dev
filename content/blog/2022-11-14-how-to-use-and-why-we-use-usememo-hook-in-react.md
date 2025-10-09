---
slug: 2022-11-14-how-to-use-and-why-we-use-usememo-hook-in-react
title: useMemo Hook을 이용한 반응속도 빠른 React 코드 작성하기
date: 2022-11-14 06:10:57.091000+00:00
summary: useMemo Hook의 이해와 이를 이용한 반응속도 빠른 React 코드 작성하기
tags: ["usememo", "react"]
contributors: []
draft: false
---

![mycodings_fly_dev_usememo_hook_example](https://blogger.googleusercontent.com/img/a/AVvXsEhAkUYNBkqeTlIUHJFQD0iT9dHEczyiT0V2HD1kVPkAppyF6LZZL83_YiyF3mzIGevhhXQ561iRi4y-hpSHDFfYj7FPrMtKXWX02mB9ZFTVo23eIkN_Xt9abqJqF7gQq3PvCaentGFmVv5wJ0IJUn33zVXZy1g76eRaUAYvgL5H98Zy6Oso_kVrQNHF)

안녕하세요?

오늘은 말로만 듣던 useMemo 훅을 직접 사용해보고 또 실험 결과를 직접 눈으로 보면서 왜 useMemo 훅을 써야 하는지 이해하는 시간을 갖도록 하겠습니다.

일단 테스트를 위해 create-react-app을 하나 만듭시다.

```bash
npx create-react-app usememo-test
```

이제 usememo-test 폴더로 이동해서 App.js 파일을 다음과 같이 통째로 바꿉시다.

```js
import { useState } from 'react'
import './App.css'

const expensiveCalculation = num => {
  console.log('Calculating...')
  for (let i = 0; i < 1_000_000_000; i++) {
    num += 1
  }
  console.log('Calculating...Done')
  return num
}

const App = () => {
  const [count, setCount] = useState(0)
  const [todos, setTodos] = useState([])

  const calculation = expensiveCalculation(count)

  const increment = () => {
    setCount(prevCount => prevCount + 1)
  }

  const addTodo = () => {
    setTodos(prevTodos => [...prevTodos, 'New Todo'])
  }

  return (
    <div className='App'>
      <div>
        <h2>My Todos</h2>
        {todos.map((todo, index) => {
          return <p key={index}>{todo}</p>
        })}
        <button onClick={addTodo}>Add Todo</button>
      </div>
      <hr />
      <div>
        <p>Count: {count}</p>
        <button onClick={increment}>+</button>
        <h2>Expensive Calculation</h2>
        {calculation}
      </div>
    </div>
  )
}

export default App
```

![mycodings_fly_dev_usememo_hook_example](https://blogger.googleusercontent.com/img/a/AVvXsEhjaemNhkGWxJvmX0Wq45BOxQwpRJPD7ICQ_OKUhiCmKssKS0oMvTt5IW10IfXTgEQW5Zo9xvZ-oMheFhozLewKI7-Z4HPSUAwTrK40Au_vv8IQU_C45EYsw9m4rds4Kyb1WKkN21dgQNPwsWPKx83WgA4I8XyuXP0Mt6kiyU05N7I2H3rHuoihGLPj=s16000)

위 그림과 같이 실행 결과가 나오는데요.

Add Todo 버튼과 + 버튼이 있습니다.

실제 위의 두 버튼을 눌러보면 반응속도가 느린데요.

![mycodings_fly_dev_usememo_hook_example](https://blogger.googleusercontent.com/img/a/AVvXsEgPiJY28pQJDTdbA2sASOz8L5jzDe4qvS_-6n9vDU9a_wqWfIc9kbeBVviS45Gmu0kPCcF7QwTeuJn3SQYCQSSo2w7Tnp-gxmcTtfOmg98cgp9Mve7_nCWJL-9nyEbDY-jw-4QaapdGYpEo3_bQbsXBTw6NedePk-3rhHFCMfQZD3zrZrscBKSoOpJm=s16000)

위의 그림처럼 반응속도가 매우 느립니다.

왜냐하면 테스트 목적을 위해 우리가 작성한 expensiveCalculation 함수 때문인데요.

0에서 10억까지 1씩 숫자를 더하는 로직입니다.

일반적인 CPU라면 몇 초라는 꽤 오랜 시간이 걸리는데요.

expensiveCalculation 함수는 React State 중에 count State와 연관이 있는데요.

그래서 + 버튼을 누르면 아래 코드에서 처럼 count 값을 다시 계산해서 calculation 값을 화면에 보여주는데요.

```js
const calculation = expensiveCalculation(count)
```

그래서 + 버튼을 누르면 화면이 다시 갱신됩니다.

React State가 변했으니까 다시 렌더링 하게 되는 거죠.

Svelte나 SolidJS는 전체 페이지가 리 렌더링 되지 않고 해당 부분만 렌더링 되지만 React는 그렇지 않습니다.

그리고 Add Todo 버튼을 눌러도 전체 페이지가 리 렌더링 되는데요.

Add Todo 버튼을 누르면 todos라는 React State를 변경시키기 때문에 또다시 전체 페이지가 리 렌더링 됩니다.

그래서 Add Todo 버튼을 눌러도 expensiveCalculation 함수가 호출되고 결과적으로 화면 반응속도가 느려지는데요.

여기서 우리가 생각해 봐야 할 게 바로 expensiveCalculation 함수인데요.

보통 리액트에서 서버에서 데이터를 가져올 때 딜레이가 생기게 됩니다.

만약 서버에서 데이터를 가져오는 로직이 항상 똑같은 값만 가져온다면 우리는 그 결과 값을 캐시로 저장해서 반응속도를 빠르게 할 수 있는데요.

바로 useMemo 훅이 여기에 쓰입니다.

expensiveCalculation 함수도 useMemo 훅을 이용하면 그 힘든 연산을 한 번만 해도 되게 됩니다.

어떻게 코드를 바꿔야 할까요?

바로 expensiveCalculation 함수를 호출하는 방식을 useMemo를 이용해서 호출하면 됩니다.

```js
import { useState, useMemo } from "react";

...
...

  const calculation = useMemo(() => expensiveCalculation(count), [count]);
```

위와 같이 useMemo 훅을 useEffect 훅과 비슷한 방식으로 쓰면 됩니다.

실행 결과를 볼까요?

![mycodings_fly_dev_usememo_hook_example](https://blogger.googleusercontent.com/img/a/AVvXsEhOoZ4usdBzcKemeNi8B96muKxNcDReoUR14lSdpoKr4anuDWUFv8r8dao9R_41fjLybfW5RAwRIW00HnXhHQp__OQ76oCqKZ6ptuR67kAlNt5T-G01EWY_VgF1SAKn9C3jbL4JnuPEFkz7nAjE4aDCDqj3BX-wawuXCihn4O87iVjEbcbkeRCjfdVL=s16000)

Add Todo는 expensiveCalculation 함수의 영향을 받지 않는 걸로 나옵니다.

왜냐하면 count라는 React State에 의해서만 useMemo 훅이 실행되거든요.

그래서 밑에 + 버튼을 누르면 역시나 느린 반응이 나옵니다.

useMemo 훅은 메모리 소비가 심하므로 꼭 필요한 경우에만 쓰시길 바랍니다.

끝.
