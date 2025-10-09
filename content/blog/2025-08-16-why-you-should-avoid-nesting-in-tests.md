---
slug: 2025-08-16-why-you-should-avoid-nesting-in-tests
title: 그 테스트 코드, 왜 읽기 힘든지 알려드릴까요
date: 2025-08-17 05:48:50.675000+00:00
summary: 테스트 코드만 보면 머리가 아픈가요? describe와 beforeEach의 무분별한 중첩이 어떻게 테스트의 가독성을 해치는지, 그리고 명확성을 되찾는 AHA 테스트 원칙과 함수형 접근법을 Kent C. Dodds의 아티클을 통해 깊이 있게 파헤쳐 봅니다.
tags: ["테스트 코드", "Jest", "Vitest", "React Testing Library", "가독성", "AHA 원칙"]
contributors: []
draft: false
---

테스트 코드 짤 때 `describe`로 케이스를 그룹 짓고, `beforeEach`로 공통 로직을 싹 빼내는 게 거의 '국룰'처럼 여겨지는데요.<br /><br />
깔끔해 보이고, 코드 중복도 줄여주니 안 쓸 이유가 없어 보이죠.<br /><br />
근데 이게 사실은 우리도 모르게 테스트를 점점 더 해독하기 어려운 암호문으로 만드는 주범일 수 있다는 사실, 알고 계셨나요?<br /><br />
오늘은 저명한 개발자인 Kent C. Dodds의 글을 바탕으로, 왜 테스트 코드의 '중첩'을 피해야 하는지, 그리고 더 나은 대안은 무엇인지 제대로 한번 파헤쳐 보겠습니다.<br /><br />

## 우리가 흔히 마주치는 테스트 코드

먼저 우리가 테스트하려는 간단한 로그인 컴포넌트가 있다고 해보죠.<br /><br />
유저네임과 패스워드를 입력받고, 제출하면 `onSubmit` 함수를 호출하는 아주 전형적인 형태입니다.<br /><br />
이 컴포넌트를 위해 많은 개발자들이 아래와 같은 구조로 테스트를 작성하는데요.<br /><br />

```javascript
describe("Login", () => {
  let utils, handleSubmit, user, changeUsernameInput, changePasswordInput, clickSubmit;

  beforeEach(() => {
    handleSubmit = jest.fn();
    user = { username: "michelle", password: "smith" };
    utils = render(<Login onSubmit={handleSubmit} />);
    changeUsernameInput = (value) =>
      userEvent.type(utils.getByLabelText(/username/i), value);
    changePasswordInput = (value) =>
      userEvent.type(utils.getByLabelText(/password/i), value);
    clickSubmit = () => userEvent.click(utils.getByText(/submit/i));
  });

  describe("유저네임과 패스워드가 제공된 경우", () => {
    beforeEach(() => {
      changeUsernameInput(user.username);
      changePasswordInput(user.password);
    });

    describe("제출 버튼이 클릭됐을 때", () => {
      beforeEach(() => {
        clickSubmit();
      });

      it("유저네임과 패스워드로 onSubmit이 호출된다", () => {
        expect(handleSubmit).toHaveBeenCalledTimes(1);
        expect(handleSubmit).toHaveBeenCalledWith(user);
      });
    });
  });

  describe("패스워드가 제공되지 않은 경우", () => {
    beforeEach(() => {
      changeUsernameInput(user.username);
    });

    describe("제출 버튼이 클릭됐을 때", () => {
      beforeEach(() => {
        clickSubmit();
      });

      it("에러 메시지가 표시된다", () => {
        const errorMessage = utils.getByRole("alert");
        expect(errorMessage).toHaveTextContent(/password is required/i);
      });
    });
  });
  // ... 유저네임이 없는 경우 테스트 생략 ...
});
```

`describe`가 3단계까지 중첩되고, 각 단계마다 `beforeEach`가 등장하는 구조, 정말 익숙하지 않나요?<br /><br />
이 테스트는 분명히 잘 '동작'은 합니다.<br /><br />
하지만 동작하는 것과 '유지보수하기 좋은 것'은 전혀 다른 이야기죠.<br /><br />

## 이 코드가 우리를 괴롭히는 이유

