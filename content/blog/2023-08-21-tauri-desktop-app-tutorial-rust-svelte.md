---
slug: 2023-08-21-tauri-desktop-app-tutorial-rust-svelte
title: Tauri 실전 코딩 2편 - Rust로 Sqlite3 DB 읽어오는 백엔드 로직 작성
date: 2023-08-21 06:36:04.312000+00:00
summary: 2편, 백엔드 로직을 위한 rusqlite, serde_json 설치 및 코드 작성
tags: ["tauri", "sveltejs", "rust", "desktop app", "cross platform"]
contributors: []
draft: false
---

안녕하세요?

지난 시간에 이어 Rust로 크로스플랫폼 데스크탑 앱 만들기 2편을 시작하겠습니다.

1편. [Tauri 실전 코딩 1편 - Tauri로 일렉트론JS 같은 데스크탑 앱 만들기](https://mycodings.fly.dev/blog/2023-08-20-tauri-desktop-app-cross-platform-vs-electronjs)

---

## DB 작업을 위한 패키지 설치하기

Rust에서 Sqlite3 DB를 다루는 패키지로 가장 많이 쓰이는게 바로 rusqlite인데요.

그리고 JSON 관련 패키지는 serde_json입니다.

일단 Cargo.toml 파일이 있는 src-tauri 폴더로 가서 차례대로 패키지를 설치합시다.

```bash
cd src-tauri
cargo add serde --features=derive
cargo add serde_json
cargo add rusqlite --features=serde_json --features=bundled
```

---

## Sqlite3 DB 파일 준비하기

테스트를 위해 sqlite3 DB 파일을 준비해야 하는데요.

저는 KODI라는 동영상 관린 프로그램이 만든 DB 파일인 "MyVideos116.db" 파일을 사용할겁니다.

본인한테 있는 sqlite3 DB 파일이면 다 되니까요 참고바랍니다.

일단 "MyVideos116.db" 파일을 src-tauri 폴더로 복사해 놓습니다.

---

## tauri command 손보기

지난 시간에 잠깐 맛 봤던 tauri command가 2개 있었습니다.

greet, hello가 그건데요.

일단 hello란 함수를 get_count라는 이름으로 바꾸고,

greet란 함수를 search라는 이름으로 바꿉시다.

그러면, main함수에 있는 tauri Builder에 있는 이름도 바꿔줘야 합니다.

```rust
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![search, get_count])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

그리고, Svelte 코드로 돌아가서 Search.svelte 파일에 있는 관련 내용도 바꿔야 합니다.

```js
<script lang="ts">
  import { invoke } from "@tauri-apps/api/tauri";
  import { onMount } from "svelte";

  let query = "";
  let returnMsg: [string] = [""];
  let countMsg: string = "";

  onMount(async () => {
    countMsg = await invoke("get_count", {});
  });

  async function search() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    let result: string = await invoke("search", { query: query });
    if (result !== "Error") {
      returnMsg = await JSON.parse(result);
    }
  }
</script>
```

Svelte 코드를 보시면 invoke를 두 번 했는데요.

첫번재는 onMount 훅을 이용해서 Svelte 컴포넌트가 마운트 될 때 자동으로 하게끔 했습니다.

get_count는 DB에 있는 총 데이터 개수를 구하는 로직입니다.

그걸 countMsg라는 변수에 저장했고요.

두번째, search invoke에서는 query라는 값으로 전달하고 다시 그걸 result로 받아서 JSON 파싱해서 returnMsg라는 스트링 배열로 받습니다.

일단 여기까지 해놓고 다시 Rust 코드로 넘어가 보겠습니다.

---

## get_count 함수 구현하기

rusqlite 패키지로 DB에서 COUNT 정보를 얻어오는 로직을 구현해야 합니다.

```rust
#[tauri::command]
fn get_count() -> String {
    let result = get_sqlite_count();
    match result {
        Ok(count) => count.to_string(),
        Err(_) => "Error".to_string(),
    }
}
```

일단 tauri command는 위와 같이 get_sqlite_count라는 함수를 호출하고, 그 결과를 String 타입으로 전달해 주면 끝입니다.

COUNT인데 왜 String으로 전달했냐면요.

인터넷의 모든 Request나 Response가 모두 문자열로 이루어지는 거 아시죠.

그래서 문자열로 전달하는게 가장 쉽습니다.

UI 부분에서는 계산을 하는게 아니라 화면에 그냥 보여주면 되기 때문에 number 타입으로 줄 필요가 없는거죠.

자, 이제 get_sqlite_count 함수를 구현해 볼까요?

```rust
use rusqlite::{params, Connection};

