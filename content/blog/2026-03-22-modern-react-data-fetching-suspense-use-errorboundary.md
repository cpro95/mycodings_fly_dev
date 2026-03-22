---
slug: 2026-03-22-modern-react-data-fetching-suspense-use-errorboundary
title: "모던 리액트 데이터 패칭 완벽 가이드 Suspense와 use API 그리고 에러 바운더리"
summary: "기존의 useEffect를 활용한 데이터 패칭의 한계를 알아보고 리액트 19의 새로운 use API와 Suspense를 활용한 선언적 렌더링 방식을 깊이 있게 살펴봅니다."
date: 2026-03-21T09:15:25.466Z
draft: false
weight: 50
tags: ["React", "Suspense", "use API", "ErrorBoundary", "데이터 패칭", "프론트엔드", "React 19"]
contributors: []
---

**대부분의** 리액트 개발자들은 데이터 패칭 구조를 한 번에 망가뜨리지 않는데요.

보통은 아주 서서히 점진적으로 코드가 복잡해지기 마련입니다.

과거에는 이곳에 'useEffect'를 쓰고 저곳에 로딩 상태를 추가하며 에러 상태까지 묶어서 데이터를 불러오곤 했거든요.

그러다 보면 첫 번째 요청에 의존하는 두 번째 'useEffect'가 생겨나고 또 다른 로딩과 에러 상태가 꼬리를 물게 됩니다.

아마 미래의 자신조차 유지보수하기 힘든 코드를 작성하고 있다는 느낌을 받아보신 적이 있을 텐데요.

동시에 실행되어야 할 요청들이 순차적으로 실행되는 숨겨진 폭포수 문제가 발생합니다.

단순히 다른 데이터의 요청과 응답을 기다리느라 컴포넌트가 불필요하게 다시 렌더링되기도 하거든요.

화면에 의미 있는 변화가 없는데도 로딩 스피너만 빙글빙글 도는 현상을 자주 목격하셨을 겁니다.

사실 이런 문제들은 리액트 자체의 결함이라기보다는 우리가 앱을 설계할 때 반드시 인지해야 할 핵심적인 아키텍처 문제인데요.

이번 가이드에서는 실제 데이터의 의존성을 무시하지 않으면서도 어떠한 마법 없이 데이터 패칭 구조를 근본적으로 개선하는 리액트 패턴을 살펴보겠습니다.

리액트에서 데이터를 불러오는 과정이 유독 어렵게 느껴지셨다면 이 패턴이 아주 명쾌한 해답이 될 텐데요.

리액트의 'Suspense'와 새롭게 도입된 'use' API를 활용하여 데이터를 매끄럽게 불러오는 방법을 차근차근 알아보겠습니다.

더불어 에러가 발생했을 때 'ErrorBoundary'를 통해 아주 우아하게 예외를 처리하는 노하우도 함께 짚어볼 예정이거든요.

이 글을 끝까지 읽으시면서 코드를 직접 따라 쳐보시면 이 패턴이 가진 멘탈 모델을 완벽하게 내 것으로 만드실 수 있습니다.


# 기존 리액트 데이터 패칭 방식의 한계점
리액트에서 데이터 패칭이 왜 고통스러운 작업이 될 수 있는지 알기 위해서는 리액트가 내부적으로 어떻게 동작하는지 이해해야 하는데요.

리액트는 모든 작업을 한 번에 처리하지 않고 명확하게 구분된 단계들을 거쳐 작동합니다.

크게 보면 모든 업데이트는 렌더 단계와 커밋 단계 그리고 이펙트 단계라는 세 가지 독립적인 페이즈를 거치게 되거든요.

렌더 단계에서는 리액트가 UI의 최종 모습을 계산하고 커밋 단계에서는 그 변화를 실제 DOM에 적용하게 됩니다.

그리고 마지막 이펙트 단계에 도달해서야 리액트는 외부 세계와 동기화를 시작하는데요.

이러한 분리는 리액트가 예측 가능하고 중단 가능하며 효율적으로 동작하도록 만드는 아주 의도적인 설계입니다.

