---
slug: 2025-10-05-react-router-v-7-drizzle-orm-better-auth-guide
title: Better Auth + Drizzle ORM with React Router V7, 유저 로그인 시스템 구축하기
date: 2025-10-05 23:16:33.376000+00:00
summary: 최신 React Router V7 환경에서 Better Auth와 Drizzle ORM을 활용하여 이메일 OTP 기반의 안전하고 효율적인 인증 시스템을 구축하는 방법을 단계별로 알아봅니다.
tags: ["React Router V7", "Better Auth", "Drizzle ORM", "리액트 인증", "이메일 OTP", "사용자 인증", "프론트엔드 개발", "react"]
contributors: []
draft: false
---

안녕하세요?

서버리스 풀스택 앱을 원하는 1인 개발자로서 유저 로그인 즉 인증 기능은 프로젝트에 있어 거의 필수라고 볼 수 있는데요.

그래서 오늘은 최신 React Router V7 환경에서 Better Auth와 Drizzle ORM을 활용해 아주 근사한 인증 시스템을 구축하는 방법을 소개해 드리려고 합니다.

소개보다는 나중에 복습하려고 쓴 글이니 양해 바랍니다.

## 리액트 라우터 V7 프로젝트 생성

가장 먼저 리액트 라우터 프로젝트부터 생성해 줘야 하는데요.

아래 명령어를 터미널에 입력해 주면 됩니다.

```
npx create-react-router@latest react-router-better-auth
cd react-router-better-auth
npm run dev
```

## 인증 및 DB 관련 라이브러리 설치

프로젝트 생성이 완료되었다면, 이제 인증과 데이터베이스 처리에 필요한 라이브러리들을 설치할 차례입니다.

```
npm i better-auth drizzle-orm better-sqlite3
npm i -D drizzle-kit @types/better-sqlite3
```

## Better Auth 환경 변수 설정

다음으로는 Better Auth에서 사용할 환경 변수를 설정해야 하는데요.

사실 이번 튜토리얼에서 'BETTER_AUTH_SECRET'을 직접 사용하지는 않지만, 앞으로의 과정에서 필요하게 될 것 같아 미리 설정해두는 것이 좋을거 같습니다.

Better Auth 공식 문서에서도 맨 처음에 이 SECRET 설정하는 방법이 나오거든요.

프로젝트의 최상위 루트 위치에 `.env`라는 이름의 파일을 만들어줍니다.

```
BETTER_AUTH_SECRET=ExiR7W227PrSLSEBP6qcdl7e51EQCxcD
BETTER_AUTH_URL=http://localhost:5173 # Base URL of your app
```
참고로 BETTER_AUTH_URL도 공식 홈페이지에서 가져와 봤습니다.

## better-auth 설정 파일 구성하기

이제 본격적으로 인증 관련 설정을 시작해 볼 건데요.

Better Auth는 가장 기본적으로 Better Auth 관련 인스턴스 생성 관련 auth.ts 파일을 만드는 것을 추천합니다.

이름과 위치는 본인 프로젝트에 맞게 바꾸면 되는데요.

저는 일단 services 라는 명목으로 `auth.server.ts`라고 서버사이드라고 명시해서 만들 예정입니다.

`app/services/auth.server.ts` 경로에 파일을 생성하고 아래와 같이 코드를 작성해 주시면 됩니다.

```ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "~/db"; // 일단 작성만 해 둡니다.

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite", // or "mysql", "sqlite"
  }),
});
```

이 파일에서 `betterAuth` 함수를 사용해 인증 설정을 초기화하는데요.

데이터베이스 어댑터로는 'Drizzle'을 사용하고, 데이터베이스 종류는 'sqlite'로 지정해 주었습니다.

## 데이터베이스 설정

이번에는 데이터베이스 연결 설정을 할 차례인데요.

아까 import 했던 db 파일을 만들어야 합니다.

`app/db` 폴더와 `app/db/schema` 폴더를 차례로 만들고, 각 폴더 안에 `index.ts` 파일을 만듭시다.

먼저 `app/db/index.ts` 파일입니다.

```ts
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

export const db = drizzle("./db.sqlite3", { schema });
```

이 파일은 `app/db.ts`로 이름을 변경해도 괜찮은데요.

여기서 export하는 `db` 객체는 Drizzle 객체입니다.

