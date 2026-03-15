#!/bin/sh
# 명령어 실행 중 오류가 발생하면 즉시 스크립트를 중단합니다.
set -e

echo "🚀 콘텐츠 배포 프로세스를 시작합니다..."

# 1. 로컬에서 사이트를 빌드합니다.
echo "📦 로컬에서 정적 사이트를 빌드합니다..."
npm run clean && npm run build

# 2. 빌드된 public 폴더의 '내용물'을 tar.gz 파일로 압축합니다.
#    '-C public .' 옵션은 압축 파일 내에 불필요한 상위 경로 없이 내용물만 담도록 해줍니다.
echo "📦 배포용 압축 파일을 생성합니다: public.tar.gz"
tar -czf public.tar.gz -C public --exclude='._*' --exclude='.DS_Store' .

echo "✈️ Fly.io 볼륨으로 콘텐츠를 동기화합니다..."

# 3. 생성된 압축 파일을 원격 서버의 임시 폴더(/tmp)로 업로드합니다.
#    볼륨 경로(/srv)에 직접 올리는 것보다 안전합니다.
echo "   - 압축 파일을 원격 서버의 임시 폴더로 업로드합니다..."
fly sftp put public.tar.gz /tmp/public.tar.gz

# 4. 원격 서버에서 아래 작업들을 순차적으로 실행합니다.
#    a. /srv/ 폴더의 기존 내용물을 모두 삭제합니다.
#    b. /tmp/ 에 있는 압축 파일을 /srv/ 폴더에 풉니다.
#    c. 임시로 업로드했던 압축 파일을 삭제합니다.
echo "   - 원격 서버에서 콘텐츠를 배포합니다..."
fly ssh console --command "sh -c 'rm -rf /srv/*'"
fly ssh console --command "tar -xzf /tmp/public.tar.gz -C /srv"
fly ssh console --command "rm /tmp/public.tar.gz"


# 4번 단계 후 추가
echo "🔍 배포 검증 중..."
fly ssh console --command "ls -lh /srv"

echo "📊 디스크 사용량 확인..."
fly ssh console --command "du -sh /srv"

# 5. 로컬에 생성했던 임시 압축 파일을 삭제합니다.
echo "🧹 로컬 임시 파일을 삭제합니다..."
rm public.tar.gz

echo "✅ 콘텐츠 배포가 완료되었습니다!"
