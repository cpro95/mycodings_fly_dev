---
slug: 2025-08-26-react-19-useimperativehandle-without-forwardref
title: "React 19 useImperativeHandle, '기피 대상'에서 '필수 스킬'로? (feat. forwardRef 없이 쓰는 법)"
date: 2025-08-27 13:55:10.093000+00:00
summary: React 19에서 forwardRef 없이 ref를 prop처럼 사용할 수 있게 되면서 useImperativeHandle이 놀랍게 쉬워졌습니다. 복잡한 props drilling을 피하고 성능을 최적화하는 실용적인 방법을 알아보세요.
tags: ["React 19", "useImperativeHandle", "forwardRef", "리액트 훅", "프론트엔드", "컴포넌트 디자인"]
contributors: []
draft: false
---

안녕하세요?

리액트 개발을 하다 보면 한번쯤 딜레마에 빠지는 순간이 있거든요.<br />

바로 리액트의 우아한 '선언적인 흐름'과, 어쩔 수 없이 필요한 '명령적인 제어' 사이의 충돌입니다.<br />

부모 컴포넌트가 자식의 상태나 DOM에 직접 접근해서 뭔가를 시켜야 할 때, 예를 들면 특정 input에 포커스를 주거나, 동영상을 재생시키는 그런 상황들 말이죠.<br />

이럴 때 사용하는 '비밀 무기'가 바로 `useImperativeHandle`인데요.<br />

솔직히 React 18까지는 `forwardRef`라는 복잡한 개념 때문에 다들 사용을 꺼려했던 게 사실입니다.<br />

그런데 React 19에서 이 `useImperativeHandle`이 엄청나게 쉬워졌거든요.<br />

오늘은 '기피 대상'이었던 이 훅이 어떻게 '필수 스킬'로 거듭났는지, 제 경험담과 함께 쉽고 깊이 있게 파헤쳐 보겠습니다.<br />

## 사건의 발단 드래그 앤 드롭 폼 빌더와 props 지옥

최근에 드래그 앤 드롭으로 컴포넌트를 배치해서 폼을 만드는 '폼 빌더'를 개발하고 있었는데요.<br />

처음에는 당연히 모든 상태를 최상위 부모 컴포넌트에서 관리하고, 필요한 자식들에게 props로 내려주는 방식을 생각했습니다.<br />

소위 'props drilling', 우리말로는 'props 내려꽂기'라고 하죠.<br />

그런데 이게 보통 일이 아니더라고요.<br />

```jsx
// 부모 컴포넌트에서 모든 상태를 관리하려는 시도
const [formLayout, setFormLayout] = useState({});
const [saveStatus, setSaveStatus] = useState("idle");
const [tempSaveData, setTempSaveData] = useState({});

// 몇 단계 아래의 자식에게까지 props를 계속 전달...
<FormBuilder
  formLayout={formLayout}
  onLayoutChange={setFormLayout}
  saveStatus={saveStatus}
  onSave={handleSave}
  // ... 수많은 props들
>
  <LayoutRenderer
    layout={formLayout}
    onLayoutChange={setFormLayout}
    // 똑같은 props를 또 전달...
  >
    <ComponentPalette
      onSave={handleSave}
      // 또...
    />
  </LayoutRenderer
</FormBuilder>
```

폼의 전체 구조, 저장 상태, 임시 저장 데이터, 각 기능 실행 함수 등등 모든 걸 부모가 쥐고 있으려니 코드가 정말 엉망진창이 됐습니다.<br />

가독성은 떨어지고, 기능 하나 추가하려면 수많은 파일을 수정해야 하는 유지보수 지옥이 펼쳐진 거죠.<br />

그래서 'Zustand 같은 스토어처럼, 어디서든 특정 컴포넌트의 함수를 실행할 순 없을까?'라는 생각에 도달하게 됐습니다.<br />

## React 19, useImperativeHandle의 혁명적인 변화

그렇게 찾게 된 해결책이 바로 `useImperativeHandle`이었는데요.<br />

`useImperativeHandle`은 부모 컴포넌트가 `ref`를 통해 자식 컴포넌트의 특정 함수들을 '명령적으로' 호출할 수 있게 해주는 훅입니다.<br />

데이터가 위에서 아래로 흐르는 리액트의 기본 원칙을 거스르는, 일종의 '비상 탈출구' 같은 역할이죠.<br />

그런데 React 18까지는 이걸 쓰려면 `forwardRef`라는 걸로 컴포넌트를 감싸줘야 해서 정말 복잡하고 번거로웠거든요.<br />

하지만 React 19에서 이 모든 게 바뀌었습니다.<br />

### React 18의 복잡함 forwardRef의 시대

React 18에서는 함수형 컴포넌트가 `ref`를 props로 받으려면, `forwardRef`라는 고차 컴포넌트(HOC)로 감싸야만 했는데요.<br />

타입 정의도 복잡하고, 코드 구조도 직관적이지 않았습니다.<br />

