---
slug: 2025-07-14-typescript-satisfies-keyword-guide
title: "TypeScript 'satisfies' 완벽 가이드 - 'as' 대신 써야 하는 이유"
date: 2025-07-12 10:41:51.454000+00:00
summary: "TypeScript의 숨겨진 보석, 'satisfies' 키워드를 아시나요? 타입 추론은 유지하면서 타입 검사는 강화하는 satisfies의 마법을 통해, 왜 'as'보다 더 안전하고 현명한 선택인지 알아봅니다."
tags: ["TypeScript", "satisfies", "타입스크립트", "as", "타입 단언", "구조적 타이핑"]
contributors: []
draft: false
---

TypeScript의 수많은 기능 중, 오늘은 조금은 덜 알려졌지만 때로는 믿을 수 없을 만큼 유용한 'satisfies' 키워드에 대해 이야기해 보려고 합니다.<br /><br />
이 기능을 제대로 다룰 줄 아는 것은 여러분의 소매 속에 숨겨둘 만한 가치 있는 비장의 무기가 될 것입니다.<br /><br />
함께 살펴볼까요.<br /><br />

## 먼저 알아야 할 것: '구조적 타이핑'<br />

'satisfies'를 이해하려면, 먼저 TypeScript가 타입을 어떻게 다루는지 알아야 합니다.<br /><br />
TypeScript는 '구조적 타이핑(structural typing)' 시스템을 따릅니다.<br /><br />
아주 간단히 말해, **TypeScript는 어떤 타입으로 선언되었는지가 아니라, 값의 '구조'나 '형태'에만 관심을 가집니다.**<br /><br />
따라서 아래 코드는 아무런 에러 없이 정상적으로 동작합니다.<br /><br />

```typescript
class Thing1 {
  name: string = "";
}

class Thing2 {
  name: string = "";
}

let thing1: Thing1 = new Thing1();
// Thing2의 '구조'가 Thing1의 구조와 동일하기 때문에 할당 가능합니다.
let thing2: Thing1 = new Thing2();
// 객체 리터럴 역시 Thing1의 구조를 만족시키므로 할당 가능합니다.
let thing3: Thing1 = { name: "" };
```

타입은 본질적으로 '계약'과 같고, TypeScript는 단지 당신이 그 계약을 원본 타입이 명시한 것을 가진 무언가로 만족시키기만 하면 신경 쓰지 않습니다.<br /><br />
흥미롭게도, 이는 타입을 만족시킬 때 관련 없는 '추가적인 속성'을 제공할 수 있다는 의미이기도 합니다.<br /><br />
아래 코드 역시 에러가 없습니다.<br /><br />

```typescript
const val = {
  name: "",
  xyz: 12,
};

// val 객체는 Thing1이 요구하는 name: string을 가지고 있으므로 통과됩니다.
let thing4: Thing1 = val;
```

`Thing1` 타입은 문자열인 `name` 속성만을 요구합니다.<br /><br />
만약 다른 속성을 추가로 지정하더라도, TypeScript는 (보통은) 괜찮다고 넘어갑니다.<br /><br />
이것이 다른 언어에서 온 개발자들에게는 놀랍게 보일 수 있지만, 완전히 타입이 없는 프로그래밍 언어인 JavaScript에 어떤 형태의 타입 안정성을 제공하는 것이 TypeScript의 주된 목적인 점을 감안하면 실용적인 절충안입니다.<br /><br />

### 예외: '잉여 속성 검사(Excess Property Checking)'<br />

제가 위에서 '보통은'이라고 말한 이유는, TypeScript가 때때로 위에서 본 것과 같은 '추가적인' 값을 허용하지 않고 조금 더 엄격하게 굴기 때문입니다.<br /><br />
특히, **객체 리터럴을 타입이 선언된 변수에 할당할 때**, TypeScript는 엄격한 일치를 요구합니다.<br /><br />

```typescript
// val은 변수에 먼저 할당되었으므로 OK
let thing4: Thing1 = val;

const val2: Thing1 = {
  name: "",
  xyz: 12,
  // 에러: Object literal may only specify known properties, and 'xyz' does not exist in type 'Thing1'
};
```

이것을 '잉여 속성 검사'라고 합니다.<br /><br />
방금 본 것처럼 타입이 선언된 변수에 객체 리터럴을 할당할 때, 그리고 타입이 선언된 함수 매개변수에 객체 리터럴을 전달할 때 발생합니다.<br /><br />

