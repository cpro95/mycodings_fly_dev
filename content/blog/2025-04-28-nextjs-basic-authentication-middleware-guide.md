---
slug: 2025-04-28-nextjs-basic-authentication-middleware-guide
title: Next.js 프로젝트로 Basic Auth(기본 인증) 구현해 보기
date: 2025-04-28 10:41:05.199000+00:00
summary: Next.js 프로젝트에 간단하면서도 효과적인 보호막을 치는 방법, 바로 기본 인증(Basic Authentication) 설정에 대해 알아보려고 합니다.
tags: ["next.js", "기본 인증", "Basic Authentication", "미들웨어", "웹 보안"]
contributors: []
draft: false
---

안녕하세요!

오늘은 Next.js 프로젝트에 간단하면서도 효과적인 보호막을 치는 방법, 바로 기본 인증(Basic Authentication) 설정에 대해 알아보려고 합니다.

웹사이트의 특정 페이지들을 아무나 들어오지 못하게 막고 싶을 때, 예를 들어 아직 개발 중인 페이지나 내부 관리자 페이지만 허가된 사용자에게 보여주고 싶을 때 유용하게 사용할 수 있는 방법입니다.

마치 우리 집 현관문에 간단한 도어락을 설치하는 것과 비슷하다고 생각하면 이해하기 쉬울 것 같습니다.

이 글에서는 Next.js의 강력한 기능 중 하나인 미들웨어(Middleware)를 활용해서 어떻게 기본 인증(Basic Authentication)을 구현하는지, 마치 옆에서 알려주듯 차근차근 설명해 드릴 예정입니다.

### 1. 기본 인증(Basic Authentication)이란 무엇일까요?

먼저 기본 인증(Basic Authentication)이 정확히 무엇인지부터 짚고 넘어가야 하는데요.

이것은 웹 통신 규약인 HTTP(Hypertext Transfer Protocol)에서 정의된 가장 기본적인 사용자 인증 방식 중 하나입니다.

작동 원리는 생각보다 간단합니다.

1.  사용자가 보호된 페이지에 접속하려고 하면, 웹 서버는 "이봐요, 여기는 아무나 들어올 수 없으니 신분증(아이디와 비밀번호)을 보여주세요!"라는 의미의 신호(401 Unauthorized 응답 코드와 함께 `WWW-Authenticate` 헤더)를 브라우저에게 보냅니다.
2.  이 신호를 받은 웹 브라우저는 사용자에게 아이디와 비밀번호를 입력하라는 작은 팝업창을 띄워줍니다.
3.  사용자가 아이디와 비밀번호를 입력하고 확인을 누르면, 브라우저는 이 정보를 `아이디:비밀번호` 형식으로 합친 뒤, 베이스64(Base64)라는 방식으로 간단하게 인코딩(부호화)합니다. **중요한 점은 베이스64(Base64)는 암호화가 아니라는 것입니다!** 그냥 특정 규칙에 따라 글자들을 잠시 다른 모습으로 바꾸는 것뿐이라서, 누구든 쉽게 원래의 아이디와 비밀번호로 되돌릴 수 있습니다.
4.  이렇게 인코딩된 값 앞에 "Basic "이라는 접두사를 붙여서 `Authorization`이라는 이름표가 붙은 HTTP 헤더(HTTP Header)에 담아 웹 서버로 다시 요청을 보냅니다.
5.  웹 서버는 이 `Authorization` 헤더를 받아서 베이스64(Base64) 인코딩된 값을 다시 원래의 `아이디:비밀번호`로 디코딩(해독)한 후, 미리 저장된 정확한 아이디/비밀번호와 일치하는지 비교합니다.
6.  일치하면 "오케이, 들어오세요!" 하고 페이지 접근을 허용하고(200 OK 응답), 일치하지 않으면 다시 1번 과정처럼 신분증을 요구하는 신호를 보냅니다.

이처럼 기본 인증(Basic Authentication)은 구현이 매우 간단하다는 장점이 있지만, 아이디와 비밀번호가 암호화되지 않고 단순히 인코딩만 되어 전송되기 때문에 보안 수준이 높지는 않습니다.

따라서 민감한 정보가 오가는 실제 서비스의 메인 로그인 시스템으로 사용하기에는 부적합합니다.

