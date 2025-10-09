---
slug: 2024-10-19-cloudflare-remix-hono-todo-app
title: Fullstack 강좌 - Hono RPC + Remix + Cloudflare + D1 DB 조합으로 Todo 앱 만들기
date: 2024-10-19 03:00:08.015000+00:00
summary: Hono RPC 기능을 활용하여 API Endpoint 구축하여 Remix Framework으로 Todo 앱 만들기
tags: ["remix", "hono", "rpc", "cloudflare", "api endpoint", "todo app"]
contributors: []
draft: false
---

안녕하세요?


지난 시간에 이어 Cloudflare에서 Remix Framework과 Hono의 RPC 기능을 활용한 API Endpoint 구축하기 2번째 편인 Todo 앱 만들기를 진행하도록 하겠습니다.

1편에서는 Hono RPC를 이용한 API Endpoint를 KV로 구축했는데요.

API를 Hono로 작성하는 방법과 Remix에서 Hono를 이용하는 방법, 그리고 최종적으로 Cloudflare network에 배포까지 끝냈는데요.

오늘은 본격적인 테스트 앱으로 Todo 앱을 D1 DB를 이용해 보겠습니다.

지난 시간에는 KV의 사용방법을 배웠기 때문에 오늘은 D1 DB를 배워본다는 개념으로 강의 진행하겠습니다.

아래는 지난 시간 강좌 링크입니다.

[Cloudflare에서 Remix Framework과 Hono의 RPC 기능을 활용한 API Endpoint 구축하기](https://mycodings.fly.dev/blog/2024-10-14-cloudflare-remix-framework-hono-rpc-api-endpoint)

---

## D1 DB 설정

먼저, D1 DB의 설정부터 시작해야하는데요.

터미널 상에서 다음과 같이 입력하시면 wrangler가 아주 쉽게 DB를 구축해 줍니다.

```sh
$ npx wrangler d1 create remix-hono-todo-test

 ⛅️ wrangler 3.57.1 (update available 3.80.5)
-------------------------------------------------------
✅ Successfully created DB 'remix-hono-todo-test' in region APAC
Created your new D1 database.

[[d1_databases]]
binding = "DB" # i.e. available in your Worker on env.DB
database_name = "remix-hono-todo-test"
database_id = "b8asfdfa-9sadfe37-4fasdfd71-casdfsddb614" # 참고로, 강의를 위한 fake id입니다.
```

위와 같이 터미널상에 D1 DB의 설정 세팅값까지 친절하게 알려주는데요.

wrangler.toml 파일의 아래부분을 위에서 얻은 세팅값으로 바꿔주면 끝입니다.

```sh
# [[d1_databases]]
# binding = "MY_DB"
# database_name = "my-database"
# database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

이제 D1 DB를 생성까지 했는데요.

이제는 실제 DB의 테이블을 만들어야 합니다.

보통 여기서 Drizzle ORM 같은 ORM을 사용하는데요.

제 예전 강좌 보시면 Drizzle ORM 사용법이 나옵니다.

그런데 오늘은 Drizzle ORM 없이 진행해 보려고 합니다.

먼저, 만들려고 하는 테이블의 스키마 파일을 만들어야 합니다.

일단 db 폴더를 만들고 그 밑에 'schema.sql' 파일을 아래와 같이 만듭시다.

```sh
DROP TABLE IF EXISTS Todos;
CREATE TABLE IF NOT EXISTS Todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  completed INTEGER NOT NULL DEFAULT 0
);

INSERT INTO Todos (title) VALUES ("test");
```

위에서 보시는 건 바로 SQlite3의 SQL 문(statement)인데요.

영어 그대로 해석하셔도 쉽게 무슨 뜻인지 알 수 있을 겁니다.

이 강좌는 SQLite3 강좌가 아니라서 상세한 설명은 건너 뛰겠습니다.

위 sql 파일은 Todos라는 테이블을 만드는데, id는 integer 값 (정수값)이고 autoincrement 성격을 갖습니다.

그리고 title은 텍스트 값이고, 중요한 completed는 아무리 봐도 boolean 값이 들어가야 하는데, 위에서는 integer 값으로 설정되었는데요.

SQlite3는 boolean 타입을 지원하지 않습니다.

그래서 integer 타입으로 설정하고 0 이면 false, 1 이면 true로 취급하는게 일반적인 코딩 룰입니다.

그리고 디폴트(default) 값으로 0으로 설정했기 때문에 아무것도 안하면 알아서 0으로 세팅됩니다.

그리고 마지막으로 더미 데이터 한개를 INSERT 문으로 삽입했습니다.

그러면 이 schema.sql 파일을 아까 우리가 만든 'DB'라는 바인딩 이름인 실제 DB에 적용해야 하는데요.

여기서 중요한 점은 두 군데에 적용해야 한다는 겁니다.

한 군데는 실제 Cloudflare Network상의 D1 DB에 적용하는 거고, 두 번째는 로컬 즉, 우리가 테스트를 위해 개발 서버를 돌리는 여러분의 실제 컴퓨터에 적용해야하는 겁니다.

로컬 개발 서버에 설치하려면 '--local' 옵션을 주면 되고, 실제 Cloudflare Network에 적용하려면 '--remote' 옵션을 주면 됩니다.

그러면 실제로 적용해 보겠습니다.

아래와 같이 터미널에서 명령문을 입력하고 실행해 보시죠.

```sh
$ npx wrangler d1 execute remix-hono-todo-test --local --file=./db/schema.sql

 ⛅️ wrangler 3.57.1 (update available 3.80.5)
-------------------------------------------------------
🌀 Executing on local database remix-hono-todo-test
(xxxx-x-x-x-x-xxx-x-x-x-x) from .wrangler/state/v3/d1:
🌀 To execute on your remote database, add a --remote flag to your wrangler command.
```

위와 같이 d1 다음에 execute 명령어를 주면 됩니다.

그리고 '--local' 옵션과 schema.sql 파일의 위치를 알려주는 '--file' 옵션을 주었습니다.

위와 같이 나오면 성공적으로 실행된겁니다.

그리고 두 번째 실제 Cloudflare Network 상에 테이블을 생성하려면 '--local' 옵션을 '--remote'라는 옵션으로 바꿔 주면 됩니다.

```sh
$ npx wrangler d1 execute remix-hono-todo-test --remote --file=./db/schema.sql     

 ⛅️ wrangler 3.80.5
-------------------

✔ ⚠️ This process may take some time, during which your D1 database will be unavailable to serve queries.
  Ok to proceed? … yes
🌀 Executing on remote database remix-hono-todo-test
(xxxxx-xxxxx-x-x-x-x-x-x
):
🌀 To execute on your local development database, remove the --remote flag from your wrangler command.
Note: if the execution fails to complete, your DB will return to its original state and you can safely retry.
├ 🌀 Uploading xxxxx-xxxxx-x-x-x-x-x-x cf2be6e449aa524e.sql 
│ 🌀 Uploading complete.
│ 
🌀 Starting import...
🌀 Processed 3 queries.
🚣 Executed 3 queries in 0.00 seconds (3 rows read, 6 rows written)
   Database is currently at bookmark
   00000002-00005-00e2d-7412dc6fa898327fcf8a378bf.
