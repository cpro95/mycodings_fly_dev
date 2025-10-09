---
slug: 2025-04-27-go-generics-tutorial-1-basics
title: (Go 언어 날개 달기) 제너릭(Generics) 완전 정복 1편 - 기본 개념부터 차근차근!
date: 2025-04-27 08:50:56.139000+00:00
summary: 제너릭이라는 도구가 왜 필요하게 되었는지, 그리고 가장 기본적으로 어떻게 사용하는지 함께 알아보는 시간을 갖겠습니다.
tags: ["Go", "Golang", "제너릭", "Generics", "Go 1.18", "타입 파라미터", "코드 재사용"]
contributors: []
draft: false
---

안녕하세요!

Go 언어는 그 단순함과 강력함으로 많은 개발자에게 사랑받는 언어인데요.

특히 2022년 3월, Go 1.18 버전이 등장하면서 Go의 생태계를 뒤흔들 만한 아주 중요한 기능이 추가되었습니다. 

바로 많은 분이 기다려온 **제너릭(Generics)** 입니다!

"제너릭? 그게 뭐지? 이름부터 뭔가 어려워 보이는데..." 라고 생각하실 수도 있는데요.

하지만 걱정은 잠시 접어두셔도 좋습니다!

이 시리즈를 통해 Go 언어를 처음 접하시는 분들도 제너릭의 세계를 쉽고 재미있게 여행하실 수 있도록 제가 길잡이가 되어 드릴게요.

오늘은 그 첫 번째 여정으로, 제너릭이라는 도구가 왜 필요하게 되었는지, 그리고 가장 기본적으로 어떻게 사용하는지 함께 알아보는 시간을 갖겠습니다.

자, 준비되셨으면 출발해 볼까요?

## **제너릭, 왜 필요하게 된 걸까요?**

제너릭이 없던 시절의 Go 코드를 잠시 떠올려 봅시다.

만약 우리가 정수(`int`) 값들이 담긴 슬라이스와 문자열(`string`) 값들이 담긴 슬라이스의 내용을 하나씩 출력하는 함수를 만들어야 한다면, 아마도 아래처럼 각 타입에 맞는 함수를 별도로 만들어야 했을 겁니다.

```go
package main

import "fmt"

// Function to print each element of an integer slice
func printIntSlice(slice []int) {
	fmt.Println("--- Printing Integer Slice ---")
	for _, v := range slice {
		fmt.Println(v)
	}
}

// Function to print each element of a string slice
func printStringSlice(slice []string) {
	fmt.Println("--- Printing String Slice ---")
	for _, v := range slice {
		fmt.Println(v)
	}
}

func main() {
	intSlice := []int{10, 20, 30}
	stringSlice := []string{"apple", "banana", "cherry"}

	printIntSlice(intSlice)
	printStringSlice(stringSlice)
}
```

어떤가요?

두 함수는 매개변수로 받는 슬라이스의 요소 타입(`int` 와 `string`)만 다를 뿐, 내부에서 하는 일(요소를 하나씩 반복하며 출력하는 것)은 완전히 똑같습니다.

만약 여기에 `float64` 타입 슬라이스, `bool` 타입 슬라이스를 출력하는 기능까지 필요하다면...?

네, 비슷한 코드를 계속 복사하고 붙여넣어야 하는 상황이 발생하는 것이죠.

이렇게 타입만 다르고 로직은 동일한 코드를 반복해서 작성하는 것은 여러모로 비효율적입니다.

1.  **코드 중복:** 똑같은 코드가 여러 곳에 흩어져 있으면 전체 코드 길이가 늘어납니다.
2.  **유지보수 어려움:** 만약 출력 방식에 변경이 필요하다면, 관련된 모든 함수를 찾아서 일일이 수정해야 합니다. 실수가 발생할 가능성도 커지죠.
3.  **확장성 저하:** 새로운 타입을 지원해야 할 때마다 비슷한 함수를 또 만들어야 합니다.

바로 이런 '코드 중복'과 그로 인한 문제점들을 해결하기 위해 **제너릭**이 등장했습니다!

