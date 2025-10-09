---
slug: 2022-12-18-three-ways-check-if-object-is-empty-in-javascript
title: 자바스크립트 객체가 비었는지 검사하는 3가지 방법
date: 2022-12-18 08:41:10.535000+00:00
summary: 자바스크립트 객체가 비었는지 검사하는 3가지 방법
tags: ["isObjectEmpty", "javascript", "object", "ES6", "empty"]
contributors: []
draft: false
---

안녕하세요?

오늘은 자바스크립트로 코드를 짤 때 가장 귀찮았던 객체가 비었는지 확인하는 코드를 한번 알아보겠습니다.

예전 jquery나 외부 라이브러리인 lodash를 이용하면 쉽게 할 수 있는 일이었는데요.

```js
const _ = require('lodash');

let userDetails = {
  name: "Dojun Jin",
  username: "dojun-jin",
  age: 22
};

let myEmptyObj = {};

const isObjectEmpty = (objectName) => {
  return _.isEmpty(objectName);
};

console.log(isObjectEmpty(userDetails)); // false
console.log(isObjectEmpty(myEmptyObj)); // true
```

lodash를 직접 깔지 않고 순수하게 ES6를 이용해서 나만의 빈 객체 탐색 함수를 만드는 것도 공부하는 데 도움이 되지 않을까 생각해 봅니다.

---
## Object.keys 메서드 사용하기

ES6에 추가된 기능 중에 Object.keys 메서드가 있는데요.

Object.values 메서드도 있습니다.

이게 뭔지 한번 볼까요?

```js
let userDetails = {
  name: "Dojun Jin",
  username: "dojun-jin",
  age: 22
};

Object.keys(userDetails);
// ['name', 'username', 'age']

Object.values(userDetails)
// ['Dojun Jin', 'dojun-jin', 22]
```

keys, values 메서드는 그 역할이 명확하네요.

그럼 이 메서드를 이용해서 객체가 비었는지 확인해 볼까요?

```js
let userDetails = {
  name: "Dojun Jin",
  username: "dojun-jin",
  age: 22
};

let myEmptyObj = {};

console.log(Object.keys(userDetails).length); // 3
console.log(Object.keys(myEmptyObj).length);  // 0
```

어떤가요? Object.keys 메서드로 객체가 비었는지 안 비었는지 확인할 수 있을 거 같네요.

그런데 여기서 문제가 있습니다.

```js
let aaa = [];

console.log(Object.keys(aaa).length); // 0
```
빈 배열도 Object.keys 에 의해 length가 0이 나옵니다.

이러면 좀 헷갈리지 않을까요?

그래서 추가로 필요한 게 객체인지 아닌지 확인하는 루틴이 필요합니다.

```js
let userDetails = {
  name: "Dojun Jin",
  username: "dojun-jin",
  age: 22
};

let myEmptyObj = {};

const isObjectEmpty = (objectName) => {
  return Object.keys(objectName).length === 0 && objectName.constructor === Object;
}

console.log(isObjectEmpty(userDetails)); // false
console.log(isObjectEmpty(myEmptyObj)); // true
```

위와 같이 Object.constructor 가 Object인지 확인하는 코드를 추가했습니다.

왜냐하면 아래와 같이 객체 일때는 Object를 리턴하고 Array일 경우 Array를 리턴하기 때문입니다.

```js
userDetails.constructor
ƒ Object() { [native code] }

aaa.constructor
ƒ Array() { [native code] }
```

어떤가요? 좀 명확한 코드가 나왔죠?

그런데 여기서 문제가 생깁니다.

만약 우리가 객체라고 넘겼던 게 객체가 아니고 undefined, null이면 어떻게 될까요?

