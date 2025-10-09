---
slug: 2022-08-15-understanding-show-and-mount-disks-on-linux-macos
title: 리눅스(Linux), macOS 같은 유닉스(Unix) 환경에서 디스크 관리 알아보기
date: 2022-08-15 14:42:09.552000+00:00
summary: 유닉스(리눅스, MacOS) 환경에서 USB 외장 디스크 마운트 하기
tags: ["lsblk", "exfat", "diskutil", "linux", "df", "mount"]
contributors: []
draft: false
---

안녕하세요?

오늘은 우분투 같은 리눅스에 외장 USB를 연결하는 방법 및 유닉스 같은 OS에서 디스크 관리에 대해 총괄적으로 알아보는 시간을 갖겠습니다.

일단 제가 집에서 NAS로 돌리고 있는 우분투 서버판을 이용해 보도록 하겠습니다.

---

## 리눅스(Linux)에서의 하드 디스크 관리

윈도 운영체제만 사용하시는 분들은 리눅스의 디스크 관리가 매우 어려울 수 있는데요.

리눅스에서는 디스크를 일종의 디렉터리로 관리합니다.

컴퓨터에 연결된 디바이스는 리눅스의 /dev 폴더 밑에 있는데요.

![mycodings.fly.dev-understanding-show-and-mount-disks-on-linux-macos](https://blogger.googleusercontent.com/img/a/AVvXsEjt-OvQQEZG1iTv5Srb4_GHyUcuQwgICO8stEwXyZAwHvlALa3RZEVbuDvmoLngKqGWFZLXRBOT5dORXlTZkvYdEkKFpU5DUaMocu0-MAdTXaLnLjagYP02mhhcwZW5T4KvmdUUTz7USNHYPVd-wJ4zUwMNOuSCCNeSvqEqu3V9g3NF6Hvu3azL0YyR)

위 스크린숏을 보시면 우분투 서버판의 /dev 폴더 내용입니다.

엄청 많은 디바이스가 컴퓨터에 붙어 있고 또는 리눅스 운영체제가 제공하는 서비스를 디바이스 형태로 운영하기 때문에 /dev 폴더 밑에 있는 것도 있습니다.

그럼, 우리가 이 모든 걸 알아야 할까요?

우리가 알아야 할 거는 바로 하드디스크 관련 폴더입니다.

|device name|desciption|
|-----------|----------|
|/dev/hd*|IDE 방식의 하드 디스크, /dev/hda가 첫 번째 하드디스크이며, /dev/hdb가 두 번째 하드디스크가 됩니다.|
|/dev/sd*|SCSI, SATA 방식의 하드 디스크(SSD포함), /dev/sda가 첫 번째, /dev/sdb가 두 번째를 뜻합니다.|
|/dev/nvme*|NVM Express(NVMe) pci SSD, /dev/nvme0n1이 첫 번째, /dev/nvme1n1이 두 번째를 뜻합니다.|

위 표를 보시면 굉장히 이름부터가 어려운데요.

예전에는 /dev/sd* 방식이 대부분이었다면, 요즘은 NVMe 방식이 많이 쓰이기 때문에 NVMe 방식의 이름도 외워두셔야 할 겁니다.

그럼, 자신의 컴퓨터에 있는 하드디스크를 어떻게 확인할까요?

---

## lsblk

리눅스에서는 'lsblk'라는 명령어를 통해 디스크 정보를 얻습니다.

'lsblk'는 'list block device'의 약자인데요.

한 번 실행해 볼까요?

![mycodings.fly.dev-understanding-show-and-mount-disks-on-linux-macos](https://blogger.googleusercontent.com/img/a/AVvXsEinBE2xSME7UHRvnJoTgtwGr6dHAnwts-x1Kotptc47eSUvDx4OCP59gjjAF2j8NN0mQH-H0TE4JawpHPZCO2JlonE5w4Dx4abEIDAvw6jdnqeoV6sV7u5nwWIYxVOz_OzrCfxltaDVpVFgKyA-CgUJKIoMniWkWk2BygJbfJAf_0dhdYlg8uVSpMW9)

위 스크린숏을 보면 block device가 꽤 많이 나오는데요.

우리가 관심 있게 볼 것은 sd*로 시작하는 디바이스입니다.


SATA 방식의 디스크란 얘기죠.

거의 대부분 SATA 방식이기 때문에 sd*로 시작하는 디바이스를 찾으면 됩니다.

```bash
sudo lsblk | grep sd
```

![mycodings.fly.dev-understanding-show-and-mount-disks-on-linux-macos](https://blogger.googleusercontent.com/img/a/AVvXsEh7sDhG2Idv6HHJGCpLoWx0VL6ErBL631y8tu46W29eLuFOqUGJ2QVexMWrqgNd8qQ9WWz67-ZlKw1uVfpHGOyGyO0hIDc28WLb1_X8wmwVNpsuB3wuKDNmdQluCgC1LsVOtYhmA0xh8_PRyebTtPqkS3scWS5jFyf2TyBg4DT0qfK3_KAEB0H_0ctZ)

위와 같이 grep 명령어로 sd라는 이름으로 시작하는 것만 추려봤습니다.

좀 더 사람이 읽을 수 있게 옵션을 추가해 볼까요?

```bash
sudo lsblk -o NAME,FSTYPE,SIZE,MOUNTPOINT | grep sd
```

![mycodings.fly.dev-understanding-show-and-mount-disks-on-linux-macos](https://blogger.googleusercontent.com/img/a/AVvXsEhTR_2Wi9w10IuHvyQ4MK5CXkw4C0EcFYfXJfxY8bcBUgVPAqI2xXeU2NNIH5x0wthunRcT_W1kn5XT9oFNo-z8yud0TwsSjieHbBsaaaPNReO8nhTEetm3vOfXCV2Chg7tBEauCGa83Z3mQ7UEUWju4iZud5d70Ef2yJYVtNUO6UeMH8q2YQfTv06X)

어떤가요? 좀 더 쉽게 이해되시죠?

sda 디스크는 통째로 파티션 없이 /mnt/ext4_disk라는 폴더로 마운트 되었고,

sdb 디스크는 통째가 아니라 파티션이 한 개 있는데, 파티션 중 sdb1 파티션이 /mnt/ext3_disk 폴더에 마운트 되었다는 뜻입니다.

그리고 ext4, ext3는 디스크의 파일 시스템인데요.

윈도는 NTFS를 쓰고, 맥은 HFS 또는 APFS, 리눅스는 ext4를 주로 씁니다.

최근에는 리눅스는 좀 더 발전된 파일 시스템을 쓰기도 하는데요.

일단 제 시스템에서 보면 리눅스 관련은 ext4나 ext3를 쓰네요.

위 스크린숏에서 sdc가 있는데 용량이 120기가네요.

부팅디스크 용도의 SSD입니다.

그리고 sdc2가 ext4 파일 시스템에 마운트 된 위치가 '/'를 가리키고 있는데 '/' 위치가 바로 리눅스의 루트(root) 디렉터리를 뜻합니다.

리눅스 시스템의 최상위 위치가 되는 거죠.

마지막으로 sdi 디스크가 보이는데요.

이건 제가 120GB USB를 꽂았기 때문에 나오는 겁니다.

sdi1이 보이는 걸로 봐서는 디스크를 통째로 쓰지 않고 파티션이 있다는 뜻이고, 파일 시스템은 exfat 파일 시스템이라고 나오네요.

그럼 USB 디스크를 읽으려면 어떻게 해야 할까요?

리눅스의 데스크톱 버전을 쓰시면 자동으로 마운트 되고, 마운트 위치까지 자동으로 잡아줍니다.

그러나, 우분투 서버 같은 터미널 형식의 리눅스에서는 자동으로 해주지 않는데요.

사용자가 직접 마운트 위치를 잡아줘야 합니다.

일단 저는 제 홈 폴더에 imsi 폴더를 만들고 거기에 마운트 해보겠습니다.

```bash
mkdir imsi

ls -l imsi

sudo mount -t exfat /dev/sdi1 ./imsi

ls -l imsi
```

![mycodings.fly.dev-understanding-show-and-mount-disks-on-linux-macos](https://blogger.googleusercontent.com/img/a/AVvXsEjfjid5Y1L1BOeVgqJa2JC2Whsqv3Wo8oruK3ggrwZr85v-7H0ECfr7rnTBHZBv2UZ_hsKPOepNlzpgocyuZM_74f8Eya6l5HMRtEv-Uv4WW0Hi0RNmh8ZEuWTvGymKsugqS4OaexyDjViBOvjJ0kTmLGkh_oU55ktXgzPWnuxABED90x5KGT8NVsj0)

어떤가요?

제 USB 파일을 imsi 폴더에 마운트 했습니다.

mount는 웬만한 시스템에서는 root 관리자만 실행할 수 있게 되어 있어 'sudo' 명령어를 사용했습니다.

그리고 mount 명령어는 위와 같이 -t 옵션을 주어 파일 시스템을 지정할 수 있습니다.

그럼 umount를 해볼까요?

```bash
sudo umount imsi

ls -l imsi
```

![mycodings.fly.dev-understanding-show-and-mount-disks-on-linux-macos](https://blogger.googleusercontent.com/img/a/AVvXsEhQHJS8Nh2nqpA66Hy1qttc7sI2u-2J54yptPdf5_pZOAA0G9J4hN-fkppHAJnCGL95eDnzopbGxvdp-1nKNUbkMvkJN7nl_p-qXYFzHz9Wt30aG81SeEaG5c8dnAMAxAV1AwWpQDfetGdZVYKYKb8Pa5ABG3JMXXI09rt2BNI1KqE_toOlYJy2kv2u)

umount 명령어가 바로 언마운트(un-mount) 명령어입니다.

lsblk 명령어로 좀 더 자세한 정보를 얻으려면 다음과 같이 하시면 됩니다.

```bash
sudo lsblk -f -m | grep sd
```

![mycodings.fly.dev-understanding-show-and-mount-disks-on-linux-macos](https://blogger.googleusercontent.com/img/a/AVvXsEhCmCFW14NLZdIvk2EqksXpzB17NUmeMdMoaur0P3wU_Gxd94bLXHivLrnOAheseJOetZ1qBVNkkFsW191CwUjHLQys7QfdiGVQhy8iYzrZa4ng_ewrBKLNbbpnjyJf97YXlSnd3AWjUNG0Tj6yzJy3dUZddstNsph7BIe5AhRNRXivUm9mp8JicXcL)

디스크의 UUID 번호, 용량, 마운트 위치 등등이 아주 자세히 보입니다.

## blkid 명령어로 디스크 정보 보기

blkid 명령어도 lsblk 명령어처럼 디스크 정보를 보는 데 있어 아주 자세히 알려주는데요.

다음과 같이 하면 됩니다.

```bash
sudo blkid | grep sd
```

![mycodings.fly.dev-understanding-show-and-mount-disks-on-linux-macos](https://blogger.googleusercontent.com/img/a/AVvXsEiS-s7a_lgna1syPRqMosIPduW-NbmuPNhdtxMEM44Pv_twKZh2Q3bO1XTjtPrJMbG6Pi57f_zNAPnwWH9X136tdo7rEU9s8dkhmrJMsEetYnQWXLse-Op8poIYMML6GdMuRJxmikvJ1Af4H8oSEeaEZXtFoXJfhUY3FQH4cLKhQaITsQx9Xw-eaxIc)

---

## fdisk 명령어로 디스크 정보 알아보기

리눅스에는 fdisk 명령어가 있는데요.

예전 MS-DOS 시절에도 fdisk 명령어가 있었습니다.

거의 모든 OS에는 fdisk 명령어가 있는데요.

리눅스에서는 sudo 명령어를 통해 root 권한으로 실행해야 합니다.

```bash
sudo fdisk -l | grep sd
```

마지막에 'grep sd'를 쓴 이유는 출력 결과물에서 sd가 포함되어 있는 것만 추려내라는 명령어입니다.

그래서 결과는 좀 더 깔끔하게 아래와 같이 나옵니다.

![mycodings.fly.dev-understanding-show-and-mount-disks-on-linux-macos](https://blogger.googleusercontent.com/img/a/AVvXsEiF0_tFwVT8eJ3_nb1cHtuRexRChrN7u0Hd192LRvhQBeoH_kuqGq61YnaIbsClb5bvAUlQNeOV81Sc8IP2-KSas1a1Uyx9W8A2QQkAdytaCAOyqQSEMB4AAHyNklkMEeTyynACG7hLTpgaVfo2BdEAlGEeJWhzMb1ICNmwlhP8nz1I93f_yDEV5u4j)

뭔가 기계적인 모습이 많이 보입니다.

그리고 마지막 '| grep sd' 문구를 빼고 실행해 보십시오.

이상한 디스크가 많이 나올 겁니다.

그리고 개별 디스크 정보를 상세히 보려면 아래와 같이 하시면 됩니다.

```bash
sudo fdisk -l /dev/sda

sudo fdisk -l /dev/sdi
```

![mycodings.fly.dev-understanding-show-and-mount-disks-on-linux-macos](https://blogger.googleusercontent.com/img/a/AVvXsEjGyIP0Hlv_W0WRoePkVNH_Gdvu8W39yW04vUUrdmycoM0f3KgC2sclMTxIbc7jlr9wmyBoDdGv1j7GqkZFsdK05sCEg-2JPHc24dru5Kez3X-BG1ntQr8zXXVuXiqHUi3yt9A5qUlX1G-6DhM_m0qZYZ90Cz2QeoP34fZNUyRECyHXBsXJcLiWxOfY)

---

## 2TB 이상의 디스크 정보 표시

fdisk 명령어는 아주 오래전에 만든 명령어라 2TB 이상의 디스크 정보는 나타낼 수 없는데요.

그럴 때는 최근에 만든 parted 명령어를 쓰면 됩니다.

```bash
sudo parted /dev/sdb
```

![mycodings.fly.dev-understanding-show-and-mount-disks-on-linux-macos](https://blogger.googleusercontent.com/img/a/AVvXsEiwntM0hEjuga48icS2wqt2SO6FdDL0pvk5xBkBctkZ2TuXJ_Uxg9L4ZJ39JaLor4dPbEcAUQh2DnbffRUSetZOj7bRPrim5BfwUll4P1y4Y1iGjCzp4SCzfwgYCjIGkuNEkk9jngF5ddbb9erNSRUmQMX_trR1WxwZ3Ovp1OUfLnGQlrdIWpirl8im)

위 스크린숏처럼 parted 명령어를 실행시키면 위와 같이 parted 프롬프트로 바뀌는데요.

print나 quit 명령어를 사용하시면 됩니다.

---

## 리눅스에서 디스크 정보 표시하는 가장 좋은 방법은?

바로 가장 뒤늦게 개발된 parted 명령어를 list 옵션을 두어 실행하는 겁니다.

```bash
sudo parted -l
```

![mycodings.fly.dev-understanding-show-and-mount-disks-on-linux-macos](https://blogger.googleusercontent.com/img/a/AVvXsEjOJM4h8n_5r2LAN5exCp786qRqkL3KvbpwMZWWk2Lr6sq8XzVSEJsSDrQea8mthgpTxMB_s8CPEq8prfklLVXA2jGPQsI0ymsnBxLP8yXF7yiUBQtbes6HNdHGbRfnMsyXsQE-gdgmXsYEKDX8QDThhzeuBT_fngtARDxJiWW0FMbDnXbAgzPJOzHu)

어떤가요?

가장 최근에 만든 명령어가 정말 효과적이지 않나요?

---

## 남은 용량 표시하기

디스크의 남은 용량을 표시하는 명령어가 리눅스나 유닉스, 맥OS에 있는데요.

바로 'df' 명령어입니다.

'disk free'의 약자인데요.

```bash
df -H

df -h
```

위 코드에서 보면 -H 나 -h 옵션을 주었는데요.

이거 빼고 실행 해 보면 그 차이를 쉽게 알 수 있을 겁니다.

-h 옵션은 휴먼 리더블이라고 사람이 읽기 쉽게 GB나 TB, 또는 MB 단위로 알려주기 때문에 꼭 -h 옵션을 주고 사용하시기 바랍니다.

그리고 -h, -H의 소문자와 대문자 차이는 단위 차이입니다.

그리고, df 명령어 뒤에 파일 또는 디렉터리가 지정될 경우, df 명령은 해당 파일이나 디렉토리가 상주하고 있는 파일 시스템에 대한 정보를 표시합니다.

![mycodings.fly.dev-understanding-show-and-mount-disks-on-linux-macos](https://blogger.googleusercontent.com/img/a/AVvXsEgLYW3h2XfrJsTxVOuEuo1sR1tbmvUKtl8qvRec7iL5l585O_4mVYhNGp1-FfJsjlgWNJ4yexgZa_qfS_x8f6Oyu74Muy2lh0P6l28kBJg5xyp2omMfpMgJTqcy-2tOddbJluEn1GM3xv9rI33NmZCAB_zO-kqmmRfXMhlMQ0lgdNuU7pHhUkkTO5bv)

위 스크린숏을 보면 그 차이를 쉽게 이해할 수 있을 겁니다.

---

## macOS에서 디스크 정보 알아보는 명령어

macOS는 freeBSD 기반 위에 애플이 자체적으로 명령어를 개발했는데요.

바로 diskutil 이란 명령어입니다.

```bash
diskutil
```

![mycodings.fly.dev-understanding-show-and-mount-disks-on-linux-macos](https://blogger.googleusercontent.com/img/a/AVvXsEjVT9-UR1IkjKTqW-Xifj-vMG6a4aGpxKdAnDBj63BSyaFq_UFkplU0YmaLL6iTgqytdIR2TzgzN9DxyAnOKoUKADZ0LbdRYYW0kI4oDNjGWQ8rui-COYqzwuUVK01wAkFGtp9D5DuYsFJAnDU9qIdFCWrTRlzmXMd0lbr5lKZKU7iyNx87XuXTP4rJ)

옵션이 아주 많은데요.

가장 많이 쓰이는 옵션은 list입니다.

```bash
diskutil list
```

![mycodings.fly.dev-understanding-show-and-mount-disks-on-linux-macos](https://blogger.googleusercontent.com/img/a/AVvXsEie0p2kMjM0V3wE0a9qqZ3ys-DJ3e5zdCtnORSUUzdiWCXbs5Ci_LzrCDQ7P3TDzPUOQiU14rka398XNm-HBBOHcZQvS4_WU3kssP8mHRDE3FLN978OL-QetlqLlrz_aXGIU1rdhlxEAM189sWkfZNFip5JerrCr-3c1_jc0qZ7JT1yoH3ded9muxyr)

제 macOS노트북의 디스크 정보를 다 알려 주고 있네요.

맥OS에서는 디스크 넘버링이 /dev/disk0부터 시작합니다.

애플이 되게 깔끔하게 만들어 놨네요.

그럼 각 디스크 세부 정보를 살펴볼까요?

```bash
diskutil info /dev/disk0
```

![mycodings.fly.dev-understanding-show-and-mount-disks-on-linux-macos](https://blogger.googleusercontent.com/img/a/AVvXsEgEaNsbVh3lGZJpruP2chpMMZjo0I4JT8hL98T40x8881dg_coBnk4i-LvDIqYD-QGx3FNMEf5SjxpoCMNNHuMooyi80j7yxI7osFhvJpowgdb3Sfp-pD1Q_fXAxnK-5Q17z1tQUOo7z37mYGSU-SerL0jX85f4CpgwF5Qz6xZPgJFJ-PQBtd4otRdR)

좀 더 자세한 설명이 나오고 있네요.

물론 맥 OS에서도 df 명령어도 통하니까요, 꼭 사용하시기 바랍니다.

지금까지 유닉스 환경에서는 디스크 마운트, 정보 표시 등의 명령어에 대해 알아보았습니다.

그럼.
