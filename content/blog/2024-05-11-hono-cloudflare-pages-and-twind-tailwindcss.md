---
slug: 2024-05-11-howto-make-ssr-page-with-hono-cloudflare-pages-and-twind-tailwindcss
title: Hono, Cloudflare Pages, TailwindCSS로 SSR(Server Side Rendering) 웹페이지 만들기
date: 2024-05-11 10:14:48.581000+00:00
summary: Hono를 이용한 Cloudflare Pages 작성, 그리고 Twind를 이용한 Tailwind CSS 동적 컴파일
tags: ["hono", "cloudflare pages", "tailwindcss", "twind", "ssr"]
contributors: []
draft: false
---

안녕하세요?

오늘은 Hono와 Cloudflare Pages를 이용해서 SSR 웹페이지를 만들어보겠습니다.

여기서 한 단계 더 나아가 TailwindCSS도 서버에서 동적으로 컴파일해서 보여주는 웹 페이지를 만들 건데요.

** 목 차 **

- [Hono 앱 만들기](#hono-앱-만들기)
- [Hono 웹 프레임워크를 통해 기본적인 웹페이지 작성하기](#hono-웹-프레임워크를-통해-기본적인-웹페이지-작성하기)
- [Twind 패키지로 동적 CSS 작성하기](#twind-패키지로-동적-css-작성하기)
- [Hono 라우팅 만들기](#hono-라우팅-만들기)
- [Cloudflare Pages에 배포하기](#cloudflare-pages에-배포하기)

---

## Hono 앱 만들기

먼저, Hono 앱 템플릿을 만들겠습니다.

```sh
npm create hono@latest
create-hono version 0.7.1
? Target directory hono-tailwind-ssr
? Which template do you want to use?
  aws-lambda
  bun
❯ cloudflare-pages
  cloudflare-workers
  deno
  fastly
  lambda-edge
(Use arrow keys to reveal more choices)
```

위와 같이 Cloudflare-pages를 선택해서 hono 앱을 만들어 줍니다.

```sh
tree . -L 1
.
├── README.md
├── node_modules
├── package-lock.json
├── package.json
├── public
├── src
├── tsconfig.json
├── vite.config.ts
└── wrangler.toml

4 directories, 7 files
```

위와 같이 src 폴더와 public 폴더가 보입니다.

src 폴더를 보시면,

```sh
tree ./src -L 2
./src
├── global.d.ts
├── index.tsx
└── renderer.tsx

1 directory, 3 files
```

세 개의 파일이 보이는데요.

우리가 만든 앱의 entry 포인트는 index.tsx 파일입니다.

```js
import { Hono } from 'hono'
import { renderer } from './renderer'

const app = new Hono()

app.use(renderer)

app.get('/', (c) => {
  return c.render(<h1>Hello!</h1>)
})

export default app
```

hono 프레임워크의 전체적인 사용법은 다음 블로그 글을 참고하시면 됩니다.

[Hono 웹 프레임워크 소개](https://mynewcodings.tistory.com/27)

자세히 보시면 render 부분을 커스텀하게 만들었는데요.

renderer.tsx 파일을 한번 볼까요?

```js
import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children, title }) => {
  return (
    <html>
      <head>
        <link href="/static/style.css" rel="stylesheet" />
        <title>{title}</title>
      </head>
      <body>{children}</body>
    </html>
  )
})
```

전체적인 HTML 파일 구조를 가지고 있네요.

이제 Tailwind CSS를 CDN으로 설치해 보겠습니다.

renderer.tsx 파일에 tailwind CSS를 CDN으로 설치할 수 있는 script 태그를 추가했습니다.

```js
import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children, title }) => {
  return (
    <html>
      <head>
        <link href="/static/style.css" rel="stylesheet" />
        <title>{title}</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>{children}</body>
    </html>
  )
})
```

테스트를 위해 index.tsx 파일에서 tailwindcss를 이용해서 H1 태그를 수정해 보겠습니다.

```js
import { Hono } from "hono";
import { renderer } from "./renderer";

const app = new Hono();

app.use(renderer);

app.get("/", (c) => {
  return c.render(
    <h1 class="text-3xl font-bold underline text-clifford">Hello world!</h1>
  );
});

export default app;
```

이제 개발 서버를 돌려 볼까요?

```sh
npm run dev
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEh74ifK0aSu74GEq28IcNSnL9335oSfQdVYfgR1NDX5U5exaafSyVx3FDm4-FiRxC5kiNzLU9dkkJnJQXwa0Udvo20TfHPJJTt920BcNcOj45kndBJh-ueE_6vbwqtEkgtGmMR4VeN7hYI2VaSW-C85qme_17S2yN93h_t18YSopNDMwyee6J5_TRAiAMs)

위 그림은 개발 서버임은 감안해도 TailwindCSS 3.4.3 버전을 통째로 다운로드하고 있습니다.

그 크기는 112kb인데요.

저는 오늘 서버에서 사용된 Tailwind CSS만 동적으로 컴파일해서 CSS를 HTML에 삽입시켜 주는 코드를 작성해 보겠습니다.

---

## Hono 웹 프레임워크를 통해 기본적인 웹페이지 작성하기

Hono 웹 프레임워크는 route 핸들러를 기본적으로 보유하고 있는데요.

```js
app.get("/", (c) => {
  return c.render(
    <h1 class="text-3xl font-bold underline text-clifford">Hello world!</h1>
  );
});
```

위와 같이 app.get 함수로 GET 메서드에 대한 '/' 라우팅을 처리하는 로직입니다.

위 로직에서 c.render 부분이 renderer.tsx 파일에서 커스텀하게 작성된 렌더러인데요.

Tailwind CSS를 동적으로 컴파일하기 위해서는 이 렌더러를 지우고 c.html 메서드를 작성해야 하는데요.

전체적인 코드를 아래와 같이 바꾸겠습니다.

먼저, src 폴더에 components 폴더를 만들고 아래와 같이 세 개의 파일을 만들겠습니다.

```js
// src/components/layout.tsx

import { html } from "hono/html";

export const Layout = (props: { title: string; children?: any }) => {
  return html`<!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${props.title}</title>
      </head>
      <body>
        ${props.children}
      </body>
    </html>`;
};
```

위와 같이 layout.tsx 파일을 만들어 놓으면 귀찮은 HTML 템플릿을 매번 새로 써야 할 필요가 없어서 편합니다.

두 번째로 header.tsx 파일을 만들겠습니다.

```js
// src/components/header.tsx

export const Header = () => {
  return (
    <header>
      <nav class="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
        <ul class="flex flex-row mt-4 font-medium lg:space-x-8 lg:mt-0">
          <li>
            <a
              href="/"
              class="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-gray-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
              aria-current="page"
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="/about"
              class="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-gray-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
            >
              About
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};
```

FlowBite에서 차용한 Tailwind CSS입니다.

그리고 root-page.tsx 파일을 따로 만들겠습니다.

```js
// src/components/root-page.tsx

import { Header } from "./header";
import { Layout } from "./layout";

export const RootPage = () => {
  return (
    <Layout title="Hono Tailwind SSR Test">
      <Header />
      <div class="text-2xl font-bold text-center py-10">This is Root Page</div>
      <div class="flex justify-center items-center h-screen">
        <div class="grid grid-cols-3 gap-6 max-w-5xl w-full px-4">
          <img
            alt="Image 1"
            class="rounded-lg object-cover"
            src="/static/placeholder.svg"
            width="100"
          />
          <img
            alt="Image 2"
            class="rounded-lg object-cover"
            width="100"
            src="/static/placeholder.svg"
          />
          <img
            alt="Image 3"
            class="rounded-lg object-cover"
            width="100"
            src="/static/placeholder.svg"
          />
        </div>
      </div>
    </Layout>
  );
};
```

이미지 테스트를 위해 public 폴더에 보시면 static 폴더가 보이는데요.

이 폴더에는 나중에 Cloudflare Pages 에 배포할 때 여러가지 정적 이미지나 기타 파일을 넣을 수 있습니다.

저는 일단 placeholder.svg 파일 아무거나 넣었습니다.

이제 엔트르포인트닌 src 폴더의 index.tsx 파일을 손 보겠습니다.

```js
import { Hono } from "hono";
import { RootPage } from "./components/root-page";

const app = new Hono();

app.get("/", (c) => {
  return c.html(<RootPage />);
});

export default app;
```

renderer.tsx 파일을 지웠습니다.

이제 개발 서버를 돌리면 아래와 같이 브라우저에 나올 건데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjc7hc4RwAJGccvJ_7P3duwRFmEKnqNoxAlXwxIJUYm5o5yWFvy-6-L16UYfoxPTxRsFlXSGsVY4NvNlyA3_TWl8B_RN6KrzKNtmSzt9HflGyRPdZswGkoQ-HvEonz1chgHjr_e0Mz8u9ElzZlezi5U1rwSv2BvdvAxNZ614uDvpM8SWW47U_F96_gBSrk)

![](https://blogger.googleusercontent.com/img/a/AVvXsEgqepS-LV3f_YjaBgMMM4wu5IYgiEX5fCb4Zc-je5bkONek4Q6ajK-jSb5Xvkd4WyuQAWJ3VyrziAR1cSpCPqSqaMxVtNsQIXN6PUaNGLT2u3xkeUFGQ8wZCslG2cB5XkQHbG6pmw7JZmtrioALFMXNd81cxJWtVWkLXm8BUqUJqG1tJDdD79MVZdQfLA8)

크롬 검사창에서 보시면 네트워크탭 부분에 자세히 보시면 Tailwind CSS 라이브러리가 없습니다.

그래서 전체적인 화면도 TailwindCSS가 적용되지 않았는데요.

이제 이 부분을 동적으로 컴파일해서 Tailwind CSS를 보여주겠습니다.

---

## Twind 패키지로 동적 CSS 작성하기

Twind 패키지가 바로 이 역할을 하기 위한 패키지인데요.

먼저, lib 폴더를 만들고 ssrTwind.ts 파일을 만들겠습니다.

```js
import { extract } from "@twind/core";

export async function ssrTwind(body: any) {
  const { html, css } = extract((await body).toString());
  return html.replace("</head>", `<style data-twind>${css}</style></head>`);
}
```

당연히 twind/core 패키지를 설치해줘야 합니다.

```sh
npm i @twind/core
```

ssrTwind 헬퍼 함수는 body 부분에서 html과 css 부분을 추출(extract)합니다.

단연히 async 함수죠.

그리고 html 부분에서 `</head>` 부분을 바꿔치기해주는 방식으로 동적으로 계산된 TailwindCSS를 삽입해 주는 역할을 합니다.

이제 엔트리 포인트인 index.tsx 파일에서 ssrTwind 헬퍼함수를 적용시켜 보겠습니다.

```js
import { Hono } from "hono";
import { RootPage } from "./components/root-page";
import { ssrTwind } from "./lib/ssrTwind";

const app = new Hono();

app.get("/", (c) => {
  return c.html(ssrTwind(<RootPage />));
});

export default app;
```

위와 같이 단순하게 `<RootPage />`를 감싸면 되는데요.

그런데, Twind를 쓰기 위해서는 Tailwind Preset을 설치해 줘야 하는데요.

```sh
npm i @twind/preset-tailwind
```

그리고 index.tsx 파일을 아래와 같이 손 보겠습니다.

```js
import { Hono } from "hono";

import { install } from "@twind/core";
import presetTailwind from "@twind/preset-tailwind";
import { ssrTwind } from "./lib/ssrTwind";

import { RootPage } from "./components/root-page";

install({
  presets: [
    presetTailwind(),
    {
      theme: {
        fontFamily: {
          sans: ["Monaco", "sans-serif"],
          serif: ["Georgia", "serif"],
        },
      },
    },
  ],
});

const app = new Hono();

app.get("/", (c) => {
  return c.html(ssrTwind(<RootPage />));
});

export default app;
```

theme 부분은 빈칸으로 둬도 됩니다.

이제 개발 서버를 돌리면 아래 그림과 같이 Tailwind CSS가 완벽하게 적용된 걸 볼 수 있을 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjMlv5Fsq4JmWib-Gb09bne-TRmOoIEcyHTlaZBGu23a181cJiUB5Pena-iGoZE043kFSLHKBrqFXB-KRAPYG6OQRb4r5YyOAveqPuBzAabN3_psRvRSViPahCoUQKs61EjvcbNoPj9KJLDu2ofCnX_gYLZ8OulaNB17bFW8iLJDKmgrk987AYJLnsNO0Y)

![](https://blogger.googleusercontent.com/img/a/AVvXsEjZwrgeaWuryCdCy_CfIDdntdy0Q_6g0GuJiHAx0iLwldHPuP0x19oepevik-M2K9COQkWjhptXBUaD0r5ItAj-AeGVmSMurtyStUoZtMG9zCXGnqINZ9h8FtEf7lZwDaI01CLnj-MjJcqUFVE7HbJEZAHBF85Lbdvnq8zc65xfY8zdumRz8W7-haBmKMo)

네트워크 탭을 봐도 Tailwind CSS 라이브러리가 없는 게 보일 겁니다.

그런데도 Tailwind CSS가 완벽하게 작동되었는데요.

페이지 Source 파일을 보겠습니다.

네트워크 탭이 아닌 엘리먼트 탭을 보시면 아래 그림과 같이 HTML의 head 태그 안에 style 태그가 있는데요.

우리가 사용한 Tailwind CSS를 동적으로 컴파일해서 입혀줬네요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjZr1lsdVtBX3_0eq5IIUOmTTEOiYjRzAlKiykcrCa5V1vodH9tIwtPa6loXjT2ON-cmi-Uy5MVZ8S9JxFWr9rYijrzN14PkwpiFHALtWAc6U3KxMZoxFHTHQ2QHOF-91bvkzBcolpDN5oPZ7vjIHilxTvXfe2Et-e1AU0LSf-ZkX63sk4_2H8D5kPk46s)

어떤가요?

우리가 처음 의도했던 부분을 성공적으로 구현해 냈습니다.

그리고 이와 만든김에 '/about' 라우팅도 만들어 볼까요?

---

## Hono 라우팅 만들기

index.tsx 파일을 아래와 같이 만들어 줍니다.

```js
import { Hono } from "hono";

import { install } from "@twind/core";
import presetTailwind from "@twind/preset-tailwind";
import { ssrTwind } from "./lib/ssrTwind";

import { RootPage } from "./components/root-page";
import about from "./routes/about";  // 추가한 부분

install({
  presets: [
    presetTailwind(),
    {
      theme: {
        fontFamily: {
          sans: ["Monaco", "sans-serif"],
          serif: ["Georgia", "serif"],
        },
      },
    },
  ],
});

const app = new Hono();

app.get("/", (c) => {
  return c.html(ssrTwind(<RootPage />));
});

app.route("/about", about); // 추가한 부분

export default app;
```

위 코드를 잘 보시면 routes 폴더를 따로 만들고 about 라우팅을 import 해서 app.route 함수로 라우팅을 추가해 줬습니다.

왜 routes 폴더를 따로 만드느냐, 바로 코드를 분산하기 위해서죠.

그러면 routes 폴더를 볼까요?

```js
// src/routes/about/index.tsx

import { Hono } from "hono";

import { ssrTwind } from "../../lib/ssrTwind";
import { About } from "./components/about";

const about = new Hono()

about.get("/", (c) => {
  return c.html(ssrTwind(<About />));
});

export default about;
```

위와 같이 라우팅을 구현하는 파일과 실제 about 페이지를 따로 분리했습니다.

마지막으로 components 폴더의 about.tsx 파일을 아래와 같이 만들겠습니다.

```js
import { Header } from "../../../components/header";
import { Layout } from "../../../components/layout";

export const About = () => {
  return (
    <Layout title="About Page">
      <Header />
      <div class="text-2xl font-bold text-center py-10">This is About Page</div>
    </Layout>
  );
};
```

이제 다시 개발 서버를 돌려볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEjwH5x2A9bY6Gb2TfilYjOatbFlMzOJVJRZLVuwZU5EI92d9b_2ql8yI4vGU4S2y8US50NT2x2UT0K_9kd2U25iQaGWuq6RNssiW9UW2QH73r_FI8spzA8SOHS0YrJMwsCB8jZnw6dIybh1P3K835ysisS4PqPmHUkUZPmmeV-d1WqXhtbhjO6_Z_mvDIA)

위와 같이 about 라우팅도 잘 작동합니다.

그리고 웹페이지 소스도 보시면 head 태그 안에 style 부분이 Tailwind CSS로 꽉 차 있는 걸 볼 수 있을 겁니다.

---

## Cloudflare Pages에 배포하기

이제 Hono 웹 프레임워크로 웹페이지를 만들었으니 Cloudflare Pages에 실제로 배포해 보겠습니다.

배포 명령도 단순합니다.

```sh
npm run deploy
```

실제로는 `npm run build` 명령어를 실행하면 dist 폴더가 생기는데요.

```sh
➜  hono-tailwind-ssr npm run build

> build
> vite build

vite v5.2.11 building SSR bundle for production...
✓ 47 modules transformed.
dist/_worker.js  76.36 kB
✓ built in 361ms
```
위와 같이 _worker.js 파일 한 개만 생기네요.

이제 바로 Cloudflare Worker 인데요.

Hono를 이용해서 동적으로 웹 페이지를 만들었기 때문에 _worker.js 파일이 생기는 겁니다.

실제로 dist 폴더 안을 살펴볼까요?

```sh
tree ./dist -L 2
./dist
├── _routes.json
├── _worker.js
└── static
    ├── placeholder.svg
    └── style.css

2 directories, 4 files
```

이제 npm run deploy하면 이 dist 폴더가 통째로 Cloudflare 서버에 업로드되는 겁니다.

실제 package.json 파일의 deploy 부분을 보시면 아래와 같이 되어 있습니다.

```sh
"deploy": "$npm_execpath run build && wrangler pages deploy dist"
```

이제 배포해 볼까요?

그러면 아래와 같이 나오는데요.

```sh
npm run deploy

> deploy
> $npm_execpath run build && wrangler pages deploy dist


> build
> vite build

vite v5.2.11 building SSR bundle for production...
✓ 47 modules transformed.
dist/_worker.js  76.36 kB
✓ built in 307ms
The project you specified does not exist: "hono-tailwind-ssr". Would you like to create it?"
❯ Create a new project
```
위와 같이 나오면 그냥 엔터키를 누르면 됩니다.

그리고 중요한 부분은 아래와 같이 나오는데요.

production이라고 디폴트 값이 나오는데요.

지우고 main이라고 씁니다.

```sh
? Enter the production branch name: › main
```

Git의 main 브랜치를 사용한다는 뜻입니다.

그냥 엔터치면 배포가 안되니까 꼭 main이라고 바꾸고 엔터키를 쳐야 합니다.

```sh
✨ Successfully created the 'hono-tailwind-ssr' project.
🌎  Uploading... (2/2)

✨ Success! Uploaded 2 files (1.30 sec)

✨ Compiled Worker successfully
✨ Uploading Worker bundle
✨ Uploading _routes.json
✨ Deployment complete! Take a peek over at https://2eebcc68.hono-tailwind-ssr.pages.dev
```

최종적으로 위와 같이 성공적으로 배포가 되었네요.

임시 배포 주소로 가볼까요?

처음에는 안 보일 수 있는데요.

Edge 네트워크라 우리나라 쪽으로 오려면 조금 걸립니다.

그리고 Cloudflare Dashboard로 가시면 아래와 같이 잘 보일 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhklddapMG4G1LJFs8UZyqTSyz8nPc5CCjvwAwhJwPZCOujg-S73ONPgITweiEOMwuHhM_AbzZMCSK69h2ORUEAEfClbmu_YdtQnWn9d135dcUUX8kYwOe-zaXpCRhIoB8wBaPw5RgzPCltqlypNyJklDROgDEWD1ay3AIYWfnnkKlGVpCFWQ_0zmc0Um0)

그리고 실제 사이트인 `https://hono-tailwind-ssr.pages.dev/`로 가볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEiaDop5Bp88jHjyWbv_aVhVr3WQWRAf6EroFr-KO_V8iMFb-whSiAi-PulQibtABunfanUD6AOl7U41zgUX5g3KDGBNt4XsdLIFFuupGS0roYoqBat66zt2Hy0cxzknCP868lPX6xQOBsuJh-yQ2Yi1kUl3AExJiypmI_t6xwfSfOt-I3iVDUpIn3wVZPc)

위와 같이 정상적으로 나옵니다.

성공이네요.

네트워크 탭을 검사해 보겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiQ2-FwPjzWBDbjpqxUVPgSgPJyvioLglsVBgKiIMNb6p0dUPov2GqCftTsCvsg-bXNiPIakncreMR-WWprLu8jFkkzY910AKMVpKGxSBaJhyVXGPus2UWFhlEUKPfZ4gAnaJ1VbFyJeEmuApXCe6S0I1Oit0B3FyeFv1ZTY10L1-TevnR9dsUkdyuYFOc)

위와 같이 정말 가볍고 작은 사이트가 완성되었습니다.

위 그림을 보시면 Root Page의 사이트 전체 크기가 4.3kb인데요.

어메이징합니다.

만약 Tailwind CSS를 CDN에서 통째로 삽입했더라면 112kb가 추가되는 꼴인데요.

Twind를 이용해서 동적으로 Tailwind를 컴파일해서 필요한 것만 삽입하니까 정말 작고 빠른 웹 페이지가 탄생했네요.

앞으로 Hono와 CF Pages 그리고 Twind를 이용해서 여러 가지 웹 페이지를 만들어 봐야겠네요.

정말 만족스럽네요.

그럼.



