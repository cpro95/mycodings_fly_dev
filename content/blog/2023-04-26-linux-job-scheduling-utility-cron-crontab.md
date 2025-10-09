---
slug: 2023-04-26-linux-job-scheduling-utility-cron-crontab
title: 리눅스 잡 스케줄러 크론탭(crontab) 이해하기
date: 2023-04-26 11:40:09.833000+00:00
summary: 리눅스 잡 스케줄러 크론탭(crontab) 이해하기
tags: ["cron", "crontab", "linux"]
contributors: []
draft: false
---

안녕하세요?

오늘은 제가 예전에 오라클 클라우드에 설치했던 Strapi 서버 관련하여 매주 일정 시간마다 자료를 업데이트하기 위해서 리눅스 cron 명령어에 대해 알아보겠습니다.

cron이란 말은 리눅스에 있어 잡 스케줄링 유틸리티(job scheduling utility)인데요.

거의 모든 유닉스 시스템에서는 cron이란 걸 씁니다.

cron 명령어를 지정하면 서버는 1년 365일 작동하기 때문에 일정 시간, 혹은 일정 요일에 특정 명령을 실행 시킬수 있습니다.

cron 명령어가 가장 많이 쓰이는 곳이 바로 시스템 로그파일을 로테이팅 하는 건데요.

서버는 계속해서 로그파일을 만듭니다.

근데 이 로그 파일이 텍스트 파일인데도 계속 크기가 커지는데요.

그래서 cron을 이용해서 로그파일을 압축해서 보관하고 그럽니다.

---

## 우분투에서의 cron

이제 실전으로 들어가 볼까요?

먼저 오라클 클라우드에 원격으로 ssh 접속하십시오.

자신의 계정이 cron을 실행시킬 수 있는지 보기 위해서는 아래와 같이 명령어를 입력해 보기 바랍니다.

```bash
ubuntu@main-instance:~$ crontab -e
no crontab for ubuntu - using an empty one

Select an editor.  To change later, run 'select-editor'.
  1. /bin/nano        <---- easiest
  2. /usr/bin/vim.basic
  3. /usr/bin/vim.tiny
  4. /bin/ed

Choose 1-4 [1]:
```

위를 보시면 에디터를 고르라고 하는데요.

텍스트 에디터인데요. 왜냐하면 cron은 텍스트를 분석해서 작동하기 때문입니다.

원하는 걸 고르면 아래와 같이 나옵니다.

```bash
# Edit this file to introduce tasks to be run by cron.
 #
 # Each task to run has to be defined through a single line
 # indicating with different fields when the task will be run
 # and what command to run for the task
 #
 # To define the time you can provide concrete values for
 # minute (m), hour (h), day of month (dom), month (mon),
 # and day of week (dow) or use '*' in these fields (for 'any').
 #
 # Notice that tasks will be started based on the cron's system
 # daemon's notion of time and timezones.
 #
 # Output of the crontab jobs (including errors) is sent through
 # email to the user the crontab file belongs to (unless redirected).
 #
 # For example, you can run a backup of all your user accounts
 # at 5 a.m every week with:
 # 0 5 * * 1 tar -zcf /var/backups/home.tgz /home/
 #
 # For more information see the manual pages of crontab(5) and cron(8)
 #
 # m h  dom mon dow   command
```

이 파일의 끝에다가 특정 규칙에 의해 cron 명령어를 추가하면 됩니다.

cron의 규칙은 아래와 같습니다.

```bash
* * * * * sh /path/to/script.sh
```

여기서 각 별표 표시는(\* \* \* \* \*)는 분, 시, 일, 달, 요일을 뜻합니다.

| 규칙 | 값   | 설명                   |
| ---- | ---- | ---------------------- |
| 분   | 0-59 | 0분부터 59분부터       |
| 시   | 0-23 | 0시부터 23시까지       |
| 일   | 1-31 | 1일부터 31일까지       |
| 달   | 1-12 | 1월부터 12월까지       |
| 요일 | 0-6  | 0이 일요일, 6이 토요일 |

그래서 "30 21 * * 6"이란 표현은 매주 토요일 저녁 9시 30분이란 뜻입니다.

그리고 sh는 쉘을 뜻합니다.

리눅스에서는 /bin/bash나 /bin/sh를 많이 씁니다.

