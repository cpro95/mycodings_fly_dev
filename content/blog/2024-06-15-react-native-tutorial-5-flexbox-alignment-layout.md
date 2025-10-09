---
slug: 2024-06-15-react-native-tutorial-5-flexbox-alignment-layout
title: 리액트 네이티브 강좌. 5편 - Flexbox - 정렬 및 레이아웃 속성
date: 2024-06-15 12:54:01.240000+00:00
summary: 이 글에서는 React Native에서 Flexbox를 사용하여 아이템을 정렬하고 레이아웃을 구성하는 방법을 다룹니다. Justify Content, Align Items, Flex Wrap 등 다양한 속성을 활용하여 레이아웃을 세밀하게 조정하는 방법을 배워봅시다.
tags: ["react native", "justify content", "align items", "align self", "flex wrap", "align-content", "gap"]
contributors: []
draft: false
---

안녕하세요!

리액트 네이티브 강좌 5편입니다.

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

- [리액트 네이티브 강좌. 5편 - Flexbox - 정렬 및 레이아웃 속성](#리액트-네이티브-강좌-5편---flexbox---정렬-및-레이아웃-속성)
  - [Justify Content](#justify-content)
    - [요약](#요약)
  - [아이템 정렬(Align Items)](#아이템-정렬align-items)
  - [개별 정렬(Align Self)](#개별-정렬align-self)
  - [플렉스 랩(Flex Wrap)](#플렉스-랩flex-wrap)
  - [콘텐츠 정렬(Align Content)](#콘텐츠-정렬align-content)
  - [간격(Gap)](#간격gap)
    - [`rowGap`](#rowgap)
    - [`columnGap`](#columngap)
    - [`gap`](#gap)

---

## Justify Content

flex와 flex direction에 대해 알아봤으니, 이제 정렬과 관련된 속성들에 대해 알아볼 차례입니다.

이번에는 `justifyContent` 속성에 대해 집중적으로 다뤄보겠습니다.

`justifyContent` 속성은 주 축(main axis)을 따라 정렬을 한다는 걸 의미합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiUpZWb4LjAf73-Cci_PyJUBpYU99Wc1ZWoeX_XqkaJilIz7qhkRcfp9vbUI9ZMN_TYhr9UKa7TDe-MiNQlWCno9dGe1NS_9Gkx19fvA7YjBOogj8x8oOuB3oydetUCsW14AKoNegrHJqjJw4gTd0BjY_p8iOtwdaVUmVSe2s87wM3a8UL0ERIR0oo7wX8)

다양한 값들이 어떻게 작동하는지 UI를 통해 이해해 봅시다.

더 나은 시각화를 위해 이번에도 첫 세 개의 박스만 렌더링하겠습니다.

`justifyContent`는 컨테이너에 설정하여 그 안의 아이템들의 정렬을 제어하는 속성입니다.

컨테이너 스타일에 `justifyContent`를 추가해 봅시다.

기본적으로 `justifyContent`는 `flex-start` 값으로 설정되어 있습니다.

이 값은 flex 아이템들을 주 축의 시작 부분에 배치합니다.

주 축이 위에서 아래로 흐르기 때문에 아이템들은 뷰의 상단에 배치됩니다.

```jsx
import { View, StyleSheet } from "react-native";
import Box from "../components/Box";

const App = () => {
  return (
    <View style={styles.container}>
      <Box style={{ backgroundColor: "blue" }}>Box 1</Box>
      <Box style={{ backgroundColor: "green" }}>Box 2</Box>
      <Box style={{ backgroundColor: "red" }}>Box 3</Box>
      {/* <Box style={{ backgroundColor: "purple" }}>Box 4</Box>
      <Box style={{ backgroundColor: "orange" }}>Box 5</Box>
      <Box style={{ backgroundColor: "pink" }}>Box 6</Box>
      <Box style={{ backgroundColor: "yellow" }}>Box 7</Box> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 64,
    borderWidth: 6,
    borderColor: "red",
  },
});

export default App;
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEh5EwUicQ2WGxsbnsAYGmLD2B0txe6IfDfk0Xrqpxk4t5-GDRWa3d2N1IVEAOZ-Z0JPS5ltKI2V7MXhnPD5OoK8p3VX04I4pXDTONdiZnBxqvUNcuxvUI9UlK1fvrIO7ZTIW8T3oc22AmTQOWk2FOYh8HPo9v9fY7SsPtFPq5pa9wZrUCCitLeWbG8eSCs)

`justifyContent`를 `flex-start`로 설정했을 때 아무런 차이가 없다는 것을 확인할 수 있습니다.

두 번째 가능한 값은 `flex-end`로, 이 값은 flex 아이템들을 주 축의 끝 부분에 배치합니다.

파일을 저장하면 아이템들이 주 축의 끝 부분에 배치되는 것을 볼 수 있습니다.

중요한 점은 박스 1이 맨 아래에 있는 것이 아니라, 전체 flex 아이템 그룹이 아래로 밀린다는 것입니다.

```jsx
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    marginTop: 64,
    borderWidth: 6,
    borderColor: "red",
  },
});
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEj5X9NniUiAgmIAEYuG_8e_pzHhDPDsIuc0-LbiB1Q0VAG12s0RY051Mspyg-yUNlWxpIsf-e_ozbQ7zQ1L15Ne1eUNA8vERBrWxv48PFzit7mvL615M_YhVNWZaMM1tKOLHCFAKBhFLSk9evVJwXXHXMMxQIWR8t7OLd89Pme6dxo4kom6SXbyN1_GqX4)

주 축의 중앙에 콘텐츠를 정렬할 수도 있습니다.

값을 `center`로 설정하고 파일을 저장해 봅시다.

이제 콘텐츠가 주 축의 중앙에 배치됩니다.

```jsx
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 64,
    borderWidth: 6,
    borderColor: "red",
  },
});
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEgtKxlCnm2ZUG7tC1rwMhdFSVbnG1YI7lUq7p4I2zC_ou2KOnmnCf-BTdRxS4X84jT4kzqTDpx0cEGXLXlglS0WcI4bXcH-uMbdtYWaqyYsA_XrAwV0Id-PBgQ6Dhi0ajs_oLkCvdAOAosI-0Qffb2r67fkK6tm7mmldlir51PE8S5Y0qV4_b5PNhVNokg)

이렇게 상단, 하단, 중앙에 정렬하는 세 가지 속성을 기대할 수 있습니다.

그러나 flexbox는 컨테이너 내의 여유 공간을 어떻게 분배할지 제어할 수 있는 추가 값을 제공합니다.

그 중 하나가 `space-between`입니다.

파일을 저장하면 남은 여유 공간이 균등하게 나누어져 flex 아이템 사이에 추가되는 것을 볼 수 있습니다.

```jsx
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    marginTop: 64,
    borderWidth: 6,
    borderColor: "red",
  },
});
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEgDzvL5b4KxuN4QavrpFOzb1uCfKey8lkslIYo6FMsGT1cyP79NlC7F0r9cbhSqBEfQTy4hD6hzqT-Qaq-8-RQDV7B73O7cn8KdtMGya_ZJ3OOEWcAasu4A4bElT4kXzetw1Tb51zzI_DDrjcTv4pzIIQwIYwLiu7fBYv7dZRQA1FbTev__pZVOG3zMUJw)

때로는 첫 번째 아이템 앞과 마지막 아이템 뒤에도 공간이 필요할 수 있습니다.

이럴 때 사용하는 값이 `space-around`입니다.

파일을 저장하면 시작과 끝에 공간이 생기는 것을 볼 수 있습니다.

이 공간은 flex 아이템 사이의 공간의 절반입니다.

예를 들어, 아이템 사이의 공간이 20픽셀이라면 시작과 끝의 공간은 10픽셀이 됩니다.

```jsx
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    marginTop: 64,
    borderWidth: 6,
    borderColor: "red",
  },
});
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEj6bPFNaX5It1N09Cy1xoLURYA-PH7v19_tDFpeuzXqfSj0dEhi8W583ZsLAtEgCg7SvN0JaAlDQb3qbWfHE6EMvwwZz5vMWOCsvr8zmhaquJytKfDzlR3r6eh5eT8U_iL2wOcByoJXvGjuCrvk53hjIaLh_6xjkqusj7pG0RYja2oKRnTAKhRBqipbguk)


만약 아이템 시작과 끝의 공간도 동일하게 하고 싶다면, `space-evenly` 값을 사용하면 됩니다.

값을 변경하고 파일을 저장하면 여유 공간이 컨테이너 내에서 균등하게 분배되는 것을 볼 수 있습니다.

```jsx
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    marginTop: 64,
    borderWidth: 6,
    borderColor: "red",
  },
});
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEiv5atZA_WVU1K0Kcq7X776lz5quIH-y3YCzDguyfghz1E-MKn8ok1mWmdC-dzITEAW9XJ644z6lIKLDSI9XzgcZoEsxVKYIKiyzbcQmQG2oOOe46H4IZ6tYDvjePP7xWjcd1KejVtWLCSQOqqbylECQHf2VjpLBQ2LHYlCguNDUyVn1-X2F1-_kvRGvas)

