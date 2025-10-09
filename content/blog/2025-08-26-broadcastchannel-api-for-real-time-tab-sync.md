---
slug: 2025-08-26-broadcastchannel-api-for-real-time-tab-sync
title: stale 탭은 이제 그만! BroadcastChannel API로 실시간 탭 동기화 끝내기
date: 2025-08-27 14:01:51.256000+00:00
summary: 여러 탭을 열어놓고 작업할 때 데이터가 맞지 않아 답답했던 경험, 있으신가요? LocalStorage의 한계를 넘어, BroadcastChannel API를 활용해 로그인, 장바구니, 테마 등을 실시간으로 동기화하는 가장 우아한 방법을 소개합니다.
tags: ["BroadcastChannel", "탭 동기화", "자바스크립트 API", "프론트엔드", "LocalStorage", "React Hooks"]
contributors: []
draft: false
---

안녕하세요?

웹 서비스를 이용하다 보면 누구나 한 번쯤 겪어봤을 법한 '어색한 순간'이 있거든요.<br />

분명 한쪽 탭에서 로그아웃했는데, 다른 탭에서는 여전히 로그인 상태로 보인다거나, 쇼핑몰에서 상품을 장바구니에 담았는데 다른 탭의 장바구니 아이콘에는 아무런 변화가 없는 그런 상황 말입니다.<br />

이런 'stale'한 상태, 즉 오래된 데이터가 사용자 경험을 얼마나 해치는지 우리 개발자들은 잘 알고 있습니다.<br />

이 문제를 해결하기 위해 많은 분들이 `LocalStorage`와 `storage` 이벤트를 떠올리실 텐데요.<br />

물론 가능한 방법이지만, 생각보다 까다로운 예외 처리와 번거로움이 따르는 게 사실입니다.<br />

오늘은 `LocalStorage`의 대안으로, 훨씬 더 우아하고 직관적으로 여러 탭의 상태를 동기화할 수 있는 강력한 Web API를 소개해 드리려고 하는데요.<br />

바로 `BroadcastChannel` API입니다.<br />

