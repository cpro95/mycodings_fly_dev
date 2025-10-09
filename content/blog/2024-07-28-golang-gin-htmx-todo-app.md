---
slug: 2024-07-28-golang-gin-htmx-todo-app
title: Golang의 Gin과 HTMX를 이용해서 Todo 웹 앱 만들기
date: 2024-07-28 07:06:53.338000+00:00
summary: Golang의 Gin과 HTMX를 이용해서 Todo 웹 앱 만들기
tags: ["golang", "go", "htmx"]
contributors: []
draft: false
---

안녕하세요?

웹 앱을 만드는 것이 요즘엔 꽤나 좌절스럽고 압도적으로 느껴질 수 있습니다.

수많은 프론트엔드 프레임워크, 다양한 아키텍처, 그리고 여러 가지 렌더링 전략 중에서 선택해야 하기 때문이죠.

웹 개발은 게임 개발 만큼 복잡하지도 않고 임베디드 시스템 만큼 민감하지도 않지만, 웹 개발자들은 쓸모없는 복잡성을 통해 자신들의 직업 안정성을 만들어야 합니다.

하지만 여러분이 알아두셔야 할 것은, 수많은 옵션들에 압도당하고 있을 때에도, 최첨단의 성능 좋은 애플리케이션을 쉽게 만들기 위해 이해하고 적용해야 할 몇 가지 개념만 있으면 된다는 점입니다.

이제 이 개념들을 실제로 적용해 보면서 기본적인 웹 앱을 만들어 봅시다.

사실, 웹 앱 개발은 정말 간단합니다.

웹 서버가 들어오는 HTTP 요청을 듣고, 비즈니스 로직을 수행하고, 데이터를 저장소에 저장하고, HTML 응답을 렌더링한 후 브라우저에 돌려주기만 하면 됩니다.

브라우저는 그 HTML을 해석하고 표시합니다.

HTML 표준은 링크와 폼을 통해 사용자들이 웹 페이지와 상호작용할 수 있도록 합니다.

링크를 클릭하거나 폼을 제출할 때마다 서버로 또 다른 HTTP 요청이 보내지고, 우리는 같은 과정을 다시 거칩니다.

HTML 응답이 돌아오면, 브라우저는 그것을 해석하고 기존 페이지를 새로운 페이지로 대체합니다.

우리는 이것을 멀티 페이지 애플리케이션 아키텍처(MPA)라고 부릅니다.

대안으로는 싱글 페이지 애플리케이션(SPA) 아키텍처가 있습니다.

이 경우 HTML은 보통 클라이언트에서 JavaScript 파일과 서버에서 보내는 JSON 데이터로 렌더링됩니다.

이 접근 방식은 몇 가지 이점이 있지만, 훨씬 더 많은 복잡성을 수반합니다.

게다가 최근 몇 년간 성능 문제로 인해 멀티 페이지 애플리케이션과 서버 사이드 렌더링에 집중이 이동하게 되었습니다.

---

브라우저에서 HTML을 통해 사용자들이 링크와 폼을 통해 상호작용할 수 있다고 언급했지만, 이러한 요소들은 전체 페이지 새로 고침을 유발합니다.

이는 잠재 고객들이 기대하는 사용자 경험이 아닙니다.

현대 웹 앱은 비동기 방식으로 서버 작업을 수행할 수 있으며, 응답을 받으면 전체 페이지를 새로 고침하지 않고 페이지의 일부만 업데이트합니다.

물론, 이는 JavaScript 라이브러리를 통해 이루어집니다.

React, Angular, Vue가 가장 인기 있는 옵션이지만, 이러한 프레임워크들은 싱글 페이지 애플리케이션을 만드는 데 더 적합합니다.

우리의 경우, 멀티 페이지 앱을 만들기 때문에 Alpine, Petite Vue 또는 HTMX 같은 옵션이 더 적합합니다.

스택을 결정할 때 염두에 두어야 할 몇 가지 아이디어가 있습니다.

첫째, 성능은 웹을 구축할 때 중요한 요소입니다.

