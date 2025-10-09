---
slug: 2024-06-08-react-native-tutorial-3-styling-guide-stylesheets-box-model-shadows-inheritance
title: 리액트 네이티브 강좌. 3편 - 스타일링 - 스타일시트, 박스 모델, 그림자, 그리고 상속
date: 2024-06-08 06:28:20.749000+00:00
summary: React Native 스타일링입니다. StyleSheet API를 사용한 스타일 정의, 여러 스타일 적용, 박스 모델 속성, 그림자 및 Elevation 설정, 스타일 상속 등을 포괄적으로 설명합니다. 이 글을 통해 React Native에서 효과적인 스타일링 방법을 배우고, 웹과의 차이점을 이해할 수 있습니다.
tags: ["react native", "styling", "stylesheet", "shadow", "inheritance"]
contributors: []
draft: false
---

안녕하십니까?

리액트 네이티브 강좌 3편입니다.

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

- [리액트 네이티브 강좌. 3편 - 스타일링 - 스타일시트, 박스 모델, 그림자, 그리고 상속](#리액트-네이티브-강좌-3편---스타일링---스타일시트-박스-모델-그림자-그리고-상속)
  - [스타일링(Styling)](#스타일링styling)
  - [StyleSheet API](#stylesheet-api)
  - [여러 스타일 적용하기](#여러-스타일-적용하기)
  - [박스 모델](#박스-모델)
  - [그림자와 Elevation](#그림자와-elevation)
  - [스타일 상속](#스타일-상속)

---

## 스타일링(Styling)

이번에는 React Native에서의 스타일링에 대해 깊이 있게 다뤄보겠습니다.

React Native 앱의 스타일링은 웹 앱의 스타일링과 비슷하지만 몇 가지 중요한 차이점이 있습니다.

가장 눈에 띄는 차이점은 React Native에서는 스타일링에 CSS를 사용하지 않는다는 점입니다.

대신, 자바스크립트를 사용하여 앱의 스타일을 지정합니다.

스타일 이름과 값은 웹의 CSS와 유사하지만 약간의 차이가 있습니다.

예를 들어, 스타일 이름은 `background-color` 대신 `backgroundColor`처럼 camel case로 작성됩니다.

React Native 컴포넌트를 스타일링하는 방법에는 두 가지 접근 방법이 있습니다.

첫 번째 방법은 대부분의 주요 컴포넌트에서 받아들이는 style prop을 사용하는 인라인 스타일입니다.

이 방법은 지금까지 우리가 사용한 방법입니다.

여기서는 style prop의 값으로 일반 자바스크립트 객체를 지정했습니다.

두 번째 방법은 React Native에서 제공하는 StyleSheet API를 활용하는 것입니다.

이 API를 사용하면 create 메소드를 통해 여러 스타일을 한 곳에 정의할 수 있습니다.

---

## StyleSheet API

새로 Expo 프로젝트를 만들어도 되지만 빈 **App.js** 파일만으로도 테스트 준비는 끝납니다.

먼저 텍스트를 렌더링할 컴포넌트를 빠르게 만들어 보겠습니다.

상단에 **View**와 **Text** 컴포넌트를 React Native에서 import합니다. 

다음으로 **App**이라는 함수를 기본 내보내기(default export)합니다.

이 함수는 **View**를 반환하며, **Text** 컴포넌트는 "StyleSheet API"라는 텍스트를 가집니다.

**View** 컴포넌트에 **style** prop을 추가하여 flex를 1로 설정해 전체 가용 공간을 차지하게 하고, 배경 색상과 패딩을 지정합니다.

```jsx
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
    return (
        <View style={{ flex: 1, backgroundColor: 'lightblue', padding: 60 }}>
            <Text>StyleSheet API</Text>
        </View>
    );
}
```

파일을 저장하고 기기를 확인해보면 예상한 UI를 볼 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjWhHJCYPD7BCWFl5VrZHM_7QDe5A3DXlNDNf2_CFoD-yCywHLUCyfh1xFVC2aQ8T6WqjwZ3Mu0uoIJ8QspR9yLll_rsSzQhs0heqd4Djsr4nZ809Tkrm7oQphPHE7sclkXpbwv1ZJTOxXpqu1LV8OLgGBnBFP08Nm3G2xSK6SMg_bqEfQxHPJcpH31WoY)

이 방식은 인라인 스타일링이라고 하며, 지금까지 사용한 방법입니다.

인라인 스타일도 잘 작동하지만, React Native에서는 권장하는 접근 방식이 아닙니다.

실제로 다른 분들의 코드베이스에서 인라인 스타일을 찾기란 드뭅니다.

권장하는 방법은 StyleSheet API를 사용하는 겁니다.

인라인 스타일을 대체하는 방법을 알아보겠습니다.

먼저 React Native에서 StyleSheet API를 import합니다. 

다음으로 App 컴포넌트 아래에서 StyleSheet API의 create 메소드를 호출합니다.

반환된 값을 **styles**라는 상수에 할당합니다.

create 메소드의 인수로 키-값(key-value) 쌍을 포함하는 객체를 제공합니다.

키 이름은 자유롭게 정할 수 있지만, 의미를 부여하는 것이 좋습니다.

예를 들면 **container**로 제한하겠습니다.

값은 CSS 속성과 값과 유사한 키-값 쌍을 포함하는 객체여야 합니다.

여기서는 style prop에서 스타일을 추출해 container 키에 할당할 수 있습니다.

```javascript
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
    return (
        <View style={styles.container}>
            <Text>StyleSheet API</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'lightblue',
        padding: 60,
    },
});
```

이제 **View** 컴포넌트의 style prop에 **styles.container**를 지정합니다.

파일을 저장하면 이전과 동일한 UI가 표시되지만, 이번에는 StyleSheet API를 사용하여 컴포넌트를 스타일링했습니다.

그렇다면 왜 StyleSheet API를 인라인 스타일보다 선택해야 할까요?

몇 가지 이유가 있습니다.

첫째, 스타일을 렌더 함수에서 분리하면 코드가 더 읽기 쉽고 이해하기 쉬워집니다.

둘째, 스타일에 이름을 지정하면 렌더 함수의 저수준 컴포넌트에 의미를 부여할 수 있습니다.

예를 들어, title 스타일을 만들어 **Text** 컴포넌트에 **styles.title**로 지정할 수 있습니다.

이는 뷰가 컨테이너를 나타내고 텍스트가 화면의 제목을 나타낸다는 것을 명확히 합니다.

마지막으로, 이렇게 스타일을 구성하면 코드의 재사용성이 높아지고 유지 관리가 쉬워집니다.

여러 텍스트 컴포넌트에 동일한 인라인 스타일이 있는 경우 폰트 크기를 변경해야 한다면 각 컴포넌트의 스타일을 개별적으로 업데이트해야 합니다.

그러나 StyleSheet API를 사용해 스타일을 그룹화하면 한 번만 변경해도 업데이트된 title 스타일이 모든 컴포넌트에 반영됩니다.

또한 이러한 스타일은 동일한 파일 내에서만 사용할 수 있다는 점도 중요합니다.

그러나 별도의 글로벌 스타일 파일을 만들어 스타일 객체를 내보내고, 코드베이스의 모든 파일에서 사용할 수 있습니다.

이는 다양한 컴포넌트에서 스타일을 재사용하고 애플리케이션의 시각적 디자인의 일관성을 촉진하는 데 도움이 됩니다.

StyleSheet API를 사용하지 않고 스타일 객체를 생성하면 어떻게 될까요?

이 경우 자동 완성 제안을 받을 수 없습니다.

margin을 추가하려고 하면 자동 완성이 제공되지 않지만, StyleSheet API를 사용하면 자동 완성 제안이 제공됩니다.

React Native에서 이러한 지원은 매우 유용합니다.

왜냐하면 속성 이름이 브라우저에서 사용하던 것과 상당히 다르기 때문입니다.

이제 React Native 컴포넌트를 스타일링하는 두 가지 방법인 인라인 스타일과 StyleSheet API에 대해 명확히 이해하셨을 겁니다.

StyleSheet API는 코드의 가독성과 유지 관리성을 높이는 조직적인 코딩을 촉진하기 때문에 권장되는 접근 방식입니다.

---

## 여러 스타일 적용하기

이번에는 컴포넌트에 여러 스타일을 적용하는 방법을 살펴보겠습니다.

먼저, 컨테이너 **View** 컴포넌트 안에 두 개의 박스를 추가하겠습니다.

각 박스에는 "light blue box"와 "light green box"라는 텍스트를 넣습니다.

```javascript
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
    return (
        <View style={styles.container}>
            <View style={styles.lightBlueBox}>
                <Text>light blue box</Text>
            </View>
            <View style={styles.lightGreenBox}>
                <Text>light green box</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 60,
    }
});
```

두 기기를 확인해보면 두 박스의 텍스트는 볼 수 있지만, 박스처럼 보이지 않습니다.

스타일을 추가해 이 문제를 해결해 보겠습니다.

StyleSheet API 객체 안에 container 키 아래에 lightBlueBox 키를 추가하고, 이 객체에 배경 색상을 lightblue로 설정하고, 너비와 높이를 100으로 설정하며, 패딩을 10으로 설정합니다.

그런 다음 이 스타일을 **View** 컴포넌트에 사용합니다.

```javascript
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 60,
    },
    lightBlueBox: {
        backgroundColor: 'lightblue',
        width: 100,
        height: 100,
        padding: 10,
        marginBottom: 10,
    },
    lightGreenBox: {
        backgroundColor: 'lightgreen',
        width: 100,
        height: 100,
        padding: 10,
    },
});
```

UI를 확인해보면 두 박스가 기대한 대로 표시됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhDsASdqcYjbadFGezYAN1XQiq3Lbz478xFn-xwY6vQuW7iw5ggfIqCOOXouzLcKdgABVSssVSA7XAvykFKaB5h5qzGT_OIRu6MEXdJCWH2ceBVP8QlDacEomXMGTxIgtVEmoKhJJSHP5JmXUNgTgGREkuNANRfToEU_fyqFdgiTJK0tpLu4WbkfHs4ggQ)

하지만 개선할 여지가 있습니다.

lightBlueBox와 lightGreenBox 사이에 공유되는 스타일이 있습니다.

이 공유되는 스타일을 추출해서 재사용할 수 있을까요?

당연히 가능합니다.

스타일을 리팩터링해 보겠습니다.

새로운 box 키를 추가하고, width, height, padding을 이 새로운 box로 추출합니다.

그런 다음 lightBlueBox를 lightBlueBackground로 변경하고, backgroundColor만 lightblue로 설정합니다.

마찬가지로 lightGreenBackground를 만들어 backgroundColor를 lightgreen으로 설정합니다.

```javascript
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 60,
    },
    box: {
        width: 100,
        height: 100,
        padding: 10,
        marginBottom: 10,
    },
    lightBlueBackground: {
        backgroundColor: 'lightblue',
    },
    lightGreenBackground: {
        backgroundColor: 'lightgreen',
    },
});
```

이제 공통 스타일과 색상을 분리했습니다.

lightBlueBox는 box와 lightBlueBackground의 조합이고, lightGreenBox는 box와 lightGreenBackground의 조합입니다.

문제는 어떻게 컴포넌트에 여러 스타일을 지정하느냐는 것입니다.

이것은 스타일 배열을 사용해 해결할 수 있습니다.

lightBlueBox의 경우, style prop의 값으로 배열을 사용하고 styles.box와 styles.lightBlueBackground를 지정합니다.

```javascript
export default function App() {
  return (
    <View style={styles.container}>
      <View style={[styles.box, styles.lightBlueBackground]}>
        <Text>light blue box</Text>
      </View>
      <View style={[styles.box, styles.lightGreenBackground]}>
        <Text>light green box</Text>
      </View>
    </View>
  );
}
```

UI를 다시 확인해보면 두 박스가 여전히 예상대로 표시되고, 스타일은 훨씬 더 조직적으로 작성되었습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhWTTpkQaXfkxt5NBIlq2tfkWbBr1YVCS0Asbl5Coxx_Zwx9tRmY6NPx8ouWYpTrBtsD_12e5OrsmzVf06dgOV77OHJC2eBY03UXuNRCDLHtYy7HNTYBUvRGQf8rrCaRv_vbnnVqI7OgtAPMB2nHAHL2o75u8ZZglzv_Fs7s-NwSjRnE86W_B2UtIYZIWk)

한 가지 중요한 점은 여러 스타일을 병합할 때 배열의 마지막 스타일이 우선된다는 것입니다.

따라서 box 스타일에 backgroundColor를 pink로 추가해도 박스는 여전히 각각의 색상으로 렌더링됩니다.

그러나 배열에서 styles.box를 마지막 요소로 변경하면 박스 색상이 lightblue 대신 pink로 변경됩니다.

여러 스타일을 병합할 때 마지막 요소의 값이 우선됩니다.

요약하자면, 태그에서 배열을 사용해 여러 스타일을 지정할 수 있으며, 스타일을 병합할 때 배열의 마지막 스타일의 값이 우선됩니다.

---

## 박스 모델

이번에는 CSS 박스 모델과 관련된 다양한 스타일에 대해 살펴보겠습니다.

아시다시피, CSS 박스 모델은 HTML 요소를 둘러싸는 박스를 나타내며, 이 박스는 마진, 테두리, 패딩, 실제 콘텐츠로 구성됩니다.

흥미롭게도 이러한 속성들은 React Native 컴포넌트에도 적용할 수 있습니다.

이번 영상에서는 이러한 속성들의 구체적인 내용을 알아보겠습니다.

먼저, 높이(height)와 너비(width) 속성에 대해 이야기해보겠습니다.

이 속성들은 컴포넌트의 크기를 정의하는 데 사용됩니다.

React Native에서는 모든 크기가 단위가 없는 밀도 독립적인 픽셀(density independent pixels)을 나타낸다는 점이 중요합니다.

새로운 특정 단위인 rem이나 픽셀은 필요하지 않습니다.

우리의 예제에서는 너비와 높이가 100으로 설정되어 있습니다.

그러나 부모의 크기가 정의된 경우 자식 컴포넌트에 백분율 값을 지정할 수도 있습니다.

이 경우, 컨테이너가 flex 값 1을 가지고 있어 전체 가용 화면 공간을 차지하므로, 박스의 너비와 높이를 25%로 설정할 수 있습니다.

```javascript
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 60,
    },
    box: {
        width: '25%',
        height: '25%',
        padding: 10,
        marginBottom: 10,
    },
    lightBlueBackground: {
        backgroundColor: 'lightblue',
    },
    lightGreenBackground: {
        backgroundColor: 'lightgreen',
    },
});
```

결과적으로, 박스의 너비와 높이가 부모 컨테이너의 너비와 높이의 각각 25%를 차지하는 것을 확인할 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhfMBPezn0fQZumNw-9064Z2qozp_AJinLGCPnjtCWgjserq4egUQgezcWYp8i17fPmiyYOz0rUxNNCN0mXzwZlUdwcq5AI0LqtPIgm_WYix_N8jJAiQD1NKOXBNx-e88_p9s8PUXkRMLEJqWooNmubuN3RkaaQ2j7FdR1tl7ZZhUh1Rv4cTxJiO33NOSc)

두 박스는 가용 높이의 50%, 가용 너비의 25%를 차지합니다.

이렇게 해서 요소의 너비와 높이에 대해 다뤘습니다.

다음으로, 패딩(padding)에 대해 이야기해보겠습니다.

웹용 CSS와 유사하게, React Native에서도 네 방향 모두에 대해 패딩을 지정할 수 있습니다.

또한, React Native에서는 수평 및 수직 방향으로 개별적으로 패딩을 설정할 수 있는 몇 가지 속성이 있습니다.

paddingHorizontal과 paddingVertical을 사용하여 각각 수평 및 수직 방향으로 패딩을 설정할 수 있습니다.

```javascript
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 60,
    },
    box: {
        width: '25%',
        height: '25%',
        paddingHorizontal: 10,
        paddingVertical: 20,
        marginBottom: 10,
    },
    lightBlueBackground: {
        backgroundColor: 'lightblue',
    },
    lightGreenBackground: {
        backgroundColor: 'lightgreen',
    },
});
```

UI를 확인해보면 스타일이 예상대로 작동하는 것을 볼 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhaJVY6vctMCEkUHxOzKSJ0xeXdBCgL7EiktGa5wi99M8vhvwZ5sDhQU1t7UbNYeNcWqLI1GGahnY2aSWhpkOheyIXtOyfrf_cHkD2nrDE1p2NE7nfXpj4a_6XCTyz2CI4KNGqu3tLfX5-d3OB1vwDJpC-13cIlvSUTwhhASda95jHiAgBnSceqLvj3lA8)

마진(margin) 속성도 CSS와 유사하게 작동하며, React Native에서도 marginHorizontal과 marginVertical을 사용할 수 있습니다.

```javascript
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 60,
    },
    box: {
        width: '25%',
        height: '25%',
        marginHorizontal: 10,
        marginVertical: 10,
        paddingHorizontal: 10,
        paddingVertical: 20,
    },
    lightBlueBackground: {
        backgroundColor: 'lightblue',
    },
    lightGreenBackground: {
        backgroundColor: 'lightgreen',
    },
});
```

UI를 확인해보면 두 박스 사이의 간격이 수직 마진 덕분에 명확히 보이는 것을 확인할 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgSJzWPZ1ERnhcytQ40C9CP41szW-aPHaBtuKkorKRHSTSNIddN5tpztwrx4sz9RmJaJgEbxLrKMkAWeC6Kmh-h7C8I58e9V-XLI2xTRnv3rqzkHlPTs-0CR0_xuOh73owjbbwg2E6OsUsb0soJPw-5J5AxoNxTxoe5yCAAE0p9rbv8_DMk3mtDV6l0dtk)

다음으로, React Native의 테두리(border)에 대해 알아보겠습니다.

전통적인 웹 CSS에서는 border를 2px solid purple과 같은 단축 속성(shorthand property)으로 지정하는 경우가 많습니다.

그러나 이러한 접근 방식은 React Native에서는 작동하지 않습니다.

대신 속성을 개별적으로 지정해야 합니다.

```javascript
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 60,
    },
    box: {
        width: '25%',
        height: '25%',
        marginHorizontal: 10,
        marginVertical: 10,
        paddingHorizontal: 10,
        paddingVertical: 20,
        borderWidth: 2,
        borderColor: 'purple',
    },
    lightBlueBackground: {
        backgroundColor: 'lightblue',
    },
    lightGreenBackground: {
        backgroundColor: 'lightgreen',
    },
});
```

시뮬레이터를 확인해보면 두 박스에 보라색 테두리가 적용된 것을 볼 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEja2zN_Qg1NMv-XUHdVwoEgxXf1pD-pc9eaiYwvAmYDhuCk-dI53NQG_6ITwi9ClZLeFH7Apeya4-HzxXewgnPb7VA_xhnvHgTeFTCxV6r6rmKwRLUyeLq4MDp28NcR-OfI22KjtYKd6u5firB1cMnckd_AEKIJ-DJwA8BuF3FP5HO0X6tLnyeo4UvbMNw)

