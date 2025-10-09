---
slug: 2023-03-24-vworld-map-open-api-with-nextjs
title: Next.js로 브이월드(VWorld) 공간정보 오픈 플랫폼 지도 오픈 API 사용하기
date: 2023-03-24 13:49:31.558000+00:00
summary: Next.js로 브이월드(VWorld) 공간정보 오픈 플랫폼 지도 오픈 API 사용하기
tags: ["next.js", "vworld", "map", "react"]
contributors: []
draft: false
---

안녕하세요?

오늘은 내 홈페이지에 지도를 넣어볼까 하는데요.

웹에서 지도 서비스를 해주는 데는 많이 있습니다.

구글, 카카오, 네이버, 빙 맵 등 여러 가지가 있는데요.

전부 유료입니다.

만약 제 웹이 대박을 터트린다고 했을 때 사용료를 어마어마하게 내야 한다면 좀 부담이 되겠죠.

그래서 무료 지도 서비스를 찾다가 정부에서 운영하는 공간정보 오픈 플랫폼인 VWorld에 대해 알게 되었습니다.

VWorld는 오픈 API도 운영하는데요.

무료입니다.

오픈 플랫폼이라 그런지 사용된 기술도 OpenLayers를 기반으로 맵 타일만 멋지게 만들어놨는데요.

일단 홈페이지에 가서 오픈 API Key를 받아 보도록 하겠습니다.

[https://www.vworld.kr/dev/v4api.do](https://www.vworld.kr/dev/v4api.do)

위 코드로 들어가서 일단 가입 및 로그인해야 하는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEh-ZQKQvrfBY9qDfd82ljZQj2H8_p98IwVUDzxKQtVuoJ5skS97NLTeQaBI1VUbEI6_KJt_bRkOUBrh8nLkRnC_8zfL3ZXyWUy6vqJUS7fnpGL58XMXCCjmoPV1ormPjjbU53E7duEkXoza6PQZ9697t1voxFiPdiK8_VuGQhNu4wZH5-djKyuzs1MF)

여기서 인증키 발급으로 들어갑니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEg8TGOqx4hsZpvc4f1HhFzjta201Reth0uUOSeZyXIpKGcmpngusED-hc4AIZUWFiu6GGKB-RY0OnPVnk0ljVFCD_xgFVi_pN2_ycYuFPOsLRNooDDo2jTUTWoUkSgoxP63sbMgsT1YOMgg3MNLxYUQJF_zlr8o8z_31Pnc8x8WZwl2aSLdnMCreFtq)

위와 같이 빈칸에 적당히 넣으면 자동 발급되는데요.

활용 API에는 꼭 WMTS/TMS API를 선택해야 합니다.

이게 우리가 사용할 서비스이기 때문이죠.

인증키 관리메뉴에 가면 아래와 같이 내 Key가 보입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhttspPXwH6wh0YKW_bPdZyZmMBKM4ZAnXtxWJFSncMeHidl4-hYTKRO_sYjim4upPoN-o8NB-ct-TAt20P8kx4nh40WTDBsHx6WbdXPYDPDSEtwIrJsXYtucqCGNTXUJWm_pLSviBxOXicwlVJEZ_I2-rh5JSlix0Z5-SR067VQQufRDZ9qIi5c2vJ)

준비가 끝났네요.

그럼 본격적인 개발에 들어가 볼까요?

## VWorld가 제공하는 서비스로 지도 만들어 보기

먼저, VWorld가 제공하는 WMTS API가 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgcikXy-RrtvjnJo4_5ZF83hLdM558JZ-HOeihImA9BpDqT42KgoCUOi-JzA2Zd4u00fhJg3icj-dGYrvdirLzXJLPSHJFLrTh3It1bckpFonOa5YGNOHHrcedUy2Cemkxow_iQHo4MufFESyFHUhdtLwQ_A9Zrk28BcfCtbnVtFAl130x70HWAf6zq)

위와 같이 나옵니다.

이제 테스트를 위한 Next.js 템플릿을 만들까요?

