---
slug: 2025-11-06-static-site-deploy-flyio-volume-optimization
title: "Fly.io 블로그 글 하나 수정할 때마다 Docker 이미지 전체를 다시 올리시나요"
summary: "Fly.io Volume을 활용하면 정적 사이트 콘텐츠만 따로 관리할 수 있어 배포 시간과 비용을 획기적으로 줄일 수 있습니다"
date: 2025-11-06T03:02:48.933Z
draft: false
weight: 50
tags: ["Fly.io", "Volume", "정적사이트배포", "Hugo", "Caddy", "Docker최적화", "배포자동화", "웹호스팅"]
contributors: []
---

안녕하세요?

지난 시간에 fly.io 요금폭탄을 해결했었는데요.

이번에는 Hugo 정적 사이트의 가장 큰 문제점인 도커 빌드 및 배포에 시간이 너무 오래 걸린다는 점인데요.

휴고(Hugo)나 지킬(Jekyll) 같은 정적 사이트 생성기로 블로그를 운영하는 분들이라면 한 번쯤 겪어봤을 고민이 있습니다.

글 하나 수정하고 배포 버튼 누르면 몇 분씩 기다려야 하는 그 시간 말이죠.

도커(Docker) 이미지 전체를 다시 빌드하고, 레지스트리에 푸시하고, 서버에서 다시 풀(pull)받아 컨테이너를 재시작하는 과정이 매번 반복됩니다.

겨우 오타 하나 고쳤을 뿐인데 100MB가 넘는 이미지를 통째로 업로드해야 한다니, 뭔가 비효율적이라는 생각이 들 수밖에 없거든요.



# 일반적인 배포 방식의 함정

대부분의 정적 사이트 배포 가이드를 보면 비슷한 패턴이 반복됩니다.

도커파일(Dockerfile)에 이런 명령어를 넣어서 빌드된 정적 파일을 이미지에 통째로 포함시키는 방식이죠.



```dockerfile
COPY public /srv
```

처음엔 이게 당연해 보입니다.

웹서버와 콘텐츠가 하나의 패키지로 묶여 있으니 배포도 간단하고 관리도 쉬워 보이거든요.

하지만 실제로 운영해보면 문제가 보이기 시작합니다.

블로그 글 하나 추가할 때마다 전체 이미지를 재빌드해야 하니, 시간도 시간이지만 이미지 레지스트리 트래픽도 무시 못 할 수준으로 쌓입니다.

플라이닷아이오(Fly.io) 같은 서비스를 쓴다면 배포 속도는 빠른 편이지만, 그래도 매번 수십 메가바이트를 업로드하는 건 여전히 부담스럽거든요.



# 앱과 데이터를 분리한다는 발상

문득 이런 생각이 들었습니다.

'웹서버는 거의 안 바뀌는데, 바뀌는 건 정적 파일뿐이잖아?'

캐디(Caddy) 웹서버 설정은 한 번 잡아놓으면 몇 달씩 안 건드리는데, 정작 매일 바뀌는 건 HTML과 CSS 파일 몇 개뿐입니다.

그럼 둘을 분리하면 되는 거 아닐까요.

Fly.io가 제공하는 '볼륨(Volume)' 기능이 딱 이런 용도로 쓰기 좋습니다.

볼륨은 컨테이너와 독립적으로 존재하는 저장 공간이거든요.

도커 이미지에는 캐디 웹서버와 설정 파일만 넣고, 실제 정적 사이트 파일들은 볼륨에 따로 저장하는 겁니다.



# 볼륨 생성부터 시작하기

Fly.io에서 볼륨을 만드는 건 정말 간단합니다.

터미널에서 이 명령어 한 줄만 실행하면 됩니다.



```bash
fly volumes create mycodings_data --region nrt --size 1
```

'mycodings_data'는 볼륨 이름이고, 'nrt'는 도쿄 리전을 의미하며, 크기는 1GB로 설정한 거죠.

