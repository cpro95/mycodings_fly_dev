---
slug: 2024-01-27-how-to-use-tanstack-query-complete-understanding
title: TanStack Query V5 기본 사용법
date: 2024-01-27 08:29:22.904000+00:00
summary: (구)React Qeury의 최신 버전인 TanStack Query 사용법을 알아봅시다.
tags: ["tanstack query", "tanstack-query", "react"]
contributors: []
draft: false
---

안녕하세요?

오늘은 TanStack Query V5에 대해 살펴볼 건데요.

TanStack Query는 버전 3까지 React Query라고 불렸지만 버전 4가 되면서 이름이 TanStack Query가 되었습니다.

이전 버전에서 사용되었던 React Query는 이름에 React가 포함된 React 전용 라이브러리였는데요.

버전 업하면서 TanStack Query가 되어 React뿐만 아니라 Solid, Vue, Svelte 등에서도 이용할 수 있게 되었습니다.

그래서 이름이 바뀐 건데요.

기능은 React Query랑 기본적으로 같습니다.

제가 예전에 작성한 React Query 강좌는 React Query 기능을 거의 전부 살펴본 거라 한 번 꼭 보시는게 좋을 듯 싶습니다.

예전 강의 [링크](https://mycodings.fly.dev/blog/2023-09-17-how-to-use-react-query-and-usequery)입니다.

오늘은 V5 기준하에 TanStack Query의 가장 기본이 되는 기능을 살펴보겠습니다.

** 목 차 **

* 1. [backend 서버 구축](#backend)
* 2. [Prisma 설정](#Prisma)
* 3. [Prisma Clinet로 데이터베이스 검색](#PrismaClinet)
* 4. [Frontend 설정](#Frontend)
* 5. [Todo 컴포넌트 만들기](#Todo)
* 6. [data 얻기](#data)
* 7. [useQuery 훅의 리턴 값 확인해 보기](#useQuery)
* 8. [에러 메시지(error message)를 서버 측 메시지 그대로 사용하기](#errormessage)
* 9. [axios를 사용한 경우](#axios)
* 10. [TanStack Query 기능은?](#TanStackQuery)
* 11. [Window Focus Refetching](#WindowFocusRefetching)
* 12. [refetchInterval 설정](#refetchInterval)
* 13. [staleTime 설정](#staleTime)
* 14. [gcTime  설정](#gcTime)
* 15. [gcTime 설정을 0으로 하기](#gcTime0)
* 16. [Devtools 설정](#Devtools)
* 17. [staleTime을 설정한 경우](#staleTime-1)
* 18. [gcTime을 0으로 설정하면](#gcTime0-1)
* 19. [여러 useQuery 설정](#useQuery-1)

---

##  1. <a name='backend'></a>backend 서버 구축

```bash
mkdir tanstack-test
cd tanstack-test
mkdir backend
cd backend
npm init -y
npm install express nodemon
touch index.js
```

backend 폴더의 package.json 파일에서 scripts 부분을 아래와 같이 바꿉니다.

```json
"scripts": {
    "start": "nodemon index.js"
  },
```

express 서버 기본 설정을 해 볼까요?

index.js 파일을 아래와 같이 고칩니다.

```js
const express = require("express");

const app = express();
const port = 3000;

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () => console.log(`Server running on port ${port}`));
```

이제 express 서버를 구동해 볼까요?

```bash
npm run start

> backend@1.0.0 start
> nodemon index.js

[nodemon] 3.0.3
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node index.js`
Server running on port 3000
```

이상 없이 잘 됩니다.

---

##  2. <a name='Prisma'></a>Prisma 설정

express 서버에서 sqlite DB를 조작하기 위해서 꼭 prisma가 필요한 건 아닌데, prisma를 이용하면 아주 쉽게 DB 제어를 할 수 있기 때문에 추천드립니다.

개발 서버를 끄고 아래와 같이 prisma를 설치합니다.

```bash
npm install prisma
```

prisma 설치가 끝났으면 아래 명령어로 prisma를 초기화 해야 합니다.

```bash
npx prisma init --datasource-provider sqlite
```

내부적으로 sqlite를 쓰기 위해 위와 같이 '--datasource-provider' 옵션을 주었습니다.

위 명령어를 실행하면 prisma 폴더가 생기면서 그 밑에 schema.prisma 기본 파일이 생기는데요.

그리고 '.env' 파일도 자동으로 생기는데요.

'DATABASE_URL' 환경변수를 위해서 그런 겁니다.

최종적으로 다음과 같을 겁니다.

```js
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

오늘 만들어 볼게 Todo 앱이기 때문에 Todo Model을 추가해 봅시다.

```js
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Todo {
    id          Int @id @default(autoincrement())
    name        String
    isCompleted Boolean
}
```

name과 isCompleted 항목을 추가했습니다.

sqlite는 Boolean 타입을 지원하지는 않지만 Prisma가 알아서 Boolean 타입을 처리해 줄 겁니다.

이제 데이터베이스 설정이 끝났기 때문에 실제 DB를 구축해 보겠습니다.

```bash
npx prisma db push
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": SQLite database "dev.db" at "file:./dev.db"

SQLite database dev.db created at file:./dev.db

🚀  Your database is now in sync with your Prisma schema. Done in 11ms

Running generate... (Use --skip-generate to skip the generators)

added 1 package, and audited 104 packages in 5s

14 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

✔ Generated Prisma Client (v5.8.1) to ./node_modules/@prisma/client in 40ms
```

테이블이 생성되었는지 확인하기 위해 Prisma Studio를 구동하겠습니다.

```bash
npx prisma studio
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEhcLE1HS7p6KDNNEogakX2_qbnjw9bwwIXirm_IIDfeSeGNpozASwKkIJyX0sxGgLCI7Pb_KguNZuzsEaBw3-arQZ4MAHx_BS82Weo3vlZ6jetD9OUwk9-le8rSlImQpCKpn5c-DXok4Z36vTPs1gyrU5fYT71BaK6gklAfIAER2nB8UcoyHYmMz8dgoSw)

![](https://blogger.googleusercontent.com/img/a/AVvXsEj2AiRJT35pPIEx3WIB_bmHmauKFNT_9qPElM35P7bsgvyuIChuty6OQ_rsES0lQMKyMLhp-0g-BLR_lqL1t_36QKTrSB35nj61JTSePBsrqtpDR2VECqvJed5FB-Np6J634Ie8_d4BnCDKfymR7-8w_G9Tz3bGEyIBQhPoxGRH-aT4OiBaTNnVY2cDb-M)

위 그림과 같이 Prisma를 이용한 DB 구축이 완료되었네요.

테스트를 위해 Prisma Studio에서 더미 데이터를 몇 개 추가해 봅시다.

'Add record' 버튼을 누르면 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhaL35m3IEBwm_GWymjZlG5TslXwwiIzX4Hj-Da2ZtfkuaPaVlxiqCRy_qKKTK_0TVV7RFNg0ETqjEwnk7PiI7CZxyv0aFyKyvLyTUaAu1rdnRliCw0dZ4B5NOn6xBiaQH10P4T6Cj9HUA5a32eIRGhHxLP1Gjv2O4beUwq5wIO7vieb25XfulGLE4R2pI)

위와 같이 더미 데이터도 만들고 기본적인 DB 세팅은 끝났네요.

---

##  3. <a name='PrismaClinet'></a>Prisma Clinet로 데이터베이스 검색

이제 express 서버에서 prisma client를 통해 아까 우리가 만든 더미데이터를 가져오는 json API를 만들어 보겠습니다.

다시 index.js 파일을 열어 '/todos' 라우팅을 추가해 보겠습니다.

```js
const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const app = express();
const port = 3000;

app.get("/", (req, res) => res.send("Hello World!"));

app.get("/todos", async (req, res) => {
  const todos = await prisma.todo.findMany();
  return res.json(todos);
});

app.listen(port, () => console.log(`Server running on port ${port}`));
```

위 코드를 보면 PrismaClient 객체를 import 했는데요.

이걸 따로 설치해야 하나 의문이 드는데요.

사실 아까 'npx prisma db push' 명령어를 실행했을 때 알아서 PrismaClient 객체가 생성되었습니다.

아까 터미널 화면에서 아래와 같은 문구를 볼 수 있을 겁니다.

```bash
✔ Generated Prisma Client (v5.8.1) to ./node_modules/@prisma/client in 40ms
```

위와 같이 PrismaClient도 알아서 만들어주고 있죠.

PrismaClinet가 생겼으면 todo 테이블에서 findMany 함수로 자료를 가져올 수 있습니다.

이제 브라우저에서 테스트해 볼까요?

아니면 터미널에서 curl 명령어를 사용해서 간단하게 조회할 수 있습니다.

express 서버를 구현하는 'npm run start' 명령어를 실행시켜 놓고 터미널을 하나 더 오픈한 다음 아래와 같이 명령어를 입력하면 됩니다.

```bash
curl http://localhost:3000/todos
[{"id":1,"name":"learn tanstack query","isCompleted":false},{"id":2,"name":"learn react","isCompleted":false},{"id":3,"name":"learn astrojs","isCompleted":false}]
```

어떤가요? 우리가 만든 express 서버가 아주 잘 돌아가고 있고, Prisma를 이용한 DB 제어도 잘 되고 있습니다.

---

##  4. <a name='Frontend'></a>Frontend 설정

이제 우리가 이 글을 목적인 TanStack Query를 이용할 프론트엔드를 구축해야 합니다.

당연히 React를 사용할 건데요.

backend 폴더 한 칸 앞으로 올라가서 frontend 폴더를 만듭시다.

```bash
pwd
/Users/cpro95/Codings/Javascript/blog/tanstack-test/backend
cd ..

npm create vite@latest
✔ Project name: … frontend
✔ Select a framework: › React
✔ Select a variant: › JavaScript

cd frontend
npm i
npm run dev
```

React 개발서버까지 돌려봤는데요.

이제 TanStack Query를 설치하겠습니다.

```bash
npm i @tanstack/react-query
```

오늘 기준 아래와 같은 버전이 설치되었네요.

```json
"dependencies": {
    "@tanstack/react-query": "^5.17.19",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
```

---

##  5. <a name='Todo'></a>Todo 컴포넌트 만들기

리액트의 src 폴더 밑에 components 폴더를 만들고 Todo.jsx 파일을 만듭시다.

```js
const Todo = () => {
  return (
    <>
      <h1>Todo List</h1>
    </>
  );
};

export default Todo;
```

이제 이 Todo 컴포넌트를 불러올 App.jsx 파일을 고쳐볼까요?

```js
import Todo from "./components/Todo";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Todo />
    </div>
  );
}

export default App;
```

모든 걸 다 지우고 위와 같이 작성했습니다.

대신 기존에 있던 App.css 파일은 사용하겠습니다.

최소한의 CSS를 위해서요.

개발 서버를 돌려볼까요?

```bash
npm run dev
```

Vite는 개발 서버 포트가 디폴트 값으로 5173입니다.

왜 5173일까요?

5173을 오랫동안 보시면 vite 글자와 비슷해서 5173 번호를 골랐다고 합니다.

브라우저를 보시면 화면 한가운데 'Todo List' 문구가 보일 겁니다.

프론트엔드 준비가 다 끝났네요.

본격적으로 TanStack Query를 사용해 보겠습니다.

---

##  6. <a name='data'></a>data 얻기

Todo 컴포넌트에서 TanStack Query를 이용해서 Express 서버의 Todo 데이터를 검색하는 로직을 구현하겠습니다.

데이터를 얻기 위해서는 useQuery 훅을 이용해야 하는데요.

아까 components 폴더 밑에 만들었던 Todo.jsx 파일을 아래와 같이 수정합시다.

```js
import { useQuery } from "@tanstack/react-query";

const fetchTodos = async () => {
  const res = await fetch("http://localhost:3000/todos");
  return res.json();
};

const Todo = () => {
  const { data: todos } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });
  return (
    <>
      <h1>Todo List</h1>
      <ul>
        {todos?.map((todo) => (
          <li key={todo.id}>{todo.name}</li>
        ))}
      </ul>
    </>
  );
};

export default Todo;
```

TanStack Query에서는 import 한 useQuery Hook을 이용하여 서버에 대한 Query를 실행합니다.

useQuery의 인수에는 객체를 이용하여 queryKey와 queryFn을 설정합니다.

queryKey는 유니크한 키로 애플리케이션을 통해 캐시와 쿼리를 공유하는 데 사용됩니다.

queryFn은 Promise를 리턴하는 함수를 설정합니다.

보통 fetch 함수를 따로 작성하여 함수 이름을 적습니다.

당연히 async/await를 이용해서 비동기식으로 작성해야겠죠.

우리의 경우 fetchTodos 함수가 그겁니다.

queryKey, qeuryFn 이외에도 여러 옵션이 있습니다만 이 2개가 useQuery 설정에 있어 가장 기본이 되는 필수옵션입니다.

[공식 문서](https://tanstack.com/query/latest/docs/react/reference/useQuery)에서 좀 더 다른 옵션을 확인할 수 있을 겁니다.

useQuery에서 리턴되는 객체를 보통 디스트럭처링 해서 data 값을 얻는데요.

또 ES6의 alias 기능 즉, 별칭 기능을 이용해서 data란 이름을 다른 이름으로 지정합니다.

우리는 위에서 data라는 이름을 별칭으로 todos라는 이름으로 만들었습니다.

나중에 아시겠지만 useQeury를 여러 개 만들면 data라는 변수가 여러 개 생기게 되어 헷갈릴 수 있습니다.

그래서 꼭 별칭을 지정하는게 관례입니다.

뭐, useQuery를 한 개만 사용한다면 그냥 data란 이름을 그대로 사용할 수 있습니다.

이제 브라우저를 보시면 빈 화면만 나오는데요.

크롬 개발창의 콘솔로 가보면 에러메시지가 나옵니다.

```bash
Uncaught Error: No QueryClient set, use QueryClientProvider to set one
```

QueryClientProvider를 설치하라는 얘기네요.

이제 main.jsx 파일에 QueryClientProvider 관련 코드를 추가하겠습니다.

```js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
// import './index.css'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
```

이 세팅이 TanStack Query를 사용하기 위한 가장 최소한의 설정이 됩니다.

이제 다시 브라우저를 볼까요?

```bash
Access to fetch at 'http://localhost:3000/todos' from origin 'http://localhost:5173' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
```

역시나 cors 에러가 나옵니다.

왜냐하면 보안을 위해 Express 서버의 포트와 React 개발 서버의 포트가 틀리면 CORS 정책을 위반했다고 나옵니다.

express 서버에 cors처리하기 위해서 몇 가지를 보완하겠습니다.

백엔드 서버를 잠시 종료하고 다음과 같이 cors 패키지를 설치합시다.

```bash
npm install cors
```

그리고 backend 폴더의 index.js 파일에 cors를 처리하기 위한 코드를 몇 개 추가합시다.

```js
const express = require("express");
const cors = require('cors');
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const app = express();
const port = 3000;

app.use(cors());

app.get("/", (req, res) => res.send("Hello World!"));

app.get("/todos", async (req, res) => {
  const todos = await prisma.todo.findMany();
  return res.json(todos);
});

app.listen(port, () => console.log(`Server running on port ${port}`));
```

위에서 보시면 cors 패키지를 불러오고 app.use 함수를 이용해서 cors를 실행한 겁니다.

이제 다시 백엔드 개발 서버를 돌립시다.

```bash
npm run start
```

이제 다시 브라우저를 보시면 아래와 같이 나올겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhEwHzTKigevX6VDqt4KcPNvWlVJWM2LUNQpRfQAtqbXM_PKnq3GHOG__CMprcBKvBuGiIiGXaix88OXB0t3_sAyDLu8MVV5aCOK8l_9_ACzRVsLsnzhlz7L2Cd01jFSue3aGEZ6gu1XIT4FyAGwU6CMY_oTQ_CVdFfhmxNYn0jZ6ie0x7Kb2mMoObQ2j0)

위 그림과 같이 useQuery를 이용해서 데이터를 얻고 그걸 화면에 잘 뿌려주고 있네요.

지금까지의 설정이 useQuery의 가장 기본적인 작성방법입니다.

---

##  7. <a name='useQuery'></a>useQuery 훅의 리턴 값 확인해 보기

지금까지 만든 우리 코드는 useQuery 훅을 사용하지 않고 그냥 리액트 코드상에서 useEffect 훅 안에 fetch 함수나 axios 패키지를 이용해서 쉽게 express 백엔드 서버에서 데이터를 가져올 수 있습니다.

그러면 왜 useQuery 훅을 사용하는게 더 좋은지 살펴볼까요?

먼저, 우리가 사용한 data 객체 말고 useQuery 훅인 반환하는 객체는 좀 더 많은데요.

[공식 문서](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery)에서 확인해 보면 아래와 같습니다.

```js
const {
  data,
  dataUpdatedAt,
  error,
  errorUpdateCount,
  errorUpdatedAt,
  failureCount,
  failureReason,
  fetchStatus,
  isError,
  isFetched,
  isFetchedAfterMount,
  isFetching,
  isInitialLoading,
  isLoading,
  isLoadingError,
  isPaused,
  isPlaceholderData,
  isPreviousData,
  isRefetchError,
  isRefetching,
  isStale,
  isSuccess,
  refetch,
  remove,
  status,
} = useQuery({
  queryKey,
  queryFn,
  cacheTime,
  enabled,
  networkMode,
  initialData,
  initialDataUpdatedAt,
  keepPreviousData,
  meta,
  notifyOnChangeProps,
  onError,
  onSettled,
  onSuccess,
  placeholderData,
  queryKeyHashFn,
  refetchInterval,
  refetchIntervalInBackground,
  refetchOnMount,
  refetchOnReconnect,
  refetchOnWindowFocus,
  retry,
  retryOnMount,
  retryDelay,
  select,
  staleTime,
  structuralSharing,
  suspense,
  useErrorBoundary,
})
```

위 코드를 보시면 어마어마한 기능이 있다는 걸 알 수 있습니다.

우리가 사용한 data 객체는 그냥 빙산 위의 일각일 뿐이죠.

초보자가 TanStack Query를 배울 때 먼저 배우는 게 있습니다.

바로 위 반환값중에 data, isPending, isError, error 객체입니다.

isError, error 사용법은 추측하신 대로 그대로입니다.

isPending은 Query가 아직 데이터를 가지고 있지 않은 상태를 나타내고 있는데요.

이 값을 이용하면 유저에서 'Loadin....' 문구를 보여줄 수 있어 UI적으로 꼭 사용해야 하는 값입니다.

아래 코드가 useQuery 훅을 이용한 가장 정형화된 코드인데요.

```js
import { useQuery } from "@tanstack/react-query";

const fetchTodos = async () => {
  const res = await fetch("http://localhost:3000/todos");
  return res.json();
};

const Todo = () => {
  const {
    data: todos,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <h1>Todo List</h1>
      <ul>
        {todos?.map((todo) => (
          <li key={todo.id}>{todo.name}</li>
        ))}
      </ul>
    </>
  );
};

export default Todo;
```

위와 같이 하면 useQuery가 데이터를 불러올 때 보여주는 'Loadin...'문구와 에러가 발생했을 때 보여주는 에러 메시지까지 다양하게 돌발적인 상황을 대처할 수 있게 됩니다.

express 서버의 '/todos' 라우팅 처리 부분에 3초간 쉬는 코드를 추가해 보면 isPending의 작동 방식을 이해할 수 있을 겁니다.

```js
app.get('/todos', async (req, res) => {

  await new Promise((resolve) => setTimeout(resolve, 3000));

  const todos = await prisma.todo.findMany();
  return res.json(todos);
});
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEjuRXCzfMS1z9x_D845y_zXA8tBhXgdBYDI08PIqfAVUUbQwt28rygO12nv_NMn0eA58Y611voCSbW89I-59C6oEJmGN6Sh1mRrqYt0M9uCWUNTdwPTckKfo5Bsip1e9OUXwahfarus-3j-g97jAkamq7LLCwJNI-MRSWNBwrgPeIDZ6B0-Q1NXAY_vFLM)

위 그림과 같이 3초 동안 'Loading...' 문구가 화면에 표시될 겁니다.

그러면 강제로 에러를 일으켜서 에러 발생 시 작동되는 방식을 이해해 볼까요?

다시 백엔드 서버의 '/todos' 라우팅 부분을 아래와 같이 고칩시다.

```js
app.get("/todos", async (req, res) => {
  // await new Promise((resolve) => setTimeout(resolve, 3000));
  // const todos = await prisma.todo.findMany();
  // return res.json(todos);

  return res.status(500).json({ message: "강제 서버 에러" });
});
```

위와 같이 강제로 에러를 발생시켰습니다.

그리고 리턴하는 json 객체에 message 항목을 추가했고, 이 message 항목이 useQuery의 error 객체에 message 항목으로 들어가게 됩니다.

이제 브라우저를 보면 todos?.map is not a function 이라는 에러가 나오는데요.

todos를 console.log 해볼까요?

```js
...
...

  const {
    data: todos,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });
  console.log(todos);

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

...
...
```

위와 같이 console.log(todos) 코드를 넣었습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgZkHtcsz9PXfiTwAKcPAw_b06IIiyd_lF6dSefT4AsNP-57HKrxQN2pyxbxFiXMrg8ZtpItB9wYNgCYj6V-l0ycksuInenFYQnBb_Elk__Te1rois1Um3SA1CD_NqE_Y95il1XAMw3InQvJzBzVST0X7x28r9GCxzETwsCF48-G_vGHadvjopue4Xs5Ug)

실행 결과 Todo.jsx 파일에서 console.log한 값이 나오고 있는데요.

바로 우리가 원한 error 객체가 todos 객체에 들어가 버렸네요.

이러니 isError 체크도 안되고, todos 값도 체크가 안 되는 겁니다.

우리가 백엔드 express 서버에서 강제로 에러 코드를 리턴했는데요.

리액트의 fetchTodos 함수에서 fetch 함수를 이용해서 요청을 수행하는데, 이때 요청이 성공했는지, 실패했는지 response 객체의 ok 속성을 이용해서 체크하는 코드를 추가해야 합니다.

fetch 함수에서 400, 500 등 status code 값이 그대로 되돌려지는지 response.ok로 확인하는 코드를 추가해야 합니다.

status code 가 200이면 response.ok 값은 true 값이 되고, statuc code가 400, 500이면 response.ok 값은 false 값이 됩니다.

그러면 아래와 같이 fetchTodos 함수를 바꿔봅시다.

```js
const fetchTodos = async () => {
  const res = await fetch("http://localhost:3000/todos");

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }
  
  return res.json();
};
```

위와 같이 바꾸면 됩니다.

실행해 보면 아래와 같이 나오는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhKilJgYPnfcqaACn5ssHo_F_FxwXE0RgjW5OdMdPPY2utWDRyNVcEoY7nlAapsSS_srf5f6NbLOQ9V7D5lDq-18xcxeavUF0QEr39CaMi5PxhDP2qLBjPIgwkc_KiW9ndTwZZ2Kl6u_GB-2MIT4Lg4850fyZgZxMETMBJyYIc0WFcy9u8c2q7zGqwffrU)

왜 이렇게 요청을 몇 번 더 수행하냐면, TanStack Query가 자체적으로 에러 발생 시 몇 번의 시도를 더 합니다.

몇 번인지는 공식 문서에서 한번 찾아보시면 3번인데요.

이 재시도 횟수도 지정할 수 있습니다.

다만 디폴트 값이 3이라는거죠.

재시도 횟수를 늘리려면 아래와 같이 retry 값을 주면 됩니다.

```js
const Todo = () => {
  const {
    isPending,
    isError,
    data: todos,
    error,
  } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
    retry: 10,
  });
```

최종적으로 3번의 재시도끝에 에러코드를 반환하게 되는 겁니다.

---

##  8. <a name='errormessage'></a>에러 메시지(error message)를 서버 측 메시지 그대로 사용하기

아까 에러 메시지를 보시면 서버에서 설정한 메시지가 아닙니다.

그냥 리액트 코드에서 작성한 에러 메시지인데요.

서버 측 에러 메시지를 그대로 보여주고 싶으면 response.json() 함수나 response.text() 함수를 이용할 수 있습니다.

아까 전에 만든 express 서버의 에러 코드 리턴 코드는 아래와 같이 제대로 설정했네요.

```js
return res.status(500).json({ message: "강제 서버 에러" });
```

그러면 리액트 코드상에서 해당 json을 처리하는 코드를 추가해야 합니다.

다시 fetchTodos 함수를 뜯어 고쳐볼까요?

```js

const fetchTodos = async () => {
  const res = await fetch("http://localhost:3000/todos");

  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.message);
  }

  return res.json();
};
```

위 코드와 같이 res.ok가 false 일 경우 아예 res.json() 명령어로 json 문구를 처리하게 끔 했습니다.

이제 다시 브라우저를 보시면 익스프레스 서버에서 리턴 한 에러 메시지가 그대로 보일 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjeTUSpB_wAKzP38tW3OMsXq6Sx5rQ2ZuRIprjgbMANWvZCCNy-a_Hg_a6FHcpGl8BuHU2X0vUnnWGzEbBeBC3Gn6_-m_-1pIwYblmGVm4ur2eaz9zwpZ0x6rZF6n3oZmLZ8n-HHZPSZcQOElBfReRP19aRABUFBWrMfP-XOK7vmYDfQBD0fMvQDdS5OrE)

여기서 fetchTodos 함수에서 res.json() 함수 말고 res.text() 함수를 사용해 볼까요?

json 객체를 처리하는게 아니라 텍스트화해서 돌려 줄 겁니다.

```js
const fetchTodos = async () => {
  const res = await fetch("http://localhost:3000/todos");

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  return res.json();
};
```

위와 같이 처리하면 아래 그림과 같이 JSON 객체가 텍스트로 처리될겁니다.

이걸 JSON.parse 하면 똑같아 지는거죠.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjhQYnSvqLUAxQk_vFseRTlTsoZ17mo_HKXjVsyZHz4UbjT2v3bTYdc2sd_QVdbLVOx3s0EX7kmcKWTAeNd_mBQDSMU2onjBFVbfM8z5S6AUP-iVqHx1v5xb8C4ERW7obUZGqRLvYyk_AEeIG06_bg35jQZPBQKFehJLN-R08m916AwsmwNuruutkd2hcI)

어떤가요?

이렇게 하면 리액트 코드에서 isError 값을 체크하는 코드에 아래와 같이 처리하면 됩니다.

```js
if (isError) {
    const text = JSON.parse(error.message);
    return `Error: ${text.message}`;
}
```

위와 같이 고치면 아래와 같이 나올 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjeTUSpB_wAKzP38tW3OMsXq6Sx5rQ2ZuRIprjgbMANWvZCCNy-a_Hg_a6FHcpGl8BuHU2X0vUnnWGzEbBeBC3Gn6_-m_-1pIwYblmGVm4ur2eaz9zwpZ0x6rZF6n3oZmLZ8n-HHZPSZcQOElBfReRP19aRABUFBWrMfP-XOK7vmYDfQBD0fMvQDdS5OrE)

---

##  9. <a name='axios'></a>axios를 사용한 경우

우리는 fetchTodos 함수에서 fetch 함수를 사용했는데요.

axios 함수를 사용할 경우 어떻게 코드를 수정해야 할까요?

테스트를 위해 리액트 개발 서버를 끄고 axios를 설치합시다.

```bash
npm i axios
```

기존 fetchTodos 함수를 axios를 사용한 코드로 바꿔봅시다.

```js
import axios from 'axios';
import { useQuery } from "@tanstack/react-query";

const fetchTodos = async () => {
    const res = await axios.get('http://localhost:3000/todos');
    return res.data;
  };
```

근데 위 코드에서는 res.ok 부분을 체크하는 코드가 없습니다.

일단 아래와 같이 isError 부분을 고쳐봅시다.

```js
if (isError) {
  console.log(error);
  return <span>Error: {error.message}</span>;
}
```

브라우저에서 실행결과를 보시면 아래와 같은데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgj5tKtRGsKD60vimLOIQUopyY3i0P_Gtibu7TadfTslsJe3vTd4WmFjZeRs6saiVOtf7ofYmEnt4lAiCOxxdW-zB036DisGBae0tIdRqTryPjHrtAZtk0N8InURoYxjUJs14g5vHylgRKeqhOuuyAUnK0Zvo-fiegKJMJPA76a0jahdbctUZsauB9yHc0)

error가 AxiosError 객체로 리턴되었습니다.

그러면 우리가 리턴한 에러메시지는 어디 있을까요?

아래 그림처럼 AxiosError 객체의 response 객체 밑에 data 객체에 그 값이 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhQsXygJOTi7bMwFEdQwS7U04zAEUgw7fA98Tmu0udAZs7ZQ08xDGrtXaxyxyT9GkGzm52RxIvwdFnGEMCptbq7QUKu51aZAI2Quz6UjFm2ERUMKM3d0C2UKZ-wm-bH7_aUOI8aD4O5aY_3kGfXfomK5WuxZjfRJp4XNgg56FQaovmy8TRQf_fmPfuRcGc)

그래서 리액트 상의 코드를 아래와 같이 바꾸면 됩니다.

```js
if (isError) {
  return <span>Error: {error.response.data.message}</span>;
}
```

최종적으로 아래와 같이 우리가 지정한 에러코드가 그대로 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjeTUSpB_wAKzP38tW3OMsXq6Sx5rQ2ZuRIprjgbMANWvZCCNy-a_Hg_a6FHcpGl8BuHU2X0vUnnWGzEbBeBC3Gn6_-m_-1pIwYblmGVm4ur2eaz9zwpZ0x6rZF6n3oZmLZ8n-HHZPSZcQOElBfReRP19aRABUFBWrMfP-XOK7vmYDfQBD0fMvQDdS5OrE)

axios가 훨씬 더 좋은 거 같네요.

---

##  10. <a name='TanStackQuery'></a>TanStack Query 기능은?

지금까지 TanStack Query를 이용해서 'Loading...' 문구를 보여주거나, 에러 메시지를 보여주는 코드를 작성했는데요.

이런 기능은 그냥 단순하게 fetch 함수나 axios 패키지를 사용해도 구현할 수 있는 것들입니다.

TanStack Query 만의 특별한 기능을 좀 더 알아볼까요?

---

##  11. <a name='WindowFocusRefetching'></a>Window Focus Refetching

Windows Focus Refetching이라는 기능이 있는데요.

기본적으로 true로 설정되어 있습니다.

이 기능은 예를 들어 브라우저의 다른 탭으로 이동했다가 다시 해당 탭으로 돌아가면 Query가 다시 작동하는 기능입니다.

작동 여부는 크롬 개발 창의 네트워크 탭에서 볼 수 있습니다.

일단 express 서버를 에러 메시지를 강제로 발생시켰던 예전 코드를 지우고 원래 코드로 원상 복구합시다.

```js
app.get("/todos", async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const todos = await prisma.todo.findMany();
  return res.json(todos);

  // return res.status(500).json({ message: "강제 서버 에러" });
});
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEikJQC53YfZPMvBcFB2xd-sIW7E8TavH5bNhBM2Cg211s5n9UvYZf1RIhG7orLxt-7vYnnu0U34ZcAvaODthSw37NhknH8ULIGHHRiQEMEgkGTDa5GazCLZF3-KbPhZ6J1-Ylyicw8c2r-ZNEhZvSU6cil_53e_d3m_-Zh8KhuhDEPNJ6lxc47oiaJY5Gg)

위 그림을 보시면 크롬 개발 창의 네트워크 탭인데요.

리액트 개발서버라 많은 게 로드됩니다.

현재 마지막에 있는데 'vite.svg' 파일 로드인데요.

이제 탭을 이동했다가 다시 들어와 보십시오.

네트워크 탭이 아래와 같이 바뀔 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhOWxGkXgHIGTEzBRLGg4SIGIzS-YJUYoWyyl7HBcyz61y0Lkmd-fPhfkkQEog26uT5Dbu1mMl7pFKgPFOfuwws_opcpWL8BTPqbrskgw_IaEBUC66CRtQi-0h0Svol5jyqcJpxTflNGjCNWEUGT8WLwQlcPStSS58Ot5Bevh_qO2f9EFYqHYbgoMryKSI)

위와 같이 'vite.svg' 다음으로 todos라는 xhr 타입이 다시 생겼죠?

이게 바로 TanStack Query가 다시 익스프레스 서버에 todos 라우팅으로 데이터를 받아오기 위해 다시 접근한 겁니다.

이게 바로 Window Focus Refetching 기능입니다.

잠깐 다른 탭으로 이동했다가도 다시 오면 항상 최신 데이터로 화면이 채워져 있어 유저 입장에서는 아주 좋은 UX를 느낄 수 있을 겁니다.

이 기능을 끄려면 단순하게 아래처럼 false 값으로 설정하면 됩니다.

```js
const {
  isPending,
  isError,
  data: todos,
  error,
} = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  refetchOnWindowFocus: false,
});
```

##  12. <a name='refetchInterval'></a>refetchInterval 설정

아까 refetchOnWindowFocus 값이 true이면 탭 전환에 따라 자동으로 데이터 리페치가 이루어진다고 알았는데요.

만약, 탭 전환이 아니라 일정 시간이 지나면 자동으로 리페치를 원할 경우 어떻게 해야할까요?

이 기능도 TanStack Query가 제공해 줍니다.

바로 refetchInterval 값을 지정하는 겁니다.

```js
const {
  isPending,
  isError,
  data: todos,
  error,
} = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  refetchInterval: 1000,
});
```

위와 같이 refetchInterval 값마다 리페치가 일어날겁니다.

당연히 refetchInterval 은 밀리세컨드 즉 밀리초입니다.

1000 값이 1초가 되는 거죠.

---

##  13. <a name='staleTime'></a>staleTime 설정

먼저, stale 이라는 영어 단어가 생소한데요.

ChatGPT로 물어봤습니다.

```bash
"Stale"은 다양한 의미로 사용될 수 있는 단어입니다. 주로 형용사로 사용되며, 다음과 같은 의미를 가질 수 있습니다:

1. **노후한, 신선하지 않은:** 식품이나 공기 등이 오랫동안 저장되거나 사용되어 신선하지 않은 경우를 나타냅니다. 예를 들어, "stale bread"는 더 이상 신선하지 않은 빵을 나타냅니다.

2. **흔들린, 새로워지지 않은:** 상황, 아이디어, 유행 등이 새로워지거나 변화가 없어서 흔들림이 없는 경우를 나타낼 때 사용될 수 있습니다. 예를 들어, "stalemate"은 어떤 상황에서 어떤 쪽도 진전이 없는 상태를 의미합니다.

3. **상스러운, 진부한:** 어떤 경험이나 상황이 더 이상 흥미로우지 않거나 진부한 경우를 나타낼 때도 사용될 수 있습니다.

따라서 "stale"은 다양한 맥락에서 사용되어 다양한 의미를 갖습니다.
```

신선하지 않은 이란 뜻이 대표적인데요.

Query로 보면 stale 이란 뜻은 데이터가 오래됐다는 뜻이겠네요.

그러면 staleTime 값을 설정하면 그 값에 따라 다시 리페치가 이루어지더라고 추측할 수 있습니다.

그건 아니고요.

staleTime은 refetchOnWindowFocus 값이 true일 경우 리페치 할지 말지 기준이 되는 겁니다.

staleTime은 디폴트 값으로 0 이라는 값을 가집니다.

이 뜻은 한번 데이터를 가져오면 그 데이터는 바로 신선하지 않다는 뜻이 되는 거죠.

그러면 refetchOnWindowFocus 값이 true 일 경우 탭 간 전환 시 리페치가 되느냐 마느냐는 바로 staleTime 값을 체크해서 데이터가 stale 하지 아닌지 체크해서 리페치가 일어나는 겁니다.

그러면 staleTime을 오래 시간으로 설정하고 테스트해 보십시오.

아마도 아무런 리페치가 일어나지 않을 겁니다.

```js
const {
  isPending,
  isError,
  data: todos,
  error,
} = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  staleTime: 50000,
});
```

위와 같이 staleTime을 50초로 설정했습니다.

그러면 탭 간 이동에도 전혀 리페치가 이루어 지지 않을 겁니다.

단, staleTime은 refetchInterval 값 설정과는 따로 작동합니다.

---

##  14. <a name='gcTime'></a>gcTime  설정

gcTime의 gc는 무엇을 뜻할까요?

gc는 Garbage Collection(가비지 컬렉션)입니다.

gcTime은 말 그대로 InActive/UnUsed의 캐시 데이터를 메모리상에 남겨 두는 시간입니다.

기본적으로 5분으로 설정되어 있으므로 그 사이에 동일한 쿼리가 실행되면 캐시된 데이터를 활용할 수 있게 됩니다.

gcTime의 설정이 리액트 코드상에서 어떻게 작동하는지 테스트 조건을 꾸며보겠습니다.

아래와 같이 App.jsx 파일을 수정합시다.

```js
import Todo from './components/Todo';
import './App.css';
import { useState } from 'react';

function App() {
  const [show, setShow] = useState(true);
  return (
    <>
      <button onClick={() => setShow(!show)}>Todo Toggle</button>
      <div className="App">{show && <Todo />}</div>
    </>
  );
}

export default App;
```


그리고 백엔드 서버에 다시 3초간의 지연 코드를 추가합시다.

```js
app.get("/todos", async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const todos = await prisma.todo.findMany();
  return res.json(todos);

  // return res.status(500).json({ message: "강제 서버 에러" });
});
```

먼저, gcTime 설정 없이 테스트해 봅시다.

```js
  const {
    data: todos,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEjvi5yPb2KgUVN9fc00enqMZSEe29OB12JkAFLWiT0C0jEvBGePr9-kQ3bbwwLlpmTsBeWoR6jY4nnYsLKYxFijKJ_yL91dhSyFpi1cOBCyxe2WtqggHzuuuf3pW3lKfoAjxuLfRjRqvhXqiEIXVOI-oLwv3HyE94PugwnKxayUAP9DhWXuMFTUYO5a6gY)

일단 위와 같이 나옵니다.

네트워크 탭을 자세히 보셔야 합니다.

이제 토글 버튼을 클릭해서 Todo 컴포넌트를 숨겨보겠습니다.

네트워크 탭은 아래와 같이 변동이 없습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEg7sYFgACVhlmXyQPmd6D2iFVcnTQYXgKcYolLRbAMwU2hc0waGLk3x5SPKl2tPnhVWZ7dQHT6BVpnFEAf5A4hoE7S37olWGtccs49Hp8oHZfO6XWelk_UANcFmEAsWKvaDsL6SFMniO7x140l_hTGcEgG-3s1tcTBj0fHqLEiqBTTdSBa1kIeSP74PZjg)

