import * as React from 'react'
import { Link, useLoaderData } from '@remix-run/react'
import type {
  HeadersFunction,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/server-runtime'
import { json } from '@remix-run/server-runtime'
import BlogList from '~/components/blog-list'
import { getMdxListItems } from '~/utils/mdx.server'
import { getSeo } from '~/utils/seo'
import LinkOrAnchor from '~/components/link-or-anchor'
import DisplayAds from '~/components/ads/display-ads'
import MultiplexAds from '~/components/ads/multiplex-ads'

type LoaderData = { blogList: Awaited<ReturnType<typeof getMdxListItems>> }

const [seoMeta, seoLinks] = getSeo()

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

export const loader: LoaderFunction = async () => {
  const blogList = await getMdxListItems({
    contentDirectory: 'blog',
    page: 1,
    itemsPerPage: 10,
  })

  return json<LoaderData>(
    { blogList: blogList.slice(0, 5) },
    { headers: { 'cache-control': 'private, max-age=60' } },
  )
}

export default function Index() {
  const { blogList } = useLoaderData()

  return (
    <>
      <section className='mx-auto max-w-4xl'>
        {/* <div className='grid h-[calc(100vh-92px)] place-content-center'> */}

        <div className='grid place-content-center'>
          {/* 구글 디스플레이 광고 삽입 */}
          <DisplayAds />
          {/* 구글 디스플레이 광고 삽입 */}
          
          {/* <h1 className='flex flex-col items-center p-4'>
            <Link to='/'>
              <GradientText>myCodings</GradientText>
            </Link>
          </h1> */}
          <section>
            <div className='mx-auto grid max-w-screen-xl px-4 py-8 lg:grid-cols-12 lg:gap-8 lg:py-16 xl:gap-0'>
              <div className='mr-auto place-self-center lg:col-span-7'>
                <h1 className='mb-4 max-w-2xl text-4xl text-gray-500 font-extrabold leading-none tracking-tight dark:text-white md:text-5xl xl:text-6xl'>
                  All about Web Development ...
                </h1>
                <p className='mb-6 max-w-2xl font-medium text-gray-500 dark:text-gray-400 md:text-lg lg:mb-8 lg:text-xl'>
                  Javascript, Typescript, React, Remix Framework, Next.js 등
                  최신 웹 개발 트렌드를 같이 공부할 수 있는 블로그 입니다.
                </p>
                <Link
                  to='/blog'
                  className='mr-3 inline-flex items-center justify-center rounded-lg bg-blue-700 px-5 py-3 text-center text-base font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900'
                >
                  블로그 바로가기
                  <svg
                    className='ml-2 -mr-1 h-5 w-5'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z'
                      clipRule='evenodd'
                    ></path>
                  </svg>
                </Link>
              </div>
              <div className='ml-2 hidden lg:col-span-5 lg:mt-0 lg:flex'>
                <img src='intro_image.jpg' alt='intro' />
              </div>
            </div>

            <div className='mx-auto mb-4 px-4 text-center md:max-w-screen-md lg:max-w-screen-lg lg:px-36'>
              <span className='text-2xl font-semibold uppercase tracking-widest text-gray-600 dark:text-gray-300'>
                FEATURED SITE
              </span>
              <div className='mt-8 flex flex-wrap items-center justify-center text-gray-600 dark:text-gray-400 sm:justify-between'>
                <LinkOrAnchor
                  href='https://cpro95.github.io'
                  target='_blank'
                  className='mr-5 mb-5 hover:text-gray-800 dark:hover:text-gray-200 lg:mb-0'
                >
                  cpro95.github.io
                </LinkOrAnchor>
                <LinkOrAnchor
                  href='https://mymovies.fly.dev'
                  target='_blank'
                  className='mr-5 mb-5 hover:text-gray-800 dark:hover:text-gray-200 lg:mb-0'
                >
                  myMovies
                </LinkOrAnchor>
                <LinkOrAnchor
                  href='https://cpro95.tistory.com'
                  target='_blank'
                  className='mr-5 mb-5 hover:text-gray-800 dark:hover:text-gray-200 lg:mb-0'
                >
                  tistory
                </LinkOrAnchor>
              </div>
            </div>
          </section>
        </div>
      </section>
      <section className='mx-auto mt-6 w-[90vw]'>
        <div className='mx-auto max-w-4xl'>
          <h2 className='text-xl text-gray-800 dark:text-gray-100'>
            Recent Posts
          </h2>
          <BlogList blogList={blogList} contentDirectory="blog" />
          <div className='mx-auto max-w-4xl'>
            {/* 멀티플렉스광고 */}
            <MultiplexAds />
            {/* 멀티플렉스광고 */}
          </div>
        </div>
      </section>
    </>
  )
}

// function GradientText(props: React.HTMLAttributes<HTMLSpanElement>) {
//   return (
//     <span
//       className='bg-gradient-to-r from-sky-600 via-pink-500 to-red-600 bg-clip-text text-center text-4xl leading-snug text-transparent dark:via-blue-400 dark:to-green-300'
//       {...props}
//     />
//   )
// }