중요한 점은 `justifyContent` 속성은 주 축을 기준으로 아이템을 정렬한다는 것입니다.

따라서 `flexDirection`을 `row`로 설정하면 주 축이 왼쪽에서 오른쪽으로 변경되어 `justifyContent`는 수평 정렬을 담당하게 됩니다.

```jsx
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start', // or flex-end, center
    marginTop: 64,
    borderWidth: 6,
    borderColor: "red",
  },
});
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEjnr_QAPQCu2zO7EKwQVZoPgnmDYBiTCUf8lJxnKYMTX-C8Kv8d2GL9Msue07lKqnGHt9zmCUJBKzg1sRBKeOnwZ8LjfRVe_JF8a7g98kodAD7rHga59UJ6YRFRMkR7hANaHc6bj-k-vq1fBdFcBJyS6lfWsdyBQf2j67eJKr66SJsNeqBfg0sblb58-KQ)

위 그림처럼 `justifyContent`를 `flex-start`로 설정하고 `flex-direction`을 `row`로 설정하면 모든 아이템이 왼쪽으로 정렬됩니다.

값을 `flex-end`로 설정하면 모든 아이템이 오른쪽으로 정렬됩니다.

값을 `center`로 설정하면 콘텐츠가 수평으로 중앙에 정렬됩니다.

`space-between`, `space-around`, `space-evenly`를 한번 시도해 보시기 바랍니다.

### 요약

`justifyContent` 속성은 아이템을 정렬하고 컨테이너 내의 여유 공간을 분배하는 데 사용됩니다.

정렬은 항상 주 축을 기준으로 합니다.

가능한 값은 `flex-start`, `flex-end`, `center`, `space-between`, `space-around`, `space-evenly`입니다.

---

## 아이템 정렬(Align Items)

이번에는 두 번째 정렬 속성인 `alignItems` 속성에 대해 알아보겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiUpZWb4LjAf73-Cci_PyJUBpYU99Wc1ZWoeX_XqkaJilIz7qhkRcfp9vbUI9ZMN_TYhr9UKa7TDe-MiNQlWCno9dGe1NS_9Gkx19fvA7YjBOogj8x8oOuB3oydetUCsW14AKoNegrHJqjJw4gTd0BjY_p8iOtwdaVUmVSe2s87wM3a8UL0ERIR0oo7wX8)

`alignItems` 속성은 컨테이너의 교차 축을 따라 플렉스 아이템을 배치하는 기본 동작을 정의합니다.

이 속성은 `justifyContent`와 유사하게 작동하지만, 수직 방향으로 작동합니다.

UI를 통해 각 값이 어떻게 작동하는지 이해해보겠습니다.

먼저, 컨테이너 스타일에 `alignItems`를 추가해보겠습니다.

기본적으로 `alignItems`의 값은 `stretch`로 설정되어 있습니다.

이는 플렉스 아이템들이 교차 축의 전체 길이를 따라 늘어난다는 것을 의미합니다.

교차 축은 일반적으로 왼쪽에서 오른쪽으로 흐릅니다.

```javascript
import { View, StyleSheet } from "react-native";
import Box from "../components/Box";

