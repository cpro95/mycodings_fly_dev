---
slug: 2023-12-09-fullstack-cloudflare-pages-workers-d-1-react-part-2
title: 풀스택 강의 2편. Cloudflare Pages 안에서 Workers를 이용한 D1 DB 제어하는 API 만들기
date: 2023-12-09 02:26:26.127000+00:00
summary: Workers로 D1 DB 불러오는 API 만들기
tags: ["cloudflare", "pages", "d1", "workers", "react"]
contributors: []
draft: false
---

안녕하세요?

지난 시간에 이어 Cloudflare 서비스를 이용한 풀스택 강의 계속하겠습니다.

전체 강의 리스트입니다.

1. [풀스택 강의 1편. Cloudflare Pages + Workers + D1 + React로 풀스택 개발하기](https://mycodings.fly.dev/blog/2023-12-06-introduction-cloudflare-pages-workers-d-1-react-full-stack)

2. [풀스택 강의 2편. Cloudflare Pages 안에서 Workers를 이용한 D1 DB 제어하는 API 만들기](https://mycodings.fly.dev/blog/2023-12-09-fullstack-cloudflare-pages-workers-d-1-react-part-2)

3. [풀스택 강의 3편. AstroJS와 Cloudflare Pages, D1, Drizzle ORM으로 개발하기](https://mycodings.fly.dev/blog/2023-12-09-fullstack-astrojs-cloudflare-pages-d-1-drizzle-orm)

4. [풀스택 강의 4편. Remix + Cloudflare Pages + D1 DB + Drizzle ORM](https://mycodings.fly.dev/blog/2023-12-10-fullstack-remix-cloudflare-pages-d-1-db-drizzle-orm)

5. [풀스택 강의 5편. Next.js 서버 렌더링을 이용하여 Cloudflare Pages로 배포하기(D1 DB, Drizzle ORM)](https://mycodings.fly.dev/blog/2023-12-30-fullstack-tutorial-nextjs-cloudflare-with-d-1-db)

6. [풀스택 강의 6편. Remix로 Github 저장소를 DB로 이용해서 KV와 함께 Cloudflare에 배포하기](https://mycodings.fly.dev/blog/2024-02-25-fullstack-tutorial-remix-cloudflare-with-kv-and-github-server)

7. [풀스택 강의 7편. Vite React 템플릿을 Hono를 이용하여 풀스택 앱으로 개조하기](https://mycodings.fly.dev/blog/2024-03-03-fullstack-tutorial-transform-vite-react-app-with-hono-framework)

---

** 목 차 **

1. [Dummy Data 만들기](#1-dummy-data-만들기)

2. [데이터 가져오는 API 만들기](#2-데이터-가져오는-api-만들기)

3. [로컬 개발 환경 구축하기](#3-로컬-개발-환경-구축하기)

4. [React로 get-tods API 사용하기](#4-react로-get-tods-api-사용하기)

5. [post-todos API 개발하기](#5-post-todos-api-개발하기)

6. [delete-todos API 만들기](#6-delete-todos-api-만들기)

7. [최종 배포하기](#7-최종-배포하기)
---

## 1. Dummy Data 만들기

지난 시간의 마지막은 D1 서버 구축이었는데요.

DB 테스트를 위해서는 많은 양의 더미 데이터가 필요합니다.

물론, sql 파일을 직접 만들어 wrangler 명령어를 이용해서 100개 정도의 더미 데이터를 만드는 것도 좋습니다.

하지만 그렇게까지 많이 필요 없기 때문에 Cloudflare의 대시보드에서 추가하는 게 훨씬 쉬운데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEggZL-Uhj_eJ_pcqyIflxtyu3mLg7UPlSU_3rArDUUUlW1AL23AOB5lNftMdHC2HKLvFjpQW5vq6JGdbD2u0Xu0Ca-A81EFUvvS-BrYx4o11TnC6ZSSznasmIA7WSzhE01LKepamUSvse-Qw2kye5HRHe4UYzafcyqEzLi3wcIpDodT4CaGlIJUfl40Gso)

위 그림에서 "Add data" 버튼을 누르면 아래와 같이 수작업으로 SQL DB에 데이터를 추가할 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhscGCwtAZXVoitlMBJmaLHdMS4N5BYVxGfGgFNy1VFIZu_xQXFY4FPPRzVPksyXVJ_eq_xqqB8XiJc6GfNquDirp0MV9nV1FVxu2E69PSsco2sHE9EUBbQXqWy9FuRo8BJh7xMhcVNtmyo660o5K1COSQFhdIxPinKMxfnlEPnIrOALBuiurAL75rM-t4)

그리고 아래 그림처럼 해당 데이터를 Update, Delete까지 할 수 있는 기능도 제공해 줍니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiBiKxhE2Ta6-Yxfda2l5iden7x7lyvCQs7_UAHJN--qb4zKMlAQft9PdXmfEndXhd3Jdhe5OiFtr2KYdEPKeJDKjFCzZ8m3qy49rvGRadycr_zRh-igxwbENdUb3H6uhQ0lU25SxS6SgBrDOXSTmwzpI91MbKgWCwEl6vj6A4KhRxYT2xdT6kcVkOHRPI)

저는 총 4개의 데이터를 넣었는데요.

테스트를 위해서는 충분한 거 같네요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiQuxa-7klTZ9TZ1xK2yDTX3_TGVw5n2FfrNGqVGYvEq-cGG8BmSuAKD2IrLhQ5RfI7PKMcs6kQG67I3rYekROLDbOIO0Ods1pz9ZYZNMwDC7d0QE6LO3jFgvByuFG7NG9Lo0U7XyX1v7hvprtdDz7f1jOSepEUjAtA8quIcsytmFBtm_3th9JwORonEh4)

---

## 2. 데이터 가져오는 API 만들기

HTTP 메서드의 가장 기본인 GET 메서드를 이용해서 D1 DB에 있는 데이터를 가져오는 로직을 구현해 보겠습니다.

functions 폴더 밑에 api 폴더를 만들었었는데요.

거기에 get-todos.js 이름으로 파일을 만듭시다.

```js
export async function onRequestGet(c) {
  const data = await c.env.DB.prepare(`select * from todos`).all()
  return Response.json(data)
}
```

위 코드를 실행해 보면 에러가 나는데요.

여기서 먼저 설명할 게 있습니다.

c는 context이고,

onRequest 함수를 안 쓰고 onRequestGet 함수를 썼는데요.

Get 메서드만 처리하는 함수여서 onRequestGet 함수를 썼습니다.

그리고 가장 중요한 c.env.DB 부분인데요.

이 부분이 우리의 코드와 Cloudflare의 서비스 부분을 연결하는 environment 부분입니다.

먼저, 지난 시간에 만들었던 npx wrangler 명령어로 D1 DB를 만들었던 아래 명령어를 보시면

```bash
➜  cloudflare-pages-d1-stack-example> npx wrangler d1 create pages-d1-stack
✅ Successfully created DB 'pages-d1-stack' in region APAC
Created your database using D1's new storage backend. The new storage backend is not yet recommended
for production workloads, but backs up your data via point-in-time restore.

[[d1_databases]]
binding = "DB" # i.e. available in your Worker on env.DB
database_name = "pages-d1-stack"
database_id = "2ddfdc8f4-9601-4ae2-aeaa-12adfasdf6d8820f"
```

우리가 필요한 자료가 다 나와 있습니다.

먼저 프로젝트 최상단 폴더에 wrangler.toml 파일을 만들고 아랫부분만 넣으시면 됩니다.

```bash
# wrangler.toml

[[d1_databases]]
binding = "DB" # i.e. available in your Worker on env.DB
database_name = "pages-d1-stack"
database_id = "2ddfdc8f4-9601-4ae2-aeaa-12adfasdf6d8820f"
```

여기서 binding이란 항목은 코드와 D1 DB를 실제 이어주는 바인딩인데요.

바인딩 이름으로 'DB'라는 이름을 쓴 겁니다.

그리고 database_name은 실제 Cloudflare에 저장된 DB 이름입니다.

그리고 database_id는 다른 곳에 유출되면 안 되는 코드로 이게 정확해야지 D1 DB에 연결이 되는 겁니다.

database_id는 아래 그림처럼 대시보드에서도 볼 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhf4jC4FJhtajxkpHH-Pyx2Cr0bdYFaAWlF3SvfFL4lQEa_jjBy0HpDmeQi7LoG_xMF0qj_cZG90Ao_0PsiZkwV9Ao_wuVEDgsrwI0oYgt9TdSFqWat-cvM6ARIqvkvDgOm8fPMs0hWtOcpIfp2vn16ELqipPfVNJNax_qgpunw_3LIDRePfMOLJ2zNADk)

이제 개발 서버를 다시 돌리면 됩니다.

잠깐, 여기서 개발 서버를 돌리지 말고 일단은 workers를 새로 만들었으니 실제 엣지 서버에 배포해 보겠습니다.

프런트엔드 쪽인 React앱은 수정한 게 없으니까 다시 빌드할 필요 없으니까 단순히 아래와 같이 명령어를 입력하시면 새로 만든 workers가 엣지 서버에 올라가게 됩니다.

```bash
npx wrangler pages deploy ./dist
```

그리고 터미널 창에 나온 개발 서버로 직접 연결해서 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEhCt-jpXF5MztTHH0KN-DqA25wLl0b-YjfXdXGxTFrmmGz8oW1CRZTZyAyBDQmXye6bcPKvGUcXvLNuXeaSg27SsDwr-lDyyKKgEpYMYS6dej-IsYsqUBds0dHkaUb_4KAk2CYijqS0QKrb69Tw7DOUT5fj8NEWMbdKXBmclhmvqvRmxlNmflSMYyNh9og)

위와 같이 'api/get-todos' 경로로 갔을 때 에러가 나옵니다.

왜 그런 걸까요?

바로 우리가 이용한 Cloudflare Pages 서비스의 세팅 부분에 D1 바인딩 부분을 직접 해줘야 합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEi9kmriPJRMsie9W1litiOVykstyfeWtAJ4X_uGZcMEm0VBxa2CwoEMBglZMtcdwuzalkKiSvAvys50dWTOUMvOZxmZlTq7kwm0YyaucOe9vewAm0xI9o_vVMoBtZSLW3ASl1LoEFKes0RfLKEqYvSdSRIGrOVuOB3u4OHjjHDdWinePr7BP6SpgIxKJX0)

위 그림이 정적 사이트 호스팅 서비스인 Pages의 대시보드 중에 있는 실제 작업 중인 앱입니다.

여기서 Settings를 클릭하고 Functions 부분도 클릭한 다음 밑으로 스크롤 한 다음 D1 부분에서 바인딩을 아래와 같이 하면 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgw4d6ERn_ZGjgbiLghuFY4N4lNObGGzsN4gQN7aMQVTjclUiVNehQbf42ofD6f4OjmZwxkXSz75MEh5OPQ16PGwWeHTYKvoEZXNnQ_wTu2qyOQ16X1kRVOfZaB18Zvk8gOacuEt7oITYjjbJ7HQcNHWpK_mV2kh5aIhoKD6Q2DJO24lvLzjR8Uu8MuIXA)

위 그림에서 'Variable Name'이 'DB'입니다.

우리가 wrangler.toml 파일에서 bindings라는 부분에 명기했던 그 이름입니다.

이제 저장하고 다시 'api/get-todos' 주소로 이동해 볼까요?

안될 겁니다.

조건이 바뀌면 다시 또 wrangler deploy 해줘야 합니다.

```bash
npx wrangler pages deploy ./dist
```

이제 다시 우리의 Pages 정적 사이트 주소로 가서 'api/get-todos' 주소로 가볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEhwqbtOzwzaKo89exK_PqDdFteOv5UAGb1FeTfdD6-Q51oHyn8Hehnk5zVfQjmJC8smL2kM9BaWIeYlaoplqGqzodepoaVhVVWEOGs3AOEjKGOU-MW3semck237WXbaL_Q7z6nBRoiGtw3LmCS_HxIPNlbedshdQ7ElI8eJpUN5Z7mroqI0HKbzLdB-wzk)

위 그림과 같이 성공적으로 나옵니다.

여기까지가 공식적인 Deploy에 해당되는 DB 관련 세팅 방법이었습니다.

그런데, 우리는 지금 개발 서버를 돌려야 하잖아요.

wranlger는 그 부분에 대해서도 신경 써 줍니다.

바로 '--local'이란 문구를 넣으면 프로젝트 폴더에 '.wrangler'이란 폴더 밑에 실제로 로컬 서버에서 작업할 DB를 만들어 줍니다.

---

## 3. 로컬 개발 환경 구축하기

wrangler가 현재 버전이 '3.19.0' 인데요.

제가 이 부분에서 몇 시간 고생해서 얻은 결론은 바로 wrangler를 3.8 버전으로 낮추는 것과 NodeJS 버전도 16 버전으로 낮추는 겁니다.

왜냐하면 wrangler가 로컬 서버에서 돌리는 DB 관련 패키지가 better-sqlite3 패키지인데요.

이 패키지가 NodeJS 버전 16에서 C 언어 파일을 컴파일해서 연결한 겁니다.

그래서 현재 사용 중인 NodeJS 버전 18에서는 작동하지 않는데요.

그러면 왜 정식으로 배포했을 때는 아무런 에러 없이 작동한 건지 모르겠네요.

아마도 정식 배포된 엣제 서버는 NodeJS 16으로 동작하는 게 아닐까 싶습니다.

그리고, 아직 D1 서비스가 베타 상태라서 그런 거니까요, 나중에 정식 서비스를 시작하면 이 같은 문제가 생기지는 않을 거 같습니다.

nodejs 버전은 'nvm'을 이용하면 됩니다.

```bash
➜  cloudflare-pages-d1-stack-example> nvm use v16
Now using node v16.17.0 (npm v8.15.0)
➜  cloudflare-pages-d1-stack-example> node -v
v16.17.0
```

이제 package.json 파일에서 wrangler 부분을 3.8.0으로 바꾸고 다시 npm install 하시면 됩니다.

```js
"wrangler": "3.8.0"
```

이제 '.wrangler' 폴더도 깔끔하게 지우고 다시 시작해 볼까요?

```bash
rm -rf .wrangler

npx wrangler pages dev
```

위와 같이 입력하고 개발 서버가 돌려지면 'api/get-todos' 주소로 이동하면 아래와 같이 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhkYdmoQmlbAjVnPGYaZyWVwO1n94swxqdjnLGadqvTrCqX31Mht-1J_VfKnb0-tZRR5Vjeoqg6TI5xKqyxQC-rcmzAyBXgAWxic-snUdkNIC_iNbVm2jx-mkNyhW6Egb3mdHRdkkgZBOlBpZ9qFZdlkC5PUl4EpTSXvTChTeRrF6AEh6IDgPAipkkT1kg)

todos 테이블이 없다고 나오네요.

왜 그런지 '.wrangler' 폴더 밑에 있는 db.sqlite 파일을 열어 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEhmf1dudxTGb-IJNyxac1UBaHx6jQsWlat5qKpeCwbno8UvCblpbGnHj26ro9wrLFtuCVCTVMz7H01wzW226QgyOJW93SmOkAy_aDoJMTjmYnJm82tJhFuTjbiwQWK4oaigrnCS3-dNdytbbBus4OcCp9v-OJPmwlEP2JgPf2IdG0yscWsXMqoQ-CfycT4)

위 그림과 같이 실제 로컬 상에 있는 db.sqlite에는 아무런 테이블도 없습니다.

지금까지 만든 테이블은 전부 실제 엣지 서버에 전부 저장된 거죠.

그래서 로컬 DB에도 테이블과 더미 데이터를 만들어야 합니다.

D1 DB를 로컬상에서 돌리려면 wrangler.toml 파일에 다음과 같이 한 개의 문장을 추가해야 합니다.

```bash
# wrangler.toml

[[d1_databases]]
binding = "DB" # i.e. available in your Worker on env.DB
database_name = "pages-d1-stack"
database_id = "2ddfdc8f4-9601-4ae2-aeaa-12adfasdf6d8820f"
preview_database_id = "DB" # Required for Pages local development
```

바로 마지막줄에 있는 'preview_database_id' 입니다.

이 값으로는 바인딩된 'DB'라는 값을 넣으면 됩니다.

이제 로컬 상 D1 DB에 테이블도 만들고 데이터도 집어넣을 수 있습니다.

d1 명령어로 로컬에 데이터를 추가하려면 '--local' 옵션을 넣으면 됩니다.

참고로 '--local' 과 반대되는 옵션은 '--remote'입니다.

```bash
npx wrangler d1 execute pages-d1-stack --local --file=./todos.sql

실행결과---
▲ [WARNING] Processing wrangler.toml configuration:

    - D1 Bindings are currently in alpha to allow the API to evolve before general availability.
      Please report any issues to https://github.com/cloudflare/workers-sdk/issues/new/choose
      Note: Run this command with the environment variable NO_D1_WARNING=true to hide this message

      For example: `export NO_D1_WARNING=true && wrangler <YOUR COMMAND HERE>`


--------------------
🚧 D1 is currently in open alpha and is not recommended for production data and traffic
🚧 Please report any bugs to https://github.com/cloudflare/workers-sdk/issues/new/choose
🚧 To request features, visit https://community.cloudflare.com/c/developers/d1
🚧 To give feedback, visit https://discord.gg/cloudflaredev
--------------------

🌀 Mapping SQL input into an array of statements
🌀 Loading DB at .wrangler/state/v3/d1/DB/db.sqlite
```

위와 같이 에러가 없이 잘 실행됐네요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhiRWhOg85ksGy6NPS3M4LhEBRISmiBtL0f4N7DIihJki0gnNsb5LSFlBXo27-6ZEDQPHZJr7QLIZvkpOvDWnb-dmTeiJYBkE56iud-JWfuZvDlUvBaf_9kgVT-HkH2Otr1OpL_ArtHlapdStKsWD1ufcnuCJmVrM-O8jvI4TF4bZ3WWrMXiQIcJQaBOcw)

그리고 위와 같이 로컬 폴더에도 해당 데이터가 잘 나오고 있습니다.

그러면 개발 서버를 다시 돌려 볼까요?

```bash
npx wrangler pages dev --local ./dist
```

우리 앱은 pages 앱이기 때문에 위와 같이 pages dev 방식으로 개발 서버를 돌려야 합니다.

그리고 pages dev 에서는 '--local'이란 부분이 자동으로 설정된다고 하고 앞으로 없어질 거라고 합니다.

사실 dev 서버에서는 '--local' 옵션을 생략해도 똑같이 작동하게 됩니다.

그리고 다시 'api/get-todos' 주소로 이동해 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEhNmQ1L4knpdnzKfxoRkvmyScRZcdZvH8LFRiGK39wHYVs-fFvT8hnL1gLYtr4p3gfSemBBxUr8qHrvJ7cw6kwnIm3X7s88yLoNeShVQcwJBoHvoC0b9S45ZSKuKqvlWrpCEBr9ucnrmYvgDA0pxKzVtzV1z6Nb78w0M7BR-JIKXHdFXqHP9tiuH5qWkE0)

위와 같이 잘 나옵니다.

참고로 Cloudflare의 D1 DB의 SQL 관련 API는 항상 위 그림과 같은 JSON 파일을 리턴합니다.

API 호출에 대한 성공여부와 meta 정보를 같이 포함하고 있습니다.

실제 유저가 만든 결과는 results 항목에 있으니까 참조 바랍니다.

여기서 눈여겨볼게 바로 정식 엣지 서버에는 4개의 데이터가 존재했었고 방금 위에서 본 로컬 서버는 한 개의 데이터만 있죠.

이로써 우리는 정확하게 로컬 개발 서버를 구현한 겁니다.

로컬 쪽에 이런 방식으로 DB 관련 API를 개발한 다음 최종적으로 엣지 서버로 배포하는 방식을 사용하시기 바랍니다.

배포하는 시간보다 로컬에서 개발하는 시간이 훨씬 짧게 걸리거든요.

로컬 DB의 todos 테이블에 데이터를 몇 개 추가해 봅시다.

```bash
npx wrangler d1 execute pages-d1-stack --local --command="insert into todos(title, desc) values('test 2','테스트2입니다.');"

npx wrangler d1 execute pages-d1-stack --local --command="insert into todos(title, desc) values('test 3','테스트3입니다.');"

npx wrangler d1 execute pages-d1-stack --local --command="insert into todos(title, desc) values('test 4','테스트4입니다.');"
```

실제 로컬에 있는 DB 파일에 제대로 입력되었네요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhjEU1LAYInYTZTWCwy62nvUFYAZXv8Nm65rF3kSQcHy4Z_HM_dCtF7NvhYMdutG3nDVID1NZSHaBXn73DHVCkNJcF2TSMy4YuvPf68im2PzgYsr4LlzObaLVTY6uH9EC531_5nX_nq_aVySUbV0mK7Om-eBB2Uoa992RbFJ2olJPYPvb6PW2KxJJOD4GE)

