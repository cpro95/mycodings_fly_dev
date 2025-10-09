---
slug: 2025-08-26-react-componentprops-typescript-guide
title: React Props 타입, 아직도 className?; string 쓰세요? (ComponentProps 완벽 가이드)
date: 2025-08-27 14:22:09.620000+00:00
summary: 매번 className, onClick을 수동으로 추가하는 데 지치셨나요? HTMLAttributes부터 ComponentProps까지, 타입스크립트로 React 컴포넌트의 props를 정의하는 가장 우아하고 확장 가능한 방법을 소개합니다.
tags: ["React", "TypeScript", "ComponentProps", "props 타입", "프론트엔드", "컴포넌트 디자인"]
contributors: []
draft: false
---

리액트와 타입스크립트로 컴포넌트를 만들 때 props 타입 정의, 다들 어떻게 하고 계신가요?<br />

아마 많은 분들이 `className?: string`, `onClick?: () => void`처럼 필요한 prop들을 하나하나 수작업으로 추가하고 계실 겁니다.<br />

물론 틀린 방법은 아니지만, 이게 여간 번거로운 일이 아니거든요.<br />

`id`, `style`, `data-*` 속성, `aria-*` 접근성 속성까지...<br />

네이티브 HTML 요소가 가진 수많은 속성들을 일일이 다 정의해 주는 건 거의 불가능에 가깝습니다.<br />

그래서 오늘은 이 지루한 반복 작업을 끝내고, 우리의 컴포넌트를 훨씬 더 유연하고 확장 가능하게 만들어주는 타입스크립트의 '비밀 병기'들을 소개해 드리려고 하는데요.<br />

바로 `HTMLAttributes`와 `ComponentProps` 패밀리입니다.<br />

## 왜 기본 타입을 상속받아야 할까요?

우리가 만드는 커스텀 `<Button />` 컴포넌트는 결국 최종적으로 HTML `<button>` 태그로 렌더링되거든요.<br />

그렇다면 우리가 만든 컴포넌트도 당연히 `<button>` 태그가 가질 수 있는 모든 속성들(`disabled`, `type`, `onClick` 등)을 그대로 전달받을 수 있어야 사용자 입장에서 편리합니다.<br />

이걸 수동으로 다 정의하는 대신, 타입스크립트가 이미 만들어 둔 타입을 '상속'받아서 확장하는 것이 훨씬 더 스마트한 방법인 거죠.<br />

이걸 가능하게 해주는 대표적인 타입들이 몇 가지 있습니다.<br />

## 5인의 용사 React Prop 타입의 대표 주자들

React 컴포넌트의 props 타입을 정의할 때, 네이티브 HTML 요소의 속성을 가져오기 위해 주로 사용하는 5가지 타입이 있는데요.<br />

각각의 특징과 포함 범위를 아는 것이 중요합니다.<br />

1.  **`React.HTMLAttributes<T>`**<br />
    가장 기본적이고 범용적인 HTML 속성들을 포함합니다.<br />
    `className`, `id`, `style`, `onClick` 같은 것들이죠.<br />
    하지만 `children`이나 `ref`는 포함하지 않고, `button`의 `disabled` 같은 특정 요소 고유의 속성도 빠져있습니다.<br />

2.  **`React.ButtonHTMLAttributes<T>`** (요소별 버전)<br />
    `HTMLAttributes`를 상속받으면서, 특정 요소가 가진 고유의 속성들을 추가로 포함하는데요.<br />
    예를 들어 `<button>`이라면 `type`, `disabled`, `form` 같은 속성들이 추가됩니다.<br />
    마찬가지로 `children`과 `ref`는 포함하지 않습니다.<br />

3.  **`React.ComponentPropsWithoutRef<T>`**<br />
    최근 가장 많이 추천되는 방식 중 하나인데요.<br />
    요소 고유의 속성은 물론, `children`까지 포함합니다.<br />
    이름에서 알 수 있듯이 `ref`는 제외됩니다.<br />
    컴포넌트 내부에서 `ref`를 직접 다룰 필요가 없을 때 가장 이상적인 선택지입니다.<br />

4.  **`React.ComponentPropsWithRef<T>`**<br />
    `ComponentPropsWithoutRef`에 `ref` 타입까지 추가된 완전체 버전입니다.<br />
    `forwardRef`를 사용해서 부모로부터 `ref`를 전달받아야 할 때 사용합니다.<br />

