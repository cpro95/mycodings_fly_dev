---
slug: 2023-02-13-css-tutorial-css-selector-guide
title: CSS Selector(선택기) 자세히 알아보기
date: 2023-02-13 01:13:41.760000+00:00
summary: CSS Selector
tags: ["css", "selector"]
contributors: []
draft: false
---

안녕하세요?

오늘은 CSS 선택기(selector)에 대해 자세히 알아보겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgwP7OaNSF4J_0gZHy4E_HQW0YfnqVVNmzfwR2LNgvxSZbJjUlzEPEnWQECgAq2LNTMM28XMyK3sAki-aqWdYWaJuKOfneQY9xvVPRD-W4ok4p8d4wKKuEItsJ2Mk7h9rDuXj5fbFK1aBSvF86pCKysPxMtUTayMy6AMOlL_byeuekIC94netSpTFd7)

위 그림에서 보시면 CSS를 작성할 때 가장 많이 쓰이는 클래스 선택기의 한 예인데요.

선택기에는 클래스 선택기 외에도 여러 가지가 있습니다.

1. Universal selector (유니버설 선택기)

모든 걸 선택한다는 뜻입니다.

```css
* {
  color: hotpink;
}
```

2. Type selector (타입 선택기)

HTML의 태그를 선택한다는 얘기입니다.

```css
section {
  padding: 2em;
}
```

3. Class selector (클래스 선택기)

우리가 자주 쓰는 클래스 선택기입니다.

```html
<div class="my-class"></div>
<button class="my-class"></button>
<p class="my-class"></p>
```

```css
.my-class {
  color: red;
}
```

클래스 선택기로 CSS를 선택할 때는 정확한 걸 고르는 게 아니라 포함된 걸 고릅니다

그래서 다음과 같이 클래스를 여러 개 사용해도 한 개만 맞으면 적용됩니다.

```html
<div class="my-class another-class some-other-class"></div>
```

** 주의사항 **

클래스의 이름으로는 숫자로 시작하는 이름은 사용할 수 없으니 주의 바랍니다.

4. ID selector (아이디 선택기)

HTML 태그에 id를 부여해서 그걸 선택하는 방식입니다.

```html
<div id="rad"></div>
```

```css
#rad {
  border: 1px solid blue;
}
```

5. Attribute selector (속성 선택기)

HTML 태그에 속성을 부여하고 그걸 이용해서 CSS 선택하는 방식입니다.

```html
<div data-type="primary"></div>
<div data-type="secondary"></div>
```

```css
[data-type='primary'] {
  color: red;
}
```

위와 같이 속성에 특정값을 지정할 수도 있고 아래처럼 해당 속성이 있는 모든 걸 찾을 수 도 있습니다.

```css
[data-type] {
  color: red;
}
```

** 옵션 **

속성 선택기로는 대소문자를 구분할 수 도 있고 안 할 수도 있는데요.

기본적으로는 대소문자를 구분합니다.

아래와 같이 끝에 'i'를 추가하면 대소문자를 구분 안 합니다.

```css
[data-type='Primary' i] {
  color: red;
}
```

만약 아래와 같이 끝에 's'를 추가하면 대소문자를 구분합니다.

```css
[data-type='Primary' s] {
  color: red;
}
```

** 옵션2 **

속성 선택기로는 더 많은 일을 할 수 있는데요.

```css
/* "example.com"가 포함된 a link */
[href*='example.com'] {
  color: red;
}

/* https로 시작하는 a link */
[href^='https'] {
  color: green;
}

/* .com으로 끝나는 a link */
[href$='.com'] {
  color: blue;
}
```

## 선택기 여러 개 한 번에 쓰기

선택기는 아래처럼 여러 가지를 한꺼번에 쓸 수 있습니다.

```css
strong,
em,
.my-class,
[data-type] {
  color: red;
}
```

---

## Pseudo-classes

한국말로 가상 클래스라고 번역되어 사용되고 있긴 한데요.

선택자 뒤에 :가상이벤트를 붙이면 특정 이벤트마다 적용할 스타일을 설정할 수 있습니다.

- :link - 방문한 적이 없는 링크
- :visited - 방문한 적이 있는 링크
- :hover - 마우스를 롤 오버 했을 때
- :active - 마우스를 클릭했을 때
- :focus - 포커스 되었을 때 (input 태그 등)
- :first-child
- :last-child
- :nth-child
- :nth-last-child
- :first-of-type
- :last-of-type
- :nth-of-type
- :nth-last-of-type
- :checked
- :enabled
- :disabled

** 주의 사항 **

a:hover 가상 클래스는 무조건 a:link와 a:visited 뒤에 나와야 합니다.

