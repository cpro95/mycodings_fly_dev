---
slug: 2024-01-21-intro-to-the-html-programming-language
title: 이제, HTML도 프로그래밍 언어입니다.
date: 2024-01-21 08:57:02.683000+00:00
summary: HTML 프로그래밍 언어에 대한 소개
tags: ["html", "htmx", "programming language"]
contributors: []
draft: false
---

안녕하세요?

제목이 조금 웃긴데요.

개발자 세계에서는 아래 그림을 딱 보시면 무슨 뜻인지 쉽게 알 수 있을 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEj0q7rT21c9WzsuDiR9_x8ICixnOCsB25v_fcsFMTQRB6v7C91Swn82SEIfPTlIXTnU4gWW3cujoXXWcD8PKYZmte04kw3gUeB5AEw4_ydcEstrM8Jd2NNadHhQ9EfR3cR6dbvJM8yLpeJ1r87MYlUSM81Ga5O80A8ER05a17wUBE2IbL6Va5KSl_og8fc)

사실 이름만 HTML이고 실제는 자바스크립트 라이브러리인데요.

HTML의 태그 같은 걸로 프로그래밍을 할 수 있게 해 줍니다.

사칙연산, 조건부 분기 등등 자바스크립트에서 할 수 있는 거는 다 할 수 있는데요.