그렇다면 우리가 흔히 쓰는 'useEffect'를 통한 데이터 패칭은 이 과정 중 어디에 속하는지 궁금하실 텐데요.

'useEffect'는 렌더링 도중에는 절대 실행되지 않으며 리액트가 UI를 DOM에 반영한 직후에야 비로소 작동을 시작합니다.

즉 리액트가 데이터 없이 빈 컴포넌트를 먼저 렌더링하고 UI를 커밋한 뒤에야 비동기 요청이 출발한다는 뜻이거든요.

```javascript
useEffect(() => {
  fetchData().then(setData);
}, []);
```

이 코드를 보시면 데이터 요청은 화면이 일단 그려진 이후에야 시작된다는 것을 알 수 있습니다.


# 렌더링 이후 패칭 방식의 치명적인 문제
사용자 정보를 먼저 불러온 다음 그 사용자의 ID를 이용해 관련 데이터를 추가로 불러오는 아주 흔한 시나리오를 생각해보면 좋은데요.

전통적인 리액트 데이터 패칭 해결책은 보통 아래와 같은 모습으로 작성됩니다.

```javascript
useEffect(() => {
  fetchUser().then(setUser);
}, []);

useEffect(() => {
  if (!user) return;
  fetchOrders(user.id).then(setOrders);
}, [user]);
```

이 코드에서 실제로 일어나는 일련의 과정들을 유심히 살펴볼 필요가 있는데요.

컴포넌트가 렌더링을 마치고 첫 번째 이펙트가 실행되어 사용자 정보를 가져오면 리액트는 다시 한 번 렌더링을 수행합니다.

그제야 두 번째 이펙트가 실행되면서 주문 정보를 가져오기 시작하거든요.

네트워크 속도가 아무리 빠르더라도 두 번째 요청은 첫 번째 요청이 완료된 후 렌더링이 끝나야만 출발할 수 있는 구조입니다.

이러한 데이터 패칭 패러다임을 '렌더링 이후 패칭'이라고 부르는데요.

여기서 데이터를 불러오는 로직은 데이터 자체의 의존성이 아니라 렌더링 타이밍에 의해 억지로 통제되는 부작용을 낳게 됩니다.

게다가 로딩이나 에러를 처리하기 위해 불필요한 상태값들을 끝없이 만들고 유지보수해야 하는 골칫거리도 함께 생겨나거든요.

이 두 가지 문제를 실용적인 대시보드 프로젝트를 만들어보며 직접 체감해 보겠습니다.


# 전통적 방식으로 대시보드 만들기
중심부에 'useEffect' 훅을 배치한 전통적인 방식으로 간단한 대시보드를 구축해 볼 텐데요.

이 대시보드는 정적인 헤딩 텍스트와 사용자 이름을 환영하는 프로필 섹션 그리고 사용자가 주문한 항목과 분석 지표를 보여주는 총 네 개의 구역으로 나뉩니다.

프로필과 주문 그리고 분석 섹션은 동적인 데이터를 보여주어야 하므로 이를 시뮬레이션할 세 개의 API 호출을 만들어볼 텐데요.

```javascript
export function fetchUser() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: 1, name: "Tapas" });
    }, 1500);
  });
}

export function fetchOrders(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([
          `Order A for user ${userId}`,
          `Order B for user ${userId}`
      ]);
    }, 1500);
  });
}

export function fetchAnalytics(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        revenue: "$12,000",
        growth: "18%",
        userId
      });
    }, 1500);
  });
}
```

이 코드를 자세히 보시면 각 API 함수가 프로미스 객체를 반환하고 있다는 사실을 알 수 있습니다.

실제 네트워크 호출의 지연을 흉내 내기 위해 'setTimeout'을 사용하여 1.5초의 의도적인 딜레이를 주었거든요.

이 시간이 지나면 프로미스가 해결되면서 우리가 원하는 데이터를 얻게 됩니다.

이제 이 API들을 활용하여 본격적으로 대시보드 컴포넌트를 작성해 보아야 하는데요.

