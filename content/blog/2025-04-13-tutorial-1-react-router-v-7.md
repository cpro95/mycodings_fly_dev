---
slug: 2025-04-13-tutorial-1-react-router-v-7
title: React Router V7 강좌 1편 - Routes, 레이아웃 라우트 및 활성 링크
date: 2025-04-13 07:30:02.549000+00:00
summary: React Router V7 강좌 1편입니다. 기본적인 라이브러리 사용법을 살펴 보겠습니다.
tags: ["react", "react router", "react router v7"]
contributors: []
draft: false
---

안녕하세요?

React 생태계에서 Next.js보다 Remix를 주로 사용했던 저로서는 이번 React Router V7의 출시에 있어 현재 읽고 계신 mycodings.fly.dev 사이트의 기존 Remix 코드베이스를 전부 뜯어 고치기가 너무 힘들었는데요.

그래서 기초가 중요하다고 생각해서 이렇게 먼저, React Router V7을 공부해 볼까 하고 이번 강좌를 작성하게 되었습니다.

React Router V7은 공식 홈페이지에서도 알려주듯이 기존처럼 라이브러리처럼 사용할 수 있고, Remix처럼 Framework처럼 사용할 수 있다고 하는데요.

일단은 React Router의 기본 기능을 익히는게 목적이라 라이브러리처럼 사용해 보겠습니다.

## 템플릿 설치

먼저, React Router V7을 시작하기 위해 새로운 React 프로젝트를 생성해 봅시다.

당연히 Vite를 이용해서 만들어야겠죠.

```bash
npm create vite@latest
npm install react-router
```

당연히 react-router 패키지를 설치하면 됩니다.

리액트 라우터의 라이브러리모드 사용은 BrowserRouter를 기존 리액트 최상위 컴포넌트에 감싸면 되는데요.

아래 코드(index.tsx)가 리액트 라우터를 이용하기 위한 가장 기초적인 세팅방법입니다.

```jsx
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

여기서부터는 App.tsx 파일에서 우리가 만드려고 하는 컴포넌트의 구현을 계속 진행하면 됩니다.

## 라우팅 및 네비게이션

먼저 App 컴포넌트에서 React Router의 Link 컴포넌트를 사용하여 내비게이션을 구현합니다.

개인적으로 인라인 스타일 사용은 권장하지 않는데요, Tailwind 설정하기에는 글이 너무 길어지고, 간단한 CSS라서 인라인 스타일을 사용했으니 참고 바랍니다.

```jsx
import { Link } from "react-router";

const App = () => {
  return (
    <>
      <h1>React Router</h1>

      <Navigation />
    </>
  );
};

const Navigation = () => {
  return (
    <nav
      style={{
        borderBottom: "solid 1px",
        paddingBottom: "1rem",
      }}
    >
      <Link to="/home">Home</Link>
      <Link to="/users">Users</Link>
    </nav>
  );
};

export default App;
```

브라우저에서 우리가 만든 개발 서버를 시작하고 상기 코드의  Link 컴포넌트를 클릭하면 우리가 예상했던 해당 경로로 이동하는 것을 확인할 수 있는데요.

이번에는 Route 컴포넌트를 사용하여 경로와 실제 렌더링을 매핑해 보겠습니다.

```jsx
import { Routes, Route, Link } from 'react-router';

const App = () => {
  return (
    <>
      <h1>React Router</h1>

      <Navigation />

      <Routes>
        <Route path="home" element={<Home />} />
        <Route path="users" element={<Users />} />
      </Routes>
    </>
  );
};
```

Link 컴포넌트와 Route 컴포넌트는 각각 `to`와 `path` 속성에 원하는 위치를 넣으면 직접적으로 매칭되는걸 알 수 있습니다.

각 Route 컴포넌트는 경로가 일치할 때 React 엘리먼트를 렌더링하는데요.

여기서 렌더링하는 것은 React 엘리먼트이므로 당연히 React props도 함께 전달할 수 있습니다.

그러면 방금 Route 컴포넌트로 경로를 매칭한 Home과 Users 컴포넌트를 아래와 같이 마저 작성하겠습니다.

```jsx
const Home = () => {
  return (
    <main style={{ padding: '1rem 0' }}>
      <h2>Home</h2>
    </main>
  );
};

