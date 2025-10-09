---
slug: 2025-08-16-how-git-manages-files-internals
title: Git은 대체 어떻게 파일을 관리하는 걸까
date: 2025-08-17 05:56:41.826000+00:00
summary: 매일 사용하는 git commit, 그 뒤에선 무슨 일이 벌어질까요? Git의 핵심인 Blob, Tree, Commit 객체의 비밀을 파헤치고, Ruby로 직접 미니 Git을 만들어보며 콘텐츠 기반 파일 시스템의 천재성을 파헤쳐 봅니다.
tags: ["Git", "Git Internals", "Blob", "Tree", "Commit", "버전 관리"]
contributors: []
draft: false
---

개발자라면 하루에도 몇 번씩 `git add`, `git commit`, `git push` 같은 명령어들을 사용하는데요.<br /><br />
마치 공기처럼 자연스럽게 우리 개발 생활의 일부가 되어버렸죠.<br /><br />
그런데 혹시 생각해 보셨나요?<br /><br />
우리가 `git commit -m "버그 수정"`이라는 마법의 주문을 외울 때, Git의 내부에서는 과연 어떤 일이 벌어지고 있는 걸까요?<br /><br />
오늘은 매일 쓰지만 사실은 잘 몰랐던 Git의 속살, 그중에서도 파일을 관리하는 아주 근본적인 원리를 Ruby로 직접 구현까지 해보면서 속 시원하게 파헤쳐 보려고 합니다.<br /><br />

## Git의 핵심 철학, 콘텐츠 기반 주소 지정

Git의 내부를 이해하기 위해 가장 먼저 알아야 할 개념이 바로 'Content-Addressable Filesystem', 우리말로는 '콘텐츠 기반 주소 지정 파일 시스템'인데요.<br /><br />
이름이 좀 어렵지만, 사실 원리는 아주 간단합니다.<br /><br />
우리가 평소에 쓰는 컴퓨터의 파일 시스템은 '위치 기반'이거든요.<br /><br />
`C:\Users\Documents\report.docx` 처럼 파일의 '위치'(경로)를 통해 파일을 찾아가죠.<br /><br />
하지만 Git은 완전히 다른 방식을 사용하는데요.<br /><br />
파일의 '위치'가 아니라 파일의 '내용' 그 자체를 가지고 주소를 만듭니다.<br /><br />
파일의 내용물을 SHA-1이라는 알고리즘으로 해싱해서, 세상에 단 하나뿐인 고유한 40자리 해시 값을 만들어내거든요.<br /><br />
그리고 이 해시 값을 '키'로 사용해서 파일의 내용을 '값'으로 저장하는, 거대한 Key-Value 저장소처럼 동작하는 겁니다.<br /><br />
이렇게 하면 파일 이름이 같아도 내용이 다르면 다른 객체로 저장되고, 반대로 파일 이름이 달라도 내용이 똑같으면 같은 객체를 재사용하게 되죠.<br /><br />
데이터 중복을 피하고 무결성을 보장하는 아주 천재적인 방식입니다.<br /><br />

## 모든 것의 시작, Blob 객체

자, 그럼 `git init`으로 새로운 저장소를 만들고, 파일 하나를 추가하는 것부터 시작해 보죠.<br /><br />
```bash
$ echo "Hello, World" > hello.txt
```

이 파일을 Git이 어떻게 인식하는지 `git hash-object`라는 명령어로 확인해 볼 수 있는데요.<br /><br />
이 명령어는 파일 내용을 해시값으로 바꿔주는 역할을 합니다.<br /><br />

```bash
$ git hash-object -w hello.txt
3fa0d4b98289a95a7cd3a45c9545e622718f8d2b
```

`-w` 옵션을 붙이면, 이 해시를 이름으로 하는 객체를 `.git/objects` 디렉토리에 실제로 저장까지 해주죠.<br /><br />
가서 확인해보면 해시의 앞 두 글자인 `3f`라는 디렉토리 안에 나머지 38자리 이름의 파일이 생성된 것을 볼 수 있을 거예요.<br /><br />
이 파일이 바로 Git의 가장 기본적인 데이터 단위인 'Blob' 객체입니다.<br /><br />
Blob은 'Binary Large Object'의 약자로, 파일의 내용물 데이터를 압축해서 그대로 담고 있는 '스냅샷'이라고 생각하면 되죠.<br /><br />
`git cat-file` 명령어로 이 객체의 정체를 확인할 수 있습니다.<br /><br />
```bash
# -t 옵션으로 타입을 확인
$ git cat-file -t 3fa0d4b98289a95a7cd3a45c9545e622718f8d2b
blob

# -p 옵션으로 내용(pretty-print)을 확인
$ git cat-file -p 3fa0d4b98289a95a7cd3a45c9545e622718f8d2b
Hello, World
```

