---
slug: 2022-08-04-understanding-javascript-es-6-destructuring-of-array
title: 자바스크립트 ES6 - 배열의 디스트럭쳐링(구조 분해 할당)
date: 2022-08-04 07:58:46.504000+00:00
summary: 자바스크립트 ES6 강좌 - 배열의 디스트럭쳐링(destructuring - 구조 분해 할당)
tags: ["javascript", "tutorial", "es6", "destructuring", "array"]
contributors: []
draft: false
---

![mycodings.fly.dev-destructuring-of-array-in-es6-javascript](https://blogger.googleusercontent.com/img/a/AVvXsEjrn2lGsq7w2ZADFBh-Vv6Y8aiH-Pld8hVbqiZ0luMao_r6_3PzTvtm2e8KDJ3872rE683lBZoKjZDqQuHreosGWSeAJwdGFF06Oi8nyJBhDdyFERDHsNoI8-V5dkFC3oReAOAfAtHExTKtArQpjswFrlNlLDnYcSagXIkRWHtNAEb4YYF5PKa6WX30=s16000)

안녕하세요?

오늘은 ES6의 가장 중요한 기능 중 하나인 디스트럭쳐링(Destructuring)에 대해 알아보겠습니다.

디스트럭쳐링은 우리 말로는 [구조 분해 할당](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)이라고 이름 지어져 있는데요.

쉽게 이해하면 객체나 배열의 각 엘러먼트들을 각각의 변수로 할당받는 트릭입니다.

---

## 배열의 디스트럭쳐링(destructuring)

예를 들면서 설명해 보겠습니다.

만약에 여러분이 배열을 리턴하는 함수가 있고 리턴된 배열에서 각각의 값을 변수에 할당해야 한다고 가정하면,

ES5까지에서는 다음과 같은 방법을 써야만 했었습니다.

```js
function getResults() {
  return [1, 2, 3]
}

let results = getResults()

let x = results[0],
  y = results[1],
  z = results[2]
```

배열의 각 원소 위치를 수작업으로 변수에 할당했는데요.

ES6에서는 좀 더 간단하게 배열을 디스트럭쳐링 할 수 있습니다.

```js
function getResults() {
  return [1, 2, 3]
}

let [x, y, z] = getResults()

console.log(x) // 1
console.log(y) // 2
console.log(z) // 3
```

배열 디스트럭쳐링에 쓰인 `[x, y, z]` 문법에서 보듯이 차례대로 x, y, z가 getResults()가 리턴하는 배열의 첫 번째, 두 번째, 세 번째 값을 가지게 됩니다.

배열 디스트럭쳐링에 쓰인 `[]` 문법은 얼핏 보면 배열 선언에 쓰이는 `[]`이라고 생각할 수 있는데 다른 의미이니 유의 바랍니다.

만약에 우리가 위에서 예로 들었던 getResults() 함수가 2개의 원소가 있는 배열을 리턴한다면 어떻게 될까요?

배열 디스트럭쳐링에 매칭 안 되는 변수는 아래와 같이 'undefined'로 할당됩니다.

```js
function getResults() {
  return [1, 2]
}

let [x, y, z] = getResults()
console.log(x) // 1
console.log(y) // 2
console.log(z) // undefined
```

아까와는 반대로 반환되는 배열의 원소의 개수가 4개인데, 우리가 디스트럭쳐링으로 받는 변수가 3개이면 어떻게 될까요?

아래 예제처럼 3개까지만 변수에 할당이 되고 나머지는 버려집니다.

```js
function getResults() {
  return [1, 2, 3, 4]
}

let [x, y, z] = getResults()
console.log(x) // 1
console.log(y) // 2
console.log(z) // 3
```

반환되는 배열의 원소 "4"는 그냥 무시되었습니다.

그러면 위에서 "4"라는 배열의 원소가 무시되었는데요, 이것까지 커버하려면 어떻게 할까요?

바로 나머지 연산자(...)를 사용하면 됩니다.

```js
function getResults() {
  return [1, 2, 3, 4]
}

let [x, y, ...args] = getResults()
console.log(x) // 1
console.log(y) // 2
console.log(args) // [3, 4]
```

여기서 나머지 연산자(...)는 항상 또 다른 배열을 돌려보내니까 유의 바랍니다.

약간의 트릭이지만 배열 디스트럭쳐링은 변수 할당 시 사용할 수 있는데요.

단, 선언된 변수에만 해당합니다.

```js
let a, b
;[a, b] = [10, 20]
console.log(a) // 10
console.log(b) // 20
```
--- 

## 배열 디스트럭쳐링에서의 디폴트 값 설정

ES5에서의 아래와 같은 코드가 있다고 하면,

```js
function getResults() {
  return [10, 20]
}

let results = getResults()
let thirdResult = results[2] != undefined ? results[2] : 0

console.log(thirdItem) // 0
```

위와 같은 코드는 ES6의 배열 디스트럭쳐링에서는 간단히 아래와 같이 쓸 수 있습니다.

```js
let [, , thirdResult = 0] = getResults()

console.log(thirdResult) // 0
```

위 코드를 보시면 배열 디스트럭쳐링에서 빈 콤마 2개가 있고 세 번째 값을 변수 thirdResult에 넣으라는 얘기인데,

세번 째 값이 없기 때문에 디폴트 값으로 0을 자동으로 지정하라는 코드입니다.

즉, 배열 디스트럭쳐링에서의 디폴트 값은 배열을 구조 분해 할당했을 때 매칭 되는 값이 없어 최종적으로 undefined으로 설정될 때에만 디폴트 값이 적용됩니다.

다음 코드를 보시면 쉽게 이해할 수 있을 겁니다.

```js
let a, b;
[a = 1, b = 2] = [10]
console.log(a) // 10
console.log(b) // 2
```

즉, a는 배열 디스트럭쳐링에서 정상적으로 작동되어 10이라는 값을 할당받았고, 두 번째 b는 할당받을 값이 없어 undefined가 할당되기 때문에 배열 디스트럭쳐링에서의 디폴트 값이 적용되는 겁니다.

---

## 에러 핸들링

만약에 아래와 같은 상황 시 에러가 발생할 수밖에 없는데요.

왜냐하면 배열의 리턴을 기대하고 배열을 디스트럭쳐링했으니까요!

이렇게 되면 어떻게 될까요?

```js
function getResults() {
  return null
}

let [x = 1, y = 2] = getResults()
```

![mycodings.fly.dev-destructuring-of-array-in-es6-javascript](https://blogger.googleusercontent.com/img/a/AVvXsEggeD2Bvbu_-zN4NW_AjNitkFHXDZE9bRF_lC_MpG9c7SA8I9AoruNi_hAUWan5PNSosTTplLtYSzuB0Lu_5JNILC6QaCum9tcVkQHl3t9sXBZURJBBHBOQvxf57lbuHxlvXEoZaWNCXmlljnz9tYMtVk2hXcSVFdpp2vKnOK9SNIPUQ4217nMJofR-=s16000)

위 그림과 같이 TypeError가 뜹니다.

```js
Uncaught TypeError: getResults is not a function or its return value is not iterable
```

이럴 때는 아래 코드와 같이 getResults() 함수의 리턴 값을 빈 배열로 우회(fallback)시키는 방법이 가장 일반적입니다.

```js
function getResults() {
    return null;
}

let [x = 10, y = 20] = getResults() || [];

console.log(x); // 10
console.log(y); // 20
```

![mycodings.fly.dev-destructuring-of-array-in-es6-javascript](https://blogger.googleusercontent.com/img/a/AVvXsEiWCDeYma-LAL2A7Ed9Dgs0iZaP6-xFfxUwX9jsEkXbVNlYD38vpUXQ0mSFf18uJYDocjIpjMO3GaxlZrhlpD22WYuNEdZv_WFYeYkmuc_rgwZQn4MrCwoXbsEeQ_9TIShMKVUiTGOBhWc0pJQxk3QhM9UVH5ePErEj1NyUY1jyjeVL_yISGu_OtAbs=s16000)

실행 결과는 대 만족입니다.

--- 

## 중첩된 배열의 디스트럭쳐링

아래와 같은 중첩된 배열일 경우에는 어떻게 해야 할까요?

```js
function getName() {
    return [
        'Sung',
        'Kihun',
        ['4', '5', '6']
    ];
}
```
위 코드에서 getName() 함수가 리턴하는 배열중에 중첩된 배열이 있습니다.

이럴 경우 배열 디스트럭쳐링도 똑같이 배열을 중첩하면 됩니다.

아래 코드처럼요.

```js
let [
    firstName,
    lastName,
    [
        number1,
        number2,
        number3
    ]
] = getName();

console.log(number1, number2, number3); // 4 5 6
```

![mycodings.fly.dev-destructuring-of-array-in-es6-javascript](https://blogger.googleusercontent.com/img/a/AVvXsEhHmI7GQ0efOseNXBR6FwMa4-D9ZN2wKqX7w85OdNhGDUqx706iwVyd0-rBW5UFCJsRS3nKN1sl2fJ8l8E25yCcVqmGBllGF4gtGCe989334UnEIgLLl9PXDjF_KwObz0IWiNhHNlSgNyDxvESlzFJhVIxcKjr_Dba_bCnK3zxXIzsGQUuQhjXu4ZSD=s16000)

---

## 배열 디스트럭쳐링 실제 활용

배열 디스트럭쳐링을 가장 잘 활용하는 예제인데요.

1. 변수 스왑(Swap)

변수를 스왑 하려면 임시 변수를 써야 하는데요.

배열 디스트럭쳐링에서는 임시 변수를 쓸 필요가 없습니다.

```js
let a = 10, 
    b = 20;

[a, b] = [b, a];

console.log(a); // 20
console.log(b); // 10
```

2. 멀티 값을 리턴하는 함수

자바스크립트에서 함수는 한 개의 값을 리턴하는데요.

배열 디스트럭쳐링을 활용하면 두 개 이상의 값을 배열로 리턴하고 그걸 디스트럭쳐링해서 각각의 변수에 할당하여 활용할 수 있습니다.

```js
function stat(a, b) {
    return [
        a + b,
        (a + b) / 2,
        a - b
    ]
}

let [sum, average, difference] = stat(20, 10);
console.log(sum, average, difference); // 30, 15, 10
```

![mycodings.fly.dev-destructuring-of-array-in-es6-javascript](https://blogger.googleusercontent.com/img/a/AVvXsEgRODkjfs62H_trxW_jmC8uShjskZov3qxd-cznwVXvfxpvESc7jVYV43pyTZSbZ8I85b-s6LFTPEsLlI565Mr39ipcPbW970zRU1SU6mG7m4qj2A1ncLVjkOCEUupULqLZoQ4DbDM0DXykmJBCLP0ZFKmR0BXgeM0WAv_iFKQoKcMAd86Np14lfsXu=s16000)

지금까지 자바스크립트 ES6의 배열 디스트럭쳐링(Destructuring)에 대해 알아봤는데요.

정말 ES6의 신 문법은 꼭 습득해서 활용하셨으면 합니다.

그럼.