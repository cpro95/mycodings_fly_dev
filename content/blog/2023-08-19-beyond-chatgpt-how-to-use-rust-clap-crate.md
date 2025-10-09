---
slug: 2023-08-19-beyond-chatgpt-how-to-use-rust-clap-crate
title: ChatGPT도 안 알려 주는 Rust로 cli 앱 만들기 with clap 커맨드 라인 파서
date: 2023-08-19 06:17:16.929000+00:00
summary: clap을 활용한 러스트 Cli 앱 만들기
tags: ["rust", "cli", "clap", "parser"]
contributors: []
draft: false
---

안녕하세요?

오늘은 요즘 공부하고 있는 Rust(러스트) 언어 관련입니다.

그중에서도 가장 기본이 되는 터미널상에서 CLI 앱을 만들어 볼까 하는데요.

---

러스트 언어가 기본으로 제공해 주는 커맨드 라인 아규먼트를 가져오는 코드를 짜 보겠습니다.

```rust
fn get_arguments() {
    let args: Vec<_> = std::env::args().collect(); // get all arguements passed to app
    println!("{:?}", args);
}
fn main() {
    get_arguments();
}
```

결과를 볼까요?

```bash
➜  clap-v4-test git:(master) ✗ cargo run -- this is argument
    Finished dev [unoptimized + debuginfo] target(s) in 0.06s
     Running `target/debug/clap-v4-test this is argument`
["target/debug/clap-v4-test", "this", "is", "argument"]
```

위와 같이 std::env::args()를 collect해서 가져온 벡터값입니다.

이렇게도 CLI 앱을 만들 수 있는데요.

러스트 언어는 clap 크레이트를 제공해 줍니다.

이제 clap 크레이트를 사용해서 만들어 보겠습니다.

참고로 ChatGPT는 아직도 clap 버전 2만 알고 있는데요.

최신 버전인 v4를 사용하겠습니다.

```bash
cargo new clap-v4-test
cd clap-v4-test

➜  clap-v4-test git:(master) ✗ cargo add clap --features=derive
    Updating crates.io index
      Adding clap v4.3.23 to dependencies.
             Features:
             + color
             + derive
             + error-context
             + help
             + std
             + suggestions
             + usage
             - cargo
             - debug
             - deprecated
             - env
             - string
             - unicode
             - unstable-doc
             - unstable-styles
             - unstable-v5
             - wrap_help
    Updating crates.io index
➜  clap-v4-test git:(master) ✗
```

꼭 features에 derive를 추가해 주십시오.

아주 편합니다.

이제 toml 파일을 볼까요?

```bash
➜  clap-v4-test git:(master) ✗ cat Cargo.toml
[package]
name = "clap-v4-test"
version = "0.1.0"
edition = "2021"

# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html

[dependencies]
clap = { version = "4.3.23", features = ["derive"] }
➜  clap-v4-test git:(master) ✗
```

아주 잘 실행되었네요.

---

## clap 기본 사용법

clap의 Parser를 derive 시킬 건데요.

```rust
use clap::Parser;

#[derive(Parser, Debug)]
struct Cli {
  name: String,
  age: usize,
}

fn main() {
  let cli = Cli::parse();

  println!("{:?}", cli)
}
```
위 코드처럼 clap을 사용하려면 아규먼트로 받을 구조체를 하나 만들면 됩니다.

그리고 이 구조체 Cli에는 Parser를 derive 시켜주면 러스트가 알아서 해줍니다.

그리고 main 함수에서 parse() 함수를 실행시켜 주면 됩니다.

이제 실행해 볼까요?

```bash
➜  clap-v4-test git:(master) ✗ cargo run --
    Finished dev [unoptimized + debuginfo] target(s) in 0.06s
     Running `target/debug/clap-v4-test`
error: the following required arguments were not provided:
  <NAME>
  <AGE>

Usage: clap-v4-test <NAME> <AGE>

For more information, try '--help'.
➜  clap-v4-test git:(master) ✗ 
```

위와 같이 나오는데요.

