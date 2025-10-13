---
slug: 2025-07-12-how-to-test-react-server-components
title: React 서버 컴포넌트, 어떻게 테스트할까? (공식 지원 전까지의 유일한 해답)
date: 2025-07-12 10:11:04.739000+00:00
summary: "React와 Next.js 팀이 아직 제공하지 않는 서버 컴포넌트(RSC) 테스트 방법. 커뮤니티에서 발견된 '핵'이지만 확실하게 동작하는 유틸리티 함수를 통해, 비동기 서버 컴포넌트를 테스트하는 유일한 방법을 알아봅니다."
tags: ["react", "React 서버 컴포넌트", "Next.js", "컴포넌트 테스팅", "React Testing Library", "Jest", "RSC"]
contributors: []
draft: false
---

Next.js가 React 서버 컴포넌트(RSC)를 지원하기 시작한 이래로, 저 역시 제 프로젝트에 적극적으로 사용하고 있습니다.

서버에서 데이터를 가져와야 하는 모든 컴포넌트가 더 이상 브라우저에서 데이터를 페칭할 필요가 없다는 점은 정말 합리적이라고 생각합니다.

더 적은 코드, 더 낮은 복잡성, 그리고 더 적은 버그를 의미하니까요.

하지만 RSC가 대중에게 공개된 지 몇 년이 지났음에도, Next.js 팀과 React 팀 모두 아직 서버 컴포넌트를 테스트할 공식적인 방법을 제공하지 않고 있습니다.

심지어 LLM(대규모 언어 모델)조차 그 방법을 모르더군요.

스스로 생각할 수 없으니 어찌 보면 당연한 일입니다.

다행히도 Next.js와 React는 오픈소스이고, 서버 컴포넌트를 테스트하고 싶었던 사람이 저 혼자만은 아니었습니다.

저는 Steven Robert라는 개발자가 공유한 하나의 Gist를 발견했고, 이를 사용해 서버 컴포넌트를 테스트할 수 있었습니다.

조금은 '핵(hack)'에 가깝지만, 확실하게 동작합니다.

## 해결책: 커뮤니티에서 찾은 헬퍼 함수

핵심은 서버 컴포넌트가 본질적으로 '비동기 함수'라는 점을 이용하는 것입니다.

이 헬퍼 함수는 테스트 환경에서 이 비동기 함수를 실행하여 일반 React 엘리먼트로 '해결(resolve)'한 다음, React Testing Library의 `render` 함수에 넘겨주는 방식으로 동작합니다.

아래가 바로 그 마법 같은 코드입니다.

```typescript
// From https://gist.github.com/sroebert/a04ca6e0232a4a60bc50d7f164f101f6
import type { PropsWithChildren, ReactElement, ReactNode } from 'react'
import React, { Children, cloneElement, isValidElement } from 'react'

import { render } from '@testing-library/react'

function setFakeReactDispatcher<T>(action: () => T): T {
  /**
   * We use some internals from React to avoid a lot of warnings in our tests when faking
   * to render server components. If the structure of React changes, this function should still work,
   * but the tests will again print warnings.
   *
   * If this is the case, this function can also simply be removed and all tests should still function.
   */

  if (!('__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE' in React)) {
    return action()
  }

  const secret = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE
  if (!secret || typeof secret !== 'object' || !('H' in secret)) {
    return action()
  }

  const previousDispatcher = secret.H
  try {
    secret.H = new Proxy(
      {},
      {
        get() {
          throw new Error('This is a client component')
        },
      }
    )
  } catch {
    return action()
  }

  const result = action()

  secret.H = previousDispatcher

  return result
}

async function evaluateServerComponent(node: ReactElement): Promise<ReactElement> {
  if (node && node.type?.constructor?.name === 'AsyncFunction') {
    // Handle async server nodes by calling await.

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const evaluatedNode: ReactElement = await node.type({ ...node.props })
    return evaluateServerComponent(evaluatedNode)
  }

  if (node && node.type?.constructor?.name === 'Function') {
    try {
      return setFakeReactDispatcher(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const evaluatedNode: ReactElement = node.type({ ...node.props })
        return evaluateServerComponent(evaluatedNode)
      })
    } catch {
      // If evaluating fails with a function node, it might be because of using client side hooks.
      // In that case, simply return the node, it will be handled by the react testing library render function.
      return node
    }
  }

  return node
}

async function evaluateServerComponentAndChildren(node: ReactElement) {
  const evaluatedNode = (await evaluateServerComponent(node)) as ReactElement<PropsWithChildren>

  if (!evaluatedNode?.props.children) {
    return evaluatedNode
  }

  const children = Children.toArray(evaluatedNode.props.children)
  for (let i = 0; i < children.length; i += 1) {
    const child = children[i]
    if (!isValidElement(child)) {
      continue
    }

    children[i] = await evaluateServerComponentAndChildren(child)
  }

  return cloneElement(evaluatedNode, {}, ...children)
}

// Follow <https://github.com/testing-library/react-testing-library/issues/1209>
// for the latest updates on React Testing Library support for React Server
// Components (RSC)
export async function renderServerComponent(nodeOrPromise: ReactNode | Promise<ReactNode>) {
  const node = await nodeOrPromise

  if (isValidElement(node)) {
    const evaluatedNode = await evaluateServerComponentAndChildren(node)
    return render(evaluatedNode)
  }

  return render(node)
}
```

