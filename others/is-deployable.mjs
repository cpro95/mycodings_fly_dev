import { fetchJSON, getChangedFiles } from "./utils.mjs";

async function go() {
  // console.log(
  //   "아래 FLY_APP_NAME는 docker에서 --build-arg에 자동으로 github actions에 의해 지정된다."
  // );
  const buildInfo = await fetchJSON({
    url: `https://${process.env.FLY_APP_NAME}.fly.dev/build/info.json`,
  });
  const sha = buildInfo.data.sha;
  // console.log(
  //   "아래 GITHUB_SHA는 docker에서 --build-arg에 자동으로 github actions에 의해 지정된다."
  // );
  const compareSha = process.env.GITHUB_SHA;
  const changes = getChangedFiles(sha, compareSha);

  const isDeployable =
    changes === null ||
    changes.length === 0 ||
    changes.some(({ filename }) => !filename.startsWith("content"));

  console.error(isDeployable ? "🟢 Deploy" : "🔴 Skip Deployment");

  console.log(isDeployable);
}

go().catch((error) => {
  console.error(error);
  console.log(true);
});
