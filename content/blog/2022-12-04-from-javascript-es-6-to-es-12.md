---
slug: 2022-12-04-from-javascript-es-6-to-es-12
title: 자바스크립트 ES6에서 ES12까지 한번에 살펴보기
date: 2022-12-04 03:09:33.404000+00:00
summary: 자바스크립트 ES6에서 ES12까지 한번에 살펴보기
tags: ["javascript", "es6", "es12"]
contributors: []
draft: false
---

![](https://blogger.googleusercontent.com/img/a/AVvXsEjEhSI8a3tH3iu3pQmae6igsoOZfO-zmCuMDXB6ht4Pkw5LfbiE0XxnF2i6IhkTE3FH0WFEg130F0NfllGTAyI7qyrc6wr3ctmQG8uHJL_X22VpLObILigeRaO1fQi5SZql8WntffhZVgcc8tiv_6L5hn38YmWpRkTftd6_x2RauBzbYGCF7-5NHrYn=s16000)

안녕하세요?

오늘은 자바스크립트 역사에 대해 알아보려고 합니다.

자바스크립트는 Brendan Eich님께서 단 10일 만에 만든 언어인데요.

웹 개발에 있어 상당한 영향을 끼친 것도 사실이지만 자바스크립트 언어의 특성상 말도 안 되는 이상함으로 인해 개선할 게 상당히 많은데요.

자바스크립트의 이상함을 나타내는 다음 코드를 보시면 아마 다른 언어 개발자분들은 기절하실 건데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEh7_dU_Ojm7CP8bstFMcB68Qw8C7L9gxNliZ1kKfo1UiCxOp6kaxIHtAdEJMeH8zRNm3UOWbnaOaIHbCG3jdyKxXFDmBZURtmRmPyXw7uQ9H_-pUcHimHIVpgeRkBKsr7msvaMwAuAcYWv22iRxX3jVt3lwQE2KTkmxByrruZSsGwda-jHJBN83afIL=s16000)

![](https://blogger.googleusercontent.com/img/a/AVvXsEihG532i3cgXk16iZRO-xL469LiSJMJZ1L3oiCavzWRVrV1y51OQqmP6PssYKvrnM_-CmGaRmoKZ7kY_qC8x217Tcvn-WzNtrx1PzyCTKaJNOX292jrtvkqQZp2zSf9s5FdMr0t-9D80lgI_id3BqFeVU8MmE3yYKI4VbFI0e6Odt-k0PdnDxs7EIJN=s16000)

그래서 자바스크립트 좀 더 멀쩡하게 작동하게끔 생긴 게 바로 ECMAScript 규격입니다.

그럼 ES6부터 ES12까지 어떤 게 자바스크립트에 추가됐는지 한번 살펴보겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEh8fhNnvzPQYA5SbGO0-ptWwOR5kKKg020Bnsd2IFnFnIyaIaZykke0SQzac4VVqQo6UzO8b92OqJD7xfXOmp6qBP5UXLm5DlTlOrU_SuA5SOVJzNbgeMw7cvx91fFND38KQXtGfbugGdqLTiZEWwrUZID4O9tlx458UtYv4VrI7N5vMN4nV15FTskE=s16000)

<hr />
## **ES6 (ES2015)**

1. **Class**

자바스크립트는 프로토타입 체인을 이용한 언어인데요,

사실 프로토타입 체인은 객체지향(OO) 언어와 비슷한 특징이 있지만 구현이 상당히 어려웠습니다.

그래서 ES6에서 드디어 class가 나왔습니다.

