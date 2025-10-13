---
slug: 2025-07-09-the-dangerous-misconception-of-promise-race-in-nextjs
title: Next.js와 Promise.race의 위험한 오해 - 당신의 서버는 지금도 낭비 중입니다
date: 2025-07-09 12:27:24.615000+00:00
summary: Next.js 서버 컴포넌트에서 Promise.race가 예상과 다르게 동작하는 이유와 AbortController를 이용한 올바른 취소 패턴을 알아봅니다.
tags: ["next.js", "Next.js", "Promise.race", "서버컴포넌트", "성능최적화", "AbortController", "자바스크립트"]
contributors: []
draft: false
---

Next.js로 개발을 하다 보면 여러 비동기 작업을 동시에 처리해야 하는 순간이 찾아옵니다.

이때 많은 개발자들이 자연스럽게 `Promise.race()`를 떠올리는데요.

가장 빠른 작업 하나만 끝나면 나머지는 신경 쓰지 않아도 된다는 생각, 혹시 여러분도 해보지 않으셨습니까.

하지만 만약 그 생각이 위험한 오해이고, 여러분의 서버 자원이 지금 이 순간에도 조용히 낭비되고 있다면 어떨까요.

오늘은 Next.js 서버 컴포넌트 환경에서 `Promise.race`가 어떻게 예상과 다르게 동작하는지, 그리고 이 문제를 어떻게 해결해야 하는지 깊이 있게 파헤쳐 보겠습니다.

### 1. `Promise.race`에 대한 흔한 오해

`Promise.race`는 이름 그대로 '경주'와 같습니다.

여러 개의 프로미스(비동기 작업)를 동시에 출발시켜, 가장 먼저 결승선에 도달하는(성공 또는 실패하는) 작업의 결과만 취하는 방식입니다.

많은 개발자들은 이렇게 생각합니다.

'1등이 결정되면, 나머지 경주하던 주자들은 경기를 포기하고 멈추겠지?'

즉, 가장 빠른 작업이 끝나면 나머지 느린 작업들은 자동으로 취소될 것이라는 기대인데요.

과연 그럴까요.

간단한 실험을 통해 진실을 확인해 보겠습니다.

### 2. 충격적인 실험 결과: 멈추지 않는 프로미스

여기 1초 만에 끝나는 빠른 작업(`fastTask`)과 5초가 걸리는 느린 작업(`slowTask`)이 있습니다.

두 작업 모두 시작과 끝에 로그를 남기도록 하고, 이 둘을 `Promise.race`로 실행시켜 보겠습니다.

```javascript
// 5초가 걸리는 느린 작업
async function slowTask() {
  console.log('느린 작업 시작...');
  await new Promise(resolve => setTimeout(resolve, 5000));
  console.log('>>> 느린 작업 완료!'); // 이 로그가 찍힐까요?
  return '느림';
}

// 1초가 걸리는 빠른 작업
async function fastTask() {
  console.log('빠른 작업 시작...');
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log('>>> 빠른 작업 완료!');
  return '빠름';
}

// Next.js 서버 컴포넌트
export default async function Page() {
  console.log('Promise.race 시작!');
  const result = await Promise.race([slowTask(), fastTask()]);
  console.log(`경주 결과: ${result}`);

  return <h1>Promise.race 테스트</h1>;
}
```

이 코드를 실행하면, 우리의 기대대로라면 콘솔에는 다음과 같이 찍혀야 합니다.

`느린 작업 시작...` -> `빠른 작업 시작...` -> `빠른 작업 완료!` -> `경주 결과: 빠름`

그리고 `느린 작업 완료!` 로그는 영원히 나타나지 않아야 합니다.

하지만 실제 Next.js 서버의 로그를 확인해 보면, 결과는 충격적입니다.

`빠른 작업 완료!`가 찍히고 4초가 흐른 뒤, 뜬금없이 `느린 작업 완료!` 로그가 떡하니 나타나는 것을 볼 수 있습니다.

이것은 `Promise.race`가 끝났음에도 불구하고, 패배한 `slowTask`가 5초를 꽉 채워 실행을 마쳤다는 뜻입니다.

만약 이 느린 작업이 비싼 데이터베이스 조회나 복잡한 연산이었다면, 우리는 불필요하게 서버 자원을 5초 동안이나 낭비한 셈이 됩니다.

### 3. 왜 이런 현상이 발생할까요?

