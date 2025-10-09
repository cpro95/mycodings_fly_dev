---
slug: 2024-10-14-cloudflare-remix-framework-hono-rpc-api-endpoint
title: Cloudflare에서 Remix Framework과 Hono의 RPC 기능을 활용한 API Endpoint 구축하기
date: 2024-10-14 10:40:25.742000+00:00
summary: 이 글에서는 Cloudflare 환경에서 Remix Framework과 Hono의 RPC 기능을 활용하여 API Endpoint를 구축하는 방법을 단계별로 설명합니다. 효율적인 API 통신을 위한 실용적인 팁과 함께 배포 과정을 안내합니다.
tags: ["remix", "hono", "rpc", "cloudflare", "api endpoint"]
contributors: []
draft: false
---

안녕하세요?

[Hono Framework](https://hono.dev/)을 아시나요?

ExpressJS와 비슷하지만 작고 빠른 프레임웍인데요, Hono가 왜 인기가 있냐면 바로 Cloudflare의 Worker에서 사용하기 편해서 그렇습니다.

Cloudflare의 백엔드 로직을 Hono로 작성하면 조금 더 편한데요.

심지어 Hono를 이용해서 백엔드만으로도 웹사이트를 만들 수 있습니다.

그래서 최근 Hono만을 이용해서 Cloudflare Pages에 D1 데이터베이스를 이용해서 블로그 시스템을 만들고 있는데요.

Hono 만을 이용해 100% 백엔드 코드만 작성하려니 클라이언트 사이드쪽 자바스크립트가 불편했습니다.

역시나 React가 편한건 어쩔 수 없더라구요.

그래서 최근에는 [Remix Framework](https://remix.run/)에 다시 눈이 돌아갔는데요.

Remix 프레임웍으로도 Cloudflare Pages에 배포할 수 있습니다.

하지만 백엔드 코드를 loader, action 함수 안에 넣어야 해서 뭔가 코드가 뒤죽박죽으로 정리가 안되는데요.

이럴 때 생각나는게 바로 Hono의 RPC 기능이었습니다.

백엔드에서 단순히 해당 route의 typeof 만 export해도 클라이언트에서 아래와 같이 아주 쉽게 백엔드에 접근하게 해줍니다.

```js
// backend

const route = app.post(
  '/posts',
  zValidator(
    'form',
    z.object({
      title: z.string(),
      body: z.string(),
    })
  ),
  (c) => {
    // ...
    return c.json(
      {
        ok: true,
        message: 'Created!',
      },
      201
    )
  }
)

export type AppType = typeof route
```

위 코드의 AppType만 있어도 아래와 같이 쉽게 클라이언트 사이드에서 백엔드 엔드포인트(Endpoint)에 접근할 수 있습니다.

```js
import { AppType } from '.'
import { hc } from 'hono/client'

const client = hc<AppType>('http://localhost:8787/')
```

사용방법은 아래와 같이 직관적입니다.

```js
const res = await client.posts.$post({
  form: {
    title: 'Hello',
    body: 'Hono is a cool project',
  },
})
```

어떤가요?

Hono의 간결하고 쉬운 백엔드 로직 구현은 심지어 Next.js의 Endpoint도 Hono로 작성할 수 있게 해 줍니다.

그러면 오늘은 실제로 Remix와 Hono를 이용해서 Cloudflare Pages 상에 D1 DB를 이용해서 Todo 앱을 구현해 보겠습니다.

Cloudflare 네트워크상에 배포하여 테스트 및 속도까지 체크해 볼 생각입니다.

---

## 코드 템플릿 구현

Cloudflared Pages와 Remix의 연결은 Wrangler에 아주 잘 구현되어 있어 아래와 같이 터미널에서 직접 템플릿을 생성할 수 있습니다.

```sh
npm create cloudflare@latest
```

일단 위와 같이 입력하면 여러가지 prompts가  나오는데요.

중요한 거는 "Framework starter"를 골라주고 Framework은 Remix를 골라주면 된다는 겁니다.

그 다음은 알아서 엔터키를 쭉 치면 완성됩니다.

마지막에 "deploy" 할 거냐고 물어보는데 디폴트는 "No"라고 되어 있으니까 엔터키만 치면 끝납니다.

그리고 실제로 build 후 "npm run deploy" 명령어를 입력하면 알아서 wrangler가 cloudflare에 배포해 줄겁니다.

저는 Github 리포지터리에서 배포하는 것 보다 이렇게 터미널에서 배포하는게 더 좋더라구요.

여기서 잠깐!!!!!

이렇게 Cloudflare와 Remix의 템플릿이 기본으로 제공되는데 저는 뭐가 더 배울게 있다고 오늘 이 글을 쓰고 있을까요?

바로 Hono를 Remix에 연결하는 방법이 지금까지는 어려워서 그랬습니다.

그런데 최근 Hono 제작자(Yusuke Wada)께서 아래 그림처럼 ["hono-remix-adapter"](https://github.com/yusukebe/hono-remix-adapter) 라이브러리를 만들어서 아주 쉽게 연결할 수 있게 되었는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiLRkoZCrfiBVnf4TTRgBIXKAFZYLUT6lQ9Ickb9DAMOe8Bcjg73PYbgGZXFikuyYXXcu7b-faabkIG-nh1YS4DJYhJwBwh56lkCWiW_rnntji4Mok2UjCu-ZXL5DZqTSs2H8Au_U7_jrKBfu6lqBD05RCEl-lp0UCfkFTYImwLGC4YptMTkEWPDljhfgo)

실제로 "hono-remix-adapter" 라이브러리를 사용하는 방법 위주로 글을 전개해 나갈 예정입니다.

---

## 필요한 패키지 설치

Hono를 이용하려면 일단 아래와 같이 필수 패키지를 설치합니다.

```sh
npm install hono hono-remix-adapter @hono/zod-validator
```

zod-validaotr는 다들 아실겁니다.

hono에는 기본 장착되어 있어 아주 편한데요.

UI는 요즘 대세인 shadcn UI를 사용할 거라서 아래와 같이 하시면 됩니다.

```sh
npx shadcn@latest init
✔ Preflight checks.
✔ Verifying framework. Found Remix.
✔ Validating Tailwind CSS.
✔ Validating import alias.
✔ Which style would you like to use? › New York
✔ Which color would you like to use as the base color? › Neutral
✔ Would you like to use CSS variables for theming? … no / yes
✔ Writing components.json.
✔ Checking registry.
✔ Updating tailwind.config.ts
✔ Updating app/tailwind.css
✔ Installing dependencies.
✔ Created 1 file:
  - app/lib/utils.ts

Success! Project initialization completed.
You may now add components.
```

이제 UI에 필요한 컴포넌트를 설치해 보겠습니다.

```sh
npx shadcn@latest add card button checkbox
✔ Checking registry.
✔ Installing dependencies.
✔ Created 3 files:
  - app/components/ui/card.tsx
  - app/components/ui/button.tsx
  - app/components/ui/checkbox.tsx
```

이제 준비가 끝났으니 본격적으로 Hono를 연결해 보겠습니다.

vite.config.ts 파일을 열어볼까요?

```ts
import {
  vitePlugin as remix,
  cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
} from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    remixCloudflareDevProxy(),
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    tsconfigPaths(),
  ],
});
```

지극히 Remix 위주로 세팅이 되어 있는데요.

여기에 아래와 같이 추가할 겁니다.

```ts
import {
 vitePlugin as remix,
 cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
} from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
// 아래 부분이 추가된 부분
import adapter from "@hono/vite-dev-server/cloudflare"
import serverAdapter from "hono-remix-adapter/vite"

export default defineConfig({
 plugins: [
   remixCloudflareDevProxy(),
   remix({
     future: {
       v3_fetcherPersist: true,
       v3_relativeSplatPath: true,
       v3_throwAbortReason: true,
     },
   }),
   // 아래 부분이 추가된 부분
   serverAdapter({
     adapter,
     entry:"./server/index.ts"
   }),
   tsconfigPaths(),
 ],
});
```

추가된 부분만 따로 때어내서 보면 아래와 같습니다.

```ts
import adapter from "@hono/vite-dev-server/cloudflare"
import serverAdapter from "hono-remix-adapter/vite"

...
...
...

// 아래 부분이 추가된 부분
serverAdapter({
    adapter,
    entry:"./server/index.ts"
}),
```

우리가 아까 설치한게 adapter입니다.

hono-remix-adapter.

그래서 serverAdapter와 adapter를 관련 패키지에서 import해서 Vite 서버 설정에 추가한겁니다.

그리고, RPC를 만들 때 필요한 환경변수 설정파일을 ".env"파일 이름으로 아래와 같이 만들면 됩니다.

```sh
VITE_API_URL=http://localhost:5173/
```

앞에 VITE를 명기해서 Vite 서버에서 사용할 수 있게 했습니다.

설정은 끝났습니다.

그러면 Hono를 이용해서 백엔드 코드를 작성해야 하는데요.

아까 serverAdapter 안의 설정 항목을 잘 보시면 entry 값이 있습니다.

`./server/index.ts`입니다.

이제 이 파일이 엔트리 포인트라서 이걸 만들어야 합니다.

프로젝트 최상단에서 server 폴더를 만들고 index.ts 파일을 만들겠습니다.

```ts
import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono<{ Bindings: Env }>();

app.use("*", cors());

const route = app.get("/hono-cf-test", async (c) => {
  const { kv } = c.env;

  await kv.put("hono-remix-adapter", "hono can access cloudflare kv");
  const value = await kv.get("hono-remix-adapter");
  console.log(value);

  return c.text(
    `Hono kv is ok, value is ${value} ,\n My_var is ${c.env.SECRET}`
  );
});

export default app;

export type AppType = typeof route;
```

이 강좌는 Hono 강좌가 아니라서 Hono 강좌는 생략하겠습니다.

잘 보시면 ExpressJS와 비슷하니까 쉽게 이해할 수 있을 겁니다.

위 코드를 잘 보시면 일단 GET 메서드로 '/hono-cf-test' 라우팅을 추가했는데요.

이 라우팅에서는 Cloudflare 기능에 접근할 수 있는 방법을 설명하기 위해 위와 같이 코드를 작성했습니다.

먼저, kv가 있어야겠죠.

두 번째는 `${c.env.SECRET}`에서 처럼 환경변수 SECRET입니다.

KV는 Cloudflare가 제공해주는 일종의 저장소인데요.

key-value 방식의 데이터를 네트워크상에 저장시켜주면 캐시 기능이 있어 보통 한번 설정하면 잘 안 바뀌는 데이터를 넣어두면 아주 좋습니다.

왜냐하면 KV는 데이터를 전세계 모든 Cloudflare 서버에 똑같이 저장해 놓기 때문에 불러오는 건 빠르지만 저장하고 난 뒤 새로 그 값을 가져오는 거에는 시간이 조금 걸립니다.

먼저, KV를 설정하겠습니다.

```sh
npx wrangler kv:namespace create kv

 ⛅️ wrangler 3.57.1 (update available 3.80.4)
-------------------------------------------------------
🌀 Creating namespace with title "hono-remix-test-kv"
✨ Success!
Add the following to your configuration file in your kv_namespaces array:
{ binding = "kv", id = "2e9c54345342342342a0a747d3099" }
```

위와 같이 하면 이름이 'kv'인 KV가 생성되었네요.

그리고 밑에 binding와 id 값은 wrangler.toml 파일에 넣어야 하는데요.

wrangler.toml 파일을 잘 보시면 여러 주석처리된 텍스트가 나오는데요.

KV 관련된 곳은 아래입니다.

```sh
# Bind a KV Namespace. Use KV as persistent storage for small key-value pairs.
# Docs: https://developers.cloudflare.com/pages/functions/bindings/#kv-namespaces
# [[kv_namespaces]]
# binding = "MY_KV_NAMESPACE"
# id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

위에다가 아까 내용을 넣어두면 됩니다.

그리고 맨 앞의 "#"을 지워야 주석처리를 지우는 거니까 꼭 "#"을 지워야 합니다.

```sh
[[kv_namespaces]]
binding = "kv"
id = "2e9c54345342342342a0a747d3099"
```

이름을 저는 "kv"라고 했는데 원하는 이름을 고르시면 됩니다.

```sh
npx wrangler kv:namespace create "이름"
```

KV 설정이 끝났습니다.

두 번째, Variables인데요.

`${c.env.SECRET}`에서 처럼 환경변수 SECRET입니다.

요거는 wrangler.toml 파일을 보시면 아래와 같은 곳에 있습니다.

```sh
# Variable bindings. These are arbitrary, plaintext strings (similar to environment variables)
# Docs:
# - https://developers.cloudflare.com/pages/functions/bindings/#environment-variables
# Note: Use secrets to store sensitive data.
# - https://developers.cloudflare.com/pages/functions/bindings/#secrets
# [vars]
# MY_VARIABLE = "production_value"
```

위와 같이 되어 있는 걸 아래와 같이 고치면 됩니다.

```sh
[vars]
SECRET = "secret is hono-remix-adapter"
```

참고로 vars 같은 경우 wrangler.toml 파일에 넣어서 Github 리포지터리에 올리기 꺼림칙할 경우 '.env' 파일과 비슷한 걸 제공해 줍니다.

파일이름을 '.dev.vars'라고 하고 여기에 민감한 정보를 넣어도 Cloudflare가 인식 할 수 있습니다.

이제 Cloudflare가 제공하는 서비스를 이용한 설정이 끝났는데요.

아까 설정한 값을 코드에서 사용하려면 바인딩이라는 걸 해야하는데요.

코드에서 쓰이는 영어는 'Bindings' 입니다.

아까 Hono 객체를 만들 때 아래와 같이 Bindings 값을 지정했었는데요.

```ts
const app = new Hono<{ Bindings: Env }>();
```

Bindings 항목의 값을 Env를 참조하라는 겁니다.

그러면 Env에 우리가 서비스로 사용하려는 KV와 vars 값을 사용할 수 있게 Typescript의 interface로 Env를 구성해야하는데요.

Wrangler가 이걸 아주 쉽게 구현해 줍니다.

package.json 파일에 보시면 아래 항목이 그건데요.

```sh
  "typegen": "wrangler types",
```

typegen 이라는 뜻처럼 타입을 만들어준다는 겁니다.

이제 터미널에서 아래와 같이 실행해 보면,

```sh
npm run typegen

> typegen
> wrangler types

 ⛅️ wrangler 3.57.1 (update available 3.80.4)
-------------------------------------------------------
interface Env {
        kv: KVNamespace;
        SECRET: "secret is hono-remix-adapter";
}
```

Env interface 값을 잘 지정해 줬네요.

그러면 이 파일은 어디에 있을까요?

wrangler 버전이 낮았을 때는 직접 구현해야 했었는데요.

지금은 "worker-configuration.d.ts" 파일에 해당 내용이 저장되어 있습니다.

typegen 명령어가 작성한 파일인거죠.

```sh
// Generated by Wrangler on Sun Oct 13 2024 22:39:14 GMT+0900 (대한민국 표준시)
// by running `wrangler types`

interface Env {
	kv: KVNamespace;
	SECRET: "secret is hono-remix-adapter";
}
```

이렇게 하면 아까 server 폴더의 index.ts 파일에서 Env에 접근이 가능합니다.

이제 VS Code 편집기에서 server 폴더의 index.ts 파일을 다시보면 Typescript 에러가 없져진걸 확인 하실 수 있습니다.

이제 이 상태에서 "npm run dev"를 입력하여 개발 서버를 돌리면 제 맥북에서는 에러가 납니다.

단순하게 tailwind.config.ts 파일에 불필요한 글자가 들어가서 그런건데요.

아까 shadcn UI 패키지를 초기화 할 때 잘 못 된거 같습니다.

tailwind.config.ts을 직접 열어서 텍스트 오타 에러를 제거하시면 됩니다.

fontFamily 쪽에 '\n' 값과 따옴표에서 주르륵 잘못된 글자가 연속적으로 적혀있네요.

잘 고치고 나서 다시 개발 서버를 돌려 봅시다.

```sh
ErrorResponseImpl {
  status: 404,
  statusText: 'Not Found',
  internal: true,
  data: 'Error: No route matches URL "/logo-dark.png"',
  error: Error: No route matches URL "/logo-dark.png"
```

개발 서버 화면에 아래와 같이 나오는데요.

wrangler의 Remix 템플릿에 기본 제공되어 있는 그림파일을 못 읽는다는 겁니다.

현재 해당 그림파일은 public 폴더에 있는데요.

Vite는 Hono가 그림파일을 액세스할 수 있게 StaticServe 기능도 기본 제공해 주는데요.

이 기능의 전제조건은 assets 폴더 밑에 Static 자료가 있어야 한다는 겁니다.

그러면 간단하게 이 문제를 해결 할 수 있는데요.

public 폴더에 assets 폴더를 만들고 여기에 나중에 웹페이지를 돌릴 때 필요한 Static 자료를 넣으면 됩니다.

아까 그림파일을 옮기겠습니다.

그리고 app 폴더가 Remix의 폴더인데요.

app 폴더 밑의 routes 폴더에 있는 '_index.tsx' 파일을 열어 해당 이미지의 href 값을 수정하면 됩니다.

```ts
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
```

원래 href 값은 "/logo-light.png" 이었는데, 위와 같이 assets 폴더를 중간에 넣은 겁니다.

Static 파일 관련은 개발서버를 Ctrl+C로 완전히 중지하고 다시 시작해야 하는데요.

이제 아래 화면처럼 그림파일이 잘 보일 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEg5mlZJoQk2Vm5MJAV84Bzz7Y_u6LgSCoqQa64vZwiWnuDlPMQkDcXdeufZwQWMe3mPl3xSJ1bt_72U_3jmWAdPdHBGJX355IGTlezX1X-eeQ-M-Zt4iQfTzPTl1j55clURtZnOz7SJ5-p-oGKM5yWKBFTqf2sBry_OC-sJGQKGCROHLtKT6difq9ulG9Q)

초기 화면에 오늘 글의 목적말고 여러가지가 있는데 깔끔히 정리하고 "/todos" 라우팅으로 가는 링크만 하나 남기고 다 지우시기 바랍니다.

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
            target="_blank"
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

이제 아래와 같이 나올겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhEjhUX9o5E-XdLTyxGnl_o5AGHmobSoxXsDvbNcrfE3YqpBlSYWdjT6QHBldBeEqCblS-Cpu-c7CzuZeGkJLDaDHGoE7FPc0-va7oibe4Vy1yfx4C4KT8u9L0TvwpTiiCz2jRPrSyR1EzzaUhketrpTZ5MlCHS5FlVwU_AM_3sqoXDpSVUA64TdF_FPUo)

훨씬 깔끔해 졌네요.

이제 준비가 다 끝났으니까 아까 Hono를 이용해서 Get 메서드에 해당하는 "hono-cf-test" 라우팅이 제대로 작동하는 볼까요?

브라우저에서 아래 주소를 직접입력하여 이동하여 봅시다.

```sh
http://localhost:5173/hono-cf-test
```

그러면 아래 그림처럼 브라우저에 나올겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjHk9hlYiQZMZDhGc4KGj029ViYGYkwCKCMdNaIojZNGNjnJL-Ee1BDbhVrFMi8Z9W402WpXCHRnjmxtaXxXr-CajMiRHVgjbjqG92VhV-8i_tsRQ6DUhYXJV-1JsA_ppi-pxEzyp6wSxYFBhfq6qla3NjHZgfdHT7fY5T_jxyFbWByS99HctgHodBNbys)

그리고 개발 서버의 console 창에는 아래와 같이 나올겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjgzjUL1Fx_SYF4FAZHLhLBQUTF6yWgSHjdKQtchTRr0wIpu36QE40EIRG5R9bd7E99BjY86SF_iny5naNwXMAptdbi_UakJ7kv4pDIrycv6AYeFAInUAVVMwZcRx9Q5xKifCsnQflOKcjXMAeI5EyLV9UnUWhjfI6400_dJE24zBwm4s0iAtBnHMA6w3w)

왜 이렇게 나올까요?

당연히 우리가 아까 server 폴더 밑에 index.ts 파일에 작성한 Hono를 이용한 백엔드 코드에 의해서 "hono-cf-test" 라우팅으로 GET 메서드를 Request하면 Response가 아까 그림처럼 오는겁니다.

아까 코드를 다시 환기시켜볼까요?

```ts
import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono<{ Bindings: Env }>();

app.use("*", cors());

const route = app.get("/hono-cf-test", async (c) => {
  const { kv } = c.env;

  await kv.put("hono-remix-adapter", "hono can access cloudflare kv");
  const value = await kv.get("hono-remix-adapter");
  console.log(value);

  return c.text(
    `Hono kv is ok, value is ${value} ,\n My_var is ${c.env.SECRET}`
  );
});

export default app;

export type AppType = typeof route;
```

위 코드를 잘 보시면 console.log 명령어는 개발 서버의 터미널에 표시됩니다.

그리고 'return c.text' 함수에 의해 Hono는 단순하게 text 값을 Response로 돌려주는데요.

kv 값과 SECRET 변수는 c.env 객체에 의해 접근할 수 있습니다.

Hono에서 c 값은 Context인데요.

이 'c' 값으로 못하는게 없을 정도로 강력한 기능을 가지고 있습니다.

그리고 마지막으로 우리가 만든 "/hono-cf-test" 라우팅을 저장한 route 변수를 export type 형식으로 export 했습니다.

AppType 값이 그것인데요.

이 AppType 값을 Remix에서 사용하는 법을 배워 보도록 하겠습니다.

---

## Client 쪽에서 Hono RPC 기능 이용하기

먼저, '_index.tsx' 파일에서 사용해 보겠습니다.

```ts
...
...
...
import { hc } from "hono/client";
import { AppType } from "server";

...
...

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const env = context.cloudflare.env;
  console.log(env.SECRET);
  const kv_data = await env.kv.get("hono-remix-adapter");

  const client = hc<AppType>(import.meta.env.VITE_API_URL);
  const res = await client["hono-cf-test"].$get();
  const text = await res.text();

  return json({ res: text, secret: env.SECRET, kv_data: kv_data });
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  console.log(data);

...
...
...

  return ()
}
```

먼저, loader 함수를 잘 보시면 context 항목이 인자로 있는데요.

이 context 항목으로 cloudflare.env 에 접근해서 loader 함수 안에서 직접 kv에 접근할 수 있습니다.

그리고 다음 코드를 보시면 client를 만들었는데요.

```ts
  const client = hc<AppType>(import.meta.env.VITE_API_URL);
```

우리가 Hono를 이용해서 Remix와 RPC 통신을 하기 위한 client입니다.

hc 객체를 이용해서 위와 같이 만들면 되는데요.

중요한 거는 URL을 지정하는 겁니다.

위와 같이 '.env' 파일에 지정된 주소를 사용했는데요.

배포시에는 아래와 같이 하면 됩니다

```ts
const client =
  import.meta.env.MODE === "production"
    ? hc<AppType>(import.meta.env.VITE_API_URL)
    : hc<AppType>("http://localhost:5173/");
```

그리고 client를 이용해서 클라이언트 사이드에서 API 엔드포인트에 접근하는 방식은 아래와 같습니다.

```ts
const res = await client["hono-cf-test"].$get();
const text = await res.text();
```

위와 같이 사용하시면 되는데요.

Hono에서 c.text 메서드로 리턴했기 때문에 text 값이 Response 형태로 오기 때문에 위와 같이 하면 됩니다.

그리고 여기서 가장 중요한게, 네이밍(naming) 규칙이 있습니다.

제가 라우팅 주소에 "-" 하이픈을 넣었는데요.

그러면 위와 같이 `client["hono-cf-test"]`처럼 배열안에 해당 라우팅을 넣어줘야 합니다.

만약에 라우팅 주소에 "-" 하이픈을 안 넣었다면 아래와 같이 사용하시면 됩니다.

`client.hono2.$get()`

"-" 하이픈을 넣고 안 넣고는 개발자 마음이니까 편하신데로 하시기 바랍니다.

그리고 마지막으로 $ 표시 뒤에 get 메서드를 적어주고 괄호()를 이어서 넣어 주고 실행해줘야 합니다.

그러면 res 값에 어떤 값이 들어오냐면 아까 server 폴더 밑에 있던 index.ts 파일에서 "hono-cf-test" 라우팅이 리턴한 값이 들어오게 됩니다.

코드를 다시 복습해 보면 아래와 같습니다.

```ts
const route = app.get("/hono-cf-test", async (c) => {
  const { kv } = c.env;

  await kv.put("hono-remix-adapter", "hono can access cloudflare kv");
  const value = await kv.get("hono-remix-adapter");
  console.log(value);

  return c.text(
    `Hono kv is ok, value is ${value} ,\n My_var is ${c.env.SECRET}`
  );
});
```

위와 같이 'return c.text' 방식으로 텍스트를 리턴했습니다.

그래서 한번 더 `await res.text()` 해주면 우리가 원하는 텍스트를 얻게 되죠.

이제 loader 함수에서 데이터를 return 해주면 클라이언트 컴포넌트에서 useLoaderData 훅을 통해 해당 값을 얻고 그 값을 클라이언트 UI에서 사용할 수 있게 되죠.

UI 쪽에서는 아래와 같이 pre 태그를 이용하시면 해당 값을 브라우저에서 볼 수 있을 겁니다.

```ts
<div>{data && <pre>{JSON.stringify(data, null, 2)}</pre>}</div>
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEhQ5uvu0JRPpYswCQrGypqkYC3hEA6_0dT0PFt9cZ9c-Cz7CcI2Rj7Dfb9AX4GY1YfNHStMhYTOBUqasikTBdJ0VjjQWThtlaJ_8CVbKIVbBaJOVFFx4Dn0X3O0GxgFubBiwY44ctQaz8wv6Nzqwh8kEoIhoK26VRSj7ze5QgbaKwcZMVbyOdC0HhBaTlM)

---

## 다른 라우팅 추가하기

Hono app 객체에 체이닝(chaining) 방식을 이용하면 GET, PUT, DELETE 등 여러가지 메서드를 연결시킬 수 있는데요.

왜 체이닝(chaining) 방식을 이용하냐면 바로 해당 route를 export 해서 RPC로 사용하기 때문입니다.

이럴 필요가 없다면 체이닝 하지 않고 따로 만들어도 됩니다.

일단 "hono2"라는 라우팅을 하나 추가해 봅시다.

```js
import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono<{ Bindings: Env }>();

const route = app
  .get("/hono-cf-test", async (c) => {
    const { kv } = c.env;

    await kv.put("hono-remix-adapter", "hono can access cloudflare kv");
    const value = await kv.get("hono-remix-adapter");
    console.log(value);

    return c.text(
      `Hono kv is ok, value is ${value} ,\n My_var is ${c.env.SECRET}`
    );
  })
  .get("/hono2", async (c) => {
    const { kv } = c.env;
    await kv.put("hono", "hono + cloudflare kv");
    const kv_data = await kv.get("hono");
    return c.json({ kv_data: kv_data });
  });

app.use("*", cors());

export default app;

export type AppType = typeof route;
```

위와 같이 테스트를 위해 get 메서드에 "/hono2" 라우팅을 추가했고 이번에는 'return c.json' 방식으로 JSON 객체를 Response로 넘겨주는 코드입니다.

이제 다시 Remix의 Client 사이드쪽에서 해당 라우팅을 RPC를 이용해서 사용해 보겠습니다.

```js
export const loader = async ({ context }: LoaderFunctionArgs) => {
  const env = context.cloudflare.env;
  console.log(env.SECRET);
  const kv_data = await env.kv.get("hono-remix-adapter");

  const client = hc<AppType>(import.meta.env.VITE_API_URL);
  const res = await client["hono-cf-test"].$get();
  const text = await res.text();

  const res2 = await client.hono2.$get();
  const json_data = await res2.json();
  return json({
    res: text,
    json_data: json_data,
    secret: env.SECRET,
    kv_data: kv_data,
  });
};
```

실행해 보면 브라우저에는 아래와 같이 잘 작동할 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjYaNqALS2NAvDy8Jw0XEd73_TjdKbB1WO2w00V0izcsLm9DuJlgwMD729XGKfWsTEDEPCpdQET_jrhmqcfX6yRi4t8oE-BAszkbOU5EG_jvb4rXR2_KANIHglabJGZKSyct74LvcoNeIrwK0uags8-wwFuQmY0MGcpB6xFpyh2Mahud1SGRYzTS9UEH7w)

브라우저 주소창에 직접 넣어도 아래와 같이 잘 작동합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgzC98G6CK85aZ85lQWAomBz36wJoc965JNDzUZQvzlm5vdMAxAPpD4gF37B4uVGT6sV3Hs1vefo23JNenRLgAjfpzY6A5LeyJ6NQ_x-lm1RqTG6jXfIm1dZME1bnraRWotRbbF32cBegt57GZNoMXMhwlk2oKPJAAebt0mMNzvZm6IB7sldKnvvbbEcwc)

