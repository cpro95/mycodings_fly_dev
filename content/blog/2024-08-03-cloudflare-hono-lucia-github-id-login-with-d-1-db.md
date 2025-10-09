---
slug: 2024-08-03-cloudflare-hono-lucia-github-id-login-with-d-1-db
title: Cloudflare, Hono에서 Lucia Auth를 이용해서 GitHub ID로 로그인 구현하기
date: 2024-08-03 07:46:28.165000+00:00
summary: Lucia Auth와 arctic 패키지를 이용해서 GitHub ID 로그인을 구현해 봤습니다.
tags: ["Cloudflare", "Hono", "Lucia", "Drizzle orm", "D1 DB", "GitHub ID Login"]
contributors: []
draft: false
---

안녕하세요?

지난 시간에는 Cloudflare 상에서 D1 DB를 이용하여 Hono를 이용해서 유저 로그인을 구현해 봤는데요.

Lucia란 Auth 패키지를 사용했습니다.

이번에는 OAuth를 도전해 볼 생각인데요.

Github ID로 로그인을 시도해 보겠습니다.

당연히 Drizzle ORM을 사용했습니다.

먼저, 지난 시간 강의 링크입니다.

- [Cloudflare, Hono에서 OAuth를 이용해서 네이버 아이디로 Login 구현해 보기](https://mycodings.fly.dev/blog/2024-07-24-cloudflare-hono-oauth-naver-login)

- [Cloudflare에서 Hono와 Google OAuth를 이용해서 Login 구현해 보기](https://mycodings.fly.dev/blog/2024-07-21-cloudflare-hono-google-login)

- [Cloudflare, Hono, OAuth, Kakao Login(카카오 로그인)](https://mycodings.fly.dev/blog/2024-07-27-cloudflare-hono-oauth-kakao-login)

- [Cloudflare, D1 DB, Hono, Lucia, Drizzle ORM을 이용한 유저 로그인 구현](https://mycodings.fly.dev/blog/2024-08-01-cloudflare-hono-d-1-lucia-drizzle-login)

---

## 템플릿 설치

오늘도 Bun을 이용해서 패키지를 구성하겠습니다.

```sh
bunx create-hono lucia-github-oauth-test
```

관련 패키지도 설치하겠습니다.

```sh
bun add lucia drizzle-orm @lucia-auth/adapter-sqlite arctic
bun add -D drizzle-kit @types/better-sqlite3
```

지난 시간에 비해 늘어난 패키지는 바로 'arctic' 패키지인데요.

Lucia에서 추천하는 OAuth 관련 패키지입니다.

아주 쉽게 여러 OAuth Provider를 제공해 주고 있어 Lucia에 적용하기 쉽습니다.

[Arctic 공식 홈페이지](https://arctic.js.org/)

## D1 DB 만들기

D1 DB를 만들어야 하는 이유가 바로 로그인 했을 경우 세션ID를 서버의 DB에 저장하기 위함입니다.

이 방식이 가장 안전한 로그인 방식인데요.

세션ID를 서버에 저장하지 않고 그냥 쿠키만 클라이언트쪽에 저장한다면 상당히 위함할 수 있습니다.

좀 더 안전한 로그인 체킹 방식은 서버의 세션ID를 불러와서 클라이언트상의 쿠키에 저장된 세션ID와 비교하기 위함이죠.

이제 Wranlger를 이용하여 D1 DB를 만들어야하는데요.

```sh
npx wrangler login
```

위와 같이 Cloudflare에 로그인하면 됩니다.

브라우저에서 Cloudflare에 로그인하면 됩니다.

그리고 아래와 같이 터미널 CLId에서 직접 D1 DB를 만듭니다.

```sh
➜  npx wrangler d1 create hono-lucia-test-db2

 ⛅️ wrangler 3.67.1 (update available 3.68.0)
-------------------------------------------------------

✅ Successfully created DB 'hono-lucia-test-db' in region APAC
Created your new D1 database.

[[d1_databases]]
binding = "DB" # i.e. available in your Worker on env.DB
database_name = "hono-lucia-test-db2"
database_id = "f6b7477f-~~~~-~~~~-~~~~-c~~~~92538"
```

위에서 보시면 database_id 이 값이 아주 중요한데요.

잘 저장해 두시면 됩니다.

혹시 잊어버리더라도 나중에 Cloudflare 대시보드에 가도 쉽게 찾을 수 있습니다.

이제 이 값을 wrangler.toml 파일에 넣어둬야 합니다.

```sh
name = "bun-hono-drizzle-lucia-auth-test"
compatibility_date = "2024-07-28"
pages_build_output_dir = "./dist"

[[d1_databases]]
binding = "DB"
database_name = "hono-lucia-test-db2"
database_id = "f6b7477f-~~~~-~~~~-~~~~-c~~~~92538"
```

이제 1차 준비가 끝났습니다.

## Drizzle로 DB Schema 만들기

Drizzle로 DB Schema(스키마) 파일을 만들어야 하는데요.

먼저, src 폴더에 db라는 폴더를 만들고 그 밑에 schema.ts 파일을 아래와 같이 만듭시다.

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

Github ID를 이용한 로그인에서 우리가 Github 서버에서 가져오려고 하는건 많지 않습니다.

단지 github_id와 username 정도만 가져오려고 합니다.

그래서 usersTable에 그렇게 설정했고요.

그리고 로그인 세션을 저장하기 위해서도 테이블을 만들어야 하는데요.

바로 sessionsTable입니다.

세션 테이블은 간단하게 유저 아이디 정보와 만료 정보만 저장하면 됩니다.

sessionsTable의 유저 아이디 정보인 user_id 컬럼은 레퍼런스를 이용해서 usersTable.id와 연결되어 있는거 볼 수 있을 겁니다.

그리고 Drizzle ORM이 좋은게 테이블의 타입정보를 쉽게 구할 수 있습니다.

InferSelectModel로 아주 쉽게 타입 정보를 구할 수 있습니다.

이제 DB를 위한 스키마 파일이 완성되었습니다.

그러면 drizzle-kit 패키지로 실제 SQL 파일로 만들어야 합니다.

이제 drizzle.config.ts 파일을 만들어야 하는데요.

이걸 만들기 싫으면 그냥 명령어상에 쭉 나열하면 되는데, drizzle-kit에서는 `drizzle.config.ts` 파일을 권고하고 있습니다.

```ts
import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "sqlite",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
});
```

이제 터미널상에서 drizzle-kit으로 SQL 파일을 generate 하겠습니다.

```sh
➜  npx drizzle-kit generate
No config path provided, using default 'drizzle.config.ts'
Reading config file '/Users/22222/Codings/Javascript/hono/bun-hono-cloudflare-d1-drizzle-lucia-github-oauth-test/drizzle.config.ts'
2 tables
sessions 3 columns 0 indexes 1 fks
users 3 columns 1 indexes 0 fks

[✓] Your SQL migration file ➜ drizzle/0000_whole_energizer.sql 🚀
```

실행결과 drizzle 폴더 밑에 sql 파일이 생겼습니다.

한번 열어보겠습니다.

```sql
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`github_id` text NOT NULL,
	`username` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_github_id_unique` ON `users` (`github_id`);
```

Drizzle ORM으로 만들었던 sessions, users 테이블이 만들어졌네요.

이제 이 sql 파일을 이용해서 실제 DB에 migrate(이동) 해야 합니다.

먼저, 개발 서버를 위해 wrangler 로컬 파일쪽에 migrate 하겠습니다.

```sh
➜  npx wrangler d1 execute hono-lucia-test-db2 --local --file=./drizzle/0000_whole_energizer.sql


 ⛅️ wrangler 3.68.0
-------------------

🌀 Executing on local database hono-lucia-test-db2 (a5d0f59b-3b77-43bc-8b35-e942b43b7fa8) from .wrangler/state/v3/d1:
🌀 To execute on your remote database, add a --remote flag to your wrangler command.
```

그리고 Cloudflare 서버에도 migrate 합시다.

'--local' 옵션을 '--remote' 옵션으로 바꿔주면 됩니다.

```sh
➜  npx wrangler d1 execute hono-lucia-test-db2 --remote --file=./drizzle/0000_whole_energizer.sql

 ⛅️ wrangler 3.68.0
-------------------

✔ ⚠️ This process may take some time, during which your D1 database will be unavailable to serve queries.
  Ok to proceed? … yes
🌀 Executing on remote database hono-lucia-test-db2 (a5d0f59b-3b77-43bc-8b35-e942b43b7fa8):
🌀 To execute on your local development database, remove the --remote flag from your wrangler command.
Note: if the execution fails to complete, your DB will return to its original state and you can safely retry.
├ 🌀 Uploading a5d0f59b-3b77-43bc-8b35-e942b43b7fa8.9af0f7850c778e7a.sql
│ 🌀 Uploading complete.
│
🌀 Starting import...
🌀 Processed 3 queries.
🚣 Executed 3 queries in 0.01 seconds (4 rows read, 7 rows written)
   Database is currently at bookmark 00000001-00000000-00004de1-5c27e04842c894ef99ea7ac0926907f2.
┌────────────────────────┬───────────┬──────────────┬────────────────────┐
│ Total queries executed │ Rows read │ Rows written │ Database size (MB) │
├────────────────────────┼───────────┼──────────────┼────────────────────┤
│ 3                      │ 4         │ 7            │ 0.03               │
└────────────────────────┴───────────┴──────────────┴────────────────────┘
```

터미널창에 성공메시지가 뜰겁니다.

Cloudflare 대시보드에 가서 확인해 보면 잘 나와 있을 겁니다.

---

## Lucia 설정

Lucia Auth를 이용하려면 Lucia를 초기화해야 하는데요.

src 폴더 밑의 db 폴더에 lucia.ts 파일을 아래와 같이 만듭시다.

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
        github_id: attributes.github_id,
        username: attributes.username,
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

예전에 배웠던 Lucia 초기파일에서 뭔가가 추가됐는데요.

sessionCookie 부분에 secure란은 추가했습니다.

그리고 getUserAttributes에서는 githubId와 username을 지정해서 나중에 세션을 이용해서 쉽게 이 두 정보를 얻을 수 있습니다.

이제 만반의 준비가 끝났습니다.

---

## Github에서 관련 정보 얻기

Github 사이트에서 Settings에서 왼쪽 맨 밑에 보면 "Developer Settings"이 있습니다.

링크는 여기 [https://github.com/settings/apps](https://github.com/settings/apps) 입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEh0XHXUiGsZeM_JC5cdNYN0sAMeWLxc5Jr0z-cLSlnIwPcsPfQTpvsm_7X3v5BBA2imdUM7T5m-cLzTPcljMC_9pmxvDFroPqwC2oJJIbJaewWrGjrJJPJSSroxDyvfxAjBARcEpfxNGr7nutyt2a8kDphm9BRk_ppS1MnTEpiFKlqvfS1TMTh_WIEBbDU)

위와 같은 화면에서 오른쪽에 "New GitHub App" 버튼을 누르면 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEi9iIJ1foQJ8wtQkWfb_0kuL-T_hHPtzVQNl8yC4-Ocj_AUHJ47zLGOf97oq89zq2G2xCdD4amkWIBsFEAoE8e5-Hs7oS0RZCbdq2NG6R7FxnMET8eCMpFZcd1LKGuO2MypGOU4hlca9tZMJh5SJ1vgSNGdLPhKQcAnlIPcrpCbjaYdSiQitx1v7eDRKnY)

위와 같이 나오는데 적당하게 넣어주면 됩니다.

중요한건 "Homepage URL"과 "Callback URL"입니다.

이번에는 콜백 URL을 조금 길게 작성했습니다.

`http://localhost:5173/admin/login/github/callback`

![](https://blogger.googleusercontent.com/img/a/AVvXsEiR75vPvmczVzYHVlWwYBkVQP7tHnMnBqADTRkHEQ4WzCNY0YtLhWoGUi4EKtDgZMI4caWNPer0ziZUY-w1cHTruYN5jT0V-8G7Arflq2B9tJt2fGG8AIuHVorfrYXI8xxgHxIRnepcV-fz8TIrEL7fHMJ4kJLEe1Z7kxrEJBz6Z3eyF_MvDg3X0Jje4iI)

그리고 화면을 스크롤하셔서 WebHook 쪽이 나오는데 이건 언체크하십시요.

필요하실 때 하면 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEi0Adv3nJ02oeUBE569zGSSZGY9Tv9MdJExttMylazRUXNVtZi3wbD-kbtAEaXeMF2ZhS9goWT7-JSJqrNR9fkNVf5Q_ciBcZNox974jkFUQn06kdgk-tkCr68l07sZaohzgWIq-bEHa1Jzr9sjY17EfdGesZQbYbonUjMXqP3-f80fSgjwzIjzzuszBN8)

이제 위와 같이 "Create ~~~"버튼을 누르면 됩니다.

그러면 아래와 같이 Client ID와 Client Secrets를 구하는 화면이 나오는데, ID는 자동 생성되고 Secrets는 만들기 버튼을 누르면 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjW1-HPrbKRFngXNDxLCPMQcPHmiLqk1ApTOWVwzqJEC2DqB_kq67sL7bm2jw4CO9saCm1y4R8CgFKHPPhNITrucRz5FYuhnK555c6XgYpoowKhq25l5Zv_mn3AxLARCX5IHVRl4K1_hlTA595pLV68RFYjW04ee4q57lcEarAM2lFdNIEhhCsJOL4tTa4)

Secrets는 화면에 한번 나오기 때문에 꼭 다른곳에 저장해 놔야 합니다.

안 그러면 지우고 다시 만들어야 합니다.

이제 GitHub ID로 로그인하기 위한 준비가 끝났습니다.

---

## Admin 라우팅 만들기

'index.tsx' 파일은 로그인 여부 없이 보이는 화면으로 만들고, "/admin" 라우팅으로 로그인 관련 인증 화면을 만들려고 합니다.

'admin.tsx' 파일을 만들고 Cloudflare 관련 바인딩도 같이 넣어줍시다.

'admin.tsx' 파일은 'index.tsx' 파일과 같은 위치에 놓으면 됩니다.

```ts
import { Hono } from "hono";
import { renderer } from "./renderer";
import { Session, User } from "lucia";
import { csrf } from "hono/csrf";

type Bindings = {
  DB: D1Database;
};

type Variables = {
  user: User | null;
  session: Session | null;
};

const admin = new Hono<{ Bindings: Bindings; Variables: Variables }>();

admin.use(csrf());

admin.use(renderer);

admin.get("/", (c) => {
  return c.render(<h1>This is Admin Page!</h1>);
});

export default admin;
```

이제 Admin 라우팅을 'index.tsx' 파일에서 라우팅 등록을 해줘야 합니다.

```ts
import { Hono } from "hono";
import { renderer } from "./renderer";

// admin 불러오기
import admin from "./admin";

const app = new Hono();

app.use(renderer);

app.get("/", (c) => {
  return c.render(<h1>Hello!</h1>);
});

// 아래가 바로 app 밑에 admin 라우팅을 추가하는 명령어입니다.
app.route("/admin", admin);

export default app;
```

이제 개발 서버를 돌려서 브라우저에서 아래 주소로 가시면 웹앱이 아래와 같이 보일겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEj3UzqCLqbWN0Gzf_SJk46qJQUaVHiSD-8-KXssVFGwpHWA0MoMf2r_7k0MtKoSMCpGI4-XbLt4eXrI-O5h2xcxLK23SpTeAkZDLlynvQUWGqWxzVf5Z1rr67LBWewXBCXrjWLWkFTGxMddm6MGABxeRq8Xdy25Ly8Z1nOMwnoD2jgg_xmjdU-sJzENpvo)

---

## Cloudflare에서 SECRETS 다루기

Cloudflare에서 Git에 커밋하지 않는 데이터는 'vars'라는 항목으로 관리해줍니다

보통 Next.js 앱에서 '.env' 파일에 넣었던거랑 같다고 보시면 되는데요.

wrangler.toml 파일에 아래와 같이 먼저, GITHUB_CLIENT_ID를 넣어봅시다.

```toml
[vars]
GITHUB_CLIENT_ID = "Iv~~~~~~~~~urvAVf9e8"
```

이제 Cloudflare+Hono에서 Hono의 Context에서 위 GITHUB_CLIENT_ID를 참조할 수 있습니다.

그러면 비밀 텍스트인 GITHUB_CLIENT_SECRET는 '.dev.vars' 파일을 만들고 그 밑에 아래와 같이 넣어둡시다.

```sh
GITHUB_CLIENT_SECRET=134be63~~~~~~~~~~~~~~b52af9255af5e321
```

이제 다시 위와 같이 만든 Varialbes를 사용하기 admin.tsx 파일에서 바인딩을 아래와 같이 바꾸겠습니다.

```ts
type Bindings = {
  DB: D1Database;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
};
```

위와 같이 바꿨으면 이제 Hono의 Context인 c.env.GITHUB_CLIENT_ID 와 같이 사용할 수 있습니다.

```ts
admin.get("/", (c) => {
  console.log(c.env.GITHUB_CLIENT_ID);
  console.log(c.env.GITHUB_CLIENT_SECRET);

  return c.render(<h1>This is Admin Page!</h1>);
});
```

위와 같이 하면 콘솔창에 GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET가 각각 나타날겁니다.

그리고 배포할 때는 Cloudflare 세팅화면에서 환경변수를 책정해 주면 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhw0YbkJtSJAVAHxgDMOOgNsoC-XDFW0WW7rOT35xywLEmo_HVRgjAY7BpFfMuQ-TvUDNDRpwuCejD1ijErC7Nw1tnzsGA2AfPs7tgINoqxXQ-piaPL1qoFO_Rqt2H5T-6dbzV9ZhnM_cPpxfV25ImkuLSfOB3Iir64IcYRUJQokOrkH2EokLfQO8BA2jM)

이제 본격적인 로그인 라우팅을 구현해 보겠습니다.

편의를 위해 아래와 같이 링크를 만들어 두겠습니다.

```ts
admin.get("/", (c) => {
  return c.render(
    <>
      <h1>This is Admin Page!</h1>
      <br />
      <a href="/admin/login">Go to Login</a>
    </>
  );
});

admin.get("/login", (c) => {
  return c.render(
    <>
      <a href="/admin/login/github">GitHub ID Login</a>
    </>
  );
});
```

이제 '/admin/login' 주소에서 GitHub ID Login 버튼을 누르면 "/admin/login/github' 주소로 이동하게 됩니다.

이 주소에 GitHub 관련 코드를 넣으면 되는데요.

아래와 같이 작성합시다.

```ts
import { Hono } from "hono";
import { renderer } from "./renderer";
import { Session, User } from "lucia";
import { csrf } from "hono/csrf";
import { generateState, GitHub } from "arctic";
import { setCookie } from "hono/cookie";

...
... 이전 코드와 동일
...

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

  console.log(url);
  return c.redirect(url.toString());
});

export default admin;

```

예전에는 아래와 같이 직접 github authorize 주소에 파라미터를 지정해서 아래와 같이 redirect 했었는데요.

```ts
const AUTH_ENDPOINT = "https://github.com/login/oauth/authorize";
  const params = {
    client_id: GITHUB_CLIENT_ID,
    response_type: "code",
    scope: "profile",
    redirect_uri: REDIRECT_URI,
  };
  return c.redirect(`${AUTH_ENDPOINT}?${new URLSearchParams(params)}`);
```

다행히 arctic 패키지에서 위와 같이 편하게 AUTH_ENDPOINT 주소를 리턴해 줍니다.

위에서 제가 console.log(url) 코드를 넣었는데요.

주소를 클릭하면 터미널에 아래와 같은 내용이 출력될 겁니다.

```sh
URL {
  href: 'https://github.com/login/oauth/authorize?response_type=code&client_id=I~~~~~~~uurvAVf9e8&state=1lboMkBZkYfV2oLJol4onxAq4vWEVL4thkoKo38n7HU',
  origin: 'https://github.com',
  protocol: 'https:',
  username: '',
  password: '',
  host: 'github.com',
  hostname: 'github.com',
  port: '',
  pathname: '/login/oauth/authorize',
  search: '?response_type=code&client_id=I~~~~~~~uurvAVf9e8&state=1lboMkBZkYfV2oLJol4onxAq4vWEVL4thkoKo38n7HU',
  searchParams: URLSearchParams {
    'response_type' => 'code',
    'client_id' => 'I~~~~~~~uurvAVf9e8',
    'state' => '1lboMkBZkYfV2oLJol4onxAq4vWEVL4thkoKo38n7HU' },
  hash: ''
}
```

잘 보시면 예전에 arctic 없이 작성했던 'response_type', 'client_id', 그리고 'state' 값도 알아서 작성해 줍니다.

그리고 브라우저를 보시면 아래 그림처럼 바뀌는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhuZEiiJHJkLcbelXkLqTxrwf608FH0vBv5_SzurcC-x_t1RzzIO8IPx6ixHcQ-5DX-SsMiJAlda-ywKR_bSxUvE1Sptfawuv2sPyzQLdCpWK7CgPisr8L7d3dXdgDs_qJ_T-A28YqMiLjDqCxAUE0NaX6GkZdbF6dxNf_uPe_tbPGhjR2oCVPh3lBwGOo)

우리가 GitHub 디벨로퍼 세팅에서 만들었던 GitHub 앱이 나옵니다.

Authorize 버튼을 누르면 이제 로그인하게 되는데요.

저는 Github 사이트에 로그인되어 있어 자동으로 아래 그림과 같이 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhPsjfzHARVxEUHB6KMx-rK_SXCgSc7DJN0gUGwt_hRoZlXY0sVrvW900VaJ464SByoXeP4uKryGOLk6WSmeVHZdc_3SOw9FG6t_k1czfBiZ2dzN-BTothCd5JFUlxKXjBr7eBQysjkB9HhoSfwcinrBeIvl1JIYgrhnljuDXBvuCwVrxImOCJmz9lJwBc)