위와 같이 아무런 변화가 없네요.

이제 다시 토글 버튼을 눌러볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEhDpefULz9tGxjQETjunZJQm76etcI4I3SeroqNZvG9CkIJchiD8KxERUnKCfCdCVvMvM5Gk4MvU-uNeniq-g1rjr6H2A5xXi1IgmVtZTxZ-u7WhZ5fTbO_OdH5RoMJD7zJ5J7GPtRI5p8jdsMNxMIPDFWpDdYORLRZs81xpBiHTOyJ9LEP1b5jirzRo_I)

위와 같이 'Loading...' 문구는 보이지 않고 네트워크 탭에서는 todos 라우팅으로 리퀘스트가 요청되어집니다.

3초간 쉬라고 했기 때문에 3초간 (pending)이라고 표시되고 있죠.

---

##  15. <a name='gcTime0'></a>gcTime 설정을 0으로 하기

이제 gcTime을 0으로 설정하고 테스트 해 볼까요?

```js
const {
  isPending,
  isError,
  data: todos,
  error,
} = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  gcTime:　0,
})
```

이제 테스트를 위해 브라우저 새로고침을 누르고 보시면 첫번째는 'Loading...' 문구가 보이고, 토글 버튼을 눌렀다가 다시 눌러도 'Loading...' 문구가 보일 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjmbuNmxCyzFfvfAJcSap3XZM8T8_fj6jSksc6gPKji99E6S8l5rp2p70WsdW4NDGVK0Cx1frFrmFnimawASqklMozwoSVVHOSnBqlx2p44k9DfaC_yuw-3qvG_ylEuFALpMQDRnEnaowYyENq0RZYPif7Wzt7Q9FxIrrI4znoG5GOxhrojvnLb_bQMFIY)

