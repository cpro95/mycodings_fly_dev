---
slug: 2024-06-16-react-native-tutorial-7-implementing-dynamic-user-interfaces-with-react-native
title: 리액트 네이티브 강좌. 7편 - 동적인 사용자 인터페이스 구현하기 - Dimensions API와 플랫폼별 코드 작성법
date: 2024-06-16 07:32:41.906000+00:00
summary: 이 글에서는 React Native를 사용하여 동적인 사용자 인터페이스를 구현하는 방법을 다룹니다. Dimensions API의 장점과 단점을 살펴보고, useWindowDimensions 훅을 사용하는 방법을 단계별로 안내합니다. 또한 SafeAreaView와 플랫폼별 코드 작성법을 소개하여 iOS와 Android에서 각각 최적화된 컴포넌트를 만드는 방법을 설명합니다.
tags: ["react native", "platform specific code", "SafeAreaView", "useWindowDimensions"]
contributors: []
draft: false
---

안녕하세요!

리액트 네이티브 강좌 7편입니다.

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

- [리액트 네이티브 강좌. 7편 - 동적인 사용자 인터페이스 구현하기 - Dimensions API와 플랫폼별 코드 작성법](#리액트-네이티브-강좌-7편---동적인-사용자-인터페이스-구현하기---dimensions-api와-플랫폼별-코드-작성법)
  - [동적인 사용자 인터페이스(Dynamic user interfaces)](#동적인-사용자-인터페이스dynamic-user-interfaces)
  - [Dimensions API](#dimensions-api)
  - [Dimensions API의 단점](#dimensions-api의-단점)
  - [useWindowDimensions](#usewindowdimensions)
    - [Step 1: 불필요한 코드 제거](#step-1-불필요한-코드-제거)
    - [Step 2: useWindowDimensions import](#step-2-usewindowdimensions-import)
    - [Step 3: 컴포넌트 내에서 useWindowDimensions 사용](#step-3-컴포넌트-내에서-usewindowdimensions-사용)
    - [전체 코드](#전체-코드)
  - [SafeAreaView](#safeareaview)
  - [플랫폼별 코드 작성(Platform Specific Code)](#플랫폼별-코드-작성platform-specific-code)
    - [첫 번째 접근 방식: Platform 모듈](#첫-번째-접근-방식-platform-모듈)
    - [두 번째 접근 방식: 플랫폼별 파일 확장자](#두-번째-접근-방식-플랫폼별-파일-확장자)
      - [iOS 컴포넌트 코드 (customButton.ios.js)](#ios-컴포넌트-코드-custombuttoniosjs)
      - [Android 컴포넌트 코드 (customButton.android.js)](#android-컴포넌트-코드-custombuttonandroidjs)


---

## 동적인 사용자 인터페이스(Dynamic user interfaces)

이번에는는 React Native에서 동적인 사용자 인터페이스에 대해 배워보겠습니다.

지금까지 우리는 React Native 컴포넌트를 스타일링하고 Flexbox를 사용해 레이아웃을 구성하는 방법을 배웠습니다.

이것들은 매우 중요하지만, 한 가지 중요한 부분이 빠져있습니다.

현재까지 우리의 학습은 아이폰 15와 픽셀 4 기기들에 집중되어 있었습니다.

그러나 우리의 앱 사용자들이 모두 동일한 기기를 사용하지 않는다는 점을 유념해야 합니다.

기기 크기는 더 작은 휴대폰부터 아이패드나 안드로이드 태블릿 같은 더 큰 기기까지 다양할 수 있습니다.

우리는 앱의 사용자 인터페이스가 이러한 다양한 기기 크기에 반응하면서 최적의 사용자 경험을 유지하도록 해야 합니다.

하지만 그것이 전부는 아닙니다.

동일한 기기에서도 어떤 사용자는 세로 모드를 선택하고, 다른 사용자는 가로 모드를 선호할 수 있습니다.

우리의 UI는 이러한 다양한 선호도를 수용할 수 있어야 합니다.

이번 섹션에서는 React Native가 제공하는 몇 가지 API를 배워서 이러한 변화를 우아하게 수용하는 방법을 알아보겠습니다.

이번 Dynamic user interfaces 섹션을 위해 기본 코드를 아래와 같이 준비했습니다.

```js
import { View, StyleSheet } from 'react-native';

const App = () => {
  return (
    <View style={styles.container}>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'plum',
    alignItems: 'center',
    justifyCotent: 'center',
  },
});

export default App;
```

## Dimensions API

이번에는 React Native의 Dimensions API에 대해 알아보겠습니다.

예제를 통해 바로 코드를 살펴보겠습니다.

```javascript
import { View, Text, StyleSheet } from "react-native";

const App = () => {
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.text}>Welcome</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "plum",
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    width: 300,
    height: 300,
    backgroundColor: "lightblue",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
  },
});

export default App;
```

파일을 저장하면 파란 박스와 "Welcome" 텍스트가 표시됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjY-p0I4dBBaubbjxxruXtckjd-YCmtvLoUYjJ_D--51On3FNOT8Ad8m4A8RUMSNXMkY3k5tHN_y8kMwzjsuRv5Yi5ABTmTmZhRAp7qUtwaEHMWo2vcLotA9F2RdQ8ycsWIijSm1ws7QQqBidjzufwe-qS8gBQ2KlehhoW93RlDym3Zd_nFJKUxMl7EYDE)

현재까지는 모든 것이 잘 작동합니다.

하지만 이제 iPad와 같은 더 큰 기기에서 애플리케이션을 테스트해보겠습니다.

이를 위해 VSCode 터미널에서 Shift + I를 눌러 iOS 기기 목록을 불러옵니다
.
iPad Pro 또는 iPad Air 최신 세대를 선택합니다.

설치 승인 요청이 있을 경우 Expo Go를 통해 앱 설치를 승인합니다.

이제 앱이 iPhone과 iPad에서 실행 중이며, 물론 Android에서도 같은 방식으로 작동할 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEg5BmgC_7x84FohgqiHVzd1XT7ryUK0udcQD4RPOGP9U9dTEXdGlC5VhhZHYNxZC4ev9DvCuf0bPfV5_MpEKMewmAyRvHaf7Pme_55_xr57SEo3JVEC2NeS5pTMTWZVZ_sZaOs-bGXbKbPZ5d0v7bdVPVSd3hMCLE2i5FBZ_fWpBw7t7vZaYSoMOL2IN0Q)

그러나 iPad에서는 앱이 최적의 상태로 보이지 않습니다.

박스가 너무 작고 폰트가 읽기 어렵습니다.

박스 크기 문제에 대한 잠재적 해결책은 너비와 높이에 퍼센트를 사용하는 것입니다.

너비를 70%, 높이를 40%로 설정해봅시다.

```javascript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "plum",
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    width: "70%",
    height: "40%",
    backgroundColor: "lightblue",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
  },
});
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEjyUES2fxobz0zVANPDsGc1CS4cPq8EXH7w-w64uOI86pboTebRf_Rlez-YtX247E0fssf_2eGlppJAS8B6eFBZcvq3d4opuen3Cng4o16KjdktdLQHKWers5_qvC0jPz3dr-F859JoVzrCyOFsAHh_qmRiRKCWpMzLv-fPLGW-kIWWjuqMBghikzX08dg)

이렇게 하면 개선되지만 여전히 완벽하지 않습니다.

문제는 두 기기가 유사한 높이를 가지고 있지만 너비가 크게 다르다는 것입니다.

퍼센트 기반 너비와 높이만으로는 충분하지 않습니다.

게다가 폰트 크기는 어떻게 처리할까요?

우리는 더 큰 폰트를 원할 수 있지만 퍼센트를 지정하는 것은 효과적이지 않습니다.

기기 크기에 따라 반응형 스타일을 적용할 방법이 필요합니다.

여기서 Dimensions API가 등장합니다.

사용 방법을 알아봅시다.

1단계: React Native에서 Dimensions API를 import합니다.

2단계: API를 사용해 기기의 너비와 높이를 얻습니다.

```javascript
import { View, Text, StyleSheet, Dimensions } from "react-native";

const App = () => {
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.text}>Welcome</Text>
      </View>
    </View>
  );
};

const window = Dimensions.get("window");
const windowWidth = window.width;
const windowHeight = window.height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "plum",
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    width: windowWidth > 500 ? "70%" : "90%",
    height: windowHeight > 600 ? "60%" : "90%",
    backgroundColor: "lightblue",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: windowWidth > 500 ? 50 : 24,
  },
});

export default App;

```

파일을 저장하면 훨씬 더 나아진 것을 볼 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhxo8liAQ1Xew2AsqBPtqCARRtq7uiTpQsBRFOfr8b0MNOz4_vbm8LFXnl-ZOeJEHPdakTMdd-o7q6_zyfQbVtoo0tLDA3WfpS1dQq2RI5RKIUWMEYxUZexDMysBS8Qbl1NV4SN31EMpn3zAHg5yiRrA_BKIjTI3lhe3CjME3HWAOBWcTKcrkNRxtN_KPM)

이제 Dimensions가 기기 크기를 잘 반영하며 폰트가 iPad에서도 훨씬 읽기 쉽게 되었습니다.

요약하자면, Dimensions API는 기기 크기에 접근할 수 있게 해주며, 기기의 너비나 높이를 사용해 UI 요소의 반응형 스타일을 만들 수 있습니다.

하지만 우리의 스타일이 완벽하게 작동하는 것처럼 보이더라도, Dimensions API에는 동적인 사용자 인터페이스를 만드는 데 권장되지 않는 단점이 있습니다.

## Dimensions API의 단점

우리는 Dimensions API를 사용하여 UI 요소에 반응형 스타일을 정의하는 방법을 배웠습니다.

기기 크기에 따라 높이, 너비, 폰트 크기를 성공적으로 설정했습니다.

하지만 이 방법에는 문제가 있습니다.

화면의 방향이 바뀌면 기기 크기도 변할 수 있는데, Dimensions API는 이러한 변경 사항을 동적으로 업데이트하지 않습니다.

예시를 통해 이 문제를 이해해 봅시다.

기기 높이와 너비를 콘솔에 로그로 출력해 보겠습니다.

```javascript
import { Dimensions } from 'react-native';

const window = Dimensions.get("window");
console.log(`Window dimensions: ${window.height}x${window.width}`);
const windowWidth = window.width;
const windowHeight = window.height;
```

파일을 저장하면 콘솔에 다른 기기 차원이 기록되는 것을 볼 수 있습니다.

```sh
 LOG  Window dimensions: 852x393
 LOG  Window dimensions: 1366x1024
```

예를 들어, iPhone의 차원은 높이 852, 너비 393으로 기록됩니다.

이제 iPhone 기기를 90도 회전시켜 보겠습니다.

회전 버튼을 사용하여 기기를 가로 모드로 전환합니다.

기기가 세로 모드에서 가로 모드로 전환되었지만, 우리의 앱은 화면 방향 변경에 맞게 적응하지 않는 것처럼 보입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjHutstUQAxhrmYA1eQ1jeV3santOYmitTFmuV0T0uZ1N1t_hJGQiELq65zMt9gmczTP4CM7IyyXgnRY37S0btvtVMXc-veHUej7WN_p4CKsG_rlQFIappRRHMSqn-H2p7EXAiIHcuEKnriM-oqlSBtSgdnL7DdiAklhKuoszSryn1oUWXBR7RNFAdCYfM)

이상적으로는 "Welcome" 텍스트도 회전하여 세로 모드에서 읽는 것과 비슷한 방식으로 읽혀야 합니다

우리가 설정한 Expo 애플리케이션은 app.json에 정의된 Expo 설정 때문에 가로 모드에 적응하지 않습니다.

기본적으로 방향 설정은 세로 모드로 고정되어 있어 우리의 UI는 세로 방향에만 맞춰져 있습니다.

이를 'default' 값으로 조정해 봅시다.

```json
{
  "expo": {
    "orientation": "default"
  }
}
```

파일을 저장하고 서버를 다시 시작하기 위해 `R`을 누릅니다.

이제 기기 방향이 기본값으로 재설정되었습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEj3NSP4ROm1ajNvDI8YhV6duQEWqj4UnFJr7Ilc4xOoqpXwinR0-wcHHA-jg5Xf1uKfB7J98fplO0U7OpcHS5E6GrKkCw6dBZPFIQQYkOBptrAfPjWifSltMbZwBnisef88gFbshiXcCNPX6J10NSevyvxT-u1I5NYcvIE6gdp0-DAuD9fBW76792TrxsY)

```sh
 LOG  Window dimensions: 1024x1366
 LOG  Window dimensions: 393x852
```
iPhone의 창 높이는 852, 너비는 393으로 설정되어 있습니다.

하지만 방향이 기본값으로 설정된 상태에서 iPhone을 회전하면 앱이 적응하고 텍스트가 다시 읽기 쉬워집니다.

그러나 반응형 스타일은 회전 후에도 작동하지 않는 것처럼 보입니다.

iPhone 기기의 너비가 852, 높이가 393으로 변해야 합니다.

이 너비와 높이의 변경은 View 컴포넌트의 너비를 70%로 변경하고 텍스트 폰트 크기를 50으로 증가시켜야 합니다.

그러나 이러한 변경 사항이 반영되지 않습니다.

너비는 여전히 90%로 남아 있으며, 텍스트 폰트 크기는 24픽셀로 유지됩니다.

애플리케이션을 다시 시작해야만 크기를 다시 계산할 수 있습니다.

기기를 포커스로 가져와 `R`을 눌러 애플리케이션을 다시 시작하면 너비가 70%로 조정되고 폰트 크기가 50픽셀로 설정됩니다.

업데이트된 차원도 콘솔에 기록됩니다.

높이는 393, 너비는 852입니다.

그러나 이것이 Dimensions API의 단점입니다.

값이 창 차원의 변경에 동적으로 업데이트되지 않습니다.

화면 방향 변경이나 접이식 전화기와 같은 더 복잡한 시나리오에서도 마찬가지입니다.

물론 이 문제를 해결할 방법이 있습니다.

그 해결 방법을 단계별로 설명해 드리겠습니다.

1단계: React에서 useState와 useEffect 훅을 가져옵니다.

```javascript
import { useState, useEffect } from 'react';
import { Dimensions, StyleSheet, View, Text } from 'react-native';
```

2단계: 화면 로드 시 기기 차원을 저장할 상태 변수를 생성합니다.

```javascript
const [dimensions, setDimensions] = useState({
  window: Dimensions.get('window'),
});
```

3단계: 기기 차원 변경을 감지하고 차원 상태 값을 업데이트하는 효과를 추가합니다.

```javascript
useEffect(() => {
  const subscription = Dimensions.addEventListener('change', ({ window }) => {
    setDimensions({ window });
  });

  return () => subscription?.remove();
}, []);
```

4단계: dimensions 상태 변수에서 기기 너비와 높이를 추출합니다.

```javascript
const windowWidth = dimensions.window.width;
const windowHeight = dimensions.window.height;
```

5단계: 기기 차원에 따라 동적으로 변경되는 인라인 스타일을 추가합니다.

```javascript
import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";

const App = () => {
  const [dimensions, setDimensions] = useState({
    window: Dimensions.get("window"),
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimensions({ window });
    });

    return () => subscription?.remove();
  }, []);

  const windowWidth = dimensions.window.width;
  const windowHeight = dimensions.window.height;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.box,
          {
            width: windowWidth > 500 ? "70%" : "90%",
            height: windowHeight > 600 ? "60%" : "90%",
          },
        ]}
      >
        <Text style={{ fontSize: windowWidth > 500 ? 50 : 24 }}>Welcome</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "plum",
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    backgroundColor: "lightblue",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;
```

이제 파일을 저장하고 iPhone 기기로 돌아가면 기본 세로 방향이 여전히 작동하는 것을 볼 수 있습니다.

하지만 가로 모드로 변경하면 너비와 폰트 크기가 70%와 50픽셀로 조정됩니다.

우리는 기기 차원에 따라 동적으로 변경되는 스타일을 UI 요소에 추가할 수 있었습니다.

코드를 다시 보면, 조금 복잡해 보이지 않나요?

더 쉬운 방법이 있다면 어떨까요?

실제로 있습니다.

---

## useWindowDimensions

전에 Dimensions API가 기기 차원이 변경될 때 업데이트되지 않는다는 것을 발견했습니다.

기기 방향이 변경될 때 동적 스타일이 올바르게 적용되도록 하기 위해 상당한 양의 코드를 구현해야 했습니다.

이번에는 이 과정을 단순화하고 useWindowDimensions 훅(Hook)을 사용하여 동일한 결과를 얻는 방법을 보여드리겠습니다.

### Step 1: 불필요한 코드 제거

먼저, 불필요한 코드를 제거합니다.

여기에는 useState와 useEffect의 import, Dimensions API의 import, 그리고 useState와 useEffect와 관련된 전체 코드 블록이 포함됩니다.

```javascript
import { StyleSheet, View, Text } from 'react-native';
```

### Step 2: useWindowDimensions import

그 다음, useWindowDimensions를 react-native에서 import합니다.

```javascript
import { useWindowDimensions } from 'react-native';
```

### Step 3: 컴포넌트 내에서 useWindowDimensions 사용

컴포넌트 내에서 useWindowDimensions 훅을 사용하여 windowWidth와 windowHeight를 가져옵니다.

```javascript
const App = () => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  return (
    <View
      style={[
        styles.box,
        {
          width: windowWidth > 500 ? '70%' : '90%',
          height: windowHeight > 600 ? '60%' : '90%',
        },
      ]}
    >
      <Text style={{ fontSize: windowWidth > 500 ? 50 : 24 }}>Welcome</Text>
    </View>
  );
};
```

### 전체 코드

최종적으로, 전체 코드는 다음과 같습니다.

```javascript
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";

const App = () => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.box,
          {
            width: windowWidth > 500 ? "70%" : "90%",
            height: windowHeight > 600 ? "60%" : "90%",
          },
        ]}
      >
        <Text style={{ fontSize: windowWidth > 500 ? 50 : 24 }}>Welcome</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "plum",
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    backgroundColor: "lightblue",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;

```

파일을 저장하고 기기를 회전시키면 동적 스타일이 예상대로 계속 작동하는 것을 확인할 수 있습니다.

useWindowDimensions는 권장되는 접근 방식이며, Dimensions API의 문제점을 이해시키기 위해 먼저 설명했습니다.

useWindowDimensions는 반응형 스타일을 적용할 때 기본 접근 방식으로 사용해야 합니다.

---

## SafeAreaView

React Native 공부하기 위해서 Expo에서 제공해주는 웹 환경의 개발 환경이 있습니다.

[https://snack.expo.dev/](https://snack.expo.dev/)입니다.

여기서 코드를 입력하면 오른쪽에 바로 여러가지 기기에서 렌더링된 화면을 바로 볼 수 있습니다.

이제 무겁게 iOS 시뮬레이터를 오픈할 필요가 없습니다.

그럼 본론으로 들어가서,

이번에는 React Native의 SafeAreaView 컴포넌트에 대해 알아보겠습니다.

시간을 절약하기 위해 App 컴포넌트의 코드를 복사하여 설명드리겠습니다.

```js
import { StyleSheet, View, Text, SafeAreaView } from "react-native";

const App = () => {
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.text}>Welcome</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "plum",
  },
  box: {
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default App;
```

컨테이너에는 Flex가 1로 설정되어 전체 사용 가능한 공간을 사용하며, 배경색은 Plum으로 설정되어 있습니다.

내부 박스에는 모든 방향으로 20픽셀의 패딩이 있습니다.

마지막으로 텍스트에는 폰트 크기 24, 폰트 굵기 Bold, 텍스트 정렬이 Center로 설정되어 "Welcome" 텍스트를 가운데로 정렬합니다.

이 시리즈를 따라오셨다면, 이 코드는 익숙할 것입니다. 결국 "Welcome"을 화면에 렌더링하는 컴포넌트가 됩니다.

파일을 저장하고 기기에서 확인하면 문제가 발생합니다.

Android에서는 "Welcome" 텍스트가 보이지만, iOS에서는 텍스트가 보이지 않습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhuf2DcuJrb-TB-uFE9ESGRZCs1ChYCsjTSnXUaMxM0AUhIp7_gPmPZWVlrj9tVSFyq3Tdq1Z-M8hW_ZO9VjZdlixuFDdt1e6Xp0yacq-rSNzhx9N6KLuuqd1jO7gvjCITqZAV9UT_QQvK6jbLG9A7BOp67HAE4p7LsgQ-PYzhqjp2LA_FR-OtRoMt5Vzo)

![](https://blogger.googleusercontent.com/img/a/AVvXsEh7vpSxp49HCdwBAnJDFQwcwYZOxZD5i5QgwEWLtgucgvOW9gSc87JvN7NKMzYCDAP1kKkJp_7odDZ2C1BInuIC6b5_fj1UqOZeoX1dkIhKAxcKrQSePw4cZjrQs7PSmiT_IUdqs3L1OcJXOmM1DTI1UoHgyhRKk7tJ82el-tu7UY8dfY5ZEiW4-1fziXw)

텍스트 컴포넌트를 iPhone에서 렌더링하는 데 문제가 있다고 생각할 수 있지만, 그렇지 않습니다.

문제는 텍스트가 노치 뒤에 숨겨져 있다는 것입니다.

Android는 전혀 문제가 없지만, iOS 기기에서는 문제가 발생합니다.

컨테이너에 상단 패딩을 추가하고 파일을 저장하면, 이제 두 기기에서 텍스트를 볼 수 있습니다.

하지만 이것이 올바른 해결책처럼 보이지는 않습니다.

이제 Android에서는 상단에 불필요한 공간이 생기고, 노치가 다른 위치에 있는 새로운 기기가 출시될 수도 있습니다. 

필요한 것은 주어진 기기의 안전 영역을 파악하고, 애플리케이션을 해당 영역 내에서만 렌더링하는 방법입니다.

바로 SafeAreaView 컴포넌트가 이러한 역할을 합니다.

React Native에서 SafeAreaView를 import하고, 전체 JSX를 SafeAreaView로 감쌉니다.

SafeAreaView가 전체 사용 가능한 공간을 차지하도록 설정합니다.

```javascript
import { StyleSheet, View, Text, SafeAreaView } from "react-native";

const App = () => {
  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <View style={styles.box}>
          <Text style={styles.text}>Welcome</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "plum",
  },
  box: {
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default App;
```

SafeAreaView의 목적은 기기의 안전 영역 경계 내에서 콘텐츠를 렌더링하는 것입니다.

이는 화면의 물리적 제한, 예를 들어 둥근 모서리나 카메라 노치 등을 반영하여 패딩을 적용합니다.

파일을 저장하면 애플리케이션이 이제 상단 노치와 하단 곡선을 피해 SafeAreaView 내에서 렌더링되는 것을 확인할 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiO1-mMm-wSZ_Y7c2zFFBhhiAHima7tDoyYAZO3610Z82VyVmo5gm-z1-hjvptlW1w0W2GXk2016tEE53c9WnKwqgcGEPDUaf6_313cGNSC7mJkpWm-K7JbfzaPcbe-8CvSdtVPj9yNUCBWVBodt3xal2yD1ikVDTrOSFdX4n_5Z_eOXjLgSz1y61YkTjw)

물론, 현재 상단과 하단에 흰색 간격이 생겼습니다.

이를 해결하려면 SafeAreaView에 컨테이너와 동일한 배경색을 적용하면 됩니다.

```javascript
const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "plum",
  },
  ...
  ....
});
```

이제 UI를 확인하면 훨씬 더 나아진 것을 볼 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgwC_3n_L-fxUdoihxXIUN3cgM7FJGCQGG-ST6C3TIqXbgbMBwsGKLl6FVAhl-BnAW5uTPINWO_BZnq-OSC5t60LFL6nJvO2RnDSMW3inSS6mcR_7LDQW1sH3YxgsbY3FqF_tiquX0_YTVXI7l-myMTUTWFGhALdRJ1Hk1vFCe5RAkvC_MF_o70jPgOcMI)

이제 여러분은 SafeAreaView의 필요성과 사용 방법을 쉽게 이해할 수 있을 것입니다.

---

## 플랫폼별 코드 작성(Platform Specific Code)

크로스 플랫폼 앱을 개발할 때 코드 재사용을 최대화하는 것이 중요합니다.

하지만 특정 플랫폼에 맞게 코드를 조정해야 하는 상황이 발생할 수 있습니다.

React Native는 플랫폼별 코드를 구성하고 분리하는 두 가지 접근 방식을 제공합니다.

첫 번째는 Platform 모듈이고, 두 번째는 플랫폼별 파일 확장자입니다.

이번에는 두 가지 접근 방식을 모두 배워보겠습니다.

### 첫 번째 접근 방식: Platform 모듈

Platform 모듈은 React Native에서 import되며, 앱이 실행 중인 플랫폼을 감지합니다.

이 감지 로직을 사용하여 플랫폼별 코드를 구현할 수 있습니다.

예를 들어, iPhone에서는 SafeAreaView 내에 위치한 "Welcome" 텍스트가 적절하게 위치되어 있지만 Pixel에서는 상태 표시줄과 너무 가깝습니다.

컨테이너에 `paddingTop: 25`를 설정하면 두 기기 모두에 적용됩니다.

하지만 Platform 모듈을 사용하면 Android에서만 상단 패딩을 설정할 수 있습니다.

```javascript
import { Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'plum',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  // other styles...
});
```

파일을 저장하면 추가적인 패딩이 Android 기기에만 적용된 것을 볼 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEh7vpSxp49HCdwBAnJDFQwcwYZOxZD5i5QgwEWLtgucgvOW9gSc87JvN7NKMzYCDAP1kKkJp_7odDZ2C1BInuIC6b5_fj1UqOZeoX1dkIhKAxcKrQSePw4cZjrQs7PSmiT_IUdqs3L1OcJXOmM1DTI1UoHgyhRKk7tJ82el-tu7UY8dfY5ZEiW4-1fziXw)

위 그림은 적용 전 그림입니다.

아래 그림은 적용 후 그림입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjvVH_5cndZ0UYMbWFBsjjXx4UZEbmUGxjB8Sq4cEegHZS23o9_IAdkAcYJTXvyCSJl0lmWOuA-HUBZDavYXB2Ze4rh5ZBE984pGciUpAPV7c5Z49aVqsEWE-rakUQr59j3xY85b9J8e2-nMK7ICVWTjdCBE9bGvrunogEEgDFZ6o2mcrcYMrWtvAiYVCY)

이와 같이 Platform.OS를 사용하여 iOS에도 특정 스타일을 적용할 수 있습니다.

Platform.OS는 작은 변경 사항에 적합하지만, 더 포괄적인 플랫폼별 스타일을 적용할 때는 Platform.select를 사용하는 것이 좋습니다.

```javascript
const styles = StyleSheet.create({
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
    ...Platform.select({
      ios: {
        color: 'purple',
        fontSize: 24,
        fontStyle: 'italic',
      },
      android: {
        color: 'blue',
        fontSize: 30,
      },
    }),
  },
  // other styles...
});
```

파일을 저장하면 "Welcome" 텍스트에 각 플랫폼에 맞는 스타일이 적용된 것을 볼 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEi7cZIFXTuDy5aVaWAF-pQjswKQX_1fJcdHrmGDgsa7pbvDbxZ3mwyISMnUzpoxL_UJkFJ9bNUyP38lQqp7sADreYXQ0n7jxSLqmS2dPuyF7LZ6s7gnKLytgkltswc4EzokG_17DJzxl-yvE_C82_PS8XaSEpgRfd-N9ytaM2gIgc2c3CxWjHdEIdyRLM4)

![](https://blogger.googleusercontent.com/img/a/AVvXsEhol46JRks8rYxW8cKM9KDJqqFQQ47m-E_eIKxOrIJvO5WxhF8o3q_VB-HXLHwm1O38YTVitYdgY96jj55klvxWspqEN-Fkc8wRZmGw2n2DygGH1kOWUtLnT69bmOIxLFBA9Auk4Uk3lrRGX9ahgsKUoCzzEtOq3bE3VBA0ahUtGTuhlCGcxRN1F-x0Mmg)

이 접근 방식은 특정 컴포넌트의 일부만 플랫폼별로 다를 때 적합합니다.

### 두 번째 접근 방식: 플랫폼별 파일 확장자

더 복잡한 플랫폼별 시나리오에서는 플랫폼별 파일 확장자를 사용하는 것이 좋습니다.

이 접근 방식에서는 코드를 .ios.js와 .android.js 확장자로 나누어 작성합니다.

React Native는 확장자를 감지하고 필요한 플랫폼 파일을 로드합니다.

예를 들어, 두 플랫폼에서 다르게 동작하는 간단한 버튼 컴포넌트를 만들어 보겠습니다.

1. 프로젝트 폴더 내에 `components` 폴더를 생성합니다.
2. `components` 폴더 내에 `customButton.ios.js`와 `customButton.android.js` 파일을 생성합니다.

#### iOS 컴포넌트 코드 (customButton.ios.js)

```javascript
import { Pressable, Text, StyleSheet } from 'react-native';

