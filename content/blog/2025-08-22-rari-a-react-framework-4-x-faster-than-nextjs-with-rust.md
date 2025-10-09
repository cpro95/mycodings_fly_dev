---
slug: 2025-08-22-rari-a-react-framework-4-x-faster-than-nextjs-with-rust
title: Next.js보다 4배 빠른 React 프레임워크가 등장했습니다
date: 2025-08-23 11:23:43.319000+00:00
summary: 거의 25년간 웹 개발을 해온 베테랑 개발자가 Next.js보다 4배 빠른 React 프레임워크 Rari를 공개했습니다. Rust 런타임을 기반으로 한 Rari의 경이로운 성능과 그 비밀을 파헤쳐 봅니다.
tags: ["Rari", "React", "Next.js", "Rust", "성능 최적화", "풀스택 프레임워크"]
contributors: []
draft: false
---

[원본 링크](https://ryanskinner.com/posts/how-i-built-a-full-stack-react-framework-4x-faster-than-nextjs-with-4x-more-throughput)

여기 아주 흥미로운 해외 기술 아티클이 하나 있는데요, 이 글의 핵심만 전체적으로 살펴볼까 힙니다.<br /><br />발표자는 자신을 거의 25년간 Perl부터 PHP, jQuery를 거쳐 최신 자바스크립트 시대까지 웹 개발의 역사를 함께 해온 개발자라고 소개하더라고요.<br /><br />그는 React가 단순한 뷰 라이브러리에서 풀스택 플랫폼으로 진화하는 것을 지켜보면서, '우리는 이보다 훨씬 더 잘할 수 있다'는 생각을 계속 해왔다고 합니다.<br /><br />그리고 오늘, 그 생각의 결과물로 한때는 불가능하다고 여겼던 성능을 보여주는 새로운 풀스택 React 프레임워크를 공개했는데요.<br /><br />그 이름은 바로 'Rari(Runtime Accelerated Rendering Infrastructure)'입니다.<br /><br />이 프레임워크가 내세우는 성능 수치는 정말이지 입이 떡 벌어질 정도죠.
*   부하 시 컴포넌트 렌더링 속도 **4.04배** 향상 (평균 응답 시간 4.23ms vs Next.js 17.11ms)<br /><br />
*   부하 시 처리량 **3.74배** 향상 (초당 요청 10,586건 vs Next.js 2,832건)<br /><br />
*   빌드 속도 **5.80배** 향상 (1.59초 vs Next.js 9.22초)<br /><br />
*   진정한 스트리밍을 지원하는 100% React 서버 컴포넌트 호환성

Rari는 단순히 성능 최적화를 조금 더한 Node.js 프레임워크가 아닙니다.<br /><br />V8을 코어에 품은 커스텀 Rust 런타임을 기반으로, React 애플리케이션이 어떻게 실행되어야 하는지에 대한 근본적인 재고찰을 담고 있는 물건이죠.<br /><br />

## 숫자로 증명하는 압도적인 성능

말로만 빠르다고 하면 믿기 어렵겠죠?<br /><br />발표자는 Next.js와 Rari로 동일한 조건의 애플리케이션을 만들어 직접 성능을 비교했는데요.<br /><br />두 앱 모두 서버 사이드 데이터 페칭, 클라이언트 컴포넌트 등 실제 서비스에서 사용되는 패턴을 포함한 복잡한 컴포넌트 트리를 렌더링했습니다.<br /><br />

### 응답 시간 비교

먼저, 기본적인 컴포넌트 렌더링 속도부터 보시죠.<br /><br />Rari는 동일한 작업을 할 때 Next.js보다 평균적으로 **2.27배** 빠르게 복잡한 React 서버 컴포넌트를 렌더링하는 것을 볼 수 있었습니다.<br /><br />

### 동시 접속 부하 테스트

하지만 진짜 성능은 부하가 걸렸을 때 드러나는 법인데요.<br /><br />50명의 동시 사용자가 30초 동안 집중적으로 요청을 보내는 스트레스 테스트 결과는 정말 놀랍습니다.<br /><br />Rari는 Next.js보다 **3.74배** 더 많은 요청을 처리하면서도, 평균 지연 시간은 **4.04배** 더 낮았거든요.<br /><br />극한의 부하 상황에서도 Rari는 높은 처리량을 유지하며 50ms 미만의 응답 시간을 꾸준히 보여주었죠.<br /><br />

### 빌드 성능

개발 속도도 무시할 수 없는 요소인데요.<br /><br />Rari는 빌드 시간마저 Next.js보다 **5.80배** 빠르면서, 번들 크기는 **46%** 더 작았습니다.<br /><br />

## 어떻게 이게 가능할까요 (비밀은 Rust에 있었습니다)

Rari의 경이로운 성능은 Rust의 강력함과 자바스크립트 생태계의 호환성을 결합한 독특한 3계층 아키텍처에서 나오는데요.<br /><br />

### 1계층 Rust 코어 런타임

Rari의 심장에는 Deno Core와 V8을 기반으로 커스텀 빌드된 'Rust 런타임'이 자리 잡고 있습니다.<br /><br />이건 단순히 "Rust가 빠르니까"라는 차원의 이야기가 아니죠.<br /><br />Node.js는 이벤트 루프 설계와 가비지 컬렉션 패턴 때문에 어쩔 수 없는 오버헤드를 가지고 있는데요.<br /><br />Rust는 우리에게 다음과 같은 근본적인 이점을 제공합니다.

*   **제로 코스트 추상화**: 개발자 경험을 해치지 않으면서 성능 최적화를 이룰 수 있습니다.<br /><br />
*   **가비지 컬렉션 없는 메모리 안전성**: 부하가 걸렸을 때도 예측 가능한 성능을 보장하죠.<br /><br />
*   **진정한 동시성**: 수천 개의 요청을 블로킹 없이 처리할 수 있습니다.

React 서버 컴포넌트는 Node.js 레이어를 거치지 않고 이 Rust 런타임 안에서 직접 실행됩니다.<br />

```rust
// React 서버 컴포넌트는 Rust 런타임에서 직접 실행됩니다.
let mut renderer = RscRenderer::new(runtime);
renderer.initialize().await?;

// 컴포넌트를 변환하고 등록합니다.
renderer.register_component("UserProfile", jsx_source).await?;

// 클라이언트로 스트리밍하기 위해 RSC 직렬화 포맷으로 렌더링합니다.
let rsc_payload = renderer.render_to_rsc_format("UserProfile", Some(props_json)).await?;
```

이것이 바로 Rari가 단순한 Node.js 프레임워크의 성능 개선 버전이 아니라, 근본적으로 다른 차원의 물건인 이유입니다.<br /><br />

### 2계층 지능적인 Vite 통합

Rari는 빌드 툴을 새로 발명하는 대신, 기존의 Vite를 확장해서 React 서버 컴포넌트를 인식하고 변환하는 지능적인 레이어를 추가했는데요.<br />

```typescript
// 서버 모듈을 RSC 직렬화를 위해 변환합니다.
function transformServerModule(code: string, id: string): string {
  if (!code.includes('use server'))
    return code

  let newCode = `${code}\n\nimport {registerServerReference} from "react-server-dom-rari/server";\n`

  // 서버 함수들을 RPC 호출을 위해 등록합니다.
  for (const name of exportedNames) {
    newCode += `registerServerReference(${name}, ${JSON.stringify(id)}, ${JSON.stringify(name)});\n`
  }

  return newCode
}
```

이 지능적인 변환 레이어는 클라이언트와 서버 컴포넌트의 경계를 자동으로 감지하고, 별도의 설정 없이 RSC 직렬화를 처리하며, 심지어 서버 컴포넌트의 HMR(Hot Module Replacement)까지 가능하게 만들어주죠.<br /><br />

### 3계층 제대로 구현된 React 서버 컴포넌트

Rari는 React 서버 컴포넌트를 본래의 의도대로, 즉 진정한 스트리밍을 지원하는 서버 사이드 렌더링으로 구현했는데요.<br /><br />이 스트리밍 로직조차 Rust로 작성되어 최상의 성능을 보장합니다.<br />

```rust
// Rust로 구현된 RSC 스트리밍
async fn stream_component(
    // ...
) -> Result<Response, StatusCode> {
    // ...
    // 렌더러에서 직접 RSC 스트림을 생성합니다.
    let stream_result = {
        let mut renderer = state.renderer.lock().await;
        renderer.render_with_readable_stream(&request.component_id, props_str.as_deref())
    };

    // ... RSC 스트림을 HTTP 응답 스트림으로 변환합니다.
}
```


## 개발자 경험, 타협은 없다

성능이 아무리 좋아도 개발자 경험이 나쁘면 소용이 없겠죠?<br /><br />Rari는 우리가 React에서 기대하는 모든 편의성을 그대로 유지합니다.<br /><br />서버 컴포넌트와 클라이언트 컴포넌트를 작성하는 방식은 Next.js와 완전히 동일한데요.<br />

```jsx
// Server component - Rust 런타임에서 실행
'use server'
export default async function UserProfile({ userId }) {
  const response = await fetch(`https://api.example.com/users/${userId}`)
  const user = await response.json()

  return (
    <div>
      <h1>{user.name}</h1>
      <ClientCounter initialCount={user.loginCount} />
    </div>
  )
}

