#!/bin/bash

echo "🚀 MDX → Hugo Markdown 변환 스크립트"
echo "======================================"

# 가상환경이 없으면 생성
if [ ! -d "venv" ]; then
    echo "📦 가상환경 생성 중..."
    python3 -m venv venv
fi

# 가상환경 활성화
echo "⚡ 가상환경 활성화..."
source venv/bin/activate

# PyYAML 설치 확인
if ! python -c "import yaml" 2>/dev/null; then
    echo "📥 PyYAML 설치 중..."
    pip install pyyaml
else
    echo "✅ PyYAML 이미 설치됨"
fi

# 스크립트 실행
echo ""
echo "🔄 변환 시작..."
echo "======================================"
python convert_mdx.py

# 비활성화
deactivate

echo ""
echo "✨ 완료!"
