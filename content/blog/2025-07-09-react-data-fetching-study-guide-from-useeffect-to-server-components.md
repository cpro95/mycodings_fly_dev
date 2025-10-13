---
slug: 2025-07-09-react-data-fetching-study-guide-from-useeffect-to-server-components
title: 리액트 데이터 페칭 완전 정복 - useEffect부터 서버 컴포넌트까지
date: 2025-07-09 12:13:05.305000+00:00
summary: 리액트 데이터 페칭의 기초부터 최신 서버 컴포넌트까지, 단계별 발전 과정을 예제와 함께 완벽하게 알아봅니다.
tags: ["react", "리액트", "data fetching", "useEffect", "ReactQuery", "react query", "swr", "server component", "frontend"]
contributors: []
draft: false
---

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEihw1wRL-cjdbu5hu1gC7Bn_qToez9rIJmULCxCJX1tMBTWz_udAMDHeb_ned8rfd1Bsanc-XiwXmGJpkmgEoRb0mP74_BNe7UNnwq9JzkzgLv8KpIqiv81PaWv1ifDtCMbzvBA9tkqs2PW824IT3tiuDU3tKupmCeLp3gM0gJrPFuNa1l2al3sISkx_os/s16000/1_ycqhUTo1LqydeC355iHRoA.jpg)

리액트 개발자라면 누구나 한 번쯤은 "서버에서 데이터를 어떻게 가져와야 가장 좋을까?" 라는 고민을 해보셨을 겁니다.

단순히 화면에 데이터를 보여주는 것을 넘어, 로딩 중일 때는 어떻게 처리하고, 만약 에러가 발생하면 사용자에게 어떻게 알려줘야 할까요.

이 글은 리액트에서 데이터를 가져오는 방법이 어떻게 발전해왔는지, 그 여정을 처음부터 끝까지 따라가는 완벽한 스터디 가이드입니다.

가장 기초적인 `useEffect` 훅에서 시작해 최신 기술인 서버 컴포넌트까지, 여러분의 데이터 페칭 실력을 한 단계 끌어올릴 준비, 되셨습니까.

### 1단계: 모든 것의 시작, `useEffect`와의 첫 만남

리액트에서 서버 데이터를 가져오는 가장 기본적인 출발점은 바로 `useEffect` 훅입니다.

컴포넌트가 처음 화면에 그려진 후, 서버에 "데이터를 주세요"라고 요청을 보내는 방식인데요.

가장 순수한 형태의 코드를 먼저 보겠습니다.

```javascript
import { useState, useEffect } from 'react';

function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('https://api.example.com/posts')
      .then(response => response.json())
      .then(data => setPosts(data));
  }, []); // 빈 배열은 컴포넌트가 처음 렌더링될 때 한 번만 실행하라는 의미입니다.

  // ... posts를 화면에 그리는 JSX ...
}
```

아주 간단하고 직관적입니다.

하지만 이 코드에는 몇 가지 치명적인 문제가 숨어있습니다.

데이터를 가져오는 동안 사용자는 아무런 피드백 없이 흰 화면만 보게 될 것이고, 만약 네트워크 문제로 에러가 발생해도 아무 일도 일어나지 않습니다.

### 2단계: 사용자를 위한 배려, 로딩과 에러 상태 관리

좋은 사용자 경험을 위해서는 현재 상태를 명확히 알려줘야 합니다.

"데이터를 열심히 가져오는 중입니다" 또는 "죄송합니다, 문제가 발생했습니다" 같은 메시지가 필요한데요.

이를 위해 `useState`를 사용해 로딩(loading)과 에러(error) 상태를 추가로 관리해야 합니다.

```javascript
import { useState, useEffect } from 'react';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
  const [error, setError] = useState(null); // 에러 상태 추가

  useEffect(() => {
    // 요청 시작 전, 상태 초기화
    setIsLoading(true);
    setError(null);

    fetch('https://api.example.com/posts')
      .then(response => {
        if (!response.ok) {
          throw new Error('데이터를 불러오는 데 실패했습니다.');
        }
        return response.json();
      })
      .then(data => {
        setPosts(data);
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        // 성공하든 실패하든 로딩 상태는 끝
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <p>로딩 중...</p>;
  if (error) return <p>에러: {error}</p>;

  // ... posts를 화면에 그리는 JSX ...
}
```

이제 좀 더 견고한 코드가 되었습니다.

하지만 아직도 해결해야 할 숨겨진 문제가 하나 더 남아있습니다.

### 3단계: 전문가의 한 끗 차이, 클린업(Cleanup) 처리

만약 데이터 요청을 보낸 후, 응답이 도착하기 전에 사용자가 다른 페이지로 이동해버리면 어떻게 될까요.

컴포넌트는 이미 화면에서 사라졌는데, 뒤늦게 도착한 데이터가 사라진 컴포넌트의 상태를 변경하려고 시도하면서 메모리 누수(memory leak) 경고가 발생할 수 있습니다.

이를 방지하기 위해 `useEffect`의 '클린업 함수' 기능을 사용해야 합니다.

컴포넌트가 사라질 때, 진행 중이던 데이터 요청을 취소하라는 신호를 보내는 것입니다.

```javascript
// ... 이전 코드와 동일 ...

useEffect(() => {
  const controller = new AbortController(); // 요청을 제어할 컨트롤러 생성
  const signal = controller.signal;

  // ... fetch 로직 시작 ...
  fetch('https://api.example.com/posts', { signal }) // fetch에 signal을 넘겨줍니다.
    // ... .then, .catch, .finally 로직 동일 ...

  // 클린업 함수
  return () => {
    // 컴포넌트가 사라지면 요청을 중단합니다.
    controller.abort();
  };
}, []);

// ... JSX 렌더링 ...
```

