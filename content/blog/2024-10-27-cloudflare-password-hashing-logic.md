---
slug: 2024-10-27-cloudflare-password-hashing-logic
title: Cloudflare Workers에서 password hashing(패스워드 해싱하기)
date: 2024-10-27 02:30:56.901000+00:00
summary: Cloudflare에서는 bcrypt 라이브러리를 못 씁니다. 그래서 Cloudflare에서 사용할 수 있는 password hashing 로직을 구글링을 통해 구했습니다.
tags: ["cloudflare", "password", "crypto"]
contributors: []
draft: false
---

안녕하세요?

최근에 Cloudflare Workers를 사용하여 API의 인증 엔드포인트를 구축하면서 비밀번호를 해싱해야 할 필요가 있었습니다.

아래에 제 전체 코드를 포함했는데, 이렇게 준비된 예제를 한 곳에서 찾기가 어려웠기 때문입니다.

#### 왜 Cloudflare Workers에서는 비밀번호 해싱 로직이 필요한가?

Cloudflare Workers는 서버리스 환경에서 JavaScript 코드를 실행할 수 있는 플랫폼입니다.

이 환경에서는 일반적인 Node.js 환경과는 다른 제약이 있는데, 특히 특정 Node.js 라이브러리를 사용할 수 없습니다.

예를 들어, 널리 사용되는 비밀번호 해싱 라이브러리인 **bcrypt**는 Node.js에서 C++로 작성된 추가 모듈을 사용하기 때문에, Cloudflare Workers와 같은 서버리스 환경에서는 사용할 수 없습니다.

대신, Cloudflare Workers는 브라우저 환경과 유사한 `crypto` API를 제공하여 암호화 및 해싱을 위한 기본 기능을 사용할 수 있게 합니다.

따라서 비밀번호 해싱을 위해서는 이 API를 활용하여 직접 구현해야 합니다.

#### PBKDF2 알고리즘이란?

PBKDF2(Password-Based Key Derivation Function 2)는 비밀번호를 안전하게 해싱하기 위해 설계된 알고리즘입니다.

이 알고리즘은 입력된 비밀번호를 바탕으로 고유한 키를 생성하는 데 사용되며, 다음과 같은 주요 요소를 포함합니다:

- **Salt**: 비밀번호 해싱 과정에서 사용되는 랜덤 데이터로, 동일한 비밀번호라도 다른 해시값을 생성할 수 있게 도와줍니다. 이를 통해 무차별 대입 공격을 방지합니다.
- **Iterations**: 비밀번호 해싱 과정에서 알고리즘이 반복되는 횟수입니다. 이 횟수를 늘리면 해싱 과정이 느려져, 공격자가 비밀번호를 추측하는 데 소요되는 시간을 증가시킵니다.
- **Hash Function**: PBKDF2는 SHA-256과 같은 다양한 해시 함수를 사용할 수 있습니다.

이러한 요소들 덕분에 PBKDF2는 비밀번호 보안에 매우 효과적입니다.

### 비밀번호 해싱 함수

```javascript
export async function hashPassword(
  password: string,
  providedSalt?: Uint8Array
): Promise<string> {
  const encoder = new TextEncoder();
  // 제공된 소금이 있을 경우 사용하고, 그렇지 않으면 새로 생성
  const salt = providedSalt || crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );
  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
  const exportedKey = (await crypto.subtle.exportKey(
    "raw",
    key
  )) as ArrayBuffer;
  const hashBuffer = new Uint8Array(exportedKey);
  const hashArray = Array.from(hashBuffer);
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const saltHex = Array.from(salt)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${saltHex}:${hashHex}`;
}
```

### `keyMaterial`와 `AES-GCM` 설명

`keyMaterial`은 비밀번호를 바탕으로 생성된 원시 키 데이터를 의미합니다.

이 데이터는 PBKDF2 알고리즘을 통해 안전한 키로 변환되기 전에, 입력된 비밀번호를 바탕으로 생성됩니다.

비밀번호와 함께 사용되는 **salt**와 **iterations**는 이 키를 더욱 안전하게 만드는 데 중요한 요소입니다.

`{ name: "AES-GCM", length: 256 }`는 생성된 키를 AES-GCM(Advanced Encryption Standard in Galois/Counter Mode) 암호화 알고리즘에 사용할 것임을 나타냅니다.

AES는 대칭키 암호화 방식 중 하나로, 256비트 길이의 키를 사용하여 데이터를 암호화합니다.

GCM 모드는 인증과 암호화를 동시에 수행하여 데이터 무결성을 보장합니다.

이 조합은 비밀번호 해싱 및 저장 과정에서 보안을 강화하는 데 중요한 역할을 합니다.

### 비밀번호 검증 함수

```javascript
export async function verifyPassword(
  storedHash: string,
  passwordAttempt: string
): Promise<boolean> {
  const [saltHex, originalHash] = storedHash.split(":");
  const matchResult = saltHex.match(/.{1,2}/g);
  if (!matchResult) {
    throw new Error("Invalid salt format");
  }
  const salt = new Uint8Array(matchResult.map((byte) => parseInt(byte, 16)));
  const attemptHashWithSalt = await hashPassword(passwordAttempt, salt);
  const [, attemptHash] = attemptHashWithSalt.split(":");
  return attemptHash === originalHash;
}
```

### 함수 사용 예제

#### 1. 비밀번호 해싱하기

사용자가 비밀번호를 입력하면 이를 해싱하여 저장할 수 있습니다.

예를 들어:

```javascript
async function registerUser(password: string) {
  const hashedPassword = await hashPassword(password);
  console.log("Hashed Password:", hashedPassword);
  // 이 hashedPassword를 데이터베이스에 저장하세요.
}
```

#### 2. 비밀번호 검증하기

사용자가 로그인할 때 입력한 비밀번호가 저장된 해시와 일치하는지 확인할 수 있습니다.

예를 들어:

```javascript
async function loginUser(storedHash: string, passwordAttempt: string) {
  const isMatch = await verifyPassword(storedHash, passwordAttempt);
  if (isMatch) {
    console.log("Password is valid!");
    // 로그인 성공 로직
  } else {
    console.log("Invalid password.");
    // 로그인 실패 로직
  }
}
```

---
