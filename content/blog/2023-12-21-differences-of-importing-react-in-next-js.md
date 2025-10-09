---
slug: 2023-12-21-differences-of-importing-react-in-next-js
title: Next.js에서 React를 import 하는 것과 안 하는 것의 차이점 알아보기
date: 2023-12-21 12:51:04.136000+00:00
summary: Next.js에서 React를 import 하는 것과 안 하는 것의 차이점 알아보기
tags: ["react", "next.js", "import"]
contributors: []
draft: false
---

안녕하세요?

오늘은 재밌는 테스트를 해 볼 건데요.

즉 다음과 같은 코드가 있다고 할 때 'TestComponent'의 타입인 FC를 'react'에서 import 해오고 있는데요.

```js
import { FC } from 'react'

export const TestComponent: FC = () => <div>Hello React!</div>
```

최근 Next.js에서는 'react' 관련 import를 하지 않아도 됩니다.

그러면 컴포넌트의 타입으로 FC를 넣을 때 'React'를 import 했을 경우, 안 했을 경우에 어떻게 되는지 궁금한데요.

그래서 Next.js를 이용해서 실제로 테스트해서 차이점을 비교해 볼까 합니다.

---

** 목 차 **

1. [테스트 환경 구축](#1-테스트-환경-구축)

2. [FC를 import 했을 경우](#2-fc를-import-했을-경우)

3. [React.FC라고 사용할 경우](#3-reactfc라고-사용할-경우)

4. [명시적으로 React를 import 할 경우](#4-명시적으로-react를-import-할-경우)

5. [세 가지 방식의 차이점은?](#5-세-가지-방식의-차이점은)

---

## 1. 테스트 환경 구축

Next.js 최신 환경을 만듭니다.

```bash
npm create next-app --typescript
Need to install the following packages:
  create-next-app@14.0.4
Ok to proceed? (y)
✔ What is your project named? … ./next-app
✔ Would you like to use TypeScript? … No / Yes
✔ Would you like to use ESLint? … No / Yes
✔ Would you like to use Tailwind CSS? … No / Yes
✔ Would you like to use `src/` directory? … No / Yes
✔ Would you like to use App Router? (recommended) … No / Yes
✔ Would you like to customize the default import alias (@/*)? … No / Yes
✔ What import alias would you like configured? … @/*
Creating a new Next.js app in /Users/cpro95/Codings/Javascript/blog/next-app.

Using npm.

Initializing project with template: app


Installing dependencies:
- react
- react-dom
- next

Installing devDependencies:
- typescript
- @types/node
- @types/react
- @types/react-dom
- eslint
- eslint-config-next


added 280 packages, and audited 281 packages in 23s

106 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
Initialized a git repository.

Success! Created next-app at /Users/cpro95/Codings/Javascript/blog/next-app
```

Next.js 버전 14의 App 라우터를 사용했고 당연히 Typescript를 넣었습니다.

그리고 빌드 결과를 보기 쉽게 하기 위해 minimize를 해제하겠습니다.

next.config.js 파일을 아래와 같이 고치면 됩니다.

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.optimization.minimize = false
    return config
  }
}

module.exports = nextConfig
```

그리고 CSS 부분은 다 지우고, page.tsx 파일을 아래와 같이 만들겠습니다.

```js
import { TestComponent } from "@/components/TestComponent";

export default function Home() {
  return (
    <div>
      <TestComponent />
    </div>
  );
}
```

마지막으로 components 폴더에 TestComponent.tsx 파일을 만들겠습니다.

```js
// src/components/TestComponent.tsx

import { FC } from 'react'

export const TestComponent: FC = () => <div>Hello React!</div>
```

---

## 2. FC를 import 했을 경우

첫 번째 테스트로 FC 타입을 'react'에서 import 했을 때 어떻게 되는지 Next.js 프로젝트를 빌드 해 보겠습니다.

```bash
npm run build

> next-app@0.1.0 build
> next build

   ▲ Next.js 14.0.4

 ⚠ Production code optimization has been disabled in your project. Read more: https://nextjs.org/docs/messages/minification-disabled
 ✓ Creating an optimized production build
 ✓ Compiled successfully
 ✓ Linting and checking validity of types
 ✓ Collecting page data
 ✓ Generating static pages (5/5)
 ✓ Collecting build traces
 ✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                    255 B           111 kB
└ ○ /_not-found                          1.36 kB         112 kB
+ First Load JS shared by all            110 kB
  ├ chunks/938-5e061ba0d46125b1.js       51.8 kB
  ├ chunks/fd9d1056-735d320b4b8745cb.js  54.9 kB
  ├ chunks/main-app-97db632d6c386fc9.js  358 B
  └ chunks/webpack-a90a69c442f95705.js   3.5 kB


○  (Static)  prerendered as static content
```

성공적으로 Build 되었네요.

그러면 '.next' 폴더로 들어가 볼까요?

폴더가 많은데요.

우리가 필요로 하는 파일은 server 폴더 밑에 있는 app 폴더 안에 있는 page.js 파일입니다.

이 파일을 열어 볼까요?

너무 긴데요.

'TestComponent'라는 이름으로 찾기를 해 보면 됩니다.

그러면 다음과 같은 부분이 나옵니다.

```js
// EXTERNAL MODULE: ./node_modules/next/dist/server/future/route-modules/app-page/vendored/rsc/react-jsx-runtime.js
var react_jsx_runtime = __webpack_require__(5036);
;// CONCATENATED MODULE: ./src/components/TestComponent.tsx

const TestComponent = ()=>/*#__PURE__*/ react_jsx_runtime.jsx("div", {
        children: "Hello React!"
    });

;// CONCATENATED MODULE: ./src/app/page.tsx


function Home() {
    return /*#__PURE__*/ react_jsx_runtime.jsx("div", {
        children: /*#__PURE__*/ react_jsx_runtime.jsx(TestComponent, {})
    });
}
```

위 코드를 보니까 react_jsx_runtime 모듈만 로드되고 'react' 라이브러리는 로드되지 않았네요.

---

## 3. React.FC라고 사용할 경우

이번에는 import 문을 사용하지 않고 직접 React.FC라고 지정해 보겠습니다.

```js
export const TestComponent: React.FC = () => <div>Hello React!</div>;
```

이렇게 저장하고 다시 Next.js를 빌드 해 보겠습니다.

테스트의 정확성을 위해 '.next' 폴더를 깔끔하게 지우고 다시 빌드하겠습니다.

```bash
rm -rf .next

npm run build

> next-app@0.1.0 build
> next build

   ▲ Next.js 14.0.4

 ⚠ Production code optimization has been disabled in your project. Read more: https://nextjs.org/docs/messages/minification-disabled
 ✓ Creating an optimized production build
 ✓ Compiled successfully
 ✓ Linting and checking validity of types
 ✓ Collecting page data
 ✓ Generating static pages (5/5)
 ✓ Collecting build traces
 ✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                    255 B           111 kB
└ ○ /_not-found                          1.36 kB         112 kB
+ First Load JS shared by all            110 kB
  ├ chunks/938-5e061ba0d46125b1.js       51.8 kB
  ├ chunks/fd9d1056-735d320b4b8745cb.js  54.9 kB
  ├ chunks/main-app-97db632d6c386fc9.js  358 B
  └ chunks/webpack-a90a69c442f95705.js   3.5 kB


○  (Static)  prerendered as static content
```

빌드 성공인데요.

다시 '.next' 폴더로 들어가서 'server/app/page.js' 파일에서 'TestComponent'를 찾아보겠습니다.

```js
// EXTERNAL MODULE: ./node_modules/next/dist/server/future/route-modules/app-page/vendored/rsc/react-jsx-runtime.js
var react_jsx_runtime = __webpack_require__(5036);
;// CONCATENATED MODULE: ./src/components/TestComponent.tsx

const TestComponent = ()=>/*#__PURE__*/ react_jsx_runtime.jsx("div", {
        children: "Hello React!"
    });

;// CONCATENATED MODULE: ./src/app/page.tsx


function Home() {
    return /*#__PURE__*/ react_jsx_runtime.jsx("div", {
        children: /*#__PURE__*/ react_jsx_runtime.jsx(TestComponent, {})
    });
}
```

첫 번째랑 비교해서 바뀐 게 하나도 없네요.

---

## 4. 명시적으로 React를 import 할 경우

이번에는 예전 방식인데요.

명시적으로 React를 import 해보겠습니다.

```js
import React from 'react';

export const TestComponent: React.FC = () => <div>Hello React!</div>;
```

다시 '.next' 폴더를 지우고 새로 build 해보겠습니다.

```bash
rm -rf .next

npm run build

> next-app@0.1.0 build
> next build

   ▲ Next.js 14.0.4

 ⚠ Production code optimization has been disabled in your project. Read more: https://nextjs.org/docs/messages/minification-disabled
 ✓ Creating an optimized production build
 ✓ Compiled successfully
 ✓ Linting and checking validity of types
 ✓ Collecting page data
 ✓ Generating static pages (5/5)
 ✓ Collecting build traces
 ✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                    255 B           111 kB
└ ○ /_not-found                          1.36 kB         112 kB
+ First Load JS shared by all            110 kB
  ├ chunks/938-5e061ba0d46125b1.js       51.8 kB
  ├ chunks/fd9d1056-735d320b4b8745cb.js  54.9 kB
  ├ chunks/main-app-97db632d6c386fc9.js  358 B
  └ chunks/webpack-a90a69c442f95705.js   3.5 kB


○  (Static)  prerendered as static content
```

빌드 성공입니다.

다시 '.next' 폴더에 들어가서 'server/app/page.js' 파일에서 'TestComponent'를 찾아보겠습니다.

```js
// EXTERNAL MODULE: ./node_modules/next/dist/server/future/route-modules/app-page/vendored/rsc/react-jsx-runtime.js
var react_jsx_runtime = __webpack_require__(5036);
// EXTERNAL MODULE: ./node_modules/next/dist/server/future/route-modules/app-page/vendored/rsc/react.js
var react = __webpack_require__(2);
;// CONCATENATED MODULE: ./src/components/TestComponent.tsx


const TestComponent = ()=>/*#__PURE__*/ react_jsx_runtime.jsx("div", {
        children: "Hello React!"
    });

;// CONCATENATED MODULE: ./src/app/page.tsx


function Home() {
    return /*#__PURE__*/ react_jsx_runtime.jsx("div", {
        children: /*#__PURE__*/ react_jsx_runtime.jsx(TestComponent, {})
    });
}
```

드디어 틀린 부분이 나오네요.

아래 코드처럼 명시적으로 react 라이브러리를 로드하네요.

```js
var react = __webpack_require__(2);
```

그렇다면 이 방식은 React를 페이지 처음에서 로드한다는 뜻인데요.

과연 그럴까요?

---

## 5. 세 가지 방식의 차이점은?

그렇다면 첫 번째, 두 번째 방식 보다 세 번째 방식인 React를 명시적으로 import 하는 게 안 좋은 방식인가 오해할 수 있는데요.

아닙니다. 이건 착각인데요.

Next.js의 구현 로직을 봐야 합니다.

우리가 마지막으로 빌드한 콘솔창을 다시 보겠습니다.

```bash
Route (app)                              Size     First Load JS
┌ ○ /                                    255 B           111 kB
└ ○ /_not-found                          1.36 kB         112 kB
+ First Load JS shared by all            110 kB
  ├ chunks/938-5e061ba0d46125b1.js       51.8 kB
  ├ chunks/fd9d1056-735d320b4b8745cb.js  54.9 kB
  ├ chunks/main-app-97db632d6c386fc9.js  358 B
  └ chunks/webpack-a90a69c442f95705.js   3.5 kB


○  (Static)  prerendered as static content
```

여기서 'First Load JS shared by all` 이란 문구가 있는데요.

즉, 'First Load JS shared by all` 문구 아래 있는 4가지 자바스크립트 코드가 공통적으로 처음에 로드된다는 뜻입니다.

두 번째 코드인 'fd9d1056-735d320b4b8745cb.js'란 이름의 자바스크립트 파일을 유심히 봐야 하는데요.

'.next' 폴더에서 'static/chunks' 폴더 밑에 있습니다.

잠깐 이 파일을 열어보면 다음과 같이 나옵니다.

```js
"use strict";
(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[971],{

/***/ 4417:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

/*
 React
 react-dom.production.min.js

 Copyright (c) Meta Platforms, Inc. and affiliates.

 This source code is licensed under the MIT license found in the
 LICENSE file in the root directory of this source tree.
 Modernizr 3.0.0pre (Custom Build) | MIT
*/
var aa=__webpack_require__(2265),ba=__webpack_require__(8261),ca={usingClientEntryPoint:!1,Events:null,Dispatcher:{current:null}};function u(a){for(var b="https://reactjs.org/docs/error-decoder.html?invariant="+a,c=1;c<arguments.length;c++)b+="&args[]="+encodeURIComponent(arguments[c]);return"Minified React error #"+a+"; visit "+b+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}
```

react-dom.production.min.js 파일이네요.

즉, Next.js는 처음 로드 시에 React 라이브러리를 로드한다는 뜻입니다.

그래서 세 번째 테스트 환경이었던 즉, 명시적으로 React 라이브러리 import 했을 경우 생기는 아래와 같은 코드는,

```js
var react = __webpack_require__(2);
```

결론적으로 아무 의미가 없어지는 거죠.

왜냐하면 Next.js가 처음 로드될 때 React가 미리 로드되었기 때문입니다.

그래서 세 가지 방식 중 아무 방식을 써도 된다는 뜻입니다.

그럼.