위 그림과 같이 보일건데요.

이게 왜 그런거냐면 바로 gcTime이 0으로 세팅되어 그런 겁니다.

gcTime이 0으로 세팅되면 데이터를 가져오면 그 즉시로 캐시 데이터가 가비지 컬렉션되므로 캐시 데이터에 의존하지 못하고 다시 서버에 리퀘스트하게 됩니다.

그래서 'Loading...' 문구가 보이게 되는 겁니다.

---

##  16. <a name='Devtools'></a>Devtools 설정

TanStack Query 전용으로 Devtools가 준비되어 있어 디버그하기 아주 쉬운데요.

일단 Devtools 패키지를 설치해야 합니다.

```bash
npm i @tanstack/react-query-devtools
```

Devtools를 사용하려면 main.jsx 파일을 아래와 같이 고쳐야 합니다.

```js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
// import './index.css'

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
```

브라우저를 새로고침하면 화면 하단 오른쪽에 아래와 같은 아이콘이 나타날 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgkAdg7RnXLHmAr7UEvHKHw866d9nYJh_0QG1bppSlA3dAvpBec0u7LoZdjBmpaTTsT89ZyiPLL29JwkR0nROX2BnAWbJJhpcj7p4eMyDdlp-BLmsoIzDPNi8Y6nRHtEYk1f4bp0blFyMcoBaoPrZnQmbUASaFKxrKzPuQB3d77Q_8WSRRqR4EXS2JwbUk)

