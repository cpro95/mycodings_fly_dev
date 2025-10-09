---
slug: 2024-05-25-optimizing-react-19-using-the-new-react-compiler
title: React 19 버전의 React Compiler 사용해 보기
date: 2024-05-25 04:48:29.806000+00:00
summary: React 19 최적화 - 새로운 React 컴파일러 활용하기
tags: ["react", "react 19", "react compiler"]
contributors: []
draft: false
---

** 목 차 **

- [React 19 버전의 React Compiler 사용해 보기](#react-19-버전의-react-compiler-사용해-보기)
  - [간단한 클라이언트 컴포넌트 작성](#간단한-클라이언트-컴포넌트-작성)
  - [React Compiler 사용하는 경우](#react-compiler-사용하는-경우)
  - [빌드 후 비교](#빌드-후-비교)

---

안녕하세요?

React 19의 가장 큰 변화인 React Compiler를 직접 시현해 볼 생각입니다.

먼저, NextJs앱을 설치하겠습니다.

```sh
npx create-next-app@canary react-19-compiler-test
✔ Would you like to use TypeScript? … No / Yes
✔ Would you like to use ESLint? … No / Yes
✔ Would you like to use Tailwind CSS? … No / Yes
✔ Would you like your code inside a `src/` directory? … No / Yes
✔ Would you like to use App Router? (recommended) … No / Yes
✔ Would you like to use Turbopack for next dev? … No / Yes
✔ Would you like to customize the import alias (@/* by default)? … No / Yes
Creating a new Next.js app in /Users/cpro95/Codings/Javascript/blog/react-19-compiler-test.
```

제 M1 맥북에서는 Turbopack을 Yes로 선택하면 설치 에러가 발생하므로, Turbopack은 사용하지 않았습니다.

이제 React Compiler를 위해 Babel 플러그인을 설치해야 합니다.

```sh
npm install babel-plugin-react-compiler
```


## 간단한 클라이언트 컴포넌트 작성

이전 글인 React 19 주요 변화에서 알아보았듯이 React Compiler는 메모이제이션을 자동화해주는게 큰 목적인데요.

그래서 리렌더링이 줄어드는 걸 보여줘야 하니까 간단하게 useState를 이용한 클라이언트 컴포넌트를 만들겠습니다.

app 폴더의 page.tsx 파일은 아래와 같이 만들겠습니다.

```js
"use client";

import { ChangeEventHandler, useState } from "react";
import { NameView } from "./components/NameView";
import { AgeView } from "./components/AgeView";

export default function App() {
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);

  const handleChangeName: ChangeEventHandler<HTMLInputElement> = (e) => {
    setName(e.target.value);
  };

  const handleChangeAge: ChangeEventHandler<HTMLInputElement> = (e) => {
    setAge(Number(e.target.value));
  };

  return (
    <main className="flex flex-col py-10 justify-center items-center">
      <label>
        name{" "}
        <input
          type="text"
          value={name}
          onChange={handleChangeName}
          className="border p-2"
        />
      </label>
      <label>
        age{" "}
        <input
          type="number"
          value={age}
          onChange={handleChangeAge}
          className="border p-2"
        />
      </label>

      <hr />

      <NameView name={name} />
      <AgeView age={age} />
    </main>
  );
}
```

NameView 컴포넌트를 위해 app 폴더 밑에 components 폴더를 만들고 NameView.tsx 파일과 AgeView 파일을 아래와 같이 만듭니다.

```js
type Props = {
  name: string;
};

export const NameView = ({ name }: Props) => {
  return <section>name: {name}</section>;
};
```

```js
type Props = {
    age: number;
  };
  
  export const AgeView = ({ age }: Props) => {
    return <section>age: {age}</section>;
  };
```

이제 모든 준비가 끝났는데요.

개발 서버를 돌려 테스트를 해 볼까요?

잠깐 여기서 우리가 알아 볼게 리렌더링에 관한 겁니다

그래서 크롬 확장 툴인 "React Developer Tools"를 사용할 건데요.

아마 모두 다 크롬에 설치하셨을 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjPozosISvaWwUeGRfnArmp81XTSQjoeZV8vqR5v3BqF0B4BnWSeL3DlH7hej0FQf41zocjXD08yHIqZNszOt3N2o6IPBOUwyIr1sH3dRuEYA8FmOiTJyl4KbJ2uJK7Q9rlMxehqA76yGvG5ePeYzsyGFph6-reyaiEdltbVqVxFgSmPfFMMYVZuaPQPQw)

React Developer 툴에서 Componets를 고르면 아래와 같은 설정 아이콘이 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEi3661dessLMZgD62-0_3ISgbvfHOY7xa7b6IkpfBpuJoTsjy6itWOjMqPlqC46F3wLizr5tu1rZ_OevzxsKhYEEOEnZ0Wv79-I9alek7LQrkhbGpiAuSLfhZsB-tBTDBJw0fnIFde0PV67KayygFHH5kHHcV5KWtiXgpdJJs1eJMawjaBS5kBoVduqjmE)

클리하면 아래와 같이 나오는데 컴포넌트 렌더쪽에 하이라이트를 표시하는 부분에 체크표시하면 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgNTxhOwLGVcmBus_nYiENCT0PAC02P9rNCx02JXXYgBxWRkwFEe-Un-ktWy13IWNTg0pKN4oVACe8Z6_o6K7_J7FjgL_8xJ8LIj4nbEwLoUK-2sirhCt2yPQWpFy0NMsW4MwUGpMzVEaQY48EIRpq84ubtSVQsc3DUOMwfb6ndUyrQlYxROJPVmlMdcFo)

이제 실제 input 창에 아무 글자를 넣어주면 아래 그림과 같이 사각형 테두리가 보일겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEheJQCn_Z5HTzZOSZSS5r3GHF2Cp6jlcc00MM4OdHb8GRxar41kdgYyaIDLz1TZmB68VYUBWt8ryoUaovuwjEDVsMEI4jfJ-YfMPgKbyKAZ73goLdRAqR_1u0EvcftmzARaTT1njZUO_rbgDXShvAQlkQWeMWBNvouoR-_ApRym_AfqcUSERtCzrJyjsXc)

