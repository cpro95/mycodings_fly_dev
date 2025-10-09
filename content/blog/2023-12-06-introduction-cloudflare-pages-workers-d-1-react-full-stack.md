---
slug: 2023-12-06-introduction-cloudflare-pages-workers-d-1-react-full-stack
title: 풀스택 강의 1편. Cloudflare Pages + Workers + D1 + React로 풀스택 개발하기
date: 2023-12-06 11:55:18.958000+00:00
summary: Cloudflare 무료 서비스로 풀스택 웹 앱 만들기
tags: ["cloudflare", "pages", "d1", "workers", "react"]
contributors: []
draft: false
---

안녕하세요?

오늘은 지금까지 미뤄왔던 Cloudflare 서비스를 이용한 풀스택 개발하기에 대해 알아보겠습니다.

Cloudflare는 아마존 AWS에 맞먹는 클라우드 서비스를 제공해 주는데요.

몇몇 기능들은 아직 베타 단계이지만 저도 지금 잘 쓰고 있는 Pages를 비롯해서 몇몇 서비스들을 공짜로 사용할 수 있습니다.

오늘 우리가 살펴볼 Cloudflare의 서비스는 웹 페이지 호스팅을 위한 Pages란 서비스와 함께, 백엔드를 위한 Workers와 함께 DB 구현을 위한 D1 서비스를 사용할 겁니다.

그리고 프론트엔드는 당연히 React가 되겠죠.

일단 Cloudflare 계정이 있다고 가정하고 진행하겠습니다.

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

