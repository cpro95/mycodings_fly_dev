---
slug: 2023-07-09-howto-react-server-side-rendering-with-express
title: ExpressJS로 리액트 서버 사이드 렌더링 구현해 보기
date: 2023-07-09 00:00:28.644000+00:00
summary: ExpressJS로 리액트 서버 사이드 렌더링 구현해 보기
tags: ["react", "server side rendering", "express"]
contributors: []
draft: false
---

안녕하세요?

오늘은 리액트 서버 사이드 렌더링에 대해 알아보겠습니다.

원래 리액트는 클라이언트 사이드 렌더링입니다.

빈 HTML을 받고 그다음 자바스크립트를 로드해서 최종적으로 페이지를 완성하는 형태입니다.

이런 걸 SPA(Single Page Application)이라고 합니다.

클라이언트 사이드 렌더링의 단점은 구글 같은 검색 엔진이 페이지를 들여다볼 수 없는 문제점이 있습니다.

아래 그림은 실제 리액트로 구현한 라우팅 페이지인데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgEMvfM-G0BtXwCCCG4_evg2EIr_aaBwwiM75LDZHZSEqE5Ep6gWh74WMWnR1ee6PmspeM8aeTLkuYPBK1OMl-SFfI_WHfhve_GygO9H0Tir_1AxE85jEGKcVcOyjfMaDB_DQ27uN_oycaAe4SXKFFFE3OYejEBThcx8qfblL_MohrlqOEKsoZ-HmoI_rw)


크롬에서 페이지 소스 보기를 눌렀을 경우입니다.

HTML의 BODY 태그 밑이 그냥 비어 있습니다.

그럼, 서버 사이드 렌더링을 하려면 어떻게 해야 하나요?

서버 사이드 렌더링을 하기 위해서는 서버에서 모든 걸 구현해 줘야 합니다.

우리가 ExpressJS로 API 같은 걸 만드는 것도 이런 건데요.

실제 ExpressJS로 HTML 페이지를 로드할 수 있습니다.

이걸 Template Engine이라고 하는데요.

Pug, EJS, hbs 여러 가지가 있습니다.

그러면 여기서 React를 이용해서 만든 페이지를 Express로 서버 사이드 렌더링해서 구현해 보는 게 오늘 목표입니다.

---

# Create-React-App 설치하기

그럼, 본격적인 코딩에 들어가 보겠습니다.

먼저, CRA로 빈 리액트 앱을 만들겠습니다.

```bash
npx create-react-app react-server-side-rendering

cd react-server-side-rendeing
npm install react-router-dom
```

설치가 완료되면 리액트 데모 앱이 설치되는데요.

그리고 라우팅을 위해 react-router-dom 패키지를 설치했습니다.

테스트를 위해 src 폴더의 App.js 파일을 아래와 같이 바꾸겠습니다.

```js
import React from 'react';
import './App.css';
import { Link, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>React Server Side Rendering Test</h1>
        <div style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-around",
          marginBottom: "2em"
        }}>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </div>
        <Routes>
          <Route path="/" element={<div>Home</div>}></Route>
          <Route path="/about" element={<div>About</div>}></Route>
        </Routes>
      </header>
    </div>
  );
}

export default App;

```

실행 결과를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEgapJScd93IXgQ6zw6wpvru3xrHtnJOFShDvelOMoFxiZPhJkpWYZ9LQHBMKoTsIQhWRfjHJ3k6AaLzOXt2ndwOrTMcMTM7lXYwqatxNAEbdZ35ozpbRkzPKKmdyzmhB3xRuy3nLGVnlwNk84Uy11taVxywBumMLgLMRNuDZwPuE119y88qZw2SqIrgcME)

페이지 소스 보기를 눌러볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEj2VpQw7xfvt5_l6T3aLQaiNq_F10XPI-OAcTXUmceq27ZgYwm9XcWVY-F31UFUJtSUllqtMLnjoBbf12my0ThnFF85nl0Q-5JEvFGQZ6bu4O09ZSSgeh3sHSzFs7iAZBPDDD8FBD8lBKB0Gox-9KTJCvRLYqzFkRlnQcy9Xd2z9dhcdSedyhulC3o9oBI)

