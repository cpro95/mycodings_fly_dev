---
slug: 2025-12-19-stop-using-typescript-exclamation-mark-for-safety
title: "타입스크립트의 느낌표 연산자 사용을 당장 멈춰야 하는 이유"
summary: "타입스크립트에서 non-null assertion 연산자가 위험한 이유를 살펴보고 이를 대체하여 코드의 안정성을 높이는 다양한 방법들을 소개합니다."
date: 2025-12-19T15:59:17.147Z
draft: false
weight: 50
tags: ["TypeScript", "타입스크립트", "Non-null assertion", "개발 가이드", "클린 코드", "프론트엔드 개발", "프로그래밍 팁"]
contributors: []
---

![타입스크립트의 느낌표 연산자 사용을 당장 멈춰야 하는 이유](https://blogger.googleusercontent.com/img/a/AVvXsEhZsB3p8GJlbd8Vqh5tOmM8E0L3__fTh3LwXZ6UKkH1KlPCIf48sWEzw8r92S4441ElXjEeZ433UTM8qwwX7BcTWzFLpY9ERTQRCGc_iU2CK0uDDd2X2VGAy6N5ok2RH60mxdDfnMApmkJS2z15bx9N9aVVz73B3TPJ5fs4mZ9KLb2Yq36bPO9Yki83M6E=s16000)

'Non-null assertion operator(비-null 단언 연산자)'인 느낌표(!)는 특정 값이 절대 'null'이나 'undefined'가 아닐 것이라고 'TypeScript(타입스크립트)'에게 장담하는 도구인데요.

하지만 이러한 신뢰는 코드가 실행되는 도중에 앱이 갑작스럽게 멈춰버리는 런타임 에러라는 값비싼 대가를 치르게 할 수 있습니다.

이번 글에서는 왜 이 연산자가 타입 안전성을 해치는지 알아보고 대신 사용할 수 있는 안전한 방법들을 제안해 보려고 하는데요.

작은 기호 하나가 컴파일러의 보호 기능을 무력화시키고 시스템을 위험에 빠뜨리는 과정을 함께 살펴보겠습니다.

## 느낌표 연산자가 실제로 하는 일

'Non-null assertion operator'는 잠재적으로 비어있을 수 있는 값을 무조건 존재하는 상태로 간주하라고 컴파일러에게 지시하는데요.

코드 뒤에 느낌표를 붙이는 순간 여러분은 시스템의 판단보다 본인의 직관을 더 믿겠다는 선언을 하는 셈입니다.

문제는 이 선언이 실제 데이터와 일치하지 않을 때 발생하며 타입 시스템이 방지하려고 했던 바로 그 에러가 런타임에서 터져버리는데요.

예를 들어 'user.email!'이라고 작성하면 이 이메일은 무조건 존재한다는 가정을 세우지만 이를 실제로 검증하는 절차는 어디에도 없습니다.


```typescript
interface User {
  email?: string;
}

function printEmail(user: User) {
  console.log(user.email!.toLowerCase());
}

// 매우 위험한 호출입니다!
printEmail({});
```

위의 예시에서 컴파일러는 이메일이 'string | undefined'일 수 있다는 사실을 알고 있지만 느낌표가 이를 강제로 무시하게 만드는데요.

결국 컴파일 단계에서는 아무런 경고도 나타나지 않지만 실제 실행 환경에서는 정의되지 않은 값의 속성을 읽을 수 없다는 'TypeError(타입 에러)'를 마주하게 됩니다.


## 더 나은 대안들

느낌표를 쓰고 싶은 유혹이 들 때마다 타입 안전성을 지키면서 문제를 해결할 수 있는 훨씬 안전한 선택지들이 존재하는데요.

각 상황에 맞는 적절한 대안을 선택함으로써 코드의 신뢰도를 획기적으로 높일 수 있습니다.


### 옵셔널 체이닝

가장 먼저 고려해 볼 수 있는 방법은 'Optional Chaining(옵셔널 체이닝)'을 사용하는 것인데요.


```typescript
interface User {
  email?: string;
}

function printEmail(user: User) {
  console.log(user.email?.toLowerCase());
}

printEmail({});
```

이 방식은 앱이 갑자기 죽는 현상은 막아주지만 때로는 예상치 못한 결과물을 남기기도 하는데요.

콘솔에 단순히 'undefined'가 출력되는 것은 실제 문제를 해결하기보다는 단순히 오류를 뒤로 미루는 행위에 가깝습니다.

잘못된 데이터가 시스템 내부에서 계속 흘러 다니게 두는 것보다 오류가 발생한 지점에서 즉시 문제를 파악하는 것이 장기적으로는 더 유리한데요.

가장 좋은 방법은 문제가 생겼을 때 명확한 에러를 발생시켜 원인을 빠르게 진단할 수 있는 설계를 갖추는 것입니다.


### 널 병합 연산자

'Nullish Coalescing(널 병합 연산자)'는 원본 값이 없을 때 기본값을 제공하는 아주 유용한 도구인데요.


```typescript
interface User {
  email?: string;
}

function printEmail(user: User) {
  console.log(user.email ?? ''.toLowerCase());
}

printEmail({});
```

이 접근법은 크래시를 방지하면서도 의미 없는 데이터가 노출되는 상황을 어느 정도 통제할 수 있게 해줍니다.

적절한 기본값이 있는 경우에 특히 효과적이며 사용자에게 더 친절한 정보를 제공할 수 있는데요.

중첩된 객체의 속성에 접근할 때도 옵셔널 체이닝과 결합하여 'user.address?.city ?? Unknown'처럼 활용하면 매우 깔끔한 코드가 완성됩니다.


### 조건부 연산자

값이 존재할 때와 아닐 때의 로직을 완전히 분리하고 싶다면 삼항 연산자가 명확한 해답이 되는데요.


```typescript
function printEmail(user: User) {
  console.log(user.email ? user.email.toLowerCase() : '사용자의 이메일 주소가 없습니다.');
}
```

이 코드는 두 가지 상황을 모두 명시적으로 처리하기 때문에 읽는 사람 입장에서도 의도가 분명하게 전달됩니다.

각 시나리오에 맞는 적절한 피드백을 줄 수 있다는 점에서 매우 권장되는 방식입니다.


### 타입 가드

런타임 체크를 통해 타입을 좁혀야 한다면 'Type Guards(타입 가드)'를 사용하는 것이 가장 정석적인 방법인데요.


```typescript
function hasEmail(email: string | undefined): email is string {
  return email !== undefined;
}

function printEmail({ email }: User) {
  if (hasEmail(email)) {
    console.log(email.toLowerCase());
  }
  console.log('사용자의 이메일 주소가 없습니다.');
}
```

타입 가드는 느낌표 연산자와 달리 실제 실행 시점에 검증을 수행하므로 코드가 중단될 위험이 전혀 없는데요.

한 번 정의해두면 애플리케이션 곳곳에서 재사용할 수 있어 코드의 일관성 유지에도 큰 도움이 됩니다.


## 단언 함수의 활용

데이터를 검증하고 만약 유효하지 않다면 의도적으로 에러를 던져야 할 때는 'Assertion Functions(단언 함수)'를 사용하는데요.

이는 특히 테스트 코드에서 빛을 발하며 잘못된 상태가 지속되는 것을 방지하는 강력한 방어선 역할을 합니다.


```typescript
// 단언 함수 정의
function assertDefined<T>(value: T | undefined): asserts value is T {
  if (value === undefined) {
    throw new Error('값이 정의되어 있지 않습니다.');
  }
}

describe('UserValidator', () => {
  it('사용자 이메일을 검증합니다', () => {
    const user = { email: 'mail@domain.com' };
    const validatedUser = UserValidator.validateEmail(user);
    assertDefined(validatedUser);
    expect(validatedUser.email).toBe(user.email);
  });
});
```

'assertDefined' 함수는 런타임에서 값이 존재하는지 확인하는 동시에 타입스크립트가 해당 값을 안전한 타입으로 인식하도록 돕는데요.

만약 이 함수가 없다면 검증된 이후에도 타입스크립트는 여전히 해당 값이 비어있을 수 있다고 경고를 보낼 것입니다.


## 노드 환경에서의 활용

'Node.js(노드)' 환경에서도 기본 제공되는 'assert' 모듈을 사용하여 비슷한 효과를 낼 수 있는데요.

특히 환경 변수와 같이 애플리케이션 실행에 필수적인 설정값을 검증할 때 매우 유용합니다.


```typescript
import assert from 'node:assert';

// 시작 시 필수 환경 변수 검증
assert.ok(process.env.DATABASE_URL, 'DATABASE_URL 환경 변수가 필요합니다');

export const config = {
  databaseUrl: process.env.DATABASE_URL,
};
```

이렇게 하면 설정이 누락되었을 때 앱이 나중에 엉뚱한 곳에서 죽는 대신 실행 직후에 명확한 이유와 함께 종료되는데요.

단순히 느낌표를 붙여서 타입 경고만 끄는 것보다 훨씬 성숙하고 안전한 코딩 방식이라고 할 수 있습니다.


[그림이 들어갈 위치: 상황별 대체 연산자 선택 가이드 요약 차트]

## 방어적인 코드 구축하기

타입스크립트를 사용하는 궁극적인 목적은 에러를 실행 전단계인 컴파일 시점에 잡아내는 것인데요.

빨간 줄을 없애기 위해 느낌표를 사용하는 것은 타입스크립트가 주는 소중한 경고를 스스로 거부하는 것과 같습니다.

경고를 숨기기보다 왜 그런 경고가 나타났는지 고민하고 이를 코드 구조적으로 해결하려는 자세가 필요한데요.

비어있는 케이스를 명시적으로 처리하거나 타입 가드를 활용하는 습관을 들이는 것이 좋습니다.


## 상황에 따른 선택 기준

어떤 방식을 선택할지는 개발자의 의도에 따라 달라질 수 있는데요.

단순히 속성에 접근하는 것이 목적이고 값이 없어도 무방하다면 옵셔널 체이닝이 정답입니다.

대체할 수 있는 기본값이 준비되어 있다면 널 병합 연산자를 선택하는 것이 현명한데요.

각 상황에 따라 로직이 달라져야 한다면 조건부 연산자를 써야 하고 재사용성이 중요하다면 타입 가드가 제격입니다.

프로그래밍 로직상 절대 없어서는 안 될 값이라면 단언 함수를 통해 엄격하게 관리하는 것이 가장 안전합니다.


## ESLint로 규칙 강제하기

팀 단위 프로젝트에서 이러한 관행을 유지하는 가장 좋은 방법은 'ESLint(이슬린트)' 설정을 활용하는 것인데요.

'TypeScript ESLint'에서 제공하는 특정 규칙을 활성화하면 위험한 단언문이 코드에 섞여 들어오는 것을 원천 봉쇄할 수 있습니다.


```javascript
export default tseslint.config({
  rules: {
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
  },
});
```

이 규칙을 설정해두면 개발 과정에서 느낌표 사용을 지양하게 되고 자연스럽게 더 안전한 대안들을 찾게 되는데요.

결국 이러한 작은 습관들이 모여 흔들리지 않는 견고한 서비스를 만드는 밑거름이 됩니다.
