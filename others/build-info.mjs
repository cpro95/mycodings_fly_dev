import path from "path";
import fs from "fs";
import fetch from "node-fetch";
import { fileURLToPath } from "url";

// __dirname을 ES 모듈에서 사용할 수 있도록 정의
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SHA = process.env.COMMIT_SHA;

async function getCommitInfo() {
  try {
    // console.log(
    //   "아래 GITHUB_REPOSITORY는 docker에서 --build-arg에 자동으로 github actions에 의해 지정된다."
    // );
    const response = await fetch(
      `https://api.github.com/repos/${process.env.GITHUB_REPOSITORY}/commits/${SHA}`
    );
    const data = await response.json();

    return {
      author: data.commit.author.name,
      timestamp: data.commit.author.date,
      sha: data.sha,
      message: data.commit.message,
      url: data.html_url,
    };
  } catch (e) {
    console.error(`💣 fetch failed with ${e.message}`);
  }
}

async function run() {
  const data = {
    timestamp: Date.now(),
    data: await getCommitInfo(),
  };

  // 현재 스크립트 파일의 위치를 기준으로 상대 경로 계산
  const filePath = path.resolve(__dirname, "../public/build/info.json");

  try {
    // 디렉토리가 존재하는지 확인하고, 없으면 생성
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // 파일에 데이터 쓰기
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Build info saved successfully to ${filePath}`);
  } catch (error) {
    console.error("Error writing build info:", error);
  }
}

run();
