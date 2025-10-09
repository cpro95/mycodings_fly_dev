---
slug: 2023-12-25-react-framework-debate-nextjs-vs-remix-by-kentcdodds-and-leerob
title: kentcdodds님과 leerob님의 리액트 프레임 워크 논쟁 - Next.js vs Remix
date: 2023-12-25 05:53:06.952000+00:00
summary: kentcdodds님과 leerob님의 리액트 프레임 워크 논쟁 - Next.js vs Remix
tags: ["next.js", "remix", "react"]
contributors: []
draft: false
---

안녕하세요?

오늘은 React의 두 거장 [Kent C. Dodds](https://twitter.com/kentcdodds)님과 [Lee Robinson](https://twitter.com/leeerob)님이 각자 가지 블로그에 쓴 글을 읽어 보면서 느낀점을 말해 볼까 합니다.

먼저, Kent C. Dodds님이 쓴 글이 있는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEj9AX9S-4MKE4gnHBlvVoIJsad001xA-lvRqnFhw5Th01xGDm4uPzqeiRpfiDqIFVlx7fUCDoCx8-FN_c3nyzkHzYTbQvxB-o6ccuaPwTdoaGe_aO47DnIhpdBWjD97AL-qcDdEHJDirsGHAyz7Yj0gt4Wno1uHRewghgwUmb4fSdME4Ku3tNbAIbGRhDA)