drizzle 객체 생성의 첫 번째 파라미터는 데이터베이스 파일이 저장될 위치이고, 두 번째 파라미터는는 우리가 곧 생성할 스키마 파일입니다.

## drizzle.config.ts 파일 설정

이제 Drizzle의 설정을 구성해야 하는데요.

프로젝트 최상위 루트에 `drizzle.config.ts` 파일을 만들고 아래 내용을 추가 합니다.

```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./app/db/schema/index.ts",
  out: "./app/db/migrations",
  dbCredentials: {
    url: "file:./db.sqlite3",
  },
});
```

이 파일에는 스키마 파일의 위치(schema), 마이그레이션 파일이 생성될 폴더(out), 그리고 실제 데이터베이스 파일의 위치 정보(dbCredentials)가 담겨 있습니다.

## Drizzle ORM 스키마 파일 생성하기

원래는 데이터베이스 스키마 파일을 직접 손으로 다 작성해야 했거든요.

하지만 `better-auth/cli` 도구를 사용하면 이 과정을 아주 간단하게 자동화할 수 있습니다.

바로 아래 명령어를 실행해 스키마 파일을 만들어 보겠습니다.

```
npx @better-auth/cli generate
```

이 명령어는 기본적으로 'src'나 'app' 폴더 안에서 `auth.ts` 파일을 찾아 `auth.schema.ts` 파일을 생성하는데요.

우리 같은 경우에는 파일 경로와 이름이 다르기 때문에, 아래처럼 설정 파일(`--config 옵션`)과 결과물을 저장할 파일 경로(`--output 옵션`)를 직접 지정해 줘야 합니다.

```
npx @better-auth/cli generate --config=app/services/auth.server.ts --output=app/db/schema/index.ts
```

명령어를 실행하면 `app/db/schema/index.ts` 파일에 아래와 같은 스키마 코드가 자동으로 생성됩니다.

```ts
import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .default(false)
    .notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp_ms",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp_ms",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});
```

## 스키마를 실제 SQL로 마이그레이션하기

타입스크립트로 작성된 스키마 파일을 실제 SQL 파일로 변환할 차례인데요.

이 과정을 '마이그레이션'이라고 부릅니다.

아래 명령어를 실행해 SQL 파일을 생성해 보겠습니다.

```
✗ npx drizzle-kit generate
No config path provided, using default 'drizzle.config.ts'
Reading config file '/Users/******/Codings/react-router-better-auth/drizzle.config.ts'
4 tables
account 13 columns 0 indexes 1 fks
session 8 columns 1 indexes 1 fks
user 7 columns 1 indexes 0 fks
verification 6 columns 0 indexes 0 fks

[✓] Your SQL migration file ➜ app/db/migrations/0000_groovy_shockwave.sql 🚀
```

`drizzle.config.ts` 파일에 설정한 대로 `app/db/migrations` 폴더에 SQL 파일이 생성된 것을 볼 수 있습니다.

생성된 파일을 열어보면 실제 데이터베이스 테이블을 생성하는 SQL 구문이 들어있습니다.

```sql
CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer DEFAULT false NOT NULL,
	`image` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
```

이제 이 SQL 파일을 실제 데이터베이스에 적용해야 하는데요.

아래 `migrate` 명령어를 실행하면 됩니다.

```
✗ npx drizzle-kit migrate
No config path provided, using default 'drizzle.config.ts'
Reading config file '/Users/******/Codings/react-router-test/react-router-better-auth/drizzle.config.ts'
[✓] migrations applied successfully!%       
```

## Drizzle Studio로 데이터베이스 확인하기

Drizzle에는 데이터베이스를 시각적으로 확인하고 관리할 수 있는 Studio라는 멋진 도구가 있는데요.

Prisma에는 예전부터 있던 건데, Drizzle은 이제 생겼네요.

새로운 터미널을 열고 아래 명령어를 입력하면 `Drizzle Studio'가 실행됩니다.

```
✗ npx drizzle-kit studio
No config path provided, using default 'drizzle.config.ts'
Reading config file '/Users/********/Codings/react-router-better-auth/drizzle.config.ts'

 Drizzle Studio is up and running on https://local.drizzle.studio
