---
slug: 2025-07-12-from-valtio-to-valtio-reactive-guide
title: Valtio 입문부터 valtio-reactive로 반응형 프로그래밍까지
date: 2025-07-12 10:03:47.663000+00:00
summary: React의 상태 관리를 단순화하는 Valtio의 기본 사용법을 알아보고, 한 걸음 더 나아가 valtio-reactive 라이브러리를 통해 진정한 반응형 프로그래밍을 구현하는 방법을 살펴봅니다.
tags: ["Valtio", "valtio-reactive", "React 상태 관리", "프록시 상태", "반응형 프로그래밍", "자바스크립트", "javascript", "react"]
contributors: []
draft: false
---

안녕하세요, 더 나은 개발 패러다임을 탐구하는 블로거입니다.

React 애플리케이션의 상태 관리는 언제나 개발자들의 큰 고민거리 중 하나입니다.

Redux의 보일러플레이트, Context API의 성능 문제 등 각 솔루션은 나름의 장단점을 가지고 있죠.

오늘 소개할 'Valtio'는 이러한 고민에 대한 아주 단순하면서도 강력한 해답을 제시합니다.

그리고 한 걸음 더 나아가, 'valtio-reactive'라는 라이브러리를 통해 Valtio를 진정한 반응형 프로그래밍 도구로 확장하는 방법까지 함께 알아보겠습니다.

## 1부: 먼저, Valtio란 무엇일까요?

Valtio는 자바스크립트의 'Proxy' 객체를 기반으로 동작하는 상태 관리 라이브러리입니다.

가장 큰 특징은 '마법 같은 단순함'입니다.

복잡한 리듀서나 디스패치 없이, 그냥 자바스크립트 객체를 수정하는 것만으로도 React 컴포넌트가 자동으로 리렌더링됩니다.

어떻게 그게 가능할까요?

코드를 통해 직접 확인해 보는 것이 가장 빠릅니다.

### Valtio의 기본 사용법 (React)

먼저 Valtio를 설치해야 합니다.

```bash
npm install valtio
```

이제 간단한 카운터 애플리케이션을 만들어 보겠습니다.

먼저, 상태를 보관할 '스토어(store)' 파일을 만듭니다.

```javascript
// store.js
import { proxy } from 'valtio';

// proxy()로 감싸주기만 하면, 이 객체는 이제 마법의 '프록시 상태'가 됩니다.
export const state = proxy({ count: 0 });
```

이게 전부입니다.

이제 이 `state` 객체를 React 컴포넌트에서 사용해 보겠습니다.

```javascript
// Counter.js
import { useSnapshot } from 'valtio';
import { state } from './store';

function Counter() {
  // useSnapshot을 통해 상태의 '스냅샷'을 읽어옵니다.
  // 이 스냅샷은 불변(immutable)하므로, React가 변화를 감지하고 리렌더링할 수 있습니다.
  const snap = useSnapshot(state);

  const increment = () => {
    // 상태를 변경할 땐, 그냥 객체의 속성을 직접 수정하면 됩니다!
    state.count++;
  };

  return (
    <div>
      <p>Count: {snap.count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}
```

'setState'도, 'useReducer'도 없습니다.

단지 `state.count++`라는 지극히 평범한 자바스크립트 코드로 상태를 변경했을 뿐인데, `Counter` 컴포넌트는 마법처럼 리렌더링되어 최신 `count` 값을 화면에 보여줍니다.

이것이 바로 Valtio의 핵심 매력입니다.

### Valtio는 React 바깥에서도 동작합니다

Valtio의 주된 목적은 React의 전역 상태 관리지만, 일반 자바스크립트 환경에서도 매우 유용하게 사용할 수 있습니다.

예를 들어, 프록시 상태의 변화를 구독(subscribe)할 수 있습니다.

```javascript
import { proxy, subscribe } from 'valtio/vanilla';

const state = proxy({ count: 0 });

subscribe(state, () => {
  // state 객체에 어떤 변화라도 생기면 이 콜백 함수가 실행됩니다.
  console.log('Count가 변경되었습니다:', state.count);
});

state.count++; // → 콘솔에 "Count가 변경되었습니다: 1"이 출력됩니다.
```

또한, 특정 시점의 상태를 '스냅샷'으로 저장하여 변경 이력을 추적하는 용도로도 사용할 수 있습니다.

```javascript
import { proxy, snapshot } from 'valtio/vanilla';

const state = proxy({ count: 0 });
const snap1 = snapshot(state); // 첫 번째 스냅샷

state.count++;

const snap2 = snapshot(state); // 두 번째 스냅샷

console.log(snap1, snap2); // → { count: 0 } { count: 1 }
```

## 2부: 기존 Valtio의 '아쉬운 점'

여기까지 보면 Valtio는 거의 완벽해 보입니다.

