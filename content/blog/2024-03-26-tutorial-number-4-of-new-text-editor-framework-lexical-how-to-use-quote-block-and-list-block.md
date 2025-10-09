---
slug: 2024-03-26-tutorial-number-4-of-new-text-editor-framework-lexical-how-to-use-quote-block-and-list-block
title: Lexical 강좌 4편. 인용 블럭과 리스트 블럭 구현하기
date: 2024-03-26 13:00:03.764000+00:00
summary: Draft.js를 대체하는 Lexical 강좌 4편. 인용 블럭과 리스트 블럭 구현하기
tags: ["lexical", "quote block", "list block"]
contributors: []
draft: false
---

안녕하세요?

오늘은 Lexical 강좌 4편을 이어가도록 하겠습니다.

전체 강좌 리스트입니다.
 
1. [Lexical 강좌 1편. 간단한 소개와 기본적인 구현](https://mycodings.fly.dev/blog/2024-03-24-tutorial-of-new-text-editor-framework-lexical)

2. [Lexical 강좌 2편. 플러그인 구현과 undo, redo 기능 추가하기](https://mycodings.fly.dev/blog/2024-03-25-tutorial-number-2-of-new-text-editor-framework-lexical-how-to-use-plugin)

3. [Lexical 강좌 3편. H1, H2 같은 Headings 구현](https://mycodings.fly.dev/blog/2024-03-25-tutorial-number-3-of-new-text-editor-framework-lexical-how-to-use-heading)

4. [Lexical 강좌 4편. 인용 블럭과 리스트 블럭 구현하기](https://mycodings.fly.dev/blog/2024-03-26-tutorial-number-4-of-new-text-editor-framework-lexical-how-to-use-quote-block-and-list-block)

5. [Lexical 강좌 5편. 코드 블럭 구현과 인라인 스타일, 마크다운과 같은 단축기 구현하기](https://mycodings.fly.dev/blog/2024-03-26-tutorial-number-5-of-new-text-editor-framework-lexical-how-to-use-code-block-and-inline-style-and-markdown-shortcut)

---

** 목 차 **

- [Lexical 강좌 4편. 인용 블럭과 리스트 블럭 구현하기](#lexical-강좌-4편-인용-블럭과-리스트-블럭-구현하기)
  - [인용 블록 구현하기](#인용-블록-구현하기)
  - [리스트 블록 구현하기](#리스트-블록-구현하기)

---

## 인용 블록 구현하기

인용 블록도 리치 텍스트 에디터의 가장 기본적인 기능인데요.

HTML의 blockquote에 해당하는 블록으로, 다른 사람의 발언이나 글을 소개할 때 사용합니다.

Lexical에서는 HeadingNode를 추가하는 절차와 완전히 같습니다.

간단하게 만들어봅시다.

LexicalEditor에 QuoteNode를 등록합니다.

QuoteNode 클래스는 `@lexical/rich-text` 패키지에 포함되어 있습니다.

```js
// src/nodes.ts

import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { Klass, LexicalNode } from "lexical";

export const nodes: Klass<LexicalNode>[] = [HeadingNode, QuoteNode];
```

SupportedBlockType에 quote 속성을 추가합니다.

```js
// src/plugins/ToolbarPlugin.tsx

const SupportedBlockType = {
  paragraph: "Paragraph",
  h1: "Heading 1",
  h2: "Heading 2",
  h3: "Heading 3",
  h4: "Heading 4",
  h5: "Heading 5",
  h6: "Heading 6",
  quote: "Quote",
} as const;
```

QuoteNode로 변환하는 함수와 그것을 클릭으로 실행하는 툴바 버튼을 준비합니다.

`$createQuoteNode`도 `@lexical/rich-text` 패키지에서 import할 수 있습니다.

```js
// src/plugins/ToolbarPlugin.tsx
// 생략

import { MdFormatQuote } from "react-icons/md";


export const ToolbarPlugin: FC = () => {
  // 생략

  const formatQuote = useCallback(() => {
    if (blockType !== "quote") {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode());
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
        title={SupportedBlockType["quote"]}
        aria-label={SupportedBlockType["quote"]}
        aria-checked={blockType === "quote"}
        onClick={formatQuote}
      >
        <MdFormatQuote />
      </button>
    </div>
  );
};
```

QuoteNode는 `.getType()`으로 "quote" 문자열을 얻을 수 있으므로, setBlockType으로 블록 타입을 업데이트하는 useEffect는 수정할 필요가 없습니다.

QuoteNode가 에디터 상에 렌더링하는 blockquote에 적용할 클래스명을 설정합니다.

```js
src/editorTheme.ts
export const theme: EditorThemeClasses = {
  heading: {
    /*생략*/
  },
  quote: styles.quote,
};
```

이제 인용 블록을 사용할 수 있게 되었습니다!

실행 결과는 아래와 같습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhHuJZZutD1qT-4j33gV6BYiRi-y8I5bl_C0P25nEaVHMYc0YD5yJZWMB9_0cpyVut9S3UQrQ7kj6U-wg2BxmtJDtUtcJ9y0CZrX2LYCrSAJrrlA3ZUmhSPwl8rqiqVv17bSD0gsL9HAgtBnEh8MqhAEbMSXrcXbTCA2moTYxyuXAeOC_ceSTJxuzC9rlM)

---

## 리스트 블록 구현하기

리스트 블록이란 HTML에서는 ul, ol, li에 해당하는 블록입니다.

일반적으로 리치 텍스트 에디터에는 중첩된 리스트를 입력할 수 있는 기능이 있어야합니다.

하지만, 그걸 구현하기 위해서는 상당히 복잡한 상태 관리 처리를 작성해야 하는데요.

꽤나 어렵습니다.

그러나 Meta 엔지니어의 세심한 배려로 undo redo 등과 같이 공식 플러그인을 삽입하기만 하면 로직이 쉽게 구현되는데요.

덤으로 GitHub의 Markdown에 있는 것처럼 체크리스트도 구현할 수 있습니다.

이제 순서 있는 리스트(Ordered List), 순서 없는 리스트(Unordered List), 체크 리스트(Check List)를 차례대로 구현해 볼까요?

먼저 Node 클래스를 등록합니다.

리스트 기능용 Node 클래스는 ListNode와 ListItemNode 두 가지로 나뉘며, 둘 다 `@lexical/list`에서 import할 수 있습니다.

```js
// src/nodes.ts

import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { Klass, LexicalNode } from "lexical";

export const nodes: Klass<LexicalNode>[] = [
  HeadingNode,
  QuoteNode,
  ListItemNode,
  ListNode,
];
```

그리고 앞서 언급한 복잡한 리스트 로직을 구현해주는 공식 플러그인을 사용합시다.

```js
// src/Editor.tsx

// 생략

import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";

export const Editor: FC = () => {
  return (
    <LexicalComposer initialConfig={initialConfig}>
      {/*생략*/}
      <ListPlugin />
      <CheckListPlugin />
    </LexicalComposer>
  );
};
```

위와 같이 CheckListPlugin과 ListPlugin를 적용하면 됩니다.

체크리스트 기능이 필요 없다면 ListPlugin만 적용하면 됩니다.

이어서 ToolbarPlugin을 편집하여 버튼을 클릭하면 리스트 블록으로 변환할 수 있도록 해야 합니다.


```js
// src/plugins/ToolbarPlugin.tsx

const SupportedBlockType = {
  // 생략
  number: "Numbered List",
  bullet: "Bulleted List",
  check: "Check List",
} as const;
```

순서 있는 리스트는 number 블록이고, 순서 없는 리스트는 bullet 블록입니다.

위와 같이 하면 `listNode.getListType()`의 반환값과 일치하기 때문에 다루기 쉽습니다.

이제 현재 Selection이 가리키는 블록을 각각의 리스트 블록으로 변환하는 처리를 작성해야 합니다.

```js
// src/plugins/ToolbarPlugin.tsx
// 생략
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_CHECK_LIST_COMMAND,
} from "@lexical/list";

// 생략

const formatBulletList = useCallback(() => {
  if (blockType !== "bullet") {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  }
}, [blockType, editor]);

const formatNumberedList = useCallback(() => {
  if (blockType !== "number") {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
  }
}, [blockType, editor]);

const formatCheckList = useCallback(() => {
  if (blockType !== "check") {
    editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
  }
}, [blockType, editor]);
```

INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND, INSERT_CHECK_LIST_COMMAND은 `@lexical/list` 패키지에서 import할 수 있습니다.

editor.dispatchCommand가 등장했습니다.

Flux 아키텍처에서 Action을 dispatch하면 reducer가 새로운 state를 생성하는 것처럼, Lexical에서는 Command를 dispatch하면 미리 등록된 처리(editor.registerCommand)가 실행되어 EditorState가 업데이트됩니다.

위 코드에서는 Command를 dispatch하는 부분을 수행하고 있습니다.

dispatch된 INSERT_UNORDERED_LIST_COMMAND 등의 Command에 대응하는 처리는 어디에서 등록되어 있을까요?

바로 앞서 삽입한 ListPlugin 내부에서 등록되어 있습니다.

ListPlugin 내부(useList가 호출되는 부분)

```js
// facebook/lexical/packages/lexical-react/src/LexicalListPlugin.ts

export function ListPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([ListNode, ListItemNode])) {
      throw new Error(
        'ListPlugin: ListNode and/or ListItemNode not registered on editor',
      );
    }
  }, [editor]);

  useList(editor);

  return null;
}
```

useList의 구현(editor.registerCommand가 호출되는 부분)

```js
// facebook/lexical/packages/lexical-react/src/shared/useList.ts

export function useList(editor: LexicalEditor): void {
  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        INDENT_CONTENT_COMMAND,
        () => {
          indentList();
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        OUTDENT_CONTENT_COMMAND,
        () => {
          outdentList();
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        INSERT_ORDERED_LIST_COMMAND,
        () => {
          insertList(editor, 'number');
          return true;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        INSERT_UNORDERED_LIST_COMMAND,
        () => {
          insertList(editor, 'bullet');
          return true;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        REMOVE_LIST_COMMAND,
        () => {
          removeList(editor);
          return true;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        INSERT_PARAGRAPH_COMMAND,
        () => {
          const hasHandledInsertParagraph = $handleListInsertParagraph();

          if (hasHandledInsertParagraph) {
            return true;
          }

          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor]);
}
```

플러그인에서 Command에 대한 상태 업데이트 처리를 등록해주기 때문에, dispatch만 하면 알아서 블록 변환을 해줍니다.

Flux에서 Action에 payload를 함께 dispatch할 수 있듯이, Lexical의 dispatchCommand에서는 두 번째 인자가 그 역할을 합니다.

이번에는 3개의 Command 모두 `LexicalCommand<void>` 타입, 즉 payload가 필요 없는 Command이므로 undefined를 전달하고 있습니다.

이제 `editor.dispatchCommand` 함수를 버튼 요소에 전달해봅시다.

```js
// src/plugins/ToolbarPlugin.tsx

import { MdChecklist, MdFormatListBulleted, MdFormatListNumbered, MdFormatQuote } from "react-icons/md";

// 생략

return (
  <div className={styles.toolbar}>
    {/*생략*/}
    <button
      type="button"
      role="checkbox"
      title={SupportedBlockType["bullet"]}
      aria-label={SupportedBlockType["bullet"]}
      aria-checked={blockType === "bullet"}
      onClick={formatBulletList}
    >
      <MdFormatListBulleted />
    </button>
    <button
      type="button"
      role="checkbox"
      title={SupportedBlockType["number"]}
      aria-label={SupportedBlockType["number"]}
      aria-checked={blockType === "number"}
      onClick={formatNumberedList}
    >
      <MdFormatListNumbered />
    </button>
    <button
      type="button"
      role="checkbox"
      title={SupportedBlockType["check"]}
      aria-label={SupportedBlockType["check"]}
      aria-checked={blockType === "check"}
      onClick={formatCheckList}
    >
      <MdChecklist />
    </button>
    {/*생략*/}
  </div>
);
```

다음은 블록 타입을 감지하는 부분(useEffect에서 setBlockType을 실행하는 부분)입니다.

'import' 부분과 'useEffect' 부분을 아래와 같이 바꾸면 됩니다.

```js
// src/plugins/ToolbarPlugin.tsx

//생략
import { $isListNode, ListNode } from "@lexical/list";
import { $getNearestNodeOfType } from "@lexical/utils";

// 생략
useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;

        const anchorNode = selection.anchor.getNode();
        const targetNode =
          anchorNode.getKey() === "root"
            ? anchorNode
            : anchorNode.getTopLevelElementOrThrow();

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

HeadingNode와 마찬가지로, Ordered List, Unordered List, Check List를 하나의 ListNode로 담당하기 때문에, 단순한 `node.getType()`으로는 "list" 문자열만 얻을 수 있습니다.

그래서 `$isListNode`로 분기한 후 처리합니다.

또한, 리스트는 중첩될 가능성이 있습니다.

예를 들어 Unordered List의 자식 Node로서 Ordered List가 존재하고, 현재 Selection이 자식의 Ordered List를 가리키고 있는 경우, 활성화된 블록은 Ordered List로 판단되도록 고려해야 합니다.

위 코드에서, targetNode가 ListNode인 경우, 그 자식 요소에 리스트를 가질 가능성이 있으므로 `selection.anchor`가 가리키는 트리 구조상의 끝 Node에서 부모 방향으로 ListNode를 탐색합니다.

ListNode를 찾으면 그 `getListType()`을 사용하고, 찾지 못하면 `targetNode.getListType()`을 사용합니다.

`getListType()`의 반환값은 "number", "bullet", "check"이므로, 그대로 setBlockType에 전달할 수 있습니다.

마지막으로 에디터에 렌더링되는 ol, ul, li에 대한 스타일링입니다.

```javascript
// src/editorTheme.ts

export const theme: EditorThemeClasses = {
  // 생략

  list: {
    ul: styles.ul,
    ol: styles.ol,
    listitem: styles.listitem,
    nested: {
      listitem: styles.nestedListItem,
    },
    listitemChecked: styles.listitemChecked,
    listitemUnchecked: styles.listitemUnchecked,
  },
};
```

중첩 단계의 조정은 Tab과 Shift+Tab으로 가능합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEh5Ss9zHZIkE0fizaJNFtPruaNMrzP_pw60EvurXVA8MY6o6I7L5FJm3oVqtF3p0mHsb5VmLcJ09LyJ1grrk0_m-73RU_-K7liszL13F7eOItbFEC9v9bo5ODTjriBLOQPh_aU939yBgf9w_W2MnGcd9P6dTFFCBNwDcP9Ms50wNlVaFp7ozH88wjPhZRc)

![](https://blogger.googleusercontent.com/img/a/AVvXsEhTAo7ElbWvzOfZZMMessFoSL3-415qskoUeVx5w-Hi24TJGeOSB8prfBOJvujSzTJu5g5SCYvp8wSEmQ2aUQuU2uEJyzK_zG-153FP5RU_ws7PtRVA9XFsCI3_TvcPzdkH6TBIqQjqhOFL8x7DnIBqj8TDSqvvo95UrbIYjBDn4aUdWn_w_jCZIVzVvKc)

![](https://blogger.googleusercontent.com/img/a/AVvXsEg_gMYud8Bvmf3cgqe8omfDfoI5C7IGdFLyT9e_vwklvh3V51_CRB-HZEn5SKdd-AZ-6JeiopYN3ptAh7CFVQ-NZJpAoaPbI3xBhE8TpVHv-0P3wGPneOHupB9g6aWNQotA2FKus-30-P05ft7VjXg_y1-9WghokHRsFn2MTTcxZ2Gl13P_2FoZaVHU2II)

이로써 리스트 기능의 구현은 끝났습니다.

---