[Why I Won't Use Next.js](https://www.epicweb.dev/why-i-wont-use-nextjs)

이글의 Twitter 링크는 [여기](https://twitter.com/kentcdodds/status/1717274167123526055?ref_src=twsrc%5Etfw%7Ctwcamp%5Etweetembed%7Ctwterm%5E1717274167123526055%7Ctwgr%5E52c5cbe7015d8bfab9cd0e7ee3a968d38e4aa5a5%7Ctwcon%5Es1_c10)입니다.

이 글에 대해 Lee Robinson님이 반박한 글을 자기 블로그에 올렸습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgDMtFZKWrcnlW-MzI3ncfXw5OWUtJTWopXkeQ67qbfAXLGfISzwJHCr_Llfx6uB1gAylKxV3toK1oQnR0xL_DVv2AeKVbIvPK2KQGkmxP9esM6wkUbFkVj1-85Ff0rMTeGORtpKvmygAtVXmiapDgb5iKQPE8DpMcZeylOyqg7UnonT-_q6NUcHKsryRo)

[Why I'm Using Next.js](https://leerob.io/blog/using-nextjs)

이 글의 Twitter 링크는 [여기](https://twitter.com/leeerob/status/1718023238238781826?ref_src=twsrc%5Etfw%7Ctwcamp%5Etweetembed%7Ctwterm%5E1718023238238781826%7Ctwgr%5E78cdae8e1d37acfac36ba191ce506724dbee230f%7Ctwcon%5Es1_c10)입니다.

** 목 차 *

1. [The Web Platform](#1-the-web-platform)

2. [Independence (Vercel과의 유착)](#2-independence-vercel과의-유착)

3. [Next.js is eating React](#3-nextjs-is-eating-react)

4. [Experimenting on my users](#4-experimenting-on-my-users)

5. [Too much magic](#5-too-much-magic)

6. [Complexity](#6-complexity)

7. [Stability](#7-stability)

8. [마무리](#8-마무리)

---

## 1. The Web Platform

kentcdodds 님의 말:

> Next.js는 웹 표준 API를 랩핑하고 있으며, Next.js 고유의 API 사용을 강제합니다.
>Testing Library가 등장하기 전의 Enzyme와 같은 위치에 있으며, Next.js에서 배운 지식은 이식성이 없습니다.

> Remix는 Request, Response 등 웹 표준 API를 적절하게 제공합니다.

leerob 님의 말:

> Next.js는 Remix보다 오래된 역사를 가지고 있으며, Pages Router 등 과거의 기능에 대해서는 웹 표준 API보다는 Node.js의 API에 가깝습니다.
> 그러나 2021년 Next.js도 Middleware에서 웹 API를 지원하기 시작했습니다.

> 더 나아가 Route Handlers에서는 Request, Response뿐만 아니라 cookies()나 headers()와 같이 추상화하여 더 사용하기 쉽게 만든 기능도 제공합니다.
> Next.js는 Remix와 같은 다른 프레임워크와 마찬가지로 웹 API를 중요시합니다.


제 사견:

> 여기서는 leerob의 반박이 타당하다고 느껴집니다.
> cookies()가 인수로 Request를 가져오지 않는 것은 약간 이상하지만, https://pilcrow.vercel.app/blog/nextjs-why에서 언급한 것처럼 API 설계의 일관성이 느껴질 수 있었고,

> Next.js가 웹 API를 이제 중요시하기 시작했다는 것은 알 수 있습니다.
> entcdodds는 Next.js에 대한 예전 인식을 기반으로 말하고 있는 것 같습니다.

---


## 2. Independence (Vercel과의 유착)

kentcdodds 님의 말:

> Next.js를 Vercel 이외의 다른 곳에서 사용하는 것이 쉽지 않다고 말합니다.
> Next.js와 Vercel은 거의 일체형이며, Vercel 이외의 곳에서 Next.js를 배포하면 문서에 나와 있는 대로 작동하기 어려울 것입니다.
> 이에 따라 OpenNext라는 프로젝트가 등장했습니다.

> Vercel은 자사의 호스팅 플랫폼을 홍보하고자 하므로 다른 곳에서 배포하기 쉽게 만드는 인센티브가 없을 것입니다.
> JavaScript가 작동하는 플랫폼이라면 Remix를 사용하여 어디에서든 배포할 수 있습니다.

leerob 님의 말:

> Next.js를 Docker로 셀프 호스팅하는 방법에 대한 동영상과 코드 예제를 공개하고 있다.
> 많은 유명 기업들이 'next start' 명령어를 통해 Next.js를 실행하고 있다는 사실을 알아야 한다.
> Vercel은 Framework-defined infrastructure (FdI)라는 비전을 제시하고 있다.

> 여기에는 개발자가 프레임워크를 실행하기 위한 IaC(Infrastructure as Code)를 직접 정의하는 것이 아니라, 프레임워크의 각 구성 요소가 자동으로 생성된 IaC를 통해 인프라 요소로 매핑되고 배포되는 것이 포함되어 있다.
> 그리고 Vercel 플랫폼에서의 매핑 사양은 Build Output API를 통해 공개되어 있으며, Next.js는 물론 Remix나 Astro와 같은 다른 프레임워크의 Vercel 어댑터도 이 사양에 따라 빌드를 출력합니다.
> 이러한 방식으로 프레임워크는 자체 기능 개발에 집중하고, 인프라는 프레임워크를 자체 요소로 매핑하는 통합 메커니즘을 준비함으로써 두 요소의 공존을 이상적으로 만들고 있으며, 이에 따라 Next.js 어댑터를 다른 서버리스 환경에 공식적으로 제공하지 않고 있습니다.

> Vercel이 수익을 창출하려고 Vercel에서 벗어날 수 없게 만드는 것은 잘못된 것입니다.
> 앞서 언급한 대로 Next.js를 다른 플랫폼에서 셀프 호스팅하는 것은 쉽습니다.
> Vercel에서 호스팅하는 사용자가 늘어난다면 Vercel은 수익을 창출할 수 있지만, 이를 위해 Vercel 이외의 플랫폼에서 배포를 어렵게 만드는 것이 아니라, Vercel이 극도로 우수한 인프라의 추상화이며, 그 결과 단순히 배포가 쉬울 뿐입니다.

제 사견:

> 여기서의 leerob의 논의는 다소 하이컨텍스트이며, 약간 뚝심 없는 느낌을 줍니다.
> 결국 자금 문제나 서비스의 인프라 구성 등 다양한 이유로 Vercel 이외에서 Next.js를 실행하고 싶어 하는 수요가 있으며, 단순히 컨테이너에서 실행하는 것만으로는 Next.js의 다양한 기능을 제대로 활용할 수 없다는 사실은 사실입니다.

> 그래서 "(컨테이너를 사용하면) 어디에서나 잘 작동합니다"와 같은 조금 벗어난 주장만으로는 만족시키기 어려울 것으로 생각됩니다.
> 그러나 반면에 공식으로 여러 인프라에 대한 어댑터를 유지하는 것은 어렵다는 점도 이해할 수 있습니다.

> 또한, 예를 들어 https://twitter.com/thdxr/status/1718308244383228124 에서 언급된 애플리케이션과 API의 버전 관리 일관성 유지와 같은 고민은 Next.js가 아니더라도 어렵다는 점도 이해할 수 있으며, Vercel이 이러한 어려움을 잘 해결하고 있다는 의견도 이해할 수 있습니다 (간단히 말하면 Vercel은 플랫폼으로서 편안하다는 것이죠).

---

## 3. Next.js is eating React

kentcdodds 님의 말:

> Next.js가 React를 흡수하고 있으며, 두 기술의 경계가 점점 흐려지고 있습니다.
> 많은 React 팀원들이 Vercel로 이직했지만, 이로 인해 React 팀은 더 이상 협력적이지 않아졌습니다.

> Redwood와 Apollo의 유지 보수자들도 비슷한 불만을 토로하고 있습니다.
> 비협력적인 팀은 소프트웨어에 대한 좋지 않은 징후입니다.

> 최근 React 문서에서 useFormStatus와 tainting과 관련된 기술 용어가 등장하면서, React API가 Next.js에서 사용되고 있다는 관계가 명확해졌습니다.
> 두 기술의 경계가 약간 흐려졌다는 것은 인정하지만, 의도한 것은 아니며 앞으로는 경계를 더욱 명확하게 하기 위해 노력할 것입니다.

leerob 님의 말:

> 저도 두 기술의 경계가 흐려지고 있다는 느낌을 가지고 있습니다.
> 예를 들어 Server Actions에 대해서는 이 글을 보기 전까지 Next.js의 기능이라고 오해하고 있었습니다.

제 사견:

> 저도 kentcdodds와 마찬가지로 양측의 경계가 모호해지고 있다는 애매한 느낌을 가지고 있으며, 예를 들어 Server Actions에 대해서는 이 트윗을 보기 전까지 Next.js의 기능으로 오해하고 있었습니다.
> leerob도 이 점을 인정하고 있을 것으로 생각되므로 향후 개선에 기대하고 싶습니다.

> 반면, React 팀이 비협력적이라는 의견에 대해서는 객관적인 증거도 없이 kentcdodds의 주관적인 생각으로만 판단할 수밖에 없습니다.
> 그러나 같은 생각을 가진 개발자들이 다른 곳에도 있다는 것은 사실이므로, React 팀의 답변도 기대됩니다.

---

## 4. Experimenting on my users

kentcdodds 님의 말:

> Next.js는 안정 버전으로서 React의 카나리아 버전 기능을 자체적으로 통합하고 있습니다.
> 이로 인해 사용자의 애플리케이션은 불안정한 실험대가 되고 있습니다.
> App Router에서 고생하는 사람들이 많은 것으로 보입니다.

> 안정적인 React 기능만 포함된 Remix를 사용합시다.
> RSC는 안정화된 후에 사용하면 됩니다.

leerob 님의 말:

> React 블로그 게시물에서는 프레임워크가 카나리아 버전의 기능을 채택하는 것에 대해 어떠한 문제도 없다고 밝혔습니다.

> App Router에 대한 개선 사항이 많이 있지만, 이는 카나리아 버전이 나쁜 것이 아니라 우리의 구현 문제입니다.
> RSC는 이미 많은 최상위 사이트에서 채택되어 있으며, 충분히 production ready라고 할 수 있습니다.

제 사견:

> React 측의 블로그 게시물을 읽어보면, leerob의 주장처럼, 카나리아 버전을 사용하는 것 자체는 React 팀의 의도에 따라 문제가 없어 보입니다.
> RSC를 사용하는 최상위 사이트가 많다는 것은 RSC가 안정적이라는 것을 증명하는 근거로는 약하지만, "안정"이라는 단어를 정의한 후에 직접적으로 안정적이라는 것을 증명해주기를 바랍니다.

> 그러나 kentcdodds가 약간 모호한 말을 한 것처럼, 제가 할 수 있는 것은 약간 모호한 답변뿐입니다.
> 또한, 사용자로서 실험 중이라는 것은 분명히 과장된 말이며, 이는 약간의 인상 조작이 지나친 것 같습니다.

---



## 5. Too much magic

kentcdodds 님의 말:

> Next.js는 글로벌 fetch를 오버라이드하고 캐시 기능을 추가하는 등 사용자가 예측할 수 없는 기능을 많이 추가합니다.
> 이러한 예측할 수 없는 기능이 더 있는지 의심하게 됩니다.

> 써프라이즈 최소화 원칙에 따라 설계된 Remix를 사용하여 선택적으로 마법을 사용할 수 있습니다."

leerob 님의 말:

> fetch에 대해서는 그렇게 말할 수 있습니다.
> 커뮤니티의 피드백을 바탕으로 개선 방향성을 결정하고 싶습니다.

제 사견:

> 여기서 leerob는 kentcdodds의 주장의 정확성을 솔직하게 인정하는 것처럼 보입니다.

> Next.js 외에도 React 자체도 fetch를 확장해 버렸기 때문에 어디에서 끝나는지 모르겠지만, 관련된 토론 등은 https://github.com/vercel/next.js/discussions/54075와 같은 곳에서 참조할 수 있습니다.

---

## 6. Complexity

kentcdodds 님의 말:

> Next.js는 점점 복잡해지고 있습니다.
> React의 Server Actions는 양식을 POST로 변경하지만 이러한 세마틱스의 변경은 복잡도를 증가시킵니다.

> 이러한 API를 그대로 채택하여 복잡도 증가에 가담하려는 Next.js 대신, 복잡도를 최소한으로 유지하면서 API를 설계한 Remix를 사용하세요.

leerob 님의 말:

> App Router는 Pges Router와 다른 모델이며, 거의 새로운 프레임워크라고 할 수 있습니다.
> 새로운 튜토리얼을 제공하는 학습 장소로서 역할을 하고 있습니다.

제 사견:

> leerob은 "복잡하지 않다"는 것을 명확하게 부정해야 하며, 튜토리얼을 소개하는 것만으로는 반박되지 않습니다(여기서도 "복잡"이라는 단어의 정의가 없기 때문에 직접적인 반박이 어려울 수 있습니다).

> 또한 kentcdodds가 언급한 양식의 세마틱스 변경 등의 사항에 대해서는 명확한 이유나 반박을 제시하지 않으면 fetch할 때와 비슷한 불안감을 느낄 수 있습니다.

---

## 7. Stability

kentcdodds 님의 말:

> Next.js는 메이저 버전 업데이트를 계속 진행하고 있으며, 안정성에 대한 고려가 부족합니다.

> Remix는 2년 가까이 버전 1을 유지하고 있으며, 한 달 전에 릴리스된 버전 2는 그 안정성 때문에 '웹 프레임워크 역사상 가장 지루한 메이저 버전 업데이트'가 되었습니다.
> 안정성을 중요시한다면 Remix를 사용하세요.

leerob 님의 말:

> 메이저 버전의 수와 프레임워크의 안정성은 아무런 관련이 없습니다.
> Next.js는 적절한 codemods와 업그레이드 가이드를 제공하기 때문에, 염려할 만한 버전 업그레이드와 관련된 불안은 작을 것입니다.

제 사견:

> kentcdodds의 주장에는 설득력이 없어 보입니다.
> 이전 Next.js의 메이저 버전 업그레이드에서 발생한 문제점을 구체적으로 언급하지 않았기 때문입니다.
> 버전 번호의 크기를 불안정성의 증거로 논의하는 것은 웃음을 참기 어렵습니다.

---

## 8. 마무리

전반적으로 kentcdodds의 의견은 근거가 약한 부분이 많았고, leerob가 성의 있게 응답하고 있는 것으로 보였습니다.

특히, fetch에 대해 솔직하게 잘못을 인정한 부분은 적절한 대응이라고 생각합니다.

그러나 Vercel 이외의 곳에 배포하는 어려움에 관한 논의 등 일부 응답은 여전히 명확하지 않은 부분이 남아 있습니다.

여기에서는 kentcdodds의 Next.js에 대한 부정적인 의견과 그에 대한 leerob의 응답을 요약했지만, 약간의 부정적인 분위기 때문에 마지막으로 leerob의 블로그 글 끝에 쓰여진, 그가 Next.js를 사용하는 이유에 대한 긍정적인 내용을 인용하여 마무리하려 합니다:

> 나는 만들고 싶은 프로젝트 전체를 Next.js로 구축할 수 있어서 프로젝트 백엔드를 별도로 만들 필요가 없습니다.
> 번들러, 컴파일러 또는 프론트엔드 인프라에 대해 걱정할 필요가 없습니다.
> React 컴포넌트를 사용하여 훌륭한 제품을 만드는 데 집중할 수 있습니다.

> 그리고 최신 React 기능을 사용할 수 있어 개발 경험이 훌륭합니다.
> Next.js를 최신 버전으로 업데이트하면 항상 무엇인가 개선되고 성능이 향상되며 새로운 기능이 추가됩니다.

> 이터레이션 속도가 높고 변경이 있을 경우 codemods와 업그레이드 가이드가 제공됩니다.
> Next.js는 사이트를 빠르게 유지하는 데 도움이 되는 다양한 컴포넌트를 제공합니다.
> 이미지, 폰트, 스크립트, 심지어 적절한 써드파티 로딩까지 지원합니다.
