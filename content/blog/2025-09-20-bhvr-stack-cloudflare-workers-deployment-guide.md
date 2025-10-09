---
slug: 2025-09-20-bhvr-stack-cloudflare-workers-deployment-guide
title: BHVR 풀스택 앱을 Cloudflare Workers에 배포하는 완벽 가이드
date: 2025-09-21 14:24:17.453000+00:00
summary: Bun, Hono, Vite, React로 구성된 BHVR 스택을 활용해 풀스택 앱을 만들고 Cloudflare Workers에 배포하는 방법을 실전 예제와 함께 상세히 설명합니다.
tags: ["BHVR", "Cloudflare Workers", "Hono", "React", "Bun", "Vite"]
contributors: []
draft: false
---

안녕하세요?<br />

오늘은 제가 예전부터 관심있게 지켜봤던 'BHVR 스택'을 실제로 사용해보려고 하는데요.<br />

이 스택은 현재 존재하는 가장 가볍고 빠른 기술들을 모두 모아놓은 조합입니다.<br />

## BHVR이 뭐길래

BHVR은 번(Bun) + 호노(Hono) + 바이트(Vite) + 리액트(React)의 약자인데요.<br />

각각의 기술이 자기 분야에서 최고의 성능을 자랑하는 녀석들입니다.<br />

공식 홈페이지도 있는데요.<br />