1. [Vite로 React 템플릿 작성](#1-vite로-react-템플릿-작성)

2. [Pages에 정적 사이트로 올리기](#2-pages에-정적-사이트로-올리기)

3. [Workers 이용하여 백엔드 로직 구현하기](#3-workers-이용하여-백엔드-로직-구현하기)

4. [D1 데이터베이스 사용하기](#4-d1-데이터베이스-사용하기)
---

## 1. Vite로 React 템플릿 작성

Cloudflare는 wrangler라는 커맨드라인 명령어를 지원하는데요.

이 앱은 조금 더 범용이라, 우리가 오늘 구현할 React 앱 구현에 있어 아주 불편합니다.

그래서 처음부터 Vite로 React 앱을 작성한 다음 하나하나 추가하면서 Cloudflare의 Pages와 Workers 및 D1 서비스를 이용하도록 하겠습니다.

```bash
➜  blog> npm create vite@latest
✔ Project name: … cloudflare-pages-d1-stack-example
✔ Select a framework: › React
✔ Select a variant: › TypeScript

Scaffolding project in /Users/cpro95/Codings/Javascript/blog/cloudflare-pages-d1-stack-example...

Done. Now run:

  cd cloudflare-pages-d1-stack-example
  npm install
  npm run dev
```

CSS를 위한 TailwindCSS 설치도 이어서 하겠습니다.

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

그리고 tailwind.config.js 파일도 아래와 같이 바꾸시면 됩니다.

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

그리고 Tailwind 디렉티브를 index.css 파일에 추가하면 됩니다.

```js
@tailwind base;
@tailwind components;
@tailwind utilities;
```

이제 모든 준비가 끝났는데요.

---

## 2. Pages에 정적 사이트로 올리기

Cloudflare Pages는 무료 정적 사이트 호스팅 서비스인데요.

도메인은 ***.pages.dev 라는 이름입니다.

제가 예전에 만들었던 [mylotto.pages.dev](https://mylotto.pages.dev)라는 사이트가 있는데요.

이 사이트는 Next.js를 이용한 정적사이트입니다.

단순하게 Github 연동 후에 git push만 하면 Cloudflare가 알아서 빌드 후 Pages에 올려주죠.

Cloudflare가 제안하는 방법은 Github을 이용한 방식인데요.

저는 커맨드라인 명령어인 wrangler를 사용해서 Pages 앱 만들기, 그리고 배포(deploy)까지 해 보겠습니다.

그럼 wrangler 명령어를 설치해야 하는데요.

npm으로 글로벌하게 설치하는 방법도 있고, 해당 앱에 로컬로 설치하는 방법도 있습니다.

최근 추세인 로컬에 wrangler 앱을 설치하겠습니다.

```bash
npm install -D wrangler

➜  cloudflare-pages-d1-stack-example> npx wrangler
wrangler

Commands:
  wrangler docs [command..]            📚 Open wrangler's docs in your browser
  wrangler init [name]                 📥 Initialize a basic Worker project, including a wrangler.toml file
  wrangler generate [name] [template]  ✨ Generate a new Worker project from an existing Worker template. See https://github.com/cloudflare/templates
  wrangler dev [script]                👂 Start a local server for developing your worker
  wrangler deploy [script]             🆙 Deploy your Worker to Cloudflare.  [aliases: publish]
  wrangler delete [script]             🗑  Delete your Worker from Cloudflare.
  wrangler tail [worker]               🦚 Starts a log tailing session for a published Worker.
  wrangler secret                      🤫 Generate a secret that can be referenced in a Worker
  wrangler secret:bulk [json]          🗄️  Bulk upload secrets for a Worker
  wrangler kv:namespace                🗂️  Interact with your Workers KV Namespaces
  wrangler kv:key                      🔑 Individually manage Workers KV key-value pairs
  wrangler kv:bulk                     💪 Interact with multiple Workers KV key-value pairs at once
  wrangler pages                       ⚡️ Configure Cloudflare Pages
  wrangler queues                      🇶 Configure Workers Queues
  wrangler r2                          📦 Interact with an R2 store
  wrangler dispatch-namespace          📦 Interact with a dispatch namespace
  wrangler d1                          🗄  Interact with a D1 database
  wrangler hyperdrive                  🚀 Configure Hyperdrive databases
  wrangler ai                          🤖 Interact with AI models
  wrangler constellation               🤖 Interact with Constellation models
  wrangler vectorize                   🧮 Interact with Vectorize indexes
  wrangler pubsub                      📮 Interact and manage Pub/Sub Brokers
  wrangler mtls-certificate            🪪 Manage certificates used for mTLS connections
  wrangler login                       🔓 Login to Cloudflare
  wrangler logout                      🚪 Logout from Cloudflare
  wrangler whoami                      🕵️  Retrieve your user info and test your auth config
  wrangler types                       📝 Generate types from bindings & module rules in config
  wrangler deployments                 🚢 List and view details for deployments
  wrangler rollback [deployment-id]    🔙 Rollback a deployment

Flags:
  -j, --experimental-json-config  Experimental: Support wrangler.json  [boolean]
  -c, --config                    Path to .toml configuration file  [string]
  -e, --env                       Environment to use for operations and .env files  [string]
  -h, --help                      Show help  [boolean]
  -v, --version                   Show version number  [boolean]
➜  cloudflare-pages-d1-stack-example>
```

'npx wrangler'라고 치면 wrangler 명령어의 도움말이 나오는데요.

이 wrangler라는 커맨드라인 명령어가 Cloudflare의 모든 서비스를 CLI 상태에서 이용하게 해 줍니다.

그럼 지금 만들었던 React 앱에서 TailwindCSS는 초기화했고, App.tsx 파일만 조금 수정해 보겠습니다.

```js
// src/App.tsx

import "./App.css";

function App() {
  return (
    <>
      <div className="text-2xl font-bold flex justify-center items-center p-8">
        Welcome to React with Pages + Workers + D1 Example
      </div>
    </>
  );
}

export default App;
```

App.css 안에 있는 내용도 다 지우시면 됩니다.

"npm run dev" 명령어로 React 앱이 제대로 작동되는지 한 번 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEhTX6AsFVTjdeKC-zowdgVZbjiw5KQNhDP6MSeE5fsjucQqm1jt3fAGGlXU85Zhy6bywjwEfC_F4J5apF93Ih_1kWYTYIZgB_Iilo7UrhhZxeTY6lDW_DzF2vmcRKcEyl17dW9gJ0zt75Kzg9FOyJFviqanG1E8E8Pg9lVG57FT5v4MFhvKGd1aXVBP3aQ)

위와 같이 우리가 만든 앱이 제대로 나오고 있습니다.

이제 이걸 Cloudflare EDGE 서버에 올리는 게 다음 순서인데요.

Pages는 정적사이트 호스팅 서비스라고 했었잖아요.

그래서 우리 React 앱을 build 해야 합니다.

```bash
➜  cloudflare-pages-d1-stack-example> npm run build

> cloudflare-pages-d1-stack-example@0.0.0 build
> tsc && vite build

vite v5.0.6 building for production...
✓ 32 modules transformed.
dist/index.html                   0.46 kB │ gzip:  0.30 kB
dist/assets/index-sWUpnV8R.css    4.72 kB │ gzip:  1.47 kB
dist/assets/index-UJjASkPh.js   142.83 kB │ gzip: 45.90 kB
✓ built in 2.29s
➜  cloudflare-pages-d1-stack-example> tree --du -h ./dist
[146K]  ./dist
├── [144K]  assets
│   ├── [139K]  index-UJjASkPh.js
│   └── [4.6K]  index-sWUpnV8R.css
├── [ 464]  index.html
└── [1.5K]  vite.svg
```

dist 폴더에 빌드 된 리액트 앱이 생성됩니다.

총 146K 크기네요.

React가 용량이 있긴 있네요.

그런 면에서는 AstroJS가 정적 사이트에서는 최고인데요.

그래도 React의 JSX가 저는 훨씬 좋습니다.

SvelteJS나 VueJS도 잠깐 해봤는데요.

React의 JSX에 익숙해서인지 결국에는 다시 React로 돌아오게 되더군요.

AstroJS도 React를 렌더링 엔진으로 사용할 수 있어 최근에 AstroJS에도 빠졌었는데요.

AstroJS는 제 지난 강좌가 있으니 꼭 찾아보시기 바랍니다.

[AstroJS 강좌 1편](https://mycodings.fly.dev/blog/2023-10-07-astrojs-tutorial-how-to-handle-data-in-astrojs)

이제 Cloudflare에 dist란 폴더를 올리면 됩니다.

먼저, Cloudflare에 로그인해야 하는데요.

```bash
➜  cloudflare-pages-d1-stack-example> npx wrangler login
 ⛅️ wrangler 3.19.0
-------------------
Attempting to login via OAuth...
Opening a link in your default browser: https://dash.cloudflare.com/oauth2/auth?response_type=code&client_id=54d11594-84e4-41aa-b438-e81b8fa78ee7&redirect_uri=http%3A%2F%2Flocalhost%3A8976%2Foauth%2Fcallback&scope=account%3Aread%20user%3Aread%20workers%3Awrite%20workers_kv%3Awrite%20workers_routes%3Awrite%20workers_scripts%3Awrite%20workers_tail%3Aread%20d1%3Awrite%20pages%3Awrite%20zone%3Aread%20ssl_certs%3Awrite%20constellation%3Awrite%20ai%3Aread%20offline_access&state=uVwuHca-XoL3XUs0vvn-t94Rfc4Ivtab&code_challenge=Of_FujfUjvsu6R0jICrg1ue7f-mMV8lCQ6o&code_challenge_method=S256
Successfully logged in.
➜  cloudflare-pages-d1-stack-example
```

아마 브라우저가 뜨면서 로그인하라고 하고 권한을 달라고 할 겁니다.

권한을 주면 위와 같이 터미널상에서 본격적인 wrangler 명령어를 사용할 수 있게 됩니다.

```bash
➜  cloudflare-pages-d1-stack-example> npx wrangler pages deploy ./dist
No project selected. Would you like to create one or use an existing project?
❯ Create a new project
  Use an existing project
✔ Enter the name of your new project: … pages-d1-fullstack-example
✔ Enter the production branch name: … production
✨ Successfully created the 'pages-d1-fullstack-example' project.
🌎  Uploading... (4/4)

✨ Success! Uploaded 4 files (1.52 sec)

✨ Deployment complete! Take a peek over at https://eaa75f17.pages-d1-fullstack-example.pages.dev
➜  cloudflare-pages-d1-stack-example>
```

위와 같이 wrangler 명령어 중에 pages 항목에서 바로 deploy 명령어를 사용했습니다.

끝에는 업로드하고 싶은 폴더, 즉 우리는 React 앱이 컴파일된 'dist' 폴더를 통채로 올리는 거죠.

위와 같이 명령어를 사용하면 두 가지를 물어보는데요.

현재 폴더를 업로드하는 거라 "Create a new project" 부분을 누른 다음 원하는 이름을 적으시면 됩니다.

그리고 'github branch name'을 물으면 그냥 엔터 치면 자동으로 production이라고 설정됩니다.

이제 위와 같이 'Uploaded'라는 문구와 함께 최종적으로 홈페이지가 만들어졌다고 나옵니다.

한 번 그 주소를 클릭해서 브라우저에서 보시기 바랍니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjQioRBExfyueaN-1bNQgreDbs1F6ZuSTw8nM8V2W-cBDEO-0d49r6wFl9_A-aIUVERdEJt2hhcx9jCjaHUn7OhnX1dNH6Y2uCm22Fho83tWzYBFRi1l7o6d01cEMbNRvxZfcncqqcA8DOCnWSmYkCTqE7IaPhQVA2S4Z_FUj5iQUSzeRvBJUczCXzVUWk)

위와 같이 브라우저에서도 잘 나옵니다.

실제 Cloudflare 대시보드에 가보면 아래와 같이 나오는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjbZIhX62Jorg8ZVx6jYc8TTWyiSGx5NpmDmfMwXTGY2wxTIuYvzUZYsT4GBaf-KNG9BgBnkRHQfsxUk97ipAlm3S8uV050W7sPha9twr-n5TTpi0JkyqT7-_NDg8r3e4eCmlg8P4wrHQd6ARoiVpCoM8po4dfb2-Qali6eMtDtapRhTn6fpyypMFA0s9Y)

위와 같이 아까 우리가 입력했던 project 이름이 그대로 나옵니다.

그리고 주소도 터미널 창에 있던 주소와 사뭇 다른데요.

대시보드에 있는 게 정식 주소고 터미널 창에 있는 거는 개발용 임시 서버입니다.

그리고 아래 그림과 같이 빌드 시점까지 다 나오고 있습니다.

대시보드에서는 Settings 부분을 선택해서 여러 가지 설정을 할 수 있는데요.

그건 나중에 알아보겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEi3rU0DGRGShLMo-7-AzDPoezkTdDUKxKd_F3s6YXbKhWENB33Xqv5W4DgP4TibriI50KK9UkhkbyF3Xl9ox_BKQZIhKs2WMT3zwgIWlyD1d6xY4JASuQVYodbDSAINItlVBr8DAA838k2z0OnODrivXRQeIh2iZ5g87cmRpNB4QwADcZ49uW9A7HdI5mo)

참고로, 제가 `npx wrangler init` 명령어를 사용하지 않았는데요.

`npx wrangler init` 명령어는 바로 Cloudflare 앱을 만드는 명령어입니다.

빈 디렉토리에서 한 번 해보십시오.

React 구성이 예전 create-react-app을 사용하고 있어 너무 느립니다.

그래서 제가 사용하는 방식은 Vite를 이용한 React 앱 구성 후 Cloudflare 서비스를 연결하는 겁니다.

일단 정적 사이트 호스팅이 완료되었네요.

---

## 3. Workers 이용하여 백엔드 로직 구현하기

Cloudflare Workers는 서버리스 함수인데요.

Vercel, Netlify에도 있는 그 서버리스 함수입니다.

간단한 로직으로 백엔드 로직을 구현할 수 있는데요.

Cloudflare는 Workers를 따로 제공해 주는데요.

보통 자기 계정 이름과 함께 Workers 앱이 구현됩니다.

그래서 저 같은 경우 cpro95.workers.dev라는 서브 도메인이 있습니다.

그래서 workers를 새로 만들면 xxx.cpro95.workers.dev라는 주소가 되는 거죠.

물론 계정 이름 말고 다른 걸로 서브 도메인 이름을 정할 수 있습니다.

자기만의 workers를 만들어 놓으면 자신만의 API를 구현할 수 있는 장점이 있고,

심지어, workers를 이용하여 직접 서버사이드 렌더링되는 홈페이지까지 구현할 수 있습니다.

이 부분은 다음에 다뤄보기로 하고, 오늘은 Workers를 Pages 내에서 사용하는 방법에 대해 알아보겠습니다.

참고로 Cloudflare는 정책적으로 workers를 향후 Pages 안에서 구현하도록 권장하고 있습니다.

Workers 구현을 Pages에서 하려면 프로젝트 최상단에 functions라는 폴더를 만들고 그 밑에 js 파일을 만들면 됩니다.

참고로 js 파일이름은 그대로 하나의 라우팅 주소가 되기 때문에 적당한 이름을 사용하시면 됩니다.

보통 API를 구현하는 거기 때문에 functions/api 폴더를 많이 만들죠.

이제 여기에 hello.js라는 파일을 만들어 보겠습니다.

```js
// functions/api/hello.js

export function onRequest(ctx) {
  return new Response("Hello World!");
}
```

workers 함수는 위와 같이 onRequest 함수를 구현해야 하며 해당 함수는 Response를 리턴해야 합니다.

그리고 onRequest 함수는 ctx라는 Context라는 객체를 제공하는데요.

이 ctx라는 객체로 여러 가지 일을 할 수 있습니다.

일단 위와 같이 하고 저장합시다.

그리고 다시 npm run build 안 하고 그냥 바로 deploy만 해 보겠습니다.

```bash
➜  cloudflare-pages-d1-stack-example> npx wrangler pages deploy ./dist
✨ Compiled Worker successfully
🌍  Uploading... (4/4)

✨ Success! Uploaded 0 files (4 already uploaded) (0.51 sec)

✨ Uploading Functions bundle
✨ Deployment complete! Take a peek over at https://08bfc080.pages-d1-fullstack-example.pages.dev
➜  cloudflare-pages-d1-stack-example>
```

아까와 다른 점은 wrangler 명령어가 알아서 Worker 부분을 알아채고 Worker 로직도 함께 Cloudflare Pages에 올려 줍니다.

이제 우리가 만든 Workers가 제대로 작동하는지 보기 위해 아래와 같은 주소로 이동해 봅시다.

우리가 만든 hello.js 파일에 따라 주소는 "api/hello"가 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEinJLTFd-TDEdPYkPGE2tvqfNCmiI6LrStCzGXUejg-mZShyzY_OKSeOK5KwnWPb-Afhn1kWq-P1H7q9uhPaAdE32BUlQgAdDuWi1ET1y_CZeeRYCAqYyCc7ATLkB44dbDGHxLfrvREtdL-ltYk48pL6oTlAZernqgSFIwan4shDBY6CE7M1AP0sNcCvNI)

위 그림과 같이 Cloudflare 엣지 서버에 제가 만든 API가 올라갔습니다.

이제 백엔드 로직을 구현할 모든 준비가 끝났습니다.

잠깐, 여기서 계속 Cloudflare 엣지 서버에 정식으로 배포(deploy) 하지 말고 개발 서버를 돌려서 확인할 방법이 없을까요?

wrangler 명령어는 dev 키워드를 제공합니다.

해당 키워드가 그걸 지원해 주는데요.

```bash
➜  cloudflare-pages-d1-stack-example> npx wrangler pages dev ./dist
▲ [WARNING] No compatibility_date was specified. Using today's date: 2023-12-06.

  Pass it in your terminal:
  
  --compatibility-date=2023-12-06
  
  See https://developers.cloudflare.com/workers/platform/compatibility-dates/ for more information.


Compiling worker to "/Users/cpro95/Codings/Javascript/blog/cloudflare-pages-d1-stack-example/.wrangler/tmp/pages-9wdp2v/functionsWorker-0.4568567797378653.mjs"...
✨ Compiled Worker successfully
 ⛅️ wrangler 3.19.0
-------------------
▲ [WARNING] --local is no longer required and will be removed in a future version.

  `wrangler dev` now uses the local Cloudflare Workers runtime by default. 🎉


⎔ Starting local server...
[wrangler:inf] Ready on http://localhost:8788
[wrangler:inf] GET / 200 OK (44ms)
[wrangler:inf] GET /assets/index-UJjASkPh.js 200 OK (32ms)
[wrangler:inf] GET /assets/index-sWUpnV8R.css 200 OK (72ms)
[wrangler:inf] GET /api/hello 200 OK (3ms)
✨ Compiled Worker successfully
⎔ Reloading local server...
[wrangler:inf] GET /api/hello 200 OK (10ms)
╭─────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ [b] open a browser, [d] open Devtools, [c] clear console, [x] to exit                               │
╰─────────────────────────────────────────────────────────────────────────────────────────────────────╯
```

위와 같이 나오는데요. 여기서 'b' 키를 누르면 브라우저가 바로 뜹니다.

그래고 hello.js 파일의 내용을 고쳐볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEi-dJN4KccwAamWfwOZghENJw-6pdTkdjA_PeHdpQm53FyJl7Yh4kLeMYlEJ5h0sEtHVqc0Lt0J1uQLW94nzw5IqhsAyyLTfF_gbJdcxxgZQ8jfCF9BePE4veaVBScFW5TKteqxPeOEs2C0u_lld7wo5YitZSu7GTeLl1mb8KNWC47bPKBYGc95tRzzmSY)

