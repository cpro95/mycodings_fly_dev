---
slug: 2025-04-27-typescript-exhaustiveness-check-with-satisfies-operator
title: 이제 never 대신 satisfies - 더 간결한 TypeScript 완전성 검사 방법
date: 2025-04-27 11:43:16.181000+00:00
summary: TypeScript에서 완전성 검사를 수행하는 전통적인 방법과, TypeScript 4.9 버전부터 도입된 `satisfies` 연산자를 활용하여 이를 더욱 간결하고 효과적으로 개선하는 방법을 알아보겠습니다.
tags: ["typescript", "exhaustiveness check", "완전성 검사", "satisfies", "never", "타입스크립트"]
contributors: []
draft: false
---

안녕하세요!

TypeScript 개발자 여러분. TypeScript의 강력한 타입 시스템은 개발 과정에서 수많은 오류를 미리 방지해주는데요.

하지만 유니온(Union) 타입이나 열거형(Enum)처럼 타입이 확장될 가능성이 있는 경우, 모든 케이스를 빠짐없이 처리했는지 확인하는 것은 여전히 중요한 과제입니다.

바로 여기서 **완전성 검사(Exhaustiveness Check)** 의 중요성이 부각되는데요.

오늘은 TypeScript에서 완전성 검사를 수행하는 전통적인 방법과, TypeScript 4.9 버전부터 도입된 `satisfies` 연산자를 활용하여 이를 더욱 간결하고 효과적으로 개선하는 방법을 알아보겠습니다.

## **1. 완전성 검사, 왜 필요할까요?**

애플리케이션을 개발하다 보면, 특정 상태나 타입을 나타내기 위해 유니온 타입이나 열거형을 자주 사용합니다.

예를 들어, 사용자의 액션 타입을 다음과 같이 정의할 수 있는데요.

```typescript
type UserAction = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';
```

이 `UserAction` 타입에 따라 다른 로직을 처리하는 함수를 `switch` 문으로 작성한다고 가정해 봅시다.

```typescript
function handleAction(action: UserAction): void {
  switch (action) {
    case 'CREATE':
      console.log('Creating resource...');
      break;
    case 'READ':
      console.log('Reading resource...');
      break;
    case 'UPDATE':
      console.log('Updating resource...');
      break;
    case 'DELETE':
      console.log('Deleting resource...');
      break;
    // 모든 케이스를 처리했습니다!
  }
}
```

지금 당장은 문제가 없어 보입니다. 하지만 시간이 흘러 애플리케이션 요구사항이 변경되어 새로운 액션 타입,

예를 들어 `'ARCHIVE'` 가 `UserAction`에 추가된다면 어떻게 될까요?

```typescript
type UserAction = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'ARCHIVE'; // 'ARCHIVE' 추가!
```

만약 `handleAction` 함수의 `switch` 문을 수정하는 것을 잊는다면,

`'ARCHIVE'` 액션이 들어왔을 때 아무런 처리도 하지 않고 함수가 종료되는 잠재적인 버그가 발생할 수 있습니다.

TypeScript의 타입 검사기는 기본적으로 `switch` 문이 모든 케이스를 다루는지 강제하지 않기 때문인데요.

이런 상황을 방지하기 위해,

즉 **유니온이나 열거형의 모든 멤버가 코드에서 명시적으로 처리되었음을 컴파일 시점에 보장**받기 위해 완전성 검사가 필요합니다.

## **2. 전통적인 완전성 검사 방법: `never` 타입 활용**

오랫동안 TypeScript 커뮤니티에서 사용되어 온 완전성 검사 방법은 `never` 타입을 활용하는 것입니다.

`never` 타입은 이론적으로 도달할 수 없는 코드 경로를 나타내는 특별한 타입인데요.

이를 `switch` 문의 `default` 절과 결합하여 사용합니다.

```typescript
function handleActionWithNever(action: UserAction): void {
  switch (action) {
    case 'CREATE':
      console.log('Creating resource...');
      break;
    case 'READ':
      console.log('Reading resource...');
      break;
    case 'UPDATE':
      console.log('Updating resource...');
      break;
    case 'DELETE':
      console.log('Deleting resource...');
      break;
    // 'ARCHIVE' 케이스 처리를 잊었다고 가정합니다.
    default:
      // 모든 예상 케이스를 처리했다면 이 코드는 도달 불가능해야 합니다.
      // 따라서 action 변수는 이론적으로 never 타입이어야 합니다.
      const _exhaustiveCheck: never = action; // (1) 컴파일 타임 체크
      // 만약 'ARCHIVE'가 들어오면 action은 'ARCHIVE' 타입이므로,
      // never 타입 변수에 할당할 수 없어 컴파일 에러가 발생합니다!

      // 런타임 안전성을 위해 에러를 던지는 것도 좋은 습관입니다.
      throw new Error(`Unhandled action: ${_exhaustiveCheck}`); // (2) 런타임 방어
  }
}
```

위 코드의 `default` 절에서 (1)번 라인이 핵심입니다. 만약 우리가 `case 'ARCHIVE'` 를 추가하는 것을 잊는다면,

`'ARCHIVE'` 값이 `action`으로 들어왔을 때 `default` 절이 실행됩니다.

