---
slug: 2024-09-17-another-use-case-of-react-useref
title: 초보자도 이해할 수 있는 useRef 또 다른 사용법
date: 2024-09-17 10:10:29.257000+00:00
summary: useRef의 또 다른 사용법으로 React를 공부해 봅시다.
tags: ["useRef", "react"]
contributors: []
draft: false
---

안녕하세요?

제목에서도 알 수 있듯이 오늘은 useRef의 다른 사용법에 대해 알아 볼 예정인데요.

일단, useRef Hook의 주된 사용 목적은 DOM 참조라고 생각합니다.

useRef는 React의 공식 문서에서도 코드와 함께 설명되어 있어 매우 간단하고 이해하기 쉬운데요.

DOM에 대한 참조가 주된 목적인데, 이 이외의 사용 목적으로는 값을 저장하고 유지는 역할이 있습니다.

useRef는 useState처럼 값을 유지할 수 있습니다.

useState로 값이 유지되는데 왜 useRef를 사용하는지에 대한 의문도 있을 수 있습니다.

그 의문에 대해서도 이 글을 읽어나가면서 이해할 수 있을 것입니다.

useRef를 이용한 값의 유지에 대해서는 React 공식문서에서도 코드가 포함된 설명이 없어 초보자에게는 이해하기 어려울 수 있는데요.

이 글에서는 useRef로 값 유지에 대한 설명도 간단한 코드로 설명하고 있으니, 이 기회에 useRef의 사용 방법을 확실히 이해하시면 좋을 듯 합니다.

** 목차 **

