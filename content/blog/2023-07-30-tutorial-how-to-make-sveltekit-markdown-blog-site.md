---
slug: 2023-07-30-tutorial-how-to-make-sveltekit-markdown-blog-site
title: SvelteKit을 이용해 마크다운(Markdown) 형식의 블로그 만들기
date: 2023-07-30 02:06:39.724000+00:00
summary: SvelteKit을 활용해서 나만의 블로그 시스템 만들기(마크다운)
tags: ["sveltejs", "sveltekit", "blog", "markdown", "mdsvex", "prism"]
contributors: []
draft: false
---

안녕하세요?

이 글은 드디어 제가 SvelteKit을 본격적으로 공부해 보는 첫 번째 블로그가 될 거 같네요.

예전에 SvelteKit 1.0 pre-alpha 버전에 관해 블로깅 한 적이 있는데요.

총 3개로 나누어서 올렸었는데요.

1. [2022년 8월 기준 SvelteKit 1.0 pre-alpha 버전에서 바뀐 점 살펴보기](https://mycodings.fly.dev/blog/2022-12-15-sveltekit-breaking-changes-before-1-0)

2. [SvelteKit Tutorial 1 - 폴더 라우팅, 다이내믹 라우팅, 페이지 레이아웃, 스코프트 스타일](https://mycodings.fly.dev/blog/2022-12-17-sveltekit-folder-routing-dynamic-routing-and-layout-page-scoped-style)

3. [SvelteKit Tutorial 2 - 서버 렌더, 정적 사이트로 빌드하기, 페이지 트랜지션, rss feed 만들기](https://mycodings.fly.dev/blog/2022-12-18-sveltekit-server-rendering-prerendering-page-transition-rss-feed)

한 번 꼭 읽어보셨으면 좋겠습니다.

제가 예전에도 썼었지만, React 진영에 있는 Remix Framework하고 거의 비슷합니다.

기본적인 동작 방식이 비슷해서 쉽게 공부할 수 있었는데요.

이제 본격적으로 SvelteKit을 활용해 볼까요?

---

## SvelteKit 설치

터미널에서 아래와 같이 입력하면 SvelteKit을 설치할 수 있습니다.

```bash
npm create svelte@latest sveltekit-markdown-blog
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEisNwOzSYc8M3t-d_pFQoyqqfs6oG2EUJJCeMbSreQewTDeVMJyXU4d-rsesBqExpT5m1Sn5GitAliTutrHUGo0mhHAAu6jfn6-sm8TJYZ6GyvWLxU4C3k7EGLweyz3Dg86sEefgvjkOaNQV7ZkfnOPdavfDlP1ZSMi_QD3ao9ua2auvKekXMbLPa_Zjnw)

CSS 관련해서는 TailwindCSS를 사용할 예정입니다.

아래와 같이 TailwindCSS를 설치해 주십시오.

```bash
cd sveltekit-markdown-blog
npx svelte-add@latest tailwindcss
```

svelte-add 라는 커뮤니티에서 만든 패키지가 있는데요.

아주 쉽게 TailwindCSS를 설치할 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiFEpzbqx87iwrIugve2kCLrX1GeHvJJ81eTl2pjgOPzbTmMQxclRXqA5ja15CDiZ8w7CAAc_A9ZBu0P2mxeih6iPD6hSyrpE18cZYXRXXQugrQwluyYXSd44KMcFHdiOBOICrFIcsFcphCsE_qv7wWekmitnZGm6ZDlzooWfKIqbbJGm6CMqnCJVpx2_E)

svelte-add 패키지는 tailwindcss 세팅만 해주기 때문에 필요한 패키지를 설치하기 위해서는 한번 더 npm install을 해줘야 합니다.

```bash
npm install
```

아래처럼 tailwind.config.cjs 파일과 postcss.config.cjs 파일도 잘 설치되었습니다.
```bash
➜  sveltekit-markdown-blog> tree . -L 1
.
├── README.md
├── node_modules
├── package-lock.json
├── package.json
├── postcss.config.cjs
├── src
├── static
├── svelte.config.js
├── tailwind.config.cjs
├── tsconfig.json
└── vite.config.ts

4 directories, 8 files
➜  sveltekit-markdown-blog>
```

이제 src 폴더를 볼까요?

```bash
➜  sveltekit-markdown-blog> cd src
➜  src> tree .
.
├── app.d.ts
├── app.html
├── app.postcss
├── lib
│   └── index.ts
└── routes
    ├── +layout.svelte
    └── +page.svelte

3 directories, 6 files
➜  src>
```

TailwindCSS 기본 세팅 파일은 app.postcss 파일에 있습니다.

```bash
➜  src> cat app.postcss
/* Write your global styles here, in PostCSS syntax */
@tailwind base;
@tailwind components;
@tailwind utilities;
➜  src>
```

그리고 이 app.postcss 파일은 routes/+layout.svelte 파일에서 import 되고 있습니다.

```bash
➜  routes> cat +layout.svelte
<script>
  import "../app.postcss";
</script>

<slot />
➜  routes>
```

routes 폴더 밑에 있는 파일이 SvelteKit에서 라우팅(routing)을 담당하게 됩니다.

SvelteKit이 Remix Framework과 다른 점은 바로 폴더 방식 라우팅이라는 점이죠.

Next.js와 같은 방식입니다.

이제 TailwindCSS를 테스트해 보기 위해 routes/+page.svelte에 CSS 부분을 추가해서 마지막으로 개발 서버를 한번 돌려보겠습니다.

```js
//routes/+page.svelte

<h1 class="text-2xl font-bold">Welcome to SvelteKit</h1>
<p>
  Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEhdSTCCwOms_eTLnNnUUdURG8DgDBodlnxF2yD-uw-cmefOhA3UBsUXgkua_oqAKQvCHYyR5WaG-ptjY4r2ZsgI7FZTMdXBS5QKqa7zz7FoojwUsOets5CdUgmrWThxcLmy1ERsrtXhooJ6lbmZDaZmoZUsWu9kftTb3M4c7fFC-KNuWMNCWJt6pJM8DOk)

TailwindCSS를 이용한 CSS가 브라우저에서 아주 잘 보이네요.

이제 본격적인 준비가 끝났으니까요, 본격적인 MarkDown 블로그 시스템을 만들어 보겠습니다.

---

## mdsvex 설치하기

React 진영에는 마크다운 관련 패키지가 많습니다.

Svelte 진영에서는 mdsvex가 가장 유명합니다.

일단 설치해 볼까요?

참고로 Svelte는 일종의 자바스크립트 컴파일러기 때문에 모든 패키지는 -D 옵션을 이용해서 설치하면 됩니다.

```bash
➜  sveltekit-markdown-blog> npm i -D mdsvex

added 6 packages, and audited 166 packages in 4s

26 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
➜  sveltekit-markdown-blog>
```
mdsvex 패키지는 설정파일을 조금 수정해야 하는데요.

svelte.config.js 파일을 아래와 같이 수정하시면 됩니다.

```js
import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/kit/vite";

import { mdsvex } from 'mdsvex';

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
  extensions: ['.md'],
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.md'],
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: [vitePreprocess({}), mdsvex(mdsvexOptions)],

  kit: {
    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
    // If your environment is not supported or you settled on a specific environment, switch out the adapter.
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter: adapter(),
  },
};

export default config;
```

mdsvexOptions을 지정한 거고, 그리고 preprocess에 mdsvex를 추가했습니다.

이렇게 preprocess에 mdsvex를 추가하면 이제 앞으로 .md 파일도 하나의 Svelte 컴포넌트로 인식하게 됩니다.

이제 src 폴더 밑에 블로그 글을 보관할 폴더 posts를 만듭시다.

그리고 예제를 위해 2개의 .md 파일을 아래처럼 작성하겠습니다.

```bash
➜  src> tree ./posts -L 1
./posts
├── first-post.md
└── second-post.md

1 directory, 2 files
➜  src>
```

first-post.md 파일의 내용입니다.

```markdown
---
title: First post of my Blog
description: this is my first post
date: '2023-7-29'
categories:
  - sveltekit
  - svelte
  - first
published: true
---

## My First Markdown Blog

Hello! 👋

아래처럼 코드 Syntax Highlight도 지원합니다.


\```js
function greet(name: string) {
  console.log(`Hey ${name}!`)
}
\```

위와 같이 소스코드도 넣을 수 있습니다.
(역슬래쉬는 빼고 넣으셔야 합니다.)
```

second-post.md 파일 내용입니다.

```markdown
---
title: Second Post of Markdown Blog
description: this is my second post
date: '2023-7-30'
categories:
  - sveltekit
  - svelte
  - second
published: true
---

## Svelte

**static** 폴더에 있는 파일은 `/` 경로로 서빙되기 때문에

아래와 같이 블로그에서 그대로 불러올 수 있습니다.

![Svelte](favicon.png)

```

이제 예제 .md 파일을 만들었으니까, 이 .md 파일을 불러와서 관련 데이터를 수집해야 합니다.

SvelteKit은 Vite를 사용하는데요.

Vite에 있는 import.meta.glob 명령어를 사용하면 됩니다.

마크다운 블로그를 불러오는 로직을 실제 각각의 페이지에 서버 사이드로 넣을 수도 있습니다.

그것보다는 api 같은 걸 만들어서 각 페이지에서 이 API를 호출하는 게 좀 더 효율적인데요.

그래서 Next.js에서도 지원하는 API 작성을 해보겠습니다.

routes 폴더 밑에 api 폴더를 만들고 그 밑에 +server.ts 파일을 만들면 되는데요.

여기서는 posts 관련 API이니까 api/posts 폴더 밑에 작성하겠습니다.

먼저 타입스크립트를 사용하니까 Post에 대한 타입을 지정하겠습니다.

lib 폴더에는 각종 타입이나 프로젝트 전체에서 사용할 상수, 변수를 작성하면 되는데요.

우리는 types.ts 파일을 만들어서 우리가 전체적으로 사용할 타입을 지정해 보겠습니다.

여기서는 Post 타입입니다.

```js
export type Post = {
  title: string;
  slug: string;
  description: string;
  date: string;
  categories: string[];
  published: boolean;
};
```

본격적인 API 코드입니다.

```js
import { json } from "@sveltejs/kit";
import type { Post } from "$lib/types";

async function getPosts() {
  let posts: Post[] = [];

  const paths = import.meta.glob("/src/posts/*.md", { eager: true });

  for (const path in paths) {
    const file = paths[path];
    const slug = path.split("/").at(-1)?.replace(".md", "");

    if (file && typeof file === "object" && "metadata" in file && slug) {
      const metadata = file.metadata as Omit<Post, "slug">;
      const post = { ...metadata, slug } satisfies Post;
      console.log(post);
      post.published && posts.push(post);
    }
  }

  posts = posts.sort(
    (first, second) =>
      new Date(second.date).getTime() - new Date(first.date).getTime()
  );

  return posts;
}

export async function GET() {
  const posts = await getPosts();
  return json(posts);
}
```

SvelteKit에서 API를 만들려면 GET() 함수를 export하면 되는데요.

GET은 HTTP 메서드입니다.

GET, PUT, DELETE 등 대문자로 함수를 만드는 거는 SvelteKit에 정한 규칙이라 이렇게 하셔야 합니다.

위 코드에서 보시면 getPosts() 함수를 async 방식으로 작성했는데요.

getPosts 함수를 보시면 Vite에서 제공하는 import.meta.glob 함수를 이용해서 src/posts 폴더에 있는 모든 .md 파일을 불러옵니다.

그리고 불러 온 .md파일을 이용해서 metadata와 slug를 뽑고, 최종적으로 sort 한 다음에 posts를 리턴 해 주고 있는데요.

이제 이 API를 실제 페이지에서 호출해 볼까요?

---

## +layout.svelte 파일을 이용해서 전체적인 템플릿 레이아웃 만들기

SvelteKit은 routes 폴더 밑에 바로 있는 +layout.svelte 파일을 Root Layout 파일이라고 부르는데요.

이 Root Layout 파일은 .svelte 확장자와 .ts 확장자를 쓸 수 있는데요. 특히 +layout.ts 파일에는 여러 가지 코드를 넣어 SSR, CSR 등 SvelteKit이 작동하는 방식을 지정할 수 있습니다.

우리는 여기서 CSS Layout을 작성해 보겠습니다.

```js
<script lang='ts'>
  import "../app.postcss";
  import "./prism.css";
  import Header from "./header.svelte";
</script>

<div class="w-full p-4 md:p-6 lg:p-8 xl:p-12">
  <Header />
  <main class="flex flex-col w-full items-center">
    <slot />
  </main>
</div>
```

prism.css 파일을 로딩했는데요. 뒤에서 설명하겠습니다.

일단 header.svelte파일에 Header 컴포넌트를 작성했는데요.

routes 폴더 바로 밑에 header.svelte 파일을 작성하면 됩니다.

```js
<script lang="ts">
</script>

<nav class="flex justify-start sm:ml-28 space-x-8">
  <a href="/" class="text-xl">
    <b>Home</b>
  </a>
  <a href="/about" class="text-xl">About</a>
</nav>
```

위 header.svelte 파일은 위치가 바로 routes 폴더 밑에 있는데요.

SvelteKit은 폴더 베이스 라우팅이기 때문에 header.svelte 파일은 라우팅이 되지 않습니다.

만든 김에 about 경로에 대응하는 about 파일도 만들어 보겠습니다.

폴더 베이스 라우팅이기 때문에 routes 폴더 밑에 about 폴더를 만들고 그 밑에 +page.svelte 파일을 아래와 같이 만듭시다.

```js
<section class="w-full flex flex-col space-y-8 mt-8 pt-2 items-center">
  <h1 class="text-4xl font-bold">About</h1>
  <p class="text-lg">This is About Page of SvelteKit!</p>
</section>
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEh8S4mzqK4Q3cv3bIGlPFml8NWwK8BTIoVHSeEoUpBI9EqJYVui1cnuve-mJ1gsU6h2pJzrgbed3Xe5BdRfavYrVB-M8ImqYk0RacpeZui8w1J1B7zEye3wkBgbI7gKx-Fb4EWs9hw_oBgxXBEv5orusFr6IJuoz6if5bsZqoPv5JnUOd1XqtY2d_kXriY)

![](https://blogger.googleusercontent.com/img/a/AVvXsEg5uIe85Qe8cmgPYrioVm2uvhltJMIT81GGjmlEyDPiLaRV_aG6AjJW9l6gcfRN6PHAXn6wEEYKggWu-46U54VgEZkN56wry_ikg9D9v3MaM0yJtkH6FKByJY88YZKg2uIl_ZHjZ5XLVAGqiJ1iy4jEPcnjbNn2wRHt_XW85x7ETQgdMvUK0E3k11-IWQI)

위 그림처럼 개발 서버가 잘 작동하고 있습니다.

이제 아까 위에서 만들었던 API를 호출하는 코드를 작성해 볼까요?

SvelteKit에서는 서버 사이드 코드는 +page.svelte 파일이 아닌 +page.ts 파일에 작성하는데요.

```js
import type { Post } from "$lib/types";

export async function load({ fetch }) {
  const response = await fetch("api/posts");
  const posts: Post[] = await response.json();
  return { posts };
}
```

위 코드는 아까 우리가 만든 API 코드를 fetch 함수를 이용해서 호출한 겁니다.

같은 SvelteKit 프로젝트 안에 있기 때문에 전체경로를 사용하지 않고 그냥 fetch("api/posts")라고 호출해도 작동합니다.

그리고, 위와 같이 +page.ts 파일을 작성하고 거기에 load 함수를 export 하면 +page.svelte 파일이 렌더링 되기 전에 +page.ts 함수의 load 함수가 먼저 실행되게 됩니다.

React의 클라이언트 사이드 렌더링에서 볼 때 useEffect 훅 같은 건데요.

load 함수 방식은 Remix Framework에서 사용하는 방식과 같습니다.

그리고 이 load 함수에서 return 한 객체를 +page.svelte 파일에서는 data라는 변수로 접근할 수 있습니다.

+page.svelte 파일을 조금 수정해 볼까요?

```js
<script lang="ts">
  export let data;
  console.log(data);
</script>

<h1 class="text-2xl font-bold">Welcome to SvelteKit</h1>
<p>
  Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEhX0Y03SfvnWvJriY663Lse5qVutzB1WPpqf9zMvNwE6O3gSRqQuAKzwh5VRfzAB7ZYBlXEPrijdgPOPVtZCvP0e7vxJ3yL6T7OgjDTpzhR1z1_TRLDdCGQmTQF4YDupII7DcVm88oD6kbixyV5b47tLPNR5iylCKM5NAQz91y6-V7Cg_p3Br7iwNXiizw)

위와 같이 우리가 원하는 data가 출력되고 있네요.

이제 남은 일은 이 data를 UI에 맞게 화면에 예쁘게 그려주면 됩니다.

+page.svelte 파일을 아래와 같이 바꾸겠습니다.

```js
<script lang="ts">
  export let data;
  console.log(data);
</script>

<section>
  <div class="container px-6 py-10 mx-auto">
    <h1 class="text-2xl font-semibold capitalize">My Post Lists</h1>
    <div class="flex flex-col mt-8 space-y-10">
      {#each data.posts as post}
        <div class="border">
          <div class="flex flex-col justify-between p-2">
            <a
              href={post.slug}
              class="text-xl font-semibold hover:underline py-4"
            >
              {post.title}
            </a>
            <p class="py-2">{post.description}</p>

            <span class="text-sm text-gray-500">On: {post.date}</span>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>
```

실행화면을 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEiLJu_Wq6ZyrMYJekI2sLZP0qP_PMUtTsP2GXooGZt1t18tQCrj1B8qk0b-b_bD6rBBeMZcoCUG9M263i5M2rcHMJYm0LRyEBLedYxL3U-OiafDIPv5kvhgY_LXC9PfokZWmvbL5PvfwMypjTr7u1eGV_0lMGJCvPJz8YSZeZNrCLdtQoZPL2L88gCPs9o)