```jsx
// React 18: forwardRef로 감싸야만 했던 복잡한 코드
import { forwardRef, useImperativeHandle, useRef } from "react";

// 핸들 타입 정의
interface InputHandle {
  focus: () => void;
}

const CustomInput = forwardRef<InputHandle, {}>((props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
  }));

  return <input ref={inputRef} type="text" />;
});
```

### React 19의 간결함 ref를 prop처럼

React 19부터는 `ref`가 일반 props처럼 취급되면서 `forwardRef`가 완전히 사라졌는데요.<br />

그냥 props 객체에서 `ref`를 꺼내 쓰기만 하면 됩니다.<br />

이 작은 변화가 학습 곡선을 엄청나게 낮춰줬습니다.<br />

```jsx
// React 19: ref를 일반 prop처럼 사용하는 간결한 코드
import { useImperativeHandle, useRef } from "react";

// 핸들 타입 정의
interface InputHandle {
  focus: () => void;
}

// ref를 props 타입에 추가
interface CustomInputProps {
  ref?: React.Ref<InputHandle>;
}

const CustomInput = ({ ref }: CustomInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
  }));

  return <input ref={inputRef} type="text" />;
};
```

이제 더 이상 `forwardRef`의 복잡한 문법과 씨름할 필요가 없어진 겁니다.<br />

## 그래서 useImperativeHandle을 쓰면 뭐가 좋은데요?

`useImperativeHandle`을 사용하면 자식 컴포넌트의 기능을 마치 API처럼 외부에 '공개'할 수 있는데요.<br />

이게 생각보다 정말 많은 장점을 가져다줍니다.<br />

1.  **props 지옥으로부터의 해방**<br />
    자식의 모든 동작을 제어하기 위해 `shouldFocus`, `shouldClear` 같은 상태 props를 주렁주렁 달아줄 필요가 없어지거든요.<br />
    부모는 그냥 필요할 때 `childRef.current?.focus()`처럼 직접 함수를 호출하면 끝입니다.<br />

2.  **부모 컴포넌트의 단순화**<br />
    자식 컴포넌트가 스스로 관리해야 할 상태까지 부모가 대신 관리해 줄 필요가 없어지는데요.<br />
    예를 들어 모달의 열림/닫힘 상태는 모달 컴포넌트가 알아서 관리하고, 부모는 `modalRef.current?.show()`만 호출하면 되니 코드가 훨씬 깔끔해집니다.<br />

3.  **명령적 동작의 자연스러운 표현**<br />
    '포커스', '스크롤', '애니메이션 재생'처럼 본질적으로 '명령'에 가까운 동작들을 리액트스럽게 표현하기 위해 억지로 상태를 만들 필요가 없거든요.<br />
    있는 그대로 자연스럽게 명령을 내릴 수 있습니다.<br />

4.  **불필요한 리렌더링 방지 (성능 최적화)**<br />
    가장 큰 장점 중 하나인데요.<br />
    만약 props로 동작을 제어한다면, 부모의 상태가 바뀔 때마다 자식 컴포넌트가 불필요하게 리렌더링될 수 있습니다.<br />
    하지만 `ref`를 통한 함수 호출은 리렌더링을 유발하지 않기 때문에 성능상 이점이 매우 큽니다.<br />

## 실전 예제 코드로 확실하게 이해하기

백문이 불여일견이죠.<br />

실제 코드 예제를 통해 `useImperativeHandle`이 어떻게 작동하는지 살펴보겠습니다.<br />

### 예제 1 커스텀 Input 컴포넌트

가장 대표적인 예시로, 포커스, 클리어, 값 가져오기/설정하기 기능을 가진 `CustomInput` 컴포넌트입니다.<br />

```jsx
// src/components/CustomInput.tsx
import { useImperativeHandle, useRef } from "react";

// 부모에게 공개할 함수들의 타입을 미리 정의합니다.
export interface InputHandle {
  focus: () => void;
  clear: () => void;
  getValue: () => string;
  setValue: (value: string) => void;
}

interface CustomInputProps {
  ref?: React.Ref<InputHandle>;
  placeholder?: string;
}

const CustomInput = ({ ref, placeholder }: CustomInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // useImperativeHandle을 통해 ref에 함수들을 연결합니다.
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
      console.log('Input에 포커스되었습니다.');
    },
    clear: () => {
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
    getValue: () => {
      return inputRef.current?.value || "";
    },
    setValue: (value: string) => {
      if (inputRef.current) {
        inputRef.current.value = value;
      }
    },
  }));

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder={placeholder}
      className="border p-2 rounded"
    />
  );
};

export default CustomInput;
```

이렇게 만들어진 `CustomInput`은 부모 컴포넌트에서 `ref`를 통해 아주 쉽게 제어할 수 있습니다.<br />

