---
slug: 2024-08-25-3-ways-in-data-fetching-with-react
title: 옛날 방식과 React Query, 그리고 서버 컴포넌트까지 React Data Fetching 완전 정복하기
date: 2024-08-25 13:02:28.369000+00:00
summary: 이 글에서는 클라이언트 컴포넌트와 서버 컴포넌트에서 데이터를 가져오는 방법, 캐싱 및 Suspense 활용법, 그리고 React 개발자가 꼭 알아야 할 최신 데이터 페칭 베스트 프랙티스를 상세히 다룹니다.
tags: ["react", "next.js", "data fetching", "react query", "server components"]
contributors: []
draft: false
---

안녕하세요?

React를 오랫동안 공부하고 있는 개발자로서 오늘은 리액트에서의 Data Fetching 방법에 대해 알아보겠습니다.

좀 더 현대적인 방법을 공부하기 전에 초창기때는 어떻게 Data Fetching 했는지 알아보는 것도 좋을 듯 싶습니다.

## 프로젝트 구성

일단 빈 Next.js 앱을 만듭니다.

```sh
npx create-next-app@latest 3-ways-of-fetching-in-react
Need to install the following packages:
create-next-app@14.2.6
Ok to proceed? (y)
✔ Would you like to use TypeScript? … No / Yes
✔ Would you like to use ESLint? … No / Yes
✔ Would you like to use Tailwind CSS? … No / Yes
✔ Would you like to use `src/` directory? … No / Yes
✔ Would you like to use App Router? (recommended) … No / Yes
✔ Would you like to customize the default import alias (@/*)? … No / Yes
Creating a new Next.js app in /Users/cpro95/Codings/Javascript/nextjs/3-ways-of-fetching-in-react.

Using npm.

Initializing project with template: app-tw


Installing dependencies:
- react
- react-dom
- next

Installing devDependencies:
- typescript
- @types/node
- @types/react
- @types/react-dom
- postcss
- tailwindcss
- eslint
- eslint-config-next
```

일단 위와 같이 빈 Next.js 앱을 만들고 page.tsx 파일에서 `<main>` 태그만 남기고 모드 지웁니다.

```ts
import Fetch1 from "@/components/Fetch1";

export default function Home() {
  return (
    <main className="p-10">
      <Fetch1 />
    </main>
  );
}
```

이제 Fetch1 컴포넌트를 만들어야 겠네요.


## 초창기 옛날 방식

초창기 React를 배웠을 때 작성할 수 있는 Best Code가 바로 Fetch1 컴포너트가 되는데요.

옛날에는 이 방식으로 멋지게 작성했었는데요.

지금은 이런 방식은 추천하지 않습니다.

그러나 이 방식은 실제로 React를 처음 배우는 분들은 꼭 한 번 마스터하고 지나가야 좀 더 능숙한 React 개발자가 될 수 있기 때문에 이 방식은 꼭 숙지하시길 바랍니다.

Fetch1 컴포넌트를 아래와 같이 만듭시다.