```javascript
import { useEffect, useState } from "react";
import { fetchAnalytics, fetchOrders, fetchUser } from "../api";

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState(null);
    const [analytics, setAnalytics] = useState(null);

    useEffect(() => {
        fetchUser().then(setUser);
    }, []);

    useEffect(() => {
        if (!user) return;
        fetchOrders(user.id).then(setOrders);
    }, [user]);

    useEffect(() => {
        if (!user) return;
        fetchAnalytics(user.id).then(setAnalytics);
    }, [user]);

    if (!user || !orders || !analytics) {
        return <p className="text-xl m-3">Loading dashboard...</p>;
    }

    return (
        <div className="m-2">
            <header>
                <h1 className="text-5xl mb-12">Dashboard</h1>
            </header>
            <h2 className="text-3xl">Welcome, {user.name}</h2>
            <h2 className="text-3xl mt-3">Orders</h2>
            <ul>
                {orders.map((o) => (
                    <li className="text-xl" key={o}>{o}</li>
                ))}
            </ul>
            <h2 className="text-3xl mt-3">Analytics</h2>
            <p className="text-xl">Revenue: {analytics.revenue}</p>
            <p className="text-xl">Growth: {analytics.growth}</p>
        </div>
    );
}
```

코드를 하나씩 분해해보면 가장 먼저 사용자 데이터와 주문 그리고 분석 데이터를 담을 세 개의 상태가 눈에 띕니다.

그 아래에는 데이터를 불러오고 상태를 업데이트하기 위한 세 개의 'useEffect'가 복잡하게 얽혀 있거든요.

우리는 지금 명백하게 렌더링 이후 패칭 방법론을 사용하고 있는 셈입니다.

또한 중간에는 사용자나 주문 데이터가 아직 로드되지 않았을 경우 JSX를 처리하지 않고 로딩 메시지를 띄우는 명령형 로직이 강제로 삽입되어 있는데요.

런타임 환경에서 UI가 붕괴되는 것을 막기 위한 임시방편으로는 나쁘지 않지만 결코 선언적인 접근법이라고 볼 수는 없습니다.

선언적 프로그래밍에서는 개발자가 문제를 '어떻게' 해결할지 일일이 명시하는 대신 '무엇을' 달성하고 싶은지만 선언하면 프레임워크가 알아서 처리해 주어야 하거든요.

리액트 본연의 철학이 선언적이라는 점을 생각하면 이러한 예외 처리 역시 선언적인 방식으로 풀어내는 것이 훨씬 더 자연스럽습니다.

로딩 상태를 분리하여 조건부 렌더링을 할 수도 있겠지만 결국 추가적인 상태 관리가 필요하다는 단점은 피할 수 없는데요.

여기에 에러 처리까지 더해진다면 화면을 보여주거나 숨기기 위한 조건부 로직이 폭발적으로 늘어나게 됩니다.

결론적으로 'useEffect' 전략만으로는 리액트에서 데이터를 효과적으로 다루기 어렵기 때문에 우리는 로딩과 에러를 포괄하는 더 나은 패턴을 찾아야만 하거든요.

본질적으로 리액트 'Suspense'는 단순한 로딩 스피너 표시 기능이 아니라 렌더링을 조율하는 강력한 메커니즘입니다.


# Suspense의 진정한 의미
'Suspense'는 컴포넌트가 리액트에게 '나는 아직 화면에 그려질 준비가 되지 않았다'고 알려줄 수 있는 소통 창구 역할을 하는데요.

이 신호를 받으면 리액트는 해당 컴포넌트 트리의 렌더링을 잠시 일시정지하고 필요한 데이터가 도착할 때까지 대체 UI를 화면에 보여주게 됩니다.

이것은 기존 'useEffect'를 활용한 데이터 패칭과는 근본적으로 궤를 달리하는 방식이거든요.

전통적인 접근법에서는 리액트가 무조건 컴포넌트를 한 번 렌더링한 직후에야 데이터를 가져올 수 있는 권한을 얻게 됩니다.

'Suspense'는 이 모델을 완전히 뒤집어 렌더링과 동시에 데이터를 가져오는 패러다임을 가능하게 만들어 주는데요.