마지막으로 실행할 스크립트나 프로그램을 풀 경로로 넣으면 됩니다.

이제 테스트해 볼까요?

---

## 테스트

일단 자신 계정의 홈 디렉터리에서 아래와 같은 파일을 만듭니다.

```bash
#!/bin/sh

echo `date` >> date-out.txt
```

이 파일의 이름을 date-script.sh 이라고 저장합니다.

그리고 아래처럼 실행 가능한 상태로 만드는데요.

```bash
chmod 755 date-sript.sh
```

이제 실행해 볼까요?

```bash
ubuntu@sub-instance:~$ ./date-script.sh
ubuntu@sub-instance:~$ cat date-out.txt
Wed Apr 26 21:00:05 KST 2023
```

위 스크립트는 현재의 시간을 텍스트 파일에 넣는 간단한 코드입니다.

그럼, 이 파일을 crontab에 넣어 볼까요?

여기서 crontab은 cron tables 이란 뜻인데요.

바로 cron 명령어가 모여있는 테이블이란 뜻이죠.

우분투에서는 아까처럼 crontab이란 명령어를 제공해 줍니다.

그럼, 처음으로 돌아와서 `crontab -e` 명령어로 아래처럼 cron 명령어를 추가해 볼까요?

```bash
 # Edit this file to introduce tasks to be run by cron.
 #
 # Each task to run has to be defined through a single line
 # indicating with different fields when the task will be run
 # and what command to run for the task
 #
 # To define the time you can provide concrete values for
 # minute (m), hour (h), day of month (dom), month (mon),
 # and day of week (dow) or use '*' in these fields (for 'any').
 #
 # Notice that tasks will be started based on the cron's system
 # daemon's notion of time and timezones.
 #
 # Output of the crontab jobs (including errors) is sent through
 # email to the user the crontab file belongs to (unless redirected).
 #
 # For example, you can run a backup of all your user accounts
 # at 5 a.m every week with:
 # 0 5 * * 1 tar -zcf /var/backups/home.tgz /home/
 #
 # For more information see the manual pages of crontab(5) and cron(8)
 #
 # m h  dom mon dow   command
 */1 * * * * /bin/sh /home/ubuntu/date-script.sh
```

여기서 보면 이상한 게 있는데요.

바로 첫번 째 별표가 */1 이라고 이상하게 되어 있습니다.

첫번 째 별표는 분인데 그걸 나누기 1 한다는 얘기인데요.

바로 매분이란 뜻입니다.

즉, 매 1분 마다 /bin/sh 라는 쉘로 /home/ubuntu/date-script.sh 파일을 실행하라는 뜻입니다.

아까 만들었던 date-script.sh 파일을 실행하라는 뜻입니다.

저장하고 나와볼까요?

---

cron 서버가 돌아가고 있는지 살펴보는 방법은 아래와 같습니다.

```bash
ubuntu@sub-instance:~$ sudo systemctl status cron.service
● cron.service - Regular background program processing daemon
     Loaded: loaded (/lib/systemd/system/cron.service; enabled; vendor preset: enabled)
     Active: active (running) since Sun 2023-03-12 17:29:35 KST; 1 month 14 days ago
       Docs: man:cron(8)
   Main PID: 844 (cron)
      Tasks: 1 (limit: 1074)
     Memory: 2.1M
        CPU: 14.490s
     CGroup: /system.slice/cron.service
             └─844 /usr/sbin/cron -f -P

Apr 26 21:02:01 sub-instance CRON[491414]: (ubuntu) CMD (/bin/sh /home/ubuntu/date-script.sh)
Apr 26 21:02:01 sub-instance CRON[491413]: pam_unix(cron:session): session closed for user ubuntu
Apr 26 21:03:01 sub-instance CRON[491442]: pam_unix(cron:session): session opened for user ubuntu(uid=1001) by (uid>
Apr 26 21:03:01 sub-instance CRON[491443]: (ubuntu) CMD (/bin/sh /home/ubuntu/date-script.sh)
Apr 26 21:03:01 sub-instance CRON[491442]: pam_unix(cron:session): session closed for user ubuntu
Apr 26 21:04:01 sub-instance CRON[491472]: pam_unix(cron:session): session opened for user ubuntu(uid=1001) by (uid>
Apr 26 21:04:01 sub-instance CRON[491472]: pam_unix(cron:session): session closed for user ubuntu
Apr 26 21:05:01 sub-instance CRON[491500]: pam_unix(cron:session): session opened for user ubuntu(uid=1001) by (uid>
Apr 26 21:05:01 sub-instance CRON[491501]: (ubuntu) CMD (/bin/sh /home/ubuntu/date-script.sh)
Apr 26 21:05:01 sub-instance CRON[491500]: pam_unix(cron:session): session closed for user ubuntu
```