```

## 이메일 OTP 인증 플러그인 설정

이제 본격적으로 Better Auth를 이용한 유저 로그인 기능을 구현해 볼건데요.

Better Auth에는 아주 여러가지 방식의 로그인 방법을 제공해 주는데, 우리가 맨 처음 사용할 방식은 이메일 OTP 기능입니다.

사용자가 이메일 주소를 넣으면 우리 서버가 해당 이메일로 OTP 번호를 알려주면, 유저가 해당 OTP를 로그인 화면에 입력하면 최종적으로 로그인 되는 방식입니다.

Better Auth는 이걸 plugins 방식으로 제공해주는데요.

`auth.server.ts` 파일을 열고 다음과 같이 `emailOTP` 플러그인을 추가해 봅시다.

```ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP } from "better-auth/plugins";
import { db } from "~/db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite", // or "mysql", "sqlite"
  }),

  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        console.log(`Sending ${type} OTP to ${email} ${otp}`)
        // if (type === "sign-in") {
        //   // Send the OTP for sign in
        // } else if (type === "email-verification") {
        //   // Send the OTP for email verification
        // } else {
        //   // Send the OTP for password reset
        // }
      },
    }),
  ],
});
```

지금은 실제 이메일을 직접 보내는 대신, 전달받은 파라미터들을 콘솔에 출력하도록 설정해 두었는데요.

나중에 실제 이메일 발송 서비스와 연동하는 부분은 바로 이 `sendVerificationOTP` 함수 안에서 처리하면 됩니다.

일단은 type에 따라서 추가로 email-verification도 할 수 있고, Password 리셋도 할 수 있는데요.

오늘은 단순히 'sign-in' 기능에만 집중하도록 하겠습니다.

## 로그인 폼 UI 만들기

이제 사용자가 이메일을 입력할 로그인 Form UI를 만들 차례인데요.

먼저 UI 작업을 편하게 하기 위해 'shadcn/ui'를 설치하겠습니다.

```
npx shadcn-ui@latest init
npx shadcn-ui@latest add input
npx shadcn-ui@latest add button
```

기본 템플릿에는 `routes.ts` 파일 설정 때문에 `home.tsx` 컴포넌트가 메인 화면으로 지정되어 있거든요.

이 `home.tsx` 파일을 아래와 같이 로그인 폼으로 수정해 보겠습니다.

```tsx
import { Form } from "react-router";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

export default function Home() {
  return (
    <div className="p-6 flex-1 flex flex-col justify-center items-center h-screen">
      <h1 className="text-xl font-semibold mb-6">Login Form</h1>
      <Form method="post" className="w-full max-w-sm">
        <Input name="email" placeholder="Enter your Email" />
        <Button type="submit" className="w-full mt-4">
          Submit
        </Button>
      </Form>
    </div>
  );
}
```

리액트 라우터의 `Form` 컴포넌트를 사용하고 `method`를 `post`로 지정했는데요.

이렇게 하면 폼이 제출될 때 같은 라우트의 `action` 함수가 호출됩니다.

이제 `action` 함수를 아래와 같이 선언해 주세요.

```tsx
import { Form } from "react-router";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import type { Route } from "./+types/home";
import { auth } from "~/services/auth.server";

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");

  await auth.api.sendVerificationOTP({
    body: {
      email: email as string,
      type: "sign-in",
    },
  });
  return {};
};


