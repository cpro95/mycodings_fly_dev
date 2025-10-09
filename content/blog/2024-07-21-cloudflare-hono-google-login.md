---
slug: 2024-07-21-cloudflare-hono-google-login
title: Cloudflare에서 Hono와 Google OAuth를 이용해서 Login 구현해 보기
date: 2024-07-21 11:36:11.726000+00:00
summary: Cloudflare에서 Hono와 Google OAuth를 이용해서 구글 아이디를 이용한 Login 구현을 해보겠습니다.
tags: ["Google OAuth", "Cloudflare", "Hono", "Login", "Session", "Google ID Login"]
contributors: []
draft: false
---

안녕하세요?

오늘은 Cloudflare가 밀고 있는 Hono 웹 프레임워크를 이용해서 OAuth 테스트를 해 보겠습니다.

OAuth 테스트에는 Google 아이디로 로그인 하기를 이용하겠습니다.

먼저, Cloudflare + Hono의 빈 템플릿을 만들겠습니다.

패키지 매니저로 Bun을 이용하겠습니다.

```sh
bunx create-hono bun-oauth-google-login-test
create-hono version 0.10.0
✔ Using target directory … bun-oauth-google-login-test
? Which template do you want to use? cloudflare-pages
✔ Cloning the template
? Do you want to install project dependencies? yes
? Which package manager do you want to use? bun
✔ Installing project dependencies
🎉 Copied project files
Get started with: cd bun-oauth-google-login-test
```

---

## Google Cloud Platform 사용하기

Google 아이디로 로그인하기 위해서는 Google Cloud Platform을 이용해야 합니다.

아래 링크는 Google Cloud Platform 콘솔로 바로 이어지는 링크입니다.

[Google Cloud Platform Console](https://console.cloud.google.com/)

![](https://blogger.googleusercontent.com/img/a/AVvXsEja-EIJ_wwaLuBcxoWAYQimTvlTWdN1CS1Cks9o2Uz6ayRf1PxgNZWdc3cteuzALjawPa9qcYO73KUhjXt_NVGmF0r3tqVVX8hqE__1eY2RiOmC2kFu-7jrszadVE21fnRL3t4f6rqW4FZMaaTML3mgf2BGPr0EdL6kQeM5XovNsXWPgpZU2FODTbH7Zt4)

위 그림과 같이 나오는데, 새로운 프로젝트를 하나 만들어야 합니다.

상단 프로젝트선택을 누르고 아래 그림에서 "새 프로젝트"를 눌러 하나 만들어야 합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhVwzTbq5OROyzui7ORWa8lQDa8aNQogO8QalIXJM3oBIaxc7ClBT7aC-5fvwX_PI8EBrhVh6xoi8YbPNWp-GKxp9kqfFp3GkzmTlfr7-tGC33UOiJs6SWchH4mIDNeYmps6N4DqhvH9P9qad_oSENO-N0wOYLhxhJzjlXB-P3VBgDq1vn4KT9oZ8fXxSc)

아래 그림과 같이 프로젝트 이름을 아무렇게 정해주고,

![](https://blogger.googleusercontent.com/img/a/AVvXsEg_Ns2c8sMFbKd37Tgtf3-s54GyMAyyl-kvv5h7w6gvzXHPH1-itgGFmCB0DvLFFunwXVlteIAezVGB2BsHxSrzXTyzx66FDCyGdulX2UUcP0Rv8ISm0IG5vVK6HtTZ79LsqwSExDGWNvy-hhAzkeZqtAtCnfwi6o7z46A1uP5T_xrUSrW6UEC35h6Holg)

이제 프로젝트가 만들어졌으면 아래 그림과 같이 대시보드로 갑시다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgshIo_eVLVweMq_e9wwUcKEFTsbgIm7zwNYMGi1YCtCs_JJEo4iEHhurdwSjtiZdBjkXWVYzpd06gvZeChuCX9lPjV7ow6rOCvsVcIfcsFgb8qVs8xOOJw7OyO8pLVCtJpPxcCl2WoMimBv5v-CWHEMPHeu5kON11my7b-pHiQXnlzBogdQKMVwYLIFO0)

이제 API를 사용해야하기 때문에 상단 그림 오른쪽 부분에 "API 개요로 이동" 링크를 누릅니다.

그러면 아래와 같이 "API 및 서비스"라는 메뉴가 나오는데 여기서 먼저, OAuth 동의 화면을 설정해야 합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjoGR6WStIesizmIywTzmfPXgyo5W_ycYRirhXxEFTLQJRu7qzmh7I2Jd8_pu0PT6eO5z-Fheek3y34sYhi0xgPLgo9B0K-ML1yi-L6HhFqPdUNUcnifTrjJ0Xo8prbDc9U-aZiIVTDE17QIbA_9PB8QQp7FPwaoh13ebc0sX9BKmUiQYnA6hre7UqPSBk)