제너릭을 사용하면, 특정 타입에 묶이지 않고 **다양한 타입을 아우를 수 있는 유연한 코드를 단 한 번만 작성**할 수 있습니다.

마치 여러 가지 모양의 과자를 찍어낼 수 있는 '만능 과자 틀'과 같다고 생각하면 이해가 쉬울 겁니다.

## **Go 제너릭의 핵심 문법: 타입 파라미터 (Type Parameters)**

Go에서 제너릭을 구현하는 핵심은 바로 **타입 파라미터(Type Parameter)** 입니다.

함수나 타입을 정의할 때, 실제 사용될 타입을 확정하지 않고 '이 자리에는 어떤 타입이든 올 수 있어!'라고 알려주는 일종의 **자리 표시자(placeholder)** 인데요.

가장 기본적인 형태는 대괄호 `[]` 와 함께 사용됩니다.

*   **제너릭 함수 정의:**
    ```go
    // FunctionName 뒤 대괄호 안에 타입 파라미터 T를 선언합니다.
    func FunctionName[T any](parameter T) {
        // 함수 내부에서 T를 실제 타입처럼 사용할 수 있습니다.
    }
    ```
*   **제너릭 타입 정의:**
    ```go
    // TypeName 뒤 대괄호 안에 타입 파라미터 T를 선언합니다.
    type TypeName[T any] struct {
        fieldName T // 필드의 타입 등으로 T를 사용할 수 있습니다.
    }
    ```

여기서 대괄호 `[]` 안에 있는 `T`가 바로 **타입 파라미터**입니다.

꼭 `T`라는 이름을 써야 하는 것은 아니고, `V`, `K`, `Element` 등 원하는 이름을 붙일 수 있습니다.

중요한 것은 이 `T`가 '나중에 실제 타입으로 채워질 변수 같은 것'이라고 이해하는 것입니다.

그리고 `T` 옆에 붙은 `any`는 **제약조건(Constraint)** 이라고 부르는데요.

`any`는 Go 1.18부터 `interface{}` (빈 인터페이스)를 대신하는 새로운 키워드입니다.

이름 그대로 **"어떤 타입이든(any type) 제약 없이 허용한다"** 라는 가장 넓은 범위의 제약조건이죠.

일단은 '타입 파라미터 T는 아무 타입이나 와도 괜찮아!'라는 의미로 받아들이시면 됩니다.

이 제약조건에 대해서는 다음 시간에 더 깊이 파고들 예정이니 기대해 주십시오.

## **첫 번째 제너릭 함수: 타입 걱정 없는 출력 함수 만들기**

자, 그럼 이론은 잠시 접어두고, 아까 봤던 슬라이스 출력 함수를 제너릭 버전으로 직접 만들어 볼까요?

```go
package main

import "fmt"

// 어떤 타입(T)의 슬라이스든 받을 수 있는 제너릭 함수를 정의합니다.
// [T any]는 'T'라는 이름의 타입 파라미터를 선언하고, 어떤 타입이든 허용(any)한다는 뜻입니다.
func printSlice[T any](inputSlice []T) {
	fmt.Println("--- Printing Slice Contents ---")
	for _, element := range inputSlice {
		fmt.Println(element)
	}
}

func main() {
	intSlice := []int{1, 2, 3}
	stringSlice := []string{"hello", "generics", "world"}
	floatSlice := []float64{3.14, 2.71, 1.618}

	// 이제 printSlice 함수 하나로 다양한 타입의 슬라이스를 처리할 수 있습니다!
	printSlice(intSlice)     // 컴파일러가 T를 int로 추론합니다.
	printSlice(stringSlice)  // 컴파일러가 T를 string으로 추론합니다.
	printSlice(floatSlice)   // 컴파일러가 T를 float64로 추론합니다.
}

/* 출력 결과:
--- Printing Slice Contents ---
1
2
3
--- Printing Slice Contents ---
hello
generics
world
--- Printing Slice Contents ---
3.14
2.71
1.618
*/
```

