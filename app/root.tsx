import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
  useLocation,
} from '@remix-run/react'
import type { LinksFunction, LoaderFunction } from '@remix-run/server-runtime'
import { json } from '@remix-run/server-runtime'
import Nav from '~/components/nav'
import appStyles from '~/styles/app.css'
import Footer, { preloadFooterSvg } from './components/footer'
import { preloadSvg } from './components/theme-toggle'
import type { Theme } from './utils/theme'
import { SsrTheme, ThemeMeta, ThemeProvider, useTheme } from './utils/theme'
import { getThemeSession } from './utils/theme-session.server'
import * as gtag from '~/utils/gtags.client'
import { useEffect } from 'react'

type LoaderData = { theme: Theme | null }

export const links: LinksFunction = () => {
  return [
    { rel: 'preload', href: appStyles, as: 'style' },
    { rel: 'stylesheet', href: appStyles },
    ...preloadSvg(),
    ...preloadFooterSvg(),
  ]
}

export const loader: LoaderFunction = async ({ request }) => {
  const { getTheme } = await getThemeSession(request)

  return json<LoaderData>({ theme: getTheme() })
}

function App() {
  const [theme] = useTheme()
  const location = useLocation()
  useEffect(() => {
    gtag.pageview(location.pathname, 'G-711DBPQNDX')
  }, [location])

  return (
    <html lang='ko' className={`h-full ${theme ? theme : 'dark'}`}>
      <head>
        <meta charSet='utf-8' />
        <meta
          name='viewport'
          content='width=device-width,initial-scale=1,maximum-scale=1'
        />
        <meta
          name='naver-site-verification'
          content='2b76370650a82ce820d08f2aa4a87170e9d41692'
        />
        <meta name='NaverBot' content='All' />
        <meta name='NaverBot' content='index,follow' />
        <meta name='Yeti' content='All' />
        <meta name='Yeti' content='index,follow' />
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/apple-touch-icon.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/favicon-32x32.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href='/favicon-16x16.png'
        />
        <link rel='manifest' href='/site.webmanifest'></link>
        <ThemeMeta />
        <Meta />
        <Links />

        {/* <!-- Global site tag (gtag.js) - Google Analytics --> */}
        <script
          async
          src='https://www.googletagmanager.com/gtag/js?id=G-711DBPQNDX'
        ></script>
        <script
          async
          id='gtag-init'
          dangerouslySetInnerHTML={{
            __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-711DBPQNDX', {
                  page_path: window.location.pathname,
                });
              `,
          }}
        />

        {/* <!-- google adsense insert --> */}
        <script
          async
          src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7748316956330968'
          crossOrigin='anonymous'
        ></script>
      </head>
      <body className='h-full bg-white dark:bg-slate-800'>
        <div className='flex h-full flex-col'>
          <Nav />
          <main className='flex-1 px-6'>
            <Outlet />
          </main>
          <Footer />
        </div>
        <SsrTheme serverTheme={!!theme} />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

export default function AppProviders() {
  const { theme } = useLoaderData<LoaderData>()

  return (
    <ThemeProvider ssrTheme={theme}>
      <App />
    </ThemeProvider>
  )
}

export function ErrorBoundary(props: any) {
  console.log(props.error)
  return (
    <html>
      <head>
        <title>Oops!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <section className='flex h-full items-center bg-gray-50 text-gray-800 sm:p-16'>
          <div className='container mx-auto my-8 flex flex-col items-center justify-center space-y-8 px-5 text-center sm:max-w-md'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 512 512'
              className='h-40 w-40 text-gray-400'
            >
              <path
                fill='currentColor'
                d='M256,16C123.452,16,16,123.452,16,256S123.452,496,256,496,496,388.548,496,256,388.548,16,256,16ZM403.078,403.078a207.253,207.253,0,1,1,44.589-66.125A207.332,207.332,0,0,1,403.078,403.078Z'
              ></path>
              <rect
                width='176'
                height='32'
                x='168'
                y='320'
                fill='currentColor'
              ></rect>
              <polygon
                fill='currentColor'
                points='210.63 228.042 186.588 206.671 207.958 182.63 184.042 161.37 162.671 185.412 138.63 164.042 117.37 187.958 141.412 209.329 120.042 233.37 143.958 254.63 165.329 230.588 189.37 251.958 210.63 228.042'
              ></polygon>
              <polygon
                fill='currentColor'
                points='383.958 182.63 360.042 161.37 338.671 185.412 314.63 164.042 293.37 187.958 317.412 209.329 296.042 233.37 319.958 254.63 341.329 230.588 365.37 251.958 386.63 228.042 362.588 206.671 383.958 182.63'
              ></polygon>
            </svg>
            <p className='text-3xl'>
              Looks like our services are currently offline
            </p>
            <Link
              rel='noopener noreferrer'
              to='/'
              className='rounded bg-blue-600 px-8 py-3 font-semibold text-gray-50'
            >
              Back to homepage
            </Link>
          </div>
        </section>
        <Scripts />
      </body>
    </html>
  )
}

export function CatchBoundary() {
  const caught = useCatch()
  return (
    <html>
      <head>
        <title>Oops!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <section className='flex h-full items-center bg-gray-50 p-16 text-gray-800'>
          <div className='container mx-auto my-8 flex flex-col items-center justify-center px-5'>
            <div className='max-w-md text-center'>
              <h2 className='mb-8 text-9xl font-extrabold text-gray-400'>
                <span className='sr-only'>Error</span>
                {caught.status}
              </h2>
              <p className='text-2xl font-semibold md:text-3xl'>
                {caught.statusText}
              </p>
              <p className='mt-4 mb-8 text-gray-600'>
                But dont worry, you can find plenty of other things on our
                homepage.
              </p>
              <Link
                rel='noopener noreferrer'
                to='/'
                className='rounded bg-blue-600 px-8 py-3 font-semibold text-gray-50'
              >
                Back to homepage
              </Link>
            </div>
          </div>
        </section>

        <Scripts />
      </body>
    </html>
  )
}