마지막으로, iOS와 Android에서의 borderRadius에 관한 미묘한 차이를 강조하고 싶습니다.

텍스트 컴포넌트에 borderRadius를 설정하는 경우, 인라인 스타일을 사용해

```javascript
<Text style={{borderRadius: 5, backgroundColor: 'red'}}>Border Radius</Text>
```

이렇게 설정하면 Android에서는 적용되지만 iOS에서는 적용되지 않습니다.

그러나 **View** 컴포넌트에 borderRadius를 적용하면

```javascript
<View style={{borderRadius: 5, backgroundColor: 'red'}}>
    <Text>Border Radius</Text>
</View>
```

이렇게 설정하면 두 플랫폼 모두에서 박스의 모서리가 둥글게 표시됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiCbQ3pzWMKmpbEZv-fFPnqX7L6bnj4OBeNGz7eXvmucGV-9k_Msfq0RDbKM8ou7UckcDUZ2qXVUgOkJmJVFfGHsfeyRaMeX8LGmoaKxUVW39IGyDXMgnQhN5S_nhLlazYGdYD_-7dt-fC7xOFHt34T9l3v7DwNBiXe0Wp9TL2i02j4jnFr6ei7mTaz9Sg)

이는 중요한 차이점입니다.

borderRadius는 View 컴포넌트에는 두 플랫폼 모두에서 적용되지만, 텍스트 컴포넌트에는 Android에서만 적용됩니다.

