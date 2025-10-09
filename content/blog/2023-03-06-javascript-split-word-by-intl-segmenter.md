---
slug: 2023-03-06-javascript-split-word-by-intl-segmenter
title: Intl.Segmenter 사용하여 자바스크립트(Javascript) 문자열 나누기
date: 2023-03-06 07:05:25.937000+00:00
summary: Intl.Segmenter 사용하여 자바스크립트(Javascript) 문자열 나누기
tags: ["intl", "segmenter", "javascript", "split"]
contributors: []
draft: false
---

안녕하세요?

최근에 계속해서 Intl 객체를 이용해서 좋은 결과를 내고 있는데요.

오늘은 문자열 나누기에 있어 언어별 특성대로 나눌 수 있는 예를 공부해 볼까 합니다.

## split() 메서드

기존에는 문자열을 나누는 함수는 split 함수를 썼었는데요.

```js
'Hello! World? friend.'.split(/[.!?]/)
// [ 'Hello', ' World', ' friend', '' ]
```

위 코드를 보시면 split 함수에서 옵션을 둬서 문자열을 나눴는데요.

한글의 경우 어떻게 될까요?

```js
'안녕! 세계야? 친구들.'.split(/[.!?]/)
// [ '안녕', ' 세계야', ' 친구들', '' ]
```

뭔가 잘 되는 거 같은데 마지막에 뭔가 하나 추가되었네요.

일본어를 예로 들어 볼까요?

```js
'吾輩は猫である.名前はたぬき.'.split(/[.]/)
;['吾輩は猫である', '名前はたぬき', '']
```

만족스럽지는 않지만 나름 문자열 나누기의 기능을 하고 있는데요.

좀 더 강력한 기능이 Intl.Segmenter 객체에 있습니다.

좀 더 자세히 살펴보겠습니다.

## Intl.Segmenter

"Segmenter"이라는 말의 뜻은 "분할기"라는 뜻이네요.

예를 들어 살펴보겠습니다.

```js
const segmenterKo = new Intl.Segmenter('ko-KR', {
  granularity: 'word',
})
const results = segmenterKo.segment(
  '안녕하세요? 제 블로그에 오신 걸 환영합니다!',
)
console.log(Array.from(results).map(s => s.segment))

// ['안녕하세요', '?', ' ', '제', ' ', '블로그에', ' ', '오신', ' ', '걸', ' ', '환영합니다', '!']
```

어떤가요? 정말 깔끔하게 분리가 되었네요.

granularity 옵션에는 3가지가 들어갈 수 있는데요.

"sentence", "word", "grapheme"입니다.

각각의 예를 들어 볼까요?

```js
const segmenterKo = new Intl.Segmenter('ko-KR', {
  granularity: 'sentence',
})
const results = segmenterKo.segment(
  '안녕하세요? 제 블로그에 오신 걸 환영합니다!',
)
console.log(Array.from(results).map(s => s.segment))

// [ '안녕하세요? ', '제 블로그에 오신 걸 환영합니다!' ]
```

```js
const segmenterKo = new Intl.Segmenter('ko-KR', {
  granularity: 'grapheme',
})
const results = segmenterKo.segment(
  '안녕하세요? 제 블로그에 오신 걸 환영합니다!',
)
console.log(Array.from(results).map(s => s.segment))

// [
//   '안', '녕', '하', '세', '요',
//   '?',  ' ',  '제', ' ',  '블',
//   '로', '그', '에', ' ',  '오',
//   '신', ' ',  '걸', ' ',  '환',
//   '영', '합', '니', '다', '!'
// ]
```

예를 들어보니까 정확히 어떻게 작동되는지 쉽게 이해할 수 있네요.

주의하실 점은 results 값이 Segments {}라는 객체인데요.

이 객체는 정말 긴데요. 여기서 우리가 가져올 거는 바로 segment 항목입니다.

그래서 Array.map 함수로 돌려서 원하는 값을 얻어야 합니다.

팁으로 문자열의 isWordLike 메서드를 쓰면 빈칸은 없애고 단어만 골라낼 수 있습니다.

```js
const segmenterKo = new Intl.Segmenter('ko-KR', {
  granularity: 'word',
})
const results = segmenterKo.segment(
  '안녕하세요? 제 블로그에 오신 걸 환영합니다!',
)

console.log([...results].filter(s => s.isWordLike).map(s => s.segment))

// [ '안녕하세요', '제', '블로그에', '오신', '걸', '환영합니다' ]
```

## Emojis 분할해 보기

그럼 유니코드의 이모지(Emojis)도 분할해 볼까요?

```js
const emojis = '🫣🫵👨‍👨‍👦‍👦'

// Split by code units
console.log(emojis.split(''))

// [
//   '\ud83e', '\udee3', '\ud83e',
//   '\udef5', '\ud83d', '\udc68',
//   '‍',       '\ud83d', '\udc68',
//   '‍',       '\ud83d', '\udc66',
//   '‍',       '\ud83d', '\udc66'
// ]

// Split by graphemes
const segmenter = new Intl.Segmenter('en', {
  granularity: 'grapheme',
})
const segments = segmenter.segment(emojis)

console.log(Array.from(segmenter.segment(emojis), s => s.segment))

// [ '🫣', '🫵', '👨‍👨‍👦‍👦' ]
```

역시나 이모지에서도 정확히 작동하네요.

그럼.