하지만 앞서 말했듯이, **개발 중인 사이트의 임시 접근 제한**이나 **내부 관리 도구 접근 제어** 등 가벼운 보안이 필요한 상황에서는 아주 유용하게 쓰일 수 있습니다.

### 2. Next.js 미들웨어(Middleware), 왜 사용할까요?

그렇다면 왜 우리는 Next.js의 미들웨어(Middleware)를 사용해서 기본 인증(Basic Authentication)을 구현해야 할까요?

미들웨어(Middleware)는 Next.js에서 특정 페이지 요청이 실제 페이지 로직에 도달하기 *전에* 먼저 실행되는 코드 조각입니다.

마치 건물의 출입구에 서 있는 보안 요원과 같다고 생각할 수 있습니다. 방문객(웹 요청)이 건물 안(페이지)으로 들어가기 전에 보안 요원(미들웨어)이 먼저 신분증을 확인하거나 방문 목적을 묻는 등의 절차를 거치는 것과 비슷합니다.

이 미들웨어(Middleware)를 사용하면 다음과 같은 장점들이 있습니다.

*   **중앙 집중 관리:** 인증 로직을 여러 페이지에 각각 구현할 필요 없이, 미들웨어(Middleware) 파일 하나에서 통합적으로 관리할 수 있습니다. 코드가 깔끔해지고 유지보수가 쉬워집니다.
*   **선제적 대응:** 페이지 콘텐츠가 렌더링되기 전에 미리 인증 체크를 수행하므로, 인증되지 않은 사용자의 불필요한 접근 시도를 원천적으로 차단할 수 있습니다.
*   **유연한 경로 설정:** 어떤 경로(페이지들)에 이 미들웨어(Middleware)를 적용할지 유연하게 설정할 수 있습니다. 예를 들어 `/admin`으로 시작하는 모든 경로에만 인증을 적용하거나, 특정 페이지만 보호하는 것이 가능합니다.

따라서 넥스트JS(Next.js)에서 기본 인증(Basic Authentication)과 같은 요청 전처리 로직을 구현할 때는 미들웨어(Middleware)가 아주 이상적인 선택지입니다.

### 3. 차근차근 따라 해보는 기본 인증 구현

자, 이제 이론 설명은 충분히 한 것 같으니 직접 코드를 작성하며 기본 인증(Basic Authentication)을 구현해 보도록 하겠습니다.

Next.js 프로젝트가 이미 준비되어 있다고 가정하고 진행하겠습니다.

(만약 없다면 `npx create-next-app@latest` 명령어로 간단히 생성할 수 있습니다.)

**프로젝트 구조 및 파일 생성**

Next.js 프로젝트의 루트 디렉토리(최상위 폴더)나 `src` 폴더(만약 사용 중이라면) 바로 아래에 `middleware.ts` 라는 이름의 파일을 생성합니다.

타입스크립트(TypeScript)를 사용하지 않는다면 `middleware.js`로 생성해도 괜찮습니다.

```
my-next-app/
├── src/                 <-- src 폴더를 사용한다면 이 안에
│   └── middleware.ts    <-- 여기에 미들웨어 파일 생성!
├── pages/
├── public/
├── package.json
└── ... (기타 파일들)

또는

my-next-app/
├── middleware.ts        <-- src 폴더가 없다면 루트에 생성!
├── pages/
├── public/
├── package.json
└── ... (기타 파일들)
```

**미들웨어 코드 작성 (`middleware.ts`)**

이제 생성한 `middleware.ts` 파일 안에 다음 코드를 입력합니다.

코드 각 줄이 어떤 역할을 하는지 주석과 함께 자세히 설명해 드리겠습니다.

