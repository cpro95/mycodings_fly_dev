---
slug: 2022-12-18-javascript-type-checking-function
title: 자바스크립트 타입 체크(type check)하는 함수 직접 만들어 보기
date: 2022-12-18 11:08:20.660000+00:00
summary: 자바스크립트 타입 체크(type check)하는 함수 직접 만들어 보기
tags: ["javascript", "type", "type check"]
contributors: []
draft: false
---

안녕하세요?

요즘은 저도 타입스크립트로 작업하지만, 예전에는 자바스크립트에서 타입 체크할 때 항상 힘들었었는데요.

오늘은 자바스크립트에서 타입 체크하는 함수를 만들어 보면서 자바스크립트의 타입에 관해 공부해 보도록 하겠습니다.

---

## 자바스크립트 타입 종류

자바스크립트에는 타입에는 primitive 타입과 객체가 있는데요.

primitive 타입은 아래와 같이 7개가 있습니다.

1. String
2. Number
3. Boolean (true and false)
4. null
5. undefined
6. Symbol
7. BigInt

최근에 BigInt 타입이 추가됐죠.

그리고 Object라는 타입이 있습니다.

---

## typeof 연산자 사용하기

자바스크립트에서 타입을 확인하는 방법은 바로 typeof 연산자를 사용하면 되는데요.

사용 방법을 잠시 볼까요?

```js
typeof expression

// Or

typeof value
```

```js
let myNumber = 23
console.log(typeof myNumber) // returns "number"
console.log(typeof myNumber) // returns "number"

console.log(typeof 23) // returns "number"
console.log(typeof 23) // returns "number"
```

그러면 다양한 typeof 연산자 사용법을 한 번 쭉 살펴보고 마지막으로 타입 체크하는 함수를 만들어 보도록 하겠습니다.

```js
console.log(typeof typeof 23) // returns "string"

// Using expression
console.log(typeof (123 - 4567 - 890)) // returns "number"

// Using single value
console.log(typeof 123 - 4567 - 890) // returns NaN
```

마지막 예제를 보시면 괄호()가 없죠.

그래서 typeof가 typeof 123을 먼저 평가해서 "number"라고 리턴하면 다시 "number"-4567-890이라는 수식이 됩니다.

이건 당연히 NaN이 되겠죠.

그래서 typeof와 수식은 괄호()를 꼭 써줘야 합니다.

---

## 숫자 관련 typeof

좀 더 예를 들어 볼까요?

```js
console.log(typeof 33) // returns "number"
console.log(typeof -23) // returns "number"
console.log(typeof 0) // returns "number"
console.log(typeof 1.2345) // returns "number"
console.log(typeof Infinity) // returns "number"

console.log(typeof NaN) // returns "number"
console.log(typeof Math.LOG2E) // returns "number"

// Typecasting value to number
console.log(typeof Number(`123`)) // returns "number"

// Value cannot be typecasted to integer
console.log(typeof Number(`mycodings`)) // returns "number"

console.log(typeof parseInt(`123`)) // returns "number"
console.log(typeof parseFloat(`123.456`)) // returns "number"
```

---

## String 관련 typeof

```js
console.log(typeof '') // returns "string"
console.log(typeof 'mycodings') // returns "string"
console.log(typeof 'mycodings.fly.dev blog site is good') // returns "string"
console.log(typeof '123') // returns "string"
console.log(typeof String(123)) // returns "string"
```

---

## Boolean 관련 typeof

```js
console.log(typeof true) // returns "boolean"
console.log(typeof false) // returns "boolean"
console.log(typeof Boolean(0)) // returns "boolean"

console.log(typeof !!0) // returns "boolean"
```

---

## Symbol 관련 typeof

```js
console.log(typeof Symbol()) // returns "symbol"
console.log(typeof Symbol('parameter')) // returns "symbol"
console.log(typeof Symbol.iterator) // returns "symbol"
```