또 a:active 가상 클래스는 a:hover 뒤에 와야 하고요.

그래서 보통 순서를 a:link, a:visited, a:hover, a:active 순으로 씁니다.

### All CSS Pseudo Classes

| Selector             | Example               | Description                                                                                              |
| -------------------- | --------------------- | -------------------------------------------------------------------------------------------------------- |
| :active              | a:active              | Selects the active link                                                                                  |
| :checked             | input:checked         | Selects every checked `<input>` element                                                                  |
| :disabled            | input:disabled        | Selects every disabled `<input>` element                                                                 |
| :empty               | p:empty               | Selects every `<p>` element that has no children                                                         |
| :enabled             | input:enabled         | Selects every enabled `<input>` element                                                                  |
| :first-child         | p:first-child         | Selects every `<p>` elements that is the first child of its parent                                       |
| :first-of-type       | p:first-of-type       | Selects every `<p>` element that is the first `<p>` element of its parent                                |
| :focus               | input:focus           | Selects the `<input>` element that has focus                                                             |
| :hover               | a:hove                | r Selects links on mouse over                                                                            |
| :in-range            | input:in-range        | Selects `<input>` elements with a value within a specified range                                         |
| :invalid             | input:invalid         | Selects all `<input>` elements with an invalid value                                                     |
| :lang(language)      | p:lang(it)            | Selects every `<p>` element with a lang attribute value starting with "it"                               |
| :last-child          | p:last-child          | Selects every `<p>` elements that is the last child of its parent                                        |
| :last-of-type        | p:last-of-type        | Selects every `<p>` element that is the last `<p>` element of its parent                                 |
| :link                | a:link                | Selects all unvisited links                                                                              |
| :not(selector)       | :not(p)               | Selects every element that is not a `<p>` element                                                        |
| :nth-child(n)        | p:nth-child(2)        | Selects every `<p>` element that is the second child of its parent                                       |
| :nth-last-child(n)   | p:nth-last-child(2)   | Selects every `<p>` element that is the second child of its parent, counting from the last child         |
| :nth-last-of-type(n) | p:nth-last-of-type(2) | Selects every `<p>` element that is the second `<p>` element of its parent, counting from the last child |
| :nth-of-type(n)      | p:nth-of-type(2)      | Selects every `<p>` element that is the second `<p>` element of its parent                               |
| :only-of-type        | p:only-of-type        | Selects every `<p>` element that is the only `<p>` element of its parent                                 |
| :only-child          | p:only-child          | Selects every `<p>` element that is the only child of its parent                                         |
| :optional            | input:optional        | Selects `<input>` elements with no "required" attribute                                                  |
| :out-of-range        | input:out-of-range    | Selects `<input>` elements with a value outside a specified range                                        |
| :read-only           | input:read-only       | Selects `<input>` elements with a "readonly" attribute specified                                         |
| :read-write          | input:read-write      | Selects `<input>` elements with no "readonly" attribute                                                  |
| :required            | input:required        | Selects `<input>` elements with a "required" attribute specified                                         |
| :root                | root                  | Selects the document's root element                                                                      |
| :target              | #news:target          | Selects the current active #news element (clicked on a URL containing that anchor name)                  |
| :valid               | input:valid           | Selects all `<input>` elements with a valid value                                                        |
| :visited             | a:visited             | Selects all visited links                                                                                |

## Pseudo-element

의사 요소라고 한국어로 번역되어 있긴 하지만 선뜻 딱 머리에 들어오지는 않네요.

의사 요소는 CSS3에 와서는 아래와 같은 이유로 두 개의 콜론(::)을 사용합니다.

` CSS1과 CSS2에서는 의사 클래스와 의사 요소를 나타낼 때 하나의 콜론(:)으로 함께 표기하였습니다. 하지만 CSS3에서는 의사 클래스의 표현과 의사 요소의 표현을 구분하기로 합니다. 따라서 CSS3에서는 의사 클래스는 하나의 콜론(:)을, 의사 요소에는 두 개의 콜론(::)을 사용하고 있습니다.`

가장 많이 쓰이는 의사 요소입니다.

### ::first-letter

이 의사 요소(pseudo-element)는 텍스트의 첫 글자만을 선택합니다.

단, 블록(block) 타입의 요소에만 사용할 수 있습니다.

이 의사 요소를 통해 사용할 수 있는 속성은 다음과 같습니다.

- font 속성
- color 속성
- background 속성
- margin 속성
- padding 속성
- border 속성
- text-decoration 속성
- text-transform 속성
- line-height 속성
- float 속성
- clear 속성
- vertical-align 속성 (단, float 속성값이 none일 경우에만)

