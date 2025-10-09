---
slug: 2024-04-06-docker-tutorial-understanding-bind-mount-and-port-publish
title: Docker 강좌 5편. 바인드 마운트와 포트 publish
date: 2024-04-06 10:13:55.086000+00:00
summary: Docker 바인드 마운트와 포트 publish
tags: ["docker", "bind mount", "port publish"]
contributors: []
draft: false
---

안녕하세요?

다섯번째 Docker 강좌입니다.

전체적인 강좌 리스트입니다.

1. [Docker 강좌 1편. 가상화와 Docker 기초 개념 이해하기](https://mycodings.fly.dev/blog/2024-04-06-docker-tutorial-understanding-virtualization-and-docker)

2. [Docker 강좌 2편. 실무에서 쓰이는 Docker 컨테이너 완벽 가이드](https://mycodings.fly.dev/blog/2024-04-06-docker-tutorial-docker-container-comprehensive-guide)

3. [Docker 강좌 3편. Docker 이미지 및 Dockerfile 기초](https://mycodings.fly.dev/blog/2024-04-06-docker-tutorial-understanding-docker-image-and-dockerfile)

4. [Docker 강좌 4편. Docker 볼륨 (Volume) 사용 방법과 원리](https://mycodings.fly.dev/blog/2024-04-06-docker-volume-usage-and-principles)

5. [Docker 강좌 5편. Docker 바인드 마운트와 포트 publish](https://mycodings.fly.dev/blog/2024-04-06-docker-tutorial-understanding-bind-mount-and-port-publish)

6. [Docker 강좌 6편. Docker Compose 완벽 가이드](https://mycodings.fly.dev/blog/2024-04-06-docker-tutorial-docker-compose-complete-guide)

---

** 목 차 **

- [Docker 강좌 5편. 바인드 마운트와 포트 publish](#docker-강좌-5편-바인드-마운트와-포트-publish)
  - [바인드 마운트란](#바인드-마운트란)
  - [컨테이너에 소스 코드 마운트하기](#컨테이너에-소스-코드-마운트하기)
    - [--volume 옵션을 이용한 마운트](#--volume-옵션을-이용한-마운트)
    - [--mount 옵션을 이용한 마운트](#--mount-옵션을-이용한-마운트)
    - [소스 코드가 마운트되었는지 확인하기](#소스-코드가-마운트되었는지-확인하기)
  - [바인드 마운트의 실체와 주의사항](#바인드-마운트의-실체와-주의사항)
  - [COPY와 바인드 마운트의 선택](#copy와-바인드-마운트의-선택)
  - [주요 특징](#주요-특징)
  - [포트 publish](#포트-publish)
    - [포트 공개란?](#포트-공개란)
    - [예](#예)

---

## 바인드 마운트란

바인드 마운트는 호스트 머신의 임의의 디렉토리를 컨테이너에 마운트하는 메커니즘입니다.

호스트 머신과 컨테이너 모두 파일 변경에 관심이 있는 경우 유용하며, 예를 들어 소스 코드 공유에 활용할 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgVMYHrO7jA-3CSlyITaBEf5VToqMLkxXqqvM-vUW-UssXlDZuVUVUdna1s2WWJ174zbHX9KjWpjulnt9H4pozIWY6aBFJkqNfA52J5Vk4S0yOTrUUaLnmX2fNyrjooz56U8HN1PluKpDng8D_q1PzfT36Xl-n7H1XuWHw2MET7RLY1VdRpDXdRMbTolBs)

소스 코드 디렉토리를 컨테이너에 바인드 마운트하여 호스트 머신 측과 공유하면, 호스트 머신에서 코드를 변경할 때 동기화나 전송이 필요하지 않습니다.


## 컨테이너에 소스 코드 마운트하기

바인드 마운트는 볼륨과 다르게 기존 디렉토리를 그대로 마운트하므로 사전 생성 등이 필요하지 않습니다.

바인드 마운트는 --volume 옵션과 --mount 옵션 어느 쪽이든 사용할 수 있습니다.

이전 '볼륨' 섹션에서 --mount 옵션을 사용하는 것이 좋다고 결론을 내렸지만, 기회가 되면 두 가지 방법을 모두 설명하겠습니다.

### --volume 옵션을 이용한 마운트

바인드 마운트를 수행할 때는 콜론(:)으로 구분하여 설정을 나열합니다.

첫 번째 설정은 볼륨 이름이 아닌 **절대 경로**로 지정하면 바인드 마운트로 간주됩니다.

값으로는 소스 코드가 있는 `$(pwd)/src`를 지정합니다.

두 번째 설정은 마운트 대상이며, 이는 편리한 위치로 설정합니다.

이번에는 `/src`로 설정합니다.

세 번째 옵션은 특별히 지정하지 않습니다.

또한 내장 웹 서버의 문서 루트를 소스 코드를 마운트하여 `/src`에 배치하려면 `<command>` 끝에 `-t /src`를 추가합니다.

호스트 머신
```bash
$ docker container run          \
    --name app                  \
    --rm                        \
    --detach                    \
    --interactive               \
    --tty                       \
    --volume $(pwd)/src:/src    \
    docker-practice:app         \
    php -S 0.0.0.0:8000 -t /src
```

### --mount 옵션을 이용한 마운트

바인드 마운트를 수행할 때는 동일한 키를 사용하여 key=value 형식으로 설정합니다.

type은 볼륨이 아닌 bind로 지정합니다.

source는 소스 코드가 있는 `$(pwd)/src`를 지정합니다.

destination은 `/src`를 지정합니다.

호스트 머신
```bash
$ docker container run                        \
    --name app                                \
    --rm                                      \
    --detach                                  \
    --interactive                             \
    --tty                                     \
    --mount type=bind,src=$(pwd)/src,dst=/src \
    docker-practice:app                       \
    php -S 0.0.0.0:8000 -t /src
```

### 소스 코드가 마운트되었는지 확인하기

컨테이너에 연결하여 `/src` 디렉토리를 확인하면 됩니다.

호스트 머신
```bash
$ docker container exec  \
    --interactive        \
    --tty                \
    app                  \
    bash

# ls /src

****.** ***.*** 예를 들어 파일 리스트
```

호스트 머신의 변경 사항이 컨테이너 내에, 컨테이너 내의 변경 사항이 호스트 머신에 즉시 반영되는 것을 확인할 수 있습니다.

```bash
$ echo 'Hello World' > src/hello.txt
```

컨테이너
```
# cat /src/hello.txt

Hello World

# rm /src/hello.txt
```

호스트 머신
```bash
$ ls src

***.**   ==> hello.txt 삭제됨
```

## 바인드 마운트의 실체와 주의사항

바인드 마운트의 실체는 **호스트 머신의 파일 시스템** 그대로입니다.

다시 말해, 바인드 마운트는 **볼륨과 비교했을 때 Docker가 아닌 자체적으로 관리하는 것**이며, 이것이 **호스트 머신 상에서** 이루어진다는 차이가 있습니다.

"가상 환경이니까"라고 rm -rf *와 같은 명령을 쉽게 실행하면, 바인드 마운트된 디렉토리가 포함되어 있으면 삭제가 **호스트 머신에 영향을 미칩니다**.
Git을 사용하고 있다면 사고가 발생해도 어떻게든 해결할 수 있을 것이고, 또한 /를 /에 마운트하는 극단적인 상황이 아니라면 큰 위험이 없습니다. 그러나 이 차이를 정확히 이해하는 것이 좋습니다.

Docker 공식 문서에서도 **먼저 볼륨을 고려하고, 꼭 필요한 경우에만 바인드 마운트를 사용하라고** 권장하고 있습니다.

## COPY와 바인드 마운트의 선택

COPY와 바인드 마운트는 호스트 머신의 파일을 컨테이너에서 사용할 수 있도록 하는 기능입니다.

그러나 용도와 적용 시기를 제대로 이해하지 않으면 잘못 사용할 수 있으므로 정리해 보겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiGPITELNFMh4ru5FR_izAp6dbM7mnWnoXES-83KofhwDkuVMmhXVvG0QQVFwdG6qAm1_nb_00-W5Quba1jpKbM7zRiH_v9DbXi_E9-g7GzPrtnHvWD7YHaVOw4pl_KxeL9qif6DQjeOzOcf48thdz_MBVUZ01kc7pcMzXxT6hs_pdKuuxR--DGFvIdTNU)

**COPY**는 이미지 빌드 시 파일을 이미지에 포함시키기 때문에 컨테이너가 시작되면 파일이 **존재합니다**.

또한 원본 파일을 변경해도 컨테이너에는 반영되지 않으므로 이미지 빌드를 다시 실행해야 합니다.

COPY의 용도:
- 설정 파일과 같이 컨테이너에서 변경하지 않고 거의 변경하지 않는 경우
- 프로덕션 배포 시 소스 코드와 같이 즉시 시작 가능한 배포물을 만드는 경우

**바인드 마운트**는 이미지가 아닌 **컨테이너에 적용**되므로 동일한 이미지를 사용하더라도 파일의 존재 여부는 컨테이너 시작 옵션에 따라 다릅니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiWCXlKFDnRshJYajLZz4YX1J5w8m68iXEt2EF49eU4427Zg1Ey6rXmiASYTt7v1dN07LOYyeRWf_jT9JNV8XNIR4DPpn1mJHcVGZNjgDsOZU-2gQEYT5MeZd0KHi5m2HynOAokFqNHdyTcmpKoEKKeqvwBVLwq2aQLAFnry56zpzrvxcZI5KCQzm50-0w)

또한 호스트 머신에서 파일을 변경하면 컨테이너에 즉시 영향을 미칩니다.

바인드 마운트의 용도:
  - 개발 중인 소스 코드와 같이 호스트 머신에서 변경하고 컨테이너에 실시간으로 반영해야 하는 경우
  - 초기화 쿼리와 같이 이미지를 배포할 때 준비할 수 없는 경우

이 두 가지는 **이미지에 대해 수행하는지 컨테이너에 대해 수행하는지**가 명확하게 다릅니다.

이 점을 제대로 이해하면 어떤 것을 사용해야 할지와 변경이 필요한 경우 어떻게 해야 하는지를 결정할 수 있습니다.

## 주요 특징

바인드 마운트는 **호스트 머신에서도 파일에 관심이 있는 경우**에 적합합니다.

컨테이너 내에서 파일 삭제 등이 **호스트 머신에 영향을 줄 수 있습니다**.

이미지에 대해 수행하는 **COPY와 컨테이너에 대해 수행하는 바인드 마운트**는 큰 차이가 있습니다.

---

# 포트 publish

옵션 | 의미 | 용도
--- | --- | ---
-p, --publish | 컨테이너의 포트를 호스트 머신에 공개 | 호스트 머신에서 컨테이너 내 서버에 접근하기 위함

## 포트 공개란?

컨테이너는 호스트 머신으로부터 격리되어 있으며, 컨테이너 내에서 웹 서버나 DB 서버를 실행하더라도 기본적으로 호스트 머신에서 접근할 수 없습니다.

웹 서버와 같은 공용 네트워크에 위치한 컨테이너에서는 이 문제를 해결하기 위해 호스트 머신에 대해 포트를 공개합니다.

## 예

컨테이너에서는 PHP 내장 웹 서버가 8000 포트에서 실행 중입니다.

이 8000 포트를 컨테이너 시작 시 호스트 머신에 공개함으로써 내장 웹 서버에 호스트 머신에서 접근할 수 있게 됩니다.

공개 포트는 `--publish host-machine:container` 형식으로 매핑됩니다.

이때, 호스트 머신 측 포트는 시작하는 사람이 자유롭게 결정할 수 있지만, 1024 미만의 포트는 특권 포트로 미리 용도가 정해져 있으므로 피하는 것이 좋습니다.

컨테이너의 8000 포트를 호스트 머신의 8000 포트로 할당할 수도 있지만, 8000 포트는 일반적으로 사용 중입니다.

따라서 이번에는 18000 포트로 매핑하겠습니다.

호스트 머신에서 다음과 같이 실행하세요:
```bash
$ docker container run                        \
    --name app                                \
    --rm                                      \
    --detach                                  \
    --interactive                             \
    --tty                                     \
    --mount type=bind,src=$(pwd)/src,dst=/src \
    --publish 18000:8000                      \
    docker-practice:app                       \
    php -S 0.0.0.0:8000 -t /src
```

---