```tsx
"use client";

import { useEffect, useRef, useState } from "react";

const BASE_URL = "https://jsonplaceholder.typicode.com";

interface Post {
  id: number;
  title: string;
}

export default function Fetch1() {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      setIsLoading(true);

      try {
        const response = await fetch(`${BASE_URL}/posts?page=${page}`, {
          signal: abortControllerRef.current?.signal,
        });
        const posts = (await response.json()) as Post[];
        setPosts(posts);
      } catch (e: any) {
        if (e.name === "AbortError") {
          console.log("Aborted");
          return;
        }

        setError(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [page]);

  if (error) {
    return <div>Something went wrong! Please try again.</div>;
  }

  return (
    <>
      <h1 className="mb-4 text-2xl">Data Fething With Old Way</h1>
      <button
        className="border rounded-lg bg-white text-black"
        onClick={() => setPage(page - 1)}
      >
        Decrease Page ({page})
      </button>
      <button
        className="border rounded-lg bg-gray-300 text-gray-800"
        onClick={() => setPage(page + 1)}
      >
        Increase Page ({page})
      </button>
      {isLoading && <div>Loading...</div>}
      {!isLoading && (
        <ul>
          {posts.map((post) => {
            return <li key={post.id}>{post.title}</li>;
          })}
        </ul>
      )}
    </>
  );
}
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEiywWksFb2U3ooFlvXIfurTnzGTbL_WcCIMMdphaCo8zcQ5av6yPGCM7xLTWy-otYdoScm5uDAjHxQM2vNoSsGfnlm46qCuOCTmZZYca69uRvN9BppJLAAiHLlbqwU3yON8LchnGsMv2PlHhEhe6MyRDJkR3oCRJXpOLxZ4kBjrrAsUxlEvIZ7BxQ50j68)

위 코드를 보시면, 기본 URL(BASE_URL)이 있습니다.

이 URL은 데이터를 가져오는 data의 원천(source)입니다.

그리고 데이터 가져오기에 필요한 모든 것을 처리하는 몇 가지 상태 변수가 있습니다.

`error`, `isLoading`, 실제 데이터를 담는 `posts`, 그리고 페이지 번호를 나타내는 `page` 변수가 있습니다. 

옛날에 배웠듯이 Data Fetching의 모든 작업은 `useEffect` 훅 안에서 처리됩니다.

하나의 `useEffect` 훅 안에 `fetchPosts`라는 함수가 있고, 이 함수는 로딩 상태를 처리하고, 데이터를 가져오기 위해 `fetch` 요청을 보내고, 상태에 데이터를 설정하며, 로딩 상태를 `true`에서 `false`로 변경하고, 에러를 처리하는 역할을 합니다.

또, 경쟁 조건(race condition)을 처리하기 위한 `AbortController`도 포함되어 있습니다.

AbortController은 옛날 방식의 최고로 어려운 방식인데요.

알아두면 좋습니다.

여러분이 React 개발자라면 이와 같은 코드를 몇 번이고 본 적이 있을 건데요.

초보 React 개발자라면 이런 방식으로 Data Fetching하고 싶을 수도 있는데요.

하지만 아까도 누누이 말씀드렸듯이 이 방식은 추천하지 않습니다.

이 방식은 데이터를 가져오는 데 전혀 문제가 없지만, 대신 그다지 효율적이지 않다는데 문제가 있습니다.

그 이유는 다음과 같습니다.

* **모든 것을 직접 처리해야 합니다.** 에러, 로딩, 그리고 다른 모든 상태를 직접 관리하고, `useEffect` 훅을 통해 데이터를 가져오고, 적절한 시점에 상태를 업데이트해야 합니다. 

* **버그가 발생하기 쉽습니다.** 이렇게 많은 코드를 직접 작성하다 보면 쉽게 실수를 범하고 버그를 유발할 수 있습니다.

* **불필요한 작업이 많습니다.** 실제로 필요하지 않은 작업을 많이 해야 합니다.
  
* **기본적인 기능이 부족합니다.** Data Fetching에서 가장 중요한 기능이 없습니다. 캐싱 기능이 없다는 뜻입니다. 첫 페이지의 글을 가져온 후 다음 페이지로 이동했다가 다시 첫 페이지로 돌아오면, 이미 가져온 데이터가 있음에도 불구하고 백엔드에 다시 요청을 보내게 됩니다. 좋은 앱이라면 데이터를 캐싱하고 불필요한 백엔드 요청을 피해야 합니다. 옛날 방식에는 이러한 기능이 없습니다. 실제로 캐싱기능을 직접 구현해야 하는데, 쉽지 않습니다.
  
* **다른 기능도 직접 구현해야 합니다.** 예를 들어 백그라운드 새로고침 기능도 직접 구현해야 합니다. 캐시에 데이터가 있고 사용자에게 표시하고 있는 경우, 백그라운드에서 새 데이터가 있는지 확인하기 위해 요청을 보내는 것이 이상적인 UI입니다. 사용자는 이 작업을 모르는데요. 이 기능도 직접 구현해야 하며, 이 외에도 많은 기능을 직접 구현해야 합니다.

---

## React Query를 사용하는 좀 더 현대적인 Data Fetching 방식

두 번째로 좀 더 현대적인 Data Fetching 방식입니다.

Data Fetching의 최고봉인 React Query 패키지를 이용하는 건데요.

이 패키지는 진짜 만능입니다.

일단 React Query도 클라이언트 상에서 이루어져야 합니다.

layout.tsx 파일에 React Query의 Providers 설정을 먼저 하겠습니다.

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

위와 같이 했으면 이제 components 폴더에 Providers.tsx 파일을 만들어야 하는데요.

```tsx
"use client";