// UI는 아까랑 같습니다.
```

자, 이제 테스트해볼까요?

폼에 아무 이메일 주소나 입력하고 버튼을 누르면, 터미널에 아래와 같은 로그가 찍히는 것을 확인할 수 있습니다.


```sh
Sending sign-in OTP to test@test.com 010474
```

이것으로 이메일 OTP 인증의 첫 단계가 성공적으로 완료되었습니다.

Drizzle Studio에서 `verification` 테이블을 확인해 보면 테스트 데이터가 쌓여있는 것도 볼 수 있습니다.

## OTP 입력 필드 동적으로 보여주기

사용자 경험(UX) 측면을 생각해보면, 이메일을 제출한 뒤 같은 화면에서 바로 OTP를 입력하는 것이 자연스러운데요.

그래서 `step`이라는 상태 변수를 사용해서 OTP 입력 필드를 조건부로 보여주도록 코드를 수정해 보겠습니다.

먼저 UI 코드입니다.

`actionData`로부터 `step` 값을 받아와서, 그 값이 'otp'일 때만 OTP 입력 필드를 보여주는 방식입니다.

```tsx
export default function Home({ actionData }: Route.ComponentProps) {
  const step = actionData?.step || "email";
  return (
    <div className="p-6 flex-1 flex flex-col justify-center items-center h-screen">
      <h1 className="text-xl font-semibold mb-6">Login Form</h1>
      <Form method="post" className="w-full max-w-sm">
        <input type="hidden" name="step" value={step} />
        <Input name="email" placeholder="Enter your Email" />
        {step === "otp" && <Input name="otp" placeholder="Enter your OTP" />}
        <Button type="submit" className="w-full mt-4">
          Submit
        </Button>
      </Form>
    </div>
  );
}
```

다음으로 `action` 함수도 조금 추가해야 하는데요.

`step` 값에 따라 분기 처리를 하도록 코드를 수정해 줍시다.

이메일 단계에서는 OTP를 보내고 `step`을 'otp'로 변경해서 반환하고, OTP 단계에서는 실제 로그인을 시도합니다.

```tsx
export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const step = formData.get("step") as string;
  const otp = formData.get("otp");

  if (step === "email") {
    await auth.api.sendVerificationOTP({
      body: {
        email: email as string,
        type: "sign-in",
      },
    });

    return { step: "otp" };
  }
  const result = await auth.api.signInEmailOTP({
    returnHeaders: true,
    body: {
      email: email as string,
      otp: otp as string,
    },
  });
  console.log(result);
  return {}; // 일단 빈 객체를 리턴합니다.
};
```

## OTP 제출 및 결과 확인

지금은 로그인 성공 시 `result` 객체를 콘솔에 찍어보도록 했는데요.

왜냐하면 이 객체에 어떤 정보가 담겨있는지 확인하는 것이 중요하기 때문입니다.

만약 잘못된 OTP를 입력하면 이렇게 'InternalAPIError' 에러가 발생하는 것을 볼 수 있거든요.

```sh
Sending sign-in OTP to test@test.com 911105
[InternalAPIError: Invalid OTP] {
  status: 'BAD_REQUEST',
  body: { code: 'INVALID_OTP', message: 'Invalid OTP' },
  headers: {},
  statusCode: 400
}
```

반면, 정확한 OTP를 입력하면 헤더 정보와 함께 토큰, 사용자 정보가 담긴 응답 객체를 받게 됩니다.

```sh
Sending sign-in OTP to test@test.com 984534
{
  headers: HeadersList {
    cookies: [
      'better-auth.session_token=nxwpVkUS6vAvOUC8xTyE33AiXX6FNiKk.VsA7deWn8GKHT3G1sG8E10uasTO3irlspBzvC32uwH4%3D; Max-Age=604800; Path=/; HttpOnly; SameSite=Lax'
    ],
    [Symbol(headers map)]: Map(1) { 'set-cookie' => [Object] },
    [Symbol(headers map sorted)]: null
  },
  response: {
    token: 'nxwpVkUS6vAvOUC8xTyE33AiXX6FNiKk',
    user: {
      id: 'uBXsASnjSTNy44Jfm767l2eehGynm071',
      email: 'test@test.com',
      emailVerified: true,
      name: '',
      image: null,
      createdAt: 2025-10-05T05:38:37.995Z,
      updatedAt: 2025-10-05T05:38:37.995Z
    }
  }
}
```

Better Auth가 유저 인증하는 방식이 바로 이런 방식입니다.

## 로그인 성공 후 대시보드로 리다이렉트

로그인에 성공했다면, 보통은 이제 사용자를 대시보드 페이지로 이동시켜야 하는데요.

`action` 함수의 마지막 부분을 아래와 같이 수정하면 됩니다.

```ts
import { Form, redirect } from "react-router";

// console.log(result);
  return redirect("/dashboard", { headers: result.headers });
}
```

리액트 라우터의 `redirect` 함수를 사용하고, 두 번째 인자로 `result` 객체에 있던 `headers`를 그대로 넘겨주는 것이 핵심입니다.

이제 `routes` 폴더 안에 `dashboard.tsx` 파일을 만들고, `routes.ts` 파일에 새로운 라우트를 추가해 줍시다.

먼저, 리액트 라우터의 라우터 추가를 위한 파일입니다.

`routes.ts`
```ts
import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
] satisfies RouteConfig;
```

그리고 유저가 로그인 했을 경우 이동하는 대시보드 파일입니다.

`dashboard.tsx`
```tsx
const DashboardPage = () => {
  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
};

