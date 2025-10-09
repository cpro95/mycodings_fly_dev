---
slug: 2023-02-19-nodejs-express-backend-api-tutorial
title: Nodejs Express Backend API 강좌 1편 - Auth
date: 2023-02-19 10:04:45.060000+00:00
summary: 1편. Auth 설정 - Nodejs Express 프레임워크로 만드는 서버 강좌
tags: ["nodejs", "express", "expressjs", "prisma", "api", "auth", "tutorial"]
contributors: []
draft: false
---

안녕하세요?

기존 Remix Framework으로 FullStack 개발만 해오다가 실제 서버 사이드 벡엔드 개발해보고 싶어 강좌를 시작하게 됐습니다.

Nodejs Express 프레임워크로 개발할 건데요.

순수하게 Backend API 엔드 포인트만 개발하고, 클라이언트는 NextJS로 개발할 계획입니다.

Express 강좌에 있어 가장 기본이 되는 Auth(유저 가입, 로그인, 로그아웃) 부분에 대해 알아볼 예정입니다.

Auth 관련 로직은 JSONWebToken으로 토큰을 발행해 클라이언트 쪽 쿠키에 저장하는 가장 일반적인 방식으로 진행할 예정입니다.

## NPM Init

본격적으로 Express 서버 개발에 들어가 볼까요?

```bash
mkdir nodejs-api-test
cd nodejs-api-test
npm init -y
```

위와 같이 nodejs-api-test 폴더를 만들고, npm init을 했습니다.

이제 express 서버 개발 관련 패키지를 설치해야 하는데요.

DB 부분은 당연히 요즘 제일 잘 나가는 PRISMA 로 개발할 예정입니다.

```bash
npm i express express-validator cors cookie cookie-parser bcrypt dotenv jsonwebtoken @prisma/client

npm i -D morgan nodemon prisma
```

Express 서버 개발에 가장 기본이 되는 패키지인데요.

package.json 파일을 열어 scripts 부분을 아래와 같이 바꿉시다.

```js
  "scripts": {
     "dev": "nodemon src/server.js",
     "start": "node src/server.js"
   },
```

## DB 관련 prisma 스키마 파일 만들기

PRISMA가 진정한 DB 유틸인데요.

mysql, mongodb, postgresql, sqlite3 등 다양한 DB를 지원합니다.

사용방법은 미세하게 차이가 있지만 기본 CRUD 작업은 거의 동일해서 PRISMA 로 개발하고 서버만 바꾸면 손쉽게 확장 가능한 서버를 만들 수 있는데요.

이제 prisma 폴더를 만들고 스키마 파일을 아래와 같이 만듭시다.

```bash
mkdir prisma
cd prisma
touch schema.prisma
```

schema.prisma 파일에 아래와 같이 User 모델의 스키마를 세팅합니다.

```js
generator client {
    provider = "prisma-client-js"
}

datasource db {
    provider = "sqlite"
    url      = "file:./dev.db"
}

model User {
    id           String   @id @default(uuid())
    firstName    String
    lastName     String?
    email        String   @unique
    password     String
    gender       String   @default("MALE") // MALE, FEMALE
    coverImage   String?
    profileImage String?
    status       String   @default("LOGOUT") // ACTIVE, IDLE, LOGOUT
    createdAt    DateTime @default(now())
    updatedAt    DateTime @updatedAt
}
```

우리가 개발하려고 한 익스프레스 서버에서 사용자의 가입, 로그인, 로그아웃 부분을 담당할 User 모델입니다.

firstName, lastName, email, password, gender 등을 설정했고요.

나중에 확장을 위해 coverImage, profileImage 도 일단 만들어 놨습니다.

그리고 로그인했다는 현재 상태를 저장하기 위한 status 항목도 추가했습니다.

여기서는 일단 개발을 위해 sqlite를 선택했습니다.

나중에 postgresql로도 바꿀 수 있으니까 걱정 안 하셔도 됩니다.

이제 db push를 해야지 prisma를 사용할 수 있는데요.

```bash
➜  nodejs-api-test npx prisma db push
Prisma schema loaded from prisma/schema.prisma
Datasource "db": SQLite database "dev.db" at "file:./dev.db"

SQLite database dev.db created at file:./dev.db

🚀  Your database is now in sync with your Prisma schema. Done in 29ms

✔ Generated Prisma Client (4.10.1 | library) to ./node_modules/@prisma/client in 108ms

➜  nodejs-api-test npx prisma studio
Prisma schema loaded from prisma/schema.prisma
Prisma Studio is up on http://localhost:5556
imports from "@prisma/client/runtime" are deprecated.
Use "@prisma/client/runtime/library",  "@prisma/client/runtime/data-proxy" or  "@prisma/client/runtime/binary"
```

prisma studio를 불러놓으면 현재 DB에 뭐가 있는지 쉽게 확인할 수 있어 개발할 때는 꼭 실행하시면 편합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEi8ligqEuttO6_dzCX_Xg6ejJFZdPYtQ_jh-eOLZjGT2gPjPC7FR4O6bROunld0l5BJa1B2rfCblYF47U6PVpTJmMOdotvIrDq-_Qv6wzrDTDMhLBYAMNynzvPCF3nBW3KpzD0j9MIfUI9ErvRXqqkKVMVUpLEjwAbET-Dv8oTQOMId8p5h9Ph-lyrJ)

