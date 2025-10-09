---
slug: 2025-04-27-go-generics-tutorial-2-constraint
title: (Go 언어 날개 달기) 제너릭(Generics) 완전 정복 2편 - 제약조건으로 날개 달기!
date: 2025-04-27 08:57:55.829000+00:00
summary: 제너릭 코드의 안정성과 표현력을 한층 높여주는 제약조건(Constraints)에 대해 더 깊이 알아볼 예정입니다.
tags: ["Go", "Golang", "Generics", "제너릭", "Constraint", "제약조건", "comparable", "interface", "union"]
contributors: []
draft: false
---

안녕하세요!

지난 1편에서는 제너릭의 기본 개념과 `[T any]`를 이용해 타입에 구애받지 않는 함수와 타입을 만드는 법을 맛보았는데요.

`any`라는 마법 키워드 덕분에 어떤 타입이든 처리할 수 있는 유연함을 경험하셨을 겁니다.

하지만 때로는 이런 '묻지도 따지지도 않는' 유연함이 오히려 문제가 될 수도 있습니다.

예를 들어, 두 값을 비교하거나, 특정 메서드를 호출해야 하는 로직을 제너릭 함수 안에 넣고 싶다면 어떨까요?

`any` 제약조건만으로는 타입 `T`가 그런 능력을 가졌는지 보장할 수 없습니다.

그래서 이번 시간에는 제너릭 코드의 **안정성**과 **표현력**을 한층 높여주는 **제약조건(Constraints)** 에 대해 더 깊이 알아볼 예정입니다.

`any`보다 훨씬 똑똑하고 강력한 제약조건들을 만나볼 준비, 되셨습니까?

## **왜 'any' 만으로는 부족할까요?**

1편에서 만든 `printSlice[T any]` 함수를 다시 떠올려 봅시다.

이 함수는 슬라이스 안의 요소를 그저 출력만 하기 때문에 요소의 타입 `T`가 어떤 능력을 가졌는지는 전혀 중요하지 않았습니다.

하지만 만약 우리가 두 개의 값을 받아서 **더 큰 값을 반환하는** 제너릭 함수 `Max`를 만들고 싶다고 가정해 볼까요?

자연스럽게 이런 코드를 생각할 수 있습니다.

```go
// 이런 코드는 작동하지 않습니다!
func Max[T any](a, b T) T {
    if a > b { // Error: a > b (operator > not defined on T)
        return a
    }
    return b
}
```

안타깝게도 이 코드는 컴파일되지 않습니다.

왜냐하면 `any` 제약조건은 타입 `T`가 `>` 연산자로 비교 가능하다는 것을 전혀 보장해주지 않기 때문입니다.

`T`가 만약 비교 불가능한 타입(예: 슬라이스나 맵)이라면 `a > b` 연산은 실패할 수밖에 없습니다.

이처럼 제너릭 함수나 타입 내부에서 **특정 연산이나 메서드를 사용**하려면, 타입 파라미터 `T`가 **해당 연산/메서드를 지원한다는 보장**이 필요합니다.

바로 이 '보장'을 해주는 것이 **제약조건**의 역할입니다!

## **제약조건 1: 비교가 필요할 땐 `comparable`**

Go에서 `==` 또는 `!=` 연산자를 사용하여 두 값을 비교할 수 있는 타입들이 있습니다.
(예: `int`, `float64`, `string`, `struct` 등). 하지만 슬라이스, 맵, 함수 등은 직접 비교할 수 없는데요.

만약 제너릭 코드 내에서 타입 `T`의 값들을 **비교해야 한다면**, `T`가 '비교 가능한 타입'임을 명시해주어야 합니다.

이때 사용하는 것이 바로 `comparable` 제약조건입니다!

`comparable`은 Go에 내장된 특별한 제약조건 인터페이스로, `==`와 `!=` 연산을 지원하는 모든 타입에 의해 만족됩니다.

가장 대표적인 활용 사례는 제너릭 **Set(집합)** 자료구조를 만들 때입니다.

Set은 중복된 값을 허용하지 않으므로, 값을 추가하기 전에 이미 존재하는 값인지 비교해야 하기 때문이죠.

