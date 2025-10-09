---
slug: 2022-07-30-how-to-handle-xpath-in-puppeteer
title: Puppeteer에서 XPath 완벽하게 사용하기
date: 2022-07-30 09:04:49.876000+00:00
summary: Puppeteer 강좌, XPath 사용 좀 더 정확한 웹 스크래핑 가능
tags: ["puppeteer", "node.js", "xpath"]
contributors: []
draft: false
---

안녕하세요?

오늘은 Puppeteer를 활용한 웹 스크래핑을 알아보겠습니다.

Puppeteer는 Node.js 패키지인데요,

크롬미움(Chromium)을 이용해서 웹을 제어할 수 있게 하여 웹 페이지 테스트 용도에 많이 쓰입니다.

물론 내가 원하는 방향으로 웹을 제어할 수 있기 때문에 특정 데이터를 추출하는 웹 스크래핑 역할에 가장 좋은 도구입니다.

일단 Node.js 패키지라서 NPM으로 프로젝트를 만들어 보겠습니다.

```js
mkdir puppeteer-test

npm init -y

npm i puppeteer
```

```js
{
  "name": "puppeteer-test",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "puppeteer": "^15.5.0"
  }
}
```

위의 package.json 파일처럼 puppeteer 15.5.0 버전이 아주 잘 설치되었네요.

이제 main.js 파일을 만들어서 puppeteer에 대해 좀 더 깊숙이 들어가 보겠습니다.

```js
const puppeteer = require("puppeteer");

(async ()=> {
  const browser = await puppeteer.launch();

  const page = await browser.newPage();

  try {
    await page.goto("https://www.daum.net");
  } catch (e) {
    console.error(`Location : PageGoto`);
  }

  await page.screenshot({path: 'daum_screenshot.png'});
  await browser.close();
})();
```

위 코드가 puppeteer의 가장 기본이 되는 코드입니다.

puppeteer는 비동기식으로 작동하기 때문에 async를 둬서 anonymous 함수를 작성하여 실행했고,

함수 안에서 await 방식으로 puppeteer를 실행시킨 겁니다.

puppeteer의 API에는 가장 기본이 되는 몇 가지 개념이 있는데요.

먼저, browser, page가 있습니다.

browser는 이름 그대로 크로미움 브라우저에 해당되고, 브라우저에서 한 개 한 개의 탭이 바로 page가 되는 겁니다.

그래서 위 코드에서는 먼저 puppeteer.launch()로 브라우저를 실행시키고, 그다음에 browser에서 newPage로 페이지를 하나 더 만드는 겁니다.

그러고 나서 우리가 page에 명령어를 줘서 원하는 주소로 가고, 또 특정 문자열을 찾고 등등, 이런 작업들을 하게 됩니다.

위 코드는 다음 웹 사이트로 가서 스크린숏을 찍어오라는 명령어네요.

실행 결과를 볼까요?

