---
slug: 2025-09-05-tanstack-db-the-future-of-state-management
title: TanStack DB 완벽 가이드 상태 관리의 새로운 패러다임
date: 2025-09-07 05:12:44.840000+00:00
summary: TanStack DB는 프론트엔드에 데이터베이스를 가져와 상태 관리와 데이터 동기화를 통합하는 새로운 라이브러리입니다. 자동 낙관적 업데이트와 유연한 백엔드 연동을 통해 개발 경험을 혁신하는 방법을 알아봅니다.
tags: ["TanStack DB", "상태 관리", "프론트엔드", "React", "데이터베이스", "낙관적 업데이트"]
contributors: []
draft: false
---

'TanStack Query' 다들 한 번쯤은 들어보셨거나 이미 잘 사용하고 계실 텐데요.<br /><br />
바로 그 TanStack 팀에서 프론트엔드 생태계를 또 한 번 뒤흔들 만한 물건을 내놓았습니다.<br /><br />
이름은 바로 'TanStack DB'인데, 이게 어쩌면 우리가 상태 관리를 바라보는 시각 자체를 완전히 바꿔버릴지도 모르거든요.<br /><br />
오늘은 이 TanStack DB가 도대체 무엇이고, 우리 개발자들에게 어떤 혁신적인 경험을 선사할 수 있는지 아주 깊이 있게 파고들어 보겠습니다.<br /><br />

## TanStack DB 그게 뭔데

TanStack DB의 핵심 아이디어는 정말 단순하면서도 강력한데요.<br /><br />
바로 '프론트엔드에 직접 데이터베이스를 가져온다'는 개념입니다.<br /><br />
기존에는 백엔드 데이터베이스가 '원본'이고 프론트엔드는 그 데이터를 주기적으로 가져와서 보여주는 방식이 일반적이었는데요.<br /><br />
TanStack DB는 이 흐름을 완전히 뒤집어, 프론트엔드가 데이터의 주도권을 갖게 만듭니다.<br /><br />
마치 내 손안에 작은 DB를 하나 쥐고, 컴포넌트에서 직접 SQL처럼 데이터를 조회하고 조작하는 느낌이라고 할 수 있습니다.<br /><br />

## 그래서 뭐가 그렇게 좋은데

### 1. 지긋지긋한 낙관적 업데이트 자동화

사용자 경험을 생각한다면 '낙관적 업데이트(Optimistic Update)'는 이제 선택이 아닌 필수거든요.<br /><br />
서버 응답을 기다리지 않고 UI를 먼저 변경해서 사용자가 쾌적함을 느끼게 하는 아주 중요한 기법입니다.<br /><br />
그런데 TanStack Query를 써보신 분들은 아시겠지만, 이걸 직접 구현하려면 여간 번거로운 게 아니었는데요.<br /><br />
데이터 변경 전 상태를 저장하고, 실패 시 롤백하고, 성공하면 데이터를 다시 불러오는 등 복잡한 코드를 매번 작성해야 했습니다.<br /><br />

TanStack Query로 낙관적 업데이트를 구현하는 코드는 대략 이렇습니다.<br />

```javascript
const mutation = useMutation({
  mutationFn: updateTodo,
  // 이 모든 코드를 직접 작성해야 했습니다.
  onMutate: async (newTodo) => {
    await queryClient.cancelQueries({ queryKey: ['todos'] });
    const previousTodos = queryClient.getQueryData(['todos']);
    queryClient.setQueryData(['todos'], (old) => [...old, newTodo]);
    return { previousTodos };
  },
  onError: (err, newTodo, context) => {
    queryClient.setQueryData(['todos'], context.previousTodos);
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] });
  },
});
```

