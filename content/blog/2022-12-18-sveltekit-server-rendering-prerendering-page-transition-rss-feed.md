---
slug: 2022-12-18-sveltekit-server-rendering-prerendering-page-transition-rss-feed
title: SvelteKit Tutorial 2 - 서버 렌더, 정적 사이트로 빌드하기, 페이지 트랜지션, rss feed 만들기
date: 2022-12-18 03:05:30.249000+00:00
summary: SvelteKit Tutorial 2 - 서버 렌더, 정적 사이트로 빌드하기, 페이지 트랜지션, rss feed 만들기
tags: ["sveltekit", "svelte", "sveltejs", "server rendering", "prerender", "static site generate", "page transition", "rss feed", "tutorial"]
contributors: []
draft: false
---

![](https://blogger.googleusercontent.com/img/a/AVvXsEiFWcFVsGwat7XfOA1YQqeUuF456KrDuFPWw7RhWgEYs3Cr_B3_545ADoB47aOfYqBjKCnQz7hx_x7AJ3aN8MZY5zI5o_JCrRV6NknAm_Lf5Y8qtt6j6RGLWNxHgctwn2s1Tqf85ixLGOvWvpciIdzkHq8ZSGAf_oQnjhunWUywAbV3aAZjt6Iz9oW-=s16000)

안녕하세요?

SvelteKit 강좌 두 번째 시간입니다.

이번 시간에는 지난 시간에 만들었던 블로그 시스템을 좀 더 확장해 보겠습니다.

## 서버 라우팅(server routes)

Next.js 에 있는 /pages/api/hello.js 와 비슷한 기능인데요.

Next.js 도 그렇고 SvelteKit 도 풀 스택 프레임 워크를 지향하고 있어, 백 엔드 쪽 코드도 작성할 수 있습니다.

보통 API 엔드 포인트(API endpoints)라고 하는데요.

백 엔드 API 기능을 직접 작성할 수 있습니다.

SvelteKit 에서 API 엔드 포인트를 작성하려면 다음 세 가지가 전제되어야 합니다.

1. server route 파일 이름은 +server.js

2. +server.js 파일은 무조건 한 개의 HTTP verb(GET, POST,...)에 해당하는 함수를 export 해야함

3. server route는 무조건 Response를 리턴 해야함.

그럼 실제로 한번 만들어 볼까요?

보통 /src/routes 폴더 밑에 api 폴더를 만들고 그 밑에 서버사이드 코드를 작성 하는게 좋습니다.

```js
📂 src
┗ 📂 routes
  ┗ 📂 api
    ┗ 📂 posts
      ┗ 📜 +server.ts (또는 +server.js)
```

파일 내용입니다.

```js
// +server.js
export const GET = () => {
  return new Response('Welcome to my API')
}
```

실행 결과를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEiiIW9Bjbqn1VoYtOXsZz7MMDRihIH91Y6ZOBTys7da1dcGEhY1BZjFJiDDMiS-vvpkogjihDuZVHwpRHYNvWS8BPgQlY74JtEmvnTi4HqqkHMdG-2srjsOwkrjFu6oQbjLUrBssRJQBD00Qcod-GvIY4aJ9vfKU4XTR343asK1WguAcphLM8YSj_CO=s16000)

어떤가요?

위와 같이 개발서버에서 위 주소로 이동한 결과 우리가 원하는 데이터가 나왔습니다.

그럼 본격적인 API 엔드 포인트를 작성해 볼까요?

우리가 만들려고 하는 API 기능은 가장 쉽게 생각할 수 있는 게 바로 모든 post 데이터를 배열로 리턴 하는 걸 겁니다.

그러면 /src/routes/api/posts/+server.js 파일을 만들어 보겠습니다.

```js
// src/routes/api/posts/+server.ts

import { fetchMarkdownPosts } from '$lib/utils'
import { json } from '@sveltejs/kit'

export const GET = async () => {
  const allPosts = await fetchMarkdownPosts()

  const sortedPosts = allPosts.sort((a, b) => {
    return new Date(b.meta.date) - new Date(a.meta.date)
  })

  return json(sortedPosts)
}
```

위 코드를 보시면 유틸리티 함수인 fetchMarkdownPosts 라는 함수가 보이네요.

이것도 만들어 볼까요?