텍스트에 borderRadius를 추가하려면, 텍스트를 View 컴포넌트로 감싸고 borderRadius를 View 컴포넌트에 적용하는 것이 해결책입니다.

이렇듯 웹과 React Native 간의 스타일링 차이점과 iOS 및 Android 플랫폼 간의 스타일링 차이점을 인지하고 있어야 합니다.

---

## 그림자와 Elevation

이번에는 그림자 작업에 대해 살펴보겠습니다.

웹에서는 CSS를 사용하여 박스 그림자를 적용하는 것이 간단합니다.

수평 오프셋, 수직 오프셋, 블러, 확산, 색상을 지정하면 됩니다.

그러나 React Native에서는 네 가지 속성 그룹을 사용합니다. 

Styles 객체에 **boxShadow**라는 새 키를 추가하고, 다양한 그림자 속성을 지정해 보겠습니다.

첫 번째 속성은 **shadowColor**입니다.

이는 박스 그림자의 색상을 결정합니다.

**333333**으로 설정해 보겠습니다.

두 번째 속성은 **shadowOffset**입니다.

이 속성은 너비와 높이 속성을 포함하는 객체를 받아들입니다.

너비와 높이는 모두 양수나 음수일 수 있습니다.

너비를 6으로, 높이도 6으로 설정하겠습니다.

