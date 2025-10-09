---
slug: 2023-09-10-all-in-one-about-react-hook-form
title: React Hook Form 사용법 완결판 - 초급편
date: 2023-09-10 09:46:14.803000+00:00
summary: react-hook-form 라이브러리 사용법 완결판 - 초급편
tags: ["react-hook-form", "react"]
contributors: []
draft: false
---

안녕하세요?

오늘은 React에서 Form 핸들링으로 가장 유명한 react-hook-form에 대해 알아보겠습니다.

** 목차 **

1. [테스트 환경 구축](#1-테스트-환경-구축)
2. [React-Hook-Form의 useForm 사용하기](#2-react-hook-form의-useform-사용하기)
3. [React-Hook-Form의 Devtool 설치하기](#3-react-hook-form의-devtool-설치하기)
4. [React-Hook-Form의 onSubmit 핸들러 제어 방법](#4-react-hook-form의-onsubmit-핸들러-제어-방법)
5. [유효성 검증(Validation)](#5-유효성-검증validation)
6. [에러 메시지 표시하기](#6-에러-메시지-표시하기)
7. [커스텀 Validation 함수 만들기](#7-커스텀-validation-함수-만들기)

---

## 1. 테스트 환경 구축

저는 Vite로 Typescript와 TailwindCSS를 이용하겠습니다.

```bash
npm create vite@latest react-hook-form-test

cd react-hook-form-test

npm install

npm i react-hook-form

npm install -D tailwindcss postcss autoprefixer

npx tailwindcss init -p
```

tailwind.config.js 파일은 아래와 같이 하시면 됩니다.

```bash
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

그리고 App.css 파일은 지워버리고, index.css 파일은 다음과 같이 하시면 됩니다.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  label {
    @apply mb-2 block text-sm font-medium text-gray-900;
  }

  input {
    @apply mb-5 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500;
  }

  button {
    @apply w-full rounded-lg border px-5 py-2.5 text-center text-sm font-medium hover:border-purple-700;
  }

  p {
    @apply text-red-500;
  }
}
```

HTML에 집중하기 위해 기본 label, input, button, p 태그에 대해 tailwindcss로 미리 스타일을 지정했습니다.

이제 App.tsx를 꾸며보겠습니다.

```js
import MyForm from './components/MyForm'

export default function App() {
  return (
    <div className='flex flex-col p-4'>
      <h1 className='text-2xl font-bold text-blue-700'>
        React-Hook-Form 사용법 완결판
      </h1>
      <MyForm />
    </div>
  )
}
```

별거 없습니다.

이제 마지막으로 components 폴더에 MyForm.tsx 파일을 만들겠습니다

```js
export default function MyForm() {
  return (
    <div className='w-full p-4'>
      <form>
        <div className='w-1/3'>
          <label htmlFor='username'>Username</label>
          <input type='text' id='username' name='username' />
          <label htmlFor='email'>E-mail</label>
          <input type='email' id='email' name='email' />
          <label htmlFor='password'>Password</label>
          <input type='password' id='password' name='password' />
          <button>Submit</button>
        </div>
      </form>
    </div>
  )
}
```

"npm run dev"로 개발 서버를 돌리면 아래와 같이 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgqgzdKDZew-jw4V0jae5eYlpyO5QwXFoSSqDc7Koaci6CwkdrDBUPSVNZIz3hT0EGJJhMhX46to4W3pobAKLoHaTUZfbh5bWK0u1Fy-0jE2nYCvw2pTPYH5s85v_hRoMscaZ-XR3MYu97YcEAF4UbZUOBZAOGkTFGyYWLoHq3mXeAAXDV8o05xk_xqsYM)

테스트 환경은 마무리가 되었네요.

---

## 2. React-Hook-Form의 useForm 사용하기

react-hook-form이 폼 제어를 위해 제공하는 Hook이 바로 useForm 훅입니다.

리액트에서는 훅도 함수이기 때문에 useForm() 처럼 그냥 실행하면 됩니다.

useForm()을 실행하면 리턴 되는게 객체인데, 우리는 이걸 form이라고 부르겠습니다.

이제 이 form 객체를 디컨스트럭쳐링 해서 react-hook-form 라이브러리가 제공하는 여러 가지 유용한 기능을 사용하면 되는 겁니다.

가장 먼저, react-hook-form과 HTML의 form 요소인 input과 button 등을 연결 시켜주는 함수가 바로 register 함수입니다.

```js
import { useForm } from "react-hook-form";

export default function MyForm() {
    const form = useForm();
    const { register } = form;
    // 한 줄로 쓰려면 아래와 같이 하셔도 됩니다.
    // const { register } = useForm();
    ...
    ...
}
```

이제 register 함수를 이용해서 input이나 button 요소를 react-hook-form 라이브러리와 연결하면 되는데요.

register('username') 이렇게 함수를 실행하면 또 객체를 리턴하는데요.

이 객체가 리턴하는 항목을 input 항목과 연결시키면 됩니다.

```js
export default function MyForm() {
  const { register } = useForm();
  const { name, ref, onChange, onBlur } = register("username");

  return (
    <div className="w-full p-4">
      <form>
        <div className="w-1/3">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name={name}
            ref={ref}
            onChange={onChange}
            onBlur={onBlur}
          />
          ...
          ...
}
```

위와 같이 우리가 register로 만든 "usename" 부분을 input 태그와 연결시켰습니다.

그런데, 정말 쓸게 너무 많죠.

그래서 react-hook-form은 아래와 같은 간단한 방법을 제공해 줍니다

```js
export default function MyForm() {
  const { register } = useForm();

  return (
    <div className="w-full p-4">
      <form>
        <div className="w-1/3">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" {...register("username")} />
          ...
          ...
}
```

`{...register("username")}` 처럼 register 함수의 첫 번째 인자로 해당 input의 name을 넣는 겁니다.

즉, input 태그에 있던 name="username" 이 부분이 바로 register 함수의 첫 번째 인자가 되는 거죠.

email, password도 마저 작성해 보겠습니다.

```js
<form>
  <div className='w-1/3'>
    <label htmlFor='username'>Username</label>
    <input type='text' id='username' {...register('username')} />
    <label htmlFor='email'>E-mail</label>
    <input type='email' id='email' {...register('email')} />
    <label htmlFor='password'>Password</label>
    <input type='password' id='password' {...register('password')} />
    <button>Submit</button>
  </div>
</form>
```

어떤가요? register 함수로 정말 깔끔하게 react-hook-form을 form에 적용할 수 있게 되었습니다.

---

## 3. React-Hook-Form의 Devtool 설치하기

React-Hook-Form은 Devtool을 제공하는데요.

Form 관리를 일일이 콘솔 창에 출력하지 않고 현재 일어나고 있는 상태를 쉽게 파악할 수 있습니다.

```bash
npm i -D @hookform/devtools
```

그리고, useForm() 이 사용되는 곳에 아래와 같이 Devtool 컴포넌트를 삽입하면 됩니다.

```js
import { useForm } from 'react-hook-form'
import { DevTool } from '@hookform/devtools'

let renderCount = 0

export default function MyForm() {
  const { register, control } = useForm()

  renderCount++
  return (
    <div className='w-full p-4'>
      <h1 className='mb-5 text-2xl'> Render count : {renderCount / 2}</h1>
      <form>
        <div className='w-1/3'>
          <label htmlFor='username'>Username</label>
          <input type='text' id='username' {...register('username')} />
          <label htmlFor='email'>E-mail</label>
          <input type='email' id='email' {...register('email')} />
          <label htmlFor='password'>Password</label>
          <input type='password' id='password' {...register('password')} />
          <button>Submit</button>
        </div>
      </form>
      <DevTool control={control} />
    </div>
  )
}
```

DevTool에는 control이라고 useForm의 컨트롤을 넘겨줘야 합니다.

그래야 DevTool이 useForm을 컨트롤하게 되는 거죠.

브라우저에서 화면 맨 위에 작은 Devtool 표시를 누르면 실행되는데요.

아래 그림과 같이 우리가 register 함수로 등록한 폼의 상태에 대해 여러 가지를 알려줍니다.

그리고 위 코드에 보시면 renderCount라는 변수를 이용해서 리액트가 다시 렌더링 되는 숫자를 한번 표현해 봤습니다

![](https://blogger.googleusercontent.com/img/a/AVvXsEhkjoE3td57PaZDHUwmMkd6En8NKANcL2AOJpkd5VMnP-KIyIO-Y3LsoN9Qsgl3VUYURE4M-Y1YBXG0L5jl0bFVCVU9ptxeCYeUkVaoMI_5_Hgsy1ydiqjiHnHpX1qUa5nm6bpG9uM5M1iJuXpXS8M-FXvdsXSktjLn2U88-ITfyQT36YmTE13noVHI2sE)

위 그림과 같이 input 필드에 입력하면 Devtool에서 여러 가지 상태를 직접적으로 보여줘서 코드 짤 때 아주 많은 도움이 될 겁니다.

---

## 4. React-Hook-Form의 onSubmit 핸들러 제어 방법

이제, 실제 submit 버튼을 눌러 폼을 제출했을 때 React-Hook-Form을 이용해서 어떻게 처리하는지 알아보겠습니다.

보통 리액트에서는 form-submit 처리를 handleSubmit라는 이름의 함수를 만들어서 사용하는데요.

react-hook-form에서도 이 이름의 함수를 사용합니다.

대신 handleSubmit 함수에는 사용자가 작성한 함수를 인자로 넣어줘야 합니다.

```js
const { register, control, handleSubmit } = useForm();

const  onSubmit = (data) => {
  console.log("Form submitted.", data)
}

renderCount++;
  return (
    <div className="w-full p-4">
      <h1 className="text-2xl mb-5"> Render count : {renderCount / 2}</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
      ...
      ...
```

위와 같이 form의 onSubmit 핸들러로 handleSubmit 함수를 지정하고 다시 react-hook-form의 handleSubmit 함수에는 우리가 만든 onSubmit 함수를 지정하면 됩니다

onSubmit 함수에는 인자가 들어갈 수 있는데요.

이 인자에 우리의 data가 들어 있습니다.

한 번 테스트해 보십시오.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgcuObGWD2tCB5i5q_n1hOdHvtvgcP-VpX-uREPigOCcFww8X_AbKzfvHxlXhBuaQioD05lvkPHHyoaM4XapdOmrnqGP9YS2U4eNrNxfi1g-DqWJMysnKaj2_BsZ8HdpShGpwOuD6-fdpz7bf0bAcrpsXOJoWPgTaws0TqC73HqT_8gn526IyqXMr8C3b4)

위 그림과 같이 아주 잘 나오네요.

여기서 잠깐, 우리는 지금 Typescript를 쓰고 있는데요.

data 부분의 타입을 지정하겠습니다.

```js
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";

let renderCount = 0;

type FormValues = {
  username: string;
  email: string;
  password: string;
};

export default function MyForm() {
  const { register, control, handleSubmit } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted.", data);
  };

  renderCount++;
  return (
    ...
    ...
  )
}
```

위와 같이 FormValues라는 타입을 만들어서 useForm 함수를 실행할 때도 전달할 수 있습니다.

---

## 5. 유효성 검증(Validation)

Form의 유효성 검증으로 React-Hook-Form이 제공하는 방법은 다음과 같습니다.

```bash
required
minLength & maxLength
min & max
pattern
```

이렇게 6개를 제공하는데요.

각각 이름 그대로의 역할을 합니다. patter은 RegEx에서의 그 패턴입니다.

React-Hook-Form에서 유효성 검증(validation)을 하려면 register 함수의 두 번째 인자로 들어갈 객체 안에 넣어주면 됩니다.

```js
<form onSubmit={handleSubmit(onSubmit)} noValidate>
```

먼저, 위와 같이 form에 noValidate 옵션을 주어서 HTML 기본적으로 유효성 검증하는 기능을 끄겠습니다.

이렇게 하면 유효성 검증은 오로지 React-Hook-Form이 담당하게 됩니다.

required 유효성 검증을 시현해 보겠습니다.

```js
<input
  type='text'
  id='username'
  {...register('username', {
    required: true,
  })}
/>
```

위와 같이 register 함수 안에 넣는 인자 중 에 두 번째 인자로 객체를 넣어주고 그 안에 required 항목을 넣어주면 됩니다.

위와 같이 해도 되는데요. 그러면 아래 그림처럼 ERROR 부분이 단순히 required 이라고만 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEivXuASl2f_s7f4wKn3L9Sp9VW8arXCHAkul2nH-gxBUf2OC0YqPA3-CPawzObIry9VBHB0LlD4Vz0iiSw2giJSaLVQ6NZAzCqI9FUQFbzI2bJ-wi160DYUUfEkmdqf93k8gIsdl1NinjF18w0uhQ_10CPlnmNR8_FurdUcjYcYZrDUDYG5A_X6trFl8H0)

우리는 무엇이 문제인지 브라우저에 보여줘야 하는데요.

그래야 사용자가 뭐가 문제인지 바로 알 수 있으니까요.

아래와 같은 사용 방법을 더 선호합니다.

```js
<input
  type='text'
  id='username'
  {...register('username', {
    required: 'Username is required.',
  })}
/>
```

이렇게 되면 아래 그림과 같이 message  라는게 생기게 되는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgQlNyFdepa6Vgb9P-mQv3VbCILV_LoE3_ElOL-9ddTNlnk7dmAb1uNqo9k3u_KGZDfVjzCFsXR4aITxQ0a7ZkcuhyLuKuPErhB-kcpPj6wif7OWAv4yUMXdqawM3wQJbBT0OgKEksIP0MjCdHGzOHmpXeNFEzJuLykgVkm4S4eU82Wf83fJjWO6-8i02c)

그리고,

```js
required: 'Username is required.'
```

위 코드는 아래 코드의 축약 버전입니다.

```js
required: {
  value : true,
  message: "Username is required."
}
```

축약 버전을 쓰는 게 훨씬 단순하니까 꼭 축약버전으로 써 주십시오.

email 부분은 RegEx의 패턴을 이용해야 하는데요.

```js
<input
  type='email'
  id='email'
  {...register('email', {
    pattern: {
      value:
        /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
      message: 'Email is invalid.',
    },
  })}
/>
```

pattern은 축약 버전보다 value-message 방식으로 써야 합니다.

그리고 password는 minLength 8로 지정해 보겠습니다.

```js
<input
  type='password'
  id='password'
  {...register('password', {
    minLength: {
      value: 8,
      message: 'Password must be at least 8 characters.',
    },
  })}
/>
```

참고로, min은 입력값의 최소값, 즉 숫자를 입력할 경우 입력할 숫자의 최소값을 지정할 수 있습니다.

max는 입력값의 최대값, 즉 숫자를 입력할 경우 입력할 숫자의 최대값을 지정할 수 있습니다.

이제, 모든 유효성 검증 로직이 완성되었습니다.

테스트 결과를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEiWdLFeCGrkfL2aQYcvZi1RHczx3TW7Z1baHIinJhp1oVgab6imhADkP5sFKbXr7cSKuuaHum6ZFmkuw_ulm4ZjRYl0WVZm61aAOvb38QNq-Bye3hl3QgRFuKiS1oPxu-z6Stt8WVdmu_zOaPeuCxh1syowgeir6ho7jG1871PGlVQkMCEs4LxLVBFQjU0)

그런데, DevTool에 나타난다고 좋은 게 아닙니다.

사용자가 봐야 하는 거죠.

그럼, error 메시지를 어떻게 화면에 보여줄까요?

---

## 6. 에러 메시지 표시하기

에러 메시지를 표시하기 위해 React-Hook-Form에서 제공해 주는 게 바로 formState 객체인데요.

실제는 formState 안에 있는 errors 객체가 최종적으로 우리가 사용하는 겁니다.

```js
  const {
    register,
    control,
    handleSubmit,
    formState
  } = useForm<FormValues>();
  const { errors } = formState;
```

축약 버전으로 쓰려면 아래와 같이 하시면 됩니다.

```js
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
```

이제 form 태그에 p 태그를 덧붙혀 보겠습니다.

```js
<p>{errors.username?.message}</p>
<p>{errors.email?.message}</p>
<p>{errors.password?.message}</p>
```

위와 같은 식으로 p 태그를 만들고 각각의 input 태그 다음에 위치시켜 주면 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhsSWRidKKqvuaYM0aKWS_JdEvE-eoHoQTWqCKQPit4tEoOxFmnVVWX_QOgcWPmQhKko57Y1uSVGBz5BmFO1wUxWVhSFHAMr0b0QLAHNR3qEc7u_KOLIu9OEYbdOVH-g5q2tSuFXPGcAa7fDzr0gWpMW1JKC3KLbvN1bhPzsSvOXr9TOGZai0CkLUjSkTo)

에러 메시지도 위와 같이 정상 작동합니다.

---

## 7. 커스텀 Validation 함수 만들기

React-Hook-Form이 제공하는 유효성 검증 방법 말고 개발자가 직접 Validation을 만들 수 있는데요.

바로 register 함수에서 두 번째 인자로 전달했던 그 객체 안에 validate 항목을 추가하면 됩니다

email 부분에 커스텀 validation 로직을 구현해 보겠습니다.

"admin@fly.dev" 라는 이메일로는 가입을 하지 못하게 해 볼까요?

```js
<input
  type='email'
  id='email'
  {...register('email', {
    pattern: {
      value:
        /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
      message: 'Email is invalid.',
    },
    validate: fieldValue => {
      return fieldValue !== 'admin@fly.dev' || 'You can not use admin@fly.dev!'
    },
  })}
/>
```

validate 항목은 함수인데요. 위와 같이 OR(||) 연산자를 사용합니다.

OR 연산자는 앞에 항목이 false이면 뒤에 항목을 참조하니까요?

위 코드처럼 "admini@fly.dev"와 "다르다" 라는게 틀리면 에러 메시지를 리턴하게 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhXPKOqDZ3V7T-DjD1gzR6yHmZ43pYIpGbc43ryiKv4ZSby0icRQ0gU_88wRjkMeQ-NbVANbh2UxlUbbMN6wmZWjRpp6-VFIuoN42CIlgMvfNYQsTr2SEULIVGz4FuMdxXM-t6rniSPzW34G11yjV0CS8Kq3p6HKVtI6CtNTNNpjkGnU7_viZyqR1-TP3Q)

위와 같이 에러 메시지가 잘 나옵니다.

커스텀 Validation 함수는 여러 개 만들 수 있는데요.

다음과 같이 만들면 됩니다.

```js
<input type='email' id='email'
  {...register('email', {
    pattern: {
      value:
        /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
      message: 'Email is invalid.',
    },
    validate: {
      noAdmin: fieldValue => {
        return (
          fieldValue !== 'admin@fly.dev' || 'You can not use admin@fly.dev!'
        )
      },
      noBlackList: fieldValue => {
        return (
          !fieldValue.endsWith('daum.net') || 'This domain is not supported.'
        )
      },
    },
  })}
/>
```
위 코드에서는 noBlackList 항목으로 두 번째 커스텀 Validation을 넣었습니다.

즉, 이메일이 "daum.net"으로 끝나면 안 된다는 거죠.

실행 결과를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEgN8a5hmIZr8qy-BrHlw2psXzRsGt5d2u3U5E27rNDOTT7UoKPRNISPpxkVE0TnUFC361nK_BEur8tgwjeWEZOhJDXQriCGp15vnQx8WW2VUXjmIFTTsGcFdXGk6dTSRbumQyMMV0dVySYkJ07caWfvPu6ugNdc2s_0qkuDRdtiTujT9rKeqOL39Q9hYP0)

위와 같이 아주 잘 작동하네요.

---

지금까지 React-Hook-Form 사용법의 초급편을 살펴보았습니다.

다음 시간에는 고급편을 알아보겠습니다.

그럼.
