---
slug: 2025-12-25-react-typescript-essential-patterns-for-practical-dev
title: "React 개발의 질을 높이는 실무 중심 TypeScript 핵심 패턴"
summary: "프론트엔드 개발의 필수품이 된 TypeScript와 React 조합에서 실무에 바로 적용할 수 있는 핵심 타입과 패턴을 정리했습니다"
date: 2025-12-25T02:26:02.792Z
draft: false
weight: 50
tags: ["React", "TypeScript", "Frontend", "ComponentProps", "ReactNode", "WebDevelopment", "CodingTips"]
contributors: []
---

![React 개발의 질을 높이는 실무 중심 TypeScript 핵심 패턴](https://blogger.googleusercontent.com/img/a/AVvXsEgr_P_vbKgrljls-Gm7_Q94A5hP7OGGDjiZ4NqZq0cUJXCAeOxSriFZ63Fo7ho_lEsmt12FiMbXbcDJham42JrUyfgIZh1Wjqm5xJzzk3myWV9Lzbqupz9NkwIb9NtsomHN7FiIGPDnwgrqDWOtBu86bPddi0h14xq8FI5lK3012XK6vxkGx3yQWs2xW7w=s16000)

프론트엔드 엔지니어로서 커리어를 쌓아가다 보면 TypeScript는 이제 선택이 아닌 필수가 되었는데요.

최근 실무 현장에서는 순수 JavaScript보다 TypeScript를 사용하는 비중이 압도적으로 높습니다.

가장 대중적인 라이브러리인 React를 기반으로 TypeScript를 익히는 것이 가장 효율적인 학습 방법입니다.

오늘은 실무에서 정말 자주 쓰이는 핵심 타입 패턴들을 모아 정리해 보려 합니다.

먼저 React를 다루다 보면 가장 흔하게 마주치는 두 가지 타입이 있는데요.

바로 'ReactNode'와 'ReactElement'입니다.

이 둘은 비슷해 보이지만 쓰임새가 명확히 다릅니다.

'ReactNode'는 컴포넌트가 렌더링할 수 있는 모든 것을 포함하는 가장 넓은 범위의 타입인데요.

문자열, 숫자, null, undefined, 그리고 ReactElement까지 포함하기 때문에 주로 'children' props의 타입으로 사용됩니다.

버튼 컴포넌트를 만들 때 이 타입을 어떻게 활용하는지 코드로 살펴보겠습니다.


```typescript
import { ReactNode } from 'react'

type PropsType = {
    children: ReactNode; // 자식 요소를 유연하게 받기 위한 타입
}

export const ScheduleBtn = ({ children }: PropsType) => {
  return (
    <div className="bg-blue-800 w-[94%] text-white rounded-sm px-2">
        {children}
    </div>
  )
}
```

이렇게 'ReactNode'를 사용하면 텍스트뿐만 아니라 다른 컴포넌트나 태그들도 자식으로 자유롭게 받을 수 있습니다.


반면 'ReactElement'는 조금 더 구체적인 형태를 띠는데요.

`React.createElement` 함수가 반환하는 객체, 즉 컴포넌트가 실행된 결과물 자체를 의미하는 타입입니다.

JSX 문법으로 작성된 태그나 컴포넌트 호출 그 자체가 바로 이 타입에 해당합니다.


```typescript
const Hello = () => {
  return <h1 className="text-3xl font-bold text-lime-700">안녕하세요!</h1>;
};

const App = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Hello /> {/* 이 부분이 바로 ReactElement입니다 */}
    </div>
  );
};
```

정리하자면 'ReactNode'는 렌더링 가능한 모든 것이고, 'ReactElement'는 JSX의 결과물이라고 이해하면 쉽습니다.


다음으로 컴포넌트를 만들 때 가장 유용하게 쓰이는 'ComponentProps'에 대해 알아보겠습니다.

HTML 기본 태그인 button이나 input이 가진 수많은 속성을 일일이 타이핑하는 것은 매우 비효율적인데요.

이때 'ComponentProps'를 사용하면 해당 태그가 가진 모든 속성 타입을 한 번에 가져올 수 있습니다.

예를 들어 스타일은 통일하되 기능은 유연한 Input 컴포넌트를 만들어보겠습니다.


먼저 기존에 반복적으로 작성하던 코드를 살펴보시죠.


```tsx
// 기존 코드: 스타일링이 중복되어 사용되고 있습니다
<div className="w-[80%]">
    <input
       name="email"
       type="text"
       className="w-full border-4 border-solid border-sky-500 rounded-md p-2"
       placeholder="이메일 주소"
    />
</div>
<div className="w-[80%]">
    <input
        name="password"
        type="password"
        className="w-full border-4 border-solid border-sky-500 rounded-md p-2"
        placeholder="비밀번호"
    />
</div>
```

이렇게 중복되는 스타일을 하나의 컴포넌트로 묶고, 나머지 속성은 그대로 사용하고 싶을 때가 있는데요.

이럴 때 'ComponentProps'가 빛을 발합니다.


```typescript
import { ComponentProps } from 'react'

// input 태그의 모든 속성을 props로 받아옵니다
export const Input = (props: ComponentProps<"input">) => {
    return(
        <input
            {...props}
            className="w-full border-sky-500 border-4 border-solid p-2"
        />
    )
}
```

이제 이 컴포넌트를 사용하면 코드가 훨씬 깔끔해집니다.


```tsx
<div className="w-[80%]">
    <Input
        name="email"
        type="text"
        placeholder="이메일 주소"
    />
</div>

<div className="w-[80%]">
    <Input
        name="password"
        type="password" // type 속성도 자동완성 됩니다
        placeholder="비밀번호"
    />
</div>
```

이처럼 'ComponentProps'를 활용하면 HTML 기본 속성을 놓치지 않으면서도 재사용성을 극대화할 수 있습니다.


이번에는 함수형 프로그래밍에서 유용한 'ReturnType'과 'Awaited'에 대해 이야기해 보겠습니다.

외부 라이브러리나 복잡한 함수에서 반환되는 값의 타입을 추출해야 할 때가 종종 있는데요.

이때 함수의 반환 타입을 직접 정의하지 않고, 'ReturnType'을 사용해 추론할 수 있습니다.


```typescript
// 일반적인 함수
function add(a: number, b: number) {
  return a + b;
}

// 함수의 반환값인 number 타입을 추출합니다
type AddReturnType = ReturnType<typeof add>;
```

하지만 요즘 웹 개발에서는 비동기 처리가 필수적인데요.

비동기 함수는 기본적으로 Promise를 반환하기 때문에 'ReturnType'만으로는 우리가 원하는 실제 데이터 타입을 얻을 수 없습니다.

이때 'Awaited' 유틸리티 타입을 함께 사용하면 Promise 껍질을 벗겨내고 내부의 실제 데이터 타입만 쏙 뽑아낼 수 있습니다.


```typescript
// 비동기 함수
async function fetchData() {
  return { id: 1, name: "Alice" };
}

// ReturnType만 쓰면 Promise<{ id: number; name: string }>이 됩니다
type FetchReturnType = ReturnType<typeof fetchData>;

// Awaited로 감싸주면 { id: number; name: string }만 추출됩니다
type FetchedData = Awaited<ReturnType<typeof fetchData>>;
```

API 통신 함수를 만들 때 이 패턴을 사용하면 응답 타입을 별도로 정의하는 수고를 덜 수 있어 매우 효율적입니다.


실무에서는 기존 타입에 새로운 속성을 추가해야 하는 경우도 빈번하게 발생하는데요.

이때는 교차 타입(Intersection Type)인 '&' 기호를 사용하여 타입을 결합할 수 있습니다.

기존 HTML 버튼 속성에 우리만의 커스텀 속성인 'variant'를 추가하는 예시를 보겠습니다.


```typescript
// 기존 버튼 속성에 variant 속성을 결합합니다
type ButtonProps = {
  variant: "primary" | "secondary";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  variant,
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={[
        "rounded px-4 py-2",
        variant === "primary" ? "bg-blue-600 text-white" : "bg-gray-500 text-white",
        className,
      ].filter(Boolean).join(" ")}
    />
  );
}
```

이렇게 하면 기본 버튼의 기능은 유지하면서 디자인 시스템에 맞는 속성을 강제할 수 있습니다.


마지막으로, 타입을 더하는 것이 아니라 빼고 싶을 때는 어떻게 해야 할까요.

원본 글에서는 다루지 않았지만, 실무에서 정말 중요한 'Omit' 유틸리티 타입을 소개합니다.

만약 우리가 만든 컴포넌트에서 사용자가 임의로 'className'을 수정하지 못하게 막고 싶다면 어떻게 해야 할까요.

'ComponentProps'로 모든 속성을 다 받아오되, 'Omit'을 사용하여 특정 속성만 제거할 수 있습니다.


```typescript
import { ComponentProps } from 'react';

// input의 속성은 다 받지만, className과 style은 제외합니다
type FixedStyleInputProps = Omit<ComponentProps<'input'>, 'className' | 'style'>;

export const FixedInput = (props: FixedStyleInputProps) => {
  return (
    <input
      {...props}
      // 이곳의 스타일은 외부에서 덮어쓸 수 없습니다
      className="bg-gray-100 border border-gray-300 p-2 rounded-lg text-black"
    />
  );
};
```

이렇게 'Omit'을 활용하면 디자인 일관성을 해치는 속성 주입을 원천적으로 차단할 수 있습니다.

이처럼 TypeScript의 유틸리티 타입들을 적재적소에 활용하면, 더 견고하고 유지보수하기 좋은 React 애플리케이션을 만들 수 있습니다.

오늘 소개한 패턴들을 여러분의 프로젝트에 바로 적용해 보시길 바랍니다.
