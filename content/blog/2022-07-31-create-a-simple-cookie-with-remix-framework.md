---
slug: 2022-07-31-create-a-simple-cookie-with-remix-framework
title: Remix 프레임워크에서 쿠키(Cookie)를 만들어 봅시다.
date: 2022-07-31 03:39:12.294000+00:00
summary: Remix 프레임워크에서 간단한 쿠키 생성, 테스트 알아보기
tags: ["cookie", "remix"]
contributors: []
draft: false
---

안녕하세요?

쿠키는 클라이언트 쪽 브라우저와 서버 사이에 간단하게 데이터를 교환할 수 있게 해주는 고마운 녀석인데요.

오늘은 Remix Framework에서 쿠키를 어떻게 만들고 사용하는지 알아보겠습니다.

## Remix

Remix는 React 생태계에 나온 지 얼마 안 된 신생 프레임워크인데요.

Next.js를 위협할 수 있는 차세대 프레임워크로 서버와 클라이언트 사이의 갭을 쉽게 메꿔주며, 개발자로 하여금 쉽게 프로그래밍할 수 있게 해 줍니다.

특히, 리믹스는 쿠키 관련 createCookie라는 헬퍼 유틸을 제공해 주는데요.

그럼, 본격적으로 코딩에 들어가 볼까요?

```js
npx create-remix cookies-in-remix
```

리믹스는 몇 가지 세팅이 필요한데요.

우리는 테스트용이기 때문에 아래 그림처럼 세팅하시면 됩니다.

