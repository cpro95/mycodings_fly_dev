---
slug: 2025-11-09-goodbye-dotenv-node-js-native-env-support
title: "이제 dotenv는 안녕! Node.js 내장 기능으로 .env 파일 완벽 활용법"
summary: "과거 표준이었던 dotenv 패키지 없이 Node.js v20.6.0부터 내장된 loadEnvFile 함수와 --env-file 플래그를 사용하여 .env 파일을 관리하는 방법을 알아봅니다."
date: 2025-11-09T01:59:20.016Z
draft: false
weight: 50
tags: ["Node.js", "dotenv", ".env", "환경 변수", "loadEnvFile", "node:process", "dotenv-defaults"]
contributors: []
---
![이제 dotenv는 안녕! Node.js 내장 기능으로 .env 파일 완벽 활용법](https://blogger.googleusercontent.com/img/a/AVvXsEj6T_CfA8ZkyCibJKwLGxyxdg1TbNA7k3P0HobPjPs_AGB5IepwV2uThIsSx1gFtjcP5BT7a4huBwyjjybEL9BokCEv00df2M2ff3PffQxL-jcjrfsO20M3Jsi0V18MhJE4W1mWVpfTHwZbGrNYw3GbEoBRYRlTlOP9q5ZWDpvKEsB_6_c5BJzikDoD4Y8=s16000)

정말 오랫동안 `.env` 파일에서 환경 변수를 불러올 때 `dotenv` 패키지를 사용하는 게 거의 표준처럼 여겨졌는데요.

하지만 노드제이에스(Node.js) v20.6.0 버전부터 이 기능이 내장되면서 더 이상 이 의존성이 필요 없게 되었습니다.

이제 `node:process` 모듈의 `loadEnvFile` 함수나 `--env-file` CLI 플래그를 사용할 수 있거든요.

오늘은 바로 이 `dotenv` 의존성을 걷어내고 네이티브 기능으로 전환하는 방법을 자세히 알려드리겠습니다.

## 기존의 dotenv 방식

`dotenv` 패키지를 사용하려면 먼저 의존성을 설치하고, 코드 상단에서 불러온 뒤 `config` 메서드를 호출해야 했는데요.

그러면 `.env` 파일에 정의된 환경 변수를 `process.env` 객체를 통해 접근할 수 있었습니다.

`.env`
```
DATABASE_URL=postgresql://localhost/mydb
```

`main.ts`
```typescript
import dotenv from 'dotenv';

dotenv.config();

console.log(process.env.DATABASE_URL);
```

이 방식은 잘 작동했지만, 유지보수와 업데이트가 필요한 외부 의존성을 추가해야 한다는 단점이 있었습니다.

## Node.js의 네이티브 해결책

노드제이에스는 외부 의존성 없이 `.env` 파일을 불러올 수 있는 두 가지 방법을 제공하는데요.

지금부터 하나씩 살펴보겠습니다.

### CLI 플래그 사용하기

애플리케이션을 실행할 때 `--env-file` 플래그를 사용하면 되는데요.

이렇게 하면 지정된 파일의 환경 변수를 자동으로 로드해 줍니다.

```bash
node --env-file=.env app.js
```

여러 파일을 지정할 수도 있는데, 이 경우 나중에 지정된 파일이 앞선 파일의 값을 덮어쓰게 됩니다.

```bash
node --env-file=.env --env-file=.env.local app.js
```

### `loadEnvFile` 함수 사용하기

좀 더 세밀한 제어가 필요하다면 `loadEnvFile` 함수를 직접 임포트해서 호출할 수 있거든요.

이 방식은 코드 내에서 원하는 시점에 환경 변수를 로드할 수 있게 해줍니다.

`main.ts`
```typescript
import { loadEnvFile } from 'node:process';

loadEnvFile();

console.log(process.env.DATABASE_URL);
```

필요하다면 아래처럼 특정 경로를 직접 지정해 줄 수도 있습니다.

`main.ts`
```typescript
import { loadEnvFile } from 'node:process';

loadEnvFile('.env.production');

console.log(process.env.DATABASE_URL);
```

## `dotenv-defaults`로 기능 향상하기

노드의 네이티브 `loadEnvFile` 기능도 훌륭하지만, 여기에 `dotenv-defaults`를 함께 사용하면 개발자 경험을 한층 더 끌어올릴 수 있는데요.

이 패키지를 사용하면 기본적인 기본값들이 담긴 `.env.defaults` 파일을 만들 수 있습니다.

이렇게 하면 개발자들은 모든 변수를 일일이 설정할 필요 없이, 자신의 로컬 환경에서 변경이 필요한 특정 값만 `.env` 파일에 덮어쓰면 되거든요.

이 `.env.defaults` 파일은 버전 관리에 포함시켜 팀원 모두가 의존하는 견고한 기본 설정의 토대로 삼을 수 있습니다.

### `dotenv-defaults` 사용법

네이티브 방식과 함께 사용하기 위해 패키지를 설치해 주는데요.

설치 과정은 아주 간단합니다.

```bash
npm install dotenv-defaults
```

`.env.defaults`
```
# 깃에 커밋해서 사용 - 개발 환경을 위한 안전한 기본값
DATABASE_URL=postgresql://localhost:5432/myapp_dev
API_URL=http://localhost:3000
PORT=3000
LOG_LEVEL=info
CACHE_TTL=3600
```

`.env`
```
# .gitignore에 추가 - 필요한 값만 덮어쓰기
DATABASE_URL=postgresql://localhost:5432/my_custom_db
API_KEY=my-secret-key
```

`main.ts`
```typescript
import 'dotenv-defaults/config';

console.log(process.env.DATABASE_URL); // my_custom_db가 출력됩니다
```

이런 설정을 통해 개발자들은 합리적인 기본값 덕분에 프로젝트에 참여하자마자 즉시 작업을 시작할 수 있는데요.

자신의 환경에만 해당하는 데이터베이스 연결 문자열이나 API 키처럼 변경이 필요한 몇 가지 변수만 직접 구성하면 되기 때문입니다.