이제 로컬 개발 환경 구축이 완성되었습니다.

개발 서버를 다시 돌려볼까요?

```bash
npm run dev
```

---

## 4. React로 get-tods API 사용하기

이 부분은 여러분들이 React 공부하실 때 매번 하던 일입니다.

src 폴더의 App.tsx 파일을 아래와 같이 수정합시다.

```js
import { useState, useEffect } from "react";
import "./App.css";

type Todo = {
  id: number;
  title: string;
  desc: string;
  created_at: string;
};

type Data = Todo[];

function App() {
  const [data, setData] = useState<Data>();

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch("/api/get-todos");
      const todos = await result.json();
      console.log(todos);
      setData(todos.results);
    };
    fetchData();
  }, []);
  return (
    <>
      <div className="flex flex-col justify-center items-center p-8">
        <h1 className="text-2xl font-bold pb-8">
          React with Pages + Workers + D1 Example
        </h1>
        <ul>
          {data ? (
            data.map((d) => (
              <li key={d.id}>
                {d.title} - {d.desc}
              </li>
            ))
          ) : (
            <></>
          )}
        </ul>
      </div>
    </>
  );
}

export default App;
```

UI가 조금 거슬리는데 개발 테스트라서 그냥 무시해주세요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgAg3EVkqIzA4AA0USLbyE-K7Wf7KlXO707hGvPNWGq4OKvOSW4KOLekvLRZUN1JSP1Nw5lpVv_zBYbSqoflX--LH-TxrorC8T2WrNowBV1qWhldzTLRJiNXtgn1WrLP0j_afpMIIYIMjoApkpYoJVO4cvm2gHBMLonKFxvshd_VomgU34kgqAUTa7nshQ)