```typescript
// 필요한 모듈들을 가져옵니다. Next.js 서버 기능과 요청/응답 타입을 사용합니다.
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 미들웨어 함수를 정의합니다. 모든 미들웨어 로직은 이 함수 안에 작성됩니다.
export function middleware(req: NextRequest) {
  // 1. 요청 헤더에서 'authorization' 값을 가져옵니다.
  //    브라우저가 보내주는 아이디/비밀번호 정보가 여기에 담겨 있을 수 있습니다.
  const basicAuth = req.headers.get('authorization');

  // 2. 'authorization' 헤더가 존재하는지 확인합니다.
  if (basicAuth) {
    // 3. 헤더 값은 보통 "Basic <인코딩된 값>" 형태이므로, "Basic " 부분을 제외한
    //    실제 인코딩된 값만 추출합니다.
    const authValue = basicAuth.split(' ')[1];

    // 4. 베이스64(Base64)로 인코딩된 값을 디코딩하여 원래의 '아이디:비밀번호' 문자열로 변환합니다.
    //    Node.js의 내장 Buffer 객체를 사용합니다.
    //    디코딩된 문자열을 ':' 기준으로 분리하여 아이디와 비밀번호를 각각 변수에 저장합니다.
    //    만약 ':' 문자가 없다면 분리되지 않고 하나만 반환될 수 있으므로 주의가 필요합니다. (이 예제에서는 기본적인 경우만 다룹니다)
    const [user, pwd] = Buffer.from(authValue, 'base64').toString().split(':');

    // 5. 디코딩된 아이디와 비밀번호가 우리가 설정한 값과 일치하는지 확인합니다.
    //    ★★★ 중요 ★★★
    //    실제 프로젝트에서는 아이디와 비밀번호를 코드에 직접 작성하면 절대 안 됩니다!
    //    보안상 매우 취약하므로, 반드시 환경 변수(.env 파일 등)를 사용해야 합니다.
    //    아래는 환경 변수를 사용하는 예시입니다.
    const expectedUser = process.env.BASIC_AUTH_USER;
    const expectedPassword = process.env.BASIC_AUTH_PASSWORD;

    // 환경 변수가 설정되었는지 먼저 확인하는 것이 좋습니다.
    if (!expectedUser || !expectedPassword) {
      console.error("기본 인증 환경 변수(BASIC_AUTH_USER, BASIC_AUTH_PASSWORD)가 설정되지 않았습니다.");
      // 이 경우, 인증 실패로 처리하거나 서버 에러를 반환할 수 있습니다.
      // 여기서는 간단히 인증 실패로 처리하겠습니다.
      return new Response('Authentication required.', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Secure Area"',
        },
      });
    }

    // 사용자가 입력한 정보와 환경 변수에 설정된 정보가 모두 일치하는지 비교합니다.
    if (user === expectedUser && pwd === expectedPassword) {
      // 6. 아이디와 비밀번호가 모두 일치하면, 요청을 그대로 통과시킵니다.
      //    즉, 사용자가 요청한 페이지로 접근을 허용합니다.
      return NextResponse.next();
    }
  }

  // 7. 'authorization' 헤더가 없거나, 아이디/비밀번호가 일치하지 않으면
  //    인증이 필요하다는 응답(401 Unauthorized)을 보냅니다.
  //    'WWW-Authenticate' 헤더는 브라우저에게 기본 인증 팝업창을 띄우라고 알려주는 역할을 합니다.
  return new Response('Authentication required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"', // "Secure Area"는 팝업창에 표시될 영역 이름입니다. 자유롭게 변경 가능합니다.
    },
  });
}

// 미들웨어를 어떤 경로에 적용할지 설정하는 부분입니다.
export const config = {
  // matcher 배열 안에 지정된 경로 패턴에만 위 middleware 함수가 실행됩니다.
  // 예: '/about' 페이지와 그 하위 모든 페이지, '/dashboard' 페이지와 그 하위 모든 페이지에 적용
  matcher: ['/about/:path*', '/dashboard/:path*'],
  // 예: '/admin'으로 시작하는 모든 경로에 적용하려면: matcher: ['/admin/:path*']
  // 예: 특정 페이지만 보호하려면: matcher: ['/secret-page']
};
```

**환경 변수 설정 (`.env.local`)**

위 코드에서 강조했듯이, 아이디와 비밀번호를 코드에 직접 넣는 것은 매우 위험합니다.

대신 프로젝트 루트 디렉토리에 `.env.local` 파일을 만들고 그 안에 다음과 같이 실제 사용할 아이디와 비밀번호를 환경 변수로 저장합니다.

`.env.local` 파일은 보통 버전 관리 시스템(예: Git)에 포함되지 않도록 `.gitignore` 파일에 추가하는 것이 좋습니다.

```
# .env.local 파일 내용

BASIC_AUTH_USER=여기에_사용할_아이디를_입력하세요
BASIC_AUTH_PASSWORD=여기에_사용할_비밀번호를_입력하세요
```

