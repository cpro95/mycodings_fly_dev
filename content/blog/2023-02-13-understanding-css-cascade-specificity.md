---
slug: 2023-02-13-understanding-css-cascade-specificity
title: CSS CASCADE 적용 순서 및 특수성(Specificity) 알아보기
date: 2023-02-13 05:57:13.249000+00:00
summary: CSS 적용 순서 및 특수성(Specificity) 계산법 알아보기
tags: ["css", "cascade", "specificity"]
contributors: []
draft: false
---

안녕하세요?

요즘 CSS 문법을 새롭게 공부하고 있는데요.

오늘은 스타일의 적용 우선순위에 대해 알아보겠습니다.

CSS는 "Cascading Style Sheets"의 약자입니다.

HTML, XML 또는 다른 마크업 언어(markup language)로 작성된 문서의 모양과 서식을 결정하는 스타일시트 언어입니다.

CSS는 웹페이지의 프레젠테이션(스타일)과 컨텐츠를 분리하는 방법을 제공하여, 웹사이트의 모양을 시간이 지남에도 관리하고 업데이트하기 쉽게 합니다.

CSS를 사용하면 개발자는 웹페이지의 레이아웃, 색상, 폰트 및 다른 시각적 요소를 제어할 수 있어, 일관되고 전문적인 프레젠테이션을 가능하게 합니다.

일단 CSS가 대충 뭔지는 이해하셨는데요.

여기서 중요한 게 있는데요. 바로 캐스케이드란 뜻입니다.

캐스케이드는 CSS에서 한 요소에 여러 개의 스타일이 적용될 때, 어떤 스타일이 우선 적용될지 결정하는 규칙을 의미합니다.

CSS 캐스케이드는 스타일의 우선순위를 결정하여, 여러 개의 스타일이 충돌하더라도 개발자가 웹 페이지의 레이아웃과 모양을 제어할 수 있게 해 줍니다.

CSS 캐스케이드는 CSS 기반 레이아웃이 제대로 작동하는 데 꼭 필요한 개념이므로, 저 같은 웹 디자인 개발자들이 꼭 이해하고 넘어가야 할 겁니다.

CSS 캐스케이드는 단일 요소에 여러 스타일이 적용될 때 충돌되는 스타일이 어떻게 해결되는지를 결정하는 규칙과 안내서를 말합니다. CSS 캐스케이드는 각 스타일에 할당된 우선순위, 또는 "가중치"에 따라 요소에 적용될 스타일을 결정합니다.

CSS 캐스케이드는 충돌되는 스타일이 즉, 같은 이름이나, 중복으로 적용된 스타일이 어떻게 해결되는지를 정의하는 규칙이 있고 그에 따라 작동합니다.

캐스케이드는 충돌되는 스타일이 있다고 에러를 뿜어내지는 않고요.

그냥 중복 순위에 의해 중요도가 떨어지는 건 무시하는 원칙을 사용합니다.

그래서 에러 없이 웹페이지가 잘 보이는 거죠.

CSS 캐스케이드에서 중요하게 고려되는 요소는 다음과 같습니다.

1. 특수성(Specificity): 선택자(selector)의 특수성은 특정 요소를 선택하는 선택자가 얼마나 "구체적"인지 결정합니다. 높은 특수성을 가진 선택자는 낮은 특수성을 가진 선택자보다 우선 적용됩니다.

2. 중요도(Importance): "!important" 선언은 스타일 규칙에 가장 높은 우선순위를 줄 수 있습니다.  즉, 특수성(Specificity)에 관계없이 다른 모든 스타일보다 우선 적용되도록 합니다.

3. 출처 순서(Source order): 스타일시트에서 나중에 선언된 스타일이 이전 스타일보다 우선 적용됩니다. HTML 문서의 끝에 있는 스타일 블록에서 정의된 스타일이 문서의 시작에서 정의된 스타일보다 우선 적용되는 것을 의미합니다.

이러한 규칙에 따라 CSS 캐스케이드는 개발자가 하나의 요소에 여러 스타일이 적용되어도 페이지의 스타일링을 제어할 수 있도록 합니다.

---

## Specificity(특수성)

캐스케이드에서 가장 중요한 특수성에 대해 정확히 이해할 필요가 있습니다.

스타일이 중복되었을 때 어떤 게 먼저 적용되는지 결정하는 방식인데요.

제가 이해한 우선순위는 아래와 같습니다.