위와 같이 우리가 만든 개발 서버의 get-todos API가 완벽히 작동하네요.

---

## 5. post-todos API 개발하기

이제 todo 항목을 웹상에서 직접 넣는 POST 메서드를 만들어야 하는데요.

일단 UI 부분을 아래와 같이 작성합시다.

```js
<h1 className="text-2xl font-bold pb-8">
  React with Pages + Workers + D1 Example
</h1>
<form method="post" action="/api/post-todos" className="space-x-2 mb-8">
  <input className="border p-2" type="text" name="title" />
  <input className="border p-2" type="text" name="desc" />
  <button
    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    type="submit"
  >
    Add Todo
  </button>
</form>

<ul>
...
...
</ul>
```

h1 태그와 ul 태그 사이에 form을 넣었습니다.

여기서 고민할 게 있는데요.

React의 클라이언트 사이드에서 handleClick 함수를 이용해서 바로 'fetch'하는 방법과 위와 같이 아예 form을 이용한 방법이 있는데요.

여기서는 form을 이용한 방법을 사용했습니다.

클라이언트 사이드에서 바로 사용하는 부분은 DeleteTodo 부분에서 구현해 보도록 하겠습니다.

form 태그의 action 부분이 바로 주소인데요.

post-todos.js 파일을 만들면 됩니다.

