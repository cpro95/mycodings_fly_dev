---
slug: 2023-06-26-howto-nextjs-react-kakao-map-api
title: Next.js, React에서 카카오맵 API 완벽하게 사용하기
date: 2023-06-26 08:26:32.529000+00:00
summary: Next.js, React에서 카카오맵 API 완벽하게 사용하기
tags: ["next.js", "react", "kakao", "map", "api"]
contributors: []
draft: false
---

안녕하세요?

오늘 이 시간에는 카카오에서 제공하는 API 중에 Map(지도) 관련 API를 Next.js 같은 React 환경에서 사용하는 방법을 알아보겠습니다.

Next.js나 React나 모두 클라이언트 렌더링인데요.

그래서 브라우저에서 카카오 API를 script 방식으로 로드하고 사용하면 됩니다.

실제 카카오 공식 문서에서도 다음과 같이 사용하라고 나오거든요.

```js
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8"/>
	<title>Kakao 지도 시작하기</title>
</head>
<body>
	<div id="map" style="width:500px;height:400px;"></div>
	<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=발급받은 APP KEY를 넣으시면 됩니다."></script>
	<script>
		var container = document.getElementById('map');
		var options = {
			center: new kakao.maps.LatLng(33.450701, 126.570667),
			level: 3
		};

		var map = new kakao.maps.Map(container, options);
	</script>
</body>
</html>
```

Next.js 버전 13에 한번 적용해 보겠습니다.

먼저, \_document.tsx 파일 Head 부분에 카카오맵 API를 넣어 보겠습니다.

Next.js에서는 Script라는 컴포넌트를 따로 제공해 줍니다.

```js
import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html lang='en'>
      <Head>
        <Script
          type='text/javascript'
          src='//dapi.kakao.com/v2/maps/sdk.js?appkey=34234234234234&autoload=false'
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
```

이제 카카오 API SDK도 로드했겠다, 실제 카카오 관련 코드를 React 코드로 작성해 볼까요?

React는 useEffect 훅을 제공해 주는데요.

바로 이 훅에서 카카오맵 API 코드를 작성해야 합니다.

일단 아래 그림과 같이 작성했는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEh7Yajt0MI5d2nEPZ8v8_7d607fb8jVGVZy3L4fjoiBp9tpgfV5vVJuaO6S4pmSXBQa4AZUAO77avPd4hSzGCrL1SQcSSRq0waWtG9YmjxROAQLar96tco-f7Ga3YmI26tYpxVLFlrSl-sDgNT9bYnN8LR4MEcSr1LZQHsKjoI7IS3hAPMcuA4l6HJKDIQ)

그런데, 위 그림과 같이 타입스크립트에서 kakao라는 객체가 없다고 나옵니다.

React에서는 우리가 HTML의 script 태그에서 로드한 객체는 무조건 window 객체 밑에 붙게 되어 있습니다.

그래서 아래와 같이 타입스크립트에서 추가해 줘야 할 코드가 있는데요.

바로 "window.kakao"라는 방식으로 사용하면 됩니다.

```js
import { useEffect, useState } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

export default function Home() {

  useEffect(() => {
    var container = document.getElementById("map");
    var options = {
      center: new window.kakao.maps.LatLng(33.450701, 126.570667),
      level: 3,
    };

    var map = new window.kakao.maps.Map(container, options);
  }, []);

return (
    <main className="w-full flex flex-col items-center justify-center pt-4">
      <div className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh]">
        <div id="map" style={{ width: "100%", height: "100%" }}></div>
      </div>
    </main>
  );
```

위 코드와 같이 전체적인 카카오 지도를 테스트해 볼 수 있는 화면 구성이 끝났는데요.

이제 Next.js 개발 서버를 돌려 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEjiI4lbRfKocrBvYK8ie51Il-J-nC2Imf8LgXpKf4PRtxDReVOYvloMnQH7Jbyiq8fkr1rSVoZwOjNB-uchn0N9foBKR4HHG7DOBga9WXt9sDOGsWowk5SPBGm4RTK3Ryydqjp19NQsRHciJb28Y-mbnIgH50Gc-lTtxeWWM_-TYnz2FxLtSw0ffxi4Xog)

위 그림과 같이 maps라는 변수가 undefined 라는 에러가 나옵니다.

아니, 카카오 공식 문서에 있는 대로 그대로 따라 했는데 왜 에러가 날까요?

이 에러는 바로 카카오 API가 script 로드되기 전에 React의 useEffect 훅이 실행돼서 그렇습니다.

그러면 Next.js의 Script에서 제공해 주는 3가지 Strategy를 적용해 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEjpfKoo3LxafkS8Y5oOg3cLIjrhnzx-cbYefmHSyeCpQUZUhqOUeM5n01BJgi3SndcEcVcD5WzfAumUGc86bk63dtyyJxHGNOsoBlzsnjdEKF7o1lvWAEie4kHdFmwsDTGyOQzaZFSKse1lEDBfxxbSmqPKNk4L1ds8mtTcJm-bmiRrXvycpKWB0BnGxpE)

