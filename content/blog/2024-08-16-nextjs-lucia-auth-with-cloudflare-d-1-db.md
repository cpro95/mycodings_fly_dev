---
slug: 2024-08-16-nextjs-lucia-auth-with-cloudflare-d-1-db
title: Next.js에서 Lucia Auth, Cloudflare D1 DB를 이용해서 유저 로그인 구현하기
date: 2024-08-16 10:18:26.900000+00:00
summary: 이번 강좌에서는 Lucia Auth를 Next.js상에서 구현해 보겠습니다. Cloudflare D1 DB를 사용할 겁니다.
tags: ["next.js", "cloudflare", "d1", "lucia", "lucia auth", "drizzle orm"]
contributors: []
draft: false
---

안녕하세요?

이번시간에는 지난 시간에 작성했던 Next.js 로그인 세션을 좀 더 확장해서 실전에서 사용할 수 있는 FullStack 앱으로 발전시켜나갈 생각입니다.

DB는 Cloudflare D1을 사용할 거고, ORM은 가벼운 Drizzle ORM, 그리고 Auth 부분은 요즘 뜨고 있는 Lucia Auth를 사용할 생각입니다.

전체적인 구조는 지난번에 만들었던 Hono Framework을 이용한 유저로그인 방식과 같습니다.

[Cloudflare, D1 DB, Hono, Lucia, Drizzle ORM을 이용한 유저 로그인 구현
](https://mycodings.fly.dev/blog/2024-08-01-cloudflare-hono-d-1-lucia-drizzle-login)

다만 Next.js를 이용한다는 것 뿐입니다.

Next.js와 Cloudflare의 조합을 공부한다는 생각으로 진행할 예정이오니 참고 바랍니다.

---

먼저, 관련 패키지를 설치하겠습니다.

```sh
npm i lucia drizzle-orm @lucia-auth/adapter-sqlite
npm i -D drizzle-kit @types/better-sqlite3
```

두 번째로 D1 DB를 새로 만들겠습니다.

```sh
npx wrangler login
```

먼저, 위와 같이 Cloudflare에 로그인하고 아래와 같이 D1 DB를 터미널상에서 직접 만들겠습니다.

```sh
npx wrangler d1 create nextjs-lucia-auth-db

 ⛅️ wrangler 3.70.0 (update available 3.71.0)
-------------------------------------------------------

✅ Successfully created DB 'nextjs-lucia-auth-db' in region APAC
Created your new D1 database.

[[d1_databases]]
binding = "DB" # i.e. available in your Worker on env.DB
database_name = "nextjs-lucia-auth-db"
database_id = "ebb6d9de-~~~~~~~~~~~~~~~~06f75d"
```

위와 같이 database_id까지 생성됐습니다.

이제 이 값을 wrangler.toml에 추가하면 됩니다.

실제로 Cloudflare 대시보드에 가보면 방금 만든게 있을 겁니다.

1차 준비는 끝났네요.

---

## Drizzle로 DB Schema 만들기

Drizzle로 우리가 원하는 DB의 스키마를 만들어야 하는데요.

먼저, src 폴더에 db 폴더를 만들고 schema.ts 파일을 작성합니다.

```ts
import { InferSelectModel } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { generateId } from "lucia";

export const usersTable = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => generateId(15)),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  admin: integer("admin", { mode: "boolean" }).default(false),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export const sessionsTable = sqliteTable("sessions", {
  id: text("id").primaryKey().notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id),
  expiresAt: integer("expires_at").notNull(),
});

export type MySessionsType = InferSelectModel<typeof sessionsTable>;
```

Lucia Auth를 이용해서 인증을 구현하려면 user와 session 테이블이 필요합니다.

저는 위와 같이 usersTable, sessionsTable 과 같이 두개의 테이블을 만들었고, usersTable에는 이용자가 관리자인지 여부인 admin 컬럼까지 추가했습니다.

나중에 Admin 대시보드를 만들때 admin 컬럼이 true인 사용자만 볼 수 있게 하면 손쉽게 사용자를 구분할 수 있을겁니다.

이제 DB를 위한 스키마 파일이 완성되었으니, 실제 SQL 파일을 만들어야 합니다.

상위 폴더에 drizzle.config.ts 파일을 아래와 같이 만듭니다.

```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite", // "mysql" | "sqlite" | "postgresql"
  schema: "./src/db/schema.ts",
  out: "./drizzle",
});
```
sqlite를 사용할 거고, schema 파일 위치와 output 파일의 위치도 'drizzle' 폴더로 지정했습니다.

이제 터미널에서 아래와 같이 입력하면 됩니다.

```sh
npx drizzle-kit generate

No config path provided, using default 'drizzle.config.ts'
Reading config file '/Users/cpro95/Codings/Javascript/nextjs/nextjs-cloudflare-session-tutorial/drizzle.config.ts'
2 tables
sessions 3 columns 0 indexes 1 fks
users 4 columns 1 indexes 0 fks

[✓] Your SQL migration file ➜ drizzle/0000_same_norrin_radd.sql 🚀
```

drizzle 폴더에 SQL 파일이 하나 생겼습니다.

열어보면 아래와 같이 나올겁니다.

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
	`email` text NOT NULL,
	`password` text NOT NULL,
	`admin` integer DEFAULT false
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);
```

실제 SQL 명령문입니다.

이걸 Cloudflare DB인 D1에 적용해야 합니다.

이 역시 wrangler 명령어를 이용하면 됩니다.

개발서버에 적용하려면 '--local' 옵션을 주면 되고, 실제 Cloudflare 상의 D1 DB에 적용하려면 '--local' 옵션 대신 '--remote' 옵션을 주면 됩니다.

일단 로컬 개발서버에 적용해 보겠습니다.

```sh
npx wrangler d1 execute nextjs-lucia-auth-db --local --file=./drizzle/0000_same_norrin_radd.sql