역시나 빈 HTML만 보입니다.

참고로 크롬에서 오른쪽 버튼을 눌러 검사를 클릭해서 들어가 소스를 보시면 HTML의 소스 코드가 보이는 건 크롬의 React-Dev-Tools 때문입니다.

실제 구글 같은 검색엔진이 보는 페이지는 위 그림과 같이 빈 페이지를 보게 되는 거죠.

자. 이제 리액트를 이용해서 만든 HTML 페이지를 ExpressJS를 이용해서 서버 사이드 렌더링을 구현해 볼까요?

## ExpressJS 설치하기

```bash
> mkdir server

> tree . -L 1
.
├── README.md
├── build
├── node_modules
├── package-lock.json
├── package.json
├── public
├── server
└── src

6 directories, 3 files
```

위와 같이 기본 폴더 트리에서 server 폴더를 추가합시다.

이제 express 같은 패키지를 추가로 설치해야 되는데요.

```bash
npm i ignore-styles @babel/preset-env @babel/preset-react @babel/register nodemon
```

참고로 ExpressJS는 Create-React-App 설치 시 기본적으로 설치되어 있습니다.

그리고 package.json 부분에서 scripts 부분을 아래와 같이 수정합시다.

```js
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "ssr": "nodemon ./server"
  },
```

이제 npm run ssr 만 입력해서 서버를 쉽게 시작할 수 있게 되었습니다.

server 폴더에 index.js 파일 만들기

```js
require('ignore-styles')

require('@babel/register')({
    presets: ["@babel/preset-env", "@babel/preset-react"],
});

require("./server.js");
```

npm run ssr 명령어가 처음 nodejs로 실행하는 게 바로 server폴더의 index.js 파일입니다.

이 코드는 express와 React를 연결하기 위한 babel 세팅입니다.

이제 다시 server.js 파일을 만들겠습니다.


```js
//server/server.js

import express from 'express';

const app = express();

app.get("*", (req,res)=>{
    return res.send("ExpressJS running successfully")
})

app.listen(3005, () => {
    console.log("App is launched! on port 3005")
})
```

실행해 보면 아래와 같이 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEipPrOA1pHOFu7K1iwrif25S49oavA8uwL6MgSOmQ4qgd-xwyy6TR6D71yQe8uywg-3mgvP2LANLss4RJDRaZ2ZQz6ZVzmMVZdOnYLUl3d3bsU06-KRPXWFk7OXXstXNIEWsItofNjsU7H4qjLgRydC-1n8UHPxEs5j7r3P4NPR_tLA7owO4OgsOePokwk)

이제 본격적인 리액트 서버 사이드 렌더링을 구현해 보겠습니다.

먼저, 우리가 만든 React 앱을 build 해야하는데요.

```bash
➜  react-server-side-rendering git:(main) ✗ npm run build

> react-server-side-rendering@0.1.0 build
> react-scripts build

Creating an optimized production build...
Compiled successfully.

File sizes after gzip:

  55.02 kB  build/static/js/main.195f7753.js
  1.8 kB    build/static/js/787.de7f1250.chunk.js
  541 B     build/static/css/main.073c9b0a.css

The project was built assuming it is hosted at /.
You can control this with the homepage field in your package.json.

The build folder is ready to be deployed.
You may serve it with a static server:

  serve -s build

Find out more about deployment here:

  https://cra.link/deployment

➜  react-server-side-rendering git:(main) ✗ ls -l build
total 80
-rw-r--r--  1 cpro95  staff   517  7  9 09:40 asset-manifest.json
-rw-r--r--  1 cpro95  staff  3870  7  9 09:39 favicon.ico
-rw-r--r--  1 cpro95  staff   644  7  9 09:40 index.html
-rw-r--r--  1 cpro95  staff  5347  7  9 09:39 logo192.png
-rw-r--r--  1 cpro95  staff  9664  7  9 09:39 logo512.png
-rw-r--r--  1 cpro95  staff   492  7  9 09:39 manifest.json
-rw-r--r--  1 cpro95  staff    67  7  9 09:39 robots.txt
drwxr-xr-x  4 cpro95  staff   128  7  9 09:40 static
➜  react-server-side-rendering git:(main) ✗
```

