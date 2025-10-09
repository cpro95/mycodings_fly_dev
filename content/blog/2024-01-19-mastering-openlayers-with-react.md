---
slug: 2024-01-19-mastering-openlayers-with-react
title: OpenLayers를 React를 이용해서 살펴보기
date: 2024-01-19 13:08:36.367000+00:00
summary: OpenLayers 라이브러리를 React로 공부해 보자.
tags: ["openlayers", "react", "map"]
contributors: []
draft: false
---

안녕하세요?

오늘은 지도를 이용한 웹 개발에 있어 가장 기초가 되는 "OpenLayers"라는 라이브러리를 살펴보도록 하겠습니다.

국내는 네이버와 다음, 구글 맵을 많이 쓰는데요.

이 맵의 기초가 바로 OpenLayers입니다.

그럼, 네이버 맵과 구글 맵이 무엇이 다를까요?

바로 디자인이 틀립니다.

지도로 표시되는 그림이 다르다는 얘기죠.

이 그림을 각자 제공하는 게 네이버 맵, 다음 맵, 구글 맵입니다.

그런데 대형 플랫폼에서 제공하는 맵 정보는 사용량에 따라 돈을 내야 하는데요.

이럴 때를 위해서 "OpenStreetMap"이라고 공짜로 그림을 제공해 주는 지도도 있습니다.

그래서 OpenLayers를 공부할 때는 "OpenStreetMap" 지도를 사용하게 됩니다.

그러면 OpenLayers에 대해 잠깐 살펴볼까요?

OpenLayers를 사용하면 지도를 쉽게 조작할 수 있고, 원하는 데이터를 오버레이 하여 화면에 보여줄 수 있습니다.

OpenLayers는 간단한 지도 표시부터 복잡한 GIS(Geographic Information System) 애플리케이션까지 다양한 기능을 제공하며, 고객이 요구하는 프로젝트 요구 사항에 정확하게 맞춤형 지도를 만들 수 있습니다.

이 라이브러리는 모듈식이며 확장성이 뛰어나므로, 프로젝트에 필요한 기능을 정확하게 구현할 수 있습니다.

OpenLayers는 JavaScript로 작성된 무료 오픈소스 라이브러리로, 지도 타일, 벡터 데이터 및 마커와 같은 다양한 지도 요소를 표시하고 상호작용할 수 있습니다.

OpenLayers는 지리 정보를 활용하기 위해 개발되었으며, 모든 종류의 지리 정보를 무료로 사용할 수 있습니다.

OpenLayers를 사용하면 지도를 쉽게 웹 페이지에 추가할 수 있으며, OSM(OpenStreetMap), Bing, MapBox, Stadia Maps 등 다양한 XYZ 소스에서 타일을 가져올 수 있습니다.

또한 GeoJSON, TopoJSON, KML, GML, Mapbox vector tiles 등 다양한 형식의 벡터 데이터를 렌더링할 수 있습니다.

OpenLayers는 Canvas 2D, WebGL 및 HTML5를 활용하여 최신 기술을 적용하고 있으며, 모바일 장치를 지원합니다.

React.lazy와 같은 동적 가져오기를 사용하여 지도 구성 요소를 필요할 때만 로드하여 초기 페이지 로드 시간을 줄일 수 있는 Lazy Loading을 구현할 수 있습니다.

이제 본격적인 OpenLayers 살펴보기로 들어가 볼까요?

---

** 목 차 **

