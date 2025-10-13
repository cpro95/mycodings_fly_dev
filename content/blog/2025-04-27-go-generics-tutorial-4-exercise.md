---
slug: 2025-04-27-go-generics-tutorial-4-exercise
title: (Go 언어 날개 달기) 제너릭(Generics) 완전 정복 4편 - 실전 활용과 주의사항
date: 2025-04-27 09:10:03.154000+00:00
summary: 실제 코드에서 제너릭을 활용할 때 마주칠 수 있는 몇 가지 흥미로운 지점들과, 더 깊은 이해를 위한 개념, 그리고 제너릭을 사용할 때 염두에 두어야 할 점들을 살펴보겠습니다.
tags: ["Go", "Golang", "Generics", "제너릭", "포인터 리시버", "Core Type", "제너릭 주의사항", "Go 1.21"]
contributors: []
draft: false
---

안녕하세요!

지금까지 우리는 Go 제너릭의 기본 문법부터 제약조건, 그리고 컴파일러의 마법 같은 인스턴스화와 타입 추론까지 많은 것을 배웠는데요.

이제 이론을 넘어 실제 코드에서 제너릭을 활용할 때 마주칠 수 있는 몇 가지 흥미로운 지점들과, 더 깊은 이해를 위한 개념, 그리고 제너릭을 사용할 때 염두에 두어야 할 점들을 살펴보겠습니다.

마지막까지 집중해서 함께 완주해 볼까요?

## **실전 팁 1: 포인터 리시버와 제너릭, 조금 까다로운 만남**

Go에서는 메서드를 정의할 때 값 리시버(`func (t MyType) Method()`)와 포인터 리시버(`func (t *MyType) Method()`)를 사용할 수 있다는 것을 기억하실 겁니다.

특히 구조체의 필드 값을 변경하는 메서드는 보통 포인터 리시버로 정의하는데요.

이것이 제너릭 제약조건과 만날 때 약간의 주의가 필요합니다.

2편에서 `fmt.Stringer` 인터페이스를 제약조건으로 사용했던 예를 떠올려 봅시다.

만약 어떤 타입 `T`가 **포인터 리시버**로 `Set(string)` 메서드를 구현하고 있다고 가정해 볼까요?

```go
package main

import (
	"fmt"
	"strconv"
)

// 값을 설정하는 Set 메서드를 요구하는 인터페이스
type Setter interface {
	Set(string)
}

// SettableInt 타입 정의
type SettableInt int

// Set 메서드는 *SettableInt 타입, 즉 포인터 리시버로 구현되었습니다!
func (si *SettableInt) Set(s string) {
	i, _ := strconv.Atoi(s)
	*si = SettableInt(i)
}

// T는 Setter 인터페이스를 만족해야 합니다.
func SetValueFromString[T Setter](value T, s string) {
	value.Set(s)
}

func main() {
	var myInt SettableInt = 0

	// SetValueFromString(myInt, "100")
	// 컴파일 에러! SettableInt does not implement Setter (Set method has pointer receiver)
	// SettableInt 타입 자체는 Set(string) 메서드를 가지고 있지 않습니다. *SettableInt가 가지고 있죠!

	// 그럼 포인터 타입을 타입 인수로 넘겨주면 될까요?
	// SetValueFromString[*SettableInt](&myInt, "100") // 이 코드는 컴파일은 되지만... 뭔가 이상합니다.

	// 아래에서 더 나은 방법을 알아봅시다.
	fmt.Println("Initial value:", myInt) // 만약 위 코드를 실행했다면? 여전히 0일 수 있습니다!
}

```

위 코드에서 `SetValueFromString(myInt, "100")` 호출은 컴파일 에러가 납니다.

왜냐하면 `Setter` 인터페이스를 구현한 것은 `SettableInt` 타입 자체가 아니라 `*SettableInt` 타입이기 때문입니다.