유틸리티 함수는 /src/routes/lib/utils/index.js 파일에 넣어둡시다.

```js
📂 src
┗ 📂 lib
  ┗ 📂 utils
    ┗ 📜 index.js
```

```js
export const fetchMarkdownPosts = async () => {
  const allPostFiles = import.meta.glob('/src/routes/blog/*.md')
  const iterablePostFiles = Object.entries(allPostFiles)

  const allPosts = await Promise.all(
    iterablePostFiles.map(async ([path, resolver]) => {
      const { metadata } = await resolver()
      const postPath = path.slice(11, -3)

      return {
        meta: metadata,
        path: postPath,
      }
    }),
  )

  return allPosts
}
```

fetchMarkdownPosts 함수는 Vite 번들러의 import 함수를 이용했는데요.

import.meta.glob 함수를 이용하면 해당 폴더의 모든 마크다운 파일을 가져올 수 있습니다.

그리고 그걸 잘 요리해서 리턴해 주고요.

자 이제, 브라우저에서 실행 결과를 볼까요?

주소는 당연히 /127.0.0.1:5173/api/posts 가 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjuDH0tHEVTVwMlF7M0-k6p9qe_jwQ6Tt9iavt9HsH6WaTUshuFA6qgV6uNXSh3McXB2M59APeoV5OJem9_NyM88jz5NHHxCFB2f6ppplI0g414rKWMsXLIs_ML42ISImW6jRnW44dIpuz5VpyUxcmo0MwCM3S4KUUg4KRAwJ_iKZJi8xLsg04ZVG8d=s16000)

위 그림과 같이 우리가 만든 API 엔드포인트가 잘 작동되고 있네요.

---

## blog 인덱스 페이지 꾸미기

지난 시간에 /src/routes/blog 폴더에 있는 +page.svelte 파일을 아무 의미 없이 나뒀었는데요.

이제 이 페이지에 블로그 포스트 리스트를 보여주는 코드를 작성해 보겠습니다.

위에서 만든 /api/posts 엔드 포인트를 이용해서요.

우리가 위에서 만든 /api/posts 라는 API 엔드포인트는 서버사이드로 작성할 수 도 있고 클라이언트 사이드에서도 작성할 수 있습니다.

Svelte의 onMount 함수를 이용해서 단순히 fetch 하고 브라우저에 뿌려주면 되거든요.

클라이언트 사이드 쪽에서 렌더링 하려면 꼭 유념해야 할게, 페이지가 처음 보일 때 onMount 함수에서 데이터를 로딩하는 그 잠깐의 시간동안 브라우저가 빈 먹통이 된다는 뜻입니다.

그래서 그 잠깐의 사이에 loading... 이라는 문구를 표시하던가 해야 하는데요.

사실 서버 이드쪽에서 작업하면 이런 문제가 없어집니다.

SvelteKit 은 기본적으로 모든 컴포넌트가 서버 사이드이고, 브라우저가 요청하기 전에 미리 페이지를 만드는 게 더 빠르기 때문입니다.

그럼 서버 사이드쪽에서 데이터를 fetch 하기 위해서 +page.js 파일을 만들어 보겠습니다.

이 파일의 위치는 당연히 /src/routes/blog/+page.js 입니다.

즉, /src/routes/blog/+page.svelte 파일이 로드되기 전에 먼저 +page.js 파일의 load 함수가 미리 실행되는 로직입니다.

참고로 +page.js 파일은 클라이언트 쪽, 서버 사이드 쪽 모두에서 작동되는데요.

꼭 서버 사이드 쪽에서 작동 시킬려고 하려면 +page.server.js 라고 이름 지으면 됩니다.

사실 이 모든 게 Remix Framework에서 시작되었고, Next.js 13 버전에서도 차용한 규칙입니다.

```js
// src/routes/blog/+page.js
export const load = async ({ fetch }) => {
  const response = await fetch(`/api/posts`)
  const posts = await response.json()

  return {
    posts,
  }
}
```

+page.js 파일의 load 함수에서 fetch 함수를 이용해서 우리가 위에서 만든 /api/posts 라는 API 엔드 포인트를 이용했습니다.

그리고 그걸 json 형식으로 리턴 했는데요.

이렇게 +page.js 파일에서 pre-render 형식으로 리턴되는 객체는 +page.svelte 에서 data 라는 prop으로 접근할 수 있습니다.

