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

export const loader: LoaderFunction = async ({ params, request }) => {
  const slug = params.slug
  invariant(typeof slug === 'string', 'Slug should be a string, and defined')

  const mdxPage = await getMdxPage({ contentDirectory: 'blog', slug })

  if (!mdxPage) {
    throw json(null, { status: 404 })
  }

  const domain = getDomainUrl(request)

  // return json<MdxComponent>(mdxPage, {
  //   headers: { 'cache-control': 'private, max-age: 60', Vary: 'Cookie' },
  // })
  return json<LoaderData>(
    { mdxPage, domain },
    {
      headers: { 'cache-control': 'private, max-age: 60', Vary: 'Cookie' },
    },
  )
}

export default function Blog() {
  // const data = useLoaderData<MdxComponent>()
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
