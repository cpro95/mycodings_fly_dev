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
// import type { MdxComponent } from '~/types'

import styles from 'highlight.js/styles/night-owl.css'
import { getSeoMeta } from '~/utils/seo'
import Utterances from '~/components/utterances'
import KeywordsLink from '~/components/keywords-link'
import ContentsAds from '~/components/ads/contents-ads'
import MultiplexAds from '~/components/ads/multiplex-ads'
import { getBeforeAfterSlug } from '~/model/content.server'
import BeforeAfterLink from '~/components/before-after-link'

export const meta: MetaFunction = ({ data }) => {
  if (!data) return {};
  
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

export const loader: LoaderFunction = async ({ params }) => {
  const slug = params.slug
  invariant(typeof slug === 'string', 'Slug should be a string, and defined')

  const mdxPage = await getMdxPage({ contentDirectory: 'blog', slug })
  
  if (!mdxPage) {
    throw json(null, { status: 404 })
  }

  const beforeAfterSlugList = await getBeforeAfterSlug({
    slug,
    contentDirectory: 'blog',
  })

  return json(
    { mdxPage, beforeAfterSlugList },
    {
      headers: { 'cache-control': 'private, max-age: 60', Vary: 'Cookie' },
    },
  )
}

export default function Blog() {
  const { mdxPage, beforeAfterSlugList } = useLoaderData()
  const links = mdxPage.frontmatter.meta.keywords || []

  const Component = React.useMemo(
    () => getMDXComponent(mdxPage.code),
    [mdxPage],
  )

  return (
    <>
      <article className='prose prose-zinc mx-auto min-h-screen max-w-4xl dark:prose-invert lg:prose-lg'>
        <div className='mx-auto max-w-4xl'>
          {/* 콘텐츠삽입광고 */}
          <ContentsAds />
          {/* 콘텐츠삽입광고 */}
        </div>
        <br />
        <br />
        <Component />
        <KeywordsLink links={links} contentDirectory="blog" />
        <BeforeAfterLink
          beforeAfter={beforeAfterSlugList}
          contentDirectory='blog'
        />

        <div className='mx-auto max-w-4xl'>
          {/* 멀티플렉스광고 */}
          <MultiplexAds />
          {/* 멀티플렉스광고 */}
        </div>
        <Utterances />
      </article>
    </>
  )
}