![](https://blogger.googleusercontent.com/img/a/AVvXsEhTgTpgWLfBNqz2FSAwbHj7uurQfa-3LA4Wq3GhsafTjG0F8xHZ3OiQHnLgBzNqJvtviXYyG6Es-MXQPbNuaL-iQCufp4wk31sLhQsL8AXJndg-E2EMhUrhTO-xhe4gUXkGJC9KPXZ0zjPhmTz4wHOtXTIyKzCR7rWwg8ENbzHq-l_PTyuElSWkW5Q9)

위와 같이 브라우저에 prisma studio가 나온다면 일단은 성공입니다.

## 기타 세팅 파일 먼저 만들기

익스프레스 서버를 만들기 위해 기타 여러 가지 세팅을 미리 만들어 볼까요?

먼저 `.env` 파일을 만듭시다.

이게 뭔지는 다들 아실 건데요.

```bash
PORT=4000
ORIGIN=["http://localhost:3000"]
NODE_ENV=development
JWT_SECRET="ajfdhlaksdhkjhqwieryuaksjhfkashfkjashfdkajshfksajhfkjashfqiyruw"
```

익스프레스 서버 포트는 4000으로 했고요.

cors를 위해 ORIGIN도 배열로 지정했습니다.

그리고 JWT_SECRET도 아무 글자나 길게 설정했고요.

이제, src 폴더를 만들고 config 폴더를 만듭시다.

```bash
mkdir src

cd src

mkdir config

touch env.config.js
```

src 폴더가 우리의 서버 전체 소스 파일이 있는 폴더입니다.

그리고 첫 번째로 config 폴더를 만들고 세팅 관련 정보를 모두 저장할 예정입니다.

```js
const PORT = process.env.PORT || '5000'
const ORIGIN = process.env.ORIGIN || `["http://localhost:3000"]`
const NODE_ENV = process.env.NODE_ENV || 'development'
const JWT_SECRET = process.env.JWT_SECRET || 'veylongasdfasdfassecretofmine'

module.exports = {
  PORT,
  ORIGIN,
  NODE_ENV,
  JWT_SECRET,
}
```

env.config.js 파일의 내용인데요.

`.env` 파일에서 관련 정보를 불러오고 디폴트 값을 지정해 주는 파일입니다.

별로 어려운 거 없고요.

---

## server.js 파일 만들기

package.json 파일에서도 설정했듯이 우리의 익스프레스 서버의 메인 파일이 바로 src 폴더 바로 밑에 있는 server.js 파일입니다.

```bash
cd src

touch server.js
```

이제 server.js 파일을 express 서버 구동을 위해 작성해 볼까요?

```js
require('dotenv').config()
const { createServer } = require('http')
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { ORIGIN, NODE_ENV, PORT } = require('./config/env.config')

// init express app
const app = express()

const httpServer = createServer(app)

if (NODE_ENV === 'development') {
  const morgan = require('morgan')
  app.use(morgan('dev'))
}

// parse incomming request into json
app.use(express.json())

// allow cors for frontend to access api routes
app.use(
  cors({
    credentials: true,
    origin: JSON.parse(ORIGIN),
    optionsSuccessStatus: 200,
  }),
)

// parse incomming cookies in request
app.use(cookieParser())

// server health check
app.get('/', (req, res) => {
  res.status(200).json({
    type: 'success',
    message: 'Server is up and running',
    data: null,
  })
})

// start server
httpServer.listen(PORT, () => console.log(`listening on port ${PORT}`))
```

위 코드가 Nodejs에 있어 express 서버의 가장 기본이 되는 구조입니다.

이제 서버를 돌려볼까요?

```bash
npm run dev
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEieSB5zXvy0JG3oUvmHe9cHqJTsnyDKRf3ZuZGQv_sRsDiKXqo964bV31uqQ0GJEUupBbrZnQ0BPQYZac6hxvWs-hnvSRjCoReXZHmyEeJ_uC18qFiM8FpvZDeJV1Pg06lloU2-T7rdEpsYroEtedcwLdXUbWkDmu7qMNfPj3eudOe8OkU93DjiMX26)

![](https://blogger.googleusercontent.com/img/a/AVvXsEjxgWoWoPBJa0T4jl76_p_P3A5A99BrtsdnLd9-F9APB8ieFoYCHeEOIdeJBBsGuYdlg_gYz9imdGg2Z7jVI1a-QMraM0YPDKfvlzvcJ9qnOmKV6f5qazk9IDKBxsseXTcxHhMtZRNG4StsDbgjF_u6TT6JvXSGBtYQvg0Aly5-W7omipZd65EUVBwL)

실행이 잘 되네요.

그럼, 우리가 뭘 했는지 한번 차근차근 살펴볼까요?

---

## HTTP의 작동원리

인터넷에 있는 웹사이트는 기본적으로 HTTP 프로토콜로 움직이는데요.

HTTP는 서버와 클라이언트와의 데이터 이동을 요청과 응답이라는 단순한 로직으로 구현합니다.

요청은 Request라고 하고, 응답은 Response 이라고 합니다.

즉, 클라이언트에서 브라우저에서 사이트 주소를 치면 해당 주소의 서버로 루트 폴더인 "/"의 index.html 파일을 찾게 됩니다.

여기서 브라우저에서 "www.google.com"이라고 주소를 입력했고 엔터를 쳤다면 브라우저가 TCP 커넥션을 통해 서버에 HTTP Request 요청을 보냅니다.

HTTP Request 요청을 받은 서버는 경로가 어딘지를 찾아보는데요.

보통 "www.google.com"이라고 주소를 입력하기 때문에 디폴트 경로 값이 "/"입니다.

즉, 서버의 "/" 폴더에서 index.html 파일을 요청하게 되는 거죠.

이제 브라우저에서 해당 서버로 요청(Request)이 전달됐고, 그러면 서버는 해당 요청을 서버 로직에서 연산해서 응답(Response)을 도출하게 됩니다.

이제 이 응답(Response)이 클라이언트로 전송되고 브라우저는 이 응답(Response)을 기초로 화면에 정보를 뿌려지게 됩니다.

## Express 서버에서 Request 처리하는 엔드 포인트

그럼 위에서 우리가 만든 익스프레스 서버로 생각해 본다면 "localhost:4000"이라고 브라우저에서 주소를 치면 Request(요청)이 익스프레스 서버로 가는데요.

우리가 위에서 만든 익스프레스 서버는 어떻게 이 요청을 처리할까요?

특히 "/"처럼 루트 엔드 포인트로 전달한 요청(Request)을 말입니다.

바로 아래 코드에 그 해답이 있는데요.

```js
app.get('/', (req, res) => {
  res.status(200).json({
    type: 'success',
    message: 'Server is up and running',
    data: null,
  })
})
```

app.get() 함수가 바로 HTTP의 엔드 포인트에 따른 요청(Request)을 처리하는 함수입니다.

그럼 get() 함수는 뭘까요?

HTTP의 요청 프로토콜을 5가지가 있는데요.

GET, POST, PUT, PATCH, DELETE 이렇게 다섯 가지가 있습니다.

CRUD라고 들어보셨죠?

Create는 POST HTTP 메소드를 사용하고, Read는 GET 메소드, Update는 PUT, PATCH Delete는 DELETE 메소드를 사용합니다.

POST 메소드를 처리하려면 app.post() 함수를 사용하면 됩니다.

POST 메소드는 클라이언트에서 정보를 첨부해서 서버로 전송할 수 있는데요.

사용자 아이디, 패스워드 같은 걸 JSON 형식으로 전송할 수 있습니다.

그러면 HTTP는 Request는 다음과 같은 형식을 띠게 됩니다.

"Content-Type": "application/json"

json 형식 말고, xml, YAML 형식도 있고, 심지어 Plain이라고 텍스트로 전송할 수도 있습니다.

자바스크립트 세계에서는 json 형식을 가장 많이 쓰니까요. json 형식만 알아 두시면 편합니다.

참고로 GET 메소드는 정보만 얻는 거고, json 형식으로 정보를 전달할 수 없습니다.

GET 메소드에서 서버에 데이터를 전달하는 방식은 URL 파라미터 형식을 사용하는데요.

```js
http://localhost:3000/?q=nodejs&page=1&itemsPerPage=10&view=grid
```

위와 같이 서버 주소에 기다란 텍스트값을 `&`로 붙여서 전달합니다.

서버에서도 Request 파라미터를 파싱해서 값을 구별할 수 있지만, 위 GET 메소드의 파라미터 데이터 전송은 보통 클라이언트에서 자바스크립트로 코딩할 때 많이 쓰입니다.

자 이제, 다시 우리가 만든 익스프레스 서버를 볼까요?

```js
app.get('/', (req, res) => {
  res.status(200).json({
    type: 'success',
    message: 'Server is up and running',
    data: null,
  })
})
```

app.get() 함수의 첫 번째 파라미터는 엔드 포인트입니다.

위에서는 "/"라고 루트 폴더를 지정했네요.

그리고 두 번째는 콜백 함수인데요.

이 "/" 폴더로 GET 메소드로 요청이 오면 작동하는 함수를 작성하는 겁니다.

이 콜백 함수에서는 익스프레스 프레임워크가 제공하는 Request, Response라는 객체가 있는데요.

보통 이름을 req, res라고 짧게 명명하면 편합니다.

위 코드에서 단순하게 res라는 Response라는 객체를 이용해서 클라이언트로 정보를 제공해 주는데요.

status라는 상태코드를 줄 수 있고 json() 메소드에 원하는 데이터를 묶어서 전송할 수 있습니다.

그래서 우리가 브라우저에서 "localhost:4000"이라고 입력하면 나오는 결과물이 위 코드와 같은지 이제 이해가 될 겁니다.

---

## 익스프레스에서 미들웨어 만들기

결국은 익스프레스 서버는 여러 엔드포인트에 대한 대응함수만 만들면 되는데요.

app.post("/api/auth/login"), app.post("/api/auth/signup") 등등 우리의 목적에 맞게 엔드 포인트를 만들면 됩니다.

그러면 우리가 만든 엔드 포인트 말고 전혀 이상한 엔드 포인트로 Request가 오면 어떻게 대처해야 할까요?

익스프레스 프레임워크에는 이걸 대응하는 방법이 있습니다.

바로 미들웨어인데요.

HTTP의 요청, 응답을 해결하기 전에 미들웨어라는 함수를 먼저 실행하는 방식인데요.

일단 아래와 같이 src/middlewares 폴더에 error.middleware.js 파일을 만듭시다.

```js
exports.globalErrorHandler = (err, req, res, next) => {
  console.error(err)

  const status = err.status || 500
  const message = err.message || 'Something went wrong'
  const data = err.data || null

  res.status(status).json({
    type: 'error',
    message,
    data,
  })
}

exports.notFoundErrorHandler = (req, res, next) => {
  const error = {
    status: 404,
    message: 'API endpoint does not exists',
  }
  next(error)
}
```

그리고 src/server.js 파일에 아래와 같이 위의 미들웨어를 추가하면 됩니다.

```js
require('dotenv').config()
const { createServer } = require('http')
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { ORIGIN, NODE_ENV, PORT } = require('./config/env.config')

const {
  globalErrorHandler,
  notFoundErrorHandler,
} = require('./middlewares/error.middleware')

// init express app
const app = express()

const httpServer = createServer(app)

if (NODE_ENV === 'development') {
  const morgan = require('morgan')
  app.use(morgan('dev'))
}

// parse incomming request into json
app.use(express.json())

// allow cors for frontend to access api routes
app.use(
  cors({
    credentials: true,
    origin: JSON.parse(ORIGIN),
    optionsSuccessStatus: 200,
  }),
)

// parse incomming cookies in request
app.use(cookieParser())

// server health check
app.get('/', (req, res) => {
  res.status(200).json({
    type: 'success',
    message: 'Server is up and running',
    data: null,
  })
})

// api route not found error handling
app.use('*', notFoundErrorHandler)

// global error handler
app.use(globalErrorHandler)

// start server
httpServer.listen(PORT, () => console.log(`listening on port ${PORT}`))
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEhtbP9cl0Tnivtrzl-qUfjjwdMqReXMIhK1wSkZ03DNAvktQ9slUEyBwMPUJbTk_Hkm8b6SDXr0EyiUGcBHjfh86YIphDpv8sGEkq5AYss-jxWWa3XPTZuU5KuYvZMXFFJuEnCCgs84HYf2zDo8weXx4-bDLNQhPOcKCQqMR9e2XTnAoUvbxepfXUFy)

