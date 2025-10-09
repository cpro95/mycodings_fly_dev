---
slug: 2024-02-27-understanding-content-type-in-web-when-fetching
title: fetch 함수의 Content-Type 설정 방법 완벽 이해
date: 2024-02-27 12:35:24.185000+00:00
summary: fetch 함수의 Content-Type 설정과 동작을 제대로 이해해 봅시다.
tags: ["fetch", "content-type"]
contributors: []
draft: false
---

안녕하세요?

프론트엔드에서 백엔드로 fetch 함수를 사용하여 요청을 보낼 때, 어떤 "Content-Type"이 설정되어 있는지 아시나요?

오늘은 "Content-Type"이 어떻게 설정되며 또한 설정에 따라 어떤 영향을 미치는지 알아 보겠습니다.

테스트를 위해 Node.js의 Express를 사용할 예정입니다.

---

** 목 차 **

- [테스트 환경 설정](#테스트-환경-설정)
- [Express 설정](#express-설정)
- [데이터 전송에 사용되는 Content-Type](#데이터-전송에-사용되는-content-type)
  - [formData를 사용하는 경우](#formdata를-사용하는-경우)
- [Content-Type의 수동 설정](#content-type의-수동-설정)
- [URLSearchParams를 활용하는 경우](#urlsearchparams를-활용하는-경우)
  - [URLSearchParams란?](#urlsearchparams란)
- [URLSearchParams를 사용한 데이터 생성](#urlsearchparams를-사용한-데이터-생성)
- [Content-Type 수동 설정](#content-type-수동-설정)
- [JSON 데이터의 경우](#json-데이터의-경우)
  - [Content-Type 수동 설정](#content-type-수동-설정-1)

---

## 테스트 환경 설정

테스트를 위한 환경을 구축하기 위해 아래와 같이 빈 프로젝트를 만듭니다.
```sh
mkdir fetch-test
cd fetch-test
npm init -y
```

`fetch-test` 폴더에 `index.html` 파일을 생성합니다.

`form` 태그를 추가하고 `submit` 버튼을 클릭하면 백엔드의 `http://localhost:3000/api`로 POST 요청을 보냅니다.

이 POST 요청은 입력 폼이 아닌 JavaScript에서 데이터를 전송하는 것입니다.

`fetch` 함수의 옵션에 설정된 `data` 프로퍼티 값은 전송하는 데이터(폼 데이터, JSON 등)에 따라 다릅니다.

> 폼 안에 있는 `input` 요소는 여기서는 사용되지 않습니다.

```html
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>fetch content-type</title>
  </head>
  <body>
    <form method="post">
      <label for="name">이름</label>
      <input id="name" name="name" />
      <button>전송</button>
    </form>
  </body>
  <script>
    const form = document.querySelector('form');
    const handleSubmit = (event) => {
      event.preventDefault();

      // 데이터 생성 처리 코드를 작성합니다.

      fetch('http://localhost:3000/api', {
        method: 'POST',
        body: data,
      });
    }
    form.addEventListener('submit', handleSubmit);
  </script>
</html>
```

---

## Express 설정

백엔드로 요청을 보내기 위해 Express를 사용하겠습니다.

따라서 express, cors, multer, nodemon을 설치해야 합니다.

multer는 파일 업로드 시 사용되는 패키지입니다.

```sh
npm install express cors multer nodemon
```

설치가 완료되면 package.json 파일은 다음과 같은 내용을 가지게 됩니다.

```json
{
  "name": "fetch-test",
  "version": "1.0.0",
  "description": "fetch-test",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "multer": "^1.4.5-lts.1",
    "nodemon": "^3.1.0"
  }
}

```

설치가 완료된 후 index.js 파일을 아래와 같이 작성합니다.

이 코드는 req의 헤더에 있는 "Content-Type"과 req.body에 포함된 데이터를 터미널에 출력하고 있습니다.

```js
const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

app.post('/api', (req, res) => {
  console.log('Content-Type', req.headers['content-type']);
  console.log('req.body', req.body);

  res.send(req.body);
});

app.listen(port, function () {
  console.log(`Express 서버가 포트 ${port}에서 실행 중입니다!`);
});
```

Express 서버를 실행하기 위해 "npx nodemon node index.js" 명령을 실행합니다.

```bash
npx nodemon node index.js
[nodemon] 3.1.0
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node node index.js`
Express 서버가 포트 3000에서 실행 중입니다!
```

nodemon을 사용하고 있으므로 index.js 파일을 업데이트하면 자동으로 index.js 파일이 다시 로드됩니다.

---

## 데이터 전송에 사용되는 Content-Type

데이터를 전송할 때 사용되는 Content-Type은 여러 가지가 있습니다.

여기서는 다음 4가지 Content-Type에 대해 설명하겠습니다.

1. **multipart/form-data**: 주로 파일 업로드 시 사용됩니다.
2. **application/x-www-form-urlencoded**: 웹 폼에서 일반적으로 사용되며, 키-값 쌍으로 데이터를 전송합니다.
3. **text/plain**: 텍스트 데이터를 전송할 때 사용됩니다.
4. **application/json**: JSON 형식의 데이터를 전송할 때 사용됩니다.

Content-Type은 명시적으로 설정할 수도 있지만, 일부 Content-Type은 데이터 생성 방법에 따라 자동으로 설정됩니다.

먼저, 자동 설정 방법과 Express에서의 처리 방법을 알아보겠습니다.

### formData를 사용하는 경우

HTML 폼에서는 `enctype="multipart/form-data"`를 설정하지 않으면 파일을 전송할 수 없습니다.

JavaScript를 사용하여 파일을 전송하려면 formData를 활용합니다.

> 일반적으로 formData를 사용할 때는 파일을 설정하지만, 여기서는 파일을 사용하지 않고 텍스트 데이터만 설정할겁니다.

formData는 키-값 쌍으로 데이터를 설정할 수 있으므로 'name' 키에 'John', 'age' 키에 30을 설정합니다.

이 데이터는 Express의 `req.body`에 전달됩니다.

```html
<script>
<!DOCTYPE html>
<html lang="ko">
  // 생략
  <script>
    const form = document.querySelector('form');
    const handleSubmit = (event) => {
      event.preventDefault();

      const formData = new FormData();
      formData.append('name', 'John');
      formData.append('age', 30);

      fetch('http://localhost:3000/api', {
        method: 'POST',
        body: formData,
      });
    };
    form.addEventListener('submit', handleSubmit);
  </script>
</html>
</script>
```

index.html 파일을 브라우저에서 열고 submit 버튼을 클릭하면 Express의 엔드포인트 `/api`로 POST 요청이 전송됩니다.

Express를 실행 중인 터미널에서 Content-Type은 표시되지만 `req.body`는 정의되지 않았음을 확인할 수 있습니다.

```sh
Content-Type multipart/form-data; boundary=----WebKitFormBoundaryv1cp7tddit4w6BBn
req.body undefined
```

> Request Headers의 Content-Type은 Chrome 브라우저의 개발자 도구 네트워크 탭에서도 확인할 수 있습니다.

터미널에 표시된 내용에서 formData를 사용하여 Content-Type이 자동으로 multipart/form-data로 설정되는 것을 확인할 수 있습니다.

그러나 전송된 데이터의 내용을 확인할 수 없습니다.

```js
const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();
const port = 3000;

app.use(cors());

const upload = multer();

app.post('/api', upload.any(), (req, res) => {
  console.log('Content-Type', req.headers['content-type']);
  console.log('req.body', req.body);

  res.send(req.body);
});

app.listen(port, function () {
  console.log(`Express server listening on port ${port}!`);
});
```

위 코드는 Express 애플리케이션에서 `multer` 패키지를 사용하여 `multipart/form-data` 형식의 내용을 확인하는 방법을 보여줍니다.

`index.js` 파일에 `multer` 설정을 추가하면 됩니다.

`multer`를 추가한 후 브라우저에서 "Submit" 버튼을 클릭하여 요청을 보내면, `formData`에 설정한 데이터의 내용을 확인할 수 있게 됩니다.

예를 들어, 다음과 같은 결과가 나타날 수 있습니다:

```sh
Content-Type multipart/form-data; boundary=----WebKitFormBoundaryAKlsV6BGUW91Ajj8
req.body [Object: null prototype] { name: 'John', age: '30' }
```

---

## Content-Type의 수동 설정

`formData`를 설정하면 자동으로 `Content-Type`이 `multipart/form-data`로 설정됩니다.

그러나 `Content-Type`은 명시적으로 설정할 수도 있습니다.

`headers`에서 `Content-Type`을 `multipart/form-data`로 설정하면 어떤 차이가 있는지 확인해보겠습니다.

```html
<!DOCTYPE html>
<html lang="ko">
  <head>
    <!-- 생략 -->
  </head>
  <body>
    <form>
      <!-- 생략 -->
    </form>
    <script>
      const form = document.querySelector('form');
      const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('name', 'John');
        formData.append('age', 30);

        fetch('http://localhost:3000/api', {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        });
      };
      form.addEventListener('submit', handleSubmit);
    </script>
  </body>
</html>
```

`headers`에서 `Content-Type`을 설정한 후 브라우저에서 "Submit" 버튼을 클릭하면 "Multipart: Boundary not found" 오류가 발생합니다.

```sh
Error: Multipart: Boundary not found
    at new Multipart (/Users/mac/Desktop/file_upload_test/node_modules/busboy/lib/types/multipart.js:233:13)
    at getInstance (/Users/mac/Desktop/file_upload_test/node_modules/busboy/lib/index.js:33:12)
    at module.exports (/Users/mac/Desktop/file_upload_test/node_modules/busboy/lib/index.js:56:10)
```

Express 서버를 실행한 터미널에서는 `Content-Type`이 표시되지 않았으며, 브라우저 개발자 도구를 확인해보면 Request Headers의 `Content-Type`에는 `multipart/form-data`가 설정되어 있지만 boundary가 설정되지 않았음을 알 수 있습니다.

```sh
Content-Type: multipart/form-data;
```

오류 메시지에서도 "Multipart: Boundary not found"라고 표시되었듯이 오류의 원인은 boundary의 부재입니다.

boundary는 헤더와 전송한 데이터의 경계를 나타내므로 boundary가 없으면 데이터의 시작과 끝을 알 수 없어 오류가 발생합니다.

이를 통해 `formData`를 전송할 때 `multipart/form-data;`를 명시적으로 설정하지 않아도 된다는 사실을 알 수 있습니다.

---

## URLSearchParams를 활용하는 경우

먼저, URLSearchParams가 어떤 상황에서 사용되는지 확인해보겠습니다.

### URLSearchParams란?

URLSearchParams는 URL의 쿼리 문자열을 다루기 위한 유틸리티 메서드를 제공합니다.

URLSearchParams를 구현한 객체는 for...of 반복문을 통해 직접 키/값 쌍을 순회할 수 있습니다.

이 순회 순서는 쿼리 문자열에 나타난 순서와 동일합니다.

예를 들어, 다음 두 줄의 코드는 동일한 결과를 반환합니다.

```js
const url = '?name=John&age=30';
const params = new URLSearchParams(url);

console.log(params.toString());
console.log(params.get('name'));
console.log(params.get('age'));

for (const [key, val] of params) {
    console.log(`${key}: ${val}`);
}

//결과
name=john&age=30
john
30
name: john
age: 30
```

URLSearchParams를 사용하면 URL의 쿼리 파라미터를 쉽게 조작할 수 있습니다. 

---

## URLSearchParams를 사용한 데이터 생성

아래는 **URLSearchParams**를 이용하여 데이터를 생성하는 예시 코드입니다.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <!-- head 부분은 생략 -->
</head>
<body>
  <form>
    <!-- 여기에 다양한 입력 필드를 추가할 수 있습니다. -->
    <button type="submit">Submit</button>
  </form>

  <script>
    const form = document.querySelector('form');
    const handleSubmit = (event) => {
      event.preventDefault();

      // URLSearchParams 객체를 생성하고 값을 추가합니다.
      const params = new URLSearchParams();
      params.append('name', 'John'); // 이름
      params.append('age', 30); // 나이

      // 서버로 POST 요청을 보냅니다.
      fetch('http://localhost:3000/api', {
        method: 'POST',
        body: params,
      });
    };
    form.addEventListener('submit', handleSubmit);
  </script>
</body>
</html>
```

위 코드에서는 `URLSearchParams`를 이용하여 데이터를 생성하고, 서버로 POST 요청을 보내는 방법을 보여줍니다.

브라우저에서 `Submit` 버튼을 클릭하면 서버로 데이터가 전송되며, 서버에서는 `express.urlencoded()` 미들웨어를 통해 "application/x-www-form-urlencoded" 형식으로 전송된 데이터를 확인할 수 있습니다.

이를 통해 `req.body`에는 `{ name: 'John', age: '30' }`과 같은 값이 들어오게 됩니다.

```sh
Content-Type application/x-www-form-urlencoded;charset=UTF-8
req.body { name: 'Jonh', age: '30' }
```

---

## Content-Type 수동 설정

Content-Type을 명시적으로 "application/x-www-form-urlencoded"로 설정한 경우도 확인해 보겠습니다.

```html
<!DOCTYPE html>
<html lang="ko">
// 생략
  <script>
    const form = document.querySelector('form');
    const handleSubmit = (event) => {
      event.preventDefault();

      const params = new URLSearchParams();
      params.append('name', 'Jonh');
      params.append('age', 30);

      fetch('http://localhost:3003/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      });
    };
    form.addEventListener('submit', handleSubmit);
  </script>
</html>
```

자동으로 설정되는 경우에는 charset=UTF-8이 자동으로 추가되지만, headers에 "application/x-www-form-urlencoded"를 설정한 경우에도 req.body의 내용을 확인할 수 있습니다.

```sh
Content-Type application/x-www-form-urlencoded
req.body { name: 'Jonh', age: '30' }
```

이렇게 설정하면 서버에서도 정확한 내용을 확인할 수 있습니다.

---

## JSON 데이터의 경우

JavaScript를 사용하여 요청을 보낼 때, 가장 많이 사용되는 Content-Type은 JSON 데이터입니다.

아래 예시에서는 `name`과 `age` 프로퍼티를 가진 객체를 문자열로 변환하여 전송하고 있습니다.

```html
<!DOCTYPE html>
<html lang="ko">
  <head>
//생략
  <script>
    const form = document.querySelector('form');
    const handleSubmit = (event) => {
      event.preventDefault();

      fetch('http://localhost:3003/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({
          name: 'John',
          age: 30,
        }),
      });
    };
    form.addEventListener('submit', handleSubmit);
  </script>
</html>
```

Express에서 설정한 미들웨어 코드를 삭제해보겠습니다.

```js
const express = require('express');
const cors = require('cors');

const app = express();
const port = 3003;

app.use(cors());

app.post('/api', (req, res) => {
  console.log('Content-Type', req.headers['content-type']);
  console.log('req.body', req.body);

  res.send(req.body);
});

app.listen(port, function () {
  console.log(`Express server listening on port ${port}!`);
});
```

브라우저에서 `index.html` 파일을 열고 Submit 버튼을 클릭하면 Content-Type이 `text/plain`으로 표시되고 `req.body`는 `undefined`로 표시되어 내용을 확인할 수 없습니다.

```sh
Content-Type text/plain;charset=UTF-8
req.body undefined
```

Express에서 Content-Type이 "text/plain"으로 전송된 경우, `express.text()` 미들웨어를 사용합니다.

```js
app.use(cors());
app.use(express.text());
```

`express.text()` 미들웨어를 추가한 후 브라우저에서 다시 Submit 버튼을 클릭하면 `req.body`가 문자열로 가져온 것을 확인할 수 있습니다.

```sh
Content-Type text/plain;charset=UTF-8
req.body {"name":"John","age":30}
```

하지만 문자열이기 때문에 `name` 프로퍼티의 값을 가져올 수는 없습니다.

```sh
console.log('req.body', req.body.name);
//결과
undefined
```

`JSON.parse`를 사용하면 문자열을 객체로 변환하여 `name` 프로퍼티만 추출할 수 있습니다.

```js
app.post('/api', (req, res) => {
  console.log('Content-Type', req.headers['content-type']);
  console.log('req.body', req.body.name);
  const data = JSON.parse(req.body);
  console.log(data.name);

  res.send(req.body);
});
```

```sh
Content-Type text/plain;charset=UTF-8
req.body undefined
John
```

---

### Content-Type 수동 설정
index.html에서는 Content-Type을 "text/plain"으로 설정하는 대신 POST 요청에 대해 Content-Type을 "application/json"으로 설정합니다.

```html
<!DOCTYPE html>
<html lang="ko">
// 생략
  <script>
    const form = document.querySelector('form');
    const handleSubmit = (event) => {
      event.preventDefault();

      fetch('http://localhost:3000/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'John',
          age: 30,
        }),
      });
    };
    form.addEventListener('submit', handleSubmit);
  </script>
</html>
</script>
```

브라우저에서 Submit 버튼을 클릭하면 index.html에서 지정한대로 Content-Type이 "application/json"으로 설정되었습니다.

그러나 이제 req.body가 undefined로 표시되어 내용을 확인할 수 없습니다.

```sh
Content-Type application/json
req.body undefined
```

"application/json"으로 전송된 데이터를 객체로 가져오려면 express.json() 미들웨어를 사용해야 합니다.

```js
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3003;
app.use(cors());
app.use(express.json());
app.post('/api', (req, res) => {
  console.log('Content-Type', req.headers['content-type']);
  console.log('req.body', req.body.name);
  res.send(req.body);
});
app.listen(port, function () {
  console.log(`Express server listening on port ${port}!`);
});
```

다시 브라우저에서 Submit 버튼을 클릭하면 req.body에는 전송한 데이터가 객체로 포함되어 있는 것을 확인할 수 있습니다.

```sh
Content-Type application/json
req.body { name: 'John', age: 30 }
```

"text/plain"의 경우 name 속성에 접근하기 위해 JSON.parse를 사용했지만, "application/json"으로 전송하고 express.json() 미들웨어를 사용하는 경우에는 name 속성에 직접 접근할 수 있습니다.

지금까지 알아본대로 Content-Type에는 여러 가지 값이 있고, 전송하는 데이터에 따라 자동으로 설정되는 것을 알 수 있었습니다.

백엔드 서버에서도 Content-Type에 따라 사용하는 패키지나 미들웨어가 다르다는 것을 확인했습니다.

지금까지 Content-Type에 대한 이해가 모호했던 분들도 이제 더 깊게 이해하셨을 것으로 기대됩니다.

그럼.