```go
package main

import "fmt"

// T는 반드시 비교 가능해야 함을 명시합니다 ([T comparable])
type Set[T comparable] map[T]struct{} // 맵의 키는 comparable해야 하므로 제약조건 필수!

// 새로운 Set 생성 함수
func NewSet[T comparable]() Set[T] {
	return make(Set[T])
}

// Set에 요소 추가
func (s Set[T]) Add(value T) {
	s[value] = struct{}{} // 값이 이미 있어도 덮어쓰므로 중복은 자동 처리됨
}

// Set에 요소가 존재하는지 확인
func (s Set[T]) Contains(value T) bool {
	_, exists := s[value]
	return exists
}

// Set에서 요소 제거
func (s Set[T]) Remove(value T) {
	delete(s, value)
}

func main() {
	// 문자열 Set
	stringSet := NewSet[string]()
	stringSet.Add("apple")
	stringSet.Add("banana")
	stringSet.Add("apple") // 중복 추가 시도 (무시됨)

	fmt.Println("Set contains apple?", stringSet.Contains("apple"))   // true
	fmt.Println("Set contains grape?", stringSet.Contains("grape")) // false

	stringSet.Remove("banana")
	fmt.Println("Set contains banana after removal?", stringSet.Contains("banana")) // false

	// 정수 Set도 문제 없습니다!
	intSet := NewSet[int]()
	intSet.Add(10)
	intSet.Add(20)
	fmt.Println("Int set contains 10?", intSet.Contains(10)) // true
}
```

`Set[T comparable]` 처럼 `comparable` 제약조건을 명시했기 때문에, 우리는 `T` 타입의 값을 `map`의 키로 사용하고 `delete` 함수를 호출하는 등의 작업을 안전하게 수행할 수 있습니다.

만약 `any`를 사용했다면 컴파일 에러가 발생했을 겁니다.

## **제약조건 2: 특정 메서드가 필요할 땐 `interface`**

때로는 단순히 비교 가능 여부를 넘어, 타입 `T`가 **특정 메서드**를 가지고 있기를 요구해야 할 때가 있습니다.

예를 들어, 어떤 타입이든 받아서 그 타입을 **문자열로 표현하는** 메서드(`String() string`)를 호출하고 싶다고 해봅시다.

이럴 때는 우리가 잘 아는 Go의 **인터페이스(interface)** 를 제약조건으로 사용할 수 있습니다!

인터페이스는 특정 메서드 시그니처의 집합을 정의하므로, 이를 제약조건으로 사용하면 타입 `T`가 해당 인터페이스의 모든 메서드를 구현했음을 보장받을 수 있습니다.

표준 라이브러리의 `fmt.Stringer` 인터페이스를 예로 들어볼까요? `Stringer`는 `String() string` 메서드 하나만 요구하는 간단한 인터페이스입니다.

```go
package main

import (
	"fmt"
	"strconv"
)

// fmt.Stringer 인터페이스를 제약조건으로 사용합니다.
// 이제 T는 반드시 String() string 메서드를 가져야 합니다.
func stringifyThings[T fmt.Stringer](items []T) []string {
	result := make([]string, 0, len(items))
	for _, item := range items {
		result = append(result, item.String()) // item.String() 호출이 보장됩니다!
	}
	return result
}

// 사용자 정의 타입
type MyInt int

// MyInt 타입이 fmt.Stringer 인터페이스를 구현하도록 메서드를 추가합니다.
func (mi MyInt) String() string {
	return "MyInt(" + strconv.Itoa(int(mi)) + ")"
}

type Person struct {
	Name string
	Age  int
}

// Person 타입도 fmt.Stringer 인터페이스를 구현합니다.
func (p Person) String() string {
	return p.Name + " is " + strconv.Itoa(p.Age) + " years old"
}

func main() {
	myInts := []MyInt{1, 2, 3}
	// MyInt는 String() 메서드가 있으므로 stringifyThings 함수에 전달 가능합니다.
	stringifiedInts := stringifyThings(myInts)
	fmt.Println(stringifiedInts) // [MyInt(1) MyInt(2) MyInt(3)]

	people := []Person{
		{Name: "Alice", Age: 30},
		{Name: "Bob", Age: 25},
	}
	// Person도 String() 메서드가 있으므로 전달 가능합니다.
	stringifiedPeople := stringifyThings(people)
	fmt.Println(stringifiedPeople) // [Alice is 30 years old Bob is 25 years old]

	// ints := []int{4, 5, 6}
	// stringifyThings(ints) // 컴파일 에러! int는 String() string 메서드가 없습니다.
}
```

`stringifyThings[T fmt.Stringer]` 와 같이 제약조건을 명시함으로써, 함수 본문에서 `item.String()` 호출이 **컴파일 시점**에 안전하다는 것을 보장받습니다.

만약 `String()` 메서드가 없는 타입을 전달하려고 하면 즉시 컴파일 에러가 발생하여 실수를 방지할 수 있습니다.

## **제약조건 3: 특정 타입들의 '집합'을 원할 땐 유니온(`|`)**