위 그림은 지금까지 배웠던 거랑 똑같습니다.

Github에서 로그인 정보가 맞아서 우리가 지정했던 콜백주소로 관련 정보값은 query 값으로 되돌려 준겁니다.

```sh
http://localhost:5173/admin/login/github/callback?code=0ad7bdf578fcacd9566c&state=1lboMkBZkYfV2oLJol4onxAq4vWEVL4thkoKo38n7HU
```

위와 같이 나오는데요.

code 값은 나중에 토큰을 구하기 위한 가장 중요한 값입니다.

그리고 state 값은 URL 하이재킹을 막기 위해 로컬상태에서 만들었고, 그 state 값은 쿠키로 브라우저에 저장해 놓았습니다.

실제로 크롬 개발창에서 'Application' 부분에서 쿠키란을 보시면 아래 그림과 같이 저장되어 있을겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEh2Rfnwa6t_pLL_AjDdHmSXf6zMb6xXnwj4Biej2XLj5zwXeIBkcQOupK9KrSVQKF4PCsMxFY4ZG18KwZpKeNp0SlVnBHKgWH6dGssqpq9UXFYeJRXe0oR2qtMpD9UQughFTaDkglwKgeAy2J7Bo5lr68dY7DmkTHFZaWuxam-jUbhMMZNXJwjOJ6eUxEg)