이제 위와 같이 브라우저 주소창에 "localhost:4000/adkfjaksdf" 처럼 아무 경로나 치면 위와 같이 에러 처리하는 결과가 나올 겁니다.

그럼, 미들웨어의 작동방식에 대해 알아볼까요?

```js
exports.notFoundErrorHandler = (req, res, next) => {
  const error = {
    status: 404,
    message: 'API endpoint does not exists',
  }
  next(error)
}
```

먼저, notFoundErrorHandler입니다.

이건 그냥 error 객체를 만들어서 next() 메소드로 넘겨주면 끝이 납니다.

그러면 next() 메소드가 무엇이냐 하면, 아까 위에서 app.get() 메소드에서 두 번째로 필요한 게 콜백 함수라고 했잖습니까?

바로 그 콜백 함수에 req, res 말고, next라는 미들웨어 처리 함수가 있습니다.

바로 위와 같이 하면 미들웨어를 만들고, 그리고 src/server.js 파일에서 아래와 같이 이상한 경로를 처리하는 코드를 만들어서 주면 됩니다.

```js
// api route not found error handling
app.use('*', notFoundErrorHandler)
```

여기서는 app.use() 함수를 사용했는데요.

첫 번째 파라미터로 "\*" 를 입력했습니다.

별표는 모든 경우의 수를 상정하는데요.