UI 부분은 조금 엉성해 보일지 몰라도 원하는 코드가 모두 작동하고 있습니다.

---

## 다이내믹 라우팅 만들기

이제 각각의 Post를 클릭했을 때 들어가는 상세 페이지를 만들어야 하는데요.

Next.js에서 쓰이는 'routes/[slug]' 방식이 쓰입니다.

routes 폴더에 '[slug]' 폴더를 만들고 그 밑에 +page.ts 파일과 +page.svelte 파일을 만들면 됩니다.

당연히 +page.ts 파일에는 load 함수가 들어가겠죠.

```js
import { error } from "@sveltejs/kit";

export async function load({ params }) {
  console.log(params);
  try {
    const post = await import(`../../posts/${params.slug}.md`);

    return {
      content: post.default,
      meta: post.metadata,
    };
  } catch (e) {
    throw error(404, `Could not find ${params.slug}`);
  }
}
```

이 코드가 바로 다이내믹 변하는 '[slug]'의 slug 부분을 params로 받아와서 그걸 읽어 들인 후 다시 return 해주는 코드입니다.

이렇게 return 된 데이터를 +page.svelte에서 사용하면 되는 겁니다.

```js
<script lang="ts">
  export let data;
  console.log(data);
</script>

<svelte:head>
  <title>{data.meta.title}</title>
  <meta property="og:type" content="article" />
  <meta property="og:title" content={data.meta.title} />
</svelte:head>

<article class="container flex flex-col pt-10 space-y-10 items-center">
  <div>
    <h1>{data.meta.title}</h1>
    <p>Published at {data.meta.date}</p>
  </div>

  <div class="space-x-4">
    {#each data.meta.categories as category}
      <span class="border rounded-xl py-2 px-4 bg-slate-200"
        >&num;{category}</span
      >
    {/each}
  </div>

  <div class="text-lg border">
    <svelte:component this={data.content} />
  </div>
</article>
```

