---
slug: 2025-11-13-typescript-safely-using-includes-with-readonlyarrays
title: "타입스크립트 ReadonlyArray의 includes, 타입 가드로 타입 안전성 완벽 정복"
summary: "타입스크립트에서 ReadonlyArray의 includes 메서드 사용 시 발생하는 타입 오류의 원인을 알아보고, 타입 캐스팅의 한계를 넘어 타입 가드와 타입 단언을 활용하여 타입 안전성을 유지하며 문제를 해결하는 방법을 알아봅니다."
date: 2025-11-13T07:47:35.934Z
draft: false
weight: 50
tags: ["타입스크립트", "ReadonlyArray", "includes", "타입 안전성", "타입 가드", "타입 단언", "TypeScript"]
contributors: []
---

![타입스크립트 ReadonlyArray의 includes, 타입 가드로 타입 안전성 완벽 정복](https://blogger.googleusercontent.com/img/a/AVvXsEjHXkYTNP9fEmFUXkqwlsfpWeWgiYfTUHy-1KgBgfau70r93j3WijrqbimE9DaisY0kkHABbj1CQ8AsGKja0_1IVHZJ7Drgc4by46mm35Jt3yP3hl6km82pClUxZKygFcC1E6fsOdOeq2iBo1Q6SvDmfzfpXtiLrWf7HDvU-GWFnNhmHstFZ2Z8TEqptB8=s16000)

최근에 `ReadonlyArray`에 `includes`를 사용해봤는데요.

값의 타입 일부를 부분 집합으로 가지고 있는 배열이었는데, 타입스크립트(TypeScript)가 전체 상위 집합의 타입을 예상하면서 오류를 뱉어내는 걸 보고 좀 놀랐습니다.


```
Argument of type 'SUPERSET' is not assignable to parameter of type 'SUBSET'.
```

두 타입이 완벽하게 겹치지 않는 경우를 대비해 이런 보호 장치가 있는 것이 똑똑해 보이긴 하는데요.

하지만 제 경우처럼, 부분 집합 여부를 확인하는 것이 타당한 상황도 분명히 있습니다.

단순히 `string`으로 타입 캐스팅하고 싶지는 않아서 온라인에서 해결책을 찾아봤지만, 기존의 타입 안전성을 유지하면서 조건에 따라 타입을 좁히고 싶었기 때문에 찾은 해결책들이 조금 아쉬웠거든요.

그래서 이 문제에 대한 새로운 관점을 공유해보고자 합니다.


## 문제 상황 설정하기
우선, 과일 목록과 그중 일부를 '인기 상품'으로 정의한 테스트 시나리오를 만들어 보겠습니다.


```typescript
const FRUITS = [
  //  ^? const FRUITS: readonly ["Apple", "Banana", ...
  'Apple',
  'Banana',
  'Orange',
  'Grape',
  'Watermelon',
  'Pineapple',
  'Mango',
  'Strawberry',
  'Peach',
  'Pear',
] as const;

type AllFruits = typeof FRUITS[number];

// 이 배열은 `FRUITS`의 부분 집합입니다.
const TOP_PICKS = ['Apple', 'Peach'] as const satisfies ReadonlyArray<AllFruits>;
//    ^? const TOP_PICKS: readonly ["Apple", "Peach"...
```

여기서 저희가 하고 싶은 건, 선택된 과일(`FRUITS`)이 '인기 상품'(`TOP_PICKS`, 즉 `FRUITS`의 부분 집합)에 포함되는지 확인하는 건데요.

이 기능은 '인기 상품' 요소에 별표 같은 식별 요소를 표시하고 싶을 때 유용하게 사용할 수 있습니다.

만약 선택된 항목이 부분 집합인 `TOP_PICKS`에 포함되는지 확인하려고 하면, 타입스크립트는 이를 허용하지 않거든요.

왜냐하면 타입스크립트는 두 리터럴 배열이 일치하지 않는다는 것을 이미 알고 있기 때문입니다.

'selection'의 타입이 상위 집합인 `FRUITS`를 기반으로 하기 때문이죠.

상위 집합의 모든 멤버가 부분 집합에 존재하지 않는다는 것을 타입스크립트는 이미 알고 있는 겁니다.

(어찌 보면 당연한 이야기죠?) 그래서 타입스크립트는 이게 개발자의 실수일 수 있다고 판단하는 것입니다.


```typescript
function scenario(selection: AllFruits) {
  if (TOP_PICKS.includes(selection)) { // Argument of type '"Apple" | "Banana" | "Orange" | "Grape" | "Watermelon" | "Pineapple" | "Mango" | "Strawberry" | "Peach" | "Pear"' is not assignable to parameter of type '"Apple" | "Peach"'.
    // 무언가 실행
  }
}
```

타입 안전성을 유지하면서 선택 항목이 포함되어 있는지 확인하려면, `TOP_PICKS`의 타입을 넓혀줄 필요가 있습니다.


## 해결책 1 string으로 타입 캐스팅하기
우선 `TOP_PICKS`를 `ReadonlyArray<string>`으로 캐스팅하면 일단 작동은 하거든요.

(정확히는 작동하는 것처럼 보입니다.)


```typescript
function scenario(selection: AllFruits) {
  if ((TOP_PICKS as ReadonlyArray<string>).includes(selection)) {
    const selectionType = selection;
    //    ^? const selectionType: "Apple" | "Banana" | "...
  } else {
    const selectionType = selection;
    //    ^? const selectionType: "Apple" | "Banana" | "...
  }
}
```

하지만 이건 약간의 '꼼수'처럼 느껴지는데요.

우리는 그 값이 `string`이 아니라 특정 리터럴 타입만 될 수 있다는 것을 알고 있기 때문입니다.

리터럴 타입 배열을 만든 목적 자체를 무색하게 만들지만, 그래도 최소한 `selection`의 타입을 `string`으로 바꾸지는 않습니다.


## 해결책 2 상위 집합 타입으로 확장하기
여기서 좀 더 정확하게 타입을 지정할 수 있는데요.

단순히 `string`으로 캐스팅하는 대신, `TOP_PICKS`의 타입을 상위 집합의 전체 도메인으로 확장하여 `selection` 타입과 일치시키는 방법입니다.


```typescript
function scenario(selection: AllFruits) {
  if ((TOP_PICKS as ReadonlyArray<AllFruits>).includes(selection)) {
    const selectionType = selection;
    //    ^? const selectionType: "Apple" | "Banana" | "...
  } else {
    const selectionType = selection;
    //    ^? const selectionType: "Apple" | "Banana" | "...
  }
}
```

작동은 하지만, 여전히 뭔가 이상하거나 적어도 만족스럽지는 않거든요.

조건문 안에서 `selection`의 타입을 좁혀주지 않는다면 리터럴 타입을 만든 의미가 퇴색되기 때문입니다.

즉, `if/else` 조건문 내에서 `selection`이 `TOP_PICKS`에 포함되었다면, `selection`은 전체 과일 목록이 아니라 오직 `TOP_PICKS`에 포함된 값이 될 수밖에 없다는 사실을 타입스크립트가 알아야 합니다.


## 최종 해결책 타입 가드와 타입 단언 활용하기
이제 이전에 사용했던 것과 똑같은 로직을 추출해서, 이번에는 '타입 가드(type guard)'와 '타입 단언(type predicate)'을 결합한 별도의 함수로 정의해 보겠습니다.


```typescript
function isTopPick(
  selection: AllFruits,
): selection is (typeof TOP_PICKS)[number] {
  return (TOP_PICKS as ReadonlyArray<AllFruits>).includes(selection);
}
```

우선 어떤 과일이든 될 수 있는 `selection`을 인자로 받도록 기대하는데요.

그런 다음, `TOP_PICKS`를 그 상위 집합(`FRUITS`)으로 업캐스팅하고, 두 타입이 일치하는 상태에서 `includes`를 호출합니다.

마지막으로, `selection`이 인기 상품인지 아닌지를 반환하는 타입 가드의 함수로 타입 단언을 정의하거든요.

타입 단언과 결합하여, 타입 가드가 `true`를 반환하면 `selection`이 사실은 `TOP_PICKS` 중 하나라는 것을 타입스크립트에게 알려줄 수 있습니다.

이 방법의 진정한 묘미는 바로 여기서 드러나는데요.

타입 안전성을 유지하면서 상위 집합의 값이 부분 집합에 포함되는지 확인할 수 있었을 뿐만 아니라, `selection`의 타입까지도 성공적으로 좁혔습니다.

`isTopPick`이 `true`를 반환하면, `selection` 타입은 `"Apple" | "Peach"`로 좁혀지는 것이죠.


```typescript
function scenario(selection: AllFruits) {
  if (isTopPick(selection)) {
    const selectionType = selection;
    //    ^? const selectionType: "Apple" | "Peach"
  } else {
    const selectionType = selection;
    //    ^? const selectionType: "Banana" | "Orange" | ...
  }
}
```
