---
slug: 2026-01-06-remix-3-component-todo-list-tailwind-tutorial
title: "Todo List를 만들며 맛보는 Remix 3 컴포넌트의 모든 것 (with Tailwind CSS)"
summary: "훅(Hooks) 없이 클로저만으로 상태를 관리하는 @remix-run/component와 최신 Tailwind CSS v4를 사용하여 초경량 Todo List를 만들어봅니다."
date: 2026-01-06T14:17:30.479Z
draft: false
weight: 50
tags: ["Remix", "React", "Component", "Tailwind CSS v4", "Todo List", "Vite", "ESLint", "Hooks", "Closure", "CRUD"]
contributors: []
---

### **프롤로그: 익숙한 맛(React)과 새로운 맛(Remix)의 조화**

리액트(React)로 개발하다 보면 가끔 "상태 관리가 왜 이렇게 복잡해졌지?"라는 생각이 들 때가 있는데요.

단순히 변수 값을 바꾸고 화면을 갱신하던 시절의 직관성이 그리울 때가 있습니다.

리믹스(Remix) 팀이 공개한 `@remix-run/component`는 바로 그 지점을 파고든 흥미로운 라이브러리입니다.

이 라이브러리는 **훅(Hooks)을 전혀 사용하지 않고**, 자바스크립트의 '클로저(Closure)'와 '일반 변수'만으로 상태를 관리하는데요.

오늘은 최신 Tailwind CSS (v4)와 함께, 아주 가볍고 빠른 'Todo List'를 만들어보며 이 기술을 제대로 사용해 보겠습니다.


### **1. 재료 준비: 프로젝트 생성 및 환경 설정**

가장 먼저 Vite 프로젝트를 생성하고, 리액트 관련 패키지를 걷어낸 뒤 필요한 재료들을 채워 넣어야 하는데요.

#### **1-1. Vite 프로젝트 생성**

```bash
# 1. 프로젝트 생성 (React + TypeScript 템플릿 사용)
✗ npm create vite@latest remix-todo-app -- --template react-ts
│
◇  Use rolldown-vite (Experimental)?:
│  No
│
◇  Install with npm and start now?
│  Yes
│
◇  Scaffolding project in /Users/Codings/Javascript/remix3-test/remix-todo-app...
│
◇  Installing dependencies with npm...
npm WARN EBADENGINE Unsupported engine {
npm WARN EBADENGINE   package: '@vitejs/plugin-react@5.1.2',
npm WARN EBADENGINE   required: { node: '^20.19.0 || >=22.12.0' },
npm WARN EBADENGINE   current: { node: 'v20.12.1', npm: '10.5.0' }
npm WARN EBADENGINE }
npm WARN EBADENGINE Unsupported engine {
npm WARN EBADENGINE   package: 'vite@7.3.1',
npm WARN EBADENGINE   required: { node: '^20.19.0 || >=22.12.0' },
npm WARN EBADENGINE   current: { node: 'v20.12.1', npm: '10.5.0' }
npm WARN EBADENGINE }

added 175 packages, and audited 176 packages in 12s

45 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
│
◇  Starting dev server...

> remix-todo-app@0.0.0 dev
> vite

  VITE v7.3.1  ready in 302 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help

cd remix-todo-app
```

#### **1-2. Tailwind CSS v4 및 라이브러리 설치**

최신 Tailwind CSS는 설정 파일(`tailwind.config.js`) 없이 Vite 플러그인만으로 동작합니다.

```bash
# 2. Tailwind CSS (Vite 플러그인) 및 리믹스 컴포넌트 설치
# 그리고 우리의 주인공 @remix-run/componet 도 같이 설치합니다.
npm install tailwindcss @tailwindcss/vite @remix-run/component
```

#### **1-3. 불필요한 리액트 패키지 정리**

우리는 리액트를 쓰지 않기 때문에 과감하게 삭제하겠습니다.

특히 ESLint 플러그인을 지워야 빌드 시 에러가 나지 않는데요.

```bash
# 3. 리액트 및 관련 린트 플러그인 삭제
npm uninstall react react-dom @types/react @types/react-dom @vitejs/plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh
```

### **2. 설정 파일 수정하기**

이제 각 설정 파일을 열어 리믹스 컴포넌트와 Tailwind가 동작하도록 수정해야 하는데요.

하나라도 빠뜨리면 안되니까 꼭 꼼꼼히 적용해 주시기 바랍니다.

#### **2-1. vite.config.ts (핵심)**