이는 서버와 클라이언트 모두에 해당합니다.

백엔드 서비스는 빠른 응답을 반환하면서 쉽게 배포되고 확장 가능해야 합니다.

반면 클라이언트는 효율적인 네트워크 통신에 의존하면서 사용자에게 의미 있는 콘텐츠를 빠르게 표시해야 합니다.

사용자가 나쁜 인터넷 연결이나 모바일 데이터를 사용할 수 있으므로 불필요한 데이터를 전송하지 않도록 해야 합니다.

둘째, 도구의 인기도와 채택도 매우 중요합니다.

스택에 커밋할 때는 장기적인 관점을 가져야 하므로, 10년 후에도 여전히 사용될 가능성이 높은 프레임워크와 라이브러리를 선택하려고 노력해야 합니다.

널리 채택된 도구는 보통 좋은 커뮤니티 지원, 빈번한 릴리즈, 그리고 풍부한 3rd 파티 라이브러리를 의미합니다.

그래서 이번에는 서버에 Golang과 Gin을, 클라이언트에는 HTMX를 사용해 볼 것입니다.

이 결정을 내린 이유는 간단합니다.

Go는 GitHub에서 가장 빠르게 성장하는 언어 중 하나이며, 단순성과 성능의 완벽한 조합입니다.

게다가 Go 프로그램은 단일 바이너리 실행 파일로 빌드되기 때문에 배포 과정에서 큰 도움이 됩니다.

Go는 매우 강력한 표준 라이브러리를 제공하며, 이는 웹 서버라이브러리의 기본을 다룹니다.

그러나 편의성을 위해 Gin을 추가할 것입니다.

먼저 로컬에 Go를 설치합니다.

이미 설치되어 있다면, 새로운 프로젝트를 초기화하고 Gin 의존성을 추가합니다.

```sh
go mod init go-htmx-stack
go get -u github.com/gin-gonic/gin
```

웹 서버를 구성해 보겠습니다.

```go
package main

import (
    "github.com/gin-gonic/gin"
)

func main() {
    e := gin.Default()

    e.GET("/", func(c *gin.Context) {
        c.JSON(200, gin.H{
            "name": "World",
        })
    })

    e.Run(":8080")
}
```

Gin을 가져오면, 엔진 인스턴스를 생성하고 루트 경로에 GET 리스너를 등록할 수 있습니다.

클라이언트에서 요청이 들어오면, 이 메서드 내의 코드가 실행되어 클라이언트에 어떤 형태의 응답을 보냅니다.

핸들러는 현재 HTTP 요청의 컨텍스트를 인수로 받는 익명 함수입니다.

이는 성능상의 이유로 포인터로 전달됩니다.

컨텍스트는 큰 구조체일 수 있으며, 값을 통해 전달하면 전체 엔터티가 스택에 복사되어야 합니다.

이는 시간과 메모리 측면에서 비용이 많이 듭니다.

포인터를 통해 전달하면 구조체의 주소만 복사되므로, 이는 크기가 작은 고정 크기의 데이터입니다.

그런 다음, 응답 콘텐츠 타입을 JSON으로 설정하고 본문에 데이터를 제공합니다.

마지막으로, HTTP 서버를 시작하고 8080 포트에서 들어오는 요청을 듣도록 설정합니다.

이제 브라우저에서 결과를 확인할 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjcfB5WmEAvxutj0ou8IaFGzPvQuf9xM991LtYf0EU6e6_R_7zYOJwUFYZ_T5OBwZOYXz2TRIiBL1WOLnHIg6vmr6WPA7x3GCOAgl_-jqBMgheD5_XtB9cEb6QOrRXWZd2bV85L9Xrc5-QF0XUusbPOrK1U1pGRX0taBW_Hazjy4qr1bA7-LtmrENXFOJU)

하지만 이 글의 시작 부분에서 언급했듯이 멀티 페이지 애플리케이션 아키텍처에서는 브라우저가 JSON 대신 HTML을 받아야 합니다.

그래서 그 작업을 해보겠습니다.

