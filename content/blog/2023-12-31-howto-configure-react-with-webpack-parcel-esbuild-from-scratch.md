---
slug: 2023-12-31-howto-configure-react-with-webpack-parcel-esbuild-from-scratch
title: Create-react-app이나 Vite를 이용하지 않고 Webpack, Parcel, Esbuild를 이용해서 React 개발 환경 구축하기
date: 2023-12-31 12:29:25.944000+00:00
summary: 맨 땅에 헤딩하기 - react 앱 환경 구축
tags: ["react", "webpack", "parcel", "esbuild"]
contributors: []
draft: false
---

안녕하세요?

오늘은 React 개발 환경 구축을 맨땅에 헤딩하는 방식으로 구현해 볼까 합니다.

예전에는 create-react-app이란 명령어로 React 앱을 작성했으나 최근에는 더 이상 사용되지 않는 거 같습니다.

왜냐하면 Vite를 이용한 React 개발 환경을 많이들 쓰고 있기 때문이죠.

Vite가 빠르고 깔끔하기 때문입니다.

그래도 예전에 우리가 많이 사용한 Webpack과 Parcel, esbuild를 이용한 React 개발 환경 구축이 어떤 식으로 이루어지고 있는지 살펴보는 것도 좋을 듯 싶어 소개해 볼까 합니다.

한번 읽어 보시는 것도 좋을 듯싶습니다.

---

** 목 차 **

