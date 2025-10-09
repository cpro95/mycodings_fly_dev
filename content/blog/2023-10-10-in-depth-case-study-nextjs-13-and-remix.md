---
slug: 2023-10-10-in-depth-case-study-nextjs-13-and-remix
title: Next.js 13 vs Remix 완벽 비교 분석
date: 2023-10-10 09:09:40.094000+00:00
summary: Next.js 13과 Remix를 상세히 비교해 봤습니다.
tags: ["next.js", "remix"]
contributors: []
draft: false
---

안녕하세요?

오늘은 Remix 프레임워크의 거장 Kent C. Dodds 님께서 추천하신 좋은 글이 있어 원작자이신 Prateek Surana님의 허락을 받고 우리말로 번역해 보았습니다.

번역하다가 너무 길어서 번역프로그램의 도움을 많이 받았습니다.

읽다가 어색해도 이해해 주시면 감사하겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgs_d_8PRIE_nTNv6o2A0eANoZpifoUGWLS2u4eFXdfyzf2MO6tJReYdwP2XvqK1bs3GJT09Sj0pf73Sp9LGexNTGgjgGTbCxvXVyOmj4thBBFJK-3IwdMLTopKqEfjK71u-6PzpLlyVbsDU9uiArn4g5EtA_pmGRUl9wiV8XU9TFKlFjkaM8QwWIGvVV0)

<a href="https://prateeksurana.me/blog/nextjs-13-vs-remix-an-in-depth-case-study" target="_blank">원문 보기</a>