templates 디렉토리 아래에 새로운 index.html 파일을 추가하고, 간단한 헤더를 넣습니다.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Go-HTMX</title>
</head>
<body>
    <h1>Hello, {{ .name }}!</h1>
</body>
</html>
```

다시 main.go 파일로 돌아가서 먼저 Gin 엔진에 templates 디렉토리를 등록한 다음, GET 핸들러를 업데이트하여 HTML을 반환하도록 합니다.

Go 컨텍스트에서 HTML 템플릿으로 속성을 쉽게 전달할 수 있습니다.

```go
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	e := gin.Default()
	e.LoadHTMLGlob("templates/*")

	e.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", gin.H{
			"name": "World",
		})
	})

	e.Run(":8080")
}
```

물론 실제 시나리오에서는 사용자가 다양한 작업을 수행하므로, POST, PUT 및 DELETE 요청도 처리해야 합니다. 

이를 위해 데이터 저장 솔루션에 대해 간단히 다뤄보겠습니다.

---

- Storing Data

데이터베이스 옵션은 정말 다양하지만, 여기서도 간단하게 SQLite를 Go 프로젝트에 추가해 보겠습니다.

```sh
go get -u gorm.io/driver/sqlite
```

그런 다음, 모든 데이터베이스 로직과 상호작용을 포함할 `service.go` 파일을 생성합니다.

```go
package main

import (
	"database/sql"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

type ToDo struct {
	Id     int    `json:"id"`
	Title  string `json:"title"`
	Status string `json:"status"`
}

var DB *sql.DB
```

Go에서는 구조체를 사용하여 시스템에서 할 일 항목을 표현할 수 있습니다.

필드는 대문자로 시작하여 내보내지고 패키지 외부에서 접근할 수 있음을 나타내며, json 태그를 사용하여 네트워크를 통해 데이터를 보낼 때 엔터티를 JSON으로 변환하는 데 사용할 메타데이터를 제공합니다.

그런 다음, 데이터베이스를 열고 todos 테이블을 생성하는 InitDatabase 함수를 정의합니다. 

```go
func InitDatabase() {
	var err error
	DB, err = sql.Open("sqlite3", "./test.db")
	if err != nil {
		log.Fatal(err)
	}

	_, err = DB.Exec(`
	CREATE TABLE IF NOT EXISTS todos (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		title TEXT,
		status TEXT
	);
	`)

	if err != nil {
		log.Fatal(err)
	}
}
```

그리고 Create 및 Delete 메서드를 추가할 수 있으며, 여기에는 몇 가지 주의할 점이 있습니다.

```go
func CreateToDo(title string, status string) (int64, error) {
	result, err := DB.Exec("INSERT INTO todos (title, status) VALUES (?, ?)", title, status)
	if err != nil {
		return 0, err
	}
	id, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}
	return id, nil
}

