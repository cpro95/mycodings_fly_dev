---
slug: 2023-06-07-how-to-nextjs-nextauth-custom-login-page
title: NextAuth 사용법 5편 - 나만의 커스텀 로그인 페이지 만들기
date: 2023-06-07 10:13:30.823000+00:00
summary: NextAuth 사용법 5편 - 나만의 커스텀 로그인 페이지 만들기
tags: ["next.js", "nextauth", "custom login page", "login", "signin"]
contributors: []
draft: false
---

안녕하세요?

며칠 만에 다시 NextAuth 사용법으로 인사드립니다.

이번 시간에는 NextAuth 패키지가 제공하는 못생긴 로그인 페이지 말고, 나만의 멋진 Login Page를 만들려고 하는데요.

NextAuth에서는 커스텀 로그인 페이지를 만들 수 있게 API를 제공해 줍니다.

NextAuth에서 제공해 주는 Pages 란게 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjsmwt4guXL6ugAGJtmSo7297xw_8doBpPnyyaxSeNN0fJjpHwxtHX_8SwoBy3DuRA3R4kdi6DXuR6B7q8ALje3IQnCkk0ana0g8pl4rQD3U6PYp2kMlEtkthH01Kwp2Wt0TqfWEVTe22i2BG49gSdm2YsiMsrnaZaaKr0w-wAOaMq0Q8ETeQSll1Mq)

위 그림처럼 여러 가지가 있는데요.

여기서는 signIn 항목을 사용해 보겠습니다.

그럼, 세팅을 위해 '[...nextauth]/route.ts' 파일을 열고 아래와 같이 코드를 작성합니다.

```js
//app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: {
          label: "이메일",
          type: "text",
          placeholder: "이메일 주소 입력 요망",
        },
        password: { label: "비밀번호", type: "password" },
      },

      async authorize(credentials, req) {
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: credentials?.username,
            password: credentials?.password,
          }),
        });
        const user = await res.json();
        console.log(user);

        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },

    async session({ session, token }) {
      session.user = token as any;
      return session;
    },
  },

// 여기가 추가된 부분
  pages: {
    signIn: "/signin",
  },
// 여기가 추가된 부분

});

export { handler as GET, handler as POST };

```

추가된 부분만 넣으면 됩니다.

이 코드는 NextAuth가 signIn Page로 '/signin' 이란 경로를 사용하라고 알려주는 겁니다.

이렇게 되면 기본으로 제공하는 NextAuth 로그인 페이지가 아니라 본인이 직접 만든 로그인 페이지로 이동할 수 있는 거죠.

그럼, 로그인 페이지를 멋지게 만들어 봅시다.

로그인 페이지의 경로가 '/signin'이니까 app 폴더 밑에 signin 폴더를 만들고 그 밑에 page.tsx 파일을 만들어야겠죠.

Next.js 13 버전의 폴더 라우팅이 조금 귀찮아졌습니다.

Remix Framework에서는 위 경로로 파일을 만들 경우 간단하게 app 폴더 밑의 routes 폴더에서 간단하게 signin.tsx 파일만 만들어도 되거든요.

실제 Next.js 12에서도 pages 폴더 밑에 signin.tsx 파일만 만들어도 됐는데, 조금은 복잡해졌습니다.

```js
//app/signin/page.tsx

'use client'
import React, { useRef } from 'react'
import { signIn } from 'next-auth/react'

function Login() {
  const emailRef = useRef(null)
  const passwordRef = useRef(null)

  const handleSubmit = async () => {
    console.log(emailRef.current)
    console.log(passwordRef.current)
  }

  return (
    <main className='flex min-h-screen flex-col items-center space-y-10 p-24'>
      <h1 className='text-4xl font-semibold'>Login</h1>
      <div>
        <div>
          <label
            htmlFor='email'
            className='block text-sm text-gray-800 dark:text-gray-200'
          >
            Email
          </label>

          <div className='mt-1'>
            <input
              ref={emailRef}
              onChange={(e: any) => {
                emailRef.current = e.target.value
              }}
              id='email'
              name='email'
              type='email'
              required
              autoFocus={true}
              className='mt-2 block w-full rounded-md border bg-white px-4 py-2 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-blue-300'
            />
          </div>
        </div>

        <div className='mt-4'>
          <label
            htmlFor='password'
            className='block text-sm text-gray-800 dark:text-gray-200'
          >
            Password
          </label>
          <div className='mt-1'>
            <input
              type='password'
              id='password'
              name='password'
              ref={passwordRef}
              onChange={(e: any) => (passwordRef.current = e.target.value)}
              className='mt-2 block w-full rounded-md border bg-white px-4 py-2 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-blue-300'
            />
          </div>
        </div>

        <div className='mt-6'>
          <button
            onClick={handleSubmit}
            className='w-full transform rounded-md bg-gray-700 px-4 py-2 tracking-wide text-white transition-colors duration-200 hover:bg-gray-600 focus:bg-gray-600 focus:outline-none'
          >
            Log In
          </button>
        </div>
      </div>
    </main>
  )
}

export default Login
```

