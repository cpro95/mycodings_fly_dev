---
slug: 2023-03-07-common-beginner-mistakes-in-react
title: 리액트(React) 쓸 때 흔히 범하는 초보자 실수 모음
date: 2023-03-07 09:27:41.705000+00:00
summary: 리액트 처음 배울 때 겪는 실수들 정리해 보았습니다.
tags: ["react", "reactjs", "beginner", "mistake"]
contributors: []
draft: false
---

안녕하세요?

리액트(React)는 너무 사랑스러운 넘버원 자바스크립트 라이브러리인데요.

저도 처음 배울 때는 이게 왜 안되느냐고 하고 많이 고민했었습니다.

그래서 제가 겪은 실수를 반복하지 않기 위해 함께 공유하고자 이 글을 쓰게 됐네요.

---

## 1. 배열에 항목이 있을 때 조건 검색

일단 아래와 같이 가장 일반적인 useState 코드를 보실까요?

```js
import React from 'react';

function ShoppingList({ items }) {
  return (
    <>
      <h1>Shopping List</h1>
      <ul>
        {items.map((item, index) => {
          // NOTE: We shouldn't use “index” as the key!
          // This is covered later in this post 😄
          return (
            <li key={index}>
              {item}
            </li>
          );
        })}
      </ul>
    </>
  );
}

function App() {
  const [items, setItems] = React.useState([]);
  
  return (
    <div>
      {items.length && <ShoppingList items={items} />}
    </div>
  );
}

export default App;
```

위 코드가 가장 많이 쓰이는 표현인데요.

쇼핑리스트에 뭔가가 있을 때만 쇼핑리스트를 보여주는 코드인데요.

뭐가 잘못됐을까요?

위 코드를 실행해 보면 그냥 0이라는 표시만 나옵니다.

왜냐하면 items.length는 현재 0이고 그래서 items.length는 자바스크립트에서 0으로 인식됩니다.

자바스크립트에서 0이라는 숫자는 '거짓'의 의미가 있는데요.

그래서 && 연산자에 의해 'false && true'는 무조건 처음이 false이기 때문에 true까지 연산평가가 안 됩니다.

그래서 0이라는 표시가 화면에 나오는 거죠.

그럼 어떻게 해야 될까요?

```js
function App() {
  const [items, setItems] = React.useState([]);
return (
    <div>
      {items.length > 0 && (
        <ShoppingList items={items} />
      )}
    </div>
  );
}
```

위와 같이 items.length > 0 이라는 좀 더 명확한 표현식을 쓰면 됩니다.

좀 더 코드를 짧게 하려면 삼항 연산자를 아래와 같이 쓰면 되고요.

```js
function App() {
  const [items, setItems] = React.useState([]);
return (
    <div>
      {items.length
        ? <ShoppingList items={items} />
        : null}
    </div>
  );
}
```

---

## 2. State를 바꿀 때 흔히 저지르는 실수

두 번째는 저도 처음에 이해가 안 된 개념인데요.

리액트(React)만의 State 개념입니다.

일단 다음 코드를 보실까요?

```js
import React from 'react';

function ShoppingList({ items }) {
...
...
...
}
function NewItemForm({ handleAddItem }) {
...
...
...
}

function App() {
  const [items, setItems] = React.useState([
    'apple',
    'banana',
  ]);
  
  function handleAddItem(value) {
    items.push(value);
    setItems(items);
  }
  
  return (
    <div>
      {items.length > 0 && <ShoppingList items={items} />}
      <NewItemForm handleAddItem={handleAddItem} />
    </div>
  )
}

export default App;
```

handleAddItem 함수를 보면 items라는 리액트 스테이트(state)에 배열 메서드인 push를 이용해서 항목을 추가하고 있는데요.

이 방식이 왜 잘못된 거냐 하면 바로 리액트의 가장 기본이 되는 규칙을 어겨서 그렇습니다.

리액트는 스테이트(state)의 변화를 감지할 때 가장 기본적으로 그 변수의 본질(identity)를 보는데요.