┌────────────────────────┬───────────┬──────────────┬────────────────────┐
│ Total queries executed │ Rows read │ Rows written │ Database size (MB) │
├────────────────────────┼───────────┼──────────────┼────────────────────┤
│ 3                      │ 3         │ 6            │ 0.02               │
└────────────────────────┴───────────┴──────────────┴────────────────────┘
```

"Ok to proceed? 라고 나오는데 엔터키를 누르면 진행됩니다.

간혹가다가 다음과 같은 에러가 나올때가 있는데요.

wrangler 버전 관련 문구가 나올 때가 있습니다.

```sh
✘ [ERROR] Cannot read properties of undefined (reading 'forEach')
```

이럴 때는 wrangler를 해당 최신버전을 올리면 해결됩니다.

이제 실제 Cloudflare 대시보드에 가서 확인해 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEik_5D7zxnb5saWp91vYX4DEtfX8Z1WGgCCYg7q5wRl_8_SMlfVa-LeN4DTqV8a-YCALi_GNEHHV6HakE0LNca_f3KMXxPPmHFSuE0o6U-UMQbrIHtNzMVCgjeLQxyM90Yak5Iwm5a_pSY967j-1Qfs5Gn_NOG_vrdKUdiSw_10CC9LLCEO6ZiYbbxJ0qk)

위 그림과 같이 잘 적용되었네요.

---

## DB 바인딩 값 Env에 적용하기

이제 새로운 Cloudflare 서비스를 이용하려고 세팅했기 때문에 아래와 같이 "typegen" 명령어로 Env 인터페이스를 업데이트 해줘야 합니다.

터미널 상에 아래와 같이 입력합시다.

```sh
$ npm run typegen

> typegen
> wrangler types


 ⛅️ wrangler 3.80.5
-------------------

Generating project types...

interface Env {
        kv: KVNamespace;
        SECRET: "secret is hono-remix-adapter";
        DB: D1Database;
}
```

위와 같이 wrangler가 Env 인터페이스를 업데이트 했네요.

해당 내용은 'worker-configuration.d.ts' 파일에 잘 적용되어 있습니다.

이제 Hono RPC에서 D1 DB를 이용할 준비가 다 끝났습니다.

이제 본격적으로 Hono를 이용해서 Todo 앱을 위한 API Endpoint를 작성해 보겠습니다.

---

## Hono로 API route 구축하기

Hono의 서버 파일이 server 폴더의 index.ts 파일인데요.

이 파일안에 모든 라우팅의 API 코드를 쑤셔 넣는다는 거는 조금 비효율적인데요.

다행히 Hono는 모듈러 방식의 코드 쪼개기(Splitting)을 지원해 줍니다.

server 폴더에 api 폴더를 만들고 그 밑에 또 다시 todos 폴더를 만들고 todos 폴더 밑에 일단 'index.ts' 파이을 만듭시다.

이 파일이 우리가 만드려고 하는 'api/todos'가 엔드포인트인 API 라우팅의 가장 기본이 되는 파일이 되는겁니다.

일단 이 파일의 구성을 대체적으로 살펴봅시다.

```ts
// '/server/api/todo/index.ts'

import { Hono } from "hono";

import { getTodos } from "./model";

// RPC를 위해서는 new Hono<>().get 형식으로 붙혀서 만들어야 한다.
const api_todos = new Hono<{ Bindings: Env }>()
  .get("/todos", async (c) => {
    const todos = await getTodos(c.env.DB);
    return c.json(todos);
});

export default api_todos;
```

위와 같이 만들어야 합니다.

RPC를 위해서는 Hono 객체를 만들고 꼭 메서드 체이닝 방식으로 구현해야 합니다.

Hono 공식문서에서도 얘기해 주지 않아 이거 때문에 3시간 삽질했는데요.

일단 이렇게 코드를 작성했습니다.

저는 실제 DB 관련된 코드는 model 이란 파일에 별도로 따로 작성하려고 합니다.

'/server/api/todo/index.ts' 파일은 순전히 Hono의 라우팅만 중점적으로 집중하기 위해서입니다.

참고로 'c.env.DB'라고 하면 우리가 만든 Cloudflare D1 DB를 지칭하게 됩니다.

왜 이름이 DB냐면 아까 우리가 아래와 같이 지정한 그 이름이 'DB'이기 때문입니다.

다른 이름으로 별칭을 만들어도 됩니다.

```sh
[[d1_databases]]
binding = "DB" # i.e. available in your Worker on env.DB
database_name = "remix-hono-todo-test"
database_id = "b8asfdfa-9sadfe37-4fasdfd71-casdfsddb614"
```

그러면 같은 폴더에 model.ts 파일을 만들고 getTodos 함수를 구현해 보겠습니다.

```ts
import { z } from "zod";

// Todo 스키마
export const TodoSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1).max(100),
  completed: z.number().default(0),
});

export interface Todo {
  id: number;
  title: string;
  completed: number;
}

export const getTodos = async (DB: D1Database): Promise<Todo[]> => {
  try {
    // SQL 쿼리를 사용해 D1에서 모든 Todo 항목을 가져옴
    const result = await DB.prepare("SELECT * FROM Todos").all<Todo>();

    // 쿼리 결과를 반환
    return result.results || [];
  } catch (error) {
    console.error("Failed to fetch todos from D1 DB", error);
    return [];
  }
};
```

위 코드를 보시면 나중을 위해 TodoSchema를 미리 세팅해 놨습니다.

POST 메서드일 때 쓸 예정입니다.

그리고 Promise 리턴 타입으로 쓸 Todo 타입을 interface를 이용해서 새로 만들었습니다.

그리고 대망의 getTodos 함수인데요.

Cloudflare D1 DB 튜토리얼에 가시면 DB.prepare 함수와 all, run, first 메서드를 쓰는 방법이 다 나왔으니 꼭 읽어보시기 바랍니다.

위 코드는 Todos 테이블에서 모든 걸 (all 메서드 사용) 가져오라는 명령인데요.

D1 DB가 all() 함수로 실행되면 리턴하는 result 객체의 타입을 미리 공부할 필요가 있는데요.

아래와 같은 타입으로 리턴됩니다.

```ts
// result type of method all()
    {
      success: true,
      meta: {
        served_by: 'miniflare.db',
        duration: 0,
        changes: 0,
        last_row_id: 0,
        changed_db: false,
        size_after: 16384,
        rows_read: 1,
        rows_written: 0
      },
      results: [ { id: 9, title: '1111', completed: 0 } ]
    }
```

실제 Sqlite3의 리턴타입은 위와 같지 않습니다.

위와 같은 리턴 타입은 Cloudflare가 modify한 겁니다.

일단 success 값으로 SQL 쿼리 실행여부를 쉽게 알아 볼 수 있고, results 값으로 리턴값만 쉽게 알 수도 있습니다.

그러면 이제 getTodos 함수의 역할이 이해 되시죠?

이제 getTodos 함수와 Hono의 API Endpoint 구성이 90% 끝났습니다.

마지막 10%의 설정은 바로 server 폴더의 index.ts 파일에 우리가 만든 API Endpoint 라우팅을 삽입시키고 RPC를 위한 AppType을 만들어야 합니다.

```ts
// '/server/index.ts'

