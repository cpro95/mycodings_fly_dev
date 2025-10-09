---
slug: 2024-02-14-how-to-center-div-in-css
title: CSS 강의 5편. CSS에서 div를 중앙에 위치시키는 방법
date: 2024-02-14 10:47:15.909000+00:00
summary: CSS에서 div를 중앙에 위치시키는 방법
tags: ["css", "center"]
contributors: []
draft: false
---

안녕하세요?

CSS 강의 5편입니다.

전체 강의 리스트입니다.

1. [CSS 강의 1편. Flexbox 완벽 이해](https://mycodings.fly.dev/blog/2023-11-25-complete-understanding-css-flexbox)

2. [CSS 강의 2편. Flexbox Growing, Shrinking, Gaps, Wrapping 이해](https://mycodings.fly.dev/blog/2023-11-26-css-tutorial-understanding-css-flexbox-the-second)

3. [CSS 강의 3편. Grid Layout 완벽 이해](https://mycodings.fly.dev/blog/2023-11-27-understand-css-grid-completely)

4. [CSS 강의 4편. CSS Variables와 calc 함수 완벽 이해](https://mycodings.fly.dev/blog/2023-11-30-all-about-css-variables-and-calc-function)

5. [CSS 강의 5편. CSS에서 div를 중앙에 위치시키는 방법](https://mycodings.fly.dev/blog/2024-02-14-how-to-center-div-in-css)

---

**  목 차 **
- [CSS 강의 5편. CSS에서 div를 중앙에 위치시키는 방법](#css-강의-5편-css에서-div를-중앙에-위치시키는-방법)
  - [CSS로 중앙 정렬하는 궁극적인 가이드랍니다.](#css로-중앙-정렬하는-궁극적인-가이드랍니다)
  - [자동 마진을 이용한 중앙 정렬](#자동-마진을-이용한-중앙-정렬)
  - [Flexbox를 이용한 중앙 정렬](#flexbox를-이용한-중앙-정렬)
  - [뷰포트 내에서 중앙 정렬하기](#뷰포트-내에서-중앙-정렬하기)
    - [알 수 없는 크기의 요소를 중앙에 위치시키기](#알-수-없는-크기의-요소를-중앙에-위치시키기)
  - [CSS 그리드를 이용한 중앙 정렬](#css-그리드를-이용한-중앙-정렬)
    - [Flexbox와의 차이점](#flexbox와의-차이점)
    - [요소 스택 중앙 정렬](#요소-스택-중앙-정렬)
  - [텍스트 중앙 정렬](#텍스트-중앙-정렬)
  - [미래의 중앙 정렬](#미래의-중앙-정렬)
- [정리하자면](#정리하자면)

---

## CSS로 중앙 정렬하는 궁극적인 가이드랍니다.

CSS 초창기 부터, 부모 요소 안에서 자식 요소를 중앙에 놓는 것은 생각보다 까다로운 일이었는데요.

CSS가 발전하면서 이 문제를 해결할 수 있는 도구들이 점점 늘어났습니다.

요즘에는 선택할 수 있는 방법이 너무 많아 어떤 걸 선택해야 할지 고민이 될 정도인데요.

다양한 방법들 간의 장단점을 이해하고, 어떤 상황에서도 중앙 정렬을 처리할 수 있도록 하기 위해 한번 같이 알아볼까요?

## 자동 마진을 이용한 중앙 정렬

이제 본론으로 돌아와서 자동 마진을 이용한 중앙 정렬에 대해 알아보겠습니다.

우리가 살펴볼 첫 번째 전략은 가장 오래된 것 중 하나인데요.

요소를 가로로 중앙에 위치시키려면, 특별한 값인 'auto'로 설정된 마진을 사용할 수 있습니다:

```css
.element {
  max-width: fit-content;
  margin-left: auto;
  margin-right: auto;
}
```
![](https://blogger.googleusercontent.com/img/a/AVvXsEgfNuaC6ADKzFTKmCVvC9AmF6DuR1_yXAhX1qlUTjNr5_loZtGhMquAILFx9JTRkjZusk_bE0jP-D5JvgHv2MDz1gmG57pnGwlmZCQ1vX3DZZAl3V2Gp4AaOnTrEIJME6o_PjbhiTk8BAzRflZhDNqvwa8SpiarEbXbBhqbllKEEphhjqL79xpY74_-rBg)

먼저, 요소의 너비를 제한해야 합니다; 기본적으로, Flow 레이아웃의 요소들은 가로로 확장되어 사용 가능한 공간을 채우게 됩니다, 그리고 전체 너비를 차지하는 것을 중앙에 위치시키는 것은 사실상 불가능한데요.

너비를 고정 값 (예: 200px)으로 제한할 수 있지만, 이 경우에는 요소가 그 내용에 따라 축소되길 원하는 경우가 있습니다.

fit-content는 이 같은 상황을 위해 존재하는 마법 같은 값입니다.

기본적으로, “너비”가 “높이”처럼 동작하도록 만들어, 요소의 크기가 그 내용에 의해 결정되게 합니다.

왜 width 대신 max-width를 사용하는 걸까요?

우리 목표는 요소가 가로로 확장되는 것을 막는 것입니다.

최대 크기를 제한하고 싶은거죠.

만약 width를 사용했다면, 그 크기가 고정되고, 컨테이너가 매우 좁을 때는 요소는 오버플로우하게 됩니다.

자동 마진을 마치 배고픈 하마에 빗대어 생각하면 아주 좋은데요.

자동 마진은 가능한 한 많은 공간을 먹으려고 합니다.

예를 들어, margin-left만 auto로 설정하면 어떻게 되는지 볼까요:

```css
.element {
  max-width: fit-content;
  margin-left: auto;
}
```
![](https://blogger.googleusercontent.com/img/a/AVvXsEjeD9wIftXgbwWRWosMPwutDhD9CVlPgYf0Vu59vW12s_J3r8AS0hPRxaGkJl0gVGYaj6hamXrD06m1nDIznaLNo9KKUrMyeDENhE110t1WtRe_gKYmexfvHghZEyPzSGIVM4Amq1b8ynlb9tuGAyfvU2jQ7UEdA1Y3LVz0mUrz_LSO5PJtjgBNkZ0S2PI)

margin-left가 유일하게 auto 마진을 가진 쪽일 때, 모든 여분의 공간이 그 쪽 마진으로 적용됩니다.

margin-left: auto와 margin-right: auto를 모두 설정하면, 두 하마는 각각 동일한 양의 공간을 먹습니다.

이것이 요소를 중앙으로 밀어내는 역할을 합니다.

또한: 저는 margin-left와 margin-right를 사용하고 있었는데, 이것은 익숙하기 때문입니다. 하지만 이것보다 더 좋고, 현대적인 방법이 있습니다:

```css
.element {
  max-width: fit-content;
  margin-inline: auto;
}
```
![](https://blogger.googleusercontent.com/img/a/AVvXsEhfYJcDpMVh-a9iO6vW_iLeo8Ufqna6UyzTjEAFtadD7MTA6WIptZfhvt2BBeXJlNSoJfLwC-3n5WUhxcxMG29hmedEQ8HgbZnUczouPDQlsIw8dJzaiKBVfNgYBYi__ZLnnYyHlAwTpuV06dACsfGt4EkubYSiNecaYFsS0Kl47FpwDu0Ki93rGY70ne0)

margin-inline는 margin-left와 margin-right를 동일한 값(auto)으로 설정하게 해줍니다.

이 margin-inline 방식은 몇 년 전에 모든 브라우저에 도입되어 사용하는데 크게 문제 없을 겁니다.

---

> 논리적 속성(Logical properties)이란?

>margin-inline는 단순히 margin-left + margin-right를 편리하게 줄여 쓴 것 이상입니다. 이것은 웹을 국제화하기 쉽게 만들기 위해 설계된 논리적 속성들의 일부인데요.

>영어에서는 문자들이 왼쪽에서 오른쪽으로 수평선상에 쓰여집니다. 이 문자들은 단어와 문장으로 구성되고, "블록"(단락, 제목, 목록 등)으로 조립됩니다. 블록들은 위에서 아래로 수직으로 쌓입니다. 이것을 영어 웹사이트의 방향성이라고 생각할 수 있는데요.

>하지만 보편적인 것은 아닙니다! 아랍어와 히브리어와 같은 언어들은 오른쪽에서 왼쪽으로 쓰여집니다. 다른 언어들, 예를 들어 중국어는 역사적으로 수직으로 쓰여졌는데, 문자들이 위에서 아래로 흐르고, 블록들이 왼쪽에서 오른쪽으로 흐릅니다.

>논리적 속성의 주요 목표는 이러한 차이점들 위에 추상화를 만드는 것입니다. 왼쪽에서 오른쪽으로 쓰는 언어에 대해 margin-left를 설정하고, 오른쪽에서 왼쪽으로 쓰는 언어에 대해 margin-right로 바꾸는 대신, 우리는 margin-inline-start를 사용할 수 있습니다. 마진은 페이지의 언어에 따라 자동으로 올바른 쪽에 적용됩니다.

--- 

## Flexbox를 이용한 중앙 정렬

Flexbox는 주축을 따라 아이템 그룹을 배치하는 데 있어 우리에게 많은 제어력을 제공하도록 설계되었습니다.

중앙 정렬을 위한 정말 강력한 도구들을 제공하죠!

가로와 세로 모두에서 단일 요소를 중앙에 위치시키는 것부터 시작해봅시다:

```css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
```
![](https://blogger.googleusercontent.com/img/a/AVvXsEiwn80xNwZBOWagv1yLGOHuS7Dh_rvohyVnLfcnMu68wni8fywbMl97P2wRFc0Vqn_fdqftOZGaIQvaKOM91cKRuvioQ2xsnt8Co6v5HNC6s0FD8aM3s_CyOudAwl3k6tkLegS8ndAPUhUxSTKmmXV7efPhUeQlv-wTz_C9VKBT7pQVmsL_haPsXG60LA0)

Flexbox 중앙 정렬의 정말 멋진 점은 자식 요소들이 그들의 컨테이너에 맞지 않을 때에도 작동한다는 것입니다!

또한 여러 자식 요소들에 대해서도 작동합니다.

우리는 flex-direction 속성을 이용해 그들이 어떻게 쌓이는지 제어할 수 있습니다:

머저, flex-direction이 row 일 경우입니다.

```css
.container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 4px;
}
```
![](https://blogger.googleusercontent.com/img/a/AVvXsEjX3scM7bzMIgIcu7JzKNSRXFr7NqtDIVoiw3Fpth_2CnIE2ZvQuxcAdLVSazH_OH34zNIO6iixtMqG8LOQOXCChZ-cD6VVX8dyeM1aFs-Q0a_wLd7vs1_K84vl_g_4H-bxQevupJE93EpyglJzrZIJ1amb7p9hSCBVbfNrfAb0iBGSbO5iT_FSJsNVmoY)

---

두 번째, flex-direction이 column일 경우입니다.

```css
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
}
```
![](https://blogger.googleusercontent.com/img/a/AVvXsEig9Aeaw6BfdeuQ5gK2T2AuG9n8Rd3GEoP7UXanbkyJIVgLomr-1aDFuZWawFoInmoq8huejz1HUtH3Q24AQiRUbkjta7bNrgaQKSe-p9rg3xljzh6HI1iPq7SSxReSGTL0LUv3CqgyJCQuzGSycLVS_MZR0p49qjjUxj-St80MB4sbajvt8lMXH81lYqk)

---

세 번째, flex-direction이 row-reverse일 경우입니다.

```css
.container {
  display: flex;
  flex-direction: row-reverse;
  justify-content: center;
  align-items: center;
  gap: 4px;
}
```
![](https://blogger.googleusercontent.com/img/a/AVvXsEiYnVlFnTy3EgbRoLO4SmOWaGTp19M7OJE42u-MMAxfx8iMomWlqAzmwwT6puZSI91btzhj0pouVuL-L50Tu0Naf_vyvnwzhuyweQYSvjeFqpoXLe1HSTO39mHjPBq4fQpPjPjBF0TRWYBwGt3-mvdPjch5_WrRkFhXbSwooaF2aRft-QWnezq840SX5fY)

---

마지막으로 flex-direction이 column-reverse일 경우입니다.

```css
.container {
  display: flex;
  flex-direction: column-reverse;
  justify-content: center;
  align-items: center;
  gap: 4px;
}
```
![](https://blogger.googleusercontent.com/img/a/AVvXsEjnz1Wn1qOgqYFJ73uXusS4JgQ4bUu-s02WzSump_IUwrLzH9fdQcTNxDeDDrhElHCAoP7U4SHlXuokJUukSA_9F_8qcRNECaiwm-bamsAdYRNb9X-LPSBniNfV63Ee_PtEuhoPbEadzZC5iGJre-aIlidnoznidGMmZR86BFAnxuDlQHxwRkBAFDyH5tc)


앞으로 살펴볼 모든 중앙 정렬 패턴들 중에서, flexbox를 이용한 방법이 제가 가장 많이 사용하는 방법입니다.

---

## 뷰포트 내에서 중앙 정렬하기

지금까지, 우리는 부모 컨테이너 내에서 요소를 중앙에 위치시키는 방법을 살펴봤는데요.

하지만 우리가 요소를 다른 맥락에서 중앙에 위치시키고 싶다면 어떡해 해야 할까요?

예를 들면, 대화상자, 프롬프트, 그리고 배너와 같은 특정 요소들은 뷰포트 내에서 중앙에 위치시켜야 합니다.

즉, 위치 지정 레이아웃의 영역입데요.

우리가 무언가를 플로우에서 빼내고 다른 것에 고정시키고 싶을 때 사용하는 레이아웃 모드입니다.

일단 먼저 살펴봅시다:

```css
.element {
  position: fixed;
  inset: 0px;
  width: 12rem;
  height: 5rem;
  max-width: 100vw;
  max-height: 100dvh;
  margin: auto;
}
```
![](https://blogger.googleusercontent.com/img/a/AVvXsEjan6tLu-BvNGxEuaUa-OoJmJvn2HC0rWdWOkZrTmUSjePrFK3bO05xdwjHOLUK5i85hVFw8fee7mMpcF8JxaxCOlUGw5E0TeERhkvrP1DoayQJySJwB5NbO7SswzIKEU02NZUvTNE8pFIiGTm817GYHrdlpPQPLPYJX2Dm5b2gp3EPwkZd-dno8iyCMb4)

가장 어려운 CSS 코드일게 분명한데요.

하나 하나 자세히 분석해 봅시다.

우리는 position: fixed를 사용하고 있습니다.

이렇게 하면 요소를 뷰포트에 고정시키게 됩니다.

쉽게 생각하면 뷰포트를 웹사이트 앞에 놓인 유리판처럼 생각하면 쉽습니다.

마치 기차안에서 바깥 풍경이 스크롤되는 것 처럼요.

이 때 position: fixed가 있는 요소는 창문에 앉은 무당벌레처럼 느낄 수 있는데요.

다음으로, inset: 0px를 설정하고 있습니다.

inset: 0px는 top, left, right, 그리고 bottom을 모두 같은 값인 0px로 설정하는 거의 축약형 버전입니다.

지금까지의 두 속성만으로, 요소는 전체 뷰포트를 채우도록 확장되어, 각 변이 0px가 될 때까지 커집니다.

여기서 생각해 볼게 너무 크다는 점인데요.

이 부분을 제한해야 합니다.

우리가 선택할 정확한 값들은 각 상황의 세부 사항에 따라 다르겠지만, 일반적으로 기본값들을 설정하고 싶습니다 (width와 height를 이용해),

그리고 최대값들도 설정하고 싶습니다 (max-width와 max-height를 이용해),

그래서 요소가 더 작은 뷰포트에서 오버플로우하지 않게 하기 위해서죠.

근데 여기서 흥미로운 점이 있는데요. 곰곰히 생각해 보면 약간 어불성설인 조건이 있습니다.

바로 우리가 요소의 왼쪽에서 0px, 오른쪽에서 0px, 그리고 너비가 12rem인 상태로 설정한게 있는데 공간학적으로 그렇게 존재할 수 없습니다 (뷰포트가 12rem보다 넓다고 가정할 때). 따라서 여기서 2개만 선택해야 합니다.:

먼저 첫 번째 방식입니다.

```css
.element {
  position: fixed;
  left: 0px;
  width: 12rem;
}
```
![](https://blogger.googleusercontent.com/img/a/AVvXsEgRZqMkiwfIjFEcF5qxOAxmOrC_s9ncHYpcm5DgHBUSaShuBNxaAz4rybV0_rlU044PWKpAdrtGx4bZKMElwhL1FU-NuzMkXjbFMBwPHy-uDRPBWtMe4fIqT5jF0S-L1vp_I2DFivW6kH1X-qjjMSCVJV9eWvxKGbmWD8ZOttiHiiuWOa53ZzkE7K5vgms)

---

두 번째 방식입니다.

```css
.element {
  position: fixed;
  right: 0px;
  width: 12rem;
}
```
![](https://blogger.googleusercontent.com/img/a/AVvXsEjFbokP24hpZ0eYFmUBTAaKYVjb9u-mHCv3NYuynXZStVZUKlvADFqZ9MeX4H_3HUhuuUXxh_df5jmPR8FlTgQZPCgISuNBBmrDxDPkL7UH9t9XASjYfEz76IsBrQCZVXwqeFOXeP9CocbOOG_dSm5HXV0efZf7zOmcIUDD1JDVqHNShg1GZ5MpPa428AE)


**CSS 렌더링 엔진은 이럴 경우를 위해서 우선순위를 두어 해결합니다.**

즉, 너비 제약을 중요하게 생각하는 건데요.

렌더링 엔진은 만약 왼쪽과 오른쪽에 고정될 수 없다면, 페이지의 언어를 기반으로 한 옵션을 선택할 것입니다.

그래서, 영어와 같은 왼쪽에서 오른쪽으로 쓰는 언어에서는, 왼쪽 변에 위치하게 됩니다.

그런데! 여기서 맨 처음에 얘기했던 margin: auto를 방정식에 넣으면 흥미로운 일이 일어나는데요.

이 경우 브라우저가 왼쪽 가장자리에 고정하는 대신, 요소를 중앙에 위치시킵니다.

그리고, Flow 레이아웃에서의 auto 마진과는 달리, 이 트릭을 가로와 세로 모두에서 요소를 중앙에 위치시키는 데 사용할 수 있습니다.

```css
.element {
  position: fixed;
  inset: 0px;
  width: 12rem;
  height: 5rem;
  max-width: 100vw;
  max-height: 100dvh;
  margin: auto;
}
```
![](https://blogger.googleusercontent.com/img/a/AVvXsEhHpkUmeyAiseRxOIOFhU5j6nwUJ1EtM80aZIpP2ex3VAtL2zdc_lH1VqBbdZyw7Qt753sob5EtYK7MrYA3XnFPVlZpYlrFXN3KAImNWHC7zzF7ubairg1jwJAG76GSJvYw-ZwEtUeaCCS0zLT0Tv3zM1YOGRJE7__CFOA_Vzifk4Jb_ib4Sg1clFR6xPQ)


이 트릭에는 4가지 핵심 요소가 있습니다.

1. 고정 위치
2. 모든 4개의 가장자리에 inset: 0px로 고정
3. 제한된 너비와 높이
4. 자동 마진

우리는 같은 트릭을 한 방향에서만 무언가를 중앙에 위치시키는 데 사용할 수 있습니다.

예를 들어, 뷰포트의 하단 근처에 고정되지만 가로로 중앙에 위치한 쿠키 배너 같은 거를 만들 수 있죠:

```css
.element {
  position: fixed;
  left: 0px;
  right: 0px;
  bottom: 8px;
  width: 12rem;
  max-width: calc(
    100vw - 8px * 2
  );
  margin-inline: auto;
}
```
![](https://blogger.googleusercontent.com/img/a/AVvXsEggIhS78WizZkUVbAwpfqfupyP4Ih4J68q4tay1SiHUxrN-bIWu1M3CI6rg6ev2Mtr9bwrdfYrM7FjinQQyH9muxJcB9VVKWr85R9CLZ11gi7J44wzBJl4P3a5JDVJDN2XAj2xNEZ9VxgUV1uNT_OkE8hhsbS-FzyfiPcCyQ_3u63h2AlmO2F2texWgFaY)


top: 0px를 생략함으로써, 수직 방향에서의 불가능한 조건을 제거하고, 배너는 하단 가장자리에 고정됩니다.

위 코드처럼 요소 주변에 약간의 버퍼가 있도록 최대 너비를 제한하는 데 calc 함수를 사용하면 더 좋구요.

또한 margin: auto를 margin-inline: auto로 바꾸었는데, 사실 이렇게 하는게 정답이라고 할 수는 없지만 해답이라고 느껴집니다.

---

### 알 수 없는 크기의 요소를 중앙에 위치시키기

위에서 설명한 접근법은 우리가 우리의 요소에 특정 크기를 주어야 하는데요, 그런데 우리가 얼마나 크게 해야 할지 모를 때는 어떨까요?

과거에는 이것을 해결하기 위해 변환 트릭에 의존해야 했지만, 다행히도, fit-content가 여기서도 도움이 될 수 있습니다!

```css
.element {
  position: fixed;
  inset: 0;
  width: fit-content;
  height: fit-content;
  margin: auto;
}
```
![](https://blogger.googleusercontent.com/img/a/AVvXsEhcG6jOxzek5Mr3OdMXw1_L4pg7w3iwMmx_quAp6nV9FX4omU2nkSU9rzONHIWIdY0dImQb8Rzzf5aomMIK9PLcoC5SA5lm_sL6KuOD7zkW5uHZSkMJAiLKgx5e-3nQ8iscvdV3PfNCt6xmTZeSzCvN54yh9-VUth2aMT33jO_lFshDT2kypX05ryaMrG8)


이렇게 하면 요소가 그 내용 주변으로 축소되게 할 겁니다.

물론 최대 너비를 설정할 수도 있습니다 (예: max-width: 60vw), 하지만 꼭 최대 너비를 설정할 필요는 없습니다;

결국 요소는 자동으로 뷰포트 내에 포함되게 됩니다.

---

## CSS 그리드를 이용한 중앙 정렬

가로와 세로 모든 방향에서 요소를 중앙에 위치시키는 가장 간결한 방법은 CSS 그리드를 사용하는 것입니다:

```css
.container {
  display: grid;
  place-content: center;
}
.element
```
![](https://blogger.googleusercontent.com/img/a/AVvXsEg4Mc6FJQblu2V9jlJhEnZn-Wfxqt3F2KTepsElfmSZd-limrlBvoXlXBio_SBGtV9hpnUF3bJnQafyjiWyRaCPu9TOtpH4DllsxTRDQk2qRpu5bn-jW0sBqE_L68PSeMT78tBP0qH-TVq-g2zU47Q7tVAse295e3sLryEBT_kEyltwb_fV2ZRJFuhyd-A)


place-content 속성은 justify-content와 align-content를 대신하는 축약형으로, 행과 열 모두에 같은 값을 적용합니다.

결과적으로 부모 컨테이너의 정확한 중앙에 있는 1×1 그리드 셀이 생깁니다.

### Flexbox와의 차이점

Grid를 이용한 방법은 Flexbox 방법과 매우 비슷해 보이지만, 완전히 다른 레이아웃 알고리즘을 사용한다는 것을 명심해야 합니다.

주관적인 경험상 CSS 그리드 방법은 Flexbox 방법만큼 효과적이지 않다고 생각하는데요.

예를 들어, 다음 설정을 고려해 봅시다:

먼저, flexbox 설정입니다.

```css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.element {
  width: 50%;
  height: 50%;
}
```
![](https://blogger.googleusercontent.com/img/a/AVvXsEhhppMNYvZvUbLQYgiAAOXDhIGqbEECb-IJy4_YMElrGXTjBO_AraDJtPyBUwClMC33gl6X3-12aoqT4q3OA6OnCa9WxJv3NLoO2HEtlRpM7BaSg0heVHwPHqxAgk2CaiTrd5KhZgt3b8prYJgvqu4fl6MH0D-qMWrVXvNOMhHYZLkYA2_OtI2tinMPbzc)

---

두 번째, grid 방법입니다.

```css
.container {
  display: grid;
  place-content: center;
}
.element {
  width: 50%;
  height: 50%;
}
```
![](https://blogger.googleusercontent.com/img/a/AVvXsEi9AIZ7LGM6wDuNK0YOZCD4HjMf9ShccrmPcV7d5Nua19k9eUiEwqEzWTRfcdaxQyuMwaLgHaY9nkiC4_yDLr-DJYJRZX0eji24QYPwgsO5gCT9mlRXuEPCT984ucm71cUKB9oYlkkdFKOl8u8At6-othPtGw7RLZjnsYmZwTW8qRuJoOAu5wXqextPnW8)

두 번째 그림은 뭔가 이상합니다.

CSS 그리드 버전이 왜 이렇게 작아지는 걸까요?

여기서 중요한 점은: 자식 요소는 width: 50%와 height: 50%를 놓았습니다.

Flexbox에서, 이 백분율들은 부모 요소인 .container를 기반으로 계산되는데, CSS 그리드에서는, 백분율들은 그리드 셀에 상대적입니다.

Grid일 경우 자식 요소가 그 열의 50% 너비와 그 행의 50% 높이가 되어야 한다고 하는 것과 같은 거죠.

그렇다고 실제로 행/열에 명시적인 크기를 주지 않았는데요.

또 grid-template-columns나 grid-template-rows를 정의하지도 않았습니다.

이 정보를 생략하면, Grid 트랙들은 그들의 크기를 그들의 내용을 기반으로 계산하게 되어, 각 행/열에 있는 어떤 것이든 그 주위로 축소하게 됩니다.

따라서 브라우저가 내놓는 최종 결과는 우리의 그리드 셀이 .element의 원래 크기와 같고, 그리고 요소는 그 그리드 셀의 50%로 축소되는 것입니다:

```css
.container {
  display: grid;
  place-content: center;
}
.element {
  width: 50%;
  height: 100%;
}
```
![](https://blogger.googleusercontent.com/img/a/AVvXsEjbJYjuKItWpK8WwA8b4twB0Q7FjHbycUFuhMgd9KMf7lAHWxn0os1Zw4SHddwlo7bmRVEneiwVtfxzPzZVQzJ2VdEO76zDBD-KWgGIL5o-NlqhFhR9UDedej7VEF9tGDjFr-K5gfeEzT93Eh1BvC0Ho0NG2iXedCmejQt1tonJpuAEe4qp5Rpif-Ldtb0)

쓰고 보니 사실 조금 어려운 얘기인데요.

제 말의 요지는 CSS 그리드는 복잡한 레이아웃 알고리즘이 있고, 때때로, 좀 더 예측 불가능한 복잡성이 있어 우리가 생각하는 것과는 다르게 나올 수 있다는 겁니다.

따라서 저는 Flexbox를 사용하는 것이 더 간단하다고 생각합니다.

### 요소 스택 중앙 정렬

CSS 그리드는 우리에게 중앙 정렬에 있어 나름 슈퍼파워를 주는데요.

CSS 그리드를 이용하면, 우리는 여러 요소를 같은 셀에 배정할 수 있습니다:

```css
.container {
  display: grid;
  place-content: center;
}
.element {
  grid-row: 1;
  grid-column: 1;
}
```
![](https://blogger.googleusercontent.com/img/a/AVvXsEgK7IBKHAUJNSNN0f4Tjp5QSTrW018626xfhqW6OxUmVxNAZ1wsCxzDT4Wsukehi6K4FTiKvQbBX3TG5Iv_9gI5vnsQRNJv6avM2FzTblT5wMzRhnAftARFbYASOaHGWrD48IrAdXZIB3BgC1wzNUsH2Z826VDMlf2MBnGzbT34fWggoH3_t3wNXEH2HwM)

위 그림에서 보듯이 1×1 그리드를 가지고 있지만, 여러 자식 요소를 그 셀에 넣어 보겠습니다.

예를 들면 아래 코드처럼요.

```html
<div class="container">
  <img class="element" />
  <img class="element" />
  <img class="element" />
  <img class="element" />
</div>
```

다른 레이아웃 모드에서는, 요소들은 가로나 세로로 쌓이겠지만, CSS 그리드 설정에서는, 요소들은 뒤에서 앞으로 쌓이게 됩니다.

왜냐하면 모두 같은 그리드 공간을 공유하도록 말하고 있기 때문입니다.

놀랍게도, 자식 요소들이 다른 크기일 때에도 작동합니다! 다음 코드를 보십시요:

```css
.container {
  display: grid;
  place-content: center;
  place-items: center;
}
.element {
  grid-row: 1;
  grid-column: 1;
}
```
![](https://blogger.googleusercontent.com/img/a/AVvXsEhUw7zhi-rbtSh5ILzu0X5LbG4GwSHnu2kUVUiUDcW7Kq7fxjdWeSbl30rKlHYq1dPcclhOjE1mnAHCxIn-N88R38_UTP6H0MEHCNM3xKgTZ9qpe17891NXWuY2cLIdmJOEbcuPULIzrN4-Co32c5ClK-Qp7LqaMGKCCJPyB1snybKEN3u6le9i-hP8SxQ)

위 그림에서 빨간 점선들은 그리드 행과 열을 보여주기 위한 겁니다.

이 작업을 수행하기 위해 한 가지 더 속성이 필요합니다: place-items: center.

place-items는 justify-items와 align-items의 축약형으로, 이 속성들은 그리드 셀 내의 이미지의 정렬을 제어합니다.

이 속성 없이도, 그리드 셀은 여전히 중앙에 위치하겠지만, 그 셀 내의 이미지들은 모두 왼쪽 상단 모서리에 쌓이게 됩니다:

```css
.container {
  display: grid;
  place-content: center;
}
.element {
  grid-row: 1;
  grid-column: 1;
}
```
![](https://blogger.googleusercontent.com/img/a/AVvXsEjSTVGoraW9o_Y6mJ8Hhx6LmTMnfweh_gZZKMaxLZkY8FxvnLSKs3e1-_Kjrlz5HPeiGMIr9dudIXkAeI6pjWdAmdZVMlbhfvIdDXkq-GSXVAbIcupIys6X3f9OI1WZAytsB8AHRUAV8SAf0TiQzjpvRPoZZqrwuowgaYmK1eNG-tN5_0ds9Qh1QTe381o)

---

```css
.container {
  display: grid;
  place-content: center;
  place-items: center;
}
.element {
  grid-row: 1;
  grid-column: 1;
}
```
![](https://blogger.googleusercontent.com/img/a/AVvXsEjl3QesY5GWqNjPW74LfRBnj5R1QuageFOM2P0FiGOjhc3aOnFilGtdZBHMcG-B8XPR3BQxGmZOQuwtmzv5xPHEatOtHZL8ARaLw8kwsHMNkqxFXP3J-D0NWdNUPU48Zox_EQhFqtzuu2SoTRQoJnGBXTZ8j5jGKGwBwiNx_qH66KSFKkkZ3c6zZA0eF0k)

어떤가요.

이 방법은 꽤 고급 기술입니다.

꼭 기억해 두시기 바랍니다.

---

## 텍스트 중앙 정렬

텍스트는 CSS에서 볼 때 그 자체적으로 매우 특별한 겁니다.

지금까지 배운 기술을 개별 문자에 영향을 미칠 수는 없는데요.

예를 들어, 우리가 Flexbox로 단락을 중앙에 위치시키려고 시도하면, 텍스트 블록을 중앙에 위치시키게 되지만, 텍스트 자체는 아닙니다:

```css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
```
![](https://blogger.googleusercontent.com/img/a/AVvXsEg0lwNnPdN2ELqeBZLB0Fwc9_QZ-DmKmVNFQGkOtun3XF_CPdcW9yHMMQgSc5vj9EsmeH9gk2ytr7jXQxOZTsAmcDKGM2vUSj3AtzUNUCYd-2RiP3GPTyXPoewiQRp12RsIrOLOaUp8RwfKHvKT59Fa3ayD3mbMDcNaCd9iYS9DxZ-LAriWcxb_20pFIpo)


Flexbox는 단락을 뷰포트 내에서 중앙에 위치시키지만, 개별 문자에는 영향을 미치지 않습니다.

위 그림에서 볼 수 있듯이 텍스트 문단은 왼쪽 정렬을 유지하고 있습니다.

텍스트를 중앙에 위치시키기 위해 text-align을 사용해야 합니다:

```css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
```
![](https://blogger.googleusercontent.com/img/a/AVvXsEhj2P9qh-whoRwoewq6jDJ7wuUemrtSEXVdXKLMqy68xtd6p5E4w6jcWX8FPuDQNwXVrDWVyGI7-pF6mEOOOWvtu2S2pLMApLMXllKCrfEyaKqPu2LLuXGNGNvVr8BeCVGWUIkPAmxI4__9DDwRxJEc4NpKdr5T3vShMqTgBGuYC7CP_BL9pL8dG_w6Sq0)

---

## 미래의 중앙 정렬

앞서, 우리는 Flow 레이아웃에서 요소를 가로로 중앙에 위치시키는 데 auto 마진을 사용하는 방법을 사용했었는데요.

만약 우리가 그 요소를 세로로도 중앙에 위치시키고 싶다면, Flexbox나 Grid와 같은 다른 레이아웃 모드로 전환해야 합니다.

혹은 그럴 필요가 없을까요?

아래 코드를 확인해 봅시다:

```css
.container {
  align-content: center;
}
.element {
  max-width: fit-content;
  margin-inline: auto;
}
```
![](https://blogger.googleusercontent.com/img/a/AVvXsEhH0e9o2jMEPOUN4ZPZVDfgNhr1g9dOQW_mJ2YsUKe_g5yhTiPkxSUiw8fV1XCfAHpGydoLM1ynQnX_Evu5Bv_pTipBzZZVlEdOMZd0pwqSDa3W0B2-l_lLDAV6K88WqBe9jNY7jaea1-r8JCOnTcap3c5Ijnt75yVdxDXGCrIobPSnwkKGc8cReRiTCF8)

뭔가 우리가 배운게 헛수고가 아닌가 싶기도 하네요.

align-content는 CSS 그리드의 것인데, 여기서는 display: grid를 설정하지 않았습니다.

어떻게 작동하는 걸까요?

CSS에 대해 제가 가진 가장 큰 깨달음 중 하나는 CSS가 레이아웃 알고리즘의 모음이라는 것입니다.

우리가 작성하는 속성들은 그 알고리즘들에 대한 입력입니다.

align-content는 처음에 Flexbox에서 구현되었고, CSS 그리드에서 더 큰 역할을 맡았지만, 기본 레이아웃 알고리즘인 Flow 레이아웃에서는 구현되지 않았습니다.

지금까지는요.

2024년 초 현재, 브라우저 제조사들은 Flow 레이아웃에서 align-content를 구현하는 과정에 있어서, 이것이 콘텐츠의 "블록" 방향 정렬을 제어하도록 합니다.

아직 초기 단계입니다; 이 새로운 동작은 Chrome Canary(플래그 뒤에)와 Safari Technical Preview에서만 사용 가능합니다.

---

# 정리하자면

어떤 방법을 언제 사용해야 할지에 대해 정리해 봅시다.

- 단일 요소를 가로로 중앙에 위치시키고 싶고, 그 요소의 형제 요소들에게는 영향을 주고 싶지 않다면, Flow 레이아웃의 자동 마진 전략을 사용할 수 있습니다.
- 모달이나 배너와 같은 부동 UI가 있다면, Positioned 레이아웃과 자동 마진을 사용하여 중앙에 위치시킬 수 있습니다.
- 한 요소 위에 다른 요소들을 중앙에 위치시키고 싶다면, CSS 그리드를 사용할 수 있습니다.
- 텍스트를 중앙에 위치시키고 싶다면, text-align을 사용할 수 있습니다. 이것은 추가적인 방법들과 함께 사용될 수 있습니다.
- 마지막으로, 대부분의 다른 상황에서는 Flexbox를 사용할 수 있습니다. 이것은 가장 다재다능한 방법입니다; 하나 또는 여러 자식을 가로 및/또는 세로로 중앙에 위치시키는 데 사용될 수 있으며, 그들이 포함되어 있든 오버플로우하든 상관없습니다.

끝.