---
slug: 2024-06-30-react-native-9-textinput-and-form-with-validation
title: 리액트 네이티브 강좌. 9편 - Input and Forms with Switch, KeyboardAvoidingView, Form Validation
date: 2024-06-30 12:01:43.710000+00:00
summary: React Native를 사용하여 효율적인 폼을 구현하는 방법을 안내합니다. TextInput부터 Switch, KeyboardAvoidingView, 폼 검증 및 제출까지 단계별로 자세히 설명합니다.
tags: ["react native", "TextInput", "Switch", "KeyboardAvoidingView"]
contributors: []
draft: false
---

안녕하세요!

리액트 네이티브 강좌 9편입니다.

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

- [리액트 네이티브 강좌. 9편 - Input and Forms with Switch, KeyboardAvoidingView, Form Validation](#리액트-네이티브-강좌-9편---input-and-forms-with-switch-keyboardavoidingview-form-validation)
  - [TextInput](#textinput)
  - [TextInput Props](#textinput-props)
    - [Placeholder](#placeholder)
    - [Secure Text Entry](#secure-text-entry)
    - [Keyboard Type](#keyboard-type)
    - [AutoCorrect](#autocorrect)
  - [Multiline TextInput](#multiline-textinput)
  - [Switch](#switch)
    - [상태 변수 연결](#상태-변수-연결)
  - [Login Form](#login-form)
    - [1단계: 컨테이너 뷰 추가](#1단계-컨테이너-뷰-추가)
    - [2단계: 폼 컨테이너 추가](#2단계-폼-컨테이너-추가)
    - [3단계: 라벨과 입력 필드 추가](#3단계-라벨과-입력-필드-추가)
    - [4단계: 상태 변수 관리](#4단계-상태-변수-관리)
  - [KeyboardAvoidingView](#keyboardavoidingview)
    - [UI 변경](#ui-변경)
    - [키보드 문제가 발생하는 이유](#키보드-문제가-발생하는-이유)
    - [KeyboardAvoidingView 사용](#keyboardavoidingview-사용)
    - [문제 해결](#문제-해결)
    - [플랫폼별 해결 방법](#플랫폼별-해결-방법)
  - [Form Validation](#form-validation)
    - [1단계: 에러 메시지 상태 변수 생성](#1단계-에러-메시지-상태-변수-생성)
    - [2단계: 폼 검증 함수 정의](#2단계-폼-검증-함수-정의)
    - [3단계: 에러 메시지 표시](#3단계-에러-메시지-표시)
    - [4단계: 에러 텍스트 스타일 정의](#4단계-에러-텍스트-스타일-정의)
    - [5단계: 폼 제출 처리](#5단계-폼-제출-처리)
  - [Form Submission](#form-submission)
    - [1단계: handleSubmit 함수 정의](#1단계-handlesubmit-함수-정의)
    - [2단계: 버튼에 제출 함수 연결](#2단계-버튼에-제출-함수-연결)
    - [3단계: 폼 제출 테스트](#3단계-폼-제출-테스트)
    - [마무리](#마무리)


---
안녕하세요!

이번에는 React Native에서 입력과 폼에 대해 집중적으로 다룰 예정입니다.

웹 애플리케이션 UI를 개발할 때는 사용자 입력을 받을 수 있는 많은 HTML 요소들이 있습니다.

예를 들어, 입력 필드, 텍스트 영역, 드롭다운 메뉴, 체크박스, 라디오 버튼 등 다양한 요소들이 있죠.

하지만 React Native를 사용할 때는 선택지가 훨씬 제한적입니다. 

React Native의 기본 라이브러리는 두 가지 입력 컴포넌트만 제공합니다: TextInput과 Switch입니다.

이 두 가지 컴포넌트에 집중할 것입니다.

그럼 다른 컴포넌트들은 어떻게 할까요?

Expo가 체크박스나 데이트 피커와 같은 추가 컴포넌트를 제공한다는 것입니다.

이러한 주제들은 나중에 다룰 예정입니다.

React Native에서 폼을 구현하는 것은 또 다른 도전 과제입니다.

우리는 보통 폼 상태 관리, 폼 검증 처리, 검증 메시지 표시, 폼 데이터 제출이라는 네 가지 주요 측면에 집중합니다.

이러한 작업들은 React Hook Form 같은 라이브러리를 사용하면 간소화될 수 있지만, 이번에는 외부 의존성 없이 순수한 React Native로 폼을 다루는 방법을 보여드리겠습니다.

나중에 React Native와 React Hook Form을 결합하는 방법에 대해서도 알아볼 예정입니다.

---

## TextInput

이번에는 React Native에서 텍스트 입력 컴포넌트에 대해 알아보겠습니다.

텍스트 입력 컴포넌트는 React Native에서 사용자 입력을 받기 위한 기본적인 블록입니다.

이를 통해 사용자들은 애플리케이션에 텍스트와 기타 데이터를 입력할 수 있습니다.

코드를 통해 더 자세히 알아보도록 하겠습니다.

먼저 app.js 파일에 몇 가지 변경을 해보겠습니다.

Expo에서 가져온 status bar import를 제거하고 대신 React Native에서 가져옵니다.

Expo SDK 섹션에 도달하기 전까지는 가능한 한 순수한 React Native만 사용하도록 하겠습니다.

다음으로 View 컴포넌트를 SafeAreaView로 교체합니다.

이렇게 하면 iOS에서 상단의 패딩을 처리할 수 있습니다.

Android의 경우, status bar 높이만큼 패딩을 추가해보겠습니다.

container 스타일에서 paddingTop을 statusBar.currentHeight로 설정합니다.

텍스트 입력이 배치되는 방식에 영향을 미치는 정렬 속성들도 제거합니다.

마지막으로 SafeAreaView 안의 jsx를 모두 삭제합니다.

이제 텍스트 입력을 위한 준비가 완료되었습니다.

React Native에서 TextInput을 import합니다.

```js
import { StyleSheet, StatusBar, SafeAreaView, TextInput } from "react-native";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <TextInput />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: StatusBar.currentHeight,
  },
});
```

SafeAreaView 내에서 컴포넌트를 호출하고 파일을 저장한 후 디바이스에서 확인해봅니다.

지금은 텍스트 입력 컴포넌트가 보이지 않지만, 화면에는 존재합니다.

스타일링이 되어 있지 않아서 보이지 않는 것뿐입니다.

입력을 클릭해보면 커서가 나타나는 것을 볼 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhlmxao3db5oZXq2NgKy_9ZVHcFuGYSSVyK22thKaMMQuXf7JT4Yfj4GElHpPMmiD7LNjkSjP4F6AyD0HBtlANnyZteyM_BxJRX-MFLLytTicj2htcEcp1T2p5aPDmNALXG7LolgJPQ4xmkWv0itkmhtZNNLRao9ezkXaZ2U184M6TFfJVeBQ3r0fwOXLI)

이제 VS Code로 돌아가 스타일을 추가해보겠습니다.

키를 input으로 설정하고 높이를 40 픽셀로 지정합니다.

margin, padding, 그리고 border width를 추가합니다.

이 스타일을 `TextInput` 컴포넌트에 할당합니다.

`style={styles.input}`으로 설정합니다.

```js
import { StyleSheet, StatusBar, SafeAreaView, TextInput } from "react-native";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <TextInput style={styles.input} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: StatusBar.currentHeight,
  },
  input: {
    height: 40,
    margin: 12,
    padding: 10,
    borderWidth: 1,
  },
});
```

이제 UI를 확인해보면 텍스트 입력 컴포넌트가 명확하게 보입니다.

입력에 집중하고 타이핑을 시작할 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEio82WV1lLXm35_Tj2AmRtZdLlv9vNBucQ7BQ9cHTTJWA140kf7XiU1xecNxYjrpxWU1uvoGJLCvpGNjO207Jqo-hO1Z_jR8V8m9i9fmdOVddWUB11w12X6WLJ75dLpt9iIdSKka0Wnu95JshmCB0yDAve8v_io3OYU9J4dUhfzhiz2n_BhhyrAGLsK-WI)

Android 디바이스에서도 잘 작동합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgqZq8CApi9XDGbXAsQnxp5j31sl-EbPWOR6KA2au9B93fkYwvAdkH2-x7BuevMDLw7kzPCE15Ye2TGIa83tkskWawR5dxgSjVIgixa27oLUaDN_S0KYwhuAw5Khy8dRB6sN2uNQmqBRa17xob6oYUQOZZmlMIXk1hfEMuMQ3pA0PIALgQ7oI4sTybkgCQ)

타이핑을 계속하거나 키보드를 사용할 수 있습니다.

둘 다 잘 작동합니다.

iOS의 경우 비슷한 키보드를 원한다면 command+shift+K를 눌러 키보드를 띄울 수 있습니다.

다시 command+shift+K를 누르면 키보드가 사라집니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhzSn89V2a3exdchWYJFjIBO0eSRAYkkkaapTdUJSwfuBLbbw-6oUO8ISbgEXypptrMurjgCqS9_FHgMu1E18q56tSAnOlygiEUbaoZWSEArv82-3cBCqr4_DNj6PIeAIwSsH6Hm5ojeSjKrbtbyRhBwGas5zHIM1Wj0SSr1i0GlnpwheCBlkLkBI32oFs)

지금 입력한 값은 추적되지 않습니다.

입력 값을 추적하려면 상태 변수를 사용해야 합니다.

React에서 useState를 import하고 상태 변수를 만듭니다.

변수 이름은 name, 함수는 setName, 초기 값은 빈 문자열로 설정합니다.

이제 name을 text input의 value prop에 할당하고 onChangeText prop에 setName 함수를 할당합니다.

이렇게 하면 입력 상자에 텍스트를 입력할 때 상태 변수가 자동으로 업데이트됩니다.

입력 값을 추적하고 있는지 확인하기 위해 텍스트를 추가해보겠습니다.

텍스트로 "My name is" 뒤에 name 상태 변수를 추가합니다.

명확하게 하기 위해 스타일도 추가합니다.

`style={styles.text}`로 설정합니다.

텍스트 스타일을 정의하고 폰트 크기를 30으로, 패딩을 10으로 설정합니다.

```js
import { StyleSheet, Text, StatusBar, SafeAreaView, TextInput } from "react-native";
import { useState } from "react";

export default function App() {
  const [name, setName] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <TextInput style={styles.input} value={name} onChangeText={setName} />
      <Text style={styles.text}>My name is {name}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: StatusBar.currentHeight,
  },
  input: {
    height: 40,
    margin: 12,
    padding: 10,
    borderWidth: 1,
  },
  text: {
    fontSize: 30,
    padding: 10,
  },
});
```

이제 디바이스로 돌아가서 타이핑을 시작하면 입력 값이 아래의 텍스트 컴포넌트에 반영되는 것을 볼 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEi-LQA6IHEkVujN-4oFdtsU1zcQnSYYzMHggELCKS9iotUfkP7IRvd02smnCwe6wBpRP0GpcQabMDqyTxT0CatPB8v4emOQ9jPvpuavkPlyKWbYKUzB7YVaqh46tW4uQ9axTROzDkixY9P18-6F5CsKrrfF16vpvQ99k-yxruXbUZABwo6P8RjNz_AINjs)

요약하자면, 텍스트 입력 컴포넌트는 키보드를 통해 앱에 텍스트를 입력하기 위한 도구입니다.

위 예제에서는 `TextInput` 컴포넌트를 사용하여 사용자의 이름을 입력받고, 입력된 이름을 `Text` 컴포넌트에 표시합니다.

`useState`를 사용하여 입력 값을 관리하고, `onChangeText` 속성을 통해 입력 값이 변경될 때 상태를 업데이트합니다.

이제 이 코드를 실행하면, 입력 필드에 이름을 입력할 수 있고, 입력한 내용이 아래의 텍스트로 실시간으로 반영되는 것을 볼 수 있습니다.

---

## TextInput Props

이제까지 React Native에서 텍스트 입력 컴포넌트의 기본적인 측면을 살펴보았습니다.

이번에는 텍스트 입력 컴포넌트의 동작과 외관을 사용자 맞춤 설정할 수 있는 중요한 props에 대해 알아보겠습니다.

### Placeholder

첫 번째로 살펴볼 prop은 `placeholder`입니다.

이것은 사용자가 입력해야 할 내용에 대한 시각적 힌트를 제공합니다.

예를 들어, `placeholder`를 "email@example.com"으로 설정할 수 있습니다. 

```javascript
<TextInput
    style={styles.input}
    value={name}
    onChangeText={setName}
    placeholder="email@example.com"
/>
```

UI를 보면 사용자가 입력을 시작하기 전까지 placeholder 텍스트가 표시되는 것을 볼 수 있습니다.

이는 사용자에게 이메일을 입력하라는 안내를 제공합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhl48s_EEU7-8sIbZuMHmoRF5cWgqct2_VwRy1f_4yEoCqDhEyvy692mLMO8PVhoJMhgIO1kMybmR0Vt_bA72s6aOB6yOt1mVVnli4msx0UrgPUaIfAyeIBckJ0AZ9DWnLIg-CtnKjaCaeeouir60MO7x_WuXpqUYv0KaTVAWBn3BLe81xNP3vtVnz_sJs)

하지만 placeholder는 레이블을 대체하는 것이 아니라는 점을 기억하세요.

입력을 시작하면 힌트가 사라집니다.

### Secure Text Entry

두 번째 prop은 `secureTextEntry`입니다.

```javascript
<TextInput
    style={styles.input}
    value={name}
    onChangeText={setName}
    placeholder="Enter your password"
    secureTextEntry={true}
/>
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEgCk_NdRtpD-O0FN9WeaVfSMdL0go8nAXMXBUeR8rXBklg-5iL9FbZwMlV0u9b2KuX0rwsgYE_C0f-ljWF7MshWe5ZoMyoZ4fEqLQcznwEj-77T12C6fUjhE9n1fjjomc1tX0QPvXkICWjpr3p0xLbAOVZ3M5fxlEbWQtHfuYja1Myo0gZup97EaDC9SUs)

이 prop을 활성화하면 입력 문자가 별표(*) 또는 점(.)으로 표시되어 사용자가 입력한 내용이 감춰집니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiSHTbTNz6xMopKIWyCK3qb2dFsWFdE8SrPnwCNdZzzJy-o0XLi1mRmPGyp6wo0UGZ0FthG8CvNKftj6J43jUoPhl2oz4vTjLRMS9Vy8gFABR_XTYCkaCcWpDYcpqybiuBiHlWvCgvdWYsoUHWfAYCD00BWluj3FgyIErVhArr945qoxyBQEFf_Frg2Y4c)

이는 비밀번호와 같은 민감한 정보를 다룰 때 매우 중요합니다.

### Keyboard Type
세 번째로 중요한 prop은 `keyboardType`입니다.

이 prop은 사용자가 텍스트 입력과 상호작용할 때 나타나는 키보드의 유형을 지정할 수 있게 해줍니다.

예를 들어, 전화번호 필드를 만들 때는 `keyboardType`을 "numeric"으로 설정할 수 있습니다.

```javascript
<TextInput
    style={styles.input}
    value={name}
    onChangeText={setName}
    placeholder="Enter your phone number"
    keyboardType="numeric"
/>
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEgwlbgmU-kw8F3xNSjTRbCQVJ_uLbuVhhEzka0TuWx3Ibf-HYzWgWo3oBk-aat2VjYLGzGPMA5l0qa4pesN1k5_Lrxtfom9rmgmG7if-6ap7Nc23bVKwZPk9UXvY40zUp0nka5kG5qHv3fuGT76RcnzuQKeuxXp7wVdnNJ_6_KwhRp-Ixm2SKDywxpXYmY)

Android에서 텍스트 입력 필드를 집중시키면 숫자 키보드가 나타나는 것을 볼 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiuvPYCpkftZ83S9iH_mlTwOeOyJd1rv_Yumk8L2MA9Qksid1zhkWR7zYX-hJi_omzJHiCmGpqYXnP93nHjASBkeJWCx0Q96lFEMnZnqwv_FRJMKYbXcrdjjA6EHg8VgRxK-KdzIaAaP-Vs2Fo2WS9YdHbNKtcbO1gqsI3evAv3hbkPlkV7LV8Kwm1FuDE)

이 prop은 사용자 경험(UX)을 향상시킬 수 있습니다.

### AutoCorrect

마지막으로 두 가지 props를 더 살펴보겠습니다.

이 props는 기본적으로 활성화되어 있지만, 일부 상황에서는 원하지 않을 수 있습니다.

예를 들어, 잘못된 단어를 입력하고 엔터를 누르면 자동으로 수정되거나, 이름을 입력할 때 자동으로 대문자로 변환될 수 있습니다.

```javascript
<TextInput
    style={styles.input}
    value={name}
    onChangeText={setName}
    autoCorrect={false}
    autoCapitalize="none"
/>
```

앱을 다시 시작하고 UI로 돌아가 watre를 입력하고 엔터를 누르면 자동 수정이 되지 않습니다.

또한, John Doe를 입력하고 엔터를 눌러도 자동으로 대문자로 변환되지 않습니다.

---

## Multiline TextInput

이번에는 리액트 네이티브에서 멀티라인 입력을 정의하고 스타일링하는 방법에 대해 알아보겠습니다.

웹에서는 단일 라인 입력을 위한 input 요소와 멀티라인 입력을 위한 textarea 요소가 있지만, 리액트 네이티브에서는 같은 TextInput 요소로 두 가지 용도를 모두 사용할 수 있습니다.

단지 multiLine 속성을 추가해주기만 하면 됩니다.

새로운 TextInput 컴포넌트를 추가해봅시다.

스타일은 Styles.input으로 설정하고, placeholder는 "message"로 지정한 후, multiLine 속성을 추가합니다.

```jsx
<SafeAreaView style={styles.container}>
    <TextInput
    style={styles.input}
    value={name}
    onChangeText={setName}
    autoCorrect={false}
    autoCapitalize="none"
    />
    <TextInput style={styles.input} placeholder="message" multiline />
    <Text style={styles.text}>My name is {name}</Text>
</SafeAreaView>
```

이제 UI를 살펴보면, 기본 요소가 같기 때문에 큰 차이를 느낄 수 없습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiYuiloNIytJrqQH6ksqpPgUZASsyVJTXv3I97o2SzBfvxwkF7Pfg2pZ4rG3wkHL_ZTobPXLPj-JAw53gZHDTIk86P6KhJvwYodR1Jmn5GEcxncR_QKBrjEUFj-PKc_k_syCWbifBanKTOsL7WqZYXER-p01CRdWBvwj753CaUUoUxLkIqt5Rc8qgkmXmQ)

멀티라인 입력을 눈에 띄게 만들기 위해 추가 스타일을 적용해야 합니다.

Styles 객체에 새로운 key-value 쌍을 추가하여 multiLineText에 최소 높이(minHeight) 100을 설정합니다.

```jsx
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: StatusBar.currentHeight,
  },
  input: {
    height: 40,
    margin: 12,
    padding: 10,
    borderWidth: 1,
  },
  text: {
    fontSize: 30,
    padding: 10,
  },
  multiLineText: {
    minHeight: 100,
  },
});
```

그 다음, TextInput에 스타일 배열을 지정합니다.

Styles.input과 Styles.multiLineText를 함께 사용합니다.

```jsx
<TextInput 
    style={[styles.input, styles.multiLineText]}
    placeholder="message"
    multiline
/>
```

다시 UI를 확인해보면 이제 멀티라인 텍스트 입력처럼 보이는 것을 알 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgL64QP79glAA7kk20frlZjjT01hFDPzR9jJJb2GIKMUW0eOLYArntYEhAsbMPcpGuJtWeUWWuhu7vfEOuFKbjBEE08YXg0Y6s-tbcKfKGP8ANHkccO69HqfRBZ1T0LHMK3xqFZV9tD8k5YHX-fyp_u7FhNAydUQ_iDmE3V-tNOG15pKHwZN1TEoZSnUSQ)

사용자는 처음부터 긴 텍스트를 입력할 수 있다는 것을 쉽게 이해할 수 있을겁니다.

중요한 점은, iOS에서는 multiLine 속성이 텍스트 입력을 상단에 정렬하고, 안드로이드에서는 중앙에 정렬한다는 것입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhw27SCcCP9xEEu3_9dK50xRFUkoSc-H1XnbUFsJuAmvAeWxLbgJuSccjkUa4WmIHYcEVew60WCFAkYvIdJNzJyYfgOKq8g58BXS_KB_t3U9EQKq6YbszTXCFXRTgAmR4Oz7mdIuQWzvPDZFc_3i18hYShO7vBZoEshK8t8lwuskd_SdkRVHg96U4CuFVQ)

이를 해결하기 위해 textAlignVertical 속성을 "top"으로 설정해야 합니다.

```jsx
multiLineText: {
    minHeight: 100,
    textAlignVertical: "top",
},
```

이제 UI로 돌아가서 보면 텍스트가 상단에 제대로 정렬된 것을 확인할 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEg2U6ii1ame--_sHM-Jfsb4UnXTb0AlfiKcgsqRpRd3tNTMJ_W1Xx_D1mZJ0V-qVm49KMFAWOoRCd7VJmryP-WGL9YYseQWuiq__5Wp4kJ-xLi8rTKhDDulWvq1r8yh3L9v-oWtVtHaBJB9k74R_a7TR6-RPbXpNx7XAoqZHXAcfOvjC64c-t944McewKg)

이상으로 리액트 네이티브의 TextInput 컴포넌트에 대해 알아보았습니다. 

---

## Switch
 
이번에는 리액트 네이티브의 Switch 컴포넌트에 대해 알아보겠습니다.

Switch 컴포넌트는 앱의 사용자 인터페이스에 토글 기능을 통합하는 데 유용한 도구입니다.

특정 앱 기능을 활성화하거나 비활성화하는 등 사용자가 이진 선택을 해야 하는 상황에 특히 적합합니다.

그럼 VS Code로 돌아가서 사용 방법을 알아봅시다.

우선, react-native 라이브러리에서 Switch 컴포넌트를 임포트합니다.

react-native의 View 컴포넌트를 사용하여 Switch 컴포넌트를 위한 컨테이너를 만듭니다.

스타일은 `styles.switchContainer`로 설정합니다.

그런 다음, "Dark Mode"라는 텍스트를 표시하는 Text 컴포넌트를 추가하고 스타일을 `styles.text`로 설정합니다.

그리고 Switch 컴포넌트를 호출합니다.

Switch 컨테이너의 스타일을 정의합니다.

flexDirection을 'row'로 설정하고, alignItems를 'center'로, justifyContent를 'space-between'으로 설정한 후, paddingHorizontal을 10으로 설정합니다.

```jsx
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  TextInput,
  Switch,
} from "react-native";
import { useState } from "react";

export default function App() {
  const [name, setName] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        autoCorrect={false}
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, styles.multiLineText]}
        placeholder="message"
        multiline
      />
      <Text style={styles.text}>My name is {name}</Text>
      <View style={styles.switchContainer}>
        <Text style={styles.text}>Dark Mode</Text>
        <Switch />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: StatusBar.currentHeight,
  },
  input: {
    height: 40,
    margin: 12,
    padding: 10,
    borderWidth: 1,
  },
  text: {
    fontSize: 30,
    padding: 10,
  },
  multiLineText: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
});
```


```jsx
const styles = StyleSheet.create({
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  text: {
    fontSize: 16,
  },
});
```

이제 UI를 보면 Switch 컴포넌트가 아래와 같이 보일겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhIqJglcS62JSmjpHITu85tQaDy3IZefmysJst98pL5F37z8ur_sPhtY46wWeYNI98WbGB5MyO_doSqWAZW9KJDEiQhsLe1IHzfEVyQ1AD70nVnER2IXZvls5SuidQcYVWm-VP_Wjt_Z1-_7-qwZ9vJnshOXo-l87N8Hig2SKaLXQA_mCbbemlRtLn7g1A)

### 상태 변수 연결

`isDarkMode`라는 새로운 상태 변수를 생성하고 초기값을 false로 설정합니다.

그런 다음, Switch 컴포넌트에 두 가지 props를 추가합니다.

`value`는 `isDarkMode`로 설정하고, `onValueChange`는 `isDarkMode` 값을 토글하는 함수로 설정합니다.

이 함수는 이전 상태를 받아서 그 값을 반전시킵니다.

```jsx
export default function App() {
  const [name, setName] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        autoCorrect={false}
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, styles.multiLineText]}
        placeholder="message"
        multiline
      />
      <Text style={styles.text}>My name is {name}</Text>
      <View style={styles.switchContainer}>
        <Text style={styles.text}>Dark Mode</Text>
        <Switch
          value={isDarkMode}
          onValueChange={() => setIsDarkMode((previousState) => !previousState)}
        />
      </View>
    </SafeAreaView>
  );
}
```

이제 UI에서 Switch를 토글하여 true와 false 값을 전환할 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiK92b744-6TA_IGkygU7EaIwr6BR7mRBmtAEQoWGswvpHMN7WYEuGLII-F_3sxqYhJRKiXbyQh9zW45_mrh7ljGoXQ260h5QV7qobI1TQtROTd3ho-LLDqzjVbIF454Q5Hmw-8GtCucGZ-ZsMf2o18aMWU-DF89X8SvMteidGGqhLggPtmCkRLVITwclU)

실전 코드에서는 Switch가 켜지거나 꺼질 때 다른 콘텐츠를 표시하거나 특정 기능을 활성화할 수 있습니다.

trackColor와 thumbColor props를 사용하여 트랙과 썸의 색상을 설정할 수 있습니다.

이 색상들은 브랜드 색상에 맞게 조정될 수 있습니다.

```js
<Switch
    value={isDarkMode}
    onValueChange={() => setIsDarkMode((previousState) => !previousState)}
    trackColor={{ false: "#767577", true: "lightblue" }}
    thumbColor="#f4f3f4"
/>
```

Switch 컴포넌트의 외형은 플랫폼에 따라 다르게 보일 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjIYi9ja_JUp8iTZH2bgXJmWlQwcAV1jGPG4qgXb_z2wb1d1FQvMtbmk8iyigRF1X8BOmB6_lPBt_lOfyONZDsKOSiBqaWP4rT7uVhkfboTBp6swWyXd_Cn6t79AiUB-5cWiY7ilSBb23txWx4OpgH3cIKtX0rbfdT3u-iJRunIPnrVo6VodkrMJlAebVo)

이상으로 리액트 네이티브의 Switch 컴포넌트에 대해 알아보았습니다.

---

## Login Form

이번에는 리액트 네이티브에서 폼을 만드는 방법에 대해 알아보겠습니다.

이전에는 입력 필드에 대해 다루었는데요, 이번에는 로그인 폼을 처음부터 끝까지 만들어보겠습니다.

앱 컴포넌트를 최소한의 코드로 리셋했습니다.

View, Text, TextInput, Button, StyleSheet를 임포트하고 시작하겠습니다.

이제 로그인 폼 요소들을 추가해보겠습니다.

### 1단계: 컨테이너 뷰 추가

먼저, View 컴포넌트를 추가합니다.

이 컴포넌트는 메인 컨테이너 역할을 하며, 깔끔하게 보이도록 컨테이너 스타일을 적용할 것입니다.

```jsx
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      {/* 로그인 폼 요소들을 여기에 추가할 것입니다 */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
});
```

### 2단계: 폼 컨테이너 추가

이제 메인 컨테이너 안에 또 다른 View 컴포넌트를 추가합니다.

이 컴포넌트는 폼 컨테이너 역할을 하며, 스타일을 적용하여 폼의 외형을 정의합니다.

```jsx
export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.form}>
        {/* 라벨과 입력 필드를 여기에 추가할 것입니다 */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  form: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
```

### 3단계: 라벨과 입력 필드 추가

이제 폼 컨테이너 안에 사용자 이름과 비밀번호를 위한 라벨과 입력 필드를 추가합니다.

입력 필드에는 안내 텍스트를 위한 placeholder를 설정합니다.

비밀번호 입력 필드는 secureTextEntry를 사용하여 비밀번호를 숨기도록 설정합니다.

```jsx
export default function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          value={username}
          onChangeText={setUsername}
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
        <Button title="Login" onPress={() => {}} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  form: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
  },
});
```

### 4단계: 상태 변수 관리

마지막으로, 상태 변수인 `username`과 `password`를 생성하고, 입력 필드의 값과 변경 이벤트를 상태 변수와 연결합니다.

```jsx
import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          value={username}
          onChangeText={setUsername}
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
        <Button title="Login" onPress={() => {}} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  form: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
  },
});
```

이렇게 하면 UI에서 로그인 폼을 확인할 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjBhx_a-PU2inW_C_Lrh7apQbbQ86GErT-VbSiJx45mNIRCApaT8QV_L7ca-6Dhz0s6Mey0t-CuhoqD-4EbYp5Qx4O3hlE_-GlKSKoQ1svOykris_ieuT214dTm67Unl97kmNfk0A38RaiWDoiV5Gw9cbEAz6kT9P1KIEc23uC3F1mxXMKgKMcoWFu8RaY)

아래는 안드로이드 화면입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEh44M3n0pcGFKD5fRtC6l6ce8fOn-RkYEXC7VPk8zc1Fo0I5ctgZoI-iI29Nmhn1EgSO0xZzFuc5U8Yhk6IeEEhPPpg3V6FyIjRIh2yPpGUMqjffO1TNepHWM7xWE93vWStkL5nHj5sydOKwtcfN9a4M3bhuW2QtbM7_IHiTQcGiA395nRVOFZ0fsIpLL0)

다음에는 폼 검증을 추가하는 방법에 대해 알아보겠습니다.

많은 개발자가 리액트 네이티브에서 입력 필드를 다룰 때 겪는 일반적인 문제를 다뤄 보겠습니다.

----

## KeyboardAvoidingView

자주 발생하는 문제 중 하나는 리액트 네이티브에서 폼을 다룰 때 발생하는 문제입니다.

이번에는 그 문제를 해결하는 방법을 알아보겠습니다.

### UI 변경

먼저, UI에 작은 변화를 줘보겠습니다.

사용자 이름 라벨 위에 이미지를 렌더링해보겠습니다.

리액트 네이티브에서 이미지 컴포넌트를 임포트하고, 이미지를 추가합니다.

```jsx
import { useState } from "react";
import { View, Text, TextInput, Button, Image, StyleSheet } from "react-native";

export default function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Image
          source={require("../assets/images/adaptive-icon.png")}
          style={styles.image}
        />
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          value={username}
          onChangeText={setUsername}
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
        <Button title="Login" onPress={() => {}} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#f5f5f5",
  },
  form: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: "center",
    marginBottom: 50,
  },
});
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEi1uOtfPaQNXE5UO5CES0YfzYVNx8jUJ5pR4YX9Hpk8V2v2fMNlkpSFBGYQzSfgWjCRXSnGBNLtQ7KTLsUiPgoRUxC8VIpLq9rUOVcYfjwLY0uB6G3twudFnHpU6w8Dwob0eZoNu2HQqBabsXUgjqZTk9vSu5hGJfKkgmXLPRF_01Qk2hLAKHRSWG7pJQE)

이미지가 로그인 폼에 잘 나오고 있습니다.

이제 Command + Shift + K를 눌러 키보드를 눌러봅니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjRJ_SwZYXO6Y6oQJX7gqFVlwm0WgUgxxTLrq9I4sfKGBBB-8eZk9RI5nh2CAHPtkDjUkfouiv5UWcnmzRjV6rWzARskHwww3XiRaJ7RcswK4lFfrvp1dAXj4bqdPDRsgvD-AgYxPVeXEEYbabeZV7QFwMkYL3qIu6bH2JRCJcIrdP2iRXuWEWjqLQbTmM)

### 키보드 문제가 발생하는 이유

iOS 기기에서 비밀번호 필드를 탭하고 Command + Shift + K를 눌러 키보드를 불러오면 입력 요소가 키보드에 의해 가려지는 문제가 발생합니다.

이는 UX로 보면 상당히 좋지 않습니다.

다행히 리액트 네이티브에는 이를 해결할 수 있는 KeyboardAvoidingView 컴포넌트가 있습니다.

### KeyboardAvoidingView 사용

맨 바깥 컨테이너를 KeyboardAvoidingView로 교체하고, behavior 속성을 "padding"으로 설정합니다.

이 속성은 키보드 높이에 맞춰 컴포넌트의 패딩을 증가시킵니다.

```jsx
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";

export default function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
    >
      <View style={styles.form}>
        <Image
          source={require("../assets/images/adaptive-icon.png")}
          style={styles.image}
        />
        ...
        ...
      </View>
    </KeyboardAvoidingView>
  );
}
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEhqpe68Nel0VIfitfsqnXObtQWfeWnTZw3qPiD8uqh-H-xln0Ud698PiJWOiPpL4hKx0N6SOFPRHaFFLp9meG6LB5WeL8q2ll7Opmd-OIH8bCuRgALXu8-Dld19YYke2MhrwLZzSJ05DV77Q2ysUJVaT_fPkh9mhMGQtqgtvsbGDvRhC0ySI3J7m4yI1tE)

조금은 문제가 해결 된 듯 합니다.

### 문제 해결

이제 UI로 돌아가서 비밀번호 필드를 탭하면 폼이 위로 이동하여 입력 요소가 가려지지 않는 것을 확인할 수 있습니다.

하지만 이미지 높이를 400으로 설정하면 다시 입력 요소가 가려지는 문제가 발생합니다.

```js
  image: {
    width: 200,
    height: 400, // 400으로 강제로 크게 하면 화면이 가려짐.
    alignSelf: "center",
    marginBottom: 50,
  },
```

이를 해결하기 위해 keyboardVerticalOffset 속성을 100으로 설정합니다.


```jsx
<KeyboardAvoidingView
    style={styles.container}
    behavior="padding"
    keyboardVerticalOffset={100}
>
    ...
    ...
</KeyboardAvoidingView>
```

### 플랫폼별 해결 방법

Android 기기에서는 불필요한 공간이 생기는 문제가 발생할 수 있습니다.

이를 해결하기 위해 플랫폼별로 다른 offset 값을 적용합니다.

```jsx
import {
    ...
    ...
    KeyboardAvoidingView,
    Platform
} from "react-native";
~~~
~~~
~~~
<KeyboardAvoidingView
    style={styles.container}
    behavior="padding"
    keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
>
    ...
    ...
</KeyboardAvoidingView>
```

이렇게 하면 iOS와 안드로이드 모두에서 UI가 잘 동작하는 것을 확인할 수 있습니다.

KeyboardAvoidingView는 리액트 네이티브에서 까다로운 컴포넌트일 수 있지만, 오늘 다룬 기본 사항을 통해 문제를 해결할 수 있습니다.

---

## Form Validation

이번에는 폼 검증에 대해 알아보겠습니다.

이메일과 비밀번호 필드에 필수 항목 검증을 추가하여 사용자가 올바르게 입력했는지 확인해보겠습니다.

### 1단계: 에러 메시지 상태 변수 생성

우선, 사용자에게 에러 메시지를 표시할 방법이 필요합니다.

새로운 상태 변수를 생성하여 이러한 메시지를 저장합니다.

이 변수를 `errors`라고 하고, 초기값은 빈 객체로 설정합니다.

```jsx
export default function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

    ...
    ...

}
```

### 2단계: 폼 검증 함수 정의

`validateForm`이라는 함수를 정의합니다.

이 함수는 필드를 검사하고, 에러 메시지를 `errors` 객체에 추가하거나 모든 필드가 유효한 경우 true를 반환합니다.

```jsx
export default function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let errors = {};

    if (!username) errors.username = "Username is required";
    if (!password) errors.password = "Password is required";

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
    ...
    ...
    </KeyboardAvoidingView>
  )
}
```

### 3단계: 에러 메시지 표시

이제 JSX에서 에러 메시지를 표시합니다.

TextInput 바로 아래에 에러 메시지를 추가하고, 에러가 있는 경우 해당 메시지를 렌더링합니다.

에러 메시지의 스타일은 `styles.errorText`로 설정합니다.

```jsx
<TextInput
    style={styles.input}
    placeholder="Enter your username"
    value={username}
    onChangeText={setUsername}
/>
{errors.username ? (
    <Text style={styles.errorText}>{errors.username}</Text>
) : null}

<TextInput
    style={styles.input}
    placeholder="Enter your password"
    secureTextEntry={true}
    value={password}
    onChangeText={setPassword}
/>
{errors.password ? (
    <Text style={styles.errorText}>{errors.password}</Text>
) : null}
```

### 4단계: 에러 텍스트 스타일 정의

에러 텍스트의 스타일을 정의합니다.

텍스트 색상을 빨간색으로 설정하고, 아래쪽에 마진을 추가하여 메시지가 눈에 잘 띄도록 합니다.

```jsx
errorText: {
    color: "red",
    marginBottom: 10,
},
```

### 5단계: 폼 제출 처리

로그인 버튼을 클릭하면 `validateForm` 함수를 호출하여 폼을 검증합니다. 폼이 유효하면 폼 제출을 처리합니다.

```jsx
<Button title="Login" onPress={() => { if (validateForm()) { /* Handle form submission */ }}} />
```

이렇게 하면 간단하면서도 효과적인 폼 검증이 완성됩니다.

---

## Form Submission

### 1단계: handleSubmit 함수 정의

먼저, 새로운 함수 `handleSubmit`을 정의합니다.

이 함수 내에서 폼 검증 함수인 `validateForm`이 true를 반환하는지 확인합니다.

만약 폼이 유효하다면, 폼 값을 콘솔에 로그하고, 제출 메시지를 출력합니다.

또한, 폼 상태와 에러 메시지를 초기화합니다.

```jsx
export default function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let errors = {};

    if (!username) errors.username = "Username is required";
    if (!password) errors.password = "Password is required";

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log("Submitted", username, password);
      setUsername("");
      setPassword("");
      setErrors({});
    }
  };

...
...

};
```

### 2단계: 버튼에 제출 함수 연결

로그인 버튼의 `onPress` 이벤트에 `handleSubmit` 함수를 연결합니다.

```jsx
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      ...
      ...
        <Button title="Login" onPress={handleSubmit} />
      </View>
    </KeyboardAvoidingView>
  );
```

### 3단계: 폼 제출 테스트

이제 UI로 돌아가서 로그인 버튼을 클릭해보세요.

필드를 채우지 않고 클릭하면 에러 메시지가 표시됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhcl-nLE6fd2LCbLaZhhGkl7fROtxySUMP79J7L_t8dPPt03iJvMiOYVM2jJYflSpJUXKPYrrIqt4nJ8RAmfA8C96lNAb1AuoqYr3uawXuEVVMSvihWW6a2TUCohi69sM-MFxp0Le6T2HweIS4X9Rp3371fVMgc8shRTeEBVzmE4Jr8eUJ7DrgvG10GeIc)

![](https://blogger.googleusercontent.com/img/a/AVvXsEjfnifQYkPGQPUKPl8nBUnDMDkTXCci9qqapH3EhHtFv2qK1IBK59dVsq3kxx_CdRKwAIZMI6dFoKz-EMIHiw8mGDIZnY4uQyacVy-gD2WpgS7z0WKB5RvVSsz1J6oE5e5mTHBQZ-Ju3Zozt2BoeA0AvhL1O1LOu-4mbzSj32qFhNebpjPUTHNn8ngvLRg)

![](https://blogger.googleusercontent.com/img/a/AVvXsEjvtSbSRHSANMkXZFoqc45TNixFHUMcsUUANUwpp8u7JXefutveGU8VWNZrFtAxQOQhCtFzUL5kJ3qvbs8vWA9EIMn7djS7WE5J7mV7eBGGupafPRCIgpVF-kjxVNcoXU_eiM2_xNaYUJ_Yy8lUZWuWtkAMS0jI8WEyGeuy6QYw4gLOTmnVIe5A6etkA7Y)

필드를 채운 후 로그인 버튼을 클릭하면 에러 메시지가 사라지고, 폼 상태가 초기화되며, 폼 값이 콘솔에 로그됩니다.

```sh
 LOG  Submitted 1111 1111
 LOG  Submitted Test password
```

### 마무리

지금까지 리액트 네이티브에서 로그인 폼을 만들고, 상태를 관리하며, 검증을 추가하고, 폼을 제출하는 방법을 배웠습니다.
