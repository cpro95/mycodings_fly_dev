---
slug: 2025-01-19-nextjs-supabase-tutorial-8-send-otp-number-and-login-with-otp
title: Next.js 15, Supabase 강좌 8편. 이메일로 OTP를 보내서 로그인 구현하기
date: 2025-01-19 08:02:41.307000+00:00
summary: Next.js와 Supabase를 이용해서 이메일로 OTP 숫자를 보내서 로그인하는 방법을 구현해 봅시다.
tags: ["next.js", "auth", "supabase", "otp"]
contributors: []
draft: false
---

** 목 차 **

- [Next.js 15, Supabase 강좌 8편. 이메일로 OTP를 보내서 로그인 구현하기](#nextjs-15-supabase-강좌-8편-이메일로-otp를-보내서-로그인-구현하기)
  - [Send Otp 라우팅 구현과 SendOtpForm 작성 그리고 action 함수 만들기](#send-otp-라우팅-구현과-sendotpform-작성-그리고-action-함수-만들기)
  - [Verify-OTP 관련 라우팅, 폼, 액션 함수 구현하기](#verify-otp-관련-라우팅-폼-액션-함수-구현하기)

---

안녕하세요?

Next.js 15, Supabase 강좌 8편입니다.

아래는 지금까지의 강좌 리스트 전체입니다.

[Next.js 15, Supabase 강좌 1편. 유저 인증(Auth)을 위한 Next.js 15와 Supabase 템플릿 만들기](https://mycodings.fly.dev/blog/2024-12-29-nextjs-supabase-tutorial-1-making-template-and-omit-middleware)

[Next.js 15, Supabase 강좌 2편. Google OAuth를 이용한 로그인 구현](https://mycodings.fly.dev/blog/2025-01-01-nextjs-supabase-tutorial-2-login-with-google-id-oauth)

[Next.js 15, Supabase 강좌 3편. Github OAuth를 이용한 로그인 구현](https://mycodings.fly.dev/blog/2025-01-01-nextjs-supabase-tutorial-3-login-with-github-id-oauth)

[Next.js 15, Supabase 강좌 4편. email, password를 이용한 로그인 구현](https://mycodings.fly.dev/blog/2025-01-04-nextjs-supabase-tutorial-4-login-with-email-and-password-and-useactionstate)

[Next.js 15, Supabase 강좌 5편. 도메인 없이 Supabase에서 컨펌 이메일 보내기
](https://mycodings.fly.dev/blog/2025-01-11-nextjs-supabase-tutorial-5-sending-confirm-email-without-domain)

[Next.js 15, Supabase 강좌 6편. 이메일로 Reset Password 링크 보내기와 Update Password 로직 구현하기](https://mycodings.fly.dev/blog/2025-01-12-nextjs-supabase-tutorial-6-send-email-of-reset-password-and-implementing-reset-password)

[Next.js 15, Supabase 강좌 7편. 이메일로 Magic Link를 보내서 로그인 구현하기](https://mycodings.fly.dev/blog/2025-01-13-nextjs-supabase-tutorial-7-send-magic-link-and-login-with-supabase-brevo)

---

지난 시간에는 외부 이메일 서비스인 Brevo와 연결한 상태에서 Confirm email 기능, 그리고 Reset Password 기능 그리고 매직 링크를 보내 로그인할 수 있도록 기능을 구현해 보았는데요.

Supabase에서는 매직 링크를 통한 로그인 구현에는 OTP도 지원해 주는데요.

Supabase에서는 매직 링크 기능과 OTP 기능은 동시에 사용하는 것보다는 둘 줄에 하나만 사용하는 걸 추천하고 있습니다.

Supabase 대시보드의 이메일 템플릿에 있는 "Magic Link" 칸이 그곳인데요.

아래와 같이 템플릿을 일단 바꿉시다.

```sh
<h2>One time login code</h2>

<p>Please enter this code: {{ .Token }}</p>
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEgGDW1thKf5vUEssliak4z0W1lVZZNDZqM-btrr6D6ShJwV8o880oCJymGyKAdr5lhuGxvT807T82YpOOCkNB6muuYjlRalPNpMeip-Z0aEpyMLYD9YitMQvb6Lzhn3z8Zzq_jhDNu-ht5VFnF4cqobj1-FFqgcTVFEQtuWtGzJQFfprvu3uxAA7N5YCv8)

위와 같이 꼭 "Save" 버튼을 눌러 상태를 저장해야 합니다.

---

## Send Otp 라우팅 구현과 SendOtpForm 작성 그리고 action 함수 만들기

이번 강좌를 쭉 하면서 느끼셨겠지만 Next.js 15와 React 19의 useActionState 훅을 이용하면 아주 쉽게 서버 액션 상태를 관리할 수 있는데요.

테스트를 위해 우리가 구현해야 할 라우팅이 `/auth/otp` 입니다.

참고로 '/auth' 라우팅에는 아래와 같이 '/auth/otp' 라우팅 링크만 하나 추가합시다.

```ts
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
      <Link href="/auth/magic" className="underline">
        Magic Link Login
      </Link>
      <Link href="/auth/otp" className="underline">
        OTP Login
      </Link>
      <AuthForm />
    </div>
  );
};

export default AuthPage;
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEiqFGckOg8qgqJWLtgNwYVHf_86u2xLJUFcO6HBYsszpGZpI7_aAm2KmYFOuLq66Gyl3WKgRL56ZQsCsRo_OoGgzWHJ0v-SttPdAmWtkjd3B8cTAch_KIbvbCwcVs4IlwHxyIfsxdvr_NDVqz1FTplf9xeD1YbvquIFVuE2i3VMm-YWL9LJXYCCrbruKVU)

위와 같이 메인 '/auth' 라우팅에는 각종 로그인 관련 링크가 다 모여있습니다.

이제 준비는 끝났는데요.

이제 본격적인 Send Otp 관련 라우팅과 폼을 만들어 봅시다.

일단 아래 코드는 라우팅 관련 해당 파일인데요.

```ts
// src/app/auth/otp/page.tsx

import Link from "next/link";
import SendOtpForm from "@/components/Forms/SendOtpForm";

const OTPPage = () => {
  return (
    <div className="flex flex-col gap-2 p-8">
      <Link href="/auth" className="underline">
        Go to Auth Page
      </Link>
      <h1>Send Otp for Login</h1>
      <SendOtpForm />
      <Link href="/auth/signup" className="underline">
        Go to Sign Up Page
      </Link>
    </div>
  );
};

export default OTPPage;
```

역시나 우리가 만들어야 하는 거는 라우팅이 만들어졌으니 해당되는 Form을 만들면 됩니다.

SendOtpForm 이름의 폼을 'src/components/Forms' 폴더 아래 'SendOtpForm.tsx' 파일을 만듭시다.

역시나 코드 재활용이 가능한 컴포넌트 단위의 폼으로 만들어 놓으면 아주 쉽게 확장할 수 있습니다.

```ts
"use client";

import { useActionState } from "react";
import { signInWithOtp } from "@/utils/supabase/actions";

const SendOtpForm = () => {
  const [state, formAction, isPending] = useActionState(signInWithOtp, null);
  return (
    <form action={formAction} className="flex flex-col gap-2 max-w-40">
      <input
        className="border rounded px-2.5 py-2 text-gray-700"
        type="email"
        name="email"
        placeholder="Email"
      />

      <button disabled={isPending} className="border rounded px-2.5 py-2">
        {isPending ? "Processing" : "Send OTP"}
      </button>
      {state && <span>{state.message}</span>}
    </form>
  );
};

export default SendOtpForm;
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEhLW879js57oqqKbI7CmGAcs1NFdTW0F8r6srxafigHpfsTOOC6H51LZ_GvGAJhVEjguGw1Z1z6KyrIUGzcLxnmioRQrv4YeuHIlXNAIrPF_a6dZsVpczvhxixVUun57Zf_uCbEYRLKx6mgPbEFmHoZhlZ3oFnIOQZtDJuABqDM0LaKkKKRZbXTKaYyNX0)

Send OTP의 로직은 사용자가 위와 같은 폼에 이메일을 입력해서 폼을 제출하면 Supabase가 해당 이메일로 OTP 코드를 보내줍니다.

자기 이메일을 적어놓고 "Send OTP" 버튼을 누르면 됩니다.

아래 메시지는 Supabase가 제한하고 있는 OTP 관련 제약사항인데요.

너무 자주 Send OTP 버튼을 누르지 못하게 15초로 제한하고 있는 겁니다.

참고 바랍니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjqf3Ty-dWh-OiuMKXVb3VdMoZ0VN77li1NTw68UHAq9jNj42kqClmv5PzgJrVv9CC3AtLwLzih33TeyGB_01a4rdtEbsP2dRFoB-6Mze5SUDlshMcp5999JLxdiiqhBeVJxlegcpnXd0_H384msldcuGpLp3kmmRs6gbAy_yG4RS2r4_Q8yMAdon2ywSY)

위와 같이 했으면 다 잘 된거라 생각하시지만, 에러가 날 건데요.

왜냐하면 우리가 만든 폼에 있는 액션 함수를 작성하지 않아서 그렇습니다.

SendOtpForm 코드를 잘 보시면 useActionState 훅에 사용되는 액션 함수가 바로 signInWithOtp 함수입니다.

이제 액션 함수를 모아놓은 파일에 signInWithOtp 함수만 구현하면 됩니다.

'src/utils/supabase/actions.ts' 파일을 보시면 아래와 같이 추가하면 됩니다.

```ts
const signInWithOtp = async (prev: any, formData: FormData) => {
  const email = formData.get("email") as string;

  const supabase = await createClientForServer();

  const { data, error } = await supabase.auth.signInWithOtp({
    email,
  });

  if (error) {
    console.log(error);
    revalidatePath("/auth/otp");
    return { message: error.message };
  } else redirect(`/auth/verify-otp?email=${email}`);
};

export {
...
...
...
...
  signInWithOtp,
};
```

위 코드에서 잘 보시면 OTP 관련 Supabase 함수가 바로 signInWithOtp 함수입니다.

이 함수는 지난 시간에 배웠었던 매직 링크 보낼 때 쓰였던 함수입니다.

맞습니다.

그래서 Supabase에서는 매직링크 또는 OTP 둘 줄에 하나만 고르라고 하는 겁니다.

supabase.auth.signInWithOtp 함수가 받는 함수 인자는 이메일 이름 하나입니다.

함수 인자로 들어온 이메일에 매직링크 또는 OTP를 보내주는게 Supabase가 해주는 역할인데요.

처음에 Supabase 대시보드에서 이메일 템플릿에서 매직링크나 OTP 양식을 골라주면 됩니다.

이제 액션함수까지 작성했는데요.

자세히 보시면 성공했을 때 redirect 하는 라우팅이 바로 `/auth/verify-otp` 라우팅입니다.

그런데 이 라우팅으로 redirect할 때 searchParams로 email도 같이 보내주는데요.

공식 명칭은 URL Search Params입니다.

브라우저 주소창에 ? 다음에 A=B 형식으로 문자열로 데이터를 전달할 수 있습니다.

참고로 ?A=B&C=D 이런식으로 하면 여러 데이터 값을 전달할 수 있습니다.

이걸 나중에 Next.js에서 제공해 주는 useSearchParams 훅을 통해 쉽게 값을 가져올 수 있습니다.

일단 여기까지 작성했고 "Send OTP" 라우팅에서 이메일을 넣고 버튼을 누르면 본인 이메일에 아래와 같이 OTP 값이 옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhGt32H0laL8cMRfpLhhhmdxjGmlhislirNH8JjtZSIRd7_rHJJWSOUTqkupO6YI118l9lRu3zj0xuO7Icz3zG9dGtI7A_-MZKqsRGQXYIZURqUkVt69ep5_DperBiXOUMZRzjdq1arDv1YEhEc4YFQShAOg7AzmZNzJrln3Nr_d_yfJbYFsT7-iV23xAw)

위와 같이 우리가 설정한 이메일 템플릿 양식으로 아주 간단하게 OTP 숫자 값이 옵니다.

그러면 여기서 꼼수를 하나 쓸 수 있는데요.

이메일 템플릿을 아래와 같이 하면 매직 링크와 OTP 숫자 두 개가 모두 오게 될 겁니다.

```sh
<h2>Magic Link</h2>

<p>Follow this link to login:</p>
<p><a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=magiclink">Log In</a></p>

<br />
<hr />

<h2>One time login code</h2>

<p>Please enter this code: {{ .Token }}</p>
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEiduDpwc11Mq-hYWWQMcZmT1yi-jyVbd4exwmeA3ZlOlPnvdJfoWZLg5jU-KlSSAjs0JeixAxpdKMubBEMclAsy_iqSkWv5IXL_Jo9M_Q54usty2pznxdpPvkdYzrg6jmDgXehzcFZ9qvW2Kefduyr3agC5kv1uXjBy1piobZLFeMsO8imLOWJlr4eV2rg)

![](https://blogger.googleusercontent.com/img/a/AVvXsEi_gR9A8seG2Nk39BfGrxhJI0Cc3BKKncj72lEjp9Og8coEQtQeYF9kreXOzYpGHTYItARfgrJ9wPeejavBbG_burC9XNndIc54ZvPtJGyYwENNFn5PM5wTSMPgi1TBJCXoF8aTS3VHxEB2BpJfiuR42_LSDXiQLlXePmc3h_QSYoaB4skggVU4dIve_bU)

위 두 개의 그림을 보면 이해가 되시죠.

하지만 위와 같이 매직 링크나 OTP를 동시에 사용하는 걸 권장하지는 않습니다.

Supabase에서도 권장하지 않는 방법이거든요.

이제 Send OTP 관련 라우팅, 폼, 액션함수는 끝났습니다.

---

## Verify-OTP 관련 라우팅, 폼, 액션 함수 구현하기

아까 Send OTP 관련 마지막 액션함수에서 redirect 했던 라우팅 주소가 '/auth/verify-otp' 였는데요.

이제 이 라우팅과 해당 폼, 그리고 액션함수까지 구현해 봅시다.

먼저, 'app/auth/verify-otp/page.tsx' 파일을 만들어 봅시다.

```ts
import Link from "next/link";
import VerifyOtpForm from "@/components/Forms/VerifyOtpForm";

const VerifyOtp = () => {
  return (
    <div className="flex flex-col gap-2 p-8">
      <Link href="/auth" className="underline">
        Go to Auth Page
      </Link>
      <h1>Verify OTP</h1>
      <VerifyOtpForm />
      <Link href="/auth/signup" className="underline">
        Go to Sign Up Page
      </Link>
    </div>
  );
};

export default VerifyOtp;
```

이제 VerifyOtpForm을 만듭시다.

Forms 폴더 밑에 'VerifyOtpForm.tsx' 이름으로 만들어 둡시다.

```ts
"use client";

import { verifyOtp } from "@/utils/supabase/actions";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";

const VerifyOtpForm = () => {
  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";

  const [state, formAction, isPending] = useActionState(verifyOtp, {
    message: "",
    email,
  });
  return (
    <form action={formAction} className="flex flex-col gap-2 max-w-40">
      <input
        className="border rounded px-2.5 py-2 text-gray-700"
        type="number"
        name="token"
        placeholder="Token"
      />

      <button disabled={isPending} className="border rounded px-2.5 py-2">
        {isPending ? "Processing" : "Verify OTP"}
      </button>
      {state && <span>{state.message}</span>}
    </form>
  );
};

export default VerifyOtpForm;
```

위 폼을 보시면 input 태그에는 token 이름으로 number 값을 넣었으며, 두 번째로 특이한 점은 useActionState 훅에 넣을 두 번째 인자인 initialState 값을 지정했다는 겁니다.

initialState 값으로는 에러 핸들링을 위한 message 문자열 값과 email 문자열 값이 든 객체인데요.

지금까지 만들었던 폼과 useActionState 훅에서는 initialState 값으로 null 값을 넣었습니다.

message 값만 리턴하면 됐기 때문인데요.

여기서는 email 값을 초기값으로 넣어져야 합니다.

왜냐하면 SendOtp 할 때 email 값을 계속 이어서 가져오는 방법이 없기 때문에 redirect 할 때 URL search Params 값으로 email 값을 얻어 오고 있기 때문입니다.

페이지가 리프레시 즉, 새로운 HTTP 리퀘스트(Request)가 일어나면 이전 상태(state)는 모두 사라지는데요.

그래서 우리가 맨 처음 "Send OTP" 할 때 폼에 넣었던 이메일 값은 사라져 버립니다.

새로운 HTTP Request에 의해 이전 Form 상태(state) 값이 사라지는 거죠.

이때를 위한 상태 유지 방법이 바로 redirect 와 URL search params방식입니다.

redirect와 URL Search Params값을 이용해서 아까 Form 에 입력했던 그 이메일 값을 계속 이어서 유지하고 있는거죠.

그래서 위 코드에서 처럼 제일 처음에 Next.js에서 제공해 주는 useSearchParams 훅으로 email 값을 얻어 오고 있습니다.

그래서 useActionState 훅에 initialState 값으로 email 값을 넘겨줘야 하는 거죠.

왜냐하면 useActionState 에 명시된 액션함수인 verifyOtp 액션 함수에서 해당 이메일을 사용할 거기 때문입니다.

이제 verifyOtp 액션 함수를 만들어 봅시다.

```ts
const verifyOtp = async (
  prev: { message: string; email: string },
  formData: FormData
) => {
  console.log(prev);
  const supabase = await createClientForServer();

  const { data, error } = await supabase.auth.verifyOtp({
    email: prev.email,
    token: formData.get("token") as string,
    type: "email",
  });

  if (error) {
    console.log(error);
    revalidatePath("/auth/verify-otp");
    return { message: error.message, email: "" };
  } else redirect("/");
};

export {
...
...
...
...
  verifyOtp,
};
```

참고로 위 코드를 잘 보시면 supabase.auth.verifyOtp 함수에서 token 값을 꼭 string 타입으로 어셜션해야 합니다.

왜냐하면 우리가 얻은 formdata 값에서 token 값은 input 태그에서 number 타입이었는데요.

supabase.auth.verifyOtp 함수에서는 string 타입을 원하기 때문입니다.

그리고 email 값을 지정해 줘야 하는데요.

이 값에 prev.email로 우리가 맨 처음 useActionState 훅에 지정했던 initialState 값인 prev 객체의 email 값을 가져오면 되는 겁니다.

실제 터미널상에서 prev 값을 console.log한 값은 아래와 같이 나오는데요.

```sh
{ message: '', email: 'cpro95@hotmail.com' }
```

우리가 원했던 이메일 값이 제대로 전달되고 있습니다.

이제 브라우저에서 보시면 아래 그림과 같이 브라우저 주소창에 URL Search Params 값으로 이메일이 들어가 있고 화면에는 토큰값을 넣으라고 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEj_6-2bIyowsoOxbt_o_s6aCUhrWbYJNYnRve9VP3TpRR7P3toHDkpe6-AgKfxPnyihIgXcngGrAMzA1Y1wYRyQZLku1mwu4CUTfh4QTkm7_2OogE5T8uQBNsL8DV-1X3Qe2_z9UP6RRPYz8OW5TKNFWGirVEz27WIFZl91_VMSca5fbgQoxAgZbXcuxoQ)

아까 이메일에서 얻었던 토큰 값을 넣으면 아래와 같이 로그인이 성공되는데요.

```sh
{
  data: {
    user: {
      id: '0435e3b9-bbd0-4421-8b4b-088c3b1760c3',
      aud: 'authenticated',
      role: 'authenticated',
      email: 'cpro95@hotmail.com',
      email_confirmed_at: '2025-01-11T09:51:40.911268Z',
      phone: '',
      confirmed_at: '2025-01-11T09:51:40.911268Z',
      recovery_sent_at: '2025-01-19T07:04:05.309845Z',
      last_sign_in_at: '2025-01-19T07:04:21.528063Z',
      app_metadata: [Object],
      user_metadata: [Object],
      identities: [Array],
      created_at: '2025-01-11T09:51:12.767496Z',
      updated_at: '2025-01-19T07:04:21.531613Z',
      is_anonymous: false
    }
  },
  error: null
}
```

브라우저를 보시면 아래와 같이 로그인이 성공된 걸 볼 수 있을 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEju7MJiFYl2RH7QB_S-NAd9QsxJ21Ml88yhCRkYYaCccJbm6IrfhsEgHdjiGPZHAVHvZEX_4PYpJ2o9tb_Ko4MzDgz9_VZKj6Xskm15rlMeshg-BpvxQR4J9uyvG5kcfDPv_HcQVnoawrVBBY33wVcKKLYUaP_Evla_SjL-blRFgpzAJH21k5dRf6Q-xvU)

---

지금까지 OTP 넘버를 이용한 로그인에 도전해 봤는데요.

지난 시간의 매직 링크와 크게 다른 게 없다고 느껴질 정도로 Supabase는 각종 로그인 방법을 지원해 주고 있어 앱을 만들기 아주 쉽다고 느껴지는데요.

다음 시간에 계속 Supabase Auth 관련 글을 이어나가 보도록 하겠습니다.

그럼.