여기서 주의 깊게 봐야 할 게 바로 mdsvex의 작동방식인데요.

Svelte 마크다운 패키지라서 실제 마크다운 데이터를 Svelte 컴포넌트 형식으로 저장합니다.

그래서 마지막에 svelte:componet 방식으로 data.content 부분을 렌더링 한 겁니다.

이제 실제 이 경로로 들어가 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEhJXGvh9V3N95k5kqnMfhQp_FyPfoaNx45l7BwYTiQHUXI2KqU33RqE71wXSZ6qvPaQasoLUhULBIvDy9k804i9pCZYlFRuYxgb1FOVSxANQsWn9XNTB1BFPvpQGTO8hF6w7l_4gOsvGtQdJfVgyvPHqlceaKwc5LMYZG4V5uHcAFQwCVqJeFAtuzgS9Ls)

위와 같이 우리가 작성한 마크다운 블로그가 제대로 보입니다.

그런데 자바스크립트 Syntax Highlight가 제대로 작동하지 않는데요.

이걸 고치기 위해서 Prism CSS 코드를 추가해야 합니다.

프로그래밍 Syntax Highlight 중에 Prism이 있는데요.

mdsvex는 기본적으로 Prism을 지원합니다.

Prism Github 사이트에 가보면 여러 테마가 있는데요.