** 목차 **
1. [Layout](#layout)
2. [Data Fetching](#data-fetching)
3. [Streaming](#streaming)
4. [Data mutations](#data-mutations)
5. [Infinite loading](#infinite-loading)
6. [Other Features](#other-features)
7. [Conclusion](#conclusion)

---

오늘날 웹 애플리케이션 개발에 관한 이야기를 할 때 React는 이제 당연한 선택인 거 같고, 그 인기는 앞으로 계속 증가하고 있는데요.

React를 사용한 웹 애플리케이션 개발에 있어 가장 일반적인 접근 방식 중 하나로 Next.js가 가장 선호되는 옵션 중 하나인 거는 확실합니다.

지난해 Next.js가 앱 라우터(App Router)로 가장 큰 업데이트를 발표한 이후에 업계에서는 안정성에 있어 많은 논란이 있지만 그 반대로 찬사를 받고 있는데요.

왜 찬사를 받고 있냐면 바로 중첩된 레이아웃, React Server Components와 Suspense를 밀접하게 통합해서 완전히 새로운 라우팅 아키텍처를 도입했기 때문입니다.

그러나 Next.js는 레이아웃 기반 라우팅을 구현한 첫 번째 React 프레임워크가 아닙니다.

Next.js의 앱 라우터(App Router) 공개 약 1년 전에 Remix라는 조금은 생소한 프레임워크가 레이아웃 기반 중첩 레이아웃을 지원하면서 발표됐었는데요.

Remix는 클라이언트 사이드 라우터인 React Router를 개발한 사람들에 의해 개발되었습니다.

Remix의 아이디어는 간단한데요.

엣지(Edge) 네트워크를 우선으로 하는 풀 스택 프레임워크로, 표준 웹 API인 Request, Response, FormData 등을 사용하여 웹사이트를 구축하는 것을 권장하며, 병렬로 데이터를 로드하고 race condition을 처리하며 JavaScript가 로드되기 전에도 웹사이트가 작동하도록 하는 많은 기능을 제공합니다.

그들의 철학은 Remix를 더 잘 사용할수록 웹의 기본 개념을 더 잘 이해하게 된다는 것입니다.

아래 그림처럼 Remix 공식 트윗에도 나와 있듯이 저도 Remix를 사용하면서 표준 웹의 기능에 대해 많이 알게 되었습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiz-bTLG639OmM_RYbsLm7FqbbEtJv8NP7WIsDPvvoif_SsS1HXFYpx0XOiHS9rhfIVd5qOvxd8UPLiutFfgwvNu5XQFKUDvv6gvDkz5-Sj6Fkqh-NHI7gjqca-4z83HQ3NCFkQCjza3lgl8Jza45QZ337u3uHkiDG4rsFE2ZyogkpvTXvtVLzncQfLYas)

Remix의 철학을 굉장히 존경하고, 또 React Server Components와 함께 Next.js가 추구하는 방향도 맞다고 생각합니다.

그래서 두 프레임워크에 대해 배우는 좋은 방법은 무엇이 있을까 생각하다가, 풀 스택 앱을 직접 만들어서 비교하는 것이 가장 좋을 것으로 생각했습니다.

그래서 제가 좋아하는 웹사이트 중 하나인 X (이전에는 Twitter)를 만들었고, 두 프레임워크의 핵심 기능 대부분을 통합했습니다.

이 블로그 글은 제가 배운 교훈, 한 프레임워크가 다른 프레임워크로부터 채택해야 할 측면, 그리고 두 프레임워크로 앱을 개발하는 동안의 개인적인 경험과 의견에 중점을 두고 있습니다.

"원작자의 앱은 Next.js와 Remix 앱 모두 Vercel에 배포되어 있으며, 각각 다음 URL에서 테스트할 수 있습니다:
- https://twitter-rsc.vercel.app/
- https://twitter-remix-run.vercel.app/

두 앱에서 사용한 기술 스택은 다음과 같습니다:

- Tailwind CSS
- Turborepo
- Prisma ORM

또한 [GitHub](https://github.com/prateek3255/twitter-clone)에 소스 코드가 있으니 참고 바랍니다.

---

## Layout

레이아웃 측면에서는 두 프레임워크가 거의 동일한 방식으로 나아갔다는 점이 마음에 듭니다.

이 프레임워크들을 사용하면 라우팅 네비게이션 사이에 지속되는 공유된 중첩 레이아웃을 만들 수 있습니다.

오늘날 대부분의 웹 앱은 어떤 형태로든 여러 URL에서 공유되는 레이아웃을 가지고 있습니다.

SideBar든 Dashboard의 탭이든, 공유 레이아웃은 어디에나 존재하며 Twitter Clone도 예외는 아니었습니다.

실제로 몇몇 페이지에서는 하나의 레이아웃이 다른 레이아웃에 중첩되는 상황이 있었습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgHjiPFikKir-mxIrVRAEhm4jwOqm6h5bgn_Xvqtc-xZ1cZsUJGHwgHM9z-6MlrbqrSNmEPSOZFoAGzFjbdHMNwjNlACAw5R6KjYCt7QHjew4IwjjCZ99HfjozYVzGV--R4DunWVwzpZ1nXU2zIVu572VwgtmmfGbA1vtTh5PoTABUg7gklgRA_sxDnwdE)

Next.js 버전 12나 그 이전 버전에서 이와 같은 레이아웃을 구축한 적이 있다면, 얼마나 복잡하고 코드가 지저분 해졌는지 여러분들도 알 것입니다.

컴포넌트에 함수를 만들고 _app.tsx에서 이러한 함수를 감싸야 했던 복잡한 과정이 있었는데요.

레이아웃이 서버에서 가져와야 할 데이터를 필요로 하는 경우 문제는 더 복잡해졌습니다.

레이아웃을 공유하는 모든 페이지의 getServerSideProps에 필요한 데이터 가져오기 로직을 중복해서 작성해야 했습니다.

그러나 이제 Remix와 Next.js 13 모두 파일 기반 라우터를 사용하여 프레임워크가 대신 레이아웃을 생성하도록 할 수 있습니다.

### Remix

최근에 V2로 업데이트된 Remix에서는 URL에서 슬래시 (/)를 만들기 위해 점 구분자를 사용할 수 있습니다.

예를 들어, `app/routes/invoice.new.tsx`라는 파일은 `/invoice/new` 경로와 일치하고, `app/routes/invoice/$id.tsx`라는 라우트는 `/invoice/{id}` 경로와 일치합니다.

만약 Invoice URL이 공통된 레이아웃을 공유한다면, 레이아웃을 포함하는 invoice.tsx 파일을 만들 수 있습니다.

이 파일에서는 레이아웃을 공유해야 하는 페이지가 있을 자리에 `<Outlet />` 컴포넌트를 추가할 수 있으며, 이로 인해 `/invoices/new` 및 `/invoices/{id}` 페이지가 해당 레이아웃을 공유하게 됩니다.

또한 URL 구조를 공유하지 않는 공통 레이아웃이 필요한 경우도 있을 수 있습니다.

Remix에는 이에 대한 해결책이 있습니다. '_' 접두사를 가진 라우트를 생성하면 해당 라우트가 URL에 포함되지 않습니다.

이러한 라우트를 "Pathless Routes"라고 부릅니다.

이러한 모든 기능을 통해 Twitter Clone 앱의 사용자 프로필과 같이 많은 중첩 레이아웃이 필요한 부분에 사용할 수 있습니다.

거의 모든 페이지에서 공유되는 사이드바 외에도 사용자 프로필 페이지는 별도의 레이아웃이 필요했습니다.

사용자 프로필 페이지에는 "트윗", "답글" 및 "좋아요"를 위한 탭이 포함되어 있었으며, 이들은 별도의 페이지로 분리되어 고유한 URL을 가지게 되었습니다.

Remix 앱의 파일 구조는 다음과 같습니다:

```bash
app/
  routes/
    _base.tsx
    _base._index.tsx -->   /
    _base.$username.tsx
    _base.$username._index.tsx -->   /{username}
    _base.$username.replies.tsx -->   /{username}/replies
    _base.$username.likes.tsx -->   /{username}/likes
    _base.status.$id.tsx -->   /status/{id}
    _auth.tsx
    _auth.signin.tsx -->   /signin
    _auth.signup.tsx -->   /signup
```

여기서 _base.tsx는 대부분의 페이지에서 공유되는 사이드바를 포함하는 주요 레이아웃입니다.

그런 다음 _base.$username.tsx 레이아웃이 있으며, 이는 기본 레이아웃 내에서 중첩된 레이아웃이며 프로필 헤더와 "트윗", "답글" 및 "좋아요"를 위한 탭이 포함되어 있습니다.

'._index.tsx'는 주어진 레이아웃의 '/'' URL을 나타냅니다.

다음은 앱의 사용자 프로필 페이지에서 이러한 라우트가 작동하는 방식을 나타내는 것입니다:

![](https://blogger.googleusercontent.com/img/a/AVvXsEixibBsfxhF3I0p7zGRFnp3jAblpYFnoKphGkWM7OBJbAkUjOei07O9eQ4xpzN-LMNOfyGGnKMG7uuw07vwGvWbpdC6CZQxlmgO5nz2UptoxHlgU--CqTb1Kezkm3hFTMkrXTGd5IvzQWHSloLQNRSU_NuqpZnu0FcLGfxUEsXMvaEfGqNtNffveuIH-xk)

[GitHub](https://github.com/prateek3255/twitter-clone/tree/main/apps/remix/app/routes)에서 라우트 코드를 확인하고 Remix 공식 문서를 통해 라우트 파일 이름 규칙에 대해 더 자세히 알아보실 수 있습니다.

### Next.js

Next.js 13의 앱 디렉토리에서 레이아웃 시스템은 거의 유사합니다.

주된 차이점은 디렉토리를 사용하여 URL을 나타내고 디렉토리 내의 파일을 사용하는 것입니다.

예를 들어 레이아웃을 나타내는 경우 layout.tsx를 사용하고 해당 라우트를 공개적으로 접근 가능하게 하려면 page.tsx를 사용하며, 레이아웃에서 React의 children prop을 사용하여 자식 레이아웃이나 페이지를 채웁니다.

실제로 Next.js 13는 한 단계 더 나아가 모든 라우트 세그먼트에 대한 로딩 상태를 정의하는 별도의 파일인 loading.tsx 및 오류 상태를 정의하는 error.tsx를 만들 수 있도록 허용합니다.

이에 대해서는 다음 섹션에서 더 자세히 논의하겠습니다.

공통 URL을 공유하지 않는 레이아웃을 생성하는 것도 Remix와 매우 유사하며 유일한 차이점은 _로 시작하는 파일 대신 괄호로 된 폴더 이름을 사용한다는 것입니다.

이러한 디렉토리는 Next.js에서 route groups라고 부릅니다.

URL의 동적 세그먼트는 폴더 이름을 대괄호로 묶어서 생성됩니다.

예를 들어 [id] 또는 [username]와 같이 폴더 이름을 대괄호로 감싸면 동적 세그먼트가 생성됩니다.

다음은 Next.js 13 Twitter Clone 라우트의 파일 구조입니다:

```bash
app/
  (base)/
    [username]/
      likes/
        page.tsx -->   /{username}/likes
      replies/
        page.tsx -->   /{username}/replies
      layout.tsx
      page.tsx -->   /{username}
    status/[id]/
      page.tsx -->   /status/{id}
    layout.tsx
    page.tsx  -->   /
  (auth)
    signin/
      page.tsx -->   /signin
    signup/
      page.tsx -->   /signup
```

다음 이미지는 이러한 라우트가 사용자 프로필 페이지를 렌더링하는 방식을 보여줍니다:

![](https://blogger.googleusercontent.com/img/a/AVvXsEjwgeWd3yQYvI5r7aGT1AGkEQj-rZ09hRJmAbsM79gPLOuY1wsU21Ja47j8nnjjG85ldOyZPFaEusSYR1IFRHWBdhGogUNDOqjqtB0yl6m6TA5XoJyRGbl7BDREQH4-Xsd-vucCBwODxz6VTCYgKkemMuvbOKAng9yGoXN9mpSxDz4e1EldowYZeCi0R2s)

또한 [GitHub](https://github.com/prateek3255/twitter-clone/tree/main/apps/nextjs/app)에서 코드를 확인하고 Next.js 공식 문서에서 레이아웃과 페이지에 대해 더 읽어보실 수 있습니다.

### Bottom line

종합적으로, 이 두 프레임워크의 라우팅 메커니즘을 비교해 볼 때, Remix의 접근 방식이 직관적이고 파일 또는 레이아웃이 어떤 라우트를 나타내는지 한 눈에 알아볼 수 있어서 매우 좋습니다.

반면 Next.js는 page.tsx와 layout.tsx로 이루어져 복잡한 구조가 되기 싶고, 특정 페이지가 어떤 URL에서 렌더링될지 알아내려면 디렉토리 구조를 무조건 살펴야 하는 번거로움이 있습니다.

그러나 이러한 점을 이해하면서도 Next.js가 이런 접근 방식을 선택한 이유를 이해합니다.

왜냐하면 해당 디렉토리에는 페이지와 레이아웃뿐만 아니라 notFound.tsx, loading.tsx, error.tsx 등과 같은 다른 요소도 포함되어 있어서 각 라우트 세그먼트의 로딩 및 오류 상태를 정의하는 데 도움이 됩니다.

또 다른 이점은 컴포넌트를 라우트와 함께 배치할 수 있다는 것입니다.

어떤 방식으로든, 이 두 프레임워크가 파일 시스템 기반의 라우팅에 대해 거의 동일한 방향을 선택한 것은 좋은 선택이었습니다.

---

## Data Fetching

Data Fetching은 현대 웹 애플리케이션의 중요한 부분입니다.

초창기에는 React 앱은 클라이언트 측에서 렌더링되었으며 관련 JavaScript 번들을 `<script />` 태그 내에 넣었고, HTML 태그는 비어 있는 빈 index.html 파일만 보냈습니다.

이로 인해 브라우저가 JavaScript를 다운로드하고 실행하는 동안 초기에는 빈 페이지가 표시되었으며, React가 초기화되고 구성 요소를 렌더링하기 위해 데이터를 가져오기 시작합니다.

이 방식은 초창기 모바일 기기나 인터넷 연결이 느린 환경에서는 성능에 상당히 나쁜 영향을 미쳤습니다.

그런 후에 Next.js와 Gatsby가 나왔는데요.

이 두 프레임워크는 React 애플리케이션에서 서버에서 Data Fetching이나 아니면 Build 할 때 Data Fetching을 함으로써 로직을 단순화함으로써 많은 사랑을 받았는데요.

이로써 웹사이트가 처음로드될 때 초기 UI를 드디어 보여줄 수 있게 되었습니다.

그러나 여전히 JavaScript가 다운로드되고 React가 활성화되기 전에는 어느 정도 시간을 기다려야만 합니다.

그러나 Next.js 13와 Remix는 한 단계 더 나아갔는데요.

React 서버 컴포넌트를 사용하는 Next.js, 그리고 Loader와 병렬 Data Fetching을 사용하는 Remix가 있습니다.

### Remix

Remix에서 데이터를 가져오는 방법은 로더(loaders)를 사용하는 것입니다.

각 라우트는 렌더링할 때 라우트에 관련 데이터를 제공하는 로더 함수를 정의할 수 있습니다.

로더는 서버에서만 실행됩니다.

다음은 Remix Twitter Clone에서 사용되는 로더의 예제입니다.

이것은 _base.tsx 레이아웃에서 사용됩니다:

```js
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const currentLoggedInUser = await getCurrentLoggedInUser(request);
  return json({ user: currentLoggedInUser }, { status: 200 });
};

export default export default function RootLayout() {
  const { user } = useLoaderData<typeof loader>();
  ....
}
```

로더는 HTTP Fetch Request 객체를 인수로 받으며, 이를 통해 헤더, 쿠키 등과 같은 정보를 얻을 수 있습니다.

로더의 리턴 형식은 항상 HTTP Fetch Response입니다.

Remix는 HTTP Fetch Response 객체 위에 json, redirect 등과 같은 몇 가지 래퍼(wrapper)를 제공하여 관련 상태 코드를 가진 특정 유형의 응답을 반환할 수 있도록 합니다.

그런 다음 클라이언트에서 useLoaderData 훅을 사용하여 컴포넌트에서 로더 데이터를 사용할 수 있습니다.

Remix에서는 라우트 세그먼트의 각 부분, 레이아웃을 포함한 모든 부분에서 로더를 정의할 수 있으므로 브라우저에서 데이터를 가져오는 경우와 달리 데이터를 병렬로 로드할 수 있습니다.

이것은 Remix 랜딩 페이지에서 아래 그림으로 가장 잘 설명됩니다.

<video controls width="640">
  <source src="https://prateeksurana.me/videos/remix-parallel-loaders-demo.webm" type="video/webm" />
</video>

Remix Twitter Clone의 네트워크 그래프는 다음과 같이 보입니다:

![](https://blogger.googleusercontent.com/img/a/AVvXsEgUGQyrseM3EYitRrt7TAZdDMrEi83NDfHGDJc4lNXONpbZtIl_Jv2c1fz1KrDNNmy0TeFm8dGyrSoo8079Lfwma_zPlUWy0ePFYVGGitJURILvLkbcfJLnm5CtTmF3rmS7dxD8jfdW4K0OtR066zo-xEzo07PJ4XgnEUeVAVQz9uToVHFbo-Z-RPhRqTU)

둘째로, 로더는 서버에서 페이지를 렌더링하는 데만 사용되는 것이 아닙니다.

로더의 응답은 HTTP Fetch Response일 뿐이므로 Remix는 네비게이션 또는 revalidations을 위해 브라우저에서도 fetch를 통해 로더를 호출할 수 있습니다.

### Next.js

Next.js 13에서 앱 디렉토리가 도입되면서 Next.js는 getServerSideProps, getStaticProps 에서 벗어나 React Server 컴포넌트 (RSCs)로 이동했습니다.

RSCs는 서버에서 Data Fetching할 때의 많은 다른 문제들을 해결하는 주제이며, 이는 별도의 블로그에서 자세히 다루어야 할 내용입니다. (실제로 ['Future of Rendering in React blog' 블로그](https://prateeksurana.me/blog/nextjs-13-vs-remix-an-in-depth-case-study/)에서 이를 더 자세히 다루었습니다).

간단히 말하면, 서버 컴포넌트(Server Components)는 React의 새로운 패러다임입니다.

이들은 서버에서만 렌더링되며 기존의 React 서버 측 렌더링과 달리 클라이언트에서는 절대 활성화되지 않습니다.

이들은 많은 이점을 가지며 그 중 일부는 다음과 같습니다:

- 데이터 가져오기와 보안: 서버 컴포넌트는 항상 서버에서만 실행되므로 서버 전용 비밀 및 API 호출을 React 서버 컴포넌트에 직접 포함시킬 수 있고, 이를 클라이언트에 노출시키지 않고 사용할 수 있습니다.

- 결정적인 번들 크기: 이전에는 클라이언트의 JavaScript 번들 크기에 영향을 미칠 수 있던 종속성이 이제 서버 컴포넌트 내에서만 사용되는 경우 클라이언트로 다운로드되지 않습니다. (예: 마크다운 파서와 같이 이전에는 페이지를 활성화하기 위해 JavaScript가 다운로드되어야 했던 것입니다.)

서버 렌더링의 장점은 [여기 공식 문서](https://nextjs.org/docs/app/building-your-application/rendering/server-components)에서 더 찾아보시면 됩니다.

Interactive한 부분이 필요한 부분에는 클라이언트 컴포넌트(Client Components)를 만들어야 합니다.

그 이름과 달리 클라이언트 컴포넌트는 서버에서도 렌더링되지만, 일반적인 서버 측 렌더링 파이프라인을 따르며 클라이언트 측에서 관련 JavaScript를 다운로드하고 실행하여 활성화해야 합니다.

서버 컴포넌트(Server Components)는 마법 같은 해결책이 아니며 몇 가지 제한 사항이 있습니다.

다음이 같습니다:

- 서버에서만 실행되고 클라이언트에서 활성화되지 않으므로 상호 작용적인 UI 요소를 포함할 수 없으며, useState, useEffect, 이벤트 핸들러 및 브라우저 전용 API와 같은 요소들은 작동하지 않습니다. 대신 컴포넌트 트리에서 상호 작용이 필요한 곳마다 클라이언트 컴포넌트를 사용해야 합니다.

- 클라이언트 컴포넌트 내에서 서버 컴포넌트를 가져와 사용할 수 없습니다. 서버 컴포넌트는 서버에서만 렌더링될 수 있으므로 서버 컴포넌트 트리를 서버에서 미리 알아야 합니다. 그러나 이를 섞어 사용하는 방법도 있습니다.

앱 디렉토리 내에서 기본적으로 모든 컴포넌트는 서버 컴포넌트이며, 상호 작용성을 추가하려면 컴포넌트 트리 내에 클라이언트 컴포넌트를 추가해야 합니다.

클라이언트 컴포넌트는 파일 상단에 'use client' 지시문을 추가하여 만드는데요.

또한, 서버 컴포넌트와 클라이언트 컴포넌트는 동일한 파일에 있을 수 없습니다.

다시 한 번, Next.js에서 Remix에서 본 것과 동일한 기본 레이아웃 예제를 서버 컴포넌트로 표시한 것을 보여드립니다:

```js
export default async function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentLoggedInUser();
  const isLoggedIn = !!user;

  return (
    ...
  );
};
```

서버 컴포넌트(Server Components)는 서버에서 렌더링되므로 Promises를 반환할 수 있습니다.

이로써 컴포넌트 내에서 데이터를 기다린 다음 해당 데이터를 렌더링하는 동안 사용할 수 있습니다.

또한 Next.js는 headers, cookies, redirect, revalidatePath 등과 같은 helper를 제공하여 서버 측에서 요청 데이터에 액세스하고 서버 전용 작업을 수행할 수 있게 합니다.

여기서 getCurrentLoggedInUser 메서드는 실제로 쿠키를 사용하여 데이터베이스에서 현재 로그인한 사용자의 세부 정보를 가져오는 데 사용됩니다.

이것은 데이터베이스에서 데이터를 직접적으로 React 컴포넌트 내에서 선언적인 방식으로 읽는 것 뿐만 아니라, Server Component 내에서 수행하는 한 라우트 세그먼트뿐만 아니라 컴포넌트 트리의 어느 수준에서라도 수행할 수 있는 제한이 없어진 혁신적인 기능입니다.

Next.js 13에서 애플리케이션을 구성하는 권장 방법은 클라이언트 컴포넌트를 컴포넌트 트리의 말단에 유지하여 상호 작용, 상태 또는 브라우저 전용 API가 필요한 곳에만 사용하는 것입니다.

다음은 Next.js Twitter Clone의 사용자 프로필 페이지에서 구성이 어떻게 분배되는지를 보여주는 예시입니다:

![](https://blogger.googleusercontent.com/img/a/AVvXsEiikATpf3fJdVKWLSBtB3vEpC7ZFf44h9b4f8IMMbsyh0TjZwFpN25N6HW4OEDk7sdbahJqyRWiy5bnKmqXrBJy7ef7DXqmmixqnQuQqmVi3P__oIybZeA9oXTvR0npUrm_AAUdzEP85mDXWahiSGGkIGoPM4KvyPq5Qv0A8AcpiaRlH-nqWC2r1JYKtjM)

Next.js의 렌더링 문서에는 클라이언트 컴포넌트 또는 서버 컴포넌트를 언제 사용해야 하는지를 결정하는 데 도움이 되는 다음과 같은 표가 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjIJLctI4J6a9QSHjvfg-8kfazkmaC6HFN6GsTUUMnmF8BCrS_XWGafgCPEI4dem3dOzucbj3NRze1m5uFWuPQqbCT8eOzBPsGRBE22A-cCr8zaBhn5o98sMRvzeq4um6t0jtmuq0G28VCItCjDFjAHanj29YqauK-Y4Vu15GaRLJu84001u7lBi15Srt0)

### Bottom line

Remix가 로더를 사용하여 강력한 API를 구축하는 방식으로 자식 라우트의 병렬 데이터 가져오기와 revalidations이 가능해진다는 점과 로더가 항상 Fetch Response를 반환하는 사실은 좋지만, React Server Components가 좀 더 옳은 방향이라고 느껴집니다.

다른 이점들뿐만 아니라 결정적인 번들 크기와 같은 이점들을 제공하는 React Server Components는 훌륭한 개발자 경험(DX)도 제공합니다.

라우트 세그먼트뿐만 아니라 컴포넌트 트리 전체에서 데이터를 조합할 수 있습니다.

Remix도 RSCs가 가져다주는 이점을 인정하고 미래에 React Server Components를 통합할 계획이 있다고 합니다.

로더를 사용할 때 한 가지 주의할 점은 로더를 컴포넌트가 포함된 동일한 파일에 정의한다는 것입니다.

컴파일러가 클라이언트와 서버 번들을 분리하는 데는 잘 작동하지만, 서버 전용 비밀이 노출되거나 서버 전용 번들이 우연히 클라이언트로 전송될 수 있는 문제가 발생할 수 있습니다.

Remix는 또한 [라우트 세그먼트에서 모듈을 가져올 때 주의해야 할 사항](https://remix.run/docs/en/main/guides/constraints)을 문서로 제공하고 있으며, Next.js도 앱 디렉토리 이전 버전에서는 같은 문제가 있었습니다.

마지막으로, 서버 컴포넌트도 고유한 문제를 가지고 있습니다.

기본적으로 서버 컴포넌트에서 데이터를 가져오면 데이터가 서버 컴포넌트 트리를 따라 순차적으로 가져옵니다.

병렬로 데이터를 가져오는 방법이 있긴 하지만, 이러한 해결책들은 완벽하지 않습니다.

---

## Streaming

React 18을 사용하면 Streaming과 Suspense를 사용할 수 있으며, 이를 통해 UI의 렌더링 단위를 점진적으로 렌더링하고 클라이언트로 순차적으로 스트리밍할 수 있습니다.

Streaming을 사용하면 레이아웃 부분과 블로킹 데이터 요구 사항을 가진 라우트 세그먼트에 대한 로딩 상태를 표시할 수 있습니다. 서버에서 모든 데이터가 준비될 때까지 페이지 로드를 지연시키는 대신, 서버는 먼저 의존 부분에 대한 로딩 상태를 반환하고 나중에 서버에서 데이터를 가져온 후 실제 데이터로 교체할 수 있습니다. Next.js 스트리밍 문서의 이 도식은 이를 아주 잘 설명합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhe1mwchMpkbecgbC4D-d-dh4MfMUska3WOQsP0rtUFma3PKPyJG7e8HIxw9rwrEGX_Xv3ngF6k6MKYDBPkJpWjhnwW8gSNVWSv7e33zA7N48hKxHvN1Xeq9XWPjqet23rur1cPznREpSkWrsIrUGWT9DhMyZ5BkjfjNemTj_i-QSObWN6FAg_FbkHBhSM)

Remix와 Next.js 13 모두 Streaming 및 Suspense를 지원하는 좋은 지원을 제공합니다.

### Remix

Remix에서는 간단히 defer 래퍼를 사용하여 로더에서 스트리밍하려는 항목의 resolve 된 값 대신 프로미스(Promise)를 반환할 수 있습니다.

그런 다음 컴포넌트에서 defer 된 로더 프로미스를 처리하기 위해 Await 컴포넌트를 사용하고, 이를 Suspense 바운더리로 래핑하여 프로미스가 resolving 될 때까지 로딩 인디케이터를 표시할 수 있습니다.

다음은 Twitter Clone 앱에서 무한 트윗의 첫 번째 페이지를 서버로부터 스트리밍하는 방법을 간소화한 버전입니다:

```js
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const username = params.username as string;

  return defer({
    tweets: getTweetsByUsername(request, username),
    currentLoggedInUser: await getCurrentLoggedInUser(request),
  });
};

export default function UserTweets = (
  props: SuspendedInfiniteTweetsProps
) => {
  const data = useLoaderData<typeof loader>();
  console.log(currentLoggedInUser.name)

  return (
    <Suspense fallback={<Spinner />}>
      <Await
        resolve={props.tweets}
        errorElement={<p>Something went wrong!</p>}
      >
        {(initialTweets) => (
          {/* Render the Tweets */}
        )}
      </Await>
    </Suspense>
  );
}
```

위의 예제에서 getCurrentLoggedInUser가 await 됨 주목하시면 됩니다.

따라서 이는 스트리밍되지 않으며, 일반 로더 응답과 마찬가지로 직접 사용할 수 있습니다.

### Next.js

Next.js 13에서는 스트리밍이 더 간단합니다.

이전에 레이아웃 섹션에서 논의한 것처럼, route 세그먼트 디렉토리 내에 직접 loading.tsx를 만들어 해당 디렉토리 아래의 route 세그먼트에 대한 즉시 로딩 상태를 얻을 수 있습니다.

내부적으로 Next.js는 loading.tsx에서 지정한 fallback과 함께 페이지를 Route Segment 내에 Suspense 바운더리로 래핑합니다.

Next.js 문서의 다음 이미지에서 가장 잘 설명됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEh1fvz6sjPHiorazFglSolwSiHt6fn4kmL8THj6Q8sW6ndW3uChLgjnSRvpJfZCyr2_fP_1nPGw3qziWw9gzIadzihhsi_Ngp5V4BHsSHTCQuhurixWz_fZP2fWtFbMWJYj6Sudaci1xK7G2TOwD1T7aJGPpDRYJ9vd8xzF09Bo2CMeoMbXGRtfTEecSHk)

이 외에도, 라우트 세그먼트가 아닌 것을 Suspend 하려면 데이터 가져오기 요구사항이 있는 비동기 컴포넌트를 Suspense로 래핑함으로써 할 수 있습니다.

예를 들어 Twitter Clone 앱에서 좋은 예로 홈 페이지가 있습니다.

초기 트윗을 중단시키려고 했지만 헤더의 "트윗 작성" CTA가 차단되어 사용자가 기다리지 않도록 하고 싶었습니다.

```js
export default async function Home() {
  const user = await getCurrentLoggedInUser();

  return (
    <>
      {/** Header stuff */}
      {user && (
        <div className="hidden sm:flex p-4 border-b border-solid border-gray-700">
          <Image
            src={user.profileImage ?? DEFAULT_PROFILE_IMAGE}
            className="rounded-full object-contain max-h-[48px]"
            width={48}
            height={48}
            alt={`${user.username}'s avatar`}
          />
          <div className="flex-1 ml-3 mt-2">
            <CreateTweetHomePage />
          </div>
        </div>
      )}
      <Suspense fallback={<Spinner />}>
        <HomeTweets />
      </Suspense>
    </>
  );
}

async function HomeTweets() {
  const initialTweets = await getHomeTweets();

  return (
    /** Render initial infinite Tweets */
  );
}
```

### Bottom line

스트리밍과 Suspense를 사용하는 것은 React에서 사용자에게 큰 UX를 제공하는 훌륭한 기능으로, 첫 번째 바이트까지 걸리는 시간을 크게 단축하고 모든 데이터 가져오기를 서버에서 처리하는 동안 로딩 상태를 표시할 수 있습니다.

또한 React Server Components에서는 컴포넌트를 간단히 Suspense 바운더리로 래핑할 수 있는 방식이 정말 좋습니다.

---

## Data mutations

데이터 변경(mutations)에 관해서는 일반적으로 백엔드 서버로 API 요청을 보내고 로컬 상태를 업데이트하여 변경 사항을 반영하는 방식을 사용해왔을 것입니다.

또는 React Query와 같은 라이브러리를 사용하여 대부분의 작업을 처리하는 것도 있습니다.

Remix나 Next.js는 액션을 핵심 기능으로 만들어서 Data Mutations 하고자 합니다.

### Remix

Remix에서는 데이터 변경(mutations) 작업을 액션으로 처리하며, Remix의 핵심 기능 중 하나입니다.

액션은 route 파일에서 action이라는 함수를 export 하여 정의합니다.

로더와 유사하게 액션도 Fetch Response를 반환하는 서버 전용 함수이지만 로더와는 달리 라우트의 비-GET 요청 (POST, PUT, PATCH, DELETE)을 처리할 수 있습니다.

Remix에서 액션과 상호 작용하는 기본 방법은 HTML 폼(Form)을 통해 이루어집니다.

블로그 첫 부분에서 웹을 더 잘 이해할수록 Remix를 더 잘 다루게 된다고 언급한 적이 있었죠?

바로 action 함수를 얘기한겁니다.

Remix는 사용자가 작업을 수행하는 모든 부분을 HTML 폼(Form)으로 유지하도록 권장합니다.

네, 심지어 "좋아요" 버튼도 폼입니다.

사용자가 폼 제출(Form Submit)을 트리거할 때마다 가장 가까운 라우트에서 액션을 호출하며 (폼의 action 속성을 사용하여 어느 URL에 폼을 게시할 것인지 지정하여 변경할 수 있습니다), 액션이 실행되면 Remix는 브라우저 fetch 요청을 통해 해당 라우트의 모든 로더를 다시 가져와 UI를 새로 고칩니다.

이로써 UI가 항상 데이터베이스와 동기화되도록 보장하게 되죠.

이것이 Remix의 "풀 스택 데이터 플로우"라고 부르는 것입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjSKmSq1TuXcTuXw9sK2aXoTYJtB2zmF4Y6Rb5aKfgio9Nn0acj-iXT-RT6INmYMOFXKo4zXx1AqAU-S0Cyk89gKZuEYSwqpixDXnYkP1fwHOK9Pus5MZN6nnMpLnlTFhfWUxxQWwESOwXVEfMmHKK8a9B1u-YFOZafi4vyddZoGPL1vvbMAP3vQ_8ECzo)

자세히 보기 위해 Twitter Clone의 예제를 통해 어떻게 작동하는지 살펴보겠습니다.

이것이 로그인 페이지의 코드입니다.

```js
export const action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();
  const usernameOrEmail = form.get("usernameOrEmail")?.toString() ?? "";
  const password = form.get("password")?.toString() ?? "";
  
  const isUsername = !isEmail(usernameOrEmail);
  // Find an account
  const user = await prisma.user.findFirst({
    where: {
      [isUsername ? "username" : "email"]: usernameOrEmail,
    },
  });

  const fields = {
    usernameOrEmail,
    password,
  };

  if(!user) {
    return json({
      fields,
      fieldErrors: {
        usernameOrEmail: `No account found with the given ${
          isUsername ? "username" : "email"
        }`,
        password: null,
      },
    }, {
      status: 400
    })
  }

  const isPasswordCorrect = await comparePassword(password, user.passwordHash);

  if(!isPasswordCorrect) {
    return json({
      fields,
      fieldErrors: {
        usernameOrEmail: null,
        password: "Incorrect password",
      },
    }, {
      status: 400
    })
  }

  return createUserSession(user.id, "/");

}

export default function Signin() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  return (
    <>
      <h1 className="font-bold text-3xl text-white mb-7">Sign in to Twitter</h1>
      <Form method="post">
        <div className="flex flex-col gap-4 mb-8">
          <FloatingInput
            autoFocus
            label="Username or Email"
            id="usernameOrEmail"
            name="usernameOrEmail"
            placeholder="john@doe.com"
            defaultValue={actionData?.fields?.usernameOrEmail ?? ""}
            error={actionData?.fieldErrors?.usernameOrEmail ?? undefined}
            aria-invalid={Boolean(actionData?.fieldErrors?.usernameOrEmail)}
            aria-errormessage={actionData?.fieldErrors?.usernameOrEmail ?? undefined}
          />
          <FloatingInput
            required
            label="Password"
            id="password"
            name="password"
            placeholder="********"
            type="password"
            defaultValue={actionData?.fields?.password ?? ""}
            error={actionData?.fieldErrors?.password ?? undefined}
            aria-invalid={Boolean(actionData?.fieldErrors?.password)}
            aria-errormessage={actionData?.fieldErrors?.password ?? undefined}
          />
        </div>
        <ButtonOrLink type="submit" size="large" stretch disabled={navigation.state === "submitting"}>
          Sign In
        </ButtonOrLink>
      </Form>
    </>
  );
}
```

URL 변경이 필요한 폼 제출에 대해 Remix는 네이티브 HTML 폼 요소 위에 점진적으로 향상된 래퍼인 Form 컴포넌트를 제공합니다.

그런 다음 useNavigation 훅을 사용할 수 있으며, 이 훅은 사용자에게 로딩 상태에 대한 피드백을 제공할 수 있는 보류 중인 페이지 네비게이션에 대한 정보를 제공합니다.

로그인 페이지에서는 폼이 제출되는 동안 버튼을 비활성화하는 데 이를 사용하고 있습니다.

로더에서 보았던 useLoaderData와 유사하게 Remix는 useActionData도 제공합니다.

이것은 서버와 클라이언트 사이를 연결하여 submit error를 사용자에게 알리는 데 사용하는 역할을 합니다.

또한 입력 관리를 위해 State를 사용하지 않는 것을 주목하세요.

대신에 브라우저의 기본 동작을 이용하여 모든 폼 필드를 본문에 직렬화하고 폼이 제출될 때 "POST"로 서버에 전송합니다.

액션에서는 Fetch Request의 formData 메서드를 통해 formData를 읽을 수 있습니다.

그러나 매번 폼 제출로 인해 네비게이션을 수행하고 싶지 않을 수도 있습니다.

따라서 Remix는 네비게이션을 유발하지 않고도 폼과 상호 작용하기 위한 또 다른 유틸리티인 fetcher를 제공합니다.

Twitter Clone의 거의 모든 나머지 폼은 fetcher 폼입니다.

트윗 "좋아요"를 예로 들어보겠습니다.

```js
export default function TweetStatus() {
  const { tweet, user, replies } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const isLoading = fetcher.state !== "idle";

	return (
		{/** Rest of UI on page ,omitted for brevity **/}
		<fetcher.Form method="post">
      <input type="hidden" name="tweetId" value={originalTweetId} />
      <input
        type="hidden"
        name="hasLiked"
        value={(!tweet.hasLiked).toString()}
      />
      <TweetAction
        size="normal"
        type="like"
        active={tweet.hasLiked}
        disabled={isLoading}
        submit
        name="_action"
        value="toggle_tweet_like"
      />
    </fetcher.Form>
   {/** Rest of UI on page ,omitted for brevity **/}
	);
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const action = formData.get("_action");
  const userId = await getUserSession(request);

  if (!userId) {
    return redirect("/signin", 302);
  }

  switch (action) {
    case "toggle_tweet_like":
      {
        const tweetId = formData.get("tweetId") as string;
        const hasLiked = formData.get("hasLiked") === "true";
        await toggleTweetLike({
          request,
          tweetId,
          hasLiked,
        });
      }
      break;
    case "toggle_tweet_retweet":
      {
        /** Handle tweet retweet **/      
			}
      break;
    case "reply_to_tweet":
      {
        /** Handle tweet reply **/
      }
      break;
  }

  return json({ success: true });
};
```

폼에서 tweetId 및 hasLiked와 같은 관련 데이터를 서버로 전달하기 위해 hidden 타입의 input을 사용하는 걸 보십시요.

또한 버튼의 이름을 _action으로 설정하고 값은 toggle_tweet_like로 설정합니다.

이렇게 하면 서버에서 어떤 유형의 작업이 트리거 되었는지 식별할 수 있으며 페이지에 여러 개의 폼이 있는 경우 유용합니다.

Remix의 풀 스택 데이터 플로우에서 본 것처럼 브라우저 fetch를 통해 페이지의 모든 로더가 자동으로 실행되어 관련 로더에서 데이터를 읽는 페이지의 UI가 업데이트됩니다.

따라서 트윗 "좋아요" 수와 버튼 상태가 자동으로 업데이트됩니다.

이 작동 방식을 보려면 이 비디오를 확인하세요.

<video controls width="640">
  <source src="https://prateeksurana.me/videos/tweet-like-remix.webm" type="video/webm" />
</video>


Remix가 모든 곳에서 HTML 폼을 사용하도록 강제하기 때문에 브라우저는 기본적으로 폼 입력을 직렬화하고 데이터를 자동으로 서버로 보내기 때문에 사용자는 JavaScript가 로드되기 전에 페이지와 상호 작용을 시작할 수 있습니다.

JavaScript를 비활성화한 다음 앱의 폼 관련 테스트를 해봐도 작동됨을 알 수 있을 겁니다.

예를 들어 로그인 페이지에서 JavaScript 없이도 폼 오류가 표시되는 예제를 보여드리겠습니다.

<video controls width="640">
  <source src="https://prateeksurana.me/videos/remix-form-errors-without-js.webm" type="video/webm" />
</video>

또 다른 예로 사용자 프로필 페이지에서 사용자를 팔로우하는 것을 보여드리겠습니다.

<video controls width="640">
  <source src="https://prateeksurana.me/videos/remix-follow-user-without-js.webm" type="video/webm" />
</video>

### Next.js

Next.js 13.4 이전에 서버에서 작업을 만들고 수행할 수 있는 유일한 방법은 API 라우트를 만드는 것이었습니다.

pages/api 폴더 밑에 생성된 모든 파일은 일반 페이지가 아닌 API 엔드포인트로 처리되었습니다.

서버에서 처리해야 하는 일회성 API 라우트에 대해서는 좋은 솔루션이었지만 클라이언트 측에서 API를 호출하고 revalidations을 처리할 때 혼자서 해야 했기 때문에 완전한 솔루션이 아니었습니다.

그래서 trpc와 같은 솔루션이 인기를 얻은 이유 중 하나입니다.

trpc는 Next.js의 API 라우트 시스템을 활용하여 React Query와 함께 클라이언트 측에서 API 요청 및 mutations를 처리합니다.

Next.js 13.4에서는 서버 액션을 소개했으나, 이 기사를 작성하는 현 시점에서도 아직 베타 단계에 있습니다.

서버 액션을 사용하면 API 엔드포인트를 만들 필요가 없습니다.

대신 컴포넌트에서 직접 호출할 수 있는 비동기 서버 함수를 만들 수 있으며, 쿠키, revalidations, 리디렉션 등과 같은 모든 Next.js 서버 전용 유틸리티에 액세스할 수 있습니다.

Lee Robinson의 이 트윗은 서버 액션을 사용할 때 얼마나 적은 코드를 작성해야 하는지를 아주 잘 요약하고 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjS9dMU3xdm-zdZECl_tfxYyXJ4nQ_68hwJ8w7Dt0mH2ffMZ_isySb2DUszkMd8QzDYsEd_JvIaUdnp6G8GHpIxGOPrdECmsAxLT5jpyq14_oEeq4PZd01zwcVbGYx6if6TGnvxiqzN0yhb9bRi3LrqF-opi7zQ11-kiWT3CXDKfBeN0iF3OFnMmabxtjI)

서버 컴포넌트에서 서버 액션을 정의하려면 첫 번째 줄에 'use server'를 놓은 다음 이를 직접 form의 action 속성으로 전달하거나 클라이언트 컴포넌트로 전달하여 사용할 수 있습니다. (서버 컴포넌트에서 action 속성을 사용하면 JavaScript 없이도 폼이 작동합니다)

```js
export default async function Page() {
	async function createTodo(formData: FormData) {
    'use server'
    // This will be executed on the server
  }
 
  return <form action={createTodo}>...</form>
  // or
  return <ClientComponent createTodo={createTodo} />
}
```

또한 파일의 맨 위에 'use server' 지시문을 가진 별도의 파일을 만들고 해당 파일에서 내보낸 모든 함수를 서버 액션으로 사용할 수 있으며 클라이언트 컴포넌트로 직접 가져올 수 있습니다.

```js
'use server'

export async function doStuff() {
  // This will be executed on the server
}
'use client'
import { doStuff } from './actions';

export default function Button() {
  return (
    <form action={doStuff}>
      <button type="submit">Do stuff</button>
    </form>
  )
}
```

클라이언트 컴포넌트에서 action 속성을 사용할 때 액션은 폼이 수행될 때까지 대기열에 배치됩니다.

`<form>`은 선택적 하이드레이션과 함께 우선 순위가 매겨져 가능한 빨리 수행됩니다.

Next.js Twitter Clone에서 몇 가지 예제를 살펴보겠습니다. 로그인 페이지의 코드는 다음과 같이 보입니다:

```js
export default function Signin({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const signin = async (formData: FormData) => {
    "use server";
    const auth = {
      usernameOrEmail: formData.get("usernameOrEmail")?.toString() ?? "",
      password: formData.get("password")?.toString() ?? "",
    };
    const isUsername = !isEmail(auth.usernameOrEmail);
    // Find an account
    const user = await prisma.user.findFirst({
      where: {
        [isUsername ? "username" : "email"]: auth.usernameOrEmail,
      },
    });

    if (!user) {
      const error = encodeValueAndErrors({
        fieldErrors: {
          usernameOrEmail: `No account found with the given ${
            isUsername ? "username" : "email"
          }`,
        },
        fieldValues: auth,
      });
      return redirect(`/signin?${error}`);
    }

    // Compare password
    const isPasswordCorrect = await comparePassword(
      auth.password,
      user.passwordHash
    );

    if (!isPasswordCorrect) {
      const error = encodeValueAndErrors({
        fieldErrors: {
          password: "Incorrect password",
        },
        fieldValues: auth,
      });
      return redirect(`/signin?${error}`);
    }

    // Set auth cookie
    setAuthCookie({
      userId: user.id,
    });
    return redirect("/");
  };

  const { fieldErrors, fieldValues } = decodeValueAndErrors({
    fieldErrors: searchParams.fieldErrors,
    fieldValues: searchParams.fieldValues,
  });

  return (
    <>
      <h1 className="font-bold text-3xl text-white mb-7">Sign in to Twitter</h1>
      <form action={signin}>
        <div className="flex flex-col gap-4 mb-8">
          <FloatingInput
            autoFocus
            label="Username or Email"
            id="usernameOrEmail"
            name="usernameOrEmail"
            placeholder="john@doe.com"
            defaultValue={fieldValues?.usernameOrEmail}
            error={fieldErrors?.usernameOrEmail}
            aria-invalid={Boolean(fieldErrors?.usernameOrEmail)}
            aria-errormessage={fieldErrors?.usernameOrEmail ?? undefined}
          />
          <FloatingInput
            required
            label="Password"
            id="password"
            name="password"
            placeholder="********"
            type="password"
            defaultValue={fieldValues?.password}
            error={fieldErrors?.password}
            aria-invalid={Boolean(fieldErrors?.password)}
            aria-errormessage={fieldErrors?.password ?? undefined}    
          />
        </div>
        <SubmitButton>Sign In</SubmitButton>
      </form>
    </>
  );
}
```

현재까지는 Remix의 useActionData와 같이 서버 액션의 응답을 읽는 선언적인 방법이 없으며 로그인 페이지에서 사용자가 JavaScript 없이 오류를 표시할 수 있는 방법이 필요했기 때문에 필드 값 및 오류를 인코딩 및 디코딩하기 위해 검색 매개변수를 사용했습니다.

여기서 SubmitButton은 양식이 제출되는 동안 비활성 상태를 표시하는 데 사용되는 실험적인 hook인 useFormStatus를 사용하는 클라이언트 컴포넌트입니다.

```js
"use client";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { ButtonOrLink } from "components/ButtonOrLink";

export const SubmitButton = ({ children }: { children?: React.ReactNode; }) => {
  const { pending } = useFormStatus();

  return (
    <ButtonOrLink
      type="submit"
      size="large"
      disabled={pending}
    >
      {children ?? "Submit"}
    </ButtonOrLink>
  );
};
```

클라이언트 측에서는 startTransition API를 사용하여 서버 액션을 실행할 수 있으며 서버 변이를 수행하는 서버 액션 (revalidatePath, 리디렉션 또는 revalidateTag 호출)을 실행하고 버튼 클릭시 서버 액션을 직접 실행하는 방법을 살펴보세요.

예를 들어 팔로우 버튼의 구현 방법을 확인할 수 있습니다:

```js
const [isPending, startTransition] = React.useTransition();

<ButtonOrLink
  disabled={isPending}
  onClick={() => {
    startTransition(async () => {      
      await toggleFollowUser({ userId: profileUserId, isFollowing: true });
    });
  }}
  variant="secondary"
>
  Follow
</ButtonOrLink>
```

Remix와 유사하게 서버 액션에서 직접 경로를 다시 유효화할 수 있으며, 이로 인해 서버 컴포넌트가 무효화되고 UI가 업데이트를 자동으로 반영합니다. 하지만 Remix와 달리 해당 경로의 데이터를 수동으로 새로 고치려면 revalidatePath를 직접 호출해야 합니다.

```js
export const toggleFollowUser = async ({
  userId,
  isFollowing,
}: {
  userId: string;
  isFollowing: boolean;
}) => {
  /* Updating the value in DB, omitted for brevity */
  revalidatePath("/[username]");
};
```

사용자가 팔로우 버튼을 클릭할 때 revalidatePath를 사용하여 프로필 페이지에서 팔로잉 상태가 자동으로 업데이트되는 데모를 보여드립니다:

<video controls width="640">
  <source src="https://prateeksurana.me/videos/nextjs-unfollow-demo.webm" type="video/webm" />
</video>

### Bottom line

공정하게 말하자면, Remix의 액션 접근 방식은 자동으로 로더를 다시 가져오고 UI를 업데이트하여 전체 스택 데이터 흐름을 완료하는 방식으로 매우 좋습니다.

또한 자바스크립트가 로드되기 전에 앱이 작동하도록 만들어 사용자 경험뿐만 아니라 개발자 경험을 크게 향상시킵니다.

그러나 액션에도 다음과 같은 주의해야 할 점이 있으며, 이는 로더와 동일한 문제입니다.

액션은 라우트 세그먼트에서만 정의할 수 있다는 것입니다.

액션을 여러 위치에서 재사용하려면 form의 action 속성에 액션의 URL을 지정해야 한다는 점입니다.

앱이 커짐에 따라 action prop에서 제공된 값에 따라 액션을 실행하는 파일을 찾아야 하므로 이것은 혼란스러울 수 있습니다.

예를 들어 트윗 작성 액션에 사용한 방법을 확인할 수 있으며, 이 액션은 홈 페이지와 트윗 모달에서 두 곳에서 사용됩니다.

Next.js의 서버 액션은 Remix와 비교하여 위의 문제를 해결하며, 앱 내에서 어디서든 호출할 수 있는 함수를 만들 수 있도록 허용합니다.

그러나 현재로서는 좋은 폼 지원과 자동 다시 유효화 기능이 부족하며 현재로서는 상당히 불안정하고 문서화가 미흡한 것 같습니다.

Next.js에서 API가 어떻게 작동하는지 이해하기 위해 몇 가지 토론을 열어야 했습니다.

최근 Next.js는 v13.5와 함께 서버 액션에 대한 중요한 업데이트를 발표했습니다.

그래서 서버 동작에 대한 startTransition을 사용하는 것과 같은 몇 가지 API가 더 이상 문서화되어 있지 않아 보입니다.

또한 이제는 폼에 대한 더 나은 지원도 추가되었습니다.

곧 최신 API로 앱과 블로그를 업데이트할 예정입니다.

참고로, Twitter Clone을 구축하는 동안 사용한 이전 서버 액션 API는 Next.js 문서의 웹 아카이브에서 찾을 수 있습니다.

---

## Infinite loading

무한 스크롤링과 함께 무한 로딩은 흥미로운 문제였습니다.

두 프레임워크 중 어느 하나도 이에 대해 일체 지원을 제공하지 않았지만, 그럼에도 불구하고 만들려고 한 Twitter Clone 앱에 있어서는 매우 중요한 부분이었습니다.

무한 로딩을 클라이언트 측에서 처리해야 했으므로 클라이언트 자체에서 useReducer를 사용하여 이를 관리해야 했습니다.

이를 두 프레임워크에 추가하는 과정은 상당히 흥미로웠으므로 별도의 섹션으로 다루기로 했습니다.

### Remix

이 무한 스크롤 구현은 Kent C Dodds의 'Full Stack Components'라는 글에서 크게 영감을 받았습니다.

'Full Stack Components'라는 글에서 리소스 라우트와 Remix에서의 강력함에 대해 배웠습니다.

이 개념은 일반적인 라우트 모듈과 유사한 라우트를 만들지만, 해당 라우트에서 기본 컴포넌트를 내보내지 않으면 해당 라우트에서 정의한 로더 및 액션을 GET 및 POST 요청을 통해 여전히 사용할 수 있다는 것입니다.

이것들은 Next.js의 API 라우트 버전처럼 작동합니다.

따라서 Remix를 위해 routes/resource-infinite-tweets.tsx라는 새로운 라우트를 만들었고, InfiniteTweets라는 이름으로 export 된 걸 포함하고 있습니다.

default export가 아니므로 Remix는 이 라우트에 대한 UI를 렌더링하지 않습니다.

이 named export는 무한 로딩 트윗을 포함하는 모든 컴포넌트에서 사용되었습니다.

컴포넌트가 어떻게 작동하는지에 대한 자세한 내용은 [GitHub](https://github.com/prateek3255/twitter-clone/blob/main/apps/remix/app/routes/resource.infinite-tweets.tsx)에서 관련 코드를 확인하실 수 있습니다.

간단히 말해서, 저는 IntersectionObserver API를 사용하여 페이지의 끝을 감지하고 다음 페이지의 트윗을 가져오는 요청을 트리거하고 이를 리듀서에 추가했습니다.

좋아요/리트윗/답글 수를 포함한 다른 모든 상태도 리듀서에 저장되었습니다.

이 컴포넌트가 사용된 페이지 중 하나인 사용자 트윗 페이지를 예로 들어보겠습니다.

트윗의 첫 번째 페이지는 서버에서 로드되고 클라이언트로 스트리밍되며, 스트리밍 섹션에서 보았던 것처럼 작동합니다.

그러나 그 다음 페이지부터는 resource-infinite-tweets.tsx에서 정의한 로더를 사용했으며, 이 로더는 다음과 같이 보입니다:

```js
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cursor = getSearchParam(request.url, "cursor") ?? undefined;
  const type = getSearchParam(request.url, "type") as InfiniteTweetType;
  const username = getSearchParam(request.url, "username");
  const tweetId = getSearchParam(request.url, "tweetId");

  let tweets: Array<TweetWithMeta> = [];
  switch (type) {
    case "user_tweets":
      tweets = await getTweetsByUsername(request, username as string, cursor);
      break;
    case "home_timeline":
      tweets = await getHomeTweets(request, cursor);
      break;
    case "tweet_replies":
      tweets = await getTweetReplies(request, tweetId as string, cursor);
      break;
    case "user_replies":
      tweets = await getUserReplies(request, username as string, cursor);
      break;
    case "user_likes":
      tweets = await getUserLikes(request, username as string, cursor);
      break;
  }

  return json(
    {
      tweets,
    },
    200
  );
};
```

이제 로더를 트리거하려면 데이터 변형 섹션에서 보았던 fetcher를 사용합니다.

fetcher에는 로더를 프로그래밍 방식으로 트리거하는 데 사용되는 GET 요청을 자동으로 실행하는 submit 메서드도 있습니다.

이 요청은 다음 일괄 트윗을 가져옵니다.

```js
React.useEffect(() => {
    if (isLoading || isLastPage || !isVisible || !shouldFetch) {
      return;
    }
    fetcher.submit(
      {
        type,
        cursor: lastTweetId,
        ...rest,
      },
      {
        method: "GET",
        action: "/resource/infinite-tweets",
      }
    );
    setShouldFetch(false);

  }, [
    isVisible,
    lastTweetId,
    isLoading,
    isLastPage,
    type,
    shouldFetch,
		rest,
    fetcher
  ]);
```

이 효과는 페이지를 가져와야 하는 조건이 충족될 때 트리거 됩니다.

그런 다음 데이터가 fetcher.data에 제공되며, 이 데이터는 다른 효과에서 리듀서에 추가됩니다.

```js
React.useEffect(() => {
  if (fetcher.data && Array.isArray(fetcher.data.tweets)) {
    dispatch({
      type: "add_tweets",
      newTweets: mapToTweet(fetcher.data.tweets, isLoggedIn),
    });
    setShouldFetch(true);
  }
}, [fetcher.data, isLoggedIn]);
```

이 라우트 모듈에는 트윗에 대한 좋아요/리트윗/답글을 처리하는 액션도 있으며, 이는 데이터 변이 섹션에서 보았던 fetcher.Form을 사용하는 동일한 코드를 사용합니다.

### Next.js

Remix와 비슷한 방식으로 Next.js의 구현도 매우 유사하며 주요 차이점은 InfiniteTweets가 클라이언트 컴포넌트이고 다음 페이지를 로드하기 위해 서버 액션을 사용한다는 것입니다.

첫 번째 페이지의 트윗은 서버에서 스트리밍됩니다.

스트리밍 섹션에서 보았던 loading.tsx 파일이 여기서 정말 유용합니다.

프로필 페이지의 모든 탭에 이 파일을 추가하기만 하면 Next.js가 Suspense 경계 내에서 페이지를 처리해 줍니다.

다음은 사용자 트윗 페이지의 코드 예시입니다:

```js
export default async function Profile({
  params: { username },
}: {
  params: { username: string };
}) {
  const [tweets, currentLoggedInUser] = await Promise.all([
    getTweetsByUsername(username),
    getCurrentLoggedInUser(),
  ]);

  const fetchNextUserTweetsPage = async (cursor: string) => {
    "use server";
    const tweets = await getTweetsByUsername(username, cursor);
    return tweets;
  };

  return (
    <>
      {/** Tweets */}
      <div>
        <InfiniteTweets
          initialTweets={tweets}
          currentLoggedInUser={
            currentLoggedInUser
              ? {
                  id: currentLoggedInUser.id,
                  username: currentLoggedInUser.username,
                  name: currentLoggedInUser.name ?? undefined,
                  profileImage: currentLoggedInUser.profileImage,
                }
              : undefined
          }
          fetchNextPage={fetchNextUserTweetsPage}
          isUserProfile
        />
      </div>
    </>
  );
}
```

다음은 fetchNextUserTweetsPage라는 서버 액션을 만들고 이를 InfiniteTweets 컴포넌트에 전달하는 방식을 볼 수 있습니다.

이 컴포넌트는 전달된 이 프롭을 통해 호출된 액션을 통해 트윗의 다음 페이지를 가져옵니다.

```js
React.useEffect(() => {
  const updateTweets = async () => {
    if (isLoading || isLastPage) {
      return;
    }
    setIsLoading(true);
    const nextTweets = await fetchNextPage(lastTweetId);
    setIsLoading(false);
    dispatch({
      type: "add_tweets",
      newTweetsRemixToTweet(nextTweets, isLoggedIn),
    });
  };
  if (isVisible) {
    updateTweets();
  }
}, [isVisible, lastTweetId, isLoading, isLastPage, fetchNextPage, isLoggedIn]);
```

그런 다음 Remix와 유사하게 데이터를 리듀서에 추가하고 페이지에 다음 세트의 트윗을 렌더링합니다.

### Bottom line

Infinite loading는 두 프레임워크에서 클라이언트 측 트윗 상태를 관리해야 했던 유일한 부분이었습니다.

이 부분에서 Next.js 13의 Server Actions의 구성 가능성 측면이 정말 빛났습니다.

나는 처음 페이지를 스트리밍 할 Server Component에서 데이터를 가져오고, 이 컴포넌트 자체에서 다음 페이지를 가져오기위한 Server Action을 생성하기만 하면 되었고 이것을 직접 클라이언트 컴포넌트로 전달했습니다.

Remix의 경우, fetcher와 리소스 라우트가 데이터 가져오기를 더 쉽게 만들었지만 무한 트윗을 위한 첫 번째 페이지를 스트리밍하기 위해 각 라우트에 대한 별도의 로더를 생성해야 했습니다.

어쨌든 두 프레임 워크에서 이 솔루션이 완벽하지 않았으며 일반적으로 React Query와 같은 라이브러리가 제공하는 useInfiniteQuery 훅과 같은 솔루션을 선호했을 것입니다.

이러한 라이브러리는 무한 쿼리에 대한 클라이언트 측에서 무효화 및 낙관적 업데이트를 효과적으로 관리하는 데 도움이 되는 기능을 제공합니다.

---

## Other Features

이 두 프레임워크는 다음과 같이 다양한 기능들을 제공합니다.

### Routing

Remix와 Next.js 모두 강력한 클라이언트 사이드 라우터를 가지고 있으며, 전체 페이지를 다시 로드하고 전체 문서를 가져오기 위한 서버와의 왕복 여행을 수행하는 대신 UI를 업데이트하고 변경된 라우트 세그먼트만 다시 렌더링합니다.

Next.js는 화면에 보이는 모든 `<Link />` 태그에 대해 백그라운드에서 미리 가져와야 할 라우트를 감지합니다.

동적 라우트의 경우 첫 번째 loading.tsx 파일까지 공유된 레이아웃이 미리 가져와져 캐시에 저장되며, 이로써 사용자가 라우트를 클릭하자마자 즉각적인 로딩 상태를 표시할 수 있습니다.

<video controls width="640">
  <source src="https://prateeksurana.me/videos/nextjs-routing-demo.webm" type="video/webm" />
</video>

Remix는 prefetch 속성을 통해 사용 사례에 따라 다른 값을 지정할 수 있도록 더 나아갑니다.

가장 좋아하는 옵션 중 하나는 intent로, 이 옵션은 링크 위로 마우스를 올릴 때 `<link rel="prefetch">` 태그를 통해 다음 라우트에 필요한 모든 자바스크립트 번들 및 데이터를 가져옵니다.

이를 통해 다음 페이지를 거의 즉각적으로 렌더링할 수 있습니다.

<video controls width="640">
  <source src="https://prateeksurana.me/videos/remix-routing-demo.webm" type="video/webm" />
</video>

### Error handling

두 프레임워크 모두 모든 라우트 세그먼트에서 예상치 못한 오류와 예상 오류를 전역적으로 처리하는 데 첫 번째 클래스 지원을 제공합니다.

Remix에서는 loader 및 action과 유사하게 각 라우트 세그먼트에 오류 상태를 렌더링하는 ErrorBoundary를 내보낼 수 있습니다.

이는 서버 또는 브라우저에서 발생할 수 있는 예상치 못한 오류와 404와 같은 예상 오류를 모두 처리합니다.

예상 오류를 잡으려면 loaders에서 Response를 throw할 수 있습니다.

예를 들어 사용자 프로필 페이지의 404 상태를 확인해 보세요.

Next.js에서도 각 라우트 세그먼트에서 해당 라우트의 오류 상태를 렌더링하기 위한 별도의 파일이 있습니다.

error.tsx는 라우트 세그먼트에서 발생하는 브라우저 또는 서버 오류를 구체적으로 처리하는 데 사용됩니다.

이것은 loading.tsx와 유사하게 라우트 세그먼트 위에 ErrorBoundary를 래핑합니다.

이는 Next.js 문서의 다음 이미지를 통해 잘 설명되어 있습니다:

![](https://blogger.googleusercontent.com/img/a/AVvXsEjNQANrVg9ZeU3tKGpX4Oy82q9sgD_AIskMHtEvQJpqx7iHnE-UgxH-BLUNMRsKqMXnww0XItPv_ZwTL-HUURIOGckfo1N5VF4S9C8wAwnBglSH3bZXl8dbxoeFEkvw61FhMD725bys6HvFsP8Ab461KOa4LzGpBEOpBR22R02zwehifVZ0w8tbn5BAV3M)

404 오류를 처리하기 위해 Next.js는 모든 라우트 세그먼트에 대한 특정 파일인 not-found.tsx를 가지고 있습니다.

이 파일은 서버 컴포넌트 내에서 notFound 유틸리티 함수를 반환함으로써 트리거 됩니다.

다시 말해 Next.js Twitter Clone의 사용자 프로필 페이지의 not-found.tsx 파일을 확인할 수 있습니다.

### Caching

Twitter Clone 앱의 경우, 사용자의 쿠키를 사용하여 사용자와 관련된 데이터를 가져와야하는 모든 라우트 세그먼트에서 캐싱과 정적 렌더링을 거의 사용하지 않았습니다.

Next.js는 캐싱 지원을 크게 개선했으며, 렌더링된 라우트 뿐만 아니라 엣지에서의 fetch 요청 응답도 캐시할 수 있는 다양한 캐싱 레이어를 제공합니다. Next.js의 캐싱 문서에서 자세히 읽어볼 수 있습니다.

Twitter Clone에서는 동일한 데이터를 여러 위치에서 요청하는 함수를 메모화하는 요청 메모화를 사용합니다.

Remix는 캐싱에 대한 어떤 의견도 가지고 있지 않으며, HTTP를 간단히 다루기 때문에 응답을 엣지 및 브라우저에서 캐시하기 위해 Cache-Control 헤더를 사용하거나 Redis와 같은 다른 서버 캐싱 솔루션을 사용할 수 있습니다.


## Conclusion

만약 이 블로그를 끝까지 읽어 주셨다면, 여러분이 이 두 프레임워크 중 어떤 것을 선택할 때 더 나은 결정을 내릴 수 있는 몇 가지 흥미로운 내용을 얻었기를 바랍니다.

요약하자면, React를 사용하여 복잡한 풀스택 웹 애플리케이션을 빌드하는 것은 Remix와 Next.js 덕분에 더 빠르고 쉬워졌습니다. 
개인적으로 Remix는 기본 웹 API를 활용하고 현대적인 웹 앱을 만드는 간단하면서도 강력한 방법을 제공하는 프레임워크로서 저에게 매우 매력적으로 다가왔습니다.

한편 Next.js의 앱 디렉토리는 React Server Components와 Server Actions이 브라우저로 동일한 번들 크기를 제공하면서 풀스택 컴포넌트를 구성하고 만들 수 있도록 해주는 방법에 대해 정말 놀랍습니다.

두 프레임워크가 미래에 무엇을 제공할지 정말 기대됩니다.

