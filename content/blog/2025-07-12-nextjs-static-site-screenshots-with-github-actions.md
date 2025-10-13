---
slug: 2025-07-12-nextjs-static-site-screenshots-with-github-actions
title: GitHub Actions로 Next.js 정적 사이트 스크린샷 찍기 (미리보기 배포 없이 리뷰하기)
date: 2025-07-12 10:27:05.959000+00:00
summary: Vercel의 미리보기 배포 기능이 없으신가요? GitHub Actions와 Puppeteer를 활용하여, 정적으로 내보낸 Next.js 사이트의 모든 페이지 스크린샷을 찍어 Pull Request에서 시각적으로 리뷰하는 방법을 알아봅니다.
tags: ["GitHub Actions", "Next.js", "Puppeteer", "정적 내보내기", "스크린샷 테스트", "CI/CD"]
contributors: []
draft: false
---

저희 회사의 웹사이트는 GitHub Pages에 호스팅되는, '정적으로 내보낸(statically exported)' Next.js 앱입니다.

저희는 여전히 Pull Request를 만들고 코드를 리뷰하는 개발 문화를 가지고 있지만, Vercel이나 Netlify를 사용할 때처럼 편리한 '미리보기 배포' 기능의 이점을 누릴 수는 없었습니다.

하지만 Pull Request를 머지하기 전에 웹사이트가 어떻게 보일지 시각적으로 확인하고 싶은 욕구는 여전했죠.

그래서 저는 웹사이트의 스크린샷을 찍는 GitHub Actions 워크플로우를 추가했습니다.

이것은 모든 Pull Request마다 실행되는 간단한 워크플로우입니다.

## 해결책의 핵심: 스크린샷 스크립트

가장 먼저 필요한 것은 Next.js 앱이 빌드된 후에 모든 페이지를 찾아내고, 'Puppeteer'를 사용해 각 페이지의 스크린샷을 찍는 스크립트입니다.

Puppeteer는 헤드리스(headless) Chrome 브라우저를 제어할 수 있게 해주는 Node.js 라이브러리입니다.

마치 로봇이 우리 대신 브라우저를 열고 웹사이트를 방문하여 사진을 찍어주는 것과 같죠.

### 'take-screenshots.js' 파일 분석

아래는 전체 스크립트입니다.

이 코드를 프로젝트의 `.github/scripts/take-screenshots.js` 경로에 저장하세요.

```javascript
// .github/scripts/take-screenshots.js
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const OUT_DIR = path.join(process.cwd(), "screenshots");
const SERVER_URL = "http://localhost:3000"; // 파일 경로 대신 서버 URL 사용
const SITE_DIR = path.join(process.cwd(), "out"); // Next.js 정적 내보내기 디렉토리

// 스크린샷 디렉토리가 없으면 생성
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// 딜레이를 위한 헬퍼 함수
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Next.js 내보내기 디렉토리에서 모든 HTML 페이지를 찾는 함수 (개선됨)
function findAllPages(dir, baseDir = dir, result = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // 재귀적으로 디렉토리 탐색
      findAllPages(fullPath, baseDir, result);
    } else if (file.endsWith(".html")) {
      // HTML 파일을 찾음, 이것이 페이지임
      const relativePath = path.relative(baseDir, dir);
      const pagePath = relativePath
        ? path.join(
            relativePath,
            file === "index.html" ? "" : file.replace(".html", "")
          )
        : file === "index.html"
          ? ""
          : file.replace(".html", "");

      // 중복 경로 방지 (예: /index.html 과 /)
      if (!result.includes(pagePath)) {
        result.push(pagePath);
      }
    }
  }

  return result;
}

// 지연 로딩 이미지를 불러오기 위해 페이지를 스크롤하는 함수
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0); // 다시 맨 위로 스크롤
          resolve();
        }
      }, 100);
    });
  });
}

// 모든 이미지를 강제로 로드하는 함수
async function forceImagesLoad(page) {
  await page.evaluate(async () => {
    // 모든 이미지 요소를 찾음
    const images = Array.from(document.querySelectorAll("img"));

    // 모든 이미지의 loading 속성을 'eager'로 설정하여 강제로 로드
    images.forEach((img) => {
      img.loading = "eager";

      // 지연 로딩 라이브러리에서 흔히 사용하는 data-src 속성이 있다면 src로 변경
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
    });

    // 모든 이미지 로딩을 기다림
    await Promise.all(
      images.map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve; // 에러 발생 시에도 중단되지 않도록 resolve 호출
        });
      })
    );
  });
}

(async () => {
  console.log("스크린샷 프로세스를 시작합니다...");

  // GitHub Actions 환경을 위한 --no-sandbox 플래그와 함께 실행
  const browser = await puppeteer.launch({
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-animations", // CSS 애니메이션 비활성화
      "--disable-extensions" // 방해될 수 있는 확장 프로그램 비활성화
    ],
    defaultViewport: { width: 1280, height: 800 }
  });
  const page = await browser.newPage();
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "reduce" }
  ]);

  // 내보내기 디렉토리에서 모든 페이지 찾기
  console.log(`${SITE_DIR}에서 페이지를 찾습니다...`);
  const pages = findAllPages(SITE_DIR);
  console.log(`${pages.length}개의 페이지를 찾았습니다: ${pages.join(", ")}`);

  // 홈페이지가 목록에 없으면 추가
  if (!pages.includes("")) {
    pages.unshift("");
  }

  for (const pagePath of pages) {
    // 서버용 URL 생성
    const pageUrl = pagePath ? `${SERVER_URL}/${pagePath}` : SERVER_URL;
    // 스크린샷을 위한 안전한 파일 이름 생성
    const pageName = pagePath.replace(/\//g, "-") || "home";

    console.log(`페이지 처리 중: ${pageName} (${pageUrl})`);

    try {
      // 로컬 서버의 페이지로 이동
      console.log(`${pageUrl}로 이동 중...`);
      await page.goto(pageUrl, {
        waitUntil: "networkidle0", // 네트워크 활동이 없을 때까지 기다림
        timeout: 30000 // 타임아웃을 30초로 늘림
      });

      // 페이지를 스크롤하여 지연 로딩 콘텐츠 불러오기
      console.log(`지연 로딩 콘텐츠를 위해 페이지 스크롤 중...`);
      await autoScroll(page);

      // 모든 이미지를 강제로 로드
      console.log(`모든 이미지 강제 로딩 중...`);
      await forceImagesLoad(page);

      // 이미지가 로드될 추가 시간 확보
      console.log(`모든 콘텐츠가 로드되기를 기다리는 중...`);
      await delay(2000);

      // 스크린샷 찍기
      const screenshotPath = path.join(OUT_DIR, `${pageName}.png`);
      console.log(`스크린샷 찍는 중: ${screenshotPath}`);
      await page.screenshot({ path: screenshotPath, fullPage: true });

      console.log(`${pageName}의 스크린샷이 저장되었습니다.`);
    } catch (error) {
      console.error(`${pageName}의 스크린샷 저장 중 에러 발생:`, error);
    }
  }

  await browser.close();
  console.log("스크린샷 프로세스가 완료되었습니다.");
})();
```

