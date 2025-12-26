---
slug: 2025-12-24-react-performance-optimization-memo-usememo-usecallback
title: "React 성능 최적화, '무지성 memo'는 이제 그만둬야 할 때"
summary: "React의 memo, useMemo, useCallback을 제대로 사용하는 법과 성능 측정의 중요성을 실무 경험을 바탕으로 정리했습니다. 무조건적인 최적화가 왜 독이 되는지 확인해보세요."
date: 2025-12-24T11:09:56.739Z
draft: false
weight: 50
tags: ["React", "성능최적화", "memo", "useMemo", "useCallback", "프론트엔드", "React19"]
contributors: []
---

![React 성능 최적화, '무지성 memo'는 이제 그만둬야 할 때](https://blogger.googleusercontent.com/img/a/AVvXsEjZLYjX5RHrJ7o3dzPrsBjoglBiiKkrEl13oXJpJpnmXr0EBOAHG0Q0sce0bS6qvFg9tVu19vl2xdNW7y0IfQ0RjnaoXvZhJTzwddkU0pKqgJLZGBlWgN9Pkn6Km0ddoEZupUR2WfDY6tOMgA5sRHYNpQDOg3eW5hafjgSAYtLcjx7uf6oO14IrzGjqvJQ=s16000)

React 프로젝트를 진행하다 보면 어느 순간 퍼포먼스에 대한 강박이 생기곤 하는데요.

저 또한 컴포넌트를 만들 때마다 습관적으로 `memo`로 감싸고, 모든 함수에 `useCallback`을 붙이던 시절이 있었습니다.

마치 부적을 붙이듯 "이렇게 하면 빨라지겠지"라고 막연하게 생각했던 겁니다.

하지만 이 '무지성 최적화'가 오히려 앱을 느리게 만들 수 있다는 사실을 깨닫게 되었습니다.

결론부터 말씀드리자면, "일단 memo 감싸기"는 오답이며 "측정 후 최적화"가 정답입니다.

## 왜 지금 다시 성능 최적화일까요?

솔직히 고백하자면, React를 꽤 오래 만져왔음에도 불구하고 제 코드는 부끄러운 수준이었는데요.

아마 여러분 중에도 이런 코드를 작성해보신 분들이 계실 겁니다.

```javascript
// 단순히 '무거울 것 같아서' memo로 감쌈
const HeavyComponent = memo(() => {
  // 실제로는 전혀 무겁지 않은데 측정도 안 해봄...
});

// '남들이 다 쓰니까' useCallback 사용
const handleClick = useCallback(() => {
  console.log('clicked');
}, []); // 의존성 배열이 비어있음 = 매번 생성하는 것과 비용 차이 미미함
```

이런 코드가 쌓이다 보니 코드의 가독성은 떨어지고, 오히려 메모리 점유율만 높아지는 현상이 발생했습니다.

그래서 저는 기본으로 돌아가 React의 렌더링 메커니즘과 최적화 도구들을 다시 파헤치기 시작했습니다.

그리고 그 과정에서 명확한 기준 세 가지를 정립하게 되었습니다.


## 제대로 이해한 3가지 핵심 포인트

### 1. React.memo: '자식 컴포넌트의 렌더링 비용이 비쌀 때'만 쓴다

과거의 저는 거의 모든 컴포넌트를 `memo`로 감싸는 실수를 범했는데요.

`memo`는 공짜가 아니며, props를 비교하는 연산 비용이 분명히 들어갑니다.


```javascript
// 모든 것을 memo화 (과거의 나)
// props 비교 비용 > 리렌더링 비용 인 경우, 오히려 손해입니다.
const Button = memo(({ onClick, label }) => {
  return <button onClick={onClick}>{label}</button>;
});

// 계산 비용이 높거나, 부모가 빈번하게 리렌더링 되는 경우
const ExpensiveList = memo(({ items }: { items: Item[] }) => {
  // 1000건 이상의 리스트를 렌더링하는 경우라면 효과적입니다.
  return (
    <>
      {items.map(item => (
        <ComplexItem key={item.id} {...item} />
      ))}
    </>
  );
});
```

여기서 중요한 판단 기준은 '자식 컴포넌트의 렌더링 비용'이 'memo화에 드는 비교 비용'보다 클 때만 사용해야 한다는 점입니다.

이걸 어떻게 아냐고요?

바로 React DevTools의 Profiler를 통해 실측해봐야 알 수 있습니다.

단순한 텍스트나 버튼 정도는 그냥 리렌더링시키는 것이 `props`를 얕은 비교(Shallow Compare)하는 것보다 더 빠를 때가 많습니다.


### 2. useMemo: '계산이 정말로 무거울 때'만 쓴다

`useMemo` 역시 마찬가지로 무분별하게 사용되고 있었는데요.

변수 하나 선언하는 데에도 습관적으로 `useMemo`를 붙이는 것은 메모리 낭비입니다.


```javascript
// 가벼운 계산에도 useMemo 사용 (메모리 낭비)
const isEven = useMemo(() => count % 2 === 0, [count]);

// 무거운 계산이거나, 참조의 안정성이 필요한 객체/배열일 경우
const Report = ({ transactions }: { transactions: Transaction[] }) => {
  // 10만 건의 데이터를 순회하며 집계하는 처리는 확실히 무겁습니다.
  const summary = useMemo(() => {
    return transactions.reduce((acc, t) => {
      acc.total += t.amount;
      acc.count += 1;
      // 복잡한 비즈니스 로직 포함...
      return acc;
    }, { total: 0, count: 0, byCategory: {} });
  }, [transactions]);

  return <SummaryView data={summary} />;
};
```

판단 기준은 계산 시간이 체감될 수준(약 1~2ms 이상)이거나, 동일한 계산이 빈번하게 실행될 때입니다.

또한, 객체나 배열을 자식 컴포넌트의 props로 넘길 때 참조 동일성을 유지하기 위해 사용하여 불필요한 리렌더링을 막는 용도로도 적합합니다.

React 팀에서는 향후 React Compiler가 이런 메모이제이션을 자동으로 처리해주길 기대하고 있지만, 아직은 개발자의 판단이 중요합니다.


### 3. useCallback: '함수의 참조 유지가 필수적일 때'만 쓴다

가장 많이 오해하는 것이 바로 `useCallback`인데요.

이 훅은 함수 생성을 막는 것이 아니라, 생성된 함수의 '참조'를 유지하여 자식 컴포넌트의 불필요한 렌더링을 방지하는 것이 주 목적입니다.


```javascript
// 의미 없는 useCallback
const handleClick = useCallback(() => {
  setCount(count + 1);
}, [count]); // count가 변할 때마다 함수가 새로 생성되므로 의미가 없습니다.

// 자식 컴포넌트(특히 memo된 컴포넌트)의 불필요한 렌더링을 막을 때
const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  // TodoItem이 memo로 감싸져 있으므로, 핸들러 함수의 참조를 고정해야 효과를 봅니다.
  const handleToggle = useCallback((id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  }, []); // 의존성 배열이 비어있어 함수 참조가 불변함

  return (
    <>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={handleToggle} // 안정적인 참조 전달
        />
      ))}
    </>
  );
};

// memo화된 자식 컴포넌트
const TodoItem = memo(({ todo, onToggle }: TodoItemProps) => {
  console.log('TodoItem render'); // onToggle이 바뀌지 않으면 리렌더링 되지 않음
  return (
    <div onClick={() => onToggle(todo.id)}>
      {todo.title}
    </div>
  );
});
```

`useCallback`은 단독으로 쓰일 때보다 `React.memo`로 감싸진 자식 컴포넌트에 함수를 넘길 때 비로소 진가를 발휘합니다.

자식은 `memo`로 감쌌는데 부모에서 함수를 매번 새로 만들어 넘긴다면, 자식 입장에서는 props가 바뀐 것으로 인식되어 `memo`가 무용지물이 되기 때문입니다.


## 실측으로 확인한 충격적인 사실

이론만으로는 와닿지 않아 Chrome DevTools의 Profiler로 직접 측정해보았는데요.

결과는 제 예상을 완전히 뒤엎었습니다.


*   **Before (습관적 최적화 남발):**
    *   초기 렌더링: 45ms
    *   리렌더링 (부모 업데이트 시): 32ms
    *   메모리 사용량: 18.2MB

*   **After (필요한 곳만 선별적 최적화):**
    *   초기 렌더링: 38ms **(-15% 개선)**
    *   리렌더링 (부모 업데이트 시): 8ms **(-75% 개선!)**
    *   메모리 사용량: 16.8MB **(-7% 개선)**

무의미한 `memo`와 `useCallback`을 걷어냈을 뿐인데, 오히려 앱이 더 빨라지고 가벼워진 것입니다.

이 경험은 '최적화 코드도 결국 실행해야 할 코드'라는 단순한 진리를 다시금 깨닫게 해주었습니다.


## 자주 빠지는 함정과 해결책

### 1. '일단 최적화'의 함정

처음에는 아주 단순한 컴포넌트까지 전부 `memo`를 적용했는데요.

이는 마치 동네 슈퍼에 가는데 스포츠카를 예열하는 것과 같습니다.


```javascript
// 너무 단순한 컴포넌트
const Label = memo(({ text }: { text: string }) => {
  return <span>{text}</span>;
  // 비교 비용 > 렌더링 비용. 배보다 배꼽이 더 큽니다.
});
```

### 2. 의존성 배열(Dependency Array)의 거짓말

`useCallback`이나 `useMemo`를 쓸 때 의존성 배열을 비워두거나 잘못 입력해서 버그를 만드는 경우가 많습니다.

이는 React의 데이터 흐름을 끊어버리는 위험한 행동입니다.


```javascript
// 의존성을 빼먹어 과거의 값을 참조하는 클로저 문제 발생
const handleUpdate = useCallback(() => {
  updateUser(userId); // userId가 바뀌어도 이 함수는 옛날 userId를 기억함
}, []);

// ESLint의 exhaustive-deps 규칙을 켜고, 시키는 대로 넣으세요
const handleUpdate = useCallback(() => {
  updateUser(userId);
}, [userId, updateUser]); // 모든 의존성을 명시
```

### 3. 감(Feeling)에 의존한 최적화

"여기가 느릴 거야"라고 짐작하고 최적화했지만, 실제 병목은 엉뚱한 곳에 있는 경우가 허다합니다.


```javascript
// 예상: filter 함수가 느릴 것이다
const filtered = items.filter(item => item.active); // 실제 측정: 0.1ms 소요

// 실제 범인: 리스트 아이템의 렌더링
return items.map(item => <HeavyComponent key={item.id} {...item} />); // 실제 측정: 15ms 소요
```

반드시 Profiler 탭을 열고 녹화 버튼을 누른 뒤, 상호작용을 해보고 어디서 시간이 오래 걸리는지 눈으로 확인해야 합니다.


## 실무에서 바로 써먹는 활용 패턴

이제 이론을 넘어서, 실제 프로젝트에서 효과를 봤던 패턴들을 소개합니다.


### 1. 대량 리스트 렌더링: 가상화(Virtualization)와 결합

수천 개의 데이터를 한 번에 렌더링하면 DOM 노드가 너무 많아져 브라우저가 버벅거립니다.

이때는 `react-window` 같은 가상 스크롤 라이브러리와 `memo`를 함께 사용하면 극적인 효과를 볼 수 있습니다.


```javascript
const UserList = ({ users }: { users: User[] }) => {
  // useCallback으로 렌더러 함수의 참조를 고정
  const rowRenderer = useCallback(({ index, style }) => {
    const user = users[index];
    return (
      <div style={style}>
        {/* UserRow는 memo로 감싸져 있어, 스크롤 시 불필요한 렌더링 방지 */}
        <UserRow user={user} />
      </div>
    );
  }, [users]);

  return (
    <VirtualList
      height={600}
      itemCount={users.length}
      itemSize={50}
      rowRenderer={rowRenderer}
    />
  );
};

const UserRow = memo(({ user }: { user: User }) => {
  return <div>{user.name}</div>;
});
```

### 2. 실시간 데이터 업데이트 최적화

주식 차트나 실시간 대시보드처럼 데이터가 쏟아지는 환경에서는 렌더링 최적화가 필수적인데요.

부모 컴포넌트의 잦은 상태 변화가 자식들에게 전파되지 않도록 격리해야 합니다.


```javascript
const Dashboard = () => {
  const [metrics, setMetrics] = useState<Metrics>({});

  // WebSocket 메시지가 올 때마다 setMetrics 호출 -> Dashboard 리렌더링 발생
  useEffect(() => {
    const ws = new WebSocket('...');
    ws.onmessage = (e) => {
      const update = JSON.parse(e.data);
      setMetrics(prev => ({ ...prev, ...update }));
    };
    return () => ws.close();
  }, []);

  return (
    <>
      {/*
        각 컴포넌트는 memo화 되어 있어,
        cpu 값이 변할 때 MemoryMetric이나 NetworkMetric은 리렌더링 되지 않음
      */}
      <CPUMetric value={metrics.cpu} />
      <MemoryMetric value={metrics.memory} />
      <NetworkMetric value={metrics.network} />
    </>
  );
};

const CPUMetric = memo(({ value }: { value?: number }) => {
  return <MetricCard title="CPU" value={value} />;
});
```

### 3. 복잡한 폼(Form) 입력 최적화

폼 입력은 사용자의 타이핑마다 리렌더링을 유발하기 때문에 성능 저하의 주범이 되곤 합니다.

입력 핸들러를 최적화하고, 무거운 검증 로직은 `debounce`와 `useMemo`를 섞어서 처리하면 좋습니다.


```javascript
const ComplexForm = () => {
  const [formData, setFormData] = useState<FormData>({});

  // 커링(Currying) 기법을 사용하되, 가장 바깥 함수를 useCallback으로 감쌈
  const createFieldHandler = useCallback((fieldName: string) => {
    return (value: any) => {
      setFormData(prev => ({ ...prev, [fieldName]: value }));
    };
  }, []);

  // 검증 로직이 무겁다면 debounce 처리하여 입력이 멈췄을 때만 실행
  const validation = useMemo(() => {
    return debounce((data: FormData) => {
      return validateFormData(data);
    }, 300);
  }, []);

  useEffect(() => {
    validation(formData);
  }, [formData, validation]);

  return (
    <form>
      {/* createFieldHandler('email')의 결과는 매번 같아야 함을 보장하려면 추가적인 구조 개선 필요 */}
      {/* React Hook Form 같은 라이브러리를 쓰는 것이 사실 가장 빠릅니다 */}
      <Field name="email" onChange={createFieldHandler('email')} />
      <Field name="password" onChange={createFieldHandler('password')} />
    </form>
  );
};
```

## 나만의 성능 최적화 체크리스트

프로젝트를 진행하며 옆에 두고 참고하는 저만의 체크리스트를 공유합니다.

여러분도 코드를 작성하기 전에 한 번씩 점검해 보세요.


```javascript
// 1. 일단 측정부터 한다 (Performance API 또는 React Profiler)
const measure = () => {
  performance.mark('start');
  // ...무거운 작업...
  performance.mark('end');
  performance.measure('작업시간', 'start', 'end');
};

// 2. 최적화가 정말 필요한지 판단한다
const needsOptimization = (renderTime: number): boolean => {
  // 인간이 끊김을 느끼기 시작하는 시간은 프레임당 약 16ms (60fps 기준)
  return renderTime > 16;
};

// 3. 상황에 맞는 무기를 고른다
const optimizationStrategy = {
  heavyComputation: 'useMemo 사용',
  frequentRerender: 'React.memo 및 컴포넌트 분리',
  stableReference: 'useCallback (주로 자식 props 전달용)',
  largeList: '가상화 (Windowing)',
  deepStateUpdate: 'Immer 사용 또는 상태 정규화'
};
```

## 마치며: '막연함'에서 '확신'으로

성능 최적화는 마법이 아닙니다.

과거의 제가 범했던 실수는 도구의 원리를 이해하지 못한 채 남들이 좋다는 대로 따라 했던 것이었습니다.


**Before (막연한 최적화):**
*   일단 `memo`로 감싸고 봄
*   불안하니까 `useCallback` 다 붙임
*   복잡해 보이면 `useMemo` 사용
*   측정은 생략하고 배포

**After (확신을 가진 최적화):**
*   Profiler로 병목 구간 시각적 확인
*   `memo`를 사용할 때 비교 비용과 렌더링 비용을 저울질
*   의존성 배열은 `exhaustive-deps` 린트 규칙을 철저히 준수
*   최소한의 최적화로 최대의 효과를 누림

최근 발표된 React 19와 React Compiler(React Forget) 소식을 들으셨나요?

앞으로는 컴파일러가 이런 메모이제이션을 자동으로 처리해 줄 날이 머지않았습니다.

하지만 도구가 발전하더라도, '왜' 리렌더링이 발생하는지, '어디서' 성능이 새어나가는지 보는 눈을 기르는 것은 여전히 중요합니다.

지금 바로 여러분의 프로젝트에서 Profiler를 켜보세요.

생각지도 못한 곳에서 성능을 갉아먹고 있는 범인을 발견할지도 모릅니다.

오늘부터는 '무지성 memo' 대신, '똑똑한 측정'을 시작해 보시는 건 어떨까요?
