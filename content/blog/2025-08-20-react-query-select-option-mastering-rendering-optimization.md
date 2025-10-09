---
slug: 2025-08-20-react-query-select-option-mastering-rendering-optimization
title: React Query select 옵션, 이걸로 렌더링 최적화 끝판왕 되기
date: 2025-08-22 14:11:45.095000+00:00
summary: React Query의 select 옵션을 활용해 불필요한 리렌더링을 막는 방법을 알아봅니다. 기본적인 사용법부터 TypeScript 타입 추론, useCallback을 사용한 성능 최적화, 그리고 fast-memoize를 활용한 최종 보스급 최적화까지, select의 모든 것을 파헤쳐 봅니다.
tags: ["React Query", "select", "렌더링 최적화", "TypeScript", "useCallback", "memoization"]
contributors: []
draft: false
---

[원본 링크](https://tkdodo.eu/blog/react-query-selectors-supercharged)

여기 아주 좋은 글이 있는데요, 이 글의 핵심만 전체적으로 살펴볼까 합니다.<br /><br />
React Query에는 `select`라는 아주 멋진 기능이 있는데요.<br /><br />
사실 대부분의 경우에는 필요 없는 최적화 기능이지만, 일단 필요해지면 그야말로 구세주 같은 역할을 하는 녀석이죠.<br /><br />
오늘은 이 `select` 옵션을 어떻게 활용해서 렌더링 성능을 극한까지 끌어올릴 수 있는지 한번 제대로 파헤쳐 보겠습니다.<br /><br />

## 세밀한 구독이 필요한 이유

React Query는 내부적으로 모든 쿼리 데이터를 하나의 거대한 'QueryCache'에서 관리하는데요.<br /><br />
물론 `useQuery`를 사용할 때 우리가 넘겨주는 '쿼리 키'를 기준으로 구독하기 때문에, 'todos' 쿼리가 바뀐다고 해서 'profile' 쿼리를 사용하는 컴포넌트가 리렌더링되지는 않습니다.<br /><br />
대부분의 경우에는 이 정도 최적화만으로도 충분하죠.<br /><br />
하지만 가끔 API 응답 데이터가 굉장히 클 때가 있거든요.<br /><br />
예를 들어 상품 정보 API가 상품의 이름, 설명처럼 거의 바뀌지 않는 데이터와 재고, 구매 횟수처럼 수시로 바뀌는 데이터를 한꺼번에 내려준다고 생각해 보세요.<br /><br />
우리는 단지 상품 이름만 화면에 보여주고 싶은데, 구매 횟수가 바뀔 때마다 컴포넌트가 계속 리렌더링된다면 이건 좀 억울한 일이죠.<br /><br />
바로 이럴 때 필요한 것이 '더 세밀한 구독 관리'이고, `select` 옵션이 그 해결책이 될 수 있습니다.<br /><br />

## select 옵션의 기본 사용법

`select`는 `useQuery`에 넘겨주는 옵션 중 하나로, 받아온 전체 데이터에서 우리가 정말로 필요한 부분만 '선택'하거나 '변환'해서 구독할 수 있게 해주는 함수입니다.<br /><br />
Redux의 셀렉터와 아주 비슷한 역할을 하죠.<br /><br />
말로만 하면 어려우니 코드를 바로 보겠습니다.<br /><br />
먼저 상품 정보를 가져오는 기본 쿼리 옵션이 있다고 해보죠.<br /><br />

```typescript
const productOptions = (id: string) => {
  return queryOptions({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id),
  })
}
```

이제 이 상품의 제목만 보여주는 컴포넌트를 만든다고 해볼게요.<br /><br />
일반적으로는 이렇게 작성할 겁니다.<br /><br />

```typescript
function ProductTitle({ id }: Props) {
  const productQuery = useSuspenseQuery(productOptions(id))

  return <h1>{productQuery.data.title}</h1>
}
```

이 코드는 아무 문제가 없지만, 아까 말했듯이 `productQuery.data`에 있는 다른 속성(재고 등)이 바뀌면 이 컴포넌트도 불필요하게 리렌더링될 수 있습니다.<br /><br />
이때 `select`를 사용하면 이렇게 바꿀 수 있는데요.<br /><br />

```typescript
function ProductTitle({ id }: Props) {
  const productTitleQuery = useSuspenseQuery({
    ...productOptions(id),
    select: (data) => data.title,
  })

  return <h1>{productTitleQuery.data}</h1>
}
```

`select` 옵션으로 `(data) => data.title` 이라는 함수를 넘겨줬습니다.<br /><br />
이렇게 하면 `ProductTitle` 컴포넌트는 이제 전체 상품 데이터가 아니라, 오직 `title` 값의 변경에만 반응하게 되죠.<br /><br />
`title`은 거의 바뀔 일이 없으니, 이제 이 컴포넌트는 거의 리렌더링되지 않을 겁니다.<br /><br />
정말 강력하죠?<br /><br />
심지어 여러 값을 선택해서 새로운 객체로 만들어 반환해도 괜찮습니다.<br /><br />
React Query가 `select` 결과에 대해 '구조적 공유(structural sharing)'를 지원하기 때문에, 실제 내용이 바뀐 속성이 있을 때만 리렌더링을 유발하거든요.<br /><br />

## TypeScript와 함께 우아하게 사용하기

`select` 옵션의 또 다른 장점은 타입스크립트와 아주 잘 맞는다는 건데요.<br /><br />
`select` 함수가 반환하는 값의 타입을 알아서 추론해서 `data`의 타입으로 지정해 줍니다.<br /><br />
`select: (data) => data.title` 이면 `data`는 `string` 타입이 되고, `select: (data) => ({ title: data.title })` 이면 `data`는 `{ title: string }` 타입이 되는 식이죠.<br /><br />
그런데 여기서 한 가지 질문이 생길 수 있습니다.<br /><br />
"재사용 가능한 쿼리 옵션 함수에 `select`를 인자로 받게 하려면 타입을 어떻게 지정해야 할까?" 하는 거죠.<br /><br />
발표자의 대답은 아주 명쾌하더라고요.<br /><br />
'그렇게 하지 마세요!' 입니다.<br /><br />
React Query의 '쿼리 옵션 API'는 애초에 공통 옵션을 추상화하고, 사용하는 쪽에서 추가 옵션을 쉽게 덧붙일 수 있도록 설계되었거든요.<br /><br />
그러니 굳이 복잡한 타입 정의를 할 필요 없이, 앞에서 본 것처럼 `...productOptions(id)`로 공통 옵션을 가져오고 그 뒤에 `select` 옵션을 추가하는 것이 가장 좋은 방법입니다.<br /><br />
그래도 꼭 해야겠다면 제네릭을 사용해서 이렇게 할 수는 있다고 하네요.<br /><br />

```typescript
const productOptions = <TData = ProductData>(
  id: string,
  select?: (data: ProductData) => TData
) => {
  return queryOptions({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id),
    select,
  })
}
```

`TData`라는 제네릭 타입을 추가하고, `select` 함수의 반환 타입을 `TData`로 지정하는 방식입니다.<br /><br />
`select`를 넘겨주지 않으면 `TData`는 기본값인 `ProductData`가 되고, `select`를 넘겨주면 그 함수의 반환 타입으로 추론되죠.<br /><br />

## select를 최적화하다 만난 함정

이제 진짜 최적화의 세계로 들어가 볼까요?<br /><br />
만약 `select` 안에서 실행되는 계산이 아주 무겁고 복잡하다면 어떨까요?<br /><br />
수천 개의 리뷰 데이터를 순회하면서 평균 별점을 계산하는 작업 같은 거죠.<br /><br />

```typescript
function ProductList({ filters }: Props) {
  const productsQuery = useSuspenseQuery({
    ...productListOptions(filters),
    select: (data) => expensiveSuperTransformation(data),
  })

  // ...
}
```

이 코드에는 치명적인 문제가 하나 숨어있는데요.<br /><br />
`select` 함수는 두 가지 경우에 다시 실행됩니다.<br /><br />
첫째, 원본 데이터(`data`)가 바뀔 때.<br /><br />
이건 당연하죠.<br /><br />
둘째, `select` 함수 자체가 바뀔 때입니다.<br /><br />
그런데 위 코드처럼 인라인 함수를 사용하면 컴포넌트가 리렌더링될 때마다 '새로운' 함수가 생성되거든요.<br /><br />
결국 컴포넌트가 리렌더링될 때마다, 데이터가 바뀌지 않았음에도 불구하고 저 무거운 `expensiveSuperTransformation` 함수가 계속 다시 실행되는 겁니다.<br /><br />

## useCallback 구원 등판

이 문제를 해결하는 방법은 바로 `useCallback`을 사용해서 `select` 함수를 안정화시키는 겁니다.<br /><br />
`useCallback`이 쓸모없다는 논쟁도 많지만, 바로 이럴 때 정말 유용하게 쓰이죠.<br /><br />

```typescript
function ProductList({ filters, minRating }: Props) {
  const productsQuery = useSuspenseQuery({
    ...productListOptions(filters),
    select: React.useCallback(
      (data) => expensiveSuperTransformation(data, minRating),
      [minRating]
    ),
  })

  // ...
}
```

이제 `select` 함수는 `minRating` prop이 바뀔 때만 새로 생성됩니다.<br /><br />
`minRating`이 그대로라면 컴포넌트가 다른 이유로 리렌더링되어도 `select` 함수는 재사용되고, 덕분에 무거운 계산을 건너뛸 수 있게 되죠.<br /><br />
만약 의존성이 없다면, 아예 함수를 컴포넌트 바깥으로 빼내는 것이 가장 간단하고 확실한 방법입니다.<br /><br />

## 최종 보스 여러 컴포넌트가 동시에 렌더링될 때

자, 이제 마지막 관문입니다.<br /><br />
만약 위에서 만든 `ProductList` 컴포넌트를 화면에 세 번 렌더링하면 어떻게 될까요?<br /><br />
저 무거운 `expensiveSuperTransformation` 함수는 몇 번 실행될까요?<br /><br />
정답은 '세 번'입니다.<br /><br />
`useQuery`를 호출할 때마다 내부적으로 'QueryObserver'라는 것이 하나씩 생성되는데요.<br /><br />
`select` 함수의 결과는 이 QueryObserver 단위로 캐싱되기 때문이죠.<br /><br />
컴포넌트가 세 개면 QueryObserver도 세 개, 따라서 `select` 함수도 각각 한 번씩, 총 세 번 실행되는 겁니다.<br /><br />
데이터는 똑같은데 똑같은 무거운 계산을 세 번이나 하는 건 너무 비효율적이죠.<br /><br />

## 진짜 메모이제이션의 등장

이 문제를 해결하려면 React Query의 바깥에서, 계산 자체를 메모이제이션해야 합니다.<br /><br />
`fast-memoize` 같은 라이브러리를 사용하면 아주 간단하게 해결할 수 있는데요.<br /><br />

```typescript
import memoize from 'fast-memoize'

const select = memoize((data: Array<Product>) =>
  expensiveSuperTransformation(data)
)

function ProductList({ filters }: Props) {
  const productsQuery = useSuspenseQuery({
    ...productListOptions(filters),
    select,
  })

  // ...
}
```
<br />
`expensiveSuperTransformation` 함수를 `memoize`로 감싸서 `select` 함수를 만들었습니다.<br /><br />
이제 `ProductList` 컴포넌트가 세 번 렌더링되면 어떻게 될까요?<br /><br />
`select` 함수 자체는 여전히 세 번 호출됩니다.<br /><br />
하지만 그 안의 `expensiveSuperTransformation` 함수는 첫 번째 호출에서 계산된 결과를 `fast-memoize`가 캐싱해두었다가, 두 번째와 세 번째 호출에서는 캐시된 값을 즉시 반환해 주죠.<br /><br />
결국 무거운 계산은 데이터가 바뀔 때 딱 한 번만 실행되게 됩니다.<br /><br />
이것이 바로 우리가 도달할 수 있는 최상의 최적화 상태인 겁니다.<br /><br />

## 마무리하며

React Query의 `select` 옵션은 단순히 데이터를 골라내는 기능을 넘어, 렌더링 최적화의 아주 강력한 무기가 될 수 있습니다.<br /><br />
물론 모든 곳에 남용할 필요는 없지만, 정말 성능 개선이 필요한 곳에서는 오늘 살펴본 것처럼 `useCallback`과 외부 메모이제이션 라이브러리까지 동원해서 성능을 극한까지 끌어올릴 수 있죠.<br /><br />
이런 깊이 있는 최적화 기법을 하나씩 알아가는 것이 바로 개발의 재미가 아닐까 싶네요.<br /><br />
