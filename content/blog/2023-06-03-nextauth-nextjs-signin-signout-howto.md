---
slug: 2023-06-03-nextauth-nextjs-signin-signout-howto
title: NextAuth 사용법 3편 - Login, Logout 구현하기
date: 2023-06-03 02:07:16.646000+00:00
summary: NextAuth 사용법 3편 - Login, Logout 구현하기
tags: ["nextauth", "next.js", "login", "logout", "signin", "signout"]
contributors: []
draft: false
---

안녕하세요?

NextAuth 사용법 3번째 시간입니다.

지난 시간에는 Prisma 세팅을 끝냈었죠?

이번에는 본격적인 풀 스택 로그인에 대해 알아보겠습니다.

---

## Next.js API 로직 만들기

우리가 만드는 Next.js 앱에서 내부 API 호출을 이용하려면 Next.js에서 제공하는 API 기능을 이용하면 됩니다.

app/api 폴더 밑에 우리가 원하는 API를 만들 수 있습니다.

로그인하기 위해서는 사용자가 DB에 있어야 하니까 먼저 가입하기(SignUp) 로직을 만들어 보도록 하겠습니다.

app/api 폴더 밑에 user 폴더를 만들고, 그 밑에 route.ts 파일을 만듭시다.

Next.js 13 버전의 규칙상 API 파일은 route.js 이름이어야 합니다.

결론적으로 "https://localhost:3000/api/user" 이 주소가 바로 우리가 만들려고 하는 가입하기(SignUp) API 주소가 됩니다.

이제 코드를 볼까요?

```js
//app/api/user/route.ts

import prisma from '@/app/lib/prisma'

interface RequestBody {
  name: string;
  email: string;
  password: string;
}

export async function POST(request: Request) {
  const body: RequestBody = await request.json()

  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      password: body.password,
    },
  })

  const { password, ...result } = user
  return new Response(JSON.stringify(result))
}
```

POST method를 사용하는 전형적인 API인데요.

prisma를 예전 시간에 만든 lib/prisma 객체에서 가져오고 있습니다.

우리가 POST 방식으로 받으려는 건 바로 body 부분인데요.

request.json() 형식으로 body 부분을 추출할 수 있습니다.

그러고 prisma.user.create 명령어로 prisma를 이용해서 DB에 User 테이블에 데이터를 넣습니다.

prisma.user.create는 성공하면 방금 만들었던 객체를 반환하는데요.

그걸 user에 저장했습니다. 그러고 나서 user 객체에서 password 부분을 제외하고 나머지 부분만 최종적으로 Response 해주는 로직인데요.

여기서 우리가 하면 안 되는 게 있습니다.

바로 password를 그냥 그대로 저장했는데요.

사용자의 password를 그냥 저장하는 거는 상당히 위험합니다.

그래서 사용하는 방식이 해시를 이용해서 암호화하는 건데요.

자바스크립트에서는 bcrypt 패키지가 가장 많이 쓰입니다.

```bash
npm install bcrypt
```

이제 코드를 다시 바꿔 볼까요?

```js
//app/api/user/route.ts

import prisma from '@/app/lib/prisma'
import * as bcrypt from 'bcrypt' // 바뀐 부분

interface RequestBody {
  name: string;
  email: string;
  password: string;
}

export async function POST(request: Request) {
  const body: RequestBody = await request.json()

  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      password: await bcrypt.hash(body.password, 10), // 바뀐 부분
    },
  })

  const { password, ...result } = user
  return new Response(JSON.stringify(result))
}
```

prisma를 이용해서 password를 저장할 때 bcrypt.hash를 이용해서 password를 암호화해서 저장했습니다.

이제 이 API를 테스트해 볼까요?

개발 서버(npm run dev)는 계속 돌리고 있다고 가정하고, POSTMAN이나 Insomnia 같은 API 테스트 툴을 열어서 테스트해 보겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgWso5l25bYANeQ8-3Km0zMndiIJKxTSTJasXqIDjCucnWClCikZM880AfKvZTZOSiX38yMLUiWr-m3I3Dk34aXGpw02UMvfeCum9KagRJZmieolv90nx8aKpbahZqz445UYuYlvyJBH7YsxXautQ_P97M_wstGEr977r3jBZ2FZFfYmTgT3dh73cAK)

