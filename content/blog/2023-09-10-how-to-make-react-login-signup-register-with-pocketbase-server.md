---
slug: 2023-09-10-how-to-make-react-login-signup-register-with-pocketbase-server
title: PocketBase 활용법 2탄. 리액트(React) 앱 만들기 - 유저 로그인, 가입
date: 2023-09-10 02:48:04.660000+00:00
summary: PocketBase 활용법 2탄. 리액트(React) 앱 만들기 - 유저 로그인, 가입
tags: ["pocketbase", "react", "login", "logout", "signup", "register"]
contributors: []
draft: false
---

안녕하세요?

오늘은 PocketBase 활용법 2탄입니다.

지난 시간 강좌 링크입니다.

[PocketBase 활용법 1탄. 나만의 pocketbase 서버 만들기 in Fly.io](https://mycodings.fly.dev/blog/2023-09-09-build-my-own-pocketbase-server-on-flyio)

---

** 목차 **

1. [리액트 앱 설치](#1-리액트-앱-설치)
2. [PocketBase 인스턴스 만들기](#2-pocketbase-인스턴스-만들기)
3. [Login 컴포넌트 만들기](#3-login-컴포넌트-만들기)
4. [pocketbase의 유저 로그인 로직](#4-pocketbase의-유저-로그인-로직)
5. [로그아웃 구현하기](#5-로그아웃-구현하기)
6. [유저 가입하기 로직 만들기](#6-유저-가입하기-로직-만들기)
---

## 1. 리액트 앱 설치

지난 시간에 만든 Fly.io의 Pocketbase 서버를 활용해서 풀 스택 앱의 가장 기본이 되는 유저 로그인과 유저 가입하기 로직을 리액트로 작성해 보겠습니다.

먼저, 지난 시간에 SPA로 만들었고, PocketBase 서버의 pb_public 폴더로 올렸던 그 앱을 수정해서 React 앱을 만들어 보겠습니다.

먼저, SPA(Single Page Application)에서 사용할 react-router-dom 패키지를 설치하겠습니다.

당연히 TailwindCSS 도 설치하겠습니다.

Form 관련 작업을 엄청 쉽게 해주는 react-hook-form도 설치하겠습니다.

그리고 가장 중요한 PocketBase의 Javascript SDK인 pocketbase 패키지도 설치하겠습니다.

```bash
npm i react-router-dom react-hook-form pocketbase

npm i -D tailwindcss

npx tailwindcss init
```

TailwindCSS 세팅을 위해 index.css 파일을 아래와 같이 하시면 됩니다.

```js
@tailwind base;
@tailwind components;
@tailwind utilities;
```

react-router-dom을 사용하기 위해서 index.js 파일을 아래와 같이 수정합시다.

가장 기본이 되는 BrowserRouter 를 사용할 겁니다.

```js
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
```

이제 본격적인 App.js 파일을 수정해 볼까요?

```js
import Layout from './components/Layout'
import Home from './components/Home'
import Login from './Auth/Login'
import Register from './Auth/Register'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
```

App.js에는 SPA 앱의 특성상 라우팅만 지정했습니다.

react-router-dom 앱이 Remix Framework의 근간이라서 그런지 Remix의 Layout 페이지나 Outlet 등 친숙한 것이 있네요.

오래간만에 SPA을 작성하는 거 같네요.

Layout을 Route로 전체를 감싸면 이게 전체 페이지에 기본적으로 들어가게 됩니다.

그리고, Rotue index 방식으로 Home 컴포넌트를 지정했습니다.

그러면, "/" 라우팅이 이 Home 컴포넌트가 되는 거죠.

그리고 login, register 라우팅에 대해서도 각각 Logini, Register 컴포넌트를 지정했습니다.

먼저, src/components/Layout.js 파일입니다.

```js
import React from 'react'
import Header from './Header'
import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div className='mx-auto w-full p-8'>
      <Header />
      <h1 className='text-4xl font-bold'>PocketBase</h1>
      <Outlet />
    </div>
  )
}

export default Layout
```

src/components/Header.js 파일입니다.

```js
import React from 'react'
import { Link } from 'react-router-dom'

function Header() {
  return (
    <nav className='mb-4 flex items-start border-b-2 pb-2'>
      <ul className='flex space-x-4 '>
        <li>
          <Link to='/'>Home</Link>
        </li>
        <li>
          <Link to='/login'>Login</Link>
        </li>
        <li>
          <Link to='/register'>Register</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Header
```

src/components/Home.js 파일입니다.

```js
import React from 'react'

function Home() {
  return (
    <div className='flex w-full p-4'>
      <h1>Welcome to PocketBase Tutorial!</h1>
    </div>
  )
}

export default Home
```

이제 실행결과를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEgNWF94OFcHyYN1O4htytqXM_MV1l_PAY7OQqtMCKsatSJiV_HH8WHFFdKTuqh1eTVZo87CUd9ljisKwsWARIEzz1wsgQ4iQ6u7bWTNcZrcsg9bXbHm8igQ4tX20nMTiyz0ZJz4LehIhMApRd8KoDVwCdHhTdpxeyCFb17sfP4LPpLpxuPYzKtCE425dI4)

전체적인 SPA앱으로 있을 건 다 있네요.

---

## 2. PocketBase 인스턴스 만들기

src/lib/pocketbase.js 파일을 만들어서 PocketBase 인스턴스를 생성하겠습니다.

```js
import Pocketbase from 'pocketbase';

export const pb = new Pocketbase('https://mypocketbase.fly.dev');
```

여기 보시면 PocketBase의 인스턴스를 생성하는데요.

우리가 로컬 서버에서 PocketBase 테스트 용도로 실행하면 주소가 다음과 같습니다.

'http://127.0.0.1:8090'입니다.

그런데, 저는 mypocketbase.fly.dev에 PocketBase를 프로덕션 빌드로 설치했기 때문에  포트 8090이 필요가 없는 겁니다.

이제, PocketBase를 리액트 앱에서 사용할 수 있는 준비가 끝났습니다.

---

## 3. Login 컴포넌트 만들기

이제 Login 컴포넌트를 만들어야죠.

src/Auth/Login.js 파일을 만들도록 하겠습니다.

```js
import { useState } from "react";
import { pb } from "../lib/pocketbase";
import { useForm } from "react-hook-form";

function Login(props) {
  const { register, handleSubmit } = useForm();
  const [isLoading, setLoading] = useState(false);
  const [dummy, setDummy] = useState(0);

  const isLoggedIn = pb.authStore.isValid;

  async function login(data) {
    console.log(data);
    setLoading(true);
    try {
      const authData = await pb
        .collection("users")
        .authWithPassword(data.email, data.password);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  }

  function logout() {
    pb.authStore.clear();
    setDummy(Math.random());
  }

  return (
    <div className="flex flex-col items-center justify-center mx-auto w-full">
      <h1 className="text-2xl mb-4">Login</h1>
      <p className="py-4">
        {isLoggedIn
          ? `You are : ${pb.authStore.model.email}`
          : "You are not logged in!"}
      </p>
      {isLoggedIn && (
        <button
          className="border rounded-md bg-gray-400 py-1 px-4"
          onClick={logout}
        >
          Logout
        </button>
      )}

      {!isLoggedIn && (
        <form className="flex flex-col w-full justify-center items-center space-y-4" onSubmit={handleSubmit(login)}>
          <input
            className="border rounded-md p-1"
            type="text"
            placeholder="input email"
            {...register("email")}
          />
          <input
            className="border rounded-md p-1"
            type="password"
            placeholder="input password"
            {...register("password")}
          />
          <button
            className="border rounded-md bg-gray-400 py-1 px-4"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Loading" : "Login"}
          </button>
        </form>
      )}
    </div>
  );
}

export default Login;
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEidgX4NOHI3u_CiK3GrOfsHfGv_m-e1SBcM8lOySnKaVCBxFPW9MM5AtYyOm8h1wI6uiMwxNez9q1Hr1UIvloWWbnfguROjEU4V-r0vkQ6KIY299fOSqXQ-KsZUriHiayTkxuE1nei1k18BePpD9OKK7i98tYCoxvazQ7I4Z65tCWbRXD5697aXdphzhss)

전체적인 화면은 위와 같이 나옵니다.

이제 코드를 하나하나 살펴볼까요?

pb 객체가 PocketBase 객체인데요.

인증 관련된 부분은 pb.authStore 라는 객체에 저장이 됩니다.

pb.authStore에는 isValid 메서드, token, model 객체 등이 있습니다.

일단 authStore를 설명하기 위해 로그인 해 볼까요?

'https://mypocketbase.fly.dev/_/' 여기로 들어가서 users 컬렉션에  아이디를 새로 생성해 보겠습니다.

PocketBase는 유저라는 기본 컬렉션을 제공합니다.

그래서 우리가 따로 Users라는 스키마를 만들 필요가 없죠.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjaKEXVJqPoRgDwm7nDaRLFqqgjtu_D_vw3_y3ZM-gK3wsjIK6n8SeawjyeWeglMxqd3QcgR730r9_iYMAb-hL4-ILv-gpW5XQztNpjLo4Urqxc27BaeZhdeqw0L0ZdhdJRexTbwSUig77nI41dgjSo_l9FO8SX8vYiL2GiJE0mrC1skYdwKxl1ndlNkoQ)

위 그림과 같이 New record를 눌러 users 객체를 하나 만들겠습니다.

필수 입력 부분은 email과 password입니다.

나머지는 넣어도 되고 안 넣으면 작동으로 채워집니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhlrnC5EbHEccUaUbwVIPFC7dFaRs4m7QlP7990I1GbfRdZE48mFqDnZ5cUKeNCSDkC_Rd8ZxIRWHx59aLfGYO-sPpFgOJKMBO6L00o4ZjL0mAdxrzuPGcnxmSCgJiJqCgJeSJmAoL5Gc-UuaJFqnmxQaKI2qPEIR5r10RIkSrfuXHTi3-quyvNoiAwbNg)

기본적으로 password는 8글자 이상인데요.

이것도 세팅에서 수정할 수 있습니다.

users 섹션에서 톱니바퀴를 클릭하면 화면이 나오는데요.

여기서 Options 탭 부분을 누르면 밑에 Minimum password length 부분이 보입니다.

여기를 5로 바꾸면 됩니다.

5 밑으로는 수정이 안 되네요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhKXVzxpcGvz-OCLPH8h8wREGRfV8D40W6SAvH-jiL2vkTRHt1ka67fACzaqo_TbkDrhqnQDyxaLLo5lxcqhHwpykGkNxYMB45mBp_GPR2DkCs3HA67AwGT-1sT4ZImNpn_I_LJSEnmJfrRlgTBeMxGSxUwA2oOXYM5LB1aXF8IW3UMVyLTJlVQTp2FnBo)

이제 유저를 만들었는데요.

PocketBase의 유저 가입 시스템은 가입한 후 Verify라는 형식을 통해 이메일을 통해 인증을 해야 하는데요.

이메일 서버는 나중에 연결해야 하니까요, 일단은 강제 verified 버튼을 눌러 유저 가입 승인 작업을 하겠습니다.

users 컬렉션에 보면 아까 'test@test.com' 으로 가입한 데이터가 보이는데요.

아래 그림과 같이 Unverified 라고 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhrds-zsFUf0Opkt9O_d2rnVnTF1-WGhrDyPS_gK9wH59ktkOYGPgaUCLC_V4fYnVuaf-jFkId8wtOBPSLpFjLQZCW2Nsqcy5SQiDvf6vqUCk4MdfGibckSlW3pkIL6Y-VbJHltBt6ua3geR3k3q-ET_EPhFxXNb3XEVTD95Y4HsG7gUwSYBcjfLIahnY8)

이걸 눌러 강제로 verified라고 변경합시다.

아래 그림과 같이 Edit users 항목이 보이는데요. Verified 부분을 토글 하면 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhEExxBVXruoUnu9PFTCpam8W0iKdzOm6obM61hKQhbFVl88WWwJYqltfKhZz-uNS3GJcIzN-8tIt0lvewaNsZ14F4MZ-hPCZEHlaCn029LOOJa0ZpAaDBHnNlw0NS2OJ3uCjFQBz2ybrr1dHL16kcJyPndNDt7RsxKPPjlOx_uchwg8amWrXSBhJbay7c)

![](https://blogger.googleusercontent.com/img/a/AVvXsEj63Ffhlf8tHrmnXDqh8jF3lGQPEfMHOzI7vfwTLOZIoAOiEMXSsMgTQ1XFNgID1aITLNQSIXxKRvSg2R7PpQgwu3GGKTekT85W9h4uS8mBB5FEkC_ZvzL_0CXnHEP0iPAadtvxNSkQsZBaSqc8cE-41jo-WkKFcHkeTuSPYkOwyxiWGXeQP96Md4Fr1Ys)

![](https://blogger.googleusercontent.com/img/a/AVvXsEjIIW5J5GxOdz1q7a_RWbNIrLTNy90vxJBQCIiUCDCGGgefVeSxbfYsF58IVA61Tgy0DPP9cZLG8JCjrkPpGVWbGMhDtpZLx6BmJsgLiGaD0n2duBcttajd7GKrt2ybvlYB0zckNDZd4xH7ZNKsAP6W_58lKXddI7t1CXQA0WyT8gVhtGQ7-cop2l8LvFs)

사실 verified라고 변경 안 해도 로그인은 됩니다.

그냥 Verified 작업에 대해 설명하기 위해서 위에 보여드린 겁니다.

이제, 리액트 앱을 테스트하기 위한 작업은 마쳤습니다.

이제 로그인 작업을 해볼까요?

콘솔창을 보겠습니다.

제가 로그인 후에 pb.authStore를 console.log 시켰거든요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEj661pHL9cAO95_eKWxHmquI2xhSQN1X9ty_AMd0X5RSGwNQtpOw9mJFtnFclRbk3FOFa-wey8bk7TfE_iopuo4wxjWgRNvT5tXcyW4-PLZsCidb03opaTgXqTVvWOiKlhlNrQeFl1OIiISDSwp9ibkEQdlz6ThJDSxkY6n-X5bVzqPDfYO6K2nNovpFUg)

위 그림과 같이 로그인은 정상 작동합니다.

그리고 콘솔차에 보이는 게 form을 통해 전달됐던 email과 password입니다.

그리고 authStore 객체인데요.

이 authStore 객체에는 우리가 활용할 여러 가지가 있습니다.

isValid, isAdmin 메서드 등이 있고, model이라고 로그인된 유저 정보가 있습니다.

그리고 token도 있습니다.

이 token이 바로 유저 로그인 된 후의 토큰 정보인 거죠.

---

## 4. pocketbase의 유저 로그인 로직

PocketBase는 대시보드에 API 정보를 아주 잘 설명해 주고 있는데요.

대시보드 상단에 API Preview 버튼을 누르면 아래와 같이 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgTHNYOYxaMsV6X7gynxkMAH1mML-SLAUYOczL8KhYFHxXX-JY5v4JWuDjXk5OBfpTGEW0RfNkgcEVHeu4Ohc1r6bIRB2hW4R5SWAkiwDJpN454F--fOQQYnMHlsZEmAnOpzcjfZfw3HbNKWra4AfEyUC5Eoz1lY8S8xPHN4Uvd-Q9CZ-SFovjLFEqE5OQ)

![](https://blogger.googleusercontent.com/img/a/AVvXsEjTIGeW0d3fdeD0snGcoxaE9FiKzSv_V4lklvOIJ6HHX5-GgPBbk5m30GS-ygzqzYy3NK66OaaD48OdXvPfCQoAv-UoZ7P_ijSib7jOaXm8TJzQZo1s_Tz9cO-1aNC9cm5ob7ed-bdyBReHK3k96Y7heRsRNT5Wtd2ctzpfCrEedmksFDSmIhD5QZkBDjM)

![](https://blogger.googleusercontent.com/img/a/AVvXsEgwsf7me6ZNZpkgY2EVr-5-ouLqHrx6gLYLrh-Ii291eIZdAayAEBW6iun09NrS1djDJkvqpy7S4RS7oaxMdBX0WLPQGViObFi_byigdfZ6_l2Pzj_fg1nArU6l4F71bM9h5koRchwbdczZ4smcPL_lTHlaFKHHxXEs2KlgZvu12rOIqB9BROxzC4lTKDI)

위와 같이 아주 자세히 나와있습니다.

3번째 그림에서 볼 수 있듯이 Auth with password 부분을 보면 유저 로그인 인증은 authWithPassword 함수를 이용하면 됩니다.

아주 쉽죠.

react-hook-form에 대해서는 다음 시간에 자세히 설명하겠습니다.

이 패키지로 form의 input 태그에 대해 value, onChange 등을 할 필요가 하나도 없게 됐네요.

---

## 5. 로그아웃 구현하기

로그인에 성공했으면 로그아웃도 알아봐야 하는데요.

```js
function logout() {
    pb.authStore.clear();
    setDummy(Math.random());
  }
```

위와 같이 logout 함수를 만들었습니다.

PocketBase에서의 로그아웃은 pb.authStore의 clear 메서드만 실행하면 됩니다.

로그아웃하면 제가 만든 리액트 앱이 새로 고침이 안 되는데요.

그래서 상단의  isLoggedIn 변수에 따라 유저 이메일을 보여주는 부분이 새로고침이 안 됩니다.

그래서 setDummy 라고 더미 State를 만들어서 강제로 새로고침하게 만들었습니다.

그래서 로그아웃하면 아래와 같이 나올 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiYCPBRm_9MsMBmMoXhTFkm8TwPFnCLWxK8Dy1rtNOC5-CaoFYdI5NKepdB5qeE6LTyRFCpRkbBwTikEjSzRJBUeydeFzHFD1hnGRhBqsBoRtLbqyjveCqM2JrwI1-xgHrTtCPlwzBqN0tddftT4M6JtZtvG0NnUR9Zg-_S9NtIPLv3tIjwGvmWnNBhI7I)

위와 같이 "You are not logged in!"이라고 출력되네요.

---

## 6. 유저 가입하기 로직 만들기

이제 login 로직은 끝났으니 가입하기 로직을 알아봅시다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjTIGeW0d3fdeD0snGcoxaE9FiKzSv_V4lklvOIJ6HHX5-GgPBbk5m30GS-ygzqzYy3NK66OaaD48OdXvPfCQoAv-UoZ7P_ijSib7jOaXm8TJzQZo1s_Tz9cO-1aNC9cm5ob7ed-bdyBReHK3k96Y7heRsRNT5Wtd2ctzpfCrEedmksFDSmIhD5QZkBDjM)

위에서 가입하기 로직이 잘 설명되어 있네요.

create 함수만 실행하면 되네요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiB3KxY6hm83iq35fLAcP3ost84gnklvr5_LWgaHgxQwVaXJ_QVmMQZijPrHQVroUbf0qb6I7qI_q5wNcMqbND1Uf-VmttlIfvQuZi7TJjhG3FbQFdFxc-CVn-gcyz_FV83SKaFrOEKoYmq2-z7Za7IVVnwtRyPBLOcnXRbbpMTBmW0QND3dCNsIOe4I2A)

create 함수의 필수 인자는 위 그림과 같이 password와 passwordConfirm입니다.

우리는 email과 password 방식이기 때문에 email도 넣겠습니다

src/Auth/Register.js 파일을 아래와 같이 만듭시다.

```js
import React from "react";
import { useEffect, useState } from "react";
import { pb } from "../lib/pocketbase";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function Register() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = pb.authStore.isValid;
  useEffect(() => {
    if (pb.authStore.isValid) navigate("/");
  }, [navigate]);

  async function signup(data) {
    console.log(data);
    setLoading(true);
    try {
      const record = await pb.collection("users").create({
        email: data.email,
        password: data.password,
        passwordConfirm: data.password,
      });
      if (record) navigate("/");
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col items-center justify-center mx-auto w-full">
      <h1 className="text-2xl mb-4">Register</h1>
      {!isLoggedIn && (
        <form className="flex flex-col justify-center w-full items-center space-y-4" onSubmit={handleSubmit(signup)}>
          <input
            className="border rounded-md p-1"
            type="text"
            placeholder="input email"
            {...register("email", {
              required: "email is required",
            })}
          />
          <p>{errors.email?.message}</p>
          <input
            className="border rounded-md p-1"
            type="password"
            placeholder="input password"
            {...register("password", {
              required: "password is required",
              minLength: { value: 5, message: "minimum 5" },
            })}
          />
          <p>{errors.password?.message}</p>
          <button
            className="border rounded-md bg-gray-400 py-1 px-4"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Loading" : "Signup"}
          </button>
        </form>
      )}
    </div>
  );
}

export default Register;
```

Register.js 파일에는 react-hook-form의 formState를 이용해서 에러체크를 하는데요.

다음에 자세히 설명하고 PocketBase의 create 함수를 실행하는 signup 함수만 살펴봅시다.

```js
async function signup(data) {
    console.log(data);
    setLoading(true);
    try {
      const record = await pb.collection("users").create({
        email: data.email,
        password: data.password,
        passwordConfirm: data.password,
      });
      if (record) navigate("/");
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  }
```

테스트 앱이라 bcrypt 패키지를 이용해서 password를 해시하지 않았는데요.

여러분은 꼭 해시해서 사용하시기 바랍니다.

테스트해볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEjLzqkrtRsUawDyaHWqLTWVfPeQddXB0yXUkbarTEzjhyNXB6msZVffCLge1TsE8RfHbJkYW7_u29K7iAe2PanQ_Ct4t9563ISlCAkKEuszQc_z6XhHp0rhCFMpK5hjVA38vuOz6enFt1Ctw2gb9Rk3QTiMkJe_DtItZ_Mip1l2DK7W9S4eSt-1qi6ljRI)

![](https://blogger.googleusercontent.com/img/a/AVvXsEgLydS8wNQRtNq_MyokTl6e7re8XrtAvZDUQrl1lASW5WkI1d5dqUPS_iM5EF_KBCUyjYdlpt7EzR-H9mEaihPdpRyc6m9XOeiDfjl6TIrlczskIZm6wOP0CI5Wt5eyiRyw4nzfMrhdE9J-oWL-pS70HZZK_CYsDo_dxrwtG2785rKKxQz6SHpSH8gS-Ls)

위와 같이 콘솔창에도 잘 나오고 있습니다.

그리고 pocketbase 대시보드에도 아래와 같이 잘 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEixKXlcTRyoI-3pa7-ashYsJ46kmXViqgLvJzW-ymIwbd9qqJlIAHuhIxHua2L9MuNThD1hNHOWmWzllt0kpGL3-eyrrYlnhSGycf_qCu1tCNoHcSHFmwjUsGW3RKxw7MgxxvaJcqC88GQQI1IKDoMO3tc3MSWPSzbtY9p9BQ6v1yXg33v8YvhkL7w_jFo)

이제 새로  가입한 유저로 로그인해보십시오.

아주 잘 될 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgcgZkp4Qs_QLyeCfj1Q3ml7Ku52VoqdrLc9HMe51zbslvCukiRfyw4rfe_6GRRYZeUNEf9OsCyU8xZCh3xdPT9WH6ciy41Y9x8cOsftG7lv2wGCKoflQUJPUOBmIQRSZWM3lwxWwalLWv8XPz1PdvExEgegGP7iJc7cqDhkqqUsHCefGBtSLeYfOM-kY0)

위와 같이 새로 가입한 유저 정보로도 아주 잘 될 겁니다.

verified 상태가 아니라도 유저 로그인은 잘됩니다.

---

지금까지 pocketbase와 React를 이용해서 유저 로그인, 가입하기 로직에 대해 알아봤습니다.

이제 이걸 빌드해서 Fly.io 서버에 한번 올려 보세요.

그럼.
