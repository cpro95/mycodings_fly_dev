---
slug: 2023-08-09-user-authentication-system-in-svetlekit
title: SvelteKit 실전 예제 5편 - SvelteKit으로 유저 로그인 구현하기(유저 인증)
date: 2023-08-09 10:05:03.665000+00:00
summary: SvelteKit으로 유저 가입, 로그인, 로그아웃 구현
tags: ["authentication", "sveltejs", "sveltekit"]
contributors: []
draft: false
---

안녕하세요?

오늘은 SvelteKit으로 유저 로그인 즉, 유저 인증에 대해 구현해 보도록 하겠습니다.

**-지난 시간 강좌 보기-**

[SvelteKit 실전 예제 - Fly.io에 배포(deploy)하기 with 서버 사이드 렌더링](https://mycodings.fly.dev/blog/2023-08-03-how-to-deploy-sveltekit-to-fly-io-with-server-side-rendering)

[SvelteKit 실전 예제 2편 - 서버 사이드 렌더링 풀 스택 무비 앱 만들기](https://mycodings.fly.dev/blog/2023-08-05-sveltekit-server-side-full-stack-example-and-fly-io-deploy)

[SvelteKit 실전 예제 3편 - Github Action으로 자동 배포하기(Auto Deploy)](https://mycodings.fly.dev/blog/2023-08-07-sveltekit-auto-deploy-with-github-action-to-fly-io)

[SvelteKit 실전 예제 4편 - Prisma 설치 후 백 엔드 DB 세팅 및 클라우드에 자동 배포하기](https://mycodings.fly.dev/blog/2023-08-07-sveltekit-with-prisma-and-deploy-to-fly-io)

그러면 시작하겠습니다.

---

먼저, 라우팅을 그룹화하는 방법을 설명해 드리면,

routes 폴더 밑에 그룹 라우팅으로 (auth)라는 폴더를 만듭니다.

그리고 이 (auth) 밑에 register 폴더와 login 폴더, logout 폴더를 만듭니다.

이렇게 하면 (auth) 라는 폴더는 register, login, logout 세 개의 라우팅을 그룹화한 auth라는 이름이 되는 겁니다.

단순하게 이름을 붙인 겁니다.

실제 (auth)로 라우팅 되는 게 아니라 코딩할 때 좀 더 보기 편하게 그룹화만 하는 겁니다.

Remix에 처음 생겼던 게 SvelteKit에서도 차용했네요.

## 유저 가입 구현하기

먼저, routes/(auth)/register 폴더에 두 개의 파일을 만드는데요.

항상 생각하셔야 할게 풀스택 앱에서는 서버 사이드 로직과 클라이언트 UI를 한 쌍으로 생각해야 합니다.

그래서 +page.server.ts 파일과 +page.svelte 파일을 만들어야 합니다.

그리고, 일단은 중첩 레이아웃은 나중에 생각합시다.

먼저, UI를 그려볼까요?

```js
<script lang="ts">
  import { enhance } from "$app/forms";
  import type { ActionData } from "./$types";

  export let form: ActionData;
</script>

<h1 class="text-4xl font-bold py-4">Register</h1>

<form
  class="w-1/2 px-4 space-y-4"
  action="?/register"
  method="post"
  use:enhance
>
  <div>
    <label for="username">Username</label>
    <input type="text" id="username" name="username" />
  </div>
  <div>
    <label for="password">Password</label>
    <input type="password" id="password" name="password" />
  </div>

  {#if form?.user}
    <p class="error">Username is taken.</p>
  {/if}

  {#if form?.invalid}
    <p class="error">Username and password is required.</p>
  {/if}

  <button type="submit">Register</button>
</form>

<style lang="postcss">
  label {
    @apply block mb-2 text-sm font-medium text-green-700 dark:text-green-500;
  }
  input {
    @apply bg-green-50 border border-green-500 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-green-500;
  }
  button {
    @apply text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800;
  }
  .error {
    @apply mt-2 text-sm text-red-600 dark:text-red-500;
  }
</style>
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEgtFoFnD1qErUFuV-YRw-g6vSoR8W9dnbkJbMB0x1XU-JTYwxfLIFO2clb8lfx-sCrncdBFoa7-2gMNCNp-ysof0AW-vvsfXFinPKAgOtJRyTwJ3X28IANhOTEv3jKT-xVXBrFijKSmhAvbK5psZFSwV_uaSmz_aD-GRtCneUowfRmRgkRUufm7sdwLuoA)

일단 UI는 위와 같이 만들었는데요. Flowbite에서 CSS를 차용했습니다.

그리고, TailwindCSS를 쓰시는 분이라면 위와 같이 style lang="postcss"라고 하면 @apply 기능을 사용할 수 있습니다.

참고 바랍니다.

그리고, $app/forms 모듈에서 enhance를 불러왔는데요.

SvelteKit 공식문서에서는 form 관련 기능은 순전히 HTML의 원래 기능만으로 작동한다고 합니다.

자바스크립트가 하나도 없이 작동한다는 뜻입니다.

즉, 페이지가 다시 로드되면서 form 관련 정보가 SvelteKit 서버에 전송된다는 뜻입니다.

그런데, use:enhance 디렉티브를 사용하면 화면 새로 고침 없이 SvelteKit이 알아서 form 관련 사전 처리를 해주는데요.

아주 좋은 기능이니까 form 관련 처리에 꼭 use:enhance 디렉티브를 사용하시길 바랍니다.

이제, Register UI가 마무리 됐으니, 유저 가입을 구현하는 로직을 만들어 보겠습니다.

```js
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { fail, redirect } from '@sveltejs/kit'
import type { Action, Actions, PageServerLoad } from '../../$types'
import { db } from '$lib/database'

export const load: PageServerLoad = async ({ locals }) => {
  // 나중에 구현
}

const register: Action = async ({ request }) => {
  const data = await request.formData()
  const username = data.get('username')
  const password = data.get('password')

  if (
    typeof username !== 'string' ||
    typeof password !== 'string' ||
    !username ||
    !password
  ) {
    return fail(400, { invalid: true })
  }

  const user = await db.user.findUnique({
    where: { username },
  })

  if (user) {
    return fail(400, { user: true })
  }

  await db.user.create({
    data: {
      username: username,
      passwordHash: await bcrypt.hash(password, 10),
      userAuthToken: crypto.randomUUID(),
    },
  })

  throw redirect(303, '/')
}

export const actions: Actions = { register }
```

SvelteKit에서는 Action 관련하여 actions 객체를 리턴해야 하는데요.

actions 객체에는 action 객체가 들어갑니다.

위 코드에서는 register 이란 action 객체를 하나 만들었는데요.

유저 가입 로직 구현은 여타 Next.js 코드와 비슷합니다.

그리고 마지막으로 redirect 라는 함수를 이용해서 다른 곳으로 이동하게 됩니다.

참고로 303은 HTTP 상태코드인데요.

ChatGPT의 설명을 보자면,

HTTP 상태 코드 303은 하이퍼텍스트 전송 프로토콜(HTTP)에서의 리디렉션 상태 코드입니다.

이 코드는 클라이언트의 요청이 다른 자원으로 리디렉션되어야 함을 나타내며, 이 리디렉션된 자원을 검색하기 위해 클라이언트가 HTTP GET 메서드를 사용해야 함을 알려줍니다.

간단히 말해서:

서버가 HTTP 상태 코드 303으로 응답하면, 클라이언트에게 원하는 자원이 다른 URL에 있으며, 클라이언트는 새 위치에서 자원을 검색하기 위해 HTTP GET 메서드를 사용해야 한다고 알려주는 것입니다.

302 상태 코드와 달리, 303 상태 코드는 리디렉션된 요청이 원래 요청과 동일한 HTTP 메서드를 사용해야 하는지에 대한 혼란을 방지하기 위해 리디렉션된 요청에 명시적으로 GET 메서드를 사용하도록 클라이언트에 지시합니다.

HTTP 상태 코드 303은 종종 폼 제출 또는 다른 요청이 다른 페이지로 리디렉션되어야 할 때 사용되며, 이때 원래의 안전하지 않은 작업(예: POST 요청)을 반복하는 문제를 피할 수 있습니다.

요약하면, HTTP 상태 코드 303은 리디렉션을 나타내며, 리디렉션된 요청에 대해 명시적으로 HTTP GET 메서드를 사용하도록 클라이언트에 지시합니다.

이는 주로 폼 제출이나 다른 상황에서 자원이 생성되고 클라이언트가 해당 자원을 보거나 검색하기 위해 리디렉션되어야 할 때 사용됩니다.

---

## 유저 로그인 구현하기

유저 가입하기 로직을 완성했으니까 로그인 구현을 작성해야 하는데요.

UI 부분은 로그인 부분과 아주 비슷합니다.

```js
<script lang="ts">
  import { enhance } from "$app/forms";
  import type { ActionData } from "./$types";

  export let form: ActionData;
</script>

<h1 class="text-4xl font-bold py-4">Login</h1>

<form class="w-1/2 px-4 space-y-4" action="?/login" method="post" use:enhance>
  <div>
    <label for="username">Username</label>
    <input type="text" id="username" name="username" />
  </div>
  <div>
    <label for="password">Password</label>
    <input type="password" id="password" name="password" />
  </div>

  {#if form?.credentials}
    <p class="error">Wrong credentials.</p>
  {/if}

  {#if form?.invalid}
    <p class="error">Username and password is required.</p>
  {/if}

  <button type="submit">Log In</button>
</form>

<style lang="postcss">
  label {
    @apply block mb-2 text-sm font-medium text-green-700 dark:text-green-500;
  }
  input {
    @apply bg-green-50 border border-green-500 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-green-500;
  }
  button {
    @apply text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800;
  }
  .error {
    @apply mt-2 text-sm text-red-600 dark:text-red-500;
  }
</style>
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEgaGmx0dCPi6DIPtzq3sOHYOAAeHrSqtgAIjpFyqgoFpWODB-77869u-kdzdhkT4Nb3q-7-yDT-EN2iJ__Oso_0B38HuWlBIDcJiWNY1UD5-Bf4yugiYep-1DjSxsLJVNq4F5P-5iCC0edTCKcg4oP1GcuP28Nx7FDRwy5jPdb488RjRk3Kf_NyKNL7hn8)

TailwindCSS를 사용하시면 FlowBite라는 아주 유용한 UI가 있으니 꼭 활용하시기 바랍니다.

이제 routes/(auth)/login/+page.server.ts파일에 로그인 로직을 아래와 같이 구현해 봅니다.

```js
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { fail, redirect } from '@sveltejs/kit'
import type { Action, Actions, PageServerLoad } from './$types'
import { db } from '$lib/database'

export const load: PageServerLoad = async ({ locals }) => {
  // 나중에 작성필요
}

const login: Action = async ({ cookies, request }) => {
  const data = await request.formData()
  const username = data.get('username')
  const password = data.get('password')

  if (
    typeof username !== 'string' ||
    typeof password !== 'string' ||
    !username ||
    !password
  ) {
    return fail(400, { invalid: true })
  }
  const user = await db.user.findUnique({ where: { username: username } })

  if (!user) {
    return fail(400, { credentials: true })
  }

  const userPassword = await bcrypt.compare(password, user.passwordHash)

  if (!userPassword) {
    return fail(400, { credentials: true })
  }

  // generate new auth token
  const authenticatedUser = await db.user.update({
    where: { username: user.username },
    data: { userAuthToken: crypto.randomUUID() },
  })

  cookies.set('my-session', authenticatedUser.userAuthToken, {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30,
  })

  // redirect the user
  throw redirect(302, '/')
}

export const actions: Actions = { login }
```

또다시 설명하자면, SvelteKit에서는 Action 관련하여 actions 객체를 리턴해야 하는데요.

actions 객체에는 action 객체가 들어갑니다.

위 코드에서는 login 이란 action 객체를 하나 만들었는데요.

login 구현은 여타 Next.js 코드와 비슷합니다.

대신 SvelteKit이 기본 제공하는 cookies를 이용해서 아주 쉽게 쿠키를 설정했는데요.

cookies.set 메서드로 작성했습니다.

cookies.set 메서드에 첫 번째로 들어갈 인자는 세션 이름입니다.

세션 이름은 이 앱의 이름과 연관 지어 만들면 좋습니다.

두 번째 인자는 값인데요.

위 코드에서는 authenticatedUser의 userAuthToken 값을 넣었습니다.

userAuthToken 값은 crypto.randomUUID() 명령에 의해 생기는 난수인데요.

나중에 로그인 상태를 확인하기 위해 이 userAuthToken 값을 검사하게 됩니다.

보안을 위해 crypto.randomUUID() 명령에 의해 해독이 어려운 난수를 사용하는 겁니다.

cookies.set 메서드의 세 번째 인자는 쿠키 옵션입니다.

보통 로그인 구현에서 쿠키를 보관하는 방법은 브라우저의 localStorage를 사용하는데요.

다른 방법으로는 DB에 직접 저장하는 방법도 있습니다.

우리는 아래 코드에서 볼 수 있듯이 DB에 직접 저장했습니다.

아래 코드를 보시면 user 테이블에 해당 usename의 값에 userAuthToken 값을 update하고 있습니다.

```js
// generate new auth token
const authenticatedUser = await db.user.update({
  where: { username: user.username },
  data: { userAuthToken: crypto.randomUUID() },
})
```

마지막으로 redirect를 302 상태코드로 했는데요.

ChatGPT의 설명으로 302 상태코드를 잠깐 살펴보면,

HTTP 상태 코드 302는 웹 브라우저가 웹 페이지를 요청할 때 서버로부터 받는 응답의 일종입니다.

이 코드는 "임시로 다른 곳으로 가보세요" 라고 웹 브라우저에게 알려주는 역할을 합니다.

더 자세히 설명하면:

웹 브라우저가 어떤 웹 페이지를 열려고 할 때, 그 페이지가 다른 URL로 잠시 이동했다는 것을 웹 서버가 알려줄 때 사용하는 코드입니다.

이때 웹 브라우저는 해당 페이지를 가져오기 위해 다시 서버에게 새로운 요청을 보내야 합니다.

302 상태 코드는 주로 웹 페이지가 일시적으로 다른 곳에 있거나, 서버에 부담을 주지 않기 위해 특정한 방식으로 요청을 처리할 때 사용됩니다.

예를 들어, 사용자가 로그인을 해야 하는 페이지를 열려고 할 때, 302 상태 코드를 사용하여 로그인 페이지로 잠시 이동시키고, 로그인 후 다시 원래 페이지로 보내는 경우가 있습니다.

요약하자면, HTTP 상태 코드 302는 웹 페이지가 임시로 다른 곳에 있을 때 사용되며, 웹 브라우저에게 "임시로 이쪽으로 가보세요" 라고 알려주는 역할을 합니다.

---

## 로그아웃 구현하기

마지막으로 로그아웃입니다.

로그아웃은 UI가 필요 없이 서버 사이드 로직만 있으면 됩니다.

그래서 logout 폴더에 +page.server.ts 파일만 작성하면 됩니다.

```js
import { redirect } from '@sveltejs/kit'
import type { Actions } from './$types'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
  throw redirect(302, '/')
}

export const actions: Actions = {
  default({ cookies }) {
    cookies.set('my-session', '', {
      path: '/',
      expires: new Date(0),
    })
    // redirect
    throw redirect(302, '/login')
  },
}
```

로그 아웃은 간단한데요.

바로 쿠키를 삭제하는 겁니다.

웹에서는 쿠키를 삭제하는 방법이 바로 만료(expires)시키는 건데요.

이론적으로 현재 시간보다 이전이면 그 쿠키는 만료된 걸로 인식하고 브라우저가 바로 그 쿠키를 삭제해 버립니다.

그래서 위 코드 보시면 cookies.set 메서드로 쿠키를 새로 설정하는데 expires 부분에 new Date(0)으로 설정합니다.

여기서 0은 유닉스 시간인데요.

유닉스는 1970년 1월 1일 0시를 0이라는 기준으로 숫자 카운트를 해서 시간을 가늠합니다.

그래서 new Date(0)으로 세팅한다는 의미는 날짜를 1970년 1월 1일 0시로 바꾼다는 거죠.

즉, 과거로 세팅하면 그 쿠키는 브라우저가 더 이상 유효하지 않다고 판단해서 삭제해 버립니다.

---

## 로그인 상태를 체크하는 방법

자, 그러면 가입, 로그인 페이지 외에 다른 일반적인 페이지에서 SvelteKit은 현재 사용자가 로그인한 상태인지 어떻게 판단할까요?

그 방법은 SvelteKit의 event 처리 시 locals 라는 객체에 로그인 정보를 저장하는 방법입니다.

locals 이라는 객체는 SvelteKit에서 제공하는 객체인데요.

사용자가 여기에 데이터를 저장하면 SvelteKit 전체에서 아주 쉽게 접근할 수 있습니다.

여기에 유저 정보를 저장하고, 만약 유저 정보가 있으면 로그인 됐다고 생각하면 되는 겁니다.

그러면, 이 locals에 값을 저장하는 곳은 어디일까요?

바로 SvelteKit에서 제공하는 Hook을 이용해야 합니다.

/src 폴더 밑에 hooks.server.ts 파일을 만들면 되는데요.

여기에는 handle이란 함수를 async 방식으로 작성하면 됩니다.

기본적으로 hooks.server.ts 파일이 없으면 SvelteKit은 아래와 같이 가장 기본적인 hooks.server.ts 파일처럼 작동합니다.

즉, 아래 코드는 hooks.server.ts 파일이 없어도 그냥 작동된다는 얘기죠.

```js
export const handle: Handle = async ({ event }) => {
  return await resolve(event)
}
```

위 코드를 보시면 evnet 객체가 보이는데요.

사실 handle 함수는 그 인자로 request 객체를 받습니다.

그 request 객체 안에 event 객체가 있는 거고요.

그래서 request의 event를 resolve 하는 겁니다.

즉, HTTP Request가 오면 그냥 Resolve 한다는 뜻, 즉 그냥 넘긴다는 뜻이죠.

그러면 여기서 이 handle 이란 Hook을 커스터마이징하면 원하는 의도대로 Request에 따른 Resolve를 조정할 수 있는 건데요.

일단 아래와 같이 우리가 원하는 코드를 작성해 보겠습니다.

```js
import { db } from '$lib/database'
import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
  const session = event.cookies.get('my-session')

  if (!session) {
    return await resolve(event)
  }

  const user = await db.user.findUnique({
    where: { userAuthToken: session },
    select: { username: true, role: true },
  })

  if (user) {
    event.locals.user = {
      username: user.username,
      role: user.role,
    }
  }

  return await resolve(event)
}
```

hooks.server.ts 파일에 있는 handle이란 함수는 HTTP Request가 발생하면 무조건 실행되는 함수입니다.

그래서 우리는 여기서 로그인 관련해서 locals 에 데이터를 저장하는 겁니다.

먼저, 쿠키에서 'my-session'이라는 제가 지정했던 세션 이름을 찾고,

그리고 그 세션이 없으면 로그인이 안 됐다는 뜻이기 때문에 그냥 resolve(event)로 HTTP Request를 처리해 버립니다.

즉, 아무 일도 안 한다는 뜻이죠.

그런데 만약 session 정보가 있으면 user가 로그인했다는 뜻이기 때문에 해당 세션에 저장된 userAuthToken에 맞는 user 정보를 찾습니다.

그리고 해당 user가 있다면 event.locals 밑에 객체를 붙입니다.

즉, event.locals.user라는 형식으로 user 객체를 locals 밑에 덧붙인다는 거죠.

그리고 마지막으로 resolve(event)를 실행시킵니다.

이제 locals에 user 정보를 넘겼고, 이 locals은 다른 페이지에서 쉽게 조회할 수 있게 됩니다.

---

## locals 에 있는 user 정보로 login, register 라우팅 보완하기

이제 유저가 로그인 상태를 locals에 있는 user 정보로 알 수 있기 때문에, login, register 라우팅으로 사용자가 왔을 때,

이미 로그인 되어 있으면 다른 곳으로 이동시키는 코드를 넣어야 합니다.

로그인 한 유저가 다시 로그인 화면이나 등록 화면을 볼 필요가 없으니까요.

바로 +page.server.ts 파일에 있는 load 함수를 통해 구현하면 됩니다.

```js
export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) {
    throw redirect(302, '/')
  }
}
```

위 코드를 똑같이 login/+page.server.ts 파일에도 넣어주고, register/+page.server.ts 파일에도 넣어 주면 됩니다.

## locals 에 있는 user 정보 얻기

+layout.server.ts 파일은 +layout.svelte 파일과 한 쌍으로 전체 레이아웃을 결정하는 코드인데요.

무조건 SvelteKit은 이 +layout 관련 코드가 +page 관련 코드보다 먼저 실행됩니다.

그리고 +layout.server.ts 파일이 +layout.svelte 파일보다 먼저 실행되고요.

+layout.server.ts 파일 내용입니다.

```js
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals }) => {
  return {
    user: locals.user,
  }
}
```

load 함수에서 locals 객체를 불러옵니다.

그리고 locals.user 에 있던 데이터를 다시 user라는 이름으로 return 해주고 있는데요.

.ts 파일에서 리턴한 객체는 .svelte 파일에서 export let data로 접근할 수 있습니다.

그리고 다른 방식으로도 이 data에 접근할 방법이 있는데요.

바로 전역 store인 $app/stores에 있는 page라는 store를 이용합니다.

```js
import { page } from '$app/stores'
```

위와 같이 $app/stores에서 page를 불러오면 이 page 안에는 많은 데이터가 있는데요.

특히 $page.data가 바로 우리가 사용할 데이터입니다.

그러면 $page.data에는 우리가 .ts 파일에서 return한 모든 data가 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhKCpVLbOexfQpBoLG0s-8XR7MegWQKlEY9iNNKxGm2ZCD2zerjjvJC7AXzg_NHSFkjFvZWA2P-HqHyAWbXNka1b-qmQYCWOyX2SLe1N1nNFYuhGNsm94WUC6ZrWMCzmjOLt_7bvSm8pjQLGzhAdS4oRZixgZ4J9pNvJr7wqIhUGCKyH7prWVQfyAg0tIQ)

위 그림에서 보듯이 popularMovies 객체와 user 객체가 보이시죠.

이제 +layout.svelte 파일을 다시 바꿔 보겠습니다.

```js
<script>
  import "../app.postcss";
  import { page } from "$app/stores";
  import { enhance } from "$app/forms";
</script>

<div class="p-4">
  <header class="mb-4">
    <nav class="flex space-x-4">
      <a href="/">Home</a>
      {#if !$page.data.user}
        <a href="/register">Register</a>
        <a href="/login">Log In</a>
      {:else}
        <form action="/logout" method="post" use:enhance>
          <button type="submit">Log out</button>
        </form>
      {/if}
    </nav>
  </header>
  <slot />
</div>
```

그리고 log out 구현은 위와 같이 꼭 form.post 방식으로 구현해야 합니다.

드디어 유저 인증 구현이 끝났습니다.

---

## Protected 페이지 만들기

유저 인증이 끝났으면 유저에 따른 Protected 페이지 만드는 방법을 구현해야 하는데요.

원리는 아주 간단합니다.

먼저 해당 페이지의 +page.server.ts 파일의 load 함수에서 locals에 user라른 객체값이 없다면 로그인한 상태가 아니라고 판단하는 겁니다.

아래 코드는 /routes/(protected)/admin/+page.server.ts 파일인데요.

```js
import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
  // redirect user if not logged in
  if (!locals.user) {
    throw redirect(302, '/')
  }
}
```

간단하게 locals.user 값이 없으면 redirect하라고 합니다.

그리고 +page.svelte 파일에서는 $page.data 값을 참조해서 유저 로그인 상태를 구분합니다.

```js
<script lang="ts">
  import { page } from "$app/stores";
</script>

{#if $page.data.user}
  <p>Welcome {$page.data.user.username}!</p>
{/if}

{#if $page.data.user.role === "ADMIN"}
  <p>This is ADMIN Page!</p>
  <form action="/logout" method="post">
    <button type="submit">Log Out</button>
  </form>
{/if}

<style lang="postcss">
  p {
    @apply text-2xl font-bold text-cyan-900;
  }
</style>
```

$page.data 객체는 SvelteKit이 리턴한 모든 데이터 값을 저장하고 있습니다.

그리고 그 data 밑에 우리가 아까 +layout.server.ts 파일에서 return 한 user 객체가 있는 거죠.

---

## Fly.io 무료버전의 메모리 문제 해결

Fly.io 가상 서버의 기본 메모리가 256MB인데요.

Prisma를 사용하면 메모리가 급속하게 증가합니다.

그래서 실제 Deploy가 실패할 경우가 많은데요.

아마 이메일로 앱 크래쉬 관련 내용을 받을겁니다.

그래서 Remix 진영에 있는 Fly.io 관련 코드를 아래와 같이 추가하겠습니다.

루트 폴더에 start.sh 파일이 있죠?

그걸 아래와 같이 바꿔서 SWAP 메모리를 사용할 수 있게 조정할 겁니다.

```bash
#!/bin/sh -ex

# This file is how Fly starts the server (configured in fly.toml). Before starting
# the server though, we need to run any prisma migrations that haven't yet been
# run, which is why this file exists in the first place.
# Learn more: https://community.fly.io/t/sqlite-not-getting-setup-properly/4386

# allocate swap space
fallocate -l 512M /swapfile
chmod 0600 /swapfile
mkswap /swapfile
echo 10 > /proc/sys/vm/swappiness
swapon /swapfile
echo 1 > /proc/sys/vm/overcommit_memory

# Finally start the app
npx prisma migrate deploy
npx prisma db seed
npm run start
```

이제 다시 git push하고 Fly.io Deploy 상태를 보시면 성공적으로 배포됐다고 나올겁니다.

---

지금까지 SvelteKit을 이용한 유저 로그인, 인증에 대해서 구현해 봤는데요.

사실 Svelte에는 유저 인증 관련 NextAuth 같은 패키지가 있습니다.

- [SvelteKit Auth](https://github.com/Dan6erbond/sk-auth)

- [Lucia](https://github.com/pilcrowOnPaper/lucia)

위 두 개 패키지가 유명하니까 이걸 사용하는 게 훨씬 더 쉬울 겁니다.

지금까지 구현한 거는 그냥 공부용이라고 생각하시면 됩니다.

그럼.