fn get_sqlite_count() -> Result<usize, Box<dyn std::error::Error>> {
    let conn = Connection::open("MyVideos116.db")?;
    let mut stmt = conn.prepare("SELECT COUNT(c00) from movie_view")?;
    let mut rows = stmt.query_map([], |row| row.get(0))?;

    let first_result = rows.next();
    let count = match first_result {
        Some(result) => result.unwrap_or(0),
        None => 0,
    };

    Ok(count)
}
```

rusqlite 패키지는 무조건 Result를 리턴해야 하거든요.

그래서 get_sqlite_count 함수도 Result를 리턴하게 끔 설계했습니다. 

코드를 잠깐 보시면 Connection::open으로 DB 파일을 오픈하고,

그리고 우리가 원하는 SQL 문장인 stmt(statement)를 준비한 다음 query_map을 이용해서 데이터를 얻습니다.

여기서 우리가 COUNT를 가져오기 때문에 숫자입니다.

그래서 rows.next()와 match 문법으로 값을 count라는 변수에 넣어주고 최종적으로 Ok(count)라고 리턴 해 줍니다.

그러면 다시 get_count라는 tauri command를 보시면, count 값을 String으로 변환해서 리턴 해 줍니다.

```rust
#[tauri::command]
fn get_count() -> String {
    let result = get_sqlite_count();
    match result {
        Ok(count) => count.to_string(),
        Err(_) => "Error".to_string(),
    }
}
```
그리고 잘못 된 경우 문자열로 "Error"이라고 명시적으로 리턴했습니다.

나중에 Svelte에서 "Error"에 대한 처리를 해주면 됩니다.

이제 테스트 해볼가요?

Search.svelte 코드에서 countMsg라는 변수를 아래 위치에 넣어둡니다.

```js
<script lang="ts">
  import { invoke } from "@tauri-apps/api/tauri";
  import { onMount } from "svelte";
  ...
  ...
  let countMsg: string = "";

  onMount(async () => {
    countMsg = await invoke("get_count", {});
  });

 ...
 ...
</script>

<section class="w-full space-y-4">
  <p class="li-style">Total : {countMsg}</p>
  ...
  ...
<section>
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEjgF_ZEot8dCytVIfhv5sFBqLz6avmPwvate465bjFONy3-wocPdTfAsEhpxVsgX66rbi6mViyYxKzoMCfI8WyrFaPG3cJWcA6DGJUlVgewrTrGaZ68-V9oKXX3SkWrEOdgVIA3fDMGDrs_3e1IFWD4t1E6qQdVQrVShHyw6Y9pAbwljsK10XDlCvuRlPI)

실행 결과는 위와 같이 성공적입니다.

---

## search 버튼에 대한 벡엔드 로직 구현하기

이제 남은 건 search 버튼에 입력된 텍스트에 따라 DB에서 값을 검색하는 로직을 구현해야 하는데요.

일단 Svelte 쪽 UI 코드 전부를 적어 보겠습니다.