이 테스트 코드의 가장 큰 문제는 '인지 부하(Cognitive Load)'를 엄청나게 높인다는 건데요.<br /><br />
딱 하나의 `it` 블록, 예를 들어 맨 위에 있는 "onSubmit이 호출된다"는 테스트를 이해하려고 한번 시도해 보죠.<br /><br />
```javascript
it("유저네임과 패스워드로 onSubmit이 호출된다", () => {
  expect(handleSubmit).toHaveBeenCalledTimes(1);
  expect(handleSubmit).toHaveBeenCalledWith(user);
});
```

이 두 줄을 이해하려면, `handleSubmit`이 뭐고 `user`가 뭔지 알아야 하거든요.<br /><br />
그럼 우리는 스크롤을 위로 올려 `let handleSubmit, user` 선언부를 찾고, 다시 그 아래 `beforeEach`에서 이 변수들이 어떻게 초기화되는지 확인해야 합니다.<br /><br />
하지만 그걸로 끝이 아니죠.<br /><br />
혹시 더 깊이 중첩된 `beforeEach`에서 이 변수들이 재할당되지는 않았는지, 모든 `describe` 블록을 거슬러 올라가며 확인해야만 합니다.<br /><br />
이건 코드를 읽는 게 아니라, 변수의 행적을 추적하는 '추리 게임'에 가깝습니다.<br /><br />
지금은 테스트가 3개뿐이라 그나마 낫지만, 수십 개의 테스트와 더 깊은 중첩 구조를 가진 실제 프로젝트 파일이라면 어떨까요?<br /><br />
그야말로 '코드 미로'를 탐험하는 것과 같아지는 겁니다.<br /><br />

## 해답은 단순함에 있다


그렇다면 이 미로에서 탈출할 방법은 무엇일까요?<br /><br />
놀랍게도, 모든 것을 '인라인(inline)'으로 만드는 것부터 시작합니다.<br /><br />

```javascript
test("제출 시 유저네임과 패스워드로 onSubmit이 호출된다", () => {
  const handleSubmit = jest.fn();
  const { getByLabelText, getByText } = render(
    <Login onSubmit={handleSubmit} />
  );
  const user = { username: "michelle", password: "smith" };

  userEvent.type(getByLabelText(/username/i), user.username);
  userEvent.type(getByLabelText(/password/i), user.password);
  userEvent.click(getByText(/submit/i));

  expect(handleSubmit).toHaveBeenCalledTimes(1);
  expect(handleSubmit).toHaveBeenCalledWith(user);
});

test("유저네임 없이 제출 시 에러 메시지가 표시된다", () => {
  const handleSubmit = jest.fn();
  const { getByLabelText, getByText, getByRole } = render(
    <Login onSubmit={handleSubmit} />
  );

  userEvent.type(getByLabelText(/password/i), "anything");
  userEvent.click(getByText(/submit/i));

  const errorMessage = getByRole("alert");
  expect(errorMessage).toHaveTextContent(/username is required/i);
  expect(handleSubmit).not.toHaveBeenCalled();
});
```

어떤가요?<br /><br />
물론 `render` 함수 호출처럼 약간의 코드가 중복되긴 하지만, 각 테스트가 이제 완전히 '독립적'이고 '자체적으로 완결'되었습니다.<br /><br />
어떤 테스트 케이스를 이해하기 위해 더 이상 파일의 다른 부분을 쳐다볼 필요가 없죠.<br /><br />
모든 맥락이 그 테스트 함수 안에 전부 담겨 있습니다.<br /><br />
이것이 바로 테스트 코드에서 가장 중요한 덕목인 '명확성'이죠.<br /><br />

## 중복이 추상화보다 나을 때, AHA 원칙

여기서 'AHA(Avoid Hasty Abstractions)', 즉 '섣부른 추상화를 피하라'는 아주 중요한 원칙이 등장하는데요.<br /><br />
우리는 종종 'DRY(Don't Repeat Yourself)' 원칙에 따라 코드 중복을 무조건 나쁜 것으로 여기곤 하죠.<br /><br />
하지만 테스트 코드의 세계에서는 '잘못된 추상화보다는 차라리 좋은 중복이 낫다'는 말이 더 중요합니다.<br /><br />
`beforeEach`를 사용한 추상화는 앞서 봤듯이 인지 부하라는 큰 비용을 치러야 하는 '나쁜 추상화'였던 거죠.<br /><br />
물론 테스트가 정말 복잡해져서 중복을 줄여야 할 때도 있는데요.<br /><br />
그럴 때 `beforeEach`로 돌아가는 대신, 우리는 '함수'라는 훨씬 더 나은 도구를 사용할 수 있습니다.<br /><br />