func DeleteTodo(id int64) error {
	_, err := DB.Exec("DELETE FROM todos WHERE id = ?", id)
	return err
}
```
첫째, Go에서는 동일한 함수에서 여러 값을 반환할 수 있습니다.

둘째, Go 오류는 값으로 처리됩니다.

이는 다른 언어보다 오류 처리가 다소 장황해질 수 있지만, 예외에 대해 적극적으로 생각하고 더 신뢰할 수 있는 제품을 만들도록 강요합니다.

마지막으로, 선언된 변수가 사용되지 않으면 컴파일러가 불평하므로, 이러한 값을 무시하려면 빈 식별자를 사용할 수 있습니다.

ReadToDoList 메서드는 쿼리 응답을 구조체로 변환해야 하므로 좀 더 복잡합니다.

```go
func ReadToDoList() []ToDo {
	rows, _ := DB.Query("SELECT id, title, status FROM todos")
	defer rows.Close()

	todos := make([]ToDo, 0)
	for rows.Next() {
		var todo ToDo
		rows.Scan(&todo.Id, &todo.Title, &todo.Status)
		todos = append(todos, todo)
	}
	return todos
}
```

make 키워드를 사용하여 슬라이스를 초기화하고, append를 사용하여 기존 컬렉션에 새로운 todos를 추가합니다.

main.go
```go
package main

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func main() {
	InitDatabase()
	defer DB.Close()

	e := gin.Default()
	e.LoadHTMLGlob("templates/*")

	e.GET("/", func(c *gin.Context) {
		todos := ReadToDoList()
		c.HTML(http.StatusOK, "index.html", gin.H{
			"todos": todos,
		})
	})

	e.POST("/todos", func(c *gin.Context) {
		title := c.PostForm("title")
		status := c.PostForm("status")
		id, _ := CreateToDo(title, status)

		c.HTML(http.StatusOK, "task.html", gin.H{
			"title":  title,
			"status": status,
			"id":     id,
		})
	})

	e.DELETE("/todos/:id", func(c *gin.Context) {
		param := c.Param("id")
		id, _ := strconv.ParseInt(param, 10, 64)
		DeleteTodo(id)

		c.Status(http.StatusOK)
	})

	e.Run(":8080")
}
```
main.go 파일로 돌아가서 먼저 데이터베이스를 초기화한 다음, 데이터베이스 연결을 닫는 작업을 지연시킵니다.

연결을 닫는 것은 매우 중요하며, defer 키워드를 사용하면 main() 함수가 실행을 마치면 이 작업이 수행됩니다.

그런 다음 GET 핸들러를 업데이트하여 모든 todo 엔터티를 포함하는 HTML 페이지를 렌더링하고 반환하도록 하며, POST 및 DELETE 요청을 처리하는 핸들러를 정의하여 이전에 정의한 데이터베이스 메서드를 호출합니다.

이 모든 템플릿은 templates 디렉토리에 정의되어 있으며, 이제 index.html로 이동하여 클라이언트 상호작용을 추가합니다.

---

HTML 표준은 링크와 폼을 통해 서버와 동기적으로 상호작용할 수 있습니다.

예를 들어, 저장 버튼이 클릭될 때마다 POST 요청을 todos 엔드포인트로 보내는 간단한 폼을 정의할 수 있습니다. 

그러나 이는 전체 페이지 새로 고침을 수행하게 되는데, 이는 우리가 할 수 있는 최선의 방법이 아닙니다.

여기서 HTMX가 등장합니다.

HTMX의 매력은 작은 라이브러리로, HTML 마크업을 통해 JavaScript 상호작용을 직접 추가할 수 있다는 점입니다. 

다음 HTML 예제를 살펴보세요.

```html
<form
    hx-post="/todos"
    hx-target="#tasks"
    hx-swap="beforeend">
        <input name="title" />
        <input name="status" />
        <button>Save</button>
</form>
```


우리의 예제에서는, 동기적인 폼 POST 요청을 비동기 AJAX 기반 요청으로 쉽게 변환할 수 있습니다.

먼저 HTMX 스크립트를 페이지 헤더에 추가합니다.

그런 다음, action 및 method 속성을 hx-post 특별 속성으로 교체합니다.

이제 AJAX 호출이 디스패치되며, 우리는 응답으로 새로운 작업을 표시하는 HTML 조각을 기대합니다.

응답이 도착하면 이를 tasks 리스트에 추가합니다.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Go-HTMX</title>
    <script
      src="https://unpkg.com/htmx.org@2.0.1"
      integrity="sha384-QWGpdj554B4ETpJJC9z+ZHJcA/i59TyjxEPXiiUgN2WmTyV5OEZWCD6gQhgkdpB/"
      crossorigin="anonymous"
    ></script>
  </head>
  <body>
    <h1>Tasks</h1>
    <ul id="tasks">
      {{range .todos}}
      <li>
        {{.Title}} - {{.Status}}
        <button hx-delete="/todos/{{.Id}}">Delete</button>
      </li>
      {{else}}
      <li>No tasks found.</li>
      {{end}}
    </ul>
    <form hx-post="/todos" hx-target="#tasks" hx-swap="beforeend">
      <input name="title" />
      <input name="status" />
      <button>Save</button>
    </form>
  </body>
</html>
```