* 1. [OpenLayers 설치](#OpenLayers)
* 2. [Map](#Map)
* 3. [View](#View)
* 4. [Source](#Source)
* 5. [Layer](#Layer)
* 6. [지도를 사용하기 위한 기본적인 React 컴포넌트 설정](#React)
* 7. [추가 기능](#additional)
* 8. [위도, 경도 좌표 구하기](#coordinate)
* 9. [VectorLayer 사용해 보기](#VectorLayer)
* 10. [React와 OpenLayers 통합 최적화, 렌더링 성능을 위한 전략](#ReactOpenLayers)

---

##  1. <a name='OpenLayers'></a>OpenLayers 설치

React 템플릿은 Vite를 이용해서 쉽게 만들 수 있습니다.

```bash
npm create vite@latest openlayers-react-test
cd openlayers-react-test
npm install
```

OpenLayers 설치는 아래와 같이 간단하게 설치 가능합니다.

```bash
npm install ol
```

이제 React 앱 상에서 OpenLayers를 사용하는 구체적인 방법으로 들어가기 전에 지도, 레이어, 뷰 그리고 소스의 핵심 개념을 설명해 보겠습니다.

---

##  2. <a name='Map'></a>Map

OpenLayers에서 지도는 다양한 레이어와 뷰를 포함하고, 지리적 데이터가 표시되는 캔버스 역할을 합니다.

애플리케이션 내에서 여러 지도를 만들 수 있으며, 각각의 지도는 자체 레이어와 뷰를 가질 수 있습니다.

먼저, 지도가 위치하는 HTML 상의 코드를 지정해야 하는데요.

아래 코드는 지도를 포함하는 `<div>` 태그를 만듭니다.

```js
<div id=“map” style=“width: 100%; height: 400px”></div>
```

아래 코드는 위의 `<div>` 태그에 렌더링 되는 지도를 생성하며, div 엘리먼트의 'map'이라는 ID를 선택자로 사용하고 있습니다.

```js
import Map from ‘ol/Map.js’;

const map = new Map({target: ‘map’});
```

Map에 대한 상세 API는 아래 링크를 참조하십시오.

API Doc: [ol/Map](https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html)

---

##  3. <a name='View'></a>View

OpenLayers에서 뷰는 지도의 중심, 줌 및 투영을 결정합니다.

지리적 데이터를 관찰하는 사용자의 창 역할을 하죠.

그리고 단일 지도 내에서 다양한 관점이나 줌 레벨을 나타내도록 다른 뷰를 구성할 수도 있습니다.

투영은 중심의 좌표계와 맵 해상도 계산에 대한 단위를 결정합니다.

아래 코드에서와 같이 지정하지 않으면 기본 투영은 Spherical Mercator (EPSG:3857)이며, 맵 단위는 미터가 됩니다.

```js
import View from ‘ol/View.js’;

map.setView(new View({ center: [0, 0], zoom: 2, }));
```

> EPSG는 European Petroleum Survey Group의 약자로, 지리 정보를 다루기 위한 좌표계와 관련된 데이터베이스입니다. EPSG 코드는 각 좌표계에 대한 고유 식별자입니다. EPSG:3857은 Spherical Mercator를 기본 투영으로 사용하며, 맵 단위는 미터입니다.

> Spherical Mercator는 지구를 구면으로 표현하는 방식 중 하나입니다. 이 방식은 Google Maps, OpenStreetMap, Bing, ArcGIS, ESRI 등에서 사용되며, 지구를 타원체가 아닌 구로 가정합니다. 이 방식은 지구의 극 지역에서는 왜곡이 발생할 수 있습니다. EPSG:3857은 이러한 왜곡을 최소화하면서도 지구 전체를 표현할 수 있는 투영 방식입니다.

사용 가능한 줌 레벨은 maxZoom(기본값: 28), zoomFactor(기본값: 2) 및 maxResolution(기본값은 투영의 유효 범위가 256x256 픽셀 타일에 맞도록 계산됩니다)에 의해 결정됩니다.

View API 링크입니다.

API Doc: [ol/View](https://openlayers.org/en/latest/apidoc/module-ol_View-View.html)

---

##  4. <a name='Source'></a>Source

소스는 레이어의 데이터를 제공합니다.

맨 처음에 얘기했던 각 플랫폼마다의 지도 그림이 틀리다고 했는데요.

소스(Source)가 바로 그 지도 그림에 해당됩니다.

OpenLayers는 래스터 데이터에 대한 타일 소스, 벡터 데이터에 대한 벡터 소스 및 정적 이미지에 대한 이미지 소스를 비롯한 다양한 소스를 지원합니다.

이러한 소스는 다양한 공급 업체에서 데이터를 가져오거나 특정 데이터 형식을 처리하기 위해 사용자 정의될 수 있습니다.

레이어에 대한 원격 데이터를 가져오려면 'ol/source' 하위 클래스를 사용하면 되는데요.

아래 코드는 'ol/source/OSM' 이라고 여기서 OSM은 바로 OpenStreetMap입니다.

```js
import OSM from 'ol/source/OSM.js'

const source = OSM()
```

source에 대한 API 링크입니다.

API Doc: [ol/source](https://openlayers.org/en/latest/apidoc/module-ol_source.html)

---

##  5. <a name='Layer'></a>Layer

레이어는 지도의 시각적 콘텐츠를 정의합니다.

OpenLayers는 래스터 데이터에 대한 타일 레이어, 벡터 데이터에 대한 벡터 레이어 및 이미지 레이어와 같은 다양한 레이어 유형을 지원합니다.

레이어는 서로 다른 유형의 정보를 단일, 일관된 지도로 결합하기 위해 쌓일 수 있습니다.

- ol/layer/Tile - 특정 해상도에 대한 줌 레벨에 따라 그리드로 구성된 타일 이미지를 제공하는 소스를 렌더링합니다.

- ol/layer/Image - 임의의 범위와 해상도의 맵 이미지를 제공하는 소스를 렌더링합니다.

- ol/layer/Vector - 벡터 데이터를 클라이언트 측에서 렌더링합니다.

- ol/layer/VectorTile - 벡터 타일로 제공되는 데이터를 렌더링합니다.

```js
import TileLayer from 'ol/layer/Tile.js'

// ...
const layer = new TileLayer({ source: source })
map.addLayer(layer)
```

위 코드를 보시면 `source`는 레이어의 데이터를 제공하는 소스입니다.

아까 source에서 OSM을 선택했던 그겁니다.

`map.addLayer(layer)`는 생성된 레이어를 지도에 추가하는 코드입니다.

다시 한번 강조하지만 레이어는 지도의 시각적 콘텐츠를 정의합니다.

OpenLayers는 래스터 데이터에 대한 타일 레이어, 벡터 데이터에 대한 벡터 레이어 및 이미지 레이어와 같은 다양한 레이어 유형을 지원합니다.

레이어는 서로 다른 유형의 정보를 단일, 일관된 지도로 결합하기 위해 쌓일 수 있습니다.

Layer에 대한 상세 API는 아래 링크에서 참조하시면 됩니다.

API Doc: [ol/layer](https://openlayers.org/en/latest/apidoc/module-ol_layer_Layer-Layer.html)

---

##  6. <a name='React'></a>지도를 사용하기 위한 기본적인 React 컴포넌트 설정

이제 OpenLayers가 프로젝트의 일부가 되었으므로, 다음 중요한 단계는 대화형 지도의 컨테이너로 작동할 React 컴포넌트를 만드는 것입니다.

다음과 같이 useEffect 외부에서 Map을 렌더링하려고 하면(마운트되기 전에 컴포넌트 내용을 렌더링하는 것을 의미함) 오류 메시지가 표시됩니다.

```js
const MapComponent = () => {
    // 잘못된 방법: 컴포넌트가 마운트되기 전에 내용을 렌더링함
    const map = new Map({ target: ‘map’, // 지도가 렌더링 될 div 요소의 ID
        …
    }
    return <div id=“map” style={{ width: ‘100%’, height: ‘400px’ }}></div>;
};
```

React에서는 위와 같이 하면 안되고 이에 대한 해결 방법은 컴포넌트가 제대로 마운트된 후에만 내용을 렌더링하도록 하도록 하면 됩니다.

함수형 컴포넌트의 경우 useEffect와 같은 라이프사이클 메서드를 사용할 수 있습니다.

```js
const MapComponent = () => {
    useEffect(() => {
        // 컴포넌트가 마운트된 후에 코드가 실행됩니다.
        const map = new Map({ target: ‘map’, // 지도가 렌더링 될 div 요소의 ID …
    }
}, []);

    return <div id=“map” style={{ width: ‘100%’, height: ‘400px’ }}>
    </div>;
};
```

---

지금까지의 전체 코드입니다.

가장 기본적인 코드가 되겠죠.

먼저, App.jsx 파일입니다.

React의 lazy와 Suspense로 lazy loading이 가능하게끔 했습니다.

```js
import React from 'react'

function App() {
  const BasicMap = React.lazy(() => import('./BasicMap'))
  return (
    <div>
      <React.Suspense fallback={<div>Loading…</div>}>
        <BasicMap />
      </React.Suspense>
    </div>
  )
}

export default App
```

이제 BasicMap.jsx 파일의 모습입니다.

```js
// BasicMap.jsx
import React, { useState, useEffect, useRef } from 'react'
import { Feature, Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import 'ol/ol.css'

function BasicMap() {
  const [map, setMap] = useState()
  const mapElement = useRef()
  const mapRef = useRef()
  mapRef.current = map

  const osmLayer = new TileLayer({
    preload: Infinity,
    source: new OSM(),
  })

  const initialMap = new Map({
    target: mapElement.current,
    layers: [osmLayer],
    view: new View({
      center: [0, 0],
      zoom: 0,
    }),
  })

  useEffect(() => {
    setMap(initialMap)
  }, [])

  return <div style={{ height: '100vh', width: '100%' }} ref={mapElement}></div>
}

export default BasicMap
```

위 코드를 실행하면 아래와 같이 나옵니다

![](https://blogger.googleusercontent.com/img/a/AVvXsEgL9t4Lgjxfcfm0a-KRL50ZEm4SlivaYP7uovCDInoWefi___bWBmjux3jisApVWG15WCQslFtGRUsZADj6NOUvyS3zuHsqf1_Ixh4VNc4OWzoPL8uXLxyyFN8boXbf3nYSIrQqdRfSspStjXHLWCfxnMolOr56zy0YtUjFQAAXpKQUnJ8DaBY9eKS9YQo)

코드 설명을 조금 해보자면, initialMap은 Map 객체를 생성하는 코드입니다.

Map 객체는 OpenLayers에서 지도를 표시하기 위한 핵심 객체입니다.

useState를 사용하여 initialMap을 React의 상태(State)로 관리하면, initialMap이 변경될 때마다 컴포넌트가 다시 렌더링됩니다.

useEffect는 컴포넌트가 마운트 될 때 한 번 실행되며, initialMap을 map 상태에 설정합니다.

이렇게 함으로써, initialMap이 처음 렌더링 될 때만 생성되고, 이후에는 map 상태를 통해 관리됩니다.

useState를 사용하지 않고 useEffect에 initialMap을 설정할 수 있습니다.

이 경우, initialMap이 변경될 때마다 컴포넌트가 다시 렌더링되지 않습니다.

그래서 map이라는 React State를 만들고 map이 변경되면 다시 렌더링되도록 하는게 React와 OpenLayers를 같이 쓸 때 쓰이는 아주 좋은 코딩 방법입니다.

그리고 Map 객체 자체를 mapRef에 할당했는데요, 나중에 mapRef로 우리의 Map을 자체 컨트롤 할 수 있습니다.

위 예제에서 BasicMap은 간단한 OpenStreetMap 레이어와 함께 OpenLayers 지도를 초기화하며, useEffect 훅은 컴포넌트가 마운트될 때 지도가 생성되도록 보장합니다.

마지막으로 중요한게 있는데요.

OpenLayers의 올바른 스타일링과 기능성을 보장하려면 필요한 CSS 및 모듈을 가져와야 합니다.

BasicMap.js 파일에서 OpenLayers CSS를 가져오는 import 문을 확인하세요.

```js
import ‘ol/ol.css’; // Import OpenLayers CSS
```

이 줄은 OpenLayers가 올바르게 렌더링되기 위해 필요한 필수 스타일시트를 가져옵니다.

위와 같은 코드를 이용하면 OpenLayers 지도를 포함하는 기본적인 React 컴포넌트를 성공적으로 설정할 수 있습니다.

지금까지 공부한 것만으로도 이제 OpenLayers의 기능을 자세히 살펴보고 React 애플리케이션 내에서 동적이고 대화형 지도를 만드는 고급 기능을 구현할 준비가 된 겁니다.

---

##  7. <a name='additional'></a>추가 기능

지도에 마커, 팝업 같은 기능을 넣어 보겠습니다.

OpenLayers는 이러한 요소들을 추가하는 과정을 간소화시켜 줍니다.

- 마커: 지도상의 특정 관심 지점을 나타내는 것은 마커를 사용하면 직관적으로 가능합니다. 마커를 추가하여 위치를 강조하면 지도가 더 많은 정보를 제공하고 더욱 매력적이게 만들 수 있습니다.

- 팝업: 대화형 팝업을 마커에 연결하여 사용자가 특정 지도 기능을 클릭할 때 추가 정보를 제공할 수 있습니다. 이를 통해 데이터를 더 자세히 탐색할 수 있습니다.

- 사용자 정의 오버레이: OpenLayers를 사용하면 사용자 정의 오버레이를 만들어 맞춤형 방식으로 추가 정보를 표시할 수 있습니다.

아래는 마커를 표시하는 간단한 예시입니다:

```js
import React from "react";

function App() {
  const MarkerPopupMap = React.lazy(() => import("./MarkerPopupMap"));
  return (
    <div>
      <React.Suspense fallback={<div>Loading…</div>}>
        <MarkerPopupMap />
      </React.Suspense>
    </div>
  );
}

export default App;
```

```js
// MarkerPopupMap.js
import React, { useEffect } from 'react'
import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import Overlay from 'ol/Overlay'
import { fromLonLat } from 'ol/proj'

const MarkerPopupMap = () => {
  useEffect(() => {
    // Initialize the map with a marker and popup
    const marker = new Overlay({
      position: fromLonLat([0, 0]),
      positioning: 'center-center',
      element: document.getElementById('marker'),
      stopEvent: false,
    })

    const map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
      overlays: [marker],
    })

    // Show popup when marker is clicked
    map.on('click', event => {
      marker.setPosition(event.coordinate)
    })
  }, [])

  return (
    <div>
      <div id='map' style={{ width: '100%', height: '400px' }}></div>
      <div id='marker'>v</div>
    </div>
  )
}

export default MarkerPopupMap
```

이제 실행해 보면 아래 그림과 같이 아프리카 밑에 'v'라는 마커가 보일 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgBPvZRlhiAainKAvj482jd950jBpwNA3gbvtEmGv-eR9ziNBrn-3KgDqDJXCNroIgNFfAF1lulF4CMV8SWDkmFhLfbhqQT-gyJ4iC5DcHLAzVsTD7o9xgf9kqwlQ8r7YkudvfRNC5HSRwaUExcYJ3LjCk_NwxyWxCQBwAsOJza8bHXybjSEYAzJDmOkXY)

마우스를 원하는 곳에 클릭하면 아래와 같이 마우스를 클릭한 위치에 'v'가 표시됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiawNm01qBYFQ3mOGew9ysK99li8eDICCEVPZ7JfboD-tFqmzucpiR6gmqSVpieKiMUYRKWjpoOQnesOOVavAJBmQCi2u58mIn2-X623JURvhYjdrUrnctytiyyQt2O-O_yAwkZWxojz8kJC5Pzj9pjTeqyCQgNbt-2JLLTg2sBRrhF7oXxkh5oqm99OiE)


---

##  8. <a name='coordinate'></a>위도, 경도 좌표 구하기

아까 전에 만든 MarkerPopupMap 컴포넌트를 확장하면 클릭한 곳의 정확한 위도 경도 데이터를 얻을 수 있는데요.

아래와 같이 event.coordinate 값에 해당 값이 나타납니다.

```js
import { transform } from 'ol/proj'

// Handle a click event on the map
map.on('click', event => {
  const clickedCoordinate = event.coordinate
  const wgs84Coordinate = transform(clickedCoordinate, 'EPSG:3857', 'EPSG:4326')
  console.log('Clicked Coordinate:', wgs84Coordinate)
})
```

event.coordinate의 단위는 **미터(m)**입니다.

반면, 보통 우리가 사용하고 있는 위도, 경도 좌표계는 WGS84입니다.

따라서, event.coordinate를 WGS84 좌표계로 변환해야 합니다.

이를 위해서는 ol/proj 모듈의 transform 함수를 사용해야하는데요.

아래는 event.coordinate를 WGS84 좌표계로 변환하는 코드입니다.

위 코드에서 EPSG:3857은 event.coordinate의 좌표계이며, EPSG:4326은 WGS84 좌표계입니다.

변환된 좌표는 wgs84Coordinate 변수에 저장됩니다.

전체 코드입니다.

```js
// MarkerPopupMap.js
import React, { useEffect, useState } from 'react'
import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import Overlay from 'ol/Overlay'
import { fromLonLat, transform } from 'ol/proj'

const MarkerPopupMap = () => {
    const [data, setData] = useState("v");

    useEffect(() => {
        // Initialize the map with a marker and popup
        const marker = new Overlay({
            position: fromLonLat([0, 0]),
            positioning: 'center-center',
            element: document.getElementById('marker'),
            stopEvent: false,
        })

        const map = new Map({
            target: 'map',
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
            ],
            view: new View({
                center: [0, 0],
                zoom: 2,
            }),
            overlays: [marker],
        })

        // Show popup when marker is clicked
        map.on("click", (event) => {
            marker.setPosition(event.coordinate);
            const clickedCoordinate = event.coordinate;
            console.log('Clicked Coordinate:', clickedCoordinate);
            const wgs84Coordinate = transform(clickedCoordinate, "EPSG:3857", "EPSG:4326");
            console.log('Clicked Coordinate:', wgs84Coordinate);
            setData(`${wgs84Coordinate[0]} v ${wgs84Coordinate[1]}`);
        });
    }, [])

    return (
        <div>
            <div id='map' style={{ width: '100%', height: '400px' }}></div>
            <div id="marker">{data}</div>
        </div>
    )
}

export default MarkerPopupMap
```

위 코드는 'ol/proj'의 transform 메서드를 이용해서 좌표계를 변환한 겁니다.

아래 코드처럼 마우스로 클릭한 곳의 좌표가 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEi--D6b56EK7g0m5eUGZlVl4Y5jVqUFCDDWbmVwYhYH3Cw1zpUTGNu3DtZNfPgY3QZR3BJZkyDK5Qh0ixsr2MeZKSGvfBmLsXziooCazFoBBJogMXvwAzrRabTAFPt-zV9DeEOhtXfS7uEM07q3t-LsSxN9VHeJovD5WPvfA5q8g6VHo-NjErsccQL7XLY)

---

##  9. <a name='VectorLayer'></a>VectorLayer 사용해 보기

OpenLayers의 벡터 레이어를 사용하면 벡터 데이터를 표시하고 상호작용할 수 있어 복잡하고 상세한 지도 표현이 가능해집니다.

지리 데이터를 인코딩하는 인기 있는 형식인 GeoJSON을 활용하는 것이 일반적입니다.

아래는 GeoJSON 데이터를 포함하는 벡터 레이어를 React 컴포넌트에 통합하는 예입니다.

먼저, GeoJSON 데이터 형식입니다.

코드 작성을 위해 아래 데이터는 'data.json' 형식으로 저장합시다.

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [127.024612, 37.5326]
      },
      "properties": {
        "name": "서울특별시청"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [126.975381, 37.577901]
      },
      "properties": {
        "name": "경복궁"
      }
    }
  ]
}
```

위 예시는 두 개의 Feature를 포함하는 FeatureCollection입니다.

Feature는 지리적인 위치와 속성을 나타내는 객체입니다.

Feature는 geometry와 properties 필드를 가질 수 있습니다.

geometry 필드는 지리적인 위치를 나타내며, properties 필드는 속성 정보를 나타냅니다.

위 예시에서는 Point 지오메트리를 사용하여 지리적인 위치를 표현하고 있습니다.

coordinates 배열은 경도와 위도를 나타냅니다. 이 예시를 사용하여 지도에 마커를 추가하려면, VectorSource 객체의 url 속성을 data.json 파일의 경로로 설정하면 됩니다.

그러면, VectorLayer 객체가 Feature를 읽어와 지도에 표시합니다.

위치란의 coordinates는 우리가 아까 쓴 위도, 경도 주소가 아니라 EPSG:3857 형태인걸 주의해야 합니다.

아래 코드는 Feature가 하나이고, type이 'LineString'입니다.

두 연결 지점을 잇는 선을 그으라는 거죠.

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [126.978388, 37.56661],
          [126.975381, 37.577901]
        ]
      },
      "properties": {
        "name": "서울특별시청 - 경복궁"
      }
    }
  ]
}
```

이제 VectorLayer를 이용한 지도를 볼까요?

아래 코드를 작성하고 App.jsx 파일도 같이 바꿔주십시오.

```js
import React from "react";

function App() {
  const VectorLayerMap = React.lazy(() => import("./VectorLayerMap"));
  return (
    <div>
      <React.Suspense fallback={<div>Loading…</div>}>
        <VectorLayerMap />
      </React.Suspense>
    </div>
  );
}

export default App;
```

```js
// VectorLayerMap.js
import React, { useEffect } from 'react'
import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import { fromLonLat } from 'ol/proj'
import Style from 'ol/style/Style'
import Stroke from 'ol/style/Stroke'

const VectorLayerMap = () => {
  useEffect(() => {
    // Initialize the map with a vector layer
    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        format: new GeoJSON(),
        url: 'src/data.json',
      }),
      style: new Style({
        stroke: new Stroke({
          color: 'red',
          width: 5,
        }),
      }),
    })

    const map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat([126.978388, 37.56661]),
        zoom: 14,
      }),
    })
  }, [])

  return <div id='map' style={{ width: '100%', height: '100vh' }}></div>
}

export default VectorLayerMap
```

LineString 지오메트리를 더욱 눈에 띄게 표시하기 위해, style 속성을 사용하여 선의 색상, 두께, 스타일 등을 변경했습니다.

위 코드에서는 선의 색상이 빨간색이 되고, 두께가 5px로 변경되었습니다.

Style 객체는 선의 스타일을 나타내며, Stroke 객체는 선의 색상과 두께를 나타냅니다.

실행 결과는 아래와 같이 나타납니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhWTjQVscai7E2wubjaXtvRHmOX8UV9G-HIZkRCLHBWh6mQzPD11VvedZyRdI3DY5zgapPlbundgmMk7NtA2XIr0PHpWXY9h98YP9_rQhdn-KKuuEqMPFfa_tptS4TIV_ECs1QwyHPSlmux_K5JZrEeTAs42KYRXAZYzXWbswDdacT-YM-9wKiG7psDQIU)

--

##  10. <a name='ReactOpenLayers'></a>React와 OpenLayers 통합 최적화, 렌더링 성능을 위한 전략

1. 지도 구성 요소의 Lazy Loading 구현:

지도가 처음에 표시되지 않거나 대형 애플리케이션의 일부인 경우 전반적인 애플리케이션 성능을 향상하기 위해 지도 구성 요소의 Lazy Loading 구현을 고려해야 합니다.

이렇게 하면 OpenLayers 라이브러리와 관련된 지도 구성 요소가 필요할 때만 로드되므로 초기 페이지 로드 시간이 줄어들게 되는거죠.

Dynamic Imports (동적 가져오기)와 React의 React.lazy를 사용하여 OpenLayers 및 지도 구성 요소를 Lazy Loading으로 로드합니다.

이 방법을 사용하면 코드를 작은 청크로 분할하여 필요할 때 로드할 수 있으므로 초기 페이지 로드 시간이 줄어듭니다.

```js
// React.lazy를 사용한 예시
const LazyLoadedMap = React.lazy(() => import(‘./LazyLoadedMap’));

const App = () => (
    <div> {/* Other components */}
        <React.Suspense fallback={<div>Loading…</div>}>
            <LazyLoadedMap />
        </React.Suspense>
    </div>
);
```

OpenLayers는 다루기 매우 어려운데요.

예제를 보면 쉽게 이해할 수 있습니다.

아래 예제 모음 링크를 공부하는 걸 적극 추천드립니다.

[OpenLayers 예제 모음](https://codesandbox.io/examples/package/react-openlayers)

그럼.