위 코드에서 보시면 input 태그의 name이 두 개인데 각각 'title'과 'desc'입니다.

이 부분을 post-todos.js 부분에서 처리하면 되는 거죠.

functions/api/post-todos.js 파일입니다.

```js
export async function onRequestPost(c) {
  const formData = await c.request.formData();
  const title = formData.get("title");
  const desc = formData.get("desc");
  await c.env.DB.prepare(
    `
    insert into todos(title, desc) values(?, ?)
    `
  )
    .bind(title, desc)
    .run();
  console.log("Created Todo!");
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
    },
  });
}
```

POST 메서드라 onRequestPost 함수로 작성했습니다.

우리가 input 태그에서 넘긴 데이터는 formData로 접근할 수 있습니다.

그리고 그걸 SQL의 insert 문법으로 작성한 거죠.

insert 문법에 보시면 '?' 표시가 있는데요.

bind(title, desc) 처럼 하시면 '?' 표시된 부분으로 데이터가 넘어갑니다.

그리고 마지막으로 Response를 "/" 경로로 다시 redirect 해서 넘겨줍니다.

테스트해볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEguvdXcM2ER8o2lmStMHuwaOrxhOvD5C4B4fu6ZVwvanjseZY760dDC1GqDBAT1XXe_8O2V-Nz8dNJsLMHSO3gK3NnK6-SyLHabC_CkEInHcxJ0ps3lp7TMuknAW2u4PTk88TxW7uVpY9WLPxxswJNYDz9TKplTzuANyBeWDm5YMlGgVey9WXlV0Ay-Vec)