위 그림과 같이 브라우저를 새로고침 하면 바로 반영됩니다.

어떤가요?

workers 부분에 대한 개발 서버 구축이 완료되었는데요.

그러면 React 부분의 Hot-Reloading 부분은 어떻게 할까요?

package.json 파일의 scripts 부분에 아래와 같이 만듭니다.

```json
  "scripts": {
    "dev:ui": "vite",
    "dev": "wrangler pages dev --compatibility-date=2023-12-06 -- npm run dev:ui",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
```

고친 거는 dev:ui 부분과 dev 부분입니다.

그리고 wranger 부분에 '--compatibility-date=2023-12-06' 이라는 옵션을 넣었는데요.

이 부분을 넣어줘야 호환성 부분을 정확히 제공할 수 있어 wrangler가 하라는 데로 넣으시면 됩니다.

간혹 날짜 부분이 예전 날짜가 나올 수 있으니까, wrangler가 지시하는 날짜를 넣으시면 됩니다.

이제, 'npm run dev'를 통해 React 부분의 핫 리로딩을 테스트해 보겠습니다.

```bash
MiniflareCoreError [ERR_RUNTIME_FAILURE]: The Workers runtime failed to start. There is likely additional logging output above.
    at #assembleAndUpdateConfig (/Users/cpro95/Codings/Javascript/blog/cloudflare-pages-d1-stack-example/node_modules/miniflare/dist/src/index.js:8889:13)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async Mutex.runWith (/Users/cpro95/Codings/Javascript/blog/cloudflare-pages-d1-stack-example/node_modules/miniflare/dist/src/index.js:3861:16) {
  code: 'ERR_RUNTIME_FAILURE',
  cause: undefined
}
```

