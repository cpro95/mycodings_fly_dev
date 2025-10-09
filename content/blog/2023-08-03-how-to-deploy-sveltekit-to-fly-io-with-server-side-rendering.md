---
slug: 2023-08-03-how-to-deploy-sveltekit-to-fly-io-with-server-side-rendering
title: SvelteKit 실전 예제 - Fly.io에 배포(deploy)하기 with 서버 사이드 렌더링
date: 2023-08-03 12:54:46.707000+00:00
summary: SvelteKit 실전 예제 - Fly.io에 배포(deploy)하기 with 서버 사이드 렌더링
tags: ["fly.io", "sveltekit", "sveltejs", "ssr"]
contributors: []
draft: false
---

안녕하세요?

지난 시간에는 SvelteKit을 이용해서 마크다운 형식의 블로그를 만들어 보았는데요.

오늘은 SvelteKit 강좌보다는 SvelteKit의 Server Side Rendering일 경우 실제 어떻게 호스팅 하는지에 대해 알아보겠습니다.

---

## Fly.io

지금 글 쓰고 있는 이 블로그는 Fly.io에 호스팅 했는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjXiyTCU4volGBIivfpv-5BBfJFW_gCRQgSYat7fIeQTcLIgykeS2Vc0eurFq_zGpwTVlkeEmNPJe0CimWYeif0qyHoVDVC3c6TsgRofgVNtqcadWfSFWrrUOv0JKSGBVX8BcOfEpq4Bzzdj7AJqotF1TwDXjqMbONcEbCd7jdPp48rUCjg50keBtiUf74)

위 그림과 같이 Fly.io 대시보드에서 보시면 mycodings라는 프로젝트가 사용하는 클라우드 컴퓨터는 CPU가 "shared-cpu-1x"이고 메모리는 256MB짜리입니다.

실제 Fly.io에서 제공해 주는 Hobby Plan에 따라 $5 이하는 무료로 사용하고 있습니다.

실제, 제가 쓰는 가상머신 요금은 아래와 같은데요.

```bash
shared-cpu-1x	1 shared	256MB	$0.0000008/s ($1.94/mo)
```

아무리 많은 트래픽이 나와도 한 달에 $5를 넘길 수는 없을 거 같네요.

실제 Fly.io의 무료 요금제가 제공하는 혜택은 아래와 같습니다.

```bash
Up to 3 shared-cpu-1x 256mb VMs†
3GB persistent volume storage (total)
160GB outbound data transfer
```

Fly.io는 제 블로그 주소처럼 끝이 fly.dev로 끝나는 도메인을 제공해 주는데요.

전 세계 여러 곳에 Edge 서버를 제공해주고 있고, 실제 제 서버는 한국과 가장 가까운 일본 도쿄에 위치하고 있습니다.

Fly.io가 아직 한국 서버를 제공해 주지는 않고 있네요.

## Fly.io의 장점

Fly.io가 Netlify나 Vercel보다 좋은 점은 Docker를 이용한다는 점과 실제 데이터를 저장할 수 있는 HDD를 제공해 준다는 점입니다.

그래서 Node 서버(Express 서버)를 Docker 상에서 실행하면서 Prisma 같은 데이터베이스 ORM 패키지로 백그라운드에서 DB를 제어할 수 있습니다.

그리고 Github Action과 연동하면 Github에 Push만 해도 다시 Docker가 빌드되게 설정할 수 있어 유지 보수가 아주 쉽습니다.

그리고 실제 이 가상 서버에 SSH 방식으로 원격으로 로그인할 수 있는데요.

SSH 방식으로 로그인한 이 가상 서버는 실제 우분투 서버 버전이라 손쉽게 내가 원하는 방식으로 서버를 운영할 수 있습니다.

그러면, SvelteKit 예제 프로젝트를 하나 만들고 실제 Fly.io에 배포까지 해 보겠습니다.

---

## SvelteKit 예제 프로젝트도 멋지게

