---
slug: 2025-09-15-nextjs-server-actions-vs-route-handlers
title: Next.js 서버 액션과 루트 핸들러 아직도 헷갈리시나요
date: 2025-09-16 13:20:01.831000+00:00
summary: Next.js의 두 가지 핵심 서버 통신 방식인 서버 액션과 루트 핸들러의 차이점을 명확히 짚어보고, 언제 무엇을 사용해야 하는지에 대한 완벽한 가이드를 제시합니다.
tags: ["Next.js", "Server Actions", "Route Handlers", "App Router", "서버 컴포넌트", "데이터 통신"]
contributors: []
draft: false
---

Next.js 앱 라우터에는 서버와 통신하는 두 가지 주요 방법이 있는데요.<br />

바로 '루트 핸들러(Route Handlers)'와 '서버 액션(Server Actions)'입니다.<br />

이 둘은 비슷한 역할을 하는 것 같으면서도 근본적인 철학과 사용법이 전혀 다르거든요.<br />

그래서 많은 개발자분들이 언제 무엇을 써야 할지 헷갈려 하시는 것 같습니다.<br />

어떤 때는 `fetch`로 API를 호출하는 게 맞는 것 같고, 또 어떤 때는 `<form>`에 함수를 바로 넘기는 게 편해 보이기도 하는데요.<br />

오늘은 이 두 가지 방식의 차이점을 명확히 짚어보고, 여러분의 프로젝트에 어떤 것이 더 적합할지 판단할 수 있는 확실한 기준을 세워드리겠습니다.<br />

## 루트 핸들러 전통적인 API의 귀환

먼저 '루트 핸들러'부터 살펴보려고 하는데요.<br />

사실 루트 핸들러는 우리에게 아주 익숙한 개념입니다.<br />

이전 `Pages Router` 시절의 'API Routes'가 `App Router` 환경에 맞게 재탄생한 것이거든요.<br />

쉽게 말해, Next.js 프로젝트 안에 독립적인 API 엔드포인트를 만드는 방식이라고 할 수 있습니다.<br />

`app/api/some-path/route.ts` 와 같은 경로에 파일을 만들고, `GET`, `POST` 등 HTTP 메서드에 해당하는 함수를 `export`하면 되는데요.<br />

마치 Express.js로 간단한 서버를 만드는 것과 아주 비슷합니다.<br />

```typescript
// app/api/messages/route.ts
import { NextResponse } from 'next/server';<br />

export async function GET() {
  return NextResponse.json({ message: 'Hello from the API!' });<br />
}

export async function POST(request: Request) {
  const { content } = await request.json();<br />
  console.log('새 메시지 수신:', content);<br />

  // 여기서 데이터베이스에 저장하는 로직을 수행합니다.<br />

  return NextResponse.json({ success: true, received: content });<br />
}
```

클라이언트 컴포넌트에서는 이렇게 만든 API를 'fetch'를 사용해서 호출하게 되는데요.<br />

이 과정 역시 우리가 늘 해오던 방식과 동일합니다.<br />

```typescript
// app/some-page/page.tsx
'use client';<br />
import { useState } from 'react';<br />

export default function Page() {
  const [message, setMessage] = useState('');<br />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();<br />
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: message }),
    });<br />
    alert('메시지 전송 완료!');<br />
  };<br />

  return (
    <form onSubmit={handleSubmit}>
      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      <button type="submit">전송</button>
    </form>
  );<br />
}
```

이처럼 루트 핸들러는 클라이언트와 서버의 경계가 아주 명확한 '전통적인' API 개발 방식입니다.<br />

## 서버 액션 리액트와 서버의 경계를 허물다

반면에 '서버 액션'은 훨씬 더 Next.js스럽고, 리액트와 긴밀하게 통합된 방식인데요.<br />

서버에서 실행될 함수를 정의하고, 그 함수를 클라이언트 컴포넌트에서 마치 일반 함수처럼 직접 호출할 수 있게 해주는 기능입니다.<br />

