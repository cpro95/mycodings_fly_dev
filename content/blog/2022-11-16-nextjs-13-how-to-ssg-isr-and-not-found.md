---
slug: 2022-11-16-nextjs-13-how-to-ssg-isr-and-not-found
title: Next.js 13에서 SSG와 ISR 적용하기
date: 2022-11-16 12:43:27.911000+00:00
summary: Next.js 13에서 SSG와 ISR 적용하기, 그리고 not-found 컴포넌트 작성
tags: ["next.js", "ISR", "SSG"]
contributors: []
draft: false
---

![](https://blogger.googleusercontent.com/img/a/AVvXsEimNTZae_0VPdkLTHLn29SuTWCB0KdexrpaVhqbDUkXvjnoFzoXmusY7ZjO64-6UjxKGSbZubaGn0dK1aEEZ5yP8_N9NJjg6YAxz6Ax_o_SE9k12r5Xe2n-IerYo6eM-oNlGzaPDWVty0CShde9RmCT-_XtNkpJWnDU_GNb2MGiHCQh4HO5PuGTA7lV=s16000)

안녕하세요?

지난 시간에 살펴본 Next.js 13 버전에 대해 어떻게 생각하셨나요?

무엇보다 디폴트로 서버 사이드 컴포넌트로 작동된다는 것이 가장 큰 차이인데요.

그러면 Next.js의 가장 큰 장점인 정적 사이트 생성 및 Incremental 정적 사이트 생성은 어떻게 구현할 수 있을까요?

오늘은 그 부분에 대해 알아보겠습니다.

<hr />
## 서버사이드가 더 빠른가 아니면 캐시가 더 빠른가?

Remix 프레임워크가 온전히 서버사이드로 Next.js를 스피드에서 압도하는 사례가 많은데요.

서버 사이드 렌더링도 충분히 빠를 수 있다는 걸 증명한 Remix로 인해 Next.js가 드디어 서버사이드 렌더링을 들고 나왔는데요.

React 개발팀에서도 아직 React 컴포넌트를 서버사이드로 개발할지는 확정된 바가 없지만 Next.js 개발팀은 향후 서버사이드 컴포넌트가 대세라고 생각하고 있는 듯합니다.

최근 Shopify가 Remix 프레임워크를 인수한 것을 볼 때 Shopify는 서버사이드가 대세가 될 거라고 확신한 듯합니다.

점점 더 예전 PHP 시대로 변하는 거 같네요.

PHP가 더 좋다는 게 아니라 자바스크립트를 이용해서 예전 PHP 시대로 돌아간다는 게 더 흥분되는 이유입니다.

<hr />
## SSG, ISR 구현 방법

Next.js 13 버전부터는 모든 컴포넌트가 서버 컴포넌트이기 때문에 12 버전에서 사용하던 getStaticProps 함수나 getServerSideProps 함수가 필요 없어졌습니다.

그럼 어떻게 getStaticProps 같은 효과를 낼까요?

바로 fetch 함수를 이용하는 건데요.

다음 그림을 보시면 Next.js 13 버전이 설명하는 내용이 나와 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgTgwY9rqNDJNvr0Fj4r0phXEDiTRPOvJdvENqdMGO5Dv9WVuwA6AvhFJgcXSHEml4DKyka0Rj01oDa01w4I4nphhg5a64AYWi9qp5FQuhJ4m8GjMmhkrqgNzL3TP6pZWybTjLDFbQkjNsoZdoRg3LXCPxA5bvk2NqI9QRpTS2zckYoohWjvKOt-isI)

위 그림을 보시면 Web 기본 API인 fetch를 확장한 개념으로 위와 같이 cache 옵션과 next 옵션을 줄 수 있습니다.

cache 옵션에서 'force-cache'라고 옵션을 주면 이름에서도 알 수 있듯이 캐시를 강제한다는 뜻이기 때문에 정적 사이트로 만들라는 의미입니다.

'force-cache'는 디폴트 값인데요.

원칙은 처음은 서버사이드로 작동하고 두 번째부터는 캐시 된 값을 불러오는 형식인 겁니다.

두 번째로 'no-store' 옵션인데요. 캐시를 만들지 말라는 뜻으로 무조건 서버사이드로 작동하라는 뜻입니다.

'no-cache'도 같은 뜻으로 쓰입니다.

그리고 마지막으로 next 옵션에 revalidate 옵션이 있는데요.

이게 바로 ISR입니다.

위 그림에서는 10초마다 캐시를 갱신한다는 뜻입니다.

그럼 실제 코드를 테스트해볼까요?

