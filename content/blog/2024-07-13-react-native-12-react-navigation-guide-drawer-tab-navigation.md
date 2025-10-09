---
slug: 2024-07-13-react-native-12-react-navigation-guide-drawer-tab-navigation
title: 리액트 네이티브 강좌. 12편 - 드로어, 탭 네비게이션 그리고 중첩 네비게이션 마스터하기
date: 2024-07-13 08:57:22.388000+00:00
summary: React Navigation 라이브러리를 사용하여 드로어 및 탭 네비게이션을 구현하는 방법을 자세히 설명합니다. 초심자도 따라 하기 쉬운 단계별 설정부터 고급 옵션 활용까지, UI/UX를 향상시키는 다양한 팁을 제공합니다.
tags: ["react native", "drawer navigation", "tab navigation"]
contributors: []
draft: false
---

안녕하세요!

리액트 네이티브 강좌 12편입니다.

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

** 목차 **

- [리액트 네이티브 강좌. 12편 - 드로어, 탭 네비게이션 그리고 중첩 네비게이션 마스터하기](#리액트-네이티브-강좌-12편---드로어-탭-네비게이션-그리고-중첩-네비게이션-마스터하기)
  - [Drawer Navigation](#drawer-navigation)
    - [드로어 네비게이션(Drawer Navigation) 설정하기](#드로어-네비게이션drawer-navigation-설정하기)
    - [드로어 메뉴에 화면 추가하기](#드로어-메뉴에-화면-추가하기)
    - [드로어 네비게이션 실행하기](#드로어-네비게이션-실행하기)
    - [드로어 네비게이션 프로그래밍 방식으로 제어하기](#드로어-네비게이션-프로그래밍-방식으로-제어하기)
  - [드로어 네비게이션 옵션으로 디테일 잡기!](#드로어-네비게이션-옵션으로-디테일-잡기)
    - [제목 설정하기](#제목-설정하기)
    - [드로어 레이블 설정하기](#드로어-레이블-설정하기)
    - [활성 아이템 스타일 변경하기](#활성-아이템-스타일-변경하기)
    - [드로어 메뉴 콘텐츠 스타일 변경하기](#드로어-메뉴-콘텐츠-스타일-변경하기)
  - [Tab Navigation](#tab-navigation)
    - [탭 네비게이션 설정하기](#탭-네비게이션-설정하기)
    - [탭에 화면 추가하기](#탭에-화면-추가하기)
    - [탭 네비게이션 실행하기](#탭-네비게이션-실행하기)
  - [탭 네비게이션 옵션으로 개성 더하기!](#탭-네비게이션-옵션으로-개성-더하기)
    - [탭 네비게이터 옵션 설정하기](#탭-네비게이터-옵션-설정하기)
      - [1. 라벨 위치 변경하기](#1-라벨-위치-변경하기)
      - [2. 라벨 표시 여부 설정하기](#2-라벨-표시-여부-설정하기)
      - [3. 활성 탭 색상 변경하기](#3-활성-탭-색상-변경하기)
      - [4. 비활성 탭 색상 변경하기](#4-비활성-탭-색상-변경하기)
    - [탭 화면 옵션 설정하기](#탭-화면-옵션-설정하기)
      - [1. 탭 라벨 변경하기](#1-탭-라벨-변경하기)
      - [2. 탭 아이콘 변경하기](#2-탭-아이콘-변경하기)
      - [3. 탭 뱃지 추가하기](#3-탭-뱃지-추가하기)
  - [네비게이터 중첩해서 사용하기](#네비게이터-중첩해서-사용하기)
    - [예제: 스택 네비게이터를 탭 네비게이터 안에 중첩하기](#예제-스택-네비게이터를-탭-네비게이터-안에-중첩하기)
    - [헤더 중복 문제 해결하기](#헤더-중복-문제-해결하기)


---

## Drawer Navigation

스택 네비게이션에 대해 알아봤으니, 이제 또 다른 필수 네비게이션, 바로 **드로어 네비게이션(Drawer Navigation)**을 살펴보겠습니다.

스택 네비게이터가 화면을 차곡차곡 쌓아 올리는 방식이라면, 드로어 네비게이터는 화면 측면에서 스윽 나타나는 숨겨진 메뉴라고 생각하면 됩니다.

### 드로어 네비게이션(Drawer Navigation) 설정하기

먼저 프로젝트에 드로어 네비게이션 패키지를 설치해야겠죠?

리액트 네비게이션 공식 문서를 참고하면 쉽게 따라 할 수 있습니다.

```bash
npm install @react-navigation/drawer
```

다음으로 드로어 네비게이터가 필요로 하는 라이브러리인 `react-native-gesture-handler`와 `react-native-reanimated`를 설치하면 됩니다.

```bash
npm install react-native-gesture-handler react-native-reanimated
```

이제 메인 코드를 아래 코드와 같이 구성합니다.

```javascript
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator(); // 드로어 네비게이터 인스턴스 생성

export default function App() {
  return (
    <NavigationContainer independent={true}> 
      <Drawer.Navigator> 
        {/* 여기에 드로어 메뉴에 포함될 화면을 추가할 거예요! */}
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
```

`react-native-reanimated` 라이브러리 설정을 위해 `babel.config.js` 파일을 열고, `plugins` 배열에 아래 코드를 추가해 줍니다.

```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin', // reanimated 플러그인 추가!
    ],
  };
};
```

마지막으로 `package.json` 파일을 열고, `expo start` 스크립트에 `-c` 옵션을 추가하여 캐시를 삭제하고 앱을 실행하도록 설정합니다.

```json
{
  // ...
  "scripts": {
    "start": "expo start -c", // 캐시 삭제 옵션 추가
    // ...
  },
  // ...
}
```

설치 및 설정이 완료되었으니 이제 드로어 메뉴에 포함될 화면을 만들어 보겠습니다.

### 드로어 메뉴에 화면 추가하기

`screens` 폴더에 `DashboardScreen.js`와 `SettingsScreen.js` 파일을 생성하고, 각각 아래 코드를 추가합니다.

```javascript
// screens/DashboardScreen.js
import { View, Text, StyleSheet } from 'react-native';

const DashboardScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Dashboard Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default DashboardScreen;
```

```javascript
// screens/SettingsScreen.js
import { View, Text, StyleSheet } from 'react-native';

const SettingsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Settings Screen</Text>
    </View>
  );
};

// ... (스타일은 DashboardScreen과 동일)

export default SettingsScreen;
```

이제 `App.js` 파일로 돌아와서 드로어 메뉴에 방금 만든 두 화면을 추가해 줍니다.

```javascript
// App.js
// ... (이전 코드와 동일)

import DashboardScreen from './screens/DashboardScreen';
import SettingsScreen from './screens/SettingsScreen';

// ...

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Dashboard" component={DashboardScreen} /> 
        <Drawer.Screen name="Settings" component={SettingsScreen} /> 
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
```

`Drawer.Screen` 컴포넌트의 `name` prop은 드로어 메뉴에 표시될 레이블이고, `component` prop은 해당 메뉴를 눌렀을 때 표시될 화면 컴포넌트를 지정합니다.

### 드로어 네비게이션 실행하기

이제 서버를 다시 시작하고 앱을 실행해 봅시다.

```bash
npm run ios
```

화면 왼쪽 가장자리에서 스와이프하거나 왼쪽 상단의 아이콘을 눌러 드로어 메뉴를 열 수 있을 겁니다.

드로어 메뉴에서 "Dashboard"와 "Settings"를 눌러 화면을 전환할 수 있을 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgPvuBc0JKgV8hOukmkuvnCv6y4PoqRPPtRq_A77hmQoruitTk9LYr96FAzetD1PlKk9OKgyaPav2ulhkqb0F_XLHN4PQiJRL77_eDE4Oo-hN18sR8EIjt7_gl_SZ5SWd6_QTz86g0qMxaHKz5NpqPwYKpg6mpuQr8tcLD-0ZPzeItNbyANSvjv00QHuj8)

![](https://blogger.googleusercontent.com/img/a/AVvXsEh7eu3eciWveofWbq5b6JYgERn-pVRr4j0l8UeKGgAxVc6QuC3lMEYenXcLymz34AQ1jBESdMn0_5a471LMxi8sS9eAfQW2rvELLILhWOsHqU2NS3hmKmd_zVbMa3S7i0tcWpOUdw0M1QWAGRtUgaWftT2JUfOQYTBjgFln2zwMBYfWPnqkdjEutKvQajA)

![](https://blogger.googleusercontent.com/img/a/AVvXsEiXIqDqu6uHFWRp_fmjQfvmXwjI8gR6acfsJiBv0uBvwvKWFKwkYGedztzFrerZYSudPgZr7nXF6LZGiHHvVJpP2dg3c0m53_B0ha_huakKH3BLHNddfsOiJrAB7_k0lG505jGxMGcx56jzaHarhl5rPvHmR9tvQIcEoH5UHa49IDirYNwknQNNp2Bm_Pg)

### 드로어 네비게이션 프로그래밍 방식으로 제어하기

`navigation` prop을 사용하여 드로어 메뉴를 프로그래밍 방식으로 열고 닫을 수도 있습니다.

`DashboardScreen`에 버튼을 하나 추가하고, 버튼을 누르면 드로어 메뉴가 열리도록 해 보겠습니다.

```javascript
// screens/DashboardScreen.js
// ... (이전 코드와 동일)

import { View, Text, StyleSheet, Button } from 'react-native';

const DashboardScreen = ({ navigation }) => { // navigation prop 추가!
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Dashboard Screen</Text>
      <Button title="Toggle Drawer" onPress={() => navigation.toggleDrawer()} /> 
    </View>
  );
};

// ... (나머지 코드는 동일)
```

`navigation.toggleDrawer()` 메서드를 호출하면 드로어 메뉴를 열거나 닫을 수 있습니다.

앱을 실행하고 "Toggle Drawer" 버튼을 눌러 드로어 메뉴가 잘 열리는지 확인해 봅시다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhEKS_z9IBhNPU561a1cvcARjxkEwIj-n2kAepHK_xmCOxM3_jLCUFitkUrtHGnX2QNHa6KfAqqiDqXHIW1mH0IKiyQo1SJXnx--zE5QGZvqFmPwPib7o1oyX_ztGD9pH_7D1PRTSUKh9NTZg8ZL--BeOLqVVj1gbqfyzo1ud5cLAsawAg67fY3deZOEFQ)

`navigation.jumpTo(routeName)` 메서드를 사용하면 드로어 UI 없이 특정 화면으로 바로 이동할 수도 있습니다.

```javascript
// screens/DashboardScreen.js
// ... (이전 코드와 동일)

<Button title="Go to Settings" onPress={() => navigation.jumpTo('Settings')} />
// ... (나머지 코드는 동일)
```

이제 "Go to Settings" 버튼을 누르면 드로어 메뉴를 열지 않고 바로 `Settings` 화면으로 이동하는 것을 확인할 수 있을 겁니다.

## 드로어 네비게이션 옵션으로 디테일 잡기!

기본적인 드로어 네비게이터 설정을 마쳤으니, 이제 옵션을 사용해서 좀 더 세련되게 꾸며 볼 시간이에요! 🎨 `DashboardScreen` 컴포넌트에 `options` prop을 사용하여 다양한 옵션을 지정해 보도록 할게요.

### 제목 설정하기

먼저 `title` 옵션을 사용하여 화면 제목을 변경해 볼까요? 

```javascript
<Drawer.Screen
  name="Dashboard"
  component={DashboardScreen}
  options={{
    title: "My Dashboard",
  }}
/>
```

앱을 실행해 보면 헤더 제목과 드로어 메뉴 레이블이 모두 "My Dashboard"로 변경된 것을 확인할 수 있을 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgnXfgVWRXT3Sw_h2HKrNRZMaDqncudzlwCNwbMn4KEKS9u3jGM4uWt3kf5qql_QqTs_d_Gin2q1piFRY8XlbP3vNaXjGbHxyKfUgzmK82O6qRagY8Wz91thqfzapNdUWSawoGcU1k6kjpj7td3MI5-gqSguZmgbos0G0cJJ4T72eYdAWtZXFwxAtt6CZw)

![](https://blogger.googleusercontent.com/img/a/AVvXsEhHFUeLsn-kdd5Jr8iSKYhbvPO-9mLcATF-1Ut5kiFj6q-eIjjCFfQPh3q364dknz1MqRwDkHZkEXnLYoxoaQkGW2rBEfOx-Z7L803d35nLqPmqogjrS6zpMcF5vIMzt5d3axGG88uHvs4IpJmKPNlzQNAUsuzaLy4HPs_rDh7AWTdBwIF0HbpEpE-HdHk)

### 드로어 레이블 설정하기

헤더 제목과 드로어 메뉴 레이블을 다르게 설정하고 싶다면 `drawerLabel` 옵션을 사용하면 됩니다.

```javascript
<Drawer.Screen
  name="Dashboard"
  component={DashboardScreen}
  options={{
    title: "My Dashboard",
    drawerLabel: "Dashboard Label",
  }}
/>
```

이제 헤더 제목은 "My Dashboard"로 유지되고, 드로어 메뉴에는 "Dashboard Label"이라는 레이블이 표시될 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjolsvH-EQbbgpEKa_a5ZspyG0d8MMH7tozE3Sxxz7bHPh2xi8ODH4rbbL_OdIH1z6NdGf6okTY0ZcbWaIYpbi30tBYbZo2FkKEJ7lwJZGwNATLLHRnjkcnlaRnWILMD8hL9ciftKnzYFfYrs25-uwBsD3mmAQ0NSZw8W68Raqr7Vd-N4qspdQpj3GjBQs)

### 활성 아이템 스타일 변경하기

드로어 메뉴에서 현재 활성화된 아이템의 스타일을 변경하고 싶다면 `drawerActiveTintColor`와 `drawerActiveBackgroundColor` 옵션을 사용하면 됩니다.

```javascript
<Drawer.Screen
  name="Dashboard"
  component={DashboardScreen}
  options={{
    title: "My Dashboard",
    drawerLabel: "Dashboard Label",
    drawerActiveTintColor: "#fff", // 활성 텍스트 색상
    drawerActiveBackgroundColor: "#6200EE", // 활성 배경 색상
  }}
/>
```

이제 앱을 실행하고 드로어 메뉴를 열어보면 "Dashboard Label" 아이템의 텍스트 색상이 흰색으로, 배경색은 보라색으로 변경된 것을 확인할 수 있을 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhwz_Pc1GjUPyr_ZQv0pAY0BecI1FBUjxid8wReK0w_a7PFnZDj72fnu_eBnxHV6JesE3B2yBrEyDlKAj7DTVyvm4hTCMJvDWd7H8CSF8Ok3I5_AbbXbx8HJO6Db5mEZHwf_iUVPMOwaxbB9ImZj5b83XZRuwrT2bhECSV4Q3S8X8H7E5mbrGBSgxRhtpY)

### 드로어 메뉴 콘텐츠 스타일 변경하기

드로어 메뉴 전체의 스타일을 변경하고 싶다면 `drawerContentStyle` 옵션을 사용하면 됩니다.

```javascript
<Drawer.Screen
  name="Dashboard"
  component={DashboardScreen}
  options={{
    title: "My Dashboard",
    drawerLabel: "Dashboard Label",
    drawerActiveTintColor: "#fff", // 활성 텍스트 색상
    drawerActiveBackgroundColor: "#6200EE", // 활성 배경 색상
    drawerContentStyle: {
      backgroundColor: "#c6cbff", // 드로어 메뉴 배경 색상
    },
  }}
/>
```

이제 앱을 실행해 보면 드로어 메뉴의 배경색이 연한 보라색으로 변경된 것을 확인할 수 있을 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjerzw7iD0cG5_xK1zPn54AYfKyffYKOhmMr8TGnGek6-Ixxyt1CSOwBrlStPkcWwqVpp3HQlsjAh5lQQ8ZmCG4j4_5ejWJfmBbpX2fY83nrrZkR_-Ai3rKoAjIZaYB-zRHuoc8tdfnFyqpjvBB6KS3lUevR1ehX0siHZI5884o1vv2IKZVU8yJYjUQsdw)

---

## Tab Navigation

스택 네비게이션과 드로어 네비게이션에 이어서 이번에는 **탭 네비게이션(Tab Navigation)**을 알아보겠습니다.

탭 네비게이션은 주로 화면 하단에 표시되는 탭을 눌러서 여러 화면을 전환하는 방식을 제공하는데요, 많은 앱에서 사용되는 흔하고 직관적인 네비게이션 패턴입니다.

### 탭 네비게이션 설정하기

먼저 프로젝트에 `@react-navigation/bottom-tabs` 라이브러리를 설치해야합니다.

```bash
npm install @react-navigation/bottom-tabs
```

이제 아래 코드로 바꿉니다.

```javascript
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator(); // 탭 네비게이터 인스턴스 생성

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        {/* 여기에 탭으로 표시될 화면을 추가할 거예요! */}
      </Tab.Navigator>
    </NavigationContainer>
  );
}
```

### 탭에 화면 추가하기

이전 예제에서 만들었던 `SettingsScreen` 컴포넌트를 재사용하고, `ProfileScreen`과 `CourseListScreen` 컴포넌트를 새로 만들어서 탭에 추가해 볼게요. `screens` 폴더에 `ProfileScreen.js`와 `CourseListScreen.js` 파일을 생성하고 각각 아래 코드를 추가합니다.

```javascript
// screens/ProfileScreen.js
import { View, Text, StyleSheet } from 'react-native';

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile Screen</Text>
    </View>
  );
};

// ... (스타일은 이전 예제와 동일)

export default ProfileScreen;
```

```javascript
// screens/CourseListScreen.js
import { View, Text, StyleSheet } from 'react-native';

const CourseListScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Course List Screen</Text>
    </View>
  );
};

// ... (스타일은 이전 예제와 동일)

export default CourseListScreen;
```

이제 `App.js` 파일로 돌아와서 `Tab.Navigator` 안에 방금 만든 화면들을 추가해 줍니다.

```javascript
// App.js
// ... (이전 코드와 동일)

import ProfileScreen from './screens/ProfileScreen';
import CourseListScreen from './screens/CourseListScreen';
import SettingsScreen from './screens/SettingsScreen';

// ...

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Course List" component={CourseListScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
```

`Tab.Screen` 컴포넌트의 `name` prop은 탭에 표시될 레이블이고, `component` prop은 해당 탭을 눌렀을 때 표시될 화면 컴포넌트를 지정합니다.

### 탭 네비게이션 실행하기

이제 서버를 다시 시작하고 앱을 실행해 보세요!

```bash
npm run ios
```

화면 하단에 3개의 탭이 생성된 것을 확인할 수 있을 겁니다.

각 탭을 눌러서 해당 화면으로 이동해 보십시요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhGfZy6JDX0fUQzLLoCIjAi0rpP2jHIxgiNmwK3t5d_vLF_UOQeksm1dojBQ_lfhxB8t4vo4IPN5U1O9RdIeDSvs-DkcIp_qFvq6kyEtHpVCGzZJXD41QLm11NurlfoX6Uocsn9drw_jX021lPH_38wRS6ZimXnXg5Sg3SlLR20ZCttFKKJZFePBEA1u5g)

---

## 탭 네비게이션 옵션으로 개성 더하기!

이번에는 탭 네비게이션을 좀 더 개성 있게 꾸밀 수 있는 다양한 옵션들을 살펴보도록 하겠습니다.

### 탭 네비게이터 옵션 설정하기

먼저 `Tab.Navigator` 컴포넌트에 `screenOptions` prop을 사용하여 탭 네비게이터 전체에 적용될 옵션들을 설정해 보겠습니다.

```javascript
// App.js
// ... (이전 코드와 동일)

<Tab.Navigator screenOptions={{ /* 옵션 설정 시작 */ }}> 
  {/* ... */}
</Tab.Navigator>
```

#### 1. 라벨 위치 변경하기

`tabBarLabelPosition` 옵션을 사용하면 탭 라벨의 위치를 아이콘 위 또는 아래로 변경할 수 있습니다.

기본값은 `'below-icon'`으로, 아이콘 아래에 라벨이 표시됩니다.

`'beside-icon'`으로 설정하면 아이콘 오른쪽에 라벨이 표시됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgYE2IDH6M7SY32iYkba-eKFzgdWxECNN8LLhalLyzdcxG-iL_h9nERHrqHWZKna-TBr0cOCMgDquqJifNcBy1SFlcm-xksDualo0hqXMYOrU7whEErjVc2S1V11UMn2lba1SYXoNf5HkJ0bFNmuW5XacoetLQXHuVptjw-spzEg1eurOIVDoNxExqOJeU)

일반적으로 모바일 기기에서는 `'below-icon'`, 태블릿에서는 `'beside-icon'`을 많이 사용합니다.

```javascript
// ...
<Tab.Navigator screenOptions={{
  tabBarLabelPosition: 'beside-icon', // 라벨 위치 변경
}}> 
  {/* ... */}
</Tab.Navigator>
```

#### 2. 라벨 표시 여부 설정하기

`tabBarShowLabel` 옵션을 사용하면 탭 라벨을 표시할지 숨길지 설정할 수 있습니다.

기본값은 `true`로, 라벨이 표시됩니다.

`false`로 설정하면 라벨이 숨겨지고 아이콘만 표시됩니다.

```javascript
// ...
<Tab.Navigator screenOptions={{
  // ...
  tabBarShowLabel: false, // 라벨 숨기기
}}> 
  {/* ... */}
</Tab.Navigator>
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEgh8pIimHMf_46PCRxpOBPzxFT4kUWp__TYSpSGJxE1k5YteYdxT7PUNfc4W6NDxspeqSPUyYwHEYVgDe3Wq2zdGVrgYMTtOc_5J6Clc4OWUpIVv7-wEWKEJfA3eCxaAR2U1bfBVjzH2lTorGlrqT7ayTYBEuvWHn26vOVE0-XffszNanbpP9RU3pUDNYE)

#### 3. 활성 탭 색상 변경하기

`tabBarActiveTintColor` 옵션을 사용하면 활성 탭의 텍스트 및 아이콘 색상을 변경할 수 있습니다.

```javascript
// ...
<Tab.Navigator screenOptions={{
  // ...
  tabBarActiveTintColor: 'purple', // 활성 탭 색상 변경
}}> 
  {/* ... */}
</Tab.Navigator>
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEiV0vX4-GjcYX0zcTW42fuwAOB-v_QevrVN5_ipOpQklUZtuFbJHoNybU-tHafUx3IU61oi_jb7pXcOa51HEaA0GqD1Jx6y_ouQS0lM0Pz-aTYnCB2_jqoMTJnR-4x3qzoi90t9mI3xiIkJMimaW7goMhqez1fEKeEOd3ocPxcisimzDiqBYJkh0XOWtZc)

#### 4. 비활성 탭 색상 변경하기

`tabBarInactiveTintColor` 옵션을 사용하면 비활성 탭의 텍스트 및 아이콘 색상을 변경할 수 있습니다.

기본값은 회색이지만, 원하는 색상으로 자유롭게 변경할 수 있습니다.

```javascript
// ...
<Tab.Navigator screenOptions={{
  // ...
  tabBarInactiveTintColor: 'gray', // 비활성 탭 색상 변경 (기본값)
}}> 
  {/* ... */}
</Tab.Navigator>
```

### 탭 화면 옵션 설정하기

이제 `Tab.Screen` 컴포넌트에 `options` prop을 사용하여 각 탭 화면별로 옵션을 설정해 보겠습니다. 

#### 1. 탭 라벨 변경하기

`tabBarLabel` 옵션을 사용하면 탭에 표시되는 라벨을 변경할 수 있습니다.

`ProfileScreen` 탭의 라벨을 "My Profile"로 변경해 볼까요?

물론 `Tab.Navigator`의 screenOptions에서 tabBarShowLabel을 'true'로 변경하는 걸 잊지 마시구요.

```javascript
<Tab.Screen
  name="Profile"
  component={ProfileScreen}
  options={{
    tabBarLabel: "My Profile", // 탭 라벨 변경
  }}
/>
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEib-iPzWV_DHZKf3ZM19q5yuoAysJeqP0caYEAacfS9_0Z264JLz_kkPNf3NwnJRWdn7ZHY1snHHBOuCbrLk2L75T_GtUcMXuGiBFDE4wVkir20p7CgSfmkWMuHAJ7jIWc38Y8juUEHtuArmGqLfmyirdhwsMjBBADnY35aRYhf7TavhiHvAENSCFjTBF0)

#### 2. 탭 아이콘 변경하기

`tabBarIcon` 옵션을 사용하면 탭에 표시되는 아이콘을 변경할 수 있습니다.

`@expo/vector-icons` 패키지에서 제공하는 `Ionicons`을 사용하여 아이콘을 변경해 보겠습니다.

```javascript
// ... (이전 코드와 동일)

import { Ionicons } from '@expo/vector-icons'; // Ionicons import

<Tab.Screen
  name="Profile"
  component={ProfileScreen}
  options={{
    tabBarLabel: "My Profile", // 탭 라벨 변경
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="person" size={size} color={color} />
    ),
  }}
/>
```

`tabBarIcon` 옵션에 함수를 전달하면, 이 함수는 `color`와 `size` prop을 인자로 받아서 아이콘 컴포넌트를 반환해야 합니다.

활성 탭 색상과 비활성 탭 색상에 맞춰 아이콘 색상도 자동으로 변경됩니다!

![](https://blogger.googleusercontent.com/img/a/AVvXsEjKd-aqhRz0GIqghXqLvjt29C8sBm-Q-0WMxjVvH2VAqZZVUtgoiHLfWSKS9JF_rMhqNA71Vr_3FXZv_NHDd3joZuj5dUwSNUexWlvXhoec6NPUnYYddKPUd6wcfWiZpPBzAtxEDBz6fQatYy3AWIVI_vw-Mxn2B2WQL-sbbBJW-IIaQLkEr1St2MLRmBg)

#### 3. 탭 뱃지 추가하기

`tabBarBadge` 옵션을 사용하면 탭 아이콘에 뱃지를 추가할 수 있습니다.

알림 탭이나 메시지함 탭처럼 사용자의 주의가 필요한 경우 유용하게 활용할 수 있습니다.

```javascript
<Tab.Screen
  name="Profile"
  component={ProfileScreen}
  options={{
    tabBarLabel: "My Profile", // 탭 라벨 변경
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="person" size={size} color={color} />
    ),
    tabBarBadge: 3, // 뱃지 추가
  }}
/>
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEgyV6dgAzzRD2reUucB9uZTA5pRZNkmxeoKXRCy-yxUkdUWB2H_2MgdNLOHNPn1TwpsNHBP-zgnxWkEHQTiybHxRfxxHfTKqvsysulstLdG4MpQXc6DEntYrFimZLW7aQAauum2Jo-1GHBZdGBtTzntim0u41C7pSdNxMSWX0GiWHV97gVz1ME6cWPZwPk)

---

## 네비게이터 중첩해서 사용하기

이번에는 **네비게이터를 중첩해서 사용하는 방법**에 대해 알아보겠습니다.

네비게이터 중첩은 여러 유형의 네비게이터를 조합하여 마치 마법처럼 끊김 없고 체계적인 사용자 경험을 만들어낼 수 있는 강력한 기술입니다.

마치 여러 갈래의 작은 길로 이어진 큰 도로처럼, 각 네비게이터는 고유한 규칙을 가지면서도 서로 연결되어 유기적으로 동작하게 됩니다.

자, 그럼 코드를 보면서 리액트 네이티브 앱에서 네비게이터를 중첩하는 방법을 자세히 알아보겠습니다.

### 예제: 스택 네비게이터를 탭 네비게이터 안에 중첩하기

이전 예제에서 만들었던 스택 네비게이터와 탭 네비게이터를 재사용하여 중첩해 볼 겁니다.

먼저 스택 네비케이터 예제였던 `AppStack.js` 파일에서 작은 변경 작업을 할 겁니다.

```javascript
// AppStack.js
// ... (이전 코드와 동일)

const AboutStack = () => { // AboutStack 컴포넌트 생성
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
    </Stack.Navigator>
  );
};

export default AboutStack; // AboutStack 컴포넌트 export
```

스택 네비게이터를 `AboutStack`이라는 새로운 컴포넌트로 감싸고, 이 컴포넌트를 export 하도록 변경했습니다.

이제 `index.js` 파일에서 `AboutStack` 컴포넌트를 import 하여 탭 네비게이터 안에 중첩해 볼 겁니다.

```javascript
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import ProfileScreen from "../screens/ProfileScreen";
import CourseListScreen from "../screens/CourseListScreen";
import SettingsScreen from "../screens/SettingsScreen";

import { Ionicons } from "@expo/vector-icons"; // Ionicons import

import AboutStack from "./AppStack"; // AboutStack 컴포넌트 import

const Tab = createBottomTabNavigator(); // 탭 네비게이터 인스턴스 생성

export default function App() {
  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelPosition: "beside-icon", // 라벨 위치 변경
          tabBarShowLabel: true, // 라벨 숨기기
          tabBarActiveTintColor: "purple", // 활성 탭 색상 변경
          tabBarInactiveTintColor: "gray", // 비활성 탭 색상 변경 (기본값)
        }}
      >
        <Tab.Screen name="Course List" component={CourseListScreen} />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: "My Profile", // 탭 라벨 변경
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
            tabBarBadge: 3, // 뱃지 추가
          }}
        />
        <Tab.Screen name="Settings" component={SettingsScreen} />
        <Tab.Screen name="About Stack" component={AboutStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

```

`Tab.Screen` 컴포넌트를 하나 추가하고, `name` prop에는 "About Stack"을, `component` prop에는 방금 import 한 `AboutStack` 컴포넌트를 지정했습니다.

이제 앱을 실행해 봅시다.

"About Stack"이라는 새로운 탭이 생겼고, 이 탭을 누르면 `AboutStack` 컴포넌트, 즉 스택 네비게이터가 화면에 나타나는 것을 확인할 수 있을 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEijDeItXZsi5Emzk7N8ltY4tNOd3PGPSlC8r4GLrmLbtqjqM3s9tIHMEOqfzrOsBs52FEZwPOKM2mhB93zkF4xPjU4qODR-mB9iBprUVo1hcNAHU1Lb9t70DYI1Bpp-HQGM_e4rXfe-7pRSDIsb-3U2StPl-V27Arzuy16SfPVRY9LGwkY5d70zOi7xjuQ)

![](https://blogger.googleusercontent.com/img/a/AVvXsEiF6LI8stxK-b8rdv91axtkzfLJ7ZgNi1Bl3wuHrrCzEXqOqo9Ml0dM2uVjNTkG4TSRjp_iv2qR44sMUAZjp0pTn1Zlcu1T782d9c4kTaS5nl3t8ygUYOpGDphdoWPWvzJlg01SVRPrw45PbyV6bqMG_G5EaxsR1jQXPPQEki_Fj-vMpUudouoMmzvEUTE)

![](https://blogger.googleusercontent.com/img/a/AVvXsEhwFWeBjaFSbm9LB3QD1vdgUKOiMrgB7ZakagchTJu-wgekgi40hZPwusOdhJ0R87aLY0rKqzvdsr3Eg6-YH-K0IcRKjWuGaRAZMhXL1rqpo1dmiN5BWKanQC8RSmD9yrUsdjMkmc9swNj0JCE6IlL1AZUlWQgmLN6Urz-baCcAhuTaT950dZVLww1QI78)

### 헤더 중복 문제 해결하기

탭 네비게이터와 스택 네비게이터가 모두 헤더를 가지고 있기 때문에, 중첩된 화면에서는 헤더가 두 번 나타나는 문제가 발생할 수 있습니다.

이 경우에는 스택 네비게이터의 헤더만 표시하고 탭 네비게이터의 헤더는 숨기는 것이 좋겠죠?

`Tab.Screen` 컴포넌트의 `options` prop을 사용하여 탭 네비게이터의 헤더를 숨길 수 있습니다.

```javascript
// ... (이전 코드와 동일)

<Tab.Screen
  name="About Stack"
  component={AboutStack}
  options={{ headerShown: false }} // 탭 네비게이터 헤더 숨기기
/>
// ... (나머지 코드는 동일)
```

이제 앱을 실행하면 "About Stack" 탭에서 스택 네비게이터의 헤더만 표시되는 것을 확인할 수 있을 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEguAJQA6nXF1UK0r9fn2VvicijKSEZ_A_OQ3odr_7H6NAbUyXb9Zhkm6IBacOd7hjMWhYrD8XPLdseCxxE0PHfmbHtkpIA_jctYqBhRlWCFGLzBM891GlBDqjFDfhktYNaz5_Ega-8arZNr7OOqW_D6tcp5AueW7BXSlrsNRhqt2UhXgzV5Za5gBb1K_2Y)

끝.

