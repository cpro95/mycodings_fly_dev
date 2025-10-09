---
slug: 2024-03-02-nextjs-fetchcache
title: Next.js의 캐싱 - fetchCache 자세히 알아보기
date: 2024-03-02 09:46:32.050000+00:00
summary: Next.js의 캐싱 - fetchCache 자세히 알아보기
tags: ["next.js", "fetchcache"]
contributors: []
draft: false
---

안녕하세요?

오늘은 Next.js의 캐싱 부분인 fetchCache 기능에 대해 자세히 알아 보겠습니다.

** 목차 **

- [Next.js의 캐싱 - fetchCache 자세히 알아보기](#nextjs의-캐싱---fetchcache-자세히-알아보기)
  - [데이터 가져오기가 캐시되는 타이밍](#데이터-가져오기가-캐시되는-타이밍)
  - [fetchCache를 필요할 때마다 삭제하기](#fetchcache를-필요할-때마다-삭제하기)
  - [fetchCache 생성 시점](#fetchcache-생성-시점)
  - [요청 시점에 캐시되는 fetchCache](#요청-시점에-캐시되는-fetchcache)
  - [fetchCache 설정 변경하기](#fetchcache-설정-변경하기)
    - [【1】 only-no-store / only-cache: 절대로 캐시하고 싶지 않은 경우(하고 싶은 경우)](#1-only-no-store--only-cache-절대로-캐시하고-싶지-않은-경우하고-싶은-경우)
    - [【2】 force-cache / force-no-store: 개별 지정을 강제로 덮어쓰고 싶은 경우](#2-force-cache--force-no-store-개별-지정을-강제로-덮어쓰고-싶은-경우)
    - [【3】 default-no-store: 기본적으로 캐시하고 싶지 않은 경우](#3-default-no-store-기본적으로-캐시하고-싶지-않은-경우)
    - [【4】 default-cache: 기본적으로 캐시를 사용하고 싶습니다](#4-default-cache-기본적으로-캐시를-사용하고-싶습니다)
    - [【5】 auto: Next.js의 기본 설정](#5-auto-nextjs의-기본-설정)
    - [fetchCache를 안전하게 활용하는 방법](#fetchcache를-안전하게-활용하는-방법)
    - [추가 내용](#추가-내용)

---

Next.js 앱 라우터는 전역 `fetch` 함수에 어떤 패치를 적용하여 데이터 가져오기를 자동으로 최적화합니다.

여기서 추가된 기능은 바로 가져온 데이터를 캐시하고 재사용하는 최적화인데요.

캐시된 데이터는 필요한 경우 임의의 타이밍에서 Revalidate(데이터 다시 가져오기 및 캐시 업데이트)할 수 있습니다.

오늘은 `fetch` 함수를 통해 캐시되는 "fetchCache"에 대해 어떻게 다루어야 하는지 알아보겠습니다.

아래 공식 문서를 참조해 주세요.

[Next.js 공식 문서 - 데이터 가져오기: 가져오기, 캐싱 및 재유효화](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating)

---

## 데이터 가져오기가 캐시되는 타이밍

데이터 가져오기가 캐시되는 타이밍은 두 가지입니다.

- 빌드 시: Next.js 앱을 `next build`로 빌드한 경우
- 요청 시: `next start`로 시작한 Next.js 앱에 브라우저에서 요청이 발생한 경우

이 캐시되는 타이밍은 Pages Router의 ISR과 유사합니다.

Pages Router는 "페이지 단위" 캐시였지만, App Router에서는 "데이터 가져오기 단위"로 캐시되어 더 세밀한 캐시 전략을 적용할 수 있습니다.

---

## fetchCache를 필요할 때마다 삭제하기

앞서 언급한대로 `next build`로 빌드한 Next.js 앱을 `next start`하지 않으면 캐시 동작을 확인할 수 없습니다.

따라서 개발 서버로 시작한 `next dev`는 제외해야 합니다.

또한 검증 중에 이전 빌드에서 캐시된 파일이 그대로 남아있는 점에 주의해야 하는데요.

로컬 개발 환경에서 캐시는 `.next/cache/fetch-cache` 폴더에 정적 파일로 생성됩니다.

예를 들어 다음과 같은 형식의 파일입니다(prettier 적용한 상태):

```json
.next/cache/fetch-cache/ee9c18264e5cc119a6db9334ae99a0e26fb6975947d8332197a5a152e77f2248
{
  "kind": "FETCH",
  "data": {
    "headers": {
      // ...
    },
    // base64로 인코딩된 본문
    "body": "eyJ0aW1lIjoiMjAyMy0wNy0wOFQwNDo1ODoxMC41NDdaIiwibWV0aG9kIjoiR0VUIn0=",
    "status": 200,
    "tags": [
      "/page"
    ]
  },
  "revalidate": 31536000
}
```

이 캐시 파일이 그대로 남아있으면 변경 사항을 확인 할수 없으니까 설정 값을 변경할 때마다 다음 명령으로 깨끗한 빌드로 재시작해야 합니다.

```sh
rm -rf .next && npm run build && npm start
```

---

## fetchCache 생성 시점

Next.js는 "빌드 시 가능한 한 많은 것을 캐시"하는 방향으로 설계되었습니다.

빌드 시에는 레이아웃과 페이지를 사전 렌더링하고, fetch()가 실행될 때 fetchCache가 생성됩니다.

예를 들어 다음과 같은 경우 dataA가 캐시 가능하면 .next/cache/fetch-cache에 해당 파일이 빌드 시에 생성되는 것을 확인할 수 있습니다.

이러한 캐시 생성을 빌드 환경에서 API 서버와 통신할 수 있도록 설정해야 합니다.

```js
import { cookies } from "next/headers";

export default async function Page() {
  const dataA = await fetchDataA(); // <- 캐시됨 (정적 데이터의 경우)
  return "...";
}
```

Dynamic Functions은 "빌드 시 캐시해서는 안 되는 경계"로 판단되는 함수입니다.

예를 들어 cookies()는 요청 헤더의 쿠키를 참조하는 함수입니다.

이는 "빌드 시점에서 어떤 요청인지를 특정할 수 없다"는 의미입니다.

Dynamic Functions이 빌드 시 데이터 가져오기 중에 실행되면 이후의 데이터 가져오기는 중단됩니다.

즉, Dynamic Functions 사용 후의 dataB는 정적 데이터일지라도 빌드 시 캐시의 대상이 아닙니다.

```js
import { cookies } from "next/headers";

export default async function Page() {
  const dataA = await fetchDataA(); // <- 캐시됨 (정적 데이터의 경우)
  const cookieStore = cookies(); // <- 이후 캐시 중단하는 Dynamic Function
  const dataB = await fetchDataB(); // <- 캐시되지 않음 (정적 데이터일지라도)
  return "...";
}
```

---

## 요청 시점에 캐시되는 fetchCache

빌드 시 Dynamic Functions의 영향으로 캐시되지 않았던 dataB입니다.

그러나 계속해서 캐시되지 않는 것은 아닙니다.

다음과 같이 fetch 함수 옵션에 `{ cache: "force-cache" }`를 지정하는 경우 요청 시에 캐시됩니다.

원하는 데이터를 캐시하려면 명시적으로 force-cache를 지정하면 됩니다.

```js
export async function fetchDataB() {
  const res = await fetch("https://example.api.com/api/data-b", {
    cache: "force-cache",
  });
  const data = await res.json();
  return data;
}
```

이 요청 시점에서 캐시 생성을 확인하려면 해당 페이지를 누군가가 조회해야 합니다.

페이지를 조회한 순간 .next/cache/fetch-cache에 정적 캐시 파일이 추가되는 것을 확인하면 요청 시점 캐시가 잘 작동하고 있는겁니다.

참고로 fetch 함수로 가져온 데이터가 캐시되는지 여부를 판단할 때 요청 메서드는 관계가 없습니다.

POST도 대상이므로 fetch를 통한 GraphQL 데이터도 fetchCache로 캐시됩니다(빌드 시 및 요청 시 공통).

---

## fetchCache 설정 변경하기

지금까지 설명한 fetchCache에 대해 Next.js에서 제공하는 기본 설정을 그대로 사용했습니다.

그러나 이 fetchCache 설정은 필요에 따라 변경할 수 있으며, fetch 함수의 `{ cache }` 옵션을 일괄적으로 수정합니다.

Layout 또는 Page 파일에서 다음과 같이 fetchCache를 export합니다.

```js
export const fetchCache = "auto";
// 'auto' | 'default-cache' | 'only-cache'
// 'force-cache' | 'force-no-store' | 'default-no-store' | 'only-no-store'
```

이 fetchCache 설정은 세그먼트별로 설정할 수 있으며, 세그먼트에 중첩된 모든 Route가 해당 대상입니다.

복잡한 상황을 피하기 위해 이 글에서는 RootLayout에만 설정되어 있다고 가정하겠습니다(만약 RootLayout에 설정하면 모든 fetch 함수가 해당 대상이 됩니다).

또한 공식 문서에도 언급되어 있듯이 이는 고급 설정이므로 실제 필요한 시점에 지정하시기 바랍니다.

### 【1】 only-no-store / only-cache: 절대로 캐시하고 싶지 않은 경우(하고 싶은 경우)

"only-no-store"를 지정하면 개별 fetch 함수에 `{ cache: "force-cache" }`가 지정되어 있으면 빌드 시 오류가 발생합니다.

완전히 인증 요건으로 구성된 프로젝트의 경우 `{ cache: "force-cache" }`가 개별 지정되는 것은 잘못된 경우일 가능성이 높으므로 빌드 오류로 인지할 수 있습니다.

```js
export const fetchCache = "only-no-store";
```

반대로 "only-cache" 지정은 개별 fetch 함수에 `{ cache: "no-store" }`가 지정되어 있으면 빌드 시 오류를 발생시킵니다.

```js
export const fetchCache = "only-cache";
```

이 only-* 지정은 "Dynamic Functions" 사용 전에만 유효 범위가 있습니다.

따라서 Dynamic Functions를 넘어서면 빌드 시 체크를 피할 수 있으므로 현재로서는 그리 효과적이지 않은 것 같습니다.

### 【2】 force-cache / force-no-store: 개별 지정을 강제로 덮어쓰고 싶은 경우

개별 fetch 함수에 지정된 `{ cache }` 옵션을 모두 덮어씁니다.

```js
// 모두 `{ cache: "no-store" }`로 덮어쓰기
export const fetchCache = "force-no-store";

// 모두 `{ cache: "force-cache" }`로 덮어쓰기
export const fetchCache = "force-cache";
```

개별 지정은 "의도적으로" 지정되어 있을 것으로 예상되므로 이 설정을 사용하는 경우는 드문 경우라고 생각합니다.

많은 fetch 함수에 하나씩 작성하는 것이 귀찮은 경우 유용할 수 있습니다.

또는 제3 라이브러리를 사용하고 있어 그 안에 작성된 설정을 덮어써야 하는 경우도 고려될 수 있습니다.

### 【3】 default-no-store: 기본적으로 캐시하고 싶지 않은 경우

기본적으로 캐시하지 않지만, 개별 fetch 함수에 `{ cache: "force-cache" }`가 지정된 경우에만 캐시됩니다.

캐시되는 시점은 Dynamic Functions 사용 전후에 따라 "빌드 시간" 또는 "요청 시간"으로 전환됩니다.

```js
export const fetchCache = "default-no-store";
```

### 【4】 default-cache: 기본적으로 캐시를 사용하고 싶습니다

기본적으로 캐시를 사용하지만, 개별 fetch 함수에 `{ cache: "no-store" }`가 지정된 경우에만 캐시를 차단합니다.

캐시되는 시점은 Dynamic Functions 사용 전후의 fetch 함수 사용으로 인해 "빌드 시간 또는 요청 시간"으로 전환됩니다.

fetchCache 설정을 아무것도 지정하지 않은 경우 `(auto)`와 거의 동일하지만 "Dynamic Functions를 건너뛰어도 요청 시에 캐시"하는 점이 다릅니다.

```js
export const fetchCache = "default-cache";
```

이 fetchCache 설정을 사용하는 경우, `{ cache: "no-store" }`의 개별 지정을 잊어버리면 개인에 연결된 데이터 (동적 데이터)도 캐시될 수 있으므로 주의가 필요합니다.

### 【5】 auto: Next.js의 기본 설정

Next.js에 설정된 기본 fetchCache입니다.

default-cache와 거의 동일하지만 "Dynamic Functions를 건너뛰면 요청 시에 캐시하지 않음"이라는 점이 다릅니다.

요청 시에 캐시를 사용하려면 개별 fetch 함수에 `{ cache: "force-cache" }`를 지정해야 합니다.

```js
export const fetchCache = "auto";
```

---

### fetchCache를 안전하게 활용하는 방법

Next.js는 빌드 시간에 캐시를 적극적으로 사용해야 한다는 철학처럼 보입니다.

생각해 봤을 때 "auto보다 default-cache가 Next.js의 철학에 더 가까운 것은 아닐까?"라는 의문을 품었습니다.

auto는 "Dynamic Functions를 건너뛰면 요청 시에 캐시하지 않음"으로, 캐시되길 원하는 정적 데이터를 가져오려면 개별 fetch 함수에 `{ cache: "force-cache" }`를 지정해야 합니다.

이는 번거로운 일처럼 느껴질 수 있지만, 저는 안전성을 우선시한 결과라고 생각합니다.

요청 시에만 캐시할 수 있는 데이터 가져오기는 Dynamic Functions 사용 후에만 제한됩니다.

헤더 정보를 사용하여 데이터를 가져오든 말든, 이후의 처리는 개인에 연결된 데이터를 가져오는 경우가 많습니다.

이러한 배경 때문에 "force-cache 지정이 없는 데이터의 자동 캐시는 Dynamic Functions를 경계로 하여 중단"하는 판단은 이해됩니다.

이 auto 설정은 안전성과 편의성을 모두 고려한 결과라고 이해할 수 있습니다.

그러나 명백한 구현을 희생한 것처럼 느껴집니다.

공식 문서에서는 이해하기 쉽도록 "fetch()는 자동으로 `{ cache: "force-cache" }`가 설정됩니다"라고 설명을 (일부에서) 생략했지만, 실제로는 Dynamic Functions의 영향이 큽니다.

이는 기본적으로 적용되는 auto 동작을 충분히 설명하지 못해 혼란을 야기할 수 있습니다.

앞으로 App Router fetchCache를 고려할 때, 다음과 같은 방침을 기본적으로 적용할 것으로 생각합니다.

캐시할지 여부를 자동으로 결정하지 않고, 의도적으로 force-cache 또는 no-store를 지정하려고 합니다.

- 인증 요구 사항이 많은 경우 캐시를 신중하게 사용하려고 합니다.
  - export const fetchCache = "default-no-store"를 설정합니다.
  - 캐시되길 원하는 데이터를 가져오려면 반드시 개별적으로 force-cache를 지정합니다.
- 인증 요구 사항이 적은 경우 캐시를 적극적으로 사용하려고 합니다 (사고에 주의).
  - export const fetchCache = "default-cache"를 설정합니다.
  - 캐시되면 안 되는 데이터를 가져오려면 반드시 개별적으로 no-store를 지정합니다.
※참고: 여기서는 비교 요소를 줄이기 위해 일부로 `{ revalidate: 0 }` 옵션을 제외했습니다.

---

### 추가 내용

"Dynamic Functions가 개별 fetch cache 설정을 전환하는 경계"라는 내용을 기재했지만, 정확히는 약간 다릅니다.

여기서 말하는 Dynamic Functions는 next/headers에서 가져오는 cookies와 headers만을 의미합니다.

그러나 Next.js 문서에서는 Dynamic Functions에 searchParams도 포함됩니다.

이 searchParams 참조를 건너뛰기만 한다면, fetchCache의 자동 캐시 설정은 기본 force-cache 상태로 유지됩니다.

이러한 배경 때문에 우리는 안전성을 우선시한 결과로 이러한 동작을 생각했습니다.

끝.