위와 같이 form에 해당 값을 넣고 'Add Todo' 버튼을 누르면 아래와 같이 화면이 리프레쉬되면서 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjFUBRJ7yCkLRLbI84SQofiNnJl7xKMglvj8KYSfTHhrpFFXay4imDpgdnJORpnHzVxbV698XqvMFSTaM8w1BywWrfu2iAbtJX4GyXcdmn74o7A6cmY-nP_pRcvc9hYn1mks8Fr2PV90q5_-af0GGGQ9tFxo1yG_KdnGH60le9uE5CRLlQzKxEVjoygF6w)

어떤가요?

POST 메서드를 이용한 post-todos API 가 완벽하게 작동하네요.

---

## 6. delete-todos API 만들기

이 부분은 DETELTE 메서드를 이용한 API입니다.

id를 넘겨서 해당 id만 삭제하는 로직을 작성하면 됩니다.

먼저, UI를 수정해야겠죠.

여기서는 클라이언트 사이드에서 작동하는 로직으로 구현해 보겠습니다.

당연히 form을 이용해서 구현할 수도 있죠.

먼저, 서브 컴포넌트인 DeleteTodosButton 컴포넌트를 만들겠습니다.

```js
// DeleteTodosButton.tsx 파일

const DeleteTodosButton = ({
    todoId,
    onDelete,
  }: {
    todoId: number;
    onDelete: (todoId: number) => void;
  }) => {
    const handleDelete = async () => {
      try {
        const response = await fetch(`/api/delete-todos`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ todoId }),
        });
  
        if (response.ok) {
          // 성공적으로 응답받았을 때, onDelete 함수 호출하여 로컬 상태나 UI 업데이트
          onDelete(todoId);
        } else {
          console.error("Failed to delete task");
        }
      } catch (error) {
        console.error("Error during DELETE request:", error);
      }
    };
  
    return (
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
        onClick={handleDelete}
      >
        Delete Task
      </button>
    );
  };
  
  export default DeleteTodosButton;
```