그래서 `SetValueFromString[*SettableInt](&myInt, "100")` 처럼 포인터 타입을 타입 인수로 명시적으로 넘겨주면 컴파일은 통과합니다.

하지만 이 경우 `SetValueFromString` 함수 내부의 `value`는 `*SettableInt` 타입이 되는데, **`value` 자체가 `nil`일 가능성**을 고려해야 하는 등 추가적인 복잡성이 생길 수 있고, 의도와 다르게 동작할 수도 있습니다.

특히 제너릭 함수 내부에서 `make([]T, ...)` 와 같이 제로 값을 생성해야 할 때 `T`가 포인터 타입이면 `nil` 슬라이스가 만들어져 바로 `panic`이 발생할 수 있습니다!
(3편의 공식 문서 예제 설명 부분 참조)

## **포인터 리시버 문제를 해결하는 더 나은 접근법: 두 개의 타입 파라미터**

이런 상황을 더 안전하고 명확하게 처리하는 일반적인 패턴은 **두 개의 타입 파라미터**를 사용하는 것입니다.

하나는 기본 타입(`T`)을 위한 것이고, 다른 하나는 그 기본 타입의 포인터 타입이면서 제약조건을 만족하는 타입(`PT`)을 위한 것입니다.

```go
package main

import (
	"fmt"
	"strconv"
)

// SettableInt 타입 (변경 없음)
type SettableInt int

func (si *SettableInt) Set(s string) {
	i, _ := strconv.Atoi(s)
	*si = SettableInt(i)
}

// PT는 T의 포인터 타입이어야 하고, Set(string) 메서드를 가져야 함을 명시하는 제약조건 인터페이스
// 인터페이스 내부에 *T 를 포함시켜 PT가 *T 타입임을 강제합니다.
type PointerSetter[T any] interface {
	Set(string)
	*T // PT must be a pointer to T
}

// T는 기본 타입, PT는 T의 포인터 타입이자 Setter 역할을 하는 타입 파라미터입니다.
// 반환값은 기본 타입 T의 슬라이스라고 가정해봅시다.
func CreateAndSet[T any, PT PointerSetter[T]](s string) T {
	var result T // T 타입의 제로 값을 생성합니다 (포인터가 아님!)
	p := PT(&result) // result의 주소를 가져와 PT 타입 포인터로 만듭니다.
	p.Set(s)         // PT는 Set 메서드를 가지고 있으므로 호출 가능합니다.
	return result
}

func main() {
	// 타입 인수를 두 개 모두 명시적으로 전달합니다.
	createdInt := CreateAndSet[SettableInt, *SettableInt]("123")
	fmt.Printf("Created int: %d, Type: %T\n", createdInt, createdInt) // Created int: 123, Type: main.SettableInt

	// 여기서 마법! 제약조건 타입 추론 덕분에 PT(*SettableInt)는 생략 가능할 수 있습니다!
	// 컴파일러는 T가 SettableInt이고, PointerSetter[SettableInt] 제약조건을 통해
	// PT가 *SettableInt 여야 함을 추론할 수 있습니다. (3편에서 언급)
	createdIntSimplified := CreateAndSet[SettableInt]("456")
	fmt.Printf("Created int (simplified): %d, Type: %T\n", createdIntSimplified, createdIntSimplified) // Created int (simplified): 456, Type: main.SettableInt
}
```

이 패턴을 사용하면, 제너릭 함수 내부에서는 안전하게 기본 타입 `T`의 값을 생성하고 다룰 수 있으며, 메서드 호출이 필요할 때만 명시적으로 포인터 타입 `PT`로 변환하여 사용하므로 `nil` 포인터 걱정을 덜 수 있습니다.

더욱 흥미로운 점은, 3편에서 잠시 언급했던 **제약조건 타입 추론** 덕분에 `CreateAndSet[SettableInt]("456")` 처럼 두 번째 타입 인수(`*SettableInt`)를 생략해도 컴파일러가 알아서 추론해주는 경우가 많다는 것입니다!

