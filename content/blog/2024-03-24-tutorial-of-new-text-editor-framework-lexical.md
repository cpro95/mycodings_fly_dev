---
slug: 2024-03-24-tutorial-of-new-text-editor-framework-lexical
title: Lexical 강좌 1편. 간단한 소개와 기본적인 구현
date: 2024-03-24 12:23:11.522000+00:00
summary: Draft.js를 대체하는 Lexical 강좌 1편. 간단한 소개와 기본적인 구현
tags: ["lexical", "draft.js", "draftjs"]
contributors: []
draft: false
---

안녕하세요? 

Facebook에서 만든 Draft.js라는 자바스크립트 프레임워크를 소개한 적이 있는데요.

[Draft.js 사용법 - React 위지위그(WYSIWYG) 에디터 만들기](https://mycodings.fly.dev/blog/2023-12-17-understanding-draftjs-in-a-short-way)

Meta에서 더 이상 Draft.js를 개발하지 않고 있고 새로운 텍스트 에디터 프레임워크를 내놓았는데요.

오늘 기준으로 버전은 `0.14.2`입니다.

바로 [lexical](https://lexical.dev/) 인데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhPH0S9w7mFdYQXxqDoq-2g2hwkIjncBV5xy9XF3Tq_rMO94lEEEG9hKNIQYNtDZ0gksrJEpdA60XhkUWTLCdg9dSB5-omQRG4R1QBZcMk9rDb3teMPP87DaihtXBOHFiy65umjRG8PEWk8Xr752lzeYCYLrqC0Qnxq24x8yJtAo8twAcbYtHLOv1TSAyg)

공식 홈페이지에 있는 로그를 보면 알 수 있듯이 텍스트 에디터를 만들 수 있게 하는 프레임워크입니다.

그럼 본격적으로 Lexical 강좌에 들어가겠습니다.

전체 강좌 리스트입니다.

1. [Lexical 강좌 1편. 간단한 소개와 기본적인 구현](https://mycodings.fly.dev/blog/2024-03-24-tutorial-of-new-text-editor-framework-lexical)

2. [Lexical 강좌 2편. 플러그인 구현과 undo, redo 기능 추가하기](https://mycodings.fly.dev/blog/2024-03-25-tutorial-number-2-of-new-text-editor-framework-lexical-how-to-use-plugin)

3. [Lexical 강좌 3편. H1, H2 같은 Headings 구현](https://mycodings.fly.dev/blog/2024-03-25-tutorial-number-3-of-new-text-editor-framework-lexical-how-to-use-heading)

4. [Lexical 강좌 4편. 인용 블럭과 리스트 블럭 구현하기](https://mycodings.fly.dev/blog/2024-03-26-tutorial-number-4-of-new-text-editor-framework-lexical-how-to-use-quote-block-and-list-block)

5. [Lexical 강좌 5편. 코드 블럭 구현과 인라인 스타일, 마크다운과 같은 단축기 구현하기](https://mycodings.fly.dev/blog/2024-03-26-tutorial-number-5-of-new-text-editor-framework-lexical-how-to-use-code-block-and-inline-style-and-markdown-shortcut)

---

** 목 차 **

- [Lexical 강좌 1편. 간단한 소개와 기본적인 구현](#lexical-강좌-1편-간단한-소개와-기본적인-구현)
  - [Lexical이란?](#lexical이란)
    - [1. *텍스트 에디터를 만들기 위한 프레임워크*](#1-텍스트-에디터를-만들기-위한-프레임워크)
    - [2. *프레임워크에 구애받지 않음*](#2-프레임워크에-구애받지-않음)
    - [3. *협업 편집 기능*](#3-협업-편집-기능)
  - [Lexical의 설계방식](#lexical의-설계방식)
    - [단방향 데이터 바인딩](#단방향-데이터-바인딩)
    - [EditorState의 내부 구조](#editorstate의-내부-구조)
      - [1. Node](#1-node)
      - [2. Selection](#2-selection)
    - [Commands](#commands)
    - [Node Transforms](#node-transforms)
    - [$ prefixed functions](#-prefixed-functions)
  - [Lexical을 이용해서 실제로 Rich-Text Editor를 만들기](#lexical을-이용해서-실제로-rich-text-editor를-만들기)
  - [플레이스홀더의 위치를 변경하기](#플레이스홀더의-위치를-변경하기)

---

## Lexical이란?

### 1. *텍스트 에디터를 만들기 위한 프레임워크*

다른 리치 텍스트 에디터 라이브러리와 달리, 텍스트 에디터를 만들기 위한 프레임워크입니다.

따라서 최소 구성으로 사용하더라도 contentEditable 속성을 가진 div만 화면에 표시되며, 외관은 아무것도 추가되지 않습니다.

도구 버튼이나 에디터의 스타일링 등은 Lexical을 기반으로 직접 만들어야 합니다.

이 부분은 Draft.js 때부터 변하지 않았습니다.

만약 당장 완성된 외관의 리치 텍스트 에디터가 필요하다면, 다른 텍스트 에디터 라이브러리를 고려하거나, Lexical 기반으로 개발된 라이브러리가 나올 때까지 기다려야 할 것입니다.

### 2. *프레임워크에 구애받지 않음*

Lexical은 특정 뷰 라이브러리나 프레임워크에 의존하지 않습니다.

Meta에서 만들었기 때문에 React 전용일 것이라고 생각할 수 있지만, Vue나 VanillaJS에서도 사용할 수 있습니다.

이 점은 React 전용 프레임워크였던 Draft.js와의 큰 차이점입니다.

### 3. *협업 편집 기능*

Lexical을 사용하면 협업 편집이 가능한 텍스트 에디터를 개발할 수 있습니다.

문서에서는 '만들 수 있게 될 것'이라고만 언급하고 있으며, 구체적인 개념 설명이나 샘플 코드는 없습니다(작성 시점 기준).

그러나 모노레포에는 `@lexical/yjs`라는 패키지가 포함되어 있어, Yjs를 사용한다는 것을 시사하고 있습니다.

Yjs는 협업 편집을 위한 데이터 구조를 제공하는 라이브러리입니다.

Lexical을 사용하여 협업 편집 에디터를 개발할 계획이라면, 미리 숙지해 두는 것이 좋을 것입니다.

## Lexical의 설계방식

이제 Lexical의 설계방식에 대해 알아 봅시다.

### 단방향 데이터 바인딩

Lexical의 라이프사이클은 크게 세 가지 개념으로 나뉩니다.

1. EditorState
2. Editor
3. DOM(contentEditable)

EditorState는 에디터의 상태를 유지하는 불변 모델입니다.

불변이지만 Draft.js와 달리 immutable.js는 사용되지 않습니다.

EditorState는 편집 중인 컨텐츠 데이터와 Selection(문자 선택이나 커서 위치)을 관리합니다.

Editor는 Lexical의 핵심 API로, 본체를 의미합니다.

EditorState를 내부적으로 유지하며, 현재의 EditorState와 새로운 EditorState를 비교하여 DOM을 업데이트하는 Reconciler를 가지고 있습니다.

사용자는 contentEditable 속성을 가진 DOM에서 키보드 입력을 통해 에디터를 조작하지만, 내부적으로는 EditorState의 새로운 인스턴스가 생성되어 Editor에 전달되면서 DOM의 업데이트가 이루어집니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiKN1y-ROWj5CpMxh3kTQT7f0WUxD1WSOl6IQ0HuaKWhF8hMl3_JGSff3rudGEoonbV_TdJKGeFyxsJpne9H9eTJX5DVdId-x8g7YX9LurbKaw3uOjEc8YDTb67l1Wo5FjE7Y5MCS3NU0nSK7oorneajVtVTc7vy1GmHRWN0XU19dsNR4hkazpn2Tcmpts)

이는 우리가 잘 알고 있는 React의 DOM 업데이트 흐름과 유사합니다.

React에서는 State에서 가상 DOM을 구성하여 React에 전달하면, 가장 효율적인 절차로 실제 DOM을 업데이트해 줍니다.

Lexical은 EditorState의 차이점을 바탕으로 DOM 업데이트를 최적의 방법으로 수행해 줌으로써, contentEditable 속성을 가진 DOM을 다루는 어려움을 대부분 해소해 줍니다.

문서에서는 DOM이 아닌 EditorState가 the source of truth(신뢰할 수 있는 유일한 정보원)라고 명시하고 있습니다.

참고로, Draft.js에도 EditorState라는 이름의 모델 클래스가 존재합니다.

마찬가지로, 편집 중인 컨텐츠와 Selection을 관리하지만, Draft.js와 Lexical은 호환되지 않습니다.

Lexical은 Draft.js의 반성을 바탕으로 개발이 진행되고 있을 것이라고 생각됩니다만, 별개의 것임을 인지해야 합니다.

Draft.js에서 Lexical로의 이전을 위한 가이드라인을 언젠가 작성할 것이라고 언급되어 있지만, Draft.js를 매우 가볍게 사용하지 않는 이상 쉽지 않을 것으로 보입니다.

### EditorState의 내부 구조

EditorState에 대해 더 깊이 파고들어 보겠습니다.

EditorState는 내부적으로 두 가지 데이터를 가지고 있습니다:

1. Node 트리
2. Editor selection

EditorState는 클래스이지만, JSON으로 직렬화할 수 있습니다.

반대로, JSON에서 EditorState를 완벽하게 복원할 수도 있습니다.

#### 1. Node

편집 중인 데이터는 Node라는 단위로 트리 형태로 관리됩니다.

예를 들어 사용자가 'H1 블록'을 에디터에 추가하면, HeadingNode가 EditorState에 삽입되고, 그 자식 요소로 TextNode가 삽입됩니다.

DOM과 대응하는 모델이므로, HTML에 익숙하다면 직관적입니다.

구현 측면에서 이야기하자면, LexicalNode라는 베이스 클래스가 있고, 그것을 상속하여 구체적인 클래스를 생성합니다.

내장된 Node가 여러 개 있지만, 사용자 정의 구현도 가능합니다.

주의할 점은, EditorState가 JSON 직렬화 가능해야 하므로, Node도 직렬화 가능해야 한다는 것입니다.

(클래스이므로 사용자 정의 속성을 가질 수 있지만, Map이나 Set 등으로 가지면 안 됩니다).

콘텐츠에 대해 어떤 뷰를 그릴지도 Node가 결정합니다.

뷰는 document.createElement()로 생성하는 것이 기본이지만, React 컴포넌트로도 그릴 수 있습니다.

---

#### 2. Selection

> *에디터의 선택 상태를 나타내는 모델*

Selection은 에디터의 선택 상태를 나타내는 모델입니다.

선택 상태뿐만 아니라, 커서(편집 영역에서 깜빡이는 세로 막대) 상태도 Selection으로 관리됩니다.

에디터 상에서 문자를 선택할 때만 인라인 스타일을 전환하는 도구 버튼 UI를 표시하는 기능을 구현할 때, Selection을 읽어 표시 여부를 결정할 수 있습니다.

Selection에는 여러 종류가 있으며, RangeSelection, NodeSelection, GridSelection 등이 있습니다.

텍스트 수준에서 선택할 때는 RangeSelection이 사용되고, Node 수준에서 선택할 때는 NodeSelection이 사용됩니다.

그러나 GridSelection에 대해서는 문서가 완비되어 있지 않아 현재로서는 불분명합니다.

에디터에 포커스가 없는 경우, Selection은 null이 됩니다.

---

### Commands

> *사용자의 모든 조작을 Command 디스패치로 변환*

사용자에 의한 모든 조작은 Command의 디스패치로 변환됩니다.

특정 Command에 대해 미리 실행할 처리를 Editor에 등록해 두고, Editor가 Command를 받으면 그 처리(대부분은 EditorState의 업데이트)를 수행합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjBVUCuCkw-nESMXc_Uciy_Au0YHeBibQvCVVlJ-tuOkRJa4VAsf3bXHrHX-sQTQlF0AOFit6CZdB7lPh5wxfhxN0CUDNhlZb6eCCGcjFO1Gp6rsVlq9AeAjgZXS1K-bPMsbSJzUn44EqD2eUgwXduY_kxkZ6qwri9Bi13ocnNS-32Nvo6rNADc9U2k_6U)

이 흐름은 어딘가에서 본 것 같은데요.

바로 Meta가 제안하는 Flux의 흐름입니다.

Lexical의 맥락에서는 Command라고 불리지만, Flux의 Action으로 볼 수 있습니다.

미리 등록해 둔 처리는 reducer에 해당합니다.

Action이 디스패치되면 reducer가 상태를 업데이트하는 Flux의 흐름을 의식한 Command의 흐름입니다.

Flux와 마찬가지로, Command를 디스패치할 때 페이로드를 부여할 수도 있습니다.

예를 들어, 에디터에 텍스트 색상을 변경하는 UI를 탑재하고 싶다면, TEXT_COLOR_COMMAND과 함께 어떤 색상으로 할지의 정보를 함께 디스패치합니다.

위의 설명이 단방향 데이터 바인딩으로 보이지 않을 수도 있지만, EditorState의 업데이트 처리를 Editor에 등록하는 것뿐이며, Command가 Editor에 어떤 작용을 하는 것은 아닙니다. 

따라서 처리의 흐름은 여전히 EditorState --> Editor --> DOM --> EditorState의 루프입니다.

---

### Node Transforms

> *Node 단위로 변환을 가하는 처리를 Editor에 미리 등록*

Node 단위로 변환을 가하는 처리인 Node Transform을 Editor에 미리 등록할 수 있습니다.

EditorState가 변경되어 DOM에 적용되기 전에 Node Transform을 통해 EditorState가 다시 작성됩니다.

한 번의 EditorState 변경으로 여러 transform이 작용할 수 있습니다.

그러나 얼마나 많은 transform이 발행되든, 최종적으로 이루어지는 DOM 업데이트는 한 번뿐입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEj-a-2QVji7SvWQDMQfEZLt-gKYbctL_N1jQR9qblwzb1npt9x3tWcfk0TjQtYLCato2hw48KHIOYWD0HBIfKbvUBs8uRkx4NTUAI4p_-GEHAHHR-W0h4_rKvC870uz3_61v3nhL0HBXz34AHl_dOWu1s8WgmY9YyBiLgnYKCEoVMoPmCEJ6ZBTtlNh59c)

위 그림은 여러 transform이 병렬로 실행되어 한 번의 DOM 업데이트로 통합되는 이미지입니다.

예를 들어, Twitter의 트윗 입력란에서 "@"로 시작하는 문자열은 멘션 대상으로서 파란색으로 장식됩니다.

그 기능을 구현할 때 Node Transforms를 사용하여 입력에 따라 Node를 교체함으로써 실현할 수 있습니다.

---

### $ prefixed functions

> *Lexical 패키지에서 export되는 $로 시작하는 함수들은 특별한 장소에서만 사용 가능*

Lexical 패키지에서 export되는 $로 시작하는 이름의 함수들은 특정한 장소에서만 사용할 수 있습니다.

그 장소는 다음 메소드의 콜백 함수 내부입니다.

- editor.update(() => {})
- editorState.read(() => {})

문서에서는 'React Hooks가 컴포넌트 내부에서만 사용할 수 있는 것과 비슷하다'고 설명하고 있습니다.

그러나 $ 접두사 함수는 최상위 레벨일 필요도 없고, 순서의 고정을 보장할 필요도 없어 React Hooks에 비해 제약이 훨씬 적습니다.

---

## Lexical을 이용해서 실제로 Rich-Text Editor를 만들기

이제 본격적으로 React를 통해 Lexical을 이용한 Rich-Text Editor를 만들어 보겠습니다.

```sh
npm create vite@latest lexical-test -- --template react-ts

cd lexical-test

npm install

npm install lexical @lexical/react sass react-icons
```

지금 이 글을 쓰고 있는 시점의 버전은 아래와 같습니다.

```js
  "@lexical/react": "^0.14.2",
  "lexical": "^0.14.2",
```

Lexical은 react 패키지를 제공해 줍니다.

스타일을 위한 sass 설치, 그리고 아이콘을 위한 react-icons까지 일괄 설치했습니다.

그리고 App.tsx 파일의 내용을 다 지우고,

src 폴더 밑에 아래와 같이 Editor.tsx 파일을 만듭시다.

```js
import { ComponentProps, FC } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";

const initialConfig: ComponentProps<typeof LexicalComposer>["initialConfig"] = {
  namespace: "MyEditor",
  onError: (error) => console.error(error),
};

export const Editor: FC = () => {
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin
        contentEditable={<ContentEditable />}
        placeholder={<div>글을 써주세요</div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
    </LexicalComposer>
  );
};
```

위 코드 설명을 조금 이어가겠습니다.

LexicalComposer는 Lexical의 핵심 API 중 하나인 LexicalEditor 인스턴스를 createEditor를 통해 생성하고, 이를 Context.Provider를 통해 전달하는 역할을 합니다.

생성되는 JSX는 Context.Provider만 포함하며, 구체적인 DOM 요소는 포함하지 않는데요.

initialConfig props는 필수이므로 객체형식으로 전달해야 합니다.

RichTextPlugin은 이름에서 알 수 있듯이 리치 텍스트 에디터 기능을 설정해 주는 플러그인입니다.

반면에 @lexical/react/LexicalPlainTextPlugin이라는 모듈도 존재하는데요.

말 그대로 더 적은 기능을 가진 에디터입니다.

contenteditable 속성을 가진 div 요소를 생성하기 위한 ContentEditable 컴포넌트도 공식적으로 제공됩니다.

RichTextPlugin의 contentEditable props를 통해 삽입할 수 있습니다.

한편, RichTextPlugin의 placeholder props에 전달하기 위한 요소는 컴포넌트로 제공되지 않고 위와 같이 직접 만들면 됩니다.

그리고 ErrorBoundary도 LexicalErrorBoundary처럼 제공해 주고 있습니다.

이제 App.tsx에서 Editor 컴포넌트 삽입하면 됩니다.

```js
// src/App.tsx

import "./App.css";
import { Editor } from "./Editor";

function App() {
  return (
    <div className="App">
      <Editor />
    </div>
  );
}

export default App;
```

이제 개발 서버를 시작하면, 다음과 같이 실행될 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjvRfxcJ47r1qpFhh9z5YtuX_kbpI-Q3TOtpqYI80CDbUx9X-V8O-7n978-EqFHr8ME7B3o0RTLG10BD0XhGi31zZL1P9w6mP9Y-c4Jgl7DBdAE5jkfGDYML_zv5EYjxKG4B0aszn34EBZx9OknZDS2uVU_-UpKZEJ6MnXbqOKN_GLbfPhuTCe0VpZkTco)

CSS 스타일이 적용되지 않아 편집기가 보이지 않는데요.

"글을 써주세요" 위로 마우스를 위치시키고 클릭하면 아래와 같이 글을 쓸 수 있는 textarea 같은게 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEi-UEZ8DFPlUE454K8s0gD4cs2qPKN_5ywqQEq9aiYJ1KG5yFHxsm5ahurLA0g09tyayhbfuRyszfuirrNgroq_bU_leD2v5x9ON2m6krQ-2ATfFmLPVG5ZJpXBO5MygjZO4tMhSycjC5rYsfCejMyp5X7eFZVBQh8H6DudGsDyH0ggmS74XxZ6HbPEKgY)

이제 Lexical의 가장 기본적인 구현이 끝났는데요.

textarea에서 크롬의 검사 기능을 이용해서 소스코드를 보면 다음과 같습니다.

```html
<div class="App">
  <div contenteditable="true" role="textbox" spellcheck="true" data-lexical-editor="true" style="user-select: text; white-space: pre-wrap; word-break: break-word;">
    <p dir="ltr">
      <span data-lexical-text="true">테스트</span>
    </p>
  </div>
</div>
```

뭔가 복잡하네요.

위 코드에서는 RichTextPlugin을 사용하고 있지만, 데코레이션 버튼 없어 HTML의 가장 기본적인 textarea와 별반 차이가 없네요.

여기를 기점으로 좀 더 Rich-Text한 에디터로 좀 더 발전해 나가 보도록 하겠습니다.

---

## 플레이스홀더의 위치를 변경하기

기본 설정대로라면 플레이스홀더가 에디터 하단에 표시되는데요.

플레이스홀더를 에디터 상단에, 좀 더 연한 회색으로 표시하고 싶다면 CSS를 적용해야 합니다.

그 전에 리셋 CSS를 적용합시다.

```sh
npm install ress
```

```js
// src/main.tsx

import React from "react";
import ReactDOM from "react-dom/client";
import "ress";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

저는 보통 ress라는 리셋 CSS를 사용합니다.

ress 패키지를 설치하고 `src/main.tsx`에서 import합니다.

이어서 Editor.module.scss를 준비하면 됩니다.

```js
// src/Editor.tsx
import { ComponentProps, FC } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import styles from "./Editor.module.scss";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";

const initialConfig: ComponentProps<typeof LexicalComposer>["initialConfig"] = {
  namespace: "MyEditor",
  onError: (error) => console.error(error),
};

export const Editor: FC = () => {
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className={styles.editorContainer}>
        <RichTextPlugin
          contentEditable={<ContentEditable className={styles.contentEditable} />}
          placeholder={<div className={styles.placeholder}>글을 써주세요</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
      </div>
    </LexicalComposer>
  );
};
```

LexicalComposer는 DOM 요소를 렌더링하지 않으므로, RichTextPlugin을 div로 감싸줘야합니다.

또한, ContentEditable과 placeholder에 클래스 이름을 부여했는데요.

이 클래스들에 대한 CSS를 마저 작성해 봅시다.

`src/Editor.module.scss` 파일입니다.

```css
.editorContainer {
  position: relative;
  padding: 24px;
  min-height: 240px;
}

.contentEditable {
  outline: none;
}

.placeholder {
  position: absolute;
  color: #888888;
  top: 24px;
  left: 24px;
  pointer-events: none;
  user-select: none;
}
```

position 속성을 사용하여 placeholder를 에디터 본체인 contentEditable 위에 겹치도록 했고, pointer-events와 user-select를 none으로 설정했습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjM4RRjomW4P3dNRbnAWrU_I94EYJ_nxf6TQycEq3PH39llKn1m3o25s3Z0hTmDzM8dQ693wsp7juIJ_BzEmDIAilGEVrBXH2FBN3oIuZakl0AjzWHKX3nc4GTX3dZ-4ruyup5J6pFWJd5MhtI2-LU9VnTDFjYswGVRAu-muwfFZkEnrrT1FRtl8_bp_3Q)

위 그림을 보시면 CSS가 적용되어 플레이스홀더가 정확히 에디터 위에 겹쳐 보이고 있습니다.

이제 조금 멋지게 보이네요.

---


