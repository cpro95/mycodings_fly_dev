---
slug: 2025-01-20-rsc-tutorial-1-react-server-components-explained
title: RSC(리액트 서버 컴포넌트) 동작 원리부터 성능 최적화까지
date: 2025-01-20 11:54:22.968000+00:00
summary: React Server Comoponents 에 대해 심도 있게 공부해 봅시다.
tags: ["react", "next.js", "rsc", "react server components", "virtual dom", "server rendering"]
contributors: []
draft: false
---

안녕하세요?

React Server Components 이하 RSC는 단순히 서버 렌더링을 넘어서 React 생태계를 이끌 차세대 기술로 일컫어지고 있는데요.

RSC를 이용하면 마치 모든 코드가 한 곳에서 실행되는 것처럼 클라이언트 컴포넌트와 서버 컴포넌트를 코드 안에서 자유롭게 섞어서 사용할 수 있습니다.

하지만 새로운 기술에도 그에 대한 반대 급부가 따르는데요.

지금까지 논의된 RSC의 논쟁 중에 번들 크기 감소와는 반대로 대역폭이 늘어난다는 얘기가 있는데요.

오늘은 왜 이런 논쟁이 일어나는지 RSC에 대해 자세히 살펴보는 시간을 갖도록 하겠습니다.