디폴트 값인 "afterInteractive" 외에도 "beforeInteractive"나 "lazyOnload"로 바꿔 테스트해 봐도 같은 에러가 나옵니다.

결론적으로 카카오 API가 먼저 로드되지 않는데요.

---

## 카카오 maps.load static method 사용하기

카카오에서는 카카오맵 관련 SDK가 제대로 로드된 후에 사용하라고 아래 그림과 같이 정적 메써드를 제공해 줍니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhi0iLcmocoDh-8Q2caJa4IkHTuCH4wwkA1n6kO-kh6gSlGQglZSj7W7Pn6UE_H3iD7rUhLC7P4liBEBcXOU94z11YknBjrWPWK87x5ZB133T8WvjnLFkagEicHbT9ERaaOQI9iDPuTGBe9AsFymm6Q6cPN4xAa1aEMYGYT7S6zDLFJG3O2_dS0dvfV3QI)

바로 kakao.maps.load 메서드인데요.

우리는 이걸 이용할 겁니다.

카카오 SDK가 메모리에 제대로 로드된 후에 당신의 코드를 작성하라는 카카오가 배려해 주는 일종의 콜백함수입니다.

먼저, useEffect 훅을 조금 뜯어고쳐야 합니다.

```js
window.kakao.maps.load(() => {
  var container = document.getElementById('map')
  var options = {
    center: new window.kakao.maps.LatLng(33.450701, 126.570667),
    level: 3,
  }

  var map = new window.kakao.maps.Map(container, options)
})
```

이렇게 해도 역시나 kakao.maps 객체가 없다고 나옵니다.

Next.js의 Script 컴포넌트를 대체할 다른 방법을 찾아볼까요?

---

## document.createElement 사용해서 직접 script 태그 추가하기

\_document.tsx 파일에서 Script 태그를 이용한 방식은 다 실패했는데요.

그래서 자바스크립트 기본적인 로직으로 돌아가서 직접 DOM에 script 태그를 추가해 볼 겁니다.

일단 아래처럼 useEffect 훅의 코드를 수정해 볼까요?

```js
useEffect(() => {
  const kakaoMapScript = document.createElement('script')
  kakaoMapScript.async = true
  kakaoMapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=3423423&autoload=false`
  document.head.appendChild(kakaoMapScript)

  window.kakao.maps.load(() => {
    var container = document.getElementById('map')
    var options = {
      center: new window.kakao.maps.LatLng(33.450701, 126.570667),
      level: 3,
    }

    var map = new window.kakao.maps.Map(container, options)
  })
}, [])
```

물론 Next.js의 \_document.tsx 파일에서 Script 태그 부분은 삭제해 주십시오.

위 코드는 document.createElement를 이용해서 'script' 태그를 직접 만들어 주고 있습니다.

그리고 그걸 async 방식으로 만들고 최종적으로 document.head 부분에 appendChild 함수로 붙여주는 거죠.

실행해 볼까요?

그런데 역시나 kakao.maps 객체가 없다는 에러가 나옵니다.

문제는 역시나 kakaoMapScript 객체가 로드되는 속도보다 useEffect 훅이 더 일찍 시작된다는 얘기입니다.

그러면 여기서 문제를 해결하려면 kakaoMapScript 객체에 addEventListener를 붙여주면 되겠군요.

```js
kakaoMapScript.addEventListener('load', onLoadKakaoAPI)
```

위와 같이 'load'라는 이벤트 리스너를 붙여주면 kakaoMapScript가 'load' 되었을 때 실행하는 함수를 지정할 수 있습니다.

이제 onLoadKakaoAPI 함수만 만들면 됩니다.

---

## 최종 버전

```js
useEffect(() => {
  const kakaoMapScript = document.createElement('script')
  kakaoMapScript.async = false
  kakaoMapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=700d399006256f95732f06b19c046ba5&autoload=false`
  document.head.appendChild(kakaoMapScript)

  const onLoadKakaoAPI = () => {
    window.kakao.maps.load(() => {
      var container = document.getElementById('map')
      var options = {
        center: new window.kakao.maps.LatLng(33.450701, 126.570667),
        level: 3,
      }

      var map = new window.kakao.maps.Map(container, options)
    })
  }

  kakaoMapScript.addEventListener('load', onLoadKakaoAPI)
}, [])
```

위 코드가 최종 useEffect 훅에 들어갈 코드입니다.

실행 결과를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEhCzHgSDRFqwpWukqKNa8vDqJW_oTSHaxlZ4-s0t7R2fK4dlkJul5ynCzUQgyMyFTm2pbdiljxwIsvrVAR3sLFLnAN6ln8In3A_50P95kAzz5xfQ0VKN0KvDFxgxmFN3-bvLahEt6J2wGE4PQ5v_ylh5eP1F712AD2VXiGBOjQqMI5HTe6hu_xXiDDEm4w)

위 그림과 같이 제대로 작동되네요.

지금까지 Next.js 같은 React 환경에서 useEffect 훅을 이용한 카카오맵 API를 사용하는 방법에 대해 알아봤습니다.

많은 도움이 되셨으면 하네요.

그럼.
