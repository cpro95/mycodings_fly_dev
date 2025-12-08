---
slug: 2025-12-08-loading-json-files-dynamically-in-typescript
title: "타입스크립트 동적 JSON 로딩, 최신 문법으로 완벽하게 처리하기"
summary: "타입스크립트에서 Import Attributes를 사용하여 런타임에 JSON 파일을 동적으로 불러오는 방법과 Node.js ESM 환경에서 require를 활용하는 팁을 상세히 알아봅니다."
date: 2025-12-08T12:49:18.323Z
draft: false
weight: 50
tags: ["TypeScript", "JSON", "동적 임포트", "Import Attributes", "Node.js", "ESM", "CommonJS"]
contributors: []
---

![타입스크립트 동적 JSON 로딩, 최신 문법으로 완벽하게 처리하기](https://blogger.googleusercontent.com/img/a/AVvXsEjb9q5tlWji0VoISJBZwc4qB7ONoHwDFPPWwt4QVnACJnHh9QnOFPJDKpbwQzNhtO9v3DnvwjwOMLbzogGismcQPFd30DQw84NaXH1PTQbXKGS8fjg7YqtiFezbQcjPNX89TGxl0s1AA0D7QOX8pFzQsom1XZq2wJI-lZhtIK_NixJKx02bZO_iXMts9KA=s16000)

'임포트 속성(Import Attributes)'과 동적 임포트를 사용하여 타입스크립트에서 JSON 파일을 동적으로 가져오는 방법을 알아봅니다.

또한 Node.js 환경의 ECMAScript 모듈에서 `require`를 사용하는 방법도 함께 살펴보겠습니다.


## 임포트 속성 활용하기

'임포트 어설션(Import Assertions)'의 진화형인 '임포트 속성(Import Attributes)'을 사용하면 타입스크립트 코드베이스에서 런타임에 JSON 파일을 동적으로 불러올 수 있는데요.

이 과정은 아래 예제처럼 동적 임포트와 함께 임포트 속성을 사용하는 방식으로 이루어집니다.


```typescript
async function loadJSON(filename: string) {
  const json = await import(filename, {
    with: { type: 'json' },
  });

  return json.default;
}
```

동적 임포트로 알려진 `await import()`는 '프로미스(Promise)'를 반환하며 지정된 경로에서 모듈을 로드하는 비동기 작업을 시작하는 함수입니다.

JSON 임포트는 기본(default) 임포트만 지원하므로, JSON 파일에서 값을 가져오려면 `default` 속성에 접근해야 하거든요.

파일을 가져올 때 임포트 속성 사양에 정의된 `with` 구문을 사용하는 점을 꼭 유의해야 합니다.


## ESM에서 require 사용하기

Node.js v18 버전부터는 ECMAScript 모듈(ESM) 내에서도 `require` 호출을 흉내 내어 JSON 파일을 로드할 수 있습니다.


```typescript
import {createRequire} from 'node:module';
const require = createRequire(import.meta.url);

function loadJSON(filename: string) {
  return require(filename);
}
```

이 기술은 `node:module` 패키지의 `createRequire`를 활용하여 `require` 함수를 생성하는 방식인데요.

이 함수는 CommonJS의 `require` 동작을 에뮬레이트하여 ESM에서 JSON 데이터를 가져오는 또 다른 방법을 제공해 줍니다.

특히 CommonJS에서 ECMAScript 모듈로 전환하는 개발자들에게 매우 유용한 접근 방식입니다.