먼저, 캐시 옵션 없이 next 프로젝트를 build 해보겠습니다.

```bash
npm run build
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEgPiTbxsAQeNAbx4b7MwHdZ33eEyIpB2UBE06X1kv2nq5N6fk9eyeNm64W5RKpLOQlPMBqEQahAgE5BBoKpxWATXWF7NAvJzOtk0YlADHUvjUKUbivQuNDUTJZ8G5j-qN46lEdwFgrjE626bVdlXYPl8Cz-eXlk6cGAK9Hzy29cXNNENseMz3R9i-ob=w640-h442)

위 그림과 같이 Static 즉, 정적으로 컴파일된 경로는 '/'와 '/todos' 경로이고 '/todos/[todoId]'는 원래대로 서버사이드로 컴파일되었습니다.

이제 코드에서 cache: 'force-cache' 부분을 추가해 볼까요?

여기서 SSG를 구현하기 위해서는 예전 getStaticPaths 함수 같은 게 필요한데요.

getStaticPaths처럼 서버사이드 라우팅의 모든 경우의 수를 지정할 필요가 있습니다.

Next.js 13 버전에서는 generateStaticParams 함수로 바뀌었는데요.

다음과 같이 작성하시면 됩니다.

```js
import React from 'react'

type Props = {
  params: {
    todoId: string,
  },
}

const fetchTodo = async (todoId: string) => {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId}`,
    { cache: 'force-cache' },
  )
  const todo: TodoType = await res.json()
  return todo
}

async function TodoId({ params: { todoId } }: Props) {
  const todo = await fetchTodo(todoId)

  return (
    <div className='space-y-2 border-4 border-blue-400 bg-slate-300 p-2'>
      <div>Todo Id : {todoId}</div>
      <div>Todo Title : {todo.title}</div>
      <div className='border-t border-black py-2'>
        Completed :{todo.completed ? <span> Yes</span> : <span> No</span>}
      </div>
    </div>
  )
}

export default TodoId

export async function generateStaticParams() {
  const res = await fetch(`https://jsonplaceholder.typicode.com/todos/`)
  const todos: TodoType[] = await res.json()

  // splice first 10
  const trimmedTodos = todos.splice(0, 10)

  // [ { todoId: '1'}, {todoId: '2'}, ...{todoId: '200'}]
  return trimmedTodos.map(todo => ({
    todoId: todo.id.toString(),
  }))
}
```

위 코드는 기존 /todos/[todoId]/page.tsx 파일인데요.

마지막에 generateStaticParams 함수만 추가했습니다.

그리고 fetch 부분에 'force-cache' 옵션도 추가했고요.

generateStaticParams 함수의 리턴 값은 Params를 리턴해야 하는데요.

/todos/[todoId] 경로의 동적 라우팅에서 필요한 Params는 뭘까요?

당연히 `[ { todoId: '1'}, {todoId: '2'}, ...{todoId: '200'}]`처럼, todoId의 번호가 필요합니다.

그래서 위 코드의 return 문을 잘 보시면 단순하게 todoId 넘버링하는 모습이 보일 겁니다.

그리고 여기서 아주 중요한 게 있는데요.

자바스크립트 세계에서는 Params는 무조건 String 타입입니다.

그래서 꼭 toString() 함수를 이용해서 String 타입으로 변환해 줘야 합니다

여기서 잠깐, 우리의 jsonplaceholder API의 todos는 200개를 리턴하는데요.

너무 많아서 위 코드에서는 splice 함수를 이용해서 총 10개로 줄였습니다.

아래 그림은 총 200개를 정적 사이트로 만드는 결과물인데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjjXixImy8_ekGsK0SVmQbXXMz1RKm7w34JiE-Pw4csSuWhMQ5bL0M9hJnUt-_EzL5b2yCrqYp_TNP6tSHCPrKeNlYWQXkA-AgIFcML29JXl7L3KBGVTy0dKsrop-bBMzlhlAX_VMjEiqUahdWJbro77p1yWngeRJd8d4jyU0GFhNP8vF6W-g4aqX3i=w640-h557)

jsonplaceholder API에서 트래픽 과다로 제약을 걸기 전에 10개짜리만 splice 함수로 추려서 build를 해보겠습니다.

아래 그림 보시면 총 10개만 정적 사이트로 만든 게 보일 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjOdREe3nyfLuoRAatd6Z8Eva1-p861CkwwX_GgdljYO2UkXU_I9tbOzUbl25REH5O3MCXitM7ZJjh-SWEyBrEUtUpRIAngxzCSmCzH_wpS1Ht8yjbMDcIBQflu-bLit4OcjPXdV-boWK4-th1X2hApW7D28H8cfRa_9VyYO89TF7TvC_DSWzncbOgr=w640-h555)

fetch 부분 옵션을 아래와 같이 해도 빌드는 똑같습니다.

```js
{
  next: {
    revalidate: 60
  }
}
```

실행 결과를 보기 위해 위에서 빌드한 결과물을 가지고 Next.js 서버를 돌려야 합니다.

'npm run dev'는 개발 서버이고 위에서 빌드한 서버를 돌리려면 가장 기본적인 'npm start'를 실행하시면 됩니다.

실행 결과를 보시면 todo ID 10번까지는 로드하는 속도가 엄청 빠릅니다.

그리고 우리가 10번까지만 정적 사이트로 만들었기 때문에 11번 부터는 서버사이드로 작동되는데요.

서버사이드도 한번 작동된 라우팅은 캐시가 되기 때문에 두 번째부터는 정적 사이트처럼 똑같이 빠르게 작동됩니다.

<hr />
## not-found.tsx 파일 만들기 여기서 잠깐!

만약에 todoId 가 200번을 넘어서 1000번이라면 어떻게 될까요?

당연히 jsonplaceholder API에서는 리턴되는 게 없을 겁니다.

화면에는 어떻게 나타날까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEjq_KTcyRmmpd_Mn_CE4i2IW0dTBHMCoaUauNbEfPAZpu4lLUapzDW9mzr8YRU5w8lCLmjb3PMI5WUs81eokcsYv7toVjAo5QvX0AV-9AKLPLL_pM2TCQPxbx4gJvWbZwyw_N2kNaj3p-zP8f0qDqAmflY283_mMix00B53vvUbOJKXyUQTDR5HpFw5)

위 그림과 같이 나옵니다.

이 같은 경우를 방지하기 위해 Next.js 13 버전에서는 notFound 컴포넌트를 제공해 주는데요.

위 코드에서 몇 가지만 추가해 볼까요?

```js
import React from "react";
import { notFound } from "next/navigation";