⛅️ wrangler 3.70.0 (update available 3.71.0)
-------------------------------------------------------

🌀 Executing on local database nextjs-lucia-auth-db (ebb6d9de-acad-42b8-b506-2a56e706f75d) from .wrangler/state/v3/d1:
🌀 To execute on your remote database, add a --remote flag to your wrangler command.
```

성공한거 같습니다.

이제 remote 서버에 적용해 보겠습니다.

```sh
npx wrangler d1 execute nextjs-lucia-auth-db --remote --file=./drizzle/0000_same_norrin_radd.sql


 ⛅️ wrangler 3.70.0 (update available 3.71.0)
-------------------------------------------------------

✔ ⚠️ This process may take some time, during which your D1 database will be unavailable to serve queries.
  Ok to proceed? … yes
🌀 Executing on remote database nextjs-lucia-auth-db (ebb6d9de06f75d):
🌀 To execute on your local development database, remove the --remote flag from your wrangler command.
Note: if the execution fails to complete, your DB will return to its original state and you can safely retry.
├ 🌀 Uploading ebb6d9de-a6e706f75d.c18b7e797ccbd250.sql 
│ 🌀 Uploading complete.
│ 
🌀 Starting import...
🌀 Processed 3 queries.
🚣 Executed 3 queries in 0.00 seconds (4 rows read, 7 rows written)
   Database is currently at bookmark 00000001-00000000-00004def-51bd12f942bb491cb717ae.
┌────────────────────────┬───────────┬──────────────┬────────────────────┐
│ Total queries executed │ Rows read │ Rows written │ Database size (MB) │
├────────────────────────┼───────────┼──────────────┼────────────────────┤
│ 3                      │ 4         │ 7            │ 0.03               │
└────────────────────────┴───────────┴──────────────┴────────────────────┘
```

역시나 잘 작동합니다.

Cloudflare 대시보드에서 보면 아래와 같이 나올겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgJ0-a2ANYaU33_WXyCjHibJJKP91TmMAUJr8uOXdIhXQbS-UVn8PDU7VMuXKRqWQZusr7Kgq5Hd8TgFUXIftvO5lPDGB0Y7uPhxDWJO528E5AMPpHEw15dKhkKnGOkBBbw3IHwM4LK0lW7sCB4xjhkGe8SxjK207scLwo4i_EDSZ3O67N1GjspSna5rXI)

DB 설정은 끝났습니다.

---

## Lucia Auth 설정

이제 인증 세션 부분을 쉽게 해주는 Lucia Auth를 다뤄보겠습니다.

먼저, src 폴더 밑의 db 폴더에 lucia.ts 파일을 아래와 같이 작성합니다.

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
    getUserAttributes: (attribute) => {
      return {
        email: attribute.email,
      };
    },
  });
}

declare module "lucia" {
  interface Register {
    Lucia: ReturnType<typeof initializeLucia>;
    DatabaseUserAttributes: SelectUser;
  }
}
```

