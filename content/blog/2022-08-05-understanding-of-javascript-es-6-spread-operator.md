---
slug: 2022-08-05-understanding-of-javascript-es-6-spread-operator
title: 자바스크립트 ES6 - 스프레드 연산자(spread operator) 이해
date: 2022-08-05 00:53:42.424000+00:00
summary: 자바스크립트 ES6에 새로 도입된 스프레드 연산자(spread operator) 이해하기
tags: ["javascript", "es6", "spread operator"]
contributors: []
draft: false
---

![mycodings.fly.dev-understanding-of-javascript-es-6-spread-operator](https://blogger.googleusercontent.com/img/a/AVvXsEgJaHZo3k4PSGs020LUbWkfxq-RFDJVUoQl2yrYffa32IAUGc79ltM2BMsVgr-wwuFhoKYyF9yHKFwaZ-z2U8K0N4dG-Cc_ekp-wI7vAIASM_JdtLsTlhkot0VdupLEvhWWvuZti1exHE1QqydXNdP6oxkWN9dDfkkQFUlBXEo0nl-czjwTD7SmQ4L3=s16000)

안녕하세요?

오늘은 자바스크립트 ES6에 새로 소개된 스프레드 연산자(spread operator)에 대해 알아보겠습니다.

모양새는 아래와 같이 세 개의 점으로 구성되는데요.

자바스크립트 객체 중에 반복 가능한 Array, Map, Set, String 등의 원소를 나열(spread out)할 수 기능입니다.

```js
const odd = [1,3,5];
const combined = [2,4,6, ...odd];
console.log(combined);

// [ 2, 4, 6, 1, 3, 5 ]
```

위 코드에서 odd 배열 앞에 (...)처럼 세 개의 점을 이용한 문법이 바로 스프레드 연산자입니다.

...odd처럼 스프레드 연산자를 쓰면 odd 배열의 원소를 풀어쓰게(unpack) 되는 건데요.

여기서 중요한 게 나머지 매개변수(rest parameter)와 형태가 비슷해서 혼동할 수 있으니 참고 바랍니다.

```js
// Rest parameter 예제
function f(a, b, ...args) {
	console.log(args);
}

f(1, 2, 3, 4, 5);

// [ 3, 4, 5 ]
```

위 코드에서 나머지 매개변수(...)가 f 함수에 전달된 배열의 [3,4,5]를 받아서 처리하고 있는데요.

그래서 (...) 형태의 ES6 문법은 스프레드 연산자와 나머지 매개변수 둘 중에 하나라고 생각하시면 됩니다.

--- 

## 두 문법의 가장 기본이 되는 차이점은?

1. 스프레드 연산자(spread operator)는 반복 가능한(iterable) 객체의 원소를 풀어 제끼(unpack)는데요.

2. 나머지 매개변수(rest parameter)는 반대로 원소를 배열에 모아두는(pack) 역할입니다.

3. 나머지 매개변수(rest parameter)는 함수의 인자에서 꼭 마지막에 위치해야 하지만,

4. 스프레드 연산자(spread operator)는 그 위치가 어디든 상관없습니다.

```js
const odd = [1,3,5];
const combined = [...odd, 2,4,6];
const combined2 = [2,...odd, 4,6];
console.log(combined);
// [ 1, 3, 5, 2, 4, 6 ]

console.log(combined2);
// [ 2, 1, 3, 5, 4, 6 ]
```

* ES2018에서는 스프레드 연산자(spread operator)가 객체에도 적용이 확대되었습니다.

---

## 스프레드 연산자(spread operator) 활용 1

본격적은 스프레드 연산자 활용 예제를 볼까요?

일단 다음과 같은 함수 compare()가 있다고 합시다.

```js
function compare(a, b) {
    return a - b;
}
```

ES5에서는 배열에 있는 두 개의 숫자를 compare() 함수를 통해서 비교하려면 apply 메서드를 써야 했는데요.

```js
let result = compare.apply(null, [1, 2]);
console.log(result); // -1
```

ES6에서는 그냥 스프레드 연산자를 통해 아래와 같이 간단하게 compare() 함수에 집어넣으면 됩니다.

```js
let result = compare(...[1, 2]);
// 스프레드 연산자가 배열 [1,2]를 unpack 하기 때문에,
// compare() 함수에서 a가 1, b가 2로 할당됩니다.
console.log(result); // -1
```

## 스프레드 연산자(spread operator) 활용 2

배열의 push() 메서드를 쓰는 방식에서 ES5와 ES6는 차이가 큽니다.

```js
let rivers = ['Nile', 'Ganges', 'Yangte'];
let moreRivers = ['Danube', 'Amazon'];

[].push.apply(rivers, moreRivers);
console.log(rivers);
```
~[mycodings.fly.dev-understanding-of-javascript-es-6-spread-operator](https://blogger.googleusercontent.com/img/a/AVvXsEjlAauaJDFrCguHg0Cl2RITErYeGCWgMlg2ZdsF6kerC-mwRjcwX0nY3_S8gRanjgk7uCWprA5lOhX7uiKj4SXIcS58J-F0YImLfm_c8RaGYMjq9o8j5i9bRSr6ROcgLf4nR0Ugy80oTxVssU_9YF9udx5vEGbUiqboBye9Nu4VVXeouqgVoLrk5Ka6=s16000)

ES5에서의 방법은 뭔가 이해가 어려운데요.

아래 코드의 ES6 방법을 보십시오.

```js
let rivers = ['Nile', 'Ganges', 'Yangte'];
let moreRivers = ['Danube', 'Amazon'];
rivers.push(...moreRivers);
console.log(rivers);
```

![mycodings.fly.dev-understanding-of-javascript-es-6-spread-operator](https://blogger.googleusercontent.com/img/a/AVvXsEjccuBDQkOcVkUNBAHEQ9hJ4mYWnDzJYspfQUxiohNsX3cj1qZggf7c6Iooa6-qAjhZ1WE2BidNsnqv_VBBTLrlclJE2ndC-K2dM8jiIR0bZ3AeaQANhswyXnFLN6HFJG7xe2iDTxyQ7DdWPBtMxh0RcePqQuYx_m4jogd_Zd6h8-T9sZsibhy7TCiA=s16000)

어떤가요?

스프레드 연산자가 좀 더 깔끔하지 않나요?

---

## 배열(Array)과 스프레드 연산자(spread operator) 활용

1. 배열 초기화 생성

스프레드 연산자는 배열을 일정 값으로 초기화할 때 다른 배열을 값을 중간에 삽입할 때 쉽게 해 줍니다.

```js
let initialChars = ['A', 'B'];
let chars = [...initialChars, 'C', 'D'];
console.log(chars); // ["A", "B", "C", "D"]
```

2. 배열 합치기

두 개의 배열을 합칠 때도 쉽게 쓸 수 있습니다.

```js
let numbers = [1, 2];
let moreNumbers = [3, 4];
let allNumbers = [...numbers, ...moreNumbers];
console.log(allNumbers); // [1, 2, 3, 4]
```

3. 배열 복사

배열의 인스턴스를 복사할 때도 스프레드 연산자를 사용할 수 있습니다.

```js
let scores = [80, 70, 90];
let copiedScores = [...scores];
console.log(copiedScores); // [80, 70, 90]
```
* 스프레드 연산자를 이용한 배열 복사는 "shallow copy"입니다. 주의 바랍니다.

---

## 문자열과 스프레드 연산자

String(문자열)도 스프레드 연산자의 효과에 적용되는데요.

```js
let chars = ['A', ...'BC', 'D'];
console.log(chars); // ["A", "B", "C", "D"]
```

위 코드에서 보시면 'BC' 문자열을 스프레드 연산자를 통해 "B", "C"로 분해했습니다.

지금까지 자바스크립트 ES6 스프레드 연산자에 대해 알아봤습니다.

그럼.