클릭하시면 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgZGld5YuKpL6zT-CgShFdaPEmAQpQ-6IPUBDSo4iKobKf8j1yvE21ZCEpQm4VIi2StEPbJhd8QqAaCUlMwzD_HpIHW3gAXcvURx1VZj-q7c298LI5Z7i1QfYAtTLB6mWgsmmS4duSuk3uwScrqMATrzRz-UDk9csKcyLgunuaA-pBS-3WBombQ8GhW2io)

위와 같이 Devtools가 나타날 겁니다.

위 화면을 보시면 아까 useQuery에 넣었던 'queryKey' 값인 'todos' 값이 보이고요.

그리고 Fresh, Fetching, Paused, Stale, Inacive 등의 상태를 확인할 수 있습니다.

이제 여러 가지 옵션을 두어 Fresh, Fetching, Paused, Stale, Inacive 등을 쉽게 관찰할 수 있는겁니다.

모든 옵션을 지우고 브라우저를 새로 고침하면 Fetching 값이 1로 변하다가 다시 0으로 바뀝니다.

```js
  const {
    isPending,
    isError,
    data: todos,
    error,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });
```

그리고 Stale 값이 1로 바뀌죠.

이제 토글 버튼을 누르면 Inactive 값이 1로 바뀌게 됩니다.