```js
let myEmptyObj = {};
let nullObj = null;
let undefinedObj;

const isObjectEmpty = (objectName) => {
  return (
    objectName &&
    Object.keys(objectName).length === 0 &&
    objectName.constructor === Object
  );
};

console.log(isObjectEmpty(userDetails)); // false
console.log(isObjectEmpty(myEmptyObj)); // true
console.log(isObjectEmpty(undefinedObj)); // undefined
console.log(isObjectEmpty(nullObj)); // null
```
크롬에서는 undefined, null이 에러가 발생하지만 Node 상에서는 아래 그림과 같이 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgD6Apm3h2pSgnSp7vciBkZusB_cyRlCBUrfvegk_AH8g9BYC7JwUePKNlqj6f18HauHW7UdtsbtKdVzLDrZgmIujg3IaGzZ0aqLgA8Hwf0tHqYUxEbIF1qj253KL6YepDuosy6rmm8lEd8fh7KeVRs3mD1pxhRd-lF_9M8YIU96tznADEmyhoEkqsI=w400-h314)

위와 같이 말이죠.

그래서 최종적으로 isObjectEmpty 함수를 아래와 같이 바꾸면 됩니다.

objectName && 을 먼저 비교하는 코드를 추가했습니다.

그래야 undefined, null 이 오면 그냥 그대로 리턴되게 하기 위해서죠.

```js
const isObjectEmpty = (objectName) => {
  return (
    objectName &&
    Object.keys(objectName).length === 0 &&
    objectName.constructor === Object
  );
};

console.log(isObjectEmpty(userDetails)); // false
console.log(isObjectEmpty(myEmptyObj)); // true
console.log(isObjectEmpty(undefinedObj)); // undefined
console.log(isObjectEmpty(nullObj)); // null
```

이제 나만의 빈 객체 탐지 함수가 완성되었습니다.

---

## for..in Loop를 사용하여 빈 객체 알아내기

ES6에 새로 추가된 Loop 중에 for..in이 있는데요.

Object.hasOwnProperty()를 이용할 겁니다.


```js
let userDetails = {
  name: "Dojun Jin",
  username: "dojun-jin",
  age: 22
};

for (let prop in userDetails) {
    console.log(prop);
}
// name
// username
// age
```

for..in 루프를 객체를 넣어서 돌리면 바로 객체의 key 값이 나옵니다.

위 코드는 userDetails 객체의 key 값이 그대로 출력되는 걸 볼 수 있습니다.

그러면 객체가 비었느지 안 비었는지 for..in 으로 돌려지는 key 값이 있는지 없는지 체크하면 될 거 같네요.

```js
const isObjectEmpty = (objectName) => {
  for (let prop in objectName) {
    if (objectName.hasOwnProperty(prop)) {
      return false;
    }
  }
  return true;
};
```
Object.hasOwnProperty 메서드는 그 뜻대로 객체의 key에 해당하는 게 있냐 없냐를 true/false 로 돌려줍니다.

한 개라도 있다면 true가 되어 함수가 종결되는 거죠.

```js
const isObjectEmpty = (objectName) => {
  for (let prop in objectName) {
    if (objectName.hasOwnProperty(prop)) {
      return false;
    }
  }
  return true;
};

console.log(isObjectEmpty(userDetails)); // false
console.log(isObjectEmpty(myEmptyObj)); // true
// false
// true
```

어떤가요?

두번째도 ES6를 이용한 빈 객체 탐지 함수인데요.

---
## JSON.stringify() 함수를 사용하여 빈 객체 알아내기

이 방법은 제가 예전에 썼던 방식인데요.

객체를 인터넷 상으로 전송할 때 문자열로 바꾸는 JSON.stringify() 함수를 쓰면 객체가 비었는지 안 비었는지 정확하게 확인할 수 있습니다.

```js
let emptyObject = {}

console.log(JSON.stringify(emptyObject))
// {}

console.log(JSON.stringify(emptyObject) == "{}")
// true
```

위 코드를 보시면 정말 간단하죠.

```js
const isObjectEmpty = (objectName) => {
  return JSON.stringify(objectName) === "{}";
};
```

3번째 방법은 위와 같이 가장 간단한 방법으로 확인할 수 있을 겁니다.

지금까지 ES6에서 객체가 비었는지 확인하는 코드를 통해 자바스크립트에 대해 공부해 봤는데요.

3가지 방법 중 가장 편할 걸 쓰시면 됩니다.

그럼.
