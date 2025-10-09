---
slug: 2025-08-25-nodejs-esm-migration-guide-jest-to-vitest
title: Node.js ESM 마이그레이션 완벽 가이드 Jest에서 Vitest까지
date: 2025-08-26 13:27:31.356000+00:00
summary: 기존 CommonJS 프로젝트를 최신 ESM으로 전환하고, 테스트 러너를 Jest에서 Vitest로 마이그레이션하는 실전 가이드입니다. 복잡한 설정부터 에러 해결 팁까지 모든 과정을 상세하게 다룹니다.
tags: ["Node.js", "ESM", "CommonJS", "Vitest", "Jest", "마이그레이션"]
contributors: []
draft: false
---

요즘 Node.js 생태계가 ES Modules, 즉 ESM 중심으로 빠르게 재편되고 있거든요.<br />

그래서 많은 개발자분들이 기존 CommonJS(CJS) 기반의 프로젝트를 ESM으로 전환해야 할지 고민이 많으실 겁니다.<br />

사실 저도 최근에 번들러 없이 순수 TypeScript로 작성된 Node.js 프로젝트를 ESM으로 전환하는 작업을 진행했는데요.<br />

이 과정에서 겪었던 경험과 해결책들을 총정리해서 공유해 드리려고 합니다.<br />

단순히 코드만 바꾸는 게 아니라, 왜 이렇게 해야 하는지 그 배경까지 시원하게 알려드릴 테니 차근차근 따라와 보세요.<br />

더불어 테스트 프레임워크도 Jest에서 Vitest로 함께 갈아타는 여정까지 모두 담았으니, 아마 후회하지 않으실 겁니다.<br />

## 왜 굳이 ESM으로 가야 할까

마이그레이션을 시작하기 전에, 도대체 왜 다들 ESM, ESM 하는지 그 이유부터 짚고 넘어갈 필요가 있거든요.<br />

가장 큰 이유는 역시 '생태계의 흐름'입니다.<br />

`chalk`나 `node-fetch` 같은 유명 라이브러리들이 최신 버전부터 ESM 전용으로만 패키지를 배포하기 시작했습니다.<br />

이런 라이브러리들을 최신 버전으로 사용하려면, 우리 프로젝트도 ESM 환경이어야 충돌 없이 깔끔하게 쓸 수 있는 거죠.<br />

그리고 또 하나, 바로 'Top-Level Await(TLA)'을 쓸 수 있다는 점인데요.<br />

예전에는 `async` 함수 안에서만 `await`를 쓸 수 있어서 초기화 로직 같은 걸 작성할 때 조금 번거로웠습니다.<br />

하지만 ESM 환경에서는 모듈의 최상위 레벨에서 바로 `await`를 사용할 수 있어서, 비동기 초기화 코드를 훨씬 직관적으로 작성할 수 있습니다.<br />

```javascript
// 데이터베이스 연결 같은 비동기 작업을 최상위에서 바로 처리!
import { connectToDB } from './db.js';
const connection = await connectToDB();
console.log('데이터베이스 연결 성공!');
```
이런 장점들 때문에 더 이상 CJS에 머무르는 건, 마치 구형 스마트폰을 고집하는 것과 비슷한 상황이 되어가고 있습니다.<br />

## 1단계 사전 준비 Path Alias 제거하기

본격적인 전환에 앞서, 저는 `tsconfig.json`에 설정해 둔 'path alias'부터 제거하는 작업을 먼저 진행했는데요.<br />

이게 ESM 전환과 직접적인 관련은 없지만, 장기적으로는 관리 포인트를 줄여주는 아주 중요한 과정입니다.<br />

`#*` 같은 걸 써서 `import { foo } from '#some/module/path';` 처럼 절대 경로처럼 가져오는 방식, 많이들 쓰시잖아요.<br />

이게 당장은 경로가 깔끔해 보여서 좋을 수 있거든요.<br />

하지만 번들러가 없는 순수 Node.js 환경에서는 이게 오히려 독이 될 수 있습니다.<br />

TypeScript는 이 경로를 이해하지만, 컴파일된 JavaScript를 실행하는 Node.js는 이 경로를 전혀 모르기 때문입니다.<br />

결국 `tsconfig.json`, `package.json`, 심지어 Jest 설정까지 곳곳에 이 경로 해석 규칙을 중복으로 알려줘야 하는 번거로움이 생기는 거죠.<br />

실제로 저도 `.tsx` 파일을 처음 도입했을 때, 타입 에러는 없는데 런타임에서 모듈을 못 찾는 문제로 한참을 헤맸던 경험이 있습니다.<br />

알고 보니 `tsconfig.json`에 `.ts` 경로만 설정해 둔 게 원인이었죠.<br /> 이런 '설정 지옥'을 피하기 위해 과감히 상대 경로로 통일하기로 했습니다.<br />

다행히 이걸 자동으로 처리해 주는 훌륭한 ESLint 플러그인이 있는데요.<br />