## 'satisfies'의 등장: 그래서 이게 왜 필요한가?<br />

`satisfies`의 가장 단순한 사용 예시를 보기 위해, 이 코드로 돌아가 봅시다.<br /><br />

```typescript
const val3 = {
  name: "",
  xyz: 12,
};
```

현재 `val3`는 `{ name: string; xyz: number; }` 라는 타입을 '추론(inferred)' 받습니다.<br /><br />
만약 우리가 원한다면, 이 코드를 이렇게 작성할 수도 있습니다.<br /><br />

```typescript
const val3 = {
  name: "",
  xyz: 12,
  // 에러: Object literal may only specify known properties, and 'xyz' does not exist in type 'Thing1'
} satisfies Thing1;
```

이 코드는 우리가 이전에 본 것과 동일한 에러, 즉 `val3`를 `Thing1`으로 선언했을 때와 같은 에러를 발생시켰습니다.<br /><br />

`satisfies` 키워드는 **더 넓은 타입이 추론되는 것을 방지하면서,** 특정 값이 주어진 타입을 '만족시킨다'고 단언할 수 있게 해줍니다.<br /><br />
잠깐만 기다려 주세요.<br /><br />
아마 '그냥 `Thing1` 타입을 위로 올려서 제대로 된 타입 선언으로 쓰면 되는데, 이건 완전히 쓸모없잖아!' 라고 생각하실 겁니다.<br /><br />
심지어 그렇게 하면 몇 글자 더 절약할 수도 있죠!<br /><br />
하지만 모든 상황이 이 해결책에 적합한 것은 아닙니다.<br /><br />
조금 더 복잡하고 현실적인 예시를 살펴보겠습니다.<br /><br />

## 실제 문제 상황: 오타를 잡지 못하는 TypeScript<br />

이것은 제가 실제로 겪었던 상황입니다.<br /><br />
현실적인 부분은 유지하면서 최대한 단순화해 보겠습니다.<br /><br />
우리가 재고 관리 시스템을 작성하고 있다고 상상해 봅시다.<br /><br />
`InventoryItem`이라는 타입이 있습니다.<br /><br />

```typescript
type InventoryItem = {
  sku: string;
  description: string;
  originCode?: string; // '?'는 선택적(optional) 속성을 의미합니다.
};
```

우리는 외부 백엔드 시스템에서 데이터를 가져와야 합니다.<br /><br />

```typescript
type BackendResponse = {
  item_sku: string;
  item_description: string;
  item_origin_code: string;
};

function getBackendResponse(): BackendResponse[] {
  return []; // 실제로는 데이터를 가져온다고 가정합니다.
}
```

이제 모든 것을 합쳐 봅시다.<br /><br />
외부 시스템에서 아이템을 가져와, 우리 시스템의 `InventoryItem` 타입에 맞는 구조로 조작한 다음, `insertInventoryItems` 함수를 호출합니다.<br /><br />

```typescript
function main() {
  const backendItems = getBackendResponse();
  insertInventoryItems(
    backendItems.map(item => {
      return {
        sku: item.item_sku,
        description: item.item_description,
        originCodeXXXXX: item.item_origin_code, // 어이쿠, 오타!
      };
    })
  );
}
```

안타깝게도, 이 코드에는 에러가 없습니다.<br /><br />
우리가 `originCode` 속성 이름을 완전히 잘못 입력했음에도 불구하고 말이죠.<br /><br />
잉여 속성 검사가 없는 곳에서는 TypeScript가 '추가적인' 속성을 허용한다는 것을 이미 알고 계실 겁니다.<br /><br />
하지만 실제 `originCode` 속성을 완전히 빠뜨렸는데 왜 에러가 아닌지 궁금하실 수 있습니다.<br /><br />
그 이유는 이 속성이 '선택적(optional)'이기 때문입니다!<br /><br />
이것이 바로 우리가 불필요한 잉여 속성을 허용하지 않도록 하는 것이 더욱 중요한 이유입니다.<br /><br />
아마 "잉여 속성 검사가 작동하도록 코드를 재구성하면 되지 않나?"라고 생각하실 수 있고, 물론 그렇게 할 수도 있습니다.<br /><br />