```
class Animal {
   constructor(name, color) {
     this.name = name;
     this.color = color;
   }
   // This is a property on the prototype chain
   toString() {
     console.log('name:' + this.name + ', color:' + this.color);

   }
 }

var animal = new Animal('myDog', 'yellow'); // instantiate
animal.toString(); // name: myDog, color: yellow

console.log(animal.hasOwnProperty('name')); //true
console.log(animal.hasOwnProperty('toString')); // false
console.log(animal.__proto__.hasOwnProperty('toString')); // true

class Cat extends Animal {
 constructor(action) {
   // The subclass must call the super function in the constructor, otherwise an error will be reported when new comes out
   // If the constructor was not written originally, the default constructor with super will be automatically generated
   super('cat','white');
   this.action = action;
 }
 toString() {
   console.log(super.toString());
 }
}

var cat = new Cat('catch')
cat.toString();

console.log(cat instanceof Cat); // true
console.log(cat instanceof Animal); // true
```

**2. Module**

각 모듈은 각각의 네임스페이스가 있어 충돌을 피할 수 있습니다.

import와 export를 쓰면 되죠.

기본적으로 .js 파일 자체가 하나의 모듈로 취급됩니다.

**3. Arrow function**

애로우 함수입니다. 다들 아실 겁니다.

```
const add = (a, b) => { return a + b};

const res = add(1, 2); // 3

// If the syntax is simple, `{}` and `return` can be omitted. It will look neater
const minus = (a, b) => a - b;
const res1 = minus(3, 1); // 2
```

**4. Function parameter default value**

함수에 파라미터를 전달하지 않고 호출하면 함수 선언에 있는 기본값이 적용됩니다.

```
function example(height = 50, width = 40) {
     const newH = height * 10;
     const newW = width * 10;
     return newH + newW;
}

example(); // 900 (50*10 + 40*10)
```

**5. Template literal**

예전에는 긴 문자열을 취급할 때 + 를 이용해서 합쳤는데요. 이제는 템플릿 리터럴을 이용해서 쉽게 쓸 수 있습니다.

```
const firstName = 'Ken';
const lastName = 'Huang';
// not use template literal
const name = 'Hello, My name is' + firstName + ', ' + lastName;
// use template literal
const nameWithLiteralString = `Hello, My name is ${firstName}, ${lastName}`;
```

**6. Destructuring assignment**

React에서 많이 쓰이는 Destructuring(디스트럭쳐링)입니다. 객체나 배열의 항목을 뽑아 쓸 때 아주 편합니다.

```
const arr = [1, 2, 3, 4, 5];
const [one, two, three] = arr;
console.log(one); // 1
console.log(two); // 2
console.log(three); // 3

// To skip certain values
const [first,,,,last] = arr;
console.log(first); // 1
console.log(last); // 5

// Objects can also be destructurized and assigned
const student = {
    name: 'Ken Huang',
    age: 38,
    city: 'Taipei'
};
const {name, age, city} = student;
console.log(name); // "Ken Huang"
console.log(age); // "38"
console.log(city); // "Taipei"
```

**7. Spread operator**

스프레드 연산자입니다.

```
const stuendts = ['Angel', 'Ryan'];
const people = ['Sara', ...stuendts, 'Kelly', 'Eason'];
conslog.log(people); // ["Sara", "Angel", "Ryan", "Kelly", "Eason"]
```

**8. Object property shorthand**

객체의 항목과 그에 대응하는 변수 이름이 같으면 생략할 수 있는 기능입니다.

```
const name = 'Angel', age = 18, city = 'ChangHwa';

// Before ES6, we must write like this
const customer = {
    name: name,
    age: age,
    city: city
} // // {name: 'Angel', age: 18, city: 'ChangHwa'}

// After ES6, we can do it
const newCustomer = {
    name,
    age,
    city
} // {name: '小明Angel, age: 18, city: 'ChangHwa'}
```

**9. Promise**

자바스크립트 콜백 지옥을 해결할 수 있는 Promise가 나왔습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgTdR2fkjTe2sodeu_c5pHCHE5thj6azVcIqIByUDgMLkrFB5jVaQdnMwrI98d8S-5H5GblzOTcZKu_5mY8AVohM_7k4YHV0WNw9uHQPIovNGl7fKgJOF9mqxabzvc9yoZqts9DLXyohapSFCYjJUIlO5J4Ju4bASVtEgFKB4R-cIWpARi52hZNf7zY=s16000)

