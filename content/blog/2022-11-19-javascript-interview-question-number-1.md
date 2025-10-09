---
slug: 2022-11-19-javascript-interview-question-number-1
title: 자바스크립트 기술면접 예상 문제 1편 - String 인코딩, 디코딩
date: 2022-11-19 10:05:56.334000+00:00
summary: 자바스크립트 기술면접 예상 문제 1편 - String 인코딩, 디코딩
tags: ["javascript", "interview"]
contributors: []
draft: false
---

안녕하세요?

개발자를 꿈꾸는 아마추어인데요.

자바스크립트 기술면접에 나올만한 문제를 한번 풀어보겠습니다.

## 문제는 다음과 같은 형식으로 인코딩, 디코딩하는 코드를 작성해 보세요.

```js
문자열 "AAAABBBCCDAA"는

"4A3B2C1D2A"처럼 인코딩

or:

문자열 "2c1d3e"는

"ccdeee"처럼 디코딩
```

같은 문자가 나오는지 숫자로 암호화한 건데요.

뭔가 좀 어려워 보이는데요.

<hr />
## Encode 함수 작성하기

먼저 인코딩 코드를 작성해 보겠습니다.

```js
const encode = (word) = {
  let encodedWord = "";
  let counter = 1;

  ....
  ....

  return encodeWord;
}

let result1 = encode("AAAABBBCCDAA");

console.log(result1);
// 4A3B2C1D2A
```

전체적인 코드는 위와 같습니다.

우리의 암호 같은 문자열은 "AAAABBBCCDAA"인데요.

이걸 암호화해서 리턴할 문자열을 encodedWord라고 변수 지정했으며, 당연히 빈 문자열로 변수 선언했습니다.

그리고 몇 개의 문자가 있는지 나타내는 counter 변수도 1로 설정했습니다.

이제 encode 함수에 인자로 들어오는 "AAAABBBCCDAA" 값을 loop 해야 하는데요.

당연히 자바스크립트에서는 배열로 만들어야 합니다.

[..."AAAABBBCCDAA"] 이렇게 하면 다음과 같이 됩니다.

['A', 'A', 'A', 'A', 'B', 'B', 'B', 'C', 'C', 'D', 'A', 'A']

이제 배열을 forEach로 loop 하면 되겠네요.

코드를 이어 가보겠습니다.

```js
const encode = (word) = {
  let encodedWord = "";
  let counter = 1;

  [...word].forEach((char, index) => {
    ...
    ...
    ...
  }

  return encodeWord;
}

let result1 = encode("AAAABBBCCDAA");

console.log(result1);
// 4A3B2C1D2A
```

이제 위에서 보듯이 forEach 문에서 char와 index를 가지고 로직을 만들어야 되는데요.

당연히 char는 배열의 문자 값이고 index는 배열의 순서입니다.

다시 코드를 이어가 볼까요?

```js
const encode = (word) = {
  let encodedWord = "";
  let counter = 1;

  [...word].forEach((char, index) => {

    if (word.charAt(index + 1) != char) {
      ...
      ...
      counter = 1;
    } else {
      counter++;
    }

  }

  return encodeWord;
}

let result1 = encode("AAAABBBCCDAA");

console.log(result1);
// 4A3B2C1D2A
```

encode 함수로 들어온 문자열을 배열로 만들고 첫 번째 항목에서 그다음 항목이랑 비교해서 같으면 단순히 counter를 1씩 늘립니다.

당연히 AAAA는 4A가 되기 때문에 숫자 4를 얻기 위해서죠.

그리고 만약에 다음 항목에 숫자가 오면 첫 번째 항목의 counter가 끝났다고 볼 수 있기 때문에 4A 항목을 리턴하는 코드를 만들어야 합니다.

```js
let encodedWord = "";
  let counter = 1;

  [...word].forEach((char, index) => {

    if (word.charAt(index + 1) != char) {
      encodedWord += counter + char;
      counter = 1;
    } else {
      counter++;
    }

  }

  return encodeWord;
}

let result1 = encode("AAAABBBCCDAA");

console.log(result1);
// 4A3B2C1D2A
```

위 코드를 보시면 '4A' 부분이 어떻게 코드로 작성되는지 보실 겁니다.

encodedWord에 += 연산자로 계속 문자를 덧붙이는데요.

