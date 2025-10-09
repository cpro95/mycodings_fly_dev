---
slug: 2022-11-14-nextjs-13-first-look-and-layout
title: Next.js 13 살펴보기 - 폴더 방식 라우팅과 중첩 레이아웃 이해
date: 2022-11-14 11:14:28.634000+00:00
summary: Next.js 13 살펴보기 - 폴더 방식 라우팅과 중첩 레이아웃 이해
tags: ["next.js"]
contributors: []
draft: false
---

![](https://blogger.googleusercontent.com/img/a/AVvXsEimNTZae_0VPdkLTHLn29SuTWCB0KdexrpaVhqbDUkXvjnoFzoXmusY7ZjO64-6UjxKGSbZubaGn0dK1aEEZ5yP8_N9NJjg6YAxz6Ax_o_SE9k12r5Xe2n-IerYo6eM-oNlGzaPDWVty0CShde9RmCT-_XtNkpJWnDU_GNb2MGiHCQh4HO5PuGTA7lV=s16000)

안녕하세요?

Next.js가 메이저 업데이트가 되었는데요.

기존 12 버전에서 13 버전으로 큰 폭의 업데이트가 되면서 정말 많은 부분에서 변화가 생겼습니다.

앞으로 몇 차례에 걸쳐 Next.js 13에 대해 알아보겠습니다.

<hr />
## Next.js 13 설치

설치하는 방법은 기존과 동일합니다.

```bash
npx create-next-app@latest -e with-tailwindcss nextjs13-layout-example
```

TailwindCSS를 사용하기 위해 위와 같이 설정했습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhgocnlHpt7rvaPt2QFuAdlA3nOP_M4LJ5penmFqRJgJ0LPYWEiJ8tlWjfHWzlARSLRDnXKVWAxUMNOmZj225OruMTTw_DWiHTISkoLUMD8-aeZkFzzV7DqRV5fnB-NtMJca8yX9rFdKVlgtlCSVk4fKShOJngCCVJNWOWD_mvDv89eHFnzgIJ6e5w8)

설치를 끝냈으면 위 그림과 같이 기존 Next.js 12 버전의 pages 폴더가 보이는데요.

Next.js 13은 좀 더 혁신적인 Nested Layout을 위해 새로운 폴더를 선보였습니다.

바로 app 폴더인데요.

그럼 Next.js 13으로 어떻게 바꿔야 할까요?

먼저, 과감히 pages 폴더를 삭제합시다.

그리고 최상위 폴더에 app 폴더를 만들고 그 아래 page.tsx 파일을 작성합니다.

page.tsx 파일은 아래와 같이 하시면 됩니다.

```js
import React from 'react'

type Props = {}

function Home({}: Props) {
  return <div>Home</div>
}

export default Home
```

그리고 app 폴더를 사용하게끔 next.config.js 파일을 수정해 줘야 합니다.

다음과 같이 수정해주시면 됩니다.

```js
/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
}
```
app 폴더 방식은 아직은 실험적이라는 의미이지만 beta 버전이어서 조금은 안정적이고 향후 Next.js가 가고자 하는 방향이 app 폴더이기 때문에 지금부터라도 배워두는 게 좋을 듯합니다.

이제 npm run dev 명령어를 실행해서 개발 서버를 돌려 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEjdKk9EAOAbkKIu1uoWAB3OffNAvoAINo_eCqED1XphNqFaunNcukEImbc751Gd8D7ILvKOcnNBL_UcdOVRC_H3csACsIb61CqhwbvbnYgMjydY6mh2hdZl5QR6jC72TFuM6wWnAiDLuZTOdSMJzBTvQXqpIYlvscHX9ih8McZuyO0sqZr1gs2RjPGr=s16000)

개발 서버를 돌리면 위 그림과 같이 Next.js가 app폴더 밑에 layout.tsx 파일과 head.tsx 파일을 생성했다고 나옵니다.

Next.js 13 버전은 기존 12 버전에서 사용한 파일 이름 라우팅 방식이 아니라 온전히 폴더 방식 라우팅 방식을 씁니다.

