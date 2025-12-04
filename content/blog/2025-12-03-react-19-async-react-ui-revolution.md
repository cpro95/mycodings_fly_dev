---
slug: 2025-12-03-react-19-async-react-ui-revolution
title: "React 19와 Async React가 가져올 UI 혁명, 이제 수동 상태 관리는 그만"
summary: "비동기 UI 개발의 고통을 끝낼 React 19의 새로운 기능들을 소개합니다. useTransition, useOptimistic 등 핵심 훅의 사용법을 완벽하게 정리했습니다."
date: 2025-12-04T12:35:25.852Z
draft: false
weight: 50
tags: ["React 19", "Async React", "useTransition", "useOptimistic", "Suspense", "useDeferredValue", "Frontend"]
contributors: []
---

![React 19와 Async React가 가져올 UI 혁명, 이제 수동 상태 관리는 그만](https://blogger.googleusercontent.com/img/a/AVvXsEgr_P_vbKgrljls-Gm7_Q94A5hP7OGGDjiZ4NqZq0cUJXCAeOxSriFZ63Fo7ho_lEsmt12FiMbXbcDJham42JrUyfgIZh1Wjqm5xJzzk3myWV9Lzbqupz9NkwIb9NtsomHN7FiIGPDnwgrqDWOtBu86bPddi0h14xq8FI5lK3012XK6vxkGx3yQWs2xW7w=s16000)

비동기 UI를 구축하는 일은 개발자들에게 늘 골치 아픈 숙제였는데요.

데이터를 불러오는 동안 화면을 로딩 스피너로 가려야 하고, 네트워크 응답 순서가 뒤바뀌면서 검색 결과가 엉키는 '경쟁 상태(Race Condition)'를 막기 위해 애써야 했거든요.

거기에 폼 하나를 제출하려고 해도 로딩 상태, 에러 메시지, 성공 처리까지 수많은 상태(State)를 일일이 관리해야 하는 번거로움이 있었습니다.

이는 단순한 성능 문제가 아니라, 복잡한 상태를 어떻게 조율하느냐에 대한 '조정(Coordination)'의 문제였습니다.

하지만 이제 React 19와 함께 등장한 'Async React' 개념이 이 모든 고민을 선언적으로 해결해 줄 예정입니다.

### Async React, 개발의 패러다임을 바꾸다

React 팀은 이 새로운 변화를 단순한 기능 추가가 아닌, 개발 방식의 근본적인 전환이라고 이야기하는데요.

개발자가 모든 컴포넌트에서 비동기 처리를 위해 매번 바퀴를 다시 발명하는 대신, React가 제공하는 표준화된 도구들을 사용해 자동으로 조율하게 만드는 것이 핵심입니다.

React Conf 2025에서 소개된 데모를 보면 그 강력함을 실감할 수 있는데요.

검색, 탭 전환, 데이터 변경이 포함된 복잡한 수업 브라우저 앱이 네트워크 속도와 상관없이 부드럽게 동작하는 것을 확인할 수 있습니다.

화면 깜빡임 없이 UI 업데이트가 물 흐르듯 자연스럽게 이어집니다.

이것은 특정 라이브러리의 기능이 아니라, React 19의 새로운 API들과 React 18의 동시성(Concurrent) 기능이 결합된 결과물입니다.

이 시스템을 구성하는 핵심 5인방을 먼저 소개하겠습니다.

*   'useTransition': 백그라운드에서 진행되는 비동기 작업을 추적합니다.
*   'useOptimistic': 서버 응답을 기다리지 않고 즉각적인 피드백을 보여줍니다.
*   'Suspense': 로딩 상태를 선언적으로 관리하여 UI의 경계를 나눕니다.
*   'useDeferredValue': 빠른 업데이트 중에도 UI가 버벅대지 않도록 돕습니다.
*   'use()': 데이터 페칭과 컨텍스트 읽기를 선언적으로 처리합니다.

이 조각들이 어떻게 맞물려 돌아가는지 이해하는 것이야말로, 명령형 코드에서 선언적 조율로 넘어가는 열쇠가 됩니다.

### 수동 비동기 조율의 고통

이러한 기능들이 없던 시절, 우리는 비동기 작업을 처리하기 위해 일일이 오케스트라 지휘자가 되어야 했는데요.

폼 제출 버튼 하나를 만들 때도 다음과 같은 코드를 작성해야 했습니다.

```javascript
function SubmitButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit() {
    setIsLoading(true);
    setError(null);
    try {
      await submitToServer();
      setIsLoading(false);
    } catch (e) {
      setError(e.message);
      setIsLoading(false);
    }
  }

  return (
    <div>
      <button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? '제출 중...' : '제출'}
      </button>
      {error && <div>에러: {error}</div>}
    </div>
  );
}
```

데이터를 가져오는 로직도 `useEffect`를 사용하면 비슷하게 복잡해지는데요.

로딩 상태를 true로 바꾸고, 데이터를 가져오고, 에러를 잡고, 다시 로딩을 false로 바꾸는 과정을 컴포넌트마다 반복해야만 했습니다.

수십 개의 컴포넌트에서 이런 패턴을 반복하다 보면, 로딩 상태가 일관되지 않거나 에러 처리를 깜빡하는 실수가 발생하기 마련입니다.

특히 미묘하게 발생하는 경쟁 상태 버그는 디버깅하기도 정말 어렵습니다.

### Actions: 비동기 작업을 자동으로 추적하다

React 19는 이러한 수동 작업을 'Actions'라는 개념으로 해결하는데요.

비동기 함수를 `startTransition`으로 감싸기만 하면, React가 작업의 시작과 끝을 알아서 추적해 줍니다.

```javascript
const [isPending, startTransition] = useTransition();

function submitAction() {
  startTransition(async () => {
    await submitToServer();
  });
}
```

여기서 `isPending` 플래그는 비동기 작업(프로미스)이 해결될 때까지 자동으로 true 상태를 유지하는데요.

에러가 발생하면 복잡한 try/catch 블록 대신 가장 가까운 'Error Boundary'로 전파되어 처리됩니다.

React는 트랜지션 내부에서 실행되는 함수를 'Action'이라고 부르는데요.

관례상 `submitAction`, `deleteAction`처럼 함수 이름 뒤에 'Action'을 붙여 트랜지션 내에서 실행됨을 명시하는 것이 좋습니다.

심지어 React 19의 `<form>` 컴포넌트는 이 과정을 더 단순화시켰는데요.

`action` prop에 비동기 함수를 넘겨주기만 하면 알아서 트랜지션 처리를 해줍니다.

```javascript
// React가 자동으로 트랜지션을 관리합니다.
<form action={submitAction}>
  <input name="username" />
  <button>제출</button>
</form>
```

이렇게 하면 개발자는 상태 관리 코드 없이 비즈니스 로직에만 집중할 수 있게 됩니다.

### Optimistic Updates: 기다림 없는 즉각적인 반응

`isPending`으로 로딩 상태를 보여주는 것도 좋지만, 사용자에게 더 좋은 경험은 '즉각적인 반응'인데요.

예를 들어, '좋아요' 버튼을 눌렀을 때 서버 응답을 기다리지 않고 하트가 바로 빨개지는 것이 훨씬 자연스럽습니다.

`useOptimistic` 훅은 트랜지션이 진행되는 동안 화면에 보여줄 임시 상태를 제공합니다.

```javascript
function CompleteButton({ complete }) {
  // 낙관적 상태 정의
  const [optimisticComplete, setOptimisticComplete] = useOptimistic(complete);
  const [isPending, startTransition] = useTransition();

  function completeAction() {
    startTransition(async () => {
      // 1. UI를 즉시 업데이트 (낙관적)
      setOptimisticComplete(!optimisticComplete);
      // 2. 실제 서버 요청
      await updateCompletion(!optimisticComplete);
    });
  }

  return (
    <button onClick={completeAction} className={isPending ? 'opacity-50' : ''}>
      {optimisticComplete ? <CheckIcon /> : <div />}
    </button>
  );
}
```

사용자가 버튼을 클릭하는 순간 체크박스는 즉시 토글되는데요.

만약 서버 요청이 실패하면, React는 자동으로 상태를 원래대로 되돌립니다.

`useState`와 달리 `useOptimistic`은 트랜지션 내부에서도 즉시 UI를 업데이트한다는 점이 결정적인 차이입니다.

### Suspense와 Transition의 환상적인 조화

데이터를 처음 로딩할 때는 `Suspense`가 로딩 화면(Fallback)을 보여주는 역할을 하는데요.

하지만 탭을 전환하거나 검색을 할 때마다 화면이 하얗게 변하고 로딩 스피너가 뜬다면 사용자 경험이 썩 좋지는 않을 겁니다.

여기서 'Transition'의 진가가 발휘되는데요.

트랜지션은 React에게 "새로운 데이터가 준비될 때까지 현재 화면을 유지해 줘"라고 말하는 것과 같습니다.

```javascript
function App() {
  const [tab, setTab] = useState('profile');
  const [isPending, startTransition] = useTransition();

  function handleTabChange(newTab) {
    // 탭 변경을 트랜지션으로 감쌉니다.
    startTransition(() => setTab(newTab));
  }

  return (
    <div>
      <nav>
        <button onClick={() => handleTabChange('profile')}>프로필</button>
        <button onClick={() => handleTabChange('posts')}>게시물</button>
      </nav>
      <Suspense fallback={<LoadingSkeleton />}>
        {/* isPending일 때 투명도를 조절해 로딩 중임을 알립니다 */}
        <div style={{ opacity: isPending ? 0.7 : 1 }}>
          {tab === 'profile' ? <UserProfile /> : <UserPosts />}
        </div>
      </Suspense>
    </div>
  );
}
```

이렇게 하면 탭을 눌러도 로딩 스피너(Fallback)가 다시 뜨지 않고, 기존 내용이 그대로 보이면서 백그라운드에서 데이터를 로딩하는데요.

데이터 준비가 끝나면 화면이 자연스럽게 교체됩니다.

이것이 바로 Next.js 같은 프레임워크가 페이지 이동 시 부드러운 경험을 제공하는 원리입니다.

### use() API: useEffect와의 작별

앞서 `Suspense`와 함께 사용할 수 있는 데이터 소스에 대해 언급했는데요.

`use()` API는 `useEffect`를 대체하여 컴포넌트 렌더링 중에 프로미스(Promise)를 직접 읽을 수 있게 해 줍니다.

```javascript
// Before: useEffect 사용 (명령형)
useEffect(() => {
  fetchUser(userId).then(data => setUser(data));
}, [userId]);

// After: use() 사용 (선언형)
function UserProfile({ userId }) {
  const user = use(fetchUser(userId));
  return <div>{user.name}</div>;
}
```

컴포넌트는 프로미스가 해결될 때까지 자동으로 '일시 중단(Suspend)' 상태가 되며, 가장 가까운 `Suspense` 경계가 로딩 화면을 보여주는데요.

에러 처리 또한 `Error Boundary`가 담당하게 되므로 코드가 훨씬 직관적이고 깔끔해집니다.

단, 여기서 주의할 점은 프로미스를 반드시 캐싱 해야 한다는 것인데요.

그렇지 않으면 렌더링 될 때마다 새로운 요청이 발생하게 됩니다.

보통은 Next.js 같은 프레임워크나 TanStack Query 같은 라이브러리가 이 캐싱 작업을 대신 처리해 줍니다.

### useDeferredValue: 입력 반응성 유지하기

검색창에 글자를 빠르게 입력할 때마다 검색 결과가 로딩된다면 입력창 자체가 버벅거릴 수 있는데요.

`useDeferredValue`는 UI의 반응성을 유지하는 데 특화된 훅입니다.

```javascript
function SearchApp() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  return (
    <div>
      {/* 입력창은 즉시 반응합니다 */}
      <input value={query} onChange={(e) => setQuery(e.target.value)} />

      <Suspense fallback={<div>검색 중...</div>}>
        {/* 결과 목록은 지연된 값을 사용해 렌더링합니다 */}
        <div style={{ opacity: isStale ? 0.5 : 1 }}>
          <SearchResults query={deferredQuery} />
        </div>
      </Suspense>
    </div>
  );
}
```

사용자가 타이핑을 하는 동안 `query`는 즉시 업데이트되어 입력창에 반영되지만, `deferredQuery`는 약간 늦게 업데이트되는데요.

이를 통해 무거운 검색 결과 렌더링이 입력 반응 속도를 저하시키는 것을 방지합니다.

이전 검색 결과는 새 결과가 나올 때까지 화면에 유지되며(stale), 투명도를 조절해 사용자에게 "새로운 결과를 찾고 있어요"라는 힌트를 줄 수 있습니다.

### 결론: 선언적 비동기 시대로의 전환

지금까지 살펴본 기능들을 종합해 보면, Async React는 단순한 기능의 나열이 아니라 비동기 작업을 다루는 완전한 시스템이라는 것을 알 수 있는데요.

라우팅은 트랜지션으로 감싸지고, 데이터 페칭은 Suspense와 통합되며, 디자인 컴포넌트들은 내부적으로 Action과 Optimistic Update를 처리하게 됩니다.

이 모든 복잡한 조율은 React와 프레임워크가 담당하고, 우리는 그저 "무엇을 할지"만 정의하면 됩니다.

아직 `useState`와 `useEffect`로 충분하다고 느끼신다면 억지로 바꿀 필요는 없는데요.

하지만 복잡한 대시보드나 인터랙션이 많은 앱을 만들고 있다면, 이 새로운 패턴들이 경쟁 상태 버그를 없애고 '네이티브 앱' 같은 경험을 선사해 줄 것입니다.

이제 수동으로 로딩 상태를 끄고 켜는 일은 React에게 맡기시고, 여러분은 더 멋진 기능을 만드는 데 집중해 보시는 건 어떨까요?
