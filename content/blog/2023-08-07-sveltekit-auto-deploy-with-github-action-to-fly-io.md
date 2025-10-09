---
slug: 2023-08-07-sveltekit-auto-deploy-with-github-action-to-fly-io
title: SvelteKit 실전 예제 3편 - Github Action으로 자동 배포하기(Auto Deploy)
date: 2023-08-07 04:18:52.721000+00:00
summary: Github Action 살펴보기 및 SvelteKit을 Fly.io에 자동으로 배포해 보기
tags: ["github action", "sveltekit", "sveltejs", "fly.io", "ssr"]
contributors: []
draft: false
---

안녕하세요?

이번 시간에는 지난 시간에 약속한 Github Action을 이용한 자동 배포 방식에 대해 알아보겠습니다.

**-지난 시간 강좌 보기-**

[SvelteKit 실전 예제 - Fly.io에 배포(deploy)하기 with 서버 사이드 렌더링](https://mycodings.fly.dev/blog/2023-08-03-how-to-deploy-sveltekit-to-fly-io-with-server-side-rendering)

[SvelteKit 실전 예제 2편 - 서버 사이드 렌더링 풀 스택 무비 앱 만들기](https://mycodings.fly.dev/blog/2023-08-05-sveltekit-server-side-full-stack-example-and-fly-io-deploy)

그러면 시작하겠습니다.

---

## Github Repository 만들기

먼저, Github Action을 사용하려면 Github Repository 새로 만들어야 하는데요.

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/cpro95/sveltekit-deploy-on-fly-io.git
git branch -M main
git push -u origin main
```

이제 Fly.io에 배포하기 위한 Github Secrets를 먼저 설정하겠습니다.

먼저, 필요한 Secrets는 FLY_API_TOKEN입니다.

이 토큰이 있어야 Github Action으로 Fly.io에 배포할 수 있는 권한이 생깁니다.

FLY_API_TOKEN을 구하는 방법은 쉽습니다.

```bash
flyctl auth token
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEglrv_NPUkvRkBlkP-K9j82FX5YWRUGHIw4GQJO7R6EUJZeHDJ209uYdTQsA5o6pDfwnkSrhYsN4AVYbh2v6oPPUnFdWGQSQZhxB0IeNeVPGm5X517LS0ihediVcM0lRcbJza9o3uI4SECbzoiyjgyTh8sYSW0a-Gh7QUDRO_UqWlYuvNMYtW_wpMyOxp4)

위와 같이 나오면 이걸 꼭 복사해 두십시오.

마지막으로 앱 구동에 필요한 TMDB_API_KEY가 필요합니다.

요건 지난 시간에 구해 놨을 겁니다.

그럼, 아까 만든 Github Reposity에서 Secrets를 만들도록 하겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEioputzDNc1J6FSsXDSlUSHcB_XctLvWdU4mhbvfM-tghVUPaekM6KQEC-Kjl6COz-kJn1NIDrXkupFXlG08rvdjfthjWN0Dmj0avKjfh6ooElJm0yLX-6gqLmLoTvTY6KfO3BIuKuh4hEkDLpIGhOBLwAzzemfmLeih9W7b4-EooZm_saBGfgF_29QiAI)

