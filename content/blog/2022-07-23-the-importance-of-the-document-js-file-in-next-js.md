---
slug: 2022-07-23-the-importance-of-the-document-js-file-in-next-js
title: Next.js에서 _document.js 파일의 중요성
date: 2022-07-23 06:03:36.822000+00:00
summary: Next.js에서 _document.js 파일의 중요성과 역할
tags: ["next.js", "_document.js", "react"]
contributors: []
draft: false
---

![nextjs](https://blogger.googleusercontent.com/img/a/AVvXsEgSSZAE7sO_Xxeg4L1Da35M2iAgmEcnsyML8l8ps-9Lv-J5abeVMsyeUqTvD2U5bK9MX8c2ar9m9SWBbowPD3Kb7EE9m4qtQmp4v6lF7LR6PSNNtm-DjLGdjaebdIyRWlTVlQdnmIunoWJxASQltkr6B2-OnUpL978ybjbXTVI8RTTBHd0JzDywDX-h)

안녕하세요?

지난 시간에는 Next.js에서 _app.js 파일의 역할에 대해 간략히 알아봤는데요.

오늘은 _document.js 파일에 대해 알이 보겠습니다.

_document.js 파일도 _app.js 파일처럼 Next.js 애플리케이션에서 각각의 페이지에 대한 글로벌한 초기화에 관여하는데요.

좀 더 정확하게 표현해 보자면,

_document.js 파일은 각 페이지가 초기화될 때 HTML 페이지 중 Document 부분에 대한 오버 라이딩을 제공해 줍니다.

특히, `<html>`과 `<body>` 태그에 대한 오버라이드를 제공해 줘서 우리가 원하는 방식으로 페이지를 제어할 수 있게 해 줍니다.

_document.js 파일은 _app.js 파일과 함께 /pages 폴더 밑에 위치해 있는데, Next.js의 기본 세팅에는 이 파일이 보이지 않습니다.

그래서 /pages 폴더 밑에 이 파일이 보이지 않으면 직접 _document.js 파일을 만들면 됩니다.

## _document.js 파일의 사용 예

1. HTML 태그에 lang 지정
2. Body 태그에 특정 className 지정


### HTML 태그에 lang 지정

웹페이지를 월드와이드 하게 만들려면 HTML 페이지의 기본 언어를 지정할 수 있습니다.

이 역할을 할 수 있는 곳이 바로 _document.js 파일인데요.

다음과 같이 하면 됩니다.

```js
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

위 코드를 보시면 기본 언어로 "en"을 지정했습니다.

### Body 태그에 특정 className 지정

두 번째 예는 `<body>` 태그에 특정 CSS className을 지정할 수 있습니다.

아래와 같이 하면 전체 웹페이지의 백그라운드 색을 지정할 수 있습니다.

```js
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head />
      <body className="bg-black">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

이상으로 Next.js에서 _document.js 파일의 역할에 대해 간단히 알아봤습니다.

그럼.
