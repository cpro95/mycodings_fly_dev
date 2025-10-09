---
slug: 2022-11-27-important-javascript-skills-before-learning-react
title: React 배우기 전에 알아야 할 자바스크립트 문법
date: 2022-11-27 09:34:06.964000+00:00
summary: React 배우기 전에 알아야 할 자바스크립트 문법
tags: ["javascript", "tutorial"]
contributors: []
draft: false
---

![](https://blogger.googleusercontent.com/img/a/AVvXsEgG4PdSC1mevn77s4mkjdDGCJbd3HidCaJX9Ca2_zgbIttqw5Av8btB3rlE8EzGVcaTJ3YQZRDloFlJhTnsk8jdrs0mzIpThSLpbfWK_Ke6nKg07c2hvD6US_BCLsfQiy-a15UMC_mE0CivmYLnIHWvT0FgQWNqM8GmXf-V1LIO2bgduA_zemVS3CSc=s16000)

안녕하세요?

오늘은 ReactJS를 본격적으로 배우기 전에 알아야 할 자바스크립트 문법에 대해 알아보겠습니다.

즉, React에서 가장 많이 쓰이는 자바스크립트 문법이기 때문에 꼭 알아둬야 한다는 얘기죠.

## 삼항 연산자(The Ternary Operator)

React에서는 컴포넌트 안에서 if else 문을 쓰지 않고 삼항 연산자를 씁니다.

```js
// 기본 문법
condition ? 'True' : 'False';

// 기존 if-else 문
if(condition) {
    'True'
}
else {
    'False'
}:
```

React에서는 if-else문을 안 쓰고 삼항 연산자를 쓰니 꼭 사용법을 알아 두셔야 합니다.

그리고 삼항 연산자를 if-else-if-else 같이 중첩으로도 사용할 수 있습니다.

```js
condition ? 'true' : second_condition ? 'second_true' : 'false'
```

## 디스트럭쳐링 (Destructuring)

ES6의 기능인 디스트럭쳐링은 React에서 아주 많이 쓰이고, 실제 아주 유용합니다.

```js
// 디스트럭쳐링 사용
const testObject = ['chair', 'phone', 'orange']
const [chair, phone, fruit] = testObject

// 디스트럭쳐링 사용하지 않을 때는
const chair = testObject[0]
const phone = testObject[1]
const fruit = testObject[2]
```

디스트럭쳐링은 React 컴포넌트의 props 핸들링에 있어 아주 편한 기능입니다.

```js
// 디스트럭쳐링 예제 1
function testComponent({ fruit }) {
  return <div>{fruit}</div>
}

// 디스트럭쳐링 예제 2
function testComponent(props) {
  const { chair, phone, fruit } = props
  return <div>{fruit}</div>
}

// 디스트럭쳐링 없이 사용
function Fruit(props) {
  return <div>{props.fruit}</div>
}
```

위 컴포넌트 예를 보시면 디스트럭쳐링이 얼마나 편한지 알 수 있을 겁니다.

## 스프레드 연산자(The Spread operator)

스프레드 연산자도 ES6의 주요 기능인데요.

React에서 정말 자주 사용하는 기능이라 꼭 개념을 익혀 두셔야 합니다.

```js
const [users, setUsers] = useState([
  {
    id: '',
    name: '',
    age: '',
  },
])

setUsers([
  ...users,
  {
    id: '5',
    name: 'Jung',
    age: '34',
  },
])
```

위 코드에서 보시면 setUsers 함수에서 ...users처럼 스프레드 연산자를 썼습니다.

기존 users 정보를 모두 복사하는 아주 편리한 연산자죠.

꼭 배워 두셔야 합니다.

## Array methods

자바스크립트에서 가장 많이 쓰이는 데이터 타입은 바로 배열인데요.

특히 React에서는 Array.map 메소드를 가장 많이 씁니다.

그래서 꼭 map 사용법을 익혀두어야 하는데요.

```js
let users = [
  { firstName: 'Susan', lastName: 'Steward', age: 14, hobby: 'Singing' },
  { firstName: 'Daniel', lastName: 'Longbottom', age: 16, hobby: 'Football' },
  { firstName: 'Jacob', lastName: 'Black', age: 15, hobby: 'Singing' },
]
```

위와 같이 객체의 배열이 있다고 하면 보통 이걸 map을 이용해서 React에 표시합니다.

```js
let singleUser = users.map(user => {
  let fullName = user.firstName + ' ' + user.lastName
  return `
    <h3 class='name'>${fullName}</h3>
    <p class="age">${user.age}</p>
  `
})
```

두 번째로 filter 메소드도 많이 쓰이는데요.

```js
let users = [
  { firstName: 'Susan', age: 14 },
  { firstName: 'Daniel', age: 16 },
  { firstName: 'Bruno', age: 56 },
  { firstName: 'Jacob', age: 15 },
  { firstName: 'Sam', age: 64 },
  { firstName: 'Dave', age: 56 },
  { firstName: 'Neils', age: 65 },
]
```

```js
// 15세 이하
const youngPeople = users.filter(person => {
  return person.age <= 15
})

// 50세 이상
const seniorPeople = users.filter(person => person.age >= 50)

console.log(seniorPeople)
console.log(youngPeople)
```

세 번째로 find 메소드도 종종 쓰입니다.

```js
const Bruno = users.find(person => person.firstName === 'Bruno')

console.log(Bruno)
```

## 애로우 함수 (Arrow function)

React에서는 function으로 함수를 정의하는 거보다 애로우 함수로 함수 정의하는 게 많습니다.

왜냐하면 애로우 함수가 좀 더 코드를 간결하게 해 주기 때문입니다.

```js
// Regular Functions
function hello() {
  return 'hello'
}

// Arrow Functions
let hello = () => 'hello'
```

## Promises

Promise도 React 코드에서 많이 쓰이는데요.

```js
let promise = new Promise((resolve, reject) => {
  const i = 'Promise'
  i === 'Promise' ? resolve() : reject()
})

promise
  .then(() => {
    console.log('Your promise is resolved')
  })
  .catch(() => {
    console.log('Your promise is rejected')
  })
```

특히 promise의 then과 catch를 많이 이용합니다.

## Fetch API

React에서 API의 자료를 가지고 올 때 쓰이는 fetch 함수는 정말 중요한데요.

```js
fetch('http://example.com/books.json')
  .then(response => response.json());
  .then(data => setState(data));
```

두 번째 보시면 json() 함수로 json 형태로 꼭 변환해야 합니다.

왜냐하면 response는 promise 타입이라 React에서는 데이터로 표현할 수 없기 때문에 json 형식으로 꼭 바꿔줘야 합니다.

## async / await

비동기식 함수 작성에 있어 async 와 await가 많이 쓰이는데요.

```js
async function asyncFunction() {
  let promise = new Promise(resolve => {
    resolve()
  })
  let response = await promise
  return console.log(response)
}
```

async / await 사용법은 꼭 배워두셔야 합니다.

## ES module import export

ES6에서 쓰이는 모듈의 import와 export도 배워 두어야 합니다.

```js
function Component() {
  return <div>This is a component</div>
}

export default Component

import Component from './Component'

function App() {
  return <Component />
}
```

지금까지 React를 배우기 전에 알아야 할 자바스크립트 문법에 대해 알아보았는데요.

위에서 설명한 것만 제대로 익혀두시면 React 코드 짜는 데 있어 많은 도움이 될 겁니다.

그럼.
