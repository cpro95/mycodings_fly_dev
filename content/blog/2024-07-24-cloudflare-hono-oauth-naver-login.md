---
slug: 2024-07-24-cloudflare-hono-oauth-naver-login
title: Cloudflare, Hono에서 OAuth를 이용해서 네이버 아이디로 Login 구현해 보기
date: 2024-07-24 12:22:56.945000+00:00
summary: Cloudflare, Hono에서 OAuth를 이용해서 네이버 아이디로 Login 구현해 보기
tags: ["OAuth", "Cloudflare", "Hono", "Naver ID Login", "Session"]
contributors: []
draft: false
---

안녕하세요?

지난 시간에 Cloudflare와 Hono 프레임워크, 그리고 구글 OAuth 서비스를 이용해서 SSR 방식의 로그인 구현을 알아봤는데요.

지난 시간 링크입니다.

[Cloudflare에서 Hono와 Google OAuth를 이용해서 Login 구현해 보기](https://mycodings.fly.dev/blog/2024-07-21-cloudflare-hono-google-login)

오늘은 국내 제1의 포털인 네이버 아이디를 이용한 로그인을 구현해 보겠습니다.

네이버 아이디를 이용한 로그인을 구현하려면 네이버 디벨로퍼에 가입하고 애플리케이션을 등록해야 합니다.

빠른 링크는 아래와 같습니다.

[네이버 애플리케이션 등록](https://developers.naver.com/apps/#/register?api=nvlogin)

그러면 아래와 같이 나오는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiUMDtIoM0kvRqH_l0NP7XcfVf4OF5SKNkxtFFE9FrXPrKnkb3dg9HZz7Ikt0UR1G4Y5CbsCPQmiYogVnR_2BAGfWsqLe8dzirChRx08BP0xKUt8hRuc_rWa43hz_lJvHzTONb-F0u8MNAmx7MxR4Ntovw4RAotbSRB-u-G_y7euxiMSnf4bFbshkbWweY)

여기에 적당히 이름을 작성하고, 중요한 부분은 아래입니다.

바로 네이버 로그인을 이용했을 때 네이버에서 여러분의 앱으로 제공하는 부분을 선택하는 겁니다.

최대한 적게 고르는게 좋습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEifaEok_Bn1A_aVP-I6GvMttzNvpSHcRUK6z8QQx7_O_O1KT4AWustgZV7VeabS3wsC7inxN7QClSwDNaZdaivWi3OXVmqczNfnXqQeIIB0c0S0OWkpMeUN2s0HMbK4A-OFvp3RHFX5MZYTXtR9ppLcLTNMavIykIZs8voNL7opX9oTtzgP3Hy9jgIstOo)

적당히 별명과 프로필 사진 정도면 됩니다.

이제 애플리케이션이 작동하는 환경을 설정해 줘야 하는데요.

안드로이드, IOS, 웹 등 여러가지가 있는데, 여기서는 PC 웹을 고르겠습니다.

그리고 서비스 URL과 콜백주소를 아래와 같이 입력해 놓으면 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiKtOYsjrLbmTzyVhm4Fu7XuoEwYX6KBvSTkk-BOoDZrAbhMjseNav9N5m41z1ZB2U-cJqHmSQr2iKE95K8YhZ9w3RacgRgxM0mqpiIlNQe5o0pHNBoSk3LsPTEg2md1FldE3vtR9wu2Qmoe3weSGSJZZ4aq7NQnG50hhz0JnlIZhBjKRtok5Vljf2ee8g)

다 만들면 아래와 같이 애플리케이션 정보를 보여주는데요.

Client ID, Client Secret는 우리가 코드에 꼭 넣어야 하는거라 복사해 놓으면 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhAqWq4QZtY0bNHmNERzg4BpIdfaFR3wGP1KDim51hQbp5PS6u3nS9OzqxOKSXuotM0C3n_d0uveUnEczaSEo3mPCBRVT3lAVSbzHU_RGUe7Ch7qEOGP3UBxKh9AwMu3CromzWlXtKIZcLFE69RmU5iJXDbIvngOSDDwn42SzT21sOMtiWqeN1P-QUMqBg)

이제 네이버 디벨로퍼에서 할 일은 끝났습니다.

본격적인 코딩에 들어가 보겠습니다.

---

## 템플릿 만들기

Hono 앱을 만드는 거기 때문에 아래와 같이 입력하시면 됩니다.

패키지 매니저는 빠른 Bun을 이용하도록 하겠습니다.

