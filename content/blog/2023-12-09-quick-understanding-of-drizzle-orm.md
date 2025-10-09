---
slug: 2023-12-09-quick-understanding-of-drizzle-orm
title: Drizzle ORM 쉽게 이해하기
date: 2023-12-09 06:58:01.961000+00:00
summary: Cloudflare D1 DB에 쓸 수 있는 Drizzle ORM에 대해 알아보자.
tags: ["drizzle", "orm"]
contributors: []
draft: false
---

안녕하세요?

오늘은 Typescript ORM으로 대표되는 Prisma의 대항마로 최근 주목받고 있는 Drizzle ORM에 대해 간단하게 알아보겠습니다.

Drizzle ORM은 MySQL, PostgreSQL, Sqlite를 지원합니다만 여기서는 테스트를 위해 Sqlite를 이용할 예정입니다.

** 목 차 **

1. [Drizzle ORM이란?](#1-drizzle-orm이란)

2. [테스트 환경 구축](#2-테스트-환경-구축)

   2.1 [Typescript 설치](#2-1-typescript-설치)

   2.2 [Drizzle 설치](#2-2-drizzle-설치)

3. [Drizzle 설정](#3-drizzle-설정)

   3.1 [스키마 파일 작성](#3-1-스키마-파일-작성)

   3.2 [마이그레이션 파일 만들기](#3-2-마이그레이션-파일-만들기)

   3.3 [DB에 연결하기](#3-3-db에-연결하기)

4. [실제 Drizzle ORM 테스트해 보기](#4-실제-drizzle-orm-테스트해-보기)

5. [마이그레이션 작동 방식 알아보기](#5-마이그레이션-작동-방식-알아보기)

   5.1 [Column 추가](#5-1-column-추가)

   5.2 [Column 삭제](#5-2-column-삭제)

   5.3 [마이그레이션 drop 하기](#5-3-마이그레이션-drop-하기)

6. [설정 파일](#6-설정-파일)

7. [InferModel을 이용한 타입 설정하기](#7-infermodel을-이용한-타입-설정하기)

8. [실행한 SQL 내용 확인하기](#8-실행한-sql-내용-확인하기)

9. [로깅 설정](#9-로깅-설정)

---

## 1. Drizzle ORM이란?

Drizzle ORM의 독특한 장점이자 특징은 SQL-Like하게 코드에서 데이터베이스를 조작 관리할 수 있는 Typescript ORM입니다.

Prisma도 Typescript ORM인데요.

Prisma의 문법이 실제 SQL 문법과 다르다는 데서 출발한 패키지입니다.

그래서 Drizzle ORM에서는 SQL 문법을 알면 Drizzle 문법도 쉽게 이해할 수 있다고 얘기하고 있죠.

최근에는 [Payload CMS](https://payloadcms.com/)에서도 이용되고 있으며, Payload CMS는 Drizzle ORM을 이용하여 PostgreSQL을 지원하고 있습니다.

ORM은 Object Relational Mapping의 약자로, MySQL, PostgreSQL, SQLite와 같은 관계형 데이터베이스에 대해 SQL 대신 객체의 메서드를 사용하여 조작할 수 있는 기술을 가리킵니다.

객체 메서드가 어떤 것인지에 대한 이해는 오늘 이 글을 끝까지 읽으시면 이해할 수 있을 겁니다.

---

## 2. 테스트 환경 구축

### 2-1. Typescript 설치

오늘 Typescript를 이용해서 터미널 상에서 Drizzle ORM을 이용하는 방법을 사용하겠습니다.

오늘 배운 내용을 나중에 웹에서도 쉽게 적용할 수 있으니 걱정하지 않으셔도 됩니다.

```bash
mkdir drizzle-test

cd drizzle-test

npm init -y

npm install -D typescript ts-node @types/node
```

위 명령어가 뭔지는 다들 아실 겁니다.

이제 'npx tsc --init' 명령어로 Typescript 구성파일인 tsconfig.ts 파일을 만들어야겠죠.

```bash
npx tsc --init

Created a new tsconfig.json with:
                                                                                                    TS
  target: es2016
  module: commonjs
  strict: true
  esModuleInterop: true
  skipLibCheck: true
  forceConsistentCasingInFileNames: true


You can learn more at https://aka.ms/tsconfig
```

---

### 2-2. Drizzle 설치

이제 Drizzle 패키지를 설치해야 하는데요.

Drizzle 패키지는 Sqlite3를 사용할 때 better-sqlite3를 사용합니다.

PostgreSQL, MySQL 같은 경우는 공식문서를 참고하면 어떤 걸 설치해야 하는지 알 수 있습니다.

```bash
npm install drizzle-orm better-sqlite3

npm i --save-dev @types/better-sqlite3
```

그리고 Drizzle을 좀 더 쉽게 이용하게 해주는 Drizzle-kit을 설치해야 하는데요.

Drizzle-kit은 스키마 파일로 쉽게 Drizzle을 이용할 수 있게 해 줍니다.

```bash
npm install -D drizzle-kit
```

이제 준비가 끝났네요.

완료된 package.json 파일을 볼까요?

```json
{
  "name": "drizzle-test",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@types/better-sqlite3": "^7.6.8",
    "@types/node": "^20.10.4",
    "drizzle-kit": "^0.20.6",
    "ts-node": "^10.9.2",
    "typescript": "^5.3.3"
  },
  "dependencies": {
    "better-sqlite3": "^9.2.2",
    "drizzle-orm": "^0.29.1"
  }
}
```

---

## 3. Drizzle 설정

보통 Drizzle ORM 설정을 위해 스키마 파일과 데이터베이스 연결을 위한 코드를 한 곳에 모아두는데요.

우리는 'db'라는 폴더를 만들겠습니다.

```bash
mkdir db
```

### 3-1. 스키마 파일 작성

스키마(Schema)는 데이터베이스의 구조를 정의하는 정보입니다.

간단히 말하면, 테이블(table)이 어떤 열(column)로 구성되어 있고, 각각의 열(column)에 어떤 데이터를 저장할지 정의하는 것입니다.

스키마 파일은 하나의 파일에 모두 정의하는 방법과 각각의 스키마를 별도 파일로 나누어 저장하는 방법이 있습니다.

오늘은 하나의 파일에 모두 정의하는 방법을 사용하겠습니다.

"db" 디렉토리에 "schema.ts" 파일을 만들고, 아래 코드를 적읍시다.

아래 코드는 "todos" 테이블을 SQLite 데이터베이스에 만들게 됩니다.

"todos" 테이블은 id, name, isCompleted 열(column)로 구성되어 있으며, id는 자동으로 숫자가 할당되는 autoIncrement 방식입니다.

name은 문자열이고, isCompleted에는 boolean 타입이 옵니다.

Sqlite3에서 Boolean 타입은 false가 0, true가 1로 저장됩니다.

그래서 사실 isCompleted에는 number 타입이 오게 되죠.

Drizzle ORM이 알아서 Boolean 타입을 숫자로 변환시켜 줍니다.

```js
// ./db/schema.ts 파일

import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core'

export const todos = sqliteTable('todos', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text('name'),
  isCompleted: integer('isCompleted', { mode: 'boolean' })
    .notNull()
    .default(false),
})
```

---

### 3-2. 마이그레이션 파일 만들기

이제 Drizzle ORM을 이용한 스키마 파일을 만들었으니 실제 이 파일을 이용해서 SQL에 적용하는 마이그레이션 파일을 만들어야 하는데요.

Drizzle-kit 패키지를 설치한 이유가 여기에 있습니다.

'npx drizzle-kit' 명령어로 우리가 만든 schema 파일을 지정해 주면 알아서 만들어주는데요.

```bash
npx drizzle-kit generate:sqlite --schema=./db/schema.ts

drizzle-kit: v0.20.6
drizzle-orm: v0.29.1

1 tables
todos 3 columns 0 indexes 0 fks

[✓] Your SQL migration file ➜ drizzle/0000_burly_spyke.sql 🚀
```

위와 같이 실행되고 drizzle 폴더에 '0000_burly_spyke.sql'라는 이름이 만들어졌는데요.

이 파일을 열어볼까요?

```sql
CREATE TABLE `todos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`isCompleted` integer DEFAULT false NOT NULL
);
```

우리가 schema.ts 파일에 Drizzle ORM 문법으로 todos 테이블을 만들었었는데, 그걸 실제 SQL로 마이그레이션(이동)한 겁니다.

위 SQL 파일에는 CREATE TABLE 명령어가 있네요.

이 파일을 이용하면 실제 Sqlite DB에 TABLE를 만들 수 있습니다.

---

### 3-3. DB에 연결하기

이제 스키마 파일도 만들었고 스키마 파일을 이용해서 마이그레이션 파일도 만들었으니 코드에 사용할 DB 인터페이스를 작성하면 됩니다.

db 폴더에 'db.ts'라는 이름의 파일을 만듭시다.

```js
import { drizzle, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import Database from 'better-sqlite3'

const sqlite = new Database('./db/mysqlite.db')
export const db: BetterSQLite3Database = drizzle(sqlite)

migrate(db, { migrationsFolder: './drizzle' })
```

위 코드는 그냥 Drizzle ORM을 사용하기 위한 당연한 코드이기 때문에 공식문서에서 복사해서 사용하면 되는 겁니다.

단지, db 폴더 밑에 'mysqlite.db'라는 실제 파일이름을 지정한 것만 다르죠.

그리고 이 'db.ts'파일의 마지막에는 마이그레이션 하라는 'migrate' 명령어가 실행되게 됩니다.

마이그레이션 폴더는 './drizzle' 폴더가 되는 거고요.

테이블 구성을 변경하는 경우 마이그레이션을 다시 해줘야 합니다.

---

## 4. 실제 Drizzle ORM 테스트해 보기

지금까지는 Drizzle ORM을 사용하기 위한 db 관련 사전 작업이었다면 이제 테스트 코드를 작성해 봐야겠죠.

프로젝트 최상단 즉, package.json 파일과 같은 위치에 'index.ts'라는 이름으로 파일을 하나 만듭니다.

일단 보시죠.

```js
import { db } from './db/db'
import { todos } from './db/schema'

function main() {
  const allTodo = db.select().from(todos).all()
  console.log(allTodo)
}

main()
```

Drizzle ORM의 문법은 SQL 문법과 아주 비슷한데요.

SQL 문법이 'select \* from table_name;' 이런 식이잖아요.

위 코드를 보시면 이런 방식으로 객체의 메서드가 체이닝 됩니다.

'db.selecct().from(todos).all()'

db 객체 다음에 오는 건 전부 메서드인데요.

함수인 거죠.

메서드 체이닝 방식으로 마지막에 있는 건 'all' 메서드인데요.

'select _ from table_name'에서 '_'를 뜻하는 'all'입니다.

실행해 볼까요?

```bash
npx ts-node index.ts
[]
```

위와 같이 빈 브라켓만 나옵니다.

왜냐하면 데이터가 없기 때문이죠.

---

### 4-1. 데이터 insert 하기

insert 메서드를 이용해서 SQL에서의 insert 명령어를 구현해 볼까요?

```js
import { db } from './db/db'
import { todos } from './db/schema'

async function main() {
  const result = db
    .insert(todos)
    .values({ name: 'test 1', isCompleted: false })
    .run()
  console.log('result', result)

  const allTodo = db.select().from(todos).all()
  console.log('allTodo', allTodo)
}

main()
```

insert 같은 경우는 async 함수로 구현하는 게 좋습니다.

insert 문구도 SQL 문법인 'insert into todos values;' 순서입니다.

values 메서드에는 객체를 넣어주면 되죠.

run 메서드는 insert, delete, update 같은 명령어에서 사용하는 메서드입니다.

select 메서드는 all 메서드는 사용했고요.

테스트해 볼까요?

```bash
npx ts-node index.ts

result { changes: 1, lastInsertRowid: 1 }
allTodo [ { id: 1, name: 'test 1', isCompleted: false } ]
```

위와 같이 나오네요.

실제 sqlite는 아래와 같이 나옵니다.

```bash
# 터미널에서 sqlite3 명령어로 select 했을 경우

sqlite3 ./db/mysqlite.db
SQLite version 3.37.0 2021-12-09 01:34:53
Enter ".help" for usage hints.
sqlite> select * from todos;
1|test 1|0
sqlite>
```

역시나 isCompleted는 실제 숫자로 저장되는군요.

테스트를 위해 몇 개 더 저장해 보겠습니다.

```bash
npx ts-node index.ts

result { changes: 1, lastInsertRowid: 6 }
allTodo [
  { id: 1, name: 'test 1', isCompleted: false },
  { id: 2, name: 'test 2', isCompleted: false },
  { id: 3, name: 'test 3', isCompleted: false },
  { id: 4, name: 'test 4', isCompleted: true },
  { id: 5, name: 'test 5', isCompleted: true },
  { id: 6, name: 'test 6', isCompleted: false }
]
```

총 6개의 데이터를 추가했습니다.

---

### 3-2. select 메서드 옵션 사용하기

Drizzle ORM에서 select 명령어를 사용할 때 옵션을 줄 수 있는데요.

```js
const allTodo = db.select().from(todos).get()
```

위와 같이 get 메서드를 사용하면 아래와 같이 result에서 맨 처음 한 개만 뽑아줍니다.

```bash
npx ts-node index.ts

allTodo { id: 1, name: 'test 1', isCompleted: false }
```

바로 첫 번째 결과만 가져올 수 있는 거죠.

그러면 3개만 가져오려면 어떻게 할까요?

```js
const allTodo = db.select().from(todos).limit(3).all()
```

limit 메서드에 숫자를 넣으면 됩니다.

실행 결과는 아래와 같습니다.

```bash
npx ts-node index.ts

allTodo [
  { id: 1, name: 'test 1', isCompleted: false },
  { id: 2, name: 'test 2', isCompleted: false },
  { id: 3, name: 'test 3', isCompleted: false }
]
```

그러면 전체 개수는 어떻게 셀까요?

```js
import { db } from './db/db'
import { todos } from './db/schema'
import { count } from 'drizzle-orm'

async function main() {
  const allTodo = await db.select({ value: count() }).from(todos)
  console.log('allTodo', allTodo)
}

main()
```

위와 같이 별도 count 함수를 이용해야 합니다.

실행 결과는 아래와 같습니다.

```bash
npx ts-node index.ts

allTodo [ { value: 6 } ]
```

공식 문서에는 아주 많은 유형의 예제가 있으니 꼭 공부하시기를 바랍니다.

그리고 마지막으로 name 항목만 select 하고 싶을 때는 다음과 같이 하면 됩니다.

```js
import { db } from './db/db'
import { todos } from './db/schema'

async function main() {
  const allTodo = await db.select({ name: todos.name }).from(todos)
  console.log('allTodo', allTodo)
}

main()
```

실행 결과는 아래와 같습니다.

```bash
npx ts-node index.ts

allTodo [
  { name: 'test 1' },
  { name: 'test 2' },
  { name: 'test 3' },
  { name: 'test 4' },
  { name: 'test 5' },
  { name: 'test 6' }
]
```

---

## 5. 마이그레이션 작동 방식 알아보기

마이그레이션이 어떻게 이루어지는지 아는 게 중요한데요.

### 5-1. Column 추가

schema.ts 파일에 아래와 같이 user라는 항목을 추가해 보겠습니다.

```js
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core'

export const todos = sqliteTable('todos', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text('name'),
  user: text('user'),
  isCompleted: integer('isCompleted', { mode: 'boolean' })
    .notNull()
    .default(false),
})
```

스키마 파일을 수정했으면 Drizzle-kit 패키지로 마이그레이션 파일을 작성해야 합니다.

```bash
npx drizzle-kit generate:sqlite --schema=./db/schema.ts

drizzle-kit: v0.20.6
drizzle-orm: v0.29.1

1 tables
todos 4 columns 0 indexes 0 fks

[✓] Your SQL migration file ➜ drizzle/0001_classy_blizzard.sql 🚀
```

위와 같이 '0001_classy_blizzard.sql'이라는 sql 파일이 생겼는데요.

실제 내용은 아래와 같습니다.

```sql
ALTER TABLE todos ADD `user` text;
```

todos 테이블에 user 항목을 추가하라는 SQL 명령어입니다.

실제 코드에서는 어떻게 나올까요?

```js
import { db } from './db/db'
import { todos } from './db/schema'

async function main() {
  const allTodo = db.select().from(todos).all()
  console.log('allTodo', allTodo)
}

main()
```

index.ts 파일을 위와 같이 작성하고 결과를 볼까요?

```bash
npx ts-node index.ts

allTodo [
  { id: 1, name: 'test 1', user: null, isCompleted: false },
  { id: 2, name: 'test 2', user: null, isCompleted: false },
  { id: 3, name: 'test 3', user: null, isCompleted: false },
  { id: 4, name: 'test 4', user: null, isCompleted: true },
  { id: 5, name: 'test 5', user: null, isCompleted: true },
  { id: 6, name: 'test 6', user: null, isCompleted: false }
]
```

user 항목이 전부 null로 지정되어 있네요.

당연히 테이블을 중간에 수정했으니 기본값인 null이 저장되었네요.

---

### 5-2. Column 삭제

이제는 다시 user 항목을 다시 지워 보겠습니다.

schema.ts 파일입니다.

```js
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core'

export const todos = sqliteTable('todos', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text('name'),
  isCompleted: integer('isCompleted', { mode: 'boolean' })
    .notNull()
    .default(false),
})
```

이제 다시 dirzzle-kit으로 마이그레이션을 수행해 볼까요?

```bash
npx drizzle-kit generate:sqlite --schema=./db/schema.ts

drizzle-kit: v0.20.6
drizzle-orm: v0.29.1

1 tables
todos 3 columns 0 indexes 0 fks

[✓] Your SQL migration file ➜ drizzle/0002_grey_spencer_smythe.sql 🚀
```

역시 '0002_grey_spencer_smythe.sql' 파일이 생겼네요.

```sql
ALTER TABLE `todos` DROP COLUMN `user`;
```

이번에는 DROP 명령어입니다.

다시 index.ts 파일을 실행해 볼까요?

```bash
npx ts-node index.ts

allTodo [
  { id: 1, name: 'test 1', isCompleted: false },
  { id: 2, name: 'test 2', isCompleted: false },
  { id: 3, name: 'test 3', isCompleted: false },
  { id: 4, name: 'test 4', isCompleted: true },
  { id: 5, name: 'test 5', isCompleted: true },
  { id: 6, name: 'test 6', isCompleted: false }
]
```

역시나 결과는 user 항목이 사라졌습니다.

---

### 5-3. 마이그레이션 drop 하기

우리가 위에서 했던 두 번의 마이그레이션이 결국은 처음으로 돌아왔는데요.

마이그레이션을 drop 하는 기능도 있습니다.

```bash
npx drizzle-kit drop --out ./drizzle
```

위와 같이 drizzle 폴더를 '--out' 옵션으로 지정해서 실행하면 마이그레이션 리스트가 나오고 엔터키를 누르면 선택되는 방식입니다.

마지막 마이그레이션을 선택해 보죠.

그러면 아래와 같이 나오는데요.

```bash
drizzle-kit: v0.20.6
drizzle-orm: v0.29.1


[✓] 0002_grey_spencer_smythe migration successfully dropped
```

dropped이라고 나옵니다.

여기서 중요한 게 마이그레이션 파일을 삭제할 수는 있지만 삭제해도 데이터베이스 테이블에 반영되지는 않습니다.

---

## 6. 설정 파일

지금까지 계속 스키마 파일 위치와 drizzle 폴더를 수동으로 지정했는데요.

프로젝트 최상단 위치 즉, package.json 파일과 같은 위치에 'drizzle.config.ts'파일을 아래와 같이 만들면 아주 편합니다.

```js
import type { Config } from 'drizzle-kit';

export default {
  schema: './db/schema.ts',
  out: './drizzle',
} satisfies Config;
```

위 파일이 있으면 'npx drizzle-kit generate:sqlite' 라고만 입력해도 작동하게 됩니다.

---

## 7. InferModel을 이용한 타입 설정하기

일단 아래와 같은 예제가 있다고 합시다.

```js
import { db } from './db/db'
import { todos } from './db/schema'

const insertTodo = todo => {
  return db.insert(todos).values(todo).run()
}

async function main() {
  const result = insertTodo({ name: 'test 7', isCompleted: false })
  console.log('result', result)

  const allTodo = db.select().from(todos).all()
  console.log(allTodo)
}

main()
```

위 코드는 insertTodo 라는 별도의 함수를 만들었는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEh8KbdjFoi_4Iue-db_Xby6JQ8lty0oYYRBjfOBlvyVFWV6q9-XKulPzJnJJTBsdueBEC5sQYnwaTa7-5P4PLAF0Pwwmg1O67A9tx5wtgFsuOFPgfz3630dAkJmGPFxzj6-xdpLU-5kBA89R7rk95J-2h_S9ScqESd9K9iVSzhQ9sHRwZ0_h3rNLy4HLBI)

위와 같이 todo 인자에 대해 타입스크립트가 경고를 보내고 있죠.

이와 같은 타입 문제에 있어 Drizzle ORM 은 헬퍼 유틸을 제공해 주는데요.

insertTodo 함수에는 db.insert() 명령어가 있죠.

그러면 InferInsertModel 헬퍼 유틸을 사용하면 됩니다.

```js
import { InferInsertModel } from 'drizzle-orm'
import { db } from './db/db'
import { todos } from './db/schema'

type InsertTodoType = InferInsertModel<typeof todos>

const insertTodo = (todo: InsertTodoType) => {
  return db.insert(todos).values(todo).run()
}

async function main() {
  const result = insertTodo({ name: 'Learn TypeScript', isCompleted: false })
  console.log('result', result)

  const allTodo = db.select().from(todos).all()
  console.log(allTodo)
}
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEjCMyqwJkWNx8tzQMI9ZAWPPj8Yez0JeHV3w2NWEvwNCvbTis2zD0tzhTuhKT0YJG7ODDDVvccs666pkMiDkH3nNCu1BoEQcLI0UgHhavKaiTackfBYANqebcAjCZCBq80n07LZTdt2o86VXrFtiJNZSTvsHNNp_DSfA_y4qmgeKssuyNPv33kJS0tXxnw)

위와 같이 타입 지정이 깔끔하게 됐네요.

select 명령어일 경우에도 헬퍼 유틸이 있습니다.

```js
type Todo = InferSelectModel<typeof todos>;
...
...
...
const allTodo: Todo[] = db.select().from(todos).all();
```

위와 같이 InferSelectModel을 사용하고 그리고 allTodo 선언에서 'Todo[]'라고 확실하게 Todo의 배열이라고 선언할 수 있습니다.

---

## 8. 실행한 SQL 내용 확인하기

Drizzle을 이용해서 실행한 SQL 내용을 확인해 보려면 toSQL 메서드를 사용하면 됩니다.

```js
import { db } from './db/db'
import { todos } from './db/schema'

async function main() {
  const allTodo = db.select().from(todos).toSQL()
  console.log(allTodo)
}

main()
```

위 코드처럼 toSQL 메서드는 아래와 같이 실제 SQL 문구를 리턴 해 줍니다.

```bash
npx ts-node index.ts

{ sql: 'select "id", "name", "isCompleted" from "todos"', params: [] }
```

---

## 9. 로깅 설정

매번 실행하는 SQL 문구에 로깅을 설정할 수 있는데요.

db.ts 파일 중 일부를 아래와 같이 수정하면 됩니다.

```js
export const db: BetterSQLite3Database = drizzle(sqlite, { logger: true })
```

logger 옵션을 활성화한 겁니다.

```bash
npx ts-node index.ts

Query:
                        CREATE TABLE IF NOT EXISTS "__drizzle_migrations" (
                                id SERIAL PRIMARY KEY,
                                hash text NOT NULL,
                                created_at numeric
                        )

Query: SELECT id, hash, created_at FROM "__drizzle_migrations" ORDER BY created_at DESC LIMIT 1
Query: BEGIN
Query: COMMIT
{ sql: 'select "id", "name", "isCompleted" from "todos"', params: [] }
```

위처럼 복잡한 Query가 나오는데요.

우리가 모르는 사이 Drizzle은 todos 테이블의 SQL 이외에도 Query를 수행하고 있고, 마이그레이션과 관련된 테이블에 대한 액세스가 수행 중인걸 볼 수 있습니다.

---

지금까지 Drizzle ORM에 대해 정말 간단하게 알아봤는데요.

기초만 배운 거로 생각하시고 공식 문서를 좀 더 깊게 살펴보시면 좋은 공부가 될 겁니다.

그럼.
