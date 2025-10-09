---
slug: 2023-11-11-svelte-by-example-for-beginner-level
title: 예제로 배우는 Svelte - 초급편
date: 2023-11-11 12:47:14.989000+00:00
summary: 예제로 배우는 Svelte - 초급편
tags: ["sveltejs"]
contributors: []
draft: false
---

전체 강좌 목록입니다.

1. [예제로 배우는 Svelte - 초급편](https://mycodings.fly.dev/blog/2023-11-11-svelte-by-example-for-beginner-level)

2. [예제로 배우는 Svelte와 SvelteKit - 고급편](https://mycodings.fly.dev/blog/2023-11-12-advanced-svelte-tutorial-by-svelte-example)

** 목차 **

1. [Hello World](#1-hello-world)

2. [데이터](#2-데이터)

3. [컴포넌트 및 props](#3-컴포넌트-및-props)

4. [반복문 및 조건문](#4-반복문-및-조건문)

5. [이벤트](#5-이벤트)

6. [상태(State)](#6-상태state)

7. [리액티브 statement](#7-리액티브-statement)

8. [style과 CSS](#8-style과-css)

9. [CSS 사용자 정의 속성](#9-css-사용자-정의-속성)

10. [class와 style 디렉티브](#10-class와-style-디렉티브)

---

## 1. Hello World

Hello World 컴포넌트를 만들어 보겠습니다.

- Svelte 컴포넌트는 .svelte 파일 확장자를 사용합니다.

- 컴포넌트에는 템플릿, 스크립트, 그리고 스타일이 포함될 수 있습니다.

- 유효한 HTML은 유효한 Svelte 컴포넌트입니다.

- 아래 코드는 일반 텍스트 문자열만 있는 가장 기본적인 Svelte 컴포넌트가 있습니다.

HelloWorld.svelte
```html
Hello, world!
```

- 우리는 웹 개발 중이므로 최소한 HTML은 추가해 보겠습니다.

HelloWorld.svelte
```html
<p>Hello, world!</p>
```

---

## 2. 데이터

Svelte는 컴포넌트를 설정하기 위해 `<script>` 태그를 사용합니다.

스크립트 태그에서 선언된 변수는 템플릿에서 접근할 수 있도록 만들어집니다.

일단 아래와 같이 체크박스가 있는 컴포넌트를 만들어 보겠습니다.

- 컴포넌트에 데이터를 추가하려면 변수가 포함된 스크립트 태그를 도입해야 합니다.

- 실제로 Svelte 컴포넌트에서는 스크립트(script) 태그가 파일의 맨 위에 위치합니다.

- 템플릿에서는 중괄호로 데이터를 출력할 수 있습니다.

- 데이터는 속성에서도 사용할 수 있습니다.

- 변수 이름이 속성과 일치하는 경우, 약식 표기법도 사용할 수 있습니다.

Todo.svelte
```js
<script>
  let checked = false;
</script>

<input type="checkbox" checked={checked}>

<input type="checkbox" {checked}>
```

---

## 3. 컴포넌트 및 props

컴포넌트는 유저인터페이스에 있어 재사용 가능한 구성 요소입니다.

Svelte 컴포넌트는 .svelte 확장자를 가진 파일에서만 작성됩니다.

이 예제에서는 Todo 컴포넌트를 만들고, 이를 TodoList 컴포넌트에서 렌더링해 보겠습니다.

- 컴포넌트는 내보낸 let 변수를 사용하여 다른 컴포넌트로 props을 전달하거나 받을 수 있습니다.

- 변수를 할당하여 기본값을 설정할 수 있습니다.

Todo.svelte
```js
<script>
  export let task;
  export let completed = false;
</script>

<p>
  <input type="checkbox" checked={completed} />
  {task}
</p>
```

- 컴포넌트를 가져와 다른 컴포넌트에서 사용할 수 있습니다.

- 컴포넌트는 PascalCase로 렌더링 됩니다.

TodoList.svelte
```js
<script>
  import Todo from './Todo.svelte';
</script>

<Todo task="Lawn Mowing" />
<Todo task="Walking the Dog" />
<Todo task="Reading Newspaper" />
```

- 데이터와 그 약식 표기법은 props에도 사용될 수 있습니다.

TodoList.svelte
```js
<script>
  import Todo from './Todo.svelte';
  let task = "Lawn Mowing";
</script>

<Todo {task} />
```

- 나머지 연산자 `...`를 사용하여 여러 props를 한꺼번에 전달할 수 있습니다.

TodoList.svelte
```js
<script>
  import Todo from './Todo.svelte';
  let todo = {
    task: "Lawn Mowing",
    completed: false,
  };
</script>

<Todo {...todo} />
```

---

## 4. 반복문 및 조건문

Svelte는 `{#each}` 및 `{#if}` 템플릿 지시문(디렉티브-directive)을 사용하여 목록을 렌더링 하고 내용을 조건부로 렌더링 합니다.

이 예제에서는 Todo 목록을 렌더링 하고 남은 Todo 의 양에 따라 메시지를 표시합니다.

- 템플릿에서 배열을 순회하려면 `{#each}…{/each}` 블록을 사용합니다.

- HTML을 조건부로 렌더링 하려면 `{#if}…{/if}` 블록을 사용합니다.

- 더 많은 조건을 추가하려면 `{:else}` 및 `{:else if …}` 지시문을 사용합니다.

TodoList.svelte
```js
<script>
  import Todo from './Todo.svelte';

  let todos = [
    { task: "Lawn Mowing", completed: false },
    { task: "Walking the Dog", completed: false },
    { task: "Reading Newspaper", completed: false },
  ];
</script>

{#each todos as todo}
  <Todo {...todo} />
{/each}

{#if todos.length === 0}
  <p>모든 일이 끝났어요!</p>
{:else if todos.length === 1}
  <p>거의 다 왔어요!</p>
{:else}
  <p>계속 하세요!</p>
{/if}
```

- 반복문에서 현재 위치를 가리키는 인덱스는 `{#each}` 내에서도 사용할 수 있습니다.

TodoList.svelte
```js
{#each todos as todo, index}
  <!-- … -->
{/each}
```

- 또한 `{#each}` 블록에서 키를 지정할 수 있습니다.

- 키는 각 목록의 고유한 식별자입니다.

- 목록의 인덱스가 변경될 때 DOM을 올바르게 업데이트하기 위해 키를 설정하는 것이 좋습니다.

TodoList.svelte
```js
{#each users as user (user.id)}
  <!-- … -->
{/each}
```

---

## 5. 이벤트

HTML 엘리먼트 및 Svelte 컴포넌트에 대한 이벤트 리스너를 등록하려면 on: 지시문을 사용합니다.

이 예제에서는 작업이 완료될 때 alert('잘 했어요!')를 호출합니다.

- 이벤트 핸들러는 함수로 정의됩니다. 이벤트 핸들러는 on: 뒤에 이벤트 이름이 따르는 리스너로 등록됩니다.

Todo.svelte
```js
<script>
  export let task;
  export let completed = false;

  function handleInput(event) {
    if (event.target.checked) {
      alert('잘 했어요!');
    }
  }
</script>

<p>
  <input
    type="checkbox"
    checked={completed}
    on:input={handleInput}
  >
  {task}
</p>
```

- 아래 예제는 Svelte에 내장된 createEventDispatcher 헬퍼 유틸을 사용하여 부모 컴포넌트에 이벤트를 디스패치할 수 있는 예제입니다.

- 디스패치할 이벤트 이름과 관련 데이터를 제공하면 됩니다.

Todo.svelte
```js
<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let task;
  export let completed = false;

  function handleInput(event) {
    dispatch('checked', {
      checked: event.target.checked,
    });
  }
</script>

<p>
  <input
    type="checkbox"
    checked={completed}
    on:input={handleInput}
  >
  {task}
</p>
```

- 사용자 지정 이벤트에 대한 핸들러를 만들고 해당 핸들러를 사용자 지정 이벤트의 리스너로 등록합니다.

TodoList.svelte
```js
<script>
  import Todo from './Todo.svelte';

  function handleChecked(event) {
    if (event.detail.checked) {
      alert('잘 했어요!');
    }
  }
</script>

<Todo
  task="잔디 깎기"
  on:checked={handleChecked}
/>
```

- Svelte는 네이티브 DOM 이벤트에 대한 이벤트 수정자도 지원합니다.

```js
<script>
  function clear() {
    // …
  }
</script>

<button on:click|preventDefault={clear}>
  할 일 목록 지우기
</button>
```

---

## 6. 상태(State)

Svelte에서는 let 변수를 사용하여 로컬 컴포넌트의 state를 다룹니다.

아래 예제에서는 새로운 Todo를 추가하는 AddTodo 컴포넌트를 만들겠습니다.

- 데이터는 리액티브하며 state로 사용될 수 있습니다.

- Svelte에서는 변수가 재할당되면 해당 컴포넌트가 무효화되고 업데이트가 트리거 됩니다.

- 업데이트가 트리거 된 후 Svelte는 새로운 state를 반영하기 위해 DOM을 업데이트합니다.

AddTodo.svelte
```js
<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let task = '';

  function handleInput(event) {
    task = event.target.value;
  }

  function submit() {
    dispatch('add', {
      task,
      completed: false,
    });
  }
</script>

<p>
  <input
    type="text"
    value={task}
    on:input={handleInput}
  >
  <button on:click={submit}>
    추가
  </button>
</p>
```

- 객체나 배열을 업데이트하려면 무조건 재할당해야 합니다.

TodoList.svelte
```js
<script>
  import Todo from './Todo.svelte';
  import AddTodo from './AddTodo.svelte';

  let todos = [];

  function addTodo(event) {
    todos = todos.concat([event.detail]);
  }
</script>

{#each todos as todo}
  <Todo {...todo} />
{/each}

<AddTodo on:add={addTodo} />
```

- 엘리먼트나 또는 컴포넌트에 state를 연결하는 좀 더 간결한 방법은 Svelte의 bind: 속성 접두사를 사용하는 것입니다.

CreateTodo.svelte
```js
<script>
  let task = '';
</script>

<input type="text" bind:value={task}>
```

### Reactivity Rules

- 배열을 다시 할당하면 변경이 발생합니다.

```js
function addTodo(task) {
  todos = todos.concat([{ task, completed: false }]);
}

function addTodo(task) {
  todos = [...todos, { task, completed: false }];
}
```

- 배열을 수정하고 다시 할당하면 변경이 발생합니다.

```js
function addTodo(task) {
  todos.push({ task, completed: false });
  todos = todos;
}
```

- 배열을 수정했지만 재할당이 없으면 변경이 발생하지 않습니다.

```js
function addTodo(task) {
  // Does not work!
  todos.push({ task, completed: false });
}
```

- 객체를 다시 할당하면 변경이 발생합니다.

```js
function completeTodo() {
  task = { ...task, completed: true };
}
```

- 객체를 수정하고 다시 할당하면 변경이 발생합니다.

```js
function completeTodo() {
  task.completed = true;
  task = task;
}
```

- 객체를 수정하기만 하고 할당 작업이 없으면 변경이 발생하지 않습니다.

```js
function completeTodo() {
  // Does not work!
  task.completed = true;
}
```

---

## 7. 리액티브 statement

리액티브 statement는 변경되면 계산된 데이터를 파생하거나 다른 작업을 수행하는 데 사용될 수 있습니다.

`$:` 레이블로 시작하는 문장은 리액티브 문장에 사용된 데이터가 업데이트될 때마다 다시 계산됩니다.

- 'todos', 'showCompleted' 변수가 변할 때 마다 'visibleTodos' 변수는 업데이트됩니다.

```js
// TodoList.svelte

<script>
  import Todo from './Todo.svelte';
  import AddTodo from './AddTodo.svelte';

  let todos = [];
  let showCompleted = false;

  $: visibleTodos = showCompleted
    ? todos
    : todos.filter((todo) => todo.completed);

  function addTodo(task) {
    todos = todos.concat([{
      task,
      completed: false,
    }]);
  }
</script>

{#each visibleTodos as todo}
  <Todo {...todo} />
{/each}

{#if showCompletedTodos}
  <button on:click={() => showCompleted = false}>
    완료된 항목 숨기기
  </button>
{:else}
  <button on:click={() => showCompleted = true}>
    완료된 항목 보이기
  </button>
{/if}
```

- 리액티브 statement는 부가 작업을 수행하는 데 사용될 수 있습니다.

```js
let todos = [];

$: console.log(todos);
```

```js
let todos = [];
let showCompleted = false;

$: if (showCompleted) {
  console.log(todos);
}
```

- 리액트브 statement는 한 개의 단위여야 하는데 만약 여러 개라면 블록 안에 그룹화할 수 있습니다.

```js
let todos = window.localStorage
  ? JSON.parse(window.localStorage.getItem('todos') || '[]')
  : [];

$: {
  console.log(todos);

  if (window.localStorage) {
    window.localStorage.setItem(
      'todos',
      JSON.stringify(todos),
    );
  }
}
```

---

## 8. style과 CSS

스타일은 Svelte 컴포넌트에서 `<style>` 태그 내에 추가할 수 있습니다.

- 실제로 Svelte 컴포넌트에서는 파일의 끝에 스타일 태그가 있습니다. 스타일은 해당 컴포넌트에 대해서만 범위(scope)가 지정됩니다.

```js
<!-- Todo.svelte -->

<script>
  export let task;
</script>

<p>{task}</p>

<style>
  p {
    color: red;
  }
</style>
```

- 아래 예제에서 스타일은 현재 컴포넌트에 대해 범위(scope)가 지정되어 있기 때문에 Todo 내의 p에 영향을 미치지 않습니다.

- 컴포넌트 외부의 요소에 영향을 주는 전역 스타일을 추가하려면 선택자를 :global로 감싸면 됩니다.

```js
<!-- TodoList.svelte -->

<script>
  import Todo from './Todo.svelte';
</script>

<Todo task="Mow lawn" />

<style>
  p {
    color: green;
  }

  :global(input[type="checkbox"]) {
    accent-color: green;
  }
</style>
```

---

## 9. CSS 사용자 정의 속성

Svelte 컴포넌트는 CSS 사용자 정의 속성(또는 CSS 변수로도 알려져 있음)도 지원합니다.

- 아래 예제에서는 HelloWorld 컴포넌트의 색상을 CSS 변수로 재정의할 수 있게 합니다.

- '--color' 사용자 정의 속성을 빨간색 대체 값과 함께 설정합니다.

```js
<!-- Todo.svelte -->

<script>
  export let task;
</script>

<p>{task}</p>

<style>
  p {
    color: var(--color, red);
  }
</style>
```

Svelte는 CSS 사용자 정의 속성을 컴포넌트 "props"로 지원합니다.

```js
<!-- App.svelte (or your main component) -->

<script>
  import Todo from './Todo.svelte';
</script>

<Todo --color="green" />
```

---

## 10. class와 style 디렉티브

Svelte는 동적 스타일링을 쉽게 만들기 위해 class: 및 style: 디렉티브를 지원합니다.

아래 예제에서는 HelloWorld에 대한 class 및 style 디렉티브를 시연하겠습니다.

- CSS 클래스는 class: 디렉티브를 통해 조건부 적용이 가능합니다.

```js
<!-- Todo.svelte -->
<script>
  export let task;
  export let completed = false;
</script>

<p class:is-completed={completed}>
  {task}
</p>

<style>
  .is-completed {
    text-decoration: line-through;
  }
</style>
```

- `style:<property>=` 방식으로도 스타일을 지정할 수 있습니다.

```js
<script>
  export let task;
  export let completed = false;
</script>

<p style:text-decoration={completed ? 'line-through' : null}>
  {task}
</p>
```
