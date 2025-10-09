---
slug: 2025-08-25-css-cascade-layers-deep-dive-why-we-need-at-layer
title: CSS @layer 완벽 가이드 명확도 전쟁은 끝났다
date: 2025-08-26 12:57:46.312000+00:00
summary: CSS 명확도(Specificity)와의 싸움에 지치셨나요? Tailwind CSS도 사용하는 @layer, 즉 Cascade Layers가 왜 등장했고 어떻게 우리의 스타일링을 구원해 주는지 그 배경부터 실전 예제까지 깊이 있게 파헤쳐 봅니다.
tags: ["CSS", "layer", "Cascade Layers", "CSS 명확도", "Specificity", "Tailwind CSS"]
contributors: []
draft: false
---

Tailwind CSS 같은 프레임워크를 사용하다 보면 `@layer`라는 녀석을 꼭 만나게 되는데요.<br />

저도 처음에는 이 녀석 덕분에 스타일링 구조가 깔끔해져서 좋다고 생각했지만, 때로는 예상치 못한 문제에 부딪히기도 했습니다.<br />

그러다 문득 이런 근본적인 질문이 떠오르는데요.<br />

'잠깐, 우리에겐 이미 명확도(Specificity)라는 게 있었는데 굳이 @layer가 또 필요했던 이유가 뭘까?' 하는 생각이 들었습니다.<br />

그래서 이 궁금증을 해결해봐야겠다고 생각했는데요.<br />

이번 글에서는 `@layer`의 탄생 배경부터 작동 원리, 그리고 실전 사용법까지 제대로 파헤쳐 보겠습니다.<br />

## @layer, 대체 넌 누구냐

MDN 문서를 보면 `@layer`를 이렇게 설명하고 있는데요.<br />

> `@layer`는 CSS의 at-rule 중 하나로, Cascade Layers(캐스케이드 레이어)를 선언하고 여러 레이어 간의 우선순위를 정의하는 데 사용됩니다.<br />

그런데 이 설명만으로는 궁금증이 전부 해결되지는 않는데요.<br />

CSS에는 이미 명확도라는 우선순위 규칙이 있는데, 왜 또 새로운 규칙이 필요했는지 알아봐야 합니다.<br />

이 질문에 답하려면, 먼저 CSS의 근본적인 동작 방식인 '캐스케이드'부터 다시 짚어봐야겠죠.<br />

### CSS 스타일 적용의 대원칙, 캐스케이드

CSS 스타일이 웹페이지에 적용될 때는 '캐스케이드(Cascade)'라는 알고리즘을 통해 어떤 스타일을 최종적으로 보여줄지 결정되는데요.<br />

이것이 바로 스타일 우선순위를 계산하는 핵심 규칙입니다.<br />

캐스케이드는 여러 곳에서 선언된 스타일 값들 중에서 단 하나의 '승자'를 가려내는 과정인데요.<br />

그 기준은 다음과 같은 순서로 명확하게 정해져 있습니다.<br />

1.  **Origin and Importance (출처와 중요도)**<br />
2.  **Context (컨텍스트)**<br />
3.  **Element-Attached Styles (요소에 직접 첨부된 스타일)**<br />
4.  **Layers (레이어)**<br />
5.  **Specificity (명확도)**<br />
6.  **Order of Appearance (선언 순서)**<br />

여기서 4번 'Layers'가 바로 오늘의 주인공인데요.<br />

하지만 이 녀석은 잠시 제쳐두고, 나머지 전통적인 기준들부터 빠르게 훑어보겠습니다.<br />

가장 먼저 따지는 건 스타일이 어디서 왔고, 얼마나 중요한가 하는 '출처와 중요도'인데요.<br />

기본적으로 스타일시트는 3가지 출처로 나뉩니다.<br />

*   **User-agent stylesheets (브라우저 스타일시트)** 브라우저가 기본적으로 제공하는 스타일입니다.<br />
*   **Author stylesheets (개발자 스타일시트)** 우리 같은 개발자들이 작성하는 가장 일반적인 스타일시트죠.<br />
*   **User stylesheets (사용자 스타일시트)** 사용자가 브라우저 확장 프로그램 등을 통해 직접 설정하는 스타일시트예요.<br />

