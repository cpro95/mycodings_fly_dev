---
slug: 2025-08-16-typescript-enum-alternatives-deep-dive
title: TypeScript enum, 아직도 쓰고 계신가요?
date: 2025-08-17 05:32:23+00:00
summary: TypeScript 개발자라면 누구나 한번쯤 써봤을 enum. 하지만 왜 많은 전문가들이 enum 사용을 망설이는 걸까요? enum의 숨겨진 문제점부터 가장 확실한 대안인 Object as const 패턴까지, 이제는 알아야 할 모든 것을 알려드립니다.
tags: ["TypeScript", "enum", "as const", "Union Types", "타입스크립트", "코딩 컨벤션"]
contributors: []
draft: false
---

TypeScript로 개발하다 보면 '상수'를 관리해야 할 때가 정말 많은데요.<br /><br />
그럴 때 우리에게 가장 익숙한 선택지는 바로 'enum'이죠.<br /><br />
그런데 커뮤니티를 둘러보면 은근히 `enum` 사용을 권장하지 않는다는 의견이 꽤 많거든요.<br /><br />
분명 편해서 잘 쓰고 있었는데, 도대체 왜 다들 `enum`을 피하라고 하는 걸까요?<br /><br />
오늘은 `enum`의 장점부터 시작해서 그 이면에 숨어있는 함정들, 그리고 요즘 개발자들이 `enum` 대신 무엇을 사용하는지 그 대안까지 속 시원하게 파헤쳐 보겠습니다.<br /><br />

## 우리가 enum을 사랑했던 이유

먼저 `enum`이 왜 그렇게 매력적이었는지부터 짚고 넘어가야 하는데요.<br /><br />
`enum`은 서로 관련된 상수들을 하나의 이름 아래 깔끔하게 묶어주는 아주 훌륭한 방법이죠.<br /><br />
예를 들어, 함수의 동작 모드를 숫자로 제어해야 하는 상황을 한번 생각해 볼까요?<br /><br />
```typescript
// 어떤 모드인지 숫자만 봐서는 알기 어렵다.
connect(1);
```

이 코드에서 숫자 '1'이 도대체 뭘 의미하는지 바로 알기 어렵거든요.<br /><br />
이런 걸 바로 '매직 넘버'라고 부릅니다.<br /><br />
이럴 때 `enum`을 사용하면 코드의 가독성이 마법처럼 좋아지는데요.<br /><br />
```typescript
enum Mode {
  Auto, // 0
  UDP,  // 1
  TCP,  // 2
}

connect(Mode.UDP); // 아, UDP 모드로 연결하는구나!
```

이제 누가 봐도 'UDP' 모드로 연결한다는 것을 명확히 알 수 있게 됐죠.<br /><br />
문자열 상수를 다룰 때도 마찬가지인데요.<br /><br />
오타 하나 때문에 프로그램 전체가 오작동하는 끔찍한 상황을 막아줍니다.<br /><br />
```typescript
enum Mode {
  Auto = 'Auto',
  UDP = 'UDP',
  TCP = 'TCP',
}

// 자동완성도 지원되고, 오타가 나면 컴파일러가 바로 알려준다.
connect(Mode.Auto);
```

게다가 `enum`은 타입으로도 사용할 수 있어서, 정해진 값 이외의 다른 값이 들어오는 걸 원천적으로 차단해주거든요.<br /><br />
이건 정말 강력한 장점입니다.<br /><br />

## 그런데 왜 enum을 쓰지 말라고 할까?

이렇게나 유용한 `enum`인데, 어째서 논란의 중심에 서게 된 걸까요?<br /><br />
여기에는 몇 가지 아주 중요한 이유들이 있습니다.<br /><br />

### 1. TypeScript만의 외로운 표준