### 이 코드는 어떻게 동작할까요?

이 코드는 크게 세 부분으로 나눌 수 있습니다.

1.  **'evaluateServerComponent'**: 이 함수의 역할은 간단합니다.

    컴포넌트의 타입이 'AsyncFunction'(즉, 서버 컴포넌트)이면, `await`를 사용해 해당 함수를 실행하고 그 결과(Promise가 해결된 값)를 반환합니다.

    이것이 전체 로직의 핵심입니다.

2.  **'setFakeReactDispatcher'**: 이름에서 알 수 있듯, 이 함수는 React의 내부 동작을 잠시 속이는 '트릭'입니다.

    서버 컴포넌트를 평가하는 동안 클라이언트 컴포넌트에서만 사용 가능한 훅(예: `useState`)이 호출되면 에러를 발생시키도록 하여, 테스트 환경이 마치 서버 환경인 것처럼 행동하게 만듭니다.

    이를 통해 불필요한 경고 메시지를 피할 수 있습니다.

3.  **'renderServerComponent'**: 최종적으로 우리가 테스트 코드에서 호출할 함수입니다.

    이 함수는 서버 컴포넌트와 그 자식들을 재귀적으로 평가(`evaluate`)하여 일반 React 엘리먼트로 만든 뒤, 우리가 잘 아는 `@testing-library/react`의 `render` 함수에 전달합니다.

## 프로젝트에 적용하는 방법

적용 방법은 매우 간단합니다.

1.  프로젝트의 테스트 관련 폴더(예: `src/lib/testing`)에 `render-server-component.tsx` 같은 이름으로 새 파일을 만듭니다.

2.  위 코드를 그대로 복사하여 붙여넣습니다.

3.  이제 테스트하고 싶은 서버 컴포넌트가 있다면, `render` 대신 `renderServerComponent`를 사용하면 됩니다.

예를 들어, 아래와 같은 서버 컴포넌트가 있다고 가정해 봅시다.

```tsx
// src/components/Greeting.tsx
async function getGreetingMessage() {
  await new Promise(resolve => setTimeout(resolve, 100)); // DB 조회 시뮬레이션
  return "Hello, Server Component!";
}

export async function Greeting() {
  const message = await getGreetingMessage();
  return <h1>{message}</h1>;
}
```

이 컴포넌트를 테스트하는 코드는 다음과 같습니다.


```tsx
// src/components/Greeting.test.tsx
import { screen } from '@testing-library/react';
import { Greeting } from './Greeting';
import { renderServerComponent } from '../lib/testing/render-server-component';

test('should render the greeting message', async () => {
  // render 대신 renderServerComponent를 사용하고 await를 붙여줍니다.
  await renderServerComponent(<Greeting />);

  // findBy* 쿼리를 사용해 비동기적으로 렌더링된 텍스트를 찾습니다.
  const heading = await screen.findByRole('heading', {
    name: /Hello, Server Component!/i,
  });

  expect(heading).toBeInTheDocument();
});
```

## 결론

언젠가는 React나 Next.js에서 서버 컴포넌트를 테스트할 수 있는 공식적인 방법을 제공할 것이라고 희망합니다.

하지만 그전까지는, 커뮤니티의 지혜가 담긴 이 방법이 우리가 가진 최선의, 그리고 가장 효과적인 해결책입니다.

서버 컴포넌트의 테스트 부재로 고민하고 있었다면, 이 방법을 한번 시도해 보세요.

여러분의 테스트 커버리지를 한 단계 더 끌어올릴 수 있을 것입니다.
