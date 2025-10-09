---
slug: 2023-02-12-understanding-css-box-model-with-intrinsic-sizing
title: CSS 박스 모델(Box Model) 이해하기
date: 2023-02-12 12:44:15.914000+00:00
summary: CSS 박스 모델(Box Model), Intrinsic Sizing 이해하기
tags: ["css", "intrinsic", "min-centent", "max-content", "fit-content"]
contributors: []
draft: false
---

안녕하세요?

CSS는 HTML, JS와 함께 웹을 구성하는 아주 중요한 요소인데요.

CSS 공부를 너무 간략하게 해서 그런지 처음부터 다시 해볼 생각으로 박스 모델(Box Model)부터 공부하기로 했습니다.

## 박스(Box) 모델

CSS가 표시하는 모든 것은 박스입니다.

따라서 CSS Box Model이 작동하는 방식을 이해하는 것은 CSS의 핵심 기반인데요.

예를 들어 다음과 같은 HTML 코드가 있고 그에 해당하는 CSS가 있다고 가정해 보겠습니다.

```html
<p>I am a paragraph of text that has a few words in it.</p>
```

```css
p {
  width: 100px;
  height: 50px;
  padding: 20px;
  border: 1px solid;
}
```

p 태그에 대한 CSS를 보시면 width와 height를 명시적으로 표기했습니다.

그리고 padding과 border도 표시했네요.

실행 결과는 아래와 같습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjZoz5G0WX3sM5h40sJOxQ2VoP7rXD64ovVs8Rb84-V2S1SikcKVIjUZcFCIdYXdthL4QHiNzGIOa0WZD2MsnIcsajZTVXUS5wLTbCa-K2NidbHwilmdAzYOSfk1S5HgIm8yJ2jrs6KBVeZyJNZJygBGbYTP6qcPJBbqBcTifxGJWhMtro2Nww_LukR)

폭이 100px이고 높이가 50px의 박스인데요.

border를 지정해서 박스 모양이 선명하게 보입니다.

그런데, p 태그의 내용이 박스를 넘어섰네요.

왜 이런 현상이 생기는지 의심을 갖는 것이 오늘의 주제입니다.

## Intrinsic vs Extrinsic

CSS에서 사이즈를 정하는 방식에는 두 가지 개념이 있는데요.

바로 Intrinsic과 Extrinsic입니다.

Extrinsic 사이징 방식은 처음에 본 방식처럼 명시적으로 폭(width)과 높이(height)를 지정하는 방식입니다.

가장 많이 쓰이는 div 태그는 디폴트로 블락 엘리먼트인데요.

div 태그는 기본적으로 div 태그의 부모 엘리먼트의 폭(width)을 전부 잡아먹습니다.

즉, 'width : 100%'인거죠.

그럼 Intrinsic 사이징 방식은 뭘까요?

Intrinsic 사이징 방식은 컨텐츠에 따라 사이징이 자동 계산되는 방식입니다.

그럼 Intrinsic 사이징 방식에 대해 좀 더 깊게 알아볼까요?

### Min Content

CSS에는 min-content라는 값이 있는데요.

바로 intrinsic minimum width라는 뜻입니다.

무슨 말이냐면 해당 엘리먼트의 폭(width)이나 높이(height)는 엘리먼트의 컨텐츠 중에서 가장 긴 단어(word)의 크기와 같다는 뜻입니다.

이게 무슨 말인지, Extrinsic 방식과 Intrinsic 방식의 예를 각각 살펴보면서 알아보겠습니다.

```html
<div class="wrapper">
  <h2>A title for an awesome article</h2>
</div>
```

```css
.wrapper {
  max-width: 500px;
  margin: 0 auto;
  border: 1px solid;
}

h2 {
  font-weight: bold;
  font-size: 1.5rem;
  background: skyblue;
}
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEjiHlR4GIt6aHqi4v0Fkd5wG0iaGK9fix8mtrbcAMsDFS62v-e5bNOzor5qtB4ehgsh1dmm_K8lKaGcNw8dAbOwD5lXyXSWnIu3_IV5M7h4XVb3L539BghLFgrl5sHLdQGokj7jwZBlOHta_oGDK1iRIvPT7Uc3ztj8QDukgthNtYPQVgUrBK7CCAVj)

위 코드를 보시면 div 태그에 max-width를 500px로 줬고, 그 하위 엘리먼트인 h2에는 폰트 크기와 굵기만 지정했습니다.

CSS는 기본적으로 박스 모델이기 때문에 위 그림과 같이 옆으로 큰 박스가 나오는데요.

여기서 더 중요한 건 Extrinsic 사이징 방식을 썼기 때문입니다.

바로 width, height 같은 항목에 숫자를 지정하는 방식인데요.

이제 위의 CSS 코드를 Intrinsic 사이징 방식으로 바꿔 볼까요?

```css
.wrapper {
  max-width: 500px;
  margin: 0 auto;
  border: 1px solid;
}

