---
slug: 2023-04-01-javascript-errors-beginner-avoid-them
title: 초보자면 다 한번 마주친 자바스크립트 에러 모음
date: 2023-04-01 01:00:39.004000+00:00
summary: 초보자면 다 한번 마주친 자바스크립트 에러 모음
tags: ["javascript", "error"]
contributors: []
draft: false
---

오늘날, JavaScript는 전 세계에서 가장 인기 있고 널리 사용되는 프로그래밍 언어 중 하나인데요.

웹 애플리케이션, 모바일 앱, 웹서버 등 못 하는 게 없는 언어인 데 반해, 자바스크립트의 가장 큰 단점은 바로 문법이 난해하고 작동 방식이 일반 사람들이 예측했던 것과 다르다는 겁니다.

또한 오류가 발생하기 쉬운 언어이기도 합니다.

이번 글에서는 자바스크립트 오류에 대해 왜 이게 생기는지 한번 따져 볼 생각입니다.

가볍게 한번 읽어보시면 자바스크립트 공부에 도움이 될 거라 믿습니다.

1. **SyntaxError: Unexpected token**

한국어로 번역하면 “예상치 못한 토큰” 오류인데요. 토큰이라고 해서 뭔가 암호 토큰 같은데 사실 이 얘기는  JavaScript 인터프리터가 문법 에러를 발견하면 내뱉는 에러입니다.

여기서 토큰이라는 이름은 바로 기호 또는 단어를 뜻합니다. 예를 들어볼까요?

```jsx
let name = "Kazim
console.log(name);
```

위의 코드는 문자열 "Kazim 끝에 따옴표가 빠져 있기 때문에 SyntaxError가 발생한 겁니다.

앞으로 이 오류가 나오면 놀라지 마시고 기호나 따옴표, 컬리 브레이스({}) 같은 거 틀렸는지 확인해 보면 됩니다.

2. **ReferenceError: Variable is not defined**

이 오류는 우리말로 “변수가 정의되지 않았습니다”라는 에러인데요.

자바스크립트 호이스팅과 관련되어 있습니다.

이 오류는 선언되거나 초기화되지 않은 변수에 접근하려고 할 때 발생합니다. 예를 들어:

```jsx
console.log(x);
let x = 10;
```

위 코드에서는 let 키워드로 선언되기 전에 x를 사용하려고 하므로 ReferenceError가 발생합니다.

이 오류를 해결하려면 당연히 x를 사용하기 전에 먼저 선언해야 합니다:

```jsx
let x = 10;
console.log(x);
```

만약 var 키워드로 선언하면 위의 코드는 에러가 없을 건데요. 바로 자바스크립트 호이스팅 때문입니다.

그래도 최근 ES6 등에서는 var 키워드의 위험성 때문에 let 키워드를 권장하니까 꼭 let 키워드를 쓰실 것을 권해드립니다.

3. **TypeError: Cannot read property of undefined (or null)**

TypeError:  (undefined 또는 null) 속성을 읽을 수 없음

이 오류는 undefined 또는 null인 객체의 속성 또는 메서드에 액세스 하려고 할 때 발생합니다. 예를 들어:

```jsx
const person = {
  name: "Kayhan",
  age: 25
};
console.log(person.job.title);
```

위의 코드는 person.job이 정의되지 않았기 때문에 title 속성을 읽을 수 없어 TypeError가 발생합니다. 이 오류를 해결하려면 person.job이 존재하는지 확인한 후 title 속성에 액세스해야 합니다:

```jsx
const person = {
  name: "Kayhan",
  age: 25
};
if (person.job) {
  console.log(person.job.title);
}
```

이 오류를 피하려면 객체나 속성이 존재하는지 항상 확인한 후 액세스해야 합니다.

4. **RangeError: Invalid array length**

RangeError: 유효하지 않은 배열 길이

이 오류는 배열의 크기 값을 잘못 사용하여 배열을 생성하려고 할 때 발생합니다. 예를 들어:

```jsx
let arr = new Array(-1);

```

위 코드는 -1이 유효한 배열 크기 값이 아니기 때문에 RangeError를 발생시킵니다. 이 오류를 수정하려면 배열 길이에 양의 정수 값을 사용해야 합니다:

```jsx
let arr = new Array(10);
```

이 오류를 피하려면 배열 길이에 항상 유효한 값을 사용해야 합니다.

5. **URIError: Malformed URI**

URIError: 잘못된 URI