만약 app.get("/", ()=>{} 코드처럼 "/" 경로를 지정하는 코드를 삭제한다면 "localhost:4000" 주소로도 notFoundErrorHandler가 처리하면서 에러 메시지를 보여줄 겁니다.

한번 테스트해 볼까요?

```js
// server health check
// app.get("/", (req, res) => {
//   res.status(200).json({
//     type: "success",
//     message: "Server is up and running",
//     data: null,
//   });
// });
```

위와 같이 app.get("/") 처리 부분을 주석처리하고 브라우저에서 "localhost:4000"으로 접속해 보겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjPTPirfuWvmYf--VhLkF7g9YXwotGzQyLpRff3ojGoJbfoR7g78oRuwC5PMcqK5QZH-3fM4jhJP0WCi0oEd9AaJ2hWlexPGADiFjy3IdeX55ZDXQAEdtKLciDCCsubnqEzLJHlPa4VQy3hgaF2F7R0AxRtWjEmUnH6upOmnQvCrPekNMDXPm2GagoC)

위 그림처럼 "/" 경로도 API endpoint 가 없다는 메시지가 나올 겁니다.

그리고 엔드포인트가 없는 경우 말고 서버 크래쉬나 에러가 났을 때는 어떻게 할까요?

바로 globalErrorHandler 미들웨어를 만들면 됩니다.

```js
exports.globalErrorHandler = (err, req, res, next) => {
  console.error(err)

  const status = err.status || 500
  const message = err.message || 'Something went wrong'
  const data = err.data || null

  res.status(status).json({
    type: 'error',
    message,
    data,
  })
}
```

그리고 이 미들웨어를 src/server.js 에서 사용하게끔 아래와 같이 설정하면 됩니다.

```js
// global error handler
app.use(globalErrorHandler)
```

즉, app.use() 함수는 미들웨어를 처리하는 함수라고 이해하시면 됩니다.

---

## 본격적인 엔드 포인트(End Point) 구성하기

그럼, 본격적인 API 백엔드 서버를 구성하기 전에 엔드 포인트에 대한 명확한 규칙을 머릿속에 구상해 놔야 하는데요.

이 서버의 용도가 API 서버라서 저는 아래와 같이 엔드 포인트를 구상할 예정입니다.

```js
;`localhost:4000/api/auth/signup``localhost:4000/api/auth/login``localhost:4000/api/auth/logout``localhost:4000/api/auth/me`
```

일단 auth 관련 부분이라 "api/auth"라고 지정할 예정입니다.

익스프레스 서버에서는 이런 걸 바로 라우트(route)라고 하는데요.

익스프레스 라우트는 중첩 라우트로도 구성도 가능합니다.

자 그럼 routes 구성을 위한 폴더를 만들어 볼까요?

src 폴더 밑에 routes 폴더를 만들고 그 밑에 index.js 파일과 auth.route.js 파일을 만듭시다.

```js
// /src/routes/auth.route.js
const express = require('express')
const { body } = require('express-validator')
const router = express.Router()

const { signup } = require('../controllers/auth')

const signupValidation = [
  body('firstName').not().isEmpty().withMessage('First name must be required'),
  body('email')
    .not()
    .isEmpty()
    .withMessage('Email address must be required')
    .isEmail()
    .withMessage('Incorrect email address'),
  body('password').not().isEmpty().withMessage('Password must be required'),
]

router.post('/signup', signupValidation, signup)

module.exports = router
```

그리고 routes 폴더 밑의 index.js 파일입니다.

```js
// /src/routes/index.js

const authRoutes = require('./auth.route')

exports.registerRoutes = app => {
  app.use('/api/auth', authRoutes)
}
```

routes 폴더 밑의 index.js는 routes 폴더 밑에 있는 여러 routes를 총정리해서 exports해주는 요약 파일입니다.

앱이 커질수록 이 파일에서 엔드 포인트에 대한 경로가 일목요연하게 정리될 예정입니다.

마지막으로, server.js 파일에 아까 만들고 export했던 registerRoutes 함수를 이용해서 익스프레스 서버에 라우팅을 등록해 주면 됩니다.

```js
// /src/server.js
...
...
...
const { registerRoutes } = require("./routes");

...
...
...

// server health check
app.get("/", (req, res) => {
  res.status(200).json({
    type: "success",
    message: "Server is up and running",
    data: null,
  });
});

// register routes
registerRoutes(app);

// api route not found error handling
app.use("*", notFoundErrorHandler);

...
...
...

```

위와 같이 registerRoutes를 불러오는 require 문과 registerRoutes(app) 명령어를 위와 같이 적당한 위치에 놓으면 됩니다.

이제 auth.route.js 파일을 천천히 살펴볼까요?

```js
...
...
const {
  signup,
} = require("../controllers/auth");

const signupValidation = [
  body("firstName").not().isEmpty().withMessage("First name must be required"),
  body("email")
    .not()
    .isEmpty()
    .withMessage("Email address must be required")
    .isEmail()
    .withMessage("Incorrect email address"),
  body("password").not().isEmpty().withMessage("Password must be required"),
];

router.post("/signup", signupValidation, signup);
...
...
```

처음 보는 위 코드가 보이는데요.

controllers 폴더 밑에 auth 폴더는 뭘까요?

그리고 signupValidation 변수는 뭘까요?

그리고 router.post("/signup", signupValidation, signup) 함수의 역할은 뭘까요?

