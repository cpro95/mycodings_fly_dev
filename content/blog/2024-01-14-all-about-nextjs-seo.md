---
slug: 2024-01-14-all-about-nextjs-seo
title: Next.js에서 SEO 완벽하게 구축하기
date: 2024-01-14 07:52:57.902000+00:00
summary: Search Engine Optimization 완벽 구축 in Next.js
tags: ["next.js", "seo", "meta tags", "json-ld", "sitemap", "robots.txt"]
contributors: []
draft: false
---

SEO (Search Engine Optimization)라는 말이 있는데요.

구글 같은 서치엔진에 자신의 웹사이트를 잘 노출할 수 있는 게 웹사이트 노출도를 올리는 지름길인데요.

그래서 블로그에 글만 잘 쓴다고 되는 게 아니라 사이트의 SEO가 얼마나 잘 이루어지고 있는지 체크해야 합니다.

오늘은 Next.js에서 할 수 있는 모든 SEO 관련 내용을 정리해 볼까 합니다.

---

** 목 차 **

* 1. [Meta Tags(메타태그)](#MetaTags)

* 2. [JSON-LD 스키마 이용](#JSON-LD)

* 3. [Sitemap (사이트맵)](#Sitemap)

* 4. [robots.txt (로봇.txt)](#robots.txt.txt)

* 5. [Link Tags (링크 태그들)](#LinkTags)

* 6. [Script 최적화](#Script)

* 7. [Image 최적화](#Image)

---

##  1. <a name='MetaTags'></a>Meta Tags(메타태그)

SEO를 위한 첫걸음은 당연히 메타태그입니다.

먼저, 가장 기본적인 항목들입니다.

```bash
title: <title>웹사이트 타이틀</title>

description: <meta name="description" content="웹페이지 상세 설명"/>

keywords: <meta name="keywords" content="키워드 여러 개 나열"/>

robots: <meta name="robots" content="index, follow"/>

viewport: <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

charSet: <meta charSet="utf-8"/>
```

두 번째, Open Graph 용 메타태그입니다.

```bash
og:site_name: <meta property="og:site_name" content="사이트 이름"/>

og:locale: <meta property="og:locale" content="ko_KR"/>

og:title: <meta property="og:title" content="웹사이트 타이틀"/>

og:description: <meta property="og:description" content="웹사이트 상세 설명"/>

og:type: <meta property="og:type" content="website"/>

og:url: <meta property="og:url" content="웹사이트 url 주소"/>

og:image: <meta property="og:image" content="웹사이트 이미지 url 주소"/>

og:image:alt: <meta property="og:image:alt" content="웹사이트 이미지 alt 텍스트"/>

og:image:type: <meta property="og:image:type" content="image/png"/>

og:image:width: <meta property="og:image:width" content="1200"/>

og:image:height: <meta property="og:image:height" content="630"/>
```

세 번째는 Article 관련 메타태그입니다.

```bash
article:published_time: <meta property="article:published_time" content="2024-01-14T11:35:00+07:00"/>

article:modified_time: <meta property="article:modified_time" content="2024-01-14T11:35:00+07:00"/>

article:author: <meta property="article:author" content="https://www.linkedin.com/in/myname"/>
```

네 번째는 트위터 관련 메타태그입니다.

```bash
twitter:card: <meta name="twitter:card" content="대형 이미지에 대한 요약 설명"/>

twitter:site: <meta name="twitter:site" content="@mycodings"/>

twitter:creator: <meta name="twitter:creator" content="@mycodings"/>

twitter:title: <meta name="twitter:title" content="웹사이트 제목"/>

twitter:description: <meta name="twitter:description" content="웹사이트 상세 설명"/>

twitter:image: <meta name="twitter:image" content="웹사이트 이미지 url 주소"/>
```

이렇게 메타태그는 4가지가 있는데요.

Next.js에서는 페이지의 Head 컴포넌트 안에 넣으면 됩니다.

```js
import Head from 'next/head'

export default function Page() {
  return (
    <Head>
      <title>웹사이트 타이틀</title>
      <meta name='description' content='웹페이지 상세 설명' />
      <meta name='keywords' content='키워드 여러 개 나열' />
      <meta name='robots' content='index, follow' />
      <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      <meta charSet='utf-8' />
      <meta property='og:site_name' content='사이트 이름' />
      <meta property='og:locale' content='ko_KR' />
      <meta property='og:title' content='웹사이트 타이틀' />
      <meta property='og:description' content='웹페이지 상세 설명' />
      <meta property='og:type' content='website' />
      <meta
        property='og:url'
        content='https://mycodings.fly.dev/blog/2024-01-14-all-about-nextjs-seo'
      />
      <meta
        property='og:image'
        content='https://mycodings.fly.dev/blog/2024-01-14-all-about-nextjs-seo/thumbnail.png'
      />
      <meta property='og:image:alt' content='웹사이트 이미지 alt 텍스트' />
      <meta property='og:image:type' content='image/png' />
      <meta property='og:image:width' content='1200' />
      <meta property='og:image:height' content='630' />
      <meta
        property='article:published_time'
        content='2024-01-14T11:35:00+07:00'
      />
      <meta
        property='article:modified_time'
        content='2024-01-14T11:35:00+07:00'
      />
      <meta
        property='article:author'
        content='https://www.linkedin.com/in/myname'
      />
      <meta name='twitter:card' content='대형 이미지에 대한 요약 설명' />
      <meta name='twitter:site' content='@mycodings' />
      <meta name='twitter:creator' content='@mycodings' />
      <meta name='twitter:title' content='웹사이트 타이틀' />
      <meta name='twitter:description' content='웹페이지 상세 설명' />
      <meta
        name='twitter:image'
        content='https://mycodings.fly.dev/blog/2024-01-14-all-about-nextjs-seo/thumbnail.png'
      />
    </Head>
  )
}
```

---

##  2. <a name='JSON-LD'></a>JSON-LD 스키마 이용

JSON-LD(JavaScript Object Notation for Linked Data) Schema는 웹 상에서 데이터를 구조화하고 공유하기 위한 형식의 일종인데요.

그리고 JSON-LD의 이름에서 알 수 있듯이 Linked Data의 원칙을 따르고 있습니다.

Linked Data는 데이터의 상호 연결성을 강조하며, 웹 상에서 데이터를 효과적으로 연결하고 검색할 수 있도록 하는 개념입니다.

JSON-LD 스키마 파일은 [Schema.org](https://schema.org/) 이곳에서 쉽게 만들 수 있습니다.

예를 들어 아까 메타태그로 만들었던 걸 JSON-LD 형식으로 만들어 보겠습니다.

```js
import Head from 'next/head'

export default function Page() {
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: '웹사이트 타이틀',
    description: '웹페이지 상세 설명',
    keywords: '키워드 여러 개 나열',
    url: 'https://mycodings.fly.dev/blog/2024-01-14-all-about-nextjs-seo',
    image:
      'https://mycodings.fly.dev/blog/2024-01-14-all-about-nextjs-seo/thumbnail.png',
    author: {
      '@type': 'Person',
      name: 'https://www.linkedin.com/in/myname',
    },
    datePublished: '2024-01-14T11:35:00+07:00',
    dateModified: '2024-01-14T11:35:00+07:00',
    publisher: {
      '@type': 'Organization',
      name: '사이트 이름',
      logo: {
        '@type': 'ImageObject',
        url: '로고 이미지 URL',
      },
    },
    headline: '웹사이트 타이틀',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://mycodings.fly.dev/blog/2024-01-14-all-about-nextjs-seo',
    },
    articleSection: '섹션 이름',
    articleBody: '본문 내용',
    thumbnailUrl:
      'https://mycodings.fly.dev/blog/2024-01-14-all-about-nextjs-seo/thumbnail.png',
  }

  return (
    <Head>
      {/* 나머지 파트 */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, 2) }}
      />
    </Head>
  )
}
```

위와 같이 할 수 있습니다.

---

##  3. <a name='Sitemap'></a>Sitemap (사이트맵)

사이트맵이야말로 써치 엔진에 있어 가장 중요한데요.

Next.js는 next-sitemap이라는 아주 훌륭한 패키지가 있습니다.

```bash
npm install next-sitemap
npx next-sitemap
```

위와 같이 하면 public 폴더에 sitemap.xml 파일이 생깁니다.

사이트맵의 형식은 다음과 같은 형식이니까 참조 바랍니다.

```xml
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
<url>
  <loc>https://mycodings.fly.dev</loc>
    <lastmod>2024-01-11T02:03:09.613Z</lastmod>
    <changefreq>daily</changefreq>
  <priority>0.7</priority>
</url>
<!-- other pages -->
</urlset>
```

---

##  4. <a name='robots.txt.txt'></a>robots.txt (로봇.txt)

써치엔진이 사이트에 접속해서 크롤링 해갈 때의 규칙을 정해주는 파일인데요.

Next.js 에서는 public 폴더 안에 두면 됩니다.

```bash
User-agent: *
Disallow:
Sitemap: https://mycodings.fly.dev/sitemap.xml
Sitemap: https://mycodings.fly.dev/sitemap-0.xml
```

위 robots.txt 파일에서 두 번째에 있는 Disallow 항목이 있는데요.

이 항목에 특정 주소를 넣으면 써치엔진이 그 주소로는 접근하지 않습니다.

```bash
User-agent: *
Disallow: /private-page
```

---

##  5. <a name='LinkTags'></a>Link Tags (링크 태그들)

HTML의 head 태그 안에는 수많은 링크 태그가 있는데요.

그중에서 SEO와 관련된 링크 태그를 정리해 드리겠습니다.

```bash
canonical: <link rel="canonical" href="페이지의 url"/>

alternate: <link rel="alternate" href="페이지의 url" hrefLang="ko_KR"/>

icon: <link rel="icon" href="아이콘 url" type="image/x-icon"/>

apple-touch-icon: <link rel="apple-touch-icon" href="아이콘 url"/>

manifest: <link rel="manifest" href="manifest url"/>
```

Next.js에서 적용한 코드의 모습은 아래와 같습니다.

```js
import Head from "next/head";
 
export default function Page() {
  return (
    <Head>
      {/* 나머지 파트들 */}
      <link rel="canonical" href="https://mycodings.fly.dev/blog/2014-01-14-all-about-nextjs-seo" />
      <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png" />
      <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png" />
      <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png" />
      <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png" />
      <link
        rel="apple-touch-icon"
        sizes="114x114"
        href="/apple-icon-114x114.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="120x120"
        href="/apple-icon-120x120.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="144x144"
        href="/apple-icon-144x144.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="152x152"
        href="/apple-icon-152x152.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-icon-180x180.png"
      />
      <link
        rel="icon"
        type="image/png"
        href="/favicon-32x32.png"
        sizes="32x32"
      />
      <link
        rel="icon"
        type="image/png"
        href="/android-chrome-192x192.png"
        sizes="192x192"
      />
      <link
        rel="icon"
        type="image/png"
        href="/favicon-96x96.png"
        sizes="96x96"
      />
      <link
        rel="icon"
        type="image/png"
        href="/favicon-16x16.png"
        sizes="16x16"
      />
    </Head>
  );
}
```

---

##  6. <a name='Script'></a>Script 최적화

Next.js는 Head 태그 안에 script 태그를 쉽게 넣어 줄 수 있는 빌트인 `<Script>` 컴포넌트를 제공해 줍니다.

예를 들어 Google Analytics의 script 태그를 넣어야 한다면 아래와 같이 넣으면 됩니다.

```js
import Head from "next/head";
import Script from "next/script";
 
export default function Page() {
  return (
    <Head>
      {/* 나머지 파트들 */}
      <Script
        async
        id="tag-manager"
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
      />
      <Script async strategy="afterInteractive" id="analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-XXXXXXXXXX');
        `}
      </Script>
    </Head>
  );
}
```

---

##  7. <a name='Image'></a>Image 최적화

이미지는 웹사이트의 품질에 결정적인 역할을 하는데요.

대신 이미지가 무거우면 구글 PageSpeed에서 높은 점수를 따지 못합니다.

Next.js에서는 이미지 최적화를 위한 'next/image' 패키지를 제공해 주는데요.

다음과 같이 사용하시면 됩니다.

```js
import Image from "next/image";
 
export default function Page() {
  return (
    <Image
      src="https://mycodings.fly.dev/blog/2024-01-14-all-about-nextjs-seo/thumbnail.png"
      alt="Next.js에서 SEO 완벽하게 구축하기"
      width={1200}
      height={630}
    />
  );
}
```

---

지금까지 Next.js에서 SEO를 완벽하게 구현하기 위한 여러 가지 방법을 살펴보았는데요.

많은 도움이 됐으면 합니다.

그럼.
