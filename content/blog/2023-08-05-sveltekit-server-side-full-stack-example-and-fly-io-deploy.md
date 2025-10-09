---
slug: 2023-08-05-sveltekit-server-side-full-stack-example-and-fly-io-deploy
title: SvelteKit 실전 예제 2편 - 서버 사이드 렌더링 풀 스택 무비 앱 만들기
date: 2023-08-05 13:40:18.294000+00:00
summary: SvelteKit을 이용해서 서버 사이드 렌더링 풀 스택 무비 앱 만들기
tags: ["fly.io", "sveltekit", "sveltejs", "ssr"]
contributors: []
draft: false
---

안녕하세요?

지난 시간에 서버 사이드 렌더링이 가능한 SvelteKit 실전 예제 1탄을 살펴봤는데요.

서버 사이드 렌더링이 가능하게끔 Fly.io에 실제 배포까지 했었습니다.

[지난 시간 강좌 보기](https://mycodings.fly.dev/blog/2023-08-03-how-to-deploy-sveltekit-to-fly-io-with-server-side-rendering)

오늘은 지난 시간에 이어 SvelteKit을 이용해서 무비 앱을 만들어 보겠습니다.

제가 취미로 만들었던 [mymovies.fly.dev](https://mymovies.fly.dev) 사이트인데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgizdqQVgb80kaLTWC0toVr7i3dHsSxy72DpTvnq1m6lT4fhuwKydqbBBHcZtNJLJpXQA8VhQ3w00Bs1Z7g0lE8i3CP4dE6U9vgkZ6DgdS5iTTyv1y5USRiOdyenhJz8pA2e_nGZjdxW2BM0CE4EfHnx_cvRADlkC1rWVkxrL_f-IfD9FgXBAkcL7fQ7YI)

예전에는 Remix Framework으로 만들었었는데요.

Remix Framework가 그렇듯 React가 조금 무거운 면이 있었습니다.

메모리 소비가 좀 많았는데요.

그래서 그런지 Fly.io의 무료 가상 서버인 256MB에서 계속 앱 크래시가 일어났었습니다.

## SvelteKit으로 리팩토링 추진

기존 React 코드를 Svelte 코드로 바꾸는 게 얼마나 어려운지 이번에 느꼈는데요.

React는 전체 코드가 자바스크립트 안에 HTML UI 코드가 있다는 느낌인데요.

Svelte는 HTML 파일 안에 자바스크립트 코드가 일부 있다는 느낌입니다.

Svelte가 예전 자바스크립트 개발 방식 느낌이 나는데요.

계속 React와 Next.js, Remix를 다루다가 Svelte를 다루려니 조금은 헷갈린 점이 아주 많네요.

일단은 Remix와 SvelteKit이 추구하는 프레임워크의 방향이 아주 비슷합니다.

load 함수가 대표적인데요.

load 함수가 실행되고, load 함수에서 리턴된 데이터를 UI 쪽에 가져다가 HTML 코드를 짜면 되는 방식입니다.

이제 본격적으로 시작해 볼까요?

---

## TMBD API KEY 얻기

무비 앱을 만들 때 가장 많이 쓰이는 API는 TMDB API입니다.

무료이고 최신 영화 정보가 모두 다 있기 때문입니다.

일단 여러분들은 TMBD API KEY를 구했다고 가정하고 아래처럼 .env 파일에 TMDB_API_KEY 값을 저장합시다.

```bash
VITE_TMDB_API_KEY="fe14c8782323423a539a18921"
```

SvelteKit은 VITE를 사용하기 때문에 위 코드처럼 VITE\_로 시작해야 합니다.

이제 준비가 다 끝났는데요.

SvelteKit에서 본격적인 코드를 작성해 보겠습니다.

## SvelteKit API endpoint 만들기

SvelteKit으로 API 엔드 포인트를 만들 수 있는데요.

Next.js에 있는 그 api 라우팅입니다.

반복적인 작업인 경우 아예 api 라우팅으로 만들면 중복을 막을 수 있는데요.

예를 들어, TMDB API에서 Popular Movies 정보를 얻어오는 API를 만들어 놓으면 우리는 SvelteKit에서 어느 페이지에서든 load 함수에서 우리가 만든 api 라우팅만 호출하면 아주 쉽게 데이터를 얻을 수 있습니다.

SvelteKit에서 API 엔드 포인트를 만들려면 routes 폴더 밑에 api 폴더를 만들고 그 밑에 원하는 이름으로 폴더를 만들고 그 폴더에 +server.ts 파일만 만들면 됩니다.

//routes/api/get_popular_moves/+server.ts 내용입니다.

```js
export async function GET() {
  return new Response('Hello SvelteKit!')
}
```

SvelteKit은 API 엔드 포인트를 만드는 규칙이 있는데요.

바로 해당 HTTP Method 이름을 대문자로 해서 함수를 작성해야 합니다.

우리는 HTTP Get Method를 이용해서 데이터를 받아와야 하므로 위와 같이 GET 함수를 작성했습니다.

GET 함수는 Response 객체를 리턴 해야 하는데요.

위와 같이 Response 객체에 문자열을 리턴 했습니다.

그러면 개발 서버에서 실제 실행된 결과를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEgYG37TaMjoKktlHv_9bmmFjnciSNjfM13LsJfbGmLEVkf2rhYTlamsJzTDrnMdwlqNg1pxGMfvpvDuvF-msLojkptv3kexlYqHJWi1CuNjOWAtD9A31b_Q-3cwTEhGFmaHhG5pOL4jRxDCbdNjp_l4DUGqbcMxf8TvWHkrjpHmiumdsDUkmjZtvYEwsJ0)

위와 같이 경로명을 자세히 보시면 "api/get_popular_moves"라고 되어 있고 앞으로 우리는 이 api를 우리 프로젝트에서 아주 쉽게 사용할 수 있습니다.

## TMDB 데이터로 API 다시 꾸미기

이제 TMDB 데이터를 받아오는 로직을 만들어 보겠습니다.

```js
const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'

async function getPopularMovies() {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=1`,
    )
    const data = await response.json()
    // console.log(data);
    return data
  } catch (e) {
    throw new Error(`Could not find TMDB popular movies`)
  }
}

