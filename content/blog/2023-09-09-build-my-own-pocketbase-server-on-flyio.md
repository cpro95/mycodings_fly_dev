---
slug: 2023-09-09-build-my-own-pocketbase-server-on-flyio
title: PocketBase 활용법 1탄. 나만의 pocketbase 서버 만들기 in Fly.io
date: 2023-09-09 02:15:59.730000+00:00
summary: Fly.io에 직접 Dockerfile로 pocketbase 서버 구축
tags: ["pocketbase", "fly.io", "pb_public", "server"]
contributors: []
draft: false
---

안녕하세요?

오늘부터 Pocketbase 강좌를 시작해 보려 합니다.

** 목차 **
1. [배포를 위한 Dockerfile 만들기와 Fly.io에 deploy](#1-배포를-위한-dockerfile-만들기와-flyio에-deploy)
2. [DB 강제로 초기화하기 또는 관리자 비밀번호를 잊어버린 경우](#2-db-강제로-초기화하기-또는-관리자-비밀번호를-잊어버린-경우)
3. [pb_public 폴더에 대해 알아보기](#3-pb_public-폴더에-대해-알아보기)
---

## 1. 배포를 위한 Dockerfile 만들기와 Fly.io에 deploy

먼저, 항상 그랬듯이 실제 배포(deploy)부터 해보겠습니다.

```bash
mkdir mypocketbase
cd mypocketbase
```

일단 위와 같이 빈 폴더에 Dockerfile을 만들겠습니다.

```bash
FROM alpine:latest

ARG PB_VERSION=0.18.1

RUN apk add --no-cache \
    unzip \
    ca-certificates \
    openssh

# download and unzip PocketBase
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/

EXPOSE 8080

# start PocketBase
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8080"]
```

현대 기준 Pocketbase 버전이 0.18.1이네요.

그리고 아래와 같이 fly launch라고 fly 앱을 생성합니다.

```bash
➜  mypocketbase> fly launch
Creating app in /Users/cpro95/Codings/Javascript/projects/mypocketbase
Scanning source code
Detected a Dockerfile app
? Choose an app name (leave blank to generate one): mypocketbase
automatically selected personal organization: cpro95
Some regions require a paid plan (bom, fra, maa).
See https://fly.io/plans to set up a plan.

? Choose a region for deployment: Tokyo, Japan (nrt)
App will use 'nrt' region as primary

Created app 'mypocketbase' in organization 'personal'
Admin URL: https://fly.io/apps/mypocketbase
Hostname: mypocketbase.fly.dev
? Would you like to set up a Postgresql database now? No
? Would you like to set up an Upstash Redis database now? No
Wrote config file fly.toml
? Would you like to deploy now? No
Validating /Users/cpro95/Codings/Javascript/projects/mypocketbase/fly.toml
Platform: machines
✓ Configuration is valid
Your app is ready! Deploy with `flyctl deploy`  # 여기서 N을 눌러 아직은 배포하지 마세요.
➜  mypocketbase>
```

이제 fly.toml 파일을 조금 손보겠습니다.

```
app = "mypocketbase"
primary_region = "nrt"

# optional if you want to change the PocketBase version
[build.args]
  PB_VERSION="0.18.1"

[mounts]
  destination = "/pb/pb_data"
  source = "pb_data"

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = false  # 변경한 부분
  auto_start_machines = true
  min_machines_running = 0
  processes = ["app"]
  [http_service.concurrency]
    type = "requests"
    soft_limit = 500
    hard_limit = 550
```

build.args로 PB_VERSION을 지정하고요.

그리고 mounts라고 해서 pocketbase가 생성될 디스크를 지정했습니다.

pb_data가 이제 해당 디스크의 경로가 될 겁니다.

이제, fly.toml 파일이 완성되었으니까요.

Fly.io에 디스크를 만들어 볼까요?

```bash
➜  mypocketbase> fly volumes create pb_data --size=1
Warning! Individual volumes are pinned to individual hosts. You should create two or more volumes per application. You will have downtime if you only create one. Learn more at https://fly.io/docs/reference/volumes/
? Do you still want to use the volumes feature? Yes
Some regions require a paid plan (bom, fra, maa).
See https://fly.io/plans to set up a plan.

? Select region: Tokyo, Japan (nrt)
        ID: vol_5456x2g3oqk0nkjr
      Name: pb_data
       App: mypocketbase
    Region: nrt
      Zone: fe01
   Size GB: 1
 Encrypted: true
Created at: 09 Sep 23 02:31 UTC
➜  mypocketbase>
```

위와 같이 pb_data라는 이름으로 사이즈 1GB 디스크를 만들었습니다.

pb_data는 fly.toml에 있는 source와 같은 이름이어야 합니다.

이제, deploy 준비가 다 끝났으니까, 실행해 볼까요?

```bash
➜  mypocketbase> fly deploy
==> Verifying app config
Validating /Users/cpro95/Codings/Javascript/projects/mypocketbase/fly.toml
Platform: machines
✓ Configuration is valid
--> Verified app config
==> Building image
Remote builder fly-builder-snowy-sun-1195 ready
==> Building image with Docker
--> docker host: 20.10.12 linux x86_64
[+] Building 6.3s (9/9) FINISHED
 => [internal] load build definition from Dockerfile                                              0.8s
 => => transferring dockerfile: 722B                                                              0.8s
 => [internal] load .dockerignore                                                                 0.5s
 => => transferring context: 2B                                                                   0.5s
 => [internal] load metadata for docker.io/library/alpine:latest                                  1.2s
 => [1/4] FROM docker.io/library/alpine:latest@sha256:7144f7bab3d4c2648d7e59409f15ec52a18006a128  0.2s
 => => resolve docker.io/library/alpine:latest@sha256:7144f7bab3d4c2648d7e59409f15ec52a18006a128  0.0s
 => => extracting sha256:7264a8db6415046d36d16ba98b79778e18accee6ffa71850405994cffa9be7de         0.1s
 => => sha256:7144f7bab3d4c2648d7e59409f15ec52a18006a128c733fcff20d3a4a54ba44a 1.64kB / 1.64kB    0.0s
 => => sha256:c5c5fda71656f28e49ac9c5416b3643eaa6a108a8093151d6d1afc9463be8e33 528B / 528B        0.0s
 => => sha256:7e01a0d0a1dcd9e539f8e9bbd80106d59efbdf97293b3d38f5d7a34501526cdb 1.47kB / 1.47kB    0.0s
 => => sha256:7264a8db6415046d36d16ba98b79778e18accee6ffa71850405994cffa9be7de 3.40MB / 3.40MB    0.1s
 => https://github.com/pocketbase/pocketbase/releases/download/v0.18.1/pocketbase_0.18.1_linux_a  0.9s
 => [2/4] RUN apk add --no-cache     unzip     ca-certificates     openssh                        3.1s
 => [3/4] ADD https://github.com/pocketbase/pocketbase/releases/download/v0.18.1/pocketbase_0.18  0.0s
 => [4/4] RUN unzip /tmp/pb.zip -d /pb/                                                           0.7s
 => exporting to image                                                                            0.2s
 => => exporting layers                                                                           0.2s
 => => writing image sha256:9200f7f66075976bc86c2a35c888dcbe8018fe2fb5b2d9c0fc68b59ff0cb05f7      0.0s
 => => naming to registry.fly.io/mypocketbase:deployment-01H9VWJCXQ08M5K07RW1PKRKZW               0.0s
--> Building image done
==> Pushing image to fly
The push refers to repository [registry.fly.io/mypocketbase]
ab5f287ac9ba: Pushed
0fcbd8bc6814: Pushed
e043ef2d202a: Pushed
4693057ce236: Pushed
deployment-01H9VWJCXQ08M5K07RW1PKRKZW: digest: sha256:68a7ea45e1d4885a0b6dc2336442d6a138085330d04d290abee216d566c6385e size: 1163
--> Pushing image done
image: registry.fly.io/mypocketbase:deployment-01H9VWJCXQ08M5K07RW1PKRKZW
image size: 76 MB

Watch your deployment at https://fly.io/apps/mypocketbase/monitoring

Provisioning ips for mypocketbase
  Dedicated ipv6: 2a09:8280:1::4e:6e62
  Shared ipv4: 66.241.124.137
  Add a dedicated ipv4 with: fly ips allocate-v4

This deployment will:
 * create 1 "app" machine

No machines in group app, launching a new machine
  Machine 5683d449f16328 [app] update finished: success
Finished launching new machines

Visit your newly deployed app at https://mypocketbase.fly.dev/
➜  mypocketbase>
```

성공적으로 배포가 끝났습니다.

이제 'https://mypocketbase.fly.dev/' 주소로 가볼까요?

이론상으로는 pocketbase가 해당 주소로 실행되고 있을 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjS-Ob_PGa6Dh4nHElzunJgXZrdMLEzFeHbN14WZEqykne-FcnQ3aWS_SVuRqosyb5j2sKSnPfu8-T_47grjNzNCu0ni9UW6hpwNfyUg7ZVRvEO4ft2gF4FgC46GmIGIugnJR5OaUdFKH3qQYlfVHm3odcOpU6SKkSCfgHiDVu0giAQHi8CRPqjSGeTYfQ)

브라우저에서 해당 주소로 가면 code 404 에러가 나는데요.

페이지가 없다는 뜻입니다.

왜냐하면 pocketbase는 기본 주소가 다음과 같습니다.

'https://mypocketbase.fly.dev/_/'

'\_'가 해당 주소인데요.

다시 접속해 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEjWi6X6gC-vJQnV7oFH68y95myTtKLQm1F7qlnJ5D23XcNlbgFYGk_SQ_Y97EMtwhtmEFOPzmDPk3NxlctzrAWji5LoSWp_MPlPqtilJg1hZOWFh58eLaWKY-EP68DSlCz49wdAK9avWXrrHvf9VCwxL9J5pXYvnW8tzD8MBIIXT3B0iEc3Dc_4rpkhkk4)

그러면 위와 같은 화면이 나오는데요.

이 화면은 리눅스로 따지면 root 계정을 만들라는 뜻입니다.

pocketbase의 관리자 계정을 맨 처음 만드는 거죠.

관리자 계정을 만들어 봅시다.

만들면 아래와 같이 로그인되는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhLbJ668ttLMovWob0qA4FjUVQqFx1ildGiBEabTzHrujS9_3c9wRY6NAKHCcN7qugfSu9KCU5ak2_2M4d6IUyYaZM-_7N3uuniPo5YJP2F_TO1BNVgAew-Q0Xg85KLL8HrgeyXfK6fP9vA1jvBcbXSLEMDSkhLY3val-Aj4YG3N6XzaRjOcTBih23OTiQ)