원하는 테마 한개를 가지고 오면 됩니다.

[https://github.com/PrismJS/prism-themes/tree/master/themes](https://github.com/PrismJS/prism-themes/tree/master/themes)

여기에 가셔서 원하는 스타일의 css 파일을 가져오셔서 우리 SvelteKit의 src 폴더 밑에 prism.css 파일에 저장하시면 됩니다.

저는 prism-ghcolors.css 파일을 선택했는데요.

그리고 routes 폴더 밑에 있는 +layout.svelte에 보시면 prism.css를 불러오는 코드가 있을 겁니다.

이제 자바스크립트 Syntax Highlight 코드가 제대로 작동하는 걸 볼 수 있을 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhrKrkO-owlZOHkiZbf5-JozU0d890FMdPd8x1ZK7tBJoa1SDFRpL_RS6iN7H6Or06VhG3GRAV6Z9WEXJeS0qdQVlwxIIg-w5rCMUEkoYbOLd_RJzSLb26RrDfzFN3yDA49W2UWzErswK57tGPFKkZ-WxWME5KocG3IYViCaF8CTOloger1Aaxq3jvJvgA)

Prism Syntax Highlight가 제대로 작동하네요.

---

## Next.js에 있는 Static Site Generation 구현해 보기

SvelteKit으로 Server Side Rendering, Static Site Generation 등 여러 가지를 구현할 수 있는데요.