역순으로 설명해 보자면 우리가 위에서 app.use("/api/auth")로 auth.route.js 파일을 사용하겠다고 등록했는데요.

그리고 auth.route.js 파일에서 router.post("/signup")이라고 router 객체에서 POST 방식을 지정한 겁니다.

그리고 "/signup"이라고 특정 엔드 포인트도 제공한 겁니다.

그래서 최종 엔드포인트는 "localhost:4000/api/auth/signup"이 되고, 그리고 이 경로의 POST 메소드에 대한 처리는 router.post("/signup", signupValidation, signup) 명령어에서처럼 보듯이 signupValidation 미들웨어를 거쳐 최종적으로 signup 함수를 실행하라는 명령입니다.

signupValidation 변수는 뭘까요?

일단은 express-validator 패키지를 쓰기 위한 변수인데요.

우리가 POST 메소드로 정보를 전달한다고 했는데 그 정보에서 우리가 필요한 게 있는지 없는지 서버 차원에서 체크하는 미들웨어입니다.

signupValidation는 배열인데요.

body("firstName")처럼 필요한 항목을 이용해서 데이터 유무를 처리하면 됩니다.

not() 메소드는 없으며 안된다는 얘기고 isEmpty() 메소도는 만약 데이터가 비었다면 그 뒤 withMessage 메소드를 출력하라는 뜻입니다.

대충 보시면 이해할 건데요.

이제 마지막으로 signup이라는 컨트롤러를 알아보겠습니다.

익스프레스 서버에서는 라우트 처리를 위한 함수를 컨트롤러라고 부릅니다.

그래서 signup 컨트롤러를 src/controllers/auth 폴더 밑에 따로 만들어 두는데요.

일단 src/controllers/auth 폴더를 만들고 signup.js 파일과 index.js 파일을 만듭시다.

```js
// /src/controllers/auth/index.js
const { signup } = require('./signup')

module.exports = {
  signup,
}
```

그리고 signup.js 파일입니다.

```js
// /src/controllers/auth/signup.js
const { validationResult } = require('express-validator')
const { hashPassword } = require('../../utils/password.util')
const { db } = require('../../utils/db')
const { generateRandomImage } = require('../../utils/generateImage')

exports.signup = async (req, res, next) => {
  // return api fields level error validations
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next({
      status: 422,
      message: 'User input error',
      data: errors.mapped(),
    })
  }

  let { email, password, firstName, lastName, gender } = req.body

  try {
    //check duplicate email
    const emailExist = await db.user.findUnique({
      where: {
        email,
      },
      select: {
        email: true,
      },
    })

    if (emailExist) {
      return next({ status: 400, message: 'Email addresss already exists' })
    }

    // hash password
    password = await hashPassword(password)

    // create new user
    const user = await db.user.create({
      data: {
        firstName,
        lastName,
        email,
        password,
        gender,
        profileImage: generateRandomImage({ str: email }),
        coverImage: generateRandomImage({
          size: 400,
          str: email,
          type: 'blank',
        }),
      },
    })

    return res.status(201).json({
      type: 'success',
      message: `Account create for ${user.firstName}`,
      data: {
        user,
      },
    })
  } catch (error) {
    next(error)
  }
}
```

여기서 중요한 건 유저 가입을 처리하기 위한 컨트롤러인 signup.js 파일입니다.

여기에서 DB를 직접 제어해서 사용자 정보를 DB에 직접 저장하는데요.

일단 utils 관련 함수가 보이네요.

src 폴더 밑에 utils 이라는 폴더를 만들고

아래처럼 4개의 파일을 만듭시다.

```js
// /src/utils/db.js

const { PrismaClient } = require('@prisma/client')

exports.db = new PrismaClient()
```

```js
// /src/utils/generateImage.js

const crypto = require('crypto')

const randomHash = str => {
  return crypto.createHash('md5').update(str).digest('hex')
}

const generateRandomImage = ({ str, type = 'identicon', size = 200 }) => {
  const md5Hash = randomHash(str)
  return `https://www.gravatar.com/avatar/${md5Hash}?d=${type}&s=${size}`
}

module.exports = {
  generateRandomImage,
}
```

```js
// /src/utils/password.util.js
const bcrypt = require('bcrypt')

// match plain password and hashed password
exports.checkPassword = async (password, hashedPassword) => {
  const matchPassword = await bcrypt.compare(password, hashedPassword)
  return matchPassword
}

// hash plain password into hashed password
exports.hashPassword = async password => {
  const hashed = await bcrypt.hash(password, 12)
  return hashed
}
```

```js
// /src/utils/token.util.js

const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/env.config')

// generate json web token from payload of userId
exports.createJwtToken = payload => {
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' })
  return token
}