const Users = () => {
  return (
    <main style={{ padding: '1rem 0' }}>
      <h2>Users</h2>
    </main>
  );
};
```

이제 브라우저로 돌아가서 테스트 해보시면 Home 및 Users 컴포넌트 간(예: /home에서 /users로) 이동할 수 있을겁니다.

기본적으로 지금까지 배운게 React Router의 핵심 개념입니다.

즉, 기존 Link 컴포넌트로 이동할 컴포넌트를 설정하고 이걸 Route 컴포넌트와 매칭하는 작업이 바로 react router 역할입니다.

그리고 하나의 Route에 여러 경로(Link)가 매핑될 수 있어 애플리케이션 내에서 동일한 Route로 연결되는 여러 경로(Link)가 존재할 수 있게 됩니다.

## 레이아웃 라우트

이번에는 아마도 Remix에서 처음 도입한(제가 알기로 그렇다는 뜻입니다.) 레이아웃 라우트에 대해 알아보겠습니다.

아까 매핑한 Home과 Users 컴포넌트가 동일한 레이아웃을 공유하는 방법을 살펴볼건데요.

당연히 React 개발자라면 중복을 피하기 위해 Home과 Users 컴포넌트의 스타일링을 별도의 컴포넌트로 추출하는게 좋을 듯 한데요.

이 새로운 컴포넌트에서는 React의 `children` prop을 사용하여 컴포넌트를 만들겠습니다.

첫 번째 단계로, 스타일을 별도의 컴포넌트로 추출합니다.

```jsx
const Home = () => {
  return (
    <>
      <h2>Home</h2>
    </>
  );
};

const Users = () => {
  return (
    <>
      <h2>Users</h2>
    </>
  );
};

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }) => {
  return <main style={{ padding: '1rem 0' }}>{children}</main>;
};
```

위와 같이 스타일을 위한 Layout 컴포넌트를 새로 만들었습니다.

두 번째로, App 컴포넌트에서 이를 렌더링합니다.

React의 `children`을 사용하여 Layout 컴포넌트가 일치하는 하위 라우트를 감싸서 렌더링하도록 합니다.

```jsx
const App = () => {
  return (
    <>
      ...

      <Routes>
        <Layout>
          <Route path="home" element={<Home />} />
          <Route path="users" element={<Users />} />
        </Layout>
      </Routes>
    </>
  );
};
```

보통 위와 같이 하면 될거라고 생각하시는데요.

하지만 React Router에서는 이 방식이 허용되지 않으며, 다음과 같은 예외가 발생합니다.

> `Uncaught Error: [Layout] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>.`

이 문제를 해결할 수 있는 가장 일반적인 방법은 무식하게 각 컴포넌트 내에서 Layout 컴포넌트를 일일이 사용해서 각 Route 컴포넌트 내에서 사용하는 것입니다 (아래 예시를 보시면 됩니다.)

```jsx
const App = () => {
  return (
    <>
      ...

      <Routes>
        <Route path="home" element={<Layout><Home /></Layout>} />
        <Route path="users" element={<Layout><Users /></Layout>} />
      </Routes>
    </>
  );
};
```

하지만 이렇게 하면 React 애플리케이션에 불필요한 중복이 발생합니다.

따라서 이럴 경우에는 좀 더 우아하게 Layout 컴포넌트를 중복되게 사용하지 않고, 소위 "레이아웃 라우트"를 사용하는데요.

실제로는아래와 같이 레이아웃 라우트는 실제 라우트가 아니라 그룹 내의 각 Route 컴포넌트 요소에 동일한 CSS 스타일을 적용하기 위한 방법으로 많이 쓰입니다.

```jsx
const App = () => {
  return (
    <>
      ...

      <Routes>
        <Route element={<Layout />}>
          <Route path="home" element={<Home />} />
          <Route path="users" element={<Users />} />
        </Route>
      </Routes>
    </>
  );
};
```

보시다시피, 다른 Route 컴포넌트 내에 Route 컴포넌트를 중첩할 수 있으며, 여기서 중첩된 Route는 소위 Nested Routes가 됩니다.

여기서 중요한 점은 레이아웃 라우트에서는 React `children` 방식 대신, React Router의 `Outlet` 컴포넌트를 사용한다는 겁니다.

```jsx
import { Routes, Route, Outlet, Link } from 'react-router';

...
...

