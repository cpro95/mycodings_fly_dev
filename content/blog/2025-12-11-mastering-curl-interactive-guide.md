---
slug: 2025-12-11-mastering-curl-interactive-guide
title: "개발자 필수 도구 컬(cURL) 완벽 정복 가이드"
summary: "전 세계 200억 번 이상 설치된 데이터 전송 도구 cURL의 핵심 기능을 대화하듯 쉽게 풀어낸 실전 가이드"
date: 2025-12-12T11:23:49.050Z
draft: false
weight: 50
tags: ["컬", "cURL", "HTTP 요청", "API 테스트", "커맨드라인", "리눅스 명령어", "데이터 전송"]
contributors: []
---

![개발자 필수 도구 컬(cURL) 완벽 정복 가이드](https://blogger.googleusercontent.com/img/a/AVvXsEhqitsRulC-K74eHnxq-RAbILhL09JNJs9C-a5f_LAsE78zNgcgSfo5u4YzVOjKL03udkyyrRwE8ks1lBN7diTWOYrc8A8i3SKl-YxpwMMkcOeQg3PnjLkWDpuzFtCtp0t_1UpkpOveKFHM1L7R0d6xPWIQLJspB6wsBN_PyvrrVfYFSSIOdzUl3VPMD-c=s16000)

'컬(cURL)'은 URL을 기반으로 클라이언트 측에서 인터넷 전송(업로드 및 다운로드)을 수행하는 도구인데요.

HTTP, FTP, IMAP과 같은 특정 프로토콜을 사용하여 데이터를 주고받을 때 필수적으로 사용됩니다.

현재 92개 운영체제에서 실행되며 전 세계적으로 200억 건 이상 설치된 검증된 도구이기도 하죠.

컬에는 방대한 참조 문서가 있고 심지어 500페이지에 달하는 전용 서적도 있거든요.

하지만 너무 방대한 분량보다는 가볍게 핵심만 파악하고 싶은 분들을 위해 필수적인 컬 작동법을 단계별로 정리했습니다.

처음부터 끝까지 읽으며 컬에 대해 깊이 있게 배우셔도 좋고, 관심 있는 특정 사용 사례로 바로 넘어가셔도 좋습니다.

예제 명령어를 직접 변경하고 실행해 보며 자유롭게 실험해 보시길 바랍니다.

이 글에서는 개념, 기본 HTTP, 고급 HTTP, 전송 제어, URL 처리, 추가 기능 순서로 살펴볼 텐데요.

각 단계별로 차근차근 따라오시면 됩니다.


## HTTP 개념

컬은 주로 HTTP 작업을 수행하는 데 사용되므로 이에 대한 이야기를 먼저 해보려 하는데요.

이론은 최대한 짧고 간단하게 짚고 넘어가겠습니다.


### HTTP 프로토콜

HTTP/1.x는 클라이언트와 서버 간의 통신을 설명하는 일반 텍스트 프로토콜이거든요.

클라이언트는 다음과 같은 메시지를 보냅니다.


```http
POST /anything/chat HTTP/1.1
host: httpbingo.org
content-type: application/json
user-agent: curl/7.87.0

{
    "message": "Hello!"
}
```

그러면 다음과 같은 메시지를 응답으로 받게 됩니다.


```http
HTTP/1.1 200 OK
date: Mon, 28 Aug 2023 07:51:49 GMT
content-type: application/json

{
    "message": "Hi!"
}
```

### HTTP 요청과 응답

익숙해지면 HTTP 요청과 응답을 읽는 것은 매우 쉬운데요.

HTTP/1.1의 후속인 HTTP/2는 바이너리 프로토콜입니다.

하지만 컬은 HTTP/2 메시지도 HTTP/1.1처럼 일반 텍스트로 표시해 주므로, 우리의 목적을 위해서는 이 사실을 신경 쓰지 않아도 됩니다.


### HTTP 요청

HTTP 요청은 크게 세 가지 부분으로 구성되거든요.


**요청 라인(Request line)**

`POST /anything/chat HTTP/1.1`

여기서 메서드(`POST`)는 클라이언트가 수행하려는 작업을 정의합니다.

경로(`/anything/chat`)는 요청된 리소스의 URL(프로토콜, 도메인, 포트 제외)입니다.

버전(`HTTP/1.1`)은 HTTP 프로토콜의 버전을 나타냅니다.


**요청 헤더(Request headers)**

```http
host: httpbingo.org
content-type: application/json
user-agent: curl/7.87.0
```
각 헤더는 요청에 대한 유용한 정보를 서버에 알려주는 키-값 쌍인데요.

위의 경우 서버의 호스트 이름(`httpbingo.org`), 콘텐츠 유형(`application/json`), 그리고 클라이언트의 식별 정보(`user-agent`)가 포함되어 있습니다.


**요청 본문(Request body)**

```json
{
    "message": "Hello!"
}
```
이는 클라이언트가 서버로 보내는 실제 데이터입니다.


HTTP 프로토콜은 상태를 저장하지 않기 때문에(stateless), 모든 상태 정보는 요청 자체(헤더 또는 본문)에 포함되어야 합니다.


### HTTP 응답

HTTP 응답 또한 세 가지 주요 섹션으로 구성되는데요.


**상태 라인(Status line)**

`HTTP/1.1 200 OK`

버전(`HTTP/1.1`)은 HTTP 프로토콜 버전을 나타냅니다.

상태 코드(`200`)는 요청이 성공했는지 실패했는지, 그리고 그 이유를 알려줍니다(상황별로 다양한 상태 코드가 있습니다).

상태 메시지는 상태 코드를 사람이 읽을 수 있도록 설명한 것인데, HTTP/2에는 이 메시지가 없습니다.


**응답 헤더(Response headers)**

```http
date: Mon, 28 Aug 2023 07:51:49 GMT
content-type: application/json
```
요청 헤더와 유사하게, 클라이언트에게 응답에 대한 유용한 정보를 제공합니다.


**응답 본문(Response body)**

```json
{
    "message": "Hi!"
}
```
서버가 클라이언트에게 보내는 실제 데이터입니다.


HTTP 프로토콜에는 훨씬 더 많은 내용이 있지만, 이 정도 기본 지식이면 충분하거든요.

이제 다음 단계로 넘어가 보겠습니다.


## 기본 HTTP

이제 컬에서 HTTP를 다루는 방법을 살펴볼 텐데요.

가장 기본적인 메서드부터 확인해 보겠습니다.


### 메서드

컬은 모든 HTTP 메서드(동사라고도 함)를 지원합니다.


**GET (기본값, 옵션 필요 없음)**


```bash
curl http://httpbingo.org/get
```

'Httpbin(httpbingo.org)'은 HTTP 디버깅 서비스인데요.

이 서비스의 `/get` 핸들은 들어오는 GET 요청의 모든 세부 정보를 JSON 객체로 반환합니다.

따라서 응답에 보이는 JSON은 컬이 아니라 Httpbin에서 보낸 것입니다.

Httpbin은 다양한 HTTP 기능을 위한 유사한 핸들을 제공하며, 이 가이드 전체에서 자주 사용할 예정입니다.


**HEAD (`-I`/`--head`, 헤더만 반환)**


```bash
curl --head http://httpbingo.org/head
```

**POST (데이터는 `-d`/`--data`, HTTP 폼은 `-F`/`--form`)**


```bash
curl --data "name=alice" http://httpbingo.org/post
```

**그 외 메서드 (`-X` 또는 `--request` 사용)**


```bash
curl --request PATCH --data "name=alice" \
  http://httpbingo.org/patch
```

### 응답 코드

일반적으로 상태 코드 2xx(특히 200)는 '성공'으로 간주되고, 4xx는 클라이언트 오류, 5xx는 서버 오류로 취급되는데요.

하지만 컬은 코드에 신경 쓰지 않습니다.

컬 입장에서는 모든 HTTP 응답이 성공입니다.


```bash
curl http://httpbingo.org/status/503 && echo OK
```

컬이 4xx 및 5xx 코드를 오류로 취급하게 하려면 `-f`(`--fail`) 옵션을 사용해야 하거든요.


```bash
curl --fail http://httpbingo.org/status/503 && echo OK
```

응답 코드를 출력하려면 `-w`(`--write-out`) 옵션과 `response_code` 변수를 사용하면 됩니다.


```bash
curl --write-out "%{response_code}" http://httpbingo.org/status/200
```

`--write-out` 옵션은 응답의 특정 부분을 추출하는데요.

이에 대해서는 고급 HTTP 장에서 더 자세히 다루겠습니다.


### 응답 헤더

본문과 함께 응답 헤더를 표시하려면 `-i`(`--include`)를 사용합니다.


```bash
curl --include http://httpbingo.org/uuid
```

또는 `-D`(`--dump-header`)를 사용하여 파일에 저장할 수도 있습니다.


```bash
curl --dump-header /tmp/headers \
  http://httpbingo.org/uuid >/dev/null

cat /tmp/headers
```

### 응답 본문

응답 본문(페이로드라고도 함)은 컬이 기본적으로 출력하는 내용이거든요.


```bash
curl http://httpbingo.org/get
```

`--compressed`를 사용하여 서버에 데이터 압축을 요청할 수 있지만, 컬은 여전히 압축 해제된 상태로 보여줍니다.


```bash
curl --compressed http://httpbingo.org/get
```
(요청에 `Accept-Encoding` 헤더가 추가된 것을 확인할 수 있습니다.)


### POST

POST는 서버에 데이터를 전송하는데요.

기본적으로 `application/x-www-form-urlencoded` Content-Type 헤더와 함께 단일 문자열로 인코딩된 키-값 쌍의 집합입니다.


개별 키-값 쌍(또는 전체 문자열)을 지정하려면 `-d`(`--data`)를 사용합니다.


```bash
curl --data name=alice --data age=25 \
  http://httpbingo.org/post
```

파일에서 데이터를 전송하려면 `@` 뒤에 파일 경로를 사용하면 되는데요.

파일 내용에 따라 Content-Type 헤더를 변경하려면 `-H`(`--header`)를 사용해야 합니다.


```bash
echo "Alice, age 25" > /tmp/data.txt

curl --data @/tmp/data.txt \
  --header "content-type: text/plain" \
  http://httpbingo.org/post
```

`--data-raw`는 `--data`와 유사하게 데이터를 게시하지만 `@` 문자를 특수하게 해석하지 않습니다.


JSON 데이터를 게시하려면 `--json`을 사용하면 되거든요.

이 옵션은 `Content-Type` 및 `Accept` 헤더를 자동으로 설정해 줍니다.


```bash
curl --json '{"name": "alice"}' http://httpbingo.org/post
```

데이터를 URL 인코딩(URL에서 허용되지 않는 모든 기호 이스케이프)하려면 `--data-urlencode`를 사용합니다.


```bash
curl --data-urlencode "name=Barton, Alice" \
  http://httpbingo.org/post
```

### PUT

PUT 메서드는 종종 서버에 파일을 전송하는 데 사용되는데요.

이를 위해 `-T`(`--upload-file`)를 사용합니다.


```bash
echo hello > /tmp/hello.txt
curl --upload-file /tmp/hello.txt http://httpbingo.org/put
```

때로는 REST API 요청에 PUT이 사용되기도 하거든요.

이 경우 `-X`(`--request`)로 메서드를 설정하고 `-d`(`--data`)로 데이터를 전송하면 됩니다.


```bash
curl --request PUT \
  --header "content-type: application/json" \
  --data '{"name": "alice"}' \
  http://httpbingo.org/put
```

## 고급 HTTP

HTTP 프로토콜에는 수많은 기능이 있는데요.

모두 다루지는 않겠지만, 몇 가지 고급 기능을 살펴보겠습니다.


### 응답 변수

응답에 대한 특정 정보를 추출하려면 `-w`(`--write-out`)을 사용합니다.

이 옵션은 50개 이상의 변수를 지원하는데, 예를 들어 상태 코드와 응답 콘텐츠 유형을 추출하는 방법은 다음과 같습니다.


```bash
curl --write-out "\nstatus: %{response_code}\ntype: %{content_type}" \
  http://httpbingo.org/status/429
```

또는 일부 응답 헤더를 추출할 수도 있죠.


```bash
curl --write-out "\ndate: %header{date}\nlength: %header{content-length}" \
  http://httpbingo.org/uuid
```

### 리다이렉트 (Redirects)

리다이렉트는 서버가 요청된 리소스를 반환하는 대신, 리소스가 다른 곳에 있다고(`Location` 헤더로 표시됨) 클라이언트에게 알리는 것인데요.

리다이렉트는 항상 3xx 응답 코드를 가집니다.


컬은 기본적으로 리다이렉트를 따라가지 않고 응답을 있는 그대로 반환합니다.


```bash
curl --include http://httpbingo.org/redirect/1
```

`302 Found` 상태와 리다이렉트 된 위치를 가리키는 `Location` 응답 헤더를 확인해 보세요.


컬이 리다이렉트를 따라가게 하려면 `-L`(`--location`)을 사용해야 하거든요.


```bash
curl --location http://httpbingo.org/redirect/1
```

무한 리다이렉트 루프를 방지하려면 `--max-redirs`를 사용합니다.


```bash
curl --location --max-redirs 3 \
  http://httpbingo.org/redirect/10
```

### 범위 (Ranges)

데이터 전체가 아닌 일부분만 서버에 요청하려면 `-r`(`--range`) 옵션을 사용하는데요.

이렇게 하면 컬이 지정된 바이트 범위를 요청하게 됩니다.


예를 들어, 100번째 바이트부터 50바이트를 요청하는 방법은 다음과 같습니다.


```bash
curl --range 100-150 http://httpbingo.org/range/1024
```

참고로 서버는 이 요청을 무시하고 전체 응답을 반환할 수도 있습니다.


서버에서 데이터를 다운로드하는 경우, `-C`(`--continue-at`)를 사용하여 지정된 오프셋에서 이전 전송을 계속할 수도 있습니다.


```bash
curl --continue-at 1000 http://httpbingo.org/range/1024
```

### 조건부 요청 (Conditional requests)

조건부 요청은 이미 다운로드한 데이터가 오래되지 않았다면 다시 다운로드하지 않으려 할 때 유용한데요.

컬은 파일 타임스탬프와 etag라는 두 가지 조건을 지원합니다.


타임스탬프 조건을 설정하려면 `-z`(`--time-cond`)를 사용합니다.


원격 리소스가 더 최신일 때만 데이터를 다운로드하려면 다음과 같이 작성합니다(조건 충족).


```bash
curl --time-cond "Aug 30, 2023" http://httpbingo.org/etag/etag
```

반대로 더 오래된 경우에만 다운로드하려면 대시(`-`)를 붙입니다(조건 실패).


```bash
curl --include --time-cond "-Aug 30, 2023" \
  http://httpbingo.org/etag/etag
```

Etag 조건은 조금 더 복잡하거든요.

Etag는 요청된 리소스의 현재 버전을 고유하게 식별하기 위해 서버가 반환하는 값인데, 종종 데이터의 해시값이 사용됩니다.


Etag를 확인하려면 컬이 먼저 `--etag-save`로 저장해야 합니다.


```bash
curl --etag-save /tmp/etags \
  http://httpbingo.org/etag/20230830 >/dev/null
```

```bash
cat /tmp/etags
# 20230830 is the etag value
```

그리고 후속 요청에서 `--etag-compare`를 사용합니다.


```bash
curl --include --etag-compare /tmp/etags \
  http://httpbingo.org/etag/20230830
```

타임스탬프 조건은 `Last-Modified` 응답 헤더에 의존하므로, 서버가 이를 제공하지 않으면 리소스는 항상 더 최신인 것으로 간주됩니다.

Etag 조건과 `Etag` 응답 헤더도 마찬가지입니다.


### 멀티파트 폼 전송 (Multipart formpost)

POST는 `multipart/form-data` 콘텐츠 유형을 사용하여 데이터를 일련의 '파트'로 전송할 수 있는데요.

텍스트 필드와 파일을 모두 포함하는 HTML 폼에 자주 사용됩니다.


각 파트에는 이름, 헤더, 데이터가 있고, 파트는 'MIME 경계(boundary)'로 구분됩니다.


```
--------------------------d74496d66958873e
Content-Disposition: form-data; name="person"

anonymous
--------------------------d74496d66958873e
Content-Disposition: form-data; name="secret"; filename="file.txt"
Content-Type: text/plain

contents of the file
--------------------------d74496d66958873e--
```

컬로 멀티파트 요청을 구성하려면 `-F`(`--form`)를 사용하면 되거든요.

이 옵션 각각이 요청에 파트를 추가합니다.


```bash
touch /tmp/alice.png

curl --form name=Alice --form age=25 \
  --form photo=@/tmp/alice.png \
  http://httpbingo.org/dump/request
```

### 쿠키 (Cookies)

HTTP 프로토콜은 상태를 저장하지 않죠.

쿠키는 이 문제를 해결하는 기발한 방법입니다.


1.  서버는 클라이언트 세션과 상태를 연결하고 싶어 합니다.
2.  서버는 그 상태를 `Set-Cookie` 응답 헤더에 담아 반환합니다.
3.  클라이언트는 쿠키를 인식하고 각 요청마다 `Cookie` 요청 헤더에 담아 다시 보냅니다.

각 쿠키에는 만료 날짜가 있는데, 명시적인 날짜일 수도 있고 '세션 종료 시'일 수도 있습니다(브라우저 클라이언트의 경우, 보통 사용자가 브라우저를 닫을 때입니다).


컬은 기본적으로 쿠키를 무시하는데요.

활성화하려면 `-b`(`--cookie`) 옵션을 사용해야 합니다.

컬이 호출 간에 쿠키를 유지하게 하려면 `-c`(`--cookie-jar`)를 사용합니다.


여기서 서버는 세션 ID 쿠키를 123456으로 설정하고, 컬은 이를 `/tmp/cookies`라는 쿠키 저장소(jar)에 저장합니다.


```bash
curl --cookie "" --cookie-jar /tmp/cookies \
  http://httpbingo.org/cookies/set?sessionid=123456
```

```bash
cat /tmp/cookies
```

쿠키 저장소(`/tmp/cookies`)를 가리키는 `--cookie`와 함께 후속 컬 호출을 하면 세션 ID 쿠키가 서버로 다시 전송됩니다.


```bash
curl --cookie /tmp/cookies http://httpbingo.org/cookies
```

컬은 만료된 쿠키를 쿠키 저장소에서 자동으로 삭제하거든요(서버가 명시적 만료 날짜를 설정해야 함).

세션 기반 쿠키를 삭제하려면 `-j`(`--junk-session-cookies`)를 사용하면 됩니다.


```bash
curl --junk-session-cookies --cookie /tmp/cookies \
  http://httpbingo.org/cookies
```

### HTTP 버전

기본적으로 컬은 http 스킴에는 HTTP/1.1을, https에는 HTTP/2를 사용하는데요.

플래그를 사용하여 이를 변경할 수 있습니다.


*   `--http0.9`
*   `--http1.0`
*   `--http1.1`
*   `--http2`
*   `--http3`

서버가 어떤 버전을 지원하는지 알아보려면 `http_version` 응답 변수를 사용해 보세요.


```bash
curl --write-out "%{http_version}" http://httpbingo.org/status/200
```

## 전송 제어

컬은 인터넷 전송(업로드 및 다운로드)을 위한 도구입니다.

이제 이를 제어하는 방법을 알아보겠습니다.


### 다운로드

`stdout` 대신 지정된 파일에 응답을 쓰려면 `-o`(`--output`)를 사용합니다.


```bash
curl --output /tmp/uuid.txt http://httpbingo.org/uuid
cat /tmp/uuid.txt
```

응답의 특정 부분에만 관심이 있다면 `--write-out`으로 추출하고 나머지는 `--output /dev/null`로 버리면 되거든요.


```bash
curl --write-out "HTTP %{response_code}\n" \
  --output /dev/null \
  http://httpbingo.org/get
```

`-O`(`--remote-name`)는 URL에 지정된 파일명(구체적으로는 마지막 `/` 이후 부분)으로 출력을 저장하라고 컬에게 지시합니다.

이 옵션은 파일을 저장할 정확한 위치를 지정하는 `--output-dir`과 함께 자주 사용됩니다.


```bash
curl --remote-name --output-dir /tmp \
  http://httpbingo.org/uuid

cat /tmp/uuid
```

디렉터리가 존재하지 않으면 `--output-dir`이 자동으로 생성해주지 않는데요.

이럴 때는 `--create-dirs`를 사용해야 합니다.


```bash
curl --remote-name \
  --output-dir /tmp/some/place --create-dirs \
  http://httpbingo.org/uuid

cat /tmp/some/place/uuid
```

### 업로드

컬은 서버에서 데이터를 다운로드하는 데 자주 사용되지만, 업로드도 가능하거든요.

`-T`(`--upload-file`) 옵션을 사용하면 됩니다.


```bash
echo hello > /tmp/hello.txt
curl --upload-file /tmp/hello.txt http://httpbingo.org/put
```

HTTP 업로드의 경우 컬은 PUT 메서드를 사용합니다.


### 이름 해석 (Name resolving)

기본적으로 컬은 DNS 서버를 사용하여 호스트 이름을 IP 주소로 해석하는데요.

하지만 `--resolve`를 사용하여 특정 IP로 강제 해석하게 할 수 있습니다(동일한 포트 사용).


```bash
curl --resolve httpbingo.org:8080:127.0.0.1 \
  http://httpbingo.org:8080/get
```
(이 예제는 127.0.0.1:8080에서 수신 대기 중인 서버가 없으므로 실패합니다.)


또는 `--connect-to`를 사용하여 호스트명:포트 쌍을 다른 호스트명:포트 쌍으로 매핑할 수도 있습니다.


```bash
curl --connect-to httpbingo.org:8080:httpbingo.org:80 \
  http://httpbingo.org:8080/get
```
(Httpbin이 80번 포트에서 응답하므로 이 예제는 잘 작동합니다.)


### 전송 제어 (Transfer controls)

느린 전송을 중지하려면 `--speed-limit`으로 최소 허용 다운로드 속도(초당 바이트 수)를 설정하면 되는데요.

기본적으로 컬은 30초 간격으로 속도를 확인하지만, `--speed-time`으로 이 간격을 변경할 수 있습니다.


예를 들어, 3초 간격 동안 10 bytes/sec 미만이면 중지하도록 설정해 보겠습니다.


```bash
curl --speed-limit 10 --speed-time 3 http://httpbingo.org/get
```

대역폭 사용량을 제한하려면 `--limit-rate`를 설정합니다.

바이트부터 페타바이트까지 모든 단위를 허용합니다.


```bash
curl --limit-rate 3 http://httpbingo.org/get
curl --limit-rate 3k http://httpbingo.org/get
curl --limit-rate 3m http://httpbingo.org/get
curl --limit-rate 3g http://httpbingo.org/get
curl --limit-rate 3t http://httpbingo.org/get
curl --limit-rate 3p http://httpbingo.org/get
```

또 다른 제한 사항으로 동시 요청 수(예: 많은 파일을 다운로드할 때)가 있거든요.

이를 위해 `--rate`를 사용하며 초, 분, 시간 또는 일 단위를 허용합니다.


```bash
curl --rate 3/s http://httpbingo.org/anything/[1-9].txt
curl --rate 3/m http://httpbingo.org/anything/[1-9].txt
curl --rate 3/h http://httpbingo.org/anything/[1-9].txt
curl --rate 3/d http://httpbingo.org/anything/[1-9].txt
```

### 타임아웃 (Timeouts)

컬이 단일 URL과 상호 작용하는 데 소비하는 최대 시간을 제한하려면 `--max-time`을 사용합니다(소수점 초 단위).


```bash
curl --max-time 0.5 http://httpbingo.org/delay/1
```
(이 예제는 실패합니다.)


전체 시간을 제한하는 대신, `--connect-timeout`을 사용하여 네트워크 연결을 설정하는 데 걸리는 시간만 제한할 수도 있는데요.


```bash
curl --connect-timeout 0.5 http://httpbingo.org/delay/1
```
(이 예제는 잘 작동합니다.)


### 재시도 (Retries)

때로는 원격 호스트를 일시적으로 사용할 수 없는 경우가 있죠.

이런 상황을 처리하기 위해 컬은 `--retry [num]` 옵션을 제공합니다.

요청이 실패하면 컬은 다시 시도하지만 `num` 횟수만큼만 시도합니다.


```bash
curl --include --retry 3 http://httpbingo.org/unstable
```
(이 URL은 50%의 확률로 실패합니다.)


`--retry-max-time`(초 단위)으로 컬이 재시도하는 데 소비하는 최대 시간을 설정하거나, `--retry-delay`(초 단위)로 재시도 간의 지연 시간을 설정할 수도 있습니다.


```bash
curl --include \
  --retry 3 --retry-max-time 2 --retry-delay 1 \
  http://httpbingo.org/unstable
```

컬에게 '요청 실패'란 HTTP 코드 408, 429, 500, 502, 503 또는 504 중 하나를 의미하거든요.

'연결 거부(connection refused)' 오류로 요청이 실패하면 컬은 재시도하지 않습니다.

하지만 `--retry-connrefused`로 이를 변경하거나, `--retry-all-errors`로 모든 종류의 문제에 대해 재시도를 활성화할 수도 있습니다.


## URL 처리

컬은 RFC 3986이 정의하는 것과 유사한 방식으로 URL(실제로는 URI)을 지원합니다.


`scheme://user:password@host:port/path?query#fragment`

*   `scheme`: 프로토콜을 정의합니다(https 또는 ftp 등). 생략하면 컬이 추측합니다.
*   `user` 및 `password`: 인증 자격 증명입니다(보안상의 이유로 URL에 자격 증명을 전달하는 것은 일반적으로 더 이상 사용되지 않습니다).
*   `host`: 서버의 호스트 이름, 도메인 이름 또는 IP 주소입니다.
*   `port`: 포트 번호입니다. 생략하면 컬은 스킴과 관련된 기본 포트(http의 경우 80, https의 경우 443 등)를 사용합니다.
*   `path`: 서버 상의 리소스 경로입니다.
*   `query`: 보통 `&`로 구분된 `name=value` 쌍의 시퀀스입니다.

컬의 경우 `-` 또는 `--`로 시작하는 모든 것은 옵션이고, 그 외의 모든 것은 URL입니다.


### URL 파라미터

URL 파라미터를 많이 전달하면 쿼리 부분이 꽤 길어질 수 있는데요.

`--url-query` 옵션을 사용하면 쿼리 부분을 별도로 지정할 수 있습니다.


```bash
curl --url-query "name=Alice" --url-query "age=25" \
  http://httpbingo.org/get
```

### 다중 URL (Multiple URLs)

컬은 원하는 만큼의 URL을 허용하며, 각 URL에는 목적지(stdout 또는 파일)가 필요합니다.

예를 들어, 다음 명령은 첫 번째 UUID를 `/tmp/uuid1.json`에 저장하고 두 번째 UUID를 `/tmp/uuid2.json`에 저장합니다.


```bash
curl \
  --output /tmp/uuid1.json http://httpbingo.org/uuid \
  --output /tmp/uuid2.json http://httpbingo.org/uuid

cat /tmp/uuid1.json
cat /tmp/uuid2.json
```

`-O`(`--remote-name`)는 URL에서 파일명을 가져오는데요.


```bash
curl --output-dir /tmp \
  --remote-name http://httpbingo.org/anything/one \
  --remote-name http://httpbingo.org/anything/two

ls /tmp
```

두 응답을 같은 파일에 쓰려면 리다이렉션을 사용할 수 있습니다.


```bash
curl http://httpbingo.org/uuid http://httpbingo.org/uuid > /tmp/uuid.json
cat /tmp/uuid.json
```

### URL 글로빙 (URL globbing)

컬은 URL의 글로브 표현식을 여러 개의 특정 URL로 자동 확장해 줍니다.


예를 들어, 다음 명령은 세 가지 다른 경로(al, bt, gm)와 각각 두 가지 다른 파라미터(num=1 및 num=2)를 조합하여 총 6개의 URL을 요청합니다.


```bash
curl --output-dir /tmp --output "out_#1_#2.txt" \
  http://httpbingo.org/anything/{al,bt,gm}?num=[1-2]

ls /tmp
```

URL에 `[]{}` 문자가 유효하게 사용되는 경우 `--globoff` 옵션으로 글로빙을 비활성화할 수 있거든요.

그러면 컬은 해당 문자들을 문자 그대로 취급합니다.


### 상태 초기화 (State reset)

옵션을 설정하면 컬이 처리하는 모든 URL에 해당 옵션이 적용되는데요.

예를 들어, 다음의 경우 두 헤더 모두 두 URL로 전송됩니다.


```bash
curl \
  -H "x-num: one" http://httpbingo.org/headers?1 \
  -H "x-num: two" http://httpbingo.org/headers?2
```

하지만 이게 원하는 동작이 아닐 때가 있죠.

URL 호출 간에 상태를 초기화하려면 `--next` 옵션을 사용하면 됩니다.


```bash
curl \
  -H "x-num: one" http://httpbingo.org/headers?1 \
  --next \
  -H "x-num: two" http://httpbingo.org/headers?2
```

## 추가 기능

유용하게 사용할 수 있는 몇 가지 추가적인 컬 기능에 대해 이야기해 보겠습니다.


### 상세 모드 (Verbose)

`-v`(`--verbose`)는 컬을 상세 모드로 만들어 디버깅에 유용한데요.


```bash
# curl은 디버그 정보를 stderr로 출력하므로,
# `2>&1`을 사용하여 stdout으로 리다이렉션해야 합니다.
curl --verbose http://httpbingo.org/uuid 2>&1
```

`--verbose`로 충분하지 않다면 `--trace`를 사용해 보세요(단일 `-`는 트레이스 출력을 stdout으로 보냅니다).


```bash
curl --trace - http://httpbingo.org/uuid
```

또는 `--trace-ascii`도 있습니다.


```bash
curl --trace-ascii - http://httpbingo.org/uuid
```

### 진행률 표시기 (Progress meters)

컬에는 두 가지 진행률 표시기가 있는데요.

기본값은 상세(verbose) 표시기입니다.


```bash
# 설정 파일에 `silent` 옵션이 있다면 명시적으로 꺼야 합니다.
# 기본적으로 설정되어 있지 않으므로 `--no-silent`는 필요하지 않습니다.

# 또한 curl은 진행 상황을 stderr로 출력하므로
# `2>&1`을 사용하여 stdout으로 리다이렉션해야 합니다.

curl --no-silent http://httpbingo.org/uuid 2>&1
```

다른 하나는 간략한 표시기입니다.


```bash
curl --no-silent --progress-bar http://httpbingo.org/uuid 2>&1
```

`--silent` 옵션은 표시기를 완전히 끕니다.


```bash
curl --silent http://httpbingo.org/uuid 2>&1
```

### 자격 증명 (Credentials)

컬 명령어 자체에 사용자 이름과 비밀번호를 전달하고 싶지 않을 때가 많죠.

이를 피하는 한 가지 방법은 `.netrc` 파일을 사용하는 것입니다.

이 파일은 호스트 이름과 접근 자격 증명을 지정합니다.


```text
machine httpbingo.org
login alice
password cheese

machine example.com
login bob
password nuggets
```

`--netrc` 옵션을 전달하여 `$HOME/.netrc` 파일을 사용하거나, `--netrc-file`로 특정 파일을 사용할 수 있습니다.


```bash
echo -e "machine httpbingo.org\nlogin alice\npassword cheese" > /tmp/netrc

curl --netrc-file /tmp/netrc \
  http://httpbingo.org/basic-auth/alice/cheese
```

### 설정 파일 (Config file)

옵션 수가 늘어나면 컬 명령어를 해독하기 어려워지는데요.

가독성을 높이기 위해 한 줄에 하나의 옵션을 나열하는 설정 파일을 준비할 수 있습니다(`--`는 선택 사항).


```text
output-dir /tmp
show-error
silent
```

기본적으로 컬은 `$HOME/.curlrc`에서 설정을 읽지만, `-K`(`--config`) 옵션으로 이를 변경할 수 있습니다.


```bash
curl --config /sandbox/.curlrc http://httpbingo.org/uuid
```

### 종료 상태 (Exit status)

컬이 종료될 때 셸에 숫자 값을 반환하거든요.

성공 시에는 0이고, 오류 시에는 약 100개의 다른 값이 있습니다.


예를 들어, 다음은 종료 상태 7(호스트 연결 실패)입니다.


```bash
curl http://httpbingo.org:1313/get
echo "exit status = $?"
```

`$?` 셸 변수를 통해 종료 상태에 접근할 수 있습니다.


## 마치며

여기까지입니다!

다양한 HTTP 요청 만들기부터 전송 제어, URL 처리, 그리고 컬 설정까지 많은 내용을 다뤘는데요.


여러분의 '컬 내공'이 조금은 더 깊어졌기를 바랍니다.

더 발전하고 싶다면 두 가지 훌륭한 리소스를 추천합니다.

바로 [man curl](https://curl.se/docs/manpage.html)과 [Everything curl](https://everything.curl.dev/)입니다.

