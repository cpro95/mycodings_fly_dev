---
slug: 2023-11-26-css-tutorial-understanding-css-flexbox-the-second
title: CSS 강의 2편. Flexbox Growing, Shrinking, Gaps, Wrapping 이해
date: 2023-11-26 01:24:54.263000+00:00
summary: CSS Flexbox 완벽 이해 2탄 - Growing, Shrinking, Gaps, Wrapping
tags: ["css", "flexbox"]
contributors: []
draft: false
---

![](https://blogger.googleusercontent.com/img/a/AVvXsEjn2ienhrMXz72CJVExoqJ1S_0fHXNGzGG6FWk476XfE3aXIcOEvk2fVGCyqhQp0kQlid23CcUkH0P_Raox7JrbZKCisaiCwgxwIWwHT2fJbA_vaVdG9Dkb7IVs4LNbgywqwAgVnIW3sbkzCbxiV-IG6fVaT9O7W5R1QvMH_r5t3QZs2-RI8ntcZsXBPZE)

안녕하세요?

CSS 강의 2편입니다.

지난 시간에 이어 Flexbox에 대해 심도있게 공부해 보겠습니다.

전체 강의 리스트입니다.

1. [CSS 강의 1편. Flexbox 완벽 이해](https://mycodings.fly.dev/blog/2023-11-25-complete-understanding-css-flexbox)

2. [CSS 강의 2편. Flexbox Growing, Shrinking, Gaps, Wrapping 이해](https://mycodings.fly.dev/blog/2023-11-26-css-tutorial-understanding-css-flexbox-the-second)

3. [CSS 강의 3편. Grid Layout 완벽 이해](https://mycodings.fly.dev/blog/2023-11-27-understand-css-grid-completely)

4. [CSS 강의 4편. CSS Variables와 calc 함수 완벽 이해](https://mycodings.fly.dev/blog/2023-11-30-all-about-css-variables-and-calc-function)

5. [CSS 강의 5편. CSS에서 div를 중앙에 위치시키는 방법](https://mycodings.fly.dev/blog/2024-02-14-how-to-center-div-in-css)

---

** 목 차 **

1. [Hypothetical size](#1-hypothetical-size)

2. [Grwoing and Shrinking](#2-grwoing-and-shrinking)

   2.1 [flex-basis](#2-1-flex-basis)

   2.2 [flex-grow](#2-2-flex-grow)

   2.3 [flex-shrink](#2-3-flex-shrink)

   2.4 [shrink 방지](#2-4-shrink-방지)

   2.5 [the minimum size](#2-5-the-minimum-size)

3. [Gaps](#3-gaps)

   3.1 [Auto margins](#3-1-auto-margins)

4. [Wrapping](#4-wrapping)

---

## 1. Hypothetical size

```html
<style>
  .flex-wrapper {
    display: flex;
  }
  .item {
    width: 2000px;
  }
</style>

<div class="item"></div>

<div class="flex-wrapper">
  <div class="item"></div>
</div>
```

위와 같이 item 클래스에 width를 2000px이라고 아주 크게 설정했습니다.

그리고 flex가 해당 width를 어떻게 처리하는지 보기 위해 두 번째 div는 flex로 감샀습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhY8VfIntdLPCjXM9BLCey95tgmdvZ5_xdg1G4XUNebT-JUU8H-ZsfcTUNdea2MnijATZ7UvJbStPTlSYJ3u8NsTLbeojRfUy0IMgB29w-Mr7lAwUupfqUY9kv88fzpJd2-VUr-N9jw7xX5mHQU0_Z4h-urWo3AYm6sXUszAPzJKEFjZKREHBKlFIMHvo8)

결과를 보시면 위와 같이 첫 번째 div는 아주 기다란 width를 가지는데, 두 번째 div 즉, flex로 감쌌던 div는 화면에 알맞게 적당한 width를 가지고 있네요.

왜 그런 걸까요?

바로 Hypothetical size(가설적 크기) 때문입니다.

1편에서도 언급했던 레이아웃 모드에 따라 작동 방식이 다르기 때문인데요.

첫번 째 div는 CSS의 가장 기본적인 레이아웃 모드인 Flow Layout에 따라 작동합니다.

Flow Layout에서는 width는 강제 제약 조건(hard constraint)입니다.

사용자가 2000px 이라고 지정하면 브라우저는 화면밖으로 튀어 나가든 말든 상관 안 하고 강제 제약 조건에 따라 무조건 2000px로 렌더링하게 됩니다.

그러면 두 번째 div인 flexbox에서는 어떻게 될까요?

레이아웃 모드가 Flexbox일 때는 width는 약간 다르게 구현됩니다.

강제 제약 조건이 아니라 상황에 맞게 Flexbox가 알아서 지정해 주는 그런 개념입니다.

Hypothetical size(가설적 크기)는 완벽한 유토피아에 살고 있다고 가정했을 때, 알아서 화면 크기에 따라 width를 계산해 준다고 생각하시면 됩니다.

---

## 2. Grwoing and Shrinking

Hypothetical size(가설적 크기)에 따라 flexbox 아주 유연하게 작동된다고 위에서 배웠는데요, 이제 실제 flex-grow, flex-shrink, flex-basis를 이용해서 어떻게 변하는지 살펴보겠습니다.

### 2-1. flex-basis

flex-basis를 쉽게 이해하려면 아래와 같이 생각하시면 편합니다.

fflex-direction이 row일 때는 flex-basis는 width 같이 작동하고 flex-direction이 column일 때는 flex-basis는 height처럼 작동한다고 생각하시면 됩니다.

좀 더 상세히 설명하자면, 일반적인 Flow 레이아웃 모드에서는 width와 height는 각각 width는 수평 사이즈에 영향을 주고, height는 수직 사이즈에 영향을 줍니다.

그런데 flexbox에서는 row와 column에 따라 수평, 수직이 아무렇지 않게 바뀌는데요.

그래서 flexbox 개념을 처음 개발할 때 row, column에 구애받지 않고, flexbox의 Primary Axis(주축)에만 영향을 받는 'size' 항목을 만들었는데요.

이 항목이 바로 'flex-basis'입니다.

flex-basis는 오직 primary axis에 적용되는 'size' 항목인데요, 그래서 flex-direction이 row, column일 경우 각각 width가 될 수도 있고, height가 될 수도 있는 겁니다.

그림을 보면서 이해하시면 좀 더 쉽습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEj-iNWwEqONx9jUB7B7NawAhDg1-vnPw_zuvpmkitxN1ACqp5sDCNS0Wzza6Op4m-5KON_esKXutw1vKOkCWaHqEzKs9NHwr0MB4cPF14vc2r85X0ol3KJ-UMYFcNKbrmavVAGMLECNoCd4_BAn9vCV7lzRNh68eTQ8vAhE4rYj3dYe9nV6I-S0f6eCOyw)

위 그림은 flex-basis가 50일 때입니다.

flex-basis를 좀 더 키워볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEiRJlnA8-1NkaW_w4rTdSwr4Xm8EdOUNFdczBzi7S8b51wE52TYHwqP_nza7Z6MvewfQ0iiKIkDt3v7Zj6cIrOjQC5pgjWBNaDhoElyT1IEqg53xgkbtvxQsPH7DyUDkbLlmbTLc3Hdk44oRbUphfXR9kCMfcmopztXwQGp0_EqH9yTGzpsvumgpObDytM)

176일 때입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEi8eqEcnI2Uj5EQwPnJjTV8DDqpZQLwGS1a7EyjoLLb-i0LtRWCp12OAQWUxfu5QBD_okqh3a54S7-v-65DQOnks94oqq4pm5zXXorygV0I1y-YIBhEyzY7F7q7iJVGf8J4kVovmt_rsrzl3AyMrsymnIbwgyCo92wCslEmoMqGjdB_ZzZTaxSsE2apRUI)

flex-basis가 280일 때인데요.

flex-basis의 size도 강제 제약 조건에 따라 정해지는 게 아니라 Hypothetical size처럼 상황에 맞게 유연하게 사이즈가 책정됩니다.

다음은 flex column일 때입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgk4Ou8_4-GB5Df8iS4iNVp705HOFLHyZv9DSUMyTdStXIGl4p0zue-o7B74v4vpvMdJ8LStTbkROkVVaxP05snxkL0TjKN1_VG-TU5jI8qGGLzT6HxJm-9303d28J0LjAs6_OH_uahRx0txsHhfnfaSnlZ5o6_Lc-UUpSDrA6tEg6JqDDo7DeNjuEC1Cs)

![](https://blogger.googleusercontent.com/img/a/AVvXsEg0vsGBahznx69qkkpPCqvK3Tc5C8to0geIrva9eIYXeB2qeKZF7SG5qt-qBPJ6E67DfLQzchvjpDESdQmd1OIoo-5sew72GXm6qcGqoed9bZEjjhfq44MUweeEWOGIm_JFunaDspu026YXYhVux7iaEiwkU-hIrWwZIMFBA8Oi8Me0bnZqrV276hrInnA)

![](https://blogger.googleusercontent.com/img/a/AVvXsEgE3cbDbFW1pi2okj_vAfayaahSNSt35PbLAJawFN7ww411sojz5uNvEMC3uw9QPkYCU6DrFQWVa0Aw2JzWMCMcn49dClhbk3AkxZO963J6HkTAT6XR-nxcHJk6fQIu3W1LVi7U8mwF7pmqWtv05djC4zGc7D1XIMn5YbKXfjEXaGqMHZ3UKk-9NmRVbUM)

주축(primary axis)에 맞게 flex-basis가 작동되는 걸 보실 수 있습니다.

---

### 2-2. flex-grow

flexbox에서는 flex 컨텐츠가 가장 작은 알맞은 사이즈로 축소되는 게 디폴트 행동인데요.

이 경우 아래 그림에서 볼 수 있듯이 남는 공간이 생기게 됩니다.

이 경우 남는 공간을 쓸 수 있게 해주는 게 바로 flex-grow인데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhxDxQxrtceqfN3Fe2QBvSgR6xgAIPQrUlRTAmCkIycc6Imwala8pY_ZHKdXDb4jCDGWvLg5Kc5gWq-7joSoxBLbgP5J1zGX-N3Q2KUoXvc9mhKAoc-mTWCDTrieCjc-GPcCnaIPxjECi0vumfIljKaIb9iisbBF4fotgffrwiWigrPYb0-T4-VVtu_2kw)

![](https://blogger.googleusercontent.com/img/a/AVvXsEjEIc-vqE0cUcpNkyWOMBeHPG-CYPgMoWN7fhFLFR8w3QjvW6WOqTTjyoqFZNMe2medCHcEU8bF1suSZW6fUDLzI4j-klFXVbhN4NBv0j4ZBvQi-i-HN97ZOZXTeB6Vv8TLz6oXFbEiDCM80InZez8g6zpTh0zTJEeU3z37jJspoFYzloUtmWYIge4826E)

두번 째 그림을 보시면 flex-direction이 row일 경우와 flex-grow가 1일 경우 남는 공간을 알맞게 다 쓰고 있습니다.

flex-direction이 column일 경우에도 마찬가지입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjcUz8U-qUDlpZILmyFbHkUPFrjGnAnz45-Yyh0vqnuaigkTtrmfap60_4Ip6RBZx4S3NE2k6UIZraUioRfIs9hhErS2Q738G9JFhtvY3ZZdoGkPeopmct4DJxjDrVQFMgm920d33GvxPZ-qdg4Z1ul92g7O9Pm8gDabZ68tiSeNCAoth0ue9EkZpvzHpo)

![](https://blogger.googleusercontent.com/img/a/AVvXsEgeN163SlHLkpqeScBQQY_T11XfiRxn_83uPHt5wpSJfKbVBle3upq0oKtxezrA7bHep6O54ptRJx7m2OH4Yb9Ff0s8R-p384emOSHWjHNRgewvlSvuqMW_fGtwRNYn6Xups7sREFnfqUYJ0dTIls7AcdImERqjfJR3Rv58gVXUupndMlxWKxK9lcqOshY)

flex-direction이 column 일 경우 위와 같이 작동합니다.

일반적으로, flex-grow 속성은 0 이상의 어떤 숫자든 가질 수 있는데요.

flex-grow 값은 해당 flex 아이템이 사용할 수 있는 남는 공간을 얼마나 차지할지를 결정합니다.

일반적으로 flex-grow 값이 0이면 남는 공간을 차지하지 않으며, 1이면 사용할 수 있는 모든 추가 공간을 차지합니다.

그러면 만약 flex-grow 값이 2라면 다른 아이템들의 flex-grow 값이 1인 경우에 비해 두 배의 추가 공간을 차지하게 된다는 뜻입니다.

즉, 하위 아이템들에게 각각 flex-grow를 0이 아닌 값으로 지정해 준다면 전체 숫자의 몇 분의 몇 개념으로 공간을 계산하게 됩니다.

그림을 보면서 설명해 보겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgeR2NzLcDTpowrDwuqnDlW-8LPINdXNMwwxk032CXnc8hd0TP3txETMKd82FBerAi7yx-5H6Pr63WU-mSSeGt_ebp0vmuAMK6Xr5YVwHfuzPlpE5TLf5w6mZh_lq9uZolR-e6BWG28AaTQY8e8-pMr7xsP6-6dJmZ2d-ZgB2ZA-KmkSxfT6MJj5Y8EnqI)

위 그림은 flex-grow가 1일 세팅된 두 개의 하위 요소가 나란히 있다고 보는 겁니다.

flex-grow의 합계가 2가 되고 첫 번째 요소는 1/2, 두 번째 요소도 1/2가 되는 거죠.

![](https://blogger.googleusercontent.com/img/a/AVvXsEh5KlgAxQWqqJoggmIkfE4kry6pavR1v84c6ua0TVAsCBBaCZRmjt_UvAVEpkrQQuX4kkTiZ4XipKclzKsgJcOPMnBkmtyo2OvgokmXzxdyhVf7mLe8DVBfRPoFv9tWKYPmhkCBGF0rQ7yDh0cOBuZTZ5iVGbhoYHYr3W1QD14DYmp1EkTRWhqLQ2pZ6Rc)

위 그림에서는 첫 번째 요소의 flex-grow가 2일 경우이고, 두 번째 요소는 flex-grow가 1일 경우입니다.

그러면 전체 합계는 3이 되고, 첫 번째 요소는 2/3가 되고, 두 번째 요소는 1/3이 되는 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgqYJ6alCrRutWOGSmsXB7VQCK9qiXnM6EkALsNzBc6_lfdNmbH2vRXVAW-ulsGRc9WINowKCPGyMMq-v1pA1nrExDqvBFL6DM-WuRSdEAksqtlPIcsj6-4V52vAv3X5TMxX3bwmcSnTjqh1VXTD1qehACJ65dukuLLf2dZ6MGrzDjx-byXA9IaZDHy34I)

위 그림에서는 첫 번째 요소는 flex-grow가 3이고, 두 번째 요소는 flex-grow가 1입니다.

그래서 첫 번째 요소는 3/4만큼 공간을 차지하고, 두 번째 요소는 1/4만큼 공간을 차지하게 되는 겁니다.

---

### 2-3. flex-shrink

두 개의 flexbox를 감싸고 있는 전체 컨테이너가 아래와 같이 있다고 합시다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjdSTr6Xd-y0Caq0H0fKjJJV83zr2eLeyF16nhXLwcyct9CrmMRJbSeGx0agJN4Y7OwvdT53_2CZV7cFQ43hm9qsn_ytwg88riGBRGn3kz6Vj9J9opY6bQX5wrbTnBgNmupqu9U9PxK91-0eLPLxJY0dcuJUBBGm7Y_5vcmVW2Mxbeo9zxHRNFWhG3V0K8)

전체 컨테이너의 크기는 600px이고 flexbox인 첫 번째는 300px, 두 번째는 150px입니다.

이럴 경우 컨테이너의 크기가 더 크기 때문에 위 그림과 같이 표시될 겁니다.

그런데 만약, 컨테이너 크기가 더 작다면 어떻게 될까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEi1STeaxckeJcvUy71RvRr7njOMhXN2lK_fFjG8TQWJwPYkFIHRkv1AGxgaI-NIgztSSPps1DEBuoWIRm6vE7alDHDtdywGg1EpmU9J_8BZYzJs_StUeseZ-vaP9jzMGjDcUaa3TqihFqqzvyBGIoV98SdYriuBenYHDqyj-FVax92YFz6mkJkjP3iNqmA)

flexbox는 hypothetical size에 따라 알맞게 축소가 됩니다.

그러면 flex-shrink를 이용해서 사용자가 직접 그 비율을 지정할 수 있는데요.

flex-grow처럼 flex-shrink에도 0 이상의 숫자가 오면 되고, 해당 숫자를 모두 더해 분모 값으로 하고 개별 숫자를 분자값으로 하는 ratio(비율)이 됩니다.

위 그림에서 볼 수 있듯이 퍼센티지로 보면 같은 비율로 줄어들었습니다.

이게 핵심인데요.

다른 예를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEgt7vXWZ7I6Flj8nc5UUZMpbc6sbBC8Klqgfu3zf87445yd-d3uIbNPjd3w22Q7VqxClqbg81k1eVHlLorfdmgI-uh5h5MItiT7nv0UPLxBpRipkuL_kMPViVFsLDxMz5C2gMmizn0-19fSO43nXuSdsdzR0Mk7J3TzSI84rnjoS9ayAnT8Os_-e5-kFXA)

위 그림에서는 두 개의 flex item이 각각 flex-shrink 가 똑같이 1일 경우입니다.

flex-basis 가 두 개 합쳐 500px 이고, 컨테이너 사이즈가 400px 일 때 똑같이 20%씩 줄어들었네요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiWZ581K-a4zBhzqeQqA4OG4pE1rrwogH_MHR496lGoFClwFycp06mRS_gaYTho6MjIn3XShwOkDdKBXohXd3pKPeS8fadc2Yl0XnjcPfPW6DKHKYwf4milyuHT8IY-DPsM5LJd-N1UK5Jqkt3qN7Jg8yh1dEeZe0116vKfEyX1cvUaoTDVqDGxs5ttXNA)

위 그림에서는 첫 번째 아이템의 flex-shrink가 3입니다.

그러면 전체가 4이고 첫 번째는 3/4 비율이니까 75px, 두번 째는 1/4 비율이니까 25px 만 줄어들게 됩니다.

다시 한번 상기해야 할 게 있는데요.

flex-grow나 flex-shrink 값으로는 0 이상의 값 아무거나 올 수 있습니다.

그래서 각각 flex-shrink가 1000이라고 해도 결과값은 똑같을 겁니다.

왜냐하면 비율로 따지면 똑같이 1/2이기 때문이죠.

즉, 명심해야 할 거는 바로 flex-grow, flex-shrink는 비율(ratio)로 작동된다는 겁니다.

그리고, flex-grow와 flex-shrink는 아래의 관점에서 이해하시기를 바랍니다.

```html
flex-grow: 남는 공간을 어떻게 분배할 것인가? flex-shrink: 공간을 어떻게
지워버릴까?
```

여기서 중요한 점이 하나 더 있는데요, flex-grow나 flex-shrink는 둘 중에 하나만 작동된다는 점입니다.

쉽게 생각해 보면 남는 공간이 있을 때는 줄일 필요가 없기 때문에 flex-shrink는 작동하지 않을 겁니다.

반대로, 컨테이너보다 자식 요소가 훨씬 더 크다면 flex-grow가 작동하지 않을 겁니다.

왜냐하면 비율에 따라 나눌 공간이 없어서이지요.

---

### 2-4. shrink 방지

우리가 SVG 아이콘을 flex 컨테이너에 넣을 수도 있는데요.

이럴 때 만약 flex-shrink에 의해 SVG 아이콘까지 줄어든다면 영 보기가 좋지 않겠죠?

![](https://blogger.googleusercontent.com/img/a/AVvXsEiotAiE6nzwRuitTHreF8q52fFXKMwE4JaShAnWAw_cqKskngi8gMROi6ukONAsoIHzDz2Vdd0kxmH3M1un0_PzM8yMXupZKgf1FaO9qKzZ001ltyAk7DUA5GrucYNkovVH78aYZsX9O8MeG5FfJ1921fybhHdrPef0k5yFIDlnUrD2W21VZZD5Zpsxe9k)

위 그림과 같이 아이콘이 들어갈 자리인 동그라미가 같이 줄어든 게 보일 겁니다.

이걸 방지하는 방법이 있는데요.

바로 해당 아이템의 flex-shrink를 0으로 지정하면 됩니다.

`flex-shrink`를 0으로 설정하면 본질적으로 shrink(축소) 프로세스에서 완전히 "견딤"으로 처리됩니다.

Flexbox 알고리즘은 `flex-basis` (또는 width)를 강제 최소 제한으로 여겨서 줄어드는 걸 방지할겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEg7CEdYXNKefpQJIej3UJXuJV-K7HnWXcJZDYY2XtDai-C5td-ewwaNcxa9G3sWtOramUYBrP8YHUgmhAel5rVOtm2O0i01_iqspsoSAFzTYsJShXQRFaRT84kC-0tuinklA5B1z2MUh20cSmgRLPpo8QbJNcVSBHRhp_Mi434lNrORKQTtiLSS7oT9DbA)

![](https://blogger.googleusercontent.com/img/a/AVvXsEgTD9L0QpPSXmiJtMXanZSFxk_3qV1aOCCFRFYs4ObTGUdZVXtuJVrSfeqrrl_PKmSeGx0ksSJsNxu_JNyiHl2tioUI7j0PygZ_bUnugw6NGlcnvuBiAxZl3bR5GBIxoJhQx6YGs3Y5kAQZiSNvW1V8CmRcPRZh3eex0RPT1To4lH8zaAGCec5HrmIJPXU)

---

### flex-shrink보다 좀 더 간단한 방법은?

간단합니다.

```css
.item.icon {
  min-width: 32px;
}
```

바로 min-width 항목을 지정하는 겁니다.

min-width는 강제 제약 조건이 돼서 아이콘이 이 크기 밑으로는 절대 줄어들지 않을 겁니다.

그렇다고 해서 flex-shrink를 0으로 지정하는 방법이 더 복잡한 건 아니고, flexbox와 flex-shrink를 같이 쓰는게 좀 더 일관성이 있다고 볼 수 있습니다.

---

### 2-5. the minimum size

아래와 같은 input 창이 있다고 합시다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgmq6kpaV8_niaGpTOESgIfoxByyHsDzQbVFwyMtOLBE9KBp7J3uBYS5f0mcZrk1FzAJrikRHBooXfypr_aEj1vp-7XurRlXVVlSp5pRCWgHX2-wRnNUGpSM02l6GZz4CTeM4pXGXOoz3gf1kHf921BBhmlDHkPLAXTU_9J97POE2Xl84D_1_sENthwze4)

만약 위 그림에서 전체 컨테이너가 아래처럼 줄어든다면 아래와 같은 현상이 발생되는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhT3-LwURmdBy2AEiJ7vZ8jN_i57e6eiesi4IqjJWGZIJAYnZF2uRxptBMbytcAUZz0wFloqp4JT592FVzJlTPD5kYSUXznHNTN85suRwCvlKi4Q18z0N_PpgsG_hQoTH39hdXIkkZxvyNpNsV3dtuqLOshKGvk75mB_NxQ3gcIBfzcTHkZNy2pChfSt2o)

전문적인 용어로, input 태그에 overflow가 발생되었다고 합니다.

왜냐하면 flex-shrink는 디폴트 값이 0이기 때문인데요.

"만약 input 태그아이템에 flex-shrink를 0으로 지정하면 되는거 아닌가요?" 라고 생각할 수 있습니다.

그런데, 여기서 hypothetical size와 같이 생각해야 할 게 있는데요.

바로 the minimum size 입니다.

Flexbox는 자식 요소를 해당 자식 요소의 the minimum size 이하로 shrink하는걸 거절합니다.

그래서 overflow가 발생하는 거죠.

input 태그는 기본적으로 170px~200px(브라우저에 따라 다르지만))의 the minimum size를 가집니다.

그래서 flexbox가 the minimum size 이하로 shrink가 되는 걸 거절하는 거죠.

input 태그 말고 다른 예를 들어 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEhMDWri67vf77lQ3TIYHseb47fp5Y_W94TQyJc-OJlcrYuzk7WGgJakrxL_G-7fs1vb7y1NJfnyqkHDDE0jgLW7ir4T7lTSmuB4qoYMq9WBR6HwvgpCc2tmIdHPCkzd6mBDeueOybDqehL-2S7gi67JxMRQB2UFPI_LRLzC26WLnYDnWtJBSOaQO4dXh4c)

위와 같이 두 개의 p 태그가 있다고 합시다.

만약 전체 컨테이너를 아래와 같이 줄인다면 어떻게 될까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEgz2pYNCG62a3l_9mKasxPDOqvVfofE1RMTmRhS0AeXAoYRDmUgLr53a1OyNAYcc3OxT_9_Sipi7-y8rwoGyyPJKJICNyue-9LmbcTs6-TIAmxquYmySlWzzP-j4PvcZstsDeHv-phbZTidw0cQbFjU8v1SYNjw36c1WqvjQDzifZkbEmYzG8IAOSK-7jk)

위와 같이 overflow가 발생될 겁니다.

왜냐하면 p 태그의 the minimum size는 바로 단어 중 끊을 수 없는 가장 긴 단어가 바로 the minimum size가 되는 거라서 그렇습니다.

그러면, 이 같은 문제를 어떻게 해결할까요?

바로 the minimum size를 다시 세팅하는 겁니다.

즉, min-width를 0px로 세팅하면 됩니다.

min-width를 0px로 세팅한다는 뜻은 flexbox 알고리즘에게 해당 요소의 the minimum size를 새로운 값으로 강제로 덮어씌운다는 뜻이 되는 겁니다.

그래서 아래와 같이 작동할 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEghpzzXAUlRT-jDDyFa8noXC8O8UAzcBc6BWCAiGjroNga_zPNeUHvnkIp6ZMzDho1mEJilOGHjHerZql2Nud1Vd8Yx7FiJ7npUkefpEKDObrVsgxGSa6p79m4OpYBAQz3ZXNRKT7rsndZOkmwcgcsAtQJ-piWJWJAFtLZZ9mIS4skgOVUdHNspFXKxBcc)

![](https://blogger.googleusercontent.com/img/a/AVvXsEixlOv19Hna8qnWGqFGJDDE9Wgi3xoc5EN1JQWX7Vve-dVEOZ5XLLacL7_UY04cibU65rkjkcpmFPuAnWaHpLK9xT59hYpmCCkY26cTNEXGM0BfjRNbVc-hMz30IY8J6I8gcFzd5WgHKmljft9D2BTIAJVQhRMM7fs_vNCS2VW6stSHovgNENGmTKZlydw)

어떤가요?

참고로, flex-direction이 column일 경우 min-height를 0px로 덮어씌우면 됩니다.

---

### min-width 사용 시 주의 사항

min-width 마법이 모두 작동하는 게 아닙니다.

아래 예를 보시면 p 태그에서는 제대로 작동되지 않습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgB-oUEFu3N2Nuy8yzaYKpRIytMJ12x-Vr92btwvIqHCHXohwbAMDpU3m0R12XvhE9sfBQ9I-GoONnGAonA596g7JIT3QeR9rX0ZvGdZZSrHZ2m3pSTbUvDD3JJIAwjkYy2wRjkntF5EWDctqP3Aaup4mN3HXnhjpZJ5npSxkybaL0kFVcDUKkmiTI6B9Y)

그러니까 min-width를 만능 해결법이라고 남발하지 마시기를 바랍니다.

---

## 3. Gaps

Flexbox에 추가된 항목 중에 가장 유용한 게 바로 'gap'인데요.

gap 항목의 작동 원리는 아래 그림과 같습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEj78nSAaOrDCRXOef29loiAauA5X29kQUB32xT1RfL_x7NFBC6FipaOBTG4ZHTxkfSczPzTLWpLlf_06gLKYbs7YqAH4COs7CIgvbjzL-d-TJC7HcJz9kvKuDZMLZoCG4gpOHkQo_-RdA2tL3dZMN-duMOkKu-z7bu5g5aQ2ZHM4m8Ypaq4u05GkG58d7U)

![](https://blogger.googleusercontent.com/img/a/AVvXsEgazq3YmxchBM6dK0A9d8ZmOVgiBwIXIu0PplK6rAJUG6XH2bnpQ9fKrxzuQ1MZzCfI_LdksIDm5v_NjrI-AzW9SHmRyN1mK889w8rVBD4pyeJ_iAfhKRCVDuTqZfsrswRrWjqBjZ2dl_DdxHOA4ffgR4e4LiepqykPfFKMH7C8hoMzdV_3e0ys8vCTzcU)

gap 항목을 가장 잘 사용하는 방법은 바로 네비게이션 목록인데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhAOvxvjTDF5BLjN4lv1imF2EVQOxVbKcClkdHacpuBz3NIBzv1X5p9AnBCv5bVQrZjp7x78Wb4-cPCKwNwNUxXI5oPhLXMg_z6xMy96qfmpqNISwFf__DwL3fPianRlhSh-zzj_5_dsnYjbWwqFY4SfUtKdBgOHYhbTbLq-t794GAzk8-ImjRA8u0a1rs)

![](https://blogger.googleusercontent.com/img/a/AVvXsEgufVp2AU8625yvFyX0mNuQJCwc4UoI2DnN2vg3vFzwMN22JZtR_pv7GG7Ve7k0DPP2CVechpCbWDQ_HUxkmRLfxgJ2TlORhJmWRDiyBK6cZ28eyNmXcxFnA74IHYIGSYyB7NeoQPdCyqcCaobgzvFxDf0EjMS_AuUl0Ktm6dR_aJbTWSJ5riiU78Vy2i8)

![](https://blogger.googleusercontent.com/img/a/AVvXsEhd2JP6M5tHexSEpEEoXE0EjIZL2ay2st1NwjE0tsMZqoLVsSHpFn9vD3fjB9borAq9uPjw3DXjGgadMxwl87F94Xf5F4XnxrKHuE4fn85puWg7KOd_Tdc4UYdPU7hVwgeBYc3rm0eDNWWIM4Fhm27Webu8N689bl2rPvOO3LLgQWRKTf_hUomK7i2Lg_I)

위 세 개의 그림을 보시면 네비게이션 목록 만들기가 flexbox로 쉽게 구현되는 걸 볼 수 있을 겁니다.

여기서 gap 항목은 각 항목 사이즈 갭을 지정하는 역할을 하기 때문에 쉽게 멋진 UI를 만들 수 있을 겁니다.

---

### 3-1. Auto margins

Flow 레이아웃 모드에서 `margin: auto`라는 걸 이용해서 항목을 센터에 위치시키는 트릭을 구현했는데요.

Auto margins는 flexbox에서도 매직을 부립니다.

일단 아래와 같은 그림을 볼 때 margin-left와 margin-right를 디폴트 값으로 0을 지정한 겁니다.

아예 지정 안해도 디폴트 값이 되는 거죠.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhPCZ0Z4C9_Ku5s-zBNiboU01Xc9QkVBp4XBnGh2ekISzEDW2CJ5Ki465f5giQIRMNNnkWTWisO9ApuoJKy0fq5V7-Q7A9X15f_AunkbEgsTuCeBIGZc4Pkefl5gHLbP2w_p4qeRpXpg-5pbWy9mpBuPdxp37YcZqOoALB0FAhZuFE_BZ5deGrn7U4Rs0k)

이에 margin-left만 auto라고 지정해 볼까요?

즉, 노란색 아이템의 왼쪽 마진을 자동으로 지정하는 건데요.

flexbox의 알고리즘은 남는 공간의 사용과 관련되어 있습니다.

그래서 왼쪽 마진을 auto라고 지정하면 아래 그림과 같이 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjxgobzlMr-CIt-1WA-ohW7W1JAMzSRn-UGd2OkLa0y1Mmc6QrZY6oHWO4ZImVs538nrVKIQZlLLFoNIjJNH3d95ao72fkYl_-o_sWpaG5HezXSHg8EMkd_q-rprO0MrJnd2jT3Rcyn5h0hUX0PjCQV2WJumDe8zTdhKurtrl21jc-sxKX-ni2zimzAq9I)

이게 왜 그렇냐 하면 flex-grow를 지정하면 flexbox 알고리즘은 남는 공간을 전부 차지해 버리죠.

`margin-left: auto`도 마찬가지입니다.

왼쪽 마진을 위해 남는 공간을 모두 차지해 버린 겁니다.

그러면 margin-right를 auto라고 추가로 지정해 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEj8KKPYRrD7EBuO5ztjTmfmM3dzMRGTtZ7NaNCico_cgZ_Wpj4TGS_OGY3FH8EqoHfWXFVuOgtnR6EPZhoU0x_1PGivSuMQOHUqADbo1egG8_nYi8aje6OmCW_SXxqaBcCC6fkGBITDGdVaKiI3AT35Orp9Q0mNX5SSr4-OJT-_6nd8ExvZMtKe_4Ackyk)

어떤가요?

flexbox 알고리즘이 왼쪽, 오른쪽 마진을 auto라고 인식하고 합리적으로 50%씩의 비율로 주고 있습니다.

그래서 아이템이 센터에 놓이게 됩니다.

이같은 방식의 트릭을 가장 많이 쓰는 곳이 바로 네비게이션 목록에서 로고와 그다음 목록을 띄어서 놓을 경우인데요.

아래 그림과 같이 있다고 합시다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEh76Pxv3KkWRjPAEk_vb4CkRw9Sf3wcriglXMqVCNK0BDoagde5dXF1tHS2kJF5SxFJRxtn6XU7ki7WkYvTEjTkQaIEZxsZUdymfdMwpxQGXRmMJxAdsYg3jaIon_7s08RtUZ0cl8LM57MXcGTJSO2Gmvy_nQpt_8-4md4fmEYJRuABVax5EjRG2QtdYIY)