prop의 이름이 data이니 꼭 기억해두시길 바랍니다.

이제 +page.svelte 파일을 고쳐볼까요?

```js
<!-- src/routes/blog/+page.svelte -->
<script>
export let data
</script>

<h1>Blog</h1>

<ul>
  {#each data.posts as post}
    <li>
      <h2>
        <a href={post.path}>
          {post.meta.title}
        </a>
      </h2>
      Published {post.meta.date}
    </li>
  {/each}
</ul>
```
+page.svelte 파일에서는 +page.js 파일에서 리턴한 객체를 data라는 이름으로 접근하고 있고,

이 data라는 값을 이용해서 화면에 뿌려주고 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhoufvcM49gfOhFnixsfO9-qHfqjsu_4pqYtLOoIO81iqwDB7xX3Vs6qDngSfOCyHepYlr-qrZLvToXbX6VtNPwtQUPj8xmvSrgWcjUzjn_9DwDFBZmXB3Hfcb8jtK7XqlBVA5xH2JhN_cvU3P4MxDrW-gly8NjD9vZm47qJKiICYDlIYXFCngNN8_g=s16000)

위와 같이 /blog 경로로 들어갔을 때 우리가 원했던 결과가 아주 잘 나오고 있습니다.

이제 블로그 시스템의 80% 이상이 완성되었습니다.

---
## 정적 사이트로 만들기

Next.js의 가장 강력한 강점이 바로 정적 사이트로 만드는 건데요.

SvelteKit 도 그 기능이 있습니다.

정적 사이트로 만들려면 아래와 같이 Svelte 어댑터를 설치해야 하는데요.

```bash
npm i -D @sveltejs/adapter-static@next
```

그리고 svelte.config.js 파일에서 아래와 같이 수정해주면 됩니다.

```js
// import adapter from "@sveltejs/adapter-auto";
import adapter from "@sveltejs/adapter-static";
```

위와 같이 바꿔주면 해결됩니다.

이제 설정은 끝났으니까 정적 사이트로 만들려는 파일을 골라줘야 하는데요.

특정 라우팅만 정적 사이트로 만들 수 있는데요.

특정 라우팅의 +page.js 파일 같은 곳에 다음과 같이 prerender 값을 true로 지정하면 됩니다.

```js
export const prerender = true;
```

만약 전체 사이트를 정적 사이트로 만들려고 한다면 일일이 모든 라우팅에 넣어야 하는데요.

상당히 귀찮습니다.

이럴 때 사용할 수 있는 파일이 /src/routes/+layout.svelte 파일인데요.

그런데 prerender 값은 +layout.svelte 파일에는 넣을 수 없으니까 +layout.js 파일을 만들면 됩니다.

그러면 +layout.svelte 파일이 로드되기 전에 미리 +layout.js 파일이 로드되기 때문이죠

```js
// src/routes/+layout.ts
export const prerender = true;
```

이제 모든 단계가 끝났는데요.

전체 사이트를 정적 사이트로 빌드해 보겠습니다.

```js
npm run build
```
![](https://blogger.googleusercontent.com/img/a/AVvXsEgK3Nj1FNTCZI9rSwfDEABhUcXkPmTK8GxYhH5iIIo1c5jrE0afVPlvDgoeX_J1OzimmbfKzAwxQ8hwwLhrF9al4QpmxfFMGrSYhAMxoL-F8B5pXcXrUUBYIWSKQgQAiVpyssyCLPl8DT9a6ySylrXvxiprjCgwIRhM7RD2LHy0Rr5NMMOFmcfOSxC3=s16000)

위와 같이 build가 에러 없이 끝났으면 build 폴더로 들어가 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEisUEVmYvYbKurJ1sA1tHfrRmb_THk1TtUoWj7ABLJTPTDbP3gmsufnuQRUXVGgOdAZ4wKp6PFGERmgl8ExOQ2f8Edgwv_heCcr67Aug9o6vGX5E_J6qy1XTqw6n2ZYyi-ZiXBa3gylvmBc_23aWorz-LQGBQLibWsPLmo221UCqbN2rN0aKE2ZxxZ6=s16000)

위와 같이 index.html 파일도 있고 blog.html 파일도 있고, about.html 파일도 있고, contact.html 파일도 있습니다.