Promise를 쓰면 콜백을 좀 더 쉽게 쓸 수 있습니다.

```
const waitSecond = new Promise((resolve, reject) => {
    setTimeout(resolve, 1000);
});
waitSecond.then( () => {
    console.log('hello World after 1 second.');
    // output this line after 1 second
    return waitSecond;
}).then( () => {
    console.log('Hell World after 2 sceond.');
    // output this line after 2second
})
```

**10. let, const to replace var**

드디어 var를 대체하는 let과 const가 나왔습니다.

초창기 var는 글로벌 스코프였는데 이제 let이 나오면서 블록단위 스코프가 가능해졌습니다.

```
console.log(a); // undefined
var a = 10;
```

```
console.log(a); // ReferenceError: Cannot access 'a' before initialization
let a = 10;
```

<hr /># **ES7 (ES2016)**

1. **Array.prototype.includes()**

배열에서 특정 값을 가지고 있으면 true를 리턴하고 그렇지 않으면 false를 리턴합니다.

```
const arr = [1, 2, 3, 4, 5];
// Check if there is the number 3 in the array
arr.include(3); // true

if (arr.include(3)) { ... }
// ... Equivalent to the previous writing of indexOf
arr.indexOf(3); // 2 (return its array position)
// If you want to write it in the if, you must add `> -1`, which is not as clear as the include in ES7 in terms of semantics
if (arr.indexOf(3) > -1) { ... }
```

**2. Exponentiation Operator**

```
console.log(2**10); // 1024
// equal to
console.log(Math.pow(2, 10)); // 1024
```

<hr /># **ES8 (ES2017)**

1. **async, await**

async, await가 나오면서 promise를 좀 더 깔끔하게 쓸 수 있게 되었습니다.

```
async test() {
    try {
        const result = await otherAsyncFunction();
        console.log(result); // output result
    } catch(e) {
        console.log(e); // Can catch errors if otherAsyncFunction() throws an error
    }
}
```

**2. Object.values()**

이 함수가 나오면서 객체 사용이 훨씬 편해졌습니다.

```
const exampleObj = {a: 1, b: 2, c: 3, d:4};
console.log(Object.value(exampleObj)); // [1, 2, 3, 4];

// To do the same thing before, use the following notation. much verbose
const values = Object.keys(exampleObj).map(key => exampleObj[key]);
```

**3. Object.entries()**

이 함수가 아마 가장 유용한 함수가 아닐까 싶네요.

```
const exampleObj = {a: 1, b: 2, c: 3, d:4};
console.log(Object.entries(exampleObj)); // [["a", 1], ["b", 2], ["c", 3], ["d", 4]];

// 가장 많이 쓰이는 예
for (const [key, value] of Object.entries(exampleObj)) {
	console.log(`key: ${key}, value: ${value}`);
}
// key: a, value: 1
// key: b, value: 2
// key: c, value: 3
// key: d, value: 4
```

**4. String padStart() & padEnd()**

pad는 좌우에 특별한 문자열로 채우는 기능을 합니다. 달력의 월을 두 자리 숫자로 만들 수 있고 아이디를 표현할 때 끝내 몇 문자를 \* 별표로 변환할 수 있습니다.

```
String.padStart(fillingLength, FillingContent);
// 첫 번째 파라미터인 filllingLength가 문자열의 길이가 fillingLength보다 작을 경우 그 나머지에 두번째 파라미터인 FillingContent를 채워 넣는 함수입니다.
```