h2 {
  width: min-content;
  font-weight: bold;
  font-size: 1.5rem;
  background: skyblue;
}
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEg515bhuPu4XZ9JZCxD2N4ow1RQxEhqapR9QBzKQwFxANvPaLdMRsJAypz3PovPM2-xPyulQqoiL4SSsvL3YKmVUt19-GA7e9j5gQPmUomPZ_F1X_U3ueLELtABCgdIiACHz9fLacyEKUtiWBo_uHoyuizdJzs3pPsiQ9Z40qd8OFAgeHwBbvis4S7i)

결과가 어떻게 변했는지 위 그림을 보십시요.

뭔가 이상하죠.

h2 태그에 대한 width(폭) 'min-content'라고 지정했는데 뭔가 이상하게 변했습니다.

일단 div 태그는 박스 모델에 의해 브라우저 화면에서 첫 번째 칸을 100% 차지합니다.

그리고 그 안에 있는 h2 태그도 박스 모델에 의해 width를 부모 태그인 div의 100%를 차지해야 하는데요.

width에 'min-content'라고 지정하니까 브라우저가 달리 반응하고 있습니다.

위에서 'min-content'가 뭔지 알아봤는데 다시 그 의미를 읊어볼까요?

해당 엘리먼트의 폭(width)이나 높이(height)는 엘리먼트의 컨텐츠 중에서 가장 긴 단어(word)의 크기와 같다는 뜻입니다.

여기서 엘리먼트는 soft wrap 가능성이 있다고 가정하고 결정됩니다.

그러면 h2 태그의 컨텐츠 중에 단어로 쪼개서 가장 긴 단어는 뭘까요?

바로 'awesome'이란 단어입니다.

즉, soft wrap 형식으로 단어를 기준으로 행이 나눠지는데 가장 긴 단어인 'awesome'의 width(폭)이 바로 h2 태그의 폭이 되는 겁니다.

이제 'min-content'라는 뜻을 조금은 이해하셨나요?

## Max Content

그럼 'max-content'는 어떻게 작동할까요?

다시 CSS 코드에서 'min-content'를 'max-content'로 바꿔 보겠습니다.