```bash
npx create-next-app@latest --typescript --eslint ./map-test

✔ Would you like to use `src/` directory with this project? … No / Yes
✔ Would you like to use experimental `app/` directory with this project? … No / Yes
✔ What import alias would you like configured? … @/*
Creating a new Next.js app in /Users/cpro95/Codings/Javascript/blog/map-test.

Using npm.

Initializing project with template: default


Installing dependencies:
- react
- react-dom
- next
- typescript
- @types/react
- @types/node
- @types/react-dom
- eslint
- eslint-config-next


added 271 packages, and audited 272 packages in 15s

102 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
Initialized a git repository.

Success! Created map-test at /Users/cpro95/Codings/Javascript/blog/map-test
```

이제 Next.js 빈 템플릿에 모든 걸 다 지우고 \_app.tsx, \_document.tsx, index.tsx 파일만 남겨둡시다.

```js
// index.tsx 파일

import Head from 'next/head'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>VWorld Map Test</title>
        <meta name='description' content='VWorld Map Test' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main>
        <h2>VWorld Map Test</h2>
        <div id='map' style={{ width: 500, height: 500 }}></div>
      </main>
    </>
  )
}
```

## OpenLayers 설치하기

VWorld나 다른 모든 지도 데이터는 OpenLayers를 이용하고 있는데요.

다음과 같이 OpenLayers 패키지를 설치합시다.

```bash
npm i ol
```

## 지도 데이터는 ClientSide 코드여야 함

ClientSide에서 작동하려면 React에서는 useEffect 훅 밖에 없는데요.

지도 생성과 가공 코드를 useEffect 훅 안에서 하라는 뜻입니다.

```js
import Head from 'next/head'
import { Inter } from 'next/font/google'
import { useEffect, useState } from 'react'
import 'ol/ol.css'
import { Map, View } from 'ol'
import { OSM } from 'ol/source'
import { defaults } from 'ol/control'
import { fromLonLat } from 'ol/proj'
import { Tile } from 'ol/layer'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  useEffect(() => {
    // create Map instance
    const map = new Map({
      controls: defaults({ zoom: true, rotate: false }).extend([]),
      layers: [
        new Tile({
          source: new OSM(),
        }),
      ],
      target: 'map',
      view: new View({
        center: fromLonLat([127.189972804, 37.723058796]),
        zoom: 15,
      }),
    })
  })

  return (
    <>
      <Head>
        <title>VWorld Map Test</title>
        <meta name='description' content='VWorld Map Test' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main>
        <h2>VWorld Map Test</h2>
        <div id='map' style={{ width: 500, height: 500 }}></div>
      </main>
    </>
  )
}
```

실행결과를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEgasuOoCezSuIh9xW2Pye5vHml-wZUzSIklH-yHeVq7LSnr7mot1x-3sRWWnQSnBEDTlH9cgHMS5dmpf1Jaf4APG5T2vkkRHoAR8mfCUFLxhVygZxZNJQxpSn3pu9ladRjyWecRvlkgpaVA7uNIy1bGVB-3gCl1HOfRNgSFOpSsynTui1jKtw1kKpla)

위와 같이 지도가 아주 잘 나옵니다.

지도가 두 번 나오는 건 리액트의 dev 모드라서 렌더링이 두 번 되는 현상 때문입니다.

production 모드에서는 발생하지 않으니까 걱정 안 하셔도 됩니다.

이제 코드 설명을 해보겠습니다.

Map이라는 객체를 하나 크게 만들면 됩니다.

그리고 그 Map이라는 객체에, HTML에 꽂을 곳만 지정하면 되는데요.

바로 target : 'map' 요 부분입니다.

```js
<div id='map' style={{ width: 500, height: 500 }}></div>
```

위 코드처럼 div 태그의 id를 map이라고 했고 Map 객체에 target을 'map'이라고 적은 겁니다.

지도가 여기 빈 div 태그 위치에 그려진다는 얘기죠.

단 여기서 주의해야 될 점은 div 태그가 extrinsic width, height를 가져야 한다는 겁니다.

즉, 명목적으로 높이 너비 값이 있어야 지도가 표시된다는 겁니다.

만약 width, height 값이 없으면 div 태그는 비어 있기 때문에 실제 브라우저에서도 아무것도 안 나오는 형국이고 결국 지도도 안 나옵니다.

