---
slug: 2025-11-13-properly-type-object-keys-and-object-entries
title: "Object.keys의 배신, 타입스크립트에서 100% 안전한 타입 얻어내기"
summary: "타입스크립트에서 Object.keys가 string[]을 반환하는 이유를 알아보고, keyof 연산자와 제네릭을 활용해 객체의 키와 값을 100% 타입 안전하게 다루는 실용적인 방법을 소개합니다."
date: 2025-11-13T07:54:23.213Z
draft: false
weight: 50
tags: ["타입스크립트", "Object.keys", "Object.entries", "keyof", "타입 추론", "타입 안전성", "TypeScript"]
contributors: []
---

![Object.keys의 배신, 타입스크립트에서 100% 안전한 타입 얻어내기](https://blogger.googleusercontent.com/img/a/AVvXsEjiTgau7J6Ow2anJ3M2_dA4OK00c8_gJTdUzVvMfQHenNTu-XyuF9s-zMXRtqXZVfoiT-Tt8ShqLg-q5o_g---AJRQsxmaDWAwuPEJnn9Fn8QDUF1o0aURNVihQFIOTnD2G64Qa5-28PVHSFD24JN-pCQqCXt_L7YhHzHrKtIaIUelzf7Dk_ybYseoD7mQ=s16000)

타입스크립트(TypeScript)에서 `Object.keys`와 `Object.entries`가 다루기 조금 까다로울 때가 있는데요.

`readonly` 객체에 사용하더라도 우리가 기대하는 타입을 정확하게 반환하지 않기 때문입니다.

어떤 상황인지 한번 자세히 살펴보겠습니다.

타입스크립트가 표현식의 가장 구체적인 타입을 추론하고 속성을 `readonly`로 설정하도록, `const` 단언을 사용한 다음 객체가 있다고 해보죠.


```typescript
const data = {
  a: 'value-a',
  b: 'value-b',
  c: 'value-c',
} as const;
```

이 객체에 `Object.values`를 사용하면 객체의 리터럴 값들을 반환할 것이라고 기대하실 텐데요.

그리고 그 예상은 정확히 맞습니다.


```typescript
const values = Object.values(data);
//    ^? const values: ("value-a" | "value-b" | "value-c")[]
```

하지만 `Object.keys`와 `Object.entries`는 어떨까요?

우리 객체에 `Object.keys`를 호출하면 `string[]`을 반환하는데요.


```typescript
const keys = Object.keys(data);
//    ^? const keys: string[]
```

그리고 이건 의도된 동작이거든요.

`Object.keys`는 언제나 `string[]`을 반환하도록 설계되었습니다.


```typescript
/**
 * Returns the names of the enumerable string properties and methods of an object.
 * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
 */
keys(o: {}): string[];
```

타입스크립트의 타입은 의도적으로 '개방형'으로 설계되었기 때문인데요.

이 때문에 `const` 단언을 사용하더라도 객체 타입에 추가적인 속성이 없다고 항상 보장할 수는 없습니다.

이 문제는 나중에 레코드(Record), 즉 깊은 불변성을 가진 객체 유사 구조체가 도입되면 달라질 수도 있겠네요.

다행히 타입스크립트는 주어진 타입의 키 타입을 반환하는 `keyof`라는 타입 연산자를 제공하는데요.

이걸 활용하면 문제를 해결할 수 있습니다.

다만, 이 방법은 객체가 불변이고 추가적인 속성을 포함하지 않는다는 것을 확실히 알 때만 효과적이라는 점을 명심해야 합니다.


```typescript
// 타입을 실제 내용으로 단순화해서 보여주기 위해 `& {}`를 추가했습니다
type Keys = (keyof typeof data)[] & {};
//   ^? type Keys = ("a" | "b" | "c")[]
```

이렇게 키가 될 수 있는 값들을 포착한 뒤에는, `Object.keys`의 결과를 우리가 만든 타입으로 캐스팅하면 되는데요.


```typescript
const typedKeys = Object.keys(data) as Keys;
//    ^? const typedKeys: ("a" | "b" | "c")[]
```

혹은 한 줄로 이렇게 작성할 수도 있습니다.


```typescript
const typedKeys = Object.keys(data) as (keyof typeof data)[];
//    ^? const typedKeys: ("a" | "b" | "c")[]
```

여기서 한 걸음 더 나아가, 이 로직을 감싸는 제네릭 함수를 만들 수도 있거든요.


```typescript
function keysFromObject<T extends object>(object: T): (keyof T)[] {
  return Object.keys(object) as (keyof T)[];
}

const typedKeys = keysFromObject(data);
//    ^? const typedKeys: ("a" | "b" | "c")[]
```

이 원리는 `Object.entries`에도 똑같이 적용됩니다.

`value`는 예상대로 타입이 잡히지만, `key`는 여전히 `string`으로 타이핑되는데요.


```typescript
const entries = Object.entries(data).map(
  ([key, value]) => [key, value],
  // ^? (parameter) key: string
);
```

여기서도 `keyof` 타입 연산자를 제네릭 타입과 결합하여 객체의 키를 포착한 다음, `Object.entries`의 결과를 우리가 원하는 타입으로 캐스팅할 수 있습니다.


```typescript
type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

const typedEntries = (Object.entries(data) as Entries<typeof data>).map(
  ([key, value]) => [key, value],
  // ^? (parameter) key: "a" | "b" | "c"
);
```

이것 역시 조금 더 발전시킬 수 있는데요.

`type-fest` 라이브러리의 `Entries` 타입을 사용하거나,


```typescript
import type { Entries } from 'type-fest';

const typedEntries = (Object.entries(data) as Entries<typeof data>).map(
  ([key, value]) => [key, value],
  // ^? (parameter) key: "a" | "b" | "c"
);
```

우리만의 제네릭 함수를 직접 만드는 방법입니다.


```typescript
function entriesFromObject<T extends object>(object: T): Entries<T> {
  return Object.entries(object) as Entries<T>;
}

const typedEntries2 = entriesFromObject(data).map(
  ([key, value]) => [key, value],
  // ^? (parameter) key: "a" | "b" | "c"
);
```