const App = () => {
  return (
    <View style={styles.container}>
      <Box style={{ backgroundColor: "blue" }}>Box 1</Box>
      <Box style={{ backgroundColor: "green" }}>Box 2</Box>
      <Box style={{ backgroundColor: "red" }}>Box 3</Box>
      {/* <Box style={{ backgroundColor: "purple" }}>Box 4</Box>
      <Box style={{ backgroundColor: "orange" }}>Box 5</Box>
      <Box style={{ backgroundColor: "pink" }}>Box 6</Box>
      <Box style={{ backgroundColor: "yellow" }}>Box 7</Box> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    marginTop: 64,
    borderWidth: 6,
    borderColor: "red",
  },
});

export default App;

```

![](https://blogger.googleusercontent.com/img/a/AVvXsEh5EwUicQ2WGxsbnsAYGmLD2B0txe6IfDfk0Xrqpxk4t5-GDRWa3d2N1IVEAOZ-Z0JPS5ltKI2V7MXhnPD5OoK8p3VX04I4pXDTONdiZnBxqvUNcuxvUI9UlK1fvrIO7ZTIW8T3oc22AmTQOWk2FOYh8HPo9v9fY7SsPtFPq5pa9wZrUCCitLeWbG8eSCs)

`stretch`가 기본값이기 때문에, 동일한 값으로 설정해도 눈에 보이는 변화는 없습니다.

각 박스는 교차 축 방향으로 왼쪽에서 오른쪽으로 늘어납니다.

두 번째 값은 `flex-start`입니다.

이 값은 모든 아이템을 교차 축의 시작 지점으로 밀어 넣습니다.

```javascript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    marginTop: 64,
    borderWidth: 6,
    borderColor: "red",
  },
});
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEibeELOzDqrEJ6txZQQuSWb5UbXeMMgxcBCqUuww0BUPUd-A18XhhzDsaww6sNu558RxOkDuQXF47b515iAgAK6HQpVGFyi758657GcZTd3ikQUYAYNKbrJsjicphO8hjU-XORpUzd-frMb1vE2Zszr_So6VlgAXMaHPo8CUmDHKt3JomYTHQD3-ecRzM4)

세 번째 값은 `flex-end`입니다.

이 값은 아이템들을 교차 축의 끝 지점으로 밀어 넣습니다.

```javascript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-end',
    marginTop: 64,
    borderWidth: 6,
    borderColor: "red",
  },
});
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEjhl75gUootJsnWl6kqs0o_vCQqat19mBoxfSQp4TQrHSNQJT8UGWgImNI7M_L9XzABfOahmixEpoMndnZl7stVJ8fxeSh8WIWS37bQZ0v19yZuPnmMl9a4p930yo9T9Al8xVzDlDLexpsYa72J80OlMg3vRpcYemqFx-eU2L_11GbETLRfDOBxojQseBA)

네 번째 값은 `center`입니다.

이 값은 콘텐츠를 교차 축의 가운데로 정렬합니다.

```javascript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 64,
    borderWidth: 6,
    borderColor: "red",
  },
});
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEizPnqT5Opocxw8WhKorMx2cOJnoq1uOoW3lt8-jvgQ6R7pH0OwzVSwDZDeF0oHCkq-y5mygk9qRAlT40yOFGRu_yislYRdIQ26lTJMaaBDMnAiYmS1bcbg4VHxKa9nCp1rJLDD9tTJq5ZL7kIJYHgtCAdMGIUYkLctr46L82TsZzoBzeGs8l2YkH7TV7s)

마지막으로 `baseline` 값을 알아보겠습니다.

이 값은 잘 사용되지 않지만, 이해하는 것이 매우 중요한데요.

베이스라인은 'baseline' 단어 뜻에서 알 수 있듯이 문자가 앉아 있는 선으로 생각할 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhmWuPVJJnDvWUoVmaexYG3yhDCcmGErn7Lc8t3-M7xsK90wbBthh7zLMaH6TqGGLnK-yTurfSQki67MXKi6RyAtu4AdlFAbKMvZmc0CpOaxZx1SjaHNEOLqKoZntZ4fBLibjOnUGjpIG0rs0Jvl6OOAZLIIqTfRdj1IZ29VEif0n6RBV8JwAyUDuTRX2U)

위 그림에서 보시면 `baseline`은 각각의 문자인 ABCDE가 위치해 있는 점선이 그 베이스라인입니다.

플렉스박스에서 `baseline` 값은 플렉스 아이템의 콘텐츠 베이스라인을 기준으로 정렬합니다.

테스트를 위해 `Box 1`의 수직 패딩값을 100으로 두고 `flexDirection`을 `row`값으로 지정하겠습니다.

```javascript
import { View, StyleSheet } from "react-native";
import Box from "../components/Box";

const App = () => {
  return (
    <View style={styles.container}>
      <Box style={{ backgroundColor: "blue", paddingVertical: 100 }}>Box 1</Box>
      <Box style={{ backgroundColor: "green" }}>Box 2</Box>
      <Box style={{ backgroundColor: "red" }}>Box 3</Box>
      {/* <Box style={{ backgroundColor: "purple" }}>Box 4</Box>
      <Box style={{ backgroundColor: "orange" }}>Box 5</Box>
      <Box style={{ backgroundColor: "pink" }}>Box 6</Box>
      <Box style={{ backgroundColor: "yellow" }}>Box 7</Box> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 64,
    borderWidth: 6,
    borderColor: "red",
  },
});

export default App;
```

파일을 저장하면, 각 아이템 내부의 텍스트가 동일한 베이스라인에 맞춰진 것을 볼 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhgzUrzA2hrSpu63y84ilscC7KYEPwxVi14eGWDvF2WWFap8nOazu3GBO1-VlExYxA22-UiIq8sji_1WK7FNdfQ71Q-9DMoEX7bWJuirBK211mYjnlYFDMoPgj4eOnroK_8q7R2W5kcazXAJDcQ9k5v5I5tnac7krYFm_Ldn37eufTt42I9H9diVzYmRX8)

각 아이템의 높이나 패딩이 어떻게 설정되었든지 상관없이 텍스트 콘텐츠는 동일한 베이스라인에 맞춰집니다.

요약하자면, `alignItems` 속성은 아이템들을 교차 축을 따라 정렬합니다.

가능한 값들은 `flex-start`, `flex-end`, `center`, `baseline`, 그리고 기본 값인 `stretch`입니다.

---

## 개별 정렬(Align Self)

이번에는 세 번째 정렬 속성인 `alignSelf`에 대해 알아보겠습니다.

`alignItems`가 컨테이너에 적용되어 모든 아이템의 정렬을 제어하는 반면, `alignSelf`는 개별 아이템에 적용되어 각 아이템의 정렬을 독립적으로 제어할 수 있습니다.

`alignSelf`에 사용할 수 있는 값들은 `alignItems`에서 사용되는 값들과 유사합니다.

이번에는 모든 박스를 렌더링하여 `alignSelf`의 다양한 값을 시연해 보겠습니다.

먼저, `alignSelf`의 첫 번째 값인 `flex-start`를 살펴보겠습니다.

이 값은 아이템을 교차 축의 시작 지점에 정렬합니다.

```javascript
import { View, StyleSheet } from "react-native";
import Box from "../components/Box";

const App = () => {
  return (
    <View style={styles.container}>
      <Box style={{ backgroundColor: "blue", alignSelf: 'flex-start' }}>Box 1</Box>
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
    marginTop: 64,
    borderWidth: 6,
    borderColor: "red",
  },
});

export default App;
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEiYOi7-DJ07CsfD395cAeKQ1t-edkfHDN5mBQJrCyzIpLrrlhvdLC0ffTjAhqw40HWTKPuRqxglufwuK_e5oGv9ew1AZ9TtaDXa2DFZaDC5w08iNd38WBF0_xFUg0BV_EBuPNsm2uOEmVExG75lO7mDWmojNNfxY3lIUNN5QQk2riUACWmdutrRteJXEkE)

첫 번째 박스는 `alignSelf: 'flex-start'`로 설정되어 교차 축의 시작 지점으로 정렬됩니다.

두 번째 값은 `flex-end`입니다.

이 값은 아이템을 교차 축의 끝 지점에 정렬합니다.

```javascript
<Box style={{ backgroundColor: "green", alignSelf: "flex-end" }}>
  Box 2
</Box>
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEi9scReY_e-Mb1-aY1zBkQGSs2SK-8xAdbW9xdYEPRDN29GfLvUVYVKszisfSL61nIaSh34fIv8DSi5cE2MVPTx1_JfJKd96-FTHmvevxmUQADlT9j7f-CK5SsK5NwgPbet0pemcZsRu-h5xK7D4KUwcdccgCbhMxMYKhmamu3UhyaWh8rJF7BUmpnlUH4)

세 번째 값은 `center`입니다.

이 값은 아이템을 교차 축의 가운데에 정렬합니다.

```javascript
<Box style={{ backgroundColor: "red", alignSelf: "center" }}>Box 3</Box>
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEiLShbwHFzCEYwa09Ic6ifmZL67zt8FTw6SzeVC4wsXADJPIndFI_onFgHrGs5u2emErf9apHmZY4x9rYHwy7BhTgMAD2N7LdUxc_Of7Q0_Mo531r8OL9CsBQ_TfnvVI-qkS9153PDe-j61nViVvwvALPsC55a4ts5KX-Aj7KMvF1eqtfNsigN3H0qL8KU)

네 번째 값은 `stretch`입니다.

이 값은 아이템을 교차 축의 시작부터 끝까지 늘립니다.

```javascript
<Box style={{ backgroundColor: "purple", alignSelf: 'stretch' }}>Box 4</Box>
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEiLShbwHFzCEYwa09Ic6ifmZL67zt8FTw6SzeVC4wsXADJPIndFI_onFgHrGs5u2emErf9apHmZY4x9rYHwy7BhTgMAD2N7LdUxc_Of7Q0_Mo531r8OL9CsBQ_TfnvVI-qkS9153PDe-j61nViVvwvALPsC55a4ts5KX-Aj7KMvF1eqtfNsigN3H0qL8KU)

그러나 박스 5, 박스 6, 박스 7도 `stretch`된 것을 볼 수 있습니다.

이는 `stretch`가 `alignSelf`의 기본값이 아니라, 부모 플렉스 컨테이너의 `alignItems` 속성이 `stretch`로 설정되어 있기 때문입니다.

`alignSelf`의 기본값은 `auto`이며, 이는 부모 플렉스 컨테이너의 `alignItems` 속성 값을 상속합니다.

따라서 박스 5에서 7은 부모 컨테이너의 `alignItems` 속성이 `stretch`로 설정되어 있기 때문에 `stretch`된 것입니다.

```javascript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-end',
    marginTop: 64,
    borderWidth: 6,
    borderColor: "red",
  },
});
```

위와 같이 부모 플렉스 컨테이너의 `alignItems` 속성 값을 `flex-end`로 설정하면,

이 경우, 박스 5에서 7은 `flex-end`로 정렬됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEh-uNyw2Xa7T7f4t_3Cf8io_DpAphdoeWCpJg-fYKukBWsPU8BBnwXg_UC1vcTyKXK1VOamQel_VTG0kZq5g31-di1hmOmMerbQljWoCCV17AnpWcGDBWpjifK1_PaOHNaeArtbI7DyRGr42uaGqlCg-zyoIvUVWKfRlSl33p6bOr6nu7QrFogeoiqcklA)

요약하자면, `alignSelf` 속성은 개별 아이템의 정렬을 제어하며, `auto`, `flex-start`, `flex-end`, `center`, `stretch` 값을 가집니다.

`alignSelf` 속성이 `auto` 값 외의 값으로 지정되면, 항상 부모 플렉스 컨테이너의 `alignItems` 값을 무시합니다.

---

## 플렉스 랩(Flex Wrap)

이번에는 `flexWrap` 속성에 대해 알아보겠습니다.

이 속성은 컨테이너 내에서 공간이 제한될 때 플렉스 아이템들이 어떻게 동작할지를 제어할 수 있게 해줍니다.

현재 우리의 컨테이너는 `flex: 1`로 설정되어 있어 사용 가능한 모든 공간을 차지하고 있습니다.

하지만 제한된 공간에서 작업해야 할 때는 어떻게 될까요?

`flex: 1`을 주석 처리하고 `height` 값을 설정해보겠습니다.

```javascript
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
    // flex: 1,
    height: 300,
    marginTop: 64,
    borderWidth: 6,
    borderColor: "red",
  },
});

export default App;
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEgQOOZiSUxD1Eyu-G91JMPTB_cjlpbca7rWOtY10NRAs0fCn5kkBbuVaL_tfqHV2JnzStbPHDfWTOWShSIqEGfF0BKhfT9RQGLMGxNQ9SdGfzR2McfSOpWurU576iNXsJBEmpg5Mu92UsYd0KquxLukFUp7mbDxQtNPcYhpB79FEjj1s52tKhKH2pm3GAw)

UI를 보면 공간이 부족할 때 아이템들이 컨테이너를 넘치는 것을 볼 수 있습니다.

이 오버플로우를 방지하고 제한된 공간을 더 효과적으로 처리하기 위해 `flexWrap` 속성을 사용할 수 있습니다.

컨테이너의 스타일 객체에 `flexWrap` 속성을 추가하겠습니다.

`flexWrap` 속성은 세 가지 가능한 값을 가질 수 있습니다.

첫 번째 값은 `nowrap`이며, 기본값입니다.

```javascript
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexWrap: "nowrap",
    height: 300,
    marginTop: 64,
    borderWidth: 6,
    borderColor: "red",
  },
});
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEgQOOZiSUxD1Eyu-G91JMPTB_cjlpbca7rWOtY10NRAs0fCn5kkBbuVaL_tfqHV2JnzStbPHDfWTOWShSIqEGfF0BKhfT9RQGLMGxNQ9SdGfzR2McfSOpWurU576iNXsJBEmpg5Mu92UsYd0KquxLukFUp7mbDxQtNPcYhpB79FEjj1s52tKhKH2pm3GAw)

UI를 확인해보면 변화가 없고 아이템들이 한 줄에 유지되는 것을 볼 수 있습니다.

아이템들을 컨테이너 내에서 랩하고 싶다면 `wrap` 값을 설정합니다.

```javascript
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexWrap: "wrap",
    height: 300,
    marginTop: 64,
    borderWidth: 6,
    borderColor: "red",
  },
});
```

UI를 보면 아이템들이 다음 열로 랩(wrap)된 것을 볼 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiBWLfqjmUm7dWKttNUWWfMudoRCCXz6sR5wrvA7_MA8KSck78QeqOH9zQrk3axrf5n8nUuJWTYlXtURA8KkJ79sSTFUNisyzevIihrSVmqjNtRqba1qGC6yQ5vEsJDmayaNpOMt1AoQfPZC7n8Mls8UHWix0yqCQfCBnwUvWK1v5ZX_JWmBSc-DKUQhMs)

컨테이너 높이를 600으로 확장하면, 모든 아이템을 한 줄에 수용할 수 있어 랩이 발생하지 않습니다.

```javascript
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexWrap: "wrap",
    height: 600,
    marginTop: 64,
    borderWidth: 6,
    borderColor: "red",
  },
});
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEih3_VqPx-hqSE8q6OO93mA6aei_Yu6b-ZzfSr3bsaIsOEDCxBvAlLtpQUmD41BpjS1o_fRHdDhD8EYLTPyvsQlVhDfeTaRibBmiTN9omNtN1i6yEjorSbuh0kyHyg2j3zIr5aEPGg2rwIA46HsVoFF8JHcxy8Ns-Tsfu4XyQiwH-2fqPgtfoMFBy42Z_I)

마지막 값은 `wrap-reverse`입니다.

이 값은 아이템들을 교차 축의 끝에서 시작하여 이전 열로 랩합니다.

```javascript
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexWrap: "wrap-reverse",
    height: 600,
    marginTop: 64,
    borderWidth: 6,
    borderColor: "red",
  },
});
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEhmA_3WFI1yWdyzN0jKfVlXeGZNmMTEiH3S_psgQcUY3AImTiCv1jH2AyxwhF2obkrrObB8mufOvUgI5eSmKsRcWX5ORuOCDYbAObOU8zvLV-cYEgjljapg66th1f2aGtCo0bwWSm3uFGHxxC8_c9irPokoiAiivFtnfDIfe7Tvyen9KeP2hhngCKxxqPI)

UI를 보면 역방향으로 랩된 것을 볼 수 있습니다.

`wrap-reverse`가 아이템들을 역순으로 랩하기 시작한다고 혼동하지 마세요.

height를 다시 300으로 조정해 보겠습니다.

```js
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexWrap: "wrap-reverse",
    height: 300,
    marginTop: 64,
    borderWidth: 6,
    borderColor: "red",
  },
});
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEhO5Hk1w4IPwtqkZDQxFFgv0iHCzAfXW_5ZoBEfpotiMvzLcbtQvX220x1Ua15n76rbazbRkM1a5tMk5v2e6D_bpAKJsVsaFcUzDIGuiqCSpVTZe3KyJ1b4a1h16Nl0fhrhs8FxhO9BQguR-z_fkYQAllztTAkf7lGuCDLvAS6iiJCOk9qeLF5oCBHAMpE)

아이템 1은 오른쪽 열로 이동하지 않습니다.

랩은 항상 마지막 아이템부터 시작되며, `wrap-reverse`는 다음 열 대신 이전 열로 아이템을 밀어 넣습니다.

아이템의 수평 랩핑도 가능합니다.

이를 위해 `flexDirection`을 `row`로 변경하고 다시 `flex: 1`을 사용해보겠습니다.

```javascript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: "wrap",
    marginTop: 64,
    borderWidth: 6,
    borderColor: "red",
  },
});
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEh8tJ1yMCTgMKMISiwtbfGaLyFHSJPG4I4Rf_DmvURm1bFAuNHubuM-OOcC_V8o8Ppgy66zUBaqXQi6-K9djAUeAJhx6xFKkDipczumanfnynNfGiZrPlK28VBUEWuEbVQL6nEuwQ7vmhMSEDEhpCI_HgxdoEJfJZyFRJwvgFuDgR-_ofX50f4wAjONug0)

이제 아이템들이 다음 행으로 랩된 것을 볼 수 있습니다.

값을 `wrap-reverse`로 변경하면 아이템들이 교차 축의 끝에서 시작하여 위쪽 행으로 랩됩니다.

```javascript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: "wrap-reverse",
    marginTop: 64,
    borderWidth: 6,
    borderColor: "red",
  },
});
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEhoxRMTDy0FSFiUwQ0snxY2E2kVLs1GDHK53mud7ULwr64rTNaHGwd8g1ln5nXWOHi4ZW_3-gVB_m5ytBQ5nbmyBDr7Nc9hDZiYajCDT5OZ9Ss47Q67fUO1BQe2WKZd0y4fOAFIGNWtSpXDgm-23fFhxDabEytpnlgJB8w5l7o7_WJbRFKMNiZO10Y4jsk)

요약하자면, `flexWrap` 속성은 컨테이너 내에서 플렉스 아이템들의 랩핑 동작을 제어하는 데 유용한 도구입니다.

가능한 값들은 `nowrap`(기본값), `wrap`(다음 행이나 열로 랩), `wrap-reverse`(이전 행이나 열로 랩)입니다.

---

## 콘텐츠 정렬(Align Content)

다음으로 알아볼 플렉스박스 속성은 `alignContent` 속성입니다.

`alignContent` 속성은 교차 축을 따라 콘텐츠의 줄을 정렬합니다.

이는 `alignItems` 속성이 개별 아이템을 교차 축을 따라 정렬하는 것과 유사합니다.

하지만 중요한 조건은 컨테이너 내에 여러 열이나 행이 있어야 한다는 것입니다.

여러 가지 가능한 값을 더 잘 이해하기 위해, 코드로 돌아가서 컨테이너에 높이를 설정하고 랩핑을 활성화해 보겠습니다.

`flex: 1`을 주석 처리하고 높이를 300으로 설정한 다음, `flexWrap`을 `wrap`으로 설정합니다.

랩핑은 콘텐츠를 두 열로 강제하는 데 필수적입니다.

```javascript
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
    // flex: 1,
    height: 300,
    flexWrap: "wrap",
    marginTop: 64,
    borderWidth: 6,
    borderColor: "red",
  },
});

export default App;
```

파일을 저장하고 UI를 보면 콘텐츠가 두 열로 랩핑된 것을 볼 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiuT4J576I-k4JhBHTuuYPAewoPYsUiBthqe8uqvm-UnT70Xnnx5H50weKocyxwkiuQKvlqeboz1y8EiF_TsDvsbfFd-5SIiimHwH2SBFYzbucc6gqHckLFrLdOftodKEyK56KfWYXpjTPMbiF8cgwmSn579l89w72D_sR5HgbmVYk5XSuu53i6oSSEfFw)

`alignContent` 속성은 이 콘텐츠의 줄을 교차 축을 따라 정렬하는 데 사용됩니다.

기본 값은 `flex-start`로, 두 열을 교차 축의 시작 지점에 배치합니다.

```javascript
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: 300,
    flexWrap: "wrap",
    alignContent: 'flex-start',
    marginTop: 64,
    borderWidth: 6,
    borderColor: "red",
  },
});
```

UI를 보면 변화가 없음을 알 수 있습니다.

다음 가능한 값은 `flex-end`로, 콘텐츠를 교차 축의 끝 지점으로 밀어 넣습니다.

```javascript
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: 300,
    flexWrap: "wrap",
    alignContent: 'flex-end',
    marginTop: 64,
    borderWidth: 6,
    borderColor: "red",
  },
});
```

파일을 저장하면 콘텐츠가 오른쪽에 정렬된 것을 볼 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEi4_gVSqXd9rD1cLlZda504v3nFZRqBlNQmBJY9nkhYbrq1UwiwaFrmg5Wwlk_ydR5wUbujJSC8bDq1igkrrnen-Z1M_1gR2ihTMmFOuAZObjsq5n1zgVkPeEt30YOL-fAjLNZdXwT6o6teZj5jfyH5LLTyfSUPu3zQ2HPL369U3lpY3NLrG1qMkBVs5t0)

또한, `center` 값을 지정하여 콘텐츠를 가운데에 정렬할 수 있습니다.

```javascript
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: 300,
    flexWrap: "wrap",
    alignContent: 'center',
    marginTop: 64,
    borderWidth: 6,
    borderColor: "red",
  },
});
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEgiu_MrH-1OkHK_2JZFVzPu55ca2GozqAA7TQfptWfuusO-DsWzHSIcIGYOAFV6KQVErPguGXGQ_Of1t56fjTtaL_eA3l0FG1QxUjnbqSzDq3K7-NGDyTxUOmrWtPzudnoz82U74WTBTJEqzG_YyN8CYhvuWNSwfLttWIl8SycSeeYAIQlsrWkdMtOte60)

파일을 저장하면 콘텐츠가 가운데에 완벽하게 정렬된 것을 볼 수 있습니다.

네 번째 값은 `stretch`로, 열을 교차 축의 시작부터 끝까지 늘립니다.

```javascript
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: 300,
    flexWrap: "wrap",
    alignContent: 'stretch',
    marginTop: 64,
    borderWidth: 6,
    borderColor: "red",
  },
});
```

파일을 저장하면 두 열이 함께 늘어나서 UI에서 사용 가능한 전체 수평 공간을 차지하는 것을 볼 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEh7OBmz19Z5KZkFZjdN6YVXD16I5eiyKjpfYAK_GxLfh7iTDEfz7FQ5ZjjsbAkLBwiTqVjuRggtyfSIXPalFR_CBkfnLMUa8URDC8d3Z-GJZM4ozBw9_tt-UoJTlH2I38u3nq-_6U4lFxbU74R2A0akJD0JXptLRjmRoOqq4vavBVzdD8lDNgK78l3pim8)

다음 값은 `space-between`으로, 모든 여분의 공간을 줄 사이에 배치합니다.

```javascript
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: 300,
    flexWrap: "wrap",
    alignContent: 'space-between',
    marginTop: 64,
    borderWidth: 6,
    borderColor: "red",
  },
});
```

파일을 저장하면 두번째 열에 문제가 생긴 것을 볼 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhkWbKomVkf55rbISplhxTtWtLihZMPd7bVZhOEGNKQlxE7Fl28xNDB3weyfOF_U-AVnEb5xz6cchBc1RCttUflqTRQovgjGHwqRJr37NQRQ8u_3p48iySUZxuUSB6auX19sgZ3_epmLFtg6FlIfuaMcNPoIHZWDmim8AskAObtt_O-MJxBIpqsSDQzxRg)

Box 컴포넌트의 크기가 커서 그런겁니다.

Box 컴포넌트로 가서 크기를 줄여보겠습니다.

```js
import { View, Text, StyleSheet } from "react-native";

const Box = ({ children, style }) => {
  return (
    <View style={[styles.box, style]}>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    backgroundColor: "white",
    padding: 20,
    height: 50,
    width: 50,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Box;
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEjgkeKkOFKwWaC9wfkLC94gVWlIqQFcLV0BtIErRH_uTND_miiFxRsoYpARc2Li01std16Fh5mzTw_vID5mmKYg505v6bqdRVy1D_hjUBhU0T0OAmj8f99oEJ37pqqsDy2o5kFYm6cqrKc2wE4Ok39HQIcHOFojnWD6GlG8QrVUQmLVsXNP7LV4QZdLGck)

위 그림을 보시면 Box의 크기를 너무 극단적으로 줄인거 같습니다.

아무튼 `space-between`의 속성에 대해 알수 있을 겁니다.

다음 값은 `space-around`로, 줄 주위에 공간을 배치합니다.

중앙 부분은 가장자리보다 두 배의 공간을 가집니다.

```javascript
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: 300,
    flexWrap: "wrap",
    alignContent: 'space-around',
    marginTop: 64,
    borderWidth: 6,
    borderColor: "red",
  },
});
```

파일을 저장하면 중앙 부분이 가장자리보다 두 배의 공간을 가진 것을 볼 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhVBMJneXf7WCl0P8RRJxcz8TgV2GKLGB6aX95exUCaOIZbOjpgz4R6SHdOPZ8wQMZtOWnMWhrqiisgvVjXp4VWKKLb7WsNI2PWH7GCqiaxndVknNkfaoms4UnJfHUDFC2yM_WxPCsEnfKlXUzqPAE7e7DLf64ni-2UdZO4PD8CxK6qy0dXVM7-5Il5fl8)

마지막으로, `space-evenly`입니다.

```js
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: 300,
    flexWrap: "wrap",
    alignContent: 'space-evenly',
    marginTop: 64,
    borderWidth: 6,
    borderColor: "red",
  },
});
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEgWf8Jwd-eXGQ0vFqDN2k9gyJAF654N1vLr-ODW7y4QOtMT_0YATLZ7L5cLeOdL8RfL9rz175v8FAAWfbLm_BzQMmy6W4bTsdcNdPWzSuUluFt1hcEIU9PxtnkMa5x3m9KUuaF2EEdcXQjUxsbsofuMCwVCwdU4aRbV1t8FLZ5Jem4JPBGcp74W0vxDXOw)

위 그림을 보시면 열 사이의 공간이 딱 3등분된 걸 볼 수 있습니다.

요약하자면, `alignContent` 속성은 React Native에서 교차 축을 따라 콘텐츠의 줄을 정렬하고 부모 컨테이너 내에서 여분의 공간을 분배하는 데 사용됩니다.

가능한 값들은 `flex-start`(기본값), `flex-end`, `center`, `stretch`, `space-between`, `space-around`, `space-evenly`입니다.

---

## 간격(Gap)

이번에는 React Native에서 행과 열 사이의 간격을 관리할 수 있는 플렉스 속성들을 알아보겠습니다.

주로 다룰 속성은 `rowGap`, `columnGap`, 그리고 `gap`입니다.

코드로 돌아가서 이 속성들이 어떻게 작동하는지 살펴보겠습니다.

먼저, 컨테이너에 여러 개의 행과 열이 있는지 확인해보겠습니다.

이를 위해 `flex: 1`을 주석 처리하고 높이를 300으로 설정한 다음, `flexWrap`을 `wrap`으로 설정하겠습니다.

```javascript
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
    // flex: 1,
    height: 300,
    flexWrap: "wrap",
    marginTop: 64,
    borderWidth: 6,
    borderColor: "red",
  },
});

export default App;
```

이 스타일이 적용되면, UI에서 아이템들이 행과 열로 정렬된 것을 볼 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEg9wVVi1kucKPiPeukaOk6g73l2wXQF7mf_HOzeCf-3P2moZHpKXw2LPytKXcLJIVPIcaTDUmEpSksLXwXN4lbVQj6hQpVDYh0QNC11OJgRsvozKG_BmnGIbvZo6IY0fQUAUSMiwHZvnGqjDeLku38xdlM5K3KXeSUZhJeTFqPAXtqEfSsEbAA9JtMDc48)

이제 각 속성들을 살펴보겠습니다.

### `rowGap`

`rowGap` 속성은 행 사이의 간격을 설정합니다.

예를 들어, `rowGap`을 20으로 설정해보겠습니다.

```javascript
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: 300,
    flexWrap: "wrap",
    rowGap: 20,
    marginTop: 64,
    borderWidth: 6,
    borderColor: "red",
  },
});
```

파일을 저장하면, 행 사이에 간격이 생긴 것을 볼 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEimauRmjPqvlY5yK_lqvQPR9nDMvcKGKkqCWI7s6DZEWk2XxTCqZo8_LFXbg3hVWnr2w1Zxh4gYP8shlGRKlzuZleJppw8EpFkOPdPez0OjvOh4tzpLhHO0-k0I7IviF71Q5WP1m5PRUNBxtpALsSsIBKX_y9T1W0fcD6XQd58QK07mNNkEIWej_qNTnSM)

### `columnGap`

`columnGap` 속성은 열 사이의 간격을 설정합니다.

이를 30으로 설정해보겠습니다.

```javascript
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: 300,
    flexWrap: "wrap",
    rowGap: 20,
    columnGap: 30,
    marginTop: 64,
    borderWidth: 6,
    borderColor: "red",
  },
});
```

파일을 저장하면, 열 사이에도 간격이 생긴 것을 볼 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgmqaC7Dp1WDCR1aekHl7f42OPSJR5WmVI6SuKIvK01lCoK3isEtL6Ft4AQL0k7CX-IwgoGzVxx5xkrAwAteSdsiIgr3r1YNgd-YSPpYN2p4GbxW5p88feiKOQ7xOc2QX1P0g9XopOHBVtRi9Ht2Eggs3m_9dgaU7sYvRmnYl2N0N6k_WcJHrWF9zVmHvE)

### `gap`

`gap` 속성은 행과 열 모두에 동일한 간격을 설정할 때 사용합니다.

`gap`을 10으로 설정하고, `rowGap`과 `columnGap`을 주석 처리해보겠습니다.

```javascript
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: 300,
    flexWrap: "wrap",
    gap: 10,
    // rowGap: 20,
    // columnGap: 30,
    marginTop: 64,
    borderWidth: 6,
    borderColor: "red",
  },
});
```

파일을 저장하면, 행과 열 모두에 동일한 작은 간격이 생긴 것을 볼 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgUsT6q9tWkb0aYeSS3eSZVuJm6Sbp4FlJJ1SzymWro1MSjcFxGD44mK_S_vUUQywPQfQEl6jusnr5O1qW7VflfxeSE5kILRR_w0HXA1l3eC3RY0XXtS3zwNS-MuFvjQqy5N08gsKBGiDrDytVvegMA0U_3AD9oKG05H1IVZi42aBaakDgm2fS_MTJ9jAc)

요약하자면, 열 사이의 간격을 설정하려면 `columnGap` 속성을 사용하고, 행 사이의 간격을 설정하려면 `rowGap` 속성을 사용합니다.

행과 열 모두에 동일한 간격을 설정하려면 `gap` 속성을 사용하면 됩니다.
