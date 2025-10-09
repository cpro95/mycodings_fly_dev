---
slug: 2023-08-22-sveltekit-making-loading-spinner-like-youtube-loading-indicator
title: SvelteJS로 Youtube(유튜브) 같은 로딩 스피너 만들기
date: 2023-08-22 11:08:17.589000+00:00
summary: 로딩 스피너(Loading Spinner), 로딩 인디케이터(Loading Indicator) 만들기
tags: ["sveltekit", "sveltejs", "loading spinner", "loading indicator"]
contributors: []
draft: false
---

안녕하세요?

오늘날 진보된 웹사이트에는 모두 다 있는 로딩 스피너(Loading Spinner)에 대해 구현해 보겠습니다.

개발자들이 실제 착각하는 게 개발 서버를 돌릴 때는 굉장히 빠른 라우팅 속도를 보여줘서, 굳이 로딩 스피너의 필요성을 못 느끼는데요.

오늘 제가 예전에 만들었던 SvelteKit 테스트 페이지를 핸드폰으로 들어가 보고 깜짝 놀랐습니다.

링크를 클릭했는데 인터넷이 느린지 내가 클릭했는지, 작동되고 있는지 알 수가 없었습니다.

그래서 로딩 스피너의 필요성에 대해 통감했는데요.

오늘은 Svelte로 구현해 보겠습니다.

앱은 예전에 만들었던 SvelteKit을 계속 이용할 생각입니다.

먼저, 오늘 우리가 구현할 유튜브 같은 로딩 스피너를 한 번 살펴볼까요?

제 컴퓨터에서 VLC로 녹화해서 GIF로 만든 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiECh6Rvp8nJ5sZT6I_uCEVCYflIjxtMCjEwFTLsHFT2K4preFIYidtMx8DwyDQTHH804ENAZQRSzp4-tf6NZf6ZhPuIYGTzPlPkV3-LOA0Pf8mauEQ2G6EBQwi-nDeRM2HBDNoBInYFj86aJcuua2prUDf8smFKV3cWKMg6-ZwRKMWHnIfZB_TvU7oKQ8)

위와 같이 화면 맨 위에 파란색 바가 길어지는 게 보일 겁니다.

네트워크를 "느린3G"로 바꾸면 확연히 보일 겁니다.

오늘은 이걸 구현해 볼까 합니다.

---

## SvelteKit에서 제공하는 $app/stores의 navigating 스토어

SvelteKit의 여러 가지 아주 유용한 툴을 직접 제공해 주는데요.

우리가 사용할 툴은 $app/stores에서 제공해 주는 navigating 스토어입니다.

스토어라면 Svelte에서는 상태관리 관련인데요.

앱 전체적으로 상태를 관리할 수 있는 writable 스토어가 대표적입니다.

navigating 스토어는 언제 구현되냐면 우리가 링크를 클릭해서 라우팅이 바뀔 때 이 스토어의 값이 변합니다.

그리고, 라우팅이 종료되면 navigating 값은 null이 됩니다.

---

## $app/navigating의 afterNavigate 콜백 함수

SvelteKit이 제공해 주는 두 번째 유틸은 $app/navigating의 afterNavigate 콜백함수인데요.

라우팅이 끝나면 이 콜백 함수를 실행해 줍니다.

그래서 뒷정리 같은 작업을 여기서 하면 됩니다.

당연히 beforeNavigate 콜백함수도 제공해 줍니다.

---

## 레이아웃 페이지에 HTML 코드 넣기

일단 우리가 만들 로딩 스피너를 모든 페이지에서 작동되게 하려면 레이아웃(layout) 페이지에 넣어야 합니다.

routes 폴더에 있는 +layout.svelte 파일을 열고 아래와 같이 바꿔 줍니다.

```js
<script>
  import "../app.postcss";
  import { enhance } from "$app/forms";

  <!-- 추가된 부분 -->
  import { navigating, page } from "$app/stores";
  import PageLoader from "$lib/PageLoader.svelte";
  import { fade } from "svelte/transition";
</script>

<!-- 추가된 부분 -->
{#if $navigating}
  <div out:fade={{ delay: 500 }}>
    <PageLoader />
  </div>
{/if}

<div class="p-4">
  <header class="mb-4">
    <nav class="flex space-x-4">
      <a href="/">Home</a>
      {#if !$page.data.user}
        <a href="/register">Register</a>
        <a href="/login">Log In</a>
      {:else}
        <form action="/logout" method="post" use:enhance>
          <button type="submit">Log out</button>
        </form>
      {/if}
    </nav>
  </header>

  <slot />
</div>
```

