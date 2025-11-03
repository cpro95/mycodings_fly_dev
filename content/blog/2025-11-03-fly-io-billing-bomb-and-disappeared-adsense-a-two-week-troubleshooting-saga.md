---
slug: 2025-11-03-fly-io-billing-bomb-and-disappeared-adsense-a-two-week-troubleshooting-saga
title: "Fly.io 요금 폭탄과 사라진 애드센스 2주간의 삽질기"
summary: "Hugo 정적 사이트 개편 후 발생한 Fly.io 요금 폭탄의 원인인 9MB search.json 파일을 해결하고, Caddy 보안 헤더로 인한 애드센스 CSP 차단 문제까지 해결한 2주간의 기록입니다."
date: 2025-11-03T03:23:26.407Z
draft: false
weight: 50
tags: ["Fly.io", "Hugo", "Caddy", "요금 폭탄", "Outbound Bandwidth", "애드센스", "CSP", "React SSR"]
contributors: []
---

![Fly.io 요금 폭탄과 사라진 애드센스 2주간의 삽질기](https://blogger.googleusercontent.com/img/a/AVvXsEhoNpRfklpAYkB9evQW-07FH0-gL8U_mh5VZS2yeMm-26PvFvnty9iIouwhcxSHun4gdBRubDGL6m08ZLMdQzXIYQy9_FYSQWuJPy117e8ULTKOAWQ_d5SsKGrRxNJ1-GFkXp3TkkVbO19sVdHFcZyZVv74W6nUk2PeK9enKTC5an8rQTfgvMozmXl9Niw=s16000)

안녕하세요?

최근 제 블로그를 대대적으로 개편했거든요.

기존의 리액트(React) 서버 사이드 렌더링 방식에서 휴고(Hugo)를 이용한 정적 사이트로 완전히 갈아엎은 대공사였습니다.

정적 사이트니 더 빠르고, 관리도 편하고, 서버 비용도 절약될 거라 생각했는데요.

그런데 바로 그 믿음이 처참하게 깨지는 사건이 터지고 말았습니다.


### 갑자기 날아든 요금 폭탄의 범인을 찾아서

어느 날 플라이닷아이오(Fly.io)에서 날아온 청구서를 보고 제 눈을 의심했는데요.

'아웃바운드 대역폭(Outbound Bandwidth)' 항목이 무료 사용량을 아득히 초과하며 어마어마한 요금을 만들어내고 있었습니다.

분명 동적으로 데이터를 불러오던 리액트 시절보다 훨씬 트래픽이 적어야 정상이었거든요.

사실 이전의 리액트(React) 앱 시절에는 별도의 캐시 정책이 없어도 괜찮았거든요.

왜냐하면 한번 로드되고 나면 그 후로는 '싱글 페이지 애플리케이션(SPA)'처럼 작동했기 때문입니다.

페이지를 이동해도 브라우저가 통째로 새로고침하는 게 아니라, 필요한 데이터, 즉 마크다운(Markdown) 본문 내용만 쏙 가져와서 화면을 바꿔주는 방식이었는데요.

한번 불러온 자바스크립트(JavaScript)나 스타일시트(CSS)는 메모리에 그대로 남아있으니, 추가적인 대역폭 소모가 거의 발생하지 않았던 것입니다.

그런데 정적 사이트로 바꾸자마자 이런 문제가 터진 겁니다.

저는 플라이닷아이오(Fly.io)에서 추천하는 캐디(Caddy) 웹서버를 사용했는데요.

튜토리얼을 따라 설정한 초기 캐디파일(Caddyfile)은 정말이지 아주 단순했습니다.

먼저, `Dockerfile`입니다.

```dockerfile
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

이제 Caddy 서버를 위한 `Caddyfile` 파일의 내용입니다.

```caddy
:8080

root * /srv

# 콘텐츠를 압축하여 전송 속도를 높입니다. (gzip, zstd)
encode gzip zstd

# 정적 파일 서버를 활성화합니다.
file_server
```

이 설정에는 캐시 정책이 전무했거든요.

그래서 방문자는 페이지를 열 때마다 모든 파일을 새로 다운로드해야만 했습니다.

그리고 바로 이 지점에서, 저는 문제의 핵심과 마주하게 되었는데요.

범인은 바로 휴고(Hugo)의 검색 기능이 만들어내는 'search.json'이라는 파일이었습니다.

정적 사이트의 검색 기능을 위해 모든 글의 내용이 통째로 들어가는 이 파일 하나의 크기가 무려 9메가바이트(MB)에 달하는 괴물이였거든요.

캐시 정책도 없는 상태에서, 사이트에 접속할 때마다 방문자는 이 9메가바이트(MB)짜리 파일을 계속해서 다운로드하고 있었던 것입니다.


### 완벽한 해결책 그리고 새로운 재앙

원인을 찾았으니 해결은 명확했는데요.

우선 'search.json' 파일에서 글의 본문 전체를 저장하는 로직을 제거해 파일 크기를 획기적으로 줄였습니다.

그리고 근본적인 해결을 위해 캐디파일(Caddyfile)을 아래와 같이 대대적으로 수정했거든요.

```caddy
# Fly.io의 내부 포트(8080)
:8080

# Hugo가 빌드한 정적 파일 위치
root * /srv

# 정적 파일 서버
file_server

# 압축 활성화 (gzip, zstd 모두 사용)
encode gzip zstd

# 브라우저 캐시 정책 (1년 유지, 변경 불가로 표시)
@static {
    path *.css *.js *.woff2 *.woff *.ttf *.svg *.png *.jpg *.jpeg *.gif *.ico *.webp *.avif *.pdf *.json
}
header @static Cache-Control "public, max-age=31536000, immutable"

# HTML과 XML은 짧게 캐시 (변경 가능성 있으므로)
@html {
    path *.html *.xml
}
header @html Cache-Control "public, max-age=86400, stale-while-revalidate=604800"

# 기타 MIME 타입 (기본 1일 캐시)
header Cache-Control "public, max-age=86400"

# 기본 보안 헤더 추가
header {
    Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
    X-Content-Type-Options "nosniff"
    X-Frame-Options "DENY"
    Referrer-Policy "strict-origin-when-cross-origin"
    Content-Security-Policy "default-src 'self'; img-src 'self' data:;"
}
```

파일 종류별로 캐시 정책을 세분화하고, 보안 헤더까지 꼼꼼하게 챙긴, 제 스스로도 아주 만족스러운 설정이었습니다.

저는 승리를 직감하며 설정을 배포했는데요.

그런데 이번엔 구글 애드센스(Google AdSense) 광고가 감쪽같이 사라져 버렸습니다.

크롬 개발자 도구 콘솔에는 'blocked:csp'라는 무시무시한 에러 메시지만 가득했거든요.

요금 폭탄을 피했더니, 이제는 수익이 막혀버린 최악의 상황이었습니다.


### 2주간의 삽질 끝에 얻은 교훈

새로운 문제의 원인은 바로 제가 야심 차게 추가했던 '보안 헤더' 정책 때문이었는데요.

그중에서도 `X-Frame-Options "DENY"`와 `Content-Security-Policy` 이 두 줄이 범인이었습니다.

'X-Frame-Options'는 아이프레임(iframe) 자체를 막아버렸고, '콘텐츠 보안 정책(Content-Security-Policy)'은 외부 도메인인 구글의 스크립트 로드를 막아버렸거든요.

애드센스 광고는 바로 그 아이프레임(iframe)과 외부 스크립트로 동작하는 서비스였던 것입니다.

최종 `Caddyfile` 입니다.

```caddy
# Fly.io의 내부 포트(8080)
:8080

# Hugo가 빌드한 정적 파일 위치
root * /srv

# 정적 파일 서버
file_server

# 압축 활성화 (gzip, zstd 모두 사용)
encode gzip zstd

# 브라우저 캐시 정책 (1년 유지, 변경 불가로 표시)
@static {
    path *.css *.js *.woff2 *.woff *.ttf *.svg *.png *.jpg *.jpeg *.gif *.ico *.webp *.avif *.pdf *.json
}
header @static Cache-Control "public, max-age=31536000, immutable"

# HTML과 XML은 짧게 캐시 (변경 가능성 있으므로)
@html {
    path *.html *.xml
}
header @html Cache-Control "public, max-age=86400, stale-while-revalidate=604800"

# 기타 MIME 타입 (기본 1일 캐시)
header Cache-Control "public, max-age=86400"

# 기본 보안 헤더 추가
header {
    Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
    X-Content-Type-Options "nosniff"
    Referrer-Policy "strict-origin-when-cross-origin"
}
```

저는 허탈한 웃음과 함께 이 두 줄을 삭제했고, 마침내 광고가 정상적으로 노출되는 것을 확인할 수 있었는데요.

정적 사이트로의 전환으로 시작된 지난 2주는 그야말로 '삽질의 연속'이었습니다.

하지만 이 과정을 통해 서버, 캐시, 네트워크, 그리고 보안 정책까지 웹의 근간을 이루는 기술들을 몸으로 부딪히며 배울 수 있었던 귀중한 시간이었거든요.

혹시 저와 비슷한 문제를 겪고 계신 분이 있다면, 이 글이 조금이나마 도움이 되었으면 좋겠습니다.

결국 모든 문제에는 원인이 있고, 그 원인을 찾는 과정이야말로 가장 확실한 성장의 지름길이라는 것을 다시 한번 깨닫게 된 경험이었거든요.

2주간의 고통이 미래의 저에게는 큰 자산이 될 것이라 믿습니다.
