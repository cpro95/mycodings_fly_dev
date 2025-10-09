---
slug: 2023-03-03-study-and-guide-of-c-17-std-variant
title: "C++17 std::variant 알아보기"
date: 2023-03-03 11:11:44.888000+00:00
summary: "c++, c++17, std::variant"
tags: ["c++", "c++17", "std::variant"]
contributors: []
draft: false
---

안녕하세요?

Nodejs 로 웹 프로그래밍을 주로 하면서 간혹 C++도 공부하고 있는데요.

오늘은 C++17에 소개된 std::variant에 대해 알아보겠습니다.

std::variant는 C++17에서 추가된 표준 라이브러리인 컨테이너 클래스 중 하나입니다.

std::variant는 다른 언어에서 많이 사용되는 유니온(union)과 비슷한 기능을 제공하는데요.

하지만 std::variant는 유니온(union) 보다 더 안전하고 유연한 방식입니다.

std::variant는 여러 개의 타입 중 하나를 저장할 수 있으며, 저장된 값에 접근할 때는 타입 체크할 필요가 없습니다.

즉, 저장된 값이 어떤 타입인지 런타임에 검사할 필요가 없는 거죠.

대신 값을 가져올 때는 명시적으로 타입을 지정해야 합니다.

---

지난 시간에 배운 C++17의 std::any도 하나의 컨테이너에 여러 가지 타입을 담을 수 있었는데요.

C++에서 그런 방법을 제공하는 게 몇 가지 있습니다.

- C 스타일 유니온(union) : 메모리 효율적이지만 단순한 타입에만 적용할 수 있습니다. 복잡한 타입의 경우에는 소멸자(desctuctor)를 직접 호출해야 합니다. 또, 어떤 값을 할당했는지 미리 알아야 합니다.

- 동적 다형성(dynamic polymorphism) : 하나의 종류로 여러 객체가 있을 때 쓰면 좋은 방법입니다. 하지만, 우리가 설계한 타입이 정확히 하나의 인터페이스에만 들어맞지 않을 때 문제가 됩니다.

- std::any : 매우 유연하지만, 동적 메모리 할당이 필요하기 때문에 성능에 영향을 미칩니다.

---

## 문법

std::variant는 템플릿 클래스로 선언되며, 선언 방법은 다음과 같습니다.

```c
std::variant<T1, T2, T3, ...>
```

여기서 T1, T2, T3 등은 std::variant가 저장할 수 있는 타입들입니다.

예를 들어, `std::variant<int, double>`은 int나 double 중 하나의 값을 저장할 수 있다는 뜻이죠.

---

## 사용 예제

### 값 저장

std::variant에 값을 저장하는 예제입니다.

```c
std::variant<int, double> store{123};
```

store 객체는 int 타입이나 double 타입을 저장할 수 있는 컨테이너인데요.

위 예제에서는 int 타입인 123이라는 값이 저장되었습니다.

### 값 접근

```c
double val = std::get<double>(store);
```

std::get 함수를 사용하여 store 객체에서 double 타입의 값을 가져옵니다.

위 코드에서는 `std::get<double>` 함수를 호출했지만, store 객체에 저장된 값이 int인 경우 이 함수를 호출하면 std::bad_variant_access 예외가 발생합니다.

왜냐하면 값에 접근하기 전에 우리는 값의 타입을 알아야 하기 때문이죠.

타입이 일치하지 않을 경우를 대비하여, std::get 함수 대신 std::get_if 함수를 사용할 수도 있습니다.

이 함수는 타입에 맞게 값이 저장된 경우에는 해당 값을 포인터 형태로 반환하고, 타입에 맞지 않을 때는 nullptr를 반환합니다.

```c
auto doubleVal = std::get_if<double>(&store);

if(doubleVal) {
  std::cout<<"storing double:"<<\*doubleVal<<"\n";
}
```

### 값의 타입 확인

std::variant에 저장된 값의 타입을 확인하려면, std::holds_alternative 함수를 사용하면 됩니다.

