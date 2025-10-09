---
slug: 2023-06-03-nextauth-nextjs-tutorial-protected-route-and-jwt-token
title: NextAuth 사용법 4편 - 토큰을 이용한 세션 보호
date: 2023-06-03 05:59:34.183000+00:00
summary: NextAuth 사용법 4편 - 토큰을 이용한 세션 보호
tags: ["jwt", "token", "nextauth", "next.js", "session"]
contributors: []
draft: false
---

안녕하세요?

NextAuth 사용법 4편까지 왔습니다.

이번 시간에는 세션 보안에 대해 알아보겠습니다.

일단 아래와 같이 유저가 만든 Post를 읽을 수 있는 API를 만들어 보도록 하겠습니다.

```js
//app/api/user/[id]/route.ts

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  console.log(params)

  const id = Number(params.id)

  return new Response(JSON.stringify({ posts: id }))
}
```

app/api 폴더 밑에 user 폴더가 있었죠! 그 밑에 '[id]'라고 스퀘어 브라켓을 이용한 폴더를 만듭니다.

그리고 그 밑에는 route.ts 파일을 만들고요.

이게 바로 Next.js 버전 13에서의 다이내믹 API Route가 되는 겁니다.

이제 'id'라는 다이내믹한 변수로 API를 제어할 수 있는 거죠.

API 호출한 실행 결과를 한번 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEhe_I4vVMLW9jPJyLQMfHoQ5fJDz4C2C3xQunEol_hzP065peXLpJ8izj-gZ6GHxfdGfQ869a58VibBhWqYhIPvVrew-mxVsBvocYS1CVFd0VtFSeTRfqmnxiI3cWWzNw9icQBDsfksuywlqerCnG2kpkqwidAWY0HgwmiKT0heUEMCtqBlFPneN8IB)

![](https://blogger.googleusercontent.com/img/a/AVvXsEif8exoA1LpSW6cpynLRXW1IbC4xRm8TyuqjY-aE-hy7-wmNLgOgJUPkEOtO2JZl-MPLkJ3NElUfFa4CDgdoVLi6yuvdJ1dpg_bKMFtlj6YNz2k9yRWcx56yg8QBvwgtYxru1RZLPbOejTLPbZM6OP0L1fWA2eN5g1bajCNE3mjxZAi9sN84ghT_SfC)

브라우저난 Insomnia에서나 똑같이 작동합니다.

여기서 params.id를 Number 타입으로 바꿨는데요.

왜냐하면 Prisma Model에서 id는 Int 타입이기 때문입니다.

기본적으로 params.id는 string 타입이라서 꼭 Number 타입으로 변환해 줘야 합니다.

그럼, 본격적으로 유저가 작성한 Post를 읽어오기 위한 API를 완성해 볼까요?

일단 Post의 예제가 있어야 하니까, Prisma Studio에서 Post에 몇 가지 글을 수동으로 입력합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjNxSW_K4X_lZWdNnYTuGdZb7DDieFaqBba1Qf7Mkjnm7rT9S2X9NIKVZP84ifHz0yA9ve4ypM7HhwUCdBLmY_WTC5t_zwj70_e8kZjYh2IrfgZuIBmtqkF6AP5Vh3a63xeLs8_CtzCG0awlPDkxZ70Oj4WB_kAvy1LcfPmoam2UP9vYoIaSYczD5Vx)

![](https://blogger.googleusercontent.com/img/a/AVvXsEgz-00VO72SbMHz1hKlpTdFi4ZZOT8Y5tRIFsrkVj-Pl9KLr8ucigBKCCU4Es05HAOwhhKYycI0D585M5VxjUkOXMFXlxZLkn9B4M0rTVkeRmW1C3TQN7IMkPjEU6urEI4KchRPRx7lTPsxEPgg0Sv6UlV2sc3GrEotAvXYAwMXBUH8Fj64SOvc3kcP)

위 그림과 같이 2개의 데이터를 만들었는데요.

꼭 User 부분에서 우리가 가입했던 아이디를 꼭 지정하기 바랍니다.

이제 API 코드를 prisma를 이용해서 다시 작성해 볼까요?

```js
//app/api/user/[id]/route.ts

import prisma from '@/app/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  console.log(params)

  const id = Number(params.id)

  const userPosts = await prisma.post.findMany({
    where: {
      authorId: id,
    },
    include: {
      author: {
        select: {
          email: true,
          name: true,
        },
      },
    },
  })
  return new Response(JSON.stringify(userPosts))
}
```

prisma의 findMany를 이용해서 authorId가 id와 같은 모든 Post를 가져오는 로직입니다.

결과를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEjW3aQFM2u60kjPnwDd6MhOG5mgiXko4pGdMUfyPJzbgHvSxpzLZF-8fzUz73jaOgIFQMyEuXmZ1ybFiN_5WQszy63YypUqvyUTYke_9AW_s_lDita9L9VRkExybuVS5vhCL6VdBFZXNUDX495ZqTbCjbU_zQPKlYXFQVnEEwVZmkyVGIbhRGGTytdg)

