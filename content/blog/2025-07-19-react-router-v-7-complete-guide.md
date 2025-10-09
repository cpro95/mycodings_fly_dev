---
slug: 2025-07-19-react-router-v-7-complete-guide
title: React Router v7 완벽 가이드 기본부터 고급 활용까지
date: 2025-07-19 09:56:05.623000+00:00
summary: React Router v7의 기본 라우팅부터 동적 라우트, 인증, 코드 분할까지 모든 것을 다루는 종합 튜토리얼입니다. 실용적인 예제와 함께 실무 역량을 키워보세요.
tags: ["React", "React Router", "리액트", "리액트 라우터", "튜토리얼", "프론트엔드", "SPA", "라우팅", "인증", "코드 분할"]
contributors: []
draft: false
---

모던 웹 개발에서 싱글 페이지 애플리케이션(SPA)은 이제 표준이 되었습니다.<br /><br />React는 이러한 SPA를 구축하는 데 가장 인기 있는 라이브러리 중 하나이며, 'React Router'는 React 생태계에서 라우팅을 구현하는 사실상의 표준 라이브러리입니다.<br /><br />사용자가 페이지를 이동할 때마다 서버에 새로운 페이지를 요청하는 대신, 클라이언트 측에서 필요한 컴포넌트만 교체하여 훨씬 빠르고 부드러운 사용자 경험을 제공할 수 있습니다.<br /><br />이 글에서는 React Router v7의 핵심 개념부터 실무에서 마주할 수 있는 고급 활용법까지, 포괄적인 내용을 다루어 보겠습니다.<br /><br />기본적인 라우팅 설정부터 동적 라우트, 중첩 라우트, 인증을 적용한 보호된 라우트, 그리고 성능 최적화를 위한 코드 분할(Lazy Loading)까지 모든 것을 단계별로 학습합니다.<br /><br />

## 1. 프로젝트 준비 및 기본 설정
<br />

가장 먼저 React 프로젝트를 생성해야 합니다.<br /><br />최근에는 'Vite'를 사용하여 빠르고 간편하게 프로젝트를 시작하는 것이 일반적입니다.<br /><br />터미널에서 다음 명령어를 실행하여 Vite 기반의 React 프로젝트를 생성합니다.<br /><br />

```bash
npm create vite@latest my-react-router-app -- --template react-ts
```
<br />

프로젝트가 생성되면 해당 폴더로 이동하여 React Router를 설치합니다.<br /><br />

```bash
cd my-react-router-app
npm install react-router-dom
```
<br />

React Router를 애플리케이션에 적용하려면, 가장 먼저 '이 애플리케이션이 라우팅 기능을 사용한다'는 것을 알려주어야 합니다.<br /><br />보통 프로젝트의 최상위 파일인 `src/main.tsx` 파일에서 `BrowserRouter` 컴포넌트로 `App` 컴포넌트를 감싸줍니다.<br /><br />

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```
<br />

이제 애플리케이션 전체에서 React Router의 기능을 사용할 준비가 완료되었습니다.<br /><br />본격적인 구현은 `App.tsx` 파일에서 진행하겠습니다.<br /><br />

## 2. 기본 라우팅과 네비게이션
<br />

가장 기본적인 라우팅은 사용자가 클릭할 수 있는 링크를 만들고, 해당 링크에 맞는 페이지 컴포넌트를 보여주는 것입니다.<br /><br />`Link` 컴포넌트를 사용하여 네비게이션 메뉴를 만들어 보겠습니다.<br /><br />

```tsx
import { Routes, Route, Link } from 'react-router-dom';

const App = () => {
  return (
    <>
      <h1>React Router</h1>
      <Navigation />

      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/users" element={<Users />} />
      </Routes>
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
      <Link to="/users" style={{ marginLeft: '1rem' }}>Users</Link>
    </nav>
  );
};

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

