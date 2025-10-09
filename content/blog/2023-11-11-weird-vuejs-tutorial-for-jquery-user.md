---
slug: 2023-11-11-weird-vuejs-tutorial-for-jquery-user
title: jQuery 사용자가 VueJS를 공부하기 전에 봐야할 VueJS 강의
date: 2023-11-11 07:08:34.422000+00:00
summary: 기존에 jQuery를 이용해서 웹페이지를 만들었던 분들이 한 번은 볼만한 가치가 있는 VueJS 강의입니다.
tags: ["vuejs", "jquery user"]
contributors: []
draft: false
---

안녕하세요?

오늘은 아무런 자바스크립트 프레임워크 없이 jquery 같은 걸로 바닐라 자바스크립트만 이용해서 웹 페이지를 개발했던 분들이 VueJS를 공부해 보고자 할 때 미리 한번 가볍게 읽어 보면 좋을 듯한 강의입니다.

** 목차 **

1. [VueJS 소개](#1-vuejs-소개)

2. [Hello Vue 및 HTML에서 값 표시하기](#2-hello-vue-및-html에서-값-표시하기)

3. [Vue 디렉티브와 조건부 렌더링](#3-vue-디렉티브와-조건부-렌더링)

4. [루프를 이용하여 렌더링하기](#4-루프를-이용하여-렌더링하기)

5. [이벤트 처리](#5-이벤트-처리)

6. [컴포넌트 소개](#6-컴포넌트-소개)

7. [라이프사이클 메서드](#7-라이프사이클-메서드)

8. [CLI를 사용하여 Vue 앱 생성](#8-cli를-사용하여-vue-앱-생성)

9. [.vue 파일에서 컴포넌트 생성](#9-vue-파일에서-컴포넌트-생성)

10. [컴포넌트로 데이터 전달하기](#10-컴포넌트로-데이터-전달하기)

11. [컴포넌트에서 부모로 데이터 전송](#11-컴포넌트에서-부모로-데이터-전송)

---

## 1. VueJS 소개

_이 강의는 처음으로 VueJS를 시작하는 사람을 대상으로 합니다. 참고로 VueJS 버전 3을 기반으로 합니다._

### VueJS란 무엇인가요?

VueJS는 반응형 프론트 엔드 애플리케이션을 구축하는 데 사용되는 JavaScript 프레임워크입니다.

### 왜 VueJS를 선택하고 바닐라 JavaScript를 사용하지 않나요?

바닐라 JavaScript에서 응용 프로그램을 구축하는 것도 복잡한 응용 프로그램을 구축할 수 있습니다.

그러나 그 방식은 너무 느릴 수 있고 오류 및 성능 문제를 드러낼 수 있습니다.

VueJS와 같은 프레임워크를 사용하면 디벨로퍼가 필요로 하는 많은 기능이 기본적으로 제공됩니다.

예를 들면, 라우팅 및 데이터 바인딩과 같은 기능은 VueJS 같은 프레임워크를 사용하지 않을 경우 개발자가 직접 구축해야 하는 기능입니다.

### 페이지 일부분에만 VueJS를 사용할 수 있나요?

다른 프레임워크와 달리 VueJS는 위젯으로서 페이지 일부에서만 사용할 수 있습니다.

### VueJS를 이용한 첫 애플리케이션 만들기

여러분이 VueJS 애플리케이션을 작성하는 데는 여러 가지 방법이 있는데요, CLI를 이용한 방법과 CDN을 이용한 방법이 있습니다.

#### CDN을 이용한 애플리케이션 구축

1. 폴더 구조 설정

먼저 프로젝트에 사용할 파일을 생성해야 합니다.

웹페이지니까 당연히 index.html이라는 이름으로 작성해야겠죠.

그리고 자바스크립트를 위해서 script.js라는 이름으로 자바스크립트 관련 파일을 만들겠습니다.

2. 기본 HTML 내용 추가

가장 기본적인 HTML구조에 단순히 VueJS를 CDN에서 로드하는 script 태그를 넣었습니다.

```html
<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <div id="app" />
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <script src="/script.js"></script>
  </body>
</html>
```

3. script.js에 애플리케이션 초기화 추가

VueJS 애플리케이션을 생성하려면 다음과 같이 해야 합니다.

```javascript
Vue.createApp({
  data() {
    return {}
  },
}).mount('#app')
```

createApp 함수는 VueJS 애플리케이션을 초기화하고 initial 객체를 매개변수로 받습니다.

그다음 mount 함수가 호출되는데, VueJS앱이 담길 컨테이너 selector를 넣어주면 됩니다.

위에서는 `#app` ID가 바로 VueJS앱이 담길 컨테이너 ID가 되는 겁니다.

4. 애플리케이션에 데이터 추가

애플리케이션에 데이터를 추가하려면 createApp 함수에 넣는 initial 객체에 data 함수를 이용하는데요.

이 data 함수에서 반환하는 객체에 우리가 추가하려는 데이터를 넣으면 됩니다.

```javascript
Vue.createApp({
  data() {
    return {
      message: 'Hello world',
    }
  },
}).mount('#app')
```

5. HTML에서 데이터 표시

HTML에서 데이터를 표시하려면 해당 데이터 이름을 사용하고 중괄호 두 개로 감싸면 됩니다.

그리고 꼭 VueJS 애플리케이션을 로드하는 컨테이너 내부에 넣어야 합니다.

```html
<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <div id="app">
      <div>{{message}}</div>
    </div>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <script src="/script.js"></script>
  </body>
</html>
```

---

## 2. Hello Vue 및 HTML에서 값 표시하기

아래 코드는 1장에서 만든 첫 애플리케이션의 HTML입니다.

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <div id="app">
      <div>Hello world!</div>
    </div>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <script type="text/javascript" src="script.js"></script>
  </body>
</html>
```

```javascript
// script.js
Vue.createApp({
  data() {
    return {
      message: 'Hello world',
    }
  },
}).mount('#app')
```

위 HTML 애플리케이션 데이터에는 message라는 변수가 있으며 HTML에는 "Hello world!"라는 문자열이 하드 코딩되어 있습니다.

### HTML에서 값 표시

VueJS를 사용하여 HTML에서 값을 표시할 때 해야 할 일은 중괄호 안에 표현식을 놓고 (`{{ EXPRESSION }}`) HTML 태그의 시작과 끝 사이에 두기만 하면 됩니다.

표현식이라는 용어를 사용한 이유는 중괄호 안에 거의 모든 유효한 JavaScript 표현식을 놓을 수 있기 때문입니다.

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <div id="app">
      <div>{{ "Hello world" }}</div>
      <div>{{ 1 + 3 }}</div>
      <div>{{ Math.round(3 + Math.random() * 5) }}</div>
      <div>{{ (() => "Function result")() }}</div>
      <div>{{ true ? "true expression" : "false expression" }}</div>
    </div>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <script type="text/javascript" src="script.js"></script>
  </body>
</html>
```

위의 코드 예제에서는 다양한 하드 코딩된 값이 표시되어 있습니다.

문자열, 숫자, Math 함수 결과 및 self-invoking 함수가 있는 것을 볼 수 있습니다.

잠깐 얘기했듯이 거의 모든 유효한 JavaScript 표현식은 모두 들어갈 수 있습니다.

단, 변수 할당과 같은 것은 넣을 수 없습니다.

보통은 HTML에 어떤 하드 코딩된 값이 아니라 애플리케이션 변수를 표시하고 싶을 건데요.

이럴 때는 중괄호를 두 번 써서 그사이에 변수 이름을 넣어서 사용하면 됩니다.

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <div id="app">
      <div>{{message}}</div>
    </div>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <script type="text/javascript" src="script.js"></script>
  </body>
</html>
```

애플리케이션 변수는 HTML 내에서도 표현식으로 사용될 수 있습니다.

### 복잡한 구조 표시하기

우리가 사용하는 변수가 모두 자바스크립트 기본형(primitive)이 아닙니다.

당연히 배열과 객체도 있습니다. 이러한 값을 표시하려고 하면 Vue는 이들을 문자열화하여 그대로 표시하려고 할 것입니다.

예를 들어 숫자 1에서 3까지의 배열을 렌더링 하려고 하면 결과는 "[ 1, 2, 3 ]"이 될 것입니다.

### 메서드 결과 표시

HTML에서 결과를 실행하고 표시하려는 로직이 있을 수 있습니다.

그 로직은 중괄호 안에 있어서는 안 됩니다.

따라서 애플리케이션을 초기화할 때 초기화 객체 내에 모든 메서드를 포함하는 methods 속성을 추가할 수 있습니다.

그런 다음 초기화(initial) 객체에서 정의한 methods 속성에 있는 함수를 중괄호 사이에 넣어 해당 결과를 표시할 수 있습니다.

```javascript
// script.js
Vue.createApp({
  data() {
    return {
      exampleName: 'John',
    }
  },
  methods: {
    getMessage: () => 'Hello method',
    getNameGreeting: function () {
      return `Hello ${this.exampleName}`
    },
  },
}).mount('#app')
```

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <div id="app">
      <div>{{getMessage()}}</div>
      <div>{{getNameGreeting()}}</div>
    </div>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <script type="text/javascript" src="script.js"></script>
  </body>
</html>
```

위의 예제에서 getNameGreeting 메서드에서 this 키워드를 사용하여 데이터(data) 값을 액세스 했음을 알 수 있습니다.

애플리케이션 빌드 중에 VueJS는 'this'를 사용하여 애플리케이션 데이터에 액세스할 수 있게 합니다.

여기서 중요한 점은 데이터에 액세스하려면 메서드를 익명 함수로 정의할 수 없다는 것입니다.

꼭 기억해 두시기를 바랍니다.

### HTML 속성 제어하기

많은 경우 애플리케이션 데이터를 사용하여 HTML 속성을 제어하고 싶을 것입니다.

가장 간단한 예는 링크의 href 속성을 설정하는 것입니다.

이 경우 중괄호를 사용할 수 없습니다.

그러나 VueJS가 제공하는 것은 이를 위해 사용할 수 있는 디렉티브(directives)라는 특수 속성입니다.

이 경우에는 콜론으로 구분된 HTML 속성 이름을 v-bind 속성 뒤에 추가합니다.

전달된 값은 따옴표 안에 배치된 표현식이나 변수 이름입니다.

```javascript
// script.js
Vue.createApp({
  data() {
    return {
      linkValue: 'https://www.google.com',
    }
  },
}).mount('#app')
```

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <div id="app">
      <a v-bind:href="linkValue">Google</a>
    </div>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <script type="text/javascript" src="script.js"></script>
  </body>
</html>
```

---

## 3. Vue 디렉티브와 조건부 렌더링

### 디렉티브와 그 역할

2장 예제에서 보면 값 표시를 위해 특수한 HTML 속성을 사용했습니다.

이들은 HTML 네이티브(native) 속성이 아닌 Vue 디렉티브입니다.

즉, 디렉티브를 추가하면 Vue가 해당 요소에 자동으로 일부 기능을 제공합니다.

아까 v-bind 디렉티브를 사용했는데, 이는 애플리케이션 데이터에서 다른 HTML 속성(예: href 속성)으로 값을 바인딩하는 데 사용됩니다.

v-if와 v-show 디렉티브를 비롯하여 여러 디렉티브가 있으며, 여기서는 조건부 렌더링과 관련된 내용을 다뤄보겠습니다.

### 조건부 렌더링

자바스크립트 프레임워크로 웹 개발할 때 조건부 렌더링이라는 기술은 정말 자주 사용하는데요.

예를 들면, 사용자가 로그인되어 있지 않으면 어떤 내용을 숨기거나 혹은 사용자 프로필에 일부 배지를 표시하려고 할 때 조건부 렌더링이라는 기술을 사용할 수 있습니다.

VueJS에서는 두 가지 디렉티브, v-if와 v-show가 있습니다.

### v-if 디렉티브

이 디렉티브는 꽤 간단합니다.

true 또는 false로 평가되는 v-if 속성을 추가하고 true, false에 따라 해당 요소와 해당 내용이 표시되거나 숨겨집니다.

그리고 당연히 true, false 외에 다른 대안을 염두에 둔다면 v-else-if 및 v-else 디렉티브를 사용하면 됩니다.

### v-if 예제

이 예제에서는 확률 변수가 0에서 1까지의 값을 포함하는 상황을 가정해 보겠습니다.

확률의 크기에 따라 해당 텍스트를 표시하려고 하는 코드입니다.

주의할 점은 v-else와 v-else-if는 필수적으로 사용하지 않아도 됩니다.

사용하는 경우에는 v-if 바로 다음에 사용되어야 합니다.

```html
<div v-if="probability >= 0.8">High probability</div>
<div v-if="probability < 0.8 && probability >= 0.3">Medium probability</div>
<div v-if="probability < 0.3">Low probability</div>
```

### v-if 디렉티브에 대한 주의

이 디렉티브를 사용할 때 주의점은 해당 엘리먼트에 대한 명확한 지정이 있어야 합니다.
여러 형제 태그가 토글 되어야 하는 경우 각 요소에 v-if를 추가하거나 이 디렉티브를 포함하는 다른 태그로 감싸야 합니다.

참고로 template 태그가 원래 렌더링되지 않는다는 점인데, v-if 디렉리브는 이를 가장 잘 이용한 디렉티브가 됩니다.

```html
<template v-if="probability < 0.5">
  <div>Element 1</div>
  <div>Element 2</div>
  <div>Element 3</div>
</template>
```

### v-show 디렉티브

v-show를 사용하는 것은 v-if와 매우 유사합니다.

표현식이 true이면 해당 요소가 표시되고, 그렇지 않으면 숨겨집니다.

ㄴ그러나 몇 가지 차이점이 있습니다.

- v-show 디렉티브에는 v-else가 없습니다.

- v-show 디렉티브는 template 태그와 함께 작동하지 않습니다.

- v-if를 사용할 때 숨겨진 요소는 DOM에서 완전히 제거됩니다. 그러나 v-show는 CSS를 사용하여 해당 요소를 숨깁니다. 즉, inspector에서 display 속성이 none으로 설정된 걸 볼 수 있을 겁니다.

### v-show 예제

```html
<div v-show="probability < 0.5">Hidden text</div>
```

### v-if와 v-show 중 어떤 것을 사용해야 할까요?

위에서 언급한 것처럼 v-show에는 일부 제한 사항이 있습니다.

템플릿 태그와 v-else 지원이 없습니다.

요소가 얼마나 자주 토글되는지에 따라 사용 여부가 달라집니다.

자주 토글되는 경우 v-show가 요소를 완전히 제거하는 대신 CSS를 사용하여 숨기기 때문에 더 나은 선택일 수 있습니다.

## 4. 루프를 이용하여 렌더링하기

### v-for 디렉티브

리스트를 표시할 때 보통 HTML에서는 일일이 모든 경우를 수작업으로 적었지만 VueJS에서는 v-for 티렉티브를 이용한 루프를 이용합니다.

### v-for 예제

예를 들어 사람들의 목록을 성, 이름 및 생년월일과 함께 표시해 보겠습니다.

따라서 이 목록이 애플리케이션 데이터에 필요합니다.

```javascript
{
  data() {
    return {
      people: [
        {
          id: 1,
          firstName: "John",
          lastName: "Doe",
          dob: "01-01-1980"
        },
        {
          id: 1,
          firstName: "Johny",
          lastName: "Doe",
          dob: "01-01-1980"
        },
        {
          id: 1,
          firstName: "James",
          lastName: "Doe",
          dob: "01-01-1980"
        }
      ]
    }
  },
  methods: {}
}
```

그런 다음 HTML에서 표시하려면 그냥 v-for 디렉티브에 추가하면 됩니다.

```html
<ul>
  <li v-for="person in people">
    <div>{{person.firstName}} {{person.lastName}} - {{person.dob}}</div>
  </li>
</ul>
```

### 루프에서 현재 인덱스 사용

배열을 반복할 때 현재 인덱스를 사용하는 것이 일반적입니다.

v-for 디렉티브를 사용할 때에도 현재 위치를 액세스 할 수 있습니다.

위의 코드에서 person in people라는 구문을 사용했는데, person 외에도 두 번째 인자로 index를 사용할 수 있습니다.

```html
<li v-for="(person, index) in people">
  <div>
    {{index}}. {{person.firstName}} {{person.lastName}} - {{person.dob}}
  </div>
</li>
```

### Key 속성

HTML에서 값을 표시할 때 VueJS는 변경된 값을 업데이트합니다.

그러나 배열의 경우에는 약간 까다로운데요.

VueJS에게 업데이트된 요소가 어떤 것인지 알려주어야 효율적으로 표시할 수 있습니다.

v-for 디렉티브가 포함된 요소에 key 속성을 추가하는 이유가 바로 이 이유입니다.

이 속성의 값은 v-bind 디렉티브를 사용하여 설정해야 하며 우리가 SQL에서 쓰는 id와 같이 고유한 값을 가져야 합니다.

```html
<li v-for="(person, index) in people" v-bind:key="person.id">
  <div>
    {{index}}. {{person.firstName}} {{person.lastName}} - {{person.dob}}
  </div>
</li>
```

### v-if 디렉티브와 v-for 디렉티브 함께 사용하기

보통 v-for 디렉티브와 v-if 디렉티브를 동일한 요소에 사용해서는 안 됩니다.

그러나 v-for 디렉티브를 사용하는 요소 내에서 첫 번째 요소에 v-if를 사용할 수는 있습니다.

보통은 아래 코드처럼 v-for 다음에 v-if를 쓰는 로직을 사용하지 않고 보통 VueJS의 초기화 객체에서 처음부터 filter 메서드를 사용한 다음 그 filter된 새로운 배열을 표시하는게 좋습니다.

```html
<ul>
  <li v-for="(person, index) in people" v-bind:key="person.id">
    <div v-if="index % 2 === 0">
      {{index}}. {{person.firstName}} {{person.lastName}} - {{person.dob}}
    </div>
  </li>
</ul>
```

### range 사용하기

range도 v-for 디렉티브에서 지원됩니다.

단순 배열 대신 최대 숫자를 제공하면 됩니다. 아래 코드에서 n은 1부터 10까지이며, 총 10번의 루프를 돌게 됩니다.

```html
<ul>
  <li v-for="n in 10">{{n}}</li>
</ul>
```

### 객체의 loop

배열뿐만 아니라 객체에서도 v-for 디렉티브를 사용할 수 있습니다.

loop 내의 각각의 반복에서 객체 속성 중 하나를 나타내게 됩니다.

이에 대한 예제로 이전에 사용한 배열의 요소 중 하나를 사용할 수 있습니다.

```javascript
{
  data() {
    return {
	      person: {
	        id: 1,
	        firstName: "John",
	        lastName: "Doe",
	        dob: "01-01-1980"
	      }
    },
  },
  methods: {}
}
```

디렉티브에서 사용하는 것은 배열이었을 때와 거의 같습니다.

유일한 차이점은 각 반복에서 세 가지 매개 변수를 가져온다는 것입니다.

배열의 경우 요소와 인덱스를 얻지만 여기서는 속성 값, 속성 키 및 인덱스를 얻습니다.

```html
<!-- 객체 -->
<ul>
  <li v-for="(value, key, index) in person">{{value}} {{key}} {{index}}</li>
</ul>
```

위 코드의 실행 결과는 아래와 같습니다.

```bash
1 id 0
John firstName 1
Doe lastName 2
01-01-1980 dob 3
```

---

## 5. 이벤트 처리

### 이벤트 디렉티브

VueJS는 많은 유형의 이벤트를 처리하는 데 도움이 되는 디렉티브를 제공합니다.

그 디렉티브가 바로 v-on 디렉티브입니다.

그러나 v-on만 작성해서는 안 되고 어떤 유형의 이벤트를 처리하는지 알려주어야 합니다.

즉, 콜론 다음에 해당 이벤트 유형을 추가해야 합니다.

```html
v-on:[이벤트_유형]="[핸들러]"
```

예제를 통해 더 명확하게 이해해 보겠습니다.

클릭 이벤트를 처리하는 함수를 추가해 보겠습니다.

초기화 객체에서 methods 하위에 handleClick 메서드를 추가하겠습니다.

```javascript
Vue.createApp({
  data() {
    return {}
  },
  methods: {
    handleClick: function () {
      console.log('hello world')
    },
  },
}).mount('#app')
```

이제 HTML에서 handleClick 메서드를 사용하려면 v-on 디렉티브를 어떤 요소에 추가하기만 하면 됩니다.

```html
<button type="button" v-on:click="handleClick">Click me</button>
```

### 핸들러 코드

위의 예에서 handleClick 문자열을 이벤트 처리 코드로 사용했습니다.

그러나 여기서 중요한 몇 가지 사항이 있습니다.

문자열에서 직접 자바스크립트 코드를 작성하거나 또는 함수에 대한 참조, 또는 메서드 호출을 사용할 수 있습니다.

함수에 대한 참조를 전달하지 않는다면 여러 문장을 적을 수 있으며, 이를 VueJS가 필요할 때 실행할 함수로 감싸서 실행된다고 상상할 수 있습니다.

```html
<!-- function reference(함수 참조) -->
<div>
  <button type="button" v-on:click="handleClick">Click me</button>
</div>

<!-- method call (메서드 호출) -->
<div>
  <button type="button" v-on:click="handleClick()">Click me</button>
</div>

<!-- 단일 함수 호출 -->
<div>
  <button type="button" v-on:click="console.log('hello')">
    Click other me
  </button>
</div>

<!-- 여러 함수 호출 -->
<div>
  <button
    type="button"
    v-on:click="console.log('hello'); console.log('other hello'); if(true) { console.log('another') }"
  >
    Click other me
  </button>
</div>
```

### 이벤트 객체

이벤트를 처리할 때 이벤트 객체에 액세스 해야하는 경우가 있는데요.

아래 코드와 같이 따옴표 사이에 $event 변수를 통해 이벤트 객체에 액세스할 수 있습니다.

### HTML에서 이벤트 객체에 액세스하기

```html
<!-- 이벤트에 액세스 -->
<div>
  <button type="button" v-on:click="console.log($event);">Console event</button>
</div>
```

이벤트를 전달할 때 참조를 사용하는 경우 첫 번째 매개변수로 $event를 지정하여 이벤트 객체에 액세스할 수 있습니다.

```html
<!-- function reference (함수 참조) -->
<div>
  <button type="button" v-on:click="handleClick">Click me</button>
</div>
```

```javascript
Vue.createApp({
  data() {
    return {}
  },
  methods: {
    handleClick: function ($event) {
      console.log($event)
    },
  },
}).mount('#app')
```

### 파라미터(매개변수) 및 이벤트 객체 전달

앞에서 말했듯이 이벤트 핸들러에서 이벤트 객체와 다른 데이터를 모두 사용하고 싶은 경우 메서드를 호출하고 이벤트 객체와 추가 데이터를 함께 전달할 수 있습니다.

따옴표 사이에 아래 코드와 같이 이벤트 객체를 먼저 파라미터로 넣고 두 번째로 다른 파라미터를 넘기면 됩니다.

```html
<div>
  <button
    type="button"
    v-on:click.stop.prevent="logEvent($event, 'extra data')"
  >
    Console event
  </button>
</div>
```

다음 코드는 별로 권장하지는 않지만 VueJS 문법에 따르면 적법한 문법입니다.

```html
<div>
  <button
    type="button"
    v-on:.stop.prevent="function($event) {logEvent($event, 'extra data')}"
  >
    Console event
  </button>
</div>
```

### 핸들러 modifiers

이벤트 핸들러에서 수행하려는 몇 가지 일반적인 작업이 있을 수 있습니다.

기본 동작 방지, 이벤트 전파 중지 또는 특정 버튼으로만 클릭 이벤트를 실행하는 등입니다.

v-on 디렉티브도 이런 작업을 지원합니다.

이벤트 유형 뒤에 점으로 구분된 modifiers(수정자)를 추가하면 됩니다.

다음 예제에서는 모든 이벤트에 대해 stopPropagation 및 preventDefault 이벤트 메서드를 모두 실행합니다.

```html
<div>
  <button type="button" v-on:click.stop.prevent="handleClick">Click me</button>
</div>
```

추가 예제로 아래 코드에서 이벤트 핸들러는 오른쪽 마우스 클릭으로만 클릭할 때 실행됩니다.

그리고 prevent 수정자를 사용하여 기본적으로 작동되는 오른쪽 클릭 팝업을 비활성화합니다.

```html
<div>
  <button type="button" v-on:click.stop.prevent.right="handleClick()">
    Click me with right button
  </button>
</div>
```

### 다른 이벤트 유형

지금까지의 모든 예에서 항상 click 이벤트를 사용했었는데요.

물론 다른 이벤트도 사용할 수 있습니다.

그리고 동일한 요소에 여러 이벤트 디렉티브를 사용할 수도 있습니다.

```html
<div>
  <div>input element</div>
  <input
    v-on:input="handleInput"
    v-on:click="console.log('click')"
    v-on:keyup="console.log('key up event')"
    v-on:keyup.enter="console.log('key up enter event')"
    v-on:click.prevent.right="console.log('right click')"
    type="text"
  />
</div>
```

### 대체 문법

많은 이벤트 핸들러를 사용하는 경우 v-on:를 계속 작성하는 것은 반복적일 수 있습니다.

또한 Vue 버전 3에서는 대체 구문이 도입되었습니다.

v-on: 대신 @ 기호를 사용할 수 있습니다.

둘 다 괜찮은 방법인데요.

다만 프로젝트 전체에서 일관성을 유지하면 좀 더 가독성이 좋아지지 않을까요?

```html
<div>
  <button type="button" @click="console.log('using @')">Using @ syntax</button>
</div>
```

---

## 6. 컴포넌트 소개

### 컴포넌트란

지금까지의 강의에서는 VueJS 애플리케이션을 만들고 특정 ID의 태그(`#app`)에 마운트했습니다.

그러나 이렇게 하면 HTML이 커져서 웹 프로그램 객체가 모든 데이터 및 메서드로 지나치게 채워져 더 이상 코드를 스케일 업 할 수 없을 정도가 되는데요.

따라서 로직 및 구조를 재사용 가능한 섹션으로 분리해야 합니다.

이것이 바로 컴포넌트입니다.

재사용 가능한 구조로서 HTML, 스타일을 위한 CSS, 로직을 위한 JavaScript를 포함할 수 있습니다.

그리고 컴포넌트는 커스텀 HTML 태그로 사용됩니다.

### 첫 번째 컴포넌트 만들기

여기서는 VueJS 버전 3을 사용하고 있습니다.

이전 버전과 다르게 컴포넌트 정의가 약간 변경되었기 때문에 주의할 필요가 있습니다.

이전 버전에서는 전역 Vue 객체에서 수행되었습니다.

그러나 버전 3부터는 새 Vue 애플리케이션을 만들고 해당 애플리케이션에서 컴포넌트를 등록해야 합니다.

```javascript
const app = Vue.createApp({
  data() {
    return {}
  },
  methods: {},
})
```

첫 번째 컴포넌트로 간단한 것을 만들어 보겠습니다.

아래 코드는 이름과 성을 하드 코딩한 것인데요.

그러나 컴포넌트를 등록하기 전에 configuration object를 만들어야 합니다.

이 객체는 초기화 객체와 매우 유사합니다.

```javascript
const PersonDetails = {
  template: `
    <div>
      <div>John, Doe</div>
    </div>`,
  data() {
    return {}
  },
  methods: {},
}
```

위 코드는 가장 간단한 버전 중 하나일 것입니다.

methods 객체는 비어 있고, 노출할 데이터를 반환하는 data 함수가 있습니다.

마지막으로 template 항목(속성)이 있습니다. template 속성을 추가하고 문자열로 해당 템플릿을 추가하는 방법입니다.

이제 위와 같이 해당 객체가 생성되면 컴포넌트를 등록할 수 있습니다.

컴포넌트 등록 방법은 생성된 Vue 애플리케이션에서 component 함수를 호출함으로써 수행됩니다.

```javascript
app.component('PersonDetails', PersonDetails)
```

위에서는 두 개의 매개변수를 전달했습니다.

첫 번째는 컴포넌트의 이름이며, 두 번째는 컴포넌트 구성 객체입니다.

컴포넌트 이름으로 PersonDetails를 선택했지만, 이 컴포넌트 이름은 아래와 같이 person-details라는 이름으로 변환됩니다.

당연히 컴포넌트 이름으로 person-details이라는 이름으로 등록해도 됩니다.

PersonDetails이라고 이름 짓는 걸 파스칼케이스 형식이라고 하는데요.

참고로 대문자가 단어의 시작 기준이며, 단어 사이는 '-'로 연결되며, 대문자는 자동으로 소문자로 변경됩니다.

그래서 PersonDetails라는 이름은 대문자가 2개니까 2 단어이고, 두 번째 대문자 D를 기준으로 '-'로 연결되어 person-details라는 이름이 HTML 커스텀 태그의 이름으로 등록되는 겁니다.

```html
<div id="app">
  <person-details></person-details>
</div>
```

위에서 볼 수 있듯이 우리가 만든 컴포넌트를 사용하는 것은 일반적인 HTML 태그를 사용하는 것과 동일합니다.

### 컴포넌트에 데이터 전달

위에서는 컴포넌트에서 이름과 성을 표시하는 데 하드 코딩된 데이터를 사용했습니다.

그러나 이는 재사용성이 떨어집니다. 종종 값을 전달하고 싶을 것입니다.

데이터 전달은 일반 HTML 요소와 매우 유사합니다.

컴포넌트를 사용할 때 속성을 추가하기만 하면 됩니다.

Vue에서는 값을 전달하려면 vue bind를 사용해야 하며 값은 JavaScript 표현식입니다.

```html
<person-details :first-name="'John'" :last-name="'Doe'" />
```

위 코드를 보시면 속성 이름 앞에 콜론을 사용했음을 알 수 있습니다.

이것은 v-bind 디렉티브의 축약 방식입니다.

두 번째로 주목해야 할 점은 두 따옴표 사이에 단일 따옴표를 사용했다는 것입니다.

이것은 문자열 내부가 JavaScript 표현식이므로 하드 코딩된 문자열 값을 전달하려면 다른 따옴표로 묶어야 합니다.

그렇지 않으면 John이라는 존재하지 않는 변수를 전달하려고 시도는 형태가 됩니다.

이제 값을 전달했으므로 컴포넌트 내에서 이를 어떻게 사용할지 조정해야 합니다.

이는 컴포넌트 구성 객체에 다른 속성을 추가함으로써 수행됩니다.

이 속성은 props이라고 하며 전달할 속성의 소문자와 대시로 된 이름의 배열입니다.

```javascript
const PersonDetails = {
  template: `
    <div>
      <div>John, Doe</div>
    </div>`,
  data() {
    return {}
  },
  props: ['firstName', 'lastName'],
  methods: {},
}
```

이것은 이러한 값을 전달할 것임을 정의한 것뿐이며 아직 사용하지는 않았습니다.

이를 사용하려면 this.$props 값을 사용할 수 있습니다.

템플릿에서 노출하는 여러 가지 방법이 있지만, 이번에는 데이터 객체에서 사용하고 동일한 이름으로 액세스 할 수 있도록 만들기 위해 데이터 객체에서 사용하겠습니다.

```javascript
const PersonDetails = {
  template: `
    <div>
      <div>{{firstName}}, {{lastName}}</div>
    </div>`,
  data() {
    return {
      firstName: this.$props.firstName,
      lastName: this.$props.lastName,
    }
  },
  props: ['firstName', 'lastName'],
  methods: {},
}

const app = Vue.createApp({
  data() {
    return {}
  },
  methods: {},
})

app.component('PersonDetails', PersonDetails)

// mount 명령어는 항상 마지막에 위치해야 합니다.
app.mount('#app')
```

### App vs 컴포넌트

"언제 컴포넌트 방식을 사용하고 언제 앱 방식을 사용해야 할까?"라고 생각할 수 있습니다.

앱은 서로 통신할 수 없지만 컴포넌트는 서로 통신할 수 있는 방법이 있습니다.

따라서 재사용 가능한 컴포넌트를 만들어 사용하는 것이 훨씬 좋습니다.

---

## 7. 라이프사이클 메서드

모든 애플리케이션과 컴포넌트에는 자체 라이프사이클이 있으며 특정 단계에서 어떤 작업을 수행해야 할 때가 있습니다.

이때 사용되는 게 바로 라이프사이클 메서드입니다.

라이프사이클 메서드는 애플리케이션의 특정 단계에서 실행되는 함수입니다.

이번에는 Vue의 라이프사이클 단계와 해당 단계에 액세스 하는 데 사용할 수 있는 메서드에 대해 알아보겠습니다.

### Vue 라이프사이클

![](https://blogger.googleusercontent.com/img/a/AVvXsEgpRkavMwPmacmop40fO0QP2M9R6YiTGNyxPnCrLVtUwePZt_yt4mijmPwr4762IYaq9icxc40WxoQaC4dYAZZJIDH4K8bZe1yDyRJlyEb1yHRyL5K1ll6SeNsK8g_y8jqnYrwTwm2O0EYoWVVRvrIlTHYQ7n74BmtvEHY26-gRqr8SCcrTdXdmlodq6mc)

- beforeCreate
  이 메서드는 VueJS에서 아무것도 시작되기 전에 실행됩니다. 초기화 객체가 있기 전에 수행되는 일종의 초기 작업으로 생각할 수 있습니다.

- created
  이 순간에는 초기화 객체가 있지만 템플릿은 아직 컴파일되지 않았습니다.

- beforeMount
  이 단계에서 템플릿이 컴파일되었지만 아직 브라우저에 표시되지 않았습니다.

- mounted
  이 단계에서는 템플릿이 컴파일되어 브라우저에 표시되었습니다. 바로 이때 이 메서드가 트리거 됩니다. 여기서는 컴포넌트에서 HTML 요소에 액세스해야 하는 경우가 있을 수 있습니다.

- beforeUpdate
  데이터의 변경으로 인해 컴포넌트가 변경됩니다. 그리고 다시 렌더링되기 전에 어떤 작업을 수행하려면 이곳이 적절합니다.

- updated
  beforeUpdate 메서드와 매우 유사하지만 차이점은 이 메서드는 컴포넌트 데이터가 업데이트되고 다시 렌더링 될 때 실행된다는 것입니다.

- beforeUnmount
  때때로 컴포넌트는 DOM에서 제거됩니다. 그러나 제거되기 전에 불필요한 데이터를 지우는 등의 정리 작업을 수행하려는 경우가 있을 수 있습니다. 제거 프로세스가 시작되지만 컴포넌트가 완전히 제거되기 전에 이 메서드가 트리거됩니다.

- unmount
  마지막으로 라이프사이클의 마지막 단계는 unmount 메서드입니다. 이 메서드는 컴포넌트가 완전히 DOM에서 제거된 후에 실행됩니다.

---

## 8. CLI를 사용하여 Vue 앱 생성

이전 파트에서는 VueJS를 CDN에서 로드하고 모든 코드를 하나의 JavaScript 파일에 작성했습니다.

이번 파트에서는 명령 줄을 사용하여 프로젝트를 생성하는 방법과 이 방법을 사용할 때 얻을 수 있는 이점에 대해 다루겠습니다.

### CDN 프로젝트와 그 문제점

이전 글에서는 CDN에서 Vue를 가져왔습니다.

모든 코드는 하나의 index.html 파일과 하나의 script.js 파일에 있었습니다.

이 방식은 규모가 작은 애플리케이션을 구축하는 경우에는 괜찮을 수 있습니다.

그러나 더 큰 시스템이 필요한 경우 어떻게 할까요?

### CLI 생성 프로젝트

#### 단계별 생성

NodeJS를 설치한 후 새 Vue 프로젝트를 생성할 수 있습니다.

프로젝트를 생성하려는 위치에서 터미널을 열고 다음 명령을 실행하면 됩니다.

```bash
npx create-vue@latest
```

실행 중에 몇 가지 프롬프트가 표시됩니다.

명령 끝에 `@latest`를 추가했다는 것에 주목할 수 있습니다.

이는 Vue의 최신 버전을 사용하도록 지정하는 것입니다.

#### 앱 실행

- `npm run format`: prettier를 사용하여 코드를 깔끔하게 표시할 수 있도록 정리합니다.
- `npm run dev`: 애플리케이션을 빌드하고 로컬 서버를 시작합니다. 실행 중에 로그에 사용된 포트가 표시됩니다.
- `npm run build`: 애플리케이션의 프로덕션용 빌드를 생성합니다.
- `npm run test:unit`: 유닛 테스트를 실행합니다.

#### 프로젝트 구조

전체적인 구조는 아래와 같습니다.

```bash
➜  vuejs-test tree -L 1
.
├── README.md
├── env.d.ts
├── index.html
├── node_modules
├── package-lock.json
├── package.json
├── public
├── src
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts

4 directories, 9 files
```

생성된 프로젝트를 열면 프로젝트 폴더의 루트에 몇 가지 파일이 있는 것을 알 수 있습니다.

이는 대부분 gitignore, prettier 및 환경 변수 파일과 같은 다양한 구성 파일입니다.

그 이후로 몇 가지 폴더도 있습니다. 먼저 node_modules라는 폴더가 있습니다.

이 폴더에는 `npm install` 명령을 실행할 때 설치한 모든 npm 종속성이 포함되어 있습니다.

public 폴더도 있습니다.

프로젝트를 생성하면 favicon 외에 다른 비슷한 파일(로봇 텍스트, 매니페스트 등)도 포함될 수 있습니다.

마지막 폴더는 src 폴더입니다.

이곳에 모든 애플리케이션 코드가 들어갑니다.

```bash
➜  src tree -L 1
.
├── App.vue
├── assets
├── components
└── main.ts

3 directories, 2 files
```

src 폴더에 들어가 보면 이미지 및 스타일링 파일을 보관하는 assets, 구성 요소를 위한 components가 있습니다.

여기는 없지만 만약 프로젝트 생성 시 라우터를 설치하려고 선택하면 초기 구성이 있는 router 폴더도 있습니다.

모든 스크립트 파일이 Vue 확장자를 가지고 있음을 알 수 있습니다.

---

## 9. .vue 파일에서 컴포넌트 생성

### .vue 파일

.vue 확장자의 파일은 기본적으로 HTML에서는 지원되지 않는 것입니다.

해당 확장자는 Vue 팀에 의해 도입된 새로운 요소입니다.

그래서 브라우저에서 직접 로드할 수 없습니다. 이를 사용하려면 이를 컴파일하고 순수 JavaScript, HTML 및 CSS 파일을 생성하는 컴파일러가 필요합니다.

다행히 CLI를 사용하여 프로젝트를 생성하면 이 작업에 필요한 모든 로더가 설정됩니다.

그러면 왜 .vue 파일을 사용해야 하는지 궁금해질 수 있습니다.

이전 파트에서는 CDN을 사용하여 Vue를 로드하는 중에 구성 요소 템플릿을 하나의 긴 문자열로 작성한 방식에 주목했을 것입니다.

또한 스타일링을 사용하지 않았으며 모든 것이 하나의 파일에 배치되었습니다.

그러나 .vue 파일을 사용하면 코드를 여러 파일로 분할할 수 있을 뿐 아니라 스크립트, 템플릿 및 스타일링 코드를 그룹화할 수도 있습니다.

이 방식은 컴포넌트에서 사용할 때 가장 큰 이점을 나타내므로 간단한 컴포넌트를 만들어 보겠습니다.

### 간단한 컴포넌트 - 이전 방식

이전 글에서 사용한 간단한 컴포넌트로 시작하겠습니다.

두 가지 props인 firstName lastName을 가져와 HTML에서 표시하는 컴포넌트입니다.

```javascript
const PersonDetails = {
  template: `
    <div>
      <div>{{firstName}}, {{lastName}}</div>
    </div>`,
  data() {
    return {
      firstName: this.$props.firstName,
      lastName: this.$props.lastName,
    }
  },
  props: ['firstName', 'lastName'],
  methods: {},
}

app.component('PersonDetails', PersonDetails)
```

그런 다음 이를 다음과 같이 사용할 수 있습니다.

```html
<person-details first-name="John" last-name="doe"></person-details>
```

### 새로운 방식을 사용

같은 컴포넌트를 새로운 .vue 파일로 마이그레이션할 수 있습니다.

이를 위해 몇 단계로 나눠서 진행해 보겠습니다.

1. .vue 파일 생성

CLI를 사용하여 프로젝트를 생성한 경우 components 폴더가 있을 것입니다.

그 안에 PersonDetails.vue 파일을 만듭니다.

2. 태그 추가

파일이 생성되면 코드가 들어갈 태그를 추가할 수 있습니다.

추가할 태그에는 자바스크립트 코드를 보유할 script 태그, HTML을 포함하는 template 및 CSS가 들어갈 style 태그 총 3가지가 있습니다.

```html
<script></script>
<template></template>
<style></style>
```

3. 템플릿 코드 추가

태그를 만들면 템플릿을 추가할 수 있습니다.

기존과 차이점은 따옴표로 묶이지 않아야 한다는 것입니다.

```html
<template>
  <div>
    <div>{{firstName}}, {{lastName}}</div>
  </div>
</template>
```

4. 스크립트 코드 마이그레이션

나머지 컴포넌트 코드는 스크립트 태그 사이로 이동해야 합니다.

첫 번째는 템플릿 속성 없이 구성 객체를 이동하는 것입니다.

두 번째는 객체를 일반적인 자바스크립트 모듈처럼 내보내야 한다는 것입니다.

```html
<script>
  export default {
    data() {
      return {
        firstName: this.$props.firstName,
        lastName: this.$props.lastName,
      }
    },
    props: ['firstName', 'lastName'],
    methods: {},
  }
</script>
```

5. 필요한 경우 스타일 마이그레이션

이 코드에서는 CSS를 사용하지 않았지만 사용했다면 스타일 태그 사이에 추가할 수 있습니다.

6. 메인 파일에서 컴포넌트 가져오기

CLI로 생성된 프로젝트에서 애플리케이션은 main.ts 파일에서 초기화됩니다.

여기에서 컴포넌트 코드를 가져와야 합니다.

components 폴더에서 무언가를 가져올 때 별칭 @/components를 사용할 수 있도록 번들러가 설정되어 있습니다.

```javascript
import PersonDetails from '@/components/PersonDetails.vue'
```

7. 컴포넌트 등록

```javascript
app.component('PersonDetails', PersonDetails)
```

### 주의할 점

우리가 만든 PersonDetails는 컴포넌트로써 createApp에서 처음 넣어야 할 루트 컴포넌트를 먼저 만들어야 합니다.

App.vue 파일을 먼저 만듭니다.

```javascript
// App.vue
<script setup lang="ts">
</script>

<template>
  <person-details first-name="John" last-name="doe"></person-details>
</template>
```

이 App.vue 파일에서 우리가 만들었던 person-details 컴포넌트를 사용하면 됩니다.

최종적인 main.ts 파일 내용입니다.

```javascript
import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import PersonDetails from '@/components/PersonDetails.vue'

const app = createApp(App)

app.component('PersonDetails', PersonDetails)

app.mount('#app')
```

---

## 10. 컴포넌트로 데이터 전달하기

### 초기 컴포넌트

우선 가장 간단한 컴포넌트로 시작하겠습니다.

이름이 "Hello, John"인 인사 컴포넌트입니다.

```html
<template>
  <div>Hello, John</div>
</template>

<script>
  export default {
    data() {
      return {}
    },
    methods: {},
  }
</script>
```

### 컴포넌트에 데이터 전달

이 컴포넌트의 문제는 항상 동일한 이름, 즉 "John"만 표시된다는 것입니다.

보통 이름을 변경할 수 있도록 컴포넌트에 정보를 전달하고 싶을 것입니다.

이를 위해 프롭스(Props)를 사용합니다.

컴포넌트를 HTML 엘리먼트처럼 사용하기 때문에 프롭스를 전달하는 것은 속성처럼 사용됩니다.

```html
<Greeting name="John" />
```

위 코드에서 이름은 하드 코딩되어 있습니다.

실제 예제에서는 아마도 스크립트 코드 어딘가에 이러한 것이 있을 것이며 변수 이름을 사용하여 전달할 수 있을 것입니다.

이는 바인드 디렉티브(v-bind) 또는 간단한 표기법을 사용하여 이루어집니다.

```html
<Greeting :name="name" /> <Greeting v-bind:name="name" />
```

### 컴포넌트에서 데이터 사용

#### 간단한 프롭스 정의

전달된 프롭스를 사용하려면 컴포넌트 코드에서 어떤 props를 기대하는지 정의해야 합니다.

가장 간단한 방법은 프롭스 이름 목록을 포함하는 props 속성을 추가하는 것입니다.

```html
<script>
  export default {
    props: ['name'],
    data() {
      return {}
    },
    methods: {},
  }
</script>
```

props를 목록에 추가하면 사용할 필요는 없지만, 추가하지 않으면 사용할 수 없습니다.

#### 템플릿 및 메서드에서 props 사용

props를 정의한 후에는 사용해야 합니다.

템플릿에서 직접 props 이름을 사용하는 것이 가장 간단한 방법입니다.

```html
<div>Hello, {{ name }}</div>
```

또 다른 방법은 컴포넌트 스크립트 코드에서 어떤 방식으로든 props를 노출시키는 것입니다.

여기에서는 this.$props 객체에 액세스하여 props를 얻을 수 있습니다.

그런 다음 메서드 또는 데이터 객체에서 원하는 props 값을 반환할 수 있습니다.

```html
<script>
  export default {
    props: ['name'],
    data() {
      return {
        personName: this.$props.name,
      }
    },
    methods: {
      getName() {
        return this.$props.name
      },
    },
  }
</script>
```

여기서 꼭 기억해야 할 중요한 점이 있는데요.

props 값을 데이터 객체에 할당하는 경우 부모에서 그 값이 변경되더라도 데이터 속성은 자동으로 업데이트되지 않습니다.

그 이유는 데이터 객체에 할당하는 것이 마운팅 프로세스 중에만 발생하기 때문입니다.

#### 고급 props 정의

위에서 props를 선언할 때 배열로 선언했습니다.

대안으로 객체를 사용하여 선언할 수도 있습니다.

이 경우 키는 props의 이름이고 값은 예상되는 값의 생성자 함수입니다.

TypeScript를 사용하는 경우 타입 어노테이션을 직접 사용할 수도 있습니다.

```html
<script>
  export default {
    props: { name: String },
    data() {
      return {
        personName: this.$props.name,
      }
    },
    methods: {
      getName() {
        return this.$props.name
      },
    },
  }
</script>
```

이것은 약간의 추가 작업이 필요할 수 있지만, 이러한 방법은 이점이 있습니다.

때에 따라 실수로 잘못된 값을 전달하면 콘솔에서 경고받게 되어 문제를 추적하는 데 도움이 될 수 있습니다.

---

## 11. 컴포넌트에서 부모로 데이터 전송

지난 장에서는 컴포넌트로 데이터를 전달하는 방법에 대해 다뤘습니다.

이번 11장에서는 컴포넌트에서 부모로 데이터를 보내는 방법을 다뤄 보겠습니다.

### 컴포넌트 설정

컴포넌트 설정부터 시작하겠습니다.

부모 컴포넌트는 버튼이 클릭된 횟수를 표시하고, 버튼이 클릭될 때 부모에게 업데이트를 보내는 자식 컴포넌트를 포함합니다.

```javascript
<!-- 부모 컴포넌트 -->
<template>
  <div>
    <div>클릭 횟수: {{counter}}</div>
    <CounterButton></CounterButton>
  </div>
</template>

<script>
import CounterButton from './CounterButton.vue';
export default {
  components: {CounterButton},
  data() {
    return {
      counter: 0
    }
  },
  methods: {}
}
</script>
```

```js
<!-- 자식 컴포넌트 -->
<template>
  <div>
    <button type="button" @click="handleClick">클릭</button>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    handleClick() {
      console.log("handle click")
    }
  }
}
</script>
```

### 부모로 데이터 전송

자식 컴포넌트에서 부모로 데이터를 보낼 때는 이벤트를 브로드캐스팅하는 방식을 사용합니다.

모든 컴포넌트는 이벤트 에미터 함수에 접근할 수 있으며, 이 함수는 컴포넌트 내에서 this 값을 통해 사용할 수 있습니다.

호출 시 첫 번째 매개변수는 이벤트 유형이고, 두 번째는 전송하려는 데이터입니다.

```javascript
this.$emit(이벤트_유형, 페이로드);
```

예제에서는 이벤트를 "increment-counter"로 지정하고, 항상 1씩 증가시키기 때문에 데이터를 전달할 필요가 없습니다.

```javascript
export default {
  data() {
    return {}
  },
  methods: {
    handleClick() {
      this.$emit("increment-counter");
    }
  }
}
```

### 컴포넌트에서 데이터 수신
컴포넌트가 데이터를 브로드캐스트하면 부모 컴포넌트는 이를 수신해야 합니다.

이는 다른 이벤트를 처리하는 것과 마찬가지로 v-on 디렉티브를 사용하여 수행할 수 있습니다.

에미트에서 사용한 이벤트 유형은 디렉티브에서 사용하는 것과 동일합니다.

```html
<!-- 부모 컴포넌트 -->
<template>
  <div>
    <div>클릭 횟수: {{counter}}</div>
    <CounterButton v-on:increment-counter="increment"></CounterButton>
  </div>
</template>

<script>
import CounterButton from './CounterButton.vue';
export default {
  components: {CounterButton},
  data() {
    return {
      counter: 0
    }
  },
  methods: {
    increment() {
      this.counter++;
    }
  }
}
</script>
```

### 이벤트 선언하기

이벤트를 브로드캐스트하는 컴포넌트를 작성할 때 이벤트를 선언하는 것이 좋습니다.

이는 컴포넌트의 emits 속성을 사용하여 수행됩니다.

```javascript
export default {
  emits: ["increment-counter"],
  data() {
    return {}
  },
  methods: {
    handleClick() {
      this.$emit("increment-counter");
    }
  }
}
```

---