관리자 대시보드입니다.

pocketbase가 좋은 점이 이렇게 웹상에서 관리자가 DB를 편하게 조작할 수 있는 대시보드를 제공한다는 점이죠.

---

## 2. DB 강제로 초기화하기 또는 관리자 비밀번호를 잊어버린 경우

Fly.io가 좋은 점은 ssh 원격 접속으로 실제 가상서버에 접속할 수 있습니다.

만약, 관리자 비밀번호를 잊어버렸다 싶으면 아래와 같이 하시면 됩니다.

실제 포켓베이스가 아래처럼 관리자 비밀번호 초기화 링크를 제공해 줍니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjGtclMJAnaxaJkwQZKwokh2MIHjoJ8cXMKTGsBfNAEOohf3DidpgHWS_wG1aZjtPMCOSuy0J6Wiwu5ErNBpBntyjIKdwiJ35HuwrlFZKB5pU5qYQbWU9a4a5AF4TLyuIG5_gZbCcj_KeXlhBhqkoobvRPPAMYRj6veZNOuYtn_894NAgJRztg_O5_P94U)

근데 테스트해보니까 이메일이 오지 않더라고요.

그래서 강제로 초기화하는 방법을 알려 드리겠습니다.

```bash
fly ssh console
```

위와 같이 실행해서 mypocketbase 서버가 실행되고 있는 리눅스에 원격 접속합니다.