items.push(value) 코드를 실행한다고 해서 리액트 스테이트(state)의 본질이 변하지 않습니다.

왜냐하면 items라는 변수가 처음 만들어졌을 때의 메모리상의 주소가 변동되지 않았기 때문이죠.

그래서 리액트는 스테이트가 변했다는 걸 알 수 없는 거죠.

그러면 어떻게 해야 할까요?

리액트에서는 스테이트(state)를 변경시킬 때는 무조건 새로운 변수를 만듭니다.

아래처럼요.

```js
function handleAddItem(value) {
  const nextItems = [...items, value];
  setItems(nextItems);
}
```

바로 배열의 스프레드 연산자를 이용해서 기존의 배열값과 함께 새로운 항목을 추가한 완전히 새로운 배열을 생성해 냅니다.

그리고 그걸 setItems() 함수로 리액트에 스테이트가 변경됐다고 알리는 거죠.

객체일 경우에도 다음과 같이 객체의 스프레드 연산자를 이용하면 됩니다.

```js
// ❌ 잘못된 예
function handleChangeEmail(nextEmail) {
  user.email = nextEmail;
  setUser(user);
}
// ✅ 새로운 객체를 만들어야.
function handleChangeEmail(email) {
  const nextUser = { ...user, email: nextEmail };
  setUser(nextUser);
}
```

객체에도 스프레드 연산자가 통하니까 꼭 알아두시면 좋습니다.

---

## 3. key 안 만들었다고 경고가 뜰 때

리액트(React)에만 있는 건데요.

아래와 같이 경고를 많이들 보셨을 건데요.

```bash
Warning: Each child in a list should have a unique "key" prop.
```

일단 코드를 보시죠.

```js
function ShoppingList({ items }) {
  return (
    <ul>
      {items.map((item) => {
        return (
          <li>{item}</li>
        );
      })}
    </ul>
  );
}
```

리액트에서 반복된 노드(node)를 표현할 때는 무조건 각각의 노드에 대한 key 값을 지정해 줘야 합니다.

그래서 배열의 map 메서드에 있는 아래 기능을 이용해야 하는데요.

```js
function ShoppingList({ items }) {
  return (
    <ul>
      {items.map((item, index) => {
        return (
          <li key={index}>{item}</li>
        );
      })}
    </ul>
  );
}
```

위 방식도 코드가 복잡해지면 별로 안전한 건 아닌데요.

DB에서 받아오면 DB의 id를 key로 지정하면 됩니다.

DB에서 받아오지 못하는 경우라면 key 부분을 유니크하게 지정할 수 있는 빌트인(built-in) 함수가 있는데요.

```js
function handleAddItem(value) {
  const nextItem = {
    id: crypto.randomUUID(),
    label: value,
  };
  const nextItems = [...items, nextItem];
  setItems(nextItems);
}
```
위 코드를 보시면 아예 state에 id 부분을 추가했습니다.

그리고 그 id 부분을 생성하는 코드는 바로 요즘 브라우저에는 무조건 들어있는 빌트인(built-in) 객체인 crypto를 쓰면 됩니다.

randomUUID() 함수는 절대로 같은 값을 리턴하지 않는데요.

이 함수는 "d9bb3c4c-0459-48b9-a94c-7ca3963f7bd0" 이렇게 해쉬코드를 리턴합니다.

절대 같은 값이 나올 수 없겠죠.

그렇다고 아래와 같이 하면 안 됩니다.

```js
// ❌ 이렇게 해선 안 됩니다.
<li key={crypto.randomUUID()}>
  {item.label}
</li>
```

위와 같이 하면 렌더링 될 때마다  id가 계속 변합니다. id가 변하면 리액트(React)는 계속 관련된 노드(node)를 삭제, 생성하는데요.

성능상 큰 문제가 될 수 있습니다.

---

## 4. 빈칸은 어떻게 표현할까요?