세 번째 속성은 **shadowOpacity**입니다.

이는 박스 그림자의 투명도를 설정합니다.

값은 0에서 1까지의 범위를 가지며, 0은 완전한 투명, 1은 완전한 불투명을 나타냅니다.

예제에서는 **shadowOpacity**를 0.6으로 설정하겠습니다.

네 번째 속성은 **shadowRadius**입니다.

이 속성은 블러 반경을 설정하기 위해 숫자를 받아들입니다.

값이 클수록 더 크고 가벼운 블러가 생성되어 그림자가 더 두드러집니다.

4로 설정하겠습니다.

박스의 너비와 높이를 250으로 변경해 보겠습니다.

```javascript
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 60,
    },
    box: {
        width: 250,
        height: 250,
        marginHorizontal: 10,
        marginVertical: 10,
        paddingHorizontal: 10,
        paddingVertical: 20,
        borderWidth: 2,
        borderColor: 'purple',
    },
    lightBlueBackground: {
        backgroundColor: 'lightblue',
    },
    lightGreenBackground: {
        backgroundColor: 'lightgreen',
    },
    boxShadow: {
        shadowColor: '#333333',
        shadowOffset: { width: 6, height: 6 },
        shadowOpacity: 0.6,
        shadowRadius: 4,
    },
    androidShadow: {
        elevation: 10,
    },
});
```

