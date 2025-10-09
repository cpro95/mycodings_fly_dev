---
slug: 2023-10-21-astrojs-in-depth-review-component-island-architecture
title: astrojs 강좌 4편. astrojs 아일랜드 아키텍처 완벽 분석
date: 2023-10-21 08:38:53.676000+00:00
summary: astrojs 아일랜드 아키텍처 자세히 알아보기
tags: ["astrojs", "component", "island architecture"]
contributors: []
draft: false
---

안녕하세요?

astrojs 강좌가 벌써 4번째네요.

전체 astrojs 강좌 목록입니다.

1. [astrojs 강좌 1편. astrojs에서 데이터 가져오기](https://mycodings.fly.dev/blog/2023-10-07-astrojs-tutorial-how-to-handle-data-in-astrojs)

2. [astrojs 강좌 2편. React 쓰지 않고 순수 자바스크립트로 Dark Mode 만드는 법](https://mycodings.fly.dev/blog/2023-10-14-astrojs-tutorial-clean-build-of-darkmode-theme)

3. [astrojs 강좌 3편. 웹 컴포넌트로 직접 아일랜드 아키텍처 구현해 보기](https://mycodings.fly.dev/blog/2023-10-14-understanding-astosjs-island-architecture-from-making-my-own-island-web-component)

4. [astrojs 강좌 4편. astrojs 아일랜드 아키텍처 완벽 분석](https://mycodings.fly.dev/blog/2023-10-21-astrojs-in-depth-review-component-island-architecture)

5. [astrojs 강좌 5편. astrojs 라우팅 완벽 분석(routing, dynamic routing)](https://mycodings.fly.dev/blog/2023-10-29-astrojs-all-about-routing-and-dynamic-routing)

6. [astrojs 강좌 6편. astrojs Content Collection과 다이내믹 라우팅 접목하기](https://mycodings.fly.dev/blog/2023-10-29-astrojs-howto-use-content-collection-and-dynamic-routing)

7. [astrojs 강좌 7편. astrojs Server Side Rendering(SSR) 완벽 분석](https://mycodings.fly.dev/blog/2023-10-30-astrojs-howto-use-ssr-in-astrojs-server-side-rendering)

8. [astrojs 강좌 8편. astrojs와 firebase로 유저 로그인 구현](https://mycodings.fly.dev/blog/2023-11-08-astrojs-how-to-ssr-with-firebase-user-session)

9. [astrojs 강좌 9편. astrojs와 supabase로 유저 로그인 구현](https://mycodings.fly.dev/blog/2023-11-09-astrojs-howto-supabase-authentication-with-ssr)

10. [astrojs 강좌 10편. astrojs에서 쿠키와 토큰을 이용해서 유저 로그인 구현](https://mycodings.fly.dev/blog/2024-01-02-astrojs-auth-user-login-by-cookie-with-jwt-token)

11. [astrojs 강좌 11편. astrojs와 lucia를 이용해서 유저 인증 구현](https://mycodings.fly.dev/blog/2024-01-16-astrojs-tutorial-auth-with-lucia)

---

** 목차 **

1. [AstroJS에 React, Vuejs 컴포넌트 사용하기](#1-astrojs에-react-vuejs-컴포넌트-사용하기)

2. [여러 개의 다른 UI 컴포넌트 한꺼번에 사용하기](#2-여러-개의-다른-ui-컴포넌트-한꺼번에-사용하기)

3. [아일랜드 아키텍처 간 State 공유하기](#3-아일랜드-아키텍처-간-state-공유하기)

4. [props, children 전달하기](#4-props-children-전달하기)

5. [Astro에서 slot 지정해서 React, Vue 컴포넌트에서 받기](#5-astro에서-slot-지정해서-react-vue-컴포넌트에서-받기)

6. [중첩으로 컴포넌트 사용하기](#6-중첩으로-컴포넌트-사용하기)

7. [주의 사항](#7-주의-사항)

8. [아일랜드 아키텍처의 장점](#8-아일랜드-아키텍처의-장점)

---

## 1. AstroJS에 React, Vuejs 컴포넌트 사용하기

AstroJS는 기본적으로 자바스크립트를 최대한 배제하려고 하는 프레임워크인데요.

어쩔 수 없이 자바스크립트를 써야한다면 그냥 `<script>` 태그를 사용해서 바닐라 자바스크립트를 사용하면 됩니다.

그런데, 오늘날 UI 프레임워크로 나온 수많은 그 좋은 프레임워크나 라이브러리가 그렇게 많은데요.

이걸 쓰지 못한다면 조금은 불편할 수 있습니다.

그래서, AstroJS에서도 지원하는데요.

사실 AstroJS도 직접 새로운 UI 라이브러리를 만들어 제공하는 줄 알았는데, AstroJS는 그냥 기존에 나와있는거 갔다 쓰면 됩니다.

즉, 현재 가장 유명한 React, Vue, Svelte 등 UI 라이브러리를 그냥 사용하면 됩니다.

이 방식이 AstroJS를 아주 유명하게 해주는 점인데요.

AstroJS가 지원하는 외부 UI 라이브러리는 React, Preact, Svelte, Vue, SolidJS, AlpineJS, Lit입니다.

좋다는 건 다 지원하네요.

오늘은 가장 많이 쓰이는 React와 Vue를 통해서 아일랜드 아키텍처에 대해 알아보겠습니다.

먼저, React나 Vuejs를 사용하려면 아래와 같이 설치해야 합니다.

```bash
npx astro add react vue
```

위와 같이 설치하면 astro.config.mjs 파일에 아래와 같이 integrations 부분에 react와 vue가 추가가 됩니다.

```js
import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import react from '@astrojs/react'
import vue from '@astrojs/vue'

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react(), vue()],
})
```

보통 React나 Vue 같은 UI 라이브러리는 컴포넌트 형태로 사용하는데요.

그래서 components 폴더를 만들고 필요한 React, Vue 컴포넌트를 만드는 형식입니다.

Vue는 .vue 확장자를 사용하고, React는 .jsx .tsx 확장자를 사용해서 평소처럼 만들면 됩니다.

그러면 React 컴포넌트를 하나 만들어 볼까요?

src/components/ReactVote.tsx 파일을 아래와 같이 만듭니다.

```js
import { useState } from 'react'

export const ReactVote = props => {
  const [voteCount, setVoteCount] = useState(0)

  return (
    <div>
      <button
        className='rounded-xl border bg-sky-300 px-4 py-2'
        onClick={() => {
          setVoteCount(prevCount => prevCount + 1)
        }}
      >
        Vote!!
      </button>

      <div
        className='bg-red-500 py-2'
        style={{
          width: `${voteCount}%`,
        }}
      >
        {voteCount}
      </div>
    </div>
  )
}
```

위 코드를 보시면 전형적인 React의 useState를 이용한 가장 기본적인 코드인데요.

이제 pages 폴더에서 react.astro 파일을 만듭시다.

```js
---
import Main from "../layout/Main.astro";
import { ReactVote } from "../components/ReactVote.tsx";
---

<Main title="Astro Component">
  <h1>Astro with React Component</h1>
  <div>
    <ReactVote />
  </div>
</Main>
```

Main, Header 컴포넌트는 지난 시간에도 나왔고 간단한 거라서 생략했습니다.

이제 실행 결과를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEg2b0Y8y7gCFtyOjrhYbMVQtY0MHg_IeBSHPh-wxuuTihjbLbwxIwgB836KGZCY2-xDDSeCcChNXuTKAXKDojWRGqt9GiTeivc-BYmb6xrxbGEQi23MnJYpt-lS_ZdTe4CMWrSgZ8z6r0szqpzBCW-9MkuBIOwMj0fB08DBtYOSDFOoE2IqG1TmGeISh3g)

위와 같이 잘 작동하는데요.

버튼을 눌러보면 작동하지 않습니다.

왜 그런 걸까요?

바로 AstroJS가 NoJavascriptByDefault 이기 때문입니다.

자바스크립트를 기본적으로 배제하는 게 바로 AstroJS입니다.

그래서 React 같은 UI 자바스크립트 컴포넌트를 사용할 때 바로 아일랜드 아키텍처를 사용해야 합니다.

지난 시간에 직접 웹 컴포넌트로 아일랜드 아키텍처로 구현해 봤듯이 AstroJS의 아일랜드 아키텍처 구현 방법은 아래와 같습니다.

- client:load
- client:only
- client:visible
- client:media
- client:idle

위와 같이 5가지가 있는데요.

각각의 특성에 대해 알아보겠습니다.

---

### 1.1 client:load

`client:load`는 가능한 한 빨리 상호작용이 필요한 최우선 순위 인터페이스에 사용하면 됩니다.

우선순위: 높음
상호작용: 높음

`client:load` hydration 단계입니다.

1. 컴포넌트 HTML 렌더링(아직 '하이드레이션'되지 않음).
2. 페이지가 로드될 때까지 기다립니다.
3. 컴포넌트 Javascript를 로드합니다.
4. 컴포넌트 '하이드레이션'을 진행합니다.

'load' 이벤트는 스타일시트, 스크립트, iframe, 이미지와 같은 각종 종속 리소스를 포함하여 페이지가 로드된 후에 발생합니다.

---

## 1.2 client:only

`client:only`는 `client:load`와 유사하게 동작합니다.

컴포넌트가 초기에 HTML로 렌더링 되지 않는 즉, 서버 측 렌더링을 건너뛰고 클라이언트에 표시되는 즉시 상호작용하도록 작동합니다.

우선순위: 중간 (초기 컴포넌트 HTML을 표시하지 않는 것이 괜찮음)
상호작용: 높음 (사용자에게 표시되자마자)

```js
<ReactVote client:only='react' />
```

위에 표시된 대로 프레임워크 이름을 전달하는 것이 중요합니다.

그렇지 않으면 Astro는 어떤 프레임워크 Javascript를 로드해야 하는지 모르게 됩니다.

왜냐하면 서버 측 렌더링을 건너뛰기 때문이죠.

```js
<ReactComponent client:only="react" />
<PreactComponent client:only="preact" />
<SvelteComponent client:only="svelte" />
<VueComponent client:only="vue" />
<SolidComponent client:only="solid-js" />
```

다음은 'hydration' 단계입니다:

1. 컴포넌트 HTML을 렌더링하지 않습니다.
2. 페이지가 로드될 때까지 기다립니다.
3. 컴포넌트 Javascript를 로드합니다.
4. 컴포넌트 '하이드레이션'을 진행합니다.

`client:only`와 `client:load`의 차이점은 요소가 상호작용 가능하기 전에 정적 컴포넌트 HTML을 렌더링할 것인지 여부입니다.

`client:only`는 특히 클라이언트 (브라우저) API가 필요한 컴포넌트를 렌더링할 때 유용합니다.

---

### 1.3 client:visible

`client:visible`은 페이지의 아래쪽(페이지 아래부분)에 있는 우선순위가 낮은 인터페이스나 리소스가 많이 필요한 부분에 사용하면 좋습니다.

페이지를 보는 유저가 해당 컴포넌트를 볼 일이 없다면 아예 메모리에 로드되지 않으니까요.

우선순위: 낮음
상호작용: 낮음

```js
<ReactVote client:visible />
```

다음은 'hydration' 단계입니다:

1. 컴포넌트 HTML을 렌더링합니다.
2. 요소가 표시되기를 기다립니다 (IntersectionObserver를 사용).
3. 컴포넌트 Javascript를 로드합니다.
4. 컴포넌트 '하이드레이션'을 진행합니다.

---

### 1.4 client:media

`client:media`는 특정 화면 크기에서만 볼 수 있는 낮은 우선순위 인터페이스에 사용하면 좋습니다.

예를 들어, 사이드바 토글과 같은 경우가 여기에 해당합니다.

우선순위: 낮음
상호작용: 낮음

```js
<ReactVote client:media='(max-width: 30em)' />
```

다음은 'hydration' 단계입니다:

1. 컴포넌트 HTML을 렌더링합니다.
2. 미디어 쿼리가 일치하는지 확인합니다.
3. 컴포넌트 Javascript를 로드합니다.
4. 컴포넌트 '하이드레이션'을 진행합니다.

---

### 1.5 client:idle

`client:idle`는 즉시 상호작용이 필요하지 않은 낮은 우선순위 인터페이스 같은 곳에 사용하면 좋습니다.

우선순위: 중간
상호작용: 중간 (client:load와 비교했을 때 상대적으로 낮은 우선순위)

```js
<ReactVote client:idle />
```

다음은 'hydration' 단계입니다:

1. 컴포넌트 HTML을 렌더링합니다.
2. 페이지 로드를 기다립니다.
3. requestIdleCallback 이벤트가 발생하기를 기다립니다. (requestIdleCallback이 지원되지 않는 경우 문서 로드 이벤트만 사용합니다)
4. 컴포넌트 Javascript를 로드합니다.
5. 컴포넌트 '하이드레이션'을 진행합니다.

---

이제, 5가지 아일랜드 아키텍처를 구성하는 요소를 알아봤으니까요.

```js
---
import Main from "../layout/Main.astro";
import { ReactVote } from "../components/ReactVote.tsx";
---

<Main title="Astro Component">
  <h1>Astro with React Component</h1>
  <div>
    <ReactVote client:load />
  </div>
</Main>
```

`client:load`를 적용하여 실행해 보면 아래 그림과 같이 우리가 만든 React 코드가 정상 작동할 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgUWBG669SR9ZK7MyPZufQM97A8vjmORKPwGepwJGmSNcqn1riuum_pcNX7ry93KrLPD5bnq5LG7QercOMvB3IeIq2eIPd6r5o40QoQb_ScWcWh3qFP4gV-SSMAd-wUR9KM2bWSw1OnMA5NVMLhRCICjneMliSLWgKzeWAL_AMYImtfVIkI7sf3QyPEe9g)

---

### Vue 컴포넌트 작성

React 컴포넌트도 만들었으니까 Vue 컴포넌트도 만들어 볼까요?

components 폴더에 VueVote.vue 파일을 만들면 됩니다.

```js
<script>
export default {
  data() {
    return {
      voteCount: 0,
    };
  },
  methods: {
    vote() {
      this.voteCount++;
    },
  },
};
</script>

<template>
  <div>
    <button class="border px-4 py-2 bg-yellow-300 rounded-xl" @click="vote">
      Vote!!
    </button>

    <div class="bg-red-500 py-2" :style="{ width: `${voteCount}%` }">
      {{ voteCount }}
    </div>
  </div>
</template>
```

```js
---
import Main from "../layout/Main.astro";
import VueVote from "../components/VueVote.vue";
---

<Main title="Vuejs Page">
  <h1>Vuejs Page!</h1>
  <div>
    <VueVote client:load />
  </div>
</Main>

```

실행 결과는 아래와 같이 잘 작동합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjZFbAeSbHjpchzTmUr1nuctXAsxc3EKiP1cB06lTGKRCcbIbZxM3BrrI3uPwVkx_HMy9gznW5jMlEUuxQGw1wuCEADLc1-9wgDCbdePtNAjjfSln8nHgWeVPXe9o2RsywWHnE0d3lmj-Pt7J6UYAuH6WrgsVA2caDcbl4HOvZeR0i1f2VZ2zdgFUJJ-8k)

---

## 2. 여러 개의 다른 UI 컴포넌트 한꺼번에 사용하기

말 그대로 한 개의 astro 파일에 React, Vue 등 다른 UI 라이브러리 컴포넌트를 동시에 사용할 수 있습니다.

pages 폴더에 multi.astro 파일을 아래와 같이 만들어 볼까요?

```js
---
import Main from "../layout/Main.astro";
import { ReactVote } from "../components/ReactVote.tsx";
import VueVote from "../components/VueVote.vue";
---

<Main title="Astro Component">
  <h1>Astro with 3rd party Component</h1>
  <div>
    <ReactVote client:load />
    <VueVote client:load />
  </div>
</Main>
```

위 코드를 보시면 그냥 단순하게 React나 Vue 컴포넌트를 불러오고 사용하면 됩니다.

실행 결과를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEhLWkh3WGiw7yHbQEgMrvMz7vqIaIM6XfDwPO_G1VKKvHdoozJ7AjL3AC98zn_e1rGo9dZK6uJNY0OULhLDwTCoD5GkzwtmbiegiXU05VQ-yQmCN-QU7AhO2wcYMYhxjKMS9aqBdUdsd82gAPSzZtTCqohr6GRwSN_YF6xM3vQzmmTXL5zwTNOO4bHXV-Q)

위와 같이 두 개가 로드되었고 아래와 같이 두 개의 컴포넌트 모두 작동합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjj1cpEpTYNvI2nxx9lgAzmA2p9eLplKeBKzyYcPPDqxz4i3ApMxMOqiPoE0RGmUEmA_s74Wo10CCPxzyhE_-RXqr2xJqMgo671t3cAV-Jz-Fvvc43AeW0oXzuPfdXUzY8kC1pU3pGtspuG_6T88XKwaLv1s6t3sSvqo9yxqCBBfVUMWkf6O86leNw_sNM)

즉, React 컴포넌트 부분이 한 개의 아이랜드가 되고, Vue 컴포넌트 부분이 다른 한 개의 아일랜드가 되는겁니다.

이렇게 아일랜드 아키텍처가 작동하는 거죠.

---

## 3. 아일랜드 아키텍처 간 State 공유하기

React 컴포넌트와 Vue 컴포넌트 간 상태를 공유할 수 있을까요?

방법은 글로벌 상태관리 프레임워크를 사용하면 됩니다.

상태관리 프레임워크에는 Redux 등 여러 가지가 많은 데요.

AstroJS가 자바스크립트를 최소한 로드시키는 게 AstroJS의 목적이자 장점인데요.

그래서 Nano Stores 라는 아주 작은(1kb 이하) 프레임워크를 사용하는 걸 추천합니다.

이제 이걸 사용해 볼까요?

nanostores 를 아래와 같이 설치합시다.

```js
npm install nanostores @nanostores/vue @nanostores/react
```

이제 상태를 담을 store 를 만들어야 하는데요.

src 폴더 밑에 stores 폴더를 만들고 vote.ts 파일을 만듭시다.

```js
import { atom } from 'nanostores'

export const voteCountState = atom(0)
```

어떤가요?

정말 간단하지 않나요?

이제 이 nano store를 React나 Vue 컴포넌트에서 사용하면 됩니다.

먼저, React 컴포넌트를 수정해 보겠습니다.

```js
import { useStore } from '@nanostores/react'
import { voteCountState } from '../stores/vote'

export const ReactVoteNano = () => {
  const voteCount = useStore(voteCountState)

  return (
    <div>
      <button
        className='rounded-xl border bg-sky-300 px-4 py-2'
        onClick={() => {
          voteCountState.set(voteCount + 1)
        }}
      >
        Vote!!
      </button>

      <div
        className='bg-red-500 py-2'
        style={{
          width: `${voteCount}%`,
        }}
      >
        {voteCount}
      </div>
    </div>
  )
}
```

Nano Stores 사용 방법은 아주 간단합니다.

useStore를 이용해서 우리가 만든 State를 불러오고 이 State의 set 메서드를 이용해서 vote 카운트를 1씩 증가시키면 됩니다.

이제, Vue 컴포넌트도 바꿔 볼까요?

```js
<script>
import { useStore } from "@nanostores/vue";
import { voteCountState } from "../stores/vote";

export default {
  setup(props) {
    return {
      voteCount: useStore(voteCountState),
    };
  },
  methods: {
    vote() {
      voteCountState.set(this.voteCount + 1);
    },
  },
};
</script>

<template>
  <div>
    <button class="border px-4 py-2 bg-yellow-300 rounded-xl" @click="vote">
      Vote!!
    </button>

    <div class="bg-red-500 py-2" :style="{ width: `${voteCount}%` }">
      {{ voteCount }}
    </div>
  </div>
</template>
```

이제 Nano Stores를 이용해서 만든 React 컴포넌트와 Vue 컴포넌트를 같이 불러와서 테스트해 보겠습니다.

```js
---
import Main from "../layout/Main.astro";
import { ReactVoteNano } from "../components/ReactVoteNano.tsx";
import VueVoteNano from "../components/VueVoteNano.vue";
---

<Main title="Astro Component">
  <h1>Astro with 3rd party Component</h1>
  <div>
    <ReactVoteNano client:load />
    <VueVoteNano client:load />
  </div>
</Main>
```

실행 결과는 아래 그림과 같이 한쪽 Vote 버튼을 누르면 다른 쪽도 똑같이 반응합니다.

왜냐하면 Nano Stores를 이용해서 React와 VueJS간에 State(상태)를 공유했기 때문입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEg_TL1UVe7ydu-SnQ73MMsqPTBP2HiJoqzROr0Oaae-QftKfpZCB2L3wSnN-3q7vxW2WqQmV15GTM38rZoIgrMlm8cDm4c9Rmi-AzXLH2-bWqjvP_9EGuBUXG-1v6DWPz51jSrc9kBh2k8WNVLTWj6lo_tCc0hInK02TK8JRTWM2T1qPZTUaOBjwBqIlZs)

위 그림에서 볼 수 있듯이 버튼을 누르면 같은 Vote 숫자가 올라가게 됩니다.

---

## 4. props, children 전달하기

우리가 만든 React, Vue 컴포넌트에 Astro 파일에서 props나 children을 전달할 수 있는데요.

다음과 같은 코드가 있다고 합시다.

```js
<ReactVoteNano client:load label='React Props 전달' />
```

아까 만든 ReactVoteNano 컴포넌트에서 label이라는 props를 전달하고 있는데요.

그럼 ReactVoteNano 컴포넌트에서 이 props를 처리해 볼까요?

```js
export const ReactVoteNano = (props) => {
  const voteCount = useStore(voteCountState);

  return (
    <div>
      <h1>{props.label}</h1>
      ...
      ...
      ...
  )}
```

위와 같이 React 코드에서 props 전달하듯이 사용하면 됩니다.

실행 결과는 아래와 같습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEj0BFwkjhXfKfnhZg71IUQsjGHlGNXr5D8dj0GJbb87B0-Vffsgno8JGZDNa5iIyyktWEdn3i3BPeGKG1sj8uCppwkbAJAvIYhjqh9zbPScvMIrm-uDRw93kU19NAnwO274I8omAFq8DdPfmgfLbW8kYqPRoLlgHpj0iZuEFuKg71UmLPlxkXtlLns_XAw)

그러면 props 말고 children은 잘 될까요?

테스트해 보겠습니다.

```js
<ReactVoteNano client:load label='React Props 전달'>
  <em>React child 전달하기</em>
</ReactVoteNano>
```

위와 같이 props와 children을 전달했습니다.

```js
export const ReactVoteNano = (props) => {
  const voteCount = useStore(voteCountState);

  return (
    <div>
      <h1>{props.label}</h1>
      <h2>{props.children}</h2>
      ...
      ...
      ...
  )}
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEj0uZ5gUumdxVtl8eXHjcW9cBjT20wzxqh7uF5k6FQGv-Kd9UaqAWJ2fho5fzCbGMaobuQJWmt6YGsIHs9FQi6CPq_jpVgK_ti7tZ2kXyMtU75WZfnOhM4I4SFlFgU4DBV9CN6NB2Ue-Lp4XdwYJ6Vqz59FIHvCdafdV3anjZAjwQ32OkGBFcFSJYNmBqM)

위 그림을 보시면 children으로 전달한 부분은 `<em>` 태그라서 강조하는 태그이거든요.

이 태그가 그대로 잘 전달되고 있습니다.

React는 props와 children 방식을 쓰는데요.

Preact도 같은 방식입니다.

Vue와 Svelte는 slot 방식을 쓰는데요.

이 부분도 알아보겠습니다.

```js
<VueVoteNano client:load label='Vue Props 전달'>
  <em>Vue child 전달하기</em>
</VueVoteNano>
```

VueVoteNano 컴포넌트를 손볼까요?

```js
<script>
import { useStore } from "@nanostores/vue";
import { voteCountState } from "../stores/vote";

export default {
  props: {
    label: String,
  },
  setup(props) {
    return {
      voteCount: useStore(voteCountState),
    };
  },
  methods: {
    vote() {
      voteCountState.set(this.voteCount + 1);
    },
  },
};
</script>

<template>
  <div>
    <h1>{{ label }}</h1>
    <h2><slot /></h2>

    ...
    ...
    ...
</template>
```

위와 같이 props와 slot 형태로 사용하시면 됩니다.

실행 결과는 아래와 같습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgpF8RbHAugGZMUX8_C9s3csrsjY-8n7crY-YkNqqFRi388lo8JeY8WuUXx2WQxd8kVsolACKUx3VjzIy6tDPNal5yacKAB0P7teD62RucOxrrnIsJvo8GkstkmiDCcf8uFMlofz5gKrZc9dFCeVBXhaz6DXtKWlZlQopNsp8opveQR2SYkCAVo5NSMYdI)

React와의 차이점은 children 방식이 아니고 slot 방식이란 겁니다.

---

## 5. Astro에서 slot 지정해서 React, Vue 컴포넌트에서 받기

Astro 파일에서 slot을 지정할 수 있는데요.

아래와 같이 React 컴포넌트를 children 방식으로 사용할 때 전달하는 거에 slot을 이용해서 구분할 수 있습니다.

```js
<ReactVoteNano client:load label='React Props 전달'>
  <span>This is a children!</span>
  <ul slot='social-links'>
    <li>First</li>
    <li>Second!</li>
  </ul>
  <em slot='desc'>This is React Component</em>
</ReactVoteNano>
```

위 코드를 보시면 ReactVoteNano 컴포넌트를 전달할 때 전달할 수 있는 모든 걸 전달했는데요.

먼저, props로 label을 전달했고, children도 전달했습니다.

그래서 children을 slot 이름을 지정해서 전달했는데요.

이제, React 코드를 볼까요?

```js
export const ReactVoteNano = (props) => {
  const voteCount = useStore(voteCountState);

  return (
    <div>
      <h1>{props.label}</h1>
      <h2>{props.children}</h2>
      <div>{props.socialLinks}</div>
      <div>{props.desc}</div>
      ...
      ...
      ...
  )}
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEiapjrw4j3lcNUuyZTnwtqD-MQuUKUek6dJYI5TCrbl8StBCpoozLvdz9Kv89v55IsqDo41sHJ2E7pyClsGHm2xT9uueLVERnZ82kCx_Y2-RSUg-WpiMmiwbmZlzKJzk-2fCw5HYur2M5-_ErUfgi6mvYx4pxFw1LSOrcfPTvECmevd27MhoLhTJTQJdRA)

실행 결과는 위와 같습니다.

어떤가요?
slot으로 지정하면 해당 부분을 특정 위치에 위치시킬 수 있는 아주 강력한 무기가 됩니다.

근데, 여기서 이상한 게 Astro에서 slot으로 'social-links' 형태의 케밥케이스(kebab-case) 형태로 전달했는데요.

React에서는 캐멀케이스(camelCase) 형태로 사용했습니다.

이건 규칙인데요.

Astro에서는 꼭 케밥케이스 형태로 써야 하고, React에서는 꼭 캐멜케이스(camelCase) 형태로 써야 합니다.

---

## 6. 중첩으로 컴포넌트 사용하기

AstroJS에서는 심지어 React나 Vue 컴포넌트를 중첩(Nested)하여 사용할 수 있는데요.


```js
<ReactVoteNano client:load label="React Props 전달">
  <span>This is a children!</span>
  <ul slot="social-links">
    <li>First</li>
    <li>Second!</li>
  </ul>
  <em slot="desc">This is React Component</em>

  <VueVoteNano client:load />
</ReactVoteNano>
```

위 코드를 보시면 ReactVoteNano 컴포넌트 안에 VueVoteNano 컴포넌트를 위치시켰습니다.

위 코드도 아주 정상적으로 작동합니다.

실행 결과를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEi0SZbj_LZAIaNVmifGUFQD_XGgUhh0uSl9PpBrUWB-pu8V5oO6td8Q-1tKeTTacDYsg8XicnW9XE974hJYJVBgiTvg95ziTnLXUz7VRniLoQi52026XkRqKDfPU6KKDQqMU-vcGvHGwLKwxyNUKXFKQI6k-6ZdxWgRakRDMklXLieAZjBemFoKwgnO_wg)

어떤가요?

AstroJS의 유연함에 대해서는 상상을 초월하는데요.

---

## 7. 주의 사항

AstroJS가 아주 유연한 프레임워크인 거는 확실한데요.

다음과 같이 사용하시면 안 됩니다.

꼭 주의하시기 바랍니다.

1. React 컴포넌트 안에서 Astro 컴포넌트 사용하기

```js
import { OurAstroComponent } from "../components/OurAstroComponent";

const OurReactComponent = () => {
  return (
    <div>
      <OurAstroComponent />
    </div>
  );
};
```

```js
<OurReactComponent client:load />
```

위 코드를 보시면 평상시와는 반대로 사용했는데요.

React 컴포넌트 안에서 Astro 컴포넌트를 사용했습니다.

위와 같이 사용하시면 에러가 나니 꼭 주의 바랍니다.

꼭 React 컴포넌트에서 Astro 컴포넌트를 사용해야 한다면 slot 방식을 사용하면 됩니다.

```js
---
import { OurReactComponent } from "../components/OurReactComponent"
import { OurAstroComponent } from "../components/OurAstroComponent"
---

<OurReactComponent client:load>
 <!-- pass Astro component as a child via a named slot -->
 <OurAstroComponent slot="description" />
</OurReactComponent>
```

2. Astro 컴포넌트에 아일랜드 아키텍처 사용하지 말기

다음과 같이 하시면 안 됩니다.

```js
---
 import { OurAstroComponent } from "../components/OurAstroComponent"
---

<OurAstroComponent client:load />
```

Astro 컴포넌트는 기본적으로 client-side 런타임이 없기 때문에 위와 같이 hydrate가 불가능합니다.

Astro 컴포넌트에서는 `<script>`를 이용해서 간단한 자바스크립트 코드를 작성하는 걸 추천 드립니다.

---

## 8. 아일랜드 아키텍처의 장점

'아일랜드 아키텍처'에 왜 초점을 맞추는 걸까요?

1. **성능**

주요 이점 중 하나는 성능을 향상할 수 있다는 것입니다.

대부분의 웹사이트를 정적 HTML로 변환하고 필요한 경우에만 Javascript를 '하이드레이션'함으로써 웹사이트의 성능을 크게 향상할 수 있습니다.

바로 Javascript가 바이트당 로드 속도가 느린 것 중 하나이기 때문입니다.

2. **하이드레이션**

만약 Javascript를 실행하는 데 많은 리소스가 소요된다면(성능 측면에서) 세심한 주의가 필요할 겁니다.

그래서 '아일랜드'가 언제 '하이드레이션'되는지를 제어함으로써 웹사이트 성능을 조절할 수 있다는 게 큰 장점인 거죠.

3. **병렬 로딩*

마지막으로, 병렬 로딩인데요.

여러 개의 '아일랜드'를 로드할 때 실제로 서로 기다릴 필요가 없다는 겁니다.

대신, 각 '아일랜드'는 독립적으로 로드되고 '하이드레이션'되는 즉, 각각 별개의 단위로 간주 됩니다.

---

지금까지 AstroJS의 아일랜드 아키텍처에 대해 알아보았습니다.

그럼.