보기만 해도 머리가 아파오는데요.<br /><br />
이런 코드는 실수하기도 쉽고 유지보수도 정말 어렵습니다.<br /><br />
하지만 TanStack DB를 사용하면 이 모든 과정이 마법처럼 사라지는데요.<br /><br />
우리는 그냥 프론트엔드의 로컬 DB 데이터만 수정하면, 나머지는 라이브러리가 알아서 전부 처리해 줍니다.<br />

```javascript
const updateTodo = async (id: string, newTodo: TODO) => {
  // 그냥 로컬 데이터를 업데이트하면 끝입니다.
  await todosCollection.update(id, (draft) => {
    draft = newTodo;
  });
  await tx.isPersisted.promise;
};
```

코드가 놀랍도록 간결해졌습니다.<br /><br />
이제 우리는 복잡한 로직 대신 비즈니스 로직에만 집중할 수 있게 되는 겁니다.<br /><br />

### 2. 백엔드 기술로부터의 완전한 자유

프론트엔드에서 데이터를 저장할 때 localStorage, IndexedDB 등 여러 선택지가 있는데요.<br /><br />
백엔드와 동기화할 때는 Supabase나 Firebase 같은 BaaS를 사용하기도 합니다.<br /><br />
문제는 이 기술들마다 API가 제각각이라 학습 비용이 발생하고, 한 번 특정 기술을 선택하면 나중에 다른 기술로 바꾸기가 아주 어렵다는 점인데요.<br /><br />
이걸 바로 '벤더 종속성(Vendor Lock-in)'이라고 부릅니다.<br /><br />
TanStack DB는 '어댑터'라는 개념을 통해 이 문제를 아주 우아하게 해결하는데요.<br /><br />
마치 레고 블록을 갈아 끼우듯, 어댑터만 교체하면 localStorage, 인메모리, REST API, Electric SQL 등 다양한 저장소 기술에 자유롭게 연결할 수 있습니다.<br /><br />
백엔드를 Supabase에서 Firebase로 바꾸고 싶다고요.<br /><br />
프론트엔드 코드는 거의 그대로 두고 어댑터만 교체하면 끝입니다.<br /><br />

### 3. 극도로 단순해지는 백엔드

프론트엔드에서 필요한 데이터를 직접 쿼리할 수 있게 되면서, 백엔드의 역할이 크게 줄어들 수 있거든요.<br /><br />
이제 백엔드는 복잡한 API 엔드포인트를 일일이 만들 필요 없이, 데이터베이스 스키마 설계, 'RLS(Row Level Security)' 설정, 그리고 인증 정도만 책임지면 됩니다.<br /><br />
물론 기존에도 Supabase나 Hasura 같은 서비스를 이용하면 비슷한 일이 가능했는데요.<br /><br />
하지만 앞서 말했듯 특정 서비스에 종속되는 문제가 있었습니다.<br /><br />
TanStack DB는 이 모든 것을 추상화한 레이어를 제공하기 때문에, 우리는 특정 기술이 아닌 '표준화된 방식'으로 데이터를 다룰 수 있게 됩니다.<br /><br />

## 직접 사용해 보기

백문이 불여일견이죠.<br /><br />
React 환경에서 TanStack DB를 어떻게 사용하는지 직접 코드를 보며 알아보겠습니다.<br /><br />
먼저 필요한 패키지를 설치해 줍니다.<br />

```bash
npm install @tanstack/db @tanstack/react-db
```

### 1. Collection 정의하기

가장 먼저 할 일은 데이터를 담을 'Collection'을 정의하는 건데요.<br /><br />
기존 데이터베이스의 '테이블'과 똑같은 개념이라고 생각하시면 됩니다.<br />