데이터 패칭은 리액트가 UI를 커밋하기 전부터 일찌감치 시작될 수 있으며 렌더링 프로세스는 그저 데이터가 준비될 때까지 조용히 기다릴 뿐입니다.

개발자가 언제 로딩 화면을 보여줄지 억지로 추측할 필요 없이 리액트가 'Suspense' 경계를 통해 이를 아주 선언적으로 조율해 내거든요.

비동기 호출을 처리하는 컴포넌트 주변을 'Suspense'로 감싸주기만 하면 모든 준비가 끝나는 셈입니다.

복잡하게 하드코딩된 조건문이나 불필요한 상태 관리 없이도 프로미스가 해결되는 순간 대체 UI가 실제 컴포넌트로 부드럽게 전환되는데요.

여기서 한 걸음 더 나아가 왜 기존 방식이 문제였는지 렌더링 생명주기 관점에서 조금 더 깊이 확장해 설명해 드리고 싶습니다.

리액트는 가상 DOM을 비교하고 실제 DOM에 반영하는 동기적인 작업을 수행하는데 비동기 작업인 데이터 패칭이 이 흐름에 억지로 끼어들려다 보니 상태값의 파편화가 발생했던 것이거든요.

'Suspense'는 비동기 작업 자체를 리액트의 렌더링 파이프라인 내부로 자연스럽게 편입시켜 데이터가 없을 때는 렌더링 자체를 중단하는 'Throw' 방식을 취하게 됩니다.

마치 자바스크립트의 에러 처리처럼 데이터가 없다는 사실을 상위로 던지면 부모의 'Suspense'가 이를 낚아채어 로딩 UI를 보여주는 아주 우아한 구조인데요.

'use' API는 리액트 19에서 새롭게 도입된 기능으로 프로미스를 인자로 받아 그 해결된 값을 곧바로 반환하는 역할을 합니다.


# 리액트 19의 혁신 use API
만약 넘겨받은 프로미스가 아직 해결되지 않았다면 리액트는 렌더링을 멈추고 안전하게 대기 상태로 들어가거든요.

반대로 프로미스가 실패하면 에러를 던지게 되며 이 두 가지 상황 모두 'Suspense'와 'ErrorBoundary'를 통해 선언적으로 완벽하게 통제됩니다.

```javascript
import { use } from "react";

function fetchUser() {
  return fetch("/api/user").then(res => res.json());
}

const userPromise = fetchUser();

export default function Profile() {
  const user = use(userPromise);
  return <h2>Welcome, {user.name}</h2>;
}
```

이 코드에서 우리가 주목해야 할 아주 중요한 포인트들이 몇 가지 있는데요.

우선 'use' 함수는 렌더링 주기 한가운데에서 직접 호출되며 프로미스가 대기 중일 경우 렌더링 자체가 일시 정지됩니다.

무엇보다 놀라운 점은 화면을 그리기 위해 단 하나의 'useEffect'나 로딩 상태값도 사용되지 않았다는 사실이거든요.

'use' API는 다른 프로미스의 결과에 의존하는 연속적인 프로미스 체인도 아주 자연스럽게 읽어낼 수 있을 만큼 강력합니다.

렌더링은 오직 선언적으로 조율되며 '이 데이터가 없으면 이 렌더링은 완료될 수 없다'는 것이 이 패턴의 가장 핵심적인 멘탈 모델인데요.

여기서 많은 분들이 '그냥 컴포넌트에 비동기 처리를 쓰면 안 되나요?'라는 의문을 가지실 수도 있습니다.

서버 컴포넌트 환경에서는 실제로 일반 비동기 사용이 가능하지만 클라이언트 컴포넌트에서는 훅의 순서와 렌더링 생명주기를 보장하기 위해 반드시 'use' API를 거쳐야만 하거든요.

'use' API는 마침내 'Suspense'를 실제 데이터 패칭에 아주 실용적으로 사용할 수 있게 만들어준 일등 공신입니다.


# Suspense와 use API의 결합
'use'가 등장하기 전까지 리액트는 렌더링 도중에 비동기 데이터를 깔끔하게 소비할 수 있는 공식적인 방법을 제공하지 않았는데요.