여기에 `!important` 키워드가 붙으면 이 판이 완전히 뒤집히는데요.<br />

`!important`가 붙은 스타일은 일반 스타일보다 무조건 우선순위가 높아지고, 심지어 출처 간의 우선순위도 역전됩니다.<br />

그다음으로는 Shadow DOM 같은 독립된 컨텍스트인지, `style` 속성으로 직접 붙은 인라인 스타일인지 등을 따지는데요.<br />

그다음 단계가 바로 우리에게 가장 익숙한 '명확도(Specificity)'입니다.<br />

ID > 클래스 > 태그 순으로 점수를 매겨서 더 높은 점수를 가진 스타일이 이기는 규칙인데요.<br />

만약 명확도까지 똑같다면, 가장 마지막에 선언된 스타일이 이기는 '선언 순서(Order of Appearance)' 규칙이 적용됩니다.<br />

## 명확도만으로는 부족했던 이유

여기까지 보면 '이 정도면 충분하지 않나?' 싶을 수 있는데요.<br />

사실 현업 개발자 입장에서는 명확도와 선언 순서만으로 스타일을 관리하는 데 엄청난 한계가 있었습니다.<br />

바로 이 지점에서 `@layer`가 태어날 수밖에 없었던 이유가 드러나는데요.<br />

지금부터 그 이야기를 해보겠습니다.<br />

### 거대해진 CSS와 설계 기법의 등장

웹이 점점 복잡해지고, 하나의 프로젝트에 여러 개발자가 참여하게 되면서 CSS 파일의 규모는 걷잡을 수 없이 커졌는데요.<br />

개발자들이 작성하는 스타일은 모두 같은 'Author' 출처를 가지기 때문에, 결국 '명확도' 싸움으로 귀결될 수밖에 없었습니다.<br />

프로젝트가 커질수록 명확도 충돌이 빈번해지고, 결국 `'!important'`를 남발하거나 선언 순서에 의존하는 임시방편만 늘어났는데요.<br />

이러다 보니 유지보수는 점점 어려워지는 악순환이 시작된 겁니다.<br />

이런 'CSS 지옥'에서 벗어나기 위해 개발자들은 다양한 CSS 설계 기법을 고안해 냈는데요.<br />

그중 대표적인 것이 바로 'ITCSS(Inverted Triangle CSS, 역삼각형 CSS)'입니다.<br />

ITCSS는 CSS를 여러 추상적인 계층으로 나누는 아이디어인데요.<br />

가장 위에는 포괄적이고 명확도가 낮은 스타일을, 가장 아래에는 구체적이고 명확도가 높은 스타일을 배치하는 구조였습니다.<br />

이렇게 명확도를 계층적으로 관리해서 예측 가능하고 확장성 있는 CSS를 만들자는 아주 스마트한 접근법이었죠.<br />

### 설계 기법의 한계와 새로운 제안의 탄생

하지만 ITCSS 같은 설계 기법도 결국은 '사람들 간의 약속'일 뿐, 언어 자체의 기능이 아니라는 명확한 한계가 있었는데요.<br />

팀원 중 한 명이라도 규칙을 어기거나, 명확도 규칙을 무시하는 서드파티 라이브러리가 끼어드는 순간 이 구조는 와르르 무너질 수밖에 없었습니다.<br />

바로 이 문제를 해결하기 위해 2019년, 미리암 수잔(Miriam Suzanne)이라는 개발자가 CSS 명세에 아주 중요한 제안을 하는데요.<br />

제안의 핵심은 바로 이것이었습니다.<br />

> 개발자들이 ITCSS처럼 개념적으로 만들어 쓰던 '레이어'를 아예 CSS 공식 기능으로 지원해주면 어떨까?<br />
> 개발자가 직접 스타일의 계층을 정의하고 제어할 수 있게 만들어서, 명확도 문제를 근본적으로 해결하자!<br />

이 제안이 받아들여져 마침내 'Cascade Layers'라는 이름으로 표준화된 것이 바로 `@layer`입니다.<br />

## 새로운 기준의 등장, Cascade Layers