박스 그림자를 light blue box의 스타일 배열에 지정해 보겠습니다.

```javascript
export default function App() {
  return (
    <View style={styles.container}>
      <View style={[styles.box, styles.lightBlueBackground, styles.boxShadow]}>
        <Text>light blue box</Text>
      </View>
      <View
        style={[styles.box, styles.lightGreenBackground, styles.androidShadow]}
      >
        <Text>light green box</Text>
      </View>
    </View>
  );
}
```

iOS 시뮬레이터를 확인해보면 박스 그림자가 적용된 것을 볼 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiL-SrI4cSOvNh_YTMmkMGPALghobeOr5JUKfH5aYeFzKU1InmjrC8G0TovZXrV4olxd7iAaNY0xH7GJE8Ckp5CaRBA1H9juR9nR8CX0i2rUMasCJp5bRQQJpajT98Ga4xpib6I11LKLB3sG22XpRC8gsrbh6QjiO1SpYRVLIaUYwKDLWGWC-IS89mZPaA)

그러나 Android를 확인해보면 박스 그림자가 없습니다.

이는 중요한 포인트입니다.

iOS와 Android 모두에 그림자를 적용할 수 있는 공통 스타일은 없습니다.

Android에 박스 그림자를 추가하려면 **elevation** 속성을 사용해야 하며, 이는 내부적으로 Android의 elevation API를 활용합니다.

