---
slug: 2025-08-16-typescript-readonly-array-for-safer-code
title: TypeScript 배열, `T[]` 대신 `ReadonlyArray<T>`를 써야 하는 이유
date: 2025-08-17 05:37:21.994000+00:00
summary: 함수 하나 호출했을 뿐인데 원본 배열이 망가진 경험, 있으신가요? 이런 사이드 이펙트 버그를 원천 차단하는 TypeScript의 강력한 무기, `ReadonlyArray<T>`의 모든 것을 알려드립니다. 이제 불변성은 선택이 아닌 필수입니다.
tags: ["TypeScript", "ReadonlyArray", "불변성", "사이드 이펙트", "타입스크립트", "코딩 스타일"]
contributors: []
draft: false
---

함수 하나 호출했을 뿐인데, 멀쩡하던 원본 배열이 박살 나는 경험, 다들 한 번쯤은 있으시죠?<br /><br />
분명 나는 데이터를 그냥 정렬해서 '보여주기만' 하려고 했는데, 어느새 원본 데이터까지 뒤죽박죽이 되어버리는 상황 말입니다.<br /><br />
이런 '사이드 이펙트(Side Effect)' 버그는 잡기도 정말 까다로운데요.<br /><br />
오늘은 바로 이 문제의 근본적인 원인과 TypeScript가 제공하는 우아한 해결책, `ReadonlyArray<T>`에 대해 깊이 파고들어 보려고 합니다.<br /><br />

## 재앙은 아주 사소한 곳에서 시작된다

문제를 한번 직접 만들어보죠.<br /><br />
숫자 배열을 받아서 정렬하고, 첫 번째 요소를 999로 바꾼 뒤 출력하는 간단한 함수들이 있는데요.<br /><br />

```typescript
const sortLog = (array: Array<number>): void => {
  // 배열을 정렬해서 출력
  console.log(array.sort((a, b) => a - b));
};

const setLog = (array: Array<number>): void => {
  // 0번 인덱스의 값을 999로 변경
  array[0] = 999;
  console.log(array);
};

const array = [2, 1, 3];

sortLog(array); // 출력: [ 1, 2, 3 ]
setLog(array);  // 출력: [ 999, 2, 3 ]

// 그런데... 원본 배열은 어떻게 됐을까?
console.log(array); // 출력: [ 999, 2, 3 ]
```

보이시나요?<br /><br />
`sortLog`와 `setLog` 함수를 호출했을 뿐인데, 아무 상관없어 보이던 원본 `array`의 내용이 완전히 바뀌어 버렸습니다.<br /><br />
이게 바로 JavaScript의 `Array.prototype.sort`나 인덱스를 통한 할당(`array[0] = ...`) 같은 메서드들이 원본 배열을 직접 수정하는 '파괴적 변경(Destructive Mutation)'을 일으키기 때문이죠.<br /><br />
이런 코드가 프로젝트 곳곳에 흩어져 있다면, 정말 상상만 해도 끔찍한 디버깅 지옥이 펼쳐질 겁니다.<br /><br />

## TypeScript의 방패, `ReadonlyArray<T>`

자, 그럼 이 재앙을 어떻게 막을 수 있을까요?<br /><br />
답은 아주 간단한데요.<br /><br />
함수의 매개변수 타입을 `Array<T>` 대신 `ReadonlyArray<T>`로 바꾸기만 하면 됩니다.<br /><br />
```typescript
const sortLog = (array: ReadonlyArray<number>): void => {
  // 에러: Property 'sort' does not exist on type 'readonly number[]'.
  // Did you mean 'toSorted'?
  console.log(array.sort((a, b) => a - b));
};

const setLog = (array: ReadonlyArray<number>): void => {
  // 에러: Index signature in type 'readonly number[]' only permits reading.
  array[0] = 999;
  console.log(array);
};
```

마법처럼 TypeScript 컴파일러가 에러를 뿜어내는 게 보이시죠?<br /><br />
`ReadonlyArray<T>`는 말 그대로 '읽기 전용' 배열 타입이라서, `sort`, `push`, `splice`처럼 원본을 변경할 수 있는 모든 메서드가 제거되어 있습니다.<br /><br />
인덱스를 통해 값을 직접 바꾸려는 시도 역시 원천적으로 차단되죠.<br /><br />
이건 단순히 실수를 막아주는 것을 넘어, '이 함수는 전달받은 배열을 절대 수정하지 않습니다'라는 아주 강력한 '계약'을 코드 수준에서 보장하는 겁니다.<br /><br />

### 원본을 건드리지 않는 착한 메서드들

물론 여기서 질문이 생길 수 있는데요.<br /><br />
'그럼 정렬이나 값 변경은 어떻게 하라는 거죠?' 하고 말입니다.<br /><br />
다행히 최신 JavaScript(ES2023)에는 원본을 건드리지 않고 '새로운 배열을 반환하는' 아주 착한 메서드들이 표준으로 추가되었거든요.<br /><br />
`ReadonlyArray<T>`를 사용할 땐 바로 이 메서드들을 쓰면 됩니다.<br /><br />

```typescript
const sortLog = (array: ReadonlyArray<number>): void => {
  // sort() 대신 toSorted() 사용
  console.log(array.toSorted((a, b) => a - b));
};

const setLog = (array: ReadonlyArray<number>): void => {
  // 인덱스 할당 대신 with() 사용
  console.log(array.with(0, 999));
};

const array: ReadonlyArray<number> = [2, 1, 3];

sortLog(array);     // 출력: [ 1, 2, 3 ]
setLog(array);      // 출력: [ 999, 1, 3 ]

// 원본 배열은 안전하다!
console.log(array); // 출력: [ 2, 1, 3 ]
```

