---
slug: 2023-07-24-understanding-react-18-usetransition-hook-with-auto-complete
title: AutoComplete 컴포넌트와 함께 리액트 18의 useTransition 훅 알아보기
date: 2023-07-24 09:49:19.575000+00:00
summary: AutoComplete 컴포넌트와 함께 리액트 18의 useTransition 훅 알아보기
tags: ["useTransition", "AutoComplete", "react"]
contributors: []
draft: false
---

안녕하세요?

리액트가 점점 더 발전하면서 사소한 시간도 절약시켜 줄 수 있는 여러 가지 기능이 추가되고 있는데요.

그중에서 오늘은 React 18 버전에서 새롭게 추가된 useTransition 훅에 대해 알아보겠습니다.

---

## useTransition 훅은 왜 나왔을까요?

자바스크립트는 싱글 스레드로 작동되는데요.

그래서 많은 양의 데이터를 처리할 때 간혹 딜레이가 발생합니다.

왜냐하면 싱글 스레드라서 작업이 순차적으로 이루어지기 때문입니다.

예를 들어, 우리나라 전국 주소를 AutoComplete 컴포넌트를 만들어서 키보드 입력으로 검색한다고 할 때,

각각의 키 입력 때마다 fiter 를 걸어야 하는데요.

여기서 심하게 과부하가 걸립니다.

이럴 때, 리액트 18의 useTransition 훅을 사용하면 사용자의 키 입력과는 별도로 자바스크립트가 filter 하는 작업을 리액트는 좀 더 신경을 안 쓰게 됩니다.

즉, 리액트가 약간 병렬처리 비슷하게 작업해 준다는 뜻입니다.

그래서 키 입력에 딜레이가 생기지 않게 해주는 거죠.

즉, 사용자의 키 입력에는 딜레이가 없고, filter로 인해서 찾아지는 주소는 조금 늦게 화면에 뿌려지게 됩니다

그럼, 실제 코드를 이용해서 구현해 볼까요?

---

## AutoComplete 컴포넌트 구현하기

