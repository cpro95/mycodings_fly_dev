---
slug: 2024-11-09-typescript-intermediate-type-exercises
title: TypeScript 중급자를 위한 실전 타입 문제 및 해답
date: 2024-11-09 03:56:11.762000+00:00
summary: TypeScript 중급 레벨을 위한 실전 문제 모음으로, 다양한 타입 관련 문제를 풀어보며 타입스크립트의 이해도를 높여보세요. 함수 타입, 제네릭, 선택적 프로퍼티 등 실제 개발에서 자주 마주치는 문제들을 해결해보세요.
tags: ["typescript", "TypeScript 연습문제", "TypeScript 중급", "TypeScript 타입", "TypeScript 문제풀이", "프로그래밍 연습", "TypeScript 제네릭"]
contributors: []
draft: false
---

## TypeScript의 타입 연습

이 글은 TypeScript의 타입을 잘 다루기 위한 연습으로, TypeScript의 타입과 관련된 연습 문제를 제공합니다.

풀어보며 자신의 TypeScript 능력을 확인해 보세요.

문제의 레벨은 필자의 기존 글 **TypeScript의 타입 입문**, **TypeScript의 타입 초급**을 완전히 이해한 사람이라면 모두 풀 수 있다는 가정하에 만들어졌습니다.

해당 글을 읽지 않은 분들이 실력 테스트로 풀어보셔도 괜찮습니다.

또한 글을 읽었지만 완전히 이해하지 못한 경우에도 안심하세요. 풀 수 있는 문제가 있으니 꼭 도전해 보세요.

---

### 1-1. 함수에 타입을 붙여보자

다음 함수 `isPositive`는 숫자를 받아서 0 이상이면 `true`, 0 미만이면 `false`를 반환하는 함수입니다.

이 함수에 올바른 타입 애노테이션을 붙여주세요.

타입 애노테이션이란, 인수나 반환값의 타입을 소스 코드에 명시하는 것입니다.

```typescript
function isPositive(num) {
    return num >= 0;
}

// 사용 예
isPositive(3);

// 에러 예
isPositive('123');
const numVar: number = isPositive(-5);
```

### 정답

```typescript
function isPositive(num: number): boolean {
    return num >= 0;
}
```

함수의 인자에 `: number`를 추가했는데요.

이게 바로 인자에 대한 타입 어노테이션입니다.

TypeScript에서는 함수의 인자 타입을 명시적으로 지정하는 것이 기본입니다.

만약 타입을 지정하지 않으면 에러가 발생할 수 있는데요, 이는 `--noImplicitAny` 옵션 덕분입니다.

하지만 1-3 문제처럼 문맥을 통해 타입을 추론할 수 있는 경우라면, 인자의 타입 어노테이션을 생략해도 괜찮습니다.

또한, 함수에는 이렇게 반환값에 대한 타입 어노테이션(`: boolean`)도 지정할 수 있는데요.

하지만 반환값에 대해서는 함수의 정의로부터 TypeScript가 알아서 추론해줍니다.

이번 예시에서는 `num >= 0`이 반환값이고, 이 값의 타입이 `boolean`임을 추론할 수 있습니다.

타입 어노테이션이 뭔지 잘 몰랐던 분들은 이번 기회에 확실히 이해하시면 좋겠네요.

### 다른 해답

```typescript
function isPositive(num: number) {
    return num >= 0;
}
```

앞서 설명한 것처럼 TypeScript는 반환값의 타입을 추론할 수 있기 때문에, 이렇게 간단한 함수에서는 굳이 `: boolean`이라고 명시할 필요가 없을 수도 있습니다.

---

### 1-2. 객체의 타입

한 명의 사용자 데이터를 나타내는 객체는 `name` 프로퍼티, `age` 프로퍼티, 그리고 `private` 프로퍼티를 가지고 있습니다.

`name`은 문자열, `age`는 숫자, `private`는 불리언입니다.

사용자 데이터 객체의 타입 `User`를 정의해주세요.

```typescript
function showUserInfo(user: User) {
    // 생략
}

// 사용 예
showUserInfo({
    name: 'John Smith',
    age: 16,
    private: false,
});

// 에러 예
showUserInfo({
    name: 'Mary Sue',
    private: false,
});
const usr: User = {
    name: 'Gombe Nanashino',
    age: 100,
};
```

### 정답

```typescript
interface User {
    name: string;
    age: number;
    private: boolean;
}
```

객체의 타입은 `interface` 문법을 사용해 정의하는 것이 일반적인데요.

`프로퍼티명: 타입;`의 형태로 프로퍼티를 나열해 주면 됩니다.

### 다른 해답

```typescript
type User = {
    name: string;
    age: number;
    private: boolean;
};
```

이처럼 `type` 문을 사용해 타입을 정의할 수도 있습니다.

객체 타입을 `{ name: string; age: number; private: boolean; }`처럼 작성한 후, 이를 `User`라는 이름으로 부여했다고 보면 됩니다.

---

### 1-3. 함수의 타입

아래 코드에서 정의되는 함수 `isPositive`는 숫자를 받아서 그 숫자가 0 이상이면 `true`, 0 미만이면 `false`를 반환하는 함수입니다.

아래 코드에 맞는 적절한 타입 `IsPositiveFunc`를 정의해주세요.

```typescript
const isPositive: IsPositiveFunc = num => num >= 0;

// 사용 예
isPositive(5);

// 에러 예
isPositive('foo');
const res: number = isPositive(123);
```

### 정답

```typescript
type IsPositiveFunc = (arg: number) => boolean;
```

함수의 타입은 `(인자명: 타입) => 반환값 타입`의 형태로 작성할 수 있습니다.

타입 시스템 상에서 타입에 적힌 인자명(`arg`)은 실제로는 의미가 없습니다.

문제와는 상관없지만, `isPositive`에 할당된 함수 `num => num >= 0`에 인자의 타입 어노테이션이 없다는 점은 주목할 만합니다.

