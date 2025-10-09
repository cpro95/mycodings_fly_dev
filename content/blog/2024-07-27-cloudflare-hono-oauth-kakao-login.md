---
slug: 2024-07-27-cloudflare-hono-oauth-kakao-login
title: Cloudflare, Hono, OAuth, Kakao Login(카카오 로그인)
date: 2024-07-27 12:45:38.297000+00:00
summary: Cloudflare에서 Hono와 OAuth를 이용해서 카카오 아이디를 이용한 Login 구현을 해보겠습니다.
tags: ["Kakao ID Login", "Cloudflare", "Hono", "OAuth"]
contributors: []
draft: false
---

안녕하세요?

지난번에 각각 Hono 웹 프레임워크를 이용해서 구글, 네이버 아이디로 로그인하기를 구현했었습니다.

구글, 네이버 모두 Oauth 2.0을 따르기 때문에 한번 배워두면 쉬운데요.

오늘은 카카오 로그인도 시도해 보겠습니다.

지난 시간 링크입니다.

- [Cloudflare, Hono에서 OAuth를 이용해서 네이버 아이디로 Login 구현해 보기](https://mycodings.fly.dev/blog/2024-07-24-cloudflare-hono-oauth-naver-login)

- [Cloudflare에서 Hono와 Google OAuth를 이용해서 Login 구현해 보기](https://mycodings.fly.dev/blog/2024-07-21-cloudflare-hono-google-login)

먼저, 카카오 디벨로퍼에서 애플리케이션을 만들어야 합니다.

아래 링크는 카카도 디벨로퍼 링크입니다.

[카카오 디벨로퍼 애플리케이션 등록하기](https://developers.kakao.com/console/app)

링크를 클릭하시면 아래와 같이 애플리케이션 추가하기 버튼이 보입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEg9wduyc8hQd8fqWd2FR1boyXGdEUPh7I4kicxzvIlgNG0WBQ47Yso1_n5Hjh1OcjE8VV6xp9kCzVK7C4rEImsPCL-CvUXDdE2W-mxBHAqwQKpsLOMwy8ZHWFbFAOjRrjMNgvEcOLfuhV5_s8ra4pAOPQFJ3Gt0v9lDZVPfrK9V5GLq5126DRxE-XIYTHc)


추가하기 버튼을 누르면 아래와 같이 나오는데요.

적당히 이름을 정하고 저장하기 버튼을 누르면 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjweruGH5xnOAKwToFgInuOIQHByZ8Zn-Y697zrq-h3g5kDDgPJrpXkz0LHVlehXtfkle7i1Syx9prtBz8p-E-coHWzBMf78nAgecfOifkA7zSlk9OXy1NAwWW-vIKw1_9D2R1G9arYNwN6UYANwxE6HIlt8fQJwUYv1aSR6-KBc3bf--UGANxb5Z7nrdk)

이제 방금 만들었던 애플리케이션(이하 앱이라 칭할게요)을 클릭하면 통계와 함께 설정부분이 아래와 같이 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhsfQ9o6YXMi4NeCMvmxOjuG8Wv_r3y2aEKO7xepT8clMsbSFSTWIIxSnZ_-M4uqQ4Q-tt-IZpprQm1JHkl7XzvNwstTW07OGyKqItAwivtN6EWRolHbIotElD5Dzm8XcUIXT0dDc8jnbJSRQijWonnE-zF230c-Q435bQSUYd0uRZYtYQDVTJy7rDb-LQ)

여기서 중요한게 바로 "카카오 로그인", "동의항목" 부분인데요.

각각 설정하기 버튼을 눌러 설정해줘야 합니다.

먼저, "카카오 로그인" 설정하기 부분입니다.

아래 그림과 같이 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgiLCh9pk0RD248jyjC8lEqaqXLkbc2ovG0n3YvGlEGByn1us0aHcnkhXNhW6ADw4IzbP7OA8pmudMJ6wqHp8ipIa53fAQiNwcGidJTX8iJio6VPoHUlITpz-aetmFCoAh1nfQDqOBB2LXEqqAgpnSxEPhRa1Gbpoym-JvfciPBJRhFnCIksxX1W4d7pBI)

이제 카카오 로그인을 활성화하면 아래와 같이 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEj8Hn-1lxZN8vk8lHrLv6Sg32WCcQHAtnjpskim7Zz9yiOSzeCGNPIwiOFVlzm3K1ynAqUMoiAusnLw5yHdg_O5Rj0zMF4KcJd85bgcNgL1pHK4zj_gkKqwDGaOXLYM694jk9pQwkZEO781TIjMXEbj-Joa-_aUFE-E0NY1dti9TsBM3CVNwDOMzRAqttI)

