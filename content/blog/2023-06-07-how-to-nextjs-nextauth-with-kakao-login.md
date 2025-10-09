---
slug: 2023-06-07-how-to-nextjs-nextauth-with-kakao-login
title: NextAuth 사용법 6편 - NextAuth로 카카오 아이디 로그인 만들기
date: 2023-06-07 13:48:48.563000+00:00
summary: NextAuth 사용법 6편 - NextAuth로 카카오 아이디 로그인 만들기
tags: ["kakao", "login", "next.js", "nextauth"]
contributors: []
draft: false
---

안녕하세요?

NextAuth 강좌 6편인데요.

오늘은 카카오 아이디로 로그인하는 코드를 실전 테스트해 볼 예정입니다.

요즘 같은 SNS 시대에는 소셜 아이디로 로그인하는게 필수인데요.

먼저, 카카오톡 로그인을 이용한 즉, 카카오 아이디를 이용한 로그인을 구현해 보겠습니다.

예전에 티스토리에도 작성한 적이 있는데요.

그때는 NextAuth 버전 3이었고, 지금은 버전 4입니다.

버전 4 초창기 때만 해도 KakaoProviders가 제대로 작동되지 않아 티스토리 블로그에는 NextAuth 버전 3을 이용해서 작성했던 기억이 있네요.

오늘 사용한 버전은 아래와 같습니다.

```js
    "next": "^13.4.5-canary.4",
    "next-auth": "^4.22.1",
```

next.js 버전은 13.4.4 버전도 가능합니다.

---

## 카카오 아이디로 로그인하기 위한 카카오 디벨로퍼에 앱 등록하기

카카오 서비스를 이용하려면 [카카오 디벨로퍼](https://developers.kakao.com/)에 가입해야 하는데요.

일단 여기서 애플리케이션 추가하기를 합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjxJtaGnYQ5VCo0eyV1y6u1swmGpB7scfKN_fZxtDwzECyOPsrfmUOG4pky1TDMk4XdSObZ3Ut4aDBTB9oZnTNlthjziKASnLXj3gP8rDGchRAhyeESKo1nJgGex3yiMPny8CtO1iu25bIT66gykKb_rYoXfsKBUE43dqrJGnwjo_fynLKpiM4S902D=w640-h577)

위 그림과 같이 간단하게 작성하면 됩니다.

그러면 아래와 같이 앱 키가 나오고 기본 정보가 나오는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEimnjkd4Ty_-Mxc7V5QfH6vascSVSIJCAfBlph2o5faJISbWgl2f9rqJOyLSxizTcJy8D4t6WkUpDsSJaHsdLthhE-C6BlZgBrx7G7gX76dEuswNZQipwyaZZNvOxUM6PCTx4eW7V65PZiZ9Y6HU1tifiaT3As3eZTO4rnQueUU44JRJSOVxkiGXGYS=w429-h640)

위 그림처럼 우리가 중요하게 볼게 앱 키입니다.

제가 기본 정보에 있는 앱 ID에도 동그라미를 쳐놨네요.

나중에 설명드리겠습니다.

그리고 애플리케이션 설정에서 아래와 같이 Redirect URI 등록과 사이트 도메인 등록을 해야 합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjLfKTo4W6hugn6mZL84C18dWknFZ0oTLMlDhgNRA8vT0WgbVEHdY1s1WTHGe-ZYso5Fv4EUeK4gcjv_gDrsVAdDwRXhTTVy7LsqK87unld4mMhAJnnIiKCAxRbw7bF_5HFG7QVanN8vjj6OeGQfwmU4TT9CUn0dg1g5PDtilT2RTwi0DCNtmifsxqU=w640-h483)

위와 같이 NextAuth의 기본 Redirect URI를 정확하게 입력해야 합니다.

중용한 점은 꼭 위와 같이 입력해야 합니다.

그리고 사이트 도메인은 아래와 같이 등록하면 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEh7DhpVt67ZcYV6VHeXdMn3HGPPxkXDD1rA-ytEpmwtdZuerI_vklMLMLRF-cUgMecnpf3IzuLwJj764SklwEsddVVlHFQDH4cTtCfjlaw0inoHzB6Ysac8L9Pm___6vrMT0ThJ7rP7rR9v2u9_LeTSwFBVfwJGo1-xfT6ZZoS_T9LHM-us2p028kZO=w600-h640)

