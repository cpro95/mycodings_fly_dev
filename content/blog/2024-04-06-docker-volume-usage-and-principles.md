---
slug: 2024-04-06-docker-volume-usage-and-principles
title: Docker 강좌 4편. Docker 볼륨 (Volume) 사용 방법과 원리
date: 2024-04-06 07:05:00.837000+00:00
summary: Docker 볼륨 (Volume) 사용 방법과 원리
tags: ["docker", "volume"]
contributors: []
draft: false
---

안녕하세요?

네번째 Docker 강좌입니다.

전체적인 강좌 리스트입니다.

1. [Docker 강좌 1편. 가상화와 Docker 기초 개념 이해하기](https://mycodings.fly.dev/blog/2024-04-06-docker-tutorial-understanding-virtualization-and-docker)

2. [Docker 강좌 2편. 실무에서 쓰이는 Docker 컨테이너 완벽 가이드](https://mycodings.fly.dev/blog/2024-04-06-docker-tutorial-docker-container-comprehensive-guide)

3. [Docker 강좌 3편. Docker 이미지 및 Dockerfile 기초](https://mycodings.fly.dev/blog/2024-04-06-docker-tutorial-understanding-docker-image-and-dockerfile)

4. [Docker 강좌 4편. Docker 볼륨 (Volume) 사용 방법과 원리](https://mycodings.fly.dev/blog/2024-04-06-docker-volume-usage-and-principles)

5. [Docker 강좌 5편. Docker 바인드 마운트와 포트 publish](https://mycodings.fly.dev/blog/2024-04-06-docker-tutorial-understanding-bind-mount-and-port-publish)

6. [Docker 강좌 6편. Docker Compose 완벽 가이드](https://mycodings.fly.dev/blog/2024-04-06-docker-tutorial-docker-compose-complete-guide)

---

** 목 차 **

- [Docker 볼륨 (Volume) 사용 방법과 원리](#docker-볼륨-volume-사용-방법과-원리)
  - [실습해보기](#실습해보기)
  - [볼륨(Volume)은 어디에 저장되나요?](#볼륨volume은-어디에-저장되나요)
  - [시도해보기 2](#시도해보기-2)
  - [Docker 스토리지에 대한 고민](#docker-스토리지에-대한-고민)
  - [Docker 스토리지 원리](#docker-스토리지-원리)
  - [`-v` 옵션](#-v-옵션)
  - [`--mount` 옵션](#--mount-옵션)
  - [`--rm` 옵션을 사용할 때](#--rm-옵션을-사용할-때)
  - [Data Volume 컨테이너는 단순한 디자인 패턴입니다.](#data-volume-컨테이너는-단순한-디자인-패턴입니다)
  - [결국 어떤 것을 사용해야 할까요?](#결국-어떤-것을-사용해야-할까요)
  - [요약](#요약)

---

# Docker 볼륨 (Volume) 사용 방법과 원리

Docker 볼륨은 컨테이너 내에서 생성한 데이터를 영속적으로 저장하기 위한 공간입니다.

컨테이너에 저장된 데이터는 컨테이너를 삭제하면 함께 사라집니다.

그러나 볼륨에 저장한 데이터는 컨테이너를 삭제해도 남아 있어 재사용할 수 있습니다.

## 실습해보기

먼저 볼륨을 생성해보겠습니다.

```
% docker volume create test-volume
test-volume
% docker volume ls

DRIVER    VOLUME NAME
local     test-volume
```

다음으로 생성한 볼륨을 지정하여 컨테이너(Alpine 서버)를 실행합니다.

`-v [볼륨명]:[컨테이너의 볼륨 디렉토리]` 옵션을 사용하여 볼륨을 지정합니다.

```
% docker container run           \
    --interactive                \
    --rm                         \
    --name volume-test-container \
    -v test-volume:/volume_dir   \
    alpine:latest                \
    /bin/ash


Unable to find image 'alpine:latest' locally
latest: Pulling from library/alpine
9b3977197b4f: Pull complete
Digest: sha256:21a3deaa0d32a8057914f36584b5288d2e5ecc984380bc0118285c70fa8c9300
Status: Downloaded newer image for alpine:latest

ls -al
total 68
drwxr-xr-x    1 root     root          4096 Apr  6 06:47 .
drwxr-xr-x    1 root     root          4096 Apr  6 06:47 ..
-rwxr-xr-x    1 root     root             0 Apr  6 06:47 .dockerenv
drwxr-xr-x    2 root     root          4096 Jan 26 17:55 bin
drwxr-xr-x    5 root     root           340 Apr  6 06:47 dev
drwxr-xr-x    1 root     root          4096 Apr  6 06:47 etc
drwxr-xr-x    2 root     root          4096 Jan 26 17:55 home
drwxr-xr-x    7 root     root          4096 Jan 26 17:55 lib
drwxr-xr-x    5 root     root          4096 Jan 26 17:55 media
drwxr-xr-x    2 root     root          4096 Jan 26 17:55 mnt
drwxr-xr-x    2 root     root          4096 Jan 26 17:55 opt
dr-xr-xr-x  230 root     root             0 Apr  6 06:47 proc
drwx------    2 root     root          4096 Jan 26 17:55 root
drwxr-xr-x    2 root     root          4096 Jan 26 17:55 run
drwxr-xr-x    2 root     root          4096 Jan 26 17:55 sbin
drwxr-xr-x    2 root     root          4096 Jan 26 17:55 srv
dr-xr-xr-x   11 root     root             0 Apr  6 06:47 sys
drwxrwxrwt    2 root     root          4096 Jan 26 17:55 tmp
drwxr-xr-x    7 root     root          4096 Jan 26 17:55 usr
drwxr-xr-x   12 root     root          4096 Jan 26 17:55 var
drwxr-xr-x    2 root     root          4096 Apr  6 06:32 volume_dir
```

성공적으로 컨테이너에 진입했습니다.

컨테이너 내에 볼륨 디렉토리가 있는지 확인하고, 디렉토리 내에 `test.txt` 파일을 생성해보겠습니다.

```
# ls
bin         etc         lib         mnt         proc        run         srv         tmp         var
dev         home        media       opt         root        sbin        sys         usr         volume_dir
# cd volume_dir
/volume_dir # echo "test" > test.txt
/volume_dir # cat test.txt
test
```

컨테이너를 종료하고 다시 컨테이너를 실행해보겠습니다.

`docker run` 옵션에 `--rm`을 지정했기 때문에 컨테이너를 빠져나올 때 자동으로 컨테이너가 삭제됩니다.

```
/volume_dir # exit
% docker container run --interactive --rm --name volume-test-container -v test-volume:/volume_dir alpine:latest /bin/ash
/ # cat volume_dir/test.txt
test
/ #
```

볼륨을 사용하지 않았다면 `test.txt` 파일은 삭제되어 다시 컨테이너를 실행해도 존재하지 않았겠지만, 볼륨에 저장했기 때문에 파일을 다시 확인할 수 있습니다.

## 볼륨(Volume)은 어디에 저장되나요?

볼륨(Volume)은 호스트(Host)에 저장됩니다.

그런데 정확히 어디에 저장되는지 궁금하시죠? 아래 명령어를 통해 볼륨의 저장 위치를 확인할 수 있습니다.

```
% docker volume inspect test-volume
[
    {
        "CreatedAt": "2024-04-06T06:32:50Z",
        "Driver": "local",
        "Labels": null,
        "Mountpoint": "/var/lib/docker/volumes/test-volume/_data",
        "Name": "test-volume",
        "Options": null,
        "Scope": "local"
    }
]
```

위 출력에서 `Mountpoint`의 값인 "/var/lib/docker/volumes/test-volume/_data"가 볼륨의 저장 위치입니다.

그러나 Docker Desktop for Mac을 사용하고 있다면, Docker 환경은 VM(가상 머신)인 HyperKit에서 실행되기 때문에 Mac에서 직접 접근할 수 없습니다.

하지만 `nsenter1`이라는 명령어를 사용하여 VM에 진입하여 확인할 수 있습니다.

```
docker container run --interactive --rm --privileged --pid=host justincormack/nsenter1
Unable to find image 'justincormack/nsenter1:latest' locally
latest: Pulling from justincormack/nsenter1
726619a9fa8c: Pull complete 
Digest: sha256:e876f694a4cb6ff9e6861197ea3680fe2e3c5ab773a1e37ca1f13171f7f5798e
Status: Downloaded newer image for justincormack/nsenter1:latest
/ # 
```

실제로 `/var/lib/docker/volumes/test-volume/_data` 경로에 `test.txt` 파일이 있는지 확인해보겠습니다.

```
/ # ls /var/lib/docker/volumes/test-volume/_data
test.txt
```

잘 존재하네요.

`/var/lib/docker` 디렉토리에는 볼륨 외에도 컨테이너, 이미지, 네트워크 등 Docker의 중요한 요소들이 저장되어 있습니다.

추가로, 파일을 확인만 하고 싶다면 Docker Desktop에서도 확인할 수 있습니다.

Volumes 탭을 선택하고 DATA 아래에 있는 `test.txt` 파일을 선택하시면 호스트 측에서 파일을 저장하고 내용을 확인할 수 있습니다.

## 시도해보기 2

이전에는 미리 볼륨을 생성하고,

`-v [볼륨 이름]:[컨테이너의 볼륨 디렉토리]`

라는 볼륨 옵션을 사용하여 Docker VM 머신 내의 볼륨을 마운트했습니다.

이번에는 VM이 아닌 호스트(MacBook)에서 생성한 디렉토리를 마운트해 보겠습니다.

`-v [호스트의 절대 경로 디렉토리]:[컨테이너의 볼륨 디렉토리]`

라는 볼륨 옵션을 사용합니다.

```
% mkdir ~/desktop/volume_dir_mac

% echo "test on mac" > ~/desktop/volume_dir_mac/test_mac.txt

% docker container run --interactive --rm --name volume-test-mac -v ~/desktop/volume_dir_mac:/volume_dir_alpine alpine:latest /bin/ash

/ # cat volume_dir_alpine/test_mac.txt
test on mac
```

호스트 측에서 `volume_dir_mac/test_mac.txt` 파일을 생성하고, 해당 파일의 절대 경로를 볼륨으로 지정한 컨테이너가 성공적으로 실행되었습니다.

`volume_dir_alpine` 디렉토리에 호스트 측에서 생성한 파일이 있습니다.

이 파일의 변경 사항은 호스트와 컨테이너 간에 공유됩니다.

## Docker 스토리지에 대한 고민

데이터를 영속적으로 저장하려면 `-v` 옵션이나 Dockerfile의 `VOLUME`, 또는 Compose 파일의 `volumes`를 사용했었습니다. 그러나 이들 간의 차이를 잘 이해하지 못하고 있습니다. 각각의 문법도 여러 가지가 있는 것 같은데, 잘 이해되지 않습니다.

컨테이너를 삭제할 때 자동으로 삭제되는 경우도 있어서, 호스트 측 디렉토리를 컨테이너 내 디렉토리에 매핑하는 것을 자주 사용합니다. 호스트 측 디렉토리가 보이기 때문에 안심이 되는 것 같습니다.

Data Volume 컨테이너를 사용하라고 하셔서 사용하고 있지만, 왜 좋은지는 잘 모르겠습니다. 어쨌든 잘 모르는 상태로 사용하고 있습니다.

## Docker 스토리지 원리

컨테이너 내에서 생성된 데이터는 해당 컨테이너 내의 어딘가에 기록되지만, 컨테이너를 삭제하면 사라집니다.

그러나 데이터만은 컨테이너가 사라져도 보존하고 싶거나 다른 컨테이너에서 사용하고 싶은 경우, Docker는 데이터 저장 영역을 컨테이너 외부에 만들 수 있는 기능을 제공합니다.

구체적으로는 다음 세 가지 유형이 있습니다. (정확히 말하면 Windows에서는 Named Pipe라는 것도 있습니다.)

1. **볼륨 (Volume)**
    - Docker 관리하에 저장 공간을 확보합니다. Linux의 경우 `/var/lib/docker/volumes/` 아래에 위치합니다.
    - Named Volume과 Anonymous Volume이 있으며, Named Volume의 경우 Docker 호스트 내에서 이름을 해결할 수 있어 접근이 쉽습니다. Anonymous Volume은 임의의 해시 값이 할당됩니다.
    - 다른 프로세스에서 접근할 수 없으므로 안전합니다. 기본적으로 이를 사용하는 것이 좋습니다.

2. **바인드 마운트 (Bind Mount)**
    - 호스트 측 디렉토리를 컨테이너 내 디렉토리와 공유합니다.

3. **tmpfs**
    - 메모리 상에 저장 공간을 확보합니다. 이름 그대로 일시적인 영역입니다. 기밀성이 높은 정보를 일시적으로 마운트하는 경우 등에 사용됩니다.

`-v` 옵션 및 `VOLUME` 또는 `volumes`로 지정하는 것은 기본적으로 위 세 가지 중 하나를 다루게 됩니다.

일반적으로 볼륨이나 바인드 마운트를 사용하므로, 아래에서 이 두 가지를 주로 설명하겠습니다.

볼륨에는 볼륨(volume), 바인드(bind), tmpfs의 세 가지 유형이 있음을 알게 되었습니다.


## `-v` 옵션

개인적으로 `-v` 옵션을 사용할 때 여러 가지를 지정할 수 있어 혼란이 되는 경우가 있습니다.

위에서 언급한 세 가지 스토리지 유형을 이해하고 있다면 큰 문제가 없겠지만요.

예를 들어 `sample/image:latest` 이미지를 실행한다고 가정하고, 다음은 기호에 따른 차이를 나열합니다.

1. **익명 볼륨 (Anonymous Volume)**
    - `$ docker container run -v /some sample/image:latest`
    - 호스트 측에는 Linux의 경우 `/var/lib/docker/volumes/` 아래에 공간이 확보되며, 컨테이너 내의 `/some` 디렉토리와 공유됩니다. 식별을 위해 해시 값이 할당됩니다. 동일한 네트워크에서 해당 해시 값을 사용하여 액세스할 수 있습니다.

2. **이름이 지정된 볼륨 (Named Volume)**
    - `$ docker container run -v name:/some sample/image:latest`
    - 익명 볼륨과 유사하게 호스트 측에는 Linux의 경우 `/var/lib/docker/volumes/` 아래에 공간이 확보되며, 컨테이너 내의 `/some` 디렉토리와 공유됩니다. `name`이라는 이름이 지정되어 있으므로 동일한 네트워크 내에서 `name` 호스트 이름으로 액세스할 수 있습니다.

3. **바인드 마운트 (Bind Mount)**
    - `$ docker container run -v ${PWD}/data:/some sample/image:latest`
    - 호스트 측의 현재 디렉토리 아래의 `data` 디렉토리와 컨테이너 측의 `/some` 디렉토리가 공유됩니다.

## `--mount` 옵션

Docker 17.06부터 단일 컨테이너에도 `--mount` 옵션을 사용할 수 있으며, 공식적으로 `-v` 대신 이를 사용하는 것이 권장됩니다.

키-값 형식으로 각 요소를 지정할 수 있으므로 이 쪽이 문법적으로 더 명확합니다. 길지만 다음과 같이 지정합니다.

```
$ docker container run --mount type=volume,src=name,dst=/some sample/image:latest
```

- `type`: `volume`, `bind`, `tmpfs`를 지정합니다.
- `src`: Named Volume인 경우 해당 이름을, Bind Mount인 경우 호스트 측 디렉토리를 지정합니다. 익명 볼륨인 경우 생략합니다. 다른 이름으로도 사용할 수 있습니다.
- `dst`: 컨테이너 측 디렉토리를 지정합니다. 다른 이름으로도 사용할 수 있습니다.

## `--rm` 옵션을 사용할 때

컨테이너를 실행할 때 `--rm` 옵션을 추가하면 익명 볼륨의 경우 컨테이너가 중지되면 동시에 볼륨도 삭제됩니다.

이름이 지정된 볼륨의 경우 컨테이너가 삭제되어도 볼륨은 삭제되지 않습니다.

다만 이름이 지정된 볼륨의 경우 마운트된 컨테이너가 없는 상태에서 `$ docker volume prune` 등을 실행하면 볼륨이 삭제됩니다.

## Data Volume 컨테이너는 단순한 디자인 패턴입니다.

Volume을 조사하다보면 자주 나오는 Data Volume 컨테이너입니다.

이것은 Docker의 기능으로서 존재하는 것이 아니라, 볼륨을 더 쉽게 다루기 위한 디자인 패턴입니다.

볼륨에 컨테이너를 연결하면 어떤 점이 좋을까요? 볼륨에 대한 액세스를 추상화하여 더 쉽게 다룰 수 있으며, 실수로 prune으로 삭제되지 않아도 된다는 점이 있습니다.

## 결국 어떤 것을 사용해야 할까요?

기본적으로 이름이 지정된 볼륨을 사용하세요.

Docker 영역 내에 볼륨이 생성되기 때문에 안전하며, 이름으로 액세스할 수 있어 편리합니다.

바인드 마운트는 호스트 환경에 의존하며, 볼륨에 비해 기능이 제한됩니다.

호스트 측에서 데이터를 주입하고자 할 때나 개발 중에 업데이트한 소스 코드나 빌드를 즉시 반영하고자 할 때 바인드 마운트를 사용하는 것이 좋습니다.

## 요약

Docker 스토리지에는 볼륨, 바인드 마운트, tmpfs의 세 가지 유형이 있습니다.

`--volume` 옵션으로 볼륨과 바인드 마운트를 모두 지정할 수 있어서 옵션 이름과 기능 이름이 겹쳐서 혼동스럽습니다.

`-v` 옵션 대신 `--mount` 옵션을 사용합시다.

Data Volume 컨테이너는 해당 기능이 있는 것이 아니라 디자인 패턴입니다.

이름이 지정된 볼륨을 사용합시다.