위와 같이 Insomnia에서 POST 방식으로 가입 로직을 실행시켰습니다.

당연히 API 주소는 'http://localhost:3000/api/user'입니다.

JSON 형태로 DB 저장에 필요한 name, email, password를 전달했습니다.

성공하면 그림의 오른쪽처럼 password를 제외한 user 정보가 리턴됩니다.

잘 작동하고 있네요.

그럼 Prisma DB에는 어떻게 저장되었을까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEgxQEC5LS7Cc0xLGAbEf_6jY0zVpkCRbIyclJmgVdv21tYiBsmMOZNqlivgbxipFosc9iTHqpFGZZ7SHiX8VJ4kFk1jL58OYglQq0y8esqjHg3o2URNcW0eFRif5omNZLvrXrlxMuQpLwRvEyhuKNiAOKteLBYWjI9dVdiVHkj-sfsNB4Iidrz4fHxG)

위 그림과 같이 password가 이상한 문자열로 해쉬 된 상태로 잘 저장되었네요.

가입하기(SignUp) 로직은 성공입니다.

---

## 로그인(LogIn, SignIn) 로직 만들기

가입하기 API를 만들었으니까 로그인 로직도 만들어 보겠습니다.

app/api 폴더 밑에 login 폴더를 만들고 그 밑에는 당연히 route.ts 파일을 만듭시다.

로그인은 영어로 LogIn이라고 쓸 수 도 있습니다.

근데 NextAuth에서는 SignIn이라고 부르고 있고요.

로그아웃을 SignOut이라고 부르고 있습니다.

```js
//app/api/login/route.ts

import prisma from '@/app/lib/prisma'
import * as bcrypt from 'bcrypt'

interface RequestBody {
  username: string;
  password: string;
}

export async function POST(request: Request) {
  const body: RequestBody = await request.json()

  const user = await prisma.user.findFirst({
    where: {
      email: body.username,
    },
  })

  if (user && (await bcrypt.compare(body.password, user.password))) {
    const { password, ...userWithoutPass } = user
    return new Response(JSON.stringify(userWithoutPass))
  } else return new Response(JSON.stringify(null))
}
```

로그인 로직도 POST method를 사용합니다.

로그인 로직은 HTML의 Form에서 username부분과 password 부분을 불러와 그걸 DB에 있는 username과 password와 비교해서,

맞으면 user 정보를 리턴하고 틀리면 'null'을 리턴하는 로직입니다.

Prisma 부분에서는 findFirst 명령어를 사용했습니다.

where 부분에 email을 넣으면 해당 이메일에 해당하는 user 정보 중 첫 번째를 찾게 되는데요.

그러고 user에서 찾아온 password를 HTML 폼에서 넣은 password를 비교하는 로직은 bcrypt.compare 명령어를 사용했습니다.

이러면 절대 사용자의 password를 알아볼 필요 없이 password가 맞는지 틀렸는지 알 수 있습니다.

마지막으로 마찬가지로 password 부분만 제외하고 나머지 user 부분만 돌려주고 있습니다.

이제 테스트해 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEhFil6gj759CA4DEfUHf268BNw19Ij5xL4b-IqBmAnLgKYw8Fxms6lV_dhkbOHtT82HhfSDP4_mbNVkPPwMzUAQIQcJDx33d_YeBA4ig-05sSw1evLPsEVhw-Wv5Il6NvC-SF3LXFk57E_xFg9An8pxLHY3RlLFCPZPQovNetyOeTZJEF3WVW40fUiA)

위 그림처럼 username과 password를 제대로 입력하면 로그인이 성공하고 있고,