어떤가요?

Hono를 이용해서 백엔드 로직을 구현하고 이걸 RPC를 통해 Remix에서 사용하면 전체적인 프로젝트 구조가 깔끔해 질거 같습니다.

이제 테스트를 위해 배포를 해보겠습니다.

---

## 배포시 바꿔줘야하는 코드

실제로 Cloudflare 네트워크상에 배포하기 위해서는 지금까지 손대지 않았던 Worker 파일인 functions 폴더 밑에 있는 '[[path]].ts' 파일을 수정해야 하는데요.

이 파일을 열어보면 아래와 같이 나와 있습니다.

```ts
import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - the server build file is generated by `remix vite:build`
// eslint-disable-next-line import/no-unresolved
import * as build from "../build/server";

export const onRequest = createPagesFunctionHandler({ build });
```

'hono-remix-adapter' 가 나오기 전의 코드라서 이걸 이용해서 바꿔줘야 Hono를 사용할 수 있습니다.

아래와 같이 코드를 전체 뜯어 고쳐 봅시다.

```ts
import handle from "hono-remix-adapter/cloudflare-pages";
import * as build from "../build/server";
import hono from "../server";

export const onRequest = handle(build, hono);
```

잘 보시면 두 번째 줄에 '../build' 폴더의 server를 읽어오라고 되어 있는데요.

