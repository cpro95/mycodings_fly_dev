---
slug: 2025-07-09-the-future-of-javascript-a-deep-dive-into-latest-tc-39-updates
title: 자바스크립트의 미래가 도착했습니다 - TC39 최신 업데이트 완벽 해부
date: 2025-07-09 12:39:02.196000+00:00
summary: 자바스크립트 표준 위원회 TC39의 최신 업데이트를 소개합니다. Promise.withResolvers, Array.fromAsync, RegExp v 플래그, Temporal API의 모든 것을 알아봅니다.
tags: ["Javascript", "javascript", "자바스크립트", "TC39", "ECMAScript", "Promise", "Temporal", "프론트엔드"]
contributors: []
draft: false
---

우리가 매일 사용하는 자바스크립트는 살아있는 언어입니다.<br />
지금 이 순간에도 TC39(자바스크립트 표준을 결정하는 기술 위원회)에서는 개발자들의 삶을 더 편하고 강력하게 만들어 줄 새로운 기능들이 논의되고 있는데요.<br />
최근 Deno와 같은 주요 자바스크립트 런타임 팀들이 적극적으로 참여하면서 그 발전 속도는 더욱 빨라지고 있습니다.<br />
오늘은 곧 우리 곁으로 다가올, 혹은 이미 우리 곁에 와있는 자바스크립트의 흥미로운 미래를 미리 만나보는 시간을 갖겠습니다.<br />
오랜 골칫거리들을 해결해 줄 기특한 기능부터, 상상만 하던 것을 가능하게 할 강력한 도구까지, 하나씩 자세히 알아볼까요.<br />

### 1. 더 이상 꼼수는 그만! `Promise.withResolvers`

프로미스(Promise)를 다루다 보면, 프로미스를 생성하는 곳과 그 프로미스를 성공(`resolve`) 또는 실패(`reject`) 시키는 곳이 달라야 하는 경우가 종종 있습니다.<br />
이때 많은 개발자들이 어쩔 수 없이 아래와 같은 코드를 작성하곤 한데요.<br />
이것은 오랫동안 커뮤니티에서 '안티 패턴'으로 불리던 방식이었습니다.<br />

```javascript
// 오래된 방식: 변수를 외부에서 선언하는 꼼수
let resolve, reject;
const promise = new Promise((res, rej) => {
  resolve = res;
  reject = rej;
});

// 이제 다른 곳에서 resolve()나 reject()를 호출할 수 있습니다.
```
<br />
이런 코드는 작동은 하지만, 왠지 모르게 찜찜하고 코드를 이해하기 어렵게 만듭니다.<br />
`Promise.withResolvers`는 바로 이 문제를 아주 우아하게 해결합니다.<br />
이 정적 메서드를 호출하면, 프로미스 객체와 그에 연결된 `resolve`, `reject` 함수가 담긴 객체를 한 번에 돌려줍니다.<br />

```javascript
// 새로운 방식: Promise.withResolvers 사용
const { promise, resolve, reject } = Promise.withResolvers();

// 이제 변수를 미리 선언할 필요 없이 깔끔하게 사용할 수 있습니다.
// 예를 들어, 5초 뒤에 프로미스를 성공시킵니다.
setTimeout(() => resolve('성공!'), 5000);
```
<br />
이제 더 이상 꼼수를 쓰지 않고도, 원하는 곳에서 프로미스의 상태를 제어할 수 있게 되었습니다.<br />
사소해 보이지만 개발의 질을 한 단계 높여주는 정말 반가운 변화입니다.<br />

### 2. 비동기 데이터를 배열로, 손쉽게: `Array.fromAsync`

파일을 한 줄씩 읽거나, 여러 페이지로 나뉜 API 응답을 받아오는 것과 같은 '비동기 이터러블(Async Iterable)'을 다뤄보신 적 있으십니까.<br />
이런 데이터 스트림을 하나의 배열로 만들려면, 우리는 보통 `for await...of` 반복문을 사용해 빈 배열에 하나씩 값을 밀어 넣어야 했습니다.<br />
`Array.fromAsync`는 이 지루한 작업을 단 한 줄로 줄여줍니다.<br />
`Array.from`의 비동기 버전이라고 생각하면 정확합니다.<br />

