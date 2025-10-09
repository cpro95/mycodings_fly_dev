---
slug: 2023-02-13-what-is-css-inheritance-and-three-keyword
title: CSS 상속(Inheritance)에 대해 알아보기
date: 2023-02-13 09:57:54.045000+00:00
summary: CSS 상속 및 3개의 키워드인 inherit, initial, unset 알아보기
tags: ["css", "inheritance", "inherit", "initial", "unset"]
contributors: []
draft: false
---

CSS 캐스케이드 작동 원리에 있어 가장 중요한 게 바로 상속인데요.

만약 상속이 없다면 실제 HTML 코드에 수많은 CSS 코드가 들어가야 합니다.

CSS는 HTML의 중첩 태그에 있어 조상으로부터 자손까지 그 특성이 상속된다는 점인데요.

상속의 방향은 아래쪽입니다.

```html
<div style="color: red;">
  <p>This is a red paragraph.</p>
  <p>This is another red paragraph.</p>
</div>
```

div 태그가 color가 red인데요.

그러면 div 태그의 자손 태그인 p는 color 속성을 상속받아서 color가 red가 됩니다.

가장 일반적인 상속의 원리인데요.

```html
<div style="color: red;">
  <p style="color: blue;">This is a blue paragraph.</p>
</div>
```

위와 같은 코드에서는 p가 조상 태그인 div에서 color 속성을 상속받았지만 p 자신이 color 속성을 재정의하고 있습니다.

CSS 캐스케이드 방식에 의해 p에는 새로 정의된 color 속성인 blue가 적용됩니다.

## 상속되는 속성에는 뭐가 있을까요?

다음과 같은 속성이 상속됩니다.

- azimuth
- border-collapse
- border-spacing
- caption-side
- color
- cursor
- direction
- empty-cells
- font-family
- font-size
- font-style
- font-variant
- font-weight
- font
- letter-spacing
- line-height
- list-style-image
- list-style-position
- list-style-type
- list-style
- orphans
- quotes
- text-align
- text-indent
- text-transform
- visibility
- white-space
- widows
- word-spacing

## 상속 관련 키워드로 구체적으로 상속 제어하기

CSS 상속에는 3개의 키워드가 있는데요.

### inherit 키워드

보통 inherit 키워드는 복잡한 속성에서 예외를 만들때 아주 유용하게 사용됩니다.

다음과 같은 예가 있다고 합시다.

```css
strong {
  font-weight: 900;
}

.my-component {
  font-weight: 500;
}
```

strong 태그의 font-weight가 900이 되었고, .my-component의 font-weight는 500입니다.

그런데 만약 .my-component 안에 있는 strong을 특별하게 관리하고 싶다면 어떻게 할까요?

```css
.my-component strong {
  font-weight: inherit;
}
```

위와 같이 inherit 키워드를 씁니다.

이렇게 되면 .my-component 밑에 있는 strong 태그는 .my-componet의 font-weight을 상속받게 됩니다.

그래서 font-weight이 500이 되는 거죠.

inherit이 없다면 .my-componet 밑에 있는 strong은 맨 처음 정의했던 `strong { font-weight: 900; }`에 의해 900이 되지만, inherit이 지정되어 있으면 .my-component에서 상속받게 됩니다.

### initial 키워드

initial 키워드는 상속이 너무 복잡해졌다 싶으면 쓰는 건데요.

initial 키워드를 쓰면 해당 속성을 브라우저 기본 속성값으로 돌아갑니다.

```css
aside strong {
  font-weight: initial;
}
```

```html
<article>
  <p><strong>I am a strong element.</strong></p>
  <aside>
    <p><strong>I am a strong element 2.</strong></p>
  </aside>
</article>
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEibRJpraG5bpcjhoPhf6uL_VdB6ZnGdBGk1Cbu-Bimq2wmurYpPmkgtrjr2sx-_ypx_xqx42P763GqyhMTcPl0h5_Ounj7GZzCw8CQDxAJO8UiuQOnM_hL5rFDzSO6nCPF6XtpM7CUKJBOKgpbqAkzHu9s9hSvz_aOhUBWQHRb3wYMqZDy_t8V0Qny3)

위 그림과 같이 첫번째는 strong 태그에 의해 볼드체로 보이지만 두 번째는 볼드체로 안 보입니다.

`aside strong { font-weight: initial; }` 에 의해 font-weight가 initial로 돌아갔기 때문에 브라우저 디폴트 속성으로 돌아간 겁니다.

### unset 키워드

unset 키워드는 조금은 이상하게 작동하는데요. 만약 속성이 상속가능하다면 unset 키워드는 inherit 키워드와 똑같이 작동하지만 만약 그렇지 않다면 unset 키워드는 initial 속성처럼 작동할 겁니다.

조금 복잡한 예를 들어 보겠습니다.

```html
<p>I am a strong element.</p>
<aside>
  <p>I am a strong element 2.</p>
</aside>

<style>
  p {
    margin-left: 2em;
    color: goldenrod;
  }

  aside p {
    margin: unset;
    color: unset;
  }
</style>
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEg9jWECMjd5iiYTLvJUfteOM5ugeYlXaZeq-IggenOJc3PU-9npQ_zLgyOcV0xjqNcPmOaAi0qdRTZFncCYfvx5tgLbSzIdAlvdH59F2HrHlAlX4RyJUg0YvVXZrq20WY3a4z2X0qoSn3g3AjepsE2hHMsEfcVXjtc24JfIoY7uYDAh6WvZfeKNDglM)

실행 결과는 위와 같은데요.

aside p에 의해 마진과 컬러가 모두 초기화되었습니다.

unset 키워드에서는 all 항목을 쓸 수 있습니다.

다음과 같이 말이죠.

```css
aside p {
  all: unset;
}
```

unset과 initial의 차이점이 있는데요.

initial은 무조건 디폴트 값으로 돌리는 건데, unset은 이전에 설정한 속성이 없으면 디폴트 값으로 설정하고 이전에 해당 속성을 정의해서 상속되어 내려왔다면 그 이전 속성으로 돌아갑니다.

```html
<main>
  <p>I am a strong element.</p>
  <aside>
    <p>I am a strong element 2.</p>
  </aside>
</main>

<style>
  main {
    color: red;
  }

  p {
    margin-left: 2em;
    color: goldenrod;
  }

  aside p {
    margin: unset;
    color: unset;
  }
</style>
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEhRSFf97fwUfo_VihwGSAUb9SZEC8zKv-ABwbZvi5VugZKWpCZ82CJ_k1xChojON53HaAMji-1usWIxzlfiXTOy36WoSDozFPTu0rMVRs_iVnEg9SlzI23L6Uta3ZKGjrBcg71UuLubteio-fuPMemd4npKNSWUKmHpwHhXBk3sAqXrORsHdZ6-qgG_)

위 그림을 보시면 두번째 문장의 색깔이 레드로 바뀌었는데요.

color를 unset해서 그런 겁니다.

main 태그에서 color를 레드로 한번 정의했고 그 속성이 상속돼서 내려온 상태에서 unset을 지정했기 때문에 p의 goldenrod 색에서 main의 red 색으로 돌아간 겁니다.

만약 `main { color: red;}` 코드를 없애면 두 번째 문장은 검은색으로 나올 겁니다.

검은색이 브라우저의 디폴트 값이거든요.

unset에 대해 조금은 이해되셨는지 궁금한데요.

unset을 initial, inherit로 바꾸어 보면서 이해하시면 조금은 도움이 되실 겁니다.

그럼
