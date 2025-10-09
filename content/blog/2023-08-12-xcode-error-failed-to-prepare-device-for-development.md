---
slug: 2023-08-12-xcode-error-failed-to-prepare-device-for-development
title: 낮은 버전의 Xcode 사용 시 failed to prepare device for development 에러 대처법
date: 2023-08-12 10:02:40.364000+00:00
summary: 낮은 버전의 Xcode 사용 시 failed to prepare device for development 에러 대처법
tags: ["Xcode", "iOS", "macOS"]
contributors: []
draft: false
---

안녕하세요?

오늘은 요즘 독학하고 있는 iOS 공부 관련인데요.

그 중 에서 Xcode 관련 내용입니다.

제 해킨토시는 i5-8250에 macOS Monterey를 얹어 사용하고 있는데요.

최신 버전 Ventura로 업데이트하려니 엄두가 안 나고 있어, 그냥 쓰고 있는데요.

그래서 Xcode 버전은 14.2입니다.

그리고 제 아이폰 13은 현재 버전 16.6 이구요.

---

실제 애플 개발자 등록은 안 했지만 배우고 있는 조그마한 앱을 제 핸드폰에 실제 설치해서 테스트해 보고 싶었는데요.

그래서 아래 그림처럼 build 대상을 제 핸드폰으로 지정하면 핸드폰에 debug 빌드가 설치됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEieYaJ1jgH3lndIsCpiE0yh0iDz4puy1ZEfoM_sC-e1VBk23tABddfQlyteaBmuDGGsSKrxzHN6XepmE5-ubIZ_LMDccL_tCqOP7wsP4MgC2goaTrD0zZHV5hSzWTJtu4Sf0jHfxS2cgulh1yDYW1DxtXvt014wAEch_JRHDGASf59-sunwGgXLn8-PKQ0)

그런데 Xcode가 지원하는 iOS 숫자가 16.2입니다.

제 핸드폰은 16.6으로 운영 중이고요.

그래서 "failed to prepare device for development" 에러가 뜨는데요.

이 에러가 뜨는 이유는 Xcode가 iPhoneOS를 지원하는 아주 조그마한 데이터가 있어야 합니다.

실제 Xcode가 설치된 폴더로 가보면 그 리스트가 나오는데요.

```bash
➜  DeviceSupport> pwd
/Applications/Xcode.app/Contents/Developer/Platforms/iPhoneOS.platform/DeviceSupport
➜  DeviceSupport> ls -l
total 0
drwxrwxr-x  4 cpro95  staff  128  4  9 12:29 11.0
drwxrwxr-x  4 cpro95  staff  128  4  9 12:29 11.1
drwxrwxr-x  4 cpro95  staff  128  4  9 12:29 11.2
drwxrwxr-x  4 cpro95  staff  128  4  9 12:29 11.3
drwxrwxr-x  4 cpro95  staff  128  4  9 12:29 11.4
drwxrwxr-x  4 cpro95  staff  128  4  9 12:29 12.0
drwxrwxr-x  4 cpro95  staff  128  4  9 12:29 12.1
drwxrwxr-x  4 cpro95  staff  128  4  9 12:29 12.2
drwxrwxr-x  4 cpro95  staff  128  4  9 12:29 12.3
drwxrwxr-x  4 cpro95  staff  128  4  9 12:29 12.4
drwxrwxr-x  4 cpro95  staff  128  4  9 12:29 13.0
drwxrwxr-x  4 cpro95  staff  128  4  9 12:29 13.1
drwxrwxr-x  4 cpro95  staff  128  4  9 12:29 13.2
drwxrwxr-x  4 cpro95  staff  128  4  9 12:29 13.3
drwxrwxr-x  4 cpro95  staff  128  4  9 12:29 13.4
drwxrwxr-x  4 cpro95  staff  128  4  9 12:29 13.5
drwxrwxr-x  4 cpro95  staff  128  4  9 12:29 13.6
drwxrwxr-x  4 cpro95  staff  128  4  9 12:29 13.7
drwxrwxr-x  4 cpro95  staff  128  4  9 12:29 14.0
drwxrwxr-x  4 cpro95  staff  128  4  9 12:29 14.1
drwxrwxr-x  4 cpro95  staff  128  4  9 12:29 14.2
drwxrwxr-x  4 cpro95  staff  128  4  9 12:29 14.3
drwxrwxr-x  4 cpro95  staff  128  4  9 12:29 14.4
drwxrwxr-x  4 cpro95  staff  128  4  9 12:29 14.5
drwxrwxr-x  4 cpro95  staff  128  4  9 12:29 15.0
drwxrwxr-x  4 cpro95  staff  128  4  9 12:29 15.2
drwxrwxr-x  4 cpro95  staff  128  4  9 12:29 15.4
drwxrwxr-x  4 cpro95  staff  128  4  9 12:29 15.5
drwxrwxr-x  4 cpro95  staff  128  4  9 12:29 15.6
drwxrwxr-x  4 cpro95  staff  128  4  9 12:29 15.7
drwxrwxr-x  4 cpro95  staff  128  4  9 12:29 16.0
drwxr-xr-x  4 cpro95  staff  128  4  9 12:29 16.1
drwxr-xr-x@ 4 cpro95  staff  128  9 15  2022 16.2
drwxr-xr-x@ 4 cpro95  staff  128  4  3 22:28 16.5
drwxr-xr-x@ 4 cpro95  staff  128  7 26 16:14 16.6
```

