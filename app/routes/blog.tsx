import type {
  HeadersFunction,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/server-runtime'
import { json } from '@remix-run/server-runtime'
import { useLoaderData, useSearchParams } from '@remix-run/react'
import BlogList from '~/components/blog-list'
import { getMdxListItems } from '~/utils/mdx.server'
import { getSeo } from '~/utils/seo'
import { getMdxCount } from '~/model/content.server'
import MyPagination from '~/components/my-pagination'

type LoaderData = {
  blogList: Awaited<ReturnType<typeof getMdxListItems>>
  blogCount: Awaited<ReturnType<typeof getMdxCount>>
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

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  let page = Number(url.searchParams.get('page'))
  let itemsPerPage = Number(url.searchParams.get('itemsPerPage'))

  if (page === 0) page = 1
  if (itemsPerPage === 0) itemsPerPage = 10

  const blogList = await getMdxListItems({
    contentDirectory: 'blog',
    page,
    itemsPerPage,
  })
  const blogCount = await getMdxCount('blog')

  return json<LoaderData>(
    { blogList, blogCount },
    {
      headers: { 'cache-control': 'private, max-age=60', Vary: 'Cookie' },
    },
  )
}

export default function Blog() {
  const [myParams] = useSearchParams()
  const { blogList, blogCount } = useLoaderData()

  type paramsType = {
    [key: string]: string
  }
  let paramsArray: paramsType[] = []
  myParams.forEach((value, name) => paramsArray.push({ [name]: value }))

  let page: number = 1
  let itemsPerPage: number = 10
  paramsArray.map(p =>
    p.hasOwnProperty('page') ? (page = Number(p.page)) : {},
  )
  paramsArray.map(p =>
    p.hasOwnProperty('itemsPerPage')
      ? (itemsPerPage = Number(p.itemsPerPage))
      : {},
  )

  console.log(myParams.get('p'))
  return (
    <section className='mx-auto max-w-4xl pt-24'>
      <BlogList blogList={blogList} />
      <MyPagination
        page={page}
        itemsPerPage={itemsPerPage}
        total_pages={Math.ceil(Number(blogCount) / itemsPerPage)}
      />
    </section>
  )
}
