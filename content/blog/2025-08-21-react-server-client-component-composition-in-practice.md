---
slug: 2025-08-21-react-server-client-component-composition-in-practice
title: "서버 컴포넌트, '이렇게' 쓰시면 말짱 꽝입니다 (RSC 조합의 기술)"
date: 2025-08-23 07:01:54.504000+00:00
summary: React 서버 컴포넌트의 이점을 해치지 않으면서 클라이언트 컴포넌트와 효과적으로 조합하는 핵심 패턴을 알아봅니다. 서버 컴포넌트를 children으로 전달하는 간단한 방법으로 성능과 재사용성을 모두 잡아보세요.
tags: ["React", "React Server Components", "RSC", "서버 컴포넌트", "컴포넌트 조합", "Suspense"]
contributors: []
draft: false
---

[원본 링크](https://aurorascharff.no/posts/server-client-component-composition-in-practice/?ck_subscriber_id=1964484712&utm_source=convertkit&utm_medium=email&utm_campaign=%E2%9A%9B%EF%B8%8F%20This%20Week%20In%20React%20#246:%20Next.js,%20React%20Router,%20TanStack,%20StyleX,%20MUI,%20Storybook%20%7C%20FlashList%202,%20RN%200.81,%20Expo,%20Radon,%20Gesture%20Handler,%20Audio,%20Skia,%20Nitro,%20Strict%20DOM%20%7C%20TC39,%20Node,%20TypeScript,%20Astro,%20BIDC,%20Surveys%20-%2018691813)

여기 아주 좋은 해외 블로그 포스트가 있는데요, 이 글의 핵심만 전체적으로 살펴볼까 힙니다.<br /><br />React 서버 컴포넌트(RSC)가 데이터 페칭을 서버에 유지하고 클라이언트 자바스크립트를 줄여준다는 엄청난 이점을 가지고 있다는 건 이제 다들 아실 거예요.<br /><br />그런데 정말 많은 개발자들이 '닫기' 버튼이나 간단한 애니메이션 같은 상호작용 하나를 추가하겠다고, 애써 만든 서버 컴포넌트를 클라이언트 컴포넌트로 전환해버리는 실수를 저지르더라고요.<br /><br />이렇게 되면 RSC의 핵심 이점을 모두 잃어버리는 셈이죠.<br /><br />그래서 오늘은 어떻게 하면 클라이언트 컴포넌트와 서버 컴포넌트를 효과적으로 '조합'해서 쓸 수 있는지, 그 실전 패턴들을 깊이 있게 파헤쳐 보려고 합니다.<br /><br />

## React 서버 컴포넌트, 잠깐 복습하고 갈까요

React 서버 컴포넌트(RSC)는 서버에서만 렌더링되고, 오직 렌더링된 결과물(HTML)만 클라이언트로 보내는 컴포넌트인데요.<br /><br />전통적인 SSR과 달리, 브라우저에서는 절대로 실행되지 않는다는 특징이 있습니다.<br /><br />

```jsx
// 이 코드는 오직 서버에서만 실행됩니다.
async function ServerComponent() {
  const data = await fetch('https://api.example.com/data');
  const jsonData = await data.json();
  return <div>{jsonData.title}</div>;
}
```

덕분에 자바스크립트 번들 사이즈에 전혀 영향을 주지 않고, API 엔드포인트 없이 데이터베이스 같은 백엔드 자원에 직접 접근할 수 있으며, 데이터 페칭과 렌더링을 모두 서버에서 처리해 성능을 높일 수 있죠.<br /><br />자, 그럼 이제 본론으로 들어가 보겠습니다.<br /><br />

## 이것만은 꼭 기억하세요 '핵심 조합 패턴'

여기 데이터를 가져오는 간단한 서버 컴포넌트가 하나 있는데요.<br /><br />

```jsx
async function ServerComponent() {
  const data = await getData();
  return <div>{data}</div>;
}
```

이 컴포넌트의 역할은 명확합니다.<br /><br />데이터를 가져와서 보여주는 거죠.<br /><br />이제 여기에 '닫기' 버튼을 추가해서 UI에서 이 요소를 사라지게 만들고 싶다고 해보죠.<br /><br />가장 먼저 떠오르는 방법은 아마 이 컴포넌트에 `'use client'`를 추가하고, `useState`로 표시 상태를 관리하는 걸 거예요.<br /><br />

```jsx
'use client';

function ServerComponentTurnedClient({ data }) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div>
      {data}
      <button onClick={() => setVisible(false)}>Dismiss</button>
    </div>
  );
}
```

하지만 여기서 문제가 발생하죠.<br /><br />우리 `ServerComponent`는 이제 클라이언트 컴포넌트가 되어버렸고, 데이터 페칭뿐만 아니라 상태 관리와 UI 렌더링까지 책임지는 비대한 컴포넌트가 되었습니다.<br /><br />RSC의 모든 장점을 잃어버린 겁니다.<br /><br />바로 이 문제를 피하기 위한 '핵심 패턴'이 있습니다.<br /><br />서버 컴포넌트를 클라이언트 컴포넌트로 바꾸는 대신, 서버 컴포넌트를 '자식(children)'으로 받는 클라이언트 '래퍼(wrapper)' 컴포넌트를 만드는 거죠.<br /><br />

```jsx
'use client';

function ClientWrapper({ children }) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div>
      {children}
      <button onClick={() => setVisible(false)}>Dismiss</button>
    </div>
  );
}
```

그리고 이렇게 사용하는 겁니다.<br /><br />

```jsx
function Page() {
  return (
    <ClientWrapper>
      <ServerComponent />
    </ClientWrapper>
  );
}
```

이 방식을 사용하면, `ServerComponent`는 데이터 페칭이라는 본연의 임무에만 충실한 서버 컴포넌트로 남을 수 있고요.<br /><br />`ClientWrapper`는 상태 관리와 UI 상호작용을 전담하는 클라이언트 컴포넌트가 됩니다.<br /><br />역할이 명확하게 분리되면서 서버 컴포넌트의 장점은 그대로 유지하고, 클라이언트 자바스크립트 양은 최소화할 수 있죠.<br /><br />이제 이 패턴을 활용한 실전 예제들을 살펴보겠습니다.<br /><br />

### 예제 1 애니메이션을 위한 Motion 래퍼

간단한 애니메이션 효과 하나 때문에 서버 컴포넌트를 포기할 수는 없겠죠.<br /><br />Framer Motion 같은 라이브러리를 사용할 때도 이 패턴은 아주 유용한데요.<br /><br />애니메이션 로직을 처리하는 클라이언트 컴포넌트를 만들고, 애니메이션을 적용할 서버 컴포넌트를 자식으로 넘겨주면 됩니다.<br /><br />

```jsx
// components/ui/MotionWrappers.tsx
'use client';

import { motion, HTMLMotionProps } from 'framer-motion'

export function MotionDiv(props: HTMLMotionProps<'div'>) {
  return <motion.div {...props}>{props.children}</motion.div>
}
```

그리고 이렇게 서버 컴포넌트에서 감싸주기만 하면 끝이죠.<br /><br />

```jsx
import { MotionDiv } from '@/components/ui/MotionWrappers';

async function ServerComponent() {
  const data = await getData();
  return (
    <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {data}
    </MotionDiv>
  );
}
```

### 예제 2 '더보기' 컴포넌트

카테고리 목록을 보여주는 서버 컴포넌트가 있는데, 목록이 너무 길어서 처음에는 일부만 보여주고 '더보기' 버튼을 누르면 나머지를 보여주고 싶다고 해보죠.<br /><br />이럴 때도 재사용 가능한 `ShowMore` 클라이언트 컴포넌트를 만들어서 해결할 수 있습니다.<br /><br />여기서는 `React.Children` API를 사용해서 자식 요소들을 배열처럼 다루는 창의적인 방법이 사용되었더라고요.<br /><br />

```jsx
// components/ui/ShowMore.jsx
'use client';
import { Children, useState } from 'react';

export default function ShowMore({ children, initial = 5 }) {
  const [expanded, setExpanded] = useState(false);
  const allItems = Children.toArray(children);
  const items = expanded ? allItems : allItems.slice(0, initial);
  const remaining = allItems.length - initial;

  return (
    <div>
      <div>{items}</div>
      {remaining > 0 && (
        <div>
          <button onClick={() => setExpanded(!expanded)}>
            {expanded ? '간략히 보기' : `더보기 (${remaining})`}
          </button>
        </div>
      )}
    </div>
  );
}
```

이 `ShowMore` 컴포넌트는 자식 요소들을 받아서, `expanded` 상태에 따라 처음 `initial` 개수만큼만 보여주거나 전부 보여주는 역할을 합니다.<br /><br />이제 서버 컴포넌트인 `CategoryList`는 데이터만 가져와서 뿌려주고, 이 `ShowMore` 컴포넌트로 감싸기만 하면 되죠.<br /><br />

```jsx
import ShowMore from '@/components/ui/ShowMore';

async function CategoryList() {
  const categories = await getCategories();
  return (
    <ShowMore initial={5}>
      {categories.map((category) => (
        <div key={category.id}>{category.name}</div>
      ))}
    </ShowMore>
  );
}
```

서버와 클라이언트의 역할이 완벽하게 분리되어 코드가 아주 깔끔해졌습니다.<br /><br />

### 예제 3 자동 스크롤 채팅창

채팅 메시지를 서버에서 가져와 보여주는 서버 컴포넌트가 있는데요.<br /><br />새 메시지가 추가될 때마다 자동으로 스크롤을 맨 아래로 내리고 싶습니다.<br /><br />이것도 마찬가지로, `AutoScroller`라는 재사용 가능한 클라이언트 컴포넌트를 만들어서 해결할 수 있죠.<br /><br />

```jsx
// components/ui/AutoScroller.jsx
'use client';
import { useEffect, useRef } from 'react';

export default function AutoScroller({ children, className }) {
  const ref = useRef(null);

  useEffect(() => {
    const mutationObserver = new MutationObserver(() => {
      if (ref.current) {
        ref.current.scroll({ behavior: 'smooth', top: ref.current.scrollHeight });
      }
    });

    if (ref.current) {
      mutationObserver.observe(ref.current, {
        childList: true,
        subtree: true,
      });
    }

    return () => mutationObserver.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
```

이 컴포넌트는 `useEffect`와 `MutationObserver`를 사용해서, 자식 요소에 변화가 생길 때마다 스크롤을 맨 아래로 내려주는 역할을 하죠.<br /><br />이제 서버 컴포넌트인 `Chat`은 이 `AutoScroller`로 감싸주기만 하면 됩니다.<br /><br />

## Suspense와의 고급 조합 패턴

이제 서버 컴포넌트 조합 패턴을 `Suspense`와 함께 활용하는 고급 예제들을 살펴볼 차례인데요.<br /><br />이걸 활용하면 사용자 경험을 한 차원 더 끌어올릴 수 있습니다.<br /><br />

### 예제 4 개인화 배너

사용자별 할인 정보를 보여주는 개인화 배너가 있다고 해보죠.<br /><br />서버에서 사용자 정보와 할인 데이터를 가져오는 데 시간이 걸릴 테니, 보통은 `Suspense`로 감싸고 스켈레톤 UI를 보여줄 겁니다.<br /><br />

```jsx
export default function Page() {
  return (
    <Suspense fallback={<BannerSkeleton />}>
      <PersonalizedBanner />
    </Suspense>
  );
}
```

하지만 스켈레톤 UI는 사용자에게 아무런 유용한 정보도 주지 못하고, 자칫하면 레이아웃 시프트(CLS)를 유발할 수도 있는데요.<br /><br />더 나은 방법이 있습니다.<br /><br />로딩 중에 보여줄 `fallback`으로 스켈레톤 대신, '의미 있는' 범용 배너를 보여주는 거죠.<br /><br />

```jsx
// 범용 배너 (비로그인 사용자 또는 로딩 중에 표시)
function GeneralBanner() {
  return (
    <div className="banner">
      뉴스레터를 구독하고 다음 구매 시 10% 할인을 받으세요!
    </div>
  );
}

// 개인화 배너 (데이터 페칭 필요)
async function PersonalizedBanner() {
  const user = await getCurrentUser();
  if (!user) {
    return <GeneralBanner />;
  }

  const discount = await getDiscountData(user.id);
  return <div className="banner">돌아오신 것을 환영합니다, {user.name}님! {discount}% 할인 쿠폰이 있습니다.</div>;
}
```

그리고 이 둘을 이렇게 조합하는 겁니다.<br /><br />

```jsx
export default function Page() {
  return (
    <Suspense fallback={<GeneralBanner />}>
      <PersonalizedBanner />
    </Suspense>
  );
}
```

이제 `PersonalizedBanner`가 데이터를 가져오는 동안에는 `GeneralBanner`가 먼저 보이는데요.<br /><br />데이터 로딩이 끝나면 개인화된 내용으로 스르륵 바뀌게 되죠.<br /><br />사용자는 로딩을 기다리면서도 의미 있는 콘텐츠를 볼 수 있으니 훨씬 더 나은 경험을 하게 됩니다.<br /><br />여기에 아까 배운 '닫기' 버튼을 위한 클라이언트 래퍼까지 추가하면 정말 완벽한 조합이 완성되죠.<br /><br />

## 마치며

오늘 살펴본 내용의 핵심은 명확한데요.<br /><br />'서버 컴포넌트를 클라이언트 컴포넌트로 바꾸려는 유혹을 참고, 대신 조합을 사용하라'는 것입니다.<br /><br />데이터 페칭은 서버 컴포넌트에 맡기고, UI 상태와 상호작용은 클라이언트 컴포넌트에 맡기는 거죠.<br /><br />서버 컴포넌트를 클라이언트 래퍼의 `children`으로 전달하는 이 간단한 패턴 하나만으로도, 우리는 역할 분리가 명확하고 재사용성이 높으며 성능에 최적화된 컴포넌트를 만들 수 있습니다.<br /><br />다음번에 클라이언트 사이드 상호작용이 필요할 때, 이 '조합의 기술'을 꼭 한번 떠올려보세요.<br /><br />