```bash
➜  mypocketbase> fly ssh console
Connecting to faa:0:5cc:ab:17:c9c:a5a:2... complete
5683d449f16328:/# cd /pb
5683d449f16328:/pb# ls -al
total 45148
drwxr-xr-x    3 root     root          4096 Sep  9 02:34 .
drwxr-xr-x   21 root     root          4096 Sep  9 02:34 ..
-rw-r--r--    1 root     root         84985 Sep  6 04:14 CHANGELOG.md
-rw-r--r--    1 root     root          1090 Sep  6 04:14 LICENSE.md
drwxr-xr-x    3 root     root          4096 Sep  9 02:44 pb_data
-rwxr-xr-x    1 root     root      46129152 Sep  6 04:19 pocketbase
5683d449f16328:/pb#
```

위와 같이 실제 포켓베이스 바이너리 파일과 해당 DB가 있는 폴더로 왔습니다.

```bash
5683d449f16328:/pb# cd pb_data
5683d449f16328:/pb/pb_data# ls -al
total 724
drwxr-xr-x    3 root     root          4096 Sep  9 02:44 .
drwxr-xr-x    3 root     root          4096 Sep  9 02:34 ..
-rw-r--r--    1 root     root         98304 Sep  9 02:44 data.db
-rw-r--r--    1 root     root         40960 Sep  9 02:44 logs.db
drwx------    2 root     root         16384 Sep  9 02:34 lost+found
-rw-r--r--    1 root     root        577233 Sep  9 02:34 types.d.ts
5683d449f16328:/pb/pb_data#
```