클릭하면 아래와 같이 Internal과 External 두개가 나오는데요.

External을 선택합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgzhZ5vy2g6pA37FsBU34pD2s6pFw2PSsOyXo-9eMUoAOuzUn77SRahLVZLnAo_9yzeyFAjAXJ0aXo0v9j9xNtF0fnoTr4r7qMXrWA6YdMQUpVqKesZ-ItAjHqWrCCfK925ybpvOyd-FGQ9hLGst2Spe9rP7CrnMrBzjrPEUTRAg124BEENeVsYOAiXM24)

여기서 "만들기" 버튼을 누르면 앱 이름과 사용자 지원 이메일을 넣으라고 합니다.

앱 이름은 실제 웹 애플리케이션이 만들어졌을 때 구글 아이디 로그인시 나타나는 이름입니다.

앱 로고도 설정할 수 있으니 참고바랍니다.

우리가 만드려는 건 OAuth 클라이언트 ID입니다.

아래 그림과 같이 OAuth 클라이언트 ID를 선택합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhp_LLPsNA4_SE9T9W_wHskQBr1PVWbIaO0NbcMtmjsYVvV84gtFoSEfKxZeacYOXRVQHuFaklp-HUN7h5LK_TfKNJHyZrZpRG-3SkW7FNFD30V4Yp9EWie0PZ2Js1wGyHMkGkQAOcfd2NfmbQT0mEvStk3FQcdJrljKlBqlESTayb5hDMmZumIR5XIM74)

그리고 아래와 같이 우리가 만드려는 애플리케이션의 타입을 정해야 합니다.

당연히 웹 애플리케이션을 선택하면 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjmg7rK8py-m3AOAgL42veC8s_1MDoBrBlRdI0s2yDQdaKhFb9XyMkCWLx_RBhwYwJl3cB1lIdPTf61Iwt9tu0FQj7ind6_O7c1KY1YYvI1lbm1A1aeR0xuikC8Im1-W-sgK5yDBVLYbD54NOdPLFUHNmNQ8BkW3hEisnJ4GYcCSjOC-_hy-4MtnEYlswc)

그러면 또 앱 이름을 넣으라고 합니다.

해당 이름을 넣으면 여기서 가장 중요한 부분이 나오는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEimMrKT2XLdUFEPHpABScZhZ_l1bQ4gDt2v8ZZjC7Usnn7ko_SoXvwND8jie6MNX7KhZPi9WTp705rsPYlS2L4Vi7PYMf3c-ErlwfEdT9hgSAcmaMaPd3t6fUkPs6fD1QIFgZ5mtifvUgW1nYYXCLggmv9KgcweEzQ4IQrkjM6dMKDB6V2oOFRoYd0gMrI)

위 그림처럼 `승인된 Javascript 원본`과 `승인된 리디렉션 URI`입니다.

