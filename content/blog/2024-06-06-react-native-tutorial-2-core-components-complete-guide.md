---
slug: 2024-06-06-react-native-tutorial-2-core-components-complete-guide
title: 리액트 네이티브 강좌. 2편 - 핵심 컴포넌트 가이드 - 뷰, 텍스트, 이미지부터 커스텀 컴포넌트까지
date: 2024-06-06 01:50:07.363000+00:00
summary: View, Text, Image 같은 기본 컴포넌트부터 ScrollView, Button, Pressable, Modal, StatusBar, ActivityIndicator, Alert, 그리고 Custom Component까지 다양한 컴포넌트를 상세히 소개합니다.
tags: ["react native", "core components"]
contributors: []
draft: false
---

안녕하십니까?

리액트 네이티브 강좌 2편입니다.

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

- [리액트 네이티브 강좌. 2편 - 핵심 컴포넌트 가이드 - 뷰, 텍스트, 이미지부터 커스텀 컴포넌트까지](#리액트-네이티브-강좌-2편---핵심-컴포넌트-가이드---뷰-텍스트-이미지부터-커스텀-컴포넌트까지)
  - [Core Components](#core-components)
  - [View Component](#view-component)
  - [Text Component](#text-component)
  - [Image Component](#image-component)
  - [ScrollView](#scrollview)
  - [Button Component](#button-component)
  - [Pressable Component](#pressable-component)
  - [Modal Component](#modal-component)
  - [StatusBar Component](#statusbar-component)
  - [ActivityIndicator Component](#activityindicator-component)
  - [Alert Component](#alert-component)
  - [Custom Component](#custom-component)

--

## Core Components

웹 사용자 인터페이스를 만들 때 우리는 종종 `div`, `span`, `p`와 같은 HTML 태그를 사용합니다.

아래는 `div`와 `p` 태그를 사용하여 브라우저에 "Hello World"를 렌더링하는 예제 리액트 컴포넌트입니다.

```jsx
import React from 'react';

function HelloWorld() {
  return (
    <div>
      <p>Hello World</p>
    </div>
  );
}

export default HelloWorld;
```

여기서 중요한 점은 우리가 웹을 위해 작성하는 JSX 요소는 브라우저가 이해하는 HTML에 특화되어 있다는 겁니다.

리액트 네이티브를 사용할 때는 이러한 요소들이 작동하지 않는데, 이는 리액트 네이티브가 DOM 즉, 한국어로 번역하면 조금 이상한데 "Document Object Model - 문서 객체 모델"의 개념을 포함하지 않기 때문입니다.

안드로이드와 iOS 개발에서는 사용자 인터페이스를 위해 뷰(View)라는 기본적인 빌딩 블록을 사용합니다.

뷰는 화면에 텍스트, 이미지 또는 사용자 입력에 응답할 수 있는 작은 직사각형 요소입니다.

안드로이드 개발에서는 Kotlin 또는 Java로, iOS 개발에서는 Swift나 Objective-C로 뷰를 작성합니다.

리액트 네이티브를 사용하면 이 과정이 더 간단해집니다.

자바스크립트를 통해 리액트 컴포넌트를 사용하여 이러한 뷰를 생성할 수 있으며, 런타임 시 리액트 네이티브가 해당 컴포넌트에 대해 안드로이드와 iOS 뷰를 생성합니다.

실제로 리액트 네이티브는 핵심 컴포넌트(Core Components)라고 불리는 필수적이며 Reusable한 컴포넌트 모음을 제공하며, 이는 네이티브 앱의 사용자 인터페이스를 구축하는 데 사용할 수 있습니다.

다음은 안드로이드, iOS, 웹에서의 핵심 컴포넌트와 그에 대응하는 요소를 보여주는 표입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEg4R182PHW8yBBxCKSKwh-FLpMVXEGRk_skmkCtBa-EMPSmhtGYOHyJP0QIgi2vkbQZdoVpmvO66WKvjvC7E5S6lo57RdNVvBwDsv5iTbBeBgOlW6a5AXgwYHK-XpuaHI7tC1XXm2CXuP74fecrlb__Nj9bCLQInOlSa7J6Zwca0Z9jV79gT3PAKwhd_-U)

또한, 웹을 위한 리액트 컴포넌트를 만드는 것과 리액트 네이티브를 사용하는 것 사이의 중요한 차이점은 리액트 네이티브에서는 핵심 컴포넌트를 `react-native` 라이브러리에서 임포트해야 한다는 겁니다.

반면, 웹 개발을 위한 리액트에서는 `div`, `span`, `p` 같은 HTML 요소를 임포트하지 않습니다.

---

## View Component

리액트 네이티브의 첫 번째 핵심 컴포넌트인 View 컴포넌트에 대해 알아보겠습니다.

View 컴포넌트는 리액트 네이티브에서 사용자 인터페이스를 만드는 데 사용되는 기본적인 빌딩 블록입니다.

이 컴포넌트는 레이아웃을 지원하며, flex 스타일링, 터치 핸들링 및 접근성 제어 기능을 제공합니다.

웹 개발에서 볼 때 View 컴포넌트는 div 태그와 비교할 수 있습니다.

리액트 네이티브에서 View 컴포넌트는 일반적으로 다른 View 내에 중첩되며, 0개 이상의 다양한 자식을 가질 수 있습니다.

웹에서의 리액트와 같이 이런 특성으로 코드를 이용해서 UI를 구현할 수 있는겁니다.

터미널에서 다음 명령어를 실행합시다.

지난 시간에 hello-world 템플릿을 지워버리고 완전히 백지에서 다시 시작합니다.

```bash
npx create-expo-app@latest core-components --template blank@sdk-51
```

엑스포 버전 51으로 현재 기준 최신 버전입니다.

먼저, core-components 폴더로 이동하여 다음 명령어를 실행합시다.

```bash
npm start
```

위 명령어는 웹개발과는 다르게 개발 서버를 시작합니다.

터미널이 포커스된 상태에서 'i' 키를 눌러 iOS 시뮬레이터를 열어 애플리케이션을 실행하세요.

터미널에서 'r' 키를 눌러 앱을 리로드할 수 있습니다.

앱 번들링 표시가 나오면 앱이 실행되는 거 같은데요.

App.js 파일에서 앱을 작성하라고 나옵니다.

먼저, 깨끗한 상태로 시작하기 위해 `App.js` 파일 내용을 삭제하고 아래와 같이 짜겠습니다.

앱 컴포넌트는 앱이 로드될 때 렌더링되는 루트 컴포넌트입니다.

이제 새로 시작했으니, 리액트 네이티브 라이브러리에서 View 컴포넌트를 임포트해 봅시다.

```jsx
import { View } from 'react-native';
```

다음으로, `App`이라는 새로운 컴포넌트를 정의하고 이를 기본 익스포트로 만듭니다.

```jsx
export default function App() {
  return (
    <View></View>
  );
}
```

이제 코드를 설정했으니 파일을 저장하고 iOS 시뮬레이터와 안드로이드 에뮬레이터를 확인해 봅시다.

화면에 아무것도 표시되지 않는 것을 볼 수 있습니다.

View가 제대로 렌더링되고 있는지 확인하기 위해 View 컴포넌트에 인라인 스타일로 배경색을 추가해 보겠습니다.

이는 웹의 인라인 스타일과 유사합니다.

```jsx
export default function App() {
  return (
    <View style={{ backgroundColor: 'plum' }}></View>
  );
}
```

파일을 다시 저장해도 여전히 아무것도 보이지 않습니다.

그 이유는 View 컴포넌트가 자식이 차지하는 공간만 차지하기 때문입니다.

현재 View에는 자식이 없으므로 View 컴포넌트는 아무것도 차지하지 않아서 결국 아무것도 보이지 않는겁니다.

View가 화면의 전체 사용 가능한 공간을 차지하도록 하려면 또 다른 스타일 속성인 `flex`를 지정해야 합니다.

```jsx
export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: 'plum' }}></View>
  );
}
```

`flex: 1`을 스타일 속성으로 추가하면 View가 유연하게 확장되어 화면의 모든 사용 가능한 공간을 차지하게 됩니다.

이제 파일을 저장하면 화면 전체를 차지하는 자주색 배경의 View를 볼 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjkWXTlxuCfmowDYH7VGXIaQOXFOOsXOCJhsyb7bVlQWTopWqqMPP0CHvXGN3DttGNGDE1ltwcL-PnJW5Cq7SRqAP1DXLdVP8q06LqLfOT3QMWG5_XXwSxX8UuhgoQGjUg5hcf6Re8wGN_oV4oY02h484lZWbWgvCENzV4eZvr36RwkyAn5F4z9X4uKgrY)

이제 View 컴포넌트가 다른 View를 중첩할 수 있다는 것도 살펴보겠습니다.

중첩된 View를 추가해 봅시다.

```jsx
export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: 'plum' }}>
      <View style={{ backgroundColor: 'lightblue', height: 200, width: 200 }}></View>
    </View>
  );
}
```

화면을 확인하면 외부 View 내에 중첩된 새로운 View를 볼 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEinl3z10PnAxfIUpZT8J1Vea8TVeheFCtZ8xZTJVXTkjg_EzpNrBc8a93oOiNSBajFaMWg3qeJ42TGsnRQ1lUEfoi_D-boC175JHa_f2CBdKiAAzJ_sI2DbzejXD4Jlv9h0WXeZooVvwPD3JA0rsoy3h1Jx4A1nftx-pa9aUFEFglAGD7AbTtHfs5VDwHg)

이번에는 이 View를 복제하고 배경색을 연두색으로 변경해 보겠습니다.

```jsx
export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: 'plum' }}>
      <View style={{ backgroundColor: 'lightblue', height: 200, width: 200 }}></View>
      <View style={{ backgroundColor: 'lightgreen', height: 200, width: 200 }}></View>
    </View>
  );
}
```

파일을 저장하면 이번에는 연두색 배경의 또 다른 View가 외부 View 내에 중첩된 것을 볼 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEi7Q8AXcL2YtT33E6vdVgHoQCjxPcMdOIQzgofJ5kKpeiNwXXEE9GJlRhDtHnhHzmkG9F2sOmhgHpBdeokk6gbLBrKt-yYFcS61pIIYT9cO-ZobC-19pZzoR8g4oDSOuFQZtNjgPfwJrd0ZcbrKz6fjkLmK2EbyWFNlwx2fljjbm3qNZLdo2PUJ31tkEz4)

요약하자면, View 컴포넌트는 리액트 네이티브에서 사용자 인터페이스를 만드는 데 중요한 핵심 컴포넌트입니다.

또한, 레이아웃과 스타일링을 지원하는 컨테이너 역할을 합니다.

View 컴포넌트를 사용하기 전에 임포트하는 것을 잊지 말고, 중첩된 뷰를 사용해 복잡한 사용자 인터페이스를 만들 수 있다는 점을 이해하시기 바랍니다.

---

## Text Component

다음으로 배울 핵심 컴포넌트는 텍스트 컴포넌트입니다.

이름에서 알 수 있듯이, 텍스트를 표시하는 컴포넌트입니다.

이 컴포넌트는 중첩, 스타일링 및 터치 핸들링을 지원합니다.

타겟 플랫폼에 따라 리액트 네이티브는 이 컴포넌트를 iOS에서는 `UITextView`, 안드로이드에서는 `TextView`, 웹에서는 `p` 태그로 변환합니다.

먼저, 외부 뷰 컴포넌트 내에 코드를 작성해 보겠습니다.

두 개의 중첩된 뷰를 삭제하고 대신 "hello world" 텍스트를 추가해 보겠습니다.

```jsx
export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: 'plum', padding: 60 }}>
      Hello World
    </View>
  );
}
```

파일을 저장하면 오류가 발생하는 것을 볼 수 있습니다.

```sh
Error: Text strings must be rendered within a <Text> component.

This error is located at:
    in RCTView (created by View)
    in View (created by App)
    in App (created by withDevTools(App))
    in withDevTools(App)
    in RCTView (created by View)
    in View (created by AppContainer)
    in RCTView (created by View)
    in View (created by AppContainer)
    in AppContainer
    in main(RootComponent), js engine: hermes
 ERROR  Error: Text strings must be rendered within a <Text> component.

This error is located at:
    in RCTView (created by View)
    in View (created by App)
    in App (created by withDevTools(App))
    in withDevTools(App)
    in RCTView (created by View)
    in View (created by AppContainer)
    in RCTView (created by View)
    in View (created by AppContainer)
    in AppContainer
    in main(RootComponent), js engine: hermes
```

이 오류는 리액트 네이티브에서 모든 텍스트 노드는 반드시 텍스트 컴포넌트 내에 감싸져야 하기 때문에 발생합니다.

뷰 컴포넌트 아래에 직접 텍스트를 배치하는 것은 허용되지 않습니다.

리액트 네이티브를 시작할 때 자주 겪는 오류 중 하나입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjHerT1LU0EgKD-jkl8H3FA3KQdHpW9aLG-y3rVfH37p_ehJjm5e7EhrjNrScYcHQAwX7UysMPefNknShD25K-ZcR1UrUfN8HJjysakDII_WXmYpkXX8N524AeWhhAk89T4oy1710jEwjTFGGdLiGNvKy2Bwc8I-nhkdNGFTGOiPqZD5Lh84Y7YriFre7Q)

이 오류를 해결하려면, 리액트 네이티브에서 텍스트 컴포넌트를 임포트하고, "hello world" 텍스트를 텍스트 컴포넌트로 감싸야 합니다.

```jsx
import { View, Text } from 'react-native';

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: 'plum' }}>
      <Text>Hello World</Text>
    </View>
  );
}
```

이 변경을 하고 파일을 저장하면, 시뮬레이터와 에뮬레이터에서 텍스트가 표시되는 것을 볼 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEj_bAhnJf3SIg8SJdEpicuE9EQTsWdH7R92LGljb4n0ODh14_kUIEffkk7gmU1Q6cIo01DGWAEsKKZds7m-UbCK5v1WBxKbkhzpQDAypezOfCL5Bjh1eJh7101_DKyiBrt94swePFDwyUi6RcwLjrRyLGRTG6w1TbYXqucAtXhqjD0Y0H609ZQI0jzr_0Y)

위치가 조금 어색하므로, 외부 뷰 컨테이너에 패딩을 추가해 보겠습니다.

```jsx
export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: 'plum', padding: 60 }}>
      <Text>Hello World</Text>
    </View>
  );
}
```

파일을 저장하면 텍스트의 위치가 더 좋아진 것을 볼 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgqhkzpYn1NHEN3L5-AVLKWtpHufuXOX2yqyqFqYL6H4j9IXQzU8Zo0I6efB3MKz6mMFFjvVXPwYtzofzvjI2KrXbYojDf-fShUCU66brrhCvnJj0RcdXg1QpsNmFKLg1DANGhw-bk4bHvYZN3Od6xW6bmcvfrD-wVjuZ9g2UYIds8vBdNx34o9Sg_VimU)

완벽하지는 않지만, 훨씬 나아졌습니다.

다음으로 텍스트 컴포넌트를 중첩하는 것을 탐구해 보겠습니다.

예를 들어, "hello"라는 단어를 흰색으로 표시하고 싶다고 가정해 보겠습니다.

이를 위해 "hello" 텍스트를 또 다른 텍스트 컴포넌트 태그 쌍으로 감쌀 수 있습니다.

```jsx
export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: 'plum', padding: 60 }}>
      <Text>
        <Text style={{ color: 'white' }}>Hello</Text>
        World
      </Text>
    </View>
  );
}
```

이 내부 텍스트 컴포넌트에 스타일 속성을 추가하고 색상 속성을 흰색으로 설정할 수 있습니다.

이렇게 하면 "hello"라는 단어가 흰색으로 표시됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEj5FrqxJDYc3xWeAKOuop44sHRJrkglPL1MrVx61nThHlees7nsqcIWLb-EJUWYOeOalbkmYbMo3JtLe_8_ANVTR5RwGNhI4Wj34LBr0dv8UQyQc-VPg1n1vNKw3KsU3TCTg7WKcJPWqFLfElIyofkhDvmCrQBbQKVC0HiwprpLumpCm3vVAa2LI37ayeo)

디바이스를 보면, "hello"는 흰색으로 표시되고 "world"는 검은색으로 남아 있는 것을 확인할 수 있습니다.

요약하자면, 텍스트 컴포넌트는 리액트 네이티브에서 텍스트를 표시하는 데 필수적입니다.

뷰 내의 모든 텍스트 노드는 반드시 텍스트 컴포넌트로 감싸야 한다는 점을 기억합시다.

또한, 텍스트 컴포넌트를 중첩하는 것도 가능합니다.

---

## Image Component

이번에 다룰 핵심 컴포넌트는 이미지 컴포넌트입니다.

이미지 컴포넌트를 사용하면 다양한 유형의 이미지를 표시할 수 있습니다.

여기에는 정적 이미지, 네트워크 이미지, 그리고 카메라 롤과 같은 로컬 디스크에서 가져온 이미지가 포함됩니다.

리액트 네이티브는 이미지 컴포넌트를 플랫폼별로 자동 변환하여 iOS에서는 `UIImageView`, 안드로이드에서는 `ImageView`, 웹에서는 `img` 태그로 변환합니다.

먼저, assets 폴더에 있는 정적 이미지를 렌더링해 보겠습니다.

예제로 `adaptive-icon.png` 파일을 사용하겠습니다.

리액트 네이티브에서 이미지 컴포넌트를 임포트하는 것부터 시작합니다.

```jsx
import { View, Image } from 'react-native';
```

다음으로, assets 폴더에서 이미지를 임포트합니다.

```jsx
const logoImage = require('./assets/adaptive-icon.png');
```

이제 JSX 코드에서 이미지 컴포넌트를 호출하고 source 속성을 지정합니다.

```jsx
export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: 'plum', padding: 60 }}>
      <Image source={logoImage} />
    </View>
  );
}
```

파일을 저장하고 두 디바이스에서 확인하면 이미지가 렌더링되지만 크기가 너무 큰 것을 볼 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjRbqelFm_G9iyB_54I-OWHoVPZY0nRUB98WetdkEcY-A8QMTpG0NGHKcC9OmwZ3CHX8VrgumaN_v6-tllZALI3Wg_taWogEIlBSrOg0uC9v19Sxs4hjYYVDevuASzGhDKgFAUESsqbohPngizLSkZ5XgNIV4DRWTy12WoT45sZkyUakbWiJ4z5FMWeCig)

이를 해결하기 위해 이미지에 width와 height를 추가해 보겠습니다.

```jsx
<Image source={logoImage} style={{ width: 300, height: 300 }} />
```

파일을 저장하면 이미지가 뷰 내에서 적절한 크기로 표시되는 것을 볼 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjRbqelFm_G9iyB_54I-OWHoVPZY0nRUB98WetdkEcY-A8QMTpG0NGHKcC9OmwZ3CHX8VrgumaN_v6-tllZALI3Wg_taWogEIlBSrOg0uC9v19Sxs4hjYYVDevuASzGhDKgFAUESsqbohPngizLSkZ5XgNIV4DRWTy12WoT45sZkyUakbWiJ4z5FMWeCig)

다음으로, 네트워크 요청을 통해 이미지를 로드해 보겠습니다.

이미지 컴포넌트 라인을 복제하고 source 속성을 원격 이미지 URI로 변경합니다.

```jsx
<Image source={{ 'https://picsum.photos/300' }} style={{ width: 300, height: 300 }} />
```

파일을 저장하면 경고가 발생합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjrQjxvWybinw7iMykWZCppFYMsU7xhJUvsnpYKmt3z4QbxXJO9pd-RqK1z2sjYeVdruhRdTULQ0VYE7CTAWS9ycaBqOz7QYWkAlfzzw6I7PzL5sGW_bOM5ksAkqDzfeu3HlEIyHRXaVkSv_0JomxSOzfO0_JqNDKjlrZ7iaiTUr0mssOlvCDc54_pxFDI)

이 경고는 source 속성이 숫자를 기대하지만 문자열을 제공했기 때문에 발생합니다.

`logoImage`를 값으로 사용할 때는 assets 폴더의 이미지를 참조하는 숫자를 전달합니다.

원격 이미지를 source로 지정하려면 값을 객체로 변환하고 `uri` 키를 포함해야 합니다.

```jsx
<Image source={{ uri: 'https://picsum.photos/300' }} style={{ width: 300, height: 300 }} />
```

화면을 다시 확인하면 이미지가 렌더링되는 것을 볼 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiW5AsRzemP5NHXzc66A3a3vCgd6Eksky4nOax2IFv8iBrkvshjpxzC3KemQP-KdxFZqA1V-qrGZJwm43Acc8D9iW4mnP9YL8IYTTCPYuA3qQHu3Cn781FV2ATZcogorOqPx3XOeiWjirkGevIRliAyBNWbvIXK-KjCYs5ILMlArgTPQdVStRlFMCY2dsA)

네트워크 이미지를 사용할 때는 width와 height를 지정하는 것이 필수적입니다.

정적 이미지는 리액트 네이티브가 파일 데이터로부터 크기를 유추할 수 있습니다.

마지막으로, 뷰의 배경 이미지를 설정하는 방법을 알아보겠습니다.

리액트 네이티브는 이 목적을 위해 `ImageBackground`라는 두 번째 이미지 컴포넌트를 제공합니다.

상단에서 이를 임포트하고 JSX에서 두 이미지 컴포넌트를 주석 처리합니다.

```jsx
import { View, ImageBackground, Text } from 'react-native';

export default function App() {
  return (
    <<View style={{ flex: 1, backgroundColor: 'plum', padding: 60 }}>
      <ImageBackground source={logoImage}>
        <Text>Image Text</Text>
      </ImageBackground>
    </View>
  );
}
```

파일을 저장하면 배경에 이미지가 표시되고 텍스트가 그 위에 겹쳐져 있는 것을 볼 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiPGMKdutYNschMd5YOL1xpJWFIw_Uw463INTxHp00_klHDff-6KWG9sfpEF5vMR5q4TNjYJ-u8eHrTTr2XDzXe-w2TBoeqZEDEmRuuaK9i-M1LsMSO5NgPmfUBld7VHWRVkZKgmNr9moDbLOsZTKgnAFW_ei7WSYx55OvpTs0v0kRg1sJO_ot7-uOznnQ)

