---
slug: 2022-12-19-howto-javascript-null-check
title: 자바스크립트에서 Null 타입 체크하기
date: 2022-12-19 00:37:17.464000+00:00
summary: 자바스크립트에서 Null 타입 체크하기
tags: ["javascript", "null check", "type check", "type"]
contributors: []
draft: false
---

안녕하세요?

오늘은 자바스크립트의 null 타입에 관해 얘기를 해보겠습니다.

먼저, 다음과 같은 현상을 한번 보실까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEjFCTUzEaA75GWnXBBK3hw42YPt0VXxXsbIZN7jMgGXjBOebGfvBbXvjcwD_y7ia0ab3uUuWLY4a5iQ1pDQ0YPel2onmD62KIal-6R9MQkbdHw4aV59TDlI1L0POzaviwDwPQx1uhRnJ_MKGriBDVEWaQo2LgYr6Gj9j4-nA2UqSWT8b0CUlrUJ7SfN)

위 그림에서 보시면 null 타입인 user의 typeof 연산자의 값이 object라고 나오는데요.

이 같은 버그는 자바스크립트 초창기 설계 때 생긴 버그인데요.

초창기 자바스크립트 구현에 있어 자바스크립트는 value에 대해 타입 태그(type tag)와 같이 value 값을 매칭 시켰었는데요.

초창기 객체(object)의 타입 태그(type tag)가 바로 0이었습니다.

그런데 null 타입은 C에서 NULL 포인터(0x00) 값을 가졌었는데요.

결과적으로 null은 0이라는 타입 태그(type tag)를 갖는 object로 인식이 되어 온 거죠.

이것에 대한 수정이 이루어졌어야 하는데, 몇 번 시도는 있었지만 실현되지는 않았네요.

---
## null vs undefined

자바스크립트를 처음 접하시는 분이 헷갈리는 게 null 타입과 undefined 타입인데요.

쉽게 생각하면 null은 없다는 뜻으로 이해하시면 되고요.

undefined는 변수를 선언했는데, 즉, 메모리에 변수 자리를 만들었는지 아직 초기화하지 않았다고 이해하시면 됩니다.

그리고, undefined는 typeof 연산자에 의해 undefined로 리턴 됩니다.

```js
let name;

console.log(typeof(name)); // undefined
```

---
## 자바스크립트 == 연산자로 null 타입 체크하기

자바스크립트에서 '==' 연산자와 '===' 연산자가 틀린 거는 다들 아실 텐데요.

느슨한 '==' 연산자를 사용하면 null 인지 아닌지 확인할 수 있는데요.

```js
let firstName = null;

console.log(firstName == null);  // true
```

그런데 느슨한 '==' 연산자는 null과 undefined를 같은 것으로 인식하는데요.

```js
let firstName = null;
let lastName;

console.log(firstName == null); // true
console.log(lastName == null); // true
console.log(firstName == undefined); // true
console.log(lastName == undefined); // true
console.log(firstName == lastName); // true
console.log(null == undefined); // true
```

느슨한 '==' 연산자는 위와 같이 약간 이상하게 작동됩니다.

---
## 엄격한 '===' 연산자를 사용한 null 타입 체크하기

그러면 엄격한 '===' 연산자를 사용하면 어떻게 될까요?

```js
let firstName = null;
let lastName;

console.log(firstName === null); // true
console.log(lastName === null); // false
console.log(firstName === undefined); // false
console.log(lastName === undefined); // true
console.log(firstName === lastName); // false
console.log(null === undefined); // false
```

우리가 원하던 대로 작동되네요.

그래서 결과적으로 null 타입을 확인하려면 엄격한 '===' 연산자를 사용하면 됩니다.

---
## ES6에서 null 타입 체크하기

ES6에서 새로 나온 Object.is() 메서드가 있는데요.

이 메서드는 아래와 같이 두 값이 같은지 아닌지 비교해 줍니다.

엄격한 '===' 연산자를 이용하는 거죠.

```js
// Syntax
Object.is(value1, value2)
```

그래서 앞으로는 Object.is() 메서드를 사용하면 됩니다.

```js
let firstName = null;
let lastName;

console.log(Object.is(firstName, null)); // true
console.log(Object.is(lastName, null)); // false
console.log(Object.is(firstName, undefined)); // false
console.log(Object.is(lastName, undefined)); // true
console.log(Object.is(firstName, lastName)); // false
console.log(Object.is(null, undefined)); // false
```

이제 Object.is() 메서드만 있으면 자바스크립트에서 null 타입에 대한 두려움은 없을 것으로 생각되네요.

그럼.