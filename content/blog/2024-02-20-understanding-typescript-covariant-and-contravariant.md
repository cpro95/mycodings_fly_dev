---
slug: 2024-02-20-understanding-typescript-covariant-and-contravariant
title: 타입스크립트 변성 5분 만에 이해하기(공변성, 반변성, 양변성)
date: 2024-02-20 12:40:29.070000+00:00
summary: 타입스크립트 공변성, 반변성, 양변성 쉽게 이해하기
tags: ["typescript", "covariant", "contravariant", "bivariant"]
contributors: []
draft: false
---

안녕하세요?

TypeScript에 대한 글을 읽다 보면, 공변성과 반변성이라는 생소한 단어를 마주치게 됩니다.

도대체 뭘까요?

이 글에서는 그런 공변성과 반변성에 대해, 5분 만에 이해할 수 있도록 아주 간단하게 설명해보겠습니다.

** 목 차 **
- [타입스크립트 변성 5분 만에 이해하기(공변성, 반변성, 그리고 양변성)](#타입스크립트-변성-5분-만에-이해하기공변성-반변성-그리고-양변성)
  - [기본 코드](#기본-코드)
  - [서브타입과 슈퍼타입](#서브타입과-슈퍼타입)
  - [함수의 반환값(공변성: covariant)](#함수의-반환값공변성-covariant)
  - [함수의 인자(반변성: contravariant)](#함수의-인자반변성-contravariant)
  - [메소드 기록법(양변성: bivariant)의 위험성](#메소드-기록법양변성-bivariant의-위험성)
  - [끝맺음](#끝맺음)

---

영어로는 변셩을 variant, 공변성을 covariant, 반변성을 contravariant라는 단어로 씁니다.

ChatGPT에 물어보니 무변성(invariant)도 있네요.

ChatGPT 결과를 한번 보고 갈까요?

---

1. **공변성 (Covariant):**
   - 공변성은 주로 타입이나 클래스 관계에서 나타납니다.
   - 만약 A가 B의 하위 타입(서브타입)이라면, `Array<A>`는 `Array<B>`의 하위 타입이 됩니다.
   - 예를 들어, 만약 동물이라는 클래스가 있고, 그 중에서 강아지가 파생된다면, Animal 배열은 Dog 배열의 하위 타입이 됩니다.

2. **반변성 (Contravariant):**
   - 반변성은 공변성과 반대로 동작합니다. 만약 A가 B의 하위 타입이라면, `Array<B>`는 `Array<A>`의 하위 타입이 됩니다.
   - 함수 매개변수의 관점에서 설명하면, 만약 B 타입의 함수를 받는 곳에 A 타입의 함수를 사용할 수 있다면, B는 A의 반변성입니다.

3. **무변성 (Invariant):**
   - 무변성은 타입 간에 서로 상속 관계가 있어도 상관하지 않는 경우를 의미합니다.
   - A가 B의 하위 타입이더라도, `Array<A>`와 `Array<B>`는 서로 관련이 없는 타입입니다.

간단하게 코드로 예를 들면 다음과 같습니다.

```typescript
// 공변성 (Covariant)
class Animal {}
class Dog extends Animal {}

let animals: Array<Animal> = [new Dog()]; // 이는 올바른 사용입니다.

// 반변성 (Contravariant)
let printAnimal: (animal: Animal) => void = (dog: Dog) => console.log(dog); // 이는 올바른 사용입니다.

// 무변성 (Invariant)
let invariantArray: Array<Animal> = [new Dog()]; // 이는 올바른 사용입니다.
// let invariantArray: Array<Animal> = [new Animal()]; // 이는 올바르지 않습니다.
```

이렇게 타입의 상속 관계를 기반으로 설명된 공변성과 반변성은 TypeScript에서 제네릭이나 함수 매개변수 등 다양한 상황에서 발생할 수 있습니다.

역시나 ChatGPT는 무적이네요.

그런데 살짝 이해하기 어려운데요.

5분만에 이해할 수 있게 상세하게 설명해 보겠습니다.

---

## 기본 코드

일단 이 글에서 사용할 타입과 변수를 다음과 같이 정의합시다.

```typescript
// 타입선언
type User = {
  name: string
}

type Admin = User & {
  permissions: string[]
}

// 타입에 맞는 변수 준비
const user: User = {
  name: "user",
}

const admin: Admin = {
  name: "admin",
  permissions: [],
}
```

User는 `name`만을 가진 타입이고, Admin은 User의 `name`과 `permissions`을 가진 타입입니다.

또한, 각 타입의 변수도 준비해두었습니다.

---

## 서브타입과 슈퍼타입

Admin 타입의 변수는 name 속성을 가지고 있으며, User 타입의 조건을 만족합니다.

그래서, User 타입의 변수에는 Admin 타입의 변수를 할당할 수 있습니다.

그 반대의 경우는 타입 에러가 발생합니다.

User 타입의 변수에는 permissions 속성이 없기 때문에, Admin 타입을 만족시키지 못합니다.

```typescript
// admin은 User의 타입을 만족시키므로 할당 가능
const value1: User = admin

// 타입 에러. Type 'User' is not assignable to type 'Admin'.
const value2: Admin = user
```

이처럼 Admin 타입은 User 타입으로도 취급될 수 있으며, 이 관계를 'Admin 타입은 User 타입의 서브타입이다'라고 합니다.

그 반대로, 'User 타입은 Admin 타입의 슈퍼타입이다'라고 합니다.

---

## 함수의 반환값(공변성: covariant)

다음으로, 함수를 할당하는 경우에 대해 살펴보겠습니다.

타입으로 지정한 반환값과 다른 값을 반환하는 함수를 할당해봅시다.

```typescript
// admin은 User의 타입을 만족시키므로 할당 가능
const fn1: () => User = () => admin

// 타입 에러. Type 'User' is not assignable to type 'Admin'.
const fn2: () => Admin = () => user
```

'User 타입을 반환하는 함수'라는 타입을 지정한 변수 fn1에 'Admin 타입을 반환하는 함수'를 할당할 수 있습니다.

앞서 본 것처럼 Admin 타입은 User 타입으로 취급될 수 있기 때문에, 이는 이해하기 쉽습니다.

반면, fn2처럼 반대의 패턴으로 할당하려고 하면 속성이 부족해서 타입 에러가 발생합니다.

이처럼, 서브타입의 관계가 필요한 것을 공변성(또는 공변의 위치에 있는)이라고 합니다.

---

## 함수의 인자(반변성: contravariant)

이어서 함수의 인자에 대해 살펴보겠습니다.

타입으로 지정한 인자와 다른 타입을 받는 함수를 할당해봅니다.

```typescript
// 타입 에러. Type '(arg: Admin) => void' is not assignable to type '(arg: User) => void'.
const fn3: (arg: User) => void = (arg: Admin) => {};

// 이 경우는 OK
const fn4: (arg: Admin) => void = (arg: User) => {};
```

'User를 받는 함수'라는 타입을 지정한 변수 fn3에 'Admin을 받는 함수'를 할당하려고 하면 타입 에러가 발생하고, 그 반대의 fn4는 OK입니다.

앞서와 반대이므로, 이것만 보면 뭔가 헷갈립니다.

함수의 본체를 아래와 같이 바꿔보면 왜 타입 에러가 발생하는지 이해하기 쉽습니다.

```typescript
// 타입 에러. 타입의 인자는 User이지만, 실제로는 Admin이 필요
const fn3: (arg: User) => void = (arg: Admin) => console.log(arg.name, arg.permissions);

fn3(user); // "user"와 undefined가 출력됩니다

// Admin을 전달받아도 User의 부분만 사용하므로 할당 가능
const fn4: (arg: Admin) => void = (arg: User) => console.log(arg.name);
```

위의 fn3 예시에서는, 타입상으로는 'User를 받는 함수'로 되어 있지만, 실제로는 Admin 타입이 전달되는 것을 예상하고 있습니다.

그래서 name은 출력되지만, permissions는 User 타입의 변수에는 존재하지 않기 때문에 undefined가 됩니다.

이 예에서는 'undefined가 출력된다' 정도의 문제입니다만, 코드를 arg.permissions.length로 변경하면 아래와 같이 런타임 에러가 발생합니다.

```bash
Cannot read properties of undefined (reading 'length')
```

이런 일을 방지하기 위해, '함수의 타입의 인자 vs 실제 함수의 인자'가 서브타입의 관계에 있을 경우 타입 에러가 발생하는 것입니다.

반대로 fn4는, 타입상으로는 'Admin을 받는 함수'이고, 실제로는 'User를 받는 함수'가 됩니다.

Admin 타입은 User 타입으로 취급될 수 있기 때문에, 이 할당은 문제가 없습니다.

함수의 인자에 대해서는, 반환값과는 반대의 관계가 되는 것을 알 수 있습니다.

공변성과는 반대로, 슈퍼타입의 관계가 필요한 것을 반변성(또는 반변의 위치에 있는)이라고 합니다.

---

## 메소드 기록법(양변성: bivariant)의 위험성

객체의 타입 정의를 할 때 메소드 기록법을 사용하면 양변성이 됩니다.

이는 공변성이나 반변성 중 하나만 충족하면 되는 관계입니다.

그래서 인자가 서브타입인 경우에도 타입 에러가 발생하지 않습니다.

즉, 위에서 설명한 반변성의 부분에서 언급한 런타임 에러가 실제로 발생할 위험이 있습니다.

특별한 의도가 없다면 피하는 것이 좋습니다.

```typescript
type MyObject = {
  fnProp: (arg: User) => void; // 함수 속성으로 정의
  method(arg: User): void; // 메소드 기록법으로 정의
}

const obj: MyObject = {
  // 속성으로 정의된 함수는 반변성이므로 서브타입은 타입 에러
  // Type '(arg: Admin) => void' is not assignable to type '(arg: User) => void'.
  fnProp: (arg: Admin) => { },

  // 메소드 기록법으로 정의된 함수는 양변성이므로 서브타입이라도 타입 에러가 발생하지 않습니다!
  // 아래 코드는 런타임 에러를 일으킬 수 있습니다
  method: (arg: Admin) => arg.permissions.length,
}
```

## 끝맺음

이 글에서는 TypeScript의 변성(공변성과 반변성)에 대해 설명했는데요.

구체적으로는 서브타입과 슈퍼타입의 관계, 함수의 반환값에서의 공변성, 함수의 인자에서의 반변성에 대해 언급했습니다.

ChatGPT가 설명하는게 어려웠다면 제 글이 도움이 됐으면 합니다.

그럼.
