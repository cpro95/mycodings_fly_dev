---
slug: 2024-08-04-cloudflare-hono-lucia-auth-naver-login
title: 네이버 아이디 로그인 구현하기 - Cloudflare, Hono, Lucia Auth
date: 2024-08-04 00:53:52.154000+00:00
summary: Lucia Auth는 사용하고 arctic 패키지는 사용하지 않고 Naver ID 로그인을 구현해 봤습니다.
tags: ["Cloudflare", "Hono", "Lucia", "Drizzle orm", "D1 DB", "Naver ID Login"]
contributors: []
draft: false
---

안녕하세요?

지난 시간에는 GitHub ID, Kakao ID를 이용해서 로그인을 구현해 봤는데요.

Lucia Auth와 함께 arctic 패키지가 아주 쉽게 구현해 줄 수 있어서 고마웠는데요.

네이버 로그인은 arctic에는 없습니다.

대신 라인(Line) 로그인이 있죠.

아마 라인 로그인과 네이버 로그인은 다른 서버를 쓸 거 같은데요.

오늘은 arctic 패키지 없이 수작업으로 네이버 로그인을 구현해 보겠습니다.

예전에 썼던 [네이버 로그인 구현 강의](https://mycodings.fly.dev/blog/2024-07-24-cloudflare-hono-oauth-naver-login)에서 Lucia Auth를 이용한 세션 저장만 추가하는 꼴입니다.

참고로 로그인 구현하기 시리즈 전체 강좌 리스트입니다.

- [Cloudflare, Hono에서 OAuth를 이용해서 네이버 아이디로 Login 구현해 보기](https://mycodings.fly.dev/blog/2024-07-24-cloudflare-hono-oauth-naver-login)

- [Cloudflare에서 Hono와 Google OAuth를 이용해서 Login 구현해 보기](https://mycodings.fly.dev/blog/2024-07-21-cloudflare-hono-google-login)

- [Cloudflare, Hono, OAuth, Kakao Login(카카오 로그인)](https://mycodings.fly.dev/blog/2024-07-27-cloudflare-hono-oauth-kakao-login)

- [Cloudflare, D1 DB, Hono, Lucia, Drizzle ORM을 이용한 유저 로그인 구현](https://mycodings.fly.dev/blog/2024-08-01-cloudflare-hono-d-1-lucia-drizzle-login)

- [Cloudflare, Hono에서 Lucia Auth를 이용해서 GitHub ID로 로그인 구현하기](https://mycodings.fly.dev/blog/2024-08-03-cloudflare-hono-lucia-github-id-login-with-d-1-db)

- [Hono, Lucia Auth를 이용해서 Kakao ID로 로그인 구현하기](https://mycodings.fly.dev/blog/2024-08-03-cloudflare-hono-lucia-auth-drizzle-kakao-login)

---

## 템플릿 계속 유지

기존에 GitHub ID, Kakao ID 로그인에 썼던 Hono 웹 애플리케이션 템플릿을 그대로 사용할 예정입니다.

기존 코드의 구조가 '/admin' 라우팅이 대시보드가 되었고, 그 밑에 '/admin/login' 라우팅으로 가면 여러가지 로그인 옵션이 보이는 화면이 보이고, 로그인 방법을 클릭하면 "/admin/login/naver", "/admin/login/kakao", "/admin/login/github"로 이동합니다.

그러면 먼저, "/admin/login/naver" 라우팅을 추가해야겠죠.

DB 구조는 지난 시간에 맞춤으로 설정해서 네이버 로그인도 적용될 수 있습니다.

그래서 아래와 같이 하면 쉽게 될거 같은데요. 아닙니다.

```ts
admin.get("/login/naver", async (c) => {
  const naver = new Naver(
    c.env.KAKAO_CLIENT_ID,
    c.env.KAKAO_CLIENT_SECRET,
    c.env.KAKAO_REDIRECT_URI
  );

  const state = generateState();
  const url = await naver.createAuthorizationURL(state);

  setCookie(c, "naver_oauth_state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "Lax",
  });
  // console.log(url);

  return c.redirect(url.toString());
});
```

위와 같이 쉽게 구현할 수 있으면 좋으련만 arctic 패키지가 Naver를 지원하지 않아서 수작업으로 해야합니다.

먼저, NAVER_CLIENT_ID, NAVER_CLIENT_SECRET, NAVER_REDIRECT_URI를 설정해야 합니다.

[네이버 개발자 센터 애플리케이션 대시보드](https://developers.naver.com/apps/)로 가서 아래와 같이 수정합시다.

기존에 만들었던 앱이 아래와 같이 보일겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiTfYCXFrhY97u8l08w0neGH2q_Mv0Sw-BzPui4n5sdmPvD8HGx7d9SJuS7pKHrGrkyvgFQOaoIkdzq7mQ6eimeH4hhDXA0wiimdqU5i84QXBPHEOtePfQwnD0q3OD3OmtaBBQvOSNGuhDasAjqzfFJm7f0VZhBIfR7PwYI6AJ019HEi1v10p5SXPbR8Jo)

NAVER_CLIENT_ID, NAVER_CLIENT_SECRET는 위 그림에서 구할 수 있습니다.

NAVER_REDIRECT_URI는 아래와 같이 다시 세팅해야 합니다.

메뉴에서 "API 설정"을 클릭 후 화면을 내리면 중간에 아래와 같이 Callback URL을 추가하는 부분이 나옵니다.

`http://localhost:5173/admin/login/naver/callback`

위와 같이 설정하고 맨 밑에 있는 "수정" 버튼을 꼭 눌러주시기 바랍니다.

지금까지 구한 API 설정값을 각각 wrangler.toml 파일과, .dev.vars 파일에 넣으면 됩니다.

```toml
[vars]
GITHUB_CLIENT_ID="I~~~~~~~~~~~~~`9e8"
KAKAO_CLIENT_ID="8~~~~~~~~~~~~~~~~``69"
KAKAO_REDIRECT_URI="http://localhost:5173/admin/login/kakao/callback"
NAVER_CLIENT_ID="D~~~~~~~~~~~~~~~~S"
NAVER_REDIRECT_URI="http://localhost:5173/admin/login/naver/callback"
```

`.dev.vars 파일`
```sh
GITHUB_CLIENT_SECRET=92b~~~~~~~~~~~~~~~~~321
KAKAO_CLIENT_SECRET=qU~~~~~~~~~~~~~~~~~~qF9
NAVER_CLIENT_SECRET=l~~~~~~~~~~~~~2Ch
```

이제 admin.tsx 파일의 맨 윗부분에 Bindings 부분을 아래와 같이 추가합시다.

```ts
type Bindings = {
  DB: D1Database;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  KAKAO_CLIENT_ID: string;
  KAKAO_CLIENT_SECRET: string;
  KAKAO_REDIRECT_URI: string;
  NAVER_CLIENT_ID: string;
  NAVER_CLIENT_SECRET: string;
  NAVER_REDIRECT_URI: string;
};
```

---

## Naver Auth Endpoint 구현하기

기존에 수작업으로 했던 코드를 가져와서 현재 상황에 맞게 고치면 됩니다.

```ts
admin.get("/login/naver", async (c) => {
  const AUTH_ENDPOINT = "https://nid.naver.com/oauth2.0/authorize";

  const state = generateState();

  const params = {
    client_id: c.env.NAVER_CLIENT_ID,
    response_type: "code",
    redirect_uri: c.env.NAVER_REDIRECT_URI,
    state: state,
  };

  setCookie(c, "naver_oauth_state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "Lax",
  });

  return c.redirect(`${AUTH_ENDPOINT}?${new URLSearchParams(params)}`);
});
```

위 코드를 보시면 네이버 AUTH_ENDPOINT를 위와 같이 지정했고, params을 OAuth 2.0에 맞게 지정했습니다.

그리고 state 값은 arctic에서 제공하는 generateState() 함수를 이용했습니다.

그리고 "naver_oauth_state" 값을 쿠키값으로 저장시켜 놓았습니다.

마지막으로 해당 네이버 AUTH_ENDPOINT로 우리가 만든 params 값을 URLSearchParams 객체로 구현하여 최종적으로 redirect 시키면 되는겁니다.

이제 앱을 실행시켜야 하는데, UI 부분에서 Naver 로그인 부분을 추가시킵시다.

```ts
admin.get("/login", (c) => {
  const user = c.get("user");
  if (!user) {
    return c.render(
      <>
        <a href="/admin/login/github">GitHub ID Login</a>
        <br />
        <a href="/admin/login/kakao">Kakao ID Login</a>
        <br />
        <a href="/admin/login/naver">Naver ID Login</a>
      </>
    );
  }

  return c.redirect("/admin");
});
```

위와 같이 A 태그를 추가했습니다.

개발 서버를 돌려보고 "/admin/login" 주소로 이동하면 아래와 같이 보일겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjX35oe2hi2ngpJzu57XLh8ly5IbFvNnu2scPQmfrseeHB_XVddHSNqp3joi5qkU3MjMMZsO6sikIN1_HmHrw8xdh0WhbU5d9zrgysFIRgPiviM_2aIy2GyXDlxW8HdEOIhM_mu6IOPUI6EA8w4sKGOuA-r4gEn8hlIrHULvQVasHhaZgFYyu4_H3AYcJc)

이제 "Naver ID Login"을 클릭하면 아래 그림과 같이 익숙한 네이버 로그인 화면이 나올겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEj5etqM7rkQXzKfPY8ofO6d9ae_Hh0pyArzwGzK_x_-SIqESRnIBNoPFOh-0R0jiZ0iWe3Kp3npuYPRCrV-7XDbEcM0TxUQK9XBbT-5b4wU6qau_LCGRO-w7UOkWdWWVP_sRI1Eb2ja1YKB9iOxmP1shL2pc63zGYGBbvLs42wcNuTv__5Ae7Pqt-lRjh0)

위 화면에서 네이버에 로그인하면 아래와 같이 브라우저에 "404 Not Found"에러가 뜰건데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhhBfMHFAL2grW_c6-JBtJvFgn7UCAt_dWdBYSI0Mq30Tsm70xtXUTDPe9A3uIjwH4446dc6QjnAohbFGej8PjmnPX2yhyWn6JaR9uGjxf_YfknxSqUP9eqz0MBhO8fja6j1tuBRAtd63SHD_KoDMClb5uuX7Dk6rex2kc7535X-jvQZEjZFbI2UaSWbeE)

이제는 이 화면이 에러 화면이 아니구나 판단되실 겁니다.

브라우저 주소에 콜백주소가 알맞게 세팅되어 있고, 'code', 'state'값이 제대로 리턴되어 있으니 말이죠.

이제 콜백 라우팅을 구현해야 합니다.

'/admin/login/naver/callback' 라우팅을 구현해야 합니다.

예전에 썼던 코드에서 참고할 거는 액세스 토큰을 가져오는 것과, User Info(유저 정보)를 가져오는 것 두개를 참고하면 됩니다.

```ts
interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  refresh_token?: string;
}

admin.get(
  "/login/naver/callback",
  zValidator(
    "query",
    z.object({
      code: z.string(),
      state: z.string(),
    })
  ),
  async (c) => {
    const TOKEN_ENDPOINT = "https://nid.naver.com/oauth2.0/token";

    const db = drizzle(c.env.DB);
    const lucia = initializeLucia(c.env.DB);

    const { code, state } = c.req.valid("query");
    const storedState = getCookie(c).naver_oauth_state ?? null;

    if (!code || !state || !storedState || state !== storedState) {
      return c.json({ error: "code, state 값이 틀립니다." }, 400);
    }

    const params = {
      client_id: c.env.NAVER_CLIENT_ID,
      client_secret: c.env.NAVER_CLIENT_SECRET,
      grant_type: "authorization_code",
      code: code,
      redirect_uri: c.env.NAVER_REDIRECT_URI,
      state: state,
    };

    try {
      const response: any = await fetch(TOKEN_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(params),
      });

      if (!response.ok) {
        const errorResponse: any = await response.json();
        return c.json(errorResponse, response.status);
      }

      const data: TokenResponse = await response.json();
      const access_token = data.access_token;
    //   console.log(`ACCESS_TOKEN is : ${access_token}`);

      const userInfoResponse: any = await fetch(
        "https://openapi.naver.com/v1/nid/me",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      if (!userInfoResponse.ok) {
        const errorResponse = await userInfoResponse.json();
        return c.json(errorResponse, userInfoResponse.status);
      }

      const userInfoResponseJSON: any = await userInfoResponse.json();
      const userInfo = userInfoResponseJSON.response;
    //   console.log(userInfo); // 사용자 정보 출력

      const returned_oauth_id = userInfo.id;
      const returned_username = userInfo.nickname;
      const returned_profile_image = userInfo.profile_image;

    //   console.log(returned_oauth_id);
    //   console.log(returned_username);
    //   console.log(returned_profile_image);

      const existingUser: SelectUser[] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.oauth_id, returned_oauth_id));
      // console.log("existingUser...");
      // console.log(existingUser);

      if (existingUser.length !== 0) {
        // console.log("print Session....");
        const session = await lucia.createSession(existingUser[0].id, {});
        // console.log(session);

        c.header(
          "Set-Cookie",
          lucia.createSessionCookie(session.id).serialize(),
          { append: true }
        );

        return c.redirect("/admin");
      }

      const user = await db
        .insert(usersTable)
        .values({
          oauth_id: returned_oauth_id,
          username: returned_username,
          profile_image: returned_profile_image,
        })
        .returning();

      const session = await lucia.createSession(user[0].id, {});

      c.header(
        "Set-Cookie",
        lucia.createSessionCookie(session.id).serialize(),
        { append: true }
      );

      return c.redirect("/admin");
    } catch (e) {
      if (
        e instanceof OAuth2RequestError &&
        e.message === "bad_verification_code"
      ) {
        // invalid code
        return c.body(null, 400);
      }
      return c.body(null, 500);
    }
  }
);
```

이제 다시 개발 서버에서 네이버 로그인을 해보면 잘 될겁니다.

아래와 같이 로그인 됐다고 나오네요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiLaCdpqsMgTgawvzw3jYpbLpnBcP78TZWl4rRXE6MCazfZfWZ0CZ9D9nBRMoGl5IaMZwBmJBOLUJ1ryWpuvsZv5fkI9WzCpqW8GJgb42dzXhLKZL3wO7u9iTYP80BjSpXFWPoyaAWPFZiO6f7u6d924Jhl0nKBjvPpGPaYJxRjtBgVSXFgPA_u0fj1pR8)

그리고 크롬 개발창의 애플리케이션 부분으로 가면 아래와 같이 세션 쿠키와 naver_oauth_state 쿠키값이 잘 저장되어 있을 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjwwS4G4ezJb1QlwvFhj5IrS5MOJ0-WVXFIfF5bH_azyAn2pLUEefIqwf6-8_-tCHTSNzp2zErKBi50baACKKlZ9txGMibFdPj8-1EsJ4KuUc3vDbvkILDo0aMplJVBWiBubABpZzYyT1ff_OD2VcYybEzbAM7g-fcykoZg-QvMAFnJLwJtAjXc5hEkqXE)

로그아웃도 기존과 동일해서 그냥 버튼을 눌러도 로그아웃이 작동될겁니다.

지금까지의 전체 코드를 길게 아래와 같이 보여드리겠습니다.

'admin.tsx' 파일입니다.

```ts
import { Hono } from "hono";
import { renderer } from "./renderer";
import { Session, User } from "lucia";
import { csrf } from "hono/csrf";
import { generateState, GitHub, Kakao, OAuth2RequestError } from "arctic";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { drizzle } from "drizzle-orm/d1";
import { SelectUser, usersTable } from "./db/schema";
import { eq } from "drizzle-orm";
import { initializeLucia } from "./db/lucia";
import { authMiddleware } from "./middleware";

type Bindings = {
  DB: D1Database;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  KAKAO_CLIENT_ID: string;
  KAKAO_CLIENT_SECRET: string;
  KAKAO_REDIRECT_URI: string;
  NAVER_CLIENT_ID: string;
  NAVER_CLIENT_SECRET: string;
  NAVER_REDIRECT_URI: string;
};

type Variables = {
  user: User | null;
  session: Session | null;
};

interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  refresh_token?: string;
}

const admin = new Hono<{ Bindings: Bindings; Variables: Variables }>();

admin.use(csrf());

admin.use(renderer);

admin.use("*", authMiddleware);

admin.get("/", (c) => {
  const user = c.get("user");
  if (user) {
    return c.render(
      <>
        <h1>You are logged in as {user.id}</h1>
        <form method="POST" action="/admin/logout">
          <button type="submit">logout</button>
        </form>
      </>
    );
  }

  return c.render(
    <>
      <h1>This is Admin Page!</h1>
      <br />
      <a href="/admin/login">Go to Login</a>
    </>
  );
});

admin.post("/logout", async (c) => {
  const lucia = initializeLucia(c.env.DB);

  const session = c.get("session");
  if (session) {
    await lucia.invalidateSession(session.id);
  }

  const cookie = lucia.createBlankSessionCookie();

  c.header("Set-Cookie", cookie.serialize(), { append: true });

  deleteCookie(c, "github_oauth_state");

  return c.redirect("/admin");
});

admin.get("/login", (c) => {
  const user = c.get("user");
  if (!user) {
    return c.render(
      <>
        <a href="/admin/login/github">GitHub ID Login</a>
        <br />
        <a href="/admin/login/kakao">Kakao ID Login</a>
        <br />
        <a href="/admin/login/naver">Naver ID Login</a>
      </>
    );
  }

  return c.redirect("/admin");
});

admin.get("/login/github", async (c) => {
  const github = new GitHub(c.env.GITHUB_CLIENT_ID, c.env.GITHUB_CLIENT_SECRET);

  const state = generateState();
  const url = await github.createAuthorizationURL(state);

  setCookie(c, "github_oauth_state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "Lax",
  });
  // console.log(url);

  return c.redirect(url.toString());
});

admin.get("/login/kakao", async (c) => {
  const kakao = new Kakao(
    c.env.KAKAO_CLIENT_ID,
    c.env.KAKAO_CLIENT_SECRET,
    c.env.KAKAO_REDIRECT_URI
  );

  const state = generateState();
  const url = await kakao.createAuthorizationURL(state);

  setCookie(c, "kakao_oauth_state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "Lax",
  });
  // console.log(url);

  return c.redirect(url.toString());
});

