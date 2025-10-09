---
slug: 2025-08-22-zustand-vs-context-api-rerender-optimization
title: Context API의 리렌더링 지옥, Zustand가 구원해드립니다
date: 2025-08-23 10:17:02.077000+00:00
summary: 리액트의 Context API를 사용하다 불필요한 리렌더링 문제로 골머리를 앓고 계신가요? Zustand가 어떻게 셀렉터 하나만으로 이 문제를 우아하게 해결하고, 코드까지 간결하게 만들어주는지 그 비법을 공개합니다.
tags: ["Zustand", "리액트", "상태 관리", "Context API", "리렌더링 최적화", "React"]
contributors: []
draft: false
---

리액트에서 상태 관리는 정말이지 영원한 숙제 같거든요.<br /><br />Prop Drilling을 피하려고 Context API를 썼더니, 이번엔 불필요한 리렌더링이 발목을 잡죠.<br /><br />그래서 많은 개발자들이 Redux나 MobX 같은 더 복잡한 라이브러리로 넘어가곤 하는데요.<br /><br />하지만 여기, 아주 작고 단순하면서도 강력한 대안이 있습니다.<br /><br />바로 'Zustand'라는 상태 관리 라이브러리죠.<br /><br />오늘은 Context API가 가진 근본적인 문제를 살펴보고, Zustand가 얼마나 우아하게 그 문제를 해결하는지, 그리고 왜 많은 개발자들이 Zustand에 열광하는지 그 이유를 샅샅이 파헤쳐 보겠습니다.<br /><br />

## 문제는 Prop Drilling, 해결책은 Context API?

먼저, 우리가 왜 상태 관리 도구를 찾게 되는지 그 출발점부터 짚어봐야 하는데요.<br /><br />바로 'prop drilling' 때문입니다.<br /><br />리액트에서 여러 컴포넌트가 공유해야 하는 상태는 가장 가까운 공통 부모로 끌어올려야 하죠.<br /><br />그리고 그 상태를 props를 통해 자식에게, 또 그 자식에게, 계속해서 전달해야 합니다.<br /><br />상태를 실제로 사용하지 않는 중간 컴포넌트들도 오직 전달을 위해 props를 계속 넘겨받아야 하는 이 고통스러운 과정을 바로 'prop drilling'이라고 부르죠.<br /><br />이 문제를 해결하기 위해 많은 개발자들이 리액트에 내장된 Context API를 사용하는데요.<br /><br />상태를 Provider에 담아두고, 필요한 곳에서 `useContext` 훅으로 바로 꺼내 쓰는 방식입니다.<br /><br />간단한 할 일 관리 앱을 예로 들어보죠.<br /><br />`tasks`, `currentView`, `currentFilter`라는 세 가지 상태를 Context로 관리한다면, Provider는 아마 이런 모습일 겁니다.<br /><br />

```typescript
export const TasksProvider = ({ children }: { children: ReactNode }) => {
  console.log("Rendering TasksProvider");

  const [tasks, setTasks] = useState<Task[]>(dummyTasks);
  const [currentView, setCurrentView] = useState<TasksView>("list");
  const [currentFilter, setCurrentFilter] = useState<string>("");

  const value: TasksState = {
    tasks,
    setTasks,
    currentView,
    setCurrentView,
    currentFilter,
    setCurrentFilter,
  };

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
};
```

먼저 `useState`로 상태 조각들을 하나씩 만들어야 하는데요.<br /><br />그리고 그걸 거대한 `value` 객체 하나로 합쳐서 Provider에 넘겨주는 방식입니다.<br /><br />이제 어떤 컴포넌트에서든 `useContext` 훅을 사용하면 이 `value` 객체에 접근할 수 있게 되죠.<br /><br />

```typescript
export const useTasksContext = () => {
  return useContext(TasksContext);
};

// 사용하는 컴포넌트 내부
const { currentView, tasks, currentFilter } = useTasksContext();
```

이 코드는 분명히 동작하고, prop drilling 문제도 해결해 줍니다.<br /><br />하지만 여기서 정말 치명적인 문제가 하나 발생하더라고요.<br /><br />바로 `value` 객체 안의 값 중 단 하나라도 바뀌면, 이 Context를 구독하는 모든 컴포넌트가 모조리 리렌더링된다는 겁니다.<br /><br />예를 들어, UI 뷰를 바꾸기 위해 `setCurrentView`를 호출했다고 해보죠.<br /><br />분명히 `currentView` 상태만 바뀌었을 뿐인데, `tasks`나 `currentFilter`를 사용하는 컴포넌트까지 전부 리렌더링되는 비효율이 발생하는 거죠.<br /><br />작은 앱에서는 문제가 안 될 수 있지만, 앱이 커질수록 이런 불필요한 리렌더링은 심각한 성능 저하의 원인이 됩니다.<br /><br />

## Zustand의 등장, 그리고 첫인상

Zustand는 이런 Context API의 단점을 해결하기 위해 등장한 아주 작고 미니멀한 라이브러리인데요.<br /><br />상태를 만드는 방법부터가 정말 간단합니다.<br /><br />