```javascript
// 1초마다 숫자를 하나씩 만들어내는 비동기 생성기 함수
async function* createAsyncNumbers() {
  yield 1;
  await new Promise(resolve => setTimeout(resolve, 1000));
  yield 2;
  await new Promise(resolve => setTimeout(resolve, 1000));
  yield 3;
}

// Array.fromAsync를 사용해 비동기 데이터를 한 번에 배열로 만듭니다.
const numbers = await Array.fromAsync(createAsyncNumbers());

console.log(numbers); // 결과: [1, 2, 3] (2초 뒤에 출력됩니다)
```
<br />
이제 어떤 종류의 비동기 데이터 스트림이든, `Array.fromAsync` 하나면 손쉽게 배열로 변환하여 다룰 수 있습니다.<br />

### 3. 정규식의 슈퍼파워, `v` 플래그의 등장

정규식은 강력하지만 때로는 매우 까다로운 도구입니다.<br />
특히 여러 문자 집합을 조합해야 할 때 복잡성은 극에 달하는데요.<br />
새롭게 제안된 `v` 플래그는 정규식에 '집합 연산'이라는 엄청난 슈퍼파워를 부여합니다.<br />
마치 수학의 집합처럼, 두 문자 집합의 교집합(`&&`), 차집합(`--`) 등을 정규식 안에서 직접 계산할 수 있게 되는 것입니다.<br />
예를 들어, "이모지(Emoji)이면서 동시에 아스키(ASCII) 문자인 것"을 찾고 싶다면 어떻게 해야 할까요.<br />
`v` 플래그를 사용하면 이렇게 간단해집니다.<br />

```javascript
// \p{...}는 유니코드 속성을 의미합니다.
const emojiAndAsciiRegex = /[\p{Emoji}&&\p{ASCII}]/v;

// 테스트 문자열
const text = "1❤️2🎉3#4*5";

// 이모지이면서 아스키인 문자들을 찾습니다.
const result = text.match(new RegExp(emojiAndAsciiRegex, 'g'));

console.log(result); // 결과: ['#', '*'] (해시태그와 별표는 이모지 속성도 가집니다)
```
<br />
"키릴 문자 중에서 그리스 문자는 제외한 것" 같은 복잡한 조건도 이제는 훨씬 직관적이고 명확하게 표현할 수 있습니다.<br />
텍스트 처리 작업의 패러다임을 바꿀 수 있는 강력한 기능입니다.<br />

### 4. 악명 높은 Date 객체는 이제 안녕, `Temporal` API

자바스크립트 개발자라면 누구나 `Date` 객체 때문에 고통받았던 기억이 있을 것입니다.<br />
다루기 힘든 타임존, 예상과 다르게 동작하는 날짜 계산, 일관성 없는 문자열 파싱 등 `Date` 객체는 오랫동안 자바스크립트의 가장 큰 골칫거리 중 하나였습니다.<br />
`Temporal`은 이 모든 문제를 해결하기 위해 등장한 현대적인 날짜 및 시간 API입니다.<br />
- **불변성(Immutability):** `Temporal` 객체는 한번 생성되면 절대 변하지 않습니다.<br />날짜를 더하거나 빼는 모든 연산은 항상 새로운 객체를 반환하여, 사이드 이펙트로 인한 버그를 원천적으로 차단합니다.<br />
- **명시적인 API:** `Temporal.PlainDate` (날짜만), `Temporal.PlainTime` (시간만), `Temporal.ZonedDateTime` (타임존 포함) 등 용도에 맞는 명확한 객체를 제공하여 혼란을 줄여줍니다.<br />
- **쉬운 사용법:** 날짜를 더하고, 두 날짜 사이의 차이를 구하는 등의 작업이 놀라울 정도로 직관적이고 간단해집니다.<br />

`Temporal`은 아직 Stage 3 단계이지만, 사실상 표준으로 확정된 것이나 다름없습니다.<br />
머지않아 우리는 지긋지긋한 `Date` 객체의 늪에서 벗어나, 훨씬 안전하고 즐겁게 시간 관련 코드를 작성할 수 있게 될 것입니다.<br />

### 더 나은 내일을 만드는 오늘의 변화들

오늘 살펴본 새로운 기능들은 단순히 코드를 몇 줄 줄여주는 편의 기능이 아닙니다.<br />
이것은 지난 수년간 자바스크립트 개발자들이 겪어왔던 실제적인 어려움과 고충에 대한 TC39의 응답입니다.<br />
개발자들이 더 본질적인 문제에 집중할 수 있도록, 언어 스스로가 더 똑똑하고 안전한 방향으로 진화하고 있는 것입니다.<br />
계속해서 발전하는 자바스크립트의 미래를 지켜보는 것은, 이 언어를 사용하는 우리 모두에게 정말 흥미진진한 여정이 될 것입니다.<br />
