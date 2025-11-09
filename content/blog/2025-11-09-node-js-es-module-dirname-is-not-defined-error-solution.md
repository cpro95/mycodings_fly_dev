---
slug: 2025-11-09-node-js-es-module-dirname-is-not-defined-error-solution
title: "ES 모듈 __dirname is not defined 오류, 이젠 import.meta로 해결하세요"
summary: "Node.js에서 CJS를 ES 모듈로 전환할 때 흔히 발생하는 __dirname is not defined 오류의 원인과, 번거로운 해결법 대신 네이티브 import.meta.dirname을 사용하는 최신 방법을 알아봅니다."
date: 2025-11-09T02:04:56.230Z
draft: false
weight: 50
tags: ["__dirname", "__filename", "ES 모듈", "Node.js", "import.meta", "ReferenceError", "자바스크립트"]
contributors: []
---

![ES 모듈 __dirname is not defined 오류, 이젠 import.meta로 해결하세요](https://blogger.googleusercontent.com/img/a/AVvXsEjR_Ko1yp0hdqOl7EfxMqnI7qfSJHVksHKnLkVCItc_AflckAa6aPl12_5Y_CRtN_5PZi9T_leKPOXQHWzdoo8-rACs35gXBuiJXBlL3QHcoyFPUlZRE8ALZ5_m5igLJycvv-e7DcOOMbjO3YYlMDCyzUde1YNGrRYkKSnBB7IZx8YnTId13g-OQcvcTfc=s16000)

노드제이에스(Node.js)에서 커먼제이에스(CommonJS)를 ES 모듈로 전환해 본 경험이 있다면, 아마 이런 오류 메시지를 한 번쯤은 보셨을 텐데요.

```
ReferenceError: __dirname is not defined in ES module scope.
```

이런 오류가 발생하는 이유는 `__dirname`과 `__filename`이 ES 모듈에는 존재하지 않는 커먼제이에스(CommonJS)의 전역 변수이기 때문입니다.

물론 `fileURLToPath`와 `dirname`을 이용한 해결 방법이 있긴 하거든요.

하지만 이제 노드제이에스(Node.js)가 `import.meta.dirname`과 `import.meta.filename`이라는 네이티브 해결책을 제공하고 있습니다.

오늘은 이 오류를 깔끔하게 해결하고 최신 접근법을 사용하는 방법을 알려드리겠습니다.

## 오류의 원인 이해하기

커먼제이에스(CommonJS) 모듈에서는 `__dirname`과 `__filename`이 자동으로 제공되었는데요.

그래서 아래처럼 아무런 문제 없이 사용할 수 있었습니다.

`app.cts`
```javascript
console.log(__dirname); // /Users/you/project
console.log(__filename); // /Users/you/project/app.cts
```

하지만 `.mts` 확장자를 사용하거나 `package.json`에 `"type": "module"`을 설정하여 ES 모듈을 사용하면, 이 전역 변수들은 더 이상 존재하지 않습니다.

`app.mts`
```javascript
console.log(__dirname);
// ReferenceError: __dirname is not defined in ES module scope
```

이러한 차이 때문에 현재 모듈을 기준으로 파일 경로를 조작하거나, 상대 경로의 파일을 읽어오는 등의 작업에 의존하던 코드가 깨지게 되는 거거든요.

결국 경로를 해석하는 데 큰 문제가 발생하는 것입니다.

## 구식 해결 방법

노드제이에스(Node.js)에 네이티브 지원 기능이 추가되기 전에는 `import.meta.url`을 사용해서 `__dirname`을 수동으로 만들어야 했는데요.

코드가 꽤 번거로워지는 단점이 있었습니다.

`app.mts`
```javascript
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log(__dirname); // /Users/you/project
console.log(__filename); // /Users/you/project/app.mts
```

이 패턴은 수많은 ES 모듈 코드 베이스에서 발견될 만큼 널리 쓰인 방식입니다.

잘 작동하긴 했지만, 기본적인 경로 정보를 얻기 위해 불필요한 import 구문과 보일러플레이트 코드를 추가해야 한다는 단점이 있었거든요.

이는 코드 가독성과 유지보수 측면에서 다소 아쉬운 해결책입니다.

## 현대적인 해결책

드디어 노드제이에스(Node.js) v20.11.0과 v21.2.0 버전에서 `import.meta.dirname`과 `import.meta.filename`이 직접적인 대체제로 도입되었는데요.

이제는 아래처럼 아주 간단하게 사용할 수 있습니다.

`app.mts`
```javascript
console.log(import.meta.dirname); // /Users/you/project
console.log(import.meta.filename); // /Users/you/project/app.mts
```

이제 더 이상 import도, 헬퍼 함수도, 번거로운 해결 방법도 필요 없습니다.

이 속성들은 커먼제이에스(CommonJS)의 `__dirname` 및 `__filename`과 정확히 동일한 값을 제공하거든요.

정말 간결하고 직관적인 해결책입니다.

## 실용적인 활용 예시

그렇다면 실제 현업에서는 이 속성들을 어떻게 활용할 수 있을까요? 자주 사용되는 몇 가지 시나리오를 소개해 드리겠습니다.

'모듈 기준 상대 경로 파일 읽기'

```javascript
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const configFile = join(import.meta.dirname, 'config.json');
const config = await readFile(configFile, 'utf-8');
```

'import 또는 리소스 경로 해석'

```javascript
import { resolve } from 'node:path';

const templatesDir = resolve(import.meta.dirname, '..', '/templates');
console.log(templatesDir); // "/templates"
```

'웹 서버에서 에셋 로드하기'

```javascript
import { join } from 'node:path';
import { createReadStream } from 'node:fs';

const publicDir = join(import.meta.dirname, 'public');
const stream = createReadStream(join(publicDir, 'index.html'));
```