`@layer`는 캐스케이드 알고리즘에서 '명확도'보다 먼저 평가되는, 아주 강력한 새로운 기준인데요.<br />

이것은 이제 우리가 명확도 점수를 일일이 계산하며 싸울 필요 없이, '레이어의 순서'만으로 스타일의 우선순위를 결정할 수 있게 되었다는 것을 의미합니다.<br />

개발자들이 그토록 원했던 '개념적 레이어'가 드디어 CSS의 공식 스펙이 된 거죠.<br />

## @layer 실전 사용법 A to Z

자, 그럼 이제 `@layer`를 실제로 어떻게 사용하는지 한번 살펴봐야 하는데요.<br />

사용법은 생각보다 아주 간단합니다.<br />

### 1단계 레이어 순서 정의하기

가장 먼저 해야 할 일은 CSS 파일 최상단에서 `@layer` 규칙을 사용해 전체 레이어의 순서를 선언하는 건데요.<br />

이때 선언된 순서가 곧 우선순위가 됩니다.<br />

나중에 선언된 레이어일수록 더 높은 우선순위를 가지죠.<br />

```css
/* 레이어 순서 정의: utilities가 가장 높은 우선순위를 가짐 */
@layer reset, base, components, utilities;
```

이렇게 `reset`, `base`, `components`, `utilities` 순으로 선언하면, `utilities` 레이어의 스타일이 `components` 레이어의 스타일보다 항상 우선 적용됩니다.<br />

### 2단계 레이어에 스타일 할당하기

순서를 정의했다면, 이제 각 스타일에 레이어를 할당해주면 되는데요.<br />

여기에는 두 가지 방법이 있습니다.<br />

첫 번째는 `@layer` 블록으로 스타일을 감싸는 방법입니다.<br />

```css
@layer components {
  .button {
    padding: 8px 16px;
    border-radius: 4px;
    background-color: blue;
    color: white;
  }
}

@layer utilities {
  .bg-red {
    background-color: red;
  }
}
```

두 번째는 `@layer` 키워드를 import 문에 붙이는 방법인데요.<br />

파일별로 레이어를 관리할 때 아주 유용합니다.<br />

```css
@import url('reset.css') layer(reset);
@import url('components.css') layer(components);
```

### @layer의 마법 명확도를 이기는 레이어

이제 `@layer`의 진짜 힘을 보여주는 예제를 한번 봐야 하는데요.<br />

아래와 같은 HTML과 CSS가 있다고 가정해 봅시다.<br />

```html
<button class="button bg-red">Click Me</button>
```

```css
/* utilities 레이어가 components보다 나중에 선언되어 우선순위가 높음 */
@layer components, utilities;

@layer components {
  /* 명확도가 더 높음 (클래스 2개) */
  button.button {
    background-color: blue;
  }
}

@layer utilities {
  /* 명확도가 더 낮음 (클래스 1개) */
  .bg-red {
    background-color: red;
  }
}
```

기존의 명확도 규칙대로라면 `button.button` 셀렉터가 `.bg-red` 셀렉터보다 우선순위가 높아야 하는데요.<br />

하지만 `@layer`를 사용하면 결과는 완전히 달라집니다.<br />

`utilities` 레이어가 `components` 레이어보다 나중에 선언되었기 때문에 명확도와 상관없이 최종적으로 적용되는 건데요.<br />

이것이 바로 `@layer`가 '명확도 전쟁'을 끝냈다고 말하는 핵심 이유입니다.<br />

## 이것만은 꼭 주의하세요 @layer의 가장 큰 함정

`@layer`는 정말 강력하지만, 딱 한 가지 반드시 기억해야 할 치명적인 함정이 있는데요.<br />

바로 **'레이어에 속하지 않은 스타일은 모든 레이어에 속한 스타일보다 우선순위가 높다'**는 규칙입니다.<br />

이것이 왜 중요하냐면, 기존에 운영하던 프로젝트에 `@layer`를 점진적으로 도입할 때 예상치 못한 문제를 일으킬 수 있거든요.<br />

예를 들어, 기존 CSS 파일에 아래와 같은 스타일이 있었다고 해봅시다.<br />