```c
if(std::holds_alternative<int>(store)) {
  std::cout << "storing int:" << "\n";
```

### 예제 더 살펴보기

```C
std::variant<int, double> store{123};
try {
    std::get<double>(store);
}
catch (const std::bad_variant_access& ex) {
    std::cerr << "invalid type!\n";
}
```

위 코드는 std::variant를 사용하여 int와 double 중 하나의 값을 저장하고 있습니다.

try-catch 블록을 사용해서 예외 체크 해주고 있는데요.

즉, std::get을 이용해 double 값을 가져오려는데 현재 저장된 값이 int인 경우 std::bad_variant_access 예외가 발생합니다.

### 예제 더 살펴보기 2

```C
std::variant<std::string, float, uint8_t, bool> store{"Some txt"};

// get only when type matches
if(auto floatVal = std::get_if<float>(&store); floatVal) {
    std::cout<<"storing float:"<<*floatVal<<"\n";
}

// check the type of stored value
if(std::holds_alternative<uint8_t>(store)) {
    std::cout<<"storing uint8_t:"<<std::get<uint8_t>(store)<<"\n";
}

// get zero-based index of a type provided in variant template parameters
// std::string = 0, float = 1, ...
if(store.index() == 3) {
    std::cout<<"storing bool:"<<std::get<bool>(store)<<"\n";
}
```

위 코드는 std::variant를 사용하여 여러 타입을 저장하고 있습니다.

std::variant가 저장할 수 있는 타입들은 std::string, float, uint8_t, bool 중의 하나인데요.

첫 번째 예에서는 std::get_if를 사용하여, std::variant가 저장하고 있는 값의 타입이 float인 경우에만 값을 가져옵니다.

가져온 값은 auto로 선언된 floatVal 변수에 저장되며, 이후에 출력됩니다.

두 번째 예에서는 std::holds_alternative를 사용하여, std::variant가 저장하고 있는 값의 타입이 uint8_t인지를 확인하고 있습니다.

std::holds_alternative는 bool 값을 반환합니다.

세 번째 예에서는 std::variant가 저장하고 있는 값의 타입에 대한 정보를 알아볼 수 있는 index() 함수인데요.

std::variant에는 여러 타입이 포함될 수 있기 때문에, 각 타입에 대한 인덱스를 가지고 있습니다.

위의 예를 보면 store.index()를 사용하여 현재 저장된 값의 타입에 대한 인덱스를 가져온 다음, 이를 비교하여 std::get을 사용하여 bool 값을 출력합니다.

코드를 읽어보면 아시겠지만 std::variant를 사용하면, 여러 타입을 하나의 변수에 저장할 수 있으며, 필요한 타입을 런타임 시에 가져올 수 있습니다.

또, std::variant가 제공하는 함수들을 이용하여, 저장된 값의 타입을 확인하거나, 특정 타입에 대한 값을 가져올 수 있습니다.

뭔가 만능 컨테이너 같은데요.

### index() 함수

위 예제에서 잠깐 나온 index() 함수 얘기인데요.

아마 index() 함수가 리턴하는 인덱스 값이라는 게 std::variant를 선언할 때 지정했던 타입 순서 그대로 인덱스 값이 형성되는거 같습니다.

실제로도 맞는 말이고요.

std::variant를 선언할 때 지정한 타입 순서대로 인덱스 값이 형성됩니다.

예를 들어 `std::variant<int, double, std::string>`와 같이 정수, 실수, 문자열을 저장할 수 있는 std::variant를 선언한 경우, 정수가 첫 번째 타입이므로 인덱스 값 0을 갖습니다.

이후 double이 두 번째 타입이므로 인덱스 값 1을 갖습니다.

마지막으로 문자열이 세 번째 타입이므로 인덱스 값 2를 갖게 됩니다.

따라서 std::variant 객체에 대해 index() 함수를 호출하면 현재 저장된 타입이 std::variant를 선언할 때 몇 번째 타입인지를 알 수 있습니다.