```javascript
// 테스트를 위한 셋업 함수 (팩토리 함수)
function setup() {
  const handleSubmit = jest.fn();
  const utils = render(<Login onSubmit={handleSubmit} />);
  const user = { username: "michelle", password: "smith" };
  return {
    handleSubmit,
    user,
    ...utils,
  };
}

test("제출 시 유저네임과 패스워드로 onSubmit이 호출된다", () => {
  // 셋업 함수를 호출해서 필요한 것들을 받아온다.
  const { getByLabelText, getByText, handleSubmit, user } = setup();

  userEvent.type(getByLabelText(/username/i), user.username);
  userEvent.type(getByLabelText(/password/i), user.password);
  userEvent.click(getByText(/submit/i));

  expect(handleSubmit).toHaveBeenCalledWith(user);
});
```
<br />
이렇게 '셋업 함수'를 만들면, `let`을 사용한 변수 재할당 없이도 얼마든지 코드를 재사용할 수 있거든요.<br /><br />
각 테스트는 필요한 셋업 함수를 호출하고, 반환된 값들을 '상수(`const`)'로 받아서 사용하면 됩니다.<br /><br />
이 방식은 `beforeEach`의 마법 같은 동작 대신, 명시적인 함수 호출을 사용하기 때문에 코드의 흐름을 따라가기가 훨씬 쉽죠.<br /><br />

## 그럼 beforeEach는 언제 쓸까?

그렇다고 `beforeEach`나 `afterEach` 같은 훅들이 완전히 쓸모없는 것은 아닌데요.<br /><br />
이들의 진짜 역할은 '코드 재사용'이 아니라, '정리(Cleanup)'에 있습니다.<br /><br />
예를 들어, React Testing Library는 각 테스트마다 컴포넌트를 DOM에 렌더링하는데, 테스트가 끝나면 다음 테스트에 영향을 주지 않도록 깨끗하게 치워줘야 하거든요.<br /><br />
만약 테스트 중간에 에러가 나서 멈추더라도 이 '정리' 작업은 반드시 실행되어야만 합니다.<br /><br />
바로 이럴 때 `afterEach`가 사용되는 거죠.<br /><br />
```javascript
// React Testing Library는 이걸 자동으로 해주지만, 원리는 이렇다.
afterEach(() => {
  cleanup(); // 테스트가 성공하든 실패하든 항상 실행된다.
});
```
<br />
이처럼 테스트의 성공 여부와 관계없이 반드시 실행되어야 하는 '전역적인 정리 작업'이 바로 이 훅들이 활약할 무대입니다.<br /><br />
단순히 코드 몇 줄을 공유하겠다고 사용하는 것은 그들의 본래 목적에 맞지 않는 셈이죠.<br /><br />

## 오늘의 핵심 원칙

복잡하고 읽기 힘든 테스트 코드에 지쳤다면, 오늘부터 이 원칙들을 한번 적용해 보세요.<br /><br />
1.  **명료성이 최우선이다**<br />
    약간의 중복을 감수하더라도, 각 테스트는 그 자체로 완전하고 이해하기 쉬워야 합니다.<br /><br />
2.  **코드 공유는 `beforeEach`가 아닌 '함수'로 하라**<br />
    셋업 함수(팩토리 함수)를 만들어 명시적으로 호출하는 방식이 훨씬 예측 가능하고 안전합니다.<br /><br />
3.  **`describe`는 중첩하지 말고, 파일로 분리하라**<br />
    테스트를 그룹화하고 싶다면, 깊게 중첩된 `describe` 대신 파일을 분리하는 것이 더 나은 전략입니다.<br /><br />
4.  **테스트 훅은 '정리(cleanup)'를 위해 아껴둬라**<br />
    `before/after` 훅은 코드 재사용이 아닌, 테스트 환경을 깨끗하게 유지하는 본연의 임무에 사용해야 합니다.<br /><br />
<br />
결국 좋은 테스트 코드란, 미래의 내가 (혹은 동료가) 봤을 때 최소한의 노력으로 그 의도를 파악할 수 있는 코드인데요.<br /><br />
오늘부터라도 `describe`와 `beforeEach`의 유혹에서 벗어나, 명확하고 간결한 테스트를 작성해 보는 건 어떨까요?<br /><br />
분명 여러분의 개발 경험을 한 단계 더 업그레이드해 줄 겁니다.<br /><br />
