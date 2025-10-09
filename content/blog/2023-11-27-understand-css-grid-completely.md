---
slug: 2023-11-27-understand-css-grid-completely
title: CSS 강의 3편. Grid Layout 완벽 이해
date: 2023-11-26 06:21:54.158000+00:00
summary: CSS Grid Layout 심도 있게 이해하기
tags: ["css", "grid"]
contributors: []
draft: false
---

![](https://blogger.googleusercontent.com/img/a/AVvXsEgFWJtGyx3OGQEUZEJ0GT2WNtEhDlFYcC_pwZ_a5eAYf_ec-9TZVTw2rYKCdUT1tJObNuRLivFrINWFDWeaLNG1DcgQSjj4P2MLam1dMdiNwTbkDKSoMgZkRWJ9v8pmHeWOcUzcyfAV9vgIFjGCcF93iHdUSJmkTcn95XiPZiH9qPhc3r3HB0BmN1l0s1M)

안녕하세요?

CSS 강의 3편입니다.

지난 시간까지는 Flexbox에 대해 심도 있게 공부했었는데요.

오늘은 Grid Layout에 대해 알아보겠습니다.

전체 강의 리스트입니다.

1. [CSS 강의 1편. Flexbox 완벽 이해](https://mycodings.fly.dev/blog/2023-11-25-complete-understanding-css-flexbox)

2. [CSS 강의 2편. Flexbox Growing, Shrinking, Gaps, Wrapping 이해](https://mycodings.fly.dev/blog/2023-11-26-css-tutorial-understanding-css-flexbox-the-second)

3. [CSS 강의 3편. Grid Layout 완벽 이해](https://mycodings.fly.dev/blog/2023-11-27-understand-css-grid-completely)

4. [CSS 강의 4편. CSS Variables와 calc 함수 완벽 이해](https://mycodings.fly.dev/blog/2023-11-30-all-about-css-variables-and-calc-function)

5. [CSS 강의 5편. CSS에서 div를 중앙에 위치시키는 방법](https://mycodings.fly.dev/blog/2024-02-14-how-to-center-div-in-css)

---
 
** 목 차 **

1. [CSS Grid](#1-css-grid)

2. [Grid flow](#2-grid-flow)

3. [Grid 구조화](#3-grid-구조화)

4. [암시적 행 vs 명시적 행](#4-암시적-행-vs-명시적-행)

5. [자식 요소 배치하기](#5-자식-요소-배치하기)

6. [Grid areas](#6-grid-areas)

7. [정렬](#7-정렬)

   7.1 [justify-content](#7-1-justify-content)

   7.2 [justify-items](#7-2-justify-items)

   7.3 [justify-self](#7-3-justify-self)

   7.4 [align-content](#7-4-align-content)

   7.5 [align-items](#7-5-align-items)

   7.6 [align-self](#7-6-align-self)

8. [두 줄짜리 센터링 트릭](#8-두-줄짜리-센터링-트릭)

---

## 1. CSS Grid

Grid 레이아웃은 레이아웃 알고리즘 중 하나이며, 주로 HTML의 구조화에 쓰이는 레이아웃인데요.

Flexbox와 더불어 오늘날 가장 많이 쓰이는 레이아웃입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgkuhPU7ZX-pGR7pxD8IxaL786_AmLh0laUozVrHa1Ymc0cXDLihBDGVlXm2Em0JuaKYOyrWpFdDaL-00lQtoq-_ompPfQX7MeRfmnFgpC0aRyPJv0tB-quFuqk4qhKIvYRstxJcTzyhygAmiYalwtfwvW0siUbrVvQ4Vb8xHVHlNJNTjvAL0qy1zBoLXI)

위와 같이 Header, Nav, Main, Footer 등 HTML을 구조화하기 위해 Flexbox 보다 더 강력한 기능을 제공해 줍니다.

위 그림을 보시면 점선이 보이시는데요.

구조화를 도식화하기 위해 점선을 넣었지, 실제로는 화면에 점선, 실선 모두 나타나지 않습니다.

CSS가 다른 레이아웃 알고리즘과는 다르게 Grid 레이아웃이 적용된 컨테이너 안에 있는 걸 나눠서 행과 열로 구분하는데요.

반대로 Table 레이아웃은 행과 열을 `tr`, `td` 태그로 분명하게 지정해야 합니다.

CSS Grid 맛보기는 끝났으니까요, 본격적으로 들어가 보겠습니다.

---

## 2. Grid flow

Grid를 적용하려면 CSS로 아래와 같이 지정하면 됩니다.

```css
.wrapper {
  display: grid;
}
```

CSS Grid는 디폴트로 한 개의 열(column)을 가지는데요, 반면에 행(rows)은 grid wrapper 안에 있는 block 기반 자식 요소의 숫자에 따라 무수히 많이 만들 수 있습니다.

이걸 전문용어로는 암시적 그리드(implicit grid)라고 합니다.

암시적 그리드는 매우 다이내믹한데요, 자식 요소 수에 따라 행을 무수히 만들어 냅니다.

그리고 각 자식 요소는 그 자체로 한 개의 행(row)이 됩니다.

기본적으로 CSS Grid에 있어 grid 컨테이너의 높이(height)는 자식에 따라 달라지는데요.

자식 수가 많을수록 늘어나고 자식 수가 줄어들면 grid 컨테이너의 높이도 줄어들게 됩니다.

이 방식은 CSS Grid 방식도 아니고요, 기본 레이아웃 모드인 Flow 레이아웃 모드의 특성 때문입니다.

왜냐하면 grid 컨테이너는 그 안에 있는 게 grid 레이아웃을 따르는 거고, grid 컨테이너 자체는 Flow 레이아웃을 따르는 거기 때문입니다.

그리고 Flow 레이아웃에서는 블록 컨텐츠는 수직으로 grow 하는 특성이 있기 때문이죠.

만약에 grid 컨테이너 자체의 높이(height)를 지정하면 어떻게 될까요?

```css
.grid-wrapper {
  display: grid;
  height: 300px;
}
```

위와 같이 grid-wrapper의 height를 300 px로 지정했습니다.

자식 수가 3개 4개 일 경우를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEgRyx9opwvKFMFLMmMdvzVs7v-jQxGo99PFzbhFpJFyWTC6dN9gsFJpke1Oa_UVpZdLUbghGZs76MGRj4g2L4dOSU2c1YiFoVdsTXkqcdX1jv_8NX68p9v67bGg54UYmQRzLuGwI0uszAzD-QUeH2FWOaFpHHNuv4KJpLV7x2rUuBCh5uJfEe0NC_EEJes)

![](https://blogger.googleusercontent.com/img/a/AVvXsEgvIaDf1iLFEd8oNA5SIRA1gAY38I0jOVMOUi-uTT9zYj3XjWXSfANJ-mrKoavCqmsCEBcQIP6_a8tE74clChzPs7tnIPHFcS6_IRwuJtOc5WYe7G_0tyowHgyFqBy_pd1h648CoOylcSE-A4FOCKLx9cf1kRggujlgZN8G7C_sS9v01uuvo4qIsiFmPPk)

위 두 개의 그림처럼 grid-wrapper의 전체 높이 300 px는 그대로이고 안의 자식 하나당 높이가 자식 수에 따라 변합니다.

---

## 3. Grid 구조화

CSS Grid는 디폴트 값으로 한 개의 열을 가진다고 했는데요.

그러면 여러 개의 열(column)을 지정하려면 어떻게 해야 할까요?

이럴 때 쓰는 것이 바로 `grid-template-columns` 항목입니다.

이름이 조금 길죠.

```css
<style>
  .parent {
    display: grid;
    grid-template-columns: 25% 75%;
  }
</style>

<div class="parent">
  <div class="child">1</div>
  <div class="child">2</div>
</div>
```

사용법은 `grid-template-columns` 항목 뒤에 텍스트로 2개, 3개 등 원하는 열의 숫자만큼 구분 지어 적어주면 됩니다.

위에서는 퍼센티지로 2개의 열에 대한 너비를 구분 지었는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjVRWMlMRlZbU8mywdJpnzGp2n8nDDxBjQ08CtLhIGK7_WcQJgWY-xVBkBRoUqyskuYNtfe-XbhGViRaqr_jlYnrGVQpCwQZK4sV8yllzX-ys3_UUr6HBHG7963BpOAi-KlO2gswgSx9r9utmrwjGJu11O1xsbdnATRokrAD7Gv5hPTsf27dhuYk5rsUVE)

위와 같이 25%와 75%로 완벽하게 분할된 열을 볼 수 있을 겁니다.

참고로 그림상 점선은 이해를 돕기 위해 추가한 겁니다.

`grid-template-columns` 항목에 들어갈 수 있는 거는 width를 지정하는 모든 단위인 pixels, rems, viewport units, 퍼센티지 등 모든 게 들어갈 수 있고, Grid 레이아웃에만 적용되는 `fr` 이라는 단위도 들어갈 수 있습니다.

`fr` 이라는 단위는 `fraction`이라는 뜻으로 말 그대로 1/2, 2/3 같이 `분수`를 나타냅니다.

만약 `grid-template-columns: 1fr 3fr;` 이렇게 지정했으면 어떻게 해석해야 할까요?

첫 번째 열은 1개의 공간을, 두 번째 열은 3개 공간을 나타냅니다.

그러면 분수로 나타내면 총 4개 중 첫 번째 열은 1/4가 되고 두 번째 열은 3/4을 차지하는 공간을 가지게 됩니다.

결과적으로, `grid-template-columns: 25% 75%;`와 같은 뜻이 됩니다.

그런데 `fr` 단위를 쓰는 이유가 있는데요.

왜냐하면 퍼센티지나 숫자로 너비를 지정한 단위는 강제 제약 조건이 되고, `fr` 단위는 CSS Grid 레이아웃에 있어 상황에 맞게 유연하게 작동하게끔 하는 특징이 있습니다.

`fr` 단위와 `%` 단위의 차이를 그림을 보면서 이해해 보도록 하겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhIBdvLekYmFDwVe__J2fOh8fotkHEeeYpNSNUIBN4VUOdFJVxpI969ymcdvp8iDO-a_qF71zs3xpz9uaE_7MLdOoitnaZmOr_br_C5XiSdLFiR6_PPqQlqDhvN8JdbSCOB-6UGlzfTR3KPCNW7s63pQDv09eRnl9RnjjC0fV6k4rk1sugW_OMggIZN6gw)

위 그림과 같이 `%`를 이용한 방식에서 바깥 그리드 컨테이너의 크기를 줄였을 때는 아래와 같이 작동됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhX6u5qW2qRMJIXxc7JUivdfq3BqGgGzwMJJg2X5INiXC0WlneZjmLlOb-3EIGJKud_t2KCYVRlSVq8YEnGKQJQpg_KZgYxyuuB5aZRx7yo5FzuRWGMz9aWR9Zp4w0blSbTCwpwdk34BNpoODApZkelYXf_69opO-8Dqly4_LN9onzmriscqi5WjighJg4)

위와 같이 비율대로 줄여져서 첫 번째 열에 들어간 그림이 overflow가 되었네요.

다음으로 `fr` 방식입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjTQoaKTi0W0VZwHC3puHTv_DTNj4IzXFdqEJrRwMlWafuAbauDH4dcDmq7ks3BYA4cvnsbYUoYvM06TaL6wdViMFiegPvK6V4JcNSWe_OxZOh1nDSi4oBaW0xmOJ-cwwqgCNdI28YoFf9COk5ZpxIj-2nj3VTlHqIalTRqubaO_OnL0zsxLpLE5rurgiE)

이랬던 그림이 grid 컨테이너를 줄이면 아래와 같이 변합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjPDUmVe0fNffSk5zNqrEn9xk32EqE9-IsGAcA8kln1tZzZZMFAYJzwNuAtpgAp8elXq6egcTw7a0xkJEjdS-yos5bs9Ps0czyeLbsx8nrdCKjA__D9z__AHYPzRncv_0J4DvnLyqB2cMSfe9BHFQ_HBTh3VDUnV1vaxuI0ONXQk4cuMlx0CxTHgT1Vym8)

위와 같이 첫 번째 열은 그 안에 있는 항목의 최소 컨텐트 사이즈(minimum content size)를 감안해서 shrink 되는군요.

이제 `fr` 단위를 쓰는 이유를 짐작할 수 있을 겁니다.

`fr` 단위가 `flex-grow`와 같은 방식으로 작동하기 때문입니다.

`fr`은 남는 여유 공간을 분배하는 역할을 합니다.

그래서 각 열의 내용에 따라 남는 여유 공간을 계산해서 분배하기 때문에 첫 번째 그림이 overflow가 발생되지 않게 됩니다.

반면에, `%` 바식은 단순하게 숫자를 나누어서 계산하기 때문에 overflow가 발생하는 겁니다.

`fr` 단위와 `%` 단위를 비교하는 다른 예는 바로 gap을 넣어 보는 건데요.

먼저, `fr` 단위의 예입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEigu7i7QVQ8r6yNVQaOQRwE8_3oaGz_IzRWCaE5uKhX40p5wpwIH1IMt4DfLNEuVv0l8C7V_CnPCtTE1KumZXpgAbscxu36-v4SNpbo9koSrgNgoSzkq5fi7NX4dUhZxsQZHzxZmga7DVsqlyJrbvfZnQLePd64CJCQb6joGQ2PT4a6lgzsOSgJKTTuvL8)

위 그림을 보시면 `1fr 3fr`이기 때문에 1/4, 3/4으로 구분 지어 나누어지는데요.

gap을 16px를 줬습니다.

그런데, `fr` 방식이기 때문에 전체 grid 컨테이너 안에서 합리적이며 유연하게 나머지 공간을 분배하는 데 반해, 아래 그림은 `%`를 사용한 방식으로 두 번째 열이 overflow가 되었습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEi80jsGh7uiU3gP69v64i4Iio_yLSCSrcobFSZcw8e6NaaVNFgtfg67FwgIdTaHNZTwKS8QYEA27R2J4oPTa35xk3uOhQ1cIVVD5SI0QiQ1UgW9XTVRWWLESxZLb57HFIZ0VXmBw0_T3lVgT_k-OInrY5w6z3-6A-cOVqBzQNhBK6YP3OYWah6-ogpnTMs)

`%` 방식은 엄격한 계산 룰에 따르기 때문에 예외가 없네요.

`%` 방식은 전체 grid의 너비를 계산하고 있고, 두 개의 열이 100%이기 때문에 여기에 gap에 해당 되는 16px이 들어갈 공간이 없기 때문입니다.

그래서 overflow가 발생 되는 거죠.

---

### gap vs grid-gap

원래 Grid Layout의 gap은 이름이 grid-gap 이었는데요.

이게 너무 유용한 항목이라 flexbox에도 적용 시켜달라는 대중들의 요구에 의해 gap이란 이름으로 바뀌게 된 겁니다.

---

## 4. 암시적 행 vs 명시적 행

만약에 행이 두 개인 그리드에서 더 많은 자식 요소를 추가하면 어떻게 될까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEil6ET1OTdSnc6oJYgmjBt7RAgrrNI7R2C4EddBErDBNPgxjjmlKZEEXJmmKd8HPr23FDud-IDpnt9V_Ma4DAxR1Vw5cug6KGsvYRagcmQ0NpyIhEMbJZDj6uKPin_z9_SFdPp1g0s4yUbmOd4Bu1qApWD6T1YKigT--0tQL5te8bSePVXXpURn4q6Bfjw)

위 그림과 같이 grid는 자동으로 한 개의 행을 추가로 만듭니다.

grid 알고리즘은 자식들 모두 grid 셀이 되는 걸 보장하는 방식으로 작동합니다.

그래서 위와 같이 행이 두 개인 그리드에서 세 번째 셀은 혼자인데도 한 개의 행이 추가로 생긴 이유입니다.

만약, 표시할 사진의 숫자가 다이내믹할 때 Flexbox보다 Grid로 틀을 짜면 아주 유연하게 새로운 행이 생기면서 모든 사진을 보여줄 겁니다.

맨 처음에 말했듯이 Grid 레이아웃은 열을 지정하면 행은 자동으로 계산된다고 했는데요.

사실 `grid-template-rows`라고 직접 지정할 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgSKtQrTzjYNvK99pxuARx1Kbqk2usdChxT8BprP1eMaP029oK__cJ09tad1HVPXLhSPpTcJw8-pg_17fzF2L6MkvkuYT3QQ5qZzts9-3pPkQ2qZeN_jIpZlCi4dra2VsAcvWzzgGqdd7lu6D66NxBYs1zUSVp1_M_I__wJNWv2KXnivi5n4cP3mD5fhfY)

`grid-template-rows`와 `grid-template-columns` 두 개를 동시에 사용하면 사용자는 완벽하게 명시적인 구조체의 틀을 만들 수 있습니다.

---

### 반복자

만약 아래와 같은 달력 UI를 만든다고 할 때, 어떻게 하실 건가요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEiVbbUh6tgHCyfpuTyp3GhUOQO6zPB1NOYcyKzzd2314gLeUXqgv8hMk21npokK2u1hLxrsIafWKCac6ch_lJIXgxCuTdBlFugf9-NLie6OZoMhiQ1SsAhu6sYeqKC6dIEeXoh4jKfDwPK7QTgZ0aCC3zRb8lvDq9cvNqjqbCv2TY7uPOcovjpYYTORlpc)

한 행은 7일이기 때문에 `grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;`처럼 7개만 지정하면 나머지는 두 번째 행, 세 번째 행이 자동으로 생길 건데요.

`1fr`을 7번 반복하는 건 너무 귀찮죠.

그래서 CSS 자체적으로 반복자를 제공해 줍니다.

```css
.calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}
```

---

## 5. 자식 요소 배치하기

디폴트 값으로 CSS Grid는 자식 요소에 대해 맨 처음 생긴 아무것도 안 채워진 셀에 첫 번째 자식을 배치합니다.

그런데, 임의 요소에 직접 자식 요소를 배치할 수 있는 명령어가 있습니다.

아래와 같이 4 x 4 행렬이 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEi1sAf8q6TvshProJM4EiBO34DUjw1qLriMTKNTuX9nDuVeiowDtiqo5mmhJf9-gkutrGlm2a2f_288ieP424vb_-LdxBCfDa79USXC3BpWNK1qvldI7FzbxGtTCblfaAuQFjbmxlKi_6xO_AxkBD0aCt5rDVLjj_wXM5PxQ2329sHidS_p0N8zocN6h40)

첫 번째 행, 첫 번째 열을 선택하려면 위 그림과 같이 `grid-row: 1;` 과 `grid-column: 1;` 같이 직접 지정하면 됩니다.

아래 그림은 3번째 행과 두 번째 열의 시작과 세 번째 열을 선택한 건데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhW4U3GovYimblaXS9_jNd9mjqlbPYzjaWrK1pcyNIdzXjUSD9XhgiCDmGWTS8mCmua1GYoVpEKuXrF0H_LlKDzHqNd8kNVYbkyR8tBKy0V_ldFa-oyWvQi1sj0NwM_bGBuunB9AP42YpRgq1lTFmoUIbLcgVCphWVZVFuHYpD2U0fohuzeMVXlbQwIoFA)

`grid-column: 2 / 4;` 이게 뭘 뜻하는 걸까요?

절대 나눗셈이 아닙니다.

바로 다음의 줄임말입니다.

```css
grid-column-start: 2;
grid-column-end: 4;
```

grid-column-start와 grid-column-end를 두 개를 축약해서 표현하는 방법입니다.

여기서 세 번째 행의 두 번째 세 번째 열이 선정되었는데, 숫자는 2 / 4인 이유가 이상한데요.

정확한 표현은 아래와 같이 선의 시작 순서입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhY9XBS0rKkRb7G6aual7Use7uzX9xPr2_hsySZ4Ez6jmsi9zu7L-gaLM8YcqDUMMFFFUg6_Ea_WQR0a0UwlA--WBvyIaATl1mrJcnk7xDWU3WWOfPMKBrufXODeyNVq12k0lbMybDzATP9GnhTF6k_UnZDpXCWAynquLp6RS0ut-fBq6ni6JglLWYPQCE)

위 그림을 보시면 왜 2 / 4 인 게 명확하죠.

가상의 점선이 있고 그걸 선이라고 하면 1분부터 그 선이 시작되기 때문입니다.

이 선에 따른 숫자가 구현되는 걸 꼭 외우셔야 합니다.

우리가 선을 숫자를 왼쪽부터 1, 2, 3 이런 식으로 붙였는데요.

만약 오른쪽부터 붙이면 -1, -2, -3 이런 식이 됩니다.

그래서 아래그림처럼 해도 문제가 없는 거죠.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjtIv1KcG0vwo7fN4E_2M2TD9SpmvfS7gYSMp9MaPSam3uEiQkKDGUpRY3l-RUG82GU337mYinnWRjy2UlO6v8Dcp12wuNj_SBxCdxVZGsnjDqg1NSJzNmzWxwzllGIIPs1BZS3HDEcSGPbzSNRLbYuXesAFjsB9INBTUyhl34AkJtKm1_63uAGhCOqQL4)

꼭 외우셔야 할 거는 선의 숫자이지 몇 번째 셀인지 외우면 안 되는 겁니다.

첫 번째 선, 두 번째 선 이런 식으로 외우셔야 합니다.

---

## 6. Grid areas

지금 배울 건 바로 Grid의 가장 멋진 기능인데요.

다음과 같은 레이아웃으로 페이지를 구성한다고 합시다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEj9nedNbH7-JSJvEoswkYi0LozWdApHsOupm6Jxnukau8IK4NMUtIsbBEeshiAeBIEKle7k2oR50YzDkR4ciGD7ArijL4Kr-ugu1ozIq4AXuFFd_LpRpjHKu61wlIrviS2IV5GqrHKDV7yA3o9-SYEHAGt2rne4ecynM4VG8rlIl4iHqUitbJ-AS7eAVAc)

```css
.grid {
  display: grid;
  grid-template-columns: 2fr 5fr;
  grid-template-rows: 50px 1fr;
}
.sidebar {
  grid-column: 1;
  grid-row: 1 / 3;
}
header {
  grid-column: 2;
  grid-row: 1;
}
main {
  grid-column: 2;
  grid-row: 2;
}
```

그러면 위와 같이 CSS를 짤건데요.

`grid areas`를 이용하면 다음과 같이 짤 수 있습니다.

```css
.parent {
  display: grid;
  grid-template-columns: 2fr 5fr;
  grid-template-rows: 50px 1fr;
  grid-template-areas:
    'sidebar header'
    'sidebar main';
}
.child1 {
  grid-area: sidebar;
}
.child2 {
  grid-area: header;
}
.child3 {
  grid-area: main;
}
```

해당 grid-area를 이름으로 지정했고

`grid-template-areas`를 이용해서 아까 지정한 이름으로 구조화했습니다.

이렇게 하면 좀 더 쉽게 span을 사용할 수 있습니다.

위 코드에서 보시면 sidebar 위 아래로 span 된 걸 보실 수 있습니다.

참고로 2 x 2에서 한 구역을 아무것도 지정하지 않으려면 그 자리에 `.`을 넣으면 됩니다.

```css
grid-template-areas:
  'sidebar header'
  '.       main';
```

위와 같이 (.)을 넣으시면 됩니다.

---

## 7. 정렬

그리드 컨테이너의 크기가 180px이고 두 개의 열의 합이 180px 보다 작다면 분명히 남는 공간이 생기는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEigJud24uheGHKuqfDKM_Rhrot10xol1lHdEKmVB5oj6ETr_wR6FBfWLrY2_sU7R9Wj3_Zk80UaKdeP3zgB-ZPYlDE4B4A8TFUO1XJX-llTz5cHUGibxvOj17MPU1DAp83CuoCFRaVnql8-NBUBJ8kkYuHY3KPQxZP6zXX2WqdVXf91HdxvFhY-zjQjxz0)

이렇게 되면 우리가 Flexbox에서 배웠던 justify-content 속성을 여기서 갖다가 쓸 수 있습니다.

---

### 7-1. justify-content

사실 grid의 justify-content는 flexbox에서 가져온 게 맞습니다.

해당 값으로는 start(기본값), center, end, space-between, space-around, space-evenly가 올 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEg1YmhKOQgFJY8ihLJORgkdu5AtkRs09LE-HS4vstCxMO_vDW4rTKSN5YhTwI8H-V6ebGDN6wIuqm5tRuy8gXu-jaCA9kMaEC8WV9LMDl-t0XNHj-_rSc5btEOsi3jm0V2y_olggThWyzByYrSSY61i5XSZVEAVxFEFIwExbxvhJgRW01K7yTYOK0Dj91E)

![](https://blogger.googleusercontent.com/img/a/AVvXsEj6SeGooItn4pZdRRVW-9bJSluoEOFBk8v0_ehExsA0n037Hi29BkP1z5Inkqg8SLMqR4zNZjZUyx7uqTeZP0i4V-3jS9TlX85i1Hjnluh1iHIdjhUayX1PxBF9TfLdJ2b9cr2fHPDanAtLY4p8MqWXkpG_PxdWUBbS15gcHN0Ql1lrNizxM7TyaBktm7Q)

![](https://blogger.googleusercontent.com/img/a/AVvXsEi2iRltCaOGqxFhD8DA7zOTcUaPzSwlzVxEhkcVKChie2N5DcMZa7g9JRkIjpi_DwWVC7vGI1NX7Aakfylm-S5vAf-qOcYR-7yGs7zSnSeZr9IUZbpu0nbcqFYGwDCinSd0LAwGfsygeuQFGoLUztotLDFpzUZyaxSaYvOq-p9QvxB0DYLVIlT8v2BHm-c)

![](https://blogger.googleusercontent.com/img/a/AVvXsEjVafBeQNnJfD8acboX_M9aBhgp6y5JVYHJ1qYewpb0PrpYrTp-kTvptT-BHAzsVvwgRujjUbfINHzYrTPANqwn4mneeRbqwvIane5Sf3edh9ZfKdMW8TDiq6G6GRVRz74rUWi_QPBYLWakHF00nt_ElPti7jTuRf-UkGwWTxDb1mAMkiWL6ytAMK9yosE)

![](https://blogger.googleusercontent.com/img/a/AVvXsEgfRzx-pnvCQi8hYzjWDnwytts0iGuI5gqX1Hbygj8jEnsSxwXRWus6DUCNZD8Bd_ugVwwiFFM5pxzsrjDrZUyiFuGyneYbpDfUT3LKsxZDdleyrP5IFvxppdC3lS7VClqpbdx-nbOZ7do9agZtB68fVA2W9Iz9miTM1GuniiuZyhqKGdHbH8FFlzA2P-E)

![](https://blogger.googleusercontent.com/img/a/AVvXsEj4pxjfEC5FiFTWQ5cT80p1ZMNJPCliTzbcEa7Ii-INPOKV0vzx91YvvpFqiGl8PJfGByo4JjvT-4CSbJcvpmT1uGF-EcyKO-6wBOzCDgSakOq-zg8igeqx5AzueeqhLr2aZMXqsyshaIArhAQ0uadjGWOnM5RoPjfKC5zGepRtZjg1FWOxAFcUCHR7Z40)

flexbox와의 차이는 grid에서는 행 자체를 정렬하는 것이지 아이템을 정렬하는 게 아니라는 겁니다.

아이템을 정렬하려면 justify-items 항목을 이용하면 됩니다.

Flexbox에서는 align-items였는데 Grid에서는 justify-items 이름이네요.

둘 차이가 명확히 이해되어야 합니다.

지난 시간에 배웠던 content vs items 부분을 읽어 보시면 둘의 차이를 이해할 수 있을 겁니다.

---

### 7-2. justify-items

justify-items의 기본 특성은 Flow 레이아웃의 기본 특성인 stretch입니다.

지정하지 않으면 기본적으로 stretch 방식으로 작동한다는 뜻입니다.

다른 값으로 start, center, end가 올 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgsAQhcf1rNj9KR4Q_QJzG_JejHWgT-5C14xgWbsoP0WALV-yqTZYLRXtZJNM6SZPbQp0wnR7XJqIHA_Cn43yt6tNJdo60VAapFgpQBtT6BO8Q47yOiIS1slNuWN8EpjIOzp7FEf9hYGi86u-3nzPmstCFPv0_5oq8wC1BiXhScr0MeJtpmZx6oC6eu2K0)

![](https://blogger.googleusercontent.com/img/a/AVvXsEiS7c7223YbMjqyd-q8_xUjhh2_fzbhNWsy-BAvRbqEATCv2HtG1YtOo4LG9c5IU2SWmJvUabUdadJEwemxTGFmMDDWcRyUHfCX_8Trs8mw7pvfdcSJSklB42jJBwqaOVFqUNCGW0msyRO2pXx3P8d7ZdlljLfaaRvWJN1rNkhUI1FdxoR4EUFGq74amoA)

![](https://blogger.googleusercontent.com/img/a/AVvXsEiPOwIFJ0-SX64ROGWtj17SBoOUqVYMfCJvuenzLB6rdoBTEMA5OgvW_9FMbUAtilnYblawoHHb2bR3cobOSJrC6oOS_KP2CrmqZ5O80ZsKCMlFqfrB1iWSl_NGkphai9vV3piN25mqaZJxUU9d5rGZmo84DgJRLX4C9qB-uBIKIBRKWMIftPZDjx-JCK4)

![](https://blogger.googleusercontent.com/img/a/AVvXsEiZk-UfhceYAZhU6E_68HbK5xihfjrJghwX4Pg4cpx580J92vbTcUTF92WftyBI6Ltb_yeB70nhHQPwcu8BRMuo-TqqgPWfi0K8Y-zWXQbGzCvedvLKXFGI83VNaFehuTax--3TetcJX_5uXElCkHnICe1RVWfJs6fJg61McOpw5Ine0lFhHj5_XApTr2w)

위와 같이 작동합니다.

그러면 개별 셀의 특성은 어떻게 정렬할까요?

바로 `justify-self` 입니다.

---

### 7-3. justify-self

justify-self는 기본값이 stretch입니다.

지정하지 않으면 기본적으로 stretch 방식으로 작동한다는 뜻입니다.

다른 값으로 start, center, end가 올 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEi-iPpwLzEgePaGfTRO6eJMEAffCsoGv0j4OSp4WEekdeOtvPZ4m_JedPvo91qyIJ9_m93HU9FOjqZCKOwpMRYi0iz40U8R0IFzfzRTLH-0hLwIO21xf3feYU2hUZbsK9aNnaEk4lGk8Lr6moAKCf4PUev6_WCu8goO680TXT81DpWQSHFYIa-kREI8d9s)

![](https://blogger.googleusercontent.com/img/a/AVvXsEilm11JhUR5x6T_hIXMdUJit7dtGuGTCJW1J_JJ8IyovY_BVen58uTi3Vq9UksBLOCcyjwSmbVs4kF-PS2WQVcfHzL51XCFOxXCfG9v5FtrHtMhPcF9VQUT9xs17tPDhUeSPrjodyNekmdJtJrDMHPq-_flnd5UG_7JdXzND_I7LdCL57D1nFY4gchcSKc)

![](https://blogger.googleusercontent.com/img/a/AVvXsEhv6HdGFS3ru7IEqOJ1oFO-sr74hmCxBNyZiBYBk3_3tWmGejp3d67eyN9f4erWSZMfBg6sAig2DM5sjwq5sg2-SIvBOqfFm5ggG84mV-vIgh1DBG9FGiXV6qBWAWH6Bm0rWYiS_PGb8IFuAPBIvnupNMPiLaJ0wBvJBrVeP8r_k5jlHR_9JYhbGIl4bsE)

![](https://blogger.googleusercontent.com/img/a/AVvXsEha_5JcFGzoHst1CypDS51DkUqKSBBMt_NKSTg53kXMyW8koP-VH_lRadyB4YBAGf8fjcovTE2C_J85kT_VABHjRgaxEd7duje24LKCYmBaQV-licuR0hzhkMdVHrGfBu0Ufp9FA1Rh3hniRH2tuj6zj7YeTqd0jUBs14PkxDyDpiZRsHhht7WaIZ94kGU)

위와 같이 작동합니다.

---

### 7-4. align-content

justify가 수평 방향으로 정렬했다면 align 방식은 수직 방향으로 정렬합니다.

해당 값으로는 start, center, end, space-between, space-around, space-evenly가 올 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiuWFyxo68ExxdyTDtEpIfWylQDPy_kyWU1yk5dJJSenSfxQgefFJYFtmWf8QIl25_L0VKz8MVngmSKWq8jVSJOQW3iF8RFyXVVnOu_iPWLNn3ZArYWg7az9tYxPZS8OPtILVT6eSowI84v708HLhjmLREXlhOuTj3Q0tfWJaImvO1am2g_PpgwKS8GoyY)

![](https://blogger.googleusercontent.com/img/a/AVvXsEjoIHZoeXNbk_wwz5knZ7QfAZseAda1VU3e4o3IG0gfuxlInXBgFp8jaso2KnHxqFPTqnPRHUgQdW6cLUmgBoSgAuwL_2wPGg3jW6ygsyerbPxmi5r0hr0lPi6iOmPTXDp2bYZFdJ2vAE2Vw-4nldjHmp9RwlYGNpGTUk6BH3Q010BggBNWqYh9MN_uZyU)

![](https://blogger.googleusercontent.com/img/a/AVvXsEiCNehquGC6lkVzdjBnvs2FiHXPe7nYibQBwN2G9TBCEOh-6Kt0c1oPeC9CJG8j5ZQYiKhzeNpLwGn1MP3sLHiN6yeXXS_vofvArZo1JR0ENQ9fu5PWAtbxENGvgCvU2QdFZ3nUmUmicTXoWLFYqfVNXI1VS3-ycS6vILNj5Dj0OXUyPLwXjZBi9VVZrWU)

![](https://blogger.googleusercontent.com/img/a/AVvXsEgkqNERycNDtwyuFbNjmqZq2SZtEncxAd-IykZBcqulK_24YPD2sYAEKzdbeBJQhul0lcAsxaPIKp8h8FNIVYtoHHBP-_HIe5sqEhPH4Q-P8IART6G4_m0KiriZCOukPqW7hI_UUqbC2ibJrTASaSGA5xRGDXYiqziDGBDjl86TI-sQ0bkhfLpC9m0ydW8)

![](https://blogger.googleusercontent.com/img/a/AVvXsEhjMgOI9MWdjpxnFhk05a_kqAyEWBvkElJ-AltlRaxzppLMDUVeTn0uyIBOIkDz85bMyvVmhm1Yiw3h_-MpPesfe0da6LaJ-kEvNw9NA6hr34OV-6R6vKs7ZnWzjXfknCH_4Bp-HnS6RYK2hU2FWWQg69JyE3ZeQmjgOxUzc2wPPFWwUs5z2rTij-PrdJY)

![](https://blogger.googleusercontent.com/img/a/AVvXsEhumdkzFWHZo9A7dvtrvkJzFxw2-PseVk7Vuqcop0uX01j_sir-J_s2LRZ2Th71ER8cHmnAsz6zOR6gx4CeVck0OA1HlhkLQ8KF2G7SMbHH0TRJKmgOVyEcuyOHoyfMuyBXdYs95rxskzHPIqz032AOmKDZpn86ga2oFKpD-nM6x1y8CWis_EQ3-x6DZrE)

---

### 7-5. align-items

해당 값으로는 stretch, start, center, end 값이 올 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEibBiOr1V4YvXOmG8AaFic6De-MklCa5yp3cNUu9_PsIQKNTKoZrKJu6AkypCiXKOWnfHL15ZYCKq_tL_hrb0RosCLt98-VD6Mm_MEQrY3Lt9lWfe58kzBVpUrOSbXIsGz-m6xH2tqbMp84BCyELV6zG50b89quZjvd3rRKHfnk6jvL8gBBSbt-_WAQTSE)

![](https://blogger.googleusercontent.com/img/a/AVvXsEh2JsTcculCKofJtzLCL--IP8Jxtymz0vO2tsi0ZEEYrXjF2BS2zNhWTZDUVnbHxWDKdVRYA99yx4L9A95nnumIoavOqJG51I11w6r5fxcOGXggrEDYebhr35UYwCAQbVqXMneC5rt41HTtn2rVnsFHdPyZh9UZhmAhH4cQTOWLzjhSKdavYuz44NCjoPo)

![](https://blogger.googleusercontent.com/img/a/AVvXsEiaKMwknfYtB-vAjN2mkNpaJdsciOA8iZWTagmoJNzJdUQrTraVhrJQUgCaYnZEIUPeeOvqakEH1Six8QT4ak-4GzpA6iHCEfAFFf8Su-6wxjOeJwSs7uZxKr1m3hyawa5Gmuv_71UvtOY_M_mwsQngh6ZWpVaWcbmfn47-kn7hu6G6Ic1qb79zSCWMlcI)

![](https://blogger.googleusercontent.com/img/a/AVvXsEibk_RNmomsxwQo7OlOeqhOmX5BCvXmZUDdiBQ7CijnP-X8tRjLW9Vymlckg3rw4CWi1ZqYBjHTouG0LfLgMYK8Hs0OdunxY7uLOtGj1x0OMWC9p0POSvbWiTarh2WnfW8zIG4BomdK1jpinBnIbtNeThixkVdzFMtQ9UETqTkTMQLxvXZfPevK7eb1QSY)

---

## 7-6. align-self

justify-self 처럼 align-self도 있으니까 꼭 확인해 보시기 바랍니다.

align-self는 한 개의 그리드 셀의 수직 위치에 대해 관여하는 겁니다.

---

## 8. 두 줄짜리 센터링 트릭

Grid 레이아웃을 배웠으면 이 트릭을 꼭 머릿속에서 심도 있게 생각해 보고 실전에 사용하시기 바랍니다.

```css
.parent {
  display: grid;
  place-content: center;
}
```

이렇게 하면 아이템을 가운데 정렬할 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiU6E_yzxyFW2KYdm73Tl15TrJ8z0qFJdIBH9znw3kmyFEpruu6VNp95PaRpqhw3Nk3-mKriZKi2x8kCOilxkl33Ije4qqWyNnkFsTcJjvxK_0-s_65hXdkaxOlThlrTUb7Rnuhmpq3BIemlPXytfZBGLwXlR71LzAzfSozCGy2dZE-pWz50nYHT3en8sY)

사실 place-contetn는 줄임말인데요.

```css
.parent {
  justify-content: center;
  align-content: center;
}
```

justify-content와 align-content를 각각 center로 놓는다는 얘기입니다.

다시 한번 맨 처음 코드인 아래 코드를 분석해 보면

```css
.parent {
  display: grid;
  place-content: center;
}
```

display로 grid를 선택했고, `grid-template-columns` 항목이 없습니다.

그러면 당연히 한 개의 열이고 또 당연히 한 개의 행이 생성되겠죠.

그리고 place-content를 이용해서 justify-content를 center로 지정했습니다.

즉, 열의 배치를 center로 지정한다는 뜻이고, align-content를 center로 지정했다는 뜻은 행의 위치를 가운데로 위치시킨다는 뜻입니다.

결국 아이템은 Grid 컨테이너의 한가운데 위치되게 됩니다.

끝.