Next.js에서는 getStaticProps 등 별도의 코드를 작성해야 하는데요.

SvelteKit에서는 Adapter라는 걸 사용합니다.

그리고 그 실행 코드도 한 줄이면 되는데요.

routes 폴더 밑에 +layout.ts 파일을 만들고 아래 코드를 넣어 볼까요?

```js
export const prerender = true;
```

prerender 상수를 true라고 설정만 하면 SvelteKit이 모든 경로의 파일을 실제 html 파일로 만드는데요.

그리고 svelte.config.js 파일에서 Adapter 부분을 static 방식으로 바꿔 주면 됩니다.

```bash
➜  sveltekit-markdown-blog> npm i -D @sveltejs/adapter-static 

added 1 package, and audited 167 packages in 3s

26 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
➜  sveltekit-markdown-blog >
```

그리고 svelte.config.js 파일에서 @sveltejs/adapter-auto 부분을 @sveltejs/adapter-static 이라고 바꾸면 됩니다.

```js
import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/kit/vite";

import { mdsvex } from 'mdsvex';

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
  extensions: ['.md'],
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.md'],
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: [vitePreprocess({}), mdsvex(mdsvexOptions)],

  kit: {
    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
    // If your environment is not supported or you settled on a specific environment, switch out the adapter.
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter: adapter(),
  },
};

export default config;
```

