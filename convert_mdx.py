import os
import re
from pathlib import Path
import yaml
import argparse

def convert_mdx_to_hugo_md(file_path):
    """MDX 파일을 Hugo Markdown 형식으로 변환"""

    print(f"처리 중: {file_path}")

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Frontmatter와 본문 분리
    pattern = r'^---\s*\n(.*?)\n---\s*\n(.*)$'
    match = re.match(pattern, content, re.DOTALL)

    if not match:
        print(f"  ❌ Frontmatter를 찾을 수 없습니다.")
        return False

    frontmatter_str = match.group(1)
    body = match.group(2)

    # YAML 파싱
    try:
        old_fm = yaml.safe_load(frontmatter_str)
    except yaml.YAMLError as e:
        print(f"  ❌ YAML 파싱 오류: {e}")
        return False

    # 새로운 frontmatter 수동 생성 (순서 및 형식 제어)
    new_fm_lines = []

    # 1. slug
    if 'slug' in old_fm:
        new_fm_lines.append(f"slug: {old_fm['slug']}")

    # 2. title
    if 'title' in old_fm:
        title = old_fm['title']
        # 특수문자 처리 (콜론 등)
        if ':' in title or '"' in title or "'" in title:
            # 이스케이프 처리
            title_escaped = title.replace('"', '\\"')
            new_fm_lines.append(f'title: "{title_escaped}"')
        else:
            new_fm_lines.append(f"title: {title}")

    # 3. date
    if 'date' in old_fm:
        new_fm_lines.append(f"date: {old_fm['date']}")

    # 4. description → summary
    if 'description' in old_fm:
        summary = old_fm['description']
        # 특수문자 처리
        if ':' in summary or '"' in summary or "'" in summary:
            summary_escaped = summary.replace('"', '\\"')
            new_fm_lines.append(f'summary: "{summary_escaped}"')
        else:
            new_fm_lines.append(f"summary: {summary}")

    # 5. meta.keywords → tags (배열 형식)
    tags = []
    if 'meta' in old_fm and isinstance(old_fm['meta'], dict):
        if 'keywords' in old_fm['meta']:
            keywords = old_fm['meta']['keywords']
            if isinstance(keywords, list):
                tags = keywords

    # tags를 ["item1", "item2"] 형식으로
    if tags:
        tags_str = ', '.join([f'"{tag}"' for tag in tags])
        new_fm_lines.append(f"tags: [{tags_str}]")
    else:
        new_fm_lines.append("tags: []")

    # 6. contributors (빈 배열)
    new_fm_lines.append("contributors: []")

    # 7. published → draft
    if 'published' in old_fm:
        draft = not old_fm['published']
        new_fm_lines.append(f"draft: {str(draft).lower()}")
    else:
        new_fm_lines.append("draft: false")

    # 본문 처리: 첫 번째 # 헤더 제거
    body = body.lstrip()
    lines = body.split('\n')

    # 첫 줄이 # 로 시작하면 제거
    if lines and lines[0].strip().startswith('# '):
        body = '\n'.join(lines[1:]).lstrip()

    # 최종 frontmatter 생성
    new_fm_str = '\n'.join(new_fm_lines)

    # 최종 마크다운 생성
    new_content = f"---\n{new_fm_str}\n---\n\n{body}"

    # 새 파일명 (.mdx → .md)
    new_file_path = file_path.with_suffix('.md')

    # 파일 저장
    with open(new_file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f"  ✅ 변환 완료 → {new_file_path.name}")

    return True


def convert_directory(directory_path, remove_original=False):
    """디렉토리 내 모든 .mdx 파일 변환

    Args:
        directory_path: 변환할 디렉토리 경로
        remove_original: True면 원본 .mdx 파일 삭제
    """

    directory = Path(directory_path)

    if not directory.exists():
        print(f"❌ 디렉토리를 찾을 수 없습니다: {directory_path}")
        return

    # 모든 .mdx 파일 찾기 (하위 디렉토리 포함)
    mdx_files = list(directory.rglob('*.mdx'))

    if not mdx_files:
        print(f"⚠️  '{directory_path}'에서 .mdx 파일을 찾을 수 없습니다.")
        return

    print(f"\n📁 {len(mdx_files)}개의 .mdx 파일을 찾았습니다.\n")

    success_count = 0
    failed_files = []

    for mdx_file in mdx_files:
        if convert_mdx_to_hugo_md(mdx_file):
            success_count += 1
            # 원본 파일 삭제 옵션
            if remove_original:
                mdx_file.unlink()
                print(f"  🗑️  원본 삭제됨: {mdx_file.name}")
        else:
            failed_files.append(mdx_file)

    # 결과 요약
    print(f"\n{'='*50}")
    print(f"✅ 성공: {success_count}/{len(mdx_files)} 파일")

    if failed_files:
        print(f"❌ 실패: {len(failed_files)}개")
        for f in failed_files:
            print(f"   - {f}")

    print(f"{'='*50}\n")


def convert_single_file(file_path, remove_original=False):
    """단일 파일 변환

    Args:
        file_path: 변환할 .mdx 파일 경로
        remove_original: True면 원본 파일 삭제
    """

    file_path = Path(file_path)

    if not file_path.exists():
        print(f"❌ 파일을 찾을 수 없습니다: {file_path}")
        return

    if file_path.suffix != '.mdx':
        print(f"❌ .mdx 파일이 아닙니다: {file_path}")
        return

    print(f"\n{'='*50}")
    if convert_mdx_to_hugo_md(file_path):
        if remove_original:
            file_path.unlink()
            print(f"  🗑️  원본 삭제됨")
        print(f"{'='*50}\n")
    else:
        print(f"{'='*50}\n")


# ==================== 명령줄 인수 처리 ====================

def main():
    parser = argparse.ArgumentParser(
        description='MDX 파일을 Hugo Markdown 형식으로 변환합니다.',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
사용 예시:
  %(prog)s .                           # 현재 디렉토리의 모든 .mdx 변환
  %(prog)s /path/to/blog              # 특정 디렉토리 변환
  %(prog)s . --remove-original        # 변환 후 원본 삭제
  %(prog)s -r .                        # 짧은 옵션
  %(prog)s --file post.mdx            # 단일 파일 변환
  %(prog)s -f post.mdx -r             # 단일 파일 변환 후 삭제
        '''
    )

    # 위치 인수 또는 옵션 인수
    parser.add_argument(
        'directory',
        nargs='?',
        default='.',
        help='변환할 디렉토리 경로 (기본값: 현재 디렉토리)'
    )

    parser.add_argument(
        '-f', '--file',
        type=str,
        metavar='FILE',
        help='단일 파일만 변환 (디렉토리 대신 파일 지정)'
    )

    parser.add_argument(
        '-r', '--remove-original',
        action='store_true',
        help='변환 후 원본 .mdx 파일 삭제'
    )

    parser.add_argument(
        '-v', '--version',
        action='version',
        version='%(prog)s 1.0.0'
    )

    args = parser.parse_args()

    # 단일 파일 변환
    if args.file:
        convert_single_file(args.file, remove_original=args.remove_original)
    # 디렉토리 변환
    else:
        convert_directory(args.directory, remove_original=args.remove_original)


if __name__ == "__main__":
    main()
