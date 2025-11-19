---
slug: 2025-11-18-resilient-api-calls-with-ts-retry-promise
title: "불안정한 API 호출, ts-retry-promise로 우아하게 재시도하는 법"
summary: "외부 API의 잦은 오류와 불안정성 때문에 고민이신가요? ts-retry-promise 라이브러리를 활용하여 타입스크립트 API 클라이언트의 안정성을 높이는 방어적 에러 핸들링과 스마트한 재시도 전략을 알아봅니다."
date: 2025-11-18T13:52:53.255Z
draft: false
weight: 50
tags: ["ts-retry-promise", "API 재시도", "타입스크립트", "에러 핸들링", "BullMQ", "안정적인 API", "Redis"]
contributors: []
---

![불안정한 API 호출, ts-retry-promise로 우아하게 재시도하는 법](https://blogger.googleusercontent.com/img/a/AVvXsEhZsB3p8GJlbd8Vqh5tOmM8E0L3__fTh3LwXZ6UKkH1KlPCIf48sWEzw8r92S4441ElXjEeZ433UTM8qwwX7BcTWzFLpY9ERTQRCGc_iU2CK0uDDd2X2VGAy6N5ok2RH60mxdDfnMApmkJS2z15bx9N9aVVz73B3TPJ5fs4mZ9KLb2Yq36bPO9Yki83M6E=s16000)


외부 API 연동 작업은 늘 예측 불가능한 변수와의 싸움인데요.

속도 제한, 네트워크 문제, 일시적인 서비스 중단 등 실패는 어쩌면 당연한 일입니다.

바로 이럴 때 'ts-retry-promise'를 활용하면 훨씬 안정적인 타입스크립트(TypeScript) API 클라이언트를 구축할 수 있거든요.

이번 포스팅에서는 방어적인 에러 핸들링부터 스마트한 재시도 조건 설정, 그리고 서비스 로직에 재시도 로직을 깔끔하게 통합하는 방법까지 자세히 알아보겠습니다.


외부 API를 다룰 때 실패는 피할 수 없는 부분인데요.

그것이 속도 제한이든, 디엔에스(DNS) 장애든, 일시적인 서비스 중단이든, 혹은 우리 클라이언트의 연결 문제든, 애플리케이션은 이러한 장애를 우아하게 처리할 전략을 갖추고 있어야 합니다.

바로 이 지점에서 'ts-retry-promise'가 신뢰할 수 있는 프로덕션 수준의 클라이언트를 구축하는 데 아주 귀중한 도구가 되어주는 것이죠.


### 방어적 헬퍼 함수

재시도를 처리하기 전에, API로부터 반환된 에러 객체를 안전하게 검사하는 과정이 필요한데요.

외부 서비스는 예측 불가능한 형태의 데이터를 반환하는 경우가 많아서, 특정 구조를 가정하고 코드를 작성하면 런타임 에러로 이어지기 쉽습니다.

이런 상황에 방어적으로 대처하기 위해, 에러의 형태를 명시적으로 확인하는 '타입 가드(Type Guards)'를 구현하는 것이 아주 유용하거든요.

아래와 같이 말입니다.


```typescript
export const hasErrorCode = (error: unknown): error is { code: string | number } => {
  return !!error && typeof error === 'object' && 'code' in error;
};

export const hasErrorStatus = (error: unknown): error is { status: number } => {
  return !!error && typeof error === 'object' && 'status' in error && typeof error.status === 'number';
};
```

### 재시도 조건 설정

ts-retry-promise에서는 'retryConfig' 객체를 통해 언제, 어떻게 재시도를 수행할지 상세하게 정의할 수 있는데요.

아래는 특정 트레이딩 API를 사용한다고 가정하고 작성한 예시입니다.

속도 제한이나 일시적인 네트워크 오류처럼 잠시 후 해결될 수 있는 문제에 대해서만 재시도하도록 설정하는 거거든요.

반면, '패턴 데이 트레이딩(Pattern Day Trading)' 제한과 같이 이미 알려진 비즈니스 로직 에러에 대해서는 불필요한 재시도를 피하도록 구성하는 것이 핵심입니다.


```typescript
import ms from 'ms';
import { RetryConfig } from 'ts-retry-promise';

const retryConfig: Partial<RetryConfig> = {
  delay: ms('10s'),
  retries: 'INFINITELY',
  timeout: ms('5m'),
  retryIf: (error: unknown) => {
    if (hasErrorCode(error)) {
      // Pattern Day Trading Block
      if (error.code === 40310100) return false;
      return true;
    }

    if (hasErrorStatus(error)) {
      // Too Many Requests
      return error.status === 429;
    }

    return false;
  },
} as const;
```

이 설정은 문제가 외부 서버 측에 있거나 우리 클라이언트가 일시적으로 오프라인 상태일 때는 계속 재시도를 하도록 보장하는데요.

동시에, 복구가 불가능한 것이 명백한 에러에 대해서는 빠르게 실패 처리하여 시스템의 불필요한 부하를 줄여주는 효과가 있습니다.


### API 클라이언트와 함께 사용하기

재시도 동작을 정의했다면, 이제 실제 코드에 적용하는 것은 아주 간단한데요.

재시도 로직을 적용하여 전체 'TradingClient' 클래스를 구현한 예시는 아래와 같습니다.


```typescript
import ms from 'ms';
import { retry, RetryConfig } from 'ts-retry-promise';

export const hasErrorCode = (error: unknown): error is { code: string | number } => {
  return !!error && typeof error === 'object' && 'code' in error;
};

export const hasErrorStatus = (error: unknown): error is { status: number } => {
  return !!error && typeof error === 'object' && 'status' in error && typeof error.status === 'number';
};

export class TradingClient {
  private readonly retryConfig: Partial<RetryConfig> = {
    delay: ms('10s'),
    retries: 'INFINITELY',
    timeout: ms('5m'),
    retryIf: (error: unknown) => {
      if (hasErrorCode(error)) {
        // Pattern day trading block
        if (error.code === 40310100) return false;
        return true;
      }

      if (hasErrorStatus(error)) {
        // Too Many Requests
        return error.status === 429;
      }

      return false;
    },
  };

  constructor(private sdk: { cancelOrder: (id: string) => Promise<void> }) {}

  async cancelOrderById(orderId: string) {
    return retry(() => this.sdk.cancelOrder(orderId), this.retryConfig);
  }
}
```

이러한 패턴을 사용하면 재시도 로직을 여러 곳에서 공유하며 재사용할 수 있거든요.

덕분에 재시도가 필요한 모든 API 호출에 대해, 해당 조건에 맞는 실패가 발생했을 때 자동으로 재시도 로직이 적용되도록 보장할 수 있습니다.


### 다음 단계

동기적인(synchronous) 워크플로우의 경우, ts-retry-promise는 아주 깔끔하고 가벼운 훌륭한 선택지인데요.

하지만 분산 시스템이나 마이크로서비스 환경에서는 요청-응답 주기 외부에서 재시도가 처리되어야 할 필요가 있습니다.

이런 경우에는 실패한 작업을 레디스(Redis) 기반의 불엠큐(BullMQ)나 아마존 에스큐에스(Amazon SQS) 같은 메시지 큐, 혹은 카프카(Kafka)와 같은 스트리밍 플랫폼으로 보내 비동기적으로 재시도를 처리하는 것이 더 효과적이거든요.

이러한 시스템들은 지연된 재시도, 백오프(backoff) 전략, 데드-레터 큐(dead-letter queue) 등을 지원하기 때문에, 모든 서비스에 재시도 로직을 내장하고 싶지 않은 대용량 처리나 핵심적인 워크플로우에 이상적인 해결책입니다.