이왕 만드는 김에 서버 사이드 렌더링도 되게끔 서버 관련 코드도 작성해야 할 겸, 좀 더 어렵게 프로젝트를 만들어 보겠습니다.

바로, mymovies.fly.dev 사이트에서 구현한 TMDB 사이트의 Popular Movies 데이터를 화면에 뿌려주는 코드를 작성해 볼건데요.

TMDB 사이트에 가셔서 나만의 API_Key를 꼭 얻어 놓으셔야 다음 작업으로 진행이 가능하겠습니다.

빈 SvelteKit 프로젝트 만들기

```bash
➜  blog> npm create svelte@latest ./sveltekit-deploy-on-fly-io

create-svelte version 5.0.4

┌  Welcome to SvelteKit!
│
◇  Which Svelte app template?
│  Skeleton project
│
◇  Add type checking with TypeScript?
│  Yes, using TypeScript syntax
│
◇  Select additional options (use arrow keys/space bar)
│  Add ESLint for code linting
│
└  Your project is ready!

✔ Typescript
  Inside Svelte components, use <script lang="ts">

✔ ESLint
  https://github.com/sveltejs/eslint-plugin-svelte

Install community-maintained integrations:
  https://github.com/svelte-add/svelte-add

Next steps:
  1: cd sveltekit-deploy-on-fly-io
  2: npm install (or pnpm install, etc)
  3: git init && git add -A && git commit -m "Initial commit" (optional)
  4: npm run dev -- --open

To close the dev server, hit Ctrl-C

Stuck? Visit us at https://svelte.dev/chat
➜  blog> cd sveltekit-deploy-on-fly-io
➜  sveltekit-deploy-on-fly-io> npm i
```

위와 같이 만들어 주시고 "npm install" 까지 하면 됩니다.

### TailwindCSS 추가하기

CSS 부분은 역시 저의 최애 TailwindCSS를 설치하도록 하겠습니다.

```bash
➜  sveltekit-deploy-on-fly-io> npx svelte-add@latest tailwindcss
➕ Svelte Add (Version 2023.06.280.00)
The project directory you're giving to this command cannot be determined to be guaranteed fresh — maybe it is, maybe it isn't. If any issues arise after running this command, please try again, making sure you've run it on a freshly initialized SvelteKit or Vite–Svelte app template.

PostCSS
 ✅ successfully set up and repaired (it looks like it was in a broken setup before this command was run)!
Create or find an existing issue at https://github.com/svelte-add/svelte-add/issues if this is wrong.

Tailwind CSS
 ✅ successfully set up!
Create or find an existing issue at https://github.com/svelte-add/svelte-add/issues if this is wrong.

Run npm install to install new dependencies, and then reload your IDE before starting your app.
➜  sveltekit-deploy-on-fly-io> npm i

added 42 packages, changed 2 packages, and audited 263 packages in 5s

57 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
➜  sveltekit-deploy-on-fly-io> code .
```

TailwindCSS가 제대로 작동하는지 보기 위해 routes 폴더 밑에 +page.svelte 파일을 아래와 같이 바꿔봅시다.

```js
<h1 class="text-4xl font-bold">Welcome to SvelteKit</h1>
```

이제 개발 서버를 돌려볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEh3Hbwz4u1vt1Lef09Sg79PalsvKC5CNrB2cRBOeJlhAP3Uq0QGnfIEnRuWM5maScdMaVekk6ft3ZX3AwuPH7uMo7HGtWkwsGVUxYer90W9bYK_OZziUZ71HKioQTeTUUAa_k1JWZdp2JOMey_TjxZGVn3qjh5qVQ0R0EKazuSy-B0_Rak7Gvd_eBMqHlw)

일단 위와 같이 TailwindCSS가 잘 작동하네요.

## Adapter-Node 설치

우리가 SvelteKit을 Fly.io에 배포하는 거는 Fly.io 공식 문서에서 보면 Node 서버를 돌리는 걸로 나오는데요.

그래서 svelte.config.js 파일에서 adpater-node로 어댑터를 교체해 주면 됩니다.

