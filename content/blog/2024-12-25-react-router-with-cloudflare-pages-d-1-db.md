---
slug: 2024-12-25-react-router-with-cloudflare-pages-d-1-db
title: React Router V7과 Cloudflare Pages 그리고 D1 Database 사용
date: 2024-12-25 06:47:59.815000+00:00
summary: React Router V7를 Cloudflare Pages에 D1 DB를 이용해서 배포할 수 있게 개조하기
tags: ["react", "react router v7", "react router", "cloudflare", "d1 db", "cloudflare pages"]
contributors: []
draft: false
---

** 목차 **

- [React Router V7과 Cloudflare Pages 그리고 D1 Database 사용](#react-router-v7과-cloudflare-pages-그리고-d1-database-사용)
  - [React Router V7에 Cloudflare 관련 추가하기](#react-router-v7에-cloudflare-관련-추가하기)
  - [wrangler로 Cloudflare 관련 세팅하기](#wrangler로-cloudflare-관련-세팅하기)
  - [tsconfig.json 파일에 types 정보 추가하기](#tsconfigjson-파일에-types-정보-추가하기)
  - [entry.server.tsx 파일 손보기](#entryservertsx-파일-손보기)
  - [vite.config 파일 손보기](#viteconfig-파일-손보기)
  - [D1 DB 추가](#d1-db-추가)
  - [D1 DB 코드 테스트하기](#d1-db-코드-테스트하기)
  - [Cloudflare 관련 타입 정보 추가하기](#cloudflare-관련-타입-정보-추가하기)
  - [package.json 파일 scripts 손보기](#packagejson-파일-scripts-손보기)


안녕하세요?

지난 시간에 React Router V7을 이용한 가장 기본적인 유저 로그인 구현을 알아보았는데요.

[React Router V7 유저 Auth(로그인) 구현하기](https://mycodings.fly.dev/blog/2024-12-25-tutorial-react-router-v-7-user-auth)

이번 시간에는 Cloudflare 네트워크상에 배포할 수 있는 Pages 서비스를 이용할 수 있게 React Router 템플릿을 개조해 보겠습니다.

먼저, create-react-router를 이용해서 빈 템플릿을 아래와 같이 만듭니다.

```sh
npx create-react-router@latest 

or

pnpx create-react-router@latest 
```

맥북 용량이 많으면 NPM이나 NPX 명령어를 사용하셔도 무방하지만 저 같이 256GB 맥북을 가지고 계신분이라면 되도록이면 PNPM이나 PNPX를 사용하는 걸 추천드립니다.

하드 용량 절약이 눈에 띄게 크다는 걸 쉽게 체감할 수 있을 겁니다.

일단 아래와 같이 가장 기본적인 React Router V7 템플릿을 만들었습니다.

```sh
react-router-cloudflare-pages-d1-test

         create-react-router v7.1.1
      ◼  Directory: Using react-router-cloudflare-pages-d1-test as project directory

      ◼  Using default template See https://github.com/remix-run/react-router-templates for more
      ✔  Template copied

   git   Initialize a new git repository?
         Yes

  deps   Install dependencies with pnpm?
         Yes

      ✔  Dependencies installed

      ✔  Git initialized

  done   That's it!

         Enter your project directory using cd ./react-router-cloudflare-pages-d1-test
         Check out README.md for development and deploy instructions.

         Join the community at https://rmx.as/discord
```

이제, 터미널의 tree 명령어를 통해 전체적인 구조를 보겠습니다.

```sh
➜  react-router-cloudflare-pages-d1-test git:(main) ✗ tree . -L 2
.
├── Dockerfile
├── Dockerfile.bun
├── Dockerfile.pnpm
├── README.md
├── app
│   ├── app.css
│   ├── root.tsx
│   ├── routes
│   ├── routes.ts
│   └── welcome
├── node_modules
│   ├── @react-router
│   ├── @types
│   ├── autoprefixer -> .pnpm/autoprefixer@10.4.20_postcss@8.4.49/node_modules/autoprefixer
│   ├── cross-env -> .pnpm/cross-env@7.0.3/node_modules/cross-env
│   ├── isbot -> .pnpm/isbot@5.1.18/node_modules/isbot
│   ├── postcss -> .pnpm/postcss@8.4.49/node_modules/postcss
│   ├── prettier -> .pnpm/prettier@2.8.8/node_modules/prettier
│   ├── react -> .pnpm/react@19.0.0/node_modules/react
│   ├── react-dom -> .pnpm/react-dom@19.0.0_react@19.0.0/node_modules/react-dom
│   ├── react-router -> .pnpm/react-router@7.1.1_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/react-router
│   ├── tailwindcss -> .pnpm/tailwindcss@3.4.17/node_modules/tailwindcss
│   ├── typescript -> .pnpm/typescript@5.7.2/node_modules/typescript
│   ├── vite -> .pnpm/vite@5.4.11_@types+node@20.17.10/node_modules/vite
│   └── vite-tsconfig-paths -> .pnpm/vite-tsconfig-paths@5.1.4_typescript@5.7.2_vite@5.4.11_@types+node@20.17.10_/node_modules/vite-tsconfig-paths
├── package.json
├── pnpm-lock.yaml
├── public
│   └── favicon.ico
├── react-router.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts

20 directories, 15 files
```

위 구조를 보면 아주 깔끔한 node_modules 구조가 보일겁니다.

PNPM의 위력이죠.

---

## React Router V7에 Cloudflare 관련 추가하기

이제 Cloudflare 관련 패키지를 설치해야 합니다.

총 3가지가 필요한데요.

먼저, @react-router/cloudflare와 wrangler 패키지입니다.

```sh
npm install @react-router/cloudflare wrangler

or

pnpm install @react-router/cloudflare wrangler
```

마지막으로 필요한게 타입스크립트로 개발하기 위한 타입정보인데요.

```sh
npm install -D @cloudflare/workers-types

or

pnpm install -D @cloudflare/workers-types
```

지금까지의 package.json 파일을 보겠습니다.

```sh
➜  react-router-cloudflare-pages-d1-test git:(main) ✗ bat package.json
───────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────
       │ File: package.json
───────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────
   1   │ {
   2   │   "name": "react-router-cloudflare-pages-d1-test",
   3   │   "private": true,
   4   │   "type": "module",
   5   │   "scripts": {
   6   │     "build": "cross-env NODE_ENV=production react-router build",
   7   │     "dev": "react-router dev",
   8   │     "start": "cross-env NODE_ENV=production react-router-serve ./build/server/index.js",
   9   │     "typecheck": "react-router typegen && tsc"
  10   │   },
  11   │   "dependencies": {
  12 + │     "@react-router/cloudflare": "^7.1.1",
  13   │     "@react-router/node": "^7.1.1",
  14   │     "@react-router/serve": "^7.1.1",
  15   │     "isbot": "^5.1.17",
  16   │     "react": "^19.0.0",
  17   │     "react-dom": "^19.0.0",
  18 ~ │     "react-router": "^7.1.1",
  19 ~ │     "wrangler": "^3.99.0"
  20   │   },
  21   │   "devDependencies": {
  22 + │     "@cloudflare/workers-types": "^4.20241224.0",
  23   │     "@react-router/dev": "^7.1.1",
  24   │     "@types/node": "^20",
  25   │     "@types/react": "^19.0.1",
  26   │     "@types/react-dom": "^19.0.1",
  27   │     "autoprefixer": "^10.4.20",
  28   │     "cross-env": "^7.0.3",
  29   │     "postcss": "^8.4.49",
  30   │     "tailwindcss": "^3.4.16",
  31   │     "typescript": "^5.7.2",
  32   │     "vite": "^5.4.11",
  33   │     "vite-tsconfig-paths": "^5.1.4"
  34   │   }
  35   │ }
───────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────
```

cat 명령어 말고 bat 명령어가 터미널 상에서 아주 깔끔하게 텍스트를 보여주네요.

`brew install bat` 명령어로 쉽게 설치할 수 있습니다.

---

## wrangler로 Cloudflare 관련 세팅하기

wrangler.toml 파일이 Cloudflare 관련 가장 기본적인 파일인데요.

아래와 같이 만들면 됩니다.

```sh
name = "react-router-cloudflare-pages-d1-test"
compatibility_date = "2024-11-12"
pages_build_output_dir = "./build/client"
```

여기서 중요한게 Cloudflare Worker 방식이 아닌 Pages를 이용해서 홈페이지를 웹상에 배포하고 싶을때는 위와 같이 `pages_build_output_dir` 옵션이 꼭 들어가야 합니다.

이 옵션이 없으면 Wrangler가 Worker 옵션으로 인식하고 worker로 배포하게 됩니다.

그러면 `pages_build_output_dir` 옵션에 들어간 값이 뭘까요?

바로 React Router V7 앱을 빌드(build)하면 생기는 폴더인데요.

한번 빌드해 보겠습니다.

```sh
➜  test-cf git:(main) ✗ pnpm run build

> test-cf@ build /Users/cpro95/Codings/Javascript/react-router-test/test-cf
> cross-env NODE_ENV=production react-router build

vite v5.4.11 building for production...
✓ 45 modules transformed.
build/client/.vite/manifest.json                  1.37 kB │ gzip:  0.37 kB
build/client/assets/app-Ckulty-W.css              7.33 kB │ gzip:  2.13 kB
build/client/assets/with-props-BJdOiEPt.js        0.35 kB │ gzip:  0.21 kB
build/client/assets/home-D555HUO7.js              0.50 kB │ gzip:  0.35 kB
build/client/assets/root-CzEkcZd-.js              1.19 kB │ gzip:  0.67 kB
build/client/assets/chunk-K6AXKMTT-DycbfBQN.js  105.32 kB │ gzip: 35.59 kB
build/client/assets/entry.client-u-M4TmH-.js    178.81 kB │ gzip: 56.77 kB
✓ built in 680ms
vite v5.4.11 building SSR bundle for production...
✓ 8 modules transformed.
build/server/.vite/manifest.json      0.43 kB
build/server/assets/app-Ckulty-W.css  7.33 kB
build/server/index.js                 6.28 kB
✓ built in 38ms
```

위와 같이 build가 성공하면 아래와 같이 build 폴더가 생깁니다.

```sh
➜  test-cf git:(main) ✗ tree ./build -L 2
./build
├── client
│   ├── assets
│   └── favicon.ico
└── server
    ├── assets
    └── index.js

5 directories, 2 files
```

잘 보시면 server 폴더 밑에 있는 index.js가 바로 웹 서버를 구동하는 파일입니다.

만약 NodeJS를 이용해서 VPS에 배포하면 node 서버가 되는 거고, Cloudflare에 배포하면 Cloudflare worker를 이용해서 서버가 돌아가게 되는 겁니다.

우리의 목적은 Cloudflare 상에 Pages 서비스 형태로 배포하기 원하기 때문에 이 역할을 할 Cloudflare 만의 특별한 파일을 만들어야 합니다.

여기서 만약 worker를 이용해서 배포한다면 workers 폴더의 app.ts 파일이 필요하고, Pages 서비스를 이용해서 배포한다면 functions 폴더 밑의 `[[path]].ts` 파일이 필요합니다.

우리는 Pages 서비스를 이용하기 때문에 functions 폴더 밑에 `[[path]].ts` 파일을 만들겠습니다.

아래와 같이 만들면 됩니다.

```ts
import { createPagesFunctionHandler } from "@react-router/cloudflare";
import * as build from "../build/server";
import type { ServerBuild } from "react-router";

export const onRequest = createPagesFunctionHandler({
  build: build as ServerBuild,
});
```

위 파일이 Cloudflare 네트워크 상에서 실행되는 worker 함수인데요.

onRequest 라는 함수를 주면 모든 웹 리퀘스트일 때 실행한다는 뜻으로 즉, 서버가 실행된다는 뜻입니다.

이때 위에서 createPagesFunctionHandler 라는 cloudflare 만의 react-router가 제공하는 핸들러를 이용해서 우리가 아까 build한 폴더의 `server/index.js`를 돌리게 되는 겁니다.

이 파일을 만들면 타입스크립트가 아래 그림처럼 불만을 표시하는데요.

무시하시면 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEh6T_lipSqBVUEqI1FRpHRWs31ZXtGeXDRalbx7TnQ96WL5OJzOTJlXZN77ZEEYQgA-x0u2IYZVIzJXQ9eKBhfyf7c5t51xQ41VSJOqKXpeVfoTYCX_cRu8x44EafUa4h0XfEQRbG2XwsBkew4OxEOCe54ucpr02udn4aCuHV7MDMB214bfebtoMzHWAco)

---

## tsconfig.json 파일에 types 정보 추가하기

Cloudflare worker 관련 타입을 추가하기 위해 tsconfig.json 파일을 엽니다.

compilerOptions 밑에 있는 types 항목을 아래와 같이 만듭니다.

`@cloudflare/workers-types`만 추가하시면 됩니다.

```ts
"compilerOptions": {
   ...
   "types": ["@cloudflare/workers-types", "node", "vite/client"],
   ...
}
```

---

## entry.server.tsx 파일 손보기

Remix 프레임웍을 다루다 보면 entry.server.tsx 파일과 entry.client.tsx 파일이 보이는데요.

React Router에서는 보이지가 않습니다.

숨겨놓은 건데요.

그냥 Node 서버를 이용할 거라면 고칠 필요가 없지만 우리는 Node가 아니라 Cloudflare worker 런타임을 이용할 거라서 entry.server를 직접 고쳐야 합니다.

일단 숨겨놓은 두 개의 파일을 파일에 보이게 해야 하는데요.

아래와 같이 터미널 상에서 입력하면 됩니다.

```sh
➜  react-router-cloudflare-pages-d1-test git:(main) ✗ npx react-router reveal
Entry file entry.client created at app/entry.client.tsx.
Entry file entry.server created at app/entry.server.tsx.
```

`npx react-router reveal` 명령어를 입력하면 위와 같이 두 개의 파일이 reveal 되어 집니다.

entry.client 파일은 건들게 없어 그대로 나두고 entry.server 파일만 아래와 같이 고칩니다.

Remix 템플릿에서 가져온 겁니다.

차이점은 NodeJS를 이용하면 react-dom 서버의 renderToPipeableStream 함수를 이용하지만 Cloudflare worker 런타임을 사용할 경우 renderToReadableStream 함수를 사용해야 합니다.

entry.server.tsx 파일의 전체 내용을 아래와 같이 바꿉니다.

```ts
import type { AppLoadContext, EntryContext } from "react-router";
import { ServerRouter } from "react-router";
import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  _loadContext: AppLoadContext
) {
  let shellRendered = false;
  const userAgent = request.headers.get("user-agent");

  const body = await renderToReadableStream(
    <ServerRouter context={routerContext} url={request.url} />,
    {
      onError(error: unknown) {
        responseStatusCode = 500;
        // Log streaming rendering errors from inside the shell.  Don't log
        // errors encountered during initial shell rendering since they'll
        // reject and get logged in handleDocumentRequest.
        if (shellRendered) {
          console.error(error);
        }
      },
    }
  );
  shellRendered = true;

  // Ensure requests from bots and SPA Mode renders wait for all content to load before responding
  // https://react.dev/reference/react-dom/server/renderToPipeableStream#waiting-for-all-content-to-load-for-crawlers-and-static-generation
  if ((userAgent && isbot(userAgent)) || routerContext.isSpaMode) {
    await body.allReady;
  }

  responseHeaders.set("Content-Type", "text/html");
  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
```

그냥 이렇게만 하면 됩니다.

이게 React Router가 서버를 돌릴 때 엔트리포인트가 되는 겁니다.

---

## vite.config 파일 손보기

위와 같이 entry.server.tsx 파일을 손봤으면 Vite 개발 서버를 위해서 `vite.config.ts` 파일을 아래와 같이 손봐야 합니다.

```ts
import { cloudflareDevProxy } from "@react-router/dev/vite/cloudflare";

export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  plugins: [cloudflareDevProxy(), reactRouter(), tsconfigPaths()],
});
```

위 코드를 보시면 cloudflareDevProxy 만 추가하면 됩니다.

이제 Cloudflare 상에서 Pages 서비스 형태로 배포할 수 있게 완료가 되었는데요.

여기서 그치지 말고 D1 DB를 이용할 수 있게 여러 가지 설정을 추가해 보겠습니다.

---

## D1 DB 추가

일단 wrangler 명령어로 D1 DB를 하나 만듭니다.

```sh
➜  react-router-cloudflare-pages-d1-test git:(main) ✗ pnpx wrangler d1 create mydb

 ⛅️ wrangler 3.99.0
-------------------

✅ Successfully created DB 'mydb' in region WNAM
Created your new D1 database.

[[d1_databases]]
binding = "DB"
database_name = "mydb"
database_id = "5~~~~~~~~~~~~~~~~~~~~a"
```

위와 같이 'mydb'라는 이름의 D1 DB를 만들었습니다.

Cloudflare 웹으로 들어가 보면 아래와 같이 생성된게 보일겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjsCcjlXiRGFuQBPzeNgwYjbDLL5g5JGpzKMgTiOBNwXhcGVWk4dsMVxynICIgYR5ghQv7aYQBaV9KIR-R7yv4NC2DmgLabo_scWBqsKWJoNjO0m7BK8bww1eVcW-sjmsg7aMi9HWBaiBhJVP7oo6OuUiMhzeRccs5ptBAosXlgtzATGCH0odCqemQm1ag)

이제 d1_databases 부분을 wrangler.toml 파일에 붙여 넣으면 됩니다.

```toml
name = "react-router-cloudflare-pages-d1-test"
compatibility_date = "2024-11-12"
pages_build_output_dir = "./build/client"

[[d1_databases]]
binding = "DB"
database_name = "mydb"
database_id = "5~~~~~~~~~~~~~~~~~~~~a"
```

이제 D1 DB를 생성했으니 Table을 만들어야겠죠.

최상위 폴더에서 db 폴더를 만들고 schema.sql 파일을 아래와 같이 만듭니다.

```sql
CREATE TABLE `todos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`isCompleted` integer DEFAULT false NOT NULL
);
```

아주 간단한 todos 테이블입니다.

이제 이 SQL 테이블을 이용해서 실제로 D1 DB에 테이블을 만들어야 하는데요.

아래와 같이 명령어를 실행하면 합니다.

```sh
➜ pnpx wrangler d1 execute mydb --local --file=./db/schema.sql

 ⛅️ wrangler 3.99.0
-------------------

🌀 Executing on local database mydb (59~~~~~~~~~~~~~~~~~~~~~~7a) from .wrangler/state/v3/d1:
🌀 To execute on your remote database, add a --remote flag to your wrangler command.
🚣 1 command executed successfully.
```

위와 같이 '--local' 옵션을 주면 로컬 개발서버의 D1 DB에 적용되는 겁니다.

'--remote' 옵션으로 실제 Cloudflare 서버에 적용해 볼까요?

```sh
✗ pnpx wrangler d1 execute mydb --remote --file=./db/schema.sql

 ⛅️ wrangler 3.99.0
-------------------

✔ ⚠️ This process may take some time, during which your D1 database will be unavailable to serve queries.
  Ok to proceed? … yes
🌀 Executing on remote database mydb (5~~~~~~~~~~~~~~~~~~~~~~7a):
🌀 To execute on your local development database, remove the --remote flag from your wrangler command.
Note: if the execution fails to complete, your DB will return to its original state and you can safely retry.
├ 🌀 Uploading 5~~~~~~~~~~~~~~~a7a.4863d22c297eaea3.sql
│ 🌀 Uploading complete.
│
🌀 Starting import...
🌀 Processed 1 queries.
🚣 Executed 1 queries in 0.00 seconds (2 rows read, 4 rows written)
   Database is currently at bookmark 00000001-00000005-00004e72-c5040d254dc6ccd3b20d4a735370929b.
┌────────────────────────┬───────────┬──────────────┬────────────────────┐
│ Total queries executed │ Rows read │ Rows written │ Database size (MB) │
├────────────────────────┼───────────┼──────────────┼────────────────────┤
│ 1                      │ 2         │ 4            │ 0.02               │
└────────────────────────┴───────────┴──────────────┴────────────────────┘
```

엔터키를 한번 치면 수행되는데요.

실제 Cloudflare 웹상에서 살펴보겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgEPG0kX-SgljRJ1JuCh4BLUn_chCl74BfAFl5Vtq1sEmaOFAjUc1XBLOkHtDKkJzykpXmRwsuwhLO0ClXMwIUsg2xEdm6MM9O1UqsvKyF15IK8rD1GKjnwLzy_Wy2ChFFr3iyqSCoWJnaSb3msj_ovEN_p2BqgbaQwYsifzg1r1_x9YKBYZml6PUGoRkc)

위와 같이 아주 잘 나옵니다.

그러면 routes 폴더 밑에 있는 home.tsx 파일에 Cloudflare D1 DB 관련 코드를 넣어 작동되는지 테스트해 보겠습니다.

---

## D1 DB 코드 테스트하기

home.tsx 파일을 열어 loader 함수를 아래와 같이 추가하고 Home 컴포넌트도 아래와 같이 바꿉니다.

```ts
export async function loader({ context }: Route.LoaderArgs) {
  const db = context.cloudflare.env.DB;

  const results = await db.prepare("SELECT * from todos").run();

  return { results };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  console.log(loaderData);
  return (
    <>
      React Router V7 with Cloudflare D1 DB Test
      <br />
      <br />
      <pre>
        {loaderData?.results && JSON.stringify(loaderData.results, null, 2)}
      </pre>
    </>
  );
}
```

이제 개발서버를 돌려볼까요?

터미널상과 브라우저에 보이는 건 아래와 같이 나올 겁니다.

```sh
/react-router-cloudflare-pages-d1-test
> react-router dev

Re-optimizing dependencies because vite config has changed
  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
{
  results: {
    success: true,
    meta: {
      served_by: 'miniflare.db',
      duration: 0,
      changes: 0,
      last_row_id: 0,
      changed_db: false,
      size_after: 12288,
      rows_read: 1,
      rows_written: 0
    },
    results: []
  }
}
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEh4SNy5ko4I6CeJfQN826C9gMYH3XQlQD6mybpdKarmVT454uEHvozYntQN2ZzDYDRoN16B6WOBMtsBsqgilhT5RVsfM-veTJ3NOcnvpMOHst9kdrgWWJd7MffjUhlXQQWw5sINhMK7EH6MI5D7EVjI0R7eCoKGG4YwksK3D1MB-oRMsUtF0uc1KqwQ8MM)

아주 성공적으로 Cloudflare D1 DB를 React Router의 loader 함수에서 읽어오고 있습니다.


loader 함수의 context 객체를 이용해서 cloudflare에 접근하고 있습니다.

---

## Cloudflare 관련 타입 정보 추가하기

아래 그림을 보시면 Cloudflare 관련해서 타입스크립트가 제대로 이해하지 못하는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhsG438b5r_tAC5lyc_JrKt0xcwUAhYmy6tiAWyriLgNpCauytj_ttv0slRIfZvto-v97E4ZCVir3eV1szGp-33SheJP2yoGZk_AVgRJlMGVdu2Tccv0sMiXot-wLvAy6pXy4xNyNTky7MGhwHNrJWj_P31ZuMrVTeLQaHgnYcG338AEn0gHIHravLIUn8)

개발할 때 여간 신경쓰이는게 아닙니다.

이럴 때는 모듈을 선언하고 여러가지 부가적인 작업을 해줘야 하는데요.

먼저, wrangler를 이용해서 사용하는 서비스의 Env 인터페이스를 작성해야 합니다.

터미널 상에서 아래와 같이 입력하면 Env 인터페이스가 있는 `worker-configuration.d.ts` 파일이 생성됩니다.

```sh
✗ pnpx wrangler types

 ⛅️ wrangler 3.99.0
-------------------

Generating project types...

interface Env {
        DB: D1Database;
}
```

이 파일은 d.ts 파일이기 때문에 타입스크립트가 자동으로 읽게 됩니다.

이 파일을 잘 보시면 우리가 wrangler.toml 상에 설정한 D1 DB를 사용할 수 있게 환경 파일 Env 를 나타내준다고 볼 수 있는데요.

그러면 다른 환경변수도 사용해 보겠습니다.

wrangler.toml 파일에 아래와 같이 VARS 섹션을 추가해 봅시다.

```sh
name = "react-router-cloudflare-pages-d1-test"
compatibility_date = "2024-11-12"
pages_build_output_dir = "./build/client"

[[d1_databases]]
binding = "DB"
database_name = "mydb"
database_id = "5~~~~~~~~~~~~~~~~"

[vars]
MY_SECRET = "react_router_v7_is_cool"
```

이제 다시 'npx wrangler types` 명령어를 실행해 봅시다.

```sh
✗ pnpx wrangler types

 ⛅️ wrangler 3.99.0
-------------------

Generating project types...

interface Env {
        MY_SECRET: "react_router_v7_is_cool";
        DB: D1Database;
}
```

어떤가요?

wrangler.toml 파일의 내용을 보고 알아서 관련 환경변수를 제대로 작성해 줍니다.

자, 이제 React Router와 Cloudflare를 연결하는 파일을 작성해야 하는데요.

React Router 공식 홈페이지에서는 app 폴더 밑에 env.ts 파일을 아래와 같이 작성하는 걸 추천합니다.

app 폴더 밑에 env.ts 파일을 만들어 봅시다.

```ts
import { type PlatformProxy } from "wrangler";

type Cloudflare = Omit<PlatformProxy<Env>, "dispose">;

declare module "react-router" {
  interface AppLoadContext {
    cloudflare: Cloudflare;
  }
}

export {}; // necessary for TS to treat this as a module
```

위와 같이 "react-router" 모듈을 선언하면 AppLoadContext를 이용할 수 있습니다.

이제 다시 home.tsx 파일로 들어가 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEjD5U75Sc3HrElem9qsLXzPxFE5TL5swmIwIAcCK1t0pMnminnMpV_pf6-96MsYk3p1B87wAhDdjpTnBwqFdF_WPjwXhv-CPfpo_1IubTtgUMOp520mXF4dO5ux3WByHv0JfkizDVEXcmQSXC-fgrf5XqENR2ch_4nGeXpWZsPeTt0rrRfxJLRASCJt8ak=w320-h47)

![](https://blogger.googleusercontent.com/img/a/AVvXsEhTEBrTolXCcUn6d277DVYtERl8SyLP_WIOlOghwYmTEm8jJcJuDg0-XjSOLNsn40GL-hNqi8mOp7ga__7Zj5v_01-FZh6IdttnQC1KloTaoKm7jHDziHkTB8DI0rGQWX_rvrqm90lq0GiFRAFL-SrUlI275WLpeV7eXemLPerJgYariG3VzfRmNZYHAIs)

![](https://blogger.googleusercontent.com/img/a/AVvXsEgklSdLAN7Uow9IM5X6u_D37tNLNZS4tZqWvbGBIsc1eT5P74jBWLiH1kEWEmDXMSTYwchpQGJjba0tf6lyb6oYuAuWjAeImL2KkKCTYjdCboVzyaeP2Q9iNK9EA2tt2pRiQAM5tmdnwzhysRx0e9PZrYasPGG11PnA3VuXoqaZeUGKeHzhmIZQCuxNJ8M)

위 그림과 같이 완벽하게 Cloudflare 관련 타입 정보를 얻고 있습니다.

심지어 마지막에 보시면 MY_SECRET 같은 로컬 변수에도 접근할 수 가 있습니다.

---

## package.json 파일 scripts 손보기

자, 지금까지 완벽하게 React Router와 Cloudflare 간의 타입 정보까지 구현했는데요.

이제 개발 서버를 쉽게 돌리기 위한 package.json 파일의 scripts 부분을 손보겠습니다.

Remix 프레임웍에서 일부 가져온겁니다.

```sh
  "scripts": {
    "build": "cross-env NODE_ENV=production react-router build",
    "dev": "react-router dev",
    "start": "cross-env NODE_ENV=production react-router-serve ./build/server/index.js",
    "typecheck": "react-router typegen && tsc",
    "deploy": "npm run build && wrangler pages deploy",
    "typegen": "wrangler types"
  },
```

위와 같이 deploy와 typegen 항목 두 개만 추가했습니다.

이렇게 하면 이제 완벽한 개발서버를 환경을 구축한겁니다.

실제 배포해 볼까요?

```sh
✗ pnpm run deploy

> react-router-cloudflare-pages-d1-test@ deploy /Users/cpro95/Codings/Javascript/react-router-test/react-router-cloudflare-pages-d1-test
> npm run build && wrangler pages deploy


> build
> cross-env NODE_ENV=production react-router build

vite v5.4.11 building for production...
✓ 48 modules transformed.
build/client/.vite/manifest.json                  1.68 kB │ gzip:  0.43 kB
build/client/assets/logo-dark-pX2395Y0.svg        6.10 kB │ gzip:  2.40 kB
build/client/assets/logo-light-CVbx2LBR.svg       6.13 kB │ gzip:  2.41 kB
build/client/assets/app-Ckulty-W.css              7.33 kB │ gzip:  2.13 kB
build/client/assets/with-props-BJdOiEPt.js        0.35 kB │ gzip:  0.21 kB
build/client/assets/home-B8OacU6i.js              0.49 kB │ gzip:  0.35 kB
build/client/assets/root-CzEkcZd-.js              1.19 kB │ gzip:  0.67 kB
build/client/assets/chunk-K6AXKMTT-DycbfBQN.js  105.32 kB │ gzip: 35.59 kB
build/client/assets/entry.client-u-M4TmH-.js    178.81 kB │ gzip: 56.77 kB
✓ built in 707ms
vite v5.4.11 building SSR bundle for production...
✓ 11 modules transformed.
build/server/.vite/manifest.json             0.74 kB
build/server/assets/logo-dark-pX2395Y0.svg   6.10 kB
build/server/assets/logo-light-CVbx2LBR.svg  6.13 kB
build/server/assets/app-Ckulty-W.css         7.33 kB
build/server/index.js                        6.25 kB
✓ built in 47ms
✔ The project you specified does not exist: "react-router-cloudflare-pages-d1-test". Would you like to create it? › Create a new project
✔ Enter the production branch name: … main
✨ Successfully created the 'react-router-cloudflare-pages-d1-test' project.
▲ [WARNING] Warning: Your working directory is a git repo and has uncommitted changes

  To silence this warning, pass in --commit-dirty=true


✨ Compiled Worker successfully
✨ Success! Uploaded 10 files (1.90 sec)

✨ Uploading Functions bundle
🌎 Deploying...
✨ Deployment complete! Take a peek over at https://c2b0d507.react-router-cloudflare-pages-d1-test.pages.dev
```

위와 같이 처음 실행하면 Cloudflare Pages 관련 Create a new project 문구가 나오면서 홀딩되는데 엔터키 두 번 치면 실행됩니다.

branch_name은 기본적으로 main으로 설정하면 됩니다.

이제 웹상에서 살펴볼까요?

실제로 웹상에 구현되려면 시간이 조금 걸리니까 브라우저에서 새로고침을 몇 번 해보면 됩니다.

아래 그림과 같이 나올 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjUJCp61Bu-60kOl5DQ7GfSzNwgCyuVIWFkcxZRjqXRTCspYVyYZVYqSUtF8e9gEI0CKkjytZd9HakS1-iYcrHYLPxByk3R0ccnaHgQTBqPIuAXTphD0U_VBaNoemSHeAfdaYTyCb2CW4vHkxpTKiPJG-d-IQPWP4Uw0pzm7KGZO7R9H7KjF7wrDaGCaUk)

아주 잘 나오네요.

웹상에서도 D1 DB에 성공적으로 접근하고 있네요.

대성공입니다.

그럼 앞으로 React Router V7을 이용해서 Cloudflare의 각종 서비스를 마음껏 공짜로 이용하시기 바랍니다.

끝.