리액트를 앱을 빌드한 결과 build 폴더에 index.html 파일과 기타 파일이 보이는데요.

index.html파일은 볼까요?

```
<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Web site created using create-react-app" />
    <link rel="apple-touch-icon" href="/logo192.png" />
    <link rel="manifest" href="/manifest.json" />
    <title>React App</title>
    <script defer="defer" src="/static/js/main.195f7753.js"></script>
    <link href="/static/css/main.073c9b0a.css" rel="stylesheet">
</head>

<body><noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
</body>

</html>
```

역시나 비어 있는데요.

우리가 알고 있는 `<div id="root"></div>`만 휑하게 보이네요.

역시 "/static/js/main.195f7753.js" 자바스크립트가 전체 리액트를 실행시키는 로직 같습니다.

그러면 Express로 어떻게 리액트를 서버 사이드로 렌더링할까요?

방법은 babel-preset-react로 리액트 소스 코드의 JSX를 컴파일해서 바로 index.html 파일의 `<div id="root"></div>` 부분에 덮어씌우는 방식입니다.

코드를 만들어 볼까요?

```js
import express from 'express';
import fs from 'fs';
import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server'

import App from '../src/App';

const app = express();

const getHtml = (req, res) => {
    fs.readFile(path.resolve("./build/index.html"), 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Some Error Happended!')
        }
        const html = ReactDOMServer.renderToString(
            <StaticRouter location={req.url}>
                <App />
            </StaticRouter>
        );
        return res.send(data.replace('<div id="root"></div>', `<div id="root">${html}</div>`))
    })
}

app.get("/", getHtml)

app.use(express.static(path.resolve(__dirname, "..", "build")))

app.get("/", (req,res)=>{
    return res.send("ExpressJS running successfully")
})

app.listen(3005, () => {
    console.log("App is launched! on port 3005")
})
```

여기서 중요한 게 바로 getHtml 함수인데요.

build/index.html 파일을 불러오고 거기에 ReactDOMServer의 renderToString 함수를 이용해서 전체 React 앱을 컴파일해서 강제로 `<div id="root"></div>` 부분에 덮어씌우게 됩니다.

실행 결과를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEgapJScd93IXgQ6zw6wpvru3xrHtnJOFShDvelOMoFxiZPhJkpWYZ9LQHBMKoTsIQhWRfjHJ3k6AaLzOXt2ndwOrTMcMTM7lXYwqatxNAEbdZ35ozpbRkzPKKmdyzmhB3xRuy3nLGVnlwNk84Uy11taVxywBumMLgLMRNuDZwPuE119y88qZw2SqIrgcME)

위와 같이 리액트 앱은 정상 작동합니다.

소스 코드 보기를 해볼까요?

```html
<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Web site created using create-react-app" />
    <link rel="apple-touch-icon" href="/logo192.png" />
    <link rel="manifest" href="/manifest.json" />
    <title>React App</title>
    <script defer="defer" src="/static/js/main.195f7753.js"></script>
    <link href="/static/css/main.073c9b0a.css" rel="stylesheet">
</head>

<body><noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"><div class="App"><header class="App-header"><h1>React Server Side Rendering Test</h1><div style="width:100%;display:flex;justify-content:space-around;margin-bottom:2em"><a href="/">Home</a><a href="/about">About</a></div><div>Home</div></header></div></div>
</body>

</html>
```

body 부분에 드디어 HTML 코드가 보이는데요.

서버 사이드 렌더링 성공입니다.

이제 About 링크를 클릭해서 다시 소스 보기를 해볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEisJMWAh5ynWRfFCqXAJ_X61YKzNM6JY0afmC3VrL4Ikx_n3ysBBAPGC4tNWxOBCF4ySrjND4rxB756Q_Ao6TCdkKGNAu329VDQlj8ceBPqDF7ZHwYW88uRPX22chszgspNEI1RAG0F-IJHL-1FNcHZCmeufeNydjVBfl2rZa56tfr1_4grNKxXKy0zuG4)

