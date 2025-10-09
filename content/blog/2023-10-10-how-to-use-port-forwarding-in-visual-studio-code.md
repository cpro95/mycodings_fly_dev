---
slug: 2023-10-10-how-to-use-port-forwarding-in-visual-studio-code
title: Visual Studio Code에서 포트 포워딩하는 방법
date: 2023-10-10 13:06:20.375000+00:00
summary: Visual Studio Code에서 개발 서버를 포트 포워딩하여 팀원들과 같이 디버깅하기
tags: ["port forwarding", "visual studio code"]
contributors: []
draft: false
---

** 목차 **

1. [Private 방식](#private-방식)

2. [Public로 전환하기](#public로-전환하기)

---

안녕하세요?

VS Code에는 로컬로 실행 중인 웹 서버에 대해서 외부로 포워딩할 수 있는 내장 포트 포워딩이 있는데요.

VS Code 버전 1.66 이상에서 기본 제공하는 기능입니다.

오늘은 이 기능에 대해 알아보겠습니다.

이 기능을 간략히 설명 드리자면,

여러분이 로컬 머신에서 호스트 중인 개발 서버를 실제로 인터넷 어디에서나 접근할 수 있는 URL로 제공해 준다는 겁니다.

Private 방식으로 포트 포워딩을 하면 GitHub 계정으로 로그인해야 볼 수 있고,

아니면 Public 방식으로 포트 포워딩을 설정하면 실제로 인터넷에서 누구나 볼 수 있도록 공개 서버가 되기도 합니다.

막말로 VS Code의 이 기능으로 집에서 낡은 노트북으로 공짜로 홈페이지 무료 호스팅을 꿈꿀 수도 있는 거죠.

사실 이 기능은 개발팀에서 개발할 때뿐만 본인이 만든 웹 서비스를 팀원들에게 원격으로 공유할 수 있게 해주는
게 원래 의도입니다.

그럼, 본격적으로 이 기능에 대해 알아보겠습니다.

---

## Private 방식

일단, 제가 공부하려고 만들었던 mymovies Remix 앱을 개발 서버로 돌려 보겠습니다.

먼저, 개발 서버니까 "npm run dev"를 실행하면 됩니다.

보통 VS Code에서 개발 서버를 돌리려면 Ctrl+J나 Cmd+J로 커맨드라인 창을 여는데요.

여기 보시면 4번째 TERMINAL 다음에 PORTS 라는 탭이 보입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEinTgiNfNpd8-Bl42EobwtP1qdetfdGkCyfUItByBlbd8CSz4aQTBRSS4GCCjLh_S6rp4tzHi19UNNCJGSmf28M4kBjCWxIzq5ZWQw99ocHf05M0tRsyFgvXpCq0nfH4ub9zZSgIkr6eLnF1RoAcpXjq7qROBIkszq5kfKRPH19WWf3Et624ycx4x1HvHE)

이게 바로 포트 포워딩하는 버튼입니다.

이 버튼을 누르면 아래와 같이 나오는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhx0m3ifdxPwkhvRh8jbrHIXNcZyhXVm4TNIu-DxBFqUrsxA15sdxHlLa03Pvm5g--kZOVE-goa_DcowlRT9kU50jFyl98YqX6an3bd613GMkxULDM6t597lZqAZy3Fn3R634bW1eXAIlGSzVur1QN5511132Ja7n-yARD15uk-CxjeHaONUhW02tgBxqw)

포트번호를 입력하는 칸입니다.

Remix 프레임워크라 개발서버의 포트는 3000입니다.

3000을 입력하면 Github 연결하라는 화면이 나옵니다.

VS Code에 Github 계정을 연결했다면 이 화면은 안 나올 건데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgTUQswWDxwKfBCuJ4J0ztycktbAYWrD7pssw8gHMtVpVojMe6VDZHqvhtmo9_msf75FAS8eDc9DALII-sfYlCHQXsYjQ7Gyb9oAa5UHDqUgKapIRlvu9j-1vGD6wsyHlF_mVo7LG0J_4o_TJAbnnnVlocWivEKE48zgkQtJ5hhOzzbqpWyLohMLbymRiM)

