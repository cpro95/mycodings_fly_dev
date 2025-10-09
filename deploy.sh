#!/bin/sh
# 명령어 실행 중 오류가 발생하면 즉시 스크립트를 중단합니다.
set -e

echo "🚀 배포 프로세스를 시작합니다..."

# 1. 로컬 환경에서 에셋과 Hugo 사이트를 빌드합니다.
echo "📦 로컬에서 정적 사이트를 빌드합니다: npm run build"
npm run build

# 2. Fly.io에 배포합니다.
#    Dockerfile은 위 '방법 1'의 단순 버전을 사용합니다.
echo "✈️ Fly.io로 배포를 시작합니다..."
fly deploy

echo "✅ 배포가 완료되었습니다!"
