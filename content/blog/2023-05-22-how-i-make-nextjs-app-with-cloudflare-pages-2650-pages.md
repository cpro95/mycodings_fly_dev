---
slug: 2023-05-22-how-i-make-nextjs-app-with-cloudflare-pages-2650-pages
title: Next.js로 2,650페이지나 되는 정적 사이트 만든 경험담 공유 (Cloudflare Pages)
date: 2023-05-22 07:55:11.333000+00:00
summary: Next.js로 2,650페이지나 되는 정적 사이트 만든 경험담 공유 (Cloudflare Pages)
tags: ["next.js", "cloudflare", "static site", "lotto"]
contributors: []
draft: false
---

안녕하세요?

제가 몇 달 전에 완성한 취미 프로젝트가 있었는데요.

바로 [mylotto.pages.dev](https://mylotto.pages.dev) 사이트입니다.


![](https://blogger.googleusercontent.com/img/a/AVvXsEiJxnVqh6_ZTLGxafUG-2tXB7rLtWWIe2Ed9UzMkvh2UPwJ8NMck1oTuq4lfBGa5aFlVUcmRiby0uIKUu9TdOKPyvXnAzBRwJDByJHgxXeTCnzPLmj3tsXo1uG-SvHyM2CwhO3LlFUT4yd9AHamjonCw5eSeLIO4svlfTgI1qwNAw78MYa5SEb_ZyHX)

이 사이트를 만든 목적은 로또 판매점을 좀 더 쉽게 찾고 싶어서였습니다.

즉, 우리나라 어느 곳으로 가든지 그 주위 로또 판매점의 위치를 지도로 한눈에 쉽게 볼 수 있게 하는 게 목적인데요.

지도 서비스는 다음과 네이버 지도 서비스를 사용하려고 했으나 일일 트래픽 제한이 있어 VWorld 지도 데이터를 사용했습니다.

국토부에서 운영하는 사이트라 공짜네요.

Remix로 Full-Stack으로 만들려고 했는데, Cloudflare의 Pages란 정적 사이트 방식이 좀 더 빠른 거 같아 모든 데이터를 Next.js의 Static Site Generator를 이용했습니다.

총 2650 페이지 정도 되는데요.

Next.js가 아무 에러 없이 컴파일되는 걸 보고 다시 한번 Next.js의 위력을 실감했었는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjApKdKqJmqDXs7c394s88pmXHz_MEh_E95RZzqMLosXMn0XyvF1i96IR43b6pr8fKypF2Mfz7H99pCaZhz7EAsVLSh3aSGDx8zSbYdyntn9y-Z-qO3PlepplOeCGOb-vFdwsOYflOYXfRqxzEXj6nx0o-1BBknw04C-uPZNM333XmvIO8Hlzp_7rRp)

위 그림은 Cloudflare 대시보드에서 Github 저장소를 불러와서 빌드하는 로그인데요.

아주 잘 빌드되고 있습니다.

## 기초 데이터 수집은 어떻게?

현재 우리나라 로또 대행사가 동행복권인데요.

여기 사이트에서 실제 데이터를 파이선으로 스크래핑해서 자료를 만들었습니다.

해당 자료는 오라클 클라우드에 설치한 Strapi 서버에 있고요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEghZjiiX5EMiQ_vWHwUX8iEejbOjPBsTARqv-7yAKtRmwC2SIGisJDrh2vLJtHioyuEsM58UcY9NhOOFAScnlVSQaAEmD9kcuRDbshnrUhvhf4FgXHqd5vqAgkxPi1k0uYzFHu5dZAwPG5na72jdVYKeavKZtqoufWALilclyQItM4QPEst5nbGjEY1)