- ::first-line
- ::before
- ::after
- ::selection

### ::first-line

이 의사 요소는 텍스트의 첫 라인만을 선택합니다.

단, 블록(block) 타입의 요소에만 사용할 수 있습니다.

이 의사 요소를 통해 사용할 수 있는 속성은 다음과 같습니다.

- font 속성
- color 속성
- background 속성
- word-spacing 속성
- letter-spacing 속성
- text-decoration 속성
- text-transform 속성
- line-height 속성
- clear 속성
- vertical-align 속성

### ::before

이 의사 요소는 특정 요소의 내용(content) 부분 바로 앞에 다른 요소를 삽입할 때 사용합니다.

```css
<style>
    p::before { content: url("/examples/images/img_penguin.png"); }
</style>
```

### ::after

이 의사 요소는 특정 요소의 내용(content) 부분 바로 뒤에 다른 요소를 삽입할 때 사용합니다.

```css
<style>
    p::after { content: url("/examples/images/img_penguin.png"); }
</style>
```

### All CSS Pseudo Elements

| Selector       | Example         | Description                                                  |
| -------------- | --------------- | ------------------------------------------------------------ |
| ::after        | p::after        | Insert content after every `<p>` element                     |
| ::before       | p::before       | Insert content before every `<p>` element                    |
| ::first-letter | p::first-letter | Selects the first letter of every `<p>` element              |
| ::first-line   | p::first-line   | Selects the first line of every `<p>` element                |
| ::selection    | p::selection    | Selects the portion of an element that is selected by a user |

---

## 결합 선택자 (Combination Selector)

이제 CSS에서 가장 헷갈려하는 결합 선택자로 왔네요.

결합은 다층 구조에 있어 쉽게 선택할 수 있는 옵션을 주는데요.

다음과 같은 HTML이 있다고 가정해 봅시다.

```html
<main>
  <section>
    <p>This is a paragraph.</p>
    <p>This is a paragraph.</p>
    <div>
      <p>This is a paragraph inside div.</p>
    </div>
  </section>
  <p>This is a paragraph.</p>
  <p data-type="primary">This is a paragraph.</p>
</main>
```

main 태그 밑에 section 태그가 있고, section 태그 밑에 p 태그, div 태그가 있습니다.

그리고 div 태그 밑에는 p 태그가 또 있는데요.

CSS 결합 선택자를 공부하기 전에 조상과 자손, 그리고 부모와 자식, 형제에 대해 알아 두어야 합니다.

위의 HTML 예에서 main 태그가 조상이 됩니다.

root 조상이죠.

그 밑에 자손(descendants)들이 어떤 게 있을까요?

자손들은 단수가 아니라 복수입니다. 그래서 여러 가지가 있을 수 있죠.

section, p, div 등 main 태그 밑에 있는 모든 게 바로 자손이 됩니다.

그러면 자식(child)은 뭔가요?

자식은 바로 부모 밑에 있는 단계잖아요.

그래서 main이 부모라면 자식은 section 태그가 자식이 됩니다.

section이 부모라면 자식은 그 밑에 있는 p와 div가 자식이 되죠.

그런데 div 밑에 있는 p는 section의 자식이 아닙니다. 자손인 거죠(손주 인거죠).

이걸 헷갈려하시면 안 됩니다.

그리고 형제(sibling)는 같은 단계의 태그인데요.

section 바로 밑에 있는 두 개의 p 태그가 서로 형제(sibling)인 거죠.

그럼, 결합 선택자로 넘어가 보겠습니다.

### 자손(descendants) 선택자

말 그대로 자손들입니다.

```html
<main>
  <section>
    <p>This is a paragraph.</p>
    <p>This is a paragraph.</p>
    <div>
      <p>This is a paragraph inside div.</p>
    </div>
  </section>
  <p>This is a paragraph.</p>
  <p data-type="primary">This is a paragraph.</p>
</main>
```

```css
section p {
  color: blue;
  font-weight: bold;
}
```

위의 예제로 보시면 section 태그 밑에 있는 모든 p가 되죠.

그럼 실행 결과를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEhuLcSfAD653T4rI9tY6Fz-nsoXh6TMIM1XXCMegT3_OnTTf-zUWBbDcmp61WYTVziUwuZDB0OBV7ICpnZRaKmRwKuQRetDX_Daig5XGcDFNI2dq_p66lZsAH89VyEH0CeaVV_57V7x2NOftFY69wqO5FONeGWOluuXzjqfdBXbTO-oob2KuEJ2cE6V)

main 태그 바로 밑에 있는 p 태그는 선택되지 않았습니다.

