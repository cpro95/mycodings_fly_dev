---
slug: 2023-05-31-nextjs-nextauth-tutorial-1-setup
title: NextAuth 사용법 1편 - Setup, Credentials
date: 2023-05-31 09:29:00.910000+00:00
summary: NextAuth 사용법 1편 - Setup, Credentials
tags: ["next.js", "nextauth", "credentials"]
contributors: []
draft: false
---

안녕하세요?

이번에는 예전 티스토리에서 작성했던 NextAuth 관련 글을 새롭게 Next.js 13.4.4 App Router 방식으로 새롭게 쓰려고 합니다.

먼저, 이메일, 패스워드 방식을 이용한 Credentials Provider를 사용할 예정이고,

나중에 카카오, 네이버 아이디로 로그인하는 것도 진행해 볼 예정입니다.

---

## Next.js 템플릿 준비

먼저, create-next-app을 이용해서 Next.js 템플릿을 준비해 봅시다.

```bash
npx create-next-app@latest next-auth-test
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEhHLXEwdAvJG-uxEsAzc8vNoaC3-VT3eK1gy7kBh7ebvYaswkV5kLZuiW5UT_AMqGvTaqy9RIneFd4TnSGOugMJUrE-P1z8EDzbqcQnuB39F3I4Wc4TFFlvDdvsvBjd6ShHXeavsfR5fLAoZhb0i4l_CB-GACKgBDXEGFwXtjspETRWx0ShvmQXm88x)

최신 버전이라 그런지 Typescript와 Tailwind CSS를 기본적으로 설치해 주네요.

위 그림은 모두 그냥 엔터키로 넘긴 상태입니다.

이제 next-auth-test 폴더로 들어가 'npm run dev'로 Next.js 앱을 돌려 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEh1ulVG4l_CbquU3HRprlPiAWKpdKQUklyHD7f7N3EVwQ3oI51_XuKDTU9vkSg_poTnS0MZEirRd8BqEanAtaw6Mh0bJNuVd19KFQckwP43UX4IOUeHsG2Hfi9i-uQLooWex_t6UD20WJtHvSqR6UrwngmJDD95zQ9uR-G_qbhbhzjaQ08BCCh-h1lN)

뭔가 예전 Next.js 템플릿보다 CSS 부분에서 상당한 발전이 있네요.

원래 프로젝트를 진행하면 템플릿 Next.js 앱에서 필요 없는 부분을 지우고 시작하는데요.

이번 글의 핵심은 NextAuth 공부기 때문에 그냥 나 두겠습니다.

---

## Next.js 13 버전의 app 폴더

Next.js가 버전 13으로 넘어가면서 기존 pages 폴더 방식에서 app 폴더 방식으로 넘어갔는데요.

Next.js에서는 App Router라고 합니다.

Remix Framework이나 기타 다른 자바스크립트 메타 프레임워크들이 app 폴더를 많이 쓰거든요.

Next.js도 pages 폴더를 유지시키면서 새로운 기능을 구현하려니까 app 폴더를 이용하기로 했나 봅니다.

그럼 여기서 잠깐, 제가 예전에 쓴 Next.js 13 버전 살펴보기 글을 읽어 보시는 걸 추천드립니다.

링크 --> [Next.js 13 살펴보기 - 폴더 방식 라우팅과 중첩 레이아웃 이해
](https://mycodings.fly.dev/blog/2022-11-14-nextjs-13-first-look-and-layout)

이 글에서 app router 방식에 대해 잘 설명하고 있으니 참고 바랍니다.

---

## app/page.tsx 파일 손보기

Next.js 앱의 시작 포인트가 바로 app/page.tsx 파일인데요.

다음과 같이 간단하게 수정합시다.

```js
export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <h1 className='text-4xl font-semibold'>NextAuth Tutorial</h1>
    </main>
  )
}
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEgRZWBCJW5_w90ojAvd46uk6BpfmY6D5PMpdRElve1inJ0cMCrSE6jz0AP5o5qvrtxKR5pSzOh0fXqVINyLAfa92_9YZmPAQylXHMZFHZNUDoaxSKt_I7FSQoxGxh7Y0Qck9jwEOT9YQzlIwlebR58b8Fth14H1rXJnY6uqc9TgUOD1mPKaAGkrwMQl)

위 그림과 같이 깔끔한 로고가 보이네요.

---

