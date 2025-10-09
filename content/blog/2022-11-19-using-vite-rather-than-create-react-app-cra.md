---
slug: 2022-11-19-using-vite-rather-than-create-react-app-cra
title: Create React App 말고 Vite로 React 앱 설정하기
date: 2022-11-19 02:07:35.626000+00:00
summary: Create React App 말고 Vite로 React 앱 설정하기
tags: ["vite", "cra"]
contributors: []
draft: false
---

![](https://blogger.googleusercontent.com/img/a/AVvXsEjgvsj9tePmUpCrnRsjYD2aCd2dkFvnzqUwdPRv4kbrPrihR9L1YezfijyOkfTyIouPfbmFVB3GISX27ZOx1NAahxNQBQDxnEFl64PQ6xtOUFlaejsqx81hJONxEoJeBhb1qwBgf9FC9eL_Ct4n11AGmbmgnf04RNvnluMb-EXrzro237-SxjgQRzgt=w400-h345)


안녕하세요?

오늘은 Vue Framework 제작자인 Evan You가 만든 Vite에 대해 알아보겠습니다.

React가 처음 나왔을 때 React를 설정하는 게 힘들었는데 React팀에서 Create React App 일명 CRA 앱을 만들었습니다.

그리고 이 CRA가 React 앱 설정을 정말 너무 쉽게 해 주었는데요.

시간이 지나니까 이 CRA앱도 조금은 구식 기술을 쓰는 형태가 되었고 좀 더 좋은 게 나왔습니다.

바로 Vite인데요.

Vite는 프런트엔드 툴입니다.

CRA 대신 Vite를 사용하면 개발할 때 속도가 더 빠르고 메모리도 적게 잡아먹고 하여튼 더 좋다고 합니다.

그럼 시작해 볼까요?

<hr />
## Vite 설정

Vite 설정은 npm이나 yarn 또는 pnpm으로도 설정할 수 있습니다.

먼저, 다음과 같이 터미널에 입력하십시오.

```bash
npm create vite@latest

or 

yarn create vite

or

pnpm create vite
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEjWnDYBXMiwVPk67Qto7iqrk23BQV2YBEOoSm0kLstcD-4gN2LENgYhu12FAV2FDnq6IPjFpATWfmcrcHIkvy0ANoI1Ca7Q1pJhKg7PyYfVybjd6_AfW3G2JR2cDeqY_-0k6-Zx1Yx07WVngv8SAznXQWNxFTyuG_T2d6iT6c26VuquHJSF5RIKeawb=w400-h236)

위와 같은 화면이 나오는데요.

원하는 UI Framework을 골라주고, Javascript나 Typescript 중에 골라 주면 됩니다.

CRA 앱과 다른 점은 npm install을 해주지 않는다는 점입니다.

직접 해줘야 하는데요.

그럼, 매번 골라주지 말고 바로 실행할 수 있는 명령어를 알아보겠습니다.

```bash
# npm 6.x
npm create vite@latest my-vue-app --template vue

# npm 7+, extra double-dash is needed:
npm create vite@latest my-vue-app -- --template vue

# yarn
yarn create vite my-vue-app --template vue

# pnpm
pnpm create vite my-vue-app --template vue
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEjUong0ryL5qfA-fOuy7pwWRdmAzZBkQQtax_G4PJ_hjYTkBosgAp1R1KxK50pmbW4B0FqzrpzeMoK0iNim7dcrEcQTxotC1Ts2WkobIn3MNhyyqe__uJNOMfHheM_YzrIZ08zZZag5MROJVl5x9F4yS05wUxiFncc6TSXy1IERyxR2nIAsfQR3FCBV=w400-h174)

위 그림을 보시면 저는 npm 버전이 8.11.0 이기 때문에 '--'를 한번 꼭 더 써야 합니다.

예상대로 한 번에 실행되는 걸 볼 수 있습니다.

그리고 template에 올 수 있는 문장은 다음과 같습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhEy8_Gc_EEyl0cc-649SwZtFc-ss3-hQuiuP_Bdkb-pb2TmgI6ZAoLWzgEXXsFxjRgDC42GbFYR86TQww61Bw0Spcaut9m_eudMwvIqrvFTc2619nVtp243vFdpz5Pxz2xYYYEvdD03til_t3kMYIIiVdTrHit7tMYUOgEywN88J2K-EQg74WaGyFK=w290-h400)

```bash
vanilla, vanilla-ts,
vue, vue-ts,
react, react-ts,
preact, preact-ts,
lit, lit-ts,
svelte, svelte-ts
```

이제 만들었던 폴더로 들어가서 npm install을 실행해서 Node 모듈을 설치하고 개발서버를 돌려볼까요?