```
// padStart
'100'.padStart(5, 0); // 00100
// 5칸인데 문자열이 3칸이라 앞에 0을 두 번 붙임.

'100'.padStart(5, '987'); // 98100
// 5칸인데 문자열이 3칸이라 앞에 987을 넣으면 되는데 남는 칸은 2칸인데 987이 세 칸이라 98만 적용됨

// padEnd
'100'.padEnd(5, 9); // 10099
// padStart와는 반대로 끝에서 덧 붙임.
'100'.padEnd(5, '987'); // 10098

// 아이디 별표 표시하기
const id = '아이디입니다'
const temp = id.slice(0, 3);
const result = temp.padEnd(id.length, '*');

console.log(result); // 아이디***
```

**5. Trailing commas**

배열 마지막에는 콤마를 못 썼었는데요, 이제는 쓸 수 있습니다.

```
[ "foo",    "baz",    "bar",    "baz",]
```

**6. Object.getOwnPropertyDescriptors()**

객체의 각 항목에 대한 Descriptor를 표시해 줍니다.

```
const exampleObj = {a: 1, b: 2, c: 3, d:4};

Object.getOwnPropertyDescriptors(exampleObj);
// {a: {…}, b: {…}, c: {…}, d: {…}}
// a: {value: 1, writable: true, enumerable: true, configurable: true}
// b: {value: 2, writable: true, enumerable: true, configurable: true}
// c: {value: 3, writable: true, enumerable: true, configurable: true}
// d: {value: 4, writable: true, enumerable: true, configurable: true}
// __proto__: Object
```

**7. SharedArrayBuffer**

**8. Atomics object**

<hr /># **ES9 (ES2018)**

1. **await in loop**

```
async function process(array) {
  for (const i of array) {
    await doSomething(i);
  }
}

async function process(array) {
  array.forEach(async i => {
    await doSomething(i);
  });
}
```

위 코드는 예상한 대로 실행되지 않을 겁니다.

그래서 ES9에서는 아래와 같이 비동기 이터레이터를 도입했습니다.

```
async function process(array) {
  for await (const i of array) {
    doSomething(i);
  }
}
```

**2. promise.finally()**

```
function process() {
  process1()
  .then(process2)
  .then(process3)
  .catch(err => {
    console.log(err);
  })
  .finally(() => {
    console.log(`it must execut no matter success or fail`);
  });
}
```

**3. Rest, Spread**

나머지 매개변수와 스프레드 연산자는 다들 React에서 잘 쓰고 계시죠?

```
function restParams(p1, p2, ...p3) {
    console.log(p1); // 1
    console.log(p2); // 2
    console.log(p3); // [3, 4, 5]
}
restParams(1, 2, 3, 4, 5);
```

```
const values = [19, 90, -2, 6, 25];
console.log( Math.max(...values) ); // 90
```

```
const myObject = {
  a: 1,
  b: 2,
  c: 3
};
const { a, ...r } = myObject;
// a = 1
// r = { b: 2, c: 3 }

// Can also be used in function input parameters
function restObjectInParam({ a, ...r }) {
    console.log(a); // 1
    console.log(r); // {b: 2, c: 3}
}

restObjectInParam({
  a: 1,
  b: 2,
  c: 3
});
```

**4. RegExp groups**

5. Regexp lookahead Negative

**6. Regexp dotAll**

<hr /># **ES10 (ES2019)**

1. **Better friendly JSON.stringify**

유니코드를 좀 더 완벽하게 지원하게 되었습니다.

**2. Array.prototype.flat() & Array.prototype.flatMap()**

reduce를 이용 안 해도 다음과 같이 flat, flatMap을 이용하면 됩니다.

```
const arr1 = [1, 2, [3, 4]];
arr1.flat(); // [1, 2, 3, 4]

const arr2 = [1, 2, [3, 4, [5, 6]]];
arr2.flat(); // [1, 2, 3, 4, [5, 6]]
// Pass in a number in flat, representing the flattening depth
arr2.flat(2); // [1, 2, 3, 4, 5, 6]
```

