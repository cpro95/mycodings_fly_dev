---
slug: 2023-08-20-tauri-desktop-app-cross-platform-vs-electronjs
title: Tauri 실전 코딩 1편 - Tauri로 일렉트론JS 같은 데스크탑 앱 만들기
date: 2023-08-20 08:50:44.703000+00:00
summary: 1편. Tauri 설치 및 컴파일 그리고 일렉트론JS와 비교
tags: ["rust", "tauri", "sveltejs", "desktop app", "cross platform", "electronjs"]
contributors: []
draft: false
---

안녕하세요?

저는 항상 데스크탑 앱 개발에 있어 크로스 플랫폼을 가장 우선순위에 두는데요.

해킨토시에서 개발하고 집안 메인 컴퓨터인 윈도우 머신에서 돌릴 수 있는 완벽한 크로스 플랫폼 앱을 생각해 보면 단연코 일렉트론JS를 이용한 앱 개발이라고 생각합니다.

그런데, 사실 일렉트론JS 자체가 크롬을 얹어 놓은 거라 상당히 무겁습니다.

그러고 사실 느리고요.

그런 와중에 러스트 진영에 있던 Tauri를 예전부터 주시했었는데요.

오늘은 Tauri를 이용한 실전 예제를 몇 편에 걸쳐 진행해 볼까 합니다.

단순히 설치만 하고, UI만 보여주려면 실전 강의가 필요 없죠.

러스트로 백엔드 로직을 만들고 그걸 UI로 연결해 주는 게 크로스 플랫폼 앱 개발에 있어 가장 중요하다고 생각합니다.

---

## Tauri 템플릿 설치

```bash
➜  Rust> npm create tauri-app@latest tauri-test
✔ Choose which language to use for your frontend · TypeScript / JavaScript - (pnpm, yarn, npm)
✔ Choose your package manager · npm
✔ Choose your UI template · Svelte - (https://svelte.dev/)
✔ Choose your UI flavor · TypeScript

Template created! To get started run:
  cd tauri-test
  npm install
  npm run tauri dev
➜  Rust>
```

Tauri와 Svelte 조합은 최고라고 생각하는데요.

Svelte의 특성이 일반 자바스크립트로 컴파일해 주는 UI Framework이라 가장 바닐라 자바스크립트와 같은 속도를 자랑합니다.

그런 면에서 Svelte를 택했습니다.

물론, React나 Vue도 선택할 수 있고요.

UI 부분이야 편한 거 선택하시면 됩니다.

가장 중요한 백엔드 로직과 UI 부분으로의 커뮤니케이션이 중요하니까요?

---

## Tauri 실행해 보기

Tauri 앱을 보시면 전체적으로 npm package 같습니다.

그래서 npm 명령어로 쉽게 시작할 수 있는데요.

```bash
➜  Rust> cd tauri-test
➜  tauri-test> npm i

added 99 packages, and audited 100 packages in 23s

12 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
➜  tauri-test> npm run tauri dev

> tauri-test@0.0.0 tauri
> tauri dev

     Running BeforeDevCommand (`npm run dev`)

> tauri-test@0.0.0 dev
> vite

        Warn Waiting for your frontend dev server to start on http://localhost:1420/...
Forced re-optimization of dependencies

  VITE v4.4.9  ready in 1434 ms

  ➜  Local:   http://127.0.0.1:1420/
  ➜  Network: use --host to expose
        Info Watching /Users/cpro95/Codings/Rust/tauri-test/src-tauri for changes...
    Updating crates.io index
    ...
    ...

```

위와 같이 npm install 실행시켜 주고, 그러고 나서 npm run tauri dev 명령어를 실행시켜 주면 되는데요.

npm run tauri는 package.json에서 보시면 그냥 tauri라고 되어 있습니다.

이 tauri 명령어에 dev도 있고 build도 있고 여러 가지 명령어를 입력할 수 있는 겁니다.

