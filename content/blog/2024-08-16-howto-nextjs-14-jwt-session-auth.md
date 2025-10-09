---
slug: 2024-08-16-howto-nextjs-14-jwt-session-auth
title: Next.js 14 App Router로 JWT 기반 세션 인증 구현하기
date: 2024-08-16 02:29:22.640000+00:00
summary: 이 튜토리얼에서는 Next.js 14의 App Router를 사용해 써드파티 라이브러리 없이 JWT 기반의 세션 인증을 구현하는 방법을 다룹니다.
tags: ["next.js", "session", "auth"]
contributors: []
draft: false
---

안녕하세요?

지난 시간까지 계속 이어져 온 로그인 세션 구현을 Next.js의 App Router로 다른 제3의 라이브러리 도움없이 밑바닥에서 구현해 보겠습니다.

참고로 로그인 구현하기 시리즈 전체 강좌 리스트입니다.

- [Cloudflare, Hono에서 OAuth를 이용해서 네이버 아이디로 Login 구현해 보기](https://mycodings.fly.dev/blog/2024-07-24-cloudflare-hono-oauth-naver-login)

- [Cloudflare에서 Hono와 Google OAuth를 이용해서 Login 구현해 보기](https://mycodings.fly.dev/blog/2024-07-21-cloudflare-hono-google-login)

- [Cloudflare, Hono, OAuth, Kakao Login(카카오 로그인)](https://mycodings.fly.dev/blog/2024-07-27-cloudflare-hono-oauth-kakao-login)

- [Cloudflare, D1 DB, Hono, Lucia, Drizzle ORM을 이용한 유저 로그인 구현](https://mycodings.fly.dev/blog/2024-08-01-cloudflare-hono-d-1-lucia-drizzle-login)

- [Cloudflare, Hono에서 Lucia Auth를 이용해서 GitHub ID로 로그인 구현하기](https://mycodings.fly.dev/blog/2024-08-03-cloudflare-hono-lucia-github-id-login-with-d-1-db)

- [Hono, Lucia Auth를 이용해서 Kakao ID로 로그인 구현하기](https://mycodings.fly.dev/blog/2024-08-03-cloudflare-hono-lucia-auth-drizzle-kakao-login)

- [네이버 아이디 로그인 구현하기 - Cloudflare, Hono, Lucia Auth](https://mycodings.fly.dev/blog/2024-08-04-cloudflare-hono-lucia-auth-naver-login)

---

빈 프로젝트를 아래와 같이 작성합니다.

```sh
npm create cloudflare@latest my-next-app -- --framework=next

or

bun create cloudflare@latest my-next-app
```

나중에 Cloudflare의 D1 DB를 이용한 유저 정보 저장과 로그인을 구현하기 위해 Cloudflare pages를 이용할 생각입니다.

이제 화면 끝에 보시면 아래와 같이 나오는데요.

```sh
┬ Waiting for DNS to propagate (25s)  ..
```

위와 같이 나오면 거의 끝난건데, Cloudflare 엣지에 등록하는 거라 시간이 오래걸린다.

여기서 그냥 Ctrl + C로 끝내버려도 상관없습니다.

---

전체적인 코드의 형태를 인증 튜토리얼에 맞게 간소화 시킬 예정입니다.

그래서 page.tsx 파일만 아래와 같이 정리해서 로그인 form과 버튼만 남겨 놓겠습니다.

```ts
import { getSession, login, logout } from "@/lib";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getSession();
  return (
    <section className="p-4">
      <form
        action={async (formData) => {
          "use server";
          await login(formData);
          redirect("/");
        }}
      >
        <input
          className="border"
          type="email"
          name="email"
          placeholder="Email"
        />
        <br />
        <button className="border" type="submit">
          Login
        </button>
      </form>
      <form
        action={async () => {
          "use server";
          await logout();
          redirect("/");
        }}
      >
        <button className="border" type="submit">
          Logout
        </button>
      </form>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </section>
  );
}
```

전체적인 UI는 간단합니다.

위 코드는 Next.js의 Form 액션을 사용한 코드이고, 이제 login, logout 함수만 작성하면 됩니다.

Auth 관련 라이브러리는 src 폴더 밑의 lib.ts 파일에 다 모아놓도록 하겠습니다.

먼저, 로그인 함수를 구현해야 하는데요.

로그인 함수는 유저 이메일과 패스워드가 맞는지 체크해서 맞다면 세션정보를 만들고, 그 세션정보를 쿠키에 저장하는 역할을 하는 함수입니다.

`src/lib.ts`
```ts
import { cookies } from "next/headers";

export async function login(formData: FormData) {
  // Verify credentials && get the user
  const email = formData.get("email");

  console.log(`email : ${email}`);

  // Create the session
  const expires = new Date(Date.now() + 10 * 1000); // 10초후 세션 만료
  const session = await encrypt({ email, expires });
  console.log(session);

  // Save the session in a cookie
  cookies().set("nextjs-session-test", session, { expires, httpOnly: true });
}
```

오늘은 유저로그인 테스트에만 집중하기 위해서 패스워드 부분은 빼고 이메일 입력시 세션 생성 및 쿠키저장에 집중하도록 하겠습니다.

다음시간에 Cloudflare D1 DB, Drizzle ORM을 이용해서 패스워드 방식의 유저 가입, 그리고 로그인, 로그아웃 구현까지 확장해 볼 예정입니다.

로그인 코드를 잘 보시면 일단 유저가 입력한 이메일을 `formData.get("email")`이란 함수로 얻어오는데요.

UI 부분에서 input 태그의 name 값이 "email"인 데이터를 가져옵니다.

패스워드가 맞다고 치고(다음시간에 구현), 이제 유저 정보를 쿠키에 저장하기 위한 세션을 만들어야 하는데요.

자체 구현한 encrypt 함수를 사용했습니다.

이제 encrypt 함수를 볼까요?

```ts
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

const secretKey = "my-secret-key-in-a-tutorial";
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10 sec from now")
    .sign(key);
}
```

jwt를 이용해서 세션을 암호화할 겁니다.

요즘 잘 나가는 "jose" 패키지를 설치해서 사용할 건데요.

```bash
npm i jose
```

'jose' 패키지의 SignJWT 메서드를 이용해서 세션을 암호화할 겁니다.

JWT 알고리즘은 'HS256'을 사용했구요.

그러면 encrypt 함수의 payload 값이 뭔지 볼까요?

```ts
{ email, expires }
```

바로 위와 같이 객체인데요, email값과 expires 값입니다.

JS 축약기능때문에 위와 같이 해도 됩니다.

원래는 아래와 같은거죠.

```ts
{ email : email, expires: expires }
```

Next.js에서 제공하는 cookies() 함수를 먼저 자세히 알아보겠습니다.

---

## cookies.set()

Next.js에서 `cookies()` 함수는 서버 컴포넌트에서 쿠키를 설정하거나 읽을 때 사용됩니다. 이 함수는 Next.js의 최신 버전에서 서버 컴포넌트 내에서 쿠키를 간편하게 조작할 수 있도록 도와줍니다.

`cookies().set()` 메서드는 쿠키를 설정하는 기능을 제공합니다. 코드를 분석하면서 주요 요소를 설명해 드리겠습니다:

```javascript
cookies().set("nextjs-session-test", session, { expires, httpOnly: true });
```

### 1. **`cookies()` 함수**

- `cookies()` 함수는 Next.js 서버 컴포넌트 내에서 현재 요청과 관련된 쿠키를 관리하기 위한 객체를 반환합니다.
- 이 객체를 사용하면 현재 요청에 대한 쿠키를 읽거나 설정할 수 있습니다.

### 2. **`.set()` 메서드**

- `cookies().set(name, value, options)` 형태로 사용됩니다.
- `name`: 설정할 쿠키의 이름입니다. 여기서는 `"nextjs-session-test"`라는 이름으로 쿠키를 설정합니다.
- `value`: 쿠키에 저장할 값입니다. 이 예제에서는 `session` 변수가 쿠키의 값으로 설정됩니다.
- `options`: 쿠키에 대한 설정 옵션을 객체 형태로 전달합니다.

### 3. **옵션 객체 (`options`)**

옵션 객체에는 여러 가지 쿠키 설정 옵션이 포함될 수 있으며, 이 예제에서는 다음과 같은 옵션이 사용되었습니다:

- **`expires`**: 쿠키의 만료 날짜를 지정합니다. `expires`는 `Date` 객체로 설정되며, 지정된 시간에 쿠키가 만료됩니다. 위의 예제에서 `expires`는 10초 후로 설정되었기 때문에, 이 쿠키는 10초 후에 만료됩니다.
  
- **`httpOnly: true`**: 이 옵션을 사용하면 클라이언트 측 JavaScript에서 쿠키에 접근할 수 없도록 설정됩니다. 이를 통해 보안이 강화됩니다. 예를 들어, XSS(교차 사이트 스크립팅) 공격으로부터 쿠키를 보호할 수 있습니다.

### 4. **사용 예시**

이 코드의 전체적인 의미는, `"nextjs-session-test"`라는 이름의 쿠키를 현재 요청에 대해 설정하고, 그 값으로 `session` 변수를 저장한다는 것입니다. 또한, 이 쿠키는 클라이언트 측에서 접근할 수 없고(`httpOnly: true`), 설정된 시간이 지나면(10초 후) 자동으로 만료됩니다.

---

그러면 세션에 저장되는 JWT 값과 쿠키값을 살펴보겠습니다.

개발 서버를 돌리고 적당한 이메일을 넣고 로그인 버튼을 누르면 아래와 같이 터미널창에 표시될겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhxJrvsx7-dfcBz1JE7O-Jb6R4enAwjvZVKeWa52neV3O8bDoKonODFs9rU-JG103AnJGhcCo7TVhGNbKa9NcGRnN3VNG0BpqyaDKQyINiXydk0Fq1EiQzEOJ-8uAVvsto7h8D3fI5M8n9HYyb20qt1E0tmlL4xZlo0EJiAuQkA2crxX5JSzVDbp3tOnEU)

![](https://blogger.googleusercontent.com/img/a/AVvXsEgVKAI7q1DfmHrxA1z1Pk5IWf7TU9J6YKwInfHlAOcfufIea-Rof8i2VpSVHIEtGAiNSw3q7DAIJo6s8qAjxj3wVRq4bgWHrOwK8bOmTvXM8Js_1qZ4EpDpA0gBFmSarL1sYRf1HRsT-L_ujuZnpQ8QRWvF7bUxp-XWVgcR5oNfOksuELPXeDNzZcuIya0)

```bash
email : test@test.com
eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJleHBpcmVzIjoiMjAyNC0wOC0xNlQwMjowNDoxNy4wOTRaIiwiaWF0IjoxNzIzNzczODQ3LCJleHAiOjE3MjM3NzM4NTd9.0eH6JBSYpe0s-saGwX1VltgS96u8ju7xrzTikmG8-O8
```

위와 같이 나오는데요.

터미널창에 뜬 세션 정보는 JWT입니다.

이 값을 한번 확인해 볼까요?

아래 홈페이지로 가서 붙혀넣기 해보시면 됩니다.

[jwt.io/](https://jwt.io/)

![](https://blogger.googleusercontent.com/img/a/AVvXsEi04EmioPf_WvtFzv2-sx0PyyIy2yfOVcfqed6Tedxzbq-YyKf46B2hqeutKmqBF01Gv5gU4Bw43IfMj1dc3tXZLNiVPuMN5gkWukxXqy1BsoL9EWgnxiD-VHOdZes4jdwZ0zbWp_v3Cs_OshV12EtUXzMz4W0huNXyQQRjxX3u2LmGVdZSUfjh-ctfJDw)

위와 같이 JWT 디코드 값에 우리가 입력한 이메일값이 잘 보입니다.

그러면 로그인 후에 pages.tsx 파일에서 보면 세션을 화면에 보여주는 코드가 있는데요.

바로 getSession() 함수입니다.

이 함수로 'lib.ts' 파일에 구현해 보겠습니다.

```ts
export async function getSession() {
  const session = cookies().get("nextjs-session-test")?.value;
  if (!session) return null;
  return await decrypt(session);
}
```

위 코드는 아주 간단한데요.

Next.js에서 제공해 주는 cookies 함수의 get 메서드로 우리가 저장한 쿠키값을 가져오는 겁니다.

그리고 쿠키값을 decrypt 함수를 통해 디코드해서 리턴해 줍니다.

decrypt 함수를 구현해 보겠습니다.

```ts
export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}
```

역시나 'jose' 패키지읭 jwtVerify 함수를 사용했습니다.

이제 메인 화면에 쿠키에서 저장한 후 불러온 세션값이 보이는거죠.

이제 로그아웃 함수만 구현하면 됩니다.

다시 'lib.ts' 파일에 작성해 보겠습니다.

로그아웃은 세션 쿠키를 삭제하면 되는건데요.

```ts
export async function logout() {
  // Delete the session
  cookies().set("nextjs-session-test", "", { expires: new Date(0) });
}
```

역시나 Next.js 에서 제공해 주는 cookies 함수의 set 메서드로 우리가 사용하는 세션 이름에 해당하는 세션을 빈칸으로 지정해 주면 됩니다.

당연히 expires는 0으로 지정해주고요.

이제 브라우저에서 로그아웃 버튼을 누르면 로그아웃 될겁니다.

---

## 세션 연장하기

쿠키값의 세션 만료시간을 10초로 뒀는데요.

너무 짧습니다.

그래서 보통 일주일, 열흘로 시간을 지정해서 쓰는데요.

여기서는 미들웨어 테스트를 위해 10초로 지정했습니다.

사용자가 홈페이지를 계속 사용한다면 로그인이 유지되도록 해야하는데요.

그래서 미들웨어에서 계속 세션 만료시간을 업데이트해주는 코드를 작성해 보겠습니다.

그러면 유저가 10초동안 아무런 작업도 하지 않으면 로그아웃되는거고, 계속 여기 저기 돌아다니게 되면 로그인이 유지되는 로직입니다.

Next.js의 미들웨어는 middleware.ts 파일을 최상위 폴더에 두면 되는데요.

우리의 경우 src 폴더에 두면 됩니다.

```ts
import { NextRequest } from "next/server";
import { updateSession } from "./lib";

export async function middleware(request: NextRequest) {
    return await updateSession(request);
}
```

위 코드의 미들웨어는 단순히 'lib.ts' 파일에서 updateSession 함수만 실행시키고 있습니다.

이제 updateSession 함수를 'lib.ts' 파일에 구현해 보겠습니다.

```ts
import { NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("nextjs-session-test")?.value;
  if (!session) return;

  // 세션 연장
  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 10 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: "nextjs-session-test",
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}
```

위 코드의 로직은 간단합니다.

현재 세션의 expires 값을 현재 기준 10초 연장해서 다시 쿠키로 저장하는 코드입니다.

이제 완료됐으니 다시 테스트해보시면 여기 저기 클릭했으면 즉, Next.js에 Request를 보냈으면 미들웨어가 작동해서 세션이 10초 연장될겁니다.

10초 연장되면 로그아웃이 되지 않는거죠.

테스트를 위해 새로고침을 계속 해보시면 화면의 expires 시간값이 계속 현재 기준의 시간으로 변하는 걸 볼 수 있습니다.

---

## 맺음말

지금까지 Next.js의 로그인 세션에 대해 NextAuth 도움없이 구현해 봤는데요.

다음 시간에는 Cloudflare D1 DB를 이용해서 실제 유저 가입과 로그인 구현에 도전해 보겠습니다.

그럼.







