import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
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