이건 바로 Remix Framework를 한 번 빌드 후에 배포하라는 겁니다.

전체 프로젝트를 빌드 해보겠습니다.

```sh
npm run build

> build
> remix vite:build

vite v5.4.8 building for production...
✓ 90 modules transformed.
build/client/.vite/manifest.json                0.88 kB │ gzip:  0.28 kB
build/client/assets/root-B_1_sH98.css          11.28 kB │ gzip:  3.13 kB
build/client/assets/root-CaTRkQRG.js            1.69 kB │ gzip:  0.96 kB
build/client/assets/entry.client-Cozv9kLj.js    3.70 kB │ gzip:  1.40 kB
build/client/assets/_index-BMyKsDHR.js          5.78 kB │ gzip:  2.48 kB
build/client/assets/components-DfR3FStY.js    253.81 kB │ gzip: 81.71 kB
✓ built in 757ms
vite v5.4.8 building SSR bundle for production...
✓ 6 modules transformed.
build/server/.vite/manifest.json                0.22 kB
build/server/assets/server-build-B_1_sH98.css  11.28 kB
build/server/index.js                           7.07 kB
✓ built in 40ms
```

빌드 후의 구조를 tree 명령어로 볼까요?

아래와 같이 나옵니다.

```sh
tree ./build -L 2
./build
├── client
│   ├── _headers
│   ├── _routes.json
│   ├── assets
│   └── favicon.ico
└── server
    ├── assets
    └── index.js

5 directories, 4 files
```