리액트 플러그인을 제거하고 `tailwindcss` 플러그인과 `esbuild` 설정을 추가하여 JSX를 리믹스 컴포넌트 방식으로 변환하도록 지시해야 합니다.

파일 전체를 아래와 같이 수정해 주세요.

**vite.config.ts**
```ts
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
// [삭제] import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // [추가] Tailwind CSS v4 Vite 플러그인
    tailwindcss(),
  ],

  // [추가] JSX 변환을 리믹스 컴포넌트 기준으로 설정
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: '@remix-run/component',
  },
})
```

#### **2-2. tsconfig.app.json**

타입스크립트에게도 JSX의 출처를 알려줘야 빨간 줄이 뜨지 않습니다.

compilerOptions 내부의 jsx 관련 설정을 확인해 주시면 됩니다.

**tsconfig.app.json**
```json
{
  "compilerOptions": {
    ...
    ...
    /* 다른 부분은 나두고 아래 부분만 수정 */
    "jsx": "react-jsx",
    "jsxImportSource": "@remix-run/component"
  },
  "include": ["src"]
}
```

#### **2-3. eslint.config.js**

기존 파일에는 리액트 훅 규칙을 강제하는 플러그인들이 포함되어 있는데요.

우리는 훅(Hook)을 쓰지 않으므로, 이 설정들이 남아있으면 정상적인 코드에서도 eslint는 에러를 뿜어냅니다.

여간 귀찮은게 아닌데요.

리액트 관련 플러그인을 삭제했으니 설정 파일에서도 지워줘야 합니다.

아래 코드처럼 리액트 관련 줄을 주석처리하시면 됩니다.

아예 지워도 됩니다.

**eslint.config.js**
```js
import js from "@eslint/js";
import globals from "globals";
// import reactHooks from 'eslint-plugin-react-hooks'
// import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      // reactHooks.configs.flat.recommended,
      // reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
]);

```

#### **2-4. src/index.css**

Tailwind v4는 `@import` 한 줄이면 준비 끝입니다.


**src/index.css**
```css
@import "tailwindcss";
```

### **3. 프로젝트 구조 및 타입 정의**

설정은 끝났으니 본격적으로 코드를 작성해 볼까요?

파일 구조는 기능별로 분리하여 관리하면 편한데요.

다들 React 앱 한번쯤은 만드어 보셨으니 잘 아실겁니다.

```text
src/
├── main.tsx                # 진입점
├── types.ts                # 공통 타입
├── App.tsx                 # 메인 로직
└── components/
    ├── TaskInput.tsx       # 입력창
    ├── TaskList.tsx        # 목록 (삭제 버튼 포함)
    └── TaskFilter.tsx      # 필터 버튼
```

먼저, types.ts 파일에 타입스크립트 타입을 정의합니다.

저는 아래와 같이 interface를 썼는데요.

**src/types.ts**
```ts
export interface Task {
  id: number
  title: string
  completed: boolean
}

export type FilterType = 'all' | 'active' | 'completed'
```

### **4. 컴포넌트 구현**

이제 TailwindCSS로 스타일을 입혀 본격적인 컴포넌트를 만들어보겠습니다.

#### **(1) TaskInput: 입력창 구현**