counter + 'A'가 '4A'가 되는 원리는 자바스크립트 개발자라면 다 아실 겁니다.

자바스크립트 덧셈 연산에서 숫자 + 문자열은 숫자를 문자열로 바꾸고 그리고 나서 그 두 개의 문자열을 합치기 때문입니다.

이제 코드가 완성되었습니다.

<hr />
## Decode 함수 작성하기

Decode 함수는 조금 어려운데요.

지난 시간에 배웠던 Array.reduce 함수를 써야 합니다.

왜냐하면 제공된 배열을 가지고 계속 작업하고 그걸 다시 리턴해 줘야 하니까요.

map 함수를 쓸 수는 없는 거죠.

전체적인 코드는 다음과 같습니다.

```js
const PLACEHOLDER_CHAR = "#";

const isDigit = (c) => c >= "0" && c <= "9";

const decode = (word) =>
  [...word].reduce(
    (decodedWord, char) =>
      {
        ...
        ...
      },
    "" // initialValue가 "" 이기 때문에 첫 번째 decodedWord는 빈 문자열이 된다.
  );


let result2 = decode("4A3B2C1D2A");

console.log(result2);
// AAAABBBCCDAA
```

decode 함수를 작성하기 전에 decode 함수에 필요한 PLACEHOLDER_CHAR 값과,

isDigit처럼 문자가 숫자인지 알려주는 Helper 함수도 만들었습니다.

decode는 reduce 함수를 이용하는데요.

initialValue는 ""처럼 빈 문자열이고,

previousValue 에는 decodedWord라는 이름,

currentValue 에는 char라는 이름으로 지정했습니다.

이제 다시 reduce 코드를 이어가 볼까요?

```js
const PLACEHOLDER_CHAR = '#'

const isDigit = c => c >= '0' && c <= '9'

const decode = word =>
  [...word].reduce(
    (decodedWord, char) =>
      (decodedWord = isDigit(char)
        ? (decodedWord += PLACEHOLDER_CHAR.repeat(Number(char)))
        : decodedWord.replaceAll(PLACEHOLDER_CHAR, char)),
    '', // initialValue가 "" 이기 때문에 첫 번째 decodedWord는 빈 문자열이 된다.
  )

let result2 = decode('4A3B2C1D2A')

console.log(result2)
// AAAABBBCCDAA
```

reduce 함수 안의 reducer 함수는 애로우 함수로써 decodedWord를 리턴합니다.

decodedWord는 다시 isDigit(char) 함수에 의해 두 가지로 분리되는데요.

만약 reduce 함수에서 Step 1의 currentValue인 char가 isDigit처럼 숫자라면 어떻게 해야 할까요?

위 코드처럼 decodedWord에 숫자만큼 "#"를 붙여 넣었습니다.

이때 "#".repeat() 함수를 썼고요.

"#".repeat(4)는 "####"를 리턴합니다.

그리고 step 2를 진행해 보면 isDigit() 함수에 의해 숫자가 아니기 때문에 삼항 연산자의 두 번째 부분인

decodedWord.replaceAll(PLACEHOLDER_CHAR, char)) 코드가 실행되고 decodedWord가 리턴됩니다.

replaceAll함수를 이용해서 '####'를 두 번째 char인 'A'로 전부 치환하는 코드인 거죠.

reduce 스텝별로 살펴볼까요?

|  Step  |  decodedWord   | char |
| :----: | :------------: | :--: |
| Step 1 |       ""       | '4'  |
| Step 2 |     "####"     | 'A'  |
| Step 3 |     "AAAA"     | '3'  |
| Step 4 |   "AAAA###"    | 'B'  |
| Step 5 |   "AAAABBB"    | '2'  |
| Step 6 |  "AAAABBB##"   | 'C'  |
| Step 7 |  "AAAABBBCC"   | '1'  |
| Step 8 |  "AAAABBBCC#"  | 'D'  |
| Step 9 |  "AAAABBBCCD"  | '2'  |
| Step 9 | "AAAABBBCCD##" | 'A'  |

Step 9가 끝나면 다음 Step으로 가지 않고 최종적으로 "AAAABBBCCDAA"가 리턴됩니다.

2번째 Decode 함수는 조금 어려웠는데요.

reduce 함수 덕분에 쉽게 코드를 작성할 수 있습니다.

그럼.
