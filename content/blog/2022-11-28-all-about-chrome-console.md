---
slug: 2022-11-28-all-about-chrome-console
title: 크롬 console에 대한 모든 것
date: 2022-11-28 03:53:19.207000+00:00
summary: 크롬 console에 대한 모든 것
tags: ["console", "chrome"]
contributors: []
draft: false
---

![](https://blogger.googleusercontent.com/img/a/AVvXsEgOult6PKLPKe9Fn0tFnGhIdxLl79BDK92-C_Fz1Kkv0wsyqNbhiRU7rDlL9cnCKKkWIISDNe4zAwm5PjZf_uXq-Xj6EGuzriUt8y2w0B71svBW5xMGxo3SGkn0OOoewQ_nmbj8OeaS5FwSjk6hmpB2dTZqudmsJqxWArRfROGF9cACsvHN1YBan8F2=w320-h320)

안녕하세요?

오늘은 크롬, 정확히는 크로미움 엔진에 있는 console 명령어에 대해 자세히 알아보겠습니다.

우리가 가장 많이 쓰는 명령어가 console.log() 명령어인데요.

사실 console 객체에는 console.log() 명령어 말고 여러 가지 메서드가 존재합니다.

크롬 검사창에서 console.log(console)이라고 쳐서 console 객체애 대해 출력하게 해 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEig-fQY9eNw-1ZMUYvgVi9qPZisHM7nIsWwvLArBmLzdcc9L_It_a668g-QNOXNmA6Nccm6rTnL5xMn9IpWWd4EEZTu_trTVqbj5DOyEvUOnoWCvrvZx1CiEJyamvh8nOp-nIntFniUSaE-KECMf2pDQjMx9cghVUl0xQwzVpZduwz5VpDpoJlyi9Vc=w400-h380)

위 그림을 보시면 console 객체에는 여러 가지 메서드가 존재합니다.

그럼 대표적으로 몇 개만 살펴보겠습니다.

<hr />
## console.table

console.table() 메서드는 객체나 배열을 아주 보기 좋게 출력해 주는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjlCcj60Udj1vpFgfhiaYvr1eGVddQTL08DBnFPtL66p4xtPMkylsrVsdSEdCo-p7d3W6wtEOqFnx8-niTP_qFfgrviEFp-a_u03G7XnBKMxHb3bBxiLkWidl6MlRhDIoi1TXFalMnws05WFuMby6yCw2fsPrRSY6RTQNY870Ae67G33rANbj2CI0E8=w400-h246)

위 그림과 같이 아주 깔끔하게 표로 보여주고 있네요.

<hr />
## console.group()

console로 정보를 내보낼 때 그룹을 묶어서 표시할 수 있는데요.

group, groupCollapsed, groupEnd 메서드가 같은 종류의 명령어입니다.

다음 예를 보시면 쉽게 이해할 수 있을 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgp_VvpXCSR3b34EZsxHJFLzn5tOXVa9O-ldxJ6YEc52xEN2qSAqwYtk2_CnDrXyvGBKdA73ERwIoCaxsR2ov1hJJKmlKeMLv0vVsM6P0dHgsBjmtZbaIkDx_OUJBVKMvvCKQBO41-Ix7wZpSXPcYwGO8i1eZVPMy_eElCXeDBbN2lGUN_0ggzn0CIx=w640-h408)

<hr />
## Log에 스타일 꾸미기

console.log()에 CSS 스타일도 꾸밀 수 있는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjMeniraoX79Vd29kMKVE0eXQuzg3pPbMKhidyI-vS6u5nn-6wWD412oryJZpM9nKkRJH2uE_xeiH8xoHYNAVamCTfjUvCt8mqUBVoEgvim2Ln0TXCrd1u54IHKnffGtZEUAw7yLsn5GK8PZLA9gn8VnckWVXQFPyErjcIQD8pB_FuWFh_LVyKW6SUH=w640-h120)

위와 같이 하면 좀 더 눈에 띄는 console.log()를 할 수 있을 겁니다.

<hr />
## console.time()

console 객체에는 time 메서드가 있는데요.