logo와 a 태그에 대해 margin-right를 0으로 세팅한 결과 로고와 그다음 목록의 사이가 똑같습니다.

이걸 auto margins으로 해결해 볼까요?

당연히 flex-grow를 이용해서 해결할 수도 있지만 auto margins 방법이 훨씬 간단합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgqznMTabv2Eyo_AsHmbaD-IF3e816zLSWfrKTSr_4g8QYrAnkNnAesWS3vikciq-m5Czv9qjhIT1NgCfWU6kJoT_2aqTyhib99awCZS9xup01a0eyuspJD00WYB-5lgRUIJ5uvSnogSRnAZ6FI5rDIWxQzUKqem5RUUY4uvHA3JtjEUUkQcRDrbqnoNNY)

위 그림과 같이 `margin-right: auto`라고 지정했습니다.

그러면 flexbox 알고리즘이 사용 가능한 오른쪽 남는 공간을 모두 차지하게 됩니다.

그래서 위 그림과같이 아주 깔끔한 UI가 나오는 거죠.

이 트릭을 꼭 외워두시기를 바랍니다.

많이 쓰이는 트릭이거든요.

---

## 4. Wrapping

지금까지 flexbox의 거의 모든 걸 공부했는데요.

마지막으로 가장 중요한 wrapping이 남았습니다.

