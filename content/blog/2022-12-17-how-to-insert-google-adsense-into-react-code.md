---
slug: 2022-12-17-how-to-insert-google-adsense-into-react-code
title: 리액트(React) 코드에 구글 애드센스(google adsense) 추가하기
date: 2022-12-17 10:46:21.881000+00:00
summary: 리액트(React) 코드에 구글 애드센스(google adsense) 추가하기
tags: ["adsense", "react"]
contributors: []
draft: false
---

안녕하세요?

제 블로그 사이트인 mycodings.fly.dev가 Remix Framework으로 만들어졌다는 건 다들 아셨을 텐데요.

React 프레임워크입니다.

그래서 React 프로젝트에 구글 애드센스를 다는 방법에 대해 제가 성공했던 방법을 소개해 볼까 합니다.

구글 애드센스에 가시면 왼쪽 메뉴 중에 광고라고 표시된 부분이 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhBIZRc90g_0haIZaHBUYTxw1rYGZghTpPL7-nJIHa_5XcdyX1CtUgQEuYN6BWeZpA_AB4HA3ZfnMtHUJ0bY88aOIlPYH8o8-zlWRCF_SXoh2Ey1w7ro62rDOqn6SQGgLCiN6mRxGNJEBwyR3I2MLxnaMNbC_OLmKkKV1sPR1Ylhw5KVuvuAd-EtHOP=s16000)

위 그림과 같이 나오는데요.

원하시는 광고를 만드시면 구글 애드센스에서 다음과 같은 코드를 줍니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhgYS5izaD8pREpETmNTPKi8LTD72wVXdxrC2GnYbVgnvHv4nXE6z0THDcY4ernQtU7dCWs8e05A5c8gSmWeWdEPfJCelUfIBH4ucjZfHqD3pxAMdBvA1jQxId9wbdPbnSpFgIRYueZHqsiW-b5yxMmqNdpVpX4NKNnEyfEuOg75RkXF6gqBE4fmEfL=s16000)

코드를 보면 그냥 HTML 파일에 넣으라는 코드인데요.

위 코드는 우리가 쓰는 React 코드에는 적용이 안 됩니다.

제가 원하는 부분에도 넣을 수 없고요.

이제 이 코드를 변경해서 React 컴포넌트로 만들어서 제가 원하는 코드 위치로 넣을 수 있도록 개조해 보겠습니다.

먼저, DisplayAds 컴포넌트를 만들어 보겠습니다.

```js
import React, { useEffect } from 'react'

const DisplayAds = () => {
  useEffect(() => {
    const pushAd = () => {
      try {
        const adsbygoogle = window.adsbygoogle
        // console.log({ adsbygoogle })
        adsbygoogle.push({})
      } catch (e) {
        console.error(e)
      }
    }

    let interval = setInterval(() => {
      // Check if Adsense script is loaded every 300ms
      if (window.adsbygoogle) {
        pushAd()
        // clear the interval once the ad is pushed so that function isn't called indefinitely
        clearInterval(interval)
      }
    }, 300)

    return () => {
      clearInterval(interval)
    }
  }, [])
  return (
    <ins
      className='adsbygoogle'
      style={{ display: 'block' }}
      data-ad-client='ca-pub-7748316956330968'
      data-ad-slot='3545458418'
      data-ad-format='auto'
      data-full-width-responsive='true'
    ></ins>
  )
}

export default DisplayAds

```

구글 애드센스가 준 코드를 React에 맞게 수정했습니다.

useEffect 훅을 이용해서 컴포넌트가 로드되면 pushAd 해주는 원리입니다.

그리고 setInterval 함수를 이용해서 구글 애드센스 함수가 제대로 로드되었는지 계속 체크하는 코드도 들어 있습니다.

이 코드는 구글링으로 찾았는데요.

적용해 본 결과 아주 잘 작동되었습니다.

이제 제가 원하는 위치에 아래와 같이 광고를 삽입해서 주면 됩니다.

```js
import DisplayAds from '~/components/ads/display-ads'

<div className='grid place-content-center'>
          {/* 구글 디스플레이 광고 삽입 */}
          <DisplayAds />
          {/* 구글 디스플레이 광고 삽입 */}
...
...
...
</div>
```

어떤가요?

정말 쉽지 않나요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEi5CiSa7M2QRQJG5S2LhXnQi-nw9TndHx_d45IrhbjUJ7mJnrmfiI76qluFN7oo7u_xN3FIsMprLok9rp8wX1XIE6_91HOPQGZTGv82fVJX1HAP2cLsUyjcz5BpOzP2lsrOcIS7yUvIfDRqOwb6xb-TEHEH4nFLtWVf1SP9MPZKNFtYzC64tETSA8H_=w400-h304)

위 그림과 같이 제 블로그 메인 화면에 구글 광고가 아주 잘 나오네요.

그럼. 많은 도움이 되셨으면 합니다.
