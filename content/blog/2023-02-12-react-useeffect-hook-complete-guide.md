---
slug: 2023-02-12-react-useeffect-hook-complete-guide
title: 내가 보려고 만든 React useEffect Hook 설명서
date: 2023-02-12 10:19:53.085000+00:00
summary: useEffect 훅 컴플리트 가이드
tags: ["useeffect", "react"]
contributors: []
draft: false
---

리액트에서 아마 가장 많이 쓰는 훅이 바로 useEffect 훅인데요.

그럼, 먼저 useEffect 훅이 언제 쓰이는지 살펴볼까요?

1. API 콜을 이용해서 데이터를 fetch해서 UI 컴포넌트의 STATE를 업데이트할 때 쓰고,
2. 또는 STATE가 바뀔 때 새로운 데이터로 UI 컴포넌트를 새로 고칠 때 쓰고,
3. localStorage에 있는 데이터를 다룰 때 쓰고,
4. 자바스크립트 이벤트 리스너를 추가하고 제거할 때 쓰입니다.

## useEffect의 문법

```js
useEffect(() => {
  // function body
}, [dependencies])
```

useEffect 훅은 기존 React의 클래스 기반 컴포넌트가 아니라 함수형 컴포넌트에서 쓰이는 훅입니다.

useEffect 훅은 두 개의 인자를 받는데요, 하나는 실행할 함수 자체고 하나는 dependencies 입니다.

컴포넌트가 렌더되면 useEffect 훅이 실행되는데요.

또는 dependencies 가 변할 때마다 useEffect 훅이 작동됩니다.

useEffect는 cleanup 함수도 가질 수 있는데요.

```js
useEffect(() => {
  // effect function
  return () => {
    // cleanup function
  }
}, [dependencies])
```

return 문구에 cleanup 함수를 지정하면 useEffect 훅이 재실행되기 전에 실행됩니다.

또는 컴포넌트가 언마운트되기 전에 실행되고요.

## 실제 useEffect 사용 예

'react' 라이브러리에서 useEffect 훅을 import 해야 쓸 수 있습니다.

```js
import { useEffect } from 'react'

function MyComponent() {
  useEffect(() => {
    // Your effect function here
  }, [])

  return <div>Hello World</div>
}
```

그리고 위와 같이 함수형 컴포넌트 안에서만 써야 합니다.

함수형 컴포넌트 밖에서는 쓸 수 없다는 걸 명심하셔야 합니다.

### 예제 1 - dependencies 없을 경우

dependencies 배열이 없을 경우 useEffect 훅은 해당 컴포넌트가 렌더 될 때마다 useEffect 훅이 작동됩니다.

```js
import { useEffect } from 'react'

function MyComponent() {
  useEffect(() => {
    console.log('This will be run every time the component renders')
  })

  return <div>Hello World</div>
}
```

실제로는 위와 같이 쓰지는 않는데요.

### 예제 2 - dependencies에 빈 배열을 넣을 경우

우리가 가장 많이 쓰이는 경우인데요.

dependencies에 빈 배열을 넣으면 useEffect 훅은 컴포넌트가 DOM에 마운트 될 때 딱 한 번만 실행됩니다.

아래와 같이 API를 이용해 데이터를 가져올 때 사용하는 가장 좋은 경우가 되죠.

왜냐하면 매번 컴포넌트가 새로 렌더링 될 때마다 데이터를 새로 가져오는 것은 데이터 낭비이니까요.

```js
import { useEffect, useState } from 'react'

function Posts() {
  const [posts, setposts] = useState([])
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users/1/posts')
      .then(resp => resp.json())
      .then(blogPosts => setposts(blogPosts))
  }, [])

  return (
    <div className='App'>
      {posts && posts.map(post => <li>{post.title}</li>)}
    </div>
  )
}

export default Posts
```

또, dependencies에 빈 배열을 넣는 경우는 아마도 다음과 같을 겁니다.

1. 특정 사이트를 방문했을 떼 해당 페이지의 타이틀을 바꾸고 싶을 때,

2. 사용자가 페이지를 방문했을 때 벡엔드로 유저 정보를 넘기고 싶을 때.

### 예제 3 - dependencies에 뭔가를 넣었을 때

dependencies에 뭔가를 넣으면 해당 dependencies가 바뀔 때마다 useEffect 훅이 작동됩니다.

만약, 사용자가 Search 폼(Form)에서 무언가 찾으려고 할 때 키보드 한 글자, 한 글자 눌렀을 때 해당 검색 결과가 바로 나타나게 하는 경우, 이런 경우가 가장 좋은 예입니다.

아래와 같은 Search 컴포넌트에서 보시면 search 키워드가 변할 때마다 useEffect 훅이 재 실행되고 그 결과를 바로 사용자에게 알려주게 됩니다.

```js
import { useEffect, useState } from 'react'

function Search() {
  const [posts, setposts] = useState([])
  const [search, setsearch] = useState('')

  useEffect(() => {
    const filteredPosts = posts.filter(p => p.title.includes(search))
    setposts(filteredPosts)
  }, [search])

  return (
    <div className='App'>
      {posts && (
        <input
          type='text'
          value={search}
          onChange={e => setsearch(e.target.value)}
        />
      )}
      {posts && posts.map(post => <li>{post.title}</li>)}
    </div>
  )
}

export default Search
```

예제 4 - 클린업 함수 제공

클린업 함수를 제공하는 경우는 좀 특별한 경우인데요.

