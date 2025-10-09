---
slug: 2024-04-06-docker-tutorial-understanding-docker-image-and-dockerfile
title: Docker 강좌 3편. Docker 이미지 및 Dockerfile 기초
date: 2024-04-06 06:03:11.676000+00:00
summary: Docker 이미지 및 Dockerfile 기초
tags: ["docker", "image", "dockerfile"]
contributors: []
draft: false
---

안녕하세요?

세번째 Docker 강좌입니다.

전체적인 강좌 리스트입니다.

1. [Docker 강좌 1편. 가상화와 Docker 기초 개념 이해하기](https://mycodings.fly.dev/blog/2024-04-06-docker-tutorial-understanding-virtualization-and-docker)

2. [Docker 강좌 2편. 실무에서 쓰이는 Docker 컨테이너 완벽 가이드](https://mycodings.fly.dev/blog/2024-04-06-docker-tutorial-docker-container-comprehensive-guide)

3. [Docker 강좌 3편. Docker 이미지 및 Dockerfile 기초](https://mycodings.fly.dev/blog/2024-04-06-docker-tutorial-understanding-docker-image-and-dockerfile)

4. [Docker 강좌 4편. Docker 볼륨 (Volume) 사용 방법과 원리](https://mycodings.fly.dev/blog/2024-04-06-docker-volume-usage-and-principles)

5. [Docker 강좌 5편. Docker 바인드 마운트와 포트 publish](https://mycodings.fly.dev/blog/2024-04-06-docker-tutorial-understanding-bind-mount-and-port-publish)

6. [Docker 강좌 6편. Docker Compose 완벽 가이드](https://mycodings.fly.dev/blog/2024-04-06-docker-tutorial-docker-compose-complete-guide)

---

** 목 차 **

- [Docker image](#docker-image)
  - [이미지 목록 확인](#이미지-목록-확인)
  - [이미지 검색 방법](#이미지-검색-방법)
  - [태그를 사용하여 이미지 지정하기](#태그를-사용하여-이미지-지정하기)
  - [**로컬에 이미 다운로드된 이미지 목록을 확인하는 방법**](#로컬에-이미-다운로드된-이미지-목록을-확인하는-방법)
  - [**이미지의 내용을 파악하는 방법**](#이미지의-내용을-파악하는-방법)
    - [1. **지원하는 아키텍처 확인하기**:](#1-지원하는-아키텍처-확인하기)
    - [2. **레이어 확인하기**:](#2-레이어-확인하기)
- [Dockerfile 기초](#dockerfile-기초)
  - [Docker 이미지 빌드하기](#docker-이미지-빌드하기)
  - [이미지 레이어 확인하기](#이미지-레이어-확인하기)
  - [Dockerfile의 필요성과 유용성](#dockerfile의-필요성과-유용성)
  - [Dockerfile의 기본 명령어](#dockerfile의-기본-명령어)
  - [Dockerfile 작성](#dockerfile-작성)
  - [FROM 베이스 이미지 지정](#from-베이스-이미지-지정)
  - [RUN 임의의 명령 실행](#run-임의의-명령-실행)
  - [COPY 호스트 머신 파일을 이미지에 추가](#copy-호스트-머신-파일을-이미지에-추가)
  - [CMD 기본 명령 지정](#cmd-기본-명령-지정)
  - [확인](#확인)
  - [이미지 빌드](#이미지-빌드)
  - [Dockerfile을 여러 개 다루는 방법](#dockerfile을-여러-개-다루는-방법)
  - [이미지 레이어 확인하기](#이미지-레이어-확인하기-1)
  - [RUN 명령을 몇 개의 레이어로 나눌까요?](#run-명령을-몇-개의-레이어로-나눌까요)
  - [요약](#요약)

---

# Docker image

## 이미지 목록 확인

`image ls` 명령어로 이미지 목록을 확인할 수 있습니다.

새로운 버전
```
$ docker image ls [옵션]
```

예전 버전
```
$ docker images [옵션]
```

## 이미지 검색 방법

기본적으로 이미지는 Docker Hub에서 검색하여 선택합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjsvWtvOwtd1vQJw7E0IXnTmPzdQuwhpgiQ_yvCOIyLOp6hHP0RcZ3XW7ixKiZikHe3FzDEvBJyGYOBkHVMA_11aQEiH7QMxBsS0M2DtYzyi8o8ji3ciSeEVHsz4uU_K_zZt4jVMAmrf_8O_ShAH1W8WTmfSMxMU8Yv5HWUrtX3LRDrnI-xeMoJ_lxs6zI)

![](https://blogger.googleusercontent.com/img/a/AVvXsEjDeFnFLJcCsEnAw-rmf7WaZO30wkq5_DZ1qfCoAuMJsGf0WOY6j3yITk3Zq91-M1s8R9hvyNIKIEjZMLPHDpg7DTPQRVOLXK8ml7yn_e3uwVE2xt0uXcrdU2FKiRXZ2sZu8s3RHspmfE1une_zPFMnur2dKKgiaeERL_q3ooDKBpJ_NPSz4rYDNI2CFaE)

Tags 탭에서 원하는 버전이나 구성을 선택하고 해당 명령어를 사용하여 이미지를 가져오고 실행할 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjEiO87-8eaUmpbssKZVUXFKP_fqy-6CdRnFPe0Z425-x18IuhfItKVgygsT67yM5jbn1zFgDUsAUF3ASIFYHU-LVNpMn2yGS0YGkGHB1fGLGcf_WS92kOogt67rfKnRDQOOGGaRAL8nl1dNWJsQKTcUQRDUM6ofEr6NZkHo3nk9UElrIQLtN1bYaczuGM)

이미지를 가져오려면 Docker Hub에 나와 있는대로 pull을 사용합니다.
(pull은 이전 명령어입니다)

새로운 버전
```
$ docker image pull [옵션] <이미지>
```

그러나 container run은 여러 명령어를 하나로 묶은 편리한 명령어이므로, 기본적으로 image pull만 따로 실행할 필요는 없습니다.

이 글에서는 image pull을 사용하지 않고 container run으로 한꺼번에 실행하는 것으로 합니다.

## 태그를 사용하여 이미지 지정하기

container run과 같은 명령어에서 `<이미지>`를 지정할 때 `IMAGE ID`나 `REPOSITORY:TAG` 형식 등 여러 가지 방법으로 지정할 수 있습니다.

새로운 버전
```
$ docker container run [옵션] <이미지> [명령어]
```

`<이미지>`를 지정하는 방법은 여러 가지가 있지만, 대부분의 경우 사람이 이해하기 쉬운 `REPOSITORY:TAG` 형식을 사용합니다.

REPOSITORY는 예를 들어 ubuntu이며, 이에 버전이나 구성을 나타내는 TAG가 붙어 있습니다.
TAG는 ubuntu의 경우 22.04, 23.10, 24.04 등이 있습니다.

예를 들어 `ubuntu:22.04`나 `ubuntu:21.10` 이미지에서 컨테이너를 실행하여 `/etc/lsb-release` 파일을 확인해보면, 이미지의 REPOSITORY는 동일하지만 다른 구성의 컨테이너가 실행되고 있음을 확인할 수 있습니다.

```sh
$ docker container run \
    --name ubuntu1     \
    --rm               \
    ubuntu:22.04       \
    cat /etc/lsb-release

DISTRIB_ID=Ubuntu
DISTRIB_RELEASE=22.04
DISTRIB_CODENAME=jammy
DISTRIB_DESCRIPTION="Ubuntu Jammy Jellyfish (development branch)"
```

```sh
$ docker container run \
    --name ubuntu2     \
    --rm               \
    ubuntu:21.10       \
    cat /etc/lsb-release

DISTRIB_ID=Ubuntu
DISTRIB_RELEASE=21.10
DISTRIB_CODENAME=impish
DISTRIB_DESCRIPTION="Ubuntu 21.10"
```

또한 TAG를 생략하면 latest가 지정된 것으로 간주됩니다.

2024년 4월 기준으로 `ubuntu:latest`와 ubuntu의 DISTRIB_RELEASE가 모두 22.04.4임을 확인할 수 있습니다.


```
$ docker container run \
    --name ubuntu3     \
    --rm               \
    ubuntu:latest      \
    cat /etc/lsb-release

DISTRIB_ID=Ubuntu
DISTRIB_RELEASE=22.04
DISTRIB_CODENAME=jammy
DISTRIB_DESCRIPTION="Ubuntu 22.04.4 LTS"
```

```
$ docker container run \
    --name ubuntu4     \
    --rm               \
    ubuntu             \
    cat /etc/lsb-release

DISTRIB_ID=Ubuntu
DISTRIB_RELEASE=22.04
DISTRIB_CODENAME=jammy
DISTRIB_DESCRIPTION="Ubuntu 22.04.4 LTS"
```

---

## **로컬에 이미 다운로드된 이미지 목록을 확인하는 방법**

호스트 머신에서 이미지 목록을 확인하려면 `image ls`를 사용합니다.

```bash
$ docker image ls

REPOSITORY                     TAG       IMAGE ID       CREATED       SIZE
ubuntu                         22.04     2b7cc08dcdbb   5 weeks ago   69.2MB
ubuntu                         latest    2b7cc08dcdbb   5 weeks ago   69.2MB
ubuntu                         24.04     b441975c4aaa   5 weeks ago   100MB
ubuntu                         23.10     a1b040c5e70c   7 weeks ago   93.3MB
nginx                          latest    070027a3cbe0   7 weeks ago   192MB
```

**image pull**은 실행하지 않았지만, **container run**을 통해 이미지를 로컬에 가져온 것을 확인할 수 있습니다.

또한, `ubuntu:22.04`와 `ubuntu:latest`의 **IMAGE ID**가 완전히 동일하다는 것도 확인할 수 있습니다.

이는 두 컨테이너가 "실행해보면 비슷하다"가 아니라 "정확히 동일한 이미지"를 의미합니다.

---

## **이미지의 내용을 파악하는 방법**

### 1. **지원하는 아키텍처 확인하기**:

이미지가 지원하는 호스트 운영 체제 아키텍처는 다음 부분에서 확인할 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEg4oy4hlgBMsFAWDaUPyxX2q0D1lmwNHjdfeLHHM7-4VTtXSooQfVZ5QQy9Pu-Yrkz7vQxwFnEg3u0hlYL82iQUUA0cZYdXemCXmlDnrna3UWDtm8-AFpH52T5gfBKQAKHt9h0R4fwzbg96Peyks36avez2GNPOyONHxJBbuECXN0cRM3kTXOiFBMaiub4)

### 2. **레이어 확인하기**:

**DIGEST** 중 하나를 선택하여 자세한 정보 화면을 열면 이미지의 레이어를 확인할 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhSzCpoNiIei4xTdT_ia8PWSEq2iWmJjnSoh0KtS4QtBI3y4SSI1jGkvbl12cJnUJZf16fzAmXuDkYXHngp9tbuxUWVE9N-pLFIydvrVWzS5yR8Qo6I1AVVkOjcuMtlGggXZ0ENgKZFNdIKNwcxaZA_MpcM2bxUsoNdwgYS238p8j1cRptkQhZnjWlKcYo)

`CMD ["/bin/bash"]` 표기에서 기본 명령이 `bash`임을 알 수 있습니다.

이 이미지는 간단한 구성이지만, 설정 절차나 환경 변수를 읽을 수 있는 경우도 있습니다.

---

# Dockerfile 기초

## Docker 이미지 빌드하기

새로운 커맨드:
```
$ docker image build [옵션] <경로>
```

기존 커맨드:
```
$ docker build [옵션] <경로>
```

**옵션 설명:**
- `-f, --file`: Dockerfile을 지정합니다. 여러 개의 Dockerfile을 사용할 때 유용합니다.
- `-t, --tag`: 빌드 결과에 태그를 부여합니다. 사람들이 쉽게 이해할 수 있도록 합니다.


## 이미지 레이어 확인하기

새로운 커맨드:
```
$ docker image history [옵션] <이미지>
```

기존 커맨드:
```
$ docker history [옵션] <이미지>
```

## Dockerfile의 필요성과 유용성

- 컨테이너 내에서 수행한 작업은 컨테이너가 종료되면 모두 사라집니다.
- 이미지는 .img와 같은 실제 형태가 없으며, 레이어라는 정보의 쌓임으로 구성됩니다.
- 그러나 Docker Hub에 있는 공식 이미지는 가볍게 유지하기 위해 최소한의 레이어만 쌓여 있으며 매우 기능이 제한적입니다. 예를 들어 Ubuntu 컨테이너에는 vi나 curl이 포함되어 있지 않습니다.

따라서 "공식 이미지로는 충분한 설정을 얻을 수 없는 경우 미리 필요한 설정을 마친 이미지를 직접 만들어 두는" 접근 방식을 취하게 됩니다.

Dockerfile은 기존 이미지(= 레이어들)에 추가 레이어를 쌓을 수 있으므로 OS 설정과 같은 작업을 간편하게 수행할 수 있습니다.

## Dockerfile의 기본 명령어

Dockerfile에는 여러 명령어가 있지만, 모두 한 번에 기억할 필요는 없으므로 대표적인 몇 가지를 배워보겠습니다.

| 명령어 | 효과 |
|-------|------|
| FROM | 기본 이미지를 지정합니다. |
| RUN | 임의의 명령을 실행합니다. |
| COPY | 호스트 머신의 파일을 이미지에 추가합니다. |
| CMD | 기본 명령을 지정합니다. |

이제 Dockerfile을 작성하면서 하나씩 설명해보겠습니다.

vi에서 행 번호가 표시되는 설정이 적용된, 시간을 표시해주는 이미지를 만들어보겠습니다.

## Dockerfile 작성

Dockerfile은 하나의 이미지를 위해 하나만 준비합니다.

호스트 머신의 어느 위치에서든 상관없으므로 적절한 디렉토리를 만들고 Dockerfile(확장자 없음)을 작성하십시오.

```
$ touch Dockerfile
```

이 Dockerfile은 이 페이지에서만 사용됩니다.

사용할 편집기는 자유롭게 선택하시면 됩니다.

## FROM 베이스 이미지 지정

FROM은 베이스 이미지를 지정하는 명령입니다.

다음과 같이 Dockerfile에 FROM 명령을 추가하면 "이제부터 `ubuntu:24.04` 레이어 위에 추가적인 레이어를 쌓아 올릴 거야"라는 의미가 됩니다.

Dockerfile
```
FROM ubuntu:24.04
```

Dockerfile은 FROM으로 시작합니다.

## RUN 임의의 명령 실행

RUN은 Linux 명령을 실행하고 그 결과를 레이어로 만드는 명령입니다.

`ubuntu:24.04` 이미지에 vi를 설치하는 레이어를 추가하려면 다음과 같이 Dockerfile에 RUN 명령을 추가합니다.

Dockerfile
```
FROM ubuntu:24.04

RUN apt update
RUN apt install -y vim
```

> RUN에서 apt를 사용할지, 아니면 yum 등 다른 패키지 관리자를 사용할지는 베이스 이미지에 따라 달라집니다.

> `ubuntu:24.04`는 당연히 Ubuntu이지만, `nginx:latest`와 같은 이미지는 먼저 bash를 실행하여 OS 및 패키지 관리자를 조사하는 것이 기본입니다.

RUN을 통해 "컨테이너를 실행할 때마다 vi를 설치"하는 번거로움을 해결할 수 있습니다.

## COPY 호스트 머신 파일을 이미지에 추가

COPY는 호스트 머신의 파일을 이미지에 추가하는 명령입니다.

ubuntu 이미지에 줄 번호를 표시하는 설정이 기록된 .vimrc 파일을 배치하려면 먼저 호스트 머신에 .vimrc 파일을 만듭니다.

.vimrc (호스트 머신)
```
set number
```

그런 다음 Dockerfile에 COPY 명령을 추가합니다.

Dockerfile
```
FROM ubuntu:24.04

RUN apt update
RUN apt install -y vim

COPY .vimrc /root/.vimrc
```

COPY를 통해 "컨테이너를 실행할 때마다 .vimrc를 생성"하는 번거로움을 해결할 수 있습니다.

## CMD 기본 명령 지정

CMD는 이미지의 기본 명령을 설정하는 명령입니다.

일반적인 이미지에서 bash를 실행하는 대신 특정 형식으로 현재 시간을 표시하는 이미지를 만들고 싶다면 다음과 같이 Dockerfile에 CMD 명령을 추가합니다.

Dockerfile
```
FROM ubuntu:24.04

RUN apt update
RUN apt install -y vim

COPY .vimrc /root/.vimrc

CMD date +"%Y/%m/%d %H:%M:%S ( UTC )"
```

CMD를 통해 `container run에서 매번 date +"%Y/%m/%d %H:%M:%S ( UTC )`와 같은 복잡한 인수를 지정하는 번거로움을 해결할 수 있습니다.

## 확인

Dockerfile과 .vimrc를 작성했습니다.

호스트 머신에서 확인하면 다음과 같아야 합니다.

호스트 머신
```
$ tree -a .

.
|-- .vimrc
`-- Dockerfile
```

Dockerfile
```
FROM ubuntu:20.04

RUN apt update
RUN apt install -y vim

COPY .vimrc /root/.vimrc

CMD date +"%Y/%m/%d %H:%M:%S ( UTC )"
```

.vimrc (호스트 머신)
```
set number
```

---

## 이미지 빌드

Dockerfile이 완성되었으니 이제 이미지를 빌드해 보겠습니다.

새로운 명령어는 다음과 같습니다.

```
$ docker image build [option] <path>
```

`[option]`에는 `--tag` 옵션을 사용하여 `my-ubuntu:date`라는 태그를 지정합니다.

태그를 지정하지 않고 빌드하면 무작위 문자열의 IMAGE ID만 지정할 수 있어 불편합니다.

`<path>`는 COPY에 사용할 파일이 있는 디렉토리인 `.`을 지정합니다.

이를 기반으로 다음 명령어로 이미지를 빌드합니다.

이 명령어는 Dockerfile이 있는 디렉토리에서 실행하시면 됩니다.

```bash
$ docker image build     \
    --tag my-ubuntu:date \
    .
```

만약 다음과 같은 출력이 나오면 성공입니다.

```
docker image build     \
        --tag my-ubuntu:date \
        .

[+] Building 12.7s (9/9) FINISHED                                                            docker:desktop-linux
 => [internal] load build definition from Dockerfile                                                         0.0s
 => => transferring dockerfile: 197B                                                                         0.0s
 => [internal] load metadata for docker.io/library/ubuntu:24.04                                              0.0s
 => [internal] load .dockerignore                                                                            0.0s
 => => transferring context: 2B                                                                              0.0s
 => [1/4] FROM docker.io/library/ubuntu:24.04                                                                0.0s
 => [internal] load build context                                                                            0.0s
 => => transferring context: 82B                                                                             0.0s
 => CACHED [2/4] RUN apt update                                                                              0.0s
 => [3/4] RUN apt install -y vim                                                                            12.4s
 => [4/4] COPY .vimrc /root/.vimrc                                                                           0.0s
 => exporting to image                                                                                       0.2s
 => => exporting layers                                                                                      0.2s
 => => writing image sha256:92ab94d8c50b0557cb19c833b8d80078b69cd1c7b74015497d512f79718aac81                 0.0s
 => => naming to docker.io/library/my-ubuntu:date                                                            0.0s
```

`docker image ls` 명령어로 이미지 목록을 확인하면 `my-ubuntu:date` 이미지가 생성된 것을 확인할 수 있습니다.

```bash
$ docker image ls

REPOSITORY                     TAG       IMAGE ID       CREATED          SIZE
my-ubuntu                      date      92ab94d8c50b   31 seconds ago   219MB
ubuntu                         22.04     2b7cc08dcdbb   5 weeks ago      69.2MB
ubuntu                         latest    2b7cc08dcdbb   5 weeks ago      69.2MB
ubuntu                         24.04     b441975c4aaa   5 weeks ago      100MB
ubuntu                         23.10     a1b040c5e70c   7 weeks ago      93.3MB
nginx                          latest    070027a3cbe0   7 weeks ago      192MB
```

이미지가 의도한 대로 생성되었는지 확인하기 위해 기본 명령어로 컨테이너를 실행해 보겠습니다.

```bash
$ docker container run \
    --name my-ubuntu1  \
    --rm               \
    my-ubuntu:date
```

위 명령을 실행하면 다음과 같은 결과가 나올 것입니다.

```
2024/04/06 05:42:59 ( UTC )
```

CMD에 지정한 기본 명령이 의도대로 실행되는 것을 확인할 수 있습니다.

다음으로 RUN과 COPY의 결과를 확인하기 위해 지정한 명령 (vi)으로 컨테이너를 실행해 보겠습니다.

```bash
$ docker container run \
    --name my-ubuntu2  \
    --rm               \
    --interactive      \
    --tty              \
    my-ubuntu:date     \
    vi
```

위 명령을 실행하면 줄 번호가 표시되는 vi 편집기가 실행될 것입니다.

기본적인 Dockerfile 작성과 이미지 빌드는 이와 같은 절차로 진행됩니다.

---

## Dockerfile을 여러 개 다루는 방법

Docker 이미지를 빌드할 때 Dockerfile 경로를 지정하지 않았다면 걱정하지 마세요.

이미지 빌드는 기본적으로 `./Dockerfile`을 사용합니다.

그러나 실제로 Docker를 사용하여 개발할 때는 "애플리케이션 컨테이너" 또는 "데이터베이스 컨테이너"와 같이 여러 컨테이너를 활용하게 됩니다.

이에 따라 Dockerfile도 여러 개가 필요하며, 일반적으로 Dockerfile과 COPY에 사용되는 파일은 이미지마다 디렉토리를 분리하여 관리하는 것이 일반적입니다.

이 페이지에서는 더 이상 Dockerfile을 생성하지 않겠지만, 디렉토리를 분리하는 방법만 확인해보겠습니다.

먼저 다음과 같이 `docker/date/` 디렉토리를 만들고, 이 페이지에서 생성한 Dockerfile과 .vimrc 파일을 해당 디렉토리로 이동합니다.

```
$ tree -a .

.
`-- docker
    `-- date
        |-- .vimrc
        `-- Dockerfile
```

이 디렉토리 구조에서 이미지를 빌드하려면 `image build` 명령에 `--file` 옵션을 추가하고 `<path>`를 변경해야 합니다.

```
$ docker image build              \
    --tag my-ubuntu:date          \
    --file docker/date/Dockerfile \
    docker/date
```

`--file` 옵션은 `./Dockerfile` 이외의 Dockerfile을 지정할 때 필요합니다.

다음으로 `<path>`는 COPY에서 사용할 파일의 상대 경로를 나타냅니다.

예를 들어 `COPY .vimrc /root/.vimrc`의 경우 `.vimrc`는 실행 디렉토리의 `<path>/.vimrc`로 해석됩니다.

.vimrc 파일을 이동했으므로, `<path>`를 `docker/date`로 지정합니다.

```
$ tree -a .

.                       $ docker image build [option] docker/date
`-- docker                                            ^^^^^^^^^^^
    `-- date
        |-- .vimrc
        `-- Dockerfile  COPY (./)(docker/date/).vimrc /root/.vimrc
                                  ^^^^^^^^^^^

image build에서 `.`를 사용하려면 COPY 부분을 조정하면 됩니다.


```
$ tree -a .

.                       $ docker image build [option] .
`-- docker                                            ^
    `-- date
        |-- .vimrc
        `-- Dockerfile  COPY (./)(./)docker/date/.vimrc /root/.vimrc
                                  ^

COPY와 `<path>`를 모두 `.`로 설정하려면 매번 이미지를 빌드할 때마다 `cd`를 변경해야 하므로 권장하지 않습니다.


```
.
`-- docker
    `-- date            $ docker image build [옵션] .
        |-- .vimrc                                    ^
        `-- Dockerfile  COPY (./docker/date/)(./).vimrc /root/.vimrc
                                              ^
```

여러 가지 방법이 있겠지만, 저는 이미지 빌드가 `.`로 간단하게 가능한 다음 방법을 자주 사용합니다.

```sh
COPY docker/date/.vimrc /root/.vimrc
```

디렉토리 이름(`docker/date`)을 변경하면 Dockerfile이 손상될 수 있으니 주의하셔야 합니다.

하지만 이런 상황은 드물기 때문에 큰 문제는 없을 겁니다.


## 이미지 레이어 확인하기

로컬에 존재하는 이미지의 레이어 정보는 `docker image history` 명령을 통해 확인할 수 있습니다.


```bash
$ docker image history [옵션] <이미지>
```

우선 `ubuntu:24.04`와 `my-ubuntu:date` 이미지의 레이어를 비교해보겠습니다.

호스트 머신에서 다음과 같이 입력해보세요:

```bash
$ docker image history ubuntu:24.04
```

결과는 다음과 같습니다:

```bash
$ docker image history ubuntu:24.04

IMAGE          CREATED       CREATED BY                                      SIZE      COMMENT
b441975c4aaa   5 weeks ago   /bin/sh -c #(nop)  CMD ["/bin/bash"]            0B
<missing>      5 weeks ago   /bin/sh -c #(nop) ADD file:d70383c2066380d51…   100MB
<missing>      5 weeks ago   /bin/sh -c #(nop)  LABEL org.opencontainers.…   0B
<missing>      5 weeks ago   /bin/sh -c #(nop)  LABEL org.opencontainers.…   0B
<missing>      5 weeks ago   /bin/sh -c #(nop)  ARG LAUNCHPAD_BUILD_ARCH     0B
<missing>      5 weeks ago   /bin/sh -c #(nop)  ARG RELEASE                  0B
```

다음으로 `my-ubuntu:date` 이미지의 레이어를 확인해보겠습니다:

```bash
$ docker image history my-ubuntu:date
```

결과는 다음과 같습니다:

```bash
$ docker image history my-ubuntu:date

IMAGE          CREATED          CREATED BY                                      SIZE      COMMENT
92ab94d8c50b   9 minutes ago    CMD ["/bin/sh" "-c" "date +\"%Y/%m/%d %H:%M:…   0B        buildkit.dockerfile.v0
<missing>      9 minutes ago    COPY .vimrc /root/.vimrc # buildkit             12B       buildkit.dockerfile.v0
<missing>      9 minutes ago    RUN /bin/sh -c apt install -y vim # buildkit    80.4MB    buildkit.dockerfile.v0
<missing>      10 minutes ago   RUN /bin/sh -c apt update # buildkit            37.8MB    buildkit.dockerfile.v0
<missing>      5 weeks ago      /bin/sh -c #(nop)  CMD ["/bin/bash"]            0B
<missing>      5 weeks ago      /bin/sh -c #(nop) ADD file:d70383c2066380d51…   100MB
<missing>      5 weeks ago      /bin/sh -c #(nop)  LABEL org.opencontainers.…   0B
<missing>      5 weeks ago      /bin/sh -c #(nop)  LABEL org.opencontainers.…   0B
<missing>      5 weeks ago      /bin/sh -c #(nop)  ARG LAUNCHPAD_BUILD_ARCH     0B
<missing>      5 weeks ago      /bin/sh -c #(nop)  ARG RELEASE                  0B
```

`my-ubuntu:date` 이미지는 `ubuntu:24.04`를 `FROM`으로 기반 이미지로 사용했기 때문에, `my-ubuntu:date`의 하위 레이어는 `ubuntu:24.04`와 동일합니다.

그 위에 Dockerfile에 작성한 `RUN`, `COPY`, `CMD` 명령들이 쌓여있는 것을 확인할 수 있습니다.

가장 위에는 이미지 빌드로 생성된 레이어에 IMAGE ID (`92ab94d8c50b`)가 할당되어 있습니다.

---

## RUN 명령을 몇 개의 레이어로 나눌까요?

약간 세부적인 내용이므로 이 책을 완독한 후에 이해하셔도 괜찮습니다.

일반적으로 우리가 보는 Dockerfile은 `RUN apt update && apt install -y vim`과 같이 하나의 `RUN` 명령에서 여러 Linux 명령을 연속해서 실행하는 경우가 많습니다.

이는 `RUN`이 명령의 결과를 레이어로 확정한다는 점을 고려하면 의도가 더 명확해집니다.

예를 들어 다음과 같은 가상의 Dockerfile이 있다고 가정해보겠습니다.

"Java 파일을 가져와 컴파일하여 JAR 파일을 얻고 싶지만 Java 파일 자체는 필요하지 않다"는 내용입니다.

```sh
RUN git clone https://github.com/suzuki-hoge/some-java-tool
RUN cd some-java-tool
RUN compile
RUN cp some-java-tool.jar some-dir
RUN cd ..
RUN rm -rf some-java-tool
```

`RUN`은 결과를 레이어로 확정하므로, `git clone`이 성공한 시점의 레이어가 이미지에 포함됩니다.

반면 다음 Dockerfile은 6개의 명령이 모두 완료된 후 하나의 레이어를 확정하므로 중간에 존재했던 파일은 이미지에 포함되지 않습니다.

```sh
RUN git clone https://github.com/foo/some-java-tool && \
    cd some-java-tool                               && \
    compile                                         && \
    cp some-java-tool.jar some-dir                  && \
    cd ..                                           && \
    rm -rf some-java-tool
```

이미지 크기를 고려해야 하는 경우 이러한 점을 주의해야 합니다.

또한 멀티 스테이지 빌드 (이 책에서는 설명하지 않음)를 활용하면 좋습니다.

또 다른 이유는 레이어가 캐시되는 점입니다.

다음과 같은 Dockerfile을 빌드한 후:

```sh
RUN apt update
RUN apt install -y vim
```

다음과 같이 Dockerfile을 변경하고 다시 빌드하면 문제가 발생할 수 있습니다.

```sh
RUN apt update
RUN apt install -y vim curl
```

변경된 레이어는 두 번째 `apt install` 명령뿐이므로 처음부터 다시 실행되지 않습니다.

다음과 같이 작성하면 첫 번째 레이어에 변경이 있었다고 판단되어 `apt update`가 다시 실행됩니다.

```sh
RUN apt update && apt install -y vim curl
```

반대로 `RUN`을 너무 많이 연결하면 Dockerfile 구축 중에 다음과 같은 단점이 발생할 수 있습니다.

- Linux 명령에 결함이 있어 `RUN`이 실패한 경우, 너무 많이 연결한 명령은 어디서 실패했는지 알기 매우 어렵습니다.
- 너무 많이 연결한 명령의 후반부에서 오류가 발생하면 캐시가 없으므로 처음부터 다시 실행됩니다.

"구축 중에는 분리하고 완성되면 연결하자"와 같이 상황에 맞게 `RUN`을 작성하는 것이 좋습니다.

## 요약

간결하게 정리하겠습니다.

- `FROM`은 기본 이미지를 지정합니다.
- `RUN`은 Linux 명령을 실행하여 레이어를 확정합니다.
- `COPY`는 호스트 머신의 파일을 이미지에 추가합니다.
- `CMD`는 기본 명령을 지정합니다.
- 이미지를 빌드할 때 `<path>`와 `COPY`를 조정하세요.
- `RUN`으로 확정되는 레이어의 단위를 결정할 때 다음 사항을 고려하세요.
    - 이미지 크기, 캐시 등의 이점
    - 구축 및 디버깅의 어려움 등의 단점
- `FROM`에서 지정한 이미지의 레이어 위에 Dockerfile에서 지정한 레이어가 쌓입니다.

---