// verify incomming jwon web token and extract payload from it
exports.verifyJwtToken = (token, next) => {
  try {
    const { userId } = jwt.verify(token, JWT_SECRET)
    return userId
  } catch (err) {
    next(err)
  }
}
```

각각 db.js 파일은 PRISMA 클라이언트 db 관련 파일이고,

generateImage 파일은 gravatar 사이트를 이용해서 사용자 프로파일이나 커버 이미지를 랜덤하게 디폴트값으로 만들어 주는 함수입니다.

요건 나중에 화장을 위해 만든 겁니다.

그리고 password와 token은 다들 아시다시피 해쉬된 패스워드와 JSONWebToken을 얻기 위한 함수입니다.

이 함수들은 유틸 함수들로 계속 사용할 함수라서 특별히 따로 만들어 놓은 겁니다.

이제 본격적으로 signup 컨트롤러를 살펴볼까요?

여기서 눈여겨봐야 할 express-validator 관련 함수인데요.

바로 const errors = validationResult(req); 함수입니다.

앞에서 signupValidation이라는 배열변수를 미들웨어로 전송한다고 했는데요.

바로 validationResult 함수에 의해 그 결과 값이 나옵니다.

여기서 errors 변수가 있다면 에러가 발생한 거고, 없다면 에러가 없다는 뜻입니다.

그리고, 사용자 가입을 위한 로직인데요.

req.body 부분에서 email, password, firstName 등 관련 정보를 let 변수로 지정하고,

그다음에 email이 기존에 가입되었는지 db.user.findUnique 함수로 체크합니다.

그리고 해당 email이 가입되어 있지 않다면 새로 가입해야 하는데요.

hashPassword함수로 유저가 입력한 패스워드를 암호화하고,

최종적으로 db.user.create 함수를 이용해서 저장합니다.

그리고 res.status(201).json() 함수를 이용해서 상태코드 201번으로 하고 성공했다는 데이터를 json 함수를 통해 전달하고 있습니다.

그럼 유저 가입 부분이 잘 되는지 테스트해 볼까요?

POSTMAN, Insomnia 같은 API 테스트 프로그램을 실행시켜서 아래 그림처럼 POST 메소드로 하고 관련 정보는 json 형식으로 전달합시다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjK_rb-yq4edaRO4_F2jtThtvL42sI-D6E_KoIThpEIDX2JD-VPyc4bICa73SaAJ5ClP18m-xWzWr2QVEOOzty2_vIas8yjXZFXxc9RzIz7XKAwUdmz2Jmr-mkZcMavTrugHAiVn8JhkruI1tuiIkNifGavpOFVdNkNLg9JuRPeVneeNJBZqp0s9VK0)

위 그림처럼 유저 가입이 성공했는데요.

한번 email 부분과 firstName 부분의 정보를 빼고 테스트해 보십시오.

우리가 만든 express-validator에 의해 에러 메시지가 뜰 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiMaQoorgKLoTTzdHWeJgVmc_NHHwLomvq0TR7UR5cvKg9eZrbiHkrliGA6sYwPLmhFlZZ8UkYb5tF5tS2RY4fzwNGrgFuz42oYSLPftkfrygZtqgMbJ4mmX3ySdDe4Sep6vWbGQuer5iw-9cwyjSBgi-BuQMpZF6VRwIaUQDWdroJ4t2RwAG5cnwpn)

위 그림은 email 부분을 이상하게 전송했을 때 에러 코드입니다.

그러면 DB 부분을 한번 살펴볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEgPtpbeKTq5usXjlABH_QpA4KLAXmYRSk62-I3-2b2W8C38vIpBEejvfHpw8LaXKtlsnncKyeMfLUGYKywOzcH3pvR4kzOY7CAkSHr8L4B79i1dLGlGT04S4meeD2baWN3ThEeJrP7eQiEXgZUEzz0524peKSuBKaCncwi7uh7GElEp0FQx5zax4e5U)

위 그림과 같이 prisma studio 화면을 보시면 DB 저장도 잘 되고 있네요.

결론적으로 signup 컨트롤러는 정상적으로 작동되었네요.

---

## login 컨트롤러 구현하기

signup 다음에는 login 컨트롤러 구현인데요.

먼저, /src/routes/auth.route.js 파일을 아래와 같이 수정합시다.

```js
...
...

const {
  signup,
  login,
} = require("../controllers/auth");

const loginValidation = [
  body("email").not().isEmpty().withMessage("Email must be required"),
  body("password").not().isEmpty().withMessage("Password must be required"),
];

...
...
```

다른 코드는 수정할 필요 없이 위와 같이 loginValidation 관련 자료만 추가하면 됩니다.

로그인할 때는 email과 password가 꼭 있어야 한다는 거죠.

이제 login 컨트롤러를 만들어야 하는데요.

```js
// src/controllers/auth/login.js

const { db } = require('../../utils/db')
const { validationResult } = require('express-validator')
const { checkPassword } = require('../../utils/password.util')
const { createJwtToken } = require('../../utils/token.util')
const cookie = require('cookie')
const { NODE_ENV } = require('../../config/env.config')

exports.login = async (req, res, next) => {
  // return api fields validation errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next({
      status: 422,
      message: 'User input error',
      data: errors.mapped(),
    })
  }

  const { email, password } = req.body

  try {
    //verify email
    const user = await db.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      return next({
        status: 400,
        message: 'Incorrect email address',
      })
    }

    // verify password
    const matchPassword = await checkPassword(password, user.password)
    if (!matchPassword) {
      return next({ status: 400, message: 'Incorrect password' })
    }

    // create token
    const token = createJwtToken({ userId: user.id })

    // set token to user frontend cookies
    res.set(
      'Set-Cookie',
      cookie.serialize('token', token, {
        httpOnly: true,
        sameSite: NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 3600 * 12,
        path: '/',
        secure: NODE_ENV === 'production' ? true : false,
      }),
    )

    // const { name, version, layout, description, ua, os } = platform;

    const currentUser = await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        status: 'ACTIVE',
      },
    })

    delete currentUser.password

    res.status(201).json({
      type: 'success',
      message: 'You have logged in successfully',
      data: {
        user: currentUser,
        token,
      },
    })
  } catch (error) {
    next(error)
  }
}
```

로그인 컨트롤러는 정말 어려워 보이는데요.

하나하나 천천히 살펴봅시다.

먼저, validationResult로 express-validator에 대한 처리를 해주고요.

req.body 에서 로그인을 하기 위한 정보인 email과 password 값을 얻습니다.

그리고 email을 찾아보는데요.

만약 없으면 에러코드를 리턴하고,

email이 있으면 이제 password 값을 비교해야 합니다.

password 비교는 우리가 아까 utils 폴더 밑에 만들었던 password 관련 함수를 이용했습니다.

패스워드가 맞는다면 로그인해야 하는데요.

로그인했다는 뜻이 뭘까요?

별거 없습니다.

쿠키에 유저 정보를 저장하고 만약 쿠키에 유저 정보가 있다면 로그인, 없다면 로그인 안 했다는 뜻입니다.

그런데 유저 로그인 정보는 중요하고 민감한 정보이기 때문에 JSONWebToken으로 처리하는데요.

그래서 createJwtToken 함수로 userId를 이용해서 토큰을 만들어 줍니다.

그리고 이 토큰값을 token=토큰값 형식으로 쿠키를 저장하는데요.

그게 바로 Response(응답) 객체인 res.set() 함수로 처리합니다.

쿠키 저장하는 일반적인 방식은 아래와 같은데요.

```js
res.set('Set-Cookie', 'cookieName=cookieValue; Path=/; HttpOnly')
```

위 res.set() 함수에서 두 번째 값이 텍스트 파일입니다.

cookieName=cookieValue 형식으로 스트링 형식으로 저장하는데요

cookie 패키지가 이걸 쉽게 해 줄 수 있습니다.

그래서 아래와 같이 cookie.serialize 함수를 이용하면 쉽게 res.set() 함수의 두 번째 파라미터값을 얻을 수 있습니다.

````js
cookie.serialize("token", token, {
        httpOnly: true,
        sameSite: NODE_ENV === "production" ? "none" : "strict",
        maxAge: 3600 * 12,
        path: "/",
        secure: NODE_ENV === "production" ? true : false,
      })
      ```