여기서 중요한게 OAuth 핵심 라우팅인 Redirect URI를 등록해야 합니다.

우리는 예전처럼 Vite의 개발서버를 이용해서 테스트 용도로 콜백 라우팅을 지정할 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEilqwHOO8EsHSkw7ocu8xvy4o8h14mN80QDQSFxHhRlN33MHVNf0buFAn5HZ07HkQcUyThBuWAk8FNW4D8dppcOQBLgwMgbyAgVjvgAS5J9lIjdTPG-MyzW1TEjVwL9F6lhCCinvBuGfeBecakjQN4tWLGOV5yCaK0i1XR3dWyZULro_N7bs7F0fwkpIzU)

---

이제 다시 대시보드로 돌아가서 "동의항목" 설정을 누르면 아래와 같은 화면이 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEitSUc1roaV5lT_kp5Vpt96GNTk0kvSMb7IfjtdMJF5Raoj7jJSV5yJ2NimbasJQXzK9zvHywozq1vEloDsv6SLS_yemGcfFKfLr7dEjs_K-ofSAPUBlY6ZzRSHBDXLuBxHywph2TA_vLPp2WwndUR4BCLwIhIilnMqbC33fpWzaisc-a0k0oXFgkUA3gQ)

동의항목은 적을 수록 유저가 느끼는 위화감이 적습니다.

그래서 닉네임이나 프로파일 이미지만 선택해도 충분합니다.

각각 설정버튼을 눌러 아래 그림과 같이 필수동의로 설정하면 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEibcrdoF8KqSoRUQAw1RDVOI_uqH6z9MeRArCDkRbknXI7smlhyTH_2G73PYsPeUWPsND4Srnba09zoBvzm29bXApTn-MBr2iMIyK3S3uOIFUM4EnOU43NmuUoiY9DGDoOjQDaB29ykaZukcLMgoG40McDBV8DlPVl2rcp7FH3GfsZGRLLwXVuoHTm79Z8)

![](https://blogger.googleusercontent.com/img/a/AVvXsEiOWtwm2QW2Xk5s9J17baKzToNq62hqIucSxY3SV_DSH2wdm0_P5kJf99BnDuvGtrHRPIn0QJQYcor-G3aLenP4i6umvmu3zubGgtIncMnHWlqHTIC9vjQLPo0NZffKedqeg1wvurGCxs_bjrgdj1wI65MGyPllpjKCcOLP2ogH84ZIInCRyTtmINrKGqE)

---

이제 CLIENT_ID와 CLIENT_SECRET를 얻어야 합니다.

대시보드에서 왼쪽 상단에 햄버거 메뉴를 누르면 아래와 같이 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjk6re-0dLGon_-l3zOWB4AKiXyIGnAHsax02SuHYaejwBzhm3ymCCmZ8e_wNt7o2PzC5uqyQKndnI47XO4w4kMCyIge82mYEXYN3I_8tmHjeJXp1E00PcBN6xXFwkUPn4IJNWA1VRsTXNZ6i8qmBjtONVntHQE4Wrz34PAiLpX43kCuBuhutGtTA1GBY4)

위 그림처럼 우리가 얻을 건 "앱키" 입니다.

눌러보면 아래와 같이 여러 가지가 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEha57UCBaUpaEQIPyYig3bIYh8SfYlS8i_quGBwe7xM6FRUFDTDYTBJFLTKC06OXhx4BmRaVQhmGzsTPw6D_wZhhaphKb05gpqm_ksW3h5WoatKNEx8RiyIs1e6YvhmJLym22DiLltHbGw6fk-03hExSzlVpvAsEjzGR3ZFbRtGyMIDRVAFzK1Zk96wlF4)

이상하게도 카카오의 앱키는 꼭 암호처럼 생겼는데, 그래서 CLIENT_SECRET라고 착각할 수 있겠지만 이 "앱키"가 사실 CLIENT_ID 입니다.

여기서 주의할게 있는데요.

우리가 만드려는게 사실 REST API라서 "REST API키"를 쓰면 될 거 같은데,

카카오는 약간 헷갈리게 만들어 놨습니다.

위 그림에서 "Javascript키" 부분이 우리가 원하는 CLIENT_ID가 됩니다.

그 다음으로 CLIENT_SECRET를 구해봅시다.

