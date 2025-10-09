---
slug: 2025-07-16-how-to-create-user-onboarding-tour-with-driverjs
title: Driver.js로 5분 만에 사용자 온보딩 투어 만들기
date: 2025-07-16 12:44:05.588000+00:00
summary: 가벼운 자바스크립트 라이브러리 Driver.js를 사용하여 웹사이트를 위한 단계별 사용자 온보딩 투어를 5분 안에 만드는 방법을 배워보세요. 이 튜토리얼은 기본 설정부터 고급 커스터마이징, 실전 예제까지 모든 것을 다룹니다.
tags: ["Driver.js", "사용자 온보딩", "프로덕트 투어", "자바스크립트", "가이드 투어", "기능 소개", "UI/UX", "웹 개발", "튜토리얼", "user onboarding", "javaScript"]
contributors: []
draft: false
---

새로운 웹사이트나 앱 기능을 출시했을 때, 사용자들이 그 가치를 바로 알아보게 하는 것은 모든 개발자와 기획자의 꿈입니다.

하지만 복잡한 UI 속에서 사용자는 길을 잃기 쉽습니다.

"이 버튼은 뭐지?", "어디부터 시작해야 하지?"라는 막막함을 해결해 줄 멋진 해결책이 바로 **Driver.js**입니다.

이 글에서는 가볍고 강력한 자바스크립트 라이브러리인 Driver.js를 사용하여, 웹사이트의 주요 기능을 단계별로 안내하는 '가이드 투어'를 만드는 방법을 처음부터 끝까지 알아보겠습니다.

코드를 복사-붙여넣기만 해도 바로 동작하는 예제들을 통해 개념을 익히고, 여러분의 프로젝트에 즉시 적용할 수 있도록 도와드리겠습니다.

### 목차
1.  **Driver.js란 무엇이며 왜 사용해야 할까요?**
2.  **첫 번째 투어 설정하기: 기본 환경 구성**
3.  **다단계 투어 구축하기: 핵심 기능 마스터**
4.  **고급 제어 및 커스터마이징: 나만의 투어 만들기**
5.  **이벤트 훅 활용하기: 동적인 로직 추가**
6.  **실전 예제: 종합적인 대시보드 온보딩 투어 만들기**

---

### 1. Driver.js란 무엇이며 왜 사용해야 할까요?

Driver.js를 웹사이트를 위한 **개인 투어 가이드**라고 생각해보세요.

처음 방문하는 박물관에서 친절한 가이드가 나타나 가장 중요한 작품에 조명을 비추고, 나머지 공간은 살짝 어둡게 하여 관람객의 시선을 집중시키는 것과 같습니다.

사용자에게는 새로운 기능이나 복잡한 워크플로우를 쉽고 직관적으로 학습할 수 있는 최고의 경험을 제공합니다. 개발자에게는 다음과 같은 큰 장점이 있습니다.

*   **경량성:** 다른 무거운 라이브러리에 대한 의존성 없이, CSS와 JS 파일 단 두 개만 추가하면 바로 사용할 수 있습니다.
*   **직관적인 코드:** 투어의 각 단계를 배열(Array) 형태로 "1번은 여기, 2번은 저기"와 같이 매우 선언적이고 읽기 쉬운 코드로 정의할 수 있습니다.
*   **유연성:** 간단한 하이라이팅부터 복잡한 다단계 투어, 동적인 로직 연동까지 폭넓은 활용이 가능합니다.

이제 말은 그만하고, 직접 코드를 작성하며 Driver.js의 강력함을 느껴봅시다.

### 2. 첫 번째 투어 설정하기: 기본 환경 구성

가장 먼저 할 일은 Driver.js를 우리 프로젝트에 추가하는 것입니다.

여기서는 가장 간편한 CDN(Content Delivery Network) 방식을 사용하겠습니다.

**1. 기본 HTML 파일 준비**

먼저, 투어를 적용할 간단한 HTML 파일을 만듭니다.

`index.html`이라는 이름으로 아래 코드를 작성하세요.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>Driver.js 튜토리얼</title>
    <!-- 1. Driver.js CSS 파일 추가 -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/driver.js@1.0.1/dist/driver.css"/>
</head>
<body>

    <h1>Driver.js 시작하기</h1>
    <p>이 버튼을 눌러 첫 번째 가이드 투어를 시작하세요.</p>
    
    <button id="start-tour-btn">투어 시작!</button>
    
    <!-- 2. Driver.js JS 파일 추가 -->
    <script src="https://cdn.jsdelivr.net/npm/driver.js@1.0.1/dist/driver.js.iife.js"></script>
    <!-- 3. 우리만의 스크립트 파일 추가 -->
    <script src="app.js"></script>
</body>
</html>
```

**2. 자바스크립트 파일 작성**

이제 `app.js` 파일을 만들고, "투어 시작!" 버튼을 클릭했을 때 특정 요소를 하이라이트하는 코드를 작성해 보겠습니다.

```javascript
// app.js