export async function GET() {
  const popularMovies = await getPopularMovies()

  return new Response(JSON.stringify(popularMovies))
  //   return new Response("Hello SvelteKit!");
}
```

Vite를 이용해서 개발 서버를 돌리면 process.env 방식으로 .env 파일에 있는 API_KEY를 가져오는 게 아니고

앞에 VITE\_ 를 붙여야 합니다.

그리고 import.meta.env를 이용하면 됩니다.

GET 함수에서 Response로 돌려주는 부분이 뭔가 구식인데요.

그래서 SvelteKit은 json 함수를 제공해 줍니다.

```js
import { json } from "@sveltejs/kit";

...
...
...


export async function GET() {
  const popularMovies = await getPopularMovies()

  return json(popularMovies);
  // return new Response(JSON.stringify(popularMovies))
  //   return new Response("Hello SvelteKit!");
}

```

json 함수는 아주 쉽게 리턴 해 주는 Helper 유틸이라고 생각하시면 됩니다.

이제 브라우저에서 방금 우리가 만든 API를 실행시켜 볼까요!

![](https://blogger.googleusercontent.com/img/a/AVvXsEg18R9ChWPnSqI4jd832kZMjOV10Hqs1ltuyO86xXnYLXpxjGG24aO4DZ8AWTD9ssc2UuK_U6j64xvwNff0XczZftteMwD9LmPVxwhl9f1Zyc7TV_mSOt8DX8wv-myWTv-11yr_33K5GrIMAil1gBwlNOcW5hsefekgr2rSuB6Rn1CT6gEfesymhqV4Oq8)

위와 같이 아주 잘 작동하고 있습니다.

이제, 우리가 만든 API 엔드 포인트를 이용해서 페이지를 만들어야 하는데요.

## SSR이냐 CSR이냐 그것이 문제로다!

데이터를 가져오는 방식에는 SSR(Server Side Rendering)이나 CSR(Client Side Rendering)이 있습니다.

그래서 풀 스택 개발자라면 SSR, CSR을 잘 혼용해서 프로그램을 짜야 하는데요.

저는 SSR을 자주 이용합니다.

우리의 오늘 강의 목적도 SSR이구요.

참고로 CSR은 React에서는 useEffect 훅에서 fetch 함수를 이용해서 데이터를 가져오면 되는 거고요.

SvelteKit에서는 onMount 함수에서 똑같이 fetch 함수를 이용해서 데이터를 가져오면 됩니다.

그러면 SSR일 경우에는 어떻게 할까요?

리믹스 프레임워크와 같이 load 함수를 사용하는데요.

//routes/+page.svelte가 UI 부분을 담당하는 파일이라면 같은 이름으로 확장자가 .ts인 경우 이 파일에서 load 함수를 작성할 수 있습니다.

즉, +page.ts 파일을 만들고 그 밑에 load 함수를 작성하는 건데요.

+page.server.ts 파일처럼 이름에 server를 지정하면 이 파일은 무조건 서버 사이드에서만 작동하게 됩니다.

자 그러면, +page.server.ts 파일을 만들겠습니다.

```js
export async function load({ fetch }) {
  const response = await fetch('api/get_popular_movies')
  const popularMovies = await response.json()

  return { popularMovies }
}
```

load 함수는 간단하게 아까 위에서 우리가 만든 API 엔드 포인트에서 데이터를 가져오고 그걸 return 합니다.

load 함수는 무조건 객체를 리턴 해야 합니다. 꼭 기억하시기를 바랍니다.

그러면 이렇게 load 함수에서 return 된 우리의 데이터는 +page.svelte 파일에서 어떻게 접근할까요?

바로 아래와 같이 "data" 라는 이름으로 접근할 수 있습니다.

```js
<script lang="ts">
  exoprt let data;
  console.log(data);
