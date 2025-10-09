---
slug: 2022-11-27-react-practices
title: React 코드 작성에 있어 가장 효율적인 관행은?
date: 2022-11-27 12:31:05.423000+00:00
summary: React 코드 작성에 있어 가장 효율적인 관행은?
tags: ["react"]
contributors: []
draft: false
---

안녕하세요?

React 코드 작성에 있어 가장 효율적인 관행에 대해 알아보겠습니다.

<hr />
## ES6 문법

### 애로우 함수 사용하기(Arrow Functions)

```js
// ES5
function getSum(a, b) {
  return a + b
}

// ES6
const getSum = (a, b) => a + b
```

### 템플릿 리터럴로 문자열 나타내기(Use Template Literal)

```js
// ES5
var name = 'Bilal'
console.log('My name is ' + name)

// ES6
const name = 'Bilal'
console.log(`My name is ${name}`)
```

### var 대신 const & let 사용하여 변수 선언

const 와 let 은 블록 스코프를 가집니다.

```js
// ES5
var fruits = ['apple', 'banana']

// ES6
let fruits = ['apple', 'banana']
fruits.push('mango')

const workingHours = 8
```

### 객체 디스트럭쳐링 (Object Destructuring)

```js
var person = {
  name: 'John',
  age: 40,
}

// ES5
var name = person.name
var age = person.age

// ES6
const { name, age } = person
```

### 객체 정의(Defining Objects)

```js
var name = 'John'
var age = 40
var designations = 'Full Stack Developer'
var workingHours = 8

// ES5
var person = {
  name: name,
  age: age,
  designation: designation,
  workingHours: workingHours,
}

// ES6
const person = { name, age, designation, workingHours }
```

<hr />

## React 문법

### 배열을 map 할 때 key prop을 꼭 넣자

```js
const students = [
  { id: 1, name: 'Bilal' },
  { id: 2, name: 'Haris' },
]

// in return function of component
;<ul>
  {students.map(({ id, name }) => (
    <li key={id}>{name}</li>
  ))}
</ul>
```

## 컴포넌트 이름은 첫 글자를 대문자로 하는 PascalCase로

```js
const helloText = () => <div>Hello</div> // wrong

const HelloText = () => <div>Hello</div> // correct
```

## 변수나 함수 이름은 첫 글자가 소문자인 camelCase로

```js
const working_hours = 10 // bad approach

const workingHours = 10 // good approach

const get_sum = (a, b) => a + b // bad approach

const getSum = (a, b) => a + b // good approach
```

## HTML 코드에서 ID와 className 은 kebab-case로

```js
<!--bad approach-->
<div className="hello_word" id="hello_world">Hello World</div>

<!--good approach -->
<div className="hello-word" id="hello-world">Hello World</div>
```

## 객체(Object)와 배열(Array)에서 꼭 null과 undefined 체크하기

```js
const person = {
  name: 'Haris',
  city: 'Lahore',
}
console.log('Age', person.age) // error
console.log('Age', person.age ? person.age : 20) // correct
console.log('Age', person.age ?? 20) //correct

const oddNumbers = undefined
console.log(oddNumbers.length) // error
console.log(oddNumbers.length ? oddNumbers.length : 'Array is undefined') // correct
console.log(oddNumbers.length ?? 'Array is undefined') // correct
```

## 인라인 스타일링 자제하기

인라인 스타일링은 꼭 필요하지 않으면 되도록 쓰지 마세요.

코드가 지저분 해집니다.

되도록 css 클래스나 id를 이용해서 작성 바랍니다.

```js
const text = <div style={{ fontWeight: 'bold' }}>Happy Learing!</div> // bad approach

const text = <div className='learning-text'>Happy Learing!</div> // good approach
```

## React 코드에서 DOM 조작을 직접 하지 않기

되도록 useState를 사용하십시오.

```js
// bad
;<div id='error-msg'>Please enter a valid value</div>
document.getElementById('error-msg').visibility = visible

// good
const [isValid, setIsValid] = useState(false)
;<div hidden={isValid}>Please enter a valid value</div>
```

## useEffect 에서 항상 이벤트 리스너 제거하기

```js
const printHello = () => console.log('HELLO')
useEffect(() => {
  document.addEventListener('click', printHello)
  return () => document.removeEventListener('click', printHello)
})
```

## 비슷한 컴포넌트는 범용 컴포넌트를 만들어서 props만 바꿔서 사용하기

```js
const Input=(props)=>{
  const [inputValue, setInputValue]=useState('');
  return(
    <label>{props.thing}</label>
    <input type='text' value={inputValue} onChange={(e)=>setInputValue(e.target.value)} />
  )
}

// in your react component
<div>
  <Input thing="First Name" />
  <Input thing="Second Name" />
</div>
```

## if-else 대신 삼항 연산자 사용하기

```js
// Bad approach
if (name === 'Ali') {
  return 1
} else if (name === 'Bilal') {
  return 2
} else {
  return 3
}

// Good approach
name === 'Ali' ? 1 : name === 'Bilal' ? 2 : 3
```

## 컴포넌트 props는 디스트럭쳐링해서 쓰기

```js
// Bad approach
const Details = props => {
  return (
    <div>
      <p>{props.name}</p>
      <p>{props.age}</p>
      <p>{props.designation}</p>
    </div>
  )
}

// Good approach
const Details = ({ name, age, designation }) => {
  return (
    <div>
      <p>{name}</p>
      <p>{age}</p>
      <p>{designation}</p>
    </div>
  )
}
```

## useState로 지정한 State 변수는 비동기식이라서 같은 함수에서 변경된 값을 조회하는 행동은 하지 마세요.

```js
const Message = () => {
  const [message, setMessage] = useState('Hello World')
  const changeMessage = messageText => {
    setMessage('Happy Learning')
    console.log(message) // It will print Hello World on console
  }

  return <div>{message}</div>
}
```

위 코드에서 setMessage로 State 변숫값을 변경했고 바로 그다음에 그 값을 참조했는데요.

useState는 Async 비동기식으로 작동하기 때문에 우리가 의도한 대로 작동되지 않습니다.

## 항상 === 사용하기

```js
'2' == 2 ? true : false // true
'2' === 2 ? true : false // false
```

이상으로 React 코드 작성에 있어 대체로 잘 알려진 관행에 대해 알아보았는데요.

꼭 옳다는 얘기는 아니지만 되도록 위와 같이 코드 작성 관행을 지키면 좀 더 깔끔하고 좋은 코드가 될 것입니다.

그럼.