```sh
bunx create-hono bun-oauth-naver-login-test
create-hono version 0.10.0
✔ Using target directory … bun-oauth-naver-login-test
? Which template do you want to use? cloudflare-pages
✔ Cloning the template
? Do you want to install project dependencies? yes
? Which package manager do you want to use? bun
✔ Installing project dependencies
🎉 Copied project files
Get started with: cd bun-oauth-naver-login-test
```

이제, src 폴더의 index.tsx 파일을 수정해서 코드를 이어가도록 하겠습니다.

사실 구글 로그인과 아주 똑같은 로직인데요.

먼저, "login" 라우팅 부분입니다.

```js
app.get("/login", (c) => {
  const AUTH_ENDPOINT = "https://nid.naver.com/oauth2.0/authorize";
  const params = {
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    state: STATE,
  };
  return c.redirect(`${AUTH_ENDPOINT}?${new URLSearchParams(params)}`);
});
```

역시나, 단순하게 네이버의 authorize API로 redirect합니다.

당연히 params 객체에 네이버 디벨로퍼에서 받은 CLIENT_ID 그리고 REDIRECT_URI, 또 네이버에서만 요구하는 STATE 값도 넣어서 전달해 주고 있습니다.

state 값은 난수의 문자열이면 됩니다.

이 아무런 문자열을 가지고 authorize API에서도 사용하고, 나중에 액세스 토큰 얻을 때도 같은 문자열의 state를 사용할 겁니다.

그래서 중간에 API 탈취를 방지하는 목적으로 state 값이 쓰이는겁니다.

그러면 state 값을 생성해 줘야하는데요.

단순하게 "imstate" 라고 지정해 줘도 작동하는데는 문제가 없습니다.

그러나 뭔가 있어 보이려면 아래와 같이 하시는게 좋을 듯 하네요.

