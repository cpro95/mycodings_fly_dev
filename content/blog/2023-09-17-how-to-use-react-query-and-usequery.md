---
slug: 2023-09-17-how-to-use-react-query-and-usequery
title: React Query 강좌 1편. useQuery 사용법 기초
date: 2023-09-17 07:08:40.261000+00:00
summary: React Query에서 기초적인 useQuery 사용법
tags: ["react-query", "react", "usequery"]
contributors: []
draft: false
---

안녕하세요?

오늘은 React Query(react-query)에 대해 알아보겠습니다.

전체 시리즈 링크는 아래와 같습니다.

1. [React Query 강좌 1편. useQuery 사용법 기초](https://mycodings.fly.dev/blog/2023-09-17-how-to-use-react-query-and-usequery)

2. [React Query 강좌 2편. 캐시로 움직이는 useQuery 작동 원리(cachetime,staletime,refetch,poll)](https://mycodings.fly.dev/blog/2023-09-17-react-query-cachetime-staletime-refetch-poll)

3. [React Query 강좌 3편. 클릭시 fetch하는 방법과 커스텀 콜백함수 작성, useQuery에서 데이터 변환, 커스텀 훅 만들기](https://mycodings.fly.dev/blog/2023-09-24-react-query-refetch-on-click-success-callback-data-transformation)

4. [React Query 강좌 4편. id로 특정 항목만 가져오는 쿼리 방법(query by id)과 병렬 쿼리(parallel queries) 방법](https://mycodings.fly.dev/blog/2023-09-24-react-query-tutorial-query-by-id-and-parallel-queries)

5. [React Query 강좌 5편. 동적 병렬 쿼리(dynamic parallel queries)와 필요충분 쿼리 만들기(dependent query)](https://mycodings.fly.dev/blog/2023-09-24-react-query-dynamic-parallel-queries-and-dependent-query)

6. [React Query 강좌 6편. useQueryClient와 initialData를 이용해서 캐시된 데이터 활용하여 상세 페이지에서 보여주기](https://mycodings.fly.dev/blog/2023-09-24-react-query-usequeryclient-initialdata-using-cache)

7. [React Query 강좌 7편. 페이지네이션 구현하기와 useInfiniteQuery로 무한스크롤 구현하기](https://mycodings.fly.dev/blog/2023-09-24-react-query-paginated-query-and-infinite-query)

8. [React Query 강좌 8편. useMutation 사용법과 Optimistic Updates](https://mycodings.fly.dev/blog/2023-10-02-react-query-howto-usemutation-in-depth)

---

** 목 차 **

1. [프로젝트 setup](#1-프로젝트-setup)
2. [백엔드 API 서버 고르기](#2-백엔드-api-서버-고르기)
3. [axios를 사용한 data fetching](#3-axios를-사용한-data-fetching)
4. [react-query를 사용한 data fetching](#4-react-query를-사용한-data-fetching)
5. [ReactQueryDevtools 사용하기](#5-reactquerydevtools-사용하기)

## 1. 프로젝트 setup

먼저, 테스트를 위해 프로젝트를 만들어 보겠습니다.

```bash
npm create vite@latest react-query-test
cd react-query-test
npm install
```

관련 패키지도 같이 설치하겠습니다.

```bash
npm i react-query axios react-router-dom
```

그리고 CSS를 위해 TailwindCSS 도 설치하겠습니다.

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

index.css 파일입니다.

```js
@tailwind base;
@tailwind components;
@tailwind utilities;
```

tailwind.config.js 파일입니다.

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

App.css 파일은 지워주시고, 전체적인 폼은 react-router-dom을 이용해서 라우팅을 만들겠습니다.

```js
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
```

```js
import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './components/Home'
import { AxiosQuery } from './AxiosQuery'
import { ReactQuery } from './ReactQuery'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='/axios-query' element={<AxiosQuery />} />
          <Route path='/react-query' element={<ReactQuery />} />
        </Route>
      </Routes>
    </>
  )
}
export default App
```

components 폴더에 만들게 전체적인 레이아웃인 Layout 컴포넌트와 Header 컴포넌트도 만들겠습니다.

```js
import { Outlet } from 'react-router-dom'
import { Header } from './Header'

export const Layout = () => {
  return (
    <div className='p-8'>
      <Header />
      <Outlet />
    </div>
  )
}
```

```js
import { Link } from 'react-router-dom'

export const Header = () => {
  return (
    <nav className='mb-4 flex space-x-5 border-b-2 py-2'>
      <Link to='/'>Home</Link>
      <Link to='/axios-query'>Axios Query</Link>
      <Link to='/react-query'>React Query</Link>
    </nav>
  )
}
```

```js
export const Home = () => {
  return (
    <div>
      <h2 className='text-4xl'>React Query Tutorial</h2>
    </div>
  )
}
```

이제 실행 결과를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEheJMa5oFdKq_fA1VnkrMHtoWeCiHYGt9ilzvdszCZSGeneCG9Ear5fJN6e-mDtZeYMFV2q7nIoZpqXXy1_kCvvyaA0Hh0dkQ3xaP2CeBC4yO541S0MkzuD3cOuxHIcjvBLDgN-H1CDNy_05r66L1LWgEMMNMZvH0YCSeDwK5Ikho8qt8XkHffd4UcnSA8)

---

## 2. 백엔드 API 서버 고르기

테스트를 위해 `https://jsonplaceholder.typicode.com/users` API 서버를 사용해도 되고,

로컬에서 [json-server](https://github.com/typicode/json-server)를 이용해서 직접 만든 json 파일을 이용해서 fake REST API를 구현해도 됩니다.

json-server 사용법은 Github 페이지에 가면 자세히 나와있습니다.

저는 저번에 만든 pocketbase 서버를 이용할 예정입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEh0t0Z3Uu6w2J2cucaAe3KOcP2W4yYA5nu0s5iKlApfsHso0HN2DCMijaKbCO2CvGw6TNYnKjIKHnxeWdrSSjBsrcf9VyUa44IMxBKqgzuBNMdhov5SUoIDQfy_t9eSEtbSqm-1X2GdXyfbrfLEdY39m36JWqHeDMDQvug9WHZegFbwu-J-mXciNI4ex1g)

위와 같이 products라는 컬렉션을 만들었습니다.

당연히 Api Rules를 아래 그림과 같이 허용해야 하는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiP-aRHrDulgcQkjDQbJkL1oXleFHaIobvKhdCtPY6kO7wQruunrL2GRf2zpeTNOxdsPedgjs1rO4c3NCCW_MOQYsngMOKzu3difG8zEhdf0hBwP7ZVrW_AS1a1VneAaNbBoXEuUE4G2u3gK_82viCZNHrRbsLVMTpI_jiEIPwIarfRtzhspiggPkXifi0)

그러면 Open된 API가 되는겁니다.

아래 사진은 실제 데이터입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjseUm52Rf8yXPY2mS8lZbbSbaZZf22pLU7yap3o1UO04zEdWD1-u-HT9jVPWCcEPuuBjUSkKH7TdHnUgA1gvtudMlWFJtjlgUlvsjYkjQt-SivTg3giqIUK8C9XyGfwgmbIFhuiKXlc4JWzuiOQNObV6BEXm1u6AvUl2kV_J2nkHVLh4ZJNagquGMIwKY)

백엔드 DB도 준비가 완료되었네요.

---

## 3. axios를 사용한 data fetching

이제 본격적으로 axios를 사용해서 data를 가져오는 코드를 작성해 보겠습니다.

App.jsx 파일과 같은 위치에 AxiosQuery.jsx 파일을 만들겠습니다.

axios를 이용해서 데이터를 가져올 때, 외부 서버와의 통신으로 통신상태에 따라 랙과 에러가 걸릴 수 있는데요.

이 부분을 직접 관리해 줘야 합니다.

```js
import { useState, useEffect } from 'react'
import axios from 'axios'

export const AxiosQuery = () => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState()

  useEffect(() => {
    setIsLoading(true)
    axios
      .get('https://mypocketbase.fly.dev/api/collections/products/records')
      .then(res => {
        setData(res)
        setIsLoading(false)
      })
      .catch(e => {
        setError(e.message)
        setIsLoading(false)
      })
  }, [])

  if (isLoading) return <>Loading...</>

  if (error) return <h2>{error}</h2>

  return (
    <>
      <div className='text-4xl'>AxiosQuery</div>
      <ul className='list-disc p-4'>
        {data &&
          data.data?.items?.map(product => (
            <li key={product.id}>
              {product.name} / {product.price}
            </li>
          ))}
      </ul>
    </>
  )
}
```

useState로 3가지 리액트 스테이트(State)를 만들었습니다.

data는 axios로 가져오는 실제 데이터이고,

isLoading은 외부 API 서버와의 통신으로 발생할 수 있는 잠깐의 시간 동안 화면에 Loadin... 이라는 문구를 표시하기 위한 겁니다.

그리고 마지막으로 외부 API 서버와의 에러 발생 시 해당 에러를 error라는 State에 저장시켰습니다.

그리고 실제, axios를 이용한 외부 데이터 fetching은 useEffect 훅을 이용해서 리액트 컴포넌트가 처음 시작할 때 작동하도록 했습니다.

나머지, UI 코드는 보시면 쉽게 이해할 수 있습니다.

axios는 객체를 리턴하는데 그 객체에 data라는 항목이 바로 우리가 원하는 데이터입니다.

그래서 data.data라고 이중으로 참조한 겁니다.

그리고 pocketbase 서버는 최종 데이터를 items라는 배열로 리턴해 줍니다.

실행 결과를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEh6i4gLSSeD68zDVu5cpJKEQJHBA34pGHbTnINkI6y8bDelD5aiBMVINmTHRXrZ1lnMRTGiZWa72PfSanSqIeY5p3m82S5O_UdaywgoinyMMhSHUblhoHio9uWJhNDZe6l7It7BT-lpeohlRG6tcKQ0BodyewVFwuoImh1q3b-rt_WP4_gQa7vCMfnW4mw)

Loading... 이라는 문구도 보입니다.

그리고 axios.get의 서버 주소 마지막에 1이라는 숫자를 추가해서 일부러 에러를 만들어 볼까요?

```js
axios..get("https://mypocketbase.fly.dev/api/collections/products/records1")
```

에러가 날 경우 아래처럼 브라우저에 표시될 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjC196BYxhsRifkjaz4GOLjQKZy9nShxXuCdUbUlcSZCOSK2aduOVX26nIsdQfls1oXXvuSEi0aV7wZU-dDuWghKsJdmqGDXai55cThrzK0KYEQ-vtPViD04xKvsnw_d9Dve5K2Yyputj3-9PmveJ1NAz9BrtO5jpBj8BdTymYQV_O2oTI7A_7SBQLFUdI)

---

## 4. react-query를 사용한 data fetching

우리가 React Query를 왜 사용하는지는 방금 만든 axios를 사용한 코드와 react-query의 useQuery를 사용해서 만든 코드를 비교해 보면 쉽게 이해할 수 있을 겁니다.

먼저, react-query를 사용하려면 QueryClientProvider를 사용해서 모든 컴포넌트를 감싸야하는데요.

App.jsx파일에서 해도 되고, index.jsx 파일에서 해도 됩니다.

저는 index.js 파일에서 BrowserRouter 위쪽으로 삽입했습니다.

```js
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)
```

이제, App.js와 같은 위치에 ReactQuery.jsx 파일을 아래와 같이 만듭니다.

```js
import { useQuery } from 'react-query'
import axios from 'axios'

export const ReactQuery = () => {
  const { isLoading, data, isError, error } = useQuery('get-product', () => {
    return axios.get(
      'https://mypocketbase.fly.dev/api/collections/products/records',
    )
  })

  if (isLoading) return <>Loading...</>
  if (isError) return <>{error.message}</>

  return (
    <>
      <div className='text-4xl'>ReactQuery</div>

      <ul className='list-disc p-4'>
        {data &&
          data.data?.items?.map(product => (
            <li key={product.id}>
              {product.name} / {product.price}
            </li>
          ))}
      </ul>
    </>
  )
}
```

react-query에서 제공해 주는 useQuery 훅은 첫 번째 인자로 문자열 또는 문자열의 배열을 받을 수 있는데요.

여기서는 문자열을 넣었습니다.

'get-product'라는 문자열을 넣었는데요.

이 문자열이 react-query에서는 queryKey가 됩니다.

react-query에서는 queryKey로 구분해서 data fetching을 수행합니다.

다음 시간에 자세히 설명해 드리겠습니다.

그리고 useQuery 훅의 두 번째 인자는 콜백 함수를 받는데요.

이 콜백함수에 실제 우리가 data fetching을 위한 axios.get 코드를 넣으면 됩니다.

useQuery 훅이 실행 완료되면 객체를 리턴하는데요.

보통 이 객체를 디스트럭쳐링(Destructuring)해서 원하는 데이터를 사용합니다.

isLoading, data, isError, error 처럼 useQuery가 기본적으로 제공해 주는 변수입니다.

예전 axios를 이용한 수동으로 data fetching 했을 때 우리가 일일이 useState를 이용해서 로딩 상태, 에러 상태를 관리해줘야 했었는데요.

useQuery에서는 그 모든 걸 다 제공해 줍니다.

data라고 리턴되는 객체에는 또다시 data라고 있습니다.

그래서 보통 ES6 alias 를 이용해서 data라는 변수를 다른 이름으로 바꿔 쓰기도 합니다.

```js
const { isLoading, data: products, isError, error} = useQury(......)
```

위와 같이 data를 products라는 이름으로 바꾼 겁니다.

실행 결과는 아래와 같이 똑같습니다.

심지어 에러 발생 시에도 똑같습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiT0RYMZvHHoqI8ZRX5_PLYMeSZpXwNpYheXlVimiEM5nKN2ngvSBIL8XlRcSSO1IWMUWLdMsZ7DYHjHaCTjRrSSSSr3rWy08yJ0CCFmZ3injrO1ZKgXpX3YsFAgOvGqTyYCmgjE_Dh-o3JJFvZt0ZPkO0Zkl5fWjVUtFnpFzwsvBAZYs5T19T50b_8Lc0)

여기서, useQuery 훅 함수에 두 번째 인자로 들어가는 콜백 함수를 따로 만드는 방법을 많이 쓰는데요.

코드를 좀 더 간결하게 쓰기 위해서입니다.

그래서 아래와 같이 바꿔도 됩니다.

```js
const fetchProducts = () => {
  return axios.get(
    "https://mypocketbase.fly.dev/api/collections/products/records"
  );
};

export const ReactQuery = () => {
  const { isLoading, data, isError, error } = useQuery("get-product", fetchProducts);

  if (isLoading) return <>Loading...</>;
  if (isError) return <>{error.message}</>;
...
...
}
```

어떤가요?

위와 같이 하면 좀 더 코드를 간결하게 사용할 수 있을 겁니다.

---

## 5. ReactQueryDevtools 사용하기

React Query는 자체적으로 Devtool을 지원합니다.

사용 방법을 알려드리겠습니다.

App.jsx 파일에 아래와 같이 ReactQueryDevtools 컴포넌트를 추가합니다.

```js
import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './components/Home'
import { AxiosQuery } from './AxiosQuery'
import { ReactQuery } from './ReactQuery'
import { ReactQueryDevtools } from 'react-query/devtools'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='/axios-query' element={<AxiosQuery />} />
          <Route path='/react-query' element={<ReactQuery />} />
        </Route>
      </Routes>
      <ReactQueryDevtools initialIsOpen={false} position='bottom-right' />
    </>
  )
}

export default App
```

initialIsOpen 변수와 position 변수도 추가했습니다.

실행 결과를 보시면 오른쪽 아래에 React Query 로고가 보이는데요.

이 걸 클릭하면 React Query DevTool이 나타납니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiesUGBRcxhi0sOKCjtzxa8q2EOsM6blv0r5n90HAJBh62noPDqi972y1HGLiFJVw4cAjT9pnacLDoz4CeGclHFNNlYq5JasYGxPwTKCtmBX4fysi08hnnP1-cr1q_Oo__9790e8xyaauR4PB6zUgknRO__y6YK4YUSFsv_ydzOjPRKJ08qQ6i5ts202Us)

위 로고를 클릭하면 아래와 같이 나오는데요.

우리가 위에서 queryKey로 만들었던 'get-product'가 나옵니다.

'get-product'를 클릭하면 그 밑에 좀 더 많은 게 나오는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEh_UObzY0HOt34EYtjiFQiPPbJZOZhezG8sPO2jZc822Pq_-snEBpUUnuQc0fziyOF6dhMAdlF8uQ9yCpSlJkkkBUtwlmXPJSzK1iBUswsNz2PNKTaupqfu0rxQOTCnm6TY9SQ08gF9QyJ9KVpNyV826uH5-LLW0yV8VXdSx66SjgId7cc1pFBpEk6sZ2w)

다음 시간부터는 이 정보를 이용해서 React Query에 대해서 좀 더 깊게 들어가 보겠습니다.

---