바로 벤치 테스트를 위해서 시간을 재는 명령어인데요.

이 time 메서드는 시작 부분을 나타내고 timeEnd() 메서드가 끝을 나타냅니다.

예를 들어 보는 게 가장 쉬울 거 같네요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgOC0RmMAgaozoWs5MtiAVTNmoiw46Fb199nupG5eZuKLmGRmyIWFjrx3Ax4OACEqic_B-5gGf254l4s-UwVJTcLxRDToxZvZAG0_iygdKRFa8AhcE6ZUsJN9tGRfRtMzVpetCj09WR08h-vjAVKQHA4PrFN5AwRuLZQjh86iYM9Ydy0mOyrZZ5REH3=w640-h130)

위 코드를 보시면 for 루프의 총 걸린 시간을 console.time()과 console.timeEnd() 메서드를 이용해서 구하고 있습니다.

<hr />
## console.assert()

console 객체에도 assert() 메서드가 있는데요.

이 메서드는 특별하게 첫 번째 인자가 false일 때만 두 번째 문자열이 출력되는 형태입니다.

그래서 에러가 발생한다고 가정하고 에러 메시지를 출력할 때 아주 요긴합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEifc2mWaxe8xn1i4zg--DwrZ-r6WykTocmkc5U1AutXn-IQtNvq_RKAypGfGpv23b94i9_m2ncugYBJIPQ-w82pYmANHiwmBPmERm3VcfE6ct9K6osVPcrc91YrbsQzojVSw-wM7QlNcTCxoP0BZCZSGgrJjkBYsdA8amvymg4IRNc0qr3Hf8Bx9vW5=w640-h244)

<hr />
## console.count()

for 루프가 몇 번째 돌아가는지 쉽게 셀 수 있는 명령어가 바로 console.count() 메서드인데요.

참고로 중간에 count를 리셋하는 countReset() 메서드도 존재합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhOvMf9UMSTa-l0Jx9jLJo8Uxs8KO5FsGXr2p2Wo15WUv3nSDBYbxXkxS4Lc8bm8W8tfXk4ssO5needMTkqe8pxa3jAFPkJL-rCBZGr_WIZMpIWDWeoGhoLngGeYjuti_6Uo6MekQqxoHZEqt0KJwFE4D-kIh8skMwoG15_1BSbW-wBsh_eZTofIdAe=w640-h272)

<hr />
## console.trace()

이 메서드는 여러분이 컴포넌트가 아주 깊숙이 들어간 경우에 한번 써보시면 호출된 계층을 자세히 표시해 줄 겁니다.

또는 아주 어려운 함수 안에서도 호출해 보시면 이 함수까지 도달하는 계층을 쉽게 보여줄 겁니다.

<hr />
## console.dir()

console.table() 메서드와 함께 console.dir() 메서드도 객체나 배열을 볼 때 아주 쉽게 보여주는 메서드인데요.

특히 객체를 보여줄 때 효과적으로 각 항목을 확장, 축소할 수 있게끔 보여줘서, 디버그 할 때 아주 좋습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEh2WwhQJjJuaL53K9CdHNP9bcqpi4fLdJGuUjgiusb_W4SU5MX0kdCsPWTqX6QHR6OoYpE4GrRB1eSTIif0hgK539jgpBUns7d7eBJPkitmAv3CpWfZXN0_vWG_tRzkfqLRICy_96oGiPsMO-DQ--L1T_WT4QKfjfQJSf0cOqQMBmFUZZSgnmYjr3Y1=w640-h635)

<hr />
## console.debug()

이번에는 제가 그토록 찾던 메서드인데요.

우리가 코드를 짤 때 보통 console.log()로 디버깅 문자열을 출력하는데요.

production 모드로 배포할 때는 console.log()를 찾아서 다 주석 처리하는데요.

이걸 편하게 해 줍니다.

console.debug()로 출력하면 development 모드일 때는 출력이 되는데 production 모드일 때는 아무것도 출력하지 않습니다.