당연한거죠. 화면에 안 보이니까요.

이제 다시 토글 버튼을 눌러 볼까요?

Fetching 값이 1로 변하다가 다시 0으로 변하고, Stale 값이 0에서 1로 변합니다.

여기까지 전부 예측할 수 있는건데요.

즉, Devtools가 아주 직관적으로 만들어졌다는 뜻이죠.

---

##  17. <a name='staleTime-1'></a>staleTime을 설정한 경우

이제 아래와 같이 staleTime을 5초로 설정해 봅시다.

```js
const {
  isPending,
  isError,
  data: todos,
  error,
} = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  staleTime: 5000,
});
```

이제 브라우저를   Fetching 값이 1에서 0으로 변하고 그 다음으로 Fresh 값이 0에서 1로 변할 겁니다.

그리고 5초가 지나면 다시 Stale 값이 1로 변할 겁니다.

즉, staleTime 값을 5초로 두었기 때문에 브라우저가 새로고침하고 fetching이 끝날 때 쿼리가 fresh 하다는 뜻이죠.

그리고 5초가 지나면 신선하지 않은 stale 상태가 되는 거죠.

아주 직관적이며 이해하기 쉬운 구조로 되어 있어 TanStack Query를 좀 더 쉽게 이해할 수 있을 겁니다.

