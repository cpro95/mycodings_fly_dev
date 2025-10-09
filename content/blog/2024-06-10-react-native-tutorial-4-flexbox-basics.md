---
slug: 2024-06-10-react-native-tutorial-4-flexbox-basics
title: 리액트 네이티브 강좌. 4편 - Flexbox - 기본 개념과 flexDirection 설정
date: 2024-06-10 08:00:28.121000+00:00
summary: React Native에서 Flexbox를 사용하는 방법에 대해 기본적인 개념과 설정 방법을 다룹니다. 재사용 가능한 Box 컴포넌트를 생성하고, Flex 컨테이너를 정의하며, Flex 속성을 활용하는 방법을 배워보세요.
tags: ["react native", "flexbox", "flexDirection"]
contributors: []
draft: false
---

안녕하세요!

리액트 네이티브 강좌 4편입니다.

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

- [리액트 네이티브 강좌. 4편 - Flexbox - 기본 개념과 설정](#리액트-네이티브-강좌-4편---flexbox---기본-개념과-설정)
  - [코드 설정](#코드-설정)
    - [1단계: 재사용 가능한 Box 컴포넌트 생성](#1단계-재사용-가능한-box-컴포넌트-생성)
    - [2단계: `index.js`에서 플렉스 컨테이너 정의](#2단계-indexjs에서-플렉스-컨테이너-정의)
    - [3단계: Box 컴포넌트에 props 추가](#3단계-box-컴포넌트에-props-추가)
  - [flex 속성](#flex-속성)
    - [첫 번째 예제](#첫-번째-예제)
    - [두 번째 예제](#두-번째-예제)
    - [세 번째 예제](#세-번째-예제)
    - [네 번째 예제](#네-번째-예제)
  - [Flex Direction](#flex-direction)
    - [Flex Direction의 다양한 값](#flex-direction의-다양한-값)
    - [요약](#요약)


---

이번에는 React Native에서 레이아웃의 세계를 공부해보겠습니다.

React Native에서 레이아웃 디자인의 핵심은 Flexbox입니다.

Flexbox는 컨테이너 내의 요소들을 배열하는 데 사용되는 강력한 일차원 레이아웃 모델입니다.

Flexbox를 사용하면 아이템들을 수평으로 왼쪽에서 오른쪽 또는 오른쪽에서 왼쪽으로, 또는 수직으로 위에서 아래 또는 아래에서 위로 배열할 수 있는 자유를 제공합니다.

또한 컨테이너 내의 아이템들의 간격과 정렬을 쉽게 제어할 수 있습니다.

먼저 Flexbox가 무엇인지 이해해보겠습니다.

본질적으로 Flexbox는 두 가지 주요 엔터티로 구성됩니다.

플렉스 컨테이너(flex container)와 플렉스 아이템(flex item)입니다.

부모 컨테이너는 보통 `View` 컴포넌트로, 이는 플렉스 컨테이너라고 하며, 직계 자식 요소들은 플렉스 아이템이라고 합니다.

```js
<View>
  <View>Item 1</View>
  <View>Item 2</View>
  <View>Item 3</View>
</View>
```

이 샘플 UI에서 부모 `View`는 플렉스 컨테이너 역할을 하며, 모든 자식 `View`들이 플렉스 아이템 역할을 합니다.

Flexbox를 사용할 때 두 축을 다루게 됩니다.

주축(Main axis)과 교차 축(Cross axis)입니다.

기본적으로 주축은 왼쪽에서 오른쪽으로, 교차 축은 위에서 아래로 수직으로 흐릅니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEg0hJ4oQaq4AinlFam7r_qF15THfPN9nXaKh98v4fS4VN6Hyk9oNL7v_t1CIM2F4DbpxkxyS2EEB-LgbYJ-tY5TlRawlftNZYIA-lyBkKYA_bzURw1N41FntWizal0rNCV2czZW2scv59eNvPX4RjZ3A2Yv96wJNvExOqnuAurrbkRu_O6RMp1Lc56s6fY)

그러나 React Native에서는 반대입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiUpZWb4LjAf73-Cci_PyJUBpYU99Wc1ZWoeX_XqkaJilIz7qhkRcfp9vbUI9ZMN_TYhr9UKa7TDe-MiNQlWCno9dGe1NS_9Gkx19fvA7YjBOogj8x8oOuB3oydetUCsW14AKoNegrHJqjJw4gTd0BjY_p8iOtwdaVUmVSe2s87wM3a8UL0ERIR0oo7wX8)

주축은 위에서 아래로 흐르고, 교차 축은 왼쪽에서 오른쪽으로 흐릅니다.

이는 매우 중요한 점이므로 기억해 두세요.

Flexbox를 이해하는 것은 CSS를 배우는 것과 마찬가지로 간단한 과정입니다.

다양한 Flexbox 속성들을 익히고 그 기능을 이해해야 합니다.

Flexbox 개념을 이해하면 React Native에서 레이아웃이 어떻게 만들어지는지에 대해 탄탄한 이해를 가질 수 있습니다.

---

## 코드 설정

이번에는 작업할 초기 코드를 설정하겠습니다.

레이아웃 섹션을 위해 `react-native-layout`이라는 새로운 Expo 프로젝트를 생성했습니다.

```bash
npx create-expo-app@latest react-native-layout
```

Expo 기본 코드가 많은데 다 지우고 app폴더의 index.js 파일과 components 폴더만 사용하겠습니다.

### 1단계: 재사용 가능한 Box 컴포넌트 생성

`components` 폴더 안에 `box.js`라는 새 파일을 만듭니다.

이제 `View`와 `Text` 코어 컴포넌트와 스타일링을 위한 `StyleSheet` API를 활용하는 Box 커스텀 컴포넌트를 정의하겠습니다.

먼저 필요한 컴포넌트와 API를 임포트합니다.

```javascript
import { View, Text, StyleSheet } from 'react-native';

const Box = () => {
  return (
    <View style={styles.box}>
      <Text style={styles.text}>Box</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    backgroundColor: 'white',
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Box;
```

이렇게 하면 `Box` 컴포넌트가 준비됩니다.

이 `Box` 컴포넌트는 플렉스 컨테이너 내의 플렉스 아이템으로 작동할 것입니다.

### 2단계: `index.js`에서 플렉스 컨테이너 정의

Expo 최신 버전은 엔트리 포인트가 app 폴더의 `index.js` 파일입니다.

`StatusBar`를 제거하고, `Text` 컴포넌트를 임포트하고, JSX 내에서 `View` 컴포넌트의 내용을 지웁니다.

컨테이너 스타일에서 모든 속성을 제거합니다.

마지막으로, `Box` 컴포넌트를 상단에 임포트하고 JSX에 포함시킵니다.

```javascript
import { View, StyleSheet } from 'react-native';
import Box from '../components/Box';

const App = () => {
  return (
    <View style={styles.container}>
      <Box></Box>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 64,
    borderWidth: 6,
    borderColor: 'red',
  },
});

export default App;
```

`marginTop` 속성이 없으면 Android 기기에서는 `Box` 컴포넌트를 볼 수 있지만, iPhone에서는 노치 때문에 `Box` 텍스트가 숨겨져 있을 수 있습니다.

이를 해결하려고 컨테이너 스타일에 `marginTop`을 추가했습니다. 

![](https://blogger.googleusercontent.com/img/a/AVvXsEiQVuKX8ilZPw270xYWjiNSiAoNKrgrTdj9rl8NrGoCJFrP0bkXamlnXUHO-98QFCVoU19q6clm9AApKU4B4OBYqni9nCRuEz0zLPlD04bPwntQ1nTxYSUWwkroR5bfWdRexTpcQVfYBOtW75RFeF_oJP0Hf_z5JoAnUMMspv3YB8D87e1f1152vXtDTU4)

### 3단계: Box 컴포넌트에 props 추가

`Box` 컴포넌트에 `children`과 `style` 두 가지 props를 추가하겠습니다.

`children` prop은 부모가 박스 내부에 렌더링할 텍스트를 제어할 수 있게 하고, `style` prop은 부모 컴포넌트가 `Box` 컴포넌트에 적용된 스타일을 확장할 수 있게 합니다.

```javascript
const Box = ({ children, style }) => {
  return (
    <View style={[styles.box, style]}>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
};
```

이제 `index.js`에서 `Box` 컴포넌트를 7개 추가하고, 각 박스에 다른 배경색을 설정합니다.

```javascript
const App = () => {
  return (
    <View style={styles.container}>
      <Box style={{ backgroundColor: 'blue' }}>Box 1</Box>
      <Box style={{ backgroundColor: 'green' }}>Box 2</Box>
      <Box style={{ backgroundColor: 'red' }}>Box 3</Box>
      <Box style={{ backgroundColor: 'purple' }}>Box 4</Box>
      <Box style={{ backgroundColor: 'orange' }}>Box 5</Box>
      <Box style={{ backgroundColor: 'pink' }}>Box 6</Box>
      <Box style={{ backgroundColor: 'yellow' }}>Box 7</Box>
    </View>
  );
};
```

이제 기기에서 확인하면 빨간색 테두리가 있는 컨테이너와 안에 다른 색상의 7개의 박스가 보일 것입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgWsSKpV3OP1Ey_pqCW1KsvD3DPx3fFlnpLXKNAUx7Jy1RRb9srnMjtp9yut_n4SVt48_2_7n2eZ9rUQs8QJQ2IaZt_uiH5NzEf-1PCxOHwGN7_MX_rFUHOLO0vDE9m8eeSZKGMOHeNsSizGOXZ5trhM0_SU11DQgsX4irRb4lhb2hw4BGXa4-zMXc0PpY)

이제 Flexbox의 다양한 속성들을 배우기 위한 준비가 되었습니다.

다음에는 `flex` 속성에 대해 알아보겠습니다.

---

## flex 속성

이번에는 첫 번째 flexbox 속성인 flex에 대해 알아보겠습니다.

flex 속성은 주축(main axis)을 따라 화면의 얼마만큼을 채울지를 정의하는 중요한 역할을 합니다.

이 속성은 0 이상의 정수 값을 받아 컴포넌트가 사용할 수 있는 공간의 비율을 나타냅니다.

이제 VS Code로 돌아가 몇 가지 예제를 통해 이를 더 잘 이해해 봅시다.

### 첫 번째 예제

예제를 시작하기 전에, 웹에서 CSS를 사용할 때는 div 블록을 flex 컨테이너로 만들기 위해 `display: flex`를 지정해야 한다는 점을 알아두세요.

그러나 React Native에서는 View 컴포넌트가 기본적으로 `display: flex`로 설정되어 있습니다.

그래서 우리 예제에서는 View 컨테이너가 이미 flex 컨테이너이며, 그 안의 박스들이 flex 아이템으로 간주됩니다.

첫 번째 예제에서는 전체 View를 주석 처리하고 간단한 View로 대체해 보겠습니다.

이 View 컴포넌트는 배경색으로 Plum을 가지고 있습니다.

```jsx
import { View, StyleSheet } from 'react-native';

const App = () => {
  return (
    <View style={{ backgroundColor: 'plum'}}>
    </View>
  );
};

export default App;
```

디바이스를 보면, 이 View는 자식 요소가 없기 때문에 기본적으로 아무 공간도 차지하지 않습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhMONIhYokWm6sYCn7L-4PBbrZ1XmTTsnt2CJfuf2-937gvL6nwDuNI5_i-SkPHmlZ3wDppEB6mcSCaxGRWk9VtyULsJvatpyn51GzqXfVHjR_JjkGkyU0ggDJ_FRTzt2K7QdrArlPs-8ZKxRbJjP7Qa05kGIzFHIUfI341dZjH4a6CYYv1-0LEJuDdPOw)


하지만, View가 사용 가능한 모든 공간을 차지하게 하고 싶다면 flex 속성을 추가하고 값을 1로 설정하면 됩니다.

이렇게 하면 Plum 배경색이 전체 사용 가능한 공간을 차지하게 됩니다.

이는 React Native 앱에서 흔히 사용하는 방법으로, View 컴포넌트를 추가하고 flex 속성을 1로 설정하여 모든 사용 가능한 공간을 차지하도록 하는 것입니다.

```jsx
import { View, StyleSheet } from 'react-native';

const App = () => {
  return (
    <View style={{ backgroundColor: 'plum', flex: 1}}>
    </View>
  );
};

export default App;
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEiU4TX59wtrbe4iMFRmhnzwrXr6iN4V10e9pV7up8LdPWfmrESXoSlbvGpSgr5E7PTJa7OIp8J3KqPhNYO09-i_vbZnwsvulYqny68DvVDHTqHMTws77ig8gGEjeqem3kOwAfptT0gclYVzyJLF5y_NZReH0I8WpdIjs_C355oFMo2NqSuBV-nOxCohj80)

이해되셨다면 두 번째 예제로 넘어가 봅시다.

### 두 번째 예제

두 번째 예제에서는 이전에 설정한 코드를 사용하겠습니다.

```jsx
import { View, StyleSheet } from "react-native";
import Box from "../components/Box";

const App = () => {
  return (
    <View style={styles.container}>
      <Box style={{ backgroundColor: "blue" }}>Box 1</Box>
      <Box style={{ backgroundColor: "green" }}>Box 2</Box>
      <Box style={{ backgroundColor: "red" }}>Box 3</Box>
      <Box style={{ backgroundColor: "purple" }}>Box 4</Box>
      <Box style={{ backgroundColor: "orange" }}>Box 5</Box>
      <Box style={{ backgroundColor: "pink" }}>Box 6</Box>
      <Box style={{ backgroundColor: "yellow" }}>Box 7</Box>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 64,
    borderWidth: 6,
    borderColor: "red",
  },
});

export default App;
```

파일을 저장하고 디바이스를 확인해 보면, flex 컨테이너가 차지하는 공간을 확인할 수 있습니다.

이는 빨간색 테두리로 표시됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjP_7nN1_kA4kyNmL8K2eP2FbdVPl2reiIIZl_ykfkAv0ZxJM9s4jIXRTyAiydrP-6sNo48FLRhpsmbHJ3EPtNwWciagUT8hBjYMYly9N9qhze8dg3Ig0faQ6qiOURq-QJgM--rbziUmWmV_izarvdl4LTsp1Lk_4lyEeWsdjNNU7X5HPedYdlcjQQhWEg)

이 컨테이너는 자식 요소들이 필요로 하는 공간만 차지하고 있습니다.

```jsx
const styles = StyleSheet.create({
  container: {
    flex: 1,  // 추가한 부분
    marginTop: 64,
    borderWidth: 6,
    borderColor: "red",
  },
});
```

이 컨테이너가 전체 사용 가능한 공간을 차지하도록 하려면 컨테이너 스타일에서 flex를 1로 설정하면 됩니다.

UI를 보면, 컨테이너가 이제 전체 사용 가능한 공간을 차지하고 있는 것을 볼 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEggkoXcLHM0FzA8yMP9ol_HSwmnjrzjkz_E5JqPxrp9YuZU0ptjqSrj0Suexnby3vznON51ieHyh7GravQKCriBI3TNIypvJqbrFWkxd2piqMLkBDWahMEP0-njG3sQFZdFzoXAigTmUx8_vtMqcF8_1nJHCfZFvxsQXjp-HAnKv9tMzUJBJ7uAYq15k10)

iPhone에서는 둥근 모서리 때문에 명확하지 않을 수 있지만, Android 디바이스에서는 테두리가 사용 가능한 공간을 차지하는 것을 분명히 볼 수 있습니다.

상단의 공간은 노치를 피하기 위해 의도적으로 `marginTop` 속성을 적용한 결과입니다.

### 세 번째 예제

이제 flex 속성이 flex 컨테이너에만 국한되지 않는다는 점을 이해하는 것이 중요합니다.

이 속성은 flex 아이템에도 적용할 수 있습니다.

첫 번째 박스 컴포넌트에 flex: 1을 추가하겠습니다.

```jsx
import { View, StyleSheet } from "react-native";
import Box from "../components/Box";

const App = () => {
  return (
    <View style={styles.container}>
      <Box style={{ backgroundColor: "blue", flex: 1 }}>Box 1</Box>
      <Box style={{ backgroundColor: "green"}}>Box 2</Box>
      <Box style={{ backgroundColor: "red" }}>Box 3</Box>
      <Box style={{ backgroundColor: "purple" }}>Box 4</Box>
      <Box style={{ backgroundColor: "orange" }}>Box 5</Box>
      <Box style={{ backgroundColor: "pink" }}>Box 6</Box>
      <Box style={{ backgroundColor: "yellow" }}>Box 7</Box>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 64,
    borderWidth: 6,
    borderColor: "red",
  },
});

export default App;
```
UI를 확인해 보면 첫 번째 박스가 컨테이너 내에서 모든 사용 가능한 공간을 차지하는 것을 볼 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEi6ZKvn-fnRL5_hvIwmJyPDDiIw3NCdTG3t3FlwSE7r62lXej-EoqlngTK7PFxCF4MtmqlZAZb7IDO_WeAGldYq6XVqBn-2HmCZpoAEXnAJmqYOTCD_kaMiTcWtdWxuTcELSpRZYGnX1mEHdFRrCXMNGRk012gTURUmcf1O4b-5IoqTgR3EC8BmbRP2djI)


그러나 flex 값은 컴포넌트가 차지할 수 있는 사용 가능한 공간의 비율을 나타낸다는 것을 인식하는 것이 중요합니다.

두 번째 박스에 다시 flex: 1을 설정하면, 첫 번째 박스와 두 번째 박스가 사용 가능한 공간을 각각 50%씩 나누어 가지게 됩니다.

```jsx
<View style={styles.container}>
  <Box style={{ backgroundColor: "blue", flex: 1 }}>Box 1</Box>
  <Box style={{ backgroundColor: "green", flex: 1 }}>Box 2</Box>
  <Box style={{ backgroundColor: "red"}}>Box 3</Box>
  <Box style={{ backgroundColor: "purple" }}>Box 4</Box>
  <Box style={{ backgroundColor: "orange" }}>Box 5</Box>
  <Box style={{ backgroundColor: "pink" }}>Box 6</Box>
  <Box style={{ backgroundColor: "yellow" }}>Box 7</Box>
</View>
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEhBWBf6p07eOvKuF9J6pjh0snrSvAGVoAuj8n7oM-_Af60r5ArKJDj2Nj_9xbF6nAIRaSDTqrRzf-qqowVOdOrd1DniaLKBbCBD4nUs5_sy7d4zbB5JAZeZWJDl3wwQyHib68u5oqbsp_fEhCgq9wPswxUKzvVsQ5wE2nSfDGhxJa4sA7cwmBaNLbJ_X00)

세 번째 박스에 flex: 1을 설정하면 첫 번째, 두 번째, 세 번째 박스가 각각 사용 가능한 공간의 33%를 차지합니다.

이 값은 1보다 클 수 있으며, 이는 아이템들 간의 사용 가능한 공간의 불균등한 분배를 초래할 수 있습니다.

```jsx
    <View style={styles.container}>
      <Box style={{ backgroundColor: "blue", flex: 1 }}>Box 1</Box>
      <Box style={{ backgroundColor: "green", flex: 1 }}>Box 2</Box>
      <Box style={{ backgroundColor: "red", flex: 1 }}>Box 3</Box>
      <Box style={{ backgroundColor: "purple" }}>Box 4</Box>
      <Box style={{ backgroundColor: "orange" }}>Box 5</Box>
      <Box style={{ backgroundColor: "pink" }}>Box 6</Box>
      <Box style={{ backgroundColor: "yellow" }}>Box 7</Box>
    </View>
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEi4mKc5JWJfqJzh17C2iaCftMfRd4uJoLh5feAG7GikTDqDktDO94qE2vMdsqT1pdzw7AYqXSCFyHfccjtXSE_z3T8DPm_xJUG3Znv-hKmWGH3SeIk-gyW-2VgTt5Sv6T2gxmAzrStKLR2UcHFmpBrhPXKopVg4Douo2cBw5WJJA35Dlk5YkJMk6v11OkU)

### 네 번째 예제

네 번째 예제를 보겠습니다.

세 번째 박스에서 flex 속성을 제거하고 대신 두 번째 박스에 flex: 3을 설정합니다.

```jsx
<View style={styles.container}>
  <Box style={{ backgroundColor: "blue", flex: 1 }}>Box 1</Box>
  <Box style={{ backgroundColor: "green", flex: 3 }}>Box 2</Box>
  <Box style={{ backgroundColor: "red"}}>Box 3</Box>
  <Box style={{ backgroundColor: "purple" }}>Box 4</Box>
  <Box style={{ backgroundColor: "orange" }}>Box 5</Box>
  <Box style={{ backgroundColor: "pink" }}>Box 6</Box>
  <Box style={{ backgroundColor: "yellow" }}>Box 7</Box>
</View>
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEgopXqbrDYg0My5ybZrCfcg93mwDUcc_2KZCDXPt6-YgY4H2MsCvIixQbrkCtiqKz8DooWWFmd3n0upRWSUWuRmKZ5w9CV3v-499kgdRQ1DI5A1yViodwgkUjXNG0rt6SPevsUa-gdh7NdtbS5oXhyoC6wfz5TdKMe5quLwUP1uwfUOK9li-1LuYWnBBYk)

이제 사용 가능한 공간은 1 + 3, 즉 네 부분으로 나뉩니다.

첫 번째 박스는 1/4, 즉 사용 가능한 공간의 25%를 차지하고, 두 번째 박스는 3/4, 즉 75%를 차지합니다.

UI를 보면 두 번째 박스가 첫 번째 박스보다 3배 큰 것을 분명히 알 수 있습니다.

flex 속성이 없는 박스는 Box 모델 속성에 의해 공간을 계속 차지합니다.

이제 React Native에서 flex 속성에 대해 충분히 이해하셨길 바랍니다.

요약하자면, React Native에서 View 컴포넌트는 기본적으로 `display: flex`를 가지고 있습니다.

컨테이너에 `flex: 1`을 설정하면 전체 사용 가능한 공간을 차지합니다.

아이템에 flex를 설정하면 사용 가능한 공간의 비율 또는 퍼센티지를 차지하며, 이는 사용 가능한 공간이 어떻게 나뉘느냐에 따라 100% 또는 그 이하가 될 수 있습니다.

---

## Flex Direction

두 번째 flexbox 속성인 `flex-direction`에 대해 알아보겠습니다.

`flex-direction` 속성은 주 축(main axis)을 설정하여 flex 아이템들이 컨테이너 내에서 어떻게 배치되는지를 결정합니다.

기본적으로 주 축은 위에서 아래로 흐르며, 이로 인해 아이템들이 UI에서 위에서 아래로 표시됩니다.

그러나 `flex-direction` 속성의 값을 변경하면 아이템들의 배치 방식을 바꿀 수 있습니다.

`flex-direction` 속성은 네 가지 값을 가질 수 있습니다.

이제 VS Code로 돌아가 각 값을 이해해 봅시다.

더 나은 시각화를 위해 박스 4번부터 7번까지는 주석 처리하고, 첫 세 개의 박스만 남기겠습니다.

```jsx
import { View, StyleSheet } from "react-native";
import Box from "../components/Box";

const App = () => {
  return (
    <View style={styles.container}>
      <Box style={{ backgroundColor: "blue" }}>Box 1</Box>
      <Box style={{ backgroundColor: "green" }}>Box 2</Box>
      <Box style={{ backgroundColor: "red" }}>Box 3</Box>
      {/* <Box style={{ backgroundColor: "purple" }}>Box 4</Box> */}
      {/* <Box style={{ backgroundColor: "orange" }}>Box 5</Box> */}
      {/* <Box style={{ backgroundColor: "pink" }}>Box 6</Box> */}
      {/* <Box style={{ backgroundColor: "yellow" }}>Box 7</Box> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 64,
    borderWidth: 6,
    borderColor: "red",
  },
});

export default App;
```

아래 그림은 지금까지의 UI입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEg-8Gc9USgtifMk-sae0Khm8jXerF--qbhL_HUBqkf-0syu7UESGddyB0k9oSPBWIcqloxq3-0qGAaZxCEZEhrEnnBX_v6qzuUoQd9cBC5_89jzz2BT9Xy0tQ4uhdbal5XDUDgwq-qgmzlaggS2OVY7YfKNJrvVgY18zwj94BVar6PmILA_FGtvLJdvpyU)

### Flex Direction의 다양한 값

첫 번째 값은 기본값인 `column`입니다. 

```jsx
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    marginTop: 64,
    borderWidth: 6,
    borderColor: "red",
  },
});
```

"column" 값을 설정하면 아무런 변화가 없습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEg-8Gc9USgtifMk-sae0Khm8jXerF--qbhL_HUBqkf-0syu7UESGddyB0k9oSPBWIcqloxq3-0qGAaZxCEZEhrEnnBX_v6qzuUoQd9cBC5_89jzz2BT9Xy0tQ4uhdbal5XDUDgwq-qgmzlaggS2OVY7YfKNJrvVgY18zwj94BVar6PmILA_FGtvLJdvpyU)

`column` 값은 주 축을 위에서 아래로 설정합니다.

다음 값은 `column-reverse`입니다.

```jsx
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column-reverse",
    marginTop: 64,
    borderWidth: 6,
    borderColor: "red",
  },
});
```

말 그대로 주 축이 아래에서 위로 설정되어, 아이템들이 아래에서 위로 배치됩니다.

UI를 보면, 아이템들이 역순으로 배열된 것을 볼 수 있습니다.

박스 1번이 컨테이너의 맨 아래에 위치하게 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjPX4NnUB18IMMA-2pJL7IDsupMRAe5B-m5S2cBUCrxX122sJOO0NtQAdJ40tRu1dNom2By02Rk1c0oxgH4acsvIiUScMldwr64BarwCLNHoO5G826mZcJnxSbJxEnbB1jKVgePKezdMLwANSVvOSgLKihOdqYCsmElt-aED-6eeeUdrrgB_-_ad8QLHEc)

세 번째 값은 `row`입니다.

```jsx
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    marginTop: 64,
    borderWidth: 6,
    borderColor: "red",
  },
});
```

`row`로 설정하면 주 축이 왼쪽에서 오른쪽으로 흐르며, 아이템들이 왼쪽에서 오른쪽으로 배치됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhR4GXfcWbq7swsW6ox_DE_LovpzDuh8GUmBkkxp8UEBN8SHUdr-kMhLNMIsgVT_T7h2UONWO0ilXR6LtNanFH_FZ0Deh5nHT00xGr9m751mNW4pYZSwdPWDCaKBCvZIUn-diDUlXLMYDfmb7Oh-TZ2eNxjxXOmxohocgT6ap6cdVLFYrwJAUbGVr9dmAI)

박스들은 위에서 아래로 늘어나는 것처럼 보일 수 있는데, 다음에 다루겠습니다.

또한 마지막 박스가 비어 있는데 이것도 다음에 다루겠습니다.

지금은 `row`가 박스들을 왼쪽에서 오른쪽으로 배치함을 이해하면 됩니다.

마지막 값은 `row-reverse`입니다.

```jsx
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row-reverse",
    marginTop: 64,
    borderWidth: 6,
    borderColor: "red",
  },
});
```

이 값을 설정하면 아이템들이 오른쪽에서 왼쪽으로 배치됩니다.

결과적으로 아이템 1번은 오른쪽에, 아이템 3번은 왼쪽에 위치하게 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhiX1GjUZntMSXHek1dbfUJZn7g99fdOm1tGN21U0BtaMbjstQEqVetrjap4tFUVA-2ccNpuZ3aFkq5rrBiCVli0vCutWuI2Nb-zH6Vr7lVSEbGj0ABOTAuqFjBjWNOlTs-cP5bHBe3w0qhEru84yLvJH7acV4VN25EV6PexeBSQ-jnwm95IEeO1nHErnk)

이제 모든 일곱 개의 아이템을 다 배치하면 어떻게 되는지 궁금하실 텐데요, 단순히 넘쳐버리게 됩니다.

```jsx
import { View, StyleSheet } from "react-native";
import Box from "../components/Box";

const App = () => {
  return (
    <View style={styles.container}>
      <Box style={{ backgroundColor: "blue" }}>Box 1</Box>
      <Box style={{ backgroundColor: "green" }}>Box 2</Box>
      <Box style={{ backgroundColor: "red" }}>Box 3</Box>
      <Box style={{ backgroundColor: "purple" }}>Box 4</Box>
      <Box style={{ backgroundColor: "orange" }}>Box 5</Box>
      <Box style={{ backgroundColor: "pink" }}>Box 6</Box>
      <Box style={{ backgroundColor: "yellow" }}>Box 7</Box>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row-reverse",
    marginTop: 64,
    borderWidth: 6,
    borderColor: "red",
  },
});

export default App;
```
네 개의 박스는 보이지만, 다섯, 여섯, 일곱 번째 박스는 보이지 않게 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgI3noCm5EuF5xfJwT5vE8Ww6YuOCoPpBEx6ssCng3e84gLiRpqa278IiqKRVRVeyX_EfwwYY3BUdMX7w8SMrxVYNJPwuoxraXtugm_F0D0S_9AJyl9EnVPrESeb3bpP_eYB4k717PGWwN13Tx5Lcih44pTiR6D9BbdCGgipg7vWsu3D4u0r_1oad_t0IY)

왜 네 개의 박스만 보이는지, 이것도 다음에 그 이유를 좀 더 자세히 알아보겠습니다.

### 요약

`flex-direction` 속성은 주 축의 방향을 설정하여 아이템들이 컨테이너 내에서 어떻게 배치되는지를 제어합니다.

가능한 값은 다음과 같습니다:

- `column`: 주 축을 위에서 아래로 설정
- `column-reverse`: 주 축을 아래에서 위로 설정
- `row`: 주 축을 왼쪽에서 오른쪽으로 설정
- `row-reverse`: 주 축을 오른쪽에서 왼쪽으로 설정

---