이미지가 전체 사용 가능한 공간을 차지하도록 하려면 flex 속성을 사용합니다.

```jsx
<ImageBackground source={logoImage} style={{ flex: 1 }}>
  <Text>Image Text</Text>
</ImageBackground>
```

화면을 확인하면 이미지가 전체 화면을 차지하는 것을 볼 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjTxM8Y_WxkG5BHMkpL5ehzbYCSb6SL36WXAglw9LIE1xP9jxLL05c3Dg7gHE7kysuWqOiMgRPEwlWzjRSB2wWLNActBBy9r55q6dftDvieO8U1DdLa80nyHMro1lQrgHvB596Qr8ViFH7nQFOFFZd0Ztfe5JNM_WX5nLVUSsJqMipitXFCeEwZuzB0lBs)

요약하자면, 이미지 컴포넌트는 리액트 네이티브에서 이미지를 렌더링하는 데 사용됩니다.

정적 이미지, 네트워크 이미지, 그리고 카메라 롤에서 가져온 로컬 이미지를 표시할 수 있습니다.

이미지를 렌더링하려면 리액트 네이티브에서 이미지 컴포넌트를 임포트하고 source 속성을 지정하면 됩니다.

원격 이미지를 사용할 때는 `uri` 옵션을 사용해야 합니다.