const CustomButton = ({ onPress, title }) => (
  <Pressable style={styles.button} onPress={onPress}>
    <Text style={styles.text}>{title}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightblue',
    borderRadius: 20,
    padding: 10,
  },
  text: {
    color: 'purple',
    fontSize: 18,
  },
});

export default CustomButton;
```

#### Android 컴포넌트 코드 (customButton.android.js)

```javascript
import { Pressable, Text, StyleSheet } from 'react-native';

const CustomButton = ({ onPress, title }) => (
  <Pressable style={styles.button} onPress={onPress}>
    <Text style={styles.text}>{title}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightblue',
    borderRadius: 5,
    padding: 10,
  },
  text: {
    color: 'blue',
    fontSize: 18,
  },
});

export default CustomButton;
```

이제 `App.js`에서 `CustomButton` 컴포넌트를 import하고 사용합니다.

```javascript
import { StyleSheet, View, Alert } from 'react-native';
import CustomButton from './components/customButton';

const App = () => (
  <View style={styles.container}>
    <CustomButton
      title="Press Me"
      onPress={() => Alert.alert('Pressed')}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'plum',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
```

React Native는 자동으로 해당 플랫폼에 맞는 컴포넌트를 선택하여 렌더링합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEioqxNVpD4lFiEzIw2Y1andxe7z6iz1oLVcfD-sz7FxQiEpuG2z0UM0AnkYXOwpGoNE1sP_33V07AxcpvsEQ4nYVmz-IDh4hIlw8vOU6s960voZBYr0lRduAOsnzsa38KK8zjafG8cjkEP_f6mnnWKX7-_m5_j5480OO-BchObROKuHSCy9aLQZLhOw2oY)

iOS와 Android에서 각각 다른 스타일의 버튼이 표시됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgpXwTEvwrezgyZWHuPG20p6edf_jkmGVo2MlUqWIS3slMnjgoQjsQ9xqyNMEGGdkL1k6XQRFagYS8QlcLaNkAR4E4vZ-Vu1Wf5seY6uqu7sejnvTHhucpl3BHTgheYTkwGPtjeX_OSoMLS7boHU9uTVostvOhAy5qK8_CWEifCEVm8C6LNkV5MQrhyoHY)

![](https://blogger.googleusercontent.com/img/a/AVvXsEi_6uYDdF7mT2RUHtAL2PMNxk9W38byKz3iq2BW8nYCKYzYIqYwo5MvxICcCsbkzMR1Gad_gEH4pdTCKop4MQ8_YX0_oxSROW68iCXp1CW247QB1ow-qXgbNZH1A2nLavccB_NtbupTna_he6HqnTpGl-hpZhEJV28YaRy8GJNbMBNgcASLxeVujR-OPtc)

그럼.