`승인된 Javascript 원본`은 웹 애플리케이션의 웹 주소입니다.

우리는 현재 개발서버이기 때문에 Vite 개발서버인 `http://localhost:5173`을 넣으면 됩니다.

그리고 `승인된 리디렉션 URI` 부분이 가장 중요한데요.

이 주소는 구글 아이디로 로그인했을 때의 콜백 주소를 넣는 겁니다.

우리는 개발 편의를 위해 간단하게 `http://localhost:5173/callback` 주소를 사용하겠습니다.

이제 완료되면 아래와 같이 클라이언트 ID와 클라이언트 보안 비밀번호가 나오는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjp6FqNJwCQ1kbZEP5krVuCkrm1dso4j3GxlHi8e-8DpMKe9DnRmlrh3xA7jerISH4tvZLkpgaEfVt67wKyrb_pxd8FcyVaqe8QI_3CrBYMazdwZNBnl99-WN59TgMzED1lUZ6XJ-9akb3l7O2TO7nqt3dE9CzDok0Xc27BUMLldTQUC9AnLKFqMOLyW7k)

이 두개의 문자열을 실제로 Hono 앱에서 사용할 겁니다.

이제 Google Cloud Platform의 준비가 끝났습니다.

---

## Hono로 login 라우팅 구현하기

이제 본격적인 Hono 앱을 만들어 보겠습니다.

기본적인 템플릿은 아래와 같은데요.

```ts
import { Hono } from 'hono'
import { renderer } from './renderer'

const app = new Hono()

app.use(renderer)

app.get('/', (c) => {
  return c.render(<h1>Hello!</h1>)
})

export default app
```

로그인 로직 구현이기 때문에 스타일은 신경쓰지 않겠습니다.

`/login` 라우팅을 구현하겠습니다.

```ts
import { Hono } from "hono";
import { renderer } from "./renderer";

const app = new Hono();

app.use(renderer);

// "클라이언트 등록"에서 취득한 값을 변수에 설정합니다
const CLIENT_ID =
  "2437iu9ddmt4rmq.apps.googleusercontent.com";
const CLIENT_SECRET = "GOCSPXrqFasdfasdfasdfsadfasdfaYU";
const REDIRECT_URI = "http://localhost:5173/callback";

app.get("/", (c) => {
  return c.render(<h1>Hello!</h1>);
});

app.get("/login", (c) => {
  const AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
  const params = {
    client_id: CLIENT_ID,
    response_type: "code",
    scope: "profile",
    redirect_uri: REDIRECT_URI,
  };
  return c.redirect(`${AUTH_ENDPOINT}?${new URLSearchParams(params)}`);
});

export default app;
```

코드를 보시면 먼저, CLIENT_ID, CLIENT_SECRET, REDIRECT_URI 값을 설정했습니다.

당연히 아까 구글 클라우드 플랫폼에서 얻은 클라이언트 ID와 해당 SECRET 값을 넣으면 됩니다.

`/login` 라우팅은 구글의 oauth2 REST API에 관련 정보를 이용해서 get 메서드로 HTTP 통신을 하면 됩니다.

그리고 잘 보시면 params 객체를 URLSearchParams 클래스를 이용해서 브라우저에서 사용할 수 있는 문자열의 연속으로 바꿨습니다.

여기 params 객체에서 중요한게 response_type과 scope입니다.

response_type은 'code'라고 넣으면 됩니다.

scope는 구글에서 제공하는 여러가지 서비스 관련 주소를 넣는건데요.

만약 구글 드라이브 API를 쓰려면 아래와 같이 넣으면 됩니다.

`"https://www.googleapis.com/auth/drive.readonly"`

scope를 위와 같이하면 구글 드라이브에 접근한다는 뜻입니다.

그런데, 우리는 로그인만 하기 때문에 scope를 profile로 지정했습니다.

그러면 구글 아이디의 profile을 얻을 수 있는겁니다.

