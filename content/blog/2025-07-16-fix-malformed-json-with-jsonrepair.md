---
slug: 2025-07-16-fix-malformed-json-with-jsonrepair
title: 깨진 JSON 데이터, 더 이상 두렵지 않다 - JSONRepair 완벽 가이드
date: 2025-07-16 12:52:36.369000+00:00
summary: 깨진 JSON, 누락된 콤마, 잘못된 따옴표 때문에 더 이상 데이터 파이프라인을 멈추지 마세요. JSONRepair 라이브러리를 사용하여 불안정한 데이터를 자동으로 복구하고 파싱하는 방법을 단계별로 배워보세요.
tags: ["JSON", "JSONRepair", "데이터 파싱", "오류 수정", "깨진 JSON", "Malformed JSON", "데이터 파이프라인", "ETL", "Node.js", "자바스크립트", "API", "로그 분석", "data parsing", "error correction", "broken JSON", "json lint"]
contributors: []
draft: false
---

개발자라면 누구나 한 번쯤 `SyntaxError: Unexpected token... in JSON at position...` 이라는 뼈아픈 오류 메시지를 마주한 경험이 있을 겁니다.

외부 API, 오래된 시스템의 로그, 혹은 사람이 직접 수정한 설정 파일 등에서 비롯된 사소한 JSON 문법 오류 하나가 전체 데이터 처리 파이프라인을 멈추게 만들곤 하죠.

이러한 상황에서 매번 수동으로 오류를 찾아 수정하는 것은 매우 비효율적입니다.

바로 이 문제를 해결하기 위해 등장한 영웅이 있으니, 바로 **JSONRepair** 라이브러리입니다.

이 글에서는 JSONRepair를 사용하여 깨진 JSON을 어떻게 자동으로 '치료'하고, 데이터 흐름을 원활하게 유지할 수 있는지 알아보겠습니다.

### 목차
1.  **JSON은 왜, 그리고 어떻게 깨지는가?**
2.  **JSONRepair 시작하기: 설치 및 기본 사용법**
3.  **다양한 오류 유형별 복구 사례 살펴보기**
4.  **CLI를 활용한 파일 단위의 일괄 복구**
5.  **실전 활용: 불안정한 API 응답을 안전하게 처리하기**

---

### 1. JSON은 왜, 그리고 어떻게 깨지는가?

JSON(JavaScript Object Notation)은 매우 엄격한 규칙을 가진 데이터 형식입니다.

이 규칙에서 조금이라도 벗어나면 표준 파서(`JSON.parse`)는 가차 없이 오류를 발생시킵니다. 흔히 발생하는 오류 유형은 다음과 같습니다.

*   **누락된 콤마:** 객체의 속성이나 배열의 요소 사이에 콤마(`,`)가 빠진 경우
    ```json
    { "name": "John" "age": 30 } // name과 age 사이에 콤마 없음
    ```
*   **후행 콤마 (Trailing Commas):** 마지막 요소 뒤에 불필요한 콤마가 붙은 경우
    ```json
    { "name": "John", "age": 30, } // 30 뒤에 콤마가 있음
    ```
*   **따옴표 오류:** 키(key)나 문자열 값(string value)을 쌍따옴표(`"`)로 감싸지 않은 경우 (예: 홑따옴표 사용)
    ```json
    { 'name': "John", age: 30 } // 'name'과 age가 쌍따옴표로 감싸여 있지 않음
    ```
*   **주석 포함:** JSON 표준은 주석을 허용하지 않지만, 설정 파일 등에는 주석이 포함되기도 합니다.
    ```json
    {
      // 사용자 이름
      "name": "John"
    }
    ```
*   **괄호 불일치:** 여는 괄호(`{`, `[`)와 닫는 괄호(`}`, `]`)의 짝이 맞지 않는 경우

JSONRepair는 바로 이러한 문제들을 지능적으로 감지하고 수정하여, 유효한 JSON 형식으로 만들어주는 역할을 합니다.

### 2. JSONRepair 시작하기: 설치 및 기본 사용법

JSONRepair는 Node.js 환경과 브라우저에서 모두 사용할 수 있습니다.

먼저 Node.js 프로젝트에 설치하고 사용해 보겠습니다.

**1. 라이브러리 설치**

터미널에서 아래 명령어를 실행하여 `jsonrepair`를 설치합니다.

```bash
npm install jsonrepair
```

**2. 기본 코드 작성**

간단한 스크립트 파일을 만들어(`repair.js`), 깨진 JSON 문자열을 복구해 보겠습니다.

```javascript
// repair.js
const { jsonrepair } = require('jsonrepair');

// 일부러 여러 오류를 포함한 JSON 문자열
const brokenJson = `{
  "id": "user123", // 사용자 ID
  name: 'Alice',
  "age": 28
  "roles": ["admin", "editor",]
}`;

try {
  // 1. 깨진 JSON 문자열을 jsonrepair 함수에 전달
  const repairedJsonString = jsonrepair(brokenJson);
  
  console.log('✅ 복구된 JSON 문자열:');
  console.log(repairedJsonString);
  
  // 2. 이제 안전하게 JSON.parse 사용 가능
  const parsedObject = JSON.parse(repairedJsonString);
  
  console.log('\n✅ 성공적으로 파싱된 객체:');
  console.log(parsedObject);

} catch (err) {
  console.error('JSON 복구 또는 파싱 실패:', err);
}
```

