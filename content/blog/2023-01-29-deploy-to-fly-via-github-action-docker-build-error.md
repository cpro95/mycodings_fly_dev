---
slug: 2023-01-29-deploy-to-fly-via-github-action-docker-build-error
title: Github Action으로 도커 이미지를 Fly 서버에 배포할 때 생기는 에러 고치기
date: 2023-01-29 11:01:52.630000+00:00
summary: 2023년 1월 현재 Github Action으로 도커 이미지를 Fly 서버에 배포할 때 생기는 에러 고치기
tags: ["github", "action", "fly.dev", "fly.io", "docker"]
contributors: []
draft: false
---

안녕하세요?

제 블로그 사이트는 github에 저장된 Remix Framework를 도커 이미지로 컴파일해서 그걸 Fly.io 서버에 푸쉬하고 있는데요.

지난 22년 12월부터 계속 아래와 같은 에러가 발생하고 있습니다.

```bash
Searching for image 'registry.fly.io/***:4d0ad5a537c002b4aa7bd37dad3806f66acf2f82' locally...
Searching for image 'registry.fly.io/***:4d0ad5a537c002b4aa7bd37dad3806f66acf2f82' remotely...
Error failed to fetch an image or build from source: Could not find image "registry.fly.io/***:4d0ad5a537c002b4aa7bd37dad3806f66acf2f82"
```

몇 번이고 계속 Deploy 해도 도커 이미지를 찾을 수 없다는 에러가 계속 발생하는데요.

Build 단계에서는 도커 이미지가 완성되었지만, Deploy 단계에서 계속 Deploy 실패가 뜨고 있었습니다.

실제 Fly.io 커뮤니티에는 관련 에러 글이 여러 개 올라오고 있는데요.

심지어, KentCDodds 님도 에러가 난다고 글을 올렸습니다.

현재까지 원인은 찾고 있지만 가장 유력한 원인은 Docker 이미지를 만드는 BuildKit이 문제인 거 같습니다.

`docker/setup-buildx-action@v2`를 사용해서 github action으로 도커이미지를 만드는데요.

BuildKit 버전이 0.9.1에서 0.10.0으로 마이너 업그레이드되면서 생긴 문제 같다는 게 중론입니다.

그래서 github action을 아래와 같이 고치면 문제가 해결되는데요.

deploy.yml 파일에서 아래 내용처럼 특정 버전을 지정하면 됩니다.
```bash
      - name: 🐳 Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
        with:
          version: v0.9.1
```

with 문구를 사용해서 특정 버전으로 사용하라고 지정하면 문제가 해결됩니다.

BuiltKit의 버그가 고쳐질 때까지는 위와 같이 임시방편으로 사용하면 됩니다.

이제 다시 Deploy 해보니까 아주 잘 됩니다.

그럼.