- [1. Webpack](#1-webpack)

  - [1-1. npm init과 react 라이브러리 설치](#1-1-npm-init과-react-라이브러리-설치)

  - [1-2. Webpack 설치](#1-2-webpack-설치)

  - [1-3. Hello World 구현하기](#1-3-hello-world-구현하기)

  - [1-4. App.js 파일 만들기](#1-4-appjs-파일-만들기)

  - [1-5. Webpack 설정](#1-5-webpack-설정)

  - [1-6. webpack-dev-server 설치](#1-6-webpack-dev-server-설치)

  - [1-7. html-webpack-plugin 설치](#1-7-html-webpack-plugin-설치)

  - [1-8. npm run 스크립트 추가](#1-8-npm-run-스크립트-추가)

  - [1-9. JSX 문법을 위한 Babel 사용](#1-9-jsx-문법을-위한-babel-사용)

  - [1-10. Babel 설치](#1-10-babel-설치)

- [2. Parcel](#2-parcel)

  - [2.1 Parcel 이용하기](#21-parcel-이용하기)

  - [2-1. JSX 이용한 경우](#2-1-jsx-이용한-경우)

- [3. esbuild](#3-esbuild)

  - [3-1. 프로젝트 세팅](#3-1-프로젝트-세팅)

  - [3-2. 빌드 및 개발 서버 돌리기](#3-2-빌드-및-개발-서버-돌리기)

  - [3-3. JSX를 이용한 경우](#3-3-jsx를-이용한-경우)

  - [3-4. esbuild 설정 파일 만들기](#3-4-esbuild-설정-파일-만들기)

---

# 1. Webpack

## 1-1. npm init과 react 라이브러리 설치

맨땅에서 헤딩하기 위해 'npm init' 명령어로 시작하겠습니다.

```bash
npm init -y
Wrote to /Users/cpro95/Codings/Javascript/blog/scratch-react/package.json:

{
  "name": "scratch-react",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

이제 react 라이브러리를 아래와 같이 설치합시다.

```bash
npm install react react-dom
```

---

## 1-2. Webpack 설치

Webpack이라는 모듈 번들러를 설치합니다.

여기서 말하는 모듈은 파일에 해당합니다.

번들러는 여러 파일을 하나의 파일로 결합하는 도구입니다.

Webpack은 번들러 기능 이외에도 여러 가지 기능이 있는데 대표적으로 babel loader를 설치하면 JSX를 자바스크립트로 변환시킬 수 있습니다.

Webpack은 명령어로 작업을 수행하기 때문에 webpack-cli도 함께 설치합니다.

개발환경에 필요한 거라 '-D' 옵션을 넣고 설치합니다.

```bash
npm install --save-dev webpack webpack-cli
```

지금까지의 package.json 구성입니다.

```bash
➜  scratch-react> bat package.json
───────┬─────────────────────────
       │ File: package.json
───────┼─────────────────────────
   1   │ {
   2   │   "name": "scratch-react",
   3   │   "version": "1.0.0",
   4   │   "description": "",
   5   │   "main": "index.js",
   6   │   "scripts": {
   7   │     "test": "echo \"Error: no test specified\" && exit 1"
   8   │   },
   9   │   "keywords": [],
  10   │   "author": "",
  11   │   "license": "ISC",
  12   │   "dependencies": {
  13   │     "react": "^18.2.0",
  14   │     "react-dom": "^18.2.0"
  15   │   },
  16   │   "devDependencies": {
  17   │     "webpack": "^5.89.0",
  18   │     "webpack-cli": "^5.1.4"
  19   │   }
  20   │ }
───────┴───────────────────────────
```

---

## 1-3. Hello World 구현하기

지금까지 설치한 react, react-dom, webpack의 최소 구성만으로 React를 이용해서 브라우저에 "Hello World"를 표시해 봅시다.

보통 webpack 명령은 'npx webpack' 명령어로 실행합니다.

한번 'npx webpack' 명령어를 실행시켜 보면 'src' 폴더가 없다고 나옵니다.

이제 src 폴더를 만들고 그 밑에 index.js 파일을 만들어 볼까요?

```bash
mkdir src

cd src

touch index.js
```

```js
// src/index.js

import React from 'react'
import ReactDOM from 'react-dom/client'

const App = React.createElement('h1', null, 'Hello World')

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(App)
```

react, react-dom, webpack 만의 최소 구성이기 때문에 아직은 JSX 컴파일러가 없습니다.

그래서 React의 createElement 함수를 사용해야 합니다.

코드 내용은 간단합니다.

App 이라는 Element를 만들고 그리고 'root'라는 엘리먼트를 Root로하고 렌더링하고 있습니다.

JSX가 없다고 이건 리액트가 아니라고 할 수 있는데요, 초창기 리액트는 이랬습니다.

JSX는 나중에 다뤄보고 일단은 'npx webpack' 명령어를 실행해 볼까요?

```bash
➜  scratch-react> npx webpack
assets by status 0 bytes [cached] 1 asset

WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value.
Set 'mode' option to 'development' or 'production' to enable defaults for each environment.
You can also set it to 'none' to disable any default behavior. Learn more: https://webpack.js.org/configuration/mode/

ERROR in main
Module not found: Error: Can't resolve './src' in '/Users/cpro95/Codings/Javascript/blog/scratch-react'
resolve './src' in '/Users/cpro95/Codings/Javascript/blog/scratch-react'
  using description file: /Users/cpro95/Codings/Javascript/blog/scratch-react/package.json (relative path: .)
    Field 'browser' doesn't contain a valid alias configuration
    using description file: /Users/cpro95/Codings/Javascript/blog/scratch-react/package.json (relative path: ./src)
      no extension
➜  scratch-react npx webpack
asset main.js 137 KiB [emitted] [minimized] (name: main) 1 related asset
modules by path ./node_modules/react-dom/ 131 KiB
  ./node_modules/react-dom/client.js 619 bytes [built] [code generated]
  ./node_modules/react-dom/index.js 1.33 KiB [built] [code generated]
  ./node_modules/react-dom/cjs/react-dom.production.min.js 129 KiB [built] [code generated]
modules by path ./node_modules/react/ 6.94 KiB
  ./node_modules/react/index.js 190 bytes [built] [code generated]
  ./node_modules/react/cjs/react.production.min.js 6.75 KiB [built] [code generated]
modules by path ./node_modules/scheduler/ 4.33 KiB
  ./node_modules/scheduler/index.js 198 bytes [built] [code generated]
  ./node_modules/scheduler/cjs/scheduler.production.min.js 4.14 KiB [built] [code generated]
./src/index.js 215 bytes [built] [code generated]

WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value.
Set 'mode' option to 'development' or 'production' to enable defaults for each environment.
You can also set it to 'none' to disable any default behavior. Learn more: https://webpack.js.org/configuration/mode/

webpack 5.89.0 compiled with 1 warning in 2286 ms
```

일단은 Waring 경고는 무시하고 뭔가 성공했다고 나옵니다.

바로 아래처럼 'dist' 폴더가 생겼는데요.

한번 'dist' 폴더를 보겠습니다.

```bash
➜  scratch-react> tree --du -h ./dist
[137K]  ./dist
├── [137K]  main.js
└── [ 721]  main.js.LICENSE.txt

 137K used in 1 directory, 2 files
```

main.js 파일이 137K 크기로 있네요.

이 main.js 파일이 React 라이브러리와 우리가 아까 만든 index.js 파일을 컴파일해서 하나의 파일로 번들링 한겁니다.

당연히 react-dom 라이브러리도 함께 들어가 있죠.

이제 React를 이용한 자바스크립트 코드를 완성했으니 이걸 HTML 파일 안에 불러와야 합니다.

프로젝트 최상단 위치에 index.html 파일을 아래와 같이 만들고 이 html 파일 안에 'dist' 폴더에 우리가 만든 main.js 파일을 불러오면 됩니다.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>React App</title>
    <script defer src="./dist/main.js"></script>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
```

이제 브라우저에서 이 'index.html' 파일을 불러와 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEjbT7bhRH8o6QeD7WZrq0hSNsuwYUyPLnabggm_Kf8xqP1j9vpC2-B1AwtEBmVrNl8FWtp_mwateAPQ1LCp7SbYD6D94nSEZims9vLaEWgk9DgLj0FtcNS1j-B00IPVXqVXzwxRt8Ql3YPlB9-pAoPCjO3zvmxXx3HVuMo5bCG1LC2eprXevn-EmTAzFyc)

위와 같이 Hello World 문구가 잘 보이고, h1 태그도 잘 보이네요.

React가 정상적으로 작동하고 있습니다.

---

## 1-4. App.js 파일 만들기

지금까지 만든 코드를 리팩토링하기 위해 'Hello World' 부분을 App.js 이름으로 따로 만들겠습니다.

src 폴더 밑에 App.js라는 파일을 아래와 같이 만듭니다.

```js
// src/App.js

import React from 'react'
const App = () => {
  return React.createElement('h1', null, 'Hello World')
}

export default App
```

그리고 src 폴더에 아까 만들었던 index.js파일은 아래와 같이 바꿉니다.

```js
// src/index.js

import ReactDOM from 'react-dom/client'
import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(App())
```

이렇게 보니, 약간 요즘 쓰이는 React 코드 같은 구조가 된 거 같네요.

여기서 다시 'npx webpack' 명령어를 수행해도 같은 결과가 나올 겁니다.

React 코드가 제대로 작동되는지 보기 위해 useEffect 훅을 추가해 볼까요?

```js
// src/App.js

import React, { useEffect } from 'react'

const App = () => {
  useEffect(() => {
    console.log('test')
  })
  return React.createElement('h1', null, 'Hello World')
}

export default App
```

다시 'npx webpack' 명령어를 수행해 봅시다.

그리고 브라우저에서 index.html 파일을 불어오면 개발 콘솔창에 아래와 같은 에러가 뜹니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhKBh8AhQhOUccgbJbNST9Vcn4q1Tj9d8iNAC4k9UptUJohQHZk9C4p0LHUEViUEL2sjLuygx6nl41pE8RzAnksU5dQRw3TBBELGpRs_sZnhDG8h7rmjcJucxh76I5yTPajSmFlckTcAjOCidcOxrTloE1Feem5De1gE4_OmIBGwy7zL0KiaSOSW_MjaEE)

왜 그렇냐면 root.render 부분에서 App.js 의 App 컴포넌트로 엘리먼트로 만들어서 전달해줘야 합니다.

index.js 파일을 다음과 같이 바꿉니다.

```js
import ReactDOM from 'react-dom/client'
import React from 'react'
import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(React.createElement(App, null, null))
```

이제 다시 'npx webpack' 명령어를 실행하고 브라우저에서 index.html 파일을 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEjQMAoU9fEpG-sCGWkcRnhf7D-OQueSbfY_nFKTExC9Fs_0ZGCo-ILDRIbnqKqTJczXc-Lf2gERbFuJTwPxMwhFKfZvgqqyXYmhHAIUUUQgm14g3dJZzkLiiQiAAadt1bUovoIV0VtltjEorw5Z6NlEO9u-1o_lmqsqXB_Xc-ruE3vKyOoq3F1Pp-N4O7w)

위 그림과 같이 useEffect 훅도 정상적으로 작동합니다.

지금까지 JSX가 아니라 React의 createElement를 이용해서 최소한의 구성으로 React 앱을 만들었습니다.

---

## 1-5. Webpack 설정

Webpack은 설정 파일에 원하는 부분을 적을 수 있는데요.

프로젝트 폴더에 webpack.config.js 파일을 만들면 됩니다.

그리고 지금까지 우리가 만들었던 React+Webpack의 구조를 구성하는 설정 파일을 적어 볼까요?

```js
// webpack.config.js

const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
}
```

위 설정이 가장 기본이 되는 Webpack 설정 구성입니다.

entry는 index.js가 시점이 되는 것이며, output은 dist 폴더의 main.js가 되는 거죠.

여기서 다른 폴더 다른 이름으로 구성하고 싶으면 그렇게 하면 됩니다.

---

## 1-6. webpack-dev-server 설치

이제 개발을 좀 더 편안하게 해주는 dev-server를 설치해 볼까요?

개발 관련이라 '-D' 옵션입니다.

```bash
npm install -D webpack-dev-server
```

개발 서버를 돌리기 위해 webpack.config.js 파일을 아래와 같이 수정할 겁니다.

```js
// webpack.config.js

const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
  },
}
```

devServer 용으로 static 폴더인 public 폴더를 구성했습니다.

그래서 우리가 아까 만들었던 index.html 파일을 이 public 폴더로 이동시켜 주면 됩니다.

단 여기서 index.html 파일 안에 있던 다음 코드는 지워주시기 바랍니다.

```html
<script defer src="./dist/main.js"></script>
```

왜냐하면 html-webpack-plugin을 이용해서 자동으로 main.js 파일을 위한 script를 추가시켜 주려고 하기 때문입니다.

---

## 1-7. html-webpack-plugin 설치

html-webpack-plugin 패키지는 index.html 파일 안에 자동으로 script 태그를 추가시켜 주는 기능을 합니다.

또, production 모드로 빌드하면 자동으로 dist 폴더에 index.html 파일을 작성해 줍니다.

아주 좋은 플러그인이네요.

```bash
npm install -D html-webpack-plugin
```

설치를 했으면 webpack 설정 파일에 html-webpack-plugin 부분을 지정해줘야 합니다.

```js
// webpack.config.js

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public', 'index.html'),
    }),
  ],
}
```

---

## 1-8. npm run 스크립트 추가

npm run 명령어를 작성해야겠죠.

이게 있으면 아주 간단한 명령어로 개발 서버를 돌릴 수 있거든요.

package.json 파일에서 'scripts' 항목을 아래와 같이 만듭니다.

```json
  "scripts": {
    "start": "webpack-dev-server --mode development --open"
  },
```

이제 scripts에 start 부분을 추가했으니 'npm start'로 개발 서버를 실행해 보겠습니다.

```bash
➜  scratch-react> npm start

> scratch-react@1.0.0 start
> webpack-dev-server --mode development --open

<i> [webpack-dev-server] Project is running at:
<i> [webpack-dev-server] Loopback: http://localhost:8080/
<i> [webpack-dev-server] On Your Network (IPv4): http://192.168.29.145:8080/
<i> [webpack-dev-server] On Your Network (IPv6): http://[fe80::1]:8080/
<i> [webpack-dev-server] Content not from webpack is served from '/Users/cpro95/Codings/Javascript/blog/scratch-react/public' directory
<i> [webpack-dev-middleware] wait until bundle finished: /
asset main.js 1.38 MiB [emitted] (name: main)
asset index.html 271 bytes [emitted]
runtime modules 27.5 KiB 13 modules
modules by path ./node_modules/ 1.25 MiB
  modules by path ./node_modules/webpack-dev-server/client/ 71.8 KiB 16 modules
  modules by path ./node_modules/webpack/hot/*.js 5.3 KiB 4 modules
  modules by path ./node_modules/html-entities/lib/*.js 81.8 KiB 4 modules
  modules by path ./node_modules/react-dom/ 1000 KiB 3 modules
  modules by path ./node_modules/react/ 85.7 KiB 2 modules
  modules by path ./node_modules/scheduler/ 17.3 KiB 2 modules
  ./node_modules/ansi-html-community/index.js 4.16 KiB [built] [code generated]
  ./node_modules/events/events.js 14.5 KiB [built] [code generated]
modules by path ./src/*.js 408 bytes
  ./src/index.js 213 bytes [built] [code generated]
  ./src/App.js 195 bytes [built] [code generated]
webpack 5.89.0 compiled successfully in 1040 ms
```

아주 자동으로 webpack으로 컴파일되면서 브라우저도 오픈시켜 주네요.

콘솔창을 보시면 favicon.ico 파일이 없다고 나오는 것 외에는 아주 잘 작동합니다.

'Hello World' 부분의 텍스트를 다른 걸로 바꾸고 저장해 보시면 Hot-Reloading이 잘 작동하는 걸 볼 수 있을 겁니다.

그리고 개발서버의 HTML 구조를 보시면 head 태그 밑에 script 태그가 아주 잘 들어가 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgb3EtGjinlOZ_ptXwr8xQ0sRwSOKpdLdW2N2ockxXEALpshj8PJqf9dHj61Niikvsa28QQdhkGDcUcSbDQ4UbcZJuHTtvwJV9OA2gcrF-w3gCzRNl61N7KICWOGkZLmiIymeqe7f-cmojAXR-hmUKn64X00EvD-YAmslpWCVvQM6d3fVfK5nBeJX7iXrE)

바로 html-webpack-plugin 패키지가 알아서 삽입해주고 있는 거죠.

그리고 Production용 script도 package.json 파일에 추가해 봅시다.

```json
"scripts": {
  "start": "webpack-dev-server --mode development --open",
  "build": "webpack --mode production"
},
```

한번 실행해 볼까요?

'npm run build' 명령어를 실행시키고 dist 폴더를 보면 아래와 같을 겁니다.

```bash
➜  scratch-react> tree --du -h ./dist
[138K]  ./dist
├── [ 244]  index.html
├── [137K]  main.js
└── [ 721]  main.js.LICENSE.txt

 138K used in 1 directory, 3 files
➜  scratch-react>
```

dist 폴더에 있는 index.html 파일을 볼가요?

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>React App</title>
    <script defer="defer" src="main.js"></script>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
```

main.js 파일을 불러오는 script 태그가 보이시죠.

html-webpack-plugin 패키지가 자동으로 삽입해주고 있네요.

---

## 1-9. JSX 문법을 위한 Babel 사용

이제 React의 가장 큰 장점인 JSX 형태의 코드 작성을 위한 Babel 로더를 추가해 보겠습니다.

먼저, index.js 파일을 아래와 같이 바꿉니다.

```js
import ReactDOM from 'react-dom/client'
import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(<App />)
```

createElement 대신에 `<App />` 이라고 JSX 코드를 넣었습니다.

이렇게 하고 테스트를 위해 개발 서버를 돌려 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEjiGqTwrzbmbDn1BvDHECslvAzmcduBqf1xBPNt816yACDGikpbjG_dYHEQLJ5FH9yjCfxd7jZ6ehvEtEn5RRR8iZ8Mimg7LqUPgOyfwFrMRzgruHVL4u8qtfICraseH_MNJPWn0K4jgokzopWkfcu_Tg8PMABQvwg-nbQjfSRRPZd_33NsPms9uArLn94)

위와 같이 무시무시한 에러가 나옵니다.

예상했듯이 JSX를 자바스크립트로 변환하기 위한 로더가 필요하죠.

JSX는 HTML도 JavaScript도 아니고 React용으로 JavaScript를 확장한 것이므로 브라우저에 표시하려면 JavaScript로 변환이 필요합니다.

여기서 우리가 사용할 로더가 바로 Babel인데요.

바벨탑의 그 바벨 맞습니다.

Babel을 사용하면 JSX 태그를 이해할 뿐만 아니라 JSX를 Javascript로 변환시킬 수도 있죠.

---

## 1-10. Babel 설치

영어로는 '베이벌' 이라는 발음으로 말합니다.

근데 우리나라는 '바벨'이라는 발음으로 쓰고 있죠.

아마도 바벨탑 때문일 겁니다.

뭐 일단 Babel을 설치해 볼까요?

Babel을 설치하려면 babel-loader와 @babel/core를 설치하면 됩니다.

```bash
npm install -D babel-loader @babel/core
```

이제 JSX를 자바스크립트로 변환하기 위한 babel 플러그인을 설치해야 하는데요.

그게 바로 @babel/plugin-transform-react-jsx 패키지입니다.

그런데, @babel/plugin-syntax-jsx, @babel/plugin-transform-react-display-name 이런 것도 필요하거든요.

그래서 이 3개를 쉽게 설치해 주는 패키지가 있습니다.

바로 preset이죠.

그래서 @babel/preset-react 이란 패키지만 설치하면 @babel/plugin-transform-react-jsx, @babel/plugin-syntax-jsx, @babel/plugin-transform-react-display-name 이 3개 패키지를 모두 설치할 수 있는 겁니다.

```bash
npm install -D @babel/preset-react
```

이제 Webpack 설정 파일에 Babel 부분을 추가해 봅시다.

아래와 같이 module 부분에 Babel 부분을 넣으면 됩니다.

```js
// webpack.config.js

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public', 'index.html'),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
}
```

Babel은 rules라는 걸 관리하는데요.

test 부분은 어떤 파일을 변환시킬 것인가 하는 부분이고 나머지는 이름 그대로입니다.

loader 부분에 'babel-loader'이라고 아까 설치한 바벨 로더를 지정했네요.

그리고 babel에 대한 설정 파일인 '.babelrc' 파일을 프로젝트 최상단에 만들어야 합니다.

내용은 다음과 같이 preset-react 을 사용한다고 하는 겁니다.

```bash
{
  "presets": ["@babel/preset-react"]
}
```

이제 JSX 처리를 위한 모든 준비가 끝났습니다.

App.js 파일도 JSX 문법으로 바꿔 볼까요?

```js
// src/App.js

import React, { useEffect } from 'react'

const App = () => {
  useEffect(() => {
    console.log('test')
  })
  return <h1>Hello World!</h1>
}

export default App
```

다시 'npm start' 명령어를 실행시켜 보면 아주 잘 작동되는 걸 볼 수 있을 겁니다.

지금까지 구축한 것이 바로 Webpack, Babel 조합의 React 개발 환경 구축입니다.

React 개발 환경 구축에는 Webpack 말고 다른 번들러도 많습니다.

그것도 함께 살펴볼까요?

---

# 2. Parcel

## 2.1 Parcel 이용하기

Parcel이라는 빌드 툴이 있는데요.

Webpack + babel 과 동일한 환경을 만들 수 있습니다.

지금까지 만들었던 코드는 다 지우시고, 'npm init -y' 부터 새로 시작하겠습니다.

````bash
➜  scratch-react> rm -rf *

➜  scratch-react> npm init -y
Wrote to /Users/cpro95/Codings/Javascript/blog/scratch-react/package.json:

{
  "name": "scratch-react",
  "version": "1.0.0",
  "description": "```bash npm init -y Wrote to /Users/cpro95/Codings/Javascript/blog/scratch-react/package.json:",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
````

React와 parcel 앱을 설치하겠습니다.

```bash
npm install react react-dom

npm install -D parcel
```

여기까지의 package.json 파일입니다.

````bash
───────┬───────────────────────────
       │ File: package.json
───────┼───────────────────────────
   1   │ {
   2   │   "name": "scratch-react",
   3   │   "version": "1.0.0",
   4   │   "description": "```bash npm init -y Wrote to /Users/cpro95/Codings/Javascript/blog/scratch-react/package.
       │ json:",
   5   │   "main": "index.js",
   6   │   "scripts": {
   7   │     "test": "echo \"Error: no test specified\" && exit 1"
   8   │   },
   9   │   "keywords": [],
  10   │   "author": "",
  11   │   "license": "ISC",
  12   │   "dependencies": {
  13   │     "react": "^18.2.0",
  14   │     "react-dom": "^18.2.0"
  15   │   },
  16   │   "devDependencies": {
  17   │     "parcel": "^2.10.3"
  18   │   }
  19   │ }
───────┴─────────────────────────────
````

webpack 때와 마찬가지로 src 폴더를 만들고 그 밑에 index.html 파일과 index.js 파일을 만듭니다.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>React App</title>
    <script type="module" src="index.js" defer></script>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
```

먼더, index.js 파일에는 react의 createElement를 이용한 코드를 먼저 넣었습니다.

JSX는 나중에 추가하도록 하겠습니다.

```js
import React from 'react'

import ReactDOM from 'react-dom/client'

const App = React.createElement('h1', null, 'Hello World')

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(App)
```

이제 설정이 완료되었네요.

parcel 명령어를 실행시켜 봅시다.

```bash
npx parcel src/index.html
Server running at http://localhost:1234
✨ Built in 644ms
```

뭔가 터미널창이 빠르게 바뀌더니 위와 같이 단 2줄만 나타나네요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhcsFETVjlCiVtxMPnQ__Rw8Z85clUf1ZgCCrWQ3ZK75vl0DavkRUmm9YLT8LA97yT5TNLGgCrvH88Tmk8R6DeA9ict8Y7Kjz_LuhJS8zfghnfmmu6I3LbkcOPe9vGj1Xn0LVCousuLeHnXTUtIsKOtzgYDC2S6yBPjFfo6buJzmZoRt9xLZHwaiYGTMgw)

브라우저에는 역시나 제대로 Hello World가 표시되고 있습니다.

webpack 명령어와 마찬가지로 'dist' 폴더에 컴파일되어 번들링 된 파일이 아래와 같이 나옵니다.

```bash
tree --du -h ./dist
[3.6M]  ./dist
├── [1.6M]  index.975ef6c8.js
├── [2.0M]  index.975ef6c8.js.map
└── [ 288]  index.html

 3.6M used in 1 directory, 3 files
```

index.js 파일이름이 뭔가 hash가 포함된 거 같네요.

실제로 index.html 파일 안의 script 태그를 보시면 아래와 같이 나올 겁니다.

```html
<script src="/index.975ef6c8.js" defer=""></script>
```

parcel이 알아서 이름을 매칭시켜주고 있네요.

---

## 2-1. JSX 이용한 경우

이제 index.js 파일에서 createElement 부분을 전부 JSX 부분으로 바꾸겠습니다.

물론, App.js 파일도 따로 분리해서 만들겠습니다.

```js
// src/App.js

import { useEffect } from 'react'
const App = () => {
  useEffect(() => {
    console.log('test')
  }, [])

  return <h1>Hello World</h1>
}

export default App
```

```js
import ReactDOM from 'react-dom/client'
import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(<App />)
```

이제 다시 parcel 명령어를 실행시켜 볼까요?

```bash
px parcel src/index.html
Server running at http://localhost:1234
✨ Built in 12ms
```

아까랑 변한 게 없이 그대로인데요.

Babel 로더도 필요 없나 봅니다.

맞습니다.

Parcel은 알아서 JSX를 변환시켜 주거든요.

이제 Build 해보겠습니다.

````bash
npx parcel build ./src/index.html
🚨 Build failed.

@parcel/namer-default: Target "main" declares an output file path of "index.js" which does not
match the compiled bundle type "html".

  /Users/cpro95/Codings/Javascript/blog/scratch-react/package.json:5:11
    4 |   "description": "```bash npm init -y Wrote to /Users/cpro95/Codings/Javascript/blog/scratc
  > 5 |   "main": "index.js",
  >   |           ^^^^^^^^^^ Did you mean "index.html"?
    6 |   "scripts": {
    7 |     "test": "echo \"Error: no test specified\" && exit 1"

  💡 Try changing the file extension of "main" in package.json.
````

package.json 파일에서 main 부분을 고치라고 하네요.

"main":"index.js" 부분을 삭제하면 됩니다.

이제 다시 build 하기 전에 'dist' 폴더를 지웁시다.

```bash
rm -rf dist

npx parcel build ./src/index.html
✨ Built in 1.71s

dist/index.html               280 B    565ms
dist/index.ce397799.js    139.48 KB    571ms
```

이제 이 dist 폴더를 볼까요?

```bash
tree --du -h ./dist
[859K]  ./dist
├── [139K]  index.ce397799.js
├── [719K]  index.ce397799.js.map
└── [ 263]  index.html

 859K used in 1 directory, 3 files
```

완성된 React 프로젝트가 나오네요.

이 파일을 serve 하면 리액트 앱이 돌아갈 겁니다.

---

# 3. esbuild

esbuild는 다른 번들러, 빌드 도구와 달리 Go 언어로 작성되어 빠른 빌드를 수행할 수 있습니다.

Vite의 Pre-Bundling에서도 이용되고 있습니다.

Vite에도 이용되고 있습니다만 실은 아직 버전 1.0.0에 이르지 않고 현재도 개발이 진행되고 있는 툴입니다.

Vite에 사용되고 있다는 뜻은 그만큼 좋다는 뜻입니다.

## 3-1. 프로젝트 세팅

맨땅에 헤딩하기 위해 'npm init -y' 부터 시작하겠습니다.

```bash
npm init -y

npm install react react-dom

npm install -D esbuild
```

설치직후 package.json 파일을 보면 아래와 같을 겁니다.

```json
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "esbuild": "^0.19.11"
  }
```

다른 도구와 마찬가지로 src 폴더를 만드고 그 밑에 React.createElement를 이용한 index.js 파일을 아래와 같이 만듭시다.

```js
// src/index.js

import React from 'react'
import ReactDOM from 'react-dom/client'

const App = React.createElement('h1', null, 'Hello World')

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(App)
```

그리고 빌드된 자바스크립트 파일이 존재할 dist 폴더에 미리 index.html 파일을 아래와 같이 만듭시다.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>React App</title>
    <script type="module" src="./main.js" defer></script>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
```

main.js 파일을 읽어오는 script가 있네요.

---

## 3-2. 빌드 및 개발 서버 돌리기

esbuild는 빌드 및 개발 서버를 한꺼번에 돌릴 수 있습니다.

```bash
npx esbuild --bundle src/index.js --outfile=dist/main.js --servedir=dist

 > Local:   http://127.0.0.1:8000/
 > Network: http://192.168.29.145:8000/
```

위와 같이 하면 개발 서버가 나오는데요.

정상 작동될 겁니다.

그리고 위 명령줄을 잘 보시면 '--outfile' 옵션으로 빌드된 후 저장할 파일을 지정했고, 그리고 개발 서버를 위해 '--servedir' 옵션을 이용해서 'dist' 폴더를 웹 서빙하라고 지시했습니다.

여기서 '--watch' 옵션을 추가하면 소스코드가 변경될 걸 감지해서 새로 빌드합니다.

'--watch' 옵션은 핫 리로딩이 되지는 않네요.

```bash
npx esbuild --bundle src/index.js --outfile=dist/main.js --servedir=dist --watch
```

---

## 3-3. JSX를 이용한 경우

이제 JSX를 이용한 방식으로 코드를 다시 짜볼까요?

App.js 파일과 index.js 파일을 아래와 같이 만듭시다.

```js
// src/App.js

import { useEffect } from 'react'
const App = () => {
  useEffect(() => {
    console.log('test')
  }, [])

  return <h1>Hello World</h1>
}

export default App
```

```js
import ReactDOM from 'react-dom/client'
import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(<App />)
```

이제 빌드 및 watch를 해볼까요?

```bash
npx esbuild --bundle src/index.js --outfile=dist/main.js --servedir=dist --watch

 > Local:   http://127.0.0.1:8000/
 > Network: http://192.168.29.145:8000/

✘ [ERROR] The JSX syntax extension is not currently enabled

    src/index.js:6:12:
      6 │ root.render(<App />);
        ╵             ^

  The esbuild loader for this file is currently set to "js" but it must be set to "jsx" to be able
  to parse JSX syntax. You can use "--loader:.js=jsx" to do that.

✘ [ERROR] The JSX syntax extension is not currently enabled

    src/App.js:7:9:
      7 │   return <h1>Hello World</h1>;
        ╵          ^

  The esbuild loader for this file is currently set to "js" but it must be set to "jsx" to be able
  to parse JSX syntax. You can use "--loader:.js=jsx" to do that.

2 errors
[watch] build finished, watching for changes...
```

에러코드를 자세히 보시면 확장자가 js라서 문제가 발생한 거 같습니다.

jsx 라는 확장자로 사용하라는 문구 같네요.

아니면 '--loader:.js=jsx' 옵션을 추가하라고 합니다.

이 옵션을 추가해 볼까요?

```bash
npx esbuild --bundle src/index.js --outfile=dist/main.js --servedir=dist --watch --loader:.js=jsx

 > Local:   http://127.0.0.1:8000/
 > Network: http://192.168.29.145:8000/

[watch] build finished, watching for changes...
```

아무 에러 없이 잘 되고 있습니다.

브라우저에서 보면 화면에 아무것도 안 나타나고 콘솔창에는 아래와 같은 에러가 나오는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgZuvZgzCzUS2BVQAyBjiTVBGCmiGmuK3EeVRkkS-3D3Zkkzj2dKdZrZNY11yK6upb0rt6dDSKqh932jc8itAtCjZMm72waSY4QHEVDO2MkStZV2sdB3PaCGy90KzXsblkLzxjutdvtq5ACSldDP0J3v-fG5wGtEg7sTKD-tOfjovp29sJPtkMyuwTCv0Y)

App.js파일과 index.js 파일에 'React'를 import 하는 문구가 빠졌네요.

아래 문구를 모든 JSX 파일에 넣어 봅시다.

```js
import React from 'react'
```

이렇게 하니까 아래와 같이 브라우저에 제대로 표시됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiyEWidxJYOBXD6j-AynTjkRuxJzMKTZ7wWPrGuhNOQDddBhc-SD747_HH5YDxAaDYQj4S6nIjqS53k1z-vr-9je5oELEkFY59dy_kMjcHr_J_hWHiN17e_vtUgUrhrwmcB0FaaAOAzAluql73v0QSI3vE9OxuO0_uaFI2xPiz5mnqQ_daI5uWt8zs4gPU)

React를 import해야 하는 이유는 JSX에서 JS로 변환할 때 React.createElement를 사용하기 때문입니다.

esbuild는 기본적으로 JSX에서 JS 변환을 지원하므로 추가로 플러그인 등을 설치할 필요가 없습니다.

그런데 우리가 알고 있는 거는 최근에는 React를 import 하지 않는데요.

왜냐하면 React 17 이후부터 컴파일시 createElement와는 다른 함수를 이용하게 되었기 때문입니다.

그래서 esbuild에서도 같은 방식을 적용하려면 '--jsx=automatic' 옵션을 넣으면 됩니다.

이제 다시 'import React from react' 문구를 모두 삭제하고 다시 아래와 같이 실행해 봅시다.

```bash
npx esbuild --bundle src/index.js --outfile=dist/main.js --servedir=dist --watch --loader:.js=jsx --jsx=automatic
```

예상했던 데로 아주 잘 작동하네요.

만약에 확장자가 jsx를 사용한다면 '--loader:.js=jsx' 옵션을 지워도 됩니다.

그런데 너무 긴 옵션인데요.

그래서 설정파일이 따로 존재합니다.

---

## 3-4. esbuild 설정 파일 만들기

프로젝트 최상단에 builder.js 파일을 만듭니다.

```js
import * as esbuild from 'esbuild'

let ctx = await esbuild.context({
  entryPoints: ['src/index.js'],
  loader: {
    '.js': 'jsx',
  },
  jsx: 'automatic',
  bundle: true,
  outfile: 'dist/main.js',
})

await ctx.watch()
console.log('watching...')

const server = await ctx.serve({
  servedir: 'dist',
  host: '127.0.0.1',
})
console.log(`server is running ${server.host}:${server.port}`)
```

Nodejs를 이용해서 좀 더 쉽게 esbuild를 수행할 수 있게 해주고 있네요.

실행은 'node builder.js' 명령어로 수행하면 됩니다.

한번 해볼까요?

```bash
node builder.js
(node:45517) Warning: To load an ES module, set "type": "module" in the package.json or use the .mjs extension.
(Use `node --trace-warnings ...` to show where the warning was created)
/Users/cpro95/Codings/Javascript/blog/scratch-react/builder.js:1
import * as esbuild from 'esbuild';
^^^^^^

SyntaxError: Cannot use import statement outside a module
    at internalCompileFunction (node:internal/vm:73:18)
    at wrapSafe (node:internal/modules/cjs/loader:1178:20)
    at Module._compile (node:internal/modules/cjs/loader:1220:27)
    at Module._extensions..js (node:internal/modules/cjs/loader:1310:10)
    at Module.load (node:internal/modules/cjs/loader:1119:32)
    at Module._load (node:internal/modules/cjs/loader:960:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)
    at node:internal/main/run_main_module:23:47

Node.js v18.17.1
```

type module 에러가 떴네요.

builder.js는 import를 사용하므로 package.json 파일에 type 옵션을 추가하여 module을 설정하거나 파일 확장자를 builder.js에서 builder.mjs로 변경해야 합니다.

```json
"type": "module",
```

위와 같이 입력하고 다시 실행해 볼까요?

```bash
node builder.js
watching...
server is running 127.0.0.1:8000
```

위와 같이 아주 잘 되고 있습니다.

loader 부분도 옵션으로 넣어줘서 js 확장자도 그대로 사용할 수 있죠.

지금까지 esbuild를 이용한 React 개발 환경 구축이었습니다.