모든게 제대로 작동되고 있네요.

---

## GitHub 사용자 정보 얻기

이제 콜백주소까지 받았으니까 이 콜백주소에 해당하는 라우팅에서 액세스 토큰을 얻고, 이렇게 얻은 액세스 토큰으로 유저 정보를 얻으면 끝입니다.

'code', 'state' 값의 검증을 위해 Hono에서 추천하는 zod와 zValidator 패키지를 설치하겠습니다.

```sh
bun add zod @hono/zod-validator
```

이제 본격적인 콜백주소에 대응하는 라우팅을 만들겠습니다.

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

    const { code, state } = c.req.valid("query");
    const storedState = getCookie(c).github_oauth_state ?? null;

    if (!code || !state || !storedState || state !== storedState) {
      return c.body(null, 400);
    }

    try {
      const tokens = await github.validateAuthorizationCode(code);
      console.log(tokens);

      const githubUserResponse = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      });
      const githubUser = await githubUserResponse.json();
      console.log(githubUser);
      
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

    return c.redirect("/admin");
  }
);
```

위 코드를 보시면 먼저, query에서 code, state 값을 얻어오고, 그리고 쿠키에서 storedState와 state 값을 비교해서 틀리면 에러를 냅니다.

에러가 없으면 이제 try~catch 문을 통해 github에서 유저 정보를 얻어오는 API에 접근해서 githubUser 정보를 얻어오면 됩니다.

이 githubUser 정보를 얻기 위해서는 당연히 액세스 토큰을 구해야 하는데요.

이 때 arctic 패키지가 제공해주는 validateAuthorizationCode 함수를 사용하면 쉽게 구할 수 있습니다.

이제 브라우저에서 로그인을 실행해 보면 아래와 같이 콘솔창에 액세슽토큰하고, 유저 정보가 나오는데요.

아래 콘솔창을 보시면 유저 정보가 너무 길게 나옵니다.

우리가 필요로하는 거는 github_id와 username이니까 아래 정보에서는 login, id 값 두개만 필요할 거 같네요.

잘 보시면 id 값은 타입이 number입니다.

login은 username으로 하고, id 값이 github_id인데, github_id는 우리가  string 타입으로 지정했었습니다.

나중에 타입을 바꿔줘야하니까 주의해야합니다.

```sh
{ accessToken: 'g~~~~~~~~~~~~~~UQtMl0s5YsS' }
{
  login: '~~~~~~~~',
  id: ~~~~~, // 타입 유의
  node_id: 'MDQ6V~~~~~~~~wODUyNzY=',
  avatar_url: 'https://avatars.githubusercontent.com/u/~~~6?v=4',
...
...
  email: null,
  hireable: null,
  bio: null,
  twitter_username: null,
  notification_email: null,
  public_repos: 30,
  public_gists: 0,
  created_at: '2013-07-25T00:14:48Z',
  updated_at: '2024-08-03T04:40:45Z'
}
```

---

## lucia를 이용한 세션과 쿠키 저장하기

이제 위와 같이 만든 상태에서 조금 더 확장해 보겠습니다.

먼저, 로직은 Github 유저정보를 얻어서 해당 아이디가 기존 usersTable에 있다면 그 상태에서 lucia를 이용해서 세션과 쿠키를 만들어주고,

해당 유저가 usersTable에 없다면 해당 유저를 usersTable에 insert 후에 lucia를 이용해서 세션과 쿠키를 만들어주는 로직이 필요합니다.

코드가 조금 긴데 천천히 살펴보시면 됩니다.

```ts
import { Hono } from "hono";
import { renderer } from "./renderer";
import { Session, User } from "lucia";
import { csrf } from "hono/csrf";
import { generateState, GitHub, OAuth2RequestError } from "arctic";
import { getCookie, setCookie } from "hono/cookie";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { drizzle } from "drizzle-orm/d1";
import { usersTable } from "./db/schema";
import { eq } from "drizzle-orm";
import { initializeLucia } from "./db/lucia";