import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

type ProvidersProps = PropsWithChildren;

export default function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
```

위와 같이 하면 이제 React Query를 이용해서 Data Fetching 하는 준비가 끝났습니다.

page.tsx 파일을 아래와 같이 바꿉니다.

```ts
// import Fetch1 from "@/components/Fetch1";
import Fetch2 from "@/components/Fetch2";

export default function Home() {
  return (
    <main className="p-10">
      {/* <Fetch1 /> */}
      <Fetch2 />

    </main>
  );
}
```

이제 Fetch2 컴포넌트를 아래와 같이 만들면 끝입니다.

```tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const BASE_URL = "https://jsonplaceholder.typicode.com";

interface Post {
  id: number;
  title: string;
}

export default function Fetch2() {
  const [page, setPage] = useState(0);

  const {
    data: posts,
    isError,
    isPending,
  } = useQuery({
    queryKey: ["posts", { page }],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/posts?page=${page}`);
      return (await response.json()) as Post[];
    },
  });

  return (
    <>
      <h1 className="mb-4 text-2xl">Data Fething with React Query</h1>
      <button
        className="border rounded-lg bg-white text-black"
        onClick={() => setPage(page - 1)}
      >
        Decrease Page ({page})
      </button>
      <button
        className="border rounded-lg bg-gray-300 text-gray-800"
        onClick={() => setPage(page + 1)}
      >
        Increase Page ({page})
      </button>
      {isPending && <div>Loading...</div>}
      {!isPending && (
        <ul>
          {posts?.map((post) => {
            return <li key={post.id}>{post.title}</li>;
          })}
        </ul>
      )}
    </>
  );
}
```

위 코드에서도 jsonplaceholder에서 데이터를 가져오지만, 코드가 훨씬 간결합니다.

페이지 번호를 나타내는 `page` 상태 변수는 여전히 사용하지만, 옛날 방식의 코드에서처럼 아주 많은 코드를 작성할 필요가 없습니다.

왜냐하면 **React Query**를 사용하기 때문입니다.

React Query는 비동기 상태 관리 솔루션으로, Data Fetching에 매우 적합합니다.

React Query를 사용하면 모든 작업을 자동으로 처리해 줍니다.

옛날 방식에서 했던 모든 작업과 그 외에 더 많은 작업을 자동으로 처리해 주기 때문에, 개발자가 모든 걸 직접 처리할 필요가 없습니다.

코드를 보시면, `data` 변수가 `posts`라는 별칭(alias)으로 사용되고 있으며, 이는 옛날 방식의 `posts`와 동일합니다.

하지만 React Query가 자동으로 관리해 주기 때문에 개발자가 직접 관리할 필요가 없습니다.

또, `isError`는 옛날 방식의 `error`와 동일하며, `isPending`은 로딩 상태를 나타냅니다.

`isFetched`, `isFetchedAfterMount`, `isLoading`, `isLoadingError`, `isPaused` 등 더 많은 변수가 있어 원하는 경우 모두 사용할 수 있습니다.

React Query를 사용하려면 쿼리 키(`queryKey`)와 쿼리 함수(`queryFn`)를 전달해야 합니다.

쿼리 키는 어떤 쿼리를 가져오는지 정의하는 역할을 합니다.

쿼리 함수는 옛날 방식에서와 같이 데이터를 가져오는 URL을 지정하고, 반환된 데이터는 `data` 속성에 저장됩니다.

React Query는 에러 상태, 로딩 상태를 자동으로 처리해 주고, 그리고 UI를 구성하는 JSX에서도 옛날 방식과 같은 방식으로 사용할 수 있습니다.

하지만 코드가 훨씬 간결하고, 개발자가 대부분의 기능을 직접 처리할 필요가 없습니다.

그리고 React Query는 전세계 수많은 사용자가 실제 프로덕션(Production)에 사용할 정도로 아주 많은 테스트를 거쳤고 거의 버그가 없습니다.

그리고 React Query의 가장 큰 장점 중 하나는 **캐싱** 기능입니다.

옛날 방식에서는 캐싱을 직접 구현해야 했지만, React Query에서는 쿼리 키를 통해 자동으로 캐싱을 처리해 줍니다.

예를 들어 `posts`와 `page`를 쿼리 키로 사용하면, 페이지 0의 데이터를 가져온 후 다시 페이지 0의 데이터를 가져오려고 할 때, 백엔드에 다시 요청을 보내는 대신 캐시에서 결과를 반환합니다.

이는 성능 향상에 큰 도움이 됩니다.

또한, 캐시 유효 시간(`stale time`), 가비지 콜렉션 시간(`GC time`) 등을 설정하여 캐싱을 사용자가 임의로 지정할 수 있습니다.

React Query의 또 다른 장점은 **데이터 공유**입니다.

같은 쿼리를 다른 컴포넌트에서 사용해도 백엔드에 다시 요청을 보내는 대신 캐시에서 데이터를 가져오기 때문에 효율적입니다.

옛날 방식에서 같은 코드를 다른 컴포넌트에 넣으면 같은 데이터를 가져오는 두 개의 요청이 백엔드에 전송되는데, 아주 비효율적입니다.

물론 React Query 외에도 SWR, Apollo GraphQL 등 유사한 솔루션을 사용할 수 있습니다.

---

## 가장 최신 방식인 서버 컴포넌트에서 데이터 가져오기

이제 세 번째 예제를 살펴보겠습니다.

이 예제는 클라이언트 환경이 아닌 **서버 환경**에서 데이터를 가져오는 방법을 보여줍니다.

먼저, page.tsx 파일을 아래와 같이 바꿉니다.

```tsx
// import Fetch1 from "@/components/Fetch1";
// import Fetch2 from "@/components/Fetch2";
import Fetch3 from "@/components/Fetch3";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="p-10">
      {/* <Fetch1 /> */}
      {/* <Fetch2 /> */}
      <Suspense fallback={<div>Loading...</div>}>
        <Fetch3 />
      </Suspense>
    </main>
  );
}
```

위 코드를 보시면 Fetch3 컴포넌트를 Suspense로 감쌌습니다.

이제 Fetch3 컴포넌트를 아래와 같이 만듭니다.

```tsx
const BASE_URL = "https://jsonplaceholder.typicode.com";

interface Post {
  id: number;
  title: string;
}

export default async function Fetch3() {
  const response = await fetch(`${BASE_URL}/posts`);
  await new Promise((resolve) => setTimeout(resolve, 2000));

  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  const posts = (await response.json()) as Post[];

  return (
    <div className="tutorial">
      <h1 className="mb-4 text-2xl">Data Fething in React</h1>
      <ul>
        {posts.map((post) => {
          return <li key={post.id}>{post.title}</li>;
        })}
      </ul>
    </div>
  );
}
```

Next.js에서는 서버 컴포넌트를 사용하여 서버에서 작업을 수행할 수 있습니다.

서버 컴포넌트는 이름에서 알 수 있듯이 서버에서 실행되며, 클라이언트에는 전달되지 않습니다.

위 코드는 서버에서 실행되기 때문에, **비동기(async) 컴포넌트**를 만들 수 있습니다.

즉, 렌더링, 상태, 로딩 상태 등을 신경 쓸 필요가 없습니다.

그리고 컴포넌트 바디에서 직접 데이터를 가져올 수 있습니다.

클라이언트 컴포넌트에서는 절대로 이렇게 할 수 없습니다.

`fetch`를 통해 데이터를 가져오고, Response를 확인합니다.

Response가 정상적이지 않으면 에러를 발생시키거나, 다른 곳으로 리디렉션하거나, 사용자에게 에러 메시지를 표시합니다.

Response가 정상적이면 `response.json()`을 통해 게시글 데이터를 가져옵니다.

클라이언트 컴포넌트에서 사용했던 것과 같은 코드이지만, 비동기 서버 컴포넌트의 바디에 직접 넣었습니다.

그리고 HTML, JSX를 생성하여 게시글을 렌더링합니다.

로딩 상태, 대기 상태 등이 없고, 의존성도 없습니다.

서버 컴포넌트를 사용하면 복잡성을 줄이고 코드와 의존성을 줄일 수 있다는 큰 장점이 있습니다.

하지만 로딩 상태 등 몇 가지 기능을 잃게 됩니다.

예를 들어 `fetch` 요청이 진행되는 동안 데이터가 없기 때문에 컴포넌트가 렌더링되지 않습니다.

하지만 이러한 문제를 해결하는 방법이 있습니다.

바로 **Suspense**를 사용하면 됩니다.

Suspense는 React의 컴포넌트로, 컴포넌트를 감싸고, 렌더링이 완료될 때까지 컴포넌트를 블록합니다.

또한, 렌더링이 완료될 때까지 표시할 폴백(fallback)을 제공할 수 있습니다.

```tsx
// ... (Fetch3 컴포넌트 안)
    <Suspense fallback={<div>Loading...</div>}>
    <Fetch3 />
    </Suspense>
```

이 코드를 사용하면 페이지가 로딩되는 동안 로딩 표시가 나타나고, 컴포넌트가 렌더링되면 데이터가 표시됩니다.

이렇게 하면 서버 컴포넌트에서도 로딩 상태를 표시할 수 있습니다.

서버 컴포넌트에서 데이터를 가져올 때는 페이지 번호를 나타내는 상태 변수가 없고, 페이지가 변경될 때 데이터를 다시 가져오지 않습니다.

서버 컴포넌트에서는 상태가 없고 페이지가 다시 렌더링되지 않기 때문입니다.

같은 기능을 구현하려면 URL을 이용해서 params을 사용해야 합니다.

URL을 기반으로 서버 컴포넌트에서 가져올 페이지를 결정하면 됩니다.

그리고 여기서 중요한 캐싱은 라이브러리가 아닌 Next.js 프레임워크에서 처리합니다.

왜냐하면 Next.js는 URL을 기반으로 캐싱을 처리하기 때문입니다.

서버 컴포넌트에서 데이터를 가져오는 것은 클라이언트 컴포넌트에서 데이터를 가져오는 것과 같은 결과를 달성하지만, 제가 볼 때 더 효율적인 방식이라고 생각합니다.

---

## 끝맺음

지금까지 이 글을 통해 React 애플리케이션에서 데이터를 가져오는 방법을 배우셨습니다.

서버 컴포넌트에서 데이터를 가져오는 방법, 클라이언트 컴포넌트에서 React Query를 사용하여 데이터를 가져오는 방법, 그리고 클라이언트 컴포넌트에서 데이터를 직접 가져오는 방법을 배웠습니다.

되도록이면 서버 컴포넌트를 사용하고 부득이하게 클라이언트 상에서 데이터를 가져오러면 무조건 React Query, SWR 같은 라이브러리를 사용하면 됩니다.

그럼.