개발 서버를 돌리면 위와 같이 MiniflareCoreError가 간혹 나오는데요.

이 경우는 wranger dev 명령어가 중복됐다는 의미가 거의 99%입니다.

다른 터미널에 개발 서버를 열어 놨거나, 아니면 'workerd' 라는 명령어가 백그라운드에서 제대로 kill 되지 않아서 일 겁니다.

```bash
killall workerd
```
위와 같이 터미널상에서 'workerd' 라는 worker demon을 모두 죽이면 됩니다.

윈도우 사용자라면 taskkill을 이용하시거나 백그라운드 프로세스를 찾아서 죽이시면 됩니다.

```bash
➜  cloudflare-pages-d1-stack-example> killall workerd
➜  cloudflare-pages-d1-stack-example> npm run dev

> cloudflare-pages-d1-stack-example@0.0.0 dev
> wrangler pages dev --compatibility-date=2023-12-06 -- npm run dev:ui

Running npm run dev\:ui...
Sleeping 5 seconds to allow proxy process to start before attempting to automatically determine port...
To skip, specify the proxy port with --proxy.
[proxy]:
> cloudflare-pages-d1-stack-example@0.0.0 dev:ui
> vite


[proxy]: Port 5173 is in use, trying another one...

[proxy]:
  VITE v5.0.6  ready in 367 ms


[proxy]:   ➜  Local:   http://localhost:5174/
  ➜  Network: use --host to expose

Automatically determined the proxy port to be 5174.
Compiling worker to "/Users/cpro95/Codings/Javascript/blog/cloudflare-pages-d1-stack-example/.wrangler/tmp/pages-zIsHrF/functionsWorker-0.18787902221672237.mjs"...
✨ Compiled Worker successfully
 ⛅️ wrangler 3.19.0
-------------------
▲ [WARNING] --local is no longer required and will be removed in a future version.

  `wrangler dev` now uses the local Cloudflare Workers runtime by default. 🎉


⎔ Starting local server...
[wrangler:inf] Ready on http://localhost:8788
[wrangler:inf] GET / 200 OK (106ms)
[wrangler:inf] GET /@vite/client 200 OK (541ms)
[wrangler:inf] GET /@react-refresh 304 Not Modified (401ms)
[wrangler:inf] GET /src/main.tsx 200 OK (576ms)
[wrangler:inf] GET /node_modules/vite/dist/client/env.mjs 304 Not Modified (351ms)
[wrangler:inf] GET /src/App.tsx 200 OK (337ms)
[wrangler:inf] GET /src/App.css 200 OK (55ms)
[wrangler:inf] GET /src/index.css 200 OK (417ms)
[wrangler:inf] GET / 101 Switching Protocols (60ms)
[wrangler:inf] GET /node_modules/.vite/deps/react.js 200 OK (480ms)
[wrangler:inf] GET /node_modules/.vite/deps/react_jsx-dev-runtime.js 200 OK (495ms)
[wrangler:inf] GET /node_modules/.vite/deps/react-dom_client.js 200 OK (541ms)
[wrangler:inf] GET /node_modules/.vite/deps/chunk-4YP5LC2O.js 200 OK (338ms)
╭─────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ [b] open a browser, [d] open Devtools, [c] clear console, [x] to exit                               │
╰─────────────────────────────────────────────────────────────────────────────────────────────────────╯
```