지난 시간에 배웠던 [Remix 3 기초 사용법](https://mycodings.fly.dev/blog/2026-01-05-remix-3-component-library-tutorial-closure-state/)을 기억하면 Remix 3는 리액트의 useRef 대신 connect 프롭을 사용해 input 요소에 접근하는데요.

상태 관리 훅인 useState Hook을 쓰지 않고 필요할 때 DOM에서 값을 꺼내 쓰는 직관적인 방식입니다.


**src/components/TaskInput.tsx**
```tsx
import type { Handle } from "@remix-run/component";

interface TaskInputProps {
  onAdd: (title: string) => void;
}

export function TaskInput(this: Handle, { onAdd }: TaskInputProps) {
  let inputEl: HTMLInputElement | null = null;

  const handleSubmit = () => {
    if (inputEl?.value.trim()) {
      onAdd(inputEl.value.trim());
      inputEl.value = "";
      inputEl.focus();
    }
  };

  return () => (
    <div class="flex gap-2 mb-6">
      <input
        class="flex-1 p-3 border border-gray-300 rounded-lg
               focus:outline-none focus:ring-2 focus-ring-blue-500
               shadow-sm transition"
        connect={(el: HTMLInputElement) => (inputEl = el)}
        type="text"
        placeholder="Todo 리스트를 입력하세요..."
        on={{
          keydown: (e: KeyboardEvent) => {
            if (e.key === "Enter" && !e.isComposing) handleSubmit();
          },
        }}
      />
      <button
        class="px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg
               hover:bg-blue-700 active:transform active:scale-95 transition
               shadow-md cursor-pointer"
        on={{ click: handleSubmit }}
      >
        Add
      </button>
    </div>
  );
}

```

#### **(2) TaskList: 리스트 및 삭제 기능 추가**

리스트 컴포넌트에는 각 항목 옆에 '삭제' 버튼을 추가하고, 클릭 시 부모에게 알리는 로직을 넣었습니다.

매번 변하는 tasks 데이터는 `반환되는 렌더 함수(안쪽)`의 인자로 받아야 함을 잊지 마셔야하는데요.

[지난 시간에 배운 글](https://mycodings.fly.dev/blog/2026-01-05-remix-3-component-library-tutorial-closure-state/)을 참고 하시면 됩니다.

또, Tailwind의 `group`과 `group-hover`를 활용해, 마우스를 올렸을 때만 '삭제' 버튼이 나타나도록 구현했습니다.


**src/components/TaskList.tsx**
```tsx
import type { Handle } from "@remix-run/component";
import type { Task, FilterType } from "../types";

interface TaskListProps {
  tasks: Task[];
  filter: FilterType;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export function TaskList(this: Handle) {
  return ({ tasks, filter, onToggle, onDelete }: TaskListProps) => {
    const filteredTasks = tasks.filter((t) => {
      if (filter === "active") return !t.completed;
      if (filter === "completed") return t.completed;
      return true;
    });
    if (filteredTasks.length === 0) {
      return <p class="text-center text-gray-500 py-4">No Todos</p>;
    }

    return (
      <ul class="space-py-3">
        {filteredTasks.map((task) => (
          <li
            key={task.id}
            class="flex items-center justify-between p-4
                   bg-white border border-gray-100 rounded-lg shadow-sm
                   hover:shadow-md transition group"
          >
            <div class="flex items-center gap-3 overflow-hidden">
              <input
                type="checkbox"
                checked={task.completed}
                class="w-5 h-5 accent-blue-600 cursor-pointer"
                on={{ change: () => onToggle(task.id) }}
              />
              <span
                class={`truncate select-none transition-colors duration-200
               ${
                 task.completed ? "text-gray-400 line-through" : "text-gray-800"
               }
               `}
              >
                {task.title}
              </span>
            </div>

            <button
              class="opacity-0 group-hover:opacity-100 px-3 py-1 text-xs font-medium
                     text-red-500 border border-red-200 rounded hover:bg-red-500
                     transition-all cursor-pointer"
              on={{ click: () => onDelete(task.id) }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    );
  };
}

```

#### **(3) TaskFilter: 필터링 UI**

현재 선택된 상태에 따라 조건부 스타일링을 적용하는 UI입니다.

**src/components/TaskFilter.tsx**
```tsx
import type { Handle } from "@remix-run/component";
import type { FilterType } from "../types";

interface TaskFilterProps {
  current: FilterType;
  onChange: (filter: FilterType) => void;
}

export function TaskFilter(this: Handle) {
  const renderButton = (
    label: string,
    value: FilterType,
    current: FilterType,
    onChange: any
  ) => {
    const isActive = current === value;

    return (
      <button
        class={`px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
          isActive
            ? "bg-gray-800 text-white shadow"
            : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
        }`}
        on={{ click: () => onChange(value) }}
      >
        {label}
      </button>
    );
  };

  return ({ current, onChange }: TaskFilterProps) => (
    <div>
      {renderButton("All", "all", current, onChange)}
      {renderButton("Active", "active", current, onChange)}
      {renderButton("Completed", "completed", current, onChange)}
    </div>
  );
}
```

### **5. App.tsx에 모두 모아넣기**

모든 로직을 하나로 합치는 단계입니다.

훅(Hook) 없이 일반 변수(`let`)로 상태를 관리하고 `this.update()`로 렌더링 하는 그야말로 리액트 개발자로서는 완전 신세계인데요.

**src/App.tsx**
```tsx
import type { Handle } from "@remix-run/component";
import type { Task, FilterType } from "./types";
import { TaskInput } from "./components/TaskInput";
import { TaskFilter } from "./components/TaskFilter";
import { TaskList } from "./components/TaskList";

export default function App(this: Handle) {
  // [Setup Phase] 상태 초기화 (단 1회 실행)
  let tasks: Task[] = [];
  let nextId = 1;
  let filter: FilterType = "all";

  // 할 일 추가 로직
  const addTask = (title: string) => {
    tasks.push({ id: nextId++, title, completed: false });
    // 할 일을 추가했으니 화면 업데이트가 필요하죠
    // 아래와 같이 this.update()로 간단하게 구현합니다.
    this.update();
  };

  // 할 일 토글
  const toggleTask = (id: number) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      task.completed = !task.completed;
      this.update();
    }
  };

  // 할 일 삭제
  const deleteTask = (id: number) => {
    tasks = tasks.filter((t) => t.id !== id);
    this.update();
  };

  // 필터 변경
  const setFilter = (newFilter: FilterType) => {
    filter = newFilter;
    this.update();
  };

  // [Render Phase] 화면 렌더링
  return () => (
    <div class="min-h-screen bg-gray-50 py-10 px-4 font-sans">
      <div
        class="max-w-lg mx-auto bg-white p-8 rounded-xl
               shadow-xl border border-gray-100"
      >
        <h1
          class="text-3xl font-bold text-center
                 text-gray-800 mb-8 tracking-tight"
        >
          Remix 3 Todo List
        </h1>

        <TaskInput onAdd={addTask} />
        <TaskFilter current={filter} onChange={setFilter} />
        <TaskList
          tasks={tasks}
          filter={filter}
          onToggle={toggleTask}
          onDelete={deleteTask}
        />
      </div>
    </div>
  );
}
```

### **6. Remix 3 진입점 설정**

마지막으로 `main.tsx`에서 앱을 실행해 줍니다.

**src/main.tsx**
```tsx
import { createRoot } from '@remix-run/component'
import App from './App'
import './index.css' // Tailwind가 포함된 CSS

createRoot(document.getElementById('root')!).render(<App />)
```

### **숫자로 증명하는 압도적인 가벼움**

이제 실행해 볼까요?

`npm run dev`를 실행해 보면 브라우저에 아래 그림과 같이 아주 잘 나올겁니다.

![remix-todo-app 실행 화면](https://blogger.googleusercontent.com/img/a/AVvXsEja_-GprTtrx8CHXpBguMTzbzWrG_kmrko3x1PUVyOB_VNS6H40BtQS5qSWFh2GmN6rNOSsX1qIS4CehzHQfrJTIwtzfSE77aV-B2clY1MfY1lRrCiMFq-xNiP6s3nsVSa-Gpz3FHl_sS3nXhH0v_d2GH3J9mNni5URZYJWUuJt-8drTz3k3WCm_8dG3AY=s16000)

그리고 모든 개발이 끝나고 `npm run build`를 통해 빌드를 해볼까요?

아래 처럼 결과를 확인한 순간, 이 라이브러리를 써야 할 가장 확실한 이유를 발견할 수 있는데요.


```bash
➜  remix3-todo-app git:(main) ✗ tree --du -h ./dist
[ 39K]  ./dist
├── [ 37K]  assets
│   ├── [ 15K]  index-DF8e6GQg.css  # Tailwind 스타일 포함
│   └── [ 22K]  index-jnByw3l4.js   # 라이브러리 + 앱 로직 전체
├── [ 466]  index.html
└── [1.5K]  vite.svg

  75K used in 2 directories, 4 files
```

보이시나요? **자바스크립트 번들 크기가 고작 22KB입니다.**

리액트(React)와 리액트 돔(ReactDOM)을 합치면 기본 런타임만으로도 40KB를 훌쩍 넘어가는데, 여기서는 **라이브러리 런타임 + 우리가 짠 앱 로직 + Tailwind 유틸리티 클래스 처리**까지 전부 합쳐도 40KB가 채 되지 않습니다.


**"더 적은 코드로, 더 빠른 웹을."**

리액트가 점점 더 복잡한 훅의 규칙으로 빠져드는 것과는 반대로, 리믹스 3는 전혀 다른 방식으로 접근하고 있는데요.

Svelte가 빠르고 좋다고 하지만 JSX를 쓰지 못해 아쉬었는데요.

Remix 3는 조금만 노력하면 쉽게 익힐 수 있고, JSX를 쓸 수 있어 리액트 개발자로서 조금 더 익숙할 수 있을 거 같습니다.

그러면 여러분도 가벼운 사이드 프로젝트나 성능이 중요한 위젯을 만들 때, 리액트 대신 이 녀석을 선택해 보는 건 어떨까요?

그럼.