import { Hono } from "hono";
import { cors } from "hono/cors";
import api_todos from "./api/todos";

const app = new Hono<{ Bindings: Env }>();

app.use("*", cors());

// KV를 어떻게 사용하는지 보여주는 예전 코드
app.get("/hono-test", async (c) => {
  const { kv } = c.env;

  await kv.put("hono-remix-adapter", "hono can access cloudflare kv");
  const value = await kv.get("hono-remix-adapter");
  console.log(value);

  return c.text(
    `Hono kv is ok, value is ${value} ,\n My_var is ${c.env.SECRET}`
  );
});

const route = app.route("/api", api_todos);

export default app;

// Hono RPC를 위한 AppType export 시키기
export type AppType = typeof route;
```

위 코드를 잘 보시면 일단 Hono 객체를 app이라는 이름으로 만들었습니다.

이 app 이라는 이름의 Hono객체가 메인 라우팅이되고, 그리고 아까 우리가 만들었던 api_todos 라우팅이 서브 라우팅이 되는거죠.

그리고 export type AppType 방식으로 RPC를 위한 AppType을 export 했습니다.

참고로, 메인 라우팅이 되는 app객체에 get 메서드로 'hono-test' 라는 라우팅을 구현했습니다.

KV를 테스트 하기 위해 예전에 작성한 코드입니다.

사실 위 코드는 없어도 되는데 순전히 테스트를 위해 남겨놓은 거니 나중에 불필요하시면 지우시면 됩니다.

이제 설정이 끝났습니다.

---

## Remix에서 RPC를 이용해서 getTodos 함수 실행하기

이제 Client side 쪽 코드입니다.

엄밀히는 Remix Framework 쪽 코드를 만들어야 겠죠.

먼저, RPC를 위해 아래와 같은 유틸리티 파일을 먼저 만듭시다.

app 폴더 밑에 utils 폴더를 만들고 'apiClient.ts' 파일을 만들고 아래와 같이 입력합시다.

```ts
// '/app/utils/apiClient.ts'

import { hc } from "hono/client";
import { AppType } from "../../server";

export const client =
  import.meta.env.MODE === "production"
    ? hc<AppType>(import.meta.env.VITE_API_URL)
    : hc<AppType>("http://localhost:5173/");

export const clientGetTodos = async () => {
  const data = await client.api.todos.$get();
  return data;
};
```

위 코드를 보시면 Hono의 RPC를 실제로 만드는 방법이 나오는데요.

'hono/client'가 제공해 주는 hc 함수를 이용해서 아까 export 했던 AppType을 제네릭 타입으로 넣고, 그리고 중요한 해당 API 서버 주소를 넣어주면 끝입니다.

저는 production 모드일 때는 실제 주소로 넣고, 개발 모드일 경우 localhost:5173으로 넣도록 삼항연산자를 위와 같이 적용했습니다.

그리고 실제 클라이언트 사이드쪽에서 사용할 clientGetTodos 함수를 만들었는데요.

이 코드가 바로 클라이언트에서 실행되면 위와 같이 Hono의 RPC API Endpoint를 실행시켜 원하는 데이터를 가져오는 원리입니다.

위 코드를 보시면 우리가 만든 client 객체에 체인 방식으로 api, todos를 넣었습니다.

왜 'api.todos'하고 그 다음에 "$get()" 메서드를 실행했냐면 우리가 아까 Hono의 API Endpoint를 만들 때 경로가 바로 api 폴더 밑에 todos 폴더 밑의 index.ts 파일이었기 때문입니다.

실제로 브라우저에서도 "http://localhost:5173/api/todos"해도 똑같이 작동합니다.

그래서 실제 브라우저의 경로명대로 client 뒤에 메서드 체이닝 방식으로 라우팅 주소를 넣어주고 마지막에 원하는 GET 메서드를 지정하는 겁니다.

만약 POST 메서드라면 다음과 같이 하면 되겠죠.

`client.api.todos.$post()`

그리고 중요한거는 $get 함수를 실행해야 한다는 겁니다.

그래서 $get 함수명 뒤에 '()' 괄호를 붙혀 해당 $get 함수를 실행(invoke) 시켰습니다.

이제 apiClient 유틸리티 파일의 작성이 끝났으면 이 다음에는 실제 클라이언트쪽에서 todos 라우팅을 구현해 보겠습니다.

그 앞에 먼저, routes 폴더 밑의 '_index.tsx' 파일을 아래와 같이 수정해서 메인 페이지를 조금 간단하게 수정하겠습니다.

```ts
import type { MetaFunction } from "@remix-run/cloudflare";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-16">
        <header className="flex flex-col items-center gap-9">
          <h1 className="leading text-2xl font-bold text-gray-800 dark:text-gray-100">
            Welcome to <span className="sr-only">Remix</span>
          </h1>
          <div className="h-[144px] w-[434px]">
            <img
              src="/assets/logo-light.png"
              alt="Remix"
              className="block w-full dark:hidden"
            />
            <img
              src="/assets/logo-dark.png"
              alt="Remix"
              className="hidden w-full dark:block"
            />
          </div>
        </header>
        <nav className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-gray-200 p-6 dark:border-gray-700">
          <a
            className="group flex items-center gap-3 self-stretch p-3 leading-normal text-blue-700 hover:underline dark:text-blue-500"
            href="/todos"
            rel="noreferrer"
          >
            Go to Todos
          </a>
        </nav>
      </div>
    </div>
  );
}
```

위와 같이 메인 라우팅을 바꾸면 아래와 같이 간단한 메인 페이지가 나올겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiYWTViPOkP2wrd2VQqFNgu3VxZcXwMrflWHqtvXESdq4aAs_ZS673L8RiCLCirwDqv_8MVPOC6meo-bVYhkQ9kT60bEX4oOOjF6Wes8aggTG0A_s_eZ3GCl-L78GRZeZhGhqfSExNQn2DYWYwg_E7hLGSOc1WbihM6XQl0oKViIOfpYtBzyL67owowAS8)

이제 본격적인 todos 앱 구현에 들어가 보도록 하겠습니다.

---

## todos 라우팅 구현

todos 앱이니까 todos 라는 라우팅을 만들어야겠죠.

Remix에서 라우팅은 간단합니다.

app 폴더 밑의 routes 폴더 밑에 폴더명이든 파일이름이든 적으면 그게 라우팅이 됩니다.

app 폴더 밑에 있는 routes 폴더에 todos.tsx 파일을 아래와 같이 만듭시다.

참고로, UI쪽은 [shadcn/ui](https://ui.shadcn.com/)를 사용해서 적용했습니다.

```ts
// '/app/routes/todos.tsx'

import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

import { Card, CardContent } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";