// 1. Driver.js 인스턴스 생성
const driver = window.driver.js.driver;

// 2. 버튼 클릭 이벤트 리스너 추가
document.getElementById('start-tour-btn').addEventListener('click', () => {
  const driverObj = driver();

  // 3. 특정 요소 하이라이트
  driverObj.highlight({
    element: '#start-tour-btn', // 하이라이트할 요소의 CSS 선택자
    popover: {
      title: '첫 번째 단계',
      description: '이것이 바로 Driver.js를 사용한 하이라이트 기능입니다!'
    }
  });
});
```

이제 `index.html` 파일을 브라우저에서 열고 "투어 시작!" 버튼을 클릭해보세요.

버튼이 환하게 강조되고 설명 팝오버가 나타나는 것을 볼 수 있습니다. 정말 간단하죠?

### 3. 다단계 투어 구축하기: 핵심 기능 마스터

하나의 요소만 강조하는 것은 시작에 불과합니다.

Driver.js의 진정한 힘은 여러 단계를 연결하여 하나의 완전한 스토리, 즉 '투어'를 만드는 데 있습니다.

**1. HTML 구조 확장**

가이드할 요소들을 추가해 보겠습니다.

`index.html`의 `<body>` 태그 안쪽을 아래와 같이 수정합니다.

```html
<!-- index.html의 body 부분 -->
<body>
    <header>
        <h1 id="main-title">Driver.js 튜토리얼</h1>
        <nav>
            <a href="#">홈</a> | <a href="#" id="profile-link">프로필</a>
        </nav>
    </header>

    <main>
        <h2>주요 기능 소개</h2>
        <p>이 버튼을 눌러 다단계 가이드 투어를 시작하세요.</p>
        <button id="start-multi-step-tour">다단계 투어 시작</button>
    </main>
    
    <footer>
        <p id="footer-text">&copy; 2024 My Website</p>
    </footer>

    <!-- 스크립트 태그들은 그대로 둡니다 -->
    <script src="https://cdn.jsdelivr.net/npm/driver.js@1.0.1/dist/driver.css"></script>
    <script src="https://cdn.jsdelivr.net/npm/driver.js@1.0.1/dist/driver.js.iife.js"></script>
    <script src="app.js"></script>
</body>
```

**2. 다단계 투어 스크립트 작성**

`app.js` 파일의 내용을 아래 코드로 교체합니다.

`steps` 배열에 각 단계를 객체 형태로 정의하는 것이 핵심입니다.

```javascript
// app.js

const driver = window.driver.js.driver;

document.getElementById('start-multi-step-tour').addEventListener('click', () => {
  const driverObj = driver({
    showProgress: true, // 진행률 표시
    steps: [
      // 1단계
      { 
        element: '#main-title', 
        popover: { 
          title: '페이지 제목', 
          description: '이곳에서 웹사이트의 제목을 확인할 수 있습니다.' 
        } 
      },
      // 2단계
      { 
        element: '#profile-link', 
        popover: { 
          title: '프로필 링크', 
          description: '여기를 클릭하여 사용자 프로필 페이지로 이동합니다.',
          side: "bottom", // 팝오버 위치를 아래로 지정
          align: 'start'  // 팝오버 정렬을 시작점으로 지정
        } 
      },
      // 3단계
      { 
        element: '#footer-text', 
        popover: { 
          title: '푸터 정보', 
          description: '웹사이트의 저작권 정보를 담고 있습니다.' 
        } 
      },
      // 마지막 단계
      {
        popover: {
          title: '투어 종료',
          description: '이제 모든 주요 기능을 둘러보셨습니다! '
        }
      }
    ]
  });

  driverObj.drive(); // 정의된 단계에 따라 투어를 시작합니다.
});
```

`index.html`을 새로고침하고 버튼을 클릭하면, 정의된 순서대로 페이지 제목, 프로필 링크, 푸터를 차례로 안내하는 완전한 투어가 실행됩니다.

### 4. 고급 제어 및 커스터마이징: 나만의 투어 만들기

Driver.js는 기본 스타일도 훌륭하지만, 웹사이트의 브랜딩에 맞게 디자인을 수정할 수 있습니다.

**팝오버 위치 제어**
위 예제에서 `side`와 `align` 속성을 사용한 것을 보셨을 겁니다.
*   `side`: "left", "right", "top", "bottom" 중 하나를 선택하여 팝오버가 요소의 어느 쪽에 나타날지 결정합니다.
*   `align`: "start", "center", "end" 중 하나를 선택하여 `side` 내에서 팝오버의 정렬을 결정합니다.

**CSS로 스타일 변경하기**

Driver.js의 팝오버는 CSS 클래스를 가지고 있어 쉽게 스타일을 덮어쓸 수 있습니다.

예를 들어, 팝오버의 배경색과 버튼 색상을 바꾸고 싶다면 HTML 파일의 `<head>`에 `<style>` 태그를 추가하여 아래와 같이 작성할 수 있습니다.

```css
/* index.html의 head 태그 안에 추가 */
<style>
    /* 팝오버 배경색 변경 */
    .driver-popover {
        background-color: #3a3a3a;
        color: white;
    }
    /* 버튼 스타일 변경 */
    .driver-popover-navigation-btns button {
        background-color: #007bff;
        color: white;
        text-shadow: none;
    }
    .driver-popover-navigation-btns button:hover {
        background-color: #0056b3;
    }