이 글을 읽기 전에 제가 예전에 쓴 [React 작동 원리](https://mycodings.fly.dev/blog/2022-07-15-understanding-react-js)에 대해 먼저 읽어 보시는 걸 추천드립니다.

그럼 여기저기 공부해서 제가 알고 있는 RSC 작동 원리에 대해 자세히 알아보겠습니다.

---

** 목 차 **

- [DOM과 클라이언트 렌더링](#dom과-클라이언트-렌더링)
- [트리 재조정(Reconciliation)](#트리-재조정reconciliation)
- ["Virtual DOM"이라는 용어가 적절할까요?](#virtual-dom이라는-용어가-적절할까요)
- [DOM과 서버 렌더링](#dom과-서버-렌더링)
- [Flight(직렬화 형식)](#flight직렬화-형식)
  - [Isomorphic Components (동형 컴포넌트)](#isomorphic-components-동형-컴포넌트)
- [메타 프레임워크와 서버 렌더링](#메타-프레임워크와-서버-렌더링)
- [스트림, Suspense, 그리고 RSCs](#스트림-suspense-그리고-rscs)
- [React에 페이로드 제공하기](#react에-페이로드-제공하기)
- [순서가 뒤바뀐 스트리밍(Out-of-Order Streaming)](#순서가-뒤바뀐-스트리밍out-of-order-streaming)

---

## DOM과 클라이언트 렌더링

React를 공부하다 보면 "렌더링"이라는 용어를 많이 접하게 됩니다.

우리가 게임 프로그래밍할 때 렌더링과 비슷한 의미지만 React에서의 "렌더링"이라는 용어는 조금 독특하게 사용되어지는데요.

게임 상의 렌더링이 아니라 웹상에서의 렌더링에 대한 이해가 필요합니다.

브라우저가 페이지를 "렌더링"한다고 할 때는 DOM을 화면에 실제로 그리는 작업을 의미합니다.

즉, 크롬이나 Firefox 등 브라우저가 페이지를 "렌더링"한다는 의미는 서버로부터 얻은 HTML 파일을 분석(파싱)해서 body, div 태그와 같은 HTML tag 등과 color 값 같은 CSS 스타일을 웹 표준 규칙에 맞게 계산해서 화면에 픽셀로 그려주는 겁니다.

당연히 자바스크립트도 웹 표준 규칙에 맞게 실행되겠죠.

그래서 브라우저가 버튼 같은 UI를 렌더링하는 방식과 우리가 흔히 보는 윈도우 애플리케이션이 화면에 버튼을 렌더링하는 방식은 전혀 다릅니다.

윈도우 애플리케이션은 화면 클래스를 실제로 C++로 구현해서 화면에 뿌려주는 반면, 브라우저는 HTML에 있는 텍스트 값을 웹 표준 규칙에 맞게 브라우저에 내장된 표준 버튼으로 화면에 뿌려주게 됩니다.

대신 CSS라는 스타일을 적용해서 좀 더 멋지게 꾸며줄 뿐입니다.

좀 더 웹 표준에 맞는 말로 다시 하면, 브라우저는 [DOM(엘리멘트 트리)](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)과 [CSSOM(계산된 스타일 트리)](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model)를 가져와서 엘리먼트가 어떻게 배치되어야 하는지 계산한 다음, 화면에 적절한 픽셀을 칠하는 겁니다.

이제 브라우저의 "렌더링"과는 다르게 React는 "렌더링"이라는 같은 용어를 "DOM이 어떻게 보여야 하는지 계산하는 것"이라는 의미로 사용합니다.

우리가 React 코드에서 작성하는 컴포넌트는 함수형태인데요.

이 컴포넌트 함수가 반환하는 값이 바로 React에게 DOM이 어떻게 보여야 하는지를 알려주는 것입니다.

따라서 React 세계에서 "클라이언트 렌더링"이라고 말할 때는 컴포넌트 함수가 브라우저에서 실행되는 것을 의미합니다.

그러나 React 버전의 "렌더링"이 항상 실제 브라우저 렌더링으로 이어지는 것은 아닙니다.

왜냐하면 실제 브라우저상의 DOM이 이미 React가 생각하는 모습과 똑같을 수도 있기 때문입니다.

사실 React의 핵심 아키텍처(및 다른 모든 JS 프레임워크)의 중요한 점은 내부 코드가 DOM을 업데이트하는 횟수를 최대한 줄이는 데 있습니다.

---

## 트리 재조정(Reconciliation)

React 소스 코드 내부에는 'appendChild'와 같은 브라우저 DOM API 호출을 이용해서 클라이언트에서 DOM을 업데이트하는데요.

React는 트리 재조정(tree reconciliation) 및 diffing 작업을 통해 이러한 브라우저 DOM API를 언제 실행할지 결정합니다.

React는 현재 DOM이 어떻게 보이는지, 그리고 DOM이 어떻게 보여야 하는지를 Javascript 객체 트리 형태로 추적합니다.

여기서 각 노드를 Fiber라고 부릅니다.

React는 DOM이 앞으로 어떻게 보여야 하는지를 계산하고("Work-In-Progress"), JavaScript 객체 트리의 두 분기에서 현재 DOM이 어떻게 보이는지와 비교합니다("Current").

그런 다음 이 두 트리 사이의 차이를 재조정하여 현재 트리를 Work-In-Progress 트리로 변환하는 데 필요한 단계를 계산합니다.

이러한 단계를 "diff" 또는 "patch"라고 부릅니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhjqLs0Sk5i_m6aDvoLqBD2cuiBIL7WDkEsojKu9negvZsCXceMG3H6j49sI3rrRwlLuNfsFEQfXk51ryt_3fL91Bz2HxCIwp7HX07_6kl79MUmTDRXKm4hu_bo6uuyvNPanmfGu8pq1PtbI9jjz9iO5txsijZuIpfk4EgwEUVHjiIoGPvwa5MAZ001XYU)

위 그림처럼 일단 JavaScript 객체에 대한 계산이 끝나면, 실제 DOM에서 어떤 단계를 수행해야 하는지 알 수 있습니다.

여기서 중요한 점은 DOM 업데이트 횟수를 최소화하는데 있습니다.

왜냐하면 DOM 업데이트는 통상 비용이 많이 든다고 한데요, 바로 브라우저가 다시 렌더링(엘리멘트 레이아웃 및 픽셀 페인팅)하도록 만들기 때문입니다.

클라이언트에서 DOM을 업데이트하면 UI를 업데이트할 때 상태를 유지하는 장점이 있습니다.

예를 들어 사용자가 Form에 정보를 입력하는 동안 React는 어떤 이벤트에 따라 UI를 업데이트할 수 있고, 텍스트는 폼 안에 그대로 남아있게되죠.(페이지가 새로고침되는 것과는 다릅니다).

따라서 React는 클라이언트에서 DOM을 업데이트하는 데 집중하면서 최대한 효율적으로 작업을 수행하는데요, 이를 위해 먼저 가짜 DOM을 대상으로 작업을 수행합니다.

JavaScript로 만들어진 DOM 구조의 가짜 복사본을 일반적으로 우리가 익히 들어서 알고 있는 "Virtual DOM"이라고 부릅니다.

---

## "Virtual DOM"이라는 용어가 적절할까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEgyhj24zdtagtKZDZgk0iXzB7vIqeVDfQJNy0pUFwxNGKPew4zz3wLq38nNtKuSSFUGLtQGYaad7YcrpyYpVdQs4XDQTye3AVVNErpxIZ5VPPBNO49MHRk7Ye57HuPNGt1I9FfZpPMiwftCe4FYChWmgDp_0Vk5cAVfoap0gIuCAUTeO4Ye13nJFl3F0Tw)

브라우저가 "렌더링"하는 거는 실제로 브라우저에 그리는 거라면, React가 "렌더링"이라고 부르는 것은 Virtual DOM을 계산하는 겁니다.

즉, 실제 DOM이 어떻게 보여야 하는지 결정하기 위해 React 코드내에서 우리가 정의한 함수 즉, 컴포넌트를 실행하는 것이죠.

이 모든 거는 JavaScript 내부에서 일어나며, 실제로는 재조정이 완료될 때까지 실제 브라우저 DOM에는 전혀 영향을 미치지 않습니다.

여기서 우리가 알아야 할게 바로 React가 "렌더링"이라는 용어를 독자적으로 사용한다는 점입니다.

왜냐하면 이 점을 이해하는 것이 앞으로 RSC를 정확하게 이해하는데 중요하기 때문입니다.

RSC를 이해하려면 웹 개발에서 일반적으로 사용하는 클라이언트 및 서버 렌더링의 의미와 Virtual DOM 생성에 초점을 맞추는 React의 렌더링 의미 사이의 차이점을 명확히 이해해야 합니다.

중요한 점은 React에서 "렌더링"이라고 말해도 실제로 눈에 보이는 변화가 항상 있는 건 아니라는 겁니다.

이러한 다양한 "렌더링" 의미를 계속 염두에 두면서 진행해 보겠습니다.

일반적인 (React 외) 정의를 "클래식"이라고 지칭하자면 아래와 같이 render의 뜻을 두가지로 정의 할 수 있을 겁니다.

1.  **(클래식 클라이언트 사이드)** DOM과 CSSOM을 가져와서 레이아웃을 계산하고 화면에 픽셀을 그리는 것.

2.  **(React 클라이언트 사이드)** Virtual DOM을 빌드하고 업데이트하기 위해 함수 컴포넌트를 실행하는 것.

---

## DOM과 서버 렌더링

통상 서버에서 HTML을 생성하는 것을 클래식하게 "서버 사이드 렌더링" 또는 "서버 렌더링"이라고 부릅니다.

역사적으로 서버 렌더링은 서버에서 "HTML 문자열 생성"을 의미했는데요.

여기에는 몇 가지 장점이 있습니다.

브라우저는 HTML을 DOM으로 매우 빠르게 변환합니다.

그 결과 HTML은 브라우저에서 빠르게 렌더링되는 거죠.

반면, JavaScript를 통한 DOM 업데이트는 상대적으로 느립니다.

또 다른 서버 렌더링 이점에 있어 서버는 데이터베이스나 파일 저장소에 더 가까이 있기 때문에 해당 작업이 더 효율적이고 빠릅니다.

단점은 클라이언트가 페이지 새로고침을 통해 HTML을 다시 요청할 수 있지만, 상태가 손실된다는 점입니다.

균형적으로 얘기해보면, 먼저 서버 렌더링된 HTML은 빠르게 렌더링되고, 이와 병행해서 클라이언트 사이드에서 JavaScript를 통한 DOM 업데이트를 통해 페이지 상태를 유지하는게 최선의 방법으로 생각할 수 있는데요.

React가 이 두 가지를 모두 수행하는 것은 새로운 일이 아닙니다.

React는 클라이언트 사이드 JavaScript를 통해 DOM 업데이트를 수행하지만, 오래 전부터 React 컴포넌트를 서버 렌더링(SSR)할 수도 있었습니다.

React를 이용한 서버 렌더링(SSR)에 있어 서버(NodeJS 등 사용)는 컴포넌트를 실행하고 HTML 문자열을 생성하여 클라이언트로 보내지만, 여기에는 큰 단점이 있습니다.

동일한 컴포넌트에 대한 모든 JavaScript 코드도 클라이언트로 전송되어 실행되어야 한다는 것이죠.

왜 그럴까요?

해당 함수 컴포넌트가 리턴하는 것을 기반으로 Virtual DOM이 구축되어야 하기 때문입니다.

왜냐하면 Virtual DOM이 실제 DOM을 "hydration"하는 데 사용되기 때문입니다.

예를 들어 input 버튼을 클릭했을 때 어떤 함수 컴포넌트의 클릭 이벤트가 실행되어야 하는지 알 수 있게 해주는 것이죠.

React가 작동하려면 클라이언트에 DOM과 Virtual DOM 트리가 모두 존재해야 한다는 것을 기억하시면 쉽게 이해하실 수 있을겁니다.

따라서 React에서 SSR(서버 사이드 렌더링)은 함수를 두 번 실행하는 것을 의미합니다.
(HTML을 만들기 위해 서버에서 한 번, Virtual DOM을 만들기 위해 클라이언트에서 한 번).

SSR과 hydration 프로세스를 시각화하면 다음과 같습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEh7lASeKvq_dyyoLa0KVBDxOMloWdNkJ9dYS2cdG_bCAa3fFxIEn_wXd28kxs_6CeZkNt9LL5DcSkeT8c6rnOgdI0PEBR6mDV4GyZC7kKhUmKVrqdT1LRu8VDASjDn7kP-rkt37_APDki5laMU5re5qlPs0x3tZt1UebINHaP40n1jX65Pij6VYVTwswS8)

여기서 React Server Components(RSCs)가 등장합니다.

RSCs는 서버에서 실행되는 React 컴포넌트와 클라이언트에서 실행되는 React 컴포넌트를 섞어서 사용할 수 있는 기능을 추가하면서도, 서버 컴포넌트의 JavaScript 코드를 전송하고 다시 실행할 필요가 없도록 합니다.

또한 브라우저에서 DOM 업데이트를 시작하기 전에 서버에서 HTML을 초기 렌더링할 수 있는 가능성도 제공합니다.

어떻게 가능할까요?

이제부터 조금 더 깊게 알아보겠습니다.

그전에 먼저 용어 사전 항목을 업데이트해 볼까요?


1.  **(클래식 클라이언트 사이드)** DOM과 CSSOM을 가져와서 레이아웃을 계산하고 화면에 픽셀을 그리는 것.

2.  **(React 클라이언트 사이드)** Virtual DOM을 빌드하고 업데이트하기 위해 함수 컴포넌트를 실행하는 것.

3.  **(클래식 서버 사이드)** DOM을 빌드하기 위해 클라이언트로 보낼 HTML을 생성하는 것.

4.  **(React 서버 사이드 SSR)** DOM을 빌드하기 위해 클라이언트로 보낼 HTML을 생성하기 위해 함수 컴포넌트를 실행하는 것.

---

## Flight(직렬화 형식)

> React가 작동하려면 브라우저 메모리에 DOM과 Virtual DOM이라는 전체 트리가 모두 있어야 합니다.

위 문구는 React를 배우는데 있어 가장 중요한 문구인데요.

그렇다면 React Server Components는 JavaScript 코드를 다운로드하여 클라이언트에서 실행할 필요 없이 서버에서만 실행되는 것으로 어떻게 가능한 걸까요?

다시 말해, React는 서버에서 실행되는 함수로 정의된 부분에 대해 브라우저에서 Virtual DOM을 어떻게 구축할까요?

좀 더 자세히 알아보겠습니다.

서버에서 함수 컴포넌트 실행을 지원하고, 클라이언트에서 해당 결과로부터 Virtual DOM을 빌드하기 위해 React는 서버에서 실행된 함수에서 반환된 React 엘리먼트 트리를 직렬화(serialize)하는 기능을 추가했습니다.

자바스크립트의 JSON.stringify 함수와 JSON.parse 함수를 생각하면 쉬운데요.

직렬화(Serialization) 및 역직렬화(deserialization)는 종종 "컴퓨터 메모리의 객체를 문자열로 변환"하고 "문자열을 다시 컴퓨터 메모리의 객체로 변환"하는 것을 의미합니다.

이 경우 컴포넌트 함수의 결과를 직렬화하여 클라이언트로 보내야 합니다.

React 코드베이스 내부에서 이 직렬화 형식을 "flight"라고 부르고, 전송되는 데이터의 총합을 "RSC Payload"라고 부릅니다.

Next.js로 간단한 앱을 만들어서 가장 기본적인 RSC부터 시작해 보겠습니다.

당연히 Next.js 14 앱 라우터를 사용하는 아래 컴포넌트는 서버에서 실행될 겁니다.

```javascript
export default function Home() {
  return (
    <main>
      <h1>mycodings.fly.dev</h1>
    </main>
  );
}
```

### Isomorphic Components (동형 컴포넌트)

컴포넌트를 서버 또는 클라이언트에서 모두 실행할 수 있는 경우 "동형(isomorphic)"이라고 부릅니다.

아까 작성한 Home이라는 컴포넌트 함수는 서버적인 작업(예: 데이터베이스에 직접 연결하거나 서버에서 파일 읽기)을 수행하지 않으므로 클라이언트에서도 대신 실행될 수도 있고, React는 컴포넌트 함수 실행 결과를 기반으로 Virtual DOM을 직접 빌드할 수도 있습니다.

함수가 동형(isomorphic)이면 공유할 수 있습니다.

서버 컴포넌트와 클라이언트 컴포넌트 모두 해당 함수를 가져와서 사용할 수 있습니다.

이 함수를 클라이언트로 보내서 실행하는 것을 방지하려면 결과를 직렬화해야 합니다.

다시 한번 말하자면, React 코드베이스 내부에서 이 직렬화 형식을 "flight"라고 부르고, 전송되는 데이터의 총합을 "RSC Payload"라고 부릅니다.

아까 만든 함수 결과는 다음과 같이 직렬화될 수 있습니다.

```
"[\"$\",\"main\",null,{\"children\":[\"$\",\"h1\",null,{\"children\":\"mycodings.fly.dev\"},\"$c\"]},\"$c\"]"
```

[Alvar Lagerlöf 님의 RSC 파서](https://github.com/alvarlagerlof/rsc-parser)를 이용해서 좀 더 자세히 살펴보도록 하겠습니다.

```json
{
  "type": "main",
  "key": null,
  "props": {
    "children": {
    "type": "h1",
    "key": null,
    "props": {
      "children": "mycodings.fly.dev"
    }
}
```

어떤가요?

Virtual DOM의 구조가 보이시나요?

main 및 h1 엘리먼트와 일반 텍스트 노드가 여기 있습니다.

특히 React에 내재된 표준 "children" prop과 같이 props로 전달되는 내용을 볼 수도 있습니다.

여기서는 단순화했지만, 형식에는 이보다 더 많은 내용이 있고, 메타 프레임워크는 자체 목적을 위해 더 많은 것을 추가할 수 있습니다.

예를 들어, 트리에 배치되는 항목의 종류에 대한 식별자, "flight의 'f:'와 같은 것"이 있을 수 있습니다.

하지만 단순화된 예시로도 충분히 이해할 수 있습니다.

React는 직렬화 형식을 제공하지만, 메타 프레임워크(이 경우 NextJS)는 페이로드가 생성되어 클라이언트로 전송되도록 보장하는 작업을 수행해야 합니다.

예를 들어, NextJS에는 `generateDynamicRSCPayload`라는 함수가 코드베이스에 있습니다.

메타 프레임워크는 페이로드가 생성되어 클라이언트로 전송되도록 보장합니다.

페이로드 덕분에 클라이언트의 React는 정확한 Virtual DOM을 구축하고 정상적인 트리 재조정(reconciliation) 작업을 수행할 수 있게 됩니다.

---

## 메타 프레임워크와 서버 렌더링

앞서 RSCs에서 HTML 렌더링은 "가능성(possibility)"이라고 말씀드렸는데요.

그 이유는 선택 사항이기 때문입니다.

즉, 메타 프레임워크가 그렇게 할지 여부에 달려 있습니다.

하지만 그렇게 하는 것이 합리적입니다.

인지 성능이 중요한 지표라고 앞에서 말씀드렸는데요.

코드를 서버에서 이미 실행 중이고 HTML을 스트리밍 방식으로 다시 보낼 수 있다면, 그렇게 해야 합니다.

왜냐하면 브라우저가 해당 HTML을 빠르게 렌더링하여 사용자에게 더 빠른 인지 경험을 제공하기 때문입니다.

메타 프레임워크가 느리다고 인식되면 아무도 사용하지 않을 건데요.

따라서 RSCs를 구현하는 React 메타 프레임워크(여기서는 Next.js)는 클래식 서버 렌더링과 React 스타일 서버 렌더링이라는 두 가지 종류의 서버 렌더링을 모두 수행해야 합니다.

클래식 서버 렌더링(HTML 생성)은 페이지가 빠르게 렌더링(브라우저에 의해 그려짐)되도록 하고, React 스타일 서버 렌더링(RSC 페이로드)은 향후 상태 업데이트를 위한 Virtual DOM을 제공합니다.

따라서 실제로 RSC는 "double data problem(데이터 중복 문제)"이라고 불리는 현상을 초래할 겁니다.

서버에서 동일한 정보를 두 가지 다른 형식, 즉 HTML과 페이로드로 동시에 보내게 되는 것이죠.

DOM을 즉시 빌드하는 데 필요한 정보(HTML)와 Virtual DOM을 빌드하는 데 필요한 정보(페이로드)를 모두 보내는 겁니다.

그림으로 표시하면 아래와 같습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhwB3AyLYjumiZ3I9auP3hDsijfat-xDtNwkZYMi1D4mIBMn4HiYEEA-haClGIIISPLaKgv2dkfDV4iY1ljr0NbvKMTIq4qXS_XMaVn4_FiEOvkOZuxYen0i7zzK29a0LMg4nvKr0LuRwwtkYwDvh6b6VfvMFLAb4OdOVTTRpSoJfYl9DCLA4eCPtF1FDo)

Next.js는 아래와 같은 HTML을 반환하고, 브라우저는 이를 사용하여 DOM을 빌드합니다.

```html
<main>
  <h1>mycodings.fly.dev</h1>
</main>
```

그리고 React가 Virtual DOM을 빌드하는 데 사용하는 페이로드는 다음과 같습니다.

```json
{
  "type": "main",
  "key": null,
  "props": {
    "children": {
    "type": "h1",
    "key": null,
    "props": {
      "children": "mycodings.fly.dev"
    }
}
```

전송되는 HTML 덕분에 페이지가 브라우저에서 빠르게 렌더링될 수 있습니다.

그래서 사용자는 즉시 무언가를 보게 되는 거죠.

전송되는 페이로드는 React가 페이지를 인터랙티브(상호 작용)하게 만드는 작업을 완료할 수 있도록 해줍니다.

HTML과 JSON 형식의 페이로드는 서로 다른 형식이므로 데이터 중복과 관련 대역폭에 눈에 띄는 영향을 미칠 수 있습니다.

좀 더 어려운 말로 추상화에는 비용이 따릅다는 겁니다.

여기서 비용은 동일한 정보를 두 번 보내는 것이죠.

여기까지 이해했다면 이제 "렌더링"에 대한 5가지 정의를 모두 갖게 되는 겁니다!

1.  **(클래식 클라이언트 사이드)** DOM과 CSSOM을 가져와서 레이아웃을 계산하고 화면에 픽셀을 그리는 것.

2.  **(React 클라이언트 사이드)** Virtual DOM을 빌드하고 업데이트하기 위해 함수 컴포넌트를 실행하는 것.

3.  **(클래식 서버 사이드)** DOM을 빌드하기 위해 클라이언트로 보낼 HTML을 생성하는 것.

4.  **(React 서버 사이드 SSR)** DOM을 빌드하기 위해 클라이언트로 보낼 HTML을 생성하기 위해 함수 컴포넌트를 실행하는 것.

5.  **(React 서버 사이드 RSC)** Virtual DOM을 빌드하고 업데이트하기 위해 클라이언트로 보낼 flight (페이로드) 데이터를 생성하기 위해 함수 컴포넌트를 실행하는 것.

여기서 잠깐!

React 정의 간의 유사점이 보이시나요?

React 렌더링은 항상 "함수 컴포넌트 실행"을 의미하며, 클라이언트 컴포넌트와 서버 컴포넌트는 모두 Virtual DOM을 빌드하고 업데이트하는 데 필요한 것을 제공합니다.

---

## 스트림, Suspense, 그리고 RSCs

우리가 웹 애플리케이션(웹 페이지)을 만들 때 컨텐츠 외에 성능을 가장 중요하게 생각하는데요.

웹 페이지 성능에는 실제 성능과 유저가 느끼는 성능 즉, 인지 성능이라는 두 가지 종류가 있습니다.

HTTP와 브라우저는 오랫동안 스트리밍을 지원하여 두 종류의 성능을 모두 향상시켜 왔습니다.

NodeJS의 Stream API와 브라우저의 Streams API(특히 브라우저의 ReadableStream 객체)와 같은 것들이죠.

React 및 Next.js를 비롯해서 RSCs를 지원하려는 모든 메타 프레임워크는 이러한 핵심 기술을 활용하여 HTML과 페이로드 데이터를 모두 스트리밍합니다.

스트리밍은 실제로 작은 양, 청크라고 한데요. 이 청크를 한 번에 보내는 것을 의미합니다.

클라이언트는 들어오는 청크 데이터를 처리할 수 있습니다.

따라서 스트림을 사용하면 "무엇이 전송되었는지"가 아니라 "시간 경과에 따라 무엇이 전송되었는지"가 중요해집니다.

브라우저는 네트워크를 통해 HTML 스트리밍을 처리하도록 설계되었습니다.

HTML 스트림이 들어오면 페이지를 렌더링(레이아웃 및 페인트)합니다.

마찬가지로 React는 나중에 RSC 페이로드 데이터로 확인되는 Promise를 허용하는데요.

예를 들어 Next.js는 클라이언트에서 ReadableStream을 설정하고 서버에서 스트림을 읽어와서 들어오는 대로 React에 제공합니다.

서버 렌더링에 대한 React의 전체 접근 방식은 필요한 콘텐츠를 스트리밍하는 것을 중심으로 합니다.

실제로 Flight 형식 자체에는 아직 완료되지 않은 항목에 대한 마커가 포함되어 있습니다.

Promise 및 lazy loading과 같은 것들이죠.

예를 들어 서버 컴포넌트를 async로 설정하고 타이머를 await한다고 가정해 보겠습니다.

```javascript
// components/Delayed.js

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default async function DelayedMessage() {
    await delay(5000); // 5초 지연

    return (
        <p>This message was loaded after a 5 second delay!</p>
    );
}
```

위와 같이 delay 함수를 이용해서 5초 지연하는 DelayedMessage 컴포넌트를 만들었습니다.

이제 이 DelayedMessage 컴포넌트를 아래와 같이 Home 컴포넌트에 넣어보겠습니다.

```javascript
// page.js
import DelayedMessage from "./components/DelayedMessage";

export default function Home() {
  return (
    <main>
      <h1>mycodings.fly.dev</h1>
      <DelayedMessage />
    </main>
  );
}
```

위와 같이 코드가 되어 있을 때 DelayedMessage 컴포넌트의 async 함수는 Promise를 반환합니다.

따라서 결과 페이로드는 다음과 같이 보일 겁니다.

```json
{
  "type": "main",
  "key": null,
  "props": {
   "children": [
    {
     "type": "h1",
     "key": null,
     "props": {
      "children": "mycodings.fly.dev"
     }
    },
    {
     "$$type": "reference",
     "id": "d",
     "identifier": "L",
     "type": "Lazy node"
    }
   ]
  }
}
```

`DelayedMessage` 컴포넌트가 있어야 할 자리에 콘텐츠가 나중에 나타날 자리를 표시하는 특수 "L" 식별자인 "Lazy node" 참조로 표시된 것을 보십시요.

그리고 이 코드를 실행하면 지연된 메시지만이 아니라 전체 페이지가 5초 후에 로드되는 것을 알 수 있을 겁니다.

그 이유는 React가 Promise와 lazy loading을 클라이언트를 위해 설계된 특수 Suspense 기능을 사용하여 처리하기 때문입니다.

컴포넌트를 업데이트하여 Suspense를 사용하면 다음과 같이 됩니다.

```javascript
import DelayedMessage from "./components/DelayedMessage";
import { Suspense } from "react";

export default function Home() {
  return (
    <main>
      <h1>mycodings.fly.dev</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <DelayedMessage />
      </Suspense>
    </main>
  );
}
```

이제 페이지를 실행하면 대신 fallback이 먼저 표시되고 5초 후에 지연된 메시지가 표시될 겁니다.

하지만 이 컴포넌트는 여전히 서버에서 실행된다는 점을 주목해야하는데요.

서버에서 Suspense를 선택하려면 어떻게 해야 할까요?

그럴 필요가 없습니다.

함수에서 반환된 페이로드가 클라이언트에서 처리될 때 경계를 포함하는 Virtual DOM을 구축합니다.

페이로드는 다음과 같이 보입니다.

```json
{
  "type": "main",
  "key": null,
  "props": {
   "children": [
    {
     "type": "h1",
     "key": null,
     "props": {
      "children": "mycodings.fly.dev"
     }
    },
    {
     "type": {
      "$$type": "reference",
      "id": "d",
      "identifier": "",
      "type": "Reference"
     },
     "key": null,
     "props": {
      "fallback": {
       "type": "p",
       "key": null,
       "props": {
        "children": "Loading..."
       }
      },
      "children": {
       "$$type": "reference",
       "id": "e",
       "identifier": "L",
       "type": "Lazy node"
      }
     }
    }
  }
}
```

폴백(prop으로)과 Promise가 확인된 후에 로드되는 것("Lazy node", 이 경우 `DelayedMessage`)이 모두 있다는 것을 알 수 있습니다.

페이로드는 청크 단위로 스트리밍될 뿐만 아니라 Promise가 나중에 확인될 Virtual DOM의 위치를 참조합니다.

이러한 방식으로 React와 RSCs를 지원하는 메타 프레임워크는 실제 성능과 인지 성능을 모두 향상시키려고 노력하여 사용자가 가능한 한 빨리 UI를 볼 수 있도록 합니다.

하지만 flight 데이터는 실제로 어디로 스트리밍될까요?

React 코드베이스 어딘가에 있어야 할 텐데요.

---

## React에 페이로드 제공하기

RSCs를 지원하기 위해 React는 Flight 형식(문자열)을 받아 React Elements로 변환하는 기능을 `parseModelString`과 같은 함수에 추가했습니다.

RSCs를 지원하는 메타 프레임워크는 이러한 React API를 실행하고 적절한 데이터를 보내는 역할을 합니다.

예를 들어 Next.js는 앱에 몇 가지 추가 래핑 컴포넌트를 추가하고, 여기서 페이로드 데이터 스트림을 전달합니다.

다음과 같이 보입니다.

```javascript
<ServerRoot>
  <AppRouter
      actionQueue={actionQueue}
      globalErrorComponentAndStyles={initialRSCPayload.G}
      assetPrefix={initialRSCPayload.p}
  />
</ServerRoot>
```

Next.js는 `ServerRoot`라는 컴포넌트를 컴포넌트 트리에서 `AppRouter` 위에 추가합니다.

거기에서 RSC 페이로드 데이터를 `AppRouter`로 스트리밍합니다.

궁극적으로 해당 데이터는 Flight 형식을 수락하기 위한 React의 Promise 기반 API로 스트리밍됩니다.

따라서 React는 페이로드에서 Virtual DOM을 빌드하기 위한 API를 제공하고, Next.js (또는 RSC를 지원하는 모든 메타 프레임워크)는 서버에서 컴포넌트가 실행된 후 해당 데이터를 React에 전달하는 자체 메커니즘을 가지고 있습니다.

---

## 순서가 뒤바뀐 스트리밍(Out-of-Order Streaming)

스트리밍 이야기에는 더 많은 내용이 있는데요.

컴포넌트마다 실행 완료 시점이 다를 수 있습니다.

페이로드 청크가 스트리밍될 때 React는 Virtual DOM 및 DOM에서 어디에 배치해야 하는지 어떻게 알 수 있을까요?

`DelayedMessage` 컴포넌트를 사용하는 DOM을 다시 살펴보면 처음에는 다음과 같이 보입니다.

```html
<main>
  <h1>mycodings.fly.dev</h1>
  <!--$?-->
  <template id="B:0"></template>
  <p>Loading...</p>
  <!--/$-->
</main>
```

React는 Promise Suspense가 확인을 기다리는 동안 콘텐츠를 놓아야 할 위치를 나타내기 위해 특수 ID와 HTML 주석이 있는 템플릿과 같은 자리 표시자를 남겨둡니다.

fallback은 DOM에 있지만, Promise가 확인되면 일부 새로운 JavaScript가 페이지로 스트리밍됩니다.

```javascript
$RC = function(b, c, e) {
  c = document.getElementById(c);
  c.parentNode.removeChild(c);
  var a = document.getElementById(b);
  if (a) {
      b = a.previousSibling;
      if (e)
          b.data = "$!",
          a.setAttribute("data-dgst", e);
      else {
          e = b.parentNode;
          a = b.nextSibling;
          var f = 0;
          do {
              if (a && 8 === a.nodeType) {
                  var d = a.data;
                  if ("/$" === d)
                      if (0 === f)
                          break;
                      else
                          f--;
                  else
                      "$" !== d && "$?" !== d && "$!" !== d || f++
              }
              d = a.nextSibling;
              e.removeChild(a);
              a = d
          } while (a);
          for (; c.firstChild; )
              e.insertBefore(c.firstChild, a);
          b.data = "$"
      }
      b._reactRetry && b._reactRetry()
  }
}
;
$RC("B:0", "S:0")
```

이 코드는 Promise가 확인된 후 생성된 DOM의 새로운 조각을 자리 표시자가 남겨진 올바른 위치에 삽입하고, 자리 표시자와 fallback을 제거합니다.

이 DOM 조작 코드가 실행된 후 DOM은 다음과 같이 보입니다.

```html
<main>
  <h1>mycodings.fly.dev</h1>
  <!--$-->
  <p>This message was loaded after a 5 second delay!</p>
  <!--/$-->
</main>
```

이것을 out-of-order 스트리밍이라고 부르는데요.

스트리밍된 내용을 가져와서 먼저 완료되는 컴포넌트보다 예상되는 위치가 앞서더라도 Virtual DOM/DOM 트리의 올바른 예상 위치에 삽입하는 것을 의미합니다.

이러한 방식으로 특정 컴포넌트가 다른 컴포넌트보다 실행하는 데 시간이 더 오래 걸리더라도 다른 컴포넌트의 결과로 UI가 업데이트될 때까지 기다릴 필요가 없습니다.

하지만 지금까지는 서버 컴포넌트에 대해서만 이야기했는데요.

개발자들이 수년간 작성해 온 컴포넌트는 어떻게 될까요?

브라우저에서 실행되는 함수인 클라이언트 컴포넌트는요?

답변은 RSC 이야기에서 숨겨진 영웅인 번들러를 소개합니다.

다음 시간에 계속 이어서 알아보겠습니다.
