---
slug: 2025-10-12-react-19-2-core-features-deep-dive
title: "React 19.2가 드디어 출시됐습니다. 답답했던 문제들 이제 안녕"
summary: "React 19.2의 핵심 기능 5가지를 소개합니다. Activity, useEffectEvent, 캐시 시그널 등 앱의 성능을 높이고 디버깅을 쉽게 만들어 줄 강력한 기능들을 자세히 살펴보세요."
date: 2025-10-12T09:26:21.580Z
draft: false
weight: 50
tags: ["React 19.2", "리액트 19.2", "Activity", "useEffectEvent", "cacheSignal", "partial pre-rendering", "리액트 신기능", "react", "React"]
contributors: []
---

![](https://blogger.googleusercontent.com/img/a/AVvXsEiRgm6VGJgNze4uRyUfTMHiyJWeOtQB799YfmXwrxbnxK9QgsjhdiAu2QYErcMQnmaEs6qjCGBqmxVUuDKDxSqJwuwzi-1qXOhF_2Nk58dvicVRHBOHHwrmZh1sHcEltYiD4UaxcjVyy9hRdKpOc-OzAQ8dZbT_PxI3V0ArSjrfcqF9Rl3WfnT3Un_iXZM=s16000)

드디어 리액트(React) 19.2 버전이 공개되었는데요.

솔직히 이번 업데이트는 지난 몇 년간 우리를 괴롭혔던 가장 성가신 문제들을 해결해 주는 업데이트입니다.

특별한 이유도 없이 'useEffect'가 계속해서 다시 실행되던 그런 버그, 다들 한 번쯤 경험해 보셨을 텐데요.

놀랍게도, 이제 그 문제들이 해결되었습니다.

이제 우리는 더 강력한 캐싱 기능과 리액트 19.2에서만 사용할 수 있는 강력한 기능들을 갖게 되었거든요.

게다가 이전에는 파악하기 정말 어려웠던 성능 디버깅 기능까지 개발자 도구에 추가되었습니다.

이번 글에서는 여러분의 앱을 더 빠르고, 깔끔하고, 디버깅하기 쉽게 만들어 줄 리액트 19.2의 새로운 기능 5가지를 자세히 살펴볼 건데요.

한번 보고 나면, 아마 '이 기능들 없이 어떻게 앱을 만들었지?' 하는 생각이 드실 겁니다.

## 첫 번째 새로운 기능 Activity

첫 번째로 소개해 드릴 기능은 바로 'Activity'인데요.

이 기능은 앱을 여러 '활동(Activity)' 단위로 나누어 제어하고 우선순위를 지정할 수 있게 해주는 기능입니다.

기존에 'isVisible' 같은 상태 값으로 UI의 일부를 조건부로 렌더링하던 방식의 대안으로 생각할 수 있거든요.

기존 방식의 문제는 'isVisible'이 false가 되면 DOM에서 해당 부분이 완전히 사라져 버린다는 점입니다.

그랬다가 다시 true가 되는 순간, 모든 작업을 처음부터 다시 해야 해서 성능에 부담을 줄 수 있었는데요.

하지만 'Activity'는 'visible'과 'hidden'이라는 두 가지 모드를 제공합니다.

'hidden' 모드는 자식 컴포넌트를 숨기고 마운트 이펙트를 지연시켜 모든 업데이트를 나중으로 미루거든요.

반면 'visible' 모드는 자식 컴포넌트를 즉시 보여주고 업데이트를 정상적으로 처리하는 방식입니다.

이 말은 즉, 화면에 보이지 않는 부분을 미리 렌더링해 두면서도 현재 보이는 화면의 성능에는 전혀 영향을 주지 않을 수 있다는 건데요.

예를 들어, 사용자가 곧 이동할 것으로 예상되는 페이지를 미리 'Activity'로 렌더링해두고 'hidden' 상태로 유지할 수 있습니다.

이 기능의 가장 좋은 예시는 바로 넷플릭스(Netflix)인데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjtqNTJzY5jpZlCMBbL_BL24jYMnmOG4xaRsJoyhama59zU4U1OOCvKKA0WRJMF1BpXEi2HbjIEBrfq7eoaZoNsOOcC1y2eh1fJf-2KZ4o-rh19kdrior5l5_DaqpfoBSdHGkIwOU6IkUDl3FfwcoL-Qah5Y6Ll_jqwmCF8SbBu4WCuWvYdbYPzYsdtfAA=s16000)