- [초보자도 이해할 수 있는 useRef 사용법](#초보자도-이해할-수-있는-useref-사용법)
  - [1. input 요소에 포커스하기](#1-input-요소에-포커스하기)
  - [2. 파일 선택 다이얼로그 예제](#2-파일-선택-다이얼로그-예제)
  - [3. useRef에 값 저장하고 유지하기](#3-useref에-값-저장하고-유지하기)
    - [3.1 재렌더링(Re-render)이란 무엇인가?](#31-재렌더링re-render이란-무엇인가)
    - [3.2 useRef에서는 재렌더링하지 않는다!!!](#32-useref에서는-재렌더링하지-않는다)
  - [4. Form(폼)에서의 useState와 useRef](#4-form폼에서의-usestate와-useref)
    - [4.1 useState를 이용한 방법](#41-usestate를-이용한-방법)
    - [4.2 useRef를 이용한 방법](#42-useref를-이용한-방법)

---

### 1. input 요소에 포커스하기

우리가 알고 있듯이 useRef를 이용하면 DOM을 참조할 수 있어, 직접 DOM 노드(예를 들어 input 요소)에 접근하는 것이 가능합니다.

useRef를 사용하여 input 요소에 접근할 수 있으므로 바닐라 JavaScript에서 요소를 다룰 때와 동일한 방법으로 조작할 수 있습니다.

예를 들어 useRef를 사용하여 input 요소에 대한 참조를 얻고, focus 메서드를 실행함으로써 input 요소에 포커스를 할 수 있습니다.

id가 `myTextField`인 input 요소에 포커스를 주고 싶을 때, JavaScript에서는 `document.getElementById('myTextField').focus()`로 수행할 수 있습니다.

당연히 React에서는 useRef를 사용하면 됩니다.

먼저, focus 메서드가 필요한 이유를 알아보겠습니다.

다음과 같이 가장 일반적인 React 코드가 있는데요.

```javascript
import { useState } from 'react';

function App() {
  const [name, setName] = useState('');
  const handleOnChange = (e) => setName(e.target.value);

  return (
    <div style={{ margin: '2em' }}>
      <input type="text" value={name} onChange={handleOnChange} />
      <p>이름: {name}</p>
    </div>
  );
}

export default App;
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEj3Is7BkNWT8_65FreU9quHqTD2vO_NUvWBVzXzlF37rcEavjqQl1s2OPhxRcdDUroBHLHfdr-g-zHacwN7OxovWpzJM8Xwkqs9PwKxPxqnMiFexD1L4kBg2PY0Gsu5x8HWjzfWZiE_2GglQGRgyqWfPiKllwD2UZ3x_QEPX-1o-J_hz3CJHn0upBGA-XY)

위 그림처럼 브라우저에서 확인해보면 input 요소는 표시되지만, 표시된 input 요소에는 포커스가 없습니다.

포커스를 주기 위해서는 직접 커서를 input 요소로 가져가야 합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiyfsyx1cb-AbQ6OZD8JZQz_S1KpRyH8Y0NuY7Pmn8muFFeV1ZQi-MfYq3gZaeyg9XjJeOBQJ-cQy3bSzn2EaNZVmrCfsce-wTYJ-rrqitK0nW_GliqhYQyEGKgwfClgUplpfq2bMeOSIl-b3zzf3i75wai87_CxXYNFm5dTEXzXF_E_t5VAmqOwtJlXgw)

위 그림처럼 input 요소에 포커스가 맞춰지면 문자열을 입력할 수 있고, 입력한 문자는 input 요소 아래에 표시됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEipBDnICjZ-N4FK7hnDmaF4OY3vB3k0aX9ww5-_EOGhyFkL_TTo3BvnFHxylb8pFFX8pIBEbg1JBLTmtDyQSHsbOvz5qmIJZ5tcstM_ux7P6UyVk9q5VOG5t2OJSJWo_f54chWcpQlk32LCt5AjRjK61joztYT2reazq9wIaGuEzTKk71qDNUr0_vXmNO4)

이제 테스트를 위해 버튼을 추가하여, 버튼을 클릭하면 input 요소에 포커스가 맞춰지도록 useRef를 이용해 보겠습니다.

useRef를 이용하여 input 요소의 참조를 얻기 위해 `inputEl`을 정의할겁니다.

useRef의 인수에는 초기값을 설정해야하느데요.

여기서는 `null` 값으로 설정하겠습니다.

값은 `inputEl` 자체에 들어가는 것이 아니라 `inputEl` 객체의 `current` 프로퍼티에 설정됩니다.

아래 코드를 추가하면 `inputEl.current`의 값은 `null`이 됩니다.

```javascript
import { useState, useRef } from 'react';
// 생략
const inputEl = useRef(null);
```

생성한 `inputEl`은 ref 속성을 사용하여 input 요소에 설정합니다.

이 설정으로 useRef로 설정한 `inputEl`과 input 요소가 연결됩니다.

```javascript
<input ref={inputEl} type="text" value={name} onChange={handleOnChange} />
```

버튼을 클릭하면 input 요소에 포커스가 맞춰지도록 버튼에 click 이벤트를 설정합니다.

```javascript
<button onClick={handleOnClick}>포커스 맞추기</button>
```

버튼에 설정한 클릭 이벤트의 `handleOnClick` 메서드 안에서 input 요소에 커서를 맞추는 처리를 설정합니다.

클릭했을 때 `inputEl`의 내용에 무엇이 들어있는지 `console.log(inputEl)`을 이용하여 확인해봅시다.

```javascript
const handleOnClick = () => console.log(inputEl);
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEid8OG2K0_IhkOlCVtemldvv9kVmy64vlKI-qfVapICWB7ah3ct7gcAmnb_t3rL7-QnHF3SeUhvMt8InrPn-KhgHt4VMofoZ9PHiGu7vMTElpyksMjnlmR0cdJfYBPLJ0F-l3Hr2Vj6tFWzQ0BSeuYjoVtTcv66Tu_3HXF8Erq_cMmC84CLJwpdMxh0OV8)

위 그림과 같이 버튼을 클릭하면 콘솔에는 객체가 표시되고, `current` 프로퍼티에 input이 들어있는 것을 알 수 있습니다.

`current` 프로퍼티의 내용을 더 확인해봅시다.

```javascript
const handleOnClick = () => console.log(inputEl.current);
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEjg-Gql4ltw1JnWduK-JRIl8Pn0nEWcuBpbDm23IA8hkcRqVgMLGBQCESqBBf6dNHPWaj10UQNUluRE21DHUwpfcqNPYmVB3-H4xw3uqfMUczQlAwpp1p0nLEDT3LDwJkeKPFGNFb6bLxeXmGTO7toB-etxPIbN7MVE7dlA_cTxnqOyRspe_fqfe-j_NCk)

위와 같이 `current` 프로퍼티에는 input 요소가 들어있는 것을 알 수 있습니다.

초기값은 `null`이었지만 요소로 변경되었습니다.

`current` 프로퍼티에 들어있는 것은 input 태그의 문자열이 아니라 참조이므로 input 요소에 대해 `focus` 메서드를 실행하면 해당 요소에 포커스를 맞출 수 있습니다.

`handleOnClick` 함수 안에서 `inputEl.current`로 얻은 input 요소에 `focus` 메서드를 실행합니다.

```javascript
const handleOnClick = () => inputEl.current.focus();
```

여기까지 설정하면 버튼을 클릭하면 input 요소에 포커스되는 것을 확인할 수 있습니다.

이렇게 useRef를 이용하여 ref 속성으로 설정한 요소에 대한 참조를 얻을 수 있음을 알았습니다.

요소의 참조를 이용하여 요소에 직접 `focus` 메서드를 사용해 포커스할 수 있다는 것도 확인했습니다.

```javascript
import { useRef, useState } from "react";

function App() {
  const inputEl = useRef(null);
  const [name, setName] = useState("");
  const handleOnChange = (e) => setName(e.target.value);
  const handleOnClick = () => inputEl.current.focus();  

  return (
    <div style={{ margin: "2em" }}>
      <input ref={inputEl} type="text" value={name} onChange={handleOnChange} />
      <p>이름: {name}</p>
      <button onClick={handleOnClick}>포커스 맞추기</button>
    </div>
  );
}

export default App;
```

참조를 이용하여 DOM에 접근할 수 있다는 것은, 접근한 요소의 정보를 `getBoundingClientRect` 메서드를 이용하여 얻을 수 있다는 뜻 입니다.

```javascript
const handleOnClick = () =>
  console.log(inputEl.current.getBoundingClientRect());
```

`handleOnClick` 메서드의 내용을 변경하고 버튼을 클릭하면 콘솔에 요소의 정보가 표시됩니다.

**getBoundingClientRect로 얻은 값**

![](https://blogger.googleusercontent.com/img/a/AVvXsEg30L_c-EIYzamKFpr1s_IkfrAq-GvQd5z7K_SpwzgABBAylWjJE1ZGpDROawFLiQsjW20gZIVQUU2aikLhXRBUrydm3S1rYPgUhYHSz12krKxphuwQKJwjqnaoo0pK0sND9aHkSf8SqbSGFPl33XZcyzLcbnwcWTWut9dUWXAcynTddMRRIG0GFu6Ghk8)

useRef를 사용하여 요소에 접근할 수 있으므로 `style` 속성을 사용하여 글자 색상을 변경하는 것도 가능합니다.

```javascript
inputEl.current.style.color = 'red';
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEhmX5RYvD_TGLftlsylzYB5jmNGL8QtSEODyFdMIx-v5vnV5TsdQXDJR_bZRkNgGzjAqXKmoJBBkQCPVLDYvNTF36uTUlunHN0dW7cGQN1jpcw15DdUvbG3IhqUWHmLptQWB7-GmqRktrB-KtLAsMqxB6ktsCB3fdfUpuqaodnmL-DjSXRwOc8Ot9ZN8a4)

---

### 2. 파일 선택 다이얼로그 예제

input 요소에 대한 포커스 예제와는 다른 예제를 useRef의 사용법을 통해 더 확인해보겠습니다.

input 요소에는 `type='file'`이라고 설정하면 브라우저가 파일 선택 다이얼로그를 불러오는데요.

간혹 input 버튼을 누르는게 아니라 어떤 아이콘을 클릭하면 파일 선택 다이얼로그가 표시되는 애플리케이션을 본 적이 있을 건데요.

이 기능도 useRef를 이용하여 구현할 수 있습니다.

```javascript
function App() {
  return (
    <div style={{ margin: '2em' }}>
      <input type="file" />
    </div>
  );
}

export default App;
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEiak6IrlaQfSTlY5Yx31KRrAM-oldfc0BDtxfnwqSyq_glhGIspM65GhtLW3FsMP_G-gg3dijYSfDpJk5t8B6xGm3cRy3z3tMkZ6YDiLLwyimB40DoIFjGoqXADwKa_xNKUKaLZ-QlTUMmqEncM3AwIVdD7Tf-qmEvlmACL4JTC5Ksc7xHYuOn6i8_LZzA)

위 그림과 같이 파일 선택 버튼이 표시되고, 클릭하면 파일 선택 다이얼로그가 아래와 같이 표시됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEi43W5rlLUrJBXv3uaGIIYH8vh4vc2Aygcojt6G50wzO6Gmiyl8SsDWvee_EOMoVnFawDXwpKZ6l5xXkWPOGeNvCOFRNtpPXblbx0T71FILLrA72GOk-zjobhKY5Xive3V6sVIzj3HaROXVpEOh2tWmeID8lB21WBWw_VCh8Chen57RzaQ2tsIn8QZVO5s)

input 요소에 useRef를 설정합니다.

그리고 나서 버튼을 추가하고 click 이벤트를 설정하여, 버튼을 클릭하면 `inputEl.current.click()`을 실행하도록 설정합니다.

```javascript
import { useState, useRef } from 'react';

function App() {
  const inputEl = useRef(null);

  return (
    <div style={{ margin: '2em' }}>
      <div>
        <button onClick={() => inputEl.current.click()}>파일</button>
      </div>
      <input ref={inputEl} type="file" />
    </div>
  );
}

export default App;
```

이제 "파일" 버튼을 클릭하거나 파일 선택 버튼을 클릭하거나, 어느 쪽이든 파일 선택 다이얼로그가 열리게 됩니다.

여기서는 "파일"이라는 이름으로 했지만 아이콘 등으로 변경해도 동작은 동일합니다.

이제 파일 선택 버튼은 필요 없으므로 화면에서 숨깁니다.

input 요소에 `hidden` 속성을 설정하여 표시되지 않도록 할 수 있습니다.

```javascript
<input ref={inputEl} type="file" hidden />
```

선택한 파일의 정보는 input 요소에 `onChange` 이벤트를 설정하여 event에서 얻을 수 있습니다.

```javascript
import { useRef } from 'react';

function App() {
  const inputEl = useRef(null);
  const selectedFile = (e) => {
    console.log(e.target.files);
  };

  return (
    <div style={{ margin: '2em' }}>
      <div>
        <button onClick={() => inputEl.current.click()}>파일</button>
      </div>
      <input ref={inputEl} type="file" hidden onChange={selectedFile} />
    </div>
  );
}

export default App;
```

파일 선택 다이얼로그에서 파일을 선택하고 브라우저의 개발자 도구 콘솔을 확인하면 선택한 파일의 정보를 얻을 수 있을겁니다.

event를 사용하지 않고 `inputEl.current.files`로도 파일 정보를 얻을 수 있습니다.

---

### 3. useRef에 값 저장하고 유지하기

지금까지 useRef의 요소에 대한 참조 기능을 살펴보았지만, useRef의 또 다른 사용 방법인 값의 저장,유지에 대해 확인을 해보겠습니다.

useRef는 값을 유지할 수 있지만, useState와의 차이점은 값을 갱신해도 컴포넌트의 재렌더링을 수행하지 않는다는 겁니다.

실제 예를 통해 확인해보겠습니다.

#### 3.1 재렌더링(Re-render)이란 무엇인가?

먼저, React에서는 가장 초보적인 예이지만 useState의 값을 갱신하면 재렌더링을 수행한다는 것이 무엇을 의미하는지 먼저 확인해보겠습니다.

useState로 `count`를 정의하고, 버튼을 클릭하면 `count`의 값이 1 증가하는 코드를 작성하겠습니다.

재렌더링이 이루어지는지 확인하기 위해 `console.log('재렌더링')`을 실행시키겠습니다.

```javascript
import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);
  const handleOnClick = () => setCount(count + 1);

  console.log('재렌더링');

  return (
    <div style={{ margin: '2em' }}>
      <div>{count}</div>
      <button onClick={handleOnClick}>Count 증가</button>
    </div>
  );
}

export default App;
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEgjPg8MAzTV95NOifymOa9RXCA1jKehgbFoGnxcbcvteF8yRhz06fOXCnNELD5ABOlWIANskoJx-vZAJhaVltn6t3mlb03vb4LDTCMGaIueu8fqBla3elAObGyfGFV1MNkH0OClhj762xKbL_2_9rJYbU1wTbAtIHOw0_VQ3loZW0hdoSbSDCJfdwowblE)

위 그림과 같이 버튼을 누르면 브라우저 콘솔창에 "재렌더링"이 계속해서 나타납니다.

즉 버튼을 누를 때마다 콘솔에 "재렌더링" 메시지가 표시되고 있어 App이라는 리액트 컴포넌트가 재렌더링이 이루어지고 있음을 알 수 있습니다.

React에서는 useState로 정의한 변수를 갱신하면 재렌더링이 이루어지고 있음을 확인할 수 있습니다.

#### 3.2 useRef에서는 재렌더링하지 않는다!!!

이번에는 useRef로 정의한 변수를 갱신해도 재렌더링이 이루어지지 않는다는 것을 확인보겠습니다.

useRef로 새로운 `countRef`를 정의하고, 버튼을 클릭하면 `countRef`의 값이 갱신되도록 하겠습니다.

useState를 이용한 "Count 증가" 버튼과 useRef를 이용한 "Count2 증가" 버튼을 설정합니다.

```javascript
import { useState, useRef } from 'react';

function App() {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const handleOnClick = () => setCount(count + 1);
  const handleOnClick2 = () => countRef.current++;

  console.log('재렌더링');

  return (
    <div style={{ margin: '2em' }}>
      <div>{count}</div>
      <button onClick={handleOnClick}>Count 증가</button>
      <div>{countRef.current}</div>
      <button onClick={handleOnClick2}>Count2 증가</button>
    </div>
  );
}

export default App;
```

useRef를 이용하여 초기값을 0으로 설정했습니다.

여기서 기억해 두어야 할 점은 useRef를 이용하면 `current` 프로퍼티에 값을 저장한다는 것입니다.

초기값을 0으로 설정했다는 것은 `countRef.current`의 값을 0으로 설정했다는 것입니다.

갱신된 값도 `countRef.current`에 저장되며, 값을 표시하려면 `countRef.current` 값을 출력하면 됩니다.

실제로 브라우저에서 "Count2 증가" 버튼을 3번 클릭하고, "Count 증가" 버튼을 1번 클릭해 봅시다.

어떻게 될 것 같습니까?

"Count2 증가" 버튼을 3번 눌렀지만 브라우저에도 콘솔에도 아무 변화가 없습니다.

"Count2 증가" 버튼의 클릭 이벤트에 설정한 `handleOnClick2`가 제대로 동작하지 않는 것이 아닌가 하는 의심이 들 수도 있습니다.

다음으로 "Count 증가" 버튼을 눌러보세요.

"Count 증가" 버튼을 누르면 `setCount` 메서드로 `count`가 1 증가하고, 컴포넌트의 재렌더링이 이루어집니다.

따라서 콘솔에는 "재렌더링"이 표시됩니다.

방금까지 아무리 눌러도 갱신되지 않던 `countRef.current`의 값이 재렌더링과 함께 갱신되어, 그동안 버튼을 눌렀던 횟수가 표시됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgsebpvpFanxeW1p2mpSvQ56xkavFuEdZf4FnrUL2Ic6FTFwae1T6lAFRO7qCsGNdwCIW_hRtF--s9SL5nVMDF5nvGzYqM7V8-yMjXdOSacuAb7FU-EeorsiJYZweCCfBGGqqqbNYEAfy2PuyTD3Tjmr013tS8GTMtZTEoVPeUIT1QWmUIniegVsDQa-00)

"Count2 증가" 버튼으로 `countRef.current`가 갱신되지 않았던 것이 아니라, `countRef.current`는 갱신되고 있었지만 컴포넌트의 재렌더링이 이루어지지 않아 브라우저에 반영되지 않았던 것입니다.

또한 재렌더링은 갱신된 값을 표시하기 위해 필요한 처리라는 것도 이해할 수 있습니다.

만약 useState로 값을 갱신해도 재렌더링이 이루어지지 않는다면 브라우저에 갱신된 값이 표시되지 않을 것입니다.

이 동작 확인을 통해 useRef로 정의한 변수를 갱신해도 useState와 달리 컴포넌트의 재렌더링이 이루어지지 않는다는 것을 이해하셨을 것이라 생각합니다.

---

### 4. Form(폼)에서의 useState와 useRef

useState를 이용하여 입력 폼을 만들 수 있지만, useRef로도 입력 폼을 만들 수 있습니다.

먼저 useState를 이용한 입력 폼 작성 방법을 확인한 후, useRef를 이용한 작성 방법을 확인하겠습니다.

#### 4.1 useState를 이용한 방법

입력한 값을 유지하기 위해 useState로 `email`과 `password`를 정의합니다.

input 요소를 이용하여 `email`과 `password` 입력란을 추가하고 `onChange` 이벤트를 설정하여 입력이 이루어지면 `handleChangeEmail`과 `handleChangePassword`가 실행되어 `email`과 `password`에 입력한 값이 저장됩니다.

로그인 버튼을 누르면 `handleSubmit` 함수가 실행되어 콘솔에 입력한 값이 표시됩니다.

```javascript
import { useState } from 'react';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`email: ${email}, password: ${password}`);
  };

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };
  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };
  return (
    <div className="App">
      <h1>로그인</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">이메일</label>
          <input id="email" value={email} onChange={handleChangeEmail} />
        </div>
        <div>
          <label htmlFor="password">패스워드</label>
          <input
            id="password"
            value={password}
            onChange={handleChangePassword}
            type="password"
          />
        </div>
        <div>
          <button>로그인</button>
        </div>
      </form>
    </div>
  );
}

export default App;
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEgCQ0xL_YSyyPFPZX4-O2euqtIfrkhRN2MJ8aCPY3j_5LffaJKekLBWGgLEZ6jMa5XPqC5tZ4qQovbd19yA9Tlad_L4ynL0I5nPH5G8Lt55WpGy3AYE1Bs-BkevP6ZvaXjK5Nk29rbdc9AQrKe4HrMC9PfG_NIVFUFDY8ADoqNEaE3ZeQscT3fX44mfLzI)

![](https://blogger.googleusercontent.com/img/a/AVvXsEjQmPEcTx5LBOXWbJvIad5lo7fHjzAty6tzFPQs2vKICxYKYyUR7hR-Wn8cgkPw2OLjpRzgp-eL71suFCJhHjSKKaKHBj_pYAD63NAV00TZTuBNqa8wdL8ioIdCzW7br24r3Fe0dm6Zq5hwsHlkKFUrvia5JI8APGOUS97Z-8TzkFhRiWNzrFmzx4327zM)

#### 4.2 useRef를 이용한 방법

이제 아까 코드에서 useState에서 useRef로 변경해봅시다.

useRef로 `emailRef`와 `passwordRef`를 정의하고 input 요소의 ref 속성에 설정합니다.

input 요소에 입력한 값은 email의 경우 `emailRef.current.value`로 얻을 수 있습니다.

```javascript
import { useRef } from 'react';

function App() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(
      `email: ${emailRef.current.value}, password: ${passwordRef.current.value}`
    );
  };

  return (
    <div className="App">
      <h1>로그인</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">이메일</label>
          <input id="email" ref={emailRef} />
        </div>
        <div>
          <label htmlFor="password">패스워드</label>
          <input id="password" ref={passwordRef} type="password" />
        </div>
        <div>
          <button>로그인</button>
        </div>
      </form>
    </div>
  );
}

export default App;
```

두 경우 모두 화면상에는 차이가 없으며, email에 `test@test.com`, password에 `1111`를 입력하면 동일한 값이 콘솔에 표시됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjQmPEcTx5LBOXWbJvIad5lo7fHjzAty6tzFPQs2vKICxYKYyUR7hR-Wn8cgkPw2OLjpRzgp-eL71suFCJhHjSKKaKHBj_pYAD63NAV00TZTuBNqa8wdL8ioIdCzW7br24r3Fe0dm6Zq5hwsHlkKFUrvia5JI8APGOUS97Z-8TzkFhRiWNzrFmzx4327zM)

겉으로는 차이가 없지만, useState를 이용한 경우에는 문자를 입력할 때마다 "재렌더링"이 이루어집니다.

email은 useRef로, password는 useState로 설정하면 차이가 명확해집니다.

```javascript
import { useState, useRef } from 'react';

function App() {
  const emailRef = useRef(null);
  // const passwordRef = useRef(null);
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(
      `email: ${emailRef.current.value}, password: ${password}`
    );
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };
  return (
    <div className="App">
      <h1>로그인</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">이메일</label>
          <input id="email" ref={emailRef} />
          {emailRef.current && <div>{emailRef.current.value}</div>}
        </div>
        <div>
          <label htmlFor="password">패스워드</label>
          <input
            id="password"
            value={password}
            onChange={handleChangePassword}
            type="password"
          />
          <div>{password}</div>
        </div>

        <div>
          <button>로그인</button>
        </div>
      </form>
    </div>
  );
}

export default App;
```

email을 입력해도 아무것도 표시되지 않지만, password를 입력하는 순간 `emailRef.current.value`에 저장되어 있던 값이 재렌더링으로 인해 표시됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjlstIRKT7KqkQzld_5ABghyV4r3-H3Wo_W11ojkJO1bvX6sZS_3Ut5ZF1uvdsQwGKRdBacRzuwv2EgsZAI7RIoGoO2TkHF-x4jrg6sNurH4r7MC6uGlM9fFBZu8reEt4bO2PirVUgsQd7Z0U1_A-xe331RQBMfKIQrPLJRlgHaiW4N2-XALi1oLWik82s)

위 그림처럼 패스워드에 한글자만 입력해도 재렌더링이 이루어지기 때문에 email에 입력한 값도 브라우저에 그 대로 표시되고 있습니다.

컴포넌트 내에서 값을 유지하고 싶지만 브라우저에 갱신된 내용을 실시간으로 표시할 필요가 없는 경우에는 useRef를 활용할 수 있다는 것을 새삼 알 수 있었습니다.