이제 우리는 데이터 페칭의 기본적인 3요소(요청, 상태관리, 클린업)를 모두 갖춘 코드를 완성했습니다.

### 4단계: 재사용을 위한 도약, 커스텀 훅(Custom Hook)

위 코드는 잘 작동하지만, 데이터를 가져와야 하는 컴포넌트가 생길 때마다 이 긴 코드를 계속 복사-붙여넣기 해야 합니다.

이것은 매우 비효율적입니다.

이때, 반복되는 로직을 별도의 함수로 뽑아내어 재사용하는 '커스텀 훅'이 등장합니다.

`useFetch`라는 이름의 우리만의 훅을 만들어 볼까요.


```javascript
import { useState, useEffect } from 'react';

function useFetch(url) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    setIsLoading(true);
    setError(null);

    fetch(url, { signal })
      .then(response => {
        if (!response.ok) throw new Error('요청 실패');
        return response.json();
      })
      .then(data => setData(data))
      .catch(err => {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [url]); // url이 변경될 때마다 다시 데이터를 가져옵니다.

  return { data, isLoading, error };
}

// 이제 컴포넌트에서는 이렇게 간단하게 사용합니다.
function PostList() {
  const { data: posts, isLoading, error } = useFetch('https://api.example.com/posts');

  if (isLoading) return <p>로딩 중...</p>;
  if (error) return <p>에러: {error}</p>;

  // ... posts를 화면에 그리는 JSX ...
}
```

정말 코드가 깔끔해졌습니다.

하지만 이 `useFetch` 훅도 만능은 아닙니다.

캐싱(caching), 포커스 시 데이터 자동 갱신, 동일 요청 중복 제거 같은 고급 기능들은 직접 구현하기 매우 복잡합니다.

### 5단계: 현업의 표준, React Query와 SWR

바로 이 지점에서 데이터 페칭 전문 라이브러리가 등장합니다.

가장 대표적인 것이 바로 TanStack Query(구 React Query)와 SWR입니다.

이 라이브러리들은 우리가 `useFetch`에서 고민했던 모든 것들은 물론, 그 이상의 복잡한 기능들을 아주 간단한 API 뒤에 숨겨두었습니다.

- **강력한 캐싱:** 한번 가져온 데이터는 기억해두었다가 즉시 보여주고, 배경에서 조용히 최신 데이터인지 확인합니다.

- **자동 재요청:** 사용자가 다른 창을 봤다가 다시 돌아오거나, 네트워크가 다시 연결되었을 때 자동으로 데이터를 갱신합니다.

- **상태 관리 자동화:** 로딩, 에러, 성공 상태를 완벽하게 관리해줍니다.


```javascript
import { useQuery } from '@tanstack/react-query';

async function fetchPosts() {
  const response = await fetch('https://api.example.com/posts');
  if (!response.ok) throw new Error('네트워크 에러');
  return response.json();
}

function PostList() {
  // isLoading, error, data를 라이브러리가 모두 알아서 관리해줍니다.
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts
  });

  if (isLoading) return <p>로딩 중...</p>;
  if (error) return <p>에러: {error.message}</p>;

  // ... posts를 화면에 그리는 JSX ...
}
```

커스텀 훅과 비교할 수 없을 정도로 코드가 간결하고 강력해졌습니다.

대부분의 현대적인 리액트 애플리케이션에서는 바로 이 방식을 표준으로 사용하고 있습니다.


### 마지막 단계: 미래의 패러다임, 서버 컴포넌트

리액트의 진화는 멈추지 않습니다.

가장 최신 패러다임인 '서버 컴포넌트'는 데이터 페칭의 개념을 또 한 번 바꾸고 있습니다.

서버 컴포넌트는 이름처럼 서버에서 실행되는 컴포넌트인데요.

덕분에 `useEffect`나 `useState` 없이, 마치 일반적인 비동기 함수처럼 컴포넌트 안에서 직접 `await`를 사용해 데이터를 가져올 수 있습니다.

```javascript
// 이 컴포넌트는 서버에서 실행됩니다.
async function PostList() {
  // 컴포넌트 함수 자체를 async로 만들고 바로 await를 사용합니다.
  const response = await fetch('https://api.example.com/posts');
  const posts = await response.json();

  // useEffect, useState, isLoading, error 모두 필요 없습니다.
  return (
    <ul>
      {posts.map(post => <li key={post.id}>{post.title}</li>)}
    </ul>
  );
}
```

로딩과 에러 상태 관리가 사라진 것처럼 보이지만, 사실은 프레임워크(Next.js 등) 수준에서 스트리밍과 서스펜스(Suspense)를 통해 더 세련된 방식으로 처리됩니다.

이는 클라이언트-서버 간의 통신 복잡도를 획기적으로 줄여주는, 리액트 데이터 페칭의 미래입니다.

### 올바른 도구를 올바른 곳에

지금까지 리액트 데이터 페칭의 기나긴 여정을 함께했습니다.

`useEffect`에서 시작해 커스텀 훅을 거쳐, React Query와 같은 전문 라이브러리, 그리고 서버 컴포넌트에 이르기까지.

중요한 것은 어떤 기술이 무조건 최고라고 말하는 것이 아닙니다.

각 단계의 기술이 어떤 문제를 해결하기 위해 등장했는지 그 맥락을 이해하고, 자신의 프로젝트 상황에 맞는 가장 적절한 도구를 선택하는 것이 바로 뛰어난 개발자의 역량일 것입니다.