server 폴더에 Remix를 구동하는 서버가 있을 거고, client 쪽에는 React를 이용한 클라이언트 쪽 코드가 있는겁니다.

이제 실제 배포 해봅시다.

---

## Cloudflare에 배포하기

배포 명령은 "npm run deploy"라고 하시면 터미널 상에서 쉽게 배포할 수 있습니다.

cloudflare 상에 로그인되어 있지 않으면 로그인하라고 나올겁니다.

지시에 따르면 아래와 같이 잘 배포될 겁니다.

```sh
npm run deploy

> deploy
> npm run build && wrangler pages deploy


> build
> remix vite:build

vite v5.4.8 building for production...
✓ 90 modules transformed.
build/client/.vite/manifest.json                0.88 kB │ gzip:  0.28 kB
build/client/assets/root-B_1_sH98.css          11.28 kB │ gzip:  3.13 kB
build/client/assets/root-CaTRkQRG.js            1.69 kB │ gzip:  0.96 kB
build/client/assets/entry.client-Cozv9kLj.js    3.70 kB │ gzip:  1.40 kB
build/client/assets/_index-BMyKsDHR.js          5.78 kB │ gzip:  2.48 kB
build/client/assets/components-DfR3FStY.js    253.81 kB │ gzip: 81.71 kB
✓ built in 776ms
vite v5.4.8 building SSR bundle for production...
✓ 6 modules transformed.
build/server/.vite/manifest.json                0.22 kB
build/server/assets/server-build-B_1_sH98.css  11.28 kB
build/server/index.js                           7.07 kB
✓ built in 38ms
The project you specified does not exist: "hono-remix-test". Would you like to create it?"
❯ Create a new project
✔ Enter the production branch name: … main
✨ Successfully created the 'hono-remix-test' project.
▲ [WARNING] Warning: Your working directory is a git repo and has uncommitted changes

  To silence this warning, pass in --commit-dirty=true


✨ Compiled Worker successfully
🌏  Uploading... (9/9)

✨ Success! Uploaded 9 files (2.89 sec)

✨ Uploading _headers
✨ Uploading Functions bundle
✨ Uploading _routes.json
🌎 Deploying...
✨ Deployment complete! Take a peek over at https://5964b06f.hono-remix-test-5jr.pages.dev
```