놀랍지 않습니까? `printIntSlice`, `printStringSlice` 등 각 타입별 함수를 만들 필요 없이, 단 하나의 `printSlice[T any]` 함수로 모든 종류의 슬라이스를 처리할 수 있게 되었습니다!

코드가 훨씬 간결해졌고, 새로운 타입의 슬라이스를 출력해야 할 때도 이 함수를 그대로 사용하면 되니 재사용성도 극대화되었습니다.

여기서 한 가지 더 주목할 점은, 우리가 함수를 호출할 때 `printSlice[int](intSlice)` 처럼 `T`가 무슨 타입인지 명시적으로 알려주지 않았다는 것인데요.

Go 컴파일러는 함수에 전달된 `intSlice` 변수의 타입이 `[]int`라는 것을 보고, '아하! 여기서 T는 `int` 타입이겠구나!' 하고 스스로 똑똑하게 **추론(Type Inference)** 해줍니다.

정말 편리한 기능이죠?

이 타입 추론 덕분에 많은 경우 우리는 타입 파라미터를 생략하고 코드를 작성할 수 있습니다.
(물론, 타입 추론이 항상 가능한 것은 아니며, 이에 대해서는 3편에서 자세히 다룰 예정입니다.)

## **첫 번째 제너릭 타입: 모든 것을 담는 스택(Stack) 만들기**

이번에는 제너릭 **타입**을 정의해 볼까요? 자료구조의 고전이라 할 수 있는 스택(Stack)을 제너릭으로 구현해 보겠습니다.

스택은 마지막에 넣은 데이터가 가장 먼저 나오는 '후입선출(Last-In, First-Out, LIFO)' 구조를 가지는데요.

어떤 타입의 데이터든 담을 수 있는 만능 스택을 만들어 봅시다!

```go
package main

import "fmt"

// T 타입의 요소를 저장하는 제너릭 스택 타입을 선언합니다.
// 내부적으로 T 타입 요소로 구성된 슬라이스를 사용합니다.
type Stack[T any] []T

// 새로운 빈 스택을 생성하는 제너릭 함수입니다. (생성자 역할)
// T 타입의 빈 스택에 대한 포인터를 반환합니다.
func NewStack[T any]() *Stack[T] {
	s := make(Stack[T], 0) // T 타입의 빈 슬라이스로 스택을 초기화합니다.
	return &s
}

// 스택에 값을 추가하는 Push 메서드입니다.
// 메서드의 리시버(s *Stack[T])에도 타입 파라미터 T를 명시해야 합니다.
func (s *Stack[T]) Push(value T) {
	*s = append(*s, value) // 포인터 리시버이므로 *s를 사용해 슬라이스에 직접 추가합니다.
}

// 스택에서 값을 제거하고 반환하는 Pop 메서드입니다.
func (s *Stack[T]) Pop() (T, bool) { // 값과 성공 여부를 함께 반환하도록 수정
	if len(*s) == 0 {
		var zeroValue T // T 타입의 제로 값 (int면 0, string이면 "", 포인터면 nil 등)
		return zeroValue, false // 스택이 비었음을 알립니다.
	}
	index := len(*s) - 1    // 마지막 요소의 인덱스
	value := (*s)[index]    // 마지막 요소 가져오기
	*s = (*s)[:index]       // 마지막 요소를 제외한 슬라이스로 업데이트
	return value, true      // 가져온 값과 성공 여부 반환
}

// 스택이 비어있는지 확인하는 IsEmpty 메서드입니다.
func (s *Stack[T]) IsEmpty() bool {
	return len(*s) == 0
}

func main() {
	// 문자열을 저장하는 스택을 만들어 봅시다.
	// NewStack은 인수가 없어서 T를 추론할 수 없으므로, [string]으로 타입을 명시해야 합니다!
	stringStack := NewStack[string]()
	stringStack.Push("Go")
	stringStack.Push("is")
	stringStack.Push("fun!")

	fmt.Println("--- String Stack Operations ---")
	for !stringStack.IsEmpty() {
		value, ok := stringStack.Pop()
		if ok {
			fmt.Println("Popped:", value)
		}
	}

	// 이번에는 정수를 저장하는 스택입니다.
	intStack := NewStack[int]() // 마찬가지로 [int] 명시
	intStack.Push(100)
	intStack.Push(200)

	fmt.Println("\n--- Integer Stack Operations ---")
	poppedVal, ok := intStack.Pop()
	if ok {
		fmt.Println("Popped:", poppedVal)
	}
	fmt.Println("Is intStack empty?", intStack.IsEmpty())
	intStack.Pop() // 마지막 남은 100 제거
	fmt.Println("Is intStack empty after one more pop?", intStack.IsEmpty())
}

/* 출력 결과:
--- String Stack Operations ---
Popped: fun!
Popped: is
Popped: Go

--- Integer Stack Operations ---
Popped: 200
Is intStack empty? false
Is intStack empty after one more pop? true
*/
```

