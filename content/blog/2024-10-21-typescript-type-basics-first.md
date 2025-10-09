---
slug: 2024-10-21-typescript-type-basics-first
title: TypeScript 타입 기초 완전 정복! 1편 - 프리미티브, 객체, 함수, 배열
date: 2024-10-21 11:53:56.054000+00:00
summary: TypeScript 타입 시스템의 기본기를 다지는 1편! 프리미티브 타입부터 객체, 함수, 배열까지, TypeScript 타입 시스템의 핵심 개념을 쉽고 명확하게 설명합니다.
tags: ["TypeScript", "타입스크립트", "타입", "기초", "초보자", "객체"]
contributors: []
draft: false
---

안녕하세요?

오늘은 TypeScript의 타입(Type) 시스템에 대해 좀 더 깊게 공부해 볼까 합니다.

TypeScript는 JavaScript에 타입을 추가하여 코드의 안정성과 유지보수성을 높여주는 아주 좋은 언어인데요.

타입스크립트 자체가 너무 어려워, 초보자도 이해하기 쉽도록 TypeScript 문법 설명 없이 타입 개념에 집중하고자 합니다.

복잡한 고급 타입은 다루지 않고, 기본적인 타입 개념을 알아보도록 하겠습니다.

전체 강좌 링크는 아래와 같습니다.