그래서 위처럼 적당한 width, height 값을 넣어야 합니다.

Map 객체에 지정해야 할게 4가지가 있는데요.

controls, layers, target, view입니다.

controls는 전체 맵의 컨트롤 부분입니다.

```js
controls: defaults({ zoom: true, rotate: false }).extend([]),
```

위 코드처럼 디폴트 컨트롤을 지정해 줄 수 있고 또는 extend 메서드로 확장도 할 수 있습니다.

만약 Fullscreen 기능을 추가하고 싶다면 아래와 같이 하면 됩니다.

```js
controls: defaults({ zoom: true, rotate: false }).extend([new FullScreen()]),
```

두 번째는 바로 layers라고 합니다.

레이어는 Map이 생성되고 거기에 어떤 데이터를 넣느냐는 겁니다.

위에서는 아래와 같이 했는데요.

```js
layers: [
  // OSM is OpenStreetMap
  new Tile({
    source: new OSM(),
  }),
],
```

지도 데이터는 OpenLayers의 경도, 위도 규칙에 Tile 이라는 그림파일을 지정해 줘서 실제 우리가 보는 지도처럼 보이게 하는 건데요.

위 코드처럼 우리는 new Tile로 Tile 객체를 만들었는데 바로 OSM 입니다.

OSM은 전 세계 지도 데이터이고 Opensource 인데요.

OpenStreetMap 이라고 합니다. 공짜죠.

그리고 3번째 target는 아까 설명해 드렸고,

마지막 View 부분입니다.

View 부분은 최초로 지도의 어느 부분을 보여주는지 정해주는 코드입니다.

```js
view: new View({
  center: fromLonLat(center),
  zoom: 15,
}),
```

center 값에는 현재 어느 위치를 보여줄까 하는 건데요.

저는 [127.189972804, 37.723058796] 값을 골랐는데요.

꼭 배열로 집어넣어야 합니다.

이제 Map 객체를 만들었고 이 Map 객체를 브라우저에 나타내 보는 것도 했는데요.

이제 지도 위에 마커를 넣는 걸 해보겠습니다.

## 마커 넣기