HTMX에서 가장 많이 사용되는 게 바로 'hx-get', 'hx-post'인데요.

위 코드에서 보시면 'hx-post'를 이용해서 form을 POST 하고 있습니다.

그러면 main.go 파일에서 아래 부분이 해당 form의 POST 부분을 처리하게 됩니다.

```go
e.POST("/todos", func(c *gin.Context) {
    title := c.PostForm("title")
    status := c.PostForm("status")
    id, _ := CreateToDo(title, status)

    c.HTML(http.StatusOK, "task.html", gin.H{
        "title":  title,
        "status": status,
        "id":     id,
    })
})
```

Gin은 Context의 PostForm 메서드를 제공해 줘서 쉽게 title, status 값을 얻을 수 있습니다.

참고로, HTML의 formData는 모두 string인걸 꼭 기억하시기 바랍니다.

위 Golang 코드를 보시면 c.HTML 메서드를 이용해서 task.html 파일에 해당 값을 넣어주고 task.html 파일만 리턴하게 됩니다.

task.html 파일을 볼까요?

```html
<li>
  {{.title}} - {{.status}}
  <button hx-delete="/todos/{{.Id}}">Delete</button>
</li>
```

위와 같이 하나의 `<li>` 태그를 리턴해 줍니다.

하나의 `<li>` 태그가 리턴되는데, 아까 index.html 파일에서 form 태그를 다시 살펴보면

```html
<form hx-post="/todos" hx-target="#tasks" hx-swap="beforeend">
    <input name="title" />
    <input name="status" />
    <button>Save</button>
</form>
```

위와 같이 hx-target 값이 "#tasks" 입니다.

즉, hx-post로 POST 요청을 하고 그 리턴된 값을 hx-target으로 지정한 "#tasks" 부분으로 넘기라는 뜻입니다.

그런데, hx-swap 부분으로 인해 "beforeend" 값 때문에 마지막에 추가하게 되는거죠.

"#tasks" 는 `<ul>` 태그입니다.

즉, "beforeend"는 `<ul>` 태그 안의 자식 태그 마지막에 넣으라는 뜻입니다.

그래서 새로운 `<li>`태그가 추가되게 됩니다.

같은 방식으로, 클릭 시 DELETE HTTP 요청을 트리거하는 삭제 버튼을 추가할 수 있습니다.

index.html 파일의 Delete 부분의 button 태그를 아래와 같이 바꿉시다.

```html
<button hx-delete="/todos/{{.Id}}">Delete</button>
```

hx-delete는 DELETE 메서드로 HTML 리퀘스트하라는 명령어입니다.

이렇게 버튼을 누르면 main.go 파일의 아래 코드가 작동하는 겁니다.

```go
e.DELETE("/todos/:id", func(c *gin.Context) {
    param := c.Param("id")
    id, _ := strconv.ParseInt(param, 10, 64)
    DeleteTodo(id)
    // Respond with a 200 status and an empty body
    c.Status(http.StatusOK)
})
```

id에 해당되는 todo를 삭제하고 빈 문자열을 리턴해 주는거죠.

`c.Status(http.StatusOK)`는 사실 `c.Status(http.StatusOK, "")`의 줄임코드입니다.

---

## UI 부분 고치기

이제 코드가 완성되었는데, UI 부분에서 몇몇 문제가 보입니다.

먼저, 새로운 Todo를 "Save" 버튼으로 누르면 form에 입력된 기존값이 그대로 남아 있습니다.

자바스크립트로 치면 form.reset() 명령어 같은게 있어야 하는데요.

이건 HTMX 로간단하게 구현할 수 있습니다.

```html
<form
    hx-post="/todos"
    hx-target="#tasks"
    hx-swap="beforeend"
    hx-on:htmx:after-request="this.reset()"
>
    <input name="title" />
    <input name="status" />
    <button type="submit">Save</button>
</form>
```

위와 같이 hx-on을 사용하면 됩니다.