---

##  18. <a name='gcTime0-1'></a>gcTime을 0으로 설정하면

staleTime 옵션을 지우고 gcTime 을 0으로 설정해 볼까요?

```js
  const {
    isPending,
    isError,
    data: todos,
    error,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
    gcTime: 0,
  });
```

브라우저를 새로 고침하면 fetching 값이 1에서 0으로 바뀌고 그다음 stale 값이 0에서 1로 바뀝니다.

이 상태에서 토글 버튼을 눌러볼까요?

신기하게도 DevTools에는 아래 그림처럼 'todos' 쿼리키가 사라지게 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiMjOLU4RQtWc_AzQVDdTGvNw0ljJN3wh0HM9A8PhJEB6TrQ5yUaYVy2M_pxN40D0PNZacYvSOTulIxucmzCJympt2mcs2dvuqgJpC2yUeEXTECY0H7AfphoKYVcOUCxoUkxiSuRpKtZ8lsc5lzuDPtdR8sowLGyRaOtLO2wRzV4MGU0EIUPLa0TPH23rY)

왜냐하면 gcTime이 0이라는 뜻이죠. 다시 말해 가비시 컬렉트가 바로 수행된다는 뜻입니다.

즉, 토글 버튼으로 Todo 컴포넌트를 없애버리면 Query 캐시가 바로 가비지 컬렉트 되기 때문에 위 그림처럼 'todos' 쿼리 자체가 없어져 버린 겁니다.