위와 같이 pb_data에 data.db 파일이 있는데요.

이 파일이 바로 Sqlite3 파일입니다.

그러면 pb_data 폴더를 지우면 포켓베이스 DB가 초기화되는 거죠.

먼저, pocketbase가 실행되고 있는 명령어를 kill 명령어로 죽이고 pb_data 폴더를 지우겠습니다.

```bash
5683d449f16328:/pb# ps -ef | grep pocketbase
  263 root      0:00 /pb/pocketbase serve --http=0.0.0.0:8080
  276 root      0:00 grep pocketbase
5683d449f16328:/pb# kill 263
```

그런데 이 방법으로는 pocketbase 명령어를 죽이자마자 서버가 끊어졌습니다.

```bash
2023-09-09T02:50:47.674 app[5683d449f16328] nrt [info] INFO Main child exited normally with code: 0

2023-09-09T02:50:47.675 app[5683d449f16328] nrt [info] INFO Starting clean up.

2023-09-09T02:50:47.675 app[5683d449f16328] nrt [info] INFO Umounting /dev/vdb from /pb/pb_data

2023-09-09T02:50:47.679 app[5683d449f16328] nrt [info] WARN hallpass exited, pid: 264, status: signal: 15 (SIGTERM)

2023-09-09T02:50:47.682 app[5683d449f16328] nrt [info] 2023/09/09 02:50:47 listening on [fdaa:0:57cc:a7b:17c:c93c:a25a:2]:22 (DNS: [fdaa::3]:53)

2023-09-09T02:50:48.678 app[5683d449f16328] nrt [info] [ 36.354815] reboot: Restarting system

2023-09-09T02:50:48.852 runner[5683d449f16328] nrt [info] machine exited with exit code 0, not restarting
```

실제 위에서 보시면 fly.io 대시보드의 log 파일인데요.

다시 mypocketbase 서버를 브라우저에서 접속하면 가상머신이 재 시작됩니다.

```bash
2023-09-09T02:52:32.904 proxy[5683d449f16328] nrt [info] machine started in 475.703656ms

2023-09-09T02:52:33.012 app[5683d449f16328] nrt [info] 2023/09/09 02:52:33 Server started at http://0.0.0.0:8080

2023-09-09T02:52:33.012 app[5683d449f16328] nrt [info] ├─ REST API: http://0.0.0.0:8080/api/

2023-09-09T02:52:33.012 app[5683d449f16328] nrt [info] └─ Admin UI: http://0.0.0.0:8080/_/

2023-09-09T02:52:33.089 proxy[5683d449f16328] nrt [info] machine became reachable in 185.453966ms
```

위와 같이 재시작되었네요.

그러면, 다른 방법으로 관리자 비밀번호를 초기화하겠습니다

```bash
➜  mypocketbase> fly ssh console
Connecting to fdaa:0:57cc:a7b:17c:c93c:a25a:2... complete
5683d449f16328:/# apk add sqlite
fetch https://dl-cdn.alpinelinux.org/alpine/v3.18/main/x86_64/APKINDEX.tar.gz
fetch https://dl-cdn.alpinelinux.org/alpine/v3.18/community/x86_64/APKINDEX.tar.gz
(1/2) Installing readline (8.2.1-r1)
(2/2) Installing sqlite (3.41.2-r2)
Executing busybox-1.36.1-r2.trigger
OK: 16 MiB in 29 packages

5683d449f16328:/# cd pb

5683d449f16328:/pb# cd pb_data

5683d449f16328:/pb/pb_data# sqlite3 data.db
```

위와 같이 서버에 접속하면 apk 명령어로 sqlite 패키지를 설치합니다.

그리고 pb_data로 가서 sqlite3 data.db 파일을 읽어 들입니다.

거기 보시면 \_admins 테이블이 있는데요.

아래처럼 관리자 계정을 보유하고 있는 테이블입니다.