Styles 객체에 **androidShadow**라는 새 키를 추가하고, **elevation** 속성을 10으로 설정하겠습니다.

그리고 이를 light green box에 적용하겠습니다.

```javascript
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 60,
    },
    box: {
        width: 250,
        height: 250,
        marginHorizontal: 10,
        marginVertical: 10,
        paddingHorizontal: 10,
        paddingVertical: 20,
        borderWidth: 2,
        borderColor: 'purple',
    },
    lightBlueBackground: {
        backgroundColor: 'lightblue',
    },
    lightGreenBackground: {
        backgroundColor: 'lightgreen',
    },
    boxShadow: {
        shadowColor: '#333333',
        shadowOffset: { width: 6, height: 6 },
        shadowOpacity: 0.6,
        shadowRadius: 4,
    },
    androidShadow: {
        elevation: 10,
    },
});
```

Android 기기를 확인해보면, light green box에 그림자가 적용된 것을 볼 수 있습니다.

또한 **shadowColor**는 iOS와 Android 모두에서 작동하는 유일한 속성이라는 점도 언급할 가치가 있습니다.

크로스 플랫폼 그림자를 지원하는 패키지도 있지만, 여기서는 다루지 않겠습니다.

중요한 점은 그림자 속성이 Android에서 작동하지 않으며, **elevation** 속성에 의존해야 한다는 것입니다.