![](https://blogger.googleusercontent.com/img/a/AVvXsEiQzw-n9JYqGcWsGUM03ntP4Myg4hhePG0FdQD25OejYRpB_SMMfqGbvSy6RoxLUorMB_UybmvtNHAvJpaUq6moT-cCG2hOW8L21CHn-FmD07o8Gto6KgXYkxn1gQ3tBecQrSBIdQlK_zye1Mx9rh4GXOGQzCkqfIaSYLWyGr738Y4BBzJb94aoGEBG)

위 그림처럼 password를 틀리게 입력하면 'null'이 리턴되고 있습니다.

우리가 만든 로그인 로직이 아주 잘 작동하고 있네요.

---

## 로그인 API를 NextAuth에 적용하기

이제 우리가 만든 로그인 API 로직을 NextAuth에 적용해야 하는데요.

app/api/auth/[...nextauth]/route.ts 파일을 다시 열어서 아래와 같이 만듭시다.

```js
//app/api/auth/[...nextauth]/route.ts

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
        username: {
          label: '이메일',
          type: 'text',
          placeholder: '이메일 주소 입력 요망',
        },
        password: { label: '비밀번호', type: 'password' },
      },

      async authorize(credentials, req) {
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: credentials?.username,
            password: credentials?.password,
          }),
        })
        const user = await res.json()
        console.log(user)

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

우리가 눈여겨봐야 할 부분은 authorize 함수인데요.

이 함수에서는 아까 만들었던 로그인 API를 fetch를 실행합니다.

그리고 실행 결과를 user 객체로 저장하고 그걸 리턴하는데요.

NextAuth는 여기서 'null'이 아닌 걸 리턴하게 되면 로그인이 되었다고 보는 겁니다.

그럼 실제로 Next.js 앱에서 로그인을 수행해 볼까요?

여기서 필요한 게 바로 로그인 버튼인데요.

한번 만들어 볼까요?

app/components 폴더를 만들고 그 밑에 SignInButton.tsx 파일을 만듭시다.

만드는 김에 로그아웃 버튼도 옆에다 만들어 보겠습니다.

```js
//app/components/SignInButton.tsx

'use client'
import { signIn, signOut } from 'next-auth/react'
import React from 'react'

function SignInButton() {
  return (
    <div className='space-x-10'>
      <button
        className='rounded-xl border bg-yellow-300 px-12 py-4'
        onClick={() => signIn()}
      >
        LogIn
      </button>
      <button
        className='rounded-xl border bg-red-300 px-12 py-4'
        onClick={() => signOut()}
      >
        Log Out
      </button>
    </div>
  )
}

export default SignInButton
```

첫 번째 줄부터 이상하죠.

왜냐하면, NextAuth는 Client 사이드 로직이라 별도 컴포넌트를 만들고 그 컴포넌트에는 'use client'라고 명시해야 합니다.

바로 Next.js 13 버전의 특징인 컴포넌트 전체가 서버 사이드 컴포넌트라는 거죠.

이제 이걸 app/page.tsx 파일에 넣어 보도록 하겠습니다.

```js
//app/page.tsx

import SignInButton from "./components/SignInButton";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-semibold">NextAuth Tutorial</h1>
      <SignInButton />
    </main>
  );
}
```

실행 결과를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEgtAdNZQIDPSY2KH65uWG9rOdrHnm2i_9U4x8TPh9cLJUtbbCw5FYGuo65VxvH3emmEwIHwqgnKb4jDb8wT3yaP1zWTF8kNKTY6lTulXD6ToNW1bi6Eyl8yz8N2UCA_5Y-JoZYE-NDDcor7nQEmXA1IOzoeipyYV1ah40ph8q5xklVKtoUDgkLiRPai)

로그인 버튼과 로그아웃 버튼이 나란히 잘 보이네요.

NextAuth에서는 signIn 버튼과 signOut 함수를 제공해 주는데요.

signIn 함수를 호출하면 [...nextauth]/route.ts 파일에 있는 authorize 함수가 작동하게 됩니다.

signOut 함수는 단순하게 로그아웃시키는 함수고요.

버튼을 클릭해 볼까요?

그럼 NextAuth가 제공해 주는 Login Form이 나오고 로그인 로직이 성공하면 다시 원래 클릭했던 페이지로 돌아옵니다.

그럼, 로그인이 성공했는지 안 성공했는지 알 수 있는 방법이 없나요?

NextAuth에서는 그걸 세션(session)이란 방식으로 제공해 줍니다.

session은 브라우저의 쿠키에 저장되는데요.

NextAuth 자체가 클라이언트 사이드 세션인 겁니다.

---

## Next.js 앱 전체에 NextAuth 세션 적용하기

초장기 React 공부할 때 배운 HighOrder Componet라는 걸 여기서 쓸 건데요.

NextAuth에서는 그걸 SessionProvider라고 합니다.

이제 이걸 app/layout.tsx 파일에 적용해 볼까요?

먼저, app/components 폴더에 Providers.tsx 파일을 만듭시다.

```js
//app/components/Providers.tsx

