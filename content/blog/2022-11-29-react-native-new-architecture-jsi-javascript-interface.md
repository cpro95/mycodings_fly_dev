---
slug: 2022-11-29-react-native-new-architecture-jsi-javascript-interface
title: React Native 새 아키텍처인 JSI (Javascript Interface) 알아보기
date: 2022-11-29 10:52:32.001000+00:00
summary: React Native 새 아키텍처인 JSI (Javascript Interface) 알아보기
tags: ["react native", "jsi", "javascript interface"]
contributors: []
draft: false
---

![](https://blogger.googleusercontent.com/img/a/AVvXsEhIR6Ds9AwqnVjp9U4jMAPLiWJkC10EtQCOjLP12pKsUHDVJgI7QP2UAmrVhdReDK5489C0zIOrQRw_F5ehf7K8uCYi2PSNPcoPSfUqVp9HBAZsqdmPGaspyrShgFtvDGUTRcyD4pZ-1hJNsxgLgBzF9IquH2ISTs4ErfwUvQ09TvreWBrSe-5F9HKJ=w640-h420)

안녕하세요?

오늘은 React Native가 새로운 변신을 꾀하고 있는 New Architecture인 JSI (Javascript Interface)에 대해 잠깐이나마 알아보려고 합니다.

리액트 네이티브는 크로스 플랫폼, OTA 업데이트, 라이브 리 로드(Reload) 등 여러 가지 좋은 점을 다 가지고 있는데 한 가지 단점이 앱 성능에서 큰 발목을 잡고 있는데요.

바로 자바스크립트와 네이티브 모듈 간 통신에 있어 브리지(Bridge)에서 과부하가 자주 걸린다는 겁니다.

리액트 네이티브 코드에 모듈을 추가 확장할수록 더 과부하가 생기는데요.

왜냐하면 브리지의 특성상 어쩔 수 없는 현상입니다.

그럼 리액트 네이티브 아키텍처가 어떻게 구성되어서 이런 단점이 생기는지 간단히 살펴보겠습니다.

먼저, 예전의 리액트 네이티브는 세 개의 쓰레드로 구성됩니다.

1. UI thread

2. Shadow thread

3. JS thread

첫 번째, UI 쓰레드는 메인 애플리케이션으로 안드로이드와 IOS에서 View를 렌더링 하는 쓰레드입니다.

두 번째, Shadow 쓰레드는 백그라운드 쓰레드로 렌더링 하기 전에 Yoga 패키지를 이용하여 각 요소의 레이아웃을 계산하는 쓰레드입니다.

세 번째, JS 쓰레드는 말 그대로 리액트 네이티브 로직을 담당하는 쓰레드로, 최종적으로 번들링 된 자바스크립트 코드를 실행하는 쓰레드입니다.

이 세 개의 쓰레드간 통신은 직접적으로 이루어지지 않고 브리지(Bridge)를 통해 이루어지는데, 이 브리지를 통할 때 데이터가 JSON 형태로 이동되는데, 시리얼라이제이션(serialisation)과 디시리얼라이제이션(deserialisation) 같은 다소 무거운 작업을 통해 이루어집니다.

브리지를 통한 JSON 형태의 데이터 전송은 불필요한 데이터 카피가 발생하고 비동기식으로 작업이 이루어져서 브리지가 혼잡해지는 걸 극복할 수 없는 치명적인 단점이 있습니다.

또, 데이터 처리에 있어 강력한 타이핑(typing)을 쓰는 게 아니라 느슨한 타이핑을 써 문제가 발생할 수도 있고요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgC2FFiJGm7E-NAt7myhmbSCn2L1Tdc7Nkm15cRU8ClPbGvFRt3Qw2QI0Cp9adEspUncJdmiSj-4kSj9fH52mU0LnA4OiY8z_PNZncvt2GlSp4ts5Jx5JtgMi1SxxBCFSCeMQTnluIwI45WrM1hDtiHuNNWAhX6Z9AdjAmtub4n0CxSQwADGs1BfA9K=w640-h356)

위 그림은 예전 아키텍처의 구성도입니다.

결론적으로 현재의 리액트 네이티브 아키텍처의 문제점은,

1. 자바스크립트와 네이티브 쪽이 서로 직접 연결될 수 없고, 또 비동기식 JSON 메시지에 의존하고 있습니다.

2. 모듈이 앱 첫 실행에 모두 로드되는데 이건 앱의 초기 구동 성능에 악영향을 끼칩니다.