```bash
➜  sveltekit-deploy-on-fly-io> npm i -D @sveltejs/adapter-node

added 17 packages, and audited 280 packages in 4s

60 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
➜  sveltekit-deploy-on-fly-io>
```

svelte.config.js 파일 첫 줄에 apdater-auto를 adapter-node로 바꿔 주면 됩니다.
```js
import adapter from "@sveltejs/adapter-node";
```

이제 SvelteKit의 준비는 끝났는데요.

---

## 실제 Fly.io에 배포해 보기

이제 실제 Fly.io에 배포해 볼까요?

Fly.io는 flyctl이라는 명령어를 지원해 주는데요.

MacOS에서는 아래와 같이 설치하시면 됩니다.

```bash
brew install flyctl
```

설치가 다 되면 Fly.io에 로그인해야 하는데요.

아래와 같이 터미널상에서 명령어를 입력하면 브라우저 창이 뜨면서 로그인하라고 나옵니다.

보통 Github ID와 연동시켜놔서 쉽게 로그인 할 수 있을겁니다.

```bash
➜  sveltekit-deploy-on-fly-io> flyctl auth login
Opening https://fly.io/app/auth/cli/ebbf52d3dcee200c3d571 ...

Waiting for session... Done
successfully logged in as cpro95@~~~~
➜  sveltekit-deploy-on-fly-io
```

이제 우리 프로젝트가 있는 폴더에서 아래와 같이 flyctl 명령어를 실행해 보겠습니다.

```bash
➜  sveltekit-deploy-on-fly-io> flyctl launch
Creating app in /Users/cpro95/Codings/Javascript/blog/sveltekit-deploy-on-fly-io
Scanning source code
Detected a NodeJS app
? Choose an app name (leave blank to generate one): my-svelteki-test2
automatically selected personal organization: cpro95
Some regions require a paid plan (bom, fra, maa).
See https://fly.io/plans to set up a plan.

? Choose a region for deployment: Tokyo, Japan (nrt)
App will use 'nrt' region as primary

Created app 'my-svelteki-test2' in organization 'personal'
Admin URL: https://fly.io/apps/my-svelteki-test2
Hostname: my-svelteki-test2.fly.dev
installing: npm install @flydotio/dockerfile@latest --save-dev

added 20 packages, and audited 300 packages in 12s

63 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
     create  Dockerfile
Wrote config file fly.toml
Validating /Users/cpro95/Codings/Javascript/blog/sveltekit-deploy-on-fly-io/fly.toml
Platform: machines
✓ Configuration is valid

If you need custom packages installed, or have problems with your deployment
build, you may need to edit the Dockerfile for app-specific changes. If you
need help, please post on https://community.fly.io.

Now: run 'fly deploy' to deploy your Node.js app.

➜  sveltekit-deploy-on-fly-io>
```

launch 명령어는 프로젝트 생성을 위해 제일 처음 실행하는 명령어입니다.

위에서 보시면 자동으로 NodeJS App 이라고 인식했고, 그리고 앱의 이름(app name)을 물어보는데요.

여기서 중요한 게 이름이 바로 fly.dev로 끝나는 주소의 첫 번째 도메인 이름이 됩니다.

fly.dev는 전 세계 여러 사람이 사용하고 있기 때문에 이름이 중복될 수 있는데요.

계속 실행해서 중복이 안 되는 나만의 이름을 찾으면 됩니다.

그리고 호스팅 위치를 고르라고 하는데요.

전 세계 여러 군데를 지원해 줍니다.

아직 서울 지역이 없기 때문에 도쿄를 고르면 한국과 가장 빠르게 연결될 겁니다.

그리고, 에러 없이 실행이 완료되면 fly.toml 파일과 Dockerfile이 작성됩니다.

한번 열어보시면 쉽게 이해할 수 있을 텐데요.

Docerfile을 열어보시면 아래와 같은데요.

여기서 고칠 게 하나 있습니다.