이 경우, 함수가 할당된 위치인 `isPositive`의 타입이 `IsPositiveFunc`로 정의되어 있기 때문에, 인자 `num`의 타입이 `number`라는 것을 TypeScript가 추론할 수 있습니다.

이것이 1-1의 해설에서 언급했던 "문맥을 통해 인자의 타입을 추론할 수 있는 경우"에 해당합니다.

### 다른 해답

```typescript
interface IsPositiveFunc {
  (arg: number): boolean;
}
```

이처럼 오브젝트 타입의 문법으로도 함수의 타입을 정의할 수 있습니다.

---

### 1-4. 배열의 타입

아래 코드에서 정의되는 함수 `sumOfPos`는 숫자 배열을 받아서 그 중에서 0 이상인 값들의 합을 반환하는 함수입니다.

적절한 타입 애노테이션을 붙여주세요.

```typescript
function sumOfPos(arr) {
  return arr.filter(num => num >= 0).reduce((acc, num) => acc + num, 0);
}

// 사용 예
const sum: number = sumOfPos([1, 3, -2, 0]);

// 에러 예
sumOfPos(123, 456);
sumOfPos([123, "foobar"]);
```

### 정답

```typescript
function sumOfPos(arr: number[]): number {
  return arr.filter(num => num >= 0).reduce((acc, num) => acc + num, 0);
}
```

`number` 타입 값을 담고 있는 배열의 타입은 `number[]`로 작성할 수 있습니다.

### 다른 해답

```typescript
function sumOfPos(arr: Array<number>): number {
  return arr.filter(num => num >= 0).reduce((acc, num) => acc + num, 0);
}
```

배열의 타입은 `Array<number>`처럼 작성할 수도 있습니다.

---

### 2-1. 제네릭

아래 코드에서 정의되는 함수 `myFilter`는 배열의 `filter` 함수를 재구현한 것입니다.

`myFilter` 함수에 적절한 타입 애노테이션을 붙여주세요.

`myFilter` 함수는 여러 타입의 배열을 받을 수 있다는 점에 유의하세요.

필요하다면 `myFilter`에 타입 변수(type parameter)를 추가하셔도 됩니다.

```typescript
function myFilter(arr, predicate) {
  const result = [];
  for (const elm of arr) {
    if (predicate(elm)) {
      result.push(elm);
    }
  }
  return result;
}

// 사용 예
const res = myFilter([1, 2, 3, 4, 5], num => num % 2 === 0);
const res2 = myFilter(['foo', 'hoge', 'bar'], str => str.length >= 4);

// 에러 예
myFilter([1, 2, 3, 4, 5], str => str.length >= 4);
```

### 정답

```typescript
function myFilter<T>(arr: T[], predicate: (elm: T) => boolean): T[] {
  const result = [];
  for (const elm of arr) {
    if (predicate(elm)) {
      result.push(elm);
    }
  }
  return result;
}
```

`myFilter`에 타입 인자 `T`를 추가했는데요.

`T`는 전달되는 배열 요소의 타입을 가리킵니다.

그래서 첫 번째 인자의 타입은 `T[]`가 됩니다.

두 번째 인자는 배열의 요소를 하나 받아서 참/거짓을 반환하는 함수이기 때문에, 타입이 `(elm: T) => boolean`이 됩니다.

`myFilter`의 반환값은 `T[]`입니다. 사실 반환값의 타입 어노테이션을 생략해도 TypeScript가 알아서 추론해주기 때문에 생략해도 괜찮습니다.

---

### 2-2. 몇 가지 문자열을 받을 수 있는 함수

아래 코드에서 정의되는 함수 `getSpeed`는 `'slow'`, `'medium'`, `'fast'` 중 하나의 문자열을 받아 숫자를 반환하는 함수입니다.

이 함수에 다른 문자열을 전달하면 타입 에러로 하고 싶습니다.

이 조건을 만족하도록 타입 `Speed`를 정의해주세요.

```typescript
type Speed = /* 여기 입력 */;

function getSpeed(speed: Speed): number {
  switch (speed) {
    case "slow":
      return 10;
    case "medium":
      return 50;
    case "fast":
      return 200;
  }
}

// 사용 예
const slowSpeed = getSpeed("slow");
const mediumSpeed = getSpeed("medium");
const fastSpeed = getSpeed("fast");

// 에러 예
getSpeed("veryfast");
```

### 정답

```typescript
type Speed = "slow" | "medium" | "fast";
```

`"slow"` 같은 값들은 문자열 리터럴 타입인데요, 이는 `"slow"`라는 특정 문자열만 받을 수 있는 타입을 의미합니다.

또한, `|`는 유니온 타입을 나타내는데, 여러 타입 중 하나에 해당하는 타입을 의미합니다.

따라서 여기서 정의한 `Speed` 타입은 `"slow"` 또는 `"medium"`, `"fast"`라는 문자열 타입을 가집니다. 

문제의 요구 사항을 만족시키는 구조입니다.

`"slow"`나 `"medium"` 같은 문자열은 `Speed` 타입을 가지기 때문에 `getSpeed` 함수의 인자로 전달될 수 있습니다.

하지만 `"veryfast"` 같은 다른 문자열은 `Speed` 타입에 해당하지 않기 때문에 타입 에러가 발생합니다.

또한 이 예제에서는 `getSpeed` 함수 내부 코드도 주목할 만한데요.

함수 내부를 보면, 인자가 `"slow"`, `"medium"`, `"fast"`일 때만 숫자를 반환한다는 것을 알 수 있습니다. 

만약 다른 값이 전달되면, 이 함수는 마지막에 아무 것도 반환하지 않게 됩니다(`undefined`가 반환됩니다).

하지만 TypeScript는 인자가 `Speed` 타입이라는 정보를 이용해 "이 함수는 반드시 어떤 `return` 문에 도달한다"는 것을 추론합니다.

이를 통해 함수의 반환 타입을 `number`로 할 수 있는 것이죠.

`Speed` 타입에 `"veryfast"` 같은 값을 추가해보면 에러가 발생하는 것을 확인할 수 있습니다.

---

### 2-3. 선택적 프로퍼티