```js
import Head from 'next/head'
import { Inter } from 'next/font/google'
import { useEffect, useState } from 'react'
import 'ol/ol.css'
import { Map, View } from 'ol'
import { OSM } from 'ol/source'
import { Tile, Vector } from 'ol/layer'
import { defaults } from 'ol/control'
import { fromLonLat } from 'ol/proj'
import Point from 'ol/geom/Point.js'
import Feature from 'ol/Feature.js'
import { Style, Text, Icon } from 'ol/style'
import VectorSource from 'ol/source/Vector.js'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  useEffect(() => {
    // create Map instance
    const map = new Map({
      controls: defaults({ zoom: true, rotate: false }).extend([]),
      layers: [
        new Tile({
          source: new OSM(),
        }),
      ],
      target: 'map',
      view: new View({
        center: fromLonLat([127.189972804, 37.723058796]),
        zoom: 15,
      }),
    })

    let svgIcon: string
    if (process.env.NODE_ENV === 'development')
      svgIcon = 'http://localhost:3001/marker-default.png'
    else svgIcon = 'https://map-test.pages.dev/marker-default.png'

    let marker = new Feature({
      geometry: new Point(fromLonLat([127.189972804, 37.723058796])),
    })

    let myStyle = new Style({
      text: new Text({
        text: 'Hello Map',
        font: 'bold 14px sans-serif',
        offsetY: 10,
      }),

      image: new Icon({
        anchor: [0.5, 1],
        src: svgIcon,
        scale: 1.0,
      }),
    })

    marker.setStyle(myStyle)

    // create a vector layer and add the marker feature to it
    const markerLayer = new Vector({
      source: new VectorSource({
        features: [marker],
      }),
    })

    // add myLayer
    map.addLayer(markerLayer)
  })

  return (
    <>
      <Head>
        <title>VWorld Map Test</title>
        <meta name='description' content='VWorld Map Test' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main>
        <h2>VWorld Map Test</h2>
        <div id='map' style={{ width: 500, height: 500 }}></div>
      </main>
    </>
  )
}
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEik1-_WtyMTEucdMl32ytPUyvWJlToVw4kP0LQWgsrYQ-aH69UdK4XwfMoPLZIOg7OuuZuTs0iqTk2oqHo4FI2DhaMxm-xo6JwoTmSsbh_wjvu01LgrYjBCqm5-zr-E2vnqzBxZ8CEi9mjHdAaEj3mD2H3ET8OwbvVSJvSPZ3Amnynf4xfKxyfSEZRI)

실행 결과를 보시면 마커가 아주 잘 보이네요.

마커를 만드는 방법은 Vector를 만들어야 합니다.

Tile, Vector 모두 ol/layer에 있으니 헷갈리시면 안 됩니다.

특히 Vector는 ol/source에도 있기 때문입니다.

코드를 보시면 좀 이해하실 수 있을 겁니다.

최종적으로 map.addLayer(markerLayer) 명령어로 아까 만들었던 Map에 레이어를 추가하고 있죠.

## 지도 타일을 브이월드 지도로 바꾸기

지금까지 지도는 별로 보기가 안 좋았는데요.

바로 OpenStreetMap 지도이기 때문입니다.

그럼 브이월드 지도로는 어떻게 바꿀까요?

```js
import { XYZ } from 'ol/source'
```

먼저 XYZ를 import 하시고,

Map 생성 코드를 아래와 같이 바꾸시면 됩니다.

```js
const map = new Map({
  controls: defaults({ zoom: true, rotate: false }).extend([]),
  layers: [
    // new Tile({
    //   source: new OSM(),
    // }),

    // VWorld Map
    new Tile({
      visible: true,
      source: new XYZ({
        url: `http://api.vworld.kr/req/wmts/1.0.0/API-KEy/Base/{z}/{y}/{x}.png`,
      }),
    }),
  ],
  target: 'map',
  view: new View({
    center: fromLonLat([127.189972804, 37.723058796]),
    zoom: 15,
  }),
})
```

브이월드 맵을 쓸 수 있는 WMTS 주소가 바로 위 코드에 나와 있는 주소인데요.

API-Key 부분에는 맨 처음 브이월드에 가입하고 인증키 받을 걸 넣으면 됩니다.

이제 실행 결과를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEhxP5JG5P3CA706NEBw5Akt4mfOv5lQnQh523qiacI6G5ppXbyAoHnacGCopPcmnj6EwjsMqnM0XKEH1JRpv-GyNw4UyVnWzCPQuAJCaRhJTq7h4LUDNVY_gzRoqMXGciFCNC3vXW4Jb03lp70wTqqY74Hf6U3-fVeuekTqB4-ix_oC1oTzrpbb7SrU)

위 그림을 보시면 지도가 훨씬 깔끔해졌습니다.

좀 더 멋진 걸 보여드릴게요.

먼저, WMTS API의 요청파라미터를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEiiw98jdnOUXZPwA2Hwe_E2UTrKcjY5AwAaFyivml9t87nQeRFxeroetKgVLarE8BhnVGwdwvtLwxlzS2_PDxKj-G3SnkpFkoQIl3cjhClyNeDTegzkdfCBXtIkodlkQAG2fNDzS1WCtyjTX8JNuiBlcBxbFvp6DpuhHPiY8qMm71VoxGw6DfKd1v0Z)

tileMatrix에 Base, gray, midnight 등 여러 가지를 넣을 수 있네요.

midnight 한번 넣어 보겠습니다.

```js
new Tile({
    visible: true,
    source: new XYZ({
      url: `http://api.vworld.kr/req/wmts/1.0.0/API-KEy/midnight/{z}/{y}/{x}.png`,
    }),
  }),
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEgodPE2lbE5d2sJlsaqKi04R8E0VGJRU5AQTSA6bdpOGvXNfqC7qNkZU2wMi_hR6fcH_Tkt-0E9kMb5VKbflGybLNkxK5xd-PHmWyzV1XDLIohViq3BCi4zy4j0xRlhdE9T0C8p3I9OI36oO1ihtYTzJBZR6EHeicmfEGMyNxIg6ej1dKVdH4STyneT)