즉, 기존 12 버전에서 /pages/todo.tsx 파일이 /todo 라우팅이 되었다면 이번에 나온 13 버전에서는 무조건 /app/todo/page.tsx 파일이라고 만들어야 합니다.

즉, todo까지가 폴더 방식 라우팅이고 그 라우팅의 기본이 바로 page.tsx라는 뜻입니다.

기존 웹 표준인 index.tsx 파일을 안 쓴 거는 조금 의아한데요. 어쩔 수 없죠.

그리고 라우팅이 되는 폴더에는 여러 가지 예약된 파일 이름이 있는데요.

위 그림에서처럼 자동으로 만들어진 layout.tsx파일과 head.tsx파일도 있고, 그 외 아래 그림처럼 여러 가지가 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgTzdxBEe-ZXLaQhVASlwMKOb3JXTH97CBF35vFmBd2gmv3RzAV4Pjac-Xf7fHZntmRHQGnQlgcwYBfSOegLyH7YLETwH8HNfi8TPpzQQdSkpBSerNBVm79imVO9DlFG5MDPT_ALy8GrZsO3f3ROjVhRaTNrWI2-jw8n-PluBHyHS9ORljyAkcg5zSo)

loading.tsx 파일도 만들 수 있고, error.tsx 파일도 만들 수 있습니다.

그리고 not-found.tsx 파일도 만들 수 있습니다.

이 파일들은 차차 알아보기로 하고 가장 중요한 layout.tsx 파일과 head.tsx 파일에 대해 알아봅시다.

app 폴더 바로 밑에는 무조건 한 개의 layout.tsx 파일이 있어야 되는데요.

기존 pages 폴더 밑에 있던 _app.tsx 파일과 _document.tsx 파일의 역할을 한다고 보시면 됩니다.

먼저, layout.tsx 파일을 살펴볼까요?

```js
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <head />
      <body>{children}</body>
    </html>
  )
}
```

위와 같이 RootLayout 컴포넌트가 있습니다. Next.js 13부터는 app 폴더 밑에 이렇게 꼭 한 개의 layout.tsx 파일이 있어야 합니다.

그리고 head.tsx 파일을 살펴볼까요?

```js
export default function Head() {
  return (
    <>
      <title></title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <link rel="icon" href="/favicon.ico" />
    </>
  )
}
```
이 파일은 해당 라우팅의 메타 정보를 지정할 수 있습니다.

왜냐하면 각 라우팅마다 title을 다르게 할 수 있으니까요!

app 폴더에 있는 layout.tsx 파일을 이용하면 보통 홈페이지 맨 위에 있는 Header 파일을 지정할 수 있습니다.

그럼 app 폴더에 Header.tsx 파일을 만들어 볼까요?

app 폴더 밑에 Header.tsx 파일을 만들어도 /header 경로로 라우팅 되지 않습니다.

기존 12 버전에서는 라우팅이 됐었는데요. 

13 버전부터는 무조건 폴더 밑에 있는 page.tsx 파일이 첫 번째로 읽히는 파일이 됩니다.

```js
import Link from "next/link";
import React from "react";

type Props = {};

function Header({}: Props) {
  return (
    <nav className="flex space-x-4 mb-2">
      <Link href="/" className="bg-blue-200 rounded px-4 py-2">
        Home
      </Link>
      <Link href="/todos" className="bg-cyan-200 rounded px-4 py-2">
        Todos
      </Link>
    </nav>
  );
}

export default Header;
```

그리고 Header 컴포넌트를 RootLayout에 적용해 볼까요?

```js
import "../styles/globals.css";
import Headers from "./Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head />
      <body className="border-4 border-red-400 p-2 w-full">
        <Headers />
        {children}
      </body>
    </html>
  );
}
```

첫 번째 줄에서 TailwindCSS 관련 파일을 import를 했고,

밑에 보시면 body 태그 밑에 Headers 컴포넌트를 넣었습니다.