`toSorted()`, `with()`, 그리고 `toSpliced()` 같은 메서드들은 모두 원본은 그대로 둔 채, 변경된 '복사본'을 새로 만들어 반환하죠.<br /><br />
이제 우리는 사이드 이펙트 걱정 없이 안전하게 데이터를 다룰 수 있게 된 겁니다.<br /><br />

## 사소하지만 중요한 스타일 가이드

읽기 전용 배열을 선언하는 방법에는 사실 두 가지가 있는데요.<br /><br />
`ReadonlyArray<T>`와 `readonly T[]`입니다.<br /><br />

```typescript
const a: ReadonlyArray<number> = [1, 2, 3];
const b: readonly number[] = [1, 2, 3];
```

둘은 기능적으로는 완전히 동일하지만, 저는 개인적으로 `ReadonlyArray<T>`를 사용하는 것을 강력하게 추천하는데요.<br /><br />
첫째, `T[]`는 배열만을 위한 특수 문법이지만, `ReadonlyArray<T>`는 `Promise<T>`나 `Map<K, V>`처럼 일반적인 제네릭 타입 문법과 일관성을 유지해 줍니다.<br /><br />
둘째, 배열이 중첩될 때 가독성 차이가 하늘과 땅 차이죠.<br /><br />

```typescript
// 바깥쪽 배열만 읽기 전용으로 만들고 싶을 때
type A = readonly (number[])[];          // 헷갈린다...
type B = ReadonlyArray<Array<number>>;   // 의도가 명확하다!

// 안쪽 배열만 읽기 전용으로 만들고 싶을 때
type C = (readonly number[])[];        // 더 헷갈린다...
type D = Array<ReadonlyArray<number>>;  // 의도가 명확하다!
```

물론 튜플(`[number, string]`) 타입처럼 길이가 고정된 배열의 읽기 전용 버전을 만들 땐 `readonly [number, string]` 형태로만 쓸 수 있지만, 그 외의 모든 일반 배열에는 `ReadonlyArray<T>`를 쓰는 것이 훨씬 더 나은 선택입니다.<br /><br />

## 불변성은 배열에만 국한되지 않는다

'불변성(Immutability)'이라는 개념은 비단 배열에만 적용되는 게 아닌데요.<br /><br />
TypeScript는 `Set`과 `Map`을 위한 `ReadonlySet<T>`과 `ReadonlyMap<K, V>`도 기본으로 제공합니다.<br /><br />

```typescript
const readonlySet: ReadonlySet<string> = new Set(["A", "B"]);
// readonlySet.add("C"); // 에러!

const readonlyMap: ReadonlyMap<string, number> = new Map([["A", 1]]);
// readonlyMap.set("B", 2); // 에러!
```

객체 속성에도 `readonly` 키워드를 붙여서 수정 불가능하게 만들 수 있죠.<br /><br />

```typescript
type Account = {
  readonly id: string;
  name: string;
};

const account: Account = { id: "user-1", name: "Naru" };
// account.id = "user-2"; // 에러! id는 읽기 전용 속성입니다.
account.name = "Mincho"; // OK
```

이처럼 코드 곳곳에 `readonly`를 적극적으로 활용하는 것은, 데이터의 흐름을 예측 가능하게 만들고 잠재적인 버그를 컴파일 시점에 차단하는 아주 현명한 습관입니다.<br /><br />

## 최종 가이드 그래서 언제 뭘 써야 할까?

지금까지 `ReadonlyArray`의 강력함에 대해 알아봤는데요.<br /><br />
그럼 '모든 배열을 `ReadonlyArray`로 써야 하나?' 하는 궁금증이 생길 수 있죠.<br /><br />
상황에 맞는 명확한 가이드라인을 제시해 드릴게요.<br /><br />
1.  **함수 매개변수 (Function Parameters)**<br />
    '무조건' `ReadonlyArray<T>`를 사용하세요.<br /><br />
    함수가 내부에서 배열을 수정할 의도가 없다는 것을 명확히 하고, 사이드 이펙트를 원천 차단하는 가장 중요한 규칙입니다.<br /><br />
2.  **함수 내부의 로컬 변수 (Local Variables)**<br />
    자유롭게 `Array<T>`를 사용해도 괜찮습니다.<br /><br />
    함수 안에서만 사용되고 외부로 노출되지 않는 변수는 변경이 일어나도 추적하기 쉽기 때문이죠.<br /><br />
    `map`이나 `filter`의 결과물을 새로운 배열에 `push`하며 만드는 경우 등이 여기에 해당합니다.<br /><br />
3.  **함수 반환 타입 (Function Return Types)**<br />
    `ReadonlyArray<T>`를 사용하는 것을 '강력히 권장'합니다.<br /><br />
    함수가 반환한 데이터를 사용하는 쪽에서 실수로 원본을 변경하는 것을 막아주기 때문이죠.<br /><br />
    다만, 함수를 호출하는 쪽에서 명시적으로 배열을 수정해야 하는 것이 함수의 역할이라면 `Array<T>`를 반환할 수도 있습니다.<br /><br />

결국 핵심은 '의도'를 명확하게 드러내는 것인데요.<br /><br />
`ReadonlyArray<T>`를 습관처럼 사용하는 것만으로도 여러분의 TypeScript 코드는 훨씬 더 견고하고 예측 가능하게 변할 거예요.<br /><br />
사이드 이펙트와의 전쟁, 이제 끝낼 때가 되지 않았나요?<br /><br />