![](https://blogger.googleusercontent.com/img/a/AVvXsEjgwUQ2kxR4dHuuI_GaPk_56HL5igVQ3E74AW8a4XOU7W7NL4de7ownPBKMtBx1WX4n211M6eQz13i8oVUwIDiJGNVx_ZaCugJ-HwhqPqQjKPzfPOrlPSpQlaQab9lY74phfLky82efshVkSkFmFQLcYtKdMjXWzeycPe5-mdZq7qH0woLC1CdBrV_b=w640-h124)

나중에 정식 서비스하실 때 사이트 도메인을 바꾸시면 됩니다.

마지막으로, 카카오 로그인을 하면 카카오 사용자 계정에서 가져올게 많은데요.

개발을 위해서 닉네임만 가져오도록 하겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEj-77kkujv-KPyAFkvXUlntFKD8F_w_sfkg4CYuFa8bD5Naphy9ljM_MyhJBitPEuvsmK-irgfv4h31TxES8gvft-ZzqrYq2m0Xhfsjv4n7lfdpRGbQiGZnzkMeWw6W7_cB_Lgl3kng8QLvq7HKpEMyfMAuGHfibM3yHMS98TT_LnjcLSZ5_RJTP0QF=w640-h358)

위 그림과 동의항목을 클릭한 다음 닉네임쪽에 설정을 누르면 아래와 같이 나오는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEifpnEse1AUpH-0PStTtUr1OAsBWIN-S53ilkOcWXp1PKz3ROCYzCrEO1qEz6xRMYqDegApjThPZdKEKj_FMjyXUfJOYzR9Y8jkxAcDzrRmJNuKYSazsLhfh91cXFHj7GFVAeB2spdTGdhDdq6DyEQvnU9oD5jSmJa8Ffvmv5Y7c06xAMpSJn_-4rLk=w504-h640)

저는 프로필 사진도 선택했습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEh2DDbMsB0fwEMrePQH-9tsqrDmUcHHk1k_F5I1mv6Ys8jwAexohvPW2bCvOULUGh5nYGrkjlkmTZuS7WY1PvNd1bAHnCSut2WYy_W932Qx4A4jNADrsDsnw66lf5H00h1lbPnmSqVZA4I-173dXf3HOcEFLtC8DLB3oSRpt8LeH7B3YHfjreqn8WAe=w640-h114)

이렇게 하면 최종적으로 카카오 로그인하면 사용자한테 동의화면을 띄워줍니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgMhzrkFcDGIG7SLB57VNh-5XJmCPs9GW9aaej4Pg2GiMqF1fGi-XaeJW5vnmfpJotISKPII0Wz6ZpxfByi2qgjfAprNGNf9FO7urhDhXWE4_AQn6R1YHFs5QzfRri5L__9mTodcoCy38mLf6mokZMAAuy6iLZg5wvzQgUETyfBYrJxZBLR2LScpsdK=w456-h640)

위 사진 보시면 프로필 사진과 닉네임을 동의한다는 내용이 나옵니다.

이제 카카오 아이디로 로그인하기 위한 사전 준비가 끝난 거 같네요.

---

NextAuth의 카카오 로그인 코드는 아래와 같이 진짜 간단합니다.

```js
import KakaoProvider from "next-auth/providers/kakao";
...
providers: [
  KakaoProvider({
    clientId: process.env.KAKAO_CLIENT_ID,
    clientSecret: process.env.KAKAO_CLIENT_SECRET
  })
]
...
```

우리가 필요한 게 KAKAO_CLIENT_ID 와 KAKAO_CLIENT_SECRET 네요.

클라이언트 아이다와 클라이언트 시크리트에서 제가 한참 고생한 적이 있는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEimnjkd4Ty_-Mxc7V5QfH6vascSVSIJCAfBlph2o5faJISbWgl2f9rqJOyLSxizTcJy8D4t6WkUpDsSJaHsdLthhE-C6BlZgBrx7G7gX76dEuswNZQipwyaZZNvOxUM6PCTx4eW7V65PZiZ9Y6HU1tifiaT3As3eZTO4rnQueUU44JRJSOVxkiGXGYS=w429-h640)

위 그림을 보시면 앱 키 부분의 Javascript 키 부분이 클라이언트 시크리트 같고, 기본 정보에 있는 앱 ID 가 클라이언트 ID 같아 보이시죠?

저도 이렇게 생각해서 한참을 고생했습니다.

그런데 아닙니다.

위 그림의 Javascript 키가 바로 클라이언트 키입니다.

그리고 클라이언트 시크리트는 본인만의 어려운 이상한 문자열을 적어 넣으면 됩니다.

그래서 제 .env 파일을 보시면,

