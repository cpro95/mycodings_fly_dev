---
slug: 2024-10-21-typescript-type-advanced-second
title: TypeScript 타입 기초 완전 정복! 2편 - 제네릭, 튜플, 유니언, never, 교차 타입
date: 2024-10-21 12:20:18.374000+00:00
summary: TypeScript 타입을 자유자재로 활용하는 방법을 배우는 2편! 제네릭, 튜플, 유니온, never, 교차 타입 등 강력한 타입 표현 기법을 알려드립니다.
tags: ["TypeScript", "타입스크립트", "제네릭", "튜플", "유니온 타입", "타입 좁히기"]
contributors: []
draft: false
---

안녕하세요?

Typescript 타입 기초 완전 정복 2편입니다.

전체 강좌 링크는 아래와 같습니다.

1. [TypeScript 타입 기초 완전 정복! 1편 - 프리미티브, 객체, 함수, 배열](https://mycodings.fly.dev/blog/2024-10-21-typescript-type-basics-first)

2. [TypeScript 타입 기초 완전 정복! 2편 - 제네릭, 튜플, 유니언, never, 교차 타입](https://mycodings.fly.dev/blog/2024-10-21-typescript-type-advanced-second)

3. [TypeScript 타입 기초 완전 정복! 3편 - as const, unknown, Mapped, Conditional 타입 완벽 분석](https://mycodings.fly.dev/blog/2024-10-21-typescript-type-master-third)

---

** 목 차 **

- [제네릭](#제네릭)
- [튜플 타입](#튜플-타입)
- [튜플 타입과 가변 인자](#튜플-타입과-가변-인자)
- [함수 호출의 스프레드와 튜플 타입](#함수-호출의-스프레드와-튜플-타입)
- [튜플 타입과 가변 인자와 제네릭](#튜플-타입과-가변-인자와-제네릭)
- [유니언 타입 (합집합 타입)](#유니언-타입-합집합-타입)
- [유니언 타입의 좁히기](#유니언-타입의-좁히기)
  - [null 체크](#null-체크)
  - [Discriminated Unions (차별화된 유니언)](#discriminated-unions-차별화된-유니언)
- [`never` 타입](#never-타입)
- [교차 타입 (intersection 타입)](#교차-타입-intersection-타입)
  - [유니언 타입을 가진 함수와의 관계](#유니언-타입을-가진-함수와의-관계)
- [객체 타입 재방문](#객체-타입-재방문)
  - [`?`: 선택적 프로퍼티](#-선택적-프로퍼티)
  - [선택적 프로퍼티에 대한 접근](#선택적-프로퍼티에-대한-접근)
  - [`exactOptionalPropertyTypes`에 대하여](#exactoptionalpropertytypes에-대하여)
  - [`readonly`](#readonly)
  - [인덱스 시그니처](#인덱스-시그니처)
  - [함수 시그니처](#함수-시그니처)
  - [new 시그니처](#new-시그니처)
- [`as`를 이용한 다운캐스팅](#as를-이용한-다운캐스팅)

---

## 제네릭

타입이 있는 언어에는 흔히 제네릭이라는 것이 존재합니다.

이른바 다형성 타입(polymorphic type)과 관련된 것인데요.

TypeScript에도 제네릭이 있습니다.

타입 이름을 `Foo<S, T>`와 같이, 즉 이름 뒤에 `< >`로 둘러싼 이름의 열을 제공함으로써, 타입 정의 안에서 그 이름들을 타입 변수로 사용할 수 있습니다.

```typescript
interface Foo<S, T> {
  foo: S;
  bar: T;
}

const obj: Foo<number, string> = {
  foo: 3,
  bar: 'hi',
};
```

이 예제에서는 `Foo`가 두 개의 타입 변수 `S`, `T`를 가집니다.

`Foo`를 사용하는 쪽에서는 `Foo<number, string>`과 같이 `S`와 `T`에 해당하는 타입을 지정합니다.

또한, 클래스 정의나 함수 정의에서도 타입 변수를 도입할 수 있습니다.

```typescript
class Foo<T> {
  constructor(obj: T) {
  }
}

const obj1 = new Foo<string>('foo');

function func<T>(obj: T): void {
}

func<number>(3);
```

그런데 위의 예제에서 `func`의 타입은 어떻게 될까요?

실제로는 `<T>(obj: T) => void`라는 타입이 됩니다.

```typescript
function func<T>(obj: T): void {
}

const f: <T>(obj: T) => void = func;
```

이렇게 함수의 경우 호출할 때까지 어떤 타입 인수로 호출될지 알 수 없기 때문에, 타입에도 타입 변수가 남아 있게 됩니다.

여담이지만, 타입 인수(`func<number>(3)`의 `<number>` 부분)는 생략할 수 있습니다.

```typescript
function identity<T>(value: T): T {
  return value;
}

const value = identity(3);
// 오류: Type '3' is not assignable to type 'string'.
const str: string = value;
```

이 예제에서 `identity`는 타입 변수 `T`를 가집니다만, `identity`를 호출하는 쪽에서는 `T`의 지정을 생략했습니다.

이 경우 인수의 정보로부터 `T`가 추론됩니다.

실제로 이번에 인수로 주어진 `3`은 `3` 타입의 값이므로, `T`가 `3`으로 추론됩니다.

`identity`의 반환 타입은 `T` 즉 `3`이므로, 변수 `value`의 타입은 `3`이 됩니다.

`3` 타입의 값은 `string` 타입의 변수에 넣을 수 없으므로 최종 행에서는 오류가 발생합니다.

이 예제에서 `T`가 올바르게 추론되고 있음을 알 수 있습니다.

다만, 복잡한 작업을 할 경우 타입 변수를 추론할 수 없는 경우도 있습니다.

---

## 튜플 타입

TypeScript는 튜플 타입이라는 것도 제공하는데요.

하지만 JavaScript에는 튜플이라는 개념이 없습니다.

그래서 TypeScript에서는 배열을 튜플 대신 사용하고 있습니다.

이는 함수에서 여러 값을 반환하고 싶을 때 배열에 담아 한꺼번에 반환하는 등의 유스케이스를 상정한 것 같습니다.

튜플 타입은 `[string, number]`와 같이 작성합니다.

이는 실제로 길이가 2인 배열로, 0번째에는 문자열이, 1번째에는 숫자가 들어있는 것을 나타냅니다.

```typescript
const foo: [string, number] = ['foo', 5];

const str: string = foo[0];

function makePair(x: string, y: number): [string, number] {
  return [x, y];
}
```

하지만 튜플 타입의 사용에는 주의가 필요합니다.

TypeScript가 튜플이라고 부르는 것은 어디까지나 배열이기 때문에, 배열의 메서드로 조작할 수 있습니다.

```typescript
const tuple: [string, number] = ['foo', 3];

tuple.pop();
tuple.push('Hey!');

const num: number = tuple[1];
```

이 코드는 TypeScript에서 에러 없이 컴파일되지만, 실제로 실행해보면 변수 `num`에 들어가는 것은 숫자가 아니라 문자열입니다.

이 부분은 TypeScript의 타입 시스템의 한계이므로, 튜플 타입을 사용할 때는 주의하거나, 애초에 이런 방식으로 튜플 타입을 사용하는 것은 피하는 것이 좋을지도 모릅니다.

참고로, 요소가 0개인 튜플 타입도 만들 수 있습니다.

```typescript
const unit: [] = [];
```

또한, TypeScript의 튜플 타입은 가변 길이의 튜플 타입 선언이 가능합니다.

그것이 과연 튜플인가라는 의문이 남지만, 이는 실질적으로 처음 몇 개의 요소의 타입이 특별히 취급되는 배열의 타입이 됩니다.

```typescript
type NumAndStrings = [number, ...string[]];

const a1: NumAndStrings = [3, 'foo', 'bar'];
const a2: NumAndStrings = [5];

// 오류: Type 'string' is not assignable to type 'number'.
const a3: NumAndStrings = ['foo', 'bar'];
```

이처럼, 가변 길이 튜플 타입은 마지막에 `...`(배열 타입)이라는 요소를 추가한 튜플 타입으로 표현됩니다.

여기서 정의한 `NumAndStrings` 타입은 첫 번째 요소가 숫자이고, 나머지는 문자열인 배열의 타입입니다.

변수 `a3`는 첫 번째 요소가 숫자가 아니기 때문에 오류가 발생합니다.

물론 `[number, string, ...any[]]`처럼 타입이 지정된 요소가 여러 개여도 괜찮습니다.

`...` 배열은 튜플 타입의 다른 위치에도 쓸 수 있습니다.

예를 들어, 마지막 요소만 `number` 타입이고 나머지는 `string` 타입인 배열은 다음과 같이 쓸 수 있습니다.

```typescript
type StrsAndNumber = [...string[], number];

const b1: StrsAndNumber = ['foo', 'bar', 'baz', 0];
const b2: StrsAndNumber = [123];
// 오류:
// Type '[string, string]' is not assignable to type 'StrsAndNumber'.
//   Type at position 1 in source is not compatible with type at position 1 in target.
//     Type 'string' is not assignable to type 'number'.
const b3: StrsAndNumber = ['foo', 'bar'];
```

하지만 `...`를 쓸 수 있는 것은 튜플 타입의 어느 위치든 한 번만 가능합니다.

예를 들어 "먼저 숫자가 늘어서 오고 그 다음에 문자열이 오는 배열의 타입"으로 `[...number[], ...string[]]` 같은 타입을 생각할 수 있지만, 이는 `...`를 두 번 사용하므로 안 됩니다.

또한, 선택적 요소를 가지는 튜플 타입도 있습니다.

이는 `[string, number?]`처럼 타입에 `?`가 붙은 요소를 가지는 튜플 타입입니다.

이 경우 두 번째 요소는 있어도 되고 없어도 된다는 의미입니다.

있는 경우에는 `number` 타입이어야 합니다.

```typescript
type T = [string, number?];

const t1: T = ['foo'];
const t2: T = ['foo', 3];
```

선택적 요소는 여러 개여도 되지만, 그렇지 않은 요소보다 뒤에 와야 합니다.

예를 들어 `[string?, number]`와 같은 타입은 안 됩니다.

---

## 튜플 타입과 가변 인자

TypeScript 3.0 부터 튜플 타입의 재미있는 사용 방법이 추가되었습니다.

그것은 튜플 타입을 함수의 가변 인자 타입을 나타내는 데 사용할 수 있다는 것입니다.

```typescript
type Args = [string, number, boolean];

const func = (...args: Args) => args[1];

const v = func('foo', 3, true);
// v의 타입은 number
```

조금 전에 가변 인자의 타입으로 배열을 사용한다고 소개했는데요.

실제로 배열 대신 튜플 타입을 사용할 수 있습니다.

위의 예제에서는 가변 인자 `args`의 타입이 `Args`, 즉 `[string, number, boolean]`입니다.

이에 맞추기 위해, 즉 인자의 열 `args`가 타입 `Args`를 가지도록 하기 위해서는 함수 `func`의 첫 번째 인자의 타입은 `string`, 다음은 `number`, 그 다음은 `boolean`이어야 합니다.

가변 인자라는 이름과는 달리 고정된 개수의 인자를 받게 되지만, 이렇게 튜플 타입을 타입의 열로 사용함으로써 여러 인자의 타입을 한꺼번에 지정할 수 있는 것이죠.

여기서 가변 길이 튜플을 사용한 경우, 인자의 가변성이 유지됩니다.

```typescript
type Args = [string, ...number[]];

const func = (f: string, ...args: Args) => args[0];

const v1 = func('foo', 'bar');
const v2 = func('foo', 'bar', 1, 2, 3);
```

또한, 마찬가지로 선택적 요소를 가진 튜플 타입을 사용한 경우에는 선택적 인자를 가진 함수 타입이 됩니다.

---

## 함수 호출의 스프레드와 튜플 타입

그런데 JavaScript에서는 `...`라는 표기를 함수 호출 시에도 사용할 수 있습니다.

```typescript
const func = (...args: string[]) => args[0];

const strings: string[] = ['foo', 'bar', 'baz'];

func(...strings);
```

`func(...strings)`의 의미는 배열 `strings`의 내용을 `func`의 인자로 펼쳐 호출한다는 것입니다.

즉, `func`의 첫 번째 인자는 `strings`의 첫 번째 요소가 되고, 두 번째 인자는 두 번째 요소가 되는 식입니다.

튜플 타입은 여기서도 사용할 수 있습니다.

적절한 튜플 타입의 배열을 `...`로 펼침으로써, 타입에 맞는 함수를 호출할 수 있습니다.

```typescript
const func = (str: string, num: number, b: boolean) => args[0] + args[1];

const args: [string, number, boolean] = ['foo', 3, false];

func(...args);
```

---

## 튜플 타입과 가변 인자와 제네릭

이제까지의 지식과 제네릭을 결합함으로써 재미있는 일을 할 수 있는데요.

튜플 타입을 취하는 타입 변수를 사용함으로써, 함수의 인자 열을 제네릭으로 다룰 수 있는 겁니다.

예를 들어, 함수의 첫 번째 인자가 미리 정해져 있는 새로운 함수를 만드는 함수 `bind`를 작성해보겠습니다.

```typescript
function bind<T, U extends any[], R>(
  func: (arg1: T, ...rest: U) => R,
  value: T,
): ((...args: U) => R) {
  return (...args: U) => func(value, ...args);
}

const add = (x: number, y: number) => x + y;

const add1 = bind(add, 1);

console.log(add1(5)); // 6

// Argument of type '"foo"' is not assignable to parameter of type 'number'.
add1('foo');
```

함수 `bind`는 두 개의 인자 `func`와 `value`를 받아, 새로운 함수 `(...args: U) => func(value, ...args)`를 반환합니다.

이 함수는 받은 인자 열 `args`에 더해 첫 번째 인자로 `value`를 `func`에 전달하여 호출한 반환값을 그대로 반환하는 함수입니다.

포인트는 먼저 `U extends any[]` 부분인데요.

이는 새로운 표기법으로, 타입 인수 `U`는 `any[]`의 부분 타입이어야 한다는 의미입니다.

`string[]` 등의 배열 타입에 더해 튜플 타입도 모두 `any[]`의 부분 타입입니다.

이 제한을 추가함으로써 `...rest: U`처럼 가변 인자의 타입으로 `U`를 사용할 수 있습니다.

또한 `bind(add, 1)`의 호출에서는 타입 변수가 각각 `T = number`, `U = [number]`, `R = number`로 추론됩니다.

반환 타입은 `(...args: U) => R` 즉 `(arg: number) => number`가 됩니다.

특히 `U`가 튜플 타입으로 추론되는 것이 스마트하죠.

이를 통해 `add`의 인자 정보가 손실되지 않고 `add1`에 이어집니다.

좀더 상세하게 타입스크립트가 어떻게 타입을 추론하는지 단계별로 설명해 보면,

1. **`bind(add, 1)` 호출:**

   `bind` 함수가 `add` 함수와 값 `1`을 인수로 받아 호출됩니다.  이때 TypeScript 컴파일러는 제네릭 타입 매개변수 `T`, `U`, `R`을 추론하기 시작합니다.

2. **타입 추론:**

```typescript
function bind<T, U extends any[], R>(
  func: (arg1: T, ...rest: U) => R,
  value: T,
): ((...args: U) => R) {
  return (...args: U) => func(value, ...args);
}
```

   * **`T`의 추론:** `bind` 함수의 두 번째 인수 `value`는 `1` (숫자)입니다.  따라서 `T`는 `number`로 추론됩니다.

   * **`R`의 추론:**  `add` 함수의 타입 시그니처는 `(x: number, y: number) => number` 입니다.  `bind` 함수의 첫 번째 인수의 타입 시그니처를 분석하여 `R`을 추론합니다. 따라서 `R`은 `number`로 추론됩니다.

   * **`U`의 추론:** `add` 함수의 타입 시그니처를 보면, 첫 번째 인수(`x`)는 `T` (이미 `number`로 추론됨)이고, 나머지 인수(`y`)는 가변 인수(`...rest`)로 처리됩니다.  `bind` 함수는 `add` 함수의 나머지 인수(`y`)를 `U`로 처리합니다. `y`의 타입은 `number`이므로  `U`는 `[number]` (number 타입의 요소를 하나만 가지는 튜플)로 추론됩니다.  `U extends any[]` 제약 조건을 만족합니다.  만약 `add` 함수가 `(x: number, y: number, z: string) => number`였다면, `U`는 `[number, string]` (number와 string 타입의 요소를 각각 하나씩 가지는 튜플)로 추론되었을 것입니다.

  여기서 추가 설명이 필요한 부분은 `U extends any[]` 제약 조건인데요.

  `U extends any[]` 는 TypeScript의 제네릭 타입 제약 조건입니다.
  
  이를 쉽게 설명하면,  "**`U` 타입은 반드시 배열 타입이어야 한다**"는 의미입니다.

  `any[]` 는 모든 타입의 요소를 가질 수 있는 배열을 의미합니다.  `U extends any[]` 는 `U` 가 `any[]` 의 *부분 타입(subtype)* 이어야 함을 의미합니다.
  
  부분 타입이란,  더 제한적인 타입을 의미합니다.  `any[]` 는 모든 배열 타입을 포함하는 가장 넓은 타입이므로,  `U` 는 `any[]` 보다 더 제한적인 배열 타입이어야 합니다.

  예를 들어, 다음 타입들은 모두 `any[]` 의 부분 타입입니다.

  * `number[]`: 숫자만을 요소로 가지는 배열.
  * `string[]`: 문자열만을 요소로 가지는 배열.
  * `[number, string]`: 숫자 하나와 문자열 하나를 요소로 가지는 튜플 (튜플은 특수한 형태의 배열).
  * `[number, string, boolean]`:  숫자, 문자열, 불리언을 요소로 가지는 튜플.


  반대로, 다음 타입들은 `any[]` 의 부분 타입이 **아닙니다**.

  * `number`: 단순한 숫자 타입.
  * `string`: 단순한 문자열 타입.
  * `MyCustomType`: 사용자 정의 타입.

  결론적으로 `...rest` 가 배열을 *생성*하고,  그 배열의 타입이 `U` 로 지정되고,  `U` 는 배열 타입이어야 한다는 제약 조건이 있는 것입니다.

3. **새로운 함수 생성:**

   `bind` 함수 내부에서 새로운 함수가 생성됩니다.  이 함수의 타입은 `((...args: U) => R)` 즉 `((...args: [number]) => number)` 입니다.  이는 숫자 하나를 인수로 받아 숫자를 반환하는 함수입니다.  이 함수의 몸체는 `(...args: U) => func(value, ...args)` 이므로, `(...args: [number]) => add(1, ...args)` 와 같습니다.

4. **`add1` 변수에 할당:**

   추론된 타입을 바탕으로 생성된 새로운 함수가 `add1` 변수에 할당됩니다.  `add1`의 타입은 `(arg: number) => number` 입니다.

5. **`add1(5)` 호출:**

   `add1(5)`를 호출하면,  내부적으로 `add(1, 5)`가 실행되고,  결과값 6이 반환됩니다.  TypeScript는 이 호출이 타입 안전함을 검증합니다.  만약 `add1("hello")` 와 같이 문자열을 전달했다면, 타입 오류가 발생합니다.

---

## 유니언 타입 (합집합 타입)

지금까지 설명한 요소들 중 많은 부분은 타입이 있는 언어라면 일반적으로 존재하는 것들이라고 생각합니다.

그러나 여기서 소개할 유니언 타입을 가진 언어는 그리 많지 않을 것 같습니다.

TypeScript는 이 유니언 타입의 지원에 힘을 쏟고 있습니다.

유니언 타입은 값이 여러 타입 중 하나에 해당하는 타입을 나타냅니다.

표기로는 여러 타입을 `|`로 연결합니다.

예를 들어 `string | number`라는 타입은 'string 또는 number인 값의 타입', 즉 '문자열 또는 숫자 타입'이 됩니다.

```typescript
let value: string | number = 'foo';
value = 100;
value = 'bar';
// 오류: Type 'true' is not assignable to type 'string | number'.
value = true;
```

이 예제에서는 변수 `value`가 `string | number` 타입의 변수이므로, 문자열이나 숫자를 할당할 수 있지만, 불리언 값은 할당할 수 없습니다.

물론, 프리미티브 타입뿐만 아니라 객체 타입에서도 유니언 타입을 만들 수 있습니다.

```typescript
interface Foo {
  foo: string;
  bar: number;
}
interface Bar {
  foo: number;
  baz: boolean;
}

type FooBar = Foo | Bar;

const obj: FooBar = {
  foo: 'hello',
  bar: 0,
};
```

여기서 `type` 문이 등장하는데요, 이는 TypeScript 고유의 문법으로, 새로운 타입을 정의하고 이름을 붙일 수 있는 문입니다.

이 예제에서는 `FooBar`라는 타입을 `Foo | Bar`로 정의하고 있습니다.

---

## 유니언 타입의 좁히기

TypeScript에서 유니온 타입은 여러 타입을 하나로 합쳐서 사용할 수 있게 해줍니다.

하지만 유니온 타입의 변수는 모든 가능한 타입의 공통된 속성만 접근할 수 있다는 단점이 있습니다.

이 문제를 해결하기 위해 "타입 좁히기(Type Narrowing)"라는 기법을 사용합니다.

타입 좁히기는 유니온 타입 변수가 실제로 어떤 타입인지 확인하여, 그에 맞는 속성에 접근할 수 있도록 타입을 좁히는 방법입니다.

```typescript
interface Foo {
  foo: string;
  bar: number;
}
interface Bar {
  foo: number;
  baz: boolean;
}

type FooBar = Foo | Bar;

const obj: FooBar = {
  foo: 'hello',
  bar: 0,
};
```

예를 들어, 위에서 정의한 `FooBar` 타입의 객체는 `bar` 프로퍼티를 참조할 수 없습니다.

왜냐하면 `FooBar` 타입의 값은 `Foo`일 수도 있고 `Bar`일 수도 있는데, `bar` 프로퍼티는 `Foo`에는 있지만 `Bar`에는 없기 때문입니다.

없을 가능성이 있는 프로퍼티를 참조할 수는 없습니다.

마찬가지로 `baz` 프로퍼티도 참조할 수 없습니다.

왜냐하면 bar는 Foo에만 있고, baz는 Bar에만 있기 때문입니다.

어떤 속성이 있는지 알 수 없으므로, 컴파일러는 오류를 발생시킵니다.

`foo` 프로퍼티는 둘 다 가지고 있으므로 참조 가능합니다.

보통은 `Foo | Bar`와 같은 타입의 값이 주어질 경우, 먼저 그 값이 실제로 어느 것인지 실행 시에 판단해야 합니다.

그래서 TypeScript에서는 그러한 판단을 감지하여 적절하게 타입을 좁혀주는 기능이 있습니다.

**`in` 연산자를 이용한 타입 좁히기 (주의 필요)**

과거에는 `in` 연산자를 사용하여 타입을 좁히는 방법이 있었지만, 최신 TypeScript 버전에서는 안전하지 않을 수 있으므로 권장되지 않습니다. 

**`typeof`를 사용한 좁히기**

더 단순하고 안전한 방법은 `typeof` 연산자를 사용하는 것입니다.

`typeof` 연산자는 주어진 값의 타입을 문자열로 반환하는 연산자입니다.

```typescript
function func(value: string | number): number {
  if ('string' === typeof value) {
    // value는 string 타입이므로 length 프로퍼티를 볼 수 있습니다.
    return value.length;
  } else {
    // value는 number 타입입니다.
    return value;
  }
}
```

복잡한 객체가 관련되어 있지 않으므로, 이 방법은 안전합니다.

---

### null 체크

또 하나 유니언 타입이 자주 사용되는 경우가 있습니다.

그것은 nullable한 값을 다루고자 할 때입니다. (JavaScript이므로 undefined도 있지만요.)

예를 들어, 문자열 값이 있을 수도 있고 null일 수도 있는 상황은 `string | null`이라는 타입으로 표현할 수 있습니다.

`string | null` 타입의 값은 null일 수도 있으므로, 문자열로 취급하거나 프로퍼티를 참조할 수 없습니다.

이에 대해 null이 아니라면 처리하고 싶은 경우가 자주 있습니다.

JavaScript에서의 일반적인 방법은 `value != null`과 같이 if문으로 null 체크를 하는 방법인데, TypeScript는 이를 적절하게 해석하여 타입을 좁혀줍니다.

```typescript
function func(value: string | null): number {
  if (value != null) {
    // value는 null이 아니므로 string 타입으로 좁혀집니다.
    return value.length;
  } else {
    return 0;
  }
}
```

또한, `&&`나 `||`의 단락 실행(short-circuit evaluation)을 이용한 테크닉도 JavaScript에서는 자주 사용되는데, 이것도 TypeScript는 적절하게 타입 검사를 해줍니다.

위의 함수 `func`는 다음과 같이도 쓸 수 있습니다.

```typescript
function func(value: string | null): number {
  return value != null && value.length || 0;
}
```

상기 코드의 구체적인 설명을 하자면, 

1. **`value != null`**:
   - 이 부분은 `value`가 `null`이 아닌지 검사합니다. TypeScript는 이 표현식을 평가할 때, `value`의 타입을 좁힙니다. 즉, `value`가 `null`이 아니라면 `value`의 타입은 `string`으로 좁혀집니다.
   - `value != null`은 `value !== null && value !== undefined`와 동일한 의미입니다. TypeScript에서는 `null`과 `undefined` 모두를 검사할 때 이와 같은 표현을 사용합니다.

2. **`value.length`**:
   - `value != null`이 `true`일 경우, `value`는 `string` 타입으로 좁혀졌으므로 `value.length`를 호출할 수 있습니다. 이는 `string`의 길이를 반환합니다.

3. **`|| 0`**:
   - 이 부분은 단락 실행(short-circuit evaluation)을 사용합니다. `value != null`이 `false`일 경우, `value.length`는 실행되지 않고 바로 `0`이 반환됩니다.
   - 즉, `value`가 `null`이거나 `undefined`인 경우, 함수는 `0`을 반환합니다.

---

###  Discriminated Unions (차별화된 유니언)

과거에는  리터럴 타입과 유니언 타입을 조합하여 이른바 대수적 데이터 타입(태그된 유니언)을 재현하는 방법이 권장되었지만, 최신 TypeScript에서는 **Discriminated Unions (차별화된 유니언)** 이라는 더 명확하고 안전한 방법을 사용합니다.

Discriminated Unions 은 유니언 타입의 각 구성 요소에 공통적인 **리터럴 타입 프로퍼티** (discriminated property) 를 추가하여 타입을 구분합니다.

```typescript
interface Some<T> {
  type: 'Some';
  value: T;
}
interface None {
  type: 'None';
}
type Option<T> = Some<T> | None;

function map<T, U>(obj: Option<T>, f: (obj: T) => U): Option<U> {
  switch (obj.type) { // discriminated property를 사용한 타입 좁히기
    case 'Some':
      return {
        type: 'Some',
        value: f(obj.value),
      };
    case 'None':
      return {
        type: 'None',
      };
  }
}
```

이는 값이 있을 수도 있고 없을 수도 있음을 나타내는 이른바 option 타입을 TypeScript로 표현한 예입니다.

`Option<T>` 타입은 값이 있는 경우의 객체 타입인 `Some<T>` 타입과 없는 경우의 타입인 `None` 타입의 유니언으로 표현되어 있습니다.

핵심은 이들에 공통되는 프로퍼티인 `type`입니다. 

`type` 프로퍼티는 **discriminanted property** 역할을 하며, 이 객체의 종류(`Some`인지 `None`인지)를 나타내는 **리터럴 타입** 문자열을 값으로 가집니다.

TypeScript 컴파일러는 `switch` 문에서 discriminated property `obj.type` 값을 검사하여, 각 case 문 내부에서 `obj`의 타입을 자동으로 좁혀줍니다.

Discriminated Unions는 타입 안전성을 보장하면서도 코드를 간결하게 유지할 수 있는 효과적인 방법입니다.

---

## `never` 타입

유니언 타입을 다루기 시작하면 가끔 등장하는 것이 `never` 타입입니다. `never` 타입은 "속하는 값이 존재하지 않는 타입"이며, 부분 타입 관계의 맨 아래에 있는(임의의 타입의 부분 타입인) 타입입니다. 어떤 값도 `never` 타입의 변수에 넣을 수 없습니다.

```typescript
// 오류: Type '0' is not assignable to type 'never'.
const n: never = 0;
```

한편, `never` 타입의 값은 어떤 타입에도 넣을 수 있습니다.

```typescript
// never 타입의 값을 만드는 방법이 없으므로 declare로 선언만 합니다.
declare const n: never;

const foo: string = n;
```

이렇게 들으면 `any` 타입처럼 위험한 타입이라고 생각할 수 있지만, 그렇지 않습니다.

`never` 타입에 해당하는 값은 존재하지 않으므로, `never` 타입의 값을 실제로 만들 수 없습니다.

따라서 (TypeScript의 타입 시스템을 속이지 않는 한) `never` 타입의 값을 가지고 있다는 상황이 있을 수 없어서, `never` 타입의 값을 다른 타입의 변수에 넣는다는 것이 소스 코드 상에 있더라도 실제로는 일어날 수 없는 것입니다.

무슨 말을 하는지 모르는 사람도 있을 수 있지만, 타입 시스템을 생각할 때 이러한 타입은 꽤 자연스럽게 나타납니다.

우선 구체적인 예를 살펴보겠습니다. 이는 앞서의 `Option<T>` 예제를 조금 변경한 것입니다.

```typescript
interface Some<T> {
  type: 'Some';
  value: T;
}
interface None {
  type: 'None';
}
type Option<T> = Some<T> | None;

function map<T, U>(obj: Option<T>, f: (obj: T) => U): Option<U> {
  switch (obj.type) {
    case 'Some':
      return {
        type: 'Some',
        value: f(obj.value),
      };
    case 'None':
      return {
        type: 'None',
      };
    default:
      // 여기서 obj는 never 타입이 됩니다.
      const unreachable: never = obj;
      throw new Error("unreachable");
  }
}
```

`switch` 문에 `default` 케이스가 추가되었습니다.

사실 이 안에서 `obj`의 타입은 `never`가 됩니다.

왜냐하면, 이전 `case` 문들에 의해 `obj`의 가능성이 모두 조사되었기 때문입니다.

이것이 의미하는 바는, 실제로는 `default` 절이 실행될 가능성이 없으며, 이 안에서는 `obj`의 값의 후보가 전혀 없다는 것입니다.

그런 상황을 `obj`에 `never` 타입을 부여함으로써 표현하고 있습니다.

또 하나 `never` 타입이 나올 가능성이 있는 곳은 함수의 반환값입니다.

```typescript
function func(): never {
  throw new Error('Hi');
}

const result: never = func();
```

함수의 반환 타입이 `never` 타입이 되는 것은 함수가 값을 반환할 가능성이 없을 때입니다.

이는 반환값이 없음을 나타내는 `void` 타입과는 달리, 애초에 함수가 정상적으로 종료되어 값을 반환하는 일이 있을 수 없다는 것을 나타냅니다.

위의 예제에서 함수 `func`는 반드시 `throw` 합니다.

즉, 함수의 실행이 중단되고 값을 반환하지 않고 함수를 빠져나갑니다.

특히, 위의 예제에서 `func`의 반환값을 변수 `result`에 할당하고 있지만, 실제로는 `result`에 무언가가 할당될 가능성은 없습니다.

따라서 `result`에는 `never` 타입을 붙일 수 있는 것입니다.

참고로, 위의 예제에서 `func`의 반환값에 타입 주석으로 `never`라고 적었는데, 이를 생략하면 반환 타입은 `void`로 추론됩니다.

이는 값을 반환하지 않는다는 것을 명시하고 싶을 때는 `never`로 타입 주석을 명시해야 합니다.

만약 반환 타입을 `never`로 하는 것이 불가능(어떤 값이 반환될 가능성을 부정할 수 없음)한 경우에는 제대로 타입 에러가 발생하니 안심하시면 됩니다.

---

## 교차 타입 (intersection 타입)

유니언 타입과 어떤 의미에서 대응되는 것으로 교차 타입(intersection 타입)이 있는데요.

두 개의 타입 `T`, `U`에 대해 `T & U`라고 쓰면, `T`이면서 `U`인 타입을 나타냅니다.

```typescript
interface Foo {
  foo: string;
  bar: number;
}
interface Bar {
  foo: string;
  baz: boolean;
}

const obj: Foo & Bar = {
  foo: 'foooooooo',
  bar: 3,
  baz: true,
};
```

예를 들어 이 예제에서 `Foo & Bar`라는 것은 `Foo`이면서 `Bar`인 타입을 나타내는데요.

따라서 이 타입의 값은 `string` 타입의 프로퍼티 `foo`와 `number` 타입의 프로퍼티 `bar`, 그리고 `boolean` 타입의 프로퍼티 `baz`를 가져야 합니다.

참고로, 유니언 타입과 교차 타입을 조합하면 재미있습니다.

다음 예제를 보세요.

```typescript
interface Foo {
  type: 'Foo';
  foo: string;
}
interface Bar {
  type: 'Bar';
  bar: number;
}
interface Fuga {
  baz: boolean;
}

type Obj = (Foo | Bar) & Fuga;

function func(obj: Obj) {
  // obj는 Fuga이므로 baz를 참조 가능
  console.log(obj.baz);
  if (obj.type === 'Foo') {
    // 여기서는 obj가 Foo & Fuga
    console.log(obj.foo);
  } else {
    // 여기서는 obj가 Bar & Fuga
    console.log(obj.bar);
  }
}
```

`Obj` 타입은 `(Foo | Bar) & Fuga`인데, 사실 이는 `(Foo & Fuga) | (Bar & Fuga)`와 동일하게 볼 수 있습니다. 따라서 유니언 타입일 때와 마찬가지로 `if` 문으로 타입을 좁힐 수 있는 거죠.

### 유니언 타입을 가진 함수와의 관계

잠깐만 교차 타입에서 유니언 타입으로 다시 돌아와볼게요. 아까는 생략했지만, 함수 타입을 포함하는 유니언 타입도 생각할 수 있습니다. 당연히 함수와 그 외의 유니언 타입을 만들었을 때는 이를 함수로 호출할 수 없습니다. 아래 예제에서는 `Func | MyObj` 타입의 값 `obj`가 `MyObj` 타입일 가능성이 있으므로, `obj(123)`처럼 함수로 사용할 수 없습니다.

```typescript
type Func = (arg: number) => number;
interface MyObj {
  prop: string;
}

const obj: Func | MyObj = { prop: '' };

// 오류: 호출 시그니처가 없는 타입의 표현식을 호출할 수 없습니다.
//       Type 'MyObj' has no compatible call signatures.
obj(123);
```

그렇다면 유니언 타입의 구성 요소가 모두 함수라면 호출할 수 있을 것 같은데요. 다음 예제를 볼까요?

```typescript
type StrFunc = (arg: string) => string;
type NumFunc = (arg: number) => string;

declare const obj: StrFunc | NumFunc;
// 오류: Argument of type '123' is not assignable to parameter of type 'string & number'.
//       Type '123' is not assignable to type 'string'.
obj(123);
```

이 예제에서는 `StrFunc | NumFunc` 타입의 변수 `obj`를 만들었는데요.

`StrFunc` 타입은 문자열을 받아 문자열을 반환하는 함수 타입이고, `NumFunc` 타입은 숫자를 받아 문자열을 반환하는 함수 타입입니다.

하지만 `obj`를 호출하는 부분에서 여전히 에러가 발생합니다.

에러 메시지에서 짐작하셨겠지만, 이 `StrFunc | NumFunc` 타입의 함수를 호출하는 것은 실질적으로 불가능한데요.

왜냐하면 `obj`는 `StrFunc` 타입일 수도 있어서 인수가 문자열이어야 하고, 한편 `NumFunc` 타입일 수도 있어서 인수가 숫자여야 하기 때문입니다.

즉, 인수가 문자열이면서 동시에 숫자여야 하는데, 이는 불가능하죠.

에러 메시지에 나오는 `string & number`라는 타입은 이를 나타냅니다.

문자열이면서 동시에 숫자인 값(즉, `string & number` 타입의 값)은 존재하지 않으므로, 이 함수를 호출할 수 없는 겁니다.

이처럼 함수들끼리 유니언을 만들 때, 결과 함수의 인수는 원래의 인수들끼리 교차 타입이 될 필요가 있습니다.

왜 그럴까에 대해 궁금한 분은 함수의 인수 위치가 타입 계층에서 반공변임을 생각해 보세요.

어려운 말로 하면, 이는 함수의 인수 타입이 반공변(contravariant) 위치에 있기 때문입니다.

인수의 타입이 교차 타입으로 표현된다는 점에서, 교차 타입을 써도 의미가 있는 예를 보겠습니다.

```typescript
interface Foo {
  foo: string;
  bar: number;
}
interface Bar {
  foo: string;
  baz: boolean;
}

type FooFunc = (arg: Foo) => number;
type BarFunc = (arg: Bar) => boolean;

declare const func: FooFunc | BarFunc;

// res는 number | boolean 타입
const res = func({
  foo: 'foo',
  bar: 123,
  baz: false,
});
```

이 예제에서 `func`는 `FooFunc | BarFunc` 타입인데요. `FooFunc`의 인수는 `Foo`이고, `BarFunc`의 인수는 `Bar`이므로, `func`의 인수 타입은 `Foo & Bar` 타입이어야 합니다.

따라서 `Foo & Bar` 타입을 가진 객체를 만들어 `func`를 호출할 수 있습니다.

이 예제에서 `res`의 타입은 `number | boolean` 타입이 되는데요.

이는 `func`의 타입이 `FooFunc`인 경우 반환값이 `number`이고, `BarFunc`인 경우 반환값이 `boolean`이기 때문입니다.

이처럼 함수들끼리의 유니언 타입을 가진 함수를 호출하고 싶을 때 교차 타입의 지식이 유용합니다.

특히, 앞서 본 것처럼 에러 메시지에 교차 타입이 나타나므로, 교차 타입에 대해서도 알아두는 게 좋을 거예요. (그런 기회가 얼마나 있을지는 묻지 마세요.)

참고로, 이 부분의 처리는 다루기 어렵기 때문인지 현재로서는 제한이 있습니다. 구체적으로는 함수 오버로드가 있는 경우나 제네릭이 관련된 경우에 함수를 호출할 수 없거나, 인수 타입을 추론할 수 없는 경우가 있습니다. 일단 예제만 보여드리지만, 곤란을 겪을 일은 그다지 없을 거예요.

```typescript
const arr: string[] | number[] = [];
// 오류: Parameter 'x' implicitly has an 'any' type.
arr.forEach(x => console.log(x));
// 오류: 호출 시그니처가 없는 타입의 표현식을 호출할 수 없습니다.
const arr2 = arr.map(x => x);
```

## 객체 타입 재방문

자, 유니언 타입을 소개했으니, 객체 타입에 좀 더 깊이 들어가 설명할 수 있는데요. 객체 타입은 `프로퍼티명: 타입;`이라는 정의의 모음이었지만, 사실 프로퍼티에 대해 수식어를 붙일 수 있습니다. 수식어에는 `?`와 `readonly` 두 가지가 있습니다.

### `?`: 선택적 프로퍼티

`?`를 붙여 선언한 프로퍼티는 선택적으로 사용할 수 있습니다.

```typescript
interface MyObj {
  foo: string;
  bar?: number;
}

let obj: MyObj = {
  foo: 'string',
};

obj = {
  foo: 'foo',
  bar: 100,
};
```

이 예제에서 `bar`는 선택적 프로퍼티인데요. `bar`는 선택 사항이므로, `foo`만 가진 객체와 `foo`와 `bar` 둘 다 가진 객체 모두 `MyObj` 타입의 값으로 인정됩니다.

### 선택적 프로퍼티에 대한 접근

그런데 실제 JavaScript에서는 존재하지 않는 프로퍼티에 접근하면 `undefined`가 반환됩니다.

그렇다면 `MyObj` 타입의 값에 대해 `bar` 프로퍼티를 얻으려고 하면 `undefined`일 가능성이 있다는 건데요.

이를 반영해서 `MyObj`의 `bar` 프로퍼티에 접근했을 때 얻는 타입은 `number | undefined`가 됩니다.

이렇게 `?` 수식어가 붙은 프로퍼티를 얻을 때는 자동으로 `undefined` 타입과의 유니언 타입이 됩니다.

따라서 이를 사용하는 쪽에서는 이렇게 `undefined` 체크를 해야 합니다.

```typescript
function func(obj: MyObj): number {
  return obj.bar !== undefined ? obj.bar * 100 : 0;
}
```

참고로, `?`를 쓰지 않고 직접 `bar`의 타입을 `number | undefined`로 해도 같은 의미가 되지 않습니다.

```typescript
interface MyObj {
  foo: string;
  bar: number | undefined;
}

// 오류:
// Type '{ foo: string; }' is not assignable to type 'MyObj'.
//   Property 'bar' is missing in type '{ foo: string; }'.
let obj: MyObj = {
  foo: 'string',
};
```

`?` 수식어를 사용하지 않는 경우, 비록 `undefined`가 허용된 프로퍼티라도 꼭 선언해야 합니다.

대부분의 경우 `bar?: number;`보다 `bar: number | undefined;`를 우선적으로 사용하는 것을 추천합니다.

전자는 `bar`가 없을 때 정말 없는 것인지, 작성자가 빼먹은 건지 구별할 수 없어 실수의 원인이 됩니다. 후자의 경우는 빼먹는 것을 방지할 수 있습니다.

정말로 "없어도 괜찮은" 상황은 함수에 옵션 객체를 전달할 때 정도인데요.

아래 소개하는 기사에서도 "그 외의 객체가 장기간 생존하는 경우에는 애초에 선택적 프로퍼티 자체를 피하자"고 합니다.

필자도 이에 동의하며, "편의성"보다 "안전성"을 택하고자 하는 많은 상황에서 선택적 프로퍼티보다 `undefined` 등의 유니언 타입으로 하는 것이 현명합니다.

> [exactOptionalPropertyTypes 에 관하여 - Object.create(null)](https://spicy-jelly.com/articles/958)

### `exactOptionalPropertyTypes`에 대하여

선택적 프로퍼티의 동작은 `exactOptionalPropertyTypes` 컴파일러 옵션이 유효한지 여부에 따라 달라집니다.

기본적으로 이 옵션은 비활성화되어 있고, 비교적 최근(TypeScript 4.4)에 추가된 옵션이라서 비활성화된 프로젝트가 많을 거예요.

이 옵션이 비활성화된 경우 `bar?: number;`라는 것은 `bar?: number | undefined;`라고 쓴 것과 같은 의미가 됩니다.

즉, 선택적 프로퍼티에 명시적으로 `undefined`를 넣을 수 있습니다.

```typescript
// exactOptionalPropertyTypes가 비활성화된 경우
interface MyObj {
  foo: string;
  bar?: number;
}

// 모두 OK
const obj1: MyObj = { foo: 'pichu' };
const obj2: MyObj = { foo: 'pikachu', bar: 25 };
const obj3: MyObj = { foo: 'raichu', bar: undefined };
```

한편, `exactOptionalPropertyTypes`가 활성화된 경우 선택적 프로퍼티에 `undefined`를 넣을 수 없게 됩니다.

```typescript
// exactOptionalPropertyTypes가 활성화된 경우
interface MyObj {
  foo: string;
  bar?: number;
}

const obj1: MyObj = { foo: 'pichu' };
const obj2: MyObj = { foo: 'pikachu', bar: 25 };
// 오류: Type 'undefined' is not assignable to type 'number'.
const obj3: MyObj = { foo: 'raichu', bar: undefined };
```

지금까지 `bar?: number;`라고 쓰면 자동으로 `bar: undefined`가 가능해지는 것은 별로 직관적인 동작이 아니었는데요.

`exactOptionalPropertyTypes`를 활성화하여 이를 개선할 수 있습니다.

또한, 이 옵션이 활성화된 상태에서는 `bar?: number;`로 선언된 프로퍼티에 대해 "number 타입의 값이 들어있다" 또는 "프로퍼티가 존재하지 않는다" 중 하나가 됩니다.

따라서 `in` 연산자(프로퍼티가 존재하는지 판정하는 연산자)를 사용하여 타입을 좁힐 수 있게 됩니다.

```typescript
// exactOptionalPropertyTypes가 활성화된 상태에서
interface MyObj {
  foo: string;
  bar?: number;
}

function func(obj: MyObj) {
  if ('bar' in obj) {
    // 여기서 obj.bar는 number 타입
    console.log(obj.bar.toFixed(1));
  }
}
```

다만, 다른 라이브러리에서 제공된 타입 정의에 선택적 프로퍼티가 있는 경우에는 주의가 필요합니다.

왜냐하면, 그쪽 라이브러리는 `exactOptionalPropertyTypes`가 비활성화된 상태에서 만들어졌을 수 있고, 그렇다면 이쪽 설정에서는 활성화되어 있어도 "undefined 타입의 값이 들어 있다"는 상태가 될 가능성이 있기 때문입니다.

### `readonly`

프로퍼티에 대해 또 다른 수식어로 `readonly`가 있습니다.

이를 붙여 선언된 프로퍼티는 재할당할 수 없게 됩니다.

```typescript
interface MyObj {
  readonly foo: string;
}

const obj: MyObj = {
  foo: 'Hey!',
};

// 오류: Cannot assign to 'foo' because it is a constant or a read-only property.
obj.foo = 'Hi';
```

한마디로, `const`의 프로퍼티 버전이라고 생각하면 되는데요.

순수 JavaScript에서는 프로퍼티의 `writable` 속성에 해당하지만, 프로퍼티의 속성을 타입 시스템에 포함시키는 것은 무리가 있기 때문에 TypeScript에서는 이런 독자적인 방법을 취한 것 같습니다.

하지만 `readonly`를 과신해서는 안 됩니다.

다음 예시에서 보듯이, `readonly`가 아닌 타입을 통해 변경이 가능하기 때문입니다.

```typescript
interface MyObj {
  readonly foo: string;
}
interface MyObj2 {
  foo: string;
}

const obj: MyObj = { foo: 'Hey!' };

const obj2: MyObj2 = obj;

obj2.foo = 'Hi';

console.log(obj.foo); // 'Hi'
```

### 인덱스 시그니처

객체 타입에는 사실 지금까지 소개한 것 외에도 표기법이 있습니다.

그중 하나가 인덱스 시그니처입니다.

```typescript
interface MyObj {
  [key: string]: number;
}

const obj: MyObj = {};

const num: number = obj.foo;
const num2: number = obj.bar;
```

`[key: string]: number;` 부분이 새로운데요.

이렇게 쓰면 `string` 타입인 임의의 프로퍼티명에 대해 `number` 타입을 갖는다는 의미가 됩니다.

`obj`에 그런 타입을 부여했으니 `obj.foo`나 `obj.bar` 등은 모두 `number` 타입을 갖고 있습니다.

이것은 편리하지만 분명히 위험한데요.

`obj`는 실제로 `{}`이므로 `obj.foo` 등은 `undefined`가 될 텐데, 그 가능성이 무시되고 있습니다.

그렇게 위험한 타입이 버젓이 허용되는 이유는 객체를 사전처럼 사용하는 경우에 필요하다든가, 배열 타입의 정의에도 필요하다든가 그런 곳일 겁니다.

실제로 배열 타입의 정의는 대체로 아래와 같습니다.

```typescript
interface Array<T> {
  [idx: number]: T;
  length: number;
  // 메서드 정의가 이어짐
  // ...
}
```

참고로, 이 예제처럼 인덱스 시그니처 외에 프로퍼티가 있을 경우, 그쪽이 우선됩니다.

일반적으로 인덱스 시그니처의 사용은 최대한 피하는 것이 좋습니다.

객체를 사전처럼 사용하는 경우 대신 `Map`을 사용하세요.

배열의 경우는 인덱스를 통한 접근을 피하고 `for-of` 문을 사용하는 등의 방법으로 피할 수 있습니다.

### 함수 시그니처

사실, 객체 타입의 표기로 함수 타입을 표현하는 방법이 있습니다.

```typescript
interface Func {
  (arg: number): void;
}

const f: Func = (arg: number) => {
  console.log(arg);
};
```

`(arg: number): void;` 부분에서, 이 객체는 `number` 타입의 인수를 하나 받는 함수임을 나타냅니다.

이 표기는 일반적인 프로퍼티 선언과 동시에 사용할 수 있어서, 함수면서 동시에 특정 프로퍼티를 가진 객체를 나타낼 수 있습니다.

더 나아가, 여러 개의 함수 시그니처를 쓸 수 있어 오버로딩을 표현할 수 있습니다.

```typescript
interface Func {
  foo: string;
  (arg: number): void;
  (arg: string): string;
}
```

이 타입이 나타내는 값은 `string` 타입의 `foo` 프로퍼티를 가진 객체이며, `number` 타입의 인수를 받아 함수로 호출할 수 있고 그 경우 아무것도 반환하지 않으며, `string` 타입의 인수로 호출할 수도 있고 그 경우 `string` 타입의 값을 반환하는 함수입니다.

### new 시그니처

유사한 것으로, 생성자를 나타내는 시그니처도 있습니다.

```typescript
interface Ctor<T> {
  new (): T;
}

class Foo {
  public bar: number | undefined;
}

const f: Ctor<Foo> = Foo;
```

여기서 만든 `Ctor<T>` 타입은 인수가 없을 때 `new` 하면 `T` 타입의 값이 반환되는 함수를 나타냅니다.

여기서 정의한 클래스 `Foo`는 `new` 하면 `Foo`의 인스턴스(즉, `Foo` 타입의 값)가 반환되므로 `Ctor<Foo>`에 할당 가능합니다.

참고로, 함수의 타입을 `(foo: string) => number`처럼 쓸 수 있었던 것처럼, `new` 시그니처만 있는 경우 생성자의 타입을 `new () => Foo`처럼 쓸 수도 있습니다.

---

## `as`를 이용한 다운캐스팅

여기서 타입과 관련된 이야기로 `as`를 이용한 다운캐스팅을 소개할게요.

이는 TypeScript 고유의 문법으로, `식 as 타입`으로 씁니다.

다운캐스팅이니 당연히 타입 안전하지 않지만, TypeScript를 작성하다 보면 가끔 필요할 때가 있습니다.

참고로, 다운캐스팅은 파생 타입의 값을 부분 타입으로 취급하기 위한 것입니다.

```typescript
const value = rand();

const num = value as number;
console.log(num * 10);

function rand(): string | number {
  if (Math.random() < 0.5) {
    return 'hello';
  } else {
    return 123;
  }
}
```

이 예제에서 `value`는 `string | number` 타입의 값인데요, `value as number` 구문을 통해 `number` 타입으로 취급하고 있습니다.

따라서 변수 `num`은 `number` 타입이 됩니다.

이것은 안전하지 않은데요. 왜냐하면 `value`는 실제로 `string` 타입, 즉 문자열일 수도 있어서, 변수 `num`에 문자열이 들어갈 가능성이 있기 때문입니다.

참고로, `as`를 써도 전혀 관계없는 두 값의 변환은 할 수 없습니다.

```typescript
const value = 'foo';
// 오류: Type 'string' cannot be converted to type 'number'.
const num = value as number;
```

이 경우, `any` 타입이나 뒤에서 설명할 `unknown` 타입을 거치면 변환이 가능합니다.

```typescript
const value = 'foo';
const num = value as unknown as number;
```

덧붙여, 이 예제에서 보이듯이, `as`는 업캐스팅도 가능합니다.

첫 번째 `as unknown`에서 이루어지는 것은 다운캐스팅이 아니라 업캐스팅이며, 그 후 `as number`로 다운캐스팅하고 있습니다.

다른 업캐스팅 예로는 `const foo: string = 'foo';` 대신 `const foo = 'foo' as string;`처럼 쓰는 경우를 들 수 있습니다( `'foo'` 타입을 `string` 타입으로 업캐스팅).

업캐스팅 자체는 `as`를 쓰지 않아도 가능한 안전한 작업입니다.

업캐스팅에 `as`를 사용하는 것은 위험한 다운캐스팅과 구별이 가지 않으므로 피하는 것이 좋습니다.

---

3편에서 계속 이어서 뵙겠습니다.

그럼.

---
