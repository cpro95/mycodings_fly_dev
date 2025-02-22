import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("/blog", "routes/blog.tsx"),
  route("/life", "routes/life.tsx"),
  route("/blog/:slug", "routes/blog.$slug.tsx"),
  route("/life/:slug", "routes/life.$slug.tsx"),
  route("/_action/set-theme", "routes/[_action].set-theme.ts"),
  route("/_content/update-content", "routes/[_content].update-content.ts"),
  route("/_content/refresh-content", "routes/[_content].refresh-content.ts"),
  route(
    "/_content/refresh-content.json",
    "routes/[_content].refresh-content[.]json.ts"
  ),
  route("/sitemap.xml", "routes/sitemap[.]xml.ts"),
  route("/blog/rss.xml", "routes/blog.rss[.]xml.ts"),
  route("/life/rss.xml", "routes/life.rss[.]xml.ts"),
  route("/healthcheck", "routes/healthcheck.ts"),
  route("/*", "routes/catchall.tsx"),
] satisfies RouteConfig;