중간에 "Create a new project" 부분에서 엔터키를 누르고,

그 다음 branch name 부분에서 그냥 엔터키를 누르면 됩니다.

이제 Cloudflare 대시보드로 가볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEipdBs-CigieKNKwkx6HFLQCDJjzepNzY5YpSYy06UG-Aj4Decl91G_vT7UQZquBLQGvzo4n6zJn-0PjxeaUuT5BLwRRJkpa2HuroQxaju8rjZd-RzWs_bujnforjqjXZi6xd83EdFQ7LfY00wb_5MA4WDFR4UPiHKFCKgbTj3M-lRaOI_3C-uVof_eorM)

위와 같이 성공적으로 우리가 만든 프로젝트가 배포되었습니다.

주소를 보면 임시주소와 정식주소가 있는데요.

정식 주소는 "hono-remix-test-5jr.pages.dev"입니다.

이제 이 주소를 이용해서 아까우리가 '.env' 파일에 책정한 'VITE_API_URL' 값을 환경변수 값에 저장해야 하는데요.

Cloudflare 대시보드의 Settings 부분으로 가 보시면 아래 그림과 같이 우리가 wrangler.toml 파일에 지정했던 vars 값과 kv 값이 보일겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEj-IdaYbNPGx2SyzH_sz4McodmDSIN-nIW2CPDKeQmrRQ4SvTDmwxjUa8HAqYlixA_-LtmWWE0tQ2avod91BBwfvXLx3s81eGnftf1tdCZqaGyVP4KlSjR5K-azwM_2PCJ_IPQjIW0PUoV6snrkXT4WAJwDwj0EJI7BGT7dH6WmfkUSdQtWFyUMdgtiKfE)

