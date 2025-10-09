---
slug: 2023-08-19-understanding-rust-clap-command-subcommand
title: Rust 언어의 clap으로 Cli 앱에서 subcommand 만들기
date: 2023-08-19 07:08:43.198000+00:00
summary: clap으로 Cli 앱에서 다중 subcommand 만들기
tags: ["rust", "parser", "clap", "subcommand", "command"]
contributors: []
draft: false
---

안녕하세요?

오늘은 지난 시간에 이어 Rust의 clap 크레이트 공부를 계속해 보겠습니다.

지난 시간 강좌는 [여기](https://mycodings.fly.dev/blog/2023-08-19-beyond-chatgpt-how-to-use-rust-clap-crate)를 누르시면 됩니다.

```rust
use clap::{ Parser, Subcommand, Args };
```

일단 위와 같이 clap으로 Subcommand를 사용하려면 위와 같이 Parser, Subcommand, Args를 불러와야 합니다.

---

## Subcommand란?

subcommand는 요즘 Cli앱에서 자주 쓰이는 형식인데요.

```bash
clap-v4-test show --name BTS
```

위와 같이 실행파일 뒤에 show를 썼는데요.

이 show가 Subcommand이고, show 밑에는 또다시 아규먼트나 옵션이 들어올 수 있습니다.

show 말고 다른 Subcommand도 만들 수 있으니까요?

훨씬 복잡한 Cli앱을 만들 수 있겠죠.

이제 본격적인 Cli 구조체를 설계해 볼까요?

```rust
#[derive(Debug, Parser)]
struct Cli {
    #[clap(subcommand)]
    command: MyCommand,
}
```

일단 우리는 clap이란 매크로로 subcommand를 자동으로 작성하라고 해줍니다.

Cli 구조체에 command라는 "MyCommand"라는 subcommand만 있죠.

그러면 "MyCommand"라는 enum을 만들어야 합니다.

```rust
#[derive(Debug, Parser)]
struct Cli {
    #[clap(subcommand)]
    command: MyCommand,
}

#[derive(Subcommand, Debug)]
enum MyCommand {
    Show(ShowArgs),
}
```

자, 이제 `cargo run -- show` 처럼 show라는 subcommand를 만들었네요.

이제 show 밑에 아규먼트나 옵션을 넣어 줄 수 있는데요.

enum으로 만든 MyCommand에는 Show(ShowArgs)가 있네요.

그러면 여기서 Show는 subcommand 'show'가 되는 거고,

이 subcommand 'show'를 실행하는 구조체 ShowArgs를 따로 만들어 줘야 합니다.

```rust
#[derive(Debug, Parser)]
struct Cli {
    #[clap(subcommand)]
    command: MyCommand,
}

#[derive(Subcommand, Debug)]
enum MyCommand {
    Show(ShowArgs),
}

#[derive(Debug)]
struct ShowArgs {
    name: String,
}
```

일단 위와 같이 했네요.

위 방식은 ShowArgs가 아규먼트가 되는 겁니다.

```bash
➜  clap-v4-test git:(master) ✗ cargo run -- show BTS
   Compiling clap-v4-test v0.1.0 (/Users/cpro95/Codings/Rust/clap-v4-test)
    Finished dev [unoptimized + debuginfo] target(s) in 1.08s
     Running `target/debug/clap-v4-test show BTS`
Cli { command: Show(ShowArgs { name: "BTS" }) }
➜  clap-v4-test git:(master) ✗
```

위와 같이 실행됩니다.

이제 옵션 방식으로 바꿔볼까요?

```rust
use clap::{ Parser, Subcommand, Args };

#[derive(Debug, Parser)]
struct Cli {
    #[clap(subcommand)]
    command: MyCommand,
}

#[derive(Subcommand, Debug)]
enum MyCommand {
    Show(ShowArgs),
}

#[derive(Args, Debug)]
struct ShowArgs {
    #[arg(short, long)]
    name: String,
}

fn main() {
    let cli = Cli::parse();

    println!("{:?}", cli);
}
```

위와 같이 하면 실행 결과는 아래와 같습니다.

```bash
➜  clap-v4-test git:(master) ✗ cargo run -- show --name BTS
    Finished dev [unoptimized + debuginfo] target(s) in 0.06s
     Running `target/debug/clap-v4-test show --name BTS`
Cli { command: Show(ShowArgs { name: "BTS" }) }
➜  clap-v4-test git:(master) ✗ cargo run -- show -n=BTS
    Finished dev [unoptimized + debuginfo] target(s) in 0.06s
     Running `target/debug/clap-v4-test show -n=BTS`
Cli { command: Show(ShowArgs { name: "BTS" }) }
➜  clap-v4-test git:(master) ✗ cargo run -- show -n BTS
    Finished dev [unoptimized + debuginfo] target(s) in 0.06s
     Running `target/debug/clap-v4-test show -n BTS`
Cli { command: Show(ShowArgs { name: "BTS" }) }
➜  clap-v4-test git:(master) ✗
```

어떤가요?

우리가 지난 시간에 배운 옵션 방식으로 작성되었습니다.

상세 도움말 페이지는 아래와 같이 나오게 됩니다.

```bash
➜  clap-v4-test git:(master) ✗ cargo run -- show --help
    Finished dev [unoptimized + debuginfo] target(s) in 0.06s
     Running `target/debug/clap-v4-test show --help`
Usage: clap-v4-test show --name <NAME>

Options:
  -n, --name <NAME>
  -h, --help         Print help
➜  clap-v4-test git:(master) ✗ cargo run -- --help
    Finished dev [unoptimized + debuginfo] target(s) in 0.05s
     Running `target/debug/clap-v4-test --help`
Usage: clap-v4-test <COMMAND>

Commands:
  show
  help  Print this message or the help of the given subcommand(s)

Options:
  -h, --help  Print help
➜  clap-v4-test git:(master) ✗ cargo run -- --help
    Finished dev [unoptimized + debuginfo] target(s) in 0.05s
     Running `target/debug/clap-v4-test --help`
Usage: clap-v4-test <COMMAND>

Commands:
  show
  help  Print this message or the help of the given subcommand(s)

Options:
  -h, --help  Print help
➜  clap-v4-test git:(master) ✗ cargo run -- show --help
    Finished dev [unoptimized + debuginfo] target(s) in 0.17s
     Running `target/debug/clap-v4-test show --help`
Usage: clap-v4-test show --name <NAME>

Options:
  -n, --name <NAME>
  -h, --help         Print help
➜  clap-v4-test git:(master) ✗
```

어떤가요?

쉽게 clap으로 subcommand를 만들었는데요.

그러면 name 값을 파싱 하는 방법에 대해 알아볼까요?

```rust
fn main() {
    let cli = Cli::parse();

    match &cli.command {
        MyCommand::Show(show_args) => println!("name is {}", show_args.name),
    }
}
```

실행 결과는 아래와 같습니다.

```bash
➜  clap-v4-test git:(master) ✗ cargo run -- show --name BTS
    Finished dev [unoptimized + debuginfo] target(s) in 0.06s
     Running `target/debug/clap-v4-test show --name BTS`
name is BTS
➜  clap-v4-test git:(master) ✗
```

MyCommand::Show가 enum 타입이라 match를 써야 합니다.

그리고 Show(ShowArgs)에 있는 ShowArgs는 show_args라는 변수로 지정하고, 최종적으로 show_args.name이라고 접근하면 됩니다.

---

## 다중 Subcommand 만드는 법

Clap에서 Subcommand는 맨 처음 구조체에서 시작하는데요.

구조체 안에 enum이 있고 enum안에 다시 구조체가 오는 방식입니다.

최종적으로는 구조체가 오고요.

```rust
use clap::{ Parser, Subcommand, Args };

#[derive(Debug, Parser)]
struct Cli {
    #[clap(subcommand)]
    entity_type: EntityType,
}

#[derive(Debug, Subcommand)]
enum EntityType {
    /// User for create, delete
    User(UserCommand),

    /// Video for create, delete
    Video(VideoCommand),
}

#[derive(Debug, Args)]
struct UserCommand {
    #[clap(subcommand)]
    command: UserSubcommand,
}

#[derive(Debug, Subcommand)]
enum UserSubcommand {
    /// User Create
    Create(CreateUser),

    /// User Delete
    Delete(DeleteUser),
}

#[derive(Debug, Args)]
struct CreateUser {
    /// name of the user
    name: String,

    /// email of the user
    email: String,
}

#[derive(Debug, Args)]
struct DeleteUser {
    /// name of the user
    name: String,
}

#[derive(Debug, Args)]
struct VideoCommand {
    #[clap(subcommand)]
    command: VideoSubCommand,
}

#[derive(Debug, Subcommand)]
enum VideoSubCommand {
    Show(VideoShow),
}

#[derive(Debug, Args)]
struct VideoShow {
    /// id of video
    id: usize,
}

fn main() {
    let cli = Cli::parse();

    println!("{:?}", cli);
}
```

실행 결과는

```bash
➜  clap-v4-test git:(master) ✗ cargo run
   Compiling clap-v4-test v0.1.0 (/Users/cpro95/Codings/Rust/clap-v4-test)
    Finished dev [unoptimized + debuginfo] target(s) in 2.21s
     Running `target/debug/clap-v4-test`
Usage: clap-v4-test <COMMAND>

Commands:
  user   User for create, delete
  video  Video for create, delete
  help   Print this message or the help of the given subcommand(s)

Options:
  -h, --help  Print help
➜  clap-v4-test git:(master) ✗ cargo run -- --help
    Finished dev [unoptimized + debuginfo] target(s) in 0.06s
     Running `target/debug/clap-v4-test --help`
Usage: clap-v4-test <COMMAND>

Commands:
  user   User for create, delete
  video  Video for create, delete
  help   Print this message or the help of the given subcommand(s)

Options:
  -h, --help  Print help



➜  clap-v4-test git:(master) ✗ cargo run -- user --help
    Finished dev [unoptimized + debuginfo] target(s) in 0.06s
     Running `target/debug/clap-v4-test user --help`
User for create, delete

Usage: clap-v4-test user <COMMAND>

Commands:
  create  User Create
  delete  User Delete
  help    Print this message or the help of the given subcommand(s)

Options:
  -h, --help  Print help
➜  clap-v4-test git:(master) ✗
```

user, video라는 SubCommand가 있고, user 밑에는 다시 create, delete란 Subcommand가 있습니다.

```bash
➜  clap-v4-test git:(master) ✗ cargo run -- user create --help
    Finished dev [unoptimized + debuginfo] target(s) in 0.18s
     Running `target/debug/clap-v4-test user create --help`
User Create

Usage: clap-v4-test user create <NAME> <EMAIL>

Arguments:
  <NAME>   name of the user
  <EMAIL>  email of the user

Options:
  -h, --help  Print help
➜  clap-v4-test git:(master) ✗
```

위와 같이 user creaate 밑에는 아규먼트 방식으로 name과 이메일이 보이네요.

```bash
  clap-v4-test git:(master) ✗ cargo run -- user create BTS bts@hybe.com
    Finished dev [unoptimized + debuginfo] target(s) in 0.17s
     Running `target/debug/clap-v4-test user create BTS 'bts@hybe.com'`
Cli { entity_type: User(UserCommand { command: Create(CreateUser { name: "BTS", email: "bts@hybe.com" }) }) }
➜  clap-v4-test git:(master) ✗
```

어떤가요?

아주 복잡한 2단계 Subcommand도 만들 수 있게 되었네요.

그럼.
