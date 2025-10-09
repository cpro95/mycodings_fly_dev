---
slug: 2022-11-29-javascript-reduce-10-example
title: 자바스크립트 reduce 함수 10가지 예제
date: 2022-11-29 11:18:50.506000+00:00
summary: 자바스크립트 reduce 함수 10가지 예제
tags: ["javascript", "reduce"]
contributors: []
draft: false
---

안녕하세요?

자바스크립트 코드를 짤 때 우리가 보통 forEach, map, filter, indexOf는 자주 쓰지만 reduce 함수는 잘 안 쓰는데요.

원인은 어렵기 때문이죠.

사실 자바스크립트 고수분들은 reduce 함수를 잘 쓰는데요.

다음 10가지 예제를 보시고 원하시는 상황에 적용해서 쓰면 좋을 듯합니다.

<hr />

## reduce 기초

```js
reduce(callbackFn)
reduce(callbackFn, initialValue)
```

위와 같이 reduce 함수는 콜백 함수 또는 initialValue를 가지는데요.

콜백 함수는 또 accumulator, currentValue, currentIndex, array를 또 가집니다.

그럼 예제를 통해 reduce 함수를 좀 더 알아보겠습니다.

<hr />
## 2차원 배열을 1차원 배열로 변환하기

```js
const array_0 = [
  [1, 1],
  [2, 3],
  [3, 5],
].reduce(
  (accumulator, currentValue) => accumulator.concat(currentValue),
  [], // initial value
)
// array_0: [ 1, 1, 2, 3, 3, 5 ]
```

reduce와 concat 함수를 이용해서 쉽게 2차원 배열을 1차원 배열로 전환했습니다.

<hr />
## 다차원 배열을 1차원 배열로 변환하기

위에서는 2차원 배열을 1차원 배열로 변환했었는데요, 사실 2차원 배열 말고 다차원 배열을 1차원 배열로 변환할 수 있습니다.

```js
function ReduceArray(arr = []) {
  return arr.reduce(
    (accumulator, currentValue) =>
      accumulator.concat(
        Array.isArray(currentValue) ? ReduceArray(currentValue) : currentValue,
      ),
    [],
  )
}

const array_1 = ReduceArray([
  [1, [1, 2]],
  [3, [3, [5]]],
])
// array_1: [ 1, 1, 2, 3, 3, 5 ]
```

<hr />
## 배열 안의 중복 항목 없애기

```js
function UniqueArray(arr = []) {
  return arr.reduce(
    (accumulator, currentValue) =>
      accumulator.includes(currentValue)
        ? accumulator
        : [...accumulator, currentValue],
    [],
  )
}

const array_2 = UniqueArray([1, 1, 2, 3, 3, 5])
// array_2: [ 1, 2, 3, 5 ]
```

사실 위 코드는 자바스크립트의 Set 타입을 이용해서도 쉽게 구현할 수 있습니다.

```js
const array_2 = [...new Set([1, 1, 2, 3, 3, 5])]
// array_2: [ 1, 2, 3, 5 ]
```

<hr />
## 배열 분할하기

```js
function SpiltArray(array, size) {
  return array.reduce((acc, _, index) => {
    if (index % size === 0) acc.push(array.slice(index, index + size))
    return acc
  }, [])
}

const numbers = [1, 2, 3, 4, 5, 6, 7]
const array_3 = SpiltArray(numbers, 2)
// array_3: [ [ 1, 2 ], [ 3, 4 ], [ 5, 6 ], [ 7 ] ]
```

<hr />
## 객체를 URL 파라미터로 변환하기

```js
function StringifyQueryParam(queryParam = {}) {
  return Object.entries(queryParam)
    .reduce(
      (t, v) => `${t}${v[0]}=${encodeURIComponent(v[1])}&`,
      Object.keys(queryParam).length ? '?' : '',
    )
    .replace(/&$/, '')
}

const queryString = StringifyQueryParam({
  name: 'stringify',
  email: 'stringify@gmail.com',
})
// queryString: '?name=stringify&email=stringify%40gmail.com'
```

<hr />
## URL 파라미터 파싱 하기

```js
function ParseQueryString(queryString) {
  return queryString
    .replace(/(^\?)|(&$)/g, '')
    .split('&')
    .reduce((t, v) => {
      const [key, val] = v.split('=')
      t[key] = decodeURIComponent(val)
      return t
    }, {})
}

const queryParam = ParseQueryString(
  '?name=stringify&email=stringify%40gmail.com',
)
// queryParam: { name: 'stringify', email: 'stringify@gmail.com' }
```

<hr />
## 객체의 특정 항목을 배열로 그룹화하기

```js
function GroupBy(array, property) {
  return array.reduce((acc, obj) => {
    let key = obj[property]
    acc[key] = acc[key] || []
    acc[key].push(obj)
    return acc
  }, {})
}

const users = [
  { name: 'Kim', age: 30 },
  { name: 'Park', age: 28 },
  { name: 'Lee', age: 28 },
]

const groupedUsers = GroupBy(users, 'age')
// groupedUsers:
// {
//  '28': [ { name: 'Park', age: 28 }, { name: 'Lee', age: 28 } ],
//  '30': [ { name: 'Kim', age: 30 } ]
//  }
```

<hr />
## 객체의 배열에서 특정 항목의 값 얻기

```js
function ExtractValue(arr, property) {
  return arr.reduce(function (acc, object) {
    if (property in object) acc.push(object[property])
    return acc
  }, [])
}

const users = [
  { name: 'Kim', age: 30 },
  { name: 'Park', age: 28 },
  { name: 'Lee', age: 28 },
]
const names = ExtractValue(users, 'name')
// names: [ 'Kim', 'Park', 'Lee' ]
```

<hr />
## 특정 값을 배열에 채우기

```js
function FillValue(arr = [], val, start = 0, end = arr.length) {
  if (start < 0 || start >= end || end > arr.length) return arr
  return [
    ...arr.slice(0, start),
    ...arr.slice(start, end).reduce((t, v) => (t.push(val || v), t), []),
    ...arr.slice(end, arr.length),
  ]
}

const arr4 = FillValue([1, 2, 3], 'Kim')
// arr4: [ 'Kim', 'Kim', 'Kim' ]

const arr5 = FillValue([1, 2, 3], 'Kim', 1, 2)
// arr5: [ 1, 'Kim', 3 ]

const arr6 = FillValue([1, 2, 3], 'Kim', 1, 3)
// arr6: [ 1, 'Kim', 'Kim' ]
```

<hr />
## Promise 배열을 순차적으로 실행하기

```js
const runPromisesInSeries = (ps, initialValue) =>
  ps.reduce((p, next) => p.then(next), Promise.resolve(initialValue))

const fetchUserData = username => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('fetchUserData')
      resolve({ name: username })
    }, 500)
  })
}

const renderUserInfo = user => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('renderUserInfo')
      resolve(`<h1>${user.name}</h1>`)
    }, 500)
  })
}

const outputUserInfo = html => {
  return new Promise(resolve => {
    console.log('outputUserInfo')
    resolve({ status: 'success', content: html })
  })
}

const pSeries = runPromisesInSeries(
  [fetchUserData, renderUserInfo, outputUserInfo],
  'Bytefer',
)

pSeries.then(console.log)
```

지금까지 reduce 함수의 10가지 예제를 알아보았는데요.

필요하신 상황에 맞게 골라 쓰시면 좋을 듯합니다.

그럼.
