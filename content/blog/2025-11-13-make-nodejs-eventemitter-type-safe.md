---
slug: 2025-11-13-make-nodejs-eventemitter-type-safe
title: "Node.js EventEmitter, 타입스크립트에서 100% 타입 안전성 확보하기"
summary: "타입스크립트에서 Node.js EventEmitter를 사용할 때 발생하는 타입 문제를 해결하는 세 가지 방법을 알아봅니다. 선언 병합, typed-emitter 라이브러리, 그리고 최신 EventMap을 활용하여 코드의 안정성을 높여보세요."
date: 2025-11-13T07:34:09.212Z
draft: false
weight: 50
tags: ["Node.js", "EventEmitter", "TypeScript", "타입스크립트", "타입 안전성", "선언 병합", "typed-emitter"]
contributors: []
---

![Node.js EventEmitter, 타입스크립트에서 100% 타입 안전성 확보하기](https://blogger.googleusercontent.com/img/a/AVvXsEiOFe8uz6_nKh7oyeoCLL1Me8otK8WSRJSNNFATCRLfAnTYkP11_RCbkDPSr0QxN3T4b1suD-cWi9YB3l6g0NvBCiNk-37TUV9T8Kj5rnPbXxZLZ6fwLol-VU1C9ujVlbGi_uzV5XBbVpSJzvyMCA-zuRFUk8nSKpOdHLIFFlHHusdgZm8uAtMrdYns6sA=s16000)

타입스크립트(TypeScript)에서 '선언 병합'을 활용하면 노드제이에스(Node.js)의 이벤트이미터(EventEmitter)를 타입 안전하게 만들 수 있는데요.

이렇게 하면 정확한 이벤트 이름과 리스너 시그니처를 보장해서 IDE나 타입 검사기의 안정성을 크게 높일 수 있습니다.

여기에 'typed-emitter' 같은 라이브러리를 추가로 사용하면 전체 과정을 더 간소화할 수도 있거든요.

노드제이에스(Node.js)의 이벤트이미터(EventEmitter)는 가장 자주 사용되는 API 중 하나입니다.

스트림, 서버, 소켓, 자식 프로세스는 물론, 이벤트를 수신해야 하는 대부분의 서드파티 라이브러리에서 핵심적인 역할을 하는데요.

의도적으로 유연하게 설계되었지만, 바로 그 유연성 때문에 타입스크립트(TypeScript)에서 사용할 때는 몇 가지 문제점이 발생합니다.


## EventEmitter의 근본적인 문제점
@types/node의 타입 정의를 살펴보면, 이벤트이미터(EventEmitter)는 본질적으로 다음과 같이 타이핑되어 있거든요.


```typescript
on(event: string | symbol, listener: (...args: any[]) => void): this;
```

이 타입 정의는 지나치게 허용 범위가 넓다는 문제가 있는데요.

이벤트 이름에 오타를 내더라도 아무 문자열이나 허용되기 때문입니다.

리스너의 인자 역시 'any[]'로 타입이 지정되어 있어서 컴파일러는 이벤트가 어떤 형태의 데이터를 전달하는지 전혀 알 수가 없거든요.

게다가 'emit' 메서드도 동일하게 약한 타이핑을 공유하기 때문에, 런타임에 도달하기 전까지는 잘못된 개수나 타입의 인자를 전달해도 막을 방법이 없습니다.


## 선언 병합으로 문제 해결하기
다행히 아주 간단한 해결책이 있는데요.

바로 타입스크립트(TypeScript)의 '선언 병합(declaration merging)'이라는 기능을 사용하는 것입니다.

이 기능을 활용하면 인터페이스에 이벤트를 명시하고, 클래스에서는 별도의 상용구 코드 없이 노드(Node)의 이벤트이미터(EventEmitter)를 확장하기만 하면 되거든요.

실제 코드로는 이런 모습입니다.


```typescript
import { EventEmitter } from 'node:events';

export interface ChatRoom {
  on(event: 'join', listener: (name: string) => void): this;
  on(event: 'leave', listener: (name: string) => void): this;
}

export class ChatRoom extends EventEmitter {
  private users: Set<string> = new Set();

  public join(name: string) {
    this.users.add(name);
    this.emit('join', name);
  }

  public leave(name: string) {
    if (this.users.delete(name)) {
      this.emit('leave', name);
    }
  }
}

const room = new ChatRoom();

room.on('join', (user) => {
  console.log(`"${user}" joined the channel.`);
});

room.on('leave', (user) => {
  console.log(`"${user}" left the channel.`);
});
```

런타임 시점에서 'ChatRoom'은 그저 이벤트이미터(EventEmitter)의 서브클래스일 뿐인데요.

하지만 디자인 타임에는 인터페이스가 클래스와 병합됩니다.

덕분에 컴파일러는 이제 'join'과 'leave'만이 유효한 이벤트 이름이라는 것과, 해당 이벤트 리스너가 'name' 파라미터를 받는다는 사실을 정확히 알게 되는 것이죠.

선언 병합을 적용하면 두 가지 장점을 모두 누릴 수 있는데요.

런타임 동작은 여전히 노드제이에스(Node.js)가 제공하므로 자체 이벤트 시스템을 유지 관리할 필요가 없습니다.

동시에 컴파일러가 올바른 이벤트 이름과 리스너 시그니처를 강제하기 때문에, IDE와 타입스크립트(TypeScript) 타입 검사기는 이벤트를 다룰 때 아주 든든한 지원군이 되어줍니다.


## 한 걸음 더 나아가기
인터페이스 병합 방식에는 한 가지 한계점이 있는데요.

완벽한 타입 안전성을 원한다면 이벤트이미터(EventEmitter)의 모든 공개 API에 걸쳐 동일한 이벤트 정의를 반복해야 한다는 점입니다.

'on'과 'emit'만 정의하는 것으로도 충분할 때가 많지만, 만약 코드베이스에서 'once', 'off', 'removeListener' 같은 다른 메서드들도 사용한다면 각각의 타입을 모두 명시적으로 지정해 주어야 하거든요.

이벤트이미터(EventEmitter)의 전체 API를 폭넓게 활용하는 경우 코드가 상당히 장황해질 수 있습니다.

이런 상용구 코드를 피하고 싶다면 'typed-emitter'라는 작은 유틸리티 라이브러리를 사용할 수 있는데요.

이 라이브러리는 강력한 타입이 적용된 버전의 이벤트이미터(EventEmitter)를 기본으로 제공하기 때문에, 이벤트 맵을 한 번만 선언하면 'on', 'once', 'off', 'emit' 등 모든 공개 메서드에 타입이 자동으로 적용됩니다.

예시 코드는 다음과 같습니다.


```typescript
import { EventEmitter } from 'node:events';
import TypedEventEmitter, { type EventMap } from 'typed-emitter';
type TypedEmitter<T extends EventMap> = TypedEventEmitter.default<T>;

interface MyEvents {
  [event: string]: (...args: any[]) => void;
  join: (name: string) => void;
  leave: (name: string) => void;
}

export class ChatRoom extends (EventEmitter as new () => TypedEmitter<MyEvents>) {
  private users: Set<string> = new Set();

  public join(name: string) {
    this.users.add(name);
    this.emit('join', name);
  }

  public leave(name: string) {
    if (this.users.delete(name)) {
      this.emit('leave', name);
    }
  }
}

const room = new ChatRoom();

room.once('join', (user) => {
  console.log(`"${user}" joined the channel.`);
});

room.on('leave', (user) => {
  console.log(`"${user}" left the channel.`);
});

room.off('leave', (user) => {
  console.log(`"${user}" left the channel.`);
});
```

## EventMap 활용하기
노드(Node)의 이벤트이미터(EventEmitter) 타입 정의는 @types/node 패키지를 통해 제공되는데요.

2024년 7월부터는 @types/node에 이벤트 맵을 정의하기 위한 제네릭 타입이 포함되었습니다.

이 이벤트 맵을 사용하면 이벤트 이름과 그에 해당하는 리스너 함수 사이에 강력한 타이핑을 강제할 수 있거든요.

즉, 이벤트 맵을 정의함으로써 각 리스너가 받아야 할 파라미터 목록을 정확하게 지정할 수 있습니다.


```typescript
import EventEmitter from 'node:events';

interface ChatEvents {
  message: [from: string, content: string];
  join: [name: string];
  leave: [name: string];
}

const room = new EventEmitter<ChatEvents>();

room.on('message', (from, content) => {
  console.log(`${from}: ${content}`);
});

room.on('join', (user) => {
  console.log(`"${user}" joined the channel.`);
});

room.on('leave', (user) => {
  console.log(`"${user}" left the channel.`);
});
```
