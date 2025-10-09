---
slug: 2025-07-25-golang-gorm-gin-tutorial-4-fullstack-react-frontend-ui-app
title: Golang, Gin, GORM 실전 API 개발 4편 - 최첨단 Full-Stack 완성편 Vite, TanStack, Zustand, shadcn/ui
date: 2025-07-26 13:11:57.367000+00:00
summary: React 개발의 최신 트렌드를 모두 담아 프론트엔드를 재구축합니다. Vite의 빠른 개발 환경, TanStack의 강력한 라우팅 및 데이터 관리, Zustand의 간결한 상태 관리, shadcn/ui의 미려한 UI를 통해 프로덕션급 풀스택 애플리케이션을 완성합니다.
tags: ["Golang", "React", "Vite", "TanStack", "Zustand", "shadcn", "Docker", "Full-Stack", "튜토리얼", "타입스크립트"]
contributors: []
draft: false
---

지난 튜토리얼에서 우리는 React를 사용하여 백엔드 API와 연동되는 프론트엔드를 구축하고, 이를 Docker로 통합하는 과정을 마쳤습니다.<br />

하지만 웹 기술의 발전 속도는 눈부시게 빠르며, 개발자 경험과 애플리케이션 성능을 극대화하는 새로운 도구들이 끊임없이 등장하고 있습니다.<br />

이번 4편은 단순한 기능 구현을 넘어, '어떻게 하면 더 효율적이고 전문적으로 프론트엔드를 개발할 수 있는가'에 대한 해답을 제시하는 '심화 재구축' 과정입니다.<br />

우리는 이전의 프론트엔드 코드를 과감히 버리고, 2024년 현재 가장 주목받는 최첨단 기술 스택으로 완전히 새롭게 무장할 것입니다.<br />

'Vite'의 빛처럼 빠른 개발 서버와 빌드 속도, 'TanStack(Router & Query)'이 제공하는 완벽한 타입-세이프 라우팅과 선언적 데이터 관리, 'Zustand'의 놀랍도록 간결한 전역 상태 관리, 그리고 'shadcn/ui'와 'Tailwind CSS'를 통한 미려하고 일관성 있는 UI 시스템까지.<br />

이 모든 것을 유기적으로 결합하여, 단순히 동작하는 애플리케이션이 아닌, 유지보수성이 뛰어나고 성능이 최적화된 프로덕션급 웹 애플리케이션을 만드는 전 과정을 경험하게 될 것입니다.<br />

## 1. 최신 기술 스택으로 개발 환경 재구성

먼저, 프로젝트의 기반을 완전히 새롭게 다지겠습니다.<br />

'Vite를 이용한 TypeScript 기반 React 프로젝트 생성'<br />

프로젝트 루트 디렉터리에서 다음 명령어로 Vite 기반의 React + TypeScript 프로젝트를 생성합니다.<br />

```bash
npx create-vite@latest frontend -- --template react-ts
```
<br />

'핵심 라이브러리 설치'<br />

새로 생성된 `frontend` 디렉터리로 이동하여 필요한 모든 라이브러리를 설치합니다.<br />

```bash
cd frontend
# UI 및 스타일링
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 상태 관리 및 라우팅, 데이터 페칭
npm install zustand @tanstack/react-router @tanstack/react-query axios better-react-auth

# shadcn/ui 초기 설정
npx shadcn-ui@latest init
```
<br />
`shadcn/ui init` 과정에서 TypeScript, `tailwind.config.js` 경로 등 몇 가지 질문에 답하면, UI 컴포넌트를 위한 기본 설정이 자동으로 완료됩니다.<br />

## 2. 전역 상태 및 인증 시스템 구축 (Zustand & better-react-auth)

인증 상태는 앱 전반에서 사용되므로, 간결한 전역 상태 관리 라이브러리인 Zustand와 인증 라이브러리를 결합하여 관리합니다.<br />

'Zustand 스토어 생성 (`frontend/src/store/authStore.js`)'<br />

로그인 상태와 토큰 정보를 담을 간단한 스토어를 만듭니다.<br />

```typescript
import { create } from 'zustand';

const useAuthStore = create((set) => ({
  token: localStorage.getItem('token') || null,
  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    set({ token });
  },
}));

export default useAuthStore;
```
<br />

'인증 컨텍스트 제공 (`frontend/src/App.tsx`)'<br />

`better-react-auth`의 `AuthProvider`를 사용하여 앱 전체에 인증 관련 함수를 제공합니다.<br />

```typescript
// ... imports
import { AuthProvider } from 'better-react-auth';
import useAuthStore from './store/authStore';
import apiClient from './api/client';

function App() {
  const { setToken } = useAuthStore();

  const login = async (credentials) => {
    const { data } = await apiClient.post('/login', credentials);
    setToken(data.token);
  };

  const logout = () => {
    setToken(null);
  };
  
  // ...
  return (
    <AuthProvider authClient={{ login, logout, register: ... }}>
      {/* 라우터 컴포넌트가 위치할 곳 */}
    </AuthProvider>
  );
}
```
<br />

## 3. 타입-세이프 라우팅 (TanStack Router)

TanStack Router는 파일 기반이 아닌 코드 기반의 완전한 타입-세이프 라우팅을 제공하여, 경로와 파라미터를 안전하게 관리할 수 있게 해줍니다.<br />

'라우트 트리 정의 (`frontend/src/routeTree.gen.ts`는 자동생성)'<br />

`src/routes` 디렉터리에 각 라우트 파일을 정의하면, TanStack Router가 이를 감지하여 타입-세이프한 라우트 트리를 자동으로 생성합니다.<br />

