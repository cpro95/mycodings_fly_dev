import { createCookieSessionStorage } from "react-router";
import type { Theme } from "./theme";

const { commitSession, getSession } = createCookieSessionStorage({
  cookie: {
    path: "/",
    sameSite: "lax",
    name: "mycodings_theme",
    httpOnly: true,
    secrets: [process.env.SESSION_SECRETS as string],
    secure: process.env.NODE_ENV === "production",
  },
});

export async function getThemeSession(request: Request) {
  const themeSession = await getSession(request.headers.get("Cookie"));
  return {
    getTheme: (): Theme | null => themeSession.get("mycodings_theme") || null,
    setTheme: (theme: Theme) => themeSession.set("mycodings_theme", theme),
    commit: async () =>
      commitSession(themeSession, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 100),
      }),
  };
}