```bash
# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=16.20.1
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="Node.js"

# Node.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"


# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install -y build-essential pkg-config python

# Install node modules
COPY --link .npmrc package-lock.json package.json ./
RUN npm ci --include=dev

# Copy application code
COPY --link . .

# Build application
RUN npm run build

# Remove development dependencies
RUN npm prune --omit=dev


# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "node", "index.js" ]
```

제일 마지막에 있는 두 줄인데요.

우리가 호스팅 할 서버의 포트는 3000이란 뜻이고, 마지막으로 서버를 실행하라는 명령어인데요.

SvelteKit을 NodeJS 서버 방식으로 서버를 운영하려고 하면 단순하게 "node index.js"라고 실행하면 안 됩니다.

SvelteKit은 build 명령어를 통해 build 폴더에 생긴 SvelteKit 앱을 서버로 돌려야 하는데요.

package.json 파일의 scripts 부분에 명령어를 하나 추가하겠습니다.

```js
"scripts": {
    ...
    ...
    ...
    "lint": "eslint .",
    "start": "node build"
  },
```

start란 명령어를 추가했습니다.

이제, 실제 서버 구동을 "npm run start"라고 실행하면 됩니다.

그러면 Dockerfile의 제일 마지막 명령어를 아래와 같이 바꿔주시면 됩니다.

```bash
# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "npm", "run", "start" ]
```

여기서 주의할 점은 Dockerfile에서는 "npm start"만 넣으면 작동하지 않습니다.

꼭 npm 풀 실행 명령어인 "run"을 꼭 넣어줘야 하니까 주의 바랍니다.

이제 Dockerfile도 작성 완료했습니다.

npm run build후에 npm run preview로 실제 build된 앱을 테스트해 보시고 이제 Fly.io 서버에 배포해 보겠습니다.

## Deploy (배포하기)