---

## 스타일 상속

React Native에서의 스타일 상속에 대해 살펴보겠습니다.

이 개념을 더 잘 이해하기 위해 코드 예제를 바로 살펴보겠습니다.

우리의 App 컴포넌트 내에서, 바깥쪽 **View** 컴포넌트 안에 새로운 **View**를 추가하고 그 안에 **Text** 컴포넌트를 중첩시켜 보겠습니다.

텍스트는 "style inheritance"라고 적겠습니다.

```javascript
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
    return (
        <View style={styles.container}>
            <View>
                <Text>style inheritance</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
```

UI로 돌아가보면 텍스트가 검은색으로 나타나는 것을 볼 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgoxbz4M3JmJ4ky38m3g_LCVT7xMZEteOWIOm7zjbmQYH_ylZmeGzzYp14QIndxLLbf0z8MJP-As9YkJiibMJPBc4ujORWoXdOgBzfC0bBobx4g6FVYJqopt6f3FLyw5HdWQHM29LgR4nzKbLvEvEgCddttEMypbV-FT9VCVKtLVflLWfZRpzZcY24l6_M)

이제 래핑 **View** 컴포넌트에 대한 몇 가지 스타일을 정의해 보겠습니다.

**styles.create** 안에 새로운 키 **darkMode**를 추가하고, **backgroundColor**를 검은색으로 설정합니다.

**View** 컴포넌트에 **style**을 **styles.darkMode**로 설정합니다.

이제 UI를 다시 확인해보면, 어두운 배경이 있는 **View**가 보이지만 텍스트는 보이지 않습니다.

기본 텍스트 색상이 검은색이기 때문입니다.

스타일에 폰트 색상을 추가해 보겠습니다.

```javascript
import { View, Text, StyleSheet } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.darkMode}>
        <Text>style inheritance</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  darkMode: {
    backgroundColor: "black",
    padding: 60,
  },
});
```