hx-on은 onRequest 같은건데요.

즉, htmx의 request가 after 됐을 때 실행하라는 뜻입니다.

즉, htmx의 request는 hx-post의 POST 리퀘스트를 뜻합니다.

그러면 "this.reset()" 이라는 자바스크립트 명령어가 실행되죠.

여기서 this는 form 태그입니다.

`hx-on::after-request`라고 htmx를 줄여 쓸 수 있고, 만약 JSX에서 사용하려면 아래와 같이 쓸 수 도 있습니다.

`hx-on-htmx-after-request` 또는 `hx-on--after-request`로 쓸 수 있습니다.

두 번째로 UI 부분을 고칠게 Delete 부분이 제대로 작동하지 않는데요.

아래와 같이 고쳐야 합니다.

먼저, index.html 파일에서 아래와 같이 고칩시다.

```html
<button
    hx-delete="/todos/{{.Id}}"
    hx-swap="delete"
    hx-target="closest li"
    >
    Delete
    </button>
</li>
```

hx-swap을 "delete"로 주면 hx-delete 가 실행될 때 그냥 삭제됩니다.

그리고 hx-target을 "closest li"라고 가장 가까운 li 태그를 지우라고 지정한겁니다.

이 코드는 task.html 파일에도 똑같이 넣어야 합니다.

```html
<li>
  {{.title}} - {{.status}}
  <button hx-delete="/todos/{{.id}}" hx-swap="delete" hx-target="closest li">Delete</button>
</li>
```

세 번째, `No tasks found.` 글자가 그대로 나오는데요.

이 부분은 hx-swap-oob을 사용하면 됩니다.

`hx-swap-oob="true"`는 HTMX의 "Out of Band Swap" 기능을 활성화하는 속성입니다.

이 속성의 의미와 작동 방식은 다음과 같습니다.

1. OOB의 의미:
   "Out of Band"는 주요 요청/응답 흐름 외부에서 발생하는 작업을 의미합니다.

2. 작동 방식:
   - 일반적으로 HTMX는 `hx-target`으로 지정된 요소 내부에 서버 응답을 삽입합니다.
   - `hx-swap-oob="true"`가 있는 요소는 이 일반적인 흐름에서 벗어나 처리됩니다.
   - HTMX는 이 요소의 ID와 일치하는 ID를 가진 페이지의 기존 요소를 찾아 교체합니다.

3. 사용 목적:
   - 주 타겟 외의 페이지 다른 부분을 동시에 업데이트할 때 유용합니다.
   - 여러 요소를 한 번의 요청으로 업데이트할 수 있어 효율적입니다.

4. 예시:
   ```html
   <div id="message" hx-swap-oob="true">새로운 메시지</div>
   ```
   이 응답이 오면, HTMX는 페이지에서 `id="message"`인 요소를 찾아 이 새로운 내용으로 교체합니다.

5. 우리의 사용 사례:
   - "No tasks found" 메시지를 제거하기 위해 사용됩니다.
   - 빈 `<div id="no-tasks">`를 반환함으로써, 기존의 "No tasks found" 메시지를 효과적으로 제거합니다.

이 기능을 사용하면, 주 응답 내용(새 태스크)을 처리하면서 동시에 페이지의 다른 부분("No tasks found" 메시지)을 업데이트할 수 있어, 복잡한 JavaScript 없이도 동적인 페이지 업데이트가 가능해집니다.

그래서 index.html 파일의 "No tasks found" 부분에 id를 아래와 같이 추가하면 됩니다.

```html
{{else}}
<li id="no-tasks">No tasks found.</li>
{{end}}
```

그리고 task.html 파일도 아래와 같이 바꾸면 됩니다.

```html
<li>
  {{.title}} - {{.status}}
  <button hx-delete="/todos/{{.id}}" hx-swap="delete" hx-target="closest li">Delete</button>
  <div id="no-tasks" hx-swap-oob="true"></div>
</li>
```

이제 Golang + HTMX를 이용한 Todo 앱이 완성되었습니다.

그럼.
