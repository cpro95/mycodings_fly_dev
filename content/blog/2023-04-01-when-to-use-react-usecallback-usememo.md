---
slug: 2023-04-01-when-to-use-react-usecallback-usememo
title: useCallback, useMemo 훅은 언제 써야 할까요?
date: 2023-04-01 01:18:05.073000+00:00
summary: useCallback, useMemo 훅은 언제 써야 할까요?
tags: ["usecallback", "usememo", "react", "javascript"]
contributors: []
draft: false
---

우리는 쉽게 React에서 스테이트(상태) 변경을 통해 UI를 제어하는데요.

이런 스테이트(상태) 변경이 사실은 리액트 애플리케이션의 속도에 심각한 영향을 미칠 수 있습니다.

뭐 간단한 상태 변경이야 큰 문제가 안 되겠지만 아주 큰 컴포넌트를 핸들링할 때는 정말 큰 속도 저하가 발생하는데요.

그래서 리액트 팀에서 내놓은 게 바로 useCallback과 useMemo 훅(Hook)입니다.

둘 다 React 애플리케이션의 성능을 개선하기 위해 사용됩니다.

그럼, "useCallback과 useMemo는 동일한 기능을 하는 건가요?"라는 질문이 있을 수 있는데요.

두 가지 모두 성능 최적화를 위해 사용되지만, 약간은 그 방향성이 틀립니다.

이제 그 부분에 대해 좀 더 심도 있게 알아보겠습니다.

먼저 이 두 개의 훅이 왜 사용되는지 이해해 볼 필요가 있는데요.

위에서 언급한 것처럼, 두 훅 모두 성능 최적화를 위해 사용됩니다.

애플리케이션이 빈번한 리렌더링(re-rendering)을 일으키고 있다면 위의 두 훅을 사용하시는 걸 심각히 고려하셔야 합니다.

먼저, 문법적으로 무엇이 다른지 살펴볼까요?

```jsx
useCallback(()=>{
  doSomething();
}, [dependencies]);

useMemo(()=>{
  doSomething();
}, [dependencies]);
```

보시다시피, 문법적 차이는 이름 말고는 없습니다.

두 훅 모두 useEffect 함수처럼 종속성 배열을 받아들입니다.

## useMemo와 useCallback의 차이점?

차이점은 바로 useMemo는 메모이제이션된 값을 반환하고 useCallback은 메모이제이션된 함수를 반환한다는 것입니다.

뭔가 이해가 안 되시죠? 예시를 통해 차이점을 알아봅시다.

아래와 같이 부모 컴포넌트가 있다고 가정해 봅시다.

```jsx
import { React, useState } from 'react';
import ChildComponent from './ChildComponent'

function App() {
  const [num, setNum] = useState(0);

  return(
    <div>
      <h1>{num}</h1>
      <ChildComponent />
      <button onClick={() => setNum(num + 1)}> Addition </button>
    </div>
  );
}
```

그리고 자식 컴포넌트가 있습니다.

```jsx
import { React } from 'react';

function ChildComponent() {
  console.log("child component rendered")
  
  return(
    <div>
      <h1>Hello World</h1>
    </div>
  );
}

export default ChildComponent;
```

Addition 버튼을 클릭할 때마다 자식 컴포넌트에 있는 console.log 명령어에 의해 문자열이 출력되는 걸 볼 수 있는데요.

상태(스테이트) 변경이 부모 컴포넌트에서만 일어나고 있지만, 자식 컴포넌트까지 불필요하게 다시 렌더링 되고 있습니다.

어떻게 하면 이런 불필요한 리렌더링을 피할 수 있을까요?

## useMemo로 해결하기

아까 위에서 useMemo는 메모이제이션된 값을 반환한다고 했는데요.

이걸 이용해서 자식 컴포넌트를 useMemo로 감싸서 호출해 봅시다.

부모 컴포넌트를 다음과 같이 고쳐봅시다.

```jsx
import { React, useState, useMemo } from 'react';
import ChildComponent from './ChildComponent'

function App() {
  const [num, setNum] = useState(0);

  const getChildComp = useMemo(() => <ChildComponent />, []);

  return(
    <div>
      <h1>{num}</h1>
      {getChildComp}
      <button onClick={() => setNum(num + 1)}> Addition </button>
    </div>
  );
}
```

이 코드에서는 Addition 버튼을 클릭해도 자식 컴포넌트의 console.log 명령어에 의해 문자열이 출력되지 않는 걸 확인할 수 있습니다.

결국, 불필요한 자식 컴포넌트의 리렌더링(re-rendering)을 막아 전체적인 리액트 애플리케이션의 성능저하를 막은 게 되는 거죠.

이제 useCallback이 어떻게 작동하는지 살펴보겠습니다.

## useCallback 이해하기

이번에는 부모 컴포넌트에서 생성한 함수를 자식 컴포넌트에 전달해 볼까 합니다.

그러면 부모 컴포넌트가 다음과 같아지는데요.

```jsx
import { React, useState } from 'react';
import ChildComponent from './ChildComponent'

function App() {
const [num, setNum] = useState(0);

const handleUpdateNum = () => {
	let sum;	
	for(let i=0;i<100;i++) {
		sum = sum + i;
  }	
};

const getChildComp = useMemo(
() => <ChildComponent handleUpdateNum={handleUpdateNum} />,
[handleUpdateNum]
);

return(
<div>
<h1>{num}</h1>
{getChildComp}
<button onClick={() => setNum(num + 1)}> Addition</button>
</div>
);
}
```

Addition버튼을 클릭하면 콘솔에 문자열이 찍힙니다.

즉, 자식 컴포넌트가 리렌더링(re-rendering)되는 걸 볼 수 있습니다. 따라서 이 상황에서는 useMemo가 도움이 되지 않습니다.

왜냐하면 부모 컴포넌트가 다시 렌더링 될 때마다 handleUpdateNum 함수가 다시 생성되기 때문입니다.

아까 맨 처음에 useCallback이 메모이제이션된 함수를 반환한다고 했습니다.

맞습니다. 함수 관련이면 useCallback을 써야 합니다.

이제 useCallback이 어떻게 작동하는지 살펴보겠습니다.

다음과 같이 useCallback 방식으로 바꿔 봅시다.

```jsx
import { React, useState, useCallback } from 'react';
import ChildComponent from './ChildComponent'

function App() {
  const [num, setNum] = useState(0);

  const handleUpdateNum = useCallback(() => {
    let sum;	
		for(let i=0;i<100;i++) {
			sum = sum + i;
	  }	
  }, []);

  const getChildComp = useMemo(
    () => <ChildComponent handleUpdateNum={handleUpdateNum} />,
    [handleUpdateNum]
  );
  
  return(
    <div>
      <h1>{num}</h1>
      {getChildComp}
      <button onClick={() => setNum(num + 1)}> Addition </button>
    </div>
  );
}
```

handleUpdateNum 함수를 useCallback 훅으로 감싸고 결과를 확인해 보겠습니다. 

이제 부모 컴포넌트의 상태가 변경된 후에도 자식 컴포넌트가 다시 리렌더링(re-rendering)되지 않는 것을 볼 수 있습니다.

조금은 어려울 수 있는 useCallback과 useMemo 훅인데요.

이 글로 조금이라도 도움이 되셨으면 합니다.