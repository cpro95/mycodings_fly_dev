---
slug: 2024-02-25-fullstack-tutorial-remix-cloudflare-with-kv-and-github-server
title: 풀스택 강의 6편. Remix로 Github 저장소를 DB로 이용해서 KV와 함께 Cloudflare에 배포하기
date: 2024-02-25 08:38:15.111000+00:00
summary: 풀스택 강의입니다. Remix + Cloudflare + Github + KV
tags: ["fullstack", "remix", "cloudflare", "kv", "github"]
contributors: []
draft: false
---

안녕하세요?

풀스택 강좌를 오랜만에 하나 하게 됐네요.

전체 강의 리스트입니다.

1. [풀스택 강의 1편. Cloudflare Pages + Workers + D1 + React로 풀스택 개발하기](https://mycodings.fly.dev/blog/2023-12-06-introduction-cloudflare-pages-workers-d-1-react-full-stack)

2. [풀스택 강의 2편. Cloudflare Pages 안에서 Workers를 이용한 D1 DB 제어하는 API 만들기](https://mycodings.fly.dev/blog/2023-12-09-fullstack-cloudflare-pages-workers-d-1-react-part-2)

3. [풀스택 강의 3편. AstroJS와 Cloudflare Pages, D1, Drizzle ORM으로 개발하기](https://mycodings.fly.dev/blog/2023-12-09-fullstack-astrojs-cloudflare-pages-d-1-drizzle-orm)

4. [풀스택 강의 4편. Remix + Cloudflare Pages + D1 DB + Drizzle ORM](https://mycodings.fly.dev/blog/2023-12-10-fullstack-remix-cloudflare-pages-d-1-db-drizzle-orm)

5. [풀스택 강의 5편. Next.js 서버 렌더링을 이용하여 Cloudflare Pages로 배포하기(D1 DB, Drizzle ORM)](https://mycodings.fly.dev/blog/2023-12-30-fullstack-tutorial-nextjs-cloudflare-with-d-1-db)

6. [풀스택 강의 6편. Remix로 Github 저장소를 DB로 이용해서 KV와 함께 Cloudflare에 배포하기](https://mycodings.fly.dev/blog/2024-02-25-fullstack-tutorial-remix-cloudflare-with-kv-and-github-server)

7. [풀스택 강의 7편. Vite React 템플릿을 Hono를 이용하여 풀스택 앱으로 개조하기](https://mycodings.fly.dev/blog/2024-03-03-fullstack-tutorial-transform-vite-react-app-with-hono-framework)

---

최근에 Remix 쪽에 괜찮은 템플릿이 하나 나왔는데요.

`edmundhung`이란 홍콩분이신데요.

conform이란 validation 라이브러리를 만든 분인데요.

Remix쪽에 관심이 많은 거 같습니다.

사실 React로 풀스택을 아주 쉽게 구현해 주는게 Remix 밖에 없죠.

이 Remix를 Cloudflare와 연결시키려는 시도가 아주 많은데요.

`Edmund Hung` 이 분도 새로운 걸 하나 만들었습니다.

[remix-cloudflare-template](https://github.com/edmundhung/remix-cloudflare-template)

위 링크로 가시면 Github 리포에 갈 수 있는데요.

All-in-one remix starter template for Cloudflare Pages라고 합니다.

제가 이걸 대충 살펴보니까 기본적으로 Github API를 이용해서 원하는 마크다운 파일을 불러오고, 해당 마크다운 파일을 Markdoc이란 라이브러리로 파싱해서 파싱한 정보를 Cloudflare KV에 올립니다.

KV에 put할 때 캐시 시간을 60분으로 둡니다.

그래서 60분 이내 같은 라우팅으로 GET 리퀘스트가 오면 Cloudflare는 캐시된 값을 빨리 보여줄 수 있죠.

그리고 Remix의 서버는 Cloudflare Pages에서 Functions 방식으로 돌아가게 됩니다.

예전에 Remix와 Cloudflare 그리고 D1 강좌를 올렸을 때도 같은 건데요.

제가 이 템플릿을 보고 기쁜 점은 바로 제 블로그가 사실 이 방식으로 작성됐다는 겁니다.

제 블로그는 Fly.io에 파싱된 마크다운 정보가 Sqlite에 저장되고 Remix 서버는 fly.dev에서 운영되는 형식인데, Github에 마크다운 파일을 올리면 알아서 새로운 마크다운 파일만 파싱해서 Fly.io의 sqlite에 저장시켜주는 형식입니다.

예전에 블로그에서 제 블로그 관련 글을 쓴적이 있습니다.

Remix-Cloudflare-Template를 조금 더 발전 시키면 제 블로그 형식을 Cloudflare에 적용시킬 수 있을 거 같네요.

그 때 가서는 KV 말고 D1 데이터베이스를 이용하면 되구요.

자, 이제 한번 이 템플릿을 테스트해 보겠습니다.

** 목 차 **

- [설치](#설치)
- [Cloudflare에 배포하기](#cloudflare에-배포하기)
- [KV 세팅](#kv-세팅)
- [다시 배포](#다시-배포)

---

## 설치

```bash
➜  npx create-remix@latest --template edmundhung/remix-cloudflare-template

 remix   v2.7.2 💿 Let's build a better website...

   dir   Where should we create your new project?
         ./remix-cloudflare-template

      ◼  Template: Using edmundhung/remix-cloudflare-template...
      ✔  Template copied

   git   Initialize a new git repository?
         Yes

  deps   Install dependencies with npm?
         Yes

      ✔  Dependencies installed

      ✔  Git initialized

  done   That's it!

         Enter your project directory using cd ./remix-cloudflare-template
         Check out README.md for development and deploy instructions.

         Join the community at https://rmx.as/discord

➜  cd remix-cloudflare-template
```

정확히 `edmundhung` 이 분의 템플릿을 사용했습니다.

README 파일을 보면 맨 먼저, wrangler.toml 파일을 설정하라고 합니다.

```bash
cp wrangler.toml.example wrangler.toml
```

wrangler.toml 파일을 보시면 아래와 같이 나옵니다.

우리가 사용할 kv_namespace와 vars가 있죠.

vars는 `.env` 파일에 넣어두는 극비 자료와 같은 겁니다.

wrangler.toml 파일은 `.gitignore`에 들어가 있어서 github에 유출 될 일이 없으니 걱정하지 마십시요.

```bash
name = "remix-cloudflare-template"
compatibility_date = "2024-02-11"
kv_namespaces = [
  { binding = "cache", id = "cache" }
]

[vars]
GITHUB_TOKEN = ""
```

그리고 kv_namespaces에 보시면 binding이란게 보이는데요.

이 binding이 바로 우리가 코드에서 사용할 바인딩 값입니다.

그리고 id는 실제 kv_namespaces를 만들면 cloudflare가 제공해 주는 유니크한 id입니다.

이 템플릿은 바인딩 이름으로 `cache`라는 이름을 쓰고 있으니까 이 이름은 바꾸지 마십시요.

그리고 `remix-cloudflare-template`라고 되어 있는 `name` 부분은 바꿔도 됩니다.

README파일에서 얘기하는 두 번째로 실행할 명령어는 개발 서버를 돌리는 건데요.

```bash
npm run dev
```

실행하면 아래와 같은 에러가 날 겁니다.

```bash
> dev
> remix vite:dev

failed to load config from /Users/cpro95/Codings/Javascript/remix-test/remix-cloudflare-template/vite.config.ts
file:///Users/cpro95/Codings/Javascript/remix-test/remix-cloudflare-template/vite.config.ts.timestamp-1708846182387-585dec7ad60ea.mjs:4
  unstable_cloudflarePreset as cloudflare
  ^^^^^^^^^^^^^^^^^^^^^^^^^
SyntaxError: Named export 'unstable_cloudflarePreset' not found. The requested module 'file:///Users/cpro95/Codings/Javascript/remix-test/remix-cloudflare-template/node_modules/@remix-run/dev/dist/index.js' is a CommonJS module, which may not support all module.exports as named exports.
CommonJS modules can always be imported via the default export, for example using:

import pkg from 'file:///Users/cpro95/Codings/Javascript/remix-test/remix-cloudflare-template/node_modules/@remix-run/dev/dist/index.js';

    at ModuleJob._instantiate (node:internal/modules/esm/module_job:124:21)
    at async ModuleJob.run (node:internal/modules/esm/module_job:190:5)
```

이 에러는 다름 아니라 Remix도 번들러를 Vite로 개편중인데요.

아직 Vite를 이용한 정식 버전이 안 나와서 그런겁니다.

이제 vite.config.ts 파일을 열어 아래와 같이 바꿔 주면 됩니다.

공식 Remix 홈페이지에서 정보를 얻은 겁니다.

```ts
import {
        vitePlugin as remix,
        cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
} from '@remix-run/dev';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
        plugins: [
            remixCloudflareDevProxy(),
            remix(),
            tsconfigPaths()
        ],
        ssr: {
                resolve: {
                        externalConditions: ['workerd', 'worker'],
                },
        },
});
```

이제 다시 `npm run dev`로 개발서버를 돌려볼까요?

포트 5173으로 들어가 보면 리믹스 서버는 잘 돌아가는데요.

중간에 `cache` 부분이 에러라고 나옵니다.

즉, Cloudflare의 KV Namespace 관련인거 같네요.

README 파일을 계속 읽어가면 테스트 부분이 나오고 그 다음에 wrangler를 이용한 개발 서버를 돌리는 부분이 바로 다음에 나오는 부분입니다.

```bash
npm run build && npm run start
```

즉, 빌드 한번하고 start 시키네요.

start는 아래 부분입니다. 

```json
"start": "wrangler pages dev ./build/client",
```

`wrangler pages dev` 명령어를 이용하네요.

이 명령어를 이용하면 Cloudflare 관련 KV 라던가 D1 부분을 로컬에서 미믹할 수 있습니다.

이제 실행해 볼까요?

```bash
✨ Compiled Worker successfully
 ⛅️ wrangler 3.29.0
-------------------
Your worker has access to the following bindings:
- KV Namespaces:
  - cache: cache
- Vars:
  - GITHUB_TOKEN: ""
[wrangler:inf] Ready on http://localhost:8788
⎔ Starting local server...
Parsed 1 valid header rule.
[wrangler:inf] GET / 200 OK (392ms)
```

위와 같이 나오면서 브라우저를 'b' 버튼을 눌러 불러보면 브라우저에 뭔가 크게 나옵니다.

README.md 파일을 마크다운 파싱해서 브라우저에 뿌려주고 있네요.

KV 쪽을 한 번 살펴볼까요?

`.wrangler` 폴더로 들어가시면 `state/v3` 폴더 밑에 `kv` 폴더가 있습니다.

거기 `cache`라는 이름이 있는데 이게 우리가 아까 바인딩 했던 그 이름입니다.

그리고 `cache` 폴더 밑에 이상한 문자열의 파일이 있는데요.

열어보시면 그게 바로 README.md 파일입니다.

근데 이상하죠.

README.md 파일을 로컬에서 불러온게 아닌거 같은데, 어디서 가져왔죠.

이 템플릿이 GITHUB쪽과 관련된 서버사이드 코드는 모두 `app/services` 폴더에 있는 두개의 파일로 작동합니다.

거기 `github.server.ts` 파일을 읽어 보시면,

```ts
export const metadata = {
	repo: 'remix-cloudflare-template',
	owner: 'edmundhung',
};
```

코드 초창기 부분에 metadata가 위와 같이 상수로 적혀있습니다.

이제야 의문이 풀리네요.

원작자인 `edmundhung`님의 `remix-cloudflare-template` 리포에서 README.md 파일을 읽어오고 있네요.

이걸 한번 바꿔보십시요.

본인의 아무 리포에서 README.md를 가지고 올 수 있게 본인 아이디랑 리포이름만 바꾸십시요.

개발 서버를 다시 끄고 build와 start를 다시 해 보십시요.

그런데 아무 바뀐게 없을 겁니다.

왜냐하면 KV가 캐시된 부분을 가져오기 때문이죠.

아까 봤던 `.wrangler/state/v3` 폴더에서 cache 된 파일을 강제로 지우고 다시 시작하면 됩니다.

이제 제가 임의로 지정한 제 리포의 README.md 파일이 보이게 되는데요.

한글 부분이 깨집니다.

분명히 root.tsx 파일에서 캐릭터 셋도 'utf-8'로 세팅했는데, 이상합니다.

root.tsx 파일의 html 태그 부분의 lang 부분도 'ko'로 바꿔도 한글 문제가 해결되지는 않네요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEh6P5COAowEVRNm6G29ryLJMrrhiG-AtUDfsCX5PHsbMvI1VhDUr9VmNyNxUfKk-vyqcG6a_NqGJT9JhzuR748DMjWpIWBk4quZQ2KciN2Hwh7nVq92ZuJmdTCUL5TjEkKS6t7LZcuOL1qtuHR2HigKPx4tNs5UYlA28i5wYpd3TKcQ3OOOXJIIqkFCg24)

위와 같이 한글이 깨져나옵니다.

이 부분은 textDecoder 부분으로 바꿔야 하는데요.

`github.server.ts` 파일에서 읽어오는 함수인 `getFileContent` 함수의 마지막 부분인 return 부분을 주석처리하고 아래와 같이 바꿔서 코드를 작성합니다.

```ts

export async function getFileContent(options: {
...
...
...

    // return atob(file.content);

    // Decode using custom UTF-8 decoding function
    const content = decodeUTF8(file.content);

    return content;
}
```

그리고 `github.server.ts` 파일의 마지막 부분에 아래 함수를 추가합니다.

```ts
function decodeUTF8(base64: string): string {
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);

        for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
        }

        // Use TextDecoder to handle UTF-8 decoding
        return new TextDecoder('utf-8').decode(bytes);
}
```

base64로 해싱한 데이터를 'utf-8' 디코딩하는 함수입니다.

이제 다시 해볼까요?

꼭 `.wrangler` 폴더 밑에 캐시된 파일을 지우고 테스트 합시다.

```bash
npm run build & npm run start
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEiY0HBCGFL8OKyQzHd7bctslcxLHFUHXVyzVSG-x6iU4JIegMYkUpYOTuBIAsrFl_pSfm09M33Zr1-uC25s2KR3XmrTy2RiZYuUQ2ra8iGOta5oi-954LfblbSBLa8MHc105Fmzqs4gmpZNAXuHIhDD7H1jo30MVJVr91VqZhWDiC6zDSedj5xgzK25Uh4)

위와 같이 나오네요.

wxrenamer 프로젝트는 예전에 wxWidget로 만든 windows 애플리케이션입니다.

감회가 새롭네요.

요즘은 윈도우 로그인 할 일이 없으니까요.

그리고 UI도 QT나 wxWidget 같은걸 많이 공부했었는데요.

요즘은 일렉트론이나 Rust쪽의 Tauri나 Golang쪽의 wails 같은 패키지를 사용하면 웹 테크로 쉽게 UI를 꾸밀 수 있어 너무 편하네요.

일단 로컬쪽에서는 KV와 그리고 github.server쪽에서 데이터 가져오는 것도 잘 됩니다.

그럼, 이걸 실제 deploy 했을 때 즉, cloudflare 서버쪽에서 실행해야 하는데요.

지금까지 작성했던걸 github에 신규 저장소로 올리겠습니다.

왜냐하면 Cloudflare에 배포하기 쉽거든요.

Wrangler로 로컬에서 Deploy할 수 있지만 어차피 github에 올릴거라 그게 나중을 위해 더 좋습니다.

---

## Cloudflare에 배포하기

일단 github에 리포로 저장했으면 Cloudflare 대시보드에서 아래 그림과 같이 애플리케이션을 만듭니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEj8RhlW9Rlrq2SV8wm2YL0HN0DnPe3B-7RoNLoT5kGg00SR9Q1bkFwLOkueVp6d4o1H0Uyh7s7zpfoOYqwqP2z4zKPQQQ8IGQVMoMD-uRfQwneAFMfmaM6DOUwYNuKoh6xCWDWkJnKyrsy2W0VADoI-LT_GhJfsYBL41QK0aEqdRu5oJ2Jlx5LStsn5d6Y)

그리고 아래 그림과 같이 Pages부분에서 "Connect to Git"을 누릅니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhv5TTZsoBMjgTXQMcw18MeM5VnHmgSK0NlPIub1uGDIftjG_wPLdSG-1PKfhNP0cOwqrMsK7Wrz7yUwZ614SuykDi3MdEuKSHL_DD7Cv6ntB-eqsowC8CNQpSMHWSyNSOXnZ2JSurTH50TbgMgCdKTzHcDLK9VehCGCM_XK3opEpUNKx93V-61l3DVhT0)

그러면 아래와 같이 제 github 계정에 있는 모든 리포가 나오는데요.

방금 저장했던 리포는 맨 위에 있으니 고르기 쉽습니다.

아래와 같이 해당 리포를 고르로 진행시키면 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEinA-Bf9FIJjSqG7nwi6wUU2qAup_6NYOh4KFrLfyXhAx2wy7PH9aTVe_QmfvEElQa3Rg_L480_2BoKrrdfrURHpqgpqU_guwSG-twd9fNdjsS3cVjIoNjLGIQ3q7NkHoj4PQkmwZSO2oDn-YxnplCLhKS6sJMZIborltB9MECMKFn8yueZ_78qSZvQ0N4)

그리고 빌드 부분인데요. 여기가 가장 중요합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEg2QOvhtcJreIkATl6JTODP0A13jLyLt1Gu4EdALaRWlT9II_74zZhnJlVT-GnethlutBW4tKKZOCN5O-q2f8XcbMbZGJbqgLdO3kx6NYddmuDZmI7A1fiBioc8BFd2rhDPu_S9z9l-MqKu-XxLOhTEzrEC-KJDjPeSXbjZjShoW1-VIPSFettlzdMZFrc)

위 그림과 같이 프레임워크를 Remix라고 고르면 되는데요.

Build output directory 부분만 위 그림과 같이 `build/client` 라고 적으셔야 합니다.

Cloudflare에서만 그런거니까 이해해 주시기 바랍니다.

이제 아래 그림과 같이 배포작업이 이루어지게 되면서,

![](https://blogger.googleusercontent.com/img/a/AVvXsEgT_x5w6FmCyU0B-UjPmi4ad6KHTQ2b84bO-hefMX_Odrhv4_uBBt5dhMxy1z73K19NFqgO7SkZGABuIsLcFwCy0DMlzfM9LWcSpb3LGz-3c_BwoazYqj5gF4FBhajHINwjcckxRjkF7B-262ikx0QhbfrhIK5HZENAErBLwzwnCrZzIfS7vjBqGtYry0E)


최종적으로 pages.dev 도메인을 갖는 아래 홈페이지가 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEinw8WnFRSSoNQd82o62TSZ34PKTvob-V1SL2KtjSAiRxbum36XjgEgm15Y_rSqF1a9xZ5KDW4HhvZjTzVpHnTQ1X_l9RJ0Zh3mwZejRMLk-pK4wiKrgB2OLYCRvWo2KbeDwNbOs2CmJQowbcA-26NGxErc0l9btivILPJX63jddB52mNoDtqedZDY9BYE)

근데, 에러가 났네요.

걱정마세요.

KV 쪽을 안 건들어서 그런겁니다.

---

## KV 세팅

KV를 만드려면 Cloudflare 대시보드로 가서 아래와 같이 KV 쪽으로 가면 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEg8jyn437Az154PZ_UETZEmrgQb51SS7ejvdaWsug9GKM8N7CevWGVApBsVQzUXxi2Yi15y9GF0-yZxvvpizlDtaWMi6dA2WkxZz4fGJ1aMFOU1S4oaBSLnTvFx806Oc8z0MRA8k0sW3DWR8zp9S_YjD_bAst98owgg_-tBYp_tQvtPYMpbOwxvuhWV5Zc)

위에서 Create a namespace를 눌러서 아래와 같이 특정이름으로 만들면됩니다.

저는 `remix-cloudflare-template`라고 이름지었는데요.

아무이름이나 상관없습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEitzuFf1fRsaN59OSwdNZcgKI__q67Kz8EoZ_zLBgcFKgZ_YR3nWvt5wD0YIfoDE8tShNkL-Eaaq5uiZvNu78krr200QYL6OvnYXFlOmlJ9SeZ6dVG9a5QDKSriEdb44u17LyHoNhF4fEUe_CkDtXhqPfgNXPvyzROUdiPTqCfnIWyJ9-fndjdAAOeK-zo)

위 그림에 보시면 Namespace ID가 보이시는데요.

이 ID 값을 wrangler.toml 파일에 붙이시면 됩니다.

```toml
name = "remix-cloudflare-template"
compatibility_date = "2024-02-11"
kv_namespaces = [
  { binding = "cache", id = "9de9e6fbaa38419a91b9c6cbe8abb93f" }
]
```

이제 KV쪽 바인딩을 Functions 쪽 세팅에 연결 시켜야 합니다.

Cloudflare쪽 Pages에서 아까 만든 우리 사이트의 Settings으로 들어가서 아래와 같이

Functions 부분을 선택하고 그 밑에 KV 쪽을 아래와 같이 세팅하면 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhKMt-yEd-qyvODy38darptcMXlfQYGKkfWv7rNZe7Oiyzpy3VLL-OXVk2F0jjtDVHZ8RMLCOhunvD31Sjbo2yYEduFD4JVNuPuQPYjHHvW7T0bDBF9AGy2BSzf1nxaNHs30DRCqCUzXLL-nm3rwXMdK48QIHUZKlLIzBHg5Ic0uj60TYLQ9PTJ7IMddbY)

우리가 코드에서 사용하는 바인딩은 'cache'라는 이름입니다.

위에 'cache'를 넣고 아까 만든 KV를 고릅니다.

그리고 저장하면 아래와 같이 나오는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjCRaAmXwzekcsCbrABD3DjOn2ekZZSXjM0Q4vWHuiK7UOCohhneYqqIYvRY6ol2srhMn0xbpzukNNKVioZmKScfArNaf1uUQ0PZ_mRK9bhDWepNR-v2MDEzXsV3rZcOCMPZfeeq2gPcpx7_hV6UIXRuZ6RvTxPkR48K3sz9sllK3BtJjoIC33pR4xK-ec)

이제 KV 쪽은 마무리가 됐네요.

---

## 다시 배포

이제 준비가 다끝났는데요.

GITHUB_TOKEN 세팅은 못했네요.

이거 없이 진행시켜 보겠습니다.

먼저, Cloudflare 쪽에서 Deployment 부분을 누르면 아래와 같이 나오는데요.

여기서 `Manage Deployment` 부분을 누르면 `Retry Deployment`가 나옵니다.

이걸 누르면 쉽게 재 배포할 수 있습니다.

이걸 눌러 재 배포하고 배포된 페이지로 이동해 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEgZBZbYwm5hIzV94Yj5exJG3XouZLHWUCtFV4cjRsW87ZP9CQsvyqSs2iPFh6KgsFf-8oYGYbA-lqwI7kgahD5CrTxKdoJPUwmF6xJe0HbxkRsVnDPbjardtwXUjAdzzbKsmlhGl1W39kH21YYVKfkphO43b21TRZbtchLzpNV254Ym9i7opA8DoKZNlt0)

위 그림과 같이 아까 로컬 개발 서버에서 테스트했던 그 부분이 나옵니다.

대 성공인데요.

그러면 왜 `edmundhung` 이 분은 GITHUB_TOKEN이 필요하다고 했을까요?

이게 왜 그런거냐면, Github 리포가 public일 경우 `api.github.com` 서비스에 의해 외부로 모든 데이터가 공개되는데, Github 리포가 private일 경우 `api/github.com` 서비스에서 접근하지 못합니다.

그래서 private한 리포를 사용하고 싶을 때는 GITHUB_TOKEN을 세팅하면 됩니다.

GITHUB_TOKEN 세팅하는 방법은 아래와 같습니다.

먼저, Pages의 세팅으로 가셔서 Environment variables 부분을 고르면 아래와 같이 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjDgslAjfZpa_l3iRtgQ0gizAldcQV06XHTN2rERCesZ4UP-_Na3YINIqybON6L-35NJeIoAN7qcrnaheiAMFoIgDqT7pcFSuF2QdxSg8aqX0fqtHGNAFoScWP4V_nAUiNi_zqAQ-Vmg4ftO1V-r1oAQk4uD2yGHtinYmiODqPkmbv7VivCp7NAJtD0uJ8)

위 그림에서 `Add` 버튼을 누르고 아래와 같이 입력하시면 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgRyQWs9JfXg0-76tQZcfvhQFu55FFLNex423oOkAMH5jm4n4rPPseR6fZ6AaF56qSwgUjjeyD70vOPnw_5eWEzsSjUpMJLj8zoLk8vTnVTGZs8EOPqtQJ9P-aKRwr2W7_PyfzwLmcVdzxXQcJjdOW-N8WyIL9KmPjwAPxPfAy2ohh7t4MvQPpa97QtIgU)

위와 같이 입력하시고 저장하면 됩니다.

이렇게 새로운 Cloudflare 세팅부분을 건드리면 무조건 재배포해야합니다.

---

지금까지 아주 흥미로운 Remix 템플릿을 살펴봤는데요.

제가 이 템플릿을 확장해서 현재 사용하고 있는 블로그 같은 방식으로 확장해 볼까합니다.

다음 시간까지 아주 오랜 시간이 걸리겠네요.

그럼.


