---
slug: 2025-05-01-javascript-truthy-falsy-short-circuit-evaluation-guide
title: 자바스크립트의 숨겨진 규칙 - Truthy & Falsy 완벽 정복 (단축 평가 활용법까지!)
date: 2025-05-01 07:27:25.478000+00:00
summary: 자바스크립트에는 truthy와 falsy라는 독특한 개념이 있습니다. 오늘 함께 알아볼까요?
tags: ["javascript", "자바스크립트", "truthy", "falsy", "단축 평가", "불리언 값", "조건문"]
contributors: []
draft: false
---

안녕하세요?

자바스크립트로 개발하다 보면, 조건식이나 `if` 문에서 예상과 다른 결과 때문에 당황했던 경험, 다들 한 번쯤 있지 않으신가요?

저 역시 실무를 통해 자바스크립트에는 'truthy'와 'falsy'라는 독특한 개념이 있다는 것을 처음 알게 되었답니다.

더불어, 아래와 같이 코드를 간결하게 만드는 '단축 평가(Short-circuit evaluation)'라는 유용한 테크닉도 접하게 되었는데요.

```javascript
const value = A || B;
```

이번 글에서는 자바스크립트의 기본이면서도 은근히 헷갈리는 truthy/falsy 개념을 확실히 짚어보고, 단축 평가를 어떻게 활용할 수 있는지 함께 자세히 알아볼까요?

## **1. Truthy와 Falsy, 대체 무엇일까요?**

자바스크립트에는 값이 그 자체로 참(true) 또는 거짓(false)으로 평가될 수 있는 특별한 규칙이 존재합니다. 바로 이것을 **truthy (참 같은 값)** 와 **falsy (거짓 같은 값)** 라고 부르는데요. 즉, 불리언(Boolean) 값이 아니더라도, 특정 값들은 조건문 등에서 true나 false처럼 동작한다는 의미입니다.

**falsy로 간주되는 값들**

자바스크립트에서 falsy, 즉 '거짓 같은 값'으로 취급되는 대표적인 값들은 다음과 같습니다. 이 값들을 잘 기억해두는 것이 중요한데요.

| 값             | 설명                          |
| :------------- | :---------------------------- |
| `false`        | 불리언 값 false 그 자체        |
| `0`            | 숫자 0                        |
| `''` (빈 문자열) | 내용이 없는 빈 문자열         |
| `null`         | '값이 없음'을 의도적으로 명시 |
| `undefined`    | 값이 할당되지 않은 상태       |
| `NaN`          | Not a Number (숫자가 아님)    |

위에 명시된 값들을 제외한 대부분의 값은 기본적으로 **truthy (참 같은 값)** 로 간주된답니다. 예를 들어 빈 배열 `[]`이나 빈 객체 `{}`도 truthy 값이라는 점, 기억해두면 좋습니다.

**실제 코드 예시**

```javascript
// 숫자 0은 falsy 값이므로, 이 if 블록은 실행되지 않습니다.
if (0) {
  console.log("This line will not be executed");
}

// "hello" 문자열은 truthy 값이므로, 이 if 블록이 실행됩니다.
if ("hello") {
  console.log("This line will be executed");
}
```

## **2. Truthy/Falsy 활용법 ①: 삼항 연산자**

가장 흔하게 truthy/falsy 개념이 활용되는 곳 중 하나가 바로 삼항 연산자입니다.

```javascript
const value = isExist ? 'a' : 'b';
```

위 코드에서 `isExist`의 값이 무엇이냐에 따라 결과가 달라지는데요.

*   `isExist`가 **truthy** 값이면 `value`에는 `'a'`가 할당됩니다.
*   `isExist`가 **falsy** 값이면 `value`에는 `'b'`가 할당됩니다.

여기서 핵심은 조건이 단순히 `true` 또는 `false`인지가 아니라, **'truthy'인지 'falsy'인지**에 따라 결정된다는 점입니다. 이 미묘한 차이가 예상치 못한 버그를 만들기도 한답니다.

