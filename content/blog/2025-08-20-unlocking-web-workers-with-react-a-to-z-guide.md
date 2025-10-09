---
slug: 2025-08-20-unlocking-web-workers-with-react-a-to-z-guide
title: 리액트 UI가 멈추나요? 웹 워커로 해결하는 A to Z 가이드
date: 2025-08-22 14:31:45.095000+00:00
summary: 리액트 앱에서 무거운 계산으로 UI가 멈추는 문제를 웹 워커, 공유 워커를 사용해 해결하는 방법을 단계별로 알아봅니다. 큐를 이용한 작업 순서 보장과 캐싱 전략까지 실용적인 예제와 함께 설명합니다.
tags: ["React", "웹 워커", "Web Workers", "Shared Worker", "성능 최적화", "자바스크립트"]
contributors: []
draft: false
---

[원본 링크](https://www.rahuljuliato.com/posts/react-workers)

여기 아주 좋은 블로그 글이 있는데요, 이 글의 핵심만 전체적으로 살펴볼까 힙니다.<br /><br />
리액트로 애플리케이션을 만들다 보면 가끔 무거운 계산 때문에 UI가 버벅이거나 아예 멈춰버리는 경험, 다들 한 번쯤은 있으실 텐데요.<br /><br />
자바스크립트의 싱글 스레드 특성 때문에 발생하는 고질적인 문제죠.<br /><br />
이걸 해결하기 위한 아주 강력한 무기가 바로 '웹 워커(Web Worker)'입니다.<br /><br />
오늘은 웹 워커를 사용해서 어떻게 우리의 리액트 앱을 항상 부드럽게 유지할 수 있는지, 아주 기초적인 문제 상황부터 시작해서 점점 더 견고한 해결책으로 발전시켜 나가는 과정을 단계별로 따라가 보겠습니다.<br /><br />

## 1단계 문제 UI가 얼어붙다

먼저 아주 흔한 문제 상황부터 시작해 보죠.<br /><br />
우리 앱에 피보나치 수를 계산하는 기능이 필요하다고 가정해 볼게요.<br /><br />
특히 42처럼 꽤 큰 숫자를 계산해야 하는 상황입니다.<br /><br />
가장 간단한 피보나치 함수는 재귀를 이용하는 건데요.<br /><br />

```typescript
// src/App.tsx
function fib(n: number): number {
  return n <= 1 ? n : fib(n - 1) + fib(n - 2);
}
```

이제 버튼을 클릭하면 이 함수를 호출해서 결과를 화면에 보여주도록 만들어 보겠습니다.<br /><br />

```typescript
// src/App.tsx
const handleClick = () => {
  setResults((results) => [
	...results,
	{ id: idRef.current++, result: fib(42) },
  ]);
};
```

자, 이 버튼을 누르면 어떻게 될까요?<br /><br />
결과는 뻔합니다.<br /><br />
UI가 완전히 얼어붙습니다.<br /><br />
다른 버튼은 눌리지 않고, 애니메이션은 멈추고, 사용자는 앱이 다운되었다고 생각하게 되죠.<br /><br />
이건 자바스크립트가 싱글 스레드라서 생기는 현상이거든요.<br /><br />
렌더링과 사용자 인터랙션을 처리하는 바로 그 '메인 스레드'가 `fib(42)` 계산이 끝날 때까지 멈춰버리는 겁니다.<br /><br />
그런데 여기서 재미있는 사실 하나가 있는데요.<br /><br />
화면에서 빙글빙글 돌아가는 로딩 아이콘 같은 CSS 애니메이션은 메인 스레드가 멈춰도 계속 움직인다는 점입니다.<br /><br />
CSS 애니메이션은 자바스크립트가 아닌 브라우저의 '컴포지터 스레드'에서 처리되기 때문에 메인 스레드와 독립적으로 작동하는 거죠.<br /><br />
정말 신기하지 않나요?<br /><br />

## 2단계 해결책 웹 워커의 등장

이제 이 'UI 멈춤' 문제를 해결하기 위해 웹 워커를 투입할 시간입니다.<br /><br />
웹 워커는 자바스크립트 코드를 별도의 백그라운드 스레드에서 실행시켜 주거든요.<br /><br />
덕분에 메인 스레드는 UI 업데이트와 사용자 상호작용에만 집중할 수 있게 되죠.<br /><br />
먼저, 워커 파일을 하나 만들어 보겠습니다.<br /><br />

```typescript
// src/workers/fibWorker.ts
self.onmessage = ({ data }) => {
  const result = fib(data.n);
  self.postMessage({ id: data.id, result });
};

function fib(n: number): number {
  return n <= 1 ? n : fib(n - 1) + fib(n - 2);
}
```

워커 코드는 아주 간단합니다.<br /><br />
`self.onmessage`를 통해 메인 스레드로부터 메시지를 받고, 계산이 끝나면 `self.postMessage`를 통해 다시 메인 스레드로 결과를 보내주는 구조죠.<br /><br />
이제 리액트 컴포넌트에서 이 워커를 사용해 볼까요?<br /><br />

```typescript
// src/App.tsx
useEffect(() => {
  workerRef.current = new Worker(
	new URL("./workers/fibWorker.ts", import.meta.url),
	{ type: "module" },
  );

  workerRef.current.onmessage = (e: MessageEvent<Result>) => {
	setResults((prev) => [...prev, e.data]);
  };
}, []);

const handleClick = () => {
  if (workerRef.current) {
	workerRef.current.postMessage({ id: idRef.current++, n: 42 });
  }
};
```

`useEffect`를 사용해서 컴포넌트가 마운트될 때 워커 인스턴스를 생성하고, 메시지를 받을 리스너를 등록합니다.<br /><br />
그리고 `handleClick`에서는 `postMessage`를 통해 워커에게 계산을 요청하죠.<br /><br />
이제 버튼을 눌러도 피보나치 계산은 백그라운드에서 실행되고, 우리 앱의 UI는 아주 부드럽게 유지됩니다.<br /><br />
문제가 완벽하게 해결된 것 같네요.<br /><br />

## 3단계 새로운 문제 여러 작업을 처리할 때
<br />
하지만 만약 사용자가 버튼을 정신없이 여러 번 클릭하면 어떻게 될까요?<br /><br />
현재 구현 방식으로는 클릭할 때마다 워커에게 새로운 메시지가 전송되고, 워커는 이 요청들을 동시에 처리하려고 할 텐데요.<br /><br />
만약 워커 작업에 비동기 로직이 포함되어 있다면, 작업이 요청된 순서대로 끝난다는 보장이 전혀 없습니다.<br /><br />
예를 들어 워커에 랜덤한 딜레이를 추가하면, 결과가 뒤죽박죽으로 도착하는 것을 볼 수 있죠.<br /><br />
이건 우리가 원하는 동작이 아닐 겁니다.<br /><br />

## 4단계 순서 보장하기 워커에 큐(Queue) 도입

작업이 요청된 순서대로 실행되는 것을 보장하기 위해, 우리는 워커 내부에 간단한 '큐(Queue)'를 구현할 수 있습니다.<br /><br />

```typescript
// src/workers/fibWorker.ts
interface Task {
  id: number;
  n: number;
}

const queue: Task[] = [];
let processing = false;

self.onmessage = (e: MessageEvent<Task>) => {
  queue.push(e.data);
  if (!processing) processNext();
};

function processNext() {
  if (queue.length === 0) {
	processing = false;
	return;
  }

  processing = true;
  const task = queue.shift();
  if (task) {
	const result = fib(task.n);
	self.postMessage({ id: task.id, result });
  }

  setTimeout(processNext, 0);
}
```

새로운 작업 요청이 들어오면 일단 `queue` 배열에 넣어두기만 하는데요.<br /><br />
그리고 `processNext` 함수가 큐에서 작업을 하나씩 꺼내어 처리하는 방식이죠.<br /><br />
한 작업이 끝나면 `setTimeout(processNext, 0)`을 통해 다음 작업을 비동기적으로 시작합니다.<br /><br />
이렇게 하면 작업이 요청된 순서대로 하나씩 처리되는 걸 보장할 수 있습니다.<br /><br />
아주 간단하지만 효과적인 방법이죠.<br /><br />

## 5단계 한 단계 더 나아가기 공유 워커(Shared Worker)

만약 여러 브라우저 탭에서 동일한 워커를 공유하고 싶다면 어떻게 해야 할까요?<br /><br />
예를 들어, 계산 결과를 캐싱해서 다른 탭에서도 즉시 결과를 볼 수 있게 하고 싶을 때 말이죠.<br /><br />
이럴 때 사용하는 것이 바로 '공유 워커(Shared Worker)'입니다.<br /><br />
공유 워커는 같은 출처(origin)를 가진 여러 컨텍스트(탭, iframe 등)에서 동시에 접근할 수 있는데요.<br /><br />
이번에는 피보나치 계산 결과를 캐싱하는 공유 워커를 만들어 보겠습니다.<br /><br />

```typescript
// src/workers/sharedFibWorker.ts
const fibCache = new Map<number, number>();

onconnect = (e: MessageEvent) => {
  const port = e.ports[0];
  port.start();

  port.onmessage = (evt: MessageEvent) => {
	// ... (큐 로직은 동일)
  };
};

function fib(n: number): number {
  if (fibCache.has(n)) return fibCache.get(n)!;
  const result = rawFib(n);
  fibCache.set(n, result);
  return result;
}
```

공유 워커는 일반 워커와 조금 다른데요.<br /><br />
`self.onmessage` 대신 `onconnect`를 사용하고, 각 연결은 `port`를 통해 통신합니다.<br /><br />
리액트 컴포넌트에서도 `SharedWorker`를 생성해서 연결해주면 되죠.<br /><br />

```typescript
// src/App.tsx
useEffect(() => {
  sharedWorkerRef.current = new SharedWorker(
	new URL("./workers/sharedFibWorker.ts", import.meta.url),
	{ type: "module" },
  );
  sharedWorkerRef.current.port.start();
  sharedWorkerRef.current.port.onmessage = (e: MessageEvent<Result>) => {
	// ...
  };
}, []);
```

이제 브라우저 탭을 두 개 열고, 첫 번째 탭에서 피보나치 계산을 실행해 보세요.<br /><br />
그리고 두 번째 탭에서 같은 숫자로 계산을 요청하면, 캐시된 결과를 즉시 받아오는 것을 확인할 수 있습니다.<br /><br />
정말 강력하죠?<br /><br />

## 마무리하며 워커 3형제 비교

웹 워커는 웹 애플리케이션의 성능과 반응성을 향상시키는 데 아주 강력한 도구입니다.<br /><br />
오늘 우리는 일반 '웹 워커'와 '공유 워커'에 대해 알아봤는데요.<br /><br />
이들과 함께 자주 언급되는 '서비스 워커(Service Worker)'까지 해서 세 가지 워커의 차이점을 간단히 정리하며 마무리하겠습니다.<br /><br />
웹 워커는 가장 기본적이고 흔한 선택지인데요.<br /><br />
하나의 페이지를 멈추지 않게 하기 위한 '임시 해결사'라고 생각하면 쉽습니다.<br /><br />
공유 워커의 핵심은 '조정'입니다.<br /><br />
여러 탭이나 창이 웹소켓 연결이나 캐시 같은 하나의 자원을 공유해야 할 때 사용하죠.<br /><br />
서비스 워커는 앞의 둘과는 근본적으로 다릅니다.<br /><br />
사이트 전체의 '네트워크 프록시' 역할을 하는 녀석이거든요.<br /><br />
오프라인에서도 앱이 작동하게 하거나 푸시 알림을 보내는 등, PWA(Progressive Web App)의 핵심 기술이라고 할 수 있습니다.<br /><br />
따라서 CPU를 많이 사용하는 계산 작업에는 '웹 워커'를, 탭 간 통신에는 '공유 워커'를, 그리고 오프라인 기능이나 푸시 알림에는 '서비스 워커'를 사용하는 것이 올바른 선택이 될 겁니다.<br /><br />
이 가이드가 여러분의 리액트 앱 성능을 한 단계 끌어올리는 데 도움이 되었으면 좋겠네요.<br /><br />