flexbox에서는 아이템들이 각각 붙어서 가로축이나 세로축으로 늘어졌는데요.

`flex-wrap: wrap` 이란 걸 이용하면 이걸 변경할 수 있습니다.

디폴트 값은 `flex-wrap: nowrap`입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEigsWxhp4nKuEUDy0S9MKS0Zpe1yzUFT-5G3EsqV1g2LJ8ss43hqGQMppRMg8MZZ7bZ2cUWUDt4eafgCygfDSkdIrzdKp7dsk38go32Leu6CeopPN3YD4EzM72ZXLuU3YRGFmc5iC3kpzWd7GW_4lpMirorpvWvLlfHx4VlQtv05OZgZJfjSZ2NXH-a-ZE)

![](https://blogger.googleusercontent.com/img/a/AVvXsEiUh7JLXE1gw8wSXfPYfbAuKVKxopmKyS0MOoGrRNYWUyFAdfB5wvq3DV6lTRsWLWK61-4whiZf5fUqKJqrMjR27H56twvJvHBzXXRJntgYEk2B1bgzmYcSqkDqzeqHsiNsekK-xG4NPYk_h63iMjMyMdJv-LlJjxcRWT4oQpQD3zbzes7AMKMvE_eUS4E)

![](https://blogger.googleusercontent.com/img/a/AVvXsEgdjunFtwIE7oiRMy2yayZw4kKUNoMdvWPLrfWLFh3j7oyPduCf7kEalf7aag2j0y-5-49OxSG3hiR1ddwz35vLi3zQU1xgyJvKAtFpnM41Sqpj2eG197Mer7VAtKBRIkObALfFBjKt41_XYyYJcaVjrJrDo8sgbaEA50N98x579u2wG0stkvgIWG6BFtc)

위 세 개의 그림을 보시면 알 수 있듯이 flexbox의 flex-wrap 항목을 이용하면 CSS Grid에서 사용 가능한 레이아웃이 가능합니다.

그럼 여기서 더 생각해 봐야 할 게 있는데요.

wrap 이 되면 아이템이 밑으로 이동했습니다.

즉, row가 한 개 더 생겼다는 건데요.

그렇다면 primary axis와 cross axis 같은 건 어떻게 되는 걸까요?

내부적으로 flexbox는 wrap이 발생해서 아이템이 밑으로 밀리게 되면 밑으로 밀린 아이템에게도 mini flex container 방식을 적용합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEifc8YOa2jWv-qKRJNMpGVTda2X9oCR6XocNiwU3fHEq9rfEzWnp3fpCwvKRiwAKTFoZb1Jx3lIQQha6q_aaKhH8jmZBE14qpy46adpnW_rSTuvrpBwIRbQocHbe5aeaCPZjan-lyBnvPmiOptziH_97cDqDKTb7Mhl5eWIAIZ0kXAnioWkKA8eQ7m6r2g)

즉, 아래로 밀린 아이템들에게도 똑같이 primary axis와 cross axis가 적용됩니다.

그래서 justify-content와 align-items가 똑같이 작동되는 걸 볼 수 있을 겁니다.

align-items가 작동되는 걸 그림으로 구현해 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEjfqDEY0iN_s7jQyAC3Cjsl_LxLcz-qGAf8I5Crdz6eoVJfOi_0pFDjk7wco_oto3TIKlVklJSmC1471Y85E3Lc0zC8LP_aaYB4MLcRqL5PfyjAYXj6a1n72hZblP2Vvg0Fj_lBLHBb5CbIIL9cP_MDZ00F7K3QWOPL3wNRlwQq3P9AgQjr6fjlxtNf1cA)