일단 아래와 같이 브라우저에서 VS Code와 Github 계정을 연결하라고 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEikLvxUOdI9po0mFyXhPr8Tx9TmZ-N_o_GTNcjva-1w9BNppCA7asIE8loiXuqwbUNxQCqPAjazl9e3Z1qGk4Fwp5-dzM57vuDtkD8pn2CBXXOBCC4yxzR9zG9RqaejtQpyu79Fv-qNBz6lfsz1Qz5OAlNfgjcJYKzyPW3Kjdvf7Eq5EaAfkNJvXJoIGnY)

Github 계정을 연결하면 포트 포워딩이 설정되고 아래와 같이 나올겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjOwkmDAHKOvi2g4Vpt105t8Cdwg6QVOU84THiWJSueWoUZI3X7wJvluDVmHX7IPskqrCwG0KPLxBxY01cvUQ3wskHOeKzIzssAJTyxdHXBo6qJvnNRXw9CkaiuFRaaGLI3Ue-XU8JYxtNCYINyXPMQ1fO5mEUUKExhqQmS7na6bhCEXWzkHz_fJ-s2jDw)

위 그림에서 https 주소가 보이는데요.

devtunnels.ms 라는 아마도 Microsoft의 서버 같은데요.

여기서 개발 서버를 https로 제공해 줍니다.

지구본 모양을 클릭하면 바로 브라우저에 연결됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjhKbhPjDt7TSJz8DBo_ZD3UoF1tC9I4sM9v201er3YnMaATJemHAaqX7EgxMCeKg4-9OKiPRxrQfdpbQDfj2Di3BZJCavAwU7WfftpsTD0DuI3plsExdKDiFUJbNRyYos1-8iKz8C7EDzTYPhEcUIbkc9Lv0S5-5ZxcwU6VZf0ZHnZbVzrzz4XEM_9L-8)

저는 위와 같이 나오는데요.

브라우저에서 개발 서버가 https로 돌아가는 게 보일 겁니다.

---

## Public로 전환하기

지금은 포트 포워딩이 Private로 Github 계정이 있어야 하지만, Public로 변환하면 아무나 볼 수 있는 순수한 웹서버 역할을 할 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjOwkmDAHKOvi2g4Vpt105t8Cdwg6QVOU84THiWJSueWoUZI3X7wJvluDVmHX7IPskqrCwG0KPLxBxY01cvUQ3wskHOeKzIzssAJTyxdHXBo6qJvnNRXw9CkaiuFRaaGLI3Ue-XU8JYxtNCYINyXPMQ1fO5mEUUKExhqQmS7na6bhCEXWzkHz_fJ-s2jDw)

위 그림에서 오른편에 Visibility의 Private 버튼을 오른쪽 버튼으로 누르면 아래와 같이 나오는데요.

여기서 같이 Port Visibility를 Public로 고르면 공개 서버로 전환됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiEh5myBAJr3aJp8PryCvgrt5UumnrnFBnM3f9Gqf4jV_iRPffFgI6Zp4c8dsULiO5y4Ebj4_VZGPLq753bww_XcQmBR9cQdlxP73jU73JdZjTtPalDFPWpigBcDbxAQzVQ9EfyfBt7kVTMdfKRrRJ9FaqnP-yl1UvwPBM2_oIRYyXEb26xus2UciNMZ4I)


Public으로 공개하면 아래와 같이 경고가 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEg_T8x0YZi5hnCwE0ILDIFZk0F5PAny8dBprVk_fEMrkZskA2awHuZI1sCEpoSdIWB5_Nd7_GC6OlEzOEOmL21RA8wWpgdKE3NKdaVYOfVppk1r20IEZ9U0vDAhA2ecWT1LLjuUmUrp8zD4Rj4BiITSkSB6cPXYklJ4DiICapDuaOzHQ7kI9lHPmlSZAx0)

