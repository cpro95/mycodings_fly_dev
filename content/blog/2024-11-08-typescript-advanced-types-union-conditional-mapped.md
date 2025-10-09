---
slug: 2024-11-08-typescript-advanced-types-union-conditional-mapped
title: TypeScript 타입 시스템 마스터하기 - 유니언, 조건부, 매핑 타입 완벽 해설
date: 2024-11-08 14:00:54.334000+00:00
summary: TypeScript 타입 시스템의 핵심, 유니언, 조건부, 매핑 타입을 활용한 고급 테크닉을 배우고 실용적인 타입 활용 전략을 익히세요. 표준 라이브러리 활용법과 함수 오버로드, this 타입, 커스텀 타입 가드 등으로 TypeScript 타입 마스터가 되어 생산성을 높여보세요.
tags: ["typescript", "타입", "유니언 타입", "조건부 타입", "매핑 타입", "표준 라이브러리"]
contributors: []
draft: false
---

이번 글은 아래 시리즈 글의 후속편인데요.

1. [TypeScript 타입 기초 완전 정복! 1편 - 프리미티브, 객체, 함수, 배열](https://mycodings.fly.dev/blog/2024-10-21-typescript-type-basics-first)

2. [TypeScript 타입 기초 완전 정복! 2편 - 제네릭, 튜플, 유니언, never, 교차 타입](https://mycodings.fly.dev/blog/2024-10-21-typescript-type-advanced-second)

3. [TypeScript 타입 기초 완전 정복! 3편 - as const, unknown, Mapped, Conditional 타입 완벽 분석](https://mycodings.fly.dev/blog/2024-10-21-typescript-type-master-third)


이번 글에서는 TypeScript의 타입을 입문에서 다룬 기본 개념을 넘어서 조금 더 실용적으로 활용할 수 있는 방법들을 알아보겠습니다.

입문 수준을 어느 정도 이해한 상태라면, 이 글을 통해 TypeScript의 타입 시스템이 어떻게 동작하고 어떻게 활용할 수 있는지 이해하는 데 도움이 될 것입니다.

** 목 차 **

- [2024-11-08-typescript-advanced-types-union-conditional-mapped](#2024-11-08-typescript-advanced-types-union-conditional-mapped)
  - [유니언 타입 되짚어보기](#유니언-타입-되짚어보기)
  - [조건부 타입에서의 유니언 분배](#조건부-타입에서의-유니언-분배)
    - [조건부 타입의 결과 부분에서의 타입 변수 치환](#조건부-타입의-결과-부분에서의-타입-변수-치환)
    - [분배되는 것은 타입 변수만](#분배되는-것은-타입-변수만)
    - [never 타입과 유니언 분배](#never-타입과-유니언-분배)
    - [유니언 분배 정리](#유니언-분배-정리)
  - [Mapped 타입의 유니언 분배](#mapped-타입의-유니언-분배)
    - [Mapped 타입과 배열 타입](#mapped-타입과-배열-타입)
    - [`readonly` 배열 타입과의 변환](#readonly-배열-타입과의-변환)
  - [표준 라이브러리의 타입](#표준-라이브러리의-타입)
    - [`Record<K, T>`](#recordk-t)
    - [`Partial<T>`, `Required<T>`, `Readonly<T>`](#partialt-requiredt-readonlyt)
    - [`Pick<T, K>`](#pickt-k)
    - [`Exclude<T, U>`, `Extract<T, U>`](#excludet-u-extractt-u)
    - [`NonNullable<T>`](#nonnullablet)
    - [`Parameters<T>`, `ReturnType<T>`](#parameterst-returntypet)
  - [기타 토픽](#기타-토픽)
    - [함수 오버로드](#함수-오버로드)
    - [`this`](#this)
    - [`this` 타입](#this-타입)
    - [커스텀 타입 가드](#커스텀-타입-가드)
  - [마무리](#마무리)

---

## 유니언 타입 되짚어보기

사실 초급편의 당장은 주인공은 유니언 타입인데요.

그래서 유니언 타입에 대해 한번 복습해보겠습니다.

유니언 타입은 `T1 | T2 | T3`처럼 여러 타입을 `|`로 연결한 타입으로, 의미는 "T1, T2, T3 중 하나인 값의 타입"이 됩니다.

예를 들어 `string | number`는 `string` 또는 `number`인 값의 타입, 즉 "문자열 또는 숫자"라는 타입입니다.

```typescript
// 문자열은 string | number 타입에 대입 가능
const val1: string | number = 'foo';

// 숫자도 string | number 타입에 대입 가능
const val2: string | number = 123;

// 그 외는 안 됨 (에러)
const val3: string | number = { foo: 'bar' };
```

유니언 타입의 좋은 점은, `if`문이나 `switch`문 등에서 실행 시에 타입을 판정하는 코드를 작성하면, 그에 맞춰 타입이 좁혀진다는 점입니다.

```typescript
function func(arg: string | number) {
  if (typeof arg === 'string') {
    // 실행 시에 arg가 문자열임을 확인했으므로
    // 이 안에서는 arg는 string 타입
    console.log(arg.length);
  } else {
    // arg는 string이 아니므로
    // 이 안에서는 arg는 number 타입
    console.log(arg * 10);
  }
}
```

특히, 대수적 데이터 타입 같은 패턴의 타입에 대해서도 이 기능이 유효하게 작동합니다.

```typescript
type None = { type: 'None' };
type Some<T> = { type: 'Some'; value: T };
type Option<T> = None | Some<T>;

function map<T, U>(opt: Option<T>, func: (value: T) => U): Option<U> {
  if (opt.type === 'Some') {
    // 이 안에서는 opt는 { type: 'Some'; value: T } 타입
    const newValue = func(opt.value);
    return { type: 'Some', value: newValue };
  } else {
    // 이 안에서는 opt는 { type: 'None' } 타입
    return { type: 'None' };
  }
}
```

이상이 유니언 타입의 복습이었습니다.

그럼, 첫 번째 주제로 들어가겠습니다.

## 조건부 타입에서의 유니언 분배

TypeScript의 타입 입문을 읽은 여러분은 조건부 타입의 기본을 이미 알고 계실 겁니다.

여담이지만, 조건부 타입의 번역어는 그냥 "조건형"이면 될까요.

사실 조건부 타입에는 TypeScript의 타입 입문 글에서 소개하지 않았던 중요한 성질이 있습니다.

그것이 **유니언 분배 (union distribution)**입니다.

일단 조건부 타입의 예를 볼까요.

```typescript
type None = { type: 'None' };
type Some<T> = { type: 'Some'; value: T };
type Option<T> = None | Some<T>;

/**
 * ValueOfOption<V>: Option<T>를 받아서, 전달된 게 Some 타입이면 내부 값의 타입을 반환합니다.
 * 전달된 게 None 타입이면 undefined를 반환합니다.
 */
type ValueOfOption<V extends Option<unknown>> = V extends Some<infer R> ? R : undefined;

const opt1: Some<number> = { type: 'Some', value: 123 };

// typeof opt1은 Some<number>이므로
// ValueOfOption<typeof opt1>은 number
const val1: ValueOfOption<typeof opt1> = 12345;

const opt2: None = { type: 'None' };

// typeof opt2는 None이므로
// ValueOfOption<typeof opt2>는 undefined
const val2: ValueOfOption<typeof opt2> = undefined;
```

`ValueOfOption<V>`는 `V`에 전달된 타입이 `Some<R>` 타입(의 부분 타입)이었다면 그 `R`을 반환하고, 그렇지 않으면 `undefined`를 반환하는 타입이 됩니다.

그런데 `V`로 `Option<T>` 타입을 전달하면 어떻게 될까요?

우선 `Option<T>` 타입은 `Some<T>` 타입의 부분 타입이 아닙니다.

왜냐하면 `Option<T>` 타입의 값은 `None` 타입일 가능성이 있고, 그것은 `Some<T>`가 아니기 때문입니다. 

그러면 조건부 타입의 정의에 따라 `undefined`가 되는 걸까요?

하지만 사실 그렇지 않습니다.

여기서부터가 이번 글의 새로운 내용입니다.

실제로 해보면, `ValueOfOption<Option<T>>`는 `T | undefined`가 됩니다.

```typescript
type None = { type: 'None' };
type Some<T> = { type: 'Some'; value: T };
type Option<T> = None | Some<T>;

type ValueOfOption<V extends Option<unknown>> = V extends Some<infer R> ? R : undefined;

// T1은 number | undefined가 됩니다.
type T1 = ValueOfOption<Option<number>>;

const val1: T1 = 123;
const val2: T1 = undefined;
```

조건부 타입은 둘 중 하나를 반환해야 하는데, 설마 양쪽 모두라니, 이건 반칙 아닌가요?

이 동작을 설명하는 것이 유니언 분배입니다.

이번 포인트는 조건부 타입의 조건 부분의 타입 `V`가 `Option<T>`라는 유니언 타입이라는 점인데요.

`Option<T>`는 `None | Some<T>`라는 유니언 타입이었죠.

이렇게 조건부 타입의 조건 부분에 유니언 타입이 왔을 때, 조건부 타입은 특수한 동작을 합니다.

한마디로 설명하면, "유니언 타입의 조건부 타입"이 "조건부 타입의 유니언 타입"으로 변환됩니다.

수학 등에서는 이런 동작을 분배라고 하니, 유니언 분배라는 명칭도 거기서 온 것입니다.

이번 예제를 구체적으로 설명하면, `V`에 `Option<T>`, 즉 `None | Some<T>`가 들어오므로, 조건부 타입의 `V` 자리에는 `None`과 `Some<T>`가 각각 들어간 두 개의 조건부 타입이 생성되고, 그것들의 유니언이 됩니다.

즉, `V extends Some<infer R> ? R : undefined`는 `(None extends Some<infer R> ? R : undefined) | (Some<T> extends Some<infer R> ? R : undefined)`로 변환됩니다.

이를 계산하면 확실히 `undefined | T`가 되는데요.

이것이 조건부 타입에서의 유니언 분배의 기본입니다. 이 동작에는 두 가지 정도 주의해야 할 점이 있습니다.

### 조건부 타입의 결과 부분에서의 타입 변수 치환

아래에 보이는 또 다른 조건부 타입을 생각해봅시다.

```typescript
type NoneToNull<V extends Option<unknown>> = V extends Some<unknown> ? V : null;
```

이 `NoneToNull<V>` 타입은 `V`가 `Some<T>`라면 그대로 두고, `None`이라면 `null`로 변환하는 타입입니다. 

앞의 조건부 타입과 큰 차이는, 조건 부분뿐만 아니라 결과 부분에도 `V`가 나타나 있다는 것입니다.

이 `V`에 대해 유니언 분배가 발생하여 `V`가 치환될 때, 결과 부분의 `V`도 동시에 치환됩니다.

`NoneToNull<Option<T>>`의 경우, 이는 `(None extends Some<unknown> ? None : null) | (Some<T> extends Some<unknown> ? Some<T> : null)`로 변환되어, 결과는 `null | Some<T>`가 됩니다.

포인트는 분배 후의 조건부 타입에서, 원래 `V`였던 부분이 좌우 각각 `None`과 `Some<T>`로 치환되었다는 점입니다.

### 분배되는 것은 타입 변수만

또 하나 주의해야 할 점이 있고, 이것이 조건부 타입의 매우 복잡한 부분이기도 합니다.

그것은 지금까지 설명한 유니언 분배가 발생하는 것은 조건 부분의 타입이 **타입 변수인 경우에만** 해당한다는 점입니다.

지금까지의 샘플에서는 조건부 타입의 `extends`의 왼쪽이 전부 `V`였다는 것을 기억하세요.

이 `V`는 `ValueOfOption<V>`와 같이 타입의 인수로 도입된 타입 변수입니다.

이렇게 `extends`의 왼쪽이 타입 변수 하나만인 형태일 때만 유니언 분배가 발생합니다.

예를 들어, `ValueOfOption<V>`를 사용하지 않고, 바로 `Option<number> extends Some<infer R> ? R : undefined`라는 타입을 써보면 어떻게 될까요?

이는 `extends`의 왼쪽이 타입 변수가 아니므로, 유니언 분배가 발생하지 않습니다.

따라서 결과는 `undefined`입니다.

```typescript
type None = { type: 'None' };
type Some<T> = { type: 'Some'; value: T };
type Option<T> = None | Some<T>;

// T1은 undefined
type T1 = Option<number> extends Some<infer R> ? R : undefined;

const val1: T1 = undefined;
// ↓ 이것은 에러가 됩니다.
const val2: T1 = { type: 'Some', value: 123 };
```

이처럼 타입 함수(타입 인수를 가지는 타입을 이렇게 부르겠습니다)를 인라인화했을 뿐인데 결과가 달라진다는 것은 비직관적입니다.

또한 유니언 분배를 사용하고 싶을 때는 반드시 그 부분을 타입 변수로 해야 하며, 즉 타입 함수를 만들어야 합니다.

직접 타입을 작성할 때뿐만 아니라, 다른 사람이 작성한 TypeScript 타입을 읽을 때도, 조건부 타입이 나오면 이것이 유니언 분배를 의도한 것인지, 그렇지 않은 것을 의도한 것인지 생각하면서 읽어야 합니다.

반대로 타입 변수로 조건 분기를 하고 싶지만 유니언 타입이 와도 분배되지 않았으면 할 때의 테크닉으로는, 적당한 타입으로 감싸는 것이 있습니다.

배열 타입으로 감싸는 것이 표기가 간단해서 자주 사용됩니다.

```typescript
type None = { type: 'None' };
type Some<T> = { type: 'Some'; value: T };
type Option<T> = None | Some<T>;

type ValueOfOption<V> = V[] extends Some<infer R>[] ? R : undefined;

// 이는 number 타입
const val1: ValueOfOption<Some<number>> = 123;
// 이는 undefined 타입
const val2: ValueOfOption<None> = undefined;
// 이는 number | undefined가 아닌 undefined 타입
const val3: ValueOfOption<Option<number>> = undefined;
// ↓ 따라서 이것은 에러
const val4: ValueOfOption<Option<number>> = 123;
```

이 예제에서는 조건 부분에 온 `V[]`는 단순한 타입 변수가 아니므로 유니언 분배의 발생 조건에 해당하지 않아, 분배가 발생하지 않습니다.

### never 타입과 유니언 분배

`never` 타입은 속하는 값이 없는 타입이었는데요, 유니언 분배 시에 조금 특수한 동작을 합니다.

`never` 타입은 0개의 유니언 타입처럼 동작합니다.

예로 다음 샘플을 보겠습니다.

```typescript
type IsNever<T> = T extends never ? true : false;

// T1은 never가 됩니다.
type T1 = IsNever<never>;
```

이 예제에서 `IsNever<T>`는 `T`가 `never`라면 `true`가 될 것 같고, 그렇지 않으면 `false`가 되는 타입이라는 의도였지만, `never`를 전달한 결과는 `true`도 `false`도 아닌 `never`입니다.

이는 `never`가 0개의 유니언처럼 동작하기 때문인데요.

다시 말해, `T`가 타입 변수이고 `T extends never ? X : Y` 형태의 조건부 타입에 대해 `T`에 `never`를 대입하면 항상 결과는 `never`가 됩니다.

### 유니언 분배 정리

여기서 설명한 내용을 한마디로 다시 정리하면, "조건부 타입의 조건 부분의 타입이 타입 변수라면 유니언 타입이 분배된다"는 것입니다.

이 동작은 타입에 따라 조건 분기를 하는 것으로서의 조건부 타입의 직관과는 어긋나지만, 이 동작 덕분에 유니언 타입을 매우 편리하게 다룰 수 있게 됩니다.

또한 마지막에 소개한 것처럼, 정말로 타입으로 조건 분기하고 싶을 때의 방법(extends의 왼쪽이 타입 변수만 되지 않도록 하는)이 남아 있으니, 뭐 괜찮지 않을까 싶습니다.

extends의 왼쪽이 타입 변수가 되는 것을 특별 취급하는 이유로는, 유니언을 분배할 때 결과 부분도 치환해야 하기 때문입니다.

아래 예제를 떠올려 보세요.

이 예제에서는 `V`에 들어간 유니언 타입이 분배되므로, 결과 부분도 `V`를 치환하면 된다는 것이 명확합니다.

타입 변수에 들어 있지 않은 유니언 타입을 분배하려고 하면 우변에 나타나는 동일한 타입을 적절히 치환해야 하는데, 이는 어렵습니다.

```typescript
type NoneToNull<V extends Option<unknown>> = V extends Some<unknown> ? V : null;
```

다만, 이처럼 "타입이 타입 변수인지 여부로 동작이 바뀐다"는 성질은 비직관적이고 매우 까다롭기 때문에, 확실히 기억해 두어야 합니다.

## Mapped 타입의 유니언 분배

사실 Mapped 타입도 유니언 타입을 분배합니다.

분배가 발생하는 조건은 조건부 타입 때보다 복잡한데요, 아래와 같은 형태의 Mapped 타입에서 `T`가 타입 변수일 때, `T`에 유니언 타입이 들어오면 분배됩니다.

(`X`는 어떤 타입으로, 타입 변수가 아니어도 됩니다.)

```typescript
{ [P in keyof T]: X }
```

실제로 해보겠습니다. 아래에서 정의하는 `Arrayify<T>`는 `T`의 모든 프로퍼티를 배열화하는 Mapped 타입입니다.

```typescript
type Arrayify<T> = { [P in keyof T]: Array<T[P]> };

type Foo = { foo: string };
type Bar = { bar: number };

type FooBar = Foo | Bar;

// FooBarArr는 유니언 타입이 분배되어 Arrayify<Foo> | Arrayify<Bar>가 됩니다.
type FooBarArr = Arrayify<FooBar>;

const val1: FooBarArr = { foo: ['f', 'o', 'o'] };
const val2: FooBarArr = { bar: [0, 1, 2, 3, 4] };
// ↓ 이것은 Arrayify<Foo>도 Arrayify<Bar>도 아니므로 에러
const val3: FooBarArr = {};
```

Mapped 타입이 분배된 것을 알 수 있습니다.

시험삼아, 아래처럼 `Arrayify<T>`를 거치지 않고 Mapped 타입을 사용해 보니 결과가 달라집니다.

이를 통해 이번에도 역시 타입 변수가 조건이 되는 것을 알 수 있습니다.

```typescript
type Foo = { foo: string };
type Bar = { bar: number };

type FooBar = Foo | Bar;

// FooBarArr는 {}가 됩니다.
type FooBarArr = { [P in keyof FooBar]: Array<FooBar[P]> };
// ↓ 이것이 에러가 나지 않음!
const val1: FooBarArr = {};
```

위 예제에서는 `keyof FooBar`는 `"foo" & "bar"`라는 타입이 됩니다.

이는 `"foo"`이면서 동시에 `"bar"`라는 의미이며, 그런 값은 존재하지 않으니 `never`가 되어야 할 것 같지만, 그렇지도 않은 것 같습니다.

어쨌든 `Foo`와 `Bar`에 공통되는 이름의 프로퍼티는 없으므로, `FooBar`에 존재하는(확실히 존재한다고 말할 수 있는) 프로퍼티는 없습니다.

따라서 `keyof FooBar`에 해당하는 `P`가 없으므로 `FooBarArr`는 `{}`로 계산됩니다.

이러한 Mapped 타입에 의한 유니언의 분배는 `in`의 오른쪽이 `keyof T`(게다가 `T`는 타입 변수)이고 `T`에 유니언 타입이 들어오는 조건을 만족할 때만 발생합니다.

의도하여 하면 문제없겠지만, 조건부 타입의 유니언 분배보다 왠지 인지도가 낮은 것 같으니, 때때로 함정이 될 수도 있을지 모릅니다.

`[P in keyof T]`라는 형태 그 자체는 `T`의 프로퍼티를 모두 매핑할 때 사용하는 빈번한 형태입니다.

이 형태가 나왔을 때는 `T`가 유니언 타입이면 어떻게 될까 생각해 볼 필요가 있겠죠.

### Mapped 타입과 배열 타입

위와 같은 `[P in keyof T]` 형태로, `T`에 배열 타입(튜플 타입도 포함)이 들어오는 경우에도 역시 특별한 동작을 합니다.

우선 배열 타입에 Mapped 타입을 적용하면 어떻게 될까요.

아마 우선 떠오르는 동작은 배열의 요소 타입이 매핑되는 것일 겁니다.

먼저, 일부러 특별한 동작을 피하면서 배열 타입을 매핑해 봅시다.

`StrArr` 타입은 `NumArr`의 프로퍼티의 타입을 문자열로 변경한 타입을 반환합니다.

```typescript
type NumArr = number[];

type StrArr = { [P in keyof NumArr]: string };

// StrArr 타입의 변수 a를 선언
declare const a: StrArr;

const _: string = a[0];
```

이 예제에서는 `in`의 오른쪽이 `keyof NumArr`가 있는데, `NumArr`는 타입 변수가 아니라 구체적인 타입이므로 특별한 동작은 발생하지 않습니다.

제대로 `StrArr` 타입의 배열 요소는 문자열이 되었네요.

그러면 배열이니 `forEach`로 루프를 돌려보겠습니다.

```typescript
type NumArr = number[];

type StrArr = { [P in keyof NumArr]: string };

// StrArr 타입의 변수 a를 선언
declare const a: StrArr;

// 오류: 호출 시그니처가 없는 타입의 표현식을 호출할 수 없습니다. Type 'String' has no compatible call signatures.
a.forEach(val => {
  console.log(val);
});
```

어라...?

그렇습니다. Mapped 타입에 의해 모든 프로퍼티가 문자열로 매핑되어서, 원래 함수 타입이어야 할 배열이 가진 프로퍼티 `forEach`의 타입도 문자열로 되어버렸습니다.

확실히 그런 코드를 작성하긴 했지만, 이런 건 너무 쓸모가 없죠.

그래서 이 사태를 피하는 기구가 Mapped 타입에는 내장되어 있습니다.

구체적으로는 `[P in keyof T]`에서 타입 변수 `T`의 타입이 배열이라면, 모든 프로퍼티를 매핑하는 것이 아니라 요소의 타입만을 매핑해 줍니다. 그럼 해보겠습니다.

```typescript
// 모든 프로퍼티를 string으로 만드는 타입 함수
type Strify<T> = { [P in keyof T]: string };

type NumArr = number[];
// StrArr은 string[] 타입이 됩니다.
type StrArr = Strify<NumArr>;

const arr: StrArr = ['foo', 'bar'];
arr.forEach(val => console.log(val));
```

이번에는 `StrArr`이 `string[]` 타입이 되어, `forEach` 등의 메서드는 그대로 사용할 수 있게 되었습니다.

포인트는 `Strify<T>`는 매우 일반적인 Mapped 타입으로 정의되어 있으며, 객체 타입에 대해서도 그대로 사용할 수 있다는 점입니다.

배열을 특별 취급하지 않아도, 잘 매핑해 준다는 거죠.

참고로, 이 기능이 `T`가 타입 변수인 경우에 제한되는 것은, 그렇지 않으면 매핑 후의 배열의 요소 타입을 올바르게 구할 수 없는 경우가 있기 때문이겠죠.

`{ [P in keyof T]: X }`라는 타입(`X`는 타입 변수일 수도 있고 아닐 수도 있음)에서 배열 타입 `U[]`를 매핑한 경우, 요소 타입은 `X` 내부의 `T[P]`를 `U`로 치환한 것이 됩니다.

이 형태의 Mapped 타입이라면, 요소 타입을 매핑할 때 `X` 내부에 원래의 요소 타입이 문법적으로 `T[P]`라는 형태로 나타나므로 그것을 `U`로 치환하면 됩니다(다른 곳에 `T[number]` 등이 있을 수 있지만, 그것은 치환하지 않고 그대로 두어도 됩니다).

`T`가 일반적인 타입이 되어버리면 이러한 변환이 어렵게 됩니다.

또한 배열 타입이라고 했지만, 튜플 타입도 배열 타입의 일종이므로 같은 규칙이 적용됩니다.

```typescript
// 모든 프로퍼티를 배열로 만드는 타입 함수
type PropArrify<T> = { [P in keyof T]: Array<T[P]> };

type MyTuple = [string, number, boolean];

// T1은 [string[], number[], boolean[]]이 됩니다.
type T1 = PropArrify<MyTuple>;

const t: T1 = [['f', 'o', 'o'], [], [true, false]];

// length 등의 요소 이외의 프로퍼티는 그대로 유지됩니다.
console.log(t.length);
```

### `readonly` 배열 타입과의 변환

Mapped 타입에서는 프로퍼티를 `readonly`화하거나 하는 것도 가능했습니다.

배열에 대해 모든 프로퍼티를 `readonly`화하는 작업을 하면, 제대로 `readonly` 배열이나 튜플 타입이 발생합니다.

물론 위의 경우와 마찬가지로 `[P in keyof T]`라는 형태가 필요합니다.

조금 이야기를 앞당기는데요, TypeScript에는 아래와 같이 정의된 `Readonly<T>` 타입이 표준으로 갖춰져 있습니다. 이것을 사용해서 시도해 봅시다.

```typescript
type Readonly<T> = { readonly [P in keyof T]: T[P] };
```

아래 예제처럼, `Readonly<T>`의 타입 변수 `T`에 배열이나 튜플 타입을 넣으면, `readonly` 배열이나 `readonly` 튜플 타입이 됩니다.

```typescript
type T1 = number[];

// T2는 readonly number[] 타입
type T2 = Readonly<T1>;

// T3는 readonly [string, number, string] 타입
type T3 = Readonly<[string, number, string]>;
```

반대로 `{-readonly [P in keyof T]: T[P]}`로 프로퍼티에서 `readonly`를 제거할 수 있는 것은 아시다시피, 이를 `readonly` 배열 타입에 적용하면 역시 일반 배열 타입이 됩니다.

---

## 표준 라이브러리의 타입

여기까지 조건부 타입(conditional types), 매핑 타입(mapped types), 그리고 유니언 타입(그리고 배열)에 관한 세부적인 동작을 살펴봤는데요.

특히 유니언 타입에 대해 예외적인 동작이 있거나, 타입 변수를 포함한 특정 형태인지 신경 써야 하는 등 복잡하지만, 이를 통해 TypeScript의 타입 시스템(특히 유니언 타입)이 더 편리해졌다는 측면도 있습니다.

이러한 편리함은 사실 우리가 직접 조건부 타입 등을 다루지 않더라도 **표준 라이브러리** 형태로 제공되고 있습니다. 

간단한 작업이라면 표준 라이브러리에서 제공하는 타입을 활용할 수 있을 것입니다.

여기서는 표준 라이브러리에 존재하는 타입들을 소개하겠습니다.

표준 라이브러리에 존재한다는 것은 별다른 설정 없이 바로 사용할 수 있다는 의미입니다.

참고로, 이 타입들은 `lib.es5.d.ts`에 정의되어 있으며, 아래에 나타낸 정의는 해당 소스 코드(TypeScript v3.1.3)에서 가져온 것으로, Apache License 2.0을 따릅니다.

### `Record<K, T>`

```typescript
/**
 * 타입 T의 프로퍼티 집합 K를 가진 타입을 구성합니다.
 */
type Record<K extends keyof any, T> = {
    [P in K]: T;
};
```

`Record<K, T>` 타입은 사전(Dictionary)처럼 사용하고자 하는 객체의 타입에 적합합니다.

예를 들어 `Record<string, number>`는 임의의 문자열 타입의 키(프로퍼티명)에 대해 `number` 타입의 값을 가진 객체입니다.

**Record 사용 예시**

```typescript
const dict: Record<string, number> = {};
dict.foo = 123;
dict.bar = 456;
console.log(dict.foo + dict.baz);
```

다만, 위 정의에서는 존재하지 않는 키가 `undefined`를 반환할 가능성을 무시하고 있다는 점에 유의하세요.

이런 점이 마음에 들지 않는다면 `Record<string, number | undefined>`처럼 값이 `undefined`일 가능성을 명시하거나, `Map`을 사용하는 것이 좋습니다.

이 타입은 그런 위험성보다 편의성을 중시하는 경우에 사용되는 타입이라는 인상입니다.

또한, `K`의 제약 조건에 있는 `K extends keyof any`에 주목하세요.

TypeScript에서는 객체의 키(프로퍼티명)로 사용할 수 있는 타입이 정해져 있으며, 구체적으로는 `string | number | symbol`입니다. 따라서 `keyof` 타입은 반드시 `string | number | symbol`의 부분 타입이 됩니다.

`keyof any`는 키로 사용 가능한 모든 타입으로, 역시 `string | number | symbol`이 됩니다. 처음부터 `string | number | symbol`로 써도 되지만, 향후 키로 사용 가능한 타입이 추가될 수 있으므로 이를 직접 쓰는 것을 피하고 `keyof any`로 표기하는 것 같습니다.

왜 그런지는 모르겠지만, 미래에 키로 사용될 수 있는 타입이 추가될 가능성에 대비하기 위한 것으로 보입니다.

### `Partial<T>`, `Required<T>`, `Readonly<T>`

```typescript
/**
 * T의 모든 프로퍼티를 선택적으로 만듭니다.
 */
type Partial<T> = {
    [P in keyof T]?: T[P];
};

/**
 * T의 모든 프로퍼티를 필수로 만듭니다.
 */
type Required<T> = {
    [P in keyof T]-?: T[P];
};

/**
 * T의 모든 프로퍼티를 읽기 전용으로 만듭니다.
 */
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};
```

일반적으로 매핑 타입을 사용하여 프로퍼티의 특성을 조작하는 타입입니다.

`Partial<T>`는 꽤 자주 사용합니다.

### `Pick<T, K>`

```typescript
/**
 * T에서 프로퍼티 K의 집합을 선택합니다.
 */
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
```

이 타입 정의를 보고 무슨 일을 하는지 이해할 수 있다면 TypeScript 입문 수준은 충분히 이해하고 있다고 할 수 있을 것입니다.

이는 주어진 객체 타입 `T`의 프로퍼티 중에서 `K`로 주어진 이름의 프로퍼티만 남겨 새로운 타입을 반환하는 타입 함수입니다.

**Pick 사용 예시**

```typescript
interface MyObj {
  foo: number;
  bar: string;
  baz: boolean;
}

type T1 = Pick<MyObj, 'foo' | 'bar'>;
/*
 * T1의 타입은
 * { foo: number; bar: string; }
 */
```

남겨야 할 프로퍼티명을 리터럴 타입의 유니언 타입으로 제공합니다.

이런 부분에서 TypeScript에서 유니언 타입의 중요성을 엿볼 수 있습니다.

이 `Pick<T, K>` 타입은 기존 타입을 조금 수정한 새로운 타입을 만들고 싶을 때 자주 사용합니다.

### `Exclude<T, U>`, `Extract<T, U>`

```typescript
/**
 * T에서 U에 할당 가능한 타입을 제외합니다.
 */
type Exclude<T, U> = T extends U ? never : T;

/**
 * T에서 U에 할당 가능한 타입만 추출합니다.
 */
type Extract<T, U> = T extends U ? T : never;
```

이것이 무엇을 하는지 이해하실 수 있을까요?

이를 이해하셨다면 이번 글도 상당히 이해하고 계신 것입니다.

이는 조건부 타입에서 유니언 분배를 전제로 한 타입입니다.

`T`에 어떤 유니언 타입이 들어왔을 때, `Extract<T, U>`는 그 구성 요소 중에서 `U`의 부분 타입인 것들만 남깁니다.

구체적인 예시를 보겠습니다.

```typescript
type T1 = 'foo' | 'bar' | 'baz' | 0 | 2 | 4 | false;

// T2는 'foo' | 'bar' | 'baz' 타입이 됩니다.
type T2 = Extract<T1, string>;
```

`T1`은 다양한 타입의 유니언 타입인데요, `T2`는 그 중에서 문자열인 것, 즉 `string`의 부분 타입인 것들만 남긴 유니언 타입이 되었습니다.

이렇게 되는 이유는 이 글에서 설명한 내용으로 설명할 수 있습니다.

`Extract<T1, string>`의 계산에서 `Extract<T, U>` 내부의 `T extends U`에서 `T`에 유니언 분배가 적용되어,

```typescript
('foo' extends string ? 'foo' : never) | ('bar' extends string ? 'bar' : never) | ...
```

와 같이 분배됩니다. 그 결과는 `'foo' | 'bar' | 'baz' | never | never | never | never`가 됩니다.

`never`는 속하는 값이 없는 타입이므로 유니언 타입에서는 사라집니다.

따라서 `'foo' | 'bar' | 'baz'`가 남게 되었습니다.

이번 설명에서는 `Extract<T, U>`를 사용했지만, `Exclude<T, U>`도 동일한 동작을 합니다.

차이점은 `Exclude<T, U>`는 반대로 `U`의 부분 타입인 것들을 제외하고 그 외를 남기는 점입니다.

`Exclude<T1, string>`은 `0 | 2 | 4 | false` 타입이 될 것입니다.

이러한 타입은 유니언 타입으로 대수적 데이터 타입 비슷한 것을 할 때도 유용합니다.

다음과 같은 타입을 생각해 봅시다.

```typescript
type MyData =
  | {
      type: 'foo';
      fooValue: string;
    }
  | {
      type: 'bar';
      barValue: number;
    }
  | {
      type: 'baz';
    };
```

`MyData`는 `type` 프로퍼티를 태그로 하여, 3종류의 값으로 구성된 대수적 데이터 타입 같은 타입입니다.

이 중에서 `'foo'`는 이미 처리했으므로 남은 것은 `'bar'`나 `'baz'`라는 상황을 표현하기 위해, `MyData`에서 `type`이 `'foo'`인 것을 제외한 나머지 두 가지 유니언 타입을 만들고 싶을 수 있습니다.

이때 유니언 타입의 정의를 다시 쓰는 것은 낭비겠죠. `Exclude<T, U>`를 사용하여 다음과 같이 표현할 수 있습니다.

```typescript
type T1 = Exclude<MyData, { type: 'foo' }>;
// T1은 { type: 'bar'; barValue: number } | { type: 'baz' } 타입
```

특히, `U`에 해당하는 부분이 `{ type: 'foo' }`로 충분하다는 점이 특징적이며, `{ type: 'foo'; fooValue: string }`처럼 전체를 모두 쓰지 않고도 최소한의 조건으로 충분합니다.

이는 조건부 타입의 조건 판정이 `extends`, 즉 부분 타입 관계를 사용하기 때문입니다.

다른 사용법으로는 `Pick<T, K>`와 조합하여 `T`에서 특정 키만 제거하는 방법이 있습니다.

```typescript
interface MyObj {
  foo: number;
  bar: string;
  baz: boolean;
}

// T1은 { foo: number; bar: string } 타입
type T1 = Pick<MyObj, Exclude<keyof MyObj, 'baz'>>;
```

이는 꽤 자주 사용되므로, 여기에 `Omit<T, K>` 같은 이름을 붙이기도 합니다.

```typescript
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
```

### `NonNullable<T>`

```typescript
/**
 * T에서 null과 undefined를 제외합니다.
 */
type NonNullable<T> = T extends null | undefined ? never : T;
```

이는 `Exclude<T, U>`에서 `U`가 `null | undefined`인 버전입니다.

### `Parameters<T>`, `ReturnType<T>`

```typescript
/**
 * 함수 타입의 매개변수들을 튜플로 얻습니다.
 */
type Parameters<T extends (...args: any[]) => any> = T extends (...args: infer P) => any ? P : never;

/**
 * 함수 타입의 반환 타입을 얻습니다.
 */
type ReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer R ? R : any;
```

이 두 가지는 함수와 관련된 타입입니다. `T extends (...args: any[]) => any`라는 조건은 `T`가 함수 타입이어야 함을 나타냅니다.

`T`가 함수일 때, `Parameters<T>`는 `T`의 매개변수 타입 목록을 튜플 타입으로 얻을 수 있습니다.

`ReturnType<T>`는 `T`의 반환 타입이 됩니다.

**Parameters와 ReturnType 사용 예시**

```typescript
type F = (arg1: string, arg2: number) => string;

// T1은 [string, number] 타입
type T1 = Parameters<F>;

// T2는 string 타입
type T2 = ReturnType<F>;
```

이 두 가지 타입은 함수의 타입을 여러모로 다루고 싶을 때 유용합니다.

생략하지만, `new`로 호출하는 경우를 위한 `ConstructorParameters<T>`와 `InstanceType<T>`도 있습니다.

이상으로 표준 라이브러리에서 제공되는 주요 타입들이었습니다.

특히 조건부 타입의 유니언 분배를 활용한 `Extract<T, U>`와 `Exclude<T, U>`의 정의가 특징적이네요.

이것들과 유니언 타입을 잘 활용하여 TypeScript 프로그램을 작성할 수 있다면 TypeScript 타입 초급은 졸업하셨습니다.

---

## 기타 토픽

이번에는 **TypeScript의 타입 입문**에서는 다루지 못했던 TypeScript의 타입에 관한 다양한 주제를 소개하려고 합니다.

### 함수 오버로드

TypeScript에서는 함수의 오버로드를 정의할 수 있는데요.

물론 변환된 JavaScript에는 그 기능이 없으므로, 오버로드를 작성할 수 있는 것은 타입에 한정됩니다.

타입으로 오버로드가 정의된 함수 `func`를 작성해보겠습니다.

**함수 오버로드의 예**

```typescript
function func(arg1: number): number;
function func(arg1: string, arg2: number): number;
function func(arg1: number | string, arg2?: number): number {
  if (typeof arg1 === 'number') {
    return arg1;
  } else {
    return Number.parseInt(arg1) + arg2!;
  }
}

func(1);
func("123", 321);
// ↓ 오류 발생
func("123");
```

함수 선언이 연속되어 있어서 조금 읽기 어려운데요.

함수 `func`의 선언은 타입 선언과 본체 선언의 두 부분으로 나눌 수 있습니다.

자세히 보면, 처음 두 줄은 일반적인 함수 선언이 아니라 함수 본체가 없는 형태입니다.

이는 TypeScript 고유의 형태로, 이 형태를 여러 개 나열함으로써 함수 오버로드를 선언할 수 있습니다.

이 예제에서는 두 개의 오버로드가 선언되어 있으며, 첫 번째는 숫자를 받아 숫자를 반환하는 함수, 두 번째는 문자열과 숫자를 받아 숫자를 반환하는 함수입니다.

그리고 오버로드의 선언과 함께, 함수 본체의 선언을 작성해야 합니다.

TypeScript에서의 함수 오버로드의 특징은 함수 본체를 하나만 작성할 수 있다는 것인데요.

따라서 함수 본체의 선언에서는, 오버로드된 모든 함수에 해당하는 포괄적인 타입이어야 합니다.

즉, 이 함수 `func`에서는 첫 번째 인수의 타입이 `number`일 수도 있고 `string`일 수도 있으므로, 함수 본체의 선언에서는 그 둘을 모두 받아들이는 `number | string`으로 합니다.

두 번째 인수는 `number`지만, 첫 번째 오버로드가 선택된 경우에는 두 번째 인수가 없으므로, 없을 수도 있음을 나타내기 위해 `arg2?: number`로 합니다.

`?`를 붙였기 때문에 `arg2`의 타입은 `number | undefined`가 됩니다.

함수 내부에서는 직접 인수의 타입을 확인하여 그에 맞는 적절한 구현을 선택해야 합니다.

`else` 부분의 `arg2!`가 눈에 띄는데요, 이때의 `!` 후치 연산자는 TypeScript 고유의 것으로, 타입에서 강제로 `null`이나 `undefined`를 제거하는 다운캐스트 연산자입니다.

`arg1`이 문자열임이 확인된 시점에서 오버로드의 두 번째가 선택된 것임은 분명하므로, `arg2`가 `undefined`가 아님을 알 수 있지만, 아쉽게도 TypeScript는 그 정도로 똑똑하지 않아 `arg2`가 `undefined`가 아님을 파악하지 못합니다.

그래서 직접 주석으로 표시한 것입니다.

이런 불편함이 있어서 저는 오버로드된 함수 정의를 별로 좋아하지 않습니다만, 외부의 JavaScript 라이브러리에 타입을 부여할 때 자주 등장합니다.

참고로, 객체 타입을 사용하여 함수의 타입을 선언할 때에도, 마찬가지로 함수 시그니처를 여러 개 나열함으로써 오버로드된 함수의 타입을 표현할 수 있습니다.

예를 들어, 앞에서 정의한 함수의 타입은 다음과 같이 작성할 수 있습니다.

```typescript
interface MyFunc {
  (arg1: number): number;
  (arg1: string, arg2: number): number;
}
```

### `this`

JavaScript는 객체 지향 언어이므로, 메서드 내에서 `this`를 사용할 수 있는데요.

이를 TypeScript에서 표현하기 위한 여러 가지 방법이 있습니다.

우선, 사실 함수 정의나 함수의 타입을 작성할 때 `this`의 타입을 명시할 수 있습니다.

다소 복잡한데, `this`의 타입은 첫 번째 인수에 작성하여 명시하지만, 이는 실제 인수가 아니기 때문에 호출할 때 `this` 값을 인수로 전달하는 것은 아닙니다.

아래 예제에서 정의하는 `func`의 인수는 `arg` 하나뿐입니다.

```typescript
type MyObj = { foo: number };
function func(this: MyObj, arg: number): number {
  return this.foo + arg;
}

const obj1 = {
  foo: 12345,
  func,
};
const obj2 = {
  func,
};

// `func`를 일반적으로 호출하면 `this`의 타입이 달라 오류 발생
func(100);

// `obj1.func`로 호출하면 `this`는 `obj1`(`MyObj` 타입)이므로 OK
obj1.func(100);

// `obj2.func`로 호출하면 `this`가 `obj2`이고 `MyObj` 타입이 아니므로 오류 발생
obj2.func(100);
```

여기서 정의한 `func`는 `this`의 타입이 `MyObj`여야 하는 함수 타입을 가집니다.

따라서 일반적으로 호출하거나 `this`가 다른 상황에서 호출하면 오류가 발생합니다. 위 예제에서는 `obj1.func`로 호출하는 경우에만 OK입니다.

하지만 이렇게 `this`를 사용하는 경우는 사실 별로 보지 못했습니다.

`this`는 오히려 **컨텍스트적 타입 추론**을 위해 사용되는 경우가 많은 것 같습니다.

jQuery를 대표로 하는 일부 라이브러리에서는(지금은 어떤지 모르겠지만 적어도 예전에는) 콜백 함수 내에서 `this`의 값을 적극적으로 변경합니다.

그런 함수 내에서 `this`의 타입을 올바르게 추론하기 위해 `this`의 타입 지정을 사용할 수 있습니다.

```typescript
type MyObj = { foo: number };

function callWithThis(func: (this: MyObj) => void): void {
  func.call({ foo: 42 });
}

//            ↓ 이 콜백 함수 내에서는 `this`가 `MyObj` 타입을 가진다고 추론됩니다.
callWithThis(function () { console.log(this.foo); });
```

이 예제에서는 함수 `callWithThis`의 인수가 함수이며, 그 타입에서 `this`가 `MyObj`라고 지정되어 있습니다.

`callWithThis`의 인수로 전달된 익명 함수의 타입은 그 타입에 맞추어지므로, 그 내부에서는 `this`가 `MyObj` 타입이 됩니다.

이렇게 함으로써, `callWithThis`를 사용하는 쪽에서는 콜백 함수 내에서의 `this`의 타입을 직접 지정하지 않아도 커스텀한 `this`를 잘 활용할 수 있습니다. 

이 기능을 활용하면 작성된 코드를 좀 더 안전하게 만들 수 있습니다.

### `this` 타입

`this`에 관련된 TypeScript의 타입으로는, 그야말로 `this` 타입이라는 것이 있습니다.

이는 클래스(또는 인터페이스)의 메서드 내에서 사용할 수 있는 특수한 타입인데요.

예를 들어, 자신을 복사하는 메서드 `clone`을 가진 클래스를 생각해봅시다.

```typescript
class MyClass {
  constructor(public foo: number) {}

  public clone(): MyClass {
    return new MyClass(this.foo);
  }
}
```

`MyClass`의 생성자는 하나의 인수를 가집니다.

인수에 `public`이 붙어 있는데, 이렇게 하면 주어진 인수가 그대로 퍼블릭한 프로퍼티 `foo`에 할당됩니다(이것은 TypeScript의 고유 기능입니다).

뭐 그건 본론이 아니고, 본론은 `clone()` 메서드입니다.

이것은 자신과 동일한 새로운 `MyClass` 객체를 반환하는 메서드입니다. 그러면 반환 타입은 당연히 `MyClass` 타입이 됩니다.

여기까지는 문제가 없지만, 이 `MyClass`를 상속한 새로운 클래스를 만들 때 약간 곤란합니다.

```typescript
class MySubClass extends MyClass {
}
```

이대로라면 `MySubClass` 인스턴스의 `clone()`을 호출하면 `MySubClass` 객체가 아니라 `MyClass` 객체가 반환됩니다.

`MySubClass`의 정의에서 오버라이드된 `clone()`의 정의를 다시 작성해도 되지만, 뭔가 스마트하지 않네요.

JavaScript적인 해결책은 이렇습니다.

```typescript
class MyClass {
  constructor(public foo: number) {}

  public clone(): MyClass {
    return new (this.constructor as any)(this.foo);
  }
}
```

인스턴스는 `constructor` 프로퍼티에 자신의 생성자를 가지고 있습니다.

따라서 그것을 가져와서 `new`로 생성하면 됩니다.

`MyClass`의 인스턴스인 경우 `this.constructor`는 `MyClass`가 되고, `MySubClass` 인스턴스인 경우는 `MySubClass`가 됩니다.

이제 JavaScript적으로는 OK지만, TypeScript적으로는 아직 문제가 있습니다.

반환 타입이 `MyClass`로 고정되어 있습니다. `MySubClass`의 `clone()`을 호출했을 때 반환 타입이 제대로 `MySubClass` 타입이 되었으면 합니다.

이미 눈치채셨겠지만, 반환 타입을 `this`로 하면 됩니다. `this` 타입은 말 그대로 `this`의 타입입니다.

이번에는 항상 인스턴스의 타입과 동일한 타입의 객체가 반환된다고 생각하고 이렇게 하면 됩니다.

```typescript
class MyClass {
  constructor(public foo: number) {}

  public clone(): this {
    return new (this.constructor as any)(this.foo);
  }
}
```

완성된 형태를 봐도 뭔가 억지스럽다고 생각하시는 분이 계실지 모르겠지만, `this` 타입을 사용하지 않을 수 없는 시점에서 애초에 다소 억지스러운 면이 있다는 설도 있습니다.

### 커스텀 타입 가드

`if`문과 `typeof` 등을 조합하여 타입을 좁힐 수 있는 것은 잘 아실 텐데요.

사실 타입의 좁히기를 위한 함수를 직접 정의할 수 있습니다.

바로 예제를 보시죠.

```typescript
type FooObj = { foo: number };

function isFooObj(arg: any): arg is FooObj {
  return arg != null && typeof arg.foo === 'number';
}

function useFoo(arg: unknown) {
  if (isFooObj(arg)) {
    // 이 안에서는 arg가 FooObj 타입
    console.log(arg.foo);
  }
}

useFoo(123);
useFoo({ foo: 456 });
```

먼저 주목해야 할 것은 `isFooObj`의 반환 타입입니다.

`arg is FooObj`라는, 타입인지 뭔지 알 수 없는 형태인데요, 이것이 커스텀 타입 가드입니다.

구문은 `인수명 is 타입`이며, 실제로는 `boolean`입니다. 반환값이 `true`일 때 해당 인수가 그 타입을 가진다는 것을 보증하는 의미입니다.

`FooObj`는 `number` 타입의 프로퍼티 `foo`를 가진 객체의 타입이므로, `isFooObj`에서는 `arg`가 그 조건을 만족하는지 확인하고 있습니다.

다음으로 `useFoo`를 봅시다. 이 함수에서는 인수 `arg`의 타입을 `unknown`으로 하고 있습니다.

`unknown`은 어떤 타입의 값이든 받을 수 있다는 의미의 타입입니다.

`arg`의 타입을 `FooObj` 타입으로 사용하고 싶은데, 그러려면 우선 `arg`가 `FooObj` 타입인지 확인해야 합니다.

그래서 `if` 문 안에서 앞서 정의한 `isFooObj`를 호출합니다.

이 형태로 `isFooObj`를 사용함으로써, 그 안에서는 `arg`의 타입이 `FooObj` 타입으로 좁혀집니다.

이것도 자주 사용하는 것은 아닙니다만, 표준 라이브러리 중의 `Array.isArray`의 정의에도 사용되고 있습니다.

**표준 라이브러리의 `ArrayConstructor`의 정의**

```typescript
interface ArrayConstructor {
    new(arrayLength?: number): any[];
    new <T>(arrayLength: number): T[];
    new <T>(...items: T[]): T[];
    (arrayLength?: number): any[];
    <T>(arrayLength: number): T[];
    <T>(...items: T[]): T[];
    isArray(arg: any): arg is Array<any>;
    readonly prototype: Array<any>;
}
```

## 마무리

특히, 반복되지만 TypeScript의 타입 시스템에서는 유니언 타입이 강력하며, 유니언 타입의 활용을 지원하는 기구도 이번에 본 것처럼 잘 갖춰져 있습니다.

이제는 유니언 타입이 없던 시절의 TypeScript는 무엇이었나 하는 수준입니다.

적극적으로 유니언 타입을 사용해 봅시다.

---