```bash
NEXTAUTH_SECRET=qerkasjhfkauiqeywrhkasjhfksajfh
NEXTAUTH_URL=http://localhost:3000
SECRET_KEY=dkasdhfjahsdfjhskdfhaksdhfakjs
KAKAO_CLIENT_ID=700~~~~~~~~~~~~~~~~~~~~~~~~~~
KAKAO_CLIENT_SECRET=dkasdhfjahsdfjhskdfhaksdhfakjsdddddssaa

# This was inserted by `prisma init`:
# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

DATABASE_URL="file:./dev.db"
```

이제 준비가 끝났습니다.

---

## '[...nextauth]/route.ts' 파일에 카카오 Provider 추가하기

소제목 그대로입니다.

다음과 같이 코드를 변경하시면 됩니다.

```js
//app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import KakaoProvider from "next-auth/providers/kakao";

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
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
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

  // 이 부분은 잠시만 주석처리 하겠습니다.
  // 강의 마지막 부분에 다시 논의하겠습니다.
  // pages: {
  //   signIn: "/signin",
  // },
});

export { handler as GET, handler as POST };
```

NextAuth에 proviers에 넣는 배열에 KakaoProvider를 추가했을 뿐입니다.

그럼 작동되는 걸 볼까요?

로그인 버튼을 누르면 NextAuth에서 제공하는 로그인 폼이 나오는데 마지막에 "Sign in with Kakao" 버튼이 보입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjx_ItSrBtB_Wk1V0__QIfujGI8oSHUd1FaVK75QmKLewcYRqefR5Xjr1k1dw_SDbS1l-LfuzG10m3DnS2CG6ZKB_xR3wyh15ioiATU7NOB4ao1QJ2a-Y88yJtOD1qqowqMak7_jqHXxVX4SMXLuxKH8NAfP3wbGI_EAlSK-7X6gjr4_q8smrbqc62M)

위 그림처럼요.

이제 클릭해 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEirDgQ0yW17G4DEehrNPt78cU1ctGVl0T5x_L9OBzlQHcn5mrZD8iaKAUVAtfAzgsWJHqKglzMhZna6W6RyuMzQCPWh9sKJ3tOj3s3ctj0Nf6d2QDqSMrMGAJBu8MXe5vYp7YYPiBkYDk6V39_t_NRLtNyMN4TGoVq2g9DAzP0vMyN-gt61OTxalCTt)

익숙한 카카오 로그인 화면이 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgMhzrkFcDGIG7SLB57VNh-5XJmCPs9GW9aaej4Pg2GiMqF1fGi-XaeJW5vnmfpJotISKPII0Wz6ZpxfByi2qgjfAprNGNf9FO7urhDhXWE4_AQn6R1YHFs5QzfRri5L__9mTodcoCy38mLf6mokZMAAuy6iLZg5wvzQgUETyfBYrJxZBLR2LScpsdK=w456-h640)

처음 로그인하는 거면 위와 같이 프로필 사진과 닉네임을 제공할 거라는 동의화면이 나옵니다.

정상적으로 로그인됐다면 callbackUrl이 "/"이기 때문에 다시 첫 페이지로 이동할 겁니다.

그럼, 제가 콘솔에 log한 session 정보를 한번 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEgitQ2XE59sXj2bAs7BRDTr475KByrgqQIzeFydNr5m_V3F3MCjgj_VO6vv6M7teifaVCnBuQQbFzQ368o-EQjCiK43vRyre4DwYRGPekuHWjZUQQPNFl-vsP3Jsr_q6cqmrf2U41al4lqQ6FXx2xEgh0deTEpoy6rVeftoOUqBj6rF5OY6PNPL5454=w640-h242)

위 그림과 같이 세션 정보에 name 부분과 image, picture 등 아까 동의한 항목만 보이고 있습니다.

드디어 카카오 아이디로 로그인하기가 성공했네요.

---

## 커스텀 로그인 화면에서 카카오 아이디로 로그인하기 버튼 추가하기

역시나 NextAuth 기본 로그인 UI는 멋이 없습니다.

그럼, 지난 시간에 만들었던 로그인 화면에서 카카오 아이디로 로그인하기 부분을 추가해 보도록 하겠습니다.

그리고 '[...nextauth]/route.ts' 파일의 마지막에 pages 란 부분 있죠. 아까 위에서 pages란 부분을 주석처리했었는데요.

커스텀 로그인 화면을 위해서는 주석처리를 없애야 합니다.

```js
//app/api/auth/[...nextauth]/route.ts

...
...
...

  pages: {
    signIn: "/signin",
  },

...
...
```

이제 UI 부분을 고쳐 볼까요?

app 폴더 밑에 signin 폴더에 있는 page.tsx 파일을 불러서 마지막에 아래와 같이 button 하나를 추가합시다.

