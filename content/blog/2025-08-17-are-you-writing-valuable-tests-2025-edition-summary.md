---
slug: 2025-08-17-are-you-writing-valuable-tests-2025-edition-summary
title: NDC Oslo 2025 - 당신의 테스트는 안녕한가요? 가치 있는 테스트 작성법
date: 2025-08-19 14:13:25.909000+00:00
summary: "테스트 코드가 어느새 짐이 되어버렸나요? 개발 속도를 높여주고 프로덕션 배포에 자신감을 심어주는 '가치 있는 테스트'의 4가지 속성과 구체적인 작성법을 Egil Hansen의 강연을 통해 깊이 있게 살펴봅니다."
tags: ["테스트", "TDD", "유닛 테스트", "리팩토링", "클린 코드", "C#"]
contributors: []
draft: false
---

![](https://img.youtube.com/vi/z7TyPa8JbG8/maxresdefault.jpg)
[NDC Oslo 2025 유튜브 링크](https://www.youtube.com/watch?v=z7TyPa8JbG8)

여기 아주 좋은 유튜브 강연이 있는데요, 이 강연의 핵심만 전체적으로 살펴볼까 합니다.<br /><br />
개발자라면 누구나 테스트 코드 때문에 골머리를 앓아본 경험이 있을 거예요.<br /><br />어느 순간부터 테스트는 우리를 돕는 도구가 아니라, 유지보수해야 할 또 하나의 짐처럼 느껴지기도 하죠.<br /><br />발표자인 Egil Hansen은 테스트 코드도 운영 코드와 마찬가지로 '부채(liability)'라고 말하는데요.<br /><br />만들고, 유지하고, 계속해서 관리해야 하는 대상이라는 거죠.<br /><br />그래서 우리가 작성하는 테스트가 정말로 '가치'를 제공하는지 신중하게 고민해야 한다고 강조합니다.<br /><br />모든 테스트가 똑같이 만들어지는 건 아니거든요.<br /><br />어떤 테스트는 다른 테스트보다 훨씬 더 큰 가치를 제공하죠.<br /><br />궁극적으로 테스트 스위트는 우리에게 '자신감'을 줘야 하는데요.<br /><br />운영 환경에 코드를 배포할 자신감, 그리고 우리 코드가 의도한 대로 정확히 동작하고 있다는 확신 말입니다.<br /><br />바로 그 지점에 도달했을 때, 우리는 비로소 '가치 있는 테스트'를 가졌다고 말할 수 있는 거예요.<br /><br />

## 가치 있는 테스트의 4가지 속성
발표자는 가치 있는 테스트를 정의하는 4가지 핵심 속성을 소개하는데요.<br /><br />바로 '회귀(Regression) 방지', '리팩토링 저항성', '빠른 피드백', 그리고 '유지보수성'입니다.<br /><br />이 개념들은 Vladimir Khorikov의 'Unit Testing Principles, Patterns, and Practices'라는 책에서 아주 잘 정리되어 있다고 하더라고요.<br /><br />하나씩 자세히 뜯어보죠.<br /><br />

### 1. 회귀(Regression) 방지
회귀는 의도치 않은 변경으로 인해 시스템이 망가지는 현상을 말하는데요.<br /><br />이걸 막는 능력은 테스트의 '범위(scope)'와 직결됩니다.<br /><br />핵심 비즈니스 로직만 테스트하는 좁은 범위의 유닛 테스트도 어느 정도의 회귀 방지 효과는 있죠.<br /><br />하지만 테스트 범위를 넓혀서 서드파티 라이브러리나 외부 의존성까지 포함하는 통합 테스트나 엔드투엔드 테스트를 작성하면, 회귀 방지 능력은 훨씬 더 강력해집니다.<br /><br />예를 들어, 우리가 사용하는 라이브러리의 다음 버전을 설치했을 때, 통합 테스트가 있다면 해당 라이브러리를 사용하는 코드까지 모두 검증해주거든요.<br /><br />덕분에 '업그레이드해도 우리 애플리케이션은 여전히 잘 동작하는구나'하는 자신감을 얻을 수 있는 거예요.<br /><br />물론 코드 커버리지 100%가 항상 정답은 아닙니다.<br /><br />테스트 코드를 추가하는 것 역시 비용이니까요.<br /><br />중요한 건 우리 시스템에 맞는 적절한 균형점을 찾는 겁니다.<br /><br />

### 2. 리팩토링 저항성
리팩토링은 코드의 겉으로 보이는 동작은 바꾸지 않으면서 내부 구조를 개선하는 작업을 말하는데요.<br /><br />'리팩토링 저항성'이 높다는 건, 코드의 '구현 디테일'을 바꿨다고 해서 테스트가 깨지지 않아야 한다는 뜻입니다.<br /><br />이게 정말 중요한데요.<br /><br />운영 코드의 내부 로직을 좀 바꿨을 뿐인데 관련 없는 테스트들이 우수수 깨지는 경험, 다들 한 번쯤은 있으실 거예요.<br /><br />이렇게 되면 개발 속도는 현저히 느려지죠.<br /><br />더 큰 문제는, 운영 코드와 테스트 코드를 동시에 수정해야 하는 위험한 상황에 놓인다는 겁니다.<br /><br />어느 한쪽도 다른 쪽을 검증해 줄 수 없는 상태가 되기 때문에, 실수로 시스템의 동작을 바꿔버릴 위험이 아주 커지는 거예요.<br /><br />

### 3. 빠른 피드백
테스트의 가치는 테스트를 '실행할 때' 발현되는데요.<br /><br />테스트 실행 속도가 빠를수록 우리는 더 자주 테스트를 돌리게 되고, 그만큼 더 많은 가치를 얻게 됩니다.<br /><br />Martin Fowler가 '리팩토링' 책에서 강조한 것처럼, 작업을 할 때는 아주 작은 단위로 변경하고, 컴파일하고, 테스트를 실행하는 습관이 중요하더라고요.<br /><br />만약 몇 시간 동안 이것저것 수정한 뒤에 테스트를 돌렸는데 수많은 테스트가 깨진다면 어떨까요?<br /><br />몇 시간 동안의 변경 사항을 전부 되짚어보며 디버거를 켜고 코드를 한 줄 한 줄 따라가야 할 겁니다.<br /><br />이런 시간 낭비를 막아주는 게 바로 '빠른 피드백'이죠.<br /><br />테스트 스위트가 아주 빠르다면, 몇 분 정도의 작은 변경 후에 바로 테스트를 돌려볼 수 있거든요.<br /><br />문제가 생겨도 방금 작업한 내용이 머릿속에 생생하게 남아있으니, 디버거 없이도 문제의 원인을 바로 찾아낼 수 있는 겁니다.<br /><br />

### 4. 유지보수성
마지막은 테스트 코드 자체의 '유지보수성'인데요.<br /><br />테스트는 이해하기 쉬워야 하고, 실행하기 쉬워야 하며, 수정하기도 쉬워야 합니다.<br /><br />특정 테스트 메서드만 봐도 '이 테스트가 무엇을 검증하려 하는가?'가 명확히 보여야 하죠.<br /><br />새로운 프로젝트를 받아서 테스트를 돌리려는데, 온갖 추가 도구를 설치해야 하거나 특정 데이터베이스에 의존해야 한다면 정말 끔찍할 거예요.<br /><br />또한 테스트는 '결정론적(Deterministic)'이어야 합니다.<br /><br />내 컴퓨터에서는 잘 돌아가던 테스트가 CI 파이프라인에서는 실패하는 '변덕스러운 테스트'는 최악이죠.<br /><br />이런 테스트는 신뢰를 잃게 만들고, 결국 아무도 신경 쓰지 않게 됩니다.<br /><br />

## 완벽한 테스트는 없다, 우선순위를 정하자
발표자는 한 가지 중요한 사실을 짚어주는데요.<br /><br />바로 '완벽한 테스트는 없다'는 겁니다.<br /><br />앞서 말한 속성 중 '회귀 방지', '리팩토링 저항성', '빠른 피드백' 이 세 가지는 어느 정도 서로 상충 관계에 있거든요.<br /><br />예를 들어, 회귀 방지와 리팩토링 저항성을 극대화하려면 넓은 범위를 다루는 엔드투엔드 테스트가 좋지만, 이건 피드백 속도가 느릴 수밖에 없죠.<br /><br />반대로 빠른 피드백을 원하면 유닛 테스트가 좋지만, 이건 회귀 방지 범위가 좁아집니다.<br /><br />그래서 발표자는 우선순위를 정하라고 조언하는데요.<br /><br />최우선 순위는 무조건 '유지보수성'입니다.<br /><br />그다음으로는 '리팩토링 저항성'을 우선하라고 하더라고요.<br /><br />왜냐하면 리팩토링에 강한 테스트를 작성하려고 노력하다 보면, 자연스럽게 운영 코드도 테스트하기 좋은 구조로 설계하게 되거든요.<br /><br />결과적으로 운영 코드의 유지보수성까지 함께 올라가는 이중 효과를 누릴 수 있는 거죠.<br /><br />

## 가치 있는 테스트를 위한 레시피
자, 이제 이론은 충분히 다뤘으니 실전 레시피를 살펴볼 시간이죠.<br /><br />

### 레시피 1 - 테스트 이름 짓기
가장 논란이 많은 주제, 바로 이름 짓기입니다.<br /><br />'비어있는 쇼핑 카트에 아이템을 추가하는' 시나리오를 테스트한다고 가정해 보죠.<br /><br />테스트 이름을 어떻게 지으시겠어요?<br /><br />아마 많은 분들이 `When_AddingItem_To_EmptyCart_Then_CartIsNotEmpty` 와 같은 형식을 사용하고 계실 텐데요.<br /><br />발표자의 추천은 놀랍게도 아주 단순합니다.<br /><br />바로 `add_item_to_empty_shopping_card` 입니다.<br /><br />예상 결과나 시스템의 상태를 이름에 포함하지 않는 거죠.<br /><br />왜냐하면 테스트의 이름은 '비즈니스 시나리오'에 집중해야 하고, 시나리오는 구현 디테일보다 덜 변하기 때문입니다.<br /><br />Mark Seemann의 말을 빌리자면, 테스트 이름은 코드가 '무엇을' 하는지 설명하는 게 아니라 '왜' 존재하는지를 설명하는 주석과 같아야 하거든요.<br /><br />만약 테스트 이름이 길어지고 복잡해진다면, 그건 테스트 자체가 이해하기 어렵다는 신호일 수 있습니다.<br /><br />

### 레시피 2 - Arrange-Act-Assert (AAA) 패턴 활용하기
테스트 메서드 내부 구조는 '준비(Arrange) - 실행(Act) - 검증(Assert)'의 세 단계로 명확히 나누는 것이 좋은데요.<br /><br />발표자는 각 섹션을 주석으로 나누기보다는, 그냥 빈 줄(whitespace)로 구분하는 걸 선호한다고 하더라고요.<br /><br />물론 `Arrange` 부분이 아주 길어지는 통합 테스트 같은 경우에는 주석을 추가해서 가독성을 높이는 것도 좋은 방법입니다.<br /><br />

### 레시피 3 - 복잡한 Arrange 섹션 다루기
테스트가 복잡해질수록 `Arrange` 섹션은 비대해지기 마련인데요.<br /><br />이럴 때 도움이 되는 두 가지 패턴이 있습니다.<br /><br />첫 번째는 테스트 클래스 내부에 정적 팩토리 메서드를 만드는 거예요.<br /><br />
```csharp
// 복잡한 Arrange 섹션
var customer = new Customer { Membership = Membership.Gold };
var orderHistory = new OrderHistory(customer.Id, ...);
_db.Orders.Add(orderHistory);
_sut.Customer = customer;

// 정적 팩토리 메서드 사용
var customer = ACustomer.WithOrdersAndMembership(Membership.Gold);
_sut.Customer = customer;
```
<br />
복잡한 객체 생성 로직을 `ACustomer.WithOrdersAndMembership()` 같은 이름이 명확한 메서드로 캡슐화하는 거죠.<br /><br />이렇게 하면 테스트의 의도가 훨씬 명확해집니다.<br /><br />두 번째는 '테스트 데이터 빌더' 패턴인데요.<br /><br />
```csharp
var customer = new CustomerBuilder()
                    .WithGoldMembership()
                    .WithPreviousOrders(5)
                    .Build();
```
<br />
빌더 패턴을 사용하면 필요한 데이터만 메서드 체이닝 방식으로 설정할 수 있어서, 각 테스트에 필요한 데이터를 더 유연하고 명확하게 만들 수 있습니다.<br /><br />

### 레시피 4 - 단 한 줄의 Act 섹션
`Act` 섹션은 가능한 한 짧게, 가급적이면 한 줄로 유지하는 것이 좋습니다.<br /><br />만약 `Act` 단계에서 여러 메서드를 호출해야 한다면, 그건 아마도 운영 코드의 설계가 잘못되었다는 신호일 수 있거든요.<br /><br />예를 들어 아이템을 추가한 뒤, 할인을 적용하기 위해 `UpdateDiscount()` 같은 메서드를 따로 호출해야 한다면, 이 두 가지는 사실 하나의 동작으로 합쳐져야 마땅하죠.<br /><br />

### 레시피 5 - Assert 섹션과 스냅샷 테스팅
`Assert` 섹션에서는 '단일 동작 단위(single unit of behavior)'를 검증해야 하는데요.<br /><br />이게 '단일 검증문(single assertion statement)'을 의미하는 건 아닙니다.<br /><br />예를 들어, 골드 고객이 상품을 추가했을 때 '올바른 할인이 적용되었는지', '상품 수량은 맞는지', '총액은 정확한지'를 검증하는 것은 모두 논리적으로 하나의 동작에 속하죠.<br /><br />이때 '스냅샷 테스팅'이라는 기법이 아주 유용한데요.<br /><br />
```csharp
[Fact]
public Task add_item_to_empty_shopping_card()
{
    // Arrange
    var sut = new ShoppingCart(ACustomer.AsGold());
    var item = new Item("Flux Capacitor", 1, 121000);

    // Act
    sut.AddItem(item);

    // Assert
    return Verify(sut);
}
```
<br />
`Verify(sut)`를 호출하면, `sut` 객체의 현재 상태가 파일로 저장됩니다.<br /><br />다음 테스트 실행 시에는 현재 객체 상태와 이전에 저장된 파일(스냅샷)을 비교해서 일치하는지 확인하는 방식이죠.<br /><br />API 스키마 전체를 검증하는 등 복잡한 객체를 다룰 때 정말 강력한데요.<br /><br />하지만 단점도 명확합니다.<br /><br />검증 로직이 테스트 메서드 외부 파일에 있어서 컨텍스트를 파악하기 어렵고, 관련 없는 속성 하나만 바뀌어도 테스트가 깨져서 리팩토링 저항성이 낮아질 수 있죠.<br /><br />그래서 발표자는 두 가지 기법을 혼합하는 걸 추천하더라고요.<br /><br />가장 중요한 핵심 로직은 기존처럼 명시적인 `Assert` 구문으로 검증하고, 나머지 전체적인 상태는 스냅샷으로 확인하는 거죠.<br /><br />이렇게 하면 가독성과 안정성, 두 마리 토끼를 모두 잡을 수 있습니다.<br /><br />

### 레시피 6 - 협력객체(Collaborator) 다루기 - Mock vs Fake
우리 코드는 대부분 다른 객체, 즉 '협력객체'와 함께 동작하는데요.<br /><br />이 협력객체를 어떻게 다루느냐가 테스트의 품질을 좌우합니다.<br /><br />발표자는 '외부에서 관찰 가능한 동작'만 테스트하고, '구현 디테일'은 테스트에서 제외해야 한다고 강조하더라고요.<br /><br />예를 들어, 결제 제공업체나 이메일 서비스는 시스템 외부의 사용자에게 직접적인 영향을 주므로 '외부에서 관찰 가능한' 협력객체입니다.<br /><br />이런 것들은 테스트에서 모의(Mock) 객체로 만들고, 상호작용을 검증하는 것이 타당하죠.<br /><br />하지만 데이터베이스는 어떨까요?<br /><br />만약 그 데이터베이스를 우리 시스템만 사용한다면, 그건 '구현 디테일'입니다.<br /><br />이런 구현 디테일은 가능하면 테스트에서 직접 다루지 않는 것이 리팩토링 저항성을 높이는 길이죠.<br /><br />이때 협력객체를 대체하기 위해 우리는 '테스트 더블(Test Double)'을 사용하는데요, 대표적으로 'Mock'과 'Fake' 방식이 있습니다.<br /><br />`Moq` 같은 라이브러리를 사용한 Mock 방식의 테스트는 이렇게 생겼습니다.<br /><br />
```csharp
[Fact]
public void create_customer_with_mock()
{
    // Arrange
    var repoMock = new Mock<ICustomerRepository>();
    repoMock.Setup(x => x.CreateAsync(It.IsAny<Customer>()))
            .ReturnsAsync(new Customer { Id = 1 });

    var sut = new CustomerService(repoMock.Object);

    // Act
    var customer = sut.Create("Egil", "egil@example.com");

    // Assert
    Assert.NotEqual(0, customer.Id);
    repoMock.Verify(x => x.CreateAsync(It.IsAny<Customer>()), Times.Once());
}
```
<br />
`Setup`을 통해 Mock 객체의 동작을 일일이 정의해야 하고, `Verify`를 통해 메서드가 정확히 한 번 호출되었는지 같은 '상호작용'을 검증합니다.<br /><br />이는 테스트가 운영 코드의 '구현 방식'에 너무 깊게 관여하게 만들어, 테스트를 깨지기 쉽게(fragile) 만들죠.<br /><br />반면, 직접 만든 가짜 구현체, 즉 'Fake'를 사용하는 방식은 다릅니다.<br /><br />
```csharp
// Fake 구현체
public class FakeCustomerRepository : ICustomerRepository
{
    public List<Customer> Customers = new();
    private int _nextId = 1;

    public Task<Customer> CreateAsync(Customer customer)
    {
        customer.Id = _nextId++;
        Customers.Add(customer);
        return Task.FromResult(customer);
    }
}

// Fake를 사용한 테스트
[Fact]
public void create_customer_with_fake()
{
    // Arrange
    var fakeRepo = new FakeCustomerRepository();
    var sut = new CustomerService(fakeRepo);

    // Act
    var customer = sut.Create("Egil", "egil@example.com");

    // Assert
    Assert.NotEqual(0, customer.Id);
    Assert.Single(fakeRepo.Customers);
}
```
<br />
테스트 코드가 훨씬 간결하고 직관적이죠?<br /><br />Fake 객체를 만드는 수고가 조금 들지만, 일단 만들어두면 여러 테스트에서 재사용하기 쉽고, 테스트는 훨씬 더 읽기 좋아집니다.<br /><br />만약 `ICustomerRepository` 인터페이스에 메서드가 추가되어도, 수많은 테스트의 `Setup` 코드를 고치는 대신 `FakeCustomerRepository` 클래스 하나만 수정하면 되니 유지보수성 측면에서 압도적으로 유리한 거예요.<br /><br />

## 마무리하며
발표자가 추천한 책들도 공유해 드릴게요.<br /><br />오늘 다룬 내용의 이론적 배경이 궁금하시다면 Vladimir Khorikov의 'Unit Testing Principles, Patterns, and Practices'를, 테스트 가능한 시스템 아키텍처까지 아우르는 전체적인 시각을 원하신다면 Mark Seemann의 'Code That Fits in Your Head'를 추천하더라고요.<br /><br />물론 Martin Fowler의 'Refactoring'도 빼놓을 수 없죠.<br /><br />결국 '가치 있는 테스트'란 우리에게 자신감을 주고, 개발 속도를 늦추는 대신 오히려 가속해 주는 테스트입니다.<br /><br />오늘 살펴본 원칙과 레시피들이 여러분의 테스트 스위트를 '부채'에서 '자산'으로 바꾸는 데 작은 도움이 되었으면 좋겠네요.<br /><br />