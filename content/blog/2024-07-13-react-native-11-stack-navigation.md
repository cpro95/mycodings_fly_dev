---
slug: 2024-07-13-react-native-11-stack-navigation
title: 리액트 네이티브 강좌. 11편 - 스택 네비게이션과 화면 간 데이터 관리
date: 2024-07-13 05:57:14.833000+00:00
summary: React Navigation에서 스택 네비게이션을 설정하고, 화면 간 데이터 전송 및 옵션 커스터마이징 방법을 다룹니다. navigation prop과 useNavigation Hook 사용법, 화면 간 데이터 주고받기, 그리고 네비게이터 옵션을 다이나믹하게 변경하는 방법을 배워봅시다.
tags: ["react native", "navigation", "stack navigation"]
contributors: []
draft: false
---

안녕하세요!

리액트 네이티브 강좌 11편입니다.

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

- [리액트 네이티브 강좌. 11편 - 스택 네비게이션과 화면 간 데이터 관리](#리액트-네이티브-강좌-11편---스택-네비게이션과-화면-간-데이터-관리)
  - [네비게이션(Navigation)](#네비게이션navigation)
    - [예제 템플릿 구성](#예제-템플릿-구성)
  - [스택 네비게이션(Stack Navigation)](#스택-네비게이션stack-navigation)
  - [화면 간 이동하기](#화면-간-이동하기)
    - [1. `navigation` prop 사용하기](#1-navigation-prop-사용하기)
    - [2. `useNavigation` Hook 사용하기](#2-usenavigation-hook-사용하기)
    - [그럼 언제 뭘 사용해야 할까요?](#그럼-언제-뭘-사용해야-할까요)
  - [화면 사이에 데이터 주고받기](#화면-사이에-데이터-주고받기)
    - [기본 파라미터 값 설정하기](#기본-파라미터-값-설정하기)
    - [현재 화면에서 파라미터 업데이트하기](#현재-화면에서-파라미터-업데이트하기)
    - [이전 화면으로 데이터 다시 보내기](#이전-화면으로-데이터-다시-보내기)
  - [스택 네비게이션 옵션으로 앱 꾸미기!](#스택-네비게이션-옵션으로-앱-꾸미기)
    - [화면 제목 설정하기](#화면-제목-설정하기)
    - [헤더 스타일 지정하기](#헤더-스타일-지정하기)
    - [헤더 왼쪽/오른쪽에 커스텀 컴포넌트 추가하기](#헤더-왼쪽오른쪽에-커스텀-컴포넌트-추가하기)
    - [화면 콘텐츠 스타일 지정하기](#화면-콘텐츠-스타일-지정하기)
    - [모든 화면에 스타일 일괄 적용하기](#모든-화면에-스타일-일괄-적용하기)
  - [다이나믹하게 스택 네비게이터 옵션 변경하기](#다이나믹하게-스택-네비게이터-옵션-변경하기)
    - [1. `Stack.Screen` 컴포넌트에서 직접 설정하기](#1-stackscreen-컴포넌트에서-직접-설정하기)
    - [2. `useLayoutEffect` Hook 사용하기](#2-uselayouteffect-hook-사용하기)
    - [그럼 언제 뭘 사용해야 할까요?](#그럼-언제-뭘-사용해야-할까요-1)

---


## 네비게이션(Navigation)

이번에는 리액트 네이티브의 **네비게이션**에 대해서 본격적으로 알아보고자 합니다.

모바일 앱에서 네비게이션은 심장과도 같은 존재라고 할 수 있는데요.

사용자가 여러 화면을 넘나들고, 다양한 기능을 이용하고, 앱을 효과적으로 사용할 수 있도록 하는 중요한 장치입니다.

리액트 네이티브에서 네비게이션을 다루는 가장 흔한 방법은 바로 **리액트 네비게이션** 라이브러리를 사용하는 겁니다. 

참고로 엑스포는 자체적으로 라우팅 기능을 제공하지만, 엑스포 프로젝트에서만 사용할 수 있다는 제약이 있는데요.

반면에 리액트 네비게이션은 엑스포 유무와 상관없이 리액트 네이티브 앱에서 모두 사용할 수 있다는 장점이 있습니다!

그래서 우리는 여기서 리액트 네비게이션에 집중해 보겠습니다.

리액트 네비게이션은 스택, 드로어, 탭 네비게이터 등 다양한 네비게이터를 제공합니다.

스택 네비게이터는 새로운 화면이 스택 위에 쌓이는 방식으로 화면 전환을 구현하는 데 유용하고, 드로어 네비게이터는 화면 측면에서 열고 닫을 수 있는 네비게이션 드로어를 표시해 줍니다.

탭 네비게이터는 화면 하단에 위치하여 여러 라우트를 손쉽게 전환할 수 있도록 해 줍니다.

우리는 이 세 가지 네비게이터를 살펴보겠습니다.

### 예제 템플릿 구성

새로운 엑스포 프로젝트를 만들겠습니다.

```sh
npx create-expo-app RN-navigation
```

프로젝트 폴더가 준비되었다면 리액트 네비게이션을 사용하기 위해 필요한 라이브러리를 설치해야합니다.

리액트 네비게이션 공식 문서에 가면 설치 명령어를 확인할 수 있습니다.

그리고 `react-native-screens`와 `react-native-safe-area-context`라는 두 가지 라이브러리도 추가로 설치해야 합니다.

```sh
npm install @react-navigation/native

npm install react-native-screens react-native-safe-area-context
```

마지막으로 리액트 네비게이션을 사용하기 위해서는 앱 전체를 감싸는 `NavigationContainer` 컴포넌트가 필요합니다.

아래 코드를 복사한 후 `App.js` 파일에 붙여 넣어 주시면 됩니다.

```javascript
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    <NavigationContainer>
      {/* 여기에 네비게이션 관련 코드를 작성할 예정임! */}
    </NavigationContainer>
  );
}
```

이로써 코드 준비는 끝났습니다.

---

## 스택 네비게이션(Stack Navigation)

이제 리액트 네비게이션을 설치했으니 본격적으로 네비게이션의 기본 중의 기본, **스택 네비게이터**를 알아보도록 합시다!

스택 네비게이션은 아주 간단한 원리로 동작하는데요.

마치 카드 덱처럼 새로운 화면이 이전 화면 위에 차곡차곡 쌓이는 방식이죠.

새로운 화면으로 이동하면 카드 덱 위에 새로운 카드가 추가되고, 뒤로 가기를 하면 맨 위 카드가 사라지면서 이전 화면이 나타나는 겁니다.

이 방식은 많은 모바일 앱에서 흔히 볼 수 있는데, 사용자가 여러 단계를 거쳐 원하는 정보를 찾아 들어가고, 다시 원래 화면으로 돌아올 수 있도록 해줍니다.

특히 화면 흐름이 순 linear 형태로 이루어진 경우에 유용합니다.

예를 들어, 상품 목록을 보다가 특정 상품을 눌러 상세 정보를 확인하고, 거기에 있는 링크를 눌러 추가 정보를 보는 경우를 생각해 봅시다.

리액트 네비게이션 라이브러리는 스택 네비게이션을 위해 `Stack Navigator`와 `Native Stack Navigator` 두 가지를 제공합니다. 

- `Stack Navigator`는 자바스크립트 기반으로 동작하며, 사용자 정의가 매우 자유롭다는 장점이 있습니다. 앱에 독특한 네비게이션 경험을 구현하고 싶을 때 적합합니다. 하지만 반대로 성능 면에서는 `Native Stack Navigator`에 비해 떨어지는 측면이 있습니다. 
- `Native Stack Navigator`는 iOS와 안드로이드의 네이티브 네비게이션 기능을 활용하기 때문에 성능이 뛰어나고, 화면 전환이나 제스처가 훨씬 더 자연스럽다는 장점이 있습니다. 물론 `Stack Navigator`만큼 자유로운 커스터마이징이 어렵다는 단점도 있습니다.

이번에는 고급 커스터마이징보다는 **더 나은 성능과 자연스러운 화면 전환**에 초점을 맞출 거기 때문에 `Native Stack Navigator`를 사용할 예정입니다.

먼저 프로젝트에 `Native Stack Navigator` 라이브러리를 설치해야겠죠?

리액트 네비게이션 공식 문서의 네비게이터 섹션에서 Native Stack을 찾아 설치 명령어를 복사해 터미널에 붙여 넣고 실행하면 됩니다.

```bash
npm install @react-navigation/native-stack
```

다음으로 `App.js` 파일 맨 위에 `createNativeStackNavigator` 함수를 `@react-navigation/native-stack`에서 불러온 후, 이 함수를 호출하여 `Native Stack Navigator` 인스턴스를 생성해 줍니다.

```javascript
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  // ...
}
```

이제 앱 컴포넌트 안에 네비게이터를 설정해 보겠습니다.

`<NavigationContainer>` 안에 `<Stack.Navigator>`를 사용하고, 그 안에 `<Stack.Screen>`을 추가해 줍니다.

`<Stack.Screen>` 컴포넌트는 `name` prop과 `component` prop을 필수로 요구합니다.

`name` prop에는 화면의 이름을,  `component` prop에는 화면을 렌더링할 리액트 네이티브 컴포넌트를 지정하면 됩니다.

```javascript
// ...
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

먼저 `HomeScreen` 컴포넌트를 만들어 보겠습니다.

프로젝트 루트에 `screens` 폴더를 새로 만들고, 그 안에 `HomeScreen.js` 파일을 생성합니다.

그리고 아래처럼 "Home Screen"이라는 텍스트를 렌더링하는 간단한 리액트 네이티브 컴포넌트를 만들어 줍니다.

```javascript
// screens/HomeScreen.js
import { View, Text, StyleSheet } from 'react-native';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home Screen</Text>
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

export default HomeScreen;
```

`App.js` 파일로 돌아와서 `HomeScreen`을 import하고, `Stack.Screen`의 `component` prop에 할당해 줍니다.

```javascript
// App.js
// ... other imports
import HomeScreen from './screens/HomeScreen';

export default function App() {
  // ...
  <Stack.Screen name="Home" component={HomeScreen} />
  // ...
}
```

이제 애플리케이션에 첫 번째 화면이 생겼네요!

물론 화면이 하나뿐이면 네비게이션이 무슨 소용이 있겠습니까?

두 번째 화면도 만들어 봅시다.

`screens` 폴더에 `AboutScreen.js` 파일을 만들고, `HomeScreen.js` 파일의 내용을 복사해서 붙여 넣은 후, "Home"을 "About"으로 변경해 줍니다.

```javascript
// screens/AboutScreen.js
import { View, Text, StyleSheet } from 'react-native';

const AboutScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>About Screen</Text>
    </View>
  );
};

// ... (스타일은 HomeScreen과 동일)

export default AboutScreen;
```

다시 `App.js` 파일로 돌아와서 `<Stack.Screen>` 코드를 복사한 후, `name` prop을 "About"으로 변경하고, `component` prop에 `AboutScreen` 컴포넌트를 할당해 줍니다.

```javascript
// App.js
// ... other imports
import AboutScreen from './screens/AboutScreen';

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

기본적인 스택 네비게이터 설정이 완료되었습니다.

이제 터미널에서 `npm start` 명령어를 사용하여 앱을 실행해 보십시요.

`NavigationContainer` 에러가 뜨는데요.

다음과 같이 independent prop을 true로 설정하면 됩니다.

내비게이션 컨테이너가 다른 내비게이션 컨테이너와 상태를 공유하지 않도록 해야 할 때 사용하는 prop인데, 일단 여기서는 true로 설정하고 지나갑시다.

```js
<NavigationContainer independent={true}>
  <Stack.Navigator>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="About" component={AboutScreen} />
  </Stack.Navigator>
</NavigationContainer>
```

두 기기 모두 확인해 보면, 기본적으로 `HomeScreen`이 렌더링된 것을 볼 수 있을 겁니다.

상단에는 `Stack.Screen`의 `name` prop 값이 제목으로 표시된 헤더도 보이죠?

![](https://blogger.googleusercontent.com/img/a/AVvXsEhIGVGyKSGuJKVccGDsD5m3a025XAFnaVVaqgq_LGVwpupwl6oPi3FpUtKRxSS8_Yg6sOjp3mIFFYhKZD0a8fgbit1_zKKdz_Vgb3fAQG2170AqUXbXnZcbff3ju3JJrHdijXt9VqVp2bEA3V4S7J3wTIWUnGtvgXpgD7j5BCP_8aVjDcDu2haCExslx9A)

이 헤더는 플랫폼별로 구현 방식이 달라서 iOS에서는 가운데에, 안드로이드에서는 왼쪽에 "Home"이라는 텍스트가 표시됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiTjHMeXt2FQOKWJovuMQ70_qLKZfYP1w8R-XFTo8oJUs6uolrVEMvSs0mZW6A_-Z8W0kt6K-4Glmr-XmfiIl1Vq6VoxC31Z2KB721jClr_OFeXnPrqlrxmdOk_iKySYO9C_wbAbTY-mMOPVl1SpFxgVShSCi5Kh0znzRp4ui2m3XltMUhj0t6bBrtC9VE)

또한 라이브러리는 기본적으로 화면 상단의 노치 영역을 피해서 콘텐츠를 렌더링해 주기 때문에 안전 영역 뷰 안에 내용이 표시되는 것을 확인할 수 있습니다.

기본적으로 네비게이터 내에서 가장 위에 있는 화면이 초기 화면으로 표시되는데요, `<Stack.Navigator>`에 `initialRouteName` prop을 설정하여 이 동작을 변경할 수 있습니다.

`initialRouteName` prop을 "About"으로 설정하면 앱 실행 시 `AboutScreen`이 초기 화면으로 표시됩니다.

```javascript
// ...
      <Stack.Navigator initialRouteName="About">
// ...
```

파일을 저장하고 서버를 다시 시작하면 `AboutScreen`이 초기 화면으로 표시되는 것을 확인할 수 있을 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEg3sOZF2wOPsaIsaG89iNtiEdFz7ihpUZEe1WcqIo5kju85oEjw4WtgMD7M01ltV7-aOGrSy3nfOnWPIYppOL-K_n6kaUMZavsg2s8R9hTTk_SKMiRQF1oB5VOblZgjUNftw6zRvXKk2T5fwbHWCQJsFlGn6N46IX9GbaB9VBEySQ2obpjYUX3MQ3pDNEU)

---

## 화면 간 이동하기

이제 스택 네비게이터에 `Home`과 `About` 두 화면이 준비되었으니, 이 둘 사이를 어떻게 왔다 갔다 할 수 있는지 알아볼 시간입니다.

화면 간 이동을 다루는 주요 방법은 크게 두 가지가 있습니다.

바로 `navigation` prop을 사용하는 방법과 `useNavigation` Hook을 사용하는 방법인데요.

각 방법을 자세히 살펴보고 어떤 경우에 어떤 방법을 사용하는 것이 좋을지 알아보도록 합시다.

### 1. `navigation` prop 사용하기

리액트 네비게이션은 애플리케이션의 모든 화면 컴포넌트에 자동으로 `navigation` prop을 제공합니다.

`navigation` prop은 다양한 네비게이션 동작을 시작하는 데 사용할 수 있는 여러 메서드를 가지고 있는데, 그중에서도 `navigate` 메서드를 사용하면 다른 화면으로 이동할 수 있습니다.

자, 그럼 `HomeScreen`에서 `AboutScreen`으로 이동하는 방법을 예제 코드와 함께 살펴볼까요?

먼저 파일 상단에 `react-native`에서 `Button` 컴포넌트를 import 합시다.

그리고 텍스트 요소 아래에 `Button` 컴포넌트를 추가하고, `title` prop에는 "Go to About"을, `onPress` prop에는 `AboutScreen`으로 이동하는 함수를 지정해 줍니다.

`onPress` 함수 안에서는 `HomeScreen`의 `navigation` prop을 비구조화 할당을 사용하여 가져온 후,  `navigation.navigate()` 메서드를 호출하여 `About` 화면으로 이동하도록 합니다.

`navigation.navigate()` 메서드의 인자로는 이동하고자 하는 화면의 이름을 전달하면 됩니다.

화면의 이름은 `App.js` 파일의 `Stack.Screen` 컴포넌트의 `name` prop에 설정한 값과 동일해야 합니다.

```javascript
// screens/HomeScreen.js
import { View, Text, StyleSheet, Button } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home Screen</Text>
      <Button title="Go to About" onPress={() => navigation.navigate('About')} />
    </View>
  );
};

// ... (스타일은 이전과 동일)

export default HomeScreen;
```

`App.js` 파일에서 `initialRouteName`을 `Home`으로 변경하고 파일을 저장한 후, 앱을 다시 시작해 보면, iOS와 안드로이드 모두에서 "Go to About" 버튼이 잘 나타날겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEheCX5drgT9o-maL8iUEmMBEgB0rW0sC9MZCSwK9UyxyOXlYEV6FlZw8LuNVAfJJ-48L7OH_hmDXrm6OEVad-1JDv5NKzHgOsjUQvjOvRc-6wiTyBogJZI4f3jdTo7ooXvyzJtB8G92fqnJRm0sjDcJVDBvK0rZ_aOHg0QlnV9uiCManrFDnpb_NOBXZtE)

버튼을 누르면 `AboutScreen`으로 이동하는 것을 확인할 수 있죠.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjkEpM8UYHOYqvdqE6S1Uxip9D2Cm2NcbNzO3ALK2jNP7ms6ejUm-UhhhlILc-ToaopUcYkIlm8mcWFUWu_Y_R5ILs1_5MGu7RQsCUC_w50b8eDTcOZSLscjg0_5zTW2pRhCFQ4JCbv_nUdlvcS3A-amDStyMOJ0awPXwANB5dnmnAQsaTgV8-7ecb0AzM)

![](https://blogger.googleusercontent.com/img/a/AVvXsEiubaGwZM844qfBRT9InCe4rkXLUeXgHzbIjHcqeSK1-fcWItgv-RXPU07sqE1XSBX6d_Jf9Pw4xntDN84nepTHQmm7RxAgmF3xwgOfMdwMOLALQ9xseAnjJjGm-AdN4SyIp34Jv_Ys2k3EEDc30_MSuP-xI44m1U3gLWgeAI7nCtTCYVPuD6qINkBHV0I)

상단 왼쪽을 보면 어디서 이동해 왔는지 예전 스크린을 보여주고 있습니다.

### 2. `useNavigation` Hook 사용하기

훅을 선호한다면 리액트 네비게이션에서 제공하는 `useNavigation` Hook을 사용할 수도 있습니다.

파일 상단에 `useNavigation` Hook을 import하고, 컴포넌트 안에서 호출하여 `navigation` 객체를 얻어옵니다.

```javascript
// screens/HomeScreen.js
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation(); // navigation 객체 얻기

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home Screen</Text>
      <Button title="Go to About" onPress={() => navigation.navigate('About')} />
    </View>
  );
};

// ... (나머지 코드는 동일)
```

`navigation` prop을 사용했을 때와 마찬가지로, `navigation.navigate('About')` 코드를 사용하여 `AboutScreen`으로 이동할 수 있습니다.

앱을 다시 시작해보면 동작 방식은 동일하게 유지되는 것을 확인할 수 있을 겁니다.

### 그럼 언제 뭘 사용해야 할까요?

- `navigation` prop은 사용하기 쉽고 추가 import가 필요하지 않다는 장점이 있습니다. 특히 화면 컴포넌트 내에서 사용할 때 편리합니다. 
- `useNavigation` Hook은 화면 컴포넌트뿐만 아니라 어떤 컴포넌트에서든 사용할 수 있기 때문에 훨씬 유연합니다. 중첩된 컴포넌트를 사용하거나 네비게이션 기능이 필요한 유틸리티 컴포넌트를 만들 때 유용하게 활용할 수 있습니다.

따라서 **화면 컴포넌트에서는 `navigation` prop을 사용하고, 꼭 필요한 경우에만 `useNavigation` Hook을 사용하는 것을 추천**합니다.

다시 UI로 돌아와서 `HomeScreen`에서 `AboutScreen`으로 이동할 때, 리액트 네비게이션이 `HomeScreen`을 스택에 유지하면서 그 위에 `AboutScreen`을 추가하는 것을 확인할 수 있을 겁니다.

뒤로 가기 버튼을 누르면 스택의 맨 위 화면이 사라지면서 `HomeScreen`으로 돌아가는데, 이는 스택 네비게이션의 "Last In, First Out" 원칙 때문입니다.

이러한 스택 방식은 앱 내에서 자연스러운 네비게이션 흐름을 만들어 주어 사용자가 새로운 화면으로 이동하거나 이전 화면으로 손쉽게 돌아갈 수 있도록 해줍니다.

이제 `AboutScreen`에도 `HomeScreen`으로 이동하는 버튼을 추가할 수 있을 겁니다.

---

## 화면 사이에 데이터 주고받기

이전에 화면 간 이동하는 방법을 배웠는데, 이번에는 이동하면서 데이터까지 함께 전달하는 방법을 알아보겠습니다.

바로 코드를 보면서 예제와 함께 알아보는 게 좋겠습니다.

`Home` 화면에서 `About` 화면으로 `name`이라는 파라미터를 전달하고, `About` 화면에서 해당 값을 렌더링해 보도록 하겠습니다.

`navigation.navigate` 메서드 기억하시죠? 화면 이동할 때 사용했던 메서드인데, 사실 이 녀석은 두 번째 인자로 **route 파라미터 객체**를 받을 수 있습니다.

이 객체에 새로운 화면으로 전달하고 싶은 데이터를 담아 보낼 수 있습니다.

```javascript
// screens/HomeScreen.js
// ... (이전 코드와 동일)

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home Screen</Text>
      <Button
        title="Go to About"
        onPress={() =>
          navigation.navigate('About', { name: 'test' }) // name 파라미터 추가!
        }
      />
    </View>
  );
};

// ... (나머지 코드는 동일)
```

이제 `About` 화면에서는 `route` prop을 사용하여 전달받은 파라미터에 접근할 수 있습니다.

모든 화면 컴포넌트에 `route` prop이 제공되니 꼭 기억하시기 바랍니다.

```javascript
// screens/AboutScreen.js
// ... (이전 코드와 동일)

const AboutScreen = ({ route }) => { // route prop 추가!
  const { name } = route.params; // name 파라미터 받기

  return (
    <View style={styles.container}>
      <Text style={styles.text}>About {name}</Text> // name 값 표시
    </View>
  );
};

// ... (나머지 코드는 동일)
```

이제 파일을 저장하고 앱을 실행한 후, `About` 화면으로 이동해 봅시다.

"About test"라는 텍스트가 보이시나요?

이렇게 화면 간에 데이터를 전달할 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiViiPrUwJUIzu9iczUxng8oBnND2x0WbCi9YaBuKJ3kayhS6YQESsWLszXc_rAMlyZGA0Cg6ddkW96NWD49981d-WpYoEIzfICtIOgEVgzu9J9EOhog_azImg6FN3OQXhrJAAEmUV55HZ61Phqh41StypS9GS0gi4EGpdibdxjkJ_8owbE2Bwd6RDVAQo)

### 기본 파라미터 값 설정하기

`App.js` 파일의 `About` 화면 설정에서 `initialParams` prop을 사용하여 기본 파라미터 값을 설정할 수도 있습니다.

```javascript
// App.js
// ... (이전 코드와 동일)

<Stack.Screen name="About" component={AboutScreen} initialParams={{ name: 'Guest' }} /> 
// name 파라미터 기본값 설정

// ... (나머지 코드는 동일)
```

이제 `HomeScreen`에서 `About` 화면으로 이동할 때 `name` 파라미터를 전달하지 않으면, 기본값으로 설정한 "Guest"가 표시될 겁니다.

### 현재 화면에서 파라미터 업데이트하기

`navigation` prop을 사용하여 현재 화면에서 파라미터를 업데이트할 수도 있습니다.

`About` 화면에 버튼을 하나 추가하고, 버튼을 누르면 `navigation.setParams` 메서드를 사용하여 `name` 파라미터 값을 변경해 보도록 하겠습니다.

```javascript
// screens/AboutScreen.js
// ... (이전 코드와 동일)

const AboutScreen = ({ route, navigation }) => { // navigation prop 추가!
  const { name } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>About {name}</Text>
      <Button
        title="Update the name"
        onPress={() => navigation.setParams({ name: '테스트' })} // 이름 업데이트!
      />
    </View>
  );
};

// ... (나머지 코드는 동일)
```

앱을 다시 시작하고 `About` 화면으로 이동한 후, "Update the name" 버튼을 눌러 봅시다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiNhyFwYxxW0LUn-FXq9v-WPKurJhjYRmBBIp6kPmtLlXl2fhXoUSA5RC0KtlNnOpKIZN6cHODbpjoDNMhg_rbhGXLgsTOGES7cjDBYNvyKOQdvENcGiXte1vw7RyQfYbR-kQe3sE7LL7VZClsWhzxaDhwWeN4GyDMFIWcAPsGnw9uOO6pYyTtIQhUljb8)


텍스트가 변경되는 것을 확인할 수 있을 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEi8YgtjSy2lK1QcogujjpAfQgEzZlUAYiBk7P0ZMU6a5w90HC6UhvD8Rmt-XL1JH7gQPqDRIo1wO8oLkUM2vub8iAobhHZaCS7B9KzjZD4bqg8Lew-5F-lmG-2OBYG2Dvp0X2sA8PB1N7X4IbE2Afcqgb20Ios0au09Od9ZddyfTR0rpNDdvguC1Cqc_zo)


### 이전 화면으로 데이터 다시 보내기

이전 화면으로 데이터를 다시 보내는 것도 동일한 방식으로 할 수 있습니다.

`About` 화면에서 `HomeScreen`으로 돌아갈 때 데이터를 함께 전달해 보도록 할게요.

```javascript
// screens/AboutScreen.js
// ... (이전 코드와 동일)

      <Button
        title="Update the name"
        onPress={() => navigation.setParams({ name: "테스트" })}
      />
      <Button
        title="Go back with data"
        onPress={() =>
          navigation.navigate("Home", { result: "About에서 간 데이터" })
        }
      />
// ... (나머지 코드는 동일)
```

`HomeScreen`에서는 `route` prop을 사용하여 전달받은 데이터를 렌더링할 수 있어요.

```javascript
// screens/HomeScreen.js
// ... (이전 코드와 동일)

const HomeScreen = ({ navigation, route }) => { // route prop 추가!
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home Screen</Text>
      <Text style={styles.text}>{route.params?.result}</Text> // 전달받은 데이터 표시
      <Button
        title="Go to About"
        onPress={() =>
          navigation.navigate('About', { name: 'test' })
        }
      />
    </View>
  );
};

// ... (나머지 코드는 동일)
```

"Go back with data" 버튼을 누르면 "About에서 간 데이터" 텍스트가 `HomeScreen`에 표시되는 것을 확인할 수 있을 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEh10tATEyuAAIF_APpseGDyg0Qjmw0XOLOGBkG6-UqlB8K_VwxC4Z9n0_8oeWXMuC8zyvCZupFCDxrdFHsNLfpvTnL_v1qJi5sXDQgkJaPt4Ablosoi89tgH3hBbEbmCIiPOv-Vydk8u73WyQ9NXH_RBDmlw1uFhyAxrRYc18RblX6QCsV-cFhqfD6fJdQ)

![](https://blogger.googleusercontent.com/img/a/AVvXsEiUFo0eCBJ7YqyevK8RZY3HYf4Hh1LZ12FFQZQeCF2k9Qi8VMl-AOpjGGzx4t137ZAtUIsD2a31V_1DjzVUD6fUL3MiQKn7zjqH-7YfMtp0AbrnEHYA3oOVbsYP3k3R-mXM_kPVSG_06wjLFR_RfKWacPolEaaxjJ0RPpXhKXWrCFZ-14jL9_M7kF_wa0E)

리액트 네비게이션의 파라미터 처리는 화면 간에 데이터를 주고받는 간편하고 효율적인 방법을 제공합니다.

이를 통해 네비게이션 구조를 훨씬 동적이고 사용자 상호 작용에 반응하도록 만들 수 있죠.

---

## 스택 네비게이션 옵션으로 앱 꾸미기!

기본적인 네비게이션에 익숙해졌으니, 이제 스택 네비게이터가 제공하는 다양한 옵션들을 활용해서 앱을 더욱 멋지게 꾸며볼까 합니다.

이번에는 화면 제목 설정, 헤더 스타일 지정, 콘텐츠 스타일 설정까지 꼼꼼하게 알아보겠습니다.

### 화면 제목 설정하기

스택에 있는 모든 화면은 헤더에 제목을 표시할 수 있습니다.

사용자가 앱 내에서 현재 어느 위치에 있는지 쉽게 알 수 있도록 도와주는 역할을 합니다.

기본적으로 `Screen` 컴포넌트의 `name` prop이 화면 제목으로 표시되는데, 예를 들어 현재 앱에서는 "Home"과 "About"이라고 표시되고 있습니다.

하지만 `title` 옵션을 사용하면 얼마든지 원하는 대로 제목을 바꿀 수 있습니다.

```javascript
  <Stack.Screen
    name="Home"
    component={HomeScreen}
    options={{
      title: "Welcome Home!",
    }}
  />
```

이제 앱을 실행해 보면 `HomeScreen`의 제목이 "Welcome Home!"으로 변경된 것을 확인할 수 있을 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEizDWFnQ0uAzgMSJwywMY-QppIby2lXROLuoRB5B5dk5y_JGpewulP7pwvLsTtmjy8dmwUu_4zZVu6uHJzUKc02g28cK3N1UHjbV9jt-RIV_Wpj5jTaEut_hCEFn5Rku_xIHvsLriq5CfTa9zjiEhv8t5sc6prxuQ5zbuka3Pt5ecv8EEbNF-C3HqBkVVo)

### 헤더 스타일 지정하기

앱 테마에 맞춰서 헤더 스타일을 변경하고 싶을 때도 있는데요.

배경색, 텍스트 색상, 글꼴 두께 등 다양한 속성을 조정하여 헤더를 원하는 대로 꾸밀 수 있습니다.

`headerStyle` 옵션을 사용하면 됩니다!

```javascript
<Stack.Screen
  name="Home"
  component={HomeScreen}
  options={{
    title: "Welcome Home!",
    headerStyle: {
      // 헤더 스타일 지정!
      backgroundColor: "#6a51ae", // 배경색 변경
    },
    headerTintColor: "fff",
    headerTitleStyle: {
      // 제목 스타일 지정!
      fontWeight: "bold", // 글꼴 두께 변경
    },
  }}
/>
```

이제 앱을 실행해 보면 헤더 배경색이 보라색으로, 텍스트 색상은 흰색으로, 글꼴 두께는 굵게 변경된 것을 확인할 수 있을 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgj6Jz0VXjUWIH3EaxGiApHjLEoz30FZZRwNiJz34x7JbWN88tOMYYNGRt_95HYTxti68Sfza5IRms8FOr5etPf-WyRYI4UHCzhZbTQnKsFRwwn82lYfH4NdWstmU_cA6sI3ckJCItGClMVxAKAuSCEL_nz4aq_6uQpRzelgP4krPh5M02kSbpwnOKxiiE)

### 헤더 왼쪽/오른쪽에 커스텀 컴포넌트 추가하기

`headerLeft`와 `headerRight` 옵션을 사용하면 헤더의 왼쪽과 오른쪽에 커스텀 컴포넌트를 추가할 수도 있습니다.

예를 들어, 오른쪽에 간단한 메뉴 버튼을 추가해 볼까요?

```javascript
<Stack.Screen
  name="Home"
  component={HomeScreen}
  options={{
    title: "Welcome Home!",
    headerStyle: {
      // 헤더 스타일 지정!
      backgroundColor: "#6a51ae", // 배경색 변경
    },
    headerTintColor: "fff",
    headerTitleStyle: {
      // 제목 스타일 지정!
      fontWeight: "bold", // 글꼴 두께 변경
    },
    headerRight: () => (
      // 오른쪽에 버튼 추가!
      <Pressable onPress={() => alert("Menu button pressed!")}>
        <Text style={{ color: "#fff", fontSize: 16 }}>Menu</Text>
      </Pressable>
    ),
  }}
/>
```

이제 앱을 실행해 보면 헤더 오른쪽에 "Menu" 버튼이 생긴 것을 확인할 수 있을 겁니다.

버튼을 누르면 "Menu button pressed!"라는 알림창이 나타납니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjBJHSMuWiB1a30HMOVnTHyr_jygFjnm0LF3bNWXPxsTpQSbZP83hoF33UVlEa1LEiKHswa5tKbk5Uc_EjXKeCrg71R-mg_AKm5M7m-MkRPWZ0aQGsV6fMRB__87nXxDPTygfhWvCRKvdIZVb72EHxkeokF4OFU3J_p7xbSLH7db9-RhN-e1CTSQFG1dA4)

`headerLeft` 옵션도 동일한 방식으로 사용할 수 있습니다.

### 화면 콘텐츠 스타일 지정하기

`contentStyle` 옵션을 사용하면 화면 콘텐츠의 스타일을 지정할 수도 있습니다.

예를 들어, 배경색을 변경해 볼까요?

```javascript
<Stack.Screen
  name="Home"
  component={HomeScreen}
  options={{
    title: "Welcome Home!",
    headerStyle: {
      // 헤더 스타일 지정!
      backgroundColor: "#6a51ae", // 배경색 변경
    },
    headerTintColor: "fff",
    headerTitleStyle: {
      // 제목 스타일 지정!
      fontWeight: "bold", // 글꼴 두께 변경
    },
    headerRight: () => (
      // 오른쪽에 버튼 추가!
      <Pressable onPress={() => alert("Menu button pressed!")}>
        <Text style={{ color: "#fff", fontSize: 16 }}>Menu</Text>
      </Pressable>
    ),
    contentStyle: {
      backgroundColor: "#e8e4f3", // 배경색 변경
    },
  }}
/>
```

이제 앱을 실행해 보면 `HomeScreen`의 배경색이 연한 회색으로 변경된 것을 확인할 수 있을 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEh7QX9ozg14UEyPtmR1CAkx5GRKQCBo7NGlpb8QqeBXQLNeXafEdl-TRl4G4eJNBRc8q3cIzDE1Ca8ttbXTEm0SwANzEBPruqFu0HGEiuBnyarZCwwDCrg4I8qci_52KP13IH7As76IZGc_XMwZQFe6jjDF_Weym9LIcEMF4rZipHVbEusQaE7vEXGwWhU)

### 모든 화면에 스타일 일괄 적용하기

지금까지 설정한 옵션들은 모두 화면별로 적용되는데요, 스택 내의 모든 화면에 동일한 스타일을 적용하고 싶다면 `Stack.Navigator` 컴포넌트의 `screenOptions` prop을 사용하면 됩니다. 

```javascript
// App.js
<NavigationContainer independent={true}>
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        // 헤더 스타일 지정!
        backgroundColor: "#6a51ae", // 배경색 변경
      },
      headerTintColor: "fff",
      headerTitleStyle: {
        // 제목 스타일 지정!
        fontWeight: "bold", // 글꼴 두께 변경
      },
      headerRight: () => (
        // 오른쪽에 버튼 추가!
        <Pressable onPress={() => alert("Menu button pressed!")}>
          <Text style={{ color: "#fff", fontSize: 16 }}>Menu</Text>
        </Pressable>
      ),
      contentStyle: {
        backgroundColor: "#e8e4f3",
      },
    }}
  >
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={{
        title: "Welcome Home!",
      }}
    />
    <Stack.Screen
      name="About"
      component={AboutScreen}
      initialParams={{ name: "Guest" }}
    />
  </Stack.Navigator>
</NavigationContainer>
```
위 코드를 보시면 `Stack.Screen` 컴포넌트 안에 있던 options 항목을 그대로 `Stack.Navigator` 컴포넌트 안의 screenOptions 항목으로 옮긴겁니다.

`screenOptions` prop에 지정한 스타일은 모든 화면에 공통으로 적용되고, 각 화면에서 개별적으로 설정한 옵션들은 공통 옵션을 덮어씌웁니다.

이제 앱을 실행해 보면 `HomeScreen`과 `AboutScreen` 모두 동일한 스타일이 적용된 것을 확인할 수 있을 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiZ-P9E8cd9B1hP8SGYXJs78KueSpgNlWmJxM4wcvD3pdAO5dAJ7ZqrnU0w0wRUD83aVk43_5YWzkw7gwCWu2rNRxPviS56x2UlQs5dhI0m_MdjBXxtgQCbooynbQs88QXsrQtrGGzVexkh_WfxJUfZdTr0mUs9WRWySC2i05NMTMsr7a7EWQ8xYuMvWf0)

---

## 다이나믹하게 스택 네비게이터 옵션 변경하기

이전에 `HomeScreen`의 제목, 헤더 배경색, 콘텐츠 배경색 등 스택 네비게이터에서 제공하는 다양한 옵션들을 설정하는 방법을 알아봤는데요.

하지만 상황에 따라 옵션을 동적으로 설정해야 할 때가 있습니다.

대표적인 예로 화면 제목을 들 수 있습니다.

"About"처럼 고정된 제목 대신 파라미터로 전달받은 사용자 이름을 표시하는 등 좀 더 개인화된 제목을 만들고 싶을 때가 있을 건데요.

이제 이걸 알아보겠습니다.

### 1. `Stack.Screen` 컴포넌트에서 직접 설정하기

헤더 제목을 동적으로 설정하는 한 가지 방법은 `Stack.Screen` 컴포넌트에서 `options` prop에 함수를 전달하는 겁니다.

```javascript
<Stack.Screen
  name="About"
  component={AboutScreen}
  initialParams={{ name: "Guest" }}
  options={({ route }) => ({
    title: route.params.name,
  })}
/>
```

`options` prop에 함수를 전달하면, 이 함수는 `route` prop을 인자로 받아서 객체를 반환해야 합니다.

이 객체 안에 원하는 옵션을 설정하면 되는 거죠.

위 코드에서는 `route.params.name` 값을 사용하여 제목을 동적으로 설정하고 있습니다.

`HomeScreen.js` 파일에서 `About` 화면으로 이동할 때 `name` 파라미터를 전달하는 코드를 추가하겠습니다.

```javascript
// screens/HomeScreen.js
// ... (이전 코드와 동일)

<Button
  title="Go to About"
  onPress={() =>
    navigation.navigate('About', { name: 'React' }) // name 파라미터 전달
  }
/>
// ... (나머지 코드는 동일)
```

`About` 화면의 제목이 전달된 `name` 값이 'React'로 설정된 것을 확인할 수 있을 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgHxLdLUsJ-nUREgiw0DHI7LSTDgrwplGnaUOES_oEMMYOGhGa6cBDfcLCawv72SnW9-UKElBBAessCV4pX5peN8pc-kr6LN4EpFLKhu8ZRetfNVIZXpe9l7BUOp9HEcvk09OVKqbx9XbgURBI1dG3qCbJjIjX7dqbFM9P7b7Cw-5pjCYYhCV8Pzbc2HEk)

### 2. `useLayoutEffect` Hook 사용하기

`useLayoutEffect` Hook을 사용하여 동적으로 제목을 설정할 수도 있습니다.

`Stack.Screen` 컴포넌트에서 `options` prop을 주석 처리하고, `useLayoutEffect` Hook을 사용하도록 코드를 변경해 볼게요.

```js
<Stack.Screen
  name="About"
  component={AboutScreen}
  initialParams={{ name: "Guest" }}
  // options={({ route }) => ({
  //   title: route.params.name,
  // })}
/>
```

```javascript
// screens/AboutScreen.js
// ... (이전 코드와 동일)

import { useLayoutEffect } from 'react'; // useLayoutEffect Hook import

const AboutScreen = ({ route, navigation }) => {
  const { name } = route.params;

  useLayoutEffect(() => { // useLayoutEffect Hook 사용!
    navigation.setOptions({ // 옵션 설정
      title: name,
    });
  }, [navigation, name]); // navigation과 name이 변경될 때마다 실행

  // ... (나머지 코드는 동일)
};

export default AboutScreen;
```

`useLayoutEffect` Hook은 컴포넌트가 렌더링된 직후에 실행되기 때문에, 화면이 표시되기 전에 제목을 설정할 수 있습니다.

`navigation.setOptions` 메서드를 사용하여 옵션 객체를 전달하면 되고, 이 객체 안에 원하는 옵션을 설정하면 됩니다.

위 코드에서는 `name` 변수 값을 사용하여 제목을 동적으로 설정하고 있습니다.

`useLayoutEffect` Hook의 두 번째 인자로는 의존성 배열을 전달하는데, 이 배열 안에 포함된 값이 변경될 때마다 `useLayoutEffect` Hook 내부의 코드가 다시 실행됩니다.

위 코드에서는 `navigation`과 `name`이 변경될 때마다 제목이 업데이트되도록 설정했습니다.

앱을 실행하고 `About` 화면으로 이동해 보면, `useLayoutEffect` Hook을 사용했을 때도 제목이 정상적으로 설정되는 것을 확인할 수 있을 겁니다.

### 그럼 언제 뭘 사용해야 할까요?

- `Stack.Screen` 컴포넌트의 `options` prop은 제목이나 네비게이션 옵션이 라우트 파라미터에 의해 결정되거나 고정적인 경우에 사용하는 것이 좋습니다.
- `useLayoutEffect` Hook은 네비게이션 옵션이 화면 컴포넌트의 내부 로직, 상태 또는 prop에 의존하거나 렌더링 이후에 업데이트되어야 하는 경우에 사용하는 것이 좋습니다.

