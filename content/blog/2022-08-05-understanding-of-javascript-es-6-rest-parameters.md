---
slug: 2022-08-05-understanding-of-javascript-es-6-rest-parameters
title: 자바스크립트 ES6 - 나머지 매개변수(rest parameters) 이해
date: 2022-08-05 02:11:18.679000+00:00
summary: 자바스크립트 ES6에 새로 도입된 나머지 매개변수(rest parameters) 이해하기
tags: ["javascript", "es6", "rest parameters"]
contributors: []
draft: false
---

![mycodings.fly.dev-understanding-of-javascript-es-6-rest-parameters](https://blogger.googleusercontent.com/img/a/AVvXsEgJaHZo3k4PSGs020LUbWkfxq-RFDJVUoQl2yrYffa32IAUGc79ltM2BMsVgr-wwuFhoKYyF9yHKFwaZ-z2U8K0N4dG-Cc_ekp-wI7vAIASM_JdtLsTlhkot0VdupLEvhWWvuZti1exHE1QqydXNdP6oxkWN9dDfkkQFUlBXEo0nl-czjwTD7SmQ4L3=s16000)

안녕하세요?

이번 시간에는 지난 시간에 배웠던 스프레드 연산자(spread operator)에 이어 나머지 매개변수(rest parameters)에 대해 알아보겠습니다.

ES6에서는 나머지 매개변수가 새로 도입되었는데요.
형태는 세 개의 점(...) 형식입니다.

나머지 매개변수는 함수의 인자에서 무한한 인자의 개수를 그냥 한 개의 배열에 모두 집어넣어서 컨트롤할 수 있게 해 줍니다.

```js
function fn(a,b,...args) {
   //...
}
```

위 코드에서 ...args가 바로 나머지 매개변수(rest parameters)라고 불립니다.

함수에 전달되는 인자는 파라미터 리스트에 매핑되는데요.

첫 번째, 두 번째, 세 번째 순서에 의해 자동으로 매핑됩니다.

그래서 다음 코드를 보면 쉽게 이해할 수 있는데요.

```js
function fn(a,b,...args) {
   console.log(args);
   // [3,'A','B','C']
}

fn(1, 2, 3, "A", "B", "C");
```

![mycodings.fly.dev-understanding-of-javascript-es-6-rest-parameters](https://blogger.googleusercontent.com/img/a/AVvXsEiWhgpVLExHrJ1Ph0-gXZLuviLAviMT2SWldQtOxvI0Xpu5j44nDukT4skYdfr-xEnvCtL9MlawunlP3YxH2AccDMn-8LA0GCk_F9qHxkncSaC2TwLiB5LmuN4xD1TecmHI0NcQqwyJt8--zchgPPuPzk_hDTAATQOnzDb4Cn_ZWrdKkApP7RlouJXV=s16000)

위 그림을 보시면 우리가 의도한 데로 실행되고 있습니다.

그러면 나머지 매개변수가 함수의 인자 개수가 틀려 매핑이 안될 경우에는 어떻게 될까요?

바로 빈 배열이 됩니다.

```js
function fn(a,b,...args) {
   console.log(args);
   // []
}

fn(1, 2);
```

![mycodings.fly.dev-understanding-of-javascript-es-6-rest-parameters](https://blogger.googleusercontent.com/img/a/AVvXsEjD35fRqmw-zdHXZ6GIjN2-EY6htTFbPDpBrVKaeBItsx8Wr70C6FPrnl04fVfIl6ZnSQ6oyl77ipbVZ2QLKq-uIbttjSwpd-Fp017gjQYvRde0Bsqzb7pU44KbH6rkQ7jnh84DvXa8xSK2L8xhSDms33L1a2x6k9MZzTxODCRyefIOQYWJxRkr3KKw=s16000)

그리고 나머지 매개변수에는 가장 중요한 규칙이 있는데요.

바로 함수의 인자에 넣을 때 가장 마지막에 넣어야 한다는 겁니다.

만약 그렇지 않으면 아래와 같이 에러가 발생합니다.

```js
function fn(a,...args, b) {
   console.log(args);
   // SyntaxError: Rest parameter must be last formal parameter
}

fn(1, 2, 3, 4);
```

![mycodings.fly.dev-understanding-of-javascript-es-6-rest-parameters](https://blogger.googleusercontent.com/img/a/AVvXsEiKKA-0GHGKkdVq7khqVcHgBMBg9lyiUqYCjhlO3wm1QoJWxabvTFV2skA9SZe_nHsmHTwSwDYAPDplnaI18sue2Oy4oX2JFSL9N5WwZg7wKUdxaeqaV9cZzqXFJB2BqMxKUzdhlpDezKF5L1gEw4gzZHMkxTPX4-iOgQNGtOIsPVvf6Ngw2fiqE9Gr=s16000)

---

## 나머지 매개변수의 다양한 예제

1. 함수의 인자 숫자가 유동적일 때

```js
function sum(...args) {
    let total = 0;
    for (const a of args) {
        total += a;
    }
    return total;
}

sum(1, 2, 3);
// 6
```
![mycodings.fly.dev-understanding-of-javascript-es-6-rest-parameters](https://blogger.googleusercontent.com/img/a/AVvXsEivdE7mmQkxJRylv7Lb4mVyTQvp5HybgRQ96nx1FuTILpvM0e4YomxnKFy_4r9DGONjNtQpztTitlQ1UeN4hY-ZbDE_6rcBX7i-sa6a3UK1l2r_VW7Trx18imPyYF2myAG8CGBVsuSHFzkch1h-mqBEdYMK714auvzQRalTMJbR0tQqgzssN1aFfkR-=s16000)

위 코드에서 sum() 함수는 함수의 인자로 무한개의 숫자를 입력할 수 있습니다.

그리고 sum() 함수 내에서 나머지 매개변수로 넘어온 args 변수는 Array이기 때문에 for..of 방식을 이용해서 전체 합계를 구하는 코드를 구현했습니다.

위의 코드를 좀 더 유연하게 확장해 볼까요?

만약 sum() 함수가 인자로 숫자, 문자열, 불린 타입을 받을 경우 숫자 타입만 합쳐서 리턴하고자 하는 함수를 만든다고 하면 아래와 같이 할 수 있습니다.

```js
function sum(...args) {
  return args
    .filter(function (e) {
      return typeof e === 'number';
    })
    .reduce(function (prev, curr) {
      return prev + curr;
    });
}

let result = sum(10,'Hi',null,undefined,20); 
console.log(result);
// 30
```

![mycodings.fly.dev-understanding-of-javascript-es-6-rest-parameters](https://blogger.googleusercontent.com/img/a/AVvXsEidT6QK7sfcfaAIUj3HSOlrnMjqyUi91hYdhjNE7bwC7U7-aGrJT1G5JyZ8yE37Aq2OpM55-U5CUHb8qL3LxCn2OqOk-8dx4YURAALD-zOIJZoczmYnt1fYFoyNM2COioDku8EwGF0zVNPQehy2uHRcuSUgGAsGQdmwf5h0yDbbBHF-oeeGm3lPLoXs=s16000)

ES6에서는 나머지 매개변수 args가 배열(Array)이기 때문에 쉽게 filter 메서드를 사용하면 됩니다.

그러면 ES5에서는 나머지 매개변수가 없는데 어떻게 해야 할까요?

ES5에서는 함수의 인자는 arguments 객체(object)에 전달되는데 이 객체는 배열(Array)이 아니기 때문에 filter 메서드를 사용 못합니다.

그래서 다음과 같은 Array.prototype.filter.call() 방식을 써야 하죠.

```js
function sum() {
  return Array.prototype.filter
    .call(arguments, function (e) {
      return typeof e === 'number';
    })
    .reduce(function (prev, curr) {
      return prev + curr;
    });
}
```

뭔가 복잡한 코드가 되었네요.

그래서 ES6가 자바스크립트 코드를 예전보다 더 우아하게 만드는 거 같습니다.

여기서 코딩 팁을 드리자면

* 함수 인자를 검색하는 스니핏(snippet)

```js
function filterBy(type, ...args) {
  return args.filter(function (e) {
    return typeof e === 원하는 타입;
  });
}
```

위 코드를 이용하면 number, string, boolean, null 형식의 타입을 구분할 수 있습니다.

--- 

2. 나머지 매개변수와 애로우 함수(arrow function)

애로우 함수에 전달되는 인자와 관련하여 애로우 함수에는 arguments 객체가 없기 때문에 나머지 매개변수를 이용해서 사용하면 훨씬 쉽습니다.

```js
const combine = (...args) => {
  return args.reduce(function (prev, curr) {
    return prev + ' ' + curr;
  });
};

let message = combine('JavaScript', 'Rest', 'Parameters');
console.log(message); // JavaScript Rest Parameters
```

![mycodings.fly.dev-understanding-of-javascript-es-6-rest-parameters](https://blogger.googleusercontent.com/img/a/AVvXsEjIysBxwUWLqT3eUjeKTiPFba1oGSC5fi9zhJt8u7l7nqaLhAArVKqjl3FOdWpFtivTX6BXzEVlNWFBpFGqon4_KfhapC4Rkwp4RLoloSkfjGaMyEXM5JC-B394RTJAPyx-aEymbdU7UskH2rBq0ZtECai0aSYa2cMVBbdkkuPeqEUMilI6fkhsEhhH=s16000)

---

3. 동적 함수(dynamic function)에서 나머지 매개변수 사용하기

자바스크립트는 Function 컨스트럭터(constructor)를 통해 동적으로 함수를 만들 수 있는데요.

나머지 매개변수를 아래와 같이 동적 함수 만들 때 사용할 수 있습니다.

```js
var showNumbers = new Function('...numbers', 'console.log(numbers)');
showNumbers(1, 2, 3);
```

![mycodings.fly.dev-understanding-of-javascript-es-6-rest-parameters](https://blogger.googleusercontent.com/img/a/AVvXsEjPo0U696NSEMSRmaaJ0yCnfZmCrdlzHKfk19yQBtXx6g3Ubqh18gIHH-IZxvFDzGwmMrvN6egmNdqJG9JwoIkyPdqmOnrissNrXMe1KanUc2dVD3nscGwgwjU49sENKRnc28bS0kCUbfFBvSxkYJzcBr-Ly3hZpy_ZbxvP58enL51DC6aMsaCySfit=s16000)

지금까지 자바스크립트 ES6의 나머지 매개변수에 대해 알아보았습니다.

많은 도움이 되었으면 합니다.

읽어 주셔서 감사합니다.

그럼.

