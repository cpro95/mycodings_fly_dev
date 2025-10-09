---
slug: 2022-11-19-javascript-interview-question-array-reduce-explain
title: 프런트엔드 개발자 면접 단골 문제인 자바스크립트 reduce 함수 쉽게 이해하기
date: 2022-11-19 08:50:36.815000+00:00
summary: 프런트엔드 개발자 면접 단골 문제인 자바스크립트 reduce 함수 쉽게 이해하기
tags: ["javascript", "reduce"]
contributors: []
draft: false
---

안녕하세요?

오늘은 프런트엔드 쪽 특히 자바스크립트 면접에 단골처럼 나오는 Array.reduce() 함수에 대해 알아보겠습니다.

Array.map() 함수는 한번 이해하면 쉬워서 누구나 쓸 수 있는데요.

Array.reduce() 함수는 조금은 어려워서 사실 쉽게 쓰지 못하고 있는데요.

한번 익혀두면 map과 함께 가장 많이 쓰이는 함수라고 합니다.

reduce 함수의 역할을 설명할 때 쓰이는 게 바로 배열의 합계인데요.

```js
const numbers = [12, 6, 8, 41]
```

위와 같은 숫자로만 이루어진 배열이 있다고 할 때 이 배열의 전체 합을 구한다고 치면, 바로 reduce 함수가 적합합니다.

이걸 for 문으로 할 수도 있지만 프런트엔드 개발자라면 Array.reduce() 함수로 구현해야지 좀 더 있어 보이지 않을까요?

```js
const sum = numbers.reduce((s, item) => {
  return s + item
}, 0)
// sum = 67
```

reduce 함수를 위와 같이 사용하면 배열의 전체 합을 구할 수 있습니다.

그럼 reduce 함수의 시그니쳐를 살펴볼까요?

```js
array.reduce((previousValue, currentValue) => {
  // code here
}, initialValue)
```

인자로 3가지가 있는데요. previousValue, currentValue, initialValue 가 있습니다.

reduce 함수는 위의 시그니쳐에서 // code here 부분을 실행하는데요.

이 // code here 부분을 reducer 함수라고 부릅니다.

reduce 함수는 reducer 함수를 배열의 모든 원소에 대해 순서대로 실행하고, 실행 후 리턴 값을 다음 reducer 함수 실행에 넘겨줍니다.

그래서 우리가 위에서 예제로 들었던 배열 전체 합계 코드를 디버깅해보면 아래와 같습니다.

```js
const numbers = [12, 6, 8, 41]

const sum = numbers.reduce((s, item) => {
  return s + item
}, 0)

// step 1
reduce((0 /* initial value */ , numbers[0]) => {
    return 0 + 12
}

// step 2
reduce((12 /* previous value */ , numbers[1]) => {
    return 12 + 6
}

// step 3
reduce((18 /* previous value */ , numbers[2]) => {
    return 18 + 8
}

// step 4
reduce((26 /* previous value */ , numbers[3]) => {
    return 26 + 41
}
```

|  Step  |  s  | item |
| :----: | :-: | :--: |
| Step 1 |  0  |  12  |
| Step 2 | 12  |  6   |
| Step 3 | 18  |  8   |
| Step 4 | 26  |  41  |

step 1을 보시면 initial value로 0을 넣고 currentValue 에 number[0] 즉, 배열의 첫 번째 항목을 넣고, 그다음 reducer 함수를 실행합니다.

이렇게 되면 reducer 함수에는 return 0 + 12 가 들어가게 되고 0 + 12의 결과 값이 바로 step 2의 previousValue 의 값으로 들어갑니다.

step 2를 보시면 step 1의 reducer 함수 실행 값이 12가 step 2에서는 initialValue 로 자리 잡게 되고 currentValue 는 step 2이기 때문에 배열의 두 번째 항목인 number[1] 이 배당됩니다.

그래서 step 2의 reducer 함수에는 12 + 6 이 오게 됩니다.

이렇게 step 2가 끝나면 step 3, step 4가 실행됩니다.

배열의 원소 개수가 4개이기 때문에 step 4까지만 실행되고요.

<hr />
## 생략할 수 있는 initialValue

initialValue 는 optional입니다. 즉 생략할 수 있죠.

생략하면 그 자리에 배열의 첫 번째 항목이 들어가고 currentValue 에는 두 번째 항목이 들어가게 됩니다.

아래 코드처럼 s는 array[0] 이, item은 array[1] 이 들어가게 되죠.