이제 개발 서버를 돌려서 브라우저에서 테스트해 봅시다.

```sh
bun run dev

  VITE v5.3.4  ready in 6185 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

만약 브라우저가 기존에 구글 아이디로 로그인했었다면 본인 아이디를 사용할 거라고 물어보는 화면이 나오는데요.

시크릿 모드에서 `http://localhost:5173/login` 주소로 가면 아래와 같이 구글 계정으로 로그인하라는 화면이 뜹니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhvOTvWwJ6xc7Qa7CuW6u1mfaeY0lgHpyRr7Ex3GAMoFMS51rDXFsPK8RqGfH7V71uW901nyc6s0olT90VoOD8RQaqwHSOqfj262vNNuuUoA4zzXM_PggSKko48CyzsAap8l4_tZVnr2fvgaOhqFff35frx37PLivc6yIsK_jdQ4zVbCTRmHMwFjmV4MUM)

잘 보시면 구글 클라우드 플랫폼에서 작성한 앱 이름이 나오네요.

이제 로그인 하면 아마 유투브에서 인증하라고 나올겁니다.

그리고 마지막으로 아래와 같이 나올겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEg3RYSFvx-H1-9qqhQGjd3vnMNkrCj3mCSm-EnboaJx4dFlPTBRpToPvkkOkH3-m2eJwO9t_cU3w6PDapi7dyQ4geW0MPzfPPAYnhFv_zvBTGiz2ZLXmnqPmfkGijOMOS8MpHq3zNQlxBQXVrLoaglDGdYnBAqFUZ5MA8xQe1RSU7_lej9p1Dg94eSG1us)

이제 "계속"버튼을 누르면 로그인이 완료된건데요.

그러면 브라우저는 아래와 같이 나올겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhqVvhxYi6dj0xcuWF7XuI2RzHS3K_BIRLPnlUkcw5J2ILewdIrLifEU10Np0AtYTxxEv7yVn1w-7Ejkk1FvN8FC20A_tDEo27yAH1RjD29rN9gVEBcRqNm6Nn6tEGnnWghuZQxz8mXcQCmAfX9fjudJfb04olKp5L8sjpfzjVebgNAwW2h6GaJQiRYIBI)

위와 같이 나오는데요.

`/callback` 라우팅이 없다는 거죠.

왜 `/callback` 라우팅으로 왔냐면 바로 우리가 구글 클라우드 플랫폼에서 설정한 `승인된 리디렉션 URI` 때문입니다.

구글 oauth REST API로 관련 정보를 이용해서 로그인하면 구글은 `승인된 리디렉션 URI`로 관련 정보를 code라는 파라미터로 저장해서 보냅니다.

그래서 위 그림에서 주소창을 보시면 `code=~~~~~~~`부분이 보일겁니다.

```sh
http://localhost:5173/callback?code=4%2F0AcvDMrBF4mqy8Yl02FLi4B0p_BwltUNK0k4nyIfjd9zLFCgATa1VwCKw&scope=profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile
```
잘 분석해 보면 googleapis에서 auth 관련 userinfo.profile을 가져온겁니다.

근데 왜 에러가 떳냐면 아직 Hono 앱에서 `/callback` 라우팅을 정의하지 않아서 입니다.

이제 다시 Hono 앱에서 `/callback` 라우팅을 정의해 보도록 하겠습니다.

## callback 라우팅 구현

callback 라우팅에서 무조건 구현해야하는 거는 토큰 관련 로직입니다.

로그인을 했으면 그리고 로그인이 정확하다면 구글에서 액세스 토큰을 얻을 수 있는데요.

이 액세스 토큰을 이용해서 사용자 정보도 얻고, 구글 드라이브 API에도 접속하고 그러는 겁니다.

그래서 먼저, 액세스 토큰을 얻는 코드를 작성해 보겠습니다.