import { Todo } from "server/api/todos/model";
import { clientGetTodos } from "~/utils/apiClient";

export const meta: MetaFunction = () => {
  return [{ title: "Todo My App" }];
};

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const res = await clientGetTodos();
  return res;
};

// Todo Card
const TodoItem = ({ todo }: { todo: Todo }) => {
  return (
    <Card className="mb-4 hover:shadow-md transition-shadow duration-200">
      <CardContent className="flex items-center p-4">
        <Checkbox id={`todo-${todo.id}`} className="mr-4" />
        <div className="flex-grow">
          <label
            htmlFor={`todo-${todo.id}`}
            className="opacity-100 text-lg font-medium leading-none text-gray-700"
          >
            {todo.title}
          </label>
        </div>
      </CardContent>
    </Card>
  );
};

const Todos = () => {
  const todos = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white text-gray-800 p-4 shadow-sm">
        <div className="container mx-auto">
          <a href="/todos" className="text-2xl font-bold">
            My TODO App
          </a>
        </div>
      </header>
      <main className="container mx-auto py-8 px-4">
        <div className="w-full max-w-4xl mx-auto">
          <div className="space-y-4">
            {Array.isArray(todos) &&
              todos.map((todo) => <TodoItem key={todo.id} todo={todo} />)}
          </div>
        </div>
      </main>
    </div>
  );
};
export default Todos;
```

개발 서버를 실행해보면 아래 그림과 같이 나올겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgmzq9lmMVJU3vSmfOjf6tuluLRnERoi8mrgboetdeNTK8Kzj-IGluYLnLgVDqb35a7Opal7SJSIwtRtU_6FYjcSqBGzm6OiV5UQ3k4IueZ5w9m-LQ5wRNqJdzaCREu5UuacA6k252qLUOzlxvrZBEybOPaj4eNMBPVEvPqDxDITH7YuKtRZzDiYKyZrTE)

어떤가요?

Hono RPC를 이용해서 getTodos 백엔드 함수를 클라이언트에서 손쉽게 client 객체를 이용해서 불러왔습니다.

심지어 Hono RPC의 $get 메서드는 React Query를 구현할 때 제공하는 fetch 함수에 그대로 넣을 수도 있습니다.

Hono 공식 홈페이지를 보시면 사용방법이 나오는데요, 참고 하시기 바랍니다.

todos.tsx 파일의 내용은 loader 함수에서 백엔드쪽 데이터를 얻은 다음 클라이언트 쪽 코드에서는 useLoaderData 훅을 이용해서 그 데이터를 클라이언트쪽 UI에 뿌려주는 전형적인 React 코드입니다.

기본적인 사용방법을 익히셨으면 본격적으로 Input과 Delete그리고 completed 체크박스 토글까지 todos.tsx 파일에 구현해야 하는데요.

그럼 본격적으로 시작해 보겠습니다.

---

## update 구현하기

이번에 구현할 UI 로직은 체크 박스를 누르면 Todo 앱의 completed 값이 false가 되면서 todo 타이틀의 글자가 line-through 방식으로 보여주게 하는게 최종 목적입니다.

일단 이 방식은 클라이언트쪽에서 단순하게 자바스크립트만을 이용해서 작성하겠습니다.

예전 React 코드 작성방식이랑 같습니다.

먼저, UI쪽 코드를 손보겠습니다.

TodoItem 컴포넌트를 아래와 같이 고칩시다.

```ts
// Todo Card
const TodoItem = ({ todo }: { todo: Todo }) => {
  const [isCompleted, setIsCompleted] = useState(todo.completed);

  const handleCheckboxChange = async (checked: boolean) => {
    await client.api.todos[":id"].$put({
      json: {
        title: todo.title,
        completed: isCompleted,
      },
      param: {
        id: todo.id.toString(),
      },
    });

    setIsCompleted(isCompleted === 0 ? 1 : 0);
  };

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow duration-200">
      <CardContent className="flex items-center p-4">
        <Checkbox
          id={`todo-${todo.id}`}
          checked={isCompleted === 0 ? false : true}
          onCheckedChange={handleCheckboxChange}
          className="mr-4"
        />
        <div className="flex-grow">
          <label
            htmlFor={`todo-${todo.id}`}
            className={`
              opacity-100 text-lg font-medium leading-none ${
                isCompleted ? "line-through text-gray-400" : "text-gray-700"
              }`}
          >
            {todo.title}
          </label>
        </div>
      </CardContent>
    </Card>
  );
};
```

뭔가 복잡한데 아주 쉬운 자바스크립트 코드입니다.

먼저, UI 쪽 보시면 label 태그가 'isCompleted'라는 state 값에 따라 'line-through' 가 적용되냐 안되냐로 작동합니다.

Checkbox 쪽에도 'checked' 값을 isCompleted'라는 state 값에 따라 적용시켰습니다.

이제 onCheckedChange 핸들러인 handleCheckboxChange 함수에 의해 DB쪽을 제어하는 코드를 봐야하는데 아래와 같습니다.

```ts
await client.api.todos[":id"].$put({
      json: {
        title: todo.title,
        completed: isCompleted,
      },
      param: {
        id: todo.id.toString(),
      },
    });
```

위 코드를 보니까 put 메서드를 이용해서 completed 값을 업데이트 하고 있네요.

그런데 todos 다음에 문자열 배열을 넣고 있습니다.

이게 바로 URL params를 넣는 방식입니다.

여기서는 'id'라는 params를 넣고 있는거죠.

id는 TodoItem 컴포넌트가 props로 받고 있는 Todo객체에 있습니다.

그리고 그 값은 바로 'todo.id'가 되는거죠.

현재 SQlite3 Table에는 id는 integer 값입니다.

그래서 URL로 넘겨줄 때는 string 값으로 고쳐야합니다.

'todo.id.toString()' 이렇게 하시면 됩니다.

$put 메서드에는 json 값과 param 값을 객체로 따로 넣었는데요.

이 json 값과 param 값이 실제 Hono 백엔드에서 어떻게 처리되는지도 유심히 살펴봐야 합니다.

---

이제 Hono를 이용한 백엔드 코드에서 put 메서드를 구현해야 겠습니다.

다시 'server/api/todos/index.ts' 파일에서 아래와 같이 코드를 추가합시다.

```ts
// 'server/api/todos/index.ts'

import { Hono } from "hono";
import { getTodos, updateTodo } from "./model";
import { zValidator } from "@hono/zod-validator";

// RPC를 위해서는 new Hono<>().get 형식으로 붙혀서 만들어야 한다.
const api_todos = new Hono<{ Bindings: Env }>()
  .get("/todos", async (c) => {
    const todos = await getTodos(c.env.DB);
    return c.json(todos);
  })
  .put("/todos/:id", zValidator("json", TodoSchema), async (c) => {
    const id = c.req.param("id");
    const validatedData = c.req.valid("json");
    // console.log(validatedData);

    await updateTodo(c.env.DB, parseInt(id), {
      title: validatedData.title,
      completed: validatedData.completed === 0 ? 1 : 0,
    });

    return c.json({ ok: true });
  });