`EventTarget#addEventListener`는 두 개 또는 세 개의 인수를 받는 함수로, 반환값은 없습니다.

첫 번째 인수는 문자열이고, 두 번째 인수는 함수입니다.

그리고 세 번째 인수는 선택 사항이며, 불리언 또는 객체를 전달할 수 있습니다.

객체에 존재할 수 있는 프로퍼티는 `capture`, `once`, `passive`의 세 가지이며, 모두 불리언 타입이고 선택적입니다.

이러한 인터페이스를 갖는 함수 `addEventListener`를 `declare`를 사용하여 선언해주세요.

간단하게 하기 위해서, 두 번째 인수로 지정하는 함수는 인수가 없고 아무 것도 반환하지 않는 함수로 하면 됩니다.

```typescript
// 사용 예
addEventListener("foobar", () => {});
addEventListener("event", () => {}, true);
addEventListener("event2", () => {}, {});
addEventListener("event3", () => {}, {
  capture: true,
  once: false
});

// 에러 예
addEventListener("foobar", () => {}, "string");
addEventListener("hoge", () => {}, {
  capture: true,
  once: false,
  excess: true
});
```

참고로, `declare`는 TypeScript 고유의 구문으로, 아래와 같이 함수나 변수의 타입을 본문 없이 선언할 수 있는 구문입니다.

```typescript
// declare의 예
declare function foo(arg: number): number;
```

### 정답
```typescript
interface AddEventListenerOptionsObject {
  capture?: boolean;
  once?: boolean;
  passive?: boolean;
}

declare function addEventListener(
  type: string,
  handler: () => void,
  options?: boolean | AddEventListenerOptionsObject
): void;
```

이 문제의 첫 번째 포인트는 `AddEventListenerOptionsObject` 타입 정의입니다.

각 프로퍼티에 `?`가 붙어있는데, 이는 이 프로퍼티가 선택적으로 존재할 수 있음을 의미합니다.

따라서 `{}`나 `{capture: false, once: true}` 같은 객체도 `AddEventListenerOptionsObject` 타입을 가집니다.

(굳이 말할 필요는 없겠지만, `AddEventListenerOptionsObject` 타입을 정의한 이유는 이해를 돕기 위해서입니다. 이 타입에 이름을 붙이지 않고 바로 `addEventListener` 함수 선언에서 사용할 수도 있습니다.)

또한, 세 번째 인자는 이 객체 외에도 불리언 값을 받을 수 있습니다.

따라서 세 번째 인자의 타입은 유니온 타입인 `boolean | AddEventListenerOptionsObject`로 정의되어 있습니다. 이것이 두 번째 포인트입니다.

마지막으로, 세 번째 인자는 선택적이었죠.

이를 표현하기 위해 `addEventListener` 선언에서 `options` 인자에 `?`를 붙였습니다.

`addEventListener`의 타입은 `(type: string, handler: () => void, options?: boolean | AddEventListenerOptionsObject) => void`이며, 타입에도 이 `?`가 남아 있다는 것을 확인할 수 있습니다.

---

### 2-4. 프로퍼티를 하나 추가하는 함수

아래 코드에서 정의되는 함수 `giveId`는 객체를 받아서, 그 객체에 새로운 문자열 타입의 프로퍼티 `id`를 추가하여 새로운 객체를 반환하는 함수입니다.

이 함수에 적절한 타입을 붙여주세요.

간단하게 하기 위해, `giveId`에 전달되는 객체 `obj`가 이미 `id` 프로퍼티를 가지고 있는 경우는 고려하지 않아도 됩니다.

```typescript
function giveId(obj) {
  const id = "사실은 랜덤한 값이 좋지만 여기서는 그냥 문자열";
  return {
    ...obj,
    id
  };
}

// 사용 예
const obj1: {
  id: string;
  foo: number;
} = giveId({ foo: 123 });
const obj2: {
  id: string;
  num: number;
  hoge: boolean;
} = giveId({
  num: 0,
  hoge: true
});

// 에러 예
const obj3: {
  id: string;
  piyo: string;
} = giveId({
  foo: "bar"
});
```

### 정답

```typescript
function giveId<T>(obj: T): T & { id: string } {
  const id = "사실 랜덤한 값을 주는 것이 좋지만, 여기서는 그냥 문자열로 합니다.";
  return {
    ...obj,
    id
  };
}
```

이 문제의 포인트는 반환값의 타입인 `T & { id: string }`입니다.

이는 교차 타입(intersection type)으로, 객체에 새로운 프로퍼티를 추가할 때 사용하는 대표적인 방법입니다.

`T`가 객체일 경우, 이는 `T`의 프로퍼티와 `id` 프로퍼티를 모두 가진 객체의 타입이 됩니다.

다만, TypeScript는 매우 똑똑해서 사실 반환값의 타입 어노테이션을 작성하지 않아도, TypeScript가 자동으로 추론할 수 있습니다.

그렇지만 이번 문제에서는 타입 어노테이션을 작성하는 것이 중요한 포인트이기 때문에, 생략하지 않는 것이 좋습니다.

---

### 2-5. useState

React의 `useState` 함수는 상태를 선언하기 위해 사용됩니다.

인수는 하나이며, 선언되는 상태의 초기값입니다.

반환값은 두 개의 요소를 가진 배열로, 첫 번째 요소는 현재 상태의 값입니다.

두 번째 요소는 함수로, 호출하면 상태를 업데이트할 수 있습니다.

상태 업데이트 함수는 인수로 새로운 상태 값을 받을 수 있을 뿐만 아니라, 현재의 값을 받아 새로운 값을 반환하는 함수를 전달할 수도 있습니다.

`useState`의 사용법은 아래 사용 예시를 참고하세요.

이러한 `useState`를 `declare`로 선언해주세요.

단, `useState`는 상태 값의 타입을 타입 인수로 받도록 해주세요.