`eslint-plugin-no-relative-import-paths` 같은 도구를 사용하면, 명령어 한 줄로 프로젝트 전체의 절대 경로 `import`를 상대 경로로 순식간에 바꿀 수 있습니다.<br />

## 2단계 본격적인 ESM 전환

자, 이제 진짜 주인공인 ESM 전환을 시작해 볼 시간입니다.<br />

가장 핵심적인 변화는 컴파일된 JavaScript 파일에 `require`나 `module.exports`가 아닌, `import`와 `export` 구문이 그대로 남게 된다는 점입니다.<br />

그리고 Node.js가 이 파일들을 ESM으로 인식하고 해석하도록 만들어야 합니다.<br />

### package.json에 `type: module` 추가

가장 먼저 해야 할 일은 우리 프로젝트의 기본 모듈 시스템이 ESM이라는 것을 Node.js에게 알려주는 건데요.<br />

바로 `package.json` 파일에 `"type": "module"` 한 줄을 추가해 주면 됩니다.<br />

```json
{
  "name": "my-awesome-app",
  "version": "1.0.0",
  "type": "module",
  "dependencies": { ... }
}
```

이렇게 설정하면 `.js` 확장자를 가진 모든 파일은 기본적으로 ESM으로 취급됩니다.<br />

만약 특정 파일만 CJS로 실행해야 하는 예외적인 상황이 있다면, 그 파일의 확장자를 `.cjs`로 바꿔주면 되니 아주 간단합니다.<br />

### tsconfig.json 설정 변경

다음은 TypeScript 컴파일러가 ESM 문법에 맞춰 코드를 변환하도록 설정을 바꿔줘야 하는데요.<br />

`tsconfig.json` 파일의 `compilerOptions`에서 `module`과 `moduleResolution` 값을 변경해야 합니다.<br />

기존 CJS 프로젝트는 보통 이렇게 되어 있었을 겁니다.<br />

```json
// 변경 전 (CJS)
{
  "compilerOptions": {
    "module": "commonjs",
    "moduleResolution": "node"
  }
}
```

이걸 ESM에 맞게 `'NodeNext'`로 바꿔주면 되거든요.<br />

`'NodeNext'`는 최신 Node.js의 ESM 모듈 해석 방식을 그대로 따르겠다는 의미입니다.<br />

```json
// 변경 후 (ESM)
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext"
  }
}
```

이 설정을 적용하는 순간, TypeScript는 두 가지 중요한 규칙을 강제하기 시작합니다.<br />

첫째는 컴파일 후에도 `import/export` 구문을 그대로 유지한다는 것이고, 둘째는 `import` 구문에서 파일 '확장자'를 반드시 명시하도록 요구한다는 점입니다.<br />

### 모든 import 구문에 `.js` 확장자 붙이기

아마 `tsconfig.json`을 바꾸자마자 수많은 타입 에러가 반겨줄 텐데요.<br />

대부분 `import` 경로에 확장자가 없다는 오류일 겁니다.<br />

CJS에서는 `./user/service`처럼 확장자 없이 디렉터리만 지정해도 알아서 `index.js`를 찾아줬지만, ESM에서는 그런 특별 취급이 사라졌거든요.<br /> 

Node.js가 파일을 명확하게 찾을 수 있도록, 모든 `import` 경로 끝에 `.js`를 붙여줘야 합니다.<br />

소스 코드가 `.ts` 파일이라도 말이죠.<br /> 왜냐하면 최종적으로 실행되는 건 컴파일된 `.js` 파일이기 때문입니다.<br />

이걸 하나하나 손으로 바꾸는 건 거의 불가능에 가까운데요.<br />

다행히 이 작업 역시 자동화할 수 있는 `eslint-plugin-import-extension` 같은 도구들이 있습니다.<br />

이런 ESLint 플러그인을 설정하고 `--fix` 옵션으로 실행하면, 프로젝트 전체의 `import` 구문에 마법처럼 `.js` 확장자가 추가될 겁니다.<br />

### `__dirname`, `__filename` 대체하기

CJS 환경에서는 현재 파일의 디렉터리 경로(`__dirname`)나 파일 전체 경로(`__filename`)를 전역 변수처럼 편하게 사용했는데요.<br />

ESM에서는 이 변수들이 더 이상 존재하지 않습니다.<br /> 대신 `import.meta.url`이라는 새로운 표준을 사용해야 합니다.<br />

`import.meta.url`은 현재 모듈의 URL을 문자열로 제공하거든요.<br /> 이걸 `url`과 `path` 모듈을 조합하면 예전 `__dirname`과 똑같은 값을 얻을 수 있습니다.<br />

```typescript
import path from 'path';<br />
import { fileURLToPath } from 'node:url';<br />

const __filename = fileURLToPath(import.meta.url);<br />
const __dirname = path.dirname(__filename);<br />
```
조금 번거로워졌지만, 필요할 때마다 이렇게 변수를 선언해서 사용하면 됩니다.<br />

## 3단계 Jest에서 Vitest로 테스트 환경 이전