export default api_todos;
```

zValidator는 그냥 import 하시면 됩니다.

이제 필요한건 model 폴더에 있는 updateTodo 함수인데요.

'model.ts' 파일에서 아래와 같이 updateTodo 함수를 만듭시다.

```ts
export interface UpdateTodoType {
  title: string;
  completed: number;
}

export const updateTodo = async (
  DB: D1Database,
  id: number,
  param: UpdateTodoType
): Promise<void> => {
  const todo = await DB.prepare("SELECT * FROM Todos where id = ?")
    .bind(id)
    .first<Todo>();

  if (!todo) {
    console.error(`Todo with id ${id} not found.`);
    return;
  }

  // 업데이트할 항목 정의 (기존 값과 새로운 값 병합)
  const updatedTodo = {
    ...todo,
    ...param,
  };

  // D1 DB에서 해당 id의 Todo 항목 업데이트
  const result = await DB.prepare(
    "UPDATE Todos SET title = ?, completed = ? where id = ?"
  )
    .bind(updatedTodo.title, updatedTodo.completed, id)
    .run();
};
```

먼저, update를 위해서는 Cloudflare D1 DB에서 bind() 메서드를 이용해서 id에 해당되는 todo를 가져왔습니다.

만약 해당 id에 대한 todo 가 없으면 에러를 내면서 그냥 return 되고요.

만약 해당 id에 대한 todo 가 있으면 업데이트하게 됩니다.

SQlite3 Update 하는 Statement는 따로 공부하셔야 할 겁니다.

이제 체크박스를 눌러보면 아래와 같은 결과가 나올겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEj67bQmm_7EXP-0HlIL6cAN9OPIz0bk3EZueJZsBwCMwSa5fjy-Hvf7IR04odkH9dj3oyjoAk-jSUZPxH36t6mygl40EBGvsXvevzHbB-QwlF8QLq_KDWNnVrhUHwqySclmpJOdF-VJGhng5jHjhdiqihA7JHcRjzUEM6l2BhzKOCEJH3IxnBvSW0mKBUg)

어떤가요?

Update 로직이 완성되었습니다.

Hono RPC를 이용한 벡엔드 코드 접근에 대해 조금은 이해하실수 있죠?

---

## Create 구현하기

이제부터는 POST 메서드인데요.

POST 메서드가 가장 기본이 되는 메서드라서 여기서 부터는 긴장해야할 겁니다.

먼저, model 파일에서 아래와 같이 createTodo 함수를 먼저 만들겠습니다.

```ts
// 'server/api/todos/model.ts'

export interface CreateTodoType {
  title: string;
}

export const createTodo = async (
  DB: D1Database,
  param: CreateTodoType
): Promise<Todo> => {
  try {
    // D1 DB에 새로운 Todo 항목 삽입
    const result = await DB.prepare("INSERT INTO Todos (title) VALUES (?)")
      .bind(param.title)
      .run();
    // console.log(result);


    // {
    //   success: true,
    //   meta: {
    //     served_by: 'miniflare.db',
    //     duration: 0,
    //     changes: 1,
    //     last_row_id: 9,
    //     changed_db: true,
    //     size_after: 16384,
    //     rows_read: 1,
    //     rows_written: 2
    //   },
    //   results: []
    // }

    // 삽입된 행의 ID 가져오기
    // const id = result.meta.last_row_id;

    if (!result.success) {
      throw new Error("Failed to retrieve the ID of the inserted Todo.");
    }

    // 새로 삽입된 Todo 객체 생성
    const newTodo: Todo = {
      id: result.meta.last_row_id,
      title: param.title,
      completed: 0,
    };

    return newTodo;
  } catch (error) {
    console.error("Failed to create todo in D1 DB", error);
    throw new Error("Todo creation failed");
  }
};
```

위 코드를 보시면 먼저, CreateTodoType 타입을 interface로 작성했습니다.

그리고 createTodo 함수로 들어가 보면, D1 DB에 새로운 Todo 항목 삽입하는 SQL 명령을 실행했습니다.

이렇게 실행하면 result 값에 객체가 반환되는데요.

위 코드 주석에 보시면 그 객체 값의 예가 나옵니다.

여기서 중요하게 봐야할게 바로 INSERT 쿼리가 정상적으로 실행되면 방금 실행한 값의 id를 가져올 수 있는데요.

바로 'result.meta.last_row_id' 값입니다.

이게 왜 중요하냐면 보통 INSERT하고 나면 성공적으로 INSERT가 된 후의 값을 다시 사용해야할 때가 있는데요.

이렇때 아주 유용합니다.

그래서 실제로 위 코드에서는 새로 삽입된 Todo 객체 생성를 생성하는데요.

왜 Todo 객체를 생성할까요?

왜냐하면 SELECT 문으로 Todo 객체를 가져오면 한 번 더 SQL 쿼리를 실행해야하기 때문이죠.

우리가 새로운 Todo 객체를 UI로 돌려줘야하기 때문에 새로운 Todo 객체에 필요한거는 title, completed 값과 id입니다.

title, completed 값은 createTodo 함수를 만들 때 벌써 제공되어진거라 알고 있고, id값만 알면 되기 때문에 위와 같이 'meta.last_row_id' 값으로 해당 id값을 지정하면 우리가 궁극적으로 원하는 새로운 newTodo 값을 알 수 있는거죠.

그리고 마지막으로 해당 newTodo 객체를 리턴하면 UI에서 해당 newTodo를 화면에 뿌려주면 됩니다.

이렇게 하면 불필요한 SQL 실행이 한번으로 줄어들기 때문에 이 방식은 아주 중요합니다.

이제 UI쪽을 볼까요?

'todos.tsx' 파일에서 input을 위한 Form을 작성해야 합니다.

테스트를 위해 간단하게 UI를 짜겠습니다.

먼저, 'shadcn/ui'의 input 컴포넌트와 아이콘을 위햇 'lucide-react' 패키지를 설치하겠습니다.

```sh
$ npx shadcn@latest add input

$ npm i lucide-react
```

그리고 Pending UI를 처음부터 구현해 볼껀데요.

그래서 input 폼을 위해 Remix가 제공하는 'Form' 컴포넌트를 사용할 겁니다.

실제 코드를 보시죠.

컴포넌트로 보시면 Todos 컴포넌트만 보시면 됩니다.

```ts
const Todos = () => {
  const todos = useLoaderData<typeof loader>();

  const navigation = useNavigation();

  const isAdding =
    navigation.state === "submitting" &&
    navigation.formData?.get("_action") === "create";

  let formRef = useRef<HTMLFormElement>(null);
  let inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAdding) {
      formRef.current?.reset();
      inputRef.current?.focus();
    }
  }, [isAdding]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white text-gray-800 p-4 shadow-sm">
        <div className="container mx-auto">
          <a href="/todos" className="text-2xl font-bold">
            My TODO App
          </a>
        </div>
      </header>
      <main className="container mx-auto py-8 px-4">
        <div className="w-full max-w-4xl mx-auto">
          
          {/* 새로 추가된 코드 */}
          <Form ref={formRef} replace method="POST">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-700">TODO 리스트</h2>
              <div className="flex space-x-3">
                <Input
                  type="text"
                  name="title"
                  placeholder="title"
                  required
                  ref={inputRef}
                />
                <Button
                  type="submit"
                  name="_action"
                  value="create"
                  disabled={isAdding}
                  className="bg-black text-white hover:bg-gray-800 transition-colors duration-200 rounded-xl px-4 py-2"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {isAdding ? "추가 중" : "TODO 추가하기"}
                </Button>
              </div>
            </div>
          </Form>
          <div className="space-y-4">
            {Array.isArray(todos) &&
              todos.map((todo) => <TodoItem key={todo.id} todo={todo} />)}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Todos;
