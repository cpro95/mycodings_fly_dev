---
slug: 2023-08-30-tauri-dialog-save-to-local-file
title: Tauri 실전 코딩 4편 - Tauri에서 dialog save 또는 writeTextFile 함수로 로컬에 파일 쓰기
date: 2023-08-30 10:24:10.811000+00:00
summary: dialog save 함수, 또는 writeTextFile 함수로 로컬에 파일 쓰기
tags: ["tauri", "sveltejs", "rust", "desktop app", "cross platform", "dialog save", "writeTextFile"]
contributors: []
draft: false
---

안녕하세요?

지난 시간까지는 tauri-app/api/dialog 모듈에서 open을 이용해서 파일 위치를 얻어서 Rust 백엔드 코드에서 파일을 읽어오는 로직을 작성했는데요.

오늘은 그 반대로 데스크탑의 로컬 파일로 save 하는 로직을 만들어 보겠습니다.

지난 강좌 링크는 아래와 같습니다.

1편. [Tauri 실전 코딩 1편 - Tauri로 일렉트론JS 같은 데스크탑 앱 만들기](https://mycodings.fly.dev/blog/2023-08-20-tauri-desktop-app-cross-platform-vs-electronjs)

2편. [Tauri 실전 코딩 2편 - Rust로 Sqlite3 DB 읽어오는 백엔드 로직 작성](https://mycodings.fly.dev/blog/2023-08-21-tauri-desktop-app-tutorial-rust-svelte)

3편. [Tauri 실전 코딩 3편 - Tauri에서 dialog open 함수로 로컬 파일 읽기](https://mycodings.fly.dev/blog/2023-08-28-tauri-dialog-open-read-local-file)

---

## dialog 모듈의 save 함수를 이용한 방식

먼저, SvelteJS를 바꿔서 UI를 변경해 보겠습니다.

App.svelte 파일에 우리가 만들고자 하는 파일을 추가합니다.

```js
<script lang="ts">
  import Editor from "./lib/Editor.svelte";
  import Search from "./lib/Search.svelte";
  import Setting from "./lib/Setting.svelte";
</script>

<main class="min-w-[320] flex flex-col mx-auto items-center justify-center p-8">
  <h1 class="font-bold text-4xl">Welcome to My Search App with Tauri!</h1>

  <div class="w-full flex flex-col items-center justify-center py-4">
    <Editor />
    <Setting />
    <Search />
  </div>
</main>
```

lib 폴더에 Editor.svelte 파일을 아래와 같이 작성합니다.

```js
<script lang="ts">
  let messages = "";

  const save_messages = async () => {}
</script>

<section class="w-full mb-4">
  <button class="css-button" on:click={save_messages}>Save</button>
  <textarea
    id="message"
    rows="4"
    class="css-textarea"
    bind:value={messages}
    placeholder="Write your thoughts here..."
  />
</section>

<style lang="postcss">
  .css-textarea {
    @apply block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500;
  }
  .css-button {
    @apply text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-4 py-1.5 mr-2 mb-2;
  }
</style>
```

이제 완성된 UI는 아래와 같이 보일겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhbqAZMJbbQ9YbXwU0WqWJ-XllCiyrTTaURG9jGjRc81vvgLzlFyScLlmCYcBfnrYvuAexyAeGsFknsPwYQ2TmxYF9QYx30BPvZM706feX80Xue7U2EIrnKUBMyQITRQdWX-539I6a-8n7ge7CCd946azSnvMzDnW0ebnHin_BD16baZmEnD8r6R2qG8ks)

UI는 역시나 FlowBite에서 가져왔습니다.

깔끔하고 좋네요.

이제 Editor.svelte 파일의 script 태그에 tauri-app/api/dialog 모듈에 있는 save 함수를 이용해서 textarea에 있는 데이터를 로컬 파일에 저장해 보겠습니다.

```js
<script lang="ts">
  import { invoke } from "@tauri-apps/api";
  import { save } from "@tauri-apps/api/dialog";
  let messages = "";

  const save_messages = async () => {
    try {
      const savePath = await save();
      console.log(savePath);
      if (!savePath) return;
      await invoke("save_file", {
        path: savePath,
        contents: messages,
      });
    } catch (e) {
      console.log(e);
    }
  };
</script>
```

tauri-app/app/dialog 의 save 모듈은 로컬파일에 저장하기 위한 경로만 리턴합니다.

savePath는 그냥 String입니다.

여기까지만 작성하고 테스트해 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEj_6vAjFp0wgFVzytsQV87Kh3chY26cG_ypOW-idMZRLdou8z42ngQdj67FVjdIZ3jFLpQEuH4Rlui99U8vpKKdGywx3rexjAYaybrQJFcvAcb-lvF5NHDv2nGq6M1Eky563w7plgAHSh1ZkL6BLdGekxRo_z4iOh3Y3fT6tOPrLlIyMSzaf1BoHbYPlG4)

![](https://blogger.googleusercontent.com/img/a/AVvXsEhpiKgY2lroYPItJC67W9RZcyiIB6zManHhJtT2t2T15f_y-ebhWa3bhJC74Y5EviZXVPeJpSJLxRXoHBZ2ogqC2Dk-8kqNBupQcmnsYpjZ7lRD4lcNar1V4puZgICxolTBA8WyKVPbvVOtcQxTxBcexXowT18os0TuYivw6afOdjiOqG6cuurEnglZjOs)

위와 같이 Tauri 앱의 Inspect Element 화면에 잘 나타나고 있습니다.

그리고, 실제 파일을 로컬 디스크에 저장하는 로직은 invoke 명령어를 이용해서 Rust에서 작성하는 거죠.

이제, main.rs 파일에 save_file 이란 러스트 함수를 만들도록 하겠습니다.

```rust
use std::fs;

...
...
...

#[tauri::command]
fn save_file(path: String, contents: String) {
    fs::write(path, contents).unwrap();
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            search,
            get_count,
            read_config_file,
            save_config_file,
            save_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

단순하게 fs::write로 파일을 저장만 했습니다.

실행결과를 다시 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEgokUDpzClfCeSLx7MdBXuJjhEk4JSiHruh001-1Qk6TWbHy7zYen1fsQ0Yfm1QE-gOci77CBYTqEHZ8IYvKRt-pnKZ9BryDl8BxI2xyyMPIrAVQl-daa730RahlFTL4K0wTmi6UIb-TEJ77nz8_3qF6n13zULdx0AvDzh_JuPckLa2XLoHRy-ePb3pHDc)

![](https://blogger.googleusercontent.com/img/a/AVvXsEgKenbnrmGVDjIzENlDQ_NxiR0UIZ15XS1BgqkYOpSDzxe6DF-LMtp8-8D0OFjyRZsTv8VAfmRqX4TDV25me2FqyBRP-ZqKYESaJElH33H9ZlBoycXQfmkMoOrsJ-7I_quSpWGLg3FmQ4NG6TXLGSYv0aUM2jDPAEFJlh36e98Ft7_cYbx0v-MKKAwTWUI)

어떤가요?

우리가 만든 tauri command가 아주 잘 작동하고 있습니다.

tauri-app/api/dialog 모듈을 쓰려면 tauri.conf.json 파일에서 allowlist에 dialog 모듈을 넣어줘야 합니다.

지난 시간에 넣어줬기 때문에 작동하는 거죠.

```json
  "tauri": {
    "allowlist": {
      "all": false,
      "shell": {
        "all": false,
        "open": true
      },
      "dialog": {
        "all": true
      }
    },
    ...
    ...
    ...
  }
```

---

## tauri-app/api/fs 모듈이 제공해 주는 writeTextFile 함수를 사용하여 자바스크립트 상에서 직접 저장하기

tauri-app/api 라이브러리는 많은 걸 기본적으로 제공해 주는데요.

그중에 fs 모듈이 그건데요.

Rust의 fs 처럼 파일 관련 모듈입니다.

이제, writeTextFile을 이용해서 Rust 코드 없이 로컬 파일에 파일을 저장해 봅시다.

다시 Editor.svelte 파일을 아래와 같이 바꿔서 작성해 봅시다.

```js
<script lang="ts">
  import { invoke } from "@tauri-apps/api";
  import { writeTextFile, BaseDirectory } from "@tauri-apps/api/fs";
  let messages = "";

  const save_messages = async () => {
      try {
        console.log(messages);
        await writeTextFile("test.txt", messages, {
          dir: BaseDirectory.Desktop,
        });
      } catch (e) {
        console.log(e);
      }
    };
</script>
```

이제 테스트해 보면 아래 그림과 같이 에러가 나는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjSiVYsq9e4b9e0M9etrneccI7gjHl9wIit1Q-rWXoObaeE1bStR9UKkIaYabV5UtahWp93QyPXdoLrSMMbwpUdfOmfe_IIX3akqhNVRCJAZoJiRlwkVqIjD6E0KJpwx0gfq3R9cnCHuAyiGXji_U557pMC8HD0f2f_09l6CV1ZwrxnK5Ll7qTPczf_ZrM)

allowlist에 해당 모듈을 추가해야 합니다.

```json
  "tauri": {
    "allowlist": {
      "all": false,
      "shell": {
        "all": false,
        "open": true
      },
      "dialog": {
        "all": true
      },
      "fs": {
        "all": true
      }
    },
    ...
    ...
    ...
  }
```

다시 테스트 해보면 이제는 아래와 같이 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjQADyJrwmskQCeqDuFC4LjhCE_B-zTX1zYG7yYpn08RhdLfUquCpIDyV9zLhafAAtei9i-dfJkUO4yaJM-mjni94tjjOlKU7lhBeqbZ9YChjSVkPU_liFFGgy9GPo2DB4WuXBJxEeWQZZqh3Zwd9y7wU5ZBMGgtYouBhtjbqzgVZW0obAOTi9JL2EiKMY)

fs 모듈이 내 계정의 Desktop 폴더에 접근할 수 없다고 나옵니다.

다시 tauri.conf.json 파일을 수정해야 하는데요.

아래와 같이 scope 영역을 추가해야 합니다.

```json
  "tauri": {
    "allowlist": {
      "all": false,
      "shell": {
        "all": false,
        "open": true
      },
      "dialog": {
        "all": true
      },
      "fs": {
        "all": true
        "scope":["**"]
      }
    },
    ...
    ...
    ...
  }
```

이제 테스트해 볼까요?

writeTextFile 함수에는 직접 파일명을 지정해 줘야 하고, 그리고 두 번째에는 해당 컨텐츠 변수를 지정해야 합니다.

그리고 마지막에는 fsOptions을 지정해야 하는데요.

fsOptions에서는 dir 항목만 잘 챙기면 됩니다.

이 dir 항목이 저장위치입니다.

코드에서는 Desktop 경로를 지정했습니다.

이제 테스트 결과를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEhR4sH0yz-2g3BiyHNv5hsNxy0_6egjS3uXKuN8vYVJr71i4f1FjrcKji_5uz9-1sKin6RtVouNDTpGuwZRvoZ1jJfTrg3YVS3hFah8_HNhHrwBL62PVDBagZhNNym2APZijgpH2Fn7Z7jPMskBTDlLYbGWUO4zg41CeXv7rLturcWUb6a1ZysMN2Acwxc)

![](https://blogger.googleusercontent.com/img/a/AVvXsEg7drRznRB-xKs2JtqUlvJDESKoqkuD6urpSEeSVZImzJsxdEzC5J36Hip3Lmrcuh1DHIN5vGlZn6sNudRMj4kYoBKkWRxfiVSCK3MeTG5eM2SkCoZYLxJPEHgJdCj18_UZOuM7VwSYQkboJWlwTJSeCV98ZbVOTkmPo_OsFLInyO0N9pL0H--86R1wvSc)

위와 같이 정상 작동하고 있습니다.

---

추가로 tauri-app/api/fs 모듈에서 제공해 주는 writeTextFile 같이 readTextFile이란 함수도 있는데요.

지난 시간에 배운 open 함수를 이용해서 경로를 얻고 그 경로로 파일을 저장하는 러스트 코드를 만들었었는데요.

오늘 배운 대로 직접 readTextFile 함수를 이용해서 자바스크립트 상에서 작성해 보시기 바랍니다.

그럼.