진짜 별거 없이 쉽게 수정할 수 있는데요.

이제 실제 우리가 만든 블로그 사이트 전체를 정적 사이트로 빌드 해 볼까요?

```bash
npm run build
```
위와 같이 build 하시면 build 폴더가 보일 겁니다.

```bash
sveltekit-markdown-blog> cd build
➜  build> ls -al
total 40
drwxr-xr-x   9 cpro95  staff   288 Jul 30 13:11 .
drwxr-xr-x  17 cpro95  staff   544 Jul 30 13:11 ..
drwxr-xr-x   4 cpro95  staff   128 Jul 30 13:11 _app
-rw-r--r--   1 cpro95  staff  2088 Jul 30 13:11 about.html
drwxr-xr-x   3 cpro95  staff    96 Jul 30 13:11 api
-rw-r--r--   1 cpro95  staff  1571 Jul 30 13:11 favicon.png
-rw-r--r--   1 cpro95  staff  4001 Jul 30 13:11 first-post.html
-rw-r--r--   1 cpro95  staff  3275 Jul 30 13:11 index.html
-rw-r--r--   1 cpro95  staff  2973 Jul 30 13:11 second-post.html
➜  build> tree .
.
├── _app
│   ├── immutable
│   │   ├── assets
│   │   │   ├── 0.c436d076.css
│   │   │   └── _layout.c436d076.css
│   │   ├── chunks
│   │   │   ├── control.f5b05b5f.js
│   │   │   ├── each.e59479a4.js
│   │   │   ├── first-post.b8bf9010.js
│   │   │   ├── index.7468c138.js
│   │   │   ├── preload-helper.cf010ec4.js
│   │   │   ├── scheduler.e108d1fd.js
│   │   │   ├── second-post.c6fa97e5.js
│   │   │   └── singletons.3909a8ce.js
│   │   ├── entry
│   │   │   ├── app.885c6f42.js
│   │   │   └── start.8cfd1522.js
│   │   └── nodes
│   │       ├── 0.36bca449.js
│   │       ├── 1.27cb2f57.js
│   │       ├── 2.f10feee3.js
│   │       ├── 3.d9e0fc8d.js
│   │       └── 4.da8dbe22.js
│   └── version.json
├── about.html
├── api
│   └── posts
├── favicon.png
├── first-post.html
├── index.html
└── second-post.html

8 directories, 24 files
➜  build> 
```