이 부분도 Hono로 작성했던 지난 시간과 똑같습니다.

---

## 유저 가입하기 구현하기

유저 로그인을 위해서는 유저가 있어야합니다.

먼저, 가입하기 라우팅을 구현해 보겠습니다.

'/signup' 라우팅 주소가 될 겁니다.

헤더 메뉴를 작성하면 쉽게 홈이나 가입하기로 이동할 수 있어 먼저, 앱 전체의 layout.tsx 파일에 a 태그 몇개를 추가해 보겠습니다.

```ts
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="max-w-xl p-4">
        <header className="flex space-x-4 py-4 underline">
          <a href="/">Home</a>
          <a href="/signup">sign up</a>
          <a href="/login">log in</a>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
```

위와 같이 하면 상단에 Home, sign up, log in 링크가 나타납니다.

이제 signup 라우팅 구현을 위해서 src 밑 app 폴더에 signup 폴더를 만들고 그 밑에 'page.tsx' 파일을 만듭시다.

```ts
import { signup } from "@/lib";
import { redirect } from "next/navigation";

export const runtime = "edge";

export default async function SignUp() {
  return (
    <>
      <h1>Sign Up</h1>
      <section className="p-2">
        <form
          action={async (formData) => {
            "use server";
            await signup(formData);
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
          <input
            className="border"
            type="password"
            name="password"
            placeholder="password"
          />
          <br />
          <button className="border" type="submit">
            Sign up
          </button>
        </form>
      </section>
    </>
  );
}
```

예전에 만들었던 login 폼과 비슷합니다.

이제 form 액션 부분에서 실행했던 signup 함수만 작성하면 되는데요.

여기서 뭔가 코드가 하나 추가됐는데요.

바로 아래 코드입니다.

```ts
export const runtime = "edge";
```

Next.js가 Cloudflare에서 서버사이드 로직을 처리하려면 위와 같이 runtime을 'edge'로 export해야 합니다.

왜냐하면 form 액션에서 'use server' 부분을 사용하기 때문입니다.

그럼 'lib.ts' 파일에 signup 함수를 추가해 보겠습니다.

기존에 만들었던 lib.ts 함수는 거의 없다고 보시면 됩니다.

완전히 새로 만들어야 합니다.

기존에는 'jose' 패키지를 이용해서 JWT를 만들어서 세션을 만들었는데요.

Lucia가 알아서 세션과 유저정보를 핸들링해주기 때문에 아주 편합니다.

```ts
import { initializeLucia } from "./db/lucia";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { Scrypt } from "lucia";

export async function signup(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const DB = getRequestContext().env.DB;

  const db = drizzle(DB);

  const existingUser = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));
  console.log(`existingUser : ${JSON.stringify(existingUser, null, 2)}`);

  if (existingUser.length !== 0) {
    throw new Error("User with that email already exists.");
  }

  const passwordHash = await new Scrypt().hash(password);
  const user = await db
    .insert(usersTable)
    .values({ email, password: passwordHash })
    .returning({ id: usersTable.id, email: usersTable.email });

  if (!user || user.length === 0) {
    throw new Error("An error occured during sign up.");
  }

  const lucia = initializeLucia(DB);
  const session = await lucia.createSession(user[0].id, {});
  console.log(session);

  const cookie = lucia.createSessionCookie(session.id);

  cookies().set(cookie.name, cookie.value, cookie.attributes);
}
```

signup 함수는 간단합니다.

폼데이터로 넘어온 이메일과 패스워드를 이용해서 D1 DB에 새로운 사용자는 Insert하면 됩니다.

Insert하기전에 같은 이메일로 가입된 유저가 있는지 먼저 체크하는게 좋겠죠.

여기서 Cloudflare의 D1을 Next.js에서 사용하려면 먼저, 수행해야할게 있는데요.

파일이름 'env.d.ts' 파일을 열어보면 아래와 같이 나올겁니다.

```ts
// Generated by Wrangler
// by running `wrangler types --env-interface CloudflareEnv env.d.ts`

interface CloudflareEnv {}
```

위 코드를 보시면 Wrangler에 의해 CloudflareEnv 인터페이스를 정의하는 코드인거 같은데요.

설명대로 터미널에 아래와 같이 입력하면 원하는 값이 나옵니다.

