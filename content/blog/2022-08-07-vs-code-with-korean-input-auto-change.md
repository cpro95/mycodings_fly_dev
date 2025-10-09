---
slug: 2022-08-07-vs-code-with-korean-input-auto-change
title: VS Code Vim에서 한글 세팅 제대로 하기
date: 2022-08-06 15:57:21.637000+00:00
summary: VS Code Vim에서 한글 입력 후 ESC키를 눌러 명령 모드로 전환 시 자동으로 영문 키보드로 전환하기
tags: ["vim", "vscode", "korean"]
contributors: []
draft: false
---

안녕하세요?

이번 시간에는 Vim 관련 블로그입니다.

VS Code에서 Vim을 사용할 때 한글 사용이 많이 불편한데요.

어떤 문제가 있냐면 바로 인써트(Insert) 모드에서 한글을 입력 후 ESC키를 눌러 명령(Command) 모드로 돌아갔을 때 아직도 키보드는 한글 모드라서 hjkl 같은 커서 키가 반영되지 않고 한글이 깨져 보이는데요.

사진으로 보여드리면 아래와 같은 문제가 발생합니다.

![mycodings.fly.dev-vs-code-with-korean-input-auto-change](https://blogger.googleusercontent.com/img/a/AVvXsEh7FVU5-d0cSDWynmj4-NDrR0efPrBYO_W5A7RQQDhrpdQe-96IZNEuGvDmMRy1VLjNZlNl7W6a0t-fYJQvvcFR0pRKQGm2FFGpIdTrC7BDgQKAsp-Xy99TqZA08tvcLtVjfVUhQYVEvkimh0LGED0YC4AMskaNRKzJsylN9hI44OAcwrUDvf6Snb_i=s16000)

일단 위와 같이 한글로 글을 썼고 그다음 ESC키를 누른 다음 hjkl키를 이용해서 커서를 이동시켰을 때 아래 그림처럼 한글이 깨져서 나옵니다.

![mycodings.fly.dev-vs-code-with-korean-input-auto-change](https://blogger.googleusercontent.com/img/a/AVvXsEg5mHqAmr6NFXh32cS6RHF4zjXoiDliEgiyAgkIqi5LdIHngyOHvAGHSAjTezb_Bf8H404oyUfjmw2lqTqQ9nvwgodn3qw_nu3-sJhT6av_1eTM_U6DrrwFrTS5EBTM0tAC7ulXd-3NlMJ8-4P94Q2_1191KH9JDGaytK9ufeg3SBDQ7asbFIwAkYpA=s16000)

왜냐하면 ESC키를 눌러 명령(command) 모드로 돌아왔어도 아직도 컴퓨터의 언어 입력 선택은 한글로 선택되어 있기 때문입니다.

이게 사실 굉장히 불편한데요.

그래서 VSCodeVim/Vim Github 사이트에서 제공해주는 Input Method 관련 정보를 이용해서 이 문제를 해결해 보려고 합니다.

[해당 주소](https://github.com/VSCodeVim/Vim)로 이동해서 중간쯤에 보시면 아래와 같이 나올 겁니다.

![mycodings.fly.dev-vs-code-with-korean-input-auto-change](https://blogger.googleusercontent.com/img/a/AVvXsEixW_pOvrpgCG3HsZRxtmSwxCTDUZ1A8F_u8yULMrb8MScqKDQCFF-HSOK3etpGyfx0YU9zYXGhy4dJNuZ07LEvi5Cfwln2UyEktjNOd-9U2J5XaTJ8niDP1tm9_gLNJUkK8cQSXwFBsCAb9ixp4iexSOdQgJZ71l1rOFFLSe2af_sh3QifCTzgsHdn=s16000)

텍스트 찾기로 "Input Method"라고 치시면 해당 위치가 나옵니다.

이 방법은 그냥 단순하게 ESC키를 눌러 명령(command) 모드로 들어가면 무조건 영문 키보드를 선택하는 방식입니다.

명령(command) 모드에서는 무조건 영문 키보드여야 하니까요!

그리고 인써트(insert) 모드에서 마지막으로 선택된 키보드 세팅을 기억했다가 그다음에 다시 인써트 모드로 들어갈 때 예전에 기억해둔 언어의 키보드 세팅으로 변경해 줍니다.

처음에는 불편할 수 있는데 써보면 금방 적응해질 겁니다.

자, 그럼 본격적으로 설치에 들어가 보겠습니다.

---

## MacOS 사용자일 경우

일단 MacOS를 사용할 경우는 써드파티 프로그램을 먼저 설치해야 하는데요.

바로 [im-select](https://github.com/daipeihust/im-select#installation) 프로그램입니다.

위 주소로 가면 아래와 같이 brew 프로그램을 통해 설치하라고 하는데요.

일단 설치하겠습니다.

```bash
brew tap daipeihust/tap && brew install im-select

which im-select
```

![mycodings.fly.dev-vs-code-with-korean-input-auto-change](https://blogger.googleusercontent.com/img/a/AVvXsEgH1v4L6fNQcZOUimV-fDjWasGfMobnsitd_yk9iqCGJqYhqlevGTG11WTrg0nwfcihX8aetmnJZJEms95TWuzXr6EyZopJ9iwNcpBrL4jaGMk9G8w4skQ8r9CirPmVO8Bv9O-qo6q4tiQlvIlG3OCs4QdlG7JXdcDxHIA7dgBbQ0-YV2qgagpSCzBb=s16000)

그리고 나서 설치된 im-select 프로그램이 어디에 위치해 있는지 which 명령어로 확인했습니다.

이제 VS Code에서 Vim을 설치합시다.

![mycodings.fly.dev-vs-code-with-korean-input-auto-change](https://blogger.googleusercontent.com/img/a/AVvXsEjhplYCDa8pk1HUE59rPdngyLOWt2g2oXl-aptyxNU6lTx0WBjxU2DupYNL4ZRHLXLsZSH2Y61gDpqsYVC0ujlKUTTEkteQ3IXCAFjBjQWZWEY27Mas2v4HkTU3B8QS9OlpHKsVN8ioLeBFQ6Nu4J34menKlwxLuBRFVFSURLQl2jv6HCtgY5-73DKn=s16000)

설치할 때는 위 그림에서 나오는 것과 똑같은 걸 고르면 됩니다.

일단 설치를 했으면 위 그림에서 오른쪽에 조그마하게 있는 톱니바퀴를 눌러 Vim의 세팅으로 들어갑시다.

톱니바퀴를 누르고 확장 관련을 선택하면 Vim 세팅 화면이 나오는데요.

우리가 찾아야 할 부분은 아래 그림과 같습니다.

![mycodings.fly.dev-vs-code-with-korean-input-auto-change](https://blogger.googleusercontent.com/img/a/AVvXsEhb5WbdLC7QOhOuWGqr5Gg4V1V1Z_geXtPamNmCW6L5QoGrA-p6XPldPX2NjRvWEWriVLUAlVmi0GYxbdhFayjW3mBShZrzOIZ47aDvJGha8g9NoVk5ALUWzYQB4mPV6yNQs-oKJwttzQ3H7gFpyHH0N7SKtJWd5Vsq7PS3gs5EjooAXgFL2w4YftxQ=s16000)

첫 번째 Default IM 부분에 아래 코드를 붙입니다.

```bash
com.apple.keylayout.ABC
```

두 번째 Enable 부분은 밑에 있는 체크 박스에 체크만 하면 됩니다.

세 번째, 네 번째는 아까 우리가 설치했던 im-select 프로그램의 위치를 입력하는 건데요.

그림과 같이 입력하시면 됩니다.

이제 VS Code에서의 Vim 세팅을 끝났습니다.

간혹, 에러가 발생할 수 있는데요.

그 이유는 "com.apple.keylayout.ABC" 부분인데요.

![mycodings.fly.dev-vs-code-with-korean-input-auto-change](https://blogger.googleusercontent.com/img/a/AVvXsEhisK2HF7_x13-BaQg2umF6fPr_qLKXzQSsRMzsngxnlTDNfJy6qlzOildOo_UZliXIClrWcJGW6uCG8bvVwfPJ6iPlxUeRe7ezyNAcztlehLWgQ9hHZfr0-aARcFiCuqB1NYsM_NxmsMNMQf6nl6ZA8vokL2_hv2EDMP17KFxPsdFz4QOQWSgD33r7=s16000)

위 그림과 같이 여러 키보드를 넣어서 테스트해 보면 됩니다.

보통 US와 ABC 둘 중에 하나는 통하더라고요. 

---

## Windows 사용자일 경우

윈도 사용자일 경우 맥의 im-select 프로그램을 별도로 다운로드하여야 하는데요.

[여기](https://github.com/daipeihust/im-select#windows)서 받으시면 됩니다.

![mycodings.fly.dev-vs-code-with-korean-input-auto-change](https://blogger.googleusercontent.com/img/a/AVvXsEhHC_rW5S5q5yY7CJeyAJa2At9YZ3Sggzcu4NIA_9UCPFSpfjh4P416pnU_WaA04yaUeack7hhZuc9SkfDaj6FfOZqKyj2qKLO5_8rNo_NRK45YM9YWt8gYQxYp1nhlj5Y4vRZhDYtTAujh3_sMxbSJTxeLCkkdqfeSAg0GFZtqu_I1VxB2AxSUZMG6=s16000)

위 그림에서 밑줄 친 부분을 다운하여 어디 적당한 곳에 저장하면 됩니다.

일단 C:\\im-select 폴더를 만들고 그 안에 저장합시다.

그럼 최종적으로 윈도상의 im-select.exe 파일의 경로는 다음과 같습니다.

```bash
C:\\im-select\\im-select.exe
```

이제 다시 VS Code에서 Vim을 선택하고 Vim의 세팅으로 들어가서 아까 맥 사용자와 똑같은 곳으로 이동합시다.

그리고 아래 그림처럼 입력하면 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhzBgyuMzj7-V-rbnQwUuMfOJrK7VEA39TgKV2197WUIuBpZIu8McGc9cfxAOVeYjueDnG0qTmoVt_h5cOKUdqPRVmF8Wc4NbWMUUg_P0xKssqm0wgY1rA31tXdxR6p8MHXzNvcQcabu9wrif9sQrlP2OKKUC0G3nSol2sNdq9RaQALypwB47h2OYSi=s16000)

원리는 맥 사용자일 경우와 똑같은데요.

한 가지 다른 점은 키보드 로케일이 윈도와 맥의 경우 그 방식이 조금 다릅니다.

1033은 US 키보드의 윈도상에서의 로케일 번호입니다.

그리고 KR 키보드의 윈도상에서의 로케일 번호는 1042 번호입니다.

그래서 혹시 에러가 나면 1042로 바꿔서 확인해 보시면 됩니다.

참고로 윈도에서의 키보드 로케일 정보는 아래 사이트에서 확인할 수 있습니다.

[로케일 코드 사이트](https://www.science.co.il/language/Locale-codes.php)

이상으로 VS Code에서 Vim 사용 시 좀 더 한글을 편하게 사용하는 방법에 대해 알아봤는데요.

좋은 도움이 되셨으면 합니다.

---

MacOS 사용자 Tip

맥의 VS Code에서 Vim을 처음 설치해서 사용할 때 hjkl 키를 누르고 있으면 커서가 한 번만 움직이고 더 이상 움직이지 않는 경우가 있는데요.

이럴 경우 다음과 같이 하면 해결됩니다.

VS Code에서 Command + J 키를 눌러 터미널 창을 열고 아래와 같이 입력하여 실행하면 해결됩니다.

```bash
defaults write com.microsoft.VSCode ApplePressAndHoldEnabled -bool false
```

이제 다시 VSCode를 끄고 다시 실행해 보면 hjkl 키가 연속으로 눌러지는 걸 확인할 수 있을 겁니다.

그럼.

