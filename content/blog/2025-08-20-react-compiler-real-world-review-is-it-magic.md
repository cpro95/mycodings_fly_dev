---
slug: 2025-08-20-react-compiler-real-world-review-is-it-magic
title: "리액트 컴파일러, '그냥' 켜기만 하면 정말 빨라질까?"
date: 2025-08-22 14:06:06.181000+00:00
summary: 리액트 컴파일러를 실제 프로젝트에 적용해 본 후기입니다. 간단한 예제에서는 완벽했지만, 실제 코드에서는 예상치 못한 문제들이 있었습니다. 컴파일러를 100% 활용하기 위해 우리가 알아야 할 것들을 살펴봅니다.
tags: ["React", "리액트", "React Compiler", "리액트 컴파일러", "memoization", "성능 최적화"]
contributors: []
draft: false
---

[원본 링크](https://www.developerway.com/posts/i-tried-react-compiler)

여기 아주 흥미로운 해외 개발자의 실험 후기가 있는데요, 이 글의 핵심만 전체적으로 살펴볼까 합니다.<br /><br />
리액트 커뮤니티가 몇 년 동안 기다려온 '리액트 컴파일러'가 드디어 나왔는데요.<br /><br />
수많은 개발자들이 '이제 `memo`, `useMemo`, `useCallback` 같은 메모이제이션의 고통에서 해방될 수 있다'며 기대에 부풀어 있죠.<br /><br />
저 역시 마찬가지였거든요.<br /><br />
발표자는 과연 그 기대가 현실과 얼마나 일치하는지, 이제 정말 메모이제이션을 잊어도 되는지 직접 확인해 보기로 했습니다.<br /><br />

## 리액트 컴파일러가 대체 뭐길래?

먼저 이 컴파일러가 어떤 문제를 해결하는지 아주 간단하게 짚고 넘어가야 하는데요.<br /><br />
리액트의 리렌더링은 기본적으로 '폭포수' 같거든요.<br /><br />
부모 컴포넌트에서 상태가 바뀌면 그 아래 자식 컴포넌트, 또 그 아래 자식의 자식 컴포넌트까지 줄줄이 전부 다시 그려지는 구조입니다.<br /><br />
이 과정에 무거운 컴포넌트가 끼어있거나 리렌더링이 너무 잦으면 앱 성능에 문제가 생길 수 있죠.<br /><br />
이걸 막기 위해 우리가 수동으로 사용했던 게 바로 `React.memo`, `useMemo`, `useCallback` 같은 메모이제이션 도구들입니다.<br /><br />
하지만 이 도구들을 '제대로' 쓰는 건 정말 어려운 일이거든요.<br /><br />
바로 이 지점에서 리액트 컴파일러가 등장합니다.<br /><br />
이 컴파일러는 빌드 과정에 끼어들어서 우리 코드를 분석한 다음, 알아서 `memo`, `useMemo`, `useCallback`을 적용한 것과 유사한 코드로 바꿔주는 마법 같은 도구예요.<br /><br />
개발자가 골치 아프게 고민할 필요 없이, 컴파일러가 자동으로 최적화를 해준다는 거죠.<br /><br />

## 간단한 예제에서는 정말 마법 같았다

발표자는 먼저 아주 간단한 예제들로 컴파일러를 테스트해 봤더라고요.<br /><br />
Next.js 최신 버전을 설치하고 `next.config.js` 파일에 단 몇 줄만 추가하면 컴파일러가 바로 활성화됩니다.<br /><br />

```javascript
const nextConfig = {
  experimental: {
    reactCompiler: true,
  },
};

module.exports = nextConfig;
```

정말 간단하죠?<br /><br />
설치 자체는 아주 쉬웠고, 정말 '그냥 켜기만 하면' 작동했습니다.<br /><br />

### 첫 번째 테스트 간단한 상태 변경

첫 번째 예제는 정말 간단한 케이스인데요.<br /><br />

```javascript
const SimpleCase1 = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>
        toggle dialog
      </button>
      {isOpen && <Dialog />}
      <VerySlowComponent />
    </div>
  );
};
```

버튼을 누를 때마다 `isOpen` 상태가 바뀌고, 이 때문에 상관도 없는 `VerySlowComponent`가 계속 리렌더링되는 상황입니다.<br /><br />
원래라면 `React.memo(VerySlowComponent)`로 감싸줘야 해결되죠.<br /><br />
하지만 컴파일러를 켜니, 아무것도 안 해도 `VerySlowComponent`가 더 이상 리렌더링되지 않았습니다.<br /><br />
마법이 일어난 거죠.<br /><br />

### 두 번째 테스트 props가 있는 컴포넌트

이번엔 조금 더 복잡하게 `VerySlowComponent`에 함수와 배열을 props로 넘겨줬습니다.<br /><br />

```javascript
const SimpleCase2 = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onSubmit = () => {};
  const data = [{ id: 'bla' }];

  return (
    <>
      ...
      <VerySlowComponent onSubmit={onSubmit} data={data} />
    </>
  );
};
```

이걸 수동으로 최적화하려면 `onSubmit`은 `useCallback`으로, `data` 배열은 `useMemo`로 감싸야만 하는데요.<br /><br />
컴파일러는 이것마저도 알아서 처리해 줬습니다.<br /><br />
정말 아무것도 할 필요가 없었죠.<br /><br />

### 세 번째 테스트 children을 넘기는 경우

마지막 테스트는 웬만한 개발자들도 헷갈려 하는, 컴포넌트를 `children`으로 넘기는 경우인데요.<br /><br />

```javascript
export const SimpleCase3 = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      ...
      <VerySlowComponent>
        <SomeOtherComponent />
      </VerySlowComponent>
    </>
  );
};
```

이 경우 `VerySlowComponent`를 최적화하려면 `SomeOtherComponent`를 `React.memo`로 감싸는 게 아니라, `<SomeOtherComponent />` JSX 요소 자체를 `useMemo`로 감싸야 합니다.<br /><br />
정말 까다로운 패턴이죠.<br /><br />
놀랍게도 리액트 컴파일러는 이것마저 완벽하게 처리하더라고요.<br /><br />
여기까지만 보면 정말 '혁명'이라고 부를 만했습니다.<br /><br />

## 하지만 현실은 냉혹했다 실제 코드 테스트

문제는 실제 프로젝트는 이렇게 간단하지 않다는 점이죠.<br /><br />
발표자는 각기 다른 세 개의 실제 앱에 컴파일러를 적용해 봤습니다.<br /><br />
결과는 충격적이었는데요.<br /><br />
첫 번째 앱(오래되고 큰 앱)에서는 눈에 띄는 불필요한 리렌더링 10개 중 고작 2개만 해결됐습니다.<br /><br />
두 번째 앱(비교적 최신 앱)에서도 10개 중 2개만 해결됐죠.<br /><br />
가장 충격적인 건 세 번째 앱(발표자가 직접 만든 작고 단순한 앱)이었는데요.<br /><br />
8개의 리렌더링 문제 중, 컴파일러가 해결한 건 단 하나뿐이었습니다.<br /><br />
딱 하나요!<br /><br />
간단한 예제에서의 완벽한 모습과는 너무나 다른 결과였죠.<br /><br />

## 무엇이 문제였을까 직접 파헤쳐 보기

발표자는 포기하지 않고 세 번째 앱의 한 페이지를 따로 떼어내서 무엇이 문제인지 파고들기 시작했습니다.<br /><br />
UI는 간단한데요.<br /><br />
국가 목록이 담긴 테이블, 각 행을 삭제하는 버튼, 그리고 새 국가를 추가하는 입력창으로 구성되어 있죠.<br /><br />
문제는 입력창에 타이핑을 하든, 삭제 버튼을 누르든, 추가 버튼을 누르든 모든 인터랙션에서 테이블 전체가 리렌더링된다는 것이었습니다.<br /><br />

```javascript
export const Countries = () => {
  // 입력창 상태
  const [value, setValue] = useState("");
  // react-query로 국가 목록 가져오기
  const { data: countries } = useQuery(...);
  // react-query로 국가 삭제/추가 뮤테이션
  const deleteCountryMutation = useMutation(...);
  const addCountryMutation = useMutation(...);

  // 삭제 버튼 콜백
  const onDelete = (name: string) => deleteCountryMutation.mutate(name);
  
  // ... (JSX 렌더링 부분)
};
```

발표자는 컴파일러가 왜 실패했는지 알아내기 위해, 나라면 어떻게 '수동으로' 최적화했을지 역추적하는 방식을 사용했습니다.<br /><br />

### 원인 1 react-query의 함정

가장 먼저 '입력창 타이핑' 시 발생하는 리렌더링을 잡으려고 시도했는데요.<br /><br />
테이블 내용을 `useMemo`로 감싸보니, 이 부분이 `countries` 데이터와 `onDelete` 함수에 의존하고 있다는 걸 알 수 있었습니다.<br /><br />
`countries`는 react-query가 캐싱해주니 안정적일 텐데, 그럼 문제는 `onDelete` 함수라는 거죠.<br /><br />
`onDelete` 함수는 `deleteCountryMutation` 객체를 사용하는데요.<br /><br />
발표자는 처음에 이 `deleteCountryMutation` 객체가 안정적일 거라고 가정했습니다.<br /><br />
하지만 react-query의 소스 코드를 까보니, `useMutation` 훅은 렌더링될 때마다 '새로운' 객체를 반환하고 있었던 겁니다!<br /><br />
객체 안에 있는 `mutate` 함수 자체는 메모이제이션 되어 있었지만, 객체 자체가 매번 새로 생성되니 의존성 배열이 항상 바뀐다고 판단해 버린 거죠.<br /><br />
이게 바로 컴파일러가 최적화에 실패한 첫 번째 원인이었습니다.<br /><br />
해결책은 간단했는데요.<br /><br />
`useMutation`에서 반환된 객체 전체가 아닌, 메모이제이션 된 `mutate` 함수만 직접 꺼내서 의존성으로 사용하도록 코드를 수정하는 것이었습니다.<br /><br />

```javascript
// 수정 전
const deleteCountryMutation = useMutation(...);
const onDelete = useCallback(
  (name: string) => { deleteCountryMutation.mutate(name); },
  [deleteCountryMutation], // 매번 새로운 객체라 실패!
);

// 수정 후
const { mutate: deleteCountry } = useMutation(...); // mutate 함수만 추출
const onDelete = useCallback(
  (name: string) => { deleteCountry(name); },
  [deleteCountry], // 메모이제이션 된 함수라 성공!
);
```

이 코드를 적용하고 수동 메모이제이션을 전부 지우자, 마법처럼 컴파일러가 '타이핑' 시의 리렌더링을 제대로 잡아주기 시작했습니다!<br /><br />

### 원인 2 컴포넌트 구조의 문제

하지만 여전히 국가를 '추가'하거나 '삭제'할 때의 리렌더링은 남아있었는데요.<br /><br />
이 문제의 원인은 두 가지였습니다.<br /><br />
첫째, `.map()`으로 리스트를 렌더링할 때 `key` prop으로 배열의 `index`를 사용하고 있었습니다.<br /><br />
`index`를 key로 쓰면 리스트의 순서가 바뀔 때마다 모든 항목이 리렌더링되므로, `name` 같은 고유값으로 바꿔줘야 했죠.<br /><br />
둘째, 테이블의 각 행(`TableRow`)과 그 내용이 모두 `Countries` 컴포넌트 안에서 직접 렌더링되고 있었습니다.<br /><br />
이렇게 하면 각 행을 개별적으로 메모이제이션하기가 불가능하거든요.<br /><br />
해결책은 테이블 행 부분을 별도의 `CountryRow` 컴포넌트로 추출하는 것이었습니다.<br /><br />
이렇게 컴포넌트를 분리하고 고유한 `key`를 사용하도록 구조를 바꾸자, 컴파일러가 즉시 알아채고 추가/삭제 시의 불필요한 리렌더링을 막아주더라고요.<br /><br />

## 그래서 결론은?

리액트 컴파일러는 간단한 케이스에서는 정말 놀라운 성능을 보여주는 게 맞습니다.<br /><br />
하지만 실제 복잡한 코드에서는 '그냥 켜기만' 해서는 기대만큼의 효과를 보기 어려웠다는 게 이번 실험의 핵심 결론인데요.<br /><br />
컴파일러가 모든 것을 알아서 해줄 거라는 기대는 아직은 시기상조라는 거죠.<br /><br />
그럼 컴파일러는 쓸모가 없는 걸까요?<br /><br />
절대 아닙니다!<br /><br />
우리가 컴파일러가 '좋아하는' 방식으로 코드를 조금만 다듬어주면, 그제야 컴파일러는 자신의 잠재력을 100% 발휘하기 시작합니다.<br /><br />
결국 우리는 `memo`, `useMemo`, `useCallback`을 잊기는커녕, 오히려 그 원리를 더 깊이 이해해야만 컴파일러를 제대로 활용할 수 있다는 아이러니한 결론에 도달하게 되는 거죠.<br /><br />
앞으로 많은 개발자들이 컴파일러를 켜고, 리액트 개발자 도구에 뜨는 'memo ✨' 표시를 보며 안도감을 느낄 겁니다.<br /><br />
대부분의 사소한 리렌더링은 무시되겠죠.<br /><br />
하지만 정말 성능에 영향을 미치는 심각한 리렌더링 문제가 발생했을 때, 우리는 오늘 살펴본 것처럼 컴파일러를 '돕기 위해' 기꺼이 코드의 구조를 바꾸고 의존성을 파헤칠 준비가 되어 있어야 할 겁니다.<br /><br />
리액트 컴파일러는 마법의 지팡이가 아니라, 우리가 더 잘 휘둘러야 하는 강력한 '도구'인 셈이죠.<br /><br />
