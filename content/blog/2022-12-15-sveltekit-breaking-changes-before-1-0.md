---
slug: 2022-12-15-sveltekit-breaking-changes-before-1-0
title: SvelteKit 1.0 pre-alpha 버전에서 바뀐 점 살펴보기
date: 2022-12-15 11:57:42.497000+00:00
summary: 2022년 8월 기준 SvelteKit 1.0 pre-alpha 버전에서 바뀐 점 살펴보기
tags: ["javascript", "sveltekit", "sveltejs", "svelte", "changes"]
contributors: []
draft: false
---

안녕하세요?

오늘은 예전부터 계속 주시했었던 SvelteKit에 대해 얘기해보려고 하는데요.

SvelteKit이 드디어 2022년 12월 15일 1.0 버전이 정식 출시되었습니다.

실제 production 모드에서 사용할 수 있는 좋은 수준으로 나온 거 같은데요.

오늘은 SvelteKit에 대해 심도 있게 알아보기 전에 예전에 배웠던 분들을 위해 2022년 8월 16일 이후에 SvelteKit이 어떻게 변했는지 알아보겠습니다.


<hr />
## 라우팅 문법(Routing syntax)

기존 SvelteKit 버전에서는 Next.js 12 이하나 Remix Framework처럼 파일이든 폴더든 /src/routes 폴더 밑에 있으면 라우팅이 됐었는데요.

이제는 폴더 방식만 가능합니다.

그럼 폴더 방식이란 뭘까요?

그러니까 폴더 이름이 라우팅 주소가 되고 그 안에는 index.svelte 파일이 아니라 +page.svelte 파일이 해당 라우팅을 위한 파일이 됩니다.

```js
-- 폴더 방식 라우팅

📂 src
┗ 📂 routes
  ┣ 📜 +page.svelte
  ┣ 📂 about
  ┃ ┗ 📜 +page.svelte
  ┗ 📂 blog
    ┣ 📜 +page.svelte
    ┗ 📂 post-title
      ┗ 📜 +page.md
```

.md 파일 확장자는 extension을 설치하면 가능합니다.

뭔가 플러스(+) 글자를 page.svelte에 붙인다는 게 이상해 보입니다.

그런데 플러스(+) 글자를 추가하면서 (+) 글자가 없는 파일은 라우팅으로 계산 안되게 끔 하는 깔끔하고 간단한 방법도 제공해주니까 한편으론 좀 더 이해하기가 쉬워졌다고 할까요?

그래서 실제 SvelteKit에서는 개인적인 파일 이름에 (+) 글자를 붙일 수 없습니다.

즉, SvelteKit만 사용하게끔 (+) 글자가 예약되었다는 뜻입니다.


<hr />
## 다이내믹 라우팅

다이내믹 라우팅은 기존과 같이 스퀘어 브래킷'[]'을 씁니다. 
```js
📂 src
┗ 📂 routes
  ┗ 📂 blog
    ┣ 📜 (a bunch of markdown files here)
    ┗ 📂 [slug]
      ┗ +page.svelte
```

위 코드와 같이 '[slug]'와 같이 다이내믹 라우팅을 지정하면 SvelteKit은 '[slug]'폴더의 +page.svelte 파일의 load 함수를 찾습니다.

여기 load 함수에서 해당 다이내믹 처리를 해줘야 합니다.

<hr />
## Layouts

기존 버전에서는 레이아웃 파일에는 언더스코프 두개(__)를 썼었는데요.

새로운 버전에서는 그냥 +layout.svelte라고 씁니다.

```js
-- 레이아웃 새로운 규칙

📂 src
┗ 📂 routes
  ┗ 📜 +layout.svelte
```

참고로 __error.svelte도 +error.svelte로 바뀌었습니다.

<hr />
## 라우팅 폴더에 숨긴 파일은?

기존 버전에서는 "src/routes" 폴더 밑에 언더스코프(_) 한 개를 파일 이름 앞에 붙이면 그 파일은 라우팅 예외가 됐었는데요.

이제부터는 (+) 글자 규칙을 따르기 때문에 (+) 글자가 없는 파일은 자동으로 라우팅에 제외됩니다.

<hr />
## load 함수

예전 버전에서 load 함수를 사용하려면 script 태그를 따로 또 만들어야 했는데요.

```js
<!-- Old load function -->
<script context="module">
export const load = () => {
  // Do stuff here
  return {
    props: {
      // The stuff to return
    }
  }
}
</script>

<script>
// Normal Svelte component stuff here
</script>
```

새로운 버전에서는 위와 같이 쓸 필요가 없어졌습니다.

+page.js 파일이나, +page.server.js 파일 안에 그냥 선언하여 사용하시면 됩니다.

'export' 하는 걸 잊지 마시고요.

참고로 load 함수는 서버 사이드 함수라서 +page.svelte 가 아닌 +page.js 파일 안에서 써야 합니다.

