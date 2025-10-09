---
slug: 2023-11-30-all-about-css-variables-and-calc-function
title: CSS 강의 4편. CSS Variables와 calc 함수 완벽 이해
date: 2023-11-30 11:40:19.855000+00:00
summary: CSS 커스텀 variables과 calc 함수에 대해 자세히 알아보기
tags: ["css", "variables", "calc"]
contributors: []
draft: false
---

![](https://blogger.googleusercontent.com/img/a/AVvXsEjuMjXTSl48yOVQVEU9hYzgQydcMkafNWcgB1Ihdj7Oyj6ImCfoE_xbwswuoAUhHgPGLWDSnKiII4GgwE6r9ojY-wObIH3MN8OZ6inQbwaqLhx9Y0Fgla_W1qH5y1uquTHPiwSh84nnQuLPvYoffcaIFY_ejM0xdcRp7yfFRcmA2knLvFbMc0_5v3eWEwQ)

안녕하세요?

CSS 강의 4편입니다.

지난 시간에는 Grid Layout에 대해 심도 있게 공부했었는데요.

오늘은 CSS Variables와 calc 함수에 대해 알아보겠습니다.

전체 강의 리스트입니다.

1. [CSS 강의 1편. Flexbox 완벽 이해](https://mycodings.fly.dev/blog/2023-11-25-complete-understanding-css-flexbox)

2. [CSS 강의 2편. Flexbox Growing, Shrinking, Gaps, Wrapping 이해](https://mycodings.fly.dev/blog/2023-11-26-css-tutorial-understanding-css-flexbox-the-second)

3. [CSS 강의 3편. Grid Layout 완벽 이해](https://mycodings.fly.dev/blog/2023-11-27-understand-css-grid-completely)

4. [CSS 강의 4편. CSS Variables와 calc 함수 완벽 이해](https://mycodings.fly.dev/blog/2023-11-30-all-about-css-variables-and-calc-function)

5. [CSS 강의 5편. CSS에서 div를 중앙에 위치시키는 방법](https://mycodings.fly.dev/blog/2024-02-14-how-to-center-div-in-css)

---

** 목 차 **

1. [CSS Variables](#1-css-variables)

2. [전역 변수가 아닙니다](#2-전역-변수가-아닙니다)

3. [스페셜 커스텀 항목 만들기](#3-스페셜-커스텀-항목-만들기)

4. [기본값 적용하기](#4-기본값-적용하기)

5. [리액티브(Reactive)](#5-리액티브reactive)

6. [JS 프레임워크에서 사용하기](#6-js-프레임워크에서-사용하기)

7. [레고 블록 같은 CSS Variables](#7-레고-블록-같은-css-variables)

8. [calc 함수](#8-calc-함수)

---

## 1. CSS Variables

CSS Variables는 CSS를 좀 더 유연하게 만들어 주는 강력한 기능인데요.

CSS 변수는 엄밀히 말하면 일종의 CSS 항목(properties) 같은 겁니다.

예를 들어, display, color 같은 CSS 항목 같은 거라고 볼 수 있죠.

그래서, 변수를 선언한다고 생각하지 말고 새로운 CSS 항목을 만든다고 생각하시면 좀 더 이해가 편하실 겁니다.

```css
article {
  display: block;
  color: red;
  --favorite-food: tomato;
  --temperature: 18deg;
}
```

위 코드에서 보면 커스텀 항목은 두 개의 대쉬(--)로 시작하는데요.

이렇게 두 개의 대쉬로 시작하는 항목은 CSS에서 자체적으로 제공하는 빌트 인 항목과는 다른 커스텀 항목이라고 생각하시면 됩니다.

그리고 커스텀 항목도 다른 빌트 인 항목처럼 상속이 되는데요.

다음 예를 보시면 브라우저에서 정확하게 상속된 현상을 볼 수 있을 겁니다.

```html
<style>
  main {
    font-size: 2rem;
    --favorite-food: tomato;
  }
</style>

<main>
  <section>
    <a>Hello World</a>
  </section>
</main>
```

위 코드에서 main 태그의 CSS를 font-size와 그리고 커스텀 항목인 `--favorite-food`라는 다소 엉뚱한 이름으로 정했는데요.

이제 이걸 브라우저에서 한번 살펴볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEjOhIgEkwPDttO_84E-OnNxoDAibGhpjhI8xqd4gOxr4ynCNAM6mfMWsvfV4xSyW_hk9OojrSUvzpV57Hh2lzGb58TW_FgukNtsv10K_sqhqp7sHnJ2twRep8iA00TvWRXLffsg3CrMmTq4cu1p-aVgFVANSgSx_1nl2C8OYVXvpREZYl6fOgtVcoHD_ho)

우리가 볼 거는 위 그림에서 'Hello World' 글자가 있는 a 태그입니다.

a 태그를 검사해 보면 아래와 같이 나오는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEh0f_XWkCfU5K5uIHVPbsPM0yaw4Um77JMGEmmE4fCquSgX4x8C5EAlOqtHVbmQPfebG5MNff1ar4ylMNVlmwm6D6OmMS5EljY0Nb1vE3X7Z-cSAbuTaEFNouAoVuYa-euQnKrmZEaRmll3fLXPUio5bkBzqVMrJHVXBtWO5mCWPCHzgYDGqI1Id8hHYR0)

`--favorite-food`라는 항목이 tomato라고 나오네요.

tomato는 빌트 인 color 항목입니다.

현재로서는 `--favorite-food: tomato`라는 코드는 정말 아무런 뜻도 없는 겁니다.

이제 커스텀 항목을 사용해 볼까요?

```html
<style>
  main {
    font-size: 2rem;
    --favorite-food: tomato;
  }

  a {
    padding: 32px;
    background-color: var(--favorite-food);
  }
</style>

<main>
  <section>
    <a>Hello World</a>
  </section>
</main>
```

위와 같이 a 태그의 background-color에 var(--favorite-food)라는 표현을 썼습니다.

여기서 var 키워드는 커스텀 항목을 사용하라는 뜻입니다.

variable의 약자요.

그러면 background-color: tomato가 되는 거죠.

다시 브라우저를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEi5g2z4ri9y6y4bQZnbt0FaWPJhnvKZv_g5njTa24cM9-NqHtvlYHXUzRgLo0mS3SBrAqMCwIC9f7lWtaE99oGBr13a2FjDwwOzDUvwhwN-9fA9qSC125Ri-t0Zk1NoWmfsLkip6LqLr-DT8utvLIMPAUDoF026wYLk2J1Pa2rCAlNZKnU9MRo56epseUs)

a 태그의 배경 컬러가 tomato 색으로 변했습니다.

이게 바로 CSS Variable을 선언하고 사용하는 방식인 겁니다.

---

## 2. 전역 변수가 아닙니다

CSS Variables가 간혹 전역 변수라고 생각할 수 있는데요.

규칙상 전역변수는 아니고, 하위 자식 태그에 상속만 됩니다.

아래 코드를 잠시 살펴보시면,

```html
<style>
  a {
    --color: red;
  }

  main {
    color: var(--color);
  }
</style>

<main>
  <section>
    <a>Hello World</a>
  </section>
</main>
```

main 태그 밑에 section 태그가 있고 그 밑에 a 태그가 있는 형태입니다.

그러면 main 태그의 color 항목을 var(--color)로 선언했네요.

그러면 상속에 의해 a 태그의 color가 red가 되어야겠죠.

실제 브라우저를 보시면 아래와 같습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiJMsbK6A0leZMr6zaNEm_tkcZu8DxfiG82AH5Y_LcAjKGIzR5JLfKsAxMSogGtl-gSrAqeuaBrdpFN7bvUpAi0bf8CjGZZCgLEHusF17sPwKAHJ0vj7zVXLqbjoXJcTtOojDxAyG3opkKSU4RG3gGkR6umbjPwsKFA05uFaLhx489zXgLZXsmzBXUTvAg)

a 태그의 color가 red로 적용이 되지 않았습니다.

이게 왜 그런건가 하면, 바로 `--color`의 선언이 바로 a 태그 안에서 이루어졌기 때문입니다.

그래서 `--color`이란 커스텀 항목은 오로지 a 태그와 a 태그 밑의 자식 태그에만 읽힙니다.

그런데, main 태그라는 곳에서 `--color` 항목을 참조했거든요.

main 태그는 a 태그의 할아버지 격인 조상 태그이니까, 그리고 위로는 상속이 안 되니까 당연히 `--color` 커스텀 항목을 모릅니다.

그래서 아무런 반응이 일어나지 않는 거죠.

자바스크립트에서의 스코프와 같은 방식입니다.

```js
function main() {
  console.log(color); // color 변수에 접근 불가능합니다.

  function section() {
    function a() {
      let color = 'red';
    }
  }
}
```

위 코드에서 console.log(color) 명령문에서 color 변수가 접근이 안 되는 것과 같은 이치입니다.

이렇듯, CSS Variables 즉, 커스텀 CSS 항목은 전역변수가 아니고 오로지 자식 태그에만 상속된다는 것만 명심하시면 됩니다.

그러면 왜 전역변수라고 오해하는 걸까요?

바로 코딩 스타일 때문인데요.

보통 CSS 커스텀 항목을 아래와 같이 `:root` 항목에 많이들 생성하거든요.

```css
:root {
  --color-primary: red;
  --color-secondary: green;
  --color-tertiary: blue;
}
```

`:root`는 html 태그를 가리킵니다.

그러니까 html 태그에 커스텀 항목을 만들면 html 밑으로 있는 모든 항목에 상속이 되기 때문에 전역변수 같은 효과가 생기는 거죠.

각자의 코딩 취향인데 편하신 데로 하시면 됩니다.

---

## 3. 스페셜 커스텀 항목 만들기

디폴트로 CSS 커스텀 항목은 상속이 된다고 했는데요.

상속이 안 되게 만들려면 어떻게 해야 할까요?

브라우저가 발전되면서 새로운 API가 나오고 그러는데요.

바로 `@property` 항목을 이용하면 됩니다.

```html
<style>
  @property --text-color {
    syntax: '<color>';
    inherits: false;
    initial-value: black;
  }

  main {
    --text-color: deeppink;
    color: var(--text-color);
  }

  section {
    color: var(--text-color);
  }
</style>

<main>
  This text is just inside main.
  <section>
    This text is inside section.
  </section>
</main>
```

`@property`를 명시하고 그다음에 두 개의 대쉬로 커스텀 항목을 정의하면 되는데요.

여기에 옵션을 지정할 수 있습니다.

inherits 항목을 false로 설정하면 상속이 되지 않습니다.

그래서 section 태그의 텍스트 글자색이 initial-value인 black으로 적용되는 이유인 거죠.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjkUYViSrs4vsPn64FnWa4SQ0kQiKwY7vWm9jjo7LEAjGrRV33qWDw-buP3bWMEN5mTaG6sLUMJQHtsJlB9xdGUcQGUsa_rngYmrXVcepI-qWC6ViNkF1JDyST91bcbo6rU-rLrHgpS9js8e7duPxjmJU4QUE0-NZrZFR9PZtf_pNZDEEQHd9WCgsAi8Yo)

아직까지 이 기능은 Firefox에는 적용이 되지 않습니다.

크롬, 사파리, 에지에는 적용할 수 있으니 참고 바랍니다.

---

## 4. 기본값 적용하기

var 함수를 적용할 때 인자를 두 개를 넣을 수 있는데요.

첫 번째 인자는 커스텀 항목 이름이고, 두 번째에 넣을 수 있는 항목이 바로 디폴트 값입니다.

```css
.btn {
  padding: var(--inner-spacing, 16px);
}
```

위 코드에서 btn이라는 CSS 클래스는 padding 항목이 `--inner-spacing` 커스텀 항목의 값으로 지정되는데요.

`--inner-spacing` 항목의 값이 없으면 디폴트 값으로 16px가 지정되는 원리입니다.

---

## 5. 리액티브(Reactive)

Sass, Less 같은 CSS 전처리기에도 예전부터 CSS 변수가 있었는데요.

이것과의 차이는 바로 CSS 전처리기는 Sass, Less 파일을 컴파일해서 최종적으로 css 파일을 만드는 겁니다.

그렇기 때문에 CSS 전처리기에서의 CSS 변수는 그냥 초기값의 역할만 하는 거죠.

컴파일되면 해당 변수의 역할을 못 하는 겁니다.

그런데, CSS 변수 즉, 커스텀 항목은 브라우저에서 살아있는 변수의 역할을 합니다.

그래서 CSS 커스텀 항목은 우리가 자바스크립트로 직접 조작이 가능합니다.

예를 한번 볼까요?

```html
<style>
  button {
    font-size: var(--inflated-size);
  }
</style>

<button>Click me</button>

<script language="javascript">
  let fontSize = 1;
  const button = document.querySelector('button');
  
  button.addEventListener('click', () => {
    fontSize += 0.25;
    button.style.setProperty(
      '--inflated-size',
      fontSize + 'rem'
    );
  });
</script>
```

위 코드에서 보시면 CSS 커스텀 항목인 `--inflated-size`라는 이름을 button의 폰트 사이즈로 사용했는데요.

지금 이 `--inflated-size` 항목이 없기 때문에 button의 폰트 사이즈가 적용이 안 되고 있습니다.

그런데, button에 addEventListener를 통해 클릭 시 button.style.setProperty 메서드를 이용해서 `--inflated-size` 커스텀항목을 선언하고 해당 값을 지정했죠.

그래서 만약 버튼을 클릭하면 그제야 `--inflated-size` 커스텀 항목이 참조가 되면서 button의 폰트사이즈가 적용이 되는 겁니다.

CSS Variables는 리액티브하기 때문에 CSS Variables 값이 변하면 해당 CSS Variables 값을 참조한 모든 것이 업데이트되는데요.

그래서 React의 State(상태) 같은 거라고 보시면 됩니다.

---

## 6. JS 프레임워크에서 사용하기

CSS Variables은 JS 프레임워크에서 사용하면 진짜 편한데요.

```js
import styled from 'styled-components';

function ConfirmationMessage({ status, children }) {
  return (
    <Wrapper
      style={{
        '--main-color': status === 'success'
          ? 'green'
          : 'red'
      }}
    >
      {children}
    </Wrapper>
  );
}

const Wrapper = styled.p`
  font-weight: 500;
  background: white;
  padding: 32px;
  border-radius: 2px;
  color: var(--main-color);

  @media (min-width: 500px) {
    border-left: 2px solid var(--main-color);
  }
`;

const App = () => (
  <ConfirmationMessage status="error">
    Something has exploded
  </ConfirmationMessage>
);

export default App;
```

위와 같이 'styled-components' 같은 CSS-in-JS 프레임워크 같은 거에도 CSS variables은 잘 어울립니다.

React 컴포넌트의 props에 따라서 `--main-color`라고 지정한 커스텀 항목의 값을 변경할 수 있습니다.

---

## 7. 레고 블록 같은 CSS Variables

CSS Variables의 유용한 특성 중 하나가 바로 조각 단위로 적용할 수 있는 특성인데요.

레고 블록같이 조각조각 쪼개서 적용할 수 있습니다.

예를 들어 볼까요?

```html
<style>
  body {
    --standard-border-width: 4px;
  }

  strong {
    --border-details: dashed goldenrod;
    border:
      var(--standard-border-width)
      var(--border-details);
  }
</style>

<strong>Hello World</strong>
```

위 예에서 보면 border 특성의 값으로 최종적으로 `border : 4px dashed goldenrod` 값이 옵니다.

이렇듯, 커스텀 항목을 잘게 쪼개서 사용할 수 있어 아주 유용한데요.

이것은 CSS 커스텀 항목이 선언될 때 읽혀지는게 아니라 실제 사용될 때 그 값이 읽혀지기 때문에 위와 같은 레고 블록 효과를 발휘할 수 있는 겁니다.

---

## 8. calc 함수

calc는 CSS 표현식에서 4칙 산수 연산을 수행할 수 있는데요.

```css
.something {
  width: calc(100px + 24px);
  height: calc(50px + 25px * 4);
}
```

위와 같이 하시면 최종적으로 아래와 같아집니다.

```css
.something {
  width: 124px;
  height: 150px;
}
```

그런데, 왜 calc 함수를 사용할까요?

다음과 같은 경우가 있다고 합시다.

```css
.something {
  width: 14.286%;
  width: calc(100% / 7);
}
```

결론적으로 width를 14.286%라고 지정한 것은 동일합니다.

그런데, 두 번째 calc 함수를 이용한 문장이 좀 더 인간이 이해하기 쉬운 구조라는 거죠.

무슨 목적이 있어 14.286%라고 지정한 이유를 코드에 구체적으로 명기하는 방식이라 나중에 코드 리뷰 때 이해가 아주 쉬워집니다.

그리고, calc 함수의 매직이 있는데요.

calc 함수는 CSS unit(단위)를 혼용해서 써도 알아서 통일해 줍니다.

```css
spill-outside {
  margin-left: -16px;
  margin-right: -16px;
  width: calc(100% + 16px * 2);
}
```

위와 같이 하면 % 단위와 px 단위를 알아서 혼용해서 적용해 줍니다.

그리고, 유닛 단위 변환도 쉽게 해 주는데요.

아래 코드에서는 h2의 폰트 사이즈를 24px이라고 가정했을 때, 

```css
h2 {
  /* 24 / 16 = 1.5 */
  font-size: 1.5rem;
}

h2 {
  font-size: calc(24 / 16 * 1rem);
}
```

위와 같이 calc 함수를 이용해서 특정 목적에 맞게 rem이라는 unit으로 변환시킬 수 있게 되었습니다.

---

지금까지 CSS Variables와 calc 함수에 대해 알아 봤는데요.

점점 더 CSS에 자신감이 생기는거 같네요.

그럼.