</style>
```

### 5. 이벤트 훅 활용하기: 동적인 로직 추가

투어의 특정 시점에 어떤 동작을 실행하고 싶을 때 **이벤트 훅(Event Hooks)**을 사용합니다.

예를 들어, 사용자가 특정 단계를 보았을 때 분석 데이터를 보내거나, 투어가 완료되었을 때 쿠키를 저장하여 다시 보지 않게 할 수 있습니다.

`driver`를 초기화할 때 훅 함수를 전달하면 됩니다.

```javascript
// app.js의 driver 초기화 부분 수정

const driverObj = driver({
  // ... steps 배열은 그대로 ...
  
  // 이벤트 훅 추가
  onHighlightStarted: (element) => {
    // 요소가 하이라이트되기 시작할 때마다 호출
    console.log(element.id, '단계가 시작되었습니다.');
  },
  onDeselected: (element) => {
    // 요소의 하이라이트가 해제될 때마다 호출
    console.log(element.id, '단계가 종료되었습니다.');
  },
  onDestroyed: () => {
    // 투어가 완전히 종료(완료 또는 ESC로 닫기)될 때 호출
    alert('투어가 종료되었습니다. 이제 자유롭게 이용해보세요!');
  }
});

driverObj.drive();
```
이제 투어를 진행하면서 브라우저의 개발자 콘솔을 열어보세요.

각 단계가 시작되고 끝날 때마다 로그가 찍히고, 투어를 마치면 알림창이 뜨는 것을 확인할 수 있습니다.

### 6. 실전 예제: 종합적인 대시보드 온보딩 투어 만들기

지금까지 배운 모든 것을 종합하여, 사용자가 처음 로그인했을 때 보게 될 대시보드의 온보딩 투어를 만들어 보겠습니다.

```html
<!-- HTML은 3번 예제와 동일하게 사용합니다. -->
```

```javascript
// app.js 전체 코드

// 페이지 로드 시 자동으로 투어 시작
window.addEventListener('load', () => {
    // 한 번 본 사용자에게는 다시 보여주지 않기 위한 간단한 로직
    if (localStorage.getItem('tour_completed')) {
        return;
    }

    const driverObj = window.driver.js.driver({
        showProgress: true,
        allowClose: false, // 사용자가 ESC로 닫지 못하게 함
        steps: [
            { 
                element: '#main-title', 
                popover: { 
                    title: '대시보드에 오신 것을 환영합니다!', 
                    description: '몇 가지 주요 기능을 안내해 드릴게요.' 
                } 
            },
            { 
                element: '#profile-link', 
                popover: { 
                    title: '계정 관리', 
                    description: '이곳에서 프로필을 수정하거나 로그아웃할 수 있습니다.',
                    side: "bottom",
                    align: 'start'
                } 
            },
            { 
                element: '#start-multi-step-tour', // 버튼 재활용
                popover: { 
                    title: '도움이 필요하신가요?', 
                    description: '언제든지 이 버튼을 눌러 가이드를 다시 볼 수 있습니다.' 
                } 
            },
            {
                popover: {
                    title: '준비 완료!',
                    description: '이제 대시보드를 자유롭게 사용해 보세요!'
                }
            }
        ],
        // 투어가 성공적으로 완료되었을 때만 호출됨
        onDestroyStarted: () => {
            // 사용자가 투어를 닫으려고 할 때, 투어를 다시 시작하지 않도록 플래그를 설정
            if (!driverObj.hasNextStep() || driverObj.isLastStep()) {
                localStorage.setItem('tour_completed', 'true');
                alert('온보딩이 완료되었습니다!');
            }
        }
    });

    driverObj.drive();
});
```
이 코드는 페이지가 로드되자마자 투어를 시작하고, 투어가 완료되면 `localStorage`에 기록을 남겨 다음 방문 시에는 투어가 나타나지 않도록 합니다.

### 결론

Driver.js는 복잡할 수 있는 사용자 온보딩 과정을 매우 간단하고 효과적으로 만들어주는 훌륭한 도구입니다.

이 튜토리얼에서 다룬 내용만으로도 대부분의 온보딩 시나리오를 구현할 수 있습니다.

이제 여러분의 프로젝트에 Driver.js를 적용하여 사용자에게 최고의 첫인상을 선물해보세요.

더 자세한 옵션과 기능은 [공식 문서](https://driverjs.com/docs/installation)에서 확인하실 수 있습니다.