위와 같이 name 관련 input 태그에 글자를 입력할 때 보면 NameView 컴포넌트가 새로 렌더링되는거는 당연한데 AgeView 컴포넌트까지 새로 렌더링 되고 있습니다.

뭔가 최적화가 되지 않은 상태인데요.

React Compiler를 이용해 보겠습니다.

---

## React Compiler 사용하는 경우

React Compiler를 사용하기 위해서는 React Compiler를 활성화해야 합니다.

먼저, next.config.js 파일에 아래와 같이 설정값을 추가합시다.

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: true,
  },
};

export default nextConfig;
```

아직 experimental 성격이 강하기 때문에 프로덕션에서는 쓰지 마십시요.

이제 다시 개발 서버를 돌리면 reactCompiler가 유효하다고 터미널 창에 보일겁니다.

```sh
npm run dev

> react-19-compiler-test@0.1.0 dev
> next dev

  ▲ Next.js 14.3.0-canary.81
  - Local:        http://localhost:3000
  - Experiments (use with caution):
    · reactCompiler

 ✓ Starting...
 ✓ Ready in 1403ms
```

이제 다시 name 부분에 글자를 입력하면 아래 그림과 같이 AgeView 컴포넌트는 리렌더링이 되지 않습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhjCGEQTIzQ_YVkxv4-2Qy6dvb1l0OMp6rI37Si-khu5pQRyUeVp8yq7pbS_hgKnz12uU_Se9tjrCvcDkJPsMmxoLU_oj8NMoucj9QXWiJ5iLq1wbKd8d4h8RieQnBX7jP9JDFkLTM9chYDyexVIs7c9ogGgBd__pkAEGeQn82qDBDk-lBy_0cFBUew1wo)

그리고 React DevTools에서 컴포넌트 트리를 살펴보면 React Compiler에 의해 메모가 작동하고 있음을 알 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEh-PcP4E8JMGau5R-EecSNJ2UxEnDJfM244NR5xnC0wi05nbkiBPtmCqnFQPRBCzSwCLOd5WinB3g0Pyd4SLVDYj-_UH8IsEPew0JPHTiabFTpiTM0dqTxROXe_TE4IgBP38PTE8kjqJKxPjSThov2E_XFdzm2RahXDYzN0CpM-ZlSxOx0VzFwMBiJntJY)

뭔가, 자동으로 최적화된 느낌입니다

---

## 빌드 후 비교

빌드 후의 diff 비교를 보면 아래 그림과 같습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjoRie4PyksZOBlKjaQnFSYpP5m7KM1ZnROsduABjW0uPPQstQBBQhko6EyBC-5AhRkKA5Aj2xkWPtzW2pJwNhIU9EAhF99Ee3qpqJ-3p5RRsLCXjYel19ze0R4UPEbzzywKpwAS7eNtu5MSmJaanSmRXDiqICehO1b2Lqf0DlZOin_lR9qy-27erb1mZ4)

`handleChangeName`와 `handleChangeAge`같은 이벤트 핸들러의 근처의 코드를 발췌한 것입니다.

React Compiler가 활성화된 후에는 `Symbol.for("react.memo_cache_sentinel")`을 사용하는 로직이 포함되어 있는 것을 알 수 있습니다.

어떻게 된 것인지, 메모이제이션과 관련된 값은 캐시의 초기 값으로 일단 `Symbol.for("react.memo_cache_sentinel")`이 설정되는 것 같습니다.

다른 의존성이 없는 값의 경우, 값이 `Symbol.for("react.memo_cache_sentinel")`일 때만 캐시의 값이 리프레시되므로, 항상 캐시의 값이 사용되는 구조인 것 같습니다.

의존성이 있는 값의 경우, 의존 값과 직접 비교를 수행하는 것 같습니다.

초기 값은 `Symbol.for("react.memo_cache_sentinel")`이므로, 처음에는 반드시 캐시가 리프레시됩니다.

---

지금까지 React 19의 신기능 컴파일러에 대해 살펴보았는데요.

앞으로 조금 더 쉽게 최적화를 진행할 수 있을까 생각해봅니다.

그럼.

