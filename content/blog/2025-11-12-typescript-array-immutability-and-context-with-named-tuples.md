---
slug: 2025-11-12-typescript-array-immutability-and-context-with-named-tuples
title: "타입스크립트 배열, 불변성과 명확한 의미를 동시에 잡는 고급 테크닉"
summary: "타입스크립트에서 as const는 불변성을 보장하지만 의미를 잃게 만듭니다. readonly와 네임드 튜플을 함께 사용하여 타입 안정성과 코드 가독성을 모두 높이는 방법을 알아보세요."
date: 2025-11-12T09:51:46.485Z
draft: false
weight: 50
tags: ["타입스크립트", "배열", "튜플", "불변성", "readonly", "네임드 튜플", "const assertions"]
contributors: []
---

![타입스크립트 배열, 불변성과 명확한 의미를 동시에 잡는 고급 테크닉](https://blogger.googleusercontent.com/img/a/AVvXsEgliAF6i6vK9ho2V9np-XZ1MBOProfcePkCLvWweWiYVGGkpyZXPj6QUsu8oJdlazW2-Gwep17FV3yp2BC68en6v8uNrTS1retBaZHgg62YDmdP_CLZQ6uaEEagSvCyQeZcgfNAqBoqvggyAll71CEjGhjk950yn8mf5KhDa2kPrm9SNS7qx3vktglvgtM=s16000)

타입스크립트(TypeScript)에서 배열을 다룰 때면 늘 한 가지 고민에 빠지게 되는데요.

`as const`를 사용하면 '불변성'은 확보되지만, 각 요소가 무엇을 의미하는지 문맥을 파악하기 어려운 문제가 있습니다.

반대로 일반 타입을 쓰면 각 요소에 의미 있는 이름을 부여할 순 있지만, 실수로 데이터가 변경되는 것을 막을 방법이 없거든요.

다행히 타입스크립트에는 이 두 가지 장점을 모두 취할 수 있는 방법이 있는데, 바로 'readonly' 수식어와 '네임드 튜플'을 함께 사용하는 것입니다.

## 기본적인 배열 타입부터 시작하기

타입스크립트에서 배열의 타입을 지정하는 가장 간단한 방법은 기본적인 타입 표기를 사용하는 건데요.

```typescript
const candles: number[][] = [
  [5, 9, 3, 7],
  [2, 4, 1, 3],
];
```

이 방식은 잘 동작하지만, 코드만 봐서는 저 숫자 배열이 무엇을 의미하는지 전혀 알 수 없는 한계가 있습니다.

첫 번째 숫자가 '시가'인지, 아니면 '타임스탬프'인지 알기 위해선 결국 문서를 찾아보거나 코드의 구조를 전부 기억하고 있어야 하거든요.

제네릭 문법을 사용해도 본질은 동일합니다.

```typescript
const candles: Array<number[]> = [
  [5, 9, 3, 7],
  [2, 4, 1, 3],
];
```

두 방법 모두 배열의 길이나 요소의 개수에 제약이 없어 무척 유연한데요.

바로 그 유연함이 오히려 타입 안정성을 해치는 원인이 됩니다.

## 튜플로 배열 구조 강화하기

튜플 타입을 사용하면 배열의 길이를 특정 값으로 고정할 수 있는데요.


```typescript
const candles: Array<[number, number, number, number]> = [
  [5, 9, 3, 7],
  [2, 4, 1, 3],
];
```

이렇게 하면 타입스크립트는 각 'candle' 배열이 정확히 4개의 숫자를 가져야 한다는 사실을 인지하게 됩니다.

대안 문법으로 이렇게 작성할 수도 있거든요.


```typescript
const candles: [number, number, number, number][] = [
  [5, 9, 3, 7],
  [2, 4, 1, 3],
];
```

이제 타입스크립트는 각 candle이 정확히 네 개의 숫자를 가져야 한다는 것을 알게 되었습니다.

하지만 여전히 외부 문서 없이는 이 숫자들의 의미를 파악하기는 어렵다는 문제가 남아있습니다.


## 네임드 튜플로 의미 부여하기

타입스크립트에서는 튜플의 각 요소에 이름을 붙여 그 용도를 명확하게 만들 수 있는데요.

이것이 바로 '네임드 튜플'입니다.


```typescript
const candles: Array<[open: number, high: number, low: number, close: number]> = [
  [5, 9, 3, 7],
  [2, 4, 1, 3],
];
```

배열 축약 문법도 당연히 지원하거든요.


```typescript
const candles: [open: number, high: number, low: number, close: number][] = [
  [5, 9, 3, 7],
  [2, 4, 1, 3],
];
```

이제 코드가 스스로를 설명하는 '자기 서술적 코드'가 되었습니다.

candle 값을 볼 때마다 어떤 요소가 시가(open), 고가(high), 저가(low), 종가(close)인지 즉시 알 수 있거든요.

또한 코드 에디터의 자동 완성 기능이나 마우스를 올렸을 때 나타나는 정보 창에서도 이 이름들이 표시되기 때문에, 코드의 가독성과 유지보수성이 크게 향상되는 것입니다.


## 하지만 여전히 남는 불변성 문제

네임드 튜플은 코드에 명확한 의미를 부여하는 문제를 해결해 주었는데요.

하지만 데이터가 변경되는 '가변성' 문제는 막아주지 못합니다.


```typescript
const candles: [open: number, high: number, low: number, close: number][] = [
  [5, 9, 3, 7],
  [2, 4, 1, 3],
];

candles.push([6, 10, 4, 8]); // 의도치 않았더라도, 이 코드는 정상적으로 동작합니다
candles[0][0] = 100; // 과거 데이터를 수정해버리는 상황
```

이런 데이터 변경을 막기 위해 'as const'를 떠올릴 수도 있거든요.


```typescript
const candles = [
  [5, 9, 3, 7],
  [2, 4, 1, 3],
] as const;
```

이렇게 하면 깊은 불변 구조를 만들 수는 있지만, 맨 처음으로 돌아가 모든 의미 정보를 잃어버리게 됩니다.

타입스크립트는 이 타입을 'readonly [5, 9, 3, 7]'처럼 리터럴 타입으로 추론하는데, 코드를 읽는 다른 사람이 이 숫자들이 무엇을 의미하는지 전혀 이해할 수 없습니다.


## 네임드 튜플로 완성하는 불변성

타입스크립트 3.4부터 배열과 튜플에 'readonly' 수식어를 사용할 수 있게 되었는데요.

이것을 네임드 튜플과 결합하면 불변성과 명확한 의미, 두 마리 토끼를 모두 잡을 수 있습니다.


```typescript
const candles: readonly [open: number, high: number, low: number, close: number][] = [
  [5, 9, 3, 7],
  [2, 4, 1, 3],
];
```

이렇게 하면 배열에 요소를 추가하거나 제거하는 것을 막을 수 있거든요.


```typescript
candles.push([6, 10, 4, 8]); // 에러: 'push' 속성이 존재하지 않습니다
candles[0][0] = 100; // 아직 허용됨! 내부 값들은 여전히 변경 가능합니다
```

이 구조 전체를 완전히 불변하게 만들려면, 내부 튜플에도 'readonly'를 적용해야 하는데요.

이를 위해 시가(Open), 고가(High), 저가(Low), 종가(Close)를 의미하는 'OHLC'라는 이름의 타입 별칭(type alias)을 사용하면 아주 깔끔하게 해결됩니다.


```typescript
type OHLC = readonly [open: number, high: number, low: number, close: number];

const candles: readonly OHLC[] = [
  [5, 9, 3, 7],
  [2, 4, 1, 3],
];
```

물론 'ReadonlyArray'를 사용하는 대안 문법도 있거든요.


```typescript
type OHLC = readonly [open: number, high: number, low: number, close: number];

const candles: ReadonlyArray<OHLC> = [
  [5, 9, 3, 7],
  [2, 4, 1, 3],
];
```

최종 결과는 이렇습니다.


```typescript
candles.push([6, 10, 4, 8]); // 에러: 'push' 속성이 존재하지 않습니다
candles[0][0] = 100; // 에러: 읽기 전용 속성이므로 '0'에 할당할 수 없습니다
```

이제야 비로소 명확한 문맥을 가지면서도 완벽하게 불변하는 데이터 구조가 완성되었습니다.