...
... 기존 코드와 동일
...

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

      //githubUser의 id 타입은 number라서 string으로 타입변환해야 함.
      const returned_github_id = githubUser.id.toString();
      const returned_username = githubUser.login;

      const existingUser = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.github_id, returned_github_id));

      if (existingUser.length !== 0) {
        const session = await lucia.createSession(existingUser[0].id, {});
        c.header(
          "Set-Cookie",
          lucia.createSessionCookie(session.id).serialize(),
          { append: true }
        );

        return c.redirect("/admin");
      }

      const user = await db
        .insert(usersTable)
        .values({ github_id: returned_github_id, username: returned_username })
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

이제 위와 같이 하면 로그인한 상태가 되면서 쿠키가 로컬스토리지에 저장되면서 로그인이 완료됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEieOBNQa1SkgLx9-HTVuq0oN3AzIF06sOdxh3FwJaDbDfLE-2Yq0S-YENvHlWAK3aO5iJD1kpXYoWmniopAedftg9GrE50dVmE3av5-53orYQ7TlsDATDCvBdY3Jxsuy3vc25-RWReLN15YJbRX7-evk1pTR5x_GA82TvnViNth0dXIUA8yroc8Gir48ko)

위와 같이 브라우저 쿠키를 보면 두개가 나오는 데요.

