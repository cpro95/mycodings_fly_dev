---
slug: 2025-08-22-tanstack-query-api-factory-pattern-for-less-boilerplate
title: TanStack Query, 아직도 이렇게 쓰세요? (API 팩토리 패턴으로 boilerplate 박살내기)
date: 2025-08-23 09:46:42.474000+00:00
summary: TanStack Query의 반복적인 API 훅 작성에 지치셨나요? 팩토리 패턴을 활용해 CRUD 훅을 자동으로 생성하고, 보일러플레이트를 획기적으로 줄여 유지보수성을 높이는 실전 방법을 소개합니다.
tags: ["TanStack Query", "React Query", "API 팩토리", "팩토리 패턴", "리액트", "보일러플레이트"]
contributors: []
draft: false
---

최신 프론트엔드 개발에서 API 통신은 이제 일상이죠.<br /><br />특히 TanStack Query(구 React Query)는 캐싱, 백그라운드 리페칭, 상태 관리 등을 알아서 처리해줘서 정말 많은 개발자들의 사랑을 받고 있거든요.<br /><br />그런데 이 강력한 도구에도 한 가지 단점이 있는데요.<br /><br />바로 API 엔드포인트가 늘어날수록 반복적인 코드가 계속해서 늘어난다는 점입니다.<br /><br />오늘은 바로 이 문제를 해결해 줄 아주 영리한 패턴, 'API 팩토리'에 대해 이야기해 보려고 합니다.<br /><br />

## 반복되는 API 훅, 지겹지 않으신가요

TanStack Query를 사용하다 보면, 새로운 API 엔티티(예: 상품, 사용자, 게시글 등)가 추가될 때마다 비슷한 구조의 훅들을 계속해서 만들어야 하는데요.<br /><br />목록을 가져오는 `useGetProducts`, 특정 ID의 상품을 가져오는 `useGetProductById`, 상품을 생성하는 `useCreateProduct`... 이런 식으로 말이죠.<br /><br />각 훅마다 `queryKey`와 `queryFn`을 정의해야 하고, 로딩 및 에러 상태를 처리하며, 데이터 유효성 검사나 가공 로직을 넣어야 합니다.<br /><br />재시도, 캐시 시간, 데이터 무효화(invalidation) 같은 로직들도 계속해서 반복되죠.<br /><br />결국 복사-붙여넣기식 코드가 늘어나고, 나중에 API 명세가 바뀌었을 때 수많은 파일을 오가며 수정해야 하는 위험에 노출되는 겁니다.<br /><br />

## 해결책은 바로 'API 팩토리'

이런 반복 작업을 없애고 코드를 훨씬 더 안전하게 관리할 수 있는 방법이 바로 'API 팩토리' 패턴인데요.<br /><br />이건 CRUD(Create, Read, Update, Delete) 작업에 필요한 훅들을 자동으로 생성해주는 '공장' 함수를 하나 만드는 겁니다.<br /><br />이 팩토리 함수에 엔티티의 기본 정보만 알려주면, 나머지 훅들은 알아서 뚝딱 만들어주는 거죠.<br /><br />백문이 불여일견, 바로 전체 코드를 보면서 어떻게 구현하는지 살펴보겠습니다.<br /><br />

### 1단계 기본 API 서비스 만들기

먼저, 실제 `fetch`나 `axios` 요청을 처리할 기본 레이어를 하나 만들어야 하는데요.<br /><br />이건 여러분의 프로젝트에서 이미 사용하고 있는 모듈을 그대로 쓰시면 됩니다.<br /><br />여기서는 간단하게 `fetch`를 감싼 예제를 보여드릴게요.<br /><br />

