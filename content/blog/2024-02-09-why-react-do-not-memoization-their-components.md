---
slug: 2024-02-09-why-react-do-not-memoization-their-components
title: 왜 React는 기본적으로 Component를 메모(memo)화하지 않는 걸까?
date: 2024-02-09 02:51:09.292000+00:00
summary: 왜 React는 기본적으로 Component를 메모(memo)화하지 않는 걸까?
tags: ["react", "memo"]
contributors: []
draft: false
---

안녕하세요!

이번에는 React의 메모(memo)화에 대해 고민하다가 '왜 React는 기본적으로 Component를 메모화하지 않는 걸까?' 라는 의문을 해결하기 위해 여러 가지를 조사하고 생각한 내용을 정리해 보았습니다.

중간에 렌더링 타이밍이나, 메모(memo)화로 재렌더링을 억제하는 이유 등의 기본 지식 복습도 포함되어 있어서, 메모(memo)화에 대해 잘 모르시는 분들도 메모(memo)화에 대한 공부가 될 것 같은데요.

두서 없이 여기 저기 공부한 내용의 복습이라 아시는 분은 패스하시길 바랍니다.

** 목 차 **

* 1. [서론](#1)]
* 2. [React의 Component는 언제 재렌더링되는가?](#ReactComponent)
* 3. [React의 Component가 재렌더링되는 타이밍](#ReactComponent-1)
* 4. [React.memo()를 통해 왜 재렌더링을 억제할 수 있는가?](#React.memo)
* 5. [React.memo()에 의해 재렌더링이 억제되는 이유](#React.memo-1)
	* 5.1. [React의 Component가 재렌더링되는 타이밍](#ReactComponent-2)
	* 5.2. [React.memo()에 의해 재렌더링이 억제되는 이유](#React.memo-2)
* 6. [Component를 메모화할지의 판단 기준](#Component)
* 7. [props에 변경이 없어도 재렌더링하길 원하는 Component는 존재하는가?](#propsComponent)
* 8. [거의 모든 Component는 메모(memo)화하는 것이 좋은가?](#Componentmemo)
* 9. [왜 React는 기본적으로 Component를 메모화하지 않는가?](#ReactComponent-3)
* 10. [React의 소스 코드를 살펴보자](#React)
* 11. [결론](#2)
* 12. [실제 속도 차이는?](#3)
* 13. [Record＆Tuple이 도입되면, 표준으로 Component가 메모화될 수도 있을까?](#RecordTupleComponent)

---

## 1. <a name="1"></a>서론

왜 이런 의문을 가지게 되었는가?

먼저, 제가 제목에 있는 의문을 가지게 된 배경입니다.

의문을 가지게 된 생각의 과정은 이런 식입니다.

1. '재렌더링이 불필요하게 많이 일어나서 화면이 무거워져서 결론적으로 최적화하고 싶다'
2. 'React.memo()를 사용해서 Component를 메모(memo)화하자!'
3. 'Component마다 메모(memo)화할지 말지 고민하는 게 귀찮다.'
4. '계속 고민하는 것도 귀찮으니까, 그냥 모두 메모(memo)화하면 되지 않을까?'
5. '그리고 메모(memo)화하면 문제가 되는 Component 같은 건 없는 것 같은데?'
6. '그럼 왜 React는 기본적으로 모든 Component를 메모(memo)화하지 않는 걸까?'

간단히 말하자면, 'React.memo()를 사용하면 성능이 향상되고, 메모화하면 문제가 되는 Component 같은 건 없는 것 같으니, 왜 기본적으로 메모화하지 않는 걸까?'
입니다.

그래서, React.memo()에 대해 여러 가지를 공부한 것을 토대로 주제에 공부를 진행해 볼까 합니다.

먼저, 기본 지식의 복습을 위해,

1. React Component는 언제 재렌더링되는 건가?
2. React.memo()에 의해 왜 재렌더링을 억제할 수 있는 건가?

라는 물음에 대해 간단하게 알아보고 진행하려 합니다.

---

##  2. <a name='ReactComponent'></a>React의 Component는 언제 재렌더링되는가?

일반적으로, React의 Component가 재렌더링되는 타이밍은 아래와 같습니다.

- 부모 Component가 재렌더링될 때
- state가 업데이트될 때
- useState의 setter가 실행될 때
- useReducer의 dispatch()가 실행될 때
- Class Component의 this.setState()가 실행될 때

구글에서 "React　render는 언제 일어나는가?"라고 검색하면, 대부분의 자료에서는 props가 업데이트될 때도 React가 재렌더링된다고 합니다. 하지만 이 같은 경우는 앞으로 설명할 메모화된 Component에만 해당됩니다.

React는 부모 Component가 재렌더링될 때에, 조건 없이 모든 자식 Component를 재렌더링하기 때문에, props가 업데이트되었는지 여부를 확인하지 않습니다.

여기서 잠깐 재미난 테스트를 진행해 볼까 합니다.

만약 같은 값으로 setState()를 처리 했을 때 과연 React는 재렌더링되는가? 입니다.

잠깐 삼천포로 빠지는 감도 없지는 않지만, state를 변경하기 전의 값과 같은 값으로 setState()를 처리 했을 때 재렌더링이 일어나는지 한 번 궁금할 수 있는데요.

정답은 바로 아래와 같습니다.

- state가 프리미티브일 경우 → 재렌더링되지 않음
- state가 객체일 경우 → 동일한 객체라면 재렌더링되지 않음

실제 React 소스코드에서는 state가 변경될 때 React 내부에서는 변경 전후의 state를 얕은 비교(shallow comparison)를 하고, 만약 같다면 재렌더링하지 않습니다.

예를 들어 useState의 setter를 실행하면, useReducer의 dispatch()와 같은 dispatchSetState()라는 함수가 실행되고, 그 안에서는 아래 코드와 같은 로직이 수행됩니다.

```js
// react/packages/react-reconciler/src/ReactFiberHooks.new.js
if (objectIs(eagerState, currentState)) {
  // Fast path. We can bail out without scheduling React to re-render.
  // It's still possible that we'll need to rebase this update later,
  // if the Componentre-renders for a different reason and by that
  // time the reducer has changed.
  return;
}
```

```js
// react/packages/shared/objectIs.js
/**
 * inlined Object.is polyfill to avoid requiring consumers ship their own
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */
function is(x, y) {
  return (
    (x === y && (x !== 0 || 1 / x === 1 / y)) || (x !== x && y !== y) // eslint-disable-line no-self-compare
  );
}

var objectIs = typeof Object.is === "function" ? Object.is : is;
```

위와 같이 얕은 비교를 하고, 같다면 return되어 처리가 멈추고, 재렌더링이 일어나지 않습니다.

(코드 중간의 주석에도 without schedulingReactto re-render라고 적혀 있네요!)

그래서 state가 프리미티브라면 같은 값을, 객체라면 동일한 객체를 변경 후의 state로 setter에 전달하여 실행해도, 재렌더링이 일어나지 않는 것을 확인할 수 있습니다.

반대로 말하면, 객체는 내부의 값이 완전히 같아도 다른 객체라면 state가 변경되었다고 인식되고, 재렌더링이 일어나므로 주의해야 합니다.

***객체의 얕은 비교 예시***
```js
const kim = {bar: 'bar', foo: 'foo'}
const park = {bar: 'bar', foo: 'foo'}

kim === kim // -> true
kim === park // -> false
kim === {bar: 'bar', foo: 'foo'} // -> false
kim === {...kim} // -> false
```

---

##  3. <a name='ReactComponent-1'></a>React의 Component가 재렌더링되는 타이밍

다시 한번 상기하자면, React의 Component가 재렌더링되는 타이밍은 아래의 2가지입니다.

1. 부모 Component가 재렌더링될 때
    - props의 변경 여부를 확인하지 않고 무조건 재렌더링됨
2. state가 업데이트될 때
    - 변경 전과 변경 후의 state를 얕은 비교를 통하여 차이가 있을 때만

그럼 재렌더링되는 타이밍을 알았으니, React.memo()에 의해 재렌더링이 억제되는 이유를 알아 보겠습니다.

---

##  4. <a name='React.memo'></a>React.memo()를 통해 왜 재렌더링을 억제할 수 있는가?

일단, React.memo()는 Component를 인자로 받아서 Component를 반환하는(즉, Component를 래핑하는) 함수입니다.
(이를 고차 Component라고도 합니다.)

```js
// React.memo로 래핑만 해도, Component는 메모화됩니다.
const MemoComponent = React.memo((props) => {
  // props를 사용한 처리
  return <Users />
})
```

React.memo()로 래핑된 Component는, 그 부모 Component가 재렌더링될 때 props의 변경을 확인하고 변경이 없다면, 재렌더링되지 않습니다.

또한 props의 비교 방법은 기본적으로 얕은 비교(shallow comparison)를 하지만, 사용자 정의 비교 함수를 React.memo()의 두 번째 인자로 전달함으로써, 비교 방법을 커스터마이즈할 수 있습니다.

```js
const equalFunction = (prevProps, nextProps) => {
  // 사용자 정의 비교 처리
}

const MemoComponent = React.memo((props) => {
  // props를 사용한 처리
  return <Users />
}, equalFunction)
```

그러나 제가 지금까지 React를 공부했어도 React.memo() 함수에 비교 함수의 커스터마이즈까지 사용하는 경우는 거의 못 봤는데요.

그래서 이 글에서는 이후부터 Component를 메모화한다는 거는, 비교 함수의 커스터마이즈는 하지 않고 기본적인 얕은 비교에 의한 메모화를 칭하겠습니다.

참고로 props를 가지지 않는 Component도 React.memo()로 메모화할 수 있습니다.

원래 props가 없기 때문에, 메모화하면 부모 Component가 재렌더링되어도 전혀 재렌더링되지 않게 됩니다.

---

##  5. <a name='React.memo-1'></a>React.memo()에 의해 재렌더링이 억제되는 이유

그래서, React.memo()로 재렌더링이 억제되는 이유는 다음과 같습니다.

'React.memo()로 래핑된 Component는, 부모 Component가 재렌더링되어도 props에 변경이 없는 경우에만 재렌더링되기 때문입니다.'

---

지금까지 예전에 배웠던 걸 다시 한번 정리해 봤는데요.

이 타이밍에 다시 한번 깔끔하게 정리해 보겠습니다.

###  5.1. <a name='ReactComponent-2'></a>React의 Component가 재렌더링되는 타이밍

1. 부모 Component가 재렌더링될 때
    - props의 변경 여부를 확인하지 않고 무조건 재렌더링됨
2. state가 업데이트될 때
    - 변경 전과 변경 후의 state를 얕은 비교하여 차이가 있을 때만
    - 
###  5.2. <a name='React.memo-2'></a>React.memo()에 의해 재렌더링이 억제되는 이유

1. React.memo()로 래핑된 Component는, 부모 Component가 재렌더링되어도 변경 전후의 props를 얕은 비교하여 변경이 없는 경우에만 재렌더링됨

그럼 여기서 다시 이글의 제목으로 다시 돌아가 보겠습니다.

'왜 React는 기본적으로 Component를 메모(memo)화하지 않는 걸까?'

당연히, 기본적으로 메모화되면 문제가 되는 Component가 있을 수도 있습니다.

그러므로 먼저 Component를 메모화할지의 판단을 먼저 고심하고, 그 후에 메모화해서는 안 되는 Component가 있는지를 생각하겠습니다.

---

##  6. <a name='Component'></a>Component를 메모화할지의 판단 기준

메모화된 Component는, 부모 Component가 재렌더링되어도 props에 변경이 있을 때만 재렌더링됩니다.

따라서 Component를 메모화할지의 판단 기준은 아래 2가지로 생각할 수 있습니다.

1. 부모 Component의 재렌더링에 따라 props의 변경이 있을 때만 재렌더링하길 원하는 Component
    - ⭕　메모화하는 것이 좋음
2. 부모 Component의 재렌더링에 따라 props의 변경이 없어도 재렌더링하길 원하는 Component
    - ❌　메모화하면 안 됨

그렇다면 '부모 Component의 재렌더링에 따라 props의 변경이 없어도 재렌더링하길 원하는 Component'는 어떤 Component일까요?

---

##  7. <a name='propsComponent'></a>props에 변경이 없어도 재렌더링하길 원하는 Component는 존재하는가?

간단하게 생각해보면, 부모 Component만 재렌더링되고 자식 Component가 재렌더링되지 않으면, 결과론적으로 자식 Component만 오래되어 가므로, 만약 표시하는 데이터의 최신성을 유지해야 하는 Component 등이라면 재렌더링하길 원하는 컴포넌트가 될 수 있습니다.

그러나 그 경우에는 최신성을 유지하는 책임은 자식 Component에 있습니다.

따라서 최신성을 부모 Component의 재렌더링 타이밍에 전적으로 맡기는 것은 조금 어려운 말이지만 책임의 분배에 있어서 올바르지 않다고 생각합니다.

이렇듯 여러 상황을 고려해봤지만, 올바른 책임 분배를 전제로 생각하면 해당되는 Component를 더 이상 추려낼 수 없을 거 같네요.

그러므로 개인적인 생각이지만 '부모 Component의 재렌더링에 따라 props의 변경이 없어도 재렌더링하길 원하는 Component'는 존재하지 않거나, 아니면 매우 특수한 용도의 Component일 것이라고 생각합니다.

---

##  8. <a name='Componentmemo'></a>거의 모든 Component는 메모(memo)화하는 것이 좋은가?

정리해 보자면 아래와 같습니다.

1. 부모 Component의 재렌더링에 따라 props의 변경이 있을 때만 재렌더링하길 원하는 Component
    - ⭕　메모화하는 것이 좋음
2. 부모 Component의 재렌더링에 따라 props의 변경이 없어도 재렌더링하길 원하는 Component
    - ❌　메모화하면 안 됨
    - 용도가 존재하지 않거나, 아니면 매우 특수한 용도의 Component

여기서 너무 쉬운 판단일지 모르지만 제 생각으로는 거의 모든 Component는 메모(memo)화하는 것이 좋을 것 같다는 생각이 듭니다.

---

##  9. <a name='ReactComponent-3'></a>왜 React는 기본적으로 Component를 메모화하지 않는가?

예전에 Dan Abramov씨가 Component의 메모화에 대해 언급한 트윗이 있었는데요.

지금은 찾을 수 없지만요.

Component의 메모화에 대한 Dan씨의 견해는.

>메모화에 의한 얕은 비교(shallow comparison)의 부하는 props의 수에 비례하며, 결과적으로 재렌더링이 일어나는 경우에는 이 얕은 비교의 처리는 무의미하게 되며, 또한 많은 Component는 다른 props를 받기 때문에, 비교하는 것이 빠르다고 단정할 수 없는 것 같습니다.

---

##  10. <a name='React'></a>React의 소스 코드를 살펴보자

그럼 React의 소스 코드에서 메모화된 Component의 업데이트 처리가 어떻게 되어 있는지 살펴보겠습니다.

먼저 메모화된 Component를 업데이트하는 함수입니다.

```js
// react/packages/react-reconciler/src/ReactFiberBeginWork.new.js
function updateMemoComponent(
　　　　current: Fiber | null,
  workInProgress: Fiber,
  Component: any,
  nextProps: any,
  renderLanes: Lanes,
): null | Fiber {
　　　　// 생략
  if (!hasScheduledUpdateOrContext) {
 　　　　　　// 이것은 defaultProps가 해결된 props일 것이며,
    // current.memoizedProps와 달리 해결되지 않은 것입니다.
    const prevProps = currentChild.memoizedProps;
  　　　　// 얕은 비교를 기본으로 한다
  　　　　let compare = Component.compare;
  　　　　compare = compare !== null ? compare : shallowEqual;
  　　　　if (compare(prevProps, nextProps) && current.ref === workInProgress.ref) {
  　　　　　　　　return bailoutOnAlreadyFinishedWork(current, workInProgress,　renderLanes);
  　　　　}
  }
　　　　// React DevTools가 이 플래그를 읽습니다.
  workInProgress.flags |= PerformedWork;
  const newChild = createWorkInProgress(currentChild, nextProps);
  newChild.ref = workInProgress.ref;
  newChild.return = workInProgress;
  workInProgress.child = newChild;
  return newChild;
}
```

`compare = compare !== null ? compare : shallowEqual;`에서, React.memo()의 두 번째 인자로 전달된 사용자 정의 비교 함수가 있으면 그것을, 없으면 얕은 비교를 props를 비교하는 함수로 사용하고 있으며, compare(prevProps, nextProps) 함수에서 props를 비교하고 있습니다.

다음은 얕은 비교 함수입니다.

```js
// react/packages/shared/shallowEqual.js
/**
 * Performs equality by iterating through keys on an object and returning false
 * when any key has values which are not strictly equal between the arguments.
 * Returns true when the values of all keys are strictly equal.
 */
function shallowEqual(objA: mixed, objB: mixed): boolean {
  if (is(objA, objB)) {
    return true;
  }

  if (
    typeof objA !== 'object' ||
    objA === null ||
    typeof objB !== 'object' ||
    objB === null
  ) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  for (let i = 0; i < keysA.length; i++) {
    const currentKey = keysA[i];
    if (
      !hasOwnProperty.call(objB, currentKey) ||
      !is(objA[currentKey], objB[currentKey])
    ) {
      return false;
    }
  }

  return true;
}
```

`for (let i = 0; i < keysA.length; i++)`에서 props의 수만큼 for문을 돌리고, is(objA[currentKey], objB[currentKey])에서 얕은 비교를 하고 있습니다.

정말로 props의 수에 비례하여 얕은 비교가 이루어지고 있습니다.

참고로 is()는 앞서 언급한 useState의 setter에서 state의 얕은 비교에도 사용되었던 함수입니다.

```js
// react/packages/shared/objectIs.js
function is(x: any, y: any) {
  return (
    (x === y && (x !== 0 || 1 / x === 1 / y)) || (x !== x && y !== y) // eslint-disable-line no-self-compare
  );
}
```

---

##  11. <a name='2'></a>결론

'왜 React는 기본적으로 Component를 메모화하지 않는가?'의 결론은, 바로 Dan씨가 트윗에서 말한 것처럼 아래와 같을겁니다.

- 메모화에 의한 얕은 비교에 따른 부하가 props의 수에 비례한다.
- 결과적으로 재렌더링이 일어나는 경우에는 이 얕은 비교의 처리는 무의미하게 된다.
- 많은 Component는 다른 props를 받기 때문에, 비교하는 것이 빠르다고 단정할 수 없다.(얕은 비교가 무의미하게 되는 경우가 많다)

아마도 위와 같기 때문에, 기본적으로 Component를 메모화하지 않는 것 같습니다.

메모화에 의해 성능이 악화될 가능성이 있기 때문에, 메모화할지 여부는 선택적으로 개발자에게 위임되어 있는 것입니다.

---

##  12. <a name='3'></a>실제 속도 차이는?

얕은 비교(shallow comparison)의 부하는 재렌더링의 속도에 얼마나 영향을 미치는가?

보통 구글링을 통해 알아본 봐로는 props 갯수가 10,000개일 경우 메모(memo)화된 쪽이 압도적으로 10~30배 정도 재렌더링에 시간이 걸린다고 합니다.

props의 수를 1,000개로 줄이면, 차이가 3~5배 정도로 줄어든다고 합니다.

확실히 메모화된 Component가 재렌더링에 시간을 더 많이 소요하며, 또한 props의 수에 비례하여 소요 시간이 증가하는 거네요.

---

##  13. <a name='RecordTupleComponent'></a>Record＆Tuple이 도입되면, 표준으로 Component가 메모화될 수도 있을까?

조금은 먼 얘기지만 Record＆Tuple이 도입되면, props의 수에 비례하지 않고 props를 비교할 수 있게 되므로, 표준으로 Component가 메모화되는 날이 올 수도 있습니다.(아직은 먼 얘기지만...)

Record와 Tuple은 각각

- Record: 객체와 같은 데이터 구조 `#{ x: 1, y: 2 }`
- Tuple: 배열과 같은 데이터 구조 `#[1, 2, 3, 4]`

이며, === 비교는 얕은 비교가 아닌 깊은 비교가 되므로, props의 각 속성마다 for문을 돌릴 필요가 없어지고, props의 수에 비례하지 않게 props의 비교가 가능해집니다.

Object와 Record의 === 비교 차이

```js
// Object
const kim = {a: 1, b: 2}
kim === {a: 1, b: 2} // -> false

// Record
const park = #{a: 1, b: 2}
park === #{a: 1, b: 2} // -> true
```

Record&Tuple 얘기는 아직은 아니지만 먼 얘기네요.

그럼.
