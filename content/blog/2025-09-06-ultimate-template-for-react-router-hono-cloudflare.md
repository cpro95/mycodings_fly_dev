---
slug: 2025-09-06-ultimate-template-for-react-router-hono-cloudflare
title: 리액트 라우터와 Hono로 최고의 Cloudflare 개발 경험 만들기
date: 2025-09-07 05:36:05.915000+00:00
summary: Cloudflare 환경에서 React Router와 Hono를 사용하는 가장 효율적인 방법을 소개합니다. 공식 템플릿의 느린 개발 속도 문제를 해결하고, Rolldown을 통해 빌드 속도를 극적으로 단축시킨 새로운 템플릿을 만나보세요.
tags: ["React Router", "Hono", "Cloudflare", "Vite", "Rolldown", "풀스택 프레임워크", "react"]
contributors: []
draft: false
---

요즘 프론트엔드 개발의 화두는 단연 '엣지(Edge) 컴퓨팅'인데요.<br /><br />
더 이상 프론트엔드와 백엔드를 따로 고민하지 않고, Cloudflare 같은 플랫폼 위에서 강력한 풀스택 애플리케이션을 만드는 시대가 열렸습니다.<br /><br />
이러한 흐름 속에서 'React Router'는 Cloudflare 환경을 위한 최고의 리액트 프레임워크로 자리매김하고 있거든요.<br /><br />
하지만 막상 공식 템플릿으로 개발을 시작해보면, 왠지 모를 답답함과 느린 속도 때문에 어려움을 겪는 분들이 많습니다.<br /><br />
오늘은 바로 그 문제를 해결하고, 압도적으로 쾌적한 개발 경험을 선사하는 새로운 접근법, 바로 'React Router + Hono' 조합을 위한 커스텀 템플릿을 소개해 드리려고 합니다.<br /><br />
바로 Github 주소는 아래와 같습니다.

```
https://github.com/sorakumo001/react-router-templates
```

오늘은 이 템플릿을 함께 살펴볼까 합니다.<br />

## 왜 공식 템플릿은 답답했을까

React Router가 제공하는 Cloudflare 공식 템플릿은 분명 훌륭한 시작점인데요.<br /><br />
하지만 몇 가지 구조적인 문제 때문에 프로젝트 규모가 커질수록 개발 경험이 급격하게 나빠지는 경향이 있습니다.<br /><br />
가장 큰 원인은 바로 `@cloudflare/vite-plugin`이라는 패키지에 의존하기 때문인데요.<br /><br />
이 플러그인은 개발 환경에서 실제 Cloudflare 환경을 거의 완벽하게 재현해주는 아주 강력한 도구입니다.<br /><br />
하지만 '완벽한 재현'이라는 장점 뒤에는 '끔찍하게 느린 속도'라는 치명적인 단점이 숨어있거든요.<br /><br />
개발 서버가 브라우저에 코드를 보내줄 때, `node_modules`에 있는 수많은 구식 코드들을 최신 표준(ESM)에 맞게 실시간으로 번역해서 줘야 하는데요.<br /><br />
이 번역 과정이 정말 복잡하고 느려서, 의존하는 라이브러리가 하나둘 늘어날수록 개발 서버의 초기 구동 시간은 하염없이 길어집니다.<br /><br />

## 새로운 템플릿의 핵심 철학 세 가지

그래서 이 템플릿의 개발자는 과감하게 `@cloudflare/vite-plugin`을 걷어내고, '개발 경험'에 모든 초점을 맞춘 새로운 템플릿을 만들었다고 하는데요.<br /><br />
이 템플릿의 핵심 철학은 다음 세 가지로 요약할 수 있습니다.<br /><br />

1.  **Hono로 안정적인 미들웨어 구축**: React Router 자체의 미들웨어 기능은 아직 실험적인 단계라 불안정한 면이 있거든요. 그래서 이미 수많은 프로덕션 환경에서 검증된, 작고 빠른 백엔드 프레임워크 'Hono'를 미들웨어로 도입하여 안정성을 확보했습니다.<br /><br />
2.  **`@cloudflare/vite-plugin` 제거로 개발 속도 확보**: 약간의 환경 재현성을 포기하는 대신, 개발 서버의 속도를 극적으로 끌어올렸습니다. 이제 더 이상 커피 한 잔을 다 마시도록 서버가 뜨기를 기다릴 필요가 없습니다.<br /><br />
3.  **rolldown-vite 도입으로 빛의 속도 빌드**: Vite의 차세대 번들러인 'Rolldown'을 도입하여, 프로덕션 빌드 속도를 절반 이하로 단축시켰습니다. CI/CD 파이프라인에서 빌드 시간을 기다리는 지루함이 사라지는 겁니다.<br /><br />

## 커스텀 설정 심층 분석

이 템플릿이 어떻게 이런 마법을 부리는지, 핵심 설정 파일들을 함께 뜯어보겠습니다.<br /><br />

### 1. vite.config.ts 영리한 설정의 중심

Vite 설정 파일은 이 템플릿의 심장부라고 할 수 있는데요.<br /><br />
몇 가지 아주 중요한 설정들이 포함되어 있습니다.<br /><br />