컴포넌트가 'use'를 통해 데이터를 읽어들이면 리액트는 그 프로미스를 렌더링의 필수 의존성으로 간주하고 처리합니다.

해결되지 않은 프로미스를 만나면 가장 가까운 'Suspense' 경계에서 렌더링을 멈추고 값이 도착하면 그 시점부터 렌더링을 자동으로 재시도하거든요.

```javascript
import { Suspense, use } from "react";

const userPromise = fetch("/api/user").then(res => res.json());

function Profile() {
  const user = use(userPromise);
  return <h2>Welcome, {user.name}</h2>;
}

export default function App() {
  return (
    <Suspense fallback={<p>Loading profile...</p>}>
      <Profile />
    </Suspense>
  );
}
```

코드를 실행하면 'Profile' 컴포넌트가 데이터를 읽으려 시도하고 데이터가 없다면 리액트는 준비된 대체 UI를 화면에 띄워줍니다.

데이터가 도착하는 순간 리액트는 어떤 수동적인 상태 업데이트 과정 없이도 알아서 렌더링을 다시 시작하게 되는데요.

더 이상 상태 관리에 목맬 필요 없이 데이터 흐름 그 자체에만 집중할 수 있는 아주 아름다운 구조입니다.

이제 'Suspense'와 'use' API에 대한 깊은 이해를 바탕으로 앞서 만들었던 대시보드 애플리케이션을 새롭게 작성해 볼 텐데요.

먼저 Vite를 사용해 리액트 19 프로젝트의 뼈대를 생성하고 필요한 API 서비스들을 준비하는 과정이 필요합니다.

'api' 폴더 안에 이전과 동일하게 사용자와 주문 그리고 분석 데이터를 가져오는 지연된 프로미스 함수들을 배치해 주시면 되거든요.

그 다음에는 흩어져 있는 비동기 요청들을 한곳에서 관리하기 위해 중앙 집중식 사용자 리소스 유틸리티를 만들어야 합니다.

'resources' 폴더를 만들고 'userResource.js' 파일에 각각의 페치 메서드를 호출하여 프로미스들을 생성하는 코드를 작성하게 되는데요.

```javascript
import { fetchAnalytics, fetchOrders, fetchUser } from "../api";

let userPromise;
let ordersPromise;
let analyticsPromise;

export function createUserResources() {
  userPromise = fetchUser();
  ordersPromise = userPromise.then(user => fetchOrders(user.id));
  analyticsPromise = userPromise.then(user => fetchAnalytics(user.id));
}

export function getUserResources() {
  return {
    userPromise,
    ordersPromise,
    analyticsPromise
  };
}
```

이 유틸리티에서는 프로미스들을 미리 생성해두는 함수와 나중에 컴포넌트에서 이를 소비할 수 있도록 반환해주는 함수를 노출하고 있습니다.

그렇다면 과연 이 프로미스들은 어느 시점에 생성하는 것이 앱 성능에 가장 유리할지 고민해 보아야 하거든요.

애플리케이션이 처음 구동될 때 즉 메인 엔트리에서 앱이 렌더링되기 직전에 생성을 호출하는 것이 가장 이상적입니다.

여기서 제가 덧붙여 설명드리고 싶은 캐싱에 대한 중요한 인사이트가 하나 더 있는데요.

왜 프로미스들을 컴포넌트 내부가 아닌 외부 변수에 저장하여 관리하는지 그 이유를 정확히 아는 것이 매우 중요합니다.

만약 컴포넌트 내부에서 함수를 호출해 프로미스를 생성한다면 리액트가 렌더링을 재시도할 때마다 매번 새로운 네트워크 요청이 발생하게 되거든요.

이를 방지하기 위해 글로벌 스코프에 프로미스를 캐싱해둔 것이며 실제 상용 서비스에서는 관련 라이브러리가 이 복잡한 캐싱 계층을 완벽하게 대신 처리해 줍니다.

이제 대시보드를 구성할 개별 컴포넌트들을 만들어 볼 차례인데요.