함수 상단에 `'use server';` 라는 지시어 하나만 붙여주면, Next.js가 알아서 이 함수를 서버에서만 실행되는 API로 만들어주거든요.<br />

중간에 `fetch`를 호출하고, `body`를 `JSON.stringify`하는 등의 번거로운 과정이 모두 사라지는 마법 같은 일입니다.<br />

```typescript
// app/actions.ts
'use server';<br />

import { db } from './db';<br /> // 가상의 데이터베이스 모듈

export async function createMessage(formData: FormData) {
  const message = formData.get('message') as string;<br />
  console.log('새 메시지 수신:', message);<br />
  
  // 여기서 데이터베이스에 저장하는 로직을 수행합니다.<br />
  // await db.messages.create({ content: message });<br />
}
```

이 서버 액션을 사용하는 클라이언트 코드는 놀랍도록 간결해지는데요.<br />

`useState`나 `handleSubmit` 같은 클라이언트 사이드 상태 관리 로직 없이, `<form>`의 `action` 속성에 서버 액션 함수를 그냥 넘겨주기만 하면 됩니다.<br />

```typescript
// app/another-page/page.tsx
import { createMessage } from '@/app/actions';<br />

export default function Page() {
  return (
    <form action={createMessage}>
      <input name="message" />
      <button type="submit">전송</button>
    </form>
  );<br />
}
```

사용자가 폼을 전송하면, Next.js가 내부적으로 API 요청을 생성해서 서버의 `createMessage` 함수를 실행시켜 줍니다.<br />

개발자는 마치 하나의 파일 안에서 모든 일을 처리하는 것처럼 코드를 작성할 수 있게 되는 거죠.<br />

## 그래서 언제 무엇을 써야 할까요

이제 두 방식의 차이점이 명확히 보이실 텐데요.<br />

그렇다면 어떤 상황에서 어떤 기술을 선택해야 할까요?<br />

제가 여러 자료와 제 경험을 바탕으로 정리한 명확한 사용 기준은 다음과 같습니다.<br />

### UI와 긴밀한 데이터 변경은 '서버 액션'

사용자가 폼을 제출하거나, 버튼을 클릭해서 무언가를 생성(Create), 수정(Update), 삭제(Delete)하는 CUD 작업에는 '서버 액션'이 거의 항상 정답에 가깝습니다.<br />

그 이유는 명확한데요.<br />

첫째, 코드가 압도적으로 간결해집니다.<br />

API 엔드포인트를 따로 만들고 `fetch` 로직을 작성하는 번거로움이 사라지기 때문이죠.<br />

둘째, '프로그레시브 인핸스먼트'를 기본으로 지원합니다.<br />

자바스크립트가 로드되지 않은 환경에서도 폼이 정상적으로 동작해서 안정성이 높습니다.<br />

셋째, `revalidatePath`나 `revalidateTag` 같은 함수와 함께 사용하면, 데이터 변경 후 화면을 아주 쉽게 갱신할 수 있습니다.<br />

### 외부 공개 API가 필요하다면 '루트 핸들러'

반대로 내 애플리케이션의 UI가 아닌, '외부 서비스'에서 호출해야 하는 API가 필요하다면 '루트 핸들러'를 사용해야만 합니다.<br />

대표적인 예시가 바로 '웹훅(Webhook)'인데요.<br />

예를 들어, 사용자가 Stripe로 결제를 완료했을 때 Stripe 서버가 우리 서버에게 "결제 끝났어!"라고 알려주거나, Github에 코드가 푸시되었을 때 Vercel에게 배포를 시작하라고 알려주는 상황입니다.<br />

이런 경우에는 외부 서비스가 호출할 수 있는 고정된 URL, 즉 공개된 API 엔드포인트가 반드시 필요하거든요.<br />