```typescript
// api-service.ts
export const apiService = {
  async get(url: string, params?: Record<string, any>) {
    const qs = params
      ? "?" + new URLSearchParams(params as Record<string, string>).toString()
      : "";
    const res = await fetch(url + qs, { credentials: "include" });
    if (!res.ok) throw new Error(`GET ${url}: ${res.status}`);
    return { data: await res.json() };
  },
  async post<T>(url: string, body: T) {
    const res = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`POST ${url}: ${res.status}`);
    return { data: await res.json() };
  },
  async put<T>(url: string, body: T) {
    // ... POST와 유사
  },
  async delete(url: string) {
    // ...
  },
};
```
<br />
GET, POST, PUT, DELETE 요청을 처리하는 간단한 헬퍼 객체입니다.<br /><br />이 `apiService`가 우리 팩토리의 기반이 될 거예요.<br /><br />

### 2단계 핵심 팩토리 함수 구현하기

이제 오늘의 주인공인 API 팩토리 함수를 만들 차례인데요.<br /><br />이 함수는 엔드포인트 URL과 캐시 키로 사용할 문자열, 이 두 가지만 받아서 모든 TanStack Query 훅을 생성해 반환합니다.<br /><br />

```typescript
// api-factory.ts
import { useQuery, useMutation, UseQueryOptions } from "@tanstack/react-query";
import { apiService } from "./api-service";

type QueryParams = Record<string, any> | undefined;

export function createApi<T>(opts: {
  baseEndpoint: string;
  entityKey: string;
}) {
  const { baseEndpoint, entityKey } = opts;

  return {
    useGetListQuery: (params?: QueryParams, options?: UseQueryOptions<T[]>) =>
      useQuery<T[]>({
        queryKey: [entityKey, "list", params],
        queryFn: async () => {
          const res = await apiService.get(baseEndpoint, params);
          return res.data as T[];
        },
        ...(options as any),
      }),

    useGetByIDQuery: (id: number | string, options?: UseQueryOptions<T>) =>
      useQuery<T>({
        queryKey: [entityKey, "byId", id],
        queryFn: async () => {
          const res = await apiService.get(`${baseEndpoint}/${id}`);
          return res.data as T;
        },
        enabled: id != null,
        ...(options as any),
      }),

    useCreateMutation: () =>
      useMutation({
        mutationFn: async (data: Partial<T>) => {
          const res = await apiService.post(baseEndpoint, data);
          return res.data as T;
        },
      }),

    useUpdateMutation: () =>
      useMutation({
        mutationFn: async (input: { id: number | string } & Partial<T>) => {
          const { id, ...data } = input;
          const res = await apiService.put(`${baseEndpoint}/${id}`, data);
          return res.data as T;
        },
      }),

    useDeleteMutation: () =>
      useMutation({
        mutationFn: async (id: number | string) => {
          await apiService.delete(`${baseEndpoint}/${id}`);
          return id;
        },
      }),
  };
}
```

코드가 조금 길어 보이지만, 구조는 아주 간단한데요.<br /><br />`createApi` 함수는 `baseEndpoint` ('/products' 같은)와 `entityKey` ('products' 같은)를 인자로 받습니다.<br /><br />그리고 이 정보들을 사용해서 `useGetListQuery`, `useGetByIDQuery`, `useCreateMutation` 등 5개의 표준 CRUD 훅을 만들어 하나의 객체로 반환해주죠.<br /><br />각 훅의 `queryKey`는 `[entityKey, 'list', params]`처럼 일관된 규칙으로 생성되고, `queryFn`은 앞서 만든 `apiService`를 호출하도록 설정됩니다.<br /><br />이제 이 팩토리를 어떻게 사용하는지 보시죠.<br /><br />

### 3단계 엔티티 API 정의하기

팩토리를 만들었으니, 이제 이 팩토리를 사용해서 '상품(Product)' API를 위한 훅들을 만들어볼 건데요.<br /><br />정말 놀랄 만큼 간단합니다.<br /><br />

