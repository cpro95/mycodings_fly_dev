import LinkOrAnchor from "./link-or-anchor";

export function preloadFooterSvg() {
  return [
    {
      rel: "preload",
      href: "icons/github.svg",
      as: "image",
      type: "image/svg+xml",
    },
    {
      rel: "preload",
      href: "icons/twitter.svg",
      as: "image",
      type: "image/svg+xml",
    },
  ];
}

export default function Footer() {
  return (
    <footer className="mx-auto flex max-w-4xl items-center justify-center px-6 py-24">
      <div className="flex flex-col gap-32 md:flex-row">
        <div className="flex flex-col gap-8">
          <h3 className="place-self-center text-2xl font-bold text-gray-800 dark:text-gray-100">
            myCodings.fly.dev
          </h3>
          <ul className="flex items-center justify-center gap-6">
            <LinkOrAnchor href="https://github.com/cpro95">
              <Svg>
                <use href="/icons/github.svg#icon-github" />
              </Svg>
              <span className="sr-only">GitHub</span>
            </LinkOrAnchor>
            <LinkOrAnchor href="https://twitter.com/cpro95">
              <Svg>
                <use href="/icons/twitter.svg#icon-twitter" />
              </Svg>
              <span className="sr-only">Twitter</span>
            </LinkOrAnchor>
          </ul>
        </div>
        <div className="flex flex-col justify-center">
          <ul className="flex flex-col items-center gap-4 md:items-start">
            <LinkOrAnchor to="/">Home</LinkOrAnchor>
            <LinkOrAnchor to="/blog">Blog</LinkOrAnchor>
            <LinkOrAnchor to="/life">Life</LinkOrAnchor>
          </ul>
        </div>
      </div>
    </footer>
  );
}

function Svg({ children }: { children: React.ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-gray-500 dark:text-gray-300"
    >
      {children}
    </svg>
  );
}