CLIENT_SECRET는 햄버거 메뉴를 누른다음 "카카오 로그인" 부분에 있는 "보안"을 클릭하면 설정하는 화면이 나옵니다.

CLIENT_SECRET 없이 카카오 로그인이 가능하지만 이 걸 설정하는게 권유되니 꼭 하시길 바랍니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgmUG-QReFoGAZBlzoigRe81ItPJ-6mc4cu3wB_oH3w3U_iqqUWtIiEMoDFdwY3UjEkkRBJd7TBByOwAVA8Zk5eBiXYAlBHAm3_Qa0bz_hmiTGCEd1KXhznEmJMDMoAQFpJsBETbrBKdIi6f2IwA846UHUPRU9llUpiBCnIToc7Mf5JoN86MG_HxkFcPbM)

상기 화면에서 "코드생성" 버튼을 눌러 CLIENT_SECRET을 얻으면 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEj_4-XUjjGLeDrZtMXfGonsh9G9u0eMWBErV0W8V8qTMkX5F4YMF40XX27amst-8Mz8ntEq19FwHyat28-O3pqTnHtv428aiPZsqZHfFoWQXMHqBwQh9G6uOkuDQH2tJ3VK7Z_erRA4I8wuPw5abPaulv1yHzSeYO7S4VlYF2HgoNubQGV9JWM023bAs88)

![](https://blogger.googleusercontent.com/img/a/AVvXsEjkhh4I4eXWRgzLa5OUJ-1aZsYECQSCuzLLdzKKnzDusC8t1WaP27Savps_PxzKucVWc6zT5tIsVqCzHADgRDK8f4DdenlheBSTJEpRSfaRFBV7y7Tgf8-VdEqXxUbPSTDyG51vNayg_G-NMRQY3W5nLOS8A5e90G3qUni8OOhDRrYcsjA6EvxU_svNjWo)

이제 OAuth를 사용하기 위한 필요 항목인 CLIENT_ID와 CLIENT_SECRET를 얻었습니다.

---

이제 Hono 앱을 만들어야 합니다.

아래처럼 터미널에서 빈 Hono 앱을 만듭니다.

참고로 cloudflare pages를 선택합시다.

```sh
bunx create-hono bun-oauth-kakao-login-test
```

이제, src 폴더의 index.tsx 파일을 수정해서 카카오 로그인 라우팅을 작성해야 합니다.

예전처럼 먼저, "login" 라우팅을 작성합시다.

카카오 로그인의 OAuth authorize 서버는 아래 그림에 나와있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEj95OQBbmR0nuL-gN389wj4kWf_qQMJlQxOLb1dSHmopUihdzpsrIZKl2X5mhu1Dj1_l2OYVy3kefl9fw1SZXi3RSCbzUjKvlOTVJN3Hg9aMXFBYdknmioxgR9nezutlDlFJITUwCUA6lcERtLr-qa6zpWu7wfEU0AduQue7y6C5fvE19KJy45QPIWKaro)

```ts
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
const CLIENT_ID = "8a5b~~~~~~~~~~~~~~~~~~f7e969";
const CLIENT_SECRET = "q~~~~~~~~~~~~~~~~~~rtIw94qF9";
const REDIRECT_URI = "http://localhost:5173/callback";
const STATE = generateState(16);

app.get("/login", (c) => {
  const AUTH_ENDPOINT = "https://kauth.kakao.com/oauth/authorize";
  const params = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    state: STATE,
  };
  return c.redirect(`${AUTH_ENDPOINT}?${new URLSearchParams(params)}`);
});
```

위 코드를 보면 state에 들어갈 값을 얻기 위해 지난 시간에 작성했던 코드를 그대로 가져왔습니다.

그리고 카카오 로그인 authorize 주소에 우리가 얻은 ClIENT_ID, CLIENT_SECRET를 넣어 redirect 시킵니다.

이러면 카카오 로그인하라는 화면이 나오는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjXXL8NJPZD10heZ39KN53Sj2gSiIVKXAO0GY7v6ugGZTGDhBkpLxTIFEdVuMLUcS8U9JviE7M3ROCATA9gvm9EBqEJ8Kg7LHqjqTXx5rKigPxSFa0A8LHVPh0WFNCQarRjQL4_6YyLv5QRTHH8GdXATR6wkl9k6kPmpsEWQigUBYbzK72ga_BGUGNsN04)

위 그림처럼 동의항목에서 설정했던 "프로필 사진, 닉네임" 부분을 동의하라고 나옵니다.