```typescript
// product-api.ts
import { createApi } from "./api-factory";

export type Product = {
  id: number;
  name: string;
  price: number;
};

export const productApi = createApi<Product>({
  baseEndpoint: "/products",
  entityKey: "products",
});
```
<br />
네, 이게 전부입니다.<br /><br />`createApi` 팩토리 함수를 호출하면서 상품 API의 엔드포인트와 키만 알려주었을 뿐인데, 이제 `productApi` 객체 안에는 상품 목록 조회, 단일 조회, 생성, 수정, 삭제를 위한 5개의 TanStack Query 훅이 모두 만들어져 있습니다.<br /><br />

### 4단계 컴포넌트에서 사용하기

이제 이렇게 만들어진 훅들을 실제 컴포넌트에서 사용하는 모습을 보시죠.<br /><br />먼저 상품 목록을 보여주는 컴포넌트입니다.<br /><br />

```tsx
// ProductList.tsx
import { productApi } from "./product-api";

export function ProductList() {
  const { data, isLoading, isError } = productApi.useGetListQuery();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Failed to load</div>;

  return (
    <ul>
      {data?.map((p) => (
        <li key={p.id}>
          {p.name} — ${p.price}
        </li>
      ))}
    </ul>
  );
}
```

정말 깔끔하죠?<br /><br />컴포넌트 안에서는 더 이상 `queryKey`나 `queryFn`을 신경 쓸 필요가 없습니다.<br /><br />그저 `productApi.useGetListQuery()`를 호출하기만 하면 되죠.<br /><br />생성, 수정, 삭제 기능도 마찬가지입니다.<br /><br />

```tsx
// ProductEditor.tsx
import { productApi } from "./product-api";

export function ProductEditor() {
  const createProduct = productApi.useCreateMutation();
  const updateProduct = productApi.useUpdateMutation();
  const deleteProduct = productApi.useDeleteMutation();

  return (
    <div>
      <button
        onClick={() => createProduct.mutate({ name: "New", price: 100 })}
      >
        Create
      </button>

      <button
        onClick={() => updateProduct.mutate({ id: 1, price: 150 })}
      >
        Update #1
      </button>

      <button onClick={() => deleteProduct.mutate(1)}>
        Delete #1
      </button>
    </div>
  );
}
```

`useCreateMutation`, `useUpdateMutation`, `useDeleteMutation` 훅을 가져와서 `mutate` 함수를 호출하기만 하면 됩니다.<br /><br />모든 복잡한 로직은 팩토리 안에 숨겨져 있죠.<br /><br />

## 이 접근 방식의 장점은 무엇일까요

이 API 팩토리 패턴이 가져다주는 이점은 정말 명확한데요.<br /><br />*   **보일러플레이트 감소**: 수십 개의 반복적인 훅을 만들 필요 없이, 팩토리 하나와 각 엔티티별 정의 한 줄이면 끝납니다.<br /><br />
*   **일관성**: 모든 쿼리가 동일한 재시도 로직, 캐싱 전략, 데이터 처리 방식을 공유하게 됩니다.<br /><br />
*   **확장성**: 새로운 API 엔드포인트를 추가하는 작업이 아주 빠르고 예측 가능해지죠.<br /><br />
*   **중앙화된 유지보수**: API 명세 변경이나 공통 로직 수정이 필요할 때, 오직 팩토리 파일 하나만 수정하면 됩니다.<br /><br />

## 언제 사용하는 것이 좋을까요

이 팩토리 패턴은 API 엔드포인트가 많고 변경이 잦은 중대형 프로젝트에서 특히 빛을 발하는데요.<br /><br />반복적인 작업을 줄여주고 실수를 방지하며, 전체 API 레이어의 일관성을 유지하는 데 큰 도움이 될 겁니다.<br /><br />물론 API가 몇 개 없는 아주 작은 프로젝트에서는 약간 과하게 느껴질 수도 있겠죠.<br /><br />하지만 프로젝트가 조금이라도 성장할 가능성이 있다면, 처음부터 이 패턴을 도입하는 것을 강력하게 추천합니다.<br /><br />