```css
.wrapper {
  max-width: 500px;
  margin: 0 auto;
  border: 1px solid;
}

h2 {
  width: max-content;
  font-weight: bold;
  font-size: 1.5rem;
  background: skyblue;
}
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEg5xq3SWSWlTSHz9JTMS0m0ErIZmuwuYQDREeOpBZoyDLUfcohK9fESfbVNiGE3Xisb4hmrLqd9Sy1GmlJdUas3X4oykvVMyAfTC0fi5uAQMOvCr1KwUdIHsd89MyCz_r3kmNqDq8LWXaVyfgoOnO1v8yAw0Tf6UtynfF2XLwGRzIeQaXgQK64vSaRx)

실행 결과는 Extrinsic 사이징 방식과 같아졌을까요?

보시면 약간 틀립니다.

Extrinsic 사이징 방식일 때는 배경인 하늘색이 네모난 박스를 전부 차지했는데요.

'max-content'일 때는 h2 태그의 크기만큼만 하늘색이 그려지고 있습니다.

결과적으로 'max-content'를 다음과 같이 해석할 수 있습니다.

"max-content에서의 폭, 높이의 값은 컨텐츠의 폭, 높이와 같은 값을 가진다"입니다.

## Fit Content

Intrinsic 사이징 방식중에 세 번째인 'fit-content'가 있는데요.

'fit-content'는 말 그대로 'min-content'와 'max-content'의 콤비네이션입니다.

섞어 쓴다는 얘기인데요.

쉽게 로직으로 풀어볼까요?

즉, 엘리먼트가 fix-content일 때 적용되는 로직은?

1. 해당 엘리먼트가 자리할 수 있는 뷰포트의 여분 자리가 있는데 그게 min-content보다 작다면 그냥 min-content처럼 작동한다.

2. 만약 위에서 뷰포트의 여분 자리가 크면 max-content하고 비교하는데,

3. 뷰포트의 여분 자리가 max-content보다 작다면 그냥 해당 엘리먼트 크기 그대로 사용하면 되고,

4. 뷰포트의 여분 자리가 max-content보다 크다면 max-content를 적용한다는 뜻입니다.

뭔가 읽어보면 fix-content는 알아서 뷰포트 여유 자리를 잘 맞춰준다는 느낌인데요.

반대로 로직을 생각해 보면,

1. 뷰포트에서 여분 자리가 max-content보다 크면 크기는 max-content와 같고,

2. 뷰포트에서 여분 자리가 max-content보다 작다면, 해당 엘리먼트의 크기는 그냥 여분 자리가 됩니다.

3. 만약 여분 자리가 min-content보다도 작다면 해당 엘리먼트의 크기는 min-content의 크기가 됩니다.

위 h2 코드의 CSS에 width 항목을 'fit-content'로 바꾸고 브라우저 크기를 줄여보면 어떻게 작동하는지 알 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiEEpDgYnJSV7Bmpo8i7tdzEk_iA56qjXoiiQaFmtd7by32Mrb8YEBLmPnP-O7IiFfdfvjjfMlh_8Y8ATJvrrXme_OKfTScd4qTf3UPzFqh_38dNeER0rvmfUeTspsElnk7IDoxdUGJTWPVIjDKV8oOC1SZaYaz6tP4jN0cA6cW0DoS1JL4DDyKciVR)

브라우저의 창 크기가 크다면 그냥 max-content 값이 적용됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEimRGUt20W8aZxV3APlS43iDt06oYYyXRAh23c2u6BXlF-TVA4aQ7zn9Pn7SF5em6eW67e4K84gD0FqtNO-vpiB4kLVfNtqsvfostb0_d5TfapbpdiqYcha7V3puLIcaqxAV1zhRRmSXy9QkdguB7hNyqif1j-GjoR_WJQHARK-Jp_YjL0Zq9bs7VUi)

여분 자리가 max-content보다 작고 min-content보다 클 때는 위 그림처럼 그냥 여분 자리의 크기 그대로 작동됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEi4x4srMVVVPdZ-Rw87oAq9DKU9uBWuBG5pDdC2P_Zz_6Jtacd8jDsd3QvxR8OeicF6iBiLZnqypzt2QLrhotQ0Y2E5JnfNQGSN-Y3qeFjJjeoU3I55Jjz5ifMmUqTnEmy9saaw5fGn1SXVM7UONqZ51Vez2y70k4kyM351wS9_rMzfBzvWp_7Hgylq)

세 번째, 여분 자리가 min-content보다 작아진다면 최저값으로 min-content 값이 적용됩니다.

결론적으로 fit-content는 아주 유용한 Intrinsic 사이징 방식이 되는데요.

예를 들어 아래와 같이 사이드 메뉴가 있다고 했을 때 아주 유용합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjLEknHd8LFT6y-ndOSZlCV9av886tXX4jEmK6MWNEKPNknSLzsiu3b-dANIoY6BaC_J_aEMZaUmGWUovxxAFrxd7TpUFHK2EwQAzREmfG4rkQsseqHw3dWdLGH-uHFjvrnydSGFWuR4r0neGJOlm1R4CtTuTaBay8RY9_Z2nuG6hVcxBT97YcgSkp2)

전체 브라우저가 작아져도 사이드 메뉴의 크기를 fit-content로 지정하면 해당 메뉴의 크기가 최소값이 되기 때문에 메뉴가 깨져 보이지 않을 겁니다.

꼭 이해해 두시면 좋습니다.

## 박스 모델의 영역

다음으로는 박스 모델의 영역인데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhpuzeyB9zNozVV4q96Q6RaIzI8J-Q1wUGC0bqPzMq6cILw7d9-53SrObd1M0DyfDy8n8hOvDgxteDdx3_qVwrqkn-Dmq1Rke5DiKJ9jFg23is2rtKkFcVeMsOLJ0XIURPGhlWvynSQukhr_aXN5i8oicLWI7_ZBrdvDNTGoarAJNthkOp3e1EiADd4)

위 그림과 같이 content-box, padding-box, border-box, margin-box가 있는데요.

이 모든 게 박스 모델를 이루는 주요 요소입니다.

각각의 주요 특징은,

content-box는 부모 콘텐츠의 크기를 제어할 수 있고,

padding-box는 content-box를 둘러싸고 있으며 padding 속성에 의해 생성된 공간입니다.

패딩이 박스 안에 있기 때문에 박스의 배경을 박스가 만드는 공간에서 볼 수 있습니다.

특히 박스에 overflow: auto 또는 overflow: scroll과 같은 오버플로 규칙이 설정되어 있으면 스크롤바도 이 공간을 차지하게 됩니다.

border-box는 padding-box를 둘러싸고 있으며 그 공간은 border 값으로 채워지는데요.

border-box는 박스의 경계이며 테두리 가장자리는 시각적으로 볼 수 있는 영역입니다.

마지막 영역인 margin-box는 박스의 margin 규칙에 의해 정의된 박스 주변의 공간 여백 공간입니다.

박스의 outline-width가 200px처럼 클 수 있으며, 또 border-box를 포함하여 내부의 모든 것이 정확히 같은 크기일 수 있습니다.

그럼, 간단한 퀴즈하나 풀어볼까요?

```css
.my-box {
  width: 200px;
  border: 10px solid;
  padding: 20px;
}
```

.my-box의 크기는?

정답은 260px입니다.

왜냐하면 CSS의 box-sizing 기법은 기본적으로 content-box를 따르기 때문입니다.

그래서 content-box외에 padding과 border가 양쪽에 추가됩니다.

즉, content 200px + 패딩 2개니까 40px + 테두리 2개 20px로 총 260px가 됩니다.

box-sizing을 border-box로 바꾸면 다르게 나타날 수 있으니, 꼭 테스트해 보시길 바랍니다.

그럼.