이제 이 컴포넌트를 App.tsx 파일에 추가해 보겠습니다.

```js
import { useState, useEffect } from "react";
import "./App.css";
import DeleteTodosButton from "./DeleteTodosButton";

type Todo = {
  id: number;
  title: string;
  desc: string;
  created_at: string;
};

type Data = Todo[];

function App() {
  const [data, setData] = useState<Data>();

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch("/api/get-todos");
      const todos = await result.json();
      console.log(todos);
      setData(todos.results);
    };
    fetchData();
  }, []);

  const handleDeleteTodo = (todoId: number) => {
    // 성공적으로 삭제된 작업을 로컬 상태에서 제거
    setData((prevData) => prevData?.filter((todo) => todo.id !== todoId));
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center p-8">
        <h1 className="text-2xl font-bold pb-8">
          React with Pages + Workers + D1 Example
        </h1>
        <form method="post" action="/api/post-todos" className="space-x-2 mb-8">
          <input className="border p-2" type="text" name="title" />
          <input className="border p-2" type="text" name="desc" />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            type="submit"
          >
            Add Todo
          </button>
        </form>

        <ul>
          {data ? (
            data.map((d) => (
              <li key={d.id}>
                {d.title} - {d.desc} -{" "}
                <DeleteTodosButton todoId={d.id} onDelete={handleDeleteTodo} />
              </li>
            ))
          ) : (
            <></>
          )}
        </ul>
      </div>
    </>
  );
}

export default App;
```