[공식 홈페이지](https://html-lang.org/)에 가 보시면 무엇인지 이해할 수 있을 겁니다.

** 목 차 **

* 1. [HTML, The Programming Language](#HTMLTheProgrammingLanguage)
* 2. [HTML 언어의 설정과 기본 문법](#HTML)
* 3. [프로그램 구조](#3)
* 4. [Hello World 프로그램](#HelloWorld)
* 5. [조금 어려운 HTML 프로그램](#5)
* 6. [데이터 유형](#6)
* 7. [입출력](#7)
* 8. [변수](#8)
* 9. [산술 연산](#9)
* 10. [비교 연산](#10)
* 11. [논리 연산](#11)
* 12. [스택 연산](#12)
* 13. [조건 분기](#13)
* 14. [반복](#14)
* 15. [함수 정의](#15)
* 16. [주석](#16)
* 17. [언어 확장](#17)
* 18. [응용 예 1: FizzBuzz](#1:FizzBuzz)
* 19. [응용 예 2 : 피보나치 수열](#19)
* 20. [결론](#20)

---

##  1. <a name='HTMLTheProgrammingLanguage'></a>HTML, The Programming Language

HTML, The Programming Language (이하 HTML이라고 약칭)는 HTMX 를 개발하고 있는 것으로 유명한 Big Sky Software 에 의해 개발된, 튜링 완전성인 스택 지향의 프로그래밍 언어라고 합니다.

작년 말 발표 당시 Hacker News에서도 큰 화제를 불러온 HTML은 2024년 현재 가장 주목받고 있는 프로그래밍 언어의 하나라고 할 수 있을 것입니다.

여기서 잠깐 튜링 완전성에 대한 위키 내용을 참고하고 넘어가겠습니다.

> 튜링 완전성(Turing completeness)은 어떤 프로그래밍 언어나 추상 기계가 튜링 기계와 동일한 계산 능력을 가진다는 의미입니다. 이것은 튜링 기계로 풀 수 있는 문제, 즉 계산적인 문제를 그 프로그래밍 언어나 추상 기계로 풀 수 있다는 의미입니다. 튜링 완전성은 튜링 기계의 개념을 기반으로 합니다. 튜링 기계는 수학자 앨런 튜링이 1936년에 제시한 개념으로, 계산하는 기계의 일반적인 개념을 설명하기 위한 가상의 기계입니다. 현실의 모든 컴퓨터는 기억장치가 유한하기 때문에 튜링 완전하지 않습니다. 하지만 '만일 기억장치가 무한하다면 이 컴퓨터는 튜링 완전하다’라고 생각할 수 있으며, 이것을 느슨한 튜링 완전성(Loose Turing Completeness)이라고 합니다. 대부분의 컴퓨터는 느슨하게 튜링 완전하다고 여겨집니다.

---

##  2. <a name='HTML'></a>HTML 언어의 설정과 기본 문법

설치는 간단합니다.

HTML 파일에 해당 자바스크립트를 로딩하면 됩니다.

HTML 언어의 [html.js](https://html-lang.org/html.js) 파일만 다운로드해서 로컬에 저장하고 그걸 아래와 같이 `<script>` 태그로 로드하면 됩니다.

```html
<script src="html.js"></script>
```

html.js 파일의 처음 부분입니다.

순수 자바스크립트입니다.

```js
var html = (() => {

    let javascriptRef = /javascript:([^(]*).*/

    let commands = {
        // ===============================
        // Literals
        // ===============================
        "s": function (elt, env) {  // push string onto stack
            env.stack.push(elt.innerText);
        },
        "data": function (elt, env) {  // push number onto stack
            env.stack.push(Number.parseFloat(elt.getAttribute('value')));
        },
        "ol": function (elt, env) {  // create list
            let children = elt.children;
            let initialLength = env.stack.length;
            let result = [];
            for (const child of children) {
                exec(child.firstElementChild, child, env);
                result.push(env.stack.pop());
                env.stack.length = initialLength;
            }
            env.stack.push(result);
        },
        "table" : function (elt, env) { // create an object
            let headers = Array.from(elt.querySelectorAll("th"));
            let data = Array.from((elt.querySelectorAll("td")));
            let result = {};
            let initialLength = env.stack.length;
            for (let i = 0; i < headers.length; i++) {
                const header = headers[i];
                const datum = data[i];
                if (datum) {
                    exec(datum.firstElementChild, datum, env);
                    result[header.innerText] = env.stack.pop();
                }
                env.stack.length = initialLength;
            }
            env.stack.push(result);
        },
        ...
        ...
        ...
```

---

##  3. <a name='3'></a>프로그램 구조

HTML 프로그램은 `<main>` 태그 안에 위치합니다.

C 언어의 main함수와 비슷하네요.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>HTML, the programming language</title>
  <script src="html.js"></script>
</head>
<body>
  <main>
    <!-- 여기에 HTML 언어의 코드가 들어옵니다. -->
  </main>
</body>
</html>
```

참고로 아래부터는 글이 길어지는걸 방지하기 위해 main 태그만 보여드리겠습니다.

---

##  4. <a name='HelloWorld'></a>Hello World 프로그램

처음 프로그래밍 언어를 배우면 하는 게 "Hello World" 출력 프로그램인데요.

```html
  <main>
    <!-- 여기에 HTML 언어의 코드가 들어옵니다. -->
    <s>Hello World!</s>
    <output></output>
  </main>
```

위와 같이 입력하고 저장한 브라우저에서 index.html 파일을 읽어 보면 아래 그림과 같이 나옵니다.
![](https://blogger.googleusercontent.com/img/a/AVvXsEjOoAtMy5wjnbfZTAx4cmSgMcBPJvk_8oDz-Z1W9y7Rr6xDRiYYxLR6aAcRI8UmuZ1Pu7L0-6awWH2EL9FLY3yOmTKMzf3sQN0bfB3KqJaFiLbWc1BldVqTKO7AIo8lPOtqMcfaNc9NwEs38mGHG85YFZJayu9S6U4v5t3mrNS7Lkxx60xS_VW68o0zmPU)

콘솔창에도 나오고 브라우저에도 'Hello World!' 문구가 나오네요.

뭔가 처음 보는 태그도 있네요

그럼 본격적으로 HTML 언어를 배워볼까요?

---

##  5. <a name='5'></a>조금 어려운 HTML 프로그램

공식 사이트에 있는 1부터 10까지의 숫자를 콘솔에 출력하는 프로그램입니다.

```html
  <main>
    <data value="1"></data> <!-- 1 이라는 값을 스택에 올립니다 -->
    <output id="loop"></output> <!-- 스택의 맨 위 요소를 출력, 그리고 loop id 지정  -->
    <data value="1"></data> <!-- 1 이라는 값을 스택에 또 올릷니다 -->
    <dd></dd> <!-- 더하기 명령어입니다 (add)-->
    <dt></dt> <!-- 스택의 맨 위 요소를 복제 (duplicate) -->
    <data value="11"></data> <!-- 비교 대상인 11을 푸시 -->
    <small></small> <!-- 새로운 값이 11보다 작은지 확인 -->
    <i>
      <a href="#loop"></a>
    </i>
  </main>
```

이렇게 저장하고 브라우저에서 열어볼까요?

콘솔창을 보시면 아래와 같이 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhocn6X0NW3B6DTVwlJD9lj9yb0QV9CQqA9ggwSakDPafkCQgseOoYJDzXJE0pWzgKcQ8YiQ6JoWStxN_Y69wHccwvbUqfq7a3JySrwF08kIwn2ZBBMA4-htSfvuMfQ4PAO3FAc0yrlKszwo-6vmNbu8PruPTcb4PMp-JyGHikaDl3qoUNgLw3_A5PtH34)

신기하네요.

진짜로 HTML의 마크업 형식으로 프로그래밍이 가능하네요.

이미 언급했듯이 HTML은 스택 지향 프로그래밍 언어인데요.

즉, 스택에 값을 쌓아 가고, 각 값에 대해서 어떠한 조작을 더해 간다는 것이 HTML 프로그래밍의 기본적인 스타일입니다.

스택에 대한 각 작업은 명령이라고 하며 `<command>`같은 태그를 사용합니다.

위 프로그램에서는 먼저 `<data>`태그를 통해 1이라는 숫자를 스택에 푸시합니다.

그런 다음 `<output>` 태그는 스택의 첫 번째 요소를 콘솔에 출력합니다.

그리고 더할 값 1을 스택에 다시 푸시하고 그러고 나서 `<dd>`(add 명령어) 태그에 의해 최근 스택 2개의 값을 더합니다.

게다가 `<dt>` (duplicate top stack element) 태그에 의해 더해진 결과를 복제합니다.

그리고 루프를 종료할지 어떨지를 확인하기 위해서 11이라는 숫자를 스택에 푸시합니다.

`<smalll>`태그는 스택에서 두 개의 값을 팝(pop)하고 즉, 꺼내고 두 개의 값을 비교하는데, 크고 작음을 비교하여 결과를 푸시합니다.

마지막으로, `<i>` (if) 태그에 의해, 직전의 연산 결과에 응한 조건 분기를 통해, 조건이 참인 경우에 `<a>` 태그에 의해 프로그램 `#loop` 시작 부분으로 점프합니다.

같은 방법으로 1에서 10까지의 숫자를 순서대로 출력할 수 있습니다.

---

##  6. <a name='6'></a>데이터 유형

HTML 언어에서는 숫자를 처리할 수 있습니다.

`<data>` 태그를 사용하여 숫자를 스택에 푸시할 수 있습니다.

```html
<data value="1"></data> 
```

또한 문자열을 처리할 수 있습니다.

`<s>`태그를 사용하면 문자열을 스택에 누름 할 수 있습니다.

```html
<s>hello, world</s> 
```

참 거짓 값을 스택에 푸시하려면 아래처럼 `<cite>` 태그를 사용합니다.

HTML 언어에서는 true, false는 변수로 정의되어 있으며 값이 스택으로 푸시됩니다.

```html
<cite>true</cite>
```

배열도 저장할 수 있습니다.

배열은 `<ol>` 태그와 `<li>` 태그를 이용합니다.

```html
<!-- this pushes the array [1, 2] onto the stack -->
<ol>
    <li>
        <data value="1"></data>
    </li>
    <li>
        <data value="2"></data>
    </li>
</ol>
```

자바스크립트의 객체(Objects)도 저장할 수 있습니다.

`<table>`, `<th>`, `<td>` 태그를 이용하는데요.

`<th>` 태그에 자바스크립트의 항목 값을 넣고, `<td>` 태그에 값을 넣으면 됩니다.

```html
<!-- this pushes the object {foo:"Foo", bar:10} onto the stack -->
<table>
    <tr>
        <th>
          foo
        </th>
        <th>
          bar
        </th>
    </tr>
    <tr>
        <td>
          <s>Foo</s>
        </td>
        <td>
            <data value="10"></data>
        </td>
    </tr>
</table>
```

공식 문서에 가면 많은 예제가 있으니 참고 바랍니다.

---

##  7. <a name='7'></a>입출력

스택의 시작 값을 출력하려면 `<output>` 태그를 사용합니다.

기본적으로 console.log 명령어로 사용됩니다.

이걸 유저가 개조하려면 html.meta.out 객체를 새로운 함수로 덮어씌우면 됩니다.

```html
<s>hello, world</s>
<output></output>
```

사용자 입력을 받으려면 `<input>` 태그를 사용합니다.

기본적으로 JavaScript가 prompt() 함수가 사용되는데요.

placeholder 속성을 사용하여 프롬프트 메시지를 지정할 수 있습니다.

```html
<input placeholder="What is your name?" />
<output></output>
```

---

##  8. <a name='8'></a>변수

변수를 정의하려면 `<var>` 태그를 사용합니다.

이 태그는 스택에서 하나의 값을 팝(pop)하고 title 속성에 지정된 이름의 변수를 정의합니다.

```html
<data value="1"></data>
<var title="x"></var>
```

변수를 참조하려면 `<cite>` 태그를 사용하면 됩니다.

```html
<cite>x</cite>
<output></output>
```

---

##  9. <a name='9'></a>산술 연산

HTML에서 덧셈을 수행하려면 `<dd>` (add) 태그를 사용하면 됩니다.

이 태그는 스택에서 두 개의 값을 팝(pop)하고 덧셈한 결과를 다시 스택에 푸시합니다.

<data value="1"></data>
<data value="2"></data>
<dd></dd>

이 외에도, 뺄셈(`<sub>`), 곱셈(`<ul>` (multiple)), 나눗셈 (`<div>` (divide)) 등의 연산이 가능합니다.

---

##  10. <a name='10'></a>비교 연산

숫자의 크기를 비교하려면 `<small>` 태그와 `<big>` 태그를 사용합니다.

이 태그는 스택에서 두 개의 값을 팝(꺼내고)하고 비교한 결과를 스택으로 푸시합니다.

```html
<data value="1"></data>
<data value="2"></data>
<small></small>
```

또한 값이 같은지 확인하려면 `<em>` (equal (mostly)) 태그를 사용하면 됩니다.

```html
<data value="1"></data>
<data value="2"></data>
<em></em>
```

---

##  11. <a name='11'></a>논리 연산

스택에 쌓인 진위 값에 대해 논리 연산을 수행하려면 `<b>` (논리 곱 and에 해당) 태그 또는 `<bdo>` (논리 합 or에 해당) 태그를 사용합니다.

이 태그는 스택에서 두 개의 값을 팝하고 논리 연산 결과를 스택으로 푸시합니다.

```html
<cite>true</cite>
<cite>false</cite>
<b></b>
```

이 외에, 부정에 대응하는 `<bdi>` 태그도 준비되어 있습니다.

---

##  12. <a name='12'></a>스택 연산

스택의 첫 번째 요소를 복제하려면 `<dt>` (duplicate top) 태그를 사용합니다.

이 태그는 스택의 첫 번째 요소를 복제하고 복제본을 스택에 푸시합니다.

```html
<data value="1"></data>
<dt></dt>
```

또한 스택의 첫 번째 요소를 삭제하려면 `<del>` 태그를 사용하면 됩니다.

```html
<data value="1"></data>
<del></del>
```

---

##  13. <a name='13'></a>조건 분기

`<i>` (if) 태그에 의해, 직전의 연산 결과에 따른 조건 분기를 수행할 수 있습니다.

이 태그는, 스택으로부터 값을 한 개 팝(pop)해서, 그것이 참(truthy)인 경우에 내부의 커멘드를 실행합니다.

true를 결정하기 위해 스택의 첫 번째 값이 팝 되기 때문에 후속 처리에서 값을 사용하는 경우 `<dt>` 태그로 복제해야 합니다.

```html
<data value="1"></data>  <!-- 1을 스택에 푸시 -->
<data value="1"></data>  <!-- 1을 스택에 푸시 -->
<em></em>                <!-- 1과 1을 팝하여 비교하고, 결과인 true를 스택에 푸시 -->
<i>                      <!-- 스택의 맨 위 요소를 팝하고, 그 값이 true인 경우 -->
  <s>1 == 1</s>          <!-- "1 == 1" 이라는 문자열을 스택에 푸시 -->
  <output></output>      <!-- 스택의 맨 위 요소를 출력 -->
</i>
```


`<dt>` 태그를 이용해서 값을 복제해 놓으면 if-else 문도 구현할 수 있는데요.

진위를 반전시키는 `<bdi>` 태그를 사용하면 됩니다.

```html
<data value="1"></data>  <!-- 1을 스택에 푸시 -->
<data value="2"></data>  <!-- 2를 스택에 푸시 -->
<em></em>                <!-- 1과 2를 팝하여 비교하고, 결과인 false를 스택에 푸시 -->
<dt>                     <!-- 스택의 맨 위 요소를 복제 -->
<!-- 여기서 dt를 이용해서 그전 false 값을 복제해 놓습니다. -->
<!-- 왜냐하면 if문에서 한번 사용할 거고, -->
<!-- else 문에서 한번 사용할 거기 때문입니다. -->
<i>                      <!-- 스택의 맨 위 요소를 팝하고, 그 값이 true인 경우 -->
  <s>1 == 2</s>            <!-- "1 == 2"를 스택에 푸시 -->
  <output></output>        <!-- 스택의 맨 위 요소를 출력 -->
  <del>                    <!-- 스택의 맨 위 요소를 제거 -->
</i>
<bdi>                    <!-- 스택의 맨 위 요소의 참/거짓을 반전 -->
<i>                      <!-- 스택의 맨 위 요소를 팝하고, 그 값이 true인 경우 -->
  <s>1 != 2</s>            <!-- "1 != 2"를 스택에 푸시 -->
  <output></output>        <!-- 스택의 맨 위 요소를 출력 -->
</i>
```

---

##  14. <a name='14'></a>반복

`<a>` 태그를 사용하면 프로그램의 임의의 위치로 점프할 수 있습니다.

임의의 명령에 id 속성을 지정할 수 있고 `<a>` 태그의 href 속성에 이를 id 방식으로 지정하면 해당 명령으로 점프합니다.

이 글의 맨 처음에 본 1에서 10까지의 숫자를 출력하는 프로그램에서는 `<a>` 태그로 `#loop` 이라는 곳으로 점프했었습니다.

```html
<data value="1"></data>      <!-- 1을 스택에 푸시 -->
<output id="loop"></output>  <!-- 스택의 맨 위 요소를 출력하고 id='loop'를 지정 -->
<data value="1"></data>      <!-- 1을 스택에 푸시 -->
<dd></dd>                    <!-- 덧셈 -->
<dt></dt>                    <!-- 스택의 맨 위 요소를 복제 -->
<data value="11"></data>     <!-- 비교 대상인 11을 스택에 푸시 -->
<small></small>              <!-- 새로운 값이 11보다 작은지 확인 -->
<i>                          <!-- 위의 결과가 참인 경우 -->
  <a href="#loop"></a>         <!-- #loop로 이동 -->
</i>
```
이처럼 반복 처리를 실현할 수 있습니다.


##  15. <a name='15'></a>함수 정의

함수의 정의는 `<dfn>` 태그에 의해 행해집니다.

id 속성에 함수 이름을 지정하고 `<dfn>` 태그 안에 함수 본문을 작성하면 되는데요.

다음은 인수의 값을 제곱하는 함수를 square이라는 이름으로 정의하는 예입니다.

```html
<dfn id="square">
  <dt></dt>  <!-- 함수의 인수를 복제 -->
  <ul></ul>  <!-- 함수의 인수와 위에서 복제한 값을 팝하여 곱셈하고, 계산 결과를 스택에 푸시 -->
</dfn>
```

함수를 호출하려면 href 속성을 `javascript:[함수명]()` 형식으로 지정한 `<a>` 태그를 사용합니다.

인수는 child 요소로 정의해 주면 됩니다.

다음은 위에서 정의한 square 함수를 호출하는 예입니다.

```html
<a href="javascript:square()">  <!-- 함수 square 호출 -->
  <data value="12"></data>      <!-- 함수의 인수 -->
</a>
<output></output>               <!-- 스택의 맨 위 요소를 출력 -->
```

그리고 태그 `<rt>` 로 함수 실행을 종료할 수도 있습니다.

---

##  16. <a name='16'></a>주석

주석처리는 HTML과 똑같습니다.

```html
<!-- 주석 -->
```

---

##  17. <a name='17'></a>언어 확장

HTML에서는 html.meta.commands 명령어를 사용하여 언어를 확장하고 새 명령을 정의할 수 있습니다.

예를 들어, 다음은 스택의 내용을 출력하는 `<pre>` 명령을 추가하는 예입니다.

```js
<script>
html.meta.commands["pre"] = function(elt, env) {
  console.log(env.stack);
}
</script>
```

`<main>` 태그 앞에 `<script>` 태그를 위치시키면 이제 `<pre>` 명령어를 사용하여 스택 내용을 출력할 수 있습니다.

```html
<data value="1"></data>  <!-- 1을 스택에 푸시 -->
<data value="2"></data>  <!-- 2를 스택에 푸시 -->
<data value="3"></data>  <!-- 3을 스택에 푸시 -->
<pre></pre>              <!-- 스택의 내용 [1, 2, 3]을 출력 -->
```

---

##  18. <a name='1:FizzBuzz'></a>응용 예 1: FizzBuzz

지금까지 살펴본 지식을 총동원하면 FizzBuzz 프로그램을 구현할 수도 있습니다.

FizzBuzz는 간단한 프로그래밍 문제로, 주로 소프트웨어 개발 인터뷰나 코딩 테스트에서 활용됩니다.

이 문제는 1부터 100까지의 숫자를 출력하면서, 3으로 나누어지는 숫자는 "Fizz", 5로 나누어지는 숫자는 "Buzz", 3과 5로 모두 나누어지는 숫자는 "FizzBuzz"를 출력하는 것입니다.

간단한 예시로 설명하면:

3으로 나누어지는 숫자는 "Fizz"를 출력합니다.

5로 나누어지는 숫자는 "Buzz"를 출력합니다.

3과 5로 모두 나누어지는 숫자는 "FizzBuzz"를 출력합니다.

나머지 숫자는 숫자 자체를 출력합니다.

이런 규칙을 따라가면서 1부터 100까지의 숫자를 출력하는 것이 FizzBuzz 프로그램입니다.

이 문제는 간단한 제어 구조와 나머지 연산을 사용하여 해결할 수 있습니다.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>HTML, the programming language</title>
  <script src="html.js"></script>
  <script>
    // 나머지를 계산하는 mod 명령어 추가
    html.meta.commands["mod"] = function(elt, env) {
      let top = env.stack.pop();
      let next = env.stack.pop();
      env.stack.push(next % top);
    }
  </script>
</head>
<body>
  <main>
    <!-- 0을 스택에 푸시 -->
    <data value="0"></data>

    <!-- 증가 -->
    <data value="1" id="loop"></data>
    <dd></dd>

    <!-- 15로 나누어 떨어지면 "FizzBuzz" 출력 -->
    <dt></dt>
    <data value="15"></data>
    <mod></mod>
    <data value="0"></data>
    <em></em>
    <i>
      <s>FizzBuzz</s>
      <output></output>
      <del></del>
      <a href="#break"></a>
    </i>

    <!-- 3으로 나누어 떨어지면 "Fizz" 출력 -->
    <dt></dt>
    <data value="3"></data>
    <mod></mod>
    <data value="0"></data>
    <em></em>
    <i>
      <s>Fizz</s>
      <output></output>
      <del></del>
      <a href="#break"></a>
    </i>

    <!-- 5로 나누어 떨어지면 "Buzz" 출력 -->
    <dt></dt>
    <data value="5"></data>
    <mod></mod>
    <data value="0"></data>
    <em></em>
    <i>
      <s>Buzz</s>
      <output></output>
      <del></del>
      <a href="#break"></a>
    </i>

    <!-- 그 외의 경우에는 숫자 출력 -->
    <output></output>

    <!-- 100 미만이면 #loop로 이동 -->
    <dt id="break"></dt>
    <data value="100"></data>
    <small></small>
    <i>
      <a href="#loop"></a>
    </i>
  </main>
</body>
</html>
```

---

##  19. <a name='19'></a>응용 예 2 : 피보나치 수열

피보나치 수열은 각 항이 바로 앞의 두 항의 합인 수열입니다.

수열은 일반적으로 0과 1로 시작하며, 이후에는 각 항이 바로 앞의 두 항의 합으로 계산됩니다.

피보나치 수열의 시작 부분은 다음과 같습니다:
0, 1, 1, 2, 3, 5, 8, 13, 21, 34, ...

여기서 각 항은 바로 앞의 두 항의 합으로 계산되는 것을 볼 수 있습니다.

예를 들어, 2는 바로 앞의 두 항인 1과 1의 합으로 계산됩니다.

이 수열은 다양한 수학적, 공학적, 자연과학적 문제에 등장하며, 재귀적인 방법으로 피보나치 수열을 계산하는 것은 일반적인 프로그래밍 연습 중 하나입니다.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>HTML, the programming language</title>
  <script src="html.js"></script>
</head>
<body>
  <main>
    <!-- 함수 fib를 정의 -->
    <dfn id="fib">
      <!-- 인수를 num이라는 이름의 변수로 정의 -->
      <var title="num"></var>

      <!-- num < 1인 경우 0을 반환 -->
      <cite>num</cite>
      <data value="1"></data>
      <small></small>
      <i>
        <data value="0"></data>
        <rt></rt>
      </i>

      <!-- num == 1인 경우 1을 반환 -->
      <cite>num</cite>
      <data value="1"></data>
      <em></em>
      <i>
        <data value="1"></data>
        <rt></rt>
      </i>

      <!-- num == 2인 경우 1을 반환 -->
      <cite>num</cite>
      <data value="2"></data>
      <em></em>
      <i>
        <data value="1"></data>
        <rt></rt>
      </i>

      <!-- num - 1번째 항을 재귀적으로 계산 -->
      <a href="javascript:fib()">
        <cite>num</cite>
        <data value="1"></data>
        <sub></sub>
      </a>

      <!-- num - 2번째 항을 재귀적으로 계산 -->
      <a href="javascript:fib()">
        <cite>num</cite>
        <data value="2"></data>
        <sub></sub>
      </a>

      <!-- fib(num - 1) + fib(num - 2)를 스택에 푸시 -->
      <dd></dd>
    </dfn>

    <!-- 피보나치 수열의 10번째 항 (55)을 계산하고 출력 -->
    <a href="javascript:fib()">
      <data value="10"></data>
    </a>
    <output></output>
  </main>
</body>
</html>
```

---

##  20. <a name='20'></a>결론

HTML, The Programming Language에 대해, 그 개요와 기본적인 문법에 대해 살펴보았는데요.

HTML은 스택 지향 프로그래밍 언어로 간단하고 이해하기 쉬운 문법을 갖추고 있으며 JavaScript로 확장도 가능하기 때문에 프로그래밍 초보자부터 전문가까지 폭넓게 즐길 수 있는 언어라고 할 수 있습니다.

본문에서는 설명할 수 없었습니다만, 디버거 HDB를 사용해 브레이크 포인트를 설정하거나 하는 것도 가능합니다.

공식 사이트에서 조금 더 많은 정보를 얻어 꼭 HTML 프로그래밍 언어를 한번 익혀 보는 것도 좋을 듯 싶습니다.

그럼.