터미널에서 `node repair.js`를 실행하면, 주석이 제거되고, 홑따옴표가 쌍따옴표로 바뀌고, 누락된 콤마와 후행 콤마가 모두 수정된 완벽한 JSON 문자열과 그 결과 객체가 출력되는 것을 확인할 수 있습니다.

### 3. 다양한 오류 유형별 복구 사례 살펴보기

JSONRepair가 얼마나 다양한 오류를 처리할 수 있는지 구체적인 예시를 통해 살펴보겠습니다.

| 오류 유형 | 깨진 JSON (Before) | 복구된 JSON (After) |
| :--- | :--- | :--- |
| **누락된 콤마** | `{ "a": 1 "b": 2 }` | `{"a": 1, "b": 2}` |
| **후행 콤마** | `[1, 2, 3,]` | `[1, 2, 3]` |
| **홑따옴표/따옴표 없는 키** | `{ name: 'Bob', age: 40 }` | `{"name": "Bob", "age": 40}` |
| **주석 (C-style)** | `/* 시작 */ { "a": 1 } // 끝` | `{"a": 1}` |
| **연결된 JSON 객체** | `{"a": 1}{"b": 2}` | `[{"a": 1},{"b": 2}]` |
| **이스케이프되지 않은 따옴표** | `{"text": "it's a text"}` | `{"text": "it's a text"}` |
| **줄바꿈 포함 문자열** | `{"text": "hello\nworld"}` | `{"text": "hello\\nworld"}` |

이처럼 JSONRepair는 매우 넓은 범위의 흔한 오류들을 자동으로 교정해줍니다.

### 4. CLI를 활용한 파일 단위의 일괄 복구

프로그램 코드 내에서뿐만 아니라, 터미널에서 직접 JSON 파일을 복구할 수도 있습니다.

이는 빌드 스크립트에 통합하거나, 다수의 로그 파일을 한 번에 처리할 때 매우 유용합니다.

**1. 깨진 JSON 파일 준비**

`input.json`이라는 이름으로 아래와 같이 저장합니다.

```json
// input.json
{
    "user": "guest"
    "timestamp": "2024-05-21" // 기록 시간
}
```

**2. CLI 명령어로 복구**

터미널에서 아래 명령어를 실행합니다.

`input.json` 파일을 읽어 복구한 뒤, 그 결과를 `fixed.json` 파일로 저장합니다.

```bash
npx jsonrepair input.json > fixed.json
```
이제 `fixed.json` 파일을 열어보면 아래와 같이 완벽하게 수정된 것을 확인할 수 있습니다.

```json
{"user":"guest","timestamp":"2024-05-21"}
```

### 5. 실전 활용: 불안정한 API 응답을 안전하게 처리하기

프론트엔드 또는 백엔드에서 외부 API를 호출할 때, 응답이 항상 완벽한 JSON이라고 보장할 수 없습니다.

이때 JSONRepair를 `try-catch` 구문과 함께 사용하면 시스템의 안정성을 크게 높일 수 있습니다.

```javascript
async function fetchDataFromUnstableAPI() {
  const url = 'https://some-unreliable-api.com/data';
  let rawResponse;

  try {
    const response = await fetch(url);
    rawResponse = await response.text();

    // 1. 먼저 표준 JSON.parse 시도
    return JSON.parse(rawResponse);

  } catch (error) {
    console.warn('표준 JSON 파싱 실패. 복구를 시도합니다.', error.message);

    try {
      // 2. 파싱 실패 시, JSONRepair로 복구 시도
      const repairedJson = jsonrepair(rawResponse);
      
      // 3. 복구된 문자열로 다시 파싱
      return JSON.parse(repairedJson);

    } catch (repairError) {
      // 4. 복구조차 실패하면 최종 오류 처리
      console.error('JSON 복구 최종 실패:', repairError);
      throw new Error('API 응답 데이터를 처리할 수 없습니다.');
    }
  }
}

fetchDataFromUnstableAPI()
  .then(data => console.log('성공적으로 데이터 처리:', data))
  .catch(err => console.error(err));
```
이러한 "방어적 코딩" 패턴을 적용하면, 사소한 데이터 오류로 인해 서비스 전체가 중단되는 상황을 효과적으로 방지할 수 있습니다.

### 결론

JSONRepair는 불완전한 데이터로부터 우리의 애플리케이션을 보호해주는 든든한 방패와 같습니다.

데이터 파이프라인, 로그 분석, 외부 API 연동 등 JSON 데이터를 다루는 모든 곳에서 이 라이브러리는 수동 디버깅 시간을 절약해주고 시스템의 전반적인 안정성을 향상시켜 줍니다.

깨진 JSON 때문에 더 이상 스트레스 받지 마세요.

지금 바로 여러분의 프로젝트에 JSONRepair를 적용해보시는 건 어떨까요?

더 자세한 정보는 [공식 GitHub 저장소](https://github.com/josdejong/jsonrepair)에서 확인하실 수 있습니다.

