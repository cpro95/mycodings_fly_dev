---
slug: 2022-07-30-store-data-in-a-cookie-with-sessions-remix
title: Remix에서 세션을 이용한 쿠키 사용해 보기
date: 2022-07-31 07:18:58.835000+00:00
summary: Remix 프레임워크에서 세션을 이용한 쿠키 작동 설명
tags: ["cookie", "session", "remix"]
contributors: []
draft: false
---

안녕하세요?

지난 시간에는 Cookie를 이용해서 사용자가 페이지에 한 번 방문했었는지 체크하는 로직을 Remix Framework에서 만들었는데요.

단순하게 Cookie는 Boolean처럼 참/거짓 로직에는 사용할 수 있지만 좀 더 특정한 데이터를 저장하는 역할에는 부족합니다.

그래서 필요한 게 세션(Session)인데요.

Remix에서는 createCookieSessionStorage() 함수를 제공해 줍니다.

그럼, 지난 시간의 코드 템플릿에 아래 코드를 추가해 볼까요?

`app/utils/count-session.tsx`

```js
import { createCookieSessionStorage } from '@remix-run/node'

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: 'count-session',
    },
  })
```

createCookieSessionStorage() 함수는 아래 세 가지의 함수를 돌려보내는데요.

- getSession : cookie string에서 세션을 회수.

- commitSession: 새로운 cookie string 생성.

- destroySession: session data를 삭제하고 cookie string을 반환.

위 코드에서 보면 cookie string을 `count-session`이라고 이름 지었습니다.

그래서 쿠키 문자열이 `count-session`인 세션을 제공해 주는데요.

이제 실제 이 세션을 이용한 응용 페이지를 만들어 볼까요?

`app/routes/count.tsx` 파일을 만들 건대요.

`http://localhost:3000/count` 주소로 이동하면 됩니다.

`routes` 폴더 밑에 `count`라는 이름으로 파일을 만들었기 때문에 위 주소가 되는 겁니다.

```js
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getSession, commitSession } from "~/utils/count-session";

export const loader = async ({ request }: { request: Request }) => {
  
}

const Count = () => {
  const data = useLoaderData();
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
};

export default Count;
```

기본적인 Count 컴포넌트의 구조는 loader 함수에서 서버사이드 쪽 처리를 한 다음 그 데이터를 클라이언트 쪽에서 그냥 단순하게 `<pre>` 태그로 보여주는 구조입니다.

우리가 loader 함수에서 해야 하는 일을 정리해 볼까요?

- 쿠키 헤더에서 세션을 읽어오고,

- 세션이 있으면 1을 증가시키고, 없으면 1로 세팅

- 새로운 cookie string을 만들고

- 업데이트된 쿠키를 헤더와 함께 response로 새로운 값을 가져옵니다.

그러면 실제 코드를 볼까요?

```js
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getSession, commitSession } from "~/utils/count-session";

export const loader = async ({ request }: { request: Request }) => {
  // Read session from cookie
  const session = await getSession(request.headers.get("Cookie"));

  // Increment by 1 if exists, otherwise set to 1
  const numberOfVisits: number = session.get("numberOfVisits") + 1 || 1;

  // Create new cookie string
  session.set("numberOfVisits", numberOfVisits);
  const cookie = await commitSession(session);

  // Set new cookie in headers
  return json(
    { numberOfVisits },
    {
      headers: {
        "Set-Cookie": cookie,
      },
    }
  );
}

const Count = () => {
  const data = useLoaderData();
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
};

export default Count;
```

1. 쿠키에서 세션을 가져오는 명령어는 getSession() 함수에 request.headers.get("Cookie")인자를 줬습니다.

2. 두 번째로 방문 횟수를 체크하고 1만큼 증가하는 코드인데요.

3. session.set() 함수로 데이터를 업데이트하고 업데이트된 세션을 commitSession 함수로 다시 쿠키 문자열로 저장합니다.

4. 그리고 나서 서버사이드 쪽에서 클라이언트로 넘겨주는 loader 함수의 return 부분에서 "Set-Cookie"부분으로 넘겨줍니다.

실행 결과를 볼까요?

![mycodings.fly.dev-howto-remix-session-cookie](https://blogger.googleusercontent.com/img/a/AVvXsEgpGmqE5L5CWsOJaw6kSGuYBxRDWTmZTKWoMtIy4DE296SOFp113bA5X-713rmPpbcLcyNHaxzvoITOevszW22EoKhUdBzoFMvIqpVWUjazwcPBdrK8WM_tl3iM_PZoIL7_hR0_QYqpUYIBAYDcSyolcxzLzIsyjoS2IlvGrcpxVmY5qCp09us9OX4k=s16000)

위 스크린숏을 보시면 numberOfVisits가 1이고 밑에 쿠키 부분에 보시면 'count-session'이라고 우리가 createCookieSessionStorage 함수를 이용해 만들었던 쿠키 이름이 보입니다.

실제 데이터는 서버사이드 쪽에서 웹 서버를 돌리는 express 서버의 메모리에 있습니다.

우리는 그걸 'count-session' 이름으로 서버사이드 쪽에서 접근할 수 있는 거죠.

브라우저를 새로 고침 해볼까요?

여러 번 해 보십시오.

![mycodings.fly.dev-howto-remix-session-cookie](https://blogger.googleusercontent.com/img/a/AVvXsEg62yv3Y-LcTU25_mif7UFGgjqSI9ZY0vAME8Fk-vn6j_KJfJckv7Hsp91KBIVsKOin4U18HQtbiH3wy4lLJ6wokVfc-oZYp24ppHXfrZjkK6I-b-ulz-o4hAZOjGrDodfQ2WI9dxZ9SLQXZQPXEqYcmpEbjgQiSPpe8hZU3X-z2fxGXhQjMhF3PwUc=s16000)

어떤가요? 방문 횟수가 1씩 계속 증가하고 있죠.




^^