이 오류는 URI (Uniform Resource Identifier)를 잘못된 형식으로 인코딩하거나 디코딩하려고 할 때 발생합니다. 예를 들어:

```jsx
decodeURI("%");
```

위 코드는 "%"가 올바른 URI 구성 요소가 아니기 때문에 URIError를 발생시킵니다. 이 오류를 수정하려면 올바른 URI 구성 요소를 사용해야 합니다:

```jsx
decodeURI("%20");
```

 이 오류를 피하려면 항상 올바른 URI 구성 요소를 사용하여 URI를 인코딩하거나 디코딩해야 합니다.

6. **Uncaught exception**

처리되지 않은 예외

이 오류는 예외(코드의 정상 흐름을 방해하는 예기치 않은 이벤트)가 발생했지만, 코드에서 어떤 catch 블록에도 처리되지 않을 때 발생합니다. 예를 들어:

```jsx
function divide(a, b) {
  if (b === 0) {
    throw new Error("Cannot divide by zero");
  }
  return a / b;
}
console.log(divide(10, 0));
```

위 코드는 divide()에서 던진 Error 객체를 처리할 catch 블록이 없기 때문에 처리되지 않은 예외를 발생시킵니다.

이 오류를 수정하려면 divide()를 호출하는 try 블록 다음에 catch 블록을 추가해야 합니다:

```jsx
function divide(a, b) {
  if (b === 0) {
    throw new Error("Cannot divide by zero");
  }
  return a / b;
}
try {
  console.log(divide(10, 0)); // 이것은 오류를 일으킬 것입니다
} catch (error) {
  console.error(error.message); // "Cannot divide by zero"
}

try {
  console.log(divide(10, 2)); // 이것은 오류를 일으키지 않습니다.
} catch (error) {
  console.error(error.message); // 이것은 실행되지 않습니다.
}

```

이 오류를 피하고자 적절한 위치에 `try…catch` 블록을 사용하고 다양한 유형의 예외를 적절하게 처리해야 합니다.

7. **Stack Overflow: Maximum call stack size exceeded**

Stack Overflow: 최대 호출 스택 크기 초과

Stack Overflow는 컴퓨터 프로그램이 호출 스택(call stack)에 할당된 메모리를 모두 소진할 때 발생하는 오류 유형인데요.

콜 스택은 프로그램 실행을 추적하기 위해 실행 중인 함수에 대한 정보를 저장하는 데이터 구조입니다.

함수가 호출되면 해당 정보가 콜 스택의 상단에 추가되고, 함수가 완료되면 해당 정보가 스택 상단에서 제거되는 방식입니다.

"최대 호출 스택 크기 초과" 오류는 JavaScript에서 스택 오버플로 오류의 일반적인 예입니다.

이 오류는 함수가 자신을 너무 많이 호출하여 호출 스택을 채우고 오버플로를 일으키는 무한 루프를 생성할 때 발생합니다. 예를 들어:

```jsx
function countdown(n) {
  if (n <= 0) {
    return;
  }
  console.log(n);
  countdown(n - 1);
}

countdown(5);
```

이 예에서는 countdown 함수가 n 값이 감소하면서 재귀적으로 계속 호출됩니다. 예를 들어 countdown(100000)과 같은 경우, 콜 스택이 결국 오버플로우되고 "최대 호출 스택 크기 초과" 오류가 발생합니다.

스택 오버플로 오류를 피하기 위해서는 재귀 함수가 재귀를 종료하는 기본 경우를 가지고 있도록 하고, 무한 루프를 생성할 수 있는 루프 내에서는 함수를 호출하는 것을 되도록 피해야 합니다.

8. **Memory leak**

메모리 누수는 프로그램이 필요한 것보다 더 많은 메모리를 사용하고 더 이상 필요하지 않은 메모리를 해제하지 않았을 때 발생합니다.

보통 이런 에러로 인해 프로그램이 시간이 지남에 따라 느려지거나 최악의 경우 프로그램이 실행 중단될 수 있습니다.

메모리 누수의 예시:

```jsx
let elements = [];

function addElement() {
	let element = document.createElement('div');
	elements.push(element);
	document.body.appendChild(element);
}

setInterval(addElement, 1000);
```

이 예시에서는 setInterval 메소드를 사용하여 addElement를 매초 호출합니다. 이 함수는 새로운 div 요소를 생성하고 elements 배열에 추가한 다음 document.body 요소에 추가합니다.

시간이 지남에 따라 elements 배열은 계속해서 새로운 요소가 추가되면서 커지지만, 배열에서 오래된 요소를 제거하는 코드가 없습니다.

