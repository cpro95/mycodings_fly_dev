---
slug: 2022-08-04-understanding-javascript-es-6-destructuring-of-an-object
title: 자바스크립트 ES6 - 객체의 디스트럭쳐링(구조 분해 할당)
date: 2022-08-04 11:36:51.095000+00:00
summary: 자바스크립트 ES6 강좌 - 객체(Object)의 디스트럭쳐링(destructuring - 구조 분해 할당)
tags: ["javascript", "es6", "destructuring", "object"]
contributors: []
draft: false
---

![mycodings.fly.dev-destructuring-of-object-in-es6-javascript](https://blogger.googleusercontent.com/img/a/AVvXsEjrn2lGsq7w2ZADFBh-Vv6Y8aiH-Pld8hVbqiZ0luMao_r6_3PzTvtm2e8KDJ3872rE683lBZoKjZDqQuHreosGWSeAJwdGFF06Oi8nyJBhDdyFERDHsNoI8-V5dkFC3oReAOAfAtHExTKtArQpjswFrlNlLDnYcSagXIkRWHtNAEb4YYF5PKa6WX30=s16000)

안녕하세요?

지난 시간에 이어 이번 시간에도 자바스크립트의 ES6의 신기능인 디스트럭쳐링에 대해 알아보겠습니다.

## 객체 디스트럭쳐링(Object Destructuring)

다음과 같은 객체가 있다고 가정하고 디스트럭쳐링 해보겠습니다.

```js
let person = {
    firstName: 'John',
    lastName: 'Doe'
};
```

ES6 이전의 자바스크립트 세상에서는 다음과 같은 방법이 유일했는데요.

```js
let firstName = person.firstName;
let lastName = person.lastName; 
```

ES6로 넘어오면서 객체의 디스트럭쳐링 기능이 생겼습니다.

아래와 같이 하면 객체의 디스트럭쳐링이 가능한데요.

```js
let { firstName: fname, lastName: lname } = person;
```

person 객체의 첫 번째 항목인 firstName에 대해 fname 이란 변수에 할당하고, 두 번째 항목인 lastName에 대해서는 lname이라는 변수에 할당하는 코드입니다.

좀 더 정확한 표준 규격은 아래와 같습니다.

```js
let { property1: variable1, property2: variable2 } = object;
```

콜론(:) 앞에 있는 것이 객체의 속성(항목)이고, 두 번째가 그 속성(항목)을 받아내는 변수입니다.

콜론 앞 뒤 순서는 객체를 서술할 때와 같으니까 헷갈리지 마시고요.

그런데 실제로는 아래와 같이 person 객체를 디스트럭쳐링합니다.

```js
let { firstName, lastName } = person;

console.log(firstName); // 'John'
console.log(lastName); // 'Doe'
```

왜 그런 걸까요?

ES6의 특성상 'firstName: firstName'이라고 항목과 그에 해당하는 변수의 이름이 같으면 그냥 변수 이름만 쓰면 됩니다.

그래서 'firstName'이라고 해도 ES6에서는 firstName 항목을 firstName 변수에 할당하게 됩니다.

만약에 위 코드에서 let을 빼고 선언과 할당을 동시에 하고 싶으면 let 키워드를 뺀 상태에서 전체 앞뒤를 괄호()로 감싸면 됩니다.

```js
({firstName, lastName} = person);
```

## 객체 디스트럭쳐링 시 없는 항목은 어떻게 처리되는가요?

```js
let { firstName, lastName, middleName } = person;
console.log(middleName); // undefined
```

배열 디스트럭쳐링처럼 객체 디스트럭쳐링에서도 매칭이 되지 않는 즉, 위 코드에서 보면 middleName 항목은 'undefined'로 할당됩니다.

---

## 객체 디스트럭쳐링시 디폴트 값 지정하기

디폴트 값을 지정하려면 아래와 같이 하면 됩니다.

```js
let person = {
    firstName: 'John',
    lastName: 'Doe',
    currentAge: 28
};

let { firstName, lastName, middleName = '', currentAge: age = 18 } = person;

console.log(middleName); // ''
console.log(age); // 28
```

위 예에서 보듯이 person 객체에서는 middleName 항목이 없습니다.

그래서 middleName 항목에 빈 문자열을 디폴트 값으로 지정했습니다.

그리고 마지막으로 디스트럭쳐링 한 항목이 currentAge인데요.

currentAge는 특이하게 항목과 그에 대한 변수 이름을 지정했습니다.

왜냐하면 앞에 middleName이라는 세 번째 디스트럭쳐링이 실제 person 객체의 항목과 맞지 않기 때문에,

이렇게 특별하게 지정한 겁니다.

그리고 currentAge에 대한 변수 age에 대해서도 18이라고 디폴트 값을 지정했으나, 실제 출력되는 값은 28입니다.

왜 그런 걸까요?

당연히 디폴트 값은 디스트럭쳐링 할 때 값을 없을 때를 대비하는 거라서 값이 있는 경우 디폴트 값은 무용지물이 됩니다.

```js
let person = {
    firstName: 'John',
    lastName: 'Doe',
    middleName: 'C.',
    currentAge: 28
};

let { firstName,  lastName, middleName = '', currentAge = 18 } = person;

console.log(middleName); // 'C.'
console.log(age); // 28
```

![mycodings.fly.dev-destructuring-of-object-in-es6-javascript](https://blogger.googleusercontent.com/img/a/AVvXsEgMOkfzKuHWBCTfgsNEIjEZmOFgkoCGReiHKZpSZqNf9_6giKLKjh5Q7lo1t2n6H-EPwGb5jkrN6HxIUq1EZzCXISRYux2XSKXfcTjntpiOOZQOIIgpzOXD0XgDq91th1OO4AqmDOZ4e4tCkf15kdhTQYtwfbWDkAow1Jg74lCTjWbn1sMdT_2O6JZL=s16000)

---

## null 객체의 디스트럭쳐링

만약에 함수가 객체를 반환하는데 특정 경우 null을 리턴할 경우 디스트럭쳐링은 어떻게 될까요?

```js
function getPerson() {
    return null;
}

let { firstName, lastName } = getPerson();

console.log(firstName, lastName);
```

위 코드를 실행하면 아래 그림과 같이 TypeError가 발생합니다.

![mycodings.fly.dev-destructuring-of-object-in-es6-javascript](https://blogger.googleusercontent.com/img/a/AVvXsEg9nszk7-r8r3ZgBeeyM_wlKIIHo6-c0X9rQ89PZLygTBQyQ7QExRBnZLRm4MV_8ttuDiecMOtrTnfJDtZwLZOGA5Fr1y6X9ilQoAB1jJyC_GtM_O2B2WJUIL_Oip8ObEUuZR_w3FLZsNxldf6ibEYvlRcGzZewDqIwSU90AJrR39C-u7iW5M4AbiVn=s16000)

```js
Uncaught TypeError: Cannot destructure property 'firstName' of 'getPerson(...)' as it is null.
```

이럴 경우 배열 디스트럭쳐링에서도 그랬듯이 OR 연산자(||)를 이용하여 null 객체에 대해 우회(fallback) 시키는 게 좋습니다.

```js
let { firstName, lastName } = getPerson() || {};
```

위와 같이 하면 firstName과 lastName에 대해서는 'undefined'가 할당되게 됩니다.

아래 그림을 보시면 'undefined'가 나오는 게 보이시죠?

![mycodings.fly.dev-destructuring-of-object-in-es6-javascript](https://blogger.googleusercontent.com/img/a/AVvXsEh9NjBsEeQ4Y6mfwj9kAj7uQKvKlzWZH4bf8wZVTPgd9jrSmVLrEAHEO_X85WwrATdLwCxueYlVfOJlib2KPFziY-I4B-UciTQCJWsPV5jCFEFpgrvEY8LwebHghLOj16iHCoFU7t9oHy7MsEqUM1HHQA_6bqQ0D0UBfh5Hlmhk_4MStzS-epB7TSNi=s16000)

---

## 중첩된 객체의 디스트럭쳐링

중첩된 객체라도 디스트럭쳐링 할 수 있는데요.

```js
let employee = {
    id: 1001,
    name: {
        firstName: 'John',
        lastName: 'Doe'
    }
};
```

위 코드를 보시면 employee 객체 안에는 또 name이라는 객체가 있습니다.

이걸 한번 디스트럭쳐링 해볼까요?

```js
let {
    name: {
        firstName,
        lastName
    }
} = employee;

console.log(firstName); // John
console.log(lastName); // Doe
```

~[mycodings.fly.dev-destructuring-of-object-in-es6-javascript](https://blogger.googleusercontent.com/img/a/AVvXsEga3Ot4SGqG5rcaLlgnTgW7Qymx99vILMncqAQ3hzCuZpJxsZWnEV7RXUN0KpBLgM6TW0S36Kz7lNNFqnG3O3ic0nab5sY0e89jVyM0iFmoi1AEWEWYs0uqgaDEIWAiFEmmj6lrMIjGb0EzrbZjOAkWhyutW1z1cIPZikVF257Hs2TQNCrXcd-8wD8Q=s16000)


실행 결과는 깔끔하게 나옵니다.

여기서 신기한 점은 중복된 변수 할당도 가능한데요.

위에서 처럼 firstName과 lastName 변수에 데이트를 할당하고 그리고 name 객체를 또다시 받는 변수를 할당하고 싶을 때는 다음과 같이 하면 됩니다.

```js
let employee = {
    id: 1001,
    name: {
        firstName: 'John',
        lastName: 'Doe'
    }
};

let {
    name: {
        firstName,
        lastName
    },
    name
} = employee;

console.log(firstName); // John
console.log(lastName); // Doe
console.log(name); // { firstName: 'John', lastName: 'Doe' }
```

![mycodings.fly.dev-destructuring-of-object-in-es6-javascript](https://blogger.googleusercontent.com/img/a/AVvXsEg3VBkmG8wtgADzKxyBRsYxbISN_SNIEcsUmoMQYM6WKFSbFRkuMAgc_k099XW0xkHBSnlwRUaPIYpAJYz85W7WK8oDUEo1AYS-8fMFvjlSYucFDch1plpWf2UpKTRLEcAVr2l4ddnzcBI6iImW2DPqOEtLth4clBHElxcQYvUPaI-uXWLopyOBGZN-=s16000)

어떤가요?

name 이름으로 기존 employee 객체에서 중첩된 내부 객체인 name 객체를 그대로 디스트럭쳐링 했습니다.

---

## 함수의 인자로 객체를 받았을 경우 디스트럭쳐링 하기

React 코드를 작성하다 보면 함수의 인자로 객체를 받는 경우가 많은데요.

만약에 다음과 같은 코드가 있다고 합시다.

```js
let display = (person) => console.log(`${person.firstName} ${person.lastName}`);

let person = {
    firstName: 'John',
    lastName: 'Doe'
};

display(person);
```

![mycodings.fly.dev-destructuring-of-object-in-es6-javascript](https://blogger.googleusercontent.com/img/a/AVvXsEhrMhvxMeNIjngaQDq38Yp00fki938yl8R9BeVrfkpcHCIwGq-km4TrcL7YGdUkMa-Gu6if6xr3uhFyDsVArrt5xgIb9VzOlbVgK17RXLYqjmO97olTyNgwmmDdvWT0HYhmfHkYzUVmKHWNZxK4dOTwEhNzFQPblh702yVlzucPEcUU6K2uo5aJvHV1=s16000)

display 함수의 기능은 간단합니다.

person이라는 객체를 받아서 단순하게 console.log 하고 있는데요.

console.log 하는 내용은 스트링 리터럴로 표현했고, 객체의 이름과 항목을 나열한 방식을 쓰고 있습니다.

뭔가 ES5 스타일 같지 않습니까?

한번 그럴듯하게 객체 디스트럭쳐링을 사용하여 바꿔 볼까요?

```js
let display = ({firstName, lastName}) => console.log(`${firstName} ${lastName}`);

let person = {
    firstName: 'John',
    lastName: 'Doe'
};

display(person);
```

어떤가요?

React 코드에서도 많이 봤듯이 display 함수의 인자를 바로 디스트럭쳐링해서 쓰고 있습니다.

뭔가 더 의미 전달이 쉬워 보이지 않나요?

그럼