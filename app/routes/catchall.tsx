import type { Route } from "./+types/catchall";
import { HelpCircle } from "lucide-react";
import { Link } from "react-router";

export default function CatchAll({}: Route.ComponentProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

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
        className="rounded-lgÏ bg-blue-600 px-8 py-3 font-semibold text-gray-50"
      >
        <span className="text-sm font-medium text-primary/60 group-hover:text-primary">
          Return to Home
        </span>
      </Link>
    </main>
  );
}