[MDN - Broadcast Channel API](https://developer.mozilla.org/ko/docs/Web/API/Broadcast_Channel_API)

## BroadcastChannel API, 그게 대체 뭔가요?

`BroadcastChannel` API는 이름 그대로 '방송 채널'을 만들어주는 Web 표준 API인데요.<br />

동일한 출처(origin)를 가진 여러 브라우저 컨텍스트, 즉 여러 탭이나 창, iframe, 심지어 Worker 사이에서 메시지를 주고받을 수 있는 통신 시스템입니다.<br />

동일한 이름의 채널을 구독하고 있는 모든 곳에 메시지를 '방송'하는, 아주 간단한 발행/구독(Pub/Sub) 모델이라고 생각하시면 됩니다.<br />

작동 방식은 정말 간단한데요.<br />

```html
<script type="module">
  // 'app-channel'이라는 이름으로 채널을 생성합니다.
  const appChannel = new BroadcastChannel('app-channel');

  // 1. 메시지 수신 (구독)
  appChannel.onmessage = (event) => {
    // 다른 탭에서 보낸 메시지가 event.data에 담겨 들어옵니다.
    console.log('메시지 수신:', event.data);
  };

  // 2. 메시지 전송 (발행)
  document.querySelector('#send-button').addEventListener('click', () => {
    appChannel.postMessage({ type: 'GREETING', payload: '안녕하세요!' });
  });

  // 3. 채널 정리 (리소스 해제)
  // 페이지가 닫히기 전에 채널 연결을 끊어주는 것이 좋습니다.
  window.addEventListener('beforeunload', () => appChannel.close());
</script>

<button id="send-button">다른 탭으로 메시지 보내기</button>
```

이 코드를 두 개의 탭에서 열어두고 한쪽에서 버튼을 누르면, 다른 쪽 탭의 콘솔에 메시지가 찍히는 걸 바로 확인할 수 있습니다.<br />

정말 직관적이죠?<br />

## LocalStorage로는 안 되나요?

"잠깐만요, 그거 `LocalStorage`로도 되잖아요?" 라고 생각하시는 분들이 분명 계실 텐데요.<br />

네, 맞습니다.<br />

하지만 `BroadcastChannel`이 `LocalStorage`에 비해 훨씬 더 우아하고 적합한 이유가 있습니다.<br />

한번 비교해 볼까요?<br />

| 구분 | BroadcastChannel API | LocalStorage + `storage` 이벤트 |
| --- | --- | --- |
| **통신 방식** | 이벤트 기반 (Pub/Sub) | 스토리지 변경 감지 |
| **동작 범위** | **메시지를 보낸 탭을 포함**한 모든 탭 | **메시지를 보낸 탭을 제외**한 다른 탭 |
| **데이터 처리** | 객체, 배열 등 구조화된 데이터 바로 전송 가능 | 문자열만 가능 (JSON 직렬화/역직렬화 필요) |
| **영속성** | 없음 (실시간 메시지 전달용) | 있음 (브라우저에 데이터 저장) |
| **구현 복잡도** | 매우 낮음 | 상대적으로 높음 (예외 처리 필요) |
<br />
가장 큰 차이점은 `storage` 이벤트는 정작 값을 변경한 자기 자신 탭에서는 발생하지 않는다는 점인데요.<br />

그래서 로그아웃 같은 기능을 구현할 때 '다른 탭'과 '현재 탭'의 로직을 따로 처리해 줘야 하는 번거로움이 있습니다.<br />

또한, `LocalStorage`는 문자열만 저장할 수 있어서 객체를 보내려면 `JSON.stringify()`와 `JSON.parse()` 과정이 필수적이죠.<br />

반면 `BroadcastChannel`은 이런 번거로움 없이, 필요한 모든 탭에 일관된 이벤트를 즉시 전달하는 데 특화되어 있습니다.<br />

단순히 '상태가 변경되었음'을 알리는 용도로는 `BroadcastChannel`이 압도적으로 편리한 겁니다.<br />

## 실전! 어떤 경우에 사용하면 좋을까요?

`BroadcastChannel`의 진가는 다음과 같은 실용적인 유스케이스에서 드러나는데요.<br />

1.  **로그인/로그아웃 상태 실시간 동기화**<br />
    가장 대표적인 사용 사례입니다.<br />
    한 탭에서 로그아웃하면, `sendMessage({ type: 'LOGOUT' })` 메시지를 방송해서 다른 모든 탭들이 즉시 로그아웃 처리나 로그인 페이지로 리디렉션되도록 만들 수 있습니다.<br />

2.  **다크 모드/라이트 모드 테마 동기화**<br />
    사용자가 한 탭에서 테마를 변경했을 때, 다른 탭들도 즉시 동일한 테마로 바뀌는 경험은 서비스의 완성도를 높여주거든요.<br />
    이 역시 `BroadcastChannel`로 아주 간단하게 구현할 수 있습니다.<br />

3.  **장바구니 상태 업데이트**<br />
    한 탭에서 장바구니에 상품을 추가하거나 삭제했을 때, 다른 탭의 헤더에 있는 장바구니 아이콘의 카운트가 실시간으로 업데이트되도록 만들 수 있습니다.<br />
    사용자에게 일관된 쇼핑 경험을 제공하는 거죠.<br />

4.  **실시간 알림 동기화**<br />
    관리자 대시보드 같은 서비스에서, 한 탭에서 중요한 작업을 처리했을 때 다른 탭들에도 "작업이 완료되었습니다" 같은 토스트 알림을 동시에 띄워줄 수 있습니다.<br />

## React에서 더 스마트하게 사용하기 useBroadcastChannel 커스텀 훅

이 강력한 API를 React에서 더 편하게 사용하기 위해 커스텀 훅으로 만들어보면 재사용성이 훨씬 높아지는데요.<br />

원문의 코드를 기반으로 조금 더 명확한 타입과 설명을 곁들여 보겠습니다.<br />

```typescript
// src/hooks/useBroadcastChannel.ts
import { useCallback, useEffect, useRef, useState } from "react";

// 메시지 타입은 제네릭으로 받아 유연성을 높입니다.
export function useBroadcastChannel<T>(channelName: string) {
  // channel 인스턴스는 한 번만 생성하고 재사용하기 위해 ref에 저장합니다.
  const channelRef = useRef<BroadcastChannel | null>(null);
  const [message, setMessage] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // 브라우저 환경이 아니거나 API를 지원하지 않으면 에러 처리
    if (typeof window === "undefined" || !("BroadcastChannel" in window)) {
      setError(new Error("BroadcastChannel API is not supported in this browser."));
      return;
    }

    // 채널 인스턴스 생성
    const channel = new BroadcastChannel(channelName);
    channelRef.current = channel;

    const handleMessage = (event: MessageEvent<T>) => {
      setMessage(event.data);
    };

    // 메시지 리스너 등록
    channel.addEventListener("message", handleMessage);

    // 컴포넌트가 언마운트될 때 클린업 함수 실행
    return () => {
      channel.removeEventListener("message", handleMessage);
      channel.close();
      if (channelRef.current === channel) {
        channelRef.current = null;
      }
    };
  }, [channelName]);

  // postMessage를 쉽게 사용할 수 있도록 래핑한 함수
  const postMessage = useCallback((message: T) => {
    channelRef.current?.postMessage(message);
  }, []);

  return { message, postMessage, error };
}
```

이렇게 만든 훅을 사용해서 로그인/로그아웃 동기화 기능을 구현하는 예제입니다.<br />

```tsx
// src/components/AuthManager.tsx
import { useEffect } from "react";
import { useBroadcastChannel } from "../hooks/useBroadcastChannel";

// 채널에서 주고받을 이벤트 타입을 정의합니다.
type AuthEvent = { type: "LOGOUT" } | { type: "LOGIN_SUCCESS" };

const AUTH_CHANNEL = "my-app:auth";

// [1] 다른 탭의 인증 상태 변화를 감지하는 리스너 컴포넌트
function AuthListener() {
  const { message } = useBroadcastChannel<AuthEvent>(AUTH_CHANNEL);

  useEffect(() => {
    if (!message) return;

    if (message.type === "LOGOUT") {
      // 실제 로그아웃 로직 (예: 로컬 스토리지 토큰 삭제, 로그인 페이지로 리디렉션)
      console.log("다른 탭에서 로그아웃 신호를 감지했습니다. 로그아웃 처리합니다.");
      window.location.href = '/login';
    }
  }, [message]);

  // 이 컴포넌트는 UI를 렌더링하지 않습니다.
  return null;
}

// [2] 로그아웃을 실행하고 다른 탭에 알리는 버튼 컴포넌트
function LogoutButton() {
  const { postMessage } = useBroadcastChannel<AuthEvent>(AUTH_CHANNEL);

  const handleLogout = () => {
    // 현재 탭에서 먼저 로그아웃 처리
    console.log("로그아웃 버튼 클릭. 현재 탭을 로그아웃 처리합니다.");
    // ... 실제 로그아웃 로직 ...
    
    // 다른 모든 탭에 로그아웃 이벤트 방송
    postMessage({ type: "LOGOUT" });
  };

  return <button onClick={handleLogout}>로그아웃</button>;
}

// [3] 앱 최상단에 AuthListener를 렌더링합니다.
export function App() {
  return (
    <>
      <AuthListener />
      {/* ... 앱의 나머지 부분 ... */}
      <header>
        <LogoutButton />
      </header>
    </>
  );
}
```

## 이것만은 꼭! 사용 전 주의사항

`BroadcastChannel`은 간단하고 강력하지만, 몇 가지 주의해야 할 점이 있는데요.<br />

이것들을 지키지 않으면 예상치 못한 버그의 원인이 될 수 있습니다.<br />

1.  **데이터는 복제되어 전달됩니다**<br />
    `postMessage`로 보내는 데이터는 '구조화된 복제(structured clone)' 알고리즘에 의해 복사되어 전달되거든요.<br />
    대부분의 객체나 배열은 문제없지만, 함수나 DOM 노드, 에러 객체 등은 보낼 수 없습니다.<br />

2.  **영속성이 없습니다**<br />
    채널은 메시지 히스토리를 저장하지 않습니다.<br />
    메시지를 보낸 시점에 '열려있는' 탭에만 전달되고, 나중에 새로 열린 탭은 이전 메시지를 받을 수 없습니다.<br />
    만약 나중에 열린 탭도 특정 상태를 알아야 한다면, `LocalStorage`와 함께 사용하는 전략이 필요합니다.<br />

3.  **보안에 유의하세요**<br />
    동일 출처의 모든 컨텍스트에 메시지가 전달되므로, 인증 토큰이나 비밀 정보 같은 민감한 데이터를 채널을 통해 직접 주고받는 것은 절대 피해야 합니다.<br />
    대신 'LOGOUT'처럼 상태 변경을 알리는 '이벤트'를 보내고, 각 탭이 알아서 토큰을 삭제하도록 구현하는 것이 안전합니다.<br />

4.  **채널 이름은 신중하게**<br />
    채널 이름이 충돌하지 않도록 `앱이름:도메인:기능`처럼 명확한 네이밍 규칙을 정하는 것이 좋습니다.<br />
    예를 들면 `my-app:auth`나 `my-app:theme`처럼 말이죠.<br />

## 결론 당신의 웹 경험을 한 단계 위로

`BroadcastChannel` API는 여러 탭을 넘나드는 현대적인 웹 환경에서 사용자에게 일관되고 쾌적한 경험을 제공하기 위한 아주 훌륭한 도구인데요.<br />

`LocalStorage`의 번거로움 없이 실시간 상태 동기화를 구현하고 싶을 때, 이 API는 당신의 코드를 훨씬 더 깔끔하고 직관적으로 만들어 줄 겁니다.<br />

물론 모든 상황에 맞는 만능 해결책은 아니지만, 그 용도를 정확히 이해하고 사용한다면 분명 당신의 개발 무기고에 강력한 무기 하나가 더 추가되는 셈이거든요.<br />

이제 'stale'한 탭과의 작별을 고하고, `BroadcastChannel`로 한 단계 더 높은 수준의 웹 경험을 만들어보는 건 어떨까요?<br />