```jsx
// 부모 컴포넌트
import { useRef } from "react";
import CustomInput, { InputHandle } from "./CustomInput";

const ParentComponent = () => {
  // 자식 컴포넌트의 핸들 타입을 제네릭으로 넘겨줍니다.
  const inputRef = useRef<InputHandle>(null);

  const handleFocus = () => inputRef.current?.focus();
  const handleClear = () => inputRef.current?.clear();
  const handleGetValue = () => {
    const value = inputRef.current?.getValue();
    alert(`현재 값: ${value}`);
  };
  const handleSetValue = () => inputRef.current?.setValue("미리 설정된 값");

  return (
    <div>
      <CustomInput ref={inputRef} placeholder="여기에 입력하세요..." />
      <div className="space-x-2 mt-2">
        <button onClick={handleFocus}>포커스</button>
        <button onClick={handleClear}>초기화</button>
        <button onClick={handleGetValue}>값 가져오기</button>
        <button onClick={handleSetValue}>값 설정하기</button>
      </div>
    </div>
  );
};
```

### 예제 2 동영상 플레이어 컴포넌트

이번엔 조금 더 복잡한 예시로, 동영상 플레이어의 재생, 정지, 시간 이동 등을 제어하는 컴포넌트입니다.<br />

이런 미디어 제어야말로 `useImperativeHandle`이 빛을 발하는 영역이거든요.<br />

```jsx
// src/components/VideoPlayer.tsx
import { useImperativeHandle, useRef } from "react";

export interface VideoPlayerHandle {
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
}

interface VideoPlayerProps {
  ref?: React.Ref<VideoPlayerHandle>;
  src: string;
}

const VideoPlayer = ({ ref, src }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useImperativeHandle(ref, () => ({
    play: () => videoRef.current?.play(),
    pause: () => videoRef.current?.pause(),
    seek: (time: number) => {
      if (videoRef.current) {
        videoRef.current.currentTime = time;
      }
    },
  }));

  // controls={false}로 설정하여 UI는 부모가 제어하도록 합니다.
  return <video ref={videoRef} src={src} controls={false} className="w-full" />;
};

export default VideoPlayer;
```

부모는 이 `ref`를 이용해서 자신만의 커스텀 컨트롤 UI를 만들 수 있습니다.<br />

리렌더링 걱정 없이 말이죠.<br />

## 이럴 땐 쓰지 마세요 useImperativeHandle의 안티 패턴

물론 이 훅이 만능은 절대 아닌데요.<br />

리액트의 기본 원칙을 거스르는 만큼, 꼭 필요할 때만 신중하게 사용해야 합니다.<br />

특히 아래와 같은 경우에는 다른 방법을 먼저 고려하는 것이 좋습니다.<br />

1.  **단순한 데이터 전달용**<br />
    자식에게 그냥 데이터를 보여주기만 하면 되는 상황이라면, 당연히 props를 쓰는 게 맞거든요.<br />
    `useImperativeHandle`로 `getValue` 같은 함수를 만드는 것보다, 상태를 부모가 관리하고 props로 내려주는 것이 리액트의 기본 흐름에 훨씬 자연스럽습니다.<br />

2.  **전역 상태 관리용**<br />
    여러 컴포넌트가 공유하는 복잡한 상태를 관리하기 위해 이 훅을 사용하는 건 좋지 않은 선택인데요.<br />
    이런 경우에는 Zustand, Jotai, Recoil 같은 전문 상태 관리 라이브러리를 사용하는 것이 훨씬 효율적이고 예측 가능한 코드를 만들어줍니다.<br />

3.  **컴포넌트의 과도한 노출**<br />
    자식 컴포넌트의 거의 모든 내부 함수와 상태를 `ref`로 공개하는 건 사실상 캡슐화를 포기하는 것과 같거든요.<br />
    이는 컴포넌트 간의 결합도를 높여서 유지보수를 어렵게 만듭니다.<br />
    꼭 필요한 최소한의 기능만 API처럼 공개해야 합니다.<br />

## 결론 이제는 자신 있게 사용해 볼 시간

정리해 보겠습니다.<br />

`useImperativeHandle`은 분명 리액트의 일반적인 데이터 흐름을 거스르는 '비상 탈출구'가 맞는데요.<br />

하지만 DOM을 직접 조작하거나, 불필요한 리렌더링을 막아야 하거나, 복잡한 자식 컴포넌트를 명령적으로 제어해야 하는 '비상 상황'은 생각보다 자주 발생합니다.<br />

React 18까지는 `forwardRef`라는 높은 벽 때문에 이 강력한 도구를 제대로 활용하기 어려웠던 게 사실입니다.<br />

하지만 `ref`를 일반 prop처럼 다룰 수 있게 된 React 19부터는 이야기가 완전히 달라졌거든요.<br />

이제 `useImperativeHandle`은 더 이상 기피 대상이 아니라, 복잡한 UI 문제를 우아하게 해결할 수 있는 개발자의 '필수 스킬' 중 하나가 되었다고 생각합니다.<br />

props 지옥에 빠져있거나, 불필요한 리렌더링 때문에 고민이라면, 이제는 자신감을 갖고 `useImperativeHandle`을 한번 시도해 보시는 건 어떨까요?<br />
