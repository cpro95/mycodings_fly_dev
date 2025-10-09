---
slug: 2024-04-06-docker-tutorial-docker-container-comprehensive-guide
title: Docker 강좌 2편. 실무에서 쓰이는 Docker 컨테이너 완벽 가이드
date: 2024-04-06 04:28:14.236000+00:00
summary: 실무에서 쓰이는 Docker 컨테이너 완벽 가이드
tags: ["docker", "container"]
contributors: []
draft: false
---

안녕하세요?

두번째 Docker 강좌입니다.

전체적인 강좌 리스트입니다.

1. [Docker 강좌 1편. 가상화와 Docker 기초 개념 이해하기](https://mycodings.fly.dev/blog/2024-04-06-docker-tutorial-understanding-virtualization-and-docker)

2. [Docker 강좌 2편. 실무에서 쓰이는 Docker 컨테이너 완벽 가이드](https://mycodings.fly.dev/blog/2024-04-06-docker-tutorial-docker-container-comprehensive-guide)

3. [Docker 강좌 3편. Docker 이미지 및 Dockerfile 기초](https://mycodings.fly.dev/blog/2024-04-06-docker-tutorial-understanding-docker-image-and-dockerfile)

4. [Docker 강좌 4편. Docker 볼륨 (Volume) 사용 방법과 원리](https://mycodings.fly.dev/blog/2024-04-06-docker-volume-usage-and-principles)

5. [Docker 강좌 5편. Docker 바인드 마운트와 포트 publish](https://mycodings.fly.dev/blog/2024-04-06-docker-tutorial-understanding-bind-mount-and-port-publish)

6. [Docker 강좌 6편. Docker Compose 완벽 가이드](https://mycodings.fly.dev/blog/2024-04-06-docker-tutorial-docker-compose-complete-guide)

---

** 목 차 **

- [컨테이너의 기초](#컨테이너의-기초)
  - [컨테이너 실행 - container run](#컨테이너-실행---container-run)
  - [컨테이너 목록 확인 - container ls](#컨테이너-목록-확인---container-ls)
    - [옵션 설명:](#옵션-설명)
  - [컨테이너 중지 - container stop](#컨테이너-중지---container-stop)
  - [컨테이너 삭제 - container rm](#컨테이너-삭제---container-rm)
    - [옵션 설명:](#옵션-설명-1)
  - [컨테이너 실행](#컨테이너-실행)
  - [실행 중인 컨테이너 목록 확인](#실행-중인-컨테이너-목록-확인)
  - [실행 중인 컨테이너 중지](#실행-중인-컨테이너-중지)
  - [모든 컨테이너 목록 확인](#모든-컨테이너-목록-확인)
  - [컨테이너 삭제](#컨테이너-삭제)
  - [실행 중인 컨테이너를 중지하지 않고 바로 삭제하기](#실행-중인-컨테이너를-중지하지-않고-바로-삭제하기)
  - [**정지**할 것인지 **삭제**할 것인지](#정지할-것인지-삭제할-것인지)
  - [요약](#요약)
- [컨테이너 시작 시 기본 옵션](#컨테이너-시작-시-기본-옵션)
  - [컨테이너 상호작용](#컨테이너-상호작용)
  - [백그라운드에서 컨테이너를 실행하기](#백그라운드에서-컨테이너를-실행하기)
  - [컨테이너가 중지될 때 자동으로 삭제하기](#컨테이너가-중지될-때-자동으로-삭제하기)
  - [컨테이너에 이름을 지정하기](#컨테이너에-이름을-지정하기)
  - [컨테이너 시작 시 동작 변경하기](#컨테이너-시작-시-동작-변경하기)
  - [컨테이너의 OS 아키텍처를 지정하기](#컨테이너의-os-아키텍처를-지정하기)
  - [요약](#요약-1)
- [컨테이너 상태 변화](#컨테이너-상태-변화)
  - [**컨테이너 상태 및 프로세스 이해하기**](#컨테이너-상태-및-프로세스-이해하기)
  - [**컨테이너와 프로세스**](#컨테이너와-프로세스)
    - [**예제 1: Ubuntu 컨테이너를 기본 명령어 (bash)로 실행**](#예제-1-ubuntu-컨테이너를-기본-명령어-bash로-실행)
    - [**예제 2: Nginx 컨테이너를 기본 명령어 (nginx)로 실행**](#예제-2-nginx-컨테이너를-기본-명령어-nginx로-실행)
    - [**예제 3: Nginx 컨테이너를 지정한 명령 (bash)으로 실행**](#예제-3-nginx-컨테이너를-지정한-명령-bash으로-실행)
  - [**컨테이너와 프로세스의 관계**](#컨테이너와-프로세스의-관계)
  - [**컨테이너가 종료되는 경우**](#컨테이너가-종료되는-경우)
    - [1. **컨테이너를 직접 중지하는 경우**](#1-컨테이너를-직접-중지하는-경우)
    - [2. **메인 프로세스가 종료되는 경우**](#2-메인-프로세스가-종료되는-경우)
      - [2-A. **사용자가 메인 프로세스를 직접 종료하는 경우**](#2-a-사용자가-메인-프로세스를-직접-종료하는-경우)
      - [2-B. **메인 프로세스가 자동으로 종료되는 경우**](#2-b-메인-프로세스가-자동으로-종료되는-경우)
  - [**즉시 중지와 백그라운드 실행에 대하여**](#즉시-중지와-백그라운드-실행에-대하여)
  - [**요약**](#요약-2)
- [컨테이너 상태 유지](#컨테이너-상태-유지)
  - [1. **동일한 이미지에서 시작하더라도 다른 컨테이너입니다.**](#1-동일한-이미지에서-시작하더라도-다른-컨테이너입니다)
  - [2. **컨테이너에서 수행한 작업은 다른 컨테이너에 영향을 주지 않습니다.**](#2-컨테이너에서-수행한-작업은-다른-컨테이너에-영향을-주지-않습니다)
  - [**컨테이너에서 수행한 작업은 다른 컨테이너에 영향을 주지 않습니다.**](#컨테이너에서-수행한-작업은-다른-컨테이너에-영향을-주지-않습니다)
  - [컨테이너의 상태 변경을 다른 컨테이너에 반영하려면](#컨테이너의-상태-변경을-다른-컨테이너에-반영하려면)
  - [파일을 유지하려면 호스트 머신과 공유하세요.](#파일을-유지하려면-호스트-머신과-공유하세요)
  - [**요약**](#요약-3)
- [컨테이너에 연결하기](#컨테이너에-연결하기)
  - [컨테이너 내에서 명령 실행하기](#컨테이너-내에서-명령-실행하기)
    - [옵션 설명](#옵션-설명-2)
  - [실행 중인 컨테이너에서 명령 실행하기](#실행-중인-컨테이너에서-명령-실행하기)
  - [컨테이너에 연결하기](#컨테이너에-연결하기-1)
  - [(참고) 컨테이너에 SSH 연결에 대한 오해](#참고-컨테이너에-ssh-연결에-대한-오해)
  - [요약](#요약-4)

---

# 컨테이너의 기초

컨테이너를 조작하는 몇 가지 명령어를 사용하여 컨테이너를 시작하고 중지할 수 있습니다.

명령어 목록을 외우는 것만으로는 이해도 향상에 어려움이 있습니다.

그럼에도 불구하고 기본적인 작업은 최소한 알아두어야 합니다.

이제 특정 용도에 따라 다르게 사용되는 Docker 기본 조작을 배워보겠습니다.

## 컨테이너 실행 - container run

새로운 버전
```
$ docker container run [옵션] <이미지> [명령]
```

예전 버전
```
$ docker run [옵션] <이미지> [명령]
```

## 컨테이너 목록 확인 - container ls

새로운 버전
```
$ docker container ls [옵션]
```

예전 버전
```
$ docker ps [옵션]
```

### 옵션 설명:
- `-a` 또는 `--all`: 모든 컨테이너 표시 (실행 중이지 않은 컨테이너 포함)

## 컨테이너 중지 - container stop

새로운 버전
```
$ docker container stop [옵션] <컨테이너>
```

예전 버전
```
$ docker stop [옵션] <컨테이너>
```

## 컨테이너 삭제 - container rm

새로운 버전
```
$ docker container rm [옵션] <컨테이너>
```

예전 버전
```
$ docker rm [옵션] <컨테이너>
```

### 옵션 설명:
- `-f` 또는 `--force`: 실행 중인 컨테이너 강제 삭제 (중지 및 삭제를 한 번에 수행)

--- 

## 컨테이너 실행

Nginx라는 웹 서버를 `container run` 명령어를 사용하여 컨테이너로 실행해보겠습니다.

새로운 버전
```
$ docker container run [옵션] <이미지> [명령]
```

예전 버전
```
$ docker run [옵션] <이미지> [명령]
```

먼저 최소한의 옵션으로 컨테이너를 실행해 보겠습니다.

단순히 실행만 하고 싶으므로 `<image>`에는 `nginx`만 지정하겠습니다.

그러나 완전히 동작하지 않는 것은 재미가 없으므로 `--publish` 옵션만 추가하겠습니다.

`--publish` 옵션을 사용하면 브라우저에서 확인할 수 있도록 웹 서버에 접근할 수 있습니다.

이에 대한 설명은 다음 시간에 "포트" 부분에서 다루겠습니다.

이를 바탕으로 다음 명령어로 컨테이너를 실행합니다:

```
$ docker container run --publish 8080:80 nginx
Unable to find image 'nginx:latest' locally
latest: Pulling from library/nginx
59f5764b1f6d: Pull complete
f7bd43626fa7: Pull complete
2df415630b2f: Pull complete
059f9f6918db: Pull complete
df91ff398a83: Pull complete
e75b854d63f1: Pull complete
4b88df8a13cd: Pull complete
Digest: sha256:6db391d1c0cfb30588ba0bf72ea999404f2764febf0f1f196acd5867ac7efa7e
Status: Downloaded newer image for nginx:latest
/docker-entrypoint.sh: /docker-entrypoint.d/ is not empty, will attempt to perform configuration
/docker-entrypoint.sh: Looking for shell scripts in /docker-entrypoint.d/
/docker-entrypoint.sh: Launching /docker-entrypoint.d/10-listen-on-ipv6-by-default.sh
10-listen-on-ipv6-by-default.sh: info: Getting the checksum of /etc/nginx/conf.d/default.conf
10-listen-on-ipv6-by-default.sh: info: Enabled listen on IPv6 in /etc/nginx/conf.d/default.conf
/docker-entrypoint.sh: Sourcing /docker-entrypoint.d/15-local-resolvers.envsh
/docker-entrypoint.sh: Launching /docker-entrypoint.d/20-envsubst-on-templates.sh
/docker-entrypoint.sh: Launching /docker-entrypoint.d/30-tune-worker-processes.sh
/docker-entrypoint.sh: Configuration complete; ready for start up
2024/04/06 01:41:34 [notice] 1#1: using the "epoll" event method
2024/04/06 01:41:34 [notice] 1#1: nginx/1.25.4
2024/04/06 01:41:34 [notice] 1#1: built by gcc 12.2.0 (Debian 12.2.0-14)
2024/04/06 01:41:34 [notice] 1#1: OS: Linux 6.6.16-linuxkit
2024/04/06 01:41:34 [notice] 1#1: getrlimit(RLIMIT_NOFILE): 1048576:1048576
2024/04/06 01:41:34 [notice] 1#1: start worker processes
2024/04/06 01:41:34 [notice] 1#1: start worker process 28
2024/04/06 01:41:34 [notice] 1#1: start worker process 29
2024/04/06 01:41:34 [notice] 1#1: start worker process 30
2024/04/06 01:41:34 [notice] 1#1: start worker process 31
2024/04/06 01:41:34 [notice] 1#1: start worker process 32
2024/04/06 01:41:34 [notice] 1#1: start worker process 33
2024/04/06 01:41:34 [notice] 1#1: start worker process 34
2024/04/06 01:41:34 [notice] 1#1: start worker process 35
```

`[notice] 1#1: start worker processes` 메시지와 함께 터미널이 조작 불가능해지면 실행이 성공한 것입니다.

브라우저에서 http://localhost:8080에 접속해 보세요.

다음과 같은 화면이 나타나면 실행한 컨테이너의 웹 서버에 접근할 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgyaKuB7XysbB3I_o5Xdt595AVIV5OwsDrZl67U_TTepcDCPJE_5K4kauF6_WIUOfdwflMiVyo6lhPnK5KfMut5vklobU1zIJrgzp1lBJh0b6vpz8pZc6lPrlm69sNMVnL0c22UIwku66oAgbknqfNeMshpq9TncTkRYH2Jv8cTvGJdp8MVQn7uD5LHoq0)

컨테이너 자체는 가상 서버가 아니지만, 실행한 컨테이너(격리 영역) 내에서 Nginx 웹 서버가 실행되고 있습니다.

이미지에서 컨테이너를 시작했으므로 현재 상황은 다음과 같이 나타낼 수 있습니다:

![](https://blogger.googleusercontent.com/img/a/AVvXsEji1BFKgHOGl9xbBhTaxZz4OaQaBPlXlCUN2InmIsjM8ntptAkjIgnsAI-FZpACuMPW_-EbofZMEf5iPGvKHkcNSzspk-bTUthmZGd98Gcj0Xy4s2gO8AeVF72e-7JhgAqZisLL-6X4DBPjGCHICyXSt3ATIp9AqTCdhDdyo7emHH17X6mntWZTSuQD-ug)

---

## 실행 중인 컨테이너 목록 확인

컨테이너 목록을 확인하려면 `container ls` 명령어를 사용합니다.

```
$ docker container ls [옵션]
```

`container run`을 실행한 탭을 그대로 두고 새로운 탭을 열어 컨테이너 목록을 확인해 보겠습니다.

특별한 옵션을 지정하지 않아도 되므로 다음 명령어로 컨테이너 목록을 확인합니다:

```
$ docker container ls
```

다음과 같은 결과가 표시됩니다:

```
CONTAINER ID   IMAGE     COMMAND                  CREATED         STATUS         PORTS                  NAMES
f4032101bb8c   nginx     "/docker-entrypoint.…"   6 minutes ago   Up 6 minutes   0.0.0.0:8080->80/tcp   zen_pasteur
```

`IMAGE`가 `nginx`인 컨테이너가 하나 실행되었음을 확인할 수 있습니다.

`CONTAINER ID`는 `f4032101bb8c`이며, `NAMES`는 `zen_pasteur`입니다.

여기서 `NAMES`는 컨테이너를 실행할 때마다 무작위로 할당됩니다.

컨테이너 목록을 확인한 후 `CONTAINER ID`가 `f4032101bb8c`인 상태를 다음과 같이 나타낼 수 있습니다:

![](https://blogger.googleusercontent.com/img/a/AVvXsEhgX5WrvK2IdLIsmndFnoj7eP36IOqhsH3EeRW0eWIIYRbj-QFK7TdTawdqNveRDk1RmpT2rpU84B8D_H85TxkP4gv5tz_gqStJKUEk5zPSEr3f5yEZcA8KL4XqlwNt7JZBmhqIikyPUCmWVgj0mKsXIiIHPQgGTUxy5kMx18vs8pHyURgS7wceWVR-QnQ)

---

## 실행 중인 컨테이너 중지

Nginx를 사용한 작업이 끝나면 컨테이너를 중지하려면 `container stop` 명령어를 사용합니다.

```
$ docker container stop [옵션] <컨테이너>
```

`container stop`에는 대부분의 경우 옵션이 필요하지 않으므로 대상 `<컨테이너>`를 CONTAINER ID 또는 NAMES로 지정하여 실행할 수 있습니다.

이를 바탕으로 다음 명령어로 컨테이너를 중지합니다.

(CONTAINER ID는 본인의 터미널에서 확인한 값입니다.)

```
$ docker container stop \
  f4032101bb8c
```

컨테이너가 정상적으로 중지되면 더 이상 http://localhost:8080에 접속해도 아무 내용도 표시되지 않습니다.

실행 중인 컨테이너 목록을 확인해도 Nginx 컨테이너가 더 이상 표시되지 않습니다.

```
$ docker container ls
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES

```

컨테이너가 실행 중이었지만 중지 명령을 받아 현재 상황은 다음과 같이 나타낼 수 있습니다:

![](https://blogger.googleusercontent.com/img/a/AVvXsEgU4YXFERcgT5FF-j9Uz64_sQgvMdHpLkxRjtOsjtg8JkhPEgs8P7epsoR7d2TkbHqUKtfSlgkyvnD7GebPs6qOyM8fF2V-tvVkfnZrN1d1rGNr6vFV9U2YUtBEUreevYWzpXjBZUppXKgZnPREaqHQySjmi8ttAKkjn2Zs83M5HvvKSWD9qAZMnWVNSIg)

---

## 모든 컨테이너 목록 확인

컨테이너는 중지되어도 삭제되기 전까지 호스트 머신에 정보로 남아 있으며, 다시 시작할 수도 있습니다.

중지된 컨테이너를 포함하여 모든 컨테이너 목록을 확인하려면 `container ls`에 `--all` 또는 `-a` 옵션을 추가하여 실행합니다.


```
$ docker container ls \
    --all
```

다음과 같은 결과가 표시됩니다:

```
docker container ls \
    --all
CONTAINER ID   IMAGE                             COMMAND                  CREATED          STATUS                     PORTS     NAMES
f4032101bb8c   nginx                             "/docker-entrypoint.…"   15 minutes ago   Exited (0) 5 minutes ago             zen_pasteur
```

`IMAGE`가 `nginx`인 컨테이너가 하나 실행되었음을 확인할 수 있습니다.

`CONTAINER ID`는 `f4032101bb8c`이며, `NAMES`는 `zen_pasteur`입니다.

이는 컨테이너를 실행할 때마다 무작위로 할당됩니다.

`--all` 옵션을 사용하지 않은 경우의 확인 범위는 다음과 같습니다:

```sh
docker container ls
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```

`--all` 옵션을 사용한 경우의 확인 범위는 다음과 같이 나타낼 수 있습니다:

![](https://blogger.googleusercontent.com/img/a/AVvXsEhbArZiDUl64zQ7mZJxn8vAN1Nkeqe7cgPPMKVdJD36CYBSFk3KkZQwKroJDfBpIC2XCxGyjpe7mRfGtp7S8W820sHRDqdDIU2q8lXQm_5u1hYZjcICdYnC2JnMQH49Iy1mGu07MziBpl_ZbM4iksaxF7rvbP1YlISxltlRqwskMH4-ctLJc97fmnIA8eo)

---

## 컨테이너 삭제

컨테이너를 삭제하려면 `container rm`을 사용합니다.

```
$ docker container rm [옵션] <컨테이너>
```

`container stop`과 마찬가지로 `<컨테이너>`를 지정하는 명령어이므로, `container ls`에서 확인한 CONTAINER ID를 사용하여 실행합니다. (CONTAINER ID는 본인의 터미널에서 확인한 값입니다.)

```
$ docker container rm \
    f4032101bb8c
```

이제 컨테이너가 완전히 삭제되었습니다.

컨테이너 목록을 확인해도 더 이상 Nginx 컨테이너가 표시되지 않습니다.

```
$ docker container ls \
    --all
CONTAINER ID   IMAGE                             COMMAND   CREATED      STATUS                  PORTS     NAMES
```

컨테이너가 실행 중이었지만 중지 명령을 받아 현재 상황은 다음과 같이 나타낼 수 있습니다:

![](https://blogger.googleusercontent.com/img/a/AVvXsEg2Hcjap5m2sNIvT7Ppv7R_6_dj6oFk-zRuDtmwgo0G7JW1BlaJFi1HHNRx0_IziV5VKXIsMPralot7rAf5mtH8PP_5LKROTT45uw6uG2sNILCIPNzzTM0716BWRQU6cqiiS-xbFko6dPTqfxRjUXidKB0RMhMo1vw5eIyYFYoTUmcS-CvOWRcewCpQLK0)

## 실행 중인 컨테이너를 중지하지 않고 바로 삭제하기

`container stop`과 `container rm`을 다음 명령어로 한 번에 실행할 수 있습니다.

```
$ docker container rm \
    --force           \
    <컨테이너>
```

즉시 삭제할 의도로 중지된 컨테이너를 중지할 때 이 명령어를 사용하면 편리합니다.

중지된 컨테이너에 강제 삭제 명령을 내렸으므로 현재 상황은 다음과 같이 나타낼 수 있습니다:

![](https://blogger.googleusercontent.com/img/a/AVvXsEjaCoZxzWICvJ1m8JVEkus4j0vnJobtcwsqG6h78U-pDZBW2869K47FB5zIRvuz8Et_I8hNlpZw_VxadXavTXvgdZ-48FC0xXZft_2yhF7TELy_o8-9I_w2rLsdAH3ysT8kSs5SQp1tzR-7XjuDaAcLI85e3wvCHRM8ZQgkxWl1vJzyu2rTWOsutxvcpWA)

## **정지**할 것인지 **삭제**할 것인지

"**정지된 컨테이너**는 다시 시작할 수 있지만, 저는 거의 다시 시작을 하지 않습니다."

그래서 저는 `container stop`을 사용하지 않고 `container rm --force`를 사용하거나, 앞으로 배울 "컨테이너 시작 시 기본 지정"에서 설명하듯 `container run`의 `--rm` 옵션을 사용하여 컨테이너를 즉시 삭제합니다.

컨테이너는 가볍고 일회용이라는 컨셉이기 때문에 "편하게 시작하고 작업이 끝나면 삭제하고, 다시 필요하면 다시 시작한다"는 접근 방식이 간단하고 좋다고 생각합니다.

## 요약

아래는 컨테이너 작업에 관한 간결한 요약입니다.

- 컨테이너 시작: container run
- 컨테이너 목록 확인: container ls
- 실행 중인 컨테이너 정지: container stop
- 정지된 컨테이너 삭제: container rm
- 실행 중인 컨테이너 삭제: container rm --force

---

# 컨테이너 시작 시 기본 옵션

컨테이너를 시작하고 중지하는 방법을 이해했다면, 이제 `container run` 명령의 옵션에 대해 배워봅시다.

이 페이지에서는 특정 용도에 따라 사용되는 기본적인 작업에 대해 학습합니다.

이 페이지에서 처음 등장하는 명령과 옵션

- **컨테이너 시작하기 - `container run`**
    - `-i` 또는 `--interactive`: 컨테이너의 표준 입력에 연결
    - `-t` 또는 `--tty`: 가상 터미널 할당
    - `-d` 또는 `--detach`: 백그라운드에서 실행
    - `--rm`: 중지된 컨테이너 자동 삭제 (중복 정보 충돌 방지)
    - `--name`: 컨테이너에 이름 지정 (쉽게 참조 가능)
    - `--platform`: 이미지 아키텍처 명시 (M1 Mac에서 필요한 경우)

## 컨테이너 상호작용

이전에 사용한 Nginx 컨테이너는 시작하면 Nginx가 실행되지만, Ubuntu 컨테이너는 시작하면 bash를 조작할 수 있습니다.

bash와 같은 상호작용이 필요한 경우 호스트 머신의 터미널 입력을 받기 위해 `--interactive` 옵션과 컨테이너의 가상 출력 장소를 만들기 위해 `--tty` 옵션이 필요합니다.

호스트 머신에서 다음과 같이 실행합니다.

```bash
$ docker container run \
    --interactive      \
    --tty              \
    ubuntu:20.04
```

Docker뿐만 아니라 Linux 명령의 옵션은 `-h` 또는 `--help`, `-v` 또는 `--version`과 같이 동일한 옵션을 짧게 또는 길게 지정할 수 있습니다.

짧은 옵션은 여러 개를 연속해서 지정할 수 있으며, 위의 명령은 이전 옵션과 결합하여 최소한으로 다음과 같이 실행할 수 있습니다.

```bash
$ docker run -it ubuntu:20.04
```

이 글에서는 명확하고 긴 새 명령을 사용하는 의도로 모든 옵션을 긴 형태로 지정합니다.

변경된 프롬프트는 Ubuntu 컨테이너의 bash입니다.

컨테이너는 가상 서버가 아닌 Docker에 의해 생성된 Linux의 네임스페이스입니다.

Docker를 통해 마치 다른 OS처럼 만들어져 OS 정보 등을 확인할 수 있습니다.

컨테이너에서 다음 명령으로 OS 정보를 확인할 수 있습니다.

```bash
# cat /etc/lsb-release

DISTRIB_ID=Ubuntu
DISTRIB_RELEASE=20.04
DISTRIB_CODENAME=focal
DISTRIB_DESCRIPTION="Ubuntu 20.04.3 LTS"
```

이후에는 $ 프롬프트를 호스트 머신, # 프롬프트를 컨테이

---

## 백그라운드에서 컨테이너를 실행하기

컨테이너를 **백그라운드에서 실행**하려면 `--detach` 옵션을 사용할 수 있습니다.

이 옵션을 사용하면 Nginx 컨테이너와 같이 백그라운드에서 실행되는 상주 프로세스를 시작할 때 터미널이 컨테이너 출력으로 블로킹되지 않습니다.

호스트 머신에서 다음과 같이 실행합니다:

```bash
$ docker container run \
    --detach           \
    --publish 8080:80  \
    nginx

606ccda5b16a0f6ebb8496e20a2abc1da40a48ab4f43aef8bc6d0117ce65fad1
```

이제 터미널에는 많은 출력이 표시되지 않고 컨테이너 ID만 표시됩니다.

이 상태에서 컨테이너 목록을 확인하거나 http://localhost:8080에 액세스하면 Nginx 웹 서버에 액세스할 수 있습니다.

컨테이너 목록 확인, 중지 또는 삭제와 같은 작업은 포그라운드에서 실행했을 때와 동일하게 수행할 수 있습니다. 

백그라운드에서 실행 중인 컨테이너를 잊지 않고 강제로 삭제해 보세요.

호스트 머신에서 다음과 같이 실행합니다:

```bash
$ docker container rm \
    --force           \
    606ccda5b16a0f6ebb8496e20a2abc1da40a48ab4f43aef8bc6d0117ce65fad1
```

이 글에서는 기본적으로 `--detach` 옵션을 지정하도록 하겠지만, 작동 여부를 확인하지 않은 명령을 시행하면서 조립 단계에서는 지정하지 않는 것이 테스트하기 쉽습니다.

상황에 맞게 추가하거나 제거하세요.

또한 당연하지만 bash와 같은 상호작용이 필요한 경우 이 옵션을 사용하지 않습니다.

## 컨테이너가 중지될 때 자동으로 삭제하기

컨테이너가 중지될 때 자동으로 삭제하려면 `--rm` 옵션을 사용하세요.

중지된 컨테이너를 다시 사용하지 않을 경우 이 옵션을 사용하여 중지된 컨테이너가 계속 쌓이는 상태를 방지할 수 있습니다.

호스트 머신에서 다음과 같이 실행합니다:

```bash
$ docker container run \
    --rm               \
    --detach           \
    --publish 8080:80  \
    nginx

974b0b8a40d8d1a3c5b693720982c1a47ba948272e124da75c822f0ad0f4e875
```

`--rm` 옵션을 지정한 컨테이너는 중지되면 자동으로 삭제되는 것을 확인할 수 있습니다.

호스트 머신에서 다음과 같이 실행합니다:

```bash
$ docker container stop \
    974b0b8a40d8d1a3c5b693720982c1a47ba948272e124da75c822f0ad0f4e875
    
$ docker container ls \
    --all
    
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```

이 글에서는 중지된 컨테이너를 조작하지 않으므로 `--rm` 옵션은 항상 지정되도록 하겠습니다.

또한 `--name` 옵션과 함께 자주 사용됩니다.


## 컨테이너에 이름을 지정하기

컨테이너에 **이름을 지정**하려면 `--name` 옵션을 사용할 수 있습니다. 이 옵션을 사용하면 매번 무작위로 할당되는 컨테이너 이름을 지정할 수 있습니다.

호스트 머신에서 다음과 같이 실행합니다:

```bash
$ docker container run \
    --name web-server  \
    --rm               \
    --detach           \
    --publish 8080:80  \
    nginx:1.21

1144303f9d718b35bf7a354f51872dde18bffbcdd8ca900a2f7efb5c9fe62d97
```

(보이지 않는 부분이 있지만) NAMES가 `web-server`로 설정되었음을 확인할 수 있습니다.

호스트 머신에서 다음과 같이 실행합니다:

```bash
$ docker container ls

CONTAINER ID   IMAGE          COMMAND                  CREATED          STATUS          PORTS                  NAMES
1144303f9d71   nginx:1.21     "/docker-entrypoint.…"   35 seconds ago   Up 35 seconds   0.0.0.0:8080->80/tcp   web-server
```

이제 NAMES를 사용하여 컨테이너를 지정할 수 있으므로 컨테이너 ID를 찾는 번거로움을 덜 수 있습니다.

호스트 머신에서 다음과 같이 실행합니다:

```bash
$ docker container stop \
    web-server
```

한 가지 주의할 점은 컨테이너 지정에 사용되는 NAMES는 고유해야 하므로 동일한 컨테이너 이름으로 여러 컨테이너를 시작할 수 없습니다. 이 카운트에는 중지된 컨테이너도 포함되므로 이름을 지정한 컨테이너는 중지가 아닌 삭제를 수행하도록 설정하는 것이 불필요한 오류를 줄일 수 있습니다.

따라서 `--name` 옵션은 보통 `--rm` 옵션과 함께 사용됩니다.

이 글에서는 명확하고 무작위성이 제거되는 이유로 `--name` 옵션을 항상 지정하도록 하겠습니다.

## 컨테이너 시작 시 동작 변경하기

컨테이너를 시작할 때의 동작을 변경하려면 옵션은 아니지만 `container run`의 `[command]`는 정확히 이해해야 하는 중요한 인수입니다.

따라서 여기서 확인해보겠습니다.

```
$ docker container run [option] <image> [command]
```

지금까지 사용한 Nginx 컨테이너는 시작하면 Nginx가 실행되고, Ubuntu 컨테이너는 bash가 실행되었습니다.

이 차이는 이미지의 차이에 의한 것으로, 이미지에는 컨테이너를 시작할 때 어떤 명령을 실행할지 미리 기록되어 있습니다. =

이 글에서는 이를 편의상 "기본 명령"이라고 부릅니다.

`container run`에서 `[command]`를 지정하지 않으면 이미지마다 정해진 기본 명령이 실행됩니다.

그러나 `[command]`를 지정하면 기본 명령이 아닌 원하는 명령을 실행할 수 있습니다.

이 글에서는 이를 편의상 "지정된 명령"이라고 부릅니다.

이를 통해 Nginx 컨테이너에서 nginx를 실행하거나 bash를 실행할 수 있게 됩니다.

Nginx 컨테이너를 기본 명령 (nginx)으로 시작하는 예시 1:

```bash
$ docker container run      \
    --name nginx-web-server \
    --rm                    \
    --detach                \
    nginx
```

Nginx 컨테이너를 지정된 명령 (bash)으로 시작하는 예시 2:

```bash
$ docker container run \
    --name nginx-bash  \
    --rm               \
    --interactive      \
    --tty              \
    nginx              \
    bash
```

여기서 중요한 점은 이미지와 컨테이너 간의 관계를 올바르게 이해하는 것입니다.

예시 2에서 Nginx 컨테이너를 bash로 시작했지만, 이는 예시 1과 다른 Nginx 컨테이너의 bash입니다.

이미지를 OS나 가상 서버와 같은 것으로 생각하면 "이미지에 명령을 내려 nginx를 시작하고 SSH를 통해 bash를 사용한다"와 같은 오해를 할 수 있습니다.

하지만 이는 전혀 다릅니다.

`container run`을 실행할 때마다 새로운 컨테이너가 이미지에서 생성되는 것을 명심해야 합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEill0p9-sAu7zl7VaaSiQ8JTPKpB_1Yh4lhFL44N-YZtbDBQUf1JXFYvH01GxVLJmrFDJNsaP46JCCmNMIJ7KOobbQI7MLWeC5xAHo7RUVMF193T2esgDW4QQtwMaCVQnHPHaE16UqPs5-Svl2TzxP6jDPyH8y9NhG9Bl35rjVaLjbOHn2Ui28K4C07mio)

예시 1의 컨테이너에서 bash를 시작하려면 `container exec`를 사용해야 합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjXH3H6GpxJvPZoEa7wbDJNZDI0X19CaHLgGN8Q_dhcO01gL2_L1UZmZVDFXlZckP60VfetdS7W6ZlBwkVLsUAWaeTjtsDnU45kiwrhXz_Tvba15oX05zsRDOn9_Gre1FP84RRwps9RN5KdKFAMlSSL4bcJNVrZc2ckp1PtMK7Zok0PDp0FqbQYnn_XSxU)

여러 번 강조하지만, 무엇을 어떻게 하는지 잘 고민하면 이러한 오해를 피하고 원활하게 이해할 수 있습니다.

---

## 컨테이너의 OS 아키텍처를 지정하기

이 글에서는 세부 사항은 생략하지만, OS 아키텍처를 명시적으로 지정해야 하는 경우 `--platform` 옵션을 사용합니다.

예를 들어 Docker Hub의 Ubuntu 이미지를 살펴보면 OS/ARCH에 여러 후보가 있는 것을 알 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgdXIGPysrfsUXFzgunqTqQjB_xJNHNFBX-y0lIqUYgOPypQOeLQuw87zZtxMm-Q1RpuZMrrOy9nq5WiGPHgdWHxLwUh2cuCGFvK12ggIc7FhrP8aXhyCHZ0tJ2uNznej54hSuAEWjQH7-VdNsEihWsQ0SAItdrN1auZjQhAmQXFWNmehmeUetFVanUOps)

일반적으로 Intel 또는 AMD CPU를 사용하는 경우(즉, Windows 및 Intel Mac의 경우) `linux/amd64`를, ARM CPU를 사용하는 경우(M1 Mac의 경우) Docker가 자동으로 선택합니다.

`linux/amd64` 또는 유사한 이미지는 거의 항상 존재하지만, `linux/arm64/v8`은 존재하지 않는 경우가 흔합니다.

ARM CPU를 사용하지만 `linux/arm64/v8`이 존재하지 않는 경우 `--platform` 옵션을 사용하여 강제로 `linux/amd64` 이미지를 사용합니다.

`--platform=linux/amd64`는 Intel 또는 AMD CPU 사용자에게는 기본 설정과 동일한 결과이므로 영향을 미치지 않습니다.

또한 `--platform=linux/arm64/v8`을 명시적으로 지정하는 경우가 많지 않습니다.

이 글에서는 필요한 경우에만 `--platform=linux/amd64`을 지정하도록 하겠습니다.

다음 표를 참조하여 상황에 맞게 해석하고 대응하세요.

| 옵션                    | 자신의 머신           | 결과       |
|-------------------------|-----------------------|------------|
| `--platform=linux/amd64` | Intel 또는 AMD CPU    | 의미 없음  |
|                         |                       | 삭제 가능  |
| `--platform=linux/amd64` | ARM CPU               | 중요       |
|                         |                       | 그대로 지정 |
| `--platform=linux/arm64/v8` | Intel 또는 AMD CPU | 거의 보이지 않음 |
|                         |                       | 이 글에는 없음 |
| `--platform=linux/arm64/v8` | ARM CPU             | 의미 없음  |
|                         |                       | 거의 보이지 않음 |
|                         |                       | 이 글에는 없음 |

참고로, 호스트 머신과 일치하는 OS/ARCH가 존재하지 않는 경우 `--platform` 옵션만으로 충분한지는 이미지에 따라 다릅니다.

## 요약

지금까지 배운걸 요약하면:

- `--interactive` 옵션은 상호작용이 필요한 경우에 지정하고, 항상 지정해도 문제가 없습니다.
- `--tty` 옵션은 상호작용이 필요한 경우에 지정하고, 항상 지정해도 문제가 없습니다.
- `--detach` 옵션은 상호작용이 필요하지 않은 경우에 지정하며, 디버깅 등의 상황에서는 제외하는 것이 좋습니다.
- `--rm` 옵션은 항상 지정합니다. 중지된 컨테이너를 활용할지 여부에 따라 결정합니다.
- `--name` 옵션은 항상 지정합니다. 이름을 지정하면 충돌을 피하기 쉽습니다.
- `--platform` 옵션은 필요한 경우에만 지정합니다. Intel 또는 AMD CPU의 경우 고려할 필요가 없으며, ARM CPU의 경우 상황에 따라 다릅니다. 이 글에서는 필요한 경우에만 `--platform=linux/amd64`을 지정합니다.

---

# 컨테이너 상태 변화

## **컨테이너 상태 및 프로세스 이해하기**

컨테이너가 의도한 대로 작동하는지 확인하기 위해 컨테이너의 상태 변화를 정확히 이해해 보겠습니다.

컨테이너가 왜 중단되는지 이해하지 못하면 "실행했던 컨테이너가 사라졌다" 또는 "터미널이 멈춰서 실행에 실패했다"와 같은 오해를 할 수 있습니다.

## **컨테이너와 프로세스**

컨테이너를 실행하는 방법을 배웠으니, 몇 가지 컨테이너를 실행하고 프로세스를 확인해 보겠습니다.

### **예제 1: Ubuntu 컨테이너를 기본 명령어 (bash)로 실행**

Ubuntu 컨테이너를 실행하고 기본 명령어인 bash를 사용하여 컨테이너 내의 프로세스 목록을 ps 명령어로 확인하면, PID 1이 bash인 것을 알 수 있습니다.

또한 ps 명령어 자체도 프로세스로 존재합니다.

```bash
$ docker container run \
    --name ubuntu1     \
    --rm               \
    --interactive      \
    --tty              \
    ubuntu:20.04

# ps
  PID TTY          TIME CMD
    1 pts/0    00:00:00 bash
   10 pts/0    00:00:00 ps
```

### **예제 2: Nginx 컨테이너를 기본 명령어 (nginx)로 실행**

Nginx 컨테이너를 실행하고 기본 명령어인 웹 서버가 실행된 상태에서 PID 1은 nginx의 시작 명령어입니다.

또한 ps 명령어를 실행하기 위해 container exec로 실행한 bash 프로세스도 존재합니다.

```bash
$ docker container run \
    --name nginx1      \
    --rm               \
    --detach           \
    nginx
    
$ docker container exec \
    --interactive       \
    --tty               \
    nginx1              \
    bash

# 컨테이너 내에 ps 명령어가 없으므로 설치
# apt update
# apt install -y procps

# ps x
  PID TTY      STAT   TIME COMMAND
    1 ?        Ss     0:00 nginx: master process nginx -g daemon off;
   36 pts/0    Ss     0:00 bash
  387 pts/0    R+     0:00 ps x
```

마지막으로, 컨테이너를 실행할 때 --tty 옵션을 지정하지 않았기 때문에 TTY가 ?로 표시되었습니다.

### **예제 3: Nginx 컨테이너를 지정한 명령 (bash)으로 실행**

Nginx 컨테이너를 기본 명령어인 nginx가 아닌 지정한 명령어인 bash로 실행한 상태에서 PID 1은 bash입니다.

또한 ps 프로세스는 존재하지만 nginx 프로세스는 없습니다.

```bash
$ docker container run \
    --name nginx2      \
    --rm               \
    --interactive      \
    --tty              \
    nginx              \
    bash

# 컨테이너 내에 ps 명령어가 없으므로 설치
# apt update
# apt install -y procps

# ps
  PID TTY          TIME CMD
    1 pts/0    00:00:00 bash
  346 pts/0    00:00:00 ps
```

## **컨테이너와 프로세스의 관계**

컨테이너는 Namespace를 통해 격리된 프로세스라는 것을 "Docker를 이해하기 위한 핵심"에서 배웠습니다.

또한 컨테이너에는 이미지에 의해 정의된 기본 명령이 있으며, container run 실행 시 임의의 명령을 지정할 수 있다는 것을 "컨테이너 시작 시 기본 지정"에서 배웠습니다.

이 페이지에서 확인한 프로세스와 이전 페이지에서 배운 내용을 통합하면 다음과 같이 이해할 수 있습니다.

- 컨테이너는 특정한 명령을 실행하기 위해 시작됩니다.
- 이 명령은 기본 명령이거나 지정한 명령 중 하나이며, PID가 1이 됩니다.
- 여러 컨테이너의 PID = 1은 Linux의 Namespace 기능으로 인해 충돌하지 않습니다.

이 글에서는 편의상 PID = 1인 프로세스를 "메인 프로세스"라고 하고, 이를 시작하는 명령을 "메인 명령"이라고 부릅니다.

컨테이너는 메인 프로세스를 실행하기 위해 시작된다는 점을 기억하면 컨테이너를 더 원활하게 이해할 수 있습니다.

예를 들어 컨테이너가 가상 서버가 아닌 단순한 1개의 프로세스로 보인다면 "Ubuntu에 PHP, MySQL 및 Apache를 설치한 컨테이너를 만들자"가 아니라 "PHP, MySQL 및 Apache가 필요하므로 3개의 컨테이너를 만들자"라는 생각으로 자연스럽게 전환될 것입니다.

또한 메인 프로세스가 종료된 컨테이너는 자동으로 중지된다는 중요한 사실을 이해하게 될 것입니다.

## **컨테이너가 종료되는 경우**

이전에 배운 내용을 기반으로 컨테이너가 종료되는 두 가지 주요 이유를 설명하겠습니다.

### 1. **컨테이너를 직접 중지하는 경우**

Nginx 컨테이너를 기본 명령어 (nginx)로 다음과 같이 실행합니다.

```bash
$ docker container run \
    --name nginx3      \
    --rm               \
    --detach           \
    nginx:1.21
```

실행된 Nginx는 웹 서버이므로 메인 프로세스가 종료되지 않는 한 계속 실행됩니다.

메인 프로세스는 자동으로 종료되지 않으므로 컨테이너는 중지하거나 삭제할 때까지 계속 실행됩니다.

### 2. **메인 프로세스가 종료되는 경우**

이 경우 두 가지 하위 케이스로 나누어 확인합니다.

#### 2-A. **사용자가 메인 프로세스를 직접 종료하는 경우**

동일한 Nginx 컨테이너를 지정한 명령어 (bash)로 다음과 같이 실행합니다.

```bash
$ docker container run \
    --name nginx4      \
    --rm               \
    --interactive      \
    --tty              \
    nginx:1.21         \
    bash

# 어떤 작업 수행

# 어떤 작업 수행

# exit
```

실행된 bash는 exit할 수 있으므로 메인 프로세스는 언젠가 종료됩니다.

메인 프로세스가 종료되면 컨테이너도 연쇄적으로 중지됩니다.

#### 2-B. **메인 프로세스가 자동으로 종료되는 경우**

마지막으로 동일한 Nginx 컨테이너를 지정한 명령어 (ls)로 다음과 같이 실행합니다.

```bash
$ docker container run \
    --name nginx5      \
    --rm               \
    nginx:1.21         \
    ls /etc/nginx

$
```

실행된 ls는 결과만 표시하므로 메인 프로세스는 즉시 종료됩니다.

메인 프로세스가 즉시 종료되므로 컨테이너도 즉시 중지됩니다.

컨테이너가 실행되는 동안 실제로 존재하는 시간은 거의 없으므로 실행 중인 컨테이너에 강제 삭제 명령을 내리는 것은 불가능합니다.


## **즉시 중지와 백그라운드 실행에 대하여**

즉시 중지와 백그라운드 실행 (`--detach` 옵션)을 혼동하지 않도록 주의해야 합니다.

컨테이너의 상태나 컨테이너 시작의 성공 여부는 `container run` 이후 터미널이 멈췄는지 여부로 판단해서는 안 됩니다.

간단한 기억 방법을 사용하지 않도록 주의하세요.

| 메인 명령어 | 옵션 | 터미널 | 컨테이너 | 메인 프로세스 | 시작 명령어 실행 결과 |
|------------|------|--------|----------|--------------|---------------------|
| nginx      |      | 멈춤   | 실행 중 | 실행 중     | 정상                  |
| nginx      | --detach | 멈추지 않음 | 실행 중 | 실행 중 | 정상                  |
| ls         |      | 멈추지 않음 | 중지됨 | 종료됨     | 정상 (종료)           |

## **요약**

- 컨테이너는 메인 프로세스 (PID = 1)를 실행하기 위해 시작됩니다.
- 컨테이너가 종료되는 이유는 크게 두 가지입니다.
    1. 컨테이너를 중지하는 경우
    2. 메인 프로세스가 종료되는 경우
- 즉시 중지와 백그라운드 실행 (`--detach` 옵션)을 혼동하지 않도록 주의하세요.

---

# 컨테이너 상태 유지

컨테이너의 상태에 대해 두 가지 관점에서 살펴보겠습니다.

## 1. **동일한 이미지에서 시작하더라도 다른 컨테이너입니다.**

이는 `CONTAINER ID`를 확인하면 명확합니다.

첫 번째 Nginx 컨테이너를 기본 명령어 (nginx)로 다음과 같이 실행합니다.

```bash
$ docker container run \
    --name nginx1      \
    --rm               \
    --detach           \
    nginx:1.21
```

두 번째 Nginx 컨테이너를 기본 명령어 (nginx)로 다음과 같이 실행합니다.

```bash
$ docker container run \
    --name nginx2      \
    --rm               \
    --detach           \
    nginx:1.21
```

컨테이너 목록을 확인하면 서로 다른 `CONTAINER ID`를 가진 두 개의 컨테이너가 실행 중임을 확인할 수 있습니다.

```bash
$ docker container ls

CONTAINER ID   IMAGE          COMMAND                  CREATED         STATUS         PORTS     NAMES
770f08892af6   nginx:1.21     "/docker-entrypoint.…"   4 seconds ago   Up 3 seconds   80/tcp    nginx2
abff10020aa4   nginx:1.21     "/docker-entrypoint.…"   7 seconds ago   Up 6 seconds   80/tcp    nginx1
```

이름은 같지만, 이전과는 다른 `CONTAINER ID`를 가지므로 더 이상 다른 컨테이너입니다.

## 2. **컨테이너에서 수행한 작업은 다른 컨테이너에 영향을 주지 않습니다.**

컨테이너는 독립적으로 실행되며 다른 컨테이너에 영향을 미치지 않습니다.

예를 들어, 첫 번째 Nginx 컨테이너에서 파일을 생성하거나 수정하더라도 두 번째 Nginx 컨테이너에는 영향을 주지 않습니다.

이는 컨테이너의 격리된 환경과 독립성 때문입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjrN2pCT6DfvESCJXAFOBjU4ugmRf8scM52o0a1V3JobR4lUX3Ff3ag_3XljikLZ-4lDKIKWdAJuosTY1MAPaj9H9GSYJUcantkKH5GMqfxhZ6afja-TBm_CqoTdYO4-lcLVO1TlzOF7cKzTHfFmYGVPwK0ZCBIWAA25ZPTstLa7JOurgt7oq78M-NA6So)

## **컨테이너에서 수행한 작업은 다른 컨테이너에 영향을 주지 않습니다.**

이를 확인하기 위해 다음과 같이 시도해 보겠습니다.

1. 첫 번째 Ubuntu 컨테이너를 기본 명령어 (bash)로 실행합니다.


```bash
$ docker container run \
    --name ubuntu1     \
    --rm               \
    --interactive      \
    --tty              \
    ubuntu:20.04
```

2. 두 번째 Ubuntu 컨테이너를 기본 명령어 (bash)로 실행합니다.

```bash
$ docker container run \
    --name ubuntu2     \
    --rm               \
    --interactive      \
    --tty              \
    ubuntu:20.04
```

3. ubuntu1 컨테이너에서 `vi`를 설치하고 `~/hello.txt` 파일을 생성합니다.

컨테이너 (ubuntu1):
```bash
# apt update
# apt install -y vim

# vi ~/hello.txt
(hello world를 입력하고 :wq로 저장하고 종료)
```

4. 이제 ubuntu2 컨테이너에서 `vi` 명령어를 실행하면 `vi`가 존재하지 않음을 확인할 수 있습니다.

컨테이너 (ubuntu2):
```bash
# vi

bash: vi: command not found
```

5. 또한 `~/hello.txt` 파일도 존재하지 않습니다.

컨테이너 (ubuntu2):
```bash
# cat ~/hello.txt

cat: ~/hello.txt: No such file or directory
```

이를 통해 컨테이너에서 수행한 작업이 다른 컨테이너에 영향을 주지 않음을 확인할 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgKNCAaVK6t36m8JKkfRsaq2l2yL1s51zi_97-DeAHKRtd-KZYhjaKBstuw4hhxDiEYgpfxZA8K14UAnIV4TBz0J7rnSYgZzm8_px3B5maH1Rn_9ThV6pa_42PsEMuO2YPoLEzlyzumWK2tG7QuK-GY14MXNfiOdV2vFBHKUMspWy4POboZfvUzvgv_QBM)

## 컨테이너의 상태 변경을 다른 컨테이너에 반영하려면

이를 위해 크게 두 가지 방법이 있습니다.

모든 컨테이너에 구성 변경을 반영하려면 이미지를 만듭니다.

어떤 컨테이너에서든 vi를 사용하고 싶다면 “Dockerfile에서 vi가 포함된 이미지를 만들어 두는” 방법을 사용할 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgb5ishEzfUNDbKrwQ_fi_HXvgaBPZEeytX5tULr_i-hfysp_V_K6ik3qHG-aH-VrBxgE_GLH1RHGqMdJBOYFBNC_IA4wO-TSgsbnCpkqtsS6p2ZEuKlG6mrDpVsH4yWM76_hW2GM270ZUUY-WvYTj1aDDt3c32aLsOe5ziBDss6JQiexY2jyWhWZHKODg)

이렇게 하면 "매번 컨테이너를 시작할 때마다 vi를 설치하는 것"이 아니라 “vi가 포함된 컨테이너를 시작하는” 것이 가능합니다.

## 파일을 유지하려면 호스트 머신과 공유하세요.

`~/hello.txt` 파일을 유지하고 싶다면 "호스트 머신과 파일을 공유"하는 방법을 사용할 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjQNgQx9vLaaQiFw5nohm1SNWc2u9KD3GBK7cYinfeIjd3aiKz2uCKDaRJjNOYgSntkO1poJMTkhgogEEJE2kX2H042LUQzs08jIpDe8xEh8jlZ_XS4K8eQIjtHTiqW9y_Wq7bOickhcWsfdakkBhpg_ojZyPkdSlxNP0R4MMKxv8ISiFfR8k2eUZoC1Zo)

이렇게 하면 "매번 컨테이너를 시작할 때마다 파일을 생성하는 것"이 아니라 “컨테이너를 시작한 후 호스트 머신의 파일을 사용하는” 것이 가능합니다.

자세한 내용은 다음에 배울 "볼륨"과 "바인드 마운트"에서 설명하겠습니다.

## **요약**

- 컨테이너는 매번 시작할 때마다 다른 컨테이너입니다.
- 컨테이너에서 수행한 작업은 다른 컨테이너에 영향을 주지 않습니다.
- 다른 컨테이너에 변경 사항을 반영하려면 어떤 처리가 필요합니다.
    - Dockerfile
    - 볼륨 또는 바인드 마운트

---

# 컨테이너에 연결하기

container exec 명령어는 컨테이너 내에서 프로그램을 실행하거나 상호작용하는 데 사용되는 중요한 도구입니다.

컨테이너를 개발하거나 배포할 때 현재 상태를 확인하거나 문제를 디버깅하는 데 유용합니다.

이 글에서는 docker exec 명령어에 대해 배우고 실행 중인 Docker 컨테이너에서 명령을 실행하고 대화형 쉘을 얻는 방법을 알아보겠습니다.

## 컨테이너 내에서 명령 실행하기

`docker container exec`

새로운 버전
```bash
$ docker container exec [옵션] <컨테이너> 명령
```

예전 버전
```bash
$ docker exec [옵션] <컨테이너> 명령
```

### 옵션 설명

- `-i`, `--interactive`: 컨테이너의 표준 입력에 연결합니다. 컨테이너를 대화식으로 조작할 수 있습니다.
- `-t`, `--tty`: 의사 터미널을 할당합니다. 컨테이너를 대화식으로 조작할 수 있습니다.

## 실행 중인 컨테이너에서 명령 실행하기

`container exec`는 실행 중인 컨테이너에 명령을 보내는 명령입니다.

이 명령은 컨테이너 내에서 Linux 명령을 실행하는데 사용됩니다.

예를 들어, Ubuntu 컨테이너를 기본 명령 (bash)으로 시작하고 `~/hello.txt` 파일을 생성해 보겠습니다.

호스트 머신에서 다음과 같이 실행합니다:

```bash
$ docker container run \
    --name ubuntu1     \
    --rm               \
    --interactive      \
    --tty              \
    ubuntu:20.04

# echo 'hello world' > ~/hello.txt
```

이제 이 bash 세션을 종료하지 않고 다른 탭에서 컨테이너에 `cat` 명령을 실행해 보겠습니다:

```bash
$ docker container exec \
    ubuntu1             \
    cat ~/hello.txt
```

결과로 `hello world`를 확인할 수 있습니다.

이렇게 파일을 확인하는 것은 당연한 일일 수 있지만, 다음과 같은 중요한 차이점을 이해하지 않으면 불필요한 문제가 발생할 수 있습니다:

```bash
$ docker container run \
    ubuntu:20.04       \
    cat ~/hello.txt

cat: ~/hello.txt: No such file or directory
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEjSfQ3m2G-vzKePUYdm_eR1ahbLRYAlsqE3LybONd5djJf9Eeye0WSPZvLK21NXrvAFUjvyd0gkIOXQf95Y8c1bkN3-yLmnL_i93JT1_KMPr8HeGjxtXNH4vL9x63vKw1F5UOmH0ZavaIAvL6ltkGk_bWCAwptlJt8Inb1tTVoz2dYwg0qb4V5g8L4s9Gg)

`container run`과 `container exec`는 모두 Linux 명령을 지정할 수 있지만, 실행 중인 컨테이너에 명령을 보내는 것과 이미지에서 컨테이너를 시작하는 것은 결정적으로 다릅니다.

## 컨테이너에 연결하기

실제로 구축하거나 디버깅할 때는 한 번에 하나씩 `ls`와 같은 명령을 실행하는 대신 실행 중인 컨테이너의 bash를 직접 사용하고 싶을 때가 있습니다.

`bash`도 `cat`이나 `ls`와 같은 Linux 프로세스이므로 `container exec`를 사용하여 실행할 수 있습니다.

다음 명령을 사용하여 `ubuntu1` 컨테이너에 `bash`를 실행해 보겠습니다.

상호 작용을 위해 `container run`과 동일한 옵션이 필요합니다.

호스트 머신에서 다음과 같이 실행합니다:

```bash
$ docker container exec  \
    --interactive        \
    --tty                \
    ubuntu1              \
    bash
```

프롬프트가 `#`로 변경되면 Ubuntu 컨테이너의 `bash`로 전환되었습니다.

일반적으로와 같이 작업할 수 있습니다.

컨테이너 내에서 다음과 같은 명령을 실행해 보겠습니다:

```bash
# pwd
/

# date
Tue Feb 15 15:18:23 UTC 2022

# whoami
root

# cat ~/hello.txt
hello world

# exit
```

`container exec`는 다음과 같은 상황에서 매우 유용합니다.

이를 제대로 이해하고 사용할 수 있도록 노력해 보세요:

- 컨테이너 내의 로그를 확인하고 싶을 때
- Dockerfile을 작성하기 전에 `bash`에서 설치 명령을 시험해 보고 싶을 때
- MySQL 데이터베이스 서버의 클라이언트 `mysql`을 직접 조작하고 싶을 때

`ubuntu1` 컨테이너는 더 이상 중지하지 않아도 됩니다.

호스트 머신에서 다음과 같이 실행합니다:

```bash
$ docker container stop \
    ubuntu1
```

## (참고) 컨테이너에 SSH 연결에 대한 오해

컨테이너나 `container exec`에 대해 정확히 이해하지 못하면 Docker 컨테이너 SSH와 같은 검색을 하게 될 수 있습니다.

실제로 이를 검색하면 컨테이너에 `sshd`라는 SSH를 수신 대기하는 데몬 프로세스를 실행하는 절차도 찾을 수 있습니다.

그러나 컨테이너에 SSH 연결은 다음과 같은 이유로 권장되지 않습니다:

- SSH를 위한 확장을 추가한 이미지를 만들어야 합니다.
- 이미지나 Dockerfile과 별도로 키, 암호 등을 관리해야 하며, 취약성 대응과 같은 비용이 증가합니다.
- SSH 지원이 포함된 이미지를 그대로 배포하면 원래는 없었던 취약성이 증가할 수 있습니다.

SSH를 사용하고 싶은 생각은 이미지를 가상 서버와 같은 것으로 간주하거나 `container exec`와 `container run`의 차이를 이해하지 못했을 때 발생하기 쉽습니다.

저도 처음에는 Docker 컨테이너 SSH로 Google 검색을 한 기억이 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjXH3H6GpxJvPZoEa7wbDJNZDI0X19CaHLgGN8Q_dhcO01gL2_L1UZmZVDFXlZckP60VfetdS7W6ZlBwkVLsUAWaeTjtsDnU45kiwrhXz_Tvba15oX05zsRDOn9_Gre1FP84RRwps9RN5KdKFAMlSSL4bcJNVrZc2ckp1PtMK7Zok0PDp0FqbQYnn_XSxU)

작업을 수행하려면 `container exec`를 사용하여 컨테이너 내에서 `bash`를 실행하면 됩니다.


## 요약

요약하자면:

- `container exec`를 사용하여 실행 중인 컨테이너에 명령을 보낼 수 있습니다.
- `container run`과 `container exec`를 혼동하지 말아야 합니다.
- SSH 연결은 하지 말고 bash 명령어를 되도록 사용합시다.


