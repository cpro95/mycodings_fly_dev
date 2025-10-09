---
slug: 2023-09-02-tauri-custom-menu-and-events-to-javascript
title: Tauri 실전 코딩 5편 - Tauri의 커스텀 메뉴 만들기와 이벤트(event)로 자바스크립트와 통신하기
date: 2023-09-02 05:20:55.119000+00:00
summary: 커스텀 메뉴 만들기와 이벤트를 이용해서 백엔드에서 프로트엔드로 통신하기
tags: ["tauri", "rust", "sveltejs", "desktop app", "cross platform", "custom menu", "events"]
contributors: []
draft: false
---

안녕하세요?

Tauri 관련 블로그를 몇 개만 하려고 했는데 벌써 5편까지 왔네요.

1편. [Tauri 실전 코딩 1편 - Tauri로 일렉트론JS 같은 데스크탑 앱 만들기](https://mycodings.fly.dev/blog/2023-08-20-tauri-desktop-app-cross-platform-vs-electronjs)

2편. [Tauri 실전 코딩 2편 - Rust로 Sqlite3 DB 읽어오는 백엔드 로직 작성](https://mycodings.fly.dev/blog/2023-08-21-tauri-desktop-app-tutorial-rust-svelte)

3편. [Tauri 실전 코딩 3편 - Tauri에서 dialog open 함수로 로컬 파일 읽기](https://mycodings.fly.dev/blog/2023-08-28-tauri-dialog-open-read-local-file)

4편. [Tauri 실전 코딩 4편 - Tauri에서 dialog save 또는 writeTextFile 함수로 로컬에 파일 쓰기](https://mycodings.fly.dev/blog/2023-08-30-tauri-dialog-save-to-local-file)

---

## 메뉴 만들기

데스크탑 앱이라면 무조건 있는 메뉴를 만들어 볼 건데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEibFOramFy0Wh97Rc_hPdiks3ipRd3b_CzZZzDh9MuQ7IeXacXcNjEYOTXugFJlr4WoxqiZVeEALKCzBqsYDxULRVCfBB0_ceQS7c5if-lqLaWQrixeO_grSYNdySC_ravKSAtCQ6hAE0BW2rohWeezx3w0XAMfQeR3Dr7UP19UOvNq4RgjKvbu_63j11E)

위 그림에 나오는 메뉴는 커스텀 메뉴가 아닌 Tauri가 기본으로 제공하는 메뉴입니다.

이 메뉴는 우리가 원하는 메뉴가 아니죠.

그래서 만드려고 하는 앱의 특성에 맞게 메뉴를 구성해야 하는데요.

일단 main.rs 함수에서 menu관련 코드를 작성해 보겠습니다.

```rust
use tauri::{Menu, MenuItem, Submenu};

fn main() {
    let menu = Menu::new().add_submenu(Submenu::new(
        "App",
        Menu::new().add_native_item(MenuItem::Quit),
    ));

    tauri::Builder::default()
        .menu(menu)
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

위 코드를 보시면 tauri에서 Menu, MenuItem, Submenu를 import 했습니다.

그리고 tauri::Builder에서 menu를 추가했는데요.

menu 객체는 Menu::new()로 만들면 됩니다.

이제 실행 결과를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEiziqEVPUNfYjaHu6lNuV7wOTBD_YXSzIkABtvah7f1ox_SKVzEaDh26EFuN84RIGmBtOk_GzLy0auZ9YsdR5XHYTC3OSpb0vZrMWnF5W3X2oDdKx7NEKcT5-7dtbRG7ooayfzcRtgiENTmcjreiulwy6uUi0y4JBKokKEG3DI6-fi__fmvyetSqgx-d8s)

위와 같이 나옵니다.

우리가 추가한 거는 Tauri Menu에 있는 add_native_item인데요.

native_item이라서 Quit, Copy, Cut, Paste, Hide, Minimize, About 등 여러 가지 기본적으로 내장된 명령어를 추가할 수 있습니다.

아래와 같이 About 서브 메뉴를 추가해 볼까요?

```rust
    let menu = Menu::new()
        .add_submenu(Submenu::new(
            "App",
            Menu::new().add_native_item(MenuItem::Quit),
        ))
        .add_submenu(Submenu::new(
            "About",
            Menu::new().add_native_item(MenuItem::About(
                "tauri-test".to_string(),
                AboutMetadata::new(),
            )),
        ));
```

실행 결과는 아래와 같습니다.

참고로, AboutMetadata는 Linux에서만 작동하니 그냥 AboutMetadata::new()라고 넣으시면 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhMEv0jPVsO7HKu5H2FQD2CC_tR5u1YiFC016d16EGKi5FOXw-FBpiKaE126U7-sgVE3wz4FfAmIpnJsOCQB2OB8xRFvgeO9kA-o7CAhlH-uyo_Z319kUcRhsRVH9F_yv4pbaLVAPQGVfPTlp_ryc1TNnT66GowVpY3Bk2T9pHBJRSa7Qy_UdSTvzathIQ)

---

## 본격적인 CustomMenu 추가하기

이제 시스템 기본 메뉴를 살펴봤으니까요?

커스텀 메뉴를 추가해 보겠습니다.

참고로 submenu title인 "App"은 Tauri에서 기본적으로 내장되어 있습니다.

그래서 이름을 "App"으로 지으면 기본 메뉴를 쓰는게 됩니다.

그러면 submenu "App"과 "About" 사이에 "File"이라는 서브메뉴를 추가해 보겠습니다.

```rust
// 아까 import 하지 못한 AboutMetadata와 더불어 CustomMenuItem도 import 합시다.
use tauri::{AboutMetadata, CustomMenuItem, Menu, MenuItem, Submenu};



let menu = Menu::new()
        .add_submenu(Submenu::new(
            "App",
            Menu::new().add_native_item(MenuItem::Quit),
        ))
        .add_submenu(Submenu::new(
            "File",
            Menu::new()
                .add_item(CustomMenuItem::new("new".to_string(), "New").accelerator("CmdOrCtrl+N")),
        ))
        .add_submenu(Submenu::new(
            "About",
            Menu::new().add_native_item(MenuItem::About(
                "tauri-test".to_string(),
                AboutMetadata::new(),
            )),
        ));
```

"File"이란 서브메뉴에 add_item으로 CustomMenuItem을 추가했는데요.

accelerator도 지정할 수 있습니다.

단축키죠.

"CmdOrCtrl+N" 같은 형식이니까 아무 키 조합도 가능합니다.

그리고 CustomMenuItem::new() 함수에 들어가는 첫 번째 인자는 id라는 인자인데요.

이 id가 바로 우리가 사용할 이벤트에서 쓰이는 id입니다.

그리고 두 번째 인자는 화면에 보일 텍스트이고요.

실행 결과를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEjlDE_Y06A_K2B6lDmKa_agA7bJwuphZ48a37Mrfgi-AyVtaYkEC9GSzppimkagd3cyh08miEUp1fIMMFK3kRvC9GW0owM9A73H5C4qE6ctZPd9N3agauRG0Ih8Dc4WQO63OEvc72T4h4iBcBQjiFPkRC6o1GHjGnSvXzp5F7k4TynM4ByXVWEi8K4qq0A)

아주 잘 되고 있네요.

그러면 "File" 메뉴를 마저 완성시키죠.

```rust
let menu = Menu::new()
        .add_submenu(Submenu::new(
            "App",
            Menu::new().add_native_item(MenuItem::Quit),
        ))
        .add_submenu(Submenu::new(
            "File",
            Menu::new()
                .add_item(CustomMenuItem::new("new".to_string(), "New").accelerator("CmdOrCtrl+N"))
                .add_item(
                    CustomMenuItem::new("open".to_string(), "Open").accelerator("CmdOrCtrl+O"),
                )
                .add_item(CustomMenuItem::new("save", "Save").accelerator("CmdOrCtrl+S")),
        ))
        .add_submenu(Submenu::new(
            "About",
            Menu::new().add_native_item(MenuItem::About(
                "tauri-test".to_string(),
                AboutMetadata::new(),
            )),
        ));
```

실행결과는 당연히 아래와 같이 나올 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhdiz84efe0gAKhpgAe1tx4hpBkZF4IZ2M98o4dWW3NNPXgxGrBL5leIY2fT1EZEzthUMw2TxCNA_omtoQZQ0UqbP8otjuRqx3UtCHZT5zHX_FfnT1nKDhNjP3ccPW4epZQDhCAokXdy9FRjGeAKjqgi2k2PS9bU2XN9NtN8M1S7hje3uMcXlHeyOvp2bE)

어떤가요?

---

## 메뉴를 클릭했을 때 코드 작성하기

메뉴 UI는 전체적으로 완성했는데요.

메뉴를 클릭했을 때 어떻게 작동되는지는 아직 작성하지 않았는데요.

아래와 같이 하시면 됩니다.

```rust
tauri::Builder::default()
        .menu(menu)
        .on_menu_event(|event| match event.menu_item_id() {
            "new" => {
                println!("New menu item clicked");
            }
            "open" => {
                println!("Open menu item clicked");
            }
            "save" => {
                println!("Save menu item clicked");
            }
            _ => {
                println!("None of menu item clicked");
            }
        })
        .invoke_handler(tauri::generate_handler![
            search,
            get_count,
            read_config_file,
            save_config_file,
            save_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
```

위 코드를 보시면 on_menu_event 함수에서 event와 event.menu_item_id() 함수를 이용했습니다.

그리고 아까 서브 메뉴 만들 때 지정했던 메뉴의 id를 match 시켜서 코드를 완성했습니다.

이제 테스트를 위해 메뉴를 각각 클릭해 볼까요?

아래와 같이 터미널상에 해당 문구가 잘 나타나고 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgn2AKj0SFT-WivG66MgYEWhhPYMaLo61mvx7-KznRZLwqtBoM-UB9JToomdfhDiA4PWE_NVTwJZtthq3WXbGUmoPO_250hJlhcAkThCGrstA2RTz0ggsrE3mwuKHxKQLDSq444tKzfGpRdEUn9g-vzCYWyAzPV_qLn0eQne-hvKjwZNlhC65WXLrB5ArQ)

---

## 자바스크립트와 통신하기

이제 백엔드 부분에서의 메뉴 작성은 끝났습니다.

그러면 UI부분과 연결해야 하는데요.

방법은 백엔드에서 이벤트를 emit() 함수를 이용해서 발산만 하면 됩니다.

다시 코드를 고쳐 볼까요?

```rust
tauri::Builder::default()
        // .menu(create_app_menu())
        .menu(menu)
        .on_menu_event(|event| match event.menu_item_id() {
            "new" => {
                event.window().emit("new-content", "").unwrap();
                println!("New menu item clicked");
            }
            "open" => {
                event.window().emit("open-content", "").unwrap();
                println!("Open menu item clicked");
            }
            "save" => {
                event.window().emit("save-content", "").unwrap();
                println!("Save menu item clicked");
            }
            _ => {
                println!("None of menu item clicked");
            }
        })
        .invoke_handler(tauri::generate_handler![
            search,
            get_count,
            read_config_file,
            save_config_file,
            save_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
```

event 객체에는 window() 함수가 있는데요.

이 window()함수를 호출하면 윈도우를 가져올 수 있습니다.

그리고 이 윈도우에서 emit() 함수를 실행하는 거죠.

emit 함수에는 자바스크립트에서 구별할 수 있는 독특하고 유니크한 문자열을 전달해 주면 됩니다.

저는 'new-content'라고 지정했습니다.

어차피 앱이 작아서 중복될 일이 없으니까요.

이제 진짜 백엔드쪽에서의 코드는 끝났습니다.

---

## UI쪽의 자바스크립트 손보기

저는 Svelte로 작성했는데요.

지난 시간에 작성한 Editor.svelte 파일에서 작업하겠습니다.

먼저, 이벤트를 리스닝(listening)해야 하니까요.

appWindow 객체를 불러오겠습니다.

그리고 onMount 함수도 필요합니다.

```js
import { onMount } from 'svelte'
import { appWindow } from '@tauri-apps/api/window'
```

이제 onMount 함수안에 appWindow.listen 함수를 이용해서 작성해 보겠습니다.

```js
import { onMount } from 'svelte'
import { appWindow } from '@tauri-apps/api/window'

let messages = "";

onMount(() => {
  console.log('Editor mounted!!!')
  appWindow.listen('new-content', () => {
    console.log('new-content event emitted')
    messages = ''
  });
});
```

위 코드를 보시면 'new-content'라는 이벤트 메시지가 오면 콘솔 로그와 함께 messaes라는 변수를 초기화하고 있습니다.

messages는 지난 시간에 작성한 textarea와 bind 되어 있기 때문에 messages를 빈칸으로 초기화하면 textarea에 있는 내용이 지워지는 효과가 생깁니다.

즉, "File" 메뉴에서 "New" 서브 메뉴를 클릭하면 textarea를 새로 쓴다는 의미로 textarea에 입력되어 있던 자료를 지운다는 뜻이죠.

이제 실행 결과를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEhcMprC3UTcJ2y54b-iwV59FxHIzd3xhpWTZLjz-qffmYr_8xbvrIXehtOwhsuemzNbNdoE8ocR55FzkMrI_8fxZradPd_1NGjSYOXvbr-GpzufoVdMBP1LTT1QOlx-kfZ-7lgPXDYCmj0hW3VTzMbftGYrEy2fn0DkMMfExgCi2bo6GOJZ0vMpikMYoeI)

위 그림과 같이 Tauri 앱의 inspect element 화면의 콘솔창에 우리가 작성했던 문구가 정확히 나오고 있습니다.

---

## Open 메뉴를 readTextFile 함수를 이용해서 작성해 보기

지난 시간에 writeTextFile을 이용해서 자바스크립트 상에서 텍스트 파일을 로컬디스크에 직접 저장하는 코드를 완성하고 그다음에 readTextFile 함수도 있다고 했었습니다.

이 함수를 "Open" 서브 메뉴에 활용해 보겠습니다.

```js
import { readTextFile } from "@tauri-apps/api/fs";
import { open, save } from "@tauri-apps/api/dialog";

onMount(() => {
    console.log("Editor mounted!!!");
    appWindow.listen("new-content", () => {
      console.log("new-content event emitted");
      messages = "";
    });
    appWindow.listen("open-content", async () => {
      console.log("open-content event emitted");
      try {
        const filePath = await open({
          title: "Select text file",
          filters: [
            {
              name: "Text",
              extensions: ["txt"],
            },
          ],
        });
        if (!filePath) return;
        const fileContent = await readTextFile(filePath as string, {});
        messages = fileContent;
      } catch (e) {
        console.log(e);
      }
    });
  });
```

위 코드에서 보듯이 appWindow.listen을 onMount 함수 안에 여러 개 만들면 됩니다.

'open-content' 이벤트에 실행할 코드는 tauri/api/dialog의 open을 사용했기 때문에 async로 작성해야 합니다.

코드 내용은 쉽습니다.

이제 테스트 결과를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEgzeldcqutMhrijQZm-ckaglRC6U7j1lHK7zcjrDszgH1Qzxzu8NBgLDqn4A6b7KiTjxnX8G3GVOFQtpOBSNJjygrJYUdI_ef9s55EvZ2rIt58w2C_3QM8eQ8m_167a0iAcnaWRxlTh9t35i9RJVPjikzmcnaOBpKtqwOlgSwhryULrXsvzlatpqC39cLY)

![](https://blogger.googleusercontent.com/img/a/AVvXsEhXhg_Bt_2zEnWlhOACFtYhK9pHVMeWMJVw6eRPvNI9f_IFp_6sHUYthLbEmAOku5ZGNGKM0P8gA3yYHuqIr3MxKWfnlVT79w_PxmoKrjkBhH_Gv_AVKLSwk_BmDcfifq4eGKfq7fvkyYDysmQF7UvmXmYmjs8d2f10GknrFYq8Kbx1urtyojeyj2KKGuc)

테스트를 위해서는 개발 서버를 한번 중지시키고 다시 시작해야 합니다.

open 함수를 사용할 때 Vite의 핫 모듈 리로드에서 꼬여버리는 현상이 나타납니다.

다시 "npm run tauri dev"를 실행하면 정상 작동하니 걱정하지 마심이어요.

어떤가요?

"Open" 메뉴도 정상 작동합니다.

---

지금까지 Tauri의 메뉴와 함께 백엔드에서 프로트엔드쪽으로 이벤트를 보내는 방식에 대해 알아봤는데요.

이 정도까지면 Tauri의 모든 기본 기능은 충분히 이해하셨을 거로 판단됩니다.

그럼.
