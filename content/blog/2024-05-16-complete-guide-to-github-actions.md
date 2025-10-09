---
slug: 2024-05-16-complete-guide-to-github-actions
title: GitHub Actions 완벽 가이드
date: 2024-05-16 13:14:17.202000+00:00
summary: GitHub Actions 완벽 가이드
tags: ["github actions"]
contributors: []
draft: false
---

** 목 차 **

- [GitHub Actions 완벽 가이드](#github-actions-완벽-가이드)
  - [GitHub Actions란?](#github-actions란)
  - [요금 (2024년 5월 현재)](#요금-2024년-5월-현재)
  - [그 전에: YAML의 작성법을 미리 공부하기](#그-전에-yaml의-작성법을-미리-공부하기)
    - [YAML과 JSON의 상호 변환 연습](#yaml과-json의-상호-변환-연습)
  - [기본적인 작성법](#기본적인-작성법)
      - [GitHub Actions 실행 로그](#github-actions-실행-로그)
    - [무엇을 실행할까?](#무엇을-실행할까)
  - [여러 명령어를 실행하기](#여러-명령어를-실행하기)
  - [용어](#용어)
      - [워크플로우 🟩](#워크플로우-)
      - [잡 🟦](#잡-)
      - [트리거 🟪](#트리거-)
  - [액션](#액션)
  - [CI/CD](#cicd)
  - [실무 사용 예](#실무-사용-예)

---

## GitHub Actions란?

GitHub Actions는 GitHub에서 제공하는 "스크립트를 실행할 수 있는" 서비스입니다.

구체적으로 설명하면, 리포지토리에 아래와 같은 디렉토리를 만들고, 그 안에 "이런 상황에서 이걸 실행해줘"라는 YAML 파일을 넣어두면, GitHub이 "오! 이걸 실행하면 되겠군!" 하고 인식하여 실행해줍니다.

```
📁.github
　└📁workflows
   　└📄foo.yml  👈 이 파일의 내용이 실행됨
```

## 요금 (2024년 5월 현재)

공개 리포지토리에서는 무료로 무제한 사용할 수 있습니다. 대단하죠!

비공개 리포지토리에서도 매월 2,000분의 무료 사용 시간이 제공됩니다.

## 그 전에: YAML의 작성법을 미리 공부하기

YAML을 미리 공부해 두는 것이 좋습니다.

왜냐하면, YAML의 작성법을 모르면 "이게 GitHub Actions의 기능인가? YAML의 기능인가?" 헷갈릴 수 있기 때문입니다.

추천하는 학습 방법은 JSON으로 여러 데이터를 표현해본 후 "이걸 YAML로 표현하면 어떻게 될까?"를 연습해보는 것입니다.

YAML 예제

```yaml
jobs:
  echo_hello:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Nice to meet you!!"
      - run: echo "My Name is Park!!"
      - run: echo "I love programming!!"
```

### YAML과 JSON의 상호 변환 연습

이렇게 "이 YAML을 JSON으로 변환하면 어떻게 될까?"를 상상하고, 실제로 JSON으로 변환해보는 연습은 아주 좋은 학습 방법입니다.

VS Code Extension에 있는 "YAML to JSON"를 사용하면 쉽습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEj2qHzCgjfotjAewZGpgR6CVmgGw7CPI0biTzdN7d9RV2uvBS2Egk0RoeoS5jDr1BloLgJm_QTP7nN4rbP9vuxT3LgENRqeTc1CZeo-0b08mnNXbmrZvLSa-2aRSYe93buEbHvzK1dUiom6K_UpcL5z1iSfjTV48XXl8gC93rugqDSZSCwlhYbgA1RHMcc)

위 그림의 익스텐션으로 YAML 예제를 JSON 형태로 변환하면 아래와 같이 나옵니다.

```json
{
  "jobs": {
    "echo_hello": {
      "runs-on": "ubuntu-latest",
      "steps": [
        {
          "run": "echo \"Nice to meet you!!\""
        },
        {
          "run": "echo \"My Name is Park!!\""
        },
        {
          "run": "echo \"I love programming!!\""
        }
      ]
    }
  }
}
```

---

## 기본적인 작성법

먼저, 아래와 같은 디렉토리 구조와 foo.yml 파일을 만들어주세요.

```
📁.github
　└📁workflows
   　└📄foo.yml
```

참고로 파일 이름은 무엇이든 상관없지만, .github나 workflows와 같은 디렉토리 이름은 정확히 맞춰야 합니다.

한 글자라도 다르면 작동하지 않으니 주의하세요!

foo.yml 파일에는 아래와 같이 작성합니다.

```yaml
name: GitHub Actions Demo

on: [push]

jobs:
  echo_hello_world:
    runs-on: ubuntu-latest
    steps:
      - run: echo "hello world!!"
```

내용은 "push 되었을 때 echo 해줘"라는 의미입니다. (자세한 내용은 나중에 설명하겠습니다.)

실제로 리포지토리를 만들고 main 브랜치에 push하면, GitHub가 "이걸 실행하면 되겠군" 하고 자동으로 실행해줍니다.

#### GitHub Actions 실행 로그

GitHub가 실행해주는 GitHub Actions의 실행 로그는 리포지토리의 Actions 탭에서 확인할 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhXq0z9sti8AbCl22kYipJA9VG3iPv2Gr1qdbRDLPt-wXVogC8kPHBEAdC5agaDPinnSEyolggYroQSCIWpMU-zfF_Uev2rSHQOcZ3pt87MyoncQp5UHgqnfwxSpiMR_UeEoJ9cQm0gcnHkMuXtFaIZpmac0rCoZMrsAONEp1VxEzRXys8XRLqHdP5hIFQ)

GitHub가 실행하는 GitHub Actions의 로그는 리포지토리의 Actions탭에서 확인할 수 있습니다.

### 무엇을 실행할까?

`echo "hello world!!"` 부분에는 기본적으로 명령어를 무엇이든 쓸 수 있습니다.

다만, `runs-on` 부분에서 지정한 OS에서 사용할 수 있는 명령어여야 합니다.

이 경우, Ubuntu를 지정했기 때문에 UNIX 계열의 명령어는 기본적으로 사용할 수 있습니다.

예를 들어, 아래와 같이 `ls` 명령어를 실행할 수도 있습니다.

```yaml
jobs:
  echo_hello_world:
    runs-on: ubuntu-latest
    steps:
      - run: ls
```

또는 아래와 같이 "특정 URL에 요청을 보내기"도 가능합니다.

```yaml
jobs:
  echo_hello_world:
    runs-on: ubuntu-latest
    steps:
      - run: curl http://example.com
```

## 여러 명령어를 실행하기

`steps` 안에 `run`을 추가하면 여러 명령어를 실행할 수 있습니다.

```yaml
jobs:
  echo_hello:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Nice to meet you!!"
      - run: echo "My Name is Park!!"
      - run: echo "I love programming!!"
```

또한, 각각에 `name:`을 붙일 수도 있습니다.

```yaml
jobs:
  echo_hello:
    runs-on: ubuntu-latest
    steps:
      - name: "인사"
        run: echo "Nice to meet you!!"

      - name: "이름 말하기"
        run: echo "My Name is Park!!"

      - name: "취미 말하기"
        run: echo "I love programming!!"
```

`steps` 안에 작성하는 각 요소를 "스텝"이라고 부릅니다.

기본적으로 위와 같이 "하나의 스텝 = 하나의 명령어와 이름"으로 구성하면 이해하기 쉽습니다.

참고로, 처음 코드를 아래와 같이 작성할 수도 있습니다. (이는 YAML 문법입니다.)

```yaml
jobs:
  echo_hello_world:
    runs-on: ubuntu-latest
    steps:
      - name: "자기소개"
        run: |
          echo "Nice to meet you!!"
          echo "My Name is Park!!"
          echo "I love programming!!"
```

하지만 이렇게 하나의 스텝에서 여러 명령어를 실행하면, 실패했을 때 원인을 파악하기 어려워지므로 기본적으로 "하나의 스텝 = 하나의 명령어"로 구성하는 것이 좋습니다.

## 용어

여기서부터는 용어를 중심으로 설명하겠습니다.

#### 워크플로우 🟩

"이런 상황에서 이걸 실행해줘"라는 YAML 파일에 작성된 처리를 워크플로우라고 부릅니다.

"YAML 파일 = 하나의 워크플로우"라고 이해하면 됩니다.

#### 잡 🟦

여러 명령어를 묶은 단위를 잡이라고 합니다.

잡은 여러 개 정의할 수 있습니다.

예를 들어, 아래와 같이 잡을 두 개 작성할 수 있습니다.

```yaml
jobs:
  echo_hello:
    runs-on: ubuntu-latest
    steps:
      - name: "인사"
        run: echo "Nice to meet you!!"

      - name: "이름 말하기"
        run: echo "My Name is Park!!"

      - name: "취미 말하기"
        run: echo "I love programming!!"

  echo_goodbye:
    runs-on: ubuntu-latest
    steps:
      - name: "작별 인사"
        run: echo "Good Bye!!"
```

여기서 중요한 점은 워크플로우는 위에서 아래로 순차적으로 실행되지만, 잡은 병렬로 실행된다는 것입니다.

이 경우, `echo_hello`와 `echo_goodbye`는 동시에 병렬로 실행됩니다.

잡이 늘어나면 GitHub Actions 화면에서도 잡이 늘어나게 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjBUgVykpGEENX4d3X5F-1oBdZ34RLsOojUegucnO8AFpfqjuviKUE1_0XbnfXgCltfQvhH9XxrbIRFxMdZPIgSE2L8Pm7meGYddJLAyv5x_5Ee7_RpjGd8kjb-t8SORwERNauZKoEhSqZnwIK2WTb25jnC04yoWDGT9FEcPBYA4hTaaai7P0ci96GOFBk)

따라서, 예를 들어 "작별 인사" 스텝을 "취미 말하기" 스텝 후에 실행하고 싶다면, 아래와 같이 하나의 잡 안에 작성해야 합니다.

```yaml
jobs:
  echo_hello:
    runs-on: ubuntu-latest
    steps:
      - name: "인사"
        run: echo "Nice to meet you!!"

      - name: "이름 말하기"
        run: echo "My Name is Park!!"

      - name: "취미 말하기"
        run: echo "I love programming!!"

      - name: "작별 인사"
        run: echo "Good Bye!!"
```

반대로, 스텝 A와 스텝 B에 의존 관계가 없는 경우, 스텝 A와 스텝 B를 별도의 잡으로 정의하는 것이 좋습니다.

그만큼 빨리 끝나기 때문입니다.

참고로, `echo_goodbye` 잡 안에 `needs: echo_hello`를 작성하면 "echo_hello가 완료되면 echo_goodbye를 실행해"라는 의미가 됩니다.

다만, 이것에 대한 자세한 설명은 길어지므로, 다른 글에서 다루겠습니다!

또한, 워크플로우도 잡과 마찬가지로 동시에 병렬로 실행됩니다.

예를 들어, 아래와 같이 여러 워크플로우를 작성한 경우, 조건에 맞는 모든 워크플로우가 동시에 실행됩니다.

```
📁.github
　└📁workflows
   　├🗒1.yml
   　├🗒2.yml
   　└🗒3.yml
```

#### 트리거 🟪

"어떤 타이밍에 실행할지"를 트리거라고 부릅니다. `yml` 파일의 `on` 부분에서 트리거를 지정할 수 있습니다.

예를 들어, 아래와 같이 작성하면 "15분마다 실행해"라는 의미가 됩니다.

```yaml
on:
  schedule:
    - cron: '*/15 * * * *'
```

아래와 같이 작성하면 "풀 리퀘스트가 생성되면 실행해"라는 의미가 됩니다.

```yaml
on:
  pull_request:
```

아래와 같이 작성하면 "수동으로 실행할 수 있게 해줘"라는 의미가 됩니다.

```yaml
on:
  workflow_dispatch:
```

`workflow_dispatch`를 지정하면 Actions 탭에서 수동으로 실행할 수 있게 됩니다.

```yaml
on:
  workflow_dispatch:
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEh6nBKA62poc4N_f3IyzWRc0_IX7m9P9LNVpDoD8jXS0i_doNmtU_kNLeS0HzzlScdxowH1SRowWKJfXJZsA6OfOTxmOqOKqmLGRq1XJKsn9Fh5WooQGwZjwqTN8tc1ILsJGfnznkTjh5OBTdCG2D4y4uxsj9xJyrHfjjMk0FZ0q5gatl8uxfcCMszghws)

아래와 같이 작성하면 "develop 브랜치에 push되면 실행해"라는 의미가 됩니다.

```yaml
on:
  push:
    branches:
      - develop
```

아래와 같이 작성하면 "apps 디렉토리 내의 파일에 변경이 있고, develop 브랜치에 push되면 실행해"라는 의미가 됩니다.

```yaml
on:
  push:
    branches:
      - develop
    paths:
      - 'apps/**'
```

이 외에도 여러 가지 타이밍을 지정할 수 있습니다.

공식 페이지에는 설정할 수 있는 타이밍이 모두 나와 있습니다.

[Workflow syntax for GitHub Actions - GitHub Docs](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)

---

## 액션

"다른 사람이 만든 처리 로직을 그대로 워크플로우의 일부로 사용하자"는 기능을 액션이라고 합니다.

참고로, GitHub Actions에서는 기본적으로 리포지토리의 소스가 포함되지 않습니다.

예를 들어, A라는 리포지토리에서 GitHub Actions를 실행하더라도, 그 실행 환경 내부에는 A 리포지토리의 소스가 존재하지 않습니다.

직접 준비해야 합니다.

"그럼 매번 `git clone` 해야 하나? 번거로운데!"라고 생각하실 수 있지만, 그런 번거로움을 덜기 위해 GitHub 공식에서 "이걸 사용하면 특정 리포지토리의 소스를 가져올 수 있어요~"라는 액션을 준비해두었습니다.

```yaml
uses: actions/checkout@v4
```

또한, GitHub Actions에서는 기본적으로 Node.js를 사용할 수 없기 때문에, Node.js를 설치하기 위한 액션도 준비되어 있습니다.

```yaml
uses: actions/setup-node@v3
```

이러한 액션은 `uses: 액션명` 형식으로 사용할 수 있습니다.

실제로, 이 두 가지를 사용하여 "GitHub Actions에서 내가 만든 `index.js`라는 스크립트를 실행하고 싶어!"라는 경우는 아래와 같이 작성할 수 있습니다.

```yaml
name: Run JavaScript in GitHub Actions

on:
  push:
    branches:
      - main

jobs:
  setup_and_run:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4  # 리포지토리의 소스를 가져옴

      - name: Set up Node.js
        uses: actions/setup-node@v3  # Node.js 설치
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm install

      - name: Run script
        run: node index.js
```

## CI/CD

GitHub Actions와 같은 서비스에서, "이 테스트를 실행해줘"라는 처리를 작성하는 것을 CI라고 부릅니다.

"여기에 배포해줘"라는 처리를 작성하는 것을 CD라고 부릅니다.

둘 다 작성하는 것을 CI/CD라고 부릅니다.

용어는 크게 중요하지 않지만, 개발 현장에서는 "CI가~", "CI/CD가~"처럼 당연히 사용되기 때문에 알아두는 것이 좋습니다.

참고로, 번역하면 아래와 같은 의미입니다.

CI: Continuous Integration (지속적 통합)
CD: Continuous Delivery & Deployment (지속적 제공 및 배포)

엄밀히 말하면, 이 CI/CD의 정의는 조금 다를 수 있지만, 많은 개발자가 이 의미로 사용하고 있으니 이 정도로 이해해두면 좋습니다.

---

## 실무 사용 예

실무에서 사용하는 구체적인 내용을 설명하면, 아래 4개의 잡을 포함하는 워크플로우가 있습니다.

1. **Build** (Next.js 등의 애플리케이션 빌드가 성공하는지 확인)
2. **Test** (작성한 모든 테스트가 통과하는지 확인)
3. **Lint** (ESLint 체크가 모두 통과하는지 확인)
4. **Type** (tsx의 타입 체크가 모두 통과하는지 확인)

이 워크플로우는 다음과 같은 경우에 트리거됩니다.

- 풀 리퀘스트가 열렸을 때
- 풀 리퀘스트가 다시 열렸을 때
- 풀 리퀘스트에 push가 되었을 때

그리고 "이 모든 잡이 성공적으로 완료되지 않으면 머지할 수 없다"라는 설정을 해두었습니다.

이 설정은 리포지토리의 Settings → Branches에서 할 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEh8VoWB1wgCyU6WKARLMrdU4c5F80R3-0dHW3pWyyKNX3lY_6CaVvDy8mietT7VdAF3qj8CrW6-1tq6rG4GE3mL8ImCwlwV76RDBEc5a5IsRYL5Kw0dMczZjMijOfKAzVC5BKQJDks0ADEZs6mK2-n1wa5b624_Wk4MMEL1MZ9pOnCTLUUrtIAI7KKUZBA)

끝.

