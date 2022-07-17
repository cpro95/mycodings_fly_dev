import { initSeo } from 'remix-seo'

export const { getSeo, getSeoLinks, getSeoMeta } = initSeo({
  title: '드리프트의 mycodings',
  description: '드리프트의 mycodings, mycodings.fly.dev',
  twitter: {
    card: 'summary',
    creator: '@cpro95',
    site: 'https://mycodings.fly.dev',
    title: '드리프트의 mycodings',
    description: '드리프트의 mycodings, mycodings.fly.dev',
  },
})
