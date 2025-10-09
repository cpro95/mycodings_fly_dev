---
slug: 2024-08-01-cloudflare-hono-d-1-lucia-drizzle-login
title: Cloudflare, D1 DB, Hono, Lucia, Drizzle ORM을 이용한 유저 로그인 구현
date: 2024-08-01 13:44:12.566000+00:00
summary: Cloudflare, D1 DB, Hono, Lucia, Drizzle ORM을 이용한 유저 로그인 구현 및 Lucia를 이용한 세션 저장까지 시도해 봅니다.
tags: ["Cloudflare", "Hono", "Lucia", "Drizzle orm", "D1 DB"]
contributors: []
draft: false
---

안녕하세요?

지난 시간에 Cloudflare에서 OAuth를 이용한 구글 아이디, 네이버 아이디, 카카오 아이디 로그인을 알아 봤는데요.

먼저, 지난 시간 강의 링크입니다.

- [Cloudflare, Hono에서 OAuth를 이용해서 네이버 아이디로 Login 구현해 보기](https://mycodings.fly.dev/blog/2024-07-24-cloudflare-hono-oauth-naver-login)

- [Cloudflare에서 Hono와 Google OAuth를 이용해서 Login 구현해 보기](https://mycodings.fly.dev/blog/2024-07-21-cloudflare-hono-google-login)

- [Cloudflare, Hono, OAuth, Kakao Login(카카오 로그인)](https://mycodings.fly.dev/blog/2024-07-27-cloudflare-hono-oauth-kakao-login)

오늘은 좀 더 깊게 들어가기 위해 전문 인증 패키지를 사용해서 로그인을 구현해 보겠습니다.

사용할 스택은 Lucia Auth인데요.

[Lucia Auth](https://lucia-auth.com/)

요즘 뜨는 있는 인증 관련 라이브러리입니다.

Next.js쪽에서는 NextAuth가 유명하고 Clerk, 0Auth 등 전문 인증 사이트도 있지만, 가볍고 공짜인 Lucia Auth가 요즘 각광받고 있습니다.

Lucia Auth의 로그인 세션 구현 방법은 아래와 같이 간단합니다.

```js
import { Lucia } from "lucia";

const lucia = new Lucia(new Adapter(db));

const session = await lucia.createSession(userId, {});
await lucia.validateSession(session.id);
```

Adapter는 사용하는 DB에 맞게 골라주면 됩니다.

공식 홈페이지에 가보면 여러가지 예제가 나오는데요.

오늘은 Cloudflare에서 제공하는 D1 DB를 사용할 예정입니다.

타입스크립트를 위해서 ORM은 Drizzle ORM을 사용할 겁니다.

Cloudflare의 D1 DB는 Prisma를 사용할 수 없습니다.

그리고 Drizzle ORM도 요즘 각광받고 있는 Typescript ORM입니다.

그러면 먼저, Cloudflare pages에 올리기 위해 빈 프로젝트 템플릿을 만들겠습니다.

```sh
bunx create-hono bun-hono-drizzle-lucia-auth-test
```

Bun은 패키지 매니저로 사용할 겁니다.

npm 보다 훨씬 빠르기 때문이죠.

그리고 Lucia, Drizzle ORM도 미리 설치합시다.

아래와 같이 Bun을 이용하면 아주 빠르게 설치할 수 있습니다.

```sh
bun add lucia drizzle-orm @lucia-auth/adapter-sqlite
bun add -D drizzle-kit @types/better-sqlite3
```

---

## D1 DB 만들기

이제 Wranlger를 이용하여 D1 DB를 만들어야하는데요.

```sh
npx wrangler login
```

위와 같이 Cloudflare에 로그인하면 됩니다.

브라우저에서 Cloudflare에 로그인하면 됩니다.

그리고 아래와 같이 터미널 CLId에서 직접 D1 DB를 만듭니다.

```sh
➜  bun-hono-drizzle-lucia-auth-test npx wrangler d1 create hono-lucia-test-db

 ⛅️ wrangler 3.67.1 (update available 3.68.0)
-------------------------------------------------------

✅ Successfully created DB 'hono-lucia-test-db' in region APAC
Created your new D1 database.

[[d1_databases]]
binding = "DB" # i.e. available in your Worker on env.DB
database_name = "hono-lucia-test-db"
database_id = "f6b7477f-~~~~-~~~~-~~~~-c~~~~92538"
```

위에서 보시면 database_id 이 값이 아주 중요한데요.

잘 저장해 두시면 됩니다.

이 값은 Cloudflare 대시보드에 가도 쉽게 찾을 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEglToyyZNde6VN_5BAsIBhRtLX6dqQ3ZXiKwh0Td38ciB-s6_fBY8zC4LPQcPZKSV8CamoyytSWQj4qANvtJhNY-_PNhY62TAVY8cJ71E2ZpRe8oj5G4lNqbOvuVRQeVdqotdzHFNH0vqaeSfyjF1IWBcOOmsQMRhpkS5xRxPwByjodwhwp4o9Az0UazZ8)

이제 이 값을 wrangler.toml 파일에 넣어둬야 합니다.

```sh
name = "bun-hono-drizzle-lucia-auth-test"
compatibility_date = "2024-07-28"
pages_build_output_dir = "./dist"

[[d1_databases]]
binding = "DB"
database_name = "hono-lucia-test-db"
database_id = "f6b7477f-~~~~-~~~~-~~~~-c~~~~92538"
```

이제 1차 준비가 끝났습니다.

---

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
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
});

export type MyUsersType = InferSelectModel<typeof usersTable>;
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

우리가 구현하려는게 이메일과 패스워드 방식의 로그인 방식입니다.

그래서 usersTable에는 이메일과 패스워드를 넣었고, 그리고 여기서 중요한게 userTable의 id인데요.

보통이면 아래와 같이 만들면 됩니다.

```sh
id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
```

그런데 sessionsTable에서 usersTable의 id를 참조하기 때문에 좀 더 어려운 id로 만들기 위해 lucia에서 제공해 주는 generateId 함수를 사용했습니다.

generateId 함수는 난수 방식의 글자를 제공해 줍니다.

그리고 로그인 세션을 저장하기 위해서도 테이블을 만들어야 하는데요.

바로 sessionsTable입니다.

세션 테이블은 간단하게 유저 아이디 정보와 만료 정보만 저장하면 됩니다.

sessionsTable의 유저 아이디 정보인 userId 컬럼은 레퍼런스를 이용해서 usersTable.id와 연결되어 있는거 볼 수 있을 겁니다.

그리고 Drizzle ORM이 좋은게 테이블의 타입정보를 쉽게 구할 수 있습니다.

InferSelectModel로도 구할 수 있고, usersTable.$inferInsert 방식으로도 구할 수 있으니 편한걸 쓰면 됩니다.

이제 DB를 위한 스키마 파일이 완성되었습니다.

그러면 drizzle-kit 패키지로 실제 SQL 파일로 만들어야 합니다.

다음과 같이 터미널 창에서 아래 명령어를 입력합시다.

```sh
➜  bun-hono-drizzle-lucia-auth-test npx drizzle-kit generate --dialect=sqlite --schema=
./src/db/schema.ts
2 tables
sessions 3 columns 0 indexes 1 fks
users 3 columns 1 indexes 0 fks

[✓] Your SQL migration file ➜ drizzle/0000_lush_william_stryker.sql 🚀
```

위와 같이 입력하지 않고 단순하게 generate하고 싶으면 drizzle.config.ts 파일을 아래와 같이 만들면 됩니다.

```ts
import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "sqlite", // "mysql" | "sqlite" | "postgresql"
  schema: "./src/db/schema.ts",
  out: "./drizzle",
});
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
	`email` text NOT NULL,
	`password` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);
```

Drizzle ORM으로 만들었던 sessions, users 테이블이 만들어졌네요.

이제 이 sql 파일을 이용해서 실제 DB에 migrate(이동) 해야 합니다.

먼저, 개발 서버를 위해 wrangler 로컬 파일쪽에 migrate 하겠습니다.

```sh
➜  bun-hono-drizzle-lucia-auth-test npx wrangler d1 execute hono-lucia-test-db --local --file=./drizzle/0000_lush_william_stryker.sql

 ⛅️ wrangler 3.67.1 (update available 3.68.0)
-------------------------------------------------------

🌀 Executing on local database hono-lucia-test-db (f6b7477f-25f4-4803-9bb2-c268c3e92538) from .wrangler/state/v3/d1:
🌀 To execute on your remote database, add a --remote flag to your wrangler command.
```

그리고 Cloudflare 서버에도 migrate 합시다.

'--local' 옵션을 '--remote' 옵션으로 바꿔주면 됩니다.

```sh
npx wrangler d1 execute hono-lucia-test-db --remote --file=./drizzle/0000_lush_william_stryker.sql
```

터미널창에 성공메시지가 뜰겁니다.

브라우저에서 Cloudflare 대시보드에 들어가 보면 아래와 같이 잘 나와있을겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgSEsCaIVn7kLaWjuy7VBEdyQ8Czt58iEBndIi6iXFji3OYglro0H8LWls_sYsex36Vywuk1GBW3tTW3X-falcXvQyXHms3rF2SCsUKL_aOSI_-Vgl6mmEIdUwOzJhKNZbHoW444WvCd8U5o4OTICC5XS9k7oVL_Rjqloio8LLa9lLfWRIi-lFB4DtGPDc)

