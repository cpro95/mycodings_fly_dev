---
slug: 2023-08-28-tauri-dialog-open-read-local-file
title: Tauri 실전 코딩 3편 - Tauri에서 dialog open 함수로 로컬 파일 읽기
date: 2023-08-28 09:14:28.915000+00:00
summary: 3편, 자바스크립트에서 tauri/api/dialog의 open 함수 사용
tags: ["tauri", "sveltejs", "rust", "desktop app", "cross platform", "dialog open"]
contributors: []
draft: false
---

안녕하세요?

오늘은 다시 Rust로 만드는 크로스 플랫폼 데스크탑 앱 관련입니다.

지난번에는 UI는 SvelteJS로 꾸몄고, 백 엔드는 Rust로 sqlite3 DB 파일을 읽는 앱을 만들었는데요.

지난 강좌 링크는 아래와 같습니다.

1편. [Tauri 실전 코딩 1편 - Tauri로 일렉트론JS 같은 데스크탑 앱 만들기](https://mycodings.fly.dev/blog/2023-08-20-tauri-desktop-app-cross-platform-vs-electronjs)

2편. [Tauri 실전 코딩 2편 - Rust로 Sqlite3 DB 읽어오는 백엔드 로직 작성](https://mycodings.fly.dev/blog/2023-08-21-tauri-desktop-app-tutorial-rust-svelte)

---

오늘은 Tauri가 자바스크립트로 제공해 주는 open dialog에 대해 알아보겠습니다.

데스크탑 앱은 기본적으로 로컬 파일에 대한 접근을 보장해 줘야 하는데요.

백 엔드 쪽은 단순하게 std::fs 모듈을 사용하면 됩니다.

그러면 프론트 엔드 쪽은 Tauri에서는 어떻게 로컬 파일에 접근하게 할까요?

Tauri는 dialog 모듈을 이용해서 open 함수를 제공해 줍니다.

먼저, 지금까지 만들었던 코드에서 UI 부분을 바꿔 보겠습니다.

src/lib 폴더에 Setting.svelte 파일을 추가하겠습니다.

```js
<script lang="ts">
  import { invoke } from "@tauri-apps/api";
  import { onMount } from "svelte";
  import { open } from "@tauri-apps/api/dialog";
  let db_file_path = "/MyVideos116.db";

  onMount(async () => {
    db_file_path = await invoke("read_config_file", {});
    // console.log(db_file_path);
  });

  const svelte_save_config_file = async () => {
    try {
      const response = await open({
        multiple: false,
        defaultPath: "./",
      });
      if (!response) return;
      db_file_path = response as string;

      // Tauri Docs said,
      // Arguments should be passed as a JSON object with camelCase keys:
      await invoke("save_config_file", { dbFilePath: db_file_path });
    } catch (e) {
      console.log(e);
    }
  };
</script>

<section class="w-full space-y-4">
  <div class="flex gap-x-2 pb-4 items-center">
    <button class="css-button" on:click={svelte_save_config_file}
      >Select DB</button
    >
    <p class="text-sm text-blue-500">{db_file_path}</p>
  </div>
</section>

<style lang="postcss">
  .css-button {
    @apply text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700;
  }
</style>
```

그리고 Setting.svelte파일을 App.svelte화면에 아래와 같이 추가합시다.

```js
<script lang="ts">
  import Search from "./lib/Search.svelte";
  import Setting from "./lib/Setting.svelte";
</script>

<main class="min-w-[320] flex flex-col mx-auto items-center justify-center p-8">
  <h1 class="font-bold text-4xl">Welcome to My Search App with Tauri!</h1>

  <div class="w-full flex flex-col items-center justify-center py-4">
    <Setting />
    <Search />
  </div>
</main>
```

UI에서 로컬 파일에 접근하려면 tauri api 모듈에서 제공하는 open 이라는 명령어를 사용하면 되는데요.

```js
import { open } from '@tauri-apps/api/dialog'
```

위와 같이 open을 불러오면 됩니다.

저는 Setting 컴포넌트의 구조를 onMount를 이용해서 먼저, config 파일을 처음 읽어와서 그 안에 있는 DB 파일의 위치를 러스트에서 사용하고, 그리고 UI로 만든 Select DB 버튼을 누르면 로컬 파일을 직접 골라 config 파일에 DB 파일의 위치를 저장하는 구조로 코딩했습니다.

그래서 onMount 함수를 보시면 "read_config_file"이란 tauri command를 invoke해서 db_file_path의 정보를 업데이트합니다.

Svelte에서는 모든 변수가 리액티브하기 때문에 db_file_path는 아래 코드에 의해 State가 변하게 되고 그래서 UI가 자연스럽게 업데이트됩니다.

```js
db_file_path = ~~~~~~~~
```

즉, SvelteJS에서는 변수가 왼쪽에 쓰이게 되면 State가 변했다고 보는 겁니다.

React에서 쓰는 useState 훅 같은 게 필요 없는 거죠.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjtGYbnD6-mdWDk0nLp_sVSMP7WZtadGFlNeUOzVHQvbBTxFgOHhq2gBIeRDMOcfert7a1LohNycDZEStzNpzDYPk3xFGsbquYTjE23kCaj9K8pRIid_-VT6zB31wpDP8m-qkrN6nj4Q1ykWjxiHsKevM20Hv9sjLsvixLv_pZPL58PvwtD6ZWp_2saPAI)

일단 실행결과는 위와 같습니다.

Select DB 버튼을 눌러 dialog open 명령어를 실행해 볼까요?

그런데 아무런 반응도 일어나지 않습니다.

---

## Tauri의 보안

tauri.config.json 파일에서 보안 관련 예외 사항을 직접 지정해 줘야 합니다.

로컬 파일을 읽는 open 함수도 기본적으로는 막혀 있는 구조죠.

tauri.config.json 파일에서 다음과 같이 추가하고 다시 실행해 보면 됩니다.

```json
  "tauri": {
    "allowlist": {
      "fs": {
        "scope": ["$RESOURCE/*"]
      },
      "all": false,
      "shell": {
        "all": false,
        "open": true
      },
      "dialog": {
        "all": true
      }
    },
```

dialog 부분을 true라고 allowlist에 추가했다는 뜻입니다.

이제 다시 실행해 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEgm-ifk_yE8XNVaOhxSeTloj4XfUjxRVnUeFG3x4WXhYNOwk2PN-Vx01stDtUP4Pr41u3TPp-Q0YK1F8nj9dcfTGTDgnmc7Oqkh9kUTTNy2gtxjw28y3XisD8mbemiojmyuQA7cNE8WbTQXnRRQmoulI3Qwv3VOT-UnwG89fHxWJGwz9IWyCMvmnVRhlKw)