<script>
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEjqRESLQWXvcRQAREDXaeMj9_fjXngcclTuJac1M8kH5AH35s-ewXNFv8ybVtShARN5dhM0jaJu095HiArgan7w_WG0cfcNUzcoljtlUij_IObK7f6pYVaw8lYKDdy2J_Vi8OLA6i-zLh61q6TmNNH69eQLOYTYhTBr-W9nFXcWK2ktEzwEROP_bp9PqSU)

위 그림과 같이 "data"가 아까 load 함수에서 리턴 한 popularMovies 데이터를 가지고 있습니다.

그럼, UI 부분을 다시 짜볼까요?

```js
<script lang="ts">
  export let data;

  const popularMovies = data.popularMovies.results;
  // console.log(popularMovies);
</script>

<h1 class="text-4xl font-bold">Welcome to SvelteKit</h1>

<ul class="p-4 mt-4">
  {#each popularMovies as movie}
    <li>
      <a href={`/${movie.id}`}>
        {movie.title} / {movie.vote_average}
      </a>
    </li>
  {/each}
</ul>
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEiQP4HXUtSCi-9jR46cJ-q0b1QRfqwK418WPB2gDQPuSKL_FCdF-NrlGOaA2ZOdkuVEblWsAd1-lSs2n3GnBINFL_xb2F4qz7Kb4ae5ZcsTJq2sAkUDRkXgTZDYSibXFN1pltj8sENlxpc04U6tbRYnEeDrs6Q02Pw32jmj1GBJqjVFagix3ZtjHNrItvM)

실행 결과는 위 그림과 같이 대 성공입니다.

이름을 클릭하면 상세경로로 이동할 수 있는 a tag 도 추가했습니다.

---

## 다이내믹 라우팅 만들기

이제 영화의 상세 페이지를 만들어야 하는데요.

바로 Next.js나 Remix 등 모든 자바스크립트에 있는 다이내믹 라우팅 방식을 사용해야 합니다.

SvelteKit은 Next.js와 같은 방식입니다.

폴더명에 '[movieId]' 방식처럼 스퀘어 브래킷을 사용합니다.

그러면 일단 routes 폴더 밑에 '[movieId]'라는 폴더를 만들고 그 밑에는 +page.server.ts 파일과 +page.svelte 파일을 작성합니다.

.ts 파일은 load 함수인데요.

먼저, .ts 파일을 작성해 보겠습니다.

```js
const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'