배경 이미지를 렌더링하려면 `ImageBackground` 컴포넌트를 사용하고 원하는 내용을 내부에 중첩하세요.

---

## ScrollView

지금까지 우리는 View, Text, 그리고 Image 컴포넌트에 대해 배웠습니다.

이번에는 이 컴포넌트들을 사용하여 웹과 리액트 네이티브 간의 중요한 차이점을 설명해보겠습니다.

먼저, 이전에 사용한 외부 View 컴포넌트와 하나의 Image 컴포넌트를 유지하겠습니다.

정적 이미지는 그대로 둡시다.

다음으로, 이미지 바로 뒤에 긴 텍스트 컴포넌트를 추가하여 차이점을 강조하겠습니다.

여기에는 테스트를 위해 당연히 Lorem Ipsum 텍스트를 사용할 것입니다.

텍스트 다음에는 Image 컴포넌트를 복제하여 추가해 보겠습니다.

```jsx
import { View, Text, Image, ScrollView } from 'react-native';

const logoImage = require('./assets/adaptive-icon.png');

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: 'plum', padding: 60 }}>
      <Image source={logoImage} style={{ width: 300, height: 300 }} />
      <Text>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
        vehicula magna at magna dictum, in sagittis libero ullamcorper. Donec
        finibus libero at ex facilisis, non convallis felis faucibus. Nunc
        venenatis, odio nec suscipit efficitur, dui lorem interdum mi, vel
        suscipit nunc lorem nec libero. Suspendisse potenti. Integer rhoncus,
        nisi a convallis feugiat, ligula ex pellentesque libero, non posuere
        erat leo vitae erat. Maecenas vel orci vitae metus aliquet fermentum.
        Proin at justo eget lacus semper hendrerit.
      </Text>
      <Image source={logoImage} style={{ width: 300, height: 300 }} />
    </View>
  );
}
```