JSX는 HTML 코드로 변환되는데요.

아래와 같은 코드가 있다고 생각해 봅시다.

```js
return (
    <p>
      Welcome to mycodings.fly.dev!
      <a href="/login">Log in to continue</a>
    </p>
  );
```

p 태그 안에 a 앵커 태그가 있는데요.

a 태그 앞에 빈칸을 넣고 싶다면 어떻게 할까요?

a 태그 앞에 아무리 많은 빈칸을 넣어도 아래와 같이 나옵니다.

```bash
Welcome to mycodings.fly.dev!Log in to continue
```

이럴 때는 아래와 같이 하시면 됩니다.

```js
return (
    <p>
      Welcome to mycodings.fly.dev!
      {' '}
      <a href="/login">Log in to continue</a>
    </p>
  );
```

---

## 5. 스테이트(state) 변경 후 접근하기

가장 기본적인 카운터 예를 들어서 알아볼까요?

```js
import React from 'react';

function App() {
  const [count, setCount] = React.useState(0);
  
  function handleClick() {
    setCount(count + 1);
    
    console.log({ count });
  }
  
  return (
    <button onClick={handleClick}>
      {count}
    </button>
  );
}

export default App;
```

handleClick() 함수에서 console.log() 함수를 통해 현재 count 값을 알아보고자 합니다.

디버그할 때 아주 유용하죠.

그런데 위 코드를 실행해 본다면, 만약 버튼을 눌러 카운터를 1 증가시켰다면 console.log() 함수가 그걸 반영해야 하는데요.

실제 console.log() 함수가 보여주는 값은 변경 전 state 값입니다.

왜냐하면 초보자들은 setCount()라는 useState 훅이 비동기식(asynchronous)인지 모르기 때문이죠.

우리가 파이썬이나 기타 언어에서 쓰는 동기식(synchronous) 코드에 익숙해져 있어 그런 겁니다.

동기식(synchronous) 방식에 익숙해졌던 초보자들은 위 코드가 실제로 아래와 같이 작동된다고 이해할 겁니다.

```js
count = count + 1;
console.log({count});
```

위 코드는 동기식(synchronous)이죠.

근데 useState 훅은 비동기식(asynchronous)입니다.

setCount(count + 1) 명령어가 실행되면 뒤에서 작동한다고 이해하면 쉽습니다.

뒤에서 실행되는 동안 메인 쓰레드는 바로 다음 console.log() 코드를 실행하죠.

그래서 count 값이 예전 값만 출력되는 이유입니다.

이걸 해결하는 방법은 간단합니다.

```js
function handleClick() {
  const nextCount = count + 1;
  setCount(nextCount);
  
  console.log({ nextCount });
}
```

아예 처음부터 nextCount라는 값을 새로 동기식으로 만들고 그걸 setCount() 비동기식 useState 훅에 넣어주는 거죠.

---

## 6. JSX에서 여러 개의 항목을 리턴할 때

가장 일반적인 에러인데요.

리액트(React) 컴포넌트는 JSX에서 여러 개의 항목을 리턴할 수 없습니다.

```bash
Adjacent JSX elements must be wrapped in an enclosing tag.
```

이런 에러를 많이 보셨는데요.

무조건 리턴하려는 항목을 한 개의 태그 안에 넣어야 하는 거죠.

이 에러가 생기는 원인이 뭔지 궁금하실 텐데요.

다음과 같은 예제 코드가 있다고 합시다.

```js
function LabeledInput({ id, label, ...delegated }) {
  return (
    <label htmlFor={id}>
      {label}
    </label>
    <input
      {...delegated}
    />
  );
}

export default LabeledInput;
```

label 태그와 input 태그 두 개를 리턴하고 있는데요.

리액트(React)에서 `<></>` 태그로 감싸라고 안내해 줍니다.

그러면 왜 이런 에러가 나올까요?

그건 바로 JSX가 컴파일된 후의 코드를 보시면 됩니다.