```typescript
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import serverAdapter from "hono-react-router-adapter/vite";
import type { cloudflareAdapter } from "@hono/vite-dev-server/cloudflare";
import { getPlatformProxy } from "wrangler";
import { defaultOptions } from "@hono/vite-dev-server";

// 엔트리 파일
const entry = "./workers/app.ts";

// Hono의 Cloudflare 어댑터 기본 동작을 수정
const adapter: typeof cloudflareAdapter = async (options) => {
  const proxy = await getPlatformProxy(options?.proxy);
  return {
    env: proxy.env,
    executionContext: proxy.ctx,
    onServerClose: () => proxy.dispose(),
  };
};

export default defineConfig({
  resolve: {
    alias: [
      {
        // 이 부분이 핵심입니다.
        find: "../build/server/index.js",
        replacement: "virtual:react-router/server-build",
      },
    ],
  },
  ssr: {
    resolve: {
      externalConditions: ["worker"],
    },
  },
  plugins: [
    serverAdapter({
      adapter,
      entry,
      // SVG 같은 에셋 파일을 사용하려면 여기에 추가해야 합니다.
      exclude: [...defaultOptions.exclude, /\.(webp|png|svg)(\?.*)?$/],
    }),
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
  ],
  experimental: { enableNativePlugin: true }, // Rolldown 활성화
});
```

-   **커스텀 어댑터**: Hono의 기본 Cloudflare 어댑터는 `navigator.userAgent` 값을 임의로 변경하는 로직이 포함되어 있는데요. 이 때문에 Prisma 같은 일부 라이브러리가 환경을 제대로 인식하지 못하는 문제가 발생합니다. 그래서 이 부분을 제거한 커스텀 어댑터를 사용해서 호환성을 높였습니다.<br /><br />
-   **가상 모듈 별칭(Alias)**: `find: "../build/server/index.js"` 이 부분이 정말 중요한데요. 개발 환경(`vite dev`)에서는 이 경로를 `virtual:react-router/server-build`라는 가상 모듈로 바꿔치기해서 Vite가 서버 코드를 처리하게 만듭니다. 반면, 배포(`wrangler deploy`) 시에는 실제 빌드된 파일 경로를 그대로 사용하게 되죠. `@cloudflare/vite-plugin` 없이도 개발과 배포 환경의 코드 실행을 통일시켜주는 아주 영리한 트릭입니다.<br /><br />

### 2. workers/app.ts Hono와 React Router의 만남

이 파일은 Cloudflare Worker의 시작점인데요.<br /><br />
Hono를 사용해서 들어오는 모든 요청을 React Router가 처리하도록 넘겨주는 역할을 합니다.<br /><br />

```typescript
import { Hono } from "hono";
import { contextStorage } from "hono/context-storage";
import { getLoadContext } from "load-context";
import { createRequestHandler } from "react-router";

const app = new Hono();
app.use(contextStorage());

app.use(async (c) => {
  // @ts-ignore
  // Vite 개발 서버에서는 이 경로가 가상 모듈로 치환됩니다.
  const build = await import("../build/server/index.js");
  // @ts-ignore
  const handler = createRequestHandler(build, import.meta.env?.MODE);
  
  // ... Hono 컨텍스트를 React Router 로드 컨텍스트에 전달하는 로직 ...
  
  return handler(c.req.raw, context);
});

export default app;
```
`vite.config.ts`에서 설정한 별칭 덕분에, 동일한 `import` 구문이 개발 환경과 프로덕션 환경에서 다르게 동작하여 매끄러운 연동이 가능해지는 겁니다.<br /><br />

### 3. .env 아는 사람만 아는 함정 피하기

이 `.env` 파일의 단 한 줄짜리 설정이 어쩌면 이 템플릿의 가장 중요한 부분일지도 모르는데요.<br /><br />
이 설정이 없으면 여러분의 프로덕션 빌드는 훨씬 더 크고 느려질 수 있습니다.<br /><br />

```
# 이 설정이 없으면 `wrangler deploy` 시 리액트 개발용 모듈이 포함됩니다.
NODE_ENV=production
```

Wrangler는 배포 시 백엔드 코드를 `esbuild`로 빌드하는데요.<br /><br />
이때 `NODE_ENV`가 `production`으로 설정되어 있지 않으면, `react` 라이브러리가 디버깅 정보가 포함된 거대한 개발용 버전을 프로덕션 번들에 포함시켜 버립니다.<br /><br />
이는 번들 사이즈 증가와 성능 저하의 직접적인 원인이 되지만, 정말 많은 개발자들이 이 사실을 놓치고 있습니다.<br /><br />

## 지금 바로 시작해보세요

이 템플릿을 사용하는 방법은 공식 템플릿과 거의 동일한데요.<br /><br />
터미널에 아래 명령어 한 줄만 입력하면 됩니다.<br /><br />

```bash
npx create-react-router@latest --template sorakumo001/react-router-templates/cloudflare
```

## 결론 쾌적한 개발 경험을 위하여

React Router는 Next.js에 비해 초기 설정의 자유도가 높은 만큼, 처음 시작하는 데 허들이 있는 것이 사실입니다.<br /><br />
하지만 Cloudflare 환경에서 리액트 기반 프레임워크를 선택해야 한다면, 현재로서는 가장 강력하고 올바른 선택지입니다.<br /><br />
이 템플릿은 공식 템플릿의 '완벽한 환경 재현'이라는 목표 대신, '압도적인 개발 경험'이라는 가치를 선택했습니다.<br /><br />
공식 템플릿의 느린 속도와 복잡한 모듈 문제로 고통받고 계셨다면, 지금 바로 이 템플릿으로 갈아타 보세요.<br /><br />
날아다니는 듯한 개발 속도와 함께, 엣지 컴퓨팅의 진정한 즐거움을 만끽하게 되실 겁니다.<br /><br />