세 개의 컴포넌트를 만들고 각각의 내부에서 유틸리티를 호출해 프로미스를 가져오면 됩니다.

```javascript
import { use } from "react";
import { getUserResources } from "../resources/userResource";

export default function Profile() {
    const { userPromise } = getUserResources();
    const user = use(userPromise);
    return <h2 className="text-3xl">Welcome, {user.name}</h2>;
}
```

리액트에서 임포트한 'use' 함수에 우리가 미리 만들어둔 프로미스를 통과시키기만 하면 모든 준비가 완료되거든요.

프로미스가 해결될 때까지 반환을 유예하다가 데이터가 도착하면 사용자의 이름을 추출하여 곧바로 화면에 그려내게 됩니다.

'Orders'와 'Analytics' 컴포넌트 역시 완전히 동일한 흐름을 타기 때문에 아주 일관된 코드 작성이 가능한데요.

이제 컴포넌트들이 비동기 데이터를 다룰 준비를 마쳤으니 이들이 데이터를 기다리는 동안 보여줄 스켈레톤 UI를 준비해야 합니다.

```javascript
export const ProfileSkeleton = () => <p className="text-3xl m-2">Loading user...</p>;
export const OrdersSkeleton = () => <p className="text-3xl m-2">Loading orders...</p>;
export const AnalyticsSkeleton = () => <p className="text-3xl m-2">Loading analytics...</p>;
```

이 단순한 스켈레톤 컴포넌트들은 'Suspense'의 폴백 속성으로 전달되어 훌륭한 시각적 피드백을 제공하게 될 텐데요.

마지막으로 이 모든 조각들을 하나로 묶어줄 대망의 대시보드 컴포넌트를 조립해 보겠습니다.

```javascript
import { Suspense } from "react";
import Analytics from "../components/Analytics";
import Orders from "../components/Orders";
import Profile from "../components/Profile";
import {
    AnalyticsSkeleton,
    OrdersSkeleton,
    ProfileSkeleton,
} from "../components/Skeletons";

export default function Dashboard() {
    return (
        <div className="m-2">
            <header>
                <h1 className="text-5xl mb-12">Dashboard</h1>
            </header>

            <Suspense fallback={<ProfileSkeleton />}>
               <Profile />
            </Suspense>
            <Suspense fallback={<OrdersSkeleton />}>
               <Orders />
            </Suspense>
            <Suspense fallback={<AnalyticsSkeleton />}>
               <Analytics />
            </Suspense>
        </div>
    );
}
```

코드의 형태만 보아도 이전의 복잡했던 'useEffect' 방식과 비교해 얼마나 극적으로 깔끔해졌는지 한눈에 알 수 있거든요.

조건부 JSX 렌더링은 온데간데없이 사라졌고 상태 동기화를 위한 그 어떤 수동적인 개입도 남아있지 않습니다.

각각의 섹션은 독립적으로 데이터를 불러오며 하나의 요청이 늦어진다고 해서 전체 UI가 멈춰버리는 끔찍한 일은 발생하지 않는데요.

이처럼 'Suspense'와 'use' API의 조합은 개발 경험과 사용자 경험 모두를 비약적으로 끌어올리는 아주 거대한 승리입니다.


# Error Boundary를 통한 우아한 에러 처리
지금까지는 모든 네트워크 요청이 성공적으로 이루어지는 행복한 경로만을 살펴보았지만 실무에서 에러 처리는 선택이 아닌 필수이거든요.

만약 주문 데이터를 가져오는 프로미스가 모종의 이유로 거부된다면 우리는 이 상황을 어떻게 현명하게 대처해야 할지 고민해 보아야 합니다.

테스트를 위해 주문 페치 함수 내부에 무작위 숫자를 활용하여 절반의 확률로 의도적인 에러를 발생시켜 볼 텐데요.

```javascript
export function fetchOrders(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.5) {
        reject(new Error("Failed to fetch orders"));
      } else {
        resolve([
          `Order A for user ${userId}`,
          `Order B for user ${userId}`
        ]);
      }
    }, 1500);
  });
}
```

