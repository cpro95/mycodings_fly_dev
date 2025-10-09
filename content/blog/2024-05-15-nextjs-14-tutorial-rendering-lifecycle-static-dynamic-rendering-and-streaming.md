---
slug: 2024-05-15-nextjs-14-tutorial-rendering-lifecycle-static-dynamic-rendering-and-streaming
title: Next.js 14 강좌 11편. 렌더링 라이프사이클(Rendering Lifecycle)과 서버 렌더링 전략 세가지(정적 렌더링, 다이내믹 렌더링, 스트리밍)
date: 2024-05-15 06:44:21.892000+00:00
summary: Next.js의 세 가지 서버 렌더링 전략 - 정적, 동적(다이내믹) 그리고 스트리밍
tags: ["next.js", "rendering lifecycle", "static rendering", "dynamic rendering", "streaming"]
contributors: []
draft: false
---

안녕하세요?

Next.js 14 강좌 열 한 번째입니다.

전체 강좌 리스트입니다.

1. [Next.js 14 강좌 1편. 라우팅의 모든 것](https://mycodings.fly.dev/blog/2024-01-13-nextjs-14-tutorial-1-all-about-routing)

2. [Next.js 14 강좌 2편. 레이아웃의 모든 것 and Link 컴포넌트](https://mycodings.fly.dev/blog/2024-01-14-nextjs-14-tutorial-2-all-about-layout-and-link-component)

3. [Next.js 14 강좌 3편. Template과 Loading 스페셜 파일](https://mycodings.fly.dev/blog/2024-04-20-nextjs-14-tutorial-template-and-loading-ui-special-files)

4. [Next.js 14 강좌 4편. 에러(Error) 처리의 모든 것](https://mycodings.fly.dev/blog/2024-04-27-nextjs-14-tutorial-all-about-error)

5. [Next.js 14 강좌 5편. 병렬 라우팅(Parallel Routes), 일치하지 않는 라우팅(Unmatched Routes), 조건부 라우팅(Conditional Routes) 알아보기](https://mycodings.fly.dev/blog/2024-04-28)

6. [Next.js 14 강좌 6편. 인터셉팅 라우팅(Intercepting Routes)과 병렬 인터셉팅 라우팅(Parallel Intercepting Routes) 살펴보기](https://mycodings.fly.dev/blog/2024-05-04-nextjs-14-tutorial-6-intercepting-routes-and-parallel-intercepting-routes)

7. [Next.js 14 강좌 7편. 라우트 핸들러의 기본(GET, POST, PATCH, DELETE)과 동적 라우트 핸들러 알아보기](https://mycodings.fly.dev/blog/2024-05-12-nextjs-14-tutorial-route-handler-get-post-patch-delete-method-and-dynamic-route-handler)

8. [Next.js 14 강좌 8편, 라우트 핸들러에서 URL 쿼리 파라미터와 redirect, Headers, Cookies 그리고 캐싱 방식 알아보기](https://mycodings.fly.dev/blog/2024-05-12-nextjs-14-tutorial-route-handler-and-url-query-parameter-redirect-headers-cookies-caching)

9. [Next.js 14 강좌 9편. 미들웨어(middleware) 설정 방법과 미들웨어에서의 rewrite, cookies, headers 처리 방법](https://mycodings.fly.dev/blog/2024-05-12-nextjs-14-tutorial-middleware-and-rewrite-cookies-headers-in-middleware)

10. [Next.js 14 강좌 10편. CSR부터 SSR, RSC까지 React의 렌더링의 역사 살펴보기](https://mycodings.fly.dev/blog/2024-05-14-nextjs-14-tutorial-all-about-rendering-csr-ssr-rsc)

11. [Next.js 14 강좌 11편. 렌더링 라이프사이클(Rendering Lifecycle)과 서버 렌더링 전략 세가지(정적 렌더링, 다이내믹 렌더링, 스트리밍)](https://mycodings.fly.dev/blog/2024-05-15-nextjs-14-tutorial-rendering-lifecycle-static-dynamic-rendering-and-streaming)

12. [Next.js 14 강좌 12편. 서버 컴포넌트 패턴 - 서버 전용 코드(server-only), 써드 파티 패키지, 컨텍스트 프로바이더(Context Provider) 활용하기](https://mycodings.fly.dev/blog/2024-05-15-nextjs-14-server-component-patterns-server-only-third-party-package-context-provider)

13. [Next.js 14 강좌 13편. 클라이언트 컴포넌트 패턴 - 클라이언트 전용 코드(client-only), 컴포넌트 배치, 서버-클라이언트 컴포넌트 섞어 활용하기](https://mycodings.fly.dev/blog/2024-05-15-nextjs-14-tutorial-client-component-patterns-client-only-client-component-placement-interleaving-server-and-client-components)

---

** 목 차 **

- [렌더링 라이프 사이클(Rendering Lifecycle)](#렌더링-라이프-사이클rendering-lifecycle)
- [Static Rendering](#static-rendering)
  - [Production Server vs Dev Server](#production-server-vs-dev-server)
- [Dynamic Rendering](#dynamic-rendering)
- [Streaming](#streaming)

---

## 렌더링 라이프 사이클(Rendering Lifecycle)

지난 글에서는 Next.js의 서버 컴포넌트와 클라이언트 컴포넌트에 대해 이야기했었는데요.

지금부터는 서버 컴포넌트와 클라이언트 컴포넌트의 렌더링 라이프 사이클(Rendering Lifecycle)에 알아보겠습니다.

쉽게 말하면 각각의 컴포넌트들이 브라우저 화면에 어떻게 나타나게 되는지를 좀 더 세세하게 살펴볼 건데요.

물론 Next.js 앱을 만드는 데 이 과정을 알 필요는 없습니다.

하지만 좀 더 전문적인 지식을 알고 싶다면 꼭 배워둘 필요는 있다고 봅니다.

먼저, 서버 컴포넌트에서는 세 가지 요소를 고려해야 합니다.

첫째, 클라이언트인 브라우저, 나머지 둘은 서버 쪽인데 Next.js 프레임워크과 React 라이브러리입니다.

초기 로딩 순서를 하나하나 살펴볼까요?

브라우저에서 사용자가 페이지를 요청(Request)하면, Next.js 앱 라우터가 요청된 URL을 서버 컴포넌트에 매칭시킵니다.

그러면 Next.js가 React에게 그 서버 컴포넌트를 렌더링하라고 지시하죠.

React는 서버 컴포넌트와 자식 서버 컴포넌트들을 렌더링해서 RSC 페이로드라는 특별한 JSON 형식으로 변환합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEh6yQ2KtE7Npc1l9JQhkuRUfN66hlRlLTCTeQWG_aG9Ox79EuN_9HY74PMAajeZ6XRSNNQ34rgFJtsfwqurZh48Y-xSJeHm-DGhmCCdc7WHkbAB8grXEiejXzFH8YXVK8tvK3ypsDVyKl9kIX54erE6WO2RmOD-sS8sBTM-hn-b-mtZlXszcGYIpzBygq8)

네트워크 탭을 확인해보면 이 RSC 페이로드 JSON 형식을 볼 수 있는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiksr-ktu7596I0Bcal8oPS8hn9VHqKPkAf6fP6FupsdhP16CSGuFXvCPnkv_zLyLKTBK4aOgJ6mjPjzN0liN8Gs5VxK_2BiTGKLRP_WmIggp9ezVQhm2Xzr0sKJc7Adu6HdFVytKn1qTykISmPmUOZRJ5CSwRLonOfxG832CD2KVJB9RSi6qzz1Hq1ees)

렌더링 도중 서버 컴포넌트가 중단되면, React는 그 서브트리의 렌더링을 일시 중지하고 대신 플레이스홀더 값을 보냅니다.

한편 클라이언트 컴포넌트는 나중을 위해 지침(instructions)을 받는데요.

Next.js는 클라이언트 컴포넌트 지침(instructions)이 포함된 RSC 페이로드를 사용해서 서버에서 HTML을 생성합니다.

이 HTML은 브라우저로 스트리밍되고 라우트에 의해 아직은 유저와 상호작용할 수 없는 Non-interactive UI의 preview를 보여주게 됩니다.

동시에 Next.js는 RSC 페이로드도 스트리밍하는데, 브라우저에서 React가 각 UI 단위를 렌더링할 때마다 Next.js가 스트리밍된 React 응답을 처리하는 겁니다.

React는 RSC 페이로드와 클라이언트 컴포넌트 지침(instructions)을 사용해서 UI를 점진적으로 렌더링합니다.

모든 컴포넌트와 서버 컴포넌트 출력이 로드되면 최종 UI 상태가 사용자에게 제공되게 되는 거죠.

이때 클라이언트 컴포넌트는 하이드레이션을 거치면서 이제 본격적인 Interactive UI로 변화하게 되는 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjN9T65RJVGNcAQjj8BLQ0mNvVQ_k3C3Baf6nhk5GHDBSReTTxiszPVshQSfM2mPHFONDJah7pgi-0DZ5SjXfei52I0V6IVU75dMO1MoZ75-7aXG30xTiG5BIGQTHiHKYIJFKm1CNCpjGzZGga00zuGdWm1P435bxm942tGJ-cQv_drE97gFNXELaLUXcQ)

이게 바로 Initial Loading Sequence입니다.

이제 앱의 일부를 새로고침하는 업데이트 순서를 볼까요?

브라우저가 특정 UI, 예를 들어 전체 라우트의 리페치(re-fetch)를 요청하면, Next.js가 요청을 처리하고 요청된 서버 컴포넌트에 매칭시킵니다.

Next.js가 React에게 컴포넌트 트리를 렌더링하라고 지시하고, 

React는 초기 로딩과 비슷하게 컴포넌트를 렌더링하는데, 초기 순서와는 달리 이 때는 HTML 생성은 없습니다.

Next.js는 응답 데이터를 점진적으로 클라이언트로 스트리밍하죠.

클라이언트가 스트리밍된 응답을 받으면, Next.js가 새 출력으로 라우트 렌더링을 트리거합니다..

React는 새로 렌더링된 출력을 기존 컴포넌트와 병합하거나 조정하게 됩니다.

UI 설명이 HTML이 아닌 특수 JSON 형식이기 때문에, React는 포커스나 입력 값 같은 중요한 UI 업데이트를 유지하면서도 DOM을 업데이트할 수 있습니다.

이게 바로 Next.js의 앱 라우터에서 RSC 렌더링 라이프사이클의 핵심입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEh1Ca-bsYpgDyrJUiN01I5o2GJa5zPeiwWAtOdplp0jUVtHNGEinUalbmMk3CciBsyKsDUeo4RR_h3OE5_2h2K7Ydmt7dr6cWlLFMkXPfuoHFaFQvxQq39_Y1KaVdfrXfi2-vWz_xnVamlMi-GHMZQscTj1S1JTLdBNbEOzOmkdJXjKoQ53B3L67gNwI4I)

서버 렌더링 전략에 대해 더 깊이 알아보자면, 정적 렌더링, 동적 렌더링, 스트리밍 렌더링 이렇게 세 가지 서버 렌더링 전략이 있는데요.

각각을 자세히 알아볼까 합니다.

---

## Static Rendering

Next.js의 세 가지 서버 렌더링 전략 중 첫 번째인 정적 렌더링(Static Rendering)에 대해 자세히 알아보겠습니다.

정적 렌더링이란 애플리케이션을 빌드할 때 HTML 페이지를 생성하는 서버 렌더링 전략입니다.

이를 통해 웹 페이지의 모든 데이터와 콘텐츠가 미리 준비되죠.

이 방식을 사용하면 페이지를 한 번 빌드한 뒤 CDN에 캐싱해서 클라이언트에 거의 즉시 제공할 수 있습니다.

또한 렌더링 작업 결과를 여러 사용자와 공유할 수 있어 애플리케이션 성능이 크게 향상됩니다.

정적 렌더링은 블로그, 전자상거래 제품 페이지, 문서, 마케팅 페이지 등에 특히 유용합니다.

정적 렌더링이 무엇이고 언제 사용하는지 알았으니, 다음 질문은 어떻게 사용하느냐입니다.

애플리케이션의 특정 경로를 정적으로 렌더링하려면 어떻게 해야 할까요?

좋은 소식은 정적 렌더링이 앱 라우터의 기본 렌더링 전략이라는 것입니다.

즉, 추가 설정 없이 모든 경로가 자동으로 빌드 시점에 준비됩니다.

이 시점에서 "예전에 HTML이 빌드 시점에 생성된다고 했는데, 우리 애플리케이션은 아직 빌드되지 않았잖아요? 지금은 개발 모드로 실행 중 아닌가요?"라는 의문이 들 수 있습니다.

이 좋은 질문에 대답하기 위해 프로덕션 서버와 개발 서버의 차이를 이해할 필요가 있습니다.

### Production Server vs Dev Server

프로덕션에서는 한 번 최적화된 빌드가 생성되고 그 빌드를 배포합니다.

배포된 후에는 코드 변경이 일어나지 않죠.

반면 개발 서버는 개발자 경험에 초점을 맞춥니다.

코드를 변경하면 변경 사항이 브라우저에 즉시 반영되어야 합니다.

애플리케이션을 빌드하고, 변경하고, 다시 빌드하는 식으로는 안 됩니다. 

그래서 Next.js 팀은 프로덕션 빌드에서는 빌드 명령을 실행할 때 페이지가 한 번 프리렌더링되거나 정적으로 렌더링되지만, 개발 모드에서는 모든 요청마다 페이지가 프리렌더링되거나 정적으로 렌더링된다고 결정했습니다.

예를 들어 홈페이지에 접속하면 프리렌더링되어 제공되고, 새로고침하면 다시 프리렌더링되어 제공됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgs5WL82kEhnhY19HWjLb9cd8SeDcm2SVfbTn8CV-dlxI2a4dkBIOvsmlFW0h4ldtJwDIi7YVsMpn-8-kw0rG8cQOETyNA14wYQk2khp8arFqw1pRCdS41525QSa5WvELcReCuSqZi1vlxyhGPxYu-uSLojQQpEU50UiQSjlMDxBq59ElYaDMkreffRDww)

이렇게 하면 코드 변경 사항이 모든 요청에 반영됩니다.

개발 모드에서 정적 렌더링에 대해 신경 쓸 필요가 없다고 말했을 때 좀 이상하게 들릴 수 있습니다.

애플리케이션 빌드 시의 작동 방식을 이해하는 것이 더 중요합니다. 

그런데 빌드 프로세스에 들어가기 전에 '.next' 폴더를 삭제하여 정리하고, about 페이지에서 현재 시간을 렌더링해 보겠습니다.

```tsx
export default function AboutPage() {
    console.log("About server component");
    return <h1>About Page {new Date().toLocaleTimeString()}</h1>;
}
```
`new Date().toLocaleTimeString()`을 사용하면 됩니다.

이제 터미널에서 npm run build 명령을 실행해 봅시다.

이 명령으로 최적화된 프로덕션 빌드가 생성됩니다.

```sh
npm run build

> rendering-demo@0.1.0 build
> next build

  ▲ Next.js 14.2.3

   Creating an optimized production build ...
 ✓ Compiled successfully
 ✓ Linting and checking validity of types    
 ✓ Collecting page data    
   Generating static pages (0/7)  [    ]Dashboard server component
About server component
About server component
   Generating static pages (1/7)  [=   ]Dashboard server component
 ✓ Generating static pages (7/7)
 ✓ Collecting build traces    
 ✓ Finalizing page optimization    

Route (app)                              Size     First Load JS
┌ ○ /                                    5.29 kB        92.2 kB
├ ○ /_not-found                          871 B          87.8 kB
├ ○ /about                               141 B          87.1 kB
└ ○ /dashboard                           141 B          87.1 kB
+ First Load JS shared by all            87 kB
  ├ chunks/23-0627c91053ca9399.js        31.5 kB
  ├ chunks/fd9d1056-2821b0f0cabcd8bd.js  53.6 kB
  └ other shared chunks (total)          1.86 kB


○  (Static)  prerendered as static content
```

빌드 프로세스에 대해 다루어야 할 부분이 꽤 있으니, 터미널 출력부터 시작해 보겠습니다.

터미널 출력에는 애플리케이션의 각 경로에 대한 정보가 "Route", "Size", "First load JS" 세 열로 표시됩니다.

"Route"는 about나 dashboard 등 실제 경로를 말합니다.

"Size"는 브라우저에서 해당 경로로 이동할 때 클라이언트 측에 다운로드되는 asset의 크기입니다.

"First load JS"는 서버에서 페이지를 로드할 때 다운로드되는 asset의 크기를 말하죠.

"First load JS shared by all"에는 global.css의 CSS, 런타임 코드, 프레임워크 코드, React 같은 node_modules 벤더 코드, 그리고 일부 경로 및 컴포넌트 관련 코드가 포함됩니다.

전체 크기는 87KB로 별도로 표시됩니다. 

생성된 개별 경로를 보면, app 폴더의 page.tsx에 해당하는 루트 페이지가 5.29KB 크기입니다.

하지만 브라우저에서 홈페이지로 이동하면 5.29KB와 공유 번들 87KB가 모두 다운로드되어 "First load JS" 크기가 92.2KB가 됩니다.

404 Not Found 페이지도 있는데, 우리가 만든 게 아니라 앱 라우터에 정의되지 않은 경로에 대해 Next.js에서 렌더링하는 겁니다.

크기는 871바이트이고 first load는 87.8KB입니다.

서버 컴포넌트가 포함된 about 경로는 클라이언트 측 이동 시 141바이트, 서버에서 페이지 로드 시 87.1KB입니다. 

클라이언트 컴포넌트가 포함된 dashboard 경로도 141바이트와 87.1KB입니다.

다음은 범례를 보겠습니다.

생성된 경로 유형에 대한 범례를 제공합니다.

app 폴더의 page.tsx인 루트 경로에는 빈 원이 표시되어 있습니다.

이는 해당 경로가 빌드 시점에 자동으로 정적 HTML 콘텐츠로 프리렌더링됨을 의미합니다.

404, about, dashboard 경로도 마찬가지입니다.

이 표시를 통해 빌드 시점에 프리렌더링되는 경로를 알 수 있습니다.

마지막으로 빌드 출력을 이해해 봐야 합니다.

Next.js는 빌드 출력을 '.next' 폴더에 생성하는데, 여기에는 브라우저의 수신 요청에 응답하는 데 필수적인 다양한 파일과 폴더가 있습니다. 

우리는 주로 server와 static 폴더에 집중하면 됩니다.

server 폴더 안에는 앱 라우터에 해당하는 app 폴더가 있습니다.

여기서 중요한 파일 유형부터 살펴보겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhp-d2UZKCMRv5g5dDp176Q0o1pYoqpouXqBt6hvEKM4Z9RXZg3naGWw0BoEVZIKtJzx0PyHZPZ40HJolHDcQQxwuMFiFRom-3sKQDjdJvqQCngzGZHlB_omCpOjI3fCqCh1iqvVrbhF34Lo3kcy05GykN9EWbrglFWU9RINn_EiTxRI4BThdawfDhM66Y)

먼저 HTML 파일입니다.

빌드 정보에 따르면 루트 페이지는 정적 HTML 페이지이고, 이는 app 폴더의 index.html에서 확인할 수 있습니다.

마찬가지로 터미널에서 정적 렌더링으로 표시된 404 Not Found도 app 폴더의 not-found.html 파일에 있습니다. 

about 경로에 해당하는 about.html에는 h1 요소가 포함되어 있고, dashboard 경로에 해당하는 dashboard.html에에도 h1 요소가 포함되어 있습니다.

최적화 단계에서 클라이언트 컴포넌트도 프리렌더링되므로 클라이언트 컴포넌트의 HTML도 볼 수 있습니다.

HTML 파일 외에도 각 경로의 RSC 페이로드에 주목할 필요가 있습니다.

예를 들어 about 서버 컴포넌트에 대해 about.rsc가, dashboard 클라이언트 컴포넌트에 대해 dashboard.rsc가 있습니다. 

아래는 about.rsc 파일의 내용입니다.

```sh
2:I[9275,[],""]
3:I[1343,[],""]
0:["kTQ95TroIWsqqVWM6V3xN",[[["",{"children":["about",{"children":["__PAGE__",{}]}]},"$undefined","$undefined",true],["",{"children":["about",{"children":["__PAGE__",{},[["$L1",["$","h1",null,{"children":["About Page ","2:24:21 PM"]}]],null],null]},["$","$L2",null,{"parallelRouterKey":"children","segmentPath":["children","about","children"],"error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L3",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":"$undefined","notFoundStyles":"$undefined","styles":null}],null]},[["$","html",null,{"lang":"en","children":["$","body",null,{"className":"__className_aaf875","children":["$","$L2",null,{"parallelRouterKey":"children","segmentPath":["children"],"error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L3",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":[["$","title",null,{"children":"404: This page could not be found."}],["$","div",null,{"style":{"fontFamily":"system-ui,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\"","height":"100vh","textAlign":"center","display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center"},"children":["$","div",null,{"children":[["$","style",null,{"dangerouslySetInnerHTML":{"__html":"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}"}}],["$","h1",null,{"className":"next-error-h1","style":{"display":"inline-block","margin":"0 20px 0 0","padding":"0 23px 0 0","fontSize":24,"fontWeight":500,"verticalAlign":"top","lineHeight":"49px"},"children":"404"}],["$","div",null,{"style":{"display":"inline-block"},"children":["$","h2",null,{"style":{"fontSize":14,"fontWeight":400,"lineHeight":"49px","margin":0},"children":"This page could not be found."}]}]]}]}]],"notFoundStyles":[],"styles":null}]}]}],null],null],[[["$","link","0",{"rel":"stylesheet","href":"/_next/static/css/fb0852fb0bcf307d.css","precedence":"next","crossOrigin":"$undefined"}]],"$L4"]]]]
4:[["$","meta","0",{"name":"viewport","content":"width=device-width, initial-scale=1"}],["$","meta","1",{"charSet":"utf-8"}],["$","title","2",{"children":"Create Next App"}],["$","meta","3",{"name":"description","content":"Generated by create next app"}],["$","link","4",{"rel":"icon","href":"/favicon.ico","type":"image/x-icon","sizes":"16x16"}],["$","meta","5",{"name":"next-size-adjust"}]]
1:null
```

React에서 각 경로에 대해 생성하는 이 특수한 JSON 형식은 Virtual DOM의 압축된 문자열 표현입니다.

약어, 내부 참조, 특수 의미 인코딩 등이 포함되어 있죠.

서버 컴포넌트의 경우 페이로드에는 "About Page" 텍스트가 포함된 h1 태그 등 서버 컴포넌트의 렌더링 결과가 포함됩니다.

하지만 클라이언트 컴포넌트의 경우 페이로드에는 클라이언트 컴포넌트가 렌더링될 위치에 대한 플레이스홀더나 Instructions과 JavaScript 파일에 대한 참조가 포함됩니다.

예를 들어 클라이언트 컴포넌트인 dashboard 경로에는 dashboard 컴포넌트 코드에 대한 참조가 있습니다.

RSC 페이로드에서 "Dashboard Page"를 검색해도 없지만, `static/chunks/app/dashboard/page-dbc112dcecfb9750.js` 파일을 추적하면 "Dashboard Page" 텍스트가 포함된 h1 태그를 볼 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiqGYLMp78fZaw3t93yGp6IAWShVG0gsVQvYJJkmdtDmi0_otTLcqT7XAHf5v2nc7lsXYUr0ywXfZ30jqPFf3-3mpD9boZKp7UNtN82iV_AnHBJ6ePxehEAsmFyzstjGYndjJ8n8g2aCnA1fLiEL8Bo_nYAcRCOj6x2qrkNMoq7lWrNaQ8R0wvtKSBLABI)

이 파일이 RSC 페이로드에서 참조하는 파일이며, 재조정 및 하이드레이션에 필요한 컴포넌트 코드가 들어 있습니다.

빌드 출력이 어떤 식으로 되는지 잘 이해가 되셨나요?

이제 이 .next 폴더에서 애플리케이션을 실행해보겠습니다.

터미널에서 npm run start 명령을 실행하면 localhost 3000 포트에서 실행됩니다.

브라우저에서 개발자 도구의 네트워크 탭을 열고, 브라우저의 새로고침 아이콘을 길게 누르면 나따나는 "빈 캐시 및 하드 새로고침"을 클릭하면 HTML 페이지 미리보기와 HTML 코드를 응답에서 확인할 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhShR5Adwmbx4l46ABaQTEF-GZnJ8xFBo62ox0eGBMvFjpYDSYEjm619eemtmRMXJ_cIjo6_309kza5i4XX7upNLTXbkgH2V0KXWn6X2YVtkmr1Jfsqn-rzgpcLfUxPzj-6dkN2xmym9YHVyiP3GKhkyriEVGS3Y0XgK4lHBI5A2Ik0Vjte2xxXHGL721U)

![](https://blogger.googleusercontent.com/img/a/AVvXsEiqzO6st0Fnl9jIbMPUe-uUDX81hCE8tSdypfPDuraJCobHDpqggOXysquR5UHEiNSqpPNuDe-xJtIliRR9NUmQKPtFMi71EA6kR2m42a0ew4fnuEGLvv0VaH7nMf5QCdR7P3ots26NmVRQqKN3oJ92MX2mIEfvOyeu00ofLfS5SatWV41Mc3OpiJQl2TA)

HTML 외에도 dashboard용 RSC 파일에 주목해 주세요. 

이 RSC 파일은 Dashboard 링크를 통해 이동할 때 클라이언트 측에서 UI를 구축하는 데 필수적입니다. 

![](https://blogger.googleusercontent.com/img/a/AVvXsEipla7abzokMEKGUvic5QUet2rMc7_BWt6b2N7avLKmiZIThuwmsbdo6IbpEnpplVMD8kRBGIONX0cyIJ5Aus6Qzl41GC6S6WB0ci8LU4nX7q3qUkT6TQT6KDcjSBc46-4NgTqXPU80J4yzd_9nAJI1LtvuxKD8rIJYE1deynwISGyzddf3kxr4q0CSUUE)

dashboard 경로로 이동하면 추가 리소스를 다운로드할 필요 없이 렌더링되는 것을 볼 수 있습니다.

초기 로드에 클라이언트 측 탐색에 필요한 모든 것이 포함되어 있죠.

하지만 궁금한 점이 있습니다.

Next.js는 어떻게 미리 dashboard 컴포넌트 코드를 다운로드하는지 말이죠.

이는 프리페칭(prefetching) 기능 때문입니다.

프리페칭은 사용자가 특정 경로로 이동하기 전에 백그라운드에서 그 경로를 프리로드하는 기술입니다.

정적 경로의 경우 전체 경로가 기본적으로 프리페칭되어 캐시됩니다.

따라서 홈페이지를 로드하면 Next.js는 about과 dashboard 경로를 프리페칭하여 즉시 탐색할 수 있도록 준비합니다.

하지만 server 폴더의 dashboard.html은 다운로드하지 않았잖아요? 

이 파일은 브라우저에서 직접 해당 페이지로 이동할 때 제공됩니다.

예를 들어 `localhost:3000/dashboard` URL을 직접 로드하면 dashboard의 HTML과 클라이언트에 대한 코드 전송이 있습니다. 

마지막으로 아래 그림처럼 about 페이지에 렌더링된 시간을 보시기 바랍니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEh59jbrFM881SyQxRXtP54kfr7GJL2v8Mr8UD5PBnCDFl13fUbrc5EPqlqsCOgPz0j2NXepc51vwbyYPdHx-wLv_66yJAvHcKEE6X0VN8gVSNLuThIj5tLIgsqnaX3YyXazfBw84wRqnYN4wqyKHWoi0ReGblfcqEFvLxCdLkdk6Gsv1eD2myJ2zRFLW_M)

이 시간은 애플리케이션 빌드 시 렌더링되었기 때문에 페이지를 새로고침해도 변하지 않습니다.

HTML 파일에서도 같은 시간을 볼 수 있습니다.

요약하자면, 정적 렌더링은 HTML이 빌드 시점에 생성되는 전략입니다.

HTML과 함께 각 컴포넌트에 대한 RSC 페이로드가 생성되고, 브라우저에서의 클라이언트 측 하이드레이션을 위한 JavaScript 청크가 생성됩니다.

페이지 경로로 직접 이동하면 해당 HTML 파일이 제공되지만, 다른 경로에서 이동하면 RSC 페이로드와 JavaScript 청크를 사용하여 클라이언트 측에서 경로가 생성되며 추가 서버 요청은 없습니다.

---

## Dynamic Rendering

동적 렌더링(Dynamic Rendering)은 요청 시점에 페이지를 렌더링하는 전략입니다.

사용자의 고유 데이터나 쿠키, URL 파라미터 등 요청 시점에야 알 수 있는 정보를 페이지에 포함해야 할 때 유용합니다.

뉴스 사이트, 맞춤형 쇼핑몰, 소셜 미디어 피드 등이 대표적인 동적 렌더링 사례라고 할 수 있죠.

자 그럼 Next.js에서는 동적 렌더링을 어떻게 구현할까요?

Next.js는 페이지 컴포넌트에서 **동적 함수(cookies, headers, searchParams)**를 발견하면 자동으로 동적 렌더링 모드로 전환합니다.

이 함수들 중 하나라도 사용하면 해당 라우트 전체가 요청 시점에 렌더링 되는 거죠.

우리도 직접 코드를 작성해서 확인해 볼까요?

about 컴포넌트에서 cookies 함수를 import하고 호출해 보겠습니다.

```ts
import { cookies } from "next/headers";
const cookieStore = cookies();
const theme = cookieStore.get("theme-test");
console.log(theme);

export default function AboutPage() {
  console.log("About server component");
  return <h1>About Page {new Date().toLocaleTimeString()}</h1>;
}
```

함수 내용 자체는 중요하지 않고, 동적 렌더링 모드 전환 여부만 확인하는 게 목적입니다.

이제 npm run build로 Next.js 앱을 빌드해 보겠습니다.

```sh
npm run build

> rendering-demo@0.1.0 build
> next build

  ▲ Next.js 14.2.3

   Creating an optimized production build ...
 ✓ Compiled successfully
 ✓ Linting and checking validity of types    
 ✓ Collecting page data    
   Generating static pages (0/7)  [    ]Dashboard server component
   Generating static pages (1/7)  [=   ]Dashboard server component
 ✓ Generating static pages (7/7)
 ✓ Collecting build traces    
 ✓ Finalizing page optimization    

Route (app)                              Size     First Load JS
┌ ○ /                                    11.4 kB        98.4 kB
├ ○ /_not-found                          871 B          87.8 kB
├ ƒ /about                               141 B          87.1 kB
└ ○ /dashboard                           141 B          87.1 kB
+ First Load JS shared by all            87 kB
  ├ chunks/23-0627c91053ca9399.js        31.5 kB
  ├ chunks/fd9d1056-2821b0f0cabcd8bd.js  53.6 kB
  └ other shared chunks (total)          1.86 kB


○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```
터미널 출력 결과를 보면 about 페이지 옆에 람다(λ) 기호가 있는 걸 확인할 수 있는데요.

이게 바로 동적 렌더링을 의미합니다.

이제 '.next' 폴더로 가서 정적으로 빌드된 파일은 server/app 폴더에 있는데, 여기에는 about.html이 없습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiqEZxKIPtK6uojiGHxeIwITj4Q6ZTceYiFWbX-5nFr4iB4YCLSOEpjlvX30HKkwpdkdA59Ke_ddELvgKtRk-DnmpEKmwY8FnT1yEIzOw-1ioVdwdHrt1QrkCusXLgo6A5pWLXoDdBxj1mQpP7qWw4cjH0RtyyIkBEOR51ri8eyameNft7jYSAEZm01WPY)

위 그림을 보면 about.html 파일이 없고 about 폴더 밑에 page.js 파일이 있네요.

마지막으로 npm run start로 개발 서버를 실행해 보겠습니다.

페이지를 새로고치면 About 페이지가 렌더링되면서 콘솔에 theme-test 값과 로그가 아래 그림과 같이 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiF9YLYcvCmtdjS3um3rA4cIdZYmBAYC6u4qF6vVxAQJL_HGzWFPN8pOBhQyLZt4nWqNRomAN8M13W0drGKUy8-tb7eKf-R-GWEJ2QuRqKcisqa_1XOGn5q5BmGe2xBV14nX8jJW6gvlclkfkzvrB-4gO2CDdWqs_274rE_CZLkxS9AFEtnuAtkWYb4BC8)

네트워크 탭에서도 렌더링된 HTML을 확인할 수 있습니다.

새로고침할 때마다 HTML이 재생성되지만 빌드 폴더엔 파일이 만들어지지 않는데요.

요청 때마다 새 페이지가 생성되므로 빌드 폴더에 HTML 파일을 만들 필요가 없는 거죠. 

여기까지가 동적 렌더링의 기본적인 작동 원리입니다.

정적 렌더링 빌드 과정을 알고 나면 별것 아닌 것 같지만, 앱 빌드와 실행은 실제 프로덕션 환경과 가장 가까운 상황이라고 할 수 있습니다.

그래서 동작 방식을 꼭 이해해 두셨으면 합니다.

앞으로 데이터 fetching 관련 내용도 배우면서 동적 렌더링에 대해 더 깊이 있게 다뤄볼 예정이니 참고바랍니다.

마지막으로 Next.js에서는 개발자가 직접 '정적/동적' 렌더링 전략을 선택할 필요가 없습니다.

Next.js가 사용된 기능과 API를 기반으로 각 라우트에 최적의 렌더링 전략을 자동으로 결정해주니까요.

---

## Streaming

Next.js에서 제공하는 세 번째이자 마지막 서버 렌더링 전략인 스트리밍에 대해 알아보도록 하겠습니다.

스트리밍은 서버에서 점진적으로 UI를 렌더링할 수 있게 해주는 전략입니다.

작업이 여러 개의 청크로 나뉘어 준비되는 대로 클라이언트에 전송되므로, 전체 컨텐츠가 렌더링되기 전에도 페이지의 일부를 즉시 볼수 있는거죠.

스트리밍 기술은 첫 페이지 로딩 성능을 크게 향상 시켜주며, 또한 데이터 페치가 느릴 경우 영향 받는 UI 요소의 성능향상에도 도움이 됩니다.

이 개념은 이전에 리액트 렌더링 기술에 대해 다룬 "Suspense for SSR"에서 다뤘던 내용과 비슷할 겁니다. 

지금은 Next.js 앱 라우터에 기본적으로 통합된 스트리밍에 초점을 맞추고 있습니다.

코드를 직접 타이핑해 보며 애플리케이션에서 수동으로 Suspense 경계를 만들고 성능 향상을 위해 스트리밍에 의존하는 방법을 배워보겠습니다.

먼저, app 폴더 밑에 product-detail 폴더를 만들고 그 밑에 page.tsx 파일을 아래와 같이 만듭니다.

```tsx
import { Product } from "@/components/product";
import { Reviews } from "@/components/reviews";

export default function ProductDetailPage() {
  return (
    <div>
      <h1>Product detail page</h1>
      <Product />
      <Reviews />
    </div>
  );
}
```

위 코드에서 Product 컴포넌트와 Reviews 컴포넌트를 만들어야겠죠.

components 폴더를 src 폴더 밑에 만듭니다.

그리고 각각 product.tsx 파일과 reviews.tsx 파일을 아래와 같이 만들어 주면 됩니다.

```tsx
export const Product = async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return <div>Product</div>;
};
```

```tsx
export const Reviews = async () => {
    await new Promise((resolve) => setTimeout(resolve, 4000));
    return <div>Reviews</div>;
  };
```

앱 라우터에서는 리액트 컴포넌트와 함께 ES 모듈의 async/await를 사용할 수 있습니다.

이 부분에 대해서는 다음에 자세히 다루겠지만, 지금은 Product 컴포넌트의 렌더링을 2초, Reviews 컴포넌트의 렌더링을 4초 동안 의도적으로 지연시켰다는 점을 이해하시면 됩니다.

이는 데이터를 페치(fetch)하고 컴포넌트를 렌더링하는 데 걸리는 시간을 시뮬레이션한 겁니다.

이렇게 설정한 후 개발 서버를 시작해 보겠습니다.

```sh
npm run dev
```

브라우저에서 `/product-detail` 페이지로 이동하면 H1 태그와 두 개의 컴포넌트 JSX(Product, Reviews)가 렌더링되는 데 상당한 시간이 걸리는 것을 확인할 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEi46p_TPxtkXcAqcfIWVeJXNqO3F_zcVXb2RvhHsA3NsYP9R7RxfiLs7BIwA2U4zDaC40ptTegDc9RvGJsfAr0YUM10OUQl_TukpuSFt9Qr9-RrjW6RcJGC_zp9X-p0q8e0bkxO0LIraQN15uJH9z8eBmlVZMXMDpVeYlEjFh-jnBGueEzDPC7qk3kdro0)

위 그림과 같이 페이지를 새로고침하고 네트워크 탭을 보면 서버 응답을 기다리는 시간이 4초를 약간 넘는 것을 알 수 있습니다.

이는 페이지의 데이터를 모두 fetch한 후에야 응답(response)을 보내기 때문입니다.

이제 앱 라우터에서 지원하는 스트리밍 전략을 사용해 보겠습니다.

필요한 작업은 Suspense 컴포넌트를 임포트하고 렌더링 속도가 느린 컴포넌트를 Suspense로 래핑하는 것뿐입니다.

나머지는 Next.js가 알아서 처리해 줍니다. 

아래 코드처럼 Suspense를 래핑해줍니다.

```tsx
import { Suspense } from "react";
import { Product } from "@/components/product";
import { Reviews } from "@/components/reviews";

export default function ProductDetailPage() {
  return (
    <div>
      <h1>Product detail page</h1>
      <Suspense fallback={<p>Loading product details...</p>}>
        <Product />
      </Suspense>
      <Suspense fallback={<p>Loading reviews...</p>}>
        <Reviews />
      </Suspense>
    </div>
  );
}
```

이제 브라우저에서 페이지를 새로고침하면 바로 페이지 제목이 표시되고, 이어서 Product 컴포넌트, 그리고 Reviews 컴포넌트가 렌더링되는 것을 확인할 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgGOkMLSkzFA7pUPy7xgjzsRRvTtTnNENgt_Q-S5RsJD3nDsALMwqK-gGxVnnwwnLACU_wVkALBuo6F9NohGJv65GpEPh8YfWJmDPyDuG37ImVw5sxRZnge7e33swxNucaDwx4yIZz6Gxmk7oKjB6IaYivOOwaPi5R6rZuatUcFx47Ta5YWPjnx1dwIlgM)

![](https://blogger.googleusercontent.com/img/a/AVvXsEi3CX2pdoGrZ473F-gBSNYiRuBCFY6_pbl9nepyaejyCaiPOZtxIYnny4yw5dQNAy6AqEiiI6wR3yYeoUZrxOzwDY_MGN2hvag4b10SNIqPqf31-8YGzU2tiilNvhOJ0GA5uQx_8sVmOIM7FFz-6m35BdaDyizWis2ZD3HHU1roclB1qzj2L2bxomET01Q)

![](https://blogger.googleusercontent.com/img/a/AVvXsEhrGRWZ1CrP035wA80S4l8MkF89HgIE1A0kDFgfMKpTKhWgiUcOsQCZHnBNGmZCfcelcwGrFblQL12Odbco_4QUg7xKHTxvCZGu2cLEHLBeAGVVGZYbu9Fbk4l6Pn5C3EZn7W03k8AhmeDxr0Y1O6epyTHfEsL0FgyIL5u7Wmy5vF10qdC7b6GO4Tb0KY8)


그리고 네트워크 탭에서 폭포수에 마우스를 갖다 대면 아래와 같이 나오는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiycVklkNOgOnGx0To_oOxeUyDaAq7bm7qyjPd7cvUsXt3DcudR3spjBk_SNxAHZsVcIG8bdB2CpY7VAcpKxEdBwQj6hIoiuwlHDDelTQUUJaZnTx3K-3Sbxepi_rrWa_GezogrxZITlfX0WWKRBt-7NBb9EsPxDpQKl3dhFYZRbMCWgY_7AaBE4v7JpjU)

서버 응답을 기다리는 시간(Waiting for server response)이 크게 줄어든 87.0밀리초임을 알 수 있습니다. 

페이지를 다시 새로고침해서 UI 업데이트 과정을 자세히 지켜봅시다.

페이지 제목이 나온 후, 2초 뒤에 Product 컴포넌트가, 그리고 4초 후에 Reviews 컴포넌트가 렌더링됩니다.

이렇게 서버에서 HTML을 점진적으로 클라이언트로 렌더링하는 것이 바로 스트리밍의 핵심입니다.

지금까지 Next.js에서 제공하는 서버 렌더링 전략에 대해 알아보았습니다.

그럼.
