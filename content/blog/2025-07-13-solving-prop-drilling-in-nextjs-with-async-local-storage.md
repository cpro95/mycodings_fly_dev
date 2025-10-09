---
slug: 2025-07-13-solving-prop-drilling-in-nextjs-with-async-local-storage
title: "Next.js 라우트 핸들러의 Prop Drilling, 'Node.js의 React Context'로 해결하기"
date: 2025-07-12 10:32:04+00:00
summary: "서버 사이드 함수에서 반복되는 매개변수 전달, 즉 'prop drilling'의 고통을 Node.js의 Async Local Storage로 해결하는 방법을 알아봅니다. React Context처럼 동작하는 이 강력한 기능을 마스터해 보세요."
tags: ["Async Local Storage", "Next.js", "prop drilling", "Node.js", "Route Handler", "상태 관리"]
contributors: []
draft: false
---

비공개 API 엔드포인트를 만들 때, 핸들러는 다른 작업을 수행하기 전에 요청이 인증된 사용자로부터 왔는지 확인해야 합니다.<br /><br />
보통 요청을 확인하는 함수는 요청이 인증된 경우 '사용자(user)' 객체를 반환하고, 이 사용자 객체는 핸들러 내의 다른 함수들에서 사용될 수 있습니다.<br /><br />
그런데 핸들러 안에 여러 함수가 중첩되어 있다면 어떨까요?<br /><br />
각 함수에 이 'user' 객체를 매개변수로 계속해서 전달해야 합니다.<br /><br />
심지어 중간에 있는 함수는 이 객체를 직접 사용하지 않고, 단지 하위 함수에 전달하기 위해 매개변수로 받기만 하는 경우도 생깁니다.<br /><br />
우리가 React에서 흔히 겪는 'prop drilling' 문제가 서버 사이드 코드에서도 똑같이 발생하는 것이죠.<br /><br />
하나의 객체만으로도 이렇게 번거로운데, 여러 객체를 전달해야 한다면 코드는 금세 지저분해질 것입니다.<br /><br />
바로 이때 'Async Local Storage'가 구원투수처럼 등장합니다.<br /><br />
이것은 마치 'Node.js 함수들을 위한 React Context'와도 같습니다.<br /><br />
동일한 실행 컨텍스트 내의 모든 함수, 콜백, 프로미스 체인에서 접근할 수 있는 '저장소'에 데이터를 보관할 수 있게 해줍니다.<br /><br />

## Async Local Storage 사용법<br />

사용법은 비교적 간단합니다.<br /><br />
먼저, 새로운 'Async Local Storage' 인스턴스를 생성하는 것부터 시작합니다.<br /><br />

### 1단계: 컨텍스트 생성하기<br />

`user` 객체를 저장할 컨텍스트를 만들어 보겠습니다.<br /><br />
`user-context.ts` 같은 파일을 만들어 관리하는 것이 좋습니다.<br /><br />

```typescript
// user-context.ts
import { AsyncLocalStorage } from 'async_hooks'
import { User } from './auth' // User 타입은 별도로 정의되어 있다고 가정합니다.

// 'user' 객체를 담을 저장소의 타입을 지정하여 새 인스턴스를 생성합니다.
export const userContext = new AsyncLocalStorage<{
  user: User
}>()

// 컨텍스트 저장소에서 값을 가져오는 헬퍼 함수
export const getUserContext = () => {
  const store = userContext.getStore()
  if (!store) {
    // 컨텍스트가 없는 상태에서 호출되면 에러를 발생시켜 실수를 방지합니다.
    throw new Error(
      'User context not found. The calling function must be wrapped in a userContext.run() block.'
    )
  }
  return store
}
```

여기서 `getUserContext`라는 헬퍼 함수를 만든 것이 중요합니다.<br /><br />
이 함수는 단순히 저장소의 값을 가져오는 것을 넘어, 만약 값이 없을 경우(즉, 컨텍스트 외부에서 호출된 경우) 명확한 에러를 발생시켜 개발자의 실수를 조기에 발견할 수 있도록 도와줍니다.<br /><br />

### 2단계: 컨텍스트 실행하기<br />

이제 Next.js 라우트 핸들러에서 이 컨텍스트를 사용해 보겠습니다.<br /><br />
핵심은 `userContext.run()` 블록으로 사용자 객체에 접근해야 하는 함수들을 감싸주는 것입니다.<br /><br />