```css
/* legacy.css - 레이어에 속하지 않은 기존 스타일 */
.button {
  background-color: gray;
}
```

그리고 새로운 기능 개발을 위해 `@layer`를 도입해서 버튼 스타일을 재정의했는데요.<br />

이때 다음과 같이 코드를 작성했습니다.<br />

```css
@layer components;

@layer components {
  .button {
    background-color: blue; /* 이 스타일이 적용되길 기대! */
  }
}
```

우리의 기대와는 달리, 버튼은 파란색이 아니라 여전히 회색으로 보일 텐데요.<br />

왜냐하면 `legacy.css`의 `.button` 스타일은 어떤 레이어에도 속해있지 않기 때문에, `components` 레이어에 속한 새로운 스타일보다 우선순위가 더 높아지는 겁니다.<br />

이 문제를 해결하려면 기존 스타일도 특정 레이어에 할당해주어야 하는데요.<br />

가장 낮은 우선순위의 레이어를 만들어 기존 스타일을 모두 넣어주는 것이 일반적인 해결책입니다.<br />

```css
/* 모든 레이어의 가장 앞에 legacy 레이어를 추가 */
@layer legacy, components, utilities;

/* 기존 스타일을 legacy 레이어로 가져오기 */
@import url('legacy.css') layer(legacy);

/* 이제 새로운 스타일이 정상적으로 우선순위를 가짐 */
@layer components {
  .button {
    background-color: blue;
  }
}
```

## Tailwind CSS는 @layer를 어떻게 활용할까

이런 `@layer`의 개념을 가장 적극적으로 활용하고 있는 것이 바로 Tailwind CSS인데요.<br />

Tailwind CSS v4부터는 공식적으로 Cascade Layers를 채택해서 스타일 시스템의 근간으로 삼고 있습니다.<br />

Tailwind의 레이어 구조는 보통 이렇게 정의되는데요.<br />

```css
@layer theme, base, components, utilities;
```

각 레이어의 역할은 다음과 같습니다.<br />

*   **base**: 브라우저 스타일을 초기화하는 리셋 규칙이나 `h1`, `p` 같은 기본 HTML 요소에 대한 스타일을 정의합니다.<br />
*   **components**: 버튼, 카드처럼 재사용 가능한 컴포넌트 클래스를 위한 레이어입니다.<br />
*   **utilities**: `.text-red-500`, `.p-4`처럼 단일 목적을 가진 유틸리티 클래스를 위한 곳으로, 다른 모든 스타일을 덮어쓸 수 있도록 가장 높은 우선순위를 가집니다.<br />

만약 여러분이 Tailwind CSS 프로젝트에 직접 작성한 CSS를 추가하고 싶다면, 이 레이어 구조를 이해하는 것이 아주 중요한데요.<br />

예를 들어, 기본 버튼 스타일을 직접 만들고 싶다면 `components` 레이어에 추가해야 유틸리티 클래스로 쉽게 커스터마이징할 수 있습니다.<br />

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn-primary {
    @apply py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md;
  }
}
```

이렇게 하면 `.btn-primary` 클래스를 사용하면서도, 필요에 따라 `<button class="btn-primary bg-red-500">`처럼 유틸리티 클래스로 색상을 덮어쓰는 것이 가능해집니다.<br />

## 정리하며

Cascade Layers, 즉 `@layer`가 어떻게 탄생했고 왜 필요했는지, 그 배경부터 차근차근 정리해보니 저 역시 개념이 훨씬 명확해지는 기분인데요.<br />

단순히 '새로운 CSS 기능'이라고만 알고 있었는데, 그 뒤에 숨겨진 CSS의 역사와 개발자들의 고민을 엿볼 수 있는 좋은 기회였습니다.<br />

CSS의 복잡성 때문에 명확도와 끝없는 싸움을 벌여왔던 우리에게 `@layer`는 분명 한 줄기 빛과 같은 존재인데요.<br />

이 글이 `@layer`에 대해 막연한 궁금증을 가졌던 분들에게 명쾌한 해답이 되었으면 좋겠습니다.<br />

읽어주셔서 감사합니다.<br />