```typescript
import { createCollection, localStorageCollectionOptions } from "@tanstack/db";
import * as v from "valibot"; 

// Valibot 같은 스키마 라이브러리로 타입을 정의할 수 있습니다.
const drawCalcSchema = v.object({
  id: v.string(),
  name: v.string(),
  gameTemplate: v.string(),
  result: v.string(),
  createdAt: v.date(),
  updatedAt: v.date(),
});

export const drawCalcCollection = createCollection(
  localStorageCollectionOptions({
    storageKey: "my-app-calculations",
    id: "calculations",
    getKey: (item) => item.id,
    schema: drawCalcSchema
  }),
);

// 혹은 일반 TypeScript 타입으로도 정의할 수 있습니다.
type DrawCalc = {
  id: string;
  name: string;
  gameTemplate: string;
  result: string;
  createdAt: Date;
  updatedAt: Date;
};

export const drawCalcCollection = createCollection(
  localStorageCollectionOptions<DrawCalc>({
    storageKey: "my-app-calculations",
    id: "calculations",
    getKey: (item) => item.id,
  }),
);
```

여기서는 localStorage를 저장소로 사용하는 `localStorageCollectionOptions`를 사용했는데요.<br /><br />
앞서 설명한 대로 필요에 따라 다른 어댑터로 얼마든지 교체할 수 있습니다.<br /><br />

### 2. 데이터 조회하기 (Read)

이제 정의된 Collection에서 데이터를 가져와야 하는데요.<br /><br />
이때 `useLiveQuery`라는 아주 강력한 훅을 사용하게 됩니다.<br /><br />
이 훅은 저장소의 데이터를 실시간으로 구독해서, 데이터가 변경될 때마다 컴포넌트를 자동으로 리렌더링해주거든요.<br /><br />
마치 Redux의 `useSelector`와 비슷하지만, 데이터를 선택하는 방식이 SQL과 유사해서 훨씬 더 직관적이고 강력합니다.<br />

```typescript
import { useLiveQuery } from "@tanstack/react-db";
import { eq } from "@tanstack/db";

const { data } = useLiveQuery((q) =>
  q
    .from({ calculations: calculationsCollection })
    .where(({ calculations }) => eq(calculations.id, calculationId))
    .select({
      id: calculations.id,
      name: calculations.name,
      result: calculations.result,
    })
    .orderBy(({ calculations }) => calculations.updatedAt, "desc"),
);
```

이 SQL과 비슷한 문법을 통해 우리가 원하는 데이터만 정확하게, 그리고 효율적으로 가져올 수 있다는 점은 정말 혁신적인 발상입니다.<br /><br />

### 3. 데이터 추가, 수정, 삭제하기 (Create, Update, Delete)

데이터를 읽는 것만큼 중요한 것이 바로 생성, 수정, 삭제인데요.<br /><br />
TanStack DB는 이 작업들도 아주 간단한 API로 제공합니다.<br /><br />
새로운 데이터를 추가할 때는 `insert`를 사용합니다.<br />

```typescript
import { drawCalcCollection } from './collections';

const addNewCalculation = async (newCalc) => {
  await drawCalcCollection.insert(newCalc);
};
```
정말 간단하죠.<br /><br />
데이터를 수정할 때는 `update`를 사용하는데요.<br /><br />
이건 위에서 낙관적 업데이트 예제로 이미 만나봤습니다.<br />

```typescript
const updateCalculation = async (id, updatedFields) => {
  await drawCalcCollection.update(id, (current) => {
    return { ...current, ...updatedFields };
  });
};
```
특정 ID의 데이터를 찾아서 원하는 필드만 업데이트하는 것도 아주 쉽습니다.<br /><br />
마지막으로 데이터를 삭제할 때는 `remove`를 사용하는데요.<br /><br />
이것도 아주 직관적입니다.<br />

```typescript
const deleteCalculation = async (id) => {
  await drawCalcCollection.remove(id);
};
```
이렇게 간단한 API 몇 개만으로 데이터의 전체 생명주기(CRUD)를 관리할 수 있습니다.<br /><br />

### 4. 효율적인 컴포넌트 렌더링 패턴