export async function load({ params }) {
  const movieId = params.movieId
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos`,
    )
    const data = await response.json()
    // console.log(data);
    return data
  } catch (e) {
    throw new Error(`Could not find TMDB popular movies`)
  }
}
```

위 코드를 보시면 우리가 맨 처음 만들었던 API 엔드포인트에 있는 코드와 비슷한데요.

맞습니다. 같은 로직인데요.

그러면 이런 생각을 해 볼 수 있는데요.

API 엔드 포인트를 이용하지 않고 그냥 load 함수에서 TMDB 데이터를 가져오면 되는 거 아닌가?

맞습니다.

아까 우리가 만든 API 엔드 포인트는 교육용으로 만든겁니다.

사실 API를 만들면 아무나 이 API 주소를 알면 쉽게 접근할 수 있어 별도의 암호화를 진행해야 합니다.

그러나, 우리는 교육상 API 엔드 포인트를 만들었으니 이해하기를 바랍니다.

그리고 바로 이어 +page.svelte 파일도 작성해 보겠습니다.

```js
<script lang="ts">
  export let data;
</script>

<section class="p-4">
  <h1 class="text-4xl">
    {data.title}
  </h1>
  <img
    src={`https://image.tmdb.org/t/p/w780${data.backdrop_path}`}
    class="h-40 w-full object-cover sm:h-72 md:h-80 lg:h-96"
    alt={data.title}
  />
  <h2>{data.overview}</h2>
</section>
```

실행결과는 아래 그림과 같습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhcKwzrAa-gOoCc8LYXErPSNKDpw5E8kRSLrKfaf5qsvpExmlaDxSvvs1MlWM4GBcBQUhapGAS_UriXixBodw_N7M6zRm_GSCwBwSwTd5LdFqLgZB3tOQMtHaC8JGvT1DdsYZHhV62degdnxMpbf2o5tdKIe0cYIx_H-BXnnJKoQ_6tei0GHaevLSUxms4)

어떤가요?

상세 페이지도 아주 잘 작동하고 있습니다.

---

## Fly.io에 Deploy 하기

이제 Fly.io에 지금껏 만든 서버 사이드 렌더링 방식의 무비 앱을 Deploy(배포) 해 볼까요?

```bash
➜  sveltekit-deploy-on-fly-io> fly deploy
==> Verifying app config
Validating /Users/cpro95/Codings/Javascript/blog/sveltekit-deploy-on-fly-io/fly.toml
Platform: machines
✓ Configuration is valid
--> Verified app config
==> Building image
Remote builder fly-builder-dark-shape-9440 ready
==> Building image with Docker
--> docker host: 20.10.12 linux x86_64
[+] Building 16.3s (18/18) FINISHED
 => [internal] load build definition from Dockerfile
...
...
...
...
...
...
--> Pushing image done
image: registry.fly.io/my-svelteki-test2:deployment-01H731ZJD7AN2TGACB9G8H0TFD
image size: 181 MB

Watch your app at https://fly.io/apps/my-svelteki-test2/monitoring

Updating existing machines in 'my-svelteki-test2' with rolling strategy
  [1/1] Machine 4d891224b40168 [app] update finished: success
  Finished deploying

Visit your newly deployed app at https://my-svelteki-test2.fly.dev/
```

Fly.io에 배포 성공했습니다.

그럼 실제 배포된 사이트를 브라우저에서 접속해 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEg_Li5NIZsGk3mdwZD3_77eW1Wbi_pkU38Rxlp722TE37aD_2JCGvSjCyBHwlt0z-R28sUh7ebwKZl8Ey1-l5sIH_d6T3fULxnL0biNgtFoQWiCadJ8RwyE18U-WqN04TRJNFKwtypiqCghi0AQNXCxbNjQscg2CP-mH6WVrtCHfjVhCUNh4eDpXFxy248)

위와 같이 500 에러가 나왔습니다.

이유는 바로 TMDB_API_KEY가 없어서 우리가 만든 API 엔드포인트가 작동하지 않아서입니다.

TMDB_API_KEY는 .env 파일에 있고 보통 .env 파일 같은 민감한 정보를 저장한 파일은 Github에도 안 올리죠.

그러면 TMDB_API_KEY 같은 민감한 정보를 어떻게 Client에는 안 보이게 하면서 서버 사이드에서만 보이게 할까요?

바로 Secrets 라는 방식인데요.

Fly.io 대시보드에 보시면 아래 그림처럼 Secrets 설정하는 곳이 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEibzbs8AbUkE3Uu8naNQUxvKrHoPEhfeCtk-z92CzFIwrWJRz8AkzPFA-C9QxI6kQDtH_0wotWfoDfBfETMbsg8ZRDNHYPi1m7MeXr7J1fQ__Nc3LB6CdZQCQSK2qk_GcgXE32nOtGzjXHHOPNnJoRAsubgDmlVBMolLg9enpCC16YabVvmxEa1WCKZ5YM)

여기에 .env 파일에 있던 정보를 넣으면 되는데요.

그런데, 이 방법은 Next.js나 Remix에서는 통합니다.

이렇게 Secrets 를 설정하면 process.env.TMDB_API_KEY 같이 접근할 수 있는데요.

SvelteKit은 Vite를 사용하기 때문에 Fly.io에서 Vite 방식이랑 약간 문제가 있어 접근이 안 되고 있습니다.

그럼 어떻게 해야 할까요?

바로 Dockerfile을 이용하면 됩니다.

## Dockerfile에서 직접 build-arg 설정을 해주면 됩니다.

아래 내용을 Dockerfile에 추가합시다.

```bash
# Set production environment
ENV NODE_ENV="production"

# 추가된 부분 - 위치는 여기가 좋습니다.
# Set TMDB API key at build time
ARG TMDB_API_KEY
ENV VITE_TMDB_API_KEY=$TMDB_API_KEY
# 추가된 부분
```

도커에 추가된 내용은 ENV 변수인데요.

ENV 변수를 위와 같이 지정하면 도커 상에서 실행하는 NODEJS에서 process.env 처럼 import.meta.env로 접근할 수 있습니다.

이제, fly deploy를 아래와 같이 build-args 옵션을 줘서 배포하면 됩니다.

```bash
fly deploy --build-arg TMDB_API_KEY="with your api key"
```

아래와 같이 잘 배포되고 있습니다.

```bash
➜  sveltekit-deploy-on-fly-io> fly deploy --build-arg TMDB_API_KEY="fe14c878948921"
==> Verifying app config
Validating /Users/cpro95/Codings/Javascript/blog/sveltekit-deploy-on-fly-io/fly.toml
Platform: machines
✓ Configuration is valid
--> Verified app config
==> Building image
Waiting for remote builder fly-builder-dark-shape-9440... 🌏WARN The running flyctl agent (v0.1.69) is older than the current flyctl (v0.1.71).
WARN The out-of-date agent will be shut down along with existing wireguard connections. The new agent will start automatically as needed.
Remote builder fly-builder-dark-shape-9440 ready
==> Building image with Docker
--> docker host: 20.10.12 linux x86_64
[+] Building 22.0s (18/18) FINISHED
...
...
...
...
--> Pushing image done
image: registry.fly.io/my-svelteki-test2:deployment-01H732WMF59XZ9T6EHP67WXBRT
image size: 181 MB

Watch your app at https://fly.io/apps/my-svelteki-test2/monitoring

Updating existing machines in 'my-svelteki-test2' with rolling strategy
  [1/1] Machine 4d891224b40168 [app] update finished: success
  Finished deploying

Visit your newly deployed app at https://my-svelteki-test2.fly.dev/
➜  sveltekit-deploy-on-fly-io>
```

이제 실행 결과를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEh6pgA2j157SqhV-sxDsZDVILjAXW7aqKpDD0W1Fg1g0g1-ivsaQ0yLv9DnTV8STy9bZfvd2bQTecU2u-e_YkY06sW9DFMogX9pBBrWmCGfewtgvfADDSAPIllRUaxXe_j71ko45CNJdAy2rxHPoLU01vrFHfAg_ow_-UCuVufmkpYQZnHXnNTJlVpszfU)

![](https://blogger.googleusercontent.com/img/a/AVvXsEjICT6GVQrymrGT3N_tPI6jwpe2lfyz-URQd5dvRjYyGeszXVgexzmXe7W30R6_0RGd9kyY5c6DGwyxFc-orUAccqA1ri29DydC0DI1khA4qWP-XFT1DR05HiubsNDenJYmjhBLZ6UW7iLHjKrUgCEki6kXj6AA6-BI19XLk4KuDVZ8KHz8e8oEdUNsbxg)

잘 작동되고 있네요.

---

지금까지 SvelteKit을 이용해서 SSR 즉, 서버 사이드 렌더링을 이용한 웹 앱을 만들고 실제 서버리스 클라우드에 배포까지 했습니다.

SvelteKit을 이용해서 mymovies.fly.dev 사이트를 만들면서 느낀 점은 진짜 가벼운 앱을 만들 수 있다는 거였습니다.

React보다 훨씬 가볍고 빠른 앱 제작이 가능한 걸 이번에 새삼 느꼈었는데요.

당분간 SvelteKit을 집중적으로 공부할 예정입니다.

그럼.
