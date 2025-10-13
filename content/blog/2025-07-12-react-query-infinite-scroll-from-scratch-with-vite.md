---
slug: 2025-07-12-react-query-infinite-scroll-from-scratch-with-vite
title: 초보자 완벽 가이드 - React Query와 Vite로 무한 스크롤 구현하기 (`useInfiniteQuery` 완전 정복)
date: 2025-07-12 09:47:29.673000+00:00
summary: Vite로 React 프로젝트를 시작하고, React Query를 설정한 뒤, useInfiniteQuery 훅을 사용하여 복잡한 무한 스크롤 UI를 얼마나 쉽고 강력하게 만들 수 있는지 단계별로 알아봅니다.
tags: ["React Query", "useInfiniteQuery", "무한 스크롤", "Vite", "React", "Intersection Observer"]
contributors: []
draft: false
---

안녕하세요!

트위터나 인스타그램 같은 SNS 피드를 스크롤할 때, 우리는 콘텐츠가 끝없이 나타나는 경험에 익숙한데요.

이러한 '무한 스크롤' UI는 현대 웹의 표준처럼 여겨지지만, 막상 직접 구현하려고 하면 생각보다 골치 아픈 문제들을 마주하게 됩니다.

'현재 몇 페이지를 보고 있지?', '다음 페이지가 있긴 한가?', '로딩 중일 때 중복 요청을 막아야지' 등등...

이 모든 상태를 수동으로 관리하다 보면 코드는 금세 스파게티처럼 엉켜버리기 일쑤입니다.

하지만 걱정하지 마세요.

우리에게는 React Query라는 강력한 구원자가 있습니다.

특히 그중에서도 `useInfiniteQuery`라는 훅은 이 모든 복잡성을 마법처럼 해결해 줍니다.

오늘은 Vite로 React 프로젝트를 처음부터 만들고, `useInfiniteQuery`를 사용해 전문가 수준의 무한 스크롤을 얼마나 쉽게 구현할 수 있는지 함께 정복해 보겠습니다.

## 1단계: 프로젝트 생성 및 React Query 설정

모든 것은 깨끗한 프로젝트에서 시작됩니다.

최신 개발 도구인 Vite를 사용해 React와 TypeScript 기반의 프로젝트를 생성하겠습니다.

터미널을 열고 다음 명령어를 입력하세요.

```bash
npm create vite@latest infinite-scroll-app -- --template react-ts
```

프로젝트가 생성되면, 해당 폴더로 이동하여 필요한 라이브러리들을 설치합니다.

-   `@tanstack/react-query`: React Query의 핵심 라이브러리입니다.
-   `axios`: 데이터 페칭을 위한 HTTP 클라이언트입니다. (fetch를 사용해도 무방합니다)
-   `@uidotdev/usehooks`: Intersection Observer를 편리하게 사용하기 위한 훅 라이브러리입니다.

```bash
cd infinite-scroll-app
npm install @tanstack/react-query axios @uidotdev/usehooks
```

라이브러리 설치가 끝났다면, 이제 React Query를 우리 앱 전체에서 사용할 수 있도록 설정해야 합니다.

이것은 매우 중요한 단계입니다.

**`src/main.tsx`** 파일을 열고 아래와 같이 수정해 주세요.


```typescript
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// QueryClient 인스턴스를 생성합니다.
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 앱 전체를 QueryClientProvider로 감싸줍니다. */}
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);
```

`QueryClientProvider`로 `<App />` 컴포넌트를 감싸줌으로써, 우리 앱의 모든 컴포넌트가 React Query의 강력한 캐싱 및 상태 관리 기능에 접근할 수 있게 되었습니다.

이제 모든 준비가 끝났습니다.

## 2단계: `useInfiniteQuery` 깊이 이해하기

본격적인 구현에 앞서, `useInfiniteQuery`의 핵심 개념부터 확실히 짚고 넘어가겠습니다.

이 훅은 여러 페이지의 데이터를 순차적으로 불러와 하나의 목록으로 관리하는 모든 과정을 자동화합니다.

개발자는 더 이상 `const [page, setPage] = useState(1);` 같은 코드를 작성할 필요가 없습니다.