지금까지 본 `comparable`이나 인터페이스 제약조건은 주로 타입의 '능력'(비교 가능, 특정 메서드 보유)을 제한했습니다.

그런데 만약 '능력'이 아니라, **허용되는 타입 자체를 몇 가지로 딱 정하고 싶다면** 어떻게 해야 할까요?

예를 들어, '이 함수는 `int`나 `float64` 타입만 받을 수 있어!' 라고 명시하고 싶을 때 말입니다.

이때 사용하는 것이 바로 **유니온(Union)** 입니다! 파이프 기호 `|` 를 사용하여 인터페이스 정의 내부에 허용할 타입들을 직접 나열하는 방식입니다.

```go
package main

import "fmt"

// Number 제약조건 인터페이스 정의
// int, int32, int64, float32, float64 타입만 허용합니다.
type Number interface {
	int | int32 | int64 | float32 | float64
}

// T는 Number 인터페이스에 정의된 타입 중 하나여야 합니다.
func AddNumbers[T Number](a, b T) T {
	// T가 숫자 타입임이 보장되므로 + 연산이 안전합니다.
	return a + b
}

// Max 함수도 이제 안전하게 만들 수 있습니다!
func Max[T Number](a, b T) T {
	// T가 숫자 타입임이 보장되므로 > 연산이 안전합니다.
	if a > b {
		return a
	}
	return b
}

func main() {
	fmt.Println("Adding ints:", AddNumbers(5, 10))       // 15
	fmt.Println("Adding floats:", AddNumbers(3.14, 2.71)) // 5.85

	// fmt.Println(AddNumbers("hello", "world")) // 컴파일 에러! string은 Number 제약조건을 만족하지 못합니다.

	fmt.Println("Max int:", Max(100, 50))       // 100
	fmt.Println("Max float:", Max(1.618, 3.141)) // 3.141
}
```

`type Number interface { int | ... | float64 }` 처럼 정의된 `Number` 제약조건은, 타입 파라미터 `T`가 반드시 명시된 숫자 타입 중 하나여야 함을 강제합니다.

덕분에 `AddNumbers`나 `Max` 함수 내부에서 `+` 나 `>` 같은 숫자 연산을 안심하고 사용할 수 있게 되었습니다.

`string` 같은 엉뚱한 타입을 넘기려고 하면 컴파일러가 바로 잡아줍니다!

## **잠깐! 유니온과 사용자 정의 타입**

그런데 위 `Max` 함수에 만약 `type MyInt int` 처럼 우리가 직접 정의한 타입을 넘기면 어떻게 될까요?

```go
type MyInt int
var a MyInt = 5
var b MyInt = 10
// Max(a, b) // 컴파일 에러! MyInt는 Number 인터페이스에 명시되지 않았습니다.
```

에러가 발생합니다!

`MyInt`는 비록 내부적으로 `int`와 같지만, Go에서는 `int`와 **다른 타입**으로 취급되기 때문입니다.

`Number` 인터페이스에는 `MyInt`가 명시적으로 포함되어 있지 않으므로 제약조건을 만족하지 못하는 것이죠.

이 문제를 해결하려면 어떻게 해야 할까요? '내부적으로(underlying type) 특정 타입인 모든 타입을 허용' 해주는 방법이 필요합니다.

## **제약조건 4: 내부 타입(Underlying Type)까지 고려할 땐 근사 토큰(`~`)**

바로 이럴 때 등장하는 것이 물결표시, **근사(Approximate) 토큰 `~`** 입니다!

제약조건 인터페이스 내부의 타입 앞에 `~`를 붙이면, 해당 타입뿐만 아니라 **그 타입을 내부 타입(underlying type)으로 가지는 모든 사용자 정의 타입**까지 허용하게 됩니다.

말로만 들으면 조금 헷갈리니, 위 `Number` 제약조건을 `~`를 사용해서 개선해 보겠습니다.