파일을 저장하고 시뮬레이터나 에뮬레이터로 돌아가면 첫 번째 이미지 뒤에 긴 텍스트가 있고, 그 다음에 다시 이미지가 있는 것을 볼 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjrBHgAgNdhgJPsplDdlAoGrL_S4qScVtss1EKPZ_h7ToI73_KRkClH-ES64SrVzxIlgOtjvf_ok5TJbDdflePzqsFY3I7-rT2zFb4sJgC1dsRbRXUg31p-nlsl0THF8-SipAVHn2yyqyCS6SvFwdsiV810d1UaIvn2Plsm8kdJnoepV9O-FfbKEeIYVYg)

하지만 문제는 전체 이미지를 보기 위해 스크롤할 수 없다는 것입니다.

클릭하고 드래그하려고 해도 스크롤이 되지 않습니다.

이것이 웹 개발과 리액트 네이티브의 중요한 차이점입니다.

View 컴포넌트는 div 태그와 유사하지만 자동으로 스크롤되지 않습니다.

그렇다면 전체 내용을 어떻게 볼 수 있을까요?

리액트 네이티브는 이러한 목적을 위해 ScrollView 컴포넌트를 제공합니다.

ScrollView 컴포넌트는 플랫폼별 스크롤 기능을 래핑합니다.

하지만 ScrollView는 제대로 작동하기 위해 제한된 높이가 필요합니다.

먼저, 리액트 네이티브에서 ScrollView 컴포넌트를 임포트하고, View 컴포넌트를 ScrollView로 교체해 보겠습니다.

```jsx
import { ScrollView, Text, Image, View } from 'react-native';

const logoImage = require('./assets/adaptive-icon.png');

export default function App() {
  return (
    <ScrollView style={{ backgroundColor: 'plum', padding: 60 }}>
      <Image source={logoImage} style={{ width: 300, height: 300 }} />
      <Text>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vehicula magna at magna dictum, in sagittis libero ullamcorper. Donec finibus libero at ex facilisis, non convallis felis faucibus. Nunc venenatis, odio nec suscipit efficitur, dui lorem interdum mi, vel suscipit nunc lorem nec libero. Suspendisse potenti. Integer rhoncus, nisi a convallis feugiat, ligula ex pellentesque libero, non posuere erat leo vitae erat. Maecenas vel orci vitae metus aliquet fermentum. Proin at justo eget lacus semper hendrerit.
      </Text>
      <Image source={logoImage} style={{ width: 300, height: 300 }} />
    </ScrollView>
  );
}
```

화면을 확인하면 이제 내용이 스크롤 가능해진 것을 볼 수 있습니다.

하지만 두 번째 이미지의 끝까지 완전히 보이지 않는 문제가 여전히 발생합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhYmFHjc50bn2OPQN9SCVVISGPgiVqDdxFIEiUKLYwAKhP5M1hwh7FsdA_4eF344wbCa_eyCrfJr-6l9e0tbi8AwpTgllUhS0O6sOS8NMpVRI2a-Sl1-MD70Ow8I-6IkwAwcyT65KjyRe5K3YW18xRCqmFyoua2fJDAN7aglObZydS6qP0jzRhUCRBFdFU)

이 문제는 ScrollView 컴포넌트의 패딩에서 발생합니다.

패딩을 제거할 수 있지만, 그렇게 하면 콘텐츠가 상태 표시줄과 겹치게 됩니다.

이 문제를 해결하기 위해 ScrollView를 View 컴포넌트 내에 중첩할 수 있습니다.

```jsx
export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: "plum", padding: 60 }}>
      <ScrollView>
        <Image source={logoImage} style={{ width: 300, height: 300 }} />
        <Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
          vehicula magna at magna dictum, in sagittis libero ullamcorper. Donec
          finibus libero at ex facilisis, non convallis felis faucibus. Nunc
          venenatis, odio nec suscipit efficitur, dui lorem interdum mi, vel
          suscipit nunc lorem nec libero. Suspendisse potenti. Integer rhoncus,
          nisi a convallis feugiat, ligula ex pellentesque libero, non posuere
          erat leo vitae erat. Maecenas vel orci vitae metus aliquet fermentum.
          Proin at justo eget lacus semper hendrerit.
        </Text>
        <Image source={logoImage} style={{ width: 300, height: 300 }} />
      </ScrollView>
    </View>
  );
}
```

이렇게 하면 ScrollView가 부모의 높이에 의해 제한되며, 이는 전체 사용 가능한 공간을 나타냅니다.

파일을 저장하면 이제 두 번째 이미지의 끝까지 스크롤할 수 있게 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEicQd0IcoM_gt1dqu1SkvnrbEmnAPrTjTIdPGU7qxH0cTjD7tqvFLLN_d7OtWTKUzgcchGA9Ex5EWT2ePG6It3pJex95m7hGerPH9MxOWehBh5Z5fZ7Wb1FbjI5pZoTbqisCey2O7WxlPySul-Yp9ykutxJDy453lvH_XxmtO89ZuHeT92xV5j-2hzdX-Y)

요약하자면, 웹 개발의 div 태그와 달리 리액트 네이티브의 View 컴포넌트는 기본적으로 스크롤되지 않습니다.

스크롤이 필요한 콘텐츠에는 ScrollView 컴포넌트를 사용하고, ScrollView가 제한된 높이를 가지도록 해야 합니다.

---

## Button Component

이번에는 리액트 네이티브의 핵심 컴포넌트 중 하나인 버튼 컴포넌트에 대해 알아보겠습니다.

버튼 컴포넌트는 사용자가 액션을 트리거할 수 있게 해주는 컴포넌트로, 웹의 버튼 컴포넌트와 유사한 역할을 합니다.

하지만 버튼 컴포넌트는 iOS와 안드로이드에서 플랫폼별로 다르게 렌더링된다는 점을 알아두셔야 합니다.

먼저, 리액트 네이티브에서 버튼 컴포넌트를 임포트해야 합니다.

```jsx
import { View, Button } from 'react-native';
```

그 다음, View 컴포넌트 내에 버튼 컴포넌트를 호출해 보겠습니다.

HTML의 버튼 요소와 달리, 리액트 네이티브의 버튼 컴포넌트는 닫는 태그가 없는 셀프 클로징 태그입니다.

버튼 텍스트를 지정하려면 title props을 사용합니다.

```jsx
export default function App() {
  return (
    <View style={{ flex: 1, padding: 60 }}>
      <Button title="Press Me" />
    </View>
  );
}
```

파일을 저장하고 디바이스를 확인해 보면, 버튼 컴포넌트가 iPhone에서는 iOS 스타일로 혹은 안드로이드 가상 디바이스에서는 안드로이드 스타일로 렌더링되는 것을 볼 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgoFxTgctrhhn_HM_BYDiB3m9Y5s4YgZ_kUvQKkRmJVBnybztNRetzEIUjLjdz34IjAdcXUoQsHR9ePGjh8B4nwQonzzyaKZof7d-ck-5acx9zWv0KiykLUFdHNhxOvSnx0S2j3vv80grur4Tpr9KF7IftOdS__INdOVcRXNmcMwvalUXZtB5NbPpPOML4)

물론, 두 플랫폼에서 동일한 스타일을 가지는 커스텀 버튼을 만들 수도 있지만, 나중에 다루겠습니다.

이제 VS Code로 돌아가서 이 버튼의 Press 이벤트를 처리해 보겠습니다.