![mycodings.fly.dev-howto-remix-cookie](https://blogger.googleusercontent.com/img/a/AVvXsEg3ot1CfqiLM6oQXdMch12jYfp-crw5IEcElvDp2EmD5YeYCsO6RPM75hJlUnSTQnJASls9_Pbq3tgM67aKbxljEVyBADnQLhGAdebeghHIaz3DUXTnV0fNSQEUuf8odQY9eXw9lpYNAF2oGs471_1YRvshtHm6umwu0YkTbYCyEydmCvtcH38kku3J=s16000)

그다음으로 가장 기본이 되는 route인 index.tsx 파일을 수정해 볼까요?

`app/routes/index.tsx`

```js
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

export const loader = () => {
  return json({ message: 'hello' })
}

const Index = () => {
  const data = useLoaderData()
  return <pre>{JSON.stringify(data, null, 2)}</pre>
}

export default Index
```

리믹스는 파일 베이스 라우팅(file-based routing)을 제공하는데요.

app 폴더 밑에 여러분의 컴포넌트를 넣으면 되고요,

라우팅이 필요하면 app/routes 폴더 밑에 컴포넌트를 두면 파일 이름 그대로 라우팅을 걸 수 있습니다.

`app/routes/index.tsx`이라는 이름이기 때문에 그냥 http://localhost:3000/ 에 해당되는 라우팅 컴포넌트가 되는 거죠.

그리고 loader 함수가 있는데요.

loader 함수는 페이지가 로드될 때 가장 먼저 로드되는 서버사이드 쪽 함수인데요.

여기서 서버사이드 쪽 코드를 작성하고 return 하면 그 데이터가 클라이언트 쪽의 useLoaderData 함수를 통해서 사용할 수 있습니다.

json 헬퍼 유틸은 리믹스에서 제공해 주는데요. 쉽게 json 형식으로 return 할 수 있어 좋습니다.

![mycodings.fly.dev-howto-remix-cookie](https://blogger.googleusercontent.com/img/a/AVvXsEgRtznzo_WM82Xza-Ai-UqaYH4X5FhaUDyfVPHypu3fTj3enpz-W8g0gkylwI3E6YfF1R3dsycrcY-HYcRn9GYPKUxv0THOhNBwAUkQ2GLCrr2d4tG52mlEIlC5xFrYsSCibDlRtOGdZwNu0ntFxTdY9Cx_kdRWjTxGm4TbzGghMP4kxBfB9Vi7Dr6n=w400-h166)

실행 결과는 위와 같이 나옵니다.

클라이언트 쪽 브라우저에 보이는 리액트 컴포넌트는 loader 함수에서 리턴한 객체를 단순하게 `<pre>` 태그로 통해 그대로 보여주고 있습니다.

## 쿠키를 활용해 보자

만약에 클라이언트 쪽에서 사용자가 우리 홈페이지를 한 번이라도 방문한 적이 있다면 단순하게 "안녕하세요"라고 할게 아니라 "다시 오셔서 감사합니다"라고 하는 게 더 좋지 않을까요?

이럴 때 쓰이는 기술이 바로 쿠키인데요.

리믹스에서 쿠키를 만들어 봅시다.

리믹스는 createCookie 헬퍼 유틸을 제공해 주는데요.

쿠키의 역할은 일종의 Boolean처럼 true / false의 개념만 있다고 생각하시면 됩니다.

좀 더 복잡한 데이터는 세션 쿠키를 이용해야 합니다.

세션 쿠키는 다음 시간에 알아보도록 하겠습니다.

자, 그러면 리믹스에서 쿠키를 만드는 코드를 작성해 볼까요?

`app/utils/cookies.tsx` 파일을 만듭시다.

```js
import { createCookie } from '@remix-run/node'

export const hasUserVisited = createCookie('has-user-visited')
```

리믹스가 제공해 주는 createCookie는 인자로 문자열을 받는데요.

우리가 참 거짓으로 판단할 수 있게 적당한 표기를 하면 됩니다.

저는 여기서 "has-ever-visited"라고 "여기를 방문한 적이 있느냐?"라고 표기했습니다.

당연히 "has-ever-visited"라는 쿠키가 있다면 사용자가 홈페이지에 방문한 적이 있다고 여기면 됩니다.

만약에 "has-ever-visited"라는 쿠키가 없으면 처음 방문한 것이 됩니다.

이제 쿠키를 만들었으니 index.tsx 파일에 적용해 볼까요?

```js
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { hasUserVisited } from '~/utils/cookies'

export const loader = async () => {
  return json({});
}

const Index = () => {
  const data = useLoaderData()
  return <pre>{JSON.stringify(data, null, 2)}</pre>
}

export default Index
```

실행 결과를 볼까요?

![mycodings.fly.dev-howto-remix-cookie](https://blogger.googleusercontent.com/img/a/AVvXsEgNMWUfpYrDBVtSXJ4eK-_nj--r3gOyYacdxuCG4ZM_wz0gp7QFYUCofs7xVTS5TanhXo7R1TAxX6zUGuhs59gEWlcP29EwEYe33kaBf77XhfZBWxO-LX9RvrJfWspZvni4LW2PVXFO8YFtudL_G6WoIs533bXbEIHrJUKfVAryPrvrvtGfRluuND4n=s16000)

새로 고침을 계속해도 바뀌는 게 없을 겁니다.

왜냐하면 loader 함수에서 빈 json을 리턴하기 때문입니다.

이제 loader 함수에 쿠키 관련 코드를 넣어 볼까요?

```js
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { hasUserVisited } from "~/utils/cookies";

export const loader = async ({ request }: { request: Request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const hasUserVisitedPage = await hasUserVisited.parse(cookieHeader);

  const message = hasUserVisitedPage
    ? "Hey, I know you! Welcome back!"
    : "Hello, I haven't met you before";

  return json({ message });
}

const Index = () => {
  const data = useLoaderData();
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
};

export default Index;
```

코드를 좀 뜯어보면 request의 헤더에서 "Cookie"라고 지정되어 있는 이름으로 데이터를 가져오고 그걸 cookieHeader라는 값으로 저장합니다.

그리고 다시 우리가 만들었던 hasUserVisited 쿠키의 parse 함수를 통해 cookieHeader 값을 점검하는 거죠.

그래서 우리가 만들었던 쿠키가 있으면 성공하는 거고 없으면 null을 리턴하기 때문에,

우리가 원하는 message 값이 할당되는 겁니다.

실행 결과를 볼까요?

![mycodings.fly.dev-howto-remix-cookie](https://blogger.googleusercontent.com/img/a/AVvXsEg2fv0-8XLs6iDjDaPS5VEj8fj28Q1SnfMVH1CWfTWf6apn1Pk_CUOftzvhGZXHzg4waKukfzozd11TnmksTXW2eMSbOPVyvIy8Os2kbGnkw7QyuwiPMx8QfKPfBWfp4oUdSBIY9rzUypdq_W9n4HUExFfMJM22JK2m4kTCzPtVg0XV1gHuDnVZWMhq=s16000)

이번에는 새로고침을 해볼까요?

역시나 그대로입니다. 왜 그런 걸까요?

위 코드는 쿠키를 읽어 오는 코드만 있지 실제 쿠키를 저장하는 코드가 없기 때문입니다.

createCookie라는 리믹스 헬퍼 유틸은 리믹스 프레임워크상에서 쓸 쿠키를 만들어 주는 유틸이지 실제 브라우저에 쿠키를 만들어 주지는 않죠.

그러면 브라우저에 쿠키를 만들려면 어떻게 해야 할까요?

그냥 단순하게 loader 함수에서 데이터를 리턴할 때 헤더 정보에 Set-Cookie 관련 정보를 함께 넘겨주면 브라우저가 header 정보를 그대로 로컬 브라우저에 반영하게 됩니다.

코드를 다시 고쳐 볼까요?

```js
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { hasUserVisited } from "~/utils/cookies";

export const loader = async ({ request }: { request: Request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const hasUserVisitedPage = await hasUserVisited.parse(cookieHeader);

  const message = hasUserVisitedPage
    ? "Hey, I know you! Welcome back!"
    : "Hello, I haven't met you before";

  if (hasUserVisitedPage) {
    return json({ message });
  }

  return json(
    { message },
    {
      headers: {
        "Set-Cookie": await hasUserVisited.serialize({}),
      },
    }
  );
}

const Index = () => {
  const data = useLoaderData();
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
};

export default Index;
```
좀 더 코드가 길어졌지만 우리가 원하는 headers 정보를 "Set-Cookie"라고 지정해 주고 있습니다.

크롬의 Dev Tools로 보시면 애플리케이션 항목이 있습니다.

거리서 왼쪽에 쿠키 쪽을 보시면 아래 그림처럼 나올 겁니다.

![mycodings.fly.dev-howto-remix-cookie](https://blogger.googleusercontent.com/img/a/AVvXsEhmr8YfagSpGV8m7NEINstWUViJZ9XsG7sclx9aUW5C2QK5rlWP9LjQAM0GkQnl1TI9vsk0_BRms-W8MGUiYMK0hDcmtdYNxUxm5cQRRR9jzTuu1KXmSlJT1bMnrF0uULszyrjF7Mq2Lahm1dFeQe3QfSxR1JH8uW-MZICS4WQvfrqiBBbfIws9At4A=s16000)

has-ever-visited라는 이름의 쿠키가 보이시죠?

이제 새로고침을 하면 다음과 같이 나올 겁니다.

![mycodings.fly.dev-howto-remix-cookie](https://blogger.googleusercontent.com/img/a/AVvXsEhlBXLV0d1QeKLq1NtSSHdR5U0N7JthQEMX178j6nPGI9MC_9LlruLk6s6LEqUuSGNC8vCnRPM5cLIFLFFAA_R_VDA7cleKhDUO2NVHQQDaszd_uPdhsrj-TIAZgZei7GBXLj5R7VT6xzvsKRMvjyAuRXc1RlrRlH8k3u6zgcG0uQS27C1kiHtZg3jU=s16000)

쿠키가 정상적으로 작동되고 있다는 뜻입니다.

그럼.