아규먼트가 필수라고 나오네요.

```bash
➜  clap-v4-test git:(master) ✗ cargo run -- --help
    Finished dev [unoptimized + debuginfo] target(s) in 0.19s
     Running `target/debug/clap-v4-test --help`
Usage: clap-v4-test <NAME> <AGE>

Arguments:
  <NAME>  
  <AGE>   

Options:
  -h, --help  Print help
➜  clap-v4-test git:(master) ✗ 
```

위 코드는 `--help` 옵션을 줘서 상세 설명을 보여달라고 명령어를 입력한 겁니다.

우리가 Cli 구조체에 정한 name과 age가 꼭 필요하다고 합니다.

이제, name과 age를 입력해 볼까요?

```bash
➜  clap-v4-test git:(master) ✗ cargo run -- BTS 10
    Finished dev [unoptimized + debuginfo] target(s) in 0.18s
     Running `target/debug/clap-v4-test BTS 10`
Cli { name: "BTS", age: 10 }
➜  clap-v4-test git:(master) ✗ 
```

헷갈리시는 분을 위해 실제 컴파일된 파일을 실행해 볼까요?

```bash
➜  clap-v4-test git:(master) ✗ ./target/debug/clap-v4-test BTS 10
Cli { name: "BTS", age: 10 }
➜  clap-v4-test git:(master) ✗ 
```

`cargo run --` 이렇게 하고 그 뒤에 아규먼트를 넣는 것과 같은 결과입니다.

아규먼트는 std::env::args의 벡터방식인데요, 그래서 벡터의 1번째는 name에 매치시키고, 2번째는 age에 매치시킵니다.

그러면 0번째는 뭘까요?

0번째는 싫행 파일입니다.

---

## help 옵션에서 보여주는 아규먼트 설명 첨가하기

만약 `--help`라고 입력했을 때 name과 age에 설명을 넣어 볼까요?

```rust
#[derive(Parser, Debug)]
struct Cli {
    /// name에는 이름을 넣으세요.
    name: String,

    /// age에는 나이를 넣으세요.
    age: usize,
}
```
이렇게 하면 됩니다.

슬래시 3개를 쓰면 clap이 알아서 처리해 줍니다.

실행 결과는 아래와 같습니다.

```bash
➜  clap-v4-test git:(master) ✗ cargo run -- --help
   Compiling clap-v4-test v0.1.0 (/Users/cpro95/Codings/Rust/clap-v4-test)
    Finished dev [unoptimized + debuginfo] target(s) in 2.12s
     Running `target/debug/clap-v4-test --help`
Usage: clap-v4-test <NAME> <AGE>

Arguments:
  <NAME>  name에는 이름을 넣으세요
  <AGE>   age에는 나이를 넣으세요

Options:
  -h, --help  Print help
➜  clap-v4-test git:(master) ✗ 
```

## 아규먼트 방식은 순서를 바꾸면 에러가 생깁니다.

순서를 바꿔서 테스트해 볼까요?

```bash
➜  clap-v4-test git:(master) ✗ cargo run -- 10 BTS
    Finished dev [unoptimized + debuginfo] target(s) in 0.06s
     Running `target/debug/clap-v4-test 10 BTS`
error: invalid value 'BTS' for '<AGE>': invalid digit found in string

For more information, try '--help'.
➜  clap-v4-test git:(master) ✗ 
```
위와 같이 age 부분에는 usize 즉 정수가 와야 되는데 BTS라는 문자열이 와서 에러가 났습니다.

그러면 왜 name 부분은 에러가 안 났을까요?

10을 숫자가 아닌 String으로도 인식할 수 있기 때문이죠.

---

## 아규먼트 방식 말고 옵션 방식으로 바꾸기

우리가 보통 많이 쓰이는 방식이 `--name=BTS --age=10` 이런 방식인데요.

clap은 이 방식도 아주 쉽게 제공해 줍니다.

