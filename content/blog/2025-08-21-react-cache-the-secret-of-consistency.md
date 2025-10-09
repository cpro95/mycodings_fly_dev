---
slug: 2025-08-21-react-cache-the-secret-of-consistency
title: React Cache 그냥 쓰셨나요? (숨겨진 일관성의 비밀)
date: 2025-08-23 06:22:43.632000+00:00
summary: React의 cache 함수는 단순한 성능 최적화 도구가 아닙니다. React 서버 컴포넌트(RSC) 환경에서 데이터 일관성을 보장하는 핵심 API로서 cache의 진짜 역할을 깊이 있게 파헤칩니다.
tags: ["React", "React Cache", "React Server Components", "RSC", "데이터 일관성", "데이터 페칭"]
contributors: []
draft: false
---

[원본 링크](https://twofoldframework.com/blog/react-cache-its-about-consistency)

여기 아주 좋은 해외 아티클이 있는데요, 이 글의 핵심만 전체적으로 살펴볼까 힙니다.<br /><br />React 서버 컴포넌트(RSC) 환경에서 데이터 페칭을 다뤄보신 분이라면 아마 `React.cache` 함수를 몇 번쯤은 사용해보셨을 거예요.<br /><br />대부분 이 함수를 네트워크 요청을 메모이제이션해서 최적화하는 기술 정도로 알고 계실 텐데요.<br /><br />하지만 오늘 이 글을 통해, `cache` 함수를 단순히 최적화 기법을 넘어 전체 RSC 렌더링 과정에서 '일관성'을 보장하는 아주 중요한 API로 바라봐야 한다는 점을 이야기해볼까 합니다.<br /><br />

## 가장 흔한 사용법, 데이터 페칭 중복 제거

`React.cache`의 가장 대표적인 사용 사례는 여러 컴포넌트가 동일한 외부 데이터에 접근할 때 요청을 중복으로 보내지 않도록 막아주는 역할이죠.<br /><br />예를 들어, 두 개의 다른 컴포넌트가 모두 `react.dev` 홈페이지의 HTML 소스를 필요로 하는 상황을 한번 볼게요.<br /><br />

```javascript
import { cache } from "react";

export default function Page() {
  return (
    <div>
      <ReactsPageTitle />
      <ReactsPageDescription />
    </div>
  );
}

async function ReactsPageTitle() {
  const reactsHtml = await getPage("https://react.dev");
  const title = reactsHtml.match(/<title>(.*?)<\/title>/)[1];
  return (
    <div>
      <p>Page title: {title}</p>
    </div>
  );
}

async function ReactsPageDescription() {
  const reactsHtml = await getPage("https://react.dev");
  const description = reactsHtml.match(
    /<meta name="description" content="(.*?)"/,
  )[1];
  return (
    <div>
      <p>Page description: {description}</p>
    </div>
  );
}

const getPage = cache(async (url) => {
  const res = await fetch(url);
  const html = await res.text();
  return html;
});
```

이 코드에서 `cache` 함수가 정말 빛을 발하는데요.<br /><br />`ReactsPageTitle`과 `ReactsPageDescription` 두 컴포넌트 모두 `getPage` 함수를 호출하지만, `getPage`가 `cache`로 감싸져 있기 때문에 실제 `fetch` 요청은 단 한 번만 발생합니다.<br /><br />그 결과를 두 컴포넌트가 공유하게 되는 거죠.<br /><br />덕분에 각 컴포넌트는 데이터 페칭 로직을 부모로 끌어올리거나 props로 내려받을 걱정 없이 독립적으로 유지할 수 있습니다.<br /><br />

## 단순한 최적화를 넘어서

그런데 여기서 아주 흥미로운 점이 하나 있는데요.<br /><br />만약 위 코드에서 `cache` 함수를 제거하더라도, 두 컴포넌트의 동작은 사실상 똑같을 거라는 점입니다.<br /><br />물론 최적화 측면에서는 비효율적이겠지만, 최종적으로 렌더링되는 결과물 자체는 `cache`를 쓰나 안 쓰나 동일하죠.<br /><br />이것만 보면 `cache`는 그저 느린 외부 데이터 요청을 최적화하기 위한 메모이제이션 도구라고 생각하기 쉬운데요.<br /><br />하지만 발표자는 여기에 훨씬 더 깊은 의미가 숨어있다고 주장합니다.<br /><br />

## 외부 페칭과의 '일관성' 문제

`cache`가 없는 데이터 페칭 함수를 사용해서 앱을 만들고, 거기서 발생하는 미묘한 버그를 `cache`만으로 해결하는 과정을 따라가 보죠.<br /><br />먼저, 컴포넌트 트리를 조금 더 복잡하게 만들어 볼 건데요.<br /><br />렌더링에 시간이 걸리는 `SlowComponent`를 추가하고 `Suspense`로 감싸보겠습니다.<br /><br />

```javascript
export default function Page() {
  return (
    <div>
      <ReactsPageTitle />

      <Suspense fallback={<div>Loading...</div>}>
        <SlowComponent>
          <ReactsPageDescription />
        </SlowComponent>
      </Suspense>
    </div>
  );
}
```

혹시 여기서 발생할 수 있는 잠재적인 버그가 보이시나요?<br /><br />바로 '데이터의 불일치' 문제입니다.<br /><br />`ReactsPageDescription` 컴포넌트가 `SlowComponent` 안에 들어가면서 `ReactsPageTitle`보다 늦게 렌더링되는데요.<br /><br />이로 인해 두 컴포넌트의 데이터 페칭 시점 사이에 시간적 '간격'이 생기게 되죠.<br /><br />만약 이 간격 동안 `react.dev`의 HTML 내용이 바뀐다면 어떻게 될까요?<br /><br />우리는 서로 다른 버전의 페이지 제목과 설명을 화면에 표시하게 되는 끔찍한 상황을 맞이하게 됩니다.<br /><br />마치 UI가 찢어지는 것처럼 보이는 'UI 테어링(UI Tearing)' 현상이죠.<br /><br />이런 버그를 해결하는 방법이 바로 `getPage` 함수를 `cache`로 감싸는 겁니다.<br /><br />

```javascript
import { cache } from "react";

const getPage = cache(async (url) => {
  const res = await fetch(url);
  const html = await res.text();
  return html;
});
```
<br />
이렇게 하면 `ReactsPageTitle`과 `ReactsPageDescription`은 렌더링 시점이 다르더라도, 항상 동일한 버전의 HTML 데이터를 사용하게 됩니다.<br /><br />`cache`가 해당 렌더링 사이클에서 `getPage("https://react.dev")`의 첫 번째 호출 결과를 기억해두었다가, 두 번째 호출에 그대로 돌려주기 때문이죠.<br /><br />여기서 중요한 점은 `React.cache`의 생명주기가 아주 짧다는 건데요.<br /><br />오직 '현재 RSC 렌더링' 동안에만 유효합니다.<br /><br />페이지를 새로고침하면 새로운 `fetch` 요청이 발생하고 캐시도 새로 생성되죠.<br /><br />`cache`는 미래의 렌더링을 위한 것이 아니라, '현재 렌더링'의 일관성을 위한 도구인 셈입니다.<br /><br />

## SQL 쿼리와의 '일관성'

`fetch` 요청은 Next.js 같은 프레임워크가 자동으로 `cache` 처리를 해주는 경우가 많아서 이런 문제를 겪을 확률이 적은데요.<br /><br />하지만 SQL 쿼리처럼 직접 다뤄야 하는 경우에는 `cache`의 중요성이 더욱 부각됩니다.<br /><br />총 판매량과 총 판매 금액을 보여주는 대시보드 컴포넌트를 한번 보시죠.<br /><br />

```javascript
export function DashboardPage() {
  return (
    <div>
      <TotalSalesVolume />
      <TotalSalesAmount />
    </div>
  );
}

async function TotalSalesVolume() {
  const result = await db.query("SELECT count(*) as volume FROM sales");
  return <div>Total sales volume: {result.volume}</div>;
}

async function TotalSalesAmount() {
  const result = await db.query("SELECT SUM(amount) as amount FROM sales");
  return <div>Total sales amount: {result.amount}</div>;
}
```

여기에도 아까와 똑같이 `SlowComponent`를 추가하면 동일한 문제가 발생합니다.<br /><br />두 컴포넌트의 렌더링 시점 차이로 인해, 중간에 새로운 판매 데이터가 추가되면 판매량과 판매 금액이 서로 맞지 않는 불일치 상태가 될 수 있죠.<br /><br />이번에는 문제가 좀 더 까다로운데요.<br /><br />두 컴포넌트가 서로 다른 쿼리를 실행하기 때문에, 단순히 쿼리 함수 하나를 캐싱한다고 해결되지 않습니다.<br /><br />우리는 두 컴포넌트 모두가 '전체 RSC 렌더링' 동안 일관성을 유지할 수 있는 공통된 데이터를 찾아야 하죠.<br /><br />바로 '시간'입니다.<br /><br />

```javascript
import { cache } from "react";

const now = cache(() => new Date());

const getSalesVolume = cache(() =>
  db.query("SELECT count(*) as volume FROM sales where created_at <= ?", [
    now(), 
  ]),
);

const getSalesAmount = cache(() =>
  db.query("SELECT SUM(amount) as amount FROM sales where created_at <= ?", [
    now(), 
  ]),
);
```

이 코드가 정말 기가 막힌데요.<br /><br />`now`라는 함수를 `cache`로 감쌌습니다.<br /><br />이제 어떤 컴포넌트가 `now()`를 처음 호출하면 그 시점의 `Date` 객체가 생성되고 캐시되는데요.<br /><br />그 이후에 다른 컴포넌트가 `now()`를 호출하면, 새로 생성하는 대신 캐시된 동일한 `Date` 객체를 받게 되죠.<br /><br />덕분에 두 컴포넌트는 렌더링 시점이 달라도 정확히 '동일한 시점'을 기준으로 데이터베이스를 쿼리할 수 있게 되어 데이터의 일관성을 완벽하게 지킬 수 있습니다.<br /><br />이 예제에서 중요한 점은, 우리가 `new Date()`의 성능이 느려서 `cache`를 쓴 게 아니라는 겁니다.<br /><br />오히려 우리는 `new Date()`가 호출될 때마다 '다른 값'을 반환하는 것을 막고, 렌더링 내내 '같은 값'을 유지하기 위해 `cache`를 사용한 거죠.<br /><br />

## '불순한 데이터(Impure Data)'를 다루는 법

`fetch` 요청, SQL 쿼리, `new Date()` 생성자는 모두 공통점이 있는데요.<br /><br />바로 '불순한(impure) 데이터'에 접근한다는 점입니다.<br /><br />이 함수들은 호출될 때마다 다른 결과를 반환할 수 있거든요.<br /><br />이런 불순한 함수들은 일관성의 가장 큰 적입니다.<br /><br />이들이 반환하는 값이 계속 변할 수 있다는 사실 자체가, 우리 React 컴포넌트가 모순되고 혼란스러운 페이지를 렌더링할 문을 열어주는 셈이죠.<br /><br />

## 예측 가능한 컴포넌트 트리

우리가 다루기 쉬운 좋은 React 컴포넌트를 생각할 때 떠오르는 단어는 바로 '예측 가능성'입니다.<br /><br />React 컴포넌트는 몇 번을 렌더링하든, 트리 어디에 위치하든, `Suspense`에 감싸여 있든 상관없이 예측 가능한 결과를 내놓아야 하죠.<br /><br />RSC의 등장으로 컴포넌트 안에서 직접 데이터를 가져올 수 있게 되면서, 렌더링 간의 예측 가능성은 조금 낮아졌습니다.<br /><br />데이터는 변할 수 있고, 페이지를 새로고침하면 최신 데이터를 보는 것이 당연하니까요.<br /><br />하지만 '동일한 렌더링' 내에서는 컴포넌트가 일관되고 예측 가능한 결과를 출력해야만 합니다.<br /><br />만약 컴포넌트가 불순한 데이터를 사용한다면, '일관성'을 위해 반드시 `cache`를 사용해야 한다는 뜻이죠.<br /><br />

## 마치며

발표자는 마지막으로 재미있는 상상을 제안하는데요.<br /><br />만약 React가 불순한 데이터에 접근할 때 `cache`로 감싸지 않으면 에러를 던진다면 어떨까요?<br /><br />아마 개발자들은 엄청난 보일러플레이트 때문에 싫어하겠지만, 처음부터 일관성 버그를 피하고 더 예측 가능한 컴포넌트를 만들도록 강제하는 좋은 습관을 들일 수 있을지도 모릅니다.<br /><br />이것이 바로 우리가 불순한 데이터에 접근하는 새로운 컴포넌트를 만들 때마다 스스로에게 던져야 할 질문이죠.<br /><br />'이 컴포넌트가 재사용 가능하길 바라는가?'<br /><br />'이 컴포넌트가 트리 어디에서든 렌더링될 수 있길 바라는가?'<br /><br />'이 컴포넌트가 예측 가능하길 바라는가?'<br /><br />이 질문들에 '예'라고 답한다면, `React.cache`와 그것이 보장하는 '일관성'에 대해 깊이 이해하는 것이 정말 중요할 겁니다.<br /><br />