```js
📂 src
┗ 📂 routes
  ┣ 📜 +page.svelte
  ┗ 📜 +page.js 
       (or +page.server.js)
```

SvelteKit은 페이지를 렌더링 하기 전에 +page.js(또는 +page.server.js) 파일 안에 있는 load 함수를 먼저 호출합니다.

Remix Framework의 loader 함수와 그 사용법이 같다고 볼 수 있습니다.

참고로 load 함수의 조건입니다.

1. load 함수는 export 되어야 한다.

2. load 함수는 url, params 파라미터를 가진다.

3. load 함수는 무조건 객체(빈 객체도 가능)를 리턴해야 한다. +page.svelte 파일에 prop으로 리턴됩니다.

참고로 load 함수를 모든 svelte 파일에 적용하려면 간단하게 /src/routes/+layout.svelte인 루트 레이아웃 파일에 작성하면 됩니다.

<hr />
## +page.js 와 +page.server.js 차이점

+page.js 파일은 서버 사이드와 클라이언트 사이드 모두에서 작동되며,

+page.server.js 파일은 서버 사이드에서만 작동됩니다.

여기서 특히나 두 파일의 중요한 차이점을 보려면 load 함수를 예로 들어보면 쉽게 이해할 수 있습니다.

먼저, +page.js 파일에서 fetch 함수를 쓴다고 가정했을 때는 아래와 같이 하면 됩니다.

```js
// +page.js only
import { json } from '@sveltejs/kit'

export const load = ({ fetch }) => {
  const myData = fetch('/relative/path/here')
  return json(myData)
}
```

실제 브라우저와 Node의 fetch는 약간 다른데요.

그래서 +page.js 파일에서는 fetch를 파라미터로 넣으면 SvelteKit이 알아서 Node 버전과 브라우저 버전의 fetch 차이를 해석하여 작동하게 되기 때문에 사용자 입장에서는 크게 걱정할 게 없습니다.

그럼 +page.server.js 파일에서 fetch는 어떻게 할까요?

+page.server.js 파일은 서버 사이드에서만 작동하기 때문에 load 함수에 파라미터로 fetch를 넣어주면 에러가 생깁니다.

그냥 아래와 같이 url을 같은 파라미터만 넘겨주고 그냥 fetch를 쓰시면 됩니다.

여기서는 Node 버전의 fetch 함수인 거죠.

```js
// +page.server only
import { json } from '@sveltejs/kit'

export const load = ({ url }) => {
  const myData = fetch(`${url.origin}/my/api/path`)
  return json(myData)
}
```

<hr />
## 서버 라우트(API 엔드포인트)

예전 방식의 API 엔드포인트는 아래와 같이 사용하셨겠지만,

```js
-- 예전 endpoint structure:

📂 src
┗ 📂 routes
  ┗ 📂 api
    ┗ 📜 posts.json.js
```

새로운 버전에서는 다음과 같이 변경되었습니다.

```js
-- 새로운 endpoint structure:

📂 src
┗ 📂 routes
  ┗ 📂 api
    ┗ 📂 posts
      ┗ 📜 +server.js
```

위와 같이 +server.js 파일이라는 (+) 글자를 이용한 방식이며 아예 server라는 이름으로 서버 사이드만 작동된다는 파일이라고 지정했습니다.

그리고 +server.js 파일을 가지고 있는 폴더 이름을 posts에서 posts.json처럼 사용할 수 있으니 참고 바랍니다.

그리고 예전의 API 엔드포인트는 리턴되는 객체의 세팅 부분을 꼭 맞게 지정해 줘야 했는데요.

아래처럼 status와 body 부분을 지정해줘야 합니다.
```js
// 이전 방식
export const get = () => {
  const message = 'Hello!'

  return {
    status: 200,
    body: {
      message
    }
  }
}
```

이제는 json 이라는 헬퍼 유틸리티도 제공하고, API 엔드포인트가 꼭 Response 객체를 리턴하게끔 바뀌었습니다.

```js
// 새로운 방식
import { json } from '@sveltejs/kit'

export const GET = () => {
  const message = 'Hello!'
  return json(message)
}
```

그리고 함수 이름도, GET, POST, DELETE, PUT처럼 써야 합니다.

새로 바뀐 SvelteKit의 Respose 객체 리턴 방식이 json 헬퍼 함수를 사용하기 때문에 더 이상 status나 body를 사용하여 객체를 꾸며주지 않아도 되는데요.

만약 에러가 발생한다면 어떻게 할까요?

아래처럼 error 함수를 이용하면 됩니다.

```js
// 예전 방식
return {
  status: 400,
  body: new Error('not found')
}

// 새로운 방식
import { error } from '@sveltejs/kit'

try {
  //return something here
}
catch({ message }) {
  throw error(400, message)
}
```

이상으로 SvelteKit의 메이저 변화에 대해 알아보았는데요.

다음 시간에는 SvelteKit 1.0 버전 출시를 기념해서 블로그 시스템을 만들어 보도록 하겠습니다.

그럼.