```bash
CREATE TABLE `_admins` (
				`id`              TEXT PRIMARY KEY NOT NULL,
				`avatar`          INTEGER DEFAULT 0 NOT NULL,
				`email`           TEXT UNIQUE NOT NULL,
				`tokenKey`        TEXT UNIQUE NOT NULL,
				`passwordHash`    TEXT NOT NULL,
				`lastResetSentAt` TEXT DEFAULT "" NOT NULL,
				`created`         TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%fZ')) NOT NULL,
				`updated`         TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%fZ')) NOT NULL
			);
```

그리고 실제 select 문으로 뭐가 있는지 볼까요?

```bash
      sqlite> select * from _admins;
pf9dwxzry0bbq3s|0|cpro95@daum.net|vtiyYEj7JgVr56seBYKh4cKkznHjXyr6ojnyr29iL2hNCwEx8B|$2a$12$OmX1Ou29yVS6metxZAgYDO/Xleur0qfYsIEM2k7r8Pjh42ZXAprdy||2023-09-09 02:39:48.398Z|2023-09-09 02:39:48.398Z
```

위와 같이 해시된 암호 같은게 있는데요.

우리가 필요한 건 email과 passwordHash입니다.

pocketbase는 가장 기본적인 crypto 라이브러리를 이용해서 hash 파일을 생성하는데요.

구글에 "nodejs password hash online" 이라고 치면 온라인으로 일반 문자열을 해쉬문자열로 바꿔주는 웹앱이 있습니다.

다음 그림과 같이 "12345678"에 해당하는 해쉬를 찾습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjTeKmG2vPtFfBWspMg6hthnZ_IF4alciwflaRgqjOZ9mmsGJLAldI0sDLrLFZYdLLpeFq0wWL-c-grsY2EWekcRVva6ZEDvFFQ9m8t_VQlC9ECk9MVTgP9wrnd9Xc9ugH_nW0UXDbR_Xt2d-ndIBDaBrc_X57Vr-mmDwDVUjnsJaDuX3APOL218GZ3K60)

그리고 sqlite update문으로 passwordHash값을 바꿔치기하면 됩니다.

```bash
update _admins set passwordHash = "$2a$08$qeqzNleYmDf87kND.LfgU.MhmE9qQ1aecPtlpeEmm.zd.dq5UAwr." where email = "cpro95@daum.net";
```

이렇게 하시면 됩니다.

이제 다시 로그인해보면 암호를 12345678로 해서 접속이 될 겁니다.

당연히 새로 접속하시면 관리자 비밀번호를 아래와 같이 꼭 바꿔주시기 바랍니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEghSehv4N62oV7x7rytuP0GZm4A_vw09H-SicCxlXriBfD1xu0xRZ2lszQK9xCYxzzyaky-3XV_qM7-b5aHWopoldfPz0fc2iM1k2SRFemzhnglYYQKlvTzWg9XY5opG6RzPCxGWI3cqpwno6wYy_V-eZdiqeVuhzODmmyX4aneUyZm-fZ7RmLWTKFbRKQ)

---

## 3. pb_public 폴더에 대해 알아보기

아까 위에서 우리가 pb_data 폴더가 실제 DB가 있는 폴더라고 했습니다.

포켓베이스는 pb_public 폴더를 지원하는데요.

이 폴더에 HTML 파일을 위치시키면 이 파일을 웹 호스팅하게 됩니다.

그러면 이 pb_public 폴더에 리액트로 Single Page App을 만들고 빌드 해서 여기에 넣으면 리액트 앱이 웹상에서 실행되겠죠.

일단 로컬 파일에 빈 폴더로 리액트 앱을 하나 만들겠습니다.

```bash
npx create-react-app pb-app

cd pb-app

npm start
```

리액트 앱을 만들었으면 App.js에서 Hello React 문구만 다른 걸로 바꾸십시오.

그래야 나중에 내가 만든 게 제대로 빌드되는지 확인할 수 있으니까요?

그리고 실제 리액트 앱을 build 합시다.

"npm run build"를 실행하면 리액트 앱이 "build" 폴더에 만들어지는데요.

우리는 이 build 폴더를 Fly.io 가상서버로 올려야 합니다.

SFTP를 이용할 거라서 build 폴더를 압축해서 build.zip 파일로 만듭니다.

그리고 아래와 같이 sftp 접속하면 됩니다.

'-a' 옵션이 아무 데서나 해당 앱을 지정할 수 있는 옵션입니다.

```bash
➜  pb-app git:(main) ✗ fly ssh sftp shell -a mypocketbase
» cd pb
[/pb/]
» ls
pb_data/
LICENSE.md
pocketbase
CHANGELOG.md
»
```