```sh
npx wrangler types --env-interface CloudflareEnv env.d.ts

⛅️ wrangler 3.70.0 (update available 3.72.0)
-------------------------------------------------------

Generating project types...

interface CloudflareEnv {
        DB: D1Database;
}
```

프로젝트 타입을 만들어줬네요.

이제 다시 env.d.ts 파일을 열어보면 아래와 같이 바껴 있을 겁니다.

```ts
// Generated by Wrangler on Fri Aug 16 2024 18:55:27 GMT+0900 (대한민국 표준시)
// by running `wrangler types --env-interface CloudflareEnv env.d.ts`

interface CloudflareEnv {
  DB: D1Database;
}
```

이렇게 세팅했으면 개발 서버를 다시 돌리면 됩니다.

그러면 이제 DB 라는 이름의 컨텍스트로(Context)로 Next.js 상에서 DB에 접근할 수 있게 됩니다.

그러면 다시 signup 함수로 돌아와서 보시면, getRequestContext 함수를 이용해서 아래와 같이 아주 손쉽게 DB에 접근할 수 있게 됩니다.

```ts
  const DB = getRequestContext().env.DB;

  const db = drizzle(DB);
```

이제 다시 signup 함수를 계속 설명해 보자면 해당 이메일과 패스워드를 이용해서 새로운 유저를 Insert하면 됩니다.

패스워드는 당연히 해싱해야합니다.

lucia에서 제공해 주는 Scrypt 함수를 사용했습니다.

마지막에 보시면 유저 가입이 끝나면 바로 세션을 만들어서 쿠키에 저장하는데요.

이게 바로 로그인 로직입니다.

가입한 후에는 유저의 상태가 로그인 상태와 같기 때문에 signup 함수에서 바로 로그인까지 구현한겁니다.

lucia로 구현하는 방법은 createSession, createSessionCookie 함수를 잘 사용해서 세션에 저장하면 됩니다.

이제 로그인이되면 크롬 개발서버의 쿠키란에 보시면 아래와 같이 쿠키가 보일겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhz2qJ41r_m2plBgczQZb03NaIrCqM6V5uu0tN97vlrHRACEFOoVeOTIDgE3WeqHDLJe_lSiOZ2Tu6XLnlwunl9CUS_hh-2XIzLeGR7-_uU1q5ZwJwpEDRiEYupSWGr2vb0x5VrEDdTi9eqerTJl8sIpgubqndHPt-YqsopisCexyiDeYa3MGRN3dshms4)

쿠키 이름은 auth_session 입니다.

참고로 Lucia에서 관리하는 쿠키입니다.

이제 가입하기도 끝났고, 그 다음으로 Logout 함수를 먼저 구현해 보겠습니다.

지난 시간에 배운 logout 함수는 삭제하고 아래와 같이 만듭니다.

```ts
export async function logout() {
  // const { session } = await validateSession();
  // if (!session) {
  //   throw new Error("Unauthorized");
  // }

  const DB = getRequestContext().env.DB;

  const lucia = initializeLucia(DB);

  await lucia.invalidateSession(session.id);
  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
}
```

위 코드를 보시면 validateSession 함수에서 session 값을 얻어오는게 보이실 텐데요.

일단은 주석처리했습니다.

나중에 validateSession 함수를 작성하면 주석처리를 해제하시면 됩니다.

로그아웃의 로직은 lucia의 invalidateSession, createBlankSessionCookie 함수를 사용해서 쿠키를 삭제해 주는 겁니다.

이와 같이 저장하고 "/" 주소에서 logout을 눌러보면 auth_session 쿠키가 사라지는 걸 볼 수 있을 겁니다.

---

## login 구현하기

가입하기, 로그아웃도 구현했으니 로그인을 구현해야 하는데요.

"/login" 라우팅 주소로 로그인을 구현하기 위해 'login' 폴더와 그 안의 page.tsx 파일을 아래와 같이 만들겠습니다.

```ts
import { login } from "@/lib";
import { redirect } from "next/navigation";

export const runtime = "edge";

export default async function SignUp() {
  return (
    <>
      <h1>Log In</h1>
      <section className="p-2">
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
          <input
            className="border"
            type="password"
            name="password"
            placeholder="password"
          />
          <br />
          <button className="border" type="submit">
            Login
          </button>
        </form>
      </section>
    </>
  );
}
```