```js
<script lang="ts">
  import { invoke } from "@tauri-apps/api/tauri";
  import { onMount } from "svelte";

  let query = "";
  let returnMsg: [string] = [""];
  let countMsg: string = "";

  onMount(async () => {
    countMsg = await invoke("get_count", {});
  });

  async function search() {
    let result: string = await invoke("search", { query: query });
    if (result !== "Error") {
      returnMsg = await JSON.parse(result);
    }
  }
</script>

<section class="w-full space-y-4">
  <p class="li-style">Total : {countMsg}</p>
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
        bind:value={query}
        required
      />
      <button type="submit" on:click|preventDefault={search} class="css-button"
        >Search</button
      >
    </div>
  </form>

  {#if returnMsg[0] !== ""}
    <ul class="ul-style">
      {#each returnMsg as result}
        <li class="li-style">{result}</li>
      {/each}
    </ul>
  {/if}
</section>

<style lang="postcss">
...
...
...
</style>
```

style 부분은 지난 시간과 동일해서 생략했습니다.

UI 로직은 아주 간단합니다.

returnMsg 라는 스트링 배열에 값을 받아와서 그냥 화면에 `ul>li` 방식으로 뿌려주는 겁니다.

---

## search 커맨드 작성

이제, 러스트쪽 tauri command 부분을 손보겠습니다.

지난 시간에 greet란 이름의 함수였는데요.

이 이름을 search라고 바꾸고 아래처럼 입력합니다.

```rust
#[tauri::command]
fn search(query: &str) -> String {
    let results = get_sqlite_search(query);
    match results {
        Ok(result) => {
            let json_strings = serde_json::to_string(&result);
            match json_strings {
                Ok(json_string) => {
                    if json_string.is_empty() {
                        "No Results".to_string()
                    } else {
                        json_string
                    }
                }
                Err(_) => "Error".to_string(),
            }
        }
        Err(_) => "Error".to_string(),
    }
}
```

search 함수도 이론적으로는 get_count 함수와 비슷합니다.

get_sqlite_search 함수를 실행해서 그 결과 값을 JSON 형태로 리턴 해 주면 됩니다.

match 부분을 잘 보시면 첫 번째 match는 get_sqlite_search 리턴에 대한 match 부분이고,

두 번째 match는 serde_json의 결과에 대한 match입니다.

그래서 값이 없으면 "No Results"를 리턴하게 끔 설계했습니다.

그리고 에러인 경우 "Error"라고 리턴하고요.

이제, get_sqlite_search 함수를 설계해 봅시다.

```rust
fn get_sqlite_search(query: &str) -> Result<Vec<String>, Box<dyn std::error::Error>> {
    let conn = Connection::open("MyVideos116.db")?;

    let query_param = format!("%{}%", query);
    let mut stmt = conn.prepare("SELECT c00 FROM movie_view WHERE c00 LIKE ?")?;
    let rows = stmt.query_map(params![query_param], |row| Ok(row.get(0)?))?;

    let mut results = Vec::new();
    for row in rows {
        results.push(row?);
    }

    if results.is_empty() {
        Err("No Results".into())
    } else {
        // println!("{:?}", results);
        Ok(results)
    }
}
```

get_sqlite_search 함수는 리턴 타입이 조금 복잡한데요.

rusqlite 패키지를 쓰기 때문에 무조건 Result를 리턴해야 하고, 성공했을 때는 String의 벡터를 리턴할 겁니다.

왜냐하면 결과 값이 여러 가지기 때문입니다.

get_sqlite_count 함수와 마찬가지로 Connection을 구한 다음, stmt를 만들고, 마지막으로 query_map으로 실행하면 됩니다.

여기서, params! 라는 매크로를 썼는데요.

SQL에서 특정 문자열이 포함 되는 가를 표현할 때 '%'를 씁니다.

"%{}%" 라고 쓴 거는 앞 뒤로 %를 써서 검색 query가 어디에 있듯 query가 포함된 모든 자료를 찾을 수 있습니다.

