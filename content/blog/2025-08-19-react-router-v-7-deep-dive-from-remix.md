---
slug: 2025-08-19-react-router-v-7-deep-dive-from-remix
title: NDC Oslo 2025 - 리믹스가 리액트 라우터가 됐다고요? V7으로 격변한 리액트 라우터 완전 정복
date: 2025-08-21 14:03:19.309000+00:00
summary: 리믹스의 혁신적인 기능들이 리액트 라우터 V7으로 통합되었습니다. 선언형 모드부터 프레임워크 모드까지, 완전히 새로워진 리액트 라우터의 아키텍처와 활용법을 코드 예제와 함께 깊이 있게 파헤쳐 봅니다.
tags: ["React Router", "Remix", "React Router V7", "풀스택 프레임워크", "리액트", "웹 개발"]
contributors: []
draft: false
---

![](https://img.youtube.com/vi/ujeyChkVuxc/maxresdefault.jpg)
[NDC Oslo 2025 유튜브 링크](https://www.youtube.com/watch?v=ujeyChkVuxc)

안녕하세요, 오랜만에 흥미로운 기술 강연을 발견해서 내용을 공유해볼까 합니다.<br /><br />해당 강연은 위 링크에 있는데요, 이 강연의 핵심만 전체적으로 살펴볼까 합니다. 바로 리액트(React) 생태계의 절대 강자, '리액트 라우터'에 대한 이야기인데, 우리가 알던 그 모습이 아니더라고요.<br /><br />강연의 시작은 '리믹스(Remix)'라는 프레임워크 이야기로 문을 엽니다.<br /><br />

## 리믹스, 웹 표준으로 돌아가다

리믹스는 리액트 기반의 풀스택 웹 프레임워크, 소위 '메타 프레임워크'인데요.<br /><br />Next.js와 함께 리액트 생태계의 양대산맥 중 하나지만, 상대적으로 덜 알려져 있죠.<br /><br />2020년에 출시되어 2022년에는 쇼피파이(Shopify)에 인수되기도 했습니다.<br /><br />리믹스의 핵심 철학은 아주 명확해요.<br /><br />'웹 표준을 통해 빠르고, 안정적인 사용자 경험을 제공하자'는 겁니다.<br /><br />특히 URL 세그먼트와 컴포넌트 계층, 그리고 데이터를 하나로 묶는 '중첩 라우팅(Nested Routing)' 개념은 정말 혁신적이었거든요.<br /><br />사실 이 아이디어는 2014년 Ember.js에서 영감을 받은 건데, 리믹스가 현대적으로 아주 잘 풀어낸 거죠.<br /><br />

## 모든 길은 리액트 라우터로 통한다

그런데 리믹스를 만든 사람들이 누군지 아시나요?<br /><br />바로 우리에게 너무나 익숙한 '리액트 라우터(React Router)'를 만들고 유지보수하는 바로 그 팀입니다.<br /><br />리액트 라우터는 지난 10년간 리액트 생태계에서 가장 많이 사용된 라이브러리 중 하나죠.<br /><br />발표자가 보여준 자료에 따르면, 현재 무려 1,070만 개의 공개 저장소에서 사용되고 있더라고요.<br /><br />이 숫자가 작년에 710만 개였는데, 1년 만에 300만 개 이상이 늘어난 겁니다.<br /><br />쇼피파이의 500만 라인짜리 핵심 애플리케이션도 리액트 라우터 위에서 돌아가고 있으니, 그 영향력은 정말 어마어마하죠.<br /><br />하지만 리액트 라우터 팀은 단순한 라우팅 기능을 넘어 더 많은 것을 제공하고 싶었습니다.<br /><br />자동 코드 스플리팅, 간편한 데이터 로딩, 폼 액션, 낙관적 UI(Optimistic UI) 같은 기능들 말이에요.<br /><br />이런 기능들은 보통 Next.js 같은 메타 프레임워크에서나 볼 수 있었죠.<br /><br />그래서 탄생한 것이 바로 '리믹스'였던 겁니다.<br /><br />

## Vite의 등장과 거대한 전환점

여기에 또 다른 핵심 조각이 등장하는데요.<br /><br />바로 Vite입니다.<br /><br />Vite는 더 빠른 개발 경험과 최적화된 빌드를 제공하는 프론트엔드 툴이죠.<br /><br />이제는 사실상 'create-react-app'을 완전히 대체하며 웹 개발의 표준이 되었습니다.<br /><br />발표자가 보여준 한 개발자의 소셜 미디어 포스트가 인상 깊었는데요.<br /><br />'브랜치 바꾸고, 머지 충돌 해결하고, 의존성 설치하는 동안에도 Vite는 멀쩡하더라, Webpack 시절엔 상상도 못 할 일'이라는 내용이었습니다.<br /><br />그만큼 개발 경험이 극적으로 좋아진 거죠.<br /><br />그리고 2023년, 리믹스는 빌드 툴을 Vite로 전환하는 중대한 결정을 내립니다.<br /><br />이 덕분에 SPA 모드 같은 새로운 기능도 추가하고, 더 많은 개발자들이 리믹스를 쉽게 접할 수 있게 되었죠.<br /><br />

## 리믹스 + 리액트 라우터 = 리액트 라우터 V7

상황을 정리해 보면 이렇습니다.<br /><br />리믹스는 사실상 '리액트 라우터'에 'Vite 플러그인'을 더한 형태였거든요.<br /><br />팀은 수많은 리액트 라우터 사용자들이 리믹스의 좋은 기능들을 쓰길 바랐지만, 현실적으로 운영 중인 프로젝트를 새로운 프레임워크로 마이그레이션하는 건 거의 불가능에 가깝죠.<br /><br />그래서 그들은 역발상을 합니다.<br /><br />'리액트 라우터에서 리믹스로 가는 게 어렵다면, 그냥 리액트 라우터를 리믹스로 만들면 어떨까?'<br /><br />그리고 2024년 리액트 콘퍼런스에서, 그들은 충격적인 발표를 합니다.<br /><br />'리믹스의 미래는 리액트 라우터 V7입니다.'<br /><br />결국 이 강연은 리믹스에 대한 이야기가 아니라, 완전히 새로워진 '리액트 라우터'에 대한 이야기였던 거죠.<br /><br />

## 세 가지 모드 원하는 대로 골라 쓰는 재미

새로워진 리액트 라우터 V7의 가장 큰 특징은 바로 세 가지 모드를 제공한다는 점입니다.<br /><br />프로젝트의 필요에 따라 원하는 만큼만 프레임워크의 도움을 받을 수 있게 된 거죠.<br /><br />

### 1. 선언형 모드 (Declarative Mode)

이건 우리가 가장 잘 아는 바로 그 방식인데요.<br /><br />`<BrowserRouter>`, `<Route>` 같은 컴포넌트를 사용해 SPA(Single Page Application)에서 기본적인 라우팅을 구현하는 모드입니다.<br /><br />가장 익숙한 방식이죠.<br /><br />

### 2. 데이터 모드 (Data Mode)

여기서부터가 진짜인데요.<br /><br />라우트 설정을 리액트 렌더링 외부로 빼내면 '데이터 모드'를 사용할 수 있습니다.<br /><br />이 모드에서는 `loader`, `action` 같은 API를 통해 데이터 로딩, 상태 관리, 폼 제출 같은 기능들을 아주 쉽게 처리할 수 있게 되죠.<br /><br />

### 3. 프레임워크 모드 (Framework Mode)

이게 바로 과거 리믹스의 모든 기능이 담긴 완전체 모드입니다.<br /><br />Vite 플러그인을 통해 활성화되는데요.<br /><br />지능적인 코드 스플리팅, 서버사이드 렌더링(SSR), 정적 사전 렌더링(Static Pre-rendering) 같은 고급 기능들을 모두 쓸 수 있게 되는 거죠.<br /><br />심지어 V7에서는 타입 안전성을 보장하는 라우트 모듈과 `href` 유틸리티까지 추가되었더라고요.<br /><br />

## 프레임워크 모드 깊이 파헤치기

강연의 핵심은 바로 이 '프레임워크 모드'였습니다.<br /><br />이 모드에서 리액트 라우터는 네 가지 역할을 수행하는데요.<br /><br />바로 '컴파일러', '서버사이드 HTTP 핸들러', '서버 프레임워크', 그리고 '브라우저 프레임워크'입니다.<br /><br />모든 것은 Vite 기반의 컴파일러에서 시작됩니다.<br /><br />컴파일러는 서버에서 렌더링을 처리할 '서버 빌드'와 라우트별로 코드를 분할한 '브라우저 빌드', 그리고 리소스 사전 로딩에 사용될 '에셋 매니페스트'를 생성하죠.<br /><br />중요한 점은 리액트 라우터가 직접 서버가 되는 게 아니라, Express나 Vercel, Netlify 같은 실제 서버 위에서 동작하는 '핸들러'라는 점입니다.<br /><br />Web Fetch API를 기반으로 만들어져서 Node.js 환경이 아닌 Cloudflare Workers 같은 곳에서도 돌릴 수 있다는 게 큰 장점이죠.<br /><br />

### 라우트 모듈 모든 것의 중심

라우트 모듈(Route Modules)이 바로 리액트 라우터 프레임워크의 심장이라고 할 수 있거든요.<br /><br />하나의 파일 안에서 데이터 로딩, 액션 처리, UI 렌더링을 모두 담당합니다.<br /><br />주요 `export`는 세 가지예요.<br /><br />*   **loader**: `GET` 요청 시 컴포넌트에 데이터를 제공합니다. 서버에서만 실행되죠.<br /><br />*   **action**: `POST`, `PUT`, `PATCH`, `DELETE` 요청을 처리합니다. 이 역시 서버에서만 실행됩니다.<br /><br />*   **default**: 해당 라우트에서 렌더링될 리액트 컴포넌트입니다.<br /><br />발표자가 보여준 예제 코드를 통해 이 흐름을 살펴보면 훨씬 이해하기 쉬울 거예요.<br /><br />가상의 노트 앱을 만든다고 가정해 봅시다.<br /><br />
```tsx
// app/routes/notes.tsx

// 1. loader: 서버에서 데이터를 가져옵니다.
export async function loader() {
  const notes = await db.note.findMany({ orderBy: { createdAt: "desc" } });
  return notes;
}

// 3. action: 폼 제출을 처리하고, 유효성 검사 후 데이터를 저장하거나 에러를 반환합니다.
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  // Zod를 사용한 유효성 검사
  const result = noteSchema.safeParse({ title, content });
  if (!result.success) {
    return result.error.formErrors.fieldErrors;
  }

  const note = await db.note.create({ data: result.data });
  // 성공 시 해당 노트 상세 페이지로 리다이렉트
  return redirect(href(`/notes/${note.id}`));
}

// 2. component: loader에서 받은 데이터를 렌더링하고, action에 데이터를 제출합니다.
export default function Notes() {
  const notes = useLoaderData<typeof loader>();
  const errors = useActionData<typeof action>();

  return (
    <div>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <Link to={`/notes/${note.id}`}>{note.title}</Link>
          </li>
        ))}
      </ul>
      <Form method="post">
        <input name="title" />
        {errors?.title && <p>{errors.title[0]}</p>}
        <textarea name="content" />
        {errors?.content && <p>{errors.content[0]}</p>}
        <button type="submit">Add Note</button>
      </Form>
    </div>
  );
}
```

흐름이 보이시나요?<br /><br />

1.  사용자가 `/notes` 경로로 들어오면, `loader`가 서버에서 실행되어 DB의 모든 노트를 가져옵니다.<br /><br />
2.  `Notes` 컴포넌트는 `useLoaderData` 훅을 통해 `loader`가 반환한 데이터를 받아 목록을 렌더링합니다.<br /><br />
3.  사용자가 폼에 내용을 입력하고 'Add Note' 버튼을 누르면, `<Form>` 컴포넌트가 `POST` 요청을 보냅니다.<br /><br />
4.  같은 파일에 있는 `action` 함수가 이 요청을 받아 폼 데이터를 처리합니다. 유효성 검사에 실패하면 에러 객체를 반환하고, 성공하면 새 노트를 DB에 생성한 뒤 상세 페이지로 `redirect`하죠.<br /><br />
5.  만약 `action`이 에러를 반환하면, `Notes` 컴포넌트는 `useActionData` 훅을 통해 이 에러를 받아 사용자에게 보여줍니다.<br /><br />
6.  `action`이 성공적으로 실행되면(예: 새 노트 추가), 리액트 라우터는 자동으로 해당 페이지의 `loader`를 다시 실행해서 UI를 최신 상태로 유지해 줍니다. 우리가 수동으로 상태를 관리할 필요가 전혀 없는 거죠.<br /><br />

이 모든 로직이 하나의 파일, `notes.tsx` 안에서 완결된다는 게 정말 놀랍지 않나요?<br /><br />

## 점진적 향상(Progressive Enhancement)의 마법

리액트 라우터의 또 다른 강력한 컨셉은 '점진적 향상'입니다.<br /><br />기본적으로 이 앱은 자바스크립트가 비활성화된 환경에서도 완벽하게 동작하거든요.<br /><br />표준 HTML `<form>`처럼 말이죠.<br /><br />그러다가 자바스크립트가 로드되면(Hydration), 리액트 라우터는 이 기본적인 동작 위에 더 풍부한 사용자 경험을 '덧입힙니다'.<br /><br />예를 들어, 폼이 제출되는 동안 버튼을 비활성화하거나, 서버 유효성 검사에 실패했을 때 특정 입력창에 포커스를 주거나, 에러 메시지를 부드럽게 나타나게 하는 등의 효과를 추가할 수 있죠.<br /><br />
```tsx
export default function NewNote() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <Form method="post">
      {/* ... inputs ... */}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save"}
      </button>
    </Form>
  );
}
```

위 코드처럼 `useNavigation` 훅을 사용하면, 폼 제출 상태를 쉽게 파악해서 버튼을 비활성화할 수 있습니다.<br /><br />중요한 것은 이 모든 코드가 기존 서버 로직을 전혀 건드리지 않는 '추가적인' 코드라는 점이에요.<br /><br />기본적인 기능은 서버에서 보장하고, 브라우저에서는 UX를 한 단계 끌어올리는 거죠.<br /><br />이것이 바로 리액트 라우터가 말하는 '회복탄력성(Resilient)'의 핵심입니다.<br /><br />

## React 19와의 관계

흥미롭게도, 리액트 라우터가 오랫동안 사용해 온 패턴들이 React 19에 대거 채택되었습니다.<br /><br />`use server` 지시어는 리액트 라우터의 `action`과 비슷하고, React 19의 `<Form>` 컴포넌트나 `useActionState`, `useOptimistic` 훅들도 리액트 라우터가 제공하던 기능들과 아주 유사한 역할을 하죠.<br /><br />이는 리액트 라우터의 접근 방식이 얼마나 올바른 방향이었는지를 증명하는 셈입니다.<br /><br />

## 결론

결론적으로, 리액트 라우터는 이제 더 이상 단순한 URL 관리 도구가 아닙니다.<br /><br />단순한 SPA부터 복잡한 풀스택 애플리케이션까지, 프로젝트의 규모와 요구사항에 맞춰 점진적으로 확장할 수 있는 매우 유연하고 강력한 프레임워크로 진화한 거죠.<br /><br />특히 기존 리액트 라우터 프로젝트에서 점진적으로 데이터 로딩이나 서버 기능을 추가할 수 있다는 점은, 현실 세계의 프로젝트를 운영하는 우리 개발자들에게 정말 큰 선물이라고 생각합니다.<br /><br />단순한 라우팅 라이브러리를 넘어, 이제는 프로젝트의 시작부터 끝까지 함께할 수 있는 든든한 풀스택 프레임워크로 거듭난 셈입니다.<br /><br />