![mycodings.fly.dev-howto-puppeteer-xpath](https://blogger.googleusercontent.com/img/a/AVvXsEi5siCjRbKXIF0d3SR6WIuRJKqEPi6PZ8eUk5pUNzUzLVqPtLOqG-l5LIZSTCJT51L9sCSVilk06v2mL8kOQiAsH35qjwg4MD8XuifC2tox_wjZdGGnGQ-geHDk5uC5gNq5lMzAtRP6Ynb2-_SziVXmZTv4UP5uJPWsikG5Pmt5Bwbp0dkR8JMqHEsa=s16000)

실행 결과는 대 만족입니다.

![mycodings.fly.dev-howto-puppeteer-xpath](https://blogger.googleusercontent.com/img/a/AVvXsEjUKhIgpjmsAnh6z7jUCE6_8wucWaHlQFbvgVCSLcuHxs_OIU24TMPHtqOYxZV-2VMVe-7DgnOlfrdJxOVhINh1rHQuorVFEv73x_w5pF2Oa4ATGo2-f5VCoyjbjmzweRL5rLxH_NzYurGwCKisVbszk--Y4mNwHwnzIkLHZQVlsav7m__7F-3-SMCZ=s16000)


스크린숏 파일도 정상적으로 저장되었습니다.

근데, 그냥 터미널 창에서만 코드가 실행된 것으로 보이는데요.

puppeteer가 지금 뭘 하는지 볼 수 없을까요?

바로 puppeteer.launch() 함수에 옵션을 주면 됩니다.

```js
const browser = await puppeteer.launch({
    headless: false
  });
```
puppeteer.launch() 함수 안에 객체 형태로 headless: false라고 지정했습니다.

이제 실행해 볼까요?

![mycodings.fly.dev-howto-puppeteer-xpath](https://blogger.googleusercontent.com/img/a/AVvXsEhuLkyN0ia2wK5XLlX-BN4xzJt4Y-BuT38qc7qwsYNBATaBThs59qd9U1TEctGOy64jzoGRgXGIbO2W4OAid7BWwGB7XiWrgAOBl3s8y_Ca5i1cYIxAUg1inGtW4zCFfpCPs8g5QQGCxx-_E69sv1RU-4R_NjChQ_r3bgQNc27OlKdAXWKAD8GfBBV_=s16000)

크로미움 브라우저가 생기더니 순식간에 사라졌습니다.

왜냐하면 우리의 코드는 브라우저를 launch()하고 newPage로 페이지 하나 생성하고 그냥 browser.close()에 의해 크로미움 브라우저가 종료되기 때문입니다.

그래서 개발할 때는 browser.close() 함수 앞에 특정 시간 대기 코드를 넣어두면 쉽게 크로미움 브라우저를 오랜 시간 사용할 수 있습니다.

```js
const puppeteer = require("puppeteer");

(async ()=> {
  const browser = await puppeteer.launch({
    headless: false
  });

  const page = await browser.newPage();

  try {
    await page.goto("https://www.daum.net");
  } catch (e) {
    console.error(`Location : PageGoto`);
  }

  // await page.screenshot({path: 'daum_screenshot.png'});

  await page.waitForTimeout(10*60*1000);

  await browser.close();
})()
```

위 코드에서는 크로미움을 이용한 XPath 강좌에 들어가야 하기 때문에 스크린숏 코드는 주석 처리했습니다.

그리고 page.waitForTimeout 명령어로 10분(`10*60*1000`)동안 기다리라고 했습니다.

실행 결과를 볼까요?

![mycodings.fly.dev-howto-puppeteer-xpath](https://blogger.googleusercontent.com/img/a/AVvXsEg3t5eZ9dotZS-l9Y1x2cSSjPTVOQafzkeIjRaBituXuxrQ3sLYsOUfuwfD0t_UtD-5xK7MAapc2X3gGJtI01uy8iLwD23V2fRrOJ3wIKJFNSv8j-kOWJfX9aPdWhN2DqmAIbB-jHZVlziSgE3v9Y3Xd-ctDDFkk6lFkkF9lKnY8ggHYFWh4Q93lKNo=s16000)

크로미움이 정상적으로 작동되고 있습니다.

그런데, 탭이 한 개 더 생겼고, 그리고 웹페이지의 크기도 마음에 안 듭니다.

먼저, 이 부분을 고쳐 볼까요?

---

## 탭이 한 개 더 생긴 이유

왜냐하면 크로미움을 실행하면 이미 한 개의 탭이 있는데 그 상태에서 browser.newPage() 명령어에 의해 탭을 한 개 더 만들었기 때문입니다.

그럼, 크로미움 실행 시 자동으로 생긴 page를 어떻게 가져올까요?

바로 browser.pages() 함수입니다.

pages() 함수는 복수이기 때문에 page를 가진 배열을 리턴합니다.

그래서 아래와 같이 하면 됩니다.

```js
  // const page = await browser.newPage();

  const [page] = await browser.pages();

  or

  const pages = await browser.pages();
  const page = pages[0];
```

첫 번째 방법이 훨씬 간결합니다. ES6의 좋은 점이죠.


--- 
## Page 크기가 작은 이유

puppeteer.launch() 함수에 옵션을 줄 수 있다고 했는데요.

```js
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--window-size=640,480", "--window-position=1920/2,1080/2"],
  });
```
윈도 사이즈를 정했고 윈도 위치도 정했습니다.

![mycodings.fly.dev-howto-puppeteer-xpath](https://blogger.googleusercontent.com/img/a/AVvXsEiiKac9IkLnVIXdNk1ALiRDoST8BWUdmI4OIvgmB0s7wJBD2gUBU7tvbubN09er79g2OLiD6Cd5O4SnejJYUbFOfDbDqCbY2_al3RtHSOGtbL4fXjCwBVxNv7YHlU2tzgdnq9HI8K0RjOZXOVpzLPYeHZ43lPwFUytChsgER5-YKgwbCX7CIk48l6_-=s16000)

브라우저 창 크기를 완전히 작게 만들었네요.

근데 작업할 때 이 방법보다는 page의 뷰포트(Viewport)를 조작하는 방식을 씁니다.

```js
  const [page] = await browser.pages();
  page.setViewport({
    width: 1280,
    height: 1024,
  });
```

![mycodings.fly.dev-howto-puppeteer-xpath](https://blogger.googleusercontent.com/img/a/AVvXsEgpCPOUtex9QSqkh2gwj1n5CvJpMlCJ1X_Re25AeQaqOid9D-oNaB5wkFCUqg2YzZAhryg6N8jvP2kSqxXbqb26SAdq0Gr3ZQzV-IPtFHdnajWnmVNANtftZx58JmPvQC8PElzQCT0qLGe2hOXPOF0E9-SMH6QLT86DkUSltyoQmUVnSWyGozXD3EML=s16000)

page.setViewport() 함수를 이용하니까 좀 더 깔끔한 상태가 되었네요.

그럼 아까 전에 launch 함수의 args를 크게 하면 되지 않나요?

args를 크게 해도 그게 페이지에 대한 크기가 아니고 크로미움 애플리케이션 창의 크기이기 때문에 페이지는 작게 나올 겁니다.

뭐, 일단은 오늘의 주제인 XPath를 알아보기 위한 사전 준비작업이 완료되었습니다.

---

## XPath

puppeteer는 Page에서 검색 Method를 여러 개 제공하는데요.

아래 API 스크린숏처럼 5개를 제공합니다.

![mycodings.fly.dev-howto-puppeteer-xpath](https://blogger.googleusercontent.com/img/a/AVvXsEh2KcQuuaYPL9sKlk_utgf73FpUrFbCWZDHE8DzXJ54TaIy_ngl_sgN7uzX67ypNwOe5er_KMZrXMjixDPMuFZICoSeWoxgLjZyCmPEazqD7Kpy0tjlTTDJHGz5SajatYjMs_65OLtkSNJVIgLIfBzOHZ-kfW_cP7FamAPXNpgtVSzP0NgpYq5-xFlw=s16000)

우리가 사용할 게 바로 Page.$() 함수와 Page.$x() 함수입니다.

API 설명은 아래와 같습니다.
![mycodings.fly.dev-howto-puppeteer-xpath](https://blogger.googleusercontent.com/img/a/AVvXsEjRnbtxTVyFeGA6dzF9eM75AY27U6EZhIUzWA28x043b52zA59te8GEnR7qMeJpUuHj39_kmWdeXxZHRFEQI1cmRXSNkF7IxyErc_TiVpNIxJpr0L9Nk3NX4T9zTznWcDlblcbekIyKpYgws2th3Z8ceGp6hcqdNobsfPOpFtHWzagEBwHUBBbgosxD=s16000)

![mycodings.fly.dev-howto-puppeteer-xpath](https://blogger.googleusercontent.com/img/a/AVvXsEhKCZHnTF0h-1U11pMqmdyQ2LD9lK-uWDKpczoZhB1cdIfHzcerEQe4A6Y11YyYCj8KxbqZDX96BvecOv-c_vlq7Lyry_4C8KgXOOgE1SuO_GyFUz1G9T0gNgCmPwAuQWiaYTYFbRalDFaXEcl_f7GknasaUMA5SK2PVUnlEwW10Cuv9R40O1tyh0s2=s16000)

---

### Page.$() 함수

먼저, 가장 쉬운 Page.$에 대해 알아보겠습니다.

일단 터미널 창에서 실행되고 있는 크로미움 브라우저에서 주소를 제 블로그로 변경해 보겠습니다.

[mycodings.fly.dev](https://mycodings.fly.dev)

제 홈페이지 메인 화면에 보시면 FEATURED SITE가 보이는데요.

그 밑에 두 개의 SITE가 보일 겁니다.

그 사이트의 이름을 가져오는 코드를 작성해 볼까요?

일단 오른쪽 버튼을 눌러 검사창(DEV Tools)을 엽니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEit2vcY5cps9UQ7vnJ_0CP5W5c7yWyVhiDeBdOfnkoqxNRV-WfOaM5ScBL8Tw6omAtOQgdl5bHhJ9Jf2EJWmbHiyLZ4YkMElQigjtFzrGCTsD5_k3WKOjXN3gILj6VphgJfO60g9aR9Gd8RSCx-fD8RBajdFeWFLfe8QfDJaGfGYG420izxs7JJvKAN=s16000)

화면의 "카카오톡 웹" 글자를 두고 오른쪽 버튼으로 검사를 선택하면 위 그림과 같이 해당 HTML 코드로 이동하게 됩니다.

해당 HTML 코드는 아래와 같이 나타날 겁니다.

```js
<a class="mr-5 mb-5 hover:text-gray-800 dark:hover:text-gray-400 lg:mb-0" href="https://kakaoweb.netlify.app">카카오톡 웹</a>

<a class="mr-5 mb-5 hover:text-gray-800 dark:hover:text-gray-400 lg:mb-0" href="https://mymovies.fly.dev">myMovies</a>
```

단순한 `<a>` 태그입니다.

사이트가 두 개인데요.

먼저, "카카오툭 웹"과 "myMovies" 사이트입니다.

두 개의 `<a>` 태그를 보시면 서로 구분할 수 있는 차이점이 사이트 이름밖에 없어 보이는데요.

그럼 puppeteer로 해당 링크를 선택해서 click 하게 하는 코드를 작성해 보겠습니다.

먼저, "카카오톡 웹" 사이트를 클릭하는 코드를 작성해 보겠습니다.

```js
  const kakaoTag = await page.$("body > div > main > section.mx-auto.max-w-4xl > div > section > div.mx-auto.px-4.text-center.md\\:max-w-screen-md.lg\\:max-w-screen-lg.lg\\:px-36 > div > a:nth-child(1)");

  await kakaoTag.click();
```

먼저, page.$() 함수로 원하는 HTML 엘러먼트(node)를 선택하고 그 HTML Element를 click() 함수로 실행시켰습니다.

click() 함수는 마우스 클릭을 에뮬레이팅 한 겁니다.

브라우저는 실제 마우스가 클릭했다고 생각할 겁니다.

그런데 궁금한 게 바로 위 코드에서 page.$() 안에 있는 이상한 문자열인데요.

이 문자열은 자바스크립트로 document.querySelector() 함수를 쓸 때와 같은 방식입니다.

크로미움 브라우저에서 해당 `<a>` 태그 위에서 오른쪽 버튼을 클릭한 다음 COPY 부분으로 이동하시면 아래 그림처럼 나오는데,

![mycodings.fly.dev-howto-puppeteer-xpath](https://blogger.googleusercontent.com/img/a/AVvXsEj9u5fF-l60wlvl7Iho2NdV19sXX8fLqoC_gx2SAPxHhlXZxcHsIu6g9Kl7tZbRg9iPClybm4nnCiJNB-w028XLLmvrMt3odFVKWmjTfAAh9bAJd_XJkx4ShxJ8g84scAnoQSqQ59nS0sIsrlQYEbId4SO939uo0FjXf0n7xeqEaYw45nUbcpTaJto6=s16000)

selector이나 JS Path를 선택하면 나옵니다.

이제 실행해 보면 해당 HTML tag를 클릭하는 모습을 보게 될 겁니다.

---

### Page.$x() 함수

그런데 page.$() 함수의 selector가 상당히 복잡해 보입니다.

보통 HTML에 id를 부여하면 selector가 쉽게 형성이 되는데요.

아래 코드처럼요

```js
// <div id="kakao"></div>
const kakaoTag = await page.$("div#kakao");

// <div class="kakao_style"></div>
const kakaoTag2 = await page.$("div.kakao_style");
```

`<div>` 태그에 id나 스타일 클래스를 특별한 걸로 지정하면 page.$() 함수가 쉬워지는데요.

이렇지 않은 경우 사용하는 puppeteer 함수가 바로 page.$x() 함수입니다.

$x()의 `x` 가 바로 "XPath"를 의미하는데요.

"XPath"는 XML, HTML 같은 코드에서 특정 위치에서 상하 이동하여 선택하거나 특정 조건을 만족하는 위치를 찾게 하는 만능 코드입니다.

지금부터는 좀 더 본격적으로 XPath에 대해 알아보겠습니다.

---

## XPath

XPath의 강력한 기능을 먼저 보여드리겠습니다.

아까 위에서 선택한 쿼리 대신 문자열을 검색할 수 있는데요.

참고로 page.$x() 함수는 배열을 리턴하니까 아래와 같이 `[kakaoTag]` 방식으로 배열로 지정해야 합니다.

```js
  const [kakaoTag] = await page.$x("//a[contains(text(), '카카오톡')]");
  if (kakaoTag) await kakaoTag.click();
```

page.$x() 함수는 string을 인자로 받는데요.

그 string에 우리가 원하는 형식을 적어 넣는 겁니다.

먼저 위에 넣은 string을 자세히 살펴볼까요?

```js
page.$x("//a[contains(text(), '카카오톡')]");
```

시작은 `//`로 시작했습니다.

`//`의 의미는 Search의 시작 포인트가 아무 곳이나 상관없다는 뜻입니다.

만약에 `/`로 시작하면 HTML의 시작 포인트는 바로 HTML의 첫 번째 포인트가 됩니다.

지금은 page.$x()에서 시작했기 때문에 `/`는 HTML의 첫 번째 엘리먼트가 되지만 page.$x() 안에서 연속된 Element Search가 있으면 `//`와 `/`의 의미가 중요하니 꼭 기억해 두시기를 바랍니다.

그리고 `//`다음에 바로 a라고 썼습니다.

`<a>` 태그를 찾으라는 뜻입니다.

그리고 태그 다음에 `[]`을 줘서 옵션을 줄 수 있는데요.

찾으려고 하는 `<a>` 태그를 어떻게 찾을지 옵션을 주는 겁니다.

위 코드를 보면 contains() 내부 함수를 적었는데요.

```js
contains(text(), "카카오톡")

// 또는

contains(., "카카오톡")
// 같은 기능을 합니다.
```
`<a>` 태그의 텍스트가 "카카오톡"이라는 옵션입니다.

이 옵션을 좀 더 상세히 살펴볼까요?

```js
contains(@href, "kakaoweb.netlify.app")
```

위와 같이 하면 `<a>` 태그의 href 속성이 해당 문자열을 포함하고 있는지 검색하는 겁니다.

이 방식으로도 잘 작동합니다.

```js
  const [kakaoTag] = await page.$x("//a[contains(@href, 'kakaoweb.netlify.app')]");
  if (kakaoTag) await kakaoTag.click();
```

---

## XPath의 강력한 기능

XPath Expression의 좀 더 강력한 기능을 알아보기 위해 아래와 같은 HTML 코드가 있다고 합시다.

```js

<body>
  <div>
    <ul>
      <li>
        <a href="https://asdfasdfasdf.bing.com">...</a>
        <cite>Test</cite>
      </li>
      <li>
        <a href="https://adfaddasfsa.bing.com">...</a>
        <cite>Answer</cite>
      </li>
    </ul>
  </div>
</body>
```

위 코드를 보시면 뭔가 검색 엔진 결과처럼 보이는데요.

실제 Bing.com이 내놓는 코드가 위와 같은 코드입니다.

그래서 우리가 텍스트로 `Answer`를 골랐는데 그에 해당하는 `<a>` 태그를 선택해야 하는데요.

`href` 속성도 제멋대로라서 어떻게 고를 수가 없습니다.

이럴 때 쓰라고 XPath 기능이 있는 겁니다.

일단 우리가 원하는 건 `Answer`의 `<a>` 태그를 가져와서 그걸 클릭하는 코드입니다.

그런데 검색할 수 있는 단서는 `Answer`인데요.

그걸로 먼저 시작해 보겠습니다.

```js
const [answerTag] = await page.$x("//cite[contains(., 'Answer')]");
```

이렇게 하면 `<cite>Answer</cite>` 태그를 선택한 결과가 되는데요.

어떻게 우리가 원하는 `<a>` 태그에 도달할 수 있을까요?

```js
const [answerTag] = await page.$x("//cite[contains(., 'Answer')]/parent::li/a");
```

바로 위와 같이 하면 됩니다.

즉, 아까 코드에서 바로 다음에 이어지는 게 '/parent::li/a`인데요.

'/'로 시작했다는 의미는 바로 `//cite[contains(., 'Answer')]` 여기서부터 시작한다는 의미이고, 그다음에 `parent::li`라고 적었기 때문에 `<cite>` 태그의 부모 엘리먼트인 `<li>`를 고르라는 의미입니다.

그러고 나서 다시 `/`로 시작하고 그다음에 우리가 원하는 태그인 `<a>` 태그가 온 것이죠.

정말 강력한 기능이지 않나요?

XPath Expression만 잘 익히면 어떤 경우에도 특정 엘리먼트에 접근할 수 있을 겁니다.

아래는 참고로 XPath 관련 자료이니 참고 바랍니다.

---

## Selecting Nodes


|Expression|Description|
|----------|------------|
|nodename|Selects all nodes with the name "nodename"|
|/|Selects from the root node|
|//|Selects nodes in the document from the current node that match the selection no matter where they are|
|.|Selects the current node|
|..|Selects the parent of the current node|
|@|Selects attributes|

## XPath Axes

|AxisName|	Result|
|--------|--------|
|ancestor|	Selects all ancestors (parent, grandparent, etc.) of the current node|
|ancestor-or-self|	Selects all ancestors (parent, grandparent, etc.) of the current node and the current node itself|
|attribute|	Selects all attributes of the current node|
|child|	Selects all children of the current node|
|descendant|	Selects all descendants (children, grandchildren, etc.) of the current node|
|descendant-or-self|	Selects all descendants (children, grandchildren, etc.) of the current node and the current node itself|
|following|	Selects everything in the document after the closing tag of the current node|
|following-sibling|	Selects all siblings after the current node|
|namespace|	Selects all namespace nodes of the current node|
|parent|	Selects the parent of the current node|
|preceding|	Selects all nodes that appear before the current node in the document, except ancestors, attribute nodes and namespace nodes|
|preceding-sibling|	Selects all siblings before the current node|
|self| Selects the current node|