그러 이제 실행 화면을 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEheFnGhdA8PPAuIjuXGjkNBzn3JvoGaUxGjhMdm5G6HRuFJL-Xygvo1X65NmQufCadvojwxqgQCzmJVfN8Cyfr3UQ7ovcAc5SZsG5Zu1Pm6ihgLjBYyQGjs5cfpEdmP4PA1MRcDebcOHD7bnKBJH6XYUjbe-OfJsuIJVnnJId1oX6tohNwyc123OEAL=s16000)

우리가 앞으로 만들 Todos 라우팅까지 넣었습니다.

Todos 링크를 클릭하면 아직 만들지 않았기 때문에 404 에러 페이지가 나타나는데요.

이 에러 페이지는 Next.js 13 버전의 기본 템플릿입니다.

우리가 /todos 라우팅에 즉 /todos 폴더 밑에 error.tsx파일을 만들면 우리가 원하는 에러 페이지를 작성할 수 도 있습니다.

참고로 빨간색 border를 넣은 거는 나중에 Nested Layout을 쉽게 이해하기 위해 넣었습니다.

이제 기본적인 첫번째 페이지를 만들었으니까 두 번째 파트로 넘어가 볼까요?

<hr />
## Todos 라우팅 만들기

라우팅을 만들기 위해서는 폴더를 만들어야 하는데요.

app 폴더 밑에 /app/todos라는 폴더를 만들고 그 밑에 기본 파일인 page.tsx 파일을 만듭시다.

```js
import React from "react";

type Props = {};

function Todos({}: Props) {
  return (
    <div className="border-4 border-yellow-500 text-2xl text-yellow-400 p-2">
      This is Todos Page
    </div>
  );
}

export default Todos;

```

