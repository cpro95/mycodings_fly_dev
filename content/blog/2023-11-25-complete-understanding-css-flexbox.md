---
slug: 2023-11-25-complete-understanding-css-flexbox
title: CSS 강의 1편. Flexbox 완벽 이해
date: 2023-11-25 13:02:57.862000+00:00
summary: CSS Flexbox를 개념부터 완벽하게 이해하기
tags: ["css", "flexbox"]
contributors: []
draft: false
---

![](https://blogger.googleusercontent.com/img/a/AVvXsEjn2ienhrMXz72CJVExoqJ1S_0fHXNGzGG6FWk476XfE3aXIcOEvk2fVGCyqhQp0kQlid23CcUkH0P_Raox7JrbZKCisaiCwgxwIWwHT2fJbA_vaVdG9Dkb7IVs4LNbgywqwAgVnIW3sbkzCbxiV-IG6fVaT9O7W5R1QvMH_r5t3QZs2-RI8ntcZsXBPZE)

안녕하세요?

CSS 강의를 몇몇 중요한 것만 골라서 시작해 볼 까 합니다.

먼저, Flexbox인데요.

Flexbox는 CSS에 있어 매우 강력한 레이아웃 모드입니다.

모던 웹 사이트의 가장 기본이라 할 수 있는 Responsive Layout을 구현해 주는 게 바로 Flexbox인데요.

좀 더 자세히 알아보도록 하겠습니다.

전체 강의 리스트입니다. 

1. [CSS 강의 1편. Flexbox 완벽 이해](https://mycodings.fly.dev/blog/2023-11-25-complete-understanding-css-flexbox)

2. [CSS 강의 2편. Flexbox Growing, Shrinking, Gaps, Wrapping 이해](https://mycodings.fly.dev/blog/2023-11-26-css-tutorial-understanding-css-flexbox-the-second)

3. [CSS 강의 3편. Grid Layout 완벽 이해](https://mycodings.fly.dev/blog/2023-11-27-understand-css-grid-completely)

4. [CSS 강의 4편. CSS Variables와 calc 함수 완벽 이해](https://mycodings.fly.dev/blog/2023-11-30-all-about-css-variables-and-calc-function)

5. [CSS 강의 5편. CSS에서 div를 중앙에 위치시키는 방법](https://mycodings.fly.dev/blog/2024-02-14-how-to-center-div-in-css)

---

** 목 차 ** 

1. [레이아웃 모드란?](#1-레이아웃-모드란)

2. [Flow layout과 Flexbox 그리고 Grid layout](#2-flow-layout과-flexbox-그리고-grid-layout)

3. [Flex direction](#3-flex-direction)

4. [Alignment - justify-content](#4-alignment---justify-content)

5. [Alignment - align-items](#5-alignment---align-items)

6. [Alignment - align-self](#6-alignment---align-self)

7. [content와 items의 차이](#7-content와-items의-차이)

---

## 1. 레이아웃 모드란?

CSS는 기본적으로 Flow 레아이웃(Flow layout) 모드를 사용합니다.

레이아웃 모드라는 건 CSS가 아이템을 어떻게 배치할 것인가 하는 로직인 거죠.

CSS를 특정 규칙에 의해 작성하면 브라우저가 그걸 정해진 규칙에 의해 화면에 표현해 줍니다.

Flow layout은 기본적으로 위에서 아래로 배치된다고 생각하시면 됩니다.

Flow layout에서 위에서 아래로 배치되는 규칙을 제외받는 게 바로 p, span, a 태그입니다.

반대로 Flexbox는 레이아웃 모드가 어떻게 될까요?

flexbox의 기본 모드는 Flow layout의 반대인데요.

왼쪽에서 오른쪽으로 아이템을 배열합니다.

이해를 위해 그림을 보면서 설명해 보면

![](https://blogger.googleusercontent.com/img/a/AVvXsEjK70BhR7VxY5cGM0o5dC7Fy9bSoL272iYT1vzIrm9rVlNENPIRxTNJKDhW8WCXuo1hE_shBARqLRLlIx3lHopcGQhFNWGHMu2S5fRhkHKWK9WjoFRQ6df13zpjgvDgLKkhGyOkLY0L7HscQH7upL6twjWIewyc0oYBgyG_hm99T1fqhCT03jIBHqYUEEw)

위 그림이 바로 Flow Layout입니다.

위에서 아래로 아이템이 배열되는 거죠.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgAIzm5aQfsu1vFrtZNAuCSwrUHbskRCgdsMS3AcPFQRLcpJ1JZczaRJVxFnaoeJeNp9Ku-TMOAnoeKKdaKfY-DV0Tz2w9OdxspgP9fU_CvkEY-V6xGQEgTtEJcZI9Sgce8ouWg6kf9Cw8epJDSK8UVuh5tTNuuNKgyNwr5NdsChjyHVaRXegnMkkkXqhc)

위 그림은 반대로 Flexbox의 레이아웃 모드입니다.

왼쪽에서 오른쪽으로 아이템을 배열하죠.

Flexbox는 CSS에서 다음과 같이 표현합니다.

```css
display: flex;
```

---

## 2. Flow layout과 Flexbox 그리고 Grid layout

CSS에서는 각 레이아웃 알고리즘은 각각 특정 문제를 해결하도록 설계되었습니다.

디폴트 레이아웃인 Flow 레이아웃은 디지털 문서를 만들기 위한 것으로, 본질적으로는 Microsoft Word 레이아웃 알고리즘과 유사합니다.

제목과 단락은 블록으로 수직으로 쌓이고, 텍스트, 링크, 이미지 등은 이러한 블록 안에서 불명확하게 위치합니다.

그렇다면 Flexbox는 어떤 문제를 해결해 줄 수 있을까요?

Flexbox는 항목 그룹을 행이나 열로 배열하고 해당 항목들의 분배와 정렬에 엄청난 수준의 제어를 제공하는 데에 중점을 두고 있습니다.

이름에서 알 수 있듯이 Flexbox는 유연성에 관한 것입니다.

항목이 커지거나 줄어드는 방법, 여분의 공간이 어떻게 분배되는지 등을 제어할 수 있습니다.

Flexbox가 이렇게 강력한 기능을 제공해 주는데, 생각해 보면 Grid 레이아웃도 비슷한 기능을 제공해 줍니다.

그렇다면 혹시 요즘 브라우저에서 CSS Grid가 잘 지원되고 있으니, Flexbox는 더 이상 사용되지 않는 거 아닌가요?

CSS Grid는 아주 유용한 레이아웃 모드이지만, Flexbox와는 다른 문제를 해결합니다.

둘 다 나름의 장점과 쓰임새가 다른다는 얘기입니다.

다음 시간에는 Grid 레이아웃에 대해 알아볼 예정인데요.

오늘은 Flexbox에만 집중해 보겠습니다.

---

## 3. Flex direction

언급한 대로, Flexbox는 행(Row)이나 열(Column)에서 요소들의 분배를 제어하는 데 중점을 두고 있습니다.

기본적으로 항목들은 한 행에서 왼쪽에서 오른쪽으로 즉, 옆으로 쌓이게 됩니다만, flex-direction 속성을 사용하여 열(위 아래)로 전환할 수 있습니다.

```css
display: flex;
flex-direction: row;
// flex-direction: column;
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEgUFHjRhynlZVxpUOKHnBpwfICKPNRzAU-egYYg5db6ikfsHe6acRigFX5yAxmv7OSWoDow7HDOF_V5H_R-6vSlpD9iPfItEzkHvAFX0cgcxyg7TFhmoE3G8bWRrFzWFdk0Ad39CorjVJ2wngncUcXn74Kicl-95winwXZuDlwWg-qcf8Kk8KaQZhGjuNk)

위 그림은 flex-direction이 row일 경우입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgxAhPQtar-jsJwdSXjmpX5GCiGBqTppF0pHpTPMFKCOUOWiMFO9aYx2jtGZtAAmlHJvipnOSgZQ4jDVmr7XCmPP-BZlZlmj21RhAAvLnN6qtcbl5ykFwO1uh7QULT_D-fLGbmYzNlmcKQE-eFDmk9yqRA-ZZA8LoloD3mATYJZB4Z4v-aRfx4J9Zm6yOo)

위 그림은 flex-direction이 column일 경우입니다.

row와 column은 한국어로 번역하면 행과 열인데요.

엑셀 작업하다보면 나오는 개념이 행과 열입니다.

가로축으로 쭉 뻗은 게 행이라고 하고 엑셀에서는 보통 1행, 2행, 3행 이런식으로 부르죠.

열은 세로축으로 쭉 뻗어있고 엑셀에서는 A열, B열, C열 이런식으로 부르죠.

CSS에서도 같습니다.

row라고 하면 가로축, column은 세로축이라고 이해하면 됩니다.

row를 행이라고 외우지 마시고 꼭 row를 가로축이라고 외우는게 Flexbox 개념을 이해하는데 아주 도움이 됩니다.

제가 왜 가로축이라고 하냐면, Flexbox는 축을 기준으로 연산이 이루어지는데요.

두 개의 축이 있습니다.

Primary Axis와 Cross Axis가 있습니다.

한글로 표기하면 주축과 교차축이죠.

flexbox가 row이면 Primary Axis(주축)이 가로축이라는 뜻입니다.

그러면 자동으로 교차축은 세로축이 되는거죠.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjihorUkzL7ARndL2JAWN8vhYWIKYkxS75Vn4J4rnVfyz1OtMkXSwTGnSMQ3dzmRcUurcXkG0bhg5CmzUCt0qcsGHVrt4vy7C06WbxgFy4BwJzsBiKyg4GmyzjteU6zlKPFgyb2hyLtk84Hd3TEMkFb6WlYS5fRnipSRlyK9U46T8LiqJ2UTO7PNlBy34k)

위 그림을 보시면 flex row일 경우 주축(primary axis)와 교차축(cross axis)를 표시한 겁니다.

flex column일 경우 아래와 같이 반대가 되겠죠.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjO28rDv1eGLuDfZaEgHIu0U2QBDJi_yCzF_Olwy_xBBqQ2dFfa4qE87wYCpDY4YAksFCNKuQPn851SGr1NVPLDSB3x5viWEplbN__cCrqcqZwSspgCt32OMiyTijcQ19XCYeoAN_XoWfFuUwvjf_e1-WEN7EEns97JS8mozyg5MvwkUiHQdDzMu5XuOP8)

그러면 왜 제가 축에 대해 설명하냐면, CSS의 flexbox 알고리즘이 모두 주축(primary axis)를 바탕으로 작동된다는 겁니다.

CSS Flexbox 알고리즘은 아래와 같이 작동합니다.

기본적으로 자식(child) 요소들은 다음 두 규칙에 따라 배치됩니다:

```html
주축(Primary Axis): 자식 요소들이 주축을 따라 시작 부분에 가깝게 나란히
배치됩니다. 교차축(Cross Axis): 자식 요소들은 전체 컨테이너를 채우도록
늘어납니다.
```

이 두 개의 기본 개념을 꼭 이해하고 있어야 합니다.

---

## 4. Alignment - justify-content

flexbox의 가장 기본 개념이 바로 주축(primay axis)를 통해서 컨테이너의 시작부터 쌓인다는 건데요.

flexbox는 이걸 제어할 수 있는 요소를 제공해 줍니다.

바로 justify-content인데요.

content를 justify한다는 뜻인데요.

content는 주축과 연관 있다는 걸 꼭 외워두시기를 바랍니다.

```css
justify-content: flex-start;
justify-content: center;
justify-content: flex-end;
justify-content: space-between;
justify-content: space-around;
justify-content: space-evenly;
```

각각의 역할을 그림으로 이해하는 게 좀 더 쉽습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhtVFRJ7Qr0n5sxk3cqNLVuybVkFgYPh_5SL513e4CKgG2pKL03oodDP2cXcPnsWHC2O7ae6FIjcG3-r3It9yBC16gUPWpr1ZXFOTh2y6kzoez_HArfjscGJCkRYDiO9h2E_8vUE48wJqX8BQi6e-l9NsMBHNrec2cDXEfn-IGaFJNuoKAhY3PVwZE2BEo)

위 그림은 flex-direction: row와 justify-content: flex-start일 때 입니다.

각각의 예제를 아래 그림과 같이 나열해 보겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjkpcOwYeweWIPslwxIHIn3cbX2Stb9IGyH2wFpzRo0sYceOu3VmP_AmkUIYWr2CIUUm8W2zdr1NStuPDIYCY9WxPN3m2dPZI7ZzFzLLgmtOePJUbguSS9ob5ivMXz2Nf3VdPGiKztqpG_8Xy4pGat8-6w8oEiMNbBwjp3361rTvFhd9vxO79UA5D0N5P4)

![](https://blogger.googleusercontent.com/img/a/AVvXsEgyWD4WA5eA1n83viaYAD37pfnZr4QLDlVFy_S19C7xv9nn45a9xtkqJ0szPkFw8xNKJV1Zumm7GqH1_IjYhqVcu0bUWhN0Bjq4TOk6g0jO4Q_opc0VQjy8pQJ_tkySIeGtiM11ydoc0cfBBrtTmt7lwbI2y0jhzmABec8D6eZlDSm66jIv39q6YsCF3PM)

![](https://blogger.googleusercontent.com/img/a/AVvXsEhjsbbCLo4uHvRqle3K7dbN3xxfTDxANpSJKxAQj2AxScDYxRNuXdHh4pkYHVIAOh296QkUxCMmzNmQivp8PcJTxPgGhNKsdI-sHhdijpU_bpcSZDidjfvcECTW33JKPuuo50PS020S_iw7SapOVs61lGVh8-dcm-YrC8MPjzWoa7Cu-aibUtx8I5FeWTk)

![](https://blogger.googleusercontent.com/img/a/AVvXsEg84h0NLqsKpZA3a0jRO-KhW1oiCQIkbavzFB3ofEnNCk1-2q5PL5wZdE2VnmZfSoB4ZCoxR8l7wSxEc1Tp4zKCNuFsa2a1E4zqC95bzVapih9vsSeQkFhDvleZ0peBVyTC6J6AXG71hmWdPxfcrmzaBrgrir8D5ja3VVRoYidt6v-o2QUpR_SKcgdoyiI)

![](https://blogger.googleusercontent.com/img/a/AVvXsEhy0_SrvZ0jvja2ESw_kKCz4s9YzN-nlaxyweIMO1DenIPeGdbkSBcUjIV9x0tjL4_TUgPv5m2BxGfWSr6XiUsgcrcvWpvrGh1eFT1dFR7UDqHsURp4GpbvmweIIP8xEUSVf29DMvh7O8fadwV1FPI8hp8GmUTHUG8efZGh3n38_NNu_ZfRJif3WF7Ik74)

총 6개가 있으니까 꼭 외우셔야 합니다.

위 그림에 Primary Axis (주축) 화살표가 항상 표시되어 있는데요.

justify-content는 주축이랑 같이 작동한다고 외우시라고 표시해 둔 겁니다.

아래 그림은 flex-direction: column 일 경우의 justify-content 예시입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgQcM_0VgqOB3PZYq3S_19E9CJusQImx7uB3bVBFnq8rmT2HFzhnGSkc-jwcPoBR9Ce5qqSU-XfC4NHXC5PE9g7OpaCgLRXEfBC1W1p1jur0mqWAij3FS6JdAmvr1nzUMVYrKyAEqEGVSf7HTiKqUbbTzx0T2KM9f_f9qIroSJXe_W0WWtkDr_3jwZLSEw)

![](https://blogger.googleusercontent.com/img/a/AVvXsEi9f5hs_0ABMNHgW4mOzuzEmcrdt03hQGVt_-CmKnOY9EBvTW7WmVBL4cbaM1Uh6DlXHUCU5LpKgf2MQ3CvqibHgkENG2dV-SgJ5RfetB9DzQ4bmlZS3hJR8QfZ-icZArn0_mrgRTzjkIfn68Xg7lxewHKrXWXEOrlDf_qgcjXDqZ-yTCRFJP3gS6JeIE8)

![](https://blogger.googleusercontent.com/img/a/AVvXsEg7L-ye2-Rs7LXWyHmMhlh7WuHx9Al7J5mEmEySQ3-eN61m86A5F4EGx23ZTXuADnbvBwGVcCUbsbD7ZzCPUBI_7AMa2UGPB2Qmd89LkO5qa6LlkhkxhdQd9raTccR668OfEuIeS4k-Xt14wLmtiqWlcveyMvhHgLqf-tEw6aaIxF7ACRI0Pojfgbvo7bo)

![](https://blogger.googleusercontent.com/img/a/AVvXsEiyUra7T_6yHEn5wGxYHQa1tvtkH-ejfSptU478IhKArQK5_sFjnS5qTF4prBkdgP_eYREO6bK2gQNAsXhDg0uEb5_3ny98bUL_YKaHBq6vsciTopmSmutYBYbGegLL2UehDINQ7lfxvakwI0naviPHVGISspgM7cbdY0zEbftmq4nvPF1bdMi2Fk6Omz0)

![](https://blogger.googleusercontent.com/img/a/AVvXsEiL18d1AqOsVDg4toXBKP_qbD4qvrTSNM4SVAaH56bJB2mnJRVFbY3MRXWGK70u_NlH6Uybg4qWv1vP3HkUoTFMKGU7i6rmzkMDZjD2_f2cA0Ayo3wVgkvfzxCsvP4z44r15wtGhpa17yKbCGJBfUJo_wewzdNop9mzXr8oMjpqqdU2VKWEubILkM5kPcU)

![](https://blogger.googleusercontent.com/img/a/AVvXsEgKALtqMofh_dEpf8VOlg97I_ZB1Tpcbz9iwNDS5YcCKhuEBj82ZFvcX1sBlCQJ24oawVT3sWiOnJU0YxnAltUeEYMYIvO9reK2BGFZ8wbxDioZZ1zQKSmHY8TxlXWb4E_OQLiJFveicVt5kBZyYOD82_VbAuYFGy7Yn0dVrg2YGv_n6fduKFsIE1Xnblg)

---

## 5. Alignment - align-items

아까 위에서 justify-content가 주축(Primary Axis)와 연관이 있다고 했는데요.

그러면, Cross-axis(교차축)과 연관이 있는거 뭘까요?

바로 align-items라는 건데요.

align-items는 justify-content가 지정되어 있어야 합니다.

참고로 align-items를 지정 안하면 디폴트 값인 'stretch' 값이 지정됩니다.

그림으로 보시는게 이해가 쉬울텐데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiEEk0nbW7SBxOhfEMK8y7LU9FrezqGYpThyMPbu-NXUuKl6mvLLTICM8nZhI6rUy2pPwnsohDMHfMfydjEEx6161VTS_HRXnix2pZYZcKuHgLtLuPPGub3wPcl5zKhEzq4DEFKke37nTEybhafPy-ov1Dr4pPMgLPY_v4VXSj4L7vR_t7sxFZWAf8Wqcs)

위 그림을 보시면 justify-content는 primary axis(주축)으로 움직이는 개념이고요.

반대로 align-items는 cross axis(교차축)으로 움직이는 개념입니다.

align-items는 디폴트값이 stretch인데요.

stretch 즉, 말 그대로 쭉 뻗는다는 뜻이죠.

그래서 위 그림처럼 각 요소가 위 아래(세로축)으로 쭉 뻗어 있습니다.

위 아래는 cross axis(교차축)인거죠.

그러면 align-items의 다른 예도 그림으로 보겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgXrsKFxZgRiOmT8zZVWRgXXgl9vc6y2-2hDEP4Ybyt04fc97ldS1xGvIOsG9BgezzO59cCHauLlcCzSxYVnGZNIiF6W3LW1Y5JQACi7SpPYZMXamSHpcdWQUnBz-TDUG_ESe7Zro8A94TJ1svQCgrmweEGqA9RAZkbpEVgYPZI2-HhI0bNJBIyuftQCzM)

![](https://blogger.googleusercontent.com/img/a/AVvXsEgPLJgw0SxFwvl2AxIx8ooWl7uoXuymPGw51fV32FG-uxFR71fZRHvMhItbt1pgzoW4MxIicPYnBwyUv7y6kSzTojJEjU5MjXp9Df1k1UcU4rcJo--8KyCW2qcr5v6xC-KKMw4jZKYHnWPlL0FN9dSB44sE0gwHJdYEhf-KOOUNNjTCaaTYVTeWZv3-tIk)

![](https://blogger.googleusercontent.com/img/a/AVvXsEjkw3D_tzLZvV2ngcjWBCfMB1udpOBIap81nloQ2-nuGYQuxc2td3Gxc39-3YKsFsqYkiKYNJAFPHYJs9yb6-ffhLE_2VJDTnjeDz4iQ1EliQUz1rQ1U_uzO1DmdoQsO4-7qRFx-L7Tk0gvXacW2s_iGukmpPJcOTjkPgIwOJOOMH99XAaeYSaO8izIfI0)

![](https://blogger.googleusercontent.com/img/a/AVvXsEheJmL-AnwsFWy9QDSeNr_znkLMDOE9pBq1EBJWCLCmEJhK4yL6Xmk9lXWmAn3Z2qnqJhRvwTa1yNhpubekEbxQiDKHRgY9WFXXfpwoiwoHU5fdYPufxGn9nQow2oEKUJN03oXa-KaUKb4gvojwpi8N2cmf0BZMCDosy67lo96fRbsI8ZKzFh7atSeVoxI)

위 그림과 같이 여러 가지가 있는데요.

flex-start 처럼 용어가 justify-content와 많이 겹칩니다.

아래 그림을 보면 용어의 교차 여부에 대한 다이어그램인데요.

쉽게 외울 수 있을 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgUvRc8bIhfFoX9T6VEpXNeQYHCEaQSYXOHhx6NwqTlqU4y0UXmK8Gsd3bqL8A0dJxs1YABLlGlkpe9nIfjGYzd-Ysj1LZY0U_AwTCbFvl6Zm8E5Ow_59yDHAn-dCEsFqXaTjjdlraqshzonkod_O_PynXliyBzHrZqqInIcWTLvkqYkfgqbDmmFxUKgtg)

그리고 flex-direction이 column일 경우의 예제입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjyOIQu58dekryC4y7y0L4AmMgEOMJkTHb_a7eKKJ2sn8vemSUAVsn8vAHO3kZz5_L_P66oX4u56fTyzWPpeAUkmD9vDW1X7DNIfUXiLzqRyQoM6TZEXwFbyTT2O00nXRQUU0AhLw3sbRk5ybApzGbnDDMr6cPaLNS8_XsQJCe1QV3WEu5H465vadcZ0sM)

![](https://blogger.googleusercontent.com/img/a/AVvXsEiuWptCXBv4gQ2bjljPjkzwwarXFWE9YT2F96W-6WeOJ8Bu5SUROC6isxA0-DoCOfSgbZzOI3h9k-JSyCFqeWxVycQL1NBby8D4yF4fB2VqQCvM6AVCS_rEVZzvqiuOFycSCpqOLYLt8dlV-UA_tQxMGzcDJ6669IrlkvJQBCZZacgEO1J1gQ8tyl87NZU)

![](https://blogger.googleusercontent.com/img/a/AVvXsEj03KeNtbaXKjghzmPhSFASjfAnAT4EhKRF-ux4H8_7HHsMRZqfl-FlN-6vQ5MyQL2QtbfujfHVRWO6sS08613lKz7nfB4xxJT-W7CQhZaEzI6NHkT8vb1RYDE6iQBMU3YwuevzPsMCy6X15kxp-HGetezeo-3N_43BFpj8K3UKfnS06cNLpA7IEzqvVCg)

![](https://blogger.googleusercontent.com/img/a/AVvXsEiAYkNVuL1JcJLKQ5PNaB0p4791-fPwpuwdB0cWdvB8SGooXSxSvdfzRy4WgRMDOdJQ7KPnx_bAEXw3Jtd7m3nw_CX_oCZ6xlloaTY2lKnhXHYhb5sK_REznAw9NgAMIHi3c9pbwJzjK35YRgIYhLrl1EzCkyMmj80DJAFnSrFS7qvJ2ZgdOjMfVBdFVT0)

![](https://blogger.googleusercontent.com/img/a/AVvXsEig0hH3Ngap9-A6u6gsDzZu3evNyJ51TPq_1DWrX28n56YGSMnYS9HvmxWj8D6s-s85aKXPg5TFAj7JFlmfz1vNGmiMxjGh9KIoSTblbJDpWCSVi0BcdP03KyxOdmeAC0olz4B-HbYq3vrmu5Xj37FbXPGYpgi3fxxtGR-BRXYxXTHO5OJ_4hqB7Erat-k)

flex-direction이 row와 column일 때 align-items가 좀 헷갈릴 수 있습니다.

중요한 건 align-items가 cross axis(교차축)으로 적용된다는 것만 이해하시면 쉽게 이해할 수 있을 겁니다.

---

## 6. Alignment - align-self

Alignment에서 justify-content와 align-items에 대해 살펴보았는데요.

justify-content와 align-items는 모두 축을 기준으로 자식 요소 모두에 적용되는 규칙입니다.

우리가 여기서 알아볼 거는 바로 align-self인데요.

self라는 용어가 있듯이 자식 요소 모두에 적용되는 게 아니라 자식 요소 한개 에만 적용되는 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEj_tOENbEpsexNDmUh4kR5UTxBCiFxHcEtF8j_eEb3NaY7meFsrctEakEUZVoZe4PVz8r8TjlBqQ3sBg4uhNY5vtLLspAXxDx2DVRfnrdK70XcWDLAktN9zHler6fNAO2f5-9f_uINs3kMqKlpWFauP147CLto_UFGGL0_weei2CVGq9cVt355O19ry_AE)

위 그림에서 볼 수 있듯이 자식 요소 한개 에만 적용되었습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiKI75hLo5zGXYzyDtos_3VOnuF66pNGz31EWg5jX5-pEhZjQBaxwlHxjtea-DGawwHiTdteT_kiIvSWroowuKVyLi1KoI1rt2hGxDTVqfsHArEOixhToWR-Z8WmpJZW7DsDhWGLsmhYj_SLvw6L7UJqpZGS_7zyzwfEJEVsYqIjdFW-Ef4CLLzvcucYI4)

![](https://blogger.googleusercontent.com/img/a/AVvXsEjzWDhLuVrMxWdERru9j9qMGQ-_29gKCL1mV4b14hNqYk0rdfBn0TScTq44hbodlg3E1TgwwKJtc2PClzRtGRBjOWImxNEutIyDE7_Ubbehv06RCFwmn-ZgGK-4dLVKvad3JYmqXxhM8UkhGshMr-kpn9F0VhjO81oBicZfNp-5rlQc17Oh8h9AE-4zLEk)

![](https://blogger.googleusercontent.com/img/a/AVvXsEiqcCkDirLUcd8xigIc4SGdJd5dnOZn4N0jFArwWGZ715WJaC0lrMaikqK0k89mI61sXPuzeh97tmV7Z01Dr2Pt7BghmPRu2ggZPic4k9lwAJChUPeo0yW49_vCNc4we0VIucXSo8sfkBt-L1gZHO5eNhOtW7tkC7Sb-oegQYDv_2aYGHztDIOPoD_FINs)

![](https://blogger.googleusercontent.com/img/a/AVvXsEjzaLdHNkayuwMei1BGN1QZpOpqCOu6nOiFH6m79rMfeSi49hQTgHhGDDd4eEPEJ-dPmKZFZ1VnLMhm0JZYpP5SNTvvAOQLm9GZ5kEJ3WCujWayq17moRDSTVx_bWfUQCbdJF1vJa7gt1gMfOkwGQ6142_K74NqYOoV8ssQFI4k5jVPAdZYsxYfZX1y4C8)

위 그림을 쭉 보시면 이해하실 수 있는데요.

바로 align-self는 align-items와 같은 용어를 가지고 있습니다.

이게 왜 그렇냐면 바로 align-items는 align-self의 'syntactic sugar'입니다.

'syntactic sugar'는 프로그래밍에서 특정 문법 또는 표현이 제공되어 코드를 더 간편하게 작성할 수 있게 해주는 것을 의미합니다.

사실상 문법적인 단축이나 편의성을 나타냅니다.

왜냐하면 align-self는 child 요소 한 개에만 적용되는 건데요.

align-items는 해당 컨테이너에 있는 모든 child 요소에 적용되는 겁니다.

즉, align-self를 여러 번 쓰지 않아도 되는 거죠.

여기서 주의하실 점은 그렇다고 해서 justify-self 라는 CSS 문법 있다는 건 아닙니다.

헷갈리지 마시기 바랍니다.

---

## 7. content와 items의 차이

flexbox를 공부하다 보면 궁금한 게 많은데요.

justify-items나 align-content 라는 용어를 왜 안 쓸까요?

그리고 왜 align-self라는 용어는 있는데, justify-self라는 용어는 왜 없을까요?

조금은 재밌는 그림을 보면 함께 생각해 보시죠.

제가 위에서 계속 얘기해 드린 Primary Axis(주축) 얘기인데요.

FlexBox의 로직은 바로 주축과 교차축을 통해서 이루어집니다.

주축에 대한 걸 얘기해 보면 아래 그림과 같이 표현할 수 있는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjAohzi0QljGO59hwKg_9ML8DDqUsXA1zLOunP-iaIT-l3znldQumXTZRJlHGIPv3cHh6n4oV-0hFjo0sDz5UTCHpvYxSxNJxl5PNjWeuntOMFzPot2tn6pP1qPY2axhzl4uQa_ZOWe_O54WW4YCoGhtBsBq58beBpCWJAdmk4zHh2MrwtdJoYYN2uoqhU)

위 그림처럼 마시멜로가 주축으로 뻗은 꼬치에 꽂혀있는 모습을 연상할 수 있습니다.

그렇다면 교차축(Cross Axis)은 조금 다른 의미로 해석할 수 있는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEigbyv-UxNw97ESmmkpRhRgd0fYDwDb8UcB8G72Q7qOgXeGmgB-bNKVol5DEgiUZqPp4KwWTHl-D3Z_Up2XDulj0xTcQYfyv-6suunFcf3xVV5zcO7rQNYn6PeIJkWx9pKjbYgW0zb4zw95h3Ss92TAb1UVcbYdCiQbRf9WFaUgompfT7cJz3WaC37Y91g)

위 그림과 같이 소시지를 이쑤시개로 위에서 아래로 꽂은 모습으로 해설할 수 있습니다.

여기서 더 나아가서 보면 이쑤시개에 꽂힌 소시지를 보시면 아래 그림처럼 개별적으로 소시지의 위치를 조절할 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhOPoYCYnxP4PIYkkDu9MXNiu2N509vA-ufqpVCP9tzJn2oBFYw2G00AEcqkVmQyxXDnCMOmUWG31rprE3uMVOEW38W1vj7bMgymG7Vgqv4bUyfgQFyZAY2pZX_6vFvTo6oUp_sFSKRlVPOWZJQNgA_bGh-G1cqL1Apb3o63x6yj1A6Rm2wxoFDpVYDExY)

교차축에서는 위 그림과 같이 개별 아이템의 위치를 조 절할 수 있습니다.

그렇다면 주축에서는 어떨까요?

아래 그림처럼 옆의 아이템에 가려 이동이 어렵습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjW_gR2-fM-k1sCzdm82dsKxfx3rD0XLfEG_fm3fwsu8qWdY4nJIPf51T-WTPE4bHMpJ8ExRA0F0XBwN7NLmPFMCJyySLyYUX1d6XE3Sp6bLsAFPuO3a9dkEpzgKZyBf350rpg6eWY7YiRinF4Ds2Bc4T0RyuUD9MSq418SPsPdIxOvp0Soq-ai6RICejU)

![](https://blogger.googleusercontent.com/img/a/AVvXsEiY8oVD_LVOBVa2Asce3iDKfkh7tIzYX8WHDE6MdrTVbmHfiW9Ep4UAfIpRJutrwInzsMMlZOypW8RsNIAdhr3HmeeOLDCJym7atS30pGBvf0yI-GAuqUxjDC7xm_5f0P2u3g4_umBcCtEKNHalFju1oX1B66wRxTO34jVQ9afPB0YJAAKqbHvqi89FZIE)

위 두 개의 그림처럼 가운데 아이템을 왼쪽 오른쪽으로 옮길려고 해도 다른 아이템에 영향을 받아 움질 일 수 없는데요.

이게 바로 주축(Primary Axis)에서 일어나는 현상입니다.

조금 더 깊게 생각해 보시면 위 그림의 차이가 바로 주축과 교차축의 차이인데요.

교차축에서는 각 아이템을 움직일 수 있지만 주축에서는 각 아이템을 움직일 수 없습니다.

주축에서는 단지 그룹의 분배만 가능한거죠.

그래서 justify-self라는 용어가 없는 이유이기도 합니다.

그래서 아래와 같이 각 용어를 이해하시면 쉬울 듯 합니다.

```html
justify - 주축(primary axis)를 따라 뭔가를 위치시키는 개념

align - 교차축(cross axis)를 따라 뭔가를 위치시키는 개면ㅁ

content - 뭔가 분배될 수 있는 그룹

items - 개별적으로 위치될 수 있는 한 의 아이템들
```

---

다음 시간에 계속 flexbox에 대해 심도있게 공부해 보겠습니다.