이렇게 설정하면 `middleware.ts` 코드 안의 `process.env.BASIC_AUTH_USER` 와 `process.env.BASIC_AUTH_PASSWORD` 부분에서 `.env.local` 파일에 정의된 값을 안전하게 가져와 사용할 수 있습니다.

**서버를 다시 시작해야 환경 변수 변경 사항이 적용됩니다.**

### 4. 제대로 작동하는지 확인해봅시다!

이제 모든 설정이 끝났습니다! 터미널에서 `npm run dev` (또는 `yarn dev`) 명령어를 실행하여 Next.js 개발 서버를 시작합니다.

그리고 웹 브라우저를 열어 `config`의 `matcher`에 설정한 경로(예: `http://localhost:3000/about` 또는 `http://localhost:3000/dashboard`)로 접속해 보세요.

*   정상적으로 설정되었다면, 아이디와 비밀번호를 묻는 작은 팝업창이 나타날 것입니다.
*   `.env.local` 파일에 설정한 아이디와 비밀번호를 정확히 입력하면 해당 페이지로 이동합니다.
*   만약 잘못된 정보를 입력하거나 취소를 누르면 "Authentication required." 라는 메시지가 보이거나 계속 팝업창이 뜰 것입니다.
*   `matcher`에 설정하지 않은 다른 페이지(예: 홈페이지 `/`)는 아무런 제약 없이 바로 접근될 것입니다.

### 주의할 점 및 보안 고려 사항

기본 인증(Basic Authentication)은 구현이 간단하지만, 몇 가지 중요한 주의사항이 있습니다.

*   **베이스64(Base64)는 암호화가 아닙니다:** 앞서 강조했듯이, 베이스64(Base64)는 누구나 쉽게 원래 값으로 되돌릴 수 있는 인코딩 방식일 뿐입니다. 따라서 네트워크 통신 중간에 누군가 데이터를 가로챈다면 아이디와 비밀번호가 그대로 노출될 위험이 있습니다.
*   **반드시 HTTPS 사용:** 이 문제를 해결하는 가장 중요한 방법은 웹사이트 전체에 HTTPS(SSL/TLS 암호화)를 적용하는 것입니다. HTTPS는 브라우저와 서버 간의 모든 통신 내용을 암호화하므로, 기본 인증(Basic Authentication) 헤더 정보도 암호화된 상태로 전송되어 중간에서 가로채더라도 내용을 알아볼 수 없게 만듭니다. **HTTPS 없이 HTTP 환경에서 기본 인증을 사용하는 것은 매우 위험합니다.**
*   **적절한 사용처:** 보안 강도가 낮기 때문에, 외부에 완전히 공개되는 서비스의 메인 로그인 기능으로는 절대 사용하면 안 됩니다. 대신, 내부 테스트 환경, 개발 버전 미리보기, 간단한 관리자 페이지 접근 제한 등 **신뢰할 수 있는 소수의 사용자만 접근**하고 **민감 정보 유출 위험이 적은 곳**에 제한적으로 사용하는 것이 바람직합니다.

### 마무리하며

오늘은 넥스트JS(Next.js)의 미들웨어(Middleware)를 활용하여 기본 인증(Basic Authentication)을 설정하는 방법에 대해 자세히 알아보았습니다.

간단한 설정만으로도 특정 페이지에 대한 접근을 효과적으로 제어할 수 있다는 것을 확인하셨을 텐데요.

핵심은 **미들웨어(Middleware) 파일을 생성**하고, 요청 헤더에서 **`Authorization` 정보를 확인**한 뒤, **베이스64(Base64) 디코딩**을 통해 얻은 아이디/비밀번호를 **환경 변수에 저장된 값과 비교**하는 것입니다.

그리고 보안을 위해 **아이디/비밀번호는 반드시 환경 변수로 관리**하고, **HTTPS 사용을 필수**로 해야 한다는 점을 꼭 기억해 주시길 바랍니다.

이제 여러분의 넥스트JS(Next.js) 프로젝트에도 필요에 따라 간단한 보호 장치를 마련할 수 있게 되었습니다!

물론 더 강력한 보안이 필요하다면 OAuth, JWT(JSON Web Token) 등 다른 인증 방식들을 알아보는 것이 좋겠지만, 기본 인증(Basic Authentication)은 특정 상황에서 아주 빠르고 간편하게 적용할 수 있는 유용한 도구임은 틀림없습니다.