![](https://blogger.googleusercontent.com/img/a/AVvXsEgP_alVUgq7bEKbt0X3BGcDIxOz4gZPMgl-0WKQjWp7aZDKs80yrW1nyeyYCDdBMLkMknlbeYbt_YQdGbMLjGqMxa20yHN9uV-JMBGBuL5ZxdJ-RlUs3dxFdFWC5wgSVO2zZ9U25cRau_JsYehB8L8N4UV1LhVFJeN3ZglzMHRkihq6o3dOwlqeeM2w)

위 그림과 같이 나오는데요.

빨간색 사각형이 app 폴더 밑에 있는 layout.tsx 파일에 있는 거고,

노란색 사각형이 바로 app/todos 폴더 밑에 있는 page.tsx파일에 있는 겁니다.

아직까지는 app/todos 폴더 밑에 layout.tsx 파일을 만들지는 않았습니다.

나중에 만들건데요. 지금은 그냥 지나갑시다.

사진을 보니까 이제 중첩된 레이아웃에 대해 이해할 수 있겠죠?

Todos 라우팅도 만들었으니까 지금부터는 데이터를 fetching 하는 방법을 알아보겠습니다.

<hr />
## Next.js 13 버전부터는 모든 React 컴포넌트는 서버사이드 컴포넌트입니다.

13 버전부터 Next.js가 의도하는 게 바로 기본 서버 사이드 컴포넌트인데요.

이게 뭘 의미하는지 앞으로 차차 살펴볼 예정입니다.

todos 폴더 밑에 page.tsx 파일에 todos 관련 데이터를 가져올 수 있는 로직을 작성합시다.

```js
import React from "react";
import TodosList from "./TodosList";

type Props = {};

function Todos({}: Props) {
  return (
    <div className="border-4 border-yellow-500 text-2xl text-yellow-400 p-2">
      This is Todos Page
      <div className="flex">
        {/* @ts-ignore */}
        <TodosList />
      </div>
    </div>
  );
}

export default Todos;
```

위 코드를 보시면 일단 TodosList 컴포넌트를 추가하고 있습니다.

{/* @ts-ignore */}라고 쓴 부분은 ES-Lint 에러인데요.

향후 Next.js 13 버전이 안정화되면 없애도 됩니다.

지금은 이게 없으면 계속 TypeScript 경고가 떠서 귀찮기 때문입니다.

그럼 TodosList 컴포넌트를 따로 만들어야겠네요.

버전 13부터는 /app/todos 폴더 밑에 컴포넌트를 만들어도 됩니다.

예전에는 별도 컴포넌트 폴더를 만들어서 그곳에 모두 저장했었는데요.

Next.js 13부터는 해당 라우팅 폴더에 직접 저장해도 됩니다.

뭔가 더 직관적이랄까요!!!

```js
import Link from "next/link";
import React from "react";

type Props = {};

const fetchTodos = async () => {
  const results = await fetch("https://jsonplaceholder.typicode.com/todos");
  const todos: TodoType[] = await results.json();
  return todos;
};

async function TodosList({}: Props) {
  const todos: TodoType[] = await fetchTodos();
  //   console.log(todos);
  return (
    <div>
      {todos?.map((todo) => (
        <p key={todo.id} className="text-base">
          <Link href={`/todos/${todo.id}`}>Todo #{todo.id}</Link>
        </p>
      ))}
    </div>
  );
}

export default TodosList;
```

위 코드를 보시면 기존 Next.js 코드에서는 상상할 수 도 없던 일이 일어나고 있는데요.

서버사이드 데이터 가져오기를 그냥 리액트 컴포넌트 안에서 하고 있습니다.

예전에는 getServerSideProps 함수를 통해서만 할 수 있었던 일이었는데요.

13 버전부터는 모든 컴포넌트가 서버 사이드 컴포넌트이기 때문입니다.

그래서 위 코드와 같이 작성해도 전혀 문제가 없습니다.

todos 자료는 jsonplaceholder API를 이용했고요.

여기서 잠깐 TodoType 타입 지정을 해야 하는데요.

프로젝트 최상위 폴더 즉, tsconfig.json 파일이 있는 폴더에 typings.d.ts 파일을 만듭시다.


```js
type TodoType = {
    userId: string;
    id: string;
    title: string;
    completed: boolean;
  };
```
이렇게 타입스크립트 타입을 저장하면 타입스크립트가 알아서 해당 타입을 찾아줍니다.

이제 실행 결과를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEhYw5uoe8nCltpmFcHm89gqWmDf_3GmTix6lOCLxR-J10xXuvzAGBVcpETEy4rHpu99_Plf2XmeX9iGSz8_IA-l8neOgyXwdkhDm1O9IbpC2EWImWuJJjAk5gpIuujslN9JKHe_ic_q2auXvuG7frVcQMt7YAYptO1XHRXP-EH4GqE3tgklAjT60CYD)

우리가 사용하려는 todos API는 총 200개를 반환해 줍니다.

위 그림처럼 아주 잘 작동하고 있네요.

<hr />
## 다이내믹 라우팅 만들기

이제 남은 거는 바로 각각의 Todo 넘버를 눌렀을 때 라우팅 되는 상세 페이지인데요.

Todo Id를 이용해야 하기 때문에 다이내믹 라우팅이 되어야 합니다.

13 버전도 12 버전처럼 다이내믹 라우팅은 브래킷 '[]' 방식을 이용합니다.

그럼 '/app/todos/[todoId]' 폴더를 만 들고 그 밑에 page.tsx 파일을 만듭시다.

```js
import React from "react";

type Props = {
  params: {
    todoId: string;
  };
};

const fetchTodo = async (todoId: string) => {
  const result = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId}`
  );
  const todo: TodoType = await result.json();
  return todo;
};

async function TodoId({ params: { todoId } }: Props) {
  const todo = await fetchTodo(todoId);
  return (
    <div className="bg-slate-300 space-y-2 p-2 border-4 border-blue-400">
      <div>Todo Id : {todoId}</div>
      <div>Todo Title : {todo.title}</div>
      <div className="border-t border-black py-2">
        Completed :{todo.completed ? <span> Yes</span> : <span> No</span>}
      </div>
    </div>
  );
}