그리고, Github 계정이 로그인되어 있지 않은 브라우저의 사생활 모드로 들어가면 아래와 같이 또다시 경고가 나오는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgbMTKlFgidJQtRBEUWNuTyorSRCf8d62jf0jlfgaIhzEG2P39VxHPTKHXUVGfpOl_dhcqncqSbpoDaWQhel7kXijzXqpRFFkVz2CypNe2mzgI463hOorPxfBlQkvyLP-7DrnyM1pxjZZdKgF5KxewElHH9gI_PcpuJ7Rf8XaQaGVk3fsOHavB0GXvsjBA)

계속 버튼을 누르면 아래와 같이 사생활 모드의 브라우저에서도 Github 계정 로그인 없이 볼 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjaG-JjAetgeMT-o1VerVyk85QXAMsTqt223zibFrxhCnvgoUmAdgvKIdtzrMCsdWIjYeE6BRA4b0xwgrRI5T8LWszbl4G_5omZF3sPsW9EdBGIslqnw30PWIA5MJJmcrWc8svl7hkPDwBLhiRyIFACZ8oZvpxKGJMu5RBt8by11N1v6fCXTemp5-67OlU)

![](https://blogger.googleusercontent.com/img/a/AVvXsEjLeeZKm03gcXJKm8oSlMSzt7AhWC_BmD4iKIZLGsAqZObRZfDFj57G5IGmIFU8I5ke8PIPpOI6Q3QFXQuN-5LNN80eQT5b7zzntcrgMVUKxGLmF82m7fSqCdW-F9mWsbbAJqtKgJ7YDBcjdSYKd1J8OPPrSKt4r8uSz1td5Tve7rymCz0qVMDG8NcBKdI)

제 핸드폰의 LTE 모드에서도 테스트해봤는데요.

실시간으로 홈페이지를 수정하면 바로 제 핸드폰에서도 반영이 됐습니다.

단, 핸드폰에서는 새로고침을 해야 합니다.

이 방식을 이용하면 실시간으로 팀원들한테 자신이 만들고 있는 작업에 대해 같이 디버깅할 수 있는 아주 강력한 기능인데요.

앞으로 자주 이용할 거 같네요.

그리고, 포트 포워딩을 삭제하는 방법은 포트 번호에 마우스 커서를 가져가면 X 모양이 나오는데요.

X를 누르면 포트 포워딩이 삭제됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhhFp-y76j_o6YVCyiE5CmVrLc_niJa1DBQiu3wvK5I658KbWUq7rTeoqfL0wwxG4nHtwdy9etZJpO0RCIFH0zY1OK2Wr2V18fMpMFCPEO36FPUBQay7_Bshza391cYmhCVjg7FwOVomm83TPFEAKd-7JzEvwYtMuDTR33kkV21d4-r92QilY38TGblkJ8)

그리고 개발 서버를 종료하면 됩니다.

중요한 점은 무료 웹 호스팅의 악용을 막기 위해 VS Code 팀에서는 제약을 뒀는데요.

바로 개발 모드에서만 이 기능이 작동한다는 겁니다.

참고로, 이 기능 외에 그냥 같은 네트워크에 있으면 아래와 같이 개발 서버를 돌릴 때 `--host` 옵션을 두면 같은 네트워크에서 다른 컴퓨터에서도 접속할 수 있습니다.


```bash
  ┃ Local    http://localhost:4321/
  ┃ Network  use --host to expose
```

Vite 를 이용한 개발 서버면 "package.json" 파일에서 "dev" 항목에 "vite --host"라고 "--host" 옵션만 주면 됩니다.

```bash
  ┃ Local    http://localhost:4321/
  ┃ Network  http://192.168.29.145:4321/
```

그러면 위와 같이 제 와이파이 네트워크에 노출이 되는 거죠.

그럼, 많은 도움이 되셨으면 합니다.