1. !important 라고 지정된 요소가 가장 우선순위가 높습니다.

```css
p {
  color: blue !important;
}
```

2. 인라인 스타일(inline style)이 두 번째로 우선순위가 높습니다.

```css
<p style="color: blue;">This is a blue paragraph.</p>
```

3. ID 선택자(selector)

4. 클래스 선택자(class selector), 속성 선택자(attribute selector), 가상 클래스(pseudo-classes)

5. 요소(element) 즉, HTML 태그 선택자 (예, p, div 같은 거), 그리고 pseudo-elements(예 : ::before)

우선순위 시스템을 쉽게 이해하는 방법이 있는데요.

바로 캐스케이드의 넘버링 시스템(Numbering System)입니다.

다음과 같은 공식인데요.

```bash
specificity = a*100 + b*10 + c
```
a : ID 선택자(selector)
b : 클래스 선택자(class selector), 속성 선택자(attribute selector), 가상 클래스(pseudo-classes)
c: 요소(element) 즉, HTML 태그 선택자 (예, p, div 같은 거)

그리고 중요한 거는 인라인 스타일이 지정된 거는 1000점을 줍니다.

그리고 더 중요한 거는 위의 넘버링 시스템을 무시하고 !important라고 지정된 스타일이 가장 높은 점수를 가집니다.

즉, 끝판왕 !important가 가장 우선순위가 높다는 뜻이죠.

예를 들어 아래 같이 같은 이름의 중복된 스타일이 있다고 칩시다.

```css
p {}
.header {}
#header {}
#header .header {}
```
넘버링 시스템으로 특수성을 계산해 볼까요?

1. P: 0 * 100 + 0 * 10 + 1 = 1점

2. .header: 0 * 100 + 1 * 10 + 0 = 10점

3. #header : 1 * 100 + 0 * 10 + 0 = 100점

4. #header .header : 1 * 100 + 1 * 10 + 0 = 110점

그래서 위와 같이 스타일이 중복될 때는 '#header .header' 스타일이 가장 특수성이 높아서 이게 적용됩니다.

여기서 중요한 점은 특수성(specificity)는 동일한 스타일 규칙 내에서만 적용되며, 다중 스타일 시트에 걸쳐 적용되지 않는다는 겁니다.

따라서, 어떤 selector가 A라는 스타일 시트에서 높은 specificity 값을 가지고 있더라도, B라는 스타일 시트에 있는 selector보다 점수가 높더라도 즉, 더 특수적(specific)하더라도 같은 스타일 시트라서 적용되지 않습니다.


예제 - 우선순위 계산

```html
<html>
<head>
  <style>
    #demo {color: blue;}
    .test {color: green;}
    p {color: red;}
  </style>
</head>
<body>

<p id="demo" class="test" style="color: pink;">Hello World!</p>

</body>
</html>
```

위 예를 잘 살펴보면

#demo가 우선순위가 .test보다 높죠.

.test는 p 스타일지정보다 높고,

그런데 가장 중요한 inline style이 있기 때문에 인라인 스타일이 적용됩니다.

---

## !important 내에서도 우선순위가 있습니다.

1순위 : transition

2순위 : animation

3순위 : font-size, background, color 같은거

왜 !important 내에서도 우선순위가 있냐면 transition, animation 같은 거는 브라우저의 비주얼 상태에 큰 영향을 주기 때문에 이게 먼저 우선순위를 가지는 겁니다.

---

## 출처 순서(Origin Source)

HTML의 구조상 맨 위에 나오는 스타일 보다 그 뒤에 나오는 스타일이 우선 적용됩니다.

```css
p {
  color: red;
  color: blue;
}
```

위 예제처럼 항상 나중에 나오는 게 적용됩니다.

그리고 브라우저가 지원하는 기능이 있는지 없는지 잘모르는 애매한 때에 출처 순서를 이용해서 CSS를 작성할 수 있습니다.

```css
.my-element {
  font-size: 1.5rem;
  font-size: clamp(1.5rem, 1rem + 3vw, 2rem);
}
```

만약 clamp라는 CSS 함수를 지원하지 않는 브라우저라면 font-sizes는 1.5rem 이 되고 지원하면 알아서 새로 계산하겠죠.

이제까지 CSS 우선순위, 특수성에 대해 알아봤는데요.

CSS는 여전히 공부해야 할 게 정말 많은 거 같네요.

그럼.