## NextAuth.js 설치하기

NextAuth.js 설치는 간단히 아래와 같이 하면 됩니다.

```bash
➜  next-auth-test git:(main) ✗ npm i next-auth

added 12 packages, and audited 365 packages in 5s

140 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
➜  next-auth-test git:(main) ✗
```

설치가 잘 되었네요.

그럼 NextAuth의 가장 기본이 되는 파일을 작성해야 하는데요.

그 파일이름은 바로 `[...nextauth].js` 파일인데요.

이 파일을 `pages/api/auth` 폴더 밑에 두면 작동됐습니다.

그런데 Next.js가 버전 13으로 오면서 App Router에서는 다음과 같이 해야 합니다.

바로 `app/api/auth/[...nextauth]`폴더 밑에 `route.js` 파일로 작성해야 합니다.

참고로 Next.js 13 버전에서는 파일 이름에 규칙이 있는데요.

NextAuth 같이 API를 이용하려면 아래 그림과 같이 route.js 파일 이름을 사용해야 합니다.

타입스크립트를 사용하면 확장자를 .ts로 하면 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEim6dSGSPvzhQlZl_bOaPI6AJ6Knp7CThbw9G--g3g_E71XMkmc7nXzmJWpEyNK9luqCPRkhO2TZSCcb7pDV9PxqclMyU8jgdUMEaCPhKZA7N8aByReH-slFjy2BcICuqJofDG6369Zusk0irOol8sPcOf1YpzXN-3E9YWgK3Zv711-8KnQu7jAzhgJ)

그리고 위 그림처럼 나중에 GET, POST처럼 대문자로 HTTP 메서드를 실행해야 합니다.

그럼 Next.js 13의 서버사이드 API는 어디에 위치할까요?

바로 app/api 폴더입니다.

이제 app/api/auth/[...nextauth]/route.ts 파일을 만듭시다.

```js
import NextAuth from 'next-auth/next'

const handler = NextAuth({})

export { handler as GET, handler as POST }
```

위와 같이 작성하시면 됩니다.

여기서 잘 보시면 마지막에 export 문법이 이상한데요.

이 문법은 ES6 모듈 export 관련 새로운 문법인데요.

바로 'as' 문구를 이용해서 export 하는 모듈의 이름을 지정할 수 있습니다.

이렇게 해야지, 나중에 GET, POST로 핸들러 함수를 실행시킬 수 있습니다.

왜냐하면 Next.js 13에서는 GET, POST 방식으로 export 하라고 권장하기 때문입니다.

일단 위와 같이 handler 객체를 GET과 POST로 export 하면 원하는 역할에 맞게 GET으로 import 할 수 있고,

아니면 POST 방식으로 import 할 수 있게 됩니다.

```js
import { GET, POST } from './path/to/module'

// Use the imported functions
GET() // Handle GET request
POST() // Handle POST request
```

---

## Credentials 방식 적용하기

NextAuth가 좋은 점이 무엇이냐 하면 여러 로그인 방식을 지원해 주는데요.

구글 아이디나, 링크트인 아이디, 페이스북 아이디 등 여러 가지 방식을 지원해 줍니다.

심지어 카카오나 네이버 아이디도 지원해 줍니다.

그리고 우리가 이번 글에서 알아볼 Credentials 방식도 지원하는데요.

이 방식은 이메일과 패스워드 방식으로 사용자가 직접 DB 부분을 컨트롤할 수 있는 방식입니다.

NextAuth가 지원하는 여러 로그인 방식을 명칭으로는 Provider라고 하는데요.

일단 NextAuth 정식 홈페이지에서 Credentials Provider 부분을 가져와서 코드에 입히겠습니다.

```js
import NextAuth from 'next-auth/next'
import CredentialsProvider from 'next-auth/providers/credentials'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: 'Credentials',
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        const user = { id: '1', name: 'J Smith', email: 'jsmith@example.com' }

        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
    }),
  ],
})

export { handler as GET, handler as POST }
```

providers 항목에 여러 가지를 넣을 수 있는데요.

위 코드에서는 CredentialsProvider를 넣었습니다.

CredentialsProvider는 몇 가지 항목으로 이루어진 객체인데요.

먼저, name 부분이 있고, 두 번째 credentials 부분이 있습니다.

이 credentials 부분이 바로 로그인 폼(form)의 내용입니다.