잘 작동되네요.

---

## API 보안

그런데 이 API 콜의 주소는 'http://localhost:3000/api/user/2'인데요.

NextAuth로 로그인 안 한 상태에서도 이 API를 호출할 수 있습니다.

로그인도 안 된 사용자가 글 내용을 볼 수 있어 매우 위험한데요.

NextAuth에서는 이럼 위험한 일을 방지하기 위해 JWT 토큰을 다루는 걸 제공합니다.

전체적으로 지금까지 만들었던 NextAuth login 로직을 많이 손봐야 하는데요.

먼저, Login시 리턴되는 user 객체에 JWT Access Token을 함께 리턴 할 겁니다.

그래서 'http://localhost:3000/api/user/2' 같은 API도 이 accessToken이 있어야만 호출될 수 있도록 코드를 바꿀 예정입니다.

그리고, login시 리턴된 accessToken을 NextAuth의 Session에도 함께 저장할 겁니다.

그래서 로그인된 상태에는 이 accessToken을 계속 이용할 수 있게 만들 겁니다.

만약 accessToken을 Session에 저장하지 않으면 한 번 로그인한 후에 이 accessToken에 접근할 수 없게 되기 때문이죠.

---

## accessToken도 login시 리턴하기

먼저, jsonwebtoken 패키지를 설치합니다.

물론 jsonwebtoken의 types도 설치하겠습니다.

```bash
npm install jsonwebtoken
npm install -D @types/jsonwebtoken
```

먼저, 가장 많이 스이는 jwt 관련 함수를 만들어야겠죠.

lib 폴더에 jwt.ts 파일을 만듭니다.

JWT 관련해서는 SECRET_KEY를 제공해야 하는데요.

.env 파일에 SECRET_KEY를 어려운 긴 글자로 채워 넣읍시다.

```bash
NEXTAUTH_SECRET=qerkasjhfkauiqeywrhkasjhfksajfh
NEXTAUTH_URL=http://localhost:3000
SECRET_KEY=dkasdhfjahsdfjhskdfhaksdhfakjs


# This was inserted by `prisma init`:
# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

DATABASE_URL="file:./dev.db"
```

이제 JWT 관련 함수를 만들건대요.

먼저, jswonwebtoken 패키지로 token을 만드는 함수를 만들 겁니다.

바로 signJwtAccessToken 함수인데요.

```js
//app/lib/jwt.ts

import jwt, { JwtPayload } from "jsonwebtoken";

interface SignOption {
  expiresIn?: string | number;
}

const DEFAULT_SIGN_OPTION: SignOption = {
  expiresIn: "1h",
};

export function signJwtAccessToken(payload: JwtPayload, options: SignOption = DEFAULT_SIGN_OPTION) {
  const secret_key = process.env.SECRET_KEY;
  const token = jwt.sign(payload, secret_key!, options);
  return token;
}
```

jwt 패키지의 sign 함수를 이용해서 token을 얻어내고 그걸 리턴 하는 함수입니다.

그리고 두 번째로 나중에 API 콜이 올 때 전달받은 token이 정확한 건지 체크하는 함수가 있어야 하는데요.

verifyJwt 함수도 만들겠습니다.

위 코드 밑에 이어서 작성해서 주면 됩니다.

```js
export function verifyJwt(token: string) {
  try {
    const secret_key = process.env.SECRET_KEY;
    const decoded = jwt.verify(token, secret_key!);
    return decoded as JwtPayload;
  } catch (error) {
    console.log(error);
    return null;
  }
}
```

