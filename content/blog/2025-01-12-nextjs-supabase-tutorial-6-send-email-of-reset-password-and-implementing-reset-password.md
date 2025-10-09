---
slug: 2025-01-12-nextjs-supabase-tutorial-6-send-email-of-reset-password-and-implementing-reset-password
title: Next.js 15, Supabase 강좌 6편. 이메일로 Reset Password 링크 보내기와 Update Password 로직 구현하기
date: 2025-01-12 10:07:02.848000+00:00
summary: Next.js와 Supabase를 이용해서 이메일로 Reset Password 링크를 보내고 Update Password 로직도 구현해 봅시다.
tags: ["next.js", "auth", "supabase", "reset password email", "update password", "brevo"]
contributors: []
draft: false
---

** 목  차 **

- [Next.js 15, Supabase 강좌 6편. 이메일로 Reset Password 링크 보내기와 Update Password 로직 구현하기](#nextjs-15-supabase-강좌-6편-이메일로-reset-password-링크-보내기와-update-password-로직-구현하기)
  - [Reset Password 링크 만들기](#reset-password-링크-만들기)
  - [sendResetPasswordForEmail 액션 함수 구현하기](#sendresetpasswordforemail-액션-함수-구현하기)
  - [이메일 템플릿 수정하기](#이메일-템플릿-수정하기)
  - [confirm 라우팅 로직에 redirectTo 추가하기](#confirm-라우팅-로직에-redirectto-추가하기)
  - [update-password 페이지 만들기](#update-password-페이지-만들기)
  - [updatePassword 액션 함수 작성하기](#updatepassword-액션-함수-작성하기)
  - [최종 테스트](#최종-테스트)
  - [update-password 페이지를 updatePasswordForm으로 다시 만들기](#update-password-페이지를-updatepasswordform으로-다시-만들기)

---

안녕하세요?

Next.js 15, Supabase 강좌 6편입니다.

아래는 지금까지의 강좌 리스트 전체입니다.

[Next.js 15, Supabase 강좌 1편. 유저 인증(Auth)을 위한 Next.js 15와 Supabase 템플릿 만들기](https://mycodings.fly.dev/blog/2024-12-29-nextjs-supabase-tutorial-1-making-template-and-omit-middleware)


[Next.js 15, Supabase 강좌 2편. Google OAuth를 이용한 로그인 구현](https://mycodings.fly.dev/blog/2025-01-01-nextjs-supabase-tutorial-2-login-with-google-id-oauth)

[Next.js 15, Supabase 강좌 3편. Github OAuth를 이용한 로그인 구현](https://mycodings.fly.dev/blog/2025-01-01-nextjs-supabase-tutorial-3-login-with-github-id-oauth)

[Next.js 15, Supabase 강좌 4편. email, password를 이용한 로그인 구현](https://mycodings.fly.dev/blog/2025-01-04-nextjs-supabase-tutorial-4-login-with-email-and-password-and-useactionstate)

[Next.js 15, Supabase 강좌 5편. 도메인 없이 Supabase에서 컨펌 이메일 보내기
](https://mycodings.fly.dev/blog/2025-01-11-nextjs-supabase-tutorial-5-sending-confirm-email-without-domain)

---

지난 시간에는 Supabase에서 제공해 주는 옵션인 Confirm email 기능을 Brevo와 함께 구현했는데요.

하루에 300건이면 소규모 앱에서는 충분히 무료로 사용할 수 있는 수준일 겁니다.

이와 이메일 기능을 켰으니까 Supabase에서 제공해 주는 Reset Password 기능도 함께 알아 보겠습니다.

Reset 패스워드 기능은 패스워드를 잊어버린 유저에게 패스워드를 새로 입력할 수 있게 이메일로 갱신 링크를 보내주는 기능인데요.

이 기능을 구현하기 위해서는 2가지를 만들어야 합니다.

첫 번째는 Reset Password 링크에 따라 이메일을 보내는 기능이고, 두 번째는 이메일에서 링크를 타고 들어왔을 경우 패스워드를 리셋 즉, 새로 입력하는 UI를 만들어서 패스워드를 갱신하는 로직을 구현해야 합니다.

---

## Reset Password 링크 만들기

먼저, 우리가 만든 로그인 라우팅인 "/auth/signin"에 Reset Password 링크를 넣겠습니다.

Reset Password는 "/auth/reset" 라우팅에서 구현하겠습니다.

"/auth/signin" 라우팅의 SignInForm을 불러와서 간단하게 "/auth/reset"으로 가는 링크만 넣겠습니다.

```ts
"use client";

import { signinWithEmailPassword } from "@/utils/supabase/actions";
import Link from "next/link";
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
      // 아래가 추가한 부분
      <Link className="underline" href="/auth/reset">
        Forgot password?
      </Link>
      {error && <span>{error.message}</span>}
    </form>
  );
};

export default SignInForm;
```

UI를 수정했으면 아래와 같이 "Forgot password?" 링크가 보일 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhCBrq3Om3lVckf_dP1ilZOAG9u9lR9O6B4j4X7If9kVON0wJgZ5w44u5y1qWoD1a9wMG7UJhATBKIADk47gtHv58wwkqlCMflVihEMeoj9pJds3zbpZO4ax6_jz-KodAMTYieuxsy23RsWApGfzKQ_NLjFoqQZlduQzzGNiSbuj1XTKynKpkkMTVYjkYM)

"Forgot password?" 링크를 누르면 라우팅이 "/auth/reset"으로 이동합니다.

이제 이 페이지를 만들어야 하는데요.

'src/app/auth/reset' 폴더를 만들고 page.tsx 파일을 아래와 같이 만듭시다.

```ts
import ResetPasswordForm from "@/components/Forms/ResetPasswordForm";
import Link from "next/link";

const ResetPasswordPage = () => {
  return (
    <div className="flex flex-col gap-2 p-8">
      <Link href="/auth" className="underline">
        Go to Auth Page
      </Link>
      <h1>Reset Password</h1>
      <ResetPasswordForm />
      <Link href="/auth/signin" className="underline">
        Go to Sign In Page
      </Link>
    </div>
  );
};

export default ResetPasswordPage;
```

위와 같이 reset 라우팅에 대한 페이지를 만들었으면 ResetPasswordForm을 만들어야 하는데요.

'components/Forms' 폴더 밑에 ResetPasswordForm.tsx 파일을 만듭시다.

```ts
"use client";

import { sendResetPasswordForEmail } from "@/utils/supabase/actions";
import { useActionState } from "react";

const ResetPasswordForm = () => {
  const [state, formAction, isPending] = useActionState(
    sendResetPasswordForEmail,
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

      <button disabled={isPending} className="border rounded px-2.5 py-2">
        {isPending ? "Processing" : "Reset Password"}
      </button>
      {state && <span>{state.message}</span>}
    </form>
  );
};

export default ResetPasswordForm;
```
아래와 같이 UI를 완성했습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgEZ9zqx02BQc6xgAh069tOWPOimf44Ka32_SBPtMyQbuSVJN64G8oUs3CRs8vik3eYf3sjlXT12nwu36ONZ3m6XflIP5XKf2Pi55vYxp_5K0qg02EbtwvFHT1TkZuwzsi36zRP5af9OBt9gRzlkY1r7Ne0x_uWSQxkLy-58MjSAqPEn41d0Ve8tQpyhbI)

---

## sendResetPasswordForEmail 액션 함수 구현하기

이제 sendResetPasswordForEmail 액션 함수를 만들어서 로직을 구현하면 됩니다.

'utils/supabase' 폴더에 있는 actios.ts 파일이 우리가 액션 함수를 저장해 놓은 곳인데요.

이곳에 아래와 같이 sendResetPasswordForEmail라는 서버 액션 함수를 작성합시다.

```ts
const sendResetPasswordForEmail = async (prev: any, formData: FormData) => {
  const supabase = await createClientForServer();

  const { data, error } = await supabase.auth.resetPasswordForEmail(
    formData.get("email") as string
  );

  if (error) {
    console.log(error);
    revalidatePath("/auth/reset");
    return { message: error.message };
  } else return { message: "Please check your email!" };
};

export {
  signInWithGoogle,
  signInWithGithub,
  signOut,
  signupWithEmailPassword,
  signinWithEmailPassword,
  sendResetPasswordForEmail,
};
```

이제 테스트를 해 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEgqW9gSuugqxflLWAF5xkfWoSnvozVpvhsnzwt4iXDPgoU-WegPnYBQnyGNk5dm5fLy8NgLmxevZxhAsDyQxAfTtWGSor73-Sz53PolH0UpT2uigP0XsykMSmnQdjm9t5ZQLDl8ZnkRf981YLtqnBxGm21ItSIKA2247WN5I9wUeio8xEEKy9NFW82h_fQ)

위와 같이 "Please check your email!" 문구가 보이는 걸로 봐서 sendResetPasswordForEmail 액션 함수가 성공적으로 작동했다는 뜻입니다.

그리고 메일함을 열어보면 아래와 같이 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEieP8QOCDJ49IARMESGInrQF5TIkS3wdJ-vOlYiAjEL9anKeoX2Fs5sL91g20KYH28WIBcSev72J8qg06GJ-CSml63ZKp5aQh6Hd2OnCSFhwnOslL654vLCgvuti9mh7fkr4K-smXAzGvrvJTGm2_Zy9o8extA5mm_EPYo8fBeIY43ID1ApFDQk9ww029c)

위 링크를 눌러 볼까요?

링크를 누르면 브라우저에서 아래와 같이 나오는데요.

뭔가 잘못된 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgZkeqHTCIGdS-BkcAAXBHcmhwpI-oX8AL0ZvWRDcoWHskwMf0nKVHpCkU9GuQwp-Id_Y0PkBTc_62KafcAcOpqMg1ZYgDLVe4Ukq0vHOBTGtd5V6wfwiPic0pqh-CvS7owLriT8r9SPWjd9NV4O2Wxz42ULznxnyV7-w1Iq0Ud4gmLGX_kaMgVvV-VadY)

---

## 이메일 템플릿 수정하기

Reset Password 에 해당하는 이메일 템플릿을 수정해야 합니다.

Supabase 대시보드의 Email Templates 부분으로 갑시다.

그러면 Reset Password 부분에 아래와 같이 나오는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhmr4Pi1V3gOGl1-U3SoJ45o64Yjt0pNfB2G5aVZTLUeF9sqM1jDbocJQMAjYc8fhuFyTx7dNbYGru2o7jz6IpEoEjll1tU-yanErr7O7MTXVuD6WWmvgMixbsZ2Oq5bAYP3F4iOAepD2ZsICBsAFEQx41CF2H5eaDEhHuyp55Ju7WDKlQJ20qEszgoT7c)

```ts
<h2>Reset Password</h2>

<p>Follow this link to reset the password for your user:</p>
<p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>
```

서버사이드 렌더링을 직접 구현하는 경우 위와 같이 하면 안 되고 아래와 같은 템플릿을 넣어줘야 합니다.

아래 템플릿은 Supabase Doc 공식 문서에서 Password-based 부분의 Reset Password 부분에서 가져온 겁니다.

```ts
<h2>Reset Password</h2>

<p>Follow this link to reset the password for your user:</p>
<p>
  <a
    href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/account/update-password"
    >Reset Password</a
  >
</p>
```

위의 이메일 템플릿을 보시면 기존에 만들었던 confirm 라우팅에 토큰 해시값을 줘서 지금의 Request가 우리가 보낸 리퀘스트가 맞다고 검증하고 그다음으로 next 부분에 다음으로 이동할 경로를 지정해 줬는데요.

다음으로 이동할 경로는 "update-password" 경로입니다.

이 "update-password" 경로에서 패스워드를 새로 넣는 form을 넣으면 됩니다.

그러면 경로를 우리가 현재 쓰고 있는 경로로 바꾸겠습니다.

```ts
<h2>Reset Password</h2>

<p>Follow this link to reset the password for your user:</p>
<p>
  <a
    href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/auth/reset/update-password"
    >Reset Password</a
  >
</p>
```

저는 경로를 "/auth/reset/update-password" 경로로 바꿨습니다.

그리고, 위 템플릿을 Supabase 대시보드에서 이메일 템플릿에 저장합니다.

꼭 밑에 "Save" 버튼을 눌러 저장해야 합니다.

---

## confirm 라우팅 로직에 redirectTo 추가하기

여기서 중요한 점은 confirm 라우팅을 조금 수정해야 하는데요.

기존에 만들었던 confirm 라우팅의 route.ts 파일에는 redirectTo 를 처리하는 로직이 없었습니다.

아래와 같이 다시 수정합시다.

'/src/app/auth/confirm/route.ts' 파일입니다.

```ts
import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

import { createClientForServer } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";
  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;

  if (token_hash && type) {
    const supabase = await createClientForServer();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      // redirect user to specified redirect URL or root of app
      return NextResponse.redirect(redirectTo);
    }
  }

  // redirect the user to an error page with some instructions
  redirect("/auth/auth-code-error");
  return NextResponse.redirect(redirectTo);
}
```

redirectTo로 라우팅을 이동하는 로직이 추가된 겁니다.

---

## update-password 페이지 만들기

마지막으로 "/auth/reset/update-password" 이 경로에 해당하는 페이지를 또 만들어야 합니다.

reset 폴더 밑에 'update-password' 폴더를 만들고 그 밑에 또 page.tsx 파일을 만듭시다.

```ts
"use client";

import { updatePassword } from "@/utils/supabase/actions";
import { useActionState } from "react";

const UpdatePasswordPage = () => {
  const [state, formAction, isPending] = useActionState(updatePassword, null);
  return (
    <form action={formAction} className="flex flex-col gap-2 max-w-40">
      <input
        className="border rounded px-2.5 py-2 text-gray-700"
        type="password"
        name="password"
        placeholder="password"
      />

      <button disabled={isPending} className="border rounded px-2.5 py-2">
        {isPending ? "Processing" : "Update Password"}
      </button>
      {state && <span>{state.message}</span>}
    </form>
  );
};

export default UpdatePasswordPage;
```

이제 테스트를 해볼까요?

Reset Password 버튼을 눌러 이메일을 송부한 다음 이메일을 클릭하면 아래와 같이 나올 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhwwLsT2z0lhUvy1T7KxSY5ZF0T450bWaC_7iHp0Fsu1CA88hweNmddcq8dvTfm8Wfs7SsB6WUlruLLxH7GLVZSfc9tMIA1McElXpkPYYn1Q6qwkpF9SlpvJipSpH6JdJZ9iutiDrO0X1kfikwgvdpR08bk5g8ae8wyb_a4Il6eD-oXaV88Q6Cka42O08k)

updatePassword 액션 함수만 있으면 제대로 작동한다고 볼 수 있는데요.

---

## updatePassword 액션 함수 작성하기

이제 다시 actions.ts 파일에 아래와 같이 updatePassword 함수를 추가합시다.

```ts
const updatePassword = async (prev: any, formData: FormData) => {
  const supabase = await createClientForServer();

  const { data, error } = await supabase.auth.updateUser({
    password: formData.get("password") as string,
  });

  if (error) {
    console.log(error);
    revalidatePath("/auth/reset");
    return { message: error.message };
  } else return { message: "Password updated!" };
};

export {
  signInWithGoogle,
  signInWithGithub,
  signOut,
  signupWithEmailPassword,
  signinWithEmailPassword,
  sendResetPasswordForEmail,
  updatePassword,
};
```

---

## 최종 테스트

이제 다시 테스트를 위해 Reset Password 이메일을 보내봅시다.

이메일에서 링크를 누르면 아래와 같이 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjvIUGWn-Ng4YU_ZhEdeZbKCKgllTvZEzuC1R8PUh9R2qwwr_yolN6aTUZPD5EEnpDc3BEE8KVa4bakl7MXu1mHrR3C5ZYsdqdO6mYh5rMcsI4uVYtitIEwm9NaDcGy7C6qGC5WqgJZ61S8LIpfoyDSrq5mBPE0-xNGuLohtAriIzgnHpAY5AOyWM2rFbA)

UI를 너무 못 만들었네요.

테스트니까 이해해 주시기 바랍니다.

위에서 패스워드를 새로 바꿔 봅시다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEh2fJb-_4UEJLv0TjR5p-EpjKViaGwVFGiZoOJIdfOQnOky1v_dlK8w1Ft1GYl-ugvyHZ3OvtfAXE6RxAkuYCBVMDAeLQYrAhAWlouC21OKmpFmK_e_Gb8Ens7-YsXRTazwsDRvr5asdrL8H3dwvAYYAWc3_xe9tliGu_tf9KC9ePwUXRRdcS1k0I93nyk)

위와 같이 잘 나옵니다.

---

## update-password 페이지를 updatePasswordForm으로 다시 만들기

잘 보시면 update-password 페이지가 너무 이상한데요.

제가 실수했습니다.

현재 update-password 폴더에 있는 page.tsx 파일을 UpdatePasswordForm 다시 저장하고 이 Form 파일을 불러오는 형식으로 UI를 수정하는 게 맞을 거 같습니다.

UpdatePasswordForm은 아래와 같이 작성하고,

```ts
"use client";

import { updatePassword } from "@/utils/supabase/actions";
import { useActionState } from "react";

const UpdatePasswordForm = () => {
  const [state, formAction, isPending] = useActionState(updatePassword, null);
  return (
    <form action={formAction} className="flex flex-col gap-2 max-w-40">
      <input
        className="border rounded px-2.5 py-2 text-gray-700"
        type="password"
        name="password"
        placeholder="password"
      />

      <button disabled={isPending} className="border rounded px-2.5 py-2">
        {isPending ? "Processing" : "Update Password"}
      </button>
      {state && <span>{state.message}</span>}
    </form>
  );
};

export default UpdatePasswordForm;
```

update-password/page.tsx 파일은 아래와 같이 작성합니다.

```ts
import UpdatePasswordForm from "@/components/Forms/UpdatePasswordForm";
import Link from "next/link";

const UpdatePasswordPage = () => {
  return (
    <div className="flex flex-col gap-2 p-8">
      <Link href="/auth" className="underline">
        Go to Auth Page
      </Link>
      <h1>Update Password</h1>
      <UpdatePasswordForm />
      <Link href="/" className="underline">
        Go to Home
      </Link>
    </div>
  );
};

export default UpdatePasswordPage;
```

이제 테스트를 다시 진행하면 아래와 같은 UI를 가지게 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEi3g4gv6MXNBDAro6lgbyvi3TSdAPyKc9Xsx5aljTrHpHvv_Q1DHlLO5Y4uM-qPRv74YwMi4TixpT2aFjGnF3BPa1Q-fqEDhSCRhhfpxro_j-Ymx-2Ich4YN8HVo3AYIkX0iljkLSrXPggahO1LmJLhhoYrGbWRxBr-m7VI6OXFPIyIwMBsClHBgTg3Qs4)

![](https://blogger.googleusercontent.com/img/a/AVvXsEgTL6DWYKo5Mj-ZZtmXKbfYqGM61hZD34mvA1cfpqJlaTScbbT55UVUx2_j6jXkmMuW5EwFjnZ-b3zdG_oGLlR2cXHstOq7_AlRZqYmbOLR9EcAzqHoCpgS-Aid3eDIcf-EDSj7_UAr4eCsR_uR2ZofqBryO3P2M9JVizSMm5oSR5_a0IfiBYmhp7i5lR8)

![](https://blogger.googleusercontent.com/img/a/AVvXsEgLa-2e5IuRxJUHzlqGkOLX5h-joM5n9bLK7YbckpTpD6LOi5uxa7niKFFsAxvCHOORx3ykiGNJdH6MiNeF-i87zzw-djlZp7cDg7o7BDhzI49a-X7RfDU2PlHONPyMOhrEo-oY2Pe6psFGe3XmQucsNn2offqTpl61iBpILOdXpQwIulUQ2AHmoI2KlUY)

Next.js 15에서 클라이언트 컴포넌트, 그리고 Form을 어떻게 사용하는지 감이 오는 거 같네요.

그럼 다음시간에 뵙겠습니다.

끝.