export default DashboardPage;
```

## 대시보드 페이지 보호하기 (Protected Route)

대시보드 페이지는 보통 로그인한 사용자만 접근할 수 있어야 하는데요.

이제 이 페이지를 보호하는 로직을 구현해 보겠습니다.

리액트 라우터의 `loader` 함수를 사용하면 페이지가 렌더링되기 전에 서버 사이드에서 데이터를 불러오거나 특정 로직을 실행할 수 있어 유저가 로그인 되어 있는지 확인하기 가장 최고의 장소입니다.

`dashboard.tsx` 파일에 아래 `loader` 함수를 추가하면 됩니다.

```tsx
import { auth } from "~/services/auth.server";
import type { Route } from "./+types/dashboard";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) redirect("/");
  console.log(session);

  return {};
};
```

요청 헤더를 이용해 세션 정보를 가져오고, 만약 세션이 없다면 홈으로 리다이렉트시키는 아주 간단한 로직입니다.

Better Auth는 해당 세션 정보를 얻어오는 헬퍼 함수인 getSession 함수를 제공해 줍니다.

브라우저를 새로고침 해보면 터미널에 아래와 같이 세션 정보가 출력되는 것을 볼 수 있습니다.

```sh
{
  session: {
    expiresAt: 2025-10-12T05:46:13.582Z,
    token: 'vwoGqJyjC3fBEbrSqZmNvfwg3eUXwcbr',
    // ...
    id: 'LEs2jKKRhFyu5SM9IQ46S548M5wR4wx5'
  },
  user: {
    name: '',
    email: 'test@test.com',
    // ...
    id: 'uBXsASnjSTNy44Jfm767l2eehGynm071'
  }
}
```

`loader` 함수에서 반환하는 값은 UI 컴포넌트에서 `loaderData` prop으로 받을 수 있기 때문에, 세션 정보를 클라이언트로 전달할 수도 있습니다.

```tsx
export const loader = async ({ request }: Route.LoaderArgs) => {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) redirect("/"); // 로그인 안 되어 있으면 대시보드 페이지에서 루트로 바로 이동시켜버림.
  
  return { session };
};

const DashboardPage = ({ loaderData }: Route.ComponentProps) => {
  const session = loaderData.session;
  
  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
};
```

참고로 브라우저 개발자 도구의 Application 탭을 보면, `better-auth.session_token`이라는 쿠키가 생성된 것을 확인할 수 있습니다.

## 로그아웃 기능 구현하기

드디어 마지막 단계인 로그아웃 기능입니다.

대시보드 페이지에 로그아웃 버튼을 추가하고, 버튼 클릭 시 `action` 함수가 호출되도록 `Form`으로 감싸주면 됩니다.

`dashboard.tsx`
```tsx
import { auth } from "~/services/auth.server";
import type { Route } from "./+types/dashboard";
import { Form, redirect } from "react-router";
import { Button } from "~/components/ui/button";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) redirect("/");

  return { session };
};


const DashboardPage = ({ loaderData }: Route.ComponentProps) => {
  const session = loaderData.session;

  return (
    <div>
      <h1>Dashboard</h1>
      {session && <h2>you're logged in as {session.user.email}</h2>}
      <Form method="post">
        <Button type="submit" className="w-full mt-4">
          Sign Out
        </Button>
      </Form>
    </div>
  );
};

export default DashboardPage;
```

'Sign Out' 버튼을 클릭하면 'method' 방식이 'post'인 Form이 서버로 전송되는데요.

리액트 라우터에 의해 같은 라우트의 `action` 함수가 호출됩니다.

이제 로그아웃을 처리할 `action` 함수를 만들 차례입니다.

```ts
export const action = async ({ request }: Route.ActionArgs) => {
  await auth.api.signOut({ headers: request.headers });
  return redirect("/");
};
```

이 모든 과정은 서버 사이드에서 일어나는데요.

`auth.api`의 `signOut` 함수를 호출하기만 하면 됩니다.

그냥 세션과 쿠키 정보가 담긴 `request.headers`를 넘겨주면 됩니다.

---

이것으로 React Router, Better Auth, 그리고 Drizzle ORM을 활용한 이메일 OTP `로그인, 로그아웃` 기능 구현이 모두 끝났는데요.

다음 시간에는 이메일과 비밀번호를 이용한 기본 로그인 방식과 깃헙(Github), 구글(Google) 같은 소셜 로그인 연동에 대해서도 다뤄볼 예정인데요.

긴 글 읽어주셔서 감사하고, 다음 포스팅에서 또 유용한 내용으로 찾아뵙겠습니다.

---