![](https://blogger.googleusercontent.com/img/a/AVvXsEiBYpA4NCXimNqlRKWCZTsPOMOrvUv2sYs_cvEVB4EYJ6yK9v_fMAxuzVVZbQrsLZ8mujjLYFexVqkYEZr1W6R7uBRMjW-VJ611RlydXFbdPl6DF-UoAokgAcmng7QWEx9cs3-iW22gcBbCgFtwq-M3idl55Dl1BEP2p9EEKTmiEpNkWeFbKFoMZP5uvZI)

![](https://blogger.googleusercontent.com/img/a/AVvXsEhGERK0zUqGybT_L_HTGMD3tZbRsEb8B06e1Da6RIBSl7n9fFF1Yp_I0Xnj2U1Awk8ecLCAnj2K6tClJ3P8Qxe-pCti-ngXBba69F_uW7wpuwcfjoS9ZCeFEmnAzfb-5MB18CevuLP060ZK2Bm3VjtGCAjk84gbmdoMPbL2UnpIDY-e-yj0g0CIfcP7fAk)

![](https://blogger.googleusercontent.com/img/a/AVvXsEgTgyw9go4lrnDSoLdIwPoFY-TPtEicDINMlyqbv6Y1hG-vfwHqYA1-47XqlsI4Npuzq99LpLrFTIXxgBqf1baiwpBQA_16u8EOEl4XqM_j89-80pY5oAQew6WIMnLbeamuWCdUFoa6DXsuBvQy2pDrk_FI2DGrx8n0476O5qn_g28rotmWqd9pUYKvbOM)

위와 같이 align-items가 우리 예상대로 제대로 작동하고 있습니다.

wrap된 상태후라도 각 row가 mini flexbox 환경이 되기 때문에 `align-items`가 원래 의도대로 잘 작동되는 겁니다.

그러면 wrap 상태에서 row 자체를 align 하고 싶으면 어떻게 해야 할까요?

이럴 때를 위해 나온 항목이 바로 `align-content`입니다.

여러 가지 경우의 수를 그림으로 보면서 이해하시면 쉽습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEi2zts-S2qwHUHxU0DkLPB4DHYRO-FcUX8hCiplL981n70JlhRyswOucKlVCSjX90Uy_Ia_GO0GqQ_kz_WzT27p-Oy_MnFagF3R54PbFtjDbhAF-lnuGE9HceXTHQ703LzicMOyl-aU4kEeX37jQhN6IIszz3j7g2FgutZAec9ATAeMtkFnvQYYcw1biSQ)

![](https://blogger.googleusercontent.com/img/a/AVvXsEi0m_Oh72F0Ww1KWPkoue71HeejDfgfD2vt1anpFHLKpvQfZF5-2pYJ1Pg0ciXj2o5J5DMNKlO13xXoPMbE72gGAmo8ZW8qH7gJxFfFosNpmna9h1HNBqO_Bnvt9hsf-I15ZK6eMgmdLDPixRWqc20YiW7ENVZyswmCRamL1v3DXIBiKjwG4vJSYjUtV0s)

![](https://blogger.googleusercontent.com/img/a/AVvXsEjtb5iQ2P2MM3_A4ZnLCO8ja2uxU9GMzapjj66nQXvaWf8uTYZnrnWpxppkWrQ6WmZtU3Zti5PG8ZkALvQXoPp1OOeApQZpbprgNlz_5fP62WWmf2PoD5Us8rCIx2i0uiiHZvzyDdGqkxPQzGOmDVg_OIzQdYH1-E8R-j3suBp2PJbFb5e-infH1kzqSWw)

![](https://blogger.googleusercontent.com/img/a/AVvXsEj1CWZodUkTL3yzJQNDnBjktizc70_Gajyv_oGChrjqMJqfyP-5uh3JLSUka7fhQOBLGJ8aWIjgcRWMfbMYptEQfcw2lkCvRh_5sWoBqwNEE99JO1memH3bhscnQA0DhQiGb9BLxjmNp-g4WAsht2U-E1c3CGxcYxRTdNl5brMcFh15qQ-rjPKHOj_LoZ0)

![](https://blogger.googleusercontent.com/img/a/AVvXsEiKqOD1kRPX4W5EjnjFfqQz1Yf9fo3b48kx5L-ffjgEgnCfZm4AljaBwePE_igfsDw9HGHU5kLNnTKyOnluoh72AcqvfOOgP0VJ4rk6z0JSulnU-9ktxdTVGh4ZtJlo9sE3Hx97fT4trttTclOL2CvU-5IG_JKVeTvNFqLf4egoS1yw7qd7NIYGampAoNg)

![](https://blogger.googleusercontent.com/img/a/AVvXsEgvp5W977H3boXfHpq1c-vmk6DZ3hcs_RH15Yl507yutgvWEXcOiWfBvnUU70AoDMmOmr05riTPVXQE4zT0uAr6uXAjER9IHBFkkngdj7qJq165HXn7Lu0o-N6GpiFLXn_VTG1p7kLiJXuWslF_-tUQS_3vTkORFitDUEz2p7Rh-miyMCdpn9U_7AplN0g)

![](https://blogger.googleusercontent.com/img/a/AVvXsEirmt8urfeiEFfX_QY7g3Fzfk7mZ8uAdAK8pJ2zBeLxg_Yvf0Snv-14_tSnwNCQRm4X1Q6ZtdNHhk8lMzIo49aAsQgtYvS6jShgUPo_Y4SuCuRGWJ0S8prWzdh4OVqvYSqz4yekDx9tP9wtesq9E3DYeJZAuHtcy9OeAVVZokAWemjUVv8rMAYtae3ZhUk)

`justify-content`와 같이 `content` 관련이기 때문에 들어가는 변수가 똑같습니다.

요약하면 다음과 같습니다:

- `flex-wrap: wrap`은 우리에게 두 줄의 "stuff"을 제공합니다.

- 각 행 내에서 `align-items`를 사용하여 각 개별 자식을 위로 또는 아래로 이동시킬 수 있습니다.

- 그러나 전체적으로 보면 이 두 행은 하나의 Flex 컨텐츠 내에 있습니다! 교차 축은 이제 하나가 아니라 두 개의 행을 교차합니다. 따라서 행을 개별적으로 이동시킬 수 없으며, 그룹으로 분배해야 합니다.

- 위에서 정의한 대로 우리는 항목이 아닌 컨텐츠를 다루고 있습니다. 그러나 여전히 교차 축에 대해 이야기하고 있습니다! 그래서 `align-content` 항목을 이용해야 하는 겁니다.

---

지금까지 두 편에 걸쳐서 Flexbox에 대해 알아봤는데요.

Flexbox를 꼭 숙지해서 사용하시기 바랍니다.

정말 유연한 레이아웃을 구현할 수 있거든요.

그리고 아래 예제를 꼭 테스트해 보시길 바랍니다.

Flexbox의 에센스를 연구할 수 있을 겁니다.

```html
<style>
  form {
    display: flex;
    align-items: flex-end;
    flex-wrap: wrap;
    gap: 8px;
  }
  .name {
    flex-grow: 1;
    flex-basis: 120px;
  }
  .email {
    flex-grow: 3;
    flex-basis: 170px;
  }
  button {
    flex-grow: 1;
    flex-basis: 70px;
  }
</style>

<form>
  <label class="name" for="name-field">
    Name:
    <input id="name-field" />
  </label>
  <label class="email" for="email-field">
    Email:
    <input id="email-field" type="email" />
  </label>
  <button>Submit</button>
</form>
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEgvtIp3G9k54nOAOxD-GbQpHfdK9IGzYdluNXJOz4RDbEJJbbwsvWkW9qsE0ICX-nFZdDWKHV70f95O3e412NQeN8JWh4D61tSOGtaNGZ7-4aAoy5wgMc239YeyhtNrGmjULMdBI1Z4rJ5sUJcn43lcrWHBoK7OQDmTtNNlX5sVg-r7ivFuEb2AJbPE654)

![](https://blogger.googleusercontent.com/img/a/AVvXsEhzr6aMdcnUMCTYUsZjudEJ1NcUAVH0Ak_MD6UMnrTYCpxeEkPh_myDm5hIomqxdaLN6Z-m1g2TuH1QIpMq5UqQaXPldMAU6ESitgCQ30wV5K9PzIN-bSBEYSX57azdJCdo0QkvdzhGbMEM5Cnnj8pDPw9N-vaNz29O30cN1l0LM-omN8v16XyTQ7UVLcw)

끝.