한개는 lucia 세션 쿠키고 한개는 state를 저장한 쿠키입니다.

---

## Hono 미들웨어로 유저 정보와 세션 저장하기

이제 로그인을 했으면 다른 라우팅에서 유저가 로그인 한 상태를 알아야 하는데요.

Hono에서 제공하는 미들웨어를 사용할 겁니다.

여기서 user, session 값을 'c.set' 메서드를 사용하여 저장할 건데요.

이렇게 하면 어디서든지 `c.get("user")`와 같이 쉽게 user 정보를 가져올 수 있습니다.

먼저, index.tsx 파일과 같은 위치에 middleware.ts 파일을 아래와 같이 작성합니다.

```ts
import { Context, Next } from "hono";
import { initializeLucia } from "./db/lucia";
import { getCookie } from "hono/cookie";

export async function authMiddleware(c: Context, next: Next) {
  const lucia = initializeLucia(c.env.DB);

  const sessionId = getCookie(c, lucia.sessionCookieName);
  if (!sessionId) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  const { session, user } = await lucia.validateSession(sessionId);
  if (session && session.fresh) {
    c.header("Set-Cookie", lucia.createSessionCookie(session.id).serialize(), {
      append: true,
    });
  }

  if (!session) {
    c.header("Set-Cookie", lucia.createBlankSessionCookie().serialize(), {
      append: true,
    });
  }

  c.set("user", user);
  c.set("session", session);
  return next();
}
```