gcTime을 좀 더 직관적으로 이해할 수 있게 되었네요.

gcTime을 5,000(5초)으로 설정한 경우에는 토글 버튼을 누른 후 5초 후에 `[“todos”]`가 사라질 겁니다.

---

##  19. <a name='useQuery-1'></a>여러 useQuery 설정

지금까지는 todos 쿼리 밖에 없었는데요.

Prisma를 이용해서 User 모델을 추가하고 users 쿼리도 추가해 봅시다.

일단 모든 개발 서버를 끕시다.

백엔드 폴더의 prisma 폴더에서 schema.prisma 파일에 아래와 같이 추가합시다.

```bash
model Users {
    id          Int @id @default(autoincrement())
    name        String
}
```

Users라는 모델을 추가했습니다.

이제 다시 db push 해야합니다.

```bash
npx prisma db push
```

Prisma Studio를 통해 users 테이블에 더미 데이터 몇 개 추가해 봅시다.

```bash
npx prisma studio
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEgn1zQQxZX-Dj_SySqatIPT1wU8haImKtwAAqF2duDmiPyV339pczm-bWsLFOXwdXEWClGEeHEepxH4UHxD5gSB8yQ-D_hkQGDpl7EadOXjLybycKChOASRb0Z0eOfE6MWHyKWPKu8U2kSBPXyypDoMs0Hxp_uTzztWc18z9cHyUX_mJ3Q9wMR8Tj2mhN4
)

이제 express 서버에 '/users' 라우팅을 추가합시다.

```js
app.get("/users", async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const users = await prisma.users.findMany();
  return res.json(users);
});
```

백엔드 개발 서버를 돌려 테스트해 봅시다.

```bash
curl http://localhost:3000/users
[{"id":1,"name":"john"},{"id":2,"name":"jane"}]
```

익스프레스 서버는 제대로 작동하네요.

이제 리액트 코드에 users 테이블을 가져오는 쿼리를 추가해 봅시다.

components 폴더에 Users.tsx 파일을 만들고 아래와 같이 작성합니다.

```js
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const fetchUsers = async () => {
  const res = await axios.get("http://localhost:3000/users");
  return res.data;
};