"use client";

import { SessionProvider } from "next-auth/react";
import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}
function Providers({ children }: Props) {
  return <SessionProvider>{children}</SessionProvider>;
}

export default Providers;
```

그러고 이걸 다시 layout.tsx 파일에 적용해 봅시다.

```js
//app/layout.tsx

import Providers from "./components/Providers";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

이제 NextAuth의 SessionProvider를 쓸 준비가 되었습니다.

---

## SignIn 버튼 바꾸기

로그인이 되었다면 로그인 버튼 말고 로그아웃 버튼이 보여야 하고,

로그아웃된 상태면 로그인 버튼이 보여야 하는 게 정상이잖아요.

이걸 구현해 보겠습니다.

```js
//app/components/SignInButton.tsx

"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";

function SignInButton() {
  const { data: session } = useSession();

  if (session && session.user) {
    return (
      <button
        className="px-12 py-4 border rounded-xl bg-red-300"
        onClick={() => signOut()}
      >
        {session.user.name}님 Log Out
      </button>
    );
  }

  return (
    <button
      className="px-12 py-4 border rounded-xl bg-yellow-300"
      onClick={() => signIn()}
    >
      LogIn
    </button>
  );
}

export default SignInButton;
```

NextAuth는 클라이언트에서 사용할 수 있는 useSession 훅을 제공해 줍니다.

useSession훅은 data 값을 리턴해주는데요.

잠깐, 우리는 `{data: session}`이라고 적으면 ES6 문법에 의해 그 이름을 session이라고 바꿀 수 있습니다.

그러고 session이 있을 때는 로그아웃 버튼을 보여주고,

session이 없을 때는 로그인 버튼을 불러주게끔 UI 로직을 변경했습니다.

결과를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEj96HHJIg78vQ6FyMneH6ys41MUnSatmcC8eX7xTYr3rphBldRkZLUu2mzDICjo_DEPiJrNjtN1bbIsvJ6FBk4h3vfAvXNuawMOvk-ghDaLOVnC_04n02KwT6VEJVZb-crHGcQ9lMjCbk8u11dTZ1a6agqSYQuM2orhNGBO9NkeeD-BYUGHhHiZ0jdi)

![](https://blogger.googleusercontent.com/img/a/AVvXsEhgqWYVuISOW-hGNk4ofd_yzCrNKOB5L3VNtQi50o_jpOrptTfUEBy6Wnu7ohO67PNECM6Ds_7jPoMf08Va9NNdvaaXCuevLDcNul8bk9y0KUJLzYNM-cO1OXupXf-Q6O-uip_3CkxcRCeHGCJis9Hl4tL-ofTvPfuGBifbdFK3vKpAv-ZCwJR8IS6Q)

위 그림과 같이 실제 로그인, 로그아웃해 보면 조금은 화면 전환이 느리면서 로그인, 로그아웃 버튼이 번갈아 보일 겁니다.

---

지금까지 NextAuth를 이용해서 3편에 걸쳐 유저네임과 패스워드로 로그인하는 방법에 대해 알아봤는데요.

정말 간단하게 구현할 수 있어 좋았습니다.

그래서 NextAuth가 가장 유명한 게 아닐까요?

그럼.