위와 같이 pb 폴더로 들어가면 우리가 ssh console로 봤던 파일들이 있습니다.

이제 이 폴더에 sftp의 put 명령어를 이용해서 로컬에 있는, 즉, 내 컴퓨터에 있는 build.zip 파일을 원격으로 전송하겠습니다.

```bash
» put build.zip
191228 bytes written
» ls
pb_data/
build.zip
LICENSE.md
pocketbase
CHANGELOG.md
»
```

이제 전송이 끝났으니까요.

SFTP는 Ctrl+C 로 접속을 끝내면 됩니다.

이제 다시 SSH 접속을 해볼까요?s

그리고 build.zip 파일을 압출 풀고 이름을 pb_public 라는 이름으로 바꾸겠습니다.

그리고 build.zip 파일도 지우고요.

```bash
➜  pb-app git:(main) ✗ fly ssh console -a mypocketbase
Connecting to fdaa:57cc:7b17c:c:a25a:2... complete
5683d449f16328:/# cd pb
5683d449f16328:/pb# ls -al
total 45340
drwxr-xr-x    4 root     root          4096 Sep  9 03:24 .
drwxr-xr-x   21 root     root          4096 Sep  9 02:52 ..
-rw-r--r--    1 root     root         84985 Sep  6 04:14 CHANGELOG.md
-rw-r--r--    1 root     root          1090 Sep  6 04:14 LICENSE.md
-rw-r--r--    1 root     root        191228 Sep  9 03:24 build.zip
drwxr-xr-x    3 root     root          4096 Sep  9 03:11 pb_data
-rwxr-xr-x    1 root     root      46129152 Sep  6 04:19 pocketbase
5683d449f16328:/pb# unzip build.zip
Archive:  build.zip
   creating: build/
  inflating: build/favicon.ico
  inflating: build/index.html
  inflating: build/logo512.png
  inflating: build/asset-manifest.json
   creating: build/static/
  inflating: build/manifest.json
  inflating: build/robots.txt
  inflating: build/logo192.png
   creating: build/static/css/
   creating: build/static/js/
   creating: build/static/media/
  inflating: build/static/css/main.073c9b0a.css
  inflating: build/static/css/main.073c9b0a.css.map
  inflating: build/static/js/787.e3df66b9.chunk.js.map
  inflating: build/static/js/main.2e7d9145.js.map
  inflating: build/static/js/main.2e7d9145.js
  inflating: build/static/js/main.2e7d9145.js.LICENSE.txt
  inflating: build/static/js/787.e3df66b9.chunk.js
  inflating: build/static/media/logo.6ce24c58023cc2f8fd88fe9d219db6c6.svg
5683d449f16328:/pb# ls -al
total 45344
drwxr-xr-x    5 root     root          4096 Sep  9 03:24 .
drwxr-xr-x   21 root     root          4096 Sep  9 02:52 ..
-rw-r--r--    1 root     root         84985 Sep  6 04:14 CHANGELOG.md
-rw-r--r--    1 root     root          1090 Sep  6 04:14 LICENSE.md
drwxr-xr-x    3 root     root          4096 Sep  9 03:13 build
-rw-r--r--    1 root     root        191228 Sep  9 03:24 build.zip
drwxr-xr-x    3 root     root          4096 Sep  9 03:11 pb_data
-rwxr-xr-x    1 root     root      46129152 Sep  6 04:19 pocketbase

5683d449f16328:/pb# mv build pb_public
5683d449f16328:/pb# rm build.zip
5683d449f16328:/pb# exit
```

이제 끝났습니다.

이제 'https://mypocketbase.fly.dev' 주소로 들어가 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEj6IdEC1FlKExuMIcGvec7ZTtoVaydkbDma_XRZJNLTjSeel_iLMzEf00AH6EzhaitydOzAwjdTgwwIPrNBeBKdGdJtQsZWdirYKLILzkVf2EW-dp7sDENI0M9J2_XmDwf3ggV7J3ZhNk8rFZFQ6tC3YevO4N3l-4MbZoxlzyYl01j5TfYvEt6f9pCZiZA)

위 그림과 같이 리액트 앱이 웹 호스팅 되고 있습니다

아까 Hello 문구를 바꾼 것도 잘 적용되고 있네요.

어떤가요?

포켓베이스가 웹 애플리케이션을 만드는데 필요한 모든 걸 제공해 주네요.

다음 시간에는 본격적인 포켓베이스 API를 공부해 보겠습니다.

그럼.