웹 개발에서 리액트를 사용할 때, onClick 이벤트를 onClick props으로 처리합니다. 

리액트 네이티브에서도 버튼 컴포넌트가 onPress props을 제공합니다.

```jsx
export default function App() {
  return (
    <View style={{ flex: 1, padding: 60 }}>
      <Button
        title="Press Me"
        onPress={() => console.log('Button pressed')}
      />
    </View>
  );
}
```

버튼을 누르면 이벤트 핸들러가 트리거되고 터미널에 'Button pressed'라는 로그 메시지가 표시됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgBkmfBOJo_pXd4kDf_AyHooZmo626aU3HqhtEepVV9-qBX3kK6-NGTfuRhPDEa_50sb3jP8L3e3Y8AgfOhc4QWTt-efWbAVXmQNUvzsJE46TQV4ib2ov9Szl3yp69C6uIGq2bOUteqUAQWUAcA4_ThxP8Jq0Vh7IeLdKwQAiv3c_glxPOEDIGovFoW19E)

안드로이드 버튼을 클릭해도 동일한 로그 메시지가 나타납니다.

이벤트 핸들러는 매우 기본적이지만, 더 복잡한 로직을 위해 별도의 함수를 정의하고 이를 onPress 이벤트에 할당할 수 있습니다.

이제 title과 onPress props을 다루었으니, 세 번째로 중요한 프롭인 color props을 살펴보겠습니다.

이 props는 버튼의 색상을 쉽게 커스터마이즈할 수 있게 해줍니다.

```jsx
<Button
  title="Press Me"
  onPress={() => console.log('Button pressed')}
  color="midnightblue"
/>
```

UI를 확인해 보면, 버튼에 새로운 색상이 적용된 것을 볼 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiNTIQqLFEcnkhMfFN3QUCk5tQzGJ67uaDDNT8NblxH5YZfE6WPThMmpDKlSBdxfD3bO3em-Qt1T0KTVJRYzC8J8wOfmFsGoCLQBe50cCevKkuMiDbGGy3kFAVNKitH933FRFcEhem0Jyr2hgfrvh_jn28qwqAWCYomYXcEchr0gDjExpuSohWchRrmzPE)

마지막으로, 주로 폼 핸들링에서 사용되는 disabled props가 있습니다.

disabled props를 추가하고 기본값을 true로 설정해 보겠습니다.

```jsx
<Button
  title="Press Me"
  onPress={() => console.log('Button pressed')}
  color="midnightblue"
  disabled={true}
/>
```

UI에서 버튼이 비활성화된 스타일로 표시되고, 버튼을 눌러도 Press 이벤트가 트리거되지 않습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhLNL5htvNGK6TB2WFnfRYMMPewUEnGlXTitRMVV1008kdq4gRM8EB9fh-PP8aplUnFOqKEqmFVsivzYa709-MKT_B6T7qo3wJe3E6s5lwVjXTE38iLqqaKPrBu1Jx0E8h02tAj4fAdJ7B8USec8exNxfoE3FS3GguzdI4k22b69rbc2is39zXQWN3QLPc)

따라서 콘솔에 새로운 로그가 나타나지 않습니다.

일반적으로는 true나 false를 직접 할당하는 대신 상태 변수를 사용하여 disabled props 값을 관리하는 것이 더 좋습니다.

요약하자면, 버튼 컴포넌트는 누를 때 액션을 트리거하는 데 사용됩니다.

타이틀 props를 사용하여 버튼 텍스트를 지정할 수 있고, onPress props를 사용하여 Press 이벤트를 처리할 수 있습니다.

color props로 버튼 색상을 설정할 수 있으며, disabled props로 버튼을 비활성화할 수 있습니다.

---

## Pressable Component

방금 버튼 컴포넌트에 대해 배웠고, 이를 통해 사용자 상호작용에 기반한 액션을 트리거할 수 있었습니다.

하지만 때로는 이미지나 텍스트와 같은 다른 요소를 눌렀을 때 액션을 트리거해야 할 때가 있습니다.

이런 요구를 해결하기 위해 리액트 네이티브는 Pressable 컴포넌트를 제공합니다.

Pressable은 정의된 자식 요소에서 다양한 단계의 누름(interaction)을 감지하는 래퍼 컴포넌트입니다.

예제를 통해 Pressable 컴포넌트의 사용법을 이해해 보겠습니다.

이전에 사용한 코드입니다.

이제 Pressable 컴포넌트를 시작해 봅시다.

먼저, 리액트 네이티브에서 Pressable 컴포넌트를 임포트합니다.

```jsx
import { View, Image, Text, Pressable } from 'react-native';
```

그 다음, 감지하고자 하는 요소들을 Pressable로 감싸줍니다.

예제에서는 이미지와 텍스트 컴포넌트를 감싸겠습니다.

```jsx
import { Pressable, Text, Image, View, Button } from "react-native";

const logoImage = require("./assets/adaptive-icon.png");

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: "plum", padding: 60 }}>
      <Button
        title="Press Me"
        onPress={() => console.log("Button pressed")}
        color="midnightblue"
      />
      <Pressable onPress={() => console.log("Image pressed")}>
        <Image
          source={logoImage}
          style={{ width: 300, height: 300 }}
        />
      </Pressable>
      <Pressable onPress={() => console.log("Text pressed")}>
        <Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
          vehicula magna at magna dictum, in sagittis libero ullamcorper. Donec
          finibus libero at ex facilisis, non convallis felis faucibus. Nunc
          venenatis, odio nec suscipit efficitur, dui lorem interdum mi, vel
          suscipit nunc lorem nec libero. Suspendisse potenti. Integer rhoncus,
          nisi a convallis feugiat, ligula ex pellentesque libero, non posuere
          erat leo vitae erat. Maecenas vel orci vitae metus aliquet fermentum.
          Proin at justo eget lacus semper hendrerit.
        </Text>
      </Pressable>
    </View>
  );
}
```

파일을 저장하고 시뮬레이터로 돌아가서 코드를 확인해 봅시다.

텍스트 컴포넌트를 누르면 해당 로그 문구가 출력됩니다.

안드로이드에서도 동일한 로그 문구가 출력됩니다.

이미지를 누르면 `Image pressed` 로그가 출력됩니다.

iOS 디바이스에서도 이미지를 누르면 동일한 로그가 출력됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEi34MvAjyoJLOwRQlqOeSHCk7v7gQWIcYASkXbSiwk8bmKw-lM-OCFVSRPfRKitpyHKXcwW4BYu6nquD3TOr0Buza7ezXHA4e9-L8FrfuF5y1OBxCyXFJxSvtd8nhhawAVFK86KXi3Mmb-kbLVvbEA3RucDWr-ugpoJuWrfOc0ikcYA69ho8m0VW-z3B30)

Pressable 컴포넌트가 기대대로 작동하는 것을 확인할 수 있습니다.

만약 기본 버튼 컴포넌트가 앱의 요구사항을 충족하지 못한다면, Pressable 컴포넌트를 사용하여 커스텀 버튼을 만들 수 있습니다.

추가로, Pressable 컴포넌트는 onPress 외에도 여러 가지 이벤트를 지원합니다.

onPressIn은 누름이 활성화될 때 호출되며, onLongPress는 누름이 500밀리초 이상 지속될 때 호출됩니다.

그리고 onPressOut은 누름 제스처가 비활성화될 때 호출됩니다.

다음은 리액트 네이티브 공식 문서에서 가져온 자료입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEg2wrGIzoRVTdxTmxT7ACG5hvh5-BKtgDE5teRtZcxIZIWkM6kpFh4AXSL5y4GitHIj-i5mnhbtmAOozjD3ad5Mb8jOVwBCyaczf68j71MxrxevhzoVJe5uYB5TUc-PL2O0zMT_OU33PtXbouMKwYl28iH214JOlajzIHId-k-bFZXI-kvl2YBJhSrvjKI)

onPressIn이 트리거된 후 사용자가 손가락을 떼면 onPressOut이 트리거되고, 그 뒤에 onPress가 호출됩니다.

하지만 사용자가 손가락을 500밀리초 이상 누르고 있으면 onPressIn 후에 onLongPress가 호출되고, 그 다음 onPressOut이 호출됩니다.

