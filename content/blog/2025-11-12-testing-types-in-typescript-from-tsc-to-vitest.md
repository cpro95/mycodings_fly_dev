---
slug: 2025-11-12-testing-types-in-typescript-from-tsc-to-vitest
title: "당신의 API를 완벽하게 만들어 줄 타입스크립트 타입 테스트 전략"
summary: "SDK나 API 개발자라면 타입 추론의 예측 가능성을 보장하는 것이 중요합니다. tsc, dtslint, tsd, Vitest 등 다양한 도구를 활용하여 타입 에러를 조기에 발견하고 타입 동작을 보장하는 방법을 알아보세요."
date: 2025-11-12T11:02:56.709Z
draft: false
weight: 50
tags: ["타입스크립트", "타입 테스트", "tsc", "dtslint", "tsd", "Vitest", "API 개발"]
contributors: []
---

![당신의 API를 완벽하게 만들어 줄 타입스크립트 타입 테스트 전략](https://blogger.googleusercontent.com/img/a/AVvXsEiM98JM4GUHGsqyRXbKcdX2UzBpq3wpiLCgi1yvAG1KNjAJt6ChlobyGpR43ubu3tJS7juaWz0iGXDOVHcRbBdq1Nc_oasIKiUYv7jtlF5Cvr_IxxsqwCLCD1IE-23Wiy5C2lDBl8gsGx3HEH2z4XxEf5hME9XnbhOSIUlJPNNmhRZHdvmb026xHRNhjfs=s16000)

혹시 다른 개발자들을 위한 SDK나 API를 만들고 계신가요?

그렇다면 타입을 위한 테스트를 작성하는 건 선택이 아닌 필수라고 할 수 있는데요.

특히 내 라이브러리를 사용하는 개발자들이 '짜증나는' 타입 에러 대신 '훌륭하고 예측 가능한' 타입 추론을 경험하게 하고 싶다면 더욱 그렇습니다.

이번 글에서는 간단한 컴파일러 트릭부터 전문적인 도구까지, 타입스크립트(TypeScript)의 타입을 테스트하는 다양한 방법을 살펴보겠습니다.


## 왜 타입을 테스트해야 할까

일반적으로 타입스크립트의 타입 정보는 런타임 시점에는 사라지기 때문에, 함수처럼 '실행'해볼 수는 없는데요.

하지만 그렇다고 해서 개발 과정에서 타입을 검증할 방법이 없는 것은 아닙니다.

오히려 타입 정의나 API를 설계할 때 잘못된 가정을 초기에 발견하고 바로잡을 수 있거든요.

특히 라이브러리 제작자에게는 이게 정말 중요한 부분입니다.

덕분에 앞으로 코드를 리팩토링하더라도 타입이 어떻게 동작할지에 대한 보증을 확실하게 '고정'할 수 있는 것입니다.


## tsc로 타입 테스트하기

가장 가벼운 방법은 바로 `@ts-expect-error` 주석과 함께 타입스크립트 컴파일러(`tsc`)를 사용하는 건데요.


```typescript
interface User {
  id: number;
  name: string;
}

const good: User = { id: 42, name: 'Alice' };

// 이 주석은 타입스크립트에게 바로 아랫줄에서 에러가 발생할 것을 기대한다고 알려줍니다.
// @ts-expect-error
const bad: User = { id: 'nope', name: 'Alice' };
```

만약 나중에 `User` 인터페이스의 `id` 타입을 `string`으로 바꾼다면 어떻게 될까요?

`bad` 변수에 값을 할당하는 코드가 유효해지면서, 에러가 사라지기 때문에 `@ts-expect-error` 주석 자체가 오히려 에러를 발생시키게 됩니다.


## dtslint로 타입 테스트하기
디티에스린트(dtslint)는 타입 테스트를 위한 최초의 전문 도구였는데요.

네이선 쉬블리샌더스(Nathan Shively-Sanders), 오르타 테록스(Orta Therox), 앤드류 브랜치(Andrew Branch) 같은 타입스크립트 팀 멤버들이 직접 만들었습니다.

이 도구는 특별한 주석을 통해 동작하거든요.


```typescript
// $ExpectType string
String(42);

// $ExpectError
String(true).toFixed();
```

지금은 공식적으로 지원이 중단되었고 `tsd` 같은 최신 도구로 대체되었지만, 여전히 데피니틀리타입드(DefinitelyTyped) 저장소 내에서는 활발히 사용되고 있습니다.

그래서 오래된 프로젝트를 다룰 때는 여전히 유용할 수 있습니다.


## tsd로 타입 테스트하기

`tsd` 프로젝트는 신드레 소르후스(Sindre Sorhus), 마테오 콜리나(Matteo Collina), 오르타 테록스(Orta Therox) 같은 유명 개발자들이 지원하는 프로젝트인데요.

`tsd`를 사용하면 `.test-d.ts` 확장자를 가진 파일을 만들어서 타입 정의(`.d.ts` 파일)를 위한 테스트를 작성할 수 있습니다.

이 방식은 처음에는 좀 어색해 보일 수 있고, 테스트를 작성하기 전에 먼저 코드로부터 `.d.ts` 파일을 생성해야 하는 과정이 필요하거든요.


아래와 같은 코드가 있다고 가정해 보겠습니다.


`index.ts`
```typescript
export function concat(a: string | number, b: string | number) {
  return `${a}${b}`;
}
```

이 코드를 `declaration` 플래그를 활성화해서 컴파일하면 다음과 같은 `.d.ts` 파일이 생성됩니다.


`index.d.ts`
```typescript
export declare function concat(a: string | number, b: string | number): string;
```

이제 이 선언 파일을 기반으로, 타입을 검증하기 위한 `index.test-d.ts` 파일을 만들 수 있습니다.


`index.test-d.ts`
```typescript
import { expectType } from 'tsd';
import { concat } from './index.js';

expectType<string>(concat('Ben', 'ny'));
expectType<string>(concat(7, 2));
// @ts-expect-error
expectType<number>(concat(7, 2));
```

이 코드에 대해 `tsd`를 실행하면, 테스트가 성공적으로 통과했다는 결과를 받게 됩니다.


## Vitest로 타입 테스트하기

만약 이미 유닛 테스트를 위해 바이테스트(Vitest)를 사용하고 있다면, 타입을 테스트하는 가장 자연스러운 방법은 바로 `expectTypeOf` 헬퍼를 사용하는 것인데요.

기존 유닛 테스트와 동일한 스타일과 구조를 따르기 때문에, 새로운 사용법을 위한 별도의 학습이 전혀 필요 없습니다.


`concat.test.ts`
```typescript
import { describe, it, expectTypeOf } from 'vitest';
import { concat } from './index.js';

describe('concat', () => {
  it('returns a string', () => {
    expectTypeOf(concat('Ben', 'ny')).toEqualTypeOf<string>();
    expectTypeOf(concat(7, 2)).toEqualTypeOf<string>();
  });
});
```

`tsd`와는 다르게, 이 방법은 `.d.ts` 파일을 생성하거나 별도의 `.test-d.ts` 파일을 유지할 필요가 없거든요.

그냥 런타임 테스트 코드 바로 옆에 타입 테스트 코드를 작성하면 그만입니다.

단, 타입 테스트를 활성화하려면 테스트 실행 명령어를 `vitest --typecheck`로 업데이트해야 한다는 점만 기억해주세요.