왜냐하면 section의 자손을 선택하라고 한 것이기 때문이죠.

그리고 section 태그 밑에 div 태그가 있고 그 밑에 p 태그가 있는데 이것도 선택됐습니다.

왜냐하면 div 태그 밑에 있는 p 태그는 손자가 되며 손자도 자손들 인거죠.

## 자식들(children) 선택자

그러면 자손들 말고 자식(child) 또는 자식들(children) 선택자에 대해 알아볼까요?

자식(child) 선택자는 직계 가족입니다.

아들, 딸이 바로 자식이죠.

손주는 아닌 거죠.

```css
section > p {
  color: blue;
  font-weight: bold;
}
```

'>' 를 이용해서 section 태그의 자식들 중에 p 태그를 고르라고 한 겁니다.

실행 결과를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEjua78X8CX1AisnpUS-XSrN9gSp3TM6qAa_XdBzZhwtm0ENIMMxtkB-M3qqgxODy3VLdMM26pJQHxj1ZroChcHuN49I2Ng9jod1Ftml02ovdv9KtEnILaC4PpEI_dwe35kxE5vKkBy5c34Jv48uL5_Bg3NiKnkTdtwCGfPbf-DmfvHtX08EOiSAzH8z)

위 그림처럼 div 태그 밑에 있는 p 태그는 선택되지 않았는데요.

div 태그 밑에 있는 p는 손주(자손)인거죠.

자식을 선택하는 거는 많이 쓰이니까 꼭 외워두셔야 합니다.

## 형제(sibling) 선택자

이제 형제, 자매 선택자로 왔는데요.

먼저, 모든 형제, 자매를 선택하는 선택자가 있습니다.

바로 '~'를 사용하는데요.

```cs
section ~ p {
  color: blue;
  font-weight: bold;
}
```

section과 형제인 모든 p를 구하라는 뜻입니다.

실행 결과를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEgf7ousVf-zB-HbKT27Mc0MJC2fDVGnYwn2we5VsG0eNDbckAu_LCGkEWk5w3eBs6HPLWu4acU0gKXz5kTmMz8Ifru6y8NQYCGukYKIkBqEuPDzXBgmA0aCLKHh3yNgf62kmboWOvr78sdgGji4kJu75nzqN_FXooDR7TaPLPjxJBYVQ0XguArAcq6F)

모든 형제이기 때문에 2개가 골라졌네요.

그럼 형제, 자매 중에 바로 다음에 붙어 있는 동생 형제만을 고르는 선택자를 알아볼까요?

바로 '+' 선택자를 씁니다.

```css
section + p {
  color: blue;
  font-weight: bold;
}
```

section의 형제 중에 바로 다음에 나오는 첫번 째 형제를 고르는 선택자입니다.

실행 결과를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEhAdqkgdMyzhaTybWg48mIxIWGahwLLVlQibsh9gDEu2o8QAwv9w4nMCUEZyBC9bsJydQkBKwyOwta0ekYxDzvwsjF39LeyJPru_wDkJUosBh47gytGBcZPB4IoLIKiBo9bFWfiPx9Eui6xTNLE9hZgr9Mt9XBYOcdRfvPLbAu6Qe4zIkm9yUFxORYh)

역시 한 개만 선택되었죠.

** 응용 **

```css
section > * + * {
  color: blue;
  font-weight: bold;
}
```

뭔가 복잡한 코드 같은데요.

section 다음에 '>'가 왔다는 뜻은 자손이 아니라 자식을 고르라는 건데요.

그다음에는 '\*'가 왔습니다.

즉, section 자식(child) 중에 모든 태그가 해당하고요.

그다음에는 '+'가 왔는데요. 즉, 첫번 째 형제(sibling)를 고르라는 뜻입니다.

실행 결과를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEjrXzjMMnMo4K1IU9gb812bVz9mZEswlZZvHHqJvjwLw5t3QHLDTV8Pn54261XXJdv7D-zu7Vg9B4WqfN4htWhNUBioBg1sCLz3HygZr1SKyZlRZ7rk-7vE1CzARXphaQo5R-MZ6sLemj_nBpfNMBoJtZT3czBK-TnC3vyLwX6Nq15mjh8ni_8i2-qM)

어떤가요? 뭔가 감이 오시죠.

결합 선택자를 외울 때는

| 표기법 | 뜻                         |
| :----: | -------------------------- |
|  빈칸  | 자손(descendants)          |
|  '>'   | 자식들(children)           |
|  '~'   | 모든 형제, 자매들(sibling)         |
|  '+'   | 바로 밑 동생 형제만(sibling) |

이렇게 외워두면 쉽습니다.

그럼.