'루트 라우트 설정 (`frontend/src/routes/__root.tsx`)'<br />

모든 라우트의 기반이 되는 최상위 레이아웃을 정의합니다.<br />

```typescript
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { useAuth } from 'better-react-auth';

export const Route = createRootRoute({
  component: () => {
    const { user } = useAuth(); // 인증 상태 확인
    return (
      <>
        {/* 네비게이션 바 등 공통 UI */}
        <hr />
        <Outlet />
      </>
    );
  },
});
```
<br />
'보호된 라우트 구현 (`frontend/src/routes/memos.tsx`)'<br />

`beforeLoad` 옵션을 사용하여, 인증되지 않은 사용자가 이 경로에 접근하려고 하면 로그인 페이지로 리디렉션시킵니다.<br />

```typescript
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/memos')({
  beforeLoad: ({ context, location }) => {
    // context.auth는 AuthProvider에서 주입된 상태입니다.
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: MemosPage,
});

function MemosPage() {
  // 메모 페이지 컴포넌트
  return <div>메모 페이지</div>;
}
```
<br />

## 4. 선언적 데이터 관리 및 UI 구현 (TanStack Query & shadcn/ui)

로딩, 에러, 상태 관리를 직접 하던 방식에서 벗어나, TanStack Query를 통해 데이터를 선언적으로 관리합니다.<br />

'메모 페이지 완성 (`frontend/src/routes/memos.tsx`)'<br />

`useQuery`로 데이터를 가져오고, `useMutation`으로 데이터를 변경하며, `shadcn/ui`로 멋진 UI를 구성합니다.<br />

```typescript
// ... MemosPage 컴포넌트 내부
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

// API 호출 함수
const fetchMemos = async () => (await apiClient.get('/memos')).data;
const addMemo = async (newMemo) => (await apiClient.post('/memos', newMemo)).data;
const deleteMemo = async (id) => (await apiClient.delete(`/memos/${id}`)).data;

function MemosPage() {
  const queryClient = useQueryClient();

  // 데이터 조회
  const { data: memos, isLoading } = useQuery({ 
    queryKey: ['memos'], 
    queryFn: fetchMemos 
  });

  // 데이터 추가 (Mutation)
  const mutation = useMutation({
    mutationFn: addMemo,
    onSuccess: () => {
      // 성공 시 'memos' 쿼리를 무효화하여 자동으로 데이터를 다시 불러옵니다.
      queryClient.invalidateQueries({ queryKey: ['memos'] });
    },
  });

  // ... (삭제, 수정 Mutation도 유사하게 구현)

  if (isLoading) return <div>로딩 중...</div>;

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>내 메모장</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={...}>
          <Input placeholder="새 메모..." />
          <Button type="submit">추가</Button>
        </form>
        {/* memos.map(...)을 통해 메모 목록 렌더링 */}
      </CardContent>
    </Card>
  );
}
```
<br />

## 5. 최종 통합 배포 (Backend + Frontend in one Docker)

백엔드와 최신 프론트엔드 스택을 하나의 Docker 이미지로 통합합니다.<br />

Vite의 빌드 결과물 디렉터리는 `build`가 아닌 `dist`라는 점에 유의해야 합니다.<br />

'백엔드 수정 (`main.go`)'<br />

정적 파일을 서빙하는 경로를 `build`에서 `dist`로 변경합니다.<br />

```go
// ... main.go
    // React 정적 파일 서빙 경로를 'dist'로 변경합니다.
    router.Static("/assets", "./frontend/dist/assets") // Vite는 보통 assets 폴더를 사용합니다.
    router.StaticFile("/", "./frontend/dist/index.html")
    router.StaticFile("/favicon.ico", "./frontend/dist/favicon.ico")

    // 클라이언트 사이드 라우팅을 위한 대체 경로 설정
    router.NoRoute(func(c *gin.Context) {
        c.File("./frontend/dist/index.html")
    })
// ...
```
<br />

'최종 Dockerfile 작성'<br />

프론트엔드 빌드 스테이지가 Vite 환경에 맞게 수정됩니다.<br />

```
# Dockerfile

# --- 1단계: 백엔드 빌드 환경 ---
FROM golang:1.21-alpine AS go-builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -a -o /go/bin/memo-api .

# --- 2단계: 프론트엔드 빌드 환경 (Vite) ---
FROM node:20-alpine AS fe-builder
WORKDIR /app
# frontend 디렉터리의 package.json, package-lock.json 복사
COPY frontend/package*.json ./
# 의존성 설치 (npm ci는 package-lock.json을 사용해 더 빠르고 일관된 설치를 보장)
RUN npm ci
# frontend 소스 코드 전체 복사
COPY frontend/ ./
# Vite를 사용하여 React 앱 빌드
RUN npm run build

# --- 3단계: 최종 실행 환경 ---
FROM alpine:latest
WORKDIR /app

# Go 빌더에서 컴파일된 바이너리 복사
COPY --from=go-builder /go/bin/memo-api .

# React 빌더에서 빌드된 정적 파일들을 복사 (Vite의 결과물은 'dist' 폴더)
COPY --from=fe-builder /app/dist ./frontend/dist

# 애플리케이션이 8080 포트를 사용함을 명시
EXPOSE 8080

# 컨테이너 시작 시 Go 서버 실행
CMD ["./memo-api"]
```
<br />

## 마무리
ㄴ
이번 4편에서는 기존의 프론트엔드 코드를 완전히 버리고, Vite, TanStack, Zustand, shadcn/ui 등 현존하는 가장 현대적이고 강력한 도구들을 사용하여 애플리케이션을 재탄생시켰습니다.