연습 삼아 이미지에 이러한 props를 추가하고, 이벤트가 예상대로 트리거되는지 확인해 보시는 것도 공부에 도움이 될겁니다.

---

## Modal Component

모달(Modal)은 중요한 정보를 제공하거나 사용자의 결정을 요구할 때 앱 콘텐츠 위에 오버레이되는 화면입니다.

이들은 의도적으로 인터럽트하는 요소이므로 반드시 필요할 때만 사용해야 합니다.

예제로 버튼을 눌렀을 때 모달을 표시하고 숨기는 방법을 배워봅시다.

먼저, 리액트 네이티브에서 모달 컴포넌트를 임포트합니다.

```jsx
import { View, Text, Button, Modal } from 'react-native';
```

그 다음, 닫는 `View` 태그 바로 앞에 모달 요소를 정의합니다.

모달의 시작과 끝 태그는 컨테이너 역할을 하며, 그 안에 표시할 콘텐츠를 정의합니다.

```jsx
    <View style={{ flex: 1, padding: 60, backgroundColor: "plum" }}>
      <Text>Modal Content</Text>
      <Button title="Press to open Modal" onPress={"Button pressed"} color="midnightblue" />
      <Modal>
        <View style={{ flex: 1, padding: 60, backgroundColor: "lightblue" }}>
          <Text>This is Modal</Text>
          <Button title="Close Modal" color="midnightblue" />
        </View>
      </Modal>
    </View>
```

이제 모달을 정의했지만, 기본적으로 항상 보이는 상태입니다.

사용자 상호작용에 따라 모달의 가시성을 제어해야 합니다.

이를 위해 상태 변수가 필요합니다.

리액트에서 `useState` 훅을 임포트합니다.

```jsx
import { useState } from 'react';
```

그 다음, `App` 컴포넌트 내에서 상태 변수를 생성합니다.

```jsx
const [isModalVisible, setModalVisible] = useState(false);
```

이제 이 변수를 모달 컴포넌트의 `visible` props에 바인딩합니다.

```jsx
<Modal visible={isModalVisible}>
```

기본값이 `false`이므로 모달은 처음에는 숨겨져 있습니다.

모달의 가시성을 토글하기 위해 버튼 컴포넌트의 `onPress` 이벤트를 수정합니다.

```jsx
<Button title="Show Modal" onPress={() => setModalVisible(true)} />
```

마지막으로 모달 내부의 버튼에 이벤트 핸들러를 추가하여 모달을 닫습니다.

```jsx
<Button title="Close" onPress={() => setModalVisible(false)} color="midnightblue" />
```

이제 코드를 테스트할 준비가 되었습니다.

최종 코드입니다.

```jsx
import { useState } from "react";
import { Text, View, Button, Modal } from "react-native";

// const logoImage = require("./assets/adaptive-icon.png");

export default function App() {
  const [isModalVisible, setModalVisible] = useState(false);

  return (
    <View style={{ flex: 1, padding: 60, backgroundColor: "plum" }}>
      <Text>Modal Content</Text>
      <Button
        title="Press to open Modal"
        onPress={() => setModalVisible(true)}
        color="midnightblue"
      />
      <Modal visible={isModalVisible}>
        <View style={{ flex: 1, padding: 60, backgroundColor: "lightblue" }}>
          <Text>This is Modal</Text>
          <Button
            title="Close Modal"
            onPress={() => setModalVisible(false)}
            color="midnightblue"
          />
        </View>
      </Modal>
    </View>
  );
}
```

시뮬레이터에서 플럼 배경의 뷰와 "Show Modal" 버튼이 표시됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhX4BuzV6YYG0Fy1-cvyQmYwmGlYg0GPHwz8gcL3WCMVIP7Db837AeauzAtTBqVNx1XFPwhf62tGBa6cS1ACAtsdxzESrJtiUVLxEW_trl74TcvyCZhBiAMljAIb0CNSTd-ORYOFzKzG4yjvxkF4Oa97R-th6Tax8NQF3PmVSCXZad3bZN4Hx7wzm-uOCc)

버튼을 클릭하면 모달이 표시되고, 모달 내의 버튼을 클릭하면 모달이 숨겨집니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgSK1zv0XDleQQ-z95yq6Wo2Y4pAZRKMs2f4wGpWofvA4Dnt2HSNdSYWOTGwH_kZGRxgdx-89I51LP6TqeJxnxl-mCJU-KUjj5gSBLsuSb6anvQCyU0E9jmOYjCaKQb-1yL0LCBsGWYo2EKH8fBBHMbqJX2epwFJAZ_EM-oZXpQDcddMmRVRwkOJDSGEKc)


간단하면서도 직관적인 사용법입니다.

또한, `onRequestClose`라는 props도 추가하는 것이 좋습니다.

이 props는 안드로이드의 뒤로 가기 버튼을 누르거나 iOS에서 제스처로 모달을 닫을 때 호출됩니다.

```jsx
<Modal visible={isModalVisible} onRequestClose={() => setModalVisible(false)}>
```

이제 몇 가지 모달 관련 props를 더 살펴보겠습니다.

"Press to open Modal" 버튼을 클릭하면 모달이 갑자기 나타나고 사라지는 것을 볼 수 있습니다.

이는 `animationType` props가 기본값으로 `none`으로 설정되어 있기 때문입니다.

```jsx
<Modal visible={isModalVisible} onRequestClose={() => setModalVisible(false)} animationType="slide">
```

이렇게 설정하면 모달이 아래에서 슬라이드하여 나타납니다.

시뮬레이터에서 이를 확인할 수 있습니다.

또는 `fade`로 설정하여 모달이 서서히 나타나고 사라지게 할 수도 있습니다.

```jsx
<Modal visible={isModalVisible} onRequestClose={() => setModalVisible(false)} animationType="fade">
```

마지막으로 `presentationStyle` props가 있습니다.

기본값은 `fullScreen`입니다.

이를 `formSheet` 또는 `pageSheet`로 변경하여 모달의 외관을 조정할 수 있습니다.

```jsx
<Modal visible={isModalVisible} onRequestClose={() => setModalVisible(false)} animationType="slide" presentationStyle="pageSheet">
```

이렇게 설정하면 UI가 완전히 달라지는 것을 볼 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhENkTWoSzcwO5fHF01PbVFkFkZmp0Tlovmy1FV5uy6zKxXeCuzdZN4PMWhmdZ26u5xydDaJFywwOtvbZH9qGKXxfxT3KvRpJXEQK_VgxhZc0F3tmN6DwjLynvN7n6EVjtNC2bRucNB09V27Up1UiOK3B0ExC_Q6-jic4C0yQkJ_2e6hlnsBOJhZSN6xMY)

`formSheet`도 비슷한 UI를 제공하지만, 큰 iOS 디바이스에서는 조금 다르게 표시됩니다.

`formSheet`는 좁고, `pageSheet`는 더 넓습니다.

이props는 iOS에서만 작동합니다.

연습 삼아 iPad 시뮬레이터를 열어 `formSheet`와 `pageSheet` 값을 번갈아 가며 설정해 보십시오.

요약하자면, 리액트 네이티브의 모달 컴포넌트를 사용하면 중요한 정보를 제공하거나 사용자 결정을 요청할 수 있습니다.

모달 컴포넌트를 정의하고, 원하는 콘텐츠를 자식 요소로 중첩하여 사용할 수 있습니다.

모달의 가시성은 `visible` props로 제어하며, 하드웨어 상호작용 즉 백 버튼이나 제스쳐를 통해 모달이 닫힐 때는 `onRequestClose` 콜백을 사용합니다.

`animationType` props를 사용하여 모달의 등장 및 퇴장 애니메이션을 추가할 수 있고, iOS에서는 `presentationStyle` props로 모달의 외관을 조정할 수 있습니다.

---

## StatusBar Component

StatusBar 컴포넌트는 애플리케이션의 상태 표시줄을 제어할 수 있게 해줍니다.

상태 표시줄은 화면 상단에 위치하며 현재 시간, Wi-Fi 및 네트워크 상태, 배터리 레벨 등의 정보를 표시합니다.

이번에는 디바이스의 상단 섹션에 집중해 보겠습니다.

현재는 상태 표시줄이 투명하게 보입니다.

코드에서 StatusBar 컴포넌트를 임포트해 보겠습니다.

```jsx
import { View, StatusBar } from 'react-native';
```