```js
const numbers = [12, 6, 8, 41]
const sum = numbers.reduce((s, item) => {
  // s = array[0]
  // item = array[1]
})
```

그러면 어떻게 되는지 디버깅해 볼까요?

```js
const numbers = [12, 6, 8, 41]

const sum = numbers.reduce((s, item) => {
  return s + item
});

// step 1
reduce((12 /* initial value */ , numbers[1]) => {
    return 12 + 6
}

// step 2
reduce((18 /* previous value */ , numbers[2]) => {
    return 18 + 8
}

// step 3
reduce((26 /* previous value */ , numbers[3]) => {
    return 26 + 41
}
```

|  Step  |  s  | item |
| :----: | :-: | :--: |
| Step 1 | 12  |  6   |
| Step 2 | 18  |  8   |
| Step 3 | 26  |  41  |

initialValue 를 생략하니까 step이 3가지로 줄었는데요.

initialValue 를 생략할지 말지는 코드를 잘 생각하시고 쓰시면 됩니다.

<hr />
## reduce로 배열 리턴하기

reduce 함수는 배열의 항목을 가공한 후 값을 도출해서 리턴하는 함수인데요.

사실 리턴할 때 값(value)뿐만 아니라 배열(array)도 리턴할 수 있습니다.

배열에서 짝수만 골라서 다시 배열로 리턴하려고 한다면 아래와 같이 하면 됩니다.

```js
const numbers = [12, 6, 8, 41]
const evenNums = numbers.reduce((evenArr, item) => {
  if (item % 2 == 0) {
    evenArr.push(item)
  }
  return evenArr
}, [])

// note the passing of [] as the initial value
// evenNums = [12, 6, 8]
```

이것도 한번 step 별로 디버깅해볼까요?

```js
const numbers = [12, 6, 8, 41]

const evenNums = numbers.reduce((evenArr, item) => {
    if (item % 2 == 0) {
        evenArr.push(item)
    }
    return evenArr
}, [])

// step 1
reduce(([] /* initial value */ , numbers[0]) => {
    if (12 % 2 == 0) {
        evenArr.push(item) // [].push(12)
    }
    return evenArr // return [12]
}

// step 2
reduce(([12] /* previous value */ , numbers[1]) => {
    if (6 % 2 == 0) {
        evenArr.push(item) // [12].push(6)
    }
    return evenArr // return [12,6]
}

// step 3
reduce(([12,6] /* previous value */ , numbers[2]) => {
    if (8 % 2 == 0) {
        evenArr.push(item) // [12,6].push(8)
    }
    return evenArr // return [12,6,8]
}

// step 4
reduce(([12,6,8] /* previous value */ , numbers[3]) => {
    if (41 % 2 == 0) {
        evenArr.push(item) // no execution
    }
    return evenArr // return [12,6,8]
}
```

|  Step  |    s     | item |
| :----: | :------: | :--: |
| Step 1 |    []    |  12  |
| Step 2 |   [12]   |  6   |
| Step 3 |  [12,6]  |  8   |
| Step 4 | [12,6,8] |  41  |

spep 별로 살펴보면 위와 같이 되는데요.

충분히 이해하실 수 있을 겁니다.

<hr />
## reduce 함수의 Full 시그니쳐

사실 Array.reduce 함수의 Full 시그니쳐는 다음처럼 4개 인자를 갖습니다.

```js
Array.reduce((previousValue, currentValue, currentIndex, array) => {
  // code here
}, initialValue)
```

currentIndex 는 0부터 시작하는 현재의 step을 나타냅니다. 몇 단계인지 알려주죠.

array는 전체 배열을 리턴해 줍니다. 어떨 때 쓰이냐면 reduce로 배열 자체를 조작했을 때 원본 배열을 알고 싶을 때 쓰는 거죠.

예를 들어볼까요?

```js
const numbers = [12, 6, 8, 41]
const sum = numbers.reduce((s, item, currentIndex, array) => {
  return s + item
}, 0)
```

위 코드를 Step 별로 분석하면 아래와 같습니다.

|  Step  |  s  | item | currentIndex |    array    |
| :----: | :-: | :--: | :----------: | :---------: |
| Step 1 |  0  |  12  |      0       | [12,6,8,41] |
| Step 2 | 12  |  6   |      1       | [12,6,8,41] |
| Step 3 | 18  |  8   |      2       | [12,6,8,41] |
| Step 4 | 26  |  41  |      3       | [12,6,8,41] |

지금까지 reduce 함수를 알아봤는데요.

꼭 숙달하여 면접 잘 보시기 바랍니다.