```ts

interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  refresh_token?: string;
}

interface UserInfo {
  id: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
}

app.get("/callback", async (c) => {
  const TOKEN_ENDPOINT = "https://www.googleapis.com/oauth2/v4/token";
  const code = c.req.query("code") || "";

  if (!code) {
    return c.text("Authorization code not found", 400);
  }

  const params = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: "authorization_code",
    code: code,
    redirect_uri: REDIRECT_URI,
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

    return c.json(access_token);
  } catch (error) {
    return c.text("An error occurred during token exchange", 500);
  }
});
```

위 코드를 잘 보시면 먼저, TokenResponse 타입과 UserInfo 타입을 정의했습니다.

UserInfo 타입은 나중에 쓸 겁니다.

TOKEN_ENDPOINT를 정의했고, 그 다음에 params 값을 지정하면 되는데요.

중요한 거는 아까 콜백 주소창에 있던 `code`라는 URL 파라미터 값입니다.

이제 TOKEN_ENDPOINT로 fetch를 POST 메서드로 하면 됩니다.

body 부분은 params입니다.

이제 리턴된 데이터에서 access_token을 뽑아내면 됩니다.

브라우저 화면을 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEgpJ0Y_-sMIla6j2RhgBWOyLo4I9wTmP-NtVPoiqLqC7wzhOWkXxXc3saq27RD5mkII_6oUxAoAxxAw5VBEIATIDTe3etRGWsfK2p0ro6NH92DYvLBonEI88aLsK4f0lyjYZOTGBz4Vt7qSqbb7kjTwnxbHeh0Twb-5qeBqs_l5hTI2VrgCQvtrlqZElUY)

우리의 액세스 토큰이 잘 얻어지고 있습니다.

이제 이 액세스 토큰을 활용해서 구글 유저 정보를 얻어오는 코드와 해당 정보를 쿠키에 저장하는 코드만 작성하면 됩니다.

```ts
import { setCookie } from "hono/cookie";

...
...
...


app.get("/callback", async (c) => {
  const TOKEN_ENDPOINT = "https://www.googleapis.com/oauth2/v4/token";
  const code = c.req.query("code") || "";

  if (!code) {
    return c.text("Authorization code not found", 400);
  }

  const params = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: "authorization_code",
    code: code,
    redirect_uri: REDIRECT_URI,
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

    const userInfoResponse: any = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
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

    const userInfo: UserInfo = await userInfoResponse.json();
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

export default app;
```

먼저, setCookie 함수를 import 합시다.

```ts
import { setCookie } from "hono/cookie";
```

위 코드를 잘 보시면 아까 얻었던 액세스 토큰을 이용해서 다음 주소를 이용해서 정보를 얻어오고 있습니다.

`https://www.googleapis.com/oauth2/v2/userinfo`

로그인을 다시해보면 콘솔창에는 아래와 같이 userInfo 값이 출력될겁니다.

```sh
{
  id: '1105846834656',
  name: 'M~~~~~m',
  given_name: 'M~~~~~~~~~~',
  family_name: '~~~~',
  picture: 'https://lh3.googleusercontent.com/a/ACg8ocJchdcIu6QL8IWodm0_sYiMsU55E_a9O4g=s96-c'
}
```

이제 우리가 얻은 사용자 정보를 쿠키에 저장해서 로그인됐는지 확인할 때 사용해야 합니다.

아래 코드를 보시면 Buffer를 이용해서 'base64'로 userInfo 값을 인코딩했고 그 정보를 sessionCookie 값에 저장했습니다.

```ts
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
```

그리고 Hono에서 제공해주는 setCookie 함수를 이용해서 sessionCookie 값을 "session"이라는 이름으로 쿠키 형태로 저장했습니다.

