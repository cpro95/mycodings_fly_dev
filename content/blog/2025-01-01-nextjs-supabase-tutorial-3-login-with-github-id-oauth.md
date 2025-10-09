---
slug: 2025-01-01-nextjs-supabase-tutorial-3-login-with-github-id-oauth
title: Next.js 15, Supabase 강좌 3편. Github OAuth를 이용한 로그인 구현
date: 2025-01-01 12:08:31.499000+00:00
summary: Next.js와 Supabase를 이용해서 Github OAuth를 이용해서 로그인을 테스트해 보겠습니다.
tags: ["next.js", "auth", "github oauth", "supabase", "login"]
contributors: []
draft: false
---

** 목  차 **

- [Next.js 15, Supabase 강좌 3편. Github OAuth를 이용한 로그인 구현](#nextjs-15-supabase-강좌-3편-github-oauth를-이용한-로그인-구현)
  - [Github Developer Settings에서 OAuth Apps 설정](#github-developer-settings에서-oauth-apps-설정)
  - [actions.ts 파일에 Github 관련 코드 넣기](#actionsts-파일에-github-관련-코드-넣기)
  - [AuthForm에 Github 로그인 버튼 추가하기](#authform에-github-로그인-버튼-추가하기)

---

안녕하세요?

Next.js 15, Supabase 강좌 3편입니다.

지난 시간에는 Next.js 15를 이용한 기본적인 템플릿과 Google OAuth를 이용한 로그인을 구현해 봤는데요.

오늘은 개발자라면 가장 많이 쓰는 Github OAuth를 이용한 로그인을 구현해 보겠습니다.

참고로, 지난 시간 강좌 리스트입니다.

[Next.js 15, Supabase 강좌 1편. 유저 인증(Auth)을 위한 Next.js 15와 Supabase 템플릿 만들기](https://mycodings.fly.dev/blog/2024-12-29-nextjs-supabase-tutorial-1-making-template-and-omit-middleware)


[Next.js 15, Supabase 강좌 2편. Google OAuth를 이용한 로그인 구현](https://mycodings.fly.dev/blog/2025-01-01-nextjs-supabase-tutorial-2-login-with-google-id-oauth)

---

## Github Developer Settings에서 OAuth Apps 설정

Github 관리자 페이지에 들어가 보면 아래 그림처럼 맨 마지막에 Developer Settings 가 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgcVXmBbzZJ1AkZETydU_jMyqoFgfzz4Vfjaw4urCauSijDDiGnX6CdtJpfipcaOnu8oCFaD0gGueHqCEJSN9zV5pjiFvTCagP7d0AlSEs4crl2_Cp3s8VNCOyoP9lnhzKJ2n90aC9lpAFL5FdnJWa4ReXOdzT_hQbpAOWW3igccf9ciEh3c3C5NoDb80g)

"Developer Settings"를 클릭하면 아래 그림과 같이 3가지나 나오는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiOWXcw4mZYBFZJXNzhHFzYERBq7l8isoaCIcZFTQjyf8krLAzyZLb3S5Ic1LeKKUIM3A7CMPIViCAJfaIRlvdaIPczmCbkSMZKVaP0PwMLg5s7NBKp8fC8oDOUv6AXkfdDK3_qD-OM08AyFOaYyO5RE4AtuQ_H8x0OJbSudlTjVgOC_uYqN4UDhtWNMeA)

우리는 두 번째인 OAuth Apps 설정이 필요합니다.

"OAuth Apps"를 누르면 여러 가지 입력칸이 아래와 같이 나오는데요.

일단 아래와 같이 입력하면 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgjxpkir7jL68v_YQsuA-DmOacUHIp_INOXIyzUbp0YDDhdxp1yFYfPGKE-T6YaRFG_qHKxhlg7GXQXEwHRxtWsUR3uH_BEPmMeRPnhaN5R7-X2sTKIMcKSc1RIrZ0iYI2Fjyx0xVTwFdQ9GBJJsueE1UaGIoLdi2mBFj2g9D4TwO1jcXtSbaS_KVeWcdo)

여기서 중요한 게 마지막에 있는 'Authorization callback URL'을 넣어야 하는데요.

이거는 지난 두 번의 강의에서 계속 입력했던 그거입니다.

Supabase 대시보드로 가서 Authentication 부분에서 Providers 부분으로 가면 예전에는 Email과 Google 부분을 "Enabled"해서 사용했었는데 아래처럼 Github 부분을 눌러봅니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhPVHISRXb7O6UcR4k_Kj3w2jk-3CDEr9R-89LkF2H5Hc1QnRS-RASsMCLlwB6LBAnWdxyY8gar-XwxGWbzVOSqLC5zQPIFzZXSv9IsIIA2kR4D0fs1yt8aw8sq9TMoVd6KUa6Csa1epv1vlsuiOr_1Spf4z9EpIPneQSmNC3rahTUSmdnSgmm-czsSYoM)

일단 "Github enabled"를 눌러 활성화해줍시다.

그리고 마지막에 있는 callback url을 복사해서 Github Developer Settings 부분 쪽 'Authorization callback URL'에 넣으시면 됩니다.

이제 Github 쪽에서는 설정이 끝났습니다.

그래서 아래쪽에 있는 'Register Application'을 누르면 아래와 같이 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiMV8BZ_y6uKu1-DoEY9p5CrX319z7kOGmxvNgqDSBVQW6NJBzK0Hrpzulin3KzKWbVaPU8MmyX34AweZh53egMY56Sjr_Qr9kk9U5_oQNlWSNJ8j3vCoaQtmxCkW5bwOnM3zJg6_yaRDcUnvL-31BKDkMdZsZrYmDEvU0bNW9adfx5Kzmjc84NpoOA5ms)

여기서 필요한 게 'Client ID'와 'Client Secrets'입니다.

'Client ID'는 나와있는 걸 복사해서 Supabase 쪽에 복사해서 넣으면 되고,

'Client Secrets'는 'Generate a new client secret'를 누르면 아래처럼 나오는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiwjacv4_bnJ3NngYPNvsjGVY2PYThNuIFCq05jEyITsp4wQafNnxmAwO4XzvM-qnCtopO9VkOuZCsVjn4YgFELsi2KnhFFyn6Uhc4pTs8eIab4tmUHV_x9OLHM79ZMb3hVVrTQMyspvipIeemazFfIgRRFio8rmO3wr27S-o__IEzPcgAwPy7uIgFypJs)