![](https://blogger.googleusercontent.com/img/a/AVvXsEi8RD_J_wc8xpmJZlR5viNf50-Tm0rs-Kc0IN8gEt2VC9EaCr_YRoVdHA1rI16kva77pBaB0b2-Y6176RlizsPLdcBWoEJtUTnteyFyWWB3hZ0wI1XH_dEbYMD2B-MWWk44Q8KTTPEml1aP-J4bZHafqkecFKyZT1kxOXAXrXiugnBXtYE5DVvW3LaJtws)

위와 같이 세팅을 했으면 Github에서 준비는 끝났습니다.

---

## Github Action 만들기

Github Action은 자신의 프로젝트에서 .github 폴더를 만들고 그 밑에 workflows 폴더를 만들고 그 밑에 Action을 yaml 파일로 저장하면 됩니다.

우리는 배포가 목적이기 때문에 deploy.yaml 파일로 하겠습니다.

확장자는 .yml도 가능합니다.

최종 위치는 `.github/workflows/deploy.yaml`입니다.

그럼 deploy.yaml 파일에 내용을 작성해 볼까요?

```yaml
name: GitHub Actions Push to Fly_io
run-name: ${{ github.actor }} is testing out GitHub Actions 🚀
on:
  push:
    branches:
      - main

jobs:
  lint:
    name: 'My ESLint'
    runs-on: ubuntu-latest
    steps:
      - name: 'Checkout Repo'
        uses: actions/checkout@v3

      - name: 'Setup Node'
        uses: actions/setup-node@v3
        with:
          node-version: 16

      - name: 'Download deps'
        run: npm install

      - name: 'Lint'
        run: npm run lint
```

YAML 형식은 파이선처럼 탭을 중요시하기 때문에 조심하셔야 합니다.

먼저, 위에 만든 걸 설명해 보면,

첫 번째 name은 이 Action의 이름입니다.

run-name은 Github Repository에서 보이게 되는 이름입니다.

그리고 on 이 부분이 중요한데요.

on 과 push 그리고 branches 가 main이라고 YAML 형식에 맞게 지정했는데요.

이것의 뜻은 바로 branch main의 git push가 발생했을 때 이 Action이 작동한다는 뜻입니다.

그럼, Action의 목적은 바로 jobs 인데요.

즉, 무언가 일을 해야하잖아요. 그게 여기서는 jobs 밑에 넣습니다.

jobs 다음 줄에 lint 라고 되어 있는게 보이실 겁니다.

lint는 제가 정한 이름입니다.

원하는 이름으로 해도 됩니다.

결국 jobs에는 여러 가지 job이 있을 수 있는데요.

먼저, lint라는 job을 작성한 거라고 볼 수 있습니다.

---

## lint job에 대해 알아보기

lint job을 찬찬히 살펴보면 name은 다 아실 겁니다.

runs-on은 실행 환경인데요.

보통 서버는 ubuntu-latest 즉, 우분투 최신판에서 돌리는 게 일반적입니다.

그리고 중요한 steps 라고 있는데요.

이게 단계적으로 작업하라는 명령어입니다.

steps에는 총 4개의 name이 있는데요.

즉, 4개의 작업이 있다는 뜻입니다.

첫 번째가 Checkout Repo라는 건데요.

Github Repository에서 지금 Repository를 사용하라는 뜻입니다.

uses에는 actions/checkout@v3라고 쓰여있는데요.

이건 일종의 패키지로 Checkout Repo를 수행하는 패키지입니다.

Github에서 만든 것도 있고, 다른 사람들이 만든 것도 있습니다.

두 번째가 Setup Node인데요.

우리 앱은 NodeJS앱이니까 NodeJS를 준비하라는 얘기입니다.

Node Version은 16을 사용하라고 했습니다.

세 번째는 npm install 입니다.

마지막으로 우리가 lint job에 맞게 npm run lint를 수행하라는 뜻입니다.

이제 여기까지 저장했으면 테스트해 볼까요?

---

## 잠깐, +layout.svelte 수정해서 헤더 부분 손보기

```js
<script>
  import "../app.postcss";
</script>

<div class="p-4">
  <header class="mb-4">
    <nav class="flex space-x-4">
      <a href="/">Home</a>
    </nav>
  </header>
  <slot />
</div>
```

이 부분은 지난 시간에 Header를 안 만들었었는데요.

이렇게 만들어 놓으면 모든 페이지에서 Home으로 가는 링크가 나오게 됩니다.

---

## Github Action 작동되는 걸 보기

이제 git commit을 다시하면 Github 홈페이지에서 해당 Repository로 간 다음 Actions로 들어가 보면 아래와 같이 나올겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgmR_DTutHwWnlkCveS-GdrQt285bcS6zf6WzU5fYIAiQqnLXzePqi_ZQgYOqWfsBii3choippfg_OML0lkBGqptP6YYy0TJ66Pie7SQZivX0mhkqITP5bj0VIXDYFDKtvVMRBhEsN_r__waW_5qLbug1hBAluZB-pV0RKhQSvuU4onQQPbPgExvvKWyG8)

위와 같이 나올 겁니다.

Github Action은 정상적으로 작동하네요.

---

## Fly.io에 Deploy하는 Job 만들기

이제 다시 deploy.yaml 파일을 더 작성해 보겠습니다.

