---
slug: 2022-11-19-7-way-of-javascript-shorthand-optimization
title: 자바스크립트 코드를 축약해서 쓰는 7가지 방법
date: 2022-11-19 00:24:56.931000+00:00
summary: 자바스크립트 코드를 축약해서 쓰는 7가지 방법
tags: ["javascript", "tutorial"]
contributors: []
draft: false
---

안녕하세요?

오늘은 자바스크립트 코드 작성에 있어 긴 문장을 간단하게 축약해서 쓸 수 있는 7가지 비법을 소개해 드릴려고 합니다.

다들 아시는 내용일 수 도 있고 하지만, 다시 한번 복습한다는 의미에서 한번 읽어 보시는 것도 좋을 듯 합니다.

<hr />
## 1. 문자열 여러 개 체크하기

만약에 여러분이 쿼리로 받은 문자열이 DB에 저장된 값에 속하는지 체크해야 할 때가 있습니다.

이럴 때 사용하는 방법으로는 if 문과 || 연산자를 조합해서 사용할 수도 있겠지만 다음과 같이 하는게 훨씬 빠를 듯 합니다.

### 긴 버전

```jsx
// Long-hand
const isInMyDB= (letter) => {
  if (
    letter === "david" ||
    letter === "letterman" ||
    letter === "jay" ||
    letter === "leno" ||
    letter === "sam"
  ) {
    return true;
  }
  return false;
};
```

### 짧은 버전

```jsx
// Short-hand
const isInMyDB= (letter) =>
  ["david", "letterman", "jay", "leno", "sam"].includes(letter);
```

<hr />
## 2. 배열은 for-of, 객체는 for-in

배열과 객체를 살펴볼 때 단순 for문을 사용하지 마시고 자바스크립트에 기본 내장되어 있는 for-of, for-in 구문을 사용하시면 좀 더 쉽고 명확하게 코드를 짤 수 있습니다.

## For-of

### 긴 버전

```jsx
const arr = [1, 2, 3, 4, 5];
// Long-hand
for (let i = 0; i < arr.length; i++) {
  const element = arr[i];
  // ...
}

```

### 짧은 버전

```jsx
const arr = [1, 2, 3, 4, 5];

// Short-hand
for (const element of arr) {
  // ...
}
```

## For-in

### 긴 버전

```jsx
const obj = {
  a: 1,
  b: 2,
  c: 3,
};

// Long-hand
const keys = Object.keys(obj);
for (let i = 0; i < keys.length; i++) {
  const key = keys[i];
  const value = obj[key];
  // ...
}

```

### 짧은 버전

```jsx
const obj = {
  a: 1,
  b: 2,
  c: 3,
};

// Short-hand
for (const key in obj) {
  const value = obj[key];
  // ...
}
```

<hr />
## 3. 거짓 체크

타입스크립트가 아니라 자바스크립트를 사용한다면 꼭 해야하는게 타입 체크인데요.

특히, `null` ,`undefined` ,`0` ,`false` ,`NaN` , 그리고 빈 문자열을 체크해서 점검해야 할 때가 있습니다.

이럴 때도 쉽게 할 수 있는 방법이 있죠.

바로 논리 부정연산자인 “!” 를 이용하면 쉽게 쓸 수 있습니다.

### 긴 버전

```
// Long-hand
const isFalsy = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === 0 ||
    value === false ||
    value === NaN ||
    value === ""
  ) {
    return true;
  }
  return false;
};
```

### 짧은 버전

```jsx
// Short-hand
const isFalsy = (value) => !value;
```

<hr />
## 4. 삼항 연산자(Ternary operator)

React 개발자라면 꼭 써야하는게 바로 삼항 연산자인데요.

복잡한 if-else 문을 제외하고 삼항 연산자로 코드를 깔끔하게 유지하시기 바랍니다.

## 긴 버전

```jsx
// Long-hand
let info;
if (value < minValue) {
  info = "Value is too small";
} else if (value > maxValue) {
  info = "Value is too large";
} else {
  info = "Value is in range";
}
```

/짧은 버전

```jsx
// Short-hand
const info =
  value < minValue
    ? "Value is too small"
    : value > maxValue ? "Value is too large" : "Value is in range";
```
<hr />
## 5. 함수 호출도 삼항 연산자를

함수 호출도 삼항 연사자를 이용해서 선택적으로 호출 할 수 있습니다.

## 긴 버전

```jsx
function f1() {
  // ...
}
function f2() {
  // ...
}

// Long-hand
if (condition) {
  f1();
} else {
  f2();
}
```

## 짧은 버전

```jsx
function f1() {
  // ...
}
function f2() {
  // ...
}

// Short-hand
(condition ? f1 : f2)();
```

<hr />
## 6. switch 문 축약

switch문을 여러개 쓰면 코드가 복잡해 지는데요.

간단하게 쓰는 방법이 있습니다.

## 긴 버전

```jsx
const dayNumber = new Date().getDay();

// Long-hand
let day;
switch (dayNumber) {
  case 0:
    day = "Sunday";
    break;
  case 1:
    day = "Monday";
    break;
  case 2:
    day = "Tuesday";
    break;
  case 3:
    day = "Wednesday";
    break;
  case 4:
    day = "Thursday";
    break;
  case 5:
    day = "Friday";
    break;
  case 6:
    day = "Saturday";
}

```

## 짧은 버전

```jsx
const dayNumber = new Date().getDay();

// Short-hand
const days = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};
const day = days[dayNumber];
```

<hr />
## 7. Fallback 값 지정하기

마지막으로 fallback 값을 손 쉽게 지정할 수 있습니다.

## 긴 버전

```jsx
// Long-hand
let name;
if (user?.name) {
  name = user.name;
} else {
  name = "Anonymous";
}

```

## 짧은 버전

```
// Short-hand
const name = user?.name || "Anonymous";
```

지금까지 자바스크립트 코드 축약 방법에 대해 알아보았는데요.

개인적으로 6번, 7번은 저도 잘 안 쓰던 코드 스타일인데 앞으로는 꼭 적용해야 할 듯합니다.
