---
slug: 2024-01-28-complete-understanding-nextjs-ssr-and-react-rsc
title: Next.js의 SSR과 React의 RSC(React Server Components) 완벽 이해
date: 2024-01-28 08:15:33.088000+00:00
summary: SSR과 RSC의 차이에 대해 심도 있게 공부해 보기
tags: ["next.js", "ssr", "react", "rsc"]
contributors: []
draft: false
---

안녕하세요?

Next.js의 SSR과 React 18의 RSC(React Server Components)에 대해 알아 볼건데요.

Next.js의 SSR과 App Router에 대한 글은 아래 링크를 통해 한번 읽어 보고 이 글을 진행해 나가면 좀 더 이해가 쉬울겁니다.

** 목 차 **

* 1. [서론](#1)
* 2. [React 렌더링 (CSR)](#ReactCSR)
* 3. [SSR(서버 사이드 렌더링)](#SSR)
* 4. [Next.js](#Next.js)
* 5. [Next.js의 렌더링 방식](#Next.js-1)
	* 5.1. [SSG(Static Site Generation)](#SSGStaticSiteGeneration)
	* 5.2. [ISR(Incremental Static Regeneration)](#ISRIncrementalStaticRegeneration)
* 6. [App Router](#AppRouter)
* 7. [RSC(React Server Component)](#RSCReactServerComponent)
* 8. [배포 번들 크기의 경량화](#2)
* 9. [RSC(React Server Component) 렌더링](#RSCReactServerComponent-1)
* 10. [비동기 렌더링](#3)
* 11. [use client 디렉티브](#useclient)
* 12. [use client의 의미](#useclient-1)
* 13. [다룰 수 있는 데이터의 차이](#4)
* 14. [경계 내에서는 use client를 한 번만 선언해야 함](#useclient-2)
* 15. [마무리](#5)

---

##  1. <a name='1'></a>서론

Github vercel의 Next.js 리포지터리에서 아래와 같은 토론이 지금 화두인데요.

https://github.com/vercel/next.js/discussions/46795

![](https://blogger.googleusercontent.com/img/a/AVvXsEi6hQSBc9DJVsGF00smG7DB278UkrrLuC4D0zo6Ny4xU7FZ9NK3tVgjgtI4HpouBinfamFxv18Quqy8LSpAaRl48QeVCjJ-YIOvmfhmp1TVXNNR5Qbj3RsUTCBlYX1N510C8LwCO218-nATincL-kX8V1FZWGuUEBfrCz1T3UEWR1TZMde73RVjiACi8FU)

도대체 이해할 수가 없어 RSC나 클라이언트 컴포넌트에 대해 이번에 배운 내용을 한번 정리해 봤습니다.

이 글에서 아래의 내용을 이해할 수 있을 겁니다:

- React와 Next.js에 대해 App Router란 무엇인가?

- RSC(React Server Component)란 무엇인가?

- RSC와 클라이언트 컴포넌트의 차이
 
- RSC와 클라이언트 컴포넌트의 렌더링에 대해 (SSR과 CSR에 대해)
  
---

##  2. <a name='ReactCSR'></a>React 렌더링 (CSR)

React로 구현된 애플리케이션을 SPA(싱글 페이지 애플리케이션)라고 합니다.

이 SPA의 한 가지 문제점은 초기 표시가 느리다는 겁니다.

초기 표시가 느린 이유는 React 등의 SPA 애플리케이션은 모두 CSR(클라이언트 사이드 렌더링)으로 렌더링을 수행하기 때문입니다.

CSR은 브라우저에서 JavaScript를 실행하여 DOM을 생성하고 화면을 표시하는 렌더링 방법입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEie-GWUPtQlEeLHNpcnYl_Sq5C1WRReKFYbCbd_P337LjT76VSLGRj9zyoJ09W2_-sCujLt_viPz-65uCECDfT33RUcPO0AcZlYwjnO30Vg3LOjyfDjXy0OIGUhgfMII4BGFg2tquoKHXIZyRpozxykPzu3vHDRAIfL8l2scOAl3UU5rIqobU0uD6PKR-E)

즉, 다양한 라이브러리 등을 포함한 React 애플리케이션 내의 코드가 실행되어야만 처음으로 화면이 표시된다는 겁니다.

그러나, React는 가상 DOM이라는 기술을 사용하여, 렌더링 시에 DOM의 차이를 감지하고, 차이가 있는 DOM만 업데이트하므로, 첫 표시 이후의 렌더링은 빠릅니다.

단지, 첫 표시가 느리다는 문제가 있다는 것을 인식해 주십시요.

React 렌더링에 대해 더 자세히 알고 싶으신 분은 아래의 문서를 참조해 주세요.

[렌더링 그리고 커밋](https://ko.react.dev/learn/render-and-commit)

---


##  3. <a name='SSR'></a>SSR(서버 사이드 렌더링)

SPA(싱글 페이지 애플리케이션)의 초기 표시가 느린 문제를 해결하는 방법이 SSR(서버 사이드 렌더링)입니다.

SSR에서는, 애플리케이션의 모든 것을 JavaScript로 그리는 것이 아니라, 미리 서버에서 정적인 HTML을 생성하는 렌더링 방법입니다.

즉, SPA의 처음에 표시되는 화면의 HTML만 서버에서 렌더링하여 배포하는 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEi05A2pMhW3yUro-4igJBc3vxYPlWBaE1K09C42amZ4rf4jjDERJf5JilM1D6NMccZnZ9Z7TXTx8KgbyURcrvAWwXH1q33of5tUl38blzbJMGtfvwvWYxREUqNyL-FkSb8pSlJ0X40Ks8fIHHzmS3Hg3nKzoRyfXTRK1Wh6kU3XAi3fV9umVyG0hRde9Cc)

> 하이드레이션(Hydration): 서버 측에서 렌더링된 HTML에 대해 JavaScript를 클라이언트에서 연결하는 작업(HTML에 연결된 JavaScript를 실행하여 이벤트 리스너 등 인터랙티브한 조작을 할 수 있게 하는 작업)

하이드레이션를 통해, SPA의 문제점이었던 초기 렌더링을 빠르게 할 수 있습니다.

UX는 물론, 서버 측에서 생성한 HTML에는 메타 정보도 포함할 수 있으므로 SEO에도 효과가 있다고 합니다.

(CSR에서는 JavaScript가 실행되어 처음으로 HTML이 생성되므로, 크롤러가 다운로드하는 HTML에 메타 정보가 포함되어 있지 않은 경우가 있어 SEO에 불리하다고 합니다)

그러나, 이러한 SSR을 구현한 애플리케이션은 React에서는 구현할 수 없습니다.

그래서, 나오는 것이 Next.js입니다.

참고로, Next.js(Pages Router)에서 SSR을 구현하는 경우에는, getServerSideProps라는 비동기 함수를 이용하면 됩니다.

---

##  4. <a name='Next.js'></a>Next.js

현재, Next.js에는 두 가지 구현 방식(라우팅 방식)이 있지만, 렌더링의 종류에 대해서는 변하지 않으므로, 각 렌더링 방식을 알아본 후, 라우팅 방식의 차이를 알아보겠습니다.

- Pages Router

- App Router

---

##  5. <a name='Next.js-1'></a>Next.js의 렌더링 방식

기본적으로, Next.js에서는 모든 페이지를 사전 렌더링합니다.

사전 렌더링이란, Next.js가 각 페이지의 HTML을 클라이언트 측의 JavaScript로 생성하는 것이 아니라, 미리 생성해 두는 것입니다.

즉, 사전 렌더링은 SSR과 같다는 것입니다.

그래서, Next.js의 렌더링 방식의 종류에 대해 이야기하면, Next.js에는 SSR을 포함하여 아래의 4가지 렌더링 방식이 있습니다.

CSR을 제외하면 모두 사전 렌더링입니다.

- SSR
- SSG
- ISR
- CSR

SSR과 CSR은 앞서 설명했으므로, 설명을 생략하고, SSG, ISR만 살펴보겠습니다.

###  5.1. <a name='SSGStaticSiteGeneration'></a>SSG(Static Site Generation)

SSG는 애플리케이션을 빌드할 때 HTML을 생성하는 렌더링 방식입니다.

SSR과 달리, 유저의 요청보다 먼저 HTML이 생성되어 있는 렌더링이라는 겁니다.

SSG로 생성된 HTML은 요청마다 재사용되며, CDN에서 캐시할 수도 있습니다.

Next.js에서는, 데이터가 없는 페이지(정적 HTML)뿐만 아니라, 빌드 시에 데이터를 가져오거나 등록한 HTML을 생성할 수도 있습니다.

Pages Router에서는, getStaticProps나 getStaticPaths를 사용하여, 위의 내용을 실현할 수 있습니다.

SSG에서는 요청마다 서버가 HTML을 렌더링할 필요가 없습니다(이미 HTML이 생성되어 있음).

따라서, SSR에 비해 렌더링이 매우 빠릅니다. 그래서, 기본적으로는 SSG의 사용이 권장됩니다.

###  5.2. <a name='ISRIncrementalStaticRegeneration'></a>ISR(Incremental Static Regeneration)

SSG의 경우, 빌드를 다시 하지 않는 한 페이지를 업데이트할 수 없는 문제가 발생합니다.

이를 해결하는 것이 ISR이라는 렌더링 방식입니다.

ISR의 메커니즘은, 먼저, 페이지에 요청이 들어왔을 때 빌드 완료된 정적 페이지를 표시하면서, 백그라운드에서 재렌더링을 수행합니다.

그리고, 재렌더링이 완료되면 즉시, 새로 생성한 페이지를 표시합니다.

이것이 ISR의 메커니즘입니다.

즉, SSG와 SSR의 장점을 모두 취할 수 있는 렌더링 방식이라는 위치입니다

(SSG에 의한 빠른 응답을 실현하면서, 어느 정도의 데이터 일관성을 보장할 수 있음)

Next.js(Pages Router)에서는, getStaticProps의 반환 값에 revalidate라는 파라미터를 추가하여 실현할 수 있습니다.

이 revalidate에는 페이지의 재생성 간격을 지정합니다.

예를 들어, revalidate: 60으로 설정하면, 60초마다 페이지를 재생성할 수 있습니다.

---

##  6. <a name='AppRouter'></a>App Router

RSC는 App Router의 기반 기술입니다.

그러므로 App Router를 이해하기 위해서는 RSC의 이해가 필수입니다.

전제로, App Router에서는 모든 컴포넌트가 기본적으로 RSC가 되었습니다.

그리고 클라이언트 컴포넌트로 처리하고 싶은 경우에는, 파일의 맨 앞에 use client 지시문을 선언하도록 변경되었습니다.

즉, 필요한 부분만 클라이언트에서 실행하도록 하는 것이 기본적인 생각입니다.

이 점을 전제 지식으로 가지고 있어야 합니다.

여기서, 드디어 본론인 RSC와 클라이언트 컴포넌트에 대해 설명하겠습니다.

---

##  7. <a name='RSCReactServerComponent'></a>RSC(React Server Component)

"RSC가 뭐야?"라는 질문에 한마디로 말하자면 컴포넌트 단위로 렌더링 방식을 SSR 또는 CSR로 나눌 수 있는 기술입니다.

즉, 컴포넌트가 렌더링되는 위치가 서버 측인지 클라이언트 측인지를 식별하는 기술입니다.

여기서, 서버 측에서 렌더링되는 컴포넌트를 '서버 컴포넌트’라고 하고, 클라이언트 측에서 렌더링되는 컴포넌트를 '클라이언트 컴포넌트’라고 합니다.

이 RSC에는 다음의 3가지 장점이 있습니다.

- 배포 번들 크기의 경량화

- 비동기 렌더링 가능

- 백엔드에 직접 액세스 가능

※ RSC를 사용하면, 무조건적으로 번들 크기가 감소하는 것은 아니라고 합니다.

반대로 단점으로는, 다음의 2가지가 있습니다.

- 브라우저 API를 사용할 수 없음
- useEffect 등의 React 훅을 사용할 수 없음

단점으로 언급한 것처럼 브라우저 API나 훅을 사용하여 사용자와의 인터랙티브한 조작을 구현하려면, 클라이언트 컴포넌트에서 수행해야 합니다.

그러기 위해서는, 앞서 언급한 것처럼 use client 지시문을 파일에 선언해야 합니다.

---

##  8. <a name='2'></a>배포 번들 크기의 경량화

서버 컴포넌트는 처리 결과만을 브라우저에 전송합니다.

예를 들어, 날짜 처리를 위한 외부 라이브러리를 설치하여 사용하더라도, 그 라이브러리의 소스 코드 자체는 브라우저에 전송되지 않습니다.

이로 인해 브라우저에 전송하는 파일의 용량이 줄어들고, 성능이 향상됩니다.

---

##  9. <a name='RSCReactServerComponent-1'></a>RSC(React Server Component) 렌더링

흔히들 하는 오해 중 하나는 "SSR과 RSC의 렌더링이 같다"는 것입니다.

실제로는, SSR과 RSC의 렌더링에는 차이가 있으므로, 조심하게 이해해야하는데요.

먼저, 앞서 언급한 것처럼, SSR은 다음과 같이 렌더링합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhberVT11KSiX4VWs_YgfAvBMtsgc0D_mFqilAoASQxkW3Uvf9XHCNU9pYncJ_K0urGlSRmtC70Uz9tMsAaCT0JBIiGyuWnMcuDoIDNImRsjcgp7k-kek9OwB0xqbitL8pltL1t29RgvqXqYPH-PcxJ9BuBNeQWYsBdvxqAdqrFeoXZpLbItR9W4tvHa8o)

1. 서버에서 전체를 렌더링하고, HTML을 생성
2. 생성한 HTML을 DOM에 반영하고, 클라이언트 측에서 표시
3. JavaScript 하이드레이션

서버 측에서 HTML을 생성함으로써 초기 표시를 빠르게 하는 것이 특징이었죠?

반면, RSC에서는 다음과 같이 렌더링됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEi_YrOUcEyvYI-j0MlJ_HrUi-KVdOsiQ1gL2hDfjYPA71WKzdJ1XiKgIKgutooBb0FQV-x9qloHOjUKTZiJfNtcUp88pQS4XXpfngEQTUi_NkzPR-qguohjT-UGZG8DEZ3EUS_3MKMuZxY0YXANWg_dNN_DujVNwYlLBKEEoVZFSbLQfYurtKTs36EECrc)

1. 서버 측에서 서버 컴포넌트를 렌더링한다.
2. 서버 컴포넌트의 HTML과 클라이언트 컴포넌트의 JavaScript를 클라이언트 측에 전송한다.
3. 클라이언트 컴포넌트를 렌더링한다.
4. 생성한 HTML을 DOM에 반영하고, 화면을 표시한다

큰 차이점은 다음의 3가지입니다.

- SSR의 경우 초기 표시가 빠르고 SEO에 유리하다.

- RSC의 경우 서버와 클라이언트에서 각각의 컴포넌트가 렌더링된다

- SSR의 경우 클라이언트에 전송되는 JavaScript의 양이 많다

SSR과 RSC의 렌더링을 비교했지만, 실제로는 함께 사용할 수도 있습니다.

조합한 경우는 다음과 같습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjpxEPlJDOlAL7MVG0eD0vhmCB-bbQcLWBkLuOT_MX6JTzTWNxbEpOwctBlxHmPcu81Q_hy7Hsb3bZ52rgDiNbFh81jZgZcuCkjC3H_8iNTuIxjeQwpnchfYHhnNxOFGIJTc-HNoIWEo91UW_48jZmNP87lNz-I3xIEajn-kkpVHF7KQUURyrlMeR1xkX4)

1. 서버 측에서 서버 컴포넌트를 렌더링한다.
2. 서버 측에서 클라이언트 컴포넌트도 렌더링한다.(SSR 시의 동작)
3. 생성한 서버 컴포넌트와 클라이언트 컴포넌트의 HTML을 클라이언트 측에 전송하여 DOM에 반영한다.
4. 초기 표시.
5. 클라이언트 측에 클라이언트 컴포넌트의 JavaScript를 전송하고, 하이드레이션한다.


이렇게 SSR과 RSC를 조합함으로써, 초기 표시를 빠르게 하면서, 클라이언트 측에 전송하는 JavaScript의 양을 줄일 수 있습니다.

---

##  10. <a name='3'></a>비동기 렌더링

React 18에서 서버 사이드 렌더링을 강화하기 위해 비동기 SSR이라는 새로운 기능이 추가되었습니다.

이를 통해, 컴포넌트 단위로 SSR을 수행할 수 있게 되었습니다.

즉, 렌더링에 시간이 걸리는 컴포넌트를 서버 측에서 처리하는 도중에 화면을 표시하고, 또한 사용자는 그 화면을 조작할 수 있습니다.

이전의 React에서 SSR을 수행하면 페이지 전체의 렌더링이 완료될 때까지 브라우저에 HTML을 전송할 수 없었습니다.

React 18에서는 Suspense라는 컴포넌트로 구분된 단위로 비동기로 SSR을 수행합니다.

페이지 전체의 렌더링이 완료되지 않아도 브라우저 상에서 표시를 시작할 수 있습니다.

그리고 렌더링 중인 컴포넌트는 Suspense의 인수로 지정된 로딩을 표시하고, 렌더링이 완료되면 교체됩니다.

이를 스트리밍 HTML이라고 합니다.

또한, 비동기 SSR을 수행하면서, 먼저 로드되어 화면에 표시된 부분을 인터랙티브하게 조작할 수도 있습니다.

즉, 하이드레이션을 단계적으로 수행한다는 것입니다.

이것도 React 18에서 실행할 수 있게 된 기능 중 하나입니다.

이러한 단계적인 하이드레이션을 선택적 하이드레이션이라고 합니다.

구현하면 다음과 같습니다.

Suspense로 PostList를 감싸서, 데이터가 가져올 수 있을 때까지 Spinner로 로딩 표시를 하면서, Sidebar는 표시하고, 또한 인터랙티브한 조작도 할 수 있게 합니다.

가져오기가 완료되면 PostList가 표시됩니다.

```js
import { Suspense } from "react";
import { Sidebar } from '@/components/Sidebar';
import { Spinner } from '@/components/Spinner';
import { PostList } from '@/components/PostList';

const Home = async () => {
  const res = await fetch('/api/posts')
  const posts = await res.json()
  
  return (
    <div>
      <div>
        <Sidebar />
      </div>
      <Suspense fallback={<Spinner />} >
        <div>
	  <PostList posts={posts} />
	</div>
      </Suspense>
    </div>
  )
}

export default Home
```

이상이 RSC에 대한 설명입니다.

---

##  11. <a name='useclient'></a>use client 디렉티브

use client 디렉티브에 대해 설명하겠습니다.

자주 하는 오해 중 하나는 "use client를 붙이면 클라이언트 컴포넌트가 된다"는 겁니다.

아래 토론을 참고하면 이해가 깊어질 겁니다.

[![](https://blogger.googleusercontent.com/img/a/AVvXsEjSOJLj3ObeudCnaPgk5pdCwpYzXzIc6MtGyojYBd7Ayi30VWEtW9iuHkdPZtjsKe8_8OwF1Ktbk5cFzkmj5pr7W_kMgdHBaiUYilMgM-Xii1C9Dc4e2rcSWHER8OJeoOXBSgZqE_iWKzPf7QSQU-81k6aS6oSDx5d-Qh4YcV6jXcEElYHnpymD7M6UASQ)](https://github.com/vercel/next.js/discussions/46795)

---

##  12. <a name='useclient-1'></a>use client의 의미

use client 디렉티브는 해당 파일 내의 컴포넌트가 클라이언트 측에서만 실행된다는 것을 나타냅니다.

이는 해당 파일이 서버 컴포넌트와 클라이언트 컴포넌트의 경계를 나타낸다는 의미입니다.

이것이 무엇을 의미하는지라는 것은, RSC의 컴포넌트 간 통신에서 다룰 수 있는 데이터에 차이가 있다는 것을 의미합니다.

즉, props로 전달할 수 있는 데이터에 차이가 있다는 것입니다.

---

##  13. <a name='4'></a>다룰 수 있는 데이터의 차이

결론적으로 말하면, 네트워크(서버)를 통한 데이터의 교환은 직렬화된 데이터로 통신해야 한다는 것입니다.

use client 디렉티브가 있는 경우, 해당 파일 내의 하위 컴포넌트의 속성은 직렬화 가능해야 하며, 이는 네트워크를 통해 데이터를 전송하는 요구사항입니다.

직렬화 가능한 데이터는 JSON으로 표현할 수 있는 데이터(객체, 배열, 문자열, 숫자, 불리언, null, undefined)를 가리킵니다.

이들 이외의 것들은 직렬화할 수 없는 데이터가 됩니다.

예를 들어, 객체나 배열은 JSON으로 다룰 수 있으므로, 직렬화된 데이터라고 할 수 있습니다.

반면에, 함수는 객체로 다룰 수 있지만, JSON 객체로 표현할 수는 없습니다.

그러므로, 함수는 직렬화할 수 없는 데이터가 됩니다.

---

##  14. <a name='useclient-2'></a>경계 내에서는 use client를 한 번만 선언해야 함

토론의 예에서는, MessageInput에 use client를 선언하고 있어서 "Props must be serializable for components in the 'use client' entry file, 'setMessages' is invalid."라는 오류가 발생합니다.

```js
// parent.tsx

"use client";
import { Message } from "@prisma/client";
import React, { useState, useEffect } from "react";
import MessageInput from "./MessageInput";

type Props = {
  initialMessages: Message[];
};

export default function MessagesContainer({ initialMessages }: Props) {
  const [messages, setMessages] = useState(initialMessages);
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <MessageInput messages={messages} setMessages={setMessages} conversationId={""} />
    </div>
  );
}
```

```js
// child.tsx

"use client";
import { ConversationRole, Message } from "@prisma/client";
import React, { useState } from "react";

type Props = {
  messages: Message[];
  setMessages: (message: Message[]) => void;
  conversationId: string;
};

// The error exists on `setMessages` here
export default function MessageInput({ messages, setMessages, conversationId }: Props) {
  const [input, setInput] = useState("");

  return (
    <div>
      <input
        onKeyDown={async (e) => {
          if (e.key === "Enter") {
            setMessages(newMessage);
            setInput("");
          }
        }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
    </div>
  );
}
```

이 경우, MessageInput에서 use client를 제거하면 정상적으로 작동합니다.

왜냐하면, 부모 컴포넌트에서 use client를 선언하고 있고, 그곳에서 import하고 있기 때문에, 다시 MessageInput에 대해 use client를 선언하지 않아도 클라이언트 컴포넌트로 인식되기 때문입니다.

즉, use client 지시문 내에서 import된 것은 부모 컴포넌트 내의 범위에서 실행되므로 클라이언트 컴포넌트로 인식됩니다.

따라서, 직렬화되지 않은 함수를 props로 전달할 수 있습니다.

즉, use client는 서버 컴포넌트와의 경계이므로, "이 파일에 import된 것은 클라이언트 컴포넌트로 처리하십시오"라는 선언이 됩니다.

따라서, MessageInput에서 use client를 선언하면, "이 파일에 import된 것은 클라이언트 컴포넌트로 처리하십시오"라는 것을 자식 컴포넌트에서도 선언하게 됩니다.

그러므로, MessageInput에 import된 것은 클라이언트 컴포넌트로 인식됩니다.

여기까지가 올바른 동작입니다.

이것을 use client 지시문을 선언하고 있는 부모 컴포넌트에서 import하면 "서버 컴포넌트와의 경계는 이 파일이어야 하는데, import된 컴포넌트에도 경계가 있다"라고 Next.js는 인식합니다.

즉, 자식 컴포넌트의 파일에서 새로운 클라이언트 컴포넌트의 경계를 만들려고 하므로, Next.js가 혼란스러워하여 오류가 발생하는 것입니다.

요약하면, 이 문제는 부모와 자식에서 use client를 선언하려고 할 때 발생합니다.

서버 컴포넌트와의 경계라는 것을 알고 있다면, 부모 컴포넌트에서만 선언할 수 있어야 합니다.

왜냐하면, use client를 선언한 파일에서 import된 컴포넌트는 클라이언트 컴포넌트로 인식되기 때문입니다.

---

##  15. <a name='5'></a>마무리

Next.js는 기능이 매우 많으며, 개발하기 상당히 쉽지만, 개념 이해를 소홀히 하면 산으로 갈 수 있기 때문에 기본 지식을 이해하고 넘어가는게 가장 중요합니다.

그럼.

