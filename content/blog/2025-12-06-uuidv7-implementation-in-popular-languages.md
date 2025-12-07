---
slug: 2025-12-06-uuidv7-implementation-in-popular-languages
title: "유명 언어로 직접 구현해보는 UUIDv7 개념부터 실전 코드까지"
summary: "차세대 식별자 표준인 UUIDv7의 구조를 분석하고, 유명 프로그래밍 언어로 구현한 예제 코드를 한곳에 모았습니다."
date: 2025-12-06T04:06:28.677Z
draft: false
weight: 50
tags: ["UUIDv7", "UUID", "데이터베이스", "기본키", "프로그래밍", "파이썬", "자바스크립트", "SQL", "개발자가이드"]
contributors: []
---

![유명 언어로 직접 구현해보는 UUIDv7 개념부터 실전 코드까지](https://blogger.googleusercontent.com/img/a/AVvXsEj4pqU21myGLv4rr32VEjKmBV1MO0ERWZlFcm2jRPV8i3nXnet9s7WirymA3Ei6JUhLwXsPIJvRG1XRmx9rzeDp02Mdh7XOxtjbRwwGfl3oPO2zv1Fw2DO3vm2FwgaICgTxBmyrvC0nEMxeC0ktChQ7xUe6_X6uFISK2bCz0fh7KAZfqaYL_iD3yHoJupY=s16000)

UUIDv7은 우리에게 익숙한 UUIDv4처럼 128비트 고유 식별자인데요.

하지만 형님 격인 v4와 달리 1밀리초(ms) 단위의 시간 순 정렬이 가능하다는 결정적인 차이가 있습니다.

타임스탬프와 난수(Random) 부분을 결합한 덕분에, 분산 환경을 포함한 데이터베이스의 레코드 식별자로 아주 훌륭한 선택지가 될 수 있거든요.

이번 글에서는 UUIDv7의 구조를 간단히 살펴보고, 유명 언어별 구현 코드를 소개해 드리겠습니다.

외부 라이브러리 없이 순수하게 구현한 코드들인데요.

가장 빠르거나 완벽하게 관용적인 코드는 아닐 수 있지만, 간결하고 이해하기 쉬운 예제들입니다.

## 구조(Structure)

UUIDv7을 문자열로 표현하면 대략 이런 모습입니다.

![UUIDv7 구조(Structure)](https://blogger.googleusercontent.com/img/a/AVvXsEgTfDIYfs7Rfw5y4vQh6ldy-J9uln3A1tbZoWIoEw1P5a6pcn9hfkHUbWGSqSn1Lejn1NdDBIACyLlHRKMiLkvBoOdSZ8LvSAwr8jkNWD43CIYyZzI4e2-97GJ1VZuipKTtPXtufpzR8IE1c9PE1SDyupSo5qdPCvu5FXzurIN2AqzkUhO9w3JKRED0k3k=s16000)

```text
0190163d-8694-739b-aea5-966c26f8ad91
└─timestamp─┘ │└─┤ │└───rand_b─────┘
             ver │var
              rand_a
```

이 128비트 값은 몇 가지 부분으로 나뉘는데요. 각 필드의 역할은 다음과 같습니다.


*   **timestamp (48비트)**: 밀리초 단위의 유닉스 타임스탬프입니다.
*   **ver (4비트)**: UUID 버전 정보를 담고 있으며, 여기서는 7입니다.
*   **rand_a (12비트)**: 무작위로 생성된 값입니다.
*   **var (2비트)**: 변형(Variant) 정보로, 10(이진수) 값을 가집니다.
*   **rand_b (62비트)**: 나머지 무작위 생성 값입니다.

문자열로 표현할 때 각 심볼은 4비트를 16진수로 인코딩하는데요.

위 예시의 `a`는 `1010`이므로, 앞의 두 비트는 고정된 변형값(`10`)이고 뒤의 두 비트는 랜덤입니다.

따라서 결과적으로 이 위치의 16진수는 `8(1000)`, `9(1001)`, `a(1010)`, `b(1011)` 중 하나가 됩니다.

더 자세한 내용은 [RFC 9652](https://www.rfc-editor.org/rfc/rfc9562#name-uuid-version-7) 문서를 참고하시면 됩니다.

## 언어별 구현(Implementations)

### JavaScript

`crypto.getRandomValues()`로 난수 배열을 초기화하고, `Date.now()`로 현재 타임스탬프를 가져옵니다.

비트 연산을 통해 배열을 채우고 버전과 변형값을 설정하는 방식입니다.

```javascript
function uuidv7() {
    // 난수 바이트 생성
    const value = new Uint8Array(16);
    crypto.getRandomValues(value);

    // 현재 타임스탬프 (ms)
    const timestamp = BigInt(Date.now());

    // 타임스탬프 할당
    value[0] = Number((timestamp >> 40n) & 0xffn);
    value[1] = Number((timestamp >> 32n) & 0xffn);
    value[2] = Number((timestamp >> 24n) & 0xffn);
    value[3] = Number((timestamp >> 16n) & 0xffn);
    value[4] = Number((timestamp >> 8n) & 0xffn);
    value[5] = Number(timestamp & 0xffn);

    // 버전 및 변형값 설정
    value[6] = (value[6] & 0x0f) | 0x70;
    value[8] = (value[8] & 0x3f) | 0x80;

    return value;
}

const uuidVal = uuidv7();
const uuidStr = Array.from(uuidVal)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
console.log(uuidStr);
```

타입스크립트(TypeScript) 버전도 거의 동일한데요. 함수 시그니처만 `function uuidv7(): Uint8Array`로 변경해 주시면 됩니다.


### Python

파이썬에서는 `os.urandom()`과 `time.time()`을 사용해 구현합니다.


```python
import os
import time

def uuidv7():
    # 난수 바이트 생성
    value = bytearray(os.urandom(16))

    # 현재 타임스탬프 (ms)
    timestamp = int(time.time() * 1000)

    # 타임스탬프 할당
    value[0] = (timestamp >> 40) & 0xFF
    value[1] = (timestamp >> 32) & 0xFF
    value[2] = (timestamp >> 24) & 0xFF
    value[3] = (timestamp >> 16) & 0xFF
    value[4] = (timestamp >> 8) & 0xFF
    value[5] = timestamp & 0xFF

    # 버전 및 변형값 설정
    value[6] = (value[6] & 0x0F) | 0x70
    value[8] = (value[8] & 0x3F) | 0x80

    return value

if __name__ == "__main__":
    uuid_val = uuidv7()
    print(''.join(f'{byte:02x}' for byte in uuid_val))
```

### Java

자바에서는 `SecureRandom`과 `ByteBuffer`를 활용하면 깔끔하게 구현할 수 있습니다.


```java
import java.nio.ByteBuffer;
import java.security.SecureRandom;
import java.util.UUID;

public class UUIDv7 {
    private static final SecureRandom random = new SecureRandom();

    public static UUID randomUUID() {
        byte[] value = randomBytes();
        ByteBuffer buf = ByteBuffer.wrap(value);
        long high = buf.getLong();
        long low = buf.getLong();
        return new UUID(high, low);
    }

    public static byte[] randomBytes() {
        byte[] value = new byte[16];
        random.nextBytes(value);

        ByteBuffer timestamp = ByteBuffer.allocate(Long.BYTES);
        timestamp.putLong(System.currentTimeMillis());

        System.arraycopy(timestamp.array(), 2, value, 0, 6);

        value[6] = (byte) ((value[6] & 0x0F) | 0x70);
        value[8] = (byte) ((value[8] & 0x3F) | 0x80);

        return value;
    }

    public static void main(String[] args) {
        var uuid = UUIDv7.randomUUID();
        System.out.println(uuid);
    }
}
```

### C#

C#은 `RandomNumberGenerator`와 `DateTimeOffset`을 사용하여 안전하고 정확한 값을 생성합니다.


```csharp
using System;
using System.Security.Cryptography;

public class UUIDv7 {
    private static readonly RandomNumberGenerator random =
        RandomNumberGenerator.Create();

    public static byte[] Generate() {
        byte[] value = new byte[16];
        random.GetBytes(value);

        long timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();

        value[0] = (byte)((timestamp >> 40) & 0xFF);
        value[1] = (byte)((timestamp >> 32) & 0xFF);
        value[2] = (byte)((timestamp >> 24) & 0xFF);
        value[3] = (byte)((timestamp >> 16) & 0xFF);
        value[4] = (byte)((timestamp >> 8) & 0xFF);
        value[5] = (byte)(timestamp & 0xFF);

        value[6] = (byte)((value[6] & 0x0F) | 0x70);
        value[8] = (byte)((value[8] & 0x3F) | 0x80);

        return value;
    }

    public static void Main(string[] args) {
        byte[] uuidVal = Generate();
        foreach (byte b in uuidVal) {
            Console.Write("{0:x2}", b);
        }
        Console.WriteLine();
    }
}
```

### C++

모던 C++의 `random_device`와 `chrono` 라이브러리를 사용해 구현한 예제입니다.


```cpp
#include <array>
#include <chrono>
#include <cstdint>
#include <cstdio>
#include <random>

std::array<uint8_t, 16> uuidv7() {
    std::random_device rd;
    std::array<uint8_t, 16> random_bytes;
    std::generate(random_bytes.begin(), random_bytes.end(), std::ref(rd));
    std::array<uint8_t, 16> value;
    std::copy(random_bytes.begin(), random_bytes.end(), value.begin());

    auto now = std::chrono::system_clock::now();
    auto millis = std::chrono::duration_cast<std::chrono::milliseconds>(
        now.time_since_epoch()
    ).count();

    value[0] = (millis >> 40) & 0xFF;
    value[1] = (millis >> 32) & 0xFF;
    value[2] = (millis >> 24) & 0xFF;
    value[3] = (millis >> 16) & 0xFF;
    value[4] = (millis >> 8) & 0xFF;
    value[5] = millis & 0xFF;

    value[6] = (value[6] & 0x0F) | 0x70;
    value[8] = (value[8] & 0x3F) | 0x80;

    return value;
}

int main() {
    auto uuid_val = uuidv7();
    for (const auto& byte : uuid_val) {
        printf("%02x", byte);
    }
    printf("\n");
    return 0;
}
```

### C

C 언어에서는 `getentropy`와 `timespec_get`을 사용하여 저수준에서 직접 바이트를 조작합니다.


```c
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <time.h>
#include <unistd.h>

int uuidv7(uint8_t* value) {
    int err = getentropy(value, 16);
    if (err != EXIT_SUCCESS) {
        return EXIT_FAILURE;
    }

    struct timespec ts;
    int ok = timespec_get(&ts, TIME_UTC);
    if (ok == 0) {
        return EXIT_FAILURE;
    }
    uint64_t timestamp = (uint64_t)ts.tv_sec * 1000 + ts.tv_nsec / 1000000;

    value[0] = (timestamp >> 40) & 0xFF;
    value[1] = (timestamp >> 32) & 0xFF;
    value[2] = (timestamp >> 24) & 0xFF;
    value[3] = (timestamp >> 16) & 0xFF;
    value[4] = (timestamp >> 8) & 0xFF;
    value[5] = timestamp & 0xFF;

    value[6] = (value[6] & 0x0F) | 0x70;
    value[8] = (value[8] & 0x3F) | 0x80;

    return EXIT_SUCCESS;
}

int main() {
    uint8_t uuid_val[16];
    uuidv7(uuid_val);
    for (size_t i = 0; i < 16; i++) {
        printf("%02x", uuid_val[i]);
    }
    printf("\n");
}
```

### Go

Go 언어의 간결함이 돋보이는 구현입니다. `crypto/rand` 패키지를 사용합니다.


```go
package main

import (
	"crypto/rand"
	"fmt"
	"math/big"
	"time"
)

func uuidv7() ([16]byte, error) {
	var value [16]byte
	_, err := rand.Read(value[:])
	if err != nil {
		return value, err
	}

	timestamp := big.NewInt(time.Now().UnixMilli())
	timestamp.FillBytes(value[0:6])

	value[6] = (value[6] & 0x0F) | 0x70
	value[8] = (value[8] & 0x3F) | 0x80

	return value, nil
}

func main() {
	uuidVal, _ := uuidv7()
	fmt.Printf("%x\n", uuidVal)
}
```

### Rust

러스트는 타입 안전성을 보장하며 바이트 단위 조작을 수행합니다.


```rust
use std::error::Error;
use std::time::{SystemTime, UNIX_EPOCH};

fn uuidv7() -> Result<[u8; 16], Box<dyn Error>> {
    let mut value = [0u8; 16];
    getrandom::getrandom(&mut value)?;

    let timestamp = match SystemTime::now().duration_since(UNIX_EPOCH) {
        Ok(duration) => duration.as_millis() as u64,
        Err(_) => return Err(Box::from("Failed to get system time")),
    };

    value[0] = (timestamp >> 40) as u8;
    value[1] = (timestamp >> 32) as u8;
    value[2] = (timestamp >> 24) as u8;
    value[3] = (timestamp >> 16) as u8;
    value[4] = (timestamp >> 8) as u8;
    value[5] = timestamp as u8;

    value[6] = (value[6] & 0x0F) | 0x70;
    value[8] = (value[8] & 0x3F) | 0x80;

    Ok(value)
}

fn main() {
    match uuidv7() {
        Ok(uuid_val) => {
            for byte in &uuid_val {
                print!("{:02x}", byte);
            }
            println!();
        }
        Err(e) => eprintln!("Error: {}", e),
    }
}
```

### Kotlin

자바와 호환되지만 코틀린 특유의 문법으로 조금 더 간결하게 표현했습니다.


```kotlin
import java.security.SecureRandom
import java.time.Instant

object UUIDv7 {
    private val random = SecureRandom()

    fun generate(): ByteArray {
        val value = ByteArray(16)
        random.nextBytes(value)

        val timestamp = Instant.now().toEpochMilli()

        value[0] = ((timestamp shr 40) and 0xFF).toByte()
        value[1] = ((timestamp shr 32) and 0xFF).toByte()
        value[2] = ((timestamp shr 24) and 0xFF).toByte()
        value[3] = ((timestamp shr 16) and 0xFF).toByte()
        value[4] = ((timestamp shr 8) and 0xFF).toByte()
        value[5] = (timestamp and 0xFF).toByte()

        value[6] = (value[6].toInt() and 0x0F or 0x70).toByte()
        value[8] = (value[8].toInt() and 0x3F or 0x80).toByte()

        return value
    }

    @JvmStatic
    fun main(args: Array<String>) {
        val uuidVal = generate()
        uuidVal.forEach { b -> print("%02x".format(b)) }
        println()
    }
}
```

## 마치며

기존의 UUID 명세인 RFC 4122가 2005년에 발표되었으니 꽤 오랜 시간이 흘렀는데요.

시간 순으로 정렬되어 데이터베이스 성능까지 고려한 새로운 표준(RFC 9652)의 등장은 정말 반가운 소식입니다.

앞으로 수년간 우리 개발자들의 든든한 도구가 되어줄 것 같네요.
