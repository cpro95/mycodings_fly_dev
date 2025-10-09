---
slug: 2023-07-14-understanding-typescript-satisfies-operator
title: 타입스크립트 satisfies 연산자(operator) 이해하기
date: 2023-07-14 08:30:13.255000+00:00
summary: 타입스크립트 satisfies 연산자(operator) 이해하기
tags: ["typescript", "satisfies"]
contributors: []
draft: false
---

안녕하세요?

오늘은 타입스크립트 4.9 버전에서 도입된 satisfies 연산자에 대해 알아보겠습니다.

satisfies 뜻은 영어에서 satisfy라는 단어로 뜻은 "만족시키다"라는 뜻인데요.

타입스크립트에서는 변수의 타입이 우리가 만든 type, interface에 만족하는지 체크한다는 의미입니다.

특히, Union 타입을 쓸 경우 타입 정보가 애매할 경우가 있는데 이때, satisfies 연산자를 쓰면 됩니다.

## 실제 예

다음과 같이 type을 지정했다고 합시다.

```js
type MyState = StateName | StateCordinates

type StateName = 'Seoul' | 'Busan' | 'Daegu'

type StateCordinates = { x: number, y: number }

type User = {
  birthState: MyState,
  currentState: MyState,
}
```

User라는 타입은 birthState 항목과 currentState 항목을 가지고 있는데 이 항목들은 MyState 타입을 가지고 있고 MyState 타입은 StateName 타입과 StateCordinates 타입의 Union 형태입니다.

StateName 타입은 string 타입으로써 실질적으로 "Seoul"과 "Busan", "Daegu" 중에 한 개만 가능하고,
StateCordinates 타입은 x, y가 number인 객체입니다.

뭔가 어렵게 타입을 지정했는데요.

User 타입에 birthState 와 currentState 항목이 가리키는 값을 "Seoul"과 "Busan", "Daegu" 중이거나 아니면 x,y 좌표인 것처럼, 아주 유연하게 대응하기 위해서 이렇게 코드를 짤 수 있습니다.

그럼, type User를 이용해서 데이터를 생성해 볼까요?

```js
const user: User = {
  birthState: 'Seoul',
  currentState: { x: 3, y: 4 },
}
```

여기까지는 쉽게 이해할 수 있습니다.

User 타입에 있는 항목 birthState와 currentState가 MyState 타입인데 MyState 타입은 StateName 과 StateCordinates 타입의 Union 타입이라 user 변수는 아주 유연하게 데이터를 지정할 수 있습니다.

그럼 여기서 실제 user 변수를 가지고 몇 가지 추가 메서드를 불러 볼까요?

```js
user.birthState.toUpperCase()
```

string의 toUpperCase 메서드를 불러서 'Seoul' 값을 'SEOUL'로 바꾸는 코드인데요.

실제 Visual Studio Code의 IntelliSense는 어떤 결과를 보일까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEiEAbxBWElSgeA4GK3oOLXfpf_a4afKm2N7rKV9cLPP-dExzpC_eeE861_3hodxLqjnfVJTaezpj0VdFYFvrRYazUQ8Qx1b95Jt5qx2Sb9JOjy0oXgEwZxawT5O8TIBKrZuacGWLJmWDSJsBBeZXChDKANBa_CmQuE_mGu7H_LfqRsBNXc6d3bJjahuh9Y)

```js
Property 'toUpperCase' does not exist on type 'MyState'.
  Property 'toUpperCase' does not exist on type 'StateCordinates'.ts(2339)
```

에러 코드는 위와 같이 toUpperCase 가 MyState 타입에 존재하지 않고 또, StateCordinates 타입에도 존재하지 않는다고 합니다.

이게 발생하는 원인은 MyState가 StateName과 StateCordinates 타입의 Union 타입이라, StateName 이 될 수도 있고, StateCordinates 타입이 될 수도 있습니다.

StateName은 string 타입이고, StateCordinates 타입은 object 타입입니다.

toUpperCase 메서드는 string 타입에만 작동하기 때문에 타입스크립트가 에러를 뿜어내는 겁니다.

이럴 경우 타입스크립트 4.9 버전 이전에는 다음과 같이 아예 강제적으로 타입 밸리데이팅(validating)을 수행하고 코드를 작성했었습니다.

```js
if (typeof user.birthState === 'string') {
  user.birthState.toUpperCase()
}
```

위 코드를 보면 아예 user.birthState의 타입이 string인지 확실히 확인하고 밑의 toUpperCase 메서드를 실행하도록 했습니다.

이렇게 하면 타입스크립트는 에러를 뿜어내지 않는데요.

이렇게 수작업으로 타입을 강제적으로 밸리데이팅(validating)하는 걸 좀 더 쉽게 해주는 게 바로 오늘 공부할 satisfies 연산자입니다.

satisfies 연산자를 이용해서 바꿔 볼까요?

```js
const user = {
  birthState: "Seoul",
  currentState: { x: 3, y: 4 },
} satisfies User;

user.birthState.toUpperCase();
```

user 변수를 지정할 때 아예 이 변수는 User 타입을 satisfies 하라고 했습니다.

그러면 밑에 toUpperCase 메서드에서 더 이상 에러가 나오지 않습니다.

satisfies 연산자가 뭐길래 에러가 안 나올까요?

satisfies 연산자는 타입스크립트에게 satisfies 뒤에 오는 User 타입을 모두 찾아 미리 밸리데이팅(prevalidating)하라고 강제하는 겁니다.

이게 무슨 소리인가 이상하게 들리실지 모르는데요.

실제, satisfies 연산자를 사용하지 않으면, 타입스크립트는 toUpperCase 메서드가 있는 명령어의 위치에서 user의 타입을 체크합니다.