```bash
cd vite-project

npm install

npm run dev
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEhlHjCPchwTnR6E730PPamChi86yG63fL3EKDsc1L1fyj_IUz22L4OmY1gZ9yslURyqQqAPecOhsYwW7JtXRGHzdE2Do3pWLG0cLWyHiUj7luh-bk0xzQrCDIWYxWwx7YvwSmoGtulT0a6KJmj4uwE_S7rftkW95pd8PeEsU_6FSX07K1NZ_cBN7cPb=w400-h156)

Vite는 개발서버 포트가 3000번이 아닙니다.

기본으로 5173포트를 쓰는데요.

브라우저를 열어서 접속해 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEio2jhy20EQL0A7WShKxZzKXXArU0yoZjmPbUgJyttk4RD-5elbJyeUeZITR6QU2a1gIFEB0Yh6S-zJW430x3Nxnxs6LxckkHiozthZRHsslGeRnZJnZaXbLcfxJSp5oWnDTks30psJvZlUw75XGw3Wh6arKIdtaKYpt_GqnAMhg9Wy381RsxzAdVHR=w308-h400)

참고로 127.0.0.1은 localhost와 같은 의미입니다.

그래서 localhost:5173으로 접속해도 결과는 똑같습니다.

<hr />
## Vite가 왜 CRA보다 개발 서버가 빠른가?

CRA는 webpack으로 번들링 하는데요.

코드가 바뀌면 모든 자바스크립트 코드를 새로 번들링 합니다.

그래서 앱이 커질수록 HMR(Hot Module Reloading)이 느려지는데요.

Vite는 esbuild를 이용해서 변경된 부분만 새로 번들링 합니다.

물론 Vite도 첫 번째 실행해서 전체를 한 번을 번들링 하는데요.

그 이후로는 변경된 부분만 새로 번들링 합니다.

webpack은 Nodejs로 만들어졌고, esbuild는 Go로 만든 프로그램입니다.

그래서 esbuild가 훨씬 빠르죠.

그리고 CRA는 개발 서버로 express 서버를 돌립니다.

반면 Vite는 Koa라는 조그마한 서버를 돌리는데요.

여기서도 리소스 차이가 꽤 납니다.

Vite가 변경된 코드만 번들링 하는 원리는 Native ESM 모듈을 통해 import나 export 부분을 유심히 관찰하고 어떤 특정 import나 export가 코드가 변경됐다면 그 부분만 번들링 하는 방식입니다.

실제 구현 방식은 변경된 지 않은 모듈은 304 코드인 "not modified"를 리턴해서 브라우저가 그냥 무시하는 방식인 거죠.

Vite는 CommonJS나 UMD 방식을 ESM 방식으로 컨버팅 합니다.

그래서 위와 같이 ESM의 변경된 부분만 선별이 가능한 거죠.

<hr />
## Vite와 CRA의 차이점

Vite는 코드의 시작점이 아래와 같습니다.

src 폴더의 main.tsx파일인데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEj8-En-zYsr8tMgOFHk0e5JRs_Y9xaYqvt6KxTCa-84iu5xjOS_ig26lZh5xc5FshzWlcJdFz9GVQjsd8eaZyeNSPG8CQAyZyBtLCHDLxBChZNDtbYAUOWPAx2aPo1JNLMIE2MiXnMGvJaliBg0O1DYSRn7hAvBAxSna7u5U4fpMMtTBFYEVYc475KR=w400-h210)

index.html 파일을 보시면 위 그림과 같이 main.tsx 파일로 연계됩니다.

두 번째로는 절대 경로인데요.

CRA 앱에서 아래와 같이 import 했다면 

```js
import Cards from "components/cards";
```

Vite에서는 절대 경로로 import 해야 합니다.

```js
import Cards from “/src/components/cards.jsx”
```

Vite의 플러그인 중에 이걸 해결할 수 있는 플러그인이 있는데, 그냥 절대 경로로 import 하는 습관을 들이면 그게 더 좋습니다.

세 번째로는 React의 환경 변수인데요.

```bash
//예전 방식
REACT_APP_ API_KEY = 1234567890..

// Vite에서 쓰는 방식
VITE_API_KEY = 1234567890..
```

REACT_APP_ 방식이 아닌 VITE_ 방식을 써야 합니다.

이것도 vite 플러그인 중에 vite-plugin-env-compatible 패키지를 쓰면 해결할 수 있습니다.

```bash
npm install vite-plugin-env-compatible
```

vite.config.js 파일을 아래와 같이 고치면 됩니다.

```js
import envCompatible from 'vite-plugin-env-compatible';

export default defineConfig({
    ...
  envPrefix: 'REACT_APP_',

  plugins: [
    react(),
    envCompatible
  ],
});
```

위와 같이 하면 REACT_APP_ 으로 시작하는 환경변수도 Vite에서 인식할 수 있습니다.

그리고 중요한 게 바로 process.env 방식이 아니라 import.meta.env를 이용해서 환경변수에 접근해야 합니다.

```js
// 예전 CRA 방식
process.env.REACT_APP_API_KEY

// Vite 방식
import.meta.env.VITE_API_KEY
```

<hr />

지금까지 Vite에서 대해 알아보았는데요.

전체적으로 기존과 헷갈리는 게 환경변수 부분인데요.

특히 VITE_API_KEY 방식으로 환경변수를 정하는 것과

import.meta.env 방식을 이용해 환경변수에 접근하는 것만 주의하면

좀 더 빠른 React 개발 서버를 만들 수 있을 겁니다.