const Layout = () => {
  return (
    <main style={{ padding: '1rem 0' }}>
      <Outlet />
    </main>
  );
};
```

요약하면, Layout 컴포넌트 내의 Outlet은 부모 라우트(여기서는 Layout 컴포넌트)에 매칭되는 자식 라우트(여기서는 Home 또는 Users 컴포넌트)를 Outlet 위치에 삽입하는거죠.

결국 레이아웃 라우트를 사용하면 CSS 스타일이나 HTML 구조와 같은 동일한 레이아웃을 그룹 내의 각 Route 컴포넌트에 적용할 수 있게됩니다.

## 활성 링크(Active Link)

이제 활성 링크(Active Link) 기능 구현 방법을 한번 알아볼까요?

App 컴포넌트의 헤드라인, 네비게이션 관련 정보를 새로운 Layout 컴포넌트로 옮길 수 있습니다.

또한, Link 대신 NavLink 컴포넌트를 사용하여 현재 활성화된 경로를 사용자에게 보여주는 활성 링크를 구현할 수 있는데요.

새롭게 추가된 NavLink 컴포넌트는 함수 형태의 style props에서 `isActive` 플래그를 제공합니다.

```jsx
import {
  ...
  NavLink,
} from 'react-router';

const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="home" element={<Home />} />
        <Route path="users" element={<Users />} />
      </Route>
    </Routes>
  );
};

const Layout = () => {
  const style = ({ isActive }: NavLinkRenderProps) => ({
    fontWeight: isActive ? "bold" : "normal",
  });

  return (
    <>
      <h1>React Router</h1>

      <nav
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem",
        }}
      >
        <NavLink to="/home" style={style}>Home</NavLink>
        <NavLink to="/users" style={style}>Users</NavLink>
      </nav>

      <main style={{ padding: "1rem 0" }}>
        <Outlet />
      </main>
    </>
  );
};
```

오늘은 여기까지 공부했는데요.

지금까지 만든 React 애플리케이션에 기본 경로가 없다는 점을 눈치챌 수 있는데요.

'/home'과 '/users' 경로는 있지만, '/'' 경로는 없습니다.

브라우저 개발자 도구로 들어가시면  `No routes matched location "/"` 경고가 나타나 있을 겁니다.

## 인덱스 라우트

따라서 사용자가 방문할 때 `/` 경로에 대해 소위 인덱스 라우트를 생성해야하는데요.

이 폴백(fallback) 라우트 성격을 갖는 인덱스 라우트는 새 컴포넌트가 될 수도 있고, 이미 매칭된 라우트가 될 수도 있습니다

(예를 들어, 아래 예를 보시면 `/` 경로에서 Home이 렌더링되는거죠, /home에 Home 컴포넌트가 렌더링 되는게 아닙니다.)

```jsx
const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="users" element={<Users />} />
      </Route>
    </Routes>
  );
};
```

그 후, Layout 컴포넌트 내의 NavLink 컴포넌트도 새로운 인덱스 라우트를 반영하도록 조정해 보겠습니다.

```jsx
<NavLink to="/" style={style}>Home</NavLink>
<NavLink to="/users" style={style}>Users</NavLink>
```

인덱스 라우트는 부모 경로와 매칭되지만, 하위 경로가 없을 때 기본적으로 렌더링되는 라우트라고 생각할 수 있습니다.

## 일치하지 않는(No Match) 라우트

다음으로, 사용자가 일치하지 않는 경로(예: `/about`)로 이동할 경우, 소위 No Match Route(또는 Not Found Route)를 추가하여 웹사이트의 404 페이지와 같은 역할을 하는 라우트가 있는데요.

```jsx
const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="users" element={<Users />} />
        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes>
  );
};

const NoMatch = () => {
  return (<p>There's nothing here: 404!</p>);
};
```

지금까지, Route 컴포넌트 모음을 위한 컨테이너인 Routes를 사용하면서 Layout 라우트, 인덱스 라우트, 그리고 No Match 라우트를 활용한 React Router의 모범 사례들을 살펴보았습니다.

마지막으로, 활성 상태를 표시하고자 할 때는 Link 대신 NavLink 컴포넌트를 사용할 수 있습니다.

기본적으로 이것이 React Router 사용의 기본 개념입니다.

다음 섹션에서 중첩 라우트에 대해 더 알아봅니다.

그럼.