const Users = () => {
  const {
    isPending,
    isError,
    data: users,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <span>Error: {error.response.data.message}</span>;
  }

  return (
    <>
      <h1>Users List</h1>
      <ul>
        {users && users?.map((user) => <li key={user.id}>{user.name}</li>)}
      </ul>
    </>
  );
};

export default Users;
```

Todo 컴포넌트와 비슷합니다.

이제 다시 App.jsx 파일에서 Users 컴포넌트를 가져와 봅시다.

```js
import Todo from "./components/Todo";
import Users from "./components/Users";
import "./App.css";
import { useState } from "react";

function App() {
  const [show, setShow] = useState(true);
  return (
    <>
      <button onClick={() => setShow(!show)}>Todo Toggle</button>
      <div className="App">{show && <Todo />}</div>
      <div className="App">{show && <Users />}</div>
    </>
  );
}

export default App;
```

이제 브라우저에서 보시면 아래와 같이 나오는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgVXskarjCe2XYbObr55wryNyJNKz0NiJ_p9a7SIVujLZ65riCvjApDyvKiiX_AINWMbkdgYMcOsIUsngljayqC17LwGyT0lSqmepVFi6D89mopjurCsO77nB0RGA7Zphp1pmM2Lf4R4eUk6RkIic00TxWMBe7FjHvBSCnbyi0gULrGKkTfycGg_X9Hg6U)

쿼리 두 개가 Devtools에서 보입니다.

쿼리 각각을 하나씩 클릭하면 해당 쿼리의 세부사항을 볼 수 있을 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjRUoYlaI8r7XepN0PihjEYUcagkEEN5sl1Z4Zdqz62ikQ2xVyZ01e3s5QQyCWviGEPFfFLSXB8tlvyNrbgxGArWZPgJgqUXwyBsyBBa7xZ9YSSsjtBh7wG1LN_BhCEVQETm6uiO3OTYkEiEC9o3CRRNq7SyNNCGYGC4lsAHe-nI0YtSvUhT2yUmMcNe4g)

이렇듯 Devtools만 있으면 아주 쉽게 쿼리를 디버그 할 수 있으니까요.

꼭 개발할때는 같이 설치해서 사용하십시요.

아주 편합니다.

지금까지 TanStack Query에 대해 살펴보았는데요.

제가 맛보기로 설명한 기능 말고 정말 많은 기능이 있으니까요, 꼭 공식문서를 참조하시기 바랍니다.

끝.