맨 처음 tauri 컴파일이 시간이 조금 걸리는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgss8XUVAq4f2SQvFMkvydsVul8S5-vMQJOUEnSoViFPtMb-wuerAZxs-1VibvFsP8jvcrzYemZIt5qyuLbnV2FmhsrhJfwUodS5LmPi_g9vol7N4I0qWzbRhzkYSWcKgMdAVqxKAq1CoB5TDGG1qltAOlIqNwd9q4ROD1irKhrLIz6Zd6bumEjAQBZazk)

위와 같이 실행 창이 뜹니다.

그러고 Input 태그에 Test라고 입력하고 Greet 버튼을 누르면 밑에 텍스트가 보이는데요.

이 부분이 Rust와 자바스크립트 간 커뮤니케이션에 의해 실행되는 코드인 겁니다.

---

## UI를 위해 TailwindCSS 설치하기

Svelte에서는 아래와 같이 간단히 설치 가능합니다.

```bash
➜  tauri-test> npx svelte-add@latest add tailwindcss

Need to install the following packages:
  svelte-add@2023.8.20-0.0
Ok to proceed? (y) y
➕ Svelte Add (Version 2023.08.200.00)
The project directory you're giving to this command cannot be determined to be guaranteed fresh — ma
ybe it is, maybe it isn't. If any issues arise after running this command, please try again, making sure you've run it on a freshly initialized SvelteKit or Vite–Svelte app template.
PostCSS
 ✅ successfully set up and repaired (it looks like it was in a broken setup before this command was
 run)!                                                                                              Create or find an existing issue at https://github.com/svelte-add/svelte-add/issues if this is wrong
.
Tailwind CSS
 ✅ successfully set up!
Create or find an existing issue at https://github.com/svelte-add/svelte-add/issues if this is wrong
.
Run npm install to install new dependencies, and then reload your IDE before starting your app.

tauri-test> npm install
```

이제 npm install 한 번만 더 해주면 됩니다. 꼭 해줘야 합니다.

그러면 tailwind.config.cjs 파일도 보일 거고, postcss.config.cjs 파일도 보일 거고, src 폴더 밑에 app.postcss 파일도 보일 겁니다.

Svelte에서 TailwindCSS를 사용할 준비가 완벽히 되었네요.

styles.css 파일은 필요 없으니까 지우도록 합시다.

그러고 main.ts 파일에서 styles.css 파일을 import 하는 문구도 삭제합시다.

src/public 폴더에 있는 svg 파일들도 지워주면 됩니다.

이 src/public 폴더에는 UI 부분에서 필요한 이미지나 기타 자료를 넣으면 됩니다.

그러고 App.svelte 파일을 아래와 같이 수정하겠습니다.

```js
<script lang="ts">
  import Search from "./lib/Search.svelte";
</script>

<main class="min-w-[320] flex flex-col mx-auto items-center justify-center p-8">
  <h1 class="font-bold text-4xl">Welcome to My Search App with Tauri!</h1>

  <div class="w-full flex flex-col items-center justify-center py-4">
    <Search />
  </div>
</main>
```

그러고 src/lib/Greet.svelte 파일도 Search.svelte 파일로 이름을 바꿔 줍시다.

Search.svelte 파일도 아래와 같이 바꿔줍시다.

```js
<script lang="ts">
  import { invoke } from "@tauri-apps/api/tauri";

  let name = "";
  let greetMsg = "";

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    greetMsg = await invoke("greet", { name });
  }
</script>

<section class="w-full space-y-4">
  <form>
    <label
      for="default-search"
      class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
      >Search</label
    >
    <div class="relative">
      <div
        class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
      >
        <svg
          class="w-4 h-4 text-gray-500 dark:text-gray-400"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
        </svg>
      </div>
      <input
        type="search"
        id="default-search"
        class="css-input"
        placeholder="Search..."
        bind:value={name}
        required
      />
      <button type="submit" on:click|preventDefault={greet} class="css-button"
        >Search</button
      >
    </div>
  </form>

  <p class="li-style">{greetMsg}</p>
</section>

<style lang="postcss">
  .css-input {
    @apply block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500;
  }
  .css-button {
    @apply text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800;
  }
  .ul-style {
    @apply w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white;
  }
  .li-style {
    @apply w-full px-4 py-2 border-b border-gray-200 rounded-t-lg dark:border-gray-600;
  }
</style>
```

