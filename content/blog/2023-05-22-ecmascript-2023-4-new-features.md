---
slug: 2023-05-22-ecmascript-2023-4-new-features
title: 자바스크립트 ECMAScript 2023 버전의 4가지 새로운 특징 살펴보기
date: 2023-05-22 09:27:07.373000+00:00
summary: 자바스크립트 ECMAScript 2023 버전의 4가지 새로운 특징 살펴보기
tags: ["ECMAScript", "2023", "javascript"]
contributors: []
draft: false
---

안녕하세요?

오늘은 2023에 제정되는 ECMAScript의 4가지 주요 변화에 대해 알아보겠습니다.

## 1. 배열 뒤에서부터 찾기

기존 배열의 find(), findIndex() 메서드는 배열의 첫 번째 원소부터 찾기 시작하는데요.

이번에 추가된 findLast(), findLastIndex() 메서드는 반대로 배열의 맨 뒤 원소부터 찾기 시작합니다.

실제 코드를 볼까요?

```js
const isEven = (number) => number % 2 === 0;
const numbers = [1, 2, 3, 4];

// 첫 번째 원소에서 마지막 순서로 찾기 실행
console.log(numbers.find(isEven));
// 2
console.log(numbers.findIndex(isEven));
// 1

// 마지막 원소에서 첫 번째 원소로 역순으로 찾기 실행
console.log(numbers.findLast(isEven));
// 4
console.log(numbers.findLastIndex(isEven));
// 3
```


## 2. Hashbang 문법

ECMA2023 버전에서는 유닉스 쉘 스크립트에서 사용되는 해쉬뱅 문법이 적용되었는데요.

```bash
#!/usr/bin/env node

console.log('hi 👋');
```

이제는 시스템 단에서 NodeJS를 이용한 쉘 스크립트를 작성할 수 있지 않을까 싶습니다.

## 3. WeakMap keys에 심벌 적용 가능

자바스크립트에서는 객체와 심벌은 유니크한 게 보장되는데요, 그래서 새로 생성이 불가능합니다.

그래서 WeakMap의 keys 항목에 적용할 수 있습니다.

기존 ECMA에서는 객체만 가능했었는데요, 이제는 심벌도 적용할 수 있습니다.

```js
const weak = new WeakMap();
const key = Symbol("ref");
weak.set(key, "ECMAScript 2023");

console.log(weak.get(key));
// ECMAScript 2023
```

## 4. 배열을 복사 후 작업하는 메서드 추가

기존 reverse(), sort(), splice() 메서드는 해당 배열에 직접 수정을 가하는데요.

이번에 새로 추가된 toReversed(), toSorted(), toSpliced() 메서드는 기존 배열을 직접 수정하는 게 아니라,

새 배열로 리턴하게 됩니다. 그래서 기존 오리지널 배열은 아무런 피해를 입지 않은 상태가 되죠.

그리고 새로운 메서드인 with() 메서드를 추가했는데요.

with() 메서드는 두 개의 인자를 가지는데요.

첫 번째 인자는 위치이고, 두 번째 인자는 첫 번째 인자의 위치의 값을 두 번째 인자값으로 변경하는 메서드입니다.

with() 메서드도 기존 오리지널 배열은 안 건들고 새로운 배열을 리턴합니다.

```js
const original = [1, 2, 3, 4];
const reversed = original.toReversed();

console.log(original);
// [ 1, 2, 3, 4 ]

console.log(reversed);
// [ 4, 3, 2, 1 ]
```

```js
const original = [1, 3, 2, 4];
const sorted = original.toSorted();

console.log(original);
// [ 1, 3, 2, 4 ]

console.log(sorted);
// [ 1, 2, 3, 4 ]
```

```js
const original = [1, 4];
const spliced = original.toSpliced(1, 0, 2, 3);

console.log(original);
// [ 1, 4 ]

console.log(spliced);
// [ 1, 2, 3, 4 ]
```

```js
const original = [1, 2, 2, 4];
const withThree = original.with(2, 3);

console.log(original);
// [ 1, 2, 2, 4 ]

console.log(withThree);
// [ 1, 2, 3, 4 ]
````

지금까지 ECMAScript 2023에 추가된 4가지 새로운 기능에 대해 알아봤는데요.

여기서 제일 중요한 게 바로 4번째입니다.

기존에 sort() 메서드나 splice() 메서드를 사용했을 때 일일이 오리지널 배열을 새로운 배열로 저장하고 작업했던 게 그냥 간편하게 작업이 가능하게 되었습니다.

기존 오리지널 배열을 안 건드는 게 왜 중요하냐면 나중에 버그가 발생했을 때 대부분이 기존 오리지널 배열 관련 문제가 많았습니다.

그래서 코딩하는 우리들은 어떤 게 기존 배열을 건드리는지 메서드의 성격을 외워야 하는데요.

점점 더 ECMAScript는 Immutability 형태로 가는 거 같습니다.

Immutability는 바로 최근 고급 언어의 추세인거죠.

그럼.