```typescript
// 사용 예
// number 타입의 상태를 선언 (numState는 number 타입)
const [numState, setNumState] = useState(0);
// setNumState는 새로운 값으로 호출할 수 있음
setNumState(3);
// setNumState는 이전 상태를 새로운 상태로 변환하는 함수를 전달할 수도 있음
setNumState(state => state + 10);

// 타입 인수를 명시적으로 지정하는 것도 가능
const [anotherState, setAnotherState] = useState<number | null>(null);
setAnotherState(100);

// 에러 예
setNumState('foobar');
```

### 정답

```typescript
type UseStateUpdateArgument<T> = T | ((oldValue: T) => T);

declare function useState<T>(
  initialValue: T
): [T, (updator: UseStateUpdateArgument<T>) => void];
```

이번 문제의 새로운 점은 **튜플 타입**의 사용입니다.

튜플 타입은 각 요소가 서로 다른 타입을 가질 수 있는 배열을 의미하는데요, `useState` 같은 API에 타입을 부여할 때 유용하게 사용할 수 있습니다.

`UseStateUpdateArgument<T>`는 상태 업데이트 함수의 인자 타입입니다.

상태 업데이트 함수는 새로운 상태 값을 직접 받을 수도 있고, 또는 기존 상태에서 새로운 상태를 계산하는 함수를 받을 수도 있습니다.

이를 표현하기 위해 유니온 타입을 사용했습니다.

---

함수에 적절한 타입을 붙이는 문제에서는 타입 변수를 자유롭게 추가하셔도 됩니다.

또한, 인수나 반환값의 타입에 애노테이션을 부여해도 TypeScript의 타입 추론 능력이 부족하여 함수 내에서 타입 에러가 발생할 수 있습니다.

그럴 경우 `as` 등을 사용하여 적절히 에러를 회피하셔도 됩니다.

### 3-1. 배열에서 `Map` 만들기

아래 코드에서 정의되는 함수 `mapFromArray`는 객체 배열에서 `Map`을 만들어 반환하는 함수입니다.

배열에서 각 객체를 꺼내 `Map`에 등록하는데, 이때 키로 각 객체의 지정된 프로퍼티 값을 사용합니다.

`mapFromArray`에 적절한 타입을 붙여주세요.

```typescript
function mapFromArray(arr, key) {
  const result = new Map();
  for (const obj of arr) {
    result.set(obj[key], obj);
  }
  return result;
}

// 사용 예시
const data = [
  { id: 1, name: "John Smith" },
  { id: 2, name: "Mary Sue" },
  { id: 100, name: "Taro Yamada" }
];
const dataMap = mapFromArray(data, "id");
/*
dataMap은 다음과 같은 Map이 됩니다:
Map {
  1 => { id: 1, name: 'John Smith' },
  2 => { id: 2, name: 'Mary Sue' },
  100 => { id: 100, name: 'Taro Yamada' }
}
*/

// 에러 예시
mapFromArray(data, "age");
```

### 정답

```typescript
function mapFromArray<T, K extends keyof T>(arr: T[], key: K): Map<T[K], T> {
  const result = new Map();
  for (const obj of arr) {
    result.set(obj[key], obj);
  }
  return result;
}
```

이번 문제에서 `mapFromArray`는 두 개의 타입 인자를 가지고 있습니다.

첫 번째는 `T`로, 이는 전달된 배열 요소의 타입을 가리킵니다.

두 번째는 `K`로, 두 번째 인자의 타입입니다.

이 인자는 사용하려는 프로퍼티 이름을 나타내는 리터럴 타입을 기대합니다.

인자 `key`로 지정된 프로퍼티 이름은 반드시 `T`가 가진 프로퍼티 중 하나여야 하며, 이를 타입 인자의 제한으로 명시한 것이 `K extends keyof T` 부분입니다.

여기에서 `keyof T`는 `T`가 가진 프로퍼티 이름 중 하나의 타입을 의미합니다.

이번 예시에서는 `T`가 `{ id: number; name: string }`이므로 `keyof T`는 `"id" | "name"`이 됩니다.

따라서 `K`는 그 부분 타입, 즉 `"id"`나 `"name"`, 또는 `"id" | "name"`이 가능한 값이 됩니다.

문제에서는 `mapFromArray(data, "id")`로 사용되었기 때문에, `K`는 `"id"`라는 타입을 가지게 됩니다.

반환되는 `Map` 타입은 두 개의 타입 인자를 받습니다. 첫 번째는 키의 타입, 두 번째는 값의 타입입니다.

이번 예시에서는 `Map`의 키가 각 객체의 `key`로 지정된 프로퍼티, 즉 `obj[key]`의 타입입니다.

예를 들어, `key`가 `"id"`일 때는 `obj["id"]`의 타입이 됩니다.

객체의 타입은 `T`이고, 키의 이름은 `K`라는 리터럴 타입으로 들어가 있기 때문에, 프로퍼티 접근 타입으로 `obj[key]`의 타입을 `T[K]`로 표현할 수 있습니다.

`Map`에 들어가는 값은 객체 그 자체이므로, 두 번째 타입 인자는 일반적으로 `T`입니다.

이상이 해답에 대한 설명입니다. 참고로, 이번에는 반환값의 타입 어노테이션(`Map<T[K], T>`)을 생략하면 TypeScript가 이를 추론하지 못하고 `Map<any, any>`로 처리해 버리게 됩니다.

타입 어노테이션을 명시하는 방법 외에도, `new Map()`을 `new Map<T[K], T>()`로 작성하여 타입을 명시해 줄 수도 있습니다.

---

### 3-2. `Partial`

`Partial`은 TypeScript 표준 라이브러리에 정의된 타입으로, 객체 타입을 전달하면 그 각각의 프로퍼티를 모두 선택적으로 만듭니다.

`MyPartial`이라는 이름으로 이를 구현해주세요.

```typescript
// 사용 예시
/*
 * T1은 { foo?: number; bar?: string; } 타입이 됩니다.
 */
type T1 = MyPartial<{
  foo: number;
  bar: string;
}>;
/*
 * T2는 { hoge?: { piyo: number; } } 타입이 됩니다.
 */
type T2 = MyPartial<{
  hoge: {
    piyo: number;
  };
}>;
```