이걸 복사해서 Supabase 대시보드의 Github 부분에 넣으시면 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEg5EezQoVXjqVqWGOK3_WnZ5zeMxow2FCz_pbZ24hYySV5EPw4SedXFYAa4GM3WL2VLRcEOz9HnIPJmx9fsxVo9vC02y4mSKKwLzZ_e6Yb6ea3KIrEuDhxfoa0usfkUC74x46teVGAU7aZ6qwPhzRdK8PRwCrfNSK-Flk7QQ1yvi7Ht0J_YHINC3k84HDg)

위 그림과 같이 다 넣으시고 마지막에 있는 'Save' 버튼을 누르면 완성됩니다.

---

## actions.ts 파일에 Github 관련 코드 넣기

지난 시간까지 만들었던 actions.ts를 보시면 아래와 같습니다.

```ts
"use server";

import { Provider } from "@supabase/supabase-js";
import { createClientForServer } from "./server";
import { redirect } from "next/navigation";

const signInWith = (provider: Provider) => async () => {
  const supabase = await createClientForServer();

  const auth_callback_url = `${process.env.SITE_URL}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: auth_callback_url,
    },
  });

  console.log(data);

  if (error) {
    console.log(error);
  }

  redirect(data.url as string);
};

const signInWithGoogle = signInWith("google");

const signOut = async () => {
  const supabase = await createClientForServer();
  await supabase.auth.signOut();
};

export { signInWithGoogle, signOut };
```

위 코드를 자세히 잘 보시면 signInWith 함수가 범용함수가 됩니다.

그래서 아래와 같이 코드를 추가하면 아주 쉽게 signInWithGithub 함수가 완성됩니다.

왜냐하면 Google이나 Github이나 모든 OAuth 2.0 표준을 따르기 때문에 Supabase도 똑같은 함수인 'signInWithOAuth'를 사용합니다.

```ts
const signInWithGoogle = signInWith("google");
const signInWithGithub = signInWith("github");

const signOut = async () => {
  const supabase = await createClientForServer();
  await supabase.auth.signOut();
};

export { signInWithGoogle, signInWithGithub, signOut };
```

위와 같이 하면 모든 게 마무리되었습니다.

이제 AuthForm에 Sign in with Github 버튼만 만들면 되는데요.

다른 로직은 Google과 모두 똑같습니다.

---

## AuthForm에 Github 로그인 버튼 추가하기

이 부분은 아주 간단합니다.

UI만 추가하면 됩니다.

```ts
"use client";

import { signInWithGithub, signInWithGoogle } from "@/utils/supabase/actions";

