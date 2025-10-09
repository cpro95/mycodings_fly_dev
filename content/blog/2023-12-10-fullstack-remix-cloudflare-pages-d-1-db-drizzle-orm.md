---
slug: 2023-12-10-fullstack-remix-cloudflare-pages-d-1-db-drizzle-orm
title: 풀스택 강의 4편. Remix + Cloudflare Pages + D1 DB + Drizzle ORM
date: 2023-12-10 06:45:35.757000+00:00
summary: 풀스택 강의, Remix와 Pages, D1, Drizzle ORM으로 개발하기
tags: ["remix", "pages", "d1", "drizzle", "cloudflare"]
contributors: []
draft: false
---

안녕하세요?

지난 시간에 이어 Cloudflare 서비스를 이용한 풀스택 강의 계속하겠습니다.

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

1. [Remix 템플릿 설치](#1-remix-템플릿-설치)

2. [D1 DB 만들기](#2-d1-db-만들기)

3. [Drizzle 스키마 파일 만들기](#3-drizzle-스키마-파일-만들기)

4. [Remix Env 설정](#4-remix-env-설정)

5. [Remix에서 D1 DB 연결하기](#5-remix에서-d1-db-연결하기)

6. [API 엔드 포인트 작성](#6-api-엔드-포인트-작성)

7. [todos 보여주는 List 만들기](#7-todos-보여주는-list-만들기)

8. [Delete API 만들기](#8-delete-api-만들기)

9. [배포하기](#9-배포하기)

---

## 1. Remix 템플릿 설치

Remix와 Cloudflare Pages, D1 DB의 조합은 어떨까 생각해 봤는데요.

그래서 직접 시도해 봤습니다.

얼마나 무거울지 벌써 걱정이네요.

먼저, Remix를 Cloudflare Pages 템플릿으로 설치해야 합니다.

공식 홈페이지에서 제공하는 템플릿은 아래와 같습니다.

```bash
npx create-remix@latest --template remix-run/remix/templates/arc
npx create-remix@latest --template remix-run/remix/templates/cloudflare-pages
npx create-remix@latest --template remix-run/remix/templates/cloudflare-workers
npx create-remix@latest --template remix-run/remix/templates/deno
npx create-remix@latest --template remix-run/remix/templates/express
npx create-remix@latest --template remix-run/remix/templates/fly
```

저는 cloudflare-pages 템플릿을 사용해야겠네요.

```bash
npx create-remix@latest --template remix-run/remix/templates/cloudflare-pages

 remix   v2.3.1 💿 Let's build a better website...

   dir   Where should we create your new project?
         ./remix-pages-d1-drizzle

      ◼  Template: Using remix-run/remix/templates/cloudflare-pages...
      ✔  Template copied

   git   Initialize a new git repository?
         Yes

  deps   Install dependencies with npm?
         Yes

      ✔  Dependencies installed

      ✔  Git initialized

  done   That's it!

         Enter your project directory using cd ./remix-pages-d1-drizzle
         Check out README.md for development and deploy instructions.

         Join the community at https://rmx.as/discord
```

이제 Drizzle ORM 관련 패키지를 설치해 보겠습니다.

```bash
npm i drizzle-orm better-sqlite3

npm i -D @types/better-sqlite3 drizzle-kit
```

준비가 끝났네요.

---

## 2. D1 DB 만들기

이제 Cloudflare D1 DB를 만들어야 합니다.

```bash
npx wrangler login
```

위와 같이 하면 로그인하라는 브라우저가 뜨고 로그인하면 허용하라는 창이 뜹니다.

허용하면 이제 다시 터미널로 돌아가서 작업할 수 있는데요.

```bash
npx wrangler d1 create remix-d1

--------------------
🚧 D1 is currently in open alpha and is not recommended for production data and traffic
🚧 Please report any bugs to https://github.com/cloudflare/workers-sdk/issues/new/choose
🚧 To request features, visit https://community.cloudflare.com/c/developers/d1
🚧 To give feedback, visit https://discord.gg/cloudflaredev
--------------------

✅ Successfully created DB 'remix-d1' in region APAC
Created your database using D1's new storage backend. The new storage backend is not yet recommended
for production workloads, but backs up your data via point-in-time restore.

[[d1_databases]]
binding = "DB" # i.e. available in your Worker on env.DB
database_name = "remix-d1"
database_id = "222222222222222222222222" # 개인정보 보여주면 안 돼요!
```

remix-d1 이라는 D1 DB가 설치되었습니다.

프로젝트 폴더의 최상단에 wrangler.toml 파일을 만들고 아래 내용을 복사해서 저장하십시오.

```bash
[[d1_databases]]
binding = "DB" # i.e. available in your Worker on env.DB
database_name = "remix-d1"
database_id = "222222222222222222222222" # 개인정보 보여주면 안돼요!
```

이제, 대시보드에서 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEgPKe4yYeTr-GSgTB084SVJmpJWjcnug2A76skM0zK8sRETwIilxOK3tCTarNoE1a_JepK2zULIHpKBgvJbBoKCxUtf9VVmuD-3dNrmw49W80OTaunYWnOK0JSvGigeojl9ERVQ2fH-nx55aZqDIG36A_LcpM5S_NVESpawsuise2IlWIcZdSB3NO5-bIs)

위와 같이 Cloudflare 엣지 서버에도 성공적으로 DB가 생성되었네요.

그러면 여기서 생각해 봐야 할 게 있는데요.

DB는 있는데 테이블이 없습니다.

그럼, 테이블을 만들어야죠.

테이블 만드는 걸 SQL 파일을 만들어서 CREATE TABLE 방식으로 하는 거죠.

그런데 Drizzle ORM을 사용하면 Typescript의 타입 안정성과 함께 해당 SQL 파일로 만들어 줘서 아주 편합니다.

---

## 3. Drizzle 스키마 파일 만들기

이제, 테이블의 블루 프린트라고 하는 스키마 파일을 만들어야 합니다.

보통 db라는 폴더를 만들고 그 밑에 만들거든요.

우리가 Remix 프레임워크에서 가장 자주 가는 곳은 app 폴더입니다.

그래서 app 폴더 밑에 db 폴더를 만들고 schema.ts 파일을 만들겠습니다.

```js
// app/db/schema.ts

import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";

export const todos = sqliteTable("todos", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name"),
  isCompleted: integer("isCompleted", { mode: "boolean" })
    .notNull()
    .default(false),
});
```

todos 테이블을 만드는 Drizzle 명령어입니다.

이제 블루 프린트를 만들었으니 Drizzle Kit를 이용해서 마이그레이션 파일을 만들어야죠.

```bash
npx drizzle-kit generate:sqlite --schema=./app/db/schema.ts

drizzle-kit: v0.20.6
drizzle-orm: v0.29.1

1 tables
todos 3 columns 0 indexes 0 fks

[✓] Your SQL migration file ➜ drizzle/0000_living_red_ghost.sql 🚀
```

위와 같이 drizzle 폴더에 해당 sql 파일이 생성되었습니다.

한번 볼까요?

```sql
CREATE TABLE `todos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`isCompleted` integer DEFAULT false NOT NULL
);
```

SQL 파일이 생성되었네요.

이제, Cloudflare D1 DB에 해당 SQL 명령어를 전송해서 테이블을 만들어야 하는데요.

아니면 로컬 DB에 먼저 테스트 목적으로 만들고, 앱을 완성한 후 최종적으로 D1 DB에 테이블을 만들고 배포하는 방식이 있습니다.

로컬 DB를 먼저 만들고 개발을 완료하는 게 우선이니까 로컬 DB로 만들겠습니다.

아래 명령어에서 '--local' 옵션이 아주 중요합니다.

이게 들어가면 로컬 DB이고 없으면 원격 DB 인거죠.

```bash
npx wrangler d1 execute remix-d1 --local --file=./drizzle/0000_living_red_ghost.sql

▲ [WARNING] Processing wrangler.toml configuration:

    - D1 Bindings are currently in alpha to allow the API to evolve before general availability.
      Please report any issues to https://github.com/cloudflare/workers-sdk/issues/new/choose
      Note: Run this command with the environment variable NO_D1_WARNING=true to hide this message
  
      For example: `export NO_D1_WARNING=true && wrangler <YOUR COMMAND HERE>`


--------------------
🚧 D1 is currently in open alpha and is not recommended for production data and traffic
🚧 Please report any bugs to https://github.com/cloudflare/workers-sdk/issues/new/choose
🚧 To request features, visit https://community.cloudflare.com/c/developers/d1
🚧 To give feedback, visit https://discord.gg/cloudflaredev
--------------------

🌀 Mapping SQL input into an array of statements
🌀 Loading DB at .wrangler/state/v3/d1/cd33333333333333333320aaca0/db.sqlite
```

뭔가 성공적으로 작업이 완료된 느낌이네요.

더미 데이터를 넣어 볼까요?

```bash
npx wrangler d1 execute remix-d1 --local --command="INSERT INTO todos(name, isCompleted) VALUES('Test 1', 0);"

npx wrangler d1 execute remix-d1 --local --command="INSERT INTO todos(name, isCompleted) VALUES('Test 2', 1);"

npx wrangler d1 execute remix-d1 --local --command="INSERT INTO todos(name, isCompleted) VALUES('Test 3', 0);"

npx wrangler d1 execute remix-d1 --local --command="SELECT * FROM todos;"

┌────┬────────┬─────────────┐
│ id │ name   │ isCompleted │
├────┼────────┼─────────────┤
│ 1  │ Test 1 │ 0           │
├────┼────────┼─────────────┤
│ 2  │ Test 2 │ 1           │
├────┼────────┼─────────────┤
│ 3  │ Test 3 │ 0           │
└────┴────────┴─────────────┘
```

위와 같이 더미 데이터 및 Select문까지 실행이 완벽하게 잘 되네요.

---

## 4. Remix Env 설정

Remix에서 Cloudflare의 Env를 사용하려면 아래와 같이 하면 됩니다.

일단 remix.env.d.ts 파일을 오픈합니다.

```js
/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/cloudflare" />
/// <reference types="@cloudflare/workers-types" />

interface Env {
  DB: D1Database;
}
```

위와 같이 DB를 'D1Database'라고 하는 Env 인터페이스를 만듭니다.

DB라는 이름은 wrangler.toml 파일에 있는 그 binding에 있던 이름입니다.

```bash
[[d1_databases]]
binding = "DB" # 이 이름이 env.DB로 사용됩니다.
database_name = "remix-d1"
database_id = "222222222222222222222222" # 개인정보 보여주면 안돼요!
```

참고로, Env 인터페이스를 여기에 만드는 이유는 여러 파일에서 이 Env 인터페이스를 사용하기 때문에 remix.env.d.ts 파일에 한번만 만들어 놓으면 전체 Remix 파일 아무 곳에서도 접근이 가능합니다.

---

## 5. Remix에서 D1 DB 연결하기

이제 본격적인 DB 연결을 해 볼까요?

app 폴더 밑에 있는 routes 폴더에 '_index.tsx' 파일이 있습니다.

라우팅의 가장 첫 시작이 되는 파일입니다.

이 파일을 아래와 같이 수정합니다.

```js
import {
  json,
  type LoaderFunction,
  type MetaFunction,
} from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { drizzle } from "drizzle-orm/d1";
import { todos } from "~/db/schema";

// meta 함수는 중요한 부분이 아닙니다. 삭제해도 됩니다.
export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

// loader 함수는 이 파일이 처음 로드 될때 처음으로 시작하는 함수로
// 서버 사이드 함수입니다.
// 이 loader 함수가 끝나야 Index 컴포넌트가 시작됩니다.
// Index 컴포넌트가 시작되어야 그제야 클라이언트 렌더링이 되는 거죠.
export const loader: LoaderFunction = async ({ context }) => {
  
  // Env라고 아까 만들었던 인터페이스로 context.env를 사용하게 끔 합니다.
  let env = context.env as Env;

  // drizze 함수를 이용해서 db를 불러오고,
  const db = drizzle(env.DB);

  // db.select로 원하는 데이터를 가져옵니다.
  const results = await db.select().from(todos).all();

  // Remix는 json 함수를 제공해 줘서 아주 쉽게 JSON 형태로 보낼 수 있습니다.
  return json(results);
};

export default function Index() {
  // useLoaderData 함수는 loader 함수에서 리턴한 값을 받을 수 있는 함수인데요.
  // 즉, 클라이언트 컴포넌트에서 서버 사이드 함수에서 리턴한 값을 받는데 사용하는 함수입니다.
  const results = useLoaderData<typeof loader>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix</h1>
      <pre>{JSON.stringify(results, null, 2)}</pre>
    </div>
  );
}
```

이제 'npm run dev'로 시작해 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEhIEKqVPG7qhKqaO2xJHgb8JplikMTTlC4mLLv69vxceeC8Vh4Q6WBCSoXpns-q2MnNLE9Ne70r6P8UE8FLkQYZTkYPx3CgDG_iQqMDU-QpncZnwgPT-oZx90qLUvnD1Bsa4nMr-Ah7AKppxX5bm3M57FZjKPVW2b_nJr4n0u-a7VHqXklD38_cbOYle2U)

위와 같이 우리가 더미 데이터로 만들었던 자료가 아주 잘 나오네요.

성공입니다.

---

## 6. API 엔드 포인트 작성

이제 todos 생성하는 API를 만들어야 하는데요.

Form과 API를 이용할 겁니다.

일단 Form을 만들 건데요.

```js
<form method="post" action="/api/post-todos">
  <input type="text" name="name" />
  <input type="checkbox" name="isCompleted" />
  <button type="submit">Add</button>
</form>
```

가장 기본적인 form과 submit 버튼입니다.

form의 method는 당연히 "POST"이고, action은 주소인데요.

form에서 전달된 데이터를 처리하라는 API가 있는 주소를 나타냅니다.

form에서 input 태그가 2개가 있는데요.

둘 다 name 부분을 잘 보셔야 합니다.

우리가 todos 테이블에서 만들었던 그 이름이네요.

꼭 같을 필요는 없습니다.

이제 이 form 태그를 h1 태그 바로 밑에 위치시키면 됩니다.

그리고 'api/post-todos'라는 주소의 API 엔드포인트를 만들어야 하는데요.

Remix 최신판은 플랫 라우팅을 지원하기 때문에 routes 폴더 밑에 다음과 같이 만들면 됩니다

`/app/routes/api.post-todos.ts`

이름 중에 api 다음에 점이 있는데요.

이 점이 '/'를 가리킵니다.

그래서 'api/post-todos' 주소가 되는 거죠.

```js
// 위치 : /app/routes/api.post-todos.ts

import { redirect, type ActionFunction } from "@remix-run/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { todos } from "~/db/schema";

export const action: ActionFunction = async ({ context, request }) => {
  const formData = await request.formData();
  
  // isCompleted는 null로 받을 수 있는데 그걸 문자열로 받고
  const name = formData.get("name") as string;
  const isCompletedData = formData.get("isCompleted") as string;

  // 여기서 true, false로 구분해 줍니다.
  let isCompleted = isCompletedData ? true : false;

  let env = context.env as Env;

  const db = drizzle(env.DB);

  // drizzle db를 이용해서 쉽게 todos 테이블에 삽입합니다.
  // values 메서드에는 객체를 넣어야 하는데요.
  // {name: name } 이라서 그냥 {name} 만 써도 됩니다.
  const result = await db.insert(todos).values({ name, isCompleted }).run();
  console.log(result);
  
  return redirect("/");
};
```

Drizzle 사용하는 법과 formData 사용하는 법은 거의 비슷합니다.

이제 테스트해 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEgf43Zxu_JXmXb_ox4pnPXwK4vqKIVQx6LUfPktOXeQL82DUAAgM0xJqX-XHxjW4KiiIovjD0xNuVy51b3PVowwvyGLBiO0cUly_zxrf_WS1NNCZrrZsKJopJaHwfaXda224z1Warnr6G3jnOCSO-3HkLYWxaomesDUN_r1IsqeTCBWXquh9sHQLUsSlFc)

![](https://blogger.googleusercontent.com/img/a/AVvXsEjGF63jjYaWYKEVIBIK9WoqAXs_JjgvrMoLHUysNJPIXxpRFzBdN1CA660_KLPddP1KwlsRT-ugJWe3oqiTNIuKXxPFUpjnIxegmAoK026c_0M1FWjc6kQfmcjmteIY7_U9IcAdsEZRlLY5YLbotaXfdHAKcDE6VDAy2GodOOxoMaKu-aNt_MN_TQR4zOY)

성공입니다.

---

## 7. todos 보여주는 List 만들기

todos 내용을 보여주는 List를 만들어야 하는데요.

delete 버튼도 같이 만들겠습니다.

기존에 pre 태그에 있던 자리에 아래 ul 태그를 넣으시면 됩니다.

```js
<ul>
  {Array.isArray(results) ? (
    results.map((t) => (
      <li key={t.id} style={{ display: "flex", gap: "10px" }}>
        <div
          style={
            t.isCompleted
              ? { textDecorationLine: "line-through" }
              : { fontWeight: "bold" }
          }
        >
          {t.name}
        </div>
        <form method="post" action="/api/delete-todos">

          // 아래 부분이 중요한데요.
          // type을 hidden으로 하면 화면에는 보이지 않지만
          // 해당 name과 value의 값이 formData로 전달됩니다.
          <input type="hidden" name="id" value={t.id} />
          <button type="submit">Delete</button>
        </form>
      </li>
    ))
  ) : (
    <></>
  )}
</ul>
```

나름 깔끔하게 textDecorationLine도 넣었습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEi5BLvxCyVQ3qrhb1KbeLsG-1tqYcnqdXUsxszh0C-dKySQRspHf_1xIg6nJ2i4I5an38CN3zNBfBmETRHfwPZ6gDgVTNlxA9K235sAU4HXFJaRCYrXejXN8hqFNupOhGe4SQifpLBHPwx0AZjbR49MhKNm4K2_hnrDPNWCGkadsHVKyRu_J4IjRGq62u0)

위와 같이 나옵니다.

Delete 버튼을 누르면 에러가 뜨는데요.

'/api/delete-todos' API 엔드포인트를 작성하지 않아서 그렇죠.

---

## 8. Delete API 만들기

'app/routes/api.delete-todos.ts' 파일을 만듭니다.

```js
// 위치 : /app/routes/api.delete-todos.ts

import { type ActionFunction, redirect } from "@remix-run/cloudflare";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { todos } from "~/db/schema";

export const action: ActionFunction = async ({ context, request }) => {
  const formData = await request.formData();

  // input type hidden으로 넘기 id 값입니다.
  const todoIdData = formData.get("id") as string;

  // Integer로 변환합니다.
  const todoId = todoIdData ? parseInt(todoIdData) : -1;

  if (todoId === -1) {
    return redirect("/");
  }

  let env = context.env as Env;
  const db = drizzle(env.DB);
  await db.delete(todos).where(eq(todos.id, todoId)).run();

  return redirect("/");
};
```

이제 테스트해 볼까요?

아주 잘됩니다.

완성되었네요.

---

## 9. 배포하기

이제 배포해야 하는데요.

개발 서버를 끝내고 'npm run build' 한 번 해주시고 wranlger를 이용해서 deploy 하면 됩니다.

```bash
npm run build

> build
> remix build

 info  building... (NODE_ENV=production)
 info  built (693ms)
```

Remix는 public 폴더에 빌드 시키는데요.

그리고 서버 사이드 함수는 functions 폴더 밑에 생성시킵니다.

그래서 wrangler가 functions 폴더를 보고 Pages의 workers라고 인식하는 거죠.

아까 위에서 Cloudflare 서버에 'remix-d1' 라는 DB만 만들고 'todos'라는 테이블을 만들지 않았는데요.

로컬에서 Drizzle Kit으로 만들었던 마이그레이션 SQL 파일을 그대로 이용할 겁니다.

여기서 '--local' 옵션을 빼면 됩니다.

```bash
npx wrangler d1 execute remix-d1 --file=./drizzle/0000_living_red_ghost.sql

▲ [WARNING] Processing wrangler.toml configuration:

    - D1 Bindings are currently in alpha to allow the API to evolve before general availability.
      Please report any issues to https://github.com/cloudflare/workers-sdk/issues/new/choose
      Note: Run this command with the environment variable NO_D1_WARNING=true to hide this message
  
      For example: `export NO_D1_WARNING=true && wrangler <YOUR COMMAND HERE>`


--------------------
🚧 D1 is currently in open alpha and is not recommended for production data and traffic
🚧 Please report any bugs to https://github.com/cloudflare/workers-sdk/issues/new/choose
🚧 To request features, visit https://community.cloudflare.com/c/developers/d1
🚧 To give feedback, visit https://discord.gg/cloudflaredev
--------------------

🌀 Mapping SQL input into an array of statements
🌀 Parsing 1 statements
🌀 Executing on remix-d1 (c44444444444444444a0): 개인정보라서 지웠습니다.
🚣 Executed 1 commands in 0.4437ms
```

아무 문제 없이 잘 되네요.

Cloudflare 대시보드를 볼 필요도 없을 거 같네요.

이제 진짜 Deploy입니다.

```bash
## 아래 명령어를 보시면 꼭 Remix가 빌드 된 public 폴더를 지정해야 합니다.
npx wrangler pages deploy ./public

No project selected. Would you like to create one or use an existing project?
❯ Create a new project
  Use an existing project
✔ Enter the name of your new project: … remix-pages-d1-drizzle
✔ Enter the production branch name: … main
✨ Successfully created the 'remix-pages-d1-drizzle' project.
▲ [WARNING] Warning: Your working directory is a git repo and has uncommitted changes

  To silence this warning, pass in --commit-dirty=true


✨ Compiled Worker successfully
🌏  Uploading... (9/9)

✨ Success! Uploaded 9 files (2.77 sec)

✨ Uploading _headers
✨ Uploading Functions bundle
✨ Uploading _routes.json
✨ Deployment complete! Take a peek over at https://91b03666.remix-pages-d1-drizzle.pages.dev
```

성공적이네요.

해당 주소로 가볼까요?

에러가 납니다.

왜 그러냐면 Cloudflare Pages인 remix-pages-d1-drizzle 대시보드로 가서 Settings에서 Functions 부분에서 D1에 관한 바인딩을 지정해 줘야 합니다.

우리가 로컬 개발할 때는 wrangler.toml 파일을 이용해서 D1 DB의 이름이 'remix-d1'이란걸 아는데요.

실제 서버에서는 모르기 때문에 아래 그림과 같이 해줘야 합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEig2aYKBm0l_XyxxyqZS5WALF7kSmzXMJIv6bjBSULunyTNi1T_l68YgDHpacMgUwRNAzRfJfZrc7IPFNi8J5zSA5fo381mWVOz6igoQIDXX1H7SHD8TjoUNUS5RH8tBVUHEd58ZMXXdRtUTrhGhlUtaLlHOtRDbGFUz7TVjeW06yWXpsC8pxp2DiATNV4)

위 경로로 들어가서 아래 그림처럼 하시면 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEij7N8WfyrCR3xphxe2__RlErrrrETRTeUoWDm2sqFHZDEQtj0SHU5txaLjFiehjoiEiGJVZZ9A-Fase6pieYHC8QkaKlZ7YAZV0MTN3EwsmnukI44vJdkZjAfKrHdtxKnPhgmLzkeuagujjEbFNwo22eNS_pr0n83sbRz7Wc8S_T08aYiy6HBP5pD6XqY)

![](https://blogger.googleusercontent.com/img/a/AVvXsEgK8b2GOgM7dsA1gRSQM4AmuRAGeTnBpZM2__sTXJdlzJIG9BTOtcP4m8cynUyAj0Y5Qoai9_u7AouuynbpaZ1chWN-Ah4NH9ym5MR8d2h1rpao1kLTVfsBy6opEiLrBEehoBDGiyikEoBd1M6mlvB-fsH65f12Eo4nHD4KkYekvYfKjCneojayowWDJ2k)

이제 D1 DB 바인딩도 끝났으니까 다시 접속하면 될 거 같죠?

아닙니다.

Cloudflare의 특징은 한번 더 deploy 해줘야 합니다.

```bash
npx wrangler pages deploy ./public

▲ [WARNING] Warning: Your working directory is a git repo and has uncommitted changes

  To silence this warning, pass in --commit-dirty=true


✨ Compiled Worker successfully
🌍  Uploading... (9/9)

✨ Success! Uploaded 0 files (9 already uploaded) (0.64 sec)

✨ Uploading _headers
✨ Uploading Functions bundle
✨ Uploading _routes.json
✨ Deployment complete! Take a peek over at https://4bc128ca.remix-pages-d1-drizzle.pages.dev
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEiOyURK-sTySLtsfvq7T7O9c5JLDSHGySlRouocPlL256SLJBDe6aZStEN-LjOs-2RM70gjPIKIOJ7Rn-P4H3TGQ6NUiG4k0V5-5Y3u9d1_hI71ON90g6CM3hqQdyVWUlZGBUs1v2jE8G1ytmJKCEqFZ3aZZN_rcpYGGLtBcxpL4zJ2Nrw-BHbUZ76B6E4)

위와 같이 개벌 서버인 'https://4bc128ca.remix-pages-d1-drizzle.pages.dev'로 이동해서 테스트한 그림입니다.

아주 잘 되네요.

그리고 정식 주소인 'https://remix-pages-d1-drizzle.pages.dev'로 가서 테스트한 사진은 아래와 같습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgd-jSiq8neIK1I2cOMk_PCJxVJkGActUeT43NYr8m-qiZ42vqJh8jbWSTJCuEL71esdHvwKGTRX-UliJTjcPaSsiYeNCwdj0xsFAE8Z7VIKxVzUdacP-aaznECS8jw2q2n2ERlpgGQ2-PQmLzXWVxic0ob9iG6oPi2YcIjsYm6CaxYPxBLEQI965FSCzY)

어떤가요?

아주 잘되네요.

---

지금까지 Remix를 이용해서 풀스택 애플리케이션을 만들어 봤는데요.

지난 시간에 AstroJS의 경우 wrangler 개발 서버와 로컬 UI 개발 서버가 Proxy로 연결되지 못해 작업하기 불편했었는데요.

이번 시간에 만든 Remix는 아마도 wrangler 버전 3.8을 사용해서 그런지 'wranger pages dev' 명령어만으로도 UI 및 API 엔드 포인트까지 로컬에서 수월하게 만들 수 있었습니다.

나중에 AstroJS에서도 Wrangler 3.8 버전으로 테스트해봐야겠네요.

제가 지금까지 Cloudflare D1을 이용한 Todo 앱을 React, AstroJS, Remix를 이용해서 만들어 봤는데요.

개인적인 느낌은 Remix가 가장 빠른 거 같습니다.

Remix가 가장 무거운 거는 맞는데 react-router 만든 팀이라 뭔가 매직을 부린 거 같습니다.

여러분도 각자 한번 해보시면 어떨까요?

아직도, Next.js, SvelteKit을 이용한 풀스택 개발 편이 남아 있으니 다음 시간에 봐요. 그럼.