먼저, API 통신을 흉내 낼 가짜 `fetchPosts` 함수를 만들어 보겠습니다.

```typescript
// src/api.ts (새 파일을 만들어 관리하는 것을 추천합니다)
import axios from 'axios';

// 가짜 API 함수: 페이지 번호를 받아 해당 페이지의 게시물 10개를 반환합니다.
export const fetchPosts = async (pageParam: number) => {
  // 5페이지가 넘어가면 빈 배열을 반환하여 '더 이상 데이터 없음'을 시뮬레이션합니다.
  if (pageParam > 5) return [];

  const response = await axios.get('https://jsonplaceholder.typicode.com/posts', {
    params: { _page: pageParam, _limit: 10 },
  });

  // 실제 API처럼 약간의 지연 시간을 줍니다.
  await new Promise(resolve => setTimeout(resolve, 500));

  return response.data;
};
```

이제 이 함수를 사용하는 `useInfiniteQuery` 훅을 만들어 봅시다.

```typescript
// src/hooks/usePosts.ts (커스텀 훅으로 분리하면 재사용성이 높아집니다)
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchPosts } from '../api';

export function usePosts() {
  return useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam }) => fetchPosts(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.length === 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
  });
}
```

코드가 조금 복잡해 보이지만, 각 옵션의 역할을 이해하면 아주 간단합니다.

-   `queryKey: ['posts']`: 이 쿼리의 고유한 이름표입니다.
 React Query는 이 키를 사용해 데이터를 캐싱하고 관리합니다.
-   `queryFn: ({ pageParam }) => fetchPosts(pageParam)`: 실제 데이터를 가져오는 함수입니다.
 여기서 `{ pageParam }` 객체를 인자로 받는데, 이 `pageParam` 값은 React Query가 `initialPageParam`과 `getNextPageParam`을 통해 자동으로 관리해 줍니다.
-   `initialPageParam: 1`: 가장 처음 로드할 페이지의 파라미터 값입니다.
 여기서는 1페이지부터 시작합니다.
-   `getNextPageParam`: 이 훅의 **가장 핵심적인 부분**입니다.
 이 함수는 "다음 페이지를 불러올 때 `pageParam`을 뭘로 써야 할까?"를 React Query에게 알려주는 역할을 합니다.

    -   `lastPage`는 방금 불러온 마지막 페이지의 데이터입니다.
 만약 `lastPage`의 길이가 0이라면, API가 더 이상 줄 데이터가 없다는 뜻이므로 `undefined`를 반환합니다.

    -   `undefined`가 반환되면, React Query는 `hasNextPage` 상태를 `false`로 바꾸고 더 이상 데이터를 요청하지 않습니다.

    -   데이터가 있다면, `lastPageParam + 1`을 반환하여 다음 페이지 번호를 알려줍니다.

## 3단계: 무한 스크롤 UI 컴포넌트 만들기

이제 위에서 만든 `usePosts` 훅을 사용하여 실제 UI를 만들어 보겠습니다.

`useInfiniteQuery`가 반환하는 값들을 활용하는 것이 핵심입니다.

-   `data`: 불러온 모든 데이터가 담겨 있습니다.
 `data.pages`는 `[[1페이지 데이터], [2페이지 데이터], ...]` 형태의 2차원 배열입니다.
-   `fetchNextPage`: 다음 페이지 데이터를 요청하는 함수입니다.
-   `hasNextPage`: 불러올 다음 페이지가 있는지 여부를 나타내는 boolean 값입니다.
-   `isFetchingNextPage`: 다음 페이지를 불러오는 중인지 여부를 나타내는 boolean 값입니다.

이제 이 값들과 `Intersection Observer`를 결합하여 `InfinitePostList` 컴포넌트를 만들어 봅시다.

**`src/components/InfinitePostList.tsx`** 파일을 새로 만드세요.

