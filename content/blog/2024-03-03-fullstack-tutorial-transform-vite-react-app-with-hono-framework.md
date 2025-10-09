---
slug: 2024-03-03-fullstack-tutorial-transform-vite-react-app-with-hono-framework
title: 풀스택 강의 7편. Vite React 템플릿을 Hono를 이용하여 풀스택 앱으로 개조하기
date: 2024-03-03 06:04:44.131000+00:00
summary: hono
tags: ["fullstack", "vite", "react", "hono"]
contributors: []
draft: false
---

안녕하세요?

풀스택 강의를 7편까지 하게 되었네요.

전체 강의 리스트입니다.

1. [풀스택 강의 1편. Cloudflare Pages + Workers + D1 + React로 풀스택 개발하기](https://mycodings.fly.dev/blog/2023-12-06-introduction-cloudflare-pages-workers-d-1-react-full-stack)

2. [풀스택 강의 2편. Cloudflare Pages 안에서 Workers를 이용한 D1 DB 제어하는 API 만들기](https://mycodings.fly.dev/blog/2023-12-09-fullstack-cloudflare-pages-workers-d-1-react-part-2)

3. [풀스택 강의 3편. AstroJS와 Cloudflare Pages, D1, Drizzle ORM으로 개발하기](https://mycodings.fly.dev/blog/2023-12-09-fullstack-astrojs-cloudflare-pages-d-1-drizzle-orm)

4. [풀스택 강의 4편. Remix + Cloudflare Pages + D1 DB + Drizzle ORM](https://mycodings.fly.dev/blog/2023-12-10-fullstack-remix-cloudflare-pages-d-1-db-drizzle-orm)

5. [풀스택 강의 5편. Next.js 서버 렌더링을 이용하여 Cloudflare Pages로 배포하기(D1 DB, Drizzle ORM)](https://mycodings.fly.dev/blog/2023-12-30-fullstack-tutorial-nextjs-cloudflare-with-d-1-db)

6. [풀스택 강의 6편. Remix로 Github 저장소를 DB로 이용해서 KV와 함께 Cloudflare에 배포하기](https://mycodings.fly.dev/blog/2024-02-25-fullstack-tutorial-remix-cloudflare-with-kv-and-github-server)

7. [풀스택 강의 7편. Vite React 템플릿을 Hono를 이용하여 풀스택 앱으로 개조하기](https://mycodings.fly.dev/blog/2024-03-03-fullstack-tutorial-transform-vite-react-app-with-hono-framework)

---

저는 Vite를 React 개발할 때 쓰는 모듈 핫 리로드 패키지로만 생각하고 있었는데요.

그런데 시간이 지나면서 Vite는 여러 프레임워크의 개발 서버도 지원하는 만능 툴로 발전하고 있었네요.

최근에는 Remix도 Vite로 빌드툴을 바꾸는 작업이 있더라구요.

그래서 오늘은 Vite와 함께 Hono라는 프레임워크를 섞어서 풀스택 개발을 한번 공부해 볼까 합니다.

Hono 프레임워크는 Express와 같은 종류인데요, 훨씬 최근에 나온 프레임워크입니다.

Hono는 최신 웹 API를 사용한 서버리스 방식의 디자인인데요.

Cloudflare에서 Hono를 강력하게 밀고 있습니다.

특히 Cloudflare의 Worker를 Hono로 직접 만들 수 있을 정도로 잘 통합되어있습니다.

그럼 본격적인 Vite + Hono 조합의 풀스택 개발로 들어가 보겠습니다.

** 목 차 **

- [템플릿 만들기](#템플릿-만들기)
- [프로젝트 구성 변경](#프로젝트-구성-변경)
- [풀스택으로의 변환](#풀스택으로의-변환)
- [Todo 앱으로 확장해 보기](#todo-앱으로-확장해-보기)
- [backend.ts 파일 설정하기](#backendts-파일-설정하기)
- [frontend.ts 파일 설정하기](#frontendts-파일-설정하기)
- [API 작성하기](#api-작성하기)
- [서버 파일 손보기](#서버-파일-손보기)
- [클라이언트 코드 작성하기](#클라이언트-코드-작성하기)

---

## 템플릿 만들기

```sh
npm create vite@latest vh-stack
cd vh-stack
npm install
npm run dev
```

당연히 React와 Typescript를 고르면 됩니다.

여기까지는 여타 Vite 개발 시작 부분과 같습니다.

이제 Hono를 Vite와 통합시켜 보겠습니다.

```sh
npm i cross-env hono @hono/node-server
npm i -D @types/node @hono/vite-dev-server
```

관련 패키지와 타입까지 설치해 줍니다.

이제, vite.config.ts 파일에 Hono 관련 플러그인을 수정해야 합니다.

아직까지 Vite에서 Hono를 지원하는 공식문서가 없는데요.

그래서 시행착오를 거쳐 아래와 같이 일부 티폴트 세팅을 바꿨습니다.

서버 포트도 4000으로 바꿨고, 그리고 outDir도 build라는 이름으로 변경했습니다.

outDir 폴더를 바꾼 이유는 다음에 설명드리겠습니다.

그리고 devServer 관련 세팅도 아래와 같이 해주시면 됩니다.

서버의 엔트리 파일은 "server.ts" 파일로 했습니다.

이 파일을 만들어야 겠네요.

```js
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import devServer from '@hono/vite-dev-server'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 4000, // 사용자 정의 포트로 변경
  },
  build: {
    outDir: "build", // "build"로 변경, 이후 설명
  },
  plugins: [
    react(),
    devServer({
      entry: "server.ts",
      exclude: [ // 기본 설정이 적합하지 않으므로 이 옵션을 재정의해야 합니다.
        /.*\.tsx?($|\?)/,
        /.*\.(s?css|less)($|\?)/,
        /.*\.(svg|png)($|\?)/,
        /^\/@.+$/,
        /^\/favicon\.ico$/,
        /^\/(public|assets|static)\/.+/,
        /^\/node_modules\/.*/
      ],
      injectClientScript: false, // 이 옵션에는 결함이 있으므로 비활성화하고 코드를 수동으로 삽입할 예정입니다.
    })
  ],
})
```

---

## 프로젝트 구성 변경

Hono는 백엔드 프레임워크입니다.

그래서 지금의 React 프로젝트 구조를 살짝 바꿔야 하는데요.

먼저, Hono를 실행시키는 server.ts 파일을 프로젝트의 최상단에 위치시키겠습니다.

```js
// server.ts

import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { readFile } from "node:fs/promises";

const isProd = process.env["NODE_ENV"] === "production";

let html = await readFile(isProd ? "build/index.html" : "index.html", "utf8");

if (!isProd) {
  // Vite 클라이언트 코드를 HTML에 주입
  html = html.replace(
    "<head>",
    `
    <script type="module">
        import RefreshRuntime from "/@react-refresh"
        RefreshRuntime.injectIntoGlobalHook(window)
        window.$RefreshReg$ = () => {}
        window.$RefreshSig$ = () => (type) => type
        window.__vite_plugin_react_preamble_installed__ = true
    </script>
    <script type="module" src="/@vite/client"></script>
    `
  );
}

const app = new Hono()
  .use("/assets/*", serveStatic({ root: isProd ? "build/" : "./" })) // 경로는 '/'로 끝나야 함
  .get("/*", (c) => c.html(html));

export default app;

if (isProd) {
  serve({ ...app, port: 4000 }, (info) => {
    console.log(`Listening on http://localhost:${info.port}`);
  });
}
```

이제 개발 서버를 실행해 보겠습니다.

```sh
npm run dev

> vh-stack@0.0.0 dev
> vite

Re-optimizing dependencies because lockfile has changed

  VITE v5.1.4  ready in 157 ms

  ➜  Local:   http://localhost:4000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

개발 서버 포트가 4000으로 바뀌었네요.

브라우저에서 열어보겠습니다.

그리고 HTML 코드를 보면 head 태그에 아래 그림과 같이 우리가 삽입한 Vite 클라이언트 코드가 잘 들어가 있네요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhsiSBenns0qyz4HjF7bvDc6MsXam1YQPsks6zsz__Fh8_watBUD4HLHlcctn5aRpOFlBmr1mZkL84vWVfpW1hwj0pOUMD-QAKDir1is2a2K4MuVs5wiPD0sv-OAiwWFjh0YqIFvorbKx5WhUrR3qiq5HSxX2V-7nID_KlQEZ-6cVBxkPSy9g8X9hmzRCY)

코드를 잘 보시면 isProd 일 경우, 즉 프로덕션 빌드일 경우 Hono의 node-server의 serve 명령어를 통해 서버를 작동시키고 있습니다.

개발 서버일 경우는 Vite의 dev-server가 작동하게 됩니다.

그리고 프로젝트의 구조를 다시 정의해야 하는데요.

몇 년 동안 여기저기 공부 좀 하다 보니 나름 다음과 같은 구조가 꽤 좋다고 어디서 본거 같습니다.

- **api**: API 게이트웨이 어플리케이션 파일을 저장하는 폴더로, TypeScript로 작성된 라우트 핸들러 또는 컨트롤러를 포함할 수 있습니다.
  
- **build**: 프론트엔드 빌드 파일을 저장하는 폴더로, 번들링 된 HTML, JS, CSS 파일이 여기에 저장됩니다.
  
- **components**: 재사용 가능한 프론트엔드 React 컴포넌트를 저장하는 폴더입니다.
  
- **dist**: 백엔드 컴파일된 JS 파일을 저장하는 폴더입니다.
  
- **models**: 모델 또는 스키마 파일을 저장하는 폴더입니다.
  
- **public**: 정적 및 공용 리소스를 저장하는 폴더입니다.
  
- **services**: 이 폴더는 필수는 아니지만, 많은 사람들이 비즈니스 로직을 서비스로 추상화합니다.
  
- **utils**: 유틸리티 함수를 저장하는 폴더입니다.
  
  - **utils/common.ts**: 백엔드와 프론트엔드 모두에 사용되는 유틸리티 함수를 저장합니다.
  
  - **utils/backend.ts**: 백엔드 전용 유틸리티 함수를 저장합니다.
  
  - **utils/frontend.tsx**: 프론트엔드 전용 유틸리티 함수를 저장합니다.
  
- **views**: UI 뷰를 저장하는 폴더로, tsx로 작성된 웹페이지가 여기에 저장됩니다.
  
- **server.ts**: 백엔드의 진입 파일입니다.
  
- **client.tsx**: 프론트엔드의 진입 파일입니다.
  
- **index.html**: 웹 어플리케이션을 호스팅하는 HTML 파일입니다.

따라서, 먼저 `src` 폴더를 `views`로 이름을 변경하겠습니다.

그리고 `views/main.tsx` 파일을 프로젝트 최상단으로 `client.tsx`라는 이름으로 이동 변경합니다.

즉 client.tsx 파일은 package.json 파일과 같은 곳에 있는 겁니다.

client.tsx 파일의 내용은 당연히 views 폴더를 기준으로 아래와 같이 바꿔야 합니다.

```js
import React from "react";
import ReactDOM from "react-dom/client";
import App from './views/App.tsx';
import "./views/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

지금은 `client.tsx`에 대해 자세히 알아보지는 않을 건데요.

다만 `index.html`에서 스크립트의 `src` 속성을 `client.tsx`로 업데이트하면 됩니다.

아래는 업데이트된 `index.html`의 내용입니다:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + Hono + React + TS</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/client.tsx"></script>
  </body>
</html>
```

바꾸는 김에 title 부분도 바꿨습니다.

개발 서버를 다시 시작하고 HTML 코드를 보시면 아래와 같이 타이틀 부분이 제대로 반영된게 보이실 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjVenGTdPEyrXBNrAQHWBygApkq-LsBF17yYDxoV5Iw3rY0nm7v0z5zFHddMFpWLlKMqguN1EAiAuf1slQUbLErg_kefWyd6FEv4Nd_HQn5McsPJ8-4HamRmpregv7PmWQE6m_jRCq7NKju0XA6lcY-XDW5C30lGo9AD-_F8iz4_jNi4TaAjl5jz159czk)

이로써 `index.html`에서 프론트엔드 진입 파일로 `client.tsx`를 사용하도록 설정되었네요.

개발 서버를 다시 돌려도 Vite + React 예제 파일은 잘 작동할 겁니다.

---

## 풀스택으로의 변환

Hono를 이용해서 조금 코드를 확장해서 테스트해 볼까요?

server.ts 파일에 아래와 같이 미들웨어를 추가해 보겠습니다.

```js
const app = new Hono()
  .use("/assets/*", serveStatic({ root: isProd ? "build/" : "./" })) // 경로는 '/'로 끝나야 함
  .use("*", async (c, next) => {
    c.res.headers.set("X-Powered-By", "Hono");
    await next();
  })
  .get("/*", (c) => c.html(html));

export default app;
```

위와 같이 미들웨어 부분을 중간 부분에 넣어야 합니다.

마지막에 보이는 get 메서드 전에 사용해야 하는 거죠.

코드를 보시면 headers 부분에 "X-Powered-By"와 "Hono"를 추가했는데요.

개발 서버를 다시 돌릴 필요도 없이 핫 리로드 되었기 때문에 크롬 개발창에서 확인해 보겠습니다.

네트워크 탭의 'localhost' 부분을 클릭해서 보시면 아래 그림과 같이 Response Headers 부분에 우리가 추가했던 문구가 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhYAL3NaaP6LNnzlNkC7l1cDAd7i02DlcSoep2M0LxMRY_aEP6RzaFOQtPCUocDl7Nub8Lwgs-5S84gtOttcqEUxo1tA5juHpHj3O3PW6VZvgBxJO65PTHyxi9-39fr_cUqLnmETVydyfew-medhMwuAV1bUyGKS0PRogLcA_3yrksun9nYGTO9I6hhw0s)

Hono를 이용한 풀스택 앱이 되어 가고 있네요.

이제 빌도 단계도 생각해 봐야 하는데요.

package.json 파일을 보시면 scripts 부분에 "build" 부분이 있습니다.

```json
    "build": "tsc && vite build",
```

즉, Vite에는 프론트엔드 애플리케이션을 구축하는 "build"라는 스크립트가 있지만 백엔드 애플리케이션을 구축하는 스크립트가 없습니다.

백엔드 Node.js 어플리케이션을 빌드하기 위해 Rollup을 사용하겠습니다.

직접 tsc 명령어를 사용하지 않는 이유는 아래와 같습니다.

tsc는 TypeScript를 지원하는 데 있어서 꽤 제한적인거 같습니다.

예를 들면 소스 파일에서 .ts 확장자를 사용할 수 없다거나, 또, tsconfig.json 파일을 변경해야하며, 이로 인해 프론트엔드 구성이 꼬이기 때문입니다.

제가 추구하는 프로젝트는 동일한 tsconfig.json을 사용하여 프론트엔드와 백엔드에 대한 의존성을 가지고 있기 때문에 오직 tsc만 사용하려고 하는 것은 위험할 수 있습니다.

그래서 Rollup을 사용할 겁니다.

이제 Vite가 생성한 tsconfig.json 파일을 조금 손 볼 건데요.

compilerOptions 부분에서 target을 ES2021로 바꾸고 그다음 include 부분도 손보고 마지막으로 references 부분은 없애고 exclude 부분을 추가하겠습니다.

최종적으로 아래와 같이 고치면 됩니다. 그냥 복사해서 붙이면 됩니다.

```js
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2021",
    "useDefineForClassFields": true,
    "lib": ["ES2021", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules/**"]
}
```

이제 개발 서버를 끕니다.

RollUp을 설치할 차례입니다.

```sh
npm i -D glob rollup @rollup/plugin-typescript @rollup/plugin-node-resolve @rollup/plugin-commonjs
```

이제 프로젝트 최상단 즉, package.json 파일과 같은 위치에 rollup.config.mjs 파일을 만듭니다.

```js
import { glob } from "glob"
import { extname, sep } from "node:path"
import { fileURLToPath } from "node:url"
import { builtinModules } from "node:module"
import typescript from "@rollup/plugin-typescript"
import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
export default {
  input: Object.fromEntries(
    glob.sync([
      "server.ts",
      "api/**/*.ts",
      "models/**/*.ts",
      "services/**/*.ts",
      "utils/**/*.ts",
    ], {
      ignore: [
        "**/*.d.ts",
        "**/*.test.ts",
      ]
    }).map(file => [
      file.slice(0, file.length - extname(file).length),
      fileURLToPath(new URL(file, import.meta.url))
    ])),
  output: {
    dir: "dist", // set to 'dist' as mentioned earlier
    format: "esm",
    sourcemap: true,
    preserveModules: true,
    preserveModulesRoot: ".",
  },
  external(id) {
    return id.includes(sep + 'node_modules' + sep)
  },
  plugins: [
    typescript({ moduleResolution: "bundler" }),
    resolve({ preferBuiltins: true }),
    commonjs({ ignoreDynamicRequires: true, ignore: builtinModules }),
  ]
}
```

RollUp 공식 홈페이지에서 조금 살펴보면 이해할 수 있는데요.

output 폴더를 맨 처음 얘기했듯이 'dist' 폴더로 지정했습니다.

그리고 glob 되는 부분이 바로 핫 리로드 같은 건데요.

api, models, servies, utils 등 아까 위에서 이상적인 프로젝트 구조라고 했던 그대로 구현해 놨습니다.

마지막으로 package.json 파일에서 build 부분을 수정하겠습니다.

```json
  "build": "tsc && vite build && rollup -c rollup.config.mjs",
```

이제 'npm run build'를 실행할 때마다 프론트엔드와 백엔드 모두 컴파일되게 됩니다.

그리고 마지막으로 'start' 라는 스크립트를 아래와 같이 추가합시다.

```json
  "start": "cross-env NODE_ENV=production node dist/server.js"
```

이제 'npm run build' 실행한 후에 'npm run start'라고 실행하면 됩니다.

한번 해보겠습니다.

```sh
npm run build

> vh-stack@0.0.0 build
> tsc && vite build && rollup -c rollup.config.mjs

vite v5.1.4 building for production...
✓ 34 modules transformed.
build/index.html                   0.47 kB │ gzip:  0.30 kB
build/assets/react-CHdo91hT.svg    4.13 kB │ gzip:  2.14 kB
build/assets/index-DiwrgTda.css    1.39 kB │ gzip:  0.72 kB
build/assets/index-MJNRYYyu.js   143.39 kB │ gzip: 46.10 kB
✓ built in 380ms

/Users/cpro95/Codings/Javascript/hono/vh-stack/server.ts → dist...
(!) Plugin typescript: @rollup/plugin-typescript TS5096: Option 'allowImportingTsExtensions' can only be used when either 'noEmit' or 'emitDeclarationOnly' is set.
created dist in 876ms
```

잘 실행되고 build 폴더와 dist 폴더가 생성되었습니다.

```sh
tree ./build -L 2
./build
├── assets
│   ├── index-DiwrgTda.css
│   ├── index-MJNRYYyu.js
│   └── react-CHdo91hT.svg
├── index.html
└── vite.svg

2 directories, 5 files
```

이 글의 중간부분에서도 얘기했듯이 build 폴더는 프런트엔드 부분입니다.

위 터미널 내용을 보시면 index.html 파일이 보이네요.

```sh
tree ./dist -L 2
./dist
├── server.js
└── server.js.map

1 directory, 2 files
```

그리고 dist 폴더는 백엔드 코드입니다.

위 터미널 내용을 보시면 server.js 파일이 보이네요.

아까 'start' 스크립트에 이 server.js 파일을 node 명령어로 실행하는 스크립트가 추가된 걸 기억하실 겁니다.

이제 'npm run start' 해 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEioCR7AdiLAVcyYySTFfNTRD5yvYAgPJH1Ab1Dz0H852J9xcEwBFI529qonqQn_mVupRhGyb2-fz1Gw7Wpz4P3p8OSTK2xnhLbCgDnm-n5h0NK1m5-ithiqM-J0aiweBuYRfWrm2kXH_80VE0fqFnqQ1UrxJYO8D1tfwyFztpqnnCtE4OBP67pshx4ZtYI)

위와 같이 개밡창 network 탭에서 보시면 깔끔하게 나옵니다.

그런데, 브라우저를 보시면 vite logo가 깨져서 나오는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEikilzW_6iWUUMWeLsWJTEywCde7xYTSSB0SwALlDwQYqEFS8jVfIrYktPOaLDXk0G0Q3R-ZjumoUYq_1oIcPdbZchG52CIkEf83Wi24LkGWiqfrYMnem0c7-yZDrigVo1dFA4wsB3lQoofM_5Wv56sRZO8dUnwUTyEgcIsszHsNre9216RfKyHXdzwDTY)

위와 같이 깨져서 나옵니다.

이게 왜 그렇냐면 Hono의 serveStatic 관련 구성에서 'assets' 폴더만이 static 서빙된다고 구성해 놔서 그렇습니다.

실제로 vite.svg 파일은 'assets' 폴더에 없고 build 폴더 바로 밑에 있습니다.

그러면 다시 server.ts 파일에서 아래와 같이 바꾸면 됩니다.

```js
const app = new Hono()
  .use("/*", serveStatic({ root: isProd ? "build/" : "./" }))
  .use("/assets/*", serveStatic({ root: isProd ? "build/" : "./" })) // 경로는 '/'로 끝나야 함
  .use("*", async (c, next) => {
    c.res.headers.set("X-Powered-By", "Hono");
    await next();
  })
  .get("/*", (c) => c.html(html));
```

위와 같이 "/*" 폴더도 static하게 서빙하게 바꾸면 됩니다.

이제 build 후 start 다시 해보면 아래 그림과 같이 vite log 이미지가 잘 보일겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhBh-jfa8iIZHvwb3W-3Gl2xDFlhLWhuavI_4zcvXNXC15EITzXUNMAm8_pycWJE3ujxQ3u8BV72UuqF999tawORqdNeTqn0BzDLN_BHYHgobzPMo8DJm4OuP2N4SEGtMLF4AVrUazNqneSRReAIguAk_aB-pBlbvO21x8fNo2joNJOD63NGQBOySdb60s)

---

## Todo 앱으로 확장해 보기

지금까지 뭘 만들었는지 모르겠는데요.

쉽게 설명해보면 React 앱을 만들었는데, 그걸 서빙하는 node 서버를 Hono 프레임워크로 만들었다는 겁니다.

즉, 클라이언트 렌더링 부분에서 React 코드가 적용되는 거죠.

백엔드는 단순하게 static 파일 서빙하는 게 전부입니다.

그럼 좀 더 복잡한 Todo 앱으로 확장해 볼까요?

Todo의 타입 점검을 위해 zod를 설치하겠습니다.

```sh
npm i zod
```

그리고 models 폴더를 만들고 Todo.ts 파일을 아래와 같이 만들겠습니다.

```js
//models/Todo.ts

import { z } from "zod";

const Todo = z.object({
  id: z.number().int(),
  title: z.string(),
});

type Todo = z.infer<typeof Todo>;

export default Todo;
```

zod를 이용하면 쉽게 Todo 타입을 구성할 수 있습니다.

그리고 Todo 앱을 위한 로직인 TodoService.ts 파일을 'services' 폴더에 위치시키겠습니다.

```js
// services/TodoService.ts

import Todo from "../models/Todo";

export default class TodoService {
  private idCounter = 0;
  private store: (Todo | null)[] = [];

  async list() {
    const list = this.store.filter((item) => item !== null) as Todo[];
    return await Promise.resolve(list); // simulate async, service method should always be async
  }

  async add(item: Omit<Todo, "id">) {
    const id = ++this.idCounter;
    const todo = { id, ...item };
    this.store.push(todo);
    return await Promise.resolve(todo);
  }

  async delete(query: Pick<Todo, "id">) {
    const index = this.store.findIndex((item) => item?.id === query.id);
    if (index === -1) {
      return false;
    } else {
      this.store[index] = null;
      return true;
    }
  }

  async update(query: Pick<Todo, "id">, data: Omit<Todo, "id">) {
    const todo = this.store.find((item) => item?.id === query.id);
    if (todo) {
      return Object.assign(todo, data);
    } else {
      throw new Error("todo not found");
    }
  }
}
```

TodoService 클래스가 보기 복잡한데요.

코드를 잘 보시면 그냥 메모리상에 Todo 리스트를 관리하는 겁니다.

---

## backend.ts 파일 설정하기

이제 TodoService를 사용해야 하는데요.

TodoService는 클래스입니다.

이걸 사용하는 방법은 싱글턴 패턴으로 유명한 useService 훅이 있는데요.

인터넷 찾으면 많이 나오는데요.

저는 어디서 구해 놓은게 있어 아래와 같이 utils 폴더 밑에 backend.ts 파일을 만들고 그 밑에 작성했습니다.

```js
// utils/backend.ts
// 싱글톤 서비스 생성을 위한 심볼 정의
const singleton = Symbol.for("singleton");

// 단일 서비스를 생성하는 일반적인 useService 함수 정의
export function useService<T>(
  ctor: (new () => T) & {
    [singleton]?: T;
  }
): T {
  // 서비스가 아직 생성되지 않았다면 새로운 서비스 인스턴스 생성
  if (!ctor[singleton]) {
    ctor[singleton] = new ctor();
  }

  // 서비스 인스턴스 반환
  return ctor[singleton];
}
```

---

## frontend.ts 파일 설정하기

백엔드 코드를 작성했으니 프론트엔드쪽 코드도 작성해야하는데요.

프론트엔드 쪽은 Hono의 API 와 관련된 걸 클라이언트에서 사용하게끔 해주는 걸 작성하면 됩니다.

```js
// Hono 클라이언트 라이브러리와 어플리케이션 타입 가져오기
import { hc } from "hono/client";
import type { AppType } from "../server";

// 백엔드 API에 접근하기 위한 Hono 클라이언트 인스턴스 생성
const { api } = hc<AppType>("/", {
  headers: {
    "Content-Type": "application/json",
  },
}) as { api: any }; // 실제로는 더 구체적인 타입을 지정해주는 것이 좋습니다.

// Hono 클라이언트 인스턴스 내보내기
export { api };
```

위와 같이 하는게 바로 Hono에서 클라이언트 쪽 api를 사용하는 방식인데요.

Hono를 공부하면 다들 이렇게 되어 있으니까 다음에 Hono 공부할 때 세심히 살펴보시는걸 추천드립니다.

---

## API 작성하기

이제 본격적인 API를 작성해야 하는데요.

api 폴더에 todo.ts 파일로 작성하겠습니다.

일단 hono와 zod를 연결시켜주는 validator를 설치해야 합니다.

```sh
npm i -D @hono/zod-validator
```

이제 본격적이 코드입니다.

```js
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { useService } from "../utils/backend";
import TodoService from "../services/TodoService";
import Todo from "../models/Todo";

// useService 함수를 사용하여 TodoService 인스턴스화
const todoService = useService(TodoService);

// 새로운 Hono 인스턴스 생성
const todo = new Hono();

// 모든 todo 항목을 가져오기 위한 GET 라우트 정의
todo.get("/list", async (c) => {
  // 서비스에서 todo 항목 리스트 가져오기
  const list = await todoService.list();

  // 리스트를 JSON 형식으로 반환
  return c.json({
    success: true,
    data: list,
  });
});

// 새로운 todo 항목을 추가하기 위한 POST 라우트 정의
todo.post("/", zValidator("json", Todo.omit({ id: true })), async (c) => {
  // 요청에서 todo 항목 데이터 가져오기
  const data = c.req.valid("json");

  console.log(data);

  // 서비스를 사용하여 새로운 todo 항목 추가
  const newTodo = await todoService.add(data);

  // 새로운 할 일 항목을 JSON 형식으로 반환
  return c.json({
    success: true,
    data: newTodo,
  });
});

// 기존 todo 항목을 업데이트하기 위한 PATCH 라우트 정의
todo.patch("/:id", zValidator("json", Todo.omit({ id: true })), async (c) => {
  // 요청 경로에서 todo 항목 ID 가져오기
  const id = Number(c.req.param("id"));

  // 요청에서 todo 항목 데이터 가져오기
  const data = c.req.valid("json");

  // 서비스를 사용하여 todo 항목 업데이트
  const updateTodo = await todoService.update({ id }, data);

  // 업데이트된 할 일 항목을 JSON 형식으로 반환
  return c.json({
    success: true,
    data: updateTodo,
  });
});

// 기존 todo 항목을 삭제하기 위한 DELETE 라우트 정의
todo.delete("/:id", async (c) => {
  // 요청 경로에서 todo 항목 ID 가져오기
  const id = Number(c.req.param("id"));

  // 서비스를 사용하여 todo 항목 삭제
  const success = await todoService.delete({ id });

  // 삭제 결과를 JSON 형식으로 반환
  return c.json({
    success,
    data: null,
  });
});

// todo 라우트 모듈 내보내기
export default todo;
```

Express로 작성하는 백엔드 코드랑 비슷합니다.

todo api를 완성했으니까 api 폴더에 index.ts 파일을 아래와 같이 작성합시다.

```js
// Hono 라이브러리 가져오기
import { Hono } from "hono";

// todo 라우트 모듈 가져오기
import todo from "./todo";

// 새로운 Hono 인스턴스 생성
const api = new Hono();

// todo 라우트를 API 라우트에 등록
api.route("/todo", todo);

// API 라우트 모듈 내보내기
export default api;
```

---

## 서버 파일 손보기

이제 우리가 만든 걸 본격적으로 server.ts 파일에 적용해 보겠습니다.

```js
// server.ts

import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { readFile } from "node:fs/promises";
import api from "./api";

const isProd = process.env["NODE_ENV"] === "production";

let html = await readFile(isProd ? "build/index.html" : "index.html", "utf8");

if (!isProd) {
  // Vite 클라이언트 코드를 HTML에 주입
  html = html.replace(
    "<head>",
    `
    <script type="module">
        import RefreshRuntime from "/@react-refresh"
        RefreshRuntime.injectIntoGlobalHook(window)
        window.$RefreshReg$ = () => {}
        window.$RefreshSig$ = () => (type) => type
        window.__vite_plugin_react_preamble_installed__ = true
    </script>
    <script type="module" src="/@vite/client"></script>
    `
  );
}

// 새로운 Hono 인스턴스 생성
const app = new Hono();

// 모든 요청에 X-Powered-By 헤더 추가
app.use("*", async (c, next) => {
  c.res.headers.set("X-Powered-By", "Hono");
  await next();
});

// API 라우트를 Hono 인스턴스에 등록
app.route("/api", api);

// 정적 파일 서비스를 Hono 인스턴스에 등록
app.use("/assets/*", serveStatic({ root: isProd ? "build/" : "./" }));

// 싱글 페이지 어플리케이션을 Hono 인스턴스에 등록
app.get("/*", c => c.html(html));

// Hono 인스턴스와 어플리케이션 타입 내보내기
export default app;
export type AppType = typeof app;

if (isProd) {
  serve({ ...app, port: 4000 }, (info) => {
    console.log(`Listening on http://localhost:${info.port}`);
  });
}
```

여기서 api 라우트를 추가한게 다입니다.

Hono는 백엔드 프레임워크입니다.

위와 같이 api 라우트를 추가했으면 개발 서버에서 직접 해당 경로로 이동하면 작동해야 하는데요.

주소는 다음과 같이 이해하시면 됩니다.

`server.ts` 파일에서 api 라우트를 등록했습니다.

그러면 주소는 `http://localhost:4000/api`가 되는거죠.

그런데 api 라우트는 다시 api 폴더의 index.ts 파일안에서 api 밑으로 todo 라우트를 추가시켰습니다.

그러면 다시 주소는 `http://localhost:4000/api/todo`가 되는거죠.

그리고 api 폴더 밑의 todo.ts 파일에서 보시면 GET 리퀘스트로 작동하는 거는 `list`밖에 없습니다.

그러면 최종적으로 `http://localhost:4000/api/todo/list` 주소가 우리가 원하는 주소가 되는거죠.

브라우저에서 한번 위 주소로 가보겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEilbxIye7xTkCmpJj03FdVIVeKsE71ZUZOa7_kfsVWvB9QwJeS_K6H7LwiCQrx_qiQpFbXbyQmkHPbqeI2LGnLPhp4C8hUOlybU9NhgNoY0u-wubDJ3gJBVlUx2nr1wnAyc0Tc3NMp_lWHOKMQdor-ZRI5LPZnGaVdGszrUpzw5k_t-LdA3VWDhN2_dRng)

위와 같이 Hono에 의한 백엔드 코드가 제대로 작동하고 있네요.

그리고 AppType을 export 했는데요.

클라이언트쪽에서 사용하기 위해서입니다.

---

## 클라이언트 코드 작성하기

이제 클라이언트 코드를 작성해야 하는데요.

클라이언트 메인 진입 파일은 client.tsx 파일이고 이 파일에서 App.tsx 파일을 불러오고 있습니다.

그러면 `views/App.tsx` 파일을 손보면 되겠네요.

```js
import { useEffect, useState } from "react";
import { api } from "../utils/frontend";
import Todo from "../models/Todo";

function App() {
  const [formData, setFormData] = useState({ title: "" });
  const [todoList, setTodoList] = useState([] as Todo[]);

  useEffect(() => {
    (async () => {
      const res = await api.todo.list.$get();
      const result = await res.json();
      console.log(result);

      if (result.success) {
        setTodoList(result.data);
      } else {
        setTodoList([]);
      }
    })();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    console.log(formData);

    const res = await api.todo.$post({ json: formData });
    const result = await res.json();
    console.log(result.data);

    if (result.success) {
      setTodoList([...todoList, result.data]);
      setFormData({ title: "" });
    } else {
      setTodoList([]);
    }
  };

  const handleChange = (e: any) => {
    // 폼 입력 값이 변경될 때마다 state 업데이트
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <h1>Todo List</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
        <button>추가</button>
      </form>
      {todoList.length !== 0 && (
        <ul>
          {todoList?.map((t) => (
            <li key={t.id}>{t.title}</li>
          ))}
        </ul>
      )}
    </>
  );
}

export default App;
```

위의 클라이언트 코드를 보시면 useEffect를 사용하여 클라이언트에서 하이드레이션이 완료되면 api를 불러들입니다.

즉, Hono가 백엔드 역할을 하면서 해당 JSON API 역할을 해주는 거죠.

이제 제대로 작동하는지 보겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEi8JSzQReoMNedbpSSc7mEKQWGQSDfJ0VtiJqeDt_NWYK_n6-0kG2vzlqoOAuXMKNRRK2vznsqI9paWOpTiPeGAheDDSI6oWlGYuS3VvuOuv1Exo9go5tWyaVMAKXNp1vlPD6f66Wbx4R3SBMiEFfVtA8o3KyjqO0tMZ6gpjzGnvHxQ87Z9sed64HdMFaw)

위와 같이 Todo 앱은 제대로 작동합니다.

---

지금까지 Vite를 이용한 React 코드를 개조해서 Hono를 적용한 풀스택 앱으로 개조해봤는데요.

이 앱은 Vite를 이용한 단순한 NODE 앱이기 때문에 NODE만 돌아가는 서버에서는 무조건 작동합니다.

그럼.