가장 근본적인 비판은 `enum`이 JavaScript 표준이 아닌, TypeScript에만 있는 독자적인 문법이라는 점인데요.<br /><br />
TypeScript는 기본적으로 JavaScript의 상위 집합(Superset)이라서, 타입 관련 코드를 제외하면 대부분이 일반 JavaScript로 변환되거든요.<br /><br />
하지만 `enum`은 컴파일하고 나면 아주 기묘한 형태의 JavaScript 코드로 바뀌게 됩니다.<br /><br />
```typescript
// TypeScript 코드
enum Mode {
  Auto,
  UDP,
  TCP,
}
console.log(Mode.Auto);
```

이 간단한 `enum` 코드가 컴파일되면 아래처럼 복잡한 즉시실행함수(IIFE)로 변하는데요.<br /><br />
```javascript
// 컴파일된 JavaScript 코드
var Mode;
(function (Mode) {
    Mode[Mode["Auto"] = 0] = "Auto";
    Mode[Mode["UDP"] = 1] = "UDP";
    Mode[Mode["TCP"] = 2] = "TCP";
})(Mode || (Mode = {}));
console.log(Mode.Auto);
```

이런 코드는 우리 눈에만 이상한 게 아니라, 코드를 최적화하는 '번들러'에게도 혼란을 주죠.<br /><br />

### 2. Tree-Shaking의 함정


바로 위에서 본 복잡한 코드 때문에 발생하는 심각한 문제가 바로 'Tree-Shaking'이 제대로 동작하지 않는다는 건데요.<br /><br />
Tree-Shaking은 우리가 실제로 사용하지 않는 코드를 빌드 결과물에서 제거해 파일 크기를 줄여주는 아주 중요한 최적화 기술이거든요.<br /><br />
하지만 번들러는 `enum`이 변환된 저 즉시실행함수 코드에 어떤 '사이드 이펙트'가 있을지 예측할 수 없기 때문에, 설령 `enum`의 어떤 멤버도 사용하지 않더라도 저 코드를 감히 지우지 못합니다.<br /><br />
결국 쓰지도 않는 코드가 최종 번들에 포함되어 애플리케이션의 용량을 불필요하게 차지하게 되는 거죠.<br /><br />

### 3. 구원투수라 믿었던 const enum의 배신
<br />

TypeScript 팀도 이 문제를 모르는 건 아니어서, 'const enum'이라는 해결책을 내놓았는데요.<br /><br />
`const enum`은 컴파일 시점에 `enum`을 사용한 부분을 실제 값으로 완전히 대체해버립니다.<br /><br />
```typescript
const enum Mode {
  Auto,
  UDP,
  TCP,
}
console.log(Mode.Auto);

// 컴파일 후
console.log(0 /* Mode.Auto */);
```

이렇게 하면 런타임에 `enum` 객체 자체가 남지 않으니 Tree-Shaking 문제는 완벽하게 해결되죠.<br /><br />
하지만 이건 더 위험한 '시한폭탄'을 품고 있었는데요.<br /><br />
`const enum`의 값은 빌드 시점에 사용되는 파일에 '박제'되어 버립니다.<br /><br />
만약 `enum`이 정의된 파일(`constants.ts`)과 그걸 가져다 쓰는 파일(`main.ts`)이 따로 있을 때, `constants.ts`의 `enum` 값만 바꾸고 전체 재빌드를 하지 않으면 어떻게 될까요?<br /><br />
`main.ts` 파일은 변경 사항을 감지하지 못해 재컴파일되지 않고, 결국 예전 값을 그대로 품은 채로 남아있게 됩니다.<br /><br />
이건 정말 잡기 힘든 버그로 이어질 수 있어서, 라이브러리나 모노레포 환경에서는 절대 사용하면 안 되는 옵션이죠.<br /><br />

## enum 없는 세상, 더 나은 대안들

그럼 `enum`을 쓰지 않는다면, 우리는 무엇을 사용해야 할까요?<br /><br />
다행히도 우리에겐 훨씬 더 안전하고 현대적인 대안들이 있습니다.<br /><br />

### 1. 단순하고 확실한 Union Types