---

## undefined 관련 typeof

```js
// Using the undefined keyword
console.log(typeof undefined) // returns "undefined"

//variable is declared but undefined (has no value intentionally)
let a
console.log(typeof a) // returns "undefined"

// Using undefined variable
console.log(typeof v) // returns "undefined"
```

---

## Object 관련 typeof

```js
console.log(typeof null) // object
console.log(typeof [1, 2, 3, 'mycodings']) //object
console.log(typeof { age: 22, name: 'Dojun Jin' }) //object
console.log(typeof [1, 2, 3, 4, 5, 6]) //object
```

첫번 째 typeof null이 object로 나오는 버그는 오래된 자바스크립트 태생적 버그인데요. 고칠 수 없다고 합니다.

배열도 object라고 나오는데요.

자바스크립트에서는 배열이 특수 형태의 객체라고 보고 있습니다.

ES6에서 그나마 Array.isArray 메서드가 나오면서 Array인지 아닌지 구분할 수 있었는데요.

```js
console.log(Array.isArray([1, 2, 3, 'mycodings'])) // returns true
console.log(Array.isArray({ age: 22, name: 'Dojun Jin' })) // returns false
```

ES6가 나오기 전에는 아래와 같이 instanceof 연산자를 사용했었습니다.

```js
const isArray = input => {
  return input instanceof Array
}

console.log(isArray([1, 2, 3, 'mycodings'])) // returns true
```

---

## null 타입을 어떻게 체크할 것인가?

typeof null 이 자바스크립트의 태생적 버그라고 하면 그러면 어떻게 null인지 아닌지 구별해야 할까요?

```js
const isNull = input => {
  return input === null
}

let myVar = null
console.log(isNull(myVar)) // returns true
```

위와 같이 input 값이랑 null 이랑 === 비교를 하면 됩니다.

---

## 자바스크립트 타입 체크하는 함수 만들기

그러면 typeCheck이라는 함수를 만들고 싶으면 어떻게 해야 할까요?

바로 Object.prototype.toString.call() 함수를 이용하는 거죠.

```js
Object.prototype.toString.call(undefined)
;('[object Undefined]')
Object.prototype.toString.call(null)
;('[object Null]')
Object.prototype.toString.call([])
;('[object Array]')
Object.prototype.toString.call({})
;('[object Object]')
Object.prototype.toString.call('s')
;('[object String]')
Object.prototype.toString.call(true)
;('[object Boolean]')
```

위 코드는 크롬 콘솔 창에서 입력한 값인데요.

자바스크립트는 객체의 프로토타입 체이닝으로 작동됩니다.

그래서 toString 값을 이용했는데요.

위에서 잘 보면 우리가 원하는 타입값이 문자열로 리턴되고 있습니다.

그러면 typeCheck이라는 함수를 만들어 볼까요?

```js
const typeCheck = value => {
  const return_value = Object.prototype.toString.call(value)
  const type = return_value.substring(
    return_value.indexOf(' ') + 1,
    return_value.indexOf(']'),
  )

  return type.toLowerCase()
}
```
위 코드는 간단합니다. Object.prototype.toString.call(value) 값이 리턴하는 문자열의 끝부분을 잘라내서 소문자로 바꾸고 리턴해 주는 함수입니다.

테스트 해 볼까요?

```js
console.log(typeCheck([])); // returns 'array'
console.log(typeCheck(new Date())); // returns 'date'
console.log(typeCheck(new String("mycodings"))); // returns 'string'
console.log(typeCheck(new Boolean(true))); // returns 'boolean'
console.log(typeCheck(null)); // returns 'null'
```

이제는 Date까지 구별해주는 나만의 타입 체크 함수가 완성되었네요.

여러분도 자바스크립트로 작업하실 때 꼭 이걸 utils 함수로 만들어 놓고 코딩하시길 바랍니다.

그럼.
