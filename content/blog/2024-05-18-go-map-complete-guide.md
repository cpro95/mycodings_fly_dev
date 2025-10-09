---
slug: 2024-0-5-18-go-map-complete-guide
title: Go 언어 맵(Map) 완벽 가이드 - 사용법과 원리
date: 2024-05-18 06:34:11.012000+00:00
summary: Go 언어 Map 활용과 그 원리
tags: ["go", "golang", "go map", "golang map"]
contributors: []
draft: false
---

** 목 차 **

- [Go 언어 맵(Map) 완벽 가이드 - 사용법과 원리](#go-언어-맵map-완벽-가이드---사용법과-원리)
  - [Go 언어의 맵(Map) 활용하기](#go-언어의-맵map-활용하기)
    - [소개](#소개)
    - [선언 및 초기화](#선언-및-초기화)
    - [맵 사용하기](#맵-사용하기)
    - [제로 값 활용하기](#제로-값-활용하기)
    - [키 타입](#키-타입)
    - [동시성(Concurrency)](#동시성concurrency)
    - [반복 순서](#반복-순서)
  - [Go 언어의 맵 타입 원리](#go-언어의-맵-타입-원리)
    - [키 타입](#키-타입-1)
    - [해시 함수](#해시-함수)
    - [맵의 구조](#맵의-구조)
    - [맵에서 데이터 가져오기](#맵에서-데이터-가져오기)
    - [맵 확장](#맵-확장)
    - [요약](#요약)

---

## Go 언어의 맵(Map) 활용하기

### 소개

해시 테이블은 컴퓨터 과학에서 매우 유용한 데이터 구조 중 하나입니다.

여러 종류의 해시 테이블이 있지만, 대체로 빠른 조회, 추가, 삭제 기능을 제공합니다.

Go 언어는 이러한 해시 테이블을 구현하는 내장 맵 타입을 제공합니다.

### 선언 및 초기화

Go의 맵 타입은 다음과 같은 형태를 가집니다:

```go
map[KeyType]ValueType
```

여기서 `KeyType`은 비교 가능한 모든 타입일 수 있으며, `ValueType`은 다른 맵을 포함한 모든 타입이 될 수 있습니다!

예를 들어, 문자열 키와 정수 값을 가지는 맵 `m`을 선언하려면 이렇게 작성합니다:

```go
var m map[string]int
```

맵 타입은 포인터나 슬라이스처럼 참조 타입이므로, 초기화되지 않은 맵 `m`의 값은 `nil`입니다. `nil` 맵은 읽기 시에는 빈 맵처럼 동작하지만, 쓰기를 시도하면 런타임 오류가 발생합니다.

이를 방지하려면 `make` 함수를 사용해 맵을 초기화해야 합니다:

```go
m = make(map[string]int)
```

`make` 함수는 해시 맵을 할당 및 초기화하고, 이를 가리키는 맵 값을 반환합니다.

이 글에서는 맵의 사용법에 집중하겠습니다.

### 맵 사용하기

Go는 맵을 다루기 위한 간단한 문법을 제공합니다.

예를 들어, 키 `"route"`에 값을 `66`으로 설정하려면 다음과 같이 작성합니다:

```go
m["route"] = 66
```

키 `"route"`에 저장된 값을 변수 `i`에 할당하려면 이렇게 합니다:

```go
i := m["route"]
```

요청한 키가 존재하지 않으면 값 타입의 기본 값(여기서는 `0`)을 반환합니다:

```go
j := m["root"]
// j == 0
```

맵에 있는 항목의 개수를 얻으려면 `len` 함수를 사용합니다:

```go
n := len(m)
```

맵에서 항목을 제거하려면 `delete` 함수를 사용합니다:

```go
delete(m, "route")
```

키의 존재 여부를 확인하려면 두 값 할당을 사용합니다:

```go
i, ok := m["route"]
```

여기서 `i`는 키 `"route"`에 저장된 값이고, `ok`는 키가 존재하면 `true`, 그렇지 않으면 `false`입니다.

값을 가져오지 않고 키의 존재 여부만 확인하려면 밑줄을 사용합니다:

```go
_, ok := m["route"]
```

맵의 모든 항목을 반복하려면 `range` 키워드를 사용합니다:

```go
for key, value := range m {
    fmt.Println("Key:", key, "Value:", value)
}
```

맵을 데이터로 초기화하려면 맵 리터럴을 사용합니다:

```go
commits := map[string]int{
    "rsc": 3711,
    "r":   2138,
    "gri": 1908,
    "adg": 912,
}
```

빈 맵을 초기화할 때도 같은 문법을 사용합니다:

```go
m = map[string]int{}
```

### 제로 값 활용하기

키가 없을 때 맵 조회가 제로 값을 반환하는 것은 편리할 수 있습니다.

예를 들어, 불리언 값을 가지는 맵은 집합처럼 사용할 수 있습니다(불리언 타입의 기본 값은 `false`입니다).

다음 예제는 노드의 연결 리스트를 순회하며 값을 출력합니다.

사이클을 감지하기 위해 노드 포인터의 맵을 사용합니다.

```go
type Node struct {
    Next  *Node
    Value interface{}
}
var first *Node

visited := make(map[*Node]bool)
for n := first; n != nil; n = n.Next {
    if visited[n] {
        fmt.Println("cycle detected")
        break
    }
    visited[n] = true
    fmt.Println(n.Value)
}
```

또 다른 예는 슬라이스의 맵입니다.

`nil` 슬라이스에 값을 추가하면 새로운 슬라이스가 할당되므로, 슬라이스의 맵에 값을 추가하는 것은 한 줄로 가능합니다.

다음 예제에서는 사람들의 값을 포함하는 슬라이스 `people`을 초기화합니다.

각 사람(`Person`)은 이름과 좋아하는 것의 슬라이스를 가집니다.

이 예제는 각 좋아하는 것을 좋아하는 사람들과 연결하는 맵을 생성합니다.

```go
type Person struct {
    Name  string
    Likes []string
}
var people []*Person

likes := make(map[string][]*Person)
for _, p := range people {
    for _, l := range p.Likes {
        likes[l] = append(likes[l], p)
    }
}
```

치즈를 좋아하는 사람들의 목록을 출력하려면:

```go
for _, p := range likes["cheese"] {
    fmt.Println(p.Name, "likes cheese.")
}
```

베이컨을 좋아하는 사람들의 수를 출력하려면:

```go
fmt.Println(len(likes["bacon"]), "people like bacon.")
```

`range`와 `len` 모두 `nil` 슬라이스를 길이가 0인 슬라이스로 취급하기 때문에, 마지막 두 예제는 치즈나 베이컨을 좋아하는 사람이 아무도 없더라도 제대로 동작합니다(그럴 가능성은 낮지만).

### 키 타입

맵 키는 비교 가능한 모든 타입이 될 수 있습니다. 비교 가능한 타입은 불리언, 숫자, 문자열, 포인터, 채널, 인터페이스 타입, 그리고 이들 타입만 포함하는 구조체나 배열입니다.

슬라이스, 맵, 함수는 비교할 수 없으므로 맵 키로 사용할 수 없습니다.

기본 타입 외에도 구조체를 맵 키로 사용할 수 있습니다. 예를 들어, 다음은 국가별로 웹 페이지 조회수를 집계하는 맵입니다:

```go
hits := make(map[string]map[string]int)
```

이 접근 방식은 비효율적일 수 있습니다. 외부 키에 대해 내부 맵이 존재하는지 확인하고, 필요시 생성해야 합니다:

```go
func add(m map[string]map[string]int, path, country string) {
    mm, ok := m[path]
    if !ok {
        mm = make(map[string]int)
        m[path] = mm
    }
    mm[country]++
}
add(hits, "/doc/", "au")
```

반면, 구조체 키를 사용하는 단일 맵은 이러한 복잡함이 사라집니다:

```go
type Key struct {
    Path, Country string
}
hits := make(map[Key]int)
```

베트남 사람이 홈 페이지를 방문했을 때, 해당 카운터를 증가시키는 것은 한 줄로 가능합니다:

```go
hits[Key{"/", "vn"}]++
```

스위스 사람들이 스펙을 읽은 횟수를 확인하는 것도 마찬가지로 간단합니다:

```go
n := hits[Key{"/ref/spec", "ch"}]
```

### 동시성(Concurrency)

맵은 동시 사용에 안전하지 않습니다. 동시에 읽고 쓰는 경우에 어떤 일이 일어날지 정의되지 않았습니다.

만약 동시에 실행되는 고루틴에서 맵을 읽고 써야 한다면, 동기화가 필요합니다. 일반적으로 `sync.RWMutex`를 사용해 맵을 보호합니다.

다음 문장은 맵과 내장된 `sync.RWMutex`를 포함하는 구조체로 카운터 변수를 선언합니다.

```go
var counter = struct{
    sync.RWMutex
    m map[string]int
}{m: make(map[string]int)}
```

읽기 잠금을 걸어 카운터를 읽으려면:

```go
counter.RLock()
n := counter.m["some_key"]
counter.RUnlock()
fmt.Println("some_key:", n)
```

쓰기 잠금을 걸어 카운터에 쓰려면:

```go
counter.Lock()
counter.m["some_key"]++
counter.Unlock()
```

### 반복 순서

맵을 `range` 루프로 반복할 때, 반복 순서는 정해져 있지 않고 매번 다를 수 있습니다.

안정적인 순서가 필요하다면 별도의 데이터 구조를 유지해야 합니다.

다음 예제는 키 순서대로 맵[int]string을 출력하기 위해 정렬된 키의 슬라이스를 사용합니다:

```go
import "sort"

var m map[int]string
var keys []int
for k := range m {
    keys = append(keys, k)
}
sort.Ints(keys)
for _, k := range keys {
    fmt.Println("Key:", k, "Value:", m[k])
}
```

이 글에서는 Go 언어의 맵 타입을 사용하는 방법에 대해 설명했습니다.

맵은 매우 강력한 데이터 구조로, 다양한 상황에서 유용하게 사용할 수 있습니다.

기본적인 사용법부터 고급 기법까지, 이 가이드를 통해 Go에서 맵을 효과적으로 활용할 수 있기를 바랍니다.

---

## Go 언어의 맵 타입 원리

맵은 키-값 저장소로서, 키를 통해 값을 최대한 빠르게 조회하는 것이 중요합니다.

맵은 우리가 흔히 사용하는 사전처럼 동작합니다.

키를 입력하면 그에 해당하는 값을 빠르게 찾을 수 있습니다.

### 키 타입

비교 가능한 모든 타입은 키가 될 수 있습니다.

예를 들어, 숫자, 문자열, 배열, 채널 등이 있습니다. 하지만 슬라이스, 맵, 함수는 키로 사용할 수 없습니다.

왜냐하면 이들은 서로 비교할 수 없기 때문입니다.

### 해시 함수

맵 키와 값은 맵을 위해 할당된 메모리에 연속적으로 저장됩니다. 메모리 주소를 처리하기 위해 해시 함수를 사용해야 합니다.

해시 함수는 주어진 키를 입력으로 받아 고유한 숫자 값을 반환하는 함수입니다.

해시 함수에 대한 요구 사항은 다음과 같습니다:

- **결정론적**: 동일한 키에 대해 항상 동일한 값을 반환해야 합니다.
- **균일성**: 값이 모든 버킷에 균등하게 분포되어야 합니다.
- **빠름**: 여러 번 사용되기 때문에 빠르게 실행되어야 합니다.

### 맵의 구조

이제 맵이 내부적으로 어떻게 동작하는지 알아보겠습니다. 다음은 단순화된 맵의 구조입니다:

```go
// Go 맵의 헤더 구조체
type hmap struct {
        count      int // 맵에 저장된 항목의 개수. len() 함수에서 사용됨.
        B          uint8  // 버킷의 개수를 나타내는 2의 지수. 최대 loadFactor * 2^B 개의 항목을 저장할 수 있음.
        buckets    unsafe.Pointer // 2^B 개의 버킷 배열. count가 0일 경우 nil일 수 있음.
        oldbuckets unsafe.Pointer // 이전 버킷 배열의 포인터. 크기는 절반이며, 확장 중일 때만 nil이 아님.
}
```

데이터 주소는 부분별로 나뉘어 버킷 배열에 저장됩니다. `unsafe.Pointer`는 어떤 변수 타입이든 포인터가 될 수 있습니다.

이는 Go에서 제네릭 문제를 해결하는 방법입니다.

맵에 데이터가 없으면 버킷은 `nil`입니다.

첫 번째 키가 추가될 때 8개의 버킷이 생성됩니다.

### 맵에서 데이터 가져오기

맵에서 데이터를 가져오려면 키와 값의 메모리 주소를 찾아야 합니다.

1. 먼저 버킷을 찾아야 합니다. 이는 키 해시의 첫 8비트를 버킷 구조체의 해당 데이터와 비교하여 선택됩니다.
2. 다음으로, 주소를 통해 키 값을 찾습니다.

```go
k := add(unsafe.Pointer(b), dataOffset+i*uintptr(t.keysize))
if t.indirectkey() {
        k = *((*unsafe.Pointer)(k))
}
```

3. 마지막으로, 같은 방식으로 값을 찾습니다.

```go
if t.key.equal(key, k) {
        e := add(unsafe.Pointer(b), dataOffset+bucketCnt*uintptr(t.keysize)+i*uintptr(t.elemsize))
        if t.indirectelem() {
                e = *((*unsafe.Pointer)(e))
        }
        return e
}
```

### 맵 확장

데이터가 많아지면 맵을 확장해야 합니다. 이 과정에서 `oldbuckets` 속성을 사용합니다.

1. 버킷에 데이터가 너무 많아지면, 현재의 버킷 값을 `oldbuckets`에 저장합니다.
2. `buckets` 속성에 두 배의 버킷을 생성합니다.
3. 맵 데이터는 `oldbuckets`에서 `buckets`으로 복사됩니다.

버킷의 수는 항상 2의 거듭 제곱입니다. 그래서 `B` 속성이 있습니다.

이는 현재 버킷 수를 나타내는 2의 거듭 제곱입니다.

마이그레이션 중에도 맵은 접근 가능합니다. 그래서 소스 코드의 동일한 함수에서 `buckets`과 `oldbuckets`을 모두 다뤄야 합니다.

마이그레이션 후 `oldbuckets`은 `nil`로 설정됩니다.

마이그레이션 과정에서 데이터의 주소가 변경될 수 있기 때문에, Go 언어는 맵 값의 포인터를 직접 가져오는 것을 허용하지 않습니다.

다음 예제는 이를 보여줍니다:

```go
mymap := map[string]string{"1": "1"}
fmt.Println(&mymap["1"])

// cannot take the address of mymap["1"]
```

위 코드는 컴파일 오류를 발생시킵니다.

이는 마이그레이션 중에 맵 값의 메모리 주소가 변경될 수 있으므로, 안전하지 않기 때문에 Go 언어는 이러한 작업을 허용하지 않습니다.

### 요약

Go 언어의 맵 타입은 해시 테이블을 기반으로 하며, 키-값 쌍을 빠르고 효율적으로 저장하고 조회할 수 있도록 설계되었습니다.

맵의 키는 비교 가능한 타입이어야 하며, 해시 함수는 결정론적이고 균일하며 빠르게 동작해야 합니다.

맵의 데이터 구조는 버킷 배열을 사용하여 메모리를 효율적으로 관리합니다.

맵의 크기가 증가하면 자동으로 버킷의 수가 두 배로 증가하며, 이 과정에서 데이터는 새로운 버킷 배열로 마이그레이션됩니다.

마이그레이션 중에도 맵은 접근 가능하지만, 데이터의 주소가 변경될 수 있기 때문에 맵 값의 포인터를 직접 가져오는 것은 허용되지 않습니다.