우리가 만든 라우팅이 모두 html 파일로 존재하는 정적 사이트가 됐는데요.

실제 얼마의 크기인지 한번 tree 명령어를 돌려보겠습니다.

```js
tree --du -h
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEhplIGShSPmX4nckgKdr37ylYZ1TwpVn6W7M9GHI6PJDU0fokYaEW6mKab0X1ybaEFLMSMY1LI1iB1QYzUg07tpr9DDgl2QDRJBpux9SgQwvHH5xqEQY54hCAK-rM4SMd_w42TWxlWZVjIfc_axJJm0aGJSdWu9-Y4WScPLIJOzOkgUOhVmk2obBdvu=s16000)

위 그림과 같이 전체 사이트가 17 폴더에 42개의 파일 그리고 전체 크기는 79K입니다.

대단한데요. 1메가도 안됩니다.

이제 한번 이 폴더를 serve 로 돌려볼까요?

```js
serve .
```

blog 주소로 이동하고 사이트의 소스파일을 열어볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEjBOtT2vj845Dh525YBJdLkeCyONVo7q_w-j3T64EwOVm-4v03LSGGkpx7u4Q2MQWWNhkdcgtmcXW3YK8s5Wfn2N8p0erAYzsd386PlQgAjH8g7nT2YYP3k6DC1kpClRDItH36IyIA840V8mAbBX1GITxdPixdePs_d0I-ym00P0Pd9YXbUfvftHul1=s16000)

위와 같이 순수하게 HTML 파일입니다.

3번 블로그로 이동해서 다시 소스파일을 열어볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEjaiqBw6pE1P0csojIt-4nn_SFFnmpv7uX3TLN3MJF28uS-E0UWkfsKDxJTMWOYS9-p_t6Gh3SkW57A8-Kulsovrnx8A8-jiyvStgNCrV-Okb8Qgz57j7jpH_bsYTfcyb3oDix_IAszZy40pmpo0UksI4vrtho6-BkjdK9BfGxGr_BRSIMNkFUhD3F9=s16000)

역시나 그냥 HTML 파일입니다.

정적 사이트로 전환이 완성되었네요.

사이트를 정적 사이트로 만드는 건 github.io에 그냥 올려도 사이트가 작동된다는 뜻입니다.

만약 사이트 전체가 정적 사이트로 변환이 안 된다면 Vercel, Netlify, Cloudflare 같은 호스팅 업체를 이용하면 됩니다.

위 호스팅 업체는 SvelteKit 을 자동으로 서버 사이드 쪽에서 호스트 해줄 수 있으니 참고 바랍니다.

---
## 카테고리 만들기

이번에는 블로그 시스템을 좀 더 발전시켜 보겠습니다.

블로그 글을 쓰면 카테고리를 지정할 수 있는데요.

우리가 만든 1.md, 2.md, 3.md 파일에 각각 다음과 같이 categories 라는 메타데이터를 추가해 봅시다.

```js
---
title: Post One
date: "2021-12-14"
categories:
    - "numbers"
    - "odd"
---

Hello, I am _Post One._

**Nice to meet you!**
```

```js
---
title: Post Two
date: "2021-12-14"
categories:
    - "numbers"
    - "even"
---

Hello, I am _Post Two._

**Nice to meet you!**
```

3.md 파일도 비슷하게 넣어주시면 됩니다.

이제 categories 를 분류해줘야 하는데요.

어떻게 시작해야 할까요?

바로 /src/routes/blog/category/[category] 라는 경로를 이용해서 다이내믹 라우팅으로 만들어야 합니다.

왜냐하면 category는 사전에 정해진 게 아니기 때문이죠.

```js
📂 src
┗ 📂 routes
  ┗ 📂 blog
    ┗ 📂 category
      ┗ 📂 [category]
        ┣ +page.svelte
        ┗ +page.ts
```

그러면 먼저, /src/routes/blog/category/[category]/+page.ts 파일을 만들도록 하겠습니다.

```js
// src/routes/blog/category/[category]/+page.ts