admin.get("/login/naver", async (c) => {
  const AUTH_ENDPOINT = "https://nid.naver.com/oauth2.0/authorize";

  const state = generateState();

  const params = {
    client_id: c.env.NAVER_CLIENT_ID,
    response_type: "code",
    redirect_uri: c.env.NAVER_REDIRECT_URI,
    state: state,
  };

  setCookie(c, "naver_oauth_state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "Lax",
  });

  return c.redirect(`${AUTH_ENDPOINT}?${new URLSearchParams(params)}`);
});

admin.get(
  "/login/github/callback",
  zValidator(
    "query",
    z.object({
      code: z.string(),
      state: z.string(),
    })
  ),
  async (c) => {
    const github = new GitHub(
      c.env.GITHUB_CLIENT_ID,
      c.env.GITHUB_CLIENT_SECRET
    );

    const db = drizzle(c.env.DB);
    const lucia = initializeLucia(c.env.DB);

    const { code, state } = c.req.valid("query");
    const storedState = getCookie(c).github_oauth_state ?? null;

    if (!code || !state || !storedState || state !== storedState) {
      return c.body(null, 400);
    }

    try {
      const tokens = await github.validateAuthorizationCode(code);
      // console.log(tokens);

      const githubUserResponse = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      });
      const githubUser: any = await githubUserResponse.json();
      const returned_oauth_id = githubUser.id.toString();
      const returned_username = githubUser.login;
      const returned_profile_image = githubUser.avatar_url;

      const existingUser: SelectUser[] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.oauth_id, returned_oauth_id));
      // console.log("existingUser...");
      // console.log(existingUser);

      if (existingUser.length !== 0) {
        // console.log("print Session....");
        const session = await lucia.createSession(existingUser[0].id, {});
        // console.log(session);

        c.header(
          "Set-Cookie",
          lucia.createSessionCookie(session.id).serialize(),
          { append: true }
        );

        return c.redirect("/admin");
      }

      const user = await db
        .insert(usersTable)
        .values({
          oauth_id: returned_oauth_id,
          username: returned_username,
          profile_image: returned_profile_image,
        })
        .returning();

      // console.log("after insert");
      // console.log(user);

      const session = await lucia.createSession(user[0].id, {});

      c.header(
        "Set-Cookie",
        lucia.createSessionCookie(session.id).serialize(),
        { append: true }
      );

      return c.redirect("/admin");
    } catch (e) {
      if (
        e instanceof OAuth2RequestError &&
        e.message === "bad_verification_code"
      ) {
        // invalid code
        return c.body(null, 400);
      }
      return c.body(null, 500);
    }
  }
);