```yaml
name: GitHub Actions Push to Fly_io
run-name: ${{ github.actor }} is testing out GitHub Actions 🚀
on:
  push:
    branches:
      - main

jobs:
  lint:
    name: 'My ESLint'
    runs-on: ubuntu-latest
    steps:
      - name: 'Checkout Repo'
        uses: actions/checkout@v3

      - name: 'Setup Node'
        uses: actions/setup-node@v3
        with:
          # cache: npm
          # cache-dependency-path: ./package.json
          node-version: 16

      - name: 'Download deps'
        run: npm install

      - name: 'Lint'
        run: npm run lint

  deploy:
    name: 🚀 Deploy
    runs-on: ubuntu-latest
    needs: [lint]
    steps:
      - name: ⬇️ Checkout repo
        uses: actions/checkout@v3

      - name: 👀 Read app name
        uses: SebRollen/toml-action@v1.0.2
        id: app_name
        with:
          file: fly.toml
          field: app

      - name: 🚀 Deploy Production
        uses: superfly/flyctl-actions@1.4
        with:
          args: deploy --remote-only --build-arg COMMIT_SHA=${{ github.sha }} --build-arg TMDB_API_KEY=${{ secrets.TMDB_API_KEY }} --app ${{ steps.app_name.outputs.value }}
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

마지막에 보시면 deploy 부분이 추가됐는데요.

needs 라는게 보이실 건데요.

needs는 deploy가 실행하기 위해 필요한 선제 Job을 가리킵니다.

즉, needs에서 지정한 Job이 성공하지 못하면 deploy는 아예 실행도 되지 않는 거죠.

우리 입장에서는 lint 부분이 정상적으로 작동하면 deploy 하는 방식인 거죠.

지극히 당연한 수순인 거죠.

이제 steps를 볼까요?

첫 번째는 Checkout Repo입니다.

아까 설명해 드렸었고요.

두 번째는 Read app name입니다.

요거는 fly.toml 파일에서 app 항목의 이름을 가져오는 겁니다.

다음 작업에서 필요하기 때문이죠.

그리고 마지막으로 Deploy Production 항목인데요.

가장 중요합니다.

uses라는 부분에서는 superfly/flyctl-actions@1.4 패키지를 사용하는데요.

이건 Fly.io 측에서 만든 Github Action 패키지입니다.

즉, 이 패키지는 flyctl을 터미널상에서 실행하는 것과 똑같은 겁니다.

그래서 with라는 옵션에 무언가를 적으면 되는데요.

args 부분이 deploy로 시작합니다.

즉, 우리가 터미널상에서 첫 번째 강좌에서 했듯이 `fly deploy --build-args TMDB_API_KEY=adsfasfa` 라고 실행한 것과 같습니다.

그런데 좀 더 옵션이 많네요.

--remote-only는 리모트에서의 Docker 작업을 하라는 겁니다. 꼭 필요한 거죠.

그리고 --build-args 부분이 두 개가 있는데요.

하나는 COMMIT_SHA 라고 어떤 Git Commit을 빌드하라는지 명확하게 지정 하는거죠.

이 옵션은 없어도 잘 작동합니다.

그리고 `${{ github.sha }}` 이 부분은 Github Action의 내장 변수 같은 겁니다.

github repository에서 현재 commit의 sha 변수에 접근할 수 있는 거죠.

두번째 --build-args는 바로 `TMDB_API_KEY=${{ secrets.TMDB_API_KEY }}` 인데요.

TMDB_API_KEY를 왜 --build-args로 넘겨줘야 하는지는 2편에 잘 나와 있습니다.

Dockerfile에서 아랫부분 때문이죠.

```bash
# Set TMDB API key at build time
ARG TMDB_API_KEY
ENV VITE_TMDB_API_KEY=$TMDB_API_KEY
```

그리고 TMDB_API_KEY를 어떻게 얻었냐면 바로 Github Repository의 Secrets에서 얻은 겁니다.

맨 처음 세팅했던 그 Secrets인데요.

`${{ secrets.TMDB_API_KEY }}` 이런 식으로 접근할 수 있습니다.

그리고 마지막으로 env 라는 부분이 있는데요.

이건 superfly/flyctl-actions@1.4 를 실행할 때 env 변수로써 FLY_API_TOKEN을 메모리에 넣으라는 뜻입니다.

이게 없으면 자신의 fly.io에 접근할 수 없기 때문입니다.

이제 실행 결과를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEjYVSUDIr2s4GDXsjwkLgqgwZTeclF43pXUcudn0SvDAvrmdMtT2fgXRz-6l6fjrSONE-Y2HoqD5BYOAWZYMuoLSo3qb_djklf9Ds0MgMT-QHQsx5tMcLDWWMSK_-g_oolZ-9PHlQrogXm8907lAQx_o54HlfOMRWmbu253F2rUaAWOxNw0tNIVEVULoC0)

역시나 잘 됐습니다.

---

## npm run build는 어디서 실행되나요?

우리가 만든 Github Action은 lint를 실행하고 통과하면 deploy를 하라는 건데요.

deploy는 "fly deploy" 명령어를 Github Action 방식으로 실행한 겁니다.

그러면 Fly.io가 Dockerfile을 읽고 그걸 실행하게 되는 거죠.

그래서 지난 시간에 Dockerfile을 분석했듯이 거기서 npm run build와 최종적으로 아래와 같이 서버 실행명령어도 실행됩니다.

```bash
# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "npm", "run", "start" ]
```

이제 다시 실행결과를 보시면 아주 잘 작동되는걸 볼 수 있을 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgFc44LCkxpDNFGu34it2tiTW6wfXS7OvfwlrfZzfkBHcshWfay4m2qTNeR_3RcK8k-mWOOq6soRg_AZERanXp66MS0W3Jb9dbIbs22x8jsfV_4mBbk_C9Ggl2Uij_7bV9wOTXeJ4fOiUcJzNg1w1eQmNwn3EK48qwmLzNh9efupnlXEL7vHL9--RyaNds)

그럼. 다음 시간에는 Fly.io에서 이용할 수 있는 Prisma를 이용한 백 엔드 DB 작업에 대해 알아보겠습니다.

그럼.