파일을 저장하고 UI로 돌아가보면 여전히 텍스트가 보이지 않는 것을 확인할 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjWttDmsWskGeeySicq2PYewa9z0qa1__IFWL3GTCybs7xKBI70gNcG-fAHCcg_6b-e0ddqg1XxIG3P3tWhqzBaRiIy8vtgpK1zX7cOhVhAU3EUGZaaIR95xqqJExKBAwN5QvP5984ZqMAeUXGwq4b9n60mNNuVp-_rd41ebsbPHEuOtq4B5W5tKlbNLT4)

이것은 매우 중요한 포인트입니다.

웹용 CSS에서는 **div** 태그에 폰트 색상을 설정하면, **div** 태그 안에 있는 **p** 태그에도 동일한 색상이 적용됩니다.

이는 CSS에서 상속 덕분에 가능합니다.

**p** 태그는 부모 **div** 태그로부터 색상을 상속받습니다.

그러나 React Native에서 스타일을 작업할 때 **View** 컴포넌트에서 **Text** 컴포넌트로 스타일이 상속되지 않습니다.

텍스트 색상을 흰색으로 설정하려면 이 **Text** 컴포넌트에 별도의 스타일을 생성하고 적용해야 합니다.

```javascript
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    darkMode: {
        backgroundColor: 'black',
        padding: 60,
    },
    darkModeText: {
        color: 'white',
    },
});
```

이제 UI로 돌아가보면 텍스트가 흰색으로 나타나는 것을 볼 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgAhjoC51w8sVpgLfkkx7dDmTCzOx1LBJZa_7d_Kc7gA35Mr21_KezwfzlrmO7V8E95ZW8zuABfl92hUTjBqekP5LPgQr8XO_J4aBsVDxWCGc-2bQSdwlguJyrD2tu3IKZy5WIMYbROFWTRgW9sEiGGD3gDJ_Nz83Ks8g8C9rnUOQmHpWZ2ptBtIfm-9H0)

새로운 스타일을 추가해 보겠습니다.

**boldText**라는 스타일을 만들고, **fontWeight**를 bold로 설정합니다. 

```javascript
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    darkMode: {
        backgroundColor: 'black',
        padding: 20,
    },
    darkModeText: {
        color: 'white',
    },
    boldText: {
        fontWeight: 'bold',
    },
});
```

JSX 내에서 **Text** 컴포넌트 안에 "style inheritance" 텍스트 뒤에 중첩된 또 다른 **Text** 컴포넌트를 추가하겠습니다.

텍스트는 "in bold"라고 적고, 스타일은 **styles.boldText**만 적용하겠습니다.

```javascript
export default function App() {
    return (
        <View style={styles.container}>
            <View style={styles.darkMode}>
                <Text style={styles.darkModeText}>
                    style inheritance
                    <Text style={styles.boldText}> in bold</Text>
                </Text>
            </View>
        </View>
    );
}
```

여기서 질문입니다. **bold** 텍스트는 흰색과 굵게 적용될까요, 아니면 단지 굵게만 적용될까요?

UI로 돌아가보면, **bold** 텍스트가 굵고 흰색으로 나타나는 것을 확인할 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhli7PgN7s2hUT1hprmbnOxZgKES1Fy0wJ7czAkksWh8uQGxv6A5gEuWtXOOKdgqkl5AvPLsulC51dRFI-6kiOtezvQAEQd5i-YLPj7-kwnJtQqM6akKaz37I51R0AY-tvTdw7rphCq2OAYU-oL02n90bGUuvae9b_l0MROeTSvN0cCG-QeOqWjB1_mraw)

React Native의 스타일 상속 기능은 CSS에 비해 제한적이지만, 텍스트 서브트리 내에서는 스타일 상속을 지원합니다.

우리의 경우 부모 **Text** 컴포넌트의 흰색 색상이 중첩된 **Text** 컴포넌트에 상속되었습니다.

따라서 **View**에서 **Text**로의 상속은 작동하지 않지만, **Text**에서 중첩된 **Text**로의 상속은 작동합니다.

끝.