위와 같이 나오는데요.

저 같은 경우 기존 5173 포트가 누가 사용하고 있다고 나오는데요.

이건 Vite 버그 같습니다.

예전 dev 서버가 완전히 죽지 않는 버그인데요.

kill 명령어를 통해 죽여주면 됩니다.

이제, App.tsx 파일에서 일부 문구를 변경해 보세요.

그림으로 캡처를 안 했는데, 100% 제대로 작동하고 있는 걸 볼 수 있을 겁니다.

이제 개발 서버 구현은 모두 끝났네요.

---

## 4. D1 데이터베이스 사용하기

Cloudflare가 DB 서비스로 제공하는 D1이라는 서비스가 있는데요.

아직은 베타입니다.

그래도 사용은 할 정도로 꽤 안정화되었고, 무엇보다 빠르고 무료라는 점입니다.

5G까지 무료인데요.

Workers 무료 사용자라면 무조건 5G까지 무료입니다.

in, out 데이터 사용량 모두 사용했더라도 추가 요금을 부과하는 게 아니라 그냥 서비스가 정지되는 형태라 과금 걱정이 없습니다.

그리고 간단한 텍스트 저장으로는 5G 용량은 차고 넘치고요.

또 D1이 Sqlite 기반이라 너무 쉽습니다.