export const load = ({ params }) => {
    console.log(params);
    return {}
}
```

이제 브라우저에서 /blog/category/numbers 라는 경로로 들어가 봅시다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEh7bNNVqdiM-qFBTvOXhxh8wwN2pscsx6q1xxu2YJHVlAd4NuWsecuxoOvHuLBH_WdeZLPphWSq7_2UpXxniDz7c1zSMCP9ZtJy1R696XsKcHWmID5HCeeXVl3I573UyFLdBVmmMYUlEi8bKWqWkG2h5sA5IhSrRtTXTiEmZVGoK4OPikyd0thFZEcK=s16000)

위와 같이 콘솔 창에 params 값이 나오는데요.

numbers 라고 우리가 지정한 값이 그대로 나옵니다.

다이내믹 라우팅이 정상 작동되고 있네요.

이제 +page.ts파일을 본격적으로 확장해 보겠습니다.

```js
// src/routes/blog/category/[category]/+page.ts

export const load = async ({ fetch, params }) => {
    const { category } = params;
    const response = await fetch(`/api/posts`);
    const allPosts = await response.json();

    const posts = allPosts.filter(
        post => post.meta.categories.includes(category)
    )
    return {
        category,
        posts
    }
}
```

그리고 +page.ts 파일에서 리턴한 data값을 받는 +page.svelte 파일도 만들어 보겠습니다.

```js
<!-- src/routes/blog/[slug]/+page.svelte -->
<script>
  export let data;
  console.log(data);
  const { category, posts } = data;
</script>

<h1>Blog category: {category}</h1>

