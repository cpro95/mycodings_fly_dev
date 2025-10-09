---
slug: 2022-09-05-how-to-use-git-stash-command
title: git stash 자세히 살펴보기
date: 2022-09-05 09:06:02.518000+00:00
summary: Git Tutorial - git stash 완벽 이해
tags: ["git", "stash"]
contributors: []
draft: false
---

![](https://blogger.googleusercontent.com/img/a/AVvXsEgRtulG5jbeanADYwxfhwwa1_bxPVZXgxY9cDHgPD4QTo4BVmuqTu8qUUrZJOj0oRPVayTXxi-qLJJZ5o0E8sq8sKTigiRebJdMAWQFE_37Ryt8-38IYFmU1cXUISRIWCiQJ0XUSOynhdWhOWCWn4kE8PmggLpUCVR7bNLrLtW6YoLb357b-HENIlwY)

안녕하세요?

오늘은 git 명령어 중에 stash에 대해 알아보겠습니다.

stash라는 영어 뜻은 숨겨둔 장소, 숨겨둔 것이라는 뜻이 있는데요.

코딩을 하다가 커밋하기는 좀 그렇고 임시적으로 테스트해볼 경우가 필요한데,

그렇다고 branch까지 만들어서 하기가 귀찮을 때 stash를 만들면 커밋 없이 아주 쉽게 원상 복구할 수 있습니다.

## 실전 git stash

git stash 명령어의 실전으로 들어가기 위해 빈 디렉터리에 git 폴더를 만듭시다.

![mycodings.fly.dev-how-to-git-stash-command](https://blogger.googleusercontent.com/img/a/AVvXsEjudkNIlrs83FP4rOs5FQtbJZ3lIi1XSUn_dOnucatTArTCj922xpjIK6M6n_5W7JotXNmRwrSQe9D8iBPx-MOp9LHi4L7JBLVIoRnA15taY1FSjQjqII7mjlkMK1DlSnOU0yorvvcAKdbxi2bHg5J56npopAlGtvPUf9sF0-yonhSZS34zqQazto9p)

위 그림과 같이 만들었으면 이제 빈 파일을 추가해서 커밋 몇 개 해 보겠습니다.

![mycodings.fly.dev-how-to-git-stash-command](https://blogger.googleusercontent.com/img/a/AVvXsEjqS9DTeHbMOU3Ri19hzxx1Uvb5K146BU3AZca0M4xys3z0Z1Ja_X4rBpBD0bSIeiwJIvCdXfvbACJBuhGOSNvkhrAFpIiPEJ8GgGMDH1jQ3ZYT-kZiA3V2DxEhGEpvvt98PrNXN0hmzLe7s22ABwcFdD2FRc_JEUfcYggUYaWK_UgpBXrm2-jd3yIX)

git status 상태를 보면 untracked files가 두 개 있다고 나오는데요.

git stash 명령어를 사용하려면 untracked 상태에서는 사용할 수 없습니다.

그래서 아래 명령어로 untracked files를 스테이징 해야 합니다.

```bash
git add --all
```

![mycodings.fly.dev-how-to-git-stash-command](https://blogger.googleusercontent.com/img/a/AVvXsEgmK0MsVt0BcbFXkDehq8SFg2ba8_nm6rn4ZXGfk11sNZCew7OP6srGh-0u5EZuNns3_p8ifzdjQw_Ru26IXf9_PO1_llVJcQpj4U06lO2H4GNC2sPxEROf2Kdq1BOPK_h_JhgcNAYlQeDijTkYA78RAQO_eB2J-J-H4j0awRNvi-2uOL5ybQBDo51n)

그리고 첫 번째 commit을 해야지 git stash를 사용할 수 있습니다.

```bash
git commit -m "initial commit"
```
![mycodings.fly.dev-how-to-git-stash-command](https://blogger.googleusercontent.com/img/a/AVvXsEjg2NLJwiDVxE5DM4HQC5gxshPCyHjbfnDw9l8zFjGWgCtb3pIqQJlcoH2ixy5jYI9PQDCV2KWjXTyVheX5JxmR3BqgvgdwtDMgo4CWpORvGf4Y7hZOwzorEwQxQF5U-8Q7WhibZqjXuXOLU9BYg6Lfnonr6agrxcB7DTbAdYU3QD9hTg80YvC4vaiN)

이제 git stash를 사용할 수 있는 상태가 되었는데요.

테스트를 위해 file1의 내용을 수정해 보겠습니다.

```bash
echo "test1111" >> file1
cat file1
test1111
```
![mycodings.fly.dev-how-to-git-stash-command](https://blogger.googleusercontent.com/img/a/AVvXsEhlZld5zuixptCmudP6DZwosYR7f57Ba1gWCAAZYWdPTjGvw3a8euDC7iJ6SzpqAhYK0TqsFjGgFyZyDwiAlxFcG8uVpIjxqTzDO8eBNgBqNhR07BkTEE2AoaVUAGeftpX72K--7GClTtWZZrjTe5AvmPQqO8EFQsGZan0G77tBdiL5rCvT6jTjLQjZ)

이제 다시 git status 상태를 볼까요?

당연히 file1 파일의 내용이 바뀌었다고 나올 겁니다.

![mycodings.fly.dev-how-to-git-stash-command](https://blogger.googleusercontent.com/img/a/AVvXsEjIeQCTpP5XRg2JcRv37L7EL8Sdj8I8Vy79Ft3t521H5RWFv61v35l4XMYwT56qVhWHSxexUKx9Uqi3pb1NSjIFLkhwb6R8pYhbw9D2PF9I9_c38ufWwvp4Qvn4PdZGrGcQE9pFIlnbhw3O4vjPfcCEbvqC0CnHh6ZmxEVIqJhZ9BtFc59Ot_EvNP8u)

이 상태에서 git commit을 하던가 아니면 git stash를 할 수 있는데요.

약간 테스트를 위한 코드라고 생각한다면 git stash를 이용해서 코드를 숨겨둘 수 있습니다.

git stash 명령어는 아래와 같이 두 가지로 실행할 수 있는데요.

```bash
git stash

또는 

git stash push -m "initial stash push"
```

꼭 두 번째 방법을 사용하시라고 권하고 싶습니다.

첫 번째 방법인, git stash를 만들면 현재 커밋된 정보를 가지고 stash 정보를 보여주는데요.

아래 그림처럼 헷갈립니다.

![mycodings.fly.dev-how-to-git-stash-command](https://blogger.googleusercontent.com/img/a/AVvXsEgq0H54haLGgSfIj0gzGj8yf_3TYMbMtV8hX8_bkmFudMgpkAxbIoaYw9b7uGZJlOIUlu94zh3rLefdhXFvs24vpNw2RBwblHnejxvcAVvo3KaED-J-S8tIwFKnsjnF1_JhOdQA58myST0b-CzWmeGZUOSLYojOASsch5ewJ2Ix6nlZVeZUesyNUQYS)

아래는 'git stash list' 명령어를 치면 나오는 화면입니다.

![mycodings.fly.dev-how-to-git-stash-command](https://blogger.googleusercontent.com/img/a/AVvXsEjH7Fgx_T2TC0VmqyB_RhtL2ajd3anB6doYx7ZVWxEoDLopZoNj5G4eApT_3Roz2Xl9Zt_1PwIAnOQu9DQJq9WEEA-5MSnLzVqHBoJRFHoa0VW7z4-tiEYqj54f2WypGEyGluw7HNhMYOYaf64HnlHGewapwiyRiv6XAnzZb6wbg0N5uOJB3WFxfEQn)

그래서 꼭 두 번째 방법을 사용하여 commit 할 때와 같이 주석을 달아 주는 게 좋습니다.

![mycodings.fly.dev-how-to-git-stash-command](https://blogger.googleusercontent.com/img/a/AVvXsEi9lMS94gQeoesxNYqdww4xpXFP8TMFBYhOOdE-WYQcF189ect44pabj0bSlJTv908b62q2wDxbvGtqW6bd-gT7FLldsVISAg1Xnh8Tf_K0qiHIvN80Xc4zvsTP-tKSSPsdznUe3-dNc-OdlfDfzc-d738Xcs_ZqoZCA7cqB5e2RXOVHGKFzD0T5BBY)

아래 사진처럼 'git stash list' 명령어를 쳐도 우리가 주석을 달았던 내용대로 stash 리스트가 나오고 있어 나중에 구분하기가 쉽습니다.

![mycodings.fly.dev-how-to-git-stash-command](https://blogger.googleusercontent.com/img/a/AVvXsEhAX3qfSXJlCH6nnWR2MykNFMdHo1xCEVDvORb5eSdjPh9y4uriPgTiJ9zTvXUJeDXXeSr0RrJ85OtolwjYb63jyZehQsXOkSRSeOOQz00HIWNQze5MeT4FqN9FI2OFBGGzikK7e7BDb6VBfUKhjWt3z2FNqyy_G0FgkqFv83bxNCeZc7JAaREcobSz)

그런데 잘 보시면 아래 사진처럼 git stash 하고 난 다음 git status 명령어로 git 상태를 보면 아까 우리가 수정했던 file1 파일의 변경됐던 사항이 없어졌습니다.

![mycodings.fly.dev-how-to-git-stash-command](https://blogger.googleusercontent.com/img/a/AVvXsEhefvRf5TvUvbH7-rg9NeGgMAWK3fkouDz_rzT42wWorS6A0MZT98_ZwwvGaMC39os-eUN-ysj7-i3xuHqg-glD9igmeFaTcnMqr9ZUJkKpoc62SMbTK6umdbV1GiQuvyvPgrGHvgkQugV2iyNS5iAkgYx4Hgz7qMisdNiOuSi4WfZlXrYlZXha_iyn)

바로 git stash 명령어로 아까 변경된 사항이 stash 즉, 숨겨둔 곳으로 이동됐다는 뜻입니다.

file1 파일을 열어봐도 아무것도 없다고 나올 겁니다.

이제 두 번째로 file2 파일을 수정해 볼까요?

```bash
echo "test2222" >> file2
cat file2
test2222
```

이제 다시 git status를 쳐보면 file2가 변경됐다고 나올 겁니다.

![mycodings.fly.dev-how-to-git-stash-command](https://blogger.googleusercontent.com/img/a/AVvXsEjv4WfJoX-ncCAFKCHAvb6hU4lfez1YnX3cfGCaeiJRsakEBm_JPT4Zrkv9tUggAmWSb8i0w0bs8rPx4MK7AGkCvAXvy038EriCEymK1dqbP30mYO2rRqOEQT7qNyV1q_bBM44ZiiNrttPJjyQmEE9BTKZM4ZyXQ56bY7MReGnY9CR_x9J2772Nkfzf)

git stash list 명령어로 stash 리스트를 확인해 볼까요?

![mycodings.fly.dev-how-to-git-stash-command](https://blogger.googleusercontent.com/img/a/AVvXsEjsPAuA0wWfHObp9X1FQFPpPRVQOK1islc4uYdrl8vFnBNP6IbwzFmjdx5WECgyFcmnnMbjxWKqNmqZGvtMjUkVIXeF7OYVn883JdqVxfEzM9COc1jBfGKNwfiL7fgGfVzsXUb-2aMWmUiuKL9bFyiBhdkh6knYd344INry_DZgWAtK3tPEUjlPjUaP)

stash@{0}, stash@{1}처럼 인덱스 넘버가 우리가 알아보기 쉽게 나오고 있습니다.

그럼, git stash 명령어를 두 개 한 후의 file1, file2의 내용은 어떻게 될까요?

아래 그림처럼 아무 내용이 없습니다.

왜냐하면 file1, file2 각각의 파일을 수정했을 때마다 git stash로 숨겨두었기 때문입니다.

![mycodings.fly.dev-how-to-git-stash-command](https://blogger.googleusercontent.com/img/a/AVvXsEiMLXvmH8XepVkwnptKt-N1QGWRXqeoyGAkH9AIxkwlsmr6OlHt0SzPPmnH8e4kwrnyiRzjQ6LWggT2egiwKllrBJcHs5RTB68I5v4JCssXFb4UpguRBigptAP1H22FkCYV9Ws3HI_OegbEEJ5qqB2WOgbmw85KSkHg756la7qhLSUvjMfHXbKewUTl)

위 사진에서 보듯이 파일 내용이 아무것도 없습니다.

## git stash 적용하기

그럼, git stash 한 걸 다시 코드에 적용해 볼까요?

git stash를 현재 코드에 적용하는 명령어는 다음과 같이 두 가지가 있습니다.

```bash
git stash apply
또는
git stash pop

git stash apply <index>
또는
git stash pop <index>
```

apply와 pop의 차이는 pop의 경우 해당 stash를 현재 상태에 적용하는데 stash 한 걸 지우고, apply는 지우지 않는다는 차이가 있습니다.

![mycodings.fly.dev-how-to-git-stash-command](https://blogger.googleusercontent.com/img/a/AVvXsEgf8bmnBahMyTmst4P0bsrWfu8o9P0snQKhch5hUgi448EGbK1L23z3kFMOtkAMU9Gk01wS8DSF-z4eprFr5s9mRQmkbAeqWXI41asX7uXrB81kCQNugqSHlfZJigkx80Jzc19q_5so69nkcq9lMsJHgpi67hmz9LJl6f5dbB0RlJfPi9-sjogi7_RK)

위 그림과 같이 stash 1번을 apply 했을 때 해당 내용인 file1 파일의 내용이 다시 돌아왔습니다.

![mycodings.fly.dev-how-to-git-stash-command](https://blogger.googleusercontent.com/img/a/AVvXsEgWYxYM9RR4C6xhjfrazbzZwNzF5y5E4wxN6gEsbCQFXfLpIvSEDy0u220YSwXyLrKU9eUds3H72KK4yPDxIDfccjKVe2o5c0LyJDpxuKybcUCy7rfYy5cdh5iQoH3odVzO7DL9aWKv85vf5nEOLQvblEL6qsTNn6k64z0D4G4cmOLHCz5gI9RMzvts)

apply 명령어를 적용했기 때문에 위와 같이 git stash list에 해당 stash가 그대로 남아 있습니다.

그럼 git stash pop 명령어를 적용해 볼까요?

![mycodings.fly.dev-how-to-git-stash-command](https://blogger.googleusercontent.com/img/a/AVvXsEgVOrI2zAGomftpu6M_9xzd7cX1FPREkUWLZoTTGI9vD4OT6U4zAEKfHBK8e3ESk5fZ77jjcnNX6ygZRG93LMpa7MuZu8cgcrv7c3_5zHR8uP0dCPInUDK0jMhAgUFWGeDEGSOw118DFLA3UKvBGdcMjuO3WXvFOTsz_I3Oi0eWyt1LGNUxEu0wnk0T)

그리고 stash list를 볼까요?

![mycodings.fly.dev-how-to-git-stash-command](https://blogger.googleusercontent.com/img/a/AVvXsEj6tKlv-X48q_RsEvFU3IelnppuXWZoamaMPez_JXEb9s6LW6y1lI8ToPrWsHRF7NgdmDmnSlLv8Ef3hk6iavBEFF2L6FYUp_b_C_a8jtv20zCLuu1unMtELKJV9yWDoQKBOgkS4GaVEZlVPBnjmK14VoMTxluFkL-6fIX8hHf522018eMQxhTuYyOF)

위 그림처럼 pop을 이용해서 stash를 현상태로 되돌릴 때 pop은 해당 stash를 지우게 됩니다.

참고로, apply랑 pop을 이용해서 stash를 복원했을 때는 git conflict가 발생할 수 있습니다.

이 때는 수작업으로 충돌되는 부분을 꼭 고쳐줘야 합니다.

## git stash 삭제

마지막으로 stash를 지우는 방법에 대해 알아보겠습니다.

다음과 같이 해당 stash를 지울 수 있고 전체 stash를 지울 수 있습니다.

```bash
git stash drop <index>
```

위와 같이 하면 해당 인덱스의 stash를 지울 수 있고

```bash
git stash clear
```

위와 같이 입력하면 stash 전체를 지우게 됩니다.

지금까지 git stash에 대해 알아보았는데요.

git stash 기능은 git 명령어 중에 아주 유용한 기능이니 꼭 익혀두시기 바랍니다.

그럼.
