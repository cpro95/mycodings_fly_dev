---
slug: 2025-10-12-blog-migrate-to-hugo-doks-theme-as-static-sites
title: "Hugo로 정적 사이트로 블로그 개편하고 Caddy로 Fly.io에서 서빙하기"
summary: "기존 React Router V7의 풀스택 블로그 사이트를 Hugo를 이용한 정적 사이트로 개편했습니다. 그리고 정적 사이트 서빙은 Caddy 서버를 이용했습니다."
date: 2025-10-12T02:44:41.182Z
draft: false
weight: 50
tags: ["hugo", "블로그", "static site", "doks theme", "Caddy"]
contributors: []
---

안녕하세요?

이 사이트 즉, mycodings.fly.dev 사이트는 예전에 Remix Framework과 Github Action을 이용해서 Fly.io의 VPS 머신 속 sqlite DB에 블로그 내용을 저장했던 방식을 사용했었는데요.

얼마전에는 Remix 에서 React Router V7으로 홈페이지 완전 개편까지 했었습니다.

그런데, 현재 사용하고 있는 Fly.io의 머신의 메모리가 256mb 밖에 안되니까 React 서버의 과부하가 조금 심했습니다.

메모리를 1GB로 올리면 Fly.io의 무료 사용량을 훌쩍 뛰어 넘게 되어 매달 $5 이상 지불하는 상황에 이르게 됐는데요.

그래서 고민 끝에 256mb의 메모리에서도 안정적으로 블로그 사이트가 운영되는 방법인 정적사이트로 개편하려고 결정했습니다.

그래서 정적사이트에 최적화된 AstroJS를 사용하려고 했었는데요.

AstroJS는 빌드 시간이 너무 길게 걸립니다.

그래서 Hugo를 사용하기로 결정했습니다.

많은 마크다운 파일이 있음에도 아주 빠른 빌드 속도를 보여주거든요.

그러면 Hugo의 테마만 결정하면 되는데요.

Hugo 테마사이트에서 찾은게 바로 Doks Theme입니다.

