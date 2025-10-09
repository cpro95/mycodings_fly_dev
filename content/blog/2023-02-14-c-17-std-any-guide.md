---
slug: 2023-02-14-c-17-std-any-guide
title: "C++17 std::any 공부하기"
date: 2023-02-14 11:54:04.648000+00:00
summary: "모던 C++ 공부에 있어 중요한 std::any 공부하기"
tags: ["c++", "c++17", "std::any"]
contributors: []
draft: false
---

안녕하세요?

최근 C++ 공부를 다시 시작했는데요. 정확히 말하자면 모던 C++입니다.

예전에 배웠던 98 버전 C++에 머물러 있던 저였지만 최근 뭔가 모던 C++을 이용해서 빠른 애플리케이션을 만들고 싶은 생각이 들어 틈틈히 공부하기 시작했습니다.

오늘은 그 첫 번째로 std::any에 대해 알아보겠습니다.

자바스크립트나 파이썬에서는 변수가 다양한 타입을 담을 수 있는 그릇인데요.

간단한 프로그램에서는 정말 편합니다.

그러나 결국에는 타입스크립트로 전향하게 됩니다.

너무 위험하거든요.

---

그럼, 자바스크립트나 파이선처럼 C++에서도 임의의 타입 값을 담을 수 있는 변수가 있을까요?

딱 생각나는 건 보이드 포인터(void\*) 정도겠네요.

void\* 를 쓰려면 유의할 게 많은데요.

새 값을 할당하기 전에 내부에 값이 있는지 확인해야 하고, 이전에 할당한 값을 없애줘야 하는 번거로움이 있습니다.

그런데 C++17에서 드디어 void\* 를 대체할 수 있는 클래스가 나왔습니다.

바로 std::any인데요.

이름에서도 알 수 있듯이 (any) 어떤 값도 담을 수 있는 컨테이너입니다.

---

C++17에 소개된 std::any는 type-safe 컨테이너인데요.

다양한 타입의 값을 저장할 수 있으며, 또는 빈 상태일 수도 있고, 그리고 저장된 객체의 타입(type)을 기억하고 있습니다.

또, 컴파일 시 객체의 정확한 타입을 알 필요가 없다는 게 가장 큰 이점입니다.

그래서 모던 C++에서는 std::any가 조금은 안전하지 않은 보이드포인터(void\*)의 완전한 대체제로 많이 사용되고 있습니다.

헤더 파일은 `<any>` 헤더입니다.

std::any의 주요 목적은 타입 캐스팅 없이 다른 데이터 타입의 값을 하나의 컨테이너에 저장할 방법을 제공한다는 점에서 아주 획기적인 클래스인데요.

### 주요 기능을 3가지로 요약할 수 있는데요.

1. std::any 객체에 저장된 값의 타입은 std::any_cast를 사용하여 얻을 수 있습니다. 저장된 값의 타입이 요청한 타입과 일치하지 않으면 std::bad_any_cast가 발생합니다.

2. std::any 컨테이너는 저장된 객체의 lifetime을 관리하며, std::any 객체가 유효 범위를 벗어날 때 저장된 객체가 차지하는 메모리를 해제합니다.

3. std::any는 저장된 객체에 대한 복사 및 이동 시맨틱을 지원하여 다양한 유형의 값을 저장하고 검색하기 쉬워집니다.

그럼 간단한 예를 볼까요?

```cpp
#include <any>
#include <iostream>

int main()
{
    std::any a = 10;
    std::cout << std::any_cast<int>(a) << '\n';

    a = std::string("hello");
    std::cout << std::any_cast<std::string>(a) << '\n';

    return 0;
}
```

컴파일하려면 c++17 옵션을 적용해야 합니다.

```bash
g++ -std=c++17 main.cpp -o main
```

std::any 컨테이너는 저장할 때는 아무 값이나 저장 가능한데, 그걸 사용할 때는 무슨 타입인지 정확히 알고 사용해야 합니다.

그래서 std::any 컨테이너에 있는 값을 사용하려면 std::any_cast를 이용해야 하는데요.

꼭 무슨 타입인지 알고 그 타입으로 캐스팅해야 합니다.

**_주의사항: std::any에 저장되는 값이 기본 int 같은 베이직한 값이라면 스택에 저장될 거고, 만약 조금 더 복잡한 객체라면 동적으로 할당된 힙에 저장됩니다._**

---

좀 더 다양한 함수를 살펴볼까요?

```cpp
{
    std::any someVal;
    if (!someVal.has_value()) {
        std::cout<<"any has no value assigned\n";
    }

    someVal = 234;
    someVal.reset();

    if (!someVal.has_value()) {
        std::cout<<"still has no value because of reset\n";
    }

    {
    std::any someVal = 1.23f;

    if(someVal.type() == typeid(float)) {
        std::cout<<"Contains float with value: "
                 <<std::any_cast<float>(someVal) <<"\n";
    }
    else {
        std::cout<<"Contains something else\n";
    }

    std::any someVal2 = 1.23f;
    someVal2.emplace<std::string>("hello");
}
```

has_value() 함수로 값이 있는지 없는지 체크할 수 있고,

reset() 함수로 초기화할 수 도 있습니다.

type() 함수와 typeid 함수로 사전에 타입을 정확히 하고 진행하는 게 좋습니다.

emplace() 함수로 다른 값으로 저장할 수 도 있습니다.

---

## std::any 컨테이너는 언제 사용하는 게 좋을까요?

std::any 컨테이너는 런타임에서만 알 수 있는 다양한 유형의 타입을 저장할 때 쓰면 좋습니다.

예를 들어,

1. 라이브러리를 통해 사용자 데이터를 전달하지만, 그것의 정확한 유형을 알 수 없을 때
2. 자바스크립트 같은 스크립팅 언어와의 바인딩
3. 설정 파일에서 불러온 값의 데이터 저장 - 지원되는 모든 타입의 유형을 지정할 수 없을 때
4. 콜백 핸들러에 컨텍스트 데이터로 넘겨줄 때

입니다.

콜백/노티파이 관련 예제를 볼까요?

```cpp
class IListener {
public:
    virtual ~IListener() = default;
    virtual void receiveNotification(std::any context) = 0;
};

class Notifier {
public:
    void registerListener(uint32_t id, IListener& listener, std::any && context);
};

class Listener: public IListener {
public:
    Listener(Notifier & notifier) {
        std::any myContextData = std::string{"someString"};
        // register your class to receive notifications
        notifier.registerListener(123, *this, std::move(myContextData));
    }
    void receiveNotification(std::any context) {
        // access to your data
        auto myContextData = std::any_cast<std::string>(context);
    }
};
```

---

## std::any를 쓰지 않아야 할 경우는?

만약, 모든 타입을 알고 있다면 굳이 std::any 컨테이너를 쓸 필요가 없습니다.

그리고 성능상 문제가 될 수 있기 때문에 힙에 저장되는 대형 데이터는 되도록 피하는 게 좋습니다.

그럼.
