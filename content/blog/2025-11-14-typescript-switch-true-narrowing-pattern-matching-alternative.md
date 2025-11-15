---
slug: 2025-11-14-typescript-switch-true-narrowing-pattern-matching-alternative
title: "타입스크립트 switch(true), 복잡한 if/else를 대체할 새로운 패턴"
summary: "타입스크립트 5.3에 도입된 switch-true narrowing 기능으로 복잡한 if/else 체인을 개선하는 방법을 알아봅니다. 코드 가독성과 타입 안전성을 높이는 실용적인 패턴 매칭 대안을 확인하세요."
date: 2025-11-14T07:57:22.120Z
draft: false
weight: 50
tags: ["타입스크립트", "switch-true", "패턴 매칭", "if/else", "코드 가독성", "타입 안전성", "TypeScript"]
contributors: []
---

![타입스크립트 switch(true), 복잡한 if/else를 대체할 새로운 패턴](https://blogger.googleusercontent.com/img/a/AVvXsEiNCEoQvsN4awZofCJrdv1I9mWwm0Elewods8ed1YEjKkSMzl6Pf4X_c8FG9-4ltEpjpOKo75oKk5ls7eLFAUKbVJXOQ8xgV46lOeuWdyIgkpiXxds28zKBRlDYqhGYUsHRJIWrdkpgYPWgre-v84qDM9cHuzZQMVm1g_gl5S2jHuB_tr3UYZIEfLaUJok=s16000)

타입스크립트(TypeScript) 5.3 버전에 'switch-true narrowing'이라는 기능이 추가되었는데요.

이 기능을 사용하면 복잡하게 얽힌 if/else 체인을 훨씬 선언적으로 표현해서 코드의 가독성과 타입 안전성을 크게 향상시킬 수 있습니다.

이름만 들어서는 그다지 화려하게 들리지 않을 수도 있는데요.

하지만 이 기법을 사용하면 러스트(Rust), 하스켈(Haskell), 스칼라(Scala) 같은 언어의 패턴 매칭과 아주 유사한 느낌으로 훨씬 깔끔한 제어 흐름을 작성할 수 있습니다.

이번 포스트에서는 'switch-true narrowing'이 무엇인지, 어떻게 작동하는지, 그리고 언제 if/else 체인이 감당하기 어려워질 때 이 방법을 사용해야 하는지 알아보겠습니다.


## if/else 스파게티 코드의 문제점
우리 모두 이런 식의 로직을 한 번쯤은 작성해 본 경험이 있을 텐데요.


```typescript
protected calculateSignal(result?: number | null | undefined) {
  if (result !== null && result !== undefined && result <= -100) {
    return MomentumSignal.OVERSOLD;
  } else if (result !== null && result !== undefined && result >= 100) {
    return MomentumSignal.OVERBOUGHT;
  } else {
    return MomentumSignal.UNKNOWN;
  }
}
```

이 코드는 잘 작동하긴 하지만, 반복되는 null 검사 때문에 실제 비즈니스 로직을 파악하기가 조금 번거롭거든요.

각 조건이 하나의 규칙처럼 읽히긴 하지만, 시각적으로는 중첩된 if/else 문 안에 그 구조가 묻혀버립니다.

이걸 좀 더 선언적인 방식으로 규칙의 집합처럼 표현할 수 있다면 얼마나 좋을까요?


## switch-true narrowing의 등장
타입스크립트(TypeScript) 5.3의 'switch-true narrowing'은 바로 이런 문제를 해결해 주는데요.

변수에 대해 switch를 사용하는 대신, `true`에 대해 switch를 사용하고 각 case를 조건문으로 만드는 방식입니다.


```typescript
protected calculateSignal(result?: number | null | undefined) {
  const hasResult = result !== null && result !== undefined;
  const isOversold = hasResult && result <= -100;
  const isOverbought = hasResult && result >= 100;

  switch (true) {
    case isOversold:
      return MomentumSignal.OVERSOLD;
    case isOverbought:
      return MomentumSignal.OVERBOUGHT;
    default:
      return MomentumSignal.UNKNOWN;
  }
}
```

런타임에서는 이 코드가 예상대로 정확하게 동작하는데요.

가장 먼저 `true`로 평가되는 case가 실행됩니다.

하지만 진짜 마법은 컴파일 타임에 일어나거든요.

타입스크립트가 이제 각 분기 내의 타입을 해당 조건에 따라 좁혀주게 됩니다.


## 이게 패턴 매칭일까요
정확히 말하면 그렇지는 않습니다.

러스트(Rust), 스칼라(Scala), 오캐믈(OCaml) 등에서 볼 수 있는 진정한 패턴 매칭은 데이터 구조에 따라 작동하며 종종 '완전성 검사(exhaustiveness checks)'를 강제하거든요.

타입스크립트의 switch-true narrowing은 사실상 타입 좁히기 기능이 추가된 '불리언 가드'일 뿐입니다.

모든 경우를 다루도록 강제하지도 않고, 객체를 분해해 주지도 않거든요.

그렇긴 해도, 사용 방식은 매우 유사한데요.

일련의 규칙을 나열하고, 각 규칙마다 조건과 행동을 정의하면 타입스크립트가 각 분기 내의 타입이 안전하다는 것을 보장해 줍니다.


## 작동 원리
이 패턴은 간단한 트릭에 의존하는데요.

`switch (true)`는 각 case 표현식을 불리언으로 평가하여 가장 먼저 `true`가 되는 case를 실행하는 원리입니다.


```typescript
switch (true) {
  case 5 > 3: // true, 이 코드가 실행됩니다
    console.log('Math works');
    break;
  case 10 < 2: // false, 건너뜁니다
    console.log('Never runs');
    break;
}
```

조건들을 이름 있는 불리언 변수로 추출함으로써 코드의 의도를 더욱 명확하게 만들 수 있습니다.


## 대안 ts-pattern 라이브러리
만약 진짜 패턴 매칭 문법을 원하신다면, `ts-pattern` 라이브러리가 훌륭한 대안이 될 수 있거든요.


```typescript
import { match } from 'ts-pattern';

const action = match({ canSell, hasReachedTarget, hasReachedStop })
  .with({ canSell: true, hasReachedTarget: true }, () => sellForTargetPrice())
  .with({ canSell: true, hasReachedStop: true }, () => sellForStopPrice())
  .with({ canSell: true }, () => notTakingSidewaysAction())
  .otherwise(() => notTakingAnyAction());
```

이 라이브러리를 사용하면 판별된 유니언(discriminated union)의 모든 가능한 케이스를 커버하는지 확인하는 '완전성 검사', 패턴 가드 등 훨씬 정교한 매칭 기능을 사용할 수 있는데요.

복잡한 패턴 매칭 시나리오에서는 고려해 볼 만하지만, 외부 의존성이 추가된다는 점은 감안해야 합니다.


## 미래 네이티브 패턴 매칭
현재 티씨39(TC39)에 자바스크립트에 패턴 매칭을 추가하려는 활발한 제안이 있는데요.

만약 이 제안이 통과된다면, 미래에는 다음과 같이 코드를 작성하게 될지도 모릅니다.


```javascript
const action = match (state) {
  when { canSell: true, reachedTarget: true }: sellForTargetPrice(),
  when { canSell: true, reachedStop: true }: sellForStopPrice(),
  when { canSell: true }: notTakingSidewaysAction(),
  default: notTakingAnyAction(),
};
```

그전까지는, `switch (true)` 패턴이 의존성 추가 없이 타입스크립트의 완벽한 지원을 받으면서 비슷한 이점을 누릴 수 있는 아주 훌륭한 방법입니다.

