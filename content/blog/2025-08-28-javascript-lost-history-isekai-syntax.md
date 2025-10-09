---
slug: 2025-08-28-javascript-lost-history-isekai-syntax
title: "자바스크립트의 잃어버린 역사, 당신이 몰랐던 '이세계'의 문법들"
date: 2025-09-01 12:20:16.777000+00:00
summary: 지금은 표준에서 사라졌지만 한때는 존재했던, 혹은 다른 세상에서 쓰였던 JavaScript의 신기한 문법들을 탐험합니다. JScript부터 E4X, JScript.NET까지, 이 고대 기술들이 현대 개발에 주는 교훈을 찾아보세요.
tags: ["JavaScript", "ECMAScript", "JScript", "E4X", "프론트엔드", "웹개발"]
contributors: []
draft: false
---

우리가 매일 사용하는 자바스크립트에 혹시 다른 모습의 '평행세계'가 존재한다면 어떨까요?<br /><br />
마치 이세계 전생물처럼, 완전히 다른 환경과 규칙을 가진 또 다른 자바스크립트가 있다는 상상, 한 번쯤 해보셨을 텐데요.<br /><br />
사실 이건 아주 먼 이야기가 아닙니다.<br /><br />
지금은 표준 ECMAScript의 역사 속으로 사라졌지만, 분명히 존재했고 또 치열하게 논의되었던 '다른 세계'의 문법들이 있거든요.<br /><br />
오늘은 마치 고고학자가 된 것처럼 자바스크립트의 잃어버린 유적들을 탐사해 보려고 합니다.<br /><br />
단순한 옛날이야기가 아니라, 이 여정이 끝날 때쯤엔 우리가 왜 현재의 자바스크립트를 사용하게 되었는지, 그리고 앞으로 어떤 변화를 경계해야 하는지에 대한 깊은 통찰을 얻게 되실 겁니다.<br /><br />

## 1. `typeof` 연산자의 숨겨진 얼굴

자, 첫 번째 유적지입니다.<br /><br />
모던 자바스크립트에서 `typeof` 연산자가 반환하는 값은 'undefined', 'object', 'string', 'symbol', 'boolean', 'number', 'bigint', 'function' 이렇게 딱 8가지인데요.<br /><br />
하지만 과거에는 이 8가지 외에 다른 값을 뱉어내는 자바스크립트가 있었습니다.<br /><br />
바로 Microsoft가 만들었던 'JScript'라는 언어입니다.<br /><br />
JScript는 윈도우 환경에서 쓰이던 ECMAScript 3 호환 언어였거든요.<br /><br />
아래 코드를 한 번 보시죠.<br />

```javascript
var x = new ActiveXObject("ADODB.Stream");
x.Type = 1;
x.Open();
x.LoadFromFile("test.js"); // 파일 경로는 예시입니다.
var b = x.Read(1);
x.Close();
WScript.Echo("typeof b = " + typeof b);
```

이 코드를 윈도우 스크립트 호스트(WSH)에서 실행하면 `typeof b`는 놀랍게도 'unknown'이라는 문자열을 반환하는데요.<br /><br />
이게 어떻게 가능했냐면, 과거 ECMAScript 3 명세에는 '호스트 객체(Host Object)'에 대한 `typeof`의 동작을 각 구현체(브라우저나 실행 환경)가 마음대로 정의할 수 있도록 허용했기 때문입니다.<br /><br />
즉, 표준에 정의되지 않은 환경 고유의 객체는 `typeof`를 통해 자신만의 타입을 알릴 수 있었던 겁니다.<br /><br />
지금은 상상하기 힘든, 굉장히 유연하지만 동시에 파편화를 일으킬 수 있는 방식이었습니다.<br /><br />

## 2. 할당문의 왼쪽에 함수 호출이? 참조 반환 함수

계속해서 JScript의 세계를 탐험해 보죠.<br /><br />
C++ 같은 언어에서는 함수가 '참조(Reference)'를 반환해서 함수 호출 자체가 할당문의 왼쪽에 올 수 있거든요.<br /><br />
하지만 자바스크립트에서는 이게 불가능합니다.<br />

```javascript
var obj = {};
function getMember() {
    return obj.member;
}
getMember() = "foo"; // 당연히 SyntaxError가 발생합니다.
```

그런데 JScript에서는 이게 가능했습니다.<br /><br />
물론 자바스크립트 함수가 직접 참조를 반환하는 건 아니고요, `ActiveXObject` 같은 호스트 객체의 메서드가 참조를 반환하면 JScript 엔진이 이를 처리할 수 있었던 겁니다.<br />