```

위와 같이 조금 어렵게 느껴질 수 있는데요.

Pending UI를 위해서 Remix는 useNavigation 훅을 지원해 줍니다.

이 훅은 Form의 상태를 실시간으로 체크해서 알 수 있게 해주는데요.

```ts
const navigation = useNavigation();
```

위와 같이 useNavigation 훅을 navigation으로 지정하면 이제 navigation 객체에는 아래와 같이 Form 상태를 알 수 있게 해줍니다.

```ts
const isAdding =
    navigation.state === "submitting" &&
    navigation.formData?.get("_action") === "create";
```

위와 같이 isAdding 이라는 boolean 값을 만들어 놓으면 현재 UI가 새로운 Todo를 만들기 위해 버튼을 눌렀는지 알 수 있는겁니다.

그리고 해당 Pending UI는 버튼 컴포넌트에 적으면 됩니다.

```ts
<Button
  type="submit"
  name="_action"
  value="create"
  disabled={isAdding}
  className="bg-black text-white hover:bg-gray-800 transition-colors duration-200 rounded-xl px-4 py-2"
>
  <PlusCircle className="mr-2 h-4 w-4" />
  {isAdding ? "추가 중" : "TODO 추가하기"}
</Button>
```

위와 같이 Button 컴포넌트에 isAdding 값을 이용해서 Pending UI를 구형했습니다.

그리고 여기서 중요한게 Button 컴포넌트는 HTML의 input 태그인데요.

이 태그의 이름(name)을 '_action'이라고 하고 value 값을 'create'라고 했습니다.

이 방식을 Remix에서 사용하는 멀티 Form POST에 대응하는 가장 일반적인 방식인데요.

나중에 DELETE를 위해서도 Form을 POST할 때 POST 메서드가 'create'인지 'delete'인지 구분하기 위해서 입니다.

formRef, inputRef는 어디에 쓰는지 다들 아실겁니다.

Todo를 새로 만들고 Input 폼을 클리어하고 그리고 커서를 위치시키기 위한 코드입니다.

React의 가장 기본적인 UI라 설명은 생략하겠습니다.

---

## Remix의 action 함수 만들기

Remix는 POST 메서드가 실행되면 꼭 action 함수를 만들어야 하는데요.

참고로 Remix는 GET, POST 메서드만 사용하라고 권장합니다.

왜냐하면 action 함수가 POST 메서드만 처리하기 때문이죠.

만약 DELETE 메서드나 PUT 메서드를 발생시켜보시면 에러메시지가 나올겁니다.

나중에 Todo 앱 지우기 부분에서 실제로 DELETE 메서드를 발생시켜 봅시다.

여기서는 일단은 POST 메서드를 이용해서 Form을 제출했기 때문에 Remix는 특성상 action 함수에서 처리해야 하는데요.

이 action 함수를 작성해 봅시다.

action 함수는 loader 함수 밑에 두시면 됩니다.

```ts
export const loader = async ({ context }: LoaderFunctionArgs) => {
  const res = await clientGetTodos();
  return res;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);

  // if (_action === "delete") {
  //   await clientDeleteTodo(values);
  // }

  if (_action === "create") {
    await clientCreateTodo(values);
  }

  return null;
};
```

위와 같이 action 함수를 작성했습니다.

아까 '_action' 값을 지정한 이유가 위 코드에 있는데요.

'_action' 값이 'create'와 'delete'일 경우 실행할 함수를 구분시키기 위해서입니다.

일단은 'delete' 부분은 나중에 작성할 거기 때문에 위와 같이 주석처리해 놓읍시다.

이제 clientCreateTodo 함수를 작성해야 겠네요.

'apiClient.ts' 파일을 열어 아래 함수를 추가하겠습니다.

```ts
export const clientCreateTodo = async (values: any) => {
  await client.api.todos.$post({
    form: {
      title: values.title,
    },
  });
};
```

위와 같이 넣으면 VS Code가 $post 가 없다고 하는데요.

왜냐하면 Hono 서버쪽에 $post 메서드를 작성안했기 때문입니다.

이제 'server/api/todo/index.ts' 파일에 post 메서드를 아래와 같이 작성하겠습니다.

```ts
import { Hono } from "hono";
import { createTodo, getTodos, TodoSchema, updateTodo } from "./model";
import { zValidator } from "@hono/zod-validator";

// RPC를 위해서는 new Hono<>().get 형식으로 붙혀서 만들어야 한다.
const api_todos = new Hono<{ Bindings: Env }>()
  .get("/todos", async (c) => {
    const todos = await getTodos(c.env.DB);
    return c.json(todos);
  })
  .put("/todos/:id", zValidator("json", TodoSchema), async (c) => {
    const id = c.req.param("id");
    const validatedData = c.req.valid("json");
    // console.log(validatedData);

    await updateTodo(c.env.DB, parseInt(id), {
      title: validatedData.title,
      completed: validatedData.completed === 0 ? 1 : 0,
    });

    return c.json({ ok: true });
  })
  .post("/todos", zValidator("form", TodoSchema), async (c) => {
    const validatedData = c.req.valid("form");
    // console.log(validatedData);
    await createTodo(c.env.DB, validatedData);
    return c.json({ ok: true });
  });

