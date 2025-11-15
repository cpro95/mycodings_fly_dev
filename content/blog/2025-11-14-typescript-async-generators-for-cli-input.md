---
slug: 2025-11-14-typescript-async-generators-for-cli-input
title: "타입스크립트 비동기 제너레이터, 복잡한 CLI 입력을 우아하게 다루는 법"
summary: "타입스크립트의 비동기 제너레이터를 사용해 복잡한 CLI 사용자 입력을 깔끔하게 처리하는 방법을 알아봅니다. 이벤트 리스너 방식의 단점을 극복하고 코드 가독성과 유지보수성을 높여보세요."
date: 2025-11-14T08:04:17.792Z
draft: false
weight: 50
tags: ["TypeScript", "async generator", "CLI", "비동기 제너레이터", "타입스크립트", "사용자 입력", "Node.js"]
contributors: []
---

![타입스크립트 비동기 제너레이터, 복잡한 CLI 입력을 우아하게 다루는 법](https://blogger.googleusercontent.com/img/a/AVvXsEgMdzWtp0NxHhFLFd8rh5Knn30foIHx6AdC48kvzR-LZg6zw-rk5Z5uUkPy-X9DPGO6arO2PpLGr6Ws5pHvoBiiTw30NL4VLBnwjoFfyw6ItBFXb9yhf3QsVXOP9AEFSIu7A0DF-bGCol39ABAj0oLAJao-k96iZKmNYk8D8VbmHzqNzOS8FVPcbYUz468=s16000)

타입스크립트(TypeScript)의 비동기 제너레이터를 사용하면 씨엘아이(CLI) 도구에서 사용자 입력을 아주 간단하게 처리할 수 있는데요.

값을 시간에 따라 'yield'하기 때문에 코드가 훨씬 깔끔해지고 따라가기 쉬워집니다.

이 접근 방식은 CLI 입력뿐만 아니라 다양한 소스에도 적용할 수 있거든요.

커맨드 라인 도구에서 사용자 입력을 읽고 처리하는 작업은 종종 이벤트 리스너, 상태, 제어 흐름을 복잡하게 다루는 것을 의미합니다.

노드(Node)의 'readline' 모듈을 사용하면 보통 'line' 이벤트를 수신하고, 들어오는 문자열을 파싱하고, 정리 작업이 제대로 처리되도록 신경 써야 하는데요.

이 방법도 작동은 하지만, 로직이 흩어져 있고 따라가기 어려운 코드를 만들 수 있습니다.

타입스크립트의 비동기 제너레이터는 이런 종류의 스트림을 모델링하는 훨씬 더 깔끔한 방법을 제공하거든요.

비동기 제너레이터는 `async function*` 문법을 사용해 정의합니다.

`async` 키워드는 함수 내에서 `await`를 사용할 수 있게 해주고, `function*` 표기법은 시간에 따라 여러 값을 'yield'할 수 있는 제너레이터로 만들어 주는데요.

이 둘의 조합은 값이 준비될 때마다 결과를 전달하는 비동기 이터레이터를 만들어냅니다.

소비는 `for await...of` 루프를 통해 이루어지는데, 이 루프는 새로운 값이 'yield'될 때까지 반복 사이에 일시 정지하거든요.

이는 터미널에 입력을 타이핑하는 것과 같은 사용자 주도 워크플로우에 아주 자연스럽게 들어맞습니다.

예를 들어, 키보드에서 한 줄에 하나씩 숫자를 읽어 실시간으로 '단순 이동 평균(Simple Moving Average)'을 업데이트하고 싶다고 상상해 보세요.

이벤트를 수동으로 연결하는 대신, 모든 것을 비동기 제너레이터로 감쌀 수 있습니다.


```typescript
import readline from 'node:readline';

export async function* keyboardStream(): AsyncGenerator<number> {
  const KEY_CTRL_C = '\u0003';

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  });

  for await (const line of rl) {
    const trimmed = line.trim();
    if (trimmed === KEY_CTRL_C) {
      rl.close();
      break;
    }

    const input = parseFloat(trimmed);
    if (isNaN(input)) {
      console.log(`Invalid input: ${trimmed}`);
    } else {
      yield input;
    }
  }
}
```

여기서 함수는 `number` 타입의 값을 생성하는데요.

사용자가 유효한 라인을 입력하고 엔터를 누를 때마다 제너레이터는 그 값을 'yield'합니다.

만약 'Ctrl-C'가 감지되면 제너레이터는 정상적으로 종료되고, 유효하지 않은 입력은 메시지로 알려주지만 절대 'yield'하지는 않거든요.

그 결과 모든 입력 처리 로직이 한곳에 깔끔하게 모여있는 코드가 완성됩니다.

이제 타입이 지정된 비동기 제너레이터가 있으니, 소비자 코드는 전적으로 숫자만 다루고 타입 시스템이 이를 강제하도록 믿을 수 있습니다.


```typescript
import { SMA } from 'trading-signals';

const sma = new SMA(3);
console.log(`Type numbers, press Enter, Ctrl+C to exit.`);

for await (const value of keyboardStream()) {
  sma.add(value);

  if (sma.isStable) {
    console.log(`SMA (${sma.interval}): ${sma.getResultOrThrow().toFixed(2)}`);
  } else {
    console.log(`Need more data...`);
  }
}
```

`for await...of` 루프는 마치 하나의 이야기처럼 읽히는데요.

'다음 숫자를 기다려서, 이동 평균에 추가하고, 준비되면 결과를 출력하거나, 사용자에게 더 많은 데이터가 필요하다고 알려준다'는 흐름입니다.

더 이상 정리되지 않은 이벤트 리스너도 없고, 오류 처리나 상태 추적을 위한 별도의 제어 구조도 필요 없거든요.

비동기 제너레이터가 값이 어떻게 생성되는지에 대한 모든 것을 캡슐화하기 때문입니다.

이 패턴은 CLI 입력에만 국한되지 않는데요.

파일 읽기, 네트워크 스트림 또는 시간에 따라 값이 도착하는 다른 어떤 소스에도 동일한 접근 방식을 사용할 수 있습니다.

비동기 제너레이터는 이러한 소스들을 균일하게 처리할 수 있는 단일하고 조합 가능한 방법을 제공하거든요.

덕분에 코드를 이해하고 유지보수하기가 훨씬 쉬워집니다.