지금 TV 쇼의 한 에피소드를 거의 다 봤고, 곧 다음 에피소드로 넘어가야 하는 상황이라고 가정해 봅시다.

이럴 때 'Activity'를 사용해서 다음 에피소드 화면을 미리 렌더링해두고 'hidden' 상태로 유지하는 거거든요.

이렇게 하면 사용자가 '다음 에피소드 재생' 버튼을 누르는 순간, 기다릴 필요 없이 즉시 다음 화면이 나타나게 됩니다.

사용자 경험과 성능을 동시에 잡는 아주 똑똑한 방법이죠.

```ts
// Before
{isVisible && <Page />}

// After
<Activity mode={isVisible ? 'visible' : 'hidden'}>
  <Page />
</Activity>
```

예시 코드를 보면 더 명확하게 이해할 수 있는데요.

기존 방식에서는 토글 버튼을 누를 때마다 설정 패널 컴포넌트가 DOM에서 완전히 사라졌다가 다시 생겨났습니다.

하지만 'Activity'를 사용한 새로운 방식에서는 토글 버튼을 꺼도 설정 패널 컴포넌트가 DOM에 그대로 남아있는 것을 볼 수 있거든요.

다시 렌더링할 필요가 없으니 그만큼 성능 이점을 챙길 수 있는 것입니다.


## 두 번째 useEffectEvent

두 번째는 'useEffectEvent' 훅(hook)인데요.

이건 'useEffect'의 가장 성가신 문제 중 하나를 해결해 주는 기능입니다.

예를 들어, 채팅방에 연결하는 'useEffect'가 있다고 생각해 보세요.

그런데 이 로직에 채팅방 연결과는 전혀 상관없는 '테마(theme)' 같은 상태 값이 포함되어 있다고 가정해 봅시다.

기존 'useEffect'의 문제는 의존성 배열에 포함된 값 중 하나라도 변경되면, 이펙트 전체가 다시 실행된다는 점이었거든요.

즉, 단순히 `다크 모드/라이트 모드`를 바꾸기 위해 테마를 변경했을 뿐인데, 채팅방 연결이 끊어졌다가 다시 연결되는 어이없는 상황이 발생하는 것입니다.

대부분의 개발자들은 이런 문제를 해결하기 위해 린트 규칙을 비활성화하거나 의존성을 배열에서 제외하곤 했는데요.

하지만 이런 방법은 예상치 못한 버그를 만들어내는 원인이 되기도 했습니다.

'useEffectEvent'는 바로 이 문제를 해결하기 위해 등장한 건데요.

이벤트의 성격을 가지는 함수, 즉 반응성(reactive) 로직과 비반응성(non-reactive) 로직이 섞여 있을 때 비반응성 로직을 분리해주는 역할을 합니다.

```ts
function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared (Effect Events aren't dependencies)
  // ...
```

실제 예시를 보면, 'useEffectEvent'를 적용하기 전에는 테마를 토글할 때마다 'connected'라는 알림이 계속해서 뜨는 것을 볼 수 있는데요.

이것은 테마가 바뀔 때마다 채팅방 연결이 다시 이루어지고 있다는 뜻입니다.

하지만 토스트 알림을 보내는 로직을 'useEffectEvent'로 감싼 후에는 테마를 바꿔도 더 이상 불필요한 재연결이 발생하지 않거든요.