export default api_todos;
```

post 메서드를 put 메서드 다음에 추가시켰습니다.

post 메서드의 주소는 '/todos' 주소가 되고 HTTP 리퀘스트(Request)가 POST 일 경우 대응하는 코드가 되는겁니다.

여기서 UI쪽에서 form 방식으로 데이터를 POST했기 때문에 zValidator 함수의 첫번째 칸에 'form'이라고 적어야 합니다.

createTodo 함수는 예전에 만들었으니 이제 POST 메서드를 위한 Hono RPC가 끝났습니다.

이제 테스트 해볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEgdE_49r6B5HRVY5zoLPiTtVRIfYBDpksFFRdhjiosQibpqKLUHyqNe8dJRq-0U42j862B2JFZ_tQjNVMnInVar7hwydp1_dqcntZb1NYNyFq2eHBP0leXyYj6A8iS0BWeNX3KEUqezX3_i5eBHpjdMZNFe-NQPUZKiIqOJXNAI9SnEMkfHo9Hsr_YMezQ)

![](https://blogger.googleusercontent.com/img/a/AVvXsEhXwO0yPFN5ffa1EoOimt2zqEi70cStH5iPzetMFkOX-TMgl1Va8LygdQmcbOsOrfjvQm1Si_GPnAJgMd2EjKZ-0uvF6eEwaudwsApPflS4Qc8OumGOvYKguKPsxLlk1Tle9i1y2brh4mqFh6GLuo3w1x_3RenjchLoW3my8ZYSw3AR3JifX1eTAzit7lU)

위와 같이 아주 잘 실행되고 있네요.

---

## Delete 구현하기

이제 마지막 단계인 Delete 구현입니다.

Pending UI를 위해서 React와 Remix의 훅을 추가해서 Delete 구현을 했으니 주의해서 살펴보시기 바랍니다.

역시나 먼저, model.ts 파일에 deleteTodo 함수를 먼저 만들겠습니다.

```ts
export const deleteTodo = async (DB: D1Database, id: number) => {
  try {
    const result = await DB.prepare("DELETE FROM Todos Where id = ?")
      .bind(id)
      .run();
    // console.log(`Todo with id ${id} successfully deleted.`);
    // console.log(result);
  } catch (error) {
    console.error("Failed to delete todo in D1 DB", error);
    throw new Error("Todo deletion failed");
  }
};
```

위 코드를 보시면 이제는 쉽게 이해할 수 있을 겁니다.

Client쪽을 위한 apiClient.ts 파일에도 추가해 봅시다.

```ts
export const clientDeleteTodo = async (values: any) => {
  await client.api.todos[":id"].$delete({
    param: {
      id: values.id as string,
    },
  });
};
```

위와 같이 입력하시면 역시나 $delete 쪽에 에러가 나오는데요.

Hono쪽에 $delete를 추가해야 합니다.

'/server/api/todo/index.ts' 파일에 아래와 같이 추가합시다.

```ts
import { Hono } from "hono";
import {
  createTodo,
  deleteTodo,
  getTodos,
  TodoSchema,
  updateTodo,
} from "./model";
import { zValidator } from "@hono/zod-validator";

// RPC를 위해서는 new Hono<>().get 형식으로 붙혀서 만들어야 한다.
const api_todos = new Hono<{ Bindings: Env }>()
  .get("/todos", async (c) => {
    const todos = await getTodos(c.env.DB);
    return c.json(todos);
  })
  .put("/todos/:id", zValidator("json", TodoSchema), async (c) => {
    const id = c.req.param("id");
    const validatedData = c.req.valid("json");
    // console.log(validatedData);

    await updateTodo(c.env.DB, parseInt(id), {
      title: validatedData.title,
      completed: validatedData.completed === 0 ? 1 : 0,
    });

    return c.json({ ok: true });
  })
  .post("/todos", zValidator("form", TodoSchema), async (c) => {
    const validatedData = c.req.valid("form");
    // console.log(validatedData);
    await createTodo(c.env.DB, validatedData);
    return c.json({ ok: true });
  })
  .delete("/todos/:id", async (c) => {
    const id = c.req.param("id"); // URL 경로에서 id 가져오기
    const todo = await getTodo(c.env.DB, parseInt(id));
    if (!todo) {
      return c.json({ message: "not found" }, 404);
    }
    await deleteTodo(c.env.DB, parseInt(id));
    // return c.redirect("/todos");
    return c.json({ ok: true });
  });

export default api_todos;
```

마지막에 delete 메서드를 추가했는데요.

여기서는 getTodo 함수를 필요로 하네요.

'model.ts' 파일에 Todo 한개를 가져오는 목적의 getTodo 함수를 아래와 같이 추가합시다.

```ts
export const getTodo = async (
  DB: D1Database,
  id: number
): Promise<Todo | null> => {
  try {
    // SQL 쿼리로 특정 id에 해당하는 Todo 항목을 조회
    const todo = await DB.prepare("SELECT * FROM Todos WHERE id = ?")
      .bind(id)
      .first<Todo>();
    // console.log(todo);

    // 결과가 존재하면 해당 Todo 반환, 없으면 null 반환
    return todo || null;
  } catch (error) {
    console.error(`Failed to fetch todo with id ${id} from D1 DB`, error);
    return null;
  }
};
```

이제 Hono의 Delete 메서드도 끝났으니까 클라이언트쪽을 손봐야합니다.

TodoItem 컴포넌트에 Delete를 위한 폼을 추가해야합니다.

```ts
// Todo Card
const TodoItem = ({ todo }: { todo: Todo }) => {
  const deleteFetcher = useFetcher();

  const [isCompleted, setIsCompleted] = useState(todo.completed);

  const isDeleting =
    deleteFetcher.state === "submitting" &&
    deleteFetcher.formData?.get("id") === todo.id.toString();

  const handleCheckboxChange = async (checked: boolean) => {
    await client.api.todos[":id"].$put({
      json: {
        title: todo.title,
        completed: isCompleted,
      },
      param: {
        id: todo.id.toString(),
      },
    });

    setIsCompleted(isCompleted === 0 ? 1 : 0);
  };

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow duration-200">
      <CardContent
        className={`${isDeleting ? "bg-gray-300" : ""} flex items-center p-4`}
      >
        <Checkbox
          id={`todo-${todo.id}`}
          checked={isCompleted === 0 ? false : true}
          onCheckedChange={handleCheckboxChange}
          className="mr-4"
        />
        <div className="flex-grow">
          <label
            htmlFor={`todo-${todo.id}`}
            className={`${
              isDeleting ? "opacity-50" : "opacity-100"
            } text-lg font-medium leading-none ${
              isCompleted ? "line-through text-gray-400" : "text-gray-700"
            }`}
          >
            {todo.title}
          </label>
        </div>
        <div>
          <deleteFetcher.Form method="post">
            <input type="hidden" name="id" value={todo.id} />
            <Button
              type="submit"
              name="_action"
              value="delete"
              disabled={isDeleting}
            >
              {isDeleting ? "지우는 중" : "지우기"}
            </Button>
          </deleteFetcher.Form>
        </div>
      </CardContent>
    </Card>
  );
};
```

UI를 보시면 여기서는 Form을 useFetcher 훅으로 사용했습니다.

Remix 고급 사용법인데요.

아까 create 쪽에서는 'Form'을 사용했습니다.

그 때 사용한 useNavigation 훅과 겹치기 때문에 useFetcher로 따로 'Form'을 만들기 위한 Remix의 고급 기법이죠.

그런데 잘 보시면 deleteFetcher.Form의 method가 "post"입니다.

왜냐하면 action 함수는 post 메서드만 지원하기 때문입니다.

실제로 action 함수로 가시면 아래와 같이 아까 create 할 때 주석처리한 부분을 주석을 지워주십시요.

```ts
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);

  if (_action === "delete") {
    await clientDeleteTodo(values);
  }

  if (_action === "create") {
    await clientCreateTodo(values);
  }

  return null;
};
```

위와 같이 action 함수에서 clientDeleteTodo 함수를 호출하라고 합니다.

그러면 clientDeleteTodo 함수를 볼까요?

```ts
export const clientDeleteTodo = async (values: any) => {
  await client.api.todos[":id"].$delete({
    param: {
      id: values.id as string,
    },
  });
};
```

빙고, 여기서 Hono의 $delete 즉, DELETE 메서드로 호출되고 있습니다.

그러고 보니 아까 completed 항목을 업데이트할 때도 apiClient 함수쪽에서 $put으로 호출했었네요.

Remix를 이용할 때는 PUT 메서드와 DELETE 메서드는 이런 식으로 사용해야 합니다.

마지막으로 useFetcher의 Form을 이용할 때의 Pending UI는 아래와 같이 하시면 쉽습니다.

```ts
const isDeleting =
    deleteFetcher.state === "submitting" &&
    deleteFetcher.formData?.get("id") === todo.id.toString();
