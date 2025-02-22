import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
} from "react-router";

import type { Route } from "./+types/root";
import stylesheet from "./app.css?url";
import { HelpCircle } from "lucide-react";
import Nav from "./components/nav";
import Footer, { preloadFooterSvg } from "./components/footer";
import { preloadSvg } from "./components/theme-toggle";
import { getThemeSession } from "./utils/theme-session.server";
import { SsrTheme, ThemeProvider, Theme, ThemeMeta } from "./utils/theme";
import { useEffect } from "react";
import * as gtag from "./utils/gtags.client";

export const links: Route.LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  ...preloadSvg(),
  ...preloadFooterSvg(),
];

export async function loader({ request }: Route.LoaderArgs) {
  const { getTheme } = await getThemeSession(request);
  return { theme: getTheme() };
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { theme } = useLoaderData();

  const location = useLocation();
  useEffect(() => {
    gtag.pageview(location.pathname, "G-711DBPQNDX");
  }, [location]);

  return (
    <html
      lang="ko"
      className={`h-full ${theme === Theme.dark ? "dark" : "light"}`}
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="naver-site-verification"
          content="2b76370650a82ce820d08f2aa4a87170e9d41692"
        />
        <meta name="NaverBot" content="All" />
        <meta name="NaverBot" content="index,follow" />
        <meta name="Yeti" content="All" />
        <meta name="Yeti" content="index,follow" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest"></link>
        <ThemeMeta theme={theme} />
        <Meta />
        <Links />
        {/* <!-- Global site tag (gtag.js) - Google Analytics --> */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-711DBPQNDX"
        ></script>
        <script
          async
          id="gtag-init"
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
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7748316956330968"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className="h-full bg-white dark:bg-slate-800">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App({ loaderData }: Route.ComponentProps) {
  const theme = loaderData.theme;

  return (
    <ThemeProvider ssrTheme={theme}>
      <div className="flex h-full flex-col">
        <Nav />
        <main className="flex-1 px-6">
          <Outlet />
        </main>
        <Footer />
      </div>
      <SsrTheme serverTheme={!!theme} />
    </ThemeProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="flex h-screen w-full flex-col items-center justify-center gap-8 rounded-md bg-card px-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card hover:border-primary/40">
        <HelpCircle className="h-8 w-8 stroke-[1.5px] text-primary/60" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <p className="text-2xl font-medium text-primary">Whoops!</p>
        <h1>{message}</h1>
        <p className="text-center text-lg font-normal text-primary/60">
          {details}
        </p>
        {stack && (
          <pre className="w-full p-4 overflow-x-auto">
            <code>{stack}</code>
          </pre>
        )}
      </div>
      <Link
        rel="noopener noreferrer"
        to="/"
        className="rounded bg-blue-600 px-8 py-3 font-semibold text-gray-50"
      >
        <span className="text-sm font-medium text-primary/60 group-hover:text-primary">
          Return to Home
        </span>
      </Link>
    </main>
  );
}
