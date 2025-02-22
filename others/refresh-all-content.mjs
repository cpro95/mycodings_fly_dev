import { postJSON } from "./utils.mjs";

async function go() {
  // console.log(
  //   "아래 GITHUB_SHA는 docker에서 --build-arg에 자동으로 github actions에 의해 지정된다."
  // );
  const compareSha = process.env.GITHUB_SHA;

  const response = await postJSON({
    postData: { refreshAll: true, sha: compareSha },
  });

  console.error("Content refreshed 🚀", { response });
}

go().catch((error) => {
  console.error(error);
});