5.  **`React.ComponentProps<T>`**<br />
    사실상 `ComponentPropsWithRef`와 거의 동일한데요.<br />
    과거 클래스 컴포넌트와의 호환성 때문에 미세한 차이가 있었지만, 함수형 컴포넌트가 대세인 지금은 그냥 `ComponentPropsWithRef`의 짧은 버전이라고 생각하셔도 무방합니다.<br />

### 한눈에 보는 타입별 포함 범위

말로만 들으면 헷갈리니, 표로 간단하게 정리해 보겠습니다.<br />

| 타입 | 기본 속성 | 요소 고유 속성 | `children` | `ref` |
| :--- | :---: | :---: | :---: | :---: |
| `HTMLAttributes` | ✅ | ❌ | ❌ | ❌ |
| `ButtonHTMLAttributes` | ✅ | ✅ | ❌ | ❌ |
| `ComponentPropsWithoutRef` | ✅ | ✅ | ✅ | ❌ |
| `ComponentPropsWithRef` | ✅ | ✅ | ✅ | ✅ |
| `ComponentProps` | ✅ | ✅ | ✅ | ✅ |
<br />
표를 보면 `ComponentProps` 계열이 가장 많은 것을 포함하고 있다는 걸 알 수 있습니다.<br />

## 실전! 그래서 뭘 어떻게 써야 할까요?

이제 이론은 알았으니, 실제 컴포넌트를 만들면서 어떻게 적용하는지 살펴보겠습니다.<br />

가장 흔한 예시인 `<Button />` 컴포넌트를 만들어 보죠.<br />

### 기본 전략 `ComponentPropsWithoutRef`로 시작하기

대부분의 컴포넌트는 부모로부터 `ref`를 직접 전달받을 필요가 없거든요.<br />

그래서 가장 균형 잡힌 `ComponentPropsWithoutRef`를 기본으로 사용하는 것이 좋습니다.<br />

```tsx
import React from 'react';

// 1. 우리가 추가하고 싶은 커스텀 prop 타입을 정의합니다.
type CustomButtonProps = {
  variant: 'primary' | 'secondary';
  // 여기에 size, fullWidth 등 다른 커스텀 props를 추가할 수 있습니다.
};

// 2. ComponentPropsWithoutRef와 '&' 연산자로 타입을 결합합니다.
type ButtonProps = React.ComponentPropsWithoutRef<'button'> & CustomButtonProps;

const Button: React.FC<ButtonProps> = ({ 
  variant, 
  children, 
  className,
  ...props // 나머지 모든 네이티브 button 속성들은 여기에 담깁니다.
}) => {
  const baseStyle = 'px-4 py-2 rounded font-bold';
  const variantStyle = variant === 'primary' 
    ? 'bg-blue-500 text-white' 
    : 'bg-gray-300 text-black';

  return (
    <button 
      // 3. ...props를 그대로 전달하여 모든 네이티브 속성을 적용합니다.
      {...props} 
      className={`${baseStyle} ${variantStyle} ${className || ''}`}
    >
      {children}
    </button>
  );
};

export default Button;
```

이렇게 하면, 우리가 만든 `<Button />` 컴포넌트는 `variant`라는 커스텀 prop과 함께, `disabled`, `onClick`, `aria-label` 등 `<button>`이 가질 수 있는 모든 속성을 똑똑하게 타입 추론까지 완벽하게 지원받게 됩니다.<br />

### `ref`가 필요할 땐 `ComponentProps`와 `forwardRef`

만약 부모 컴포넌트에서 `inputRef.current.focus()`처럼 자식 컴포넌트의 DOM에 직접 접근해야 한다면, `ref`를 전달받아야 하는데요.<br />

이때는 `ComponentProps`와 `forwardRef`를 함께 사용합니다.<br />

```tsx
import React from 'react';

type InputProps = React.ComponentProps<'input'> & {
  label: string;
};

// forwardRef를 사용하고, ref 타입을 첫 번째 제네릭 인자로 넘겨줍니다.
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, ...props }, ref) => (
    <label>
      <span className="block text-sm font-medium text-gray-700">{label}</span>
      <input 
        ref={ref} 
        {...props} 
        className="mt-1 block w-full px-3 py-2 border rounded-md"
      />
    </label>
  )
);

export default Input;
```

