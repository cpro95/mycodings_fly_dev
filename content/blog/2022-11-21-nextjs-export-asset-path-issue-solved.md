---
slug: 2022-11-21-nextjs-export-asset-path-issue-solved
title: Next.js export 할 때 /_next/static 경로 설정 문제
date: 2022-11-21 08:01:53.365000+00:00
summary: next
tags: ["next.js", "export"]
contributors: []
draft: false
---

![](https://blogger.googleusercontent.com/img/a/AVvXsEjO0pinCN8SoAcCG9aD6yt4u1Q3hfqx5x-92ANuKkZycLoLP157vS8sNiLJkB4-f2vohOP8vp9Z8ZkG2cAOcrvFzoWvy1rdxXr2zw7Cur1QgFiLboIZAaehcWgex3oUm2veYeP_WGKnrPxGhw-JunK_jFcsV7KiWMhBxC96LK17RgBBOALWu2EDBYKk)

안녕하세요?

최근에 제가 github.io에 제 포트폴리오 페이지를 새롭게 리뉴얼했었는데요.

Next.js 최신 버전과 Framer-Motion 등을 적용해서 나름 역동적이게 만들었습니다.

그래서 최종적으로 github.io에 static 파일로 업데이트하려고 했는데, 아래와 같은 문제가 발생했습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhW-NMJ1CDoPyxzcsqhdRSsrIkLfgIYRu-JIZt3GNS7bXflfYdw2oyi1BGt3ia00GVNVaXLZAc0LmjYIMjK_7dR0sUim5apKfBfHKpUZhsnc8LG-sZfa1Wx1beV9GeV1AKJhPBzR3fPWSXvBiiHmXD7CDRdSIa_wqrwUTIG6xZM_IdZGYOSi6-Ikg_b=w400-h336)

위 그림처럼 페이지가 깨져서 보이는 겁니다.

이런 문제는 css 파일과 js 파일이 제대로 로드되지 않은 문제인 거죠.

그래서 실제 Next.js가 어떻게 build 후에 export를 하는지 알아보았습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhXn402aF083Sz-lfryA__Dw0xBzJYHmh12kx_UoqyciY4vABrATGKVEBANSO9QzbA0OhhR-YWBT3wKaPNuZ9NCgXfoMb5WpL2i5MrDatODTVPLW0VrzNpBN-v0oeH2Zhna_82g-p1DI6EPk9VgnXVwV1Zz05IRBLkI-1Wo9h0diXC8bYhU1S8Z_-IT=s16000)

위 그림과 같이 경로 최상위에 '/'를 써서 절대 경로로 사용하고 있네요.

그런데 github.io는 이걸 인식 못하고 있습니다.

그래서 크롬 Devtools에서 맨 앞 절대 경로 '/'를 빼니까 잘 작동되더라고요.

그럼 Next.js export 할 때 어떻게 해야 할까요?

일일이 export 된 파일을 고치는 건 불가능하니까요.

next.config.js 파일에 다음과 같이 옵션을 주면 됩니다.

```js
module.exports = {
    assetPrefix: ".",
  };
```

assetPrefix 옵션은 asset 관련 경로에 위에서 정한 값을 넣으라는 건데요.

이렇게 하고 next export 하면 아래와 같이 경로명 앞에 "."를 무조건 넣어줍니다.

```js
    <script
      src="./_next/static/SAfl4nj0fgiMC88TrHu7s/_ssgManifest.js"
      async=""
    ></script>
```

이제 다시 next build & export를 하고 github.io에 업데이트했습니다.

이제야 모든 자바스크립트나 CSS 파일이 로드가 제대로 되고 있네요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgk-vaOjb9cmqfltfOlqlYtXzmIwTaq6i_U8SUT85EXtRy_3oWn_lY_VWEKIYAg6fMf5wHnFMFJhpoAdPtNiMt1eQpOw0zGh24iydodm5cqUTb7KMkL27kL32cF4pgh25k9sP6HClVvla8Je3ZDhuGre6Q0wI-PtXjfcNMURCrvu0Bzgww47Mh2uupa=s16000)

감사합니다.

