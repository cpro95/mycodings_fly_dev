---
slug: 2025-01-20-rsc-guide-2-bundler-interleaving-optimization
title: RSC(리액트 서버 컴포넌트) 이해 2편, 번들러와 인터리빙, 그리고 성능 최적화 전략까지
date: 2025-01-20 12:01:20.957000+00:00
summary: RSC(리액트 서버 컴포넌트)에 대해 번들러와 인터리빙, 그리고 성능 최적화 전략까지 알아보겠습니다.
tags: ["react", "next.js", "rsc", "react server components", "bundler", "interleaving"]
contributors: []
draft: false
---

**목 차**

- [번들러와 인터리빙(Interleaving)](#번들러와-인터리빙interleaving)
  - [서버 컴포넌트로 가져온 클라이언트 컴포넌트](#서버-컴포넌트로-가져온-클라이언트-컴포넌트)
- [클라이언트 컴포넌트로 가져온 서버 컴포넌트](#클라이언트-컴포넌트로-가져온-서버-컴포넌트)
- [클라이언트 컴포넌트의 자식으로 전달된 서버 컴포넌트](#클라이언트-컴포넌트의-자식으로-전달된-서버-컴포넌트)
- [번들러: 숨겨진 영웅](#번들러-숨겨진-영웅)
- [Hook과 RSCs](#hook과-rscs)
- [Hydration을 할까 말까?](#hydration을-할까-말까)
- [Refetching 및 재조정](#refetching-및-재조정)
- [번들 크기 혼란](#번들-크기-혼란)
- [언제 RSCs를 사용해야 할까요?](#언제-rscs를-사용해야-할까요)

---

## 번들러와 인터리빙(Interleaving)

React의 핵심 원칙 중 하나는 항상 컴포넌트 합성(composition)이었습니다.

DOM이 어떻게 보여야 하는지 결정하는 작업을 여러 함수로 분할하고, 컴포넌트를 서로의 자식으로 만들어서 해당 작업을 합성 (즉, 결합)할 수 있는데요.

RSCs가 이 핵심 원칙에서 크게 벗어나지 않으려면 서버 컴포넌트와 클라이언트 컴포넌트를 인터리빙(혼합)할 수 있어야 합니다.

클라이언트 컴포넌트는 서버 컴포넌트의 자식이 될 수 있어야 합니다.

여기에는 props(함수 인수)를 전달할 수 있는 기능이 포함됩니다.

실제로 컴포넌트 계층 구조에서 일부 함수는 서버에서 실행되고 일부는 클라이언트에서 실행된다는 의미입니다.

하지만 결국에는 모두 자신이 생성하는 DOM 부분의 구조와 내용을 계산하는 작업을 수행할 겁니다.

이것을 가능하게 하는 것은 메타 프레임워크와 번들러의 책임이며, 실제로 그렇게 하고 있습니다.

하지만 추상화에는 비용이 따른다는 점을 기억하셔야 하는데요.

종종 그 비용은 추상화를 사용하기 위해 배워야 하는 특별한 규칙입니다.

이 경우 서버와 클라이언트 분리의 일부를 추상화하는 것은 추상화의 제한 사항을 깨뜨리지 않도록 규칙을 따르는 것을 의미합니다.

RSC의 경우 고려해야 할 3가지 인터리빙 시나리오가 있는데요.

규칙은 실제로 컴포넌트가 실행될 위치에 따라 컴포넌트가 가져올 수 있는 것에 대한 것입니다.

RSC가 번들러와 함께 작동하는 방식과 번들러가 지시문과 import를 분석하고 모든 것을 통합하는 방식을 기반으로 하는 규칙입니다.

---

### 서버 컴포넌트로 가져온 클라이언트 컴포넌트

"서버 컴포넌트로 가져온 클라이언트 컴포넌트" 이 말이 괜찮다는 것은 당연한데요.

번들러는 import 문을 보고 번들에 포함할 코드와 클라이언트에서 다운로드할 코드를 결정합니다.

RSCs도 Virtual DOM을 빌드하는 데 참여해야하는데요.

클라이언트 컴포넌트 코드가 번들에서 브라우저에서 사용할 수 있게 되므로 트리에서 클라이언트 컴포넌트를 참조할 수 있습니다.

React의 useState 훅을 이용해서 state 값을 갖는 카운터를 추가해 보겠습니다.

```javascript
// components/Counter.js
'use client';
import { useState } from 'react';

export default function Counter() {
    const [count, setCount] = useState(0);

    return (
        <section>
            <p>{count}</p>
            <button onClick={() => setCount(count + 1)}>
                Increment
            </button>
        </section>
    );
}
```

```javascript
// page.js
import Counter from "./components/Counter";
import DelayedMessage from "./components/DelayedMessage";
import { Suspense } from "react";

export default function Home() {
  return (
    <main>
      <h1>mycodings.fly.dev</h1>
      <Counter />
      <Suspense fallback={<p>Loading...</p>}>
        <DelayedMessage />
      </Suspense>
    </main>
  );
}
```

파일 상단에 `use client` 지시문이 사용된 것을 보셔야 하는데요.

`use client` 지시문은 React 기능이 아닙니다.

컴포넌트 트리의 일부가 클라이언트에서 실행되어야 함을 표시하기 위해 개발자(Next.js)가 합의한 규칙입니다.

해당 컴포넌트와 해당 컴포넌트가 가져오는 모든 컴포넌트는 클라이언트 컴포넌트로 번들링됩니다.

번들러는 `use client` 지시문을 기록하고 해당 컴포넌트의 코드 및 해당 컴포넌트가 가져오는 모든 코드를 브라우저에서 다운로드하는 내용에 포함합니다.

`Home` 및 `DelayedMessage` RSC는 서버에서 실행되고 해당 코드는 번들에 포함되지 않습니다.

서버의 페이로드는 다음과 같이 보일겁니다.

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
      "identifier": "L",
      "type": "Lazy node"
     },
     "key": null,
     "props": {}
    },
    {
     "type": {
      "$$type": "reference",
      "id": "e",
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
       "id": "f",
       "identifier": "L",
       "type": "Lazy node"
      }
     }
    }
   ]
  }
}
```

클라이언트 컴포넌트가 있을 위치에 새로운 "Lazy node" 참조가 있는 것을 볼 수 있습니다.

Virtual DOM의 해당 부분은 해당 클라이언트 컴포넌트가 실행될 때 알려집니다.

이는 프레임워크가 SSR을 수행하는 경우 클라이언트 컴포넌트가 SSR될 때 또는 브라우저에서 실행될 때 발생합니다.

마지막으로 한 가지 더 말씀드리자면, 서버 컴포넌트에서 클라이언트 컴포넌트로 props를 전달하는 경우 해당 props는 React에서 직렬화할 수 있어야 합니다.

앞에서 보았듯이 props는 네트워크를 통해 전송되는 페이로드의 일부가 됩니다.

즉, 전달되는 모든 것은 문자열로 표현될 수 있어야 클라이언트에서 메모리 내 객체로 다시 변환할 수 있습니다.

---

## 클라이언트 컴포넌트로 가져온 서버 컴포넌트

이건 허용되지 않는데요.

서버에서 실행되도록 만들어진 컴포넌트를 브라우저에서 실행될 컴포넌트로 가져올 수는 없습니다.

왜냐하면 번들러는 RSC 함수를 클라이언트로 보내면 안 되고, 페이로드만 보내야 하기 때문입니다.

따라서 가져올 코드가 없는 거죠.

번들러는 클라이언트가 다운로드할 코드를 포함하지 않을 것이므로 RSC 코드는 사용할 수 없습니다.

여기서 잠깐, 서버와 클라이언트 모두에서 실행 가능한 공유 컴포넌트를 가져오는 것은 가능한데요.

하지만 공유 컴포넌트를 클라이언트 컴포넌트로 가져오면 해당 코드는 클라이언트에서 다운로드할 수 있도록 번들링됩니다.

공유 컴포넌트를 서버 컴포넌트로 가져오면 번들링되지 않습니다.

이런 의문이 들 수도 있을 텐데요.

"만약 실수로 서버 컴포넌트를 가져오면, 번들러는 내가 실수한 건지 어떻게 알 수 있을까요?"

좋은 질문인데요!

이건 약간 보안 문제와도 연결될 수 있습니다.

서버 컴포넌트에는 다른 사람에게 다운로드되거나 보여서는 안 되는 코드가 있을 수 있지만, 실수로 클라이언트 컴포넌트로 가져와서 번들에 포함될 수 있죠.

서버 특정 기능(예를 들어 데이터베이스 연결)이 있다면 브라우저에서 실행이 실패하겠지만, 프로덕션 환경에 배포된다면 데이터베이스 주소와 같은 민감한 정보가 유출될 수도 있습니다.

Next.js는 컴포넌트를 서버 전용으로 표시할 수 있도록 하여 이 문제를 해결하려고 하는데요.

기타 다른 메타 프레임워크에서는 서버 코드가 번들링되어 클라이언트로 전송되지 않도록 더 안전한 대안을 모색하고 있습니다.

하지만 서버-클라이언트 경계에 대한 추상화를 받아들이기로 했다면, 이러한 경계가 존재한다는 사실을 잊어버리는 것에 대한 어느 정도의 위험을 감수해야 합니다.

---

## 클라이언트 컴포넌트의 자식으로 전달된 서버 컴포넌트

이건 허용됩니다.

아주 흥미로운 경우인데요.

서버 컴포넌트를 임포트하는 것과는 다르게 클라이언트 컴포넌트에 자식 props로 서버 컴포넌트를 전달할 수 있습니다.

컴포넌트를 가져오는 것과는 다르죠.

만약 `Counter` 함수에 자식을 전달한다면 다음과 같이 코드를 작성할 수 있습니다.

```javascript
// components/Counter.js
'use client';
import { useState } from 'react';

export default function Counter({ children }) {
    const [count, setCount] = useState(0);

    return (
        <section>
            <p>{count}</p>
            <button onClick={() => setCount(count + 1)}>
                Increment
            </button>
            { children }
        </section>
    );
}
```

```javascript
// page.js
import Counter from "./components/Counter";
import DelayedMessage from "./components/DelayedMessage";
import { Suspense } from "react";

export default function Home() {
  return (
    <main>
      <h1>mycodings.fly.dev</h1>
      <Counter>
        <p>Server Text</p>
      </Counter>
      <Suspense fallback={<p>Loading...</p>}>
        <DelayedMessage />
      </Suspense>
    </main>
  );
}
```

`Counter` 함수가 클라이언트에서 실행되더라도, 그리고 자식으로 전달된 `<p>Server Text</p>`가 서버에서 처리되었더라도, 코드는 문제없이 잘 작동합니다!

왜 작동하는 걸까요?

왜냐하면 실제로 전달하는 것은 실행될 서버 컴포넌트 코드가 아니라 Virtual DOM 트리 일부(코드 실행 결과)이기 때문입니다.

페이로드는 다음과 같이 생겼습니다.

```json
{
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
      "identifier": "L",
      "type": "Lazy node"
     },
     "key": null,
     "props": {
      "children": {
       "type": "p",
       "key": null,
       "props": {
        "children": "Server Text"
       }
      }
     }
    },
    {
     "type": {
      "$$type": "reference",
      "id": "e",
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
       "id": "f",
       "identifier": "L",
       "type": "Lazy node"
      }
     }
    }
   ]
  }
 }
