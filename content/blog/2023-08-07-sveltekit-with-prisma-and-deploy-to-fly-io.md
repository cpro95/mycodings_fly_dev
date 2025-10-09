---
slug: 2023-08-07-sveltekit-with-prisma-and-deploy-to-fly-io
title: SvelteKit 실전 예제 4편 - Prisma 설치 후 백 엔드 DB 세팅 및 클라우드에 자동 배포하기
date: 2023-08-07 11:57:32.593000+00:00
summary: Dockerfile 세팅해서 자동으로 Prisma 설치 및 초기 데이터 세팅까지
tags: ["prisma", "sveltekit", "sveltejs", "fly.io"]
contributors: []
draft: false
---

안녕하세요?

이번 시간에는 좀 더 어려운 주제인데요.

바로 Sveltekit에서 백 엔드에서 작동하는 DB 세팅 방법과 Fly.io에 배포까지 할 수 있는 Dockerfile을 작성할 예정입니다.

**-지난 시간 강좌 보기-**

[SvelteKit 실전 예제 - Fly.io에 배포(deploy)하기 with 서버 사이드 렌더링](https://mycodings.fly.dev/blog/2023-08-03-how-to-deploy-sveltekit-to-fly-io-with-server-side-rendering)

[SvelteKit 실전 예제 2편 - 서버 사이드 렌더링 풀 스택 무비 앱 만들기](https://mycodings.fly.dev/blog/2023-08-05-sveltekit-server-side-full-stack-example-and-fly-io-deploy)

[SvelteKit 실전 예제 3편 - Github Action으로 자동 배포하기(Auto Deploy)](https://mycodings.fly.dev/blog/2023-08-07-sveltekit-auto-deploy-with-github-action-to-fly-io)

그러면 시작하겠습니다.

---

## Prisma

Next.js나 Remix Framework으로 풀 스택 애플리케이션을 만들 때 가장 많이 쓰이는 백 엔드 DB 관련 ORM은 바로 Prisma인데요.

MySql, PostgreSQL, MongoDB, Sqlite3 등 다양한 데이터베이스를 지원합니다.

한 개의 코드로 DB 유형을 바꿔 가면서 세팅할 수 있어 아주 편한데요.

오늘은 개발 서버 및 블로그 강좌라서 sqlite3 로 개발 하겠습니다.

## Prisma 설치

먼저, 아래와 같이 명령어를 실행합니다.

```bash
npx prisma init --datasource-provider sqlite
```

이 명령어를 실행하면 prisma 세팅 파일이 생기는데요.

.env 파일과 그리고 prisma 폴더가 생깁니다.

prisma 폴더에는 schema.prisma 파일이 생기는데요.

데이터베이스의 뼈대를 구성하는 기초 파일입니다.

우리는 DB 테스트를 위해 User 모델로 로그인을 구현해 보도록 하겠습니다.

그래서 schema.prisma 파일에 model User 부분을 추가해 주십시오.

```bash
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id            String @id @default(uuid())
  username      String @unique
  passwordHash  String
  userAuthToken String @unique
  role          String @default("USER")

  createAt  DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

이제 Prisma를 자바스크립트에서 사용할 수 있는 PrismaClient를 설치해야 합니다.

```bash
npm i @prisma/client
```

일단 여기까지 진행했으면 PrismaClient를 생성해야 하는데요.

두 가지로 진행해야 합니다.

node_modules 부분과 코드 부분입니다.

먼저, node_modules 부분에서는 아래와 같이 명령어를 실행시키면 됩니다.

```bash
npx prisma db push
```
라고 실행하면 아래와 같이 실행됩니다.

```bash
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": SQLite database "dev.db" at "file:./dev.db"

SQLite database dev.db created at file:./dev.db

🚀  Your database is now in sync with your Prisma schema. Done in 27ms

✔ Generated Prisma Client (5.1.1 | library) to ./node_modules/@prisma/client in 96ms
```

즉, .env 파일에 있는 DATABASE_URL 변수를 읽어서 디스크 상에 실제 db 파일을 만듭니다.

그리고 Prisma Client를 코드 부분에서 만들어 주는데요.

Prisma Client 클라이언트를 생성하는 명령어는 다음과 같습니다.

```bash
npx prisma generate
```

다시 한번 실행해도 괜찮습니다.

이제 코드 부분에서 PrismaClient를 세팅해야 하는데요.

src/lib 폴더에 database.ts 파일을 만듭시다.

```js
import prisma from "@prisma/client";

export const db = new prisma.PrismaClient();
```

이제 우리는 Prisma를 사용할 수 있는 제반사항을 모두 만들었는데요.

## DB에 자동으로 초기값 넣는 seed 파일 만들기

Prisma는 애플리케이션 처음 빌드시 DB 값을 초기화할 수 있는 seed 파일을 제공하는데요.

먼저, package.json 파일에서 맨 끝에 아래처럼 코드를 추가합니다.

```js
  "prisma": {
      "seed": "node prisma/seed.js"
    }
```
package.json 에서 prisma 항목이란 걸 만들었고, 실제 이 부분은 Prisma가 직접 사용하는 부분입니다.

코드를 보시면 seed 부분이 node 명령어 실행 이란걸 볼 수 있는데요.

이제 이 seed.js 파일을 만들도록 하겠습니다.

prisma 폴더에 만들면 됩니다.

```js
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import crypto from 'crypto';

const prisma = new PrismaClient();

async function seed() {
    const username = "test";

    // cleanup the existing database
    await prisma.user.delete({ where: { username: username } }).catch(() => {
        // console.log("Delete database")
    });

    const hashedPassword = await bcrypt.hash("1234", 10);

    const user = await prisma.user.create({
        data: {
            username: username,
            passwordHash: hashedPassword,
            userAuthToken: crypto.randomUUID(),
            role: "ADMIN"
        },
    });

    if (user) console.log(`Database has been seeded.!\n${user}`);
}

seed()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
```

코드를 보시면 User 테이블에 신규 사용자를 직접 집어넣는 코드인데요.

천천히 보시면 쉽게 이해할 수 있을 겁니다.

그리고 이걸 실행하기 위해서는 bcrypt 패키지가 필요합니다.

bcrypt는 암호를 해시 하는 툴입니다.

```js
npm i bcrypt
npm i -D @types/bcrypt prisma
```

그리고 여기서 prisma도 직접 설치하게끔 명령어를 작성했습니다.

이제 준비가 끝난 거 같은데요.

## 실제 DB 적용하기

이제 마이그레이션이란 걸 해야 하는데요.

Schema 파일을 SQL 파일로 변환해 주는 겁니다.

```bash
npx prisma migrate dev
```

```bash
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": SQLite database "dev.db" at "file:./dev.db"

Drift detected: Your database schema is not in sync with your migration history.

The following is a summary of the differences between the expected database schema given your m
igrations files, and the actual schema of the database.                                        
It should be understood as the set of changes to get from the expected schema to the actual sch
ema.                                                                                           
If you are running this the first time on an existing database, please make sure to read this d
ocumentation page:                                                                             https://www.prisma.io/docs/guides/database/developing-with-prisma-migrate/troubleshooting-devel
opment                                                                                         
[+] Added tables
  - User

[*] Changed the `User` table
  [+] Added unique index on columns (userAuthToken)
  [+] Added unique index on columns (username)

✔ We need to reset the SQLite database "dev.db" at "file:./dev.db"
Do you want to continue? All data will be lost. … yes

✔ Enter a name for the new migration: … 
Applying migration `20230807122145_`

The following migration(s) have been created and applied from new schema changes:

migrations/
  └─ 20230807122145_/
    └─ migration.sql

Your database is now in sync with your schema.

✔ Generated Prisma Client (5.1.1 | library) to ./node_modules/@prisma/client in 115ms


Running seed command `node prisma/seed.js` ...
Database has been seeded.!
[object Object]

🌱  The seed command has been executed.
```

마이그레이션을 하니까 prisma seed 까지 완벽히 실행 했네요.

실제 sqlite DB 파일에 들어가 볼까요?

```bash
cd prisma
sqlite3 dev.db
```
위와 같이 실행하고 아래와 같이 User 부분의 레코드를 select 해보면 test 유저가 잘 보입니다.

```bash
SQLite version 3.37.0 2021-12-09 01:34:53
Enter ".help" for usage hints.
sqlite> select * from user;
f3f9d8c8-d19d-43ef-9660-a58f68effe67|test|$2b$10$WF/xmu4abbapYjkZfuHM/.Dpr2t9KSMEF8jayiNGTNjSdy
tAmUtb2|3d06c60f-fb6d-4d78-9270-58d7c6d3b50e|ADMIN|1691410906968|1691410906968   sqlite> .quit
```

그러면 이제 Prisma를 이용해서 SvelteKit에서 코드를 작성해 볼까요?

---

## get_user API 엔드포인트 만들기

DB는 백엔드이기 때문에 서버사이드에서 작동합니다.

API를 만들어 놓으면 클라이언트 사이드에서나 백 엔드 사이드에서나 언제든지 자유롭게 사용할 수 있어서 아주 유용한데요.

api/get_user 경로로 API 엔드 포인트를 하나 만들겠습니다.

src/routes/api/get_user/+server.ts 파일을 만듭니다.

```js
import { db } from "$lib/database";
import { json } from "@sveltejs/kit";

async function getUser() {
  try {
    const user = await db.user.findMany({
      where: { role: "ADMIN" },
    });
    return user;
  } catch (e) {
    throw new Error(`Could not find User`);
  }
}

export async function GET() {
  const user = await getUser();
  return json(user);
}
```

테스트를 위해 role 이 "ADMIN"인 걸 찾는 코드인데요.

HTTP GET 메서드로 작동하는 코드입니다.

저장하고 개발서버를 돌려볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEjLgj0NuFd4ZHgGwGGxoh3DVZbx_8m_PwQd4lsY7RlqZZ-zZ0aE3fR11Zu38Bgu8KRh6p-yes17hdpASRbMRYxsLZqpbBiEJRsElXj9xiQdXNWEID8F3Kq7jNOr-4GKPXPy8FZMVLNYq1gkdvTu_odqx1r4anJVqF_lolkhmDEaSwHuoDxGzVdPMwyfuA0)

get_user 부분이 아주 잘 작동하네요.

## API 엔드 포인트를 활용하여 페이지에 뿌리기

이제 우리 앱의 최상단 경로인 '/'에 user 부분을 화면에 뿌려주겠습니다.

온전히 테스트를 위한 작업입니다.

/src/routes/+page.server.ts 파일을 열어보시면 지난 시간에 작성한 popularMovies 얻는 코드가 있는데요.

거기에 이어서 User 부분도 얻는 코드를 작성하겠습니다.

```js
export async function load({ fetch }) {
  const response = await fetch("api/get_popular_movies");
  const popularMovies = await response.json();

  const response2 = await fetch("api/get_user");
  const user = await response2.json();

  return { popularMovies, user };
}
```

이제, +page.svelte 파일에서 직접 화면에 뿌리는 코드를 추가해 보겠습니다.

```js
<script lang="ts">
  export let data;

  const popularMovies = data.popularMovies.results;
  const user = data.user[0];
  console.log(user);
</script>

<h1 class="text-4xl font-bold">Welcome to SvelteKit</h1>

{#if user.username}
  <h2 class="text-2xl font-semibold">Hello! {user.username}</h2>
{:else}
  <h2 class="text-2xl font-semibold">Hello! There!</h2>
{/if}

<ul class="p-4 mt-4">
  {#each popularMovies as movie}
    <li>
      <a href={`/${movie.id}`}>
        {movie.title} / {movie.vote_average}
      </a>
    </li>
  {/each}
</ul>
```

실행결과를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEgK4gAhljPs00KQjT_wLHbH1LkPyV0JWv8D4wG_wuKC9bkyTJdDKBwWL_KIuq7xJBWXO2iKBA2d36dV44ubGkGsTa1gmJ3tG_QMWGmUJRNZRDqiEFmGhPqKSCErLjLVPZUFGt5TvEHGcGbnouZQQnZaeEkaJ1cNhwpDCXtIjOsCzTKzfP26X7OxwtEIufg)

위와 같이 User 부분도 잘 나오네요.

---

## Fly.io에 배포하기

현재 로컬상 개발 서버에서는 정상 작동하는데요.

그러면 Fly.io에 배포했을 때도 똑같이 작동하느냐가 문제인데요.

Fly.io에 Prisma가 작동되게 하려면 많은 잡다한 작업을 해줘야 합니다.

## Volumes 찾기

Fly.io는 도커로 움직이는데요.

그런데 Fly.io는 따로 DB용 디스크도 지원해 줍니다.

우리는 이걸 1GB 형식으로 지정할 수 있는데요.

일단 지금 상태를 살펴볼까요?

```bash
sveltekit-deploy-on-fly-io git:(main) ✗ flyctl volumes list
```

위와 같이 명령어를 치시면 아래와 같이 나오는데요.

```bash
ID                      STATE   NAME    SIZE    REGION  ZONE    ENCRYPTED       ATTACHED VM   CREATED AT  
vol_0o6d4230231r87gy    created data    1GB     nrt     fe01    true            e784e669a416389 hours ago                                                                                   
```

저 같은 경우는 NAME이 data인 디스크로 1GB가 nrt REGION(도쿄)이 있다는 뜻입니다.

만약 없다면 아래 명령어로 직접 만들면 됩니다.

```bash
fly volumes create data --size 1 --app my-svelteki-test2
```

디스크 이름은 data로 정했으며 1GB이고 해당 앱은 my-svelteki-test2 입니다.

자 이제, DB를 위힌 디스크 스페이스도 확보했으니까 본격적인 배포작업에 들어가 보겠습니다.

## fly.toml 파일 수정하기

일단 Fly.io에 Prisma DB 사용을 위한 도커를 올리기 위해서는 몇 가지 기법이 적용되는데요.

일단 아래와 같이 fly.toml 파일에서도 실험적으로 제공해 주는 기능을 사용해야 합니다.

```toml
# fly.toml app configuration file generated for my-svelteki-test2 on 2023-08-03T22:20:33+09:00
#
# See https://fly.io/docs/reference/configuration/ for information about how to use this file.
#

app = "my-svelteki-test2"
primary_region = "nrt"

[env]
  DATABASE_URL = "file:/data/sqlite.db"

[experimental]
  allowed_public_ports = []
  auto_rollback = true
  cmd = "start.sh"
  entrypoint = "sh"
  
[mounts]
  source = "data"
  destination = "/data"

[http_service]
  internal_port = 3000
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0
  processes = ["app"]
```

위 파일에서 제일 중요한 부분이 바로 mounts인데요.

data라는 이름의 우리 디스크 스페이스를 경로명 "/data"로 마운트 한다는 뜻입니다.

나중에 콘솔에서 직접 보여드리겠습니다.

그리고, 위 파일을 보시면 env 부분에 DATABASE_URL 값이 있습니다.

이 변수의 값이 file:/data/ 로 시작하는데요.

/data 경로는 아까 우리가 만들었던 디스크 스페이스를 가리킵니다.

즉, /data 폴더 밑에 sqlite.db 파일이름으로 하라는 얘기죠.

그리고, experimental 부분에 cmd 부분과 entrypoint가 있는데요.

이 건 실제, bash 파일을 실행시킬 수 있는 기능입니다.

start.sh 파일을 우리 프로젝트 최상단에 작성합시다.

package.json 파일과 같은 위치입니다.

```sh
#!/bin/sh

# This file is how Fly starts the server (configured in fly.toml). Before starting
# the server though, we need to run any prisma migrations that haven't yet been
# run, which is why this file exists in the first place.
# Learn more: https://community.fly.io/t/sqlite-not-getting-setup-properly/4386

set -ex

# Finally start the app
npx prisma migrate deploy
npx prisma db seed
npm run start
```

위 코드를 보시면 prisma 부분을 실행시켜 주면서 마지막으로 서버를 구동하는 "npm run start"를 실행시키는 코드인데요.

이 코드가 최종적으로 우리 서버를 시작하는 파일 인거죠.

## Dockerfile 개조하기

마지막으로 본격적으로 Dockerfile을 개조해야 하는데요.

전체 내용은 아래와 같습니다.

```bash
# base node image
FROM node:16-bullseye-slim as base

# set for base and all layer that inherit from it
ENV NODE_ENV production

ENV DATABASE_URL=file:/data/sqlite.db
ENV NODE_ENV="production"

# Set TMDB API key at build time
ARG TMDB_API_KEY
ENV VITE_TMDB_API_KEY=$TMDB_API_KEY

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl sqlite3

# Install all node_modules, including dev dependencies
FROM base as deps

WORKDIR /myapp

ADD package.json .npmrc ./
RUN npm install --include=dev

# Setup production node_modules
FROM base as production-deps

WORKDIR /myapp

COPY --from=deps /myapp/node_modules /myapp/node_modules
ADD package.json .npmrc ./
RUN npm prune --omit=dev

# Build the app
FROM base as build

WORKDIR /myapp

COPY --from=deps /myapp/node_modules /myapp/node_modules

ADD prisma .
RUN npx prisma generate

ADD . .
RUN npm run build

# Finally, build the production image with minimal footprint
FROM base

WORKDIR /myapp

COPY --from=production-deps /myapp/node_modules /myapp/node_modules
COPY --from=build /myapp/node_modules/.prisma /myapp/node_modules/.prisma

COPY --from=build /myapp/build /myapp/build
COPY --from=build /myapp/package.json /myapp/package.json
COPY --from=build /myapp/start.sh /myapp/start.sh
COPY --from=build /myapp/prisma /myapp/prisma

ENTRYPOINT [ "./start.sh" ]
```

이 Dockerfile에서 TMDB_API_KEY, DATABASE_URL 같은 환경 변수도 지정했는데요.

하나하나 따져보면 쉽게 이해할 수 있을 겁니다.

---

## Github Action으로 Deploy하기

이제 실제 배포해 볼까요?

```bash
git add .

git commit -m "prisma setting ended"

git push
```

위와 같이 하면 현재 상태로 Github에 Push가 되면서 우리가 지난 시간에 만들었던 Github Action이 작동되면서 자동으로 fly.io에 배포가 되는데요.

한참 기다리고 나면 성공했다고 나오는데요.

이제, 실제 주소로 접속해 봅시다.

그러면 아래와 같이 API 엔드 포인트까지 정상 작동한다고 나올 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEg_EBOo4fBR1XW82MW_LLBktAbP4gWlU2KzT8h8Ljxpg5hBhsOCIhhzEq69PvGP5JxEktwGpm7_eHgM262UADJBwqyZqdykBKQFq5lLVdx98bM98DJD6hM3SD19a6A0F9ECTgbwUdG-zGJuNzfI-s3o_6dX9cHzASugPKUCTMOlboB01E1SOnPXKrI_O_U)

![](https://blogger.googleusercontent.com/img/a/AVvXsEjptdanwxHrWtXEQlcC6KIHINM3IYF7O-ByHaWqnX_RhOz_fz2759po1BRuRbIU48FRu_BoUWGuy_aXftYmTM5TncVkVMYSQkw5FZ7sFIAnjzTTzVxs8QiaNQ9E0L_pXrzoVwi8CrZQ_vf6vu2c1x1VsJnrBkJKXZUSnkOE7shLHogSy_W947HQFiiICA4)

이제, 실제 fly.io 도커 이미지가 있는 가상머신으로 ssh 접속해 볼까요?

```bash
fly ssh console
```

ssh 접속하면 우분투 콘솔에 접속하게 되는데요.

아래와 같이 데이터를 확인해 보면 Dockerfile로 우리가 작성했던 게 다 나올 겁니다.

```bash
➜  sveltekit-deploy-on-fly-io git:(main) ✗ fly ssh console
Connecting to fdaa:0:57cc:a7b:17c:5313:2eed:2... complete
root@e784e669a41638:/myapp# ls -al
total 28
drwxr-xr-x  5 root root 4096 Aug  7 11:53 .
drwxr-xr-x 24 root root 4096 Aug  7 12:52 ..
drwxr-xr-x  4 root root 4096 Aug  7 11:53 build
drwxr-xr-x 76 root root 4096 Aug  7 11:53 node_modules
-rw-r--r--  1 root root 1225 Aug  7 11:52 package.json
drwxr-xr-x  3 root root 4096 Aug  7 11:53 prisma
-rw-r--r--  1 root root  688 Aug  7 11:52 start.sh
root@e784e669a41638:/myapp# ls -l /data
total 44
drwx------ 2 root root 16384 Aug  7 07:21 lost+found
-rw-r--r-- 1 root root 28672 Aug  7 12:52 sqlite.db
root@e784e669a41638:/myapp# 
```

"/data" 이 경로는 우리가 만든 1GB의 디스크 스페이스로 여기에 sqlite.db 파일이 저장되어 있습니다.

실제 우분투 가상 머신의 디스크 구조를 보시면 아래와 같습니다.

```bash
root@e784e669a41638:/myapp# df -h
Filesystem      Size  Used Avail Use% Mounted on
devtmpfs         97M     0   97M   0% /dev
/dev/vda        7.8G  300M  7.1G   4% /
shm             109M     0  109M   0% /dev/shm
tmpfs           109M     0  109M   0% /sys/fs/cgroup
/dev/vdb        974M   52K  908M   1% /data
root@e784e669a41638:/myapp# 
```

어떤가요?  "/data" 부분이 908M로 거의 1GB인 게 확인되실 겁니다.

그리고 "/" 경로는 우분투가 올려져 있는 곳인데요.

이렇게 DB 저장소를 다른 볼륨으로 하는 이유는 왜냐하면 우리가 앱을 업그레이드나 업데이트하면 Docker가 앱을 전부 새로 만들기 때문입니다.

그러면 기존에 가지고 있던 DB 부분을 전부 읽어버리게 되기 때문인 거죠.

"/data"라고 따로 가지고 있으면 Docker와 상관없이 DB를 유지 관리 할 수 있는 거죠.

지금까지 Prisma와 SvelteKit 그리고 Fly.io에 배포하는 방법을 알아봤는데요.

이렇게 총 4편에 걸쳐 SvelteKit 초기 세팅을 공부했는데요.

이제 본격적으로는 풀 스택 앱 개발을 위한 모든 준비가 끝난 거 같습니다.

그럼.