// Client component - 브라우저에서 하이드레이션
'use client'
export default function ClientCounter({ initialCount }) {
  const [count, setCount] = useState(initialCount)

  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  )
}
```

서버 컴포넌트를 수정해도 전체 페이지를 새로고침할 필요 없이 즉시 변경 사항이 반영되는 HMR, 그리고 완벽한 타입스크립트 지원까지, 개발자 경험에 있어서는 어떠한 타협도 하지 않았다는 점이 정말 인상적입니다.<br /><br />

## 왜 이 프레임워크를 만들었을까요

발표자는 자신이 Rari를 만든 이유를 이렇게 설명하더라고요.<br /><br />"현재의 React 프레임워크들은 성능의 한계를 가질 수밖에 없는 아키텍처적 타협을 하고 있습니다.<br /><br />저는 성능과 개발자 경험이 양립할 수 있다고 믿으며, 성능은 나중에 추가하는 기능이 아니라 기초에 내장되어야 한다고 생각합니다."<br /><br />그는 Rari가 자신이 지난 10년간 웹 개발을 하면서 간절히 바랐던 바로 그 프레임워크라고 말합니다.<br /><br />

## 시작해보기

Rari를 시작하는 방법은 놀랍도록 간단한데요.<br />

```bash
# 새로운 Rari 앱 생성
npm create rari-app@latest my-app
cd my-app

# 개발 서버 시작
npm run dev
```

이 명령어 하나면 Rari가 알아서 플랫폼에 맞는 바이너리를 다운로드하고, Vite 개발 서버와 Rust 런타임을 동시에 실행시켜 줍니다.<br /><br />복잡한 설정 없이 바로 초고속 React 개발을 시작할 수 있는 거죠.<br /><br />

## 마치며

Rari는 단순히 또 하나의 프레임워크가 아니라, 우리가 웹을 위해 더 나은 도구를 만들 수 있다는 강력한 증거처럼 보이는데요.<br /><br />성능과 개발자 경험이 서로 상충하는 개념이 아니라는 것을 증명해 보이고 있죠.<br /><br />이 글에서 소개된 모든 벤치마크는 재현 가능하도록 코드가 공개되어 있다고 하니, 관심 있는 분들은 직접 돌려보고 결과를 공유해보는 것도 재미있을 것 같습니다.<br /><br />웹의 미래가 그 어느 때보다 더 기대되게 만드는, 정말 흥미로운 프로젝트의 등장이네요.<br /><br />
