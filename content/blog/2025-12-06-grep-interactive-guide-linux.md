---
slug: 2025-12-06-grep-interactive-guide-linux
title: "리눅스 필수 명령어 grep 완벽 가이드, 예제로 배우는 실전 사용법"
summary: "리눅스 서버에서 가장 강력한 검색 도구인 grep의 기초부터 고급 기능까지 단계별로 알아봅니다. 정규표현식, 재귀 검색 등 실전 예제를 통해 마스터해 보세요."
date: 2025-12-07T04:21:18.047Z
draft: false
weight: 50
tags: ["grep", "리눅스명령어", "정규표현식", "로그분석", "서버관리", "리눅스기초", "쉘스크립트"]
contributors: []
---

![리눅스 필수 명령어 grep 완벽 가이드, 예제로 배우는 실전 사용법](https://blogger.googleusercontent.com/img/a/AVvXsEjpum6LkLA0K5LRoBQrxk6bJK2GM1Kz4u3Kb8stEI67ICI1FgFbKqYNqNiPqiem4yE8z7UqzONZtKS-tIoLCCchB9aCDiequi36Q3KD-v_GKiKSGmDM_A8QTKL26ymq0genJaXyzMo2A5blK1j2Et3brNGTgkK4suRzUYQ1zwu4CJvYHKFCPH-ryZLxjtM=s16000)

`grep`은 거의 모든 리눅스 머신에서 사용할 수 있는 궁극의 텍스트 검색 도구인데요.

요즘은 `ripgrep` 같은 더 빠르고 강력한 대안들이 나오긴 했지만, 여전히 서버에 접속하면 `grep`이 유일한 검색 도구인 경우가 많습니다.

그래서 이 도구에 대한 실무 지식을 갖추는 것은 개발자나 시스템 관리자에게 필수적인 덕목입니다.

여러분이 `grep`을 더 잘 이해할 수 있도록 단계별 가이드를 준비했는데요.

처음부터 차근차근 읽으셔도 좋고, 필요한 부분만 골라서 실습해 보셔도 좋습니다.


## 기초 다지기 (Basics)

기본적으로 `grep`의 동작 원리는 아주 간단합니다.

검색할 '패턴'과 '파일'을 지정하면, `grep`은 파일을 한 줄씩 읽어가며 패턴과 일치하는 라인을 찾아 화면에 출력해 줍니다.


본격적인 예제 실습을 위해 `httpurr`라는 오픈소스 프로젝트의 코드를 다운로드하여 검색 대상으로 사용해 보겠습니다.

아래 명령어를 통해 테스트 환경을 설정합니다.


```bash
cd /opt
curl -OL https://github.com/rednafi/httpurr/archive/refs/tags/v0.1.2.tar.gz
tar xvzf v0.1.2.tar.gz
mv httpurr-0.1.2 httpurr
cd httpurr
```

### 파일 내 검색 (Search in file)

가장 먼저 `README.md` 파일에서 'codes'라는 단어가 포함된 모든 줄을 찾아보겠습니다.


```bash
grep -n codes README.md
```

`grep`은 `README.md`의 내용을 읽고 'codes'가 포함된 줄을 터미널에 출력하는데요.

`-n` (또는 `--line-number`) 옵션을 사용했기 때문에 해당 내용이 몇 번째 줄에 있는지 줄 번호도 함께 보여줍니다.

참고로 오래된 버전의 `grep`은 긴 옵션(`--line-number`)을 지원하지 않을 수 있으니, 만약 에러가 난다면 짧은 옵션(`-n`)을 사용하면 됩니다.


### 일치 범위 조정 (Matches)

`grep`은 기본적으로 '부분 일치'를 사용합니다.


```bash
grep -n descr README.md
```

위 명령어를 실행하면 'description'이라는 단어가 'descr' 패턴을 포함하고 있기 때문에 검색 결과에 나타납니다.


만약 부분 일치가 아닌 '완전한 단어' 단위로 검색하고 싶다면 `-w` (`--word-regexp`) 옵션을 사용하면 됩니다.


```bash
grep -n --word-regexp code README.md
```

이제 `grep`은 정확히 'code'라는 단어만 찾고, 'codes'처럼 다른 글자가 붙은 단어는 무시하는데요.

옵션을 제거하고 실행해 보면 결과가 확연히 달라지는 것을 볼 수 있습니다.

여러 짧은 옵션은 `grep -nw code README.md`처럼 한 번에 묶어서 사용할 수도 있습니다.


단어 단위가 아니라 아예 '줄 전체'가 정확히 일치하는지 확인하려면 `-x` (`--line-regexp`) 옵션을 사용합니다.


```bash
grep -n --line-regexp end httpurr.rb
```

### 정규 표현식 (Regular expressions)

`grep`의 진정한 강력함은 정규 표현식에서 나오는데요.

`-P` (`--perl-regexp`) 옵션을 사용하면 우리에게 익숙한 펄(Perl) 호환 정규 표현식을 사용할 수 있습니다.


'res'로 시작하고 그 뒤에 다른 문자가 이어지는 단어를 찾아보겠습니다.


```bash
grep -Pn 'res\w+' README.md
```

여기서 `\w+`는 '하나 이상의 문자(알파벳 등)'를 의미하는데요.

따라서 'response', 'resource', 'rest' 같은 단어들이 모두 매칭됩니다.

사실 `grep`에는 여러 정규식 방언이 존재합니다.

옵션 없이 사용하면 '기본 정규 표현식(Basic RE)'을 사용하는데 문법이 매우 괴상해서 추천하지 않습니다.

`-E` 옵션을 쓰면 '확장 정규 표현식(Extended RE)'을 사용하는데 이것도 펄 방식과는 미묘하게 다릅니다.

그래서 가장 직관적인 `-P` 옵션을 사용하는 것이 좋지만, 만약 시스템이 지원하지 않는다면 차선책으로 `-E`를 사용하시길 권장합니다.

이번에는 'res'로 시작하는 딱 4글자짜리 단어만 찾아볼까요?


```bash
grep -Pn 'res\w\b' README.md
```

`\b`는 단어의 경계(공백, 구두점, 줄바꿈 등)를 의미합니다.

그래서 'rest'는 매칭되지만, 'response'나 'resource'는 제외됩니다.


3자리 숫자를 찾고 싶다면 다음과 같이 입력합니다.


```bash
grep -Pn '\d\d\d' README.md | head
```

### 고정 문자열 검색 (Fixed strings)

정규 표현식이 아니라 문자 그대로의 내용을 찾고 싶을 때가 있는데요.

예를 들어 'code.'이라는 문자열을 찾는다고 가정해 봅시다.


```bash
grep -Pn 'code.' src/data.go | head
```

정규식에서 점(`.`)은 '모든 문자'를 뜻하기 때문에, 위 명령어는 'code '나 'codes'까지 모두 찾아버립니다.

이때 패턴을 단순 문자열로 취급하게 해주는 `-F` (`--fixed-strings`) 옵션을 사용하면 해결됩니다.


```bash
grep -Fn 'code.' src/data.go
```

이제 정확히 'code.'이 포함된 결과만 나옵니다.


### 다중 패턴 검색 (Multiple patterns)

한 번에 여러 패턴을 검색하고 싶다면 `-e` (`--regexp`) 옵션을 나열해서 사용합니다.


```bash
grep -En -e make -e run README.md
```

이 명령어는 'make' 또는 'run'이 포함된 줄을 모두 찾아줍니다.

아쉽게도 `grep`은 다중 패턴 검색 시 펄 호환 정규식(`-P`)을 지원하지 않아 확장 정규식(`-E`)을 사용해야 합니다.


만약 검색할 패턴이 너무 많다면, 파일에 저장해 두고 `-f` (`--file`) 옵션으로 불러오는 것이 효율적입니다.


```bash
echo 'install' > /tmp/patterns.txt
echo 'make' >> /tmp/patterns.txt
echo 'run' >> /tmp/patterns.txt

grep -En --file=/tmp/patterns.txt README.md
```

## 재귀 검색 (Recursive search)

서버 관리자가 `grep`을 가장 많이 쓰는 상황은 특정 파일이 아니라 디렉토리 전체를 뒤질 때일 텐데요.

`-r` (`--recursive`) 옵션이 그 역할을 합니다.


### 디렉토리 검색 (Search in directory)

현재 디렉토리(`.`) 아래에 있는 모든 파일에서 소문자로 시작하는 함수(`func`)를 찾아보겠습니다.


```bash
grep -Pnr 'func [a-z]\w+' .
```

`cmd`와 `src` 디렉토리 양쪽에서 결과가 나왔는데요.

만약 `cmd` 디렉토리만 검색하고 싶다면 경로를 명시해 주면 됩니다.


```bash
grep -Pnr 'func [a-z]\w+' cmd
```

여러 디렉토리를 동시에 검색할 수도 있습니다.


```bash
grep -Pnr 'func [a-z]\w+' cmd src
```

### 파일 필터링 (File globs)

검색 결과가 너무 많을 때는 특정 파일만 대상으로 하거나 제외하는 필터링이 필요한데요.

먼저 'httpurr'라는 단어를 찾아보겠습니다.


```bash
grep -Pnr --max-count=5 httpurr .
```

결과가 너무 많아 읽기 힘들지 않도록 `-m` (`--max-count`) 옵션으로 파일당 결과 수를 5개로 제한했습니다.

그래도 많다면 `.go` 확장자를 가진 파일에서만 검색하도록 `--include` 옵션을 사용할 수 있습니다.


```bash
grep -Pnr --include='*.go' httpurr .
```

반대로 특정 파일을 제외하고 싶다면 `--exclude`를 사용합니다.

예를 들어 `.go` 파일은 빼고 검색하려면 이렇게 합니다.


```bash
grep -Pnr --exclude '*.go' def .
```

이 옵션들은 여러 번 사용할 수 있어서 매우 유용한데요.

`.go` 파일 중에서 테스트 파일(`*_test.go`)만 쏙 빼고 함수 정의를 찾고 싶다면 아래와 같이 조합하면 됩니다.


```bash
grep -Pnr --include '*.go' --exclude '*_test.go' 'func ' .
```

### 바이너리 파일 처리 (Binary files)

`grep`은 기본적으로 바이너리 파일도 검색 대상에 포함하는데요.


```bash
grep -Pnr aha .
```

보통 바이너리 파일의 검색 결과는 깨진 문자열로 나오기 때문에 우리가 원하는 정보가 아닐 확률이 높습니다.

이럴 때는 `-I` (`--binary-files=without-match`) 옵션을 사용하여 바이너리 파일을 무시하는 것이 좋습니다.


```bash
grep -Pnr --binary-files=without-match aha .
```

만약 바이너리 파일 내부의 텍스트를 억지로라도 보고 싶다면 `-a` (`--text`) 옵션을 사용하면 됩니다.


## 검색 옵션 (Search options)

검색의 정확도를 높여주는 몇 가지 추가 옵션을 살펴보겠습니다.


### 대소문자 무시 (Ignore case)

기본적으로 `grep`은 대소문자를 구분합니다.


```bash
grep -Pnr codes README.md
```

위 명령어로 'codes'는 찾을 수 있지만 'Codes'는 찾지 못하는데요.

`-i` (`--ignore-case`) 옵션을 쓰면 대소문자 구분 없이 모두 찾아줍니다.


```bash
grep -Pnr --ignore-case codes README.md
```

### 반전 검색 (Inverse matching)

특정 패턴이 '포함되지 않은' 줄을 찾고 싶을 때가 있는데요.

`-v` (`--invert-match`) 옵션이 바로 그 기능을 합니다.

예를 들어, `@` 기호가 없는 줄만 찾되, 빈 줄(`^$`)도 제외하고 싶다면 다음과 같이 작성합니다.


```bash
grep -Enr --invert-match -e '@' -e '^$' Makefile
```

## 출력 제어 옵션 (Output options)

결과를 화면에 어떻게 보여줄지 제어하는 옵션들도 매우 중요합니다.


### 개수 세기 (Count matches)

파일별로 매칭된 라인 수가 몇 개인지 알고 싶다면 `-c` (`--count`) 옵션을 사용합니다.


```bash
grep -Pnr --count --include '*.go' 'func ' .
```

주의할 점은 이것이 '매칭된 횟수'가 아니라 '매칭된 라인 수'라는 것입니다.

한 줄에 찾는 단어가 두 번 있어도 카운트는 1만 올라갑니다.


```bash
grep -nrw --count string src/cli.go
```

### 매칭 제한 (Limit matches)

앞서 잠깐 사용했던 `-m` (`--max-count`) 옵션은 파일당 매칭되는 라인 수를 제한합니다.


```bash
grep -Pnrw --max-count=5 func .
```

로그 파일처럼 거대한 파일을 검색할 때, 처음 몇 개만 확인하고 싶다면 이 옵션이 필수적입니다.


### 매칭된 부분만 출력 (Show matches only)

기본적으로 `grep`은 매칭된 문자가 포함된 '전체 줄'을 출력하는데요.

정확히 매칭된 그 단어만 보고 싶다면 `-o` (`--only-matching`) 옵션을 사용합니다.


```bash
grep -Pnr --only-matching --include '*.go' 'func print\w+' .
```

이렇게 하면 불필요한 주변 코드를 제거하고 깔끔하게 함수 이름만 뽑아낼 수 있습니다.


### 파일 이름만 출력 (Show files only)

내용은 필요 없고, 해당 문자열이 포함된 파일 목록만 필요할 때가 있죠?

`-l` (`--files-with-matches`) 옵션을 쓰면 됩니다.


```bash
grep -Pnr --files-with-matches 'httpurr' .
```

이 결과는 파이프(`|`)를 통해 다른 명령어로 전달하기 아주 좋습니다.


### 문맥 보기 (Show context)

검색 결과만 띡 보여주면 그게 코드의 어느 부분인지 파악하기 힘들 때가 많은데요.

이때 `-C` (`--context`) 옵션이 빛을 발합니다.


```bash
grep -Pnr --context=1 'jobs:' .github/workflows
```

위 명령어는 매칭된 줄의 위아래 1줄씩을 함께 보여줍니다.

만약 이전 줄은 필요 없고 다음 줄만 보고 싶다면 `-A` (`--after-context`)를, 이전 줄만 보고 싶다면 `-B` (`--before-context`)를 사용하면 됩니다.


```bash
grep -Pnr --after-context=1 'jobs:' .github/workflows
```

### 조용한 모드 (Silent mode)

스크립트를 짤 때, 화면 출력은 필요 없고 단지 해당 문자열이 존재하는지 여부만 알고 싶을 때가 있는데요.

`-q` (`--quiet` 또는 `--silent`) 옵션을 사용하면 됩니다.


```bash
grep -Pnrw --quiet main cmd/httpurr/main.go
if [ $? = "0" ]; then echo "found!"; else echo "not found"; fi
```

종료 코드(`$?`)가 0이면 찾음, 1이면 못 찾음을 의미합니다.

특히 다중 파일 검색 시 `-q` 옵션은 첫 번째 매칭을 찾자마자 검색을 중단하므로 성능상으로도 이득입니다.


### 색상 강조 (Colors)

대부분의 현대 터미널에서는 기본적으로 색상이 적용되지만, 파이프로 결과를 넘길 때 등 강제로 색상을 유지하고 싶다면 `--color=always`를 사용합니다.


```bash
grep -Pnr --color=always codes README.md
```

## 마치며

지금까지 `grep`이 할 수 있는 거의 모든 기능을 살펴봤는데요.

`grep`은 `sed`처럼 텍스트를 치환하거나 설정 파일에서 옵션을 읽어오는 화려한 기능은 없지만, 검색 그 자체의 목적에는 가장 충실하고 강력한 도구입니다.

더 자세한 내용은 `grep --help`를 입력하거나 공식 매뉴얼을 참고해 보시기 바랍니다.

이제 터미널에서 자신 있게 `grep`을 날려보세요!