![](https://themes.gohugo.io/themes/doks/screenshot_hu_dfafb18f83661ab.webp)

[Doks Theme](https://github.com/thuliteio/doks)

위 페이지로 가보니까 Doks Theme은 Thulite의 일종이란 걸 알게 됐는데요.

아래 페이지로 가보면 Thulite는 Build fast, secure websites 할 수 있는 정적사이트 제조기라는 걸 알게됐습니다.

[Thulite의](https://thulite.io/)

기본적으로 정적사이트 빌드는 Hugo를 사용하고 기타 다른 부분은 nodejs로 이루어져서 아주 좋았는데요.

이제 이 Thulite를 이용해서 기존 사이트의 레이아웃과 같이 만들어야 했는데요.

Thulite의 기본 폴더 구조는 아래와 같습니다.

```sh
➜  thulite-project tree . -L 1
.
├── assets
├── config
├── content
├── layouts
├── LICENSE
├── netlify.toml
├── node_modules
├── package-lock.json
├── package.json
└── static

7 directories, 4 files
```

전형적인 nodejs 앱의 모습을 띄고 있지만 Hugo 사이트입니다.

content 폴더에는 블로그 자료가 있고, layout 폴더에는 Hugo가 컴파일하는 페이지의 구조가 있는데요.

Thulite 사이트는 기본적으로 node_modules 밑에 있는 @thulite 패키지의 doks-core 폴더를 테마 이미지로 사용하는 Hugo 사이트라고 보시면 됩니다.

기본적인 옵션 설정은 config 폴더 밑에 있는 TOML 파일을 수정하면 됩니다.

config 폴더 밑에서 tree 명령어를 실행하면 아래와 같이 나옵니다.

```sh
➜  config tree .
.
├── _default
│   ├── hugo.toml
│   ├── languages.toml
│   ├── markup.toml
│   ├── menus
│   │   ├── menus.en.toml
│   │   └── menus.nl.toml
│   ├── module.toml
│   └── params.toml
├── babel.config.js
├── next
│   └── hugo.toml
├── postcss.config.js
└── production
    └── hugo.toml
```

기본적인게 바로 _default 폴더 밑에 있는 hugo.toml 파일과 params.toml 파일입니다.

이 두개 파일을 수정하면 되는데요.

본인의 사이트처럼 바꾸면 됩니다.

## layout 오버라이드 하기

사이트를 개편하시다 보면 이게 영어 등 기타 언어의 멀티랭기지를 지원하는데요.

저는 한국어만 필요하니까 languages.toml 파일을 수정하면 되는데요.

이 파일의 'en' 부분을 'ko'로 바꾼다고 해도 적용이 안됩니다.

```sh
[en]
  languageName = "English"
  contentDir = "content/en"
  weight = 10
  [en.params]
    languageISO = "EN"
    languageTag = "en-US"
    footer = "Copyright (c) All Right Reserved."
#    alertText = '<a class="alert-link stretched-link fw-normal" href="/blog/example-post/">Doks version 1.0 just shipped!</a>'

```

그래서 en 그대로 나두고 사용하려면

params.toml 파일의 아래 부분을 false 설정하면 됩니다.

```sh
  # Multilingual
  multilingualMode = false # false (default) or true
```

그리고, hugo.toml 파일에서는 defaultContentLanguageInSubdir 부분을 false로 설정하면 됩니다.

```sh
# Multilingual
defaultContentLanguage = "en"
disableLanguages = ["de", "nl"]
defaultContentLanguageInSubdir = false
```

이렇게 설정하면 content 폴더 밑에 `content/en`처럼 다국어별로 따로 저장하지 않아도 되죠.

그러면 문제가 생기는데요.

사이트를 빌드하면 `html lang='en'` 이라고 뜹니다.

이 부분은 고쳐야 하는데, hugo.toml에서 랭기지 부분을 아래와 같이 되어 있는 걸 ko로 고치면 되는데요.

```sh
# languageCode = "en-US"
languageCode = "ko-KR"
```

이렇게 해도 되야 되는데, 문제는 이 Thulite 사이트는 flexSearch 패키지를 사용해서 정적사이트지만 Search 옵션을 제공하는데요.

flexSearch.ko.js 파일이 없어서 Hugo로 컴파일이 안됩니다.

결국 다시 languageCode 는 영어로 그대로 나둬야 하는데요.

그래서 강제로 html 코드의 lang 부분을 'ko'로 수정해야 합니다.

여기서 등장하는게 바로 Hugo의 오버라이드 기술인데요.

node_modules 밑에 있는 @thulite/doks-core 폴더를 보시면 layouts 폴더가 아래와 같이 있습니다.

```sh
➜  layouts tree . -L 1
.
├── _markup
├── _partials
├── _shortcodes
├── 404.html
├── about
├── baseof.html
├── blog
├── home.html
├── home.searchindex.json
├── legal
├── list.html
├── section.sitemap.xml
├── single.html
├── taxonomy.html
├── term.html
└── versions.html

7 directories, 10 files
```

위 파일이 기본적인 Doks Theme의 기본 레이아웃 파일인데요.

이 node_modules 폴더 밑에 있는게 기본이 되는거고, 프로젝트 상단에 있는 layouts 폴더는 오버라이드 레이아웃이 되는겁니다.

즉 node_modules 폴더 밑에 있는 baseof.html 파일을 열어보면 아래와 같이 html lang 부분이 Hugo 코드로 작성되어 있는데요.

```html
<!doctype html>
<html lang="{{ .Site.LanguageCode | default "en" }}" data-bs-theme="{{ site.Params.doks.colorMode | default "auto" }}">
  {{ partial "head/head" . }}
  {{ partial "head/body-class" . }}
  <body class="{{ delimit (.Scratch.Get "class") " " }}"{{ if eq site.Params.doks.scrollSpy true }} data-bs-spy="scroll" data-bs-target="#toc" data-bs-root-margin="0px 0px -60%" data-bs-smooth-scroll="true" tabindex="0"{{ end }}>
    {{ partial "header/header" . }}
    <div class="wrap container-{{ site.Params.doks.containerBreakpoint | default "lg" }}" role="document">
      <div class="content">
      {{ if and (eq site.Params.doks.containerBreakpoint "fluid") (or (not (in .Site.Params.mainSections .Type)) (.IsNode)) }}<div class="container p-0">{{ end }}
        {{ block "main" . }}{{ end }}
      {{ if and (eq site.Params.doks.containerBreakpoint "fluid") (or (not (in .Site.Params.mainSections .Type)) (.IsNode)) }}</div>{{ end }}
      </div>
    </div>
    {{ block "sidebar-prefooter" . }}{{ end }}
    {{ block "sidebar-footer" . }}{{ end }}
    {{ partial "footer/footer" . }}
    {{ partial "footer/script-footer" . }}
    {{ if eq site.Params.doks.toTopButton true -}}
      {{ partial "footer/to-top" . }}
    {{ end }}
  </body>
</html>
```

이 부분을 강제로 바꾸겠습니다.

프로젝트 최상단의 layouts 폴더에 상기 baseof.html 파일을 그대로 복사해서 아래와 같이 html lang 부분만 수정하면 됩니다.

```html
<!doctype html>
<html lang="ko" data-bs-theme="{{ site.Params.doks.colorMode | default "auto" }}">

...
...
...

</html>
```

이렇게 하면 기본적으로 node_modules 폴더 밑에 있는 baseof.html이 사용되지 않고 프로젝트 최상단에 있는 layouts 폴더의 baseof.html 파일이 사용되는 겁니다.

이게 오버라이드인데요.

이렇게 하면 node_modules에 있는 파일을 복사해서 나만의 사이트 구조를 만들 수 있습니다.

하여튼 이렇게 만든 사이트는 제 Github에 있으니까요 한번 둘러보시는 걸 추천드립니다.

[mycodings](https://github.com/cpro95/mycodings_fly_dev)

## Fly.io에 도커로 정적사이트 서빙하기

이제 Hugo로 정적사이트를 만들었으니까 Fly.io의 머신에 올리고 정적사이트를 서빙해야하는데요.

Fly.io는 VPS 같은 머신을 임대해 주는 사이트 입니다.

그래서 직접 정적사이트를 운영하는 apache, nginx 같은 홈페이지 운영서버를 돌려야 하는데요.

nginx가 가장 많이 쓰이는데, 설정이 어렵습니다.

그래서 Fly.io가 추천하는 Caddy 서버를 사용할 건데요.

[Caddy 서버는 홈페이지](https://caddyserver.com/) 가보시면 설정이 쉽다는 장점이 있습니다.

그리고 Docker로 쉽게 Caddy 서버를 구축할 수 있습니다.

먼저, Dockerfile을 아래와 같이 구성합니다.

```sh
# Caddy를 실행할 최종 이미지만 필요합니다.
FROM caddy:alpine

# Caddyfile을 복사합니다.
COPY Caddyfile /etc/caddy/Caddyfile

# 포트를 노출합니다.
EXPOSE 8080

# 로컬에서 미리 빌드된 public 폴더의 내용물을
# Caddy가 서비스할 /srv 디렉터리로 복사합니다.
COPY public /srv
```

아주 쉽죠.

caddy 서버만 있는 alpine 리눅스 버전이 있어 용량이 아주 적습니다.

그리고 Caddyfile을 만들어야 하는데요.

```sh
# fly.toml의 internal_port와 일치하는 8080 포트에서 수신 대기합니다.
:8080

# 웹 사이트의 루트 디렉터리를 /srv로 지정합니다.
# Dockerfile에서 Hugo 빌드 결과물을 /srv로 복사했습니다.
root * /srv

# 콘텐츠를 압축하여 전송 속도를 높입니다. (gzip, zstd)
# encode gzip zstd

# 정적 파일 서버를 활성화합니다.
file_server
```

위와 같이 설정하면 됩니다.

Caddy 서버의 설정은 아주 간편하기로 유명한데요.

저는 encode gzip은 비활성화 했습니다.

현재 로컬에 있는 Hugo 사이트의 빌드 결과물인 public 폴더만 Dockerfile에서 `/srv` 폴더로 이동하는데요.

그러면 Caddyfile에서 `/srv` 폴더를 root로 지정하고 file_server를 돌리는 겁니다.

그리고 여기서 중요한 점은 전체사이트를 도커에 올리고 도커가 빌드하는 방식을 취하지 않은 점인데요.

어차피 정적사이트라 public 폴더만 복사하면 되는데 굳이 전체사이트를 Docker로 올리면 공간낭비, 시간낭비가 심합니다.

그래서 꼭 로컬에서 정적사이트를 빌드 해주고 docker로 올리면 되는거죠.

그래서 deploy.sh 파일을 따로 만들었는데요.

```sh
#!/bin/sh
# 명령어 실행 중 오류가 발생하면 즉시 스크립트를 중단합니다.
set -e

echo "🚀 배포 프로세스를 시작합니다..."

# 1. 로컬 환경에서 기존 public 폴더를 삭제한다.
echo "📦 기존 배포본 자료를 삭제합니다: npm run clean"
npm run clean

# 2. 로컬 환경에서 에셋과 Hugo 사이트를 빌드합니다.
echo "📦 로컬에서 정적 사이트를 빌드합니다: npm run build"
npm run build

# 3. Fly.io에 배포합니다.
#    Dockerfile은 위 '방법 1'의 단순 버전을 사용합니다.
echo "✈️ Fly.io로 배포를 시작합니다..."
fly deploy

echo "✅ 배포가 완료되었습니다!"
```

위와 같이 최종적으로 fly deploy 명령어를 사용하면 fly.io가 Dockerfile을 만들고 가상머신을 만들어주는데요.

## 실제 업로드

그러면 실제 업로드를 진행해 보겠습니다.

위에서 만든 deploy.sh를 실행하면 되는데요.

실제 Fly.io 업로드 로그는 아래와 같은데요.

```sh
➜  mycodings_fly_dev git:(main) ./deploy.sh
🚀 배포 프로세스를 시작합니다...
📦 기존 배포본 자료를 삭제합니다: npm run clean

> mycodings_fly_dev@1.8.0 clean
> rimraf public

📦 로컬에서 정적 사이트를 빌드합니다: npm run build

> mycodings_fly_dev@1.8.0 build
> hugo --minify --gc

Start building sites …
hugo v0.150.1+extended+withdeploy darwin/arm64 BuildDate=2025-09-25T10:26:04Z VendorInfo=brew


                  │  EN
─────────┼───
 Pages            │ 3431
 Paginator pages  │  503
 Non-page files   │    0
 Static files     │   23
 Processed images │    0
 Aliases          │ 1464
 Cleaned          │    2

Total in 4401 ms
✈️ Fly.io로 배포를 시작합니다...
==> Verifying app config
Validating /Users/****/projects/mycodings_fly_dev/fly.toml
✓ Configuration is valid
--> Verified app config
==> Building image
==> Building image with Depot
--> build:  (​)
[+] Building 17.9s (8/8) FINISHED
 => [internal] load build definition from Dockerfile                                                                                                       0.8s
 => => transferring dockerfile: 405B                                                                                                                       0.8s
 => [internal] load metadata for docker.io/library/caddy:alpine                                                                                            1.4s
 => [internal] load .dockerignore                                                                                                                          0.8s
 => => transferring context: 92B                                                                                                                           0.8s
 => [1/3] FROM docker.io/library/caddy:alpine@sha256:953131cfea8e12bfe1c631a36308e9660e4389f0c3dfb3be957044d3ac92d446                                      0.0s
 => => resolve docker.io/library/caddy:alpine@sha256:953131cfea8e12bfe1c631a36308e9660e4389f0c3dfb3be957044d3ac92d446                                      0.0s
 => [internal] load build context                                                                                                                          8.8s
 => => transferring context: 61.69MB                                                                                                                       8.6s
 => CACHED [2/3] COPY Caddyfile /etc/caddy/Caddyfile                                                                                                       0.0s
 => [3/3] COPY public /srv                                                                                                                                 2.1s
 => exporting to image                                                                                                                                     3.7s
 => => exporting layers                                                                                                                                    1.5s
 => => exporting manifest sha256:b5849d6008d393def894acbcf65a3557e0504c879a                                                          0.0s
 => => exporting config sha256:549f774c6bae8105a641af520845bcb4e999014679d1473a                                                            0.0s
 => => pushing layers for registry.fly.io/mycodings:deployment-01K7B7V66PVHRA76317DTEGDNB@sha256:b5849d0850302f  2.2s
 => => pushing layer sha256:549f774c6bae8105a641af520814679d1473a                                                               2.1s
 => => pushing layer sha256:bd819b1e29132d38fa822399eff50944cb4                                                               2.2s
 => => pushing layer sha256:bb6d2f38004e28cf94282f1dbea47cf7630d                                                               1.3s
 => => pushing layer sha256:364c7e43a1b55d570e324b0d711993a247                                                               2.0s
 => => pushing layer sha256:7f209fb6279b7cb0e0d5388437a10eee2c4f2d9                                                               2.0s
 => => pushing layer sha256:88d712088c8f7be3b1cb3ee589bb0a9812fa1                                                               0.3s
 => => pushing layer sha256:5e3bcdac2ab3718a3c3d94968670b70f1c1                                                               2.0s
 => => pushing layer sha256:2c1ce468d9f3d05430fe644cd3537713d27f                                                               2.0s
 => => pushing manifest for registry.fly.io/mycodings:deployment-01K7B7V66PVHRA76317DTEGDNB@sha256:b5849d6a0a085030  0.0s
--> Build Summary:  (​)
--> Building image done
image: registry.fly.io/mycodings:deployment-01K7B7V67DTEGDNB
image size: 24 MB

Watch your deployment at https://fly.io/apps/mycodings/monitoring

-------
Updating existing machines in 'mycodings' with rolling strategy

-------
 ✔ [1/2] Cleared lease for 28607298
 ✔ [2/2] Cleared lease for 3d3e2148
-------
Checking DNS configuration for mycodings.fly.dev

Visit your newly deployed app at https://mycodings.fly.dev/
✅ 배포가 완료되었습니다!
```

도커 파일 이미지도 아주 작고 사이트도 아래와 같이 잘 작동됩니다.

잘 보시면 캐디 이미지 사이즈가 24MB 밖에 안됩니다.

기존 React Router V7 을 이용한 풀스택 사이트보다 리소스를 덜 차지하게 되니까 빠르고 보기 좋았습니다.

아래는 사이트 스크린샷입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjMI9Yjx_bz2HPFA7oE4oi7nCneE6rcdrjBdjpprQg0KRvInB__sL637sDgpcGR99BvlPJO6HjBZRgpfzpsJ4yw4VINxgsKNWEJKHirvJ4DUNiIHp7gUDZV8k5_XhllUHUXx1ShupidxyBx_QK8-YPF7KDsA99pJkACV4zPxHtmdmPblHXCjeJ8k5scMmc=s16000)

기존 구글 애널리틱스와 구글 애드센스까지 완벽하게 옮겨 심어서 사이트는 예전과 똑같이 작동하고 있습니다.

여러분도 블로그 사이트는 꼭 정적사이트로 작성하시는 걸 추천드립니다.

그럼.