```js
function LabeledInput({ id, label, ...delegated }) {
  return (
    React.createElement('label', { htmlFor: id }, label)
    React.createElement('input', { ...delegated })
  );
}
```

JSX가 컴파일되면 위와 같이 컴파일되는데요.

자바스크립트에서 함수는 두 개 이상의 항목을 return 하지 못합니다.

근데 위 코드를 보시면 return 되는 게 두 개의 항목이 되는 거죠.

그래서 꼭 `<></>` 태그로 감싸라는 에러가 나오는 이유죠.

만약 `<div></div>`처럼 한 개의 태그로 감싸면 JSX는 다음과 같이 컴파일돼서 자바스크립트 문법에 맞게 되는 겁니다.

```js
function LabeledInput({ id, label, ...delegated }) {
  return React.createElement(
    'div',
    {},
    React.createElement('label', { htmlFor: id }, label),
    React.createElement('input', { ...delegated })
  );
}
```

위 코드에서 보면 return 항목이 한 개인 거죠.

이럴 때 쓰라고 나온 게 React.Fragment인데요.

사실 `<></>` 이 표현이 React.Fragment입니다.

```js
function LabeledInput({ id, label, ...delegated }) {
  return (
    <React.Fragment>
      <label htmlFor={id}>
        {label}
      </label>
      <input
        {...delegated}
      />
    </React.Fragment>
  );
}
```

위 코드처럼 Fragment를 사용하면 불필요한 `<div>`를 쓰지 않아도 됩니다.

`<></>` 이 태그는 Fragment의 다른 표현으로 리액트 개발팀이 만든 겁니다.

---

## 7. useState 초기화가 필요한 이유

다음과 같이 useState 초기화를 안 한 코드가 있다고 합시다.

```js
function App() {
  const [email, setEmail] = React.useState();
  
  return (
    <form>
      <label htmlFor="email-input">
        Email address
      </label>
      <input
        id="email-input"
        type="email"
        value={email}
        onChange={event => setEmail(event.target.value)}
      />
    </form>
  );
}
```

이 코드를 실행하면 아래와 같이 경고가 뜨는데요.

```bash
Warning: A component is changing an uncontrolled input to be controlled.
```

uncontrolled 관련 경고인데요.

리액트의 데이터 바인딩과 관련된 경고입니다.

해결책은 역시나 useState 초기화입니다.

```js
const [email, setEmail] = React.useState('');
```

---

## 8. JSX에서 style 표시하기

JSX는 리액트팀에서 처음 만들 때 HTML과 가장 유사하게 만들었는데요.

기존 HTML 작성과 이질감이 덜 들게 하기 위해서인데요.

그래서 간혹 className이라고 안 쓰고 class라고 쓰면 친절하게 className을 쓰라고 알려줍니다.

그런데 유독 style만은 틀린데요.

JSX에서 style을 전달할 때는 무조건 객체(Object)로 건네줘야 합니다.

```js
<button
  style={ color: 'red', fontSize: '1.25rem' }
>
  Hello World
</button>
```

위와 같이 style을 작성한다고 생각할 수 있는데요.

위 표현은 틀렸습니다.

왜냐하면 JSX 내에서 HTML 코드를 쓰는 거는 자바스크립트 코드가 아니기 때문이죠.

JSX에서 style을 전달할 방법은 무조건 객체로 전달해야 한다고 했습니다.

그래서 자바스크립트 코드를 쓸 수 있는 상태에서 객체를 전달해야 합니다.

JSX에서는 `{}`을 쓰면 이 안에는 자바스크립트 코드를 쓸 수 있습니다.

그래서 위 코드는 아래와 같이 더블 `{{}}`을 써야 합니다.

```js
<button
  style={{ color: 'red', fontSize: '1.25rem' }}
>
  Hello World
</button>
```

그리고 CSS에서는 대쉬 형태 즉, font-size라고 쓰지만, JSX에서는 낙타 형식을 씁니다.

fontSize 처럼요.

