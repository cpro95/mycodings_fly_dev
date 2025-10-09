---
slug: 2022-08-24-next-js-ultimate-guide-and-cheat-sheet
title: Next.js 완벽 가이드(치트 시트)
date: 2022-08-24 04:03:36.330000+00:00
summary: Next.js 한눈에 보는 완벽 가이드(치트 시트)
tags: ["next.js", "guide", "cheat-sheet"]
contributors: []
draft: false
---

![mycodings.fly.dev-next-js-ultimate-guide](https://blogger.googleusercontent.com/img/a/AVvXsEjO0pinCN8SoAcCG9aD6yt4u1Q3hfqx5x-92ANuKkZycLoLP157vS8sNiLJkB4-f2vohOP8vp9Z8ZkG2cAOcrvFzoWvy1rdxXr2zw7Cur1QgFiLboIZAaehcWgex3oUm2veYeP_WGKnrPxGhw-JunK_jFcsV7KiWMhBxC96LK17RgBBOALWu2EDBYKk)

안녕하세요?

Next.js가 유명해지면서 많은 분이 Next.js를 이용해서 웹 애플리케이션을 만들고 있는데요.

오늘은 Next.js의 치트 시트를 만들어 볼까 합니다.

시간 날 때 한 번씩 보면 많은 도움이 될 거로 생각합니다.

--- 

목차

1. 설치(Setup)
2. 페이지 생성(Create pages)
3. 데이터 가져오기(Fetch data)
4. CSS로 스타일 꾸미기(Style your Next.js app)
5. 이미지 최적화 그리고 폰트(Optimize images and fonts)
6. 코드 린팅(Linting your code)
7. 타입스크립트 적용(TypeScript support)
8. script 태그 추가하기(Using scripts)
9. 앱 레벨 라우팅(App-level routing)
10. API 라우팅(API routing)
11. 미들웨어(Middlewares)
12. 인증(Authentication)
13. 테스팅(Testing)

--- 

## 1. 설치(Setup)

Next.js 앱을 만드는 가장 쉬운 방식은 create-next-app을 사용하면 됩니다.

```bash
npx create-next-app@latest

또는

yarn create next-app
```

그러고 나서 아래 명령어로 개발 서버를 돌리면 되는데요.
Next.js 개발 서버 주소는 가장 기본적인 3000 포트입니다.
http://localhost:3000

```js
npm run dev

또는

yarn dev
```

만약 create-next-app 명령어를 쓰지 않고 수작업으로 Next.js 앱을 만들고 싶으면 직접 아래와 같이 설치하시면 됩니다.

```bash
npm install next react react-dom

또는

yarn add next react react-dom
```

그러고 나서 package.json 파일에 아래 scripts 내용을 넣으시면 됩니다.

```js
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
```

---

## 2. 페이지 생성(Create pages)

Next.js에서 정적 페이지를 만들려면 page 폴더 밑에 예를 들어 demo.js라는 이름으로 파일을 만들고 그 파일에 React 컴포넌트를 넣고 마지막으로 만들었던 React 컴포넌트를 export 하면 됩니다.

```js
function Demo() {
  return <h1>Demo</h1>
}

export default Demo
```

위에서 page 폴더 밑에 demo.js라는 이름으로 페이지를 만들었으면 개발서버에서의 주소는 바로 아래와 같습니다.

일명 페이지 방식 라우팅인 거죠.

http://localhost:3000/demo

---

## 3. 데이터 가져오기(Fetch data)

Next.js에는 외부에서 데이터를 가져오는 방식이 여러 가지가 있는데요.

먼저 getServerSideProps함수를 이용한 방식이 있습니다.

getServerSideProps 함수는 이름에서도 알 수 있듯이 매 리퀘스트(request)마다 서버사이드 쪽에서 수행되는 함수인데요.

만약 여러분께서 페이지를 미리 렌더링 하고 싶을 때는 바로 getServerSideProps함수를 쓰면 됩니다.

```js
export async function getServerSideProps(context) {

  return {
    props: {},
  }
}
```

아래는 getServerSiteProps 함수를 이용해서 data를 클라이언트 사이드 쪽인 React 컴포넌트로 전달하는 예제입니다.

props라는 항목이 있는 객체를 리턴하면 됩니다.

```js
function Page({ data }) {
  // Code to render the `data`
}

export async function getServerSideProps() {
  const res = await fetch(`https://.../data`)
  const data = await res.json()
  
  return { props: { data } }
}

