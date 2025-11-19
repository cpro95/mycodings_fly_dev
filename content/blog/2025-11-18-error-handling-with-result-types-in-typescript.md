---
slug: 2025-11-18-error-handling-with-result-types-in-typescript
title: "Result 타입으로 안전한 타입스크립트 에러 핸들링 정복하기"
summary: "전통적인 try/catch 방식 대신, 타입스크립트에서 더 안전하고 명시적인 Result 타입 패턴을 사용하는 방법을 배워보세요. 직접 Result 타입을 구현해보고, neverthrow 라이브러리와 ESLint를 활용해 팀 전체에 일관된 에러 처리 규칙을 적용하는 팁까지 알아봅니다."
date: 2025-11-18T14:00:27.211Z
draft: false
weight: 50
tags: ["Result 타입", "타입스크립트", "에러 핸들링", "neverthrow", "ESLint", "try/catch", "함수형 프로그래밍"]
contributors: []
---

![Result 타입으로 안전한 타입스크립트 에러 핸들링 정복하기](https://blogger.googleusercontent.com/img/a/AVvXsEgVo4n0q2uj6homP9qsuyD1bU0IH9uM4DFLAAQxyk8b4eNBS22qayZ4HiI6aQRu1aWJ0WXEmoN-NTk59UHcqCJtWuoPUD7Z0KzxprkMJHfw9xQDyhBWMiyzu60A6xCekrFIWGRRGCYcYeQeQbYJsXKtFvkCBLFSCDt-a5xFo3uv5hQeS55K3vj0faGRirM=s16000)


자바스크립트에서는 전통적으로 에러 처리를 위해 'try/catch'를 사용해 왔는데요.

하지만 러스트(Rust)나 고(Go) 같은 언어를 사용해 보셨다면, 함수 반환값의 일부로 에러를 함께 돌려주는 훨씬 깔끔한 접근 방식을 경험해 보셨을 겁니다.


바로 이 'Result 타입' 패턴을 타입스크립트(TypeScript)에서도 똑같이 사용할 수 있거든요.

이번 글에서는 Result 타입 패턴이 무엇인지 알아보고, 직접 처음부터 구현해 본 뒤, 검증된 라이브러리와 린팅 규칙을 통해 프로젝트 전반에 일관되게 적용하는 방법까지 상세히 다뤄보겠습니다.


### Result 타입 패턴이란?

에러를 'throw'하는 방식의 한 가지 단점은 타입스크립트가 우리에게 그 에러를 명시적으로 처리하도록 강제하지 않는다는 점인데요.

이는 결국 처리되지 않은 예외(uncaught exceptions)로 이어질 수 있는 위험을 안고 있습니다.

반면에, 함수가 두 가지 구조화된 타입 중 하나(성공 객체와 페이로드, 또는 에러 객체)를 반환하도록 만들면 타입스크립트의 타입 시스템이 '타입 좁히기(narrowing)'를 강제하거든요.

이를 통해 성공과 실패 케이스 모두가 적절하게 처리되도록 보장할 수 있습니다.


### 가장 간단한 Result 타입 예제

Result 타입 패턴이 실제로 어떻게 동작하는지 확인하기 위해, 가장 기본적인 형태의 'Result<T, E>'를 직접 구현해 볼 텐데요.

아래 코드를 함께 보시죠.


```typescript
// 제네릭 Result 타입
type Result<T, E = Error> = { ok: true; data: T } | { ok: false; error: E };

// 사용자 정의 데이터 타입
type User = {
  age: number;
  name: string;
};

// 서비스 함수
export function getUser(id: number): Result<User> {
  if (id === 0) {
    return {
      ok: false,
      error: new Error('User not found'),
    };
  }

  const user = {
    age: 99,
    name: 'Test User',
  };

  return {
    ok: true,
    data: user,
  };
}

// 비즈니스 로직
const result = getUser(1337);

if (result.ok) {
  console.log(`User "${result.data.name}" is "${result.data.age}" years old.`);
} else {
  console.error(result.error.message);
}
```

먼저 제네릭 'Result' 타입을 정의하는 것으로 시작하는데요.

이 타입은 성공과 에러라는 두 가지 가능한 형태를 가지는 '유니언 타입'입니다.

작업이 성공하면 함수는 'ok: true'와 함께 'data' 페이로드를 담은 객체를 반환하고, 실패하면 'ok: false'와 함께 'error'를 반환합니다.

여기서 제네릭 매개변수는 유연성을 더해주거든요.

성공 타입인 'T'는 어떤 것이든 될 수 있고, 에러 타입인 'E'는 별도로 지정하지 않으면 기본적으로 내장 'Error' 객체가 됩니다.


'User' 타입은 우리가 함수로부터 반환받기를 기대하는 데이터의 종류를 나타내는데요.

이름과 나이를 포함하고 있습니다.


'getUser'라는 함수는 ID로 사용자를 가져오는 상황을 시뮬레이션하는데요.

만약 ID로 0이 제공되면, 함수는 Result 타입으로 감싸진 에러를 반환합니다.

그렇지 않으면, 가짜 사용자 데이터를 만들어 성공 결과로 반환하거든요.

여기서 핵심은 이 함수가 절대 에러를 'throw'하지 않는다는 점입니다.

항상 동일한 외부 구조를 가진 명확한 결과 객체를 반환하기 때문에, 호출하는 쪽에서는 두 가지 경우를 모두 자신 있게 처리할 수 있는 것이죠.


마지막으로 비즈니스 로직에서 'getUser'를 호출하는데요.

타입스크립트의 '제어 흐름 분석(control flow analysis)' 덕분에, 페이로드 데이터에 접근하기 전에 'result.ok' 값을 먼저 확인하도록 강제됩니다.

이는 성공과 실패 케이스를 명시적으로 처리하게 만들거든요.

조용한 실패(silent failure)도 없고, try/catch 블록도 필요 없으며, 예외 처리를 잊어버릴 위험도 없습니다.

모든 것이 코드 상에 명확하게 드러나고, 타입 시스템이 모든 단계에서 개발자를 든든하게 지원해 주는 셈이죠.


이렇게 가장 기본적인 형태만 사용해도 타입 안정성, 예측 가능한 제어 흐름, 그리고 더 명확한 코드 의도라는 많은 이점을 바로 얻을 수 있는데요.

하지만 애플리케이션이 커질수록 이 패턴이 다소 반복적으로 느껴질 수 있습니다.

결과를 변환하거나, 여러 작업을 연결하거나, 비동기 케이스를 처리하고 싶을 때가 많아지기 때문이죠.

바로 이럴 때 'neverthrow'와 같은 전용 라이브러리가 등장하는데요.

동일한 핵심 아이디어를 유지하면서도 훨씬 더 편리하고 직관적인(ergonomic) 해결책을 제공합니다.


### neverthrow 라이브러리 활용하기

이제 앞에서 만들었던 간단한 Result 예제를 'neverthrow'를 사용해 리팩토링해 볼 텐데요.

'neverthrow'는 러스트 스타일의 결과 처리를 타입스크립트에 도입해 주는 작지만 강력한 라이브러리입니다.


먼저, 패키지 매니저를 사용해 라이브러리를 설치해 주세요.


```bash
npm install neverthrow
```

설치가 완료되면, 핵심 유틸리티인 'ok', 'err', 그리고 'Result' 타입을 임포트해서 사용할 수 있는데요.

모든 것이 유틸리티 함수 기반이기 때문에, 직접 객체를 만들 필요도 없고 속성을 빠뜨리거나 오타를 낼 위험도 없습니다.


```typescript
// 제네릭 Result 타입과 유틸리티 함수
import { Result, ok, err } from 'neverthrow';

// 사용자 정의 데이터 타입
type User = {
  age: number;
  name: string;
};

// 서비스 함수
export function getUser(id: number): Result<User, Error> {
  if (id === 0) {
    return err(new Error('User not found'));
  }

  const user = {
    age: 99,
    name: 'Test User',
  };

  return ok(user);
}

// 비즈니스 로직
const result = getUser(1337);

if (result.isOk()) {
  console.log(`User "${result.value.name}" is "${result.value.age}" years old.`);
} else {
  console.error(result.error.message);
}
```

'getUser' 서비스 함수를 호출한 후에는, 'neverthrow'가 제공하는 'isOk()' 또는 'isErr()' 메서드를 사용해 안전하게 결과를 열어볼 수 있는데요.

이 메서드들은 타입 가드 역할을 해서, 현재 분기에서 결과가 값을 포함하는지 에러를 포함하는지 타입스크립트가 추론할 수 있게 해줍니다.

이 방식은 우리가 직접 구현했던 버전과 거의 동일하게 작동하지만, 훨씬 표준화된 '안전장치'를 제공하는 것이죠.


### neverthrow 일관성 강제하기

'neverthrow' 사용의 진정한 이점은 코드베이스가 성장할수록 더욱 빛을 발하는데요.

코드를 읽고 이해하기 쉽게 만들어줄 뿐만 아니라, ESLint와 같은 도구와 완벽하게 통합됩니다.

'eslint-plugin-neverthrow'를 추가하면, 개발자가 Result를 반환하는 함수 내부에서 실수로 에러를 throw하거나, Result를 제대로 열어보지 않고 사용하는 것을 방지하는 규칙을 강제할 수 있거든요.

이는 피드백 루프를 단축시키고, 팀 전체나 AI 코딩 에이전트 전반에 걸쳐 좋은 습관을 강화하는 데 큰 도움이 됩니다.


### ESLint 설정 예시

```javascript
// .eslintrc.js
module.exports = {
  plugins: ['neverthrow'],
  rules: {
    'neverthrow/must-use-result': 'error',
    'neverthrow/no-throw-in-result-function': 'error',
  },
};
```