동의하고 계속하기 버튼을 누르면 브라우저는 다음과 같이 나올겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjUV2iUYj_zJHrKdPLVt7DGqMEvpcXwQC796kRPAJTOyGK3mBE0gWzZfNWWRV8Lfnt_VjmlybyjFajQEzcmkPCDrIZC3tef0T3HvxKk_yesj0SXZBcUW4kVMdE46VgOlW03VH-i82A5LWhbHg6ombUxxr6h7cr8-p1cvR4NyG9NnLt2rMQSjDtwYlXOSLY)

이 에러는 구글, 네이버 아이디 로그인할 때와 같은 방식이기 때문에 나오는 겁니다.

바로 "callback" 라우팅을 만들어줘야 합니다.

다시 한번 상기시키지만 우리가 카카오에서 설정한 Redirec URI가 'http://localhost:5173/callback' 주소이기 때문입니다.

왜 이 콜백 라우팅이 필요하냐면, 카카오 아이디로 로그인한 결과 그 결과값을 'code'라는 쿼리 파라미터에 저장해서 콜백 URI로 넘겨주기 때문입니다.

우리는 이 콜백 라우팅 주소에서 해줘야할게 바로 'code' 값을 이용해서 액세스 토큰을 얻어야 합니다.

카카오 로그인을 성공했으니 카카오 서비스에 접근가능한 액세스 토큰을 얻어 카카오 프로필도 얻고 다른 서비스도 사용하고 그러는 겁니다.

---

이제 다시 Hono 웹 프레임워크로 "callback" 라우팅을 처리해 봅시다.