여기서, user 변수의 타입은 User이고, 그리고 birthState의 타입은 MyState라는 것만 알고 있는 거죠.

즉, 현재 위치에서 알 수 있는 정보만으로 타입을 체크하는 겁니다.

결국, MyState가 Union 타입이고 string이나 object가 올 수 있다는 걸 알기 때문에 에러가 나오게 됩니다.

그러면 satisfies 연산자는 어떤 걸 수행할까요?

바로 사전 밸리데이팅(prevalidating)이나 사전 체킹(checking)인데요.

satisfies 연산자로 User 타입을 지정하면 해당 변수의 실제 항목을 미리 User 타입에 대입해 보면서 체크 및 밸리데이팅 하게 됩니다.

즉, 우리가 예전에 if 문으로 강제로 type을 검사했던 걸 satisfies 연산자는 타입스크립트를 통해 그 행위를 시키게 되는 거죠.

조금은 낯선 연산자임은 틀림없지만 예전에 수작업으로 타입 검사를 했던 걸 아주 쉽게 대신해주는 연산자이기 때문에 코드 작성이 조금은 쉬워질 거 같네요.

그러면 satisfies 연산자의 다른 사용 예시를 살펴보겠습니다.

### 항목을 제한할 수 있습니다.

satisfies 연산자를 통해 어떤 항목에만 해당한다고 제한할 수 있는 효과를 볼 수 있습니다.

예를 들어 볼까요?

```js
type Keys = 'FirstName' |"LastName"| "age"|"school"| "email"
const student = {
  FirstName: "Temitope",
  LastName: "Oyedele",
  age: 36,
  school:"oxford",
}satisfies Partial<Record<Keys, string | number>>;
```

위 코드를 보시면 satisfies 다음에 Partial과 Record라는 타입스크립트 유틸리티 타입을 이용해서 student 변수가 가질 수 있는 항목을 제한했습니다.

즉, string이나 number로만 Keys라는 Union 타입을 제한하는 효과를 가지는데요.

그래서 student.age에 boolean 값을 지정하면 에러가 발생하게 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEi8M4YaI9xjrPx1elyc5WZsM_WuLVpI471QiUhqPsfBg70_q-hxJ6SbvY8Y8SqJRB38TF84YOFnkiMU1Hr5T7JZUj1vii5I0rs6JGQ8kq_7NyFQJMDeytV41MZzWFyGwsuBOt0j51dM2MT6A9k3EdPUIprgR7-MF_mcuAASKh8XEqDEVVectluItQQhWeA)

위 그림에서 보듯이 age에 boolean 값을 넣으면 에러가 발생합니다.

위 코드에서는 Partial이라는 유틸리티 타입을 썼기 때문에 Keys 타입에 있는 email 항목은 없어도 됩니다.

그러면 Partial이라는 유틸리티 타입을 쓰지 않으면 아예 필수 항목을 지정할 수 있는데요.

```js
type Keys = 'FirstName' |"LastName"| "age"|"school"| "email"
const student = {
  FirstName: "Temitope",
  LastName: "Oyedele",
  age: 36,
  school:"oxford",
}satisfies Record<Keys, string | number>;
```

위 코드에서 보시면 satisfies에 밑줄이 그어지면서 에러가 나오는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgPGCM4WiBHWTq0rU8ieKCpO5wThGiuNabdZstnsa3FyI_qPmg1b73f17OA1QxQh7P_zGwJcij80iruUfK5tvdmBhizAwWqy-oPLm0dGsON9u_Xfmm2UvEBMx4gAMFnoHZFBf951EfN_yzxmf4NdzMPKp4n_wNKUl4rWPenfI6quVDlbljl3Bfp_sPFk18)

Keys 타입에 있는 email이란 항목이 빠졌다고 에러를 뿜어내고 있습니다.

이렇게 Partial이라는 유틸리티 타입을 빼면 아예 student 변수에 필수 항목을 강제할 수 있는 효과를 내게 됩니다.

마지막으로 Record 유틸리티 타입을 적용할 경우 변수 데이터 구현에서 실수할 수 있는 부분을 사전에 알려주기도 하죠.

만약에 아래와 같이 코드를 작성한다고 하면

```js
type Keys = "FirstName" | "LastName" | "age" | "school" | "email";
const student = {
  FirstName: "Temitope",
  LastName: "Oyedele",
  age: 36,
  school: "oxford",
  email: "temitope@gmail.com",
} satisfies Record<Keys, string>;
```

즉, Keys 타입은 string이어야만 한다는 조건입니다.

이럴 경우 위 코드에서 보시면 age 항목에 따옴표가 없이 그냥 숫자 36만 나왔는데요.

너무나 쉽게 실수할 수 있는 부분입니다.

이럴 경우 타입스크립트 satisfies 연산자가 사전에 에러를 나타내며 프로그래머가 실수한 부분을 지적해 주고 있죠.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgmsdKs6oUgnxqSL-YMqAqfwAT3qHqmy8CFpN-bbcQpss33gcg2HmGMtaX2ycrRQXxQMh-WNTIzqE-2aGs1V0Q46N9626WjoJ5f4jPzlMf_AtRgkEHRwBnqKAaL2TgSQjPztI6QRJIx__RmYgvhBhwxogcPLGI2Xph8Jx-C2Qz6nAuIptq0Ljk-D29vp5Y)

위 그림에서 보시면 age 항목에 밑줄이 그어져 있고 에러 표시가 나타납니다.

---

지금까지 타입스크립트의 satisfies 연산자에 대해 알아봤는데요.

satisfies 연산자는 기존에 있던 타입 체크에 있어 좀 더 강력한 기능을 선사해 주고 있어 앞으로 자주 사용해야 할 거 같습니다.

그럼.