const AuthForm = () => {
  return (
    <form className="flex flex-col items-start gap-2">
      <button
        formAction={signInWithGoogle}
        className="border rounded px-2.5 py-2"
      >
        Sign in with Google
      </button>
      <button
        formAction={signInWithGithub}
        className="border rounded px-2.5 py-2"
      >
        Sign in with Github
      </button>
    </form>
  );
};

export default AuthForm;
```

어떤가요?

지난 시간에 만들어 놓았던 Google 관련 코드가 똑같이 Github에도 동일하게 적용됩니다.

심지어 'auth/callback/route.ts' 파일도 똑같이 작동합니다.

테스트해 볼까요?

테스트해 보기 전에 아래와 같이 Supabase 대시보드에서 Github 부분이 Enabled 됐는지 확인해 보기 바랍니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjjFth-_NXgRkDhB-s1HUQBk9B56QgPLHxVu3bTeO3h4IJ80pWQnntpGhJV5FKc9DjVuWlSGf9mgsfMkhwn6Q1WCHsHBaKMEwx3c9jsj8PELxMcjE-J4Mfk_KYuLV4VBjySpmzHNqqnWfdvo_RO9YO_uD4iNUJWiZKIx_Rik80RvPBiBN4x2BWdFvWJqcg)

밑에 "Save" 버튼을 깜박할 때가 많기 때문입니다.

이제 "Sign in with Github" 버튼을 누르면 브라우저가 아래와 같이 바뀌는데요.

Github에 로그인하라고 합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhPEhFdh9E42Ldk7dYWns5BFWnos9nnJgSquxrZPbcuszwt9ixDn6IDemCA_xRCp-LkAPLHNS81KFZ0-F_bdDW__P_jcJl3mwXtP-ZrwksgixVSRgLQtYpD8PPDvjE3PDXMv0bdeZppEKKVYrp0AqEOXjfXW2FLCknF2lmkIbIQ64veqmceLfRXWP8r0eE)

로그인해주면 아래와 같이 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjUHJwbmndP0cYBt-7CgXn339zlpAB828iFuYy8sggHbUVkM79Hb7MeOiwf1YV9sWqNq9D7wpahHFTd0hZYGu_refGPwxoPyGQYJ66U98x7rSNMbwsRwLnBdTeUA8vxz66YP2PEi6QSOwbOyhye-C-SdYvxWl6DNlvRgAGhdQFpQYfvFDNoO38X_iwUz8s)

"Authorize" 버튼을 누르면 로그인이 완료됩니다.

참고로 터미널 창에는 아래와 같이 signInWithOAuth 함수에 의해 리턴된 data 값이 아래와 같이 나옵니다.

```sh
{
  provider: 'github',
  url: 'https://lricgtqtchaizkuwbmzw.supabase.co/auth/v1/authorize?provider=github&redirect_to=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback&code_challenge=Ls9rD4SM9ISZVSzrlqyIwzo52we5IMDVnTd4FtMhe4E&code_challenge_method=s256'
}
```

역시나 url 부분에 보면 모든 OAuth 앱이 그렇듯이 code 값을 가지고 있습니다.

이 code값이 왜 중요하냐면 처음에 발행한 code값을 Supabase와 Github에서 비교하기 때문입니다.

이 code 값이 맞으면 Github OAuth 앱에서 액세스 토큰, 리프레시 토큰을 Supabase에 리턴해 주거든요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjge3sZA36b2cz0vCUXCbMCjMz8wzrvTlgOEFMtKC849TYg0HUVs_ijDNU6NmbCK8ofkvP04r1rFXDzWMTiRIU8iK5li6JE_NsDGfdBpUW6cy-jTGE8hUAnWgWfd2lcd6eh1JqR2FantTK0MIbbtL2zpO3OFcXY9VM8svdQk0PuAoE9EuFwCDRUoFDJ6l8)

이제 위와 같이 로그인된 걸 확인하실 수 있을 겁니다.

어떤가요?

OAuth 관련 로직은 OAuth 2.0을 따르면 Google이나 Github이나 같습니다.

중요한 거는 callback URL을 양쪽으로 교환해 주고, code 값을 리턴해 주면 그 code 값으로 실제 액세스 토큰을 얻는 signInWithOAuth 함수를 실행시키는 여러분만의 callback 라우팅만 만들어 주면 됩니다.

그러면 다음 시간에는 유저 이메일과 패스워드 방식인 전통적인 방식의 Supabase 로그인을 구현해 보도록 하겠습니다.

그럼.