```typescript
import { create } from "zustand";

export const useTasksStore = create<TasksState>(set => ({
  tasks,
  setTasks: (arg: Task[] | ((tasks: Task[]) => Task[])) => {
    set(state => {
      return {
        tasks: typeof arg === "function" ? arg(state.tasks) : arg,
      };
    });
  },
  currentView: "list",
  setCurrentView: (newView: TasksView) => set({ currentView: newView }),
  currentFilter: "",
  setCurrentFilter: (newFilter: string) => set({ currentFilter: newFilter }),
}));
```
<br />
`create` 함수에 상태의 초기값과 상태를 업데이트하는 함수들을 담은 객체를 반환하는 함수를 넘겨주기만 하면 되는데요.<br /><br />이것만으로 `useTasksStore`라는 커스텀 훅이 뚝딱 만들어집니다.<br /><br />Context처럼 Provider로 앱을 감싸줄 필요도 없죠.<br /><br />상태를 업데이트할 때는 `create` 함수가 인자로 넘겨주는 `set` 함수를 사용하면 되는데요.<br /><br />`set({ currentView: newView })`처럼 바뀐 부분만 객체로 넘겨주면, Zustand가 알아서 기존 상태와 병합해줍니다.<br /><br />정말 간결하고 직관적이죠.<br /><br />자, 그럼 이제 이 훅을 컴포넌트에서 사용해볼까요?<br /><br />가장 단순한 방법은 Context를 사용할 때처럼 필요한 상태들을 구조 분해 할당으로 가져오는 겁니다.<br /><br />

```typescript
// 이 방식은 최선이 아닙니다!
const { currentView, tasks, currentFilter } = useTasksStore();
```

이 코드는 분명히 동작하고, Context를 쓸 때보다 보일러플레이트도 훨씬 적은데요.<br /><br />하지만 이 방식은 Context API와 똑같은 함정을 가지고 있거든요.<br /><br />상태 객체 전체를 반환받기 때문에, 상태의 일부만 바뀌어도 객체의 참조가 바뀌어서 이 훅을 사용하는 모든 컴포넌트가 여전히 리렌더링되는 거죠.<br /><br />

## Zustand의 진짜 힘, '셀렉터(Selector)'

Zustand의 진정한 힘은 바로 이 리렌더링 문제를 해결하는 데 있는데요.<br /><br />문서에서 쉽게 지나칠 수 있지만, 가장 중요한 핵심 기능입니다.<br /><br />바로 '셀렉터(selector)'를 사용하는 거죠.<br /><br />Zustand 훅을 호출할 때, 이렇게 원하는 상태만 콕 집어서 선택하는 함수를 넘겨주는 건데요.<br /><br />

```typescript
const currentView = useTasksStore(state => state.currentView);
const tasks = useTasksStore(state => state.tasks);
const currentFilter = useTasksStore(state => state.currentFilter);
```

이렇게 하면 Zustand는 오직 셀렉터가 반환한 값(`currentView` 문자열, `tasks` 배열 등)이 실제로 변경될 때만 리렌더링을 트리거합니다.<br /><br />이제 `setCurrentView`를 호출해도, 오직 `currentView`를 구독하는 컴포넌트만 리렌더링되고, `tasks`나 `currentFilter`를 구독하는 컴포넌트들은 전혀 영향을 받지 않게 되는 거죠.<br /><br />이것이 바로 Zustand가 제공하는 렌더링 최적화의 핵심입니다.<br /><br />만약 여러 상태 조각을 한 번에 가져오면서도 이 최적화를 누리고 싶다면, Zustand가 제공하는 `useShallow` 헬퍼를 사용할 수 있는데요.<br /><br />

```typescript
import { useShallow } from "zustand/react/shallow";

// 객체 형태로 여러 값을 선택
const { tasks, setTasks } = useTasksStore(
  useShallow(state => ({
    tasks: state.tasks,
    setTasks: state.setTasks,
  }))
);

// 배열 형태로 여러 값을 선택
const [tasks, setTasks] = useTasksStore(useShallow(state => [state.tasks, state.setTasks]));
```

`useShallow`는 반환된 객체나 배열의 1단계 깊이까지만 비교해서 변경 여부를 판단하는데요.<br /><br />덕분에 불필요한 리렌더링을 막으면서도 여러 상태를 편리하게 가져올 수 있습니다.<br /><br />

## 그 외의 매력적인 기능들

Zustand는 이 외에도 몇 가지 아주 유용한 기능들을 제공하는데요.<br /><br />*   **비동기 액션**: `set` 함수는 언제 어디서든 호출할 수 있기 때문에, `fetch` 같은 비동기 작업이 끝난 후에 상태를 업데이트하는 로직을 스토어 안에 아주 자연스럽게 작성할 수 있습니다.<br /><br />
*   **스토어 내부에서 상태 읽기**: `create` 함수는 `set`과 함께 `get` 함수도 인자로 받는데요.<br /><br />이 `get` 함수를 사용하면 액션 함수 안에서 현재 상태 값을 언제든지 읽어올 수 있습니다.<br /><br />
*   **React 외부에서 상태 접근**: Zustand가 `create` 함수로 만들어주는 것은 React 훅이지만, 그 훅에 `getState()`라는 메소드가 붙어있거든요.<br /><br />`useTasksStore.getState()`처럼 호출하면, React 컴포넌트가 아닌 일반 자바스크립트 함수 안에서도 Zustand 스토어의 상태에 접근할 수 있습니다.<br /><br />

## 마치며

결론은 명확하죠.<br /><br />단순히 값을 여기저기 전달하는 목적이라면 Context API도 좋은 선택인데요.<br /><br />하지만 자주 변경되는 '상태'를 관리해야 하고, 그로 인한 불필요한 리렌더링을 피하고 싶다면, 셀렉터 기반의 강력한 최적화를 제공하는 Zustand가 훨씬 더 현명하고 효율적인 선택이 될 겁니다.<br /><br />게다가 보일러플레이트 없이 훨씬 간결한 코드를 작성할 수 있다는 건 정말 큰 매력이고요.<br /><br />혹시 아직 Zustand를 경험해보지 않으셨다면, 다음 프로젝트에서는 이 작고 강력한 곰(Zustand의 마스코트)의 힘을 한번 빌려보시는 건 어떨까요?<br /><br />
