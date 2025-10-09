---
slug: 2023-12-09-fullstack-astrojs-cloudflare-pages-d-1-drizzle-orm
title: 풀스택 강의 3편. AstroJS와 Cloudflare Pages, D1, Drizzle ORM으로 개발하기
date: 2023-12-09 12:39:43.046000+00:00
summary: 풀스택 개발하기 AstroJS + Cloudflare pages + D1 + Drizzle ORM
tags: ["astrojs", "pages", "d1", "drizzle", "cloudflare"]
contributors: []
draft: false
---

안녕하세요?

이번 시간에도 풀스택 강의인데요.

Cloudflare 서비스를 이용한 강의인데 AstroJS를 이용한 방식입니다.

지난 시간에는 React와 함께 Cloudflare Pages, Workers, D1을 이용했었는데요.

오늘은 D1 DB를 좀 더 편하게 다루기 위한 Dirzzle ORM을 이용했습니다.

전체 강의 리스트입니다.

전체 강의 리스트입니다.

1. [풀스택 강의 1편. Cloudflare Pages + Workers + D1 + React로 풀스택 개발하기](https://mycodings.fly.dev/blog/2023-12-06-introduction-cloudflare-pages-workers-d-1-react-full-stack)

2. [풀스택 강의 2편. Cloudflare Pages 안에서 Workers를 이용한 D1 DB 제어하는 API 만들기](https://mycodings.fly.dev/blog/2023-12-09-fullstack-cloudflare-pages-workers-d-1-react-part-2)

3. [풀스택 강의 3편. AstroJS와 Cloudflare Pages, D1, Drizzle ORM으로 개발하기](https://mycodings.fly.dev/blog/2023-12-09-fullstack-astrojs-cloudflare-pages-d-1-drizzle-orm)

4. [풀스택 강의 4편. Remix + Cloudflare Pages + D1 DB + Drizzle ORM](https://mycodings.fly.dev/blog/2023-12-10-fullstack-remix-cloudflare-pages-d-1-db-drizzle-orm)

5. [풀스택 강의 5편. Next.js 서버 렌더링을 이용하여 Cloudflare Pages로 배포하기(D1 DB, Drizzle ORM)](https://mycodings.fly.dev/blog/2023-12-30-fullstack-tutorial-nextjs-cloudflare-with-d-1-db)

6. [풀스택 강의 6편. Remix로 Github 저장소를 DB로 이용해서 KV와 함께 Cloudflare에 배포하기](https://mycodings.fly.dev/blog/2024-02-25-fullstack-tutorial-remix-cloudflare-with-kv-and-github-server)

7. [풀스택 강의 7편. Vite React 템플릿을 Hono를 이용하여 풀스택 앱으로 개조하기](https://mycodings.fly.dev/blog/2024-03-03-fullstack-tutorial-transform-vite-react-app-with-hono-framework)

---

** 목 차 **

1. [AstroJS 템플릿 설치하기](#1-astrojs-템플릿-설치하기)

2. [D1 DB 설정하기](#2-d1-db-설정하기)

3. [Drizzle ORM 설정하기](#3-drizzle-orm-설정하기)

4. [Wrangler 로컬 환경에 Sqlite DB 만들기](#4-wrangler-로컬-환경에-sqlite-db-만들기)

5. [로컬 DB에 더미 데이터 넣기](#5-로컬-db에-더미-데이터-넣기)

6. [AstroJS와 Drizzle을 연결하기 위한 Env 구축](#6-astrojs와-drizzle을-연결하기-위한-env-구축)

7. [End Point로 POST 메서드 대응하기](#7-end-point로-post-메서드-대응하기)

8. [EDGE 서버에 올리기](#8-edge-서버에-올리기)

---

## 1. AstroJS 템플릿 설치하기

일단 astro 템플릿을 설치하고 그다음에 cloudflare D1, Drizzle ORM을 설치하겠습니다.

```bash
npm create astro@latest --  --template=minimal --yes --skip-houston astro-pages-d1-example

cd astro-pages-d1-example

npx astro add cloudflare tailwind

Astro will make the following changes to your config file:

 ╭ astro.config.mjs ──────────────────────────────╮
 │ import { defineConfig } from 'astro/config';   │
 │                                                │
 │ import cloudflare from "@astrojs/cloudflare";  │
 │ import tailwind from "@astrojs/tailwind";      │
 │                                                │
 │ // https://astro.build/config                  │
 │ export default defineConfig({                  │
 │   output: "server",                            │
 │   adapter: cloudflare(),                       │
 │   integrations: [tailwind()]                   │
 │ });                                            │
 ╰────────────────────────────────────────────────╯
```

astro.config.mjs 파일에 defineConfig 부분을 알아서 설정해 줍니다.

cloudflare에 배포하는 방식은 SSR(Server Side Rendering) 방식이고요.

tailwind도 알아서 설정해 줍니다.

이제 wrangler와 Drizzle ORM 관련 패키지만 설치하면 됩니다.

```bash
npm i wrangler drizzle-orm better-sqlite3 @astrojs/check typescript

npm i -D @types/better-sqlite3 drizzle-kit
```

지금까지 설치된 package.json 파일 내역입니다.

```json
{
  "name": "astro-pages-d1-example",
  "type": "module",
  "version": "0.0.1",
  "scripts": {
    "dev": "astro dev",
    "start": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "astro": "astro"
  },
  "dependencies": {
    "@astrojs/check": "^0.3.1",
    "@astrojs/cloudflare": "^8.0.0",
    "@astrojs/tailwind": "^5.0.3",
    "astro": "^4.0.3",
    "better-sqlite3": "^9.2.2",
    "drizzle-orm": "^0.29.1",
    "tailwindcss": "^3.3.6",
    "typescript": "^5.3.3",
    "wrangler": "^3.19.0"
  },
  "devDependencies": {
    "@types/better-sqlite3": "^7.6.8",
    "drizzle-kit": "^0.20.6"
  }
}
```

---

## 2. D1 DB 설정하기

이제 우리가 사용할 D1 DB를 만들어 봅시다.

```bash
npx wrangler login

npx wrangler d1 create astro-db

✅ Successfully created DB 'astro-db' in region APAC
Created your database using D1's new storage backend. The new storage backend is not yet recommended
for production workloads, but backs up your data via point-in-time restore.

[[d1_databases]]
binding = "DB" # i.e. available in your Worker on env.DB
database_name = "astro-db"
database_id = "7sadfsadf1be7e-42f8-4c27-98330-b675asdfsdaf37f54260"
```

Cloudflare의 대시보드로 들어가서 D1 섹션으로 가면 아래와 같이 'astro-db'라는 이름의 D1 DB가 생성되어 있는 걸 볼 수 있을 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjzNRXvDAIg7whzudvI13OclDOeunVZZ7xjl0AuqLBbzFs_pspU3SwNvWqpH0k_PzMV5cG4r1pHBs85jm5duIdVVOus8Pp7s6Yb3i0S1HmT4F5L6ylRAkB_MLM27YzUV4T-RO5dumt0Q1XJcfYaRfnz9eIFza5wTzu4EhuY6LQAQaZSpk4ngTsfFfo5Naw)

이제 wrangler.toml 파일을 만들어야 합니다.

```toml
name = "astro-pages-d1-example"
main = "./dist/_worker.js"
compatibility_date = "2023-12-09"

[[d1_databases]]
binding = "DB" # i.e. available in your Worker on env.DB
database_name = "astro-db"
database_id = "7sadfsadf1be7e-42f8-4c27-98330-b675asdfsdaf37f54260"
```

위와 같이 만들었는데요.

main 부분은 Cloudflare Worker 방식일 경우 처음 시작되는 엔트리 파일입니다.

AstroJS가 Cloudflare Pages에 SSR 방식으로 배포되는 방법은 바로 Workers를 이용한 방법인데요.

AstroJS가 빌드되면 전체 프로젝트가 \_worker.js 파일로 컴파일됩니다.

단순히 Cloudflare는 해당 파일을 웹 서빙하는 방식이죠.

그리고 compatibility_date는 현재 날짜로 넣으시고 만약 화면에 다른 날짜가 나오면 그 날짜로 넣으면 됩니다.

---

## 3. Drizzle ORM 설정하기

이제 DB를 좀 더 편안하게 설정하기 위해 Drizzle ORM을 설정하겠습니다.

src 폴더 밑에 db 폴더를 만들고 아래와 같이 작성해 줍니다.

```js
import { integer, text, sqliteTable } from 'drizzle-orm/sqlite-core'

export const todos = sqliteTable('todos', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text('name'),
  isCompleted: integer('isCompleted', { mode: 'boolean' })
    .notNull()
    .default(false),
})
```

지난 시간에 배운 [Drizzle ORM 강의편](https://mycodings.fly.dev/blog/2023-12-09-quick-understanding-of-drizzle-orm)에 나왔던 todos 스키마 파일입니다.

이제 스키마 파일을 만들었으면 마이그레이션 파일을 만들어야겠죠.

```bash
npx drizzle-kit generate:sqlite --schema=./src/db/schema.ts

drizzle-kit: v0.20.6
drizzle-orm: v0.29.1

1 tables
todos 3 columns 0 indexes 0 fks

[✓] Your SQL migration file ➜ drizzle/0000_stormy_scarlet_witch.sql 🚀
```

마이그레이션 파일이 drizzle 폴더 밑에 있는 '0000_stormy_scarlet_witch.sql' 파일이네요.

이 파일의 내용은 아래와 같습니다.

```sql
CREATE TABLE `todos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`isCompleted` integer DEFAULT false NOT NULL
);
```

역시나 의도했던 데로 되고 있습니다.

---

## 4. Wrangler 로컬 환경에 Sqlite DB 만들기

우리가 Drizzle 마이그레이션 파일까지 만들었는데요.

이걸 Wrangler 로컬 환경에 적용해야 합니다.

'--local' 옵션을 이용한다는 얘기죠.

아직 Cloudflare 엣지 서버에는 올리지 않고 테스트를 위해 로컬 환경에서 DB 구축을 한다는 얘기입니다.

아까 Drizzle이 만든 sql 파일이름이 바로 '0000_stormy_scarlet_witch.sql'입니다.

그래서 아래 명령어에 해당 파일이름을 잘 적어주면 됩니다.

```bash
npx wrangler d1 execute astro-db --local --file=./drizzle/0000_stormy_scarlet_witch.sql
🌀 Mapping SQL input into an array of statements
🌀 Executing on local database astro-db (1143731be7e-412348-4237-98230-b623235260) from .wrangler/state/v3/d1:
```

실제 파일이 있는 곳으로 가서 확인해 볼까요?

```bash
cd .wrangler/state/v3/d1/miniflare-D1DatabaseObject

sqlite3 55d4cd3f70b771065dcf633d2888b1ec2dad2eebd6026a91cf0dda1325006021.sqlite

SQLite version 3.37.0 2021-12-09 01:34:53
Enter ".help" for usage hints.
sqlite> .schema
CREATE TABLE _cf_KV (
      key TEXT PRIMARY KEY,
      value BLOB
    ) WITHOUT ROWID;
CREATE TABLE `todos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`isCompleted` integer DEFAULT false NOT NULL
);
CREATE TABLE sqlite_sequence(name,seq);
sqlite> select * from todos;
sqlite>
```

역시나 todos 테이블이 잘 설정되었네요.

---

## 5. 로컬 DB에 더미 데이터 넣기

테스트를 위해 todos 테이블에 더미 데이터를 넣어 보도록 하겠습니다.

```bash
npx wrangler d1 execute astro-db --local --command="insert into todos (name, isCompleted) values ('test 1', 0);"

🌀 Mapping SQL input into an array of statements
🌀 Executing on local database astro-db (1143731be7e-412348-4237-98230-b623235260) from .wrangler/state/v3/d1:
```

잘 되고 있네요.

몇개 더 넣어보세요.

많이 넣었으면 select 문으로 확인해 볼까요?

```bash
npx wrangler d1 execute astro-db --local --command="select * from todos;"

🌀 Mapping SQL input into an array of statements
🌀 Executing on local database astro-db (1143731be7e-412348-4237-98230-b623235260) from .wrangler/state/v3/d1:
┌────┬────────┬─────────────┐
│ id │ name   │ isCompleted │
├────┼────────┼─────────────┤
│ 1  │ test 1 │ 0           │
├────┼────────┼─────────────┤
│ 2  │ test 2 │ 1           │
├────┼────────┼─────────────┤
│ 3  │ test 3 │ 0           │
├────┼────────┼─────────────┤
│ 4  │ test 4 │ 1           │
├────┼────────┼─────────────┤
│ 5  │ test 5 │ 0           │
└────┴────────┴─────────────┘
```

총 5개의 더미 데이터가 잘 들어가 있네요.

---

## 6. AstroJS와 Drizzle을 연결하기 위한 Env 구축

여기가 가장 어려운 부분인데요.

구글링을 몇 번에 걸쳐 찾아보아도 자료가 별로 없습니다.

순전히 트라이 앤 에러로 찾아낸 결과물인데요.

지난 2편의 풀스택 강의에서는 Cloudflare Pages에서 functions 폴더 밑에 있는 js 파일은 workers가 된다고 했었는데요.

거기서는 context.env.DB라고 해서 'DB'라는 이름으로 바인딩된 D1 서버에 연결할 수 있었습니다.

AstroJS에서도 가능한데요.

예전 AstroJS 버전에서는 "@astrojs/cloudflare/runtime" 패키지에서 getRuntime 함수를 이용해서 env.DB 부분에 접근할 수 있었는데요.

AstroJS가 버전업 되면서 이 방식은 없어지고 단순히 Astro.locals.runtime 객체로 접근할 수 있게 되었습니다.

그런데, Astro.locals.runtime 객체로 접근하기 위해서 세팅해야 할 부분이 많은데요.

먼저, env.d.ts 파일에 Env 타입을 지정해 줘야 합니다.

```js
/// <reference types="astro/client" />

// type KVNamespace = import("@cloudflare/workers-types").KVNamespace;
type D1Database = import("@cloudflare/workers-types").D1Database;
type ENV = {
  // replace `MY_KV` with your KV namespace
  DB: D1Database;
};

// Depending on your adapter mode
// use `AdvancedRuntime<ENV>` for advance runtime mode
// use `DirectoryRuntime<ENV>` for directory runtime mode
type Runtime = import("@astrojs/cloudflare").DirectoryRuntime<ENV>;
declare namespace App {
  interface Locals extends Runtime {}
}
```

KVNamespace를 지정하는 방식이 공식 문서에 있었는데요.

저는 거기서 D1Database를 가져왔습니다.

우리가 wrangler.toml 파일에서 바인딩을 'DB'라는 이름으로 했기 때문에 위에서 DB라고 썼습니다.

그리고 Runtime 부분인데요.

AstroJS를 server 방식으로 운영하면 기본 모드가 바로 advanced 모드가 됩니다.

이 모드는 astro.config.mjs 파일에서 지정하는데요.

"advanced" 모드와 "directory" 모드에 대해 간단히 설명하면,

"advanced" 모드는 Workers 방식입니다.

그래서 AstroJS가 빌드되면 dist 폴더에 \_worker.js 파일이 생기는데요.

이 파일이 바로 서버 파일인거죠.

"directory" 모드는 Pages 방식입니다.

정확히 얘기하면 Pages의 Functions 방식입니다.

그래서 이 방식으로 AstroJS를 빌드하면 프로젝트 최상단에 functions 폴더가 생기고 그 밑에 '[[path]].js' 파일이 생깁니다.

그래서 'wrangler pages deploy'하게 되면 wrangler가 자연스럽게 Pages Functions으로 인식해서 엣지 서버에 올려줍니다.

pages에 배포하기 때문에 "directory" 모드로 하겠습니다.

'env.d.ts' 파일 설정이 끝났으면 이제 'astro.config.mjs' 파일을 고쳐보겠습니다.

```js
import { defineConfig } from 'astro/config'

import cloudflare from '@astrojs/cloudflare'
import tailwind from '@astrojs/tailwind'

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    mode: 'directory',
    runtime: {
      mode: 'local',
      type: 'pages',
      bindings: {
        "DB": {
          type: 'd1',
        },
      },
    },
  }),
  integrations: [tailwind()],
})
```

위와 같이 설정하면 됩니다.

adapter 부분에 cloudflare안에 객체를 넣어서 설정하는 건데요.

mode 부분은 디폴트 값으로 'advanced'이기 때문에 생략해도 됩니다.

그리고 중요한게 runtime 부분인데요.

Astro.locals.runtime 객체가 제대로 인식되기 위해서 넣은 겁니다.

mode가 'advanced'값이면 아까 Worker 타입이라고 했죠.

그래서 type을 'workers'로 해야 하고, 만약 mode가 'directory' 모드 이면 type는 'pages'로 하면 됩니다.

그다음 중요한 D1 DB 바인딩이 있는데요.

binding 부분에 'DB'라는 문자열이 있는데요.

이건 우리가 wrangler.toml 파일에 설정했던 그 바인딩 이름 "DB"입니다.

그리고 타입은 소문자로 'd1'이라고 D1 DB라는 걸 명시했죠.

이제, Astro.locals.runtime 객체에 접근할 수 있는 준비가 다 끝났는데요.

src 폴더의 pages 폴더 밑에 있는 index.astro 페이지를 아래와 같이 고쳐서 테스트해 보겠습니다.

```js
---
import { drizzle } from 'drizzle-orm/d1';
import { todos } from '../db/schema';

const runtime = Astro.locals.runtime;

const db = drizzle(runtime.env.DB);

const result = await db.select().from(todos).all();
---

<html lang="en">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
		<meta name="viewport" content="width=device-width" />
		<meta name="generator" content={Astro.generator} />
		<title>Astro</title>
	</head>
	<body>
		<h1>Astro</h1>
		<ul>
			{result ? result.map((r) => <li>{r.name}</li>):<></>}
		</ul>

	</body>
</html>
```

이제 테스트를 위한 준비가 다 끝났는데요.

여기서 단순하게 'npm run dev' 명령어로 개발 서버를 돌리면 안 됩니다.

'.wrangler' 폴더 밑에 개발 DB가 숨어 있기 때문에 wrangler dev 방식으로 개발 서버를 돌려야 합니다.

만약 mode가 'advanced'의 Workers 방식이면 아래와 같이 개발 서버를 돌리면 됩니다.

```bash
npx wrangler dev

 ⛅️ wrangler 3.19.0
-------------------
Your worker has access to the following bindings:
- D1 Databases:
  - DB: astro-db (---------------------)
⎔ Starting local server...
[wrangler:inf] Ready on http://localhost:8787
╭────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ [b] open a browser, [d] open Devtools, [l] turn off local mode, [c] clear console, [x] to exit                 │
╰────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯
```

위와 같이 나오면 'b'를 눌러 브라우저를 불러오면 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjmmOd7VP28xFkEhnwS32_JxLhfkpRuYvLqxB3A-XTnhhxRQcbnI0qQqG1dbmboz1OxT1k5NLdtT_xr-f5CKqulGsgNLF81jJsTReLPKHqRWqd9lM2ukjff3RfzEMeGatEBtsSiO_rDesEFcvzwe75KXoAQ2A8hX1C_ePGpH_9_SvDaSh2eBlJToED3e7o)

위와 같이 우리가 작성한 코드가 제대로 나오네요.

그리고 다음과 같이 wrangler pages dev 방식을 써도 됩니다.

사실 Cloudflare가 앞으로 Pages 안에 Functions을 Workers 사용 방식으로 권장하거든요.

그래서 wrangler dev 방식이나 wrangler pages dev 방식이나 같이 동작합니다.

앞으로는 wrangler pages dev 방식을 이용하겠습니다.

꼭 빌드하고 실행 하십시요.

```bash
npm run build

npx wrangler pages dev ./dist
```

---

## 7. End Point로 POST 메서드 대응하기

D1 DB에서 데이터를 불러오는 거는 단순히 db.select() 메서드로 작성했습니다.

그런데, 우리가 여기서 form을 이용해서 todos를 추가하려고 한다면 어떻게 해야 할까요?

바로 API End Point가 필요합니다.

AstroJS에서는 확장자가 .ts 또는 .js로 끝나면 API End Point가 됩니다.

당연히 src/pages 폴더 밑에 있어야겠죠.

일단, index.astro 페이지에 form 태그를 추가해서 UI 부분을 완성하고 나서 API를 만들겠습니다.

UI 를 만드는 김에 delete 버튼까지 추가하겠습니다.

```js
---
import { drizzle } from "drizzle-orm/d1";
import { todos } from "../db/schema";

const runtime = Astro.locals.runtime;

const db = drizzle(runtime.env.DB);
const result = await db.select().from(todos).all();
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width" />
    <meta name="generator" content={Astro.generator} />
    <title>Astro</title>
  </head>
  <body>
    <h1>Astro!!!</h1>
    <form method="post" action="/api/post-todos">
      <input type="text" name="name" />
      <input type="checkbox" name="isCompleted" />
      <button type="submit"> Add Todo</button>
    </form>
    <ul>
      {result ? result.map((r) => <li>{r.name}
        <form method="post" action="/api/delete-todos">
          <input type="hidden" name="todoId" value={r.id} />
          <button type="submit">Delete</button>  
        </form>
        </li>):<></>}

    </ul>
  </body>
</html>
<style>
  body {
    @apply p-8 space-y-5
  }
  form {
    @apply flex justify-start space-x-5
  }

  li {
    @apply flex justify-start gap-5
  }
   button {
    @apply border bg-blue-500 rounded-lg px-2 py-1
   }
</style>
```

form 태그가 두 개가 있는데요.

하나는 'api/post-todos' 엔드 포인트를 이용하는 거고,

delete 버튼은 'api/delete-todos'를 이용하는 겁니다.

이제 API 엔드 포인트를 만들어 보겠습니다.

```js
// src/pages/api/post-todos.ts

import type { APIContext } from "astro";
import { drizzle } from "drizzle-orm/d1";
import { todos } from "../../db/schema";

export async function POST(context: APIContext) {
  const formData = await context.request.formData();
  const name = formData.get("name") as string;
  const isCompletedData = formData.get("isCompleted");

  const isCompleted = isCompletedData ? true : false;

  const runtime = context.locals.runtime;

  const db = drizzle(runtime.env.DB);
  const result = await db.insert(todos).values({ name, isCompleted }).run();
  console.log("insert result", result);

  return context.redirect("/", 302);
}
```

formData에서 데이터를 가져와서 Drizzle ORM을 이용해서 데이터베이스에 insert 하는 겁니다.

이제 delete-todos.ts 파일입니다.

```js
//src/pages/delete-todos.ts

import type { APIContext } from "astro";
import { drizzle } from "drizzle-orm/d1";
import { todos } from "../../db/schema";
import { eq } from "drizzle-orm";

export async function POST(context: APIContext) {
  const formData = await context.request.formData();
  const todoIdData = formData.get("todoId") as string;

  const todoId = todoIdData ? parseInt(todoIdData) : -1;
  const runtime = context.locals.runtime;

  const db = drizzle(runtime.env.DB);
  const result = await db.delete(todos).where(eq(todos.id, todoId)).returning();

  console.log("deleting:", result);

  return context.redirect("/", 302);
}
```

역시 별로 어려울 거 없는 Drizzle ORM을 이용한 코드입니다.

Delete 메서드도 POST 메서드를 사용한 걸 눈여겨보십시오.

보통 브라우저는 GET, POST 두 개의 메서드로 변환해서 사용하니까 여기서는 POST 메서드를 이용했습니다.

이제, 모든 API 엔드 포인트가 끝났습니다.

빌드 후에 npx wrangler pages dev로 테스트해 보겠습니다.

```bash
npm run build

npx wrangler pages dev ./dist
```

wrangler 개발 서버를 실행하면 아래와 같이 보입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhyZkfoheokYd1bw3ZbXhYlmhSORTWawddRYPKuxTEX3PQt9hdsoOYkHISDAn4cLMbTkQZ0LJB1KG1bmcdxQhJlUqkxuvSHuMYH0WtcoiJfuOMtBWmLHPi5W6bLleyzQCBoF4FYLISeZoxQwyIVa-ioqkMl75Z7DJb8mli6YhYVUBx7cvQ9RGS4IzmFAS4)

Delete 버튼하고 Add 버튼을 눌러보면 정상 작동하는 걸 볼 수 있을 겁니다.

---

## 8. EDGE 서버에 올리기

이제 로컬에서의 개발은 끝났습니다.

이걸 Cloudflare EDGE 서버에 올려야 하는데요.

더미 데이터는 필요 없고, todos 테이블만 올리면 됩니다.

```bash
npx wrangler d1 execute astro-db --file=./drizzle/0000_stormy_scarlet_witch.sql

🌀 Mapping SQL input into an array of statements
🌀 Parsing 1 statements
🌀 Executing on remote database astro-db (77asdfasdfsadfsadfasd=asdfsadf4260):
🌀 To execute on your local development database, pass the --local flag to 'wrangler d1 execute'
🚣 Executed 1 commands in 0.365ms
```

위와 같이 '--local' 옵션을 빼고 실행해서 아래와 같이 Cloudflare Edge 서버에 todos 라는 테이블이 보이게 될겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEggvqvo6tDXCZyXJolGPHOf0X6E16564l8TinG4LjzO1QjYeKQ2qynRMzAL65KZpWFwQoD9Tc1Qsv-eY0t03Wd68_SQudBflVt7CdW7mD-ZiATkiiXEgoZS2WWowIsQ_BL6x-iku0HcQ5WnSumwctx1-Y8i-tw0b_GzFZg70NyGeBCjdVWH_9Cp26jRnM8)

이제 실제 배포를 해야 되는데요.

다시 한번 아래 명령어를 실행하면 됩니다.

```bash
npm run build

npx wrangler pages deploy dist

No project selected. Would you like to create one or use an existing project?
❯ Create a new project
  Use an existing project

? Enter the name of your new project: › astro-pages-d1-example
```
처음 배포하는 거면 위와 같이 "Create a new project"를 고르면 됩니다.

프로젝트 이름은 적당한 걸 넣으면 됩니다.

그런데, 만약 다음과 같은 에러가 나온다면 아마도 git commit을 안 해서 그런 겁니다.

```bash
fatal: ambiguous argument 'HEAD': unknown revision or path not in the working tree.
Use '--' to separate paths from revisions, like this:
'git <command> [<revision>...] -- [<file>...]'

✘ [ERROR] Command failed: git rev-parse --abbrev-ref HEAD

  fatal: ambiguous argument 'HEAD': unknown revision or path not in the working tree.
  Use '--' to separate paths from revisions, like this:
  'git <command> [<revision>...] -- [<file>...]'
  


If you think this is a bug then please create an issue at https://github.com/cloudflare/workers-sdk/issues/new/choose
```

아래와 같이 git commit 해주고 다시 배포합니다.

```bash
git add .
git commit -m "initial commit"
npx wrangler pages deploy dist

No project selected. Would you like to create one or use an existing project?
❯ Create a new project
  Use an existing project
✔ Enter the name of your new project: … astro-pages-d1-example
? Enter the production branch name: › main
```

최종적으로 branch name을 물어봅니다.

그러면 엔터키를 누르면 됩니다.

이제 결과를 보면

```bash
✨ Successfully created the 'astro-pages-d1-example' project.
✨ Compiled Worker successfully
🌍  Uploading... (2/2)

✨ Success! Uploaded 2 files (2.42 sec)

✨ Uploading Functions bundle
✨ Uploading _routes.json
✨ Deployment complete! Take a peek over at https://aae38d5a.astro-pages-d1-example.pages.dev
```

위와 같이 성공했다고 나오는데요.

위에서 보여주는 성공한 주소 경로로 이동해 볼까요?

그러면 실제 Cloudflare Edge 서버에 배포가 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhxT6fDec0TXk8Tlne-tRYrHngjwpHxI588X83pS_NDRDaQYDb5ZV3VsNVKhTHgOs5qHlrFyy1M5cHJgBtjUkY0y3Pe2uYQp9UFvDv_23QE9iwrS6JcjufWleDo8QHJgsupeJpHpk2NCzhYixUOoRLrz0XxBueXlVWEcZi5mIuefJgiwFQq-QIrrcz2bn4)

위와 같이 에러가 나옵니다.

이게 왜 그렇나면 바로 Cloudflare Edge 서버에서 D1 바인딩이 처리되지 않아서 그런 겁니다.

Cloudflare 대시보드에서 "Workers & Pages" 메뉴로 가면 아래와 같이 아까 만든 astro-pages-d1-example 프로젝트가 보일 겁니다.

우리가 아까 터미널 상에서 deploy를 처음 했기 때문에 이제야 생긴 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEj59FEPIPWjMtUg1rW9_65LC9iJjycG5f0-e2edZ_YACJBMWd6OnMu4jC32PkFDW5UsI_TAZ1uU6VGB8HEt0DwLxmVKH3lA9HnqmT5EERMY8TCoWIQOE-05foA7XP3cllVgRKcojjP8EOSYlER5obMg41mF13jegV56_2nmjgXgpCMqdriuTBxBIu6gBFc)

여기서 'astro-pages-d1-example' 프로젝트를 누르면 다시 상세 페이지로 들어가는데, Settings 항목으로 들어간 다음 세 번째 'Functions' 항목을 누르면 밑에 여러 개가 나오는데 아래 그림과 같이 'D1 database bindings' 항목을 클릭하면 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjrSU3E1G8BssLp9GHX4RA6qEGy-VYacE0i7a6hJ0cyE-yLaCXUwwnzb57DPgDeUz6-0kr-HLAtU2NBZBnt_C2iPtGEVmeBfmlpuHBHtZjJUl45RrwuZqX_8jhb566RFYnnWkxKNBs6_ZVsmK5XCelpRkrKatLaz_8vWlZKi_vQ_dz2sHHmk9rszbOv_RI)

위와 같이 우리가 코드에서 바인딩 이름으로 썼던 'DB'라는 글자와 함께 해당 D1 DB를 연결하게 해주고 'Save' 버튼을 눌러주면 됩니다.

이제 다시 'https://astro-pages-d1-example.pages.dev' 주소로 가볼까요?

그런데 역시나 에러가 납니다.

왜 그런가 하면 일단 Cloudflare 대시보드에서 설정을 바꿨으면 반드시 터미널 상에서 다시 배포해야 합니다.

아래 명령어를 한 번만 더 실행시켜 주면 됩니다.

```bash
npx wrangler pages deploy dist
```

다시 해당 주소로 가면 아래 그림과 같이 잘 작동하는 모습이 보일 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgQAfdyJTgFAfyIGrCpBAr9YDpqOKaee4YXeYxnY9TefO18WV54LlVdt63l1Tp36_0pYDrP-4myotjxvdWNL-wDBcwYQ5-X0OJRFY8haa991O-LPmWjbXTMJvFjRkukqdHsgt5H1EHhNAu1FGSE-NdRVYWjGxoLsY0CyDUPmQhJ9_8fTnkS-w8mqZH80TQ)

어떤가요?

AstroJS와 Cloudflare Pages + D1 + Drizzle ORM 까지 완벽하게 구현했네요.

그런데 조금 아쉬운 점은 UI 개발 서버와 Wrangler 개발 서버가 proxy로 연결되지 않는 점이 문제입니다.

원래는 아래처럼 하면 proxy로 개발 서버와 Wrangler 개발 서버가 연동되는데 현재 Wrangler가 불안한지 아니면 AstroJS의 버그인지 제대로 연동되지 않았는데요.

```json
"pages:dev": "wrangler pages dev --compatibility-date=2023-12-09 --proxy 3000 -- astro dev",
"pages:deploy": "astro build && wrangler pages deploy ./dist"
```

혹시 고치실 수 있는 분 댓글 부탁드립니다.

그럼.
