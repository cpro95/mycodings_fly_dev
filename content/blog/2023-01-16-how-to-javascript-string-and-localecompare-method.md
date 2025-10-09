---
slug: 2023-01-16-how-to-javascript-string-and-localecompare-method
title: 자바스크립트에서 문자열을 비교하는 다양한 방법 및 localeCompare 알아보기
date: 2023-01-16 06:42:45.632000+00:00
summary: 자바스크립트에서 문자열을 비교하는 다양한 방법 및 localeCompare 알아보기
tags: ["javascript", "string", "compare", "localeCompare"]
contributors: []
draft: false
---

안녕하세요?

오늘은 자바스크립트 문자열 비교에 대해 알아볼까 합니다.

자바스크립트에는 비교 연산자가 두 가지가 있는데요.

바로 `===`라는 엄격한 비교 연산자와 `==`라는 느슨한 비교 연산자가 있습니다.

자바스크립트 개발자가 무슨 생각으로 `==`라는 느슨한 비교 연산자를 만들었는지 모르겠지만, 이걸로 수많은 버그가 만들어졌던 과거가 많았죠.

그래서 자바스크립트 개발자 교육에서는 무조건 `===`라는 엄격한 비교 연산자를 쓰라고 강조합니다.

당연히 타입스크립트를 사용하라고 강조하기도 합니다.

(예제)

```js
let a = 15
let b = '15'

// 느슨한 비교 연산자(Loose Equality)
console.log(a == b) // true

// 엄격한 비교 연산자(Strict Equality)
console.log(a === b) // false
```

자바스크립트 연산에 있어 number와 string이 나오면 number를 string으로 변환합니다.

이게 왜 이렇게 설계되었냐면 HTTP 자체가 string의 이동이기 때문입니다.

모든 걸 string으로 주고받고 그걸 다시 원하는 타입인 number로 변환하는 형식이 HTTP에서의 작동 방식이니까요.

그래서 위의 예제에서 느슨한 비교 연산자는 a와 b가 같다고 표시해 줍니다.

물론, 엄격한 비교 연산자는 타입이 틀리면 바로 false를 리턴 해 주고요.

---

## 문자열 직접 비교

그럼 문자열을 직접 비교해 볼까요?

```js
let string1 = 'mycodings'

console.log(string1 === 'myCodings') // false
console.log(string1 === 'mycodings') // true
console.log('mycodings' === 'myCodings') // false
```

위와 같이 직접 두 문자열을 엄격한 비교 연산자로 비교하면 됩니다.

엄격한 비교 연산자는 당연히 대소문자를 다르게 취급합니다.

느슨한 비교 연산자도 대소문자는 다르게 취급합니다.

왜냐하면 대문자 소문자의 ASCII 코드가 틀리기 때문이죠.

그럼 대소문자를 무시하고 비교하고 싶으면 자바스크립트에서는 어떻게 해야 할까요?

(예제)

```js
let string1 = 'mycodings'
let string2 = 'myCodings'

console.log(string1.toLowerCase() == string2.toLowerCase()) // true
console.log(string1.toUpperCase() == string2.toUpperCase()) // true
```

위와 같이 toLowerCase() 메서드와 toUpperCase() 메서드를 사용해서 비교하면 대소문자를 무시하고 비교할 수 있습니다.

---

## 문자열의 length를 이용해서 비교하기

우리가 코딩하다 보면 문자열의 length 속성을 자주 이용하게 됩니다.

이걸 이용해서도 비교할 수 있는데요.

(예제)

```js
let string1 = 'myCodings'

console.log(string1.length) // 9
```

문자열의 length 속성을 이용해서 크기를 비교할 수 있습니다.

(예제)

```js
let string1 = 'myCodings.fly.dev'
let string2 = 'myCodings'

console.log(string1.length > string2.length) // true
console.log(string1.length < string2.length) // false
console.log(string1.length == string2.length) // false
console.log(string1.length === string2.length) // false
```

---

## localeCompare 메서드 알아보기

브라우저에는 localeCompare 라는 메서드가 존재하는데요.

브라우저의 로케일에 따라 작동하는 문자열 비교 함수입니다.

이 함수는 리턴 값이 1, -1, 0 만 리턴합니다.

-1을 리턴 하는 경우는 왼쪽에 있는 문자열이 오른쪽보다 알파벳 순서가 빠르다는 뜻이고,

1을 리턴 하는 경우는 오른쪽에 있는 문자열이 왼쪽보다 알파벳 순서가 빠르다는 뜻입니다.

그리고 마지막으로 0을 리턴 하는 경우는 두 개의 문자열이 똑같다는 뜻이죠.

그래서 0이냐 아니냐에 따라 문자열을 비교하면 됩니다.

(예제)

```js
let string1 = 'myCoding'
let string2 = 'coding'

console.log(string1.localeCompare(string2)) // 1
```

1을 리턴했습니다.

왜냐하면 오른쪽에 있는 문자열인 string2의 c라는 문자가 왼쪽에 있는 문자열인 string1의 m 보다 빠르기 때문입니다.

(예제)

```js
let string1 = 'myCoding'
let string2 = 'myCoding'

console.log(string2.localeCompare(string1)) // 0
```

위 코드를 보시면 이제 비교 연산자 없이 바로 문자열을 비교할 수 있는 메서드가 있다는 걸 이해하셨을 겁니다.

이 localeCompare 메서드만 알아 두셔도 자바스크립트 문자열 비교가 좀 더 쉬울 겁니다.

---

## localeCompare 메서드의 대소문자 구분하기

localeCompare 메서드는 친절하게도 대소문자 구분 옵션을 제공해 주는데요.

사용 방법은 아래와 같습니다.

```js
let string1 = 'myCoding'
let string2 = 'mycoding'

console.log(string2.localeCompare(string1, 'en', { sensitivity: 'base' })) // 0
```

sensitivity가 "base"이면 대소문자를 구분하지 않는다는 뜻이고요.

만약 sensitivity가 "case"이면 대소문자를 구분한다는 뜻입니다.

그럼.
