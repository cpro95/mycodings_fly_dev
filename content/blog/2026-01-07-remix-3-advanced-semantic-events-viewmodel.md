---
slug: 2026-01-07-remix-3-advanced-semantic-events-viewmodel
title: "리믹스(Remix) 3 심화 편: 시맨틱 이벤트와 ViewModel 패턴으로 프레임워크 의존성 줄이기"
summary: "@remix-run/interaction을 활용한 시맨틱 이벤트 처리와 EventTarget 기반의 ViewModel 패턴을 통해 비즈니스 로직을 UI에서 완벽하게 분리하는 방법을 알아봅니다."
date: 2026-01-07T13:24:50.427Z
draft: false
weight: 50
tags: ["Remix", "Semantic Events", "ViewModel", "EventTarget", "Architecture", "Frontend", "Framework Agnostic", "Remix 3", "remix 3", "remix", "react"]
contributors: []
---
- [**왜 이렇게 해야 할까요?**](#왜-이렇게-해야-할까요)
  - [**@remix-run/interaction의 장점**](#remix-runinteraction의-장점)
  - [**ViewModel 패턴의 장점**](#viewmodel-패턴의-장점)
- [**@remix-run/interaction이란?**](#remix-runinteraction이란)
  - [**설치**](#설치)
  - [**기본적인 사용법**](#기본적인-사용법)
- [**실전 구현: 태스크 관리 앱에 적용하기**](#실전-구현-태스크-관리-앱에-적용하기)
  - [**TaskInput - press 인터랙션**](#taskinput---press-인터랙션)
  - [**TaskItem - longPress로 편집 모드 진입**](#taskitem---longpress로-편집-모드-진입)
  - [**TaskList - 화살표 키 내비게이션**](#tasklist---화살표-키-내비게이션)
- [**ViewModel 패턴으로 리팩토링**](#viewmodel-패턴으로-리팩토링)
  - [**현재의 문제점**](#현재의-문제점)
  - [**TaskViewModel 구현**](#taskviewmodel-구현)
  - [**리팩토링 후의 컴포넌트**](#리팩토링-후의-컴포넌트)
  - [**장점**](#장점)
  - [**MVVM 패턴과의 대응**](#mvvm-패턴과의-대응)
- [**'일큐(Ikyu) 레스토랑'의 아키텍처와의 접점**](#일큐ikyu-레스토랑의-아키텍처와의-접점)
- [**React에서 같은 ViewModel을 쓴다면?**](#react에서-같은-viewmodel을-쓴다면)
- [**미래에 대한 전망**](#미래에-대한-전망)
  - [**도메인 이벤트의 확장**](#도메인-이벤트의-확장)
  - [**API 백엔드와의 결합**](#api-백엔드와의-결합)
  - [**모바일로의 가능성**](#모바일로의-가능성)
- [**리액트와 비교하며 생각해 볼 점**](#리액트와-비교하며-생각해-볼-점)
  - [**Class 사용에 대한 거부감?**](#class-사용에-대한-거부감)
- [**마무리**](#마무리)


---

지난번에는 `@remix-run/component`의 기본적인 사용법을 소개해 드렸는데요.

지난번 글을 꼭 읽어 보시기 바랍니다.

링크 : [리믹스(Remix) 3의 새로운 컴포넌트 완전 정복: 훅(Hooks) 없이 클로저로 개발하는 완벽 가이드](https://mycodings.fly.dev/blog/2026-01-05-remix-3-component-library-tutorial-closure-state/)

이번에는 거기서 한 걸음 더 나아가, `@remix-run/interaction`을 활용한 '시맨틱(의미론적) 이벤트 처리'와 '뷰모델(ViewModel) 패턴'을 통한 로직 분리에 대해 깊이 있게 다뤄보려 합니다.

### **왜 이렇게 해야 할까요?**

#### **@remix-run/interaction의 장점**

`click`이나 `keydown` 같은 로우 레벨(Low-level) 이벤트에는 몇 가지 과제가 있는데요.

예를 들어 버튼은 마우스 클릭뿐만 아니라 키보드의 Enter나 Space 키로도 눌릴 수 있어야 하고, 길게 누르기(Long press)를 구현하려면 타이머 관리가 복잡해집니다.

모바일 환경에서는 터치 이벤트까지 고려해야 하죠.

`@remix-run/interaction`은 이런 복잡한 상황들을 '시맨틱 인터랙션'으로 추상화해 줍니다.

단지 `press`라고 적기만 하면 클릭, 탭, 엔터/스페이스 키 입력에 모두 대응할 수 있게 됩니다.


#### **ViewModel 패턴의 장점**

지난번 구현에서는 상태(State)와 로직(Logic)이 컴포넌트 안에 뒤섞여 있었는데요.


```ts
function App(this: Handle) {
  let tasks: Task[] = []

  const addTask = (title: string) => {
    tasks.push({ id: nextId++, title, completed: false })
    this.update()  // ← UI 업데이트 알림이 로직에 섞여 있음
  }
  // ...
}
```

이런 방식은 테스트를 할 때 컴포넌트의 컨텍스트가 필요해져서 까다롭고, 다른 UI에서 같은 로직을 재사용하기도 어렵습니다.

상태가 바뀔 때마다 `this.update()`가 여기저기 흩어져 있어 코드의 흐름을 파악하기도 쉽지 않죠.

ViewModel 패턴으로 로직을 분리해 내면, 순수한 TypeScript 클래스로서 테스트하고 재사용할 수 있게 됩니다.


### **@remix-run/interaction이란?**

이것은 `EventTarget` 기반의 이벤트 핸들링 라이브러리인데요.

`click`이나 `keydown` 같은 로우 레벨 이벤트를 `press`(클릭/탭/엔터)나 `longPress`(길게 누르기) 같은 시맨틱한 인터랙션으로 추상화해 줍니다.


#### **설치**

```bash
npm install @remix-run/interaction
```

#### **기본적인 사용법**

기존의 이벤트 핸들링과 비교해 볼까요?


```jsx
// 기존: 로우 레벨 이벤트
<button on={{ click: handleSubmit }}>Add</button>

// @remix-run/interaction: 시맨틱 이벤트
import { press } from '@remix-run/interaction/press'

<button on={{ [press]: handleSubmit }}>Add</button>
```

여기서 `press`는 마우스 클릭, 터치, 키보드 Enter/Space 입력을 모두 통합한 인터랙션입니다.


### **실전 구현: 태스크 관리 앱에 적용하기**

지난 시간에 만든 태스크 관리 앱에 `@remix-run/interaction`을 도입해 보겠습니다.


#### **TaskInput - press 인터랙션**

버튼의 클릭과 키보드 조작을 `press` 하나로 통일합니다.


```tsx
import type { Handle } from '@remix-run/component'
import { press } from '@remix-run/interaction/press'

interface Props {
  onAdd: (title: string) => void
}

export default function TaskInput(this: Handle, { onAdd }: Props) {
  let inputEl: HTMLInputElement | null = null

  const handleSubmit = () => {
    if (inputEl?.value.trim()) {
      onAdd(inputEl.value.trim())
      inputEl.value = ''
    }
  }

  return () => (
    <div class="flex gap-2">
      <input
        connect={(el: HTMLInputElement) => {
          inputEl = el
        }}
        type="text"
        on={{
          keydown: (e: KeyboardEvent) => {
            if (e.key === 'Enter' && !e.isComposing) handleSubmit()
          },
        }}
      />
      <button type="button" on={{ [press]: handleSubmit }}>
        Add
      </button>
    </div>
  )
}
```

#### **TaskItem - longPress로 편집 모드 진입**

타스크 이름을 길게 누르면(500ms) 편집 모드로 진입하도록 구현해 보겠습니다.


```tsx
import type { Handle } from '@remix-run/component'
import { longPress, press } from '@remix-run/interaction/press'
import type { Task } from '../types'

interface Props {
  task: Task
  onToggle: (id: number) => void
  onDelete: (id: number) => void
  onEdit: (id: number, title: string) => void
}

export default function TaskItem(this: Handle) {
  let isEditing = false
  let editValue = ''

  const startEdit = (title: string) => {
    isEditing = true
    editValue = title
    this.update()
  }

  const cancelEdit = () => {
    isEditing = false
    this.update()
  }

  const confirmEdit = (id: number, onEdit: Props['onEdit']) => {
    if (editValue.trim()) {
      onEdit(id, editValue.trim())
    }
    isEditing = false
    this.update()
  }

  return ({ task, onToggle, onDelete, onEdit }: Props) => (
    <li tabindex={0} class="flex items-center gap-3 py-3">
      <input
        type="checkbox"
        checked={task.completed}
        on={{ change: () => onToggle(task.id) }}
      />

      {isEditing ? (
        <input
          type="text"
          value={editValue}
          on={{
            input: (e: Event) => {
              editValue = (e.target as HTMLInputElement).value
            },
            keydown: (e: KeyboardEvent) => {
              if (e.key === 'Enter') confirmEdit(task.id, onEdit)
              if (e.key === 'Escape') cancelEdit()
            },
            blur: cancelEdit,
          }}
        />
      ) : (
        <span
          on={{
            [longPress]: (e: Event) => {
              e.preventDefault()
              startEdit(task.title)
            },
          }}
        >
          {task.title}
        </span>
      )}

      <button type="button" on={{ [press]: () => onDelete(task.id) }}>
        Delete
      </button>
    </li>
  )
}
```

`longPress`는 500ms 동안 누르고 있을 때 감지되며, 단순 탭이나 클릭에서는 발생하지 않습니다.


#### **TaskList - 화살표 키 내비게이션**

위아래 화살표 키로 태스크 간 포커스를 이동할 수 있게 만들어봅시다.


```tsx
import type { Handle } from '@remix-run/component'
import { arrowDown, arrowUp } from '@remix-run/interaction/keys'
import type { Task } from '../types'
import TaskItem from './TaskItem'

interface Props {
  tasks: Task[]
  onToggle: (id: number) => void
  onDelete: (id: number) => void
  onEdit: (id: number, title: string) => void
}

export default function TaskList(this: Handle) {
  let listEl: HTMLUListElement | null = null

  const handleArrowUp = () => {
    if (!listEl) return
    const items = listEl.querySelectorAll<HTMLLIElement>('li[tabindex]')
    const currentIndex = Array.from(items).indexOf(
      document.activeElement as HTMLLIElement,
    )
    if (currentIndex > 0) {
      items[currentIndex - 1]?.focus()
    }
  }

  const handleArrowDown = () => {
    if (!listEl) return
    const items = listEl.querySelectorAll<HTMLLIElement>('li[tabindex]')
    const currentIndex = Array.from(items).indexOf(
      document.activeElement as HTMLLIElement,
    )
    if (currentIndex < items.length - 1) {
      items[currentIndex + 1]?.focus()
    }
  }

  return ({ tasks, onToggle, onDelete, onEdit }: Props) => (
    <ul
      connect={(el: HTMLUListElement) => {
        listEl = el
      }}
      on={{
        [arrowUp]: handleArrowUp,
        [arrowDown]: handleArrowDown,
      }}
    >
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </ul>
  )
}
```

`tabindex={0}`을 가진 `<li>` 요소들 사이를 키보드로 자유롭게 이동할 수 있게 되었습니다.


### **ViewModel 패턴으로 리팩토링**

지금까지의 구현은 상태와 로직이 컴포넌트 안에 섞여 있었는데요.

이제 이것을 ViewModel 패턴으로 깔끔하게 분리해 보겠습니다.


#### **현재의 문제점**

```ts
function App(this: Handle) {
  // 상태
  let tasks: Task[] = []
  let nextId = 1
  let filter: FilterType = 'all'
  let isLoading = true

  // 로직 (상태 변경 + this.update())
  const addTask = (title: string) => {
    tasks.push({ id: nextId++, title, completed: false })
    this.update()  // ← UI 알림이 로직에 포함됨
  }

  // 파생 상태
  const getFilteredTasks = () => { ... }
  const getActiveCount = () => { ... }

  return () => ( ... )
}
```

로직 내부에 `this.update()`가 산재해 있어서, 컴포넌트 없이 순수 로직만 테스트하기가 어렵고 재사용성도 떨어집니다.


#### **TaskViewModel 구현**

지난 글에서 소개했던 `ThemeStore`와 같은 패턴으로, `EventTarget`을 상속받은 ViewModel을 만듭니다.


```ts
// src/stores/TaskViewModel.ts
import type { FilterType, Task } from '../types'

export class TaskViewModel extends EventTarget {
  tasks: Task[] = []
  nextId = 1
  filter: FilterType = 'all'
  isLoading = true

  async load() {
    const res = await fetch('/initial-tasks.json')
    const data = (await res.json()) as { tasks: Task[]; nextId: number }
    this.tasks = data.tasks
    this.nextId = data.nextId
    this.isLoading = false
    this.emit()
  }

  addTask(title: string) {
    this.tasks.push({ id: this.nextId++, title, completed: false })
    this.emit()
  }

  toggleTask(id: number) {
    const task = this.tasks.find((t) => t.id === id)
    if (task) {
      task.completed = !task.completed
      this.emit()
    }
  }

  deleteTask(id: number) {
    this.tasks = this.tasks.filter((t) => t.id !== id)
    this.emit()
  }

  editTask(id: number, title: string) {
    const task = this.tasks.find((t) => t.id === id)
    if (task) {
      task.title = title
      this.emit()
    }
  }

  setFilter(filter: FilterType) {
    this.filter = filter
    this.emit()
  }

  clearCompleted() {
    this.tasks = this.tasks.filter((t) => !t.completed)
    this.emit()
  }

  get filteredTasks(): Task[] {
    switch (this.filter) {
      case 'active':
        return this.tasks.filter((t) => !t.completed)
      case 'completed':
        return this.tasks.filter((t) => t.completed)
      default:
        return this.tasks
    }
  }

  get activeCount(): number {
    return this.tasks.filter((t) => !t.completed).length
  }

  get hasCompleted(): boolean {
    return this.tasks.some((t) => t.completed)
  }

  private emit() {
    this.dispatchEvent(new Event('change'))
  }
}
```

#### **리팩토링 후의 컴포넌트**

```tsx
// src/entry.tsx
import { createRoot, type Handle } from '@remix-run/component'
import { TaskViewModel } from './stores/TaskViewModel'

function App(this: Handle) {
  const vm = new TaskViewModel()

  // 변경 사항 구독
  this.on(vm, { change: () => this.update() })

  // 초기 로드
  vm.load()

  return () => (
    <ThemeProvider>
      <div class="mx-auto max-w-lg p-5 font-sans">
        {vm.isLoading ? (
          <p>읽어오는 중...</p>
        ) : (
          <>
            <TaskInput onAdd={(title) => vm.addTask(title)} />
            <TaskFilter current={vm.filter} onChange={(f) => vm.setFilter(f)} />
            <TaskList
              tasks={vm.filteredTasks}
              onToggle={(id) => vm.toggleTask(id)}
              onDelete={(id) => vm.deleteTask(id)}
              onEdit={(id, title) => vm.editTask(id, title)}
            />

            {vm.tasks.length > 0 && (
              <TaskFooter
                activeCount={vm.activeCount}
                hasCompleted={vm.hasCompleted}
                onClearCompleted={() => vm.clearCompleted()}
              />
            )}
          </>
        )}
      </div>
    </ThemeProvider>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
```

#### **장점**

ViewModel은 순수한 TypeScript 클래스이므로 `vitest` 등으로 쉽게 테스트할 수 있습니다.

컴포넌트는 오직 '표시'만 담당하고, 로직은 ViewModel로 관심사가 분리되어 다른 UI에서도 동일한 ViewModel을 재사용할 수 있죠.

또한 getter를 활용해 파생 상태를 정의하면 타입 추론도 자연스럽게 됩니다.


#### **MVVM 패턴과의 대응**

*   **View (컴포넌트)**: 표시만 담당, `this.on(vm, { change })`로 구독.
*   **ViewModel (EventTarget 상속 클래스)**: 상태 + 로직, `dispatchEvent`로 변경 알림.
*   **Model (타입 정의 + API)**: Task, FilterType, 데이터 페칭 등.

### **'일큐(Ikyu) 레스토랑'의 아키텍처와의 접점**

일본의 유명한 서비스인 '일큐 레스토랑'에서 공개한 "React/Remix 의존성을 최소화하는 프론트엔드 설계"라는 글이 있는데요.

여기서는 프레임워크 의존성을 최소화하기 위한 3계층 아키텍처를 제안하고 있습니다.


1.  **컴포넌트 계층 (React)**: 표시에 대한 책임만 가짐.
2.  **커스텀 훅 계층**: 어댑터 역할.
3.  **바닐라 JS 로직 계층**: 이식성을 확보.

`@remix-run/component`에서는 이런 설계가 특별한 아키텍처적 노력 없이도 매우 자연스럽게 달성됩니다.


| 관점 | React (일큐 방식) | @remix-run/component |
| :--- | :--- | :--- |
| **로직 계층** | Vanilla JS Store | **TaskViewModel (EventTarget)** |
| **어댑터** | 커스텀 훅 | **불필요 (this.on으로 직접 구독)** |
| **상태 관리** | useReducer + Context | **일반 변수** |
| **보일러플레이트** | 많음 | **적음** |

일큐의 아키텍처가 지향하는 '프레임워크 의존성 최소화'는 `@remix-run/component` + ViewModel 패턴으로 아주 쉽게 실현될 수 있습니다.


### **React에서 같은 ViewModel을 쓴다면?**

참고로, 이번에 만든 `TaskViewModel`을 리액트에서 쓴다면 어떻게 될까요?


```tsx
import { useSyncExternalStore } from 'react'
import { TaskViewModel } from './stores/TaskViewModel'

const vm = new TaskViewModel()

function useTaskViewModel() {
  return useSyncExternalStore(
    (callback) => {
      vm.addEventListener('change', callback)
      return () => vm.removeEventListener('change', callback)
    },
    () => vm
  )
}

function App() {
  const vm = useTaskViewModel()
  return <TaskList tasks={vm.filteredTasks} />
}
```

`EventTarget` 기반의 ViewModel은 리액트에서도 그대로 사용할 수 있습니다.

`useSyncExternalStore`가 어댑터 역할을 할 뿐, 로직 자체는 공통으로 사용됩니다.

이것이 바로 일큐 방식이 추구하는 바이죠.


### **미래에 대한 전망**

도메인 이벤트 확장, API 백엔드와의 결합, 그리고 모바일로의 확장 가능성에 대해 생각해 보겠습니다.


#### **도메인 이벤트의 확장**

이번 `TaskViewModel`에서는 단순한 `change` 이벤트만 썼지만, 더 복잡한 도메인 모델에서는 시맨틱한 이벤트를 정의할 수도 있습니다.

`@remix-run/interaction`에는 `TypedEventTarget`이라는 헬퍼가 있어서 타입 안전한 이벤트 정의가 가능합니다.


```ts
import { TypedEventTarget } from '@remix-run/interaction'

// 이벤트 타입 정의
type ReservationEvents = {
  'reservation:confirmed': CustomEvent<{ id: string; confirmedAt: Date }>
  'reservation:cancelled': CustomEvent<{ id: string; reason: string }>
}

// 예약 시스템 예시
class ReservationViewModel extends TypedEventTarget<ReservationEvents> {
  confirm(id: string) {
    // 확정 처리
    this.dispatchEvent(new CustomEvent('reservation:confirmed', {
      detail: { id, confirmedAt: new Date() }
    }))
  }

  cancel(id: string, reason: string) {
    // 취소 처리
    this.dispatchEvent(new CustomEvent('reservation:cancelled', {
      detail: { id, reason }
    }))
  }
}

// 구독 측 - 타입 자동 완성이 됨
vm.addEventListener('reservation:confirmed', (e) => {
  console.log(e.detail.id, e.detail.confirmedAt)
})
```

`TypedEventTarget`이나 `EventTarget` 모두 웹 표준 API이므로, 리액트든 리믹스든 혹은 미래에 나올 다른 프레임워크든 똑같이 사용할 수 있습니다.

도메인 로직이 프레임워크에 의존하지 않는다는 것은 바로 이런 것을 의미합니다.

태스크 관리 앱에서는 과한 기술일 수 있지만, 예약 시스템이나 결제 플로우 같은 복잡한 도메인에서는 이런 시맨틱 이벤트 설계가 빛을 발할 것입니다.


#### **API 백엔드와의 결합**

레포지토리(Repository) 패턴을 도입하면 API와의 결합도 ViewModel 안에 가둘 수 있습니다.


```ts
export interface TaskRepository {
  getAll(): Promise<{ tasks: Task[]; nextId: number }>
  create(title: string): Promise<Task>
  update(id: number, patch: Partial<Task>): Promise<Task>
  delete(id: number): Promise<void>
}

export class TaskViewModel extends EventTarget {
  constructor(private repo: TaskRepository) {
    super()
  }

  async addTask(title: string) {
    // 낙관적 업데이트 (Optimistic Update)
    const tempId = this.nextId++
    this.tasks.push({ id: tempId, title, completed: false })
    this.emit()

    const created = await this.repo.create(title)
    // 서버에서 받은 ID로 교체 등...
  }
}
```

#### **모바일로의 가능성**

이건 제 사견이지만, `@remix-run/component`의 설계(일반 변수, EventTarget 기반 상태 관리, 시맨틱 인터랙션)는 SwiftUI나 Jetpack Compose 같은 모바일 UI 프레임워크와 통하는 부분이 있다고 느껴집니다.

비즈니스 로직을 순수한 TypeScript(EventTarget 상속 ViewModel)로 구현해 두면, 장차 'Remix Native' 같은 모바일용 프레임워크가 나왔을 때 로직을 공유할 수 있지 않을까요? 그런 상상을 해보게 됩니다.


### **리액트와 비교하며 생각해 볼 점**

#### **Class 사용에 대한 거부감?**

솔직히 저도 `class` 사용에는 거부감이 있습니다.

리액트의 함수형 컴포넌트와 훅에 익숙해져 있다 보니, 클래스 기반의 ViewModel은 왠지 낡은 방식처럼 느껴지기도 하는데요.

하지만 `EventTarget` 자체가 클래스를 전제로 한 API이다 보니, 이를 상속해서 사용하는 것이 가장 자연스러운 형태이긴 합니다.

'이런 작성 방식도 있구나' 정도로 받아들여 주시면 좋겠습니다.

### **마무리**

`@remix-run/interaction`과 ViewModel 패턴을 조합하여 `press`, `longPress`, `arrowUp/arrowDown` 같은 시맨틱 인터랙션을 구현하고, `EventTarget` 상속 ViewModel로 로직을 깔끔하게 분리해 보았습니다.

이를 통해 일큐 방식이 지향하는 '프레임워크 의존성 최소화'도 자연스럽게 달성할 수 있었죠.


`@remix-run/component`의 생태계는 아직 발전 도상에 있지만, 웹 표준 API를 활용한 그 설계 사상은 장기적인 유지보수성을 고민하는 데 있어 훌륭한 참고가 됩니다.

