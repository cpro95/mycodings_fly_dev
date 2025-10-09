---
slug: 2025-07-15-how-react-usestate-works-under-the-hood
title: 리액트 useState는 어떻게 작동할까 훅의 비밀 파헤치기
date: 2025-07-13 03:55:01.252000+00:00
summary: 리액트 개발자라면 매일 사용하는 useState, 그 내부 작동 원리를 알고 계신가요? useState를 직접 만들어보며 클로저의 원리와 훅의 규칙이 왜 필요한지 그 근본적인 이유를 심층적으로 알아봅니다.
tags: ["React", "리액트", "useState", "Hooks", "훅", "리액트 튜토리얼"]
contributors: []
draft: false
---

![](https://i.ytimg.com/vi/G3qglTF-fFI/hqdefault.jpg)

<h2>마법이 아니었던 useState 그 작동 원리</h2>
리액트로 프로젝트를 개발해 본 분이라면, 아마 `useState` 훅을 수백, 수천 번은 사용해 보셨을 겁니다.<br /><br />우리가 사용할 때 `useState`는 매우 간단합니다.<br /><br />초기값을 인자로 받아, 현재 상태(state)와 그 상태를 변경할 수 있는 함수(setter)를 배열 형태로 반환하는 단순한 함수처럼 보입니다.<br /><br />하지만 그 내부에서는 과연 어떤 일이 벌어지고 있을까요.<br /><br />이 마법 같은 기능은 대체 어떻게 구현되어 있을까요.<br /><br />놀랍게도, 그 기본 원리는 우리가 충분히 이해할 수 있을 만큼 간단합니다.<br /><br />이 글에서는 우리만의 `useState`를 단계별로 직접 만들어보면서, 그 작동 원리를 파헤쳐 보고자 합니다.<br /><br />이 과정을 통해 여러분은 단순히 `useState`의 구현 방법을 배우는 것을 넘어, 왜 우리가 그동안 지켜왔던 '훅의 규칙들'(예를 들어, 훅은 최상위 레벨에서만 호출되어야 하고, 리액트 컴포넌트 안에서만 사용되어야 한다는 규칙)이 존재하는지 그 근본적인 이유를 깨닫게 될 것입니다.<br /><br />

<h2>가장 단순한 형태에서 시작하기</h2>
먼저, 두 개의 버튼(A, B)을 만들고 각 버튼을 클릭할 때마다 숫자가 1씩 증가하는 간단한 애플리케이션을 상상해 보겠습니다.<br /><br />가장 기본적인 형태는 다음과 같습니다.<br /><br />

```jsx
import { createRoot } from "react-dom/client";

export const App = () => {
  return (
    <div>
      <button>A : 1</button>
      <button>B : 2</button>
    </div>
  );
};

createRoot(document.getElementById("root")).render(<App />);
```
이제 `useState`를 직접 만들어 보겠습니다.<br /><br />`useState`는 초기값을 받아 상태와 상태 변경 함수를 반환하는 함수입니다.<br /><br />가장 먼저 떠올릴 수 있는 단순한 형태는 이렇습니다.<br /><br />

```javascript
const useState = (initialValue) => {
  const setValue = (newValue) => {
    console.log(newValue);
  };

  return [initialValue, setValue];
};
```
이 함수를 A 버튼에 적용해 보겠습니다.<br /><br />(B 버튼은 잠시 잊어주십시오.)<br /><br />

```jsx
export const App = () => {
  const [countA, setCountA] = useState(1);
  return (
    <div>
      <button>A : {countA} </button>
      <button>B : 2</button>
    </div>
  );
};
```
하지만 이 코드에는 명백한 문제가 있습니다.<br /><br />`useState`는 항상 `initialValue`만 반환하기 때문에, 나중에 상태를 변경하더라도 화면에는 항상 초기값인 1만 표시될 것입니다.<br /><br />우리는 초기값이 아닌, '가장 최신의 상태값'을 기억하고 반환해야 합니다.<br /><br />이를 위해, 상태값을 저장할 별도의 변수가 필요합니다.<br /><br />만약 이 변수를 `useState` 함수 내부에 선언한다면, 함수가 호출될 때마다 변수가 초기화되어 상태를 기억할 수 없게 됩니다.<br /><br />따라서 우리는 함수가 여러 번 호출되어도 값이 유지되도록, 즉 '상태를 유지(persist)'하도록 `useState` 함수 바깥에 변수를 선언해야 합니다.<br /><br />

```javascript
let stateValue;

const useState = (initialValue) => {
  if (stateValue === undefined) {
    stateValue = initialValue;
  }
  const setValue = (newValue) => {
    stateValue = newValue;
  };

  return [stateValue, setValue];
};
```
이제 `stateValue`가 아직 정의되지 않았을 때(최초 호출 시)만 `initialValue`를 할당하고, 그 이후에는 저장된 `stateValue`를 계속 사용합니다.<br /><br />하지만 버튼을 클릭해도 여전히 화면은 바뀌지 않습니다.<br /><br />`stateValue` 값은 실제로 변경되지만, 리액트가 이 변화를 인지하고 화면을 다시 그리지(re-render) 않기 때문입니다.<br /><br />상태가 변경될 때마다 화면을 다시 그리도록 '강제'해야 합니다.<br /><br />이를 위해 `react-dom`의 `render` 메서드를 사용하는 우리만의 렌더링 함수를 만들어 보겠습니다.<br /><br />

```javascript
let root;
const render = () => {
  if (!root) {
    root = createRoot(document.getElementById("root"));
  }
  root.render(<App />);
};

// 최초 렌더링 실행
render();
```
이제 상태 변경 함수인 `setValue`가 호출될 때마다, 이 `render` 함수를 실행해주면 됩니다.<br /><br />

```javascript
const useState = (initialValue) => {
  if (stateValue === undefined) {
    stateValue = initialValue;
  }

  const setValue = (newValue) => {
    stateValue = newValue;
    render(); // 상태 변경 후 리렌더링!
  };

  return [stateValue, setValue];
};
```
이제 버튼을 클릭하면 `setCountA`가 호출되고, `stateValue`가 업데이트된 후 `render` 함수가 실행되어 화면이 다시 그려지면서 최신 `countA` 값이 보이게 됩니다.<br /><br />

<h2>여러 개의 상태를 다루는 방법 배열과 인덱스</h2>
자, 이제 잠시 잊었던 B 버튼을 처리할 시간입니다.<br /><br />만약 우리가 B 버튼을 위해 `useState`를 한 번 더 호출하면 어떻게 될까요.<br /><br />

```jsx
export const App = () => {
  const [countA, setCountA] = useState(1);
  const [countB, setCountB] = useState(2);
  return (
    <div>
      <button onClick={() => setCountA(countA + 1)}>A : {countA}</button>
      <button onClick={() => setCountB(countB + 1)}>B : {countB}</button>
    </div>
  );
};
```
이 코드는 제대로 작동하지 않습니다.<br /><br />우리의 `useState`는 오직 하나의 `stateValue` 변수만을 사용하기 때문에, 두 번째 `useState` 호출은 첫 번째 호출이 저장한 값을 그대로 덮어쓰거나 공유하게 됩니다.<br /><br />하지만 실제 리액트에서는 각 `useState`가 완벽하게 독립적인 상태를 가집니다.<br /><br />이를 어떻게 구현할 수 있을까요.<br /><br />정답은 바로 '배열'을 사용하는 것입니다.<br /><br />하나의 변수 대신, 상태 값들을 저장할 배열을 만듭니다.<br /><br />그리고 각 `useState` 호출의 순서를 기억할 '인덱스'를 사용합니다.<br /><br />컴포넌트가 렌더링될 때마다 `useState`는 항상 정해진 순서대로 호출된다는 사실을 이용하는 것입니다.<br /><br />

```javascript
let root;
let stateValues = [];
let callIndex = -1;

const render = () => {
  if (!root) {
    root = createRoot(document.getElementById("root"));
  }
  callIndex = -1; // 리렌더링 될 때마다 인덱스를 초기화
  root.render(<App />);
};

const useState = (initialValue) => {
  callIndex++; // useState 호출 시마다 인덱스 증가

  if (stateValues[callIndex] === undefined) {
    stateValues[callIndex] = initialValue;
  }

  const setValue = (newValue) => {
    stateValues[callIndex] = newValue;
    render();
  };

  return [stateValues[callIndex], setValue];
};

render();
```
이제 첫 번째 `useState`가 호출되면 `callIndex`는 0이 되고, `stateValues[0]`에 상태가 저장됩니다.<br /><br />두 번째 `useState`가 호출되면 `callIndex`는 1이 되고, `stateValues[1]`에 상태가 저장됩니다.<br /><br />리렌더링이 발생하면 `render` 함수에서 `callIndex`를 다시 -1로 초기화하기 때문에, 다음 렌더링 사이클에서도 `useState`는 순서대로 0번, 1번 인덱스에 정확하게 접근할 수 있습니다.<br /><br />

<h2>클로저와 훅의 규칙 숨겨진 비밀</h2>
하지만 위 코드에는 아직 치명적인 버그가 하나 숨어있습니다.<br /><br />`setValue` 함수를 보시죠.<br /><br />

```javascript
  const setValue = (newValue) => {
    stateValues[callIndex] = newValue;
    render();
  };
```
이 함수가 상태를 변경할 때 사용하는 `callIndex`는, `useState` 함수가 모두 실행된 후의 '최종값'입니다.<br /><br />우리 예제에서는 1이겠죠.<br /><br />따라서 `setCountA`를 호출하든, `setCountB`를 호출하든 항상 `stateValues[1]`의 값만 변경하게 됩니다.<br /><br />`setCountA`는 0번 인덱스를, `setCountB`는 1번 인덱스를 정확히 기억하고 찾아가야 합니다.<br /><br />바로 이 문제를 해결하는 열쇠가 자바스크립트의 '클로저(Closure)'입니다.<br /><br />클로저는 '함수가 자신이 태어난 환경(스코프)을 기억하는 것'을 의미합니다.<br /><br />함수가 선언될 때의 주변 변수들을 마치 '기억의 가방'처럼 가지고 다니다가, 나중에 어디서 호출되든 그 기억 속 변수들을 사용할 수 있는 능력입니다.<br /><br />이 원리를 이용해 코드를 수정해 보겠습니다.<br /><br />

```javascript
const useState = (initialValue) => {
  callIndex++;

  const currentIndex = callIndex; // 호출 시점의 인덱스를 '가방'에 담을 준비

  if (stateValues[currentIndex] === undefined) {
    stateValues[currentIndex] = initialValue;
  }

  // setValue 함수는 선언될 때의 'currentIndex' 값을 '기억'합니다.
  const setValue = (newValue) => {
    stateValues[currentIndex] = newValue;
    render();
  };

  return [stateValues[currentIndex], setValue];
};
```
이제 `useState`가 처음 호출될 때 생성된 `setValue`(즉, `setCountA`)는 `currentIndex`가 `0`이었던 순간을 영원히 기억합니다.<br /><br />두 번째 호출로 생성된 `setValue`(즉, `setCountB`)는 `currentIndex`가 `1`이었던 순간을 기억합니다.<br /><br />덕분에 각 상태 변경 함수는 자신만의 고유한 인덱스를 정확히 찾아갈 수 있게 됩니다.<br /><br />바로 이 지점에서 우리는 '훅의 규칙'이 왜 필요한지 명확하게 이해할 수 있습니다.<br /><br />첫 번째 규칙, '훅은 최상위 레벨에서만 호출되어야 한다'.<br /><br />만약 훅을 조건문 안에서 호출하면 어떻게 될까요.<br /><br />

```jsx
// 절대 이렇게 사용하면 안 됩니다!
export const App = () => {
  const [countA, setCountA] = useState(1);

  let countB, setCountB;
  if (countA < 3) {
    [countB, setCountB] = useState(2);
  }
  // ...
};
```
`countA`가 3보다 작을 때는 `useState`가 두 번 호출되어 `callIndex`가 0, 1로 증가합니다.<br /><br />하지만 `countA`가 3이 되는 순간, `if`문이 실행되지 않아 `useState`는 한 번만 호출되고 `callIndex`는 0까지만 증가합니다.<br /><br />다음 렌더링부터는 `useState` 호출 순서가 완전히 엉망이 되어, 리액트는 어떤 상태가 어떤 `useState`에 해당하는지 전혀 알 수 없게 됩니다.<br /><br />이것이 바로 리액트가 훅의 '호출 순서'에 의존하기 때문에, 조건문이나 반복문 안에서 훅을 호출하는 것을 금지하는 이유입니다.<br /><br />

<h2>그래서 실제 리액트는 어떻게 다를까</h2>
우리가 만든 모델은 `useState`의 핵심 원리를 이해하는 데 큰 도움이 되지만, 실제 리액트의 구현과는 한 가지 중요한 차이가 있습니다.<br /><br />우리는 상태를 저장하기 위해 전역 변수인 `stateValues`와 `callIndex`를 사용했습니다.<br /><br />하지만 실제 리액트에서는 이렇게 허술하게 전역 공간을 오염시키지 않습니다.<br /><br />리액트 내부적으로, 각 컴포넌트는 '파이버(Fiber)'라는 자신만의 데이터 구조를 가지고 있습니다.<br /><br />리액트는 훅이 호출되면, 그 훅의 상태 정보를 해당 컴포넌트의 파이버 노드에 마치 '연결 리스트'처럼 순서대로 기록하고 저장합니다.<br /><br />이것이 바로 '훅의 규칙' 두 번째, '훅은 리액트 함수 컴포넌트 내에서만 호출되어야 한다'는 규칙이 존재하는 이유입니다.<br /><br />훅은 자신의 상태를 저장할 '소속 컴포넌트(파이버 노드)'가 반드시 필요하기 때문입니다.<br /><br />일반 자바스크립트 함수에는 이 파이버 노드가 없으므로 훅을 사용할 수 없는 것입니다.<br /><br />이 '순서에 기반한 연결 리스트' 원리는 `useState` 뿐만 아니라 `useEffect`, `useMemo`, `useRef` 등 모든 훅에 동일하게 적용됩니다.<br /><br />이 핵심 원리 하나를 이해하면, 리액트 훅 시스템 전체를 꿰뚫어 볼 수 있는 시야를 갖게 되는 셈입니다.<br /><br />이제 여러분은 `useState`가 더 이상 마법처럼 느껴지지 않을 것입니다.<br /><br />그것은 배열과 인덱스, 그리고 클로저라는 잘 알려진 프로그래밍 개념들 위에 세워진, 매우 영리하고 논리적인 시스템입니다.<br /><br />그리고 훅의 규칙들은 우리를 괴롭히기 위한 제약이 아니라, 이 시스템이 안정적으로 작동하기 위한 최소한의 약속이라는 사실도 깨달으셨을 겁니다.<br /><br />이 깊은 이해를 바탕으로, 이제 여러분은 더 큰 자신감을 가지고 리액트 코드를 작성할 수 있을 것입니다.<br /><br />