위에서 볼 수 있듯이 Xcode가 지원하는 iOS의 버전 리스트가 나오는데요.

제 Xcode는 버전 14.2라서 16.2밖에 없었습니다.

그래서 여기에 16.5랑 16.6을 추가했는데요.

이 자료는 아래 링크에서 받으시면 됩니다.

[https://github.com/JinjunHan/iOSDeviceSupport](https://github.com/JinjunHan/iOSDeviceSupport)

여기서 iOSDeviceSupport 폴더로 들어가시고,

원하는 버전을 누르면 아래와 같이 나오는데요.

오른쪽 마지막 버튼을 누르면 ZIP 파일을 다운로드할 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgilIb4bgiXGEFVq24K0-bI2aRBPLnWTp4BcUgL-3iTAucL_pWKPidwGPc3cMvw672Wb-cSQr5Jv9ZHvlumop-soCSUAB-npBLWke3XGL08__z4biUmgzQFW7NPO1kxnZLCTs3oXIKrPz9JAauUdnU4hWqd9NVSSJKYgNvlUYBX_CHnICgv7QsrIQJ4rkc)

그리고 폴더 자체로 DeviceSupport 폴더에 복사하면 끝입니다.

---

이제 Xcode를 다시 실행하고 Build 작업해 보면 실제 해킨토시와 연결된 아이폰에 내가 만든 앱이 설치될 겁니다.

---

개발자 등록을 안 한 경우 개발자를 신뢰할 수 없다고 나오는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjlXWgYSZzS-OdtjYCgtjW5yO9Wtz1xywUtY7XlXHvenSGn2UZxCm1PKyn1UuySOeUBAaaQ8jSzkWXOeUQe9o4d-WrrDCi-JjjintuIHX5G_GL1bS_qOzyZpA0fk5DCCoNI3G-yZ7bsR635IklJMCyvV5mq-QTkS1kNnvwVKK2-1OknPybJzQIZwz_yOxQ)

이 경우 아이폰 설정에 들어가서 일반으로 다시 들어간 다음 VPN 및 기기관리로 들어가셔서 신뢰한다고 클릭하시면 됩니다.

`내 아이폰에서 > 설정 > 일반 > VPN 및 기기관리`

이제 실행하시면 잘 될 겁니다.

그럼.



