---
slug: 2025-08-22-building-testable-telegram-bots-with-zustand-vanilla
title: Zustand, 리액트 없이도 이렇게 강력하다고? (테스트 가능한 텔레그램 봇 만들기)
date: 2025-08-23 10:55:06.120000+00:00
summary: Zustand의 바닐라 스토어를 활용해 React 없이도 완벽하게 테스트 가능한 텔레그램 봇을 만드는 방법을 소개합니다. 단방향 데이터 흐름과 반응형 상태 구독을 통해 복잡한 봇 로직을 우아하게 관리하는 비법을 확인하세요.
tags: ["Zustand", "텔레그램 봇", "상태 관리", "TypeScript", "테스트 주도 개발", "백엔드"]
contributors: []
draft: false
---

[원본 링크](https://zwit.link/posts/zustand-telegram-bot/)

여기 아주 좋은 해외 기술 아티클이 하나 있는데요, 이 글의 핵심만 전체적으로 살펴볼까 힙니다.<br /><br />대부분의 개발자들은 Zustand를 떠올리면 리액트 훅과 컴포넌트 상태를 연상하죠.<br /><br />하지만 만약 Zustand의 '바닐라 스토어'를 사용해서, 예측 가능하고 반응적인 정교한 텔레그램 봇을 만들 수 있다면 어떨까요?<br /><br />오늘은 Zustand가 프론트엔드를 넘어 백엔드, 특히 봇 개발에서 어떻게 빛을 발할 수 있는지, 한 개발자의 흥미로운 주말 프로젝트를 통해 그 가능성을 탐험해 보려고 합니다.<br /><br />

## 모든 것은 사소한 불만에서 시작되었다

이 프로젝트는 어느 날 발표자의 여자친구가 광고와 페이월로 가득 찬 QR 코드 생성 웹사이트에 대해 불평하면서 시작되었는데요.<br /><br />발표자는 웹 앱 대신, 팀 전체가 사용하기 쉬운 '텔레그램 봇'을 만들어주기로 결심합니다.<br /><br />UI에 신경 쓸 필요가 없으니 개발도 더 빠를 거라고 생각했죠.<br /><br />하지만 봇 개발은 생각보다 금방 복잡해지기 시작했는데요.<br /><br />여러 단계로 이루어진 대화 흐름, 비동기 작업(QR 코드 생성), 요청 상태 추적, 사용자별 설정 등 관리해야 할 상태가 기하급수적으로 늘어났습니다.<br /><br />가장 큰 고민은 '어떻게 이 봇을 유닛 테스트할 것인가'였죠.<br /><br />전통적인 봇 코드는 네트워크 호출과 파일 I/O 같은 사이드 이펙트가 뒤죽박죽 섞여 있어 테스트하기가 정말 까다롭거든요.<br /><br />그때, 발표자는 한 가지 아이디어를 떠올립니다.<br /><br />"리액트 앱에서 비즈니스 로직을 순수 함수로 캡슐화하기 위해 Zustand를 사용했던 것처럼, 봇에도 똑같은 패턴을 적용해볼 수 있지 않을까?"<br /><br />Zustand의 바닐라 `createStore` API를 사용하면, 모든 비즈니스 로직을 순수 함수로 유지하고, 지저분한 I/O 작업들은 분리해서 반응적으로 처리할 수 있을 것 같았죠.<br /><br />

## 리액트의 세계를 벗어난 Zustand

Zustand의 `createStore` 함수는 리액트 없이도 완벽하게 동작하는데요.<br /><br />훅도, 컴포넌트도 없이, 오직 순수한 상태 관리 기능만 제공합니다.<br />

```typescript
import { createStore } from 'zustand/vanilla';
import { produce } from 'immer';

export const store = createStore<State & Actions>((set, get) => ({
  // 초기 상태
  chats: [],
  requests: [],
  
  // 상태를 변경하는 순수 함수들 (액션)
  newRequest: ({ id, chatId, text, format }) => set(
    produce((state) => {
      state.requests.push({
        id, chatId, text, format,
        state: RequestState.New,
        response: null
      });
    })
  ),
  
  processRequest: (id) => set(
    produce((state) => {
      const req = state.requests.find(r => r.id === id);
      if (req) req.state = RequestState.Processing;
    })
  )
}));
```

여기서 `produce`는 Immer 라이브러리의 함수인데요.<br /><br />불변성을 유지하면서 상태를 쉽게 업데이트할 수 있게 도와주는 아주 유용한 도구입니다.<br /><br />

## 엘름 아키텍처(TEA)와의 만남

이 봇은 Redux의 원조 격인 '엘름 아키텍처(The Elm Architecture, TEA)'라고 불리는 단방향 데이터 흐름을 따르는데요.<br /><br />아주 단순하고 강력한 패턴입니다.
1.  사용자 메시지가 들어오면 (Action)
2.  상태를 업데이트하고 (Update/Reducer)
3.  변경된 상태에 따라 (Model/State)
4.  봇이 메시지를 보냅니다 (View)

실제 QR 코드 요청이 처리되는 흐름을 코드로 보면 이렇습니다.<br />

```typescript
// 1. 사용자가 메시지를 보낸다
bot.on('message', (msg) => {
  const { id, chat, text } = msg;
  
  // 2. 새로운 요청 액션을 디스패치해서 상태를 변경한다
  store.getState().newRequest({ id, chatId: chat.id, text, format });
  
  // 3. 처리 시작 액션을 디스패치해서 상태를 또 변경한다
  store.getState().processRequest(id);
  
  // 4. 비동기적으로 QR 코드를 생성하고, 결과에 따라 완료 또는 실패 액션을 디스패치한다
  store.getState().genQr({ text, format })
    .then(response => store.getState().completeRequest({ id, response }))
    .catch(error => store.getState().abortRequest({ id, error }));
});
```

모든 로직이 상태를 변경하는 '액션'을 호출하는 것으로 통일되어 있죠.<br /><br />사이드 이펙트를 직접 처리하는 대신, 상태 변경을 통해 시스템에 어떤 일이 일어나야 하는지를 '알리는' 방식입니다.<br /><br />

## 상태 변화에 반응하는 봇

그렇다면 봇은 어떻게 이 상태 변화를 알고 메시지를 보낼까요?<br /><br />바로 Zustand의 `subscribe` 기능을 사용하는 건데요.<br /><br />마치 게임 '포탈'의 터렛이 움직임을 감지하는 순간 반응하는 것처럼, 봇은 스토어의 상태 변화를 감지하고 즉시 반응합니다.<br />

```typescript
// 스토어의 모든 변화를 구독한다
store.subscribe((state) => {
  const currentRequests = state.requests;
  
  // 이전 상태와 비교해서 어떤 요청의 상태가 변했는지 찾는다
  currentRequests.forEach(currentRequest => {
    const previousRequest = previousRequests.find(r => r.id === currentRequest.id);
    
    if (previousRequest?.state !== currentRequest.state) {
      handleStateChange(currentRequest, previousRequest);
    }
  });
  
  previousRequests = currentRequests;
});
```

이 구독 콜백은 스토어의 상태가 바뀔 때마다 실행되는데요.<br /><br />여기서 이전 상태와 현재 상태를 비교해서, 특정 요청의 상태가 'New'에서 'Processing'으로, 또는 'Processing'에서 'Completed'로 바뀐 것을 감지할 수 있죠.<br /><br />그리고 상태 변화가 감지되면, `handleStateChange` 함수가 적절한 메시지를 사용자에게 보냅니다.<br />

```typescript
const handleStateChange = (request, previous) => {
  switch (request.state) {
    case RequestState.Processing:
      bot.sendMessage(request.chatId, "🔄 QR 코드를 생성 중입니다...");
      break;
      
    case RequestState.Completed:
      bot.sendPhoto(request.chatId, fs.createReadStream(request.response));
      break;
      
    case RequestState.Error:
      bot.sendMessage(request.chatId, "❌ 문제가 발생했습니다!");
      break;
  }
};
```

이처럼 '상태를 변경하는 로직'과 '상태 변화에 따른 사이드 이펙트를 처리하는 로직'이 완벽하게 분리되어 있습니다.<br /><br />이것이 바로 이 아키텍처의 핵심이죠.<br /><br />

## 이 아키텍처를 선택한 진짜 이유 '테스트'

이 모든 설계의 가장 큰 목적은 바로 '테스트 용이성'인데요.<br /><br />Zustand의 액션 함수들은 오직 상태만 변경하는 순수 함수이기 때문에 테스트가 놀랍도록 간단해집니다.<br />

```typescript
describe('QR 요청 생명주기 테스트', () => {
  beforeEach(() => {
    // 매 테스트 전에 스토어를 초기 상태로 리셋
    store.setState(store.getInitialState());
  });

  it('요청 생명주기가 올바르게 처리되어야 한다', () => {
    // newRequest 액션을 실행하고
    store.getState().newRequest({ id: 1, chatId: 123, text: 'test' });
    // 상태가 올바르게 바뀌었는지 검증한다
    expect(store.getState().requests[0].state).toBe(RequestState.New);
    
    // processRequest 액션을 실행하고
    store.getState().processRequest(1);
    // 상태가 올바르게 바뀌었는지 검증한다
    expect(store.getState().requests[0].state).toBe(RequestState.Processing);
    
    // completeRequest 액션을 실행하고...
    store.getState().completeRequest({ id: 1, response: '/path/to/qr.png' });
    expect(store.getState().requests[0].state).toBe(RequestState.Completed);
  });
});
```

텔레그램 봇 API도, 파일 시스템도, 네트워크 호출도 모킹할 필요가 전혀 없죠.<br /><br />우리는 오직 우리의 핵심 비즈니스 로직, 즉 '주어진 입력에 따라 상태가 올바르게 변하는가'만을 테스트하면 됩니다.<br /><br />사이드 이펙트가 없기 때문에 테스트는 아주 빠르고 결정론적으로 실행되죠.<br /><br />

## 마치며

이 프로젝트는 우리에게 아주 중요한 교훈을 주는데요.<br /><br />함수형 프로그래밍 패턴과 프론트엔드 라이브러리가 더 이상 프론트엔드의 전유물이 아니라는 점입니다.<br /><br />상태 관리, 반응형 프로그래밍, 단방향 데이터 흐름 같은 개념들은 복잡한 상태가 존재하는 곳이라면 어디에서든, 심지어 텔레그램 봇 같은 백엔드 환경에서도 강력한 힘을 발휘하죠.<br /><br />다음번에 브라우저 밖에서 상태가 복잡한 무언가를 만들게 된다면, 익숙한 프론트엔드 도구 상자를 한번 열어보는 건 어떨까요?<br /><br />Zustand처럼 작고 강력한 도구가 의외의 곳에서 당신의 가장 큰 무기가 되어줄지도 모릅니다.<br /><br />