제약조건 `PointerSetter[T]` 자체가 `PT`가 `*T` 타입이어야 한다는 정보를 담고 있기 때문이죠. 정말 똑똑하지 않습니까? 😉

## **내부 개념 엿보기: 코어 타입 (Core Type)**

제너릭의 내부 동작과 관련하여 알아두면 좋은 심화 개념 중 하나로 **코어 타입(Core Type)** 이 있습니다.

모든 타입 파라미터 제약조건이 코어 타입을 가지는 것은 아니지만, 만약 가진다면 몇 가지 중요한 동작에 영향을 미칩니다.

코어 타입의 정확한 정의는 다소 복잡하지만, 간단히 말해 **제약조건이 나타내는 타입들의 '구조적인 본질'** 이라고 생각할 수 있습니다.

예를 들어, `interface{ ~[]int }` 제약조건의 코어 타입은 `[]int` 이고, `interface{ ~int | ~string }` 처럼 구조가 다른 타입들의 유니온은 코어 타입을 갖지 못합니다.

코어 타입이 중요한 이유는 다음과 같습니다.

1.  **`for range` 사용 가능 여부:** 타입 파라미터 `T`에 대해 `for range` 루프를 사용하려면, `T`의 제약조건이 **반드시 코어 타입**을 가져야 합니다.
    ```go
    // 제약조건 I는 코어 타입 []int를 가집니다. -> OK
    type I1 interface{ ~[]int }
    func Loop1[T I1](x T) { for range x { /* ... */ } }

    // 제약조건 I2는 코어 타입이 없습니다. -> Compile Error!
    type I2 interface{ []int | []string }
    // func Loop2[T I2](x T) { for range x { /* ... */ } } // cannot range over x (T has no core type)
    ```
2.  **컴포지트 리터럴(Composite Literal) 생성 가능 여부:** `T{...}` 와 같이 타입 파라미터를 이용해 리터럴 값을 생성하려면, 해당 제약조건이 **코어 타입**을 가져야 합니다.
    ```go
    // 제약조건 C1은 코어 타입 struct{ F int }를 가집니다. -> OK
    type C1 interface{ struct{ F int } }
    func Create1[T C1]() T { return T{F: 1} }

    // 제약조건 C2는 태그 유무로 인해 코어 타입이 없습니다. -> Compile Error!
    type C2 interface{ struct{ F int } | struct{ F int `tag` } }
    // func Create2[T C2]() T { return T{F: 1} } // cannot use composite literal type T
    ```
3.  **제약조건 타입 추론:** 3편에서 살펴본 제약조건 타입 추론이 작동하기 위한 **필수 조건** 중 하나가 바로 제약조건이 코어 타입을 가지는 것입니다.

코어 타입은 제너릭의 내부 동작 방식을 이해하는 데 중요한 열쇠이지만, 일상적인 코딩에서 직접적으로 다룰 일은 많지 않을 수 있습니다.

다만, `for range`나 컴포지트 리터럴 사용 시 예상치 못한 컴파일 에러를 만난다면 코어 타입의 부재를 의심해볼 수 있습니다.

## **제너릭 사용 시 주의할 점 & 현명한 활용 팁**

제너릭은 강력한 도구이지만, 모든 문제를 해결하는 만능 열쇠는 아닙니다.

현명하게 사용하기 위해 몇 가지 점을 염두에 두면 좋습니다.