`Stack[T any]`라는 제너릭 타입을 정의함으로써,

이제 우리는 `string`을 담는 스택(`Stack[string]`)이든, `int`를 담는 스택(`Stack[int]`)이든,

심지어 우리가 직접 만든 복잡한 구조체(`struct`)를 담는 스택이든 필요에 따라 아주 쉽게 만들어 사용할 수 있게 되었습니다!

여기서 주의 깊게 볼 점 두 가지가 있습니다.

1.  **메서드 리시버:** `Push`, `Pop`, `IsEmpty` 메서드를 정의할 때, 리시버 부분에도 `(s *Stack[T])`처럼 타입 파라미터 `T`를 반드시 명시해주어야 합니다. 그래야 이 메서드들이 어떤 `Stack[T]` 타입에 속하는지 알 수 있습니다.
2.  **명시적 타입 인수:** `NewStack[string]()`이나 `NewStack[int]()`처럼, `NewStack` 함수를 호출할 때 대괄호와 함께 타입을 명시적으로 지정해주었는데요. `NewStack` 함수는 받는 인수가 없기 때문에 컴파일러가 `T`가 무엇이 되어야 할지 추론할 단서가 전혀 없습니다. 이처럼 타입 추론이 불가능한 경우에는 우리가 직접 `T`가 될 타입을 알려주어야 하는 것입니다.

## **정리하고 다음으로!**

자, 오늘 우리는 Go 제너릭의 세계에 첫발을 내디뎠습니다.

제너릭이 왜 필요한지 코드 중복 문제를 통해 체감했고, 타입 파라미터 `[T any]`를 사용하여 가장 기본적인 제너릭 함수와 타입을 만드는 방법을 함께 실습해 보았습니다.

오늘 배운 내용을 간단히 요약해 볼까요?

*   제너릭은 **타입에 구애받지 않는** 코드를 작성하게 해주어 **코드 재사용성**을 극대화합니다.
*   함수나 타입 이름 뒤에 `[T]`와 같이 **타입 파라미터**를 선언하여 제너릭을 정의합니다.
*   `any`는 **어떤 타입이든 허용**하는 가장 기본적인 **제약조건**입니다.
*   제너릭 타입에 대한 메서드를 정의할 때는 `(receiver *TypeName[T])`처럼 **리시버에도 타입 파라미터를 명시**해야 합니다.
*   Go 컴파일러는 **타입 추론**을 통해 타입 파라미터를 알아서 결정하는 경우가 많지만, 추론이 불가능할 때는 `FuncName[ConcreteType](...)`처럼 **명시적으로 타입을 지정**해주어야 합니다.

제너릭의 강력함이 조금씩 느껴지시나요? 하지만 이제 시작일 뿐입니다!

다음 시간에는 `any`라는 느슨한 제약조건을 넘어, 좀 더 **구체적이고 강력한 제약조건**들을 사용하는 방법을 알아볼 것입니다.

예를 들어, '숫자 타입만 받겠다'거나 '비교 가능한 타입만 받겠다', 또는 '특정 메서드를 가진 타입만 받겠다' 와 같이 말이죠.

그럼. 다음 시간에 뵐게요!