미들웨어는 간단하게 lucia의 validateSession 함수를 이용해서 세션 user 값과 session 정보를 저장하는 로직입니다.

이제 위에서 만든 미들웨어를 admin.tsx 파일에서 미들웨어 등록을 해줘야 합니다.

admin.tsx 파일 윗 부분에 아래와 같이 코드를 작성하시면 됩니다.

```ts
...
...
...

import { authMiddleware } from "./middleware";

admin.use(csrf());

admin.use(renderer);

// 미들웨어 등록하기
admin.use("*", authMiddleware);

...
...
...

```

이제 admin.tsx 파일의 대시보드에서 유저 로그인한 상태에 따라 다른 화면을 보여줍시다.

```ts
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
```

위와 같이 user 값이 존재하면 아래와 같은 화면을 보여주면 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiUzVfoOPaQqD2eqD-Dbf5PAc3xIjqqKKARVn8L1cc2axyjTbAV8paq8_eOLxBtuetwV80HzPCTU2AWjjSX2C3mKazOtwriYQZH7K0b9-ZbfdteC2E6aTBkB63mTN51xIqM0TdkrZzkIpcwpJVQB_4jy_f73vM8eb90Jy7TJbm0cuaz7DmZnraL_ItiCv8)

로그아웃 버튼을 누르면 로그아웃이 되는데요.

HTTP 메서드가 POST 방식으로 해야 합니다.

이제 logout 라우팅을 구현해 봅시다.

```ts
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
```

lucia.invalidateSession와 lucia.createBlankSessionCookie를 이용해서 세션 쿠키를 지워지고 있습니다.

그리고 `deleteCookie(c, "github_oauth_state");`를 통해 github_oauth_state 쿠키도 삭제해 주고 있습니다.

이렇게 되면 미들웨어에서 session과 user 정보를 얻지 못하게 되죠.

이제 끝입니다.

Hono와 Github ID 로그인이 완성되었네요.

다음에는 arctic 패키지에서 카카오 로그인도 제공해 주고 있어 이것도 테스트 해 보겠습니다.

그럼.
