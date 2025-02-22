import { NavLink } from "react-router";
import clsx from "clsx";
import { ClientOnly } from "./client-only";
import ThemeToggle, { SsrPlaceholder } from "./theme-toggle";

export default function Nav() {
  return (
    <header className="py-8 px-6">
      <nav className="mx-auto flex max-w-4xl items-center justify-between">
        <div className="flex items-center gap-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              clsx(
                "text-xl text-gray-800 dark:text-gray-50",
                isActive ? "underline underline-offset-2" : null
              )
            }
          >
            Home
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              clsx(
                "text-xl text-gray-800 dark:text-gray-50",
                isActive ? "underline underline-offset-2" : null
              )
            }
            prefetch="intent"
            to="/blog"
          >
            Blog
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              clsx(
                "text-xl text-gray-800 dark:text-gray-50",
                isActive ? "underline underline-offset-2" : null
              )
            }
            prefetch="intent"
            to="/life"
          >
            Life
          </NavLink>
        </div>
        {/*
         * Since the correct theme on the initial render is known at
         * the client, we'll render the theme toggle at the client
         * after hydration
         */}
        <ClientOnly fallback={<SsrPlaceholder />}>
          {() => <ThemeToggle />}
        </ClientOnly>
      </nav>
    </header>
  );
}
