---
slug: 2022-08-06-understanding-javascript-es-6-default-parameters
title: 자바스크립트 ES6 - 디폴트 파라미터(default parameters)
date: 2022-08-06 03:52:52.610000+00:00
summary: 자바스크립트 ES6의 디폴트 파라미터(default parameters - 기본값 매개변수)
tags: ["javascript", "es6", "default-parameters"]
contributors: []
draft: false
---

안녕하세요?

이번 시간에는 자바스크립트 ES6에서 도입된 Default Parameters에 대해 알아보겠습니다.

```js
function greeting(message = 'Hi') {
    console.log(message);
}
```
바로 위와 같이 함수 선언 시 message 변수에 기본값인 'Hi'라고 적어 넣은 게 바로 디폴트 파라미터입니다.

본격적으로 디폴트 파라미터에 대해 알아보기 전에 다음 두 용어를 좀 더 정확히 이해해 보겠습니다.

### Arguments vs Parameters

프로그래밍 하다 보면 때때로 위의 두 용어를 헷갈릴 때가 있는데요.

Arguments는 인자로 번역되고, Parameters는 매개변수로 번역됩니다.

요즘은 그냥 아규먼트나 파라미터라고 영어 그대로 읽어서 적기도 하는데요.

자바스크립트에서는 두 용어의 정확한 차이가 있습니다.

먼저, Parameters는 함수를 선언할 때 정의하는 변수를 말하고,

Arguments는 함수를 실행할 때 적어 넣는 변수를 의미합니다.

다음과 같은 코드가 있다고 합시다.

```js
function plus(x, y) {
  return x + y;
}

plus(1, 2);
```
여기서 x, y가 파라미터가 되고, plus(1, 2)에서 숫자 1, 2가 아규먼트가 됩니다.

---

## 디폴트 파라미터 정의하기

자바스크립트에서는 함수 정의할 때 들어가는 파라미터는 기본적으로 'undefined' 타입으로 정해집니다.

즉, 디폴트 파라미터를 함수 선언에 적어 놓지 않으면 함수 선언에 있는 파라미터는 기본적으로 'undefined' 타입이 되는 겁니다.