UI는 FlowBite에서 가져왔습니다.

다시 npm run tauri dev라고 실행해서 개발 창을 돌려봅니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgR9L-CfW-CLN1Q8kOlnl3jinlpQL4MMrVlay-KBMt24H-_4vltmPOxbCK0UdMT-cU_Fcr4o45RqKsLN7zVkqAM5Sl98pPlZbAVHFOYd3ya1bwLqf8OfbeOjV0LCY6_04J1fLNXcGrY3zv0HFN1mTuzr6xwbcEsq7vR6Gn4Y-Bn0biXUVdVnNkBXl3uOTc)

위와 같이 아주 깔끔한 UI가 나왔네요.

---

## Tauri Source 파일 살펴보기

Tauri Source 파일은 src-tauri 폴더에 있는데요.

여기서 main.rs 파일을 살펴 볼까요?

```rust
// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

main 함수에서 tauri Builder를 이용해서 greet 함수를 UI 부분과 연결해 주고 있습니다.

여기서 greet 함수가 바로 tauri command라는 함수인데요.

이 tauri command 함수는 tauri::generate_handler 매크로를 이용해서 등록시키면 자바스크립트에서 호출할 수 있게 됩니다.

자바스크립트에서 호출하는 부분은 아까 Search.svelte 파일에 있는 invoke 함수에 의해서인데요.

테스트를 위해 tauri command 함수를 하나 더 만들어 볼 가요?

```rust
// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn hello(name: &str) -> String {
    format!("안녕하세요?, {}!", name)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet,hello])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

위에서 볼 수 있듯이 hello 라는 tauri command를 만들었으면 invoke_handler(tauri::generate_handler![greet,hello])처럼 generate_handler 에 등록시켜줘야 합니다.

그럼, Svelte 코드에서 hello 함수를 invoke하는 부분을 추가해 볼까요?

```js
<script lang="ts">
  import { invoke } from "@tauri-apps/api/tauri";

  let name = "";
  let greetMsg = "";
  let helloMsg = "";

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    greetMsg = await invoke("greet", { name });
    helloMsg = await invoke("hello", { name });
  }
</script>

<section class="w-full space-y-4">
...
...
...

  <p class="li-style">{greetMsg}</p>
  <p class="li-style">{helloMsg}</p>
</section>
```

여기서 invoke에 첫 번째는 Tauri command 이름이고요.

두 번째가 InvokeArgs 라고 아규먼트라고 하는데요.

객체입니다. 그래서 실제 아래와 같은 형식으로 쓰면 됩니다.

```js
{
  name: name,
  email: "test@test.com"
}
```
위에서 name: name 부분은 ES6 규칙에 의해 그냥 name이라고 써도 됩니다.

그래서 예제 코드에서는 name이라고 쓴 거죠.



위와 같이 간단한 테스트로 UI에 추가해 봤습니다.

실행 결과를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEid3K_M8vzZb9OXPGHIOXhsq3qU-_7PWtSkb8c5UidDjFlvlwCdYiQjjICSrVHqIN58teDG-SBooZfymnJWmSuENuDuK3Bdd03IHFFF8gY8iPcRtVOuTqTDSLL4rzh5qstCTdGPWQKXR__gAjvQE6XHFc4cW3FlAPHpLdBCYMq6mgfrrSQSs5u33_OnCH8)

위와 같이 UI 부분도 반영되었네요.

어떤가요? 아주 간단하죠.

---

## Tauri 앱 빌드

데스크탑 앱은 컴파일해야 하는데요.

당연히 Tauri가 이것도 편하게 지원해 줍니다.

저 같은 경우는 해킨토시라서 MacOS로 빌드 될 겁니다.

```bash
npm run tauri build
```

