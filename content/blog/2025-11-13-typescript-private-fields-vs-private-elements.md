---
slug: 2025-11-13-typescript-private-fields-vs-private-elements
title: "타입스크립트 private와 #, 완벽한 캡슐화를 위한 올바른 선택"
summary: "타입스크립트에서 private 키워드와 # 문법의 차이점을 알아봅니다. 컴파일 타임의 프라이버시와 런타임의 완전한 캡슐화 중 어떤 것을 선택해야 하는지, 그리고 테스트 관점에서의 장단점을 확인하세요."
date: 2025-11-13T07:38:41.584Z
draft: false
weight: 50
tags: ["타입스크립트", "private", "#", "프라이빗 필드", "프라이빗 요소", "캡슐화", "TypeScript"]
contributors: []
---

![타입스크립트 private와 #, 완벽한 캡슐화를 위한 올바른 선택](https://blogger.googleusercontent.com/img/a/AVvXsEiVtcMILEASa2SioaA3hcXZCil2ZRF8gODQmtNw5GvK8GUeVIU8I1dXoY2zPrFvJIdP1AKsLMPjGjnZX5dacpceja8rhlTopYoru2WJe_ucUCZXoTpp3Oe7YWukNK3cdy6f7AHic_fP8hD7Qx3Nhl--FK1_WyEPmJYu13gcf2pfnULzg7WRktWYBezEhLg=s16000)

타입스크립트(TypeScript)에서 비공개 필드를 선언할 때 'private' 키워드를 쓸 수도 있고, '#' 기호를 사용할 수도 있거든요.

'private' 키워드는 타입스크립트 컴파일러를 통해 디자인 타임에만 프라이버시를 강제하는 반면, '#' 문법은 런타임에도 외부 접근으로부터 보호되는 '프라이빗 요소(Private Elements)'를 만듭니다.

프라이빗 요소는 클래스 외부에서는 필드가 완벽하게 숨겨지기 때문에 훨씬 강력한 캡슐화를 제공하는데요.

타입스크립트에서 클래스를 좀 다뤄보셨다면 아마 'private' 필드를 사용해 보셨을 겁니다.

'이 클래스의 이 부분은 외부 세계를 위한 것이 아니다'라고 말하는 아주 깔끔한 방법이거든요.

다시 말해, 객체의 내부 동작은 숨기고 외부에는 정리된 인터페이스만 노출해야 한다는 객체 지향 원칙, 바로 '캡슐화'를 지원하는 기능입니다.

그런데 어느 날 '#' 기호가 앞에 붙는 새로운 문법을 마주치게 되는데요.

기술적으로는 '프라이빗 요소(Private Elements)'라고 불리는 문법입니다.

이걸 보고 '어? 이거 두 개 같은 건가? 대체 뭘 써야 하지?' 하고 궁금해하셨을 텐데요.

오늘 그 차이점을 명확하게 정리해 드리겠습니다.


## 타입스크립트 방식의 private
타입스크립트(TypeScript)는 자바스크립트(JavaScript) 자체에 진정한 의미의 프라이버시 개념이 생기기 훨씬 전부터 'private' 키워드를 도입했거든요.

이 키워드는 전적으로 타입스크립트 컴파일러에 의해서만 강제됩니다.

어떤 멤버를 'private'으로 표시하면, 개발 중에 타입스크립트가 클래스 외부에서 해당 멤버에 접근하는 것을 막아주는데요.


```typescript
class Counter {
  private count = 0;

  increment() {
    this.count++;
  }

  read() {
    return this.count;
  }
}

const c = new Counter();
c.increment();
```

하지만 런타임에서는 'private'이 단지 관례에 불과합니다.

객체의 속성으로 여전히 존재하고, 'Object.keys' 같은 리플렉션 도구는 이 속성을 목록에 그대로 보여주는데요.

여기서 캡슐화는 타입스크립트 타입 시스템 안에서는 실제 효력이 있지만, 코드가 자바스크립트로 실행되는 순간에는 완벽하지 않습니다.


```typescript
// 약간의 트릭을 사용하면 런타임에 여전히 접근 가능합니다
console.log((c as any).count);
// 또는 이렇게도 가능하죠
console.log(c['count']);
```

## 이크마스크립트의 비공개 필드
이크마스크립트(ECMAScript) 표준에서는 '#' 접두사를 사용하는 진정한 의미의 비공개 필드를 도입했는데요.

이는 타입스크립트의 'private' 접근 제어자보다 훨씬 늦은 ES2022(ES13)에서 표준화되었습니다.

타입스크립트의 컴파일 타임 검사와는 달리, '#' 필드는 자바스크립트 엔진 자체에 의해 강제되거든요.


```typescript
class Counter {
  #count = 0;

  increment() {
    this.#count++;
  }
}

const c = new Counter();
c.increment();
// 오류: "count" 속성이 존재하지 않습니다
console.log(c['count']);
```

이 필드들은 런타임 수준에서 캡슐화를 구현합니다.

필드는 숨겨진 슬롯에 저장되고 리플렉션에 나타나지 않으며, 제이슨(JSON)으로 직렬화되지도 않고, 외부에서 접근할 방법이 전혀 없는데요.

심지어 '#count'를 사용해 직접 접근하려고 해도 값을 가져올 수 없습니다.


## 테스트 관점에서의 차이
'private' 제어자를 사용하면 테스트 코드에서 필요할 경우 필드 내부를 들여다볼 수 있는데요.

'any'로 타입 캐스팅을 하거나 대괄호 표기법('instance['field']')을 사용하면 됩니다.

이게 때로는 편리하지만, 때로는 테스트 코드가 구현 세부사항에 너무 의존하게 만드는 원인이 되기도 하거든요.


```typescript
class Counter {
  private count = 0;

  increment() {
    this.count++; // 원문에서는 #count++ 였으나, 문맥상 private 필드에 대한 예시이므로 this.count++로 수정
  }
}

const c = new Counter();
c.increment();

// 'private' 제어자는 대괄호 표기법으로 접근이 가능합니다
console.log(c['count']);
```

반면, 프라이빗 요소는 클래스 외부에서 직접 접근할 수 없지만, 클래스에 '게터(getter)'를 정의해서 제어된 접근을 제공할 수는 있습니다.

이 방법을 사용하면 캡슐화를 깨지 않으면서도 비공개 상태를 안전하게 읽거나 업데이트할 수 있거든요.

예를 들면 다음과 같습니다.


```typescript
class Counter {
  #count = 0;

  get count() {
    return this.#count;
  }

  increment() {
    return this.#count++;
  }
}

const c = new Counter();
c.increment();
// 비공개 필드를 위한 'count' 게터
console.log(c.count);
```

이 패턴을 사용하면 필드를 진정한 의미의 비공개로 유지하면서도, 사용자나 테스트 코드에게 안전하고 의도된 방식으로 상호작용할 방법을 제공할 수 있습니다.


## 용어에 대한 참고사항
이크마스크립트(ECMAScript) 2022 명세에서 이 기능은 'private field'라고 불리며, 이는 자바스크립트 엔진이 런타임에 강제하는 '#field' 문법을 가리키는데요.

반면에 타입스크립트 커뮤니티에서는 'private field'라고 하면 보통 'private' 접근 제어자를 의미합니다.

이런 이유로 MDN에서는 종종 'private element'라는 용어를 사용하여, 논의의 대상이 타입스크립트의 컴파일 타임 기능인지 아니면 자바스크립트의 내장 기능인지를 명확히 구분하고 있습니다.

