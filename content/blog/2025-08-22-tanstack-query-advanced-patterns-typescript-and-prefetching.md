---
slug: 2025-08-22-tanstack-query-advanced-patterns-typescript-and-prefetching
title: TanStack Query, 아직도 로딩 스피너 쓰세요? (타입스크립트와 프리페칭으로 만드는 즉각적인 UX)
date: 2025-08-23 09:52:55.172000+00:00
summary: TanStack Query를 타입스크립트로 안전하게 만들고, 프리페칭으로 로딩 스피너를 없애는 고급 패턴을 알아봅니다. 제네릭 훅부터 on hover 프리페칭까지, 사용자 경험을 극적으로 향상시키는 실전 팁을 확인하세요.
tags: ["TanStack Query", "React Query", "TypeScript", "프리페칭", "UX", "성능 최적화"]
contributors: []
draft: false
---

TanStack Query(구 React Query)는 이제 프론트엔드 데이터 페칭의 표준이라고 해도 과언이 아니죠.<br /><br />서버 상태를 아주 우아하게 관리해주지만, 혹시 이 도구의 잠재력을 100% 끌어내고 계신가요?<br /><br />오늘은 TanStack Query를 그냥 '잘 쓰는' 수준을 넘어, '마스터하는' 두 가지 고급 패턴에 대해 이야기해 보려고 하는데요.<br /><br />첫 번째는 타입스크립트를 활용해 우리의 API 훅을 총알도 막아낼 만큼 견고하게 만드는 방법이고요.<br /><br />두 번째는 '프리페칭'을 통해 사용자가 로딩 스피너를 볼 틈도 없이 데이터를 보여주는 마법 같은 사용자 경험을 만드는 기술입니다.<br /><br />이 두 가지만 제대로 익혀도 여러분의 애플리케이션은 코드 품질과 사용자 경험 양쪽에서 한 단계 도약할 수 있을 거예요.<br /><br />

## 타입스크립트로 TanStack Query 날개 달아주기

TanStack Query를 타입스크립트와 함께 쓰면 자동 완성, 컴파일 타임 에러 체크 등 정말 많은 이점을 누릴 수 있는데요.<br /><br />이걸 제대로 활용하면 아주 견고하고 재사용성 높은 데이터 훅을 만들 수 있습니다.<br /><br />

### 기본부터 탄탄하게, 제네릭으로 타입 지정하기

가장 기본적인 `useQuery` 사용법부터 타입스크립트를 적용해 보죠.<br /><br />

```typescript
import { useQuery } from '@tanstack/react-query';

type User = {
  id: string;
  name: string;
};

const fetchUser = async (): Promise<User> => {
  const res = await fetch('/api/user');
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
};

export function useUserQuery() {
  return useQuery<User>(['user'], fetchUser);
}
```

여기서 핵심은 `useQuery<User>` 부분인데요.<br /><br />이렇게 제네릭으로 `User` 타입을 명시해주면, TanStack Query는 이 쿼리가 성공했을 때 반환될 `data`의 타입이 `User`라는 것을 알게 됩니다.<br /><br />덕분에 `data.name` 같은 속성에 접근할 때 자동 완성이 지원되고, 만약 오타라도 나면 컴파일러가 바로 에러를 뱉어주죠.<br /><br />

### 옵션을 타입으로 정의해서 재사용하기

쿼리 옵션을 별도의 타입으로 추출해서 재사용성을 높일 수도 있는데요.<br /><br />`UseQueryOptions` 타입을 활용하면 됩니다.<br /><br />

```typescript
import { UseQueryOptions } from '@tanstack/react-query';

type UserQueryOptions = UseQueryOptions<
  User,         // TQueryFnData: queryFn이 반환하는 데이터 타입
  Error,        // TError: 에러 발생 시 에러 객체의 타입
  User,         // TData: 최종적으로 컴포넌트에 전달될 데이터 타입
  ['user']      // TQueryKey: 쿼리 키의 타입
>;

export const useUserQuery = (options?: UserQueryOptions) => {
  return useQuery(['user'], fetchUser, options);
};
```

이렇게 `UserQueryOptions`라는 타입을 만들어두면, 이 쿼리에 특화된 옵션들을 타입 안전하게 관리하고 다른 곳에서도 쉽게 재사용할 수 있게 되죠.<br /><br />

