---
slug: 2024-01-01-all-about-javascript-bind-call-apply
title: 자바스크립트 bind, call, apply 완벽 이해
date: 2024-01-01 07:16:40.234000+00:00
summary: 자바스크립트 bind, call, apply 완벽 이해
tags: ["javascript", "bind", "call", "apply"]
contributors: []
draft: false
---

안녕하세요!

오늘은 자바스크립트에서 많이 사용되지만 이해하기가 어려웠던 세 가지 중요한 메소드인 bind, call, apply에 대해 알아보겠습니다.

---

** 목 차 **

1. [this는 무엇을 가리킬까요?](#1-this는-무엇을-가리킬까요)

2. [this의 문제점](#2-this의-문제점)

3. [bind로 this 문제 해결](#3-bind로-this-문제-해결)

4. [애로우 함수와 bind, 그리고 fetch](#4-애로우-함수와-bind-그리고-fetch)

5. [bind 함수의 인수 설정](#5-bind-함수의-인수-설정)

6. [call과 apply 메소드](#6-call과-apply-메소드)

7. [apply 메소드](#7-apply-메소드)

8. [재밌는 함수 호출 방법](#8-재밌는-함수-호출-방법)

---

## 1. this는 무엇을 가리킬까요?

bind, call, apply 메소드들은 함수의 실행 문맥(context)과 관련이 높으며, 'this' 라는 키워드와도 매우 밀접한 관련이 있습니다.

bind 메소드만 이해하면 call, apply 메소드도 쉽게 이해할 수 있는데요.

bind 메소드는 쉽게 말해 함수를 재정의할 때 this 부분을 따로 지정하는 겁니다.

this는 객체 자신을 나타내는데요.

그럼, 함수에서의 this는 무엇일까요?

다음 예를 보시면 this는 일반 함수로 호출할 때 별로 신경 쓸 필요가 없습니다.

함수가 일반적인 방식으로 호출될 때(메소드로 호출되지 않을 때), this는 기본적으로 전역 객체 window를 가리킵니다.

```js
function myFunction() {
  console.log(this); // 여기서 this는 전역 객체를 가리킴 (일반 함수의 경우)
}

myFunction();
```
그러나 strict mode에서는 일반 함수 내에서의 this는 undefined가 됩니다.

```js
'use strict';

function myFunction() {
  console.log(this); // 여기서 this는 undefined (strict mode에서)
}

myFunction();
```

---

## 2. this의 문제점

문제가 되는 건 함수가 객체 안에 정의되었고, 그 함수를 이용해서 새로운 함수를 만들 때 this의 문제가 생깁니다.

그래서 이 문제를 해결하려고 bind 메소드가 존재합니다.

아래 예를 보시면, myObject라는 객체를 만들었는데요.

```js
const myObject = {
  value: 42,
  getValue() {
    console.log(this.value);
  }
};

myObject.getValue()
42 // 출력
```

단순하게 객체의 메소드로 실행하면 this의 문제는 깔끔합니다.

그러나 아래처럼 getValue 함수를 다른 변수에 대입해서 새로운 함수를 만들 때 문제가 생기는데요.

```js
const myObject = {
  value: 42,
  getValue() {
    console.log(this.value);
  }
};

const boundFunction = myObject.getValue;
boundFunction();

undefined // 출력
```

위에서처럼 객체 안의 함수 즉, myObject라는 객체 안에 정의한 함수, 여기서는 getValue 함수네요.

여기서 boundFunction 이라는 이름으로 즉 boundFunction 변수에 myObject 객체의 getValue 함수를 대입했는데요.

그러면 myObject.getValue()라고 길게 쓸 필요 없이 boundFunction() 이라고 짧게 쓸 수 있습니다.

보통 이런 경우 this가 문제가 됩니다.

위 코드에서는 boundFunction 이라는 함수가 생성될 때 this는 없는 거죠.

함수를 변수에 할당하면서 함수의 참조만을 전달하게 되고, 이 경우에서는 함수가 단독으로 호출되었으므로 this는 전역 객체를 참조합니다.

여기서 전역 객체는 브라우저에서는 window가 되고 Nodejs에서는 global 이 됩니다.

따라서 함수 내부의 this는 전역 객체인 window를 가리킵니다. 따라서 this.value가 window.value를 참조하게 됩니다.

window 전역객체에는 value 라는 항목이 없으니까 당연히 undefined가 출력되겠죠.

이 문제를 해결하기 위해 bind가 존재합니다.

---

## 3. bind로 this 문제 해결

아래와 같이 bind 메소드를 사용하면 this 문제를 손쉽게 해결할 수 있습니다.

```js
const myObject = {
  value: 42,
  getValue() {
    console.log(this.value);
  }
};

const boundFunction = myObject.getValue.bind(myObject);
boundFunction(); // 출력: 42
```

bind는 this를 찾아주는 역할을 하는데요.

위 코드에서는 myObject가 this라고 찾아주는 겁니다.

```js
const myObject = {
  value: 42,
  getValue() {
    console.log(`myObject 안에서의 ${this.value}`);
  },
  yourObject : {
  	value: 30,
  	getValue() {
  		console.log(`yourObject 안에서의 ${this.value}`);
  	},
  },
};
```

위와 같은 코드가 있습니다.

객체 myObject 안에 또 다른 객체 yourObject가 있네요.

yourObject도 value 항목과 getValue 함수가 있습니다.

각각의 getValue 함수를 실행해 볼까요?

```js
myObject.getValue()
myObject 안에서의 42  // 출력값

myObject.yourObject.getValue()
yourObject 안에서의 30 // 출력값
```

예상했던 데로 그대로 출력되고 있습니다.

그러면 조금 더 어렵게 아래와 같이 해볼까요?

```js
const boundFunction = myObject.yourObject.getValue.bind(myObject);
boundFunction();

yourObject 안에서의 42 // 출력값
```

우리가 의도한 데로 작동하네요.

```js
const boundFunction2 = myObject.yourObject.getValue.bind(myObject.yourObject);
boundFunction2();
yourObject 안에서의 30 // 출력값
```

이렇게 bind를 이용하면 우리가 원하는 this 값을 지정할 수 있습니다.

좀 더 다른 예를 들어 볼까요?

```js
const myObject = {
  value: 42,
  getValue() {
    console.log(`myObject 안에서의 ${this.value}`);
  },
  yourObject : {
  	value: 30,
  	getValue() {
  		console.log(`yourObject 안에서의 ${this.value}`);
  	},
  },
};

const herObject = {
	value: 22,
}

const boundFunction3 = myObject.getValue.bind(herObject);
boundFunction3();
myObject 안에서의 22 // 출력값
```

위 코드에서는 새로운 객체 herObject를 만들었고, bind를 이용해서 this를 herObject의 this를 사용하라고 지정한 꼴입니다.

어떤가요? 이제 bind가 쉽게 눈에 들어오죠?

여기까지 읽어보면서 확실 시 배운 것은 bind는 객체 안의 함수 즉, 메소드가 재정의 될 때 this 문제를 해결하기 위해 나온 거라는 걸 알 수 있을 겁니다.

---

## 4. 애로우 함수와 bind, 그리고 fetch

그러면 React 코드에서 가장 많이 쓰이는 애로우 함수의 경우 bind 문제에 대해 살펴봅시다.

일단 가장 중요한 개념을 외우고 가겠습니다.

> 애로우 함수는 자신만의 this를 생성하지 않고, 외부 스코프의 this를 그대로 사용합니다.

```js
const myArrowFunction = () => {
  console.log(this); // 여기서 this는 외부 스코프의 this를 그대로 사용
};

myArrowFunction();

```
위 코드의 실행값은 Window가 됩니다.

애로우 함수는 자신만의 this를 생성하지 않고 외부 스코프의 this를 그대로 사용하기 때문에 외부 스코프는 전역 객체 즉, window가 되는 거죠.

애로우 함수가 유용한 거는 fecth 함수를 사용할 때인데요.

```
const ourUsers = {
  users: [],
  getUsers() {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(function (response) {
        return response.json();
      })
      .then(function (users) {
        this.users = users;
        console.log(this)
      })
  }
}

ourUsers.getUsers();

console.log(ourUsers.users);

```

위와 같이 ourUsers 라는 객체에다 users라는 변수와 그 변수에 값을 채워줄 함수까지 모든 걸 정의했습니다.

결과를 볼까요?

```bash
node main.js
[]
<ref *1> Object [global] {
  global: [Circular *1],
  queueMicrotask: [Function: queueMicrotask],
  clearImmediate: [Function: clearImmediate],
  setImmediate: [Function: setImmediate] {
    [Symbol(nodejs.util.promisify.custom)]: [Getter]
  },
  structuredClone: [Function: structuredClone],
  clearInterval: [Function: clearInterval],
  clearTimeout: [Function: clearTimeout],
  setInterval: [Function: setInterval],
  setTimeout: [Function: setTimeout] {
    [Symbol(nodejs.util.promisify.custom)]: [Getter]
  },
  atob: [Function: atob],
  btoa: [Function: btoa],
  performance: Performance {
    nodeTiming: PerformanceNodeTiming {
      name: 'node',
      entryType: 'node',
      startTime: 0,
      duration: 966.5752220153809,
      nodeStart: 5.734618991613388,
      v8Start: 10.44633799791336,
      bootstrapComplete: 36.901437014341354,
      environment: 21.501132994890213,
      loopStart: 132.15967100858688,
      loopExit: -1,
      idleTime: 774.010709
    },
    timeOrigin: 1704091480940.721
  },
  fetch: [AsyncFunction: fetch],
  users: [
    {
      id: 1,
      name: 'Leanne Graham',
      username: 'Bret',
      email: 'Sincere@april.biz',
      address: [Object],
      phone: '1-770-736-8031 x56442',
      website: 'hildegard.org',
      company: [Object]
    },
    {
      id: 2,
      name: 'Ervin Howell',
      username: 'Antonette',
      email: 'Shanna@melissa.tv',
      address: [Object],
      phone: '010-692-6593 x09125',
      website: 'anastasia.net',
      company: [Object]
    }
  ]
}
```

users는 원래 10개가 나오는데요.

길어서 2개만 남겨놨습니다.

출력 결과는 대성공인데요.

아닙니다.

users라는 항목이 어디에 붙어있나면 global 이라는 전역 객체에 붙어있습니다.

위 코드는 Nodejs로 실행했고 그래서 전역 객체는 global이 되는 거죠.

fetch 문을 작성할 때 우리가 생각한 this가 제대로 작동하지 않아서입니다.

왜 이런 문제가 생기는지 생길까요?

이유는 단순합니다.

서두에 얘기했었는데 함수 정의할 때 function 방식으로 정의하면 function 함수안의 this는 전역 변수가 됩니다.

이 코드에서 this.users가 전역 객체가 아니라 ourUsers 객체의 users 속성으로 설정되지 않는 이유는 JavaScript에서 함수의 실행 문맥(context)에 따라 this가 동적으로 결정되기 때문입니다.

fetch 함수 내에서의 this는 ourUsers.getUsers 함수의 this와 다릅니다.

일반적인 함수 선언에서는 함수가 호출될 때 this가 동적으로 바인딩되어 해당 함수를 호출한 컨텍스트에 의해 결정됩니다.

그러나 fetch 함수는 비동기적인 특성을 가지고 있어 콜백 함수의 this는 전역 객체를 가리키게 됩니다.

이 문제를 해결하려면 몇 가지 방법이 있습니다. 

바로 애로우 함수 사용인데요.

화살표 함수는 자체적인 this를 생성하지 않고 외부 스코프의 this를 그대로 사용합니다.

```js
const ourUsers = {
  users: [],
  getUsers() {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json())
      .then(users => {
        this.users = users;
        console.log(this);
      });
  }
};

ourUsers.getUsers();
```

bind 메소드 사용해서도 고칠 수 있습니다.

bind 메소드를 사용하여 콜백 함수 내의 this를 원하는 값으로 고정할 수 있습니다.

```js

const ourUsers = {
  users: [],
  getUsers() {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(function (response) {
        return response.json();
      })
      .then(function (users) {
        this.users = users;
        console.log(this);
      }.bind(this)); // bind를 사용하여 this를 고정
  }
};

ourUsers.getUsers();
```

프라미스 체인 내에서 변수 사용 방법으로 가능합니다.

프라미스 체인 내에서 외부 변수를 사용하여 this 값을 유지할 수 있습니다.

```js
const ourUsers = {
  users: [],
  getUsers() {
    const self = this; // 외부 변수에 this 할당
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(function (response) {
        return response.json();
      })
      .then(function (users) {
        self.users = users; // 외부 변수 사용
        console.log(self);
      });
  }
};

ourUsers.getUsers();
```

어떤 방법을 선택하든, fetch 함수 내부에서 this를 올바르게 유지하기 위해서는 추가적인 조치가 필요합니다.

async, await 함수를 이용한 경우에도 동일합니다.



async, await 함수를 이용한 경우도 this는 애로우 함수를 이용하면 동일한 결과가 나옵니다.

```
const ourUsers = {
  users: [],
  async getUsers() {
    const res = await fetch('https://jsonplaceholder.typicode.com/users')
    this.users = await res.json();
    console.log(this)
  }
}

ourUsers.getUsers()
console.log(ourUsers.users);
```

출력 결과는 아래와 같습니다.

```bash
node main.js
[]
{
  users: [
    {
      id: 1,
      name: 'Leanne Graham',
      username: 'Bret',
      email: 'Sincere@april.biz',
      address: [Object],
      phone: '1-770-736-8031 x56442',
      website: 'hildegard.org',
      company: [Object]
    },
    {
      id: 2,
      name: 'Ervin Howell',
      username: 'Antonette',
      email: 'Shanna@melissa.tv',
      address: [Object],
      phone: '010-692-6593 x09125',
      website: 'anastasia.net',
      company: [Object]
    },
  ],
  getUsers: [AsyncFunction: getUsers]
}
```

아주 잘 작동하네요.

출력결과의 첫 번째 행이 빈 배열 '[]'인 이유는 console.log가 먼저 실행됐기 때문입니다.

그리고 두 번째 줄부터 나오는 건 console.log(this)에 의한 this가 출력된 거죠.

이 this는 바로 ourUsers 객체이고요.

---

## 5. bind 함수의 인수 설정

bind 메소드는 두 번째 이후의 인수를 바인딩된 함수로 전달할 수 있습니다.

이를 활용하면 미리 지정된 인수를 가진 함수를 생성할 수 있습니다.

```js
function greet(greeting, name) {
  console.log(`${greeting}, ${name}!`);
}

const sayHello = greet.bind(null, 'Hello'); // 첫 번째 인수를 'Hello'로 고정

sayHello('John'); // 출력: Hello, John!
sayHello('Jane'); // 출력: Hello, Jane!
```

위 예제에서 bind 메소드를 사용하여 sayHello 함수를 생성할 때, 첫 번째 인수인 greeting을 'Hello'로 고정했습니다. 이후에 sayHello를 호출할 때 두 번째 인수만 전달하면서 greeting은 이미 고정되어 있습니다.

이와 같은 기능은 콜백 함수에서 특정한 인수를 고정하여 사용할 때 유용하게 활용될 수 있습니다.

---

## 6. call과 apply 메소드

call과 apply 메소드는 함수를 즉시 호출하면서 this 값을 지정할 수 있게 해 줍니다.

주요 차이는 매개변수를 전달하는 방식인데요.

먼저, call 메소드를 알아보겠습니다.

call 메소드는 함수를 즉시 호출한다고 했는데요.

bind를 이용해서도 함수를 즉시 호출할 수 있습니다.

```js
function greet(name) {
  console.log(`Hello, ${name}!`);
}

greet.bind(null, "Korea")();
Hello, Korea!   // 출력값
```

위와 같이 greet 함수의 bind에 첫 번째로 넣은 건 this인데요.

여기서는 this가 필요 없다고 판단해 null을 넣었습니다.

그리고 두 번째 인수부터 함수의 인수값을 넣었죠.

그리고 맨 끝에 '()' 표시를 해서 bind 된 함수를 바로 실행했습니다.

이렇게 하는 걸 call 메소드로 쉽게 할 수 있습니다.

call 메소드는 함수를 호출하면서 각각의 매개변수를 순서대로 전달합니다.

```js
function greet(name) {
  console.log(`Hello, ${name}!`);
}

greet.call(null, 'John'); // 출력: Hello, John!
```
위의 예제에서 call 메소드는 greet 함수를 호출하면서 this를 null로 설정하고, 'John'을 매개변수로 전달했습니다.

즉, call 메소드는 bind 후의 함수의 실행 '()'까지 포함한 겁니다.

---

## 7. apply 메소드

call과 apply는 JavaScript에서 함수를 호출할 때 사용되는 메소드로, 주된 차이는 인수를 전달하는 방식에 있습니다.

apply 메소드는 함수를 호출하면서 매개변수를 배열로 전달합니다.

```js
function greet(name, greeting) {
  console.log(`${greeting}, ${name}!`);
}

greet.apply(null, ['John', 'Hola']); // 출력: Hola, John!
```

여기서 apply 메소드는 greet 함수를 호출하면서 this를 null로 설정하고, 매개변수를 배열 ['John', 'Hola']로 전달했습니다.

따라서, call과 apply의 주된 차이점은 매개변수를 전달하는 방식이며, 그 외에는 동일한 기능을 수행합니다.

일반적으로는 call과 apply 중 선택하는 것은 매개변수를 어떻게 전달할지에 따라 결정됩니다.

유연한 배열 사용이 필요하다면 apply를 사용할 수 있습니다. ES6 이후에는 화살표 함수와 전개 연산자(...)를 사용하여 함수 호출 시 가변 인수를 처리하는 경우가 늘어나면서 apply의 사용 빈도가 줄었습니다.

---

## 8. 재밌는 함수 호출 방법

인수를 'a,b'로 받는 add 함수를 아래와 같이 작성했습니다.

그리고 실행하기 위해 add(1,2)라고 호출하는게 일반적인데요.

```js
function add(a,b){
  console.log(a+b)
}
add(1,2)
```


bind, call, apply를 이용하여 좀 더 재밌는 add 함수 호출방법 알아봅시다.

```js
function add(a,b){
  console.log(a+b)
}
add(1,2)
add.bind(null, 1, 2)()
add.call(null, 1, 2)
add.apply(null, [1, 2])
```

위 코드를 이해할 수 있으면 bind, call, apply를 모두 이해하신 겁니다.

그럼.