이것은 Next.js의 버그가 아닙니다.

자바스크립트의 `Promise`가 가진 본질적인 특징 때문인데요.

자바스크립트에서 프로미스는 한번 시작되면 자체적으로 '취소'하는 표준적인 방법이 없습니다.

`Promise.race`는 단지 여러 작업 중 어떤 것이 가장 먼저 끝나는지 '지켜보고 결과를 가로채는' 관찰자일 뿐, 다른 작업들의 실행에 직접 개입하여 중단시키는 권한이 없습니다.

경주가 끝나도 패배한 주자들은 아무도 말려주지 않아서 결승선까지 계속 달리는 것과 같습니다.

### 4. 올바른 해결책: `AbortController`를 이용한 명시적 취소

그렇다면 이 낭비를 어떻게 막을 수 있을까요.

해답은 바로 `AbortController`에 있습니다.

`AbortController`는 비동기 작업에 "이제 그만 멈춰!"라는 신호를 보낼 수 있는 공식적인 장치입니다.

사용법은 다음과 같습니다.

1.  `AbortController` 인스턴스를 만듭니다.

2.  컨트롤러의 `signal` 객체를 취소하고 싶은 비동기 함수에 전달합니다.

3.  비동기 함수 내부에서는 주기적으로 `signal.aborted` 상태를 확인하여, 만약 `true`가 되면 작업을 중단하고 빠져나옵니다.

4.  `Promise.race`가 끝나면, `finally` 블록에서 `controller.abort()`를 호출하여 다른 작업들에게 "경주 끝났으니 모두 멈춰!"라는 신호를 보냅니다.


```javascript
async function cancellableSlowTask(signal) {
  console.log('취소 가능한 느린 작업 시작...');
  for (let i = 0; i < 5; i++) {
    if (signal.aborted) {
      console.log('느린 작업 중단됨!');
      // AbortError를 발생시켜 프로미스를 거부 상태로 만듭니다.
      throw new DOMException('작업이 중단되었습니다.', 'AbortError');
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  console.log('>>> 느린 작업 완료! (이 로그는 보이면 안됩니다)');
  return '느림';
}

// 빠른 작업도 signal을 받도록 수정합니다 (구조 통일을 위해)
async function cancellableFastTask(signal) {
  console.log('취소 가능한 빠른 작업 시작...');
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (signal.aborted) {
     throw new DOMException('작업이 중단되었습니다.', 'AbortError');
  }
  console.log('>>> 빠른 작업 완료!');
  return '빠름';
}

// Next.js 서버 컴포넌트
export default async function Page() {
  const controller = new AbortController();
  const { signal } = controller;

  try {
    console.log('취소 가능한 Promise.race 시작!');
    const result = await Promise.race([
      cancellableSlowTask(signal),
      cancellableFastTask(signal)
    ]);
    console.log(`경주 결과: ${result}`);
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('경주 중 작업이 중단되었습니다.');
    } else {
      console.error('알 수 없는 에러:', error);
    }
  } finally {
    // 경주가 어떻게 끝나든, 컨트롤러를 통해 중단 신호를 보냅니다.
    console.log('경주 종료, 중단 신호 전송!');
    controller.abort();
  }

  return <h1>AbortController 테스트</h1>;
}
```

이제 이 코드를 실행하면 `빠른 작업 완료!` 로그가 찍힌 직후, `느린 작업 중단됨!` 로그가 나타나며 불필요한 실행이 즉시 멈추는 것을 확인할 수 있습니다.

### 도구를 깊이 이해하는 것의 중요성

`Promise.race`는 분명 유용한 도구이지만, 그 작동 방식을 오해하면 우리도 모르는 사이에 서버의 성능을 저하 시키는 원인이 될 수 있습니다.

특히 여러 외부 API를 동시에 호출하여 가장 빠른 응답을 사용하거나, 특정 작업에 타임아웃을 거는 로직에서 이런 실수가 발생하기 쉽습니다.

오늘 알아본 `AbortController` 패턴은 단순히 코드를 추가하는 것을 넘어, 비동기 작업을 '제어할 수 있도록' 설계하는 습관의 중요성을 알려줍니다.

우리가 사용하는 도구의 내부 동작을 정확히 이해하고 올바르게 사용하는 것, 그것이 바로 더 견고하고 효율적인 애플리케이션을 만드는 개발자의 진짜 실력일 것입니다.