3. 유저의 터치에 대한 반응이 우선순위를 두고 처리되지 않고 진행되어 느립니다.

4. 브리지가 시리얼라이제이션 돼서 느립니다.

5. UI 요소에 디렉트로 JS 쓰레드가 접근할 수 없습니다.

<hr />
### 리액트 네이티브의 새 아키텍처 : JSI (Javascript Interface)

![](https://blogger.googleusercontent.com/img/a/AVvXsEiGDyz_r4EjylNwXZ6OdL3Bg1rhZJDm__g2BtpXUi-93ofOsBtcNb0caFGyNO_7xGsrz2ImVpiW6doZWxO22UfhG124mt2iWRJ8j-ecyVJM22HGoLNo21QUxRj7j5P46iq5TBU966FBOUWz81OqQMI18qp0joxe080_dwNz9qW70cUlQerDyqe-Fi1P=w640-h316)

리액트 네이티브 개발팀이 새로운 아키텍처를 도입하고 있는데요.

바로 JSI (JavaScript Interface)입니다.

이게 어떤 건지 살펴볼까요?

JSI가 가져온 가장 큰 변화는 자바스크립트와 네이티브 파트가 직접 상호 작용한다는 점입니다.

즉, JS와 C++ 간에 인터페이스를 이용해서 상호 간 직접 커뮤니케이션한다는 얘기인데요.

자바스크립트는 호스트 쪽 객체의 레퍼런스를 직접 가질 수 있고 호스트 쪽 메소드도 직접 호출할 수 있습니다.

결론적으로 네이티브 쪽 객체를 자바스크립트 콘텍스트 안에서 사용할 수 있다는 점인데요.

기존 아키텍처의 가장 큰 병목 지점이었던 게 바로 JSI로 인해 해결이 되었습니다.

그리고 JSI가 상호 작용하는 네이티브 쪽은 두 가지가 있는데요.

Fabric과 Turbo Modules가 있습니다.

먼저, Fabric에 대해 알아보자면,

Fabric는 페이스북이 C++ 언어를 이용해서 새로 만든 렌더링 시스템인데요.

기존 렌더링 시스템과는 다르게 UI 매니저가 직접 Shadow Tree를 C++안에서 만들 수 있습니다.

그래서 예전보다 조금은 빨라졌고요,

그리고 동기식 작업과 쓰레드 세이프 방식으로 자바스크립트가 렌더러(C++)를 실행시킬 수 있습니다.

JSI를 통해 자바스크립트 변수를 직접 호출할 수 있어 예전 브리지의 데이터 시리얼라이제이션이 훨씬 줄어드는 효과가 있고,

또, 유저 행동에 우선순위를 두어 대응할 수 있습니다.

두 번째, Turbo Modules는 레이지(lazy) 로드가 핵심인데요.

예전에는 네이티브 모듈에 대한 레퍼런스가 없어 모듈을 첫 실행에 무조건 다 로드했었는데요,

Turbo Modules를 사용하면 필요할 때 로드할 수 있어 전체적인 앱 반응 속도가 상당히 빨라집니다.

그러면 JSI를 가능케 하는 로직이 뭘 까요?

바로 페이스북 팀이 만든 Codegen 인데요.

Codegen이 자바스크립트와 네이티브 사이드 쪽의 타입 체커를 자동으로 해줍니다.

자바스크립트에서 타입을 정확히 지정하면 Codegen에 의해 타입 체커가 되면서 Fabric과 Turbo Modules쪽으로 메시지를 전달하는데,

이때 Codegen 타입 체커에 의해 정확한 타입이 전달됩니다.

그래서 새 아키텍처에서는 자바스크립트 코드에서 any 타입을 쓸 수 없습니다.

결론적으로 JSI의 장점은

1. 자바스크립트 코드가 네이티브 UI 요소의 레퍼런스를 가질 수 있고 메소드도 직접 호출할 수 있음.

2. 네이티브 코드에 직접 바인딩 되어 속도가 향상됨.

3. JavaScript Core 엔진 말고 다른 엔진도 사용 가능, 실제 Hermes 엔진을 사용하고 있음.

4. 네이티브 모듈을 처음에 모두 다 로드하지 않고 필요할 때 로드하는 방식.

5. 정적 타입 체킹으로 자바스크립트와 네이티브 코드 간 호환성 강화.

결론적으로 JSI는 아직은 실험단계이지만 안정화되고 나면 리액트 네이티브의 속도가 비약적으로 빨라질 것으로 예상됩니다.

그럼.
