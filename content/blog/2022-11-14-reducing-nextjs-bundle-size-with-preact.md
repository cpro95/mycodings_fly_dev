---
slug: 2022-11-14-reducing-nextjs-bundle-size-with-preact
title: React를 Preact로 대체하여 Next.js 번들 사이즈 줄이기
date: 2022-11-14 01:03:13.881000+00:00
summary: React를 Preact로 대체하여 Next.js 번들 사이즈 줄이기
tags: ["next.js", "react", "preact"]
contributors: []
draft: false
---

![mycodings_fly_dev-Preact-nextjs](https://blogger.googleusercontent.com/img/a/AVvXsEjO0pinCN8SoAcCG9aD6yt4u1Q3hfqx5x-92ANuKkZycLoLP157vS8sNiLJkB4-f2vohOP8vp9Z8ZkG2cAOcrvFzoWvy1rdxXr2zw7Cur1QgFiLboIZAaehcWgex3oUm2veYeP_WGKnrPxGhw-JunK_jFcsV7KiWMhBxC96LK17RgBBOALWu2EDBYKk)

안녕하세요?

오늘은 Next.js 번들 사이즈에 대해 알아보겠습니다.

Next.js를 일단 클린 하게 설치해 볼까요?

```bash
npx create-next-app@latest reduce-bundle-size-of-nextjs
```

일단 Next.js를 설치하셨으면 Dev 서버를 돌리는 거 말고 정적 파일로 export 하는 명령을 추가해야 하는데요.

package.json 파일에 아래와 같이 추가하면 됩니다.

```js
"scripts": {
    "dev": "next dev",
    "build": "next build && next export",
    "start": "next start",
    "lint": "next lint"
  },
```

next build 후에 next export 명령어를 추가했습니다.

그럼 out 폴더에 최종 빌드된 정적 파일이 저장되는데요.

정적 파일로 next export 하기 전에 Next.js Image 패키지를 제거해 줘야 합니다.

Image 패키지는 정적 파일로 컴파일되지 않기 때문입니다.

pages/index.js 파일에서 아래 그림과 같이 image 패키지 관련 코드만 삭제하시길 바랍니다.

![mycodings_fly_dev-Preact-nextjs](https://blogger.googleusercontent.com/img/a/AVvXsEhgzWv2vr1aLCF72uJNUeQ14oATlQFPrVOWNWGNWlR3ui0XiMvawzOX8ki20tFuxM6WjvRjwl0VGkQjWNUV_b02u_H02rt8qFT6a1KDs8db_eW1xZhmrlkbqnChmv2aT7IUIeE8gCYzOc3bbViGx1Hta17WFVWDr94BBeJgjK9utS39f3vBlI7bn99H)

![mycodings_fly_dev-Preact-nextjs](https://blogger.googleusercontent.com/img/a/AVvXsEgmTdiBgbc_3z3Y-43qPenkKIrXx2_5vONUG5NhWg9nYBZ_MPzQT2qjsT_IE-aAxckdvgbP9GWL6o6xiajHowlbmDkcqFfAzccc9AAMhdIK8A2FQn4bBGdxdL_XouunQ-n4rctEiNvph2L61IzbOhGR0x6FlMq2lHyvWFJHPL9_RzlYVtCbec99oFD4)

그럼 최종적으로 next build와 next export 해볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEiTayGjxYVdkb0ga-KWIXXnXxgxQZEf1QMrbsFeGjOnbT4L_OVkqVI_JmJxTd4JmsyXnE4VU_c7Oaw1ofvFM63GSbCjpDUWBEnLkQT36CnImb_HJcWvlc9c2VxpsWAznndtWyirlUZ7IkfK1W6W3uhU77i87W1Z90-9ftsWveAYiMevlYRHHmI4Dwbd=s16000)

out 폴더에 저장되었다고 나오네요.

out 폴더의 크기를 측정해 볼까요?

![mycodings_fly_dev-Preact-nextjs](https://blogger.googleusercontent.com/img/a/AVvXsEg08mWQhluKLGNkAbsUSBkAgyeNgXjcR2vBzVZYIeIjV2w9Zub2xLyDOQlYE5W9i9mSIqflRt-b3V1bfN6KN2vnObpaBR498YtscyeIERt3NctlY5ZguvUag5qIoSkbUsbYlX0r74g2SOFkHVZZikzDJ437B53jgc355Jgs8n48HWrpEby9hmJ1wW2A=s16000)

394Kb가 나왔습니다.

![mycodings_fly_dev-Preact-nextjs](https://blogger.googleusercontent.com/img/a/AVvXsEh4XKbVlQMaWMxwiLLiSyoIX8O_dez2_ziZ2jMCZ8a8v4hCeLGKq0e3v6gxJ4wek6pagukh28VeUq-BwYYyVt1k7qbWj6AWxt72fJkvx0YAXe_oF3HWwabmgI8colxWLdMkjVakRyPr9ZJk2P-_wZeqn9aZiZ3_ZspwN6OjtOELLEYe5SgNQ_iTE-0s)

위 그림처럼 framework이란 자바스크립트 모듈이 있는데 이게 바로 react 패키지입니다. 총 139Kb를 차지하고 있네요.

<hr />

## Build시에만 Preact로 Build 하기

Preact는 React를 대체할 수 있는 초경량 UI Framework인데요.

같은 API를 쓸 수 있는데 사이즈는 3Kb밖에 안되기 때문에 정말 가볍습니다.

React 이벤트 처리에서 자체 로직을 쓰는데 비해, Preact는 브라우저의 네이티브 API를 쓰기 때문에 가볍다고 합니다.

Preact와 React 차이점은 [여기](https://preactjs.com/guide/v8/differences-to-react/) 링크에서 확인하 실 수 있을겁니다.

그럼 Preact를 이용해서 Next Build를 진행해 볼까요?

먼저, Preact를 설치합시다.

```bash
npm install preact
```

위와 같이 한개의 패키지만 설치하면 됩니다.

그리고 next.config.js 파일에서 build 시 react를 preact로 대체시키는 명령어를 작성해 줘야 합니다.

next.config.js파일을 열어서 아래와 같이 명령어를 추가해 줍시다.

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      Object.assign(config.resolve.alias, {
        react: "preact/compat",
        "react-dom/test-utils": "preact/test-utils",
        "react-dom": "preact/compat",
      });
    }
    return config;
  },
};

module.exports = nextConfig;
```
위 코드를 보시면 webpack 부분만 추가했고, Dev 모드 시에는 React를 그냥 쓰지만 Build시에는 Preact를 쓰게끔 해주는 코드입니다.

이제 out 폴더를 삭제하고 다시 next build를 해볼까요?

![mycodings_fly_dev-Preact-nextjs](https://blogger.googleusercontent.com/img/a/AVvXsEjGIhfoDL57SqQvgF3dB-1ufNh8nhRe30yZchN7FPfirblWBdFjxv78LopPA4a3DDgBSnxF-609wY9BqcFK4johtWOYGmP6NIDD8aHEkbxjxezASctkYZo1SLWDYW-44G4Frt72Cu0tZnLW2PPjOInzY3-tHgSokg6EhlRsLKR94ACMJtSIgie4rMLw=s16000)

위 그림처럼 next build 명령어가 잘 작동되고 있습니다.

이제 out 폴더 크기를 볼까요?

![mycodings_fly_dev-Preact-nextjs](https://blogger.googleusercontent.com/img/a/AVvXsEiCLTnkMGOJ255Ua6cqmpUWnl93AtrX5GXU2pG9in9myGuD4FtJRdFSZYLY6j70R6_HZw4Dh0UhxrSzowSKwSUR3hvFbNyT9JeT1Po10nWEGEJ6s8q1sZZlikAWTATAPJ-kMCAY7ARdYpE3OfTIDMwjdlcs4crrb6rOKlqJGhUdRxvTDQyEulImZgcO=s16000)

281Kb로 줄었습니다.

아까 위에서 React로 build 했을 때는 394Kb였는데, 상당히 많은 양이 줄여졌습니다.

Preact Framework 크기를 볼까요?

![mycodings_fly_dev-Preact-nextjs](https://blogger.googleusercontent.com/img/a/AVvXsEi8SpieK-OLsKxrIV3nV37iR4dHOAq0Zlaf4HEf5oPXp_hQbsNXwTYJAb--N8bA1pmm250kVZrwi6EnUztN_sCrKGB_ZDYcFZcS_WcuW0iz6TL-0SZnIDaj9eaQkulkjLUBujg-3SzNkmZcmMtxSqqQwhMjktLBGAwy3spjpWUgtygbfD8Z3YtDjKvY=s16000)

위 그림을 보시면 146Kb인데 아까 React의 경우 Framework과 main.js 파일 두 가지로 총 260Kb가 있었지만 Preact의 경우 한 개 파일로 146Kb만 있습니다.

상당히 많이 줄여졌네요.

<hr />

앞으로는 개발 모드일 때는 React 사용하고 Build시에는 Preact를 이용해서 Next.js를 컴파일하면 전체 페이지 사이즈를 줄일 수 있을 겁니다.

그럼.