위와 같이 분명히 About 링크로 들어갔습니다.

소스 보기는 아래와 같이 에러가 나오는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEj-dKorlX1VXfmZUSlWFmVNPlFf4dcFao4bOKPDinFjuGEQExaMq4m1eWSD0lWS2XbzifnXs18H_vhjv7Tee05JJ4yOu3rSW8-lRR0X6UoSn5-v0yOTkijhBUmoi37sJ1V8y1wsXlu2ptAWQVZMpUGfj8yfM-Ew7_FCib5QpCP-sxSUKPfGe32iTZGjxfU)

왜 그런걸까요?

바로 react-router-dom을 이용한 라우팅을 StaticRouter로 변환했는데요.

Express에서는 모든 라우팅을 대응해 줘야 합니다.

우리 앱에서 라우팅 부분은 "/", "/about" 두 군데입니다.

그래서 아래와 같이 코드에 

```js
app.get("/", getHtml)

app.get("/about", getHtml)
```

about 라우팅 부분을 추가해서 주면 됩니다.

이제 다시 브라우저를 리프레쉬 해서 볼까요?

```html

<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Web site created using create-react-app" />
    <link rel="apple-touch-icon" href="/logo192.png" />
    <link rel="manifest" href="/manifest.json" />
    <title>React App</title>
    <script defer="defer" src="/static/js/main.195f7753.js"></script>
    <link href="/static/css/main.073c9b0a.css" rel="stylesheet">
</head>

<body><noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"><div class="App"><header class="App-header"><h1>React Server Side Rendering Test</h1><div style="width:100%;display:flex;justify-content:space-around;margin-bottom:2em"><a href="/">Home</a><a href="/about">About</a></div><div>About</div></header></div></div>
</body>

</html>
```

소스코드에서 About 페이지가 제대로 보입니다.

## React 코드 수정하기

이제 마지막으로 수정해야 할 부분은 리액트를 hydrate 해야 하는 부분인데요.

hydrate라는 문구의 뜻은 쉽게 얘기해서 React의 자바스크립트 코드를 HTML의 각각에 해당되게 붙여주는 건데요.

즉, 자바스크립트 이벤트리스너를 등록한다고 보면 됩니다.

이런 동작을 hydrate라고 합니다.

ReactDOM.render처럼 render란 HTML코드와 hydrate가 같이 일어나는 뜻이고요.

그러면 우리는 이 경우 Express에서 서버 사이드로 HTML 코드를 구현했잖아요.

그래서 실제 클라이언트 사이드 쪽에서는 ReactDOM.render 가 필요 없고 ReactDOM.hydrate 명령어만 필요합니다.

즉, HTML의 뼈대 구조를 서버 사이드 쪽에서 구현했기 때문에 hydrate를 통해 자바스크립트 이벤트리스너만 등록시키면 되는 거죠.

ReactDOM.render의 역할은 클라이언트 사이드에서 HTML의 뼈대 구조부터 새로 렌더링하고 hydrate도 같이 일어난다고 보면 됩니다.

리액트 코드를 고치려면 src 폴더의 index.js 파일을 고쳐야 합니다.

아래와 같이 나와 있는데요.

```js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

```

React 버전이 18로 올라가면서 ReactDOM.hydrate 같은 명령어가 사라졌습니다. 그래서 아래와 같이 해야 합니다.

```js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';

ReactDOM.hydrateRoot(document.getElementById('root'), <React.StrictMode><BrowserRouter><App />
</BrowserRouter></React.StrictMode>);

reportWebVitals();

```

ReactDom.hydrateRoot 명령어를 쓰면 됩니다.

이제 완성되었네요.

npm run build를 통해 다시 리액트 앱을 빌드시키고 다시 npm run ssr 명령어로 서버 사이드 렌더링을 실행시키면 오늘의 주제는 완성됩니다.

리액트 서버 사이드 렌더링이 형태가 어떤 건지 맛보기로 살펴보았는데요.

많은 도움이 됐으면 합니다.

그럼.


