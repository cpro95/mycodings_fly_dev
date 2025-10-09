---
slug: 2025-08-29-react-concurrent-features-deep-dive
title: 리액트 동시성 기능 완전 정복 useTransition부터 useOptimistic까지
date: 2025-09-02 13:40:23.093000+00:00
summary: 리액트의 핵심 동시성 기능인 useTransition, useDeferredValue, Suspense, useOptimistic을 소개합니다. 단순히 성능 최적화를 넘어, 복잡한 비동기 로직과 UI 업데이트를 어떻게 우아하게 조율하는지 실용적인 예제와 함께 알아봅니다.
tags: ["리액트", "동시성", "Concurrent Mode", "useTransition", "useDeferredValue", "Suspense", "useOptimistic"]
contributors: []
draft: false
---

요즘 리액트 개발의 화두는 단연 '동시성(Concurrency)'인데요.<br /><br />
`useTransition`, `useDeferredValue`, `Suspense`, 그리고 `useOptimistic` 같은 새로운 훅들이 등장하면서, 우리는 이제 단순히 UI를 그리는 것을 넘어 사용자의 인터랙션과 비동기 작업을 훨씬 더 정교하게 '조율'할 수 있게 되었습니다.<br /><br />
이 기능들은 단순히 성능 최적화를 위한 도구가 아닙니다.<br /><br />
이것들은 복잡한 애플리케이션에서 발생하는 여러 가지 상태 업데이트와 비동기 요청들을 마치 오케스트라 지휘자처럼 조율하여, 부드럽고 끊김 없는 사용자 경험을 만들어내는 핵심적인 '코디네이션 도구'입니다.<br /><br />
오늘은 리액트 동시성의 근간이 되는 개념부터, 각각의 훅들이 어떤 문제를 해결하고 어떻게 서로 협력하는지 실용적인 예제와 함께 깊이 있게 파헤쳐 보겠습니다.<br /><br />

### 모든 것의 시작, 동시성 렌더링 (Concurrent Rendering)

이 모든 마법 같은 기능들을 가능하게 하는 근본적인 토대는 바로 '동시성 렌더링'이거든요.<br /><br />
과거의 리액트는 모든 작업을 '동기적'으로 처리했습니다.<br /><br />
상태가 업데이트되면, 리액트는 전체 컴포넌트 트리를 다시 렌더링할 때까지 메인 스레드를 붙잡고 있었죠.<br /><br />
이 때문에 무거운 컴포넌트가 렌더링되는 동안 사용자가 타이핑을 하면 입력이 버벅거리는, 이른바 '끊김 현상(Jank)'이 발생하곤 했습니다.<br /><br />

하지만 동시성 렌더링은 이 패러다임을 완전히 바꿨습니다.<br /><br />
이제 리액트는 렌더링 작업을 중간에 '멈출' 수 있게 되었거든요.<br /><br />
렌더링을 하다가 사용자의 입력처럼 더 긴급한 작업이 들어오면, 하던 렌더링을 잠시 멈추고 긴급한 작업을 먼저 처리한 뒤, 멈췄던 지점부터 렌더링을 다시 이어서 할 수 있게 된 겁니다.<br /><br />
이 '중단 가능한 렌더링'이야말로, 우리가 앞으로 살펴볼 모든 동시성 기능들의 기반이 되는 핵심 원리입니다.<br /><br />

### `useTransition` 긴급하지 않은 업데이트를 위한 신호탄

`useTransition`은 상태 업데이트를 '긴급하지 않음(non-urgent)'으로 표시하여, 리액트가 더 중요한 작업을 위해 이 업데이트를 잠시 중단할 수 있도록 해주는 훅인데요.<br /><br />
마치 택배를 보낼 때 '일반 배송'으로 보내는 것과 같습니다.<br /><br />
급한 서류는 퀵으로 먼저 보내고, 일반 택배는 조금 늦게 도착해도 괜찮은 것처럼 말이죠.<br />

```javascript
const [isPending, startTransition] = useTransition();
```

`useTransition`은 `isPending`과 `startTransition`이라는 두 가지 값을 배열로 반환합니다.<br /><br />
`isPending`은 트랜지션이 진행 중인지를 알려주는 불리언 값이고, `startTransition`은 긴급하지 않은 상태 업데이트를 감싸는 함수입니다.<br /><br />

