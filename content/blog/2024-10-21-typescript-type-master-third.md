---
slug: 2024-10-21-typescript-type-master-third
title: TypeScript 타입 기초 완전 정복! 3편 - as const, unknown, Mapped, Conditional 타입 완벽 분석
date: 2024-10-21 12:31:26.335000+00:00
summary: TypeScript 타입 시스템의 최고봉을 향해! `as const`, `unknown`, `keyof`, Lookup, Mapped, Conditional 타입 등 고급 타입 개념을 파헤쳐 봅니다.
tags: ["TypeScript", "타입스크립트", "고급 타입", "as const", "unknown", "Mapped 타입", "Conditional 타입"]
contributors: []
draft: false
---

안녕하세요?

Typescript 타입 기초 완전 정복 3편입니다.

전체 강좌 링크는 아래와 같습니다.

1. [TypeScript 타입 기초 완전 정복! 1편 - 프리미티브, 객체, 함수, 배열](https://mycodings.fly.dev/blog/2024-10-21-typescript-type-basics-first)

2. [TypeScript 타입 기초 완전 정복! 2편 - 제네릭, 튜플, 유니언, never, 교차 타입](https://mycodings.fly.dev/blog/2024-10-21-typescript-type-advanced-second)

3. [TypeScript 타입 기초 완전 정복! 3편 - as const, unknown, Mapped, Conditional 타입 완벽 분석](https://mycodings.fly.dev/blog/2024-10-21-typescript-type-master-third)

---

** 목 차 **

- [`readonly` 배열과 튜플](#readonly-배열과-튜플)
  - [Variadic Tuple Types](#variadic-tuple-types)
  - [`[...]`와 `T`의 차이](#와-t의-차이)
- [템플릿 리터럴 타입](#템플릿-리터럴-타입)
- [`as const`](#as-const)
- [`object`, `{}`, `unknown` 타입](#object--unknown-타입)
  - [`object` 타입](#object-타입)
  - [`{}` 타입](#-타입)
  - [`unknown` 타입](#unknown-타입)
  - [타입 선택 가이드](#타입-선택-가이드)
- [`typeof` 타입 연산자](#typeof-타입-연산자)
- [`keyof` 타입 연산자](#keyof-타입-연산자)
- [Lookup 타입 `T[K]`](#lookup-타입-tk)
- [Mapped 타입](#mapped-타입)
- [Conditional 타입](#conditional-타입)
  - [Mapped 타입의 한계](#mapped-타입의-한계)
  - [Conditional 타입을 이용한 `DeepReadonly<T>`](#conditional-타입을-이용한-deepreadonlyt)
  - [Conditional 타입에서의 타입 매칭](#conditional-타입에서의-타입-매칭)
- [Conditional 타입에 의한 문자열 조작](#conditional-타입에-의한-문자열-조작)
- [마무리](#마무리)


---

## `readonly` 배열과 튜플

조금 전에 객체 타입의 `readonly` 수식어를 소개했는데요.

이를 통해 객체의 특정 프로퍼티를 타입 시스템상에서 `readonly`(수정 불가)로 만들 수 있었습니다.

사실 배열 타입이나 튜플 타입에서도 `readonly` 개념이 존재합니다.

다만, 객체의 경우 프로퍼티별로 `readonly` 여부를 제어할 수 있었지만, 배열이나 튜플은 요소별로 제어할 수 없습니다.

배열이나 튜플 전체가 `readonly`인지 아닌지를 구분하게 됩니다.

`readonly` 배열 타입은 `readonly T[]`처럼 씁니다(`T`는 요소의 타입).

다음 예제는 `readonly number[]` 타입의 배열 예제입니다.

```typescript
// arr은 readonly number[] 타입
const arr: readonly number[] = [1, 2, 3];

// arr의 요소를 수정하려 하면 타입 에러
// 오류: Index signature in type 'readonly number[]' only permits reading.
arr[0] = 100;

// readonly 배열 타입에는 push 등 수정 메서드가 존재하지 않음
// 오류: Property 'push' does not exist on type 'readonly number[]'.
arr.push(4);
```

`readonly` 프로퍼티와 마찬가지로, `readonly` 배열의 요소를 수정하려고 하면 에러가 발생합니다.

또한, `readonly` 배열은 `push` 등 배열을 변경하는 메서드가 제거되어 사용할 수 없습니다.

이 두 가지 기능을 통해 `readonly` 배열의 불변성을 타입 시스템에서 보장합니다.

참고로, `T[]` 타입을 `Array<T>`로 쓸 수 있는 것처럼, `readonly T[]` 타입은 `ReadonlyArray<T>`로 쓸 수 있습니다.

`readonly` 튜플도 마찬가지로, 튜플 타입 앞에 `readonly`를 붙여 표현합니다.

```typescript
const tuple: readonly [string, number] = ['foo', 123];
// 오류: Cannot assign to '0' because it is a read-only property.
tuple[0] = 'bar';
```

이 예제에서 `tuple`은 `readonly [string, number]` 타입의 변수이며, 튜플의 각 요소를 수정할 수 없게 됩니다.

### Variadic Tuple Types

조금 전에 나왔던 가변 길이 튜플 타입의 문법에서는 튜플 타입 안에 `...` 배열을 쓸 수 있었는데요.

사실 여기에는 다른 튜플 타입을 넣을 수 있는 기능도 있습니다.

이를 이용하면 배열의 스프레드 문법처럼, 튜플 타입에 요소를 추가한 다른 튜플 타입을 만들 수 있습니다.

```typescript
type SNS = [string, number, string];
// [string, string, number, string, number];
type SSNSN = [string, ...SNS, number];
```

이 기능은 Variadic Tuple Types라고 불리며, TypeScript 4.0에서 도입되었습니다.

이 기능의 놀라운 점은 `...` 타입 변수를 형태로 사용할 수 있고, 타입 추론의 자료로 활용할 수 있다는 것입니다.

```typescript
function removeFirst<T, Rest extends readonly unknown[]>(
  arr: [T, ...Rest]
): Rest {
  const [, ...rest] = arr;
  return rest;
}

// const arr: [number, number, string]
const arr = removeFirst([1, 2, 3, 'foo']);
```

이 예제에서는 변수 `arr`의 타입이 `[number, number, string]`임이 타입 추론됩니다.

이는 `removeFirst`의 타입 인수 `T`와 `Rest`가 각각 `number`와 `[number, number, string]`임을 TypeScript가 이해했다는 것을 의미합니다.

특히, 인수 `[1, 2, 3, 'foo']`를 인수의 타입 `[T, ...Rest]`에 맞추는 추론을 TypeScript가 수행한 것입니다. 이것이 `...` 타입 변수가 타입 추론의 대상이 된다는 것입니다.

Variadic Tuple Types의 도입으로, 튜플 타입의 조작에 관한 TypeScript의 추론 능력이 강화되었습니다.

위 예제에서 `removeFirst` 내의 변수 `rest`의 타입이 자동으로 `Rest`로 추론되는 점도 주목할 만합니다.

또한, 조금 전에 본 것처럼, 튜플 타입은 함수의 가변 인자 제어에도 사용됩니다. 여기서도 Variadic Tuple Types가 활약할 것입니다.

참고로, 타입 인수를 `...T` 형식으로 사용할 때는 그 타입 인수가 배열 타입 또는 튜플 타입임을 여기서 선언해 주어야 합니다.

위 예제처럼 `extends readonly unknown[]`로 하면 좋습니다.

### `[...]`와 `T`의 차이

`[...T]`는 얼핏 보면 `T`와 완전히 동일한 의미로 보이지만, 제네릭과 조합되었을 때 약간의 차이를 만듭니다.

```typescript
function func1<T extends readonly unknown[]>(arr: T): T {
  return arr;
}
function func2<T extends readonly unknown[]>(arr: [...T]): T {
  return arr;
}
// const arr1: number[]
const arr1 = func1([1, 2, 3]);
// const arr2: [number, number, number]
const arr2 = func2([1, 2, 3]);
```

이 예제처럼, 타입 인수 추론 시에 배열이 `T` 타입의 인수에 맞춰진 경우는 배열 타입이 추론되지만, `[...T]` 타입의 인수에 맞춰진 경우는 튜플 타입이 추론됩니다.

함수에 전달된 배열의 각 요소의 타입을 얻고 싶은데 배열 타입이 되어버리는 상황에서 활용할 수 있을지도 모릅니다.

## 템플릿 리터럴 타입

템플릿 리터럴 타입은 특정 형식의 문자열만을 받아들이는 타입입니다.

이 글의 초반부에서 본 문자열 리터럴 타입은 단 하나의 문자열만을 받아들이는 타입이었는데요, 템플릿 리터럴 타입은 조금 더 유연합니다.

템플릿 리터럴 타입의 문법은 템플릿 문자열 리터럴과 유사하며, 기본적으로 `` `어떤 문자열` `` 형태로, 그 문자열만을 받아들입니다.

이 안에 `${ 타입 }`이라는 구문을 넣을 수 있는데, 그 타입에 해당하는 임의의 값(의 문자열 표현)을 그 위치에 대입할 수 있습니다.

예를 들어, 다음 예제에서 정의하는 `HelloStr` 타입은 `Hello,` 뒤에 임의의 `string` 타입의 값이 오는 문자열이라는 의미입니다.

이는 실질적으로 `Hello,`로 시작하는 문자열만을 받아들이는 타입이 됩니다.

```typescript
type HelloStr = `Hello, ${string}`;

const str1: HelloStr = 'Hello, world!';
const str2: HelloStr = 'Hello, uhyo';
// 오류: Type '"Hell, world!"' is not assignable to type '`Hello, ${string}`'.
const str3: HelloStr = 'Hell, world!';
```

`${string}` 외에도 몇 가지 타입을 사용할 수 있습니다.

예를 들어 `${number}`라고 하면 숫자만이 들어갈 수 있게 됩니다.

다음 예제처럼, 숫자(`number` 타입의 값)를 문자열로 변환했을 때 가능한 문자열이 `${number}` 위치에 들어가는 것으로 받아들여집니다.

단, `Infinity`와 `NaN`은 `${number}`에 포함되지 않는 것 같습니다.

이 때문에 `${number}`는 그다지 실용적이지 않습니다.

실용적으로 사용 가능한 것은 `${string}`이나, 혹은 문자열 리터럴 타입의 유니언 타입 등을 `${ }` 안에 넣는 경우입니다.

```typescript
type PriceStr = `${number}원`;

const str1: PriceStr = '100원';
const str2: PriceStr = '-50원';
const str3: PriceStr = '3.14원';
const str4: PriceStr = '1e100원';
// 아래부터는 모두 오류
const str5: PriceStr = '1_000_000원';
const str6: PriceStr = '원';
const str7: PriceStr = '1,234원';
const str8: PriceStr = 'NaN원';
const str9: PriceStr = 'Infinity원';
```

템플릿 리터럴 타입은 TypeScript 4.1에서 도입되면서 큰 화제가 되었습니다.

이는 뒤에서 설명할 조건부 타입(`infer`)과 조합하여 타입 레벨 계산에서 문자열 조작이 가능해졌기 때문입니다.

## `as const`

조금 전에 나왔던 `readonly`와 관련된 이야기로, `as const`를 소개합니다.

이는 TypeScript에서 타입 추론 방법을 지시하기 위한 구문입니다.

역시 조금 전에 소개한 `as`에 의한 다운캐스팅과 비슷하지만, 타입 대신 `const`를 쓰는 것이 특징입니다.

`as const`는 각종 리터럴(문자열, 숫자, 불리언 리터럴, 객체 리터럴, 배열 리터럴)에 부가할 수 있으며, 그 값이 수정될 의도가 없는 값임을 나타냅니다.

이 글의 초반부에서 리터럴 타입의 타입 추론에 대해 설명한 것을 기억하시나요?

리터럴 타입의 값을 `var`나 `let`으로 선언한 변수에 넣으면, 그 값이 나중에 수정될 수도 있기 때문에 리터럴 타입이 아니라 대응하는 프리미티브 타입으로 추론된다고 했습니다.

```typescript
// foo는 string 타입
var foo = '123';
```

그렇다면 이 `'123'`에 `as const`를 붙이면 어떻게 될까요? 그것이 다음 예제입니다.

```typescript
// foo2는 "123" 타입
var foo2 = '123' as const;
```

이렇게 `as const`를 붙이면 `'123'`은 수정될 의도가 없는 값으로 취급되므로, 변수 `foo2`는 `string` 타입이 아니라 `"123"` 타입이 됩니다.

여기까지의 이야기는 `const`를 사용하면 되는 이야기였지만, `as const`의 진가는 여기서부터입니다.

다음으로, 객체 리터럴의 예를 보겠습니다.

```typescript
// obj는 { foo: string; bar: number[] } 타입
const obj = {
  foo: '123',
  bar: [1, 2, 3],
};

/*
 obj2는
 {
     readonly foo: "123";
     readonly bar: readonly [1, 2, 3];
 }
 타입
*/
const obj2 = {
  foo: '123',
  bar: [1, 2, 3],
} as const;
```

먼저, `as const` 없는 `obj`의 타입은 `{ foo: string; bar: number[] }` 타입입니다.

주목할 점은, 예를 들어 `foo` 프로퍼티의 타입이 `"123"` 타입이 아니라 `string` 타입이라는 점입니다.

이는 `"123"`을 `var`나 `let` 변수에 넣었을 때와 같은 동작입니다.

객체의 프로퍼티는(`readonly`가 아닌 한) `obj.foo = "456";`처럼 수정할 수 있으므로, 일반적으로 리터럴 타입이 붙지 않습니다.

한편, `as const`를 객체 리터럴에 붙인 `obj2`의 경우는 `foo` 프로퍼티에 `"123"` 타입이 붙어 있습니다.

또한, `foo` 프로퍼티 자체도 `readonly`가 되어 있습니다. 후자는 `obj2`가 수정될 의도가 없는 객체이므로 `obj2.foo = "456";` 같은 변경을 금지하기 위해 `readonly`가 된 것이죠.

또한, `as const`는 재귀적으로 그 안에도 적용되므로, 내부의 `"123"`도 `"123" as const`와 마찬가지로 취급되어, 타입이 `string`이 아니라 `"123"` 타입이 됩니다.

`bar`도 마찬가지입니다. 배열 리터럴에 `as const`를 사용하면 대응하는 `readonly` 튜플 타입이 추론됩니다.

이 경우 `[1, 2, 3] as const`의 타입이 `readonly [1, 2, 3]`으로 추론되므로, `obj2.bar`의 타입도 `readonly [1, 2, 3]` 타입이 됩니다.

`readonly [number, number, number]`가 아니라 `readonly [1, 2, 3]`이 되는 것은, 역시 배열 리터럴의 내용에도 `as const`가 적용되었기 때문입니다.

그 외에도, `as const`는 템플릿 문자열 리터럴에 대해서도 특수한 효과를 가집니다.

템플릿 문자열 리터럴의 타입은 일반적으로 `string` 타입이지만, `as const`가 적용되면 템플릿 리터럴 타입을 얻을 수 있습니다.

```typescript
const world: string = 'world';

// string 타입
const str1 = `Hello, ${world}!`;
// `Hello, ${string}!` 타입
const str2 = `Hello, ${world}!` as const;
```

이처럼, `as const`는 리터럴의 타입 추론에서 타입을 확장하지 않고 싶을 때 사용할 수 있습니다.

`as const`를 리터럴에 붙였을 때 추론되는 타입의 동작을 정리하면 다음과 같습니다.

1. 문자열, 숫자, 불리언 리터럴은 그 자체의 리터럴 타입을 가지는 것으로 추론됩니다. (예: `"foo" as const`는 `"foo"` 타입)
2. 템플릿 문자열 리터럴은 템플릿 리터럴 타입으로 추론됩니다.
3. 객체 리터럴은 각 프로퍼티가 `readonly`를 가지게 됩니다.
4. 배열 리터럴의 타입은 `readonly` 튜플 타입이 됩니다.

## `object`, `{}`, `unknown` 타입

TypeScript에는  `object`, `{}`, `unknown` 세 가지 타입이  "일반적인 객체"를 나타내는 데 사용될 수 있습니다. 하지만 각각 미묘한 차이점과 용도가 있습니다.

### `object` 타입

`object` 타입은 프리미티브 타입( `string`, `number`, `boolean`, `symbol`, `bigint`, `null`, `undefined`)을 제외한 모든 타입을 나타냅니다.

즉, 함수, 배열, 클래스 인스턴스 등을 포함합니다.

```typescript
const obj1: object = {};
const obj2: object = [];
const obj3: object = new Date();
const obj4: object = function() {};

// 오류: Type '123' is not assignable to type 'object'.
const obj5: object = 123; 
```

### `{}` 타입

`{}` 타입은 프로퍼티가 없는 빈 객체 타입을 나타냅니다.

`object` 타입과 달리, `{}` 타입은 프리미티브 값에도 할당할 수 있습니다.

하지만 `null`과 `undefined`는 할당할 수 없습니다.

```typescript
const obj1: {} = {};
const obj2: {} = [];
const obj3: {} = 123;

// 오류: Type 'null' is not assignable to type '{}'.
const obj4: {} = null; 
```

### `unknown` 타입

`unknown` 타입은 말 그대로 "알 수 없는" 타입을 나타냅니다.

`any` 타입과 유사하지만, `unknown` 타입은 타입 안전성을 유지하면서 사용할 수 있습니다.

즉, `unknown` 타입의 변수를 사용하기 전에 타입을 좁히는 과정이 필요합니다.

```typescript
const value: unknown = 'hello';

// 오류: Object is of type 'unknown'.
console.log(value.length);

if (typeof value === 'string') {
  // value는 string 타입으로 좁혀짐
  console.log(value.length); 
}
```

### 타입 선택 가이드

* **`object`:** 프리미티브 타입을 제외한 모든 객체 타입을 나타내고 싶을 때 사용합니다.
* **`{}`:** 프로퍼티가 없는 빈 객체 타입을 나타내고 싶을 때 사용합니다. 하지만 프리미티브 값에도 할당할 수 있으므로 주의가 필요합니다.
* **`unknown`:** 타입을 미리 알 수 없는 경우, 타입 안전성을 유지하면서 사용하고 싶을 때 사용합니다. 타입 좁히기를 통해 안전하게 사용해야 합니다.

## `typeof` 타입 연산자

TypeScript의 편리한 기능으로 `typeof` 타입 연산자가 있습니다.

이는 `typeof 변수`라고 쓰면, 해당 변수의 타입을 얻을 수 있는 것입니다.

```typescript
let foo = 'str';

type FooType = typeof foo; // FooType은 string이 됨

const str: FooType = 'abcdef';
```

## `keyof` 타입 연산자

`keyof` 타입 연산자는 객체 타입의 키(프로퍼티 이름)들을 유니온 타입으로 반환합니다.

```typescript
interface MyObj {
  foo: string;
  bar: number;
}

let key: keyof MyObj;
key = 'foo';
key = 'bar';
// 오류: Type '"baz"' is not assignable to type '"foo" | "bar"'.
key = 'baz';
```

이 예제에서는 `MyObj` 타입의 객체는 프로퍼티 `foo`와 `bar`를 가집니다.

따라서 프로퍼티 이름으로 가능한 문자열은 `'foo'`와 `'bar'`뿐이며, `keyof MyObj`는 그 문자열만을 받아들이는 타입, 즉 `'foo' | 'bar'`가 됩니다.

따라서 `keyof MyObj` 타입의 변수 `key`에 `'baz'`를 할당하려고 하면 에러가 납니다.

JavaScript에서는 프로퍼티 이름이 문자열 외에 심볼일 수도 있습니다.

따라서 `keyof` 타입은 심볼 타입을 포함할 수도 있습니다.

```typescript
// 새로운 심볼을 생성
const symb = Symbol();

const obj = {
  foo: 'str',
  [symb]: 'symb',
};

// ObjType = 'foo' | typeof symb
type ObjType = keyof typeof obj;
```

이 예제에서는 `obj`의 프로퍼티 이름의 타입을 `keyof`로 얻었습니다.

`ObjType`은 `'foo' | typeof symb`가 되는데요. 이는 `'foo' | symbol`이 아니라는 점에 주의하세요.

TypeScript에서는 심볼은 `symbol` 타입이지만, 프로퍼티 이름으로서는 심볼은 하나하나 다르기 때문에 `symb`에 들어 있는 특정 심볼이어야 합니다[^7].

더 나아가, `keyof` 타입에는 `number`의 부분 타입이 포함될 수도 있습니다. 

그것은 숫자 리터럴을 사용하여 프로퍼티를 선언한 경우입니다.

```typescript
const obj = {
  foo: 'str',
  0: 'num',
};

// ObjType = 0 | 'foo'
type ObjType = keyof typeof obj;
```

JavaScript에서는 프로퍼티 이름에 숫자를 사용할 수 없지만(사용하려고 하면 문자열로 변환됩니다), TypeScript에서는 숫자를 프로퍼티 이름으로 사용한 경우 타입 상에서는 그것을 유지하려고 합니다.

한편, 앞서 나온 인덱스 시그니처를 가진 객체의 경우는 조금 특수한 동작을 합니다.

```typescript
interface MyObj {
  [foo: string]: number;
}

// MyObjKey = string
type MyObjKey = keyof MyObj;
```

이 예제에서 정의한 `MyObj` 타입은 임의의 `string` 타입의 이름에 대해 그 이름의 프로퍼티가 `number` 타입을 가진다는 의미입니다.

따라서 `MyObj` 타입의 객체의 키로는 `string` 타입의 모든 값을 사용할 수 있습니다.

따라서 `keyof MyObj`는 `string`이 됩니다. 

## Lookup 타입 `T[K]`

`keyof`와 함께 자주 사용되는 것이 **Lookup 타입**인데요. 이는 타입 `T`와 `K`에 대해 `T[K]`라는 구문으로 작성합니다.

`K`가 프로퍼티 이름의 타입일 때, `T[K]`는 `T`의 해당 프로퍼티의 타입이 됩니다.

말로 설명하면 좀 어려우니 예제를 볼까요?

```typescript
interface MyObj {
  foo: string;
  bar: number;
}

// str의 타입은 string이 됩니다.
const str: MyObj['foo'] = '123';
```

이 예제에서는 `MyObj['foo']`라는 타입이 등장하는데요.

앞에서 본 `T[K]`라는 구문과 비교하면, `T`가 `MyObj` 타입이고 `K`가 `'foo'` 타입이 됩니다.

따라서 `MyObj['foo']`는 `MyObj` 타입의 객체에서 `foo`라는 프로퍼티의 타입인 `string`이 됩니다.

마찬가지로, `MyObj['bar']`는 `number`가 됩니다. `MyObj['baz']`처럼 존재하지 않는 프로퍼티 이름을 타입으로 주면 에러가 발생하는데요.

엄밀히 말하면, `K`는 `keyof T`의 부분 타입이어야 합니다.

반대로 말하면, `MyObj[keyof MyObj]`라는 타입도 가능합니다.

이는 `MyObj['foo' | 'bar']`와 같은 의미인데요, 프로퍼티 이름이 `foo` 또는 `bar`라는 것은 그 값이 `string` 또는 `number`라는 것이므로, `MyObj['foo' | 'bar']`는 `string | number`가 됩니다.

`keyof`와 **Lookup 타입**을 사용하면 예를 들어 이런 함수를 작성할 수 있습니다.

```typescript
function pick<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const obj = {
  foo: 'string',
  bar: 123,
};

const str: string = pick(obj, 'foo');
const num: number = pick(obj, 'bar');
// 에러: Argument of type '"baz"' is not assignable to parameter of type '"foo" | "bar"'.
pick(obj, 'baz');
```

이 함수 `pick`은 `pick(obj, 'foo')`라고 하면 `obj.foo`를 반환해주는 함수인데요.

주목할 점은 이 함수에 정확하게 타입을 붙일 수 있다는 것입니다. `pick(obj, 'foo')`의 반환 타입은 `obj.foo`의 타입인 `string`이 되고, 마찬가지로 `pick(obj, 'bar')`의 타입은 `number`가 됩니다.

`pick`은 두 개의 타입 변수 `T`와 `K`를 가지며, 두 번째 타입 변수는 `K extends keyof T`라고 적혀 있습니다.

이는 처음 나온 문법인데요, 여기서 선언하는 타입 변수 `K`는 `keyof T`의 부분 타입이어야 한다는 의미입니다.

이 조건이 없으면 반환 타입 `T[K]`가 적절하지 않을 가능성이 있어 에러가 발생합니다.

`pick(obj, 'foo')`라는 호출에서는 `T`가 `{ foo: string; bar: number; }` 타입, `K`가 `'foo'` 타입이 되어, 반환 타입은 `({ foo: string; bar: number; })['foo']` 타입, 즉 `string`이 됩니다.

## Mapped 타입

앞서 소개한 두 가지와 동시에 도입된 것이 **Mapped 타입**인데요. 

Mapped 타입은 `{ [P in K]: T }`라는 구문을 가진 타입입니다.

여기서 `P`는 타입 변수이고, `K`와 `T`는 어떤 타입입니다.

단, `K`는 `string`의 부분 타입이어야 합니다. 예를 들어 `{ [P in 'foo' | 'bar']: number }`라는 타입이 가능합니다.

`{ [P in K]: T }`라는 타입의 의미는, "`K` 타입의 값으로 가능한 각 문자열 `P`에 대해, 타입 `T`를 가진 프로퍼티 `P`가 존재하는 객체의 타입"입니다.

위 예제에서는 `K`가 `'foo' | 'bar'`이므로, `P`로는 `'foo'`와 `'bar'`가 가능합니다.

따라서 이 타입은 `number` 타입을 가진 프로퍼티 `foo`와 `bar`가 존재하는 객체를 나타냅니다.

즉, `{ [P in 'foo' | 'bar']: number }`는 `{ foo: number; bar: number; }`와 같은 의미입니다.

```typescript
type Obj1 = { [P in 'foo' | 'bar']: number };
interface Obj2 {
  foo: number;
  bar: number;
}

const obj1: Obj1 = { foo: 3, bar: 5 };
const obj2: Obj2 = obj1;
const obj3: Obj1 = obj2;
```

이것만으로는 별로 재미있지 않은데요.

사실 `{ [P in K]: T }`라는 구문에서 타입 `T` 안에 `P`를 사용할 수 있습니다. 예를 들어 다음 타입을 보세요.

```typescript
type PropNullable<T> = { [P in keyof T]: T[P] | null };

interface Foo {
  foo: string;
  bar: number;
}

const obj: PropNullable<Foo> = {
  foo: 'foobar',
  bar: null,
};
```

여기서는 타입 변수 `T`를 가진 타입 `PropNullable<T>`를 정의했는데요.

이 타입은 `T` 타입의 객체의 각 프로퍼티 `P`의 타입이 `T[P] | null`, 즉 원래 타입이거나 `null`인 객체의 타입입니다.

구체적으로는 `PropNullable<Foo>`는 `{ foo: string | null; bar: number | null; }`라는 타입이 됩니다.

또한, Mapped 타입에서는 `[P in K]` 부분에 이전에 소개한 수식어(`?`와 `readonly`)를 붙일 수 있는데요. 

예를 들어 다음 타입 `Partial<T>`는 `T`의 모든 프로퍼티를 선택적으로 만든 타입입니다.

이 타입은 편리해서 TypeScript의 표준 라이브러리에 정의되어 있어, 직접 정의하지 않아도 사용할 수 있어요.

모든 프로퍼티를 `readonly`로 만드는 `Readonly<T>`도 있습니다.

```typescript
type Partial<T> = { [P in keyof T]?: T[P] };
```

반대로, 수식어를 제거하는 것도 TypeScript 2.8부터 가능해졌는데요.

이를 위해 `?`나 `readonly` 앞에 `-`를 붙입니다.

예를 들어, 모든 프로퍼티에서 `?`를 제거하는, 일종의 `Partial<T>`의 반대 역할을 하는 `Required<T>`는 다음과 같이 쓸 수 있습니다.

```typescript
type Required<T> = { [P in keyof T]-?: T[P] };
```

사용 예는 이렇습니다. `ReqFoo`에서는 `bar`의 `?`가 사라진 것을 알 수 있어요.

```typescript
interface Foo {
  foo: string;
  bar?: number;
}

/// ReqFoo = { foo: string; bar: number; }
type ReqFoo = Required<Foo>;
```

이 `Required<T>`도 표준 라이브러리에 들어 있습니다.

좀 더 실용적인 예로, 실제로 Mapped 타입을 사용하는 함수를 정의하는 예를 보여드릴게요.

```typescript
function propStringify<T>(obj: T): { [P in keyof T]: string } {
  const result = {} as { [P in keyof T]: string };
  for (const key in obj) {
    result[key] = String(obj[key]);
  }
  return result;
}
```

이 예제에서는 `as`를 사용해 `result`의 타입을 `{ [P in keyof T]: string }`으로 지정한 다음 실제로 하나씩 프로퍼티를 추가하고 있는데요.

`as`나 `any` 등을 사용하지 않고 이 함수를 작성하는 것은 어렵다고 생각합니다.

따라서 Mapped 타입은 함수가 사용되는 쪽의 편의성을 위해 주로 사용되겠죠.

라이브러리의 타입 정의 파일을 작성할 때 등에는 사용할 수도 있습니다.

참고로, Mapped 타입을 인수 위치에 쓸 수도 있습니다.

```typescript
function pickFirst<T>(obj: { [P in keyof T]: Array<T[P]> }): { [P in keyof T]: T[P] | undefined } {
  const result: any = {};
  for (const key in obj) {
    result[key] = obj[key][0];
  }
  return result;
}

const obj = {
  foo: [0, 1, 2],
  bar: ['foo', 'bar'],
  baz: [],
};

const picked = pickFirst(obj);
picked.foo; // number | undefined 타입
picked.bar; // string | undefined 타입
picked.baz; // undefined 타입
```

이 예제의 대단한 점은 `pickFirst`의 타입 인수 `T`를 추론할 수 있다는 것인데요.

`obj`는 `{ foo: number[]; bar: string[]; baz: never[]; }`라는 타입을 가지고 있고, 그것이 `{ [P in keyof T]: Array<T[P]> }`의 부분 타입임을 이용해 `T`를 `{ foo: number; bar: string; baz: never; }`로 추론할 수 있습니다.

이를 다시 Mapped 타입으로 옮겨 반환 타입은 `{ foo: number | undefined; bar: string | undefined; baz: undefined; }`가 됩니다.

참고로 `baz`의 타입은 `never | undefined`지만, `never`는 유니언 타입에서 사라지므로 `undefined`가 됩니다.

Mapped 타입은 이 외에도 다양한 응용이 가능한데요.

실용적인 예로는 `Diff` 타입을 Mapped 타입 등을 사용해 구현할 수 있습니다.

여기까지의 내용을 이해했다면 이 글도 이해할 수 있을 거예요.

## Conditional 타입

위의 Mapped 타입이 도입된 것은 TypeScript 2.1이었는데요,

그 이후로 한동안은 자잘한 개선은 있어도 이해하기 어려운 엄청난 타입이 도입되는 일은 없었습니다.

그런 상황을 깨고, TypeScript 2.8에서 오랜만에 등장한 엄청난 타입이 바로 **Conditional 타입**인데요. 

이는 타입 수준에서 조건 분기가 가능한 타입입니다.

이미 좋은 글이 많이 있으니 참고하셔도 좋지만, 이번 글에서는 한 번에 TypeScript의 타입을 이해하는 것을 목표로 하므로 여기서도 설명하겠습니다.

Conditional 타입은 네 개의 타입을 사용하여 `T extends U ? X : Y`라는 구문으로 표현되는 타입인데요.

일반적인 삼항 연산자를 연상시키는 표기로, 의미도 그 직관에 따릅니다.

즉, 이 타입은 `T`가 `U`의 부분 타입이면 `X`를, 그렇지 않으면 `Y`를 의미합니다.

그런 게 어디에 쓰이냐고 생각할 수 있지만, 사실 이 타입의 표현력은 엄청나서, 해당 Pull Request에서 지적된 것처럼 다양한 문제를 해결할 수 있습니다.

먼저 그것에 대해 조금 설명하겠습니다.

### Mapped 타입의 한계

Mapped 타입이 도입된 당시부터 지적되었던 문제로, 깊은 매핑이 불가능하다는 점이 있었습니다.

앞서 내장된 `Readonly<T>`를 소개했는데요, 이는 프로퍼티를 얕게 `readonly`화합니다.

예를 들어,

```typescript
interface Obj {
  foo: string;
  bar: {
    hoge: number;
  };
}
```

라는 타입에 대해 `Readonly<Obj>`는 `{ readonly foo: string; readonly bar: { hoge: number; }; }`가 됩니다.

즉, `bar` 안의 `hoge`는 `readonly`가 되지 않는데요. 이것도 쓸모가 있을 수 있지만, 중첩된 객체까지 모두 `readonly`로 해주는 것, 즉 `DeepReadonly<T>`가 더 수요가 있었습니다.

조금 생각해 보면, 이는 재귀적인 정의를 해야 한다는 것을 알 수 있습니다.

하지만 다음과 같은 단순한 정의는 잘 작동하지 않습니다.

```typescript
type DeepReadonly<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
};
```

다음과 같이 보면 겉으로는 잘 작동하는 것처럼 보입니다.

```typescript
type DeepReadonly<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
};

interface Obj {
  foo: string;
  bar: {
    hoge: number;
  };
}

type ReadonlyObj = DeepReadonly<Obj>;

const obj: ReadonlyObj = {
  foo: 'foo',
  bar: {
    hoge: 3,
  },
};

// 에러: Cannot assign to 'hoge' because it is a constant or a read-only property.
obj.bar.hoge = 3;
```

하지만 이는 `DeepReadonly<T>`의 `T` 타입이 무엇인지 판명되었기 때문이며, 다음과 같은 상황에서는 잘 작동하지 않습니다.

```typescript
type DeepReadonly<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
};

function readonlyify<T>(obj: T): DeepReadonly<T> {
  // 에러: Excessive stack depth comparing types 'T' and 'DeepReadonly<T>'.
  return obj as DeepReadonly<T>;
}
```

즉, 그런 단순한 재귀로는 일반적인 `T`에 대해 끝없이 Mapped 타입을 펼치게 되어, 이를 방지하기 위해 Conditional 타입이 필요한 것입니다.

### Conditional 타입을 이용한 `DeepReadonly<T>`

그렇다면 Conditional 타입을 사용한 `DeepReadonly<T>`를 [여기](https://github.com/Microsoft/TypeScript/pull/21316)에서 인용해 보겠습니다.

```typescript
type DeepReadonly<T> =
    T extends any[] ? DeepReadonlyArray<T[number]> :
    T extends object ? DeepReadonlyObject<T> :
    T;

interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}

type DeepReadonlyObject<T> = {
    readonly [P in NonFunctionPropertyNames<T>]: DeepReadonly<T[P]>;
};

type NonFunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? never : K }[keyof T];
```

`DeepReadonly<T>`가 Conditional 타입이 되어 있는데요, `T`가 배열인 경우, 배열이 아닌 객체인 경우, 그 외의 경우(즉, 프리미티브인 경우)로 분기하고 있습니다.

배열인 경우는 `DeepReadonlyArray<T>`로 처리하고, 그 외의 객체는 `DeepReadonlyObject<T>`로 처리합니다.

프리미티브인 경우는 그 프로퍼티를 고려할 필요가 없으므로 그냥 `T`를 반환합니다.

`DeepReadonlyArray<T>`는 요소의 타입인 `T`를 `DeepReadonly<T>`로 재귀적으로 처리하고, 배열 자체의 타입은 `ReadonlyArray<T>`로 표현합니다.

`ReadonlyArray<T>`는 표준 라이브러리에 있는 타입으로, 각 요소가 `readonly`인 배열입니다.

`T[number]`는 배열인 `T`에 대해 `number` 타입의 프로퍼티 이름으로 접근할 수 있는 프로퍼티의 타입이므로, 즉 배열 `T`의 요소의 타입이죠.

`DeepReadonlyObject<T>`는 위의 단순한 경우와 마찬가지로 Mapped 타입을 사용해 각 프로퍼티를 처리하고 있습니다.

다만, `NonFunctionPropertyNames<T>`는 `T`의 프로퍼티 이름 중 함수가 아닌 것을 의미합니다.

자세히 보면 이것도 Conditional 타입으로 구현되어 있는데요. 아까 소개한 `Diff`와 아이디어는 같지만, Conditional 타입으로 더 간단히 쓸 수 있습니다.

즉, 이 `DeepReadonlyObject<T>`는 사실 `T`에서 메서드(함수인 프로퍼티)를 제거합니다.

이를 통해 메서드가 자기를 수정할 가능성을 배제하고 있는 거죠.

사실 `DeepReadonly<T>`의 본질은 Conditional 타입이 지연 평가된다는 데 있습니다. 

`DeepReadonly<T>`의 분기 조건은 `T`가 무엇인지 알 수 없으면 판정할 수 없으므로 필연적으로 그렇게 되는데요. 이를 통해 평가 시에 무한히 재귀하는 것을 방지합니다.

시험해 본 결과,

```typescript
type List<T> = {
  value: T;
  next: List<T>;
} | undefined;
```

와 같은 재귀적인 타입에도 `DeepReadonly<T>`를 적용할 수 있었습니다.

### Conditional 타입에서의 타입 매칭

사실 Conditional 타입에는 더 강력한 기능이 있습니다. 그것은 Conditional 타입의 조건부에서 새로운 타입 변수를 도입할 수 있다는 것인데요.

[여기](https://github.com/Microsoft/TypeScript/pull/21496)에서 예제를 인용합니다.

```typescript
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : T;
```

`ReturnType<T>`는 `T`가 함수 타입일 때, 그 반환 타입이 됩니다.

포인트는 함수 타입의 반환 타입 부분에 있는 `infer R`인데요.

이렇게 `infer` 키워드를 사용하여 Conditional 타입의 조건부에서 타입 변수를 도입할 수 있습니다.

도입된 타입 변수는 분기의 `then` 쪽에서 사용할 수 있게 됩니다.

즉, 이 `ReturnType<T>`는 `T`가 `(...args: any[]) => R`(의 부분 타입)일 때 `R`로 평가된다는 것입니다.

`then` 쪽에서만 타입 변수를 쓸 수 있는 것은 `else` 쪽에서는 `T`가 `(...args: any[]) => R` 형태가 아닐 수도 있으므로 당연하죠.

이로부터 알 수 있듯이, 이 기능은 타입에 대한 패턴 매칭으로 볼 수 있습니다.

사실 동일한 타입 변수에 대한 `infer`가 여러 곳에 나타날 수도 있습니다.

그 경우 추론된 타입 변수에 유니언 타입이나 인터섹션 타입이 들어갈 수도 있는데요.

인위적인 예지만 다음 예제로 확인할 수 있습니다.

```typescript
type Foo<T> = 
    T extends { 
        foo: infer U;
        bar: infer U;
        hoge: (arg: infer V) => void;
        piyo: (arg: infer V) => void;
    } ? [U, V] : never;

interface Obj { 
    foo: string;
    bar: number;
    hoge: (arg: string) => void;
    piyo: (arg: number) => void;
}

declare let t: Foo<Obj>; // t의 타입은 [string | number, string & number]
```

부분 타입 관계를 생각해 보면, `U`가 유니언 타입으로 표현되고 `V`가 인터섹션 타입으로 표현되는 이유를 알 수 있습니다.

`U`는 공변(covariant) 위치에, `V`는 반공변(contravariant) 위치에 나타나기 때문입니다.

참고로 시험삼아 양쪽 위치에 나타나게 해보면 `Foo<Obj>`가 해결되지 않게 됩니다.

덧붙여, `ReturnType<T>` 등 Conditional 타입을 사용한 타입이 몇 가지 표준 라이브러리에 내장될 예정인 것 같습니다.

직접 Conditional 타입과 싸우지 않아도 혜택을 받을 수 있는 경우가 많을 거예요.

## Conditional 타입에 의한 문자열 조작

`infer`와 템플릿 리터럴 타입을 조합하면, 타입 수준에서 문자열 조작이 가능해집니다.

예를 들어 `"Hello, world!"`라는 리터럴 타입에서 `world` 부분을 추출하려면 다음과 같이 합니다.

```typescript
type ExtractHelloedPart<S extends string> = S extends `Hello, ${infer P}!` ? P : unknown;

// type T1 = "world"
type T1 = ExtractHelloedPart<"Hello, world!">; 
// type T2 = unknown
type T2 = ExtractHelloedPart<"Hell, world!">;
```

TypeScript 4.1의 릴리스 전후로는 이를 활용해 타입 레벨 파서나 타입 레벨 인터프리터 등의 다양한 작품이 만들어졌는데요.

매우 큰 가능성을 지닌 기능입니다.

## 마무리

TypeScript의 타입을 한 번 소개해 봤는데요.

이번에는 입문 글이므로 생략한 부분도 있습니다.

특히, `this` 타입 등은 평소에 잘 안써서 잊어버린거 같습니다.

타입 시스템이 강한 언어는 많지만, TypeScript의 타입 시스템은 JavaScript에 타입을 붙인다는 난제에 대한 답으로, 그들과는 다른 면이 있습니다.

---