```

위 코드는 폼이 submitting 될때 그리고 두번째는 해당 delete 되는 아이템만 적용시키기 위해 해당 delete 되는 아이템의 todo.id 값까지 체크하게 했습니다.

만약 delete 되는 해당 id값을 체크하지 않으면 모든 아이템에 Pending UI가 적용될 겁니다.

주의하시면 됩니다.

이제 테스트를 진행해 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEhsZCPt3clq6WndAdGc_x8ogVwcU_X8OaugwnJl9UJpmDjq6l99QAyVvJlMy327-sx_A5-jSp14WvofY_0B8I5mFcptXNgswg8zCIRX7O4wKtvbFQWacIJagnhi73DwvzwPhooRm3msOTzJa0skLmRgsiX78ETnBo7Qj2FRundf_dw1YjiVgvxzwQa4en4)

위 그림과 같이 Pending UI도 잘 적용되고 Delete도 잘 되고 있습니다.

---

## Cloudflare에 배포하기

이제 모든게 끝났으니까 빌드후 배포해야겠네요.

```sh
$ npm run deploy

> deploy
> npm run build && wrangler pages deploy


> build
> remix vite:build

vite v5.4.8 building for production...
✓ 1654 modules transformed.
build/client/.vite/manifest.json                1.41 kB │ gzip:  0.34 kB
build/client/assets/root-Cuu5eBUk.css          14.21 kB │ gzip:  3.61 kB
build/client/assets/_index-MW916cbg.js          1.15 kB │ gzip:  0.55 kB
build/client/assets/root-7GOmtebN.js            1.73 kB │ gzip:  0.98 kB
build/client/assets/entry.client-C1Vo4Cp-.js    3.74 kB │ gzip:  1.43 kB
build/client/assets/jsx-runtime-56DGgGmo.js     8.11 kB │ gzip:  3.05 kB
build/client/assets/todos-LRAenMuD.js          42.29 kB │ gzip: 14.90 kB
build/client/assets/components-CD3wXADJ.js    246.75 kB │ gzip: 79.72 kB
✓ built in 1.77s
vite v5.4.8 building SSR bundle for production...
✓ 13 modules transformed.
build/server/.vite/manifest.json                0.22 kB
build/server/assets/server-build-Cuu5eBUk.css  14.21 kB
build/server/index.js                          16.87 kB
✓ built in 57ms
▲ [WARNING] Warning: Your working directory is a git repo and has uncommitted changes

  To silence this warning, pass in --commit-dirty=true


✨ Compiled Worker successfully
🌍  Uploading... (11/11)

✨ Success! Uploaded 8 files (3 already uploaded) (2.18 sec)

✨ Uploading _headers
✨ Uploading Functions bundle
✨ Uploading _routes.json
🌎 Deploying...
✨ Deployment complete! Take a peek over at https://a651d0cf.hono-remix-test-5jr.pages.dev
```

위와 같이 deploy 명령어를 실행시키면 알아서 빌드후 Cloudflare에 배포합니다.

여기서 '.env' 파일에 API Endpoint를 위한 주소를 넣어야 하는데요.

위 터미널 상에서 나오는 주소는 맨 앞에 더미문자열 포함한 주소인데요.

```sh
https://a651d0cf.hono-remix-test-5jr.pages.dev
```

더미문자열만 지우고 나면 실제 주소가 됩니다.

```sh
https://hono-remix-test-5jr.pages.dev
```

이제 이 주소를 '.env'에 넣으시고 다시 deploy하시면 됩니다.

```sh
VITE_API_URL=https://hono-remix-test-5jr.pages.dev/
```

```sh
$ npm run deploy
```

이제 Cloudflare 대시보드로 가 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEhtOuicy05Vsf91AMJFMNO6LBkjWudomSO9n_MZmvnpUENIa4rg1GgHR56q6Pcd3TS5yRoKSzQebwEH2j-BaHWdfgBExx3tVSKViTKrX6uHXlrxi3MZy1LtCL3chnkCIm7p9D5UxUeJCDnAGt4WRnI5siLaETt57WoHmANurSUotQiCgpWtQ5BAzGQLnhU)

잘 배포되었네요.

이제 해당 주소로 가보면 아래와 같이 나올겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhzffYxpio5MnCy1Y2_9rfj1bA3LAbmAFKUthwyE1BEnz2RmpfUE9ZvXY4r-7S1XKZhYV3rIzisROerKuTefEWhg4G_86g4ga1IS7ibrnS9xrppuV-tv97stcmzlDPdtEnQCiL1Z1I2tmV9M7-OByJw-u0_4sP1guLLaKYTvsswSAxmCxkh8Y0lFYxTypE)

우리가 처음에 Todos 테이블 만들 때 더미값으로 넣은 항목만 나오고 있네요.

정상적으로 작동하는지 여러번 테스트해 보세요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgUfNljBuibXCqamN4MAiRZ_x7jmn4t_dTPN2h1XsXSpwCnNIUITmTFlrVaM1exeiaAid4WWtcDLZTK-1Kw-klGgKQSCPBvxC7RHaoJQa0uy_f6WsQqswaKAyWj1yriktvTF0_fWhDfnU1ft68ukcyoSg_Wq00uDgk7abYIyfwpkAELMuOPvCBEOdGmJ-s)

![](https://blogger.googleusercontent.com/img/a/AVvXsEjq1kpZ8XaJXuhk2f55DMV4aChuVCnlGIUQR5hVAK9z552yI1MK3apC9uLE7TJoUB9qA9LMzfnaCDxRIbPL9kUdEeXV0EEXyt9pEcWXQGDY1yNsz1GpYVGsBMf1J_25CbMyXe0oDeIMpixxOJIX2b1ZYp3XtoXEL7p5H15nIHAksKDgVqZm8uzb2bvnTgU)

위 두개의 그림으로 보시다시피 create, delete 모두 Pending UI까지 완벽하게 작동하고 있습니다.

이제 다 끝났네요.

어떤까요?

Remix와 Hono의 조합!

저는 개인적으로 Cloudflare Pages를 좋아하는데요.

무료에 D1 DB, KV까지 사용할 수 있고 Worker까지 만들 수 있어 아주 좋습니다.

이제 Remix와 Hono를 이용해서 FullStack 앱만 만들면 되겠네요.

그럼.