```bash
➜  sveltekit-deploy-on-fly-io> npm run build

> sveltekit-deploy-on-fly-io@0.0.1 build
> vite build


vite v4.4.8 building SSR bundle for production...
✓ 73 modules transformed.

vite v4.4.8 building for production...
✓ 62 modules transformed.
.svelte-kit/output/client/_app/version.json                              0.03 kB │ gzip: 0.05 kB
.svelte-kit/output/client/vite-manifest.json                             2.36 kB │ gzip: 0.43 kB
.svelte-kit/output/client/_app/immutable/assets/0.bb78efc0.css           4.58 kB │ gzip: 1.43 kB
.svelte-kit/output/client/_app/immutable/nodes/2.8646070d.js             0.51 kB │ gzip: 0.36 kB
.svelte-kit/output/client/_app/immutable/nodes/0.22f34324.js             0.60 kB │ gzip: 0.38 kB
.svelte-kit/output/client/_app/immutable/nodes/1.31552206.js             1.03 kB │ gzip: 0.59 kB
.svelte-kit/output/client/_app/immutable/chunks/scheduler.e108d1fd.js    2.16 kB │ gzip: 1.02 kB
.svelte-kit/output/client/_app/immutable/chunks/singletons.cc504b42.js   2.85 kB │ gzip: 1.46 kB
.svelte-kit/output/client/_app/immutable/chunks/index.0719bd3d.js        5.44 kB │ gzip: 2.31 kB
.svelte-kit/output/client/_app/immutable/entry/app.59b91578.js           5.85 kB │ gzip: 2.32 kB
.svelte-kit/output/client/_app/immutable/entry/start.2056ce01.js        24.06 kB │ gzip: 9.54 kB
✓ built in 713ms
.svelte-kit/output/server/vite-manifest.json                           1.42 kB
.svelte-kit/output/server/_app/immutable/assets/_layout.bb78efc0.css   4.58 kB
.svelte-kit/output/server/internal.js                                  0.19 kB
.svelte-kit/output/server/entries/pages/_layout.svelte.js              0.25 kB
.svelte-kit/output/server/entries/pages/_page.svelte.js                0.28 kB
.svelte-kit/output/server/entries/fallbacks/error.svelte.js            0.89 kB
.svelte-kit/output/server/chunks/ssr.js                                3.35 kB
.svelte-kit/output/server/chunks/internal.js                           5.39 kB
.svelte-kit/output/server/index.js                                    89.05 kB

Run npm run preview to preview your production build locally.

> Using @sveltejs/adapter-node
  ✔ done
✓ built in 5.18s
➜  sveltekit-deploy-on-fly-io> npm run preview

> sveltekit-deploy-on-fly-io@0.0.1 preview
> vite preview


  ➜  Local:   http://127.0.0.1:4173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

"npm run preview"는  4173 프리뷰 개발 서버를 돌리는 건데요.

제대로 작동하는지 보고 최종적으로 deploy도 해도 되는지 판단하시면 됩니다.

### 배포 전에 Fly.io 대시보드 보기

![](https://blogger.googleusercontent.com/img/a/AVvXsEgH1I4ep5A3OhmYna0ki---g036U3y0Rce_vvkxd9drzWuN35R9vgiNWvoDX7J5Vk92DitjqHhTcOdneT_V8hcS7g00wxmJnPkYOME0hQHIe9eMUR4CN9XLss-TBbGisWYunsATiMBUPZL4SPCW3LXYRB3zj716xiUkGfcDXNmXzXlX0kPIsp82p-zdoVw)

실제 배포 전에 아까 우리가 launch 명령어만 작동시켰었는데요.

그러면 위와 같이 우리가 만든 앱 이름이 예약되면서 Fly.io 대시보드에 나오게 됩니다.

아직, 정식 배포가 한 번도 없었기 때문에 가상서버에 아무런 정보가 없네요.

### 배포하기

이제 Ctrl+C를 누른 다음 아래 명령어로 deploy 해볼까요?

```bash
➜  sveltekit-deploy-on-fly-io> fly deploy
==> Verifying app config
Validating /Users/cpro95/Codings/Javascript/blog/sveltekit-deploy-on-fly-io/fly.toml
Platform: machines
✓ Configuration is valid
--> Verified app config
==> Building image
Remote builder fly-builder-dark-shape-9440 ready
==> Building image with Docker
--> docker host: 20.10.12 linux x86_64
[+] Building 12.9s (18/18) FINISHED
 => [internal] load build definition from Dockerfile       1.2s
 => => transferring dockerfile: 954B                       1.2s
 => [internal] load .dockerignore                                                                              0.9s
 => => transferring context: 35B                           0.9s
 => resolve image config for docker.io/docker/dockerfile:1          0.5s
 => CACHED docker-image://docker.io/docker/dockerfile:1@sha256:ac85f380a63b13dfcefa89046420e1781752bab202122f  0.0s
 => [internal] load build definition from Dockerfile                  0.0s
 => [internal] load metadata for docker.io/library/node:16.20.1-slim       0.2s
 => [internal] load .dockerignore                           0.0s
 => [internal] load build context                           0.4s
 => => transferring context: 1.83kB                         0.4s
 => [base 1/2] FROM docker.io/library/node:16.20.1-slim@sha256:3b9214c4d0540be68e61311afd8819c15c8cd0b964a  0.0s
 => CACHED [base 2/2] WORKDIR /app                          0.0s
 => CACHED [build 1/6] RUN apt-get update -qq &&     apt-get install -y build-essential pkg-config python      0.0s
 => CACHED [build 2/6] COPY --link .npmrc package-lock.json package.json ./    0.0s
 => CACHED [build 3/6] RUN npm ci --include=dev             0.0s
 => [build 4/6] COPY --link . .                             0.0s
 => [build 5/6] RUN npm run build                           8.1s
 => [build 6/6] RUN npm prune --omit=dev                    1.9s
 => [stage-2 1/1] COPY --from=build /app /app           
 => exporting to image                                      0.0s
 => => exporting layers                                     0.0s
 => => writing image sha256:6aaffc798d05891900c0125ddd6e8   0.0s
 => => naming to registry.fly.io/my-svelteki-test2:deployment-01H6XT27PWB2QXS0Q92YEFVREW    0.0s