### 정답

```typescript
type MyPartial<T> = { [K in keyof T]?: T[K] };
```

`Mapped types`의 기본적인 사용법인데요.

`MyPartial<T>`는 `keyof T`에 해당하는 각 프로퍼티 이름 `K`에 대해, `T[K]` 타입을 가지는 `K`라는 선택적 프로퍼티가 존재하는 객체의 타입을 의미합니다.

`T[K]`는 원래 객체의 프로퍼티 타입과 동일하기 때문에, 결과적으로 `MyPartial<T>`는 원래 객체의 각 프로퍼티가 선택적으로 변한 객체 타입이 됩니다.

---

### 3-3. 이벤트

아래 코드에서 정의되는 `EventDischarger` 클래스는 `emit` 메서드를 호출하여 이벤트를 발생시키는 기능을 가지고 있습니다.

이벤트는 `"start"`, `"stop"`, `"end"`의 세 가지이며, 각각의 이벤트를 발생시킬 때는 해당 이벤트에 맞는 데이터를 `emit` 메서드에 전달해야 합니다.

구체적으로는, `"start"` 이벤트에 대해서는 `{ user: string }` 타입의 데이터를, `"stop"` 이벤트에 대해서는 `{ user: string; after: number }` 타입의 데이터를, 그리고 `"end"` 이벤트에 대해서는 `{}` 타입의 데이터를 전달해야 합니다.

각 이벤트명에 대한 필요한 데이터의 타입은 `EventPayloads` 타입에 이벤트명: 데이터 타입의 형태로 정리되어 있습니다.

이제, `emit` 메서드가 잘못된 이벤트명이나 데이터에 대해 타입 에러를 내도록 하고 싶습니다.

`emit` 메서드에 적절한 타입을 붙여주세요. 단, `EventDischarger`의 범용성을 높이기 위해, `EventDischarger`는 이벤트를 정의하는 타입인 `EventPayloads`를 타입 인수 `E`로 받도록 되어 있습니다.

`emit`은 `E`에 정의된 이벤트를 적절히 받아들여야 합니다.

```typescript
interface EventPayloads {
  start: {
    user: string;
  };
  stop: {
    user: string;
    after: number;
  };
  end: {};
}

class EventDischarger<E> {
  emit(eventName, payload) {
    // 생략
  }
}

// 사용 예시
const ed = new EventDischarger<EventPayloads>();
ed.emit("start", {
  user: "user1"
});
ed.emit("stop", {
  user: "user1",
  after: 3
});
ed.emit("end", {});

// 에러 예시
ed.emit("start", {
  user: "user2",
  after: 0
});
ed.emit("stop", {
  user: "user2"
});
ed.emit("foobar", {
  foo: 123
});
```

### 정답

```typescript
class EventDischarger<E> {
  emit<Ev extends keyof E>(eventName: Ev, payload: E[Ev]) {
    // 생략
  }
}
```

문제가 복잡하게 보이지만, 실제로는 간단한 작업을 수행합니다.

이번처럼 인자로 전달된 문자열에 따라 타입 동작을 다르게 하고 싶을 때는 그 문자열을 리터럴 타입으로 받아오는 것이 기본적인 방법인데요.

이는 3-1에서도 했던 방법입니다.

이번에는 타입 인자 `Ev`를 첫 번째 인자의 타입으로 사용했습니다.

예를 들어, `ed.emit("start", { ... })`처럼 호출하면 `Ev`는 `"start"` 타입이 됩니다.

그리고 `Ev extends keyof E`로 정의했기 때문에, `E`에 정의되지 않은 이벤트 이름을 거부할 수 있습니다.

예를 들어, `ed.emit("foobar", { ... })` 같은 호출은 이 조건 덕분에 타입 에러가 발생하게 됩니다.

이벤트 이름이 타입 `Ev`로 얻어진 상태이므로, 두 번째 인자의 타입은 `E`로부터 적절한 값을 가져오게 됩니다.

`E`가 `이벤트명: 데이터의 타입`으로 구성된 객체이므로, 원하는 타입은 `E[Ev]`로 얻을 수 있습니다.

---

### 3-4. 리듀서

아래 코드에서 정의되는 함수 `reducer`는 현재의 숫자와 액션을 받아서, 그에 따라 새로운 숫자를 반환하는 함수입니다.

액션은 세 가지가 있는데, 덧셈을 나타내는 액션은 `{ type: "increment", amount: 숫자 }` 형태의 객체입니다.

뺄셈을 나타내는 액션은 `{ type: "decrement", amount: 숫자 }` 형태입니다.

숫자의 리셋을 나타내는 액션은 `{ type: "reset", value: 숫자 }` 형태입니다.

`reducer`에 적절한 타입을 붙여주세요.

```typescript
const reducer = (state, action) => {
  switch (action.type) {
    case "increment":
      return state + action.amount;
    case "decrement":
      return state - action.amount;
    case "reset":
      return action.value;
  }
};

// 사용 예시
reducer(100, {
    type: 'increment',
    amount: 10,
}) === 110;
reducer(100, {
    type: 'decrement',
    amount: 55,
}) === 45;
reducer(500, {
    type: 'reset',
    value: 0,
}) === 0;

// 에러 예시
reducer(0, {
    type: 'increment',
    value: 100,
});
```

### 정답

```typescript
type Action =
  | {
      type: "increment";
      amount: number;
    }
  | {
      type: "decrement";
      amount: number;
    }
  | {
      type: "reset";
      value: number;
    };

const reducer = (state: number, action: Action) => {
  switch (action.type) {
    case "increment":
      return state + action.amount;
    case "decrement":
      return state - action.amount;
    case "reset":
      return action.value;
  }
};
```

액션의 타입을 `Action`으로 정의했고, 유니온 타입을 사용하여 여러 가지 액션을 나타냈습니다.

이 방식은 **대수적 데이터 타입(Algebraic Data Types)**을 모방한 패턴으로, TypeScript 프로그래밍에서 자주 사용됩니다.

---

### 3-5. `undefined`인 인수