### index() 함수 예제

```C
std::variant<int, double, std::string> var{10.5};
switch(var.index()) {
    case 0: {
        int value = std::get<int>(var);
        break;
    }
    case 1: {
        double value = std::get<double>(var);
        break;
    }
    case 2: {
        std::string value = std::get<std::string>(var);
        break;
    }
}
```

위 코드는 뭔가 C 같은 코드 같네요. 이제 index() 함수에 대해 이해되셨을 겁니다.

참고로 std::variant는 스택에 메모리를 할당합니다.

---

## std::variant를 사용할 때 주의할 점

std::variant를 사용할 때는 몇 가지 주의할 점이 있습니다.

첫째, std::variant는 C++17에서 도입된 기능이므로, C++17 이전 버전에서는 사용할 수 없습니다.

둘째, std::variant를 사용하면서 주의해야 할 부분 중 하나는 exception입니다.

예를 들어, `std::get<>` 함수를 사용하여 variant 내부에 저장된 값을 가져오려는 경우, 해당 값의 타입과 일치하지 않는 타입을 지정하면 std::bad_variant_access 예외가 발생합니다.

따라서 예외 처리를 적절히 해주어야 합니다.

셋째, std::variant는 각각의 값의 소멸자(destructor)를 호출하는 기능을 제공합니다.

이를 이용하면 값이 소멸되는 시점을 알 수 있으므로 메모리 누수 등의 문제를 방지할 수 있습니다.

하지만, 이 기능을 사용하면서 주의해야 할 점은 소멸자를 직접 호출해주어야 한다는 것입니다.

관련 예제입니다.

```C
#include <variant>
#include <iostream>

struct Foo {
    Foo() { std::cout << "Foo constructed\n"; }
    ~Foo() { std::cout << "Foo destroyed\n"; }
};

int main() {
    std::variant<int, Foo> v;
    v = Foo();
    v.emplace<int>(42);
    std::visit([](auto&& arg) {
        using T = std::decay_t<decltype(arg)>;
        if constexpr (std::is_same_v<T, Foo>) {
            std::cout << "v contains a Foo\n";
        } else {
            std::cout << "v contains an int: " << arg << '\n';
        }
    }, v);
    std::cout << "Before reset\n";
    v = Foo();
    std::cout << "After reset\n";
}
```

위 코드는 std::variant를 사용하는 예제 코드인데요.

위 코드에서는 int와 Foo를 저장할 수 있는 std::variant를 만들었습니다.

Foo는 생성자와 소멸자가 출력을 하는 간단한 클래스인데요.

코드를 계속 따라가 보면 변수 v에 Foo 객체를 할당하고, emplace 함수를 사용하여 int를 저장하고 있습니다.

std::visit를 사용하여 v에 저장된 값을 확인하고 있습니다.

std::visit는 std::variant에 저장된 값에 대한 동작을 수행할 수 있는 함수입니다.

람다 함수를 사용하여 std::visit를 호출하고 있습니다.

람다 함수에서는 std::is_same_v를 사용하여 std::variant에 저장된 타입이 Foo 인지 int인지 확인하고 있습니다.

마지막으로, v를 Foo 객체로 다시 할당하고 있습니다.

Foo 객체는 생성자와 소멸자에서 출력을 하는데, 출력 결과를 확인하면 std::variant가 잘 동작하는 것을 확인할 수 있습니다.

#### 실행결과

```bash
➜  cpp g++ -std=c++17 main.cpp -o main
➜  cpp ./main
Foo constructed
Foo destroyed
Foo destroyed
v contains an int: 42
Before reset
Foo constructed
Foo destroyed
After reset
Foo destroyed
➜  cpp
```

## std::variant의 성능

std::variant는 매우 편리하고 유용한 기능이지만, 일부 상황에서는 성능상의 이유로 std::variant를 사용하지 않는 것이 좋다고 합니다.

예를 들어, std::variant를 사용하는 경우, 값에 대한 접근 시간이 더 느려질 수 있습니다.