jwt 패키지의 verify 함수를 이용해서 token을 검증하는 함수입니다.

자, 이제 jwt 헬퍼 함수도 만들었으니 이걸 이용해야겠지요.

---

## login시 accessToken 만들기

이제 로그인 로직을 다시 열어서 수정해야 하는데요.

바로 api/login에 있는 로그인 로직에 accessToken을 추가해야 합니다.

```js
//app/api/login

export async function POST(request: Request) {
...
...
...

  if (user && (await bcrypt.compare(body.password, user.password))) {
    const { password, ...userWithoutPass } = user;

    // 추가된 부분
    const accessToken = signJwtAccessToken(userWithoutPass);
    const result = {
      ...userWithoutPass,
      accessToken,
    };

    return new Response(JSON.stringify(result));
  } else return new Response(JSON.stringify(null));
}
```

아까 만들었던 jwt.ts 파일의 signJwtAccessToken 함수를 이용해서 accessToken을 만듭니다.

그리고 그 accessToken을 포함하는 새로운 result를 만듭니다.

그리고 최종적으로 그걸 Response로 리턴 합니다.

Insomnia를 통해 테스트해 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEjrmJNGXg7BXsR4y9eA8hkIMOJlYxvbotYBPmPjqnbOBZQPSca6tPvVPbfRwni7hSrkqr5TNk5mn4uSalr6fp7UR-zbUwufjQCdLSi37w7pglTX8QURNCXryHhbdPJIes8kWSwIJ_jdIFdw-FhpYhkgIzcRua9t5w0F986ObY96Th6O0pNw8FAVspqA)

이제 로그인 후 리턴 되는 user 정보에 accessToken까지 리턴 되게 됩니다.

---

## [...nextauth]/route.ts 파일의 authorize 수정하기

여기서 더 추가해야 될게 바로 accessToken을 NextAuth의 Session에도 추가해서 관리해야하는데요.

이렇게 하려면 NextAuth에서는 초기화하는 옵션에서 callbacks 항목을 추가해야 합니다.

```js
//app/api/auth/[...nextauth]/route.ts

const handler = NextAuth({
  providers: [
    CredentialsProvider({
    ...
    ...
    ...
    ...
}],

  // 추가된 부분
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },

    async session({ session, token }) {
      session.user = token as any;
      return session;
    },
  },
});
```

NextAuth에서 callback을 담당하는데요.

callback은 로그인 폼에서 유저네임과 패스워드를 넣고 제출하기(submit) 버튼을 눌렀을 때, NextAuth의 authorize 함수에서 로그인 로직을 수행하고 나서 마지막으로 실행되는 부분인데요.

일단 위에서 보시듯이 jwt 함수와 session 함수를 추가했습니다.

jwt 함수에서 token과 user를 같은 항목으로 만들고 리턴 합니다.

그러면 jwt가 다시 token을 리턴 하게 되는데 밑에 있는 session 콜백 함수에서 session.user에 그 값을 지정하고 다시 session을 리턴 합니다.

이렇게 하면 NextAuth에서 사용하는 session에 accessToken이 포함되게 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhMetE-2iNCop5gymLfxxOIKPOKh0cSzBBY_fJw6_AMJUVrjpGuIipciaD5zo8fp3K-PZywqw_MlwATZbBtg723mqei5Uz9ve66ZsgUPFnL6HBkBsoQ4hknWV_MUQ5VhDPI6_UR3mrhnG2g4EHvMF67GiR8ZdHApkl32pj2HXWQg1Z80nVkhdlpefqu)

위 그림과 같이 authorize 함수에 있는 console.log(user)에 의해 콘솔에 표시된 user값입니다.

예상했듯이 accessToken이 같이 리턴되고 있습니다.

---

## session.user 의 type 정보 업데이트하기

이제 NextAuth의 session.user에는 accessToken이 기본적으로 들어가게 됩니다.

그런데 VS Code에서 보시면 session.user의 타입에는 accessToken이 없습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiGkRRaFjcBsAlJM1jK-7QIB3HvXmQhB-g90qSDcmsZnEKCImhU6ABFdqTBq4RK5Riwhc2XhRoRt4nMPfCoRiInpRPn1e5nEj8c2nPWWO9rPVqvTMhQqkWPLsY21cnX5RpC0ATdqPN2aQlRgyo7g7p3Op5IXQ9ZRzTpU7B5EOeJtFGAXpCiH1TyVaNx)

