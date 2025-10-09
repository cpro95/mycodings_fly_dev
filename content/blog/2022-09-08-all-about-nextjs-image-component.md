---
slug: 2022-09-08-all-about-nextjs-image-component
title: Next.js Image 컴포넌트 완벽 가이드
date: 2022-09-08 13:00:49.998000+00:00
summary: Next.js Image 컴포넌트 모든 속성 파헤치기
tags: ["next.js", "image"]
contributors: []
draft: false
---

![mycodings.fly.dev-all-about-nextjs-image-component](https://blogger.googleusercontent.com/img/a/AVvXsEjO0pinCN8SoAcCG9aD6yt4u1Q3hfqx5x-92ANuKkZycLoLP157vS8sNiLJkB4-f2vohOP8vp9Z8ZkG2cAOcrvFzoWvy1rdxXr2zw7Cur1QgFiLboIZAaehcWgex3oUm2veYeP_WGKnrPxGhw-JunK_jFcsV7KiWMhBxC96LK17RgBBOALWu2EDBYKk)

## Next.js 이미지 최적화

그림 또는 이미지는 최근 웹 애플리케이션이나 웹페이지 작성에 있어 중요한 부분이 되었는데요.

이미지를 어떻게 관리하느냐에 따라 개발자 또는 최종 사용자의 기분을 좋게 할 수도 있고 망칠 수도 있습니다.

이미지는 웹페이지 또는 웹 애플리케이션의 유저들의 리액션을 높일 수 있는 중요한 도구이며 또한 써치 엔진 최적화에도 잘만 사용하면 좋은 도구가 될 수 있습니다.

전통적으로 이미지는 HTML의 img 태그를 사용하는데요. 작은 크기의 웹페이지에서는 효율적일 수 있으나, 많은 양의 이미지를 다루는 페이지에서는 HTML의 img 태그가 그다지 효과를 발휘할 수 없을 겁니다.

그래서 next.js에서는 버전 10부터 이 문제에 대한 해결책을 제시했는데요.

바로 “Image” 컴포넌트입니다. 이 컴포넌트는 자동으로 이미지를 최적화해 줍니다.

그럼 next.js가 제공하는 Image 컴포넌트에 대해 자세히 알아보겠습니다.

## 이것만은 꼭!

이미지 최적화를 위해 Next.js의 Image 컴포넌트를 쓰기 전에 좀 더 깊이 생각해 볼 게 있는데요.

만약 생각보다 많은 수의 이미지를 사용해야 한다면 CDN 서비스를 이용하는 게 더 좋습니다.

대표적인 이미지 CDN 서비스는 Cloudinary가 있는데요.

자동으로 캐싱해주고, 이미지 압축 및 사이즈도 재설정해 줘서 쉽게 이미지 최적화를 할 수 있습니다.

CDN 서비스까지 쓸 정도가 아니면 이미지 최적화를 위해 다음과 같은 3가지만 염두에 둔다면 더 좋은 웹페이지 또는 웹 애플리케이션을 만들 수 있을 겁니다.

#### 이미지 포맷(format) 선택

- 이미지는 JPEG, GIF, PNG, WebP 형태 등 많은 포맷이 있지만 추천해 드리는 포맷은 WebP 포맷입니다. WebP포맷은 가장 최근에 나온 규격으로 손실/비손실 압축을 지원해주고, 로딩 속도도 상당히 빠릅니다. 그래서 [WebP-변환기](https://ezgif.com/jpg-to-webp) 같은 걸로 기존 이미지를 WebP로 변환해 사용하는 걸 추천해 드립니다.

#### 이미지 사이즈(size) 재설정

- 이미지 사이즈도 중요한데요. 최근 모바일로 웹페이지를 보는 빈도가 높아죠 웹페이지를 기본적으로 모바일 최적화로 먼저 제작하는데요. 모바일에서 100x100으로 보여줘도 될 이미지를 데스크톱 기준 1080x800 이미지로 모바일에서 로딩하면 데이터 손실이 크지 않습니까? 그래서 [Responsive Breakpoints Generator](https://responsivebreakpoints.com/) 툴 같은 걸로 자동으로 이미지 사이즈를 화면 크기에 따라 조절할 수 있습니다.

#### 이미지 용량 압축(compress)

- 보통 웹페이지에서 사용되는 이미지가 1MB를 넘으면 안 된다고 하는데요. 이미지 로딩이 웹페이지 로딩에 지대한 영향을 끼치기 때문에 되도록 이미지는 압축해서 사용하는 게 좋습니다. 이미지 압축 툴로 유명한 사이트는 [TinyPNG](https://tinypng.com/)와 [Compressor.io](http://Compressor.io)가 있습니다.

위 3가지를 적용한다는 전제하에 본격적인 next.js 이미지 컴포넌트에 대해 알아보겠습니다.

---

## Next.js Image component

Next.js의 Image 컴포넌트는 아래와 같이 사용하면 됩니다.

```js
import Image from 'next/image';

const Profile = () => {
	return (
		<>
			<h1>User Profile</h1>
			<Image
				src={....}
				alt="user profile picture"
			/>
		</>
	)
}
```

Next.js의 Image 컴포넌트의 특징은 정적으로 임포트 된 이미지에 대해서는 width, height, blurDataURL 정보가 자동으로 생성된다는 점입니다.

이 3가지 정보는 페이지가 100% 로드되지 않았을 때 이미지의 위치가 변하는 현상 즉, Cummulative Layout Shift(CLS) 같은 상황이 발생할 때 아주 유용한데요.

물론 이 3가지 정보는 직접 지정할 수도 있습니다.

물론 src 속성(props)에 정적 이미지가 아닌 인터넷상의 이미지도 지정할 수 있습니다.

```js
import Image from 'next/image';

const Profile = () => {
	return (
		<>
			<h1>User Profile</h1>
			<Image
				src={https://unsplash.com/photos/...../.jpg}
				alt="user profile picture"
				width={300}
				heifht={300}
			/>
		</>
	)
}
```

인터넷상의 이미지를 사용할 때는 무조건 width, height 속성을 입력해야 하는데요.

왜냐하면 정적 이미지일 경우 Next.js가 build 할 때 width, height 속성을 계산할 수 있으나 원격 이미지(인터넷상의 이미지) 일 경우 width, height 속성을 계산하지 못하기 때문입니다.

---

## 속성(Properties)

`<Image />` 컴포넌트는 우리가 속성(props)으로 입력할 수 있는 부분이 많은데요. 3가지로 구분해서 알아보겠습니다.

### 필수 속성(required props)

- src

이 속성과 관련해서는 두 가지 형태로 이미지 소스를 지정할 수 있는데요.

아까도 봤듯이 public 폴더에 있는 정적 이미지와 웹상(인터넷상)에 있는 원격 이미지를 지정할 수 있습니다.

원격 이미지를 지정할 때도 절대 경로나 상대 경로로 이미지를 지정할 수 있는데요.

상대 경로로 이미지를 지정할 때는 next.config.js에 미리 domains 정보를 세팅해야만 합니다.

domains 관련 정보는 이 글의 마지막쯤에 자세한 정보가 나옵니다.

- width, height

이 속성은 이미지가 페이지에서 얼마나 많은 자리를 차지하느냐 또는 컨테이너에 따라 얼마큼 변하느냐를 결정하게 되는데요.

특히 layout 속성의 값에 따라 특성이 변하게 됩니다.

만약 layout=”intrinsic”이거나 layout=”fixed” 일 때는 이미지의 width, height속성 값이 그대로 픽셀에 적용되고,

만약 layout=”responsive” 또는 layout=”fill”일 때는 이미지가 비율에 맞게 확대 축소됩니다.

---

### 선택 속성(optional props)

- layout

이 속성은 해당 이미지가 뷰포트(viewport)에 따라 어떻게 반응하는지에 대한 속성인데요. 디폴트인 “intrinsic”를 포함해서 4가지 옵션이 있습니다.

4가지 옵션에 대해 비주얼적으로 비교해 보시려면 데스크톱에서 아래 링크에서 확인해 보시면 됩니다.

[https://image-component.nextjs.gallery](https://image-component.nextjs.gallery/)

-> intrinsic : 디폴트 값이며, 이미지의 width, height에 따라 얼마나 많은 자리를 차지하는지 계산합니다.

-> fixed : 이미지의 정확한 width, height를 사용하여 표시합니다.

-> fill : 이미지를 상위 엘리먼트의 width, height에 맞추기 위해 자동으로 width, height를 조절합니다. 꼭 상위 엘리먼트에 position: relative 옵션을 적용해야 합니다. 이미지 사이즈를 모를 때 사용하면 좋은 옵션입니다.

-> responsive : 부모 컨테이너의 width에 맞게 이미지를 확대합니다. 꼭 부모 컨테이너에 display: block을 추가해야 합니다.

---

- loader

이 옵션은 이미지의 URL을 계산해야 할 때 쓰는 옵션입니다.

다음 예제를 보시면 쉽게 이해할 수 있을 겁니다.

```js
import Image from 'next/image'

const customLoader = ({ src, width, quality }) => {
  return `https://s3.amazonaws.com/image/${src}?w=${width}&q=${quality}`
}

const MyImage = props => {
  return (
    <Image
      src='profile.webp'
      width={300}
      height={300}
      alt='User profile'
      quality={80}
      loader={customLoader}
    />
  )
}
```

loader 옵션은 위와 같이 직접 코드상에서 지정할 수 있고 next.config.js의 images 섹션에서도 지정할 수 있습니다.

---

- placeholder

이 속성은 이미지가 완전히 로딩되기 전에 페이지에서 이미지가 차지하는 자리를 어떻게 보여줄까 하는 속성입니다.

“blur”와 “empty”를 지정할 수 있는데요. “empty”가 디폴트 값입니다.

만약 “blur”라고 지정하면 이미지가 완전히 로드되기 전에 블러(blur) 처리한 화면이 보이면서 나타나다가 최종적으로 해당 이미지가 나타날 겁니다.

그리고 정적으로 제공된 이미지 확장자가 .jpg, .png, .webp, .avf일 경우 Next.js Image 컴포넌트가 자동으로 blurDataURL을 제공해 줍니다.

---

- priority

우선순위라는 표면적인 뜻에 걸맞게 이 속성이 설정되어 있으면 브라우저가 이 이미지를 미리 렌더링 합니다.

그래서 랜딩 페이지에서 제일 처음 보이는 이미지에는 이 속성을 지정하는 게 유리합니다.

그리고 이 속성은 Boolean 타입이기 때문에 priority라고 적으면 true가 되고, 안 적으면 false가 됩니다.

물론 이미지에 lazy 로딩을 적용했을 때 priority 속성을 적용하면 lazy 로딩은 무시됩니다.

---

- quality

next.js Image 컴포넌트가 이미지를 어떤 품질로 보여줄지를 결정하는 속성인데요.

1에서 100까지 숫자로 지정하며, 기본값은 75입니다.

당연히 100이 최고의 품질입니다.

---

- sizes

페이지가 로딩될 때 화면의 레이아웃이 엉켜 보이는 현상인 Cummulative Layout Shift 현상을 방지하기 위해서는 이미지의 사이즈를 화면 뷰포트에 맞게 로딩해야 하는데요.

이때 쓰이는 옵션이며, 이 옵션을 쓰면 브라우저가 페이지를 로딩할 때 페이지 레이아웃을 헤치지 않는 상태에서 적절한 사이즈의 이미지를 로딩하게 됩니다.

Next.js의 Image 컴포넌트의 가장 강력한 기능 중에 자동으로 source set을 생성하는 기능이 있는데, source set을 생성하면 뷰포트에 맞게 알맞은 사이즈의 이미지를 로딩해서 페이지의 레이아웃을 망치지 않게 됩니다.

next.js는 next.config.js 파일에 있는 deviceSizes, imageSizes 값을 참조해서 srcSet을 생성합니다.

그리고 sizes 속성은 layout 속성이 꼭 “responsive” 이거나 “fill” 일 때만 작동됩니다.

아래 예제를 보면 sizes 속성을 어떻게 사용하는지 알 수 있습니다.

```js
import Image from 'next/image'

const Example = () => (
  <div>
    <Image
      src='/mock.png'
      layout='fill'
      sizes='(min-width: 60em) 24vw,
						 (min-width: 28em) 45vw,
						 100vw'
    />
  </div>
)
```

---

### 고급 속성(advanced props)

- blurDataURL

아까 위에서 언급했었는데 next.js가 자동으로 blur 관련 DATA URL을 만들어 줄 수 있고, 아니면 우리가 직접 만들 수 있습니다.

DATA URL은 base64로 인코딩 된 이미지여야 합니다.

물론 placeholder=”blur”일 때만 작동합니다.

```js
<Image
  src='https://unsplash.com/photo....'
  alt='cover photo'
  width={700}
  height={500}
  blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADA...'
  placeholder='blur'
/>
```

---

- loading

이 속성은 브라우저가 페이지를 로딩할 때 이미지 로딩을 어떤 행태로 하는지 지정하는 옵션입니다.

“lazy”와 “eager” 두 가지가 있는데요.

“lazy”는 이름 그대로 뷰포트 계산이 끝날 때까지 이미지 로딩을 홀딩하는 기능이 있어 페이지 레이아웃이 망쳐지는 걸 방지할 수 있습니다.

반면에 “eager” 옵션을 사용하면 이미지를 즉시 로딩하게 되는데요.

웹페이지의 퍼포먼스 측면에서는 굉장히 손해가 발생할 수 있으니 주의 바랍니다.

---

- objectFit

이 속성은 layout=”fill” 일 경우에 부모 엘러먼트에 대비해 사이즈를 조정하는 옵션인데요.

CSS의 object-fit 속성입니다.

해당 값으로는 “fill”, “cover”, “contain”이 있습니다.

---

- objectPosition

이 속성은 이미지의 위치를 이미지가 위치하는 부모(상위) 콘텐츠 기준으로 어느 위치로 배치할 할 수 있게 하는 속성인데요.

기본값은 “50% 50%”로 한가운데로 지정되어 있습니다.

```js
<Image
  src='/usr/webp'
  alt='User profile picture'
  width={300}
  height={300}
  objectPosition='right bottom'
/>
```

---

- onLoadingComplete

이미지가 완전히 로딩이 끝나면 호출되는 콜백 함수 관련 속성입니다.

“naturalHeight”, “naturalWidth” 값을 가지는 객체를 파라미터로 가집니다.

```js
const MyProfile = props => {
  const handleImageLoad = ({ naturalWidth, naturalHeight }) => {
    console.log(naturalWidth, naturalHeight)
  }
  return (
    <Image
      src='profile.webp'
      width={300}
      height={300}
      alt='user profile pic'
      onLoadingComplete={handleImageLoad}
    />
  )
}
```

---

- style

이미지에 특정 CSS 스타일을 지정할 수 있는데요.

그냥 `<Image />`에서 className을 통해 스타일을 지정해도 됩니다.

layout 속성으로 지정된 스타일은 style 속성보다 우선하며, 또한 style 속성으로 width 너비를 조정하고 싶을 때는 꼭 height=”auto”라고 해야 합니다.

안 그러면 이미지가 왜곡됩니다.

```js
<Image
  src='/background.webp'
  alt='water'
  width={800}
  height={800}
  style={{ opacity: 0.5 }}
  className='user_photo'
/>
```

---

### Next.js Image 관련 next.config.js 파일 설정

next.config.js 파일에 Image 컴포넌트에 대한 옵션을 지정할 수 있는데요.

“loader”와 “domains” 옵션입니다.

- loader

loader 옵션은 상대 경로의 이미지에 대해 정확한 path를 지정하게 해 주는데요.

loader를 이용하면 컴포넌트에서는 상대 경로로 이미지 위치를 지정하지만, 빌드(build) 시에 절대 경로로 Next.js가 자동으로 변환해 줍니다.

```js
module.exports = {
  images: {
    loader: 'amazon',
    path: 'https://s3.amazonaws.com/image',
  },
}
```

---

- domains

domains 옵션은 외부 이미지의 호스트 네임을 지정할 수 있습니다.

여기서 지정된 호스트네임만 허용되고 그 이외의 호스트에서 이미지를 불러오면 400 Bad Request가 리턴됩니다.

```js
module.exports = {
  images: {
    domains: ['s3.amazonaws.com'],
  },
}
```

---

지금까지 Next.js의 Image 컴포넌트에 대해 알아보았는데요.

Next.js가 sveltkit 등 다른 프레임워크랑 다른 점이 바로 이미지 최적화를 위한 Image 컴포넌트를 기본으로 제공해준다는 점입니다.

그래서 좀 더 완벽한 웹 페이지를 만들도록 해주죠.

이 글을 통해 Image 컴포넌트에 대해 공부하는데 조금이라도 도움이 됐으면 합니다.

그럼.