자, 그럼 우리도 직접 이 Blob 객체를 만드는 코드를 Ruby로 한번 짜볼까요?<br /><br />
Git 객체는 `<타입> <콘텐츠 크기>\0<콘텐츠>` 형식의 헤더를 내용 앞에 붙여서 만들거든요.<br /><br />
이 전체 데이터를 SHA-1으로 해싱해서 키를 만들고, zlib으로 압축해서 파일로 저장하면 됩니다.<br /><br />
```ruby
require 'digest/sha1'
require 'zlib'
require 'fileutils'

class BlobObject
  attr_reader :content, :sha

  GIT_DIR = '.test_git' # 실제 .git을 건드리지 않기 위해

  def initialize(content)
    @content = content
    @sha = calc_sha
  end

  def write_to_objects
    dir = File.join(GIT_DIR, 'objects', @sha[0..1])
    path = File.join(dir, @sha[2..])
    return if File.exist?(path)

    FileUtils.mkdir_p(dir)
    File.open(path, 'wb') do |f|
      f.write(Zlib::Deflate.deflate(git_object_data))
    end
  end

  private

  def calc_sha
    Digest::SHA1.hexdigest(git_object_data)
  end

  def git_object_data
    header = "blob #{@content.bytesize}\0"
    header + @content
  end
end
```

이제 이 클래스를 사용하면 우리도 Git처럼 Blob 객체를 직접 만들 수 있게 된 겁니다.<br /><br />

## 구조를 담는 그릇, Tree 객체

그런데 Blob 객체만으로는 뭔가 부족하다는 느낌이 들지 않나요?<br /><br />
맞습니다.<br /><br />
Blob은 파일의 '내용물'만 저장할 뿐, 파일의 '이름'이나 어떤 디렉토리에 들어있는지와 같은 '구조적인 정보'는 전혀 모르거든요.<br /><br />
이 문제를 해결하기 위해 등장하는 것이 바로 'Tree' 객체입니다.<br /><br />
Tree 객체는 이름 그대로 디렉토리 구조를 담는 역할을 하는데요.<br /><br />
자신이 포함하는 파일(Blob)이나 하위 디렉토리(다른 Tree)의 목록을 가지고 있죠.<br /><br />
목록에는 각 항목의 파일 모드, 타입, 해시값, 그리고 파일명이 저장됩니다.<br /><br />
`git add` 명령어로 파일을 스테이징하고 `git write-tree`를 실행하면, 현재 스테이징 영역의 상태를 바탕으로 Tree 객체가 생성되는데요.<br /><br />
```bash
$ git add hello.txt
$ git write-tree
8481e2030a0f0a0d7af594e8ec5b278989877b62
```
<br />
이 새로운 해시값의 정체를 한번 확인해 보죠.<br /><br />
```bash
$ git cat-file -t 8481e2030a0f0a0d7af594e8ec5b278989877b62
tree

$ git cat-file -p 8481e2030a0f0a0d7af594e8ec5b278989877b62
100644 blob 3fa0d4b98289a95a7cd3a45c9545e622718f8d2b    hello.txt
```

보이시나요?<br /><br />
이 Tree 객체는 `hello.txt`라는 이름을 가진 `blob` 객체(`3fa...`)를 가리키고 있다는 정보를 담고 있습니다.<br /><br />
이제 파일의 내용(Blob)과 이름/구조(Tree)가 연결된 거죠.<br /><br />
Tree 객체도 한번 직접 구현해 볼까요?<br /><br />
여러 개의 엔트리(Blob이나 다른 Tree)를 받아서 정해진 형식으로 묶고, 전체를 'tree' 타입의 Git 객체로 만드는 과정은 Blob 때와 거의 비슷합니다.<br /><br />
```ruby
class TreeObject
  # ... (초기화 및 파일 쓰기 로직은 Blob과 유사)

  def initialize
    @entries = []
  end

  def add_blob(name, sha, mode = '100644')
    @entries << Entry.new(mode, name, sha)
    @entries.sort_by!(&:name) # Git은 파일명 순으로 정렬
  end

  private

  def git_object_data
    # 엔트리들을 바이너리 형식으로 변환하여 합친다
    content = @entries.map(&:to_s).join
    @sha = Digest::SHA1.hexdigest("tree #{content.bytesize}\0#{content}")
    "tree #{content.bytesize}\0#{content}"
  end

  class Entry
    attr_reader :mode, :name, :sha
    # ...
    def to_s
      # 해시는 20바이트 바이너리로 변환
      "#{mode} #{name}\0#{[sha].pack('H*')}"
    end
  end
end
```

이제 우리는 파일 시스템의 특정 상태를 완벽하게 표현할 수 있게 됐습니다.<br /><br />


