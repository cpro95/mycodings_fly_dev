---
slug: 2024-08-03-cloudflare-hono-lucia-auth-drizzle-kakao-login
title: Hono, Lucia Auth를 이용해서 Kakao ID로 로그인 구현하기
date: 2024-08-03 11:44:49.359000+00:00
summary: Lucia Auth와 arctic 패키지를 이용해서 Kakao ID 로그인을 구현해 봤습니다.
tags: ["Cloudflare", "Hono", "Lucia", "Drizzle orm", "D1 DB", "Kakao ID Login"]
contributors: []
draft: false
---

안녕하세요?

지난 시간에 Lucia Auth, arctic 패키지로 Hono에서 Github ID로 로그인후 세션 유지하는 방법에 대해 배웠는데요.

먼저, 지난 시간 강의 링크입니다.

- [Cloudflare, Hono에서 OAuth를 이용해서 네이버 아이디로 Login 구현해 보기](https://mycodings.fly.dev/blog/2024-07-24-cloudflare-hono-oauth-naver-login)

- [Cloudflare에서 Hono와 Google OAuth를 이용해서 Login 구현해 보기](https://mycodings.fly.dev/blog/2024-07-21-cloudflare-hono-google-login)

- [Cloudflare, Hono, OAuth, Kakao Login(카카오 로그인)](https://mycodings.fly.dev/blog/2024-07-27-cloudflare-hono-oauth-kakao-login)

- [Cloudflare, D1 DB, Hono, Lucia, Drizzle ORM을 이용한 유저 로그인 구현](https://mycodings.fly.dev/blog/2024-08-01-cloudflare-hono-d-1-lucia-drizzle-login)

- [Cloudflare, Hono에서 Lucia Auth를 이용해서 GitHub ID로 로그인 구현하기](https://mycodings.fly.dev/blog/2024-08-03-cloudflare-hono-lucia-github-id-login-with-d-1-db)

---

오늘은 arctic에서 제공하는 카카오 로그인을 이용해서 카카오 아이디 로그인도 시도해 볼 예정입니다.

[arctic 홈페이지](https://arctic.js.org/)

위 홈페이지로 가시면 왼쪽에 Kakao가 보입니다.

Naver는 안보이고 Line은 보이네요.

Kakao 로그인 코드는 아래와 같습니다.
```ts
// Kakao
// For usage, see OAuth 2.0 provider.

import { Kakao } from "arctic";

const kakao = new Kakao(clientId, clientSecret, redirectURI);
const url: URL = await kakao.createAuthorizationURL(state, {
	// optional
	scopes
});

const tokens: KakaoTokens = await kakao.validateAuthorizationCode(code);

const tokens: KakaoTokens = await kakao.refreshAccessToken(refreshToken);
```

토큰은 두개가 보이는데요.

첫 번째가 액세스 토큰이고, 두 번째가 리플레시 토큰입니다.

액세스 토큰만 있어도 유저 정보를 얻을 수 있습니다.

그리고, 유저 정보를 얻는 코드는 아래와 같습니다.

```ts
// Get user profile
// Use the /user/me endpoint.

const tokens = await kakao.validateAuthorizationCode(code);
const response = await fetch("https://kapi.kakao.com/v2/user/me", {
	headers: {
		Authorization: `Bearer ${tokens.accessToken}`
	}
});
const user = await response.json();
```

[예전 강의](https://mycodings.fly.dev/blog/2024-07-27-cloudflare-hono-oauth-kakao-login)를 보시면 카카오가 리턴하는 유저 정보는 아래와 같이 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiFW_MKVSmbLJP8FXMqNnEzaXBqNpoweRIKO3brYdhCmYfA-oO2qVu0rJx1KsZ0hDE-xxW0eN7Orf2TDFqeP9I9wDprOSFLFEWmXC1QjiPfGAKgalby50f0f9vwMrd7CzwzFH7CG4MF_8gfPldRXa2n09lIQt1wtqvXUgph1N1r49cBjArYM5UCZIXFc8A)

위 그림에서 우리가 얻을 수 있는거는 id와 properties.nickname, 그리고 여유가 되면 properties.profile_image가 되겠네요.

이전 시간에 사용했던 코드를 재사용하도록 DB 스키마를 조정해야겠습니다.

기존에 사용했던 DB의 스키마는 아래와 같은데요.

```ts
import { InferSelectModel } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { generateId } from "lucia";

export const usersTable = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => generateId(15)),
  github_id: text("github_id").notNull().unique(),
  username: text("username").notNull(),
});

export type SelectUser = InferSelectModel<typeof usersTable>;

export const sessionsTable = sqliteTable("sessions", {
  id: text("id").primaryKey().notNull(),
  user_id: text("user_id")
    .notNull()
    .references(() => usersTable.id),
  expires_at: integer("expires_at").notNull(),
});

export type MySessionsType = InferSelectModel<typeof sessionsTable>;
```

usersTable을 조금 바꿔야겠습니다.

username에다는 nickname을 넣으면 되고, id를 넣는 github_id를 이름을 좀 더 범용 이름으로 바꿔야 겠습니다.

그리고, profile_image도 넣어야 겠네요.

참고로 구글 아이디로 로그인시 유저 정보는 아래와 같이 나옵니다.

```sh
{
  id: '1105846834656',
  name: 'M~~~~~m',
  given_name: 'M~~~~~~~~~~',
  family_name: '~~~~',
  picture: 'https://lh3.googleusercontent.com/a/ACg8ocJchdcIu6QL8IWodm0_sYiMsU55E_a9O4g=s96-c'
}
```

구글 유저 정보도 우리가 필요한 id, name, picture가 있네요.

결론적으로 profile_image 항목을 추가하고, github_id란 이름을 범용 id 이름으로 바꿔야겠습니다.

다시 스키마 파일을 아래와 같이 수정합시다.

```ts
import { InferSelectModel } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { generateId } from "lucia";

export const usersTable = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => generateId(15)),
  oauth_id: text("oauth_id").notNull().unique(),
  username: text("username").notNull(),
  profile_image: text("profile_image"),
});

export type SelectUser = InferSelectModel<typeof usersTable>;

export const sessionsTable = sqliteTable("sessions", {
  id: text("id").primaryKey().notNull(),
  user_id: text("user_id")
    .notNull()
    .references(() => usersTable.id),
  expires_at: integer("expires_at").notNull(),
});

export type MySessionsType = InferSelectModel<typeof sessionsTable>;
```

위와 같이 기존 github_id를 oauth_id로 바꿨습니다.

그리고 profile_image항목도 추가했습니다.

이제 lucia.ts 파일을 열어 아래와 같이 수정합시다.

```ts
import { D1Adapter } from "@lucia-auth/adapter-sqlite";
import { Lucia } from "lucia";
import { SelectUser } from "./schema";

export function initializeLucia(D1: D1Database) {
  const adapter = new D1Adapter(D1, {
    user: "users",
    session: "sessions",
  });

  return new Lucia(adapter, {
    sessionCookie: {
      attributes: {
        secure: process.env.NODE_ENV === "production",
      },
    },
    getUserAttributes: (attributes) => {
      return {
        oauth_id: attributes.oauth_id,
        username: attributes.username,
        profile_image: attributes.profile_image,
      };
    },
  });
}

declare module "lucia" {
  interface Register {
    Lucia: ReturnType<typeof initializeLucia>;
    DatabaseUserAttributes: Omit<SelectUser, "id">;
  }
}
```

getUserAttributes에 oauth_id, profile_image 항목을 추가했습니다.

이제, Drizzle ORM을 이용해서 바뀐 스키마를 D1 DB에 반영시켜야 하는데요.

drizzle-kit로 sql 파일을 만들어야 합니다.

```sh
➜  npx drizzle-kit generate
No config path provided, using default 'drizzle.config.ts'
Reading config file '/Users/cpro95/Codings/Javascript/hono/bun-hono-cloudflare-d1-drizzle-lucia-github-oauth-test/drizzle.config.ts'

~ github_id › oauth_id column will be renamed

+ profile_image column will be created
--- all columns conflicts in users table resolved ---

2 tables
sessions 3 columns 0 indexes 1 fks
users 4 columns 1 indexes 0 fks

[✓] Your SQL migration file ➜ drizzle/0001_fancy_leo.sql 🚀
```

위와 같이 실행하면 github_id를 oauth_id로 바꿀것인지, 아니면 새로운 항목을 추가할 것인지 고르라고 나옵니다.

바꿔야하기 때문에 화살표 키로 해당 항목을 고르고 엔터키를 누르고, 그 다음 profile_image는 바꾸는게 없고 새로 만드는 거라서 그냥 엔터키만 누르면 됩니다.

이제 새로운 sql 파일이 생겼네요.

이걸 열어 보겠습니다.

```sql
ALTER TABLE `users` RENAME COLUMN `github_id` TO `oauth_id`;--> statement-breakpoint
DROP INDEX IF EXISTS `users_github_id_unique`;--> statement-breakpoint
ALTER TABLE `users` ADD `profile_image` text;--> statement-breakpoint
CREATE UNIQUE INDEX `users_oauth_id_unique` ON `users` (`oauth_id`);
```

기존 sql을 ALTER 즉 변경하는 sql 코드입니다.

이제 migrate 해야 하는데요.

```sh
npx wrangler d1 execute hono-lucia-test-db2 --local --file=./drizzle/0001_fancy_leo.sql

npx wrangler d1 execute hono-lucia-test-db2 --remote --file=./drizzle/0001_fancy_leo.sql
```

위와 같이 local과 remote 모두 DB 세팅을 업데이트하면 됩니다.

```sh
id	            oauth_id	username	profile_image
t94033dzu3569i0	 5~~~26	 ~~~	    NULL
```

위와 같이 DB에 잘 저장되었네요.

리모트에도 업데이트 하면 Cloudflare 대시보드에 가도 잘 되었을 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEh7ZJhLvWtUzyz4vPMrSkBrRK38Qir1zA1PUMPV8Mu9133G-QKahP53SKpYnmHykw0q_DA-GJFmTkA3_djZd7tS83YfaIetO2u9Rbjge8eE7nwFmSe4TVaKyLpPsSk5IpIBZgcIJhguqhxLuOnDB-N61BGebW_ybi2fmZbcPeFEwKFYOylmlecZYD3fF8Q)

---

## 카카오 디벨로퍼에서 REDIRECT_URI 설정하기

카카오 디벨로퍼로 들어가서 예전에 REDIRECT_URI를 `http://localhost:5173/callback`이라고 설정한 부분이 있을 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEilqwHOO8EsHSkw7ocu8xvy4o8h14mN80QDQSFxHhRlN33MHVNf0buFAn5HZ07HkQcUyThBuWAk8FNW4D8dppcOQBLgwMgbyAgVjvgAS5J9lIjdTPG-MyzW1TEjVwL9F6lhCCinvBuGfeBecakjQN4tWLGOV5yCaK0i1XR3dWyZULro_N7bs7F0fwkpIzU)

위 콜백 주소를 아래와 같이 바꿉시다.

`http://localhost:5173/admin/login/kakao/callback`

![](https://blogger.googleusercontent.com/img/a/AVvXsEhDhR1IPVxhpwzJXkzb-F0BYQsNqmuOGPr-gos1VErJelDpkk9nZftg7eeJA2PTwHSJCiHBBGU7a-a-h9CY6vRXXh1-WEgAv2VBY6ExmMUmfvqpQyeTkdRiXkKpuV_Q4RvB1iWNbrLP22GkgUlkUcbBqa19Ge7MBWSd-q0ZhyDqwHVtIrgo1-wS7nPjzZ4)

지난 시간에 썼던 github 콜백 주소와 비슷하게 만들었습니다.

## admin.tsx 파일 고치기

이제 준비가 끝났기 때문에 admin.tsx 파일을 고쳐야합니다.

고칠 곳은 "/login" 라우팅입니다.

GitHub ID 로그인 기능도 살리고 추가로 카카오 아이디 로그인 기능을 추가하는 거라 login 라우팅에 아래와 같이 카카오 로그인하는 링크를 추가할 겁니다.

```ts
admin.get("/login", (c) => {
  const user = c.get("user");
  if (!user) {
    return c.render(
      <>
        <a href="/admin/login/github">GitHub ID Login</a>
        <br />
        <a href="/admin/login/kakao">Kakao ID Login</a>
      </>
    );
  }

  return c.redirect("/admin");
});
```

로그인 되어 있으면 "/admin"으로 이동하고 아니면 로그인 방법을 고르면 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgJzGE4R0TIXQJ99BvtMUc-iW93hP8imXYCKlY6DgS-BYiz14txf1wFHbF6iw1mutPd8rnn7qVGhBF5tF5jqJemiJF1taJpNhbi4tvTt0PWgkafI6tJbjVDCRYtHQUOnxq_nbKk5rC1WPEIXbJv5gblRYlcKgPIJFgZLfjvhzeUH5izim7SItX6zypM9dE)

UI는 나중에 TailwindCSS로 다음으면 되니까 먼저, 로직에만 집중할 예정입니다.

이제, "/admin/login/kakao" 라우팅을 만들어야 하는데요.

"/admin/login/github" 라우팅을 복사해서 일부 바꾸면 됩니다.

그전에 CLIENT_ID와 CLIENT_SECRET를 저장해야 합니다.

앞에 KAKAO_를 붙혀서 저장하겠습니다.

먼저, wrangler.toml 파일에 아래와 같이 추가합시다.

```toml
[vars]
GITHUB_CLIENT_ID="Iv~~~~~~~~~Vf9e8"
KAKAO_CLIENT_ID="8a5b579~~~~~~~~969"
KAKAO_REDIRECT_URI="http://localhost:5173/admin/login/kakao/callback"
```

그리고 `.dev.vars` 파일에 SECRET를 넣어주면 됩니다.

```sh
GITHUB_CLIENT_SECRET=92be6~~~~~~~~~~5af5e321
KAKAO_CLIENT_SECRET=q~~~~~~~~~~~~~~~~4qF9
```

이제 "/admin/login/kakao" 라우팅을 추가하겠습니다.

먼저, admin.tsx 파일 첫 부분에 있는 바인딩에 카카오 관련 문구를 추가합시다.

```ts
type Bindings = {
  DB: D1Database;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  KAKAO_CLIENT_ID: string;
  KAKAO_CLIENT_SECRET: string;
  KAKAO_REDIRECT_URI: string;
};
```

```ts
import { generateState, GitHub, Kakao, OAuth2RequestError } from "arctic";

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
  console.log(url);

  return c.redirect(url.toString());
});
```

예전 github 코드와 비슷합니다.

arctic 패키지에서 Kakao 함수를 import 하면 되는거죠.

이제 카카오 로그인 링크를 타면 아래와 같이 카카오 로그인 화면이 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEi0uHY-rASFtAdAUAF_jniVDUX5ZuRfItjk_0T8xfFriNR1wwBOlENNIqpUPtQ3NDD5B4dyzHBHY1gjhObJDrMwxPs9zDbPa6zcxHtjx6uGyQNG55KOV40V0-j1Grt3a-wqszfIoocvoiZ-da2k1Z5OggzyPdpeUTdHxEBgv7duUneVX8OPPsYQ5fDXkJI)

그리고 콘솔차에는 url이 출력될겁니다.

이제까지는 문제없이 잘 진행되고 있네요.

console.log(url) 부분은 주석처리해도 되겠네요.

카카오 로그인을 하면 카카오 로그인 화면은 사라지고 원래 브라우저로 돌아가면서 아래와 같이 404 Not Found가 나옵니다.

이 화면이 나온거면 잘 진행되고 있다는 얘깁니다.

왜냐하면 아래 그림에서 보시면 브라우저의 url 부분에 query 값으로 code 값과 state 값이 있기 때문이죠.

![](https://blogger.googleusercontent.com/img/a/AVvXsEi6CPph6aIY83VeBMe0HbBu6U2r5pE2HnE9gzDWG0MDahRMTqCgQBcUcUgiomz95EVdD7fRpcalUazweQAsdexdru6lYh0s70voBGKDsGUisCEqNZiDEcP7qQn6vI8GgYFjALxztg2uuoXe_ReQ29Sj-nIq-OY7VCLmlTTPE078BA6IrxbBQCrzlQB3OMM)

다시한번 OAuth 복습한다는 의미로 code 값은 액세스 토큰을 얻기 위한 코드입니다.

그리고 state 값은 쿠키 위조 방지를 위해 아까 우리가 만들었던 state 값입니다.

state 값이 현재 브라우저 쿠키에 kakao_oauth_state 값으로 저장되어 있어 위조 방지에 사용될 예정입니다.

이제 콜백 함수의 라우팅을 작성해야겠네요.

---

## kakao callback 라우팅 만들기

Github callback 라우팅을 만들었을 때와 비슷하게 만들면 됩니다.

참고로 이전에 만들었던 Github callback 라우팅 부분에서 github_id 부분을 전부 oauth_id로 바꾸면 됩니다.

참고로 Github 의 유저 정보에서 profile_image는 avatar_url 값이네요.

```ts
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

      const kakaoUserResponse = await fetch("https://kapi.kakao.com/v2/user/me", {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      });
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
```

예전 코드와 로직은 비슷합니다.

실행해 보면 아래 그림과 같이 아주 잘 실행될겁니다.

콘솔창에도 유저 정보가 잘 나오네요.

```sh
3~~~~~~~~37
~~~
http://t1.kakaocdn.net/account_images/default_profile.jpeg.twg.thumb.R640x640
```

제 카카오 아이디 프로파일이 없어 디폴트 프로파일이 나오네요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjoT1RjOrya1EBNqt_Yw9F3uDc5m52Zk56lOqj1ErBRjQxjHfxR3OJHDwByVX0XQFMjjIGLJJ4pqaEzK5r8-gXyvrsyUfdzBKFHizmbaZmC6OfJ1HDSHGNZ0qSHEYoG3A_yNF3NUMpuI-iB-1PA0Gppe2fJ-WgJZPIWAmUF0VYXsRI1fqGhqB_WyByxv_E)

참고로, Github ID 로그인 콜백 함수는 아래와 같습니다.

```ts
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
```


이제 카카오 로그인도 완성되었네요.

로그아웃 버튼을 눌러도 제대로 작동할 겁니다.

다음 시간에는 네이버 아이디 로그인을 시도해 보겠습니다.

그럼.