````

express와 함께 많이 쓰이는 cookie 패키지에 대한 간단한 설명입니다.

```js
cookie.serialize(name, value, [options])
```

사용법은 위와 같고요.

"name"이 바로 쿠키 이름이고 "value"가 쿠키값입니다.

우리 입장에서 보면 "name"이 "token"이 되고 "value"가 createJwtToken() 함수로 만든 토큰값이 되는 거죠.

그리고 option부분인데요.

domain: 도메인 부분입니다. 이건 별로 안 쓰는데요. 디폴트값은 현재 도메인입니다.

path: 현재 경로입니다. 보통 "/"을 많이 넣습니다.

expires: 쿠키의 종료 시점을 정할 수 있는데요. Date 객체입니다. 이게 지정되어 있지 않으면 기본적으로 세션 쿠키가 됩니다. 세션 쿠키는 브라우저가 종료되면 없어지는 쿠키죠.

maxAge: 쿠키의 존재 기간입니다. 단위는 초입니다. 만약 expires 옵션과 maxAge 옵션이 같이 있다면 expires 옵션이 우선합니다.

secure: 만약 true라면 쿠키는 https 연결을 통해서만 전달 가능하다는 뜻입니다.

httpOnly: 만약 true라면 쿠키는 자바스크립트로는 액세스가 안 되고 무조건 HTTP 커넥션으로만 접근할 수 있다는 뜻입니다.

잠깐 cookie 패키지 사용법에 대해 알아봤는데요.

다시 login 컨트롤러로 돌아가 보면,

이제 쿠키도 세팅했고, db에 user 부분을 update하는데요.

user 모델의 status 부분을 "ACTIVE"라고 업데이트했습니다.

현재 사용자가 로그인했다는 뜻이죠.

이것도 나중에 앱 확장을 위해 미리 넣어둔 겁니다.

그리고 보안을 위해 currentUser의 password부분을 메모리에서 삭제하고 최종적으로 201 상태코드로 json 결과 값을 response로 넘기게 됩니다.

이제 테스트해 볼까요?

테스트하기 전에 /src/controllers/auth/index.js 파일에서 login 항목을 export 해야 합니다.

```js
// src/controllers/auth/index.js

const { signup } = require('./signup')
const { login } = require('./login')

module.exports = {
  signup,
  login,
}
```

이제 테스트 결과를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEijLZFKhyQqpqH6oT4nmD5ziuA8Z73l_1y9rKTvbvqPn8ekaXsdSPacHbZ8B2Ra434FRN-LINvDCA-n5DqKJyZroeaQsGkR8_L1Hl-kjr6cOLkPEeV0bTDqjL2dsNs0UJf1P_QU8ssM7XCm6OWox_VCFXsWqJm3Z-LSvCp5GxgjoIAKNzE7EhtmRUs9)

위 그림과 같이 login이 성공했다고 나옵니다.

---

## login 상태를 확인하는 엔드 포인트 만들기

한번 로그인했다면 보통 현재 로그인된 사용자 정보를 알려주는 엔드 포인트를 만드는 게 좋은데요.

그래서 "localhost:4000/api/auth/me"라는 엔드 포인트를 만들어 보겠습니다.

먼저, 라우트를 수정해야 하는데요.

```js
...
...
const checkAuth = require("../middlewares/auth.middleware");

const { signup, login, fetchCurrentUser } = require("../controllers/auth");

...
...

router.get("/me", checkAuth, fetchCurrentUser);
...
```

위 코드를 보니까 컨트롤러는 GET 메소드를 이용하고, 또 fetchCurrentUser라는 걸 만들어야 하고 checkAuth라는 미들웨어를 만들어야 합니다.

먼저, auth.middleware입니다.

```js
// src/middleware/auth.middleware.js

const { db } = require('../utils/db')

const { verifyJwtToken } = require('../utils/token.util')

module.exports = async (req, res, next) => {
  try {
    // extract json web token from cookies
    const token = req.cookies.token
    if (!token) {
      return next({
        status: 403,
        message: 'JWT token is missing',
      })
    }

    //verify jwo token
    const userId = verifyJwtToken(token, next)
    if (!userId) {
      return next({
        status: 403,
        message: 'JWT token is not valid',
      })
    }

    // find user from payload userId
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    })
    if (!user) {
      return next({
        status: 404,
        message: 'User does not exists',
      })
    }

    // store user data in response local object, it is valid for one req-res cycle
    res.locals.user = user

    return next()
  } catch (err) {
    next(err)
  }
}
```

이 미들웨어가 바로 checkAuth라는 이름으로 쓰이는데요.

위 미들웨어는 토큰에서 userId 값을 뽑아내고 그걸 이용해서 user 정보를 알아냅니다.

그리고 user 정보를 res.locals.user라는 Response 객체에 추가하는데요.

Response에 있는 locals라는 변수에, 클라이언트에서 볼 수 있는 정보를 잠깐 저장할 수 있습니다.

locals에 저장되는 변수는 Request와 Response가 한 번의 사이클 동안만 저장할 수 있습니다.

만약 다른 Request가 발생했다면 locals 정보가 사라지니까요?

잠깐만 클라이언트에서 확인할 용도로만 사용해야 합니다.

그러고 나서, fetchCurrentUser 컨트롤러를 만들어야 하는데요.