여기서 'VITE_API_URL' 값을 추가하면 됩니다.

화면 상단에 'Add' 버튼을 누르면 아래와 같이 나오는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEirLtZg7e-ghlWH_H7qhBDGD3H7UqW4aNXVEeYBNcqORNtklZ9_kZrgd330GfTWVa1MiXhTuqQ4YtsGObCKhKGffMBGUdmkd79gIDtNVKgfUenm6C7yfbeujO8eXee9xEEUMT7xCrNEeDawS2xPn1pHgXCoDwGk81c4Pozk1NmtN1q1W-bAI2_TMi066vA)

위와 같이 입력하면 'Save' 버튼을 눌러야 하는데 눌려지지 않습니다.

Encrypt 하면 비로소 저장이 되는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEg4lX-jElzfjve-qL2ujdm3eYr0CclRhYbJKzsuNCeyKAhhngXDSQc7O77i7veeCoctmPpit5noi2Y1lNpnhexN4EHdDQe1jpX6xiKtGV1mGJArwvBc2wV0lIVIsQqQJoHJJn1sWE-cZsR8nK7AZIeUmi4A0i3JfUyQAo6hDqGEC1Bq_qQbC1BZVa3MsV0)

위와 같이 환경변수 세팅이 완료되었습니다.

이제 'hono-remix-test-5jr.pages.dev' 주소로 가 볼까요?