하지만 Svelte나 Vue 같은 다른 '반응형 프레임워크'와 비교했을 때, Valtio에는 아쉬운 두 가지 패턴이 있었습니다.

바로 '사용량 추적 기반 이펙트'와 '사용량 추적 기반 파생값'입니다.

### 1. 사용량 추적 기반 '이펙트(Effect)'

위에서 본 `subscribe` 함수는 `state` 객체 전체를 구독합니다.

즉, `state` 객체 안의 어떤 속성이 변경되더라도 콜백 함수가 실행됩니다.

하지만 진정한 반응형 시스템이라면, 콜백 함수 안에서 '사용한' 속성이 변경될 때만 콜백이 실행되는 것이 이상적입니다.

이것을 '사용량 추적(usage tracking)'이라고 합니다.

```javascript
// 기존 Valtio 방식
const state = proxy({ count: 0, text: 'hello' });
subscribe(state, () => {
  console.log('Count가 변경되었습니다:', state.count);
});

state.text = 'world'; // 이래도 위 콜백이 실행됩니다. (의도와 다름)
```

반면, 이상적인 반응형 '이펙트'는 다음과 같이 동작해야 합니다.

```javascript
// 이상적인 반응형 '이펙트'
const state = proxy({ count: 0, text: 'hello' });
effect(() => {
  // 이 함수는 내부에서 'state.count'만 사용했음을 자동으로 추적합니다.
  console.log('Count가 변경되었습니다:', state.count);
});

state.count++; // → "Count가 변경되었습니다: 1" (예상대로 동작)
state.text = 'world'; // → 아무 일도 일어나지 않습니다. (더 효율적!)
```

### 2. 사용량 추적 기반 '파생값(Computed)'

'파생값'이란 다른 상태 값에 의존하여 계산되는 새로운 상태 값을 의미합니다.

이 역시 사용량 추적이 가능하다면 매우 강력해집니다.

```javascript
const state = proxy({ count: 0 });

// 'computed'는 state.count를 사용하여 double이라는 파생값을 만듭니다.
const derived = computed({
  double: () => state.count * 2,
});

console.log(derived.double); // → 0

state.count++; // 원본 상태를 변경하면,

console.log(derived.double); // → 2 (파생값이 자동으로 업데이트됩니다!)
```

여기서 한 가지 주의할 점이 있습니다.

'이펙트'와 '파생값'은 변화에 즉시 반응하기 때문에, 만약 여러 상태를 한 번에 업데이트하고 싶다면 명시적인 '배치(batch)' 작업이 필요합니다.

그렇지 않으면 매 업데이트마다 불필요한 재계산이 일어날 수 있습니다.

```javascript
// 배치 작업을 통해 여러 업데이트를 하나의 단위로 묶습니다.
batch(() => {
  state.count++;
  state.count++;
});
// 이펙트나 파생값은 이 batch 함수가 끝난 뒤 단 한 번만 실행됩니다.
```

## 3부: 해결책의 등장, `valtio-reactive`

바로 이러한 간극을 메우기 위해 'valtio-reactive'라는 라이브러리가 등장했습니다.

이 라이브러리는 기존 Valtio 위에 우리가 위에서 살펴본 `effect`, `computed`, `batch` 기능을 구현해 줍니다.

```bash
npm install valtio-reactive
```

이제 라이브러리에서 필요한 함수들을 가져와 사용하기만 하면 됩니다.

```javascript
import { effect, computed, batch } from 'valtio-reactive';
import { proxy } from 'valtio/vanilla';

// 이제 Valtio로 진정한 반응형 프로그래밍이 가능해졌습니다.
const state = proxy({ count: 0 });

const derived = computed({
  double: () => state.count * 2,
});

effect(() => {
  console.log(`double 값: ${derived.double}`);
});

batch(() => {
  state.count = 5;
  state.count = 10;
}); // → 콘솔에 "double 값: 20"이 단 한 번만 출력됩니다.
```

한마디로, 'valtio-reactive'는 Valtio를 진정한 의미의 반응형 라이브러리로 만들어주는 날개와도 같습니다.

## 결론

Valtio는 그 자체로도 React의 상태 관리를 매우 단순하고 직관적으로 만들어주는 훌륭한 도구입니다.

여기에 `valtio-reactive`를 더하면, 우리는 React의 경계를 넘어 더 일반적인 자바스크립트 환경에서도 강력한 반응형 프로그래밍 패러다임을 손쉽게 활용할 수 있게 됩니다.

혹시 새로운 상태 관리 솔루션이나 반응형 프로그래밍에 관심이 있다면, Valtio와 `valtio-reactive`의 조합을 한번 시도해 보시는 것은 어떨까요.

분명 즐거운 코딩 경험이 될 것입니다.