admin.get(
  "/login/kakao/callback",
  zValidator(
    "query",
    z.object({
      code: z.string(),
      state: z.string(),
    })
  ),
  async (c) => {
    const kakao = new Kakao(
      c.env.KAKAO_CLIENT_ID,
      c.env.KAKAO_CLIENT_SECRET,
      c.env.KAKAO_REDIRECT_URI
    );

    const db = drizzle(c.env.DB);
    const lucia = initializeLucia(c.env.DB);

    const { code, state } = c.req.valid("query");
    const storedState = getCookie(c).kakao_oauth_state ?? null;

    if (!code || !state || !storedState || state !== storedState) {
      return c.body(null, 400);
    }

    try {
      const tokens = await kakao.validateAuthorizationCode(code);
      // console.log(tokens);

      const kakaoUserResponse = await fetch(
        "https://kapi.kakao.com/v2/user/me",
        {
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        }
      );
      const kakaoUser: any = await kakaoUserResponse.json();

      //kakaoUser.id가 number라서 toString()으로 string 타입으로 변경해야 함.
      const returned_oauth_id = kakaoUser.id.toString();
      const returned_username = kakaoUser.properties.nickname;
      const returned_profile_image = kakaoUser.properties.profile_image;

      // console.log(returned_oauth_id);
      // console.log(returned_username);
      // console.log(returned_profile_image);

      const existingUser: SelectUser[] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.oauth_id, returned_oauth_id));
      // console.log("existingUser...");
      // console.log(existingUser);

      if (existingUser.length !== 0) {
        // console.log("print Session....");
        const session = await lucia.createSession(existingUser[0].id, {});
        // console.log(session);

        c.header(
          "Set-Cookie",
          lucia.createSessionCookie(session.id).serialize(),
          { append: true }
        );

        return c.redirect("/admin");
      }

      const user = await db
        .insert(usersTable)
        .values({
          oauth_id: returned_oauth_id,
          username: returned_username,
          profile_image: returned_profile_image,
        })
        .returning();

      const session = await lucia.createSession(user[0].id, {});

      c.header(
        "Set-Cookie",
        lucia.createSessionCookie(session.id).serialize(),
        { append: true }
      );

      return c.redirect("/admin");
    } catch (e) {
      if (
        e instanceof OAuth2RequestError &&
        e.message === "bad_verification_code"
      ) {
        // invalid code
        return c.body(null, 400);
      }
      return c.body(null, 500);
    }
  }
);