```js
function generateState(length: number) {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let state = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    state += charset[randomIndex];
  }
  return encodeURIComponent(state);
}

// "클라이언트 등록"에서 취득한 값을 변수에 설정합니다
const CLIENT_ID = "D~~~~~~~~~~~`S";
const CLIENT_SECRET = "l~~~~~~h";
const REDIRECT_URI = "http://localhost:5173/callback";
const STATE = generateState(16);
```

이제, login 라우팅 부분은 끝났습니다.

지금까지 나온 코드 전부를 순서와 관계없이 그냥 index.tsx 파일 안에만 넣어도 Hono 프레임워크는 작동하니까 걱정하지 마십시요.

참고로 아래 그림은 네이버의 authorize API 설명 캡쳐본입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjW0rheeimpDz9MnfSZ3A3HdEUye7jFj93Z8D-V50zOAvVzNzgN83OGu6UAvIymbKm8adWDpOooorDKI2DCa6lxzL00BBFib81RCyVGhZeTsBrhM_-ZfNEbeBfxQh2c5cyhfFBnQ5RMmK9eA8oPCldllFi9SyhsbmwbdkpYKl2CpJWNGwU_zYQil_DReLs)

---

## 콜백 URL 작성하기

지금까지 "login" 라우팅에서 한거는 네이버 authorize API에 단순하게 값만 넣어 GET 메서드로 HTTP Request 한겁니다.

그러면 네이버 authorize API는 OAuth 2.0을 따르기 때문에 콜백 URL로 code 값과 state 값을 그대로 돌려줍니다.

단, 네이버 로그인을 통과했을 때만이죠.

여기서 작동하는게 아래 그림과 같이 네이버 로그인 애플리케이션 사용과 관련한 안내 문구가 뜹니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjeq5kvqPYai5NSijtTHYlAxIetF5IpU7hVpG2FaTtSS_YIfWyGZi5yXwvmN9AszOb2XwKBM728Pn1OaDkq9e5EylHSKlABnlZb6T0m43TrlyOt-zk3xwZ-FLoBOVKsrufTmUlCEMTHaz2KqWUV1NlTE7V9vAj6LEWRkF9-qhpxi4vHN3sQToQUUw6SVnw)

위 문구에서 동의하기 버튼을 누르고 네이버 아이디로 로그인하면, 즉 네이버 아이디 로그인이 성공하면 아까 설명했듯이 네이버 디벨로퍼에서 설정한 콜백 URL로 redirect 해줍니다.

이게 바로 OAuth 작동방식입니다.

대신 콜백 URL로 리다이렉트 해줄때 code 값과 state값도 같이 줍니다.

우리는 콜백 URL에서 code 값과 state 값을 이용해서 액세서 토큰을 얻게 되는거죠.

실제 실행해 보면 아래와 같이 에러가 나올겁니다.

왜냐하면 콜백 URL 라우팅을 작성하지 않았기 때문입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiiqCZmy1vhWStBqNXN9m4nmxyO8BmZwqgJYd6mccgoQFOQy6UwvfBKOYlQHSoOkWkVfI6iSVYpJeyxKLbPmtdspAJ2qdGbJv9pgq6RJMah6Dw4D6FTub7SUbbgBLJjxB1YNImQcFF_cuQqjEjLOBoOA3_gCDtunkZSW2tFqAW4h_rC748LjTdwf9bYv0s)

참고라 아래 그림은 네이버에서 제공해주는 콜백 URL 관련 API 상세 설명의 캡쳐본입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEijrK9MiHeHbCYWIAjhxFUCtBwxjiBZv_mOfuTHfdFy8LhGbfRzxeChN5XTzeJq9MLzOi7XZY9EGtVVVxiVwMMfGeUArbTZH0G-3M9qKm76R9HXi58mpM8G0QiW5pOAQQTnL0iFokuOxjmTcmOxf5K9zpsWDvXl9TSXNxwEWgIn3UBaB6eUPc1l6Ha1Hmo)

그리고 아래는 액세스 토큰 접근 관련 API 설명입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhjXVIhOuzIcH_uxZ0PrD-IfRn1aFlsUFnSPXwQzi4F7QAHxCpigF4sWrxE69ihV0GfxmCy6suUT63D0TN3rXwRYWcso7FJ86WuvikMvitKwseaIphdsK3Tl4CoeU_cBKfCP1Lmk8-xbPGZcBwXWYUaWX8xDXNde2pMOP5jLHKVRRL1-pa0EK_G49yvr2k)

![](https://blogger.googleusercontent.com/img/a/AVvXsEhT7eCUgrs9gVYMfrC5uFhUG5bcy6PndmeA1YJx20rryqk_StaGDkHEzj0rM0G8dGt9O5SVaVgSDVWh0iL70IS8TgVGZcMnkB4dlQjhrj0dgJYO1on7UfyG8MK4ruLn1rtsLbVL5h9if0gLD1XdLYXkAxUXWLhY6CyNiv_8n6rH3N9n1sNRz6rWbYwXaXU)

아래 그림은 액세스 토큰을 받는 API의 리턴 타입에 대한 설명입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiMamWZQqRx03zf1R66Us40S1sfGuPF0ufIz1TiPCBSSrl8QtHuHzaRZryyL375enrcsA4aXD-UtC6uTCU4V30XA_vDrD5ednQo3kLolIKcyQ28Qwxaz7rcX-cJKF3a2PrN34N8Y3hfZye1N3pDe3VY1GeT1fSDpq_KJZdX8dSrYPE_eQCxYwAyg8PbCUc)

이제 본격적인 콜백 라우팅 코드를 구현해 봅시다.

```js
interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  refresh_token?: string;
}

interface UserInfo {
  id: string;
  nickname: string;
  profile_image: string;
}

