---
slug: 2024-07-01-react-native-10-networking-data-fetching-load-state-error-handling-data-post
title: 리액트 네이티브 강좌. 10편 - Networking 다루기, 데이터 fetching, loading state, error handling
date: 2024-07-01 11:42:33.017000+00:00
summary: 리액트 네이티브 앱에서의 네트워킹 기법을 다룹니다. JSON 데이터를 활용하여 앱에 데이터를 불러오고, 효과적인 에러 처리를 통해 안정성을 높이는 방법을 배워보세요.
tags: ["react native", "networking", "data fetching", "loading state", "error handling"]
contributors: []
draft: false
---

안녕하세요!

리액트 네이티브 강좌 10편입니다.

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

- [리액트 네이티브 강좌. 10편 - Networking 다루기, 데이터 fetching, loading state, error handling](#리액트-네이티브-강좌-10편---networking-다루기-데이터-fetching-loading-state-error-handling)
  - [리액트 네이티브 강좌 9편: 네트워킹](#리액트-네이티브-강좌-9편-네트워킹)
    - [네트워킹 시작!](#네트워킹-시작)
    - [JSON Placeholder!](#json-placeholder)
  - [리액트 네이티브 앱에 데이터를 불러와서 보여주기](#리액트-네이티브-앱에-데이터를-불러와서-보여주기)
    - [깨끗한 캔버스부터 준비](#깨끗한-캔버스부터-준비)
    - [기본 틀 다지기](#기본-틀-다지기)
    - [API 데이터 가져오기 마스터!](#api-데이터-가져오기-마스터)
    - [데이터를 화면에 뿌려주기](#데이터를-화면에-뿌려주기)
    - [UI 개선하기](#ui-개선하기)
  - [로딩 상태 추가하기](#로딩-상태-추가하기)
    - [새로운 상태 변수 등장!](#새로운-상태-변수-등장)
    - [로딩 스피너 보여주기](#로딩-스피너-보여주기)
    - [로딩 상태 확인!](#로딩-상태-확인)
    - [로딩 상태 추가의 효과](#로딩-상태-추가의-효과)
  - [Pull to Refresh](#pull-to-refresh)
    - [새로 고침 상태 관리하기](#새로-고침-상태-관리하기)
    - [FlatList에 새로 고침 기능 연결하기](#flatlist에-새로-고침-기능-연결하기)
    - [새로 고침 함수 만들기](#새로-고침-함수-만들기)
    - [끌어당겨 새로 고침 완성](#끌어당겨-새로-고침-완성)
  - [리액트 네이티브 앱에서 데이터 전송하기](#리액트-네이티브-앱에서-데이터-전송하기)
    - [1단계: 상태 변수 설정하기](#1단계-상태-변수-설정하기)
    - [2단계: UI 요소 연결하기](#2단계-ui-요소-연결하기)
    - [3단계: 데이터 전송 함수 구현하기](#3단계-데이터-전송-함수-구현하기)
    - [실행 결과 확인하기](#실행-결과-확인하기)
  - [에러 처리](#에러-처리)
    - [1단계: 에러 처리 준비 운동!](#1단계-에러-처리-준비-운동)
    - [2단계: try-catch로 에러 잡아내기](#2단계-try-catch로-에러-잡아내기)
    - [3단계: 에러 메시지 표시하기](#3단계-에러-메시지-표시하기)
    - [에러 발생 시켜보기!](#에러-발생-시켜보기)
    - [중요! 안드로이드 에뮬레이터에서 localhost 주의 사항](#중요-안드로이드-에뮬레이터에서-localhost-주의-사항)

---

## 리액트 네이티브 강좌 9편: 네트워킹

안녕하세요!

드디어 리액트 네이티브 강좌 9편, 네트워킹 시간이 돌아왔습니다!

이번 시간에는 리액트 네이티브에서 API를 이용해서 데이터를 가져오고, 또 보내는 방법을 집중적으로 파헤쳐 볼 생각입니다.

특히, 데이터를 불러오는 동안 표시할 로딩 상태 처리, 예상치 못한 에러에 대비하는 에러 핸들링, 그리고 데이터를 예쁘게 보여줄 FlatList 컴포넌트 활용법까지 차근차근 알아보겠습니다.

사실 이번 시간에 배우는 내용들은 react-query나 TanStack Query 같은 편리한 라이브러리를 사용해도 구현할 수 있는데요.

하지만 이번 강좌에서는 순수 리액트 네이티브만 사용해서 기본기를 탄탄하게 다져보고, 나중에 기회가 되면 TanStack Query도 따로 다뤄보도록 하겠습니다.

### 네트워킹 시작!

이번 시간에는 모의 서버를 구축하고 API 요청을 처리하는 것보다는 리액트 네이티브 코드 자체에 집중하고 싶어서, 실제 서버 대신 아주 유용한 서비스의 도움을 받을 예정입니다.

### JSON Placeholder!

바로 **JSON Placeholder**라는 온라인 무료 REST API 서비스인데요, 가짜 데이터가 필요할 때마다 사용할 수 있는 아주 꿀같은 서비스입니다.

튜토리얼을 만들거나 새로운 라이브러리를 테스트할 때, 또는 코드 예제를 공유할 때 사용하면 정말 편리합니다.

자, 그럼 `jsonplaceholder.typicode.com` 에 접속해 볼까요?

웹사이트에 접속해서 스크롤을 조금 내려보면 게시글, 댓글, 앨범 등 다양한 엔드포인트가 준비되어 있는 것을 확인할 수 있습니다.

우리는 이 중에서 `/posts` 엔드포인트를 사용해서 실습을 진행할 겁니다.

그 전에 `/posts` 엔드포인트에 대해 조금 더 자세히 알아보겠습니다.

`/posts` 엔드포인트는 100개의 게시글 정보를 반환하는데, 각 게시글에는 1부터 100까지의 고유한 ID, 사용자 ID, 제목, 그리고 내용이 포함되어 있습니다.

물론 내용은 말이 안 되는 텍스트들이지만, 우리는 텍스트 내용보다는 데이터를 가져오고 표시하는 방법에 집중하면 됩니다.

여기서 중요한 포인트는 바로 **쿼리 파라미터**를 사용할 수 있다는 점입니다.

예를 들어, `/posts?_limit=10` 처럼 URL에 `_limit=10` 을 추가하면 API는 처음 10개의 게시글만 반환합니다.

다시 웹사이트로 돌아가서 조금 더 아래로 스크롤을 내려 'Routes' 섹션을 보면 `/posts` 엔드포인트에서 POST 요청도 지원한다는 것을 알 수 있습니다.

나중에 POST 요청을 보내는 방법도 다룰 예정이니, 참고 바랍니다.

---

## 리액트 네이티브 앱에 데이터를 불러와서 보여주기

리액트 네이티브 컴포넌트 안에서 이 API를 이용해서 데이터를 가져오고, 우리가 만든 앱 화면에 멋지게 뿌려주는 방법을 알아보겠습니다.

### 깨끗한 캔버스부터 준비

자, 먼저 `App.js` 파일을 열고 기존에 있던 JSX 코드와 스타일들을 싹 지워서 깨끗한 캔버스를 만들어 줍니다.

### 기본 틀 다지기

가장 먼저 `SafeAreaView` 와 `View` 컴포넌트를 import 해서 기본 틀을 만들어 줍시다.

```javascript
import { SafeAreaView, View, StyleSheet, StatusBar } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.listContainer}>
        {/* 여기에 데이터를 보여줄 거예요! */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: StatusBar.currentHeight,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
```

- `SafeAreaView`는 기기의 상태표시줄이나 노치 디자인을 고려해서 컨텐츠가 가려지지 않도록 안전한 영역을 제공해주는 컴포넌트입니다.
- `styles.container` 스타일을 적용해서 배경색을 연회색(`#F5F5F5`)으로 지정하고, 컨텐츠가 상태표시줄 아래부터 보이도록 상단 패딩을 추가했습니다.
- `View` 컴포넌트는 `styles.listContainer` 스타일을 적용해서 좌우에 16px의 패딩을 추가했습니다. 
나중에 여기에 데이터를 표시할 예정입니다.

코드를 저장하고 실행해 보면 살짝 회색빛이 도는 빈 화면이 나타날 겁니다.

아직은 텅 비어있지만, 곧 데이터로 가득 채워질 예정이니 계속 이어 가겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgWFP1p4fbuqwjG1MB41U_RtKH9dTrKy30o1Ui2M7zG_wNCr-dUPS4wGJXZdTvnMn_SCcxQW-_cdJzMASpsZggtG0xAHi5XkhuDVPouc-nCVAPjSmw9ogc3IYLSGOnCHEGwCI8rQPc46UtWwUwG7miM4L2OlxTPJkWfgoXBH2gSwNCbJZHIs2vRzJQDnqQ)


### API 데이터 가져오기 마스터!

이제 `App` 컴포넌트 안에서 API 엔드포인트로부터 데이터를 가져와 보겠습니다.

`fetchData`라는 비동기 함수를 만들어서 데이터를 가져오는 역할을 맡겨 줍시다.

```javascript
import { useState, useEffect } from 'react';
// ... (기존 코드)

export default function App() {
  const [posts, setPosts] = useState([]);

  const fetchData = async (limit = 10) => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=${limit}`);
    const data = await response.json();
    setPosts(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ... (나머지 코드)
};
```

- `useState` 훅을 사용하여 `posts`라는 상태 변수를 만들고 초기값으로 빈 배열을 할당했습니다. 이 변수에 API에서 가져온 데이터를 저장할 예정입니다.
- `fetchData` 함수는 `https://jsonplaceholder.typicode.com/posts?_limit=${limit}` URL로 fetch 요청을 보내서 데이터를 가져옵니다. 
- `limit` 매개변수를 사용하여 가져올 게시글 개수를 지정할 수 있도록 했습니다. 기본값은 10개입니다.
- `response.json()` 메서드를 사용하여 응답 데이터를 JSON 형식으로 변환합니다.
- `setPosts` 함수를 사용하여 가져온 데이터를 `posts` 상태 변수에 저장합니다.
- `useEffect` 훅을 사용하여 컴포넌트가 마운트될 때 `fetchData` 함수를 호출하도록 했습니다. 

### 데이터를 화면에 뿌려주기

이제 `posts` 상태 변수에 데이터가 저장되었으니, `FlatList` 컴포넌트를 사용해서 화면에 예쁘게 표시해 보겠습니다.

```javascript
import { useState, useEffect } from 'react';
import { 
  SafeAreaView, 
  View, 
  StyleSheet, 
  StatusBar, 
  FlatList, 
  Text 
} from 'react-native';

// ... (기존 코드)

export default function App() {
  // ... (기존 코드)

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.listContainer}>
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.titleText}>{item.title}</Text>
              <Text style={styles.bodyText}>{item.body}</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // ... (기존 스타일)
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 16,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default App;
```

- `FlatList` 컴포넌트에 `data` props로 `posts` 상태 변수를 전달했습니다. 
- `keyExtractor` props는 각 게시글을 고유하게 식별하기 위해 `item.id`를 사용하도록 설정했습니다.
- `renderItem` props는 각 게시글을 어떻게 렌더링할지 정의하는 함수를 전달합니다. 여기서는 `View` 컴포넌트를 사용하여 각 게시글을 카드 형태로 표시하고, `Text` 컴포넌트를 사용하여 게시글 제목과 내용을 보여줍니다.

코드를 저장하고 실행해 보면 API에서 가져온 게시글 목록이 아래와 같이 카드 형태로 멋지게 표시될 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhFCgO23t8g2iXrzIvBmVhkxg-coKt8GUGIPCqUNNyOMkJqzabrhQ3jl0cCt6biLCxp8Wq7-wV2-ARzdWk6aFaQBrD_XSdU81bHgtsDp-aBb0kLUds7CKcxwI26CJgeM_Xgjf-BzwMlznnIYYrnK4x_FgfLjgPc0MkQj1hsui7afOhCP2gR0MxCxiLaQxo)

### UI 개선하기

이제 게시글 목록이 보이긴 하지만, 조금 밋밋합니다.

구분선, 헤더, 푸터를 추가해서 UI를 더 보기 좋게 만들어 봅시다.

```javascript
import { useState, useEffect } from 'react';
// ... (기존 코드)

export default function App() {
  // ... (기존 코드)

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.listContainer}>
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            // ... (기존 코드)
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListHeaderComponent={() => (
            <Text style={styles.headerText}>게시글 목록</Text>
          )}
          ListFooterComponent={() => (
            <Text style={styles.footerText}>게시글 끝</Text>
          )}
          ListEmptyComponent={() => (
            <Text style={styles.emptyText}>게시글을 찾을 수 없습니다.</Text>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // ... (기존 스타일)
  separator: {
    height: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  footerText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default App;
```

- `ItemSeparatorComponent` props는 각 게시글 사이에 구분선을 추가합니다.
- `ListHeaderComponent` props는 목록 상단에 헤더를 추가합니다.
- `ListFooterComponent` props는 목록 하단에 푸터를 추가합니다.
- `ListEmptyComponent` props는 `data` props로 전달된 배열이 비어있을 때 표시할 컴포넌트를 지정합니다.

코드를 저장하고 실행해 보면 헤더, 구분선, 푸터가 추가되어 훨씬 보기 좋은 게시글 목록이 완성된 것을 확인할 수 있을 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiWx1h6zQ9peaEP2SOP197XRTNA2uFvM1fGBVFG9DPhH2DsqT4BPUKZ1jYM4AH6VwYvsirNq0c0nL-qUhM9Z4G8aOEqkhE_cAYxVoFLJONPc50TeIwGUxo89C3u5sYWTLsuldAVVJb_wSDiFm3Vlt6i4w3RL-NdqfJMgEP0TwvS9ZLpRKVulG3ynVtLEgI)

![](https://blogger.googleusercontent.com/img/a/AVvXsEgqMuA4pNlB6nlGFpHUhfoirQv9dxVFNI_eSw7dcx-u2o2K_8TYVLaAnzFpigqfS-PoxOC757rFIgslVR-kQKnB1olJYWmCVBQJEhhL1Y8_xW3Ff1G2gh3icpfEA1azQqYpCQ73otjNtWu0k5cdVelirKOU-K5EN6f3d_mJdMY1adPUL2Z4eM4xRVE1miU)

---

## 로딩 상태 추가하기

이번에는 데이터를 불러오는 동안 사용자에게 '로딩 중' 이라고 알려주는 친절한 로딩 상태를 구현해 보도록 하겠습니다!

### 새로운 상태 변수 등장!

로딩 상태를 추가하기 위해서는 먼저 새로운 상태 변수가 필요합니다.

이름은 `isLoading`으로 하고, `useState` 훅을 사용해서 초기값을 `true`로 설정해 줍시다.

데이터를 모두 가져오면 `false`로 변경해서 로딩 상태를 해제할 겁니다.

```javascript
import { useState, useEffect } from 'react';
// ... (기존 코드)

export default function App() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // 새로운 상태 변수 추가!

  // ... (기존 코드)

  const fetchData = async (limit = 10) => {
    // ... (기존 코드)
    setPosts(data);
    setIsLoading(false); // 데이터 가져오면 로딩 상태 해제!
  };

  // ... (기존 코드)
};
```

### 로딩 스피너 보여주기

이제 `isLoading` 상태 변수 값에 따라 로딩 스피너를 보여줄지, 아니면 게시글 목록을 보여줄지 결정하면 됩니다.

먼저 `ActivityIndicator` 컴포넌트를 import 해 주세요.

```javascript
import { 
  // ... (기존 코드)
  ActivityIndicator, 
} from 'react-native';
```

그리고 `return` 문 바로 앞에 `isLoading` 값에 따라 조건부 렌더링을 하는 코드를 추가해 줍시다.

```javascript
// ... (기존 코드)

return (
  <>
    {isLoading ? (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="blue" />
        <Text>Loading...</Text>
      </SafeAreaView>
    ) : (
      <SafeAreaView style={styles.container}>
        <View style={styles.listContainer}>
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.titleText}>{item.title}</Text>
                <Text style={styles.bodyText}>{item.body}</Text>
              </View>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListHeaderComponent={() => (
              <Text style={styles.headerText}>게시글 목록</Text>
            )}
            ListFooterComponent={() => (
              <Text style={styles.footerText}>게시글 끝</Text>
            )}
            ListEmptyComponent={() => (
              <Text style={styles.emptyText}>게시글을 찾을 수 없습니다.</Text>
            )}
          />
        </View>
      </SafeAreaView>
    )}
  </>
);

const styles = StyleSheet.create({
  // ... (기존 스타일)
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: StatusBar.currentHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

- `isLoading`이 `true`이면 로딩 스피너와 'Loading...' 텍스트를 화면 중앙에 표시합니다.
- `isLoading`이 `false`이면 원래대로 게시글 목록을 보여줍니다.

### 로딩 상태 확인!

코드를 저장하고 앱을 실행해 보면 앱이 실행되면 잠깐 동안 로딩 스피너가 나타났다가, 데이터를 모두 가져오면 게시글 목록이 나타날 겁니다.

만약 로딩 상태를 좀 더 오래 보고 싶다면 `fetchData` 함수에서 `setIsLoading(false)` 호출을 주석 처리하면 됩니다.

```javascript
const fetchData = async (limit = 10) => {
  // ... (기존 코드)
  setPosts(data);
  // setIsLoading(false); // 주석 처리!
};
```

아래 그림과 같이 무한 로딩이 나타나게 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgD438aGvTgkToCj-yAvKCcpjzFADV59DhS1pOs7kHvzY5bibzGIlUzkvGkgokYV5pLaQjZN1XbZ4O7KbDwug2BhGipeEfeXy8QChmvLOzQbUU41Y_Sff6sW63cfeOdJVhlQexjGQkUVIEn3Q7uJymYedAGLTeiFxLroPacKt8d0zABYq3EVDNgVrl1aLQ)

### 로딩 상태 추가의 효과

이처럼 로딩 상태를 추가하는 것은 아주 간단하지만 사용자 경험(UX)을 크게 향상시키는 효과가 있습니다.

사용자는 앱이 멈춘 것은 아닌지 불안해하지 않고, 데이터가 언제쯤 불러와질지 예상하면서 조금 더 편안하게 기다릴 수 있게 되는 것이죠!

---

## Pull to Refresh

이번에는 리액트 네이티브에서 `FlatList` 컴포넌트를 사용할 때 끌어당겨 새로 고침 기능(Pull to Refresh)을 구현하는 방법을 알아보겠습니다.

앱을 재시작하지 않고도 표시되는 데이터를 간편하게 새로 고침하고 싶을 때 정말 유용한 기능이죠!

우리는 이미 JSON Placeholder API에서 게시글을 가져오는 방법을 알고 있으니, 이 데이터를 새로 고침하는 방법을 바로 구현해 보도록 하겠습니다!

### 새로 고침 상태 관리하기

먼저, 새로 고침 상태를 추적하기 위해 새로운 상태 변수를 추가해 줍시다.

이름은 `refreshing`으로 하고, 초기값은 `false`로 설정합니다.

```javascript
import { useState, useEffect } from 'react';
// ... (기존 코드)

export default function App() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // 새로운 상태 변수 추가!

  // ... (기존 코드)
};
```

### FlatList에 새로 고침 기능 연결하기

이제 `FlatList` 컴포넌트에 `refreshing` props와 `onRefresh` props를 추가해서 새로 고침 기능을 연결해 볼게요.

```javascript
// ... (기존 코드)

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.listContainer}>
        <FlatList
          data={posts}
          // ... (기존 코드)
          refreshing={refreshing} // refreshing 상태 연결!
          onRefresh={handleRefresh} // 새로 고침 함수 연결!
        />
      </View>
    </SafeAreaView>
  );
};

// ... (기존 코드)
```

- `refreshing` props는 `FlatList` 컴포넌트의 새로 고침 상태를 제어합니다. 우리가 만든 `refreshing` 상태 변수를 연결해 주면 됩니다.
- `onRefresh` props는 사용자가 목록을 아래로 당겨서 새로 고침을 시도할 때 실행될 함수를 지정합니다. 이제 이 함수를 만들면 됩니다.

### 새로 고침 함수 만들기

`handleRefresh` 함수를 만들고, 그 안에서 새로 고침 로직을 구현해 봅시다.

```javascript
// ... (기존 코드)

export default function App() {
  // ... (기존 코드)

  const handleRefresh = () => {
    setRefreshing(true); // 새로 고침 시작!
    fetchData(20); // fetchData 함수를 호출하여 데이터를 다시 가져옵니다.
    setRefreshing(false); // 새로 고침 완료!
  };

  // ... (기존 코드)
};
```

- `setRefreshing(true)`를 호출하여 새로 고침 상태를 활성화합니다. 이때 `FlatList` 컴포넌트는 자동으로 로딩 스피너를 표시합니다.
- `fetchData(20)` 함수를 호출하여 게시글 데이터를 다시 가져옵니다. 이때 `limit` 값을 20으로 지정하여 기존 10개에 추가로 10개를 더 가져오도록 합니다.
- `setRefreshing(false)`를 호출하여 새로 고침 상태를 비활성화합니다. 로딩 스피너가 사라지고 업데이트된 데이터가 표시됩니다.

### 끌어당겨 새로 고침 완성

코드를 저장하고 앱을 실행해 봅시다.

게시글 목록을 아래로 쭉 끌어당겨 보시면, 빙글빙글 도는 로딩 스피너와 함께 새로운 게시글들이 나타날 겁니다.

이처럼 `FlatList` 컴포넌트의 `refreshing` props와 `onRefresh` props를 사용하면 아주 간단하게 끌어당겨 새로 고침 기능을 구현할 수 있습니다.

---

## 리액트 네이티브 앱에서 데이터 전송하기

이번에는 리액트 네이티브 앱에서 POST 요청을 보내는 방법을 알아보겠습니다.

예제로는 역시 친숙한 JSON Placeholder API를 사용할 겁니다.

새로운 게시글 제목과 내용을 담아서 서버로 전송하는거죠.

JSON Placeholder API는 `/posts` 엔드포인트에 POST 요청을 보내면 새로운 게시글을 추가할 수 있도록 해줍니다.

덕분에 우리는 복잡한 서버 설정 없이 리액트 네이티브 코드에만 집중할 수 있습니다!

자세한 내용은 JSON Placeholder API 문서의 'Creating a resource' 가이드를 참고해 주세요.

### 1단계: 상태 변수 설정하기

먼저, 게시글 제목과 내용을 저장할 상태 변수를 만들어 줍시다.

그리고 데이터 전송 과정을 추적하기 위한 `isPosting` 변수도 추가해 주세요.

```javascript
import { useState, useEffect } from 'react';
// ... (기존 코드)

export default function App() {
  // ... (기존 코드)
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const [isPosting, setIsPosting] = useState(false); // 데이터 전송 상태 변수

  // ... (기존 코드)
};
```

### 2단계: UI 요소 연결하기

이제 방금 만든 상태 변수들을 UI 요소와 연결해 봅시다.

기존 JSX 코드를 `SafeAreaView`로 감싸고, 목록 위에 새로운 `View` 컴포넌트를 추가해 주세요.

```javascript
// ... (기존 코드)

  return (
    <>
      {isLoading ? (
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="blue" />
          <Text>Loading...</Text>
        </SafeAreaView>
      ) : (
        <SafeAreaView style={styles.container}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="게시글 제목"
              value={postTitle}
              onChangeText={setPostTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="게시글 내용"
              value={postBody}
              onChangeText={setPostBody}
            />
            <Button
              title={isPosting ? "추가 중..." : "게시글 추가"}
              onPress={addPost}
              disabled={isPosting}
            />
          </View>

          <View style={styles.listContainer}>
            <FlatList
              data={posts}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <Text style={styles.titleText}>{item.title}</Text>
                  <Text style={styles.bodyText}>{item.body}</Text>
                </View>
              )}
              refreshing={refreshing} // refreshing 상태 연결!
              onRefresh={handleRefresh} // 새로 고침 함수 연결!
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              ListHeaderComponent={() => (
                <Text style={styles.headerText}>게시글 목록</Text>
              )}
              ListFooterComponent={() => (
                <Text style={styles.footerText}>게시글 끝</Text>
              )}
              ListEmptyComponent={() => (
                <Text style={styles.emptyText}>
                  게시글을 찾을 수 없습니다.
                </Text>
              )}
            />
          </View>
        </SafeAreaView>
      )}
    </>
  );
};

// ... (기존 스타일)
const styles = StyleSheet.create({
  // ... (기존 스타일)
  inputContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 8,
    padding: 8,
    borderRadius: 8,
  },
});
```

- `TextInput` 컴포넌트를 사용하여 게시글 제목과 내용을 입력받습니다.
- `Button` 컴포넌트를 사용하여 게시글을 추가하는 기능을 제공합니다.
- `isPosting` 상태에 따라 버튼 텍스트와 활성화 상태를 변경합니다.

### 3단계: 데이터 전송 함수 구현하기

마지막으로 버튼 클릭 이벤트를 처리할 `addPost` 함수를 구현해 봅시다.

```javascript
// ... (기존 코드)

export default function App() {
  // ... (기존 코드)

  const addPost = async () => {
    setIsPosting(true); // 데이터 전송 시작!

    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: postTitle,
        body: postBody,
      }),
    });

    const newPost = await response.json();

    // 새로운 게시글을 목록 맨 앞에 추가
    setPosts([newPost, ...posts]); 
    // 입력 필드 초기화
    setPostTitle('');
    setPostBody('');
  
    setIsPosting(false); // 데이터 전송 완료!

  };

  // ... (기존 코드)
};
```

- `setIsPosting(true)`를 호출하여 데이터 전송 상태를 활성화합니다.
- `fetch` 함수를 사용하여 POST 요청을 보냅니다.
  - `method: 'POST'`로 설정합니다.
  - `headers`에 `Content-Type`을 `application/json`으로 설정합니다.
  - `body`에 전송할 데이터를 JSON 형식으로 변환하여 담습니다.
- 응답 데이터를 JSON 형식으로 변환합니다.
- 새로운 게시글을 `posts` 배열의 맨 앞에 추가합니다.
- 입력 필드를 초기화합니다.
- `setIsPosting(false)`를 호출하여 데이터 전송 상태를 비활성화합니다.

### 실행 결과 확인하기

코드를 저장하고 앱을 실행해 봅시다.

게시글 제목과 내용을 입력하고 '게시글 추가' 버튼을 누르면 잠시 후 새로운 게시글이 목록 맨 위에 추가될 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgcELyAdFk_1FAXYOgvau4Co11Vt7_IQsnfVeV_R7WRq4nRewrX_iP5qPi2kOHp2-6eGcf81WZ4EaG4--FnWyk7LiPOWQKmtKBZfX54rAXI2fuD6NqY5-R0B_n-ujUSzpubsGi8GNOgEivPlbBl5SOhK_209-eNzsys8QlJTkXWmlxwRSvK-uZR7HKvBeM)

![](https://blogger.googleusercontent.com/img/a/AVvXsEjGG7NqkkLoCAKksH_EsG9Qbfc64cp7HO8fnA_wZTRaIPfqaVDZ_jJ_UbnHyMTGH5D7ggMHxqADylJ5TF-Fou4CATgY6p4ow38r4HjXmMqDF8ukJ5B4-1s82HtSmH0J5vjnEoEySmG82TH86AZzvgh3ITrGd20N572SWuBIdvQR7WMQ07TlCsWJAsjrqh0)

이처럼 `fetch` 함수를 사용하면 리액트 네이티브 앱에서 손쉽게 POST 요청을 보낼 수 있습니다.

물론 `fetch` 외에도 `axios`나 `TanStack Query`를 사용해도 됩니다.

---

## 에러 처리

마지막 단계입니다.

이번에는 데이터를 가져오거나 전송할 때 발생할 수 있는 에러를 처리하는 방법을 알아보겠습니다. 

### 1단계: 에러 처리 준비 운동!

먼저, 에러가 발생했을 때 이를 저장할 상태 변수를 만들어 줍시다.

`error`라는 이름으로 하고, 초기값은 빈 문자열로 설정합니다.

```javascript
import React, { useState, useEffect } from 'react';
// ... (기존 코드)

export default function App() {
  // ... (기존 코드)
  const [error, setError] = useState(''); // 에러 상태 변수 추가!

  // ... (기존 코드)
};
```

### 2단계: try-catch로 에러 잡아내기

이제 `fetchData` 함수와 `addPost` 함수에 `try-catch` 블록을 추가해서 에러를 처리해 봅시다!

```javascript
// ... (기존 코드)

const fetchData = async (limit = 10) => {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts?_limit=${limit}`
    );
    const data = await response.json();
    setPosts(data);
    setIsLoading(false); // 데이터 가져오면 로딩 상태 해제!
    setError(''); // 기존 에러 메시지 초기화
  } catch (error) {
    console.error("Error fetching data:", error);
    setIsLoading(false); // 에러 발생 시에도 로딩 상태 해제!
    setError('Failed to fetch post list');
  }
};

const handleRefresh = async () => {
    setRefreshing(true); // 새로 고침 시작!
    try {
      await fetchData(20); // fetchData 함수를 호출하여 데이터를 다시 가져옵니다.
      setRefreshing(false); // 새로 고침 완료!
    } catch (error) {
      console.error("Error refreshing data:", error);
  };

const addPost = async () => {
    setIsPosting(true); // 데이터 전송 시작!

    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: postTitle,
            body: postBody,
          }),
        }
      );

      const newPost = await response.json();

      // 새로운 게시글을 목록 맨 앞에 추가
      setPosts([newPost, ...posts]);
      // 입력 필드 초기화
      setPostTitle("");
      setPostBody("");
      setIsPosting(false); // 데이터 전송 완료!
      setError(''); // 기존 에러 메시지 초기화
    } catch (error) {
      console.error("Error adding post:", error);
      setError("Failed to add new post");
    }
  };
```

- `try` 블록 안에는 기존 코드를 그대로 넣어줍니다.
- `catch` 블록에서는 발생한 에러 객체(`error`)를 받아서 콘솔에 에러 메시지를 출력하고, `setError` 함수를 사용하여 에러 메시지를 상태 변수에 저장합니다.
- `finally` 블록에서는 `setIsLoading`과 `setIsPosting`을 `false`로 설정하여 로딩 상태를 해제합니다.

### 3단계: 에러 메시지 표시하기

마지막으로, 에러 상태(`error`)에 따라 사용자에게 에러 메시지를 표시하는 UI를 추가해 봅시다!

```javascript
// ... (기존 코드)

  return (
    <>
      {isLoading ? (
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="blue" />
          <Text>Loading...</Text>
        </SafeAreaView>
      ) : (
        <SafeAreaView style={styles.container}>
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : (
            <React.Fragment>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="게시글 제목"
                  value={postTitle}
                  onChangeText={setPostTitle}
                />
                <TextInput
                  style={styles.input}
                  placeholder="게시글 내용"
                  value={postBody}
                  onChangeText={setPostBody}
                />
                <Button
                  title={isPosting ? "추가 중..." : "게시글 추가"}
                  onPress={addPost}
                  disabled={isPosting}
                />
              </View>

              <View style={styles.listContainer}>
                <FlatList
                  data={posts}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <View style={styles.card}>
                      <Text style={styles.titleText}>{item.title}</Text>
                      <Text style={styles.bodyText}>{item.body}</Text>
                    </View>
                  )}
                  refreshing={refreshing} // refreshing 상태 연결!
                  onRefresh={handleRefresh} // 새로 고침 함수 연결!
                  ItemSeparatorComponent={() => (
                    <View style={styles.separator} />
                  )}
                  ListHeaderComponent={() => (
                    <Text style={styles.headerText}>게시글 목록</Text>
                  )}
                  ListFooterComponent={() => (
                    <Text style={styles.footerText}>게시글 끝</Text>
                  )}
                  ListEmptyComponent={() => (
                    <Text style={styles.emptyText}>
                      게시글을 찾을 수 없습니다.
                    </Text>
                  )}
                />
              </View>
            </React.Fragment>
          )}
        </SafeAreaView>
      )}
    </>
  );
};

// ... (기존 스타일)
const styles = StyleSheet.create({
  // ... (기존 스타일)
  errorContainer: {
    backgroundColor: '#fdd',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#faa',
    margin: 16,
    alignItems: 'center',
  },
  errorText: {
    color: '#a00',
    fontSize: 16,
    textAlign: 'center',
  },
});
```

- `error` 상태 변수에 값이 있으면 에러 메시지를 표시하고, 그렇지 않으면 기존 UI를 표시합니다.

### 에러 발생 시켜보기!

이제 에러 처리 코드를 테스트해 볼까요?

`fetchData` 함수에서 URL을 잘못된 주소로 변경해 봅시다.

앱을 실행하면 "Failed to fetch post list"라는 에러 메시지가 표시될 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEijdDBMlJRCv_2J7dTjYrArW0TSTRCpeXHRgH0m7HddHbLsUe6bAJEZnICdbUqk7E9soCmqvXjso5fHjKuN2sfiaf2ClTeCat0xUH79kF8OHKMvfCa9DqG89Jh7zHT1q0nBp29yZFNuYdYaE9FlufZpzgltlksCS42P8CDhwlzznckKYr6ax90pZTMdjBs)

### 중요! 안드로이드 에뮬레이터에서 localhost 주의 사항

안드로이드 에뮬레이터에서는 `localhost` 주소를 사용하는 API 요청이 정상적으로 작동하지 않을 수 있습니다.

iOS 기기에서는 문제없이 작동하지만, 안드로이드에서는 `localhost` 대신 컴퓨터의 IP 주소를 사용하는 등의 해결 방법이 필요합니다.

자세한 내용은 관련된 공식 문서를 참고해 주시기 바랍니다.

전체 코드입니다.

```js
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  StatusBar,
  FlatList,
  Text,
  TextInput,
  ActivityIndicator,
  Button,
} from "react-native";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // 새로운 상태 변수 추가!
  const [refreshing, setRefreshing] = useState(false); // 새로운 상태 변수 추가!
  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const [isPosting, setIsPosting] = useState(false); // 데이터 전송 상태 변수
  const [error, setError] = useState(""); // 에러 상태 변수 추가!

  const fetchData = async (limit = 10) => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_limit=${limit}`
      );
      const data = await response.json();
      setPosts(data);
      setIsLoading(false); // 데이터 가져오면 로딩 상태 해제!
      setError(""); // 기존 에러 메시지 초기화
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false); // 에러 발생 시에도 로딩 상태 해제!
      setError("Failed to fetch post list");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true); // 새로 고침 시작!
    try {
      await fetchData(20); // fetchData 함수를 호출하여 데이터를 다시 가져옵니다.
      setRefreshing(false); // 새로 고침 완료!
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  const addPost = async () => {
    setIsPosting(true); // 데이터 전송 시작!

    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: postTitle,
            body: postBody,
          }),
        }
      );

      const newPost = await response.json();

      // 새로운 게시글을 목록 맨 앞에 추가
      setPosts([newPost, ...posts]);
      // 입력 필드 초기화
      setPostTitle("");
      setPostBody("");
      setIsPosting(false); // 데이터 전송 완료!
      setError(""); // 기존 에러 메시지 초기화
    } catch (error) {
      console.error("Error adding post:", error);
      setError("Failed to add new post");
    }
  };

  return (
    <>
      {isLoading ? (
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="blue" />
          <Text>Loading...</Text>
        </SafeAreaView>
      ) : (
        <SafeAreaView style={styles.container}>
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : (
            <React.Fragment>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="게시글 제목"
                  value={postTitle}
                  onChangeText={setPostTitle}
                />
                <TextInput
                  style={styles.input}
                  placeholder="게시글 내용"
                  value={postBody}
                  onChangeText={setPostBody}
                />
                <Button
                  title={isPosting ? "추가 중..." : "게시글 추가"}
                  onPress={addPost}
                  disabled={isPosting}
                />
              </View>

              <View style={styles.listContainer}>
                <FlatList
                  data={posts}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <View style={styles.card}>
                      <Text style={styles.titleText}>{item.title}</Text>
                      <Text style={styles.bodyText}>{item.body}</Text>
                    </View>
                  )}
                  refreshing={refreshing} // refreshing 상태 연결!
                  onRefresh={handleRefresh} // 새로 고침 함수 연결!
                  ItemSeparatorComponent={() => (
                    <View style={styles.separator} />
                  )}
                  ListHeaderComponent={() => (
                    <Text style={styles.headerText}>게시글 목록</Text>
                  )}
                  ListFooterComponent={() => (
                    <Text style={styles.footerText}>게시글 끝</Text>
                  )}
                  ListEmptyComponent={() => (
                    <Text style={styles.emptyText}>
                      게시글을 찾을 수 없습니다.
                    </Text>
                  )}
                />
              </View>
            </React.Fragment>
          )}
        </SafeAreaView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingTop: StatusBar.currentHeight,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 16,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 16,
    color: "#666",
  },
  separator: {
    height: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  footerText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingTop: StatusBar.currentHeight,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 8,
    padding: 8,
    borderRadius: 8,
  },
  errorContainer: {
    backgroundColor: "#fdd",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#faa",
    margin: 16,
    alignItems: "center",
  },
  errorText: {
    color: "#a00",
    fontSize: 16,
    textAlign: "center",
  },
});
```