#### 무거운 렌더링 작업과 함께 사용할 때

예를 들어, 탭을 전환할 때마다 매우 복잡하고 무거운 컴포넌트를 렌더링해야 하는 상황을 생각해 봅시다.<br /><br />
`startTransition`으로 상태 업데이트를 감싸주면, 탭 전환 애니메이션이나 다른 사용자 인터랙션이 렌더링 작업에 의해 버벅거리는 것을 막을 수 있습니다.<br />

```javascript
function TabButton({ children, tabAction }) {
  const [isPending, startTransition] = useTransition();

  const handleTabChange = () => {
    // tabAction() 실행을 긴급하지 않은 업데이트로 표시합니다.
    startTransition(() => tabAction());
  };

  return (
    <button onClick={handleTabChange} style={{ opacity: isPending ? 0.7 : 1 }}>
      {children}
    </button>
  );
}
```

#### 비동기 작업과 함께 사용할 때 (React 19+)

React 19부터는 `startTransition`에 비동기 함수(async function)를 직접 전달할 수 있게 되면서 그 활용도가 더욱 막강해졌는데요.<br /><br />
API 호출이나 폼 제출 같은 비동기 작업과 상태 업데이트를 자연스럽게 조율할 수 있게 된 겁니다.<br /><br />
더 이상 `isLoading` 같은 상태를 수동으로 관리할 필요 없이, `isPending`을 통해 자동으로 로딩 상태를 UI에 반영할 수 있습니다.<br />

```javascript
function DeleteButton({ itemId }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      // 서버에 삭제 요청
      await deleteItem(itemId);
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      style={{ opacity: isPending ? 0.7 : 1 }}
    >
      {isPending ? '삭제 중...' : '삭제'}
    </button>
  );
}
```

### `Suspense` 선언적으로 로딩 상태 관리하기

`Suspense`는 비동기 작업이 완료될 때까지 '기다려야 하는' 컴포넌트의 로딩 상태를 선언적으로 관리할 수 있게 해주는 기능인데요.<br /><br />
쉽게 말해, 데이터 로딩이 끝나지 않은 컴포넌트가 있을 때, 그 자리에 대신 보여줄 '로딩 스켈레톤' 같은 fallback UI를 지정하는 경계선(Boundary)을 만드는 겁니다.<br />

```javascript
<Suspense fallback={<LoadingSkeleton />}>
  <ComponentThatFetchesData />
</Suspense>
```

`Suspense`는 `React.lazy`를 이용한 코드 스플리팅뿐만 아니라, `Promise`를 사용하는 모든 비동기 데이터 소스와 함께 작동합니다.<br /><br />
각각의 컴포넌트가 자신만의 데이터 로딩 상태를 가질 수 있게 되면서, 부모 컴포넌트는 그저 `Suspense`로 감싸주기만 하면 되니 코드가 훨씬 깔끔하고 직관적으로 변합니다.<br />

```javascript
function UserDashboard({ userId }) {
  return (
    <div>
      <h1>대시보드</h1>
      <Suspense fallback={<ProfileSkeleton />}>
        <UserProfile userId={userId} />
      </Suspense>
      <Suspense fallback={<PostsSkeleton />}>
        <UserPosts userId={userId} />
      </Suspense>
    </div>
  );
}
```

### `useDeferredValue` 똑똑하게 UI 업데이트 지연시키기

`useDeferredValue`는 자주 변경되는 값에 의존하는 UI의 렌더링을 잠시 '지연'시켜주는 훅인데요.<br /><br />
사용자가 검색창에 텍스트를 빠르게 입력하는 상황을 상상해 보세요.<br /><br />
입력할 때마다 검색 결과 목록이 즉시 업데이트된다면, 매우 버벅거리고 어지러운 경험을 하게 될 겁니다.<br /><br />
`useDeferredValue`는 이럴 때 사용자의 '입력'은 즉시 반영하되, 그 입력값에 따른 '검색 결과 렌더링'은 리액트가 여유가 있을 때까지 잠시 미루도록 해줍니다.<br />

```javascript
const deferredValue = useDeferredValue(value);
```

사용자가 타이핑을 멈추고 잠시 기다리면, 그때서야 지연되었던 `deferredValue`가 최신 값으로 업데이트되면서 검색 결과가 부드럽게 화면에 나타납니다.<br />