1GB는 무료 티어이고, 정적 사이트는 전체 크기로 봐서 1GB는 차고 넘치기에 충분하죠.

볼륨이 만들어지면 확인할 수 있습니다.



```bash
fly volumes list
```

여기서 중요한 건 볼륨 이름을 기억해두는 겁니다.

이 이름을 fly.toml 설정 파일의 mounts 섹션에 그대로 입력해야 하거든요.



```toml
[[mounts]]
  source = "mycodings_data"
  destination = "/srv"
```

이렇게 하면 컨테이너가 실행될 때 볼륨이 자동으로 /srv 경로에 마운트됩니다.



# 도커파일과 설정 파일 구성하기

도커파일은 정말 심플해집니다.

캐디 알파인(alpine) 이미지를 베이스로 하고, Caddyfile만 복사한 뒤 /srv 디렉토리를 만들어두기만 하면 됩니다.



```dockerfile
FROM caddy:alpine

COPY Caddyfile /etc/caddy/Caddyfile

RUN mkdir -p /srv

EXPOSE 8080
```

기존에 있던 'COPY public /srv' 라인은 과감하게 삭제하는 거죠.

Caddyfile에서는 이렇게 설정합니다.



```
:8080

root * /srv

file_server

encode gzip zstd
```

':8080' 포트로 서비스하도록 설정하고, 'root * /srv'로 볼륨 마운트 경로를 루트로 지정했습니다.

'file_server'로 정적 파일 서버를 활성화하고, 'encode gzip zstd'로 압축도 켜주는 게 좋습니다.

fly.toml에서는 auto_stop_machines와 auto_start_machines를 활성화해서 트래픽이 없을 때 자동으로 꺼지도록 만드는 겁니다.



```toml
[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = 'stop'
  auto_start_machines = true
  min_machines_running = 0
```

min_machines_running을 0으로 설정하면 완전히 꺼질 수 있거든요.



# 최초 배포는 이렇게

설정이 끝났으면 앱을 배포합니다.



```bash
fly deploy
```

이때는 볼륨이 비어있어서 접속하면 404 에러가 뜨는 게 정상입니다.

아직 정적 파일을 올리지 않았으니까요.

이제 콘텐츠를 올릴 차례인데, 먼저 로컬에서 휴고 빌드를 돌립니다.



```bash
npm run clean && npm run build
```

빌드된 public 폴더를 tar.gz로 압축하는데, 이때 맥OS 메타데이터 파일을 제외하는 게 중요합니다.



```bash
tar -czf public.tar.gz -C public --exclude='._*' --exclude='.DS_Store' .
```

'._'로 시작하는 파일이나 .DS_Store 같은 불필요한 파일들이 깔끔하게 필터링되거든요.

압축된 파일은 플라이닷아이오의 SFTP 기능으로 서버의 /tmp 폴더에 업로드합니다.



```bash
fly sftp put public.tar.gz /tmp/public.tar.gz
```

그다음 SSH로 접속해서 기존 /srv 내용을 지우고 압축을 풉니다.



```bash
fly ssh console --command "sh -c 'rm -rf /srv/*'"
fly ssh console --command "tar -xzf /tmp/public.tar.gz -C /srv"
fly ssh console --command "rm /tmp/public.tar.gz"
```

마지막으로 로컬 임시 파일까지 정리하면 첫 배포가 완료됩니다.



```bash
rm public.tar.gz
```

# 두 번째부터는 스크립트만 실행

이 모든 과정을 쉘 스크립트로 만들어두면 정말 편합니다.



