---
slug: 2023-09-04-how-to-use-rust-reqwest-http-get-post
title: Rust 웹 서버 만들기 2편. Rust에서 Reqwest를 이용해서 HTTP 요청(Request)하기
date: 2023-09-04 13:05:02.701000+00:00
summary: 웹 서버를 만들기 전에 가장 기본적인 Reqwest 사용법에 관해 공부해 봅시다.
tags: ["rust", "reqwest", "dotenv", "web server", "web application", "get method", "post method"]
contributors: []
draft: false
---

안녕하세요?

지난 시간에 이어 Rust로 웹 서버 만들기 강좌를 계속 이어 나가겠습니다.

[Rust 웹 서버 만들기 1편. Actix Web 그리고 Fly.io에 배포하기](https://mycodings.fly.dev/blog/2023-09-04-howto-rust-web-server-web-application-with-actix-web)

---

우리가 NodeJS로 웹 애플리케이션을 만들 때 가장 많이 이용하는 게 바로 fetch 함수인데요.

axios, request 등 HTTP 요청을 쉽게 해주는 여러 가지 패키지가 존재합니다.

Rust에서는 Reqwest가 아주 유명한데요.

이거 하나만 익혀도 되니 다른 건 안 찾아보셔도 됩니다.

테스트를 위해서 빈 폴더에 다음과 같이 앱을 하나 만듭니다.

```bash
cargo new reqwest-test

cd reqwest-test

cargo add reqwest --features json
cargo add tokio --features full
```

비동기식에 있어 tokio는 필수 패키지죠.

이제, 본격적인 reqwest(리퀘스트)를 해볼까요?

---

## GET 요청

```rust
#[tokio::main]
async fn main() {
    let response = reqwest
        ::get("https://jsonplaceholder.typicode.com/users").await;
    println!("{:?}", response);
}
```

우리가 사용할 테스트 서버는 jsonplaceholder 입니다.

HTTP GET 요청은 reqwest::get(url) 방식으로 하고,

await를 이용해서 비동기식으로 작동시키면 됩니다.

```bash
➜  reqwest-test git:(master) ✗ cargo run
   Compiling reqwest-test v0.1.0 (/Users/cpro95/Codings/Rust/reqwest-test)
    Finished dev [unoptimized + debuginfo] target(s) in 2.01s
     Running `target/debug/reqwest-test`
Ok(Response { url: Url { scheme: "https", cannot_be_a_base: false, username: "", password: None, host: Some(Domain("jsonplaceholder.typicode.com")), port: None, path: "/users", query: None, fragment: None }, status: 200, headers: {"date": "Mon, 04 Sep 2023 13:16:15 GMT", "content-type": "application/json; charset=utf-8", "transfer-encoding": "chunked", "connection": "keep-alive", "x-powered-by": "Express",cldPwVWkvxTa03X3zwofv66zbL88VMiAMa0%2F7%2BUU6msXke5ntw\"}],\"group\":\"cf-nel\",\"max_age\":604800}", "nel": "{\"success_fraction\":0,\"report_to\":\"cf-nel\",\"max_age\":604800}", "server": "cloudflare", "cf-ray": "801681834df019c2-KIX", "alt-svc": "h3=\":443\"; ma=86400"} })
➜  reqwest-test git:(master) ✗
```

실행결과는 조금 이상한데요.

다른 언어에서 Rust로 넘어오셔서 Result를 처음 접하시면 헷갈립니다.

저도 지금 매우 헷갈리는데요.

일단 Visual Studio Code에서 reqwest::get 위치에 마우스를 갖다 대면 아래와 같이 나옵니다.

```bash
reqwest
pub async fn get<T>(url: T) -> crate::Result<Response>
where
    T: IntoUrl,
```

즉, 리턴 값이 Result에 Response가 있다는 뜻입니다.

즉, 위 코드는 Result의 Response를 보여주게 됩니다.

그럼, 우리가 원하는 데이터는 어떻게 보죠.

바로 Result를 match 시켜서 분해하는 방법이 있는데요.

더 쉽게 unwrap() 메서드를 쓰면 됩니다.

코드를 다시 바꿔 볼까요?

```rust
#[tokio::main]
async fn main() {
    let response = reqwest::get("https://jsonplaceholder.typicode.com/users")
        .await
        .unwrap()
        .text()
        .await;
    println!("{:?}", response);
}
```

reqwest::get() 다음에 await 하고 나서 unwrap() 했습니다.

unwrap()은 Result를 그냥 에러 상관없이 풀어버리라고 하는 명령어입니다.

그리고 우리가 보기 쉽게 text()로 바꾸는 명령어를 주었습니다.

text() 명령어도 비동기식이라 최종적으로 await를 한번 더 줬습니다.

이제 결과를 볼까요?

```bash
➜  reqwest-test git:(master) ✗ cargo run
   Compiling reqwest-test v0.1.0 (/Users/cpro95/Codings/Rust/reqwest-test)
    Finished dev [unoptimized + debuginfo] target(s) in 1.91s
     Running `target/debug/reqwest-test`
Ok("[\n  {\n    \"id\": 1,\n    \"name\": \"Leanne Graham\",\n \"bs\": \"target end-to-end models\"\n    }\n  }\n]")
➜  reqwest-test git:(master) ✗
```

최종적으로 OK() 안에 우리가 원하는 데이터가 있네요.

---

## reqwest::get의 statusCode에 따른 match 구문 작성하기

이제, 코드를 바꿔서 match 구문을 활용해 볼까요?

```rust
#[tokio::main]
async fn main() {
    let response = reqwest::get("https://jsonplaceholder.typicode.com/users").await;

    match response {
        Ok(body) => {
            let data = body.text().await;
            println!("{:?}", data);
        }
        Err(err) => {
            eprintln!("{:?}", err);
        }
    }
}

```

이 방식으로도 써도 되고요.

아래와 같은 방식으로도 써도 됩니다.

```rust
#[tokio::main]
async fn main() {
    let response = reqwest::get("https://jsonplaceholder.typicode.com/users")
        .await
        .unwrap();

    match response.status() {
        reqwest::StatusCode::OK => {
            // parse our response
            match response.text().await {
                Ok(parsed) => println!("parsed {:?}", parsed),
                Err(_) => println!("error"),
            };
        }
        reqwest::StatusCode::UNAUTHORIZED => {
            println!("unauthorized");
        }

        other => {
            panic!("panic!!, {:?}", other);
        }
    }
}

```
response를 딱 unwrap()까지만 했습니다.

그리고 response의 status() 메서드를 이용했고요.

실행 결과는 똑같을 겁니다.

---

## TMDB_API_KEY 키를 활용한 Reqwest GET 요청하기

제가 예전에 만든 myMovies 앱이 있는데요.

TMDB에서 popular movies를 불러와서 브라우저에 뿌려주는 앱을 만들었습니다.

오늘은 여기서 사용한 TMDB_API_KEY를 활용해서 Reqwest GET 요청을 해볼까 합니다.

NodeJS에서 .env 파일을 쓰는데요.

Rust에서도 .env 파일을 쓸 수 있습니다.

일단 다음과 같이 dotenv 패키지를 설치합시다.

```bash
cargo add dotenv
```

dotenv 패키지는 아래와 같이 사용하시면 됩니다.

```rust
use dotenv::dotenv;

fn main() {
    dotenv().ok();

    for (key, value) in std::env::vars() {
        println!("{}: {}", key, value);
    }

    println!("{}", std::env::var("TMDB_API_KEY").unwrap());
}
```

실행 결과는 현재 터미널의 환경변수를 전부 보여주고요.

그다음에 .env에 있는 TMDB_API_KEY를 출력해 줍니다.

---

## Reqwest를 이용해서 TMDB 영화 불러오기

이제 우리가 위에서 배운 Get 메서드를 좀 더 확장해 볼까요?

```rust
use dotenv::dotenv;

#[tokio::main]
async fn main() {
    dotenv().ok();

    let tmdb_url = format!(
        "https://api.themoviedb.org/3/movie/popular?api_key={}&page=1",
        std::env::var("TMDB_API_KEY").unwrap()
    );
    let client = reqwest::Client::new();

    let response = client
        .get(tmdb_url)
        .header(reqwest::header::CONTENT_TYPE, "application/json")
        .header(reqwest::header::ACCEPT, "application/json")
        .send()
        .await
        .unwrap();

    match response.status() {
        reqwest::StatusCode::OK => {
            // parse our response
            match response.text().await {
                Ok(parsed) => println!("parsed {:?}", parsed),
                Err(_) => println!("error"),
            };
        }
        reqwest::StatusCode::UNAUTHORIZED => {
            println!("unauthorized");
        }

        other => {
            panic!("panic!!, {:?}", other);
        }
    }
}
```

위 코드에서 어려운 거는 없는데요.

일단 reqwest::get으로 GET 요청을 한 게 아니라 reqwest Client 객체를 하나 만들고 그 객체에다가 여러 가지 header를 추가하고 요청을 수행했습니다.

header를 추가한 걸로 봐서 POST 요청할 때 token을 bearer 방식으로 넣는 것도 가능하겠네요.

```rust
let client = reqwest::Client::new();
let response = client
    .get(url)
    .header(AUTHORIZATION, "Bearer [AUTH_TOKEN]")
    .header(CONTENT_TYPE, "application/json")
    .header(ACCEPT, "application/json")
    .send()
    .await
    .unwrap();
println!("Success! {:?}", response)
```

token을 넣는 방식은 위와 같이 header를 하나 추가하면 됩니다.

이제, 실행 결과를 볼까요?

```bash
➜  reqwest-test git:(master) ✗ cargo run
   Compiling reqwest-test v0.1.0 (/Users/cpro95/Codings/Rust/reqwest-test)
    Finished dev [unoptimized + debuginfo] target(s) in 2.00s
     Running `target/debug/reqwest-test`
parsed "{\"page\":1,\"results\":[{\"adult\":false,\"backdrop_path\":\"/8pjWz2lt29KyVGoq1mXYu6Br7dE.jpg\",\"genre_ids\":[28,878,27],the Galaxy Vol. 3\",\"video\":false,\"vote_average\":8,\"vote_count\":4638}],\"total_pages\":39861,\"total_results\":797216}"
➜  reqwest-test git:(master) ✗ 
```

parsed 값이 너무 많이 제가 조금 줄여서 보여드린 겁니다.

---

## Reqwest Client를 이용해서 타임아웃이 있는 요청을 지속적으로 해보기

우리가 요청을 할 때 한번 할 수도 있는데요.

보통 될 때까지 연결하라고 명령을 줄 필요가 있습니다.

이 부분을 작성해 볼까 하는데요.

```rust
use dotenv::dotenv;

async fn send_request_with_retry(url: &str) -> Result<String, reqwest::Error> {
    let mut retry_count = 0;
    let max_retries = 5;
    let client = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(10))
        .build()?;

    loop {
        let response = client
            .get(url)
            .header(reqwest::header::CONTENT_TYPE, "application/json")
            .header(reqwest::header::ACCEPT, "application/json")
            .send()
            .await?;

        if response.status().is_success() {
            return Ok(response.text().await?);
        } else if retry_count < max_retries {
            retry_count += 1;
            eprintln!("Request failed, attempt {} of {}", retry_count, max_retries);
        } else {
            break Ok("timeout".to_string());
        }
    }
}

#[tokio::main]
async fn main() {
    dotenv().ok();

    let tmdb_url = format!(
        "https://api.themoviedb.org/3/movie/popular?api_key={}&page=1",
        std::env::var("TMDB_API_KEY").unwrap()
    );
    match send_request_with_retry(&tmdb_url).await {
        Ok(body) => {
            println!("{}", body);
        }
        Err(err) => {
            eprintln!("Failed to fetch data: {}", err);
        }
    }
}
```

여기서는 send_request_with_retry 함수를 잘 봐야 하는데요.

이 함수에서는 Reqwest::Client의 Builder를 이용해서 timeout을 줬습니다.

timeout 10초를 줬는데요.

만약 10초 후에는 어떻게 될까요?

더 이상 연결 안 하겠죠?

그래서 저는 max_retries와 retry_count 변수를 활용해서 loop를 돌렸습니다.

5번 시도했는데 결과가 없다면 "timeout" 문자열을 리턴하게끔 만들었습니다.

이걸 테스트하기 위해 tmdb 서버의 주소를 약간 바꿔서 일부러 에러가 나게끔 해보겠습니다.

```rust
https://api.themoviedb.org/0/movie/
```

위에서처럼 3이란 숫자를 0으로 바꿨는데요.

이거는 TMDB API 서버의 버전입니다.

현재는 버전 3이란 뜻이죠.

버전 0으로 바꾸고 테스트해 볼까요?

```bash
➜  reqwest-test git:(master) ✗ cargo run
   Compiling reqwest-test v0.1.0 (/Users/cpro95/Codings/Rust/reqwest-test)
    Finished dev [unoptimized + debuginfo] target(s) in 1.83s
     Running `target/debug/reqwest-test`
Request failed, attempt 1 of 5
Request failed, attempt 2 of 5
Request failed, attempt 3 of 5
Request failed, attempt 4 of 5
Request failed, attempt 5 of 5
timeout
➜  reqwest-test git:(master) ✗ 
```

강제로 에러가 나오게끔 했더니 위와 같이 5번 시도했고, 최종적으로 timeout 문구를 리턴 했습니다.

앞으로 제가 만들 웹 서버에서는 이 함수를 사용할 예정입니다.

왜냐하면 기존 사이트를 미러링하는 서버이기 때문에 될 때까지 시도해야 하거든요.

----

## Reqwest POST 요청하기

이제 POST 요청으로 넘어가 보겠습니다.

```rust
#[tokio::main]
async fn main() {
    let url = "https://rust-web-app-tutorial.fly.dev/echo";
    let json_data = r#"
        {"id":"1", "name":"brian"}
    "#;

    let client = reqwest::Client::new();

    let response = client
        .post(url)
        .header("Content-Type", "application/json")
        .body(json_data.to_owned())
        .send()
        .await;

    let response_body = response.unwrap().text().await;
    println!("{:?}", response_body);
}
```

POST 요청을 위해 지난 시간에 만든 Rust 웹 서버의 echo route를 이용했습니다.

실행 결과를 볼까요?

```bash
➜  reqwest-test git:(master) ✗ cargo run
   Compiling reqwest-test v0.1.0 (/Users/cpro95/Codings/Rust/reqwest-test)
    Finished dev [unoptimized + debuginfo] target(s) in 1.59s
     Running `target/debug/reqwest-test`
Ok("\n        {\"id\":\"1\", \"name\":\"brian\"}\n    ")
➜  reqwest-test git:(master) ✗ 
```

아주 잘 작동하고 있네요.

이제 POST까지 배웠으니까, PUT, DELETE도 직접 Doc.rs 사이트에서 찾아보고 도전해 보시기 바랍니다.

그럼.