위 코드를 보시면 일단 추가된 부분이 관련 모듈 불러오는 import 문과, 그다음에 if 문이 있는데요.

if $navigating 일 때 즉, 라우팅이 전환될 때, PageLoader 컴포넌트를 보여주라는 얘기입니다.

그리고 SvelteJS에서 기본적으로 제공해 주는 transition 애니메이션인 fade를 적용해서 좀 더 멋지게 만들었습니다.

이제 PageLoader.svelte 파일만 만들면 되는데요.

lib 폴더에 PageLoader.svelte 파일을 만들도록 하겠습니다.

```js
<script>
  import { onMount } from "svelte";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import { afterNavigate } from "$app/navigation";

  const progress = tweened(0, {
    duration: 3500,
    easing: cubicOut,
  });

  onMount(() => {
    progress.set(0.7);
  });

  afterNavigate(() => progress.set(1, { duration: 1000 }));

</script>

<div class="fixed inset-0 h-2">
  <div
    class="progress bg-blue-500 h-full"
    style={`--width: ${$progress * 100}%`}
  />
</div>

<style>
  .progress {
    width: var(--width);
  }
</style>
```

일단 TailwindCSS를 사용하기 때문에 CSS 스타일은 TailwindCSS의 클래스를 이용해서 작성했습니다.

첫 번째 div는 fixed 형태로 inset-0을 적용해서 top, right, left, bottom 모두 0이 되어 위치가 브라우저 최상단 왼쪽이 됩니다.

그리고 h-2 를 줘서 height를 조금 주었는데요.

저는 테스트를 위해 잘 보이게 하려고 h-2를 줬는데요.

h-1만 줘도 충분합니다.

그리고 두 번째 div가 실제 보여주는 인디케이터인데요.

배경은 파란색으로 했고, h-full을 줬습니다.

두 번째 height도 꼭 줘야 화면에 보이니까요.

그리고 style은 CSS의 var를 이용했습니다.

왜냐하면 width를 계산해야 하기 때문이죠.

그리고 자바스크립트 코드를 보면 SvelteJS에서 애니메이션 관련 제공하는 툴인 tweened를 사용했습니다.

tweened는 애니메이션을 생성하는 코드인데요.

progress 라는 애니메이션을 만들었습니다.

그리고, onMount를 이용해서 progress 값을 0.7로 정했는데요.

그러면 CSS에 의해 70%가 보입니다.

첫 시작을 70%로 해서 첫 시작을 아주 빠르게 보여주는 겁니다.

tweened에 있는 duration인 3.5초동안 파란색 막대기가 70%가 보인다는 얘기죠.

그리고 afterNavigate 콜백 함수는 라우팅이 종료되면 실행되니까, progress 를 1로 세팅해서 CSS에서 100%로 적용하게끔 했습니다.

또, 애니메이션의 시작을 onMount에서 적용했는데요.

라우팅이 바뀌면서 컴포넌트가 마운트 될 때 애니메이션이 시작하라고 한 겁니다.

onMount 대신 beforeNavigate 콜백 함수를 적용할 수도 있습니다.

```js
  const progress = tweened(0, {
    duration: 3500,
    easing: cubicOut,
  });

  beforeNavigate(() => progress.set(0.7));
  // onMount(() => {
  // progress.set(0.7);
  // });

  afterNavigate(() => progress.set(1, { duration: 1000 }));
```

테스트해 봐도 동일하다고 느낄 건데요.

beforeNavigate를 사용한 방법과 onMount를 사용한 방식에 미묘한 차이가 있는데요.

onMount 방식이 좀 더 상황에 맞는 거 같습니다.

뭐가 더 좋을지는 직접 테스트해 보고 상황에 맞게 고르시면 됩니다.

---

지금까지 SvelteJS로 로딩 스피너를 구현했는데요.

앞으로는 모든 웹에 무조건 넣어야 할 정도로 아주 좋은 컴포넌트가 됐네요.

그럼, 많은 도움이 되셨으면 합니다.



