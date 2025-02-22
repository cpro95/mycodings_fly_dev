import type {
  HeadersFunction,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/server-runtime'
import { json } from '@remix-run/server-runtime'
import { useLoaderData, useSearchParams } from '@remix-run/react'
import BlogList from '~/components/blog-list'
import { getMdxListItems, getMdxListItemsWithQ } from '~/utils/mdx.server'
import { getSeo } from '~/utils/seo'
import {
  getFrontmatterList,
  getMdxCount,
  getMdxCountWithQ,
} from '~/model/content.server'
import MyPagination from '~/components/my-pagination'
import SearchForm from '~/components/search-form'
import { z } from 'zod'
import { getSearchParams } from 'remix-params-helper'
import BestTags from '~/components/best-tags'
import InfeedAds from '~/components/ads/infeed-ads'
import MultiplexAds from '~/components/ads/multiplex-ads'

type LoaderData = {
  blogList: Awaited<ReturnType<typeof getMdxListItems>>
  blogCount: number
  arrayOfBestPool: Array<string>
}

const [seoMeta, seoLinks] = getSeo({
  title: '드리프트의 myCodings',
  description: '드리프트의 myCodings.fly.dev!',
  twitter: {
    title: 'cpro95',
    description: '드리프트의 myCodings.fly.dev!',
  },
})

export const meta: MetaFunction = () => {
  return { ...seoMeta }
}

export const links: LinksFunction = () => {
  return [...seoLinks]
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return {
    'cache-control':
      loaderHeaders.get('cache-control') ?? 'private, max-age=60',
    Vary: 'Cookie',
  }
}

const filterBlogSchema = z.object({
  index: z.void().optional(),
  q: z.string().optional(),
  page: z.string().optional(),
  itemsPerPage: z.string().optional(),
})

export const loader: LoaderFunction = async ({ request }) => {
  const query = getSearchParams(request, filterBlogSchema)

  // const url = new URL(request.url)
  // let page = Number(url.searchParams.get('page'))
  // let itemsPerPage = Number(url.searchParams.get('itemsPerPage'))

  let page: number = 1
  let itemsPerPage: number = 10
  let q = query.data?.q as string
  if (query.data?.page && !isNaN(Number(query.data?.page)))
    page = Number(query.data?.page)
  if (query.data?.itemsPerPage && !isNaN(Number(query.data?.itemsPerPage)))
    itemsPerPage = Number(query.data?.itemsPerPage)

  let blogList
  let blogCount
  if (q === undefined) {
    blogList = await getMdxListItems({
      contentDirectory: 'blog',
      page: page,
      itemsPerPage: itemsPerPage,
    })
    blogCount = await getMdxCount('blog')
  } else {
    blogList = await getMdxListItemsWithQ({
      contentDirectory: 'blog',
      q: q,
      page: page,
      itemsPerPage: itemsPerPage,
    })
    blogCount = await getMdxCountWithQ('blog', q)
  }

  const allFrontmatterList = await getFrontmatterList("blog")

  let Pool = new Map<string, number>()

  allFrontmatterList.map(af =>
    JSON.parse(af.frontmatter).meta.keywords.map(k =>
      Pool.set(k, Pool.has(k) ? Pool.get(k)! + 1 : 1),
    ),
  )
  // console.log(new Map([...Pool].sort()))

  const sortedPool = new Map([...Pool].sort((a, b) => b[1] - a[1]))

  const bestPool = new Map([...sortedPool].filter(a => a[1] > 2))
  const arrayOfBestPool: Array<string> = [...bestPool.keys()]

  return json<LoaderData>(
    { blogList, blogCount, arrayOfBestPool: arrayOfBestPool.slice(0, 6) },
    {
      headers: { 'cache-control': 'private, max-age=60', Vary: 'Cookie' },
    },
  )
}

export default function Blog() {
  const [myParams] = useSearchParams()
  const { blogList, blogCount, arrayOfBestPool } = useLoaderData()

  type paramsType = {
    [key: string]: string
  }
  let paramsArray: paramsType[] = []
  myParams.forEach((value, name) => paramsArray.push({ [name]: value }))

  let page: number = 1
  let itemsPerPage: number = 10
  let q: string = ''

  paramsArray.map(p => (p.hasOwnProperty('q') ? (q = String(p.q)) : {}))
  paramsArray.map(p =>
    p.hasOwnProperty('page') ? (page = Number(p.page)) : {},
  )
  paramsArray.map(p =>
    p.hasOwnProperty('itemsPerPage')
      ? (itemsPerPage = Number(p.itemsPerPage))
      : {},
  )

  return (
    <section className='mx-auto max-w-4xl pt-8'>
      <BestTags bestTags={arrayOfBestPool} />
      <SearchForm method='get' action='.' />

      <div className='mt-2 max-w-lg'>
        {/* 인피드광고 */}
        <InfeedAds />
        {/* 인피드광고 */}
      </div>

      <BlogList blogList={blogList} contentDirectory="blog" />
      <MyPagination
        q={q}
        page={page}
        itemsPerPage={itemsPerPage}
        total_pages={Math.ceil(Number(blogCount) / itemsPerPage)}
      />
      <div className='mx-auto max-w-4xl'>
        {/* 멀티플렉스광고 */}
        <MultiplexAds />
        {/* 멀티플렉스광고 */}
      </div>
    </section>
  )
}