admin.get(
  "/login/naver/callback",
  zValidator(
    "query",
    z.object({
      code: z.string(),
      state: z.string(),
    })
  ),
  async (c) => {
    const TOKEN_ENDPOINT = "https://nid.naver.com/oauth2.0/token";

    const db = drizzle(c.env.DB);
    const lucia = initializeLucia(c.env.DB);

    const { code, state } = c.req.valid("query");
    const storedState = getCookie(c).naver_oauth_state ?? null;

    if (!code || !state || !storedState || state !== storedState) {
      return c.json({ error: "code, state 값이 틀립니다." }, 400);
    }

    const params = {
      client_id: c.env.NAVER_CLIENT_ID,
      client_secret: c.env.NAVER_CLIENT_SECRET,
      grant_type: "authorization_code",
      code: code,
      redirect_uri: c.env.NAVER_REDIRECT_URI,
      state: state,
    };

    try {
      const response: any = await fetch(TOKEN_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(params),
      });

      if (!response.ok) {
        const errorResponse: any = await response.json();
        return c.json(errorResponse, response.status);
      }

      const data: TokenResponse = await response.json();
      const access_token = data.access_token;
      // console.log(`ACCESS_TOKEN is : ${access_token}`);

      const userInfoResponse: any = await fetch(
        "https://openapi.naver.com/v1/nid/me",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      if (!userInfoResponse.ok) {
        const errorResponse = await userInfoResponse.json();
        return c.json(errorResponse, userInfoResponse.status);
      }

      const userInfoResponseJSON: any = await userInfoResponse.json();
      const userInfo = userInfoResponseJSON.response;
      // console.log(userInfo); // 사용자 정보 출력

      const returned_oauth_id = userInfo.id;
      const returned_username = userInfo.nickname;
      const returned_profile_image = userInfo.profile_image;

      // console.log(returned_oauth_id);
      // console.log(returned_username);
      // console.log(returned_profile_image);

      const existingUser: SelectUser[] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.oauth_id, returned_oauth_id));
      // console.log("existingUser...");
      // console.log(existingUser);

      if (existingUser.length !== 0) {
        // console.log("print Session....");
        const session = await lucia.createSession(existingUser[0].id, {});
        // console.log(session);

        c.header(
          "Set-Cookie",
          lucia.createSessionCookie(session.id).serialize(),
          { append: true }
        );

        return c.redirect("/admin");
      }

      const user = await db
        .insert(usersTable)
        .values({
          oauth_id: returned_oauth_id,
          username: returned_username,
          profile_image: returned_profile_image,
        })
        .returning();

      const session = await lucia.createSession(user[0].id, {});

      c.header(
        "Set-Cookie",
        lucia.createSessionCookie(session.id).serialize(),
        { append: true }
      );

      return c.redirect("/admin");
    } catch (e) {
      if (
        e instanceof OAuth2RequestError &&
        e.message === "bad_verification_code"
      ) {
        // invalid code
        return c.body(null, 400);
      }
      return c.body(null, 500);
    }
  }
);

export default admin;
```