아래 코드에서 정의된 타입 `Func<A, R>`는 `A` 타입의 인수를 하나 받아 `R` 타입의 값을 반환하는 함수의 타입입니다.

JavaScript에서는 주어지지 않은 인수는 `undefined`가 들어간다는 것이 알려져 있으므로, `f2`처럼 `A`가 `undefined` 타입일 때는 인수 없이 호출할 수 있도록 하고 싶습니다.

일단 `v3`처럼 명시적으로 `undefined`를 전달하여 호출하는 것도 허용하고자 합니다.

한편, `v4`처럼 인수가 `undefined` 이외의 경우에는 인수 생략을 허용하지 않습니다.

이상의 동작을 하도록, 타입 `Func<A, R>`를 다시 정의해주세요.

```typescript
type Func<A, R> = (arg: A) => R;

// 사용 예시
const f1: Func<number, number> = num => num + 10;
const v1: number = f1(10);

const f2: Func<undefined, number> = () => 0;
const v2: number = f2();
const v3: number = f2(undefined);

const f3: Func<number | undefined, number> = num => (num || 0) + 10;
const v4: number = f3(123);
const v5: number = f3();

// 에러 예시
const v6: number = f1();
```

### 정답

```typescript
type Func<A, R> = undefined extends A ? (arg?: A) => R : (arg: A) => R;
```

여기서는 `A`가 `undefined`인지 여부에 따라 동작을 변경하고 싶었는데요, 이를 위해 조건부 타입(conditional type)을 사용했습니다.

`undefined extends A`는 정확히 말하자면, **`undefined` 타입이 `A` 타입의 부분 집합인지**를 확인하는 조건입니다.

쉽게 말해, 이는 `A`가 `undefined`를 허용하는 타입인지 여부를 판별하는 것입니다.

예를 들어, `A`가 `undefined`일 때나 `A`가 `number | undefined`일 때 이 조건이 참이 됩니다.

`A`에 `undefined`를 지정할 수 있는 경우에는 인자를 생략 가능하게 하고 싶다는 것이 문제의 의도였습니다.

`A` 타입이 `undefined`를 허용할 때, `Func<A, R>`은 `(arg?: A) => R` 타입이 됩니다.

이를 통해 인자를 생략할 수 있게 됩니다. 그렇지 않은 경우에는 기존 방식대로 `(arg: A) => R`이 됩니다.

---

응용적인 내용이나 **TypeScript의 타입 초급**의 내용을 포함하는 문제들입니다.

해답에는 TypeScript 표준 라이브러리에 정의되어 있는 타입(Record, Partial 등)을 사용하셔도 됩니다.

또한, 이전과 마찬가지로 적절히 타입 인수를 사용하거나 `as`를 사용하셔도 됩니다.

### 4-1. 없을 경우 `unknown`

아래 코드에서 정의되는 `getFoo`는 주어진 객체의 `foo` 프로퍼티를 반환하는 함수입니다.

이 함수에 적절한 타입을 붙여주세요.

단, `foo` 프로퍼티가 `string` 타입인 객체를 전달받았을 때 `getFoo`의 반환 타입이 `string`이 되도록, 인수에 따라 `getFoo`의 타입이 적절히 변화하도록 해주세요.

또한, `foo` 프로퍼티를 가지지 않는 객체를 전달받았을 경우에는 에러가 아니라 반환 타입이 `unknown`이 되도록 해주세요.

더불어 `123`이나 `null` 등 객체가 아닌 값을 전달하는 것은 타입 에러가 되도록 해주세요.

```typescript
function getFoo(obj) {
  return obj.foo;
}

// 사용 예시
// num은 number 타입
const num = getFoo({
  foo: 123
});
// str은 string 타입
const str = getFoo({
  foo: "hoge",
  bar: 0
});
// unk는 unknown 타입
const unk = getFoo({
  hoge: true
});

// 에러 예시
getFoo(123);
getFoo(null);
```

### 정답

```typescript
function getFoo<T extends object>(
  obj: T
): T extends { foo: infer E } ? E : unknown {
  return (obj as any).foo;
}
```

이 문제는 조건부 타입에서 `infer`를 사용하는 전형적인 예시입니다.

먼저, `getFoo`에 타입 인자 `T`를 추가해 인자 `obj`의 타입을 `T`로 받습니다.

이때 `T extends object`라는 제한을 두어, 객체가 아닌 값이 전달되면 타입 오류가 발생하도록 했습니다.

반환 타입은 `T extends { foo: infer E } ? E : unknown`인데, 여기서 조건부 타입이 사용되었습니다.

`T extends { foo: infer E }`는 `T`가 `foo` 프로퍼티를 가진 타입인지 여부를 판별하는 조건입니다.

그리고 `foo` 프로퍼티가 존재할 경우, 그 프로퍼티의 타입을 `E`로 추론합니다.

조건이 참일 경우 반환 타입은 `E`, 즉 `foo` 프로퍼티의 타입이 됩니다.

그렇지 않을 경우 반환 타입은 `unknown`이 됩니다.

다만, 조건부 타입이 사용된 경우, TypeScript의 타입 추론 능력은 신뢰할 수 없기 때문에, `obj.foo`에 직접 접근하려 하면 에러가 발생할 수 있습니다.

그래서 `(obj as any)`처럼 타입 캐스팅을 사용해 에러를 억제해야 하는데요, 이 방식으로 `foo`에 접근할 수 있습니다.

---

### 4-2. 프로퍼티를 덮어쓰는 함수

아래의 `giveId` 함수는 문제 2-4와 같은 것으로, 전달된 객체 `obj`에 프로퍼티 `id`를 추가하여 새로운 객체를 반환하는 함수입니다.

문제 2-4에서는 간단하게 하기 위해 `obj`가 이미 `id`를 가지고 있는 경우는 고려하지 않았지만, 이번에는 그런 경우도 고려합니다.

`obj`가 이미 `id` 프로퍼티를 가지고 있는 경우, `giveId`는 `id` 프로퍼티를 덮어씁니다.

