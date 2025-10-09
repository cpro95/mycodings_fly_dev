---
slug: 2024-05-18-golang-web-server-with-htmx-aka-gohtmx-stack
title: Go + HTMX 조합으로 웹 서버 구축하기
date: 2024-05-18 08:51:21.262000+00:00
summary: Go 언어로 웹 서버를 구축하고 HTMX로 동적 데이터 관리하기
tags: ["go", "golang", "htmx"]
contributors: []
draft: false
---

안녕하세요?

오늘은 Go + HTMX 조합으로 Todo 앱을 만들어 보겠습니다.

먼저, Golang의 HTTP 모듈과 HTML 템플릿 모듈을 사용하고, 이를 HTMX와 통합하는 방법을 살펴보겠습니다.

시작해 볼까요?

---

** 목 차 **

- [Go + HTMX 조합으로 웹 서버 구축하기](#go--htmx-조합으로-웹-서버-구축하기)
  - [Golang 웹 서버 만들기](#golang-웹-서버-만들기)
    - [서버 설정하기](#서버-설정하기)
    - [io.WriteString 사용하기](#iowritestring-사용하기)
  - [HTML 템플릿 사용하기](#html-템플릿-사용하기)
    - [템플릿 파일 만들기](#템플릿-파일-만들기)
    - [Golang에서 템플릿 사용하기](#golang에서-템플릿-사용하기)
  - [template에 데이터 보내기](#template에-데이터-보내기)
  - [TailwindCSS와 HTMX 통합](#tailwindcss와-htmx-통합)
    - [Todo 폼 만들기](#todo-폼-만들기)
    - [Add Todo 폼 처리하기](#add-todo-폼-처리하기)
  - [hx-target 사용](#hx-target-사용)
  - [hx-indicator 사용해 보기](#hx-indicator-사용해-보기)
  - [Template Fragments](#template-fragments)

---

## Golang 웹 서버 만들기

우선, 요청(Request)을 받고 응답(Response)을 생성하는 Golang 웹 서버를 만들어보겠습니다.

이를 위해 Golang 표준 라이브러리의 HTTP 패키지를 사용할 것입니다.

이 패키지는 클라이언트와 서버 기반의 다양한 함수를 포함하고 있습니다.

예를 들어, 클라이언트 함수인 `Get`과 `Post`는 엔드포인트로 요청을 보냅니다.

우리는 `ListenAndServe` 함수를 사용하여 백엔드에서 웹 서버를 만들 것입니다.

### 서버 설정하기

`main.go` 파일을 열고 아래와 같이 작성합니다.

```go
package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {

	handler1 := func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Hello World")
	}
	http.HandleFunc("/", handler1)
	log.Fatal(http.ListenAndServe(":8000", nil))
}
```

이 코드는 `http.HandleFunc` 함수를 사용하여 `/` URL 패턴을 `handler1` 함수에 연결합니다.

`handler1` 함수는 HTTP 요청을 처리하고 "Hello World"라는 메시지를 응답으로 보냅니다.

터미널에서 서버를 실행하려면 아래 명령어를 사용합니다.

```sh
go run main.go
```

브라우저에서 `localhost:8000`으로 접속하면 "Hello World" 메시지가 보입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEh329Yrxb-H8B1SvVC78nVdYV-Os3_KCsT7nEGDTgTgekFQCz9Eh24vB1UcWLxTONFmU7J9x4FCQjJZsJMraXiD0CeYMzj1D1f2j91CtVQLD575ShD-6Ohf3S4B0RhxwGIeLoVdnc-JGnTIQ4iUMsYwUk_nhiSoABJyZb5jqTuevpJ4ygUeTEuazkx_-4w)

### io.WriteString 사용하기

`handler1` 함수에서 fmt.Fprintf 메서드를 사용했는데 `io.WriteString` 함수를 사용하겠습니다.

```go
handler1 := func(w http.ResponseWriter, r *http.Request) {
		io.WriteString(w, "Go + HTMX Todo App\n")
		io.WriteString(w, r.Method)
	}
```

위와 같이 코드를 바꾸고 http.Request의 r.Method 값도 같이 출력해 보았습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgrXxExElgvua0BAUr7KX8JOQ8hUTkg5lmFP-EcGLeBcqfQXAuLxk9waqHfwRq4cetQwhw2_l35G6CyyDdINDV1OOZq-3XLx-LCjPibuvWzusyCrEp5XJFMoSPOOotl6ceHk1u5QMz5H6MnL24EChBxg-ZgI8fveehUV-PvedhNbspSEd49SQzB5L-LdLI)

---

## HTML 템플릿 사용하기

이제 HTML 템플릿을 반환하는 방법을 알아보겠습니다.

HTMX를 사용할 때는 HTML 템플릿의 일부를 클라이언트에 반환할 것이므로, 이를 처리하는 방법을 이해해야 합니다.

### 템플릿 파일 만들기

먼저, `index.html` 파일을 생성하고 기본 HTML 구조를 작성합니다.

아래와 같이 작성해보세요.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Go + HTMX Todo App</title>
  </head>
  <body>
    <h1>Go + HTMX Todo App</h1>
  </body>
</html>
```

### Golang에서 템플릿 사용하기

`main.go` 파일을 수정하여 HTML 템플릿을 사용하도록 설정합니다.

`html/template` 패키지를 사용하여 템플릿 파일을 로드하고 렌더링하겠습니다.

```go
package main

import (
	"log"
	"net/http"
	"text/template"
)

func main() {

	handler1 := func(w http.ResponseWriter, r *http.Request) {
		tmpl := template.Must(template.ParseFiles("index.html"))
		tmpl.Execute(w, nil)
	}
	http.HandleFunc("/", handler1)
	log.Fatal(http.ListenAndServe(":8000", nil))
}

```

이 코드는 `template.ParseFiles` 함수를 사용하여 `index.html` 파일을 로드하고, `template.Execute` 함수를 사용하여 템플릿을 렌더링합니다.

서버를 다시 실행하고 브라우저에서 `localhost:8000`으로 접속하면 H1 태그가 출력된 것을 볼 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEghOsAvzhq9u40UAOIlLxfNU2ALPe_LypWF-Lras0plBLHV8uOeLAEhkEvOa6lilEk9t8o619kGbamR6DSjPwzUkQGVs_qH7w9ei68AZyg1vg64tsWaxCHY6h76Y4ak8Y1Ocwf4H2Y1FTSa94GgBsd3QT_NmvVPrVC_3dHO2C6StdncLUDOG-jQHjbZu1o)

## template에 데이터 보내기

```go
tmpl.Execute(w,nil)
```

위 코드에서 처럼 template Execute 메서드 두 번째 인자에 nil 값을 넣었는데, 여기에 데이터를 넣어주면 template 파일에서 그 데이터 값에 접근할 수 있습니다.

즉, index.html 파일에서 데이터 값에 접근할 수 있다는 겁니다.

Go 언어의 템플릿 언어에 대해 공부하려면 이전에 작성했던 글인 [Go 템플릿 완벽 가이드 - 문법과 내부 동작](https://mycodings.fly.dev/blog/2024-05-18-go-templates-complete-guide)를 참조하시기 바랍니다.

먼저, Todo 구조체를 만듭니다.

그리고 더미(dummy) 데이터를 넣어서 tmpl.Execute에 전달해 줍니다.

```go
package main

import (
	"log"
	"net/http"
	"text/template"
)

type Todo struct {
	Title     string
	Completed bool
}

func main() {

	handler1 := func(w http.ResponseWriter, r *http.Request) {
		tmpl := template.Must(template.ParseFiles("index.html"))
		todos := map[string][]Todo{
			"Todos": {
				{Title: "Learn GoLang", Completed: false},
				{Title: "Learn Rust", Completed: false},
			},
		}
		tmpl.Execute(w, todos)
	}
	http.HandleFunc("/", handler1)
	log.Fatal(http.ListenAndServe(":8000", nil))
}
```

이제 index.html 파일에서 템플릿 문법으로 우리가 넘긴 todos map을 보여주면 됩니다.

```html
  <body>
    <h1>Go + HTMX Todo App</h1>
    {{ range .Todos }}
    <p>{{ .Title }} - {{ .Completed }}</p>
    {{ end }}
  </body>
```

이제 다시 서버를 재실행해 보면 아래와 같이 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEi40l3HU6jszRVX9YrDY4qgywigFqllUQmAqLvaGRpJvuvEIirRyVmkwZ0qpsOJOqaScB3Mp14lgntHAtT3xXZvbGKLwJz2fo_8X9YeN8DfhF2OibTSI-whWWRo8XZEyikgqip5li4qWGxunN-LzpEKyFtMeR1diTldLkl7tklT_evnr725sV0hWQIpARM)

---

## TailwindCSS와 HTMX 통합

`index.html` 파일에 TailwindCSS와 HTMX를 추가하여 페이지 스타일을 개선하고, HTMX를 사용할 준비를 합니다.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://cdn.tailwindcss.com"></script>
    <script
      src="https://unpkg.com/htmx.org@1.9.12"
      integrity="sha384-ujb1lZYygJmzgSwoxRggbCHcjc0rB2XoQrxeTUQyRjrOnlCoYta87iKBWq3EsdM2"
      crossorigin="anonymous"
    ></script>
    <title>Go + HTMX Todo App</title>
  </head>
  <body>
    <div class="flex flex-col p-4 justify-center space-y-5">
      <h1 class="font-bold text-2xl">Go + HTMX Todo App</h1>
      <div>
        <ul class="max-w-md space-y-1 text-gray-500 list-disc list-inside">
          {{ range .Todos }}
          <li>{{ .Title }} - {{ .Completed }}</li>
          {{ end }}
        </ul>
      </div>
    </div>
  </body>
</html>
```

이제 새로 서버를 실행하면 브라우저에서 아래와 같이 보입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiB7yQM9ZkkZ_1R-3Oj6NRNc0ca1yYo5C01g3fbKd9DQKNbz2wdY5YCN_YypEjShQBBRbenH_KWmbxgqKcELl3-YoZftt7FbnQ8W2R3FVf0xJ-5mpo6EGgyRsOV4KcQzmVgDnb1SPy79MV_hu_IjJaRWvu4p4ca0fz9WblIlotd8Xe8uZyWKVmOexPQABY)

그리고 template 문법의 range 문법이 제대로 되어 있는지 html 소스코드를 보면 아래와 같이 잘 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEi6BAaAjN5zqnoNASNExcHY-kcU6-zmt1E9fKEhcRBY8oRkB5XaJPCRWYTUTrxWV1pLS76pO4evPWklJ7GApToGzjr9ZxOU8euNikDjx_ofvWKs5tIggXtimZTtaZrWKGt3vQmhcSACKNC38RZgHkE9WTAzqpckXIYvdD2CgT1FghLrvvN_pP03yKtjkbw)

---

### Todo 폼 만들기

AddTodo를 위한 Todo 폼을 index.html 파일에 추가해 보겠습니다.

```html
<body>
    <div class="flex flex-col p-4 justify-center space-y-5">
      <h1 class="font-bold text-2xl">Go + HTMX Todo App</h1>
      <form class="flex flex-row space-x-4"
      hx-post="/add-todo/">
        <input
          type="text"
          name="title"
          id="title"
          class="bg-gray-50 border border-gray-300 text-gray-900 py-2"
          required
        />

        <button
          type="submit"
          class="text-white bg-blue-700 px-5 py-2 text-center"
        >
          Add Todo
        </button>
      </form>

      <div>
        <ul class="max-w-md space-y-1 text-gray-500 list-disc list-inside">
          {{ range .Todos }}
          <li>{{ .Title }} - {{ .Completed }}</li>
          {{ end }}
        </ul>
      </div>
    </div>
  </body>
```

form만 추가하고 스타일만 입혔습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEg14bjB7k6hHyVL-esHFjMJNYE9H9yeh_Q_rMSA-zV527AMOQamEzyPjL3DjUncdJug4XyGlYJ9gKZ-3AI-1xt2tGNC5Gw1fWg20qYnt9r-CfomNyfvMeboQB8PiE42ErKI4ooCnO7fi0lcQby0al7W8EO1GKN_NjlfuMv6t5QisWLx-V5vaeK8t8EX5b4)

아직 폼은 작동이 안 됩니다.

대신 HTMX를 이용하기 위해 form을 POST 리퀘스트 방식으로 submit하기 위해 hx-post라는 값을 주었습니다.

라우팅 주소는 "/add-todo/"입니다.

---

### Add Todo 폼 처리하기

이제 Golang에서 Add Todo 폼 데이터를 처리하도록 설정하겠습니다.

라우팅 주소가 "/add-todo/"였기 때문에 이 주소에 대한 핸들러를 작성해야 합니다.

```go
func main() {
	handler1 := func(w http.ResponseWriter, r *http.Request) {
		tmpl := template.Must(template.ParseFiles("index.html"))
		todos := map[string][]Todo{
			"Todos": {
				{Title: "Learn GoLang", Completed: false},
				{Title: "Learn Rust", Completed: false},
			},
		}
		tmpl.Execute(w, todos)
	}

	handler2 := func(w http.ResponseWriter, r *http.Request) {
		log.Print("HTMX request receieved")
		log.Print(r.Header.Get("HX-Request"))
	}
	http.HandleFunc("/", handler1)
	http.HandleFunc("/add-todo/", handler2)

	log.Fatal(http.ListenAndServe(":8000", nil))
}
```

위와 같이 handler2를 통해 '/add-todo/' 라우팅을 핸들링합니다.

handler2에서는 단순하게 log만 일단 넣었습니다.

테스트를 해 보겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhPb4Ff7-jOnY9Dk8f2olgIa4cufE-rcC_r2sAK3IY91zSqV97bG9EbfOMB_RLoXrHXaVhFobgpz2saMGUq11K0KVBC7ydUgCKk54v6f8S1dG78CbiIFAwBpU46pMsnEHSW74i_vskw5Vfqs3JHvC6FQQQ6QJHLZHREXkGM5lO2mPOPv1RdVZaQZM7I1_k)

Add Todo 버튼을 누르면 터미널 창에 아래와 같이 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhmSgyv0_hjKZOBLgULr6doiokiWoiOmsTzfjarktUOj5RRLVxXbrJDmZlYN95Nvxr8CmqY99awBTatuHfb2ettDLnA-YRwDZUyRvamyfh7aOsVt29Bh5x6H1zbKuwToI5Me-so2cjhlGl0UCCIOqNCxhF0-SHljN4LerSXA1muyRo3T9ySe4n1kgpKZK8)

서버가 제대로 작동하고 있습니다.

그리고 두 번째 로그가 true라는 뜻은 우리가 HTMX를 이용해서 "HX-Request"를 보냈다는 걸 뜻합니다.

이제, 본격적으로 Add Todo를 위해서 Todo 값을 Request에서 뽑아 내 보겠습니다.

handler2 함수를 아래와 같이 바꿉니다.

```go
handler2 := func(w http.ResponseWriter, r *http.Request) {
    title := r.PostFormValue("title")
    fmt.Println(title)
}
```

PostFormValue 함수를 이용해서 name이 "title"인 폼 값을 가져옵니다.

서버를 다시 돌리고 테스트해보면 아래와 같이 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgouCR4odohuhxPgSmk-hdgZAdxu2i_CXTSYrc2Ch8NbjsAD-c7ME-FbiKaQ2MLoo_xcf9s2kJoFD0PyhtO8Eff56PD7fDDjLne4uzMoPJ3ZM3u2wfjgFOzIuN9AKLSgHdIup8Ja2PFJxbDUbcwa1-k7HFFeaJg84ppeKkOnOX3ofR5VzpSWzQM7NyjrJk)

![](https://blogger.googleusercontent.com/img/a/AVvXsEhEK-IdTcsM8tpFcTtGHwThtqxnA0EvLqjBrp6ByoiaAxSwfzRYYXVO8Lbq6hwXSe3i9xDEeEBHG54DFypwcQ9DrR36ru0SwcXgQy_MHBQ-y0Oc87LO_nshp4i5c2HpwWCtmKvuS5YyubMrcrJF15I5YoPpRHwRHCz9PKTYWMjFMEvDEfiTL3XU8vO7NXo)


새로운 Todo 목록을 받아서 클라이언트에 반환하도록 설정합니다.

먼저, handler2 함수를 아래와 같이 바꿉니다.

```go
handler2 := func(w http.ResponseWriter, r *http.Request) {
    title := r.PostFormValue("title")
    htmlStr := fmt.Sprintf("<li>%s - false</li>", title)
    tmpl, _ := template.New("t").Parse(htmlStr)
    tmpl.Execute(w, nil)
}
```

handler2 함수를 설명해 보면 우리가 폼으로 받은 title 값을 htmlStr으로 만들었습니다.

실제 index.html에 li 태그 부분을 그대로 가져왔습니다.

그리고 template를 새로 만들고 그걸 다시 Execute합니다.

실행 결과를 보겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhYcLjtSZd4KcCR3aQk_GW3DV86ohvv_nNkvO3wnHyUNAaP1WBANQfI06eBXQRE7B6ipz8RSzsB2B-Wr6da-TZ8SV-PYGC7lMiNEz7aUe-H8BkqYT246yKfkD0N84eVlTeYGUfKMqbjtMT1nbuUaCFKusfJVfngN9aLB_1Ffsz87nmgFAK2M3QjTEWBhHg)

위와 같이 test라고 입력한 값이 form 이 있던 자리에 그대로 보여집니다.

우리가 의도한 거는 Todo List의 마지막으로 이동하는 게 목적인데, 뭔가 이상합니다.

이제 HTMX를 사용할 때가 온 겁니다.

---

## hx-target 사용

hx-post로 폼을 전송하고 받은 응답(Response)를 원하는 곳에 넣어주는 HTMX의 attribute가 바로 hx-target입니다.

아래 코드를 보시면 form에 hx-target을 "#todo-list"라고 줬습니다.

그러면 ul 태그를 보시면 id가 "todo-list"라고 세팅된 걸 확인할 수 있습니다.

즉, hx-post로 받은 응답을 ul 태그 쪽으로 hx-target 한다는 뜻입니다.

```html
<body>
<div class="flex flex-col p-4 justify-center space-y-5">
    <h1 class="font-bold text-2xl">Go + HTMX Todo App</h1>
    <form class="flex flex-row space-x-4"
    hx-post="/add-todo/" hx-target="#todo-list">
    <input
        type="text"
        name="title"
        id="title"
        class="bg-gray-50 border border-gray-300 text-gray-900 py-2"
        required
    />

    <button
        type="submit"
        class="text-white bg-blue-700 px-5 py-2 text-center"
    >
        Add Todo
    </button>
    </form>

    <div>
    <ul class="max-w-md space-y-1 text-gray-500 list-disc list-inside" id="todo-list">
        {{ range .Todos }}
        <li>{{ .Title }} - {{ .Completed }}</li>
        {{ end }}
    </ul>
    </div>
</div>
</body>
```

이제 서버를 새로 돌리고 테스트해 봅시다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEj4yk3pxmqG5BnKbvwdXrcJnc2ThGVgFXEjR6s81fSy_LB19kcDZo40ZfiyZJTaXCEEiFidh8p4qFNicZ27JkAEJMJkrwJgPhVqyLZlO5ASvSahJWoxao_Wq5K7SOA__--jsittMx6Oj8lhjuX7cBAxyiPTiCfjRrpT5xg5XYMzR39wurul2ap3i8lDSgA)

위 그림과 같이 hx-target은 완벽하게 작동하는데, 문제가 기존에 있던 Todo 리스트가 아예 사라졌습니다.

디폴트 값으로 `hx-swap="innerHTML"`값으로 작동하기 때문입니다.

hx-swap 값을 "beforeend"로 바꿉니다.

```html
<form class="flex flex-row space-x-4"
hx-post="/add-todo/" hx-target="#todo-list" hx-swap="beforeend">
```

hx-swap 설명은 공식 페이지를 참조하시면 됩니다.

이제 테스트 다시 해 보겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgVzujUhtf_Rpdcaitm7nDOdufBXKk4idR-gmo1xmNx31Te3uIk5EBpxfqSZk3bJGLvhA-QWROecNZHVn8dh-CsokDfK3Oe6LwlmUCXUZJju5BYUv_tjB8ae-zPzKrIsb9yj14MbGFoeBaBPF_HG1-U3lhk7ZqOwq9EX5UTiXOD4Bu9qKUL1m_qmHe-swU)

위와 같이 ul 태그의 beforeend 즉, ul 태그가 끝나기 전인 곳으로 추가한다는 뜻 대로 제대로 작동합니다.

---

## hx-indicator 사용해 보기

hx-indicator는 폼 전송 버튼을 눌렀을 때 서버에서 응답이 올 때 가지 브라우저에 로딩 스피너를 보여주기 위한 HTMX의 attribute인데요.

html 코드를 조금 손 보겠습니다.

```html
<form
class="flex flex-row space-x-4"
hx-post="/add-todo/"
hx-target="#todo-list"
hx-swap="beforeend"
hx-indicator="#spinner"
>
<input
    type="text"
    name="title"
    id="title"
    class="bg-gray-50 border border-gray-300 text-gray-900 py-2"
    required
/>

<button
    type="submit"
    class="text-white bg-blue-700 px-5 py-2 text-center"
>
    <span id="spinner" class="text-yellow htmx-indicator">Loading</span>
    Add Todo
</button>
</form>
```

수정한 곳은 form 쪽에 hx-indicator를 넣었고 button 쪽에 span 태그를 넣었습니다.

잘 보시면 span 쪽 CSS 클래스에 htmx-indicator 값이 있는데, HTMX가 이 클래스 값을 제어합니다.

htmx-indicator 클래스의 기본값은 opacity가 0이라서 화면에 안 보이는데요.

HTMX의 hx-indicator attribute는 폼이 전송되고 나서 응답을 받을 동안 htmx-indicator 클래스의 값을 opacity 100으로 바꿉니다.

그래서 화면에 스피너를 보여주는 원리입니다.

참고로 hx-indicator attribute와 CSS 클래스인 "htmx-indicator"를 헷갈리시면 안 됩니다.

테스트를 위해 조금 응답을 느리게 리턴하기 위해 Go 코드를 수정하겠습니다.

```go
handler2 := func(w http.ResponseWriter, r *http.Request) {
    time.Sleep(2 * time.Second)
    title := r.PostFormValue("title")
    htmlStr := fmt.Sprintf("<li>%s - false</li>", title)
    tmpl, _ := template.New("t").Parse(htmlStr)
    tmpl.Execute(w, nil)
}
```

handler2 함수에 time.Sleep를 추가했습니다.

이제 2초간 지연됩니다.

이제 테스트를 해보면 아래 그림과 같습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgQf1BpEcjx5YgNgvxHWPc5hre_yN2fKhghOcz8UHZ8_bQsROOGiEe63YzDHEZ-qhbkTNAvbcjgg95M_4fnsgsJ4u0CT_6WM5H0PeXQVr-hU37sMDIod2z48hl8GLvqZO2fjTikiJqWUWgmtZjwuS5WyW60Hqx2K15c3BnzDS8Unsr5-ruP4r1ACKoY0a0)

![](https://blogger.googleusercontent.com/img/a/AVvXsEgl8AbiDgDcetDyslbeokRpGDeLXhgX9ByA-Mb2D-uKksvMibJTJZLWRjiexEPG-onVa3DbEmYvP4D7tQo3CoLRI3nUa7-Ns9qhvJvfddn4kWCWWiIt8n6IgYy8ot-Fq5HISCRKODcjR9LOXguteHpvQXKxi9blfpVQ10eysaQ45YBLOh2WIgLS6QWNAt0)

"Loading"이란 문구가 잘 보입니다.

---

## Template Fragments

기존 Go 코드를 보면 handler2 함수에 htmlStr 이라고 li 태그를 하드코딩해서 사용했는데, 상당히 보기 싫습니다.

Template Fragment를 이용하면 아주 쉽게 처리할 수 있습니다.

먼저, html 코드를 아래와 같이 바꿉니다.

```html
{{ range .Todos }}
    {{ block "todo-list-element" .}}
        <li>{{ .Title }} - {{ .Completed }}</li>
    {{ end }}
{{ end }}
```

template range 블록 다음에 임의의 블록을 선언했습니다.

그 블록 이름은 "todo-list-element"입니다.

이제 다시 Go 코드로 넘어가서 이 블로 이름을 사용하면 됩니다.

handler2 함수에서 하드코딩한 htmlStr은 지우겠습니다.

```go
handler2 := func(w http.ResponseWriter, r *http.Request) {
    time.Sleep(2 * time.Second)
    title := r.PostFormValue("title")
    tmpl := template.Must(template.ParseFiles("index.html"))
    tmpl.ExecuteTemplate(w, "todo-list-element", Todo{Title: title, Completed: false})
}
```

위와 같이 template의 ExecuteTemplate 함수를 사용했습니다.

위와 같이 Template Fragment를 사용하면 좀 더 코드를 예쁘게 작성할 수 있습니다.

참고로 Todo 앱의 Completed 값은 처리하지 않았는데, 이 부분은 여러분들이 직접 처리해 보시면서 Golang + HTMX 조합을 좀 더 공부하시기 바랍니다.

그럼.

