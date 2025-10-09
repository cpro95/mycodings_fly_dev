---
slug: 2022-07-28-how-to-add-disqus-comment-to-react-application
title: React로 만든 블로그에 Disqus 댓글창 달기
date: 2022-07-28 05:56:47.137000+00:00
summary: Disqus 댓글 창 React 애플리케이션에 적용하기 (Next.js, Remix)
tags: ["disqus", "react", "next.js", "remix"]
contributors: []
draft: false
---

안녕하세요?

오늘은 제가 만들고 있는 나만의 블로그인 [myCodings.fly.dev](https://mycodings.fly.dev)에 댓글 창을 달려고 합니다.

직접 Prisma와 SQlite3을 이용해서 만들려고 했는데,

시간이 너무 오래 걸리고 해서 그냥 가장 잘 나가는 Disqus 댓글 창을 적용하려고 합니다.

일단 [Disqus](https://disqus.com/) 홈페이지로 가볼까요?

다들 Disqus에 로그인되어 있다고 생각하고 진행하겠습니다.

![mycodings.fly.dev-howto-attach-disqus-to-blog](https://blogger.googleusercontent.com/img/a/AVvXsEjOYGymmwBfTVjohjq-SdON6MyFmMJs4UpdP8oIx-fOrOd9x57F-qtQG_38LD6CQmHWuoYpwlcRpf3sh-knuuvx7TmYg7UTMf7shBirKuZnPJD7BA22p2HLTb9kUb_8isnGbbevRBXsGxH50JbRo88NLPNuwz7hdTcNYL6njo_mNin3ZqeY-yCJxMkY)

여기서 로그인되어 있다는 전제하에 가운데 "GET STARTED" 버튼을 누르면 아래와 같이 나옵니다.

![mycodings.fly.dev-howto-attach-disqus-to-blog](https://blogger.googleusercontent.com/img/a/AVvXsEhjmpqM2bPdHlvOcdbRQKFM1ehMBbz7imH5tu2xKkXrEx-Wh6UAfVtkMgFyqtyYy13hoO2Wcv8hiCrI91-Q-NKLVhD-vfqTc36ffFwJlNrWVvbweV8O6ccyOz5oSBFOHtiXbg7vvaeOAkuyOEKEWHTuyfV0OxGKM65PFTHE3d-usL6SDzB2a6si-G_e=s16000)

여기서 2번째인 "I want to install Disqus on my site"버튼을 누릅니다.

그러면 아래와 같이 설정 화면이 나오는데요.
![mycodings.fly.dev-howto-attach-disqus-to-blog](https://blogger.googleusercontent.com/img/a/AVvXsEgoX3W3YdvWnZ8ZmMuyekfhSGCdzUDOldmUU5TtXH_y-UBd6tMgOyNYfmT8PXaoMwaNcrgIy0QdySxpu9OIZvy3v6wOGHM0MWI01Vwi_EKhfOQwHLQ-ZAVBY_f_SiSx0gxyKk_GBLcz-m54Fh0ZHVilM6c3xBmlrS-gY9_wB9ShKVBcSbSW6YEXAGaG=s16000)

중요한 거는 "Website Name"입니다.

이게 일종의 Disqus 시스템의 ID라고 볼 수 있는데요.

나만의 독특한 이름으로 지정하시면 됩니다.

그 외는 취향껏 선택하시면 되고요.

![mycodings.fly.dev-howto-attach-disqus-to-blog](https://blogger.googleusercontent.com/img/a/AVvXsEgpu_lCMzP0i12z7whunS9b_EAiSxJfZV3AiaCLUGTFGugL7-m5R9zhZX1oxF9_bKfK82sXyN_WqIHHT__Bte1ZQMnFlUIAtzf4ECLgUMJnM8jb_mn0onresP1vX3BAxnQ6TItRjDT5UoFxmJaGjQYZ-aa1bE3AobuQY30Xb7sTpGgPCVaDXD_4Up0S=s16000)

가격 플랜을 물어봅니다.

우리는 당연히 맨 아래 "Basic"을 골라주면 됩니다.

그러면 아래와 같이 블로그 시스템을 물어보는데요.

![mycodings.fly.dev-howto-attach-disqus-to-blog](https://blogger.googleusercontent.com/img/a/AVvXsEgtvK37CeZ3Ak_gYL4guxWxb98cto7RmnMpFCuuY4ETl5tumOqNtXfkWTpiLxbBYExwMZztBwx78qbt3Vb_tcqvLUGoaLM6-2IIH53mxwynAmZyyvyF19Kz94GVlAuCqCwfdw076q5F56hq600dGI6kTGhWm4UNFDqjRNnPNCD7DTlJhi8hSmgdc24A=s16000)

우리는 그냥 맨 밑에 "install manually with Universal Code"를 선택합시다.

그러면 화면이 바뀌면서 코드가 나오는데요.

```js
<div id="disqus_thread"></div>
<script>
    /**
    *  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
    *  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables    */
    /*
    var disqus_config = function () {
    this.page.url = PAGE_URL;  // Replace PAGE_URL with your page's canonical URL variable
    this.page.identifier = PAGE_IDENTIFIER; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
    };
    */
    (function() { // DON'T EDIT BELOW THIS LINE
    var d = document, s = d.createElement('script');
    s.src = 'https://mycodings-test.disqus.com/embed.js';
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
    })();
</script>
<noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>
```

뭔가 아주 복잡한데요.

일단 화면 맨 아래 "Configure" 버튼을 누릅니다.

그러면 최종적으로 사이트 댓글창 시스템 설정이 나옵니다.

![mycodings.fly.dev-howto-attach-disqus-to-blog](https://blogger.googleusercontent.com/img/a/AVvXsEiK5DY4Nadl3321HKkKfqH9_E63fYpRmgmuIplVtlt0oeWmr2e7fO2PvQRVgRyzZ02ejBRJamscr6bDnlDozevKMKOEdSrfbe0OFhAltzuSbrRTkTyMfMXYsHm7ZTSDZ433D-tPMmYncxNPcztWBoa-_7k2bAz8N9ZtAXyYLnSE_ATW8RoftCPoQmgw=s16000)

저는 "Website URL"만 제대로 넣으면 된다고 생각합니다.

여러분의 사이트에 맞게 넣어주시고, 마지막으로 "Next"버튼을 누릅니다.

여기서 개발 서버(http://localhost:3000)를 넣으시면 안 됩니다.

배포된 사이트라고 생각하시고 넣으십시오.

그다음으로 댓글 쓰기의 세팅이 나오는데요.

![mycodings.fly.dev-howto-attach-disqus-to-blog](https://blogger.googleusercontent.com/img/a/AVvXsEjqrAJUMunLwbVyFrJjdIdtXIUr0bTCabMLrY3dXDKi3zkMskecB2xxVqOmAO69rHPE5xI1pRmP-gioDU-C8Q2s9I8v8I-oC9R9QNKDG4WsAqcZtvkEyzO6pSwOrkAKPHkbYVb1CIhs817PGk7DN5UY0cLvjjk6v-EVM_1aHX9k1niKI2b6WpvqXGJV=s16000)

그냥 "Balanced"로 고르면 무관합니다.

이제 완료되었는데요.

--- 

## React 애플리케이션에 적용하기

이제 Disqus 세팅도 했으니까 자신의 블로그에 적용해야 하는데요.

요즘 블로그는 다들 순수 HTML이 아니고 JAM 스택이나 아니면 React를 이용한 Next.js 또는 Remix Framework일건데요.

결국은 React에 어떻게 적용해야 하냐가 문제인데요.

Disqus 팀에서 만든 [disqus-react](https://github.com/disqus/disqus-react) 패키지가 있습니다.

```js
npm install --save disqus-react
```

위와 같이 패키지를 설치하고, 이제 본격적으로 React 코드에 적용해 보겠습니다.

## 블로그에 Disqus 적용하기

댓글은 블로그 메인 페이지가 아니라 블로그 글 하나하나의 링크에 댓글 시스템이 나와야 되는데요.

그래서 저도 제 사이트의 블로그 slug 파일인 `blog.$slug.tsx`에 설치해야 합니다.

저는 Remix Framework인데요. Next.js를 쓰셔도 어차피 똑같은 React라서 적용 방식은 똑같을 겁니다.

일단 disqus-react는 여래 개의 컴포넌트를 제공해 주는데요.

제일 많이 쓰는 게 바로 `DiscussionEmbed` 컴포넌트입니다.

먼저, 이걸 설명해 보겠습니다

원하는 위치에 일단 넣어야겠죠.

```js
import { DiscussionEmbed } from 'disqus-react';

<DiscussionEmbed
    shortname='example'
    config={
        {
            url: this.props.article.url,
            identifier: this.props.article.id,
            title: this.props.article.title,
            language: 'ko'
        }
    }
/>
```

일단 `shortname` 아까 위에서 Disqus 세팅할 때 만들었던 유니크한 이름을 넣으시면 됩니다.

그리고, 중요한 게 url, identifier, title인데요.

language는 안 넣으셔도 됩니다.

language 세팅은 disqus 홈페이지에 저장된 세팅을 이용하니까요.

일단 URL인데요.

제 사이트 주소가 https://mycodings.fly.dev인데,

이걸 적으면 됩니다.

그리고 identifier인데요.

이건 블로그 글 하나하나를 차별하여 유니크하게 해주는 뭔 가인 데요.

보통은 slug를 많이 이용합니다.

slug가 바로 제목을 이어 붙여 만든 블로그 경로이기 때문에 웬만하면 이게 중복될 리가 없습니다.

slug, title에 대한 값은 서버 사이드 방식으로 블로그 글 정보에서 가지고 오면 됩니다.

참고로 제 Remix 블로그인 `blog.$slug.tsx`파일 내용을 전부 올려드리겠습니다.

```js
import * as React from 'react'
import type {
  HeadersFunction,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/server-runtime'
import { json } from '@remix-run/server-runtime'
import { useLoaderData } from '@remix-run/react'
import { getMDXComponent } from 'mdx-bundler/client'
import invariant from 'tiny-invariant'
import { getMdxPage } from '~/utils/mdx.server'
import type { MdxComponent } from '~/types'

import styles from 'highlight.js/styles/night-owl.css'
import { getSeoMeta } from '~/utils/seo'

import { DiscussionEmbed } from 'disqus-react'
import { getDomainUrl } from '~/utils/misc'

type LoaderData = {
  mdxPage: MdxComponent
  domain: string
}

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => {
  const { keywords = [] } = data.mdxPage.frontmatter.meta ?? {}
  const seoMeta = getSeoMeta({
    title: data.mdxPage.title,
    description: data.mdxPage.description,
    twitter: {
      description: data.mdxPage.description,
      title: data.mdxPage.title,
    },
  })

  return { ...seoMeta, keywords: keywords.join(', ') }
}

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }]

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return {
    'cache-control':
      loaderHeaders.get('cache-control') ?? 'private, max-age=60',
    Vary: 'Cookie',
  }
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const slug = params.slug
  invariant(typeof slug === 'string', 'Slug should be a string, and defined')

  const mdxPage = await getMdxPage({ contentDirectory: 'blog', slug })

  if (!mdxPage) {
    throw json(null, { status: 404 })
  }

  const domain = getDomainUrl(request)

  return json<LoaderData>(
    { mdxPage, domain },
    {
      headers: { 'cache-control': 'private, max-age: 60', Vary: 'Cookie' },
    },
  )
}

export default function Blog() {
  const data = useLoaderData<LoaderData>()

  const Component = React.useMemo(
    () => getMDXComponent(data.mdxPage.code),
    [data],
  )

  return (
    <>
      <article className='prose prose-zinc mx-auto min-h-screen max-w-4xl pt-24 dark:prose-invert lg:prose-lg'>
        <Component />
        <DiscussionEmbed
          shortname='mycodings'
          config={{
            url: data.domain,
            identifier: data.mdxPage.slug,
            title: data.mdxPage.title,
            language: 'ko',
          }}
        />
      </article>
    </>
  )
}

```

Remix의 서버 사이드 코드는 loader 함수에서 실행할 수 있습니다.

loader 함수에서 파라미터에 전달된 해당 slug를 이용한 블로그 글 정보를 읽어오고 그걸 다시 Client 사이드 쪽인 React로 보내줍니다.

React 코드에서는 `useLoaderData()`라고 Remix가 제공해 주는 함수를 이용하면 loader 함수에서 서버 사이드에서 실행되고 리턴된 값을 가지고 올 수 있습니다.

그리고 그걸 이용해서 url, identifier, title에 해당 값을 전달하고 있고요.

Next.js에서도 마찬가지입니다.

getServerSideProps 함수에서 블로그 글을 가져오고 그 정보를 props로 Client 사이드 쪽으로 넘겨주면 되기 때문입니다.

실행 결과입니다.

제 글 마지막에 잘 적용되었네요.

![mycodings.fly.dev-howto-attach-disqus-to-blog](https://blogger.googleusercontent.com/img/a/AVvXsEgfW8AtVOu1FLHKJS1B26S1EC4-m003wsSotZMso7tqypgvv83G8bzIslTcXJUWULz-wpFCJsRaXpAl9yFkxALhUP_8IVztgwt0AHpGzI2LclSdqi691aLUDct3kAEJAwH_Q4vqgcmJIvGfAdF2nNhUfVVW_YjIFkOYvR3fWiSQl4zprlM1bOQmeqWM=s16000)

그럼.