export default Page
```

두 번째는 바로 getStaticPaths인데요.

말 그대로 정적 경로를 리턴하는 함수입니다.

getStaticProps를 통해 동적 경로의 데이터를 리턴할 때 해당 경로를 지정해 줘야 하는 게 바로 getStaticPaths입니다.

아래는 getStaticPaths 예제인데요.

paths 배열 항목이 있는 객체를 리턴하면 됩니다.

그리고 paths 배열에는 params 항목이 있는 객체가 있어야 하고요.

```js
export async function getStaticPaths() {

  return {
    paths: [
      { params: { ... } }
    ],
    fallback: true 
  };
}
```

세 번째가 바로 Next.js에서 가장 많이 쓰이는 getStaticProps 함수입니다.

이 함수는 빌드 타임에 서버사이드 데이터를 넘겨주는데요.

정적 사이트에 서버사이드 쪽에서 계산한 데이터를 심을 때 사용하는 함수입니다.

이 함수도 props 항목이 있는 객체를 리턴하면 됩니다.

```js
export async function getStaticProps(context) {

  return {
    props: {}, 
  }
}
```

아래 예제는 getStaticProps 함수를 이용해서 데이터를 가져왔을 때 그걸 클라이언트 사이드 쪽인 React 컴포넌트에서 사용하는 방식입니다.

```js
function BlogPosts ({ posts }) {

  return (
    <>
        <h1>{post.title}</h1>
      ))}
    </>
  )
}

export async function getStaticProps() {

  const res = await fetch('https://.../posts')
  const posts = await res.json()
  
  return {
    props: {
      posts,
    },
  }
}

export default BlogPosts
```

마지막으로 Next.js 최신 버전에 추가된 Incremental Static Regeneration(ISR) 방식이 있는데요.

getStaticProps 함수를 이용해서 빌드 타임에 가져온 데이터를 일정 시간마다 갱신하는 방식입니다.

예를 들어 10초라고 하면 한 명의 사용자가 페이지를 리퀘스트(request)하고 10초 후에 다시 또 다른 사용자가 페이지를 리퀘스트(request)했을 때 페이지의 데이터를 다시 불러오는 방식입니다.

만약, 10초 후 리퀘스트(request)가 없으면 페이지는 예전 그대로를 유지하게 됩니다.
 
ISR를 하려면 아래와 같이 getStaticProps 함수에 revalidate 항목을 추가하면 됩니다.

```js
export async function getStaticProps(context) {

  return {
    props: {},
    revalidate: 5 // 5초마다 페이지 갱신
  }
}
```

### 클라이언트 사이드에서 데이터 가져오기

보통 React에서 하는 방식인 useEffect 훅을 이용하면 됩니다.

```js
function User() {

  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(false)
  
  useEffect(() => {
    setLoading(true)
    fetch('api/user-data')
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setLoading(false)
      })
  }, [])

  if (isLoading) return <p>Loading user data...</p>
  if (!data) return <p>No user data found</p>

  return (
      <h1>{data.name}</h1>
    </div>
  )
}
```

아니면 Next.js 는 SWR 라이브러리를 제공해주는데요.

SWR 라이브러리는 캐싱(caching), 리 밸리데이션(revalidation), 포커스 트래킹(focus tracking), 리 페칭(refetching on intervals) 등 다양한 기능을 제공합니다.

```js
import useSWR from 'swr'

const fetcher = (...args) => fetch(...args).then((res) => res.json())

function User() {
  const { data, error } = useSWR('/api/user-data', fetcher)
  if (error) return <div>Failed to load user data</div>
  if (!data) return <div>Loading user data...</div>
  
  return (
      <h1>{data.name}</h1>
    </div>
  )
}
```

---

## 4. CSS로 스타일 꾸미기(Style your Next.js app)

Next.js에서 스타일을 적용하는 방법은 여러 가지가 있는데,

첫 번째, 글로벌 스타일링이 있습니다.

pages/_app.js 파일에 글로벌하게 사용할 styles.css 파일을 로드하면 이 스타일이 모든 페이지에 적용되는 방식입니다.

```js
import '../styles.css'