TanStack DB의 진정한 힘은 컴포넌트와 결합될 때 나타나는데요.<br /><br />
각 컴포넌트가 필요한 데이터만 정확히 구독하도록 설계하여 불필요한 리렌더링을 막을 수 있습니다.<br /><br />
먼저 리스트를 렌더링하는 부모 컴포넌트입니다.<br />

```typescript
const CalculationList = () => {
  // 이 컴포넌트는 오직 'id' 목록의 변경에만 반응합니다.
  const { data } = useLiveQuery((q) =>
    q
      .from({ calculations: calculationsCollection })
      .select({
        id: calculations.id,
      })
  );

  return (
    <>
      {data.map((item) => (
        <CalculationItem key={item.id} calculationId={item.id} />
      ))}
    </>
  );
};
```
`CalculationList` 컴포넌트는 전체 데이터가 아닌 각 아이템의 `id`만 `select` 했는데요.<br /><br />
따라서 이름이나 내용 같은 다른 데이터가 변경되어도 이 리스트 컴포넌트는 리렌더링되지 않습니다.<br /><br />
이제 개별 아이템을 렌더링하는 자식 컴포넌트를 보시죠.<br />

```typescript
const CalculationItem = ({ calculationId }: { calculationId: string }) => {
  // 이 컴포넌트는 오직 'calculationId'를 가진 데이터의 변경에만 반응합니다.
  const { data } = useLiveQuery((q) =>
    q.from({ calculations: calculationsCollection })
      .where(({ calculations }) => eq(calculations.id, calculationId)), 
  );

  const [calculation] = data;
  if (!calculation) return null;

  return (
    <div>
      <h3>{calculation.name}</h3>
      <p>{calculation.result}</p>
    </div>
  );
}
```
`CalculationItem` 컴포넌트는 `props`로 받은 `calculationId`에 해당하는 데이터만 구독하는데요.<br /><br />
이런 구조 덕분에 수백 개의 아이템 중 단 하나만 변경되어도, 오직 그 아이템에 해당하는 `CalculationItem` 컴포넌트만 정확히 리렌더링됩니다.<br /><br />
이것이 바로 TanStack DB가 제공하는 놀라운 성능 최적화의 비밀입니다.<br /><br />

## 상태 관리의 미래를 바꾸다

지금까지는 서버 데이터 동기화 관점에서 이야기를 했는데요.<br /><br />
저는 TanStack DB가 Jotai나 Zustand 같은 로컬 상태 관리 라이브러리의 자리까지 대체할 수 있는 엄청난 잠재력을 가졌다고 생각합니다.<br /><br />
복잡한 상태 구조를 관리하기 위해 상태를 정규화하고 복잡한 셀렉터를 만들었던 경험, 다들 있으실 텐데요.<br /><br />
TanStack DB를 사용하면 데이터의 구조를 스키마로 명확하게 정의하고, SQL과 유사한 쿼리로 상태를 다룰 수 있어 인지 부하가 크게 줄어듭니다.<br /><br />
그리고 이렇게 관리하던 로컬 상태를 필요에 따라 아주 자연스럽게 백엔드와 동기화할 수 있다는 점은 그야말로 '게임 체인저'가 될 수 있습니다.<br /><br />

## 마무리하며

TanStack DB는 단순히 또 하나의 라이브러리가 아닌데요.<br /><br />
이것은 '프론트엔드 중심의 데이터 설계'를 가속화하고, 상태 관리와 데이터 영속화를 통합하며, 심지어 백엔드 아키텍처에도 영향을 미칠 수 있는 거대한 흐름의 시작입니다.<br /><br />
아직은 초기 단계이지만, 이 라이브러리가 앞으로 어떻게 발전하며 프론트엔드 개발의 패러다임을 바꾸어 나갈지 정말 기대되지 않으신가요.<br /><br />
분명한 것은, 이제 우리는 데이터를 이전과는 완전히 다른 방식으로 바라봐야 할 시점이 왔다는 것입니다.<br /><br />