그래서 아주 유용한데요. 꼭 써보시기 바랍니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiYzrkQ5-mf-POJRWNhIXYIde3dn_XFUN_t-NiBLSMrfnEaeT4XeqNsgFWBnxCHmMIzyOHM3X3FC1GOKk4XNZ_1aKuPfoyX1sjx4FG_vOgWObP4V7L3RMpV1BexB5IrOoPLFp6dBb0UJ_i13KYA9oOeWuhJf2v0aDp3vY0bPdOmgIvUSCosWEZj30Su=w640-h51)

위 그림과 같이 크롬 검사창에서 console.debug() 했을 때 아무것도 출력되지 않았습니다.

크롬 검사창은 production 모드이기 때문이죠.

<hr />
## logging level

console.log()는 문자열을 보여준다는 의미인데요.

이 밖에도 info(), warn(), error() 메서드가 존재해서 로깅하는 레벨을 보여주곤 합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEj3eINKUNmaMlOanMQY5N4RgASPu9Jwd6mdekcJxOqTDYBoIrbdGUsRXoTickKoOwdAx_sDjeFtPOVP2HPvSQ2jxuwm_J_XCitcUtn1FOh3L9NcvFrmfqV3KDIptySLlqDHmRgWRAcXwTG5lCcZkqT4sRK3O20Btv0_MRHVD3VIpdxxT9k4Jz6H5R2K=w640-h222)

위 그림을 보시면 Warn과 Error 부분이 눈에 확 들어오게끔 로깅을 해주고 있네요.

<hr />
## 객체 여러 개를 출력할 때

console.log() 메서드로 객체 여러 개를 출력하는 방법입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEibHX5nC6zbwxmgmwL99ImB217x1b9Y-lawAnkSMobw-_QndT2jArBno6LDytXttKJG_o_K5AqJNiRHDpVPRcE8TjPoBNOPAxTOmD83gQqAxts9-fE5U8ZHfCRCS81pTZ6qLRgmPgE4ru4eOIKk_NCoP5VRCmqBFLC5YlxS3vbdRQnN8DS-cWFOJoHp=s16000)

위와 같이 객체를 object deconstructing 방식으로 전달하면 됩니다.

<hr />
## 로깅에도 Format 존재

C/C++에서 printf() 함수에 format이 존재하듯이 크로미움 console.log() 메서드에도 format이 존재합니다.

- %s - 문자열
- %d / %i - 정수
- %f - Float 실수
- %o - Use optimal formatting
- %O - Use default formatting
- %c - Use custom formatting

![](https://blogger.googleusercontent.com/img/a/AVvXsEhDVinJ4HE3lSkkPi-IFf_b7vl7yRKkRilqE8pZl0xHJ5cbBcc5HR3lNBWXmM_UEMPpZZ4yBCfzlntJzMwu14hAcm16hHKQK4sCEWhjBnctHjQZhd1ozyUeWLKiv7pkjXk6_Cx0N5t496vQbMuZSTfVdUicCMLm4mF6bZ-GakPkjjtnH1TO5kJViAC2=w640-h71)

<hr />
## console.clear()

마지막으로 콘솔 창을 지우는 clear() 메서드가 존재합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgkuqi0nHafHl_QhTW8I6dHl9sScm3HzYH7Dq4p8lm976Nw2RUUj2WJxvkAwcXMtGKvc0auj3I5saljIsqzMp2RsukekIZMuLCWkK4V3IRtzd4hmHW7P5ZPhYgTzO5KqLjg12FHiQivHJ6eqN-wP4JVrzTAaT7RCYvDhHISVIq7fBvWtCAcCKNA3hbY=w640-h74)

console.clear() 메서드를 실행하면 위 그림과 같이 콘솔이 클리어 됐다고 나옵니다.

지금까지 크롬, 크로미움의 console 객체에 대해 알아보았는데요.

여러 가지가 있으니까 꼭 상황에 맞게 사용하시면 될 거 같습니다.

그리고 아래 링크는 console 객체에서 우리가 다루지 못한 부분을 좀 더 상세히 설명해 주고 있으니 한번 읽어보시는 걸 추천드립니다.

[console full document](https://developer.chrome.com/docs/devtools/console/utilities/)

그럼.