```rust
#[derive(Parser, Debug)]
struct Cli {
    /// name에는 이름을 넣으세요.
    #[arg(short, long)]
    name: String,

    /// age에는 나이를 넣으세요.
    #[arg(short, long)]
    age: usize,
}
```

위와 같이 arg라고 주면 됩니다.

short와 long은 잠시 뒤에 설명하겠습니다.

실행 결과는 아래와 같습니다.

```bash
➜  clap-v4-test git:(master) ✗ cargo run -- --help
   Compiling clap-v4-test v0.1.0 (/Users/cpro95/Codings/Rust/clap-v4-test)
    Finished dev [unoptimized + debuginfo] target(s) in 1.82s
     Running `target/debug/clap-v4-test --help`
Usage: clap-v4-test --name <NAME> --age <AGE>

Options:
  -n, --name <NAME>  name에는 이름을 넣으세요
  -a, --age <AGE>    age에는 나이를 넣으세요
  -h, --help         Print help
➜  clap-v4-test git:(master) ✗ 
```

위 결과와 같이 이제는 Arguments가 Options가 됐습니다.

테스트해 볼까요?

```bash
➜  clap-v4-test git:(master) ✗ cargo run -- --name BTS --age 10
    Finished dev [unoptimized + debuginfo] target(s) in 0.19s
     Running `target/debug/clap-v4-test --name BTS --age 10`
Cli { name: "BTS", age: 10 }
➜  clap-v4-test git:(master) ✗ 
```

위와 같이 `--name`이라고 쓰는 방식이 arg(long) 방식이고요.

```bash
➜  clap-v4-test git:(master) ✗ cargo run -- -n BTS -a 10       
    Finished dev [unoptimized + debuginfo] target(s) in 0.06s
     Running `target/debug/clap-v4-test -n BTS -a 10`
Cli { name: "BTS", age: 10 }
➜  clap-v4-test git:(master) ✗ 
```

위와 같이 `-n` 이라고 쓰는 방식이 arg(short) 방식입니다.

```bash
➜  clap-v4-test git:(master) ✗ cargo run -- -n=BTS --age 10
    Finished dev [unoptimized + debuginfo] target(s) in 0.17s
     Running `target/debug/clap-v4-test -n=BTS --age 10`
Cli { name: "BTS", age: 10 }
➜  clap-v4-test git:(master) ✗ 
```

위와 같이 혼용해서 써도 되고, = 부호를 넣어도 됩니다.

arg를 이용한 Options 방식은 Arguments 방식의 순서가 틀릴 때 생기는 문제를 해결해 줍니다.

## 디폴트 값 넣기

```rust
#[derive(Parser, Debug)]
struct Cli {
    /// name에는 이름을 넣으세요.
    #[arg(short, long, default_value_t = String::from("BTS"))]
    name: String,

    /// age에는 나이를 넣으세요.
    #[arg(short, long, default_value_t = 10)]
    age: usize,
}
```

이제 실행 결과를 볼까요?

```bash
➜  clap-v4-test git:(master) ✗ cargo run
    Finished dev [unoptimized + debuginfo] target(s) in 0.06s
     Running `target/debug/clap-v4-test`
Cli { name: "BTS", age: 10 }
➜  clap-v4-test git:(master) ✗ cargo run --
    Finished dev [unoptimized + debuginfo] target(s) in 0.06s
     Running `target/debug/clap-v4-test`
Cli { name: "BTS", age: 10 }
➜  clap-v4-test git:(master) ✗ 
```

디폴트 값이 아주 잘 반영되네요.

```bash
➜  clap-v4-test git:(master) ✗ cargo run -- --name NewJeans
    Finished dev [unoptimized + debuginfo] target(s) in 0.06s
     Running `target/debug/clap-v4-test --name NewJeans`
Cli { name: "NewJeans", age: 10 }
➜  clap-v4-test git:(master) ✗ 
```

지금까지 러스트 언어에서 clap을 이용한 CLI 앱 만들기를 해 봤습니다.

다음 시간에는 clap의 Command와 SubCommand에 대해 알아보겠습니다.

그럼.
