---
slug: 2024-05-01-typescript-5-5-new-feature-type-predicate-inference
title: 타입스크립트 5.5의 강력한 기능 타입 가드 추론(type predicate inference)
date: 2024-05-01 12:29:18.446000+00:00
summary: 타입스크립트 5.5에 도입될 신 기능, 타입 가드 추론(type predicate inference)
tags: ["typescript", "type guard", "type predicate", "type predicate inference"]
contributors: []
draft: false
---

안녕하세요?

오늘은 타입스크립트 5.5 버전이 베타 버전이 되면서 트위터 상에서 큰 반향을 불러일으키고 있는 새로운 기능인 타입 가드 추론에 대해 알아보겠습니다.

** 목 차 **

- [타입스크립트 5.5의 강력한 기능 타입 가드 추론(type predicate inference)](#타입스크립트-55의-강력한-기능-타입-가드-추론type-predicate-inference)
  - [타입 체크 방법](#타입-체크-방법)
  - [is 연산자를 이용한 타입 가드(type predicate)의 등장](#is-연산자를-이용한-타입-가드type-predicate의-등장)
  - [함수의 구현에 맞지 않는 타입가드 문제점](#함수의-구현에-맞지-않는-타입가드-문제점)
  - [type predicate inference](#type-predicate-inference)

---

## 타입 체크 방법

우리가 타입스크립트를 사용하는 이유가 강력한 타입 적용인데요.

좀 더 쉬운 예를 들면서 이야기를 진행해 보겠습니다.

```js
console.log(value)

// const value: string | number
```

위 코드에서 보면 value 값이 문자열인지 숫자인지 체크하고 싶으면 간단하게 다음과 같이 if 문을 사용하면 됩니다.

```js
if (typeof value === 'string') {
  console.log(value)
}
```

위와 같이 if 문을 이용하면 타입스크립트는 아주 간단하게 value 타입 추론할 수 있습니다.

if 문 안에 있는 `console.log(value)` 구문에서 value 위에 마우스를 갖다 놓으면 아마 다음과 같이 보일 겁니다.

```js
const value: string
```

타입스크립트는 value 가 string 인지 아는 거죠.

이런 방식을 타입스크립트에서는 '타입 좁힘' 또는 '타입 축소'라고 부릅니다.

그러면 위와 같이 if 문을 사용하면 완벽하게 type narrowing이 작동되는데요.

그러면 아예 타입 체크하는 'isString' 함수를 만들면 어떻게 될까요?

```js
function isString(value: unknown) {
  return typeof value === 'string'
}

if (isString(value)) {
  console.log(value) // string | number
}
```

위 코드와 같이 타입 축소(좁힘)가 작동되지 않고 있습니다.

좀 더 어려운 말로는 isString 함수가 타입 가드(type predicate)인지 타입스크립트가 인지하지 못한다는 겁니다.

if 문 안에 확실하게 `typeof value === 'string'` 코드가 있었을 때는 타입스크립트가 타입 추론을 완벽하게 했었는데, isString 이라는 함수를 만들었더니 타입 좁힘이 이루어 지지 않고 있는겁니다.

---

## is 연산자를 이용한 타입 가드(type predicate)의 등장

아까와 같은 문제가 생기면 이제는 타입스크립트에서는 타입 가드를 이용할 수 있는데요.

다음과 같이 하면 됩니다.

```js
function isString(value: unknown): value is string {
  return typeof value === "string";
}

if (isString(value)) {
  console.log(value);  // const value: string
}
```

위와 같이 isString 함수 뒤에 함수의 리턴 타입을 적는 게 아니라 is 연산자를 이용해서 타입 가드를 작성해 넣었습니다.

type predicate 즉, 타입을 서술했다는 뜻인데요.

"value 타입은 string입니다"라고 서술한 겁니다.

이게 타입스크립트에서는 '타입 가드' 라고 합니다.

is 연산자를 이용한 '타입 가드'가 있으면 filter 메서드에서도 제대로 작동합니다.

```js
function isString(value: unknown): value is string {
  return typeof value === "string";
}

const arr = [1, "hello", 3, "world"];

const strings = arr.filter(isString);
```

"value is string" 부분이 없으면 strings는 아래와 같이 나올 텐데요.

```js
const strings: (string | number)[]
```

"value is string" 부분을 추가하고 이제 strings 위에 마우스를 갖다 대면 다음과 같이 나옵니다.

```js
const strings: string[]
```

타입 가드가 완벽하게 작동하고 있네요.

---

## 함수의 구현에 맞지 않는 타입가드 문제점

그러나 이 방식도 약간은 귀찮은 면이 있는데요.

더 나쁜 점은 타입가드가 함수의 구현과 전혀 상반될 수 있다는 겁니다.

반환 유형을 value is number로 변경해도 TypeScript는 불평하지 않습니다.

심각한 문제인 거죠.

```js
function isString(value: unknown): value is number {
  return typeof value === "string";
}

const arr = [1, "hello", 3, "world"];

const strings = arr.filter(isString);
```

이제 strings 위에 마우스를 갖다 대면 아래와 같이 나옵니다.

```js
const strings: number[]
```

우리가 구현한 함수의 원래 취지와 전혀 상반된 행동을 하는데도 타입스크립트는 아무런 문제점을 제기하지 않고 있습니다.

사실 타입스크립트가 AI가 아닌 이상 위와 같은 문제점을 인식할 수 없는 거죠.

하지만 타입스크립트 5.5에서는 이 문제를 해결할 수 있는 type predicate inference가 도입되었습니다.

타입스크립트 개발 contributor이신 "Dan Vanderkam"님께서 요청하신 PR이 이제 5.5 베타버전에 포함되었습니다.

---

## type predicate inference

영어로 썼는데 번역해 보면 타입 프레디컷 인피어런스 즉, 타입 서술자 추론입니다.

타입 가드 추론이라고도 불릴 수 있는데요.

아까 우리가 제기한 문제점인 함수의 구현과 전혀 상반된 타입을 추론한 걸 이제는 AI처럼 함수 body 안에 있는 코드를 감안해서 타입을 추론한다는 겁니다.

그러면 이제 타입 가드를 할 필요가 없는데요.

아까 우리가 계속 타입 가드로 넣었던 is 연산자를 이용한 'value is string' 문구를 쓸 필요가 없어지는 겁니다.

테스트를 위해 빈 폴더에 'npm init -y'로 빈 프로젝트를 만들어 주고 타입스크립트 베타버전을 설치해 보겠습니다

```js
mkdir typescript-5.5-test

cd typescript-5.5-test

npm init -y

npm install -D typescript@beta
```

위와 같이 설치하면 package.json 파일에 아래와 같이 설치될 겁니다.

```js
  "devDependencies": {
    "typescript": "^5.5.0-beta"
  }
```

이제 main.ts 파일을 만들고 아래와 같이 'value is string' 문구를 삭제해 보겠습니다.

```js
function isString(value: unknown) {
  return typeof value === 'string'
}

const arr = [1, 'hello', 3, 'world']

const strings = arr.filter(isString)

// const strings: (string | number)[]
```

역시나 에러가 발생하는데요.

Visual Studio Code가 타입스크립트 5.5 베타버전을 사용하지 않아서입니다.

"Cmd + Shipt + P" 버튼을 눌러 아래 그림과 같이 쓰면 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEipg830Fcztl-Jb_SK023wkY8PkhvYY5QEFHR0TdFzaZbJfT0Wj4iVkOHlf_RpViMIKnmcF-Mx4uNTaP35JzPcdAS98YQPaJaMaCrhcnj-2U8fLoMpX5W0RUlzU7rU796Rti6ay0BZvhKTTnAb8Og5-oV4U4l2Q-NFIKjBmc1j-rrOXdwMF4tnHK9GVVls)

```sh
>typescript: Select typescript version
```

그러면 현재 버전과 베타버전이 보이는데요.

아래와 같이 베타버전을 고르면 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhsAoSxonzd92AE4v0Xj3uJey9yqJwOT5zwAIcQfQDoGXMzEWf-QmwuQJVjy4Ki7_f6zWOs3jDibAi_-vkWSLInw30Acjtsojp40omLGwXWYQ33otG33jrzyWfSlnkXqExGCdVMqqXXbVlsmSbt-rvBcr5GKgPRzHxYfr7vrdI-hOoF528lrFmkUQiNjiw)

이제 타입스크립트 5.5 베타버전이 적용되었기 때문에 아래와 같이 다시 strings 위에 마우스를 갖다 대면 아래와 같이 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhOUe5QsQ9o3-xhheMNAQFo3iW0GwGRyV8n40F6I3VOBCmQ9V2srEl3B3X3Y7ifkAzxx4S-D8K3l_FZjs3z0-8GsKuE9cHXJQoSI9TcM7UVwFc-VwOoWQTKijHkOTfpiVNdIprrzSxB8rkfodJNHppngdgfrNuklkUrTSs7xWaIVmWotOTaU6AVUlOsRT4)

위와 같이 strings가 is 연산자를 이용한 타입가드 "value is string"이 있었을 때와같이 정확하게 작동합니다.

더 이상 is 연산자를 이용한 타입가드에서 타입을 "value is number"와 같이 잘못 넣을 경우처럼 위험한 상황도 없어지고 오로지 함수 body 안의 코드에 의해 유추한 타입이 적용되어 지는데요.

타입스크립트 역사에 있어 아주 위대한 순간이 아닐 수 없습니다.

이제 개발자가 직접 타입가드 없이 복잡한 타입 축소(좁힘) 코드를 아래와 같이 작성할 수 있게 되는 겁니다.

```js
function isObjAndHasIdProperty(value: unknown) {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof value.id === 'number'
  )
}

if (isObjAndHasIdProperty(value)) {
  console.log(value.id) // number
}
```

정말 타입스크립트 역사에서 큰 전환점이 될 것으로 기대가 되는군요.

그럼.