app.get("/callback", async (c) => {
  const TOKEN_ENDPOINT = "https://nid.naver.com/oauth2.0/token";
  const code = c.req.query("code") || "";
  const state = c.req.query("state") || "";

  if (!code) {
    return c.text("Authorization code not found", 400);
  }

  const params = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: "authorization_code",
    code: code,
    redirect_uri: REDIRECT_URI,
    state: state,
  };

  try {
    const response: any = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(params),
    });

    if (!response.ok) {
      const errorResponse: any = await response.json();
      return c.json(errorResponse, response.status);
    }

    const data: TokenResponse = await response.json();
    const access_token = data.access_token;
    console.log(`ACCESS_TOKEN is : ${access_token}`);

    const userInfoResponse: any = await fetch(
      "https://openapi.naver.com/v1/nid/me",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    if (!userInfoResponse.ok) {
      const errorResponse = await userInfoResponse.json();
      return c.json(errorResponse, userInfoResponse.status);
    }

    const userInfoResponseJSON: any = await userInfoResponse.json();
    const userInfo: UserInfo = userInfoResponseJSON.response;
    console.log(userInfo); // 사용자 정보 출력

    // 세션 쿠키 설정
    const sessionCookie = Buffer.from(JSON.stringify(userInfo)).toString(
      "base64"
    );

    setCookie(c, "session", sessionCookie, {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 60 * 60 * 24, // 1 day
    });

    return c.redirect("/");
  } catch (error) {
    return c.text("An error occurred during token exchange", 500);
  }
});
```

위 코드 부분은 지난 시간에 배웠던 구글 아이디 로그인과 99% 유사하기 때문에 전체 코드만 넣었습니다.

우리가 받은 code 값과 state 값을 c.req.query 부분에서 얻어서 그대로 다시 액세스 토큰을 얻는 API의 params 값으로 넣고 있습니다.

액세스 토큰을 얻으면 이제 사용자 정보를 요청하는 API에 접근해서 유저 정보를 가져오면 끝입니다.

네이버 유저 정보 가져오는 API의 설명은 아래와 같습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjbdPoIoSC2KX3A2xU2gMWNlT9ZWwWJXBYge0b5--eJUS6LYrkb5xp1UZHRVcZGl5UwiJTyB8umHbxdgaaaa3uuW87TcTOw9TlnWs9Kro7rkQK-V81HGx9ddy5yGtpfgQ5Cn1PlQqCwIDqvdYXy9ClTyFasVum-4c0ZFJuAnULGOyecDPQfcdXJjh4EvUI)

참고로 userInfo 부분의 콘솔창은 아래와 같이 출력됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjY363x3Wfr8niEIs78o86DKOlAyVBoEzlhVF4quB1sdayyzVzELy1lNuPK6e3saG-dtUDY3veAz_QJDwrALipGtdDVtSq422ZjInJE1hsC7OvrG4zwa4jaFkgLiIS5nd4nw-N_tp_ICeXsoddYJjRjpF8oFPzARhjV5vg8HJFia6OwA-75Tz0u18NVUJU)

![](https://blogger.googleusercontent.com/img/a/AVvXsEjX8ae49g-ZQ8qJYV9WHvnNuELmu2DGL3VWT79qsZQQo_uyj_KmQiUqwFPdWOHw3gUr7brraZnWfiUhRxy8WvAF2-Irs2ePGgu680XHBNOHVIKDvfUVtRtAnKvD54fCE-MWflFPNq9_Kj9deEtcR_kZFzTIlr5lvujNm6_Pyfbs_WgzveaTRnJLev05MG8)

위 그림을 보시면 네이버 API가 제공해주는 JSON 결과치에서 response 값만 필요하다는 걸 알 수 있습니다.

위 그림을 보시면 제 아이디, 닉네임, 프로파일 이미지가 나와있네요.

사실 유저 로그인은 이 정도 정보만 있어도 충분합니다.

위 코드의 마지막에 쿠키 설정한 걸 볼 수 있는데요.

유저 정보 자체를 BASE64로 인코딩해서 쿠키에 넣었습니다.

마지막으로 "/" 라우팅에서 쿠키를 이용해서 사용자의 로그인 여부를 체크하는 코드를 작성하면 끝입니다.

---

## 홈 라우팅 작성하기

```js
app.get("/", (c) => {
  const session = getCookie(c, "session");
  if (session) {
    const userInfo: UserInfo = JSON.parse(
      Buffer.from(session, "base64").toString("utf-8"),
    );
    // return c.json({ message: "Logged in", user: userInfo });
    return c.render(
      <>
        <h1>welcome : {userInfo.id}</h1>
        <img height="80" src={userInfo.profile_image} />
        <form method="post" action="/logout">
          <button type="submit">logout</button>
        </form>
      </>,
    );
  }

  return c.text("Welcome to the home page. Please log in.");
});

app.post("/logout", async (c) => {
  deleteCookie(c, "session");
  return c.redirect("/");
});

```

위와 같이 작성하면 아래와 같은 화면이 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEh34ZfbpdvwdOJ2S8yF7L7aIxMnWRTrggDt1qXAmXtZpos2375h7At5lxR04Ob-v0WC370ix05WLezDlE4FpptrQlRZFypWTEf98txy63RCt7pWX5H-_YPB0sv8-I_otiBgFFBDiIYEJUtSDuS4qFxlmQc9BqLg-Pp26M-s6jX9U_7TESheFQ4folSw0ww)

로그아웃 버튼과 로직도 만들었으니 테스트 해보십시요.

아주 잘 작동할 겁니다.

지금까지 네이버 아이디를 이용한 로그인을 Hono를 이용해서 Cloudflare에서 구현해보았습니다.

그럼.