예를 들어, `giveId({foo: 123, id: 456})`은 `{foo: 123, id: '사실은 (생략'}`이라는 객체가 됩니다.

이 점을 감안하여 `giveId`에 적절한 타입을 붙여주세요. 참고로, 문제 2-4의 예상 답안에서는 맨 아래의 `obj2.id = '';`가 에러가 나지만, 이번에는 이것이 에러가 나지 않도록 해야 합니다.

```typescript
function giveId(obj) {
  const id = "사실은 랜덤한 값이 좋지만 여기서는 그냥 문자열";
  return {
    ...obj,
    id
  };
}

// 사용 예시
/*
 * obj1의 타입은 { foo: number; id: string } 입니다.
 */
const obj1 = giveId({ foo: 123 });
/*
 * obj2의 타입은 { num: number; id: string } 입니다.
 */
const obj2 = giveId({
  num: 0,
  id: 100,
});
// obj2의 id는 string 타입이므로 다른 문자열로 대입할 수 있습니다.
obj2.id = '';
```

### 정답

```typescript
function giveId<T>(obj: T): Pick<T, Exclude<keyof T, "id">> & { id: string } {
  const id = "사실 랜덤한 값이면 더 좋지만, 여기서는 그냥 문자열로 처리합니다.";
  return {
    ...obj,
    id
  };
}
```

`giveId` 함수의 인자 `obj`의 타입을 타입 인자 `T`로 받는 것은 기본적인 사항입니다.

반환 타입은 `Pick<T, Exclude<keyof T, "id">> & { id: string }`인데요, 이 부분이 핵심입니다.

`Pick`과 `Exclude`는 TypeScript의 표준 라이브러리에 정의된 타입입니다.

`Pick<T, K>`는 객체 `T`에서 이름이 `K`에 해당하는 프로퍼티들만 선택한 객체 타입을 반환합니다.

예를 들어, `Pick<{foo: number; bar: string}, "foo">`는 `{foo: number}` 타입을 반환합니다.

`K` 부분에 `"foo" | "bar"`처럼 유니온 타입을 넣으면, 여러 프로퍼티를 가진 객체 타입을 얻을 수 있습니다.

`Exclude<T, U>`는 `T`가 유니온 타입일 때, `T`의 구성 요소 중에서 `U`에 속하는 부분을 제외한 타입을 반환합니다.

이번 경우에 `keyof T`는 `T`의 모든 프로퍼티 이름이 유니온 타입으로 나타난 것이므로, `Exclude<keyof T, "id">`는 `T`에서 `"id"`를 제외한 모든 프로퍼티 이름을 유니온 타입으로 나타냅니다.

만약 `keyof T`에 `"id"`가 포함되지 않는다면, `Exclude<keyof T, "id">`는 그냥 `keyof T`가 됩니다.

이렇게 해서 `Pick<T, Exclude<keyof T, "id">>`를 통해 `T`에서 `id` 프로퍼티를 제외한 객체 타입을 얻습니다.

그런 다음 `{ id: string }`과 교차 타입을 사용해 `id` 프로퍼티를 새로 추가합니다.

이렇게 하면 기존 객체에서 `id` 프로퍼티를 덮어쓰는 효과를 얻을 수 있습니다.

참고로, 이 `Pick<T, Exclude<keyof T, K>>` 패턴은 자주 사용되기 때문에 `Omit`이라는 이름으로도 많이 볼 수 있습니다.

```typescript
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
```

### 다른 해답

```typescript
function giveId<T>(
  obj: T
): { [K in keyof T]: K extends "id" ? string : T[K] } & { id: string } {
  const id = "사실 랜덤한 값이면 더 좋지만, 여기서는 그냥 문자열로 처리합니다.";
  return {
    ...obj,
    id
  } as any;
}
```

`Pick<T, Exclude<keyof T, "id">>` 대신 조건부 타입을 사용하여 `T`의 `id` 프로퍼티 타입을 `string`으로 바꾸는 방법입니다.

`T`에 `id` 프로퍼티가 존재하지 않는 경우에도 대비하기 위해 `& { id: string }`은 여전히 필요합니다.

---

### 4-3. 유니언은 싫어

아래 코드에서 정의되는 `EventDischarger`는 문제 3-3과 동일한 것입니다.

사실, 문제 3-3에서 예상되는 해답에는 하나의 문제가 있습니다.

바로 코드 맨 아래의 "에러 예시"에서 보듯이, `emit`의 타입 인수에 `"start" | "stop"`과 같은 유니언 타입을 전달하여 타입 검사를 속이고 잘못된 데이터를 전달할 수 있다는 점입니다.

이 예시에서는 이벤트명이 `"stop"`인데 데이터는 `"start"`용 것이 됩니다.

이러한 문제를 회피하기 위해, `emit`의 타입 인수 `Ev`를 이벤트명의 유니언 타입으로 하여 함수가 호출되는 것을 타입 에러로 막고자 합니다.

이 요건을 만족하도록 `emit`의 타입을 완성해 주세요.

힌트 (흰 글씨로 적혀 있습니다): `Ev`가 유니언 타입일 때는 `payload`의 타입을 `never`로 합시다.

```typescript
interface EventPayloads {
  start: {
    user: string;
  };
  stop: {
    user: string;
    after: number;
  };
  end: {};
}

class EventDischarger<E> {
  emit<Ev extends keyof E>(eventName: Ev, payload: /* 여기를 채우세요 */) {
    // 생략
  }
}

// 사용 예시
const ed = new EventDischarger<EventPayloads>();
ed.emit("start", {
  user: "user1"
});
ed.emit("stop", {
  user: "user1",
  after: 3
});
ed.emit("end", {});

// 에러 예시
ed.emit<"start" | "stop">("stop", {
  user: "user1"
});
```

### 정답

```typescript
type Spread<Ev, EvOrig, E> = Ev extends keyof E
  ? EvOrig[] extends Ev[]
    ? E[Ev]
    : never
  : never;

class EventDischarger<E> {
  emit<Ev extends keyof E>(eventName: Ev, payload: Spread<Ev, Ev, E>) {
    // 생략
  }
}
```