```typescript
// route.ts
import { auth } from './auth'
import { getProfile } from './get-profile'
import { userContext } from './user-context'

export const GET = async () => {
  // 1. 먼저 인증을 통해 로그인한 사용자 정보를 가져옵니다.
  const loggedInUser = await auth()

  // 2. userContext.run()을 사용하여 컨텍스트를 설정하고 함수를 실행합니다.
  const data = await userContext.run({ user: loggedInUser }, () => {
    // 이 콜백 함수 내부에서 호출되는 모든 함수는 'loggedInUser'에 접근할 수 있습니다.
    return getProfile()
  })

  return Response.json(data)
}
```

`userContext.run()`의 첫 번째 인자로 우리가 저장하고 싶은 값(`{ user: loggedInUser }`)을 전달하고, 두 번째 인자로 실행할 함수를 전달합니다.<br /><br />
이제 `getProfile()` 함수와 그 안에서 호출되는 모든 하위 함수들은 매개변수 없이도 `loggedInUser` 정보에 접근할 수 있는 '마법의 통로'를 갖게 되었습니다.<br /><br />

### 3단계: 컨텍스트에서 값 사용하기<br />

이제 `getProfile` 함수와, 그 안에서 호출되는 `getTransactions` 함수가 어떻게 사용자 객체에 접근하는지 살펴보겠습니다.<br /><br />

```typescript
// get-profile.ts
import { getTransactions } from './get-transactions'
import { getUserContext } from './user-context'

export type Profile = {
  id: string
  name: string
  email: string
}

export const getProfile = async () => {
  // 매개변수로 user를 받지 않고, 컨텍스트에서 직접 가져옵니다!
  const { user } = getUserContext() 
  
  return {
    id: `${user.id}-profile`,
    name: user.name,
    email: user.email,
    transactions: await getTransactions(), // getTransactions에도 user를 넘겨줄 필요가 없습니다.
  }
}
```

```typescript
// get-transactions.ts
import { getUserContext } from './user-context'

export type Transaction = {
  id: string
  amount: number
  date: string
}

export const getTransactions = async () => {
  // 이 함수 역시 매개변수 없이 컨텍스트에서 user 정보를 가져옵니다.
  const { user } = getUserContext()

  // user.id를 사용해 데이터베이스에서 거래 내역을 조회합니다.
  return [
    {
      id: '1',
      amount: 100,
      date: '2021-01-01',
    },
  ]
}
```

보시다시피, `getProfile`과 `getTransactions` 함수의 매개변수 목록이 아주 깔끔해졌습니다.<br /><br />
더 이상 중간 다리 역할을 하는 불필요한 매개변수 전달이 사라졌고, 각 함수는 자신이 직접 필요로 하는 정보만 컨텍스트로부터 능동적으로 가져옵니다.<br /><br />
이는 코드의 가독성과 유지보수성을 극적으로 향상시킵니다.<br /><br />

## 아쉬운 점: 컴파일 타임 에러 체크의 부재<br />

이 접근 방식은 정말 마음에 듭니다.<br /><br />
하지만 한 가지 아쉬운 점은, 개발자가 실수로 `userContext.run()` 블록으로 감싸는 것을 잊었을 때 이를 잡아줄 린터(linter)가 없다는 것입니다.<br /><br />
물론 우리가 만든 `getUserContext` 헬퍼 함수 덕분에 런타임에는 에러가 발생하여 문제를 인지할 수 있지만, 만약 컴파일 타임에 이 실수를 잡을 수 있다면 훨씬 더 좋을 것입니다.<br /><br />

## 결론<br />

'Async Local Storage'는 서버 사이드 코드, 특히 비동기 작업이 많은 Node.js 환경에서 'prop drilling'이라는 고질적인 문제를 해결하는 매우 강력하고 우아한 해결책입니다.<br /><br />
React 개발자라면 '서버용 Context API'라고 생각하면 그 개념을 쉽게 이해할 수 있을 것입니다.<br /><br />
함수의 인자가 너무 많아져 코드 파악이 어려워지고 있다면, 이 패턴을 도입하여 코드의 복잡도를 낮추고 가독성을 높여보는 것은 어떨까요.<br /><br />