와우! 보이시나요?

about.html 파일도 보이고, index.html 파일도 보입니다.

그리고 Post 파일인 first-post.html 파일도 보이고 second-post.html 파일도 보입니다.

모든 다이내믹 라우팅의 경로를 정적 사이트로 만든 건데요.

실제 이 build 사이트를 github.io 같은 정적 사이트 호스팅 서버에 올리면 실제 블로그 사이트를 구현할 수 있을 겁니다.

npm 패키지 중에 serve 패키지를 이용해서 이 build 폴더를 서빙해 볼까요?

```bash
➜  build> serve .

   ┌──────────────────────────────────────────────────┐
   │                                                  │
   │   Serving!                                       │
   │                                                  │
   │   - Local:    http://localhost:50375             │
   │   - Network:  http://192.168.29.145:50375        │
   │                                                  │
   │   This port was picked because 3000 is in use.   │
   │                                                  │
   │   Copied local address to clipboard!             │
   │                                                  │
   └──────────────────────────────────────────────────┘
```

로컬호스트 50375 포트로 호스팅 되었네요.

아마 3000 포트는 제가 이 블로그를 쓰면서 사용하고 있어서 일 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiHm3xogc7TUy4gWfyWh8HP1BJEoj1wb3xuPL6JS2y0M3-JGsNXoN_-0qv7keycz-GSWMRWz59OSjhSR9XT9GqjVvXb4FgDNx6F3rO7OQ5UBmr54SFbQB7DTapNlzXLIpE2JGvJSr2i9RYujD56CC113KiplrgDCSLuDQH8Oh-zxEIJD-xpM1rSItTrZv4)

위 그림과 같이 정적 사이트 방식으로 아주 잘 작동되고 있습니다.

---

## Serverless Network에 Deploy하기

SvelteKit은 FullStack Framework인데요.

실제 Nodejs 서버로 사용할 수 있고 Edge 네트워크에 Deploy할 수 있습니다.

Vercel, Netlify, Cloudflare Pages 같은 곳에도 Deploy 할 수 있는데요.

그냥 Svelte-adapter를 적절한 걸 고르면 됩니다.

Edge Network 방식은 github 리포지터리와 연동할 수 있게 쉽게 Deploy 시켜주는데요.

Vercel 한번 Deploy 해보겠습니다.

일단 github repository를 만들어야 합니다.