조건부 타입의 특성을 이해해야 하는 다소 어려운 문제입니다.

이 문제에서는 타입 인자 `Ev`가 `"start" | "end"` 같은 유니온 타입인지, `"start"` 같은 단일 리터럴 타입인지 판단해야 합니다.

이를 위해 `Spread<Ev, EvOrig, E>`에서는 먼저 `Ev extends keyof E`라는 조건을 통해 **유니온 분배(Union Distribution)**를 발생시켜, `Ev`를 유니온 타입의 구성 요소로 분리합니다.

참고로 `Ev extends keyof E`는 항상 조건을 만족하므로, 이 조건은 유니온 분배를 발생시키는 것 외에는 특별한 의미가 없습니다.

`else` 부분에는 특별한 의미가 없기 때문에 `never`로 처리합니다.

그다음 조건인 `EvOrig[] extends Ev[]`는 `EvOrig`가 `Ev`의 부분 집합인지 확인하는 조건입니다.

배열로 감싼 이유는 `EvOrig`에 대해 유니온 분배가 발생하는 것을 방지하기 위해서입니다.

`EvOrig`는 유니온 분배가 발생하기 전의 `Ev` 값입니다.

만약 원래의 `Ev`가 `"start"`와 같은 단일 리터럴 타입이라면, 여기서 `Ev`와 `EvOrig`는 둘 다 `"start"`가 되어 조건을 만족하게 됩니다.

그 결과로 `E[Ev]` 타입을 얻습니다. 반대로, `Ev`가 `"start" | "end"`와 같은 유니온 타입인 경우, `Ev`는 `"start"` 혹은 `"end"`가 되고, `EvOrig`는 `"start" | "end"`가 됩니다.

이 경우에는 `EvOrig[] extends Ev[]` 조건이 만족되지 않으므로 타입은 `never`가 됩니다.

유니온 분배가 발생했을 때, 각 `Ev`에 대해 `never`가 되므로, 결과적으로 `Spread<Ev, EvOrig, E>`는 `never | never | ... | never`가 되고, 이는 `never`와 동일한 타입이 됩니다.

결론적으로, `Spread<Ev, Ev, E>`는 `Ev`가 단일 리터럴 타입일 때는 `E[Ev]`가 되며, 그렇지 않으면 `never`가 됩니다.

`never` 타입은 어떤 값도 가질 수 없는 타입이기 때문에, `payload` 인자에 값을 전달하려고 하면 타입 에러가 발생해 문제 해결이 가능합니다.

---

### 4-4. 일부만 `Partial`

표준 라이브러리의 `Partial`은 객체의 모든 프로퍼티를 선택적으로 만드는 것이었습니다.

이제, 모두가 아니라 일부 프로퍼티만 선택적으로 하고 싶습니다.

이러한 기능을 가진 `PartiallyPartial<T, K>`를 정의해주세요.

```typescript
// 사용 예시

// 원본 데이터
interface Data {
  foo: number;
  bar: string;
  baz: string;
}
/*
 * T1은 { foo?: number; bar?: string; baz: string } 타입입니다.
 */
type T1 = PartiallyPartial<Data, "foo" | "bar">;
```

### 정답

```typescript
type PartiallyPartial<T, K extends keyof T> = Partial<Pick<T, K>> &
  Pick<T, Exclude<keyof T, K>>;
```

이 문제는 4-2와 유사한 문제입니다.

`T`를 `K`에 속하는 프로퍼티와 그렇지 않은 프로퍼티로 나눈 뒤, 앞부분에 `Partial`을 적용한 후 다시 결합하는 방식입니다.

---

### 4-5. 최소 하나는 필요한 옵션 객체

아래 코드에서 정의되는 함수 `test`는 `foo`, `bar` 및 `baz` 프로퍼티를 가진 옵션 객체를 받는 함수입니다.

이 프로퍼티들은 모두 선택적으로 하고 싶지만, 전부 생략하는 것(즉, `{}`를 전달받는 것)은 타입 에러로 하고 싶습니다.

또한, 코드를 간단히 하기 위해, 모든 프로퍼티가 갖추어진 옵션 객체의 타입을 아래 코드의 `Options`로 정의하고, "각 프로퍼티는 선택적이지만 적어도 하나는 필요한 옵션 객체의 타입"을 `AtLeastOne<Options>`로 표현하고자 합니다.

이러한 `AtLeastOne<T>`를 정의해주세요.

```typescript
// 사용 예시
interface Options {
  foo: number;
  bar: string;
  baz: boolean;
}
function test(options: AtLeastOne<Options>) {
  const { foo, bar, baz } = options;
  // 생략
}
test({
  foo: 123,
  bar: "bar"
});
test({
  baz: true
});

// 에러 예시
test({});
```

### 정답

```typescript
type PartiallyPartial<T, K extends keyof T> = Partial<Pick<T, K>> &
  Pick<T, Exclude<keyof T, K>>;

type AtLeastOne<T> = Spread<T, keyof T>;

type Spread<T, K extends keyof T> = K extends keyof T
  ? PartiallyPartial<T, Exclude<keyof T, K>>
  : never;
```

이 문제는 작가의 이전 글인 "TypeScript로 최소 하나의 필수 옵션 객체 타입을 만들기"를 읽은 사람에게는 쉬운 보너스 문제입니다.

바로 위의 `PartiallyPartial<T, K>` 타입을 재활용하고 있습니다.

자세한 내용은 그 글을 읽어보는 것이 좋지만, 목표는 원래의 `Options`에 대해

```typescript
PartiallyPartial<Options, 'bar' | 'baz'> |
PartiallyPartial<Options, 'foo' | 'baz'> |
PartiallyPartial<Options, 'foo' | 'bar'>
```

와 같은 타입을 생성하는 것입니다.

이를 위해 `keyof T`로부터 얻은 `'foo' | 'bar' | 'baz'` 각각의 요소를 **유니온 분배**를 사용해 `PartiallyPartial<...>`로 변환하게 됩니다.

---
