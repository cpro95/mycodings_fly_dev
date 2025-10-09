---
slug: 2023-02-07-what-is-locale-in-mac-and-linux
title: 맥, 리눅스 같은 POSIX 기반 유닉스에서 쓰이는 로케일(Locale) 알아 보기
date: 2023-02-07 11:31:49.752000+00:00
summary: 유닉스에서는 로케일(Locale)은 국가 및 언어 설정에 쓰입니다.
tags: ["locale", "로케일"]
contributors: []
draft: false
---

안녕하세요?

윈도우 사용자라면 로케일(Locale)을 잘 모르실 텐데요.

맥이 점점 많이 퍼지면서 POSIX 기반의 유닉스 운영체제에서 쓰이는 로케일(Locale)에 대해 알아둘 필요가 있습니다.

## 로케일(Locale)이란?

로케일은 별다른 게 아니고 그냥 문자열입니다. String인데요.

우리가 사용하는 운영체제 즉, 맥이나 리눅스에서 사용되는 언어 또는 지역 설정, 그리고 날짜, 화폐의 출력을 어떻게 설정하는지에 대한 일종의 기준인데요.

POSIX 기반의 유닉스 체제라면 같은 형식을 씁니다.

그래서 애플 맥 OS 같은 Darwin 계열 운영체제들도 POSIX 호환을 위해 같은 형식의 로케일(Locale)을 씁니다.

리눅스야 당연히 POSIX 기반 유닉스 체제기 때문에 당연히 같은 로케일(Locale) 형식을 씁니다.

로케일 설정은 맥이나 리눅스의 설정값에서 GUI 형식으로 바꿀 수 있는데, 좀 더 간딘하게는 터미널에서 쉽게 바꿀 수 있습니다.

설정을 어떻게 하냐에 따라서 한글로 나오느냐, 영어로 나오느냐, 통화는 어떻게 표현되고 날짜는 어떤 형식으로 나타나는지 결정됩니다.

## 로케일(Locale) 예제

