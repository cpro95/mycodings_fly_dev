---
slug: 2023-07-12-understanding-typescript-interface
title: Typescript(타입스크립트) interface 이해하기
date: 2023-07-12 09:52:44.707000+00:00
summary: Typescript(타입스크립트) interface 이해하기
tags: ["typescript", "interface"]
contributors: []
draft: false
---

안녕하세요?

이번 시간에는 Typescript의 Interface에 알아보겠습니다.

타입스크립트에서는 새로운 타입을 정할 때 type 키워드와 interface 키워드를 쓰는데요.

type 키워드를 쓰는 방식과 interface 키워드를 쓰는 방식에는 미묘한 차이가 있습니다.

저도 많이 헷갈려서 그냥 type 키워드만 썼었는데요.

오늘 본격적으로 Interface에 관해 공부해 보고 앞으로는 Interface를 좀 더 적극적으로 활용해 볼 예정입니다.

먼저, 가장 기본이 되는 Interface의 사용 방법에 대해 알아보겠습니다.

```js
interface User {
  name: string,
  age: number,
}

// 정상 작동
let newUser : User = {name: "John", age: 28};

// 에러 발생 : User Interface에 지정된 age 항목이 없다고 에러 발생
let newUser : User = {name: "John"};

// 에러 발생 : User Interface에 있는 name, age 항목이 없다고 에러 발생 
let newUser : User = {};
```

그리고 Interface에는 타입스크립트만의 특별한 지정자를 추가할 수 있습니다.

즉, readonly 나 optional을 지정할 수 있습니다.

```js
interface User {
  readonly id: number     // readonly 변수
  name: string,
  age: number,
  specialKey? : string,   // optional 
}
```

마지막으로 Interface 안의 항목에 함수 형태도 지정할 수 있습니다.

```js
// 방법 1
interface User {
    getDiscount(coupon: string): number     
}

// 실제 사용 방법
const newUser: User = {
    getDiscount: (coupon: "KIJ298DD9J") => {
        return 10;
    }
}

// 방법 2
interface User {
    getDiscount: (coupon: string) => number
}

// interface User에서 선언된 변수명 coupon이라고 쓰지 않아도
// 자동으로 알아서 처리해 준다.
const newUser: User = {
    getDiscount: (couponName: "KIJ298DD9J") => {
        return 10;
    }
}
```

---

## Interface vs Type

interface 키워드와 type 키워드는 거의 모든 부분에서 동일하지만, 확장성에 있어서 차이가 납니다.

그럼, 본격적으로 type 키워드와의 차이점을 알아보겠습니다.

### 새로운 항목 추가하는 방법

```js
// User 객체의 항목을 id, email만 지정했습니다.
interface User {
    id: string;    
    email: string;
}

// 그런데, interface는 항목 추가가 가능합니다.
// 아래처럼 name 항목도 별도 코드를 통해 추가가 가능합니다.
interface User {
    name: string;
}

// 최종적으로 User 객체는 id, email, name 항목을 가지게 됩니다.
const user: User = {
    id: "2323232",
    email: "foo@email.com",
    name: "Foo";
}
```

일단 Interface 방식의 객체 항목 지정은 위 코드에서처럼 새로운 항목을 자유롭게 추가할 수 있는데요.

그러나 type 키워드를 통한 항목 지정에서는 불가능합니다.

```js
type User = {
    id: string;
}

type User = {
    email: string;
}

// 에러 발생: Duplicate identifier "User"
```

위 코드에서 보듯이 type 키워드로 User 객체를 id 항목으로만 만들었는데요.

거기다 email 항목을 추가하고 싶다고 interface 방식으로 하면 에러가 발생합니다.

결론적으로 type 키워드로 어떤 객체를 만들었다면 그 객체의 스키마는 변할 수 없게 되는 겁니다.


### 확장(extends)

클래스 상속같이 Interface도 extends 키워드로 쉽게 확장이 가능한데요.

반면에 type 키워드 방식은 extends 방식이 아니라 인터섹션(intersection), 즉 교차를 통해 확장할 수 있습니다.

```js
interface Car {
    model: string;
    color: string;
}

// interfaces는 extends 키워드로 쉽게 확장할 수 있습니다.
interface Tesla extends Car {
  autoPilotModelName: string;
};

// 사용 예
const newCar: Tesla = {
    model: "S",
    color: "red",
    autoPilotModelName: "xyz"
}
```

위 코드를 보면 Car라고 interface로 객체 스키마를 지정했고, Tesla라는 객체는 Car를 확장한다(extends)라고 했습니다.

그래서 Tesla 객체는 Car 객체가 가진 모든 항목과 더불어 autoPilotModelName 이라는 항목도 가지게 되는 겁니다.

C++, C#, JAVA에서의 class 상속 같은 개념입니다.

반면에, type 같은 경우는 extends 키워드를 쓰지 못하는데요.

다음과 같이 교차를 통해 새로운 객체 스키마를 지정할 수 있습니다.

```js
type Car = {
    model: string;
    color: string;
}
// 교차 방식을 통해 객체를 확장하고 있습니다.
type Tesla = Car & {
  autoPilotModelName: string;
};

const newCar: Tesla = {
    model: "S",
    color: "red",
    autoPilotModelName: "xyz"
}
```

이 방식은 예전에 제가 쓰던 type 방식인데요.

interface 방식과 type 방식에 대한 호불호는 사용자가 편한 걸 쓰면 됩니다.

### Union

마지막으로, Interface와 type 방식이 Union을 대하는 방식에 차이가 있습니다.

```js
interface User  {
    email: string;
}

interface Admin  {
    email: string;
    adminKey: string;
}

// 에러 발생 : interface로 객체의 스키마를 지정할 때 Union 방식은 작동하지 않습니다.
interface Person = User | Admin;

// 정상 작동 : type 방식으로 객체의 스키마를 지정할 때는 Union 방식이 제대로 작동합니다.
type Person = User | Admin;

// 정상 작동 : interface의 항목으로는 Union 방식은 작동합니다.
interface Person {
    person: User | Admin;
}
```

위 코드에서 볼 수 있듯이 새로운 객체의 스키마를 interface 방식으로 짤 때 Union 방식은 안 됩니다.

반면, type 키워드 방식은 Union 방식이 작동하는데요.

대신, Interface로 짜는 객체의 항목에는 Union 방식을 적용할 수 있습니다.

```js
type User = {
    email: string;
}

type Admin = {
    email: string;
    adminKey: string;
}

// 정상 작동 : type 방식에서는 Union 방식이 정상 작동됩니다.
type Person = User | Admin;
```

---

지금까지 타입스크립트의 Interface에 대해 알아봤는데요.

객체를 정의하는 데 type 키워드와 interface 키워드 방식 중 어떤 걸 고르는지는 순전히 본인 마음이니까요?

이렇게 차이점만 알고 있으면 때에 따라 올바른 선택을 할 수 있을 걸로 생각합니다.

그럼.