일단 잘 돌아가고 있네요.

별도로 cron 명령어를 실행할 필요 없습니다.

cron이 알아서 crontab을 참조해서 실행하니까요?

그럼 1분, 2분 있다가 홈 폴더를 살펴보면 아래와 같이 cron job이 잘 실행되고 있습니다.

```bash
ubuntu@sub-instance:~$ ls -l date*
-rw-rw-r-- 1 ubuntu ubuntu 203 Apr 26 21:06 date-out.txt
-rwxr-xr-x 1 ubuntu ubuntu  39 Apr 26 20:29 date-script.sh
ubuntu@sub-instance:~$ cat date-out.txt
Wed Apr 26 21:00:05 KST 2023
Wed Apr 26 21:01:01 KST 2023
Wed Apr 26 21:02:01 KST 2023
Wed Apr 26 21:03:01 KST 2023
Wed Apr 26 21:04:01 KST 2023
Wed Apr 26 21:05:01 KST 2023
Wed Apr 26 21:06:01 KST 2023
```

---

## 내 cron 명령어는 어디에 저장되어 있나요?

위치는 바로 /var/spool/cron/crontab 폴더입니다.

이 폴더를 보기 위해서는 관리자 권한이 필요합니다.

```bash
ubuntu@sub-instance:~$ sudo ls -l /var/spool/cron/crontabs/
total 4
-rw------- 1 ubuntu crontab 1138 Apr 26 20:28 ubuntu
```

위와 같이 제 계정인 ubuntu라는 이름이 보이는데요.

이건 ubuntu 계정으로 cron 명령어가 있다는 뜻입니다.

그럼, 이 파일을 열어볼까요?

```bash
ubuntu@sub-instance:~$ sudo cat /var/spool/cron/crontabs/ubuntu
# DO NOT EDIT THIS FILE - edit the master and reinstall.
# (/tmp/crontab.VZ1tqU/crontab installed on Wed Apr 26 20:28:12 2023)
# (Cron version -- $Id: crontab.c,v 2.13 1994/01/17 03:20:37 vixie Exp $)
# Edit this file to introduce tasks to be run by cron.
#
# Each task to run has to be defined through a single line
# indicating with different fields when the task will be run
# and what command to run for the task
#
# To define the time you can provide concrete values for
# minute (m), hour (h), day of month (dom), month (mon),
# and day of week (dow) or use '*' in these fields (for 'any').
#
# Notice that tasks will be started based on the cron's system
# daemon's notion of time and timezones.
#
# Output of the crontab jobs (including errors) is sent through
# email to the user the crontab file belongs to (unless redirected).
#
# For example, you can run a backup of all your user accounts
# at 5 a.m every week with:
# 0 5 * * 1 tar -zcf /var/backups/home.tgz /home/
#
# For more information see the manual pages of crontab(5) and cron(8)
#
# m h  dom mon dow   command
*/1 * * * * /bin/sh /home/ubuntu/date-script.sh
```

아까 만들었던 cron 명령어가 저장되어 있습니다.

---

## cron 지우기

단순하게 `crontab -e` 명령어로 들어가서 지우면 됩니다.

---

## 기타
crontab 명령어는 아래처럼 여러 가지 옵션이 있으니 참조 바랍니다.

```bash
# 작성
crontab -e

# 현재 사용자의 cron job 보기
crontab -l

# 사용자의 계정을 적어서 해당 사용자의 cron job 보기
crontab -u username -l

# 사용자의 계정을 적어서 해당 사용자의 cron job 작성하기
crontab -u username -e
```

## Cron Guru

아까 언제 실행되는지 별표로 작성하는 부분을 쉽게 이해해 주는 사이트가 있습니다.

바로 cron guru인데요.

[cronguru](https://crontab.guru/)

이 사이트에서 여러 가지 조합을 만들어 보시면 쉽게 이해할 수 있을 겁니다.

그럼.