1. [TypeScript 타입 기초 완전 정복! 1편 - 프리미티브, 객체, 함수, 배열](https://mycodings.fly.dev/blog/2024-10-21-typescript-type-basics-first)

2. [TypeScript 타입 기초 완전 정복! 2편 - 제네릭, 튜플, 유니언, never, 교차 타입](https://mycodings.fly.dev/blog/2024-10-21-typescript-type-advanced-second)

3. [TypeScript 타입 기초 완전 정복! 3편 - as const, unknown, Mapped, Conditional 타입 완벽 분석](https://mycodings.fly.dev/blog/2024-10-21-typescript-type-master-third)

---

** 목 차 **

- [1편](#1편)
- [TypeScript의 타입(Type) 완전 정복 1편: 기본 타입부터 제네릭, 유니온 타입까지!](#typescript의-타입type-완전-정복-1편-기본-타입부터-제네릭-유니온-타입까지)
- [프리미티브(primitive) 타입](#프리미티브primitive-타입)
- [리터럴(literal) 타입](#리터럴literal-타입)
- [객체 타입](#객체-타입)
- [배열(array) 타입](#배열array-타입)
- [함수 타입](#함수-타입)
  - [함수의 부분 타입 관계](#함수의-부분-타입-관계)
  - [가변 인자](#가변-인자)
- [void 타입](#void-타입)
- [any 타입](#any-타입)
- [클래스 타입](#클래스-타입)

---

## 프리미티브(primitive) 타입

TypeScript의 프리미티브 타입은 JavaScript의 기본 데이터 타입과 거의 일치합니다.

단순히 값을 저장하는 가장 기본적인 타입이라고 생각하면 됩니다.

자바스크립트를 이미 아신다면, TypeScript의 프리미티브 타입은 익숙할 겁니다.

다음은 주요 프리미티브 타입과 간단한 설명입니다:

* **string**: 문자열 (예: hello, world )
* **number**: 숫자 (예: 10, 3.14, -5 )  JavaScript와 마찬가지로 정수와 실수를 구분하지 않습니다.
* **boolean**: 불리언 값 (예: true, false)
* **symbol**: 고유한 값을 생성하는 데 사용되는 심볼 (JavaScript의 Symbol과 동일)
* **bigint**: 매우 큰 정수를 표현하는 데 사용되는 타입 (JavaScript의 BigInt와 동일)
* **null**:  값이 없음을 나타내는 특수한 값. `--strictNullChecks` 옵션에 따라 동작이 달라집니다.
* **undefined**: 변수가 선언되었지만 값이 할당되지 않았음을 나타내는 특수한 값. 마찬가지로, `--strictNullChecks` 옵션에 따라 동작이 달라집니다.

**`--strictNullChecks` 옵션의 중요성:**

`--strictNullChecks` 옵션은 TypeScript 컴파일러의 매우 중요한 옵션입니다.

이 옵션을 켜면,  null 과 undefined 를 다른 타입으로 취급하여,  number 타입의 변수에 null이나 undefined를 대입할 수 없습니다.

예를 들어,  `--strictNullChecks` 옵션이 **켜져 있는 경우**:

```typescript
let myNumber: number; // 선언만 하고 값을 할당하지 않았으므로, myNumber는 undefined입니다.
myNumber = 10; // 정상
myNumber = null; // 오류!  number 타입에는 null을 할당할 수 없습니다.
myNumber = undefined; // 오류! number 타입에는 undefined를 할당할 수 없습니다.
```

`--strictNullChecks` 옵션이 **꺼져 있는 경우**:

```typescript
let myNumber: number;
myNumber = 10; // 정상
myNumber = null; // 정상 (경고는 발생할 수 있으나, 오류는 아님)
myNumber = undefined; // 정상 (경고는 발생할 수 있으나, 오류는 아님)
```

`--strictNullChecks` 옵션을 켜는 것이 권장되는 이유는,  null 과 undefined 의 예상치 못한 사용으로 인한 오류를 미리 방지하기 위해서입니다.

옵션을 켜면, 컴파일 시점에 이러한 오류를 잡아낼 수 있으므로,  런타임 오류를 줄이고 코드의 안정성을 높일 수 있습니다.

따라서,  TypeScript 프로젝트에서는 항상 이 옵션을 켜두는 것이 좋습니다.

참고로, tsconfig.json 파일에서 strict 속성은 여러 개의 엄격한 타입 검사 옵션을 한 번에 활성화하는 **약식 표현**입니다.

`strict: true` 로 설정하면,  다음 옵션들이 자동으로 true로 설정됩니다.

* strictNullChecks: null과 undefined에 대한 엄격한 검사를 활성화합니다.
* noImplicitAny: any 타입의 암시적 사용을 금지합니다.
* noImplicitThis: this 키워드의 암시적 타입을 금지합니다.
* alwaysStrict: 모든 JavaScript 파일에서 `use strict`; 를 사용하도록 합니다.
* noUnusedLocals: 사용되지 않은 지역 변수에 대한 경고를 표시합니다.
* noUnusedParameters: 사용되지 않은 함수 매개변수에 대한 경고를 표시합니다.
* noImplicitReturns: 함수에서 모든 경로가 값을 반환하도록 합니다.
* noFallthroughCasesInSwitch: switch 문에서 case 문이 break 또는 return으로 끝나지 않으면 경고를 표시합니다.

따라서, tsconfig.json 에서 `strict: true` 로 설정하는 것은 `strictNullChecks: true` 를 설정하는 것과 **동일한 효과**를 갖습니다.

strict 속성을 사용하면 위에 나열된 모든 엄격한 옵션들을 한꺼번에 설정할 수 있어 편리합니다.

하지만,  필요에 따라 개별 옵션들을 따로 설정해서 조정할 수도 있습니다.

`strict: true`로 설정하면 편리하지만, 각 옵션의 의미를 이해하고 필요에 따라 조정하는 것이 더 나은 코드를 작성하는 데 도움이 될 수 있습니다.

---

## 리터럴(literal) 타입

TypeScript의 리터럴(literal) 타입은 매우 간단한 개념입니다.

핵심은 **값 자체가 타입이 된다**는 것입니다.

예를 들어,  `hello` 라는 문자열은 단순히 문자열 값이 아니라, `hello` 라는 **특정 문자열만 허용하는 타입**이 됩니다. 

`3` 이라는 숫자도 마찬가지로, `3` 이라는 **특정 숫자만 허용하는 타입**입니다.

따라서,  `const myString: hello = hello;`  는  `hello` 라는 문자열 값을 가진 변수 `myString`을 선언하는 것인데,  여기서 중요한 것은  `myString` 에는 **오직 `"hello"` 만 대입할 수 있다**는 것입니다.

`Hello`, `world`,  아무 다른 문자열도 안됩니다.

타입 오류가 발생합니다.

이것이 리터럴 타입의 전부입니다. 

`foo`, `3`, `true` 등은 각각 그 값 자체를 유일한 값으로 허용하는 타입입니다.

문자열 리터럴 타입, 숫자 리터럴 타입, 불리언 리터럴 타입이라고 부르는 것은 단지 그 값의 종류(문자열, 숫자, 불리언)를 나타낼 뿐입니다.

**`const` vs `let` / `var` 의 차이:**

`const` 키워드를 사용하면, 변수에 값이 한 번 할당된 후에는 변경할 수 없습니다.

TypeScript는 이 점을 이용하여, `const`로 선언된 변수에 리터럴 값을 할당하면 그 변수의 타입을 해당 리터럴 타입으로 추론합니다.  

변경될 수 없으니, 그 리터럴 값만 허용하는, 매우 엄격한 타입 체크가 가능해지는 것입니다.

반면, `let`이나 `var`를 사용하면, 변수의 값을 나중에 변경할 수 있습니다.

TypeScript는 이러한 변수의 타입을 리터럴 타입으로 추론하지 않고, 더 일반적인 타입(예: `string`, `number`, `boolean`)으로 추론합니다.

값이 변경될 수 있으므로, 특정 리터럴 값만 허용하는 엄격한 타입 체크는 불필요하고 오히려 불편하기 때문입니다.

**요약:**

* 리터럴 타입: 특정 값 자체가 타입이 되는 것.
* `const`: 리터럴 타입을 사용할 수 있게 해줌 (값이 변경되지 않으므로 가능).
* `let`/`var`: 일반적인 타입을 사용 (값이 변경될 수 있으므로 리터럴 타입 사용 불가, 또는 명시적으로 타입 지정해야 함).

---

## 객체 타입

TypeScript에서 객체 타입은 JavaScript의 객체와 마찬가지로 여러 프로퍼티(key-value 쌍)를 가진 데이터 구조를 나타냅니다.

하지만 TypeScript는 각 프로퍼티의 타입까지 명시적으로 정의할 수 있다는 점이 다릅니다.

이를 통해 런타임 오류를 줄이고 코드의 신뢰성을 높일 수 있습니다.

**객체 타입 정의:**

객체 타입은 중괄호 `{}` 안에 프로퍼티 이름과 콜론 `:` 뒤에 해당 프로퍼티의 타입을 나열하여 정의합니다.

예를 들어, `foo`라는 문자열 프로퍼티와 `bar`라는 숫자 프로퍼티를 가진 객체 타입은 다음과 같이 정의합니다.

```typescript
{ foo: string, bar: number }
```

이 타입을 가진 변수에는 `foo` 프로퍼티가 문자열이고 `bar` 프로퍼티가 숫자인 객체만 할당할 수 있습니다.

다른 타입의 값이나 프로퍼티가 누락된 객체를 할당하려고 하면 TypeScript 컴파일러가 오류를 발생시킵니다.

**`interface` 키워드:**

`interface` 키워드를 사용하면 객체 타입에 이름을 지정할 수 있습니다.

이것은 코드의 가독성을 높이고 재사용성을 향상시킵니다.

위의 예시를 `interface`를 사용하여 정의하면 다음과 같습니다.

```typescript
interface MyObject {
  foo: string;
  bar: number;
}

const myObject: MyObject = { foo: "hello", bar: 123 };
```

**구조적 부분 타입 (Structural Subtyping):**

TypeScript는 구조적 부분 타입을 지원합니다.

이는 객체 타입의 일부 프로퍼티만 일치하더라도 타입 호환성을 허용하는 것을 의미합니다.

예를 들어, 다음과 같이 `MyObject` 타입의 객체를 `MyObject2` 타입의 변수에 할당할 수 있습니다.

```typescript
interface MyObject {
  foo: string;
  bar: number;
}

interface MyObject2 {
  foo: string;
}

const myObject: MyObject = { foo: "hello", bar: 123 };
const myObject2: MyObject2 = myObject; // 이것은 유효합니다.
```

`MyObject2`는 `foo` 프로퍼티만 정의하고 있지만, `MyObject`는 `foo` 프로퍼티를 가지고 있으므로 할당이 가능합니다.

`MyObject`는 `MyObject2`의 **부분 타입** (subtype)이라고 합니다.

**객체 리터럴과 여분의 프로퍼티:**

하지만, 객체 *리터럴*을 직접 사용하여 `MyObject2` 타입의 변수에 할당할 때는 주의해야 합니다.

객체 리터럴에 `MyObject2` 타입에 정의되지 않은 여분의 프로퍼티가 있으면 오류가 발생합니다.

```typescript
const myObject2: MyObject2 = { foo: "hello", bar: 123 }; // 오류!  'bar'는 MyObject2에 없습니다.
```

이는 TypeScript가 객체 리터럴에 대해 더 엄격한 타입 검사를 수행하기 때문입니다.

변수에 할당하는 경우에는 구조적 부분 타입을 적용하지만, 객체 리터럴 자체는 정확히 타입 정의에 맞아야 합니다.

여분의 프로퍼티가 필요하다면, 먼저 변수에 할당한 후 사용해야 합니다.

**함수 매개변수:**

함수 매개변수에도 동일한 원칙이 적용됩니다.

함수가 특정 객체 타입을 매개변수로 받는 경우, 매개변수로 전달하는 객체 리터럴은 해당 타입에 정의된 프로퍼티만 포함해야 합니다.

```typescript
interface MyObj2 {
  foo: string;
}

// 오류:
// Argument of type '{ foo: string; bar: number; }' is not assignable to parameter of type 'MyObj2'.
//  Object literal may only specify known properties, and 'bar' does not exist in type 'MyObj2'.
func({foo: 'foo', bar: 3});

function func(obj: MyObj2): void {
}
```

요약하면, TypeScript의 객체 타입은 JavaScript 객체에 타입을 부여하여 안전하고 예측 가능한 코드를 작성할 수 있도록 도와줍니다.

`interface`를 사용하여 객체 타입을 정의하고, 구조적 부분 타입을 이해하는 것이 중요하며, 객체 리터럴을 사용할 때는 여분의 프로퍼티에 주의해야 합니다.

이러한 개념을 잘 이해하면 TypeScript를 사용하여 더욱 안전하고 효율적인 코드를 작성할 수 있습니다.

---

## 배열(array) 타입

TypeScript에서 배열 타입은 JavaScript의 배열을 나타내지만, 각 요소의 타입을 명시적으로 지정할 수 있다는 점이 다릅니다.

이를 통해 배열에 잘못된 타입의 데이터가 추가되는 것을 방지하고, 코드의 안전성을 높일 수 있습니다.

**배열 타입 표현:**

TypeScript에서는 배열 타입을 두 가지 방법으로 표현할 수 있습니다.

1. **`타입[]`:**  이 방법은 배열 요소의 타입 뒤에 `[]`를 붙여 표현합니다.  예를 들어, 숫자형 배열은 `number[]`로, 문자열형 배열은 `string[]`로 표현합니다.

   ```typescript
   let numberArray: number[] = [1, 2, 3];
   let stringArray: string[] = ["hello", "world"];
   ```

2. **`Array<타입>`:** 이 방법은 `Array`라는 제네릭 타입을 사용하여 배열 요소의 타입을 지정합니다.  제네릭은 나중에 자세히 설명하겠지만,  간단히 말해 타입을 매개변수처럼 다룰 수 있게 해주는 기능입니다.  위의 예시를 제네릭을 사용하여 표현하면 다음과 같습니다.

   ```typescript
   let numberArray: Array<number> = [1, 2, 3];
   let stringArray: Array<string> = ["hello", "world"];
   ```

두 가지 방법은 모두 동일한 의미를 가지며,  개발자의 선호도에 따라 선택하여 사용할 수 있습니다.

`타입[]` 표기법이 더 간결하고 흔히 사용됩니다.

**타입 안정성:**

TypeScript 컴파일러는 배열 타입을 사용하여 배열에 잘못된 타입의 데이터가 추가되는 것을 방지합니다.

예를 들어, `number[]` 타입의 배열에는 숫자만 추가할 수 있으며, 문자열을 추가하려고 하면 컴파일러가 오류를 발생시킵니다.

```typescript
let numberArray: number[] = [1, 2, 3];
numberArray.push(4); // 정상
numberArray.push("4"); // 오류!  string 타입은 number[]에 추가할 수 없습니다.
```

**다양한 타입의 요소를 가진 배열:**

배열의 요소가 여러 타입일 수 있는 경우에는 `any[]`를 사용할 수 있습니다. 하지만 `any[]`는 타입 안전성을 보장하지 않으므로, 가능하면  튜플(tuple)이나 유니온 타입(union type)을 사용하여 더욱 정확한 타입을 지정하는 것이 좋습니다.

(튜플과 유니온 타입은 나중에 자세히 설명하겠습니다.)

**요약:**

TypeScript의 배열 타입은 JavaScript 배열의 타입 안전 버전입니다.

`타입[]` 또는 `Array<타입>`을 사용하여 배열 요소의 타입을 명시적으로 지정할 수 있으며, 이를 통해 런타임 오류를 방지하고 코드의 신뢰성을 높일 수 있습니다.

`any[]`는 편리하지만 타입 안전성을 희생하므로, 가능하면 더욱 구체적인 타입을 사용하는 것이 좋습니다.

---

## 함수 타입

JavaScript, 더 나아가 대부분의 프로그래밍 언어에서 중요한 개념으로 함수가 있습니다.

TypeScript에도 당연히 함수의 타입, 즉 함수 타입이 있는데요.

함수 타입은 예를 들어 `(foo: string, bar: number) => boolean`과 같이 표현됩니다.

이는 첫 번째 인수로 `string` 타입을, 두 번째 인수로 `number` 타입의 인수를 받아, 반환값으로 `boolean` 타입의 값을 반환하는 함수의 타입입니다.

타입에 인수의 이름이 적혀 있지만, 이는 타입의 일치 등의 판정에는 영향을 주지 않습니다.

따라서 `(foo: number) => string` 타입의 값을 `(arg1: number) => string` 타입의 변수에 할당하는 것은 문제가 없습니다.

**함수 타입의 기본 구조:**

함수 타입은 다음과 같은 구조로 표현됩니다.

`(매개변수1: 타입1, 매개변수2: 타입2, ... ) => 반환값타입`

* **매개변수:** 함수가 받는 매개변수의 이름과 타입을 지정합니다.  매개변수 이름은 타입 검사에는 영향을 주지 않습니다.
* **`=>`:** 매개변수 목록과 반환값 타입을 구분하는 기호입니다.
* **반환값타입:** 함수가 반환하는 값의 타입을 지정합니다.  `void`는 아무 값도 반환하지 않음을 의미합니다.


**예시:**

```typescript
// 문자열을 받아 숫자를 반환하는 함수 타입
let myFunc: (str: string) => number;

// 숫자 두 개를 받아 boolean 값을 반환하는 함수 타입
let anotherFunc: (num1: number, num2: number) => boolean;
```

**함수 타입과 변수:**

함수 타입을 변수에 할당할 수 있습니다.

함수 타입과 일치하는 함수만 할당할 수 있습니다.

```typescript
function myFunc(str: string): number {
  return parseInt(str, 10);
}

let myFuncVar: (str: string) => number = myFunc; // 정상
```

### 함수의 부분 타입 관계

* **매개변수:**  매개변수 타입이 더 엄격해지면, 부분 타입 관계가 성립합니다.
* 
* 즉, 더 제한적인 매개변수 타입을 받는 함수는 더 넓은 매개변수 타입을 받는 함수의 부분 타입이 됩니다.

```typescript
interface MyObj {
  foo: string;
  bar: number;
}

interface MyObj2 {
  foo: string;
}

const a: (obj: MyObj2) => void = () => {};
const b: (obj: MyObj) => void = a;
```

이 예제에서 보이듯이, `(obj: MyObj2) => void` 타입의 값을 `(obj: MyObj) => void` 타입의 값으로 취급할 수 있습니다.

이는 `MyObj`가 `MyObj2`의 부분 타입이므로, `MyObj2`를 받아 처리할 수 있는 함수는 `MyObj`를 받아도 당연히 처리할 수 있을 것이라는 의미입니다.

`a`와 `b`의 타입을 반대로 하면 당연히 에러가 발생합니다.

또한, 함수의 경우 매개변수의 수에 관해서도 부분 타입 관계가 발생합니다.

```typescript
const f1: (foo: string) => void = () => {};
const f2: (foo: string, bar: number) => void = f1;
```

이처럼 `(foo: string) => void` 타입의 값을 `(foo: string, bar: number) => void` 타입의 값으로 사용할 수 있습니다.

즉, 인수를 하나만 받는 함수는 인수를 두 개 받는 함수로서 사용할 수 있다는 것인데요.

이는 함수 측에서 여분의 인수를 무시하면 되기 때문에 자연스럽습니다.

하지만 함수를 호출하는 측에서 여분의 인수를 붙여서 호출하는 것은 불가능하니 주의하십시요.

이는 앞의 객체 리터럴 예제와 마찬가지로 실수를 방지하기 위한 것입니다.

```typescript
const f1: (foo: string) => void = () => {};

// 오류: Expected 1 arguments, but got 2.
f1('foo', 3);
```

### 가변 인자

JavaScript에는 가변 인자라는 기능이 있습니다.

이는 `(foo, ...bar) => bar`와 같이 마지막 인수를 `...bar`로 하면, 그 이후(이 함수의 경우 2번째 이후)의 인수가 모두 담긴 배열이 `bar`에 전달되는 것입니다.

```javascript
const func = (foo, ...bar) => bar;

console.log(func(1, 2, 3)); // [2, 3]
```

TypeScript에서도 가변 인자의 함수를 선언할 수 있는데요.

이때 가변 인자 부분의 타입은 배열로 지정합니다.

다음 예제에서는 `...bar`에 `number[]` 타입이 붙어 있으므로, 두 번째 이후의 인수는 모두 숫자여야 합니다.

```typescript
const func = (foo: string, ...bar: number[]) => bar;

func('foo');
func('bar', 1, 2, 3);
// 오류: Argument of type '"hey"' is not assignable to parameter of type 'number'.
func('baz', 'hey', 2, 3);
```

---

## void 타입

앞에서 아무렇지 않게 `void`라는 타입이 나왔는데요, 이에 대해 설명해 볼까 합니다.

이 타입은 주로 함수의 반환 타입으로 사용되며, "아무것도 반환하지 않는다"라는 것을 의미합니다.

JavaScript에서는 아무것도 반환하지 않는 함수(`return` 문이 없거나, 반환값이 없는 `return` 문을 사용하는 함수)는 `undefined`를 반환하게 됩니다.

따라서 `void` 타입은 `undefined`만을 값으로 취하는 타입이 됩니다.

실제로 `void` 타입의 변수에 `undefined`를 넣을 수 있는데요.

하지만 그 반대는 불가능합니다.

즉, `void` 타입의 값을 `undefined` 타입의 변수에 할당할 수는 없습니다.

```typescript
const a: void = undefined;

// 오류: Type 'void' is not assignable to type 'undefined'.
const b: undefined = a;
```

이런 동작은 `void` 타입을 반환하는 함수는 어디까지나 아무것도 반환하지 않는 함수이기 때문에, 그 값을 활용할 수 없다는 의도가 담겨 있다고 생각됩니다.

`void` 타입의 사용처는 역시 함수의 반환 타입인데요.

아무것도 반환하지 않는 함수의 반환 타입으로 `void` 타입을 사용합니다.

`void` 타입은 어느 정도 특수한 타입이며, 반환 타입이 `void`인 함수는 값을 반환하지 않아도 됩니다.

반대로, 그 외의 타입인 경우(`any` 타입을 제외하고)는 반드시 반환값을 반환해야 합니다.

```typescript
function foo(): void {
  console.log('hello');
}

// 오류: A function whose declared type is neither 'void' nor 'any' must return a value.
function bar(): undefined {
  console.log('world');
}
```

참고로, 큰 의미는 없지만 `undefined`를 `void` 타입의 값으로 취급할 수 있기 때문에, `void` 타입을 반환하는 함수에 `return undefined;`라고 쓸 수 있습니다.

---

## any 타입

`void` 타입에서 `any` 타입이라는 말이 나왔으니, 일단 여기서 공부하고 지나가겠습니다.

`any` 타입은 무엇이든 가능한 타입으로, 은유적으로는 프로그래머의 패배를 의미합니다.

`any` 타입의 값은 어떤 타입과도 상호 변환이 가능하며, 사실상 TypeScript의 타입 시스템을 무시하는 것과 같습니다.

```typescript
const a: any = 3;
const b: string = a;
```

이 예제에서 변수 `a`는 `any` 타입의 변수이기 때문에 어떤 값도 할당할 수 있습니다.

또한 `any` 타입의 값은 어떤 타입의 값으로도 사용할 수 있으므로, `any` 타입의 값을 가진 `a`를 `string` 타입의 변수 `b`에 할당할 수 있습니다.

위의 프로그램을 보면 최종적으로 숫자가 `string` 타입의 값에 들어가게 됩니다.

이렇게 `any` 타입을 사용하면 타입 시스템을 속일 수 있으며, TypeScript를 사용하는 의미가 희미해집니다.

따라서 `any` 타입은 불가피한 상황에서만 사용하는 것이 좋습니다.

---

## 클래스 타입

JavaScript에는 클래스를 정의할 수 있는데요.

TypeScript에서는 클래스를 정의하면 동시에 동일한 이름의 타입도 정의됩니다.

```typescript
class Foo {
  method(): void {
    console.log('Hello, world!');
  }
}

const obj: Foo = new Foo();
```

이 예제에서는 클래스 `Foo`를 정의함으로써 `Foo`라는 타입도 동시에 정의되었습니다.

`Foo`는 클래스 `Foo`의 인스턴스 타입입니다.

위 예제의 마지막 문장은 `Foo`가 두 종류여서 헷갈릴 수 있는데요, `obj: Foo`의 `Foo`는 타입 이름 `Foo`이고, `new Foo()`의 `Foo`는 클래스(생성자)의 실체로서의 `Foo`입니다.

주의할 점은 TypeScript는 어디까지나 구조적 타입 시스템을 채택하고 있다는 것입니다.

JavaScript의 실행 시에는 어떤 객체가 특정 클래스의 인스턴스인지 여부는 프로토타입 체인을 통해 특징지어지지만, TypeScript의 타입 세계에서는 그렇지 않습니다.

구체적으로, 여기서 정의된 타입 `Foo`는 다음과 같은 객체 타입으로 대체 가능합니다.

```typescript
interface MyFoo {
  method: () => void;
}

class Foo {
  method(): void {
    console.log('Hello, world!');
  }
}

const obj: MyFoo = new Foo();
const obj2: Foo = obj;
```

여기서 `MyFoo`라는 타입을 정의했습니다.

이는 `method`라는 함수 타입의 프로퍼티(즉, 메서드)를 가진 객체의 타입입니다.

사실 `Foo` 타입은 이 `MyFoo` 타입과 동일합니다.

클래스 `Foo`의 정의에서 알 수 있듯이, `Foo`의 인스턴스, 즉 `Foo` 타입의 값의 특징은 `method`라는 프로퍼티를 가진다는 것입니다.

따라서 그 특징을 객체 타입으로 표현한 `MyFoo` 타입과 동일하다고 볼 수 있는 거죠.

---

2편에서 계속 이어서...

---