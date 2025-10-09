---
slug: 2022-12-19-expressjs-nodejs-handbook-2022
title: Expressjs와 Nodejs로 만드는 백엔드 완전 정복 설명서
date: 2022-12-19 04:34:18.974000+00:00
summary: Expressjs와 Nodejs로 만드는 백엔드 완전 정복 설명서
tags: ["express", "expressjs", "node", "nodejs", "handbook"]
contributors: []
draft: false
---

![](https://blogger.googleusercontent.com/img/a/AVvXsEgQwK72a_nE4aPjoOvrcq_gZSoZDNDI_kkrhu-kh8zi53yTQR6PK5Z6jUu3fUeBBEsjKvw3gPJ1A490oWSpr5mEHxFqFDzuMqSLHGiZJ46BSbToVZN0StZWsYTl38Fh9ErwLb6y1Cpl5dfv2css5SquzhAWTwRLsnZVAhTSMXwL_qHM7y9g_se4jeN6)

안녕하세요?

오늘은 제가 보려고 정리한 Express 관련 핸드북인데요.

이거 하나만 있으면 Nodejs 백엔드 프로그래밍에 대한 전체적인 윤곽을 그릴 수 있을 거 같네요.

---

TOC

- [Install Express](#install)
- [Hello world example](#helloworldexample)
- [Request 파라미터](#request_parameters)
- [클라이언트에 Response 보내기](#send_response_to_client)
- [JSON 형태로 Response 보내기](#send_json_response)
- [Cookies 다루기](#manage_cookies)
- [HTTP Headers 다루기](#work_with_http_headers)
- [Redirects 다루기](#handle_redirects)
- [라우팅(Routing)](#routing_in_express)
- [Express에서의 템플릿](#template_in_express)
- [미들웨어(Express Middleware)](#express_middleware)
- [정적 자료 핸들링하기](#serve_static_assets)
- [파일을 클라이언트 쪽으로 보내기](#send_file_to_client)
- [세션(Session)](#sessions_in_express)
- [Input Validate](#input_validate)
- [input 값 가공하기](#sanitize_input)
- [Express에서 Form 핸들링하기](#handling_form_in_express)
- [form에서 파일 업로드 핸들링하기](#handling_upload_file_in_form)

---

## Install Express <a name="install"></a>

당연히 npm으로 설치할 수 있습니다.

폴더 하나 만들고,

```bash
npm init -y

npm install express
```

---

## Hello World 예제 <a name="helloworldexample"></a>

아래 코드는 다들 아시는 express의 그 유명한 4줄짜리 서버입니다.

```js
const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(3000, () => console.log('Server ready'))
```

위 파일을 index.js라고 저장하고 `node index.js`라고 실행시키면 서버가 실행됩니다.

이제 브라우저에서 port 3000으로 들어가시면 "Hello World!"가 출력되는 게 보이실 겁니다.

첫 번째 서버를 완성했네요.

위 코드에서 중요하게 보실 게 바로 expree를 import 하고 그걸 실행한 express()를 app 변수에 저장하고 그다음에 app 객체를 이용해서 작업해야 한다는 겁니다.

그리고 app.get()처럼 HTTP verb 5개가 아래 적용되는데요.

```js
app.get('/', (req, res) => {
  /* */
})
app.post('/', (req, res) => {
  /* */
})
app.put('/', (req, res) => {
  /* */
})
app.delete('/', (req, res) => {
  /* */
})
app.patch('/', (req, res) => {
  /* */
})
```

각각 콜백 함수를 지정해줘야 합니다.

이 콜백 함수가 바로 리퀘스트(request)가 시작될 때 호출되는 함수이고, 우리가 이 콜백 함수를 처리해서 원하는 결과를 도출해야 하는 거죠.

ES6에서는 아래처럼 간단히 애로우 함수로 작업하시는 게 보기에도 좋고 간결합니다.

```js
;(req, res) => res.send('Hello World!')
```

Express 프레임워크에서 사용되는 콜백 함수 파라미터는 두 가지인데요.

바로 req와 res입니다.

각각 request와 response입니다.

각각 HTTP 기본 객체인 [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request)와 [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)를 가리키는 겁니다.

Request는 사용자가 브라우저를 통해서 서버에 요청하는 걸 모아놓은 객체인데요.

Request에 여러 가지 정보가 담겨 넘겨지니까, 서버 측에서는 이 Request의 파라미터, 헤더 값, 바디 값을 분석해서 작업하게 됩니다.

그리고 Response는 서버가 결과를 브라우저에게 넘겨준 객체를 얘기합니다.

보통 문자열로 리턴되는데요.

객체나 배열도 리턴될 때가 있는데 그때는 JSON.stringify() 함수로 문자열로 변환된 뒤 클라이언트로 넘겨주게 됩니다.

그래서 우리가 Response를 response.json() 함수로 다시 JSON 형식으로 바꾸는 이유가 거기 있습니다.

Response를 클라이언트한테 넘겨주는 메서드는 Response.send() 함수를 사용합니다.

Response.send() 함수는 바디 부분에 문자열을 담아서 넘겨주고 바로 연결을 끊어버립니다.

---

## Request 파라미터 <a name="request_parameters"></a>

Express에서 어떻게 Request를 표현하는지 아래 표를 보면 쉽게 이해할 수 있습니다.

| 속성           | 설명                                                                                 |
| :------------- | :----------------------------------------------------------------------------------- |
| .app           | holds a reference to the Express app object                                          |
| .baseUrl       | the base path on which the app responds                                              |
| .body          | contains the data submitted in the request body                                      |
| .cookies       | contains the cookies sent by the request (needs the cookie-parser middleware)        |
| .hostname      | the hostname as defined in the Host HTTP header value                                |
| .ip            | the client IP                                                                        |
| .method        | the HTTP method used                                                                 |
| .params        | the route named parameters                                                           |
| .path          | the URL path                                                                         |
| .protocol      | the request protocol                                                                 |
| .query         | an object containing all the query strings used in the request                       |
| .secure        | true if the request is secure (uses HTTPS)                                           |
| .signedCookies | contains the signed cookies sent by the request (needs the cookie-parser middleware) |
| .xhr           | true if the request is an XMLHttpRequest                                             |

---

## 클라이언트에 Response 보내기 <a name="send_response_to_client"></a>

Hello world 예제에서 클라이언트로 메세지를 보내기 위해 res.send() 함수를 썼었는데요.

```js
;(req, res) => res.send('Hello World!')
```

res.send() 함수에 문자열을 넣으면 express는 Content-Type을 `text/html`로 설정합니다.

만약에 res.send()에 객체나 배열을 넣으면 express는 자동으로 Content-Type을 `application/json` 형태로 변환시키며 JSON 형태로 파싱까지 합니다.

그리고 나서 연결을 종료하게 되죠.

그리고 res.send()는 자동으로 Content-Length 값을 설정해 주는데 res.end() 함수는 직접 값을 지정해 줘야 합니다.

그래서 빈 응답을 클라이언트에 줄 때는 res.send()를 쓰지 않고, 보통 res.end() 함수를 씁니다.

```js
res.end()
```

그러면 404, 200 같은 응답 코드는 어떻게 전송할까요?

바로 status() 함수를 이용하면 됩니다.

```js
res.status(404).end()

또는

res.status(404).send('File not found')
```

참고로 sendStatus() 함수가 축약 버전입니다.

```js
res.sendStatus(200)
// === res.status(200).send('OK')

res.sendStatus(403)
// === res.status(403).send('Forbidden')

res.sendStatus(404)
// === res.status(404).send('Not Found')

res.sendStatus(500)
// === res.status(500).send('Internal Server Error')
```

---

## JSON 형태로 Response 보내기 <a name="send_json_response"></a>

Response.send() 함수에 보통 문자열을 넣지만 JSON 형식도 넣을 수 있습니다.

바로 Response.json()이라는 함수를 통해서요.

```js
res.json({ username: 'Flavio' })
```

위와 같이 하면 send() 하기 전에 JSON 형태로 바꾸고 나서 send()하게 됩니다.

아주 유용한 함수이니 꼭 외워두시기를 바랍니다.

---

## Cookies 다루기 <a name="manage_cookies"></a>

Response.cookie() 함수가 바로 쿠키를 다루는 함수인데요.

```js
res.cookie('username', 'Dojun-Jin')
```

cookie 함수는 세 번째 파라미터도 쓸 수 있는데요.

```js
res.cookie('username', 'Dojun-Jin', {
  domain: '.fly.dev',
  path: '/blog',
  secure: true,
})

res.cookie('username', 'Dojun-Jin', {
  expires: new Date(Date.now() + 500000),
  httpOnly: true,
})
```

cookie() 함수 관련 유용한 파라미터는 다음과 같습니다.

| 속성     | 설명                                                                             |
| :------- | :------------------------------------------------------------------------------- |
| domain   | The cookie domain name                                                           |
| expires  | Set the cookie expiration date. If missing, or 0, the cookie is a session cookie |
| httpOnly | Set the cookie to be accessible only by the web server. See HttpOnly             |
| maxAge   | Set the expiry time relative to the current time, expressed in milliseconds      |
| path     | The cookie path. Defaults to '/'                                                 |
| secure   | Marks the cookie HTTPS only                                                      |
| signed   | Set the cookie to be signed                                                      |
| sameSite | Value of SameSite                                                                |

마지막으로 쿠키를 지우는 방법은

```js
res.clearCookie('username')
```

---

## HTTP Headers 다루기 <a name="work_with_http_headers"></a>

Request에서 headers에 접근할 수 있는 방법은 간단합니다.

```js
app.get('/', (req, res) => {
  console.log(req.headers)
})
```

그리고 Request.header() 함수를 이용해서 Headers의 특정값을 불러올 수 도 있습니다.

```js
app.get('/', (req, res) => {
  req.header('User-Agent') // Headers에서 'User-Agent' 값을 불러오는 함수.
})
```

Response의 HTTP header 값을 변경하는 방법은 아래와 같습니다.

```js
res.set('Content-Type', 'text/html')
```

아래 코드는 좀 더 축약된 버전입니다.

```js
res.type('.html')
// => 'text/html'

res.type('html')
// => 'text/html'

res.type('json')
// => 'application/json'

res.type('application/json')
// => 'application/json'

res.type('png')
// => image/png:
```

---

## Redirects 다루기 <a name="handle_redirects"></a>

코딩하다 보면 Redirect 할 일이 진짜 많은데요.

Express에서는 다음과 같이 사용하시면 됩니다.

```js
res.redirect('/blog')
```

위 코드는 응답 코드 302번의 redirect인데요.

참고로 응답 코드도 직접 넣을 수 있습니다.

```js
res.redirect(301, '/blog')
```

절대 경로(/blog)나 절대 URL(https://mycodings.fly.dev) 같은 형식으로 써도 되지만 상대 경로로도 쓸 수 있습니다.

```js
res.redirect('../blog')
res.redirect('..')
```

그리고 redirect로도 back 한번 할 수 있는데요.

```js
res.redirect('back')
```

---

## 라우팅(Routing) <a name="routing_in_express"></a>

백엔드 프로그래밍에서 가장 중요한 게 바로 라우팅인데요.

Express에서는 다음과 같이 라우팅 주소를 처리합니다.

```js
app.get('/', (req, res) => {
  /* */
})
```

위 코드의 표면적인 해설은 바로 `/` 주소의 HTTP GET 메서드를 처리한다는 것입니다.

좀 더 어려운 표현으로 가보면, 만약 URL에 파라미터를 넣고 싶다면 어떻게 할까요?

즉, URL에 파라미터를 주는 형식은 https://mycodings.fly.dev/blog/:id 같은 형식이고요.

URL 쿼리 스타일은 https://mycodings.fly.dev/?id=1 같은 형식입니다.

URL 파라미터 형식을 쓰려면 다음과 같이 하면 됩니다.

```js
app.get('/uppercase/:theValue', (req, res) =>
  res.send(req.params.theValue.toUpperCase()),
)
```

위 라우팅의 해석은 바로 /uppercase/abcd라고 라우팅 하면 res.send()가 "abcd"값을 대문자로 리턴해 주는 라우팅입니다.

여기서 :theValue 같은 형식으로 쓴 theValue가 바로 파라미터입니다. 그래서 req.params 값으로 접근할 수 있는 거죠.

레귤러 익스프레션으로 라우팅 주소를 쓰고 싶다면 어떻게 해야 할까요?

다음 예를 봅시다.

```js
app.get(/post/, (req, res) => {
  /* */
})
```

위 라우팅 주소는 `/post`, `/post/firsts`, `/thepost`, `/posting/something` 같은 모든 주소에 통용됩니다.

왜냐하면 app.get() 함수의 첫 번째 옵션이 보통 문자열이어야 하는데요.

잘 보시면 위 코드에서는 문자열이 아니라 RegExpress 수식입니다.

그래서 위와 같은 다양한 주소에도 매칭될 수 있는 거죠.

---

## Express에서의 템플릿 <a name="template_in_express"></a>

Express는 서버 사이드 템플릿 엔진도 지원하는데요.

템플릿 엔진은 서버 사이드에서 뷰(view)를 처리하고 HTML 코드를 다이내믹하게 만들어 줄 수 있는 겁니다.

Express는 Jade 템플릿 엔진을 기본으로 썼었는데요.

특히 Jade가 템플릿 엔진인 Pug의 1.0 버전이라서 요즘은 사실 잘 안 씁니다.

Jade가 Pug로 이름을 바꾼 것도 버전 2.0을 내놓은 2016년이고요.

그래서 Pug 1.0 버전인 Jade를 쓸 수도 있지만 이왕이면 최신형인 Pug 2.0을 쓰는 게 좋습니다.

사실 Jade는 아직도 Express의 기본 템플릿 엔진인데요. 왜냐하면 기존 소스와의 호환성 때문입니다.

그래서 새로운 프로젝트를 만들 경우에는 무조건 [Pug](https://pugjs.org/) 최신 버전으로 사용하시는 게 좋습니다.

```js
npm install pug
```

Express에서 사용하려면

```js
const express = require('express')
const app = express()
app.set('view engine', 'pug')
```

위와 같이 해주면 됩니다.

예를 들어 `/about`이라는 경로로 라우팅과 템플릿 엔진을 작성하고 싶다면,

```js
// views/about.pug

p Hello from mycodings
```

```js
// server.js

const express = require('express')
const app = express()
app.set('view engine', 'pug')

app.get('/about', (req, res) => {
  res.render('about')
})
```

위와 같이 res.render('about')이라고 하면 됩니다.

Pug에 변수를 전달하려고 할 때는 다음과 같이 하면 됩니다.

```js
app.get('/about', (req, res) => {
  res.render('about', { name: 'Dojun' })
})
```

```js
p Hello from #{name}
```

어떤 가요? 템플릿 엔진도 쉽게 이해할 수 있겠죠?

[Pug 가이드](https://flaviocopes.com/pug)를 꼭 읽어 보시기 바랍니다.

온라인으로 HTML을 Pug로 변환시켜주는 이 [사이트](https://html-to-pug.com/)도 아주 유용하니 꼭 북마크해 두십시오.

---

## 미들웨어(Express Middleware) <a name="express_middleware"></a>

미들웨어는 라우팅 프로세스 때 Request, Response 전에 실행되는 함수인데요.

미들웨어로 request, response를 수정할 수 있고 또는 request를 종료할 수도 있습니다.

보통 다음과 같은 형식으로 쓰이는데요.

```js
app.use((req, res, next) => {
  /* */
})
```

여기서 req,res 객체와 함께 next라는 객체를 이용해서 미들웨어에 접근할 수 있습니다.

그리고 미들웨어 함수 마지막에는 꼭 next() 명령어를 호출해야 합니다.

Express의 미들웨어는 npm 패키지 형태로 많이 나와 있는데요.

[여기](https://expressjs.com/en/resources/middleware.html)서 확인할 수 있습니다.

대표적인 미들웨어로 cookie-parse가 있는데요.

req.cookies를 파싱하는 미들웨어입니다.

```bash
npm install cookie-parser
```

```js
const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')

app.get('/', (req, res) => res.send('Hello World!'))

app.use(cookieParser())
app.listen(3000, () => console.log('Server ready'))
```

보통 위와 같이 app.use() 함수로 미들웨어를 설정합니다.

또는 미들웨어를 특정 라우팅에서만 실행하게끔 코드를 짤 수도 있습니다.

```js
const myMiddleware = (req, res, next) => {
  /* ... */
  next()
}

app.get('/', myMiddleware, (req, res) => res.send('Hello World!'))
```

Request.locals를 이용하면 미들웨어로 자료를 넘길 수도 있고, Request 핸들러에도 특정 값을 넘길 수 있습니다.

```js
req.locals.name = 'Dojun-Jin'
```

---

## 정적 자료 핸들링하기 <a name="serve_static_assets"></a>

웹서버를 만들 때 정적 자료 같은 거는 보통 `public` 폴더에 많이 넣는데요.

express 서버에서는 이 `public` 폴더를 처리할까요?

```js
const express = require('express')
const app = express()

app.use(express.static('public'))

/* ... */

app.listen(3000, () => console.log('Server ready'))
```

만약에 public 폴더에 index.html 파일이 있다면 바로 http://localhost:3000 주소가 처리하는 파일이 됩니다.

---

## 파일을 클라이언트 쪽으로 보내기 <a name="send_file_to_client"></a>

Expresss는 파일을 클라이언트로 보내는 간단한 함수를 제공합니다.

Response.download() 함수인데요.

download() 함수로 라우팅 된 주소를 브라우저에서 클릭하면 파일을 저장하겠냐고 하는 화면이 뜹니다.

```js
const express = require('express')
const app = express()

app.get('/pdf', (req, res) => res.download('./file.pdf'))
app.listen(3000, () => console.log('Server ready'))
```

또는 유저가 브라우저에서 보는 파일 이름을 다음과 같이 지정할 수도 있습니다.

```js
res.download('./file.pdf', 'user-facing-filename.pdf')
```

download() 함수는 유저가 클릭하고 나서 파일이 다운로드가 다 됐을 때 실행시킬 수 있는 콜백 함수도 제공합니다.

```js
res.download('./file.pdf', 'user-facing-filename.pdf', err => {
  if (err) {
    //handle error
    return
  } else {
    //do something
  }
})
```

---

## 세션(Session) <a name="sessions_in_express"></a>

기본적으로 Expresss는 Request가 클라이언트 쪽에서 이전에 왔던 똑같은 Request라고 알 수가 없는데요.

이걸 해결하는 게 바로 세션입니다.

이 세션을 통해 사용자의 상태를 기억할 수 있는데요.

Express에서는 express-session 모듈이 가장 많이 쓰입니다.

Express 팀에서 관리하는 기본 세션 관리자라고 할 수 있습니다.

```bash
npm install express-session
```

세션을 다음과 같이 초기화합니다.

```js
const express = require('express')
const session = require('express-session')

const app = express()
app.use(
  session({
    secret: '343ji43j4n3jn4jk3n',
  }),
)
```

위와 같이 세팅하면 이제 모든 라우팅에 대한 request가 세션을 사용하게 됩니다.

그리고 session은 secret 파라미터 하나만 있으면 됩니다.

secret는 추측하지 못하게 랜덤하게 어려운 문자열로 지정하면 됩니다.

이제 session을 req.session으로 접근할 수 있습니다.

```js
app.get('/', (req, res, next) => {
  // req.session
}
```

세션 사용 준비가 다 됐으면 session을 다음과 같이 이용해도 됩니다.

```js
req.session.name = 'Dojun-Jin'
console.log(req.session.name) // 'Dojun-Jin'
```

이때 저장된 값은 JSON 형태로 저장됩니다.

그래서 중첩된 정보도 안심하게 저장할 수 있습니다.

그러면 세션 정보는 어디에 저장될까요?

그건 express-session 모듈을 설정할 때 고를 수 있는데요.

3가지 방법이 있습니다.

1. 메모리 (개발서버에서만 쓰도록 합시다)
2. 데이터베이스 (MySql, Mongo 등)
3. 메모리 캐쉬 (Redis, Memcached 등)

[여기](https://github.com/expressjs/session) 가 보시면 여러 가지 패키지를 찾을 수 있으니 참고 바랍니다.

위 패키지의 특징 중 공통된 점은 뭐냐 하면 바로 세션 id를 쿠키로 저장하는데, 그걸 서버 사이드에서 저장합니다.

그래서 클라이언트에서 세션 id를 쿠키로 받고 나중에 HTTP Request 할 때 쿠키에 있는 세션 id를 첨부해서 Request 보내는 형태입니다.

이게 가장 안전한 방식이죠.

Express에서 쓰이는 세션 관련 매니저로 cookie-session도 많이 쓰입니다.

이건 데이터를 클라이언트 쿠키에 저장합니다.

이 방식은 보안 측면에서 별로 추천하지 않는 방식입니다.

개발 서버나 만들 때 한 번 해보시는 게 좋을 듯 싶네요.

---

## Input Validate <a name="input_validate"></a>

Express에서 POST 엔드 포인트로 들어온 input 값을 처리하는 밸리데이터가 많은데요.

먼저, input 값을 어떤 형식으로 처리하는지 볼까요?

```js
const express = require('express')
const app = express()

app.use(express.json())

app.post('/form', (req, res) => {
  const name = req.body.name
  const email = req.body.email
  const age = req.body.age
})
```

그러면 서버 사이드 쪽에서 name, email, age의 값을 특정화할 수 있을까요?

이럴 때 쓰이는 가장 좋은 패키지가 바로 express-validator 패키지입니다.

```bash
npm install express-validator
```

그리고 이 패키지를 사용할 때는 두 개의 객체를 불러와야 합니다.

바로 check, validationResult 객체입니다.

```js
const { check, validationResult } = require('express-validator')
```

사용 방법은 예제를 보면 쉽게 이해할 수 있습니다.

```js
app.post(
  '/form',
  [
    check('name').isLength({ min: 3 }),
    check('email').isEmail(),
    check('age').isNumeric(),
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }

    const name = req.body.name
    const email = req.body.email
    const age = req.body.age
  },
)
```

check()의 배열을 app.post() 함수의 두 번째 파라미터로 넣었습니다.

약간 미들웨어 넣었다고 보시면 됩니다.

그리고 마지막 콜백 함수에서 req의 validationResult() 리턴 값을 에러 체크하는 방식입니다.

check() 함수에 쓰이는 여러 가지 validator가 있는데요, 모두 validaotr.js에서 온 것입니다.

- contains(), checks if value contains the specified value
- equals(), checks if value equals the specified value
- isAlpha()
- isAlphanumeric()
- isAscii()
- isBase64()
- isBoolean()
- isCurrency()
- isDecimal()
- isEmpty()
- isFQDN(), checks if it's a fully qualified domain name
- isFloat()
- isHash()
- isHexColor()
- isIP()
- isIn(), checks if the value is in an array of allowed values
- isInt()
- isJSON()
- isLatLong()
- isLength()
- isLowercase()
- isMobilePhone()
- isNumeric()
- isPostalCode()
- isURL()
- isUppercase()
- isWhitelisted(), checks the input against a whitelist of allowed characters

또 matches() 함수를 이용해서 regular expression도 처리할 수 있습니다.

Date 타입도 아래와 같은 함수로 체크할 수 있습니다.

- isAfter(), checks if the entered date is after the one you pass
- isBefore(), checks if the entered date is before the one you pass
- isISO8601()
- isRFC3339()

[여기](https://github.com/chriso/validator.js#validators) 가 보시면 전체 리스트를 볼 수 있습니다.

그리고 check() 함수는 체이닝할 수 있습니다.

```js
check('name').isAlpha().isLength({ min: 10 })
```

만약 에러가 발생하면 서버는 즉시 에러코드를 리턴합니다.

예를 들어 이메일이 정확하지 않다면 다음과 같이 나올 겁니다.

```js
{
  "errors": [{
    "location": "body",
    "msg": "Invalid value",
    "param": "email"
  }]
}
```

기본 에러 메시지는 withMessage() 함수로 좀 더 유연하고 편하게 쓸 수 있습니다.

```js
check('name')
  .isAlpha()
  .withMessage('Must be only alphabetical chars')
  .isLength({ min: 10 })
  .withMessage('Must be at least 10 chars long')
```

validator를 직접 만들고 싶다면 custom 밸리데이터를 쓰면 됩니다.

```js
app.post(
  '/form',
  [
    check('name').isLength({ min: 3 }),
    check('email').custom(email => {
      if (alreadyHaveEmail(email)) {
        return Promise.reject('Email already registered')
      }
    }),
    check('age').isNumeric(),
  ],
  (req, res) => {
    const name = req.body.name
    const email = req.body.email
    const age = req.body.age
  },
)
```

---

## input 값 가공하기 <a name="sanitize_input"></a>

웹 서버 프로그래머 사이에 유명한 명언이 있는데요.

절대 유저가 입력한 값이 우리의 예상대로 들어왔다고 확신하지 말라는 얘기가 있는데요.

그래서 필요한 게 바로 inpur 값을 가공하는 절차가 한 번 더 필요합니다.

아까 위에서 봤던 validator에 추가해서 가공하는 절차를 넣어 볼까요?

```js
app.post('/form', [
  check('name').isLength({ min: 3 }).trim().escape(),
  check('email').isEmail().normalizeEmail(),
  check('age').isNumeric().trim().escape()
], (req, res) => {
  //...
})
```

trim(), escape() 같은 걸로 입력값을 한 번 더 가공해 줬습니다.

아래 리스트는 이때 사용하는 여러 가지 메서드인데 한번 읽어보시기를 바랍니다.

- trim() trims characters (whitespace by default) at the beginning and at the end of a string
- escape() replaces `<`, `>`, `&`, `'`, `"` and `/` with their corresponding HTML entities
- normalizeEmail() canonicalizes an email address. Accepts several options to lowercase email addresses or subaddresses (for example flavio+newsletters@gmail.com)

- blacklist() removes characters that appear in the blacklist
- whitelist() removes characters that do not appear in the whitelist
- unescape() replaces HTML encoded entities with `<`, `>`, `&`, `'`, `"` and `/`
- ltrim() like trim(), but only trims characters at the start of the string
- rtrim() like trim(), but only trims characters at the end of the string
- stripLow() removes ASCII control characters, which are normally invisible

- toBoolean() converts the input string to a boolean. Everything except for '0', 'false' and '' returns true. In strict mode only '1' and 'true' return true.
- toDate() converts the input string to a date, or null if the input is not a date
- toFloat() converts the input string to a float, or NaN if the input is not a float
- toInt() converts the input string to an integer, or NaN if the input is not an integer

여기서도 나만의 가공 루틴을 만들 수 있는데요.

```js
const sanitizeValue = value => {
  //sanitize...
}

app.post('/form', [
  check('value').customSanitizer(value => {
    return sanitizeValue(value)
  }),
], (req, res) => {
  const value  = req.body.value
})
```

---

## Express에서 Form 핸들링하기 <a name="handling_form_in_express"></a>

아래와 같은 HTML form이 있다고 합시다.

```js
<form method="POST" action="/submit-form">
  <input type="text" name="username" />
  <input type="submit" />
</form>
```

만약 유저가 버튼을 클릭하면 브라우저는 POST 리퀘스트를 `/submit-form` 주소로 요청할 겁니다.
(form은 GET request에서도 쓸 수 있습니다. 꼭 POST에서만 쓰는 건 아니지만 그래도 대부분 POST request일 때 가장 많이 쓰이죠.)

그리고 브라우저는 form 데이터를 인코딩하는데요.

`application/x-www-form-urlencoed` 형식으로 인코딩합니다.

그리고 POST request body 부분에 form data가 첨부되어 전송됩니다.

이걸 추출하기 위해서는 express.urlencoded() 미들웨어가 필요한데요.

```js
const express = require('express')
const app = express()

app.use(express.urlencoded({
  extended: true
}))
```

위와 같이 해주면 됩니다.

그러면 다음 코드처럼 req.body에서 값을 가져올 수 있습니다.

```js
app.post('/submit-form', (req, res) => {
  const username = req.body.username
  //...
  res.end()
})
```

---

## form에서 파일 업로드 핸들링하기 <a name="handling_upload_file_in_form"></a>

다음 예제는 HTML에서 파일 업로드하기 위한 form인데요.

```js
<form method="POST" action="/submit-form" enctype="multipart/form-data">
  <input type="file" name="document" />
  <input type="submit" />
</form>
```

`enctype="multipart/form-data"` 이걸 넣는 걸 잊어버리면 안 됩니다.

이걸 넣지 않으면 파일이 업로드되지 않습니다.

이걸 넣으면 브라우저는 `application/x-www-form-urlencoded` 형태로 인코드하지 않고 그냥 `multipart/form-data` 형태로 처리합니다.

서버 사이드 쪽에서 이런 multipart 파일을 처리하는 건 상당히 어려운데요.

그래서 패키지를 이용합니다.

[formidable](https://github.com/felixge/node-formidable) 패키지가 유명합니다.

```bash
npm install formidable
```

```js
const express = require('express')
const app = express()
const formidable = require('formidable')
```

이제 POST 엔드 포인트에서 처리해 볼까요?

```js
app.post('/submit-form', (req, res) => {
  new formidable.IncomingForm()
})
```

이렇게 하고 나면 form을 파싱할 수 있는 데요.

콜백을 이용해서 동기식으로 처리할 수 있습니다.

```js
app.post('/submit-form', (req, res) => {
  new formidable.IncomingForm().parse(req, (err, fields, files) => {
    if (err) {
      console.error('Error', err)
      throw err
    }
    console.log('Fields', fields)
    console.log('Files', files)
    for (const file of Object.entries(files)) {
      console.log(file)
    }
  })
})
```

또는 콜백 말고 이벤트를 이용할 수 있는데요.

```js
app.post('/submit-form', (req, res) => {
  new formidable.IncomingForm().parse(req)
    .on('field', (name, field) => {
      console.log('Field', name, field)
    })
    .on('file', (name, file) => {
      console.log('Uploaded file', name, file)
    })
    .on('aborted', () => {
      console.error('Request aborted by the user')
    })
    .on('error', (err) => {
      console.error('Error', err)
      throw err
    })
    .on('end', () => {
      res.end()
    })
})
````

어떤 방식이던지 최종적으로 Formidable.File 객체를 얻을 수 있을 겁니다.

- file.size, the file size in bytes
- file.path, the path the file is written to
- file.name, the name of the file
- file.type, the MIME type of the file

file.path를 이용해서 특정 폴더에서 처리하는 코드입니다.

```js
app.post('/submit-form', (req, res) => {
  new formidable.IncomingForm().parse(req)
    .on('fileBegin', (name, file) => {
        file.path = __dirname + '/uploads/' + file.name
    })
    .on('file', (name, file) => {
      console.log('Uploaded file', name, file)
    })
    //...
})
```

---

지금까지 ExpressJS와 NodeJS를 이용한 백엔드 프로그래밍에 대해 알아보았습니다.

많은 도움이 되셨으면 하네요.

그럼.