위 그림에서 보듯이 정말 없네요.

이 부분은 NextAuth의 type 형식을 커스터마이징 할 수 있는데요.

이건 TypeScript의 기능입니다.

먼저, app폴더와 같은 레벨에 types 폴더를 만들고 그 아래 next-auth.d.ts라는 type 정의 파일을 만듭니다.

```js
//types/next-auth.d.ts

import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      name: string;
      email: string;
      accessToken: string;
    };
  }
}
```

이렇게 하면 아래 그림처럼 session.user에 id, accessToken이 추가되게 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgK0r_TKfnvwHbUFpbG3dKqpozbReuHq2eJfUBqTpS5uq31m-3cEnkBAGJ_FkG8l0CmM5U2IsKKVV3hLQTqdZmJU1ucP38lln5-LV4zUZZrJjeBgyn_O5wAWOuITZbQvQZnkb7-Mh3TxvxObRt85FxrkdKofsrE7h5uX6Sh4ch1S1gpfdr74Quae_SP)

NextAuth의 기본 session 타입을 커스터마이징한 겁니다.

---

## Next.js API 호출을 accessToken을 이용해서 보호하기

이제 우리가 이 글을 쓰는 이유인 토큰을 이용한 세션 보호하기 단계로 왔습니다.

우리가 맨 처음 만들었던 api/user/[id]/route.ts 파일의 API GET 호출을 이제 토큰을 검사하는 로직을 추가해서 로그인되지 않은 상태에서는 API가 작동하지 않게 만들 겁니다.

```js
import { verifyJwt } from '@/app/lib/jwt'
import prisma from '@/app/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  // 추가된 부분
  const accessToken = request.headers.get('authorization')
  if (!accessToken || !verifyJwt(accessToken)) {
    return new Response(JSON.stringify({ error: 'No Authorization' }), {
      status: 401,
    })
  }

  console.log(params)

  const id = Number(params.id)

  const userPosts = await prisma.post.findMany({
    where: {
      authorId: id,
    },
    include: {
      author: {
        select: {
          email: true,
          name: true,
        },
      },
    },
  })
  return new Response(JSON.stringify(userPosts))
}
```

추가된 부분을 보시면 request.headers에서 authorization 부분에서 accessToken을 가져오고,

그 액세스 토근이 없고 또는 verifyJwt 함수를 통과하지 못하면 401 에러를 보냅니다.

이제 Insomnia를 통해 테스트해 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEgGatTkAR8V1jQkU-a_ccuzn43E-LJ-bPIzaJX0Yu3IHoOKmKC_TX7cPh5enaMUnY4E_Vg7iWErQlM8utwrTIreLxI8AXvS3ZlnHmiYzfA_IuNAFnqCxtZKRyhqKpPj3OOiVe92dmY8pup8WiYHL_4MIg6wVdCR8zjzA7rZea9p8NqsiWpKsHz5dMke)

일단 API 테스트에서 headers부분에 "authorization" 부분을 넣지 않고 API 호출을 해봤습니다.

역시나 위 그림처럼 error가 뜹니다.

그럼 authorization을 넣고 테스트해 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEil1USI2xNTswbkZi1TN9CxIk66Dy_ddkIT3ePhlakJSHvZ2-A1qU1q3YJZOLD5m8-fTBqlFOpC5mwwE4QhaBjqvOpBK5QjvQRwgidXceFaf_0GsNe1blLSLpVBP3u65uTrwGNoRqZZM4Rchn3_FqGmMK8ZVVwrHVdgNwj_dDb1RiECbaqxpxmCHNHS)

위 그림처럼 authorization 부분에 일부러 잘못된 토큰을 넣고 해도 위 그림처럼 error가 뜹니다.

이제 제대로 된 토큰을 넣어 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEgNrUpyMdIAcre127fPmpKPo8HOSXE07fuUdBhm1N6nYxHxBmoKosRB9LzWLOPVTTe6gAXRysHEFhBNyje6uvc6YH6aMpsauhCqPZ_hlgGPjEk5k9DYpGbQifn2X6ORkpZ5uxELJJ_AC2cut9TI_jgB6hc821E8hBcLvVSftrEiNjIknGt2MWfhafH4)

