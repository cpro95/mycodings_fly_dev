---
slug: 2025-04-20-comprehensive-honojs-tutorial
title: Hono.js 튜토리얼 - 간단한 REST API 만들기
date: 2025-04-20 12:28:10.142000+00:00
summary: 이 글에서는 Hono.js를 사용하여 간단한 REST API를 만드는 방법을 배웁니다. Hono.js는 경량화된 웹 프레임워크로, 높은 성능과 간결한 문법을 제공합니다.
tags: ["hono", "honojs", "cloudflare"]
contributors: []
draft: false
---

이 글에서는 **Hono.js**를 사용하여 간단한 REST API를 만드는 방법을 배웁니다.

Hono.js는 경량화된 웹 프레임워크로, 높은 성능과 간결한 문법을 제공합니다.

이 튜토리얼은 다음을 포함합니다.

- Hono.js 설치
- 간단한 라우팅 설정
- CRUD API 구현
- 테스트 및 실행

---

## 1단계: Hono.js 설치하기

### 설명

Hono.js를 사용하려면 Node.js 환경이 필요합니다. 먼저 프로젝트를 초기화하고, Hono.js를 설치합니다.

#### 설치 단계

1. 새로운 디렉토리를 생성하고 이동합니다.

   ```bash
   mkdir hono-tutorial && cd hono-tutorial
   ```

2. `npm init` 명령어로 Node.js 프로젝트를 초기화합니다.

   ```bash
   npm init -y
   ```

3. Hono.js를 설치합니다.

   ```bash
   npm install hono
   ```

### 질문

1. `npm init` 명령어는 무엇을 위한 것인가요?
2. Hono.js의 주요 특징 2가지만 설명해보세요.

### 답변

1. **`npm init`**: Node.js 프로젝트를 초기화하고, `package.json` 파일을 생성합니다. 이 파일은 프로젝트의 메타데이터(의존성, 스크립트 등)를 관리합니다.
2. Hono.js의 주요 특징:
   - 경량화된 웹 프레임워크로 빠른 성능을 제공합니다.
   - 간단하고 직관적인 라우팅 시스템을 지원합니다.

### 연습문제

Hono.js 외에 Node.js에서 사용할 수 있는 다른 웹 프레임워크를 2개 찾아보세요.

#### 정답

- Express.js
- Fastify

---

## 2단계: 기본 서버 설정

### 설명

Hono.js로 서버를 실행하려면 `Hono` 클래스를 사용하여 애플리케이션 인스턴스를 생성하고, 라우트를 설정한 뒤 서버를 시작해야 합니다.

#### 코드 예제

아래는 간단한 "Hello, Hono!" 서버를 만드는 코드입니다:

```javascript
// index.js
import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => c.text('Hello, Hono!'));

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
```

#### 실행 방법

1. `index.js` 파일을 생성하고 위 코드를 복사합니다.
2. 아래 명령어로 서버를 실행합니다:

   ```bash
   node index.js
   ```
3. 브라우저에서 `http://localhost:3000`에 접속하여 "Hello, Hono!" 메시지를 확인합니다.

### 질문

1. `app.get('/', ...)`에서 `'/'`는 무엇을 의미하나요?
2. 서버를 실행한 후 브라우저에서 메시지를 확인하려면 어떤 URL을 입력해야 하나요?

### 답변

1. `'/'`: 루트 경로를 의미하며, 기본적으로 `http://localhost:3000/`에 해당합니다.
2. 브라우저에서 `http://localhost:3000`을 입력하면 됩니다.

### 연습문제

`/about` 경로에서 "About Page"라는 텍스트를 반환하는 라우트를 추가해보세요.

#### 정답

```javascript
app.get('/about', (c) => c.text('About Page'));
```

---

## 3단계: CRUD API 구현

### 설명

REST API에서는 다음과 같은 HTTP 메서드가 자주 사용됩니다:
- **GET**: 데이터를 가져올 때
- **POST**: 새 데이터를 생성할 때
- **PUT**: 데이터를 수정할 때
- **DELETE**: 데이터를 삭제할 때

Hono.js를 사용하여 간단한 `todo` API를 만들어보겠습니다.

#### 코드 예제

```javascript
import { Hono } from 'hono';

const app = new Hono();
let todos = []; // 간단한 메모리 데이터베이스

// GET: 모든 todo 가져오기
app.get('/todos', (c) => c.json(todos));

// POST: 새로운 todo 추가
app.post('/todos', async (c) => {
  const newTodo = await c.req.json();
  todos.push(newTodo);
  return c.json(newTodo, 201);
});

// PUT: 특정 todo 수정
app.put('/todos/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const updatedTodo = await c.req.json();
  todos = todos.map((todo, index) => (index === id ? updatedTodo : todo));
  return c.json(updatedTodo);
});

// DELETE: 특정 todo 삭제
app.delete('/todos/:id', (c) => {
  const id = Number(c.req.param('id'));
  todos = todos.filter((_, index) => index !== id);
  return c.text('Deleted', 204);
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
```

### 설명 및 흐름

1. **`GET /todos`**: 현재 모든 todo를 배열 형태로 반환합니다.
2. **`POST /todos`**: 새로운 todo를 추가합니다.
3. **`PUT /todos/:id`**: 특정 `id`의 todo를 수정합니다.
4. **`DELETE /todos/:id`**: 특정 `id`의 todo를 삭제합니다.

---

### 질문

1. `c.json()`과 `c.text()`의 차이점은 무엇인가요?
2. `todos` 배열에 데이터를 저장하는 것이 실무에서 문제가 될 수 있는 이유는 무엇인가요?

### 답변

1. **`c.json()`**: JSON 형식으로 데이터를 반환합니다.
   **`c.text()`**: 단순 텍스트 형식으로 데이터를 반환합니다.
2. 실무에서는 데이터가 많아질 경우 메모리 부족 문제가 발생하거나, 서버가 재시작되면 데이터가 초기화되는 문제가 있습니다.

### 연습문제

1. `PUT` 메서드에서 `id`가 존재하지 않을 경우, "Todo not found" 오류 메시지를 반환하도록 수정해보세요.
2. `POST /todos` 요청 시, `title` 필드가 없으면 "Invalid data" 오류를 반환하도록 수정해보세요.

#### 정답

1. `PUT` 수정 코드:
   ```javascript
   app.put('/todos/:id', async (c) => {
     const id = Number(c.req.param('id'));
     if (id >= todos.length) {
       return c.text('Todo not found', 404);
     }
     const updatedTodo = await c.req.json();
     todos = todos.map((todo, index) => (index === id ? updatedTodo : todo));
     return c.json(updatedTodo);
   });
   ```

2. `POST` 수정 코드:
   ```javascript
   app.post('/todos', async (c) => {
     const newTodo = await c.req.json();
     if (!newTodo.title) {
       return c.text('Invalid data', 400);
     }
     todos.push(newTodo);
     return c.json(newTodo, 201);
   });
   ```

---

## 전체 요약

이 튜토리얼에서는 Hono.js를 사용해 기본 서버를 설정하고, 간단한 REST API를 구현했습니다.
Hono.js의 간결한 문법 덕분에 빠르고 쉽게 API를 개발할 수 있었습니다.

### 최종 챌린지

1. `/todos` API에 **todo의 완료 여부**를 나타내는 `completed` 필드를 추가하고, 이를 토대로 완료된 todo만 반환하는 `/todos/completed` 라우트를 만들어보세요.

#### 정답 예시

```javascript
app.get('/todos/completed', (c) => {
  const completedTodos = todos.filter((todo) => todo.completed);
  return c.json(completedTodos);
});
```