이는 값의 접근 시점에서 std::variant 내부에 저장된 값의 타입을 판별해야 하기 때문입니다.

또한, std::variant를 사용하는 경우, 일부 메모리를 추가로 사용해야 하므로, 메모리 사용량이 더 늘어날 수 있습니다.

이런 이유로, 성능이 매우 중요한 프로그램에서는 std::variant를 사용하지 않는 것이 좋습니다.

하지만, 이런 특별한 경우 아니고는 std::variant를 사용하는 것이 좋습니다.

특히, 유연성과 안전성 측면에서 std::variant는 매우 우수한 성능을 발휘합니다.

---

### std::variant와 std::any의 차이점

std::variant 과 유사한 기능을 하는 C++ 표준 라이브러리의 다른 타입으로는 std::any가 있습니다.

두 타입은 모두 C++17에서 추가되었으며, 동적 타입 시스템을 제공하면서도, 컴파일 타임에서 타입 안정성을 보장합니다.

하지만 두 타입은 약간의 차이점이 있는데요.

#### 타입 안정성

std::variant은 생성시점에 컴파일 타임에 어떤 타입을 가질 수 있는지에 대한 정보를 명시하므로, 이를 런 타임에 변경할 수 없습니다.

즉, 유한한 타입들의 집합에서만 사용할 수 있습니다.

그러나 std::any는 어떤 타입이든지 컴파일 타임에 알 필요 없이, 런 타임에 유동적으로 값을 저장할 수 있습니다.

따라서 std::any는 유한한 타입의 집합이 아니라 모든 타입을 다루어야 하는 경우에 유용합니다.

#### 값 복사 vs. 값 참조

std::variant은 저장된 값의 복사본을 생성합니다.

그래서 메모리 사용량이 더 많아질 수 있습니다.

반면 std::any는 저장된 값의 참조를 유지합니다.

결과적으로 std::any가 더 적은 메모리 사용량을 갖습니다.

#### 복잡성

std::variant은 특정 타입에 대한 접근을 보장하기 위해 특정 타입의 인덱스를 사용합니다.

반면 std::any는 어떤 타입이 저장되었는지 동적으로 판별합니다.

이는 std::variant가 더 빠르고 간단한 구현을 갖는 것과 대조적입니다.

따라서, std::variant은 저장할 수 있는 타입의 집합이 작고 런 타임에 변경되지 않는 경우에 적합하며, std::any는 런 타임에 유동적인 타입을 다룰 필요가 있는 경우에 적합합니다.

---

## 예제 std::variant를 사용하여 command line parser 만들기

아래 코드는 프로그램 실행 시 인자로 -f와 -c를 받아 각각 문자열과 정수값을 Option 구조체에 저장하고, 저장된 값을 출력합니다.

std::variant를 사용하여 Option 구조체 내부의 값을 타입 안전하게 처리하고 있습니다.

```C
#include <iostream>
#include <string>
#include <variant>

struct Option {
    std::variant<int, double, std::string> value;
    bool is_set = false;
};

int main(int argc, char *argv[]) {
    Option file_option;
    Option count_option;

    for (int i = 1; i < argc; i++) {
        std::string arg = argv[i];
        if (arg == "-f" && i + 1 < argc) {
            file_option.value = argv[++i];
            file_option.is_set = true;
        } else if (arg == "-c" && i + 1 < argc) {
            count_option.value = std::stoi(argv[++i]);
            count_option.is_set = true;
        } else {
            std::cerr << "Invalid argument: " << arg << std::endl;
            return 1;
        }
    }

    if (!file_option.is_set) {
        std::cerr << "Please specify a file with -f" << std::endl;
        return 1;
    }

    std::cout << "File: " << std::get<std::string>(file_option.value) << std::endl;

    if (count_option.is_set) {
        std::cout << "Count: " << std::get<int>(count_option.value) << std::endl;
    }

    return 0;
}

```

지금까지 std::variant에 대해 알아봤는데요.

많은 도움이 되셨으면 합니다.