style 형식을 미리 객체 변수로 지정해서 사용할 수도 있습니다.

```js
// 1. 미리 객체를 만든다.
const btnStyles = { color: 'red', fontSize: '1.25rem' };

// 2. 미리 만든 객체를 style의 속성값으로 전달한다.
// 이때는 {} 한 개만 필요합니다.
<button style={btnStyles}>
  Hello World
</button>

// 아니면 한 줄로 {{}} 더블 브라켓을 사용하면 됩니다.
<button style={{ color: 'red', fontSize: '1.25rem' }}>
```

---

## 9. useEffect에서 async(비동기식) 함수 사용

리액트는 클라이언트 사이드 쪽 코드인데요.

그래서 클라이언트 상에서 API를 통해 데이터를 가져오려면 useEffect 훅을 사용합니다.

다음과 같은 코드가 있다고 합시다.

```js
React.useEffect(() => {
    const url = `${API}/get-profile?id=${userId}`;
    const res = await fetch(url);
    const json = await res.json();
    
    setProfileData(json);
  }, [userId]);
  
  if (!profileData) {
    return 'Loading…';
  }
```

위 코드는 에러가 나오는데요.

```bash
'await' is only allowed within async functions
```

바로 await를 실행하려면 await가 쓰이는 곳이 async 함수여야 합니다.

이때를 위해 익명 함수가 필요한데요.

```js

React.useEffect(async () => {
  const url = `${API}/get-profile?id=${userId}`;
  const res = await fetch(url);
  const json = await res.json();
  setProfileData(json);
}, [userId]);
```

사실 위 코드도 작동이 안 됩니다.

useEffect 훅의 콜백 함수가 async가 되면 안 됩니다.

그래서 아래와 같이 아예 useEffect 훅의 콜백 함수 안에 async 함수를 만들고 useEffect 콜백 함수에서 그 async 함수를 호출해서 사용해야 합니다.

```js
React.useEffect(() => {
  // async 함수를 만들고
  async function runEffect() {
    const url = `${API}/get-profile?id=${userId}`;
    const res = await fetch(url);
    const json = await res.json();
    setProfileData(json);
  }
  // 나중에 따로 async 함수를 불러와야 합니다.
  runEffect();
}, [userId]);
```

왜 그런 걸까요?

좀 더 깊이 생각해 봅시다.

일단 다음과 같은 코드가 있다고 합시다.

```js
async function greeting() {
  return "Hello world!";
}
```

위 코드는 async 함수인데요. 간단히 생각해 볼 때 greeting 함수는 "Hello world!" 문자열을 리턴한다고 생각할 수 있는데요.

아닙니다.

async 키워드가 들어가면 그 함수는 Promise를 리턴합니다.

이때 이 Promise가 resolve 돼야지만 "Hello world!" 문자열을 리턴하게 됩니다.

Promise가 Reject되면 아무것도 리턴이 되지 않죠.

그럼, 왜 useEffect 훅에서 async 함수가 바로 쓰이면 안 될까요?

useEffect 훅은 리턴되는게 cleanup 코드이거나 아니면 아무것도 리턴하지 않는 리액트 훅입니다.

그런데 aysnc 함수를 그대로 쓰면 Promise를 리턴한다는 뜻이 되기 때문입니다.

보통은 클린업 코드를 잘 사용 안 하는데요.

useEffect 훅의 정확한 표현은 아래와 같습니다.

```js
React.useEffect(() => {
  async function runEffect() {
    // Effect logic here
  }
  runEffect();
  return () => {
    // Cleanup logic here
  }
}, [userId]);
```

useEffect 훅의 콜백 함수는 바로 또 다른 콜백 함수를 리턴한다는 뜻입니다.

---

이제까지 리액트 초보자가 겪는 실수들 즉, 헷갈려야 할 부분을 살펴보았는데요.

나중에 리액트 중급, 고급자가 돼도 가끔 한번 읽어 보는 것도 좋을 듯싶습니다.

그럼.