---
slug: 2023-10-14-understanding-astosjs-island-architecture-from-making-my-own-island-web-component
title: astrojs 강좌 3편. 웹 컴포넌트로 직접 아일랜드 아키텍처 구현해 보기
date: 2023-10-14 07:32:05.631000+00:00
summary: 웹 컴포넌트를 직접 만들어 보면서 배우는 astrojs의 아일랜드 아키텍처
tags: ["astrojs", "island architecture", "web component"]
contributors: []
draft: false
---

안녕하세요?

astrojs 강좌가 벌써 3번째네요.

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

1. [Island Architecture 아일랜드 아키텍처](#1-island-architecture-아일랜드-아키텍처)

2. [my-island 웹 컴포넌트 구현으로 아일랜드 아키텍처 구현해 보기](#2-my-island-웹-컴포넌트-구현으로-아일랜드-아키텍처-구현해-보기)

3. [웹 컴포넌트 클래스 작성](#3-웹-컴포넌트-클래스-작성)

4. [하이드레이션 구현하기](#4-하이드레이션-구현하기)

5. [client:visible 구현하기](#5-clientvisible-구현하기)

6. [client:idle 구현하기](#6-clientidle-구현하기)

7. [client:media 구현하기](#7-clientmedia-구현하기)

---

## 1. Island Architecture 아일랜드 아키텍처

Astrojs를 공부하다 보면 아일랜드 아키텍처라는 용어를 많이 듣는데요.

patters.dev 사이트에서 설명한 아일랜드 아키텍처를 요약한 말이 있습니다.

> 아일랜드 아키텍처를 사용하면 서버 렌더링되는 웹 앱 내에서
> 작은 단위의 인터렉트에 집중한 분리된 코드 조각을 만들게 된다.<br />
> 아일랜드 아키텍처는 점전직으로 향상되는 HTML을 만들어낸다.<br />
> 일 앱이 전체 페이지 렌더링을 컨트롤하는 대신, 다수의 엔트리 포인트가 존재한다.<br />
> 이 “아일랜드”의 상호작용을 위한 스크립트들은 독립적으로 클라이언트에 전송되고 hydrate되며
> 그 외 나머지 페이지들은 정적 HTML로 렌더링 하게 된다.

바로 클라이언트 사이드 렌더링(CSR)과 서버사이드 렌더링(SSR)의 중간으로 CSR과 SSR의 장점을 뽑아 만든 건데요.

자바스크립트 부분을 최대한 목적에 맞게 늦게 로드한다는 겁니다.

이걸 처음부터 구현한 게 Qwik 프레임워크인데요.

Qwik 프레임워크는 모든 자바스크립트 로드가 목적이 이루어질 때만 로드됩니다.

그래서 초기 HTML 로드 타임이 빠른 거죠.

Astrojs는 철저히 자바스크립트를 배제하고 순수한 HTML과 CSS만 로드하는 걸 선호합니다.

그래야 웹 페이지가 빠르게 로드되거든요.

그런데 현대적인 웹 페이지에서는 자바스크립트가 필수입니다.

사용자와의 상호작용이 빠질 수가 없는 거죠.

그래서 Astrojs에서 도입한 게 아일랜드 아키텍처(Island Architecture)입니다.

필요할 때만 자바스크립트를 로드한다는 겁니다.

---

## 2. my-island 웹 컴포넌트 구현으로 아일랜드 아키텍처 구현해 보기

그러면 실제로 아이랜드 아키텍처를 구현해 볼까요?

HTML과 JS파일 만 이용해서 아일랜드 아키텍처를 구현해 보면 자연스럽게 astrojs의 아일랜드 아키텍처에 대해 이해할 수 있을 겁니다.

우리가 구현하려는 거는 웹 컴포넌트인데요.

웹 컴포넌트에 대한 설명은 [여기](https://developer.mozilla.org/ko/docs/Web/API/Web_components)를 클릭해서 한번 읽어 보시면 좋습니다.

우리가 만들려고 하는 웹 컴포넌트는 my-island인데요.

```html
<h1>Hello</h1>
<my-island>
  <template>
    <p>Hello from my-island</p>
  </template>
</my-island>
```

위와 같이 template를 이용할 건데요.

왜 template를 이용하냐면 바로 template의 특성 때문입니다.

`<template>`는 HTML에서 브라우저에 의해 파싱 되지만 초기 페이지 로드 시 렌더링 되지 않도록 설계되었는데요.

그래서 보통 자바스크립트를 사용하여 나중에 동적으로 삽입할 클라이언트 측 콘텐츠를 보유하는 메커니즘으로 작동합니다.

기능은 다음과 같습니다:

1. **파싱하지만 렌더링하지 않음:**

   - `<template>` 요소 내부의 내용은 HTML이 로드될 때 브라우저에 의해 파싱됩니다.
   - 그러나 내용은 초기 페이지 뷰에서 렌더링 되지 않습니다.

2. **JavaScript 사용:**

   - JavaScript는 `<template>` 요소의 내용에 액세스하고 복제할 수 있습니다.
   - 복제된 내용은 동적으로 문서에 삽입되거나 조작될 수 있습니다.

3. **일반적인 사용 사례:**
   - 주로 데이터가 채워진 후에 표시되어야 하는 클라이언트 측 템플릿을 보유하는 데 사용됩니다.
   - 나중에 숨겨져야 하거나 조건에 따라 표시되지 않아야 하는 콘텐츠의 렌더링을 피하는 데 유용합니다.

간단한 예제를 통해 설명하겠습니다:

```html
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>템플릿 요소 예제</title>
  </head>
  <body>
    <!-- 템플릿 정의 -->
    <template id="myTemplate">
      <p>이 내용은 템플릿 안에 있습니다.</p>
    </template>

    <script>
      // 템플릿에 액세스
      const template = document.getElementById('myTemplate')

      // 템플릿 내용 복제
      const clone = document.importNode(template.content, true)

      // 복제된 내용을 문서에 추가
      document.body.appendChild(clone)
    </script>
  </body>
</html>
```

이 예제에서 `<template>` 요소 내부의 내용은 초기에 렌더링 되지 않았는데요.

위에서 만든 자바스크립트는 template 내용을 복제하고 `<body>` 요소에 추가하여 최종적으로 브라우저에 보이게 만듭니다.

즉, 초기 페이지 렌더링에서는 파싱되지 않고, 개발자가 의도한 데로 자바스크립트 코드를 통해 원하는 시간과 원하는 장소에 넣을 수 있게 됩니다.

그때까지의 내용을 담아 놓는 그릇이라고 보시면 됩니다.

그래서 우리가 만들려고 하는 my-island 웹 컴포넌트는 template를 보유하고 있고 template 안에 있는 걸 아일랜드 아키텍처에 따라 visible, idle, media라는 조건에 따라 보여주는 코드를 만들겠습니다.

최종적인 사용 방법은 아래와 같습니다.

```js
<my-island client:visible>
...
</my-island>

<my-island client:idle>
...
</my-island>

<my-island client:media="(max-width: 400px)">
...
</my-island>
```

visible는 화면에 보이는 경우,

idle은 브라우저가 idle상태 즉, 모든 자료가 로드된 후,

media는 화면 크기에 맞을 경우, 즉, max-width가 400px일 경우에만 작동되도록,

위와 같이 작동하는 나만의 아일랜드 아키텍처를 구현해 보겠습니다.

---

## 3. 웹 컴포넌트 클래스 작성

MDN 사이트에서 웹 컴포넌트는 클래스로 정의된다고 했습니다.

일단 빈 폴더에 index.html 파일과 함께, my-island.js 파일을 아래와 같이 만듭니다.

```js
class MyIsland extends HTMLElement {
  static tagName = 'my-island'

  static attributes = {
    dataIsland: 'data-island',
  }
}

if ('customElements' in window) {
  window.customElements.define(MyIsland.tagName, MyIsland)
} else {
  console.error(
    'Island can not be initiated because browser can not support customElements.',
  )
}
```

MyIsland라는 객체를 구현했고, 구현한 객체를 customElements에 define 해서 정의했습니다.

그러면 index.html에서 사용해 볼까요?

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Island Test</title>
    <script type="module">
      import './my-island.js'
    </script>
  </head>

  <body>
    <p>Test of My Island</p>
    <my-island>
      <script>
        console.log('hello from start of my-island')
      </script>
      <template>
        <script>
          console.log('hello from template of my-island')
        </script>
      </template>
    </my-island>
  </body>
</html>
```

위와 같이 작성했습니다.

my-island.js 파일을 로드하려면 모듈로써 import 해야 합니다.

그래서 위와 같이 해야 합니다.

단순히 `<script src>` 방식으로는 작동되지 않으니 참고 바랍니다.

실행 결과를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEj6Wnl6gfgc0t-Ljg6IuiCOqdJrIwlDnLtfA5mhkyMW_rqW3k_4CdIb3ESyuYZsBiGis7h48ruig7z2Q14DRNonWos1zbcQ9lbq7MGqP5bv4iev9FJMjHdk6E8a7ectufeZBOOGrHEwt0JDRyt_-rsRYfFfgS_spL2FGMYy8VOeOA0CtVtK2XJBgdD_sLM)

위와 같이 my-island 안에 있는 template은 파싱되지 않았네요.

template 바깥에 있는 console log 명령어만 작동했으니까요.

---

## 4. 하이드레이션 구현하기

client:visible 속성은 클라이언트 화면에서 해당 항목이 보일 때 my-island 웹 컴포넌트가 실행되도록 만드는 겁니다.

즉, 한 페이지를 넘어가는 기다란 페이지가 있고 자바스크립트가 있는 곳은 페이지 맨 밑단일 경우, 유저가 페이지를 스크롤해서 자바스크립트가 있는 페이지가 화면에 보였을 때, 이때 로드하는 방식입니다.

그럼 이런 구현을 위해 웹 컴포넌트의 생명 주기 함수인 connectedCallback 함수를 이용해야 합니다.

connectedCallback 함수는 웹 컴포넌트가 DOM에 연결될 때 실행됩니다.

즉, 해당 컴포넌트가 문서에 삽입되면 브라우저에 의해 connectedCallback 함수가 호출됩니다.

이는 컴포넌트의 생명 주기에서 연결 단계에서 발생하는 부분입니다.

간단히 말하면, 해당 웹 컴포넌트가 DOM에 실제로 추가될 때 connectedCallback 함수가 호출되어 초기화 또는 다른 초기 작업을 수행할 수 있습니다.

그래서 hydrate 함수를 바로 connectedCallback 함수 안에 작성하는 이유입니다.

```js
class MyIsland extends HTMLElement {
  static tagName = 'my-island'

  static attributes = {
    dataIsland: 'data-island',
  }

  // 추가된 부분
  // 생명주기 콜백함수
  async connectedCallback() {
    await this.hydrate()
  }

  hydrate() {
    const relevantChildTemplates = this.getTemplates()
  }
  // 추가된 부분
}

if ('customElements' in window) {
  window.customElements.define(MyIsland.tagName, MyIsland)
} else {
  console.error(
    'Island can not be initiated because browser can not support customElements.',
  )
}
```

추가된 부분만 보시면 connectedCallback 함수에서 hydrate 함수를 실행시키는데요.

그리고 hydrate 함수는 template 태그와 관련된 getTemplate 함수를 실행해서 관련 template 정보를 모읍니다.

그러면 getTemplate 함수를 구현해 볼까요?

```js
// 추가된 부분
async connectedCallback() {
  await this.hydrate();
}

hydrate() {
  const relevantChildTemplates = this.getTemplates();
}

getTemplates() {
  return this.querySelectorAll(
    `template[${MyIsland.attributes.dataIsland}]`
  );
}
// 추가된 부분
```

getTemplate는 querySelectorAll 메서드를 이용해서 `template[data-island]`인걸 모두 선택하게 됩니다.

data-island는 우리가 맨 처음 구현했던 아래 class 구현해 보면 attributes 항목에 있습니다.

```js
class MyIsland extends HTMLElement {
  static tagName = 'my-island'

  static attributes = {
    dataIsland: 'data-island',
  }
  ...
}
```

그러면 이제 다시 hydrate 함수를 다시 고쳐 볼까요?

```js
hydrate() {
  const relevantChildTemplates = this.getTemplates();
  this.replaceTemplates(relevantChildTemplates);
}

replaceTemplates(templates) {
  for (const node of templates) {
    // 아래 DOM을
    // <template data-island="">#document-fragment</template>
    // 아래 DOM으로 바꾸는 코드
    // #document-fragment
    node.replaceWith(node.content);
  }
}
```

hydrate 함수를 수정했고 그다음에 replaceTemplates 함수도 추가했습니다.

replaceTemplates 함수에서 실제 node.content를 replaceWith 하게 되는 겁니다.

즉, data-island data 세트가 있는 temlate 태그에서 template 태그만 없애주는 거죠.

node가 `<template data-island="">#document-fragment</template>`인데, node.content 인 `#document-fragment`로 replace 하는 거니까요.

이제, 다시 index.html 파일을 브라우저에서 로드해 볼까요?

아까랑 별 차이가 없습니다.

왜냐하면 template 부분에 data-island 속성을 추가해야 하거든요.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Island Test</title>
    <script type="module">
      import './my-island.js'
    </script>
  </head>

  <body>
    <p>Test of My Island</p>
    <my-island>
      <script>
        console.log('hello from start of my-island')
      </script>
      <template data-island>
        /* 이 부분 추가 */
        <script>
          console.log('hello from template of my-island')
        </script>
      </template>
    </my-island>
  </body>
</html>
```

위와 같이 template 부분에 data-island 속성을 추가했습니다.

왜 추가하냐면 우리가 만든 getTemplate함수에서 data-island 부분만 찾기 때문이죠.

이제 브라우저를 다시 로드해 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEgdZ3zLgg2dWJfyIFFcfOIMjoAhe8XzcWJ5FZ2pFsLb5_3l0sh2du1n19qAKs6KOcp7fjIpIVgAY_24_C8qQ-zyVN4ei_D2NqN6RX_HkY1n7CT5Ic2eBn7pKTEiXBlcDYeeMUZn41vwcgaL9LCmlrBSNVF-RJpoEvn1BekrppBEbPGAlpgNXmam6lWiOm0)

위와 같이 template안에 있는 script도 실행이 됐습니다.

이게 바로 hydrate입니다.

성공적으로 하이드레이션이 구현됐네요.

---

## 5. client:visible 구현하기

하이드레이션도 구현했으니 이제 client:visible 항목에 대한 하이드레이션도 구현해 볼까요?

일단 visible 처럼 화면에서 스크롤해서 해당 항목이 보이게끔 의도적으로 아래 코드를 넣어봅시다.

```html
<p>Test of My Island</p>
<p style="padding-bottom: 100vh">Scroll down</p>
```

padding-bottom을 100vh 로 주면 수직 화면 100%인게 됩니다.

그래서 밑으로 스크롤할 수 있는 거죠.

즉, 스크롤했을 경우만 template 안에 있는 script가 실행되게 끔 만드는 겁니다.

즉, 컨디션(조건)이 만족됐을 경우 작동하게끔 해야 하는데요.

그래서 Conditions 이란 클래스를 하나 더 만들 겁니다.

```js
class Conditions {
  static map = {
    idle: Conditions.waitForIdle,
    visible: Conditions.waitForVisible,
    media: Conditions.waitForMedia,
  }

  static waitForIdle() {
    return new Promise(resolve => resolve())
  }

  static waitForVisible() {
    return new Promise(resolve => resolve())
  }

  static waitForMedia() {
    return new Promise(resolve => resolve())
  }
}
```

Conditions 객체는 3가지 Promise를 리턴하는 함수를 가지는 map이 있습니다.

waitForVisible, waitForIdle, waitForMedia가 그것입니다.

waitForVisible Promise는 my-island가 client:visible 이란 항목으로 작성되었을 때 실행되는 Promise가 되는 거죠.

그러면 client:visible, client:idle, client:media 에 대한 조건 검색을 구현해 보겠습니다.

```js
class Conditions {
  static map = {
    idle: Conditions.waitForIdle,
    visible: Conditions.waitForVisible,
    media: Conditions.waitForMedia,
  }

  static waitForIdle() {
    return new Promise(resolve => resolve())
  }

  static waitForVisible() {
    return new Promise(resolve => resolve())
  }

  static waitForMedia() {
    return new Promise(resolve => resolve())
  }

  static getConditions(node) {
    let result = {}

    for (const condition of Object.keys(Conditions.map)) {
      if (node.hasAttribute(`client:${condition}`)) {
        result[condition] = node.getAttribute(`client:${condition}`)
      }
    }
    console.log('client:condition is ', result)
    return result
  }
}
```

getConditions 함수가 그건데요.

client: 뒤에 오는 visible, idle, media를 구분하여 값을 리턴해 줍니다.

실제 콘솔 로그된 화면을 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEgJrWhFozW4be1Bj_px2K73B2mEn7u13TdtPA9cNoiRvhy_gEpmLcYL7wfwidZu7C_SbAwLzQre7IR53_NWdI1YPoWmqik8ZNhbliaPDjQ0T3nH9KVVwy_SmQRCd3-MqiZ3z0DlCgT4a9CzE6kAoMowvodIq_SaIp_T0N7Gmg36JqX9OdZ-hOwQ1bA1HOI)

위 그림처럼 visible이란 문구가 출력되네요.

이제, Conditions 객체를 이용해서 다시 MyIsland 객체의 hydrate 함수를 손봐야 합니다.

```js
async hydrate() {
  const conditions = [];

  let conditionAttributesMap = Conditions.getConditions(this);

  for (const condition in conditionAttributesMap) {
    const conditionFn = Conditions.map[condition];

    if (conditionFn) {
      const conditionPromise = conditionFn(
        conditionAttributesMap[condition],
        this
      );

      conditions.push(conditionPromise);
    }

    // 해당 컨디션 여기서는 visible이 됩니다.
    // 그래서 waitForVisible 이 실행되는거죠.
    await Promise.all(conditions);

    // template 태그 안에 있는 걸로 교체 즉, template 태그만 삭제
    const relevantChildTemplates = this.getTemplates();
    this.replaceTemplates(relevantChildTemplates);
  }
}
```

getConditions 해서 conditionAttributesMap에 저장하고 그리고 conditionAttributesMap의 condition 을 모두 LOOP해서 해당 Promise를 가져와서 실행하게 됩니다.

이제 index.html 파일에서 아래와 같이 client:visible를 추가해 보겠습니다.

```html
<my-island client:visible> ... ... </my-island>
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEjP7isEN0f1FH6UQKmJNaV-WN4Iaj9CFKPyY_tgZalSSQuGZon8Sp2VVlxu7sHro5UGSYH7V_nEOMSR04qEsYFQlAQ1xvwSOgINREtc70s6l_e_jAZfE_oWbd-CBdF3Oipo1xhv_qy_aYRGmst-5LmjYJDotVcIHyWTBZxbN7Ra1Hh_SXnCYQLk1y8BzzA)

브라우저를 실행해 봐도 template안에 있는 스크립트가 바로 실행되어 버리는데요.

왜냐하면 Conditions 클래스에서 아래 코드처럼 waitForVisible 함수가 아직까지는 Promise를 즉시 반환해서 그렇습니다.

```js
static waitForVisible() {
  return new Promise(resolve => resolve())
}
```

이 부분에서 스크롤이 됐을 경우에만 Promise를 리턴하는 코드를 작성하면 됩니다.

여기에는 IntersectionObserver라는 객체를 이용할 건데요.

예전 React Query에서 Infinite Pagination을 구현할 때 사용한 겁니다.

우리가 예전에 단순하게 Promise를 리턴했던 waitForVisible 스태틱 함수를 수정해 보겠습니다.

```js
// 단순히 Promise만 리턴하는 코드를 아래와 같이 IntersectionObserver를 이용한 코드로 수정하면 됩니다.
// static waitForVisible() {
//   return new Promise(resolve => resolve())
//}

static waitForVisible(noop, el) {
  if (!("IntersectionObserver" in window)) {
    return;
  }

  return new Promise((resolve) => {

    // observer 함수를 만들고
    let observer = new IntersectionObserver((entries) => {
      let [entry] = entries;

      if (entry.isIntersecting) {
        observer.unobserve(entry.target);
        resolve();
      }
    });

    // el 엘러멘트를 observe(관찰) 시작
    observer.observe(el);
  });
}
```

위와 같이 작성하면 client:visible에 대한 구현이 완성되었습니다.

그러면 다시 브라우저를 리프레쉬하고 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEgGFueEBnuVZim-jGMZh-MNHr-_QPZnyJV0wZGM2-om2IG79R_eLHAfprZKA_f27SCKdQYbknsDG3Rz3Nf-OZOaNU1KHeqxXim8Slj2wrJU9BsN339hZ3eKw6E1WnPZ9tUCErGWMVdTxmQmnQ8Ut83RM9PNJHMdQPZZJ3wG9goluCidCw6g7zXUBcQkHlk)

처음에는 위와 같이 나옵니다.

그러다가 마우스를 스크롤 다운하면 아래와 같이 나오는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgtKgEE2oNRTaL4oNl_zS65t9PV-XBoz_dSbWuDBoFw3PO8ezAbMxpo-BpFy-5hEbsufJMRowlyQ4sTQ1pqPrvOFielrDoJhzt-R73BaR74oQ-1dq87xeQiT9QQbKcsULojqDi5exnFgOU7up-Wn5V_a4lJOMdteZaI8FCyvLW4wsmFd0zJNexWVxF93kQ)

어떤가요?

client:visible에 대한 아일랜드 아키텍처 구현이 완성되었네요.

---

## 6. client:idle 구현하기

이제 client:idle 항목에 대해 아일랜드 아키텍처를 구현해 보겠습니다.

Conditions 클래스에 waitForIdle 함수를 좀 더 구체적으로 수정하면 되는데요.

idle 항목은 브라우저에서 모든 항목이 다운로드가 되었을 상황에 해당합니다.

즉, 모든 게 브라우저에 로드되었을 때만 아일랜드 아키텍처가 작동하라는 뜻입니다.

idle 상태를 따지는 로직은 바로 window.requestIdleCallback 메서드를 사용할 건데요.

window.requestIdleCallback() 메서드는 브라우저가 유휴 상태일 때 호출될 함수를 대기열에 추가합니다.

즉, requestIdleCallback 함수에 Promise를 resolve 되는 명령어를 입력해 놓으면 브라우저가 idle이 되면 알아서 Promise가 resolve가 되겠죠.

그리고 만약, requestIdleCallback 함수가 지원되지 않으면 load 이벤트를 이용하면 됩니다.

load 이벤트를 이용하는 방법은 바로 document.readyState 항목을 이용하는 건데요.

이게 complete가 아니면 load 이벤트리스너를 추가해서 끝날때까지 기다리는거죠.

```js
static waitForIdle() {
    const onLoad = new Promise((resolve) => {
      if (document.readyState !== "complete") {

        window.addEventListener(
          "load",
          () => {
            resolve();
          },
          { once: true }
        );
      } else {
        resolve();
      }
    });

    const onIdle = new Promise((resolve) => {
      if ("requestIdleCallback" in window) {
        requestIdleCallback(() => {

          resolve();
        });
      } else {
        resolve();
      }
    });

    return Promise.all([onIdle, onLoad]);
  }

```
우리는 onIdle, onLoad 함수를 둘 다 만들었고 두개가 모드 Promise resolve가 되야지 waitForIdle 함수가 실행되는 겁니다.

이제, waitForIdle 함수도 완성되었네요.

client:idle 같은 경우의 아일랜드 아키텍처를 테스트해보려면 img 태그에 용량이 큰 이미지를 걸어 놓으면 됩니다.

만약 30메가가 넘는 큰 그림이면 전부 로드되는데 상당한 시간이 걸릴 건데요.

이럴 때 client:idle을 쓰면 30메가 그림이 다 로드되면 실행되는 웹 컴포넌트가 될 겁니다.

```html
<body>
    <h1>Initial island demo</h1>
    <img
      src="https://raw.githubusercontent.com/ohansemmanuel/larder/main/large_image.jpeg"
      alt="34MB large satellite image from Effigis."
    />

    <my-island client:idle>
      <p>Hello island</p>

      <template data-island>
        <script>console.log("hello from start of my-island")</script>
        <script type="module">
          <script>console.log("hello from template of my-island")</script>
        </script>
      </template>
    </my-island>
  </body>
```

위 코드처럼 34메가 바이트 그림을 github에서 다운로드 해야하는데요.

완료되면 idle 상태가 되기 때문에 waitForIdle 스태틱 함수가 실행될 겁니다.

---

## 7. client:media 구현하기

이번에는 media 라고해서 CSS에서 match query 관련 로직입니다.

화면 크기에 따라 실현되는 아일랜드 아키텍처인거죠.

모바일 화면일 경우 실행하게끔 client:media에 아래와 같이 옵션을 주면 됩니다.

```js
<my-island client:media="(max-width: 400px)">
</my-island>
```

400px가 맥스 폭일 경우 waitForMedia 함수가 실행되는 거죠.

자체적으로 window.matchMedia() 함수를 이용할 겁니다.

```js
static waitForMedia(query) {
  let queryList = {
    matches: true,
  };

  if (query && "matchMedia" in window) {
    queryList = window.matchMedia(query);
    console.log(queryList);
  }
  if (queryList.matches) {
    return;
  }

  return new Promise((resolve) => {
    queryList.addListener((e) => {
      if (e.matches) {
        resolve();
      }
    });
  });
}
```

실제 콘솔 로그창을 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEjD_fmZT_R5tV3BYu0ThxVkF7SttGJFJDOO8gSv3xZU3M8x8NnqA_OhqhO-Obf4HZ1pHqgbzAlxfaazV0VyetCkJ_WyMnly5O3KORAq-3lRfs-wPXEfziYmnrRfkIfrBsYUvESVd53UtOGpCcQwzbdq2n9b5hWSNVQF5_Rq6RP3x1Xxvup0vLPALab0RqI)

위 그림과 같이 condition은 media이고 media의 value 값은 'max-width : 400px'이네요.

그리고 MediaQueryList의 값에서 matches 값이 false네요.

즉 화면이 400px 보다는 크다는 얘기죠.

화면을 줄여볼까요?

queryList.addListener 를 추가해서 화면이 바뀌면 자동으로 Promise가 resolve 될겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhKOzU13fHW4D1Y6i_NssodPcp_Pr9_GjKwhEF7W8fs_ePqS7BfRm3Cn8IkeL0GcpzGMcbxBSm62A6CjNF1yRkEgu-EAjvmwjIbq4_oVIZOwlIxwywy9bw6IXyuQe8w2d0HyOOwHy5LDuggKHRyXTvlldpBFa4yZEzcPwyWBTIjx_A9Pc7A4RDQ9vUTiUU)

위 그림과 같이 화면을 줄이면 matches 값이 true가 되고 template 안의 script 콘솔 로그가 작동하게 됩니다.

즉, hydrate가 된거죠.

---

지금까지 아이랜드 아키텍처를 3가지 경우를 상정해서 구현해 봤는데요.

이런 식으로 아일랜드 아키텍처를 완벽하게 구현해 놓은 게 바로 Astrojs의 아일랜드 아키텍처입니다.

Astrojs에서 제공하는 아일랜드 아키텍처는 client:load, client:idle, client:visible, client:media, client:only가 있습니다.

자세한 내용은 공식 문서를 읽어보시면 됩니다.

그럼.