D1 DB 설정도 커맨드라인에서 wrangler 명령어를 사용해서 만들 겁니다.

```bash
➜  cloudflare-pages-d1-stack-example> npx wrangler d1
wrangler d1

🗄  Interact with a D1 database

Commands:
  wrangler d1 list                List D1 databases
  wrangler d1 info <name>         Get information about a D1 database, including the current database size and state.
  wrangler d1 create <name>       Create D1 database
  wrangler d1 delete <name>       Delete D1 database
  wrangler d1 backup              Interact with D1 Backups
  wrangler d1 execute <database>  Executed command or SQL file
  wrangler d1 time-travel         Use Time Travel to restore, fork or copy a database at a specific point-in-time.
  wrangler d1 migrations          Interact with D1 Migrations

Flags:
  -j, --experimental-json-config  Experimental: Support wrangler.json  [boolean]
  -c, --config                    Path to .toml configuration file  [string]
  -e, --env                       Environment to use for operations and .env files  [string]
  -h, --help                      Show help  [boolean]
  -v, --version                   Show version number  [boolean]

--------------------
🚧 D1 is currently in open beta
🚧 Please report any bugs to https://github.com/cloudflare/workers-sdk/issues/new/choose
--------------------
```

d1 서비스의 명령어 도움말 화면입니다.