서버 에러가 뜨는데요.

왜 그런가 하면 Cloudflare Pages의 기본 성질때문입니다.

Cloudflare 대시보드 상에서 설정한 환경변수는 Remix에서는 context.cloudflare.env 객체를 통해 접근가능합니다.

'import.meta.env'를 통해서 접근할 수 있는 환경변수가 아니기 때문입니다.

Cloudflare 네트워트 상에서는 '.env'에 있는 민감한 데이터는 Worker의 Env 인터페이스로 접근이 가능한데, 그래서 Remix Framework의 클라이언트 쪽에서는 'context.cloudflare.env'로 접근해야 합니다.

우리가 '.env' 상에 있는 값는 VITE_API_URL인데요.

VITE_API_URL은 클라이언트쪽에서 접근하기 위한 환경변수라서 백엔드쪽에서는 접근이 안되는 거죠.

사실 VITE_API_URL은 그다지 민감한 정보가 아닙니다.

그래서 실제로 API_URL을 하드코딩해서 코드를 짜도 상관없죠.

일단은 로컬 컴퓨터에 있는 '.env'값에 아래 주소를 넣고 다시 deploy하면 서버가 제대로 작동할 겁니다.

```sh
VITE_API_URL=https://hono-remix-test-5jr.pages.dev/
```

