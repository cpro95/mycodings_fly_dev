---
slug: 2025-12-08-typescript-branded-types-guide
title: "타입스크립트 Branded Types 완벽 가이드: 더 안전한 코드 만들기"
summary: "타입스크립트의 구조적 타이핑 한계를 극복하는 Branded Types(Nominal Typing)를 알아봅니다. 유니크한 마커를 사용해 논리적 오류를 방지하고 타입 안정성을 높이는 방법을 상세히 설명합니다."
date: 2025-12-08T12:44:37.749Z
draft: false
weight: 50
tags: ["TypeScript", "Branded Types", "Type Guards", "Assertion Functions", "Nominal Typing", "타입스크립트"]
contributors: []
---

![타입스크립트 Branded Types 완벽 가이드: 더 안전한 코드 만들기](https://blogger.googleusercontent.com/img/a/AVvXsEjV-a5hW_j1z_cvrOp_uMKS7fTivGZBg3SlSLP2nWqI8ZkvYIT1wV155k4jZYs816V36GUVL9F3vhf9XjI8Kn6BdQPg-oVcGh31BJ9RXLWhaHNiABGztlYOnpuSRyHJp95_-1FTwpPL9doZWtwLd4MQoe2oCEWXHjcotK_t59XJ8Xt8JJ6Yaf9K_utZ8-U=s16000)

타입스크립트에서 '브랜디드 타입(Branded Types)'을 사용하면 오류를 방지하는 고유한 타입을 만들 수 있는데요.

고유한 마커를 사용하여 타입 가드와 어셜션 함수가 이 브랜디드 타입을 강제하도록 함으로써 안전성을 더할 수 있습니다.

흔히 '명목적 타이핑(Nominal Typing)'이라고도 불리는 브랜디드 타입은 기본 구조가 같더라도 서로 섞일 수 없는 별개의 타입을 만들 수 있게 해줍니다.

이것은 타입 체크만으로는 잡아낼 수 없는 논리적 오류를 방지하고 싶을 때 특히 유용하거든요.


## 문제 상황

아래 코드 예제를 보면, `divide` 함수는 두 매개변수 모두에 대해 모든 숫자를 허용하고 있습니다.

이 경우 `b`의 값이 0이면 0으로 나누게 되는 위험이 있는데, 이는 "Infinity"를 반환하는 등 의도치 않은 결과를 초래할 수 있거든요.


```typescript
function divide(a: number, b: number) {
  return a / b;
}

const b = 0;
console.log(divide(100, b)); // "Infinity" 출력
```

브랜디드 타입을 구현하면 타입 수준에서 `b`에 0이 사용되는 것을 실수로라도 방지할 수 있습니다.

결과적으로 타입 안전성을 높이고 이러한 오류를 피할 수 있게 되는 것이죠.


## 브랜디드 타입 만들기

타입스크립트의 브랜디드 타입은 기본 타입과 고유 마커를 결합하는 '교차 타입(Intersection Type)'을 사용하여 구현할 수 있는데요.

`NotZero`라는 타입 별칭과 `&` 기호로 지정되는 교차 타입을 사용하여 브랜디드 타입을 정의하는 방법은 다음과 같습니다.


```typescript
// Branded Type
type NotZero = number & { __brand: 'NotZero' };
```

결과물로 나오는 타입은 `number`와 고유한 `__brand` 속성을 가진 객체의 교차점입니다.

이 속성은 고유한 태그 역할을 하여, 브랜디드 타입이 기본 타입이나 다른 브랜디드 타입과 구별되도록 보장해 주거든요.

`__brand`라는 이름은 관례적인 것이며, 때로는 `__type`과 같은 다른 이름을 사용할 수도 있습니다.


## Brand 유틸리티 타입 정의하기

브랜디드 타입을 자주 사용하고 싶다면, 더 쉽게 브랜디드 타입을 만들 수 있도록 도와주는 유틸리티 타입을 만들 수 있습니다.


```typescript
// Utility Type
type Brand<T, B extends string> = T & { __brand: B };

// Branded Type
type NotZero = Brand<number, 'NotZero'>;
```

## 브랜디드 타입에 타입 가드 사용하기

기본 타입을 브랜디드 타입으로 변환하는 가장 간단한 방법은 '사용자 정의 타입 가드(Custom Type Guard)'를 사용하는 것입니다.

타입스크립트의 타입 가드는 `is` 키워드를 활용하여 타입을 예측하는데, 이를 통해 컴파일러가 우리 변수가 브랜디드 타입의 요구사항을 충족한다는 것을 인식하게 도와주거든요.


```typescript
type Brand<T, B extends string> = T & { __brand: B };

type NotZero = Brand<number, 'NotZero'>;

function isNotZero(input: unknown): input is NotZero {
  if (input !== 0) {
    return true;
  }
  return false;
}

function divide(a: number, b: NotZero) {
  return a / b;
}

const b = 0;
if (isNotZero(b)) {
  divide(100, b);
}
```

`isNotZero` 타입 가드를 사용하는 것의 장점은 변수가 `divide` 함수에 전달되기 전에 확인된다는 점을 보장한다는 것입니다.

`divide` 함수는 `b`가 `NotZero` 타입일 것을 요구하므로, 아무 숫자나 직접 전달할 수 없으며 반드시 `isNotZero` 검사를 먼저 통과해야만 합니다.

이 방식은 if 문이 필요하여 코드 블록이 추가됨에 따라 가독성이 약간 떨어질 수는 있지만, 검사가 실패하더라도 프로그램이 중단되지 않는 안전성을 제공합니다.

타입 가드를 사용하는 대신 '어셜션 함수(Assertion Function)'를 사용하는 대안도 있는데요.

이 접근 방식은 if 문이 필요 없어 코드 흐름을 간소화할 수 있습니다.

하지만 어셜션이 실패하면 프로그램이 중단될 수 있으므로, 잠재적인 런타임 예외를 관리하기 위해 try-catch 블록 내에 캡슐화하는 것이 중요합니다.

가독성과 강력한 오류 처리 사이의 이러한 트레이드오프는 타입 가드와 어셜션 함수 중 하나를 선택할 때 고려해야 할 핵심 사항입니다.


## 브랜디드 타입에 어셜션 함수 사용하기

타입스크립트의 어셜션 함수는 런타임 검사를 수행하고, 검사가 성공할 경우 특정 값의 타입이 무엇인지 컴파일러에게 신호를 보내는 데 사용됩니다.


```typescript
function assertNotZero(input: unknown): asserts input is NotZero {
  if (input === 0) {
    throw new Error('Cannot divide by zero');
  }
}
```

이 설정에서 `asserts` 키워드는 우리의 타입 서술어(Type Predicate)를 어셜션으로 변환하는데요.

이는 `assertNotZero`가 오류 발생 없이 완료되면 입력값을 `NotZero` 타입으로 신뢰할 수 있음을 타입스크립트에게 알려주는 역할을 합니다.

변수가 이 함수를 통과하고 나면, 타입스크립트 컴파일러는 이후 코드 블록에서 해당 변수를 추론된 `NotZero` 타입으로 사용할 수 있도록 허용해 주거든요.


```typescript
type Brand<T, B extends string> = T & { __brand: B };

type NotZero = Brand<number, 'NotZero'>;

function assertNotZero(input: unknown): asserts input is NotZero {
  if (input === 0) {
    throw new Error('Cannot divide by zero');
  }
}

function divide(a: number, b: NotZero) {
  return a / b;
}

const b = 0;
assertNotZero(b);
divide(100, b);
```

브랜디드 타입은 `b`가 `divide` 함수에서 사용되기 전에 타입에 대한 안전성 검사를 강제하도록 보장합니다.

결과적으로 부적절한 타입 사용으로 인한 오류 위험을 완화할 수 있게 됩니다.