```js
function greeting(message) {
  console.log(message);
}

greeting();
// undefined
```
![mycodings.fly.dev-understanding-javascript-es-6-default-parameters](https://blogger.googleusercontent.com/img/a/AVvXsEjF2pgG5UHLk_69Q9MbKUyureMGmPDQT587UDMtCgL8OxR6wSp6JU3a3tseoxpjFl5dk-PaMTqDgee6RHvf5o1JBiMyhZXBFNneAfSH4N5bWdHakpjOPCb-tvdlZGDs3Ij5VNMKvatbGyjFkSjr8IkS9gTMCfUfvUq07O4LNMZD_PcxHCZTG0CsVdME=s16000)

위 코드에서 보듯이 우리가 만든 greeting() 함수는 message 파라미터를 가지고 있는데요.

디폴트 파라미터가 없고 함수 호출할 때도 아무 argument(인자)를 넣지 않았기 때문에 'undefined'가 됩니다.

기존에 ES5에서는 디폴트 파라미터를 넣어 주려면 다음과 같이 해야 했습니다.

```js
function greeting(message) {
  message = typeof message !== 'undefined' ? message : "Hi";
  console.log(message);
}

greeting();
// Hi
```

![mycodings.fly.dev-understanding-javascript-es-6-default-parameters](https://blogger.googleusercontent.com/img/a/AVvXsEilFMv-tNoFwj-zzWy6LnKf5Ge4C1D4Ly4g01KSCTGOBRPOVf1shApFlTO3QypMlHH9BJ2ikVsyHUvzx0JvLVOJnzzAJCuLrvem4J1Iinmuc3oDdTQXz9rLrPAAPKl-xKaBku3w6PgtyK_N2XM0mH4SUMP_HVwFr7FJL1F1KnFUVAD5YM1T2dMoBU1N=s16000)

greeting() 함수에 아무것도 인자로 넣지 않았을 때 디폴트 파라미터의 역할을 하게 만들었습니다.

---

## ES6의 디폴트 파라미터

그럼 ES6에서의 디폴트 파라미터 형식에 대해 알아보겠습니다.

```js
function fn(param1 = default1, param2 = default2, ..) {
  ...
}
```

위와 같이 함수 fn()의 파라미터에 할당 연산자인 ( = )를 이용해서 디폴트 파라미터를 정의했습니다.

그럼, 아까 위에서 만들었던 greeting() 함수를 다시 고쳐 볼까요?

```js
function greeting(message = "Hi") {
  console.log(message);
}

greeting(); // Hi
greeting(undefined); // Hi
greeting('Hello'); // Hello
```
![mycodings.fly.dev-understanding-javascript-es-6-default-parameters](https://blogger.googleusercontent.com/img/a/AVvXsEgEb14Tu452pQKPHUmectr0ktCx3sUC36F5JkIMNlNRxwAOGgV0OaUbL298ipnZqioYOx7Y-nA9cSM2XYMR0rCBND3V8NKEudahZZ4VzE1oYWIMybg9X7HN2mx5mYxHSFMuxkMZiZAEVoYqztxuZakPzcg5cSubMmpIwDRB06BIcesw0NR4Js5d23je=s16000)

함수 인자(arguments)에 'undefined' 타입을 넣으면 함수의 파라미터는 'undefined' 타입이 되는 게 아니라 디폴트 파라미터가 됩니다.

그리고 정상적으로 greeting('Hello')처럼 함수 인자(argument)를 넣어 함수를 호출하면 함수 안의 message 변수는 'Hello'가 됩니다.

그럼, 여기서 greeting(100)처럼 숫자를 넣으면 어떻게 될까요?

타입 스크립트처럼 타입을 처음부터 지정하면 이런 문제가 없는데요.

자바스크립트는 타입이 유동적이라서 한번 테스트해 볼까요?

![mycodings.fly.dev-understanding-javascript-es-6-default-parameters](https://blogger.googleusercontent.com/img/a/AVvXsEhcsBC0MkWLs7bEz5kn6jUuaP_vD0hynV-HYDXZkSZDhrcOOkeAieAHVOTPicQ32FbpGLH1tYIzuBqLv2AlCFUArY0IrgnEWD57Bu1Y1FBUV_cU_L34B74yVP1w_aP7acauG3c7uzy0yFBGma5_8c77-nXqsnq2-CyyuyjXGIYVtPzHuDlpRjZD0s5x=s16000)

정상적으로 100이 출력되었습니다.

타입스 크립트의 논리로 보면 함수 선언의 message는 타입이 'any'가 되는 거죠.

---

## ES6의 디폴트 파라미터 예제

### undefined 값을 인자(argument)로 전달하는 예

아래와 같은 createDiv() 함수가 있다고 합시다.

```js
function createDiv(height = '100px', width = '100px', border = 'solid 1px red') {
    let div = document.createElement('div');
    div.style.height = height;
    div.style.width = width;
    div.style.border = border;
    document.body.appendChild(div);
    return div;
}
```

createDiv() 함수의 디폴트 파라미터가 각각 지정되어 있습니다.

그래서 createDiv()라고 argument 없이 함수를 실행하면 디폴트 파라미터가 적용되었습니다.

그런데 만약에 여러분이 위 함수에서 첫 번째 파라미터 height와 두 번째 파라미터 width는 디폴트 파라미터 값을 따르고,

세 번째 파라미터인 border 값만 변경하고 싶을 때는 어떻게 해야 할까요?

그냥 createDiv('100px', '100px', 'solid 2px yellow'); 와 같이 첫 번째, 두 번째 인자를 디폴트 값으로 넣어도 우리가 처음 의도한 데로 작동합니다.

그런데 함수의 정의 부분을 전부 외우지 못하기 때문에 일일이 함수 정의 부분을 찾아보는 게 귀찮을 때 어떻게 해야 우리가 의도한 데로 작동할까요?

바로 다음과 같이 하면 됩니다.

```js
createDiv(undefined,undefined,'solid 2px yellow');
```

아까 위에서 배웠듯이 'undefined'를 함수 인자로 넣으면 무조건 디폴트 값이 적용된다고 했습니다.

이 방식을 외워 두시면 코딩할 때 한결 편하실 듯합니다.

### 디폴트 파라미터의 적용 시점

자바스크립트 엔진은 디폴트 파라미터를 해당 함수가 호출될 때 적용 평가(evaluating)합니다.

다음 코드를 보시면 디폴트 파라미터의 적용 시점을 이해할 수 있을 겁니다.

```js
function put(toy, toyBox = []) {
    toyBox.push(toy);
    return toyBox;
}

console.log(put('Toy Car'));
// -> ['Toy Car']
console.log(put('Teddy Bear'));
// -> ['Teddy Bear'], not ['Toy Car','Teddy Bear']
```

![mycodings.fly.dev-understanding-javascript-es-6-default-parameters](https://blogger.googleusercontent.com/img/a/AVvXsEjE-FyW70JRBS0xuESPK3prLbhzGgw8m_DpVuDGvszI33_ixbD92WmrTShjbXslSvXkov4eiSywgzDcjsAc2WCAahowIB1edQpWeh8YMK55YWoYkbEQypWtZjqG_fkI1-Ls7WJUvadbAi5E4DOv4gLODaYQXjVdHa9QvzxBLdibiZy5t2i_kZYdHLx2)

위 코드에서 보면 toyBox 변수는 빈 배열인데요.

이 toyBox가 자바스크립트 런타임상에서 메모리에 적용되는 시점은 바로 put() 함수가 호출될 때입니다.

그 전에는 없는데요.

그럼, 첫 번째 put() 함수 호출에서 toyBox가 메모리에 적용되었는데, 두 번째 put() 함수 호출 때는 우리가 예상했던 것과 반대로 아예 toyBox 변수가 새로 생겼는데요.

그 이유는 toyBox 변수는 put() 함수 안에서만 존재하는 지역변수이기 때문입니다.

자바스크립트의 Execution Context에 따라 지역변수가 만들어졌다가 함수 호출이 끝나면 그 지역변수는 가비지 컬렉터에 의해 수거 폐기되기 때문입니다.

다음 코드도 좀 헷갈릴 수가 있는데요.

```js
function date(d = today()) {
    console.log(d);
}
function today() {
    return (new Date()).toLocaleDateString("ko-KR");
}
date();
```

![mycodings.fly.dev-understanding-javascript-es-6-default-parameters](https://blogger.googleusercontent.com/img/a/AVvXsEhzep8z7aYk6rEsjfjYoOf_dzRGL64I6tomztK9WjZiXqxymmRfLgZ47RDQPLrP3EpZ4lau8ygzSLujExy6SkpO4ZKODggY03oy5-WVntmh2H4Z9FTgM8UQSERLdpqawKVGxaR5eUKrWy8Z29OCzu4FgeY1eDnmSq0envpEuZ8woynHVw0ohhE3_vWY=s16000)


date() 함수의 파라미터 d의 디폴트 파라미터는 today()라는 함수입니다.

today() 함수는 위에서 정의 했듯이 현재 날짜를 리턴해주는데요.

그럼 today() 함수는 적용시점은 언제가 될까요?

바로 date() 함수가 호출될 때입니다.

그때 즉시,  today() 함수가 호출되고요.

date() 함수를 선언(정의)할 때 today() 함수가 실행되는 건 아닙니다.

마지막에 date() 함수 호출을 빼고 실행해 보면 아무것도 출력하지 않을 겁니다.

![mycodings.fly.dev-understanding-javascript-es-6-default-parameters](https://blogger.googleusercontent.com/img/a/AVvXsEgzygnVNQ3jxDdrLznHfgKJnUzoVUYVb3Vezgcinj8B5W1lfWsjSOX-NXn9Wpri9T2423mWB2JMLYIWInapMuVia13oAJ9JDROEY1NC_OY33iGoJTN_zcqr_rVc4q-9-s-FOJDPcUwuxTXuwbspxnEp08QTy3VvChY-q1WCsg4vqF2YidhzvWuPuPxu=s16000)

위 그림에서 보듯이 아무것도 출력되지 않습니다.

이 방식을 이용하면 다음과 같은 유용한 코드도 만들 수 있습니다.

```js
function requiredArg() {
   throw new Error('The argument is required');
}
function add(x = requiredArg(), y = requiredArg()){
   return x + y;
}

add(10); // error
add(10,20); // OK
```

requiredArg() 함수는 강제로 Error 코드를 발생하는데요.

위 코드에서 add() 함수에 디폴트 파라미터로 requiredArgs() 함수를 지정했습니다.

그렇게 되면 함수 호출할 때 해당 인자를 넣지 않으면 당연히 디폴트 파라미터가 작동되기 때문에,

위에서 처럼 에러가 발생됩니다.

![mycodings.fly.dev-understanding-javascript-es-6-default-parameters](https://blogger.googleusercontent.com/img/a/AVvXsEgUrBaTxESSOJ9Iq1e4RaZabb54mfB3U-BM_7dag5OA8TbTqtxko-Y2yQQcPMvStiP53FOyXAMjYsWc_UkQr0rq0n0B05TMW2gTNLVq6gkBCwLnR5hApnZLaZLHAkfBxbJTh19DuCgcKwORcoEDMcUKGg2poHMR1KprnNzMiSKfnJJCCZpfixznMYI9=s16000)

아주 효과적인 함수 인자 검출기인데요.

### 다른 디폴트 파라미터를 활용하기

함수 선언 시 아래와 같이 디폴트 파라미터를 활용할 수 있습니다.

```js
function plus(x = 1, y = x, z = x + y) {
    return x + y + z;
}

console.log(plus()); // 4
```

![mycodings.fly.dev-understanding-javascript-es-6-default-parameters](https://blogger.googleusercontent.com/img/a/AVvXsEg08bs8kpZzg9EESrWATC06JRbzRsZoBARHwHDJrbkUjvwC83NS5nbHf3RTCqb1do8IKG2uU8KuKI5fvF6IVA31jNXoIElcFr6nC2DS8cxbnTMTXoJ6J3j_Rj4GX42Imcj3SRsSs7rqNWzzSHvPOykkUzlhX0G9apnaensmJQnYOLU8qsUPyibAyqaA=s16000)

코드를 실행하면 x = 1이 되고 y = x에 의해 y 도 1이 되고, z = x + y에 의해 z = 2 가 됩니다.

그래서 값은 4가 되는 거죠.

### 함수도 디폴트 파라미터로 사용할 수 있습니다.

다음과 같이 사용해도 됩니다.

```js
let taxRate = () => 0.1;
let getPrice = function( price, tax = price * taxRate() ) {
    return price + tax;
}

let fullPrice = getPrice(100);
console.log(fullPrice); // 110
```

![mycodings.fly.dev-understanding-javascript-es-6-default-parameters](https://blogger.googleusercontent.com/img/a/AVvXsEg_sRXTA4xudD2sc_auIOYBTAAyrPvUVIr1CmwFjYqy21m5ifKRbCtfTPWoxbLRkINmYs7dN0YGQ2YPhk3R0Rqjv5DOB6BJkIrMZ8k8uT8MYd06_r8NI1SAYqgH6Bjc9cWv7npc2Tu63XexLGfIGGCcauMZJkaNLd1UEElTpXn5Wua9BPL23wiigWJo=s16000)

### Arguments(인자) 객체(Object)

자바스크립트에는 arguments라는 객체가 있습니다.

함수에서 함수 호출할 때 넣은 인자의 리스트를 가지고 있는 거죠

```js
function add(x, y = 1, z = 2) {
    console.log(arguments);
    console.log( arguments.length );
    return x + y + z;
}

add(10); // 1
add(10, 20); // 2
add(10, 20, 30); // 3
```

![mycodings.fly.dev-understanding-javascript-es-6-default-parameters](https://blogger.googleusercontent.com/img/a/AVvXsEiP1uyK5B7oN1QwBPJ5Elz4S6cXKuch6xxriiSMIK3wbz_L0UHRETx1CLvFw6aEfX7bjFnTVsPvDd9NCCQIBTgLyhu1TJd8p-9q99PfIo_275K4YEGagqtphi2wgk6VSWJVEqeGKFn8rImMZ2WOvbDFJfr9xe2Js-BXTM9thrAYLV5QF7k6n4tS7vei=s16000)

위 그림을 보시면 실제 arguments 객체가 표시되고 있습니다.

그리고 arguments 객체에는 실제로 우리가 함수 호출할 때의 인자가 들어가 있습니다.

함수 호출할 때 인자가 1개이면 arguments 객체도 한 개 인 거죠.

arguments 객체에는 디폴트 파라미터가 적용되지 않습니다.

---

이상으로 자바스크립트 ES6의 디폴트 파라미터에 대해 알아보았습니다.

많은 도움이 되었으면 합니다.

그럼.