export default function MyApp({ Component, pageProps }) {

  return <Component {...pageProps} />

}
```

컴포넌트 방식의 CSS가 있는데요.

[name].module.css라고 이름 지어서 각각의 컴포넌트마다 따로 import 하면 됩니다.

// Button.module.css 
```js
.error {
  color: white;
  background-color: red;
}
```

// Button.jsx
```js
import styles from './Button.module.css'

export function Button() {

  return (
    <button
      type="button"
      className={styles.error}
    >
      Cancel
    </button>
  )
}
```

SASS를 사용하려면 먼저 sass 패키지를 설치해야 합니다.

```bash
npm install --save-dev sass
```

그러고 나서 next.config.js에 아래와 같이 SASS설정을 추가하면 됩니다.

```js
const path = require('path')

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
}
```

---

## 5. 이미지 최적화 그리고 폰트(Optimize images and fonts)

Next.js의 장점 중 하나가 바로 이미지를 최적화할 수 있는 Next.js 고유의 Image 컴포넌트인데요.

아래와 같이 기본 설치되어 있는 Image 컴포넌트만 불러와서 쓰면 됩니다.

```js
import Image from 'next/image'

const myLoader = ({ src, width, quality }) => {
  return `https://example.com/${src}?w=${width}&q=${quality || 75}`
}