터미널상에서 바로 Cloudflare 상으로 deploy 했기 때문에 가능한거죠.

만약, Github 리포지터리에서 할거라면 wrangler.toml 상에 vars 값으로 관리하는 게 더 좋습니다.

오늘은 테스트기 때문에 로컬 상 '.env' 파일에 실제 배포 주소를 넣고 다시 deploy하는 걸로 마무리 하겠습니다.

실행 결과는 아래 그림과 같이 제대로 작동하는 걸로 나올겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjvKzic_pGhFV43CJGk5dfz3iigHY-h_jz_54boRPx2yRNmilwztrpz53nD9LN7RzEfTWioyZFGhxSTRNl5Vcfm8i4L85GS4GGA4AbkHgfMzZmPItRJQpbG4gZJzMAkIMC5oWj8rd2Tt82tbU3qsP9ZZAeOp6xCTdY-utjET0XlRAUauuu0wtR9N-xbCYU)

그러면 API Endpoint도 접근해 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEgtXVUfsrYE2HzdwTrPkOnhNFZTB4S0Z8q0cdUtXPGc_yM9hZMqc9UkQ4kPSsBPgkP5N7Bv2FcCbksq0UYvFmWKOuNK4T7n584Gilu2rdB57NaUiZjFc6LLzHmKvOPXn3ZTw5k0yrv_RXK-u-SjwDVse7yw2g6i2MLG5nO1pFFGr1IasIj5AN7BFVYWkNQ)

![](https://blogger.googleusercontent.com/img/a/AVvXsEjaK2XT0-ZpJIz5Efj4SDdq6GZer2yBVMDfErWhURTBKU6VUiynZ9ER_aeSkWSTSmlpSk6oBZkWz9WxQMDnf-c8_7DHMgrtLAsZsmSwjfkKmZ0M0n7dmDgiEf_gn-wZ2m5cFMx8KT1ZFBm5VY1nGz1wY7pP7sK5OI1rTjBSRzfD7kyurEJ9JqG-DUiW0W4)

아주 잘 작동하네요.

---

지금까지 Remix Framework을 Cloudflare에 배포하는데, API Endpoint를 Hono로 작동하는 방법에 대해 알아봤습니다.

다음 시간에는 D1 DB를 이용해서 실제 Todo 앱을 작성해 보겠습니다.

그럼.