```js
//app/signin/page.tsx

"use client";
import React, { useRef, useEffect, useState } from "react";
import { getProviders, signIn } from "next-auth/react";

function Login() {



  // 추가된 부분
  const [providers, setProviders] = useState(null);

  useEffect(() => {
    (async () => {
      const res: any = await getProviders();
      console.log(res);
      setProviders(res);
    })();
  }, []);
  // 추가된 부분



  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSubmit = async () => {
    // console.log(emailRef.current);
    // console.log(passwordRef.current);
    const result = await signIn("credentials", {
      username: emailRef.current,
      password: passwordRef.current,
      redirect: true,
      callbackUrl: "/",
    });
  };

  // 추가된 부분
  const handleKakao = async () => {
    const result = await signIn("kakao", {
      redirect: true,
      callbackUrl: "/",
    });
  };
  // 추가된 부분

  return (
    <main className="flex min-h-screen flex-col items-center space-y-10 p-24">
      <h1 className="text-4xl font-semibold">Login</h1>
      <div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm text-gray-800 dark:text-gray-200"
          >
            Email
          </label>

          <div className="mt-1">
            <input
              ref={emailRef}
              onChange={(e: any) => {
                emailRef.current = e.target.value;
              }}
              id="email"
              name="email"
              type="email"
              required
              autoFocus={true}
              className="mt-2 block w-full rounded-md border bg-white px-4 py-2 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-blue-300"
            />
          </div>
        </div>

        <div className="mt-4">
          <label
            htmlFor="password"
            className="block text-sm text-gray-800 dark:text-gray-200"
          >
            Password
          </label>
          <div className="mt-1">
            <input
              type="password"
              id="password"
              name="password"
              ref={passwordRef}
              onChange={(e: any) => (passwordRef.current = e.target.value)}
              className="mt-2 block w-full rounded-md border bg-white px-4 py-2 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-blue-300"
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleSubmit}
            className="w-full transform rounded-md bg-gray-700 px-4 py-2 tracking-wide text-white transition-colors duration-200 hover:bg-gray-600 focus:bg-gray-600 focus:outline-none"
          >
            Log In
          </button>
        </div>
      </div>


      // 추가된 부분
      <div>
        <button
          className="w-full transform rounded-md bg-gray-700 px-4 py-2 tracking-wide text-white transition-colors duration-200 hover:bg-gray-600 focus:bg-gray-600 focus:outline-none"
          onClick={() => signIn("kakao", { redirect: true, callbackUrl: "/" })}
        >
          kakao login
        </button>
      </div>
      // 추가된 부분


    </main>
  );
}

export default Login;

```

일단 추가된 부분이라고 주석으로 처리한 곳이 3군데인데요.

먼저, 마지막에 UI부분을 보시죠.

여기서 중요한 게 signIn 함수에 지난 시간에 "credentials"을 넣고 옵션을 줬던 게, 오늘은 "kakao"라고 Provider 이름을 지정했고,

그리고 그다음으로 redirect 부분과 callbackUrl을 지정했습니다.

참고로 redirect 부분과 callbackUrl을 지정하지 않으면 카카오 로그인이 작동되지 않으니 꼭 옵션을 넣어줘야 합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhSNFbyVUsleyI9ZV67pUh6Xxhp-O6VzoK3COufVRsKOm1V8YTUSbeSvHbWs2GTkpHh6O2roylM2vXMFWMwu66aWVrF8XsNS0BC70saG_yIyECoD2kHzpvnwKsBOUGZZ0KCfUS7gcLqAvjvanDGAU5ERSdNhDtsfbt-LxWcrrjW4Kcftay99nu-z_CY)

실행결과 아주 잘 실행되는데요.

---

## 코드 더 살펴보기

조금 전에 추가된 부분이 3군데라고 했었는데요.

2번째 추가된 부분인 handleKakao 함수를 살펴볼까요?

마지막에 추가된 부분에서 직접 signIn 함수를 실행할 수도 있는데요.

handleKakao라고 따로 함수를 만들어 실행하면 async 방식으로 signIn 함수를 호출할 수 있습니다.

그리고 추가된 부분 첫 번째 부분은 getProviders() 함수를 사용하는 방법에 대해 적어 놓은 건데요.

NextAuth의 헬퍼 유틸리티입니다.

getProviders() 함수는 비동기식으로 작동해야 하기 때문에 useEffect함수에서 익명 async 방식으로 코드를 구현한겁니다.

스택오버플로우에서 찾은 코드라서 잊지 않으려고 적어 놓은 겁니다.

참고 바랍니다.

그럼.