코드는 UI 부분이고 input 엘리먼트에 useRef를 이용해서 사용자가 입력하는 email과 password를 관리하도록 했습니다.

가장 일반적인 React 로그인 로직인 거죠.

참고로 useRef는 클라이언트 사이드 훅이기 때문에 맨 첫 줄에 'use client' 빼먹으면 안 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjcRIbvZYzkI3tS9zPD7Xi9gJDSIiQS5uAbegT4zC7epO7Vv5Uv-UhrT4eNS4PbcayIh0_c_Djlwuf_8B2OM_P3p4MRpluvfpwkD3MA3euQgNn12E-yaxgQT0E5Xy0bQT1B9RO2XXvGGWl5qETQIuf2pPDl5N8BEBj7ynwqOz0bKCpxK8_9Sp2SNhvB)

실행 결과 위와 같이 나오는데요.

제대로 되는지 한번 테스트해볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEhtzbicsFr632l8MgzrF1jLPrqf0R6pFw8b9AC89lGvLm8sjGfJ0hHViRb0fZRoirmGeMqBB4iZ-lquY1wIhlHWujN4dwcAyuJXtRZUgF4Kakb4tYQoFadBsgX9yBT43qIihTnUN9Eo167F2qYheLVoqOY7gvc_89kmopUvoaytrtKeKG01JnaRYfMf)

일단 UI 로직은 제대로 작동됩니다.

---

## NextAuth signIn() 함수의 비밀

NextAuth의 signIn() 함수는 함수 인자를 받을 수 있는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEg9Snv-JhybrTeL6hm6aLRXLY0Uhv7EbCM1NQz7zxWyAn-mUBITWZE64xs_bAlN_e86JsEkwE_6m6cXo06NnnhT9ZVyoAb_r4NOIn8MDSB-cuNkkX0onaS7SNDJLp0UPGI9JIevs-eYg5fh_kfQt7aio_4zgDJqw0avo5PJzWFUqvBfG7GyRhMRXSC6)

위 그림처럼 Provider를 넣을 수 있습니다.

우리는 지금 email과 password를 이용한 credentials 방식을 사용하기 때문에 위와 같이 credentials을 넣고 username과 password 등 각각의 항목을 넣으면 됩니다.

그리고 로그인 성공 시 redirect 부분과 callbackUrl을 넣는 부분이 있는데 redirect를 true로 하면 로그인 성공 시 callbackUrl로 이동하게 됩니다.

이제 코드를 수정해 볼까요?

```js
//app/signin/page.tsx

'use client'
import React, { useRef } from 'react'
import { signIn } from 'next-auth/react'

function Login() {
  const emailRef = useRef(null)
  const passwordRef = useRef(null)

// 수정된 부분
  const handleSubmit = async () => {
    // console.log(emailRef.current)
    // console.log(passwordRef.current)

    const result = await signIn("credentials", {
      username: emailRef.current,
      password: passwordRef.current,
      redirect: true,
      callbackUrl: "/",
    });
  }
// 수정된 부분

// 이하 같은 코드입니다.
  return (
    <main className='flex min-h-screen flex-col items-center space-y-10 p-24'>
      ...
      ...
      ...
    </main>
  )
}

export default Login
```

이제 우리가 로그인 페이지에서 로그인 버튼을 누르면 handleSubmit 함수를 통해 직접 signIn 함수가 작동되게 됩니다.

테스트해 보시면 정상적으로 작동되는 걸 볼 수 있을겁니다.

그럼.
