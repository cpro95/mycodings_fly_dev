import { setupServer } from "msw/node";
import { GitHubMocks } from "./github";

export const server = setupServer(...GitHubMocks);

async function startServer() {
  server.listen({ onUnhandledRequest: "warn" });
  console.info("🔶 MSW Server initialized");
  // 프로세스를 유지하기 위한 무한 루프
  return new Promise(() => {}); // 이 Promise는 절대 resolve되지 않음
}

process.once("SIGINT", () => {
  console.info("🔶 MSW Server shutting down...");
  server.close();
  process.exit();
});

process.once("SIGTERM", () => {
  console.info("🔶 MSW Server shutting down...");
  server.close();
  process.exit();
});

startServer().catch((error) => {
  console.error("Failed to start MSW server:", error);
  process.exit(1);
});
