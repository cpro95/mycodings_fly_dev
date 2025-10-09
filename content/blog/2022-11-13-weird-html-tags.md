---
slug: 2022-11-13-weird-html-tags
title: 잘 모르지만 유용한 HTML 태그(tag) 모음
date: 2022-11-13 13:59:39.040000+00:00
summary: 잘 안 쓰고 잘 모르는 유용한 HTML 태그 살펴보기
tags: ["html", "tag"]
contributors: []
draft: false
---

![mycodings_fly_dev-weird-html-tags](https://blogger.googleusercontent.com/img/a/AVvXsEhudMlOD3SEdyDw5g59KqfU_xzuFON6A796LNXSdWi2AyjgqjQaPqneafZNPeBbDEM2ECN0WfIJYj9kGvTdjGmXMjkzka4dbvJPaSxG7hPYoBENYFdiowndZ2CKc5w88lJ787UvqIlGgWknFlIVFp3TWIOaWy6kP5tzEo50USh-lHGPlgYOFhUrTN1c)

안녕하세요?

오늘은 HTML 작성에 있어 잘 모르고 있던 태그에 대해 알아보겠습니다.

이런 태그도 있었나 싶을 정도로 처음 보는 게 많았는데요.

한번 알아두면 유용하게 쓸 수 있을 거 같아 소개하려고 합니다.

<hr />
## 1. meter 태그

meter 태그를 모르고 있었더라도 progress 태그는 알고 있었을 겁니다.

그런데 meter 태그도 있으니 한번 사용해 보십시오.

```html
<div>
  <p>1. meter & progress</p>
  <progress max="100" value="70"></progress>
  <br />
  <meter min="0" max="100" low="25" high="75" optimum="80" value="50"></meter>
</div>
```

![mycodings_fly_dev-weird-html-tags](https://blogger.googleusercontent.com/img/a/AVvXsEjm_a10XkJOr5p_hU7RUu114IgXRB9C0lrbN62QJnUfexq36ofuGO36NzZxQ5xMSC_8Mkq6SIPM4KybO_Q4xsTRaZLZEsTQ4acEQVKmE4JoN5PQH6Be6E-zDAw0DOEFUowcDBtyOv-FzvI7WnYicwPPrTfq6Sb3Stfv-1gPultySe8JhMFjrZQ0JQrS)

첫번째가 progress 태그이고 두번째가 meter 태그입니다.

<hr />
## 2. sup 태그와 sub 태그

두 번째는 수학 기호나 화학 원소를 표시할 때 쓰이는 sup와 sub 태그입니다.

사용법을 보시면 쉽게 이해하실 수 있을 겁니다.

```html
<div>
  2. sup & sub
  <p>
    <var>length<sup>2</sup></var> + <var>width<sup>2</sup></var> =
    <var>result<sup>2</sup></var>
  </p>

  <p>C<sub>8</sub> H<sub>10</sub> N<sub>4</sub> O<sub>2</sub></p>
</div>
```

![mycodings_fly_dev-weird-html-tags](https://blogger.googleusercontent.com/img/a/AVvXsEjJ1Phjg_p6tOdmkqNKjMRNTWUUNzHit5FRvlVStUcXRGD4VQuq8j-sSUA4vwYs0EJUfZng-0_NpLthwO0KAZ_oMaFOw_vnbNI5dG_l98TzV96Y5lbJDCrzxvovdun5FmB8gQQYPUEyP0lcWwIrrC7NMUPL5XKGfIZf0wo8D2thr3ivyatWouU5i1B8)

<hr />
## 3. datalist 태그

3번째로 알아볼 태그는 아주 유용한 태그인데요.

바로 input 태그에 쓰일 datalist 태그입니다.

```html
<div>
  <label for="ice-cream-choice">Choose a flavor:</label>
  <input
    list="ice-cream-flavors"
    id="ice-cream-choice"
    name="ice-cream-choice"
  />
  <datalist id="ice-cream-flavors">
    <option value="Chocolate" />
    <option value="Coconut" />
    <option value="Mint" />
    <option value="Strawberry" />
    <option value="Vanilla" />
  </datalist>
</div>
```

![mycodings_fly_dev-weird-html-tags](https://blogger.googleusercontent.com/img/a/AVvXsEjt7SwlRQXNs-tsA2LR_TvMo9diOg7DwtJCQvZDFNoSSXFibJbsIltRFJmxX8QTiivlffWzLQFrLXTzCABIVc9B-5NQHz60BTabkOR1Fn-Foff1ulKz-R28HbNjB4kjYjk4oso-efM4E3wPGq5FxpPKHSqz1wXoOb-ZjYiHvyDFbvOh0vI_zMuIhn_s)

위 그림을 보시면 아주 유용하게 사용할 수 있을 겁니다.

<hr />
## 4. details 태그와 summary 태그

4번째로 알아볼 태그는 우리가 자바스크립트를 이용해서 작성했던 아코디언 같은 건데요.

html 태그로도 작성이 가능하니까 앞으로 꼭 사용하시길 바랍니다.

```html
<details>
  <summary>Details</summary>
  Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint corporis, ab
  esse exercitationem illum molestias distinctio sunt numquam magnam quibusdam
  inventore dolores nostrum, iure tenetur atque consectetur, excepturi voluptate
  ad!
</details>
```

아래 그림처럼 details 버튼을 누르면 summary가 나오는 방식입니다.

물론 details 버튼을 한 번 더 누르면 summary가 사라지는 토글 방식입니다.

![mycodings_fly_dev-weird-html-tags](https://blogger.googleusercontent.com/img/a/AVvXsEjMbGgirfA1MfDJNruKsgKhHfRpRd1AMyqEwH75GkIiK-v1hVIpSDq2VgoDWyWYD9RxCybjGT8FNuGiy0guOQYxKG4bQgHudiuvdFe68xQUFRWNhVNhoG92l_j8uVwiEt-tAdpv2VgzpCCVsuFV-KOvSsPpA-zwJu-FT280RQSUj4V_IpsFtRu7k2Cd)

![mycodings_fly_dev-weird-html-tags](https://blogger.googleusercontent.com/img/a/AVvXsEhbF5p-vBX1mkqBx5gz_CpRWCRnmIGjlMBLOF6vM55Bu_Z-2KAHtdrm0KoK_KvVaJduQ5Bw48KrvUBPEmQelI3_Wdva4hPrWP2Wq7lA3PpoI2Kyv6ODwX9Q0FF07HjUD61NyIOr6z0ttnHJp5E4ZcnTRhSVHBGSlWk1vuId9HIn-crWDKsVFFHizwVI=s16000)

<hr />

## 5. object 태그

다섯 번째로는 object 태그인데요.

HTML에 pdf 파일이나 이미지, 비디오, 오디오 심지어는 유튜브 비디오까지 넣을 수 있는 다목적 태그입니다.

일단 pdf를 보여주는 예제를 보시죠.

```html
<object data="./Test_PDF.pdf" style="width: 50vw; height: 60vh"></object>
```

![mycodings_fly_dev-weird-html-tags](https://blogger.googleusercontent.com/img/a/AVvXsEgdY_vvC2tOYxWqNODKidB5mT6Jy23kB2pc2wdsJpuTEY7bEJWhHA54lrkAGUMe6kftklLWMZ3za2geqU3WEOCkC0YsYNU05LV5vzZhT5IB_C32XgXrJTAM1ZfIRHmF57eDFrudfVMZsq_NU6w6a9srh64xDG0Y1vcbuOn5l8TIxnbjtN6IBAd3p3Sx)

PDF 파일을 HTML 파일에 그대로 보여주고 있습니다.

<hr />

## 6. abbr 태그

이번에는 줄임말을 나타낼 수 있는 abbr 태그에 대해 알아봅시다.

```html
<p>
  The <abbr title="html element of abbreviation">abbr</abbr> elements is good
  for abbreviations.
</p>
```

아래 그림을 보시면 aabr에 점선으로 밑줄이 그어져 있는데요.

거기에 마우스를 가만히 대고 있으면 그 밑에 줄임말의 설명이 나옵니다.

줄임말의 설명은 위 코드에서 처럼 title 속성에 지정할 수 있습니다.

![mycodings_fly_dev-weird-html-tags](https://blogger.googleusercontent.com/img/a/AVvXsEhv6Hqmf-n0j1Xj9oz-GyFV1eqzlJAQHnTDINnyLoZSphM6Mt4CmIJzrRY0gn0c8uWJIKDL6tiVu1xGnT_xlPiDmDw4IwROPWEs8-A6h7dUTiDjrIhiPQn2QFPanS6PdrLPm8tVNaCuexihUWhRDkzLC18NOZ6dX2hxBH5QPHGTSZkc_T1wC1B-sLuH)

<hr />

지금까지 HTML 태그에서 자주 사용하지 않는 걸 알아보았는데요.

기술이 발전되면서 여러 가지 유용한 태그가 계속 만들어지니까 MDN 사이트를 한번 정독하는 것도 좋을 듯 싶습니다.

그럼.