export default TodoId;
```

다이내믹 라우팅의 params를 가져오는 방식은 간단합니다.

폴더 구조가 바로 '/app/todos/[todoId]' 이기 때문에 해당 params는 todoId가 되고, 이 todoId에 string 값이 저장됩니다.

그래서 아래와 같이 Props 타입을 지정하면 쉽게 이용할 수 있습니다.
```js
type Props = {
  params: {
    todoId: string;
  };
};
```
todoId를 알았으면 다시 서버단에서 해당 todo를 가져와야 하는데요.

여기서도 바로 서버 사이드 코드를 실행했습니다.

뭔가 백엔드 코드를 작성하고 있다는 느낌이 지워지지 않는데요.

정말 괜찮게 느껴집니다.

얼마나 서버가 버텨줄 수 있는지 지켜봐야겠지만요.

실행 결과를 사진으로 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEh4t9IX6Wseviu5Y4YxJrndY7PxtM9--q5z2g8N1kwxPadig4cH2-w2CAKfqi8vsNDPGSvCZWvHxvBjfvFmGivrz_iDfg9xu8kKdCFpydx4FmHa-m9cSED-4zr1jtNryxWmbXPVHskXJmiGFdmn3-PAawj52YEcZ3zMC81BHcRp0FTrOqzDpCzkTBf6)

역시나 생각대로 잘 작동되고 있습니다.

<hr />
## Nested Layout 살펴보기

이제 Next.js 13 버전의 가장 중요한 기능인 Nested Layout에 대해 알아보겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEigewcVGHrro5whpisbHYkKac2PQogYCVpGoF9PFPfnXBe2b8R9t7Y436FtwqMfGGKk16_0CWK615yYlKQbui4ifPtcGfa52v6V4vCqha22RrNN5g0RdhpPQiF_Mv8RAqmWDaGgVjYoWSMUapx6nvUktfciPWaR-iMt9cPt_eoj8Bz4otYz0QfimjK5=s16000)

위 그림에서 보듯이 왼쪽은 처음 화면이 로드될 시점이고 오른쪽이 화면이 완전히 로드된 상태인데요.

화면의 위쪽은 메뉴 리스트이고 옆 쪽은 todo 아이템 리스트일 거고 화면 중앙이 바로 todo 상세 페이지입니다.

Nested Layout을 적용하면 이렇게 세 가지의 분할된 로딩이 가능한데요.

화면 옆의 todo 번호를 누르면 화면 중앙의 상세페이지만 로드되는 방식인데요.

기존 React에서는 전체 화면이 갱신되는 방식인데요.

Nested Layout 방식을 쓰면 필요한 부분만 다시 렌더링 되기 때문에 전체적으로 페이지가 정말 빠르게 작동됩니다.

그럼 Nested Layout을 어떻게 작성할까요?

우리의 예제에서는 아래와 같이 작성해야 합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjq3M4qp9sgxC31qj-KBFdmYRhyP5rWRfxqtYKW6oULPrUqk6mIrP1d0Sd7jGWrrO6DoNZQgz498Kp6LnEpfk4X9xf_VAa4KCBLpNsJRmRDhhAYAp0T_lTPoaC9HXPDqKLYLY3a1RefWoLSOziFyalR-RJwol7xttwq6gJkXkeL5kWOmKwili6OgB_2)

위 그림을 보시면 맨 위는 Header 컴포넌트이고 옆이 바로 Todo 넘버가 표시되는 부분이고 화면 중앙이 해당 Todo의 상세 페이지입니다.

위와 같이 만들려면 어떻게 해야 할까요?

일단 Header 컴포넌트는 안 건들어도 되고요.

기존에는 todos 폴더 밑에 layout.tsx 파일을 안 만들었었는데요.

todos 폴더에 새롭게 layout.tsx 파일을 만들어서 상세페이지를 todos 폴더에 있는 layout.tsx 파일에 삽입해야 합니다.

최종적으로 중첩 레이아웃을 구성하려면 /app/todos/layout.tsx 파일을 아래와 같이 만들어야 합니다.

```js
import React from "react";
import TodosList from "./TodosList";

