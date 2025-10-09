---
slug: 2023-04-26-how-to-conditional-react-rendering
title: 리액트(React) 조건부 렌더링 이해하기(conditional rendering)
date: 2023-04-26 10:35:49.233000+00:00
summary: 리액트(React) 조건부 렌더링 이해하기(conditional rendering)
tags: ["react", "conditional", "rendering"]
contributors: []
draft: false
---

안녕하세요?

리액트는 MVC(Model-View-Controller) 패턴에서 보면 View에 해당하는 라이브러리인데요.

그래서 리액트 컴포넌트는 화면에 그려질 DOM 객체를 리턴합니다.

코딩하다가 보면 간혹 가다가 조건에 따라 화면에 그려질 DOM 객체를 선택하고 싶을 때가 있는데요.

이때 쓰이는 게 바로 조건 렌더링 방식인데요.

조건 렌더링이라고 해서 특별하게 어려울 건 없습니다.

단순하게 자바스크립트의 조건식을 이용한 겁니다.

---

## if - else 문을 이용한 조건 렌더링

첫 번째로 if - else 문을 이용한 조건 렌더링은 가장 쉽습니다.

```js
//images to render
const blackHat =
  'https://cdn.pixabay.com/photo/2014/03/25/16/33/fedora-297371_1280.png'
const whiteHat =
  'https://cdn.pixabay.com/photo/2014/04/03/00/35/hat-308778_1280.png'

const isWhite = true

if (isWhite) {
  // If isWhite is true
  return <img src={whiteHat} width='200px' />
} else {
  // If isWhite is not true
  return <img src={blackHat} width='200px' />
}
```

위와 같이 간단하게 if - else 문을 이용해서 리액트 컴포넌트가 꼭 return 해야 할 DOM 객체를 지정해서 주면 됩니다.

---

## 삼항 연산자를 이용한 조건 렌더링

자바스크립트에서 if - else 문을 간단하게 쓰는 삼항 연산자가 있는데요. (? :)

```js
return isWhite ? (
  <img src={whiteHat} width={200} />
) : (
  <img src={blackHat} width={200} />
)
```

어떤가요? 더 간단하지 않나요?

---

## && 연산자를 사용한 리액트 조건 렌더링

위에서 살펴본 삼항 연산자 보다 더 간단한 AND 연산자 (&&)가 있습니다.

AND 연산자는 (&&) 는 어떻게 작동하는지 간단히 살펴볼까요?

```js
true && false === false

false && true === false

true && true === true
```

AND 연산자는 첫 번째 피연산자가 참이어야만 두 번째 피연산자도 계산합니다.

만약 첫 번째 피연산자가 거짓(false)이면 두 번째 피연산자를 참조(계산)할 필요가 없기 때문에 바로 거짓(false)을 리턴해 버립니다.

바로, 이 특성을 이용한 겁니다.

```js
return <>{isWhite && <img src={whiteHat} width={200} />}</>
```

위 코드를 보시면 isWhite가 참이면 && 연산자 뒤에 있는 걸 참조(계산)하는데요.

만약 isWhite가 거짓이면 && 연산자 뒤에 있는 것 참조(계산) 하지도 않고 바로 거짓이 됩니다.

그래서 만약 isWhite가 거짓이라면

`return ( <>false</>)` 가 되는데요.

여기서 boolean 값은 렌더링이 안 됩니다. 그래서 빈 `<>` 태그가 리턴되게 됩니다.

AND 연산자를 이용한 조건 렌더링에서 주의할 점은 바로 첫번 째 피연산자는 무조건 참, 거짓을 나타내는 boolean 타입이어야 합니다.

만약 isWhite가 0, NaN 일 경우 && 연산자는 0 또는 NaN을 그냥 리턴하게 됩니다.

그래서 화면에는 0 또는 NaN이 나타나게 되는데요.

그래서 isWhite 변수처럼 조건 렌더링을 결정짓는 변수를 숫자 타입으로 사용하지 않는게 좋습니다.

만약 숫자 타입이라면 아래와 같이 크기 비교를 통해 꼭 참, 거짓을 나타낼 수 있게 해야 합니다.

```js
isWhite > 0 && <img src={whiteHat} />
```

---

지금까지 리액트에서의 조건 렌더링에 대해 알아봤는데요.

저도 && 연산자를 가장 많이 씁니다.

왜 && 연산자를 쓰냐면 조건에 맞으면 화면에 뿌리고 조건에 맞지 않으면 화면에 뿌리지 않고 싶을 때 사용할 수 있는 방식이면서 좀 더 간단하게 쓸 수 있기 때문입니다.

아주 간단한 && 연산자이지만 꼭 왼쪽 피연산자는 참, 거짓을 리턴하게끔 코드를 짜는 게 버그를 미연에 방지할 수 있는 좋은 습관이 될 거로 생각합니다.

그럼.