## 끝판왕 유연함의 극치, 'as' prop을 이용한 폴리모픽 컴포넌트

여기서 한 단계 더 나아가면, '폴리모픽(Polymorphic) 컴포넌트'라는 개념을 구현할 수 있는데요.<br />

이건 컴포넌트가 렌더링될 HTML 태그를 동적으로 바꿀 수 있게 해주는 정말 강력한 패턴입니다.<br />

예를 들어, 평소에는 `<button>`으로 렌더링되던 우리 `<Button />` 컴포넌트를, `href` prop이 있으면 `<a>` 태그로 렌더링하고 싶을 때 사용하는 거죠.<br />

이건 제네릭을 활용해야 해서 조금 복잡하지만, 한번 만들어두면 컴포넌트의 재사용성이 극적으로 올라갑니다.<br />

```tsx
import React from 'react';

// Omit을 사용해 기본 타입에서 커스텀 타입과 겹치는 부분을 제거합니다.
type PolymorphicProps<E extends React.ElementType, P> = P & Omit<React.ComponentProps<E>, keyof P>;

// 기본 태그를 'button'으로 설정합니다.
const DEFAULT_ELEMENT = 'button';

type ButtonComponentProps<E extends React.ElementType = typeof DEFAULT_ELEMENT> = PolymorphicProps<
  E,
  {
    as?: E; // 'as' prop으로 렌더링할 태그를 받습니다.
    variant?: 'primary' | 'secondary';
  }
>;

const Button = <E extends React.ElementType = typeof DEFAULT_ELEMENT>({
  as,
  variant = 'primary',
  children,
  className,
  ...props
}: ButtonComponentProps<E>) => {
  const Component = as || DEFAULT_ELEMENT;

  const baseStyle = 'px-4 py-2 rounded font-bold';
  const variantStyle = variant === 'primary' 
    ? 'bg-blue-500 text-white' 
    : 'bg-gray-300 text-black';

  return (
    <Component 
      {...props} 
      className={`${baseStyle} ${variantStyle} ${className || ''}`}
    >
      {children}
    </Component>
  );
};

// 사용 예시
const App = () => (
  <div>
    {/* 기본 button으로 렌더링 */}
    <Button onClick={() => alert('클릭!')}>나는 버튼</Button>
    
    {/* as="a"와 href를 전달하여 a 태그로 렌더링 */}
    <Button as="a" href="#" variant="secondary">나는 링크</Button>
  </div>
);
```

이렇게 `as` prop 패턴을 구현하면, 디자인 시스템이나 공통 컴포넌트 라이브러리를 만들 때 정말 빛을 발합니다.<br />

## 최종 결론 나에게 맞는 타입은?

복잡해 보이지만, 판단 기준은 생각보다 간단합니다.<br />

아래의 흐름도를 따라가면 대부분의 상황에 맞는 최적의 타입을 선택할 수 있습니다.<br />

1.  **부모로부터 `ref`를 전달받아야 하나요?**<br />
    -   **Yes** → `React.ComponentProps` 또는 `React.ComponentPropsWithRef`를 사용하세요.<br />
    -   **No** → 2번으로 가세요.<br />

2.  **`children`을 prop으로 받아야 하나요?**<br />
    -   **Yes** → `React.ComponentPropsWithoutRef<'태그명'>`이 가장 좋은 선택입니다. **(강력 추천)**<br />
    -   **No** → 3번으로 가세요.<br />

3.  **`<button>`의 `disabled`처럼 요소 고유의 속성이 필요한가요?**<br />
    -   **Yes** → `React.ButtonHTMLAttributes<HTMLButtonElement>`처럼 요소별 타입을 사용하세요.<br />
    -   **No** → `React.HTMLAttributes<HTMLDivElement>`를 사용하세요.<br />

이처럼 React와 타입스크립트가 제공하는 기본 타입을 잘 활용하는 것은 단순히 타이핑을 줄여주는 것을 넘어섭니다.<br />

더 견고하고, 더 유연하며, 함께 일하는 동료가 사용하기에도 훨씬 편리한 컴포넌트를 만드는 핵심 기술이거든요.<br />

이제 `className?: string`의 반복에서 벗어나, `ComponentProps`로 여러분의 컴포넌트 수준을 한 단계 업그레이드해 보세요.<br />