type Props = {
  children: React.ReactNode;
};

function TodosLayout({ children }: Props) {
  return (
    <div className="flex">
      {/* @ts-ignore */}
      <TodosList />
      <div className="w-full">{children}</div>
    </div>
  );
}

export default TodosLayout;
```

아까 위에서 잠깐 봤던 todos 폴더 밑의 page.tsx 파일의 내용과 비슷한데요.

todos/pages.tsx 파일의 내용을 위 layout.tsx에 그대로 옮기고 그리고 마지막으로 children을 추가했습니다.

그리고 todos/pages.tsx 파일은 다음과 같이 수정하면 됩니다.

```js
import React from "react";

type Props = {};

function Todos({}: Props) {
  return (
    <div className="border-4 border-yellow-500 text-2xl text-yellow-400 p-2">
      This is Todos Page
    </div>
  );
}

export default Todos;
```

그러면 최종 실행 결과는 아래와 같이 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjSdCFAUHgeKFHWewuOCHX6IYEwGWHJlo4JRP2UGLplgyZ3RtQQDKLS3XI_pQVnlowY-6PUXbO9GpgP33DbrTRTsb9xqxNMzTeWdQlid-FXfujp032yJ4yYnkmufOVFcWoNhA_pszmi-G2g7gQgwgPUr_Jb7-vSaqqF_rT2D4_gQX_naQq2f35alD4g)

todos 폴더 밑에 있는 layout.tsx 파일을 잘 보시면 children 이라는 props가 있는데요.

바로 todos 폴더 밑에 있는 '[todoId]' 라우팅이 바로 이 children props 자리에 들어가는 방식입니다.

그래서 실제 todo 넘버를 클릭하면 아래 그림과 같이 작동하게 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgxjbX3oRTfg5hdmO2oiHWxssgfW2KIpSL-cImgx6ceNE7BdT5wkGXxeEYurdbRFkN01ykRyooLatf0GaVitn-Mk1XqjfTPyMqfHbGlSSKFdKiprwMEV6f3_glPVLBtjQIi6pYVEs9gu4i0Z7KPekvS-mz5zL3sfUqeylGIUoya2eA0lLjgow3CFBSt)

이 Nested Layout 방식이 좋은 점은 바로 Todo 넘버들은 다시 로드되지 않고, 해당 Todo 상세 페이지만 로드된다는 점입니다.

이걸로 중접 레이아웃을 완성했는데요.

오늘은 여기까지만 살펴 보겠습니다.

<hr />
## Next.js 13 버전 처음 살펴본 소감

제가 Remix Framework에 심취해서 블로그도 Remix를 이용해서 새로 개편하고 여러 가지 사이드 프로젝트를 만들어 봤는데요.

Next.js 13 버전이 추구하는 게 바로 Remix Framework가 추구하는 방식과 거의 비슷합니다.

Remix에서도 한 개의 파일에서 서버사이드 코드도 작성할 수 있고 클라이언트 코드도 작성할 수 있고,

중첩 구조의 라우팅도 제공하고 있고, 여러 가지가 비슷한데요.

다른 점은 Remix에서는 폴더 구조와 함께 파일 이름으로도 라우팅을 구성할 수 있다면 Next.js 13 버전은 오로지 폴더 라우팅 방식인 점이 틀립니다.

결론적으로 계속해서 코드를 작성하다 보면 Remix와 정말 닮았다고 느끼게 되는데요.

Next.js 13 버전의 중첩 레이아웃 구성도 쉽게 이해되는 점이 바로 Remix에서 한번 살펴보았기 때무이 아닐까 생각합니다.

그리고 여러분들도 Remix를 꼭 한번 사용해 보시길 바랍니다.

Next.js도 좋은 Framework이지만 Remix도 정말 좋은 Framework이라고 자부합니다.

다음 시간에는 Next.js 13 버전의 ISR, SSR 등등에 대해 알아보겠습니다.

그럼.