```
let arr = ["早安", "", "今天天氣不錯"]

arr.map(s => s.split(""))
// [["早", "安"], [""], ["今", "天", "天", "氣", "不", "錯"]]

arr.flatMap(s => s.split(''));
// ["早", "安", "", "今", "天", "天", "氣", "不", "錯"]
```

**3. String.prototype.trimStart() & String.prototype.trimEnd()**

The trimStart() 메서드는 문자열의 처음부터 화이트 스페이스를 제거하는 함수입니다.

trimLeft()sms trimStart()의 alias로 같은 함수입니다.

```
const greeting = ‘ Hello world! ‘;console.log(greeting);
// expected output: “ Hello world! “;console.log(greeting.trimStart());
// expected output: “Hello world! “;
```

`trimEnd()` 메서드는 반대로 문자열 끝에서부터 화이트 스페이스를 제거합니다.

`trimRight()` 는 trimEnd() 함수의 alias입니다.

```
const greeting = '   Hello world!   ';console.log(greeting);
// expected output: "   Hello world!   ";console.log(greeting.trimEnd());
// expected output: "   Hello world!";
```

**4. Object.fromEntries()**

`Object.fromEntries()` 메서드는 키, 밸류 형태의 배열을 해당 객체로 변환합니다.

```
const entries = new Map([
  ['foo', 'bar'],
  ['baz', 42]
]);
const obj = Object.fromEntries(entries);
console.log(obj);
// Object { foo: "bar", baz: 42 }
```

**5. String.prototype.matchAll**

```
const regexp = /t(e)(st(\d?))/g;
const str = 'test1test2';
const array = [...str.matchAll(regexp)];
console.log(array[0]);
// expected output: Array ["test1", "e", "st1", "1"]
console.log(array[1]);
// expected output: Array ["test2", "e", "st2", "2"]
```

**6. fixed catch bind**

e 파라미터를 생략할 수 있습니다.

```
try {...} catch(e) {...}

// If e is not used, it can be omitted
try {...} catch {...}
```

**7. BigInt (new number type)**

primitive 타입으로 bigint 타입이 추가됨, 숫자 끝에 n을 붙이면 됨.

또는 BitInt() 함수를 이용해도 됨

ES5: String, Number, Boolean, Null, Undefined 총 5 타입

ES6 Added: Symbol, 총 6 타입

ES10 added: BigInt, 총 7 타입

```
const theBiggestInt = 9007199254740991n;

const alsoHuge = BigInt(9007199254740991);
// ↪ 9007199254740991n

const hugeString = BigInt("9007199254740991");
// ↪ 9007199254740991n

const hugeHex = BigInt("0x1fffffffffffff");
// ↪ 9007199254740991n

const hugeBin = BigInt("0b11111111111111111111111111111111111111111111111111111");
// ↪ 9007199254740991n
```

<hr /># **ES11 (ES2020)**

1. **Promise.allSettled**

프로미스가 각각 관계가 없을 때 사용.

Promise.all()은 반대로 각각의 프로미스가 관계가 있을 때 사용.

```
const promise1 = Promise.resolve(3);
const promise2 = new Promise((resolve, reject) => setTimeout(reject, 100, 'foo'));
const promises = [promise1, promise2];
Promise.allSettled(promises).
  then((results) => results.forEach((result) => console.log(result.status)));
// expected output:
// "fulfilled"
// "rejected"
```

**2. Optional chaining `?`**

React 코드에 많이 쓰입니다.

```
const isUserExist = user && user.info;
if (isUserExist) {
    username = user.info.name;
}
```

위 코드는 아래와 같이 간략하게 사용할 수 있게 됐습니다.

```
const username = user?.info?.name;
```

이에 덧붙여 undefined 일 때 기본값을 || 를 이용해서 지정할 수 있습니다.

```
const username = user?.name || 'guest';
```