위와 같이 맥OS의 기본 파일 읽기 컨트롤이 나타납니다.

on:click에 svelte_save_config_file 이란 함수를 지정했고, 이 함수에 있는 open 함수를 async 방식으로 불렀습니다.

open 함수는 string이나, string[]을 리턴할 수 있고요.

당연히 multiple를 false라고 지정하면 배열은 리턴되지 않겠죠.

null도 리턴할 수 있기 때문에 아래와 같이 코드를 짜주면 됩니다.

```js
      const response = await open({
        multiple: false,
        defaultPath: "./",
      });
      if (!response) return;
      db_file_path = response as string
```

if 문으로 null에 대응해 주고, 마지막으로 타입스크립트의 as를 써서 string으로 받으면 됩니다.

테스트를 위해서 일단 Select DB 버튼을 눌러 아무 파일이나 골라 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEhrhsJZDvP9TihtPCBNxfjoVlHOZa52azMnff_W_du-NW_E8duObgxfNrKo1x3IPtGa0B6p0RWZY91Dhr-AYW6xvOKYRtd8bz-Sisl-9gKJ469dClrtp44N7xxCc2xilpITmQgAeVRKZLgZ6XMuKq5GRURI3ivtygqsBZ8Fww9XdNilimqTyXGcsl27T2Q)

위와 같이 UI상에서는 잘 작동합니다.

---

## Rust에서 벡엔드 코드 작성하기

UI 상으로 잘 작동한 코드는 사실 백엔드 쪽에서는 아무런 작동도 되지 않습니다.

왜냐하면 우리가 UI에서 invoke했던 tauri command가 두 개가 있었는데요.

이 코드를 작성하지 않았기 때문이죠.

read_config_file, save_config_file

이 두 개의 command가 아직 러스트에는 없습니다.

여기서 잠깐!!!!

tauri의 invoke를 통해 객체를 전달할 때는 캐멀케이스 방식을 써야합니다.

자바스크립트 상에서는 캐멀케이스 방식을 쓰고, 러스트 상에서는 스네이크케이스 방식으로 받으면 됩니다.