이 상태로 화면을 새로고침하다 보면 어느 순간 하얀 빈 화면과 함께 콘솔에 에러가 붉게 물드는 것을 목격하게 됩니다.

단 하나의 컴포넌트에서 발생한 작은 렌더링 에러가 거대한 리액트 트리 전체를 붕괴시켜버린 아주 치명적인 상황이거든요.

이러한 참사를 막고 실패를 체계적으로 다루기 위해 리액트 생태계에는 'ErrorBoundary'라는 아주 든든한 방어막이 존재합니다.

이는 렌더링 도중 던져진 에러를 중간에 가로채어 트리가 깨지는 것을 막고 준비된 에러 UI를 대신 보여주는 특수한 컴포넌트인데요.

```javascript
import { Component } from "react";
import { createUserResources } from "../resources/userResource";

export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  handleRetry = () => {
    this.setState({ error: null });
    createUserResources();
  };

  render() {
    if (this.state.error) {
      return (
        <div className="border border-red-700 rounded p-1">
          <p className="text-xl">{this.state.error.message}</p>
          <button
                className="bg-orange-400 rounded-xl p-1 text-black cursor-pointer"
                onClick={this.handleRetry}>
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

이 컴포넌트가 함수형이 아닌 클래스형으로 작성된 이유는 에러를 포착하는 전용 생명주기 메서드들이 클래스에서만 지원되기 때문입니다.

전용 메서드는 자식 컴포넌트가 에러를 던질 때 리액트에 의해 자동으로 호출되어 에러 상태를 업데이트하게 되거든요.

에러가 발생하면 재시도 버튼이 포함된 폴백 UI가 나타나고 사용자가 버튼을 누르면 상태를 초기화하여 앱이 스스로 회복할 수 있는 기회를 제공합니다.

이제 우리가 만든 대시보드의 각 'Suspense' 경계 바깥쪽을 이 컴포넌트로 단단하게 감싸주기만 하면 되는데요.

```javascript
import { Suspense } from "react";
import Analytics from "../components/Analytics";
import ErrorBoundary from "../components/ErrorBoundary";
import Orders from "../components/Orders";
import Profile from "../components/Profile";
import {
    AnalyticsSkeleton,
    OrdersSkeleton,
    ProfileSkeleton,
} from "../components/Skeletons";

export default function Dashboard() {
    return (
        <div className="m-2">
            <header>
                <h1 className="text-5xl mb-12">Dashboard</h1>
            </header>

            <ErrorBoundary>
                <Suspense fallback={<ProfileSkeleton />}>
                    <Profile />
                </Suspense>
            </ErrorBoundary>

            <ErrorBoundary>
                <Suspense fallback={<OrdersSkeleton />}>
                    <Orders />
                </Suspense>
            </ErrorBoundary>

            <ErrorBoundary>
                <Suspense fallback={<AnalyticsSkeleton />}>
                    <Analytics />
                </Suspense>
            </ErrorBoundary>
        </div>
    );
}
```

이제 주문을 불러오는 과정에서 에러가 터지더라도 나머지 프로필이나 분석 UI는 전혀 타격을 입지 않고 멀쩡하게 화면에 남아있게 됩니다.

에러가 발생한 주문 영역에만 재시도 버튼이 나타나기 때문에 사용자에게 훨씬 더 쾌적하고 유연한 대처 경험을 선사할 수 있거든요.

'Suspense'와 'use' API 그리고 'ErrorBoundary'가 만들어내는 이 견고한 삼각 편대는 리액트의 확장성을 극대화하는 최고의 조합입니다.

단순히 코드를 짧게 줄여주는 것을 넘어 복잡한 비동기 상황을 우리의 통제력 아래로 완전히 가져올 수 있게 해주는데요.

앞으로 여러분의 프로젝트에서 데이터를 불러오실 때 이 선언적인 패턴들이 아주 강력한 무기가 되어줄 것이라 확신합니다.

직접 코드를 타이핑해보며 이 즐거운 변화의 흐름을 여러분의 손끝으로 직접 경험해 보시기를 진심으로 권장해 드리거든요.

