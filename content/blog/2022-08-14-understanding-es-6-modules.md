---
slug: 2022-08-14-understanding-es-6-modules
title: 자바스크립트 ES6 - 모듈(modules)
date: 2022-08-14 00:07:21.839000+00:00
summary: 자바스크립트 ES6 모듈 export, import 쉽게 이해
tags: ["es6", "javascript", "module"]
contributors: []
draft: false
---

![mycodings.fly.dev-understanding-es-6-modules](https://blogger.googleusercontent.com/img/a/AVvXsEhBV54lKT1y640jN1LBNLS8oFj_h70jK0pZhXmZcJGpVgKrntD7RDGTBFY7M3teG8idIVrlaBwlY8SiQKXkUL_P6_m98hGjrFLX0ziuPgwGEfkMgNBw144S2rim4raP_Z9Ho_SkevGcKFDneDLxxZHp_HfNAi9vzpFmI9W2D2fWWD6IXDUJlMJVMyrv)

안녕하세요?

오늘은 ES6의 모듈(module)에 대해 알아보겠습니다.

모듈은 자바스크립트 프로그래밍에 있어 굉장히 중요한 역할을 하는데요.

코드를 분할하여 좀 더 쉬운 관리가 가능하게 하고, 확장성에 용이합니다.

그러면 이 모듈을 이용해서 변수, 함수, 클래스를 import나 export를 어떻게 하는지 알아보겠습니다.

참고로 ES6의 모듈은 엄격 모드(strict mode)에서만 적용됩니다.

즉, 모듈에서 선언된 변수나 함수가 자동으로 전역 스코프에 적용되지 않는다는 점입니다.

---

## 웹 브라우저에서 모듈 실행하기

일단 message.js라는 파일이 아래와 같이 있다고 합시다.

```js
export let message = 'ES6 Modules';
```

message.js 파일은 ES6에서 보면 message라는 변수를 가지고 있는 모듈입니다.

그리고 export 명령어를 통해 message라는 변수를 다른 모듈에 노출시키고 있습니다.

즉, export로 변수나 함수를 외부에 노출하여 외부 모듈에서 사용하라고 하는 겁니다.

그럼, 이 모듈을 받아서 코드를 확장하는 다른 모듈을 만들어 볼까요?

아래와 같이 app.js 파일을 만들어 보겠습니다.

```js
import { message } from './message.js';

const hello = 'Hello '+ message;

console.log(hello);
```

위 코드를 보시면 message.js 모듈이 export한 message 변수를 app.js에서 import하여 사용하고 있습니다.

간단한 모듈 사용 로직을 만들었으니, 웹 페이지에 적용해 볼까요?

다음과 같은 HTML 파일을 만듭시다.

```js
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>ES6 Modules</title>
  </head>
  <body>
    <script type="module" src="./app.js"></script>
  </body>
</html>
```

위 HTML 파일을 보시면 app.js파일을 불러올 때 아예 type을 module라고 지정했습니다.

ES6 기능인 거죠.

---

## Exporting

이제 export에 대해 좀 더 자세히 살펴보겠습니다.

우리가 한 모듈에서 변수나, 함수 또는 클래스를 다른 모듈에서 쓰이게끔 하려면 export 키워드를 통해 외부 노출을 해줘야 합니다.

익스포트(export)하는 방식은 아래와 같은 형식이 쓰입니다.

```js
// log.js
export let message = 'Hi';

export function getMessage() {
  return message;
}

export function setMessage(msg) {
  message = msg;
}

export class Logger {
}
```

log.js 모듈에서 export 하는 방식은 위와 같이 변수, 함수, 클래스 어떤 것이든 가능합니다.

대신에 export 하려면 함수나 클래스의 이름이 꼭 있어야 합니다.

즉, 익명 함수나 익명 클래스는 export가 안 됩니다.

그리고 export는 나중에 한꺼번에 가능합니다.

위 코드에서 각각 export 했지만 아래 코드에서는 한꺼번에 모아서 export 했습니다.

```js
// log.js
let message = 'Hi';

function getMessage() {
  return message;
}

function setMessage(msg) {
  message = msg;
}

class Logger {
}

export message, getMessage, setMessage;
```

그리고 위 코드에서 보면 제가 일부로 Logger 클래스를 exort 안 했습니다.

그러면 log.js 모듈의 Logger 클래스는 외부 모듈에서 사용할 수 없다는 뜻입니다.

---

## Importing

우리가 한 모듈에서 export했으면 이제, 다른 모듈에서 export된 모듈의 변수, 함수, 클래스를 import하여 사용할 수 있습니다.

```js
import { what, ever } from './other_module.js';
```

임포트(import)하려면 괄호 '{ }' 안에 해당 변수나, 함수, 클래스 이름을 나열하면 됩니다.

그러면 export 한 모듈에서의 원래 변수나, 함수, 클래스가 import 한 모듈과 바인딩이 되는 겁니다.

바인딩이 됐다는 의미는 import 한 모듈에서 import 된 변수, 함수, 클래스를 수정할 수 없고, 또 이름이 중복되면 안 된다는 뜻입니다.

예를 들어 볼까요?

```js
// greeting.js
export let message = 'Hi';

export function setMessage(msg) {
  message = msg;
}

// app.js
import {message, setMessage } from './greeting.js';
console.log(message); // 'Hi'

setMessage('Hello');
console.log(message); // 'Hello' 

message = 'Hallo'; // error
```

위 코드에서 greeting.js 모듈에 있는 message란 변수를 마지막 줄 코드에서 app.js 파일에서 강제 할당하고 있는데요.

이렇게 하면 에러가 발생합니다. 모듈 간 변수가 바인딩됐기 때문에 직접 수정할 수 없다는 뜻입니다.

쉽게 이해하시려면 모듈에서 import한 변수나, 함수, 클래스가 const 지정자로 선언됐다고 이해하시면 편할 겁니다.

---

## 개별 import하기

개별 import는 아래와 같이 한 개의 변수만 export하고 다시 import하는 것을 뜻합니다.

```js
// foo.js
export foo = 10;

// app.js
import { foo } from './foo.js';
console.log(foo); // 10;

foo = 20; // throws an error
```

foo.js 파일에서 foo라는 변수를 export 했고, 그다음 app.js 모듈에서 그걸 import하고 사용했습니다.

개별 import 방식인데요.

그리고 코드 마지막 줄처럼 import된 foo 변수에는 직접 값을 할당할 수 없습니다.

foo 변수가 const로 선언되었다고 생각하시면 에러가 나는 이유를 쉽게 납득하실 수 있을 겁니다.

## 여러 개 import하기

아래와 같이 cal.js파일이 있고 cal.js 파일에는 여러 변수와 함수를 export하고 있는데요.

```js
// cal.js
export let a = 10,
           b = 20,
           result = 0;

export function sum() {
  result = a + b;
  return result;
}

export function multiply() {
  result = a * b;
  return result;
}
```

아래 app.js 모듈에서는 cal.js 모듈에서 export한 걸 import하고 있습니다.

```js
//app.js
import {a, b, result, sum, multiply } from './cal.js';
sum();
console.log(result); // 30

multiply();
console.log(result); // 200
```

여러 개를 import 하려면 괄호 { } 안에 그냥 나열하면 여러 개를 동시에 import 할 수 있습니다.

## 전체 모듈을 한 개의 객체로 import 하기

타입스크립트 코드에서 아래와 같은 형식을 많이 보셨을 듯싶은데요.

전체 모듈을 우리가 지정한 이름의 객체로 한꺼번에 import하는 방식입니다.

```js
import * as cal from './cal.js';
```

이렇게 import하면 cal.js 파일의 변수나 함수는 객체 cal의 속성으로 참조할 수 있습니다.

```js
cal.a;
cal.b;
cal.sum();
```

이런 방식을 영어로는 'Namespace Import'라고 부릅니다.

그리고 import에 있어 중요한 게 아래 코드처럼 한 개의 모듈을 여러 번 import한다고 해도 해당 모듈은 한 번만 실행된다는 점입니다.

```js
import { a } from './cal.js';
import { b } from './cal.js';
import { result } rom './cal.js';
```

위 코드에서 첫 번째 줄이 실행되면 cal.js는 메모리에 로드되고, 두 번째 줄이 실행될 때 한번 로드된 cal.js 모듈을 메모리상에서 재사용하는 방식입니다.

그래서, cal.js 모듈에 있는 명령어는 한 번만 실행된다는 뜻입니다.

---

## import, export의 제한사항

임포트(import)나 익스포트(export)에 있어 제한 사항이 있는데요.

바로 import나 export 명령은 다른 명령어나 함수 바깥에 위치해야 한다는 뜻입니다.

그냥 단순하게 import나 export를 함수 안에서는 사용할 수 없다고 이해하시면 됩니다.

```js
if ( requiredSum) {
  export sum;
}

function importSum() {
  import { sum } from './cal.js';
}
```

위와 같이 export, import를 함수 안에서 사용하면 안 됩니다.

왜냐하면 자바스크립트에서는 import, export할 대상이 정적으로 정해져야 하기 때문입니다.

참고로 ES6의 다음 버전인 ES2020에서는 다이내믹하게 import 할 수 있는 import() 객체가 도입되었는데요.

오늘은 ES6를 공부하는 날이니까 다음에 알아보도록 하겠습니다.

---

## Aliasing (별칭)

자바스크립트에서는 import할 때나 export할때 별칭을 지정할 수 있는데요.

바로 아래와 같이 as 키워드를 쓰면 됩니다.

```js
// math.js  
function add( a, b ) {
   return a + b;
}

export { add as sum };
```

```js
import { sum as total } from './math.js';
```

위와 같이 export 할 때 add 함수를 sum이라는 별칭 이름으로 export했습니다.

그리고 import할 때는 sum이라는 함수를 total이라는 별칭으로 import했습니다.

## Re-Exporting 바인딩

ES6에서는 import한 걸 바로 export할 수 있는데요.

아래와 같은 코드가 있다고 합시다.

```js
import { sum } from './math.js';

export { sum };
```

위 코드에서는 math.js 모듈에서 import한 sum을 export하고 있는데요.

이런 방식을 Re-exporting이라고 합니다.

그리고 이론적으로는 위 코드에서 두 줄이나 소비됐던 코드가 아래 코드처럼 한 줄로 처리할 수 있습니다.

```js
export { sum } from './math.js';
```

조금 헷갈릴 수 있는데요.

아래도 가능합니다.

```js
export { sum as add } from './math.js';

export * from './cal.js';
```

---

## Default exports

우리가 보통 export할 때 한 개의 디폴트 export를 지정할 수 있는데요.

오직 한 개의 default export만 가능합니다.

그냥 export default라고 지정하면 됩니다.

```js
// sort.js
export default function(arr) {
  // sorting here
} 
```

그러면 import하는 방식은 괄호 '{ }'를 쓰지 않고 그냥 import하면 됩니다.

```js
import sort from sort.js;
sort([2,1,3])
```

그리고 디폴트와 디폴트가 아닌걸 import할 때는 꼭 디폴트 import를 먼저 써야 합니다.

```js
// sort.js
export default function(arr) {
  // sorting here
}
export function heapSort(arr) {
  // heapsort
}
```

아래와 같이 디폴트로 지정된 걸 먼저 import해야 합니다.

```js
import sort, {heapSort} from './sort.js';
sort([2,1,3]);
heapSort([3,1,2]);
```

그리고 디폴트도 별칭을 통해 import할 수 있습니다.

```js
import { default as quicksort, heapSort} from './sort.js';
```

이상으로 ES6 모듈의 import, export 방식에 대해 알아보았습니다.

그럼.