**3. Nullish coalescing operator `??`**

자바스크립트에서는 0, null, undefined는 false로 자동으로 변환되는데, 가끔 진짜 0이라는 값을 가질 때는 애매해집니다.

이때 0이라는 숫자를 별도로 취급해준다고 하면 아래와 같이 긴 코드를 써야 하죠.

```
/**
 * user = {
 *    level: 0
 * }
 */
const level = user.level || 'no level'; // output as no level instead of expected 0
// to fix it, it must use if simple processing
const level = user.level !== undefined && user.level !== null ? user.level : 'no level';
```

`??를 이용하면 아래와 같이 간단하게 사용할 수 있습니다.`

```
const username = user.level ?? 'no level';
// output 0. if level is not available, it becomes 'no level'.
```

**4. Dynamic-import**

다이내믹 임포트 뜻 그래도 필요할 때만 로드할 수 있습니다.

```
el.onclick = () => {
    import(`/js/current-logic.js`)
    .then((module) => {
        module.doSomthing();
    })
    .catch((err) => {
        handleError(err);
    })
}
```

**5. GlobalThis**

globalThis 객체는 global this를 가리킵니다.

예전에는 아래와 같이 했지만

```
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/globalThis
const getGlobal = function () {
  if (typeof self !== 'undefined') { return self; }
  if (typeof window !== 'undefined') { return window; }
  if (typeof global !== 'undefined') { return global; }
  throw new Error('unable to locate global object');
};

var globals = getGlobal();
```

이제 아래와 같이 간단하게 사용할 수 있습니다.

```
function canMakeHTTPRequest() {
  return typeof globalThis.XMLHttpRequest === 'function';
}

console.log(canMakeHTTPRequest());
// expected output (in a browser): true
```

<hr /># **ES12 (ES2021)**

1. **Promise.any**

```
const p1 = new Promise((resolve) => {
  setTimeout(() => {
    resolve('p1 resolved value')
  }, 1000)
})const p2 = new Promise((resolve) => {
  setTimeout(() => {
    resolve('p2 resolved value')
  }, 500)
})const p3 = new Promise((resolve) => {
  setTimeout(() => {
    resolve('p3 resolved value')
  }, 1800)
})Promise.any([p1, p2, p3]).then(value=>{
  console.log(value)
}) // p2 resolved value
```

**2. Logical Assignment Operator**

`||=` , `&&=` , `??=는`  `+=과 같은 방식으로 동작합니다.`

```
let b = 2
b += 1
// equal to b = b + 1let a = null
a ||= 'some random text'  // a become to'some random text'
// equal a = a || 'some random text'let c = 'some random texts'
c &&= null  // c become to null
// equal to c = c && nulllet d = null
d ??= false  // d become to false
// equal to d = d ?? false
```

**3. WeakRef**

```
class Counter {
  constructor(element) {
    // Remember a weak reference to the DOM element
    this.ref = new WeakRef(element);
    this.start();
  }

  start() {
    if (this.timer) {
      return;
    }

    this.count = 0;

    const tick = () => {
      // Get the element from the weak reference, if it still exists
      const element = this.ref.deref();
      if (element) {
        element.textContent = ++this.count;
      } else {
        // The element doesn't exist anymore
        console.log("The element is gone.");
        this.stop();
        this.ref = null;
      }
    };

    tick();
    this.timer = setInterval(tick, 1000);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = 0;
    }
  }
}

const counter = new Counter(document.getElementById("counter"));
setTimeout(() => {
  document.getElementById("counter").remove();
}, 5000);
```

지금까지 ES6에서 ES12까지 추가된 걸 살펴보았는데요.

자바스크립트는 현실에 안주하지 않고 계속 발전해 나가는 언어라서 제가 생각해도 미래가 밝다고 봅니다.

특히 React 진영의 견고함이 상당한데요.

많은 도움이 되셨으면 합니다.

그럼.