위 그림을 보시면 midnight이 무슨 뜻인지 쉽게 이해되실 겁니다.

그리고 중요한 점은 브이월드 WMTS 요청 주소 형식은 위 코드에 나와 있는 XYZ 형식으로 쓰셔야 합니다.

브이월드 API 설명서에 나와있는 형식으로 쓰면 안 되더라고요.

## 마커를 클릭했을 때 팝업창 오버레이에 만들기

이번에는 아래 그림처럼 마커를 클릭했을 때 간단히 설명을 보여줄 수 있는 팝업창을 만들어 보도록 하겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEg2BO-yfxCegST8bH3FLeax8KXY0c3sooVCorw5Huvhb6O_LArjl01RZ_RKPLpd33t4rN_iKykJUty9VYv9VGWtVwwQW5etm4-HCpF9yQrehVXjSOKgSWAVJU6t7f6kAvsNYFawB181Rc1QsyrZQUyDXKyR-9EJaoK6sumVDOf5qfEKgYzg6kPbt2yE)

일단 우리가 만든 useEffect 훅 안의 코드에서 마지막에 몇개 추가하도록 하겠습니다.

먼저, 맵 위에 클릭했을 때의 이벤트리스너를 만들어야 하는데요.

useEffect 훅 끝부분에 아래와 같이 넣으면 됩니다.

```js
...
...
...

// add myLayer
map.addLayer(markerLayer)

// 여기까지가 기존 코드 부분입니다.

// 아래 코드는 마커를 클릭했을 때 이벤트 처리 로직입니다.

map.on('click', function (event) {
  map.forEachFeatureAtPixel(event.pixel, function (feature: any) {
    const coordinate = feature.getGeometry().getCoordinates()
    const attributes = feature.getProperties()
    const name = feature.get('name')
    const tel = feature.get('tel')
    const address = feature.get('address')
    // create popup with name and tel attributes
    const popup = new Overlay({
      position: attributes.geometry.flatCoordinates,
      element: document.createElement('div'),
    })

    const content = document.createElement('div')
    content.innerHTML = `
          <div class="card w-full bg-base-100 shadow-xl">
            <div class="card-body">
            <button class="btn btn-square btn-xs md:btn-sm bg-base-100 text-gray-700 font-bold hover:text-gray-200 popup-close">
            X
            </button>
              <div class="grid text-xs md:text-sm">
                <div>${name}</div>
                <div>${tel}</div>
                <div>${address}</div>
              </div>
            </div>
          </div>
        `
    popup.getElement()?.appendChild(content)
    map.addOverlay(popup)

    const closeButton = content.querySelector('.popup-close')
    closeButton?.addEventListener('click', () => {
      map.removeOverlay(popup)
    })
  })
})
```

위 코드는 클릭 시 Feature에서 데이터를 얻어 오고 있습니다. name, tel, address 정보인데요.

그럼, 우리가 지도상의 위치를 Point로해서 Feature 객체에 넘겼는데요.

그 부분에서 특별히 원하는 값을 설정할 수 있습니다.

아랫부분을 보시면 Feature 객체에 geometry 객체만 설정하는 것이 아니라,

우리가 원하는 코드도 설정할 수 있습니다.

```js
let marker = new Feature({
      geometry: new Point(fromLonLat([127.189972804, 37.723058796])),
      name: "나의 로케이션",
      tel: "02-333-2222",
      address: "주소는 서울시 종로 1번지"
    })
```

아! 그리고 Overlay 객체를 import 해야 합니다.

```js
import { Map, Overlay, View } from "ol";
```

참고로 content.innerHTML 부분의 코드 중에 UI부분은 DaisyUI를 썼습니다.

그리고 X 버튼을 누르면 팝업창이 사라지는 코드는 `map.removeOverlay(popup)` 함수를 사용해서 처리했습니다.

3초후에 자동으로 사라지게 할 수 도 있는데요.

```js
// hide popup overlay after 3 seconds
    setTimeout(() => {
      map.removeOverlay(popup);
    }, 3000);
```

그럼.