```js
// Tauri Docs said,
// Arguments should be passed as a JSON object with camelCase keys:
await invoke('save_config_file', { dbFilePath: db_file_path })
```

위 코드에서 디버그하느라 시간 많이 허비했는데요.

Tauri 공식문서에서 찾기가 정말 힘들었습니다.

---

## Rust 백엔드 코드 작성하기

config 파일 관련 해서 Config 구조체를 이용해서 구현해 보겠습니다.

main.rs 파일과 같은 폴더에 config.rs 파일을 아래와 같이 작성하십시요.

```rust
use std::fs;
use std::path::PathBuf;
use toml;

pub struct Config {
    pub db_file_path: String,
}

impl Config {
    pub fn from_file(config_file_path: PathBuf) -> Result<Self, Box<dyn std::error::Error>> {
        let config_content = fs::read_to_string(config_file_path)?;
        let config: toml::Value = toml::from_str(&config_content)?;
        let db_file_path = config
            .get("db_file_path")
            .and_then(|value| value.as_str())
            .ok_or("db_file_path not found in config")?
            .to_string();
        Ok(Config { db_file_path })
    }

    pub fn update_db_file_path(
        &mut self,
        new_db_file_path: String,
        config_file_path: &PathBuf,
    ) -> Result<(), Box<dyn std::error::Error>> {
        self.db_file_path = new_db_file_path.clone();

        let config_content = fs::read_to_string(config_file_path)?;
        let mut config: toml::Value = toml::from_str(&config_content)?;

        config.as_table_mut().unwrap().insert(
            "db_file_path".to_string(),
            toml::Value::String(new_db_file_path),
        );

        let updated_config = toml::to_string_pretty(&config)?;
        fs::write(&config_file_path, updated_config)?;

        Ok(())
    }
}
```

toml 패키지를 위해 cargo.toml 파일의 dependencies 부분에 아래를 추가하시면 됩니다.

```bash
toml = "0.7.6"
```

toml 패키지는 toml 파일 형식으로 읽기 쓰기를 쉽게 해주는 패키지입니다.

config.toml 파일에 db_file_path라는 정보를 저장할 거거든요.

config.toml 파일을 assets 폴더에 추가합시다.

```bash
db_file_path = "/MyVideos116.db"
```

config.rs 파일의 이해는 한번 천천히 읽어보시면 쉽습니다.

이제, tauri command를 위해 main.rs 파일에 추가해 볼까요?

일단 main 함수에 tauri command를 추가해야 합니다.

```rust
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            search,
            get_count,
            read_config_file,
            save_config_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

이제 tauri command를 만들겠습니다.

```rust
mod config;
use config::Config;


#[tauri::command]
fn read_config_file(handle: tauri::AppHandle) -> String {
    let config_path: PathBuf = handle
        .path_resolver()
        .resolve_resource("assets/config.toml")
        .expect("Failed to resolve config.toml");
    println!("Config Path: {:?}", config_path);

    let config = Config::from_file(config_path.clone()).expect("Failed to load config");
    config.db_file_path.to_string()
}

#[tauri::command]
fn save_config_file(db_file_path: String, handle: tauri::AppHandle) {
    let config_path: PathBuf = handle
        .path_resolver()
        .resolve_resource("assets/config.toml")
        .expect("Failed to resolve config.toml");

    let mut config = Config::from_file(config_path.clone()).expect("Failed to load config");
    config
        .update_db_file_path(db_file_path.clone(), &config_path)
        .expect("Failed to update config.");
    println!("Updated DB File Path: {}", config.db_file_path);
}
```

이제 모든 코드가 완료되었습니다.

assets 폴더는 우리가 지난 시간에 resources로 등록했기 때문에 assets 폴더에 있는 파일은 자동으로 앱이 패키징 될때 같이 패키징 됩니다.

하지만 config.toml 파일이 추가됐기 때문에 src-tauri 폴더에 있는 build 정보 즉, target 폴더를 싹 지우고 clean build를 다시 해줘야 합니다.

그래야 debug build에도 config.toml 파일과 MyVideo116.db 파일이 같이 복사되거든요.

---

지금까지 tauri dialog open 명령어로 UI 상에서 로컬 파일에 접근하는 방법에 대해 알아봤는데요.

다음 시간에는 다른 주제로 다시 찾아오겠습니다.

그럼.