예를 든다면, 만약 드롭다운 메뉴를 만들었는데 사용자가 드롭다운 메뉴를 한번 누르고, 다시 다른 곳을 클릭했다면, 바로 드롭다운 메뉴를 실행 취소해야 합니다.

이럴 경우에 클린업 코드가 사용되는데요.

```js
import { useEffect, useRef, useState } from 'react'

function Dropdown() {
  const ref = useRef(null)
  const [open, setOpen] = useState(false)
  const [options, setoptions] = useState([
    { key: 1, value: 'Audi' },
    { key: 2, value: 'BMW' },
    { key: 3, value: 'Jaguar' },
    { key: 4, value: 'Ferrari' },
  ])
  const [option, setOption] = useState('')

  useEffect(() => {
    const handleClickOutside = event => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <div ref={ref}>
      <button onClick={() => setOpen(!open)}>Toggle Dropdown</button>
      {open && (
        <ul>
          {options.map(option => (
            <li key={option.key} onClick={() => setOption(option.value)}>
              {option.value}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Dropdown
```

위와 같이 DOM document에 이벤트 리스너를 추가 삭제할 때 가장 좋을 경우가 됩니다.

또 다른 클린업 함수 사용 예는,

1. Socket 베이스 실시간 채팅에서 사용자가 방을 떠났을 때 클린업 함수를 이용해서 Socket disconnect하는 코드를 작성해야 합니다.

2. 또는 이벤트 또는 데이터에 subscription 했을 경우에도 그걸 정리하기 위해서 클린업 코드를 작성해야 합니다.

---

## useEffect 훅을 사용하면 안 되는 경우

### 예제 1

```js
import { useEffect, useState } from 'react'

function MyComponent() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    setCount(count + 1)
  })

  return <div>{count}</div>
}
```

위와 같이 useEffect 훅을 dependencies 없이 사용하면 매번 해당 컴포넌트가 렌더링 될때마다 setCount가 작동합니다. setCount는 STATE이기 때문에 해당 컴포넌트를 Re-rendering 하는데요.

그러면 또 useEffect 훅이 작동합니다. 결구 무한 루프에 걸리는데요.

useEffect 훅의 아주 안 좋은 예입니다.

### 예제 2 - dependencies에 빈 배열도 안 넣었을 경우

useEffect 훅에 빈 배열을 dependencies에 안 넣었을 경우 전체 성능 저하가 생길 수 있는데요.

아래 코드를 보시면 블로그 데이터를 fetch하는 useEffect 훅인데요.

매번 컴포넌트가 새로 렌더링 될 때마다 데이터를 또 fetch하게 됩니다.

이는 결국 해당 컴포넌트의 성능 저하를 불러오는데요.

매우 안 좋은 예입니다.

```js
import { useEffect, useState } from 'react'

function Posts() {
  const [posts, setposts] = useState([])
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users/1/posts')
      .then(resp => resp.json())
      .then(blogPosts => setposts(blogPosts))
  })

  return (
    <div className='App'>
      {posts && posts.map(post => <li>{post.title}</li>)}
    </div>
  )
}

export default Posts
```

### 예제 3 - 불필요한 dependencies를 넣었을 경우

그렇다고 dependencies에 아무거나 넣으면 어떻게 될까요?

불필요하게 컴포넌트가 Re-Render 되기 때문에 성능저하 문제가 발생합니다.

아래 예를 볼까요?

```js
import { useEffect } from 'react'

function TodoList({ todos, filter }) {
  useEffect(() => {
    console.log('filtering todos')
    // filter todos
  }, [todos, filter])

  return <div>{/* todo list JSX */}</div>
}
```

위 예에선 useEffect 훅은 todos의 filter를 설정하게 되는데요.

filter라는 props가 변할 때마다 useEffect 훅이 계속 작동하는 성능저하가 발생됩니다.

그럴 필요가 없는데 말이죠.

예제 4 - 클린업 함수를 제공 안 했을 때

이벤트 리스너를 사용하고 해당 이벤트 리스너를 삭제하지 않았을 경우인데요.

아래 코드를 보시면,

```js
import { useEffect, useRef, useState } from 'react'

function Dropdown() {
  const ref = useRef(null)
  const [open, setOpen] = useState(false)
  const [options, setoptions] = useState([
    { key: 1, value: 'Audi' },
    { key: 2, value: 'BMW' },
    { key: 3, value: 'Jaguar' },
    { key: 4, value: 'Ferrari' },
  ])
  const [option, setOption] = useState('')

  useEffect(() => {
    const handleClickOutside = event => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    // No Cleanup function
  }, [])

  return (
    <div ref={ref}>
      <button onClick={() => setOpen(!open)}>Toggle Dropdown</button>
      {open && (
        <ul>
          {options.map(option => (
            <li key={option.key} onClick={() => setOption(option.value)}>
              {option.value}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Dropdown
```

클린업 함수에 이벤트 리스터 삭제하는 코드를 넣지 않았습니다.

이러면 Dropdown 컴포넌트가 un-mount 돼도 해당 이벤트 리스너가 계속 작동되게 되며, 결국 메모리 누수 문제로 이어지며 해당 애플리케이션이 성능저하에 빠지게 됩니다.

그래서 항상 DOM 이벤트 관련 작업을 했을 경우 무조건 해당 이벤트를 지워주는 코드를 꼭 작성해야 합니다.

지금까지 제가 보려고 만든 useEffect 훅 자습서였습니다.

그럼.