```typescript
// src/components/InfinitePostList.tsx
import React from 'react';
import { useIntersectionObserver } from '@uidotdev/usehooks';
import { usePosts } from '../hooks/usePosts'; // 우리가 만든 커스텀 훅

const PostCard = ({ post }: { post: any }) => ( // 간단한 게시물 카드 컴포넌트
  <div style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
    <h3>{post.id}. {post.title}</h3>
    <p>{post.body}</p>
  </div>
);

export function InfinitePostList() {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = usePosts();

  const [ref, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: '0px',
  });

  React.useEffect(() => {
    // ref를 가진 요소가 화면에 보이고, 다음 페이지가 있으며, 로딩 중이 아닐 때
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [entry, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 최초 로딩 시
  if (isFetching && !isFetchingNextPage) {
    return <div>전체 데이터를 불러오는 중...</div>;
  }

  if (error) return <div>에러가 발생했습니다: {error.message}</div>;

  return (
    <div>
      <h1>게시물 목록</h1>
      {data?.pages.flat().map(post => (
        <PostCard key={post.id} post={post} />
      ))}

      {/* 이 div가 화면에 보이면 다음 페이지를 불러옵니다. */}
      <div ref={ref} style={{ height: '50px', textAlign: 'center' }}>
        {isFetchingNextPage
          ? '더 많은 게시물을 불러오는 중...'
          : hasNextPage
          ? '아래로 스크롤하여 더 보기'
          : '모든 게시물을 불러왔습니다.'}
      </div>
    </div>
  );
}
```

그리고 이 컴포넌트를 **`src/App.tsx`** 에서 렌더링하도록 수정합니다.

```typescript
// src/App.tsx
import { InfinitePostList } from './components/InfinitePostList';

function App() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <InfinitePostList />
    </div>
  );
}

export default App;
```


이제 `npm run dev`로 프로젝트를 실행하고 스크롤을 내려보세요.

페이지 하단에 닿을 때마다 로딩 메시지가 나타나고 새로운 게시물들이 부드럽게 추가되는 것을 확인할 수 있을 것입니다.

## 4단계: 고급 활용법 (다양한 시나리오)

`useInfiniteQuery`의 진정한 힘은 다양한 API 요구사항에 유연하게 대처할 수 있다는 점입니다.

### 커서(Cursor) 기반 페이지네이션

API가 페이지 번호 대신 다음 페이지를 가리키는 `nextCursor` 같은 값을 반환하는 경우, `getNextPageParam`만 살짝 바꿔주면 됩니다.

```typescript
// ...
getNextPageParam: (lastPage) => {
  // API 응답에 nextCursor가 있다면 그 값을, 없다면 undefined를 반환
  return lastPage.nextCursor ?? undefined;
}
// ...
```

### 메모리 사용량 제어하기

사용자가 수백 페이지를 스크롤하면 캐시에 쌓이는 데이터 양이 부담될 수 있습니다.

이때 `maxPages` 옵션을 사용하면 캐시에 유지할 최대 페이지 수를 제한할 수 있습니다.

```typescript
useInfiniteQuery({
  // ...
  maxPages: 5 // 캐시에 최대 5개의 페이지만 유지합니다.
});
```

새로운 6번째 페이지가 로드되면, 가장 오래된 1번째 페이지 데이터는 캐시에서 자동으로 제거됩니다.

이를 통해 쾌적한 사용자 경험과 안정적인 메모리 관리 두 마리 토끼를 모두 잡을 수 있습니다.

## 복잡함은 라이브러리에게 맡기세요

오늘 우리는 빈 폴더에서 시작해 `useInfiniteQuery`를 사용하여 복잡한 무한 스크롤 기능을 얼마나 간단하고 선언적으로 구현할 수 있는지 직접 확인했습니다.

페이지 상태, 로딩 상태, 데이터 누적 등 골치 아픈 모든 작업은 React Query에게 맡기고, 우리는 그저 "다음 페이지를 어떻게 찾을지"에 대한 규칙만 알려주면 되었습니다.

이것이 바로 좋은 라이브러리가 개발자의 생산성을 어떻게 극대화하는지를 보여주는 완벽한 예시입니다.

이제 여러분의 프로젝트에 무한 스크롤을 추가해야 할 때, 더 이상 망설이지 마세요.

`useInfiniteQuery`가 여러분의 든든한 지원군이 되어줄 것입니다.
