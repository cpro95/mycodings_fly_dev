---
slug: 2024-03-25-tutorial-number-2-of-new-text-editor-framework-lexical-how-to-use-plugin
title: Lexical 강좌 2편. 플러그인 구현과 undo, redo 기능 추가하기
date: 2024-03-25 10:23:11.522000+00:00
summary: Draft.js를 대체하는 Lexical 강좌 2편. 플러그인 구현과 undo, redo 기능 추가하기
tags: ["lexical", "draft.js", "draftjs", "plugin", "undo", "redo"]
contributors: []
draft: false
---

안녕하세요?

오늘은 Lexical 강좌 2편을 이어가도록 하겠습니다.

전체 강좌 리스트입니다.

1. [Lexical 강좌 1편. 간단한 소개와 기본적인 구현](https://mycodings.fly.dev/blog/2024-03-24-tutorial-of-new-text-editor-framework-lexical)

2. [Lexical 강좌 2편. 플러그인 구현과 undo, redo 기능 추가하기](https://mycodings.fly.dev/blog/2024-03-25-tutorial-number-2-of-new-text-editor-framework-lexical-how-to-use-plugin)

3. [Lexical 강좌 3편. H1, H2 같은 Headings 구현](https://mycodings.fly.dev/blog/2024-03-25-tutorial-number-3-of-new-text-editor-framework-lexical-how-to-use-heading)

4. [Lexical 강좌 4편. 인용 블럭과 리스트 블럭 구현하기](https://mycodings.fly.dev/blog/2024-03-26-tutorial-number-4-of-new-text-editor-framework-lexical-how-to-use-quote-block-and-list-block)

5. [Lexical 강좌 5편. 코드 블럭 구현과 인라인 스타일, 마크다운과 같은 단축기 구현하기](https://mycodings.fly.dev/blog/2024-03-26-tutorial-number-5-of-new-text-editor-framework-lexical-how-to-use-code-block-and-inline-style-and-markdown-shortcut)

---

** 목 차 **
 
- [Lexical 강좌 2편. 플러그인 구현과 undo, redo 기능 추가하기](#lexical-강좌-2편-플러그인-구현과-undo-redo-기능-추가하기)
  - [플러그인 구현하기](#플러그인-구현하기)
  - [undo, redo 기능 추가하기](#undo-redo-기능-추가하기)

---

## 플러그인 구현하기

이제 플러그인을 구현해봅시다.

처음 구현할 플러그인은 '에디터가 마운트될 때 자동으로 포커스를 맞춰주는' 기능인데요.

아래와 같이 AutoFocusPlugin 컴포넌트를 만듭시다.

```js
//src/plugins/AutoFocusPlugin.tsx
import { FC, useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export const AutoFocusPlugin: FC = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.focus();
  }, [editor]);

  return null;
};
```

React 상의 Lexical 플러그인이라 함은, 보통 useLexicalComposerContext를 통해 'editor'라는 이름의 LexicalEditor 인스턴스를 가져와서, useEffect 안에서 작업을 수행하면 됩니다.

이런 방식의 컴포넌트를 플러그인이라고 말합니다.

특별히 DOM 요소를 렌더링할 필요가 없는 경우는 null을 반환하면 됩니다.

useLexicalComposerContext는 이름에서 알 수 있듯이 내부적으로 useContext를 사용하는데요.

해당 Provider는 LexicalComposer입니다.

그래서 아래와 같이 LexicalCoomposer 밑에 넣으시면 됩니다.

```js
// src/Editor.tsx
import { ComponentProps, FC } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import styles from "./Editor.module.scss";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { AutoFocusPlugin } from "./plugins/AutoFocusPlugin";

const initialConfig: ComponentProps<typeof LexicalComposer>["initialConfig"] = {
  namespace: "MyEditor",
  onError: (error) => console.error(error),
};

export const Editor: FC = () => {
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className={styles.editorContainer}>
        <RichTextPlugin
          contentEditable={
            <ContentEditable className={styles.contentEditable} />
          }
          placeholder={<div className={styles.placeholder}>글을 써주세요</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
      </div>
      <AutoFocusPlugin />
    </LexicalComposer>
  );
};
```

이렇게 하면 에디터가 마운트될 때 자동으로 포커스가 맞춰진 상태가 됩니다.

이제 조금 더 편리해졌네요.

---

## undo, redo 기능 추가하기

텍스트 에디터에 무언가를 입력하고 cmd + z를 눌러도 텍스트를 원래대로 되돌릴 수 없는데요.

바로 undo, redo 기능이 없다는 뜻입니다.

이 기능이 없으면 텍스트 에디터는 매우 불편한데요.

undo 기능은 사용자 인터페이스에서 자주 등장하는 만큼 구현이 어렵기로 유명합니다.

하지만 Lexical에서는 순식간에 가능합니다.

```js
// src/Editor.tsx
// 생략
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";

export const Editor: FC = () => {
  return (
    <LexicalComposer initialConfig={initialConfig}>
      {/*생략*/}
      <HistoryPlugin />
    </LexicalComposer>
  );
};
```

정말 간단하게 HistoryPlugin을 LexicalComposer의 자식 요소로 추가하기만 하면 undo, redo 기능을 구현할 수 있습니다.

그럼 여기서 Lexical 소스코드를 뒤져서 HistoryPlugin이 무엇을 하는지 살펴보겠습니다.

```js
//facebook/lexical/packages/lexical-react/src/LexicalHistoryPlugin.ts

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {HistoryState} from '@lexical/history';

import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

import {useHistory} from './shared/useHistory';

export {createEmptyHistoryState} from '@lexical/history';

export type {HistoryState};

export function HistoryPlugin({
  externalHistoryState,
}: {
  externalHistoryState?: HistoryState;
}): null {
  const [editor] = useLexicalComposerContext();

  useHistory(editor, externalHistoryState);

  return null;
}
```

위 코드를 잘 보시면 useLexicalComposerContext()를 사용하여 LexicalEditor 인스턴스를 가져오고 useHistory 훅에 전달합니다.

보아하니 구체적인 처리는 useHistory에 구현되어 있네요.

```js
// facebook/lexical/packages/lexical-react/src/shared/useHistory.ts

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {HistoryState} from '@lexical/history';
import type {LexicalEditor} from 'lexical';

import {createEmptyHistoryState, registerHistory} from '@lexical/history';
import {useEffect, useMemo} from 'react';

export function useHistory(
  editor: LexicalEditor,
  externalHistoryState?: HistoryState,
  delay = 1000,
): void {
  const historyState: HistoryState = useMemo(
    () => externalHistoryState || createEmptyHistoryState(),
    [externalHistoryState],
  );

  useEffect(() => {
    return registerHistory(editor, historyState, delay);
  }, [delay, editor, historyState]);
}
```
코드가 조금 어려운데요.

받은 LexicalEditor 인스턴스를 useEffect 안에서 registerHistory에 전달합니다.

쉽게 말해 이 registerHistory는 LexicalEditor에 대한 히스토리 관리와 키보드 단축키 기능을 등록하는 함수입니다.

자세히 보면 registerHistory의 반환값을 useEffect에서 return하고 있는 것을 알 수 있는데요.

registerHistory의 반환값은 함수이며, 또 useEffect의 클린업 함수로 사용함으로써, 언마운트 시에 에디터에서 해당 기능을 제거할 수 있습니다.

이처럼 Lexical에서는 registerXXX라는 이름의 함수로 기능을 추가하는 경우가 많습니다.

register라는 접두사는 LexicalEditor의 메서드 이름(registerCommand, registerUpdateListener 등)에서 유래했다고 합니다.

또한, 반환값은 반드시 () => void 함수를 반환하는데요.

이는 unregister 처리를 하는 함수이며, 그대로 useEffect의 클린업 함수로 사용할 수 있습니다.

사용자 정의 기능을 구현할 경우에도 공식 플러그인을 따라 register 접두사의 명명과 반환값을 unregister 함수로 하는 것을 규칙으로 하는 것이 좋습니다.

---

