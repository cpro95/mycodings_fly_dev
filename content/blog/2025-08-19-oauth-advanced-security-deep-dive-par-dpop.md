---
slug: 2025-08-19-oauth-advanced-security-deep-dive-par-dpop
title: NDC Oslo 2025 - 아직도 Bearer 토큰 쓰세요? OAuth 보안을 슈퍼차징하는 고급 기술 총정리
date: 2025-08-21 14:10:03.647000+00:00
summary: OAuth는 안전할까요? 이 강연은 그 질문에 대한 완벽한 답을 제시합니다. Resource Indicators부터 PAR, DPoP까지, 여러분의 OAuth 아키텍처를 한 단계 업그레이드할 최신 보안 기술들을 깊이 있게 파헤쳐 봅니다.
tags: ["OAuth", "OAuth 2.0", "보안", "PAR", "DPoP", "인증"]
contributors: []
draft: false
---

![](https://img.youtube.com/vi/eT0UUdfsdE4/maxresdefault.jpg)
[NDC Oslo 2025 유튜브 링크](https://www.youtube.com/watch?v=eT0UUdfsdE4)

안녕하세요, 오늘은 보안 관련해서 아주 흥미로운 강연을 하나 발견해서 내용을 공유해볼까 합니다.<br /><br />해당 강연은 위 링크에 있는데요, 이 강연의 핵심만 전체적으로 살펴볼까 합니다. 바로 OAuth 보안을 한 단계 끌어올리는 고급 기술들에 대한 이야기인데, 현업에서 바로 적용해 볼 만한 내용들이 많더라고요.<br /><br />발표자는 OAuth가 금융이나 헬스케어 같은 민감한 영역에 더 많이 사용되면서, 기존 방식만으로는 부족하다는 인식이 생겨났고, 그 결과로 OAuth의 보안을 강화하는 새로운 스펙들이 등장했다고 설명합니다.<br /><br />이 기술들은 OAuth의 핵심 스펙은 아니지만, 견고한 아키텍처를 구축하기 위해 '강력히 권장되는' 것들이죠.<br /><br />

## 시작하기 전 OAuth 인증 코드 플로우 초간단 복습

본격적인 내용에 들어가기 전에, 발표자는 OAuth 2.0의 표준 방식인 'Authorization Code Flow with PKCE'를 아주 빠르게 짚고 넘어가는데요.<br /><br />이 플로우의 핵심은 사용자의 브라우저를 통해 통신하는 '프론트 채널'과, 서버끼리 직접 통신하는 '백 채널'로 나뉜다는 점입니다.<br /><br />복잡한 과정을 아주 간단하게 요약하면 이렇습니다.<br /><br />1.  **(프론트 채널)** 사용자가 클라이언트 앱(예: 웹 서버)에 로그인을 요청하면, 앱은 사용자의 브라우저를 인증 서버(STS, Security Token Service)로 리다이렉트시킵니다.<br /><br />2.  **(프론트 채널)** 사용자는 인증 서버에서 아이디와 비밀번호로 로그인합니다.<br /><br />3.  **(프론트 채널)** 인증이 성공하면, 인증 서버는 '인증 코드(Authorization Code)'를 발급해서 사용자의 브라우저를 다시 클라이언트 앱으로 리다이렉트시킵니다.<br /><br />4.  **(백 채널)** 클라이언트 앱은 백 채널을 통해 방금 받은 인증 코드를 인증 서버에 보내 '액세스 토큰(Access Token)'으로 교환합니다.<br /><br />5.  클라이언트 앱은 이 액세스 토큰을 사용해서 리소스 서버(API)에 접근합니다.<br /><br />이게 바로 우리가 잘 아는 OAuth의 기본 동작 방식이죠.<br /><br />이제 이 기본 플로우 위에 어떤 고급 보안 기술들을 얹을 수 있는지 하나씩 살펴보겠습니다.<br /><br />

## 첫 번째 슈퍼차징 Resource Indicators

우리가 흔히 접하는 OAuth 아키텍처는 하나의 클라이언트가 여러 개의 API에 접근하는 경우가 많은데요.<br /><br />이때 사용하는 액세스 토큰은 모든 API에 접근할 수 있는 '만능키'가 되는 셈이죠.<br /><br />이건 꽤 위험할 수 있습니다.<br /><br />만약 이 토큰이 탈취되면, 공격자는 모든 API를 마음대로 주무를 수 있게 되니까요.<br /><br />또, API 중 하나가 악의적으로 변심해서 다른 API를 멋대로 호출할 수도 있는 문제도 있고요.<br /><br />이 문제를 해결하기 위해 등장한 것이 바로 'Resource Indicators'라는 스펙입니다.<br /><br />핵심 아이디어는 '액세스 토큰의 권한을 단 하나의 API(리소스)로 제한하자'는 건데요.<br /><br />구현 방식은 아주 간단합니다.<br /><br />먼저, 클라이언트가 인증 요청을 보낼 때, `resource` 파라미터를 추가해서 어떤 API에 접근하고 싶은지 인증 서버에 미리 알려줍니다.<br /><br />
```
// 인증 요청 시 접근할 리소스를 명시
https://sts.example.com/auth?
  ...
  &resource=https://api.reviews.com
  &resource=https://api.restaurants.com
```
<br />
그리고 액세스 토큰을 요청할 때도, `resource` 파라미터를 통해 '이번에는 reviews API 용 토큰을 주세요'라고 명시적으로 지정하는 거죠.<br /><br />
```
// 토큰 요청 시 특정 리소스를 타겟으로 지정
POST /token
...
&grant_type=authorization_code
&code=...
&resource=https://api.reviews.com
```
<br />
이렇게 하면 인증 서버는 'reviews API' 전용 액세스 토큰을 발급해 줍니다.<br /><br />이 토큰의 JWT 페이로드를 보면 `aud`(audience) 클레임에 `https://api.reviews.com`이 명시되어 있죠.<br /><br />이제 reviews API는 액세스 토큰을 받을 때 `aud` 클레임이 자기 자신을 가리키는지 확인하고, 그렇지 않으면 요청을 거부하면 됩니다.<br /><br />이 방식을 사용하면 클라이언트는 각 API마다 별도의 액세스 토큰을 관리해야 하지만, 토큰이 탈취되더라도 피해를 최소화할 수 있고, API 간의 신뢰 문제도 해결할 수 있는 강력한 보안 장치가 됩니다.<br /><br />

## 두 번째 슈퍼차징 JAR & PAR

OAuth 플로우의 시작점인 '인증 요청'은 사용자의 브라우저를 통해 전달되기 때문에 각종 공격에 취약한데요.<br /><br />공격자가 `redirect_uri` 같은 파라미터를 조작해서 인증 코드를 탈취하려는 시도가 대표적이죠.<br /><br />이 문제를 해결하기 위한 두 가지 기술이 있습니다.<br /><br />

### JAR (Jot-Secured Authorization Request)

JAR는 이름 그대로 인증 요청 파라미터들을 전부 JWT 안에 담아서 서명한 뒤, 이 JWT를 `request` 파라미터 하나로 전달하는 방식입니다.<br /><br />
```
// JAR를 사용한 인증 요청
https://sts.example.com/auth?
  client_id=my-client
  &request=eyJhbGciOiJSUzI1NiIsImtpZCI6IjEifQ.eyJ...
```
<br />
이렇게 하면 인증 서버는 클라이언트의 공개키로 JWT의 서명을 검증해서 요청 파라미터가 위변조되지 않았음을 확신할 수 있죠.<br /><br />무결성을 보장하는 아주 훌륭한 방법입니다.<br /><br />

### PAR (Pushed Authorization Request)

하지만 발표자는 JAR보다 더 강력하고 멋진 방법이 있다고 하는데요.<br /><br />바로 PAR입니다.<br /><br />PAR는 인증 요청의 패러다임을 완전히 바꿔버리는 정말 멋진 기술이거든요.<br /><br />기존 방식이 프론트 채널을 통해 인증 요청 파라미터를 보냈다면, PAR는 백 채널을 통해 먼저 인증 요청을 '밀어 넣는(Push)' 방식입니다.<br /><br />1.  클라이언트 앱이 백 채널을 통해 모든 인증 요청 파라미터를 인증 서버의 새로운 PAR 엔드포인트로 보냅니다.<br /><br />2.  인증 서버는 이 요청을 검증하고, 문제가 없으면 요청 내용을 저장한 뒤 고유한 식별자인 `request_uri`를 클라이언트 앱에 반환합니다.<br /><br />3.  이제 클라이언트 앱은 이 `request_uri`만 가지고 프론트 채널을 통해 사용자를 인증 서버로 보냅니다.<br /><br />
```
// PAR을 사용한 인증 요청
https://sts.example.com/auth?
  client_id=my-client
  &request_uri=urn:ietf:params:oauth:request_uri:eec56...
```
<br />
이게 왜 그렇게 좋냐고요?<br /><br />첫째, 민감한 요청 파라미터들이 더 이상 브라우저 URL에 노출되지 않습니다.<br /><br />둘째, 인증 요청이 유효하지 않으면 플로우가 시작되기도 전에 백 채널에서 미리 에러를 처리할 수 있어서 사용자에게 깨진 화면을 보여줄 필요가 없죠.<br /><br />셋째, URL 길이가 엄청나게 짧아집니다.<br /><br />발표자는 PAR가 너무나도 훌륭해서, 앞으로 몇 년 안에 Confidential 클라이언트의 기본값이 될 것이라고 확신하더라고요.<br /><br />

## 마지막 슈퍼차징 Sender-Constrained Tokens (DPoP)

지금까지 우리가 사용한 액세스 토큰은 모두 'Bearer 토큰'인데요.<br /><br />Bearer 토큰은 말 그대로 '가진 놈이 임자'인 토큰이라, 일단 탈취되면 속수무책으로 당할 수밖에 없죠.<br /><br />이 문제를 해결하기 위해 '소유자 증명(Proof of Possession)' 개념을 도입한 것이 바로 'Sender-Constrained Token'입니다.<br /><br />토큰을 사용하려면, 내가 이 토큰의 합법적인 소유자임을 추가로 증명해야 하는 거죠.<br /><br />이를 구현하는 방법에는 MTLS와 DPoP가 있는데, 발표자는 애플리케이션 레벨에서 더 유연하게 구현할 수 있는 DPoP(Demonstration of Proof of Possession)를 집중적으로 설명했습니다.<br /><br />DPoP의 작동 방식은 정말 정교하고 아름다운데요.<br /><br />1.  **키 쌍 생성**: 클라이언트는 개인키/공개키 쌍을 생성합니다.<br /><br />2.  **DPoP 증명 생성 (토큰 요청 시)**: 클라이언트는 토큰 요청 엔드포인트 정보, HTTP 메소드 등을 담은 'DPoP 증명(DPoP Proof)'이라는 JWT를 만들고, 자신의 개인키로 서명합니다. 이 증명 JWT의 헤더에는 공개키가 포함되어 있죠.<br /><br />3.  **토큰 요청**: 클라이언트는 이 DPoP 증명을 `DPoP`라는 새로운 HTTP 헤더에 담아 인증 서버에 토큰을 요청합니다.<br /><br />4.  **토큰 바인딩**: 인증 서버는 DPoP 증명의 서명을 검증해서 클라이언트가 개인키를 소유하고 있음을 확인한 뒤, 액세스 토큰에 클라이언트의 공개키 정보를 '바인딩'해서 발급합니다. (`cnf` 클레임에 `jkt`로 공개키의 지문(thumbprint)을 담는 방식)<br /><br />5.  **DPoP 증명 생성 (API 호출 시)**: 이제 클라이언트가 API를 호출할 때는, 호출하려는 API 엔드포인트 정보, HTTP 메소드, 그리고 **사용할 액세스 토큰의 해시값**을 담은 새로운 DPoP 증명을 생성하고 개인키로 서명합니다.<br /><br />6.  **API 호출**: 클라이언트는 이 새로운 DPoP 증명을 `DPoP` 헤더에, 바인딩된 액세스 토큰을 `Authorization` 헤더에 담아 API를 호출합니다. 이때 `Authorization` 헤더의 타입은 `Bearer`가 아닌 `DPoP`가 되죠.<br /><br />
```
// DPoP를 사용한 API 요청
GET /resource
Host: api.example.com
Authorization: DPoP eyJhbGciOiJSUzI1Ni... (액세스 토큰)
DPoP: eyJ0eXAiOiJkcG9wK2p3dCIsImFsZyI6IlJTMjU2... (DPoP 증명)
```
<br />
7.  **검증**: API는 `Authorization` 헤더의 타입이 `DPoP`인 것을 확인하고, 다음과 같은 복잡한 검증 절차를 거칩니다.<br /><br />    *   DPoP 증명 JWT의 서명이 유효한가?<br /><br />    *   액세스 토큰에 바인딩된 공개키와 DPoP 증명에 포함된 공개키가 일치하는가?<br /><br />    *   DPoP 증명에 포함된 액세스 토큰 해시값이 실제 액세스 토큰의 해시값과 일치하는가?<br /><br />이 모든 검증을 통과해야만 API는 요청을 수락합니다.<br /><br />이제 공격자가 액세스 토큰을 훔쳐가도, 클라이언트의 개인키가 없으면 유효한 DPoP 증명을 만들 수 없기 때문에 토큰을 사용할 수가 없게 되는 거죠.<br /><br />Bearer 토큰의 고질적인 문제를 아주 우아하게 해결한 방식입니다.<br /><br />

## 결론

이 강연을 통해 OAuth 보안은 단순히 정해진 플로우를 따르는 것에서 그치지 않고, 끊임없이 진화하고 있다는 것을 다시 한번 느낄 수 있었는데요.<br /><br />특히 PAR와 DPoP는 우리가 지금 당장 프로덕션 환경에 도입을 검토해 볼 만한 매우 강력한 보안 강화 도구라고 생각합니다.<br /><br />물론 구현에 드는 비용이 있겠지만, 민감한 데이터를 다루는 서비스라면 그 이상의 가치를 분명히 할 거예요.<br /><br />더 이상 Bearer 토큰의 불안함에 머물지 말고, 오늘 소개된 기술들로 여러분의 OAuth 아키텍처를 '슈퍼차징' 해보는 건 어떨까요?<br /><br />
