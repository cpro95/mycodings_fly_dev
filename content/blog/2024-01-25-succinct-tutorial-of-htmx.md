---
slug: 2024-01-25-succinct-tutorial-of-htmx
title: 최근 가장 핫한 HTMX 간결하게 살펴보기
date: 2024-01-25 12:22:59.725000+00:00
summary: HTMX 사용법 살펴보기
tags: ["htmx", "javascript"]
contributors: []
draft: false
---

![](https://blogger.googleusercontent.com/img/a/AVvXsEhp8ib-ff3tnGWnwFQT9nbbh7Y1lOy3UlbBdFIL6xCdLCp3mom9jDz8bpTAoFPW66ANtajCQLKnYZ6OmKwsPjsGjsEbRqmRCbhdFtYcQ5lsSbVSYmIv0jZOAT8BOXHQfWcA9CRv36u4KgvUEJJ-LuYZPwwnQgOPc0ZE4Fxd-AuF95xGwQ3b0Vtc_GOexXc)

안녕하세요?

오늘은 최근 자바스크립트 진영에서 갑자기 인기가 급상승 중인 HTMX의 기초를 다뤄볼까 합니다.

자바스크립트를 사용하지 않고 동적 페이지를 쉽게 만들고 싶은 적이 있을텐데요.

그렇다고 예전 jQuery로 가긴 그렇고요.

그럴 때 이용할 수 있는 것이 현재 인기 급상승 중인 HTMX입니다.

HTMX는 자바스크립트를 사용하지 않고 서버에서 받은 데이터를 페이지에 동적으로 추가할 수 있습니다.

그럼 본격적으로 삺펴 보겠습니다.

** 목 차 **

- 1. [HTMX란?](#HTMX)
- 2. [테스트 환경 구축](#1)
- 3. [hx-swap 속성](#hx-swap)
- 4. [hx-target 속성](#hx-target)
- 5. [Express로 백엔드 서버 구성](#Express)
- 6. [express 라우팅 설정과 HTML 리턴](#expressHTML)
- 7. [Loading 표시하기](#Loading)
- 8. [hx-trigger](#hx-trigger)
- 9. [JSON 데이터를 받았을 경우](#JSON)
- 10. [페이지가 열리자마자 실행되는 코드 작성하기](#2)
- 11. [hx-post 속성](#hx-post)

---

## 1. <a name='HTMX'></a>HTMX란?

HTMX는 UI 라이브러리로 HTMX 자체는 JavaScript로 작성되어 있습니다만 HTMX의 개발자는 JavaScript의 코드를 기술하지 않고 HTML의 마크업에 HTMX가 제공하는 속성을 추가하는 것으로 Ajax를 이용해 서버와 통신을 할 수 있게 만들었습니다.

복잡한 자바스크립트 코드를 작성하지 않고도 간단한 방식으로 동적 웹 페이지를 만들고 싶은 개발자에게는 완벽한 기술인데요.

본격적인 테스트에 들어가 보겠습니다.

---

## 2. <a name='1'></a>테스트 환경 구축

HTMX에서는 요청을 보내면 HTML을 반환하는 서버를 준비해야 하지만 먼저 JSONPlaceHolder 서버를 이용하여 테스트해 보겠습니다.

나중에 Node.js의 Express를 이용하여 서버를 구축할 예정인데, 그전에 먼저, htmx-test라는 디렉터리를 만들고 그 안에 index.html 파일을 만듭니다.

```bash
mkdir htmx-test
cd htmx-test
touch index.html
```

htmx는 자바스크립트 파일인데요.

공식 홈페이지에서는 `unpkg.com` 사이트에 있는 htmx 파일을 사용하라고 하는데요.

저는 크기를 보기 위해 한번 다운로드하여 보겠습니다.

```bash
➜ tree --du -h
[ 51K]  .
├── [4.1K]  README.md
├── [ 47K]  htmx-1.9.10.js
└── [ 388]  index.html

  51K used in 1 directory, 3 files
```

47KB 크기네요.

react와 react-dom의 크기를 한번 살펴보겠습니다.

사이즈를 보기 위해서는 [bundlephobia.com](https://bundlephobia.com) 사이트가 아주 유용한데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiTjMO__JbgH1MaO7o0N2-kYv9R1eEdLxxQI-uyRXtUPPMMGMyqf_DpUaymHVMUemSRDFu51nQoTDYfRH3yetu2w7iDLYitZW2cnwYsmFZWglPi_aP5kEdAEiDE35b2iDKi094cIhrXC58rGocK9gc7UZPoNCxs9Yo5pmqgXpyxZtTQ-QxBFgt0E5Z1UkQ)

![](https://blogger.googleusercontent.com/img/a/AVvXsEg8lWFF3AzG96nZ_g0NNb-n-y956AV2UzGI-tY7TP6iNftkM9rVQW83-XT_ipdLhFl2VgPHlpDWYhdZnQO7qfUhDC0UDWL6aOvPzICLD3xkqmogcrSzbkK_3zzsq-xlb4s88tQ2JNaCdYfL7FKkTk9vn_iP1a9PmKfNAByi5Xo57UAiVLXaNwA9TgH3b3s)

위 코드와 같이 react가 6.4Kb이고 react-dom이 130.2Kb입니다.

두 개 합치면 136.6Kb이네요.

HTMX가 47Kb이니까 3배 정도 차이로 HTMX가 작네요.

이걸로 봐서도 UI를 위해 HTMX를 사용하는 것도 꽤 좋은 선택이 될 거 같네요.

이제 다음 코드를 index.html 파일에 작성합니다.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>HTMX Tutorial</title>
    <!-- <script src="https://unpkg.com/htmx.org@1.9.10"></script> -->
    <script src="htmx-1.9.10.js"></script>
  </head>
  <body>
    <h1>HTMX Tutorial</h1>
    <button hx-get="https://jsonplaceholder.typicode.com/users/1">Click</button>
  </body>
</html>
```

코드는 script 태그로 HTMX 라이브러리를 CDN을 통해 다운로드하거나, 아까 다운로드했던 htmx 자바스크립트 코드를 로컬상에서 불러올 수 도 있습니다.

그리고 button 태그에 HTMX가 제공하는 hx-get 속성을 추가하여 URL을 지정합니다.

hx-get 속성을 설정하여 버튼을 클릭하면 hx-get에서 지정한 URL로 GET 요청을 보냅니다.

URL에는 JSONPLaceholder가 설정되어 있으며 액세스하면 JSONPLaceholder에서 사용자 정보가 반환됩니다.

이제 index.html 파일을 더블 클릭하면 브라우저에서 열리는데요.

아래와 같이 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhJXvO934fUF0WOH4cmtrXXRtsJkn4KbkaRpXGIYc3-KAv82zyLLuLWTCpj9yRSE_KXNjvIvEUWpHQoUyWh7UiA4g0q85xFrcAXH54_AR62DDjtQyUN6HiebEVgry0TrfaFtglrcpv59B4GqnjekdqaDht5nP_fXmOQkTfoD-DefBFUu-_kkJU8AmCuJEA)

브라우저에서 확인하면 h1 태그의 HTMX 문자열과 Click 버튼이 표시됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiFTz5CT8-X1ShOpJFaMJvu0_C8vU5IumA2kbIQfZN_1_qmzEmEuoW96mO5hevkiPHLnwFoS1Ppi5p7YHn1txbN39AjJ8eytsw8XmPPwjD7D-njUazvk-wCWZx7hRCzfKJonqUpmywqgi_Shu6mDaXZoeMkBleWI_41cSAUdBFW_XH_dZBCIMF9bnQ_Dh4)

클릭해 보면 위와 같이 나오는데요.

이게 바로 HTMX의 위력입니다.

녹색 색깔의 사각형으로 둘러싸여 있기 때문에 어떻게 되어 있는지는 모르겠지만 hx-get URL에서 반환된 데이터가 그대로 button 태그의 콘텐츠로 바뀌고 있습니다.

사실 `https://jsonplaceholder.typicode.com/users/1` 주소로 가보면 아래와 같이 나오는데요.

```json
{
  "id": 1,
  "name": "Leanne Graham",
  "username": "Bret",
  "email": "Sincere@april.biz",
  "address": {
    "street": "Kulas Light",
    "suite": "Apt. 556",
    "city": "Gwenborough",
    "zipcode": "92998-3874",
    "geo": {
      "lat": "-37.3159",
      "lng": "81.1496"
    }
  },
  "phone": "1-770-736-8031 x56442",
  "website": "hildegard.org",
  "company": {
    "name": "Romaguera-Crona",
    "catchPhrase": "Multi-layered client-server neural-net",
    "bs": "harness real-time e-markets"
  }
}
```

HTMX가 jsonplaceholder 서버에서 받은 텍스트를 그대로 브라우저에 표시해 주고 있습니다.

크롬 디벨로퍼 모드로 들어가서 어떤 일이 벌어지는지 한번 보겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgTOWUfns1taTd9EjjnayDqzCyho88XrZtBEzRyDUDxGzZn-0abnOLxzgMaUXcOt6KE7ij3GPpJ83VPCQi81kqkRhjUn51GRp_zha_28ZTEbScjn3Pidk0-obQoYXJEbdJ2xJm_H3PIgJMIK1DV22g-8ua5nuIrjg1_TAKql_dDwovwbxTvYXWmQh-nsqY)

위와 같이 HTMX가 `https://jsonplaceholder.typicode.com/users/1` 주소로 HTTP GET Request를 요청하고 Response를 받아오고 있습니다.

여기까지 보시면 HTMX가 대충 어떤 일을 하는지 감이 오실 겁니다.

HTML에서 form과 button의 submit에 의해서만 HTTP Request를 수행할 수 있다는 제약조건을 극복하고자 HTMX의 개발이 시작되었다고 합니다.

그래서 HTMX에서는 HTML의 어떤 태그에서도 HTTP Request를 수행할 수 있게 해 줍니다.

이제 본격적인 HTMX의 공부에 들어가 보겠습니다.

---

## 3. <a name='hx-swap'></a>hx-swap 속성

아까 전 예제에서는 hx-get 속성만 있어서 button 태그 안에 Response 값이 아래 그림처럼 삽입되었는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjw7LHi15rDRPzGVBX3getlSm8Qt5F2fF_wG349B06B9os2JlxEWzFbwvKflgVZWWmDMfB_U2jPs-c8_NP5RaApSiPHxUXOqAfCzZY6sMvZeqUwvumv56Pzebk2IiawEm5-yL4fPAf-OsMLiZkrvVVfaTkyJKCWtJvSx8x8g5ckhz8rJLNf5mzONFBYZBE)

UI를 꾸밀 때 위와 같이 꾸미지는 않죠.

그래서 hx-swap 속성을 지원해 줍니다.

hx-swap 속성에 'outerHTML' 만 지정해도 button 요소 외부에 데이터를 표시해 줍니다.

```html
<button
  hx-get="https://jsonplaceholder.typicode.com/users/1"
  hx-swap="outerHTML"
>
  Click
</button>
```

hx-swap=”outerHTML”을 설정하면 button 태그의 부모 요소에 데이터가 표시되고 button 태그는 사라집니다.

여기서 button의 부모 요소는 body이기 때문에 아래 그림과 같이 body 요소 아래 나타나게 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhP3iGZURaYT57Un9vLKbNsBrwXAScleHixxrfremRTnqbjqvwlHHnhE2tsLEaP-T2aZOMmjFJ07ugYG5pABiTis_jcCU-dCRbR-RgegGpl6Tc7kz6TA1NG3CDjpO5k3UnHQ_iVp9ha3-kq6W2MyZYUe0BlJNZzSak8kP9SwS3JcaLW-1yMicAtSjEN0ow)

위와 같이 나옵니다.

만약 hx-swap만 아래와 같이 쓰면 "innerHTML" 이라는 기본값이 지정됩니다.

이 속성을 한 번 볼까요?

```html
<button hx-get="https://jsonplaceholder.typicode.com/users/1" hx-swap>
  Click
</button>
```

아래와 같이 hx-swap 이 없었을 때와 똑같이 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEi-kMpn8he5-6RwgmBU6ptBTyVwRT79XLtBDIIprV7FOrmnP9TAoH1dNwKbwG7ublrpCUueG9VJ07upnqOvAJD26OrLoIZVTwclJBwH_Y5Mze-EAqKET4gbvV3v8OMqTznYF0uiIPHiLO9ImxxXtptzLSwvANDTktzWEWZMiHJBFCFiuXB5PFZmVX0_l9g)

이제 hx-swap='innerHTML'은 디폴트 값이라는 걸 아실 겁니다.

hx-swap 속성을 안 써도 'innerHTML' 값으로 항상 들어가 있다고 보시면 됩니다.

여기서 [공식문서](https://htmx.org/attributes/hx-swap/)를 한번 살펴보는 것도 좋을 듯 싶네요.

---

## 4. <a name='hx-target'></a>hx-target 속성

hx-swap과는 다르게 hx-target은 말 그대로 원하는 위치에 AJAX로 가져온 데이터를 표시시킵니다.

```html
<button hx-get="https://jsonplaceholder.typicode.com/users/1" hx-target="#here">
  Click
</button>
<h2 id="here">Here</h2>
```

위와 같이 h2 태그의 id를 'here'로 지정했고 hx-target의 값을 '#here'라고 지정했습니다.

실행결과는 아래와 같습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgfde-0t86rQv5503JUuzCmJ-5M8iAF_x472b0S8yo5icIb3xw8v7y1NLwlvozgx2vOXXL2HmX6GfzXhv-DYq7jwK7GTlN1Rxj9zfkdLtbhR8dDHU-zxK40HF2OGFfsWx6cs5U1gqftL601CUbcmfrZQPGyCn4KlUClwLkw-IEcKDTqWz0ph4dO8QWylI0)

위와 같이 나왔던 게 클릭 버튼을 누르면 아래와 같이 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiqnJN3XK92sihfWHwAm8qwRDJNE0e1njhL5qeXJ8MIqgSxwngJ9whJ3onCTRqd2SdFzBysrOQPq-rcADofSo4KzrNUn76dcUy2OKVVWTVs4GMtqcnKrlct-JYzR2UZpgNcYdVzoLEghy8bgnRCcNKho3tit05IqUjyS_PRXrkLq_xSi68ofANJAOLaQSM)

위 그림과 같이 h2 태그 안의 값을 대체하고 있죠.

---

## 5. <a name='Express'></a>Express로 백엔드 서버 구성

이제 본격적인 풀스택 개발을 위해 express로 백엔드를 구성해서 HTMX를 테스트해 보겠습니다.

```bash
npm init -y
npm install express
```

이제 index.js 파일을 만들어서 아래와 같이 express 서버를 작성합니다.

```js
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Server listening on port ${port}!`))
```

```bash
node index.js
Server listening on port 3000!
```

express 서버는 잘 실행되고 있네요.

브라우저에서 `http://localhost:3000`으로 접속해 보면 "Hello World"가 잘 보일 겁니다.

원활한 테스트를 위해 nodemon을 설치하고 실행하겠습니다.

```bash
npm i -D nodemon
```

package.json 파일에 'dev' 항목을 수정합시다.

```json
  "scripts": {
    "dev": "nodemon index.js"
  },
```

이제 npm run dev를 실행해 보면 개발 서버가 잘 돌아갈 겁니다.

```bash
npm run dev

> htmx-test@1.0.0 dev
> nodemon index.js

[nodemon] 3.0.3
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node index.js`
Server listening on port 3000!
```

그러면 아까 우리가 만든 index.html 파일을 public 폴더를 만들고 그 안에 넣겠습니다.

htmx-1.9.10.js 파일도 같이 옮기겠습니다.

unpkg.com CDN을 이용하면 굳이 로컬에 htmx-1.9.10.js 파일을 만들지 않아도 됩니다.

각자 취향 차이니까요. 원하시는 방법대로 하시면 됩니다.

express 서버에 public 폴더를 Static 서빙하기 위해 코드를 아래와 같이 바꿉니다.

```js
const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public'))

app.listen(port, () => console.log(`Server listening on port ${port}!`))
```

이제 브라우저에서 `http://localhost:3000`으로 가볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEiEvxXF2O8nTHvFWm_wkwzXiikDVRWLk7vyctXptpLTOkdVu8Z2sTuhwb9iBHBvv3oIUqNmkrZE3W0RCtot_SjuNd4AsRQgHaRm2fsNM6KFV2U00X_VSt0VaX1CBm8CZdxybMgX5DZW_LE0-Cf5_R74CNUqRUarz4WGfWjxP4xDmjcsgqPqWPNLFntb8YQ)

위와 같이 나오고 클릭버튼을 누르면 아래와 같이 나올 겁니다.

1[](https://blogger.googleusercontent.com/img/a/AVvXsEjOGdfBfFPzizmwdx5KCBDN6ECiIE9JnGDYoSHsfKtC92eLIPaBxVCWYlb0CRrnlbBpZ0i6Fv70TjYocb8c-gBSEZanaxjxEvBZP7kq4ubxZu3EjuwbRI2pIpnYRLWmyDITD5BcuXQ6Tf2BrJRIXcnc6hH7nH70hdHFudYEYIxbdN5tGYq5ZwxoV8SKXPc)

HTMX가 express 서버에서도 잘 작동하고 있네요.

---

## 6. <a name='expressHTML'></a>express 라우팅 설정과 HTML 리턴

Express 백엔드 서버를 구축했기 때문에 라우팅을 설정하여 좀 더 현실적인 앱을 만들어 봅시다.

먼저 '/greeting' 라우팅으로 가면 간단한 span 태그를 리턴하는 코드를 만듭시다.

```js
const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public'))

app.get('/greeting', (req, res) =>
  res.send(`<span style="color:gray">Hello HTMX</span>`),
)

app.listen(port, () => console.log(`Server listening on port ${port}!`))
```

GET Request에 대응시키는 app.get 메서드를 이용해서 '/greeting' 라우팅을 구현했습니다.

이제 jsonplaceholder 서버 말고 '/greeting' 서버를 이용해서 HTMX를 테스트해 보겠습니다.

```html
<body>
  <h1>HTMX Tutorial</h1>
  <button hx-get="/greeting" hx-target="#here">Click</button>
  <h2 id="here">Here</h2>
</body>
```

위와 같이 하고 브라우저에서 클릭을 눌러보겠습니다.

그리고 최종 구조를 살펴보겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEisuJw_uiPTss20HfXg5lwUXphM1X95vjybIVwIOGa2dsoMg1hzvh_W4Z4cH4AG6hHgqaEBARHhBoXJb8iGeLT5TBXvn_OdeNL0zlNGHopATgw2mETkPYPCI7qR2eUFAbkQ_0iegwFpkFuJ7G-LXSslF1gLpJGCb5tMDd1JxckfEZQ616PsbEiOeXUScpo)

위 그림과 같이 express 서버가 리턴 한 span 태그의 내용이 그대로 h2 태그 안에 삽입되었습니다.

위 그림을 보시면 span 태그가 h2 태그 안에 위치했죠.

바로 hx-swap 속성이 디폴트값으로 'innerHTML' 값으로 작동하기 때문입니다.

hx-swap='outerHTML' 속성을 추가하고 테스트해 보겠습니다.

```html
<body>
  <h1>HTMX Tutorial</h1>
  <button hx-get="/greeting" hx-target="#here" hx-swap="outerHTML">
    Click
  </button>
  <h2 id="here">Here</h2>
</body>
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEgF9InH85LAIeOeqBPQsSK7misOLwWPw2yWfc2-ZD3ZkN4KvOnn9rXEw_7nLg0C27eK2UWgD-SmvFVC2MfraJk82ap2PYvp-fM10KAMA6dFDcLuQk9-EADSTl8gciRtIhdG7EAyE2LEtQ4YwDvlGiSdCRDieoOFU8UdgJHwwDrXer9EIY5M11aOMTzh8U0)

위 그림과 같이 span 태그가 h2 바깥쪽으로 삽입되었습니다.

---

## 7. <a name='Loading'></a>Loading 표시하기

리액트에서 AJAX 요청을 할 때 가장 중요한 게 바로 유저에서 로딩 중이라는 표시를 해야 하는데요.

HTMX에서도 쉽게 구현할 수 있습니다.

먼저, express 서버에서 강제로 setTimeout 함수를 이용해서 2초 후에 반환하도록 코드를 바꿔 보겠습니다.

```js
...
...

app.get("/greeting", async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  res.send(`<span style="color:gray">Hello HTMX</span>`);
});

...
...
```

app.get 메서드만 보시면 됩니다.

Loading 문구를 표시하기 위한 백엔드 구성은 끝났고, 이제 HTMX를 이용해서 UI에 그려야 하는데요.

이 때 쓰이는 속성이 바로 'hx-indicator' 속성입니다.

이 'hx-indicator' 속성 값에는 Loading 문구가 표시될 해당 위치를 연결시켜 주면 됩니다.

```html
<body>
  <h1>HTMX Tutorial</h1>
  <button hx-get="/greeting" hx-target="#here" hx-indicator="#indicator">
    Click
  </button>
  <span class="htmx-indicator" id="indicator">Loading...</span>
  <h2 id="here">Here</h2>
</body>
```

실행 결과를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEjaIjLL4S5PsOFAvek9TXx2GrxIU2C9fvVdqQGIwJ6dcixQsr6a9ePOzODa6SOJuMzF6ca3hmYSlAWf5KkOu3Njtwrw8vHUaUyiUKJH3ZyzHg1NSHUaVgnDJghxppaoDjTmvZlpdMsTmMHj_xYsWGelYoTjV6o7Is8JnZScNG-ojeSjfK9JXz36ng3qhQc)

위와 같이 'Loading...' 문구가 잘 나오고 있습니다.

여기서 중요한 게 바로 로딩 문구의 엘리먼트에 꼭 'htmx-indicator'이란 CSS 클래스를 추가해야 한다는 겁니다.

이게 가장 중요하니 잊어버리지 마시기를 바랍니다.

2초 후에는 'Loading...' 문구가 사라질 겁니다.

내부적으로 HTMX가 htmx-indicator의 CSS 클래스를 아래와 같이 운영합니다.

요청하지 않을 경우 opacity:0 이 설정되고요.

```css
.htmx-indicator {
  opacity: 0;
}
```

요청 중에는 아래와 같이 클래스가 지정됩니다.

```css
.htmx-request.htmx-indicator {
  opacity: 1;
  transition: opacity 200ms ease-in;
}
```

---

## 8. <a name='hx-trigger'></a>hx-trigger

버튼을 클릭하면 요청이 전송되지만, 요청을 보내는 이벤트는 hx-trigger 속성을 이용해서 커스텀하게 설정할 수 있습니다.

예를 들어 마우스가 들어올 때 요청을 보내고 싶다면 hx-trigger 속성에 mouseover 값을 설정하면 됩니다.

```html
<button
  hx-get="/greeting"
  hx-target="#here"
  hx-indicator="#indicator"
  hx-trigger="mouseover"
>
  Click
</button>
<span class="htmx-indicator" id="indicator">Loading...</span>
<h2 id="here">Here</h2>
```

테스트해 보시면 아시겠지만 마우스를 button 위에 올려두면 알아서 'Loading...' 문구가 보이면서 AJAX 요청이 이루어집니다.

이게 hx-trigger 가 작동되는 방식입니다.

---

## 9. <a name='JSON'></a>JSON 데이터를 받았을 경우

우리가 리액트 코드를 작성할 때 가장 많이 겪는 상황은 바로 JSON 데이터에서 배열 값을 map 함수를 이용해서 ul과 li 태그로 표현하는 건데요.

HTMX를 이용해서 작성해 보겠습니다.

JSONPlaceHolder 더미 API를 이용하겠습니다.

먼저, express 서버에 '/users' 라우팅을 추가해 보도록 하겠습니다.

```js
app.get('/users', async (req, res) => {
  const response = await fetch('https://jsonplaceholder.typicode.com/users')
  const users = await response.json()
  const html = `${users.map(user => `<li>${user.name}</li>`).join('')}`
  return res.send(html)
})
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEh27HiVcvlglgHrlsXkNQKLEjkKUqIwbJcDghP4r7TPD-vLWBWonQT4cPyqAwWXZfSTcjDd8Ha75wjvF_rzDBlRAlW35HM_szNzM-mouEkq_gdYkLuxjLriZegXk7eBXNUIVhT1_fHrFljZOI_FfORgJTqWNxoQ6OF9K2hOVx7ZH66m4jZr69LUfbPvbGU)

위와 같이 백엔드 API 라우팅인 '/users' API가 제대로 작동하고 있네요.

이제 HTMX를 이용해 보겠습니다.

'/users' 라우팅이 리턴하는게 li 태그의 결합이니까 ul 태그 안에 위치시키면 되겠네요.

```html
<body>
  <h1>HTMX Tutorial</h1>
  <button hx-get="/users" hx-target="#here" hx-indicator="#indicator">
    Click
  </button>
  <span class="htmx-indicator" id="indicator">Loading...</span>
  <ul id="here"></ul>
</body>
```

이제 브라우저에서 클릭 버튼을 눌러보면 아래와 같이 나올 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgroGlSGFRocP-v7df-wL8vBA0fb7MnD3sIO36BB64wo6RNsXkWVhJOO8J6konzULFfqZoNzeTB59hfA9DtNRS4jIO8BTKQLa9A7qVAzUbkl7tJET1l89nPjUSTrMRYf4aakakpGHzW2E3pBljCwm5OFAQqq5qaxvNqxBH9qlMO_MtXdbWqMJWMqowCOyQ)

위 그림처럼 li 태그가 ul 태그 안에 그대로 삽입되어 제대로 리스트가 작성되었네요.

위 코드에서 hx-swap이 없어서입니다.

hx-swap이 없으면 디폴트값으로 hx-swap='innerHTML'이 작동되기 때문에 hx-target으로 지정한 '#here' 태그 안에 위치하게 되는 거죠.

이걸 잘 기억하고 있어야 합니다.

자주 해보면 익숙해지니까 걱정 마십시요.

---

## 10. <a name='2'></a>페이지가 열리자마자 실행되는 코드 작성하기

우리가 리액트에서 가장 많이 사용하는 게 바로 페이지가 열리자마자 실행되는 즉, 리액트 컴포넌트가 마운트 되자마자 실행하는 코드를 많이 만드는데요.

HTMX에도 이런 게 있습니다.

hx-trigger 속성을 이용하면 됩니다.

hx-trigger='load' 라고 하면 페이지가 로드가 다 되면 자동으로 hx-trigger 가 작동하게 됩니다.

```html
<button
  hx-get="/users"
  hx-target="#here"
  hx-indicator="#indicator"
  hx-trigger="load"
>
  Click
</button>
```

위와 같이 바꾸고 브라우저를 새로 고치면 이제는 클릭 버튼을 누르지 않아도 AJAX 요청이 이루어지는 걸 볼 수 있을 겁니다.

---

## 11. <a name='hx-post'></a>hx-post 속성

지금까지 hx-get 속성을 이용했는데요.

당연히 hx-post 속성도 이용할 수 있습니다.

hx-post는 말 그대로 데이터를 서버로 송신하는 방법입니다.

일단 아래와 같이 form을 작성하여 UI를 꾸밉시다.

그리고 hx-post와 hx-trigger, hx-target, hx-swap 등 지금까지 배웠던 걸 다 이용하겠습니다.

```html
<body>
  <h1>HTMX</h1>
  <form
    hx-post="/users/create"
    hx-trigger="submit"
    hx-target="#users"
    hx-swap="beforeend"
  >
    <input type="text" name="name" />
    <button type="submit">Add</button>
  </form>
  <span class="htmx-indicator" id="indicator">Loading...</span>
  <h2
    hx-get="/users"
    hx-target="#users"
    hx-indicator="#indicator"
    hx-swap="innerHTML"
    hx-trigger="load"
  >
    User List
  </h2>
  <ul id="users"></ul>
</body>
```

라우팅 주소는 '/users/create'입니다.

그리고 hx-trigger 방식은 form이 submit 됐을 때 작동한다는 뜻인 'submit'입니다.

그리고 hx-target은 '#users' 위치를 그리고 hx-swap 방식은 'beforeend' 방식을 썼습니다.

공식 문서를 읽어보시라고 한게 hx-swap 값으로 여러 가지가 올 수 있기 때문에 한번 꼭 읽어 보는 게 좋습니다.

beforeend의 역할은 표시된 사용자 목록의 마지막 요소 아래에 서버에서 반환되는 데이터를 추가하라는 뜻입니다.

백엔드 코드에는 테스트를 위해 아래와 같이 가짜로 리턴값을 만들겠습니다.

```js
app.use(express.urlencoded({ extended: true }))

app.post('/users/create', (req, res) => res.send(`<li>${req.body.name}</li>`))
```

전송된 데이터를 검색할 수 있도록 `app.use(express.urlencoded({ extended: true }))`를 추가합니다.

전송된 데이터는 req.body.name에 포함됩니다.

이제 테스트해 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEhkJIFXTe61CFUJrZnljQyJmJIl-u1L9TMlmzJYe26TTBIrPeP403Yelq9ycMLHQHbCjG5bc4Y0qNthpr6WoGg0_mpLIPZWevdCjD4TWMx2y6OJUjoeOSbofrBEIOUVONreWPMQIk0cLXy7zHoqubbgtX2MYrmmJmst470tYl2ZqMVq1g32Xa_YhX-m9eA)

위와 같이 테스트를 해보면 리스트 마지막에 추가되는 걸 볼 수 있습니다.

---

지금까지 HTMX의 맛보기만 살펴보았는데요.

다음 시간에는 좀 더 깊숙한 얘기를 다뤄보도록 하겠습니다.

그럼.