이제 크롬 개발자 모드로 들어가서 쿠키란을 보면 아래와 같이 쿠키가 저장된걸 볼 수 있을 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEizJNn7Cy6uobQxaGgnAOHAA5BPwfEJvsfi8cxvS9FCXevAPfXwxdU5g48hknv2S2lmjj9wENU6qUePbPBBRAjV_hGSCZ3wOuHTaNs8OuQUwgxEy3COXxs1m_gzykAupu0CBXBqmj-XQv0FLADIYllQada4-5uFSgKIfUCqVkcIzIgM62XLBK3RXaJl1eY)

쿠키 이름이 "session"이라고 했는데, 조금은 앱과 연관된 특이한 이름을 사용하는게 좋습니다.

그리고 코드 마지막에 보시면 "/" 라우팅으로 redirect 된걸 알 수 있을 겁니다.

---

## 로그인 여부 확인하기

이제 코드의 80%가 완성됐는데요.

"/" 라우팅에서 "session" 쿠키 여부에 따라 로그인 여부를 확인하고 화면에 다르게 보여줘야 하는데요.

해당 로직을 작성해 보겠습니다.

```ts
import { getCookie, setCookie } from "hono/cookie";

...
...
...

app.get("/", (c) => {
  const session = getCookie(c, "session");
  if (session) {
    const userInfo: UserInfo = JSON.parse(
      Buffer.from(session, "base64").toString("utf-8")
    );
    // return c.json({ message: "Logged in", user: userInfo });
    return c.render(
      <>
        <h1>welcome : {userInfo.id}</h1>
        <img src={userInfo.picture} />
        <form method="post" action="/logout">
          <button type="submit">logout</button>
        </form>
      </>
    );
  }

  return c.text("Welcome to the home page. Please log in.");
});
```

먼저, Hono에서 제공해주는 getCookie 함수를 import 합시다.

getCookie 함수를 이용해서 "session"이라는 이름의 쿠키를 얻어 오는데요.

그걸 다시 Buffer를 이용해서 "base64" 디코드해서 userInfo 변수에 저장합니다.

그리고 해당 정보를 이용해서 아래 그림과 같이 화면에 뿌려주는데요.

그리고 logout 버튼도 만들었습니다.

먼저, 해당 화면입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhOLVhUohHv4QG19yMPj3i4nAH_BYvtHKVNnBHM8mzvX33ou8Rt6gMqfT7QB4AIdPs7Yt2jTNcUJH2B2zx8dLH7ujujXjmbphrL1e65ITJJoDZPu6vcAbLuCqYqzF-Q3ni9AoELLo9efP20v9Sv0KgW6SBrvWryRP8Pc0kPK5ktPmCE5NHUQP7hTHOU-oU)

위 그림과 같이 id와 picture가 잘 보입니다.

이제 logout 로직을 만들어야 하는데요.

logout 로직은 간단합니다.

"session"이라는 이름의 쿠키를 삭제하면 됩니다.

```ts
app.post("/logout", async (c) => {
  deleteCookie(c, "session");
  return c.redirect("/");
});
```

위와 같이 POST 메서드로 '/logout' 주소로 보내면 됩니다.

deleteCookie로 "session" 쿠키를 삭제하고 "/"로 redirect 하면 끕입니다.

당연히 deleteCookie도 import 하시면 됩니다.

로그아웃 버튼을 눌러보면 브라우저가 아래와 같이 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhR21TuPq4_MFyJ9eg9SaTVOyFoBH2HwZbe6g3m-qwhdQDGkGEvtci1_BI5EPUq9nwtXXJFGFoTlYiBZHSmLbr6Al8udnuPhB31n82AfG1xM_P9sFoL4wFRBllDtEIqUEW78oni-yBA-3lKusaqSPaDP4CMxv_h3gzoqTLtEXEx4uWJUiv2j7pBQe41--k)

우리가 의도했던데로 로그아웃이 구현되었네요.

---

이로써 Hono와 Google OAuth를 이용한 로그인 로직을 구현해 봤는데요.

많은 도움이 됐으면 합니다.

그럼.