마지막으로 authorize라는 async 함수인데요.

이 authorize 함수에서 이메일과 패스워드 부분을 체크해서, 맞으면 user 객체를 리턴하고 틀리면 null을 리턴하는 구조입니다.

이제 실행해 볼까요?

NextAuth가 좋은 점이 여기까지 작성해도 기본적으로 login 폼을 지원해 줍니다.

주소를 '/api/auth/signin'으로 이동해 보십시오.

*(실제 앱을 작성할 때는 signin 함수를 호출해서 로그인 폼을 불러오는 방식을 씁니다.)*

![](https://blogger.googleusercontent.com/img/a/AVvXsEikMjqMHtiqzqqc7CihSmjNPMAsJ34SPh-ycgvoXYxUacy8_18rzqtB78Qr6rGHjmH9uBM6yyfWnkkk1r6oIrM855vAlO2gFBhwP05UPttKJao3jw13GZF2o1EeLtl6royIeECysuxfcQhBOwMpGnxOAmpQvy3tp4SbgAJkR0I6D4q9WGmdvblyCb-7)

위 그림과 같이 NextAuth가 제공해 주는 기본 로그인 폼(form)이 보입니다.

여기서 기본 제공되는 로그인 폼(form)의 글자를 바꿔 볼까요?

아까 CredentialsProvider 중에서 credentials 항목을 아래와 같이 한글로 바꿔 보겠습니다.

```js
credentials: {
        username: {
          label: "이메일",
          type: "text",
          placeholder: "이메일 주소 입력 요망",
        },
        password: { label: "비밀번호", type: "password" },
      },
```

이제 브라우저를 새로고침 해 보면 아래와 같이 바뀐 걸 볼 수 있을 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjp4n8IN6e7W_Tsxfe0aMtfSWsyfevn7IsRxfD2sd7JMiWrIehgCWdIUbpCatqILq8cEf16MxVL0f1vCv4xkrOtwSel2TjIUHVCYQeWetRSfpZPY_jiCSoaiesmfUrWR0HHNYiB3KSuYqiZM5mcvkDd_7thEwEulz3doPxQpDoPN9auyIDdILkdMO5b)

여기서 Sign in 버튼을 눌러보면 다시 첫 페이지로 돌아가게 되거나 혹은

`~/api/auth/callback/credentials` 같은 이상한 주소로 이동하게 되는데요.

callback/credentials 주소로 돌아가는 이유는 개발서버로 돌리는 포트와 NEXTAUTH_URL 포트가 틀려서 그런 겁니다.

.env 파일에 NEXTAUTH_URL 부분을 지정해서 주면 됩니다.

참고로 아래 그림처럼 개발서버 돌릴 때 SECRET 경고가 나오는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhF8efoViAj0RvVaNbqtyGEELqIpEeu4v6_qLU5KlzluBWOzZTOUk7zO-GX2CvbHC1Bd63Q92CHl9VFtI8-W1OM0KehvVy_FQgRIA0DaNe9eRSrliPUHckoJiQfRVuFVpLB7IK2DtRA3H2cOFwzIrTVsIOHJAusadhJn8WxSqgSE1YF8jebf43SLZGZ)

이 문제를 해결하려면 .env 파일에 아래와 같이 SECRET 부분을 아무 글자나 넣어주면 됩니다.

결론적으로 아래와 같이 2개의 NEXTAUTH 관련 상수를 정의하면 됩니다.

```js
NEXTAUTH_SECRET=qerkasjhfkauiqeywrhkasjhfksajfh
NEXTAUTH_URL=http://localhost:3001
```

---

## authorize 함수 확장하기

CredentialsProvider에서 로그인할 때 authorize 함수가 작동된다는 걸 눈치채셨는데요.

이 부분은 여러분께서 직접 로직을 작성해야 합니다.

아까 예제로 가지고 왔던 로직은 더미(dummy) 코드인데요.

실제 authorize 함수 안에서는 DB 부분에서 username을 찾고 비밀번호가 맞는지 체크해서 맞으면 해당 username의 정보를 리턴하는 로직으로 수행됩니다.

이걸 위해서는 DB 제어 로직도 있어야 하고 비밀번호 hash하는 로직도 있어야 하고, 넣어야 할 게 많은데요.

다음 시간에, DB 제어 부분 관련 Prisma를 이용해서 알아보겠습니다.

끝.