const MyImage = (props) => {

  return (
    <Image
      loader={myLoader}
      src="me.png"
      alt="Picture of the author"
      width={500}
      height={500}
    />
  )
}
```

Next.js는 inline CSS에서 불러온 폰트를 자동으로 최적화시킵니다.

만약에 구글 웹 폰트 같은 걸 불러오려면 아래와 같이 pages/_document.js 파일을 수정하면 됩니다.

// pages/_document.js
```js
import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {

  render() {
    return (
      <Html>
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Inter&display=optional"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
```

---

## 6. 코드 린팅(Linting your code)

package.json 파일에 아래와 같이 추가하면 자동으로 ESLint를 할 수 있습니다.

```js
"scripts": {
  "lint": "next lint"
}
```

만약 Next.js가 설치되어 있지 않은 monorepo를 사용 중이라면 아래와 같이 .eslintrc 파일에 추가하면 됩니다.

```js
{
  "extends": "next",
  "settings": {
    "next": {
      "rootDir": "packages/my-app/"
    }
  }
}
```

ESLint와 같이 Prettier를 사용하고 싶을 때는 아래와 같이 관련 패키지를 설치하고

```bash
npm install --save-dev eslint-config-prettier

또는

yarn add --dev eslint-config-prettier
```

그리고 .eslintrc 설정 파일에 다음과 같이 추가하면 됩니다.

```js
{
  "extends": ["next", "prettier"]
}
```

---

## 7. 타입스크립트 적용(TypeScript support)

Next.js 앱을 타입스크립트로 작성하고 싶으면 create-next-app을 실행할 때 –-ts 옵션이나 –-typescript 옵션을 추가하면 됩니다.

```js
npx create-next-app@latest --ts

또는

yarn create next-app --typescript
```

만약 기존에 자바스크립트로 작성된 Next.js앱에 타입스크립트를 추가하려고 하려면 최상위 폴더에 tsconfig.json 파일만 만들고 개발서버 한 번만 돌려주면 Next.js가 알아서 나머지 설정을 안내해 줄 겁니다.

---

## 8. script 태그 추가하기(Using scripts)

HTML에 원래 있던 `<script>` 엘러먼트는 Next.js에서 next/script 컴포넌트로 대체되었는데요.

아래 예제처럼 사용하시면 됩니다.

```js
import Script from 'next/script'

export default function Home() {

  return (
    <>
      <Script src="https://www.google-analytics.com/analytics.js" />
    </>
  )
}
```

`<Script>` 컴포넌트는 옵션이 3가지가 있는데 아래와 같습니다.

beforeInteractive: 페이지가 활성화되기 전에 스크립트를 로딩
afterInteractive: 페이지가 활성화되면 그 즉시 스크립트를 로딩
lazyOnload: idle 시간에 스크립트 로딩

```js
<Script
  src="https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.js"
  strategy="beforeInteractive"
/>
```

---

## 9. 앱 레벨 라우팅(App-level routing)

Next.js는 파일 베이스 라우팅을 제공하는데요.

index.js 파일을 이용한 방식도 사용할 수 있습니다.

예를 들어 pages/index.js 파일은 라우팅 주소가 '/'가 되고, pages/blog/index.js 파일은 주소가 '/blog'가 됩니다.

또 그냥 파일 이름만 적어도 그게 주소가 되는데요.

pages/blog/my-post.js 파일을 만들었으면 주소가 바로 '/blog/my-post'가 됩니다.

그리고 다이내믹(동적) 라우팅도 제공해주는데요.

pages/[username]/settings.js 파일을 만들었다면 동적 항목인 username이 만약 'john'이라면, 주소가 'john/settings'가 됩니다.

그리고 Next.js는 클라이언트 사이드 쪽에서의 라우팅을 위해 `<Link>` 컴포넌트를 제공해줍니다.

아래와 같이 사용하시면 됩니다.

```js
import Link from 'next/link'

function Home() {

  return (
    <ul>
      <li>
        <Link href="/">
          <a>Home</a>
        </Link>
      </li>
      <li>
        <Link href="/about">
          <a>About Us</a>
        </Link>
      </li>
      <li>
        <Link href="/blog/hello-world">
          <a>Blog Post</a>
        </Link>
      </li>
    </ul>
  )
}

export default Home
```

다이내믹(동적) 경로일 경우 아래와 같이 스트링 리터럴을 사용하시면 훨씬 쉽습니다.

```js
import Link from 'next/link'

function Posts({ posts }) {

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <Link href={`/blog/${encodeURIComponent(post.slug)}`}>
            <a>{post.title}</a>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default Posts
```

---

## 10. API 라우팅(API routing)

Next.js는 API 라우팅을 제공해주느데요.

pages/api 폴더 밑에 있는 파일 이름은 주소가 '/api/***' 방식으로 매칭 되고 흔히 얘기하는 자체 API 경로로 사용할 수 있습니다.

API 라우팅을 만들려면 다음과 같이 /pages/api 폴더 밑에 적당한 이름의 파일을 만들고 그 파일에서 handler 함수를 export 하면 됩니다.

```js
export default function handler(req, res) {
  res.status(200).json({ name: 'John Doe' })
}
```

또는 아래와 같이 req.method를 이용해서 'POST', 'GET', 'DELETE', 'PUT' 등 다양한 HTTP 메써드에 대응할 수 있습니다.

```js
export default function handler(req, res) {

  if (req.method === 'POST') {
    // Process a POST request
  } else {
    // Handle any other HTTP method
  }
}
```

---

## 11. 미들웨어(Middlewares)

Next.js에서 미들웨어를 사용하려면 Next.js 최신 버전이 필요합니다.

그러고 나서 _middleware.ts 파일을 /pages 폴더 밑에 만들고 export 하면 됩니다.

```js
import type { NextFetchEvent, NextRequest } from 'next/server'

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  return new Response('Hello, world!')
}
```

아래 예제는 로깅 미들웨어 예제입니다.

```js
import { NextRequest } from 'next/server'

// Regex for public files
const PUBLIC_FILE = /\.(.*)$/

export default function middleware(req: NextRequest) {
  
  // Only log for visited pages
  if (!PUBLIC_FILE.test(req.nextUrl.pathname)) {
    // We fire and forget this request to avoid blocking the request until completion
    // and let logging occur in the background
    fetch('https://in.logtail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.LOGTAIL_TOKEN}`,
      },
      body: JSON.stringify({
        message: 'Log from the edge',
        nested: {
          page: req.nextUrl.href,
          referrer: req.referrer,
          ua: req.ua?.ua,
          geo: req.geo,
        },
      }),
    })
  }
}
```
---

## 12. 인증(Authentication)

Next.js에서 인증하는 방법은 여러 가지가 있는데, 가장 일반적인 방법은 아래와 같습니다.

정적으로 생성되는 페이지에서의 인증은 클라이언트 상에서 스켈레톤 상태를 보여주다가 인증이 완료되면 페이지를 보여주는 방식입니다.

```js
import useUser from '../lib/useUser'
import Layout from '../components/Layout'

const Profile = () => {
  // Fetch the user client-side
  const { user } = useUser({ redirectTo: '/login' })
  
  // Server-render loading state
  if (!user || user.isLoggedIn === false) {
    return <Layout>Loading...</Layout>
  }

  // Once the user request finishes, show the user
  return (
      <h1>Your Profile</h1>
    </Layout>
  )
}

export default Profile 
```

두 번째로 서버 사이드 쪽 인증 방식인데요.

아래 예제에서 보듯이 getServerSideProps 함수에서 아예 user 인증을 가지고 와서 그걸 클라이언트에 props로 전달하는 방식입니다.

서버 사이드에서 user가 인증이 안 되면 바로 redirect 되는 방식이라 인증 없이는 화면의 스켈레톤 상태도 보이지 않는 방식이죠.

```js
import withSession from '../lib/session'

import Layout from '../components/Layout'

export const getServerSideProps = withSession(async function ({ req, res }) {

  const { user } = req.session
  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return {
    props: { user },
  }
})

const Profile = ({ user }) => {

  // Show the user. No loading state is required
  return (
      <h1>Your Profile</h1>
    </Layout>
  )
}

export default Profile
```

Next.js에 쉬운 방식의 인증을 제공해 주는 툴이 많은데요.

대표적인 게 바로 Auth0, Firebase, Supabase가 있습니다.

그리고 NextAuth 패키지도 있으니까 설명서를 참고해 보면 됩니다.

---

## 13. 테스팅(Testing)

테스트 방식도 여러가지가 있는데 대표적으로 Cypress 테스트를 하려면 아래와 같이 하면 됩니다.

Next.js 앱을 만들 때 cypress 지정하기

```bash
npx create-next-app@latest --example with-cypress with-cypress-app

또는 직접 cypress 패키지 설치

npm install --save-dev cypress
```

수동으로 직접 cypress 패키지를 설치했다면 아래와 같이 package.json 파일에 관련정보를 추가해야 합니다.

```js
"scripts": {
  ...
  "cypress": "cypress open",
}
```

cypress 실행은 다음과 같이 하면 됩니다.

```bash
npm run cypress
```

Cypress 테스트 파일을 만들려면 cypress/integration/app.spec.js 파일에 다음과 같이 테스트 내용을 적으면 됩니다.

```js
describe('Navigation', () => {
  it('should navigate to the about page', () => {
    // Start from the index page
    cy.visit('http://localhost:3000/')
    
    // Find a link with an href attribute containing "about" and click it
    cy.get('a[href*="about"]').click()

    // The new url should include "/about"
    cy.url().should('include', '/about')
    // The new page should contain an h1 with "About page"
})
```

Jest를 이용해서 테스트하려면 다음과 같이 처음부터 제공해주는 파일을 이용하는 방식이 있고 직접 설치하는 방식도 있습니다.

```bash
npx create-next-app@latest --example with-jest with-jest-app

또는 직접 설치

npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

그리고 프로젝트 루트 폴더에 jest.config.js 파일을 다음과 같이 만들면 됩니다.

```js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jest-environment-jsdom',

module.exports = createJestConfig(customJestConfig)
```

package.json 파일에는 아래와 같이 설정해 주면 됩니다.

```js
"scripts": {
  ...
  "test": "jest --watch"
}
```

그리고 __tests__/index.test.jsx 파일에 테스트 내용을 작성하면 됩니다.

```js
import { render, screen } from '@testing-library/react'
import Home from '../pages/index'

describe('Home', () => {
  it('renders a heading', () => {
    render(<Home />)
    const heading = screen.getByRole('heading', {
      name: /welcome to next\.js!/i,
    })
    expect(heading).toBeInTheDocument()
  })
})
```

npm run test 명령어를 입력하면 Jest 테스트가 실행될겁니다.

---

지금까지 Next.js에 대해 가끔 헷갈릴 때 찾아볼 수 있는 완벽 가이드(치트 시트)를 작성해 봤습니다.

많은 도움이 됐으면 하네요.

그럼.