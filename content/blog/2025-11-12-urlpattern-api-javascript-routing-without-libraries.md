---
slug: 2025-11-12-urlpattern-api-javascript-routing-without-libraries
title: "URL 라우팅, 이제 라이브러리 없이 순수 자바스크립트로 끝내는 법"
summary: "복잡한 정규식이나 외부 라이브러리 없이 URL 라우팅과 파싱을 해결하는 표준 API, URLPattern의 사용법을 알아봅니다. 더 깔끔하고 의존성 없는 코드를 작성해보세요."
date: 2025-11-12T11:53:25.054Z
draft: false
weight: 50
tags: ["URLPattern", "URL 라우팅", "자바스크립트", "정규식", "프론트엔드", "서비스 워커", "API"]
contributors: []
---

![URL 라우팅, 이제 라이브러리 없이 순수 자바스크립트로 끝내는 법](https://blogger.googleusercontent.com/img/a/AVvXsEjdwWL7EHG7HPcKGZb58uMi499tWsV5Q4CYjXqBOT7hHvDX0vyEJCII8lV64tnIOJgIOF1h2SpzFkGHPEXPM9WJouiPx-40Pu3Q2kwL0MFwB410DVewHiWZDUzehtOTUNpr8fSrEtwLoQ_kAgdD9ZkL8oqerhk2AdoLw2NLcMK7ZDpvzBF3PZ3juMUE8oQ=s16000)

URL 변경에 따라 동작하는 기능을 만들다 보면 복잡한 정규 표현식을 짜거나 라우팅을 위해 외부 라이브러리를 끌어다 써야 했던 경험이 다들 있으실 텐데요.

이제 '베이스라인(Baseline)'에 포함되어 모든 브라우저에서 사용 가능해진 'URL 패턴 API(URL Pattern API)'가 바로 이 흔한 문제에 대한 표준화되고 강력한 해결책을 제시합니다.

덕분에 `.exec()`나 `.test()` 같은 메서드를 사용하면 익숙한 문법으로 URL을 매칭하고 데이터를 추출하는 일이 훨씬 수월해지거든요.


```javascript
const pattern = new URLPattern({ pathname: "/products/:id" });
console.log(pattern.test("https://example.com/products/123")); // true
```

이 모든 기능은 `URLPattern` 인터페이스에 담겨있습니다.

이번 글에서는 흔히 마주치는 몇 가지 문제 상황에서 이 API를 활용하여 코드베이스를 개선하는 방법을 자세히 살펴보겠습니다.


## 기본적인 URL 패턴 매칭
URL 패턴 API가 없던 시절에는 URL을 파싱하기 위해 구형 `URL` 인터페이스를 사용한 뒤, `.pathname` 속성에 또다시 복잡한 정규 표현식을 적용해 매칭 여부를 확인해야 했는데요.


```javascript
const url = new URL(location.href);
const pathRegex = /^\/users\/([a-zA-Z0-9]+)\/?$/;
const isMatch = pathRegex.test(url.pathname);
```

URLPattern을 사용하면 이 작업이 훨씬 적은 코드로, 더 읽기 쉽게 완성됩니다.


```javascript
const pattern = new URLPattern({ pathname: "/users/:id" });
const isMatch = pattern.test(location.href);
```

## 동적 파라미터 추출하기

URL에서 동적 파라미터를 추출해야 할 때도 URLPattern이 아주 유용한데요.

과거에는 숫자로 된 정규식 캡처 그룹에 의존하는 경우가 많았는데, 이 방식은 순서에 의존하기 때문에 캡처 그룹의 순서가 바뀌면 코드가 쉽게 망가지는 단점이 있습니다.


```javascript
const pathRegex = /^\/books\/([a-z]+)\/(\d+)\/?$/;
const result = pathRegex.exec("/books/classics/12345");

// `result`는 배열입니다
// ["/books/classics/12345", "classics", "12345"]
const category = result ? result[1] : null;
const bookId = result ? result[2] : null;
```

반면 URLPattern은 이름이 지정된 파라미터가 담긴 구조화된 `groups` 객체를 반환하거든요.

패턴에 사용된 키가 결과 객체의 키와 직접 대응되기 때문에 훨씬 명시적이고 안정적인 코드가 완성됩니다.


```javascript
// /books/<category>/<id> 패턴
const pattern = new URLPattern({ pathname: "/books/:category/:id" });
const result = pattern.exec("/books/classics/12345");

// `result.pathname.groups`는 아래 객체를 반환합니다
// { category: "classics", id: "12345" }
const { category, id: bookId } = result.pathname.groups;
```

## 여러 부분으로 구성된 매칭 처리하기

과거에 URL의 여러 부분을 조합해서 매칭하려면 `URL` 생성자로 호스트 이름이나 경로 같은 각 부분을 추출한 뒤, 각각에 대해 개별적인 검사나 정규 표현식을 실행해야 했는데요.


```javascript
const url = new URL(req.url);

if (url.hostname.endsWith(".cdn.com") && url.pathname.startsWith("/images/")) {
  // 로직 실행
}
```

URLPattern은 이 기능을 예측 가능한 제어 방식으로 기본 지원합니다.


```javascript
const pattern = new URLPattern({ hostname: "*.cdn.com", pathname: "/images/*" });

if (pattern.test(req.url)) {
  // 로직 실행
}
```

## 프로젝트 의존성

URLPattern이 없던 시절에는 안정적인 라우팅 로직을 구현하기 위해 외부 라이브러리에 의존하는 경우가 많았는데요.

이 때문에 애플리케이션 번들 크기가 불필요하게 커지는 문제가 있었습니다.

이제 URLPattern이 모든 브라우저의 표준 기능이 되었기 때문에 이런 작업을 위해 더 이상 의존성을 추가할 필요가 없어졌거든요.

번들 크기를 줄이고 의존성 관리 부담을 없애는 것은 물론, 모든 주요 브라우저 엔진에서 동일하게 동작하는 고성능 네이티브 구현의 이점을 누릴 수 있습니다.


## 상세 활용법

URLPattern의 진가는 기본적이면서도 고급 사용 사례까지 모두 처리할 수 있다는 점인데요.

간단한 경로 매칭으로 시작해서 필요에 따라 더 강력한 기능들을 점진적으로 추가해 나갈 수 있습니다.


### 경로 매칭 및 파라미터 추출

URL 패턴 매칭의 가장 흔한 사용 사례는 바로 클라이언트 사이드 라우팅인데요.

URLPattern을 사용하면 이 과정이 무척 깔끔해집니다.

`.test()`로 URL이 패턴과 일치하는지 확인하고, `.exec()`로 동적인 부분을 추출할 수 있거든요.


```javascript
const pattern = new URLPattern({ pathname: "/products/:category/:id" });

// .test()로 boolean 값 확인
console.log(pattern.test("https://example.com/products/electronics/123")); // → true
console.log(pattern.test("https://example.com/blog")); // → false

// .exec()로 이름이 지정된 그룹 추출
const result = pattern.exec("https://example.com/products/electronics/123");

if (result) {
  const { category, id } = result.pathname.groups;
  console.log(`Loading product ${id} from the ${category} category.`); // → "Loading product 123 from the electronics category."
}
```

### 서브도메인 등 다양한 조건 매칭

많은 라우팅 라이브러리와 달리, URLPattern은 URL 전체를 매칭하는 강력한 기능을 제공하는데요.

특정 서브도메인으로 들어오는 API 호출을 라우팅하는 것처럼, 호스트 이름에 따라 다르게 동작하는 앱을 만들 때 아주 유용합니다.

아래 예제는 `api` 서브도메인과 특정 경로로 들어오는 요청만 매칭하는 패턴입니다.


```javascript
const apiPattern = new URLPattern({
  hostname: ":subdomain.myapp.com",
  pathname: "/api/v:version/*"
});

const result = apiPattern.exec("https://api.myapp.com/api/v2/users");

if (result) {
  const { subdomain, version } = result.hostname.groups;
  console.log(`Request to the '${subdomain}' subdomain, API version ${version}.`); // → "Request to the 'api' subdomain, API version 2."
}
```

### 와일드카드와 정규 표현식 활용

단순한 이름 지정 그룹만으로는 부족한 유연성이 필요할 때가 있거든요.

URLPattern은 와일드카드(`*`)는 물론, 패턴 안에 정규 표현식을 직접 포함하는 기능까지 지원하여 훨씬 세밀한 제어가 가능합니다.

예를 들어, 아래 패턴은 특정 사용자 자산 폴더 내의 모든 이미지 파일을 찾으면서 동시에 사용자 ID가 '숫자'인지까지 검증하는데요.


```javascript
// :userId(\\d+) - 'userId' 그룹을 매칭하되, 한 개 이상의 숫자로만 구성된 경우에만 해당
// * - 다음 구분자(예: '.')가 나오기 전까지 모든 문자를 매칭하는 와일드카드
const assetPattern = new URLPattern({
  pathname: "/users/:userId(\\d+)/assets/*.(jpg|png|gif)"
});

const result1 = assetPattern.exec("/users/123/assets/profile.jpg");
console.log(result1?.pathname.groups.userId); // → "123" (매칭 성공)

const result2 = assetPattern.exec("/users/abc/assets/avatar.png");
console.log(result2); // → null ('abc'가 숫자가 아니므로 매칭 실패)
```

## 실제 활용 예시 서비스 워커 라우팅

서비스 워커는 URLPattern을 활용하기에 완벽한 환경인데요.

복잡한 정규식이나 `url.includes()`에 의존하는 지저분한 조건문 없이도, `fetch` 요청을 깔끔하게 가로채서 각기 다른 캐싱 전략을 적용할 수 있습니다.


```javascript
// 서비스 워커 파일 내부

const IMAGE_ASSETS = new URLPattern({ pathname: "/images/*" });
const API_CALLS = new URLPattern({ pathname: "/api/*" });

self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  if (IMAGE_ASSETS.test(url)) {
    // 이미지에 대해서는 캐시 우선 전략 적용
    event.respondWith(cacheFirst(event.request));
  } else if (API_CALLS.test(url)) {
    // API 호출에 대해서는 네트워크 우선 전략 적용
    event.respondWith(networkFirst(event.request));
  }
});
```

수년간 브라우저에서 URL 라우팅을 한다는 것은 복잡한 정규 표현식이나 외부 라이브러리를 사용하는 것을 의미했는데요.

URLPattern은 브라우저에 내장된 강력하고 표준화된 해결책을 제시하며 이 모든 것을 바꾸고 있습니다.

그러니 다음에 URL을 파싱하기 위해 정규 표현식을 작성하려는 순간이 온다면, 잠시 멈추고 URLPattern을 떠올려보세요.

기존 코드의 복잡한 라우팅 모듈을 리팩토링하거나 다음 서비스 워커에서 `fetch` 요청을 처리하는 데 사용해보는 건 어떨까요?

코드가 훨씬 단순해지고, 어쩌면 그 과정에서 의존성 하나를 덜어낼 수도 있을 겁니다.

URL 패턴 API에는 이 글에서 다룬 것보다 훨씬 더 많은 기능이 담겨 있거든요.

모든 기능에 대한 자세한 정보와 전체 레퍼런스가 궁금하다면 'MDN 웹 문서(MDN Web Docs)'의 종합 문서를 확인해 보시기 바랍니다.