그 다음, View 컴포넌트 내에서 StatusBar 컴포넌트를 호출합니다.

```jsx
export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: "plum", padding: 60 }}>
      <StatusBar />
    </View>
  );
}
```

파일을 저장하면 iOS에서는 눈에 띄는 변화가 없지만, 안드로이드에서는 상태 표시줄이 어두운 배경으로 추가됩니다.

이제 몇 가지 props를 추가하여 상태 표시줄의 외관을 수정해 보겠습니다.

먼저, `backgroundColor` 프롭을 사용하여 배경색을 설정할 수 있습니다.

```jsx
<StatusBar backgroundColor="lightgreen" />
```

이 props는 안드로이드에서만 적용됩니다.

iOS 시뮬레이터에서는 배경색이 없지만, 안드로이드 디바이스에서는 녹색 배경이 표시됩니다.

iOS에서는 배경색을 변경할 수 없지만, 텍스트 색상은 두 플랫폼 모두에서 조정할 수 있습니다.

텍스트 색상을 제어하는 props는 `barStyle`입니다.

기본값은 문자열 `default`입니다.

이는 iOS에서는 어두운 텍스트, 안드로이드에서는 밝은 텍스트를 의미합니다.

현재 iOS에서는 검은색 텍스트, 안드로이드에서는 흰색 텍스트가 표시됩니다.

`barStyle` 값을 `dark-content`로 변경해 보겠습니다.

그러면 두 플랫폼 모두에서 검은색 텍스트가 표시됩니다.

```jsx
<StatusBar barStyle="dark-content" />
```


![](https://blogger.googleusercontent.com/img/a/AVvXsEibiWWA0P0p1y600kzws32m5O7V2KEwaA0W5TJIzj9PP0UKJ1AA64kkreTYIzF15lp3pJTeSQyq7ru3BwmvGiYsTMWY2B4u8H7O7xbltgo0a94Wcqnv0F-5l_-qTzitY7U8q96Un6xWdQt5u4rFaP_A01P4JRl7aoqwKkKDmJNEDFhmtwVuLC_s52VCO5U)


반대로 `light-content`로 변경하면 두 플랫폼 모두에서 흰색 텍스트가 표시됩니다.

```jsx
<StatusBar barStyle="light-content" />
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEg9Qp-B6fxdINervBcUyioqSpDsT3G_aQuLOoOCYy3YLnSgOWCyXWa605iROCdV9HDryXsFTaC7QAvEG6khiYBzBWMEb-aAgxxeQahCfsRwWuHppHOmKQo0hblFB5kmFdWw7J-wlcdroPuOwx9Zr5aMhp4qPRbfxVumrh2JM9Uon47mELoGrYrBkY7jpo0)

애플리케이션의 배경색에 따라 적절한 값을 선택하여 가시성과 대비를 확보하세요.

가시성에 대해 말하자면, `hidden` props를 사용하여 상태 표시줄을 숨길 수 있습니다.

```jsx
<StatusBar hidden />
```

이렇게 하면 상태 표시줄이 숨겨집니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjdMt7v9wVdrO_rlDJVTArCdB9N1lzbkSfVJ_IR0HDjhYVLdK0arw7RJA1KKJRq-g1IiGUaCtJFfgmDl_E04nQKWR0ZC5HRMTCNq9MmIru9mTfY6EWf8LhVP6S21upmwd31AT43XKoIUp4gowKMyQLW8K3gl3rdyYOaPwpJy9YWQzcSKVsPztxuvo1UI0I)

연습 삼아 상태 변수와 버튼 클릭 이벤트를 사용하여 상태 표시줄의 가시성을 토글해 보세요.

모달의 가시성을 제어했던 것과 유사한 방식으로 구현할 수 있습니다.

요약하자면, StatusBar 컴포넌트를 사용하면 애플리케이션의 상태 표시줄을 제어할 수 있습니다.

안드로이드에서는 `backgroundColor` props를 사용하여 배경색을 조정할 수 있고, `barStyle` props를 사용하여 텍스트 색상을 변경할 수 있으며, `hidden` props를 사용하여 가시성을 토글할 수 있습니다.

---

## ActivityIndicator Component

ActivityIndicator 컴포넌트는 원형 로딩 인디케이터를 표시하여 앱 로딩, 폼 제출, 업데이트 저장 등 진행 중인 프로세스의 상태를 사용자에게 알리는 데 사용됩니다.

먼저, 리액트 네이티브에서 ActivityIndicator 컴포넌트를 임포트하고 View 내에 배치합니다.

```jsx
import { View, ActivityIndicator } from 'react-native';

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: 'white', padding: 60 }}>
      <ActivityIndicator />
    </View>
  );
}
```

파일을 저장하면 iOS와 안드로이드 모두에서 원형 로딩 인디케이터가 표시되는 것을 볼 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEj7NKkoXz_k9NVJ7BIqIu0HPszigWYsmI9nlCdyXTxbbReQ715ji57AFukgdXUkvAbiD2YoMwMsqqbTkwoVsn7NgReUixWFplsxU-ARe5s9gHcHfpazGRTXkQ8GEc5Du8TTmWppw_Y0BBnpceWKJNu6WvXa4N9Jy5uAOUQ7n814JY21Ac2wliwra-FWeF4)

다소 작고 색상 대비가 좋지 않아서 시뮬레이터나 가상 디바이스에서 직접 확인해 보시기 바랍니다.

시각적으로 약간의 차이가 있지만, 백그라운드에서 무언가가 진행 중임을 효과적으로 전달합니다.

이제 이 컴포넌트의 세 가지 중요한 props를 강조해 보겠습니다.

첫 번째 props는 `size`입니다.

기본값은 `small`로 설정되어 있지만, 이를 `large`로 변경할 수 있습니다.

```jsx
<ActivityIndicator size="large" />
```

두 번째 인디케이터는 더 큰 크기로 표시됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhzm9pz5dSq443Q8z2DVzmy4yEqobw_S_mspau6cMbN8zpep1XH94V2zEPfKaae2qFFwB94IPFX9OD9ppX1nDWKYl_PYUW_HuK2cspIV1jQaoF4nv-nShVdibgdwb9j06QxFe6-oUTGk6BPHpjD774-4imca_P8oy1LdziZ91HumpxiDzjrALk-V2POSZM)

두 번째 props는 `color`입니다.

기본적으로 안드로이드는 시스템 강조 색상을 사용하고, iOS는 회색 톤을 사용합니다.

하지만 `color` props를 사용하여 색상을 커스터마이즈할 수 있습니다.

```jsx
<ActivityIndicator size="large" color="midnightblue" />
```

두 디바이스에서 로딩 인디케이터가 'midnightblue'색으로 명확하게 표시되는 것을 볼 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhIRkOd_BHyyZRpPqk9jbqbOJH6edUe3fDyi2QyAaYfW60XhmSVS1JnMByhQk0BTXmlZNN_HcrZwXdLOHw4h9d-hWvq3OSQ4wkdaM70MtHOd-9YbnKK6r9Y2cuARRB7aOkbIsRHePw7H4_Bkdf4Je44pbllLh8M50p3l3k6opr0nYB8xMlNR8fFuWUbXpw)

마지막 props는 `animating`입니다.

이 props는 컴포넌트의 가시성을 제어합니다.

기본값은 `true`로 설정되어 있어 인디케이터가 표시됩니다.

이를 `false`로 설정하면 인디케이터가 숨겨집니다.

```jsx
<ActivityIndicator animating={false} />
```

실행해 보시면 네 번째 인디케이터가 숨겨진 것을 볼 수 있습니다.

이 props에 상태 변수를 사용하는 것이 일반적이며, 이전에 상태 표시줄을 표시하고 숨기는 방식과 동일합니다.

요약하자면, Activity Indicator 컴포넌트는 진행 중인 백그라운드 프로세스를 사용자에게 알리기 위해 로딩 인디케이터를 표시합니다.

`size` props를 사용하여 크기를 설정하고, `color` props를 사용하여 색상을 지정하며, `animating` props를 사용하여 가시성을 제어할 수 있습니다.

---

## Alert Component

기술적으로 Alert는 일반적인 컴포넌트보다는 API에 더 가깝습니다.

JSX의 일부로 렌더링되는 대신, UI 요소를 생성하는 메서드를 호출합니다.

Alert를 사용하면 지정된 제목과 메시지를 가진 대화 상자를 띄울 수 있습니다.

추가적으로 버튼 목록을 포함시킬 수도 있습니다.

먼저, 리액트 네이티브에서 Alert 컴포넌트를 임포트합니다.

```jsx
import { View, Button, Alert } from 'react-native';
```

App 컴포넌트의 JSX 내부에서 View 컴포넌트 안에 버튼을 정의합니다.

버튼 컴포넌트도 임포트해야 합니다.

```jsx
export default function App() {
  return (
    <View style={{ flex: 1, padding: 60 }}>
      <Button
        title="Show Alert"
        onPress={() => Alert.alert('Invalid Data')}
      />
    </View>
  );
}
```

UI를 확인해 보면 "Show Alert" 버튼이 표시됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEh_awrY0fjdTohSUPJrmc99eanVabGeH9AXj2PmkcrKjZ6WzSyD6ftXnBqeCH8aoLfHMVI6CpVBUtOf1Za7l1eV7nTw4Ks8KY4P7z0OZ0vUMP2CmQiR9SYH_Kt2oaIBwfuVsNTqLltC2g8Y3Q4-j_fPRmLKkCjaLO_OYlHRiKNqWab0PVq5MJCi39wa_8k)

버튼을 누르면 대화 상자가 표시됩니다.

기본적으로 확인(OK) 버튼이 포함되어 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjtNkpZ9tsBDCrFqpgy0UZZc_efcPNR5tYlNZfejquvJ16An-vhO8GxektdVM5Y5XenC-g1mbMLcG1gIMgqGKbIrUUBlHNZuG1MX_MspYCcMxkgr_XzL9E32xZ9kP_CLKb3XsOksYhQyezSjQPokH8S9KrY7PxGyqE-Tgf3Lgw9yPo5wpP-CAIDpNYAQAo)

Alert 대화 상자의 외관은 두 플랫폼 간에 약간 다를 수 있습니다.

"Invalid Data" 문자열은 대화 상자의 제목으로 사용되며 필수 매개변수입니다.

메시지를 두 번째 매개변수로 지정할 수도 있습니다.

```jsx
<Button
  title="Show Alert 2"
  onPress={() => Alert.alert('Invalid Data', 'Date of birth is incorrect')}
