---
slug: 2024-02-24-complete-short-tutorial-of-golang-after-tour-of-go
title: Go 언어 기초 - A tour of Go 요약본
date: 2024-02-24 11:26:46.633000+00:00
summary: A tour of Go 요약해 보았습니다.
tags: ["go", "golang"]
contributors: []
draft: false
---

---

안녕하세요?

A Tour of Go의 순서에 따라 개인적으로 학습한 Go의 기본 내용을 정리해 보았는데요.

특히 Go 언어를 처음 접한 분들한테 도움이 됐으면 합니다.

** 목 차 **

- [Go 언어 기초 - A tour of Go 요약본](#go-언어-기초---a-tour-of-go-요약본)
  - [**패키지**](#패키지)
    - [**Exported names(내보낸 이름)**](#exported-names내보낸-이름)
  - [**함수(Functions)**](#함수functions)
    - [**인수의 타입 생략**](#인수의-타입-생략)
    - [**다중 반환값**](#다중-반환값)
  - [변수 (Variables)](#변수-variables)
    - [변수 초기값](#변수-초기값)
    - [함수 내에서 짧은 변수 선언](#함수-내에서-짧은-변수-선언)
    - [기본 자료형](#기본-자료형)
    - [형 변환 (Type conversions)](#형-변환-type-conversions)
  - [상수 (Constants)](#상수-constants)
  - [For 루프](#for-루프)
  - [If (조건 분기)](#if-조건-분기)
  - [Switch (조건 분기)](#switch-조건-분기)
  - [**지연된 실행 (Defer)**](#지연된-실행-defer)
  - [포인터](#포인터)
  - [구조체(struct)](#구조체struct)
    - [구조체 정의 방법](#구조체-정의-방법)
    - [구조체 초기화](#구조체-초기화)
    - [**구조체와 포인터**](#구조체와-포인터)
    - [구조체에서의 메소드 정의](#구조체에서의-메소드-정의)
  - [**배열(Arrays)**](#배열arrays)
    - [**배열 선언 방법**](#배열-선언-방법)
  - [**슬라이스**](#슬라이스)
    - [**슬라이스 선언 방법**](#슬라이스-선언-방법)
    - [슬라이스 조작](#슬라이스-조작)
    - [**요소 추가**](#요소-추가)
    - [**슬라이스의 길이(length)와 용량(capacity)**](#슬라이스의-길이length와-용량capacity)
    - [**슬라이스 할당**](#슬라이스-할당)
    - [**슬라이스의 제로 값**](#슬라이스의-제로-값)
    - [**내장 함수 `make()`로 슬라이스 생성**](#내장-함수-make로-슬라이스-생성)
  - [**Maps**](#maps)
    - [**Maps 선언 방법**](#maps-선언-방법)
    - [**Maps의 제로 값**](#maps의-제로-값)
    - [**Maps에 요소 삽입 및 업데이트**](#maps에-요소-삽입-및-업데이트)
    - [**Maps에서 요소 가져오기**](#maps에서-요소-가져오기)
    - [**Maps의 요소 삭제**](#maps의-요소-삭제)
  - [**Range**](#range)
    - [**슬라이스(Slice)의 경우의 `range`**](#슬라이스slice의-경우의-range)
    - [**맵(Map)의 경우의 `range`**](#맵map의-경우의-range)
    - [**인덱스(index)나 값(value)의 생략**](#인덱스index나-값value의-생략)
    - [**반복 처리 중단 및 건너뛰기**](#반복-처리-중단-및-건너뛰기)
  - [인터페이스(Interface)](#인터페이스interface)
    - [인터페이스(Interface)의 정의 방법](#인터페이스interface의-정의-방법)
    - [빈 인터페이스](#빈-인터페이스)
    - [**형 단언 (Type Assertion)**](#형-단언-type-assertion)
    - [**타입 스위치 (Type Switch)**](#타입-스위치-type-switch)
    - [**구조체에 인터페이스 구현**](#구조체에-인터페이스-구현)
  - [goroutine(고루틴)이란](#goroutine고루틴이란)
    - [goroutine(고루틴)의 시작](#goroutine고루틴의-시작)
    - [goroutine(고루틴)의 종료 조건](#goroutine고루틴의-종료-조건)
    - [현재 실행 중인 고루틴 수 확인 방법](#현재-실행-중인-고루틴-수-확인-방법)
    - [고루틴의 실제 예시](#고루틴의-실제-예시)
  - [**channel**](#channel)
    - [**고루틴 동기화:**](#고루틴-동기화)
    - [**고루틴 동기화 예시 1**](#고루틴-동기화-예시-1)
    - [고루틴 동기화 예시2](#고루틴-동기화-예시2)
    - [고루틴 동기화 예시3](#고루틴-동기화-예시3)

---

## **패키지**

Go 프로그램은 패키지에 의해 구성됩니다.

필요한 패키지는 import 내에서 명시합니다.

```go
package main

import (
	"fmt"
	"math/rand"
)

func main() {
	fmt.Println("내가 좋아하는 숫자는", rand.Intn(10), "입니다.") // => 내가 좋아하는 숫자는 1입니다.
}
```

또한 패키지를 개별적으로 가져올 수도 있습니다.

```go
import "fmt"
import "math/rand"
```

### **Exported names(내보낸 이름)**

Go에서 첫 글자가 대문자로 시작하는 것은 외부 패키지에서 참조할 수 있는 내보낸 이름(Exported names)입니다.

아래의 Pi는 math 패키지에서 내보낸 것입니다.

```go
package main

import (
	"fmt"
	"math"
)

func main() {
	fmt.Println(math.Pi) // => 3.141592653589793
}
```

---

## **함수(Functions)**

함수는 0개 이상의 인수를 가질 수 있습니다.

함수는 다음과 같이 정의됩니다.

```go
func <함수명>([인수]) [반환값의 타입] {
    [함수 본문]
}
```

인수 뒤에 반환값의 타입을 적어주어야 합니다.

```go
package main

import "fmt"

func greetings(arg string) string {
	return arg
}

func main() {
	fmt.Println(greetings("Hello World")) // => Hello World
}
```

### **인수의 타입 생략**

함수가 두 개 이상의 동일한 타입의 인수를 가질 때, 아래와 같이 타입을 생략할 수 있습니다.

```go
package main

import "fmt"

func add(x, y int) int {
	return x + y
}

func main() {
	fmt.Println(add(1, 2)) // => 3
}
```

### **다중 반환값**

Go 함수는 여러 값을 반환할 수 있습니다.

```go
package main

import "fmt"

func multipleArgs(arg1, arg2 string) (string, string) {
	return arg2, arg1
}

func main() {
	a, b := multipleArgs("Hello", "World")
	fmt.Println(a, b) // => World Hello
}
```

---

## 변수 (Variables)

Go에서 변수를 선언할 때는 `var` 키워드를 사용합니다.

함수의 인수와 마찬가지로 여러 변수를 동시에 정의하려면 변수 뒤에 타입을 명시합니다.

```go
package main

import "fmt"

var var1, var2, var3 bool

func main() {
	var num int
	fmt.Println(num, var1, var2, var3) //=> 0 false false false
}
```

### 변수 초기값

변수를 선언할 때 초기값을 설정할 수 있습니다.

초기값이 지정된 경우 변수의 타입을 명시할 필요가 없습니다. 해당 변수는 초기값의 타입을 가집니다.

```go
package main 

import "fmt"

var str = "Go Programming Language"
var num = 2

func main(){
   fmt.Println(str, num) // => Go Programming Language 2
}
```

또한 다음과 같이 여러 변수를 동시에 정의할 수도 있습니다.

```go
package main 

import "fmt"

var str, num, boolean = "Go language", 23, true

func main(){
  fmt.Println(str, num, boolean) //=> Go language 23 true
}
```

변수에 초기값을 지정하지 않으면 **제로 값 (Zero values)**이 설정됩니다.

(숫자형은 0, 불리언은 false, 문자열은 ""(빈 문자열)이 할당됩니다.)

```go
package main

import "fmt"

func main() {
	var i int
	var f float64
	var b bool
	var s string
	fmt.Printf("%v %v %v %q\n", i, f, b, s) //=> 0 0 false ""
}
```

### 함수 내에서 짧은 변수 선언

**함수 내에서**는 `:=`를 사용하여 더 간단한 코드로 변수를 선언할 수 있습니다.

(함수 외부에서는 `:=`를 사용한 변수 선언이 불가능합니다.)

```go
package main 

import "fmt"

func main(){
   str := "Hello World"
   fmt.Println(str) //=> Hello World
}
```

### 기본 자료형

Go의 기본 자료형 (내장 자료형)은 다음과 같습니다.

- bool
- string
- int, int8, int16, int32, int64
- uint, uint8, uint16, uint32, uint64, uintptr
- byte (uint8의 별칭)
- rune (int32의 별칭, Unicode 코드 포인트를 나타냄)
- float32, float64
- complex64, complex128

int, uint, uintptr 타입은 32비트 시스템에서는 32비트, 64비트 시스템에서는 64비트입니다.

특별한 이유가 없다면 정수 변수가 필요한 경우 int를 사용하는 것이 좋습니다.

### 형 변환 (Type conversions)

Go에서는 암시적인 형 변환이 허용되지 않기 때문에 다른 타입의 변수에 할당하는 경우 다음과 같은 오류가 발생합니다.

```go
var i int = 100
var f float64 = i  // cannot use i (type int) as type float64
```

형 변환을 하려면 변수를 괄호로 묶고 앞에 타입을 명시해야 합니다.

```go
var a uint32 = 1234567890
var b uint8 = uint8(a)
fmt.Println(b)  // 210 (정보 손실 발생)
```

---

## 상수 (Constants)

상수는 `const` 키워드를 사용하여 선언합니다.

상수는 문자(character), 문자열(string), 불리언(boolean), 숫자(numeric)만 사용할 수 있습니다.

상수는 `:=`를 사용하여 선언할 수 없습니다.

```go
package main 
import "fmt"

const Num = 2

func main(){
	const Greetings = "Hello World"
	fmt.Println(Greetings) // => Hello
```

---

## For 루프

Go에서는 `for`를 사용하여 루프를 구현합니다.

`for` 루프는 세 가지 부분으로 나뉩니다.

1. **초기화 스테이트먼트 (Initialization statement)**: 첫 반복 전에 초기화가 실행됩니다.
2. **조건식 (Condition expression)**: 각 반복마다 평가됩니다.
3. **후처리 스테이트먼트 (Post statement)**: 각 반복의 마지막에 실행됩니다.

`for` 루프에서는 세미콜론(`;`)으로 각 부분을 구분합니다.

초기화 스테이트먼트는 짧은 변수 선언으로 자주 사용되며 해당 변수는 `for`의 스코프 내에서만 유효합니다.

```go
package main

import "fmt"

func main() {
	sum := 0
	for i := 0; i < 10; i++ {
		sum += i
		fmt.Println(sum) //=> 0 1 3 6 10
	}
}
```

초기화 스테이트먼트와 후처리 스테이트먼트는 선택적이며 생략할 수 있습니다.

또한 세미콜론도 생략 가능합니다.

```go
package main

import "fmt"

func main() {
	sum := 1
	for sum < 1000 {
		sum += sum
	}
	fmt.Println(sum) //=> 1024
}
```

---

## If (조건 분기)

Go의 `if`는 `for`와 마찬가지로 괄호(`()`)는 필요하지 않지만 중괄호(`{}`)는 필요합니다.

`if` 문은 다음과 같이 간단한 스테이트먼트를 조건 앞에 작성할 수 있습니다.

(여기서 선언된 변수는 `if`의 스코프 내에서만 유효합니다.)

```go
package main

import "fmt"

func condition(arg string) string {
	if v := "GO"; arg == v {
		return "This is Golang"
	} else {
		return "This is not Golang"
	}
}

func main() {
	fmt.Println(condition("Swift")) //=> This is not Golang
}
```

---

## Switch (조건 분기)

Go에서는 선택된 `case`만 실행되고 해당하는 다른 `case`는 실행되지 않습니다.

```go
package main

import "fmt"

func main() {
	lang := "Go"

	switch lang {
	case "Ruby":
		fmt.Println("This is Ruby")
	case "Go":
		fmt.Println("This is Go")
	default:
		fmt.Println("This is a programming language")
	}
	// => This is Go
}
```

`switch` 앞에 아무 조건도 작성하지 않으면 `switch true`와 동일합니다.

또한 `if-then-else` 구문을 더 간단하게 작성할 수 있습니다.

```go
package main

import "fmt"

func main() {
	lang := "Go"

	switch {
	case lang == "Ruby":
		fmt.Println("This is Ruby")
	case lang == "Go":
		fmt.Println("This is Go")
	default:
		fmt.Println("This is a programming language")
	}
	// => This is Go
}
```

---

## **지연된 실행 (Defer)**

defer는 함수에서 반환되기 직전까지 실행을 지연시킵니다.

주로 리소스를 정리할 때 사용됩니다.

아래 예시에서는 defer로 전달한 함수인 `fmt.Println("World")`이 호출한 함수인 `func main()`이 끝날 때까지 지연됩니다.

```go
package main

import "fmt"

func main() {
	defer fmt.Println("World")
	fmt.Println("Hello")
	// 출력:
	// Hello
	// World
}
```

여러 함수를 defer로 전달하는 경우, 이 호출은 스택에 쌓입니다.

호출한 함수가 반환될 때, defer로 전달한 함수는 새 데이터에서부터 구식 데이터(LIFO) 순서로 실행됩니다.

즉, 가장 먼저 defer된 줄이 가장 마지막에 실행됩니다.

```go
package main

import "fmt"

func main() {
	defer fmt.Println("Golang") // defer1
	defer fmt.Println("Ruby")   // defer2
	fmt.Println("JS")
	// 출력:
	// JS
	// Ruby
	// Golang
}
```

위의 예시에서는 `func main()` 함수 내에서 `fmt.Print("JS")`를 실행한 후, 새로운 정보인 `fmt.Print("Ruby")`를 실행하고, 마지막으로 가장 오래된 정보인 `fmt.Print("Golang")`을 실행합니다.

---

## 포인터

**포인터**는 메모리의 주소 정보를 나타냅니다.

Go 언어에서는 포인터를 사용하여 메모리 주소를 직접 참조할 수 있습니다.

아래의 예시 코드를 통해 포인터의 기본 개념을 살펴보겠습니다:

```go
package main

import "fmt"

func main() {
    var var1 int = 10
    var var2 *int = &var1
    fmt.Println(var1)   //=> 10
    fmt.Println(var2)   //=> 0x10414020 (메모리 주소)
    fmt.Println(*var2)  //=> 10 (포인터를 통한 값 참조)
}
```

위 코드에서 `var1`은 정수형 변수이고, `var2`는 `var1`의 주소를 가리키는 포인터입니다.

`*var2`를 통해 `var2`가 가리키는 메모리 주소의 값을 참조할 수 있습니다.

다음으로 **포인터 타입**에 대해 알아보겠습니다.

포인터 타입은 메모리 주소를 저장하는 변수의 타입입니다.

아래 코드에서 `*int`는 정수형 포인터 타입을 나타냅니다:

```go
var var2 *int = &var1
```

또한 **포인터 변수**는 메모리 주소를 값으로 가지는 변수를 의미합니다.

즉, 메모리 상의 주소를 직접 저장할 수 있는 변수입니다.

아래와 같이 `*`를 사용하여 변수를 포인터 타입으로 선언합니다:

```go
var var1 int      // int 타입
var var2 *int     // int 포인터 타입
```

포인터 변수는 초기값이 지정되지 않은 경우 Go 언어에서는 자동으로 nil (nil 포인터)로 초기화됩니다.

또한 포인터 변수를 사용할 때는 `*`를 붙여 해당 주소의 값을 참조할 수 있습니다.

아래 예시를 참고하세요:

```go
func main() {
    var var1 int = 10
    var var2 *int = &var1
    fmt.Println(*var2) //=> 10
}
```

Go에서는 기본적으로 포인터가 가리키는 메모리의 값을 직접 변경할 수 있습니다.

하지만 함수의 파라미터로 포인터를 전달할 때는 값이 복사되므로 주의해야 합니다.

만약 참조에 의한 전달을 원한다면 포인터를 사용해야 합니다¹⁶.

---

## 구조체(struct)

구조체는 Go 언어에서 클래스(class)와 유사한 역할을 하는 데이터 타입입니다.

클래스가 필드와 메서드를 함께 갖는 반면, Go 언어의 구조체는 필드만을 가지며 메서드는 별도로 정의됩니다.

구조체는 관련된 정보를 하나로 묶어 표현하는데 사용됩니다.

### 구조체 정의 방법

먼저 **구조체의 정의 방법**을 살펴보겠습니다.

아래와 같이 `type`과 `struct`를 사용하여 구조체를 정의합니다:

```go
package main

import "fmt"

type Person struct {
   firstName string
   age int
}
```

### 구조체 초기화

구조체를 초기화하는 방법은 여러 가지가 있습니다.

아래의 세 가지 방법을 확인해보겠습니다:

1. **변수를 정의한 후 필드를 설정하는 방법**:
    ```go
    var mike Person
    mike.firstName = "Mike"
    mike.age = 20
    fmt.Println(mike.firstName, mike.age) //=> Mike 20
    ```

2. **중괄호 `{}`를 사용하여 필드 값을 순서대로 전달하는 방법**:
    ```go
    bob := Person{"Bob", 30}
    fmt.Println(bob.firstName, bob.age) //=> Bob 30
    ```

3. **필드명을 `:`로 지정하여 값을 전달하는 방법**:
    ```go
    sam := Person{age: 15, firstName: "Sam"}
    fmt.Println(sam.firstName, sam.age) //=> Sam 15
    ```

또한 초기화 함수를 사용하여 구조체를 초기화하는 방법도 있습니다.

아래 예시에서는 `newPerson` 함수를 통해 초기화합니다:

```go
type Person struct {
   firstName string
   age int
}

func newPerson(firstName string, age int) *Person {
     person := new(Person)
     person.firstName = firstName
     person.age = age
     return person
}

func main() {
    var jen *Person = newPerson("Jennifer", 40)
    fmt.Println(jen.firstName, jen.age) //=> Jennifer 40
}
```

### **구조체와 포인터**

마지막으로, 구조체와 포인터를 함께 사용할 수 있습니다.

구조체의 필드는 구조체의 포인터를 통해 접근할 수 있습니다.

아래 예시를 참고하세요:

```go
package main

import "fmt"

type Person struct {
  firstName string
  age int
}

func main() {
    tim := Person{"Tim", 25}
    person1 := &tim
    (*person1).age = 25
    person1.age = 53 //shortcut로 p.X와 같이도 작성 가능
    fmt.Println(person1) //=> {Tim 53}
}
```

구조체를 사용하여 데이터를 구조화하고 필드를 조작하는 것이 가능합니다.

### 구조체에서의 메소드 정의

**구조체** 내에서 메서드를 정의할 수 있습니다.

Go 언어에서는 클래스(class)가 없지만, 구조체 내에서 메서드를 추가하여 객체 지향 언어의 클래스와 유사한 동작을 구현할 수 있습니다. 메서드는 다음과 같이 정의할 수 있습니다:

```go
func (레시버 인수) 함수명(인수) 반환값의 타입 {
    // 함수의 본문
}
```

실제로 `Person`이라는 구조체에 `intro`라는 메서드를 정의해 보겠습니다:

```go
type Person struct {
   firstName string
   age int
}

func (p Person) intro(greetings string) string {
    return greetings + " I am " + p.firstName
}

func main() {
    bob := Person{"Bob", 30}
    fmt.Println(bob.intro("Hello")) //=> Hello I am Bob
}
```

위 예시에서 `intro` 메서드는 `p`라는 이름의 `Person` 타입의 레시버를 가지고 있음을 의미합니다.

또한 **구조체 내에서 다른 구조체를 포함하는 기능**도 있습니다.

이를 통해 상속과 유사한 기능을 구현할 수 있습니다.

아래 예시에서는 `User` 구조체가 `Person`을 포함하고 있습니다:

```go
package main

import "fmt"

type Person struct {
   firstName string
}

func (a Person) name() string {
    return a.firstName
}

type User struct {
     Person
}

func main() {
    bob := Person{"Bob"}
    mike := User{}
    mike.firstName = "Mike"
  
    fmt.Println(bob.name())  //=> Bob
    fmt.Println(mike.name()) //=> Mike
}
```

구조체를 사용하여 데이터를 구조화하고 메서드를 정의하는 것이 가능합니다.

---

## **배열(Arrays)**

배열은 동일한 유형의 값(요소)을 일렬로 나열한 것입니다.

Go의 배열은 고정 크기의 배열이므로 처음에 선언한 배열의 크기를 변경할 수 없습니다.

### **배열 선언 방법**

Go에서 배열은 다음과 같이 선언합니다.

1. `var 변수명 [길이]유형`
2. `var 변수명 [길이]유형 = [크기]유형{초기값1, 초기값n}`
3. `변수명 := [...]유형{초기값1, 초기값n}`

1번 방법으로 배열을 선언한 예시:

```go
func main() {
    var arr [2]string
    arr[0] = "Golang"
    arr[1] = "Java"
    fmt.Println(arr[0], arr[1]) //=> Golang Java
    fmt.Println(arr) //=> [Golang Java]
}
```

2번 방법으로 배열을 선언한 예시:

```go
func main() {
    var arr [2]string = [2]string{"Golang", "Java"}
    fmt.Println(arr[0], arr[1]) //=> Golang Java
    fmt.Println(arr) //=> [Golang Java]
}
```

3번 방법으로 배열을 선언한 예시:
이 선언 방법에서는 요소 수를 생략할 수 있습니다.

그러나 요소 수를 명시한 경우와 실제로는 차이가 없습니다.

```go
func main() {
    arr := [...]string{"Golang", "Java"}
    fmt.Println(arr[0], arr[1]) //=> Golang Java
    fmt.Println(arr) //=> [Golang Java]
}
```
---

## **슬라이스**

Go의 **배열**은 고정 길이의 배열이지만, Go의 **슬라이스**는 가변 길이의 배열과 유사한 동작을 하므로 더 유연하게 데이터(요소)를 저장할 수 있습니다.

### **슬라이스 선언 방법**

Go에서 슬라이스는 다음과 같이 선언합니다.

배열과 달리 슬라이스는 [ ] 안에 크기를 지정하지 않습니다.

또한 슬라이스는 배열로부터 부분 집합을 추출하여 (슬라이스 조작으로) 생성할 수 있도록 값이 있는 _"참조 형식"_입니다.

1. `var 변수명 []타입`
2. `var 변수명 []타입 = []타입{초기값1, ..., 초기값n}`
3. `변수명 := 배열[start:end]`
   - 배열(또는 슬라이스)의 start부터 (end - 1)까지를 추출하여 슬라이스를 생성합니다.

아래는 선언 예시입니다.

1. `func main() { var slice []string fmt.Println(slice) //=> [] }`
2. `func main() { slice := []string{"Golang", "Java"} fmt.Println(slice) //=> [Golang Java] }`
3. `func main() { arr := [...]string{"Golang", "Java"} slice := arr[0:2] fmt.Println(slice) //=> [Golang Java] }`

### 슬라이스 조작

**슬라이스 조작**에는 다음과 같은 것들이 있습니다.

위의 예시에서는 `Slice[start:end]`를 사용했습니다.

| 조작          | 의미                   |
|---------------|------------------------|
| `Slice[start:end]` | start부터 end - 1까지 |
| `Slice[start:]`    | start부터 끝까지        |
| `Slice[:end]`      | 처음부터 end - 1까지   |
| `Slice[:]`         | 처음부터 끝까지        |

슬라이스 조작을 할 때는 원본 배열(또는 슬라이스)과 요소를 공유합니다.

즉, 슬라이스의 요소를 변경하면 해당 원본 배열의 해당 요소도 변경됩니다.

```go
func main() {
    arr := [...]string{"Golang", "Java"}
    slice := arr[0:2] // 슬라이스 생성

    slice[0] = "Ruby" // slice[0]의 요소 변경
    fmt.Println(arr) //=> [Ruby Java] // arr의 요소도 변경되었음을 확인
}
```

### **요소 추가**

Go에서 배열은 선언 시 요소 수가 고정되므로 요소를 추가할 수 없습니다.

슬라이스에 요소를 추가하려면 내장 함수 `append()`를 사용하면 간단하게 수행할 수 있습니다.

(단, `append`는 새로운 슬라이스를 반환한다는 점에 유의하세요.)

아래와 같이 작성하여 원본 배열(슬라이스)의 끝에 지정한 요소를 추가한 값을 반환합니다.

```go
newSlice = append(slice, 추가요소)
func main() {
    slice := []string{"Golang", "Java"}
    newSlice := append(slice, "Ruby") // slice에 "Ruby"를 추가

    fmt.Println(newSlice) //=> [Golang Java Ruby]
    fmt.Println(slice) //=> [Golang Java] // 원래 값은 변경되지 않음
}
```

### **슬라이스의 길이(length)와 용량(capacity)**

슬라이스는 **길이(length)**와 **용량(capacity)** 두 가지를 모두 가지고 있습니다.

- **길이(length)**: 슬라이스에 포함된 요소의 개수입니다.
- **용량(capacity)**: 슬라이스의 첫 번째 요소부터 원본 배열의 요소 수까지입니다.

슬라이스의 길이와 용량은 `len()`과 `cap()` 표현식을 사용하여 얻을 수 있습니다.

```go
func main() {
    arr := [...]string{"Golang", "Java"}
    slice := arr[0:1]
    
    fmt.Println(slice) //=> Golang
    fmt.Println(len(slice)) //=> 1 (슬라이스의 요소 수)
    fmt.Println(cap(slice)) //=> 2 (원본 배열의 요소 수)
}
```

### **슬라이스 할당**

슬라이스의 타입이 일치하는 경우 슬라이스를 할당할 수 있습니다.

```go
func main() {
    slice := []string{"Golang", "Java"}
    var slice2 []string // slice와 동일한 타입의 slice2 생성
    
    slice2 = slice // slice를 slice2에 할당
    
    fmt.Println(slice2) //=> [Golang Java]
}
```

슬라이스에서도 slice2의 배열 본체에 접근할 수 있습니다.

또한 `slice[0]`의 값을 변경하면 `slice2`의 값도 변경됩니다.

```go
func main() {
    slice := []string{"Golang", "Java"}
    var slice2 []string // slice와 동일한 타입의 slice2 생성
    
    slice2 = slice // slice를 slice2에 할당
    slice2[0] = "Ruby" // slice2[0]의 값을 변경
    
    fmt.Println(slice2) //=> [Ruby Java]
    fmt.Println(slice) //=> [Ruby Java] (slice2의 변경으로 slice의 요소도 변경됨)
}
```

### **슬라이스의 제로 값**

슬라이스의 제로 값은 `nil`입니다.

`nil` 슬라이스는 길이와 용량이 모두 0이며 원본 배열이 없습니다.

```go
func main() {
    var slice []int
    fmt.Println(slice, len(slice), cap(slice)) //=> [] 0 0
    
    if slice == nil {
        fmt.Println("nil!") //=> nil! (slice 값이 nil인 경우 출력)
    }
}
```

### **내장 함수 `make()`로 슬라이스 생성**

슬라이스는 내장 함수 `make()`를 사용하여 정의할 수도 있습니다.

```go
make([]T, len, cap)
```

위의 `make()` 함수에서 첫 번째 인수 `[]T`는 타입, 두 번째 인수 `len`은 길이, 세 번째 인수 `cap`은 용량을 의미합니다.

```go
func main() {
    a := make([]int, 5, 5)
    fmt.Println(a) //=> [0 0 0 0 0]
}
```

---

## **Maps**

배열이 정수 값을 사용하여 요소를 지정하는 반면, Maps는 **키(key)**라는 데이터를 사용하여 요소를 지정하는 데이터 구조입니다.

이는 Ruby에서의 Hash나 Python에서의 dictionary와 유사합니다.

### **Maps 선언 방법**

Maps은 주로 다음과 같이 선언됩니다.

1. **내장 함수 make()를 사용하여 선언**
2. **초기값을 지정하여 선언**

1. **내장 함수 make()를 사용하여 선언**
   내장 함수 `make()`는 지정된 유형의 초기화된 맵을 반환합니다.
   
   `make()`를 사용할 때는 다음과 같이 맵의 초기화를 수행합니다.

   ```go
   make(map[키의 유형]값의 유형, 초기 용량)
   make(map[키의 유형]값의 유형) // 초기 용량은 생략 가능
   ```

   `make()`로 생성된 Maps(연상 배열)에는 다음과 같이 키와 값이 입력됩니다.

   ```go
   map[키의 값] = 값의 값
   ```

   실제로 다음과 같이 Maps(연상 배열)을 생성할 수 있습니다.

   ```go
   func main() {
       mapEx := make(map[string]string, 2) // 맵 선언
       fmt.Println(mapEx) // => map[] (비어 있는 맵)

       mapEx["firstName"] = "Mike" // 맵에 키와 값을 삽입
       mapEx["lastName"] = "Smith"

       fmt.Println(mapEx) // => map[lastName:Smith firstName:Mike]
   }
   ```

2. **초기값을 지정하여 선언**
   내장 함수 `make()`를 사용하지 않고도 다음과 같이 초기값을 지정하여 Maps(연상 배열)을 생성할 수 있습니다.

   ```go
   var mapEx = map[string]string{"firstName": "John", "lastName": "Smith"}
   ```

   실제로 다음과 같이 Maps(연상 배열)을 생성할 수 있습니다.

   ```go
   func main() {
       fmt.Println(mapEx) // => map[lastName:Smith firstName:Mike]
   }
   ```

### **Maps의 제로 값**

Maps의 초기값을 지정하지 않으면 변수는 nil (nil 맵)로 초기화됩니다.

nil 맵은 요소를 저장할 수 없으며, 요소를 저장하려면 맵을 초기화해야 합니다.

```go
map[키의 유형]값의 유형
// map 뒤의 [ ]에 키의 유형을, 그 뒤에 값의 유형을 지정합니다.
var map1 map[string]int

func main() {
    fmt.Println(map1) // => map[] (nil 맵)
}
```

### **Maps에 요소 삽입 및 업데이트**

다음과 같이 Maps(연상 배열)에 요소를 삽입하거나 업데이트할 수 있습니다.

```go
map[키] = 요소
```

실제로 위의 방법으로 삽입 및 업데이트가 가능한지 확인해보세요.

```go
func main() {
    mapEx := make(map[string]int)
    mapEx["ele1"] = 1 // 요소 삽입
    fmt.Println(mapEx)

    mapEx["newEle"] = 2 // 요소 업데이트
    fmt.Println(mapEx)
}
```

### **Maps에서 요소 가져오기**

Maps에서 요소를 가져오는 방법은 다음과 같습니다.

```go
map[키]
```

실제로 다음과 같이 요소를 가져올 수 있습니다.

```go
func main() {
    mapEx := map[string]string{"firstName": "John", "lastName": "Smith"}

    fmt.Println(mapEx["firstName"]) // => John
    fmt.Println(mapEx["lastName"]) // => Smith
}
```

### **Maps의 요소 삭제**

Maps에서 요소를 삭제하는 방법은 다음과 같습니다.

```go
delete(mapEx, key)
```

실제로 다음과 같이 요소를 삭제할 수 있습니다.

```go
func main() {
    mapEx := map[string]string{"firstName": "John", "lastName": "Smith"}
    delete(mapEx, "firstName") // mapEx의 "firstName" 삭제

    fmt.Println(mapEx["firstName"]) // =>
    fmt.Println(mapEx["lastName"]) // => Smith
}
```

---

## **Range**

`range`는 슬라이스(Slices)나 맵(Maps)을 하나씩 반복 처리할 때 사용합니다.

### **슬라이스(Slice)의 경우의 `range`**

`range`를 사용하여 슬라이스를 반복할 때, `range`는 반복마다 두 개의 변수를 반환합니다.

첫 번째 변수는 인덱스(index)이고, 두 번째 변수는 해당 인덱스 위치의 요소(value)입니다.

```go
var slice = []string{"Golang", "Ruby", "Javascript", "Python"}
func main() {
	for index, value := range slice {
	    fmt.Println(index, value)
		//=> 0 Golang
		//=> 1 Ruby
		//=> 2 Javascript
		//=> 3 Python
	}
}
```

### **맵(Map)의 경우의 `range`**

맵을 `range`로 반복할 때, 반복 순서는 무작위입니다.

그러나 슬라이스와 동일하게 작동합니다.

반복마다 두 개의 변수를 반환하며, 첫 번째 변수는 키(key)이고 두 번째 변수는 해당 키 위치의 요소(value)입니다.

```go
var mapping = map[string]int{
	"one":   1,
	"two":   2,
	"three": 3,
	"four":  4,
	"five":  5,
}
func main() {
	for key, value := range mapping {
		fmt.Println(key, value)
		//=> four 4
		//=> five 5
		//=> one 1
		//=> two 2
		//=> three 3
	}
}
```

### **인덱스(index)나 값(value)의 생략**

인덱스나 값은 `_`에 할당하여 생략할 수 있습니다.

인덱스만 필요한 경우 다음과 같이 작성할 수 있습니다.

```go
var slice = []string{"Golang", "Ruby", "Javascript", "Python"}
func main() {
	for index, _ := range slice {
	    fmt.Println(index)
		//=> 0 
		//=> 1 
		//=> 2 
		//=> 3 
	}
}
```

값만 필요한 경우 다음과 같이 작성할 수 있습니다.

```go
var slice = []string{"Golang", "Ruby", "Javascript", "Python"}
func main() {
	for _, value := range slice {
	    fmt.Println(value)
		//=> Golang
		//=> Ruby
		//=> Javascript
		//=> Python
	}
}
```

`for` 루프에서 반복 처리를 중단하거나 건너뛰는 방법에 대해 설명드리겠습니다.

### **반복 처리 중단 및 건너뛰기**

`for` 루프를 중단하려면 `break`를 사용하고, 이후의 처리를 건너뛰고 다음 반복으로 넘어가려면 `continue`를 사용합니다.

아래 코드는 슬라이스(`slice`)를 반복하면서 특정 조건에 따라 처리를 중단하거나 건너뛰는 예시입니다:

```go
package main

import "fmt"

func main() {
    slice := []string{"Golang", "Ruby", "Javascript", "Python"}
    for _, value := range slice {
        if value == "Golang" {
            fmt.Println("Golang found")
            continue // 다음 반복으로 건너뛰기
        }

        if value == "Javascript" {
            fmt.Println("Javascript found!")
            break // 루프에서 빠져나오기
        }

        fmt.Println(value, "is not Golang")
    }
}
```

위 코드의 실행 결과는 다음과 같습니다:

```
Golang found
Ruby is not Golang
Javascript found!
```

`Python`은 처리되지 않았습니다.

---

## 인터페이스(Interface)

인터페이스(Interface)는 메서드의 타입만을 정의한 형식입니다.

인터페이스를 활용하면 객체 지향 언어에서 다형성과 유사한 기능을 구현할 수 있습니다.

### 인터페이스(Interface)의 정의 방법

인터페이스는 다음과 같이 작성합니다(여러 메서드를 작성할 수 있습니다).

인터페이스의 정의 내용은 단순히 메서드 목록입니다.

```go
type 타입명 interface {
    메서드명1(인수의 타입, ...) (반환값의 타입, ...)
      .....
    메서드명N(인수의 타입, ...) (반환값의 타입, ...)
}
```

위와 같이 메서드를 나열하여 인터페이스를 구현합니다.

### 빈 인터페이스

Go 언어에는 모든 타입과 호환되는 `interface{}` 타입(빈 인터페이스)이 존재합니다.

`interface{}`(빈 인터페이스)는 말 그대로 메서드가 없는 인터페이스 타입을 의미하며, 다음과 같이 정의할 수 있습니다.

```go
interface{}
```

아래 예시처럼 `interface{}`(빈 인터페이스)로 선언한 변수에는 어떤 타입의 값이든 할당할 수 있습니다.

```go
var obj interface{}

obj = 0123                                                            // int
obj = "String"                                                       // string
obj = []string{"Python", "Golang", "Ruby"}                          // slice
obj = func greetings(_ string) string { return "Hello World" }     // function
```

### **형 단언 (Type Assertion)**

`interface{}`는 모든 유형과 호환되지만, `interface{}` 유형으로 전달된 인수는 원래 유형의 정보가 손실되어 있습니다.

따라서 형 단언은 인터페이스 값의 기반이 되는 구체적인 값을 사용하는 수단을 제공합니다.

형 단언에는 다음과 같은 구문을 사용합니다.

```go
value := <변수>.(<유형>)
```

이 문은 인터페이스 값 `<변수>`가 구체적인 유형 `<유형>`을 보유하고, 기본 유형의 값을 변수 `value`에 할당한다는 것을 주장합니다.

또한 다음과 같이 하면 첫 번째 변수에는 형 단언이 성공했을 때 실제 값이 저장되고, 두 번째 변수에는 형 단언의 성공 여부(true/false)가 저장됩니다.

```go
value, ok := <변수>.(<유형>)
```

실제로 위의 방법으로 형 단언이 가능한지 확인해보겠습니다.

```go
func main() {
	var intface interface{} = "hello"

	variable := intface.(string)
	fmt.Println(variable) //=> hello

	variable, ok := intface.(string)
	fmt.Println(variable, ok) //=> hello true

	float, ok := intface.(float64) 
	fmt.Println(float, ok) //=> 0 false
	// 저장 실패가 있으므로 성공 여부를 확인하는 ok가 존재하므로 오류가 발생하지 않습니다.

	float = intface.(float64) 
	fmt.Println(float) //=> panic: interface conversion: interface {} is string, not float64
    // 성공 여부를 확인하는 ok가 없으므로 오류가 발생합니다.
}
```

위의 예시에서 인터페이스는 문자열로 유형이 지정되어 있으므로 다른 유형(예: float64)을 `<유형>` 부분에 작성하면 오류가 발생합니다.

(성공 여부를 확인하는 ok(두 번째 변수)가 있으므로 오류가 발생하지 않습니다.)

### **타입 스위치 (Type Switch)**

데이터의 유형 판별은 스위치 문에서도 수행할 수 있습니다.

Go 언어에서는 이를 **타입 스위치**라고 합니다.

아래와 같이 타입 스위치를 작성할 수 있습니다.

```go
switch v := x.(type) {
case 타입1: ...  // v는 타입1의 값이 됨
case 타입2: ...  // v는 타입2의 값이 됨
    ...
default: ... 
}
```

타입 스위치에서는 위와 같이 스위치 뒤에 타입 어설션 `v := x.(type)`을 작성하고, case에 타입을 지정합니다.

실제 사용 예시를 살펴보겠습니다.

```go
func do(i interface{}) {
	switch variable := i.(type) {
	case int:
		fmt.Println(variable)
	case string:
		fmt.Println(variable)
	default:
		fmt.Println("Default")
	}
}

func main() {
	do(23) //=> 23
	do("hello") //=> hello
	do(true) //=> Default
}
```

위와 같이 작성하면 데이터의 유형 판별을 수행하며 더 유연하게 타입 어설션을 구현할 수 있습니다.

### **구조체에 인터페이스 구현**

아래와 같이 작성하면 구조체에 인터페이스를 구현할 수 있습니다.

```go
func (인수 구조체명) 함수명(){
     함수의 내용
}
```

실제로 아래 코드에서 위 방법으로 인터페이스를 구현할 수 있는지 확인해보겠습니다.

```go
type People interface {
	intro()
}

type Person struct {
	name string
}

// 구조체 Person이 인터페이스 People을 구현했다는 의미입니다.
func (arg Person) intro(){
   	fmt.Println(arg.name)
}

func main() {
	bob := Person{"Bob"}
	bob.intro() //=> Bob
}
```

인터페이스를 사용하여 코드를 더 간결하게 만들 수 있습니다.

아래와 같이 인터페이스를 활용하여 `IntroForPerson`과 `IntroForPerson2` 메서드를 하나로 통합해보겠습니다.

```go
package main

import "fmt"

// People 인터페이스 정의
type People interface {
	intro()
}

// Person 구조체 정의
type Person struct{}

// Person2 구조체 정의
type Person2 struct{}

// Person 구조체의 intro() 메서드
func (p *Person) intro() {
	fmt.Println("Hello World")
}

// Person2 구조체의 intro() 메서드
func (p *Person2) intro() {
	fmt.Println("Hello World")
}

// 인터페이스를 받아 intro() 메서드 실행
func IntroForPerson(arg People) {
	arg.intro()
}

func main() {
	bob := new(Person)
	mike := new(Person2)

	IntroForPerson(bob)  //=> Hello World
	IntroForPerson(mike) //=> Hello World
}
```

---

## goroutine(고루틴)이란

goroutine(고루틴)은 Go 언어 프로그램에서 병행으로 실행되는 것을 의미합니다.

### goroutine(고루틴)의 시작

Go에서는 함수 (또는 메서드) 호출 앞에 `go`를 붙이면 다른 고루틴에서 함수를 실행할 수 있습니다.

```go
go 함수명(인자, ...)
```

`go`는 새로운 고루틴을 생성하고 해당 고루틴 내에서 지정된 함수를 실행합니다.

새로운 고루틴은 병행적으로 작동하므로 함수 실행이 끝나기를 기다리지 않고, `go` 뒤에 작성된 프로그램을 실행합니다.

### goroutine(고루틴)의 종료 조건

goroutine(고루틴)은 다음과 같은 조건에서 종료됩니다.

1. 함수 처리가 완료될 때.
2. `return`으로 빠져나갈 때.
3. `runtime.Goexit()`를 실행할 때.

### 현재 실행 중인 고루틴 수 확인 방법

`runtime.NumGoroutine()`을 사용하여 현재 실행 중인 고루틴 수를 알 수 있습니다.

```go
import (
	"fmt"
	"log"
	"runtime"
)

func main() {
	log.Println(runtime.NumGoroutine())
}
```

### 고루틴의 실제 예시

실제 코드를 통해 고루틴을 더 구체적으로 이해해보겠습니다.

아래 프로그램은 1초 간격으로 `str`을 `num`번 출력합니다.

```go
package main

import (
	"fmt"
	"time"
)

func main() {
	fmt.Println("시작!")
	process(2, "A")
	process(2, "B")
	fmt.Println("완료!")
}

func process(num int, str string) {
	for i := 0; i <= num; i++ {
		time.Sleep(1 * time.Second)
		fmt.Println(i, str)
	}
}
```

이 예제에서는 고루틴을 사용하지 않으므로 실행 결과는 다음과 같습니다.

```
시작!
0 A
1 A
2 A
0 B
1 B
2 B
완료!
```

이제 새로운 고루틴을 2개 생성하여 `process()` 함수를 실행해보겠습니다.

```go
func main() {
	fmt.Println("시작!")
	go process(2, "A") // 함수 실행 시 go 키워드를 사용하면 고루틴이 생성됩니다.
	go process(2, "B")
	fmt.Println("완료!")
}

func process(num int, str string) {
	for i := 0; i <= num; i++ {
		time.Sleep(1 * time.Second)
		fmt.Println(i, str)
	}
}
```

이렇게 실행하면 결과는 다음과 같습니다.

```
시작!
완료!
```

생성된 고루틴이 종료되기를 기다리지 않고 `main`이 종료되어 프로그램 전체 처리가 완료되었기 때문에 `process()` 함수의 실행 결과를 얻을 수 없었습니다.

`process()` 함수의 실행 결과를 얻으려면 `main`이 고루틴이 종료될 때까지 기다려야 합니다.

이는 채널을 사용하여 간단하게 구현할 수 있습니다.

---

## **channel**

채널은 **고루틴** 간의 **통신 경로**입니다.

이를 통해 값 교환과 작업 동기화가 가능합니다.

채널은 간단하게 생성하고 사용할 수 있으며, 안전하고 효율적인 데이터 전송을 지원합니다.

채널은 **방향성**을 가질 수 있어 송신 또는 수신 작업을 제한할 수 있습니다.

채널을 생성하는 방법은 다음과 같습니다:

1. **chan 키워드를 사용하여 직접 생성**:
    ```go
    var mychannel chan int
    ```

2. **make() 함수를 사용하여 생성**:
    ```go
    mychannel1 := make(chan int)
    ```

채널은 **동일한 유형의 데이터만 전송**할 수 있으며, 다른 유형의 데이터는 동일한 채널에서 전송할 수 없습니다.

채널을 통한 **데이터 송수신**은 다음과 같이 수행됩니다:

- **송신 (Send) 작업**:
    - `ch <- data`: 데이터 `data`를 채널 `ch`로 보냅니다.
    - 정수, 부동소수점, 불리언과 같은 값은 복사되므로 안전하게 전송됩니다. 문자열도 불변이므로 안전하게 전송됩니다. 그러나 포인터나 참조와 같은 데이터는 동시에 값을 변경할 수 있으므로 채널을 통해 전송할 때 주의해야 합니다.

- **수신 (Receive) 작업**:
    - `element := <-Mychannel`: 채널 `Mychannel`에서 데이터를 수신하여 `element`에 할당합니다.
    - 수신 결과를 사용하지 않을 경우 `<-Mychannel`로 표현할 수도 있습니다.

아래는 채널을 사용한 예시 코드입니다:

```go
package main

import (
	"fmt"
)

func main() {
	// 채널 생성
	messages := make(chan string)

	// 채널에 값 "str" 송신
	go func() { messages <- "str" }()

	// 채널에서 값 수신
	msg := <-messages
	fmt.Println(msg) // 출력: "str"
}
```

채널을 통해 고루틴 간에 안전하게 데이터를 교환할 수 있습니다.

### **고루틴 동기화:**

Go에서는 **수신 측은 항상 수신 가능한 데이터가 올 때까지 블록됩니다**.

또한, 송신 측은 채널이 버퍼링되지 않은 경우 수신 측이 값을 수신할 때까지 블록됩니다.

이를 통해 Go는 명확한 락이나 조건 변수 없이도 고루틴 동기화를 가능하게 합니다.

### **고루틴 동기화 예시 1**

아래 예시를 통해 이해해보겠습니다:

```go
func main() {
    ch := make(chan bool)  // bool 타입의 채널 생성
    
    // 아래 함수를 고루틴으로 실행. 완료 시 bool 타입의 값(true)을 채널로 송신하여 알림.
    go func() {
        fmt.Println("Hello")
        ch <- true  // 알림을 송신. 값은 아무거나 상관 없음 (bool 타입이면 됨)
    }()
    
    <-ch // 출력: "Hello"
    // bool 타입의 값이 수신될 때까지
```

위에서는 bool 형의 channel을 ch작성해, 골 루틴으로서 함수를 func()기동하고 있습니다.

func()내에서는 ch유형인 bool 값을 제공합니다.

Go에서는 수신측에서는 항상 수신 가능한 데이터가 올 때까지 차단되므로, main내에서의 ch형태인 bool의 값을 받을 때까지 완료 기다리고 있습니다.

### 고루틴 동기화 예시2

다음으로 다음 예제를 살펴보겠습니다.

```go

func hello(done chan bool) {  
    fmt.Println("Hello world goroutine")
    done <- true
}

func main() {  
    // bool형 channel인 done을 생성합니다.
    done := make(chan bool)
	
    // 생성한 done을 함수 hello에 전달합니다.
    go hello(done)
    
    <-done
    // main
    fmt.Println("main function")
} 
```

위의 예시에서는 bool형 channel인 `done`을 생성하고, 함수 `hello()`에 전달하고 있습니다.

이로 인해 `main` 함수 내에서 `<-done`이 호출될 때까지 `hello()` 함수에서 bool형 요소를 기다리게 됩니다.

### 고루틴 동기화 예시3

```go
func main() {
    fmt.Println("Start!")
    go process(2, "A") // go 키워드를 사용하여 함수 실행 시 고루틴이 생성됩니다.
    go process(2, "B")
    fmt.Println("Finish!")
}

func process(num int, str string) {
    for i := 0; i <= num; i++ {
        time.Sleep(1 * time.Second)
        fmt.Println(i, str)
    }
}
```

현재 상태에서는 생성된 고루틴의 종료를 기다리지 않고 `main` 함수가 종료되어 프로그램 전체 처리가 완료되었습니다.

따라서 `process()` 함수의 실행 결과를 얻을 수 없었습니다.

이를 채널을 활용하여 다음과 같이 수정하겠습니다:

```go
func main() {
    ch1 := make(chan bool)
    ch2 := make(chan bool)
   
    fmt.Println("Start!")
	
    go func() {
        process(2, "A")
        ch1 <- true
    }()
	
    go func() {
        process(2, "B")
        ch2 <- true
    }()
	
    <-ch1
    <-ch2
	
    fmt.Println("Finish!")
}

func process(num int, str string) {
    for i := 0; i <= num; i++ {
        time.Sleep(1 * time.Second)
        fmt.Println(i, str)
    }
}
```

위 코드에서는 bool형 채널인 `ch1`과 `ch2`를 생성하고, `main` 함수에서 `<-ch1` 및 `<-ch2`가 호출될 때까지 bool형 요소를 기다리도록 하였습니다.

이렇게 하면 함수 내에서 `process()`가 평가되므로 기대한 실행 결과를 얻을 수 있습니다:

```
Start!
0 A
0 B
1 B
1 A
2 A
2 B
Finish!
```

---

끝.