```bash
git init
git add .
git commit -m "first commit"
git remote add origin https://github.com/cpro95/sveltekit-markdown-blog.git
git branch -M main
git push -u origin main
```

Github 리포지터리를 만들었으면 이제 Vercel 어댑터를 설치해 볼 가요?

```bash
npm i -D @sveltejs/adapter-vercel
```

```js
import adapter from '@sveltejs/adapter-vercel'
// ...
```

svelte.config.js 파일의 첫번째 어댑터 부분만 변경하면 됩니다.

vercel 어댑터는 프로젝트에 .vercel 폴더를 만드는데요.

.gitignore에 꼭 추가하시기를 바랍니다.

이제 [Vercel 대시보드](https://vercel.com/new)에서 프로젝트를 추가하면 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjO12llQlXOymM-vXw5riKg3RluzOxl2s-UIeP8J0KpiZTuU1bfezfv7khQSPLeVPoh637MUlsL9IqbnOJmxmSbOTMYKTtd7zpr53rgTw-Y3tsPr4iKLZGWTVg2AwX4MIjJxI9e43Hm2d_gnrWsnQGSHCZkI6s0m6WFAZaVzDCbcUCum_5DYI3etlzjNMo)

위 그림과 같이 제 Github 아이디와 연동되서 방금 만들었던 sveltekit-markdown-blog 리포지터리를 바로 보여주네요.

이제 Import 버튼을 누릅시다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiSZuvMOdPUr3-XIwDS9Ond3b6_auHImHZSg3XLRUSA_7Tymz0GH9Y0ft48HS6WZAaCCQ7AWZMdubIAIiRcW5ntNFHp1iCZkntsQckVJ_a80Csw43k_2FM9cQcp3316kxWWkDyqtxeGolqK8nPayxVfLDHQkKjycVnopCSpohlffLZt4xw7Y9lMrKHFr4w)

위와 같이 나오면 마지막으로 Deploy 버튼을 누르면 됩니다.

이제 기다리면 build가 되는데요.

최종적으로 성공하면 아래와 같이 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjngrOgaIxNbG5kHf2pN9OMvV8i6LAmW_1ylNqTTlMxyT3TLau9LF1duGoTZtOgElW3RM0grXc18_PXrU3SksoQZGQ8ajyJf17fCwC-q3BArChe6Czi0qwxvmRwsOsOh1-Op0xEqZqv5_BnVo6k60ov--w6xWfS68KfEvgD4JMNWp7s-ish6VrcVC2RWfg)

이제 다시 대시보드로 돌아가 보시면 방금 만든 사이트가 보일겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEg36B48cWYXcIc-mM9DVCFGPL8DXxG0FLJjv5YttzCf8AFeDehlPoJX3QxxYFKPAE2g8jVedQztoSjlQFAe1x7BwCeIxqp_MM1GEwHUSHTinzwpNF1MtrJzqpJzZxKTuqAG2wvAS7dlNyPQfM6Byvzi6q7b9BcE2On9ZWdZXq0LcRmfn4DsEA_7R8iRWvo)

위와 같이 도메인 주소까지 제공해 주는데요.

한번 연결해 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEgMbxVmaE_aS335-beZX36GOeQ1o4vbm9lsMiwKgDfnl8F059EqQU6Iix9XGgLHp8UkQdwl7tlPzJL00QDthTuwbjKEnz69aOWS3KUxzU_WiFeD39hBw3DS1x-IpkKWbZW2a3oe-bj--dVFK7p7MYV7uQq1SNmrSBKSoy1vojo4roOQImpi0CYwtQw0dv8)

vercel.app 호스팅에서도 아주 잘 작동합니다.

---

## 테스트해 보기

routes 폴더 밑에 +layout.ts 파일에서 prerender 값을 true, false로 바꿔서 테스트해 보십시오.

prerender 값이 true이면 정적사이트가 되는 거고, false면 서버 사이드 렌더링이 되는 겁니다.

---

지금까지 SvelteKit을 이용해서 나만의 마크다운 블로그를 만들었는데요.

본인 만의 UI를 만든다면 아주 멋진 블로그가 될 거 같네요.

그럼.