이제 실행 결과를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEgDQXSiVjGrCavJ1bIZ3xFsld7GT_p1q8dnmuBCBDf5Iu1F0Tad0p_FRv3t_WRlYe4pjB7_7rMOvpL3YnpPFbnTh2CDcQ0_sa5x2JlIibloKXkQPTH88W-TgTNjtvC5gbTw-ayNVde9CH69QKnZ93tyRSdufAmlQibHhWgfPwYrMcmztVchBMhujHCMGNE)

어떤가요?

깔끔한 디자인으로 검색결과가 잘 나오고 있습니다.

Rust에서 Svelte로 넘겨준 검색결과는 처음에는 문자열 벡터였는데, 그걸 serde_json으로 아주 긴 문자열로 변환했고,

다시 Svelte 코드의  search 함수에서 아래와 같이 JSON 파싱했습니다.

```js
async function search() {
    let result: string = await invoke("search", { query: query });
    if (result !== "Error") {
      returnMsg = await JSON.parse(result);
    }
  }
```

이렇듯 러스트에서 넘겨주는 거는 모두 문자열로 넘겨주면 자바스크립트 쪽에서 편하게 화면에 보여줄 수 있기 때문에 되도록이면 문자열로 리턴하게 끔 tauri command를 설계하시기 바랍니다.

---

## release 버전 빌드하기

이제 코드도 완성했으니까 production release 버전을 빌드해야겠죠.

```bash
npm run tauri build
```

위와 같이 입력하면 tauri가 알아서 release 버전을 빌드합니다.

```bash
➜  macos> pwd
/Users/cpro95/Codings/Rust/tauri-test/src-tauri/target/release/bundle/macos
➜  macos> ls -l
total 0
drwxr-xr-x  3 cpro95  staff  96  8 21 16:40 tauri-test.app
➜  macos
```

이제 위에 있는 release 버전을 실행해 볼까요?

아래 그림처럼 Error가 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjCdJu0J9wnqcalgyIRy9CrcIj6e8rrj4schrW8cxLm8j0qzyEgNShK36in4tiJs7jkpSBRE0hn2g-yMLqQCojv-cIr2TmtUIP-8jyYLITQuqdNjDx1aeipzrNgeUHOaba0QbW0kfNzgBCI9ICLWGj6jlu3EzSdyYWVi1nJTKaAZXMwSS4e372DHz5GUCU)

왜 그런걸까요?

바로 "MyVideos116.db" 파일이 없기 때문입니다.

그러면 "MyVideos116.db" 파일을 어디에 놓아야 할까요?

아주 복잡한데요.

그래서 tauri에서는 외부 리소스 bundle이라는 개념을 도입했습니다.

아예 외부 리소스라고 명시한 파일은 빌드 시 함께 묶어 빌드할 수 있게 말입니다.

일단 src-tauri 폴더에서 tauri.conf.json 파일을 열어서 수정하도록 하겠습니다.

```json
    "bundle": {
      "active": true,
      "targets": "all",
      "identifier": "com.cpro95",
      "icon": [
        "icons/32x32.png",
        "icons/128x128.png",
        "icons/128x128@2x.png",
        "icons/icon.icns",
        "icons/icon.ico"
      ],
      "resources": ["assets/*"]
    },
```

resoureces 라는 부분만 추가했는데요.

"assets 폴더 밑에 있는 모든 파일을 리소스라고 등록하는 겁니다.

이제 src-tauri 폴더 밑에 assets 폴더를 만들고 그 밑에 "MyVideos116.db" 파일을 옮기도록 하겠습니다.

Tauri의 리소스 폴더의 위치를 지정했습니다.

이제 코드에서 이 부분을 반영해야 하는데요.

Tauri에서 리소스 부분을 핸들링하는 방법은 공식 문서에 나와 있듯이 tauri::Builder를 이용한 방법과, 그리고 tauri::AppHandle을 이용하는 방법입니다.

저는 tauri::AppHandle을 이용해 보겠습니다.

---

## 러스트 코드에 리소스 폴더 처리 로직 추가