점점 더 많은 메모리를 사용하게 되어 결국 메모리 누수를 발생시키게 됩니다.

위와 같은 메모리 누수를 수정하려면 addElement 함수를 수정하여 배열에서 오래된 요소를 제거해야 합니다.

```jsx
let elements = [];

function addElement() {
	let element = document.createElement('div');
	elements.push(element);
	document.body.appendChild(element);

	if (elements.length > 10) {
		let oldElement = elements.shift();
		document.body.removeChild(oldElement);
	}
}

setInterval(addElement, 1000);
```

위 코드처럼 하면 프로그램이 필요한 것보다 더 많은 메모리를 사용하지 않으며 메모리 누수를 피할 수 있습니다.

자바스크립트에서 메모리 누수를 방지하기 위한 체크 리스트인데요.

1. 이벤트 핸들러를 적절하게 관리하고,
2. 전역 변수를 피하고,
3. 사용하지 않는 객체의 메모리를 해제하며,
4. 클로저를 사용할 때 주의하고,
5. 메모리 프로파일러 도구를 사용하여 메모리 누수를 식별하고 수정해야 합니다.

9 . **Promise rejection error**

JavaScript에서 Promise rejection 오류는 Promise 객체가 거절되어 발생하며, 즉, 의도된 목적을 이루지 못했다는 것을 의미합니다.

프로미스는 JavaScript에서 비동기 작업을 처리하는 방법으로, 작업이 완료되기를 기다리는 동안 다른 프로그램이 계속 실행되도록 합니다.

프로미스 거절 오류의 예시:

```jsx
let promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('Error: Promise was rejected');
  }, 1000);
});

promise.then(result => {
  console.log(result);
}).catch(error => {
  console.log(error);
});
```

이 예에서는, 1초 후에 오류 메시지로 거절되는 새로운 Promise 객체를 생성합니다.

그다음 Promise 객체에 then과 catch 메소드를 연결하며, 이는 Promise가 해결되거나 거절되는지에 따라 호출됩니다.

이 예시에서 프로미스는 거절되므로, catch 메소드가 호출되고 오류 메시지가 콘솔에 기록됩니다.

프로미스 거절 오류를 피하기 위해서는, 프로미스 코드에서 발생할 수 있는 모든 오류를 처리하고 catch 메소드를 사용하여 거절된 프로미스를 처리해야 합니다.

10 . The a**sync/await errors**

이 에러는 async/await 구문을 사용할 때 발생합니다.

async/await 에러를 피하기 위해서는 에러를 올바르게 처리하는 것이 중요합니다.

다음은 몇 가지 팁입니다:

1. try-catch 블록 사용: Promise가 resolve될 때까지 기다리기 위해 await를 사용할 때, try...catch 블록 안에 넣어서 가능한 에러를 잡아야 합니다. Promise가 거부되면, 에러가 발생하고 catch 블록에서 잡힐 수 있습니다.
2. 함수에 async 표시: 함수 내에서 await를 사용하면, 함수를 async로 선언해야 합니다. 그렇지 않으면 구문 에러가 발생합니다.
3. Promise 거부 반환: async/await를 사용하는 함수 내에서 에러를 잡지 않고 원래 호출 함수에 넘겨줄 때, 호출한 함수에서 해당 에러를 잘 처리하게끔 rejected Promise로 반환하는 게 좋습니다.
4. finally 문버 사용: Promise가 처리된 후 정리 코드를 실행해야 하는 경우, finally 블록을 사용할 수 있으며, 이 finally 블록은 Promise가 해결되거나 거부되는지 여부에 관계없이 실행되니 참고 바랍니다.

올바른 에러 처리를 사용하여 async/await를 사용하는 방법의 예시:

```jsx
async function fetchData() {
  try {
    const response = await fetch('https://example.com/data.json');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('An error occurred:', error);
    // Return a rejected Promise so the caller can handle the error appropriately
    return Promise.reject(error);
  }
}

// Call the function and handle any possible errors
fetchData()
  .then(data => {
    console.log('Data received:', data);
  })
  .catch(error => {
    console.error('An error occurred:', error);
  });
```

지금까지 자바스크립트 에러 코드에 대해 왜 이 에러가 발생되는지에 대해 알아보았는데요.

이렇게 한 번 읽어 보는 게 난해한 자바스크립트를 더 잘  이해할 수 있지 않을까 생각해 봅니다.

그럼.