---
slug: 2023-02-05-shorten-long-numbers-in-javascript-using-numberformat
title: 자바스크립트에서 큰 숫자를 유튜브 조회수처럼 짧게 줄여 보기
date: 2023-02-05 02:41:33.767000+00:00
summary: javascript Intl.NumberFormat을 사용한 방법과 직접 구현하는 방법
tags: ["javascript", "NumberFormat", "long number"]
contributors: []
draft: false
---

안녕하세요?

오늘은 유튜브 조회수처럼 큰 숫자를 줄여서 표현해 주는 자바스크립트 코드에 대해 알아보겠습니다.

먼저, 여러 가지 방법이 있겠지만 최근 ECMAScript 표준에 포함된 Intl 객체를 쓰면 됩니다.

Intl 객체는 세계화를 위한 다양한 포맷 규격이 있는데요.

숫자 관련해서는 NumberFormat 메써드가 있습니다.

예를 들어 보면 쉽게 이해할 수 있습니다.

```js
new Intl.NumberFormat('ko-KR', {
  notation: 'compact',
  maximumFractionDigits: 1,
}).format(1748293952)

// '17.5억'

new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
}).format(1748293952)

// '1.7B'
```

NumberFormat은 첫 번째 locale 인자와 두 번째 options 인자를 받는데요.

두 번째 options 인자에 notation 항목을 'compact'로 넣는 게 핵심입니다.

maximumFractionDigits는 소수 몇째 자리까지 표현해 줄지 결정하는 옵션입니다.

---

## 예전 브라우저를 지원해야 한다면 직접 만들어야겠죠?

아직 국내에는 Internet Explorer의 망령이 남아있는데요.

이를 위해 직접 관련 코드를 만들어야 합니다.

먼저, 한국에서 쓰는 천, 만, 억, 조에 대한 단위입니다.

```js
const formatLargeNumber = n => {
  if (n < 1e3) return n
  if (n >= 1e3 && n < 1e4) return +(n / 1e3).toFixed(1) + '천'
  if (n >= 1e4 && n < 1e8) return +(n / 1e4).toFixed(1) + '만'
  if (n >= 1e8 && n < 1e12) return +(n / 1e8).toFixed(1) + '억'
  if (n >= 1e12) return +(n / 1e12).toFixed(1) + '조'
}

console.log(formatLargeNumber(123456789))

// '1.2억'
```

미국식으로 K, M, B로 표현한 수식은 아래와 같습니다.

```js
const formatLargeNumber = n => {
  if (n < 1e3) return n
  if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + 'K'
  if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + 'M'
  if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + 'B'
  if (n >= 1e12) return +(n / 1e12).toFixed(1) + 'T'
}

console.log(formatLargeNumber(123456789))

// 123.5M
```

위에서 만든 코드는 마이너스 숫자일 경우 크고 작음을 비교하는 if 문에서 정반대의 결과가 나오는데요.

그래서 마이너스 숫자일 경우에는 아래와 같이 하면 됩니다.

```js
let format
const number = -1235000

if (number < 0) {
  format = '-' + formatLargeNumber(-1 * number)
} else {
  format = formatLargeNumber(number)
}

// '-1.2M'
```

위와 같은 코드는 Math 함수 하나 사용하지 않고 만들 수 있는 간단한 코드이니까 꼭 사용해 보길 바랍니다.

그럼.