실행 결과는 아래와 같습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEglX4M5L4eObg9e0VpEheJnlsCqHZRitpqSCLFeEnLa6mq3BARNCpuNcsiSK3SL8wGysRMJTws5hwfW0ibZZYa_OK_DKZeBLtV17Rm7KbB5luUIE_JJW5asz5I_8E1aIj4Q5rLS235esQehBJVCzVEu7RyJ6atMeMX-6QZ5O3K2x7IOV5aMBk2h7wbUKVY)

위와 같이 나오는데요.

UI는 정말 형편없네요.

UI가 완성되었으니 API인 delete-todos.js 파일을 만들어야겠죠.

```js
// functions/api/delete-todos.js

export async function onRequestDelete(c) {
  const data = await c.request.json();
  const { todoId } = data;

  if (!todoId) {
    return new Response(JSON.stringify({ error: "Todo ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  await c.env.DB.prepare(
    `
      DELETE FROM todos WHERE id = ?
      `
  )
    .bind(todoId)
    .run();

  console.log(`Deleted Todo with ID: ${todoId}`);

  return new Response("Todo deleted successfully", { status: 200 });
}
```

이제 테스트해 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEgy1x5cGOjkKMmV577sUsa9EuK17GqLO_0UDHWXu9N8dF6Jsutjl9StO4TKmmBw-b02m92ewe0uF9jnFge09ZRaIS05-lgGYigzlwPVaQ3k9glg_JjwiEs5o5X3Hg1imDB5xaBvEogI7xmTRIlDTeYJZixIaahIAw3beJ6b_gx7UocXpgexW0OJWf05XWg)

위 그림은 'test 4'를 지운 후의 모습입니다.

그러면 실제 로컬 DB에는 어떤 변화가 있었는지 확인해 봐야겠죠.

```bash
➜  DB sqlite3 db.sqlite
SQLite version 3.37.0 2021-12-09 01:34:53
Enter ".help" for usage hints.
sqlite> .schema
CREATE TABLE todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  desc TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT (datetime(CURRENT_TIMESTAMP,'localtime'))
);
CREATE TABLE sqlite_sequence(name,seq);
sqlite> select * from todos;
1|test title|test desc|2023-12-09 13:03:44
2|test 2|테스트2입니다.|2023-12-09 13:12:22
3|test 3|테스트3입니다.|2023-12-09 13:13:11
5|테스트 5|test 5|2023-12-09 13:56:28
sqlite> 
```
위와 같이 로컬 폴더에 있는 데이터도 완벽하게 Delete 액션이 작동되었네요.

---

## 7. 최종 배포하기

이제 완성되었으니 다시 최종 배포하면 됩니다.

package.json 파일을 열어 scripts 부분에서 deploy 부분만 다음과 같이 추가합시다.

```js

 "scripts": {
    "dev:ui": "vite",
    "dev": "wrangler pages dev --compatibility-date=2023-12-06 -- npm run dev:ui",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "deploy": "npm run build && wrangler pages deploy ./dist"
  },
```

