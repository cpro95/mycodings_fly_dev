---
slug: 2025-08-22-react-router-elegant-responsive-redirects-with-index-route
title: React Router 화면 크기별 리다이렉트, 이렇게 우아할 수 있다고?
date: 2025-08-23 10:48:55.267000+00:00
summary: React Router에서 화면 크기에 따라 특정 경로를 리다이렉트하는 가장 깔끔한 방법을 소개합니다. 깜빡임 없는 사용자 경험과 유지보수하기 좋은 코드를 위한 인덱스 라우트 패턴을 확인하세요.
tags: ["React", "React Router", "반응형 디자인", "리다이렉트", "clientLoader", "인덱스 라우트"]
contributors: []
draft: false
---

[원본 링크](https://sergiodxa.com/md/tutorials/redirect-based-on-screen-size-in-react-router?)

여기 아주 좋은 해외 기술 아티클이 하나 있는데요, 이 글의 핵심만 전체적으로 살펴볼까 힙니다.<br /><br />반응형 웹을 만들다 보면, 화면 크기에 따라 특정 라우트의 동작을 다르게 하고 싶을 때가 종종 있거든요.<br /><br />예를 들어 `/settings`라는 설정 페이지가 있다고 상상해보죠.<br /><br />모바일에서는 `/settings`로 접속하면 세부 설정 페이지로 이동할 수 있는 링크 목록을 보여주는 게 자연스러운데요.<br /><br />하지만 데스크톱에서 `/settings`로 접속했을 때 덩그러니 사이드바만 보인다면, 이건 사용자 경험 측면에서 썩 좋지 않죠.<br /><br />데스크톱에서는 바로 첫 번째 세부 설정 페이지(예: `/settings/1`)로 리다이렉트시켜주는 것이 훨씬 더 친절한 설계일 겁니다.<br /><br />이 문제를 해결하기 위해 보통 레이아웃 컴포넌트의 `clientLoader`에서 화면 크기를 체크하고 `redirect`를 시도하곤 하는데요.<br /><br />하지만 이 방식은 현재 URL을 수동으로 파싱해야 하고, 어떤 하위 라우트가 매칭되었는지와 상관없이 리다이렉트 로직이 실행되어 코드가 지저분해지기 쉽습니다.<br /><br />오늘 소개할 방법은 이보다 훨씬 더 깔끔하고 우아한 접근법인데요.<br /><br />오직 `/settings` 경로에만 정확히 일치하는 전용 '인덱스 라우트(index route)'를 만들어서, 화면 크기에 따라 렌더링을 할지 리다이렉트를 할지 결정하는 겁니다.<br /><br />이 패턴을 사용하면 다음과 같은 엄청난 이점들을 얻을 수 있죠.<br /><br />1.  리다이렉트가 페이지 렌더링 '전'에 실행되어 화면 깜빡임이 전혀 없습니다.<br /><br />2.  정규식 같은 복잡한 해킹 없이, 라우팅 시스템을 이용해 우리가 원하는 정확한 시점에만 로직을 실행할 수 있습니다.<br /><br />3.  미디어 쿼리 변경을 감지해서, 사용자가 브라우저 창 크기를 조절할 때도 실시간으로 반응합니다.<br /><br />

## 1단계 기반 다지기, 라우트 구조 정의

가장 먼저 할 일은 `/settings` 경로 아래에 '인덱스 라우트'와 '상세 페이지 라우트'가 중첩되도록 라우트 구조를 설계하는 건데요.<br /><br />

```typescript
import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("settings", "routes/settings.tsx", [
    index("routes/settings._index.tsx"),
    route(":id", "routes/settings.$id.tsx"),
  ]),
] satisfies RouteConfig;
```

이 구조가 정말 중요한데요.<br /><br />이렇게 하면 사용자가 `/settings`로 접속했을 때는 `settings._index.tsx` 파일이 정확하게 매칭되고, `/settings/1`처럼 ID가 붙은 경로로 접속했을 때는 `settings.$id.tsx` 파일이 매칭됩니다.<br /><br />우리의 리다이렉트 로직을 둘 곳이 명확하게 정해진 셈이죠.<br /><br />

## 2단계 뼈대 만들기, 레이아웃 컴포넌트

다음은 이 두 하위 라우트의 공통 부모가 될 레이아웃 컴포넌트, `settings.tsx` 파일을 만들 차례인데요.<br /><br />이 컴포넌트는 설정 페이지들의 공통적인 UI, 즉 내비게이션 링크 목록을 보여주고, 실제 내용은 자식 라우트가 채워 넣도록 `<Outlet />`을 배치하는 역할을 합니다.<br /><br />

```tsx
import { Outlet, Link, href } from "react-router";
import type { Route } from "./+types/settings";

export function loader() {
  return {
    options: [
      { to: href("/settings/:id", { id: "1" }), label: "Settings 1" },
      { to: href("/settings/:id", { id: "2" }), label: "Settings 2" },
      { to: href("/settings/:id", { id: "3" }), label: "Settings 3" },
      { to: href("/settings/:id", { id: "4" }), label: "Settings 4" },
    ],
  };
}

export default function Component({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <ul>
        {loaderData.options.map((option) => (
          <li key={option.to}>
            <Link to={option.to}>{option.label}</Link>
          </li>
        ))}
      </ul>
      <hr />
      <Outlet />
    </div>
  );
}
```

모바일에서 `/settings`에 접속하면 바로 이 링크 목록이 보이게 될 거고요.<br /><br />데스크톱에서는 이 화면을 볼 틈도 없이 다른 곳으로 보내버릴 겁니다.<br /><br />

## 3단계 목적지 설정, 상세 페이지 라우트

데스크톱 사용자들이 리다이렉트되어 최종적으로 도착할 페이지, `settings.$id.tsx`는 아주 간단한데요.<br /><br />그저 URL 파라미터로 받은 ID를 화면에 보여주는 역할만 하면 충분합니다.<br /><br />

```tsx
import type { Route } from "./+types/settings.$id";

export default function Component({ params }: Route.ComponentProps) {
  return <h1>Setting {params.id}</h1>;
}
```

이 컴포넌트는 우리의 리다이렉트 로직이 잘 작동했는지 확인시켜주는 종착역이죠.<br /><br />

## 4단계 핵심 로직, 리다이렉트를 위한 인덱스 라우트

드디어 오늘의 주인공, `settings._index.tsx` 파일을 살펴볼 시간인데요.<br /><br />바로 여기가 이번 패턴의 모든 마법이 일어나는 곳입니다.<br /><br />이 파일의 핵심은 `clientLoader` 함수에 있죠.<br /><br />

```tsx
import { useLayoutEffect } from "react";
import { href, redirect, useNavigate } from "react-router";
import type { Route } from "./+types/settings._index";

export async function clientLoader() {
  let mediaQuery = window.matchMedia("(max-width: 720px)");
  if (mediaQuery.matches) return { mediaQuery };
  return redirect(href("/settings/:id", { id: "1" }));
}

export default function Component({ loaderData }: Route.ComponentProps) {
  let navigate = useNavigate();

  useLayoutEffect(() => {
    loaderData.mediaQuery.addEventListener("change", listener);
    return () => loaderData.mediaQuery.removeEventListener("change", listener);

    function listener(event: MediaQueryListEvent) {
      if (event.matches) return;
      navigate(href("/settings/:id", { id: "1" }));
    }
  }, [navigate, loaderData.mediaQuery]);

  return null;
}
```

`clientLoader`는 페이지가 렌더링되기 '전'에 클라이언트에서 실행되는 아주 특별한 로더인데요.<br /><br />이 코드 안에서 우리는 `window.matchMedia("(max-width: 720px)")`를 사용해서 현재 화면의 너비가 720px 이하인지(모바일인지) 확인합니다.<br /><br />만약 `mediaQuery.matches`가 `true`라면, 즉 모바일 환경이라면, `mediaQuery` 객체 자체를 반환하고 로더의 역할을 끝내고요.<br /><br />하지만 `false`라면, 즉 데스크톱 환경이라면, React Router의 `redirect` 함수를 사용해서 `/settings/1`로 즉시 사용자를 보내버리는 거죠.<br /><br />이 모든 일이 렌더링이 시작되기도 전에 일어나기 때문에 사용자는 화면 깜빡임을 전혀 경험하지 못합니다.<br /><br />그런데 컴포넌트 부분을 보면 로직이 조금 더 있죠?<br /><br />`useLayoutEffect` 안에 있는 코드는 바로 사용자가 브라우저 창 크기를 직접 조절하는 경우를 대비한 건데요.<br /><br />모바일 크기에서 데스크톱 크기로 창을 넓히는 순간, `change` 이벤트가 발생하고 `navigate` 함수가 호출되어 `/settings/1`로 이동하게 됩니다.<br /><br />마지막으로 이 컴포넌트가 `null`을 반환하는 이유도 중요한데요.<br /><br />모바일 환경에서 이 인덱스 라우트는 UI를 렌더링할 책임이 없습니다.<br /><br />UI는 이미 부모 레이아웃 컴포넌트가 그리고 있죠.<br /><br />이 컴포넌트의 유일한 임무는 '데스크톱 환경일 때 리다이렉트'라는 로직을 수행하는 것이기 때문에, 그 외의 경우에는 아무것도 보여주지 않는 것이 맞습니다.<br /><br />

## 마치며

어떤가요?<br /><br />단순히 레이아웃 컴포넌트 하나에 모든 분기 처리를 때려 넣는 것보다 훨씬 더 깔끔하고 체계적이지 않나요?<br /><br />오늘 살펴본 '인덱스 라우트를 활용한 반응형 리다이렉트' 패턴은 역할과 책임을 명확하게 분리해서 코드를 훨씬 더 예측 가능하고 유지보수하기 쉽게 만들어 줍니다.<br /><br />게다가 렌더링 전에 리다이렉트를 실행해서 사용자에게는 매끄러운 경험을, 브라우저 크기 변경에도 실시간으로 반응해서는 똑똑한 UI를 제공하죠.<br /><br />다음번에 반응형 라우팅 로직을 구현할 일이 생긴다면, 이 우아한 패턴을 꼭 한번 시도해보시길 바랍니다.<br /><br />
