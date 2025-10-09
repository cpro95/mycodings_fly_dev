---
slug: 2025-01-04-nextjs-supabase-tutorial-4-login-with-email-and-password-and-useactionstate
title: Next.js 15, Supabase 강좌 4편. email, password를 이용한 로그인 구현
date: 2025-01-04 14:09:55.225000+00:00
summary: Next.js와 Supabase를 이용해서 Email, Password 방식의 로그인을 테스트해 보겠습니다.
tags: ["next.js", "auth", "useActionState", "react 19", "supabase", "email password login"]
contributors: []
draft: false
---

** 목  차 **

- [Next.js 15, Supabase 강좌 4편. email, password를 이용한 로그인 구현](#nextjs-15-supabase-강좌-4편-email-password를-이용한-로그인-구현)
  - [Next.js 15, Supabase 강좌 3편. Github OAuth를 이용한 로그인 구현](#nextjs-15-supabase-강좌-3편-github-oauth를-이용한-로그인-구현)
  - [가입(SignUp), 로그인(SignIn) 페이지 구현하기](#가입signup-로그인signin-페이지-구현하기)
  - [SignUp 페이지 만들기](#signup-페이지-만들기)
  - [똑같은 이메일로 다시 가입해 보기](#똑같은-이메일로-다시-가입해-보기)
  - [React 19의 useActionState 사용하여 쉽게 Form 핸들링하기](#react-19의-useactionstate-사용하여-쉽게-form-핸들링하기)
  - [SignInForm 작성과 로그인 구현하기](#signinform-작성과-로그인-구현하기)

---

안녕하세요?

Next.js 15, Supabase 강좌 4편입니다.

지난 시간에는 Next.js 15를 이용한 기본적인 템플릿과 Google OAuth, Github OAuth를 이용한 로그인을 구현해 봤는데요.

오늘은 가장 전통적인 방식의 로그인과 가입하기 로직을 구현해 보겠습니다.

참고로, 지난 시간 강좌 리스트입니다.

[Next.js 15, Supabase 강좌 1편. 유저 인증(Auth)을 위한 Next.js 15와 Supabase 템플릿 만들기](https://mycodings.fly.dev/blog/2024-12-29-nextjs-supabase-tutorial-1-making-template-and-omit-middleware)

[Next.js 15, Supabase 강좌 2편. Google OAuth를 이용한 로그인 구현](https://mycodings.fly.dev/blog/2025-01-01-nextjs-supabase-tutorial-2-login-with-google-id-oauth)

[Next.js 15, Supabase 강좌 3편. Github OAuth를 이용한 로그인 구현](https://mycodings.fly.dev/blog/2025-01-01-nextjs-supabase-tutorial-3-login-with-github-id-oauth)

---

## 가입(SignUp), 로그인(SignIn) 페이지 구현하기

Supabase를 이용해서 이메일, 패스워드 방식으로 가입하기와 로그인을 구현해 보도록 하겠습니다.

먼저, "/auth" 라우팅과 "/auth/signup", "/auth/signin" 라우팅에 해당하는 페이지를 만들어야 합니다.

일단 기존 시간에 사용했던 "/auth" 라우팅에 해당하는 페이지를 아래와 같이 바꾸겠습니다.

```ts
// src/app/auth/page.tsx

import AuthForm from "@/components/Forms/AuthForm";
import Link from "next/link";

const AuthPage = () => {
  return (
    <div className="flex flex-col items-start gap-4 p-8">
      <Link href="/" className="underline">
        Go to Home
      </Link>
      <Link href="/auth/signup" className="underline">
        Go to Sign Up
      </Link>
      <Link href="/auth/signin" className="underline">
        Go to Sign In
      </Link>
      <AuthForm />
    </div>
  );
};

export default AuthPage;
```

"/auth" 라우팅에 모든 경로로 갈 수 있는 링크를 넣었습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjJR1R132rhDvZppWuTqatUFwVoexWTi0Bc7Qg_P4cI9-WKRUZvG3cD8dQuCxpht50uvYoTaSqLIscIbW7IBAgX378VVgMNCI1obD8BslKL1H2VE3oMBYFblCwRBG5cMsLmDPhVE7PbAluW1oFNKL8ttdukaEmLby2he99rQwBlZrQJxbq5peCy-wk2Syk)

위 그림과 같이 허접한 링크가 보이는데요.

먼저, "/auth/signup" 페이지를 만들겠습니다.

---

## SignUp 페이지 만들기

`src/app/auth/signup/page.tsx` 페이지를 만들어야 "/auth/signup" 라우팅이 되는겁니다.

일단 서버 컴포넌트와 클라이언트 컴포넌트를 분리하기 위해 아래와 같이 만들었습니다.

```ts
// src/app/auth/signup/page.tsx

import SignUpForm from "@/components/Forms/SignUpForm";
import Link from "next/link";

const SignUpPage = () => {
  return (
    <div className="flex flex-col gap-2 p-8">
      <Link href="/auth" className="underline">
        Go to Auth Page
      </Link>
      <h1>Sign Up</h1>
      <SignUpForm />
      <Link href="/auth/signin" className="underline">
        Go to Sign In Page
      </Link>
    </div>
  );
};

export default SignUpPage;
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEjUBoZd8PrOJHz8U7WrinsN7BDSPnBP8qLDxN5JwSveEbZgcxTXfj6v8abApu3pkbCvl6H-t6CmgmwKeTlf8t5oPVKCnK5HxSqPKijKP9sKojVx5VeMDFufrK8d_f5JnRs6xl3NgWfqeqqrJB5apn08zgQ3KeH7bSRDGwP11V8Yh5jjlNaAhfRy4a5a_rc)

실행 화면은 위와 같습니다.

그리고 위 파일은 서버 컴포넌트고 중간에 보이는 'SignUpForm'이 바로 클라이언트 컴포넌트입니다.

'SignUpForm'은 "src/components/Forms" 폴더에 만들었습니다.

```ts
"use client";

import { signupWithEmailPassword } from "@/utils/supabase/actions";

const SignUpForm = () => {
  return (
    <form
      action={signupWithEmailPassword}
      className="flex flex-col gap-2 max-w-40"
    >
      <input
        className="border rounded px-2.5 py-2 text-gray-700"
        type="email"
        name="email"
        placeholder="Email"
      />

      <input
        className="border rounded px-2.5 py-2 text-gray-700"
        type="password"
        name="password"
        placeholder="Password"
      />

      <button className="border rounded px-2.5 py-2">Sign Up</button>
    </form>
  );
};

export default SignUpForm;
```

'SignUpForm'은 서버 액션을 사용하게끔 formAction에 'signupWithEmailPassword'이라는 액션 함수를 넣었습니다.

그러면, 이 함수를 만들어야 하는데요.

'src/utils/supabase/actions.ts' 파일에 모든 액션 함수가 있었는데요.

여기에 아래와 같이 추가합시다.

```ts
// src/utils/supabase/actions.ts

const signupWithEmailPassword = async (formData: FormData) => {
  const supabase = await createClientForServer();

  const { data, error } = await supabase.auth.signUp({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  console.log(data);

  if (error) {
    console.log(error);
  } else redirect("/");
};

export {
  signInWithGoogle,
  signInWithGithub,
  signOut,
  signupWithEmailPassword,
};
```

'signupWithEmailPassword' 함수는 아주 간단합니다.

supabase에서 제공해 주는 signUp 함수를 사용하면 되는데요.

signUp 함수에는 간단하게 email, password가 있는 객체만 전달하면 됩니다.

이제 테스트해 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEhnR0gRfQN2oaV4kuGM_LEGirQj-44QW0b7s46Vkv_1FFHzkCH8YvlP-ieEFpBwkmM7pgmLS1H7uxL1PzsJsPMnvMGnPNrnAwSoneuPCZ6nYbE6wakvPfeHVaomKV0HbkGfYp0nkqbbFY8JelCc5FcVFW2-oMKWGLdWUgaIm-vSscH27dzPob6ZIm6eIPY)

위와 같이 "test@test.com" 이메일과 패스워드는 "11111111"를 넣었습니다.

엔터키를 누르거나 밑에 "Sign Up" 버튼을 누르면 아주 잠깐의 딜레이 후에 "/" 라우팅으로 이동하는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjpvMkCGrOBuigiwrNlLTkrvJyXy2THdoDC92u__3O3KUMS_M6vDOpJKSFyL3kzN4_B5OXJ3kLd1yCP8fgdRCi32ml9fUs2HITMCvhcSOThQVMfbkVWvAUqzSdPBnA1khr-10d4PMrcVNTufJ-ATeE2R2Tbf4lVLVXPjaJpw-UnLrOQoZR7Bg5q7yL2lr4)

위와 같이 "test@test.com"이란 이름으로 로그인이 완료되었습니다.

가입이 성공하면 해당 이메일로 바로 로그인까지 되는 로직입니다.

터미널을 보시면 아래와 같이 'console.log(data)' 값이 보이는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEh5KyA3kNe2beGMun-ixJoDvfP0oAcBdws4-hcCxC7rbwtSW80EcF4EaRFLNXFoBVLjCDQMeDJ5jDTzACj1ahFSaPNzm83yl3y1H577fy4wj5tg9FVGnYKKo_ZN1z_YjSSr6kpITVeHwUfRVLo0pwyM9_TxdWQevItQSlpsV2v0sb416_a0thElenXa5F4)

위 데이터는 signUp 함수의 실행 결과 성공했을 때 'data' 값을 보여주는데, 'data' 값에는 user, session 값이 있네요.

그리고 아래 화면은 "/"라우팅으로 갔을 때 현재 로그인 유저 값을 콘솔에 출력한 값입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgNr7DW-P6xvsqi5_Hi0BDwMgDJMlIP9bG1_rtltwb3X_qvqEfuxOcum5-_Qx15-gP5yxoF-mreMJKBTKdS4rZuC8xJSYDZq5KKcjV_JZrT4-SIM7uHdOwWBXVE7Af-WH0tUMFf2hEY2QoAz5m2JvxE3yqqOXr5Zv6-kxKjWk8HrSMgqg3HGinGjs4J5WQ)

지금까지는 아주 잘 작동하고 있습니다.

supabase 대시보드로 가서 방금 가입한 유저가 있는지 확인해 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEi-aZ56t_bR-sHUhN15VilzUuKKroNGmYpDtq2qQzg2bwp-uLXkJkko8MB6lEbeJNLcdFBJQhMNdaF5vPuMmY9fUxmFDM-L8IuIKFGB6gXN-Pp4gOqzLf-R5lQEA9QcAlEX4CV8iQQZI45Rtvn1yZbFIAJwhjzirVkMvrACFzlgwVXt-DbD9mcqfz4YK2Q)

위와 같이 잘 나옵니다.

참고로 Supabase Auth 세팅에서 Email 부분에서 아래와 같이 'Confirm email' 부분은 선택하지 않았습니다.

이걸 선택하면 Resend 같은 이메일 서비스를 이용해서 가입 인증 컨펌 메일을 보내고 유저가 실제 이메일을 열어 본 후 컨펌해 줘야지 최종적으로 유저가 가입되는 방식인데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgqrGBGGikAkGqUlJ01zOxyXAoHF-2XTBq8sjTIdWWivqlZt6-m3F5AhF3cD_CiL1gASSToJwqvtPr54pz0sEDHSrqWZj6EwNnaBwtVJhSLg4s2yDocHtBpapwE4WOIZGcAnJFMOLuMRMgVn-xXG_hnaGQNBt3HlgsLcDBCrBt8fpGr1pXX1nfPrzXK7ms)

저는 테스트 용도로 사용하기 위해 위 그림처럼 Confirm email 부분은 체크해제한 후에 테스트하고 있습니다.

---

## 똑같은 이메일로 다시 가입해 보기

가입하기 로직을 다시 테스트하기 위해 아까 가입한 'test@test.com' 이란 이메일로 다시 가입해 보겠습니다.

"/" 라우팅에서 "Sign Out"하시고 다시 가입하기로 가신다음에 'test@test.com'이란 이메일로 가입을 시도해 보십시오.

브라우저는 새로고침같이 input 칸이 지워지면서 아무런 반응이 없는데요.

터미널에서는 아래와 같이 나옵니다.

```ts
{ user: null, session: null }
Error [AuthApiError]: User already registered
    at async signupWithEmailPassword (src/utils/supabase/actions.ts:40:26)
  38 |   const supabase = await createClientForServer();
  39 |
> 40 |   const { data, error } = await supabase.auth.signUp({
     |                          ^
  41 |     email: formData.get("email") as string,
  42 |     password: formData.get("password") as string,
  43 |   }); {
  __isAuthError: true,
  status: 422,
  code: 'user_already_exists'
}
```

user와 session 이 'null' 이라는 부분은 'console.log(data)'란 콘솔 명령어에 해당하는 부분입니다.

즉, supabase.auth.signUp 함수가 실패했다는 뜻이고, error가 발생했다는 뜻인데요.

그래서 'console.log(error)' 부분 때문에, 터미널에 에러 코드가 출력되고 있습니다.

에러 데이터를 읽어 보시면 "User already registered"라는 문구가 보입니다.

즉, 아까 가입했던 이메일이라 유저가 벌써 가입됐다는 문구를 보여주고 있습니다.

그래서 유저에게 현재 일어나고 있는 일은 브라우저에 표시해 줘야 하는데요.

이 작업은 React 19 이전에는 상당히 복잡했는데요.

이 부분을 짚고 넘어가 보겠습니다.

---

## React 19의 useActionState 사용하여 쉽게 Form 핸들링하기

React 19 이전에서는 form 핸들링하여 UI를 관리하려면 아래 그림과 같이 상당히 번거롭게 작업해야 했었는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjEk7ZmORD7p3yjrdEj4rrpZ2kzOQpqSTX3CmAj7YmLXisj--6uNpcEp8GMRdb4TC8YCgHvmFF5xZ3rOUWyTc1m3QPUlwuTcoZPF8kKmYdCWJCU9fZ1X3pzYX6eUYooCdpZiEDehB8IQq2bz9sSdR8nk65WnTRcvG87y3G5ac9pXAXNA82G9cn72Mem-XM)

React 19의 useActionState 훅이 나오면서 아래와 같이 아주 간단하게 UI를 꾸밀 수 있게 되었습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgYxEA4Ozoa5WNJ1LN049_lypWzkzJ0YoAMtarV-luBsZPFnBo4GDVFfzk3odN8tLVIr_RbdIU7gHeaCT6pEXMBDKLL3FZaYH_W_Nwqq1uprO9t5Si1n1QEbtbBFXv6yNNvcdsacIgSusYY1YN_tRjeOdfwsvqVQn8vbaXPbJspoDsAjrX5ofvzR1xSTaY)

그러면 SignUpForm을 useActionState 훅을 이용해서 바꿔 보겠습니다.

```ts
"use client";

import { signupWithEmailPassword } from "@/utils/supabase/actions";
import { useActionState } from "react";

const SignUpForm = () => {
  const [error, formAction, isPending] = useActionState(
    signupWithEmailPassword,
    null
  );

  return (
    <form action={formAction} className="flex flex-col gap-2 max-w-40">
      <input
        className="border rounded px-2.5 py-2 text-gray-700"
        type="email"
        name="email"
        placeholder="Email"
      />

      <input
        className="border rounded px-2.5 py-2 text-gray-700"
        type="password"
        name="password"
        placeholder="Password"
      />

      <button disabled={isPending} className="border rounded px-2.5 py-2">
        {isPending ? "Processing" : "Sign Up"}
      </button>

      {error && <span>{error.message}</span>}
    </form>
  );
};

export default SignUpForm;
```

아까랑 바뀐 부분을 집중적으로 설명해 보겠습니다.

```ts
  const [error, formAction, isPending] = useActionState(
    signupWithEmailPassword,
    null
  );
```

일단 useActionState 훅의 사용법입니다.

useState처럼 배열을 디스트럭쳐링 하면 되는데요.

배열 안에 있는 3가지를 설명해 보면, 먼저, error 입니다.

이 값은 state 인데요.

error 라는 이름도 되고 state라는 이름도 됩니다.

즉, 상태값인데요.

useActionState에 의해 리턴된 상태값이란 뜻입니다.

우리는 Form 핸들링에서 에러값만 보여주면 되기 때문에 이름을 state라는 이름 말고 직관적으로 error라는 이름으로 썼습니다.

그리고 밑에 error라는 값을 아래와 같이 브라우저에 보여주고 있습니다.

```ts
{error && <span>{error.message}</span>}
```

useActionState의 리턴 배열의 두 번째 인자는 위에서는 formAction인데요.

formAction 함수는 아래와 같이 form의 action 값과 연결되어야 합니다.

```ts
<form action={formAction} className="flex flex-col gap-2 max-w-40">
```

잘 생각해 보시면 useActionState 없이 처음에 작성한 코드에서는 action 값에 우리가 작성한 'signupWithEmailPassword' 액션 함수를 바로 넣었었는데요.

useActionState 훅을 이용하려면 form 태그랑 연결되게 설정하고 'useActionState(signupWithEmailPassword, null)' 처럼 이 부분에 액션 함수를 전달해 줘야 합니다.

세 번째, 'isPending' 변수는 Boolean 값으로 Action이 Pending 되고 있는지 여부를 '참/거짓' 값으로 나타내 줍니다.

그래서 이 'isPending' 값을 이용해서 아래와 같이 "Processing..." 값을 보여주고 있습니다.

```ts
<button disabled={isPending} className="border rounded px-2.5 py-2">
  {isPending ? "Processing" : "Sign Up"}
</button>
```

그러면, 마지막으로 'useActionState(signupWithEmailPassword, null)' 이 부분을 이해해야하는데요.

useActionState 훅에 실제 액션 함수를 넣고, 두 번째 인자로는 초기 state 값을 넣으면 됩니다.

이렇게 하면 타입스크립트가 signupWithEmailPassword 함수에 아래와 같은 경고를 보여주는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEghVzv-FuqWNSEbblPXePfz4voQOfYVm_24QJITjEAl28-oqV2Pl6qj5y4iQ6yKSVinAZ-3bHGeb10I5oQRoNkGmFvFAntu9m9Dwagq-C-ihvZldierlMqCgAIaRbWlhnFIr9UqOMBzDdlZBmGHEvKptGrUs7tusRN_wIgd37J6a3ypv3pq16edPVIRQwg)

useActionState 훅에 사용하려면 signupWithEmailPassword 함수의 첫 번째 인자는 previous State 값이 와야 합니다.

그래서 아래와 같이 signupWithEmailPassword 함수의 인자 타입을 바꿔주면 됩니다.

formData 앞에 prev 인자를 넣으면 됩니다.

```ts
const signupWithEmailPassword = async (prev: any, formData: FormData) => {
  const supabase = await createClientForServer();

  const { data, error } = await supabase.auth.signUp({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  console.log(data);

  if (error) {
    console.log(error);
    revalidatePath("/auth/signup");
    return { message: error.message };
  } else redirect("/");
};
```

그리고 error 발생 시 실제 error 값을 리턴해줘야 합니다.

저는 객체를 리턴해주고 있습니다.

여기서 중요한 게 바로 `revalidatePath("/auth/signup")` 명령어인데요.

이 부분은 클라이언트 컴포넌트가 캐시되어 사용되어질 경우 에러값을 옛 캐시값으로 보여줄 수 있어 꼭 revalidate해서 캐시된 값을 갱신하라는 뜻입니다.

이제 테스트해 볼까요?

브라우저는 리프레시하고 똑같은 이메일로 가입해 보겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEg_f_t_zFhifkTSQFsBT6tUPWZcqylCCwaKesFzRyel1k3Mc76QvvPcLPoiaLqN6uYoxvJKsJCix2liHvPhJ5TtaLTb_f7Dt-ZO3gKkc8yzbB5BcEfVr1lvFFB3wfd-zUrknqjtnjfl7xHGk_TMCsgKLDuKA5PnlMPeRUw9MTuRAwmFcpDTwCk7_v2akLs)

위와 같이 에러 메시지가 잘 보입니다.

그리고 isPending 값에 따라 "Processing..." 값도 잠깐 보였다가 사라질 겁니다.

useActionState 훅을 이용해서 아주 멋지게 UI를 꾸몄었는데요.

useActionState 훅은 사실 useFormState와 useFormStatus 훅 2가지를 합친 겁니다.

이름을 Action이라고 지은 거는 form만 처리하는게 아니라 Action 함수는 모두 처리한다는 의미에서 useActionState라는 이름으로 지었다고 합니다.

이제, 로그인 부분을 작성해 보겠습니다.

---

## SignInForm 작성과 로그인 구현하기

SignUpForm과 아주 비슷합니다.

```ts
"use client";

import { signinWithEmailPassword } from "@/utils/supabase/actions";
import { useActionState } from "react";

const SignInForm = () => {
  const [error, formAction, isPending] = useActionState(
    signinWithEmailPassword,
    null
  );
  return (
    <form action={formAction} className="flex flex-col gap-2 max-w-40">
      <input
        className="border rounded px-2.5 py-2 text-gray-700"
        type="email"
        name="email"
        placeholder="Email"
      />

      <input
        className="border rounded px-2.5 py-2 text-gray-700"
        type="password"
        name="password"
        placeholder="Password"
      />

      <button disabled={isPending} className="border rounded px-2.5 py-2">
        {isPending ? "Processing" : "Sign In"}
      </button>
      {error && <span>{error.message}</span>}
    </form>
  );
};

export default SignInForm;
```

당연히 여기서도 useActionState 훅을 사용하고 있습니다.

이제 action 값에 들어가 있는 signinWithEmailPassword 함수를 만들어 보겠습니다.

actions.ts 파일에 아래와 같이 추가합니다.

```ts
const signinWithEmailPassword = async (prev: any, formData: FormData) => {
  const supabase = await createClientForServer();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  console.log(data);

  if (error) {
    console.log(error);
    revalidatePath("/auth/signin");
    return { message: error.message };
  } else redirect("/");
};

export {
  signInWithGoogle,
  signInWithGithub,
  signOut,
  signupWithEmailPassword,
  signinWithEmailPassword,
};
```

supabase의 signInWithPassword 함수를 이용해서 아주 쉽게 로그인하고 있습니다.

테스트해 보면 아주 간단하게 로그인되는 걸 볼 수 있을 겁니다.

---

지금까지 supabase로 이메일, 패스워드 방식의 로그인을 구현해 봤는데요.

사실 여기서 중요한 거는 useActionState 훅을 꼭 사용하라는 겁니다.

UI에 현재 무슨 일이 일어나고 있는지 꼭 보여줘야 사용자가 답답해하지 않고 사용할 수 있기 때문입니다.

그럼.