서버 액션은 이런 공개 URL을 제공하지 않기 때문에, 이럴 땐 루트 핸들러가 유일한 선택지입니다.<br />

### 세밀한 HTTP 제어가 필요할 때도 '루트 핸들러'

서버 액션은 개발 편의성을 위해 많은 부분을 추상화했는데요.<br />

그 말은 곧, HTTP 프로토콜의 세밀한 부분까지 제어하기는 어렵다는 뜻이기도 합니다.<br />

만약 응답 헤더를 커스텀하거나, 특정 도메인만 허용하는 CORS 설정을 하거나, 쿠키를 직접 설정하는 등 HTTP의 저수준 제어가 필요하다면 '루트 핸들러'가 더 적합합니다.<br />

루트 핸들러에서는 Web 표준 `Request`와 `Response` 객체를 직접 다룰 수 있기 때문이죠.<br />

### AI 챗봇 같은 스트리밍 응답도 '루트 핸들러'

최근 ChatGPT처럼 AI가 답변을 실시간으로 생성해서 보여주는 스트리밍 UI가 유행인데요.<br />

이런 기능을 구현하려면 서버에서 클라이언트로 데이터를 조각내어 지속적으로 보내주는 '스트리밍' 기술이 필요합니다.<br />

현재 서버 액션은 스트리밍 응답을 지원하지 않지만, 루트 핸들러는 `ReadableStream`을 반환하여 이 기능을 완벽하게 구현할 수 있습니다.<br />

## 결정 장애를 위한 최종 정리

아직도 조금 헷갈리신다면, 이 간단한 결정 흐름을 따라가 보세요.<br />

1.  **"이 기능은 외부 서비스(다른 서버, 앱 등)에서 호출해야 하는가?"**<br />
    -   **예**: 무조건 '루트 핸들러'를 사용하세요. (예: 웹훅, 모바일 앱용 API)<br />
    -   **아니오**: 다음 질문으로 넘어가세요.<br />

2.  **"이 기능은 우리 웹사이트의 UI(폼, 버튼)를 통해 데이터를 변경하는 작업인가?"**<br />
    -   **예**: '서버 액션'을 최우선으로 고려하세요. 코드가 훨씬 간결하고 강력합니다.<br />
    -   **아니오**: 다음 질문으로 넘어가세요.<br />

3.  **"스트리밍 응답이나, CORS, 커스텀 헤더 같은 특별한 HTTP 제어가 필요한가?"**<br />
    -   **예**: '루트 핸들러'를 사용하세요.<br />
    -   **아니오**: 혹시 그냥 데이터를 가져오기만(GET) 하는 건가요? 그렇다면 서버 컴포넌트 안에서 직접 데이터를 `fetch`하는 것이 가장 좋습니다. 굳이 두 방식 중 하나를 쓸 필요가 없습니다.<br />

## 결론을 내리며

결론적으로, 서버 액션과 루트 핸들러는 서로를 대체하는 경쟁 관계가 아닌데요.<br />

각자의 역할과 목적이 뚜렷한, 서로를 보완하는 관계입니다.<br />

한 문장으로 요약하자면 이렇습니다.<br />

'UI와 긴밀한 데이터 변경은 서버 액션, 외부 연동을 위한 공개 API는 루트 핸들러'<br />

이 기준만 명확히 기억하고 계신다면, 앞으로 Next.js로 서버 통신 로직을 작성할 때 더 이상 고민하지 않고 올바른 도구를 자신 있게 선택하실 수 있을 겁니다.<br />

새로운 기술이 나올 때마다 그 차이점을 배우고 익히는 것은 쉽지 않은 일이지만, 그만큼 우리의 개발 경험은 더 풍부해지고 코드의 품질은 더 높아지게 되죠.<br />

Next.js가 제시하는 새로운 개발 패러다임을 적극적으로 활용하여 더 나은 웹 애플리케이션을 만들어 보시길 바랍니다.<br />

---
