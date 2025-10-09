---
slug: 2024-05-14-nextjs-14-tutorial-all-about-rendering-csr-ssr-rsc
title: Next.js 14 강좌 10편. CSR부터 SSR, RSC까지 React의 렌더링의 역사 살펴보기
date: 2024-05-14 14:47:43.996000+00:00
summary: Next.js 렌더링 공부에 앞서 React 렌더링 역사 알아보기
tags: ["next.js", "rendering", "rsc"]
contributors: []
draft: false
---

안녕하세요?

Next.js 14 강좌 열 번째입니다.

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

- [Rendering](#rendering)
- [Client side rendering(CSR)](#client-side-renderingcsr)
- [Server side rendering(SSR)](#server-side-renderingssr)
  - [SSG vs SSR](#ssg-vs-ssr)
- [Suspense for SSR](#suspense-for-ssr)
- [React Server Component(RSC)](#react-server-componentrsc)
- [서버 컴포넌트와 클라이언트 컴포넌트](#서버-컴포넌트와-클라이언트-컴포넌트)

---

## Rendering

지난 시간까지의 Next.js 강좌에서는 라우팅의 복잡한 부분을 알아봤었는데요.

이제 두 번째 파트인 Next.js 렌더링으로 넘어가겠습니다.

렌더링의 핵심 개념 자체는 간단한데요, 작성한 컴포넌트 코드를 UI로 변환하는 과정이라고 할 수 있습니다.

하지만 렌더링을 언제 어디서 할지 잘 선택하는 게 성능 좋은 앱을 만드는 데 있어 아주 중요합니다.

CSR, SSR, RSC 등의 용어를 보고 헷갈렸을 수도 있는데요. 걱정 하지 마십시오.

지금부터 이 모든 걸 제대로 짚어드리겠습니다.

Next.js 렌더링을 알아보기에 앞서, Next.js가 기반으로 하는 React 라이브러리에서의 렌더링을 먼저 이해해야하는데요.

그래야 Next.js 렌더링 작업도 더 잘 이해할 수 있게 되기 때문입니다.

---

## Client side rendering(CSR)

Next.js에서의 렌더링을 완전히 이해하려면 지난 10년간 React 렌더링의 발전 과정을 알아보는 것이 큰 도움이 됩니다.

그래서 React가 렌더링 전략을 어떻게 발전시켜왔는지 먼저 간단히 살펴보겠습니다.

개발을 꽤 오래하신 분들이라면 React가 싱글 페이지 애플리케이션(SPA)을 만드는 데 가장 좋은 라이브러리였던 것을 기억하실 건데요.

싱글 페이지 애플리케이션(SPA)에서는 클라이언트가 요청하면 서버가 한개의 HTML 페이지를 브라우저로 보냅니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEg335IluxMuM0cm9pUk7DI_bmRRDn0iDMWRyCBSxsQhC-AKMPue6tMiB44A_HVeP_kxVVZwQndw-IOr9MP5U6LptKD6k5zVgPFNPA1GfwpUFetYSd52n_KX-BZIQSUXfg4J7jnXciUckK-TCNRUanIWrj4gdf02wBSV67UXr7wi9wc7wD9ePgoaj3y4AAM)

이 HTML 페이지에는 div 태그 한개와 JavaScript 파일 참조가 포함되어 있는데요.

아래 코드를 보시면 과거 React 앱을 구축할 때 사용했던 `create-react-app`에서 빌드 후 생성된 HTML 파일의 예시입니다.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="Web site created using create-react-app"
    />
    <link rel="apple-touch-icon" href="/logo192.png" />
    <link rel="manifest" href="/manifest.json" />
    <title>React App</title>
    <script defer="defer" src="/static/js/main.de55d082.js"></script>
    <link href="/static/css/main.f855e6bc.css" rel="stylesheet" />
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
```
빈 div 태그와 main.de55d082.js 참조가 보이는데요.

이 JavaScript 파일에는 React 라이브러리 자체와 애플리케이션 코드를 포함해 애플리케이션을 실행하는 데 필요한 모든 것이 들어 있습니다.

HTML 파일이 파싱되면 다운로드되고, 다운로드된 JavaScript 코드가 사용자의 컴퓨터에서 HTML을 생성한 다음 루트 div 요소 아래에 삽입합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhV2VdZz0UdPCcXn-kiyoFobw_nxDvIjv7eMrapB78dWtFd32-PXZjNgP3NpJiqLObHus1GkgqcWWD1wwZlhAqk3D4v4g3CPvSuZadbrqnJPTFFj806pfVZykByqjmDGt_jWDt6hmwixBcrUaL5PTiXTSmr3suTs6nKJpjl93KQ3PknviMWV_50fa28Utc)

그러면 브라우저에 UI가 나타나게 되죠.

![](https://blogger.googleusercontent.com/img/a/AVvXsEirR-XICxXBRnZTRlh7uU4kxs9t6Q77mIAKG6hB_eurDy8YLtAzX_paNiZnC8ktUQLxHe6yeOwC4iLDnNZ5s15II_WycxnOIymfjU9N-BKvKWuglxDD4B-KUmh6ZQuD7l3Dx9EqqYho-p-9stW0aKofu3UnCZKWS94v8e4WylVHKvO5VFJXsm8HOTGYSzY)

위 그림과 같이 DOM 인스펙터에서 HTML이 나타나는 것을 볼 수 있지만, 서버가 브라우저로 보낸 HTML 파일은 '소스 보기'에서는 아래 그림과 같이 HTML 코드가 달랑 div 한개 밖에 볼 수 없습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjTf8IAe1hWfMHK5laMoGwvUW2PYnLxB8G4vXyZsabakXogROtUilAcJiwgSSdYhlBVDFWKiWU86XsTjIWNPlSWnyKpqPXSum81yJbonAEcW_FblZww2xEe17zcRQ8TwC80t1n0fIPC2HWG2hTsSbJVso_0tz4fiJCZhzxsxX75OfqFd6eeW7YbEt7wmzs)

이렇게 브라우저 내에서 직접 컴포넌트 코드가 사용자 인터페이스로 변환되는 렌더링 방식을 클라이언트 사이드 렌더링(Client Side Rendering) 일명 CSR이라고 합니다.

클라이언트 사이드 렌더링은 싱글 페이지 애플리케이션의 표준이 되었지만 CSR의 한계도 곧 드러났는데요.

첫째, 단순한 div 태그만 있는 HTML은 검색 엔진이 인덱싱할 수 있는 콘텐츠가 없어 SEO에 좋지 않습니다.

크기가 크고 또는 중첩된 컴포넌트에서 API response를 얻기 위한 request 작업은 보통 폭포수라고 불리우는 waterfall 현상이 발생하면 크롤러가 해당 컨텐츠를 인덱싱할 만큼 빨리 렌더링되지 않을 수 있습니다.

둘째, 브라우저가 데이터 가져오기, UI 계산, HTML 인터렉션 등 모든 작업을 처리하기 때문에 사용자의 컴퓨터 속도에 따라 브라우징 속도가 느려질 수 있습니다.

쉽게 말해, 사용자는 페이지가 로드되는 동안 빈 화면이나 로딩 스피너를 볼 수 있다는 겁니다.

이 문제는 시간이 갈수록 악화되는데, 웹 앱이 버전 업을 하면서 스케일업이 되면 JavaScript 번들 크기가 커져 사용자가 UI를 보는 데까지 대기 시간이 점점 더 길어지기 때문입니다.

이런 지연 현상은 인터넷 속도가 느린 사용자에게 특히 쥐약입니다.

클라이언트 사이드 렌더링은 오늘날 우리가 사용하는 대화형 웹 애플리케이션의 기반을 닦았지만, 반면에 SEO와 성능 저하 때문에 개발자들은 다른 해결책을 모색하기 시작했습니다.

---

## Server side rendering(SSR)

클라이언트 사이드 렌더링의 단점을 요약하자면, 두 가지가 가장 큰 문제점입니다.

첫째, 클라이언트 측에서 JavaScript를 사용해 콘텐츠를 렌더링하기 때문에 검색 엔진이 콘텐츠를 제대로 인덱싱하기 어려워 SEO에 큰 타격을 줄 수 있고,

둘째, 브라우저가 JavaScript를 다운로드, 파싱, 실행해야 하기 때문에 사용자가 보고자 의도하는 콘텐츠를 보기까지 로드 시간이 오래 걸려 사용자 경험(UX)이 저하될 수 있습니다.

그래서 클라이언트 사이드 렌더링의 이런 단점을 극복하기 위해 Gatsby, Next.js 같은 React 프레임워크들은 서버 사이드 솔루션으로 전환했습니다.

서버 사이드 솔루션 방법은 최종 사용자에게 콘텐츠를 전달하는 방식을 근본적으로 바꾸는 건데요.

서버에 Request가 들어오면 빈 HTML 파일 즉, CSR에서 보면 빈 div 태그 하나만 있는 HTML을 보내는 대신, 서버는 전체 레이아웃이 있는 HTML을 렌더링하는 역할을 맡습니다.

이렇게 어느 정도 레이아웃이 구성된 HTML 문서는 브라우저로 직접 전송됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEisWco_dsqXE5wVw0Q8cWUNPVJl3nsbUeDQhFEQErAzu1ALJNhnuXmaLAt1UVwZk3LE5CV7U0OiYSka1m8trlCgzKO26Ut8PbaawwhhgWJBSOBSc0MsH8Z5LBYSqucFyQphlwTdas8od-XsBkHB4uNyejOoZ43jQMn6D5e_yu-Rfn2blcG9N202e24LqAI)

HTML이 서버에서 생성되기 때문에 브라우저는 빠르게 파싱하고 표시할 수 있어 초기 페이지 로드 시간이 개선되는 이점이 있는데요.

이렇듯 서버 사이드 접근 방식은 클라이언트 사이드 렌더링과 관련된 아래 문제점을 효과적으로 해결합니다.

첫째, 검색 엔진이 서버 렌더링된 콘텐츠를 쉽게 인덱싱할 수 있어 SEO가 크게 개선되고,

둘째, 사용자는 빈 화면이나 로딩 스피너 대신 즉시 HTML의 콘텐츠를 볼 수 있습니다.

하지만 빠른 콘텐츠 가시성을 개선하는 SSR 접근 방식에는 특히 페이지의 상호 작용(User Interactive)과 관련된 복잡성이 있는데요.

페이지의 전체 상호작용은 React 자체와 JavaScript 번들이 브라우저에 의해 완전히 다운로드되고 실행될 때까지 보류됩니다.

'하이드레이션'이라고 불리는 이 중요한 단계에서 서버가 최초에 제공한 정적 HTML 페이지가 살아남는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjC52AcbkVEN_DWI_rDZVM46xsEVfC5PimAoYlNom065zRHykSZG1bUm6JJnek7iT87HciqRE8BRRgi9k8niF4bcVvrUM3_pn0EViTyyxXSJm27Y72JZPAQ4b8ri7V1Tq0iQsGnhe9AxiyFx5Kok1B8z1J7GQiVVC6V0TcWn-fyOP32VADrjtXaee7fwo0)

하이드레이션 중에 React는 서버가 제공한 정적 HTML을 기반으로 메모리에서 컴포넌트 트리를 재구성합니다.

이 트리 내에 대화형 요소를 배치할 위치를 계산한 다음, React는 이 요소들에 필요한 JavaScript 로직을 바인딩하는거죠.

이 과정에는 애플리케이션 상태 초기화, 클릭 및 마우스오버와 같은 작업에 대한 이벤트 핸들러 연결, 완전한 대화형 사용자 경험을 위해 필요한 다른 동적 기능 설정이 포함됩니다.

하이드레이션이란 개념은 앞으로 React를 공부하는데 필수적인 개념이므로 꼭 기억하고 넘어갔으면 합니다.

---

### SSG vs SSR

서버 솔루션은 정적 사이트 생성(SSG)과 서버 사이드 렌더링(SSR)의 두 가지로 분류할 수 있는데요.

SSG는 애플리케이션이 서버에 배포될 때 즉, 빌드 할 때 발생합니다.

즉, 컴파일 타임 또는 빌드 타임에 온전한 페이지가 완성된다는 뜻입니다.

블로그와 같이 자주 변경되지 않는 콘텐츠에 이상적인 방식이죠.

반면 SSR은 사용자 요청(Request)에 따라 페이지를 주문형으로 렌더링합니다.

사용자에 따라 HTML이 달라지는 소셜 미디어와 같은 개인화된 콘텐츠에 아주 적합합니다.

보통 이 두 가지를 모두 서버 사이드 렌더링 또는 SSR이라고 통칭합니다.

서버 사이드 렌더링은 초기 페이지 로드 속도와 SEO 개선이라는 점에서 클라이언트 사이드 렌더링보다는 큰 발전이었지만, 나름 SSR만의 어려움도 있었는데요.

하나, SSR의 문제점은 컴포넌트가 렌더링을 시작한 다음 데이터가 로드되기를 기다리거나 일시 중지할 수 없다는 겁니다.

컴포넌트가 데이터베이스나 API와 같은 다른 소스에서 데이터를 가져와야 한다면, 서버가 페이지 렌더링을 시작하기 전에 이 작업이 완료되어야 하는거죠.

이로 인해 서버의 응답 시간이 지연될 수 있고요.

왜냐하면 페이지의 어떤 부분이라도 클라이언트에 보내기 전에 서버가 필요한 모든 데이터를 수집하는 작업을 끝내야 하기 때문입니다.

둘째, SSR 문제점은 React가 서버 렌더링된 HTML에 성공적으로 하이드레이션하기 위해서는 브라우저의 컴포넌트 트리가 서버에서 생성된 컴포넌트 트리와 정확히 일치해야 한다는 겁니다.

이는 컴포넌트들을 하이드레이션하기 전에 클라이언트에 모든 JavaScript가 로드되어야 함을 의미하죠.

셋째, SSR의 문제점은 하이드레이션 자체와 관련이 있습니다.

React는 단일 패스로 컴포넌트 트리를 하이드레이션하는데요.

즉, 하이드레이션을 시작하면 전체 트리를 완료할 때까지 중지하지 않는다는 겁니다.

결과적으로 컴포넌트와 상호작용하기 전에 모든 컴포넌트를 하이드레이션해야 합니다.

이렇게 페이지 전체의 데이터를 로드하고, 페이지 전체의 JavaScript를 로드하고, 페이지 전체를 하이드레이션해야 하는 세 가지 문제로 인해 서버에서 클라이언트 엔드까지 하나의 문제가 해결되어야 다음 문제로 넘어갈 수 있는 모순적인 waterfall 문제가 발생하는 겁니다.

이러한 한계로 인해 React 팀은 개선된 새로운 SSR 아키텍처를 소개했습니다.

그건 바로 Suspense인데요.

---

## Suspense for SSR

다시 한번 서버 사이드 렌더링의 세 가지 주요 문제점을 곱씹어 보면,

첫째, 서버가 HTML 렌더링을 시작하기 전에 데이터 fetching이 완료되어야 한다. 

둘째, 하이드레이션 프로세스를 시작하기 전에 컴포넌트에 필요한 JavaScript가 클라이언트 측에 완전히 로드되어야 한다.

셋째, 컴포넌트가 대화형이 되기 전에 모든 컴포넌트가 하이드레이션되어야 한다.

위 세 가지 문제점으로 인해 All or Nothing 상황이 발생하며, 결과적으로 특정 부분이 다른 부분보다 느리게 되고 결국 비효율성이 초래되는거죠.

이러한 SSR의 성능 문제를 해결하기 위해 React 18에서 Suspense SSR 아키텍처가 도입되었습니다.

이제 Suspense 컴포넌트를 사용하여 주요 SSR 기능인 "서버 측 HTML 스트리밍"과 클라이언트 측 "선택적 하이드레이션"을 활용할 수 있게 되었습니다.

이 두 가지 기능을 자세히 살펴볼까요?

앞서 말씀드린 것처럼 전통적으로 SSR은 All or Nothing 방식이었습니다.

서버가 전체 HTML을 전송하면 클라이언트가 이를 표시하고, JavaScript 번들이 완전히 로드된 후에야 React가 전체 애플리케이션을 하이드레이션하여 상호작용을 할수 있게 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEigS0l3V59lz2MxN1rJFTOosnOO0lKMt-05Dft43sW50lRye7j4rhwdhM8r-xtJ0LweQhjDsouzHs_YcD0ODF-jzTT5BYn_pzJkbPCA1Z0UObQdbmPeRhHzOYcfECApjqbiaoAIutLtedQN1h0qT3FzM_-7aN7m5aafPkjRktdZo0Fwg9XujbwiB61u9gU)

하지만 React 18에서는 새로운 가능성이 생겼는데요.

바로 메인 콘텐츠 영역과 같은 페이지 일부를 Suspense 컴포넌트로 래핑하면 React에 메인 섹션 데이터를 가져오기 전에도 페이지 나머지 부분의 HTML 스트리밍을 시작할 수 있다는 겁니다.

이 때 React는 로딩 스피너와 같은 플레이스홀더를 보내는 거죠.

서버가 메인 섹션 데이터를 준비하면 React는 해당 HTML을 올바르게 배치하는 데 필요한 최소한의 JavaScript가 포함된 인라인 스크립트 태그와 함께 추가 HTML을 진행 중인 스트림으로 전송합니다.

결과적으로 전체 React 라이브러리가 클라이언트 측에 로드되기 전에도 메인 섹션의 HTML이 사용자에게 표시되는거죠.

이를 통해 첫 번째 문제가 해결되는데요.

무언가를 표시하기 전에 모든 것을 가져올 필요가 없게 된 겁니다.

특정 섹션이 초기 HTML을 지연시키는 경우 나중에 스트림에 원활하게 통합할 수 있기 때문입니다.

이 방식이 바로 Suspense가 서버 측 HTML 스트리밍을 용이하게 한다는 핵심입니다.

그렇다고 해도 초기 HTML 전달 속도를 높일 수 있지만, 또 다른 과제가 있는데요.

메인 섹션의 JavaScript가 클라이언트 측에 로드될 때까지 앱 하이드레이션을 시작할 수 없고, 만약 메인 섹션의 JavaScript 번들이 크다면 이 프로세스가 상당히 지연될 수 있습니다.

이를 완화하기 위해 코드 분할(Code Splitting)을 사용할 수 있는데요.

코드 분할을 통해 특정 코드 세그먼트를 즉시 로드할 필요가 없는 것으로 표시하여 번들러에 별도의 스크립트 태그로 분리하도록 신호를 보낼 수 있다고 합니다.

React.lazy를 사용한 코드 분할은 메인 섹션 코드를 기본 JavaScript 번들과 분리할 수 있게 해줍니다.

결과적으로 클라이언트는 React와 메인 섹션을 제외한 전체 애플리케이션 코드가 포함된 JavaScript를 메인 섹션 코드를 기다리지 않고 독립적으로 다운로드할 수 있는거죠.

이게 중요한 이유는 메인 섹션을 Suspense로 래핑하면 React에 페이지 나머지 부분의 스트리밍뿐만 아니라 하이드레이션도 방해하지 말라고 지시하기 때문입니다.

이 '선택적 하이드레이션'이라는 기능을 통해 나머지 HTML과 JavaScript 코드가 완전히 다운로드되기 전에 가능한 섹션들이 차례로 하이드레이션된다는 거죠.

사용자 관점에서 보면 초기에 비대화형 콘텐츠가 HTML로 스트리밍되는 것을 볼 수 있습니다.

그런 다음 React에 메인 섹션의 JavaScript 코드가 아직 없지만 괜찮다고 알립니다.

이는 다른 컴포넌트를 선택적으로 하이드레이션할 수 있기 때문입니다.

메인 섹션은 해당 코드가 로드되면 바로 하이드레이션됩니다. 

선택적 하이드레이션 덕분에 큰 JavaScript 조각이 페이지 나머지 부분의 대화형이 됩니다.

더욱이 선택적 하이드레이션은 모든 것을 하이드레이션해야 상호작용할 수 있어야 한다는 세 번째 문제에 대한 해결책을 제공주는데요.

React는 가능한 한 빨리 하이드레이션을 시작하여 헤더나 사이드 내비게이션 같은 요소와의 상호작용을 가능하게 하며, 이때 메인 콘텐츠가 하이드레이션되기를 기다리지 않습니다.

이 프로세스는 React에 의해 자동으로 관리되며, 여러 컴포넌트가 하이드레이션을 기다리는 시나리오에서 React는 사용자 상호작용에 기반하여 하이드레이션 우선순위를 정합니다.

예를 들어, 사이드 내비게이션이 하이드레이션되기 직전에 메인 콘텐츠 영역을 클릭하면 React는 클릭 이벤트의 캡처 단계에서 클릭된 컴포넌트를 동기적으로 하이드레이션합니다.

이를 통해 컴포넌트가 사용자 작업에 즉시 응답할 수 있도록 하는거죠.

결과적으로 사이드 내비게이션은 나중에 하이드레이션됩니다.

새로운 Suspense SSR 아키텍처를 통해 전통적인 SSR의 세 가지 주요 단점이 모두 해결되었습니다.

이러한 개선에도 불구하고 SSR에는 여전히 몇 가지 문제가 남아 있는데요. 

첫째, JavaScript 코드가 브라우저로 비동기적으로 스트리밍되더라도 결국 웹 페이지의 전체 코드가 사용자에 의해 다운로드되어야 합니다.

애플리케이션에 더 많은 기능이 추가되면 사용자가 다운로드해야 하는 코드량 또한 증가하는데요.

저는 이런 질문을 드릴 수 있습니다.

사용자가 정말 그렇게 많은 데이터를 다운로드하기 원할까요?

둘째, 현재 접근 방식에서는 실제 필요 여부와 상관없이 모든 React 컴포넌트가 클라이언트 측에서 하이드레이션되어야 합니다. 

이 과정은 비효율적으로 리소스를 소비하고 사용자의 디바이스가 클라이언트 측 상호작용이 필요하지 않을 수도 있는 컴포넌트를 처리하고 렌더링해야 하므로 사용자의 로드 시간과 상호작용 대기 시간을 늘릴 수 있습니다.

셋째, 서버가 집약적인 처리 작업을 처리하는 데 뛰어난 역량을 가지고 있음에도 불구하고 JavaScript 실행의 대부분은 여전히 사용자 디바이스에서 이루어지는데요.

특히 성능이 뛰어나지 않은 디바이스에서는 속도 저하를 초래할 수 있습니다.

그래서 다음과 같은 또 다른 중요한 질문을 제기할 수 있는데요.

"이렇게 많은 작업이 사용자 디바이스에서 실행되어야 하나?"

이러한 문제점들은 전통적인 렌더링 기술의 한계를 극복하면서도 개선된 방식으로 더 빠른 애플리케이션을 구축할 필요성을 보여줍니다.

---

## React Server Component(RSC)

React 렌더링 전략이 클라이언트 렌더링에서 서버사이드 렌더링, 그리고 서버사이드 렌더링을 위한 Suspense로 진화해 온 걸 봤는데요.

각 단계마다 개선점도 있었지만 자연스레 새로운 과제도 생겼습니다.

SSR을 위한 Suspense로 원활한 렌더링 경험에 가까워졌지만, 번들 크기 증가, 불필요한 하이드레이션으로 인한 지연, 광범위한 클라이언트 측 처리 등의 문제가 여전했습니다.

이러한 과제를 해결하기 위해서는 점진적인 단계로는 부족했던 거죠.

우리는 더 강력한 솔루션을 향해 과감한 도약이 필요했고, 그게 바로 React 서버 컴포넌트(RSC)로 이어졌습니다.

RSC는 React 팀이 설계한 새로운 아키텍처인데요, 서버와 클라이언트 환경의 장점을 모두 활용해서 효율성, 로드 시간, 상호작용 최적화를 목표로 합니다.

이 아키텍처에서는 클라이언트 컴포넌트와 서버 컴포넌트를 구분하는 이중 컴포넌트 모델을 소개했습니다.

이 구분은 컴포넌트 기능이 아닌 실행 위치와 상호작용 환경을 기반으로 합니다.

클라이언트 컴포넌트는 익숙한 기존 React 컴포넌트인데요, 주로 클라이언트에서 실행되지만 최적화를 위해 서버에서 한번 렌더링될 수도 있습니다.

브라우저 환경에 액세스할 수 있어서 상태, 이펙트, 이벤트 리스너로 상호작용을 처리하고 브라우저 API도 사용할 수 있습니다.

반면 서버 컴포넌트는 전적으로 서버에서만 실행되도록 설계된 새로운 컴포넌트 유형인데요, 기존 클라이언트 컴포넌트와는 달리 코드가 클라이언트로 전송되지 않습니다.

이런 설계 덕분에 여러 이점이 생긴겁니다. 

첫째, 번들 크기가 작아져서 느린 인터넷이나 낮은 사양 디바이스에서도 앱이 빨리 작동합니다.

둘째, 서버 리소스에 직접 액세스할 수 있어서 효율적인 데이터 가져오기와 렌더링이 가능해집니다.  

셋째, 클라이언트로 전송되지 않아서 민감한 데이터나 로직을 보호할 수 있어 보안성이 좋아집니다.

넷째, 데이터 가져오기가 병렬로 이뤄져서 순차적인 경우보다 빨라집니다.

다섯째, 렌더링 결과를 캐싱해서 재사용할 수 있어 비용이 절감됩니다. 

여섯째, 초기 페이지 로드 시간이 빨라집니다.

일곱째, 서버에서 렌더링된 HTML은 검색 엔진 봇에 잘 노출되어 SEO에 유리합니다.

마지막으로 청크 스트리밍이 가능해서 사용자가 전체를 기다리지 않고 먼저 볼 수 있습니다.

RSC 아키텍처에서는 서버 컴포넌트가 데이터 가져오기와 정적 렌더링을, 클라이언트 컴포넌트가 대화형 UI를 맡습니다.

이렇게 단일 언어와 프레임워크로 서버/클라이언트 렌더링 장점을 모두 취할 수 있는 거죠.

결과적으로 RSC는 기존 렌더링 기술의 한계를 극복하면서도 개선하는데요.

서버 컴포넌트는 코드가 서버에 남아 브라우저로 전송되지 않아 앱 속도가 빨라지고, 클라이언트 컴포넌트는 직접 상호작용을 관리합니다.

이 설정으로 웹사이트 속도와 보안이 향상되고 누구나 더 쉽게 사용할 수 있게 됩니다.  

Next.js의 앱 라우터가 RSC 아키텍처 기반으로 구축되어 있다는 건 알고 계셨나요?

즉, 우리가 지금까지 봤던 RSC의 모든 기능과 이점이 이미 최신 Next.js에 녹아들어 있다는 뜻입니다.

React 렌더링 진화를 이해하면 앞으로 Next.js 렌더링을 다룰 때 필요한 배경지식을 갖추게 되는 셈이죠.


## 서버 컴포넌트와 클라이언트 컴포넌트

지난 번에 우리가 서버 컴포넌트랑 클라이언트 컴포넌트를 구분하는 이중 컴포넌트 모델에 대해서 배웠는데요.

React 서버 컴포넌트에 관한 이론이었죠.

이번에는 실제로 Next.js 앱에서 두 가지 유형의 컴포넌트를 만들어보면서 이론을 적용해보겠습니다.

저는 이번 렌더링에 관한 섹션을 위해서 npx create-next-app 렌더링-데모라는 명령어로 새로운 Next.js 프로젝트를 생성했는데요.

이 명령어를 실행하시면 제 프로젝트와 비슷한 프로젝트를 갖게 되실 겁니다.

RSC 아키텍처와 Next.js의 통합에 대해서 알아봐야 할 점이 있는데요.

기본적으로 Next.js 앱의 모든 컴포넌트는 서버 컴포넌트로 간주된답니다.

새로운 Next.js 프로젝트에서 제공되는 루트 레이아웃이나 루트 페이지도 그렇죠. 이거 확인해볼까요?

우리 앱에 새로운 about 페이지를 추가해보겠습니다.

app 폴더 안에 about 폴더를 만들고 그 안에 page.tsx 파일을 생성하죠.

기본 React 컴포넌트로 채워놨는데요.

```tsx
export default function Page() {
  return <h1>about page</h1>
}
```

Next.js 페이지 컴포넌트입니다.

about page라고 이름 붙이고 "about page"라는 h1 태그를 반환하게 했죠.

이렇게 하면 서버 컴포넌트가 생기는 겁니다.

서버 컴포넌트라는 걸 확인해볼까요?

로그 문구를 추가해보겠습니다.

```tsx
console.log('about 서버 컴포넌트')
```

브라우저에서 localhost:3000/about로 가보면 브라우저 콘솔에는 로그가 없고, 대신 터미널에 로그 메시지가 찍히는데요.

우리 방금 만든 컴포넌트가 서버 컴포넌트라는 걸 알 수 있죠.

이 컴포넌트는 서버에서 실행되면서 번들 크기가 0이 되고, 서버 측 리소스에 접근할 수 있고, 보안도 강화되고, SEO도 좋아지는 등 서버 컴포넌트의 모든 이점을 가져가게 됩니다.

하지만 서버 컴포넌트에도 한계가 있는데요.

브라우저 API랑 직접 상호작용하거나 사용자 이벤트를 처리할 수가 없습니다.

그러면 about 페이지에 상태를 추가해볼게요.

useState를 import하고 초기값이 빈 문자열인 name, setName 상태를 만들었습니다.

브라우저로 돌아가면 에러를 볼 수 있는데요.

useState는 클라이언트 컴포넌트 환경을 가정하고 있지만 about page는 서버 컴포넌트라서 그렇습니다.

생각해보면 서버 컴포넌트는 브라우저가 아닌 서버에서 렌더링되니까 브라우저의 상태 개념을 사용할 수가 없겠죠.

이렇게 Next.js에서 생성된 모든 컴포넌트가 달리 지정되지 않으면 서버 컴포넌트라는 걸 다시 한번 확인할 수 있네요.

그럼 about 페이지는 서버 컴포넌트로 두고 새로운 클라이언트 컴포넌트를 만들어볼까요?

app 폴더 안에 dashboard_page.tsx 파일을 만들고 거기에 사용자 이름을 관리하는 상태를 사용하는 간단한 컴포넌트를 내보내겠습니다. 

Next.js 페이지 컴포넌트를 삽입하고 이름을 dashboard_page로 바꿨어요.

useState를 import하고 빈 문자열로 초기화된 name 상태 변수를 만들었죠. 

JSX에서는 input 요소의 값을 name 상태로 지정하고 onChange에서 setName을 호출해서 입력값을 전달하게 했습니다.

그리고 "안녕하세요" 문구 뒤에 name을 렌더링하는 단락 요소를 추가했습니다.

이 파일 맨 위에 "use client"라는 지시문(directive)을 넣어야 하는데요.

이 지시문은 서버에서 클라이언트로 경계를 넘나드는 통행증 역할을 합니다.

이를 통해 클라이언트 컴포넌트를 정의할 수 있죠.

이렇게 하면 Next.js에 dashboard_page 컴포넌트와 이 컴포넌트가 import하는 다른 컴포넌트들이 클라이언트 측 실행을 위한 것임을 알려줍니다.

결과적으로 이 컴포넌트는 브라우저 API에 완전 접근하고 상호작용도 처리할 수 있게 됩니다.

브라우저에서 '/dashboard'로 가보면 상태 기능이 예상대로 잘 작동하는 컴포넌트를 볼 수 있는데요.

클라이언트 컴포넌트의 렌더링 동작에 관해 중요한 점 하나를 알아볼까요?

dashboard 컴포넌트 안에 

```ts
console.log('dashboard 클라이언트 컴포넌트')
```

를 추가해봤습니다.

그리고 홈 페이지에서 대시보드 페이지로 이동할 수 있는 링크를 추가해볼게요.

```ts
import Link from 'next/link'

<Link href="/dashboard">대시보드</Link>
```

로 Link를 가져왔고, 단락 태그 뒤에 컴포넌트를 추가했죠.

브라우저에서 localhost:3000으로 가면 대시보드 링크를 볼 수 있습니다.

이 링크를 클릭하면 브라우저 콘솔에 로그 메시지가 두 번 찍히는데요(React 엄격 모드 때문입니다).

하지만 터미널에는 dashboard 컴포넌트 렌더링에 대한 로그가 없습니다.

그런데 브라우저를 새로고침하면 브라우저 콘솔에 메시지가 다시 나오는 걸 볼 수 있죠?

이번에는 터미널에도 같은 메시지가 출력되네요.

전에 배웠듯이 클라이언트 컴포넌트는 주로 클라이언트에서 실행되고 브라우저 API에 접근할 수 있지만, 최적화 전략으로 서버에서 한 번 미리 렌더링돼서 사용자가 빈 화면 대신 페이지 HTML을 바로 볼 수 있게 해줍니다.

React에서 이렇게 하는 걸 권장하고 있죠.

'클라이언트 컴포넌트'라는 이름이 혼란스러울 수 있는데, 서버에서 한 번 실행된다는 점을 이해하면 React 서버 컴포넌트 공부에 별 지장은 없을 겁니다.

이건 꼭 기억해두셔야 할 중요한 점입니다.

요약하자면, React 서버 컴포넌트 아키텍처와 Next.js 앱 라우터에서 컴포넌트는 기본적으로 서버 컴포넌트입니다.

클라이언트 컴포넌트를 사용하려면 맨 위에 'use client' 지시문을 넣어야 합니다.

서버 컴포넌트는 서버에서만 렌더링되지만, 클라이언트 컴포넌트는 서버에서 한 번, 그리고 클라이언트에서도 렌더링됩니다.

---

다음 시간에는 RSC의 렌더링 리이프 사이클과 그외 여러가지 렌더링에 대해 더 알아보겠습니다.

그럼.