이제 npm run deploy 해볼까요?

```bash
➜  cloudflare-pages-d1-stack-example npm run deploy

> cloudflare-pages-d1-stack-example@0.0.0 deploy
> npm run build && wrangler pages deploy ./dist


> cloudflare-pages-d1-stack-example@0.0.0 build
> tsc && vite build

vite v5.0.6 building for production...
✓ 33 modules transformed.
dist/index.html                   0.46 kB │ gzip:  0.30 kB
dist/assets/index-Fv-pgNiL.css    5.87 kB │ gzip:  1.80 kB
dist/assets/index-XMZ3fdCu.js   144.02 kB │ gzip: 46.42 kB
✓ built in 2.34s
✨ Compiled Worker successfully
🌍  Uploading... (4/4)

✨ Success! Uploaded 3 files (1 already uploaded) (1.85 sec)

✨ Uploading Functions bundle
✨ Deployment complete! Take a peek over at https://4511194f.pages-d1-fullstack-example.pages.dev
```

이제 엣지 서버로 이동해 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEhutM3SN25jCxvcdOWDcRVP9x-CHdK5ebNI2SQgAitC6DjDEg5SMKYwrQq2fOG9cOeBwuSbXlpvKgGtiQW3g0ZAuiXvsHeU2Hte5zqFwvegsnJQVAyrHDtl72S6ZGPtbfXhw-u6V5GpE6jGjn5MjxX89VnFbPweBEHs0QPpVum0wfqCe8dMs8WiXOHU494)

위 그림과 같이 우리가 처음 엣지 서버에 더미 데이터 넣었던 게 나오네요.

Delete Todo 버튼도 눌러보세요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgoKzlkYVzen32k1Kx4U8CfoUMuTKPkfP5H2atEvnJfwWBYBno406llnKLijbsK2il3qBHWOq-dH2GkoFmN6rNYT5MUyjk12-pinB7ZIY6YV8hpRPzO8bTWT1sgLWkHUk0biD9SMkYwOxBAgTZreVK6SqpblJ5IJyeRD4m-wcfrZrFrX2DiuOcfapohw3Q)

위와 같이 한 개가 줄어들었습니다.

실제 엣지 DB에는 어떻게 되었을까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEiun3VFjf5339KntSMZXKWB6wtOBRjPZBhIi-Pybfby_AIwNv-Wvig8TUqy5FpXWI6SdhWNwkodNNB3uWiCblgsJf88YsqkfTNPtm84EDN1B8eNQ1hf7pO6BctwWjHJxUzoF-MvLyb_fNHyIO9_0JOtxGnndNfFV5jH-TOoxagE22GjMczoA2pkP-me07s)

위와 같이 엣지 서버의 DB도 반영이 잘 되었습니다.

그리고 다시 새로운 Todo를 추가해 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEjmU962CmUNFBSfy-6crzQueYtxd60pQB3JtwI0XvlvB2orRK75H3AH71Z3SDygEQLfjDExGkFqB9m99fdtY2g8R7mBxF_64cd5uXG7HhC-wkEI1WvRtFDgoch00O6PTMMBmU8aP58BNmBv9wk_uzab6yzz8mp0-GmnPMyvDxVmwLZ22nuSOwtndqHO1ic)

위와 같이 추가하면 아래와 같이 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhQEnI1kGWXpfQJl0C5RkYdEvwY0fi9eDFxd2oEwBYSX-B-ovaAGigOIpz79A4jHclfT9sgxVGIB5TNjdxn7gKVLGy2WpPhf7RcziFe4z0IDG8Ku4keMNm6HLakALS_z3hRd6w-dmwmwdgJyEWSkLm62gfloycTn0ykgepq0aTcmLJHhn78W8wc6vwSITQ)

역시나 작동이 잘 되네요.

DB 부분도 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEi4ceyZtXbTZGvvKWwSNa0Yod8dRY4dCJ0DeyRaYJgAYgIrAuq3hF1baeHTtXluY4kXaJVWsEQX25lfSG3inAZ-NhRrQ3cNQaGV_ZeNgIkupQCayVK7ZV_DCFT5u5k8rsjtS85nhY74kjNm1FY-oQS-n_lAhUSPQS7WOj_6YNmSJZ4G6IJPkIUuiSyYGVw)

위 그림과 같이 엣지에 있는 D1 DB에도 반영이 잘 되고 있습니다.

---

이제 Cloudflare가 제공해주는 무료 서비스로 풀스택 앱 만드는 강의가 끝났습니다.

제가 제공해 주는 강의를 기반으로 여러분 만의 멋진 앱을 한 번 만들어 보시는 건 어떨까요?

그럼.

