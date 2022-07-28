import type { LoaderFunction } from '@remix-run/server-runtime'
import invariant from 'tiny-invariant'

import { getMdxListItems } from '~/utils/mdx.server'
import { getDomainUrl } from '~/utils/misc'

export const loader: LoaderFunction = async ({ request }) => {
    const posts = await getMdxListItems({ contentDirectory: 'blog', page: 1, itemsPerPage: 100000 })

    const blogUrl = `${getDomainUrl(request)}/blog`

    const sitemap = `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url>
    <loc>https://mycodings.fly.dev/</loc>
    <lastmod>2022-07-23T13:02:06+00:00</lastmod>
    <priority>1.00</priority>
</url>
<url>
    <loc>https://mycodings.fly.dev/blog</loc>
    <lastmod>2022-07-23T13:02:06+00:00</lastmod>
    <priority>0.80</priority>
</url>
        ${posts
            .map(post => {
                const frontMatter = JSON.parse(post.frontmatter)

                invariant(
                    typeof frontMatter.title === 'string',
                    `${post.slug} should have a title in fronte matter`,
                )
                invariant(
                    typeof frontMatter.description === 'string',
                    `${post.slug} should have a description in fronte matter`,
                )
                invariant(
                    typeof post.timestamp === 'object',
                    `${post.slug} should have a timestamp`,
                )

                return `
<url>
    <loc>${blogUrl}/${post.slug}</loc>
    <lastmod>${post.timestamp.toISOString()}</lastmod>
</url>
                `.trim()
            })
            .join('\n')}
</urlset>
  `.trim()

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
            'Content-Length': String(Buffer.byteLength(sitemap)),
        },
    })
}