### 제네릭 훅으로 궁극의 재사용성 달성하기

여기서부터가 진짜 재미있는 부분인데요.<br /><br />아예 어떤 데이터 타입이든 처리할 수 있는 범용적인 `useTypedQuery` 훅을 만들어서 반복 작업을 극적으로 줄일 수 있습니다.<br /><br />마치 우리만의 미니 API 팩토리를 만드는 것과 같죠.<br /><br />

```typescript
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

export function useTypedQuery<
  TData, 
  TError = Error, 
  TQueryKey extends readonly unknown[] = any
>(
  key: TQueryKey,
  queryFn: () => Promise<TData>,
  options?: UseQueryOptions<TData, TError, TData, TQueryKey>
): UseQueryResult<TData, TError> {
  return useQuery(key, queryFn, options);
}
```

이 `useTypedQuery`는 데이터 타입(`TData`), 에러 타입(`TError`), 쿼리 키 타입(`TQueryKey`)을 제네릭으로 받아서 `useQuery`를 한번 감싼 래퍼 훅인데요.<br /><br />이걸 사용하면 새로운 쿼리 훅을 만드는 게 정말 간단해집니다.<br /><br />

```typescript
type Product = { id: number; name: string };

function useProductQuery(id: number) {
  return useTypedQuery<Product>(
    ['product', id], 
    () => fetch(`/api/products/${id}`).then(res => res.json())
  );
}
```

보세요.<br /><br />이제 `useProductQuery`를 만들 때 `useTypedQuery`를 호출하면서 데이터 타입과 쿼리 키, 그리고 `queryFn`만 넘겨주면 됩니다.<br /><br />복잡한 타입 정의는 `useTypedQuery` 안에 모두 캡슐화되어 있죠.<br /><br />이런 패턴은 특히 여러 엔티티를 다루는 큰 프로젝트에서 빛을 발합니다.<br /><br />

### 잠깐, 타입스크립트의 추론 능력을 믿어보세요

한 가지 더 팁을 드리자면, `queryFn`을 인라인 함수로 작성하고 반환 타입을 `Promise<T>`로 명시해주면 타입스크립트가 알아서 데이터 타입을 추론해주거든요.<br /><br />

```typescript
useQuery(['user'], async (): Promise<User> => {
  return fetch('/api/user').then(res => res.json());
});
```

덕분에 굳이 `useQuery<User>`처럼 제네릭을 명시하지 않아도 타입 안전성을 누릴 수 있는 거죠.<br /><br />

## 로딩 스피너를 추방하는 프리페칭의 마법

이제 우리 쿼리가 타입스크립트로 안전해졌으니, 다음은 사용자 경험을 극적으로 끌어올릴 차례인데요.<br /><br />'프리페칭(Prefetching)'은 사용자가 그 데이터를 요청하기도 '전에' 미리 가져와서 캐시에 살짝 숨겨두는 기술입니다.<br /><br />사용자가 링크를 클릭하는 순간, 데이터는 이미 준비되어 있기 때문에 로딩 스피너 없이 즉시 화면이 나타나는 마법 같은 경험을 선사할 수 있죠.<br /><br />

### 가장 기본적인 프리페칭 마우스 호버

프리페칭을 트리거하는 가장 흔하고 효과적인 방법은 사용자가 링크에 마우스를 올렸을 때인데요.<br /><br />사용자가 링크에 마우스를 올렸다는 건, 그 페이지로 이동할 '의도'가 있다는 강력한 신호거든요.<br /><br />

```typescript
import { useQueryClient } from '@tanstack/react-query';

const fetchPost = async (id: number) => {
  // ... 게시글 데이터를 가져오는 로직
};

export default function PostLink({ id }: { id: number }) {
  const queryClient = useQueryClient();

  return (
    <a
      href={`/posts/${id}`}
      onMouseEnter={() => {
        queryClient.prefetchQuery(['post', id], () => fetchPost(id));
      }}
    >
      게시글 #{id} 보기
    </a>
  );
}
```

