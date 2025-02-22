import { reactRouter } from "@react-router/dev/vite";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ command }) => {
  if (command !== "serve") {
    return {
      css: {
        postcss: {
          plugins: [tailwindcss, autoprefixer],
        },
      },
      plugins: [reactRouter(), tsconfigPaths()],
    };
  } else {
    return {
      css: {
        postcss: {
          plugins: [tailwindcss, autoprefixer],
        },
      },
      plugins: [
        reactRouter(),
        tsconfigPaths(),
        {
          name: "msw-plugin",
          configureServer(server) {
            import("./mocks/").then(({ server: mswServer }) => {
              mswServer.listen();
              console.log("📡 MSW server started with Vite");
            });
          },
        },
      ],
    };
  }
});
