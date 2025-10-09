---
slug: 2023-09-08-rust-web-server-add-ui-sveltekit-static-site
title: Rust 웹 서버 만들기 4편. SvelteKit으로 FrontEnd를 만들고 Actix-Web에서 직접 서빙(serving)하기
date: 2023-09-08 10:11:23.751000+00:00
summary: FrontEnd 서버를 따로 만들지 않고, Static Site로 만들어 Actix-Web에서 직접 서빙
tags: ["sveltejs", "rust", "actix-web", "web server", "web application"]
contributors: []
draft: false
---

안녕하세요?

Rust 웹 서버 만들기 4편까지 왔습니다.

이게 마지막일 듯싶습니다.

지난 시간까지의 글 목록입니다.

[Rust 웹 서버 만들기 1편. Actix Web 그리고 Fly.io에 배포하기](https://mycodings.fly.dev/blog/2023-09-04-howto-rust-web-server-web-application-with-actix-web)

[Rust 웹 서버 만들기 2편. Rust에서 Reqwest를 이용해서 HTTP 요청(Request)하기](https://mycodings.fly.dev/blog/2023-09-04-how-to-use-rust-reqwest-http-get-post)

[Rust 웹 서버 만들기 3편. scraper를 이용해서 러스트로 웹 스크래핑하기](https://mycodings.fly.dev/blog/2023-09-07-rust-web-server-how-to-use-scraper)

---

## SvelteKit 설치

일단 저는 간단한 프로그램은 별도의 FrontEnd 서버를 만들지 않는데요.

지금 만드는 사이트가 그렇게 복잡하지도 않고, UI는 단순히 fetch만 하고 그 자료를 브라우저에 보여주면 되는 겁니다.

그러면 여기서 우리가 사용할 수 있는 FrontEnd 쪽 기술은 바로 Static Site가 되겠습니다.

Static Site로 유명한 게 Next.js 인데요.

저는 최근 공부하고 있는 SvelteKit으로 사용하겠습니다.

일단 다음과 같이 ui 폴더를 sveltekit 프로젝트 이름으로 만들겠습니다.

```bash
# Skeleton, Typescript를 골랐습니다.
npm create svelte@latest ui

cd ui

npx add-svelte@latest tailwindcss

npm install
```

바로 이어서 TailWindCSS도 설치했습니다.

## SvelteKit을 index.html 파일이 있는 Static Site로 만들기

SvelteKit은 SSR(Server Side Rendering), SSG(Static Site Generation) 등 여러 가지를 할 수 있는데요.

이번 시간에는 SSG 부분입니다.

먼저, SSG에 맞는 sveltejs의 adapter를 설치해야 합니다.

```bash
npm i -D @sveltejs/adapter-static
```

이제 svelte.config.js 파일을 열어 다음과 같이 adapter를 바꿔주고 설정을 조금 추가합시다.

```js
import adapter from '@sveltejs/adapter-static'
import { vitePreprocess } from '@sveltejs/kit/vite'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [vitePreprocess({})],

  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: null,
      precompress: false,
      strict: true,
    }),
  },
}

export default config
```

위에서 설정 부분에 pages란 부분이 바로 index.html 파일이 생기게 되는 부분입니다.

Static Site라서 build 폴더만으로 HTTP 서빙할 수 있습니다.

index.html 파일이 있으니까요.

이제 마지막을 Static Site로 만드는 작업은 +layout.ts 파일에 prerender = true라고 명시하면 됩니다.

이때 +layout.ts 파일은 SvelteKit의 전체 레이아웃을 관장하는 백엔드 로직이 들어가는 코드입니다.

당연히 src 폴더 밑에 routes 폴더에 있어야 합니다.

이 +layout.ts 파일이 routes와 관련해서 제일 먼저 로딩됩니다.

```js
export const prerender = true
```

그리고, TailwindCSS를 이용해서 모바일에도 적용되는 Responsive 디자인을 만들어 봅시다.

+layout.svelte 파일을 아래와 같이 수정해 줍시다.

```js
<script>
  import "../app.postcss";
</script>

<div class="h-full min-h-screen w-full">
  <main class="flex w-full flex-col items-center"><slot /></main>
</div>
```

이제 +page.svelte 파일에다가 우리가 원하는 디자인과 코드를 작성해 볼까요?

## SvelteJS에서 데이터 fetching 하기

백엔드에서 데이터를 불러올 때 주의해야 할 점이 바로 사용자에게 무언가 일어나고 있다고 알려줘야 합니다.

바로 로딩 스피너(loading spinner)를 제공해야 하는데요.

로딩 스피너가 없으면 느린 인터넷에선 사용자가 아무런 반응이 없다고 판단해 바로 뒤로 돌아가기 때문입니다.

그래서 SvelteJS에서 유명한 패키지 하나를 추가로 설치하겠습니다.

```bash
npm i -D svelte-loading-spinners
```

이제 본격적인 Data Fetching에 들어가 볼까요?

```js
<script lang="ts">
  import { onMount } from "svelte";
  import { Circle } from "svelte-loading-spinners";

  type VPNINFOTYPE = {
    country: string;
    ip: string;
    tcp: string;
    udp: string;
    sid: string;
    hid: string;
  };

  let vpnInfos: Array<VPNINFOTYPE> = [];
  let isLoading = true; // 로딩 중인지 여부를 나타내는 상태 변수

  let apiUrl: string;
  if (import.meta.env.MODE === "production") {
    apiUrl = "/api/get-vpn";
  } else {
    apiUrl = "http://127.0.0.1:8080/api/get-vpn";
  }

  async function getVpnInfo() {
    try {
      const results = await fetch(apiUrl, {mode: "cors"});
      vpnInfos = await results.json();
      isLoading = false;
    } catch (error) {
      console.error("Failed to fetch data:", error);
      isLoading = false;
    }
  }

  onMount(async () => {
    await getVpnInfo();
  });
</script>
```

UI 쪽에서 Client가 브라우저를 로드했을 때 바로 시작되는 onMount 함수를 이용했습니다.

apiUrl은 개발 모드, 프로덕션 모드에 따라 바뀌게 될 거고요.

그리고 getVpnInfo 함수로 실제 데이터를 fetching 했고 그걸, 리액티브 변수인 vpnInfos에 저장했습니다.

React에서는 useState를 써야 하는데요.

SvelteJS에서는 그냥 선언한 변수는 모두 리액티브 변수가 됩니다.

이제 UI 코드를 작성해 볼까요?

```js
<section class="bg-white">
  <div
    class="py-4 px-4 mx-auto max-w-screen-xl lg:py-16 grid lg:grid-cols-2 gap-8 lg:gap-16"
  >
    <div class="flex flex-col justify-center">
      <h1
        class="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl"
      >
        Welcome to my OpenVpn Site.
      </h1>
      <p class="mb-2 text-lg font-normal text-gray-500 lg:text-xl">
        This website is a mirror site of <span class="underline"
          ><a href="https://www.vpngate.net/en/">www.vpngate.net</a></span
        ><br />
        I created it myself because the original site is very inconvenient to view
        on mobile devices.
      </p>
    </div>
  </div>
</section>

{#if isLoading}
  <!-- 로딩 중일 때 화면에 로딩 스크린을 표시 -->
  <div class="flex items-center justify-center w-full pb-4">
    <Circle size="60" color="#3b3b40" unit="px" duration="1s" />
  </div>
{:else}
  <!-- 데이터가 로딩된 후 화면에 데이터를 표시 -->
  <div class="flex w-full flex-col md:p-4 lg:w-10/12">
    <h1 class="text-2xl font-bold dark:text-white pl-4 pb-2">VPN Lists</h1>
    <div
      class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5"
    >
      {#each vpnInfos as vpnInfo}
        <div
          class="max-w-sm p-6 border border-gray-200 rounded-lg shadow bg-white"
        >
          <h3 class="mb-2 text-md font-bold tracking-tight text-gray-900">
            {vpnInfo.country}
          </h3>

          <ul class="pb-2 text-sm">
            <li>
              {vpnInfo.ip}
            </li>
            <li>
              TCP {vpnInfo.tcp}
            </li>
            <li>
              UDP {vpnInfo.udp}
            </li>
          </ul>
          <div class="flex flex-row">
            {#if vpnInfo.tcp !== "0"}
              <a
                href={`https://www.vpngate.net/common/openvpn_download.aspx?sid=${vpnInfo.sid}&tcp=1&host=${vpnInfo.ip}&port=${vpnInfo.tcp}&hid=${vpnInfo.hid}`}
                class="text-white bg-[#050708] hover:bg-[#050708]/80 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center mr-2 mb-2"
              >
                TCP
              </a>
            {/if}
            {#if vpnInfo.udp !== "0"}
              <a
                href={`https://www.vpngate.net/common/openvpn_download.aspx?sid=${vpnInfo.sid}&udp=1&host=${vpnInfo.ip}&port=${vpnInfo.udp}&hid=${vpnInfo.hid}`}
                class="text-white bg-gray-500 hover:bg-gray-500/80 focus:ring-4 focus:outline-none focus:ring-gray-500/50 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center mr-2 mb-2"
              >
                UDP
              </a>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </div>
{/if}
```

SvelteJS의 템플릿에 따라 적절하게 UI를 꾸몄습니다.

이제 테스트해 볼까요?

백엔드 쪽에서도 "cargo run"으로 서버를 실행해 주시고,

ui 폴더 안에서 "npm run dev"로 UI 쪽 개발 서버를 실행해 주시면 됩니다.

그런데, 아래 그림과 같이 작동하지 않네요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEha8268fQQHI0VzkTZ6wwzxjCBQGjPgqAqXg_oHcyzD228POF2XbAKVbwnZ-eO9nDfQBe42KYNQvNn41PkX2ExdFlAQfcCv5urx0LV-qpZ7g1pWKSpxE4-EoWLyis32Wrl32OJNr9_midPO64JJVaDs9-kLqTaxCNNO7Y070o6yLZk8tdFMafHgmM-AJ6Q)

그 이유는 크롬 콘솔 창에 잘 나와 있습니다.

바로 CORS 때문인데요.

크로스 오리진 정책입니다.

기본적으로 서로 다른 도메인 간 데이터 교환이 불가한데요.

이걸 CORS인데요. 그래서 no-cors 설정이 필요합니다.

참고로, 러스트 백엔드는 8080 포트고, 프론트엔드인 SvelteKit은 5173 포트이니까요.

## Actix-Web에 Cors 관련 처리 해주기

러스트 서버와 UI 서버간 데이터 교환이 안될 겁니다.

바로 Cors 때문인데요.

Actix-Web에는 actix-cors 패키지가 있습니다.

우리는 이걸 이용할 건데요.

일단 먼저, 설치해야 합니다.

```bash
cargo add actix-cors
```

이제, Rust의 main.rs 파일에 아래와 같이 Cors 처리를 해주면 됩니다.

```rust
use actix_cors::Cors;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("Rust Actix-web server started at 127.0.0.1:8080");

    HttpServer::new(|| {
        let cors = Cors::default()
            .allow_any_origin()
            .allowed_methods(vec!["GET", "POST"])
            .allowed_headers(vec![http::header::AUTHORIZATION, http::header::ACCEPT])
            .allowed_header(http::header::CONTENT_TYPE)
            .max_age(3600);

        App::new()
            .wrap(cors)  // 여기에 cors를 wrap 해야 합니다.
            .service(get_vpn_info)
            .service(healthcheck)
    })
    .bind(("127.0.0.1", 8080))?
    // .bind(("0.0.0.0", 8080))?
    .run()
    .await
}
```

allowed_methods에 보시면 허용되는 HTTP 메서드가 있는데요.

우리는 GET 메서드만 쓸 거라서 POST 메서드는 지워도 됩니다.

이제 다시 2개의 서버를 각각 돌려서 실행 결과를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEjzHfUgBcvUzRpKHgabq8KIrRR0KDti0mWZekNkDrr7qeIYkEk-h5km_XGYlIFnbnbBVqCKspaXVXbAs2_q47Q9gbSm0ADEvuEc6U5xymWTIbrhxHQJZjQNY96yD0AV44TJNrOwd-sVFZH9abcsHoazEyQh9LEga_8VtZNB9yarp0SVczGJwKVoIys7GRY)

위 그림과 같이 콘솔 창에 아무런 에러도 없고, UI 부분도 잘 나오고 있습니다.

대 성공이네요.

또, 새로 고침 해보면 동그란 로딩 스피너가 작동할 겁니다.

## SvelteKit Build 해보기

이제 UI 부분은 끝났으니까요, UI 부분을 정적 사이트로 빌드 해야 합니다.

```bash
npm run build
```

이렇게 하시면 아까 svelte.config.js 파일에서 설정했듯이 build 폴더에 파일이 생성됩니다.

```bash
➜  ui git:(master) ✗ cd build
➜  build git:(master) ✗ ls -al
total 16
drwxr-xr-x   5 cpro95  staff   160  9  8 19:52 .
drwxr-xr-x  17 cpro95  staff   544  9  8 19:52 ..
drwxr-xr-x   4 cpro95  staff   128  9  8 19:52 _app
-rw-r--r--   1 cpro95  staff  1571  9  8 19:52 favicon.png
-rw-r--r--   1 cpro95  staff  2419  9  8 19:52 index.html
➜  build git:(master) ✗
```

위와 같이 index.html 파일이 생성됐습니다.

이제 이 파일을 직접 serve 해볼까요?

```bash
➜  build git:(master) ✗ serve .
 UPDATE  The latest version of `serve` is 14.2.1

   ┌────────────────────────────────────────────┐
   │                                            │
   │   Serving!                                 │
   │                                            │
   │   - Local:    http://localhost:3000        │
   │   - Network:  http://192.168.29.145:3000   │
   │                                            │
   │   Copied local address to clipboard!       │
   │                                            │
   └────────────────────────────────────────────┘

```

serve 는 npm 패키지입니다.

"npm i -g serve"로 글로벌하게 설치하시면 언제든지 사용할 수 있습니다.

포트 3000으로 가볼까요?

아래 그림과 같이 데이터를 Fetching 하지 못하고 있네요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEh4ICV9p7W2CypihVazBun58E1g_F_bBRL_nzrGmp4p-vPanfYZ66ETCLrqeR1wOrSYDF1pjc1LJ2LVb9L0nekT-s9IAjR1GUB3D5AtAuaGPHD-MDTRmqZlRbU7TNZ-AcO70LHMEv8-q1hVGbN55mQ6625f62nkTHeSNwmARu8SJLsh7VQxxlawFuSR-m4)

걱정하지 마십시오.

이건 아까 svelte 코드에서 apiUrl을 개발 모드, 배포모드에 따라 주소를 달리 했기 때문입니다.

우리가 포트 3000으로 서빙하는 건 배포모드이기 때문에 현재 그 서버가 없는 거죠.

## Rust에서 정적 파일 서빙하기

Actix-Web에서 정적 파일을 서빙하기 위해서는 Actix-files를 이용하면 됩니다.

```bash
cargo add actix-files
```

위와 같이 설치하시고 main.rs 파일을 아래와 같이 바꿔 주시면 됩니다.

```rust
mod my_scrape_lib;
use my_scrape_lib::scrape_vpn_info;

use actix_cors::Cors;
use actix_web::{get, http, App, HttpResponse, HttpServer, Responder};
use actix_files::Files;

...
...
// 중간 부분은 생략
...
...


#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("Rust Actix-web server started at 127.0.0.1:8080");

    HttpServer::new(|| {
        let cors = Cors::default()
            .allow_any_origin()
            .allowed_methods(vec!["GET", "POST"])
            .allowed_headers(vec![http::header::AUTHORIZATION, http::header::ACCEPT])
            .allowed_header(http::header::CONTENT_TYPE)
            .max_age(3600);

        App::new()
            .wrap(cors)
            .service(get_vpn_info)
            .service(healthcheck)
            .service(Files::new("/", "ui/build").index_file("index.html"))
    })
    .bind(("127.0.0.1", 8080))?
    // .bind(("0.0.0.0", 8080))?
    .run()
    .await
}
```

Actix-Web에 service 개념으로 "ui/build" 폴더를 정적 사이트로 서빙하는데 찾는 파일이 index.html이라는 겁니다.

이제, 컴파일해 볼까요?

UI 쪽은 배포 모드로 한번 빌드 했기 때문에 UI 쪽 서버는 더 이상 돌릴 필요가 없습니다.

Rust 쪽 백엔드 서버만 돌리면 되죠.

`http:/127.0.0.1:8080`으로 들어가 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEhb1DE2HPUU4axiPDDcQD9IkRvYJvMNG6Ln_mSP7REBgwBYMZFmZVZNqEOdz_SN0VESkCOjsBbQkSoqAFruWeypTPp0i-gc7qob2xOmI9ri95fULqYTPo9IXT_ZOAKZPpgYXr6w4bwxEpySsAMcIkUEWP5MluFl985PF5ZtxYmi12DqKsvkHGxE2VnITGk)

위 그림과 같이 아주 잘 작동하고 있습니다.

---

## Fly.io에 배포하기

이제 우리가 호스팅 하기로 했던 Fly.io에 배포해 보겠습니다

Fly.io에 배포하는 거는 실제 프로덕션 빌드기 때문에, 러스트에서 사용한 개발 서버 127.0.0.1을 바꿔저야 하는데요.

Fly.io에 배포되는 Docker파일에서 실제 실행되는 러스트 실행파일은 0.0.0.0 주소로 해야 됩니다.

그래야 작동이 되는데요.

main.rs 파일을 다시 바꾸겠습니다.

```rust
    // .bind(("127.0.0.1", 8080))?
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
```

위와 같이 하시면 됩니다.

그리고 `.dockerignore` 파일에 ui/build 폴더가 들어가 있으면 안 됩니다.

우리의 서버는 프론트엔드를 로컬에서 직접 빌드해서 최종 정적 파일로 만들고 그걸, 그대로 서버로 올리는 거기 때문에,

`.docerignore`에 ui/build가 들어가 있으면 ui/build 폴더가 서버에 올라가지 않게 되는 거죠.

```bash
fly deploy
```

위와 같이 실행하시면 됩니다.

```rust
➜  rust-fly-test git:(master) ✗ fly deploy
==> Verifying app config
Validating /Users/cpro95/Codings/Rust/rust-fly-test/fly.toml
Platform: machines
✓ Configuration is valid
--> Verified app config
==> Building image
Remote builder fly-builder-snowy-sun-1195 ready
==> Building image with Docker
--> docker host: 20.10.12 linux x86_64
[+] Building 78.6s (15/15) FINISHED
 => [internal] load build definition from Dockerfile                          0.9s
 => => transferring dockerfile: 651B                                          0.9s
 => [internal] load .dockerignore                                             0.9s
 => => transferring context: 94B                                              0.9s
 => [internal] load metadata for docker.io/library/rust:latest                0.5s
 => [internal] load metadata for docker.io/library/ubuntu:22.04               0.5s
 => FROM docker.io/library/rust:latest                                        0.2s
 => => resolve docker.io/library/rust:latest                                  0.2s
 => [builder 1/4] FROM docker.io/library/rust:latest@sha256:8a4ca3ca75afbc9  13.6s
 => => resolve docker.io/library/rust:latest@sha256:8a4ca3ca75afbc97bcf5362e  0.0s
 => => sha256:9f13f5a53d118643c1f1ff294867c09f224d00edca21 64.11MB / 64.11MB  1.5s
 => => sha256:e13e76ad6279c3d69aa6842a935288c7db66878ec3 210.99MB / 210.99MB  2.8s
 => => sha256:f5b255a946cc52ffae479ef24bcde1d8454459f983 190.46MB / 190.46MB  2.7s
 => => sha256:8a4ca3ca75afbc97bcf5362e9a694fe049d15734fbbaf82b8b 988B / 988B  0.0s
 => => sha256:e18a590e3b63b971a1d5f9d91c89ac7d562a9c20279f87 1.38kB / 1.38kB  0.0s
 => => sha256:2274565811a0dd1d5fc49868fcbdae074ad2f42b1207a3 6.10kB / 6.10kB  0.0s
 => => sha256:012c0b3e998c1a0c0bedcf712eaaafb188580529dd02 49.56MB / 49.56MB  1.2s
 => => sha256:00046d1e755ea94fa55a700ca9a10597e4fac7c47be1 24.03MB / 24.03MB  0.6s
 => => extracting sha256:012c0b3e998c1a0c0bedcf712eaaafb188580529dd026a04aa1  1.9s
 => => extracting sha256:00046d1e755ea94fa55a700ca9a10597e4fac7c47be19d970a3  0.4s
 => => extracting sha256:9f13f5a53d118643c1f1ff294867c09f224d00edca21f56caa7  1.6s
 => => extracting sha256:e13e76ad6279c3d69aa6842a935288c7db66878ec3b7815edd3  4.6s
 => => extracting sha256:f5b255a946cc52ffae479ef24bcde1d8454459f9832876e8b3d  3.2s
 => [stage-1 1/4] FROM docker.io/library/ubuntu:22.04@sha256:aabed3296a3d45c  0.0s
 => [internal] load build context                                            60.7s
 => => transferring context: 87.07MB                                         60.7s
 => [builder 2/4] WORKDIR /usr/src/app                                        0.1s
 => [builder 3/4] COPY . .                                                    0.7s
 => [builder 4/4] RUN --mount=type=cache,target=/usr/local/cargo,from=rust:  15.3s
 => CACHED [stage-1 2/4] RUN useradd -ms /bin/bash app                        0.0s
 => CACHED [stage-1 3/4] WORKDIR /app                                         0.0s
 => [stage-1 4/4] COPY --from=builder /usr/src/app/rust-fly-test /app/rust-f  0.0s
 => exporting to image                                                        0.1s
 => => exporting layers                                                       0.1s
 => => writing image sha256:bddb01e433aa7d67840a325310078fb2e4dd0775a42ff7f7  0.0s
 => => naming to registry.fly.io/rust-web-app-tutorial:deployment-01H9TAK66R  0.0s
--> Building image done
==> Pushing image to fly
The push refers to repository [registry.fly.io/rust-web-app-tutorial]
08f3667d177c: Pushed
abd33ec8f1b9: Layer already exists
07f5e88cb1a8: Layer already exists
dc0585a4b8b7: Layer already exists
deployment-01H9TAK66R1HK83C4C03ETF2DH: digest: sha256:12c4587aecff26f31a73c8d7acfa98ca92eedf5b70fd67fd951dbf4c16e7663c size: 1154
--> Pushing image done
image: registry.fly.io/rust-web-app-tutorial:deployment-01H9TAK66R1HK83C4C03ETF2DH
image size: 94 MB

Watch your deployment at https://fly.io/apps/rust-web-app-tutorial/monitoring

Updating existing machines in 'rust-web-app-tutorial' with rolling strategy
  [1/1] Machine 6e82775c243987 [app] update finished: success
  Finished deploying

Visit your newly deployed app at https://rust-web-app-tutorial.fly.dev/
```

deploy가 성공됐다고 나오네요.

심지어 image size는 조금 무거운 ubuntu를 썼는데도 94MB밖에 안 됩니다.

이게 바로 Rust의 장점이죠.

이제 최종 주소인 `https://rust-web-app-tutorial.fly.dev/`로 가볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEjmZm5FhrMNh5rGp_Txtbzr-hH-5unJkCYvzmMiXpJynvLSV9px8HNYTECI_a8OiZ9PBcG4a5KH2XjnkFFHOwzYlodqyJPkqO2l7TJLsDxeGj2AoP_qUCtY1Sp_aMor4mrXmCq6GW-4c4HjI02ej0jY-VshcpSun929SkzZhQbde-xXrcFysUoxAeylKwo)

그런데, 이상합니다.

위와 같이 페이지를 찾을 수 없다고 나오네요.

그러면 api/get-vpn 주소로 가볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEiXtJmxQSw49gDGQyPV3DaW5JbD6hPGsac8LIJzicQvKZZNg5jNs_8d2CE-Rw6aO_ynN4FeN-LYgz0BSnYE8WbNHWGP0mL4KM3SjEFUHPcVpJFgg6v0RXqqYWberRjiQ8dvCRzPCcwZFw01Giwomp2eBYG0XkkT7fCKUKMtnwDZ_h6hoeiw8KzZ4qhQ4NM)

우리가 만든 api/get-vpn 주소도 작동하지 않습니다.

그럼 문제를 해결해 볼까요?

먼저, Fly.io 서버에 가볼까요?

```bash
fly ssh console
```

위와 같이 명령어를 입력하면 ssh 접속으로 Fly.io의 가상 머신 즉, 우분투 도커로 원격 접속하게 됩니다.

```bash
root@6e82775c243987:/app# ls -l
total 15944
-rwxr-xr-x 1 root root 16323656 Sep  8 12:01 rust-fly-test
root@6e82775c243987:/app#
```

위와 같이 rust-fly-test라고 러스트 파일을 컴파일한 최종 파일만 있습니다.

ui/build라는 우리의 Static Site가 없네요.

당연한 얘기지만 Dockerfile에서 실행파일만 /app 폴더로 복사했고 ui/build 폴더는 복사를 하지 않았네요.

아래와 같이 dockerfile에 ui/build를 복사하는 명령어를 추가합니다.

```bash
# Get compiled binaries from builder's cargo install directory
COPY --from=builder /usr/src/app/rust-fly-test /app/rust-fly-test
COPY --from=builder /usr/src/app/ui/build /app/ui/build
```

두 번째, 에러인 SSL 관련인데요.

이건 서버문제입니다.

ssl-certificate가 없어서 우리 서버에서 원격 서버인 vpngate.net으로 접속이 안되는 거죠.

http 말고 https 통신을 위해서는 SSL 인증이 있어야 하는데요.

Fly.io는 그 인증이 있습니다.

아마 우리가 도커로 사용한 우분투 문제인 거 같네요.

Dockerfile을 다음과 같이 수정합시다.

```bash
# Runtime image
FROM ubuntu:22.04

RUN apt-get update && apt-get install -y openssl ca-certificates

```

우분투를 설정할 때 openssl과 ca-certificates 패키지를 설치하라는 뜻입니다.

이제 다시 Fly.io에 fly deploy 해볼까요?

Deploy가 에러 나면 다시 fly deploy 해보시면 됩니다.

최종적으로 성공 메시지가 나왔네요.

이제 다시 한번 우리 주소인 `https://rust-web-app-tutorial.fly.dev/`로 가볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEj6k7kakhEk7vdRxJqcRXTFg0fsNqvU2j1DoBzQZs4Bb31tmrCsF199NVFxsMfquE-CXj5038KdSMaGZS0HTzoAwnI0A2iyGl2yU4x_L4_oGspDll7eV0eQqD4Xt_8B8jhIImXvBSkyUGvisefaSksK3Z6u41mjkhX5RQ25knnXbiHt8DGS7C16FjtaT0I)

위 그림과 같이 대성공입니다.

데이터가 나오는 걸로 봐서는 api/get-vpn 라우팅도 잘 작동되고 있는 거죠.

지금까지 Rust로 웹서버 만들기를 해봤는데요.

이걸 기초로 해서 자신만의 웹 애플리케이션을 꼭 만들어 보시기 바랍니다.

그럼.
