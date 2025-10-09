---
slug: 2022-07-23-what-is-app-js-in-next-js
title: Next.js에서 _app.js 파일의 역할은?
date: 2022-07-23 04:46:25.468000+00:00
summary: Next.js에서 _app.js 파일의 역할은?
tags: ["next.js", "_app.js"]
contributors: []
draft: false
---

![nextjs](https://blogger.googleusercontent.com/img/a/AVvXsEgSSZAE7sO_Xxeg4L1Da35M2iAgmEcnsyML8l8ps-9Lv-J5abeVMsyeUqTvD2U5bK9MX8c2ar9m9SWBbowPD3Kb7EE9m4qtQmp4v6lF7LR6PSNNtm-DjLGdjaebdIyRWlTVlQdnmIunoWJxASQltkr6B2-OnUpL978ybjbXTVI8RTTBHd0JzDywDX-h)

안녕하세요?

이번 시간에는 Next.js에서 _app.js 파일이 뭔 일을 하는지 좀 세세하게 알아보도록 하겠습니다.

Next.js 파일에는 웹 애플리케이션 초기화에 필요한 기능을 하는 특별한 파일이 존재합니다.

_document.js, next.config.js, package.json 파일과 이번 시간에 알아볼 _app.js파일이 있습니다.

## Next.js에서 _app.js파일의 역할은?

Next.js에서 각각의 페이지가 초기화될 때 로딩되는 파일이 바로 _app.js 파일입니다.

_app.js 파일은 우리가 만든 모든 페이지가 초기화될 때 로딩되는 파일이기 때문에 전체 웹 애플리케이션에서 우리가 원하는 방식과 로직으로 페이지를 초기화할 수 있게 해 줍니다.

즉, 초기화 로직을 컨트롤할 수 있게 도와주는 파일이란 뜻이죠.

## _app.js 파일의 대표적인 사용 예

1. 각 페이지의 공통된 레이아웃 페이지 작성
2. 전체 앱에 글로벌 CSS 적용 가능

### 각 페이지의 공통된 레이아웃 페이지 작성

먼저, 공통된 레이아웃 페이지 적용에 대해 알아볼까요?

우리가 웹 페이지를 만들면 대체적으로 Header, Footer는 아마 똑같은 내용일 겁니다.

그래서 Header나 Footer모두 각각의 컴포넌트로 만들어 놓고 각 페이지에서 로딩하는 방식을 쓰는데요.

매번 로딩하기 귀찮기 때문에 _app.js 파일에 우리가 원하는 형식의 레이아웃을 만들 수 있습니다.

간단한 예를 들어 우리가 원하는 형식의 Layout 컴포넌트가 아래와 같이 있다고 칩시다.

```js
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav>
        <p>This is an example header!</p>
      </nav>

      <div>
        <main>{children}</main>
      </div>

      <footer>
        <p>This is an example footer!</p>
      </footer>
    </div>
  );
}
```

아주 간단한 Layout 컴포넌트인데요.

Header부분은 nav 태그로 만들었고 Footer부분은 footer 태그로 만들었습니다.

Header와 Footer는 전체 웹 애플리케이션에서 계속 똑같을 예정이기 때문에 이 레이아웃을 _app.js 파일에 적용해 모든 Next.js 페이지가 똑같은 Layout을 가질 수 있는 거죠.

이제 _app.js 파일에 위의 Layout 컴포넌트를 적용해 볼까요?

```js
import type { AppProps } from "next/app";
import Layout from "../components/layout";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
```

이제 모든 Next.js 페이지는 Layout 컴포넌트로 래핑 했기 때문에 똑같은 레이아웃을 가지게 될 겁니다.

이 방식이 바로 _app.js의 가장 기본적인 적용 예제입니다.

그리고 Next.js가 제공해 주는 `<Head>`태그를 이용해서 각 페이지의 title이나 meta description을 지정해 줄 수 있습니다.

바로 Layout 컴포넌트에 아래와 같이 추가하면 됩니다.

```js
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Head>
      <title>Hello World</title>
    </Head>
  );
}
```

### 전체 앱에 글로벌 CSS 적용 가능

만약에 우리가 전체 웹페이지에 적용할 CSS 파일이 하나라면 그 파일을 로드할 수 있는 가장 적합한 파일이 바로 _app.js 파일입니다.

물론 Bootstrap CSS 유틸리티를 쓴다고 했을 때도 Bootstrap을 로드할 수 있는 가장 적합한 파일이 바로 _app.js 파일입니다.

다음 예는 global.css 파일을 로드하는 예제입니다.

```js
// Global Styles
import "../styles/globals.css";

import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
```

이상으로 _app.js 파일에 대해 알아봤는데요.

다음 시간에는 _document.js 파일에 대해 상세하게 알아보도록 하겠습니다.

그럼.