이 스크립트에서 특히 주목할 만한 부분은 'autoScroll'과 'forceImagesLoad' 함수입니다.

요즘 웹사이트는 성능을 위해 사용자가 스크롤해야만 보이는 이미지를 나중에 로드('지연 로딩, lazy loading')하는 경우가 많습니다.

Puppeteer는 페이지가 열리자마자 바로 스크린샷을 찍기 때문에, 이 함수들이 없다면 스크린샷의 많은 이미지들이 보이지 않거나 깨져서 나올 것입니다.

또한, 'Framer Motion' 같은 라이브러리로 애니메이션을 사용한다면, 스크립트에서처럼 애니메이션을 비활성화하거나, 컴포넌트 자체에서 뷰포트 설정을 조정해 주는 것이 좋습니다.

```jsx
<motion.div
  viewport={{ once: true, amount: 0.3 }} // 애니메이션이 한 번만 실행되도록 설정
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.2, duration: 0.6 }}
>
</motion.div>
```

## 워크플로우: 모든 것을 하나로 묶기

이제 이 스크립트를 실행할 GitHub Actions 워크플로우를 설정할 차례입니다.

프로젝트 루트의 `.github/workflows/pr.yml` 경로에 아래 코드를 작성하세요.

```yaml
# .github/workflows/pr.yml
name: PR

on:
  workflow_dispatch: null
  pull_request:
    types: [opened, synchronize, reopened]
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Cancel Previous Runs
        uses: styfle/cancel-workflow-action@0.12.1
      - name: Checkout repository
        uses: actions/checkout@v4

      - uses: oven-sh/setup-bun@v2

      - name: Install dependencies
        run: bun install

      - name: Install Puppeteer and serve
        run: bun install puppeteer serve

      - name: Build and export
        run: bun run build

      - name: Start static server and take screenshots
        id: screenshots
        run: |
          # 백그라운드에서 서버 시작
          npx serve out -p 3000 &
          # 서버가 시작될 때까지 더 길게 대기
          sleep 10
          # 스크린샷 찍기
          node .github/scripts/take-screenshots.js
          # 서버 종료
          kill $(lsof -t -i:3000)
          echo "screenshot_path=screenshots" >> $GITHUB_OUTPUT

      - name: Upload screenshots as artifacts
        uses: actions/upload-artifact@v4
        with:
          name: preview-screenshots
          path: screenshots/
```

이 워크플로우의 핵심은 'Start static server and take screenshots' 단계입니다.

-   `npx serve out -p 3000 &`: Next.js가 빌드한 정적 파일이 있는 `out` 폴더를 3000번 포트로 서빙하는 웹 서버를 실행합니다.

    뒤에 붙은 `&`는 이 명령을 백그라운드에서 실행하라는 의미입니다.

-   `sleep 10`: 서버가 완전히 시작될 때까지 10초간 기다립니다.

-   `node ...`: 우리가 만든 스크린샷 스크립트를 실행합니다.

-   `kill ...`: 스크립트 실행이 끝나면, 백그라운드에서 돌고 있던 서버 프로세스를 찾아 종료시킵니다.

-   `actions/upload-artifact`: 마지막으로, 생성된 `screenshots` 폴더를 '아티팩트(artifact)'로 업로드합니다.

## 결과 확인하기

이제 `main` 브랜치로 Pull Request를 생성하면, 이 워크플로우가 자동으로 실행됩니다.

작업이 완료된 후, 해당 PR의 GitHub Actions 실행 결과 페이지로 가보세요.

'Artifacts' 섹션에 'preview-screenshots'라는 이름으로 업로드된 zip 파일을 찾을 수 있을 것입니다.

이 파일을 다운로드하여 압축을 풀면, 변경 사항이 적용된 웹사이트의 모든 페이지 스크린샷을 직접 눈으로 확인할 수 있습니다.

이제 더 이상 코드만 보고 UI 변경을 상상하지 않아도 됩니다.