![](https://blogger.googleusercontent.com/img/a/AVvXsEhslG8U7sMQZzQcamQSXvqtbxi7tFUTq_e38oayXoe_00M-0mEdQ4yEHm1T1jjDxPLKj9vjWwlKuxvW-IYJv8KbDBRCA8UhohnjEm05J8TS7fvjj_fQE7gXxHswdPGmYv4vZmmFMT27bqdLg2oLWgI9ll0bvpJ3p5r1QPcEd2oAw7tdrcl-xzM_6eqy)

위 그림은 Strapi 서버에 접속한 Admin 계정입니다.

Shop 테이블이 로또 판매점을 저장하는 곳이고, Result가 로또 당첨 정보를 회차별로 저장하는 곳입니다.

## 매주 당첨 번호 업데이트는 어떻게?

바로 이 문제가 있는데요.

회차별 당첨번호는 매주 업데이트 해야 하는 문제가 생깁니다.

이 문제를 위해 Remix Framework을 이용해 풀 스택으로 개발해서 Fly.io에 도커 형태로 배포하려 했으나,

Cloudflare의 Pages가 너무 빠르다는 걸 알고 정적 사이트로 방향을 틀었습니다.

그럼, 매주 당첨 번호만 업데이트되게 해야 하는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjx-8LAcgd1soROL88NaAAytgAU07FbAbISe6ck_SBhFtpMfaioCvySbv9az9UVGWr85PR-V3gg36X6tNCGYZYOU2zmPnKsLAPAWzSA2g3VCyHopyeDwvOp4dIh8rfHSIfCTeTlc1YJHTdmoR788i6G-5kafc5VRGrTHX1XUPAsQmsxFltCXrjluRwh)

이 방식을 위해 Strapi 서버를 제 맥북에 설치한 게 아니라 오라클 클라우드에 설치했습니다.

그리고 오라클 클라우드의 무료 서버에서는 Crontab을 이용해서 매주 토요일 저녁 9시 30분에 이번 주차 당첨 번호를 파이선으로 긁어서 Strapi에 저장하고, 그다음으로 Cloudflare에서 재 빌드하면 됩니다.

```bash
ubuntu@sub-instance:~$ crontab -l
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
30 21 * * 6 /bin/sh /home/ubuntu/get-lotto-result-weekly.sh
```

위에서 볼 수 있듯이 crontab을 돌리고 있는 게 바로 제가 작성한 명령어입니다.

30 21은 30분 21시이고요, 마지막에 6은 토요일을 뜻합니다.

그러면 실행파일을 들여다볼까요?

```bash
ubuntu@sub-instance:~$ cat get-lotto-result-weekly.sh
#!/bin/sh
cd
cd mystrapi-server
cd .tmp
echo "Get Lotto Result of This Week"
python3 get_last_result.py
cat lotto_results.csv
echo "Upload To DB"
python3 upload_results.py
cd ..
cd ..
echo "New Builds by cloudflare's hook"
curl -X POST "https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/23947~~~~~"
```

쉘 스크립트인데요.

간단합니다.

파이선으로 그 회차 당첨 번호를 긁어서 CSV 파일로 저장하고, 

다시 그 CSV 파일을 Strapi DB 파일인 sqlite3 파일에 직접 업로드하면 됩니다.

마지막으로 Cloudflare Pages를 다시 빌드해야 하는데요.

마지막에 curl 명령어로 POST 시킨 게 바로 다시 빌드하기 위한 Cloudflare의 HOOK입니다.

## Deploy Hook 만들기

Cloudflare 대시보드에서 mylotto 프로젝트를 선택 후 "설정", "빌드 및 배포"를 선택하고 마지막에 있는 "배포 후크"를 선택하면 됩니다.

이름은 아무 이름으로 지정해도 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjt89W3JSmIb878mJBFKMh9woOoutS055kXUEvsAAgUY07L4KyahD1Lu53FA6AH3FjcbbheCE9CZVu8YyDt1VhFPTSVSQ9H2cgvZFjZd3AQnwALPppLP4WbB_-JW8zamE3vCaUGDctskAdcKAa5yPQf7XlXyhMBwuk-Q0XpuqrRaMu8kkhphKwkarJP)

![](https://blogger.googleusercontent.com/img/a/AVvXsEirJ4F9osd7NiG5NJt_3QFYlSfLa3qlm5Vg7d5vwcnB0Fy6_ZzOyd1vdTknI3RpFzBGRponpSZir8i50BLIPjwF_gwEajWMtCMYrgy6fcfQjIEo-J17A0j4iyevJJxu_rdZ5svOLC7B2q2D6E36xRB1Pyt_8QV-kGugCZAEQQlPCRwoGa4AYCO1h0Js)

두 번째 그림처럼 배포 훅을 실행시킬 수 있는 POST API가 나옵니다.

이 API 주소로 POST fetch만 하면 자동으로 Cloudflare가 빌드를 재시작합니다.

---

어떤가요?

Full-Stack 웹앱 부럽지 않은 정적 사이트가 되었네요.

궁금한 점 있으면 댓글 부탁드립니다.

그럼.