![](https://blogger.googleusercontent.com/img/a/AVvXsEh1LKV1g8OEkvIkF5qLtTX6bccMIEAp3z2H5qCoAjybbuT9agqCK4OFw1aNy1KwY3DPSTY0I5YG84UQglQPpEZUi0VgfCRTPDxfFHWVF0DGADKXyz2EPxJlu9k378djePJo0e1TQsqLxCpjJlEthLjw-mvlMniMJLfKXxCP80iXz84BDBrCv5gE3O736No)

![](https://blogger.googleusercontent.com/img/a/AVvXsEjtgKzCBKHXonzCHEvoLzgf1lhITl1DyWdEkDbHDDwUkcuwMZdVNmgf9RbqJWl5f2lt2dYduwhhpHG2OSUR0qpMrFyWPRGYxk8vmC-B-ExqgITLK_U7UtDuVmUo8VgrMghZQFFvgc0WRlTa_sgNmE1ZS37WgMr1jo7rbPMoIpo_oUEjbSmVg5bbtnJlTW8)

---

## lucia 설정

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

위 파일의 내용은 Lucia에서 제공하는 이메일 패스워드 방식의 인증을 위한 가장 기본적인 설정이라 똑같이 작성하시면 됩니다.

특히 D1Adapter 부분에 넣는 항목인 'user', 'session' 항목에는 D1 DB에 만들었던 테이블 이름을 넣으면 됩니다.

아까 그림에 보시면 테이블 이름은 'user'가 아니라 'users'입니다.

헷갈리시면 안됩니다.

이제 만반의 준비가 끝났습니다.

---

## Hono를 이용해서 유저 가입하기 구현

로그인을 위해서는 먼저, 유저가 가입을 해야 겠죠.

그래서 "/signup" 라우팅을 작성해 봅시다.

src 폴더에 index.tsx 파일을 열어보면 아래와 같은데요.

```ts
import { Hono } from 'hono'
import { renderer } from './renderer'

const app = new Hono()

app.use(renderer)

app.get('/', (c) => {
  return c.render(<h1>Hello!</h1>)
})

export default app
```

'app'이라는 Hono 객체가 메인 엔트리 포인트입니다.

Cloudflare에서 Hono 프레임워크를 사용한다면 아주 쉽게 바인딩을 제공해 주는데요.

일단 src 폴더에 bindings.ts 파일을 아래와 같이 만듭시다.

```ts
import { Session, User } from "lucia";

export type Bindings = {
  DB: D1Database;
};

export type Variables = {
  user: User | null;
  session: Session | null;
};
```

그리고 아까 index.tsx 파일을 아래와 같이 바꿉시다.

```ts
import { Hono } from "hono";
import { renderer } from "./renderer";
import { Bindings } from "./bindings";

const app = new Hono<{ Bindings: Bindings }>();

app.use(renderer);

app.get("/", (c) => {
  return c.render(<h1>Hello!</h1>);
});

export default app;
```

이렇게 하면 Hono가 Cloudflare의 D1 DB를 확실하게 인식하게 됩니다.

그리고, 저는 로그인 부분을 "/" 라우팅과 별도로 만들고 싶어 admin.tsx 파일을 추가해 보겠습니다.

src 폴더에 'admin.tsx' 파일을 만듭시다.

lucia에서 Session, User 부분을 인식하기 위해 Hono를 만들 때 Bindings와 함께 Variables도 함께 지정해야 합니다.

```ts
import { Hono } from "hono";
import { csrf } from "hono/csrf";
import { renderer } from "./renderer";
import { Bindings, Variables } from "./bindings";

const admin = new Hono<{ Bindings: Bindings; Variables: Variables }>();

admin.use(csrf());

admin.use(renderer);

admin.get("/signup", (c) => {
  return c.render(<h1>Signup</h1>);
});

export default admin;
```

이제 admin 라우팅을 index.tsx 파일에서 import 해서 '/admin' 라우팅으로 지정해 주면 됩니다.

```ts
import { Hono } from "hono";
import { renderer } from "./renderer";
import { Bindings } from "./bindings";
import admin from "./admin";

const app = new Hono<{ Bindings: Bindings }>();

app.use(renderer);

app.get("/", (c) => {
  return c.render(<h1>Hello!</h1>);
});

app.route("/admin", admin);

export default app;
```

이제 개발 서버를 돌려 볼까요?

```sh
bun run dev

or 

npm run dev
```

브라우저에서 아래 주소로 이동해 봅시다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhVhAUw0QrRu3cFjmBXn7PikhTkc4hdrDbXcCW_q-2JuRJS50dHJXCxqPoa3jWTh0CsNWzTTLWgDzoItSvlKZ74OIfT0x9uwxHUj8MJHXsR_4X5o4H-ee11KJoksi9llBUALO-23yp0dWVFDs1inPPBD5rvyVWibf87VkfzRNmVA7xwNdhCoPD0NZ--44Q)

![](https://blogger.googleusercontent.com/img/a/AVvXsEgVcGsXOdb-hH8eBIwktg7VpNIFc2ateVtatHWHKWSOhykkvDq6l08DZ3I-l3s-lANs-U_cTMJ-Dr9LYc6cqid8QZa5ZiedvbO1nSBogYepz8mHVhsLSeiFPX4e5J6E2hRRaHwIQI4WeNyHIUPOHCCk32lM492Md_CxM9EQRB37xPHXccgtxi6-Ar0wC3o)

어떤가요?

정확히 작동하고 있네요.

---

## signup 폼과 POST 엔드포인트 작성

일단 signup을 위한 폼을 구성해야 하기 때문에 UI를 꾸며보겠습니다.

Hono도 JSX와 같은 컴포넌트 방식으로 앱을 꾸밀 수 있는데요.

src 폴더 밑에 pages란 폴더를 만들고 또 그 밑에 admin이란 폴더를 만듭시다.

`src/pages/admin/AdminSignup.tsx` 파일을 만들건데요.

```ts
export const AdminSignup = () => {
  return (
    <div>
      <h1>Sign up</h1>
      <form method="POST">
        <label for="email">Email</label>
        <input type="email" name="email" id="email" />
        <label for="password">Password</label>
        <input type="password" name="password" id="password" />
        <button type="submit">Sign up</button>
      </form>
    </div>
  );
};
```

CSS는 생각하지 않고 순수하게 HTML 태그만으로 구성했습니다.

이제 다시 admin.tsx 파일에서 '/signup' 라우팅을 아래와 같이 바꿔줍시다.

```ts
...
... 기존 코드와 동일
...

import { AdminSignup } from "./pages/admin/AdminSignup";

...
... 기존 코드와 동일
...

admin.get("/signup", (c) => {
  return c.render(<AdminSignup />);
});

export default admin;
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEim2gbjAi0Kg-q-tChPoqugzG7oLVYxV-8vXHJB1-oxXUxhfQ7x2NftLEk62mWMtMpvVyV4TBUZuta1IkzbF9p0Ha1vaaiO-sHEdsueWqsz5msTXL6cylgygKThiCQwbq3SzRS79n1P1kHf5B_iJqgRFsyOF91SfMaD_fgXpo9K92nmqQF2AkRgH1LnLlg)

실행결과 위와 같이 나올겁니다.

이제 테스트를 위해 더미 유저를 입력해 봅시다.

실제로 아래와 같이 나오는데요.

주소창은 같은 주소인데 "404 Not Found" 에러가 뜹니다.

왜냐하면 이 주소로 POST 메서드로 리퀘스트했기 때문입니다.

아직 POST 리퀘스트에 대응하는 Response를 리턴하는 Hono 코드를 작성하지 않아서입니다.

먼저, 폼 Validator를 위해 zod와 관련 패키지를 설치합시다.

```sh
bun add zod @hono/zod-validator
```

이제 다시 admin.tsx 파일에서 "/signup" 주소에 대한 POST ENDPOINT 대응 코드를 작성합시다.

```ts
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

...
... 기존 코드와 동일 (순서 상관 없음)
...

admin.post(
  "/signup",
  zValidator(
    "form",
    z.object({
      email: z.string().min(5).email(),
      password: z.string().min(4).max(255),
    })
  ),
  async (c) => {
    const { email, password } = await c.req.valid("form");
    console.log(email, password);

    return c.render(
      <h1>
        SignUp {email}, {password}{" "}
      </h1>
    );
  }
);
```

위와 같이 하면 됩니다.

실제 브라우저를 보면 아래와 같은데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiJxoT2dumDXH8-QAcXZ6Ka636loOxQRLcvzNT469aYDGhaEoM0GkA4yVwDyEJ5N1AIWZaq9vCMq74IeruEBX50BHE0OlwAQpdLj-qyMtIaXAafIoz3V7byI_Nfll8Lh_c_lqSrQ6fUq3xyOA39rEWLYJ7Mq4A0IA-ipikbRfEnaDmJI9mPuKzGWi5yTcY)

위와 같이 form에 입력했던 email과 password 값이 잘 나옵니다.

이제 form 에서 입력한 email과 password 값을 D1 DB에 저장해야 하는데요.

이 때 요긴하게 쓰이는게 바로 Drizzle-ORM입니다.

이제 아까 코드를 확장하겠습니다.

```ts
...
... 기존 코드와 동일 (순서 상관 없음)
...

import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { usersTable } from "./db/schema";
import { Scrypt } from "lucia";

...
... 기존 코드와 동일 (순서 상관 없음)
...

admin.post(
  "/signup",
  zValidator(
    "form",
    z.object({
      email: z.string().min(5).email(),
      password: z.string().min(4).max(255),
    })
  ),
  async (c) => {
    const { email, password } = await c.req.valid("form");
    console.log(email, password);

    const db = drizzle(c.env.DB);

    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    // console.log(existingUser);

    if (existingUser.length !== 0) {
      return c.json({ error: "User with that email already exists." }, 400);
    }

    const passwordHash = await new Scrypt().hash(password);
    const user = await db
      .insert(usersTable)
      .values({ email, password: passwordHash })
      .returning({ id: usersTable.id, email: usersTable.email });

    if (!user || user.length === 0) {
      return c.json({ error: "An error occured during sign up." }, 500);
    }

    return c.render(<h1>SignUp {JSON.stringify(user, null, 2)}</h1>);
  }
);
```

코드는 간단합니다.

form으로 입력받은 email과 password 데이터 값을 이용해서, 먼저 같은 email로 등록된 데이터가 있는지 점검한후에 없으면 db에 insert하는 로직인데요.

passwordHash는 lucia에서 제공해주는 Scrypt 함수를 사용했습니다.

실행결과는 아래와 같습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEja2jJ4VNaie9icrhbZRPGcw3PHpeVHPmgWWjK3Qyl1H6DMg3zL9U5DEmZaK1dmJkaqm5Jz4LP1O_RyL4cNyc1vPRKuuC40hg5Suo6Hzeeszcew2TZdHqfW_mXzqKsAHqr3-k5HRveAv5q0QdBqwqJwxuTm7F3DtZWW5e0Tqbt-rpb4COijjscDOwufzps)

코드가 제대로 작동하고 있네요.

그런데, signup 과정에서 가입하기가 끝나면 그 상태로 로그인 상태가 되야 하는데요.

그래서 lucia의 세션 저장 코드를 마저 작성해 봅시다.

```ts
...
... 기존 코드와 동일
...


const lucia = initializeLucia(c.env.DB);
const session = await lucia.createSession(user[0].id, {});
console.log(session);

const cookie = lucia.createSessionCookie(session.id);
console.log(cookie);

c.header("Set-Cookie", cookie.serialize(), { append: true });

// 나중에 사용할 코드
// return c.redirect("/admin");

return c.render(<h1>SignUp {JSON.stringify(user, null, 2)}</h1>);
```

위 코드와 같이 마지막 return 문 앞에 lucia의 createSession 관련 코드를 위와 같이 작성하면 됩니다.

위 코드는 lucia를 사용하면 사용해야하는 코드입니다.

콘솔창을 보면 아래와 같이 나올겁니다.

```sh
test3@test.com 1111
{
  id: '5nv72yi3qn2lsngfj7pa33lqipggawpkcsrt2y2c',
  userId: 'ir5jhcv5y6b3ty4',
  fresh: true,
  expiresAt: 2024-08-31T13:03:49.059Z
}
Cookie {
  name: 'auth_session',
  value: '5nv72yi3qn2lsngfj7pa33lqipggawpkcsrt2y2c',
  attributes: {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 2592000
  }
}
```

맨 처음에 입력했던 이메일과 패스워드값이 출력됐고, 그 다음에 lucia.createSession 함수로 만든 session 값이 출력됩니다.

마지막으로 lucia.createSessionCookie 함수로 만들어진 cookie 값이 출력되고 있습니다.

이제 크롬 개발창의 Application 쪽을 보면 쿠키값이 아래와 같이 보일겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgzTJpFVVkdgJr83n73pkeLpIjoOzu1XIiU-zvBotZMMNUWzgR6fzkxlbw1O0ovPOFGVjUvLumn3DaFcSxMuQuP7QUgO-w_-D64lAAKU-Mgy-PommseSfo1WFx0892sYH-w80Sr0PIqZWsaVsbFvTm3rRQy3Caiw4THhUjwuLTUhOqoxZgsDhOI18YRRqs)

가입하기 라우팅은 이제 완성됐네요.

그리고 마지막 return 문을 나중에는 "/admin" 라우팅으로 redirect 하는 코드를 추가하면 끝입니다.

가입한 후에는 "/admin" 초기화면으로 이동하는게 일반적이니까요.

---

## 로그인 로직 구현하기

가입하기 로직이 끝났으니 로그인 로직을 구현해야 합니다.

"/login" 라우팅으로 GET 메서드에 대응하는 거는 로그인 form을 보여주는 UI가 되겠고, POST 메서드에 대응하는 거는 실제 lucia를 이용해서 로그인하는 겁니다.

먼저, UI쪽인 GET 메서드에 대응해 보겠습니다.

```ts
import { AdminLogin } from "./pages/admin/AdminLogin";

...
...
...

admin.get("/login", (c) => {
  return c.render(<AdminLogin />);
});
```

위와 같이 코드를 짜고 다시 AdminLogin 컴포넌트를 작성하면 됩니다.

AdminLogin 컴포넌트는 당연히 `src/pages/admin/AdminLogin.tsx` 파일이 되는거죠.

```ts
export const AdminLogin = () => {
  return (
    <div>
      <h1>Log in</h1>
      <form method="POST">
        <label for="email">Email</label>
        <input type="email" name="email" id="email" />
        <label for="password">Password</label>
        <input type="password" name="password" id="password" />
        <button type="submit">Log in</button>
      </form>
    </div>
  );
};
```

실행해 보면 아래와 같이 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhm6QeUAL4QDJ2dcfutnUqbTT4-9swwXOMgHgZcqycHshvNFBZahtXEaOgKpbtIt5Bui0N1yM4hkjnczjzRNG2dLz7_JwgiaXsgcZAxPTpvAhGpFXP4aPJ3ZIPK9wuRf9jfZQ07hlrpTQsGkSJOU9glt2e3857UDuflfrozW0mjV0eWZ0Gc11j5j3Q1dZg)

이제 UI는 끝냈으니, POST 메서드에 대응하는 코드를 작성해 봅시다.

```ts
admin.post(
  "/login",
  zValidator(
    "form",
    z.object({
      email: z.string().min(1).email(),
      password: z.string().min(4).max(255),
    })
  ),
  async (c) => {
    const { email, password } = c.req.valid("form");
    console.log(email, password);

    const db = drizzle(c.env.DB);
    const user: SelectUser[] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (!user) {
      return c.json({ error: "Invalid email." }, 400);
    }
    if (user.length === 0) {
      return c.json({ error: "email does not exist." }, 400);
    }

    const isValidPassword = await new Scrypt().verify(
      user[0].password,
      password
    );
    if (!isValidPassword) {
      return c.json({ error: "Invalid password." }, 400);
    }

    const lucia = initializeLucia(c.env.DB);
    const session = await lucia.createSession(user[0].id, {});
    const cookie = lucia.createSessionCookie(session.id);

    c.header("Set-Cookie", cookie.serialize(), { append: true });

    return c.redirect("/admin");
  }
);
```

로그인 로직도 간단합니다.

form의 이메일 값을 이용해서 같은 이메일의 user 정보를 얻고, 그 user가 없다면 에러를 나타내주고,

에러가 없다면 해당 이메일의 user가 있다는 뜻이니, 그 다음에는 패스워드를 비교하면 됩니다.

패스워드 비교는 lucia에서 제공해주는 `Scrypt().verify` 메서드를 이용하면 됩니다.

패스워드가 틀리면 에러를 보여주면 되고, 만약 패스워드가 맞다면 유저가 제대로 로그인했다는 증거이기 때문에 이때는 lucia의 createSession, createSessionCookie을 이용해서 세션 쿠키를 만들어주면 됩니다.

그리고 다시 "/admin" 라우팅으로 redirect 해주면 끝입니다.

이렇게 로그인 로직은 끝났는데요.

---

## 미들웨어를 이용해서 유저 정보 유지하기

Hono에서는 미들웨어(Middleware)를 제공해 주는데요.

매번 유저 정보를 확인하는 코드를 만들필요없이 미들웨어에 등록해 놓으면 쉽게 코드를 구조화 할 수 있는데요.

Hono의 미들웨어는 middleware.ts 파일을 index.tsx 파일과 같은 위치에 작성하면 됩니다.

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

미들웨어 이름을 'authMiddleware'이라고 지었습니다.

미들웨어의 역할은 간단합니다.

유저가 로그인되어 있다는 전제하에 쿠키값을 읽어들이고 그 쿠키값에서 sessionId 값을 얻습니다.

만약, sessionId가 없다면 Hono의 글로벌 상태 값 저장 방식인 아래 코드처럼 user, sesion을 null로 만들어 버립니다.

```ts
c.set("user", null);
c.set("session", null);
```

만약, sessionId가 있다면 lucia에서 제공해주는 validateSession 함수를 이용해서 session 값을 얻습니다.

만약 session이 있고 session.fresh 값이 있다면 즉, 방금 로그인한 상태라면(fresh) lucia.createSessionCookie 함수를 이용해서 세션 쿠키를 만듭니다.

왜냐하면 fresh 상태이기 때문이죠.

만약 session이 없다면 createBlankSessionCookie 으로 처리하고, fresh 상태가 아니라면 현재 로그인되어 있다는 뜻이므로, Hono Context에 user값과 session 값을 저장합니다.

Hono Context 값에 저장한 값은 나중에 쉽게 불러올 수 있어 React로 치면 글로벌 상태 관리 같은겁니다.

그래서 코드 마지막에 보시면 user, session 값을 저장하고 있습니다.

```ts
c.set("user", user);
c.set("session", session);

return next();
```

그리고 Hono의 미들웨어는 Response를 리턴하는게 아니라 `next()`를 리턴해야 합니다.

미들웨어를 적용하려면 admin에 아래와 같이 추가해야 합니다.

```ts
import { authMiddleware } from "./middleware";

admin.use("*", authMiddleware);
```

미들웨어를 끝냈으니, `c.set("user", user)`로 Hono의 Context에 저장한 값을 이용해서 현재 로그인 되어 있고 없고에 따라 UI를 다시 보여주는 코드를 추가해야 코드가 깔끔해 집니다.

UI 부분이라 GET 메서드에 대응하는 코드만 바꾸면 됩니다.

```ts
admin.get("/login", (c) => {
  const user = c.get("user");
  if (user) {
    return c.redirect("/admin");
  }
  return c.render(<AdminLogin />);
});

admin.get("/signup", (c) => {
  const user = c.get("user");
  if (user) {
    return c.redirect("/admin");
  }
  return c.render(<AdminSignup />);
});
```

GET 메서드에 해당되는 라우팅은 "/login"과 "/signup" 라우팅 밖에 없습니다.

위와 같이 코드를 작성하면 즉, user 값이 있으면 그냥 "/admin" 페이지로 이동하면 끝입니다.

그러면 "/admin" 페이지의 UI를 조금 바꿔 봅시다.

```ts
admin.get("/", async (c) => {
  const user = c.get("user");
  console.log(user);
  if (user) {
    return c.render(
      <>
        <h1>Admin Home</h1>
        <div>you are logged in as {user.email}</div>
        <form method="POST" action="/admin/logout">
          <button type="submit">Logout</button>
        </form>
      </>
    );
  } else {
    return c.render(
      <>
        <h1>Admin Home</h1>
        <div>you need to login</div>
        <a href="/admin/login">Log in</a>
      </>
    );
  }
});
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEglMEgqiuD-fF9zlwfoGFnTwxfsABTOz-200y9uA1MKwpPJVcertibumjmxk0fVEt2He4goSqRzynAU3FTWCv4zNNk0rbxbpfhgM_dcz4kjgUL1ZzDIs4-ry_CBVZc_tHzqIR0E9WEhhjTAo18UWyec79h4tAY5Xnxm8p8KRj1uY1Bo61w9Y6eGCMSCeZg)

이제 `c.get("user")` 명령어로 쉽게 user 정보를 얻을 수 있습니다.

이제 남은건 log out 로직을 구현해야하는데요.

당연히 POST 메서드입니다.

다음과 같이 하면 됩니다.

```ts
admin.post("/logout", async (c) => {
  const lucia = initializeLucia(c.env.DB);

  const session = c.get("session");
  if (session) {
    await lucia.invalidateSession(session.id);
  }

  const cookie = lucia.createBlankSessionCookie();

  c.header("Set-Cookie", cookie.serialize(), { append: true });

  return c.redirect("/admin");
});
```

로그아웃 로직은 간답합니다.

invalidateSession 함수를 사용해서 session을 무력화시키고 쿠키도 빈 쿠키로 대체하는 겁니다.

createBlankSessionCookie 함수를 사용하면 실제로 쿠키가 삭제됩니다.

로그아웃 버튼을 누르면 잘 작동되는 걸 볼 수 있을 겁니다.

---

## 마무리

지금까지 Cloudflare, D1 DB, Lucia, Drizzle ORM을 이용해서 유저 로그인을 구현해 봤습니다.

UI만 TailwindCSS를 이용해서 작성하면 멋진 풀스택앱을 꾸밀 수 있을 겁니다.

그럼.
