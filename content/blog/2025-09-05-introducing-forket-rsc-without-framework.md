---
slug: 2025-09-05-introducing-forket-rsc-without-framework
title: 프레임워크 없는 React 서버 컴포넌트 라이브러리 Forket을 소개합니다
date: 2025-09-07 04:47:25.534000+00:00
summary: Next.js 없이 React 서버 컴포넌트를 사용하려는 한 해외 개발자의 도전을 소개합니다. Krasimir Tsonev가 만든 Forket이라는 도구가 어떻게 이 문제를 해결하는지 자세히 살펴보시죠.
tags: ["React", "서버 컴포넌트", "RSC", "Forket", "Krasimir Tsonev", "프레임워크 없이"]
contributors: []
draft: false
---

요즘 React 개발자들 사이에서 서버 컴포넌트는 정말 뜨거운 주제인데요.<br /><br />
하지만 대부분 Next.js의 전유물처럼 여겨지는 것이 현실입니다.<br /><br />
기존의 거대한 프로젝트를 단지 서버 컴포넌트 하나 때문에 Next.js로 옮기는 건 보통 일이 아니거든요.<br /><br />
그런데 최근 아주 흥미로운 글을 하나 발견해서 여러분께 소개해 드릴까 합니다.<br /><br />

원문 블로그 글: [React Server Components support without a framework](https://krasimirtsonev.com/blog/article/vanilla-react-server-components-with-no-framework)<br /><br />
Forket 깃허브 저장소: [https://github.com/krasimir/forket](https://github.com/krasimir/forket)<br /><br />

바로 'Krasimir Tsonev'라는 개발자가 프레임워크 없이 서버 컴포넌트를 구현한 여정을 담은 글인데요.<br /><br />
그는 이 문제를 해결하기 위해 'Forket'이라는 자신만의 도구를 직접 만들었습니다.<br /><br />
오늘은 그가 어떤 생각으로 이 문제에 접근했고, Forket은 어떤 원리로 동작하는지 그의 글을 바탕으로 자세히 파헤쳐 보겠습니다.<br /><br />

## 접근의 시작, 그의 '멘탈 모델'

Krasimir는 처음 이 문제를 접했을 때 Next.js 외의 다른 해결책들을 찾아봤다고 하는데요.<br /><br />
하지만 대부분 특정 도구에 종속적이거나 기능이 불완전했다고 합니다.<br /><br />
그는 여기서 문제의 본질이 '패턴은 있지만 제대로 된 구현체가 없는 것'에 있다고 진단했는데요.<br /><br />
마치 과거 Flux 패턴처럼, 아이디어는 좋지만 이걸 어떻게 기존 프로젝트에 녹여낼지에 대한 명확한 가이드가 없는 상황과 비슷하다고 봤습니다.<br /><br />
그래서 그는 특정 라이브러리나 번들러에 종속되지 않는 독립적인 도구를 직접 만들기로 결심하는데요.<br /><br />
그의 핵심 아이디어는 바로 '두 버전의 코드'를 만드는 것이었습니다.<br /><br />
서버 컴포넌트가 프론트와 백의 경계를 허무는 기술이지만, 실제로는 여전히 그 경계가 명확히 존재한다는 점에 주목한 건데요.<br /><br />
Vite나 Webpack 같은 기존 번들러가 작동하기 '전에' 먼저 소스코드를 '서버용'과 '클라이언트용'으로 분리하는 단계를 추가하는 것이 그의 접근 방식입니다.<br /><br />
이 덕분에 다른 도구의 복잡한 내부 로직을 건드리지 않고, 오직 서버와 클라이언트를 잇는 역할에만 집중할 수 있었다고 하네요.<br /><br />

![](https://storage.googleapis.com/lumina_ktcom/blog_articles/rsc/project_whitebg.png)

## Forket의 동작 원리 파헤치기

그렇다면 그가 만든 Forket은 구체적으로 어떻게 동작하는 걸까요.<br /><br />
Krasimir의 글에 따르면 몇 가지 핵심 단계로 나눌 수 있습니다.<br /><br />

### 1. 프로젝트의 청사진 그리기 컴포넌트 그래프

Forket이 가장 먼저 하는 일은 프로젝트의 전체 구조를 파악하는 것이라고 하는데요.<br /><br />
파일을 하나씩 읽어 AST(추상 구문 트리)로 변환하고, import 관계를 분석해 컴포넌트 의존성 그래프를 만듭니다.<br /><br />
이 과정에서 각 파일이 서버 전용인지(`(server)`), 클라이언트 전용인지(`(client)`) 역할이 부여되는데요.<br /><br />
그는 이 그래프를 콘솔에서 시각적으로 확인할 수 있도록 만드는 데 꽤 공을 들였다고 합니다.<br /><br />

<img src="https://storage.googleapis.com/lumina_ktcom/blog_articles/rsc/forket_cli_1.png" alt="Forket 컴포넌트 그래프" />

이미지를 보면 서버와 클라이언트 파일, 그리고 서버 액션의 위치까지 한눈에 파악할 수 있는데요.<br /><br />
이 청사진을 바탕으로 다음 단계 작업이 진행됩니다.<br /><br />

### 2. 서버와 클라이언트의 대화 준비

다음으로 Forket은 '클라이언트 경계'가 되는 지점들을 찾아내는데요.<br /><br />
'클라이언트 경계'란 서버 컴포넌트 트리 안에서 처음으로 등장하는 클라이언트 컴포넌트를 말합니다.<br /><br />
Forket은 이 경계에 있는 컴포넌트가 클라이언트에서 올바르게 렌더링(하이드레이션)될 수 있도록 코드를 변환하는데요.<br /><br />
props를 직렬화 가능한 문자열로 바꾸고, 서버에서 렌더링된 자식 컴포넌트들은 `<template>` 태그로 감싸 재사용할 수 있도록 준비해 둡니다.<br /><br />
그가 제시한 예시 코드를 보면 이해가 더 쉬운데요.<br /><br />
서버에서 note 데이터를 가져오고, comments 데이터는 Promise 형태로 클라이언트 컴포넌트에 넘겨주는 코드입니다.<br /><br />

```javascript
export default async function Page({ example }) {
  const note = await db.notes.get(42);
  const commentsPromise = db.comments.get(note.id);
  return (
    <div className="container">
      <div>
        {note.content}
        <Comments commentsPromise={commentsPromise} />
      </div>
    </div>
  );
}
```

Forket은 이 코드를 변환해서, 클라이언트 컴포넌트인 `Comments`를 하이드레이션에 필요한 정보가 담긴 `CommentsBoundary`라는 컴포넌트로 감싸주는데요.<br /><br />
결과적으로 브라우저는 이런 형태의 HTML을 받게 됩니다.<br /><br />

```html
<div>
  Note 42
  <template type="forket/start/f_43" data-c="Comments"></template>
  <p>Loading comments...</p>
  <template type="forket/end/f_43" data-c="Comments"></template>
  <script id="forket/init/f_43">
    $F_booter(..., "{\"commentsPromise\":\"$FLP_f_0\"}");
  </script>
</div>
```

`$F_booter` 함수로 전달된 직렬화된 props 문자열을 이용해, 클라이언트 측 자바스크립트가 Promise를 다시 만들어내고 컴포넌트를 완성시키는 구조입니다.<br /><br />

### 3. 서버 코드 보호하기 서버 액션 처리

클라이언트용 코드를 만들 때 그가 가장 신경 쓴 부분은 '서버 액션' 처리였다고 하는데요.<br /><br />
DB 접근 로직 같은 민감한 서버 코드가 클라이언트 번들에 포함되는 것을 막는 것이 핵심입니다.<br /><br />
Forket은 `"use server"` 지시어가 있는 파일에서 export된 함수들을 찾아내는데요.<br /><br />
클라이언트 코드에서는 이 함수들의 실제 구현부를 제거하고, 서버에 요청을 보내는 프록시 함수로 바꿔치기합니다.<br /><br />
예를 들어, `createNote`라는 서버 액션은 클라이언트에서 이렇게 변환되는데요.<br /><br />

```javascript
const createNote = function(...args) {
    return window.FSA_call("$FSA_createNote", "createNote")(...args);
};
```

실제 로직 대신 `FSA_call`이라는 전역 함수를 호출하게 되는데, 이 함수가 서버와 통신하여 원래의 함수 실행을 요청하는 역할을 합니다.<br /><br />

## Forket, 어떻게 사용할 수 있을까

그가 설명하는 사용법은 놀라울 정도로 간단한데요.<br /><br />
먼저 `forket.config.js` 파일에 소스코드 위치와 빌드 결과물 위치를 지정해 줍니다.<br /><br />

```javascript
// forket.config.js
const config = {
  sourceDir: path.join(__dirname, "src"),
  buildDir: path.join(__dirname, "build"),
}
```

그리고 빌드 시점에 터미널에서 `npx forket` 명령어를 실행하면, Forket이 앞서 설명한 변환 작업을 수행합니다.<br /><br />
런타임에는 Express 같은 HTTP 서버에 몇 줄의 코드만 추가하면 되는데요.<br /><br />

```javascript
Forket().then((forket) => {
  // 서버 액션 요청을 처리할 엔드포인트
  app.use("/@forket", forket.forketServerActions());

  // React 앱을 렌더링하고 스트리밍할 엔드포인트
  app.get("/", forket.serveApp({
    factory: (req) => <App request={req} />
  }));
});
```
마지막으로 프로젝트 루트에 `"use client"` 지시어가 포함된 파일을 하나 만들어주기만 하면 모든 준비가 끝난다고 합니다.<br /><br />

## 글을 마치며

지금까지 Krasimir Tsonev라는 개발자가 프레임워크 없이 React 서버 컴포넌트를 사용하기 위해 고군분투한 과정과 그 결과물인 'Forket'에 대해 알아봤는데요.<br /><br />
거대한 프레임워크가 제시하는 길을 따르는 대신, 문제의 본질을 파고들어 자신만의 해결책을 만들어내는 모습이 정말 인상 깊었습니다.<br /><br />
물론 아직은 실험적인 프로젝트일 수 있지만, React 생태계의 유연성과 확장 가능성을 다시 한번 생각하게 만드는 좋은 계기가 된 것 같습니다.<br /><br />

이 글은 Krasimir의 원문을 바탕으로 재구성한 것이니, 더 깊이 있는 내용이 궁금하시다면 아래 링크를 통해 직접 확인해 보시는 것을 추천합니다.<br /><br />