```javascript
var dict = new ActiveXObject("Scripting.Dictionary");
dict.Item("foo") = "bar"; // 'Item' 메서드 호출이 할당문 왼쪽에!
WScript.Echo(dict.Item("foo")); // "bar"가 출력됩니다.
```

이것도 과거 ECMAScript 5.1 명세에 "호스트 객체가 참조 타입을 반환할 수 있는지 여부는 구현에 따라 다르다"는 내용이 있었기에 가능했던 일인데요.<br /><br />
이 규정은 결국 ECMAScript 2015(ES6)에서 삭제되면서 역사 속으로 사라졌습니다.<br /><br />
자바스크립트 언어 자체의 예측 가능성과 일관성을 높이기 위한 결정이었던 셈입니다.<br /><br />

## 3. 특정 에러만 골라 잡는 `catch if`

try-catch 문으로 에러를 처리할 때, 특정 종류의 에러에만 반응하고 싶을 때가 있잖아요?<br /><br />
요즘은 보통 catch 블록 안에서 if 문으로 에러의 종류를 확인하는데요.<br />

```javascript
try {
    throw new TypeError("Something went wrong");
} catch (e) {
    if (e instanceof TypeError) {
        console.error("Type Error:", e.message);
    } else {
        throw e; // 처리할 수 없는 에러는 다시 던집니다.
    }
}
```

이걸 좀 더 간결하게, catch 문에 바로 조건을 달 수 있다면 어떨까요?<br /><br />
과거 Mozilla의 SpiderMonkey 엔진에서는 이게 실제로 가능했습니다.<br /><br />
'Conditional Catch'라고 불리는 `catch if` 문법이 있었거든요.<br />

```javascript
try {
    throw new RangeError("test");
} catch (e if e instanceof RangeError) {
    // RangeError일 경우에만 이 블록이 실행됩니다.
    print(e.toString());
}
```

굉장히 직관적이고 편리해 보이지만, 아쉽게도 이 문법은 ECMAScript 표준으로 채택되지 못하고 결국 SpiderMonkey 엔진에서도 제거되었습니다.<br /><br />
아마도 언어의 복잡성을 늘리는 것에 대한 부담감과, 기존의 `if`문으로도 충분히 구현 가능하다는 점이 작용했을 겁니다.<br /><br />
현재 이 문법을 체험해보고 싶다면, Java로 만들어진 또 다른 자바스크립트 엔진인 'Rhino'를 사용하면 됩니다.<br /><br />

## 4. 객체의 '값'만 쏙쏙 뽑아내는 `for each`

객체의 모든 속성을 순회할 때 우리는 보통 `for...in` (키 순회)이나 `Object.keys()`, `Object.values()`, `Object.entries()`와 함께 `for...of`를 사용하는데요.<br /><br />
과거 Mozilla의 자바스크립트에는 객체의 '값'만 순회하는 특별한 문법이 있었습니다.<br /><br />
바로 `for each...in` 구문입니다.<br />

```javascript
var user = {
    name: "Alice",
    level: 99,
    job: "Wizard",
};
// for...in 이 아니라 for each...in 입니다.
for each (var value in user) {
    print(value);
}
// 출력:
// "Alice"
// 99
// "Wizard"
```

이 문법은 `Object.values()`와 `for...of`를 합친 것과 거의 똑같이 동작하는데요.<br /><br />
이 역시 E4X(아래에서 설명할) 표준의 일부로 제안되었지만, 범용적인 표준이 되지는 못하고 결국 `for...of`와 헬퍼 메서드들의 등장으로 대체되었습니다.<br /><br />
하나의 문제를 푸는 방법이 여러 가지가 되기보다는, 더 범용적이고 조합 가능한 방식으로 표준이 발전해나간 좋은 예시라고 할 수 있습니다.<br /><br />

## 5. JSX의 먼 친척? XML을 품은 자바스크립트, E4X

요즘 리액트 개발자라면 JSX 문법에 아주 익숙하실 텐데요.<br /><br />
자바스크립트 코드 안에 XML(HTML)과 유사한 문법을 직접 써 내려가는 아이디어는 사실 아주 오래전부터 있었습니다.<br /><br />
그 원조 격이라고 할 수 있는 것이 바로 'E4X (ECMAScript for XML)'입니다.<br /><br />
E4X는 심지어 ECMA 표준(ECMA-357)으로 제정되기까지 했던, 꽤나 진지했던 프로젝트였거든요.<br /><br />
E4X를 사용하면 자바스크립트 내에 XML 리터럴을 바로 선언하고, 객체처럼 다룰 수 있었습니다.<br />

