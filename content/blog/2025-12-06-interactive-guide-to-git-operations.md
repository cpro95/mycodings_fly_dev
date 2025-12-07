---
slug: 2025-12-06-interactive-guide-to-git-operations
title: "Git 완전 정복 개념부터 실전 명령어까지 한 번에 정리하기"
summary: "Git이 어렵게만 느껴지시나요? 개념 이해부터 실전 명령어, 되돌리기 꿀팁까지 예제로 쉽게 풀어드립니다."
date: 2025-12-07T03:54:52.285Z
draft: false
weight: 50
tags: ["Git", "깃", "버전관리", "git 명령어", "프로그래밍기초", "git 튜토리얼", "git 사용법"]
contributors: []
---

![Git 완전 정복 개념부터 실전 명령어까지 한 번에 정리하기](https://blogger.googleusercontent.com/img/a/AVvXsEjnuWNrogo87FzWpTbfqd_lEo6jXXEgCms_U0HFzpuGkLXFAvuPQOr3FudKZUF5YXVgtEI2xB5ERJ_0M9KERgv0muF6azZBJGx7EXj645s8Mhj3CLrc-9gY_W6FTE0y7ZCNMDvQv3aka4X4A9pWEE-lDVSsSfbHyt-nWlXjXsG5vT1xGBLa6F5ZeU0JJLA=s16000)

Git은 오늘날 소프트웨어 개발에서 빠질 수 없는 분산 버전 관리 시스템인데요. 정말 강력한 도구지만, 직관적이지 않은 문법 때문에 골머리를 앓는 분들이 많습니다.

매번 똑같은 깃 명령어를 구글링하는 것도 지쳐서 제가 직접 단계별 가이드를 정리해 봤습니다.

기초부터 고급 기능까지, 이 글을 처음부터 끝까지 읽으셔도 좋고 필요한 부분만 쏙쏙 골라 읽으셔도 좋습니다.

## 개념 잡기(Concepts)

이론은 딱 여기까지만 다룰 예정인데요. 파이(π)를 3이라고 퉁치는 수준으로 아주 쉽고 짧게 설명해 드리겠습니다.

이미 Git 고수라면 이 부분은 너그럽게 넘어가 주시면 됩니다.

### 작업 트리, 스테이징 영역, 저장소

Git의 흐름은 크게 세 가지 공간을 이해하는 것이 핵심인데요. 바로 '작업 트리(Working tree)', '스테이징 영역(Staging area)', 그리고 '저장소(Repository)'입니다.

'작업 트리'는 현재 시점의 프로젝트 상태를 보여주는 단면입니다.

여러분이 코드를 추가하거나 수정하면 바로 이 작업 트리가 변하는 것입니다.

'스테이징 영역'은 작업 트리에서 변경된 내용을 영구적으로 저장하기 전에 잠시 대기시키는 공간인데요.

무대에 올리기 전 리허설을 하는 곳이라고 생각하면 이해가 빠릅니다.

'저장소(Repo)'는 프로젝트의 역사 속에 기록된 영구적인 변경 사항(커밋)들의 모음입니다.

보통 깃허브(GitHub)나 깃랩(GitLab) 같은 원격 저장소가 하나 있고, 개발자마다 각자의 컴퓨터에 로컬 저장소를 하나씩 갖게 됩니다.

스테이징 영역에 있는 변경 사항을 영구적으로 만들면, 스테이징에서 사라지고 로컬 저장소에 '커밋(Commit)'으로 기록되는데요.

저장소는 지금까지 수행된 모든 커밋을 담고 있습니다.

만약 특정 커밋을 '체크아웃(Checkout)' 하면, 작업 트리는 그 커밋 시점의 프로젝트 상태로 되돌아갑니다.

로컬과 원격 저장소는 수시로 동기화되어 모든 개발자가 모든 커밋을 공유하게 됩니다.


### 브랜치, 태그, HEAD

'브랜치(Branch)'는 프로젝트의 또 다른 평행 우주와 같은데요. 보통 'main' 브랜치가 있고, 새로운 기능을 개발할 때마다 별도의 브랜치를 따서 작업합니다.

기능 개발이 끝나면 다시 메인 브랜치로 합치거나(Merge) 버리게 됩니다.

'태그(Tag)'는 프로젝트의 특정 상태에 이름을 붙인 것입니다.

주로 릴리스 버전(v1.0 등) 같은 중요한 마일스톤을 표시할 때 메인 브랜치에 생성합니다.

마지막으로 'HEAD'는 현재 체크아웃된 커밋(보통 브랜치의 가장 최신 커밋)을 가리키는 포인터입니다.

자, 이제 지루한 이론은 끝났으니 실전 요리법으로 넘어가 보겠습니다.

## 기초 다지기(Basics)

가장 기초적인 로컬 저장소 조작법부터 시작해 볼까요?


### 저장소 초기화(Init repo)

빈 저장소를 만드는 명령어는 다음과 같습니다.


```bash
git init
```

### 사용자 설정(Edit)

Git을 사용하려면 사용자 이름과 이메일 설정이 필수인데요.

저장소마다 다르게 설정할 수도 있습니다.


```bash
git config user.email alice@example.com
git config user.name "Alice Zakas"
```

만약 모든 저장소에 공통으로 적용하고 싶다면 `--global` 옵션을 사용하면 됩니다.

설정된 내용을 확인하려면 아래 명령어를 입력하세요.


```bash
git config --list --show-origin
```

### 파일 추가(Add file)

파일을 생성하고 스테이징 영역에 추가하는 과정인데요.

`echo` 명령어로 파일을 만들고 `git add`로 추가합니다.


```bash
echo "git is awesom" > message.txt
git add message.txt
```

스테이징 영역에 들어간 변경 사항을 확인하고 싶다면 이렇게 입력하세요.


```bash
git diff --cached
```

이제 로컬 저장소에 커밋을 남깁니다.


```bash
git commit -m "add message"
```

### 파일 수정(Edit file)

방금 커밋한 파일을 수정해 볼까요?

오타를 수정한다고 가정해 보겠습니다.


```bash
echo "git is awesome" > message.txt
```

로컬에서 변경된 내용을 확인하는 명령어입니다.


```bash
git diff
```

수정된 파일을 스테이징하고 커밋하는 과정을 한 번에 처리할 수도 있는데요.

`-a` 옵션을 사용하면 됩니다.


```bash
git commit -am "edit message"
```

여기서 주의할 점은 `-a` 옵션은 이미 커밋된 적이 있는 파일의 변경 사항만 처리하며, 새로 생성된 파일은 포함하지 않는다는 점입니다.


### 파일 이름 변경(Rename file)

파일 이름을 변경하는 것도 Git 명령어로 간단히 처리할 수 있습니다.


```bash
git mv message.txt praise.txt
```

이 변경 사항은 즉시 스테이징 영역에 반영되므로 `git diff`로는 보이지 않는데요.

`--cached` 옵션을 써야 확인 가능합니다.


```bash
git diff --cached
```

변경 사항을 커밋합니다.


```bash
git commit -m "rename message.txt"
```

### 파일 삭제(Delete file)

파일을 삭제할 때도 `git rm`을 사용하면 깔끔합니다.


```bash
git rm message.txt
```

마찬가지로 스테이징 영역에 바로 반영되니 `--cached`로 확인하고 커밋하면 됩니다.


```bash
git diff --cached
git commit -m "delete message.txt"
```

### 상태 확인(Show current status)

작업 트리의 현재 상태를 보여주는 `git status`는 가장 자주 쓰는 명령어 중 하나인데요.

파일의 상태를 명확히 보여줍니다.


```bash
echo "git is awesome" > message.txt
git add message.txt
echo "git is great" > praise.txt
git status
```

위 예시를 실행하면 `message.txt`는 스테이징 영역에 있고, `praise.txt`는 추적되지 않는(untracked) 상태임을 알 수 있습니다.


### 커밋 로그 확인(Show commit log)

지금까지의 커밋 기록을 확인하는 방법입니다.


```bash
git log
```

내용이 너무 길다면 한 줄로 요약해서 볼 수도 있는데요.

커밋 메시지와 짧은 해시만 보여줍니다.


```bash
git log --oneline
```

아스키(ASCII) 그래프 형태로 시각화해서 볼 수도 있습니다.


```bash
git log --graph
```

이 두 가지를 섞어서 컴팩트하게 보는 것이 가장 유용합니다.


```bash
git log --oneline --graph
```

### 특정 커밋 확인(Show specific commit)

가장 마지막 커밋의 내용을 보고 싶을 때 사용합니다.


```bash
git show HEAD
```

마지막에서 두 번째 커밋을 보려면 `HEAD~1`을 사용하면 되는데요.

숫자를 바꿔서 n번째 이전 커밋을 보거나, 커밋 해시를 직접 입력해도 됩니다.


```bash
git show HEAD~1
```

### 검색(Search repo)

현재 작업 트리에서 특정 단어를 찾고 싶다면 `git grep`이 유용합니다.


```bash
git grep "debate"
```

특정 커밋 시점의 프로젝트 상태에서 검색할 수도 있는데요.

과거의 코드에서 무언가를 찾을 때 아주 강력합니다.


```bash
git grep "great" HEAD~1
```

## 브랜치와 병합(Branch and merge)

이제 Git의 꽃이라고 할 수 있는 병합(Merge)의 세계로 깊이 들어가 보겠습니다.


### 브랜치(Branch)

현재 존재하는 브랜치 목록을 확인합니다.


```bash
git branch
```

새로운 브랜치 `ohmypy`를 만들고 그곳으로 이동해 볼까요?


```bash
git branch ohmypy
git switch ohmypy
```

다시 브랜치 목록을 보면 현재 위치가 `ohmypy`로 바뀐 것을 알 수 있습니다.


```bash
git branch
```

이제 새 브랜치에서 파일을 만들고 커밋을 해보겠습니다.


```bash
echo "print('git is awesome')" > ohmy.py
git add ohmy.py
git commit -m "ohmy.py"
```

메인 브랜치에는 없고 `ohmypy` 브랜치에만 있는 커밋을 확인할 수 있습니다.


```bash
git log --oneline main..ohmypy
```

### 병합(Merge)

먼저 모든 브랜치의 커밋 상황을 그래프로 확인해 보죠.


```bash
git log --all --oneline --graph
```

이제 `main` 브랜치로 돌아가서 `ohmypy` 브랜치의 내용을 합쳐보겠습니다.


```bash
git merge ohmypy
```

충돌이 없다면 Git이 자동으로 커밋을 생성하는데요.

그래프를 다시 확인해 보면 두 브랜치가 합쳐진 것을 볼 수 있습니다.


```bash
git log --all --oneline --graph
```

### 리베이스(Rebase)

병합과 달리 역사를 깔끔하게 한 줄로 만들고 싶을 때 사용하는데요.

`ohmypy` 브랜치를 `main` 브랜치 뒤에 이어 붙이는 방식입니다.


```bash
git rebase ohmypy
```

로그를 확인해 보면 `git merge`를 했을 때와 달리 커밋 히스토리가 선형적으로 깔끔하게 정리된 것을 볼 수 있습니다.


```bash
git log --all --oneline --graph
```

하지만 리베이스는 역사를 재작성하는 작업이기 때문에, 이미 원격 저장소에 푸시(Push)된 브랜치에는 사용하지 않는 것이 좋습니다.


### 스쿼시(Squash)

브랜치에서 작업한 자잘한 커밋들을 하나로 뭉쳐서 깔끔하게 병합하고 싶을 때가 있는데요.

이때 사용하는 것이 스쿼시입니다.


먼저 `ohmypy` 브랜치로 이동합니다.


```bash
git switch ohmypy
```

모든 변경 사항을 스테이징 영역으로 가져오되 커밋은 하지 않은 상태로 만듭니다.


```bash
git merge --squash main
```

이제 하나로 뭉쳐진 변경 사항을 새로운 메시지와 함께 커밋합니다.


```bash
git commit -m "ohmy[py,sh,lua]"
```

다시 `main`으로 돌아와서 병합하면, `ohmypy`의 여러 커밋이 하나의 커밋으로 깔끔하게 들어옵니다.


```bash
git switch main
git merge --no-ff ohmypy -m "ohmy[py,sh,lua]"
```

### 체리픽(Cherry-pick)

다른 브랜치에 있는 특정 커밋 하나만 쏙 빼오고 싶을 때 사용하는 마법 같은 기능인데요.

예를 들어 `ohmypy` 브랜치에서 실수로 수정한 버그 픽스를 `main`으로 가져오고 싶을 때 유용합니다.


가져오고 싶은 커밋의 해시값(예: cbb09c6)을 확인한 후 아래 명령어를 입력합니다.


```bash
git cherry-pick cbb09c6
```

전체 브랜치를 병합하지 않고도 원하는 수정 사항만 `main` 브랜치에 반영되었습니다.


## 로컬과 원격(Local and remote)

혼자 쓰는 로컬 저장소도 좋지만, 원격 저장소를 연결하면 협업이 가능해집니다.


### 푸시(Push)

앨리스(Alice)가 우리 저장소를 복제(Clone)해서 작업을 시작한다고 가정해 보겠습니다.


```bash
git clone /tmp/remote.git /tmp/alice
```

앨리스가 변경 사항을 만들고 커밋한 뒤, 원격 저장소로 밀어 넣습니다.


```bash
cd /tmp/alice
echo "Git is awesome!" > message.txt
git commit -am "edit from alice"
git push
```

### 풀(Pull)

이제 앨리스가 올린 내용을 내 로컬 저장소로 가져와야 하는데요.

`git pull`을 사용합니다.


```bash
git pull
```

로그를 확인해 보면 앨리스가 작성한 커밋이 내 저장소에도 들어와 있습니다.


### 충돌 해결(Resolve conflict)

가장 골치 아픈 상황이죠.

내가 수정한 파일과 앨리스가 수정한 파일이 충돌했을 때입니다.

원격 저장소의 내용을 가져오려는데 충돌이 발생하면 Git은 경고를 보냅니다.


```bash
git pull
```

충돌된 파일을 열어보면 Git이 표시해 둔 충돌 내용을 볼 수 있는데요.

앨리스의 버전이 더 낫다고 판단되면 그쪽을 선택합니다.


```bash
git checkout --theirs -- message.txt
# 내 버전을 선택하려면 --ours 사용
```

충돌이 해결된 파일을 스테이징하고 커밋하면 병합이 완료됩니다.


```bash
git add message.txt
git commit -m "merge alice"
```

### 브랜치 푸시와 가져오기(Fetch)

로컬에서 만든 브랜치를 원격 저장소에 올리고 싶다면 `-u` 옵션을 사용해 업스트림을 설정해 줍니다.


```bash
git push -u origin ohmypy
```

반대로 원격 저장소에 있는 새로운 브랜치 정보를 가져오려면 `git fetch`를 사용합니다.


```bash
git fetch
```

정보는 가져왔지만 로컬에는 아직 해당 브랜치가 체크아웃되지 않은 상태인데요.

이동 명령어를 입력하면 자동으로 연결됩니다.


```bash
git switch ohmypy
```

### 태그(Tags)

현재 커밋에 버전 태그를 달아보겠습니다.


```bash
git tag 0.1.0 HEAD
```

이전 커밋에 태그를 달 수도 있습니다.


```bash
git tag 0.1.0-alpha HEAD~1
```

생성된 태그를 원격 저장소에 공유하려면 별도로 푸시해야 합니다.


```bash
git push --tags
```

## 되돌리기(Undo)

"망했다, 방금 한 거 어떻게 취소하지?" Git을 쓰다 보면 누구나 한 번쯤 외치는 비명인데요.

이 영원한 난제에 대한 해답을 확실하게 드립니다.


### 커밋 수정(Amend commit)

방금 한 커밋 메시지에 오타가 있거나 파일을 빼먹었을 때 사용합니다.


```bash
git commit --amend -m "edit message"
```

이 명령어는 기존 커밋을 덮어씌우기 때문에 커밋 해시가 변경되는데요.

따라서 이미 원격 저장소에 푸시한 커밋에는 절대 사용하면 안 됩니다.


### 커밋하지 않은 변경 사항 취소(Undo uncommitted)

파일을 수정하고 스테이징까지 했는데 마음이 바뀌었다면요?

먼저 스테이징에서 내립니다.


```bash
git restore --staged message.txt
```

이제 파일의 수정 내용 자체를 되돌려 초기화하고 싶다면 아래 명령어를 씁니다.


```bash
git restore message.txt
```

### 로컬 커밋 취소(Undo local commit)

방금 한 커밋을 아예 없던 일로 하고 싶을 때가 있죠.

`reset`을 사용합니다.


```bash
git reset --soft HEAD~
```

`--soft` 옵션은 커밋은 취소하지만 변경된 파일 내용은 스테이징 영역에 남겨둡니다.

만약 커밋과 변경 내용 모두를 흔적도 없이 지우고 싶다면 `--hard`를 사용하세요.


```bash
git reset --hard HEAD~
```

이 역시 원격 저장소에 푸시하기 전의 커밋에만 사용해야 안전합니다.


### 원격 커밋 취소(Undo remote commit)

이미 원격 저장소에 푸시한 커밋을 되돌려야 한다면 `reset`을 쓰면 안 됩니다.

대신 '되돌린다는 내용의 새로운 커밋'을 만드는 `revert`를 써야 합니다.


```bash
git revert HEAD --no-edit
```

이러면 기존 역사를 훼손하지 않고 취소 이력을 남길 수 있어 안전합니다.


### 시간 여행(Rewind history)

실수로 `--hard` 리셋을 해서 커밋이 날아갔다고요?

당황하지 마세요.

`reflog`가 구원해 줄 겁니다.


```bash
git reflog
```

모든 작업 기록이 남아있으므로, 돌아가고 싶은 시점(예: `HEAD@{3}`)을 찾아 리셋하면 복구됩니다.


```bash
git reset --hard HEAD@{3}
```

### 임시 저장(Stash)

작업 중에 급하게 다른 브랜치로 이동해야 하는데, 지금 작업 중인 코드를 커밋하기는 애매할 때가 있는데요.

이럴 때 '스태시(Stash)'를 사용해 임시 저장합니다.


```bash
git stash
```

나중에 다시 돌아와서 저장해 둔 작업을 꺼내오면 됩니다.


```bash
git stash pop
```

## 고급 기능(Advanced stuff)

고수들은 알지만 대부분의 개발자는 잘 모르는, 하지만 알아두면 무릎을 탁 치게 되는 기능들입니다.


### 로그 요약(Log summary)

기여한 사람별로 커밋 수를 통계 내고 싶다면 `shortlog`가 제격입니다.


```bash
git shortlog -ns v1.0..
```

### 워크트리(Worktree)

한 프로젝트에서 여러 브랜치를 동시에 띄워놓고 작업해야 할 때가 있는데요.

매번 `git switch`를 할 필요 없이 `worktree`를 쓰면 됩니다.

메인 브랜치의 핫픽스를 위해 별도의 폴더에 프로젝트를 하나 더 체크아웃하는 식입니다.


```bash
git worktree add -b hotfix /tmp/hotfix main
```

이러면 기존 작업 환경을 그대로 둔 채, `/tmp/hotfix` 폴더에서 급한 불을 끄고 돌아올 수 있습니다.


### 이진 탐색(Bisect)

언제부터 버그가 생겼는지 모르겠다고요?

Git이 범인을 찾아줍니다.

`git bisect`를 시작하고 정상이었던 커밋과 문제가 있는 커밋을 알려주면, Git이 중간 지점을 계속 체크아웃하며 테스트를 돕습니다.


```bash
git bisect start
git bisect bad HEAD
git bisect good HEAD~4
```

### 부분 체크아웃(Partial checkout)

저장소가 너무 클 때 특정 디렉터리만 가져오고 싶다면 `sparse-checkout`을 사용해 보세요.


```bash
git sparse-checkout init --cone
git sparse-checkout set users
```

이렇게 하면 전체 프로젝트 중 `users` 디렉터리만 내 컴퓨터에 받아지게 됩니다.


## 마치며

여기까지 Git의 기본기부터 브랜치 전략, 원격 동기화, 그리고 실수를 만회하는 되돌리기 방법까지 폭넓게 훑어봤는데요.

이 정도만 자유자재로 다룰 수 있어도 팀 프로젝트에서 "Git 좀 쓴다"는 소리를 듣기에 충분할 겁니다.

더 깊이 있는 내용을 원하신다면 ['Pro Git'](https://git-scm.com/book/ko/v2) 책을 참고해 보시는 것을 추천합니다.
