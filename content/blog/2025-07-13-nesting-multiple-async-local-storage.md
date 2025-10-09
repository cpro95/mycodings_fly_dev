---
slug: 2025-07-13-nesting-multiple-async-local-storage
title: 다중 Async Local Storage - React Context처럼 중첩하기
date: 2025-07-12 10:35:52.901000+00:00
summary: 단일 컨텍스트를 넘어, 여러 개의 Async Local Storage를 중첩하여 사용하는 방법을 알아봅니다. 재귀 함수를 이용한 영리한 트릭으로, 서버 사이드 코드의 모듈성을 극대화하고 prop drilling을 완벽하게 해결해 보세요.
tags: ["Async Local Storage", "Next.js", "prop drilling", "React Context", "Node.js", "상태 관리", "react"]
contributors: []
draft: false
---

지난 포스트에서, 저는 'Async Local Storage'가 React의 Context처럼 동작하여 Next.js 라우트 핸들러의 'prop drilling' 문제를 해결하는 방법에 대해 이야기했습니다.<br /><br />
React에서는 단일 거대 컨텍스트 대신 여러 컨텍스트를 사용하여 코드를 모듈식으로 유지할 수 있는데요.<br /><br />
약간의 트릭을 사용하면, Async Local Storage에서도 똑같은 일이 가능합니다.<br /><br />
'user' 컨텍스트 외에 'request' 컨텍스트도 필요한 상황을 가정해 봅시다.<br /><br />
라우트 핸들러가 `sort` 쿼리 파라미터와 `id` 경로 파라미터를 받을 수 있다고 해보죠.<br /><br />
이 `sort`와 `id` 파라미터는 데이터베이스에서 데이터를 가져오는 일부 함수에서 사용됩니다.<br /><br />
Next.js에서는 검색 파라미터와 경로 파라미터가 오직 라우트 핸들러에만 노출됩니다.<br /><br />
Async Local Storage를 사용하면, 검색 파라미터와 경로 파라미터를 위한 컨텍스트를 만들고, 이를 필요로 하는 모든 함수에서 사용할 수 있게 할 수 있습니다.<br /><br />

## 1단계: 추가 컨텍스트 생성하기<br />

이전 글에서 이미 'user'를 위한 컨텍스트를 만들었으니, 이번에는 'request' 정보를 담을 새로운 컨텍스트를 만들겠습니다.<br /><br />
구조는 user 컨텍스트와 매우 유사합니다.<br /><br />

```typescript
// request-context.ts
import { AsyncLocalStorage } from 'async_hooks'

// 검색 파라미터, 경로 파라미터, body 등을 담을 저장소
export const requestContext = new AsyncLocalStorage<{
  searchParams: Record<string, string>
  params: Record<string, string>
  body: Record<string, any>
}>()

// 컨텍스트 저장소에서 값을 가져오는 헬퍼 함수
export const getRequestContext = () => {
  const store = requestContext.getStore()
  if (!store) {
    throw new Error(
      'Request context not found. The calling function must be wrapped in a requestContext.run() block.'
    )
  }
  return store
}
```

이제 우리는 `userContext`와 `requestContext`라는 두 개의 독립적인 컨텍스트를 갖게 되었습니다.<br /><br />
어떻게 이 둘을 함께 사용할 수 있을까요?<br /><br />

## 2단계: 여러 컨텍스트를 중첩하는 '마법의 함수'<br />

여러 개의 `.run()` 함수를 수동으로 중첩시키는 것은 코드를 지저분하게 만듭니다.<br /><br />
대신, 여러 컨텍스트를 받아 재귀적으로 중첩시켜주는 영리한 헬퍼 함수를 하나 만들 수 있습니다.<br /><br />

```typescript
// multiple-async-contexts.ts
export const runWithMultipleContexts = async <T>(
  // [컨텍스트 인스턴스, 저장할 값] 형태의 배열을 받습니다.
  contexts: Array<[InstanceType<typeof AsyncLocalStorage<any>>, any]>,
  mainFunc: () => Promise<T>,
  index: number = 0
): Promise<T> => {
  // 기본 케이스: 모든 컨텍스트를 다 감쌌다면, 메인 함수를 실행합니다.
  if (index >= contexts.length) {
    return mainFunc()
  }

  // 재귀 단계: 현재 컨텍스트로 다음 컨텍스트를 감싸는 재귀 호출을 실행합니다.
  const [storage, store] = contexts[index]
  return storage.run(store, () => runWithMultipleContexts(contexts, mainFunc, index + 1))
}
```

