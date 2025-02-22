import type { Route } from "./+types/[_action].set-theme";
import { data, redirect } from "react-router";
import { isTheme } from "~/utils/theme";
import { getThemeSession } from "~/utils/theme-session.server";

export const action = async ({ request }: Route.ActionArgs) => {
  const { commit, setTheme } = await getThemeSession(request);
  const text = await request.text();
  const queryParams = new URLSearchParams(text);
  const theme = queryParams.get("theme");

  if (isTheme(theme)) {
    setTheme(theme);

    return new Response(null, { headers: { "set-cookie": await commit() } });
  }

  return data({ message: "Bad request" });
};

export const loader = () => redirect("/", { status: 404 });