일단 main.rs파일에 PathBuf를 추가합니다.

```rust
use rusqlite::{params, Connection};
use std::path::PathBuf;
```

그리고 먼저, get_count()라는 tauri command를 손보겠습니다.

```rust
#[tauri::command]
fn get_count(handle: tauri::AppHandle) -> String {
    let resource_path: PathBuf = handle
        .path_resolver()
        .resolve_resource("assets/MyVideos116.db")
        .expect("failed to resolve resources.");

    let result = get_sqlite_count(resource_path);
    match result {
        Ok(count) => count.to_string(),
        Err(_) => "Error".to_string(),
    }
}
```

handle이라는 tauri::AppHandle을 불러와서 resolve_resource 메서드로 원하는 파일의 PathBuf를 구하는 코드입니다.

그리고 이걸 다시 get_sqlite_count(resource_path) 방식으로 넘깁니다.

이제 get_sqlite_count() 함수를 고치도록 하겠습니다.

```rust
fn get_sqlite_count(resource_path: PathBuf) -> Result<usize, Box<dyn std::error::Error>> {
    let conn = Connection::open(&resource_path)?;
...
...
...
}
```

위와 같이 고치면 됩니다.

두 번째로 search tauri command도 바꾸겠습니다.

```rust
#[tauri::command]
fn search(query: &str, handle: tauri::AppHandle) -> String {
    let resource_path = handle
        .path_resolver()
        .resolve_resource("assets/MyVideos116.db")
        .expect("failed to resolve resource");

    let results = get_sqlite_search(query, resource_path);
    match results {
    ...
    ...
    ...
    ...
}
```

이제, 다시 get_sqlite_search 함수도 바꾸겠습니다.

```rust
fn get_sqlite_search(
    query: &str,
    resource_path: PathBuf,
) -> Result<Vec<String>, Box<dyn std::error::Error>> {
    let conn = Connection::open(&resource_path)?;

    ...
    ...
    ...
    ...
}
```

이제 마무리되었네요.

다시 한번 빌드를 해보겠습니다.

```bash
npm run tauri build
```

이제 빌드된 앱이 위치한 폴더로 가서 Finder로 보겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEg6Yjzqh4TKw2A8gTzDEZJEs-7mucL_paVmFh7f2ZxIx4eoexSVwuQMQxy8_ZucjiIaf7ifRPKqs4fAF8DpzWQvq3oF16s-EUSR1y51I28ylDuTbl_j5LCiN0v66s3dTwNg-JoxThUPk1MzI046V4mIeEXxWmGCg4KAM31V0nc-8nEvnM4fAyVGnA7lC7k)

위 그림과 같이 패키지 내용 보기로 들어가면 아래와 같이 나올 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhDwBrKl8rDkx6VOYopod7NeAG39IxWVA0EjDIewtz0jflnGKRjd6k9fKW8KeE3dqZ1C7NRI5NcQe50mg3iFIYtv40l4ccoGx5nM062HpWFdw2BqUxd7yE4l-kc2qW6xhyiQruHlpH-EJgtAxYnqDXHHko1tux7m70mAG1A37oS7NH4vp_wC0LOE31C5SY)

위와 같이 Contents 폴더 밑에 Resources 폴더 밑에 assets 폴더 밑에 MyVideos116.db 파일이 보입니다.

우리가 Tauri에서 bundle 세팅에서 assets 폴더를 등록했기 때문에 Tauri가 빌드할 때 같이 번들링 하는 겁니다.

실제 실행도 아주 잘 됩니다.

---

지금까지 2편에 걸쳐 Tauri를 이용한 크로스 플랫폼 데스크탑 앱 만들기에 도전해 봤는데요.

제가 느낀 점은 일렉트론JS 보다 뭔가 가볍고 빠르다는 느낌을 지울 수가 없었습니다.

여러분도 꼭 활용해 보시길 바랍니다.

끝.