이 `runWithMultipleContexts` 함수는 마치 러시아 인형(마트료시카)처럼 동작합니다.<br /><br />
가장 바깥쪽 컨텍스트가 다음 컨텍스트를 감싸고, 그 컨텍스트가 또 다음 컨텍스트를 감싸는 구조를 재귀적으로 만들어내어, 최종적으로 `mainFunc`가 모든 컨텍스트에 둘러싸인 채 실행되도록 합니다.<br /><br />

## 3단계: 라우트 핸들러에서 사용하기<br />

이제 라우트 핸들러에서 이 마법의 함수를 사용하여 여러 컨텍스트로 메인 함수를 감싸보겠습니다.<br /><br />

```typescript
// app/someroute/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../auth'
import { userContext } from '../user-context'
import { requestContext } from '../request-context'
import { getData } from './data'
import { runWithMultipleContexts } from '../multiple-async-contexts'

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  // 1. 필요한 모든 데이터를 라우트 핸들러에서 준비합니다.
  const searchParams = Object.fromEntries(request.nextUrl.searchParams.entries())
  const paramsObj = await params
  const user = await auth()

  // 2. 각 컨텍스트에 맞는 데이터 객체를 만듭니다.
  const requestContextData = {
    searchParams,
    params: paramsObj,
  }
  const userContextData = {
    user,
  }

  // 3. runWithMultipleContexts를 호출합니다.
  const result = await runWithMultipleContexts(
    [
      [userContext, userContextData],
      [requestContext, requestContextData],
    ],
    () => getData()
  )

  return NextResponse.json(result)
}
```

코드의 의도가 아주 명확해졌습니다.<br /><br />
필요한 컨텍스트와 데이터를 배열로 정의하고, 실행할 함수(`getData`)를 넘겨주기만 하면 됩니다.<br /><br />
`getData` 함수는 이제 `user`, `searchParams`, `params`를 매개변수로 받을 필요가 전혀 없습니다.<br /><br />

## 4단계: 중첩된 컨텍스트에서 값 사용하기<br />

`getData` 함수는 자신이 어떤 복잡한 컨텍스트 구조 안에서 실행되는지 전혀 알 필요가 없습니다.<br /><br />
그저 필요한 시점에 각 컨텍스트의 헬퍼 함수를 호출하기만 하면 됩니다.<br /><br />

```typescript
// app/someroute/[id]/data.ts
import { getRequestContext } from '../request-context'
import { getUserContext } from '../user-context'

export const getData = async () => {
  // 필요한 데이터를 각 컨텍스트에서 직접 가져옵니다.
  const requestStore = getRequestContext()
  const userStore = getUserContext()

  const { searchParams, params } = requestStore

  const sort = searchParams.sort || 'asc'
  const id = params.id
  const user = userStore.user

  // 가져온 값들로 비즈니스 로직을 수행합니다. (예: 데이터베이스 조회)
  console.log(user, sort, id)

  return { user, sort, id }
}
```

이것이 바로 이 패턴의 아름다움입니다.<br /><br />
각 함수는 자신이 의존하는 데이터에만 신경 쓰면 되고, 그 데이터가 어떻게 전달되었는지는 전혀 신경 쓸 필요가 없습니다.<br /><br />

## 결론<br />

`runWithMultipleContexts`와 같은 헬퍼 함수를 사용함으로써, 우리는 코드를 모듈식으로 유지하고 각 로직의 관심사를 명확하게 분리할 수 있습니다.<br /><br />
`user` 정보가 필요한 함수는 `getUserContext`를, `request` 정보가 필요한 함수는 `getRequestContext`를 호출하면 됩니다.<br /><br />
이는 코드를 이해하고 추론하기 쉽게 만들어주며, 서버 사이드 코드의 복잡성을 크게 낮춰줍니다.<br /><br />
마치 React에서 여러 Provider를 중첩하여 사용하는 것처럼, 이제 우리는 Node.js 환경에서도 동일한 우아함을 누릴 수 있게 되었습니다.<br /><br />