이때 `action` 변수의 타입은 `'ARCHIVE'` 이지만, 우리는 이 변수를 `never` 타입으로 선언된 `_exhaustiveCheck`에 할당하려고 시도합니다.

`'ARCHIVE'` 타입은 `never` 타입에 할당될 수 없으므로, TypeScript 컴파일러는 여기서 타입 에러를 발생시킵니다.

덕분에 우리는 처리하지 않은 케이스가 있음을 즉시 인지하고 코드를 수정할 수 있습니다.

(2)번 라인처럼 `throw new Error`를 추가하면, 혹시 모를 런타임 상황(예: 타입 정의와 다른 값이 외부 API 등을 통해 들어오는 경우)에서도 예상치 못한 값이 처리되지 않고 에러를 발생시켜 문제를 조기에 발견하도록 돕습니다.

이 `never` 타입을 이용한 방식은 매우 효과적이며 오랫동안 표준처럼 사용되어 왔습니다.

하지만 `default` 절에 항상 상용구(boilerplate) 코드를 추가해야 하는 약간의 번거로움이 있었습니다.

## **3. 더 간결한 방법: `satisfies` 연산자의 등장**

TypeScript 4.9에서 도입된 `satisfies` 연산자는 변수의 타입을 바꾸지 않으면서 **특정 타입의 요구사항을 만족하는지 검사**할 수 있게 해주는 강력한 도구입니다.

이 `satisfies` 연산자를 `never` 타입과 조합하면, 기존의 완전성 검사를 훨씬 간결하게 표현할 수 있습니다.

어떻게 사용하는지 바로 코드로 확인해 볼까요?

```typescript
function handleActionWithSatisfies(action: UserAction): void {
  switch (action) {
    case 'CREATE':
      console.log('Creating resource...');
      break;
    case 'READ':
      console.log('Reading resource...');
      break;
    case 'UPDATE':
      console.log('Updating resource...');
      break;
    case 'DELETE':
      console.log('Deleting resource...');
      break;
    // 여전히 'ARCHIVE' 케이스 처리를 잊었다고 가정합니다.
    default:
      // (3) satisfies never 를 사용하여 한 줄로 검사 및 에러 처리!
      // action 변수가 모든 케이스에서 처리되었다면, default에 도달했을 땐
      // 이론적으로 never 타입이어야 합니다.
      // 만약 'ARCHIVE' 타입이 들어오면 'ARCHIVE' satisfies never 는 false가 되어
      // 타입 에러를 발생시킵니다.
      throw new Error(`Unhandled action: ${action satisfies never}`);
  }
}
```

놀랍지 않습니까?

기존 방식에서 `const _exhaustiveCheck: never = action;` 라인과 `throw new Error(...)` 라인으로 나누어 처리했던 것을,

(3)번 라인처럼 단 한 줄로 통합했습니다!

`action satisfies never` 부분은 컴파일 시점에 다음과 같이 동작합니다.

*   만약 `switch` 문의 `case`들이 `UserAction`의 모든 멤버를 처리했다면, `default` 절은 이론적으로 도달 불가능하므로 `action`의 타입은 `never`로 간주됩니다. `never satisfies never`는 참이므로 타입 에러가 발생하지 않습니다.
*   만약 `'ARCHIVE'` 케이스 처리를 잊었다면, `default` 절에서 `action`의 타입은 `'ARCHIVE'`가 됩니다. `'ARCHIVE' satisfies never`는 거짓(타입 불일치)이므로, TypeScript 컴파일러는 여기서 타입 에러를 발생시킵니다. "Argument of type 'string' is not assignable to parameter of type 'never'." 와 유사한 에러 메시지를 보게 될 것입니다.

결과적으로, **기존 `never` 할당 방식과 동일한 컴파일 타임 완전성 검사 효과**를 더 적은 코드로 달성할 수 있습니다. 동시에 `throw new Error` 구문은 그대로 유지되므로, **런타임 안전성 역시 확보**됩니다. (`satisfies` 연산자 자체는 컴파일 시점에만 사용되고 런타임 코드에는 영향을 주지 않습니다.)

## **4.`satisfies`로 더 나은 TypeScript 코드를!**

TypeScript의 `satisfies` 연산자는 완전성 검사를 더욱 간결하고 우아하게 만들어주는 훌륭한 도구입니다.

기존의 `never` 타입을 활용한 방식도 여전히 유효하지만, `satisfies never`를 사용하면 다음과 같은 이점을 얻을 수 있습니다.

*   **간결성:** 임시 변수 선언 없이 한 줄로 완전성 검사와 에러 메시지 생성이 가능합니다.
*   **가독성:** 코드의 의도(`action`이 `never`여야 함을 만족하는지 검사)가 더 명확하게 드러날 수 있습니다.
*   **동일한 안정성:** 기존 방식과 동일한 컴파일 타임 및 런타임 안전성을 제공합니다.

물론 새로운 문법에 익숙해지는 데는 약간의 시간이 필요할 수 있습니다.

하지만 `satisfies` 연산자가 제공하는 명확성과 간결함은 충분히 그럴 만한 가치가 있습니다.

앞으로 TypeScript 프로젝트에서 유니온 타입이나 열거형을 다룰 때, `satisfies never`를 활용하여 더욱 견고하고 읽기 좋은 코드를 작성해 보시는 것은 어떨까요?