```typescript
function main() {
  const backendItems = getBackendResponse();
  insertInventoryItems(
    backendItems.map(item => {
      const result: InventoryItem = {
        sku: item.item_sku,
        description: item.item_description,
        originCodeXXXXX: item.item_origin_code,
        // 에러: ... 'originCodeXXXXX'는 'InventoryItem' 타입에 존재하지 않습니다. 'originCode'를 쓰려고 했나요?
      };
      return result;
    })
  );
}
```

이 방법은 동작하고 우리가 원하는 에러를 보여줍니다.<br /><br />
하지만 이것은 우리가 코드를 (솔직히 말해 이상하게) 작성하기로 선택한 것의 부산물일 뿐이며, 만약 누군가 와서 이 이상하고 무의미한 중간 변수 선언을 보고 "도와준답시고" 코드를 원래처럼 즉시 객체 리터럴을 반환하도록 리팩토링한다면 이 보호 장치는 사라질 것입니다.<br /><br />
더 나은 해결책은 바로 원치 않는 타입 확장을 막기 위해 `satisfies`를 사용하는 것입니다.<br /><br />
이것이 바로 `satisfies`가 존재하는 이유입니다!<br /><br />

```typescript
function main() {
  const backendItems = getBackendResponse();
  insertInventoryItems(
    backendItems.map(item => {
      return {
        sku: item.item_sku,
        description: item.item_description,
        originCodeXXXXX: item.item_origin_code,
        // 에러: ... 'originCodeXXXXX'는 'InventoryItem' 타입에 존재하지 않습니다. 'originCode'를 쓰려고 했나요?
      } satisfies InventoryItem;
    })
  );
}
```

이제 우리는 원하는 엄격한 검사를 유지하면서도, 우리가 시작했던 더 관용적인 코드로 돌아왔습니다.<br /><br />

## 'satisfies' vs 'as': 왜 'as'는 위험할까?<br />

잠깐, `as` 키워드를 사용하는 이 대안에 대해 궁금해하실 수도 있습니다.<br /><br />

```typescript
// ...
return {
  sku: item.item_sku,
  description: item.item_description,
  originCodeXXXXX: item.item_origin_code,
} as InventoryItem;
// ...
```

이 코드는 아무런 에러도 발생시키지 않습니다.<br /><br />
`as` 키워드는 '타입 캐스팅(typecast)' 혹은 '타입 단언(type assertion)'입니다.<br /><br />
이것은 피해야 할 대상입니다.<br /><br />
**`as`는 본질적으로 타입 검사기에게 "거짓말"을 할 수 있게 해주고, 특정 표현식이 주어진 타입과 일치한다고 단언하는 것입니다.**<br /><br />
이 경우, 이 객체는 `sku`와 `description`을 가지고 있으므로 이미 `InventoryItem` 타입과 일치합니다.<br /><br />
추가적인 "쓰레기"가 있지만 TypeScript는 별로 신경 쓰지 않습니다.<br /><br />
**바로 'satisfies' 키워드가 추가적으로 TypeScript에게 더 넓은 타입을 허용하지 않도록 강제하고, 그 결과 추가 속성에 대해 신경 쓰게 만드는 것입니다.**<br /><br />
완전성을 위해, 이 버전의 캐스팅 코드는 실제로 실패합니다.<br /><br />

```typescript
return {
  sku: item.item_sku,
  descriptionXXX: item.item_description, // 필수 속성 이름에 오타
  originCodeXXXXX: item.item_origin_code,
} as InventoryItem;
// 에러: 'description' 속성이 '{...}' 타입에 없지만 'InventoryItem' 타입에는 필요합니다.
```

TypeScript는 당신이 거짓말하는 것을 허용하지만, 어느 정도까지만입니다.<br /><br />
만약 캐스팅이 전혀 말이 되지 않는다면, TypeScript는 그것을 허용하지 않을 것입니다.<br /><br />
에러가 나타내듯이, 만약 어떤 이유로든 정말로 이 코드를 진행하고 싶다면, `as unknown as InventoryItem`을 사용할 수 있습니다.<br /><br />
`unknown`은 "최상위(top)" 타입이므로, 어떤 것이든 그것으로, 그리고 그것으로부터 캐스팅될 수 있기 때문입니다.<br /><br />

## 결론<br />

최상위 변수 선언이 잘 맞지 않는 상황에서, 타입이 더 넓게 추론되는 것을 방지하고 싶을 때 `satisfies`를 사용하세요.<br /><br />
이는 타입스크립트의 안정성을 최대한 활용하면서도 코드의 유연성은 잃지 않는, 아주 영리하고 실용적인 방법입니다.<br /><br />