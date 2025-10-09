---
slug: 2025-01-13-nextjs-supabase-tutorial-7-send-magic-link-and-login-with-supabase-brevo
title: Next.js 15, Supabase 강좌 7편. 이메일로 Magic Link를 보내서 로그인 구현하기
date: 2025-01-13 13:04:38.830000+00:00
summary: Next.js와 Supabase를 이용해서 이메일로 Magic Link를 보내서 로그인하는 방법을 구현해 봅시다.
tags: ["next.js", "auth", "supabase", "magic link", "brevo"]
contributors: []
draft: false
---

** 목 차 **

- [Next.js 15, Supabase 강좌 7편. 이메일로 Magic Link를 보내서 로그인 구현하기](#nextjs-15-supabase-강좌-7편-이메일로-magic-link를-보내서-로그인-구현하기)
  - [Supabase 이메일 템플릿 수정하기](#supabase-이메일-템플릿-수정하기)
  - [Magic Link Login 링크 만들기](#magic-link-login-링크-만들기)
  - [signInWithMagicLink 액션 함수 구현](#signinwithmagiclink-액션-함수-구현)

---

안녕하세요?

Next.js 15, Supabase 강좌 7편입니다.

아래는 지금까지의 강좌 리스트 전체입니다.

[Next.js 15, Supabase 강좌 1편. 유저 인증(Auth)을 위한 Next.js 15와 Supabase 템플릿 만들기](https://mycodings.fly.dev/blog/2024-12-29-nextjs-supabase-tutorial-1-making-template-and-omit-middleware)

[Next.js 15, Supabase 강좌 2편. Google OAuth를 이용한 로그인 구현](https://mycodings.fly.dev/blog/2025-01-01-nextjs-supabase-tutorial-2-login-with-google-id-oauth)

[Next.js 15, Supabase 강좌 3편. Github OAuth를 이용한 로그인 구현](https://mycodings.fly.dev/blog/2025-01-01-nextjs-supabase-tutorial-3-login-with-github-id-oauth)

[Next.js 15, Supabase 강좌 4편. email, password를 이용한 로그인 구현](https://mycodings.fly.dev/blog/2025-01-04-nextjs-supabase-tutorial-4-login-with-email-and-password-and-useactionstate)

[Next.js 15, Supabase 강좌 5편. 도메인 없이 Supabase에서 컨펌 이메일 보내기
](https://mycodings.fly.dev/blog/2025-01-11-nextjs-supabase-tutorial-5-sending-confirm-email-without-domain)

[Next.js 15, Supabase 강좌 6편. 이메일로 Reset Password 링크 보내기와 Update Password 로직 구현하기](https://mycodings.fly.dev/blog/2025-01-12-nextjs-supabase-tutorial-6-send-email-of-reset-password-and-implementing-reset-password)

---

지난 시간에는 외부 이메일 서비스인 Brevo와 연결하여 Confirm email 기능도 구현했고, 또 Reset Password 이메일을 보내 패스워드를 다시 세팅할 수 있는 기능도 구현했는데요.

오늘은 그와 비슷하게 매직 링크를 보내 로그인할 수 있도록 하는 기능을 구현해 보겠습니다.

먼저, 이메일을 입력할 수 있는 Form과 매직 링크를 보낼 수 있는 서버 액션 함수만 만들면 됩니다.

왜냐하면 이전에 만들었던 confirm 라우팅 핸들러가 알아서 로그인을 구현해 주기 때문입니다.

## Supabase 이메일 템플릿 수정하기

역시나 이번에도 이메일 템플릿을 수정해야 하는데요.

Supabase 대시보드에서 이메일 템플릿을 보면 Magic Link 칸에 아래와 같이 디폴트 템플릿이 있을 겁니다.

아래 디폴트 템플릿으로는 토큰 처리가 안 되기 때문에 Supabase 공식 튜토리얼에서 서버 사이드로 제공하는 템플릿을 넣어야 합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiBVuDx8WZX4-bVllknAZuiWMTXC7gbmWGF4ttVKd7E9DWMha3C70BBtmSVyAXCoqo3ZTnRuvSTpDOTxW_VYMIq0vKA7bGGHxPDulTQGrbKXotIh3O981myvyWMtxh4MnwWhvvRzLElHRoG_FX9h6oWGOKCh_ns7vpaS87Lr59adNY26nhH-KiqjnSknDs)

위와 같이 되어 있는 Magic Link 칸의 템플릿에 아래 코드를 넣습니다.

```js
<h2>Magic Link</h2>

<p>Follow this link to login:</p>
<p><a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=magiclink">Log In</a></p>
```

위 코드를 보시면 기존에 만들었던 "/auth/confirm" 라우팅 주소가 토큰 해시값을 처리합니다.

토큰 해시값을 처리할 때 type은 magiclink 라고 주어져 있네요.

아래와 같이 입력하고 "Save" 버튼을 눌러 저장합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiCTTLH9muyblV8F-pHEW_P0Da2AYdkJaCr7-bm7WDGiTl1V0ySUNtrHuvJ4NKSNX3ftX9K0oQC9ARZyH3NrT93VUZQdR0tFwYIR7aZ3eWjydwF4wywHdOy7ZvKsROJg5nGgTwrN44dJSZRWhQjv6zFVIufvKO5uRMKTt8cVdNXHrWihopvTJpDSByrV1c)

---


## Magic Link Login 링크 만들기

먼저, 'auth' 폴더 밑에 있는 page.tsx 파일을 열어 아래 AuthPage 컴포넌트에 Magic Link Login 링크를 아래와 같이 추가합니다.

```ts
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

      <AuthForm />
    </div>
  );
};

export default AuthPage;
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEj7dLdPEbbdy3bwgEMpAFKUzPnVXwOGiQ5RxdvcTIQf-A27EgXbrWQbcIT4AMg_YbxnZEWi6TU55XA2oqTXS56iNMESzxPQwBrVAPQ3QY2Z2ebOfPPkr4rNjBEW7yeNvfH4wFfvUUgEtMjhc3in6gpLadbD1uE-a8yvFcXDVLpZYYzaKfLEoh-2yOexmEo)

이렇게 하면 로그인 화면에서 쉽게 매직 링크 로그인에 접근할 수 있습니다.

매직 링크 로그인의 라우팅 주소는 '/auth/magic'으로 설정했습니다.

그래서 'auth' 폴더 밑에 'magic' 폴더를 만들고 그 밑에 page.tsx 파일을 만듭시다.

```ts
import MagicLinkForm from "@/components/Forms/MagicLinkForm";
import Link from "next/link";

const MagicLinkPage = () => {
  return (
    <div className="flex flex-col gap-2 p-8">
      <Link href="/auth" className="underline">
        Go to Auth Page
      </Link>
      <h1>Magic Link Sign In</h1>
      <MagicLinkForm />
      <Link href="/auth/signup" className="underline">
        Go to Sign Up Page
      </Link>
    </div>
  );
};

export default MagicLinkPage;
```

위 코드를 보시면 MagicLinkForm이 있는데요.

저번에 만들었던 ResetPasswordForm을 그대로 이용하면 됩니다.

```ts
"use client";

import { signInWithMagicLink } from "@/utils/supabase/actions";
import { useActionState } from "react";

const MagicLinkForm = () => {
  const [state, formAction, isPending] = useActionState(
    signInWithMagicLink,
    null,
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
        {isPending ? "Processing" : "Send Magic Link"}
      </button>
      {state && <span>{state.message}</span>}
    </form>
  );
};

export default MagicLinkForm;
```

위 코드를 보시면 signInWithMagicLink 액션 함수가 보이는데요.

이 함수만 actions.ts 파일에서 구현하면 됩니다.

---

## signInWithMagicLink 액션 함수 구현

```ts
const signInWithMagicLink = async (prev: any, formData: FormData) => {
  const supabase = await createClientForServer();

  const { data, error } = await supabase.auth.signInWithOtp({
    email: formData.get("email") as string,
  });

  if (error) {
    console.log(error);
    revalidatePath("/auth/magic");
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
  updatePassword,
  signInWithMagicLink,
};
```

위와 같이 만들면 됩니다.

Supabase에서는 매직링크 관련 함수는 signInWithOtp인데요.

Otp는 다음 시간에 알아보겠습니다.

테스트를 위해 이메일 주소를 입력하고 버튼을 누르면 아래와 같이 "Please check your email" 문구가 정상적으로 보일 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjU3SEbkYVXofv-bXViPdg0lH5FaAuLRWOS2DW4CtQhNj-5dkJ6L6udhwYjgMryFqJsyogs-TWZtuTvreyLs0DxidFq6tsaJna5Qrw0kLsGP9p7EHCpAI_BK2ACT2aXVR0fQUdZHBzACrg_0wNS39b047iz6lFPA1f1w606qTqtvtzkEkgscr_08hWB0K0)

그리고 나서 이메일에서 확인해 보면 아래와 같이 정상적으로 이메일이 온게 보일텐데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiTMz-zfOmXavO2mKNsvrKg3kBrQS5h6OBWdILNFmEsvX1YEhwMLrf7C1r1Dyhw2HDGKy-GjsHnFHWbL_OXJhOqPCwAxyhucTGSEL1Te0nWwoPyEkbACfBoVZsdLskdenAGDUvtf1hbPzIwTMx2M69gqJL2rpdWAD_TaOEgw0KryIgh9W4jfQgylrHw4FA)

이메일에 있는 "Log in" 버튼을 눌러봅시다.

그러면 브라우저로 바뀌면서 로그인이 되는데요.

아래와 같이 성공할 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEi41lrpBklkaYtwC_qUPi6SiINvNtvtLIk2JTZhWmO5l7XUeFcLT2ZokR74bY6VSlbynQ9Rv0zCqtH1j2E8juRZpw4V6EwnS30TKdio2RZPk9aWI_W-t9QuEZPTLxDoAj7YFfXF52Ne_Ay4dOnYVwZVleXJALkuM5ouJkdwIeRRPLlPrwv2lpLkro8lgJE)

위 브라우저 주소를 잘 보시면 아래와 같은 주소값이 주소창에 보일건데요.

```sh
http://localhost:3000/?token_hash=pkce_5f533f0cdf0997abbec22308833bedc199fbd579794008bc8784cfee&type=magiclink
```

토큰 해시와 magiclink 값이 잘 보입니다.

여기서 토큰 해시값을 처리하는 거는 아까 이메일 템플릿에 있었던 confirm 라우팅인데요.

지난 시간에 만들었던 아래 confirm 라우팅 핸들러 때문입니다.

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

위 GET 핸들러가 바로 Supabase의 토큰 해시를 처리해 주는 핸들러입니다.

위 핸들러 코드를 잘 보시면 중간에 supabase.auth.verifyOtp 함수가 보이는데요.

이 함수에 type, token_hash 값을 넣어 작동시키고 있는 게 보일 겁니다.

지금까지 Magic Link를 이용한 로그인을 구현해 봤는데요.

다음 시간에는 Otp를 이용한 로그인에 도전해 보겠습니다.

그럼.