가장 간단한 방법은 그냥 `const`로 상수를 선언하고, 이들의 타입을 묶어 'Union Type'으로 만드는 건데요.<br /><br />
```typescript
const MODE_AUTO = 'Auto';
const MODE_UDP = 'UDP';
const MODE_TCP = 'TCP';

type Mode = typeof MODE_AUTO | typeof MODE_UDP | typeof MODE_TCP;
// 결과: type Mode = "Auto" | "UDP" | "TCP"

function connect(mode: Mode) {
  // ...
}
```

이 방식은 추가적인 JavaScript 코드를 전혀 생성하지 않고, 순수하게 타입 검사만으로 동작하죠.<br /><br />
Tree-Shaking에도 아무런 문제가 없습니다.<br /><br />
다만 상수들이 여기저기 흩어질 수 있고, `enum`처럼 하나의 객체로 묶어서 관리하기는 어렵다는 소소한 단점이 있긴 하죠.<br /><br />

### 2. 현존 최강의 대안, Object as const


바로 위 유니언 타입의 단점까지 보완하는, 현재 가장 많은 개발자들이 추천하는 방법이 바로 '`as const`'를 활용한 객체 리터럴인데요.<br /><br />
이건 정말 `enum`의 장점과 유니언 타입의 장점을 모두 합친 것과 같습니다.<br /><br />
```typescript
const Mode = {
  Auto: 'Auto',
  UDP: 'UDP',
  TCP: 'TCP',
} as const;
```
<br />
객체 뒤에 `as const`를 붙여주면, 이 객체의 모든 속성이 `readonly`가 되고, 값들이 리터럴 타입으로 추론되거든요.<br /><br />
이제 이 객체를 이용해서 `enum`처럼 값에 접근할 수도 있고, 유니언 타입도 손쉽게 만들어낼 수 있습니다.<br /><br />
```typescript
// 값들의 유니언 타입 만들기
type Mode = typeof Mode[keyof typeof Mode];
// 결과: type Mode = "Auto" | "UDP" | "TCP"

function connect(mode: Mode) {
  console.log(`Connecting with mode: ${mode}`);
}

// enum처럼 점(.)으로 접근하여 사용
connect(Mode.TCP); // "Connecting with mode: TCP"
```

이 방식은 `enum`처럼 상수를 깔끔하게 그룹화해주면서도, 컴파일 시점에 아무런 추가 코드도 만들지 않죠.<br /><br />
그야말로 완벽한 대안이라고 할 수 있습니다.<br /><br />

## 최종 가이드 그래서 뭘 써야 할까?


지금까지 `enum`의 명과 암, 그리고 대안까지 모두 살펴봤는데요.<br /><br />
그럼 우리 프로젝트에서는 어떤 전략을 취해야 할까요?<br /><br />
명확한 가이드라인을 제시해 드릴게요.<br /><br />
1.  **새로운 프로젝트를 시작한다면?**<br />
    망설일 필요 없이 'Object `as const`' 패턴을 기본으로 사용하세요.<br /><br />
    가장 안전하고, 유연하며, 성능적으로도 유리한 현대적인 방식입니다.<br /><br />
2.  **`enum`이 이미 많이 사용된 레거시 프로젝트를 유지보수한다면?**<br />
    굳이 모든 `enum`을 지금 당장 바꿀 필요는 없습니다.<br /><br />
    다만, 새로 작성하는 코드에서는 `as const` 패턴을 적용하고, `enum`과 관련된 버그가 발생하거나 리팩토링 기회가 생길 때마다 점진적으로 전환하는 것을 추천합니다.<br /><br />
3.  **`const enum`은?**<br />
    그냥 잊어버리세요.<br /><br />
    어떤 상황에서도 사용을 권장하지 않습니다.<br /><br />

결국 기술의 발전은 더 나은 패턴을 만들어내기 마련인데요.<br /><br />
`enum`은 TypeScript 초창기에 아주 훌륭한 역할을 했지만, 이제는 'Object `as const`'라는 더 안전하고 세련된 후배에게 자리를 물려줄 때가 온 것 같습니다.<br /><br />
여러분의 코드베이스를 한 단계 더 업그레이드할 준비, 되셨나요?<br /><br />
