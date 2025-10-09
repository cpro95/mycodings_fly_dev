---
slug: 2024-05-18-go-templates-complete-guide
title: Go 템플릿 완벽 가이드 - 문법과 내부 동작
date: 2024-05-18 06:48:39.812000+00:00
summary: Go 템플릿을 사용을 위한 가이드
tags: ["go", "golang", "go template", "golang template", "template"]
contributors: []
draft: false
---

** 목 차 **
- [Go 템플릿 완벽 가이드 - 문법과 내부 동작](#go-템플릿-완벽-가이드---문법과-내부-동작)
  - [템플릿 문법 기본](#템플릿-문법-기본)
    - [템플릿 호출](#템플릿-호출)
    - [템플릿 컨텍스트](#템플릿-컨텍스트)
    - [주석](#주석)
    - [조건 연산자](#조건-연산자)
    - [반복문](#반복문)
    - [with](#with)
    - [템플릿 정의](#템플릿-정의)
    - [맵 요소, 구조체 필드, 메서드 호출](#맵-요소-구조체-필드-메서드-호출)
    - [표준 함수](#표준-함수)
    - [사용자 정의 함수](#사용자-정의-함수)
  - [내부 동작](#내부-동작)


Go 언어의 `text/template`, `html/template` 패키지는 Go 표준 라이브러리의 일부입니다.

Go 템플릿은 도커, 쿠버네티스, 헬름 같은 많은 Go로 작성된 소프트웨어에서 사용됩니다.

또한 Echo와 같은 많은 서드 파티 라이브러리가 Go 템플릿과 통합되어 있습니다.

Go 템플릿 문법을 아는 것은 꽤 유용합니다.

이 글은 `text/template` 패키지 문서와 저자의 몇 가지 솔루션으로 구성되어 있습니다.

Go 템플릿 문법을 설명한 후 `text/template`와 `html/template` 소스 코드로 들어가 보겠습니다.

Go 템플릿은 활성 템플릿으로, `if`, `else`, `range` 등의 제어 흐름을 사용할 수 있습니다.

Go는 엄격한 타입 언어지만, 템플릿은 모든 데이터 타입과 함께 동작합니다.

이는 `reflect` 패키지 덕분입니다.

## 템플릿 문법 기본

### 템플릿 호출

모든 템플릿 명령어는 `{{`와 `}}` 사이에 설정됩니다.

이 외의 텍스트는 단순히 출력으로 인쇄되는 일반 텍스트입니다.

### 템플릿 컨텍스트

템플릿을 실행하기 위해 `Execute`와 `ExecuteTemplate` 함수가 있습니다.

두 함수 모두 `data`라는 인터페이스 파라미터를 가집니다.

```go
Execute(wr io.Writer, data interface{}) error
ExecuteTemplate(wr io.Writer, name string, data interface{}) error
```

`data` 파라미터는 기본 템플릿 데이터입니다. 템플릿에서는 이를 `.`으로 접근할 수 있습니다.

다음 코드는 기본 데이터를 출력합니다:

```go
{{ . }}
```

기본 데이터를 현재 템플릿 컨텍스트라고 부르겠습니다.

일부 템플릿 명령어는 템플릿 컨텍스트를 변경할 수 있습니다.

다음으로 Go 템플릿의 문법 구성 요소를 살펴보겠습니다.

### 주석
```go
{{/* comment */}}
```

### 조건 연산자
```go
{{if condition}} T1 {{end}}
```
`condition`이 0, "", nil 또는 빈 배열/슬라이스인 경우, 조건은 `false`로 처리되어 `T1`은 실행되지 않습니다.

그렇지 않으면 `T1`이 실행됩니다.

`else`, `else if`와 함께 사용하는 변형:

```go
{{if condition}} T1 {{else}} T0 {{end}}
{{if condition1}} T1 {{else if condition2}} T0 {{end}}
```

### 반복문

배열, 슬라이스, 맵 또는 채널을 반복할 수 있습니다.

다음 코드에서 `T1` 명령어는 각 반복마다 실행됩니다:

```go
{{range pipeline}} T1 {{end}}
{{range pipeline}} T1 {{else}} T2 {{end}}
```
각 반복에 대한 키/값 변수도 얻을 수 있습니다:

```go
{{range $key, $value := pipeline}} 
{{ $key }}: {{ $value }}
{{end}}
```

### with
```go
{{with pipeline}} T1 {{end}}
```
`pipeline`이 `true`와 같다면(`if` 설명에서처럼), `T1`이 실행되고 현재 템플릿 컨텍스트는 `pipeline`으로 설정됩니다.

### 템플릿 정의

다음 명령어 중 하나를 사용하여 템플릿을 생성할 수 있습니다:

```go
{{block "name" pipeline}} T1 {{end}}
{{define "name" pipeline}} T1 {{end}}
```
템플릿을 실행하려면:

```go
{{template "name" pipeline}}
```

### 맵 요소, 구조체 필드, 메서드 호출

Go 템플릿은 데이터를 출력할 수 있습니다. 예를 들어, 구조체 필드나 맵 값을 출력할 수 있습니다.

템플릿에서 사용되는 구조체 필드는 대문자로 시작하는 내보낸 필드여야 합니다. 맵 키는 소문자로 시작할 수 있습니다.

모든 것은 체인으로 연결할 수 있습니다:

```go
.Field1.Field2.key1
.key1.key2
```

템플릿에서 메서드 호출도 사용할 수 있습니다. 템플릿 메서드는 하나의 값 또는 두 개의 값을 반환해야 하며, 마지막 값은 에러여야 합니다.

Go 코드:

```go
type myType struct{}
func(m *myType) Method() string {
        return "123"
}
```

템플릿 코드:

```go
.Method()
```

### 표준 함수

Go 템플릿에는 두 가지 유형의 함수가 있습니다 — 내장 함수와 사용자 정의 함수.

모든 함수 호출 문법은 다음과 같습니다:

```go
funcname arg1 arg2 arg3
```

표준 함수 목록:

- `call funcLocation arg1 arg2`: 인수를 사용하여 함수를 호출하는 함수
- `index x 1 2 3`: 슬라이스/배열/맵 요소를 얻는 함수
- `slice x 1 2`: 슬라이스/배열을 슬라이싱하는 함수 — `s[1:2]`
- `len x`: 슬라이스/배열/맵의 길이를 얻는 함수
- `print`, `printf`, `println`: 데이터를 명시적으로 출력하는 함수

부울 연산자도 함수로 작동합니다:

- `eq arg1 arg2`: `arg1 == arg2`
- `ne arg1 arg2`: `arg1 != arg2`
- `lt arg1 arg2`: `arg1 < arg2`
- `le arg1 arg2`: `arg1 <= arg2`
- `gt arg1 arg2`: `arg1 > arg2`
- `ge arg1 arg2`: `arg1 >= arg2`

값은 `|` 연산자를 사용하여 함수에 체인으로 연결할 수 있습니다.

이러한 값은 마지막 함수 인수가 됩니다:

```go
{{"output" | printf "%q"}}
```

### 사용자 정의 함수

Go에서 사용자 정의 함수를 정의하여 나중에 템플릿에서 사용할 수 있습니다.

다음은 리스트의 마지막 요소인지 확인하는 데 도움이 되는 사용자 정의 함수의 Go 코드입니다:

```go
tempTemplate := template.New("main").Funcs(
        template.FuncMap{
                "last": func(x int, a interface{}) bool {
                        return x == reflect.ValueOf(a).Num()-1
                },
        })
```

템플릿에서 `last` 함수 사용하기:

```go
{{ $allKeywords := .Data.Keywords }}
{{ range $k,$v := .Data.Keywords}}
        {{ $v }}{{ if ne (last $i $allKeywords) }},{{ end }}
{{ end }}
```

## 내부 동작

Go 템플릿은 모든 데이터 타입과 작업하기 위해 `reflect` 패키지를 사용합니다.

예를 들어, `text/template`에서 `range` 소스 코드:

```go
func (s *state) walkRange(dot reflect.Value, r *parse.RangeNode) {
        // ...
        switch val.Kind() {
        case reflect.Array, reflect.Slice:
                // ...
        case reflect.Map:
                // ...
        case reflect.Chan:
                // ...
        }
}
```

각 반복 타입에 대한 논리 분기가 있습니다. 동일한 `reflect` 접근 방식이 `eval` 필드 명령어 소스에도 있습니다.

`html/template`은 `text/template`을 사용합니다.

`html/template`은 템플릿이 처리하는 HTML 콘텐츠의 정확한 타입(HTML 태그의 이름, 속성, 태그의 내용, CSS 콘텐츠, URL)을 식별하도록 설계되었습니다.

이러한 콘텐츠 식별을 기반으로 다양한 이스케이프 솔루션이 제공됩니다.

이 글을 통해 Go 템플릿의 기본 문법과 이를 활용하는 방법을 이해하는 데 도움이 되었기를 바랍니다.

Go 템플릿을 잘 활용하면 더 나은 코드와 더 나은 소프트웨어를 만들 수 있을 것입니다.
