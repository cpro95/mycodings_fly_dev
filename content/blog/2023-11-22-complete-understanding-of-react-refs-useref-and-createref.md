---
slug: 2023-11-22-complete-understanding-of-react-refs-useref-and-createref
title: React refs 완벽 이해 - useRef와 createRef
date: 2023-11-22 11:14:59.310000+00:00
summary: complete understanding of react refs
tags: ["react", "refs", "useRef", "createRef"]
contributors: []
draft: false
---

안녕하세요?

React는 아시다시피 MVC에서 View에 해당하는 라이브러리인데요.

React는 특히 JSX 형태의 컴포넌트 형태로 View를 관리하기 때문에 자바스크립트로 웹페이지를 만드는 데 있어 획기적인 방법을 제공해 주었는데요.

컴포넌트 중심으로 View를 컨트롤하는 걸 권장하면서도, React는 직접 DOM 속성에 접근할 방법을 제공해 줍니다.

그게 바로 "refs"인데요.

예를 들어, Input 박스에 포커스를 맞추는 기능 같은 것이 가장 대표적인 활용 방법입니다.

앞으로, React의 refs에 대해 배워보고, 왜 React가 개발자에게 직접적인 DOM 액세스를 허용하는지도 한번 살펴보겠습니다.

---

** 목차 **