![locale_example](https://blogger.googleusercontent.com/img/a/AVvXsEiK4MS2cdBh-Qr8jzuQA4USWsyC7uJxGYFo00nT4c3roQ4EIPetEL_noljSDVVcvD_u7moDlSOnavmCWYCQsEFDtCaDk3d2w5YTw_GNXuVokPrULHiRFnTGrAqFg357ZgDAylHa9vieMJMy28UGryfZA0AZtF8dlUOS4pw5jNET2ay6kiM6hwx4Si9s)

위 그림을 보시면 쉽게 이해할 수 있는데요.

먼저, 언어와 지역, 그리고 문자열 세트입니다.

이때 맨 앞의 ko는 한국어(한글)을 즉, 언어를 의미하며, ISO 639-1 표준 형식을 따른다고 합니다.

두 번째로 언더바(_)로 구분되는 KR 값은 지역을 의미하며 ISO 3166-1 표준 형식을 따릅니다.

마지막으로 점으로 구분되는 문자열 세트(codeset)는 EUC-KR이나 UTF-8과 같은 문자 인코딩 방식을 나타냅니다.

즉, ko_KR.UTF-8는 한국어(언어), 한국(지역), UTF-8 인코딩을 뜻합니다.

예를 들어 영어는 en이라고 쓰는데 캐나다, 미국, 영국, 호주 같은 나라는 로케일을 각각 어떻게 표현할까요?

en_CA.UTF-8: 영어, 캐나다, UTF-8 인코딩
en_US.UTF-8: 영어, 미국, UTF-8 인코딩
en_GB.UTF-8: 영어, 영국, UTF-8 인코딩
en_AU.UTF-8: 영어, 호주, UTF-8 인코딩

이제 쉽게 이해하셨나요?

## 터미널에서 locale 명령어 사용해 보기

맥에서 locale 명령어를 사용해 볼까요?

![locale_in_mac_terminal](https://blogger.googleusercontent.com/img/a/AVvXsEhk8HMsHYW_CUPcYi5iKYZg_x118mkni5YzMD-3FgNPiRsQi6vehCRHg79I2eHo7lrZX638cma22UadEH3WCs561QaUxDhhLRf2vFKmB7IU7yrEj04qeCGhsK4uaSKqfGXrop8Y_e8fkcHHvStVV3MfvFzAdEZrLQJCbztwZitE-M1dIYHgapT_ESRL)

위와 같이 여러 가지가 나오는데요.

하나씩 살펴봅시다.

### LANG
운영체제가 표시하는 언어 관련입니다.

### LC_COLLATE
collate란 뜻은 정보를 수집 분석하더라는 뜻인데요. 여기서는 문자열의 정렬 순서를 결정하는 겁니다.

### LC_CTYPE
CTYPE은 문자 분류, 글자 수, 대소문자 구분이 되는 로케일입니다.

### LC_MESSAGES
메시지를 표시하는 기준이 되는 로케일입니다.

### LC_MONETARY
당연히 화폐관련 기준이 되는 로케일입니다.

### LC_NUMERIC
숫자와 관련된 로케일입니다.

### LC_TIME
시간과 관련된 로케일입니다.

### LC_ALL
모든 것을 종합하는 또는 모든 것을 포함하는 로케일입니다.

위엣것 말고도 로케일은 시스템에 따라 여러 가지가 있는데요.

터미널에서 다음과 같이 명령어를 입력하면 자신의 시스템이 지원하는 로케일을 쉽게 확인할 수 있습니다.

```bash
locale -a
```

## 로케일의 우선순위

처음에 로케일이 단순한 문자열이라고 했는데요.

설정하는 것도 터미널에서 쉽게 할 수 있습니다.

먼저, 제일 쉬운 LANG 부분만 다른 걸로 바꿔 보겠습니다.

```bash
export LANG='zh_CN.UTF-8'
```

`export` 명령어를 쓰면 됩니다. 그러면 현재 터미널의 Shell에 관련 변수가 저장되는데요.

LANG를 중국어로 바꿨습니다.

이제 다음과 같이 해볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEhYKsTrAtHcjE-xFUyFdLhJoteDeE6K7EVOkR7qBxpOkDe_SaRhlq5UOe0tjsSLcg6ig7y_SYmzY8loyPs0x4ehwPVApCBi4l8Z6af2UjX2-wODeuQvL4gzg9O3KLmHV4AX-NuavVz-fCd0AjbCYKUIqlPt2XyugKUillOrdnYYl6dyVJpmwasdqRnq)

어떤가요?

제 맥이 중국어로 바뀌었네요.

LANG은 우선순위가 두 번째로 높은 건데요.

```bash
➜  ~ export LANG='zh_CN.UTF-8'
➜  ~ locale
LANG="zh_CN.UTF-8"
LC_COLLATE="zh_CN.UTF-8"
LC_CTYPE="zh_CN.UTF-8"
LC_MESSAGES="zh_CN.UTF-8"
LC_MONETARY="zh_CN.UTF-8"
LC_NUMERIC="zh_CN.UTF-8"
LC_TIME="zh_CN.UTF-8"
LC_ALL=
```

LANG만 바꿨는데도 모든 게 다 바뀝니다.

그럼 다시 한국어로 바꾸고 LC_TIME만 바꿔 볼까요?

```bash
➜  ~ export LC_TIME="zh_CN.UTF-8"
➜  ~ locale
LANG="ko_KR.UTF-8"
LC_COLLATE="ko_KR.UTF-8"
LC_CTYPE="ko_KR.UTF-8"
LC_MESSAGES="ko_KR.UTF-8"
LC_MONETARY="ko_KR.UTF-8"
LC_NUMERIC="ko_KR.UTF-8"
LC_TIME="zh_CN.UTF-8"
LC_ALL=
➜  ~ date
2023年 2月 7日 星期二 21时05分51秒 KST
```
LC_TIME만 바뀌었고 date 명령어로 중국어로 표현된다는 것도 확인했습니다.

그럼 가장 우선순위가 높은 게 뭘까요?

바로 LC_ALL인데요.

간단하게 LC_ALL을 바꾸면 모든 로케일이 바뀝니다.

아까 locale이 위에 표시된 것 말고도 많다고 했는데요.

그 모든 게 바뀐다는 겁니다.

최종적으로 LC_ALL이 우선순위가 가장 높고, 그다음이 LANG이라고 보면 될 겁니다.

실제는 LANG을 많이 씁니다.

그럼!

