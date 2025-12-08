---
slug: 2025-12-08-parsing-csv-files-in-typescript-with-papa-parse
title: "타입스크립트에서 CSV 파일 다루기, Papa Parse 하나면 끝납니다"
summary: "타입스크립트 환경에서 CSV 파일을 쉽고 효율적으로 파싱하는 방법을 알아보세요. Papa Parse 라이브러리를 활용한 기본 사용법부터 대용량 스트림 처리까지 완벽하게 정리했습니다."
date: 2025-12-08T12:39:36.811Z
draft: false
weight: 50
tags: ["TypeScript", "CSV 파싱", "Papa Parse", "Node.js", "대용량 파일 처리", "웹 개발"]
contributors: []
---

![타입스크립트에서 CSV 파일 다루기, Papa Parse 하나면 끝납니다](https://blogger.googleusercontent.com/img/a/AVvXsEjRf-qckwoH25hftKM8mSJsQcmh3tMEjkmw_JeN_mySDH63zm50IyL-yBFq20RKmJJ8FKYPWoPAvEzs6WgIbvTVXVPpOCGhtFbvTH3S9YflFhlcrXH6_2hleshtnZZsP8u7BN_YQk4ELt-822b_WaqHNb9HF8CUn7Z9m8XUZStZfcqaOm9t-YSX0xthsG0=s16000)

웹 애플리케이션을 개발하다 보면 CSV(Comma-Separated Values) 파일을 다뤄야 하는 상황을 정말 자주 마주하게 되는데요.

데이터를 시스템으로 가져오거나, 거대한 데이터 세트를 처리하거나, 단순히 파일 내용을 읽어야 할 때 믿을 만한 파서가 필수적입니다.

이번 글에서는 '파파 파스(Papa Parse)'라는 강력하고 유명한 라이브러리를 사용하여 '타입스크립트(TypeScript)'에서 CSV 파일을 파싱하는 방법을 알아보겠습니다.

## Papa Parse가 무엇인가요

도대체 '[파파 파스(Papa Parse)](https://www.papaparse.com/)'가 무엇인지 궁금하실 텐데요.

이것은 브라우저와 '노드(Node.js)' 환경 모두에서 사용할 수 있는 빠르고 개발자 친화적인 CSV 파서입니다.

로컬 및 원격 파일 파싱을 지원하는 것은 물론, 타입 변환을 처리하고 읽기 전용 스트림을 통해 대용량 파일을 처리하며 CSV 데이터를 JSON 객체로 손쉽게 변환해 주거든요.

특히 '타입스크립트(TypeScript)' 타이핑을 지원하기 때문에 타입을 지정한 데이터를 반환받을 수도 있습니다.


## 시작하기

시작하기에 앞서 프로젝트에 '파파 파스(Papa Parse)'와 해당 타입 정의를 설치해야 하는데요.

아래 명령어를 통해 설치를 진행하면 됩니다.


```bash
npm install papaparse @types/papaparse
```

설치가 완료되면 이제 '타입스크립트(TypeScript)' 파일로 라이브러리를 가져와서 본격적으로 CSV 데이터 파싱을 시작할 수 있습니다.


## CSV 파일에서 데이터 파싱하기

먼저 CSV 파일에서 데이터를 파싱하는 간단한 예제부터 살펴보겠습니다.

다음과 같은 `users.csv` 파일이 있다고 가정해 볼까요?


**users.csv**
```csv
First Name;Last Name;Age

Benny;Neugebauer;37
Lara;Croft;56
Zoe;Schiefer;38
```

보시는 것처럼 파일에는 헤더 정보와 빈 줄이 포함되어 있고, 텍스트와 숫자가 섞여 있거든요.

하지만 '파파 파스(Papa Parse)'의 설정 옵션을 활용하면 이런 것들은 전혀 문제가 되지 않습니다.


**예제 코드**

```typescript
import fs from 'node:fs';
import Papa from 'papaparse';

// 예상되는 타입 정의
type User = {
  Age: number;
  'First Name': string;
  'Last Name': string;
};

const file = fs.readFileSync('./users.csv', 'utf8');

const parsed = Papa.parse<User>(file, {
  delimiter: ';',
  dynamicTyping: true,
  header: true,
  skipEmptyLines: true,
});

const { data } = parsed;

console.log(data.length); // 3
console.log(data[0]?.['First Name']); // "Benny"
console.log(data[1]?.['First Name']); // "Lara"
console.log(data[1]?.Age); // 56
console.log(typeof data[1]?.Age); // "number"
```

CSV 파일에서 데이터를 받아오는 과정은 매우 직관적인데요.

`header: true` 설정을 사용하면 헤더 이름이 가져온 데이터의 속성 이름이 됩니다.

또한 `dynamicTyping: true` 설정을 통해 숫자가 단순 문자열이 아닌 숫자 데이터 타입으로 파싱되도록 보장할 수 있거든요.

CSV 파일 내의 빈 줄도 문제없이 처리되며 구분자(Delimiter) 또한 원하는 대로 커스터마이징이 가능합니다.

가장 좋은 점은 `Papa.parse` 함수가 제네릭을 지원하여 '타입스크립트(TypeScript)'에서 타입 인수를 받을 수 있다는 것인데요.

`User` 타입을 전달함으로써 우리는 타입이 지정된 데이터를 반환받게 됩니다.


## 대용량 CSV 파일 파싱하기

파일을 파싱할 때 모든 데이터를 한 번에 메모리에 로드하는 경우가 종종 있는데요.

하지만 이 방법은 파일 크기가 클 경우 매우 비효율적이며 상당한 메모리를 소모할 수 있습니다.

대용량 파일을 더 효율적으로 처리하기 위해서는 읽기 전용 스트림(Readable Streams)을 사용해야 하거든요.

'파파 파스(Papa Parse)'는 이러한 방식을 지원하여, 콜백 함수와 함께 스트림을 전달함으로써 데이터를 배치 단위로 처리할 수 있게 해줍니다.


**예제 코드**

```typescript
import fs from 'node:fs';
import Papa from 'papaparse';

type User = {
  Age: number;
  'First Name': string;
  'Last Name': string;
};

const stream = fs.createReadStream('./users.csv', 'utf8');

Papa.parse<User>(stream, {
  delimiter: ';',
  dynamicTyping: true,
  header: true,
  skipEmptyLines: true,
  complete: () => {
    console.log('Finished parsing');
  },
  error: (error) => {
    console.error(error);
  },
  step: (results) => {
    console.log(results.data['First Name']);
  },
});
```