## **3. Truthy/Falsy 활용법 ②: 단축 평가 (OR 연산자 ||)**

자바스크립트의 OR 연산자 (`||`)는 왼쪽 피연산자의 값에 따라 동작이 달라지는 '단축 평가' 특성을 가집니다.

```javascript
const value = A || B;
```

**동작 방식 상세 설명**

1.  먼저 표현식 `A`를 평가합니다.
2.  만약 `A`가 **truthy** 값이라면, 거기서 평가를 멈추고 `A`의 값을 `value`에 즉시 할당합니다. (B는 아예 평가되지 않습니다!)
3.  만약 `A`가 **falsy** 값이라면, 그제야 표현식 `B`를 평가하고 그 결과를 `value`에 할당합니다.

**구체적인 예시 표**

| A 값      | B 값      | `value` 결과 | 설명                               |
| :-------- | :-------- | :----------- | :--------------------------------- |
| `"Hello"` | `"Guest"` | `"Hello"`    | A가 truthy이므로 A 값을 반환       |
| `""`      | `"Guest"` | `"Guest"`    | A가 falsy이므로 B 값을 반환        |
| `0`       | `100`     | `100`        | A(0)가 falsy이므로 B 값을 반환     |
| `null`    | `"N/A"`   | `"N/A"`      | A(null)가 falsy이므로 B 값을 반환    |
| `[]`      | `false`   | `[]`         | A(빈 배열)가 truthy이므로 A 값을 반환 |

**실용적인 활용 예시**

이 단축 평가는 변수에 기본값을 설정할 때 아주 유용하게 사용될 수 있습니다.

```javascript
// inputName이 falsy(null, undefined, 빈 문자열 등)하면 'Guest'를,
// truthy(예: 'Alice')하면 그 값을 그대로 userName에 할당합니다.
const userName = inputName || 'Guest';
```

예를 들어, API 응답 값이나 사용자 입력 값이 `null`, `undefined`, 빈 문자열 등 '값이 없는 상태'로 간주될 수 있는 경우, `||` 연산자를 사용하면 아주 간결하게 기본값을 지정해 줄 수 있어 편리합니다.

## **4. 타입스크립트에서도 Truthy/Falsy가 적용될까요?**

지금까지 자바스크립트에서의 truthy/falsy 개념을 살펴보았는데요. 그렇다면 정적 타입을 지원하는 타입스크립트(TypeScript)에서는 어떨까요?

결론부터 말하자면, 타입스크립트는 컴파일 시점에 타입 오류를 잡아주어 안정성을 높여주지만, **런타임(실행 시점)에서의 조건 평가는 자바스크립트와 동일하게 truthy/falsy 규칙을 따릅니다.**

즉, 타입스크립트에서 사용하는

*   삼항 연산자 (`? :`)
*   `if` 문

등의 조건 판단 로직은 단순히 `true`/`false` 값뿐만 아니라, 여전히 **truthy/falsy 값에 기반하여 동작**한다는 것입니다.

**타입스크립트 예시 ①: boolean 타입**

```typescript
const isExist: boolean = true;
const value = isExist ? 'a' : 'b';
console.log(value); // Output: a
```

이 경우, `isExist` 변수는 `boolean` 타입으로 명확히 선언되었기 때문에 `true` 또는 `false` 값만 가질 수 있습니다. 따라서 우리가 직관적으로 예상하는 대로 동작합니다.

**타입스크립트 예시 ②: 유니언 타입 (string | undefined)**

하지만 타입스크립트에서 여러 타입을 허용하는 유니언(union) 타입을 사용하면, 자바스크립트의 truthy/falsy 동작 방식이 그대로 나타납니다.