```javascript
function FilteredList({ items }) {
  const [filter, setFilter] = useState('');
  const deferredFilter = useDeferredValue(filter);

  const isStale = filter !== deferredFilter;

  return (
    <div>
      <input value={filter} onChange={(e) => setFilter(e.target.value)} />
      {/* isStale 상태를 이용해 오래된 데이터임을 시각적으로 표시 */}
      <div style={{ opacity: isStale ? 0.5 : 1 }}>
        <ExpensiveFilteredItems items={items} filter={deferredFilter} />
      </div>
    </div>
  );
}
```

`useTransition`이 '상태 업데이트 자체'의 우선순위를 낮춘다면, `useDeferredValue`는 '값'의 우선순위를 낮춘다는 미묘한 차이가 있습니다.<br /><br />

### `useOptimistic` 기다림 없는 즉각적인 피드백

`useOptimistic`은 비동기 작업이 실제로 완료되기 전에, 성공할 것이라고 '낙관적으로' 가정하고 UI를 먼저 업데이트해주는 훅인데요.<br /><br />
'좋아요' 버튼을 누르는 상황을 생각해 보세요.<br /><br />
버튼을 눌렀는데 서버 응답이 올 때까지 몇 초간 아무 반응이 없다면 사용자는 답답함을 느낄 겁니다.<br /><br />
`useOptimistic`을 사용하면, 버튼을 누르는 즉시 '좋아요' 카운트가 올라가고 하트 아이콘이 채워집니다.<br /><br />
그리고 백그라운드에서는 실제 서버 요청이 처리되죠.<br /><br />
만약 서버 요청이 성공하면 그대로 유지되고, 실패하면 리액트가 알아서 원래 상태로 '롤백'시켜줍니다.<br />

```javascript
const [optimisticState, addOptimistic] = useOptimistic(currentState, updateFn);
```

이 훅은 반드시 `useTransition` 안에서 사용되어야 하는데요.<br /><br />
리액트가 이 낙관적 상태를 언제까지 유지해야 할지(즉, 트랜지션이 끝날 때까지) 알 수 있기 때문입니다.<br />

```javascript
function LikeButton({ post }) {
  const [, startTransition] = useTransition();
  const [optimisticPost, setOptimisticPost] = useOptimistic(
    post,
    (currentPost, newLiked) => ({ ...currentPost, liked: newLiked, likes: currentPost.likes + (newLiked ? 1 : -1) })
  );

  const toggleAction = () => {
    startTransition(async () => {
      // UI를 먼저 낙관적으로 업데이트
      setOptimisticPost(!optimisticPost.liked);
      // 실제 서버 요청
      await updatePostLike(post.id, !optimisticPost.liked);
    });
  };

  return (
    <button onClick={toggleAction}>
      {optimisticPost.liked ? '❤️' : '🤍'} {optimisticPost.likes}
    </button>
  );
}
```

사용자에게는 마치 모든 것이 즉시 처리되는 것처럼 보이는, 매우 매끄러운 경험을 선사할 수 있습니다.<br /><br />

### 결론, 오케스트라처럼 UI를 지휘하다

리액트의 동시성 기능들은 각각의 독립적인 기능을 가지고 있지만, 결국 하나의 목표를 향해 움직입니다.<br /><br />
바로 복잡한 애플리케이션의 상태 변화와 비동기 작업을 오케스트라처럼 아름답게 조율하여, 사용자에게 최상의 경험을 선사하는 것이죠.<br />

-   `useTransition`: 무거운 작업을 뒤로 미뤄 UI의 반응성을 유지합니다.<br /><br />
-   `useDeferredValue`: 잦은 업데이트로부터 UI를 보호하여 부드러움을 유지합니다.<br /><br />
-   `Suspense`: 로딩 상태를 선언적으로 관리하여 코드의 가독성을 높입니다.<br /><br />
-   `useOptimistic`: 즉각적인 피드백으로 기다림 없는 인터랙션을 만듭니다.<br /><br />

이 도구들을 언제, 어떻게 사용해야 할지 이해하는 것은 이제 현대 리액트 개발자의 필수 소양이 되었습니다.<br /><br />
처음에는 조금 낯설 수 있지만, 이 강력한 도구들을 손에 익히는 순간, 여러분의 애플리케이션은 한 차원 다른 수준의 사용자 경험을 제공하게 될 겁니다.<br /><br />
