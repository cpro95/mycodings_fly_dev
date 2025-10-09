---
slug: 2023-11-12-advanced-svelte-tutorial-by-svelte-example
title: 예제로 배우는 Svelte와 SvelteKit - 고급편
date: 2023-11-12 03:05:24.842000+00:00
summary: 예제로 배우는 Svelte와 SvelteKit - 고급편
tags: ["sveltejs"]
contributors: []
draft: false
---

전체 강좌 목록입니다.

1. [예제로 배우는 Svelte - 초급편](https://mycodings.fly.dev/blog/2023-11-11-svelte-by-example-for-beginner-level)

2. [예제로 배우는 Svelte와 SvelteKit - 고급편](https://mycodings.fly.dev/blog/2023-11-12-advanced-svelte-tutorial-by-svelte-example)

** 목차 **

1. [라이프사이클 훅](#1-라이프사이클-훅)

2. [Slots](#2-slots)

3. [Context](#3-context)

4. [Actions](#4-actions)

5. [Special Elements](#5-special-elements)

6. [TypeScript](#6-typescript)

7. [Writable Stores](#7-writable-stores)

8. [Custom Stores](#8-custom-stores)

9. [Derived Stores](#9-derived-stores)

10. [Readable Stores](#10-readable-stores)

11. [SvelteKit - Filesystem과 Routing](#11-sveltekit---filesystem과-routing)

12. [SvelteKit - Pages와 Links](#12-sveltekit---pages와-links)

13. [SvelteKit - Page Scripts](#13-sveltekit---page-scripts)

14. [SvelteKit - Server Scripts](#14-sveltekit---server-scripts)

15. [SvelteKit - Layouts](#15-sveltekit---layouts)

16. [SvelteKit - Form Actions](#16-sveltekit---form-actions)

---

## 1. 라이프사이클 훅

Svelte는 몇 가지 함수를 이용하여 컴포넌트의 라이프사이클 이벤트 중에 코드를 실행할 수 있게 해 줍니다.

- onMount 라이프사이클 훅은 컴포넌트가 마운트 된 후에 콜백을 실행합니다. 이 시점에서 컴포넌트의 HTML은 DOM에 렌더링 되어 있습니다.

```js
<script>
  import { onMount } from 'svelte';

  onMount(() => {
    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('2d');

    // ...
  });
</script>

<canvas></canvas>
```

### More Lifecycle Functions

- `beforeUpdate`은 Svelte가 DOM을 업데이트하기 전에 콜백을 실행합니다.

- `afterUpdate`은 Svelte가 DOM을 업데이트한 후에 콜백을 실행합니다. 

```js
beforeUpdate(() => {
  // ...
});

afterUpdate(() => {
  // ...
});
```

- `tick`은 Svelte가 다음번에 DOM을 업데이트한 후에 바로 호출되는 콜백입니다.
(보류 중인 업데이트가 없으면 즉시 실행).

```js
await tick();
```

---

## 2. Slots

Svelte 컴포넌트의 내용은 slot을 통해 전달될 수 있습니다.

Svelte는 디폴트 slot, named slot, 그리고 slot을 통해 slotted 콘텐츠로 데이터를 전달하는 slot(범위가 지정된 slot이라고도 함)을 지원합니다.

- slot은 self-closing `<slot>` 태그로 선언합니다. slot에는 이름이 지정될 수 있습니다. 기본 slot 내용은 자식으로 전달될 수 있습니다. named slot 내용은 HTML 요소에 `slot` 속성을 설정하여 전달될 수 있습니다.

```js
<main>
  <slot />
</main>

<footer>
  <slot name="footer" />
</footer>
```

- default slot 내용은 자식으로 전달될 수 있습니다. named slot 내용은 HTML 요소에 `slot` 속성을 설정하여 전달될 수 있습니다.

```js
<script>
  import Layout from './Layout.svelte';
</script>

<Layout>
  <h1>Todo List</h1>
  <!-- … -->

  <p slot="footer">
    Subtracting from your list of priorities
    is as important as adding to it.
  </p>
</Layout>
```

- 컴포넌트가 named slot 내용을 제공했는지 확인할 수 있습니다. `$$slots`를 사용합니다.

```js
{#if $$slots.footer}
  <footer>
    <slot name="footer" />
  </footer>
{/if}
```

- slot props을 사용하면 컴포넌트가 slot 콘텐츠로 데이터를 전달할 수 있습니다. 데이터는 컴포넌트처럼 slot에 전달될 수 있습니다.

```js
<script>
  let quote = "Subtracting from your list…";
</script>

<blockquote>
  <slot {quote} />
</blockquote>
```

- 데이터는 `let:<name>` 속성을 사용하여 변수에 바인딩 될 수 있습니다.

```js
<script>
  import Quote from "./Quote.svelte";
</script>

<Quote let:quote={quote}>
  <p>Quote: {quote}</p>
</Quote>
```

----

## 3. Context

컨텍스트(context)를 사용하면 프롭스(props)를 통해 데이터를 계속해서 전달하지 않고 컴포넌트 간에 데이터를 공유할 수 있습니다.

컨텍스트는 컴포넌트 트리의 여러 수준에서 데이터를 공유하는 데 유용할 수 있습니다.

- Svelte에서는 svelte 패키지에서 context 함수를 import 합니다. 컴포넌트 트리를 따라 데이터를 사용하려면 setContext를 사용하여 키와 값을 설정하십시오.

```html
<script>
  import { setContext } from 'svelte';

  setContext('theme', 'light');
</script>

<!-- … -->
```

- 부모 컴포넌트에서 컨텍스트를 읽으려면 getContext를 사용하세요.

```html
<script>
  import { getContext } from 'svelte';

  const theme = getContext('theme');
</script>

<!-- … -->
```

---

## 4. Actions

액션은 단일 엘리먼트(element)의 라이프사이클에 바인딩되는 함수입니다.

액션은 Svelte를 서드파티 라이브러리와 통합하는 데 특히 유용하게 합니다.

- 액션은 HTML 엘리먼트와 옵셔널한(optional) 값(value)을 받는 함수입니다. 엘리먼트가 마운트되면 액션이 실행됩니다.
- 값의 변경 사항을 리스닝(listening)하려면 update 함수를 return하고, 엘리먼트가 제거될 때 정리(clean up)하기 위해서는 destroy 함수를 리턴하면 됩니다.
- 액션은 use: 지시어를 사용하여 엘리먼트에 바인딩 됩니다.

```js
<script>
  export let minDate;

  function datepicker(element, { minDate }) {
    const pickaday = new Pikaday({
      field: element,
      minDate,
    });

    return {
      update({ minDate }) {
        pickaday.setMinDate(minDate);
      },
      destroy() {
        pickaday.destroy();
      },
    };
  }
</script>

<input use:datepicker={{ minDate, maxDate }} />
```

---

## 5. Special Elements

Svelte는 'special elements'를 제공하는데요.

- 현재 컴포넌트를 재귀적(recursively)으로 렌더링 하려면 svelte:self를 사용하면 됩니다.

```js
{#each page.children as page}
  <svelte:self class="child" {page} />
{/each}
```

- 동적으로 컴포넌트를 렌더링 하려면 svelte:componet를 사용하면 됩니다.

```js
<script>
  import Todo from './Todo.svelte';
  import Completed from './Completed.svelte';

  export let todo;

  $: component = todo.completed
    ? Completed : Todo;
</script>

<svelte:component this={component} {todo} />
```

- 엘리먼트를 동적으로 렌더링 하려면 svelte:element를 사용하면 됩니다.

```js
<svelte:element this={level === 1 ? 'h1' : 'h2'}>
  {title}
</svelte:element>
```

- window 객체에 이벤트 리스너를 추가하려면 svelte:window를 사용하면 되고, 또 로컬 데이터에 값을 바인딩할 때도 svelte:window를 사용할 수 있습니다.

```js
<script>
  let innerWidth, innerHeight,
      outerWidth, outerHeight,
      scrollX, scrollY,
      online;
</script>

<svelte:window on:keydown={handleKeydown} />

<svelte:window bind:scrollY={innerWidth} />
<svelte:window bind:scrollY={innerHeight} />
<!-- … -->
```

- 이벤트 리스너와 바인딩하려면 svelte:body와 svelte:document를 사용하면 됩니다.

```js
<svelte:body on:click={handleClick} />
<svelte:document on:click={handleClick} />
```

- document의 head 태그에 컨텐츠를 추가하고 싶으면 svelte:head를 사용하면 됩니다.

```js
<svelte:head>
  <title>Hello, world!</title>
</svelte:head>
```

- 컴포넌트의 [compiler options](https://svelte.dev/docs/special-elements#svelte-options)을 지정하고 싶으면 svelte:options을 사용하면 됩니다.

```js
<svelte:options immutable />
```

- named slot을 HTML 엘리먼트 안에서 사용하고 싶지 않으려면 svelte:fragment를 사용하면 됩니다.

```js
<svelte:fragment slot="footer"  />
  Subtracting from your list of priorities
  is as important as adding to it.
</svelte:fragment>
```

---

## 6. TypeScript

svelte에서는 `<script>` 태그 안에는 기본적으로 플레인 자바스크립트인데요, svelte는 typescript도 완벽하게 지원합니다.

- Typescript를 작동시키려면 `<script>` 태그에 lang='ts'라고 명기하면 됩니다.
- 또 타입스크립트와 같이 사용하면 props와 data 또한 평범한 변수면서 타입을 가질 수 있습니다.
- 이벤트 또한 평범한 HTML 이벤트입니다.

 ```js
<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let task: string;
  export let completed: boolean = false;

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;

    dispatch('checked', {
      checked: target.checked,
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

---

## 7. Writable Stores

스토어(Store)는 로컬 컴포넌트 상태를 넘어 Svelte에서 상태를 관리하는 방법입니다.

쓰기 가능한(writable) 스토어는 Svelte 컴포넌트에서 쓰고 읽을 수 있는 스토어입니다.

- Svelte에서는 쓰기 가능한(writable) 스토어를 생성하기 위해 writable 함수를 import 시킵니다. 스토어를 초기화할 때 기본값을 설정할 수 있습니다.

```js
import { writable } from 'svelte/store';


export const todos = writable([]);
````

- 쓰기 가능한(writable) 스토어의 값을 설정할 때 set을 사용할 수 있습니다. 또는 update와 함께 콜백함수를 사용하여 쓰기 가능한 스토어의 값을 업데이트할 수 있습니다.

- 업데이트 콜백에서 스토어 상태를 변경하기 위해 객체를 직접 수정할 수 있습니다. 또는 새로운 객체를 반환하여 스토어 상태를 업데이트할 수 있습니다.

- 스토어의 값에 접근할 때는 스토어 이름 앞에 $를 붙일 수 있습니다.

```js
<script>
  import Todo from './Todo.svelte';
  import AddTodo from './AddTodo.svelte';
  import { todos } from './stores.js';

  todos.set([
    {
      task: 'Walk dog',
      completed: false,
    },
  ]);

  function addTodo() {
    todos.update((todos) => {
      todos.push({
        task: 'Read newspaper',
        completed: false,
      });
    });
  }

  function checkTodo(index, completed) {
    todos.update((todos) => {
      return todos.map((todo, i) => {
        return index === i
          ? { ...todo, completed }
          : todo;
      });
    });
  }
</script>

{#each $todos as todo, index}
  <Todo
    {...todo}
    on:checked={(event) => {
      checkTodo(index, event.detail.checked);
    }}
  />
{/each}

<AddTodo on:add={addTodo} />
````

---

## 8. Custom Stores

객체가 스토어로 사용될 수 있는 유일한 조건은 subscribe 함수를 노출하는 것입니다.

Svelte의 내장된 스토어 도우미를 사용하여 사용자 정의 스토어를 만들 수 있습니다.

사용자 정의 스토어는 데이터를 캡슐화하고 상태를 관리하기 위한 특정 함수를 노출하는 데 유용합니다.

- writable Svelte 스토어를 시작점으로 사용할 수 있습니다.

- 사용자 정의 스토어에서 노출해야 하는 함수들을 구현합니다.

- 그런 다음 해당 함수들과 subscribe를 내보냅니다.

- Svelte 스토어는 반드시 subscribe 함수를 내보내야 합니다.

```js
import { writable } from 'svelte/store';

const { update, set, subscribe } = writable([]);

function addTodo() {
  update((todos) => {
    todos.push({
      task: 'Read newspaper',
      completed: false,
    });
  });
}

function checkTodo(index, completed) {
  update((todos) => {
    return todos.map((todo, i) => {
      return index === i
        ? { ...todo, completed }
        : todo;
    });
});


export {
  addTodo,
  checkTodo,
  subscribe,
};
```

- 스토어는 템플릿에서 다른 스토어와 마찬가지로 사용할 수 있으며, `$`는 subscribe를 호출합니다.

```js
<script>
  import Todo from './Todo.svelte';
  import AddTodo from './AddTodo.svelte';
  import { todos } from './stores.js';

  const { addTodo, checkTodo } = todos;

  addTodo('Walk dog');
</script>

{#each $todos as todo, index}
  <Todo
    {...todo}
    on:checked={(event) => {
      checkTodo(index, event.detail.checked);
    }}
  />
{/each}

<AddTodo on:add={addTodo} />
```

---

## 9. Derived Stores

기타 스토어에서 값을 도출하기 위해 파생된 스토어를 만들 수 있습니다.

파생된 스토어는 상태의 일부에 대한 구독 또는 상태의 변형된 표현을 여러 위치에서 구독하고자 할 때 유용합니다.

- Svelte는 파생된 스토어를 생성하기 위한 `derived` 함수를 import합니다.

- `derived` 함수의 첫 번째 인수는 기존 스토어이고, 두 번째 인수는 현재 스토어 값에서 파생된 데이터를 계산하는 함수입니다.

```js
import { writable, derived } from 'svelte/store';

export const todos = writable([]);

export const completedTodos = derived(
  todos,
  ($todos) => {
    return $todos.filter((todo) => todo.completed),
  },
);
```

---

## 10. Readable Stores

읽기 전용 스토어는 구독은 할 수 있지만 컴포넌트에서 업데이트할 수 없는 스토어입니다.

읽기 전용 스토어는 외부 데이터에 구독(subscribing)하는 데 유용합니다.

- svelte는 읽기 가능한 스토어를 만들기 위한 readable 함수를 제공합니다.

- readable은 두 개의 인수를 받습니다. 첫 번째는 스토어의 기본값이고, 두 번째는 값을 최신 상태로 유지하기 위한 start 함수입니다.

- 컴포넌트가 스토어에 구독(subscribe)할 때 start 함수가 실행됩니다. 아래 코드에서는 미디어 쿼리 변경을 감시할 것입니다.

- start 함수는 더 이상 스토어에 구독하는 컴포넌트가 없을 때 실행될 stop 함수를 반환해야 합니다.

```js
import { readable } from 'svelte/store';

const mediaQueryList = window
  .matchMedia('(prefers-color-scheme: dark)');

export const theme = readable(
  mediaQueryList.matches ? 'dark' : 'light';,
  function(set) {
    function listener(query) {
      set(query.matches ? 'dark' : 'light');
    }

    mediaQueryList.addEventListener(
      'change',
      listener,
    );

    return () => {
      mediaQueryList.removeEventListener(
        'change',
        listener,
      );
    };
  }
);
```

- `$`을 사용하여 현재 스토어 값에 액세스 할 수 있습니다.

```js
<script>
  import { theme } from './stores.js';
</script>

<section class:dark={$theme === 'dark'}>
  <!-- … -->
</section>
```

---

## 11. SvelteKit - Filesystem과 Routing

SvelteKit은 Svelte로 FullStack 웹 응용 프로그램을 만들게 해주는 메타 프레임워크입니다.

SvelteKit은 라우팅 및 응용 프로그램을 생성하는 데 필요한 빌드 도구와 함께 제공됩니다.

- 생성된 코드를 캐시하고 일시적으로 저장하는 SvelteKit을 위한 숨겨진 폴더입니다.

```bash
.svelte-kit
```

- 응용 프로그램은 src 에 위치합니다.

```bash
src/
```

- lib 폴더는 특정 경로에 묶이지 않은 응용 프로그램 코드를 저장하는 데 사용됩니다.

```bash
src/lib/
```

- routes 폴더는 웹 앱의 라우팅을 담당합니다.

```bash
src/routes/
```

- 각 페이지에는 +page.svelte 구성 요소가 있습니다. 참고로 routes 폴더에 있는 +page.svelte 파일이 전체 홈페이지의 index.html 파일이 됩니다.

```bash
src/routes/+page.svelte
```

- SvelteKit은 모든 하위 항목에 레이아웃을 적용하는 레이아웃 UI와 및 스크립트(js)도 지원합니다.

```bash
src/routes/+layout.js
src/routes/+layout.svelte
```

- 추가 페이지를 위해서는 routes 폴더 밑에 하위 폴더를 만들면 됩니다. 아래 코드는 `/about` 페이지를 구성한 겁니다. 페이지 구성 요소는 페이지 스크립트 및 데이터를 가져오고 준비하기 위한 서버 스크립트와 함께 올 수 있습니다.

```bash
src/routes/about/
src/routes/about/+page.js
src/routes/about/+page.server.js
src/routes/about/+page.svelte
```

- lists 폴더를 만든 겁니다. lists 폴더 밑에 대괄호를 이용한 이름의 폴더가 있습니다. 대괄호를 사용하여 라우팅 매개 변수를 지정할 수 있습니다. 라우팅 매개변수를 위한 폴더에도 똑같은 +page.svelte 파일이 들어갑니다.

```bash
src/routes/lists/
src/routes/lists/+page.svelte
src/routes/lists/[id]/
src/routes/lists/[id]/+page.svelte
```

- 응용 프로그램의 주요 CSS 파일 및 HTML 스켈레톤입니다.

```bash
src/app.css
src/app.html
.gitignore
package.json
README.md
```

- svelte.config.js에는 SvelteKit에 전용 설정 파일입니다.

```bash
svelte.config.js
```

- SvelteKit은 Vite로 구축되었으며 이는 추가적인 Vite 플러그인을 등록할 수 있음을 의미합니다.

```bash
vite.config.js
```

---

## 12. SvelteKit - Pages와 Links

페이지 구성 요소는 파일 시스템에 의해 결정된 특정 URL에서 렌더링 되는 일반적인 Svelte 구성 요소입니다.

SvelteKit에서 페이지는 기본적으로 서버 측에서 렌더링 됩니다.

- 다른 페이지로 연결하려면 href 속성이 있는 일반적인 a 태그를 사용하십시오.

```html
<-- src/routes/+page.svelte -->
<h1>Hello, word!</h1>

<a href="/about">About</a>
```

```html
<-- src/routes/about/+page.svelte -->
<h1>About</h1>
```

- SvelteKit은 사용자가 링크 위로 마우스를 가져갈 때 이동하려는 페이지를 미리 로드하여 응용 프로그램을 더욱 빠르게 만들 수 있습니다.

- 비활성화하려면 링크에 data-sveltekit-preload-data 속성을 설정하십시오. (모든 링크에서 비활성화하려면 body 태그에 설정하십시오.)

```html
<h1>Hello, word!</h1>

<a
  href="/about"
  data-sveltekit-preload-data="off"
>
  About
</a>
```

---

## 13. SvelteKit - Page Scripts

페이지 스크립트는 페이지 컴포넌트가 렌더링 되기 전에 데이터를 가져오거나 준비할 수 있게 합니다.

SvelteKit 앱이 처음 로드될 때 페이지 스크립트는 초기 렌더링을 위해 서버에서 실행됩니다.

이후의 방문에서는 페이지 스크립트가 클라이언트에서만 실행됩니다.

- `+page.js` 스크립트에서 `load` 함수를 내보내면 페이지 컴포넌트에 대한 데이터를 준비하거나 가져오는 데 사용할 수 있습니다. `load` 함수는 비동기 함수일 수 있습니다.

```js
import { fetchLists } from './api.js';

export async function load() {
  return {
    lists: await fetchLists(),
  };
}
```

- 페이지 스크립트에서 가져온 데이터는 페이지 컴포넌트의 `data` props에 전달됩니다.

```js
<script>
  export let data;
</script>

<h1>Lists</h1>
<ul>
  {#each data.lists as list}
    <li>
      <a href={`/lists/${list.id}`}>
        {list.name}
      </a>
    </li>
  {/each}
</ul>
```

- `load` 함수는 route 매개변수 및 기타 데이터에 액세스 하기 위해 `context` 인자를 받습니다. 페이지 스크립트는 오류를 throw 하고 HTTP 응답 코드를 수정할 수 있습니다.

```js
import pages from "./pages.json";
import { error } from '@sveltejs/kit';

export function load({ params }) {
  const page = pages
    .find((page) => page.slug === params.page);

  if (! page) {
    throw error(404, 'Page not found');
  }

  return { page };
}
```

- `load` 함수는 JSDoc 또는 TypeScript를 사용하여 타입을 지정할 수 있습니다.

```js
/** @type {import('./$types').PageLoad} */
export function load({ params }) {
  // …
}
```

```js
import type { PageLoad } from "./$types";

export function load({ params }: PageLoad) {
  // …
}
```

- `data` props 또한 JSDoc 또는 Typescript로 타입을 지정할 수 있습니다.

```js
<script>
  /** @type {import('./$types').PageData} */
  export let data;
</script>
```

```js
<script lang="ts">
  import type { PageData } from "./$types";

  export let data: PageData;
</script>
```

---

## 14. SvelteKit - Server Scripts

서버 스크립트는 페이지 컴포넌트가 렌더링 되기 전에 데이터를 가져오거나 준비하는 데 사용됩니다.

당연히 서버 스크립트는 서버에서만 실행됩니다.

- `+page.server.js` 스크립트에서 `load` 함수를 내보내어 페이지 컴포넌트를 준비하거나 데이터를 가져올 수 있습니다. `load` 함수는 비동기 함수일 수 있습니다.

```js
import { getListsFromDatabase } from './db.js';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  return {
    lists: await getListsFromDatabase(),
  };
}
```

- 페이지 스크립트에서의 데이터는 페이지 컴포넌트의 `data` 속성으로 전달됩니다.

```js
<script>
  /** @type {import('./$types').PageData} */
  export let data;
</script>

<h1>Lists</h1>
<ul>
  {#each data.lists as list}
    <li>
      <a href={`/lists/${list.id}`}>
        {list.name}
      </a>
    </li>
  {/each}
</ul>
```

---

## 15. SvelteKit - Layouts

레이아웃 컴포넌트는 페이지 주변에 렌더링 되며 페이지 내용을 슬롯에 넣습니다.

레이아웃은 서브트리의 모든 페이지에 적용됩니다.

- 레이아웃은 해당 페이지와 모든 하위 항목에 대해 사용됩니다. 아래 레이아웃은 src/routes/+page.svelte, src/routes/about/+page.svelte 등에 적용됩니다. 그리고 페이지는 당연히 slot이 위치한 곳에 렌더링 됩니다.

```js
// src/routes/+layout.svelte
<nav>
    <a href="/">Home</a>
    <a href="/about">About</a>
    <a href="/lists">Lists</a>
</nav>

<slot></slot>
```

- 페이지 구성 요소 및 페이지 스크립트와 마찬가지로 레이아웃도 레이아웃 구성 요소에 데이터를 전달하기 위한 레이아웃 스크립트로 동반될 수 있습니다.

```js
// src/routes/+layout.js
/** @type {import('./$types').LayoutLoad} */
export function load() {
    // …
}
```

```js
src/routes/+layout.svelte

<script>
    /** @type {import('./$types').PageData} */
    export let data;
</script>
```

- 레이아웃 데이터는 페이지 데이터와 병합되며 페이지 구성 요소에서도 사용할 수 있습니다.

```js
// src/routes/+page.svelte
<script>
    /** @type {import('./$types').PageData} */
    export let data;
</script>
```

---

## 16. SvelteKit - Form Actions

폼 액션은 SvelteKit에서 폼 제출용 서버 엔드 포인트를 제공합니다.

액션은 폼 제출 시 호출되므로 JavaScript가 비활성화된 경우에도 액션은 여전히 실행됩니다.


- 액션은 +page.server.js 파일에서 내보내집니다. 액션은 요청을 통해 전달된 폼 데이터에 액세스 할 수 있습니다.

```js
// src/routes/newsletter/+page.server.js

export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const data = { email: formData.get('email') };

    await fetch('https://mailcoach.app/api/…', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
```

- Svelte 컴포넌트에서 폼을 통해 액션을 호출할 수 있습니다. 페이지의 기본 액션을 호출할 때는 action 속성이 필요하지 않습니다.

```js
// src/routes/newsletter/+page.svelte

<form method="POST">
  <label>Email</label>
  <input type="email">
</form>
```

---
