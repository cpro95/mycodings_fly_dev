---
slug: 2024-05-25-react-native-tutorial-1-introduction-and-expo-and-error
title: 리액트 네이티브 강좌. 1편 - 소개 및 Expo 살펴보기
date: 2024-05-25 05:51:49.157000+00:00
summary: 리액트 네이티브 강좌. 1편 - 소개 및 Expo 살펴보기
tags: ["react native", "expo"]
contributors: []
draft: false
---

안녕하십니까?

리액트 네이티브 강좌 1편입니다.

편의를 위해 전체 강좌 링크도 넣었습니다.

1. [리액트 네이티브 강좌. 1편 - 소개 및 Expo 살펴보기](https://mycodings.fly.dev/blog/2024-05-25-react-native-tutorial-1-introduction-and-expo-and-error)

2. [리액트 네이티브 강좌. 2편 - 핵심 컴포넌트 가이드 - 뷰, 텍스트, 이미지부터 커스텀 컴포넌트까지](https://mycodings.fly.dev/blog/2024-06-06-react-native-tutorial-2-core-components-complete-guide)

3. [리액트 네이티브 강좌. 3편 - 스타일링 - 스타일시트, 박스 모델, 그림자, 그리고 상속](https://mycodings.fly.dev/blog/2024-06-08-react-native-tutorial-3-styling-guide-stylesheets-box-model-shadows-inheritance)

4. [리액트 네이티브 강좌. 4편 - Flexbox - 기본 개념과 flexDirection 설정](https://mycodings.fly.dev/blog/2024-06-10-react-native-tutorial-4-flexbox-basics)

5. [리액트 네이티브 강좌. 5편 - Flexbox - 정렬 및 레이아웃 속성](https://mycodings.fly.dev/blog/2024-06-15-react-native-tutorial-5-flexbox-alignment-layout)

6. [리액트 네이티브 강좌. 6편 - Flexbox - basis, shrink, grow 및 레이아웃 전략](https://mycodings.fly.dev/blog/2024-06-15-react-native-tutorial-6-flexbox-basis-shrink-grow-and-absolute-relative-layout-strategies)

7. [리액트 네이티브 강좌. 7편 - 동적인 사용자 인터페이스 구현하기 - Dimensions API와 플랫폼별 코드 작성법](https://mycodings.fly.dev/blog/2024-06-16-react-native-tutorial-7-implementing-dynamic-user-interfaces-with-react-native)

8. [리액트 네이티브 강좌. 8편 - 리스트 렌더링하기 그리고 FlatList, SectionList 사용하기](https://mycodings.fly.dev/blog/2024-06-29-react-native-tutorial-8-list-rendering-flatlist-sectionlist)

9. [리액트 네이티브 강좌. 9편 - Input and Forms with Switch, KeyboardAvoidingView, Form Validation](https://mycodings.fly.dev/blog/2024-06-30-react-native-9-textinput-and-form-with-validation)

10. [리액트 네이티브 강좌. 10편 - Networking 다루기, 데이터 fetching, loading state, error handling](https://mycodings.fly.dev/blog/2024-07-01-react-native-10-networking-data-fetching-load-state-error-handling-data-post)

11. [리액트 네이티브 강좌. 11편 - 스택 네비게이션과 화면 간 데이터 관리](https://mycodings.fly.dev/blog/2024-07-13-react-native-11-stack-navigation)

12. [리액트 네이티브 강좌. 12편 - 드로어, 탭 네비게이션 그리고 중첩 네비게이션 마스터하기](https://mycodings.fly.dev/blog/2024-07-13-react-native-12-react-navigation-guide-drawer-tab-navigation)

---

** 목 차 **

- [리액트 네이티브 강좌. 1편 - 소개 및 Expo 살펴보기](#리액트-네이티브-강좌-1편---소개-및-expo-살펴보기)
  - [리액트 네이티브란 무엇일까요?](#리액트-네이티브란-무엇일까요)
  - [Expo와 리액트 네이티브의 차이](#expo와-리액트-네이티브의-차이)
  - [첫 번째 리액트 네이티브 프로젝트](#첫-번째-리액트-네이티브-프로젝트)
  - [에러 발생시](#에러-발생시)

---

## 리액트 네이티브란 무엇일까요?

리액트 네이티브는 리액트를 사용하여 네이티브 안드로이드 및 iOS 애플리케이션을 빌드하기 위한 오픈 소스 프레임워크입니다.

자바스크립트를 활용해 플랫폼별 API에 접근하며, 리액트 컴포넌트를 사용해 사용자 인터페이스의 외관과 동작을 정의할 수 있습니다.

리액트는 사용자 인터페이스를 구축하기 위한 라이브러리로, 웹 애플리케이션을 만들기 위해서는 리액트 DOM을, 네이티브 모바일 애플리케이션을 위해서는 리액트 네이티브를 사용합니다.

따라서 리액트와 리액트 네이티브의 차이를 이해하는 것이 중요합니다.

리액트 네이티브를 배우면 iOS와 안드로이드 앱을 동시에 개발할 수 있습니다.

기존에 리액트를 사용해본 경험이 있다면, 리액트 네이티브를 배우는 데 큰 어려움이 없습니다.

이러한 이유로 리액트 네이티브는 취업 시장에서 높은 수요를 자랑합니다.

별도의 iOS 및 안드로이드 개발 팀 대신, 리액트 네이티브에 능숙한 단일 팀을 구성해 시간과 비용을 절감할 수 있으며, 웹 애플리케이션 개발에도 그 전문성을 확장할 수 있습니다.

## Expo와 리액트 네이티브의 차이

리액트 네이티브 프로젝트를 시작하기 전에 Expo와 리액트 네이티브의 차이를 이해하는 것이 중요합니다.

두 프레임워크 모두 안드로이드와 iOS 앱 개발을 허용하지만, 유지보수, 설정의 용이성, 플랫폼 호환성 측면에서 다릅니다.

리액트 네이티브는 메타(페이스북)에서 유지 관리하는 오픈 소스 프레임워크로, 크로스 플랫폼 앱을 빌드하기 위해 설계되었습니다.

반면, Expo는 Expo 자체에서 유지 관리하는 독립적인 오픈 소스 프레임워크로, 리액트 네이티브를 중심으로 구축된 도구와 서비스 모음으로 개발 과정을 단순화합니다.

Expo를 사용하면 Windows나 Linux에서도 iOS 앱을 개발할 수 있습니다.

Expo는 엔터프라이즈 모바일 앱을 빌드하는 데 필요한 거의 모든 기능을 지원하며, 필요할 경우 앱을 이젝트하여 순수 리액트 네이티브 코드베이스로 작업할 수 있는 유연성을 제공합니다.

리액트 네이티브 커뮤니티에서도 Expo를 초보자에게 최적의 시작점으로 추천하고 있습니다.

이번 시리즈에서도 Expo를 사용해 리액트 네이티브 프로젝트를 시작해보겠습니다.

## 첫 번째 리액트 네이티브 프로젝트

먼저 개발 환경을 설정해 봅시다.

리액트 네이티브를 위해서는 Node.js와 코드 에디터 두 가지가 필요합니다.

Node.js와 코드 에디터로는 VS Code를 추천합니다.

이제 첫 번째 리액트 네이티브 프로젝트를 만들어보겠습니다.

기술적으로는 엑스포 프로젝트를 만들 것입니다.

```bash
npx create-expo-app@latest hello-world
```

create-expo-app은 엑스포 패키지가 이미 설치된 새로운 리액트 네이티브 프로젝트를 생성하는 명령줄 도구입니다.

`@latest`를 추가하여 최신 버전의 엑스포를 설치합니다.

엔터를 누르면 몇 초 후에 새로운 프로젝트 디렉토리가 생성되고, 프로젝트를 로컬에서 실행하기 위한 모든 필수 종속성이 설치됩니다.

이제 프로젝트를 실행하기 전에 생성된 다양한 파일과 폴더를 간단히 살펴보겠습니다.

먼저, `package.json` 파일은 프로젝트의 종속성, 스크립트, 메타데이터를 포함하고 있습니다.

여기에는 엑스포, 리액트, 리액트 네이티브 등의 필수 패키지가 포함되어 있습니다.

스크립트 섹션에는 개발 서버를 시작하는 `start` 스크립트와 안드로이드, iOS, 웹 플랫폼을 타겟으로 하는 추가 스크립트가 있습니다.

다음은 `babel.config.js` 파일입니다.

```json
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
```

이 파일은 Babel 구성 파일로, 기본 리액트 네이티브 프리셋을 확장하는 엑스포 프리셋을 적용합니다.

데코레이터, 프리셰이킹 웹 패키지, 폰트 아이콘 로딩 등 다양한 기능이 포함되어 있습니다.

그 다음으로 `app.json` 파일을 살펴보겠습니다.

```json
{
  "expo": {
    "name": "hello-world",
    "slug": "hello-world",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "myapp",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router"
    ],
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

이 파일은 프로젝트의 설정 옵션을 포함하고 있으며, 개발, 빌드, 제출, 업데이트 과정에서 프로젝트의 동작을 변경합니다.

마지막으로 `app` 폴더입니다.

이 폴더는 프로젝트의 기본 화면으로, 개발 서버를 시작할 때 로드되는 루트 폴더입니다.

이제 애플리케이션을 실행할 시간입니다.

iOS 기기, 안드로이드 기기, iOS 시뮬레이터, 안드로이드 에뮬레이터에서 앱을 실행하는 여러 가지 방법이 있습니다.

저는 아이폰에서 과정을 시연하겠지만, 안드로이드 기기에서 실행하는 방법도 안내해 드리겠습니다.

1단계: 프로젝트 폴더로 이동하여 다음 명령어를 실행하세요.

```bash
npm start
```
이 명령어를 실행하면 곧 사용할 QR 코드가 생성됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiL_dcpWFE-vj43TmAjnrY3B8pk_QFIUQ1VH9TDGIPXTOhxldAuZFT2Xs1nmDAPLXKV3r23Mvqpv9nWtCBklfo79gW1gRQUnIWu7ScMygl6MsX3aJmrywufP3oQojsv4TX5woAXv57swX90r0WZE5P7C1tkF3s_vJR-Hq80DKuv2h8sTRP6laqTQIO-lUQ)

2단계: 기기에 엑스포 고(Expo Go) 앱을 다운로드하세요.

아이폰 사용자는 앱 스토어에서, 안드로이드 사용자는 플레이 스토어에서 찾을 수 있습니다.

3단계: 컴퓨터와 모바일 기기가 동일한 Wi-Fi 네트워크에 연결되어 있는지 확인하세요.

4단계: 아이폰에서는 카메라 앱을 열어 터미널에 표시된 QR 코드를 스캔하세요.

안드로이드 기기에서는 엑스포 고 앱 내의 QR 코드 스캐너를 사용하세요.

몇 초 후에 앱이 기기에서 실행되는 것을 볼 수 있을 것입니다.

이제 iOS 시뮬레이터에서 앱을 실행하는 방법을 알아보겠습니다.

iOS 시뮬레이터는 Mac에서만 실행할 수 있으며, Windows나 Linux 시스템에서는 불가능하다는 점을 유의하세요.

1단계: 터미널에서 프로젝트 폴더로 이동한 후 다음 명령어를 실행하세요.

```bash
npm start
```
2단계: 앱 스토어에서 Xcode를 다운로드하고 필요한 권한을 부여하세요.

3단계: 터미널에서 iOS 시뮬레이터를 여는 단축키를 확인하세요.

단축키는 'I'입니다. 키보드에서 'I'를 누르세요.

몇 초 후에 iPhone 시뮬레이터가 열리고, 엑스포 고 앱을 열라는 메시지가 표시될 것입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjP8GgnGTlPve13GB1HAUmbtBu59GleqCEsyD1ui3bZ9mMkW9GMyK4T1ioUfYus9LPVG-gb9IPbuvs3n0ahTxezhBfvfO5N_2g3X8wLx4ujU1X2ODH8LJT-pxOGdgIwZdUS0Vl6hp_p365_gkcR3rrhk0OTp2eOvFqYb-yV75WaS6cQNQEZLodFYz4VTz4)

권한을 부여하면, 시뮬레이터에서 엑스포 앱이 실행되는 것을 볼 수 있습니다.

다른 기기를 사용하고 싶다면, Xcode에서 'File > Open Simulator'로 이동하여 원하는 기기를 선택하세요.

다시 VS Code로 돌아와 터미널을 활성화한 상태에서 'I'를 다시 누르세요.

그러면 엑스포 고 앱에서 애플리케이션이 열리고, 선택한 기기에서 앱이 실행될 것입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjiIqYMtwic1Ccarr18PuChvgsxtzF0J1nueDaCs_ev_2i8xLLIjjuqwqAHBOxASytS3UkBq1xBSR3DbMhPKN9WButEbPd1Dkq58drJAEg_ydaNV3aR8YbfHfzp0Plt1xVVgWhDUwIApBtzM9YTney4fddeZSluRo4hP8tovqfV06ikf2IG5YGr3olh7eU)

![](https://blogger.googleusercontent.com/img/a/AVvXsEjK29ZNhnjodVmtVERk2BROn6XMhHy2UvgMsvnSk01Vs0nlf-lgHOgMjgfci7Ym5L7_iTkvSdZYTKE_UsPgGrNZBzp6kM7pD6I6cUEQeGYnEMQQIpNFpdry85IHGg1nCMD95NyGbD0ZvvfpJrYgMG0w3yoaJOn3kuA23u0Bo_NkYm64nj3HfVqy2LUF-RE)

---

## 에러 발생시 

참고로 맥에서 ios 오픈시 아래와 같이 에러가 날 수 있습니다.

```sh
npm run ios

> hello-world@1.0.0 ios
> expo start --ios

Starting project at /Users/cpro95/Codings/Javascript/react-native/hello-world
Starting Metro Bundler
Error: EMFILE: too many open files, watch
    at FSEvent.FSWatcher._handle.onchange (node:internal/fs/watchers:207:21)
```

구글링 해보면 watchman을 설치하라고 나옵니다.

아래와 같이 하시면 됩니다.

```sh
brew install watchman
```

이제 ios 버전이 실행이 잘 될 겁니다.

