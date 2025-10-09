---
slug: 2024-02-24-understanding-goroutine-and-channel-with-images
title: Go 언어 공부 - 그림으로 이해하는 goroutine과 channel
date: 2024-02-24 12:27:21.611000+00:00
summary: Go 언어 공부 - 그림으로 이해하는 goroutine과 channel
tags: ["go", "golang", "goroutine", "channel"]
contributors: []
draft: false
---

안녕하세요?

Go 언어 공부에서 가장 어려웠던게 바로 고루틴과 채널인데요.

이해를 깊게 하기 위해 그림을 그리며 조금씩 조금씩 goroutine과 go channel을 이해해 보고자 합니다.

** 목 차 **

- [Go 언어 공부 - 그림으로 이해하는 goroutine과 channel](#go-언어-공부---그림으로-이해하는-goroutine과-channel)
  - [동시성과 병렬성의 차이](#동시성과-병렬성의-차이)
  - [goroutine을 이용한 병렬 처리](#goroutine을-이용한-병렬-처리)
  - [WaitGroup를 사용하여 제어하기](#waitgroup를-사용하여-제어하기)
  - [**go channel**](#go-channel)
  - [**Unbuffered channel**](#unbuffered-channel)

---

## 동시성과 병렬성의 차이

먼저 혼동하기 쉬운 동시성(concurrent)과 병렬성(parallel)의 차이를 인식해두시는 것이 좋습니다.

(영어로 설명하는 것이 더 이해하기 쉬울 것 같은데요.)

검색해보면 정의에 차이가 있는데, 제가 대충 쓰면 곧바로 머리를 두 동갈래로 쪼개버릴 것 같은 것들이 있더군요.

아래 그림은 Erlang을 만든 Joe Armstrong의 그림인데요, 5살 아이도 이해할 수 있는 비유적인 그림입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgmoPhb7RaNGakz1v4InJ8_yYJnL-CgMTKVWqnNJQpPviQsi64xQxHchoPbmhEb8DZfkWtmSJ-VacCYh7cCod1qN6kXLCb9OamHXYWxq23iKq0L6E5XAE2wayHN2w6l3R_uVibEoLIow8_ZJ2uYSJRzx0FoPnzjaRiW2EUv0ACFCfOn1ML9ce8Ed7a_2FY)


간단히 말하자면, 동시 처리는 공통 리소스(예: CPU 또는 메모리)를 조율하면서 여러 작업을 처리합니다.

병렬 처리는 각각 독립된 리소스를 사용하여 여러 작업을 처리합니다.

또한 Rob Pike 선생님의 유명한 슬라이드 ["Concurrency is not Parallelism"](https://go.dev/talks/2012/waza.slide#1)도 읽어보시는 것을 추천드립니다.

---

## goroutine을 이용한 병렬 처리

goroutine을 사용하여 간단한 병렬 처리를 작성해보겠습니다.

먼저 1밀리초 동안 Sleep을 1000번 실행하는 TaskA와 1밀리초 동안 Sleep을 2000번 실행하는 TaskB를 만들어보겠습니다.

체감할 수 있는 정도의 약간 느린 반복 횟수로 설정했습니다.

먼저 TaskA와 TaskB를 순차적으로 처리하면 어떻게 될까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEjEQ0jcOZuT8qAecsbxlGefjqFY07_vOvd4ZTfoQnbUYe9qfcOW0YiSdcOAVIeCrR7mzmG3c9iPmjugUPLhtq9EMYEFQKYhob0Ze912GhI4jUTtC1eTxdejvQMZKoHJx2dKS59_VMemcL6Ew-exk2jBkjF2EZ63NifeqP8PemX3ZPeDtWtwo0-6a8mHPqs)

```go
// try_goroutine.go
package main

import (
    "fmt"
    "time"
)

type Task struct {
    name             string
    process_millisec int 
}

func (t *Task) ProcessTask() {
    fmt.Printf("%s 시작\n", t.name)
    for i := 0; i < t.process_millisec; i++ {
        time.Sleep(1 * time.Millisecond)
    }   
    fmt.Printf("%s 완료\n", t.name)
}

// 공통으로 사용할 태스크 정의
var TaskA = Task{name: "A", process_millisec: 1000}
var TaskB = Task{name: "B", process_millisec: 2000}

// 순차 실행
func NormalTask() {
    TaskA.ProcessTask()
    TaskB.ProcessTask()
}

func main() {
}
```

실행 시간을 확인하거나 CPU 수를 늘리고 싶으시면 testing 패키지를 사용하여 실행해보세요.

테스트용 코드는 다음과 같습니다:

```go
// try_goroutine_test.go
package main

import (
    "testing"
)

func TestNormalTask(t *testing.T) {
    NormalTask()
}
```

실행 시간을 확인하기 위해 테스트를 `-v` 옵션과 함께 실행해보세요:

```bash
$ go test -v
=== RUN   TestNormalTask
Start A
Finished A
Start B
Finished B
--- PASS: TestNormalTask (3.84s)
PASS
ok      <snip />    3.849s
```

TaskA와 TaskB를 순차적으로 실행하면 약 3초가 걸린다는 것을 확인할 수 있습니다.

다음으로 고루틴을 사용하여 병행 처리를 구현합니다.

try_goroutine.go에 다음을 추가합니다.

함수를 호출할 때 앞에 go를 붙이기만 하면 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhPdQvbChiDJd9NCDokMsFWH7ssIIUOBM5rbSZFPnwyOZ-vgtFVj4gZcQtt5uGdIWdaMp3wiYp3cl1Qfh5q0F81l5Dx4ir4B_qHcTO8otEZ9fn3Aljb9Lj27pdatHjG_NVaCRGTu8VHJlGGTdsa-NyZzRmPHvxWcMe2cx8WsInp3Elt4hiiO4X0E0hAKUQ)

```go
// try_goroutine.go
// goroutine을 이용한 실행
func GoTask() {
    go TaskA.ProcessTask()
    go TaskB.ProcessTask()
}

테스트 코드에는 다음을 추가합니다:

```go
// try_goroutine_test.go
package main

import (
    "testing"
)

func TestGoTask(t *testing.T) {
    GoTask()
}
```

Go 1.5 이후에는 실행하는 기계에 탑재된 CPU를 가능한 한 사용하도록 되어 있으므로 `-cpu` 옵션을 사용하여 하나의 CPU에서 실행하도록 설정합니다.

```bash
$ go test -v -cpu 1
=== RUN   TestNormalTask
Start A
Finished A
Start B
Finished B
--- PASS: TestNormalTask (3.97s)
=== RUN   TestGoTask
--- PASS: TestGoTask (0.00s)
PASS
ok      <snip />    3.983s
```

goroutine을 사용한 테스트 케이스에서는 아무런 출력이 없었습니다.

이는 goroutine이 표준 출력에 문자열을 출력하기 전에 테스트가 끝났기 때문입니다.

일반적으로는 이렇게 구현하지 않지만, 테스트 케이스에 Sleep 처리를 넣어 버퍼로 사용하면 약간 보이게 할 수 있습니다.

Sleep을 넣은 테스트 실행 예시:

```bash
$ go test -v -cpu 1
=== RUN   TestNormalTask
Start A
Finished A
Start B
Finished B
--- PASS: TestNormalTask (3.99s)
=== RUN   TestGoTask
Start B
Start A
--- PASS: TestGoTask (0.00s)
PASS
ok      <snip />    3.997s
```

위 실행 예시에서는 goroutine을 사용하여 TaskB, TaskA 순으로 실행되었음을 확인할 수 있습니다.

물론 순차 처리보다 빠르다는 것도 알 수 있습니다.

0.00s인 이유는 밀리초가 아닌 나노초 단위로 보지 않으면 알아보기 어려울 정도로 실행 시간이 짧았기 때문입니다.

실제로 얼마나 빠른지 알아보려면 벤치마크를 사용해야 하지만, 여기서는 순차 처리보다 빠르다는 것만 확인하면 됩니다.

---

## WaitGroup를 사용하여 제어하기

goroutine에서 실행되는 모든 처리가 완료된 후에 특정 처리를 실행하는 경우를 고려해보겠습니다.

예를 들어 작업 A와 작업 B를 병렬로 실행하고, 두 작업이 모두 완료된 후에 작업 C를 실행하고 싶다고 가정해봅시다.

이런 경우 sync 패키지의 WaitGroup을 사용합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgrD3OMiPbAxeTddjw1stLMr-Ktw4yvxSOqMCXVz7yFPqhLvnsX10WkoDg9aO339RuVUI59gLGTNFue2yyVe5fAE8uHyW5PwWChrsq9xVKTKLHqLbmtdMDahTED0QzNKsSQOPaB3v4dk7EkTIabxdBIuTj0MDXd5cEJO75PDrYlyXfp2X9MOLeoQDKGwm0)

WaitGroup은 모든 goroutine이 완료될 때까지 기다려줍니다.

WaitGroup에는 카운터 개념이 있으며, 등록할 처리의 수만큼 카운터를 추가합니다.

goroutine의 수를 카운터에 등록하려면 Add 함수를 사용합니다.

각 처리가 완료되면 Done 함수를 사용하여 카운터를 감소시킵니다.

Wait 함수는 카운터가 0이 될 때까지 기다려줍니다.

```go
// try_waitgroup.go
package main

import (
    "fmt"
    "sync"
    "time"
)

type Task struct {
    name             string
    process_millisec int 
}

func (t *Task) ProcessTask(wg *sync.WaitGroup) {
    fmt.Printf("Start %s\n", t.name)
    for i := 0; i < t.process_millisec; i++ {
        time.Sleep(1 * time.Millisecond)
    }   
    fmt.Printf("Finished %s\n", t.name)
    wg.Done() //カウンタをデクリメント
}

var TaskA = Task{name: "A", process_millisec: 1000}
var TaskB = Task{name: "B", process_millisec: 2000}
var TaskC = Task{name: "C", process_millisec: 3000}
var Tasks []Task = []Task{TaskA, TaskB}

func GoTask() {
    var wg1 sync.WaitGroup
    var wg2 sync.WaitGroup

    for _, task := range Tasks {
        wg1.Add(1) //wg1のカウンタをインクリメント
        go func(task Task) {
            go task.ProcessTask(&wg1)
        }(task)
    }   
    wg1.Wait() //wg1の処理が全て完了するまで待つ

    wg2.Add(1)
    go TaskC.ProcessTask(&wg2)
    wg2.Wait()
}
```

1. **Task 구조체**:
  - `Task` 구조체는 이름과 지속 시간(밀리초)을 가지는 작업을 나타냅니다.
  - 각 작업은 `ProcessTask` 메서드를 가지며, 지정된 지속 시간 동안 처리를 시뮬레이션합니다.
  - 작업이 완료되면 `wg *sync.WaitGroup` 매개변수를 사용하여 카운터를 감소시킵니다.

2. **작업 인스턴스**:
  - 세 가지 작업(`TaskA`, `TaskB`, `TaskC`)를 정의했습니다.
  - `TaskA`는 1000 밀리초(1초), `TaskB`는 2000 밀리초(2초), `TaskC`는 3000 밀리초(3초)가 걸립니다.

3. **GoTask 함수**:
  - `GoTask` 함수는 작업 실행을 조정합니다.
  - 두 개의 `sync.WaitGroup` 인스턴스(`wg1` 및 `wg2`)를 초기화합니다.
  - `Tasks` 슬라이스의 각 작업에 대해 `wg1`에 1을 추가하고 해당 작업을 실행하는 고루틴을 시작합니다.
  - `wg1.Wait()`를 사용하여 `wg1`의 모든 작업이 완료될 때까지 기다립니다.
  - 그런 다음 `wg2`에 1을 추가하고 `TaskC`를 실행하는 고루틴을 시작합니다.
  - 마지막으로 `wg2.Wait()`를 사용하여 `TaskC`가 완료될 때까지 기다립니다.


```go
// try_waitgroup_test.go
package main

import "testing"

func TestGoTask(t *testing.T) {
    GoTask()
}
```

4. **TestGoTask 함수**:
  - `TestGoTask` 함수는 `GoTask`를 호출하는 테스트 케이스입니다.
  - 작업이 올바르게 실행되는지 확인합니다.
```

```bash
$ go test -v -cpu 1
=== RUN   TestGoTask
Start B
Start A
Finished A
Finished B
Start C
Finished C
--- PASS: TestGoTask (6.62s)
PASS
ok      <snip />    6.631s
```

5. **실행 결과**:
  - `-cpu 1`로 테스트를 실행하면 다음과 같은 출력이 생성됩니다:
      ```bash
      === RUN   TestGoTask
      Start B
      Start A
      Finished A
      Finished B
      Start C
      Finished C
      --- PASS: TestGoTask (6.62s)
      PASS
      ok      <snip />    6.631s
      ```
  - 총 실행 시간은 약 6.62초입니다.

6. **최적화**:
  - 작업이 순차적으로 실행되는 것을 발견했습니다.
  - 모든 작업을 단일 `WaitGroup`으로 결합하여 더 나은 병렬성을 달성했으며, 이로 인해 총 실행 시간은 약 3.82초가 되었습니다.

병렬 처리를 관리하기 위해 `sync.WaitGroup`을 사용한 뛰어난 작업입니다! 

먼저, 앞서 보여드린 예시에서 `Finished C`와 같은 출력은 표준 출력에는 나타나지 않았지만, `Wait` 함수 덕분에 결과를 확인할 수 있었습니다.

궁금한 점은 실행 시간입니다.

A 작업은 1초, B 작업은 2초, C 작업은 3초 정도 걸리므로, 총 시간을 보면 처음의 `WaitGroup(wg1)` 내에서 병렬 처리되는 것처럼 보이지 않습니다.

아마도 `WaitGroup` 처리에 시간이 소요되고 있는 것으로 보입니다.

한 번 시도해보겠습니다.

A 작업, B 작업, C 작업을 `Tasks` 배열에 넣고 `WaitGroup`을 사용하여 실행해 보겠습니다.

(두 번째 `WaitGroup`은 삭제하고, C 작업을 첫 번째 `WaitGroup`에 추가합니다)

![](https://blogger.googleusercontent.com/img/a/AVvXsEig5NNYAyi-7uZJJuJJmlkFQWid8yMRO8WNFqF8gOY0JrM7JPf_a4IwrXA0WVosBJs0KhHXfjvPYNhzUGnlYIxv-YDITppfYkC_XYkE4G25ysw19YIMaQ0sO57aJr8uz_GZ51-EFR1p9778ClPxJzPlp5qTG3qLyalgx-0nL3y1nKWnM2k_PoGEpg74wbc)

```bash
// A 작업, B 작업, C 작업을 1개의 WaitGroup에서 실행
$ go test -v -cpu 1
=== RUN   TestGoTask
Start C
Start A
Start B
Finished A
Finished B
Finished C
--- PASS: TestGoTask (3.82s)
PASS
ok      <snip />    3.828s
```

3.8초로 순차 처리보다 빠른 결과가 나왔습니다.

---

## **go channel**

**go channel**은 고루틴 간에 값을 주고받기 위한 배열과 같은 개념입니다.

채널은 데이터를 보낼 때 버퍼가 가득 차면 블록되며, 데이터를 받을 때는 채널이 비어 있어도 블록됩니다.

채널은 기본적으로 **버퍼가 없는 상태**입니다.

- **버퍼가 없는 int형 채널 생성 예시:**
  ```go
  ch := make(chan int)
  ```

- **버퍼 크기가 10인 int형 버퍼 채널 생성 예시:**
  ```go
  ch := make(chan int, 10)
  ```

- **버퍼 크기가 10인 버퍼 채널 (타입 없음) 생성 예시:**
  ```go
  ch := make(chan interface{}, 10)
  ```

채널에 값을 보내는 예시:
```go
ch <- 1
```

채널에서 값을 받아 변수에 할당하는 예시:
```go
a := <-ch
```

또한, 채널은 **송신 전용**이나 **수신 전용**으로 제한할 수도 있습니다:

- **문자열을 송신 전용 채널로 생성:**
  ```go
  ch := make(chan<- string)
  ```

- **문자열을 수신 전용 채널로 생성:**
  ```go
  ch := make(<-chan string)
  ```

---

## **Unbuffered channel**

**Unbuffered channel**은 값 하나만 저장할 수 있는 배열과 같은 개념입니다.

어떤 고루틴이 이 배열에 값을 넣으면 다른 고루틴이 그 값을 가져갈 때까지 다른 고루틴은 값을 넣을 수 없습니다.

이 때, 다른 고루틴은 배열이 비워질 때까지 블록되어 대기합니다. 마찬가지로, 다른 고루틴이 값을 가져가려고 할 때 배열이 비어있다면 값이 들어올 때까지 블록됩니다.

아래는 Ardan Studios의 Go 언어 강의에서 가져온 그림입니다.

이 그림은 unbuffered channel의 동작을 잘 보여줍니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEj0lF8ug-QvFEcpoN0RWqlf7IyjZ9SkTseJ8Qp6Uo-3dUF7jdlL87-AoOItSZ351GFZ_wN3NjRufR2Ig0B-lzNkQN096NezByNA7BR90WSXBcH8pOWb7F5VupYErs_nQ4syLQB0NS2svNPkv4iNO4Oj3HCGMDsVSMbgAkqsIZBfuTs5DH4KwQt2vs-tQ50)

왼쪽과 오른쪽에 [GR]이라고 표시된 사람들은 고루틴입니다.

스텝 2에서 왼쪽 고루틴이 채널에 값을 넣고 있으며, 오른쪽 고루틴은 값을 가져올 때까지(스텝 6까지) 락되어 있습니다.

또한, "Go in Action"에서도 거의 동일한 그림으로 설명되어 있으며, 채널의 동작이 잘 재현되었다고 생각합니다.

처음에 이 그림을 볼 때, 단순히 값을 전달하는데 왜 이렇게 6단계나 필요한지 의아했습니다.

하지만 채널의 블록 상태를 인식하지 않으면 빠르게 락에 걸릴 수 있습니다.

먼저 위의 그림처럼 단순하게 하나의 채널에 값을 보내고 가져오는 방법을 살펴보세요!

---

에러나는 예를 보여드립니다.

```go
// 데드락하는 try_gochannel.go
package main

import "fmt"

func SimpleTask() {
    myCh := make(chan int)
    myCh <- 100 // channel에 쓰기
    num := <-myCh // channel에서 값 가져오기
    fmt.Println(num)
}
func main(){}
```

실행 결과를 확인하기 위한 테스트 코드는 다음과 같습니다.

```go
// try_gochannel_test.go
package main

import "testing"

func TestSimpleTask(t *testing.T) {
    SimpleTask()
}
```

go test -v로 실행하면 데드락이 발생합니다.

당연한 이야기지만, `myCh<-100`을 실행했을 때 다른 goroutine이 값을 가져올 때까지 sleep하며 이후 작업은 실행되지 않습니다.

위의 인간 그림에서는 자신이 상자에 값을 넣고 있지만, 잠겨 있으면서 상자 반대편에서 손을 넣어 값을 가져오려고 하지만 할 수 없는 느낌이겠죠.

시퀀스 다이어그램은 다음과 같습니다. (조금 억지로 표현했기 때문에 엄밀하지 않습니다...)

![](https://blogger.googleusercontent.com/img/a/AVvXsEgXPP8CjpmMzWOEb54hs_dyhCfd7gWnlBlYwdF6UkWT-haJrQVaWhLDod-nS6igLVNgpxnAaWccS-bhVeOi2eRgjxs0t4rj2mzffQNsmbq9hY5B4PUE_g4iJ6pRmgf-eFCR1nwFg7vk70aL1eu4w5VReLxlxokvv99vm9ulxPWZlre_xh1s_0O_EI-Hl6M)

위의 인간 그림을 재현하려면 하나의 추가적인 goroutine이 필요합니다.

조금 억지로 시퀀스 다이어그램으로 표현하면 다음과 같습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEj3gMmNcEVlEsV1ou1wIzeW4pCDHTxy_q51d5367ou_qFJpi96jdEGP-CrlOPkeUM26XLh1iujNkMUD7NWTCwuQp9MXKcrkNzZoAGWo_2zaCKotCvlaQjcfeUlyFgQRdQ7c8eagbkMCnJSGpj7jVyobsE1XqrDkQ0WW6QVJAELWRI9a7Jj3CGb8drn4Z6A)

수정된 try_gochannel.go는 다음과 같습니다.

```go
// try_gochannel.go
func SimpleTask() {
    myCh := make(chan int)
    go func() {
        myCh <- 100 
    }() 
    num := <-myCh // channel에 값이 들어올 때까지 기다림
    fmt.Println(num)
}
```

실행 결과:
```bash
=== RUN   TestSimpleTask
100
--- PASS: TestSimpleTask (0.00s)
```

포인트는 myCh가 unbuffered이기 때문에 익명 함수가 언제 실행될지 알 수 없지만, `num := <-myCh`는 channel에 값이 들어올 때까지 실행되지 않는다는 것입니다.

unbuffered channel은 goroutine 간 동기화에 사용할 수 있습니다.

goroutine을 추가해보겠습니다.

goroutine에서 TaskA와 TaskB를 실행합니다.

각각의 작업은 버퍼가 없는 채널인 myCh를 읽어 작업 이름을 추가하고 채널에 쓰기합니다.

한번 더 강제로 순서도로 만들면 다음과 같습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhgrv41AATUtGCqf8CvuqLVQ3gVIGgerCnkb0-m2VKEe0_lTJB6K39v0w8WrubW_1eZ20tXtY2HVkP0HwKQCpIG8Oet2Iy9CpJkarv34fPNcj7jDJeoEC0YHuoXN1gFSzQnhh4iOiWLwZpNWz4oqQensZZIWeTfwOZT-gYYbDWa_V2r2natHd1NwznxAbo)

```go
// try_gochannel.go
package main

import (
    "fmt"
    "time"
)

func ProcessTask(task string, c chan string) {
    str := <-c 
    str = str + task
    fmt.Println(str)
    c <- str 
}

func DualTaskTask() {
    myCh := make(chan string)
    go ProcessTask("A", myCh)
    go ProcessTask("B", myCh)
    myCh <- "TaskList: "
    time.Sleep(time.Second)
}

func main() {
}
```

```go
// try_gochannel_test.go
package main

import "testing"

func Throw(c chan<- int) { // 送る専用
    for i := 0; i < 3; i++ {
        c <- i
        fmt.Println("Throw ", i)
    }   
}

func Catch(c <-chan int) { //受け取る専用
    for i := 0; i < 3; i++ {
        num := <-c 
        fmt.Println("Catch ", num)
    }   
}

func ThrowCatchTask() {
    myCh := make(chan int)
    go Throw(myCh)
    go Catch(myCh)
    time.Sleep(time.Second)
}

func main() {
}
```

실행 결과:

```bash
=== RUN   TestDualTaskTask
TaskList: B
TaskList: BA
--- PASS: TestDualTaskTask (1.00s)
PASS
```

결과는 "TaskList: BA"로, 두 번째 goroutine인 "B"에서 처리되었음을 알 수 있습니다.

첫 번째와 두 번째 중 어떤 goroutine이 먼저 실행되는지는 Go 언어의 런타임에 의해 결정되므로 확실하지 않습니다.

channel의 대기를 확인할 수 있는 예시를 보겠습니다.

channel에 값을 넣는 전용 goroutine(throw)과 channel에서 값을 가져오는 전용 goroutine(catch)을 실행합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEipsBSkcKazNqGY8Q7rzU7u9q78ZBQS1ZFM1JmHuXnRiu9GWdBF-XtINUQgVx62L1K_iXHCFn1ClTLG7XWT-xyoSnTsCAATZE9Va6CxG8eQpbFJ-fuqJxwUbTRLppnE9bUJFOBaUlsib3RzoQi58QGORkB1XsNETxPUq2XS0j_5NQNYaajJVpEmKILmxtA)

(참고: read와 write의 순서가 반대로 될 수 있으므로, 매번 read는 channel에 값이 들어올 때까지 기다리지 않습니다. 그러나 강제로 이미지를 시퀀스 다이어그램으로 표현했습니다.)

```go
// try_gochannel.go
package main

import "testing"

func Throw(c chan<- int) { // 送る専用
    for i := 0; i < 3; i++ {
        c <- i
        fmt.Println("Throw ", i)
    }   
}

func Catch(c <-chan int) { //受け取る専用
    for i := 0; i < 3; i++ {
        num := <-c 
        fmt.Println("Catch ", num)
    }   
}

func ThrowCatchTask() {
    myCh := make(chan int)
    go Throw(myCh)
    go Catch(myCh)
    time.Sleep(time.Second)
}

func main() {
}
```

```go
// try_gochannel_test.go

func TestThrowCatchTask(t *testing.T) {
    ThrowCatchTask()
}
```
실행 결과:

```bash
=== RUN   TestThrowCatchTask
Catch  0
Throw  0
Throw  1
Catch  1
Catch  2
Throw  2
--- PASS: TestThrowCatchTask (1.00s)
```

값을 넣는 Throw와 값을 가져오는 Catch 모두 3번의 for 루프를 반복하지만, 결과를 보면 항상 Throw와 Catch의 쌍이 처리된 후 다음 for 루프로 진행됨을 알 수 있습니다.

Throw와 Catch 모두 goroutine으로 실행되며, 어느 것이 먼저 실행될지는 보장되지 않습니다.

---

끝.

