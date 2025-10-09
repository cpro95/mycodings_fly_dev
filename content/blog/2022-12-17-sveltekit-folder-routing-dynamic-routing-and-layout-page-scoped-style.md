---
slug: 2022-12-17-sveltekit-folder-routing-dynamic-routing-and-layout-page-scoped-style
title: SvelteKit Tutorial 1 - 폴더 라우팅, 다이내믹 라우팅, 페이지 레이아웃, 스코프트 스타일
date: 2022-12-17 12:34:31.884000+00:00
summary: SvelteKit Tutorial 1 - 폴더 라우팅, 다이내믹 라우팅, 페이지 레이아웃, 스코프트 스타일
tags: ["sveltekit", "svelte", "sveltejs", "folder route", "layout page", "scoped style", "tutorial"]
contributors: []
draft: false
---

![](https://blogger.googleusercontent.com/img/a/AVvXsEiFWcFVsGwat7XfOA1YQqeUuF456KrDuFPWw7RhWgEYs3Cr_B3_545ADoB47aOfYqBjKCnQz7hx_x7AJ3aN8MZY5zI5o_JCrRV6NknAm_Lf5Y8qtt6j6RGLWNxHgctwn2s1Tqf85ixLGOvWvpciIdzkHq8ZSGAf_oQnjhunWUywAbV3aAZjt6Iz9oW-=s16000)

안녕하세요?

SvelteKit 1.0이 나왔다는 소식을 듣고, 이제 본격적인 SvelteKit 공부에 전념해 보겠습니다.

본격적인 SvelteKit 개발을 위해 오늘은 가장 기본이 되는 블로그 시스템 만들기를 해보겠습니다.

---
## 설치

먼저, SvelteKit 설치해보겠습니다.

```bash
npm create svelte@latest my-app
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEiKlFai3Mdt9eDD0qirHRzk2j1I-tD1PxfKFHdVwlUbHjYlTcwi-V0il1vmrfUmgApGeCEM4wJPyv8kjjx_T7eqsZx-Et9XWCEmM1VF-MbW2gpgl-N_YVu74lSHwQtdSBl2kgC4J57ljP5nJFrXbNJj-h7CWY0x1nqpr5gv0cG_F42Pd9wxC3HCUlvE=s16000)

위와 같이 나오면 Skeleton project를 고르시기를 바랍니다.

최종적으로 계속 엔터를 치면 아래와 같이 완료됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiezbnhkqXeQKL-8tJeTIyb-7jPkZx4UjPFZ03smb2N92uypa5E0h6t-AB2f4ZQQ6krAgzDvpc1xFsJqfuFM9_6MxWXD01ldzCXt7UgHpfH2RBoVQYiw1xFNCHt4X4s3TnggeKg6v2ZLL9XSZheMDWxIxjIil2lCVrHqaddsGkxUsqfo_H9iyDfXaTc=s16000)

이제 npm install 하고 개발 서버를 돌려볼까요?

SvelteKit은 최근 대세인 Vite를 이용합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEie6CFyVd_DXklACttcQC6F1AmA29Y5TyhK6_LjBzj4wdRfMCu2Kc1GSkarD3wn0FuqPsCZeEmSNJYKS0KSAm9AP-lx_i-QiwxDwqNQea5gnivay31EmAj1ffiOTnMQzKCplkRk23Bb4bV8RRoXJ72jPg3cqvI06lr6RnywRwR9NwlDjKvlGPzhPJaZ=s16000)

Vite는 기본 포트가 5173입니다.

헷갈리지 마시기 바랍니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhKZTfw2Kq9PND58Yu-FPWNGFiMs1ZcED2FUsoJx8RU4_Mb2zSL_tZtJA4FZh6UuDeaGgzC1M2dD0y4SiL5Vw3xPqyUMZR7xQ2F7A8tQzV-pbj3U94QWpYEMOhCSjLvE5j3gIO4q_u88Qtfy5zGq8gXgxuF7lKy5Aj3hcTnMvmt1gWowjDJkBzhgZfC=s16000)


위와 같이 나오면 SvelteKit 개발을 위한 사전 준비가 모두 완료되었습니다.

---

## 폴더 방식 라우팅

SvelteKit 라우팅 방식은 Next.js 13과 같은 폴더 방식 라우팅입니다.

제가 쓴 예전 글을 살펴보셨다면 SvelteKit이 2022년 8월 부터 폴더 방식 라우팅으로 바뀌었고, (+) 글자를 앞에 넣는다고 했었는데요.

폴더까지가 라우팅 주소가 되고 그 안에 +page.svelte 파일이 가장 기본이 되는 파일이 됩니다.

더 이상 index.svelte 파일은 사용하지 않으니 참고 바랍니다.

또 (+) 글자가 없으면 라우팅으로 인식되지 않으니 참고 바랍니다.

우리가 만들려는 블로그 시스템은 라우팅이 4개입니다.

/ ==> 루트 라우팅

/about

/blog

/contact

그러면 어떻게 폴더를 구성해야 할까요?

SvelteKit은 /src/routes 폴더 밑에 있는 걸 라우팅 하는데요.

/src/routes 폴더 밑에 해당 +page.svelte 파일을 만들면 됩니다.

먼저 루트 라우팅을 위한 /src/routes/+page.svelte 파일은 기본으로 작성되어 있고요.

그다음으로 about, blog, contact 라우팅을 위해 /src/routes 폴더 밑에 각각의 이름으로 폴더를 만들고 그 밑에 +page.svelte 파일을 아래와 같이 만들겠습니다.

```js
<!-- about/+page.svelte -->
<h1>Hi, I'm from mycodings.fly.dev</h1>

<p>This is my about page.</p>
```

```js
<!-- blog/+page.svelte -->
<h1>Blog</h1>

<p>My blog posts will go here eventually…</p>
```

```js
<!-- contact/+page.svelte -->
<h1>Get in touch</h1>

<p><a href="mailto:me@my.tld">Email me!</a></p>
```

위와 같이 코드를 작성했으면 아래와 같을 겁니다.

```js
📂 src
┗ 📂 routes
  ┣ 📜 +page.svelte
  ┣ 📂 blog
  ┃ ┗ 📜 +page.svelte
  ┣ 📂 about
  ┃ ┗ 📜 +page.svelte
  ┗ 📂 contact
    ┗ 📜 +page.svelte 
```

위와 같은 구조가 되어야 합니다.

이제 폴더 방식 라우팅이 재대로 작동하는지 한 번 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEixximypn1tOTPkwM_16Hq6lJbnLN8vVSUsNN63gbJoqmk0bsPebrvKH-8nQZuKUcuimwEqG9TPy9SsMqz_j_pTQcqbWEljEPeshAnb970VysC3GCLaiJD0_JUDnEaxSFdtGhkchN5uiyNo3g7RM5KTxGEjgjBVJTBQ0-AdSsvZyfhKvXaJeQNWbd7Z=s16000)

![](https://blogger.googleusercontent.com/img/a/AVvXsEgzBSKLqNeDtwWYSMedK8My_iu1KyePNdlQMfgGIzdhvXPCy40r_TUy57Mj1BWvYKDLIibg93PmPKJtzSfnyw14x-P_ZsEAE6Ssy7IID7mN2Rt72QifcD8-o8t3xQp0YWREZtru21gBe1ky38MlHL9Xp2JgRKpvielsGpp0AaOAfDKC1P6ylA4weswi=s16000)

제대로 작동하네요.

---
## Layout

Next.js 13 버전과 비슷하게 Layout 파일도 제공해 주는데요.

/src/routes 폴더가 가장 기본이 되는 폴더입니다.

여기세 +layout.svelte 파일을 작성하면 어떻게 될까요?

바로 이 +layout.svelte 파일은 모든 라우팅에 기본으로 포함되게 됩니다.

바로 Nested Route인데요.

Next.js 13 버전에서 도입된 것과 같습니다.

사실 Remix Framework에서 처음 도입되어 큰 반향을 불러일으켰었는데요.

Nested Layout 이 이제 모든 meta 프레임워크에서 기본적으로 정착되는 모양새입니다.

그럼 이 +layout.svelte 파일에 무엇을 넣으면 좋을까요?

바로 Header와 Footer 처럼 반복되는 컴포넌트를 넣어주면 좋습니다.

/src/routes/+layout.svelte 파일을 아래와 같이 작성해 보겠습니다.

```js
<!-- +layout.svelte -->
<header>Hi, I'm a header</header>

<main>
  <slot />
</main>

<footer>Hello, I'm the footer.</footer>
```

위 코드를 보시면 slot 이 보이는데요.

이 slot이 바로 Nested Layout을 위한 부분입니다.

Remix Framework에서는 Outlet이라 부르고, Next.js 13에서는 children 으로 사용됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjYQLT9C64QcKP-s4AHjaBXu3zgPMV0tGqIKQuHwUT7FsPAXkThZMX8jEuOWiId7I9HZikBRsuvbl58fKuOg9BrpzenJyD4v7TZGMBStd82jh16L9X2FV7-Z4w4IaNXpdTDSJJ4Ksvy-z4gQ7UHerF0Yy-TUR_tp44oMsSirTYT3RpHe-Vzq5y29yRW=s16000)

위 그림을 보면 메인 라우팅에도 Layout이 적용되었네요.

그럼 하위 라우팅에도 적용되었을까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEiJT2La8UPDDFPQXaIS1udZ8e9Y72AmVynpKD7Jo2E9mL9zMhDH007_W2QdqhoAG2sw1z8nHG9rdKWHHRNFhoQXtBe-U1iarkrtbO_DJZeP0PrhN2aOjz4-jh5G1IPaekHLOsk6q3fpFWAfE-KkJDt_-1kJ3n4xUp3aTKxNydZvX3dd-kQa9z1bUN5o=s16000)

/about 주소에도 Layout이 잘 적용되었습니다.

Header 부분이 너무 이상한데요.

실제 코드로 수정해 보겠습니다.

+layout.svelte 파일에 넣을 Header 컴포넌트를 만들어 보겠습니다.

SvelteKit에서는 /src 폴더 밑에 lib 폴더를 만들고 또 그 밑에 components 폴더를 만들고 그 안에 Header.svelte 처럼 해당 컴포넌트를 작성 하는게 관례입니다.

```js
📂 src
┣ 📁 routes
┗ 📂 lib
  ┗ 📂 components
    ┗ 📜 Header.svelte
```

꼭 이럴 필요는 없는데요.

SvelteKit에서는 (+) 글자로 시작하지 않으면 라우팅으로 계산되지 않아서 그냥 원하는 곳에 (+) 글자 없이 Header.svelte라고 작성해도 됩니다.

또, 컴포넌트를 대문자로 시작할 필요도 없습니다.

그러나, 위와 같이 하는 게 나중을 위해 좋다고 하니까요, 관례를 따르도록 하겠습니다.

자 그럼 Header.svelte 컴포넌트 코드를 아래와 같이 작성합시다.

```js
<!-- Header.svelte -->
<header>
  <a href="/">Home</a>

  <nav>
    <ul>
      <li>
        <a href="/blog">Blog</a>
      </li>
      <li>
        <a href="/about">About</a>
      </li>
      <li>
        <a href="/contact">Contact</a>
      </li>
    </ul>
  </nav>
</header>
```

그럼 위와 같이 작성한 Header 컴포넌트를 +layout.svelte 코드에 삽입해 봅시다.

```js
<!-- +layout.svelte -->
<script>
  import Header from "../lib/components/Header.svelte";
</script>

<Header />

<main>
  <slot />
</main>

<footer>Hello, I'm the footer.</footer>
```

이제 어떻게 변했는지 살펴볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEjMfpnWxYGeyhmlM23s-uBnvu_FuM9hsMWNg5ykQHzx8olf9v52vlWTRAIv5zY14zMTLHt72VzMKo4RfLBKNecKTAtKif1cmcKekzNwAUJl_JZ9VQ4iFj84JrEJNYKoIY3PNsqQlZCgkKpNlnYWODzl0Hz6JeiW-6YViwFmlofqmyTKaINfpeUcAS51=s16000)

위와 같이 Header 부분이 잘 나오네요.

---
## CSS Styling

Header 부분이 너무 이상한데요.

CSS 스타일을 적용해 보겠습니다.

Svelte는 CSS Style도 같은 파일 안에서 지정할 수 있습니다.

다시 Header.svelte파일을 열어서 아래와 같이 수정합시다.

```js
<!-- Header.svelte -->
<header>
  <a href="/">Home</a>

  <nav>
    <ul>
      <li>
        <a href="/blog">Blog</a>
      </li>
      <li>
        <a href="/about">About</a>
      </li>
      <li>
        <a href="/contact">Contact</a>
      </li>
    </ul>
  </nav>
</header>

<style>
  header {
    padding: 1rem;
    background: lightskyblue;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  ul {
    margin: 0;
    list-style-type: none;
    display: flex;
    gap: 1rem;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
</style>
```

svelte 파일은 원래 그냥 HTML 파일이거든요.

그래서 style 태그로 CSS 코드를 작성했습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhiHuTpEudT_0pPYfA1KLUytYNCBgkrzm88Kuon-KpbEznONXJyc7Zhm9421PvTqRIYj_1Uk2jFfbmzYfoNOJrBB9CfWTxgCAok93aOb8Db-SikRM_-NEGB57iFGxLaHrGtsnOYJzYNID9GF6L8iT0z4zs99XO1lm5TsaGl9RN4KHeGvUEoea7oa3Rn=s16000)

위와 같이 Header 부분이 CSS 스타일이 적용된 걸 볼 수 있습니다.

## Scoped Style
위 그림에서 보면 메인 화면의 kit.svelte.dev 링크가 밑줄이 그어져 있습니다.

분명히 Header.svelte 파일에서 a 태그에 대한 CSS 코드로 text-decoration이 none이었거든요.

왜냐하면 SvelteKit에서는 CSS Style은 scoped style이 됩니다.

즉, Header.svelte 파일에 작성한 CSS 코드는 Header.svelte 파일에만 적용되기 때문입니다.

이게 왜 중요하냐면 CSS 코드를 클래스로 작성하지 않아도 된다는 얘기입니다.

물론 긴 코드일 때는 클래스로 작성하는 게 필요하겠지만 위 Header.svelte 코드처럼 간단한 코드일 경우 CSS 클래스 없이 태그값에만 CSS 스타일을 적용했습니다.

정말 획기적인데요.

---
## Footer 컴포넌트 작성해 보기

여기서 직접 Header 컴포넌트처럼 Footer 컴포넌트도 작성해 보십시오.

```js
<footer>Copyright@2022, mycodings.fly.dev</footer>

<style>
  footer {
    padding: 1rem;
    font-weight: bold;
    display: flex;
    justify-content: center;
  }
</style>
```

```js
<!-- +layout.svelte -->
<script>
  import Header from "../lib/components/Header.svelte";
  import Footer from "$lib/components/Footer.svelte";
</script>

<Header />

<main>
  <slot />
</main>

<Footer />
```

+layout.svelte 파일에 Footer 컴포넌트를 삽입했습니다.

근데 Footer 컴포넌트를 import 하는 경로가 특이한데요.

$lib 로 시작했습니다.

SvelteKit에서는 $로 시작하면 경로가 /src 바로 밑이 되니 참고 바랍니다.

$lib는 /src/lib 와 같은 경로가 되는 겁니다.

---
## Global styles

글로벌 스타일은 어떻게 적용할까요?

답은 간단합니다.

그냥 CSS 파일을 루트 레이아웃 파일인 +layout.svelte에서 import하면 됩니다.

먼저, /src/lib/styles 폴더 밑에 style.css 파일을 아래와 같이 만들어 봅시다.

```js
/* style.css */
body {
  margin: 0;
  background: #eee;
  color: #333;
  font-family: sans-serif;
}

main {
  padding: 1rem;
  margin: 2rem auto;
  max-width: 40rem;
}
```

이제 이 파일은 루트 레이아웃인 +layout.svelte 파일에서 불러오면 끝납니다.

```js
<!-- +layout.svelte -->
<script>
  import Header from "../lib/components/Header.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import "$lib/styles/style.css";
</script>

<Header />

<main>
  <slot />
</main>

<Footer />
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEjA6iJlyn2OC8TQNoCqofHQ-EfaDCtannu7SmeqQkBs7JgTXpFmVRQEZ5QXdQnySojbn1qV_Qfypz9CrGNklZi9enF9djMgmGj5hgiuI0HGV1tD8bTPFCdUjSfoStQkt1yZ6PW0iuZtBaYYyPp76h-fxnVWOF0P9Z-dbK9lEQDVHUUHdQ2C9NgjKHPW=s16000)

좀 더 전체적인 페이지가 깔끔해졌습니다.

---
## Markdown 패키지 설치하기

React에서 마크다운 패키지로 유명한 게 바로 mdx 패키지인데요.

Svelte 버전도 있습니다.

바로 mdsvex인데요.

이걸 설치하고 기본 세팅을 작성해 보겠습니다.

```js
npm install -D mdsvex
```

참고로 SvelteKit에서는 패키지가 전부 devDependencies로 설정됩니다.

그래서 -D 옵션을 썼고요.

Svelte는 컴파일러라서 그런 겁니다.

실제 package.json 파일을 열어보시면 devDependencies만 있는 걸 확인할 수 있을 겁니다.

mdsvex를 사용하기 위해서 svelte.config.js 파일을 수정해야 하는데요.

```js
import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/kit/vite";
import { mdsvex } from "mdsvex";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  extensions: [".svelte", ".md"],

  preprocess: [
    vitePreprocess(),
    mdsvex({
      extensions: [".md"],
    }),
  ],

  kit: {
    adapter: adapter(),
  },
};

export default config;
```

위 코드를 보시면 .md 확장자도 바로 읽을 수 있게 지정했습니다.

실제 마크다운 파일이 제대로 작동되는지 한번 테스트 해 볼까요?

/src/routes/uses 폴더 밑에 +page.md 파일을 아래와 같이 만들어 봅시다.

```js
# Uses

**Here's some stuff I use**

- SvelteKit
- VS Code
- Emojis 😎
```

이제 개발 서버의 경로를 /uses로 들어가 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEhLiAwuZYHdxuiTBQskF0Q4sXKmJREi6my3ORsvFn5dOMaHTaoVK4RDOET0qPaWf-9MkagKnRqHtCKc1Aho9bpdQj7z4hNc57H9qweksL-i-xcCGobqwAzCucxY9RA-Uy7lzeZU_owVWXdPvbFv4y3X6lh-De8kzIDR7krfscOJzshUUnx1YH3_0wu6=s16000)

위와 같이 마크다운 파일이 제대로 보입니다.

실제 .md 파일이 .svelte 파일처럼 작동하니까요.

아래 코드처럼 .md 파일 안에서도 Svelte 컴포넌트를 import하여 작성할 수 있으니 참고 바랍니다.

```js
---
# frontmatter goes here
---
<script>
import SomeComponent from '$lib/components/SomeComponent.svelte'
</script>

# Markdown content here

<SomeComponent />

More markdown _here_!
```

위와 같은 코드가 되면 실제로 마크다운 파일에서 다른 마크다운 파일을 import 할 수도 있습니다.

대단하네요.

---
## 블로그 시스템 준비

블로그 시스템을 준비해야 하는데요.

우리가 위에서 만든 blog 폴더 밑에 블로그 글을 작성해서 넣을 건데요.

여기서 라우팅(경로) 부분이 걸리는데요.

FM대로 하자면 blog 폴더 밑에 또 폴더를 두어 그 밑에 +page.md 파일을 작성해야 하는데요.

blog 밑에 폴더가 여러 개 있고 또 그 밑에 똑같은 파일 이름인 +page.md 파일이 있다는 건 조금 비효율적입니다.

그래서 저는 이 방법을 쓰지 않고, SvelteKit의 강력한 기능인 다이내믹 라우팅 방식을 써 보겠습니다.

일단 blog 폴더 밑에 모든 마크다운 파일을 집어넣습니다.

마크다운 파일 이름은 글 제목이 될 수 있겠죠.

그리고 다이내믹 라우팅을 위한 `[slug]` 폴더와 그 밑에 +page.svelte 파일을 만들겠습니다.

일단 테스트를 위해 마크다운 파일 이름은 아래와 같이 간단하게 했습니다.

```js
📂 src
┗ 📂 routes
  ┗ 📂 blog
    ┣ 📜 +page.svelte
    ┣ 📜 +1.md
    ┣ 📜 +2.md
    ┣ 📜 +3.md
    ┗ 📂 [slug]
      ┗ 📜 +page.svelte
```

이렇게 하면 1.md 파일의 주소는 /blog/1 이 되고, 2.md 파일의 주소는 /blog/2 가 됩니다.

그러면 다이내믹 라우팅에서 slug 부분을 해결해 줘야 하는데요.

Next.js 에서처럼 브라켓을 폴더 이름으로 사용합니다.

그러면 브라켓 안에 있는 이름이 다이내믹 라우팅의 params가 됩니다.

---
## 서버 사이드에서 데이터 가져오기

이제 본격적인 다이내믹 라우팅을 살펴보겠습니다.

폴더 방식 라우팅에서 +page.svelte 파일은 화면에 보여주는 UI인데요.

그럼 +page.svelte 파일을 로드하기 전에 미리 로드하는 자바스크립트 로직이 있으면 좋을 텐데요.

그래서 SvelteKit에서는 +page.js 파일 이름이 존재합니다.

이 파일은 +page.svelte 파일과 쌍을 이루는데요.

```js
📂 src
┗ 📂 routes
  ┗ 📂 any-route
    ┣ 📜 +page.js -- Preloads data
    ┗ 📜 +page.svelte -- Renders the page
```

즉, +page.js 파일에서 서버 사이드 상에서 데이터를 가져오던가, 아니면 다른 로직을 수행하고 export하면 +page.svelte 컴포넌트에서 받아주는 방식입니다.

그러면 우리의 다이내믹 라우팅인 `[slug]` 라우팅을 위해 이 폴더 밑에 +page.ts 파일을 작성해 보겠습니다.

타입스크립트를 쓰신다면. ts 파일 이름으로 해도 됩니다.

```js
// src/routes/blog/[slug]/+page.ts
export async function load({ params }) {
    const post = await import(`../${params.slug}.md`);
    const { title, date } = post.metadata;
    const content = post.default;

    return {
        content,
        title,
        date
    }
}
```

SvelteKit 에서는 load 함수가 존재합니다.

이 함수가 바로 서버 사이드단에서 실행되는 함수인데요.

위 코드를 보시면 우리가 경로로 /blog/1 이라는 주소로 이동한다면 params.slug 가 바로 1이 됩니다.

위에서 보시면 간단히 import로 마크다운 파일을 post 라는 변수로 불러왔고, 그 post 변수의 metadata를 이용해서 우리가 원하는 값을 얻고,

최종적으로 필요한 것만 return 했습니다.

그러면 이 +page.ts 파일이 return 한 걸 받는 쪽은 +page.svelte 파일이 되겠죠.

```js
<!-- src/routes/blog/[slug]/+page.svelte -->
<script>
  export let data;
</script>

<article>
  <h1>{data.title}</h1>
  <p>Published: {data.date}</p>
  <svelte:component this={data.content} />
</article>
```

+page.svelte 파일은 `export let data;` 라고 간단히 지정해서 원하는 값을 가져왔습니다.

참고로 1.md 파일의 내용은 아래와 같습니다.

```js
---
title: Post One
date: "2021-12-14"
---

Hello, I am _Post One._

**Nice to meet you!**
```
그럼 /blog/1 이라는 주소로 이동했을 때 다이내믹 라우팅이 재개로 실행되었는지 그 결과를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEhDK6j1-wMXhIpVE5gnQOfAZyQZh48CYh2ZmzGVl-cUeZPsic24xpzIPO2ndnJI4QB3H8pXiVf-buafp6tU3tIycakAkN7Rp2y-RmD3dO4hZIMVTjexd9PcUbqlWu8pdv24FBxEb4d6uICjCKtqhvlzDdVESlVVktIfHK44YHSKuQy_i7JCsB-4ikSc=s16000)

위와 같이 아주 잘 작동하고 있네요.

지금까지 SvelteKit의 가장 기본이 되는 부분을 blog 시스템으로 알아봤는데요.

다음 시간에는 서버사이드 관련 내용을 더 공부해 보도록 하겠습니다.

그럼.