1.  **남용은 금물! 꼭 필요할 때 사용합시다:** 모든 함수를 제너릭으로 만들 필요는 없습니다. 제너릭이 코드 중복을 **실질적으로** 줄여주거나 **타입 안전성**을 명확히 높여주는 경우에 사용하는 것이 좋습니다. 때로는 구체적인 타입의 함수 여러 개가 더 명확하고 이해하기 쉬울 수 있습니다.
2.  **지나치게 복잡한 제약조건은 피합시다:** 너무 많은 타입 파라미터와 복잡하게 얽힌 제약조건은 코드를 읽고 사용하기 어렵게 만듭니다. 제약조건은 필요한 만큼만, 최대한 간결하게 정의하는 것이 좋습니다.
3.  **포인터 리시버 메서드를 다시 한번 확인합시다:** 인터페이스 제약조건을 사용할 때, 해당 인터페이스를 구현하는 것이 값 타입인지 포인터 타입인지 주의 깊게 확인해야 합니다. 앞서 살펴본 것처럼 예상치 못한 동작이나 컴파일 에러의 원인이 될 수 있습니다.
4.  **성능 영향은 미미하지만 인지합시다:** Go 제너릭은 컴파일 시 인스턴스화를 통해 효율적으로 구현되므로 대부분의 경우 성능 저하는 거의 없습니다. 하지만 아주 극단적인 고성능 코드에서는 약간의 오버헤드가 발생할 가능성도 이론적으로는 존재합니다. (일반적인 웹 개발 등에서는 크게 걱정할 필요는 없습니다.)
5.  **타입 추론에 너무 의존하지 맙시다:** 타입 추론은 편리하지만, 때로는 명시적으로 타입 인수를 적어주는 것이 코드의 가독성을 높이고 의도를 명확하게 전달하는 데 도움이 될 수 있습니다.

## **미래를 향해: Go 제너릭의 진화와 더 깊은 학습**

Go 제너릭은 Go 1.18에서 처음 도입된 이후 계속해서 개선되고 있습니다.

예를 들어 Go 1.21에서는 타입 추론 알고리즘이 더욱 강력해지고, 표준 라이브러리의 제약조건 패키지(`constraints`)가 `cmp` 패키지로 통합되는 등의 변화가 있었습니다.

앞으로도 Go 언어의 발전에 따라 제너릭은 더욱 편리하고 강력하게 진화할 것으로 기대됩니다.

제너릭에 대해 더 깊이 알고 싶다면 아래 자료들을 참고하는 것이 좋습니다.

*   **Go 공식 문서 (go.dev):** 언어 명세(Language Specification), Effective Go, 공식 블로그의 제너릭 관련 포스트들은 가장 정확하고 신뢰할 수 있는 정보의 원천입니다.
*   **Go 커뮤니티:** Gophers Slack, Go Forum 등에서 다른 개발자들과 제너릭 사용 경험을 나누고 질문하는 것도 좋은 학습 방법입니다.

## **시리즈를 마치며: 제너릭과 함께 Go 코딩 레벨 업!**

길고도 흥미진진했던 Go 제너릭 탐험 여정이 드디어 끝났습니다!

이 시리즈를 통해 여러분은 제너릭의 기본 개념부터 다양한 제약조건 활용법, 내부 동작 원리, 그리고 실전 활용 팁과 주의사항까지 폭넓은 지식을 얻으셨기를 바랍니다.

제너릭은 단순히 코드를 줄이는 것을 넘어, 더 **타입 안전하고**, **재사용 가능하며**, **표현력 높은** Go 코드를 작성할 수 있게 해주는 강력한 도구입니다.

처음에는 조금 낯설게 느껴질 수 있지만, 오늘 배운 내용들을 바탕으로 실제 프로젝트에 조금씩 적용해보면서 제너릭의 매력을 직접 느껴보시기를 강력히 추천합니다!

그동안 함께 탐험해주신 모든 분께 감사드립니다.

앞으로 Go 제너릭을 자유자재로 활용하며 더욱 즐겁고 효율적인 Go 개발 여정을 이어가시길 응원하겠습니다!

궁금한 점이나 나누고 싶은 이야기가 있다면 언제든지 댓글을 남겨주세요.

감사합니다!