이제 다시 'lib.ts' 파일의 login 함수를 뜯어 고쳐보겠습니다.

```ts
export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const DB = getRequestContext().env.DB;

  const db = drizzle(DB);

  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));
  // console.log(`user : ${JSON.stringify(user, null, 2)}`);

  if (user.length === 0) {
    throw new Error("Incorrect username");
  }

  const isValidPassword = await new Scrypt().verify(user[0].password, password);
  if (!isValidPassword) {
    throw new Error("Invalid password.");
  }

  const lucia = initializeLucia(DB);
  const session = await lucia.createSession(user[0].id, {});
  const cookie = lucia.createSessionCookie(session.id);

  cookies().set(cookie.name, cookie.value, cookie.attributes);
}
```

로직은 간단합니다.

먼저, DB에서 해당 이메일의 사용자 정보를 얻고 이메일이 있다면 패스워드를 비교합니다.

패스워드까지 맞다면 Lucia를 이용해서 인증세션을 쿠키로 저장하는 로직입니다.

로그인도 signup 함수에서 중요한 부분만 가져와서 쉽게 작성할 수 있었습니다.

---

##  validateSession 함수를 사용하여 유저 정보 표시

유저가 로그인 됐는지 안 됐는지에 따라 Home 화면의 UI를 다르게 구현해야 하는데요.

먼저, 홈 화면의 page.tsx 파일을 아래와 같이 고치겠습니다.

```ts
import { logout, validateSession } from "@/lib";
import { redirect } from "next/navigation";

export const runtime = "edge";

export default async function Home() {
  const { user } = await validateSession();
  return (
    <section className="p-4">
      <h1>Welcome to Next.js Lucia Test</h1>
      {!user && (
        <a className="underline" href="/login">
          Please Login
        </a>
      )}
      {user && (
        <>
          <pre>{JSON.stringify(user, null, 2)}</pre>
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
        </>
      )}
    </section>
  );
}
```

위 로직은 validateSession 함수에서 얻은 user 정보로 구분해서 화면에 다르게 보여주는데요.

그러면 여기서 제일 중요한게 validateSession 함수를 구현하는 겁니다.

언제든지 매 페이지에서 validateSession 함수를 불러서 로그인 여부를 확인할 수 있으면 유저가 로그인 됐는지 안 됐는지 확인할 수 있어 다른 UI를 보여줄 때 편합니다.

그러면 다시 'lib.ts' 파일에서 validateSession 함수를 작성해 보겠습니다.

```ts
import { cache } from "react";

export const validateSession = cache(async () => {
  const DB = getRequestContext().env.DB;
  const lucia = initializeLucia(DB);
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }

  const result = await lucia.validateSession(sessionId);
  try {
    if (result.session && result.session.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
  } catch {
    throw new Error("Error when handling validateSession");
  }
  return result;
});
```

상기 코드는 lucia 공식 홈페이지에서 가져온 코드입니다.

react의 cache 함수를 사용하라고 하는데요.

cache 함수를 사용하면 불필요한 DB 호출을 피할 수 있다고 합니다.

validateSession 함수가 리턴하는게 바로 result인데요.

result에는 'user, session' 값이 들어 있습니다.

---

## 홈 화면 다시 구성하기

validateSession 함수를 이용해서 홈화면을 다시 구성해 보았습니다.

```ts
import { logout, validateSession } from "@/lib";
import { redirect } from "next/navigation";

export const runtime = "edge";

export default async function Home() {
  const { user } = await validateSession();

  return (
    <section className="p-4">
      <h1>Welcome to Next.js Lucia Test</h1>
      {!user && (
        <a className="underline" href="/login">
          Please Login
        </a>
      )}
      {user && (
        <>
          <pre>{JSON.stringify(user, null, 2)}</pre>
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
        </>
      )}
    </section>
  );
}
```

위와 같이 하면 유저 로그인 여부에 따라 화면에 다르게 보일겁니다.

이제 모든 코드가 완성되었습니다.

---

## 마무리

저는 여기서 마무리 했지만 여러분은 '/signup', '/login' 라우팅에서 validateSession 함수를 이용해서 유저가 로그인 상태에서는 곧 바로 홈으로 redirect 하는 코드를 추가해 주시면 좀 더 멋진 UX를 구현할 수 있을겁니다.

아래 코드입니다.
```ts
const { session } = await validateSession();

if (session) {
  redirect("/");
}
```

그럼.
