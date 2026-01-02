---
slug: 2026-01-01-react-hooks-under-the-hood-implementation
title: "React Hooks, 직접 구현하며 파헤치는 내부 원리"
summary: "useState와 useEffect가 마법처럼 느껴지시나요 클로저와 스코프부터 시작해 훅의 동작 원리를 직접 코드로 구현해보며 완벽하게 이해해 봅니다"
date: 2026-01-01T10:53:14.435Z
draft: false
weight: 50
tags: ["React", "Hooks", "useState", "useEffect", "Closure", "JavaScript", "javascript", "react", "hooks", "훅", "리액트", "클로저"]
contributors: []
---
![React Hooks, 직접 구현하며 파헤치는 내부 원리](https://blogger.googleusercontent.com/img/a/AVvXsEis6ZLnoJ3K46i8E8zFyqKutXtgiVGM0GOGjyqIDtbROlFAw-NiFqoaa56bbCwKtXkIbZiTYz41Q1CZWq4s_vpdBYkwqIkHP85Geyx8rVWJxNPHqYuEcUncuu0T66DiRfLktvAHLaYxoFZEh_20pDBvv2uYIyKYYCfm8JQN7DdijdwRHg-moHei1g4_MaI=s16000)

---

- [들어가며](#들어가며)
- [제1장 자바스크립트의 스코프 정복하기](#제1장-자바스크립트의-스코프-정복하기)
  - [1-1 스코프란 무엇인가?](#1-1-스코프란-무엇인가)
  - [1-2 글로벌 스코프와 로컬 스코프](#1-2-글로벌-스코프와-로컬-스코프)
  - [1-3 렉시컬 스코프 (정적 스코프)](#1-3-렉시컬-스코프-정적-스코프)
  - [1-4 스코프 체인](#1-4-스코프-체인)
- [제2장 클로저](#제2장-클로저)
  - [2-1 클로저란 무엇인가?](#2-1-클로저란-무엇인가)
  - [2-2 왜 변수가 살아있는가?](#2-2-왜-변수가-살아있는가)
  - [2-3 클로저의 실전 활용](#2-3-클로저의-실전-활용)
- [제3장 useState의 메커니즘](#제3장-usestate의-메커니즘)
  - [3-1 함수 컴포넌트의 치명적 단점](#3-1-함수-컴포넌트의-치명적-단점)
  - [3-2 상태를 '바깥'에 저장하라](#3-2-상태를-바깥에-저장하라)
  - [3-3 최소한의 useState 구현](#3-3-최소한의-usestate-구현)
  - [3-4 여러 개의 useState 처리하기 (배열과 인덱스)](#3-4-여러-개의-usestate-처리하기-배열과-인덱스)
  - [3-5 왜 Hooks 호출 순서가 중요한가?](#3-5-왜-hooks-호출-순서가-중요한가)
  - [3-6 실제 React와의 차이점 (심화)](#3-6-실제-react와의-차이점-심화)
- [제4장 useEffect의 작동 원리](#제4장-useeffect의-작동-원리)
  - [4-1 부수 효과(Side Effect)란](#4-1-부수-효과side-effect란)
  - [4-2 의존성 배열의 비밀](#4-2-의존성-배열의-비밀)
  - [4-3 useEffect 구현해보기](#4-3-useeffect-구현해보기)
  - [4-4 빈 배열 \[\]의 의미](#4-4-빈-배열-의-의미)
  - [4-5 클린업(Cleanup) 함수](#4-5-클린업cleanup-함수)
  - [4-6 useMemo와 useCallback도 한통속](#4-6-usememo와-usecallback도-한통속)
- [제5장 커스텀 Hook은 그저 함수일 뿐](#제5장-커스텀-hook은-그저-함수일-뿐)
  - [5-1 로직의 재사용](#5-1-로직의-재사용)
  - [5-2 왜 유용한가?](#5-2-왜-유용한가)
- [마치며](#마치며)

---

## 들어가며

이 글의 목표는 명확합니다.

React를 다루다 보면 `useState`나 `useEffect`를 "이렇게 쓰면 돌아간다"는 식으로 외워서 사용하는 경우가 참 많은데요.

```javascript
const [count, setCount] = useState(0);

useEffect(() => {
  console.log(count);
}, [count]);
```
이 코드는 문제없이 작동합니다.

하지만 "왜 작동하는지" 설명할 수 있으신가요.


왜 `useState`는 하필 배열을 반환하는지.

왜 `setCount`를 호출하면 화면이 다시 그려지는지.

왜 `useEffect`의 의존성 배열에 값을 넣으면 그 값이 변할 때만 실행되는지.

왜 조건문 안에서는 Hooks를 호출하면 안 된다고 하는지.


이 글에서는 이런 물음표들을 느낌표로 바꾸기 위해, Hooks의 구조를 바닥부터 직접 구현해보며 배워볼 생각입니다.

끝까지 따라오신다면 Hooks가 신비한 '마법'이 아니라, 자바스크립트라는 언어의 기초 위에 세워진 논리적인 건축물임을 깨닫게 되실 겁니다.

## 제1장 자바스크립트의 스코프 정복하기

Hooks를 정복하려면 먼저 자바스크립트의 '스코프(Scope)'라는 녀석을 확실히 이해해야 하는데요.

스코프는 Hooks가 작동하는 무대이자 토대이기 때문입니다.


### 1-1 스코프란 무엇인가?

프로그램 안에서 변수를 사용할 때, 자바스크립트 엔진은 "이 변수가 도대체 어디 있는 녀석인가"를 찾아내야 합니다.

이때 '변수를 찾는 범위'를 정해놓은 규칙이 바로 스코프입니다.


쉬운 예제부터 살펴볼까요.

```javascript
const message = "안녕하세요";

const greet = () => {
  console.log(message);
};

greet();  // "안녕하세요"
```
`greet` 함수 안에서 `message`를 쓰고 있습니다.

함수 내부에는 `message`가 없지만, 바깥에 정의된 것을 찾아내서 사용했네요.


그럼 이건 어떨까요.

```javascript
const message = "안녕하세요";

const greet = () => {
  const message = "반갑습니다";
  console.log(message);
};

greet();  // "반갑습니다"
```
이번에는 `greet` 함수 안에도 `message`가 있습니다.

이럴 땐 함수 내부에서 정의된 "반갑습니다"가 사용됩니다.


이것이 스코프의 기본 동작 원리입니다.

자바스크립트는 변수를 찾을 때 가장 먼저 '자기 자신의 스코프'를 뒤지고, 없으면 '바깥쪽 스코프'를 기웃거립니다.


### 1-2 글로벌 스코프와 로컬 스코프

스코프는 크게 두 가지로 나뉩니다.

글로벌 스코프는 프로그램 어디서든 접근할 수 있는 영역인데요.

함수 바깥에서 정의된 변수는 모두 여기에 속합니다.

```javascript
const globalVariable = "어디서든 접근 가능";

const func1 = () => {
  console.log(globalVariable);  // 접근 가능
};

const func2 = () => {
  console.log(globalVariable);  // 접근 가능
};
```
반면 로컬 스코프는 특정 구역 내에서만 접근할 수 있는 영역입니다.

함수 안에서 만든 변수는 그 함수의 로컬 스코프에 갇히게 됩니다.

```javascript
const outer = () => {
  const localVariable = "이 안에서만 접근 가능";
  console.log(localVariable);  // 접근 가능
};

outer();
console.log(localVariable);  // 에러 발생! 밖에서는 못 건드림
```
함수 내부의 변수는 밖에서 볼 수 없습니다.

이것은 변수를 외부로부터 '숨기기' 위한 아주 중요한 메커니즘입니다.


### 1-3 렉시컬 스코프 (정적 스코프)

여기가 정말 중요한 포인트인데요.

자바스크립트는 '렉시컬 스코프(Lexical Scope)'라는 룰을 따릅니다.

'렉시컬'이란 '어휘적', '글자 그대로의'라는 뜻을 가지고 있습니다.

즉, 변수의 유효 범위는 코드가 **어디서 실행되었느냐**가 아니라, 코드가 **어디에 적혀있느냐**에 따라 결정된다는 말입니다.


백문이 불여일견, 코드로 보시죠.

```javascript
const x = "글로벌";

const outer = () => {
  const x = "outer";

  const inner = () => {
    console.log(x);  // 여기서 x는 무엇일까요?
  };

  inner();
};

outer();  // "outer"
```
`inner` 함수 안에서 `x`를 찾습니다.

`inner` 안에는 `x`가 없으니 밖을 봐야 하는데, `inner`가 코드상으로 `outer` 함수 안에 적혀있으므로 `outer`의 `x`를 가져옵니다.


조금 더 헷갈리는 예제를 볼까요.

```javascript
const x = "글로벌";

const printX = () => {
  console.log(x);  // 이 함수는 글로벌 스코프에 적혀있음
};

const wrapper = () => {
  const x = "wrapper";
  printX();  // wrapper 안에서 호출함
};

wrapper();  // "글로벌"
```
`printX`는 `wrapper` 안에서 호출되었지만, 결과는 "글로벌"입니다.

왜냐하면 `printX`는 태생이 글로벌 스코프에 '적혀있는' 녀석이기 때문입니다.

자바스크립트는 변수를 찾을 때 "누가 나를 불렀지?"를 따지지 않고 "내 고향이 어디지?"를 따집니다.

이것이 렉시컬 스코프의 핵심입니다.


### 1-4 스코프 체인

변수를 찾을 때 자바스크립트는 "내 스코프 → 한 단계 위 스코프 → 더 위 스코프 → ... → 글로벌 스코프" 순서로 탐색을 이어갑니다.

이 연결고리를 '스코프 체인'이라고 부릅니다.


```javascript
const a = "글로벌";

const level1 = () => {
  const b = "level1";

  const level2 = () => {
    const c = "level2";

    const level3 = () => {
      console.log(a);  // 3단계 위에서 발견
      console.log(b);  // 2단계 위에서 발견
      console.log(c);  // 1단계 위에서 발견
    };

    level3();
  };

  level2();
};

level1();
```
`level3` 함수 입장에서 보면 스코프가 마치 러시아 인형(마트료시카)처럼 겹겹이 쌓여 있는 셈인데요.

`level3`에서 `a`를 찾기 위해 `level2`를 뒤지고, 없으면 `level1`을 뒤지고, 그래도 없으면 글로벌까지 올라가서 찾아냅니다.

중요한 건 이 체인이 코드를 작성하는 순간 이미 확정된다는 사실입니다.

실행 중에 변하는 게 아닙니다.


## 제2장 클로저

스코프를 알았으니, 이제 '클로저(Closure)'라는 산을 넘을 차례입니다.

클로저는 Hooks의 작동 원리를 이해하는 데 없어서는 안 될 핵심 열쇠입니다.


### 2-1 클로저란 무엇인가?

클로저는 함수가 자신의 바깥쪽 스코프에 있는 변수를 '기억'하고 있다가, 나중에라도 그 변수에 접근할 수 있게 해주는 마법 같은 성질입니다.


먼저 평범한 함수를 봅시다.

```javascript
const doSomething = () => {
  const localVar = "로컬 변수";
  console.log(localVar);
};

doSomething();  // "로컬 변수"
// 함수가 끝났으니 localVar는 이제 사라짐
```
보통 함수가 실행을 마치면 그 안에서 만든 변수는 메모리에서 깨끗이 지워집니다.


하지만 이런 경우는 어떨까요.

```javascript
const createGreeter = () => {
  const message = "안녕하세요";

  const greet = () => {
    console.log(message);
  };

  return greet;  // 안쪽 함수를 밖으로 내보냄
};

const myGreeter = createGreeter();
// createGreeter의 실행은 이미 끝났음

myGreeter();  // "안녕하세요"
```
`createGreeter`의 실행은 끝났습니다.

상식적으로 `message`라는 변수는 사라져야 맞습니다.

하지만 `myGreeter()`를 실행하면 여전히 `message`를 읽어옵니다.


이게 바로 클로저입니다.

`greet` 함수는 자신이 태어난 곳(`createGreeter`의 내부)의 환경을 배낭처럼 메고 나옵니다.

그래서 본가(상위 함수)가 문을 닫아도, 그 안의 세간살이(`message`)에는 여전히 접근할 수 있는 겁니다.


### 2-2 왜 변수가 살아있는가?

보통은 가비지 컬렉터(Garbage Collector)라는 청소부가 더 이상 안 쓰는 변수를 치워버리는데요.

클로저의 경우는 다릅니다.


```javascript
const createCounter = () => {
  let count = 0;  // 이 녀석은 안 죽음

  const increment = () => {
    count = count + 1;
    return count;
  };

  return increment;
};

const counter = createCounter();
```
여기서 `createCounter`가 실행되면 `count` 변수가 생기고 `increment` 함수가 만들어집니다.

`increment` 함수는 태생적으로 `count`를 참조하고 있습니다.

그리고 이 `increment` 함수가 밖으로 반환되어 `counter`라는 변수에 담겼죠.

자바스크립트 엔진 입장에서 보면

> "어? `counter`가 `increment`를 쓰고 있고, `increment`는 `count`를 쓰고 있네? 그럼 `count`를 지우면 안 되겠구나"라고 판단합니다.

그래서 `count`는 메모리에 계속 살아남습니다.

```javascript
console.log(counter());  // 1
console.log(counter());  // 2
console.log(counter());  // 3
```
`counter()`를 부를 때마다 `count` 값이 쑥쑥 자라납니다.

밖에서는 `count`를 직접 건드릴 수 없지만, 오직 `counter` 함수를 통해서만 조작할 수 있게 된 거죠.


### 2-3 클로저의 실전 활용

클로저가 어디에 쓰이는지 예제를 좀 더 볼까요.


**예제 1: 프라이빗(Private) 상태 만들기**

자바스크립트 클래스의 `#` 문법 없이도, 함수만으로 정보를 은닉할 수 있습니다.

>> 자바스크립트의 # 문법은 클래스 내부의 private(비공개) 필드와 메서드를 선언하는 최신 문법으로, 인스턴스 외부에서 접근할 수 없게 하여 데이터 은닉을 구현하는 데 사용됩니다. 클래스 선언 시 class MyClass { #privateField; #privateMethod() { ... } }와 같이 #을 필드 이름이나 메서드 이름 앞에 붙이면 되며, 이는 ES2022부터 도입되어 프로토타입 기반의 JS에서 객체 지향의 캡슐화 기능을 강화한 것이 특징입니다.

```javascript
const createBankAccount = (initialBalance) => {
  let balance = initialBalance;  // 외부 접근 불가

  const deposit = (amount) => {
    balance = balance + amount;
    return balance;
  };

  const withdraw = (amount) => {
    if (amount > balance) {
      return "잔액 부족";
    }
    balance = balance - amount;
    return balance;
  };

  const getBalance = () => {
    return balance;
  };

  return { deposit, withdraw, getBalance };
};

const account = createBankAccount(1000);
console.log(account.getBalance());  // 1000
console.log(account.deposit(500));  // 1500
// account.balance 로는 접근 불가능
```
`balance`는 철저하게 보호됩니다.

오직 허락된 함수들(`deposit`, `withdraw`, `getBalance`)을 통해서만 접근할 수 있죠.


**예제 2: 함수 공장 (Factory)**

특정 값을 기억하는 함수를 찍어낼 수도 있습니다.

```javascript
const createMultiplier = (factor) => {
  const multiply = (number) => {
    return number * factor;  // factor를 기억함
  };

  return multiply;
};

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5));  // 10
console.log(triple(5));  // 15
```
`double` 함수는 2를, `triple` 함수는 3을 가슴속에 품고 살아갑니다.


## 제3장 useState의 메커니즘

스코프와 클로저를 장착했으니, 이제 진짜 React Hooks의 세계로 들어갑니다.

첫 타자는 `useState`입니다.


### 3-1 함수 컴포넌트의 치명적 단점

React의 함수 컴포넌트는 렌더링 될 때마다 함수가 처음부터 다시 실행됩니다.

이게 무슨 말이냐면, 변수가 초기화된다는 뜻입니다.


```javascript
const Counter = () => {
  let count = 0;

  const handleClick = () => {
    count = count + 1;
    console.log(count);
  };

  return (
    <button onClick={handleClick}>
      카운트: {count}
    </button>
  );
};
```
이 코드는 제대로 동작하지 않습니다.

버튼을 누르면 `count`는 1이 되지만, 화면을 다시 그리기 위해 `Counter` 함수가 재실행되면 `let count = 0`이 또 실행되어서 다시 0으로 돌아가거든요.

React 입장에서는 "어? 그냥 0인데?" 하고 화면을 갱신하지 않을 수도 있습니다.


함수 컴포넌트에서 상태를 가지려면 두 가지 문제를 해결해야 합니다.

1. 렌더링이 다시 일어나도 값이 사라지지 않고 유지되어야 한다.

2. 값이 바뀌면 React에게 "화면 다시 그려줘"라고 신호를 보내야 한다.


### 3-2 상태를 '바깥'에 저장하라

해답은 상태를 함수 컴포넌트의 '바깥' 어딘가에 두는 것입니다.

그리고 클로저를 써서 그 바깥의 값을 주무르는 거죠.


```javascript
// 컴포넌트의 '바깥'에 금고를 만듭니다
let state;

const useState = (initialValue) => {
  // 금고가 비었으면 초기값으로 채움
  if (state === undefined) {
    state = initialValue;
  }

  const setState = (newValue) => {
    state = newValue;
    render();  // 화면 다시 그려! (가상의 함수)
  };

  return [state, setState];
};

const render = () => {
  console.log("--- 렌더링 ---");
  Counter();
};

const Counter = () => {
  const [count, setCount] = useState(0);
  console.log("count:", count);
  // 실제로는 여기서 JSX를 리턴하겠죠
};
```
이 코드를 머릿속으로 돌려볼까요.


첫 렌더링 때 `Counter()`가 실행되면 `useState(0)`이 호출됩니다.

`state`는 비어있으니 0이 들어가고, `[0, setState]`를 반환합니다.

나중에 누군가 `setCount(1)`을 부르면, `state` 변수가 1로 바뀌고 `render()`가 호출됩니다.

그럼 `Counter()`가 다시 실행되는데, 이때 `useState(0)`이 또 불리겠죠.

하지만 이번엔 `state`에 1이 들어있으니 초기화 코드는 건너뛰고, `[1, setState]`를 반환하게 됩니다.


핵심은 `state` 변수가 `useState` 함수보다 더 바깥에 있다는 점입니다.

그래서 `Counter` 함수가 몇 번을 죽었다 깨어나도 `state` 값은 끈질기게 살아남는 것입니다.


### 3-3 최소한의 useState 구현

위의 개념을 바탕으로 아주 간단한 React 흉내를 내보겠습니다.


```javascript
const MyReact = (() => {
  let state;

  const useState = (initialValue) => {
    if (state === undefined) {
      state = initialValue;
    }

    const setState = (newValue) => {
      state = newValue;
      render();
    };

    return [state, setState];
  };

  const render = () => {
    App();
  };

  return { useState, render };
})();

const App = () => {
  const [count, setCount] = MyReact.useState(0);
  console.log("count:", count);

  return { setCount };
};
```
잘 돌아갑니다.

하지만 치명적인 문제가 하나 있습니다.

`useState`를 딱 한 번밖에 못 쓴다는 겁니다.

만약 `name`도 관리하고 `age`도 관리하고 싶다면 어떻게 할까요.

변수 `state` 하나로는 턱없이 부족합니다.


### 3-4 여러 개의 useState 처리하기 (배열과 인덱스)

React는 이 문제를 해결하기 위해 상태들을 '배열'에 담아서 관리합니다.


```javascript
const MyReact = (() => {
  let hooks = [];        // 상태들을 담을 배열
  let currentIndex = 0;  // 지금 몇 번째 훅을 처리 중인지

  const useState = (initialValue) => {
    const index = currentIndex;  // 현재 순번을 기억해둠 (클로저)

    // 처음 부르는 거라면 초기값 설정
    if (hooks[index] === undefined) {
      hooks[index] = initialValue;
    }

    const setState = (newValue) => {
      hooks[index] = newValue;  // 기억해둔 순번의 값을 바꿈
      render();
    };

    currentIndex++;  // 다음 훅을 위해 번호표 증가
    return [hooks[index], setState];
  };

  const render = () => {
    currentIndex = 0;  // 렌더링 시작할 땐 번호표를 0번으로 리셋
    App();
  };

  return { useState, render };
})();
```
이 로직을 자세히 살펴볼까요.


```javascript
const App = () => {
  const [name, setName] = MyReact.useState("철수");  // 0번
  const [age, setAge] = MyReact.useState(20);        // 1번
  console.log(name, age);
};
```

첫 렌더링이 시작되면 `currentIndex`는 0입니다.

`useState("철수")`가 불리면 `hooks[0]`에 "철수"를 넣고, `currentIndex`를 1로 올립니다.

그다음 `useState(20)`이 불리면 `hooks[1]`에 20을 넣고, `currentIndex`를 2로 올립니다.

결과적으로 `hooks` 배열은 `["철수", 20]`이 됩니다.


나중에 `setName("영희")`를 호출하면 `hooks[0]`이 "영희"로 바뀝니다.

그리고 다시 렌더링(`render`)이 시작되면 `currentIndex`는 다시 0으로 초기화됩니다.

`App`이 다시 실행되면서 `useState("철수")`를 또 부르겠지만, `hooks[0]`에는 이미 "영희"가 들어있으니 그 값을 그대로 반환합니다.

순서대로 착착 값을 꺼내주는 것이죠.


**여기서 중요한 포인트:**

1. 각 `useState`는 `hooks` 배열의 자기 자리를 기억한다.

2. `setState`는 클로저 덕분에 자신이 몇 번째 녀석인지 알고 있다.

3. 렌더링 때마다 `currentIndex`는 0부터 다시 시작해서 순서대로 값을 매칭한다.


### 3-5 왜 Hooks 호출 순서가 중요한가?

React 문서를 보면 "Hooks는 조건문이나 반복문 안에서 쓰지 마세요"라는 엄격한 규칙이 있습니다.

왜 그럴까요?

방금 구현한 배열과 인덱스 시스템을 보면 답이 나옵니다.


우리의 구현체는 오직 **호출되는 순서**에 의존해서 상태를 구분합니다.

변수 이름이 `name`인지 `age`인지는 중요하지 않습니다. 그냥 "첫 번째 훅", "두 번째 훅"일 뿐입니다.


만약 조건문 안에 `useState`를 넣었다고 칩시다.

```javascript
const App = () => {
  const [name, setName] = useState("철수"); // 0번

  if (name === "철수") {
    // 조건부 훅! (절대 금지)
    const [nickname, setNickname] = useState("척척박사"); // 1번
  }

  const [age, setAge] = useState(20); // 원래는 2번이어야 하는데...
};
```
첫 렌더링 때는 `hooks` 배열이 `["철수", "척척박사", 20]`으로 잘 만들어집니다.

그런데 `setName("영희")`를 해서 이름이 바뀌었다고 해봅시다.


두 번째 렌더링 때는 `name`이 "영희"니까 `if`문 안으로 안 들어갑니다.

그럼 순서가 어떻게 될까요.

1. `useState("철수")` 호출 → 0번 인덱스 ("영희") 가져옴. OK.

2. `if`문 건너뜀.

3. `useState(20)` 호출 → 원래는 2번이어야 하는데, 순서상 두 번째니까 1번 인덱스를 참조함.


어라? 1번 인덱스에는 "척척박사"가 들어있습니다.

`age` 변수에 숫자 20 대신 "척척박사"라는 문자열이 들어가 버립니다.

데이터가 완전히 꼬여버리는 거죠.

이것이 React가 "Hooks의 순서를 지켜라"라고 신신당부하는 이유입니다.


### 3-6 실제 React와의 차이점 (심화)

우리가 만든 건 교육용 장난감이고, 실제 React는 훨씬 복잡합니다.


1. **렌더링 방식:** 우리는 `setState` 안에서 바로 `render()`를 불렀지만, 실제 React는 변경 사항을 큐(Queue)에 쌓아두고 스케줄러를 통해 비동기적으로 처리합니다.

2. **배치 처리(Batching):** `setState`를 연달아 세 번 호출해도 우리는 세 번 렌더링하겠지만, React는 똑똑하게 이걸 하나로 뭉쳐서 딱 한 번만 렌더링합니다.

3. **Fiber 아키텍처:** 우리는 단순 배열(`[]`)을 썼지만, 실제로는 'Fiber'라는 연결 리스트(Linked List) 구조를 사용합니다. 각 컴포넌트 정보와 훅의 상태가 이 노드들에 저장됩니다.


## 제4장 useEffect의 작동 원리

`useState`를 정복했으니 `useEffect`는 식은 죽 먹기입니다.

이 녀석도 똑같이 배열과 인덱스를 씁니다.


### 4-1 부수 효과(Side Effect)란

데이터 가져오기(API), 돔(DOM) 직접 건드리기, 타이머 설정하기...

이런 것들을 '부수 효과'라고 합니다.

화면을 그리는 계산 과정 외에 부수적으로 일어나는 일들이라는 뜻이죠.

`useEffect`는 이런 일들을 처리하는 훅입니다.


### 4-2 의존성 배열의 비밀

`useEffect`의 두 번째 인자인 의존성 배열(`deps`)은 "이 값이 변할 때만 실행해라"라는 조건입니다.

`[count]`라고 쓰면 `count`가 변할 때만 실행되고, 빈 배열 `[]`을 쓰면 처음에 딱 한 번만 실행됩니다.


### 4-3 useEffect 구현해보기

```javascript
const MyReact = (() => {
  let hooks = [];
  let currentIndex = 0;

  // ... useState 코드는 생략 ...

  const useEffect = (callback, deps) => {
    const index = currentIndex;
    const prevDeps = hooks[index]; // 저번에 저장해둔 의존성 배열

    let shouldRun = true;

    // 저번 기록이 있다면(첫 렌더링이 아니라면) 비교 시작
    if (prevDeps) {
      // 배열 안에 하나라도 다른 게 있는지 확인
      shouldRun = deps.some((dep, i) => dep !== prevDeps[i]);
    }

    if (shouldRun) {
      callback(); // 다르다면 실행!
    }

    // 이번 의존성 배열을 저장해둠
    hooks[index] = deps;
    currentIndex++;
  };

  return { useState, useEffect, render };
})();
```
핵심은 `deps.some(...)` 부분입니다.

이전 배열(`prevDeps`)과 이번 배열(`deps`)의 요소를 하나하나 비교해서, **단 하나라도 다르면** `true`가 되어 콜백을 실행합니다.


### 4-4 빈 배열 []의 의미

만약 빈 배열 `[]`을 넣으면 어떻게 될까요.

첫 렌더링 때는 `prevDeps`가 없으니 무조건 실행됩니다.

그리고 `hooks[index]`에 `[]`가 저장되겠죠.


두 번째 렌더링부터는 `prevDeps`가 `[]`이고, 새로운 `deps`도 `[]`입니다.

빈 배열끼리 비교하면 "다른 요소"가 있을 리가 없죠.

그래서 `some` 함수는 항상 `false`를 뱉고, 콜백은 절대 실행되지 않습니다.

그래서 `[]`를 넣으면 "마운트 될 때 딱 한 번" 실행되는 효과가 나는 것입니다.


### 4-5 클린업(Cleanup) 함수

`useEffect`에서 함수를 리턴하면 그게 바로 정리(Cleanup) 함수가 되는데요.

이벤트 리스너를 붙였다가 떼거나, 타이머를 해제할 때 씁니다.

이걸 구현하려면, `useEffect`가 실행되기 전에 "저번에 저장해둔 클린업 함수가 있나?" 확인하고 있다면 실행해주면 됩니다.

메커니즘은 동일합니다.


### 4-6 useMemo와 useCallback도 한통속

`useMemo`는 계산 결과를 저장하고, `useCallback`은 함수 자체를 저장합니다.

하지만 내부 원리는 `useEffect`와 판박이입니다.

의존성 배열을 비교하고, 바뀌었으면 새로 계산해서 저장하고, 안 바뀌었으면 저장해둔 걸 그대로 리턴하는 식입니다.

결국 Hooks는 모두 **"순서대로 저장하고, 비교해서 꺼내 쓰는"** 같은 철학을 공유하고 있습니다.


## 제5장 커스텀 Hook은 그저 함수일 뿐

마지막으로 커스텀 Hook에 대해 이야기해 봅시다.

거창한 이름이 붙어있지만, 사실 이건 그냥 **Hooks를 사용하는 함수**일 뿐입니다.


### 5-1 로직의 재사용

```javascript
const useCounter = (initialValue = 0) => {
  const [count, setCount] = useState(initialValue);
  const increment = () => setCount(count + 1);
  return { count, increment };
};
```
이게 커스텀 Hook의 전부입니다.

특별한 내부 기능이 있는 게 아니라, `useState`나 `useEffect` 같은 조각들을 조합해서 나만의 로직 뭉치를 만든 것입니다.


### 5-2 왜 유용한가?

API 호출 로직을 생각해 봅시다.

로딩 상태(`loading`), 데이터(`data`), 에러(`error`)를 매번 컴포넌트마다 따로 만들면 코드가 지저분해지겠죠.

이걸 `useFetch`라는 함수 하나로 묶어서 꺼내 쓰면, 컴포넌트 코드가 획기적으로 줄어듭니다.

이것이 바로 커스텀 Hook의 존재 이유입니다.


## 마치며

지금까지 Hooks의 내부를 직접 뜯어보고 조립해 보았는데요.

정리하자면 이렇습니다.


1. **상태는 배열에 산다:** Hooks의 데이터는 `hooks = []`라는 배열에 차곡차곡 쌓입니다.

2. **순서가 곧 신분증이다:** Hooks는 호출된 순서(인덱스)로 자신을 식별합니다. 그래서 조건문이나 반복문에서 함부로 부르면 안 됩니다.

3. **클로저가 기억한다:** 함수가 끝나도 변수가 살아있는 건 클로저 덕분입니다.


이제 `useState`를 쓸 때마다 배열의 인덱스가 머릿속에 그려지시나요.

Hooks는 마법이 아닙니다.

철저하게 계산된 자바스크립트 코드 덩어리일 뿐입니다.

이 원리를 이해하고 나면, 훅을 사용하다 마주치는 기괴한 버그들도 더 이상 두렵지 않을 것입니다.