`useQueryClient` 훅으로 쿼리 클라이언트 인스턴스를 가져온 뒤, `<a>` 태그의 `onMouseEnter` 이벤트 핸들러 안에서 `queryClient.prefetchQuery`를 호출하면 끝입니다.<br /><br />이제 사용자가 이 링크에 마우스를 올리는 순간, 백그라운드에서 `fetchPost`가 실행되고 그 결과가 `['post', id]`라는 키로 캐시되죠.<br /><br />

### 프리페칭 에러 처리, 잊지 마세요

그런데 이 `prefetchQuery`는 기본적으로 '실행하고 잊어버리는(fire-and-forget)' 방식으로 동작하거든요.<br /><br />그래서 만약 프리페칭 중에 네트워크 에러가 발생해도 조용히 무시해버립니다.<br /><br />만약 에러를 로깅하거나 다른 처리를 하고 싶다면, 반드시 `await` 키워드를 사용해서 비동기적으로 처리해야 합니다.<br /><br />

```typescript
try {
  await queryClient.prefetchQuery(['post', id], () => fetchPost(id));
} catch (err) {
  console.error('프리페칭 실패:', err);
}
```

이렇게 `try-catch` 블록으로 감싸주면 프리페칭 실패에 대한 예외 처리가 가능해집니다.<br /><br />

### useQuery와의 아름다운 협업

이게 바로 프리페칭의 하이라이트죠.<br /><br />사용자가 마침내 링크를 클릭해서 해당 게시글 페이지로 이동했다고 해봅시다.<br /><br />그 페이지의 컴포넌트는 아마 이렇게 `useQuery`를 사용하고 있을 텐데요.<br /><br />

```typescript
const { data } = useQuery(['post', id], () => fetchPost(id));
```

TanStack Query는 `fetchPost`를 실행하기 전에, 먼저 캐시에 `['post', id]` 키에 해당하는 데이터가 있는지 확인합니다.<br /><br />그런데 우리가 이미 프리페칭을 해뒀기 때문에, 캐시에는 신선한 데이터가 딱 준비되어 있죠.<br /><br />그러면 TanStack Query는 네트워크 요청을 보내는 대신, 캐시에서 데이터를 즉시 꺼내 반환합니다.<br /><br />결과는? 로딩 스피너 없는 즉각적인 화면 전환이죠.<br /><br />사용자 입장에서는 정말 놀랍도록 빠른 속도를 체감하게 되는 겁니다.<br /><br />

### 또 다른 전략들 페이지 로드 시 프리페칭, 그리고 ensureQueryData

마우스를 올릴 때뿐만 아니라, 페이지가 처음 로드될 때 `useEffect`를 사용해서 데이터를 미리 가져와 캐시를 채워두는 전략도 유용한데요.<br /><br />대시보드나 설정 페이지처럼 사용자가 높은 확률로 접근할 데이터를 미리 준비해두는 거죠.<br /><br />

```typescript
useEffect(() => {
  queryClient.prefetchQuery(['settings'], fetchSettings);
}, [queryClient]);
```

또한 TanStack Query v5부터는 `ensureQueryData`라는 아주 편리한 API도 추가되었는데요.<br /><br />이 함수는 캐시에 데이터가 있으면 즉시 반환하고, 없으면 `queryFn`을 실행해서 데이터를 가져온 뒤 그 결과를 반환하고 캐싱까지 해줍니다.<br /><br />사용자 인증 정보처럼, 레이아웃 단에서 반드시 필요한 데이터를 미리 로드하거나 보장하는 데 아주 유용하죠.<br /><br />

## 마치며

오늘 우리는 TanStack Query를 한 단계 더 깊이 있게 사용하는 두 가지 강력한 패턴을 살펴봤는데요.<br /><br />타입스크립트를 활용한 '제네릭 쿼리 훅'은 코드의 안정성과 재사용성을 극대화해서 우리의 개발 경험을 향상시켜주고요.<br /><br />`prefetchQuery`와 `ensureQueryData`를 활용한 '스마트 프리페칭'은 로딩 시간을 최소화해서 사용자의 경험을 극적으로 끌어올려 줍니다.<br /><br />이 두 가지 패턴을 잘 조합해서 사용한다면, 여러분은 분명 더 견고하고, 더 빠르고, 더 즐거운 웹 애플리케이션을 만들 수 있을 거예요.<br /><br />