자, 파일의 내용(Blob)과 구조(Tree)를 모두 저장할 수 있게 됐는데요.<br /><br />
아직 버전 관리 시스템의 가장 중요한 한 조각이 빠져있죠.<br /><br />
바로 '누가', '언제', '왜' 변경했는지에 대한 '역사' 정보입니다.<br /><br />
이 마지막 퍼즐 조각이 바로 'Commit' 객체입니다.<br /><br />
Commit 객체는 특정 시점의 프로젝트 상태(Tree)에 대한 포인터와 함께, 작성자(author), 커밋한 사람(committer), 그리고 가장 중요한 커밋 메시지를 담고 있거든요.<br /><br />
그리고 이전 커밋(parent commit)의 해시값도 가지고 있어서, 마치 연결 리스트처럼 커밋들이 시간 순서대로 쭉 이어지게 만들어 줍니다.<br /><br />
이것이 바로 우리가 아는 Git의 '커밋 히스토리'의 본질이죠.<br /><br />
`git commit-tree` 명령어를 사용하면 특정 Tree를 가리키는 Commit 객체를 수동으로 만들 수 있습니다.<br /><br />
```bash
$ echo 'first commit' | git commit-tree 8481e2030a0f0a0d7af594e8ec5b278989877b62
01fd440b5c3c8377cfb1b44a1fba96ad42d14040
```

이 커밋 객체의 내용을 들여다보면 익숙한 정보들이 보일 거예요.<br /><br />
```bash
$ git cat-file -p 01fd440b5c3c8377cfb1b44a1fba96ad42d14040
tree 8481e2030a0f0a0d7af594e8ec5b278989877b62
author Your Name <you@example.com> 1660000000 +0900
committer Your Name <you@example.com> 1660000000 +0900

first commit
```

우리가 `git commit` 명령어를 실행하면, 내부적으로는 바로 이 과정, 즉 스테이징된 내용으로 Tree 객체를 만들고, 그 Tree를 가리키는 Commit 객체를 만드는 작업이 자동으로 일어나는 겁니다.<br /><br />
Commit 객체 구현도 이전 객체들과 크게 다르지 않은데요.<br /><br />
Tree 해시, 부모 커밋 해시, 작성자 정보, 커밋 메시지를 정해진 형식으로 합쳐서 'commit' 타입의 Git 객체를 만들면 되죠.<br /><br />

## 미니 Git, 직접 돌려보기


지금까지 만든 Blob, Tree, Commit 객체 클래스를 모두 합쳐서, `git init`부터 첫 커밋까지의 과정을 흉내 내는 스크립트를 만들어 볼까요?<br /><br />
```ruby
# Blob 생성
blob = BlobObject.new("Hello, World\n")
blob.write_to_objects

# Tree 생성
root_tree = TreeObject.new
root_tree.add_blob('hello.txt', blob.sha)
root_tree.write_to_objects

# Commit 생성
author = { name: 'Nakasaka', email: 'nakasaka@example.com' }
first_commit = CommitObject.new(
  tree_sha: root_tree.sha,
  author: author,
  message: 'Initial commit'
)
first_commit.write_to_objects

# git log가 인식할 수 있도록 HEAD와 ref 설정
# ... (HEAD 파일과 refs/heads/main 파일에 커밋 해시를 써주는 작업)
```

이 스크립트를 실행하고 나서, 우리가 만든 `.test_git` 디렉토리를 대상으로 진짜 `git` 명령어를 한번 실행해 볼까요?<br /><br />
```bash
$ git --git-dir=.test_git log
commit 6ac8e4fd1cd5a80e2ef872dd1b25ff7626b7657c (HEAD -> main)
Author: Nakasaka <nakasaka@example.com>
Date:   ...

    Initial commit
```

정말 놀랍지 않나요?<br /><br />
우리가 Ruby로 한땀한땀 만든 객체들을 진짜 Git이 완벽하게 하나의 커밋으로 인식하고 있습니다.<br /><br />

## 마치며

오늘 우리는 Git의 심장부를 들여다봤는데요.<br /><br />
- **Blob**: 파일의 내용물을 담는 스냅샷<br />
- **Tree**: 파일 이름과 디렉토리 구조를 담는 목록<br />- **Commit**: Tree와 역사를 연결하는 시간의 기록<br /><br />
이 세 가지 객체가 서로를 가리키며 겹겹이 쌓이는 아주 단순하면서도 강력한 구조가 바로 Git의 모든 것을 가능하게 하는 비밀이었던 겁니다.<br /><br />
리누스 토발즈가 단 10일 만에 이 시스템의 초기 버전을 만들었다는 사실을 생각하면, 그의 천재성에 다시 한번 감탄하게 되네요.<br /><br />
이제 여러분이 `git commit` 명령어를 칠 때마다, 여러분의 코드 뒤에서 조용히 움직이는 이 세 명의 주인공들을 떠올리게 될 거예요.<br /><br />
```