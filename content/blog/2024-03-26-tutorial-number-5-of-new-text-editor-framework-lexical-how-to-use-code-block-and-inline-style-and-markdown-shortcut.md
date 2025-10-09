---
slug: 2024-03-26-tutorial-number-5-of-new-text-editor-framework-lexical-how-to-use-code-block-and-inline-style-and-markdown-shortcut
title: Lexical 강좌 5편. 코드 블럭 구현과 인라인 스타일, 마크다운과 같은 단축기 구현하기
date: 2024-03-26 13:07:55.004000+00:00
summary: Draft.js를 대체하는 Lexical 강좌 5편. 코드 블럭 구현과 인라인 스타일, 마크다운과 같은 단축기 구현하기
tags: ["lexical", "code block", "inline style", "markdown shortcut"]
contributors: []
draft: false
---

안녕하세요?

오늘은 Lexical 강좌 5편을 이어가도록 하겠습니다.

전체 강좌 리스트입니다. 

1. [Lexical 강좌 1편. 간단한 소개와 기본적인 구현](https://mycodings.fly.dev/blog/2024-03-24-tutorial-of-new-text-editor-framework-lexical)

2. [Lexical 강좌 2편. 플러그인 구현과 undo, redo 기능 추가하기](https://mycodings.fly.dev/blog/2024-03-25-tutorial-number-2-of-new-text-editor-framework-lexical-how-to-use-plugin)

3. [Lexical 강좌 3편. H1, H2 같은 Headings 구현](https://mycodings.fly.dev/blog/2024-03-25-tutorial-number-3-of-new-text-editor-framework-lexical-how-to-use-heading)

4. [Lexical 강좌 4편. 인용 블럭과 리스트 블럭 구현하기](https://mycodings.fly.dev/blog/2024-03-26-tutorial-number-4-of-new-text-editor-framework-lexical-how-to-use-quote-block-and-list-block)

5. [Lexical 강좌 5편. 코드 블럭 구현과 인라인 스타일, 마크다운과 같은 단축기 구현하기](https://mycodings.fly.dev/blog/2024-03-26-tutorial-number-5-of-new-text-editor-framework-lexical-how-to-use-code-block-and-inline-style-and-markdown-shortcut)

---

** 목 차 **

- [Lexical 강좌 5편. 코드 블럭 구현과 인라인 스타일, 마크다운과 같은 단축기 구현하기](#lexical-강좌-5편-코드-블럭-구현과-인라인-스타일-마크다운과-같은-단축기-구현하기)
  - [코드 블록 구현하기](#코드-블록-구현하기)
  - [인라인 스타일 기능 구현](#인라인-스타일-기능-구현)
  - [마크다운과 같은 단축키 도입](#마크다운과-같은-단축키-도입)

---

## 코드 블록 구현하기

이제 조금은 어렵게 느껴질 수 있는 코드 입력 기능을 구현해봅시다.

여러분들이 블로그를 작성할 때 반드시 필요한 것이 코드 블록입니다.

지정된 프로그래밍 언어로 Syntax Highlight가 가능하고, 코드 에디터처럼 등폭 글꼴로 표시되는 편집 영역을 구현해보겠습니다.

항상 그렇듯이, Node 클래스의 등록부터 시작합니다.

CodeNode, CodeHighlightNode 두 가지 Node가 `@lexical/code`에 준비되어 있습니다.

```js
// src/nodes.ts

import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { Klass, LexicalNode } from "lexical";

export const nodes: Klass<LexicalNode>[] = [
  HeadingNode,
  QuoteNode,
  ListItemNode,
  ListNode,
  CodeNode,
  CodeHighlightNode,
];
```

Lexical은 List의 복잡한 로직을 공식 플러그인으로 준비해주었듯이, 코드 블록에 대해서도 로직을 만들어뒀는데요.

하지만, 어째서인지 ListPlugin처럼 React 컴포넌트로 만들어주지는 않았기 때문에 직접 만들 필요가 있습니다.

```js
// src/plugins/CodeHighlightPlugin.tsx

import { FC, useEffect } from "react";
import { registerCodeHighlighting } from "@lexical/code";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export const CodeHighlightPlugin: FC = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return registerCodeHighlighting(editor);
  }, [editor]);

  return null;
};
```

registerCodeHighlighting은 구문 강조를 위한 로직을 등록하기 위한 함수입니다.

내부적으로는 Prism.js가 사용되고 있습니다.

registerXXX이므로 반환값은 unregister 함수이며, 그대로 useEffect의 클린업에 사용할 수 있습니다.

물론, CodeHighlightPlugin도 LexicalComposer의 자식 컴포넌트에 넣으면 됩니다.

```js
// src/Editor.tsx

// 생략

import { CodeHighlightPlugin } from "./plugins/CodeHighlightPlugin";

export const Editor: FC = () => {
  return (
    <LexicalComposer initialConfig={initialConfig}>
      {/*생략*/}
      <CodeHighlightPlugin />
    </LexicalComposer>
  );
};
```

이어서 툴바에 버튼을 추가하는 작업을 해보겠습니다.

블록 타입의 종류는 "code"로 합니다.

```js
// src/plugins/ToolbarPlugin.tsx

const SupportedBlockType = {
  // 생략
  code: "Code Block",
} as const;
```

이제 현재 커서 위치의 블록을 코드 블록으로 변환하는 함수와, 그것을 호출하는 버튼을 준비해야 하는데요.

감사하게도 인용 블록에서 했던 방식과 완전히 같은 형태입니다.

`$createCodeNode`는 `@lexical/code` 패키지에서 import할 수 있습니다.

```js
// src/plugins/ToolbarPlugin.tsx

import {
  MdChecklist,
  MdCode,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatQuote,
} from "react-icons/md";

import { $createCodeNode } from "@lexical/code";

export const ToolbarPlugin: FC = () => {
  // 생략

  const formatCode = useCallback(() => {
    if (blockType !== "code") {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createCodeNode());
        }
      });
    }
  }, [blockType, editor]);

  // 생략

  return (
    <div className={styles.toolbar}>
      {/*생략*/}
      <button
        type="button"
        role="checkbox"
        title={SupportedBlockType["code"]}
        aria-label={SupportedBlockType["code"]}
        aria-checked={blockType === "code"}
        onClick={formatCode}
      >
        <MdCode />
      </button>
    </div>
  );
};
```

그리고 다음으로 필요한게 렌더링되는 코드 블록의 스타일링입니다.

이 부분은 조금 까다로워서, Prism.js의 구현을 알아야 합니다.

Prism.js의 CSS를 그대로 불러오면 색상이 지정되지 않기 때문에, Prism.js가 본래 부여할 클래스명을 키로 사용하여, 직접 준비한 클래스명을 전달합니다.

말로는 이해하기 어려울 수 있으니 코드를 보면서 살펴 보겠습니다.

```js
// src/editorTheme.ts

export const theme: EditorThemeClasses = {
  // 생략

  code: styles.code,
  codeHighlight: {
    atrule: styles.tokenAttr,
    attr: styles.tokenAttr,
    boolean: styles.tokenProperty,
    builtin: styles.tokenSelector,
    cdata: styles.tokenComment,
    char: styles.tokenSelector,
    class: styles.tokenFunction,
    "class-name": styles.tokenFunction,
    comment: styles.tokenComment,
    constant: styles.tokenProperty,
    deleted: styles.tokenProperty,
    doctype: styles.tokenComment,
    entity: styles.tokenOperator,
    function: styles.tokenFunction,
    important: styles.tokenVariable,
    inserted: styles.tokenSelector,
    keyword: styles.tokenAttr,
    namespace: styles.tokenVariable,
    number: styles.tokenProperty,
    operator: styles.tokenOperator,
    prolog: styles.tokenComment,
    property: styles.tokenProperty,
    punctuation: styles.tokenPunctuation,
    regex: styles.tokenVariable,
    selector: styles.tokenSelector,
    string: styles.tokenSelector,
    symbol: styles.tokenProperty,
    tag: styles.tokenProperty,
    url: styles.tokenOperator,
    variable: styles.tokenVariable,
  },
};
```

theme.code는 코드 블록 전체의 요소에 해당합니다.

그리고 theme.codeHighlight의 각 클래스명은 구문 강조로 색상이 지정되는 단어 단위에 해당합니다.

theme.codeHighlight의 타입 정의는 `Record<string, string>`으로 되어 있어, 실제로 Prism.js의 구현을 조사하여 어떤 클래스명을 부여하는지 알아야 합니다.

그리고 해당하는 CSS에 대해, 앞서 전체 CSS 내용을 보여줬었는데요.

`src/editorTheme.module.scss` 이 파일을 다시 잘 보시면,

```css
.code {
  background-color: #f7fafb;
  font-family: Menlo, Consolas, Monaco, monospace;
  display: block;
  padding: 8px 8px 8px 52px;
  line-height: 1.6;
  font-size: 14px;
  margin: 8px 0;
  tab-size: 2;
  overflow-x: auto;
  position: relative;

  &::before {
    content: attr(data-gutter);
    color: #999;
    position: absolute;
    top: 0;
    left: 0;
    background-color: #d9dddf;
    padding: 8px;
    min-width: 32px;
    height: 100%;
    text-align: right;
  }
}
```

위 코드에서 볼 수 있듯이, data-gutter 속성에 줄 번호가 개행된 상태로 들어가 있습니다.

그것을 `::before`의 content에 `attr()`로 전달하고, 스타일링함으로써 줄 번호를 표시할 수 있습니다.

줄 번호가 필요 없다면 `::before`를 작성하지 않으면 되므로, CSS만으로 조정할 수 있는 것이죠.

이제 Syntax 하이라이트가 포함된 코드 블록으로 입력할 수 있게 되었습니다.

프로그래밍 언어 선택 기능은 아직 구현되지 않았지만, CodeNode의 언어 초기값이 "javascript"이므로 최소한 JavaScript의 하이라이트는 가능합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjUbZNhugtXksGdnhtYw9nhozwByRE-fw1k3YJ2DtBwaJ9JBlo6NZkHj-vd156tG11mpubDRSBQyb5Fxv1ERpO0irFodd5vfyIJKW5Mq5nYwz-zkY_HkJiWSiLmQGRPSNyXXYgdJwAbGfTsuZd63sQuMgIk-1n7XH4QPUQ6XA3hO8K6Aqwg_38kLgczcxI)

위 그림과 같이 코드 블록에 JavaScript 코드가 구문 강조된 상태로 입력되어 있습니다.

그럼 이제 프로그래밍 언어 선택 기능을 구현해봅시다.

툴바의 코드 블록 버튼 옆에 언어 선택 드롭다운 리스트를 배치하기로 합시다.

구현은 Command 방식으로 해보겠습니다.

Command와, 그것을 받으면 발동되는 프로그래밍 언어 변경 처리를 구현해두고, 드롭다운 리스트의 change 이벤트 시에 Command를 dispatch하는 구상입니다.

먼저 Command와 그에 대응하는 처리를 작성해봅시다.

```js
// src/plugins/CodeHighlightPlugin.tsx

import { FC, useEffect } from "react";
import { CodeNode, registerCodeHighlighting, $isCodeNode } from "@lexical/code";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  createCommand,
  LexicalEditor,
} from "lexical";
import { $getNearestNodeOfType } from "@lexical/utils";

export const CodeHighlightPlugin: FC = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return registerCodeHighlighting(editor);
  }, [editor]);

  return null;
};

export const CODE_LANGUAGE_COMMAND = createCommand<string>();

function registerCodeLanguageSelecting(editor: LexicalEditor): () => void {
  return editor.registerCommand(
    CODE_LANGUAGE_COMMAND,
    (language, editor) => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return false;

      const anchorNode = selection.anchor.getNode();
      const targetNode = $isCodeNode(anchorNode)
        ? anchorNode
        : $getNearestNodeOfType(anchorNode, CodeNode);
      if (!targetNode) return false;

      editor.update(() => {
        targetNode.setLanguage(language);
      });

      return true;
    },
    COMMAND_PRIORITY_CRITICAL
  );
}
```

Command는 createCommand로 선언합니다.

dispatch할 때 함께 보내야 할 payload가 있다면 Generics로 그 타입을 지정해둡니다.

이번에는 어떤 언어를 선택했는지 문자열로 알려주길 원하기 때문에 `createCommand<string>()`으로 합니다.

다른 파일에서 사용할 것이므로 Command는 export해둡니다.

Command에 대응하는 처리는 editor.registerCommand로 등록합니다.

LexicalEditor를 받아 unregister 함수를 반환하는 함수 registerCodeLanguageSelecting을 정의합니다.

React hooks를 사용하는 함수의 명명은 useXXX로 하는 것처럼, registerCommand나 registerUpdateListener를 호출하는 함수의 명명은 registerXXX로 통일해두면 좋습니다.

또한, 반환값도 반드시 () => void 함수로 하는 규칙으로 하면 혼란 없이 다룰 수 있습니다.

구현은 간단하며, RangeSelection이 가리키는 Node가 CodeNode라면 그것을, 그렇지 않다면 부모 방향으로 CodeNode를 탐색하여 찾았다면 그것을 대상으로 setLanguage 메소드를 editor.update 내에서 실행합니다.

registerCommand의 콜백 함수의 반환값은 boolean을 요구하므로, 업데이트한 경우는 true를, 하지 않은 경우는 false를 반환하도록 합니다.

Command에는 Priority(우선순위) 설정이 가능하며, 그것이 registerCommand의 세 번째 인자에 해당합니다.

Priority를 비교하기 위한 구체적인 이름이 붙은 상수는 lexical 패키지에 포함되어 있습니다.

같은 Command에 대해 여러 처리를 등록한 경우, Priority를 보고 Lexical이 실행해줍니다.

이번에는 자체 제작한 CODE_LANGUAGE_COMMAND에 대해 하나의 처리만 등록하므로 무엇이든 괜찮습니다.

그럼, 정의한 registerCodeLanguageSelecting을 editor에 반영하도록 합시다.

```javascript
// src/plugins/CodeHighlightPlugin.tsx
// 생략

import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";

export const CodeHighlightPlugin: FC = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return mergeRegister(
      registerCodeHighlighting(editor),
      registerCodeLanguageSelecting(editor)
    );
  }, [editor]);

  return null;
};

// 생략
```

공식 함수인 registerCodeHighlighting과 마찬가지로 useEffect 내에서 사용합니다.

단, 여러 unregister 함수를 여러 번 실행하는 것은 번거로우므로, `@lexical/utils`에서 제공하는 mergeRegister를 사용합시다.

이를 통해 registerXXX를 래핑하여 여러 unregister 함수를 하나의 함수로 묶어줍니다.

그것을 useEffect의 클린업으로 사용함으로써 불일치가 없어집니다.

이어서 툴바에 드롭다운 리스트(select, option)를 배치합니다.

먼저 지원하는 언어의 수만큼 option 요소를 생성하는 원본 데이터를 정의합니다.

```js
// src/plugins/ToolbarPlugin.tsx

// 생략

import {
  $createCodeNode,
  CODE_LANGUAGE_FRIENDLY_NAME_MAP,
} from "@lexical/code";

// 생략

const CodeLanguagesOptions = Object.entries(CODE_LANGUAGE_FRIENDLY_NAME_MAP).map(
  ([value, label]) => ({ value, label })
);
```

`@lexical/code` 패키지에 지원하는 언어의 키와 표시 이름의 조합을 가진 CODE_LANGUAGE_FRIENDLY_NAME_MAP이 있으므로, 그것을 Object.entries로 `{value, label}` 배열로 변환합니다.

이제 코드 블록의 언어 선택 기능을 구현해봅시다.

커서 위치가 있는 코드 블록이 현재 선택한 언어의 상태를 선언하고, 이를 select의 value props에 전달하여 제어 컴포넌트로 사용합니다.

```js
// src/plugins/ToolbarPlugin.tsx

export const ToolbarPlugin: FC = () => {
  const [codeLanguage, setCodeLanguage] = useState("");

  // 생략
};
```

먼저 뷰를 만들어둡니다.

blockType이 "code"일 때만 표시되는 드롭다운 리스트로 합니다.

```js
// src/plugins/ToolbarPlugin.tsx
// 생략

import {
  MdChecklist,
  MdCode,
  MdExpandMore,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatQuote,
} from "react-icons/md";

// 생략
import { CODE_LANGUAGE_COMMAND } from "./CodeHighlightPlugin";

export const ToolbarPlugin: FC = () => {
  // 생략

  return (
    <div className={styles.toolbar}>
      {/*생략*/}
      {blockType === "code" && (
        <div className={styles.select}>
          <select
            aria-label="code languages"
            value={codeLanguage}
            onChange={event =>
              editor.dispatchCommand(CODE_LANGUAGE_COMMAND, event.target.value)
            }>
            <option value="">select...</option>
            {CodeLanguagesOptions.map(item => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <MdExpandMore />
        </div>
      )}
    </div>
  );
};
```

미리 선언한 대로, value에는 codeLanguage 상태를 전달합니다.

onChange에서는 setCodeLanguage에 값을 설정하는 것이 아니라, editor.dispatchCommand로 앞서의 CODE_LANGUAGE_COMMAND를 dispatch하여 Lexical의 EditorState를 업데이트합니다.

Lexical의 EditorState가 업데이트되면 editor.registerUpdateListener가 작동하므로, 거기에서 setCodeLanguage로 값을 가져옵니다.

```js
// src/plugins/ToolbarPlugin.tsx

// 생략

import {
  $createCodeNode,
  $isCodeNode,
  CODE_LANGUAGE_FRIENDLY_NAME_MAP,
} from "@lexical/code";

// 생략

useEffect(() => {
  return editor.registerUpdateListener(({ editorState }) => {
    editorState.read(() => {
      if ($isHeadingNode(targetNode)) {
          const tag = targetNode.getTag();
          setBlockType(tag);
        } else if ($isListNode(targetNode)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
          const listType = parentList
            ? parentList.getListType()
            : targetNode.getListType();

          setBlockType(listType);
        } else {
          if ($isCodeNode(targetNode)) {
            setCodeLanguage(targetNode.getLanguage() || "");
          }

          const nodeType = targetNode.getType();
          if (nodeType in SupportedBlockType) {
            setBlockType(nodeType as BlockType);
          } else {
            setBlockType("paragraph");
          }
        }
    });
  });
}, [editor]);
```

CodeNode의 메소드에 getLanguage가 있으므로 이를 사용하여 얻은 값을 setCodeLanguage에 전달합니다.

조금 복잡하지만, Lexical의 상태를 진실의 원천으로 삼고 싶기 때문에, 뷰 → Lexical → useState → 뷰의 흐름으로 합니다.

Lexical이 프레임워크에 구애받지 않기 때문에, React의 렌더링을 발생시킬 수 없어 useState를 사용해야 합니다.

이로써 코드 블록의 언어 선택 기능 구현이 완료되었습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEilNEC7LXcchsvsvJZraQH6NnjFEc-7HD51Cr4eHmdwHRcjOUdEdCHVQFzTfvyUngLeAhBM4OBgn8_BOdAmIVXmsYd1O1F5j6jUwfPaGM3T1MZgwi4ojK8IDbix2I0vm8a-46rKOl-y4RNyPm1vPDHQjv7RZ4EhhD0CaA6aMCp3SJY9_GVWDKAFUlksJws)

드롭다운 리스트에서 CSS를 선택하면, 코드 블록에 입력된 CSS 코드가 구문 강조되어 표시됩니다.

참고로 현재 지원되는 언어의 수는 아직 많지 않습니다.

언어를 늘리려면 'prismjs/components/prism-javascript'와 같은 Prism.js의 언어 정의 파일을 적절히 import하여 CODE_LANGUAGE_FRIENDLY_NAME_MAP을 확장해야 합니다.

하지만 Prism.js의 구조가 좋지 않아 import 순서를 잘못하면 제대로 작동하지 않는 문제가 있으므로 주의가 필요합니다(아예 import하는 것 자체가 잘못되었다는 의견도 있습니다).

---

## 인라인 스타일 기능 구현

마지막으로 인라인 스타일 기능을 구현해봅시다.

이미 RichTextPlugin을 사용하고 있고, Lexical 자체적으로 단축키가 이미 구현되어 있어서, 에디터에 입력된 텍스트를 몇 글자 선택하고 cmd+B(ctrl+B)를 누르면 볼드체로 변합니다.

Lexical이 기본적으로 지원하는 인라인 스타일은 다음과 같은 7가지입니다.

- bold
- underline
- strikethrough
- italic
- code
- subscript
- superscript

표준 이외의 인라인 스타일(색깔 있는 텍스트 등)을 적용하고 싶다면, Node 클래스의 독자적인 구현이 필요합니다.

여기서 구현할 것은 버튼 클릭으로 선택된 텍스트에 인라인 장식을 적용하는 기능입니다.

번거로움을 피하기 위해 블록 레벨의 툴바 아래에 고정된 인라인 툴바를 배치하겠습니다.

InlineToolbarPlugin이라는 컴포넌트를 준비합니다.

그리고 현재 Selection이 가리키는 Node가 각각의 인라인 스타일을 가지고 있는지의 상태를 선언합니다.

인라인 스타일은 블록 타입과 달리 중복 적용이 가능하므로, 각 스타일이 적용되었는지 여부를 boolean으로 각각 선언합니다.

```js
// src/plugins/InlineToolbarPlugin.tsx

import { FC, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import styles from "./InlineToolbarPlugin.module.scss";


export const InlineToolbarPlugin: FC = () => {
  const [editor] = useLexicalComposerContext();

  const [isBold, setIsBold] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);

  return <div className={styles.inlineToolbar}></div>;
};
```

텍스트를 장식하는 버튼을 만듭니다.

텍스트에 장식을 적용하려면, FORMAT_TEXT_COMMAND라는 Command와 함께 인라인 스타일 이름을 dispatch해야 합니다.

FORMAT_TEXT_COMMAND는 lexical 패키지에서 import할 수 있습니다.

```js
// src/plugins/InlineToolbarPlugin.tsx

import { FC, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_TEXT_COMMAND } from "lexical";
import styles from "./InlineToolbarPlugin.module.scss";
import {
  MdCode,
  MdFormatBold,
  MdFormatItalic,
  MdFormatStrikethrough,
  MdFormatUnderlined,
  MdSubscript,
  MdSuperscript,
} from "react-icons/md";

export const InlineToolbarPlugin: FC = () => {
  const [editor] = useLexicalComposerContext();

  const [isBold, setIsBold] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);

  return (
    <div className={styles.inlineToolbar}>
      <button
        type="button"
        aria-label="format bold"
        role="checkbox"
        aria-checked={isBold}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
      >
        <MdFormatBold />
      </button>
      <button
        type="button"
        aria-label="format underline"
        role="checkbox"
        aria-checked={isUnderline}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
      >
        <MdFormatUnderlined />
      </button>
      <button
        type="button"
        aria-label="format strikethrough"
        role="checkbox"
        aria-checked={isStrikethrough}
        onClick={() =>
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")
        }
      >
        <MdFormatStrikethrough />
      </button>
      <button
        type="button"
        aria-label="format italic"
        role="checkbox"
        aria-checked={isItalic}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
      >
        <MdFormatItalic />
      </button>
      <button
        type="button"
        aria-label="format code"
        role="checkbox"
        aria-checked={isCode}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code")}
      >
        <MdCode />
      </button>
      <button
        type="button"
        aria-label="format subscript"
        role="checkbox"
        aria-checked={isSubscript}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript")}
      >
        <MdSubscript />
      </button>
      <button
        type="button"
        aria-label="format superscript"
        role="checkbox"
        aria-checked={isSuperscript}
        onClick={() =>
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript")
        }
      >
        <MdSuperscript />
      </button>
    </div>
  );
};
```

CSS를 위한 InlineToolbarPlugin.module.scss  파일입니다.

```css
.inlineToolbar {
    padding: 8px 24px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .inlineToolbar button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    font-size: 24px;
    border-radius: 4px;
    color: #cdcdcd;
  
    &:hover {
      background-color: #eeeeee;
    }
  
    &[aria-checked="true"] {
      color: #111111;
    }
  }
```

이제 각 버튼을 클릭함으로써 선택한 텍스트의 인라인 스타일을 변경할 수 있게 되었는데요.

이제 InlineToolbarPlugin도 Editor.tsx에서 호출해야 합니다.

```javascript
// src/Editor.tsx

// 생략
import { InlineToolbarPlugin } from "./plugins/InlineToolbarPlugin";

// 생략

export const Editor: FC = () => {
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <ToolbarPlugin />
      <InlineToolbarPlugin />
      {/* 생략 */}
    </LexicalComposer>
  );
};
```

마지막으로, 각 인라인 스타일이 적용되었는지 여부를 업데이트하는 부분입니다.

이번에도 editor.registerUpdateListener를 사용하여, EditorState가 변경될 때마다 실행되는 리스너를 등록합니다.

Selection은 EditorState에 포함되므로, 그 변화도 감지할 수 있습니다.

```js
// src/plugins/InlineToolbarPlugin.tsx

import { FC, useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from "lexical";
// 생략

useEffect(() => {
  editor.registerUpdateListener(({ editorState }) => {
    editorState.read(() => {
      const selection = $getSelection();

      if (!$isRangeSelection(selection)) return;

      setIsBold(selection.hasFormat("bold"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsItalic(selection.hasFormat("italic"));
      setIsCode(selection.hasFormat("code"));
      setIsSubscript(selection.hasFormat("subscript"));
      setIsSuperscript(selection.hasFormat("superscript"));
    });
  });
}, [editor]);
```

RangeSelection은 selection.hasFormat이라는, 인라인 스타일을 체크하는 메소드를 가지고 있습니다.

이를 실행한 결과를 각 상태의 업데이트 함수에 전달함으로써, 각 인라인 스타일이 적용되었는지 여부를 확인할 수 있습니다.

인라인 스타일에 대한 CSS는 다음과 같이 적용됩니다.

```ts
// src/editorTheme.ts

export const theme: EditorThemeClasses = {
  // 생략

  text: {
    bold: styles.textBold,
    code: styles.textCode,
    italic: styles.textItalic,
    strikethrough: styles.textStrikethrough,
    subscript: styles.textSubscript,
    superscript: styles.textSuperscript,
    underline: styles.textUnderline,
    underlineStrikethrough: styles.textUnderlineStrikethrough,
  },
};
```

"underline"과 "strikethrough"가 동시에 적용될 때 전용 클래스가 준비되어 있습니다.

CSS에서 text-decoration을 여러 개 지정하고 싶을 때는,

```css
.textUnderlineStrikethrough {
  text-decoration: underline line-through;
}
```

이와 같이 하나의 속성에 여러 값을 지정해야 하므로, underlineStrikethrough라는 클래스명이 준비되어 있다고 생각됩니다.

실행 결과는 아래와 같습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjquC6Cn1nOjImMsd3VxmP5f7YvW19sixy5lk-6fOk4xGeFjj5NXHJSrFKOF_9FToEdxrAqODZEI007ZnLEgNNI6TFnxtojjoWmwmWp0HuIfysKL0-jfhmgj_rZstlqUK3ExMJyNhusQo4IZeQDoVB6kebyXEU1HS2WXMAiAaTnEh4KqhXExCkceclJhes)

아주 잘 적용되고 있네요.

---

## 마크다운과 같은 단축키 도입

여러분들은 프로그래머라서 평소에 마크다운 형식으로 문서를 작성하는 경우가 많으며, 익숙해져 있을 것입니다.

또한, 작업 효율을 중시한다면, 매번 툴바로 마우스를 옮겨 클릭하는 것이 번거롭다고 생각할 수도 있습니다.

그럴 때 마크다운과 같은 텍스트를 입력하면 블록 타입이 변환되거나 인라인 스타일이 적용되면 좋겠다고 생각하는데요.

다행히도 그 기능은 공식 플러그인으로 구현되어 있으며, 플러그인을 추가하기만 하면 사용할 수 있습니다.

```ts
// src/plugins/MarkdownPlugin.tsx

import { FC } from "react";
import { TRANSFORMERS } from "@lexical/markdown";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";

export const MarkdownPlugin: FC = () => {
  return <MarkdownShortcutPlugin transformers={TRANSFORMERS} />;
};
```

MarkdownShortcutPlugin에는 마크다운과 같은 입력을 감지하여 스타일을 변환하는 기능이 구현되어 있습니다.

props로 전달된 TRANSFORMERS는 변환 규칙 배열로, `@lexical/markdown`에서는 더 세밀하게 지정하기 위한 인라인 스타일만 변환할 수 있는 규칙이나 블록 레벨만 변환할 수 있는 규칙 등이 준비되어 있습니다.

또한, Transformer 타입 객체를 직접 준비하면, 오리지널 변환 규칙도 구현할 수 있습니다.

이제 MarkdownPlugin을 Editor에 추가합니다.

```ts
// src/Editor.tsx

// 생략

import { MarkdownPlugin } from "./plugins/MarkdownPlugin";

export const Editor: FC = () => {
  return (
    <LexicalComposer initialConfig={initialConfig}>
      {/*생략*/}
      <MarkdownPlugin />
    </LexicalComposer>
  );
};
```

마지막으로 nodes.ts 파일에 LinkNode를 추가하면 됩니다.

```js
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { Klass, LexicalNode } from "lexical";
import { LinkNode } from '@lexical/link';

export const nodes: Klass<LexicalNode>[] = [
  HeadingNode,
  QuoteNode,
  ListItemNode,
  ListNode,
  CodeNode,
  CodeHighlightNode,
  LinkNode
];
```

이제 '#'을 입력하면 Heading으로, '>'를 입력하면 Quote로 변환할 수 있는 완벽한 마크다운 에디터가 되었네요.

---

지금까지 Lexical을 사용하여 간단한 리치 텍스트 에디터를 만들면서 Lexical의 API와 사용법에 대해 배웠는데요.

필요할 것 같은 기능은 공식 플러그인으로 풍부하게 제공되어 있어 쉽게 원하는 기능을 추가할 수 있습니다.

[Lexical Playground](https://playground.lexical.dev/)에는 더 많은 기능이 구현된 너무나 리치한 텍스트 에디터가 배포되어 있습니다.

이미지나 YouTube의 임베드 블록 기능 등도 있습니다.

이 부분은 직접 구현해 보시는 걸 추천드립니다.

그럼.