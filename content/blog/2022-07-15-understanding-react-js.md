---
slug: 2022-07-15-understanding-react-js
title: ReactJS의 작동 원리 파헤치기
date: 2022-07-15 07:14:50.128000+00:00
summary: ReactJS의 작동 원리 파헤치기
tags: ["react", "react 원리"]
contributors: []
draft: false
---

안녕하세요?

드리프트의 myCodings 블로그에 오신 걸 환영합니다.

이 글은 구글 블로거에도 올렸던 내용인데, 새로 오픈한 나만의 블로그인 [mycodings.fly.dev](https://mycodings.fly.dev)에 처음으로 다시 살짝 각색해서 올려볼까 합니다.

각색하지 않으면 구글님께서 표절로 오해할 수도 있으니까요!

ReactJS를 접하기 전에는 AngularJS를 이리저리 시도했었는데요.

ReactJS가 대세가 되면서 저 또한 이제는 React를 이용해서 웹 프로그래밍하고 있고요.

최근에는 무조건 NextJS를 이용했었는데요, Remix가 나오면서 Full Stack 개발이 너무 편해져서 Remix Framework을 사용하고 있습니다.

이렇듯 ReactJS는 VueJS나 SvelteJS가 나와도 React만의 유저 기반이 탄탄해서 앞으로도 유망한 웹 프레임워크가 될 거라고 확신합니다.

오늘은 ReactJS가 어떻게 작동하는지 알아보는 시간을 갖도록 하겠습니다.


## 테스트 환경 준비

먼저 ReactJS의 작동 원리를 알아보기 위한 웹 개발 테스트 환경을 준비해 보도록 하겠습니다.
 
먼저, 빈 폴더에 index.html 파일을 만들 건데요.
 
HTML 파일을 실시간으로 브라우저에 반영되게 하는 Hot-Reload 환경을 만들기 위해 추가로 설치해야 하는 NPM 패키지가 있는데요.
 
바로 simple-hot-reload-server입니다.
 
다음과 같이 전역으로 설치하면 됩니다.

```bash
npm install -g simple-hot-reload-server
```

테스트를 위해 실행해 볼까요?

```bash
hrs .
``` 
![mycodings.fly.dev-understanding-react-fundamentals](https://blogger.googleusercontent.com/img/a/AVvXsEhfrD0zohMyGwoPPFCwzLMp6-9R8ClTbOfU5bM3HUIGN07eqEudHJSAaIwE3L2NhwneuZE2MwaW4Y8jSjKFNRihb-9l9ySbdnL-Udt06b07qMe2IqmKABI_XBxAjFa6z1s1IyodOt_EXj9vqezjIJ4FRma28hU-wU2CSVpVk8wLll2vueFVyuxPBqgd=w640-h112)

 
hrs 명령어를 실행하면 위와 같이 현재 폴더를 서버가 호스팅 하듯이 웹 브라우저에서 인식할 수 있게 되는데요.
 
기본 주소는 다음과 같습니다.

http://localhost:8082
 
그러면 index.html 파일에서 html 파일의 골격을 작성한 다음 테스트를 해 볼까요?
 
```html
<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Understanding React</title>
  </head>
  <body>
      Hello! React!!
  </body>
  </html>
``` 
![mycodings.fly.dev-understanding-react-fundamentals](https://blogger.googleusercontent.com/img/a/AVvXsEjZrafpzkohmHaAB0RlZ0299fn9SJ89cp8cV5W_MJDdeQmoAmjfKmpT6I3ansGdQO3QKzaFSZ3-_tERzeuXLM7wJYLJtzuGSGmGXdgdVJ37j48yvm3Z7je4kDZWvKth6xtL46JaDr2SAxu7QKvcbXqR0Zlr12hwWTQ-jKtPXro_xRDBqbDqPXw2uC5V=w640-h222)

Hot-Reload 방식이 제대로 작동되고 있습니다.
 
그럼 본격적으로 ReactJS의 작동 원리에 대해 알아보겠습니다.


## 자바스크립트
 
ReactJS는 자바스크립트 라이브러리입니다.

우리가 DOM 태그를 HTML 파일에 표면적으로 직접 작성하는 방식 말고, 코드를 통해 DOM에 직접 원하는 HTML 태그를 추가하는 방식을 자바스크립트를 이용해서 라이브러리화 한 겁니다.
 
자바스크립트로 HTML 태그 DOM상에 추가하는 방법이 뭘까요?
 
바로 자바스크립트 명령어 중 `document.createElement` 명령어입니다.

createElement에 대한 예제를 만들어 볼까요?

HTML 파일 안에서 자바스크립트를 실행하려면 `<script>` 태그를 이용하면 됩니다.
 
```js
  <body>
    <script>
        const div = document.createElement("div");
        div.textContent = "Hello React";
    </script>
  </body>
``` 
Hot Reloaded 된 브라우저를 보면 아무런 변화가 없는데요.

혹시 모르니 새로고침도 해보십시오. 아무 변화가 없을 겁니다.
 
왜냐하면 우리가 만든 div Element가 그냥 메모리상에 있는 Element이기 때문입니다.
 
메모리상에 있는 Element를 브라우저가 현재 보여주는 DOM에 삽입해야 하는데요.
 
다음 코드와 같이 `document.body.appendChild` 명령어를 통해 DOM상에 추가해보겠습니다.

```js
  <body>
    <script>
        const div = document.createElement("div");
        div.textContent = "Hello React";
        document.body.appendChild(div);
    </script>
  </body>
``` 
![mycodings.fly.dev-understanding-react-fundamentals](https://blogger.googleusercontent.com/img/a/AVvXsEjs-s6Bn8wvF0FVJw9w5Y3sOY_KK67nEzaIi_hC05EjIU7qIWHH-I56uJt460HczOKUck40bfxIVEscuGGvQSwBo9g4olMCVB8gjzFkpsDWqefq5bjSiPpTAeJ6BDBxFHhZ7gaRdYlxlpWHfolJz94QCw6UOVy9z8xcucKPDZNRXc2cD-AZ74V9nYZu=w640-h220)
 

크롬 DevTools로 보시면 우리가 위에서 만들었던 div 엘러먼트가 body 태그 밑에 잘 삽입되어 있습니다.

div 컨텐트에 자바스크립트 코드를 넣어볼까요?

```js 
  <body>
    <script>
        const div = document.createElement("div");
        div.textContent = Date.now().toLocaleString();
        document.body.appendChild(div);
    </script>
  </body>
```
 
Date.now()라고 하면 현재 날짜를 UNIX 시간으로 표시해 줍니다.
 
![mycodings.fly.dev-understanding-react-fundamentals](https://blogger.googleusercontent.com/img/a/AVvXsEi6L5dgXSCKN2wlLLOUdT4gSzC7SbzhX5lSliyyv6OGRuUjJo4HNdznJjmFXYK4uTVREgCG5H4DBXtZb6dOjkharDhNCrhu5CAkXC_R6FF7xcEOphoW-BNGdAjkOy4nQG2mGUA9isEL9c6flL9kvzvomsfCvZeguBIIvY-QdGvA4TTJ8HGAGr-Xl4P1=w640-h190)

 
우리가 작성한 자바스크립트 코드가 제대로 작동하고 있네요.
 
브라우저를 계속 새로고침 하면 숫자는 계속 변하게 됩니다.
 
왜냐하면 동적 데이터이기 때문입니다.
 
여기서 우리는 div 엘레먼트를 body 태그에 붙였는데요.
 
좀 더 일반적인 방식은 body 말고 다른 태그를 id를 붙여 만들고 거기에 붙이는데요.
 
```js 
  <body>
    <div id="root"></div>

    <script>
      const div = document.createElement("div");
      div.textContent = Date.now().toLocaleString();
      document.getElementById("root").appendChild(div);
    </script>
  </body>
``` 

![mycodings.fly.dev-understanding-react-fundamentals](https://blogger.googleusercontent.com/img/a/AVvXsEjJf2xdiIXr9doHeWNC1u6krTXcESuC_e1ma0yOqOeAn0lhBKNsjL6zvr8m9yiHH0d4SEMhjD0DTVbd8Qas5iRtAKlAeril-YimCG7GsEzAbtBBNl52CzhSaT1Xc29fnzp5Dn0t3zWhVmbHq97X7l6Q_EI27Q8QoywwbpyCV6ntctF7CfSicZ4gZCcT=w640-h248)

 
참고로 HTML 태그에 id라는 특성이 붙으면 자바스크릡트는 window 객체에 그에 해당하는 이름으로 객체를 만듭니다.

아래 그림처럼요.

![mycodings.fly.dev-understanding-react-fundamentals](https://blogger.googleusercontent.com/img/a/AVvXsEj3PUXodTvphOnPdK_nyk5-3TppLnl7K5sWK3rjyf7Q-ube0uJRcLFDZ5Stn5NeVE68LJV3CcOJ4T9oD5okMnHV05OdYV2_DLuMLVbPcEZ86Ax5Pjg78oUZ7GCkHT83-dum81kUkfXy-u_4AJv6kQK0vMGE5Uh3LZS7s6uRynIXlC6RTOf2SyeR3GIi=w640-h256)

window.root라는 객체가 위 그림에서 보듯이 `<div>` 태그가 되었네요.
 
우리가 만들었던 div 태그에 CSS class를 추가해 볼까요?
 
자바스크립트에서는 className이라고 합니다.
 
```js
  <body>
    <div id="root"></div>
    <script>
        const div = document.createElement("div");
        div.textContent = Date.now().toLocaleString();
        div.className = "container";
        document.getElementById("root").appendChild(div);
    </script>
  </body>
```

![mycodings.fly.dev-understanding-react-fundamentals](https://blogger.googleusercontent.com/img/a/AVvXsEjjflwpgnJBhWUtn71qZx3ILx51hBaYMoAqbam4I_xXkV2LzTPggAWim1cJmmr-TbntlqK0QZsiFZVoNAKJ-DEDem0rSaGnR5Ybvu6Y172-y5r8ErUdCsc8PKbOw1MLbZzX1FCXrh3pAuKZu_e-b5ZteRSkcghqRVwXvOyyFRFff8lv6oAgydKjI6Y8=w640-h316) 


ReactJS에서 CSS Class를 className이라고 하는 이유가 바로 여기에 있습니다.
 
다음으로 div 엘레먼트에 id를 추가해 볼까요?

```js 
  <script>
    const div = document.createElement("div");
    div.textContent = Date.now().toLocaleString();
    div.className = "container";
    div.setAttribute("id", "sub_root");
    document.getElementById("root").appendChild(div);
  </script>
``` 

![mycodings.fly.dev-understanding-react-fundamentals](https://blogger.googleusercontent.com/img/a/AVvXsEjJtnbEkginD-S5_qxbtA-8Jqo640UZwy3zE4rPocbahPF7-3EnBU21KOmTXpkPkW6S2pm_Ree2xPDJ6QxvPnGBdQ4SDHNNniTH-p44W_3dHHtgDvWtynAwb6Uf-8o2pc8Fr0pnUmO67w7r0HLm_JVRMryj_f9zYcM9aVlVH5hdli6ctRtahTpPbhBZ=w640-h222) 

우리가 만든 div 태그에 class와 id가 보입니다.
 
이렇듯 자바스크립트로 HTML의 모든 태그를 컨트롤할 수 있는데요.
바로 ReactJS가 이 방법으로 HTML의 DOM을 컨트롤하는 겁니다.
 
이제 ReactJS로 넘어가 볼까요?


## ReactJS 원리
 
ReactJS도 자바스크립트이기 때문에 HTML 파일에 `<script src=”https://~~~~></script>` 방식으로 해당 라이브러리를 로딩할 수 있습니다.
 
ReactJS의 Full source code를 볼 수 있는 곳이 바로 unpkg 사이트인데요.
 
https://unpkg.com/
 
![mycodings.fly.dev-understanding-react-fundamentals](https://blogger.googleusercontent.com/img/a/AVvXsEi50VQKB7OzDixzCSxkQjpxWqByuUBSH7xBHwrZg2H6zp3M348nIqd-3ZZcTmMgVnrDwQH5Vvv7OT_1-zYBO9gBKXykTddagid9cWJsuMgT1nSzl6W_KgEr7atAE94gRFzb-XqDL_QLmyFtGDGU4zR0NIjC12iejRYPevrXRBd5dMP9lw7y4-1lyhlC=w640-h543) 


브라우저에서 다음과 같이 입력해 봅시다.

https://unpkg.com/react
 
![mycodings.fly.dev-understanding-react-fundamentals](https://blogger.googleusercontent.com/img/a/AVvXsEh0io7ZBai7z3OpNuXawQbphdL57GyBE0iqk2-00_FkLDRXlOEpngi-imwkO8Y_E0LA6QHAcHgw8aKH-0MWF4g9cF4FDJ_5DtpfsFoU-sTtVoHdtupS1s5D5H84bP3zfn_paCyqmCuxKpKg5qvNNKkYtXJYlUZaOoKHXToIVOUV8i-Qymhv9xLOIE7h=w640-h236) 


최신 버전이 18.1.0이네요.
 
그리고 index.js 파일이 보이는데 실제 이 파일의 React의 첫 코드입니다.
 
NODE.ENV에 따라 production이냐, development이냐로 분기하는 코드네요.
 
그럼 우리가 필요한 건 바로 실제 React코드이기 때문에 브라우저에 다음과 같이 입력해 봅시다.
 
https://unpkg.com/browse/react@18.1.0/
 
위와 같이 입력하면 react 버전 18.1.0의 디렉터리를 보여주는데요.

![mycodings.fly.dev-understanding-react-fundamentals](https://blogger.googleusercontent.com/img/a/AVvXsEgOnYdvWfvkmHBcUNnHPBbaH19pAE0GPS7xs5dfm65LkWZ3Oy7Qcnbqnpx2wWG2EtQbDCsKK5a6NOfm-PRl6KvThsjtXITznZNKNGT3wgKt_6qXPRFH987z7FHmEM2Bk_S06BXK5REP91VygTGCOmDzRihpJsC31cXbQHQYoiSkkPSYNuQ9cmMvFiGm=w640-h448) 

우리가 필요로 하는 코드는 umd 폴더에 있습니다.
 
umd 폴더의 뜻은 Universal Module Definition의 뜻입니다.
 
![mycodings.fly.dev-understanding-react-fundamentals](https://blogger.googleusercontent.com/img/a/AVvXsEgAVBBtQVohkJqz3_VmYSSfCk8H6T7zOb_o1xLkzPGQGgH4lHK3DeMyhTgswUnMRMlFfiWGFFwRfDVbsdz-X9Mi0kprrIO41hYmc5iU4_v7I7X6Cr8ZyeznHX3S8ssh4NKXL1l6IW_Btyu6doKvDObGYJvNpa3gqnj4cLWoO1kGijkYjf3P7QeikDAx=w640-h296)  


umd 폴더에 보면 react.development.js와 기타 파일이 있네요.
 
한번 열어볼까요?

![mycodings.fly.dev-understanding-react-fundamentals](https://blogger.googleusercontent.com/img/a/AVvXsEjF1S0LuAgcxwfCGF_ycr0wgB8WVSxKh8ReXzPXkeOKo0vqyT7mzojBBzeix3AkftH27gB3BSCsyljUo6ayLDjH3HJYDvoIWBEKkJnqY7bJ7GDmiCZUAnytP6WgypKymQuCVy3yIOlOT3jNnUEnoee6jiT_jnDZB1Z_xHuRHLZNjbcJaHMUBGH7Wx6q=w640-h605) 

 
와우! 실제 Facebook이 만든 ReactJS의 Full Source Code입니다.
 
이제 이 파일을 index.html 파일에 넣어 볼까요?
 
 ```js
  <body>
    <div id="root"></div>
    <script src="https://unpkg.com/browse/react@18.1.0/umd/react.development.js"></script>
  </body>
```

ReactJS 라이브러리를 `script src` 방식으로 삽입했습니다.
 
그럼 브라우저에서 제대로 로딩됐는지 볼까요?
 
![mycodings.fly.dev-understanding-react-fundamentals](https://blogger.googleusercontent.com/img/a/AVvXsEgW3BYwUFwfyDyDkbuEFRqrWIr3s39Cv26kV54Hlql_h7muCshECr640jg81SoKoykrNx93gAhDRD_vk9IvzzQ_5maGpWvdgWlqYnx7Bs1Uno5nHkqDxhd6SgPqviJrheGZfGKWeuBmY6_gXCpouk6jd2XVmf6qDSHnbV1YIw05phlq6vMD7dATBILS=w640-h152) 

 
교차 출처 읽기 차단(CORB)이 되었네요.
 
react.development.js파일을 로컬로 저장해서 불러와야겠네요.
 
아까 unpkg 사이트에서 오른쪽에 View Raw 버튼을 누른 다음 전체를 선택해서 복사하고 VS Code에서 react.development.js파일 이름으로 저장합니다.
 
그리고 다시 아까 브라우저에서 로딩해보면 아무 이상이 없다고 나옵니다.
 
ReactJS가 로딩되어 있는지 확인해 볼까요?
 
Chrome 콘솔 창에서 React라고 입력해 볼까요?
 
![mycodings.fly.dev-understanding-react-fundamentals](https://blogger.googleusercontent.com/img/a/AVvXsEimOZqntgRnzxMRwSQ2O1kM7rGj3QeG3GJbP0iClD950vDzEHnQuQVn0gEXdAtmdHj9tE2z9LpzxYQza1-hRWwa9N3pGNAtoboMcs8G655aMDblXkk4RFakzUf1mZ6vdMmFuOqhjMRAg7MeaZCtGVrboVZ0yP5TShFMbFvI6oyzWmj5A08hilWVIYmi=w629-h640) 

React 객체가 로드되어 있네요.
 
React의 명령어를 사용해 볼까요?
 
React.createElement를 먼저 해보겠습니다.
 
```js
  <body>
    <div id="root"></div>
    <script src="react.development.js"></script>
    <script>
      const div = document.createElement("div");
      div.textContent = Date.now().toLocaleString();
      div.className = "container";
      div.setAttribute("id", "sub_root");
      document.getElementById("root").appendChild(div);

      const element = React.createElement("div");
      console.log(element);
    </script>
  </body>
```

element라는 변수에 React.createElement(’div’)라고 div 엘러멘트를 만들고 그걸 console.log 했습니다.
 
![mycodings.fly.dev-understanding-react-fundamentals](https://blogger.googleusercontent.com/img/a/AVvXsEjMCZanWoZhSh1ChUNtwHSVNZ2ZopXwUt_d1lmM_moeF8n_gnarMZ7G_payfTR2PLoQ7jG3XudHYDiNZiC9bzgsEEe0KLL-YHgJjAS4RAyOPKRcEwvOM5-slyzXuQrSQtRZueCRgCOkiMeTxROPTHTcoTcU0QSYzn1QR-tcHFISRBwBiVIbn9z9B_W7=w640-h342)  

위와 같이 div 엘러먼트가 나오네요.
 
console.dir 명령어로도 됩니다.
 
![mycodings.fly.dev-understanding-react-fundamentals](https://blogger.googleusercontent.com/img/a/AVvXsEhEckQha4PZuoSSy9mx0NnAcx6WB1SUrB-YIu6utqtgkds08S63SwkIHpbxJarXrjSeljR1iKgQWCAzD5DkWeKuoST0q0idzjzk7W7x7Y6GRQLj_Sk2Cv4r1oeqmzmqwzykZXT87YXOSVci-VJkB7rxM0Kfb34ukwRIQvdW-XRbWCH9n75T20Uqhhir=w640-h444) 

 
React 객체가 만들어져 있고 props 항목도 있고 store 항목도 있고 type 항목도 있고, 여러 가지가 있네요.

참고로 언더스코어(_)로 시작되는 항목은 우리가 접근하지 못하는 겁니다.
 
이 모든 게 다 ReactJS의 가장 기본이 되는 항목입니다.
 
```js
  <script>
    ~~~~
    ~~~~

    const element = React.createElement("div", {
      className: "container",
      children: Date.now().toLocaleString(),
    });
    console.dir(element);
  </script>
```

React의 createElement 함수는 첫 번째가 태그 네임이고 두 번째가 옵션입니다.
 
위와 같이 두 번째 옵션에 className과 children을 지정했는데요.
 
![mycodings.fly.dev-understanding-react-fundamentals](https://blogger.googleusercontent.com/img/a/AVvXsEjof7YWzY6ZdntOQsbpDwpGpAikpa6EncthnJ0rtOiQubSBWsAjA9ljUSlmdLoZkSeLibezdtGhQTxpIDrQE2BQZWLiHE7sgGgWVYlEj5Cvq-XTNBY4aBjGvoht-jZmaxBa-7d8aCaaaCuRf5gzDMszNmv453H05rO8ZDRF1DSBvXaNzmpNAZ6eOEOm=w640-h252) 

props에 해당되는 내용인 className과 children이 제대로 적용되었네요.
 
이제 React Element를 브라우저 상에서 보이게 해 볼까요?

```js 
  <body>
    <div id="root"></div>
    <script src="react.development.js"></script>
    <script>
      const element = React.createElement("div", {
        className: "container",
        children: Date.now().toLocaleString(),
      });
      console.dir(element);

      document.getElementById("root").appendChild(element);
    </script>
  </body>
``` 

![mycodings.fly.dev-understanding-react-fundamentals](https://blogger.googleusercontent.com/img/a/AVvXsEhrh7Sz_vV2oXLlbX_yRJ_IQlVb-q9ZYk225UXqVf1z2TUNyXF-dl9awnKFctqETt8LmHTs6oapyZCa_Prkv0-254B0jp2BMibtyx1OoxSuSO70kul4hgFkEUbQTr7z7hYyJGiTiSWee1_FxMGSNYN7hFcbxOZxSZhWT1jkegEe4EGXESpf1bXClLAL=w640-h130) 

우리가 맨 처음 자바스크립트로 div 태그를 id가 root인 div에 appendChild 했을 때와 같은 방식으로 적용했는데 위와 같이 에러가 발생했습니다.
 
React.createElement로 만든 엘러먼트는 HTML의 DOM 엘러먼트가 아니라서 그런 겁니다.
 
ReactJS의 Element를 DOM Element로 변환하는 것이 바로 ReactDOM입니다.
 
unpkg 사이트에서 아까와 마찬가지로 ReactDOM을 가져와 보겠습니다.
 
https://unpkg.com/browse/react-dom@18.1.0/

![mycodings.fly.dev-understanding-react-fundamentals](https://blogger.googleusercontent.com/img/a/AVvXsEiznvwk4EiWpjXywHCIx0f1jOi3nnj21gAlValQu33aKMv82RChjbFlPLeNmtWQIAkc99-wwtxhRFGbzTYxulHpuXPRINfm0GEqhY-FSheWZBKkVtEt0WTN43lpyJ0yu4nG0y1h62l9rC_xLzBLTK1VK850_HCw_XKfDxwaopzy5f6r3MyygljztgW1=w640-h478) 

  
우리가 필요로 하는 거는 바로 react-dom.development.js파일입니다.
 
이것도 로컬 파일로 저장해서 아래처럼 로딩해 봅시다.

```js 
  <body>
    <div id="root"></div>
    <script src="react.development.js"></script>
    <script src="react-dom.development.js"></script>
```    
 
위에서 로컬로 저장했던 react-dom.development.js 파일을 `<script>` 태그로 불러오고 브라우저 콘솔 창에서 ReactDOM을 인식해 볼까요?
 
![mycodings.fly.dev-understanding-react-fundamentals](https://blogger.googleusercontent.com/img/a/AVvXsEiL3eaq5n-P3pf92nltkJgxMSAEqvzp626EZLblsTW1TL1H33jfyZnjj-Bn8LnFkbKUn716XBwhcykJ2bhOGQHalyAUtOrxZGcgVgvFvpbwYLMD4JHFo_vL60-hdvx-ijKmOZFq4UB4tDrSUfHjmpD34z7hPLx4bPOPu5bngtmCAeluv_6FZjEb-Ies=w640-h324) 

reactDOM이 제대로 로드되었네요.
 
우리가 원하는 함수인 render 함수도 보입니다.
 
즉, React 엘레먼트를 reactDOM의 render 함수로 렌더링 하는 게 바로 React 엘러먼트를 HTML의 DOM 형식으로 바꾸는 겁니다.

```js
  <div id="root"></div>
  <script src="react.development.js"></script>
  <script src="react-dom.development.js"></script>
  <script>
    const element = React.createElement("div", {
      className: "container",
      children: Date.now().toLocaleString(),
    });
    console.dir(element);

    ReactDOM.render(element, document.getElementById("root"));
  </script>
```

![mycodings.fly.dev-understanding-react-fundamentals](https://blogger.googleusercontent.com/img/a/AVvXsEiNjT5BTsJQK0hilHuQy6l94tH-yV0IR5XefzUpka0NAeUaBc_A-TeUN4EJfFmzELiqER0EPJqSkq-3QVySHfunCSwPVBMxrG8_eYd_HR-Mh6bdBUXSum8PLsWxT8c1Ve6yg5I440s-t73Kt_ZYIpNi4p5ePl3_8lLQBvZywa1ydvxpY8tIkX2onV0n=w640-h198) 
  
React 18 버전부터 ReactDOM.render를 위와 같이 쓰지 말라고 하는데요.
 
React 18 버전으로 코드를 바꿔 볼까요?

```js 
  <body>
    <div id="root"></div>
    <script src="react.development.js"></script>
    <script src="react-dom.development.js"></script>
    <script>
      const element = React.createElement("div", {
        className: "container",
        children: Date.now().toLocaleString(),
      });
      console.dir(element);

      const container = document.getElementById("root");

      const root = ReactDOM.createRoot(container);
      root.render(element);
    </script>
  </body>
```

container 엘러먼트를 document.getElementById로 지정하고
 
ReactDOM.createRoot로 container 항목을 이용해서 Root를 만들고 그 Root에서 render 함수를 적용하는 방식입니다.
 
![mycodings.fly.dev-understanding-react-fundamentals](https://blogger.googleusercontent.com/img/a/AVvXsEgjizxI0AeRYURPsgydUwvrPj51_g_qd8g8mgGAVi1aWe5N42Bl8yRZewhnbJtbiAvEukCQCcYvv8vHAMuKqG0FXdKUwBZqH-9trES8Zv0IzU6VrNiRn5N-OIvMr41f1YUptym3lskeRRT7FisiqqMfc3VcjSdlD5ftabxACz1w_vZ7qFVgcBVzn9mw=w640-h174) 
 
이제 브라우 저상에서 완벽하게 React 엘러먼트가 적용되었네요.
 
그러면 React로 다음과 같은 중첩된 구조의 HTML 태그 구현을 어떻게 할까요?

```js 
	<div>
    <span>
      <p></p>
    </span>
  </div>
```

ReactJS의 props에 있는 children이 그 역할을 하는데요.
 
```js
	<script>
    const element = React.createElement("div", {
      className: "container",
      children: ["현재 시각 :", Date.now().toLocaleString()],
    });
    // console.dir(element);

    const container = document.getElementById("root");

    const root = ReactDOM.createRoot(container);
    root.render(element);
  </script>
```

React.createElement의 옵션인 children 항목에 Array를 지정해주면 무한정 데이터를 넣을 수 있습니다.
 
![mycodings.fly.dev-understanding-react-fundamentals](https://blogger.googleusercontent.com/img/a/AVvXsEiEasjekMkvHu0dEj6D7RM9IiM5jpeo5OaWdsOnPeZW7ciq0lPLN4bYYQtTk0y2XENa_Ep_5bVGVQ6Xuhw__W5MjB9P9SluDPiR7yN47g3EeJh_A7Cb9f9psYW9Idxkp313dzWHXCNcPqcS4TNEiDjcbLfHbN1sR3xm6Gvkwyso9I6GVpyAKMVW3W0W=w640-h248) 

브라우저에도 제대로 표시될 겁니다.

![mycodings.fly.dev-understanding-react-fundamentals](https://blogger.googleusercontent.com/img/a/AVvXsEih2WohuhIpTarQBn2GmlkCbpXG9AAvBtzeE28fp5bya-vV4rOnuJT03WWVZUGek_tW4dtrbuaFt6qW_br_BxXkE1C14tyMVrVH0BKQWD5R3UceI9vnbxli8eoxeSQ1LhoF1Y5IeKPQxGQMLAvByt5nUGFRJbLi68JuRvr9Y2YgxJK3Ry0YLdk-YipA=w640-h244)
 
결론적으로 말하면 children에 원하는 항목을 넣으면 되는데요.
 
children에 React.createElement항목을 넣으면 바로 HTML의 중첩 구조가 되는 겁니다.
 
```js
  const element = React.createElement("div", {
    className: "container",
    children: [
      "현재 시각 :",
      Date.now().toLocaleString(),
      React.createElement("span", { children: "It is span tag" }),
    ],
  });
``` 

![mycodings.fly.dev-understanding-react-fundamentals](https://blogger.googleusercontent.com/img/a/AVvXsEi8mn6hPDUWJqi5hBRu69MhH6EzjJ_lnAqLDsEmDKhPImCWKco0SS_lQYvhOC-NYuVfdavwIZyAgDm0KIsp7uDrOv1wIX2hGd9VZo2fGUiUs8eoJa6t5Ozi9qndtg0SlZsXpEUvo4XNDmuSszm-8Pu4JG0TTc-TExK3BlxBT8Ufxj6NwUPK4FIgiR6Y=w640-h122)

key 항목을 넣어야 한다는 ReactJS의 경고가 나왔네요.
 
중첩된 span 엘러먼트에 key 항목을 아무거나 넣어주면 됩니다.
 
```js 
React.createElement("span", { key: 1, children: "It is span tag" }),
```

이제 경고가 보이지 않게 되는데요.

```js 
	const element = React.createElement("div", {
    className: "container",
    children: [
      "현재 시각 :",
      Date.now().toLocaleString(),
      React.createElement("span", {
        key: 1,
        children: [
          "It is span tag",
          React.createElement("p", { key: 2, children: "It is a p" }),
        ],
      }),
    ],
  });
```

위 코드를 보시면 span 태그 밑에 또 p 태그를 만들었습니다.
 
이렇게 하는 것이 바로 HTML의 중첩 구조를 ReactJS 방식으로 구현하는 건데요.
 
React.createElement는 세 번째 인자(인수, argument)를 제공하는데요.
 
바로 children을 바로 세 번째 인자(인수)로 넣는 겁니다.
 
`React.createElement(”이름", {엘리먼트 특성}, ”세 번째 인수”)` 방식입니다.
 
세 번째 인수 방식은 무한정 넣을 수 있다는 점입니다.

아래와 같이요.

```js 
  const element = React.createElement(
    "div",
    {
      className: "container",
    },
    "현재 시각 :",
    Date.now().toLocaleString(),
    React.createElement("span", {
      key: 1,
      children: [
        "It is span tag",
        React.createElement("p", { key: 2, children: "It is a p" }),
      ],
    })
  );
```

위와 같이 해도 결과는 똑같습니다.
 
그런데 실제로 우리가 작성하는 React 코드는 위와 같은 방식이 아닌데요.
 
우리가 작성하는 ReactJS 코드는 JSX 스타일입니다.

```js 
	const element2 = (<div>
    현재 시각 : {Date.now().toLocaleString()}
    <span
      >It is span tag
      <p>It is a p</p>
    </span>
  </div>)
```

우리는 ReactJS 코드를 작성할 때 위와 같은 방식으로 작성하는데요.
 
그럼 JSX 스타일의 코드가 어떻게 아까 위에서 만든 React.createElement 방식으로 바뀌게 될까요?

```js 
  <body>
    <div id="root"></div>

    <script src="react.development.js"></script>
    <script src="react-dom.development.js"></script>
    <script>
      const element = (
        <div className="container">
          현재 시각 : {Date.now().toLocaleString()}
          <span>
            It is span tag
            <p>It is a p</p>
          </span>
        </div>
      );

      const container = document.getElementById("root");

      const root = ReactDOM.createRoot(container);
      root.render(element);
    </script>
  </body>
```

일단 에러가 어떻게 나오는지 볼까요?

강제로 JSX 방식으로 element를 만들어서 그걸 그냥 render 해 봤습니다.
 
결과는 에러인데요.

![mycodings.fly.dev-understanding-react-fundamentals](https://blogger.googleusercontent.com/img/a/AVvXsEjxMiDTsft6n0Yt8yNKFySNsK6A1xH-vbW2_6yrUAcspWx0FNWvdX9XMgIxpSLedy174Ikkqu5KTXgGcMUbnyw2jFdkINmvx-i-RlLhUmnVJBEsZjvPvdtLLeY2CsKmAkjqtwfgzvgzomivvhcZYOfmhVqlGEizvKsL3fWm2fcZu_6on-_WyyDaoGVS=w640-h92)  
 
위와 같은 SyntaxError가 나옵니다.
 
왜 그런 걸까요?
 
HTML이나 자바스크립트는 위 element 변수의 JSX 코드를 인식하지 못합니다.
 
실제로는 element 변수의 내용이 자바스크립트가 아니기 때문입니다.
 
그러면 뭐가 더 필요할까요?
 
바로 Babel 같은 JSX 컴파일러가 필요합니다.
 
Create-React-App으로 작성된 ReactJS 앱을 잘 보시면 webpack과 함께 babel이 설치되어 있는데요.
 
바벨(Babel)은 JSX 문법을 자바스크립트 문법으로 바꾸는 트랜스 파일 라이브러리입니다.

![mycodings.fly.dev-understanding-react-fundamentals](https://blogger.googleusercontent.com/img/a/AVvXsEjd7irlsYUtT7mVtrFhStnuNHp8VAr2e0Iyg6J6zHGHNlgkn2VyGKU5hBBlDrurTpJLRA6Z4WVK5iELtHk1g76_ORghdjAu-lg31PNcbUUA5Gfh5R8UYipQO-Avh1glvjOoOTsmxYLh4W4fXr5_IpFQx84TVG_MdJ2oo3Ijf3TwP_uY55Ghh3ixd8nB=w640-h422) 

위 사이트에서 “Try it out”을 눌러서 테스트해 볼까요?
 
![mycodings.fly.dev-understanding-react-fundamentals](https://blogger.googleusercontent.com/img/a/AVvXsEhU35x8v1fkN8Gqj1MQxCOgvmbXjE9IjK2x1hDthYy76L94y_js_y2t5FULse9L31OsFoa7oe6n-DzGpP_f8jcChwVo7MWj85onLxqyiqBWKtpQD74HoTmcQPmuZrxY0yhkWyDuUck6-q7JIJPEK7cqvzBQtlwzP_z-ir2aF_-hMKBV2JLrDA2rEl2s=w640-h262) 


JSX 스타일이 React.createElement 방식으로 변환되었네요.
 
그럼 우리의 index.html 파일에 babeljs를 어떻게 적용시킬까요?
 
다시 unpkg 사이트가 갑시다.
 
https://unpkg.com/browse/babel-standalone@6.26.0/
 
![mycodings.fly.dev-understanding-react-fundamentals](https://blogger.googleusercontent.com/img/a/AVvXsEiQzTRVjYudQQjSzALtutsGuMI38eb1zjLHjOaR_c34HWT8bTEtbWk3irQE1NeaUn_20AeU0qfrc3eRS5bjlscGVUxo9Ma6fBRZUL75Q3HvJer-FukI_CNMa6d-Kbi71DtrLsSM0yhzDsi_nUpkC3MiwQXFULgE8bYsAeEuNVVrZaqbMyntRsIZ4QJS=w640-h336) 

```js 
https://unpkg.com/browse/babel-standalone@6.26.0/babel.js
```
 
위와 같이 babel-standalone 파일을 로컬로 저장하면 됩니다.
 
babel.js 파일로 저장해 볼까요?

```js 
  <body>
    <div id="root"></div>

    <script src="react.development.js"></script>
    <script src="react-dom.development.js"></script>
    <script src="babel.js"></script>
```

그리고 나서 위와 같이 babel.js를 script 태그로 불러옵니다.
 
그러면 babel 컴파일러가 어떻게 우리의 JSX 코드를 어떻게 컴파일할까요?
 
다음과 같이 JSX 코드가 들어있는 script 태그를 바꾸면 됩니다.

```js 
<script type="text/babel">
```

script의 type를 “text/babel”이라고 지정하면 babel 컴파일러가 알아서 컴파일해줍니다.

```js 
  <body>
    <div id="root"></div>

    <script src="react.development.js"></script>
    <script src="react-dom.development.js"></script>
    <script src="babel.js"></script>

    <script type="text/babel">
      const element = (
        <div className="container">
          현재 시각 : {Date.now().toLocaleString()}
          <span>
            It is span tag
            <p>It is a p</p>
          </span>
        </div>
      );

      const container = document.getElementById("root");

      const root = ReactDOM.createRoot(container);
      root.render(element);
    </script>
  </body>
```

전체 Source Code이고 실행 결과는 아까와 같이 아래 그럼처럼 잘 나오게 됩니다.

![mycodings.fly.dev-understanding-react-fundamentals](https://blogger.googleusercontent.com/img/a/AVvXsEh_lSJ0DqOd1e4E83pUrO8-o_-JDiZHiQn6s_Yrly906d5U7FmeLI1Oz-VsWByojpSENICmxoRE6vWIACu-antxLaDIMITmWLY7-bs7fY0_DOCfc4DS2fO4r289cZdHsiA9yTPXYFOqJWvR6RB7ZZ0hOHMzBw-C56foDStI5kvjhXDnUKRmzeWHEi2J=w640-h98) 


babel에서 경고를 날리는데 크게 문제 될 건 없어 보이네요.
 

## 끝맺음
 
뭔가 간단해 보이지 않나요?
 
이제 ReactJS의 작동원리는 이해했으니까 ReactJS 코드도 더 잘 짤 수 있지 않을까 싶네요.
 
희망사항이지만요.

그럼.
