---
slug: 2022-12-15-howto-internationalize-numbers-in-javascript
title: 자바스크립트로 숫자에 콤마 붙이기
date: 2022-12-15 11:36:07.532000+00:00
summary: 자바스크립트로 숫자에 콤마 붙이기
tags: ["javascript", "tutorial", "internationalize", "toLocaleString", "NumberFormat"]
contributors: []
draft: false
---

안녕하세요?

오늘은 정말 간단한 팁인데요.

돈과 관련된 숫자를 자바스크립트로 표현할 때 콤마가 있으면 정말 좋을까 싶은데요.

예전에는 특별 함수를 작성해야 됐었는데, 최근 자바스크립트는 국제화 시대에 걸맞게 표준 API를 제공해 줍니다.

자바스크립트 원시 타입인 Number의 toLocaleString 메서드를 이용해서 표현할 수 있는데요.

UI에서 큰 숫자에 콤마를 붙이는 거는 가독성이 엄청나게 향상되는 효과를 보이는데요.

콤마 없는 1억 단위의 숫자를 일일이 세려고 한다면 사용자는 금방 포기하고 말 겁니다.

참고로, 이럴 때 쓰는 콤마를 용어에서는 punctuation이라고 합니다.

그런데, 우리나라는 punctuation에 콤마를 쓰는데요.

유럽은 점(.)을 씁니다.

그럼 소수점을 어떻게 표현할까요?

반대로 소수점은 콤마(,)를 씁니다.

그럼 toLocaleString 메서드를 이용한 방법을 나열해 보겠습니다.

```js
const price = 456001.82

price.toLocaleString();
'456,001.82'
// 현재 브라우저의 로케일에 맞게 자동으로 세팅됩니다.

price.toLocaleString('ko-KR');
'456,001.82'

price.toLocaleString('de-DE');
'456.001,82'
// 소수점이 콤마로 나타납니다.

price.toLocaleString('de-DE', {
    style: 'currency',
    currency: 'EUR'})
'456.001,82 €'

new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'}).format(price);
'$456,001.82'

const number = 3500;
console.log(new Intl.NumberFormat().format(number));
3,500
// 현재 브라우저의 로케일에 맞게 자동으로 세팅됩니다.
```

정말 별도의 라이브러리 없이 위와 같이 쉽게 구현할 수 있다는 게 행운이네요.

많은 도움이 되셨으면 합니다.