--> Building image done
==> Pushing image to fly
The push refers to repository [registry.fly.io/my-svelteki-test2]
49fc624001ac: Pushed
2227f6d18843: Layer already exists
ce20f0dc920f: Layer already exists
45f2f06d83a0: Layer already exists
acdc63d06458: Layer already exists
92cf2e8e2fb2: Layer already exists
ff3e8b4eec52: Layer already exists
deployment-01H6XT27PWB2QXS0Q92YEFVREW: digest: sha256:feccac6fba1231231b209545e157fb4c09c32a3ab1658cc0c3f487633f85aeb1d size: 1783
--> Pushing image done
image: registry.fly.io/my-svelteki-test2:deployment-01H6XT27PWB2QXS0Q92YEFVREW
image size: 181 MB

Watch your app at https://fly.io/apps/my-svelteki-test2/monitoring

Updating existing machines in 'my-svelteki-test2' with rolling strategy
  [1/1] Machine 4d891224b40168 [app] update finished: success
  Finished deploying

Visit your newly deployed app at https://my-svelteki-test2.fly.dev/
➜  sveltekit-deploy-on-fly-io>
```

위 코드를 보시면 fly deploy 명령어가 잘 작동된 걸 볼 수 있는데요.

이제 호스팅 된 주소 https://my-svelteki-test2.fly.dev/ 여기로 이동해 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEhvOegfMG89M4KbMNsOzfXWP8JiJRAbXGFlhzbbuPdTjKZJYU9SnN6LGv2OZNKD9um21SzzpIUWKP7yp5oO56_VHUPCAPQJp8TSgLoAJGzk7w2enghee3neAoA5_HaRJRA1J1xetpBX7ADNBqAtx7-pKedKsPPwJJMs8uohu1HvbDUVk49wBJmsVXcA1iE)

위 그림같이 fly.dev주소로 정상적으로 완벽히 호스팅 된 걸 볼 수 있을 겁니다.

결론적으로 Fly.io에 배포 성공입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEj8e0IiWsdsVaewunZmSSdjNV2B2qeCWeheodePhWHfvX_YUHy_RGAsEcuebLOydqUNItpnt59-_i5MRITY48xGezulzi4cM3zIVhT-ZoiQXCT5XD37_d0gxwNlFvQefapt8OAPO6nSUJEwSCigrZpOmF3cOXRnJ6_1LOdEgpbHaMOGSNO50FslYoxztzc)

![](https://blogger.googleusercontent.com/img/a/AVvXsEgV7L47vTF85o90YXIUm2shNbPGGkqtaTgzLKnwg6l2T_V_thOTt72BXH7jfmSoDSWEncC1BcmGVm6SsYR4ChW6up8sGGFM8rfhd3jQy-VBYhzr7oi1Lucu7B9jtOmQ40ZvAYvb_8Os36z9K3Xhrxz9jKu2nWkyuxZHPo2hw8IiXXSHkIwvfz9kjZ_-3_k)

Fly.io 대시보드에서 보시면 위 그림과 같이 서버가 Suspended 됐다고 나오는데요.

실제, 서버 중지가 아니라 서버 요청이 없어 쉬고 있는 겁니다.

다시 https://my-svelteki-test2.fly.dev/ 이 주소로 들어가면 Fly.io가 위 서버를 깨워서 우리가 만든 SvelteKit의 Nodejs 서버를 구동하게 됩니다.

어떤가요?

SvelteKit으로 Fly.io에 배포하는 게 아주 쉽죠.

여기까지는 실제 Git 상태와 무관하게 fly 명령어가 현재 폴더 기준으로 직접 Fly.io에 배포하는 방법입니다.

다음시간에는 Github과 연동해서 자동으로 Deploy 되는 Github Action을 만들어 볼까 합니다.

그럼.