1. [React refs 소개](#1-react-refs-소개)

2. [refs 만들기](#2-refs-만들기)

3. [useRef와 createRef의 차이점](#3-useref와-createref의-차이점)

4. [React refs 사용하기](#4-react-refs-사용하기)

5. [DOM 기반 라이브러리와의 통합](#5-dom-기반-라이브러리와의-통합)

6. [언제 useRef 훅을 사용해야 할까요?](#6-언제-useref-훅을-사용해야-할까요)

7. [callback refs](#7-callback-refs)

8. [React refs 사용시 범할 수 있는 실수](#8-react-refs-사용시-범할-수-있는-실수)

---

## 1. React refs 소개

React의 Refs는 "references"의 줄임말인데요.

이름 그대로 DOM 노드를 React 컴포넌트에서 직접적으로 참조하고 상호 작용할 수 있게 해 줍니다.

특히 Refs가 컴포넌트 내에서 특정 정보를 참조해야 할 때 사용되며, 동시에 해당 정보가 re-rendering을 일으키지 않도록 할 때 유용합니다.

React refs의 가장 일반적인 활용 사례는 다음과 같습니다:

- Focus, 텍스트 선택, 미디어 재생과 같은 UI 관리
- 애니메이션 시작 유도
- 써드파트 DOM 라이브러리와의 통합

다시 말해, React refs는 특히 특정한 DOM 조작이나 외부 라이브러리와의 원활한 통합을 위해 디자인되었습니다.

---

## 2. refs 만들기

React에서는 refs를 두 가지 방법으로 만들 수 있는데요, createRef 메서드 또는 useRef 훅입니다.

### useRef Hook

useRef Hook은 React 라이브러리가 함수형으로 재편되었을 때 나온 훅인데요.

함수형 컴포넌트에서 더욱 효과적으로 사용할 수 있습니다.

아래는 예제 코드입니다:

```jsx
import React, { useRef } from "react";

function ActionButton() {
  // useRef 훅을 사용하여 초기값이 null인 buttonRef를 생성합니다.
  const buttonRef = useRef(null);

  // 클릭 이벤트 핸들러 함수를 정의합니다.
  function handleClick() {
    // 버튼에 대한 현재 참조를 콘솔에 출력합니다.
    console.log(buttonRef.current);
  }

  // 버튼을 렌더링하고 ref 속성에 buttonRef를 할당합니다.
  return (
    <button onClick={handleClick} ref={buttonRef}>
      Click me
    </button>
  );
};
export default ActionButton;
```

위 코드에서는 `useRef()` 훅을 사용하여 버튼 엘리먼트에 대한 참조를 만들었습니다.

`buttonRef`라는 이름으로 선언했고, 이 참조를 활용하면 `buttonRef.current`를 통해 현재 `buttonRef`의 값을 얻을 수 있습니다.

refs를 사용하면 값들을 저장하고 업데이트할 수 있으며, 렌더링을 효과적으로 관리할 수 있습니다.

---

### 'createRef' 메서드

`createRef` 메서드를 사용하여 Refs를 만드는 방법은 훅이 나오기 전 React가 클래스 기반으로 작성되었던 그 옛날 방법인데요.

아래는 예제 코드입니다:

```jsx
import React, { Component } from "react";

class ActionButton extends Component {
  // 생성자에서 React.createRef()를 활용하여 초기 참조를 설정합니다.
  constructor(props) {
    super(props);
    this.buttonRef = React.createRef();
  }

  // 클릭 이벤트 핸들러를 화살표 함수로 정의합니다.
  handleClick = () => {
    // 버튼에 대한 현재 참조를 콘솔에 출력합니다.
    console.log(this.buttonRef.current);
  }

  // 렌더링 메서드에서 버튼을 표시하고 ref 속성에 참조를 할당합니다.
  render() {
    return (
      <button onClick={this.handleClick} ref={this.buttonRef}>
        Click me
      </button>
    );
  }
}

export default ActionButton;
```

위 코드에서는 `React.createRef()`를 통해 `buttonRef`라는 이름의 'refs'를 생성하고, 해당 참조를 버튼 엘리먼트에 할당합니다.

그냥 예전 클래스 기반 리액트 코드에서 createRef를 사용했던 방식의 가장 흔한 예입니다.

---

## 3. useRef와 createRef의 차이점

`useRef` 훅과 `createRef` 메서드 간에는 몇 가지 중요한 차이가 있습니다.

먼저, `createRef`는 주로 클래스 컴포넌트에서 ref를 생성하는 데 사용되고, 이와 대조적으로 `useRef`는 주로 함수형 컴포넌트에서 활용됩니다.

둘째, `createRef`는 호출될 때마다 새로운 ref 객체를 반환하지만, `useRef`는 각 렌더링 사이클마다 동일한 ref 객체를 유지합니다.

셋째, 가장 중요한 차이점으로 `createRef`가 초기 세팅 값을 받지 않아서 ref의 현재 속성이 처음에는 무조건 null로 설정된다는 것입니다.

반면, `useRef`는 초기값을 받을 수 있으며, ref의 현재 속성은 개발자가 지정한 값으로 초기화됩니다.

차이점을 종합해 보면, `createRef`는 클래스 컴포넌트에서 주로 쓰이며 호출될 때마다 새로운 ref를 생성합니다.

반면, `useRef`는 함수형 컴포넌트에서 주로 사용되며 렌더링마다 동일한 ref를 반환합니다.

그리고 initial 값을 지정할 수 있습니다.

---

## 4. React refs 사용하기

DOM과 렌더링 된 컴포넌트에 직접적으로 접근해야 하는 상황이 있을 때 React refs가 유용하게 활용됩니다.

React refs를 사용하는 몇 가지 실용적인 상황은 다음과 같습니다.

--- 

### 포커스 제어

엘리먼트에 포커스를 주는 것은 해당 노드 인스턴스에 `focus()` 메서드를 이용하면 할 수 있습니다.

아래 예제를 보면서 설명해 볼까요?

```jsx
import React, { useState } from "react";

const InputModal = ({ initialValue }) => {
  const [value, setValue] = useState(initialValue);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="modal--overlay">
      <div className="modal">
        <h1>새로운 값을 입력하세요</h1>
        <form action="?" onSubmit={onSubmit}>
          <input type="text" onChange={onChange} value={value} />
          <button>새로운 값 저장</button>
        </form>
      </div>
    </div>
  );
};

export default InputModal;
```

InputModal 컴포넌트에서는 사용자가 이미 설정된 값을 수정할 수 있는데요.

InputModal이 열릴 때 입력란에 자동으로 포커스가 있으면 조금 더 유저 프렌들리한 UI가 됩니다.

먼저, input 엘리먼트에 대한 참조를 얻어야 합니다.		

```jsx
import React, { useRef, useState } from "react";

const InputModal = ({ initialValue }) => {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef(null);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="modal--overlay">
      <div className="modal">
        <h1>새로운 값을 입력하세요</h1>
        <form action="?" onSubmit={onSubmit}>
          <input ref={inputRef} type="text" onChange={onChange} value={value} />
          <button>새로운 값 저장</button>
        </form>
      </div>
    </div>
  );
};

export default InputModal;
```

그다음으로 InputModal이 마운트될 때 `useEffect` 훅 내에서 input 엘리먼트에 대해 자동으로 포커스를 맞춥니다.

```jsx
import React, { useEffect, useRef, useState } from "react";

const InputModal = ({ initialValue }) => {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, [])

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="modal--overlay">
      <div className="modal">
        <h1>새로운 값을 입력하세요</h1>
        <form action="?" onSubmit={onSubmit}>
          <input ref={inputRef} type="text" onChange={onChange} value={value} />
          <button>새로운 값 저장</button>
        </form>
      </div>
    </div>
  );
};

export default InputModal;
```

이렇게 하면 InputModal을 열 때 텍스트 상자에 기본적으로 포커스가 설정됩니다.

참고로, input 엘리먼트의 `current` 속성을 통해 엘리먼트에 액세스해야 합니다.

---

### 모달 밖을 클릭했을 때 모달 사라지게 하기

사용자가 모달 외부를 클릭했을 때 모달 컴포넌트를 닫도록 만들고 싶을 수 있습니다.

아래는 이를 구현한 예제 코드입니다.

```jsx
import React, { useEffect, useRef, useState } from "react";

const InputModal = ({ initialValue, onClose, onSubmit }) => {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
    document.body.addEventListener("click", onClickOutside);

    return () => document.body.removeEventListener("click", onClickOutside);
  }, []);

  const onClickOutside = (e) => {
    const clickedElement = e.target;
    if (modalRef.current && !modalRef.current.contains(clickedElement)) {
      e.preventDefault();
      e.stopPropagation();
      onClose();
    }
  };

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    onSubmit(value);
    onClose();
  };

  return (
    <div className="modal--overlay">
      <div className="modal" ref={modalRef}>
        <h1>새로운 값을 입력하세요</h1>
        <form action="?" onSubmit={onSubmitHandler}>
          <input ref={inputRef} type="text" onChange={onChange} value={value} />
          <button>새로운 값 저장</button>
        </form>
      </div>
    </div>
  );
};

export default InputModal;
```

여기서는 클릭 된 요소가 모달의 영역을 벗어나는지 확인합니다.

이로써 모달이 외부를 클릭했을 때, 추가 동작을 방지하고 onClose 콜백을 호출합니다.

여기서 제일 실수하는 부분이 바로 다음 부분인데요.

바로 React에서의 상태(state) 변경은 비동기적(async)이기 때문에 DOM 요소의 현재 참조가 실제로 존재하는지 꼭 확인하는 것이 중요합니다.

마지막으로, document.body 요소에 전역 클릭 리스너를 추가하고, 해당 요소가 마운트 해제될 때는 리스너를 정리해야 합니다.

---

## 5. DOM 기반 라이브러리와의 통합

React가 새로운 시대를 열었지만, React 이전에 나온 아주 좋은 라이브러리들이 많이 있습니다.

예를 들어, GSAP(GreenSock Animating Platform) 같은 라이브러리 말입니다.

refs를 활용하여 React를 최고 수준의 애니메이션 라이브러리와 손쉽게 통합할 수 있습니다.

GSAP를 사용하면 어떤 DOM 요소든 해당 메서드로 전달하기만 하면 됩니다.

GSAP를 활용하여 InputModal의 디자인을 향상해 보겠습니다.

```jsx
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const InputModal = ({ initialValue, onClose, onSubmit }) => {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef(null);
  const modalRef = useRef(null);
  const overlayRef = useRef(null);

  const onComplete = () => {
    inputRef.current.focus();
  };

  const timeline = gsap.timeline({ paused: true, onComplete });

  useEffect(() => {
    timeline
      .from(overlayRef.current, {
        duration: 0.25,
        autoAlpha: 0,
      })
      .from(modalRef.current, {
        duration: 0.25,
        autoAlpha: 0,
        y: 25,
      });

    timeline.play();

    document.body.addEventListener("click", onClickOutside);

    return () => {
      timeline.kill();
      document.removeEventListener("click", onClickOutside);
    };
  }, []);

  const onClickOutside = (e) => {
    const element = e.target;
    if (modalRef.current && !modalRef.current.contains(element)) {
      e.preventDefault();
      e.stopPropagation();
      onClose();
    }
  };

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    onSubmit(value);
    onClose();
  };

  return (
    <div className="modal--overlay" ref={overlayRef}>
      <div className="modal" ref={modalRef}>
        <h1>새로운 값을 입력하세요</h1>
        <form action="?" onSubmit={onSubmitHandler}>
          <input ref={inputRef} type="text" onChange={onChange} value={value} />
          <button>새로운 값 저장</button>
        </form>
      </div>
    </div>
  );
};

export default InputModal;
```

위 코드를 간략히 설명하자면 초기 애니메이션 값 설정을 통해 DOM 참조의 스타일을 변경합니다.

타임라인은 컴포넌트가 마운트될 때만 실행되며, 요소가 마운트 해제되면 타임라인 인스턴스의 kill() 메서드를 사용하여 현재 진행 중인 모든 애니메이션을 중지합니다.

마지막으로 타임라인이 완료된 후에 입력란에 자동으로 포커스가 맞추어지도록 설정했습니다.

---

## 6. 언제 useRef 훅을 사용해야 할까요?

`useRef` 훅을 사용해야 하는 상황은 몇 있습니다.

1. **DOM 요소에 접근**: 특정 DOM 요소와 상호 작용해야 할 때, 예를 들어 input field에 포커스를 설정하거나 요소의 크기를 측정해야 할 때 등 컴포넌트 내에서 특정 DOM 요소에 접근해야 할 때 `useRef`를 활용할 수 있습니다.

2. **Re-rendering을 유발하지 않는 값 저장**: 값이 자주 변경되지만 다시 렌더링을 유발하지 않는 경우, 예를 들어 컴포넌트에 타이머가 있는 경우 현재 시간을 저장하는 데 `useRef`를 사용할 수 있습니다. 이를 통해 불필요한 Re-rendering을 방지할 수 있습니다.

3. **비용이 많이 드는 계산 결과 캐싱**: 매 렌더링에서 비용이 많이 드는 계산을 반복하지 않고, 계산 결과를 캐싱하려는 경우 `useRef`를 활용할 수 있습니다. 이를 통해 성능을 최적화하고 불필요한 계산을 피할 수 있습니다.

이러한 상황에서 `useRef`를 사용하면 코드의 가독성을 높이고, 성능을 향상할 수 있습니다. 이는 특히 세부적이고 효율적인 작업을 처리할 때 유용합니다.

### Using forwardRef

앞서 이야기한 것처럼 refs는 특정 작업에 아주 유리한데요.

그러나 실제 웹 앱을 만들 때 간단한 DOM 제어보다 더 복잡한 컴포넌트를 다뤄야 할 때가 있습니다.

컴포넌트가 더 복잡해지면서 네이티브 HTML 요소를 직접 사용하는 경우가 거의 없죠.

아래는 이와 관련한 예입니다.

```javascript
import React from 'react';

const LabelledInput = (props) => {
  const { id, label, value, onChange } = props;

  return (
    <div className="labelled--input">
      <label htmlFor={id}>{label}</label>
      <input id={id} onChange={onChange} value={value} />
    </div>
  );
};

export default LabelledInput;
```

이제 문제는 이 컴포넌트에 ref를 전달하려면 해당 인스턴스인 React 컴포넌트 참조가 반환되어 원하는 input 태그가 반환되지 않는다는 점입니다.

다행히 React에서는 이를 위한 내장된 솔루션인 forwardRef를 제공하여 이 문제를 해결할 수 있습니다.

forwardRef를 사용하면 내부에서 ref가 가리킬 요소를 정의할 수 있습니다.

```javascript
import React from 'react';

const LabelledInput = React.forwardRef((props, ref) => {
  const { id, label, value, onChange } = props;

  return (
    <div className="labelled--input">
      <label htmlFor={id}>{label}</label>
      <input id={id} onChange={onChange} value={value} ref={ref} />
    </div>
  );
});

export default LabelledInput;
```

이렇게 하면 forwardRef 인자값으로 들어가는 함수의 두 번째 인자로 ref를 전달하고 원하는 요소에 해당 인자를 배치하면 됩니다.

이제 부모 컴포넌트가 ref 값을 전달하면 input을 얻게 되어 컴포넌트의 내부와 속성을 노출시키지 않고도 컴포넌트를 유지할 수 있습니다.

---

## 7. callback refs

React에서는 ref를 사용하는 또 다른 방법이 있습니다. 그것은 바로 "callback refs"입니다.

callback refs는 컴포넌트가 마운트 및 언마운트될 때 컴포넌트의 동작을 커스터마이징할 수 있는 방법을 제공합니다.

전통적인 ref는 DOM 요소에 직접 참조를 저장하는 반면, callback refs는 함수를 사용하여 DOM 요소나 컴포넌트 인스턴스를 인수로 받습니다. 이러한 접근 방식은 여러 가지 이점을 제공합니다.

1. **제어**: callback refs를 사용하면 ref가 언제 설정되고 해제되는지를 정확하게 제어할 수 있습니다. 이는 동적인 콘텐츠나 조건부 렌더링과 같은 상황에서 특히 유용합니다.

2. **캡슐화**: callback refs를 활용하면 ref 콜백 함수 내에서 DOM 상호 작용과 관련된 로직을 캡슐화할 수 있습니다. 이는 코드의 재사용성과 유지보수성을 높입니다.

3. **유연성**: callback refs는 다양한 상황에서 활용할 수 있으며, DOM 노드와 컴포넌트 인스턴스에 접근하는 데 유용합니다.

이러한 특징들은 callback refs를 통해 더 세밀한 제어와 코드 유지보수성을 실현할 수 있도록 도와줍니다.

---

### callback ref 만들기

callback refs를 사용하려면 컴포넌트 내에서 함수를 정의하고 해당 함수를 ref 속성으로 요소에 전달하면 됩니다. 다음은 예제입니다.

```javascript
import React, { useRef, useEffect } from 'react';

function MyComponent() {
  const myRef = useRef(null);

  // callback refs 함수
  const handleRef = (element) => {
    if (element) {
      // DOM 요소에 접근
      console.log('DOM 요소에 접근:', element);

      // 마운트 시 동작 수행
      console.log('컴포넌트 마운트됨');
    } else {
      // 언마운트 시 동작 수행
      console.log('컴포넌트 언마운트됨');
    }
  };

  return (
    <div>
      {/* 콜백 ref를 연결 */}
      <div ref={handleRef}>이것은 DOM 요소입니다.</div>
    </div>
  );
}

export default MyComponent;
```

이 예제에서는 handleRef 함수를 callback refs로 정의합니다. 컴포넌트가 마운트되면 handleRef가 DOM 요소를 인수로 받아 호출됩니다. 여기서는 DOM 요소에 접근하거나 필요한 동작을 수행할 수 있습니다. 컴포넌트가 언마운트되면 callback refs는 다시 null과 함께 호출되어 정리 작업이나 추가 동작을 수행할 수 있습니다.

callback refs는 일반 ref와 다르게 어떻게 정의되고 요소 또는 컴포넌트 인스턴스에 접근하는지에서 차이가 있습니다.

callback refs는 함수를 사용하여 더 많은 유연성과 커스터마이제이션을 제공하며, 반면 일반 ref는 .current 속성을 사용하여 직접 참조를 지원합니다.


## 8. React refs 사용시 범할 수 있는 실수

React refs는 그 성능이 너무 강력해서 가끔 사용자가 의도치 않는 메모리 누수나 기타 문제를 야기할 수 있습니다.

---

### refs 과다 사용

refs를 과도하게 사용하는 것은 코드를 더 복잡하게 만들며, 나중에 유지하기 어렵게 만들 수 있습니다.

또한 refs는 불필요한 Re-rendering을 유발할 수 있어 성능 문제를 야기할 수 있습니다.

경험상으로, refs는 직접적으로 DOM 노드에 액세스하거나 그 속성을 조작해야 할 때만 사용하는 것이 좋습니다.

다음은 refs를 과도하게 사용하는 예입니다.

```javascript
import React, { useRef } from 'react';

function MyComponent() {
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();

    const firstName = firstNameRef.current.value;
    const lastName = lastNameRef.current.value;
    const email = emailRef.current.value;

    // 폼 값들로 무언가를 수행
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" ref={firstNameRef} placeholder="이름" />
      <input type="text" ref={lastNameRef} placeholder="성" />
      <input type="email" ref={emailRef} placeholder="이메일" />
      <button type="submit">제출</button>
    </form>
  );
}

export default MyComponent;
```

refs를 사용하여 직접 입력 값을 액세스하는 것은 React 관행과 맞지 않습니다.

아래 코드는 handleSubmit, handleInputChange과 useState를 사용한 더 나은 접근 방식입니다.

```javascript
import React, { useState } from 'react';

function MyComponent() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="firstName"
        value={formData.firstName}
        placeholder="이름"
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="lastName"
        value={formData.lastName}
        placeholder="성"
        onChange={handleInputChange}
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        placeholder="이메일"
        onChange={handleInputChange}
      />
      <button type="submit">제출</button>
    </form>
  );
}

export default MyComponent;
```

---

### refs를 정확히 초기화하지 못했을 때

잠재적인 오류를 피하기 위해, refs를 올바르게 초기화하는 것이 매우 중요합니다.

이를 위해 클래스 컴포넌트에서는 React.createRef()를 사용하거나, 함수형 컴포넌트에서는 useRef()를 사용하고 목적에 맞게 할당해야 합니다.

다음은 refs를 올바르게 초기화하는 예제입니다.

```javascript
// 올바른 방법으로 refs 초기화
class MyComponent extends React.Component {
  myRef = React.createRef();
  // ...
}

// 함수형 컴포넌트에서 refs를 올바르게 초기화
function MyFunctionalComponent() {
  const myRef = useRef();
  // ...
}
```

이렇게 하면 React의 규칙에 따라 refs를 초기화하고 원하는 대상에 할당할 수 있습니다.

---

### 메모리 누수

refs를 올바르게 정리하지 않으면 메모리 누수가 발생할 수 있습니다.

컴포넌트가 마운트 해제되면 React는 해당 DOM 요소를 페이지에서 제거합니다.

그러나 컴포넌트가 ref를 통해 여전히 DOM 요소에 대한 참조를 유지하는 경우, 자바스크립트 엔진은 해당 요소를 가비지 컬렉트하지 않습니다.

심지어 더 이상 화면에 보이거나 상호 작용할 수 없는 경우에도 그렇습니다.

이로 인해 시간이 지남에 따라 메모리 누수가 발생할 수 있습니다.

이를 방지하기 위해 컴포넌트가 마운트 해제될 때 ref를 null로 설정하거나 제거하여 메모리 누수를 방지하십시오.

다음은 컴포넌트가 마운트 해제될 때 ref를 null로 설정하는 방법을 보여주는 코드 샘플입니다.

```javascript
import React, { useRef, useEffect } from 'react';

function MyComponent() {
  const myRef = useRef();

  useEffect(() => {
    // 컴포넌트가 마운트 해제될 때 정리
    return () => {
      myRef.current = null;
    };
  }, []);

  return (
    <div>
      <h1>My Component</h1>
      <div ref={myRef}>이것은 DOM 요소입니다.</div>
    </div>
  );
}

export default MyComponent;
```

이렇게 하면 컴포넌트가 마운트 해제될 때 ref를 null로 설정하여 메모리 누수를 방지할 수 있습니다.

끝.