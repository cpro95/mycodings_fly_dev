---
slug: 2022-12-18-css-display-none-vs-visibility-hidden
title: CSS 팁, display-none 과 visibility-hidden 차이점 설명
date: 2022-12-18 09:31:09.449000+00:00
summary: CSS 팁, display-none 과 visibility-hidden 차이점 설명
tags: ["css", "display-none", "visibility-hidden"]
contributors: []
draft: false
---

안녕하세요?

오늘은 CSS 팁 하나 알려 드리려고 합니다.

바로 `display: none` 과 `visibility: hidden` 의 차이점인데요.

둘 다 돔 엘러먼트를 브라우저에 안 보이게 하는 역할을 하는데요.

정확히 어떤 의미가 있는지 알아보겠습니다.

일단 테스트를 위해 HTML 개발 서버를 돌려 보겠습니다.

SvelteKit 개발 서버에 라우팅 하나 추가해서 작업했습니다.

```js
<div class="container">
  <div class="block1" />
  <div class="block2" />
  <div class="block3" />
</div>

<style>
  .container {
    padding: 20px;
    width: max-content;
    display: flex;
    border: 1px solid black;
  }

  .block1,
  .block2,
  .block3 {
    height: 40px;
    width: 120px;
  }

  .block1 {
    background-color: orange;
    margin-right: 20px;
  }

  .block2 {
    background-color: blue;
    margin-right: 20px;
  }

  .block3 {
    background-color: teal;
  }
</style>
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEjdxvWQtVdJKieea5vtsRlfczfQf0ECS4g65D_s3kPjlh94YnNp9iCqcBNRoLKtm02U7wW1f4lqzUFlx8UrTLvVCV5L3p-j5lXAlaLux4gUUnK7_Zt4GxM5IQtRuXy4IemNZqdggBEl-8oS-Lx6aAuFejcdAjUnQodOLkPsz0wdxGVrxIpYeauVM66b)

위와 같이 세 개의 박스가 나란히 보일 겁니다.

첫번 째 블록은 오렌지색, 두번 째 색은 블루, 세번 째 색은 틸(teal) 색입니다.

---
## `display: none`

그럼 테스트를 위해 block2 에 `display: none`을 추가해 보겠습니다.

```js
  .block2 {
    background-color: blue;
    margin-right: 20px;
    display: none;
  }
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEjV3dfeOjylmVKlQU3QYMqkSPiSQjY3u9Ix-iqlVnjjnYA7OgczhIWmyHdMhs_DxNrNmBxJN8BaydZjXk0Y83N4Dw7LE861yHkbZAR9Q1Z2mvRgH9-zjY9ZvXrd5j52iuh37oLACj4HbeLJsIr8JWZjH-DQ4dEY7u6qd80BvbFeVdWIZgCnLQ2_Ka6u)

위 그림과 같이 blue 블록이 사라졌습니다.

.block1에도 `display: none`을 추가해 볼까요?

```js
  .block1 {
    background-color: blue;
    margin-right: 20px;
    display: none;
  }
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEgXUdAhvWOX11G5TKJromBzLztLKVx7mySDaZOinWHhloYpwyOMYZoKviImDlm06HTtepOsPl8nbFcmgb3rVjeXLEG2jjLDPn2sK9t6xCmzZIpGGLVEN6jNHtS74vta2HKXLNGVOIMkTY66sC4OHfXZvBQKl2VOMuiwk1ZKSAMaJfdxbKOj7M1f2jiu)

위 그림과 같이 오렌지색 블록도 사라졌습니다.

---
## `visibility: hidden` 

이제 `visibility: hidden`을 작동 방식을 알아보기 위해 다시 block2와 block1을 차례대로 `display: none`을 `visibility: hidden`으로 바꿔 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEiSxMn-U_Iz9P6UD2ndzMnwIVj8047zgEnlTnnPwPVxDEm_yf9Y204EaGokVwTWgVaDInHgt_pTBMwj-jX_iK7CqZuH-B3DF8xSm9Ws6W99TG06gUKzIjkyaQ3XJ_chAnZtXrP4rsja20SKFlPhR-evIk8ETJReYYuNcY38KcuazbGuP_iXs8zHEAk6)

위 그림은 .block2 만 `visibility: hidden`으로 바꾼 결과입니다.

중간이 비었네요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEicNBNOXSmWz5wsM2_ECDSy7ztR3DIuFMCgEgX044Ckaxv3lrj1Vg-QZGJB6bqZqtWOxQHyzHDv_6oCtuWRsV1-HpQN0yeOrdmYvJpUtT3kScRfn5dbNEriwWR-hcyKnUUJB04wrstMFxDQR6CI2PCM6bDpeKZFN7VL8N2rj7aoqnXnzTh07g7it6me)

위 그림은 .block1 도 'visibility: hidden'을 적용한 결과입니다.

---
## 차이점은

`display: none`은 마치 dom 엘러먼트가 없는 것처럼 행동합니다.

그게 있던 자리가 사라졌죠.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhN9J2QvGBXx7Bpo88tXe31PQY2CXO-9epfZvQrIGBEQqZdmfSUGTWtV5WJekiYmI9Qb_JHw3LW-6LtE26keGPHFq_vOErOHVZle480UUIRuBqAm8Algr8fRPVQh83-50Evoe0gluvxM43UxPx3FLuCH16UBqdJNA7KBoNtwOHisfw-D8fXqqNdHQTf)

위 그림처럼 크롬 개발 창으로 보시면 block2 div 엘러먼트는 분명히 보입니다.

그러나 브라우저에는 아예 block2가 없는 것처럼 행동하고 있습니다.

그럼 `visibility: hidden`의 작동 방식을 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEgPCawS22tNCGIJEPYZRCAh9aqATeHET7kCHg9fdC0C_IS2QWZXzc5Z1Z10yrhdkCU1kDsC6_gX4_5UZYFZQ1W3gXctL1OSIoEFO8n1VLaOT053Pzl-QwPzdHp3I5oz4QytTNjdfOXeKSrDLYUKDvgakekTGcerI99OHh86GfYFG5Bs6WmfS-1iWiOk)

위 그림을 보시면 크롬 개발 창으로도 block2 div 엘러먼트가 있고 화면에도 그 자리는 있습니다.

그러니까 `visibility: hidden`은 DOM 레이아웃을 그대로 놔둔다는 뜻입니다.

---
## `opacity: 0`과의 차이점은?

`opacity: 0`으로 해도 `visibility: hidden`과 같은 동작을 합니다.

Layout을 차지하고 있고 다만 눈으로만 볼 수 없는 거죠.

그러나 opacity와 visibility의 차이점은 자바스크립트 onClick 같은 거에 반응하냐 안 하느냐인데요.

`visiblity: hidden` 인 경우는 반응하지 않습니다.

대신 `opacity: 0`인 경우에는 onClick 같은 거에 반영합니다.

---
그러면 `display: none`과 `visibility: hidden`은 도대체 어디에 써야 할까요?

`display: none`은 사이드 메뉴 사라지기, 햄버거 메뉴 사라지기에 쓰면 좋고,

`visibility: hidden`은 애니메이션이나 트랜지션에서 쓰면 아주 좋습니다.

그럼. 많은 도움이 되셨으면 합니다.

