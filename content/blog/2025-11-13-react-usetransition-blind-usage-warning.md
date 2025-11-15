---
slug: 2025-11-13-react-usetransition-blind-usage-warning
title: "리액트 useTransition, 무작정 따라하다간 큰코다칩니다"
summary: "리액트 useTransition이 사용자 경험을 해치는 경우를 알아봅니다. 공식 문서 예제의 문제점을 분석하고, Delay 컴포넌트와 결합하여 UI 막힘 없이 더 나은 UX를 만드는 실용적인 방법을 제시합니다."
date: 2025-11-13T07:44:11.323Z
draft: false
weight: 50
tags: ["React", "useTransition", "사용자 경험", "UX", "렌더링 최적화", "동시성", "Delay 컴포넌트", "react"]
contributors: []
---

![리액트 useTransition, 무작정 따라하다간 큰코다칩니다](https://blogger.googleusercontent.com/img/a/AVvXsEhVLU_X-lQjMJ8rMF34RwnRDS9NkAeet1qMunCf0fezrA4i86BCfKLufwsWvfyg9No9VA6JeVp6GJIvdrMj4SM1y3q6uIg4sdidgp1DPr7aORillAu8xZJ2q74iCjk-ql93w25DfQXY4Il8I1SlZkvaqXrzNsRlhIKOYuPblbiS_7SW2iO-2534tN9wpEM=s16000)

최근 리액트(React)의 'useTransition' 훅에 대해 깊이 파고들고 있었는데요.

리액트 애플리케이션의 사용자 경험을 개선하는 데 이 훅이 얼마나 훌륭한지에 대한 글들을 계속해서 접했기 때문입니다.

특히 렌더링이 느린 컴포넌트를 다룰 때나 단순히 로딩 상태를 처리하는 용도로 상태 전환을 더 효과적으로 관리하기 위해 이 훅을 추천하는 글들을 많이 봤거든요.

그래서 자연스럽게 공식 문서를 자세히 살펴봤는데, 솔직히 말해서 예제가 사용자 경험 개선은커녕 끔찍한 사용자 경험처럼 보여서 실망하고 말았습니다.

오해하지는 말아주세요.

'useTransition'이 정말 놀라운 개선점이라는 데는 동의하는데요.

특히 라우팅 등에 영향을 미치는 라이브러리를 구축하는 경우엔 더욱 그렇습니다.

하지만 이걸 모든 곳에 사용하라고 추천하는 건 좀 아니라고 보거든요.

제가 혹시 놓치고 있는 미묘한 점이 있는 게 아니라면, 이 훅은 잘못 사용하기가 너무 쉬워 보입니다.

혹시 제가 놓친 부분이 있다면 꼭 댓글로 알려주세요.

이유를 이해하기 위해 몇 가지 예제를 단계별로 살펴보겠습니다.


## useTransition이 없을 때의 기본 예제
리액트(React) 공식 문서에서 가져온 기본 예제에서 'useTransition'을 제거해 봤는데요.

왜 이 훅이 필요한지 이해하기 위해서입니다.

이 예제에서는 간단한 탭 인터페이스가 어떻게 렌더링이 느린 콘텐츠가 포함된 탭 사이를 전환할 때 좋지 않은 사용자 경험으로 이어질 수 있는지 확인할 수 있습니다.

우선 'Posts (slow)' 탭을 클릭해도 UI에 아무런 피드백이 없는데요.

렌더링이 느린 콘텐츠가 전체 스레드를 막아버리기 때문입니다.

작업을 취소할 방법도 없어서 사용자는 콘텐츠가 로드될 때까지 꼼짝없이 기다려야만 하거든요.

만약 다른 것과 상호작용하거나 다른 탭으로 이동하고 싶다면 어떡할까요.

그리고 렌더링이 느린 탭으로 다시 이동할 때마다 여전히 느린 경험을 반복하게 됩니다.


```javascript
import { useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
const [tab, setTab] = useState('about');
return (
<>
<TabButton isActive={tab === 'about'} action={() => setTab('about')}>
About
</TabButton>
<TabButton isActive={tab === 'posts'} action={() => setTab('posts')}>
Posts (slow)
</TabButton>
<TabButton isActive={tab === 'contact'} action={() => setTab('contact')}>
Contact
</TabButton>
<hr />
{tab === 'about' && <AboutTab />}
{tab === 'posts' && <PostsTab />}
{tab === 'contact' && <ContactTab />}
</>
);
}
```

이제 리액트(React) 공식 문서에서 가져온 다른 예제를 통해 탭 인터페이스에서 'useTransition'이 어떻게 사용되었는지 살펴보겠습니다.

부모 컴포넌트가 액션 내부에서 상태를 업데이트하기 때문에, 이 상태 업데이트는 '전환(transition)'으로 표시되는데요.

이 덕분에 'Posts'를 클릭한 직후 바로 'Contact'를 클릭할 수 있고, 사용자 상호작용이 전혀 막히지 않습니다.

또한 'useTransition'이 반환하는 'isPending' 불리언 값을 사용하여 전환이 진행 중임을 사용자에게 알릴 수 있거든요.

예를 들어, 탭 버튼에 특별한 'pending' 시각적 상태를 추가할 수 있습니다.

이제 'Posts'를 클릭하면 탭 버튼 자체가 즉시 업데이트되기 때문에 훨씬 더 반응이 빠른 것처럼 느껴지는데요.

이것이 바로 'useTransition'의 효과입니다.


```javascript
import { useTransition } from 'react';

export default function TabButton({ action, children, isActive }) {
const [isPending, startTransition] = useTransition();
if (isActive) {
return <b>{children}</b>;
}
if (isPending) {
return <b className="pending">{children}</b>;
}
return (
<button
onClick={() => {
startTransition(async () => {
await action();
});
}}
>
{children}
</button>
);
}
```

'useTransition'을 사용하면 렌더링 도중에 빠져나올 수 있다는 점은 정말 유용하다고 생각하는데요.

예를 들어, 누군가 실수로 'Posts' 탭을 클릭했더라도 앱은 여전히 반응성을 유지하므로 다른 곳으로 이동할 수 있습니다.

하지만 'isPending'을 사용하는 경험이 썩 훌륭하지 않기 때문에 전체적으로는 별로라고 생각합니다.

'isPending' 상태는 우리가 방금 클릭한 탭이 대기 중이고 무언가 일어나고 있다는 것을 알려주지만, 이전 탭이 여전히 활성 상태로 간주되고 이전 탭의 콘텐츠가 계속 보인다는 문제가 있거든요.

이건 제게 훌륭한 사용자 경험처럼 느껴지지 않습니다.

제가 여기서 정말로 선호하는 방식은 탭 컴포넌트의 렌더링을 막지 않고 높은 우선순위로 업데이트한 다음, 이어서 콘텐츠를 렌더링하는 것입니다.

또 다른 문제점은 이게 네비게이션의 일부라면 사용자 경험이 여전히 좋지 않다는 점인데요.

'Posts' 탭으로 돌아올 때마다 매번 느린 로딩을 경험해야 하기 때문입니다.

브라우저가 유휴 상태일 때 백그라운드에서 렌더링하거나, 캐시하거나, 혹은 렌더링 된 상태를 숨겨두는 방식이 더 나았을 겁니다.

이건 잠시 후에 다룰 `<Activity>` 컴포넌트를 생각하시면 됩니다.

라우팅 라이브러리나 그것이 꼭 필요한 무언가를 만들고 있는 게 아니라면, 제가 블로그 글에서 계속 보아온 것처럼 왜 이걸 모든 곳에 사용해야 하는지 잘 모르겠거든요.

설령 그런 경우라 하더라도, 어떻게 사용하는지에 대해서는 신중해야 한다고 생각합니다.

전환을 실행하면 두 번의 렌더링이 예약되거든요.

하나는 이전 상태 값으로 보류 상태('isPending = true')를 보여주기 위한 긴급 렌더링이고, 다른 하나는 'isPending = false'와 새로운 상태 값을 사용한 동시성 렌더링입니다.

이 두 번째 렌더링이 완료되면 화면에 반영되는 거죠.

이것이 바로 우리 예제에서 비용이 많이 드는 탭을 메모이제이션하는 것이 아주 중요한 이유입니다.

입력(input) 업데이트는 상태를 동기적으로 업데이트해야 하므로 'Transition'으로 감쌀 수 없다는 사실, 알고 계셨나요.

전환은 논블로킹(non-blocking) 방식이라 사용자 입력을 즉시 반영해야 하는 제어된 입력(controlled inputs)에는 적합하지 않습니다.

모든 상태 업데이트를 감싸면 버튼 클릭이나 입력 업데이트 같은 긴급한 UI 피드백마저 지연시켜 경험을 저하시킬 수 있는데요.

오직 중요하지 않고 비용이 많이 드는 업데이트에만 전환을 사용해야 합니다.

만약 탭 상태에만 집중한다면, 더 나은 사용자 경험을 달성하는 한 가지 방법은 탭 콘텐츠 렌더링이 리액트에게 제어권을 양보하도록 해서 탭 상태를 중요한 업데이트로 처리하는 것입니다.

'useTransition'이 없는 기본 예제로 다시 돌아가서, 탭 콘텐츠의 렌더링을 다음 이벤트 루프까지 지연시키는 `<Delay>` 컴포넌트에 의존하는 방법을 생각해 볼 수 있는데요.

이건 사실상 첫 렌더링을 건너뛰는 것과 같습니다.


```javascript
import { useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';
import Delay from "./Delay.js";

export default function TabContainer() {
const [tab, setTab] = useState('about');
return (
<>
<TabButton isActive={tab === 'about'} action={() => setTab('about')}>
About
</TabButton>
<TabButton isActive={tab === 'posts'} action={() => setTab('posts')}>
Posts (slow)
</TabButton>
<TabButton isActive={tab === 'contact'} action={() => setTab('contact')}>
Contact
</TabButton>
<hr />
{tab === 'about' && <AboutTab />}
{tab === "posts" && (
<Delay>
<PostsTab />
</Delay>
)}
{tab === 'contact' && <ContactTab />}
</>
);
}
```

`<Delay>`를 사용함으로써 메인 스레드에 제어권을 넘겨주어 탭이 먼저 업데이트된 후 콘텐츠를 렌더링할 수 있게 되었는데요.

제 생각에는 이게 훨씬 더 나은 사용자 경험을 제공합니다.

하지만 여기서 또 문제가 발생하거든요.

렌더링을 중단할 수 있는 기능을 잃어버렸기 때문입니다.

'Posts' 탭을 클릭하면 앱이 멈추는데, 이것 또한 훌륭한 사용자 경험은 아니거든요.

보세요, 바로 이 지점이 우리가 여러 선택지를 평가하고 마침내 'useTransition'을 선택할 수 있는 순간입니다.

하지만 이번에는 더 나은 제어권을 가지고서 말이죠.

자, 그럼 이제 `<Delay>`와 'useTransition'을 결합하여 두 세계의 장점을 모두 취하는 예제를 살펴보겠습니다.

이 예제에서 `<Delay>`는 전환을 시작하여, 콘텐츠를 렌더링하기 전에 탭이 먼저 업데이트되도록 하는데요.

보너스로, `<Delay>`가 전환을 시작하기 때문에 이제 우리는 'isPending'을 (이번에는 올바른 컨텍스트에서) 자유롭게 사용하여 로딩 상태를 콘텐츠 내부에 직접 렌더링할 수 있습니다.

우리가 달성하려는 목표와 우선순위를 다시 한번 정리해 볼까요.

가장 중요한 업데이트는 '탭'인데요.

훌륭한 사용자 경험을 위해 즉시 업데이트되어야 합니다.

다음으로 높은 우선순위는 'Posts 컨테이너'거든요.

사용자를 혼란스럽게 하지 않도록 이전 콘텐츠를 제거하고 새 콘텐츠를 위한 공간을 마련해야 합니다.

마지막으로 낮은 우선순위는 'Posts 콘텐츠'인데요.

이것이 바로 우리가 전환을 정말로 필요로 하는, 실제 백그라운드 렌더링 작업입니다.


```javascript
import { useEffect, useState, useTransition } from "react";

export default function Delay({ delay, children }) {
const [isPending, startTransition] = useTransition();
const [shouldRender, setShouldRender] = useState(false);

useEffect(() => {
setShouldRender(false);

const timeout = setTimeout(() => {
startTransition(() => { // <- 마법이 일어나는 곳입니다
setShouldRender(true);
});
}, delay);

return () => {
clearTimeout(timeout);
};
}, [delay]);

// 이제 올바른 컨텍스트에서 isPending을 자유롭게 사용할 수도 있습니다!
if (isPending) {
return <p>Loading...</p>;
}

if (!shouldRender) {
return null;
}

return <>{children}</>;

}
```

어떤가요, 리액트 공식 문서의 예제보다 훨씬 더 나은 사용자 경험을 제공하는 방법이지 않나요? 🙂

`<Activity>`를 사용하여 이를 더 개선할 방법도 있는데요.

이 컴포넌트는 자식 요소의 UI와 내부 상태를 숨겼다가 복원할 수 있게 해줍니다.

이를 사용하여 'Posts'의 콘텐츠를 미리 로드하거나, 혹은 적시에 렌더링하도록 할 수도 있는데요.

렌더링 비용이 비싸기 때문에 `<Activity>`를 통해 탭을 마운트된 상태로 유지하되 숨겨두는 것입니다.

이 블로그 글이 이미 충분히 길어졌고 `<Activity>`만으로도 별도의 글을 쓸 수 있기 때문에 더 자세한 내용은 다루지 않겠습니다.

우선은 `<Activity>`에 대한 리액트 공식 문서를 참고해 주시고, 추후에 관련 내용으로 다시 찾아뵙겠습니다.