여기서 사용할 AutoComplete 컴포넌트는 제가 [myLotto](https://mylotto.pages.dev) 페이지를 만들었을 때, 전국 시, 군, 동 단위로 검색할 때 만들었던 건데요.

이 AutoComplete 컴포넌트만 Next.js 빈 템플릿에 처음부터 새로 만들어 보겠습니다.

```bash
npx create-next-app@latest use-transition-test

or

pnpm create next-app use-transition-test
```

위와 같이 Next.js 빈 템플릿을 만듭니다.

UI를 위해서 TailwindCSS를 꼭 선택해 주세요.

작업의 편의를 위해 app 라우팅은 선택하지 마시고요.

src 폴더는 선택해 주십시오.

그리고 daisyUI를 설치하겠습니다.

```bash
npm install daisyui

or

pnpm install daisyui
```

그리고 daisyui 세팅을 위해 tailwind.config.js 파일을 아래와 같이 고쳐줍니다.

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {},
  daisyui: {
    themes: false,
    theme: ['light'],
  },
  plugins: [require('daisyui')],
```

이제 src 폴더에서 불필요한 CSS를 지워줍니다.

src/styles/globals.css 파일을 열어 처음 세 줄만 남겨두고 다 지웁니다.

```js
@tailwind base;
@tailwind components;
@tailwind utilities;
```

그리고 src/pages/index.tsx 파일을 다음과 같이 고칩시다.

```js
import AutoComplete from '@/components/auto_complete'

export default function Home() {
  return (
    <main className='flex flex-col items-center justify-between gap-4 p-24'>
      <h1 className='text-4xl font-bold'>useTransition Test with React 18</h1>
      <section>
        <div className='p-12 text-2xl font-semibold'>Auto Complete</div>
        // <AutoComplete />
      </section>
    </main>
  )
}
```

이제 개발 서버를 돌려볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEgExVhz8gZE3xWt7FduxjH7l2ViU73VBlJ3TU9sOVT-7FqRKBAqPI-4Nz9PA3yA3eVO1HUgId8cV_p7klDfJ9na74bwW50UD2r4QExmjn3pNU5RAyAXoj0XeaM2MBcf9gA8HwMsatLMFXqgMfjtHDpjfjNX25mZ18e39VbPQmmx4Tr72WHQO460MYFa61s)

위와 같이 TailwindCSS도 제대로 작동하고 잘 되네요.

이제 AutoComplete 컴포넌트를 본격적으로 만들어 볼까요?

src 폴더 밑에 components 폴더를 만들고 그 밑에 auto_complete.tsx 파일을 만듭시다.

```js
import React, { useRef, useState } from "react";

function AutoComplete() {
  const [value, setValue] = useState("");
  const [countries, setCountries] = useState<string[]>([
    "서울/강남구/도곡동",
    "서울/강남구/신사동",
    "서울/강남구/압구정동",
    "서울/강남구/역삼동",
    "서울/강남구/삼성동",
    "서울/강남구/개포동",
    "서울/강남구/대치동",
    "서울/강남구/세곡동",
    "서울/강남구/일원동",
    "서울/강남구/논현동",
    "서울/강남구/수서동",
    "서울/강남구/청담동",
    "서울/강남구/자곡동",
  ]);
  const [items, setItems] = useState<string[]>([]);

  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  // 편의상 alert 함수 사용
  // 여기서 검색한 주소를 클릭했을 때 next/router를 이용해서
  // 페이지 이동하면 됩니다.
  function handleClick(value: string) {
    value = value.trim();
    if (value.startsWith("/")) value = value.slice(1);
    if (value.endsWith("/")) value = value.slice(0, -1);
    const hrefs = value.split("/");
    alert(hrefs);
  }

  return (
    <div
      className={open ? "dropdown dropdown-open w-full" : "dropdown w-full"}
      ref={ref}
    >
      <div className="flex">
        <input
          type="text"
          className="input input-bordered w-full"
          value={value}

          // 이 부분이 제일 중요!!!
          onChange={(e) => {
          setValue(e.target.value);

          const newItems = countries
            .filter((p) => p.includes(e.target.value))
            .sort();

          setItems(newItems);
          }}

          placeholder="주소 검색 ......"
          tabIndex={0}
        />
        <button
          className="btn btn-outline ml-2"
          onClick={() => handleClick(value)}
        >
          검색
        </button>
      </div>

      <div className="dropdown-content bg-base-200 top-14 max-h-96 overflow-auto flex-col rounded-md">
        <ul
          className="menu menu-compact"
          style={{ width: ref.current?.clientWidth }}
        >
          {items.map((item, index) => {
            return (
              <li
                key={index}
                tabIndex={index + 1}
                onClick={() => {
                  setValue(item);
                  setOpen(false);
                }}
              >
                <button>{item}</button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default AutoComplete;
```

UI는 DaisyUI의 DropDown을 사용했습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgRnm0TboU1MH6iW0KNWEmLvgnD5rxCcGVq4NhVmVZQM26z4ONCpKJkkMRksMwyKjCmZ7wgpS0dKizx_wpQbjl48Zy1ELTBCiC4qsO7gFjc_5cAvX5rkEck06yFv781hHDae7h6mmgcMu67iyRjqcZQceOWwa7V5YBbfN4lHzsycuB1PB1YKESnGgFVCi8)

위와 같이 검색창이 제대로 나오네요.

countries 변수를 보시면 서울시 강남구 데이터만 있는데요.

사실 전국 읍 면 동 단위 데이터는 2,318개나 되는 큰 데이터입니다.

블로그라 위 코드에는 몇 개 안 적었는데요.

제 개발 서버에는 전부 다 입력해 놓은 상태입니다.

이제 AutoComplete 컴포넌트에서 가장 중요한 코드가 바로 아래와 같이 input 태그에서 onChange 부분인데요.

```js
<input
  type='text'
  className='input input-bordered w-full'
  value={value}

  onChange={e => {
    setValue(e.target.value)

    const newItems = countries.filter(p => p.includes(e.target.value)).sort()

    setItems(newItems)
  }}

  placeholder='주소 검색 ......'
  tabIndex={0}
/>
```

사용자의 키 입력에 따라 countries 배열에 filter를 걸어서 새로운 newItems를 만들고 그걸 setItems로 저장합니다.

그래서 코드 마지막에 보이는 items.map 부분에서 그걸 화면에 뿌려주게 되는 거죠.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhT2OQhTOk3lxvDsG8pEvdw8FZ47My1fgM6Qxwi4BPn6PtBS43uH-VEy6VyKwSsB7kV0MfrbkARRXVVg9J44nnARwYXes04xz8nRA4TO0bMH3M8j3C2pATp9BxwQGS8ou8WEhG5ZOFSnWEWmtGwPUA-bf9yOSmXJxpIA7U4MGxaz-2ZZ85oFGWL0TRNPpc)

위와 같이 나옵니다.

사실 제 countries 변수의 데이터가 한글이라서 그렇지 만약 영어라면 toLowerCase 함수를 꼭 사용해 주세요.

```js
const newItems = countries
  .filter(p => p.toLowerCase().includes(e.target.value.toLowerCase()))
  .sort()
```

그럼 이렇게 완성된 AutoComplete를 크롬의 성능탭으로 테스트해 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEhLle18tzGBpy37fBZqaw-JM2r-CkdtMC1rF4XfGYK7vhC7LpCLQ5olQ_SG2QdfBvRPLhomEICJZSuDL8wADfXQCByTxzOLmYL-lx1Nm6BOayvdo9PBgU9XSV1el4tHL3sPZ5R85IoFTGGgzrxxpnFW-4d2BpVJLq9C8qvNfWHaYpM3CcP40JrpncZIbNw)

위와 같이 크롬 DEV에는 우리가 많이 쓰는 네트워크 탭 옆에 성능 탭이 있는데요.

사용방법은 왼쪽 위에 있는 녹화 단추를 누릅니다.

그러면 뭔가 프로파일링 중이라고 뜨는데요.

이때 홈페이지에서 작업을 한 다음 다시 프로파일링이라고 뜨는 작은 화면에서 중지 버튼을 누르면 됩니다.

그러면 방금 홈페이지에서 했던 작업에 대한 성능 분석 결과를 보여주는데요.

테스트를 위해 AutoComplete 검색에서 "서울" 이라고 입력했을 때 어떤 성능이 나오는지 살펴보겠습니다.

성능 탭에서 보시면 상호작용이라는 부분이 있는데요.

홈페이지에서 유저가 키 입력 작업 단위별로 성능을 분석할 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgHSnyxl9uACLpp9D432sW6MICi4mYHTzSketDv_vD9OXp9n5NVqpQqj7RQG_6kPZHa5D3oKLQgcLoJuPb2vALljVZtDlh09PqZKM29dotjRQk819To3kBWL_Kbk-b8ZMzDWtHnLRNzhiYI8GyHS2ZEUm7FsTfDRTZuA-obtEVgd4JJCQf7ozwHB513AsE)

![](https://blogger.googleusercontent.com/img/a/AVvXsEjhx60DHQ8I59WY6iZqiO2XJCdR55suPrTUaNf1LybqJM2Wf-wJCDhN_d8kYd7z_Bzv2_n4xNYPQpzl8wcZ7mLxPza67GYAizfYWs5xjJjL09sz9yzhexWWa-uE0txdaa-nH-6QKEE99h558yhWX6W7qvhxOK-Um7BPG-Ex9bDusx59eQo4AtmxLfeiDGI)

위 그림과 같이 "서" 한 글자만 입력했을 때의 상호작용 시간을 나타내 주는데요.

83.78밀리초가 걸렸네요.

그리고 "서울"이라고 다 입력했을 때의 상호작용 시간을 보겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEj1S3VBLh5E-Buny-j2Saj_-eIupNyDvOH83wJZpBBtAcdAVji1Dv9cls5RlPABLTzu3Quwfe1SUQq6nZWAlYhef0sLCE_ulEO4zCtTo0GkvdiItdbjlCOV18GzFcI2gEOzEJx01Dd9k2Ez7N-QreZH_itM1EAcWovdpk59LSZpZbfnsWxykrRWquCYqSI)

![](https://blogger.googleusercontent.com/img/a/AVvXsEhaj1CmuQVsPeTTxZdyutEi9KkotTtHnbR2q3hASuE9pc6KcbhQsfk4G7PPlAH6FrLvKPPYsAHVQufl_Xib4ZCTCWgjD-y5jyvS6nA-TFwt_onNTvMsb3tDQE5hbdEng0-sDoQtDj1PgtlCymzPnSUiBzhqV4NF63MTvxNYml2Ge-fboa70Tg8Qj2imXH4)

위 그림과 같이 87.22밀리초가 걸렸습니다.

실제 키 입력할 때부터 살짝 딜레이가 있습니다.

전국 시,도,읍,면,동 단위의 데이터가 2,318개나 있고 그걸 전부 filter 연산을 하고 있기 때문이죠.

---

## useTransition 훅을 적용해 보기

이제, useTransition 훅을 적용해 보겠습니다.

일단 아래와 같이 useTransition 훅을 불러옵니다.

```js
import { useRouter } from "next/router";
import React, { useRef, useState, useTransition } from "react";

function AutoComplete() {
  const [isPending, startTransition] = useTransition();

  const [value, setValue] = useState("");
  const [countries, setCountries] = useState<string[]>([
    "서울/강남구/도곡동",
    "서울/강남구/신사동",
    "서울/강남구/압구정동",
    "서울/강남구/역삼동",
    "서울/강남구/삼성동",
    "서울/강남구/개포동",
    "서울/강남구/대치동",
    "서울/강남구/세곡동",
    "서울/강남구/일원동",
    "서울/강남구/논현동",
    "서울/강남구/수서동",
    "서울/강남구/청담동",
    "서울/강남구/자곡동",
  ]);
  const [items, setItems] = useState<string[]>([]);

  ...
  ...
  ...
```

useTransition 훅에서 지원하는 게 isPending 변수와 startTransition 콜백 함수인데요.

isPending 변수의 사용방법은 말 그대로 useTransition 훅이 작동하고 있을 때를 나타냅니다.

적당히 UI부분을 isPending 조건에 따라 바꿔주면 되겠죠.

그러면 실제 startTransition 콜백 함수를 사용해 보겠습니다.

input 태그의 onChange 함수를 아래와 같이 바꿔주면 됩니다.

```js
<input
  type='text'
  className='input input-bordered w-full'
  value={value}
  onChange={e => {
    setValue(e.target.value)
    startTransition(() => {
      const newItems = countries.filter(p => p.includes(e.target.value)).sort()
      setItems(newItems)
    })
  }}
  placeholder='주소 검색 ......'
  tabIndex={0}
/>
```

startTransition 콜백함수에는 배열의 filter 같이 시간이 오래 걸리는 작업을 넣어두면 리액트가 작업 우선 순위에서 좀 더 느긋하게 처리합니다.

이제 성능 결과를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEi_21wcryBOd7M8fDx0nNfGviJwwZSnZ0PUPafTKvDrk0WvjswPWoK9PBrK6r5v_mi2gfsnWGrTLjT8gSeMmT9Rq-f4zr_PmMtRzAx4U3wlxeZhU4OazzSOdPC8LEAn2lRUI_iRIQJPLG_K2533FlnzQ0MnG_PE9iTKA30Zb1KiZp-Oe3_8y6IVmJ3PAmc)

![](https://blogger.googleusercontent.com/img/a/AVvXsEh5jmJatx8ptfKSpJUbMBM08TWLXEZZcQaoovuVu_mdRKCDZR4Xkybq5u5WLhhklfk0qOEe1bEHoPFLENUfinE19UbUri927hP3XH4jJLGdak6ca3AjykJtHdGWBqQI_DdKMIyHWfY7PV9k0a12sbGRF3eBNd31B6B878p7FC_hWe9ACrtZaqagFFA_tMg)

"서" 한 글자만 입력했을 때 보시면 10.76밀리초가 걸렸습니다.

아까 위에서는 83.78밀리초보다 확실히 많이 줄었네요.

"서울"이라는 글자를 다 입력했을 때는 어떨까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEhvp7ONnfXXfmD54WdYyWXrDecUGNrl301QEb-f3nbpOF9x_BDQTsI2bYsAHH9J9wS8N05Z-OX5tyKyCuNOgGpoYd4yV20pBvwTJvLMhm6YcZ_Kh3UbiCefijaCt0quxxhQ46UBQaORn6E2G7yqz3O25W4YxZ9vJinwLDSCrVKLTxEM1xr-bIMT5A4o5_A)

![](https://blogger.googleusercontent.com/img/a/AVvXsEh3oWR4sR0CfgrcWXpYTgEYQtQgAirelAIUJJm460RFg6RS8ctXeL7n8SwqGvoKnGe0Mv7Jd_IZ9gb1VXqG8BrudJmqRif2FUOjfIKNbDHpUbj7RlB1EPkqWb6CnRhoLeM3G_iaF4Evjky_gWYe27LlZQNNQ76DeDDIIvrurieCgcsY6bL0tKvMFFV328I)

역시나 위에서 보듯이 37.36밀리초가 걸렸네요.

useTranssition 훅의 startTransition 콜백 함수를 적용하지 않을 때 걸렸던 87.22밀리초보다 현격히 반응속도가 줄어들었습니다.

---

지금까지 리액트 버전 18에서 새로 나온 useTransition 훅에 대해 알아봤는데요.

클라이언트 사이드 쪽 렌더링에서 무거운 연산 부분에 useTransition 훅을 적용하면 좀 더 빠른 페이지가 될 거 같네요.

그럼, 많은 도움이 되셨으면 좋겠습니다.