```javascript
// JSX가 아닙니다! E4X입니다.
var profile = <user id="123">
                  <name>John Doe</name>
                  <email>john@example.com</email>
                </user>;

print(profile.name); // "John Doe" 출력
print(profile.@id); // 속성에 접근할 때는 '@'를 사용합니다. "123" 출력
print(typeof profile); // "xml" 이라는 새로운 타입을 반환합니다.
```

`typeof`의 결과로 'xml'이 나온다는 점도 충격적인데요.<br /><br />
E4X는 한때 Firefox의 기본 기능이었지만, JSON이 데이터 교환의 대세가 되고 XML의 인기가 식으면서 결국 웹 생태계에서 자연스럽게 도태되었습니다.<br /><br />
하지만 자바스크립트와 마크업을 통합하려는 시도는 JSX라는 형태로 화려하게 부활했으니, E4X는 시대를 너무 앞서간 비운의 기술이라고도 볼 수 있겠습니다.<br /><br />

## 6. 타입스크립트의 조상님? JScript.NET

마지막으로 살펴볼 곳은 정말 '다른 차원'이라고 할 수 있는 JScript.NET의 세계입니다.<br /><br />
이건 Microsoft의 .NET 프레임워크 위에서 동작하도록 만들어진, 컴파일 방식의 자바스크립트인데요.<br /><br />
문법을 보면 지금의 타입스크립트를 떠올리게 하는 요소들이 많습니다.<br />

```javascript
// JScript.NET 코드입니다.
import System;

class User {
    var name: String; // 타입 애너테이션!
    var level: int;

    function User(name: String, level: int) {
        this.name = name;
        this.level = level;
    }

    function introduce() {
        Console.WriteLine("I'm " + this.name + " (Lv." + this.level + ")");
    }
}

var user = new User("Neo", 99);
user.introduce();
```

클래스 문법, 생성자, 그리고 변수와 매개변수에 타입을 지정하는 '타입 애너테이션'까지, ES6와 타입스크립트에서 보던 기능들이 2000년대 초반에 이미 존재했던 겁니다.<br /><br />
물론 세부적인 문법은 다르지만, 정적 타입 검사를 통해 안정성을 높이려는 시도는 이미 오래전부터 있었다는 걸 알 수 있는 대목입니다.<br /><br />
JScript.NET은 C#이라는 강력한 경쟁자 때문에 널리 쓰이지는 못했지만, 자바스크립트의 발전 방향에 대한 중요한 영감을 주었다는 점에서 그 의미를 찾을 수 있습니다.<br /><br />

## 결론: 이세계 여행이 우리에게 남긴 것

지금까지 자바스크립트의 잃어버린 세계를 여행해 봤습니다.<br /><br />
'unknown'과 'xml'을 반환하던 `typeof`, `catch if`, E4X 등... 정말 신기한 문법들이 많았는데요.<br /><br />
이쯤에서 한 가지 중요한 질문을 던져볼 시간입니다.<br /><br />
최근 esbuild 같은 미니파이어(minifier)가 `typeof x === "undefined"` 코드를 `typeof x > "u"`로 최적화하는 경우가 있다는 트윗을 봤습니다.<br /><br />
`typeof`의 결과값 8가지 중 'u'로 시작하는 것은 'undefined'가 유일하다는 점을 이용한 최적화인데요.<br /><br />
오늘 우리가 살펴본 역사를 보면, 이런 최적화가 과연 안전할까요?<br /><br />
과거에 'unknown'이나 'uint16x8'(SIMD.js 제안) 같은 'u'로 시작하는 타입이 존재했거나 제안되었다는 사실을 기억해야 합니다.<br /><br />
물론 당장 문제가 되지는 않겠지만, 이는 언어의 과거와 미래의 확장 가능성을 고려하지 않은 근시안적인 최적화일 수 있다는 걸 시사합니다.<br /><br />
결국 우리가 이 낯선 문법들을 탐험하는 이유는 단순히 지적 호기심을 채우기 위함만이 아닙니다.<br /><br />
수많은 아이디어들이 왜 나타났고, 왜 사라졌는지를 이해함으로써 현재 우리가 사용하는 기술의 '설계 의도'를 더 깊이 파악할 수 있게 되거든요.<br /><br />
그리고 이는 더 안정적이고, 미래의 변화에 유연하게 대처할 수 있는 코드를 작성하는 든든한 기반이 되어 줄 겁니다.<br /><br />