```

페이로드의 "Server Text" 부분을 확인해보세요.

이미 클라이언트 컴포넌트에 prop으로 전달되었습니다.

마치 클라이언트 컴포넌트에 페이로드의 JSX를 직접 작성한 것과 같습니다.

---

## 번들러: 숨겨진 영웅

React Server Components는 여러 면에서 번들러 기능입니다.

번들러는 코드를 분석하여 클라이언트 컴포넌트가 번들에 포함되도록 하고, 해당 클라이언트 컴포넌트에 대한 참조가 페이로드에 제대로 나타나도록 돕습니다.

번들러는 React에서 핵심적인 역할을 합니다.

React 코드베이스를 보면 다음과 같은 폴더를 찾을 수 있습니다.

```sh
/react-server-dom-parcel
/react-server-dom-turbopack
/react-server-dom-webpack
//...등등
```

이러한 폴더 내부에는 Flight와 관련된 코드들이 있어서 번들링된 코드가 이 모든 것을 제대로 처리하도록 돕습니다.

번들러가 RSCs의 숨겨진 영웅이기 때문에 다른 규칙도 가능합니다.

메타 프레임워크가 Next.js에서 사용하는 `use client` 접근 방식을 따를 필요는 없습니다.

예를 들어 TanStack Start는 RSCs를 단순히 "JSX를 반환하는" 함수 (즉, Flight 형식)로 구현하고 있습니다.

React는 Flight 데이터를 스트리밍하는 API를 제공했습니다.

메타 프레임워크가 해당 API를 사용하는 방식을 반복하고 혁신하는 것은 메타 프레임워크에 달려 있습니다.

---

## Hook과 RSCs

서버에서 실행하면 몇 가지 장점이 있지만, 몇 가지 제약 사항도 있습니다.

React는 Virtual DOM에 엘리먼트 구조만 저장하는 것이 아니라 상태도 저장합니다.

컴포넌트에서 다음과 같이 작성하면,

```javascript
const [counter, setCounter] = useState(0);
```

해당 데이터를 Virtual DOM의 컴포넌트 위치에 연결된 연결 리스트의 노드에 배치합니다.

따라서 실제로 해당 상태는 클라이언트 브라우저 메모리의 JavaScript 객체에 저장됩니다.

따라서 React Server Components는 본질적으로 이러한 Hook(훅)을 사용할 수 없습니다.

훅을 사용하기에 적합하지 않은 환경에서 실행되기 때문입니다.

이는 궁극적으로 RSCs가 인터랙티브하지 않다는 것을 의미합니다.

React에서 인터랙티브 기능은 일반적으로 클라이언트 사이드 React 리렌더링을 트리거하는 것을 의미하며, 이는 상태를 업데이트함으로써 발생합니다.

즉, 앱이 점점 더 많은 인터랙티브 기능을 얻게 되면 서버 컴포넌트를 클라이언트 및 서버 컴포넌트 구성으로 리팩토링하는 경향이 있습니다.

`useReducer` 또는 `useState`와 같은 것이 필요할 때마다 클라이언트 컴포넌트가 필요합니다.

컴포넌트가 어디에서 실행되는지 염두에 둔다면 훅을 적절하게 사용 (하거나 사용하지 않게) 될 겁니다.

---

## Hydration을 할까 말까?

RSCs는 hydration될까요?

정답은 '아니오'입니다.

Hydration은 이벤트가 해당 핸들러에 연결될 수 있도록 Virtual DOM을 빌드하기 위해 클라이언트에서 실제 함수를 다시 실행하는 것입니다.

React에서 버튼을 클릭하면 해당 이벤트는 DOM 트리를 거슬러 React 루트까지 전송됩니다.

그러면 React는 어떤 컴포넌트가 클릭을 처리해야 하는지 결정합니다. (여기서 정답은 버튼을 생성한 컴포넌트입니다).

따라서 이벤트에 React가 적절하게 응답할 수 있도록 Virtual DOM과 클릭을 처리하는 코드가 제자리에 있어야 합니다.

RSCs는 인터랙티브하지 않습니다.

상태를 설정하지 않고, 클릭을 처리하지도 않습니다.

적어도 React의 일반적인 접근 방식을 통해서는요.

해당 코드는 실행을 위해 클라이언트로 전송되지 않으므로 정의상 hydration되지 않습니다.

하지만 Virtual DOM을 빌드하는 데에는 참여합니다.

트리 재조정에도 참여하고요.

hydration되지 않는다는 사실이 hydration 중에 트리에 없다는 것을 의미하지는 않습니다.

트리에 있습니다.

---

## Refetching 및 재조정

실제 앱에서는 페이지의 초기 로드뿐만 아니라 해당 서버 컴포넌트를 리페칭(refetching) 하는 것에도 관심을 가져야 하는데요.

즉, 서버에 해당 컴포넌트를 다시 실행하도록 요청하고 (아마도 새로운 props와 함께), Virtual DOM을 업데이트하기 위해 새로운 페이로드 데이터를 제공하도록 요청하는 겁니다.

예를 들어 데이터 목록을 페이지네이션하고 해당 목록이 RSC에 의해 생성된 경우, 경로가 `/page/1`일 때와 `/page/2`일 때 다른 데이터 세트를 얻고 싶을 수 있습니다.

이것은 RSCs의 장점이며, 메타 프레임워크의 라우터와 통합될 가능성이 높습니다.

UI가 서버에서 계산되더라도 메타 프레임워크는 전체 페이지의 새로 고침을 수행할 필요가 없습니다.

본질적으로 RSCs는 Virtual DOM 정의를 클라이언트로 스트리밍할 수 있으며, 그러면 React는 정상적으로 클라이언트 사이드 재조정을 수행할 수 있습니다.

다시 말해 페이지를 새로 고침할 필요가 없고 페이지의 다른 상태를 잃을 필요도 없는거죠.

이러한 측면에서 RSCs는 렌더링 세계의 장점을 모두 제공할 수 있습니다.

서버에서 실행되지만 클라이언트에서 실행되는 것처럼 업데이트할 수 있습니다.

이제 RSCs가 실제로 어떻게 작동하는지 살펴보았으니, 이게 훨씬 더 직관적으로 이해되길 바랍니다.

React는 이미 Virtual DOM을 diffing하여 DOM을 업데이트합니다.

따라서 서버에서 Virtual DOM 데이터를 가져올 수 있다면 React는 항상 해왔던 일을 할 수 있는 겁니다.

---

## 번들 크기 혼란

Next.js 세계에서는 RSCs의 이점에 대한 혼란이 있는데요.

Next.js 리포지터리가 있는 Github에는 `__next_f()` 함수에 대해 꽤 큰 논란이 있는데요.

그 논란의 주요 요지는 일부 RSCs를 사용하기 시작한 개발자들은 페이지 하단의 스크립트 태그에서 이 함수로 전달되는 데이터가 중복되는 것을 발견했다는 겁니다.

그래서 일부 개발자들이 Next.js 개발자들에게 `__next_f()` 함수가 왜 거기에 있는지, 수작업으로 끌 수 있는지 물었는데요.

여기서, 이 중복된 데이터는 무엇일까요?

짐작하셨겠지만, 페이로드입니다!

스트리밍된 해당 함수 호출은 궁극적으로 Virtual DOM을 만들기 위해 해당 페이로드 데이터를 React로 전달합니다.

문제는 대역폭 사용량이 증가한다는 것인데, 어떤 개발자들은 이런 불만을 제기하기도 했습니다.

네트워크를 통해 더 많은 데이터를 보내게 되는 거니까요.

서버 컴포넌트 코드는 번들에 포함되어 있지 않습니다!

따라서 번들 크기를 줄여줍니다!

하지만 페이로드는 중복 데이터이고, 해당 데이터가 크다면 즉 블로그 글처럼 생각보다 절약하는 것보다 더 많은 바이트를 보내게 될 겁니다.

---

## 언제 RSCs를 사용해야 할까요?

그렇다면 언제 RSCs를 사용해야 할까요?

언제나 그렇듯이 올바른 답은 "상황에 따라 다릅니다"입니다.

RSCs가 어떻게 작동하는지에 대한 정확한 모델을 갖추면 아키텍처 선택을 하는 데 도움이 될 겁니다.

보통은 지금 쓰는 글 처럼 내용이 많은 블로그 게시물에는 RSCs를 사용하지 않을 겁니다.

대역폭 사용량이 합리적이지 않기 때문이죠.

콘텐츠가 중심인 사이트나 앱에는 Astro와 같은 것을 사용하는게 좋을 듯 합니다.

반면에 DB 액세스 및 복잡한 로직이 많다면 서버 컴포넌트에서 수행하는게 좋을 듯 합니다.

그럼.