```bash
#!/bin/sh
set -e

echo "🚀 콘텐츠 배포 프로세스를 시작합니다..."

echo "📦 로컬에서 정적 사이트를 빌드합니다..."
npm run clean && npm run build

echo "📦 배포용 압축 파일을 생성합니다: public.tar.gz"
tar -czf public.tar.gz -C public --exclude='._*' --exclude='.DS_Store' .

echo "✈️ Fly.io 볼륨으로 콘텐츠를 동기화합니다..."
fly sftp put public.tar.gz /tmp/public.tar.gz

echo "   - 원격 서버에서 콘텐츠를 배포합니다..."
fly ssh console --command "sh -c 'rm -rf /srv/*'"
fly ssh console --command "tar -xzf /tmp/public.tar.gz -C /srv"
fly ssh console --command "rm /tmp/public.tar.gz"

echo "🧹 로컬 임시 파일을 삭제합니다..."
rm public.tar.gz

echo "✅ 콘텐츠 배포가 완료되었습니다!"
```

이후부터는 정말 간단합니다.

글 하나 쓰고 deploy.sh 스크립트만 실행하면 10초 안에 배포가 끝나거든요.



```bash
./deploy.sh
```

이전엔 도커 빌드부터 시작해서 3~5분은 기다려야 했는데, 이제는 커피 한 모금도 안 마셨는데 벌써 끝나 있습니다.

게다가 캐디 설정을 바꿔야 할 일이 생겨도 'fly deploy'로 이미지만 재배포하면 되니, 볼륨에 있는 콘텐츠는 그대로 유지됩니다.

앱과 데이터가 완전히 분리된 덕분에 각각 독립적으로 관리할 수 있게 된 거죠.



# 캐싱 전략까지 챙기면 금상첨화

Caddyfile 설정에서 캐싱 전략을 제대로 잡아주면 성능도 크게 개선됩니다.



```
@static {
    path *.css *.js *.woff2 *.png *.jpg *.jpeg *.gif *.ico *.webp
}
header @static Cache-Control "public, max-age=31536000, immutable"

@html {
    path *.html *.xml
}
header @html Cache-Control "public, max-age=86400, stale-while-revalidate=604800"
```

CSS나 자바스크립트, 이미지 같은 정적 에셋은 1년간 브라우저 캐시에 보관되도록 했습니다.

어차피 파일 내용이 바뀌면 파일명도 바뀌는 경우가 대부분이니, immutable 플래그를 붙여도 문제없거든요.

반면 HTML이나 XML 파일은 하루 정도만 캐시하되, 백그라운드에서 재검증할 시간 여유를 주는 게 좋습니다.

여기에 보안 헤더도 추가하면 완성도 높은 설정이 완성됩니다.



```
header {
    Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
    X-Content-Type-Options "nosniff"
    Referrer-Policy "strict-origin-when-cross-origin"
}
```

# 비용 절감 효과는 덤

Fly.io의 auto_stop_machines 기능과 결합하면 비용 면에서도 이득입니다.

트래픽이 없을 때 머신을 자동으로 멈추고, 요청이 들어오면 다시 시작하도록 설정할 수 있거든요.

개인 블로그처럼 트래픽이 일정하지 않은 서비스에 딱 맞는 설정이죠.

shared-cpu-1x 스펙이면 256MB 메모리로도 충분히 돌아가니, 최소 비용으로 운영할 수 있습니다.

롤백도 간단합니다.

이전 버전의 압축 파일을 보관해뒀다가 다시 업로드하면 그만이거든요.



# 꼭 기억해야 할 포인트

이 방식을 적용하려면 몇 가지 주의할 점이 있습니다.

볼륨은 단일 리전에만 존재하니, 멀티 리전 배포를 고려한다면 각 리전마다 볼륨을 따로 만들고 동기화 전략을 짜야 합니다.

정기적인 백업도 중요합니다.

중요한 시점의 압축 파일은 로컬에 보관해두는 습관을 들이는 게 좋습니다.

하지만 이런 작은 불편함을 감수하더라도, 매번 수십 메가바이트를 업로드하던 것에 비하면 훨씬 효율적인 건 분명합니다.

정적 사이트를 운영하면서 배포 과정이 부담스러웠다면, 한 번쯤 시도해볼 만한 방법입니다.