채팅방 연결은 그대로 유지하면서 테마 변경과 관련된 UI 업데이트만 처리할 수 있게 된 것입니다.

물론 모든 것을 'useEffectEvent'로 감쌀 필요는 없는데요.

오히려 버그를 유발할 수도 있으니, 의존성 린터 규칙을 비활성화하고 싶다는 유혹이 들 때 사용하는 것이 가장 좋은 판단 기준입니다.

## 세 번째 캐시 시그널(cacheSignal)

세 번째는 '캐시 시그널(cacheSignal)'이라는 기능인데요.

이 기능은 오직 리액트 서버 컴포넌트(React Server Components)에서만 사용됩니다.

넷플릭스에서 특정 쇼를 보려고 클릭했다가, 마음이 바뀌어 바로 다른 쇼를 클릭하는 상황을 상상해 보세요.

기존에는 이미 첫 번째 쇼의 데이터를 가져오기 시작했기 때문에, 불필요한 요청이 서버에서 계속 처리되는 낭비가 있었습니다.

바로 이럴 때 'cacheSignal'이 활약하거든요.

'cacheSignal'은 현재 서버 렌더링의 생명주기에 연결된 'abort signal'을 제공합니다.

리액트가 이전 렌더링을 포기하면, 이 신호를 통해 진행 중이던 fetch 요청을 자동으로 중단시키는 건데요.

결과적으로 불필요한 대역폭과 서버 자원 낭비를 막을 수 있는 아주 효율적인 기능입니다.

## 네 번째 퍼포먼스 트랙(Performance Tracks)

네 번째는 개발자 도구의 '퍼포먼스 트랙(Performance Tracks)' 기능인데요.

크롬(Chrome) 개발자 도구의 성능 탭에 리액트 애플리케이션의 성능에 대한 새로운 맞춤형 트랙이 추가되었습니다.

![](https://react.dev/images/blog/react-labs-april-2025/perf_tracks.png)

이 다이어그램에서 볼 수 있듯이, 이제 어떤 컴포넌트가 렌더링을 막고 있는지, 트랜지션(transition)에 시간이 얼마나 걸리는지 등을 시각적으로 확인할 수 있거든요.

이를 통해 병목 현상이 발생하는 지점을 정확히 찾아내고 신속하게 해결할 수 있게 되었습니다.

## 다섯 번째 부분 사전 렌더링(Partial Pre-rendering)

마지막으로 소개할 기능은 '부분 사전 렌더링(Partial Pre-rendering)'인데요.

사실 이 기능은 넥스트(Next.js)에 오랫동안 있었던 기능이라 개인적으로 정말 반가운 소식입니다.

이 기능은 앱의 정적인 부분을 미리 렌더링해서 CDN을 통해 제공하고, 나중에 동적인 콘텐츠를 채워 넣는 방식이거든요.

리액트 19.2에 이 기능이 내장되었다는 사실 자체가 정말 멋진 일입니다.

물론 넥스트에서는 'Suspense' 경계만 설정해 주면 자동으로 처리되는 것에 비해 조금 더 복잡한 설정이 필요하긴 한데요.

그래도 리액트 자체적으로 이 기능을 지원하게 되었다는 점이 매우 중요합니다.

## 그 외 주목할 만한 변경 사항들

이 외에도 서스펜스(Suspense) 경계 관련 버그 수정, 노드(Node)의 웹 스트림(Web Stream) 지원, 새로운 ESLint 플러그인 등 개발 경험을 향상시키는 여러 가지 개선이 있었는데요.

전반적으로 이번 리액트 19.2 릴리스는 정말 멋진 업데이트입니다.

리액트를 전반적으로 더 나은 도구로 만들어 줄 흥미로운 훅과 변화들이 많이 포함되어 있거든요.

앞으로의 개발에 분명 큰 도움이 될 것입니다.