/>
```

UI를 확인해 보면 두 번째 버튼이 추가되고, 이를 누르면 제목과 메시지가 표시됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEg4VnGRdoEDFJKQ7c1GVmPuQH_c2h06r_b2vpuAiUwS2yCHNJjmCs7nYnW6pAPlKTyymr8t-TZ0-fWMa6VxX-deIpQ3Q4gadwk2w4OpK3UBgUVyS90h9v_xm03UPRKXgkoOKhhS-VnglqV5cjnokXSE8wALkWEqT8m7Jq9mbkBkOWHU-HrE-LC96m6Nzmk)

다음으로, 대화 상자에 표시되는 버튼을 제어하는 방법을 알아보겠습니다.

iOS에서는 버튼의 수를 무제한으로 지정할 수 있지만, 안드로이드에서는 최대 3개까지 가능합니다.

두 개의 버튼을 가진 Alert를 만들어 보겠습니다.

```jsx
<Button
  title="Show Alert 3"
  onPress={() =>
    Alert.alert('Invalid Data', 'Date of birth is incorrect', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
      },
      {
        text: 'OK',
        onPress: () => console.log('OK Pressed'),
      },
    ])
  }
/>
```

시뮬레이터에서 "Show Alert" 버튼을 누르면 두 개의 버튼이 있는 대화 상자가 표시됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEj3rAtBursE_sULvXTsQtXMg5CSrbOfhtjiZMxP92Knwx0JdObX5c8ROoE1yr2cR0apNJQTznSPaYY67F9KWZghPLKJit0le13B9TfhaC18BNC9DKq2CPuqggvIw6RtVRGYG7d5uzsMXbJ9SDposWo-PePrwiXzx5fHm3rxk88TeIl-d7cZidvU2W9gO3c)

각 버튼을 누르면 터미널에 대응하는 메시지가 출력됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgGcXYW7eAyOqZBixHFZseTCUKAuH7CCrphkR-p3_dqF3CGs-R-9LGiApB86zlbYJnOgGnzF0N3GS2dUBi2vLeONgOAiagdzF2iwpSJlC9QGPzyEggSZs1ozJytOWxVaSGDg3P8YntHneE2lP7DPhwr2a80yR57Y4UDbKcyNFXYv4__9D2HVbejHnP2i-4)

Alert는 리액트 네이티브에서 사용할 수 있는 많은 API 중 하나일 뿐입니다.

앱을 만들 때 사용할 수 있는 전체 API 목록은 리액트 네이티브 공식문서의 개발 API 섹션을 참조하시면 됩니다.

요약하자면, Alert 컴포넌트는 중요한 정보를 제공하거나 사용자 결정을 요청하는 데 사용할 수 있습니다.

---

## Custom Component

지금까지 리액트 네이티브 앱을 빌드하기 위해 제공되는 10개의 핵심 컴포넌트를 다루었습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjjx5b2aGyNSfT1asjbV40sVdqGVuNt2Aab0WcT0_1S65eC8HhZzWsh08dunzLkpE1v5iz1eDNI0yyFXbveHAlMNrY0x162idgHMeLYyGR3b7pNgqjxpFDjXkPCdEQZ-GdIneN8FAje51EKEe-y0JKSH_5-0SIHyxjQugO9jvIuxjg9mhJr2zDHxI7IDoc)

하지만 대부분의 경우, 이러한 컴포넌트들을 결합하여 원하는 사용자 인터페이스를 만듭니다.

이번에는 View와 Text 핵심 컴포넌트를 사용하여 간단한 맞춤형 컴포넌트를 만드는 방법을 배워보겠습니다.

먼저, components라는 새로운 폴더를 만듭니다.

프로젝트 폴더 내에 components 폴더를 생성하세요.

그 폴더 안에 greet.js라는 새 파일을 만듭니다.

파일 내부에 name 프롭을 받아들이고, JSX 내에서 이를 렌더링하는 기본 컴포넌트를 정의합니다.

```jsx
import { View, Text } from 'react-native';

export default function Greet({ name }) {
  return (
    <View>
      <Text>Hello, {name}!</Text>
    </View>
  );
}
```

이렇게 하면 View와 Text 핵심 컴포넌트를 활용한 첫 번째 맞춤형 컴포넌트를 성공적으로 만들었습니다.

현재는 스타일링이 기본적이지만, 스타일링은 이번 영상의 초점이 아닙니다.

이제 app.js로 돌아가서 새로 만든 Greet 컴포넌트를 임포트하고 name 프롭과 함께 사용해 보겠습니다.

```jsx
import { View } from "react-native";
import Greet from "./components/greet";

export default function App() {
  return (
    <View style={{ flex: 1, padding: 60 }}>
      <Greet name="Squid" />
      <Greet name="Samdali" />
    </View>
  );
}

```

두 디바이스를 확인해 보면 아래 그림과 같이 메시지가 표시되는 것을 볼 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgoSJoxIOGjbnk5NYopO61zMNLYupz9h5KvAujfZW4S-iNWVElLt5QOQEWJqf9cUm8YOjF12hUeHxFYdRoNAalrvWMS1A51mTSbcpBFXoNaMhhb2YUv0AnbsdEPhh8Yn4le61u-BaT4jj9CzcbyTEtg61uPyAxClclVni-KyX7gMNZCqbhYFFuvzxK9P-Q)

이 컴포넌트는 현재는 단순하지만, 커스텀 카드 컴포넌트, 커스텀 버튼 컴포넌트, 커스텀 리스트 아이템 컴포넌트 등 재사용 가능한 맞춤형 컴포넌트를 만드는 과정을 상상해 볼 수 있습니다.

이것이 바로 리액트 네이티브 앱을 빌드하는 핵심 개념입니다.

핵심 컴포넌트를 결합하여 사용자 인터페이스를 구성하는 재사용 가능한 맞춤형 컴포넌트를 만드는 것입니다.

이 개념이 이해되셨기를 바랍니다.

이로써 리액트 네이티브의 핵심 컴포넌트 섹션을 마치겠습니다.

그럼.

