---
slug: 2025-12-07-base-ui-react-component-library-v1-rc-review
title: "Base UI v1 RC 출시, 이제 Shadcn UI 대신 이걸 써야 할 때?"
summary: "MUI와 Radix UI 제작진이 만든 새로운 Headless UI 라이브러리, Base UI의 v1 Release Candidate가 공개되었습니다. Shadcn UI가 사용하는 Radix UI의 유지 보수 문제와 Base UI의 장점을 비교 분석하고, 설치 및 사용법까지 알아봅니다."
date: 2025-12-07T11:51:50.992Z
draft: false
weight: 50
tags: ["Base UI", "React", "UI 라이브러리", "Headless UI", "Shadcn UI", "Radix UI", "MUI", "프론트엔드 개발"]
contributors: []
---

![Base UI v1 RC 출시](https://blogger.googleusercontent.com/img/a/AVvXsEih6XfrZMlr4O4pYEC9BuwhlkOtIr1lN-OpiDGfv61P73uYbwJTO9cMz5J2qCRrHhIsZ_Shfs_RGD1djNDxYJDe0SdY_SYrKTnJab2xOo3yt-5ZiEjgHRTzewfApg1NKNn6o1ComszC36G9HCBCLB_Hayz17WwRvloalhB0cmjsKdtv6fuhkmgyLn9xdx8=s16000)

여러분, 드디어 세계 최고의 UI 라이브러리가 버전 1의 첫 번째 릴리즈 후보(RC)를 내놓았습니다.

여기서 제가 말하는 '최고의 UI 라이브러리'가 뭐냐고요?

혹시 Shadcn UI(이하 Shadcn)라고 생각하셨나요?

아니요, Shadcn은 엄밀히 말해 UI 라이브러리가 아닙니다.

제가 이야기하려는 건 바로 [Base UI](https://github.com/mui/base-ui)인데요.

[Base UI Documentation](https://base-ui.com/react/overview/quick-start)

이게 바로 프론트엔드 개발의 미래거든요.

Base UI는 그 유명한 Material UI(MUI)와 Radix UI, 그리고 Floating UI를 만든 실력자들이 모여 개발한 '스타일 없는(Unstyled)' 리액트 컴포넌트 라이브러리입니다.

접근성 높은 사용자 인터페이스를 구축하기 위해 만들어졌죠.

이들의 목표는 명확합니다. 접근성, 성능, 개발자 경험(DX)에 집중하여, 지속 가능한 오픈 소스 UI 컴포넌트 세트를 제공하는 것입니다.

개발자들에게 즐거운 경험을 선사하면서 말이죠.

자, 이제 왜 Base UI가 중요한지, 'Headless'가 무슨 의미인지, 그리고 Shadcn이 이 흐름에서 어떤 역할을 할 수 있는지 하나하나 파헤쳐 보겠습니다.

이 라이브러리는 진짜 'UI 라이브러리'라고 부를 수 있습니다.

Headless(스타일이 없음), 접근성 준수, 조합 가능성(Composable)이라는 특징을 모두 갖췄거든요.

게다가 경험 풍부한 최고의 팀이 개발하고 있고, 브라우저 지원도 훌륭합니다.

그런데 왜 아직 Base UI를 쓰는 사람이 별로 없을까요?

이유는 바로 Shadcn 때문입니다.

Shadcn은 내부적으로 Radix UI를 사용하고 있는데요.

Radix 역시 훌륭한 UI 라이브러리입니다.

반면 Shadcn은 UI 라이브러리들을 가져다가 스타일 시스템을 입혀주는 역할에 가깝습니다.

Shadcn의 캘린더 컴포넌트를 보면 `React Day Picker`를 쓰고 있고, 차트 컴포넌트는 `Recharts`를 기반으로 하죠.

하지만 다이얼로그(Dialog) 같은 핵심 컴포넌트들은 대부분 Radix UI를 사용하고 있습니다.

그런데 여기서 Radix UI의 치명적인 문제가 드러납니다.

바로 유지 보수가 거의 멈췄다는 점입니다.

완전히 죽은 건 아니지만, 관리가 매우 부실해졌습니다.

그래서 많은 개발자들이 Radix에서 Base UI로 갈아타는 추세입니다.

![Radix UI의 기여도 그래프 이미지](https://blogger.googleusercontent.com/img/a/AVvXsEgSDTIB5_ofW3aLnOIJxMTmqP-ShFRqXoGMeJeWG3XAACit2Yzn7vECc3hznfj8T3wEiQwjmKyxMwViyL11PG-hHUtA-AV4Ym3Jpw2yP0rBcxNFuDRM3k3Y6-Qbmu8Co0BCxQ22x5T2Ligx8RyNGXFd_VpqvnG4e6mTXg3tGa5MFQvW2sQyMBAOAiEuf5c=s16000)
[Github radix-ui 기여도 그래프 링크 바로가기](https://github.com/radix-ui/primitives/graphs/contributors)

실제로 기여도(Contributors) 패널을 보면 확연히 드러납니다.

Radix UI는 최근 몇 달간, 특히 7월에서 10월 사이에 활동이 거의 없었습니다.

핵심 개발자인 Benoid Grillard 같은 분들도 더 이상 커밋을 하지 않고 있죠.

개발이 멈춘 것이나 다름없습니다.

반면 Base UI의 그래프를 보세요.

![Base UI의 기여도 그래프 이미지](https://blogger.googleusercontent.com/img/a/AVvXsEhlSbMnS5zzQ1UMwY1Q5R4-k5On-_f88MXZNp0eFGKGFKiw82LJEmbORCkf8CxycpPAyEydv6Q5uAgIT2ovQkf0wtCbMrneEWN2OlbWw0WhqE5IavbcwPmHEDUISthQnWFcnHBMNP5bNZ0hTmblyNUpIp30FUXE4gdZ5rLrY2nVdDKdWn6ei_LXxz9DzFk=s16000)

[Github Base UI 기여도 그래프 링크 바로가기](https://github.com/mui/base-ui/graphs/contributors)

아주 활발하게 개발이 진행되고 있습니다.

그럼 Shadcn은 왜 여전히 Radix UI를 쓰고 있을까요?

답은 간단합니다.

Base UI가 오랫동안 베타(Beta) 상태였기 때문입니다.

베타 버전은 API가 자주 바뀔 수 있어 실무에 쓰기엔 위험 부담이 크거든요.

하지만 이제 상황이 바뀌었습니다.

Base UI가 공식적으로 V1 Release Candidate를 발표했기 때문이죠!

이제 기존에 디자인 시스템이나 스타일 시스템을 갖추고 있어서 굳이 Shadcn을 쓸 필요가 없는 분들에게 희소식입니다.

Base UI를 도입해도 됩니다.

더 이상 큰 변화는 없을 것이고, 안정화 버전(Stable) 출시도 코앞이니까요.

서론은 이쯤 하고, Base UI의 새로운 점과 설치 방법을 알아보겠습니다.

### Base UI 설치 및 설정

설치는 아주 간단합니다. 다음 명령어를 입력하세요.

```bash
npm install @base-ui-components/react
```

현재 버전을 확인하고 설치가 완료되면, 다음 단계가 꽤 흥미로운데요.

바로 포탈(Portal) 설정입니다.

Radix UI나 Shadcn에서는 포탈이 내부적으로 알아서 작동하지만, 가끔 버그가 생기기도 하죠.

Base UI에서는 이를 직접 정의해야 합니다.

애플리케이션 전체를 `root`라는 클래스 이름을 가진 `div`로 감싸주어야 합니다.

여기서 중요한 건 이 루트 요소에 설정해야 하는 CSS 속성입니다.

바로 `isolation: isolate;`입니다.

이 속성은 새로운 쌓임 맥락(Stacking Context)을 생성하여, 팝업 같은 요소가 항상 페이지 콘텐츠 위에 나타나도록 보장해 줍니다.

`layout.tsx` 파일을 열어봅시다.

`body` 태그 안에 새로운 `div`를 만들고 `children`을 감싸준 뒤, 클래스 이름을 부여하면 됩니다.

Tailwind CSS를 쓴다면 `isolate` 클래스를 추가하면 끝입니다.

```tsx
// layout.tsx 예시
<body>
  <div className="isolate">
    {children}
  </div>
</body>
```

그리고 Base UI가 얼마나 적극적으로 관리되고 있는지 보여주는 또 다른 증거가 있습니다.

바로 iOS 16 및 Safari 관련 버그 수정에 대한 내용인데요.

트위터(X)의 Devon Govett이 공유한 내용을 보면, 모바일 사파리에서 하단 바 때문에 다이얼로그 표시에 시각적인 랙이나 버그가 생기는 현상이 있었습니다.

![트위터(X)의 Devon Govett이 공유한 내용](https://blogger.googleusercontent.com/img/a/AVvXsEhoRbZLC9ip5z6vs-qtxu0etGhOjqFpttNT3Jg3ymIf3hJCAPQXpZZJU8PLTFchq7wWHxSGsMzlLmT_lXADlA-MDW_qE6Jd043Ug6jMJ-KuEMMh89UI_liK_FfsvQRMKSYVAZnGT_QlebpV3Y6nCSgVp5LOKFDQDVU9Lz2GnMsbCVuIa5BmX6ceMYVym8A=s16000)

이를 해결하기 위해 `body`에 `position: relative;`를 주라는 팁이 있는데, 사실 트리 구조 상위에 `relative`를 주는 건 부작용이 있을 수 있어 조심스럽긴 합니다.

하지만 만약 여러분이 이 문제를 겪고 있다면 시도해 볼 만한 좋은 해결책이 될 수 있습니다.

### 컴포넌트 사용하기

설정을 마쳤으면 이제 원하는 컴포넌트를 골라 쓰면 됩니다.

예를 들어 `ComboBox`를 써볼까요?

Base UI는 CSS 모듈을 쓸지, Tailwind CSS를 쓸지 선택할 수 있습니다.

Shadcn처럼 코드를 복사해서 여러분의 프로젝트에 붙여넣기만 하면 바로 작동하는 방식도 지원합니다.

Base UI의 장점은 엄청나게 상세한 문서입니다.

컴포넌트의 모든 사용 사례, 함수, 설정 옵션에 대한 정보가 가득합니다. 처음 보면 좀 압도될 수도 있지만, 깊이 파고들고 싶을 땐 정말 유용하죠.

Base UI에는 수많은 컴포넌트가 있는데, 대부분은 익숙한 것들일 겁니다.

하지만 그중에서도 제가 특히 좋아하는 컴포넌트가 하나 있습니다.

바로 Autocomplete(자동완성)입니다.

Radix UI에는 이 기능이 없고, 따라서 Shadcn에도 보통 없습니다.

Base UI의 Autocomplete는 구현이 정말 깔끔해서 많은 앱에서 유용하게 쓰일 것 같습니다.

![Base UI Autocomplete 컴포넌트 예시 이미지](https://blogger.googleusercontent.com/img/a/AVvXsEh3GQ70XPCICzCTCs19ipN-mJDq39Cs9W0BIgpR70RBIKgCtEJdb9x8oHqrfr_X9_Zd486HfWqpDkBwvocXVWPOfTZzwtNirzQCKWPYJFSmvriz0y-SSL6p_OXcq_6-5h80WA6MRr3FvhHxZtnUDLPnHouGv46agYqRFS9hJhn1Tz5BZQFVHUYSV3EI96U=s16000)

그런데 막상 Base UI 컴포넌트를 Shadcn과 비교해 보면, "어? 버튼이 Shadcn만큼 예쁘지 않은데?"라는 생각이 들 수 있습니다.

맞습니다.

그게 정상입니다.

Shadcn은 기본적으로 스타일을 입혀서 제공하지만, Base UI는 진짜 'UI 라이브러리'의 본질인 'Headless'를 따릅니다.

즉, '모자(Hat)'가 없습니다.

여기서 모자는 '스타일'을 의미하죠.

Base UI는 스타일 없이 기능만 제공하므로, 스타일은 여러분이 직접 정의해야 합니다.

컴포넌트에 직접 스타일을 입혀서 여러분만의 멋진 디자인 시스템을 구축할 수 있는 것이죠.

제 생각엔 머지않아 Shadcn도 내부적으로 Base UI를 채택하게 될 것 같습니다.

물론 시간이 좀 걸리겠지만요.

Base UI 문서를 보면 애니메이션 가이드, 컴포넌트 조합 원칙, 커스터마이징 방법, 다양한 스타일링 솔루션 등 유용한 정보가 정말 많습니다.

뛰어난 경력을 가진 사람들이 적극적으로 유지 보수하고 있는 만큼, Base UI는 리액트 UI 라이브러리의 미래가 될 것이라 확신합니다.

Shadcn이 왜 엄밀히 말해 UI 라이브러리가 아닌지 더 궁금하시다면 관련 영상을 찾아보시는 것도 추천드립니다.