[https://bhvr.dev/](https://bhvr.dev/)에서 자세한 정보를 확인할 수 있습니다.<br />

저는 여기서 더 나아가서 이 모노리포 앱을 실제로 '클라우드플레어 워커스(Cloudflare Workers)'에 배포하는 방법까지 다뤄보려고 하는데요.<br />

클라우드플레어 워커스는 빠르면서도 무료 티어가 넉넉해서 서버리스 앱을 배포하기에 정말 최적인 플랫폼입니다.<br />

그럼 본격적으로 시작해볼까요?<br />

## BHVR 템플릿 설치하기

```sh
# 명령어 실행
bun create bhvr@latest

  _     _
 | |   | |
 | |__ | |____   ___ __
 | '_ \| '_ \ \ / / '__|
 | |_) | | | \ V /| |
 |_.__/|_| |_|\_/ |_|

ℹ 🦫 Lets build 🦫                                                                                            
ℹ https://github.com/stevedylandev/bhvr                                                                       

# 이름 정해주고
✔ What is the name of your project?
bhvr-test

# 템플릿은 shadcn/ui로 선택
✔ Select a template:
shadcn (Basic setup + TailwindCSS + shadcn/ui)

# Hono RPC 선택하고
✔ Use Hono RPC client for type-safe API communication?
Yes

# 린터는 최근 가장 핫한 Biome 선택
✔ Select a linter:
Biome

# 클라이언트 라우터는 TanStack Router 선택
✔ Select a client router:
TanStack Router

# TanStack React Query도 선택
✔ Would you like to enable TanStack Query for data fetching and state management?
Yes

✔ Template downloaded successfully (shadcn template)
Removed .git directory
✔ RPC client setup completed
✔ Biome setup complete.
✔ TanStack Query setup completed
✔ TanStack Router setup completed

✔ Initialize a git repository?
Yes
✔ Git repository initialized

✔ Install dependencies?
Yes
✔ Dependencies installed with bun
🎉 Project created successfully!

Next steps:
  cd bhvr-test
  bun run dev:client   # Start the client
  bun run dev:server   # Start the server in another terminal
  bun run dev          # Start all
```

저는 몇가지 기본적인 걸 선택했습니다.

CSS는 당연히 TailwindCSS와 shadcn을 선택했고요.

Hono API의 타입 안정성을 위해 Hono RPC를 기본적으로 선택했고,

린터는 최근 핫한 `Biome`을 선택했습니다.

그리고 탠스택 쿼리와 탠스택 라우터를 기본으로 설정했습니다.

싱글 페이지 앱에서 최고의 선택은 바로 React Query죠.

그리고 라우터는 React Router를 주로 사용했었는데, 여기서는 TanStack React Query와의 조합에 좀 더 좋은 TanStack Router를 기본 설정으로 선택했습니다.

이제 템플릿 설치가 다 됐는데요.

위와 같이 실행하고 나서 해당 폴더로 이동하는데요.<br />

여기서 '바이옴(Biome)' 세팅을 다시 해줘야 합니다.<br />

BHVR 템플릿의 바이옴 설정 파일이 예전 버전이라서 최신 버전으로 업데이트가 필요한데요.<br />

먼저 최상단 폴더에 있는 `biome.json` 파일을 삭제합니다.<br />

```sh
rm biome.json
```

그리고 바이옴을 다시 초기화하는데요.<br />
아래 명령어를 실행하면 됩니다.<br />

```sh
bunx --bun biome init
```

이제 최신 `biome.json` 파일이 생성됐는데요.<br />

여기에 두 가지 설정을 추가해야 합니다.<br />

첫 번째는 'files.includes' 부분인데요.<br />

린터가 검사할 파일들을 명확히 지정해주는 설정입니다.<br />

두 번째는 'javascript.jsxRuntime' 부분인데요.<br />

이걸 설정하지 않으면 리액트 임포트 관련 경고가 계속 뜹니다.<br />

```json
"files": {
    "includes": [
        "**/src/**/*.ts",
        "**/src/**/*.tsx",
        "!**/node_modules",
        "!**/*.gen.ts",
        "!**/dist/*.ts",
        "!**/*.d.ts"
    ],
    "ignoreUnknown": false
},

...
...
...

"javascript": {
    "jsxRuntime": "reactClassic",
    "formatter": {
        "quoteStyle": "double"
    }
},
```

'탠스택 라우터(TanStack Router)'가 자동으로 생성하는 `*.gen.ts` 파일도 제외시켜줬는데요.<br />

이런 자동 생성 파일은 린터가 검사할 필요가 없습니다.<br />

'javascript.jsxRuntime'을 'reactClassic'으로 설정한 이유는 'shadcn/ui' 컴포넌트들이 리액트를 타입으로만 임포트하는 경우가 많아서인데요.<br />

이 설정을 안 하면 아래와 같은 경고가 계속 나타납니다.<br />

```sh
$ biome lint .
client/src/components/ui/button.tsx:1:8 lint/style/useImportType  FIXABLE  ━━━━━━━━━━━━━━━

  ⚠ All these imports are only used as types.
  
  > 1 │ import * as React from "react";
      │        ^^^^^^^^^^^^^^^^^^^^^^^
    2 │ import { Slot } from "@radix-ui/react-slot";
    3 │ import { cva, type VariantProps } from "class-variance-authority";
```

이제 바이옴 린트를 실행해보면 깔끔하게 통과하는데요.<br />

문제없이 작동하는 걸 확인할 수 있습니다.<br />

```sh
$ bun run lint
$ biome lint .
Checked 10 files in 32ms. No fixes applied.
```

## 개발 서버 실행해보기

이제 개발 서버를 돌려볼 차례인데요.<br />

아래 명령어로 실행하면 됩니다.<br />

```sh
bun run dev
```

브라우저에서 확인해보면 기본 템플릿이 잘 실행되는데요.<br />

![](https://blogger.googleusercontent.com/img/a/AVvXsEjZxNml1e4c-wtAdRmNiJDDJ6l0lUaccB10bqfVwpU4aOnG02SyVuWuqB3zQuxorIdfyJjZB_i2_gvEZYHhQwdZTcEwgjrET4ZGcNvz1-qA9O2Qm-K2dEptwAl5Xyo7PodsLwVD_iBwPA_Bi9fY0sgWa10WyCN0al9uHT_6Z3taKtoSd-Yaujjul6cYwPc=s16000)

여기까지 왔으면 1단계는 성공적으로 완료한 겁니다.<br />

## Cloudflare Workers 배포를 위한 설정

제가 BHVR 스택을 좋아하는 이유가 바로 이거인데요.<br />

클라우드플레어 워커스에 완벽하게 배포할 수 있다는 점입니다.<br />

공식 문서에도 배포 방법이 나와있긴 한데요.<br />

실제로 해보니 몇 가지 수정이 필요해서 제가 직접 테스트한 방법을 알려드리겠습니다.<br />

### 서버 구성 변경하기

먼저 호노 서버를 업데이트해야 하는데요.<br />

`server/src/index.ts` 파일을 수정합니다.<br />

```ts
import { Hono } from "hono";
import { cors } from "hono/cors";
import type { ApiResponse } from "shared/dist";

const api = new Hono().get("/hello", async (c) => {
  const data: ApiResponse = {
    message: "Hello BHVR!",
    success: true,
  };

  return c.json(data, { status: 200 });
});

export const app = new Hono()
  .use(cors())
  .get("/", (c) => {
    return c.text("Hello Hono!");
  })
  .route("/api", api); // 이 부분이 핵심입니다!

export default app;
```

위 코드에서 중요한 부분은 `.route("/api", api)` 부분인데요.<br />

호노 RPC가 제대로 작동하기 위해서는 app의 설정이 위 코드와 같이 chaining 방식으로 정의되어야 합니다.

그래서 위와 같은 방식으로 `API`를 라우트로 추가한겁니다.

이렇게 설정해야 호노 RPC가 제대로 작동합니다.<br />

### 클라이언트 구성 변경하기

두 번째로 클라이언트에서 호노 API 서버를 호출하는 방식을 수정해야 하는데요.<br />

`client/src/routes/index.tsx` 파일을 고쳐보겠습니다.<br />

여기서 두 가지를 수정할 건데요.<br />

첫 번째는 API 서버 URL을 환경에 따라 다르게 설정하는 것입니다.<br />

두 번째는 탠스택 쿼리의 'useMutation' 대신 'useQuery'를 사용하는 건데요.<br />

단순 데이터 조회는 'useQuery'가 더 적합합니다.<br />

```ts
import { createFileRoute } from "@tanstack/react-router";
import beaver from "@/assets/beaver.svg";
import { Button } from "@/components/ui/button";
import { hcWithType } from "server/dist/client";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/")({
  component: Index,
});

const SERVER_URL = import.meta.env.DEV ? "http://localhost:3000" : "/";

const client = hcWithType(SERVER_URL);

const fetchHello = async () => {
  const res = await client.api.hello.$get();
  if (!res.ok) {
    throw new Error("Server response was not ok");
  }
  return res.json();
};

function Index() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["hello"],
    queryFn: fetchHello,
    enabled: false,
  });

  const handleCallApi = () => {
    refetch();
  };

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6 items-center justify-center min-h-screen">
      <a
        href="https://github.com/stevedylandev/bhvr"
        target="_blank"
        rel="noopener"
      >
        <img
          src={beaver}
          className="w-16 h-16 cursor-pointer"
          alt="beaver logo"
        />
      </a>
      <h1 className="text-5xl font-black">bhvr</h1>
      <h2 className="text-2xl font-bold">Bun + Hono + Vite + React</h2>
      <p>A typesafe fullstack monorepo</p>
      <div className="flex items-center gap-4">
        <Button onClick={handleCallApi} disabled={isLoading}>
          {isLoading ? "Loading..." : "Call API"}
        </Button>
        <Button variant="secondary" asChild>
          <a target="_blank" href="https://bhvr.dev" rel="noopener">
            Docs
          </a>
        </Button>
      </div>
      {data && (
        <pre className="bg-gray-100 p-4 rounded-md">
          <code>
            Message: {data.message} <br />
            Success: {data.success.toString()}
          </code>
        </pre>
      )}
    </div>
  );
}

export default Index;
```

여기서 가장 중요한 부분이 'SERVER_URL' 설정인데요.<br />

개발 환경에서는 'localhost:3000'을 사용하고, 프로덕션에서는 '/'를 사용합니다.<br />

왜 프로덕션에서 '/'를 사용하냐면, 클라우드플레어 워커스에서는 서버와 클라이언트가 같은 도메인에서 실행되기 때문인데요.<br />

호노 서버가 메인 워커가 되고, 리액트 앱은 에셋으로 서빙됩니다.<br />

### Wrangler 설치 및 설정하기

이제 본격적인 배포를 위해 '랭글러(Wrangler)'를 설치하는데요.<br />

클라우드플레어 워커스 배포 도구입니다.<br />

```sh
bun add --dev wrangler @cloudflare/workers-types
```

그리고 프로젝트 최상단에 `wrangler.jsonc` 파일을 만드는데요.<br />

이 파일이 배포 설정의 핵심입니다.<br />

```json
{
	"$schema": "./node_modules/wrangler/config-schema.json",
	"name": "test-bhvr",
	"main": "./server/dist/index.js",
	"compatibility_date": "2025-05-25",
	"assets": {
		"directory": "./client/dist",
		"not_found_handling": "single-page-application"
	},
	"compatibility_flags": ["nodejs_compat"]
}
```

'jsonc' 확장자를 사용하면 주석을 달 수 있어서 편한데요.<br />

일반 JSON과 달리 설명을 추가할 수 있습니다.<br />

'assets' 설정이 중요한데요.<br />

클라이언트 빌드 결과물을 워커의 정적 에셋으로 서빙하도록 설정하는 부분입니다.<br />

### 배포 스크립트 추가하기

마지막으로 `package.json`에 배포 스크립트를 추가하는데요.<br />

터보(Turbo)로 빌드하고 랭글러로 배포하는 명령어입니다.<br />

```json
"scripts": {
  "dev": "turbo dev",
  "dev:client": "turbo dev --filter=client",
  "dev:server": "turbo dev --filter=server",
  "build": "turbo build",
  "build:client": "turbo build --filter=client",
  "build:server": "turbo build --filter=server",
  "lint": "biome lint .",
  "type-check": "turbo type-check",
  "test": "turbo test",
  "postinstall": "turbo build --filter=shared --filter=server",
  "format": "biome format . --write",
  "deploy": "turbo build && wrangler deploy --minify"
}
```

## 실제로 배포해보기

이제 모든 준비가 끝났는데요.<br />

실제로 배포해보겠습니다.<br />

```sh
✗ bun run deploy
$ turbo build && wrangler deploy --minify
turbo 2.5.6

 WARNING  Unable to calculate transitive closures: No lockfile entry found for 'tslib'
• Packages in scope: client, server, shared
• Running build in 3 packages
• Remote caching disabled
┌─ shared#build > cache miss, executing c979e581a70a5c49 

$ tsc
└─ shared#build ──
┌─ server#build > cache miss, executing 8b1ef528622fce7f 

$ tsc
└─ server#build ──
┌─ client#build > cache miss, executing 6eeb71d0d7eedc81 

$ tsc -b && vite build
vite v6.3.6 building for production...
Generated route tree in 70ms
✓ 188 modules transformed.
dist/index.html                    0.45 kB │ gzip:   0.29 kB
dist/assets/beaver-D-LUlnGj.svg    4.98 kB │ gzip:   2.34 kB
dist/assets/index-HIAAjHEk.css    17.43 kB │ gzip:   3.90 kB
dist/assets/index-OYyk7Ouh.js    336.83 kB │ gzip: 105.92 kB
✓ built in 934ms
└─ client#build ──

 Tasks:    3 successful, 3 total
Cached:    0 cached, 3 total
  Time:    4.346s 

 ⛅️ wrangler 4.38.0
───────────────────
🌀 Building list of assets...
✨ Read 6 files from the assets directory
🌀 Starting asset upload...
🌀 Found 5 new or modified static assets to upload. Proceeding with upload...
+ /index.html
+ /assets/index-HIAAjHEk.css
+ /vite.svg
+ /assets/index-OYyk7Ouh.js
+ /assets/beaver-D-LUlnGj.svg
Uploaded 5 of 5 assets
✨ Success! Uploaded 5 files (3.53 sec)

Total Upload: 33.13 KiB / gzip: 12.36 KiB
Worker Startup Time: 13 ms
Uploaded test-bhvr (13.31 sec)
Deployed test-bhvr triggers (5.22 sec)
  https://test-bhvr.****.workers.dev
Current Version ID: 7b0d****-1**7-4**f-9**a-d3******9b
```

배포가 성공적으로 완료됐는데요.<br />

클라우드플레어에 로그인이 되어 있어야 배포가 가능합니다.<br />

![](https://blogger.googleusercontent.com/img/a/AVvXsEjsqRGufHJDnLSHhVfFIKj7SpziSmvMuW0m8XyDin0qyTzWfytC790wguiSwUM4U7QNMpomymVlhrhU5p-Scwx_D76_m9Gd5TkzBpHY4S2Preaak-gFqsEOhsiQF-Mxv59WRr_hAqMmfe2GeB-9U7qinsP9vG9gtowmCo5O6adas52nrxMBrKIbfPdt5DA=s16000
)
실제 배포된 URL로 접속해보면 앱이 잘 작동하는데요.<br />

![](https://blogger.googleusercontent.com/img/a/AVvXsEhmgQLSAGYvlJNZRRgsaj5wQlzhPasYQPuqhk7uMWBRzrQfxXiN-Ya6-QuHgnHafruwNrBqzBM2qhkC4aRJbWi7ElVMqh56QhmM9cIKP9u_Luip7vLa4mvD-7E45ogDY0ewE2UenHibvMRyeTkZpiVCc2lSTr2EVK8Vpr2PzQTXT2IagkkRSvkk3fUYXkQ=s16000)

API 호출도 정상적으로 동작하는 걸 확인할 수 있습니다.<br />

## 마무리

지금까지 'BHVR 스택'을 사용해서 풀스택 앱을 만들고 클라우드플레어 워커스에 배포하는 방법을 알아봤는데요.<br />

정말 빠르고 효율적인 개발 경험을 제공합니다.<br />

이 스택의 장점은 모든 구성 요소가 최신 기술이라는 점인데요.<br />

특히 번의 빠른 속도와 호노의 가벼움이 잘 어우러집니다.<br />

앞으로 이 모노리포로 어떤 프로젝트를 만들어볼지 벌써부터 기대가 되는데요.<br />

여러분도 한번 사용해보시면 그 매력을 느끼실 수 있을 겁니다.<br />

그럼 다음에 또 유용한 내용으로 찾아뵙겠습니다.<br />