export default App;
```
<br />

여기서 핵심은 `Link` 컴포넌트와 `Route` 컴포넌트의 관계입니다.<br /><br />`Link`의 `to` 속성에 지정된 경로와 `Route`의 `path` 속성에 지정된 경로가 일치하면, `element` 속성에 지정된 컴포넌트가 화면에 렌더링됩니다.<br /><br />브라우저에서 애플리케이션을 실행하고 Home과 Users 링크를 클릭해 보세요.<br /><br />URL이 변경되면서 그에 맞는 컴포넌트가 보이는 것을 확인할 수 있습니다.<br /><br />이것이 React Router의 가장 본질적인 기능입니다.<br /><br />

## 3. UI 구조화를 위한 고급 라우팅
<br />

실제 애플리케이션은 단순히 페이지만 전환하는 것을 넘어, 공통된 레이아웃, 기본 페이지, 존재하지 않는 페이지 처리 등 복잡한 구조를 가집니다.<br /><br />

### 레이아웃 라우트와 Outlet
<br />

위 예제에서 `Home`과 `Users` 컴포넌트는 동일한 `main` 태그와 스타일을 중복해서 사용하고 있습니다.<br /><br />이러한 공통 구조를 '레이아웃 컴포넌트'로 분리하여 코드를 더 효율적으로 관리할 수 있습니다.<br /><br />React Router는 이를 위해 '레이아웃 라우트'와 `Outlet`이라는 강력한 기능을 제공합니다.<br /><br />

```tsx
import { Routes, Route, Link, Outlet } from 'react-router-dom';

const App = () => {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/users" element={<Users />} />
        </Route>
      </Routes>
    </>
  );
};

const Layout = () => {
  return (
    <>
      <h1>React Router</h1>
      <nav
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem",
        }}
      >
        <Link to="/home">Home</Link>
        <Link to="/users" style={{ marginLeft: '1rem' }}>Users</Link>
      </nav>
      <main style={{ padding: '1rem 0' }}>
        <Outlet />
      </main>
    </>
  );
};

const Home = () => <h2>Home</h2>;
const Users = () => <h2>Users</h2>;

export default App;
```
<br />

`Route` 컴포넌트를 중첩하여 부모 `Route`의 `element`로 `Layout` 컴포넌트를 지정했습니다.<br /><br />`Layout` 컴포넌트 내부의 `Outlet` 컴포넌트는 현재 URL 경로와 일치하는 자식 `Route`의 `element`(즉, `Home` 또는 `Users` 컴포넌트)가 렌더링될 위치를 지정합니다.<br /><br />이 패턴을 사용하면 헤더, 푸터, 사이드바 등 공통 UI를 한 곳에서 관리할 수 있어 애플리케이션의 유지보수성이 크게 향상됩니다.<br /><br />

### 활성 링크 스타일링 NavLink
<br />

사용자가 현재 어떤 페이지에 있는지 시각적으로 알려주는 것은 UX에 매우 중요합니다.<br /><br />`Link` 대신 `NavLink` 컴포넌트를 사용하면 현재 활성화된 링크에 쉽게 스타일을 적용할 수 있습니다.<br /><br />

```tsx
import { NavLink, Outlet } from 'react-router-dom';