```go
package main

import (
	"fmt"
	"golang.org/x/exp/constraints" // Go 1.18+ 에서는 constraints 패키지 사용 가능
)

// 타입 앞에 ~를 붙여 내부 타입 기반 매칭을 허용합니다.
// 이제 int 뿐만 아니라 type MyInt int 와 같은 타입도 포함됩니다.
type ApproxNumber interface {
	~int | ~int32 | ~int64 | ~float32 | ~float64
}

// 더 나아가, Go 표준 라이브러리는 이미 이런 숫자 타입을 위한 제약조건을 제공합니다!
// constraints.Integer 와 constraints.Float 를 | 로 묶어 사용해봅시다.
type StandardNumber interface {
	constraints.Integer | constraints.Float
}

func MaxWithApprox[T ApproxNumber](a, b T) T {
	if a > b {
		return a
	}
	return b
}

func MaxWithStandard[T StandardNumber](a, b T) T {
	if a > b {
		return a
	}
	return b
}

// 사용자 정의 타입
type MyInt int
type MyFloat float64

func main() {
	var a MyInt = 5
	var b MyInt = 10
	fmt.Println("Max MyInt (Approx):", MaxWithApprox(a, b)) // 10 (이제 작동합니다!)
	fmt.Println("Max MyInt (Standard):", MaxWithStandard(a, b)) // 10 (표준 제약조건으로도 작동합니다!)

	var x MyFloat = 3.14
	var y MyFloat = 1.618
	fmt.Println("Max MyFloat (Approx):", MaxWithApprox(x, y)) // 3.14
	fmt.Println("Max MyFloat (Standard):", MaxWithStandard(x, y)) // 3.14

    // 정렬 가능한 모든 타입을 위한 제약조건: cmp.Ordered (Go 1.21+) 또는 constraints.Ordered
    // import "cmp" // Go 1.21+
    // func MaxOrdered[T cmp.Ordered](a, b T) T { ... }

    // import "golang.org/x/exp/constraints" // Go 1.18 ~ 1.20
    // func MaxOrdered[T constraints.Ordered](a, b T) T { ... }
}

```

`~int`는 `int` 자체뿐만 아니라 `type MyInt int`, `type Score int` 등 `int`를 기반으로 정의된 모든 타입을 포함합니다.

덕분에 `MyInt`나 `MyFloat` 같은 사용자 정의 타입도 `Max` 함수에 문제없이 전달할 수 있게 되었습니다!

## **표준 라이브러리의 제약조건 활용하기**

사실 숫자 타입이나 정렬 가능한 타입처럼 자주 사용되는 제약조건들은 우리가 직접 유니온과 `~`를 써서 정의할 필요 없이 Go 표준 라이브러리에서 미리 정의해두었습니다.

*   **`golang.org/x/exp/constraints` 패키지 (Go 1.18 ~ 1.20):**
    *   `constraints.Integer`: 모든 정수 타입 (`~int`, `~int8`, ... `~uintptr`)
    *   `constraints.Float`: 모든 부동소수점 타입 (`~float32`, `~float64`)
    *   `constraints.Complex`: 모든 복소수 타입 (`~complex64`, `~complex128`)
    *   `constraints.Ordered`: 정렬 가능한 모든 타입 (`Integer` | `Float` | `~string`)
*   **`cmp` 패키지 (Go 1.21 이상):**
    *   `cmp.Ordered`: `constraints.Ordered`와 동일한 역할

가급적이면 직접 제약조건을 정의하기보다 표준 라이브러리에서 제공하는 것을 활용하는 것이 좋습니다.

코드가 간결해지고 다른 개발자들도 이해하기 쉬워지기 때문입니다.

## **정리 및 다음 이야기 예고**

와! 오늘 정말 많은 제약조건들을 배웠습니다. 한번 정리해 볼까요?

*   `any`: 모든 타입을 허용 (가장 느슨함)
*   `comparable`: `==`, `!=` 비교 가능한 타입만 허용
*   `인터페이스 타입` (예: `fmt.Stringer`): 해당 인터페이스를 구현하는 타입만 허용
*   `타입1 | 타입2`: 명시된 타입들만 허용 (Union)
*   `~타입`: 해당 타입 및 그 타입을 내부 타입으로 가지는 모든 타입을 허용 (Approximate)
*   표준 라이브러리 제약조건 (예: `constraints.Integer`, `cmp.Ordered`): 자주 사용되는 제약조건 모음

이제 여러분은 제너릭 함수나 타입을 정의할 때, 타입 파라미터 `T`가 가져야 할 능력을 훨씬 더 명확하고 안전하게 명시할 수 있게 되었습니다!

제약조건은 제너릭 코드의 품질을 높이는 핵심적인 요소입니다.

다음 시간에는 드디어 제너릭의 '마법'이 실제로 어떻게 일어나는지 그 내부를 들여다볼 차례입니다.

컴파일러가 타입 파라미터 `T`를 실제 타입으로 어떻게 알아서 바꿔치기하는지(**인스턴스화**), 그리고 우리가 타입을 명시하지 않아도 어떻게 알아서 척척 타입을 맞추는지(**타입 추론**) 그 비밀을 파헤쳐 보겠습니다!

그럼, 3편에서 뵙겠습니다.