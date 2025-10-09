---
slug: 2024-06-15-react-native-tutorial-6-flexbox-basis-shrink-grow-and-absolute-relative-layout-strategies
title: 리액트 네이티브 강좌. 6편 - Flexbox - basis, shrink, grow 및 레이아웃 전략
date: 2024-06-15 13:54:30.311000+00:00
summary: 이 강좌에서는 리액트 네이티브의 레이아웃 관리 방법을 자세히 설명합니다. 플렉스 기준(Flex Basis), 플렉스 축소(Flex Shrink), 플렉스 증가(Flex Grow)를 포함한 플렉스 박스의 주요 개념들을 배우고, 상대 레이아웃(Relative Layout)과 절대 레이아웃(Absolute Layout)의 차이점 및 적용 방법에 대해 알아봅니다.
tags: ["react native", "flexbox", "flex grow", "flex shrink", "flex basis", "relative layout", "absolute layout"]
contributors: []
draft: false
---

안녕하세요!

리액트 네이티브 강좌 6편입니다.

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

- [리액트 네이티브 강좌. 6편 - Flexbox - basis, shrink, grow 및 레이아웃 전략](#리액트-네이티브-강좌-6편---flexbox---basis-shrink-grow-및-레이아웃-전략)
  - [플렉스 기준(Flex Basis)](#플렉스-기준flex-basis)
  - [플렉스 축소(Flex Shrink)](#플렉스-축소flex-shrink)
  - [플렉스 증가(Flex Grow)](#플렉스-증가flex-grow)
  - [상대 레이아웃(Relative Layout)과 절대 레이아웃(Absolute Layout)](#상대-레이아웃relative-layout과-절대-레이아웃absolute-layout)
    - [상대 레이아웃(Relative Layout)](#상대-레이아웃relative-layout)
    - [절대 레이아웃(Absolute Layout)](#절대-레이아웃absolute-layout)
    - [요약](#요약)

---

## 플렉스 기준(Flex Basis)

이번에는 React Native에서 `flexBasis` 속성에 대해 알아보겠습니다.

`flexBasis` 속성은 컨테이너 내의 여분의 공간이 분배되기 전에 플렉스 아이템의 초기 크기를 결정합니다.

이는 플렉스 레이아웃에서 `height`와 `width` 속성을 사용하는 대안으로 작용합니다.

UI를 통해 더 잘 이해해보겠습니다.

먼저, 아무것도 지정하지 않은 상태의 코드와 스타일입니다.

```js
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
    marginTop: 64,
    borderWidth: 6,
    borderColor: "red",
  },
});

export default App;
```

해당되는 스크린샷도 아래와 같습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjGRLhIhpynh1um6tj1pvo_k7sUV-XLzZ2uJyv_hXQOK8xhwPk05PeQ8vMQe6tz-k4dnTyF5AyCN2GbzTFYI_pQIOeQIdmu91w5CkCS9AA9nGb7HuwV9gvlJEQb5Q6eCG0zGcYzOaTMIHHcDuq0pGJj5dOVbyv9TSNhrFMFnF0s-XRB1zGhlm3zKnaDjdc)

기본적으로 플렉스 아이템은 박스 모델에 따라 초기 높이가 결정됩니다.

아이템의 높이는 콘텐츠 크기와 패딩에 따라 수직 방향으로 결정됩니다.

하지만 특정 아이템을 의도적으로 더 높게 설정하고 싶다면 어떻게 해야 할까요?

이러한 경우에 `flexBasis` 속성을 사용할 수 있습니다.

코드에서 `Box 3`에 `flexBasis`를 140으로 설정해보겠습니다.

```javascript
<Box style={{ backgroundColor: "red", flexBasis: 140 }}>Box 3</Box>
```

UI를 보면 `Box 3`가 다른 박스들보다 두 배 높게 표시된 것을 볼 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhYoURJrW_s4722z4AdX2rDoiEg4Bmg1uaq893Z5MbJjLAcs_R_mxtVkZXQa6LKlUedwTkGenZ-CQ_JIhELyqZEdiiBN3sf1D0VsET3E-3yKvrU2JKviGV0V7fXVz5hmZyOjvwYCX0tTwYL1LPWVazl_kHl5i0Xh2tqrOM_Jiz66zxhrN45GkyvrP_byKQ)

이제, 왜 `height` 속성을 사용하지 않고 `flex basis`를 사용하는지 궁금할 것입니다.

`Box 4`에 높이를 140으로 설정해 보겠습니다.

```javascript
<Box style={{ backgroundColor: "red", flexBasis: 140 }}>Box 3</Box>
<Box style={{ backgroundColor: "purple", height: 140 }}>Box 4</Box>
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEiK7hoA7HrcHlXZ6j5waEgfD02R7q_Yn1U6_smciZ0q3WytMxF7j2N0kyiWFJkiYmkkJh44wt6KpLezgyj-haFvnyWhmURpS3T8DqGffd0sKqTESPwMUzPa00WYtS8s7G3cL6fJKibLpjt7KhqTwJx_OqKRqiiKcm_z4Mh3q7ewhrIUof2j-Y2VMKcPMjo)

위 그림을 보시면 `Box 3`와 `Box 4`의 높이가 똑같습니다.

결국 결과는 거의 동일합니다.

하지만 중요한 차이점이 있습니다.

`Box 3`와 `Box 4`가 컨테이너 내의 사용 가능한 공간을 차지하도록 설정하고 싶다면 어떻게 해야 할까요?

즉, `Box 7` 밑으로 조금의 여백이 있는데 이 공간까지 사용하고 싶을 때 말입니다.

이를 위해 `flex` 값을 1로 설정합니다.

```javascript
<Box style={{ backgroundColor: "red", flexBasis: 140, flex: 1 }}>
  Box 3
</Box>
<Box style={{ backgroundColor: "purple", height: 140, flex: 1 }}>
  Box 4
</Box>
```

파일을 저장하고 UI를 확인해보면, `Box 3`가 `Box 4`보다 더 높게 표시된 것을 알 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjo_CI6EjvCS7FoHmK6XuiY86XT0h5HisD2d8LJOBUQQRGg9EsGR8jkux8UYS9ruUWMArjIJodU3hcCSRE6jIHCui4kTJipiZLW-CLd86eRCjk3yLHIBlX4jcqUhiOGtuHZpmYO7Dh4_T5dY9aJ4rMkedzcATqfln0fw1-389h4QnPGdvdqPOAh-Joucxc)

이는 사용 가능한 공간이 `flexBasis`를 기준으로 비례적으로 분배되기 때문이지, `height` 속성을 기준으로 분배되지 않기 때문입니다.

또한, `flexBasis`는 부모 컨테이너의 `flexDirection`이 `row`일 경우 아이템의 초기 너비를 설정한다는 점도 주목할 만합니다.

즉, `flexBasis` 속성은 플렉스 아이템의 초기 크기를 설정하는 데 사용됩니다.

요약하자면, `flexBasis` 속성은 컨테이너 내에서 여분의 공간이 분배되기 전에 플렉스 아이템의 초기 크기를 설정하는 데 사용됩니다.

---

## 플렉스 축소(Flex Shrink)

이번에는 React Native에서 `flexShrink` 속성에 대해 알아보겠습니다.

`flexShrink` 속성은 컨테이너의 자식 요소들이 컨테이너 크기를 초과할 때, 주축을 따라 얼마나 줄어들지를 결정합니다.

이 축소 계수는 컨테이너 내의 다른 아이템들과 상대적입니다.

UI를 통해 `flexShrink` 개념을 명확히 이해하기 위해 코드 몇 가지를 수정하겠습니다.

우선, 일부 박스를 주석 처리하고 두 개의 박스만 렌더링하여 간단하게 만듭니다.

각 박스 텍스트에 "shrink"라는 단어를 추가하고, 컨테이너의 `flexDirection`을 `row`로 변경하며, `alignItems`를 `flex-start`로 설정하여 두 박스를 가로로 배치합니다.

마지막으로 컨테이너의 너비를 300으로 설정합니다.

```javascript
import { View, StyleSheet } from "react-native";
import Box from "../components/Box";

const App = () => {
  return (
    <View style={styles.container}>
      <Box style={{ backgroundColor: "blue" }}>Box 1 shrink</Box>
      <Box style={{ backgroundColor: "green" }}>Box 2 shrink</Box>
      {/* <Box style={{ backgroundColor: "red" }}>Box 3</Box>
      <Box style={{ backgroundColor: "purple" }}>Box 4</Box>
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
    alignItems: "flex-start",
    width: 300,
    marginTop: 64,
    borderWidth: 6,
    borderColor: "red",
  },
});

export default App;
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEiHPs64Kxwkmh8HIpuIWCykzyx18CdP5fm44k0PVkhM_KS2THXFCIVFNkyTV2VP95Rg2EjWVJPiegxsoviECAmY-YStbLIXDLoexeigAMGopUb3NT3OGtyO3lOQH-DWgyO-tq0NjeUUhg-xxH0G5bzabOvgNfMOnPTcamDVvWDpVVhgIBO9-VZSa0j9Z20)

이 결과로 두 아이템이 가로로 정렬되지만, 컨테이너의 너비가 300이기 때문에 오버플로우 됩니다.

초기 상태에서 모든 플렉스 아이템은 기본적으로 `flexShrink` 값이 0입니다.

그래서 아이템들이 컨테이너를 넘치게 됩니다.

하지만 `flexShrink`에 양의 값을 설정하여 축소 동작을 제어할 수 있습니다.

예를 들어, 두 번째 박스에 `flexShrink: 1`을 설정해보겠습니다.

```javascript
<Box style={{ backgroundColor: "blue" }}>Box 1 shrink</Box>
<Box style={{ backgroundColor: "green", flexShrink: 1 }}>
  Box 2 shrink
</Box>
```

이렇게 설정하면 두 번째 박스가 컨테이너 내에 맞도록 축소됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiy7fLxW34syZFWE62fxTq9rxixI34Qm7nvl6VaXzJB3BBAlNnZqu3yrDPgvMWs_d9Nj5Cd4j3MD-Ps5JIu6Z8reWvtTnT3lvBBu6mJnvhGSXxabqJGlrzCL-L9IlOc6aEmeEPMLM2mecpKZ6z70eRX3tWQ-nhse6QOJaQNYVZwmKQNNcU2vz5JnIDc6es)

두 박스 모두에 `flexShrink`를 설정하면, 두 박스는 동일하게 축소되어 컨테이너에 맞게 됩니다.

```javascript
<Box style={{ backgroundColor: "blue", flexShrink: 1 }}>Box 1 shrink</Box>
<Box style={{ backgroundColor: "green", flexShrink: 1 }}>
  Box 2 shrink
</Box>
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEiDO1Mx8fCQABLRbYV0e5CDpeoN4Nqjm9XAG_6GeL6h5uD92av7UJIA7emMXq3KeMI3cCo4XoyvKLclLs_qSu4j7bg8siaSN051yTCssxm1UST05NloXJV-clU6JlvswQVIs7LTytX-guSKsi5Lm8YE1Cz1GqpH3vja5I6bAxRYkazhoadKh3WuIEgr8MY)

축소 계수는 다른 아이템들과 상대적입니다.

예를 들어, 두 번째 박스에 `flexShrink: 2`를 설정하면 첫 번째 박스보다 두 배 더 많이 축소됩니다.

```javascript
<Box style={{ backgroundColor: "blue", flexShrink: 1 }}>Box 1 shrink</Box>
<Box style={{ backgroundColor: "green", flexShrink: 2 }}>
  Box 2 shrink
</Box>
```

이렇게 설정하면 두 번째 박스의 너비가 첫 번째 박스보다 더 적게 표시됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgT4RIIbTS_pb-Qd5Uc4CGuZpgD7p2T9NtYiwBrkloNnZIyiuYPvyB77VvQsyJIpyWNGmIZM2PVNC0XaVAhkKxaR2uH5Nv7MI3oXfCzfRuGoUp_nJ1UICXYG7sroEBak8N9AvGnTKskncev7GrS2RHiqPrAc8GL82j-PN71d4VAMrpi69Q8Sut1iwJzWGI)

요약하자면, `flexShrink` 속성은 플렉스 아이템의 기본 크기가 플렉스 컨테이너보다 클 때 아이템들이 어떻게 동작할지를 결정합니다.

기본적으로 모든 플렉스 아이템의 `flexShrink` 값은 0이므로 아이템들이 컨테이너를 넘치게 됩니다.

하지만 `flexShrink`에 양의 값을 설정하면 아이템들이 필요할 때 축소되며, 축소 비율은 컨테이너 내의 다른 아이템들과 상대적입니다.

---

## 플렉스 증가(Flex Grow)

이번에는 React Native에서 `flexGrow` 속성에 대해 알아보겠습니다.

`flexGrow` 속성은 플렉스 컨테이너 내에서 여분의 공간이 있을 때 아이템이 얼마나 많은 공간을 차지해야 하는지를 결정합니다.

`flexShrink`와 유사하게, `flexGrow` 계수는 컨테이너 내의 다른 아이템들과 상대적입니다.

UI를 통해 `flexGrow`가 어떻게 작동하는지 이해해보겠습니다.

기본적으로 플렉스 아이템은 콘텐츠를 담기 위해 필요한 공간만 차지합니다.

따라서 컨테이너 내에 여분의 공간이 생깁니다.

하지만 플렉스 아이템이 성장하여 남은 공간을 채우도록 하고 싶은 경우가 있습니다.

기본적으로 모든 플렉스 아이템은 `flexGrow` 값이 0으로 설정되어 있어 여분의 공간을 사용하지 않습니다.

이 동작을 변경하려면 양의 값을 사용하여 `flexGrow` 속성을 설정할 수 있습니다.

먼저, `Box 5`의 `flexGrow`를 0으로 설정하고 파일을 저장해보겠습니다.

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
      <Box style={{ backgroundColor: "orange", flexGrow: 0 }}>Box 5</Box>
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

![](https://blogger.googleusercontent.com/img/a/AVvXsEg7ZLTOhn0SjO_TxXEtauSO-maYPDUBCx26_o5Cvny2mfbUumKqsEqxpXSZv917hxutDRZIOImuBrqmKMAZKNKgLC-iEUPb6bon1sbyvDX7gOb9rNV_F0adhVLZPW9hKPkzkXyIkiR0Gw8V46J-Fn6OXRxF5SyukBUr0hnQSyKEg4-W9Oba3v35Gzmkhac)

파일을 저장하면 변화가 없음을 알 수 있습니다.

이는 0이 기본값이기 때문입니다.

이제 `Box 5`에 `flexGrow`를 1로 설정하고 다시 저장해보겠습니다.

```javascript
<Box style={{ backgroundColor: "orange", flexGrow: 1 }}>Box 5</Box>
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEijZBwNrTN5rbpSdUbwARBQV6Twk31DoEaHe36HP8Z9G979_AVvxCpx3vPKPR3mClzbmrnYJIE5CWK0-v8Ga3g3zQDZyo0_VSX1jFkVmNwglXris65aeIP7kiTdGv-mGVAoGqsd70fNnQi7gVlNwfTWpeagqMX9IDqWzbVg_d82gRx6mGJHziUKi_Euj5w)

이제 `Box 5`가 남은 공간을 차지하도록 성장한 것을 볼 수 있습니다.

동일한 설정을 `Box 6`에도 적용해보겠습니다.

```javascript
<Box style={{ backgroundColor: "orange", flexGrow: 1 }}>Box 5</Box>
<Box style={{ backgroundColor: "pink", flexGrow: 1 }}>Box 6</Box>
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEj4gQtvPYZH17XGJgew6Ha6tRtjP3NUFLajzEkZ5_IiFlARCKNdN3-dC2XxwgyhA3ASAkshnXldFixk52mfgpCaht1_MMOmxxMkkW3VmKzyt8dNf91i3LueirbVF-MczXLTsp0TOW6UaIU1CoJLG2xeuuJzPrQSwE59k_ao21k8f5s8B5JJY2RVzdVxOoE)

이제 `Box 5`와 `Box 6`가 여분의 공간을 균등하게 나눠 차지하는 것을 볼 수 있습니다.

예를 들어, 100픽셀의 여분 공간이 있다면 두 아이템은 각각 50픽셀씩 성장합니다.

`Box 6`의 `flexGrow` 값을 1에서 3으로 변경해보겠습니다.

```javascript
<Box style={{ backgroundColor: "pink", flexGrow: 3 }}>Box 6</Box>
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEgXAX7kiXtKFjnu4vMzNCGttIw0m7p4vLwlHTtKhS6zlDks0P6ePWc7o3EGTVlQYDK98j5gSZQDD-Z_x-NRbR9vCOLRq--bcvXa3qgn-9dpM2bj4V42ToyejZPToi-O_yOy7toF84gDGAyiXFd1s6dWS0Ix5iP-XmwM1H4hjg8Gt4d44Q3yOnNI5FC42Xc)

이제 `Box 6`가 `Box 5`보다 세 배 더 많은 공간을 차지하는 것을 볼 수 있습니다.

즉, `Box 5`가 25픽셀 성장한다면, `Box 6`는 75픽셀 성장하게 됩니다.

모든 아이템이 여분의 공간을 균등하게 차지하도록 하려면, 모든 플렉스 아이템에 `flexGrow`를 1로 설정할 수 있습니다.

```javascript
<View style={styles.container}>
  <Box style={{ backgroundColor: "blue" }}>Box 1</Box>
  <Box style={{ backgroundColor: "green" }}>Box 2</Box>
  <Box style={{ backgroundColor: "red" }}>Box 3</Box>
  <Box style={{ backgroundColor: "purple" }}>Box 4</Box>
  <Box style={{ backgroundColor: "orange" }}>Box 5</Box>
  <Box style={{ backgroundColor: "pink" }}>Box 6</Box>
  <Box style={{ backgroundColor: "yellow" }}>Box 7</Box>
</View>
```

Box 컴포넌트에서 `box` 스타일시트를 수정합니다.

```js
const styles = StyleSheet.create({
  box: {
    backgroundColor: "white",
    padding: 20,
    flexGrow: 1,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
});
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEjLXHC5iEHpSMT8zZwcTOXO6jfSCkXudkAlNK1R6RIN2HlQIKHBAXg-CswcVrEBYrGNBp2zE_2NIb-S8Q9nrkUnYaSHNefC0bNWm6QaZ17YfAhy_LMPXiB-7rj-zdhLer2mU2Tn4IqSCzq8dn6H1YnlJKw0Ct3NoNWfsUS-FKI_N2I2qomx8l0fDIupwKc)

이렇게 하면 모든 아이템이 남은 공간을 균등하게 차지하여 더 깔끔한 레이아웃을 얻을 수 있습니다.

요약하자면, `flexGrow` 속성은 플렉스 컨테이너 내에서 아이템이 차지해야 할 여분의 공간을 결정합니다.

`flexGrow` 계수는 컨테이너 내의 다른 아이템들과 상대적입니다.

기본값인 0은 아이템이 성장하지 않음을 의미합니다.

모든 플렉스 아이템에 `flexGrow`를 1로 설정하면 여분의 공간을 균등하게 차지합니다.

마지막으로, `flex` 속성에 대해 처음 배운 내용을 기억하실 것입니다.

`flex` 속성을 양의 숫자로 설정하면, 이는 동일한 숫자로 `flexGrow`를 설정한 것과 같습니다.

하지만 `flex` 속성은 또한 `flexShrink`를 1로, `flexBasis`를 0으로 암묵적으로 설정합니다.

따라서 아래와 같은 `flex` 값이 있다고 하면,

```sh
flex : 양수1
```

이론적으로 위 코드는 아래 코드와 같습니다.

```sh
flexGrow: 양수1, flexShrink: 1, flexBasis: 0
```

예를 들어 `flex: 1`은 `flex grow: 1`, `flex shrink: 1`, `flex basis: 0`과 동일한 결과를 얻습니다.

---

## 상대 레이아웃(Relative Layout)과 절대 레이아웃(Absolute Layout)

이번에는 React Native에서 두 가지 중요한 레이아웃 타입인 `relative`와 `absolute` 레이아웃에 대해 알아보겠습니다.

이 레이아웃들은 요소가 부모 컨테이너 내에서 어떻게 위치되는지를 정의하는 `position` 속성에 기반합니다.

`position` 속성에는 `relative`와 `absolute` 두 가지 가능한 값이 있습니다.

먼저, `relative` 레이아웃을 살펴보겠습니다.

`position` 속성의 기본값은 `relative`입니다.

이 레이아웃에서는 요소가 레이아웃의 정상적인 흐름에 따라 위치합니다.

요소는 원래 위치에 유지되며, `top`, `right`, `bottom`, `left` 값을 사용하여 그 위치에서 오프셋될 수 있습니다.

중요한 점은 이 오프셋이 다른 형제 요소나 부모 요소의 위치에 영향을 미치지 않는다는 것입니다.

반면에 `absolute` 레이아웃에서는 요소가 레이아웃의 정상적인 흐름에 참여하지 않습니다.

대신, 형제 요소들과 독립적으로 배치됩니다.

요소의 위치는 `top`, `right`, `bottom`, `left` 값에 의해 결정되며, 이는 부모 컨테이너를 기준으로 한 특정 좌표를 지정합니다.

이제 VS Code로 돌아가 UI를 통해 이를 이해해보겠습니다.

먼저, 각 박스를 정사각형으로 변환하여 `width`와 `height`를 100으로 설정하겠습니다.

```js
// Box 컴포넌트에서

const styles = StyleSheet.create({
  box: {
    backgroundColor: "white",
    padding: 20,
    width: 100,
    height: 100,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
});
```

이렇게 하면 UI에 7개의 정사각형 박스가 표시됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEi3ByJEZkQd5Rh5CXkgVDHtP7mCchyJOlYJiS0URxPRSE5PJIGmvahuZMb_1wjFvQwhAKu86cT9vYGub_sZCC6MdrJtvAiSLCoXBafzM08yh0pL4Ljus9mDZFQqQOS0D7cYsD_DzCRq7Zjb169elBxUm5MBc9FlO5GzJQgnFznpIZRGCNaNbk5JOyRMtLQ)

### 상대 레이아웃(Relative Layout)

먼저 기본값인 상대 레이아웃을 살펴보겠습니다.

컨테이너의 요소들은 레이아웃의 정상적인 흐름에 따라 배치됩니다.

요소를 오프셋하면 항상 원래 위치를 기준으로 오프셋됩니다.

```javascript
<View style={styles.container}>
  <Box style={{ backgroundColor: "blue", top: 75, left: 75 }}>Box 1</Box>
  <Box style={{ backgroundColor: "green" }}>Box 2</Box>
  <Box style={{ backgroundColor: "red" }}>Box 3</Box>
  <Box style={{ backgroundColor: "purple", top: 75, left: 75 }}>Box 4</Box>
  <Box style={{ backgroundColor: "orange" }}>Box 5</Box>
  <Box style={{ backgroundColor: "pink" }}>Box 6</Box>
  <Box style={{ backgroundColor: "yellow" }}>Box 7</Box>
</View>
```

위 코드를 보면 `Box 1`과 `Box 4`가 각각 `top: 75`와 `left: 75`로 오프셋되었습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiaR3TrO54Tej2jLr4WBq4FkO1GYyg9HUu4SjtBM54GIaL8GO2FYTWwsalzUzMSygxVVFZJxrOWVw2-joNwy0DAVIEfUYXiougoOlj2eZOY3UUB1z6hkSCTvgKUOAUJpzJ97_FCnXhNcaLfeFafI55d3tIKJ9cNWziN08tnD_2F4-cRsndx7FFUCqR3oNI)

UI를 보면 두 박스가 원래 위치에서 오프셋된 것을 볼 수 있으며, 이 오프셋이 다른 형제 요소의 위치에 영향을 미치지 않습니다.

### 절대 레이아웃(Absolute Layout)

이제 `absolute` 위치를 지정해보겠습니다.

이제 `Box 4`에 `absolute` 위치를 지정하고, `top`을 100, `left`를 100으로 설정해보겠습니다.

```javascript
<Box
  style={{
    backgroundColor: "purple",
    position: "absolute",
    top: 100,
    left: 100,
  }}
>
  Box 4
</Box>
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEg7cqbnGPVIfk4ZCLT_ufaxoZoiovedBYeJgQ8Ii0vvU_DjTdjRFRrO6P5rsT1esBH9a8RRrg8z1TMYiMia0zEP2qxzrEMr-d0xJ3EHgjz8KzATeJlDc1A_YKekQdI18M1m_W4HMwo-56ZXMzRoHcpCD5zHaVFlkK1AUOkjiaRV5j0uj0YdtYgQ7LryaoQ)

UI를 보면 `Box 4`가 부모 컨테이너의 왼쪽 위 모서리를 기준으로 100픽셀 떨어진 위치에 배치된 것을 볼 수 있습니다.

또한, `Box 4`가 레이아웃의 정상적인 흐름에 참여하지 않기 때문에 `Box 3` 다음에 `Box 5`가 이어지며, `Box 4`가 원래 있던 공간에 빈 공간이 남아 있지 않습니다.

### 요약

상대 레이아웃은 반응성과 적응성이 중요한 경우에 사용하기 좋습니다.

이는 다양한 화면 크기와 방향을 처리하는 데 더 유지보수 가능하고 유연한 접근 방식을 제공합니다.

절대 레이아웃은 UI 구성 요소의 위치와 크기를 정확하게 제어해야 할 때, 그리고 고정된 좌표로 사용자 정의 애니메이션을 만들 때 유용합니다.

지금까지 React Native에서 레이아웃에 대해 알아봤습니다.

그래서 플렉스박스 모델을 사용하여 요소를 배치하는 방법과 플렉스박스가 제공하는 다양한 속성들, 그리고 상대 레이아웃과 절대 레이아웃의 차이점을 이해할 수 있었습니다.

그럼.