이렇게 build 명령어를 입력하면 release 버전을 빌드합니다.

개발 서버를 끄고 한번 싫행해 봅시다.

```bash
➜  tauri-test> npm run tauri build

> tauri-test@0.0.0 tauri
> tauri build

       Error You must change the bundle identifier in `tauri.conf.json > tauri > bundle > identifier`. The default value `com.tauri.dev` is not allowed as it must be unique across applications.
➜  tauri-test>
```

위와 같이 에러가 나오는데요.

MacOS라서 그런겁니다.ㅓ

identifier 를 바꿔야 합니다.

src-tauri 폴더에서 tauri.conf.json 파일을 열어서, 아래와 같이 바꿔주면 됩니다.

```js
"bundle": {
      "active": true,
      "targets": "all",
      // "identifier": "com.tauri.dev",
      // com.tauri.dev라는 identifier는 에약된 거라 본인의 것으로 바꾸면 됩니다.
      "identifier": "com.cpro95",
      "icon": [
        "icons/32x32.png",
        "icons/128x128.png",
        "icons/128x128@2x.png",
        "icons/icon.icns",
        "icons/icon.ico"
      ]
    },
```

다시 build 를 실행해 보면 러스트 컴파일이 되면서 시간이 오래 걸리는데요.

잘 보시면 맨 처음 Svelte 코드가 컴파일되는 것도 볼 수 있을 겁니다.

컴파일이 완료되면 아래 폴더로 가서 확인하시면 됩니다.

rc-tauri/target/release/bundle 

```bash
➜  bundl>e ls -l
total 0
drwxr-xr-x  6 cpro95  staff  192  8 20 18:51 dmg
drwxr-xr-x  3 cpro95  staff   96  8 20 18:51 macos
➜  bundle> 
```

친절하게도 dmg 파일도 제공해 줍니다.

그리고 macos 폴더로 가시면 앱이 보일 겁니다.

```bash
➜  macos> ls -l
total 0
drwxr-xr-x  3 cpro95  staff  96  8 20 18:50 tauri-test.app
➜  macos> open .
```

맥의 Finder에서 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEh__baW7GsGP-TjYJcvaOmtqkND3nutfMfmfjqzpoDixVd3ja9Knvu1ebp0VBmbUxDlNoKc7YWs6r3QVI4h_Xf-w0SYRgUtIMg2XYzJ72AtS4AmDNJEG5RFpn3H27c-Ctqs8BDYBlPBb3tZj3K9lndcmry8spi0C4RlRB53xUK0xqrNNXidiRdAm8rvPcI)


6.4MB 밖에 안 합니다.

대단하네요.

일렉트론에 비해 엄청 작은 바이너리 파일 크기입니다.

이에 왜 가능하냐면요.

Tauri는 시스템에 기본 장착된 WebView를 UI로 사용하기 때문입니다.

윈도우는 Edge WebView를 사용합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEionYy43Jdbatj1R7k0xmI4KRpi-VnOGf_xtGPlPy8G2TdBiJBzwJF4JFlsdIXLON5JavDqAdEx2bfflOvw-Vkbj49gvv9O78DEKe0g6WmNCUsz3kVt2D3KwNHN4r4J2Rct0mr8LTTkRgE0G_SMn7SFEiobXsrv6jAQvtDYLVu98ttWt3If89yUnsac1zk)

위 그림은 인터넷에서 찾은 일렉트론JS와의 비교표입니다.

확실히 Tauri가 이점이 많은데요.

단지, Rust 언어가 어렵다는 것만 단점이 될 거 같습니다.

---

다음 시간에는 Sqlite3를 이용한 DB Viewer를 만들어 볼 건데요.

실제 UI 상에서 sqlite3를 이용할 수 없으니까요.

sqlite3 wasm을 이용할 수 있지만 너무 복잡하니까요.

또한, 이런 작업은 백엔드에서 처리해야 합니다.

그리고 백엔드에서 러스트로 처리하니까 속도도 엄청 빠르고요.

그럼.

