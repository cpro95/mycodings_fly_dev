---
slug: 2022-12-19-learn-typescript-utility-types
title: 타입스크립트 유틸리티 타입 알아보기(Pick, Omit, Readonly, Partial, Required)
date: 2022-12-19 01:31:06.762000+00:00
summary: 타입스크립트 유틸리티 타입 알아보기(Pick, Omit, Readonly, Partial, Required)
tags: ["typescript", "utility types", "pick", "omit", "readonly", "partial", "required"]
contributors: []
draft: false
---

안녕하세요?

오늘은 타입스크립트 유틸리티 타입에 대해 알아 보겠습니다.

최근에는 웹 개발이 전부 타입스크립트로 이루어지는데요.

확장서, 생산성, 안정성 등 타입스크립트가 제공하는 효과는 가늠하기 어려운데요.

그중에서도 타입스크립트가 기본적으로 제공하는 유틸리티 타입(Utility Types)에 대해 알아 보겠습니다.

오늘 알아볼 유틸리티 타입은 5가지인데요.

1. Pick

2. Omit

3. Readonly

4. Partial

5. Required

---

## 1. Pick(Type, Keys)

Pick 타입은 기존에 있던 타입에서 필요한 것만 골라서 새로운 타입을 만들어주는 건데요.

Pick 유틸리티 타입은 우리가 고른 거 외에는 전부 제거합니다.

```js
type Student = {
  name: string
  lastName: string
  age: number
  class: string
}

type SomeStudent = Pick<Student, "name" | "age">

// type SomeStudent = {
//  name: string;
//  age: number;
// }
```

---

## 2. Omit(Type, Keys)

Omit 유틸리티 타입은 Pick 유틸리티 타입과 정반대로 작동됩니다.

삭제할 Keys 항목만 넣으면 그거 말로 나머지를 리턴해 주는 타입입니다.

기존 타입에서 일부만 제거하려고 할 때 아주 유용합니다.

```js
type Student = {
  name: string
  lastName: string
  age: number
  class: string
}

type SomeStudent = Omit<Student, "lastName" | "class">

// type SomeStudent = {
//  name: string;
//  age: number;
// }
```

---

## 3. Readonly(Type)

Readonly 유틸리티 타입은 작성된 값이 변경할 수 없게 만들어 줍니다.

Readonly로 새롭게 생긴 타입에 새로운 값을 할당하려고 하면 타입스크립트 경고가 나옵니다.

```js
type Student = {
  name: string,
}

type ReadOnlyStudent = Readonly<Student>

const student: ReadOnlyStudent = {
  name: 'Jin',
}

student.name = 'Jung'
// Cannot assign to 'name' because it is a read-only property.
```

---

## 4. Partial(Type)

네번 째인 Partial 유틸리티 타입은 기존 타입의 항목을 전부 옵셔널(optional)로 만들어 줍니다.

이 유틸리티 타입은 우리가 받은 객체가 아직 뭔지 모를 때 아주 유용합니다.

```js
type Student = {
  name: string
  lastName: string
  age: number
  class: string
}

type PartialStudent = Partial<Student>

// type PartialStudent = {
//   name?: string | undefined;
//   lastName?: string | undefined;
//   age?: number | undefined;
//   class?: string | undefined;
// }
```

---
## 5. Required(Type)

Required 타입은 Partial 유틸리티 타입과 정반대로 작동합니다.

모든 옵셔널 상태인 항목에 대해 옵셔널 상태를 없애주거든요.

```js
type Student = {
  name?: string
  lastName?: string
  age?: number
  class?: string
}

type RequiredStudent = Required<Student>

// type RequiredStudent = {
//   name: string;
//   lastName: string;
//   age: number;
//   class: string;
// }
```

---

지금까지 타입스크립트 유틸리티 타입 중 가장 많이 쓰이는 5가지에 대해 알아봤습니다.

사실 이 5가지만 잘 활용한다면 코딩하시기 훨씬 수월해 질겁니다.

그럼.