```ts
interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  refresh_token?: string;
}

interface UserInfo {
  nickname: string;
  profile_image: string;
  thumbnail_image: string;
}

app.get("/callback", async (c) => {
  const TOKEN_ENDPOINT = "https://kauth.kakao.com/oauth/token";
  const code = c.req.query("code") || "";
  const state = c.req.query("state") || "";
  if (!code) {
    return c.text("Authorization code not found", 400);
  }

  const params = {
    client_id: CLIENT_ID,
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
      "https://kapi.kakao.com/v2/user/me",
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
    const userInfo: UserInfo = userInfoResponseJSON.properties;
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

'callback' 라우팅의 전체 코드입니다.

구글 아이디와 네이버 아이디로 로그인하기 강좌에서 했던 내용 그대로입니다.

TOKEN_ENDPOINT 에서 액세스 토큰을 얻고, 이렇게 얻은 액세스 토큰을 이용해서 `v2/user/me`란 카카오 서비스를 이용해서 유저 정보를 얻어오는 겁니다.

실제로 userInfoResponseJSON을 콘솔 로그해보면 아래와 같이 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiFW_MKVSmbLJP8FXMqNnEzaXBqNpoweRIKO3brYdhCmYfA-oO2qVu0rJx1KsZ0hDE-xxW0eN7Orf2TDFqeP9I9wDprOSFLFEWmXC1QjiPfGAKgalby50f0f9vwMrd7CzwzFH7CG4MF_8gfPldRXa2n09lIQt1wtqvXUgph1N1r49cBjArYM5UCZIXFc8A)

여기서 우리가 필요한건 properties 항목만 있으면 될거 같네요.

이렇게 얻은 유저정보를 쿠키로 저장했습니다.

그리고 다시 "/" 루트 라우팅으로 이동시킵니다.

---

카카오 로그아웃을 구현해 보겠습니다.

카카오 로그아웃도 API로 제공해 줍니다.

이 서비스를 이용하기 위해서는 "Logout Redirect URI"를 등록해야 합니다.

먼저, 카카오 디벨로퍼 대시보드에서 햄버거 버튼을 누른다음 "고급"을 클릭하면 아래 그림과 같이 "Logout Redirect URI"를 설정하는 화면이 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEj02AFLXV7QYGlgEBtSi6WW_5u9Wdro6eMPoxsDMWYekym1oqp84dj-IM-euV-5XUhd_7bClJwjdxYyrCKdOnRXW2JL3O1Hdguj96DlIm5oJQ4hcHccMF9TgIBZbmm-XOUzCyJIV6N4vIWtIyoxlafz9a6jr4PbjLAh5XzZKlprsirjJ6xoGZdlm5SLtIA)

아래 그림과 같이 설정하면 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEirRY9xpoArB7owLFND0Zi9AciI3OKdbTEbSXLnyc260NsCnGXG7bn7_VrVZEm5kmBHDrIoQSY6FbnWkLS7ElZV1kEjUpAZeAO_1Lsr9pvT1qixcymO5kyuWgu_65yqWoa2hLs__fa131O_tw7let_m40syXWp1j-iEw1Pv-6-PJ6TLpi7iCL7BKcXwFjo)

이제, 로그아웃도 구현해야 하는데요.

먼저, 루트 라우팅 "/"에 로그아웃 버튼을 추가하겠습니다.

```ts
app.get("/", (c) => {
  const params = {
    client_id: CLIENT_ID,
    logout_redirect_uri: "http://localhost:5173/logout",
  };
  const logout_url = `https://kauth.kakao.com/oauth/logout?${new URLSearchParams(
    params
  )}`;

  const session = getCookie(c, "session");
  if (session) {
    const userInfo: UserInfo = JSON.parse(
      Buffer.from(session, "base64").toString("utf-8")
    );
    // return c.json({ message: "Logged in", user: userInfo });
    return c.render(
      <>
        <h1>welcome : {userInfo.nickname}</h1>
        <img height="80" src={userInfo.profile_image} />
        <a href={logout_url}>logout</a>
      </>
    );
  }

  return c.render(
    <>
      <h1>Hello!</h1>
      <h2>Hono Kakao Login Test</h2>
      <a style={{ margin: "30px" }} href="/login">
        login
      </a>
      <a href={logout_url}>logout</a>
    </>
  );
});
```

위와 같이 하면 아래 그림과 같이 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhPBIFprmqGWQjnLs7jUw1XVHyZc6X1875O6nW6NygJLcZLygTuCl4eqJrH1w5nPDnFOvyYupEIB_8_X_WRz_RCQjqOH73WIeS3_nHFOKoosFn_NiKw7JzN2PzgcgBYiuWs33Y-simN1blK0gmdjVO-JttHmlVqxAqHZliGj78C1fc_g0Ft2_xGryzxey8)

위 그림처럼 로그인 링크, 로그아웃 링크가 보입니다.

로그인했다면 아래와 같이 보이는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiveonsPAPN6FR3na1sTJqMEx3T-ONgwLBHwmGqHvFzJaj7sm-RjBZmCeUUdnczi2MuZsMHVWAmfjoAqN281zoecnvFCJOFVcJkGets0XjUjQ3js62BKhlqDRVAji2aQOiO1M3zA61ouV7qf5m7xHHMp3JkWYNzKD-kBy1rrgwSXqADwsy887k37WpRrXw)

제 닉네임과 프로필 사진이 보입니다.

이제 로그아웃 링크를 눌러 로그아웃 해볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEhWCfjOljhQocros619I7O-uIHl6DXuVXm5lFpI9jPcKjJK7O7CPqo-nGl5EFJorkCxsqPfFdez-Q1H7PkdDMnA4lQXn_tuHBtSUMDuIj-NNJnutMc9uyS4k565pdQdeWgfRC5j3f3Sm9kbAqjdwGE74MS5cU-A7XpvPKyGtm1PgtTV7zCvMW_v9eUB2IM)

위 그림과 같이 두가지 로그아웃 방식을 제공해 줍니다.

하나는 "이 서비스만 로그아웃", 다른 하나는 "카카오계정과 함께 로그아웃"입니다.

글로만 봐도 쉽게 이해할 수 있는 버튼입니다.

"카카오계정과 함께 로그아웃"이면 카카오로그인 상태가 없어집니다.

"이 서비스만 로그아웃"을 누르면 카카오로그인은 그대로 유지가 됩니다.

먼저, "이 서비스만 로그아웃"을 눌러 로그아웃을 하게되면 에러가 뜨는데요.

카카오 로그아웃 콜백 URI 부분이 없기 때문입니다.

Hono에서 이 부분도 라우팅을 제공해 줘야 합니다.

테스트를 위해 아래와 같이 간단하게 작성했습니다.

```ts
app.get("/logout", (c) => {
  deleteCookie(c, "session");
  return c.render(
    <>
      <h1>logout completed and cookie deleted</h1>
      <a href="/">go to home</a>
    </>
  );
});
```

여기서 우리가 login 했을 때 만든 쿠키를 삭제해서 로그인 상태를 없애주면 됩니다.

"카카오계정과 함께 로그아웃"도 눌러보시면 그 차이를 이해할 수 있을 겁니다.

이렇게 카카오 아이디로 로그인하기도 구현이 끝났네요.

그럼.