당연히 create 명령어를 사용 해야겠네요.

```bash
➜  cloudflare-pages-d1-stack-example> npx wrangler d1 create pages-d1-stack
✅ Successfully created DB 'pages-d1-stack' in region APAC
Created your database using D1's new storage backend. The new storage backend is not yet recommended
for production workloads, but backs up your data via point-in-time restore.

[[d1_databases]]
binding = "DB" # i.e. available in your Worker on env.DB
database_name = "pages-d1-stack"
database_id = "2ddfdc8f4-9601-4ae2-aeaa-12adfasdf6d8820f"
```

위와 같이 create 명령어 뒤에 이름을 작성하면 위 그림과 같이 d1_database가 생성되고 해당 정보를 보여줍니다.

위 정보는 아주 중요한데요.

특히 database_id가 가장 중요합니다.

database_id는 대시보드의 D1 부분에 가도 아래 그림처럼 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhf4jC4FJhtajxkpHH-Pyx2Cr0bdYFaAWlF3SvfFL4lQEa_jjBy0HpDmeQi7LoG_xMF0qj_cZG90Ao_0PsiZkwV9Ao_wuVEDgsrwI0oYgt9TdSFqWat-cvM6ARIqvkvDgOm8fPMs0hWtOcpIfp2vn16ELqipPfVNJNax_qgpunw_3LIDRePfMOLJ2zNADk)

위 그림에서 방금 만든 pages-d1-stack 이름을 누르면 아래 그림처럼 나오는데요.

테이블이 없다고 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgSt4P9LhiE8gThxkKdEIA_1jIzkeOtqiAIwLKMUvWPZ7CjmJY-M_4Z_9tL3Ru7Xj0zLhcDe8e_rCHd_hFh1rhmCEhaHPHexVcag1LS8gT7obBo2v17w-FEgymQUxN3Daz_97GzSwty54x_8GxcggqDIWkHX53VdXs9w-2cUxsAuyZftaqdi5hzW1kyvrQ)