ESM으로의 전환은 성공적으로 마쳤는데, 이제는 테스트 코드가 말썽을 부리기 시작할 텐데요.<br />

저도 Jest 환경에서 ESM 코드를 테스트하려고 온갖 방법을 시도해 봤지만, 모듈 모킹(mocking) 부분에서 계속 발목을 잡혔습니다.<br />

결국 저는 과감하게 Jest를 포기하고, ESM을 네이티브로 완벽하게 지원하는 'Vitest'로 넘어가기로 결정했습니다.<br />

결과적으로 이건 정말 최고의 선택이었습니다.<br />

Vitest는 Jest와 API 호환성이 매우 높아서, 마이그레이션 비용이 생각보다 훨씬 적게 들거든요.<br />

### 테스트 함수 직접 `import` 하기

Jest와 Vitest의 가장 큰 차이점 중 하나는 `describe`, `it`, `test`, `expect` 같은 테스트 함수들을 다루는 방식인데요.<br />

Jest에서는 이 함수들이 아무런 `import` 없이도 사용할 수 있는 전역 변수처럼 동작했습니다.<br />

하지만 Vitest에서는 이 모든 것을 `vitest` 패키지에서 직접 `import`해서 사용해야 합니다.<br />

```typescript
// Jest에서는 그냥 썼지만...
// describe('My Test', () => { ... });

// Vitest에서는 import가 필수!
import { describe, it, expect, vi } from 'vitest';

describe('My Test', () => {
  it('should work', () => {
    expect(1 + 1).toBe(2);
  });
});
```

기존의 `@types/jest` 패키지를 제거하면, 전역 함수를 사용하던 부분에서 모두 타입 에러가 발생할 거거든요.<br />

그 에러를 따라가면서 필요한 함수들을 `vitest`에서 가져오도록 수정해주면 됩니다.<br />

### `globalTeardown` 작성 방식의 변화

모든 테스트가 실행되기 전과 후에 각각 딱 한 번씩만 실행되는 `globalSetup`과 `globalTeardown` 기능은 테스트 데이터베이스를 띄우고 내릴 때 정말 유용한데요.<br />

Jest와 Vitest는 이 `globalTeardown`을 정의하는 방식이 조금 다릅니다.<br />

Jest에서는 `globalSetup`과 `globalTeardown`을 별도의 파일로 만들고 설정 파일에 각각 지정해 줘야 했거든요.<br />

그래서 `setup` 파일에서 생성한 자원(예: 테스트 컨테이너)의 참조를 `teardown` 파일로 넘기기 위해 전역 변수를 사용하는 꼼수가 필요했습니다.<br />

반면에 Vitest는 훨씬 세련된 방식을 제공하는데요.<br />

`globalSetup` 파일에서 `teardown` 로직을 담은 함수를 '반환'하면 됩니다.<br />

마치 React의 `useEffect`가 클린업 함수를 반환하는 것과 아주 비슷하죠.<br />

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globalSetup: './tests/global-setup.ts',
  },
});

// tests/global-setup.ts
import { PostgreSqlContainer } from '@testcontainers/postgresql';

export default async () => {
  const postgresContainer = await new PostgreSqlContainer().start();
  process.env.DATABASE_URL = postgresContainer.getConnectionUri();

  // teardown 함수를 여기서 반환!
  return async () => {
    await postgresContainer.stop();
  };
};
```
더 이상 불필요한 전역 변수를 만들 필요 없이, 클로저를 통해 상태를 안전하게 유지할 수 있어서 훨씬 깔끔한 코드가 됩니다.<br />

### `jest` 네임스페이스를 `vi`로

`jest.mock(...)`이나 `jest.spyOn(...)`처럼 `jest` 객체를 사용하던 코드는 모두 `vi`로 바꿔주면 되는데요.<br />

`vi.mock(...)`, `vi.spyOn(...)`처럼 기계적으로 치환하면 거의 대부분 해결됩니다.<br />

물론 `vi` 객체 역시 `vitest` 패키지에서 `import` 해오는 것을 잊으면 안 됩니다.<br />

## 마무리하며

지금까지 CommonJS 기반의 Node.js 프로젝트를 ESM으로, 그리고 테스트 러너를 Jest에서 Vitest로 전환하는 전 과정을 함께 살펴봤는데요.<br />

경로 별칭을 제거하는 것부터 시작해서, `package.json`과 `tsconfig.json` 설정 변경, 그리고 자잘한 코드 수정과 라이브러리 호환성 문제 해결까지, 결코 간단한 작업은 아니었습니다.<br />

하지만 이 과정을 거치고 나니, 프로젝트는 최신 자바스크립트 표준을 온전히 따르는 건강한 구조를 갖추게 되었습니다.<br />

특히 Vitest로의 전환은 예상치 못한 즐거움이었는데, 더 빠르고 안정적인 테스트 환경을 구축할 수 있었습니다.<br />

만약 여러분도 구형 CJS 프로젝트의 한계를 느끼고 있다면, 이 가이드가 성공적인 마이그레이션의 든든한 동반자가 되어주길 바랍니다.<br />
