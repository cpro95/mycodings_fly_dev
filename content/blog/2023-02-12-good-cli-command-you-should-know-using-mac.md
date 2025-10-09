---
slug: 2023-02-12-good-cli-command-you-should-know-using-mac
title: 알아두면 좋은 맥 터미널 명령어 소개
date: 2023-02-12 07:59:32.585000+00:00
summary: 맥 사용 시 꼭 써먹을 수 있는 터미널 명령어
tags: ["mac", "cli", "terminal"]
contributors: []
draft: false
---

안녕하세요?

오늘은 맥 사용 시 알아두면 터미널 명령어를 몇 가지 소개해 드리겠습니다.

## 1. passwd

맥의 패스워드를 바꾸려면 설정에 들어가야 하죠.

CLI에서 쉽게 바로 바꿀 수 있습니다.

바로 passwd 라는 명령어인데요.

Linux 같은 POSIX 유닉스에는 passwd 명령어가 꼭 있으니 참고 바랍니다.

```bash
passwd
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEjLGRlIG8E3KlTHp3dwSn2Kx5v060gHC0WmSMuRRYKr3DOnh0j_YrNXO32t6QYTCOutB5jwQtpFDgAfIh-oLu3RYxVKthKDIeyVQdHg2z8olsgZaeyGaNPHswUL3QsSxa8GuAEbyeZ5tHaqZzHB8JbZ7Wf2Gtp-7fRVmBCuyhReBxs8-A5wSUGerQ89)

passwd 명령어는 iCloud 키체인 패스워드는 바꾸는 게 아니니 참고 바랍니다.

## 2. 디스크 사용량 알아보기

맥에서는 디스크 용량이 얼마나 남았는지 Disk Utility App 을 사용하는데요.

터미널에서 아래와 같이 쉽게 알아볼 수 있습니다.

```bash
df -h
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEgQslYBh0txSY2g96bib1JWkbYMXWy81v4SwXziHz9ztxJy-DTVUtZrOsSOK85iN4GqSBuN9Z4OqLgOmVH7iOd4YYISEKLbwwWcmsCJ7X0geRxP7SF29Rn3kglmKANqW7WBOADXBUblMhZNkVzctL82zL_jF_PRgIKQeQFQGTfb9YLcUWmTAP1r65P8)

df 명령어는 Linux에도 있는 명령어인데요.

diskfree의 약자입니다.

뒤에 -h 옵션은 용량 표시를 쉽게 사람들이 읽을 수 있게 Giga, Mega 이런 식으로 보여주라는 옵션입니다.

## 3. 현재 내 Mac에 열려있는 네트워크는?

내 맥에 어떤 게 인터넷에 연결되어 있는지 확인하려면 바로 'nettop'이란 명령어를 사용하면 됩니다.

```bash
nettop
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEhyXHlP1kPySn9U269ygPhMaMRuf2umzcTsIO7-YXdycfqtXEaJeirFi8XMvmB0RwToo68yztaTTe5-tp0mYGYtNp2KRbRes7iePC8OuEfhvxbCoxS2E5YxAkvSEA4YoD6Ti_hSFbAr3wjN_SyRbTHdrgWtbCXszwXcw4jFH7sRMDqyjQkgx1F3RSgF)

위와 같이 내 컴퓨터가 인터넷 어디에 연결되어 있는지 나오는데요.

이상하게 모르는 주소와 포트가 있네요.

17.57.145.55:5223 포트에 연결되어 있습니다.

앞에 192.168.29.145:56944 주소와 포트는 현재 사용하는 제 컴퓨터입니다.

192.168 로 시작하는 주소는 바로 공유기를 통한 하위 컴퓨터이거든요.

알아본 바로는 17.57.145.55.5223 포트는 애플 푸쉬 알람을 위한 주소라고 합니다.

아이클라우드 등을 위해서 사용하는 거겠죠.

## 4. 프로세스 죽이기

터미널에서 현재 어떤 프로세스가 백그라운드로 작동되는지 보는 명령어가 'top'인데요.

```bash
top
```

리눅스에도 똑같은 게 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhjsGRz-8eyGnS2JQz-cggzf2Mg3GabMHyG91YDL280VxsJzOJ05ziNeh9J4p65D8VzvZsAaOuD1-voZ2aHRnb6Q5LKAVJN6RhRkFN_9zhn4veeSGmh2CKg6TEgd5T_pZlFw2TDt6ftP-PCjx53sFZsEnuHUY_wja4_edS3zqx919-OBmjPdvjBHYj8)

만약 이상한 프로세스가 있고 그걸 실행 중지시키고 싶다면,

맥, 리눅스에서는 바로 kill이란 표현을 씁니다.

명령어도 실제 kill인데요.

```bash
kill -9 <PID>
```

위 명령어에서 '-9' 옵션은 즉시 실행하라는 뜻이고 PID는 프로세스 아이디입니다.

top 화면 맨 왼쪽에 PID 목록이 나와 있습니다.

## 5. 얼마나 오래 동안 내 맥을 안 껏지?

재 부팅 한지 얼마나 오래됐는지 확인하는 명령어가 있습니다.

윈도우 노트북은 배터리 때문에 금방 재부팅되는데요.

맥은 상당히 오래갑니다.

이럴 때 사용하는 명령어가 바로 'uptime'입니다.

```bash
uptime
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEgIuGEfod0iDoj3ypEqJziuNA1hcFudC4tpNz3bY5RPwMAzbMPa3wXHsfz47yU25fbGzhF1Ldqo-GS3fb6yBmBxwv9G6gqhBPzJkXDzwJIQAZdbzogpVq9uEPucj7On8QWBsx5f-lRdvNXMROwWtFp71I9-GsKUjooNYqG5s3og8B83nooJrBssie0u)

## 6. 터미널에서 날씨 알아보기

이번에는 터미널에서 날씨를 알아보는 유용한 팁입니다.

```bash
curl wttr.in/seoul
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEhEHRiSi3Ox7Nu4Snm1RoHCJJN1kUvbISrcvEMhAwUZsY3Uru9ciu9akgfP6ephsOsfmjgFq4_l9tijsbORI-GQSkSGFMBis7W2L0VIxjXpXeTQlF1RPjwckH0zRZbMFD1GEiRAwgmC9XWJTDLjvMrPH_uTPPohMBltKcrXux6TgQA4CNJLYGhcEG3k)

어떤가요?

본인이 사는 곳을 영어로 한 번 쳐보세요.

## 7. 맥 게이트키퍼(GateKeeper) 중지시키기

맥을 사용할 때 인터넷에서 다운로드한 앱을 실행시키면 뭐라고 경고가 뜨는데요.

맥 앱스트어를 통하지 않았다는 둥, 인증된 사용자가 만든 앱이 아니라는 둥 여러 가지 경고가 뜹니다.

이 기능이 바로 게이트키퍼인데요.

이걸 중지하는 터미널 명령어가 있습니다.

```bash
sudo spectl --master-disable
```

근데 이왕이면 게이트키퍼는 실행시켜 놓는 게 보안적인 측면에서 조금은 안심이 되지 않을까요?

그럼.