const Layout = () => {
  const style = ({ isActive }: { isActive: boolean }) => ({
    fontWeight: isActive ? "bold" : "normal",
    marginRight: '1rem',
  });

  return (
    <>
      <h1>React Router</h1>
      <nav style={{ borderBottom: "solid 1px", paddingBottom: "1rem" }}>
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
<br />

`NavLink`의 `style` 프롭에 함수를 전달하면, 해당 링크가 활성화되었을 때 `isActive` 값이 `true`로 전달됩니다.<br /><br />이를 이용해 조건부로 스타일을 적용할 수 있습니다.<br /><br />

### 인덱스 라우트 (Index Route)
<br />

현재 애플리케이션은 `/home`이나 `/users` 경로는 있지만, 최상위 경로(`/`)에 방문했을 때는 아무것도 보이지 않습니다.<br /><br />부모 라우트 경로와 정확히 일치할 때 기본적으로 보여줄 자식 라우트를 지정하고 싶을 때 `index` 라우트를 사용합니다.<br /><br />

```tsx
// App.tsx
<Routes>
  <Route path="/" element={<Layout />}>
    <Route index element={<Home />} />
    <Route path="users" element={<Users />} />
  </Route>
</Routes>

// Layout.tsx
<NavLink to="/" style={style}>Home</NavLink>
<NavLink to="/users" style={style}>Users</NavLink>
```
<br />

이제 `path` 대신 `index`라는 프롭을 사용했습니다.<br /><br />또한 `Layout`의 경로를 `/`로 변경하고, Home 링크의 `to` 속성도 `/`로 수정했습니다.<br /><br />이렇게 하면 사용자가 웹사이트의 루트 주소로 접속했을 때 `Home` 컴포넌트가 기본적으로 렌더링됩니다.<br /><br />

### 일치하지 않는 라우트 처리 (No Match Route)
<br />

사용자가 존재하지 않는 URL(예: `/about`)로 접근했을 때를 대비해 '페이지를 찾을 수 없습니다'와 같은 메시지를 보여주는 것이 좋습니다.<br /><br />`path="*"`를 사용하면 다른 모든 라우트와 일치하지 않는 경우에 렌더링될 컴포넌트를 지정할 수 있습니다.<br /><br />

```tsx
// App.tsx
<Routes>
  <Route path="/" element={<Layout />}>
    <Route index element={<Home />} />
    <Route path="users" element={<Users />} />
    <Route path="*" element={<NoMatch />} />
  </Route>
</Routes>

// NoMatch.tsx
const NoMatch = () => {
  return <p>페이지를 찾을 수 없습니다: 404!</p>;
};
```
<br />

이로써 애플리케이션의 기본적인 라우팅 구조가 완성되었습니다.<br /><br />

## 4. 동적 라우팅과 중첩 라우트
<br />

많은 경우, 라우트 경로는 고정되어 있지 않고 동적으로 변합니다.<br /><br />예를 들어, 사용자 목록에서 특정 사용자를 클릭하면 `/users/1`이나 `/users/2`와 같이 고유 ID를 가진 상세 페이지로 이동해야 합니다.<br /><br />

### 동적 세그먼트와 useParams
<br />

`Users` 페이지에 사용자 목록을 표시하고, 각 사용자를 클릭하면 상세 페이지로 이동하도록 구현해 보겠습니다.<br /><br />

```tsx
import { Routes, Route, Link, Outlet, useParams } from 'react-router-dom';

const App = () => {
  const users = [
    { id: '1', fullName: 'Robin Wieruch' },
    { id: '2', fullName: 'Sarah Finnley' },
  ];

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="users" element={<Users users={users} />}>
          <Route path=":userId" element={<User />} />
        </Route>
        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes>
  );
};

// Users 컴포넌트 수정
const Users = ({ users }) => {
  return (
    <>
      <h2>Users</h2>
      <nav>
        {users.map((user) => (
          <div key={user.id}>
            <Link to={user.id}>{user.fullName}</Link>
          </div>
        ))}
      </nav>
      <Outlet />
    </>
  );
};

// 새로운 User 컴포넌트
const User = () => {
  const { userId } = useParams();

  return (
    <>
      <h3>User: {userId}</h3>
      <Link to="/users">Back to Users</Link>
    </>
  );
};
```
<br />

여기서 몇 가지 중요한 개념이 등장했습니다.<br /><br />

첫째, `path=":userId"`와 같이 콜론(`:`)으로 시작하는 경로 세그먼트는 '동적 세그먼트'입니다.<br /><br />`:userId` 부분에는 어떤 문자열이든 올 수 있으며, React Router는 이를 `userId`라는 파라미터로 인식합니다.<br /><br />

둘째, `User` 컴포넌트에서 `useParams` 훅을 사용하여 URL의 동적 파라미터 값(`userId`)을 객체 형태로 가져올 수 있습니다.<br /><br />

셋째, `users` 라우트 안에 `:userId` 라우트를 중첩시켰습니다.<br /><br />따라서 상세 정보가 표시될 위치를 `Users` 컴포넌트 안에 `Outlet`으로 지정해주어야 합니다.<br /><br />

또한, `Users` 컴포넌트의 `Link`에서 `to={user.id}`처럼 상대 경로를 사용한 점도 주목할 만합니다.<br /><br />React Router v6부터는 현재 경로를 기준으로 상대적인 탐색이 가능해져 코드가 훨씬 간결해졌습니다.<br /><br />

## 5. 사용자 경험 향상을 위한 고급 기능
<br />

이제 기본적인 라우팅을 넘어, 실제 애플리케이션에서 사용자 경험을 향상시키는 몇 가지 고급 기능을 살펴보겠습니다.<br /><br />

### 프로그래밍 방식 네비게이션 useNavigate
<br />

때로는 `Link` 컴포넌트를 클릭하는 것이 아니라, 특정 로직(예: 폼 제출, 데이터 삭제)이 완료된 후 코드로 직접 페이지를 이동시켜야 할 때가 있습니다.<br /><br />`useNavigate` 훅을 사용하면 이 작업을 수행할 수 있습니다.<br /><br />

```tsx
import { useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';

// ... App.tsx에서 users를 state로 관리하고 삭제 핸들러를 전달

const App = () => {
  const [users, setUsers] = useState([/* ... */]);
  const navigate = useNavigate();

  const handleRemoveUser = (userId) => {
    setUsers((state) => state.filter((user) => user.id !== userId));
    navigate('/users'); // 사용자를 삭제한 후 목록 페이지로 이동
  };
  
  // ... Route에서 onRemoveUser 프롭 전달
  <Route path=":userId" element={<User onRemoveUser={handleRemoveUser} />} />
};

// User 컴포넌트 수정
const User = ({ onRemoveUser }) => {
  const { userId } = useParams();

  return (
    <>
      <h3>User: {userId}</h3>
      <button type="button" onClick={() => onRemoveUser(userId)}>
        Remove User
      </button>
      <Link to="/users">Back to Users</Link>
    </>
  );
};
```
<br />

사용자 삭제 버튼을 클릭하면 `handleRemoveUser` 함수가 호출되고, 상태 업데이트 후 `navigate('/users')`가 실행되어 사용자를 목록 페이지로 리디렉션합니다.<br /><br />

### 검색 파라미터(쿼리 스트링) 관리 useSearchParams
<br />

URL의 `?` 뒤에 오는 `key=value` 형태의 문자열을 '검색 파라미터' 또는 '쿼리 스트링'이라고 합니다.<br /><br />주로 필터링, 정렬, 검색어 같은 상태를 URL에 저장하여 다른 사람과 공유할 수 있게 만들 때 유용합니다.<br /><br />`useSearchParams` 훅은 `useState`와 유사하게 작동하지만, 상태를 컴포넌트 내부가 아닌 URL에 저장합니다.<br /><br />

```tsx
import { useSearchParams } from 'react-router-dom';

const Users = ({ users }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get('name') || '';

  const handleSearch = (event) => {
    const name = event.target.value;
    if (name) {
      setSearchParams({ name });
    } else {
      setSearchParams({});
    }
  };

  const filteredUsers = users.filter((user) =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <h2>Users</h2>
      <input type="text" value={searchTerm} onChange={handleSearch} />
      {/* ... filteredUsers를 사용하여 목록 렌더링 ... */}
      <Outlet />
    </>
  );
};
```
<br />

`searchParams.get('name')`으로 URL에서 `name` 파라미터 값을 읽어오고, `setSearchParams({ name })`으로 값을 업데이트합니다.<br /><br />`input`에 값을 입력하면 URL이 `/users?name=robin`과 같이 변경되고, 페이지를 새로고침하거나 링크를 공유해도 검색 상태가 유지됩니다.<br /><br />

## 6. 인증 및 접근 제어
<br />

대부분의 웹 애플리케이션에는 로그인한 사용자만 접근할 수 있는 '보호된 페이지'가 존재합니다.<br /><br />React Router 자체는 인증 로직을 수행하지 않지만, 인증 상태에 따라 라우팅을 제어하는 강력한 메커니즘을 제공합니다.<br /><br />

### 인증 컨텍스트(Context) 생성
<br />

먼저, 애플리케이션 전역에서 인증 상태(로그인 여부, 사용자 정보)를 관리하기 위해 React의 `Context API`를 사용하는 것이 일반적입니다.<br /><br />

```tsx
// auth.tsx
import { createContext, useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async () => {
    // 실제로는 API 호출을 통해 사용자 정보를 받아옵니다.
    const fakeUser = { id: '1', name: 'robin' };
    setUser(fakeUser);
    
    // 사용자가 원래 가려던 페이지로 리디렉션
    const origin = location.state?.from?.pathname || '/dashboard';
    navigate(origin);
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  const value = {
    user,
    onLogin: handleLogin,
    onLogout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
```
<br />

`AuthProvider` 컴포넌트는 `user` 상태와 로그인/로그아웃 함수를 관리하며, `useAuth` 커스텀 훅을 통해 하위 컴포넌트에서 이 값들을 쉽게 사용할 수 있습니다.<br /><br />`App` 컴포넌트 전체를 `AuthProvider`로 감싸주어야 합니다.<br /><br />

### 보호된 라우트 (Protected Route)
<br />

이제 인증된 사용자만 접근할 수 있도록 특정 라우트를 보호하는 `ProtectedRoute` 컴포넌트를 만들 차례입니다.<br /><br />

```tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './auth';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // 사용자가 로그인하지 않았다면 로그인 페이지로 리디렉션합니다.
    // 현재 위치(location)를 state로 넘겨서 로그인 후 돌아올 수 있도록 합니다.
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
};
```
<br />

이 컴포넌트는 `useAuth`를 통해 사용자 정보를 확인합니다.<br /><br />사용자가 없으면 로그인 페이지(여기서는 '/')로 리디렉션하고, 있다면 전달받은 `children`을 그대로 렌더링합니다.<br /><br />`Navigate` 컴포넌트의 `replace` 속성은 브라우저 히스토리에 현재 경로를 남기지 않도록 하여, 사용자가 '뒤로 가기'를 눌렀을 때 로그인 페이지로 다시 돌아가는 현상을 방지합니다.<br /><br />

이제 이 `ProtectedRoute`를 실제 라우트에 적용합니다.<br /><br />

```tsx
// App.tsx
<Routes>
  <Route path="/" element={<Home />} /> {/* Home은 로그인 페이지 역할 */}
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />
  <Route path="*" element={<NoMatch />} />
</Routes>
```
<br />

이렇게 하면 로그인하지 않은 사용자가 `/dashboard`로 직접 접근하려고 할 때, 자동으로 홈페이지로 리디렉션됩니다.<br /><br />로그인에 성공하면 `AuthProvider`의 `handleLogin` 함수가 이전에 시도했던 `/dashboard` 경로로 사용자를 보내줍니다.<br /><br />

## 7. 성능 최적화 코드 분할 (Lazy Loading)
<br />

애플리케이션 규모가 커지면 모든 코드를 하나의 자바스크립트 파일로 묶는 것이 비효율적일 수 있습니다.<br /><br />사용자가 방문하지도 않은 페이지의 코드까지 처음부터 전부 다운로드해야 하기 때문입니다.<br /><br />React의 `React.lazy`와 `Suspense`를 사용하면 '코드 분할'을 통해 라우트별로 코드를 나눌 수 있습니다.<br /><br />

```tsx
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Link } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));

const App = () => {
  return (
    <>
      <h1>React Router Lazy Loading</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="about" element={<About />} />
        </Routes>
      </Suspense>
    </>
  );
};
```
<br />

`React.lazy` 함수는 동적 `import()` 구문을 사용하여 컴포넌트를 불러옵니다.<br /><br />이렇게 로드된 컴포넌트는 처음 렌더링될 때 해당 코드 조각(chunk)을 비동기적으로 다운로드합니다.<br /><br />`Suspense` 컴포넌트는 lazy-loaded 컴포넌트가 로드되는 동안 보여줄 fallback UI(예: 로딩 스피너)를 지정하는 역할을 합니다.<br /><br />이 기법을 적용하면 초기 로딩 속도를 크게 개선하여 사용자 경험을 향상시킬 수 있습니다.<br /><br />

## 마무리하며
<br />

지금까지 React Router v7의 핵심 기능들을 A부터 Z까지 살펴보았습니다.<br /><br />단순한 페이지 전환에서 시작하여 공통 레이아웃 관리, 동적 경로 처리, 프로그래밍 방식 네비게이션, URL을 통한 상태 관리, 그리고 인증과 성능 최적화에 이르기까지, React Router는 현대적인 SPA를 구축하는 데 필요한 모든 도구를 제공합니다.<br /><br />이 글에서 다룬 개념들을 바탕으로 여러분의 프로젝트에 라우팅을 자신 있게 적용하고, 더 나은 사용자 경험을 제공하는 애플리케이션을 만들어 보시길 바랍니다.<br /><br />