```js
// src/controllers/auth/fetchCurrentUser.js

const { db } = require('../../utils/db')

exports.fetchCurrentUser = async (req, res, next) => {
  try {
    //get data already store in response local objects
    const currentUserId = res.locals.user.id
    const currentUser = await db.user.findUnique({
      where: {
        id: currentUserId,
      },
    })

    delete currentUser.password
    return res.status(200).json({
      type: 'success',
      message: 'Fetch current user',
      data: {
        user: currentUser,
      },
    })
  } catch (error) {
    next(error)
  }
}
```

fetchCurrentUser 컨트롤러도 어려운 건 없고요.

아까 Request쪽 미들웨어인 checkAuth에서 클라이언트로 넘기 Response.locals 값에 있는 user 정보를 이용해서 다시 DB에서 현재 로그인된 사용자의 정보를 얻는 겁니다.

마지막으로 controllers/auth/index.js 파일을 아래와 같이 바꿔줍니다.

```js
// src/controllers/auth/index.js

const { signup } = require('./signup')
const { login } = require('./login')
const { fetchCurrentUser } = require('./fetchCurrentUser')

module.exports = {
  signup,
  login,
  fetchCurrentUser,
}
```

이제 테스트해 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEgC7_riA7-8LbT7q7SWXgZew5-fHiMJIe9PafCFDtRoY4pCZubxJRgprRooXLdDh9peui5uaQQE9cSxjA0ATLShV53Wj5FQKa6L183XuUhryqupx0w-E7BCU8bssraFw893b7W691wcgvzr6uz7Q4KJvIGr7Lh66h3pfIqPRtX26Ze55fb7eVi-vWCW)

위 그림처럼 GET 메소드라 전달할 정보가 없이 그냥 경로 창에 "localhost:4000/api/auth/me"라고 치니까 응답 창에 성공적이라고 나오면서 현재 사용자 정보가 나옵니다.

결과는 대성공이네요.

---

## 마지막으로 logout 컨트롤러 만들기

이제 로그인했으니까 로그아웃하는 컨트롤러를 만들어 볼까요?

로그아웃은 쿠키에서 토큰값만 없애면 됩니다.

왜냐하면 우리가 로그인됐다는 정보를 쿠키에서 토큰값을 얻어서 그 토큰값에서 userId 값을 얻었기 때문이죠.

```js
// src/routes/auth.route.js
...
...
const {
  signup,
  login,
  fetchCurrentUser,
  logout,
} = require("../controllers/auth");

...
...

router.patch("/logout", checkAuth, logout);

...
...

```

위 코드를 보면 컨트롤러로는 logout 컨트롤러가 보이고, 라우팅은 PATCH 메소드로 "/logout" 주소를 사용했습니다.

logout 컨트롤러도 checkAuth라는 미들웨어가 필요한데요.

왜냐하면 현재 로그인된 사용자만 로그아웃을 할 수 있기 때문입니다.

이제 컨트롤러를 만들어 볼까요?

```js
// src/controllers/auth/logout.js

const { db } = require('../../utils/db')
const cookie = require('cookie')
const { NODE_ENV } = require('../../config/env.config')

exports.logout = async (req, res, next) => {
  try {
    const userId = res.locals.user.id

    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        status: 'LOGOUT',
      },
    })

    res.set(
      'Set-Cookie',
      cookie.serialize('token', '', {
        httpOnly: true,
        sameSite: NODE_ENV === 'production' ? 'none' : 'strict',
        expires: new Date(0),
        path: '/',
        secure: NODE_ENV === 'production' ? true : false,
      }),
    )

    return res.status(200).json({
      type: 'success',
      message: 'You have logout successfully',
      data: null,
    })
  } catch (error) {
    next(error)
  }
}
```

로그아웃 로직은 간단한데요.

현재 유저의 상태(status)를 DB에서 "LOGOUT"으로 바꾸고,

그리고 다시 한번 res.set() 함수를 이용해 쿠키값을 바꿔 줍니다.

위 코드에서는 "token" 다음에 "" 빈문자열이 왔죠.

즉, "token"값을 지운다는 뜻입니다.

토큰값이 없으면 현재 로그인된 userId 값을 얻을 수 없기 때문에 로그아웃 됐다는 뜻이 되기 때문이죠.

다시 controllers/auth/index.js 파일에서 아래 컨트롤러를 추가합시다.

```js
const { signup } = require('./signup')
const { login } = require('./login')
const { fetchCurrentUser } = require('./fetchCurrentUser')
const { logout } = require('./logout')

module.exports = {
  signup,
  login,
  fetchCurrentUser,
  logout,
}
```

이제 테스트해 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEjuyF4S9-KYRRum7eS8pgpQnwNQBC8Kxb1fjW5Gv8uG3czTdpCFpGTAOtrq_Ewle0ZFyX98v5J3S3Xqu61v9JS0uK8NTbuLjj_eZjRKLiKm_xzHb38ztSvLuM8giEQqm6gwdQGnR49VOdwiRyZCvLIBMA2giAG2lRZbDwVQl6UUxfr4KEz3qPuvCjfJ)

위 그림을 보시면 로그아웃 기능도 정상적으로 작동되네요.

지금까지 Nodejs Express 백엔드 API 서버를 구축해 봤는데요.

그 첫 번째인 Auth 관련 강좌였습니다.

다음에는 좀 더 나은 기능으로 찾아뵙도록 하겠습니다.

src 폴더 밑의 tree 값입니다.

```bash
➜  nodejs-api-test tree --du -h src
[ 11K]  src
├── [ 403]  config
│   └── [ 307]  env.config.js
├── [5.2K]  controllers
│   └── [5.1K]  auth
│       ├── [ 547]  fetchCurrentUser.js
│       ├── [ 249]  index.js
│       ├── [1.9K]  login.js
│       ├── [ 814]  logout.js
│       └── [1.5K]  signup.js
├── [1.5K]  middlewares
│   ├── [ 961]  auth.middleware.js
│   └── [ 442]  error.middleware.js
├── [1.2K]  routes
│   ├── [1007]  auth.route.js
│   └── [ 120]  index.js
├── [1.3K]  server.js
└── [1.5K]  utils
    ├── [  85]  db.js
    ├── [ 363]  generateImage.js
    ├── [ 399]  password.util.js
    └── [ 500]  token.util.js

  25K used in 7 directories, 15 files
```

그럼.