위 그림처럼 토큰을 넣고 API 호출을 하니까 제대로 API가 작동되고 있습니다.

이제 API 보안에 토큰을 이용한 로직이 완성되었네요

---

## NextAuth와 Next.js 미들웨어(middleware)를 이용한 페이지 보호하기

지금까지는 Next.js API를 액세스 토큰이란 형식으로 로그인 상태에서는 작동하지 못하게 보호했었는데요.

이번에는 일반적인 페이지를 미들웨어를 이용해서 아예 로그인하지 않으면 접근하지 못하게 만들어 보겠습니다.

Next.js에서는 middleware.js(ts) 파일을 제공하는데요.

app 폴더와 같은 레벨에 middleware.js(ts) 파일을 만들면 됩니다.

먼저, 제가 작성하고 있는 Next.js의 버전이 13.4.4 버전인데요.

이 버전이랑 NextAuth에서 middleware 부분이 충돌이 생깁니다.

그래서 Next.js 버전을 13.4.5 canary 버전으로 업데이트해야 합니다.

Next.js에서도 이 부분이 충돌된다는 걸 알고 13.4.5 버전에서 버그 수정 중인 거 같습니다.

일단 npm으로 아래처럼 canary 버전을 설치합니다.

```bash
npm install next@canary
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEi7oI6OY2iLn-GwQMIICBhudP_jQ9DSGhu15fzLNIhr73dTZcoNrMP7xg5xlGJ4tONfrbvssTQd5LZXGHXj-a-lkGYIaeFYF3kbvPmv0Q_K6WP7kQ9oXZ1EDCo-EPk85Vp8vS9R_SyVa963oUqeoVz-VIEdM7NqzPB7vGwSdRrUcuL4aUXls38xUfY5)

위 그림처럼 13.4.5 버전이 설치되었네요.

이제 middleware.ts 파일을 만들어 보겠습니다.

꼭 app 폴더와 같은 레벨에 만들어야 합니다.

```js
export { default } from 'next-auth/middleware'

export const config = {
  matcher: ['/userposts/:path*'],
}
```

NextAuth에서는 Next.js에 맞는 미들웨어를 제공해 주는데요.

바로 첫 번째 줄만 적어도 미들웨어가 작동됩니다.

그리고 두 번째 줄에 있는 config 부분에 matcher 부분을 추가해서 로그인한 상태만 볼 수 있는 페이지를 계속 추가할 수 있습니다.

위에서 보듯이 userposts 경로 밑으로는 보호된다는 얘기입니다.

이제 app 폴더 밑에 userposts/page.tsx 파일을 만들고 테스트해 봅시다.

```js
//app/userposts/page.tsx

import React from "react";

function UserPosts() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      UserPosts
    </main>
  );
}

export default UserPosts;
```

이제 그 경로로 브라우저의 주소를 바꿔 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEhYqdkYwGuKoM05ONTBJaXybLgtnvOEF-eZNSoxFOkN9do1rByxSDhalr4AltaAvpKuNYdcwDWXe8Jnm0z6Mcq3x-0dEGh2yEliFGZMJqgIlb3RkdrAGead6SZSPb_03TD03ADpGtk-WkwxNouU6TamVKTZTlWlrSVFzk13aAe_XVdlDeILMIB5cKxv)

위 그림처럼 로그인된 상태에서는 userposts 경로가 브라우저에 보입니다.

그럼 로그아웃하고 접근해 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEgAppcXwUSf9G_JAEoD7c77DjwcpHsPTqyNKH9U--JZn0beEsx6Kt49ZswobpSnZ8O_rMuahB52jCurlSTtq6NjUgcqPbGyUfz1ehBZWIPMgg_XLpEj6LoTrvJHNgvZJQ4Z8y3F2J96aEOuR4k1s6KyGCtcLiLFELHtXIBtP9VIW2nfIzjrjvkbyDvY)

역시나 로그인 화면으로 이동됩니다.

이제 middleware.ts 파일에 보호를 원하는 경로를 추가하면 NextAuth가 자동으로 보호해 주게 됩니다.

그럼.