```typescript
// 사용자 이름을 가져오는 함수 (string 또는 undefined 반환 가정)
declare function getUserName(): string | undefined;

const inputName: string | undefined = getUserName();

// inputName이 truthy한 문자열이면 inputName을, falsy(undefined 등)면 'Guest'를 사용
const userName = inputName ? inputName : 'Guest';
```

여기서도 `inputName` 변수의 타입이 `string | undefined`로 지정되어 있더라도, 실제 실행 시점에서는 `inputName`의 값이 truthy인지 falsy인지에 따라 `userName`에 할당되는 값이 결정됩니다. 타입 정의와 런타임 동작은 별개라는 것을 알 수 있습니다.

## **5. 타입스크립트 사용 시 주의할 점: 0과 빈 문자열 함정**

타입 주석이 있더라도 truthy/falsy 규칙 때문에 의도치 않은 결과가 발생할 수 있으니 주의해야 합니다. 특히 숫자 `0`이나 빈 문자열 `''`을 다룰 때 그런데요.

```typescript
const count: number = 0;

// 0은 falsy 값이므로, || 연산자는 오른쪽 값인 10을 반환합니다.
const result = count || 10;
console.log(result); // Output: 10
```

만약 `count`가 `0`인 경우에도 `0`이라는 값 자체를 유효하게 사용하고 싶다면, `||` 연산자는 적합하지 않습니다. `0`이 falsy로 평가되어 의도치 않게 기본값 `10`이 할당되기 때문입니다.

이런 상황에서는 **널 병합 연산자(Nullish Coalescing Operator) `??`** 를 사용하는 것이 훨씬 안전합니다.

```typescript
const count: number = 0;

// ?? 연산자는 왼쪽 값이 null 또는 undefined일 때만 오른쪽 값을 반환합니다.
// 0은 null이나 undefined가 아니므로, count 값인 0이 그대로 사용됩니다.
const result = count ?? 10;
console.log(result); // Output: 0
```

`??` 연산자는 왼쪽 피연산자가 `null` 또는 `undefined`라는 명확한 '값이 없음' 상태일 때만 오른쪽 피연산자를 반환합니다. 숫자 `0`이나 빈 문자열 `''`은 `null`이나 `undefined`가 아니므로, 이들을 유효한 값으로 취급하고 싶을 때 `??`를 사용하는 것이 좋습니다.

**정리하며**

| 구분           | 자바스크립트 (JavaScript)                         | 타입스크립트 (TypeScript)                                |
| :------------- | :------------------------------------------------ | :------------------------------------------------------- |
| **조건 판별**  | Truthy/Falsy 기반                                 | Truthy/Falsy 기반 (타입 검사로 안정성 향상)              |
| **타입 시스템** | 동적 타입 (런타임에 타입 결정)                    | 정적 타입 (컴파일 시점에 타입 검사)                      |
| **주요 특징**  | 0, '' 등도 falsy로 취급됨                         | 타입 덕분에 의도치 않은 값 방지 용이. 단, 런타임 판별은 동일 |
| **주의점**     | `||` 사용 시 0, '' 등 falsy 값에 의한 오동작 주의 | `??` 연산자를 활용하여 `null`, `undefined`만 필터링 권장   |

## **마무리하며**

자바스크립트나 타입스크립트로 조건문을 다룰 때는, 단순히 `true`나 `false` 값뿐만 아니라, 어떤 값들이 'truthy' 또는 'falsy'로 평가되는지를 이해하는 것이 매우 중요합니다.

특히 타입스크립트의 강력한 타입 시스템의 도움을 받더라도, 실제 코드가 실행될 때는 결국 자바스크립트의 truthy/falsy 규칙에 따라 동작한다는 점을 잊지 말아야 합니다.

타입만 믿고 있다가는 예상치 못한 버그를 만날 수도 있답니다.

저 역시 처음 이 개념들을 접했을 때 혼란스러웠던 기억이 있는데요.

이 글이 자바스크립트와 타입스크립트의 조건 평가 방식을 이해하는 데 조금이나마 도움이 되었기를 바랍니다.

---