...
...
...

async function TodoId({ params: { todoId } }: Props) {
  const todo = await fetchTodo(todoId);
  if (!todo.id) return notFound();

  return (
   ...
   ...
  );
}

```

'next/navigation'에서 notFound함수를 불어왔고, 그리고 todo.id 가 없을 때 notFound()를 리턴하는 형식의 코드를 추가했습니다.

결과는 어떻게 나올까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEjU_TGX-2yUx3o4_3db8EaPy5ZuMFkEK7GAyzamk5Gbpfjo19FkMWphipg1hu429ZkKqpbrgy6FanU5dn3T70ek9jvNht__2gOd6stVnaNmAevfI3gJfjnx_Lk56oVrMbM8YxHJ0FeHBz_pw3bcEYPuaGlhtFTU1EpHxqvaKd0lmjRLilMQU4Xnb8EK)

404 에러 페이지인데요.

404 에러는 페이지를 찾을 수 없다는 뜻입니다.

위 그림은 Next.js 기본 양식인데요.

우리는 이 양식도 우리가 원하는 모양으로 바꿀 수 있습니다.

이 기능 또한 Remix Framework에는 있는 기능입니다.

/todos/[todoId] 폴더에 not-found.tsx 파일을 만들면 /todo[todoId] 라우팅에서 발생하는 404 에러는 무조건 not-found.tsx 파일에 있는 컴포넌트가 화면에 렌더링 됩니다.

```js
import React from 'react'

type Props = {}

function NotFound({}: Props) {
  return <div>Woops, Can not find TODO!</div>
}

export default NotFound
```

실행 결과를 다시 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEj6QCvfzsGPNU0CTYwhLavw9kPCZ2_RfG5aD27fkorWmjDQvz6zxlvCBB3QKj4AXnuVPNZlpGZiGD8l8mC-WD4Gti3oGmX4eHi2SZsEhlHA1pNfATlPft8CGikXwRiUKKVCk1zEM1zcjo40nEvGe5o5RUG_DAESXPuWs7uI1Cdcy-VjKnux-CUQrcTj)

위 그림을 보시면 404 에러 메시지가 표시되는 부분도 기존의 Nested Layout을 준수하는 모양새입니다.

사실 이 기능도 Remix Framework에 있는 기능입니다.

어떤가요?

이제 Next.js 13 버전에서도 SSG, ISR 등 Next.js의 가장 강력한 기능을 구현할 수 있게 되었습니다.

다음 시간에는 Next.js 13 버전에서의 클라이언트 사이드 컴포넌트에 대해 알아보겠습니다.
