---
slug: 2025-11-14-typescript-type-testing-guide
title: "타입스크립트 타입 테스트, 컴파일 타임에 안전성 100% 확보하기"
summary: "자바스크립트 코드는 테스트하는데, 타입스크립트 타입은 어떻게 테스트할까요? REST에서 GraphQL로 마이그레이션하며 겪은 타입 불일치 문제를 해결하기 위해 커스텀 타입 가드부터 expect-type, tsd 등 전문 라이브러리까지, 타입 테스트의 모든 것을 알아봅니다."
date: 2025-11-14T07:51:09.978Z
draft: false
weight: 50
tags: ["타입스크립트", "타입 테스트", "TypeScript", "expect-type", "tsd", "타입 가드", "컴파일 타임"]
contributors: []
---

![타입스크립트 타입 테스트, 컴파일 타임에 안전성 100% 확보하기](https://blogger.googleusercontent.com/img/a/AVvXsEj8FllhYFIFPH2hUDY3NJNuzPTysk_zkVQctFCLvFeCz-0UBh3jaPo4-_WC4mWbyyYmZ42N0ZlUoqfEGOj4Qa5a6MNBr-8TcAtyviQ0kneV5cpXbJNdWLpUpyoMFcX7KP4TBRtVCYymJ90LSspT8axIpEn-FjPjjvuiwn62ZcIOUL2fRgLjKce0XGood-Q=s16000)

우리는 보통 자바스크립트(JavaScript)나 타입스크립트(TypeScript) 코드는 열심히 테스트하는데요.

그런데 타입스크립트 '타입' 자체는 어떻게 테스트하고 계신가요?

타입 단언(type assertion)을 사용하기 시작하면, 이게 오늘뿐만 아니라 내일도 유효한지 확인하기 위해 타입을 테스트하고 싶어질 수 있거든요.

참고로 타입 단언은 처음에는 약간 헷갈릴 수 있는데, 무언가를 '검증'하는 것이 아니라 컴파일러에게 '우리를 믿어달라'고 말하는 기능입니다.

어떻게 타입스크립트 타입을 테스트할 수 있는지 자세히 알아보기 전에, 제가 왜 이 고민을 시작하게 됐는지부터 먼저 말씀드릴게요.


### 타입 테스트가 필요해진 순간

저희는 레스트 에이피아이(REST API)에서 그래프큐엘(GraphQL) API로 마이그레이션하는 특정 상황에 있었는데요.

REST API의 데이터는 이넘(enum)으로 표현되었지만, GraphQL API에서는 문자열 리터럴의 유니언(union) 타입을 사용했습니다.


```typescript
enum OldEnum {
  Apple = 'apple',
  Orange = 'orange',
}

type NewUnion = 'apple' | 'orange';
//   ^? type NewUnion = "apple" | "orange"
```

두 타입 모두 동일한 값을 포함하기 때문에 서로 동등하다는 것을 우리는 알 수 있지만, 컴파일러는 아직 그 사실을 모르거든요.

만약 `OldEnum`을 매개변수로 받는 함수가 있다면, 컴파일러는 두 타입이 동등한지 모르기 때문에 `NewUnion` 타입을 전달할 수 없습니다.


```typescript
function doSomethingWithOldEnum(param: OldEnum) {
  console.log(param);
}

doSomethingWithOldEnum(OldEnum.Apple); // OK
doSomethingWithOldEnum('apple');
// ^ Argument of type '"apple"' is not assignable to parameter of type 'OldEnum'.(2345)
```

반대의 상황은 가능한데요.

이넘(enum) 값을 문자열 리터럴 유니언(union)에 대해 검증하는 것은 가능하기 때문입니다.


```typescript
function doSomethingWithNewUnion(param: NewUnion) {
  console.log(param);
}

doSomethingWithNewUnion('apple'); // OK
doSomethingWithNewUnion(OldEnum.Apple); // OK
```

그렇다면 `OldEnum`을 기대하는 함수에 `NewUnion`을 어떻게 전달할 수 있을까요?

이럴 때 바로 타입 단언을 사용해서 컴파일러를 믿게 만들어야 하는데요.

우리가 시각적으로 두 타입이 동일하다는 것을 확인했으니, 컴파일러에게도 그걸 알려주는 것입니다.


```typescript
function convertNewUnionToOldEnum(param: NewUnion) {
  return param as OldEnum;
}

const value = convertNewUnionToOldEnum('apple');
//    ^? const value: OldEnum

doSomethingWithOldEnum(value); // OK
```

'오늘'은 두 타입이 동등하다는 것을 알기 때문에 타입 단언을 안전하게 사용할 수 있는데요.

하지만 '내일'은 어떨까요?

만약 `OldEnum`에 새로운 값을 추가하거나, 하나를 제거하거나, 이름을 바꾸면 어떻게 될까요?

더 이상 1:1 대응이 아니게 됩니다.

바로 이 지점에서 타입스크립트 타입을 위한 테스트가 아주 유용해집니다.


### 초기의 해결책 직접 만들어보기

당시에는 더 나은 방법을 찾지 못해서 제가 채택했던 초기 해결책을 소개해 드릴 텐데요.

여전히 유용할 수 있지만 처음에는 약간 혼란스러울 수 있습니다.

우선 이전에 했던 것처럼 두 타입이 동등하다는 것을 단언해야 하는데요.

어떻게 비교할 수 있을까요?

먼저, 템플릿 리터럴을 사용해 이넘(enum)을 문자열 리터럴의 유니언(union)으로 변환할 수 있거든요.


```typescript
// 템플릿 리터럴로 기존 이넘을 유니언으로 변환할 수 있습니다
type OldEnumAsUnion = `${OldEnum}`;
//   ^? type OldEnumAsUnion = "apple" | "orange"
```

그런 다음, 두 타입이 시각적으로 동등하다는 것을 확인할 수 있습니다.


```typescript
type NewUnion = 'apple' | 'orange';
//   ^? type NewUnion = "apple" | "orange"
```

이제 남은 일은 두 타입이 일치하지 않을 경우 타입스크립트 오류를 발생시키는 것뿐인데요.

이를 위해 두 타입이 서로를 제약하는지 확인하는 `IsExact`라는 헬퍼 타입을 만들 수 있습니다.


```typescript
/**
 * 한 타입이 다른 타입과 정확히 같은지 단언하는 헬퍼 타입
 *
 * @example
 * type Example = IsExact<NewUnion, 'apple' | 'orange'>;
 * //   ^? type Example = true
 */
export type IsExact<T, U> = [T] extends [U]
  ? [U] extends [T]
    ? true
    : false
  : false;
```

이것은 타입이기 때문에 그대로 사용할 수는 없고, 단언 함수와 결합해야 하는데요.

이 함수의 이름은 약간 혼란스러울 수 있습니다.

런타임에는 아무것도 단언하지 않는 빈 함수이고, 타입스크립트의 단언 함수(assertion functions)와도 아무 관련이 없기 때문입니다.


```typescript
/**
 * 컴파일 타임에 한 타입이 다른 타입과 정확히 같은지 단언하는 함수 (런타임에는 아무것도 안 함).
 * ...
 * @param expectTrue - 타입이 정확히 같다면 true여야 하는 불리언 값
 *
 * @example
 * assertType<IsExact<NewUnion, 'apple' | 'orange'>>(true);
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- 런타임에 아무것도 하지 않는 것이 의도된 동작임
export function assertType<T extends true | false>(expectTrue: T) {}
```

마지막으로, 이전에 만들었던 변환 함수로 돌아가 `assertType` 함수를 사용하면 타입 단언을 '타입-안전한' 단언으로 바꿀 수 있습니다.


```typescript
function convertNewUnionToOldEnum(param: NewUnion) {
  assertType<IsExact<NewUnion, OldEnumAsUnion>>(true);

  return param as OldEnum;
}
```

이렇게 하면 `NewUnion`을 `OldEnum`으로 캐스팅하는 것이 항상 안전하며, 두 타입의 값이 달라지는 상황을 방지할 수 있습니다.

하지만 이 방법은 몇 가지 단점도 있었는데요.

런타임에 아무것도 하지 않는 함수가 호출되는 것이 조금 이상하고, 이 함수는 타입에 아무런 영향을 주지 않기 때문에 조용히 제거될 수도 있습니다.

두 타입이 일치하지 않으면 컴파일 타임에 오류가 발생하긴 하지만, 컴파일 과정보다는 테스트 스위트의 일부로 포함되는 것이 더 발견하기 쉬울 것입니다.


## 더 스마트한 방법 전문 라이브러리 활용하기

이제 타입 테스트를 프로젝트에 쉽게 통합할 수 있는 몇 가지 고급 솔루션을 살펴보겠습니다.


### 1. expect-type

이건 제가 가장 좋아하는 방법이자, 타입 페스트(Type Fest), 아폴로 클라이언트(Apollo Client), 프리즈마 클라이언트(Prisma Client), 티알피씨(tRPC) 등 유명 라이브러리에서도 사용하는 방법인데요.

바로 `expect-type` 라이브러리를 사용하는 것입니다.

사용법이 아주 쉽고, 기존 테스트 파일이나 타입 체크가 되는 어떤 파일에서든 직접 사용할 수 있거든요.


```typescript
import { expectTypeOf } from 'expect-type';
import { foo, bar } from '../foo';

test('foo types', () => {
  // `foo`의 타입이 {a: number}인지 확인
  expectTypeOf(foo).toMatchTypeOf<{ a: number }>();

  // `bar`가 문자열을 받는 함수인지 확인
  expectTypeOf(bar).parameter(0).toBeString();
  expectTypeOf(bar).returns.not.toBeAny();
});
```

앞서 다뤘던 예제에 이 라이브러리를 적용하면 다음과 같이 테스트를 작성할 수 있습니다.


```typescript
// convertNewUnionToOldEnum.test.ts
import { expectTypeOf } from 'expect-type';
import { convertNewUnionToOldEnum, type NewUnion, type OldEnumAsUnion } from '../convertNewUnionToOldEnum';

describe('convertNewUnionToOldEnum', () => {
  it('should cast to an equivalent type', () => {
    expectTypeOf<NewUnion>().toEqualTypeOf<OldEnumAsUnion>();
  });
});
```

### 2. tsd

다음은 `tsd`라는 라이브러리인데요.

이 도구는 `.test-d.ts` 확장자를 가진 파일을 만들어 타입 정의 파일(`.d.ts`)을 테스트하게 해줍니다.


```typescript
// index.test-d.ts
import {expectType} from 'tsd';
import concat from '.';

expectType<string>(concat('foo', 'bar'));
expectType<string>(concat(1, 2));
```

### 3. ts-expect

이 라이브러리는 제가 처음에 공유했던 초기 해결책과 꽤 비슷한데요.

`ts-expect`는 `expectType`이라는 런타임에서는 아무것도 하지 않는 함수를 내보냅니다.

대신, 타입스크립트 컴파일러와 제네릭에 의존하여 `expectType`에 전달된 "값"의 타입이 타입 시스템 내에서 제네릭에 할당될 수 있는지 테스트하는 방식입니다.


```typescript
import { expectType } from 'ts-expect';

expectType<string>('test');
expectType<number>(123);
expectType<number>('test'); // 컴파일러 오류!
```

심지어 `IsExact`와 동일한 기능도 내장하고 있습니다.


```typescript
import { expectType, TypeEqual } from 'ts-expect';
import { add } from './adder';

expectType<number>(add(1, 2));
expectType<TypeEqual<number, ReturnType<typeof add>>>(true);
expectType<TypeEqual<[number, number], Parameters<typeof add>>>(true);
```

### 4. type-plus

마지막으로 소개할 것은 가장 복잡하지만, 그만큼 기능이 방대한 `type-plus`인데요.

사실 `type-plus`는 200개가 넘는 타입 유틸리티를 제공하는 거대한 라이브러리라서 테스트뿐만 아니라 애플리케이션 레벨에서도 매우 유용합니다.

다음은 제네릭 단언 함수를 제공하는 `assertType`의 예시입니다.


```typescript
const s: unknown = 1;

// TypeError: subject fails to satisfy s => typeof s === 'boolean'
assertType<boolean>(s, (s) => typeof s === 'boolean');
```