{#if category.length}
  <aside>
    <h2>Posted in:</h2>
    <ul>
      {#each posts as post}
        <li>
          <a href={post.path}>
            {post.path}
          </a>
        </li>
      {/each}
    </ul>
  </aside>
{/if}
```

이제 브라우저에서 /blog/category/numbers 라는 경로로 이동해 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEgS8uA3DN2RDkEz_Sd0nvKe2YiZMovUfBLS-3LIdO8ckkwRzoe2qUaVTlaE7PJdTggJrKdCeT2qPdyv5vgE1KEITM6gTUMB8VP38nBRyOgAtC3V164WFO4OXjQpJ4xByZwgupQV-MMikBBfvGuDsfiysNRDH6e0aqFmMOm_7u4oCER_L_kRy6_tnHx-=s16000)

위와 같이 아주 잘 나옵니다.

그럼 브라우저에서 /blog/category/odd 로 이동해 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEhv24zAT0LAyLzq13Rmo7NyluIl5rO6TB-jZJgdpo5LbFBdT1LPIF1GW3zIaqBIC14oKBU9mK1E42G8OWiAVJDeHcqLSfZxXggHx6RDEH0MlPlgyrpBfqXHkbh8awdf3rtxkrj_ucovFWlt3_JyYhSivwAeuTEUBfilXXxNgMU0cYcwimljasn920GY=s16000)

예상했던 대로 잘 나와 주고 있습니다.

---
## blog 페이지에 category 보여주기

이제 category 에 대한 로직도 완성했으니까, blog 페이지에 카테고리를 보여주는 방식으로 바꿔볼까요?

```js
<!-- src/routes/blog/+page.svelte -->
<h1>Blog</h1>
<h3>
  <a href="/blog/category">Goto Category</a>
</h3>
...
...
```

위와 같이 category로 갈 수 있는 링크를 하나 만들었습니다.

---
## category 페이지 만들기

이제 전체 카테고리 리스트가 나오는 category 페이지를 만들어야 합니다.

위치는 당연히 /src/routes/blog/category/+page.svelte(js) 가 되겠습니다.

```js
// src/routes/blog/category/+page.ts
export const load = async ({ url, fetch }) => {
    const result = await fetch(`${url.origin}/api/posts`);
    const posts = await result.json();

    console.log(posts);

    let uniqueCategories = {};

    posts.forEach(post => {
        post.meta.categories.forEach(category => {
            if (uniqueCategories.hasOwnProperty(category)) {
                uniqueCategories[category].count += 1;
            } else {
                uniqueCategories[category] = {
                    title: category,
                    count: 1
                }
            }
        })
    })

    const sortedUniqueCategories = Object.values(uniqueCategories).sort((a, b) => (a.title > b.title))

    return {
        uniqueCategories: sortedUniqueCategories
    }
}
```
위 코드는 카테고리 정보를 가져와서 카테고리 숫자까지 계산해서 리턴해주고 있습니다.

이제 이걸 처리하는 +page.svelte 파일을 만들어야겠죠.

```js
<script>
  export let data;
  const { uniqueCategories } = data;
  console.log(uniqueCategories);
</script>

<div>
  <h1>All blog categories</h1>

  <ul>
    {#each uniqueCategories as category}
      <li>
        <a href="/blog/category/{category.title}">{category.title}</a>
      </li>
      ({category.count})
    {/each}
  </ul>
</div>
```

이제 /blog/category 주소로 가볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEjVEvlFss39zHtCETllxhwg-o9-fL3WhWGBL1Bb4Ol29cmh9WBgkWk-3U9KbG5xAWvuC8mJq59VSkU999l7xeQK9rO41K2CnFLRpuf8n__eKwl3gwzmjBxp4zMD2vycjNhDezVlYVvBXnV1U_Ih9QDFe6Sn2uzTsX3IRSEzZLfrSHcR78T6kdiRZR-9=s16000)

콘솔창에는 위와 같이 나옵니다.

브라우저에서는 다음과 같이 나오고요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhZke_UlkTdnTMz0eSpGtnqDDJ8Is4FUVYuNpYf2CnCRou3XLYbcnhN8HzG02jrrOVj8r4u9spa4M6mLvlVZhvOxAupy9bfVh-9oSXNXNQ0WXsjHZ21L3VnzAZMmqycvgIqmDyOECdSvZuzr-9Bstn6StcgA7WGjHpcXxXXB8WJeLhoVrjzp8jnUNPi=s16000)

어떤가요?

모든 게 잘 작동되고 있죠?

---
## 페이지 트랜지션

링크를 눌러 페이지를 이동할 때 transition 특성을 부여해서 좀 더 매끄러운 UI를 완성할 수 있는데요.

Svelte에는 이게 기본 내장되어 있습니다.

페이지 트랜지션을 적용하려면 모든 페이지에 transition 특성을 넣어야 하는데 이럴 때 쓰이는 파일이 바로 /src/routes/+layout.svelte 파일입니다.

일단 +layout.ts 파일에 다음과 같이 작성합니다.

```js
// src/routes/+layout.ts
export const prerender = true;

export const load = ({ url }) => {
    const currentRoute = url.pathname;

    return { currentRoute }
}
```
load 함수에서 currentRotue 값을 리턴해 주고 있는데요.

이걸 +layout.svelte 파일에서 처리해 보겠습니다.

```js
<!-- +layout.svelte -->
<script>
  import Header from "../lib/components/Header.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import "$lib/styles/style.css";
  import { fade } from "svelte/transition";

  export let data;
</script>

<Header />

{#key data.currentRoute}
  <main in:fade={{ duration: 150, delay: 150 }} out:fade={{ duration: 150 }}>
    <slot />
  </main>
{/key}

<Footer />
```

svelte/transition 에서 fade 함수를 불러와서 slot을 감싸는 main 태그에 적용시켰습니다.

그리고 #key 속성을 이용해서 모든 currentRoute에 적용시켰습니다.

브라우저에서 이리저리 링크를 클릭해보시면 화면이 조금 부드러워졌다고 느낄 겁니다.

---
## 링크 prefetch 사용해보기

링크를 prefetch 하는 기능은 Remix에 있던 기능인데요.

SvelteKit에서도 적용 가능합니다.

사이트 전체를 preload 하는 방법도 있는데요.

우리는 여기서 블로그 리스트 파일에서 링크를 호버 했을 때 prefetch 가 일어나도록 하겠습니다.

```js
// src/routes/blog/+page.svelte
...
...
...
<a data-sveltekit:prefetch href={post.path}>{post.meta.title}</a>
...
...
...
```

위와 같이 a 앵커 태그에 data-sveltekit:prefetch 라고 적으면 prefetch가 작동됩니다.

실제로 크롬 개발자 창을 열어 놓고 마우스를 링크에 호버 시키면 아래 그림처럼 해당 마크다운이 메모리에 불러 들어와 집니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgvfGeAqHso3q3FfXor8b5YcTlHpZww84433nK9moOK-o84HPbZBqlZpGGGrIcj56dmwrv-XLlIwL_j_VHVx-VNIBtPf9COZRjujQXWK1vcVcpr_rpPJOf-76SvGqMPGe00j1Ryzq4GmHaPiGSicobq6-doYNYKj-M794hj0rpgnqAVMXij8FD0HM0K=s16000)

---
## RSS feed

블로그에는 RSS 피드가 있으면 좋습니다.

다음 경로로 만들겠습니다.

```js
📂 src
┗ 📂 routes
  ┗ 📂 rss
    ┗ 📜 +server.js
```

RSS 피드 파일은 서버 사이드 쪽 파일이기 때문에 +server.js라는 이름으로 했습니다.

```js
import { fetchMarkdownPosts } from '$lib/utils'

const siteURL = 'https://your-domain.tld'
const siteTitle = 'Your site title here'
const siteDescription = 'Your site description here'

export const prerender = true

export const GET = async () => {
    const allPosts = await fetchMarkdownPosts()
    const sortedPosts = allPosts.sort((a, b) => new Date(b.date) - new Date(a.date))

    const body = render(sortedPosts)
    const options = {
        headers: {
            'Cache-Control': 'max-age=0, s-maxage=3600',
            'Content-Type': 'application/xml',
        }
    };

    return new Response(
        body,
        options
    )
}

const render = (posts) =>
(`<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${siteTitle}</title>
<description>${siteDescription}</description>
<link>${siteURL}</link>
<atom:link href="${siteURL}/rss.xml" rel="self" type="application/rss+xml"/>
${posts
        .map(
            (post) => `<item>
<guid isPermaLink="true">${siteURL}/blog/${post.path}</guid>
<title>${post.meta.title}</title>
<link>${siteURL}/blog/${post.path}</link>
<description>${post.meta.title}</description>
<pubDate>${new Date(post.meta.date).toUTCString()}</pubDate>
</item>`
        )
        .join('')}
</channel>
</rss>
`)
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEj2ZX5nUuV5q-OmrLjb1zMVPgmYKVduZbf215GB0UcnEiL9ybT4C1lW71C3__131ouZB5S2w-nFbaVWwfWzgmBRfBtjWlarR4bEacCvBOITZra0iUg0DArfUID3qaeUSIlYzzLBbgOKl2ulHctJVKIfzd7HieyZoCK7bUcESkGpsZKGUYXOBvzykcXB=s16000)

위 그림과 같이 아주 잘 작동되네요.

---
## 페이지 헤더 파일 자동으로 만들기

블로그 시스템은 각각의 블로그 마크다운이 브라우저에 로드되면 브라우저 타이틀 값을 변경시켜줘야 하는데요.

Svelte에서는 다음과 같이 간단하게 할 수 있습니다.

간단히 예를 들어 /src/routes/blog/[slug]/+page.svelte 파일에 넣어 보겠습니다.

```js
<!-- src/routes/blog/[slug]/+page.svelte -->
<script>
  export let data;
  const { title, date, Content } = data;
</script>

<svelte:head>
  <title>My blog - {title}</title>
  <meta property="og:title" content={title} />
</svelte:head>

<article>
  <!-- <h1>{data.title}</h1> -->
  <!-- <p>Published: {data.date}</p> -->
  <!-- <svelte:component this={data.content} /> -->
  <h1>{title}</h1>
  <p>Published: {date}</p>
  <Content />
</article>
```

위 코드처럼 svetle:head 를 이용하면 쉽습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiCT_LRsk9f7PuFGJ4K7pwb2kJT8hfH2ZGj_PSls1nyPpYq4nRRRRxz0w9zqj_A2Z2b59qVh6AsfvYbdrszUjigu7QjCLfjVYexTK-nqSQvUMLOqAl7ACGfgPItsejLwNQUcLdic-yVtzl3F7EBVbTrWNVRKF4I7vb6yYS75b8toE7o3Hw16YLfPFiD=s16000)

위 그림처럼 브라우저에 타이틀 값이 변경된 걸 보실 수 있을 겁니다.

그리고 페이지 소스 파일도 열어보시면 title 값과 meta 값이 잘 적용되어 있을 겁니다.

---

지금까지 SvelteKit 1.0 버전이 나온 기념으로 가장 기본이 되는 Blog 시스템을 만들어 보았는데요.

Next.js 13 버전보다 가벼운 느낌이 드는 건 무슨 기분일까요?

SvelteKit 도 꼭 배워두시길 당부드립니다.

그럼.
