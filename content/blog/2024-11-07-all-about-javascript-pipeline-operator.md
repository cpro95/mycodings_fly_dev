---
slug: 2024-11-07-all-about-javascript-pipeline-operator
title: JavaScript 파이프라인 연산자(|>) 완벽 가이드 - 코드 가독성과 유지보수를 높이는 비법
date: 2024-11-07 12:40:57.256000+00:00
summary: JavaScript 파이프라인 연산자(|>)를 활용하여 코드의 가독성과 유지보수성을 높이는 방법을 자세히 알아봅니다. 실용적인 예제와 함께 단계별로 설명합니다.
tags: ["javascript", "파이프라인 연산자", "코드 가독성", "유지보수", "Babel", "데이터 변환"]
contributors: []
draft: false
---

오늘은 JavaScript의 파이프라인 연산자(|>)에 대해 깊이 있게 알아보겠습니다.

이 연산자는 여러분의 코드를 더 읽기 쉽고 유지보수하기 쉽게 만들어줍니다.

## JavaScript 파이프라인 연산자 `|>`란 무엇인가?

파이프라인 연산자(`|>`)는 제안된 JavaScript 기능으로, 연산을 더 읽기 쉽게 체인으로 연결할 수 있게 해줍니다.

함수 호출을 서로 중첩시키는 대신, 왼쪽에서 오른쪽으로 순차적으로 작성할 수 있습니다.

중첩된 함수 호출은 읽기 어렵고 버그의 흔한 원인이 되기 때문에, 이 연산자는 매우 유용합니다.

예를 들어, `h(g(f(x)))` 같은 코드는 이해하기 위해 안쪽에서 바깥쪽으로 읽어야 합니다.

반면, 파이프라인 연산자를 사용하면 코드가 자연스럽게 왼쪽에서 오른쪽으로 흐르게 됩니다. 우리가 읽는 방식과 같죠.

## 파이프라인 연산자의 작동 방식

파이프라인 연산자는 왼쪽의 값을 받아서 오른쪽 함수의 첫 번째 인수로 전달합니다:

```javascript
// 기존 방식 - 중첩된 함수 호출
const result = h(g(f(x)));

// 파이프라인 연산자를 사용한 방식
const result = x |> f |> g |> h;
```

체인의 각 함수는 다음 함수가 사용할 수 있는 값을 반환해야 합니다.

만약 어떤 함수가 `undefined`를 반환하거나 에러를 던지면, 파이프라인은 거기서 멈춥니다.

## 실용적인 예시

텍스트를 처리하는 것은 여러 변환이 필요한 흔한 작업입니다.

사용자 입력을 검증하거나, CMS를 위한 콘텐츠를 정리하거나, 데이터베이스를 위한 데이터를 정규화할 때 파이프라인 연산자는 큰 도움이 됩니다:

```javascript
// 기존 방식 - 흐름을 따라가기 어려움
const cleanName = name => sanitize(trim(capitalize(name)));

// 파이프라인 방식 - 명확한 변환 단계
const cleanName = name =>
  name
  |> capitalize
  |> trim
  |> sanitize;
```

파이프라인 버전은 데이터가 각 단계에서 어떻게 변환되는지 정확히 보여줍니다.

마치 레시피를 읽는 것처럼: 이름을 받아서, 대문자로 변환하고, 공백을 제거하고, 정리합니다.

다른 개발자가 단계를 추가해야 할 경우 (예: 욕설 검증이나 길이 검증), 중첩된 함수 호출을 재구성하지 않고 파이프라인에 새로운 줄을 추가하면 됩니다.

## 현재 상태

파이프라인 연산자는 현재 Stage 2 제안 상태이며, 이는 다음을 의미합니다:

- 아직 JavaScript의 일부가 아닙니다.
- 사용하려면 Babel이 필요합니다.
- 구문이 변경될 수 있습니다.

Babel과 함께 사용하려면 다음을 추가하세요:

```javascript
['@babel/plugin-proposal-pipeline-operator', {
  proposal: 'minimal'
}]
```

## 언제 사용해야 할까?

파이프라인 연산자는 데이터 변환을 처리할 때 특히 유용합니다.

여러 단계를 거쳐 데이터를 처리해야 할 때 사용하세요.

각 단계는 하나의 주요 인수를 받아 다음 단계로 변환된 데이터를 반환합니다.

```javascript
// 여러 단계를 거쳐 주문을 처리
const processOrder = order =>
  order
  |> validateItems
  |> calculateTotal
  |> addTax
  |> formatForSaving;

// 각 함수는 집중적이고 테스트하기 쉽습니다.
const validateItems = order => {
  if (!order.items?.length) {
    throw new Error('Order must have items');
  }
  return order;
};

const calculateTotal = order => ({
  ...order,
  total: order.items.reduce((sum, item) => sum + item.price, 0)
});

const addTax = order => ({
  ...order,
  totalWithTax: order.total * 1.2  // 20% 세금
});

const formatForSaving = order => ({
  items: order.items.map(item => item.id),
  total: order.totalWithTax,
  processedAt: new Date()
});
```

이 접근 방식은 테스트를 간단하게 만듭니다.

각 함수는 독립적으로 검증할 수 있습니다.

`calculateTotal`이 올바르게 작동하는지 확인할 때 검증이나 세금 계산에 대해 걱정할 필요가 없습니다.

문제가 발생하면 데이터가 명확하고 추적 가능한 순서로 흐르기 때문에 어떤 변환이 문제를 일으켰는지 빠르게 식별할 수 있습니다.

사기 탐지 같은 새로운 단계를 추가해야 하나요? 파이프라인에 또 다른 함수를 추가하기만 하면 됩니다.

중첩된 함수 호출을 파헤칠 필요가 없습니다. 각 함수는 다른 컨텍스트에서도 재사용할 수 있는 독립적인 단위입니다.

예를 들어, `calculateTotal`은 쇼핑 카트 미리보기에도 사용할 수 있고, `formatForSaving`은 임시 주문에도 사용할 수 있습니다.

파이프라인 연산자는 코드를 더 예쁘게 만드는 것만이 아닙니다.

코드를 더 유지보수하기 쉽고, 테스트하기 쉽고, 이해하기 쉽게 만듭니다.

각 변환이 명확하고 단일 목적의 함수일 때, 신뢰할 수 있는 연산들의 도구 모음을 구축하여 다양한 방식으로 결합할 수 있습니다.

## 결론

JavaScript의 파이프라인 연산자는 코드의 가독성과 유지보수성을 크게 향상시킬 수 있는 강력한 도구입니다.

단계별로 데이터를 변환할 때, 코드의 흐름을 자연스럽게 만들어주어 버그를 줄이고 협업을 원활하게 합니다.

현재 Stage 2 제안 단계이지만, Babel을 통해 미리 사용해보는 것도 좋은 경험이 될 것입니다.

---