이제 테이블을 만들어야 하는데요.

대시보드에서 직접 만들 수도 있고, 터미널상에서 sql 파일을 이용해서 만들 수도 있습니다.

저는 후자의 방식을 권장합니다.

나중에 자동화되는 배포 명령어를 구현하기 쉽거든요.

sql 파일은 프로젝트 최상단 폴더에서 아무 이름으로 만들면 됩니다.

저는 "todos.sql"이라고 했습니다.

```bash
CREATE TABLE todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  desc TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT (datetime(CURRENT_TIMESTAMP,'localtime'))
);

INSERT INTO todos(title, desc) VALUES('test title','test desc');
```

위와 같이 테이블 이름이 todos이란 이름으로 SQL에서 테이블 만드는 SQL 구문인데요.

테스트를 위해 더미 데이터도 넣는 INSERT 명령어 구문도 추가했습니다.

이제 이 sql 명령어를 D1 데이터베이스가 읽고 실행하게 해야 하는데요.

이 부분도 wrangler 명령어가 제공해 줍니다.

```bash
➜  cloudflare-pages-d1-stack-example> npx wrangler d1 execute pages-d1-stack --file=./todos.sql
🌀 Mapping SQL input into an array of statements
🌀 Parsing 2 statements
🌀 Executing on remote database pages-d1-stack (2613c8f4-9601-4dd2-aeaa-126d5dd8820f):
🌀 To execute on your local development database, pass the --local flag to 'wrangler d1 execute'
🚣 Executed 2 commands in 0.7682ms

➜  cloudflare-pages-d1-stack-example>
```

위와 같이 npx wrangler d1 execute 명령어 뒤에 DB 네임을 적고 그다음 '--file' 옵션으로 아까 만든 todos.sql 파일을 지정해 주면 원격서버에서 해당 sql 문장을 실행하게 됩니다.

이제 Cloudflare 대시보드를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEjOqNSmreQlbuwDdXzVtWSVs6qSO04LPDF6SuCLtEAO38vD12K4k-2qf9nL2SrKwSZ3eDTaBiharnCHtsT1Bfy27QOWg4cHforQiXC1LK4YUYuNMz6w2KezaYnDDZn1fpK1CsANoFFQYAfXnJt7sNAddA_QdxGP4sy6mJvnH1E8OvkmfL6ALceiAA5EaiY)

![](https://blogger.googleusercontent.com/img/a/AVvXsEjDKDkC04vw0Simp8qm_ylBiDWIjXxWxaml5eYab9zEV40GMevHKckOtrwHJopDvJP0Sy0HeJsp9YPckG45eBx86Ko29zjZDY8o8HHL-KYUUJOkqjLzeAKMlU92_NobpUJgzQw6LO801MlxW_vUK7t5UAG-fNlukNsmJUtRbvjzXtnbBDg1irYwRfafcSI)

위의 두 그림처럼 대시보드에서 완벽하게 D1 데이터베이스를 관리할 수 UI를 제공합니다.

여기서 하나 더 팁이 있는데요.

wrangler 명령어로 터미널에서 엣지 서버의 D1 데이터베이스에 접속해서 SQL 문을 실행할 수 있습니다.

```bash
➜  cloudflare-pages-d1-stack-example> npx wrangler d1 execute pages-d1-stack --command="select * from todos;"
🌀 Mapping SQL input into an array of statements
🌀 Parsing 1 statements
🌀 Executing on remote database pages-d1-stack (2613c8f4-9601-4dd2-aeaa-126d5dd8820f):
🌀 To execute on your local development database, pass the --local flag to 'wrangler d1 execute'
🚣 Executed 1 commands in 0.2841ms
┌────┬────────────┬───────────┬─────────────────────┐
│ id │ title      │ desc      │ created_at          │
├────┼────────────┼───────────┼─────────────────────┤
│ 1  │ test title │ test desc │ 2023-12-06 13:19:56 │
└────┴────────────┴───────────┴─────────────────────┘

➜  cloudflare-pages-d1-stack-example>
```

현재 디렉토리가 길어서 명령어가 잘 안 보이는데요.

```bash
npx wrangler d1 execute pages-d1-stack --command="select * from todos;"
```

위와 같이 '--command' 명령어를 이용하면 됩니다.

이제, D1 데이터베이스를 사용하는 완벽한 방법을 숙지한 거 같네요.

그럼 2편에서 본격적인 D1 DB를 활용한 애플리케이션을 개발에 착수해 보겠습니다.

---

