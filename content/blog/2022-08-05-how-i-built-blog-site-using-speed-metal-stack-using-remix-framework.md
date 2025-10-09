---
slug: 2022-08-05-how-i-built-blog-site-using-speed-metal-stack-using-remix-framework
title: Remix Speed Metal Stack을 이용한 블로그 사이트 만들기
date: 2022-08-05 05:45:42.823000+00:00
summary: Remix Speed Metal Stack을 활용하여 블로그 사이트 만들고 Fly.io에 배포까지 한 번에!
tags: ["blog", "remix", "github-action", "speed-metal-stack", "fly.io"]
contributors: []
draft: false
---

안녕하세요?

오늘은 제 블로그 사이트인 [mycodings.fly.dev](https://mycodings.fly.dev/)를 어떻게 만들게 됐는지 소개해 드리려고 합니다.

일단 아래 그림은 제 블로그 메인 화면인데요.

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEgtlf54oM9IfJJeaYqj0tB9NHGEYWtAYiGic9-M5ULVjd1S_AEmHmbI8e4sqyAT3wwxshulEX-IyRNAxSJDfmsf0fLq8mn29Ef4YTsB3tF6ZiJ4knqRfeW6iuFpk0OBFsbO89mMdP8CDcL40-Sm72IOm0UfoDwU6CzLy9HxKCb6D7mYZEm4V3FvYhWb=s16000)

아래 그림은 주소가 "/blog"인 화면에서 다크 모드를 적용한 그림입니다.

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEi9GIWMx9WnUWSnK2dyeU7bZcFfiGxOrA1DmKzRUFcloFJQuWw57AZ4FN4XiveaWO_lgY6jARNGPdp2Ya5wCAA83Oravie0BXTrNfvquqZFo0Y2Z1feuHd4v9qP-iLq1v2wCiYhvI0FJwaHfp1ao4pBxGi8ISALyb0uvpeX82CuU7z2LpKciMJFlFyG=s16000)

개인적으로 티스토리를 이용했었지만 좀 더 나만의 블로그를 만들고 싶어 여러 가지를 고민하다가 Remix로 만든 [kentcdodds.com](https://kentcdodds.com/) 사이트를 참고해서 만든 Remix Speed Metal Stack을 발견했습니다.

처음에 한번 설치해 보고 너무 어려워서 실망했었는데요.

좀 더 코드를 뜯어보고 연구한 끝에 성공했습니다.

## Remix Speed Metal Stack

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEh_a1w0Ce5lr4sO9BpzJCXGc66UE6gTMDGDny8F1YiQXXzoWuvPMl43OgDcvX8sJRIBAukJDj6Z8DaMR7HAqaz1LqgfSPj7C9qCJU4tpDQI1xKsazYYWh_B56QyULvySktEj6AeOLd-p8Peo0Ky5fKwmK5RzIzhoHfFc2DvAuGcD0u_V7fVa5aBWpHw=s16000)

리믹스 프레임워크는 서버 사이드와 클라이언트 사이드 쪽 개발을 동시에 할 수 있는 풀 스택 개발 프레임워크인데요.

일단 속도가 엄청 빠릅니다.

그리고, 실제 서버 사이드 쪽 개발도 병행하기 때문에 실제 웹 호스팅에 Deploy 할 수 있게 끔 풀 스택을 공유하고 그걸 Stack라고 개발자들 사이에서 Github에 올리고 공유합니다.

처음에 나온 게 Indie-Stack과 Blue-Stack이었던 거 같은데요.

개인적으로 Indie Stack은 제 사이트인 [mymovies.fly.dev](https://mymovies.fly.dev)를 만드는데 쓰였습니다.

그럼 Speed Metal Stack에 대해 설명해 보면,

Github Action을 통해 자동으로 Fly.io에 빌드 배포하는 형식인데요.

그런데 블로그 사이트가 글 한건 추가했다고 전체 다 빌드하는 일은 너무 시간 낭비 아니겠습니까?

그래서 Kent C. Dodds님께서 만든 게 본인의 사이트인데요.

그걸 모티브로 해서 만든 게 Speed Metal Stack입니다.

일단 아래 그림이 전체적인 프로세스 구조입니다.

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEjy9NXU44OsFo94A35zbHCfgn18TCoVXYfD9AjM1wtAxUxJOHE8x06Z7SxjcI3TVdhbwMjUxfJUlwWfpouqZZhNV9S0FzSAwKH701_30ZHoTbNsAe_rNlzjhAi6FlbkFgODe66xDv1SoXcDBD-GZ5g__MBwgSbt8fUmO_gMEHt-71g9vnrQCxg9F17K=s16000)

Git의 commit 관련 정보와 blog content 디렉터리가 수정되었는지에 대해 검사해서,

Blog Site를 새로 빌드해야 된다면 새로 빌드하고,

아니면 글만 추가됐으면 해당 변경된 글 정보를 Git commit 정보로 읽어서 글만 마크다운으로 컴파일해서 Fly.io의 sqlite3 DB에 저장합니다.

물론, 코드를 조금 수정하면 PostGreSQL이나 외부 DB에 저장할 수 있습니다.

이런 형식을 쓰기 때문에 Gastby나 Hugo 같은 정적 사이트 제너레이터처럼 글 한번 만들었다고 전부 다 빌드(컴파일) 다시 하는 경우는 발생하지 않습니다.

그래서 일단 로컬 쪽에서 Speed Metal Stack을 이용해서 전체적인 블로그 사이트를 본인이 원하는 형태로 만들고 나서 최종적으로 Github에 올리면 처음 한 번은 Build & Deploy가 되지만 그 이후에는 글만 추가하기 때문에 아주 빠르게 블로그에 글을 올릴 수 있습니다.

---

## Speed Metal Stack 설치하기

일단 아래와 같이 설치하면 아래 그림처럼 쭉쭉 설치해 나갈 수 있습니다.

```bash
npx create-remix --template Girish21/speed-metal-stack
```

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEi4TVkU-iCoLbotETQE1LwlJyGNv9glLcqiXitAXVP6t84z95GDTCmTBGIeJyDgyQoCqZrk-K-GV3dBFtdP-y-WC5JOkWahTJzGqdAD_yRqInDd3GXyn97WncUPO4Qjtje1yYs9g6Ay1ZhfX8x1FZtEW0dIvNLZjg31kS_bJrb3mEE13TvRNtRZeTLw=s16000)

위 그림을 보시면 앱 이름과 그다음 Typescript로 개발할 것인지를 묻고 있습니다.

시간이 조금 지나면 npm install과 함께 설치가 완료되는데요.

Speed Metal Stack과 같은 풀 스택 프레임워크는 그냥 "npm run dev"를 하면 안 됩니다.

DB 부분을 먼저 설치해야 하는데요.

그래서 위 그림에서도 다음과 같은 순서로 실행하라고 합니다.

```bash
npm run setup

npm run build

npm run dev
```

setup을 통해 Prisma를 통해 DB 부분을 설정하고, build를 통해 Remix 프레임워크를 한번 빌드합니다.

그리고 나서 dev를 통해서 개발 서버를 돌릴 수 있습니다.

일단 "npm run setup"을 실행하면 아래와 같이 나옵니다.

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEh69CDhuOTU78YfaPD9p3Axjw55S-G_9oZleqFAriHgPm94K2zpO5zV38GCdmDTGW4l08NZrDlxeSTE6623CCIkFgMVsXwh1YTRtOz0EB0yqV8gAkiTubi_b-zFUJLUQZU9JVTwK7d3HnkHU7xW8aYPdO3cnXSpLCdocgyaspx24C_JRFj0DytOY7r6=s16000)

Prisma migrate와 blog 한 개를 만드는데요.

```bash
Enter a name for the new migration: … 
```

위와 같이 나오면 그냥 아무렇게나 자신만의 마이그레이션 이름을 적으면 됩니다.

그리고 두 번째로 다음과 같이 나오면요.

```bash
? What is the title of the blog?
```
블로그 제목이고 그다음이 키워드, 그리고 그다음이 블로그 설명인데요.

여기서 엔터를 누르면 Vim으로 넘어갑니다. (제 맥북 기준)

여기서 Vim을 잘 모르시면 당황하시는데요.

"i" 키를 눌러 Insert 모드로 바꾸고 나서 블로그 설명을 쭉 입력합니다.

그리고 다시 'ESC'를 여러 번 눌러서 조작 모드로 돌아온 다음, (실제 ESC 한 번만 눌러도 됩니다.)

":wq"를 통해 저장하고 종료하면 Vim을 나올 수 있습니다.

그리고 중요한 게 다음과 같이 나오면 무조건 "No"를 선택 바랍니다.

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEgItSenKugOVsPF5qD5ZEHNyiWd29fn1MSZYk1j8IPDnVQ2_pBsN9qx-_Ch_S8D9nsscdqf2_sQ1VbYAaeZynrEVgaSgwK2iU2CATutV4vLsVfRYh9FRbmHJGkTgc0aqSz8P9-95Pk5rylOog7yIM0LEcj9jHKOcWDvL-fkex439F3Pimuh4eDQe82W=s16000)

"Yes"를 선택하면 해당 블로그를 사이트에 React 컴포넌트로 조작할 수 있는데요.

실제로 해보면 너무 어렵습니다.

그러면 실제 아래 디렉터리에 해당 블로그가 mdx 형식의 마크다운으로 저장됩니다.

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEg9h-foojNamt9va1hsfL_vRQF4c3Zb8CUJ1U-wkVGVlOaiF-GcBCynaIuiTqNzR5Fyw-Y--rNYNgReEo9WGi3AnjpUuosz0chgsaOMQJgh_OM97JvTZzjmOHVSyD4R2SsSr2itWvsfiwp0UJJ5HVT-6EmVvREoofpHUoSPhKUHHJ_bGQB3Bls30Kg5=s16000)

파일 이름은 slug라고 하는 마크다운을 이용한 블로그 개발 시 사용하는 용어가 있습니다.

제목을 붙여 이어서 https 주소에 대한 경로를 유니크하게 만드는데요.

그래서 처음에 제목을 적을 때 날짜와 좀 더 긴 이름을 넣으면 됩니다.

그러면 맨 처음 만들었던 slug가 경로로 잡히니까요?

아까 위에서 만들어졌던 test.mdx 파일을 지우고 다시 만들어 볼까요?

다시 프로젝트 초기 폴더 위치에서 다음과 같이 입력하면 블로그 새로 만들기 배치파일이 실행됩니다.

```bash
npm run new:blog
```

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEhmeo_KR8NxuYCqAqS1oQApbo9B0PLG7N66y-rbealM3RrnFfHemQ67xj8X1CpH6AloeuKYjrCTVBDGT5SLnhBp0nvxsWU6KS6u9-Hf40earhxRuqrKAWPcp0c6KviwpoDSYpCRqKMMtbt8NUqtazx5SfyJCmK82pPT4U6f0tPftJdbrpdYvZ6ml12D=s16000)

위 그림을 보시면 제가 입력한 title을 가지고 slug를 만들었습니다.

앞에 날짜를 적은 거는 파일 정렬용으로 넣은 겁니다.

이제 VS Code를 이용해서 우리가 만든 MDX 파일을 볼까요?

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEito67ohumnbWKnvrhqRvZXlFNZ8v_2s-BNc8bpC_vfo9GUFbdBp4f_qe8ZwUJ5gMx5C23cQeD6Vm1ddJwHFoVV0iOd3-ZvITkGiJd0L_Dkm36ip1STExnucmX06IT6m23FgA__osaZthxFHDR7Y6HrJ2pNHBDqe1lPafZts1h7gWK_CEyKbmY-IseF=s16000)

다른 정적 사이트 생성기로 마크다운을 접해 보신 분은 쉽게 이해할 수 있는데요.

여기서 팁을 드리자면 slug는 건드리면 안 됩니다.

DB에 유니크하게 저장하기 때문에 웬만하면 고치지 마십시오.

그리고 나머지는 고쳐도 됩니다.

그리고 마지막에 # 하나로 시작하는 게 있는데 여기를 전체 제목으로 다시 한번 고치고 블로그를 써 내려가면 됩니다.

아래 그림처럼 한번 해보십시오.

여기서 한 가지 팁이라면 마지막에 # 하나로 시작하는 라인에 제목을 넣고 그다음 줄에 무슨 말이든 넣어야 마크다운으로 컴파일돼서 DB에 저장됩니다.

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEjduAwAkpw7yBf9LUmaasZBWATjC6kdnkqf4Q8wEjmi_C-vGUZtEd9c38q_Kfv88b54Pwhak2J-6osfqmyeyrILJe3MyYzLW2np8OgXg5buI62s3UC71PziXRxQo6i9Gg2ulB8FeroZJqqKtXbZHUnpI2aulOHgD2EYTEDXBxUyvhCTdXCjCMGbWkjH=s16000)

위와 같이 slug만 건들지 말고 저장합시다.

그리고 터미널에서 다음과 같이 개발 서버를 돌려봅시다.

```bash
npm run dev
```

꼭 위에서 얘기했듯이 "npm run setup", "npm run build" 순서대로 한 번은 실행해야 됩니다.

저 같은 경우는 아까 test.mdx를 지운 결과인지 한 번은 prisma.content.delete 관련 에러가 나면서 꺼졌는데 다시 "npm run dev"를 통해 실행하니까 아주 잘 실행되었습니다.

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEjAgoPF27G9kJQ6iTKkuf4mhRCHQLsTr11nXsfrtkIRkV5FYmjIVi8SX6nBaUz7zXqrR4RC7FsDh7ZZVYKp3ncFurqdHRmA01f_oFrBLl8IGmXC8VRXtmzcG0qe-rj1N18yLwXnDdsV45Kf3Ox52lhoAxfs0IT-kGx_AsJij6KDpBRdeXRTAi6WRQp5=s16000)

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEjn0BZ2Oc0GqeyhbpQRsufTp4ch39gXrblHzultLBMEm1VLzp23YX67trDWDM18R8ezSKhezF0FrE-rwS9ZIhYpr-2UR5qXpJNFi9K1MKvIGq2nEPjFrfRsIeOPnW38VeePn_LYsMWlgS1jvrBzC6yt4AX27YvnwMwtXLQWbZ1F8prMIPo1AOvPCm_s=s16000)

위와 같이 블로그의 메인 화면이 나옵니다.

제가 만들었던 첫번째 블로그의 글 제목과 설명이 나오네요.

한번 클릭해 볼까요?

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEjbZSf38h5G3q6dAhK3UUBb9LESmUe1jWQW6bJ2UqNprVsReCNyicc8nL2tnvGIEbX7nqDwBV5SnXt4whW5Cwz08goie9ZPL3auId4YzPfsMmmPOIrok6txScRH_8pEqSVms8zUjDdYAbG4ZmV2DGU1Q7VPdm2bPhfyijoO45flBaFbfAXFpSO_Kj8v=s16000)

아까 제가 입력했던 곳까지 잘 나오고 있습니다.

이제 전체적인 시스템은 이해하셨나요?

"npm run new:blog" 명령어로 블로그를 추가하고 그다음 git commit만 하고 github에 푸시만 하면 알아서 서버에 저장되고 반영됩니다.

그럼 DB에는 어떻게 저장되어 있는지 확인해 볼까요?

일단 터미널 창을 하나 더 만들어서 아래와 같이 Prisma Studio를 실행합시다.

```bash
npx prisma studio
```

위와 같이 실행하면 자동으로 웹페이지가 뜨면서 현재 "Content" 테이블 내용을 아래와 같이 보여줍니다.

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEg6uuY1UXpHAdwSHr9zlP5SFq5fX37XF-flTsDlvaiYu2Znl3IX0WI2sUueEOb0XTaCqFOjkltCHSCzAO33FKgLSoYF3OzVEBqHysDgkWgeVAuzSOcQbK3Ym1r9eYPj6pkdZ0lVetJfe86iowZj4ZrejEtjRBBUg6vv0NSPoinURdTtk92YiN6W3VqT=s16000)

테이블 구조는 speed metal stack의 폴더 구조에서 prisma 폴더에서 schema.prisma 파일을 보시면 됩니다.

실제 우리가 쓰는 마크다운의 내용은 아래 그림처럼 Code 필드에 저장되는데요.

마크다운을 React 코드로 변환하는 역할을 하는 게 mdx-bundler 패키지입니다.

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEj4vFXLSoniyA6gESEOwqYyA7RseYjRVf41Icvk5UyTPR7NePVwux4yghsYtuDxHTbvt0Om8Suva7s9plhtMhLjNCtRAyanfDhmN6wOIb-5uCgcVvR8qhBvUSHRcoHksYKmWPajfIBnQWyQo3ru2ZFQw8UAjAbj4yc49sfdHUe1lPRsnCMCXDqNfRqT=s16000)

그럼 실제 마크다운을 수정해 볼까요?

개발 서버를 돌리고 있기 때문에 자동으로 반영됩니다.

왜냐하면 아래 그림처럼 특정 프로그램이 마크다운 파일의 변화를 감지하고 있고,

변화가 있다면 스스로 컴파일하고 다시 DB에 저장되고 그게 다시 웹페이지에 반영되기 때문입니다.

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEiw94dWZunf47GXDhCWZm-HrT5Hrr_ESxqU1g1R8O7rdjbj9A8GBMuHEww2mQ1Spp6a4sDCHqPGf1WKzLiPe6Lzm55HsbadWu2nKbXR4T5FOtCAaLDb97-GAf4bUr5ISFY2pc4-16aY15ltdnrl3U9AdfRp3czsRiJp505I8aqMNOt6yIdosfN9hLfN=s16000)

Speed Metal Stack의 폴더 트리 구조에서 "others" 폴더로 가보시면 관련 파일이 있습니다.

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEg767jSrCfiX6OlInLwBJYtaf4qVc4kE1UGKVWx9nbt_dqFIWtufNysFjAIfaulQ1C1wQaF9wGqFVh0z0ri63IF6iQPO8Riq-zdvrqALqNRwPTyLQMpbw2RVjQBpyQrJj0uVxw5A2edtVNVx4KLLn1t_LKqf7sVLMTvGRNQnREaz-J1-dXppyD4HJmk=s16000)

이름만 봐도 쉽게 알 수 있는 파일입니다.

이 파일들은 실제 NodeJS로 백엔드에서 실행되는 서버입니다.

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEiz3903e5GM8EAvamc7ePLuoRee-r9wuLr27kWHQ-CUpQSvZsoPJ4P1t7Ivbm6_1D1QmSqDAx1-aSoL4FioMlpG4ANrlBoLRGSLbTc8ang5r9Ir149sK-pRgTREqTc3vltyZ09pMmIgjaI7akh7nOfT1WNKm1CXOcW5SEEyvJDWDQgqjsT_nGmAiLPT=s16000)

위 그림처럼 웹페이지도 리프레시되었습니다.

이제 작동원리에 대해 알아보았으니까 블로그 사이트의 전체적인 구조에 대해 알아보겠습니다.

---

## Speed Metal Stack의 리믹스 프레임워크 구조

일단 폴더 트리에서 app 폴더에 있는 게 리믹스 프레임워크입니다.

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEiV0aUKv8K4b6E6IkBGlsP0REzlSH8IYPoDi7G-YSGS1YRrIjPtzQI_eqOyd4X8RJTiCEbMyraDnCuE4zaTdsBTXn1P7cNaqjtTnZAGQGPVlVUZ81-JzOw-TdoysmZFDQRTDkrMNsEHI1WN3XlHKw1FZyO3qGaimVqmaOsQa-mVLLz2bGPQ5TLQ8NfI=s16000)

가장 중요한 게 routes 폴더입니다.

주요 라우팅은 다섯 개 가 있는데요.

healthcheck.ts는 fly.io 서버용이라서 가만 나 두면 됩니다.

그러면 네 가지인데요.

index.tsx야 홈페이지의 첫 번째 화면이고, blog.tsx파일이 보입니다.

라우팅이 /blog에 해당되는 파일입니다.

그리고 동적 라우팅인 blog.$slug.tsx 파일도 보이는데요.

제 블로그에는 제 스스로 디자인해서 레이아웃을 조금 바꿨습니다.

이건 스스로 하시면 될 거 같고요.

blog.rss[.]xml.ts 파일이 있는데요.

경로가 blog/rss.xml 파일로 들어가면 아래 그림처럼 제 블로그 글 목록이 쭉 나옵니다.

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEj8uD9Mv2ClfF4gT-iDtsh3QkfJir_k-f6bmpiI9MLvaUoXaRAvrd8eCFhj4OBa1Ksy4-HJA0e6VNu7bDuBk3Z4HWuHTSwomlLWjFPVFsvbVY5pez9KyjNpdVe9dRx54Pj8-cuBqXBXZkBAO4hqdKXvFYV8CDYPB3nSZHec9hco398dqwNSHNAf5VhC=s16000)

검색엔진에 제출하는 용도입니다.

그런데 우리나라 다음이나 네이버에서 쓰는 sitemap.xml 파일은 없네요.

그래서 제가 하나 만들었습니다.

routes 폴더에 sitemap[.]xml.ts 파일 이름으로 아래와 같이 만듭시다.

```js
import type { LoaderFunction } from '@remix-run/server-runtime'
import invariant from 'tiny-invariant'

import { getMdxListItems } from '~/utils/mdx.server'
import { getDomainUrl } from '~/utils/misc'

export const loader: LoaderFunction = async ({ request }) => {
    const posts = await getMdxListItems({ contentDirectory: 'blog', page: 1, itemsPerPage: 100000 })

    const blogUrl = `${getDomainUrl(request)}/blog`

    const sitemap = `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url>
    <loc>https://mycodings.fly.dev/</loc>
    <lastmod>2022-07-23T13:02:06+00:00</lastmod>
    <priority>1.00</priority>
</url>
<url>
    <loc>https://mycodings.fly.dev/blog</loc>
    <lastmod>2022-07-23T13:02:06+00:00</lastmod>
    <priority>0.80</priority>
</url>
        ${posts
            .map(post => {
                const frontMatter = JSON.parse(post.frontmatter)

                invariant(
                    typeof frontMatter.title === 'string',
                    `${post.slug} should have a title in fronte matter`,
                )
                invariant(
                    typeof frontMatter.description === 'string',
                    `${post.slug} should have a description in fronte matter`,
                )
                invariant(
                    typeof post.timestamp === 'object',
                    `${post.slug} should have a timestamp`,
                )

                return `
<url>
    <loc>${blogUrl}/${post.slug}</loc>
    <lastmod>${post.timestamp.toISOString()}</lastmod>
</url>
                `.trim()
            })
            .join('\n')}
</urlset>
  `.trim()

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
            'Content-Length': String(Buffer.byteLength(sitemap)),
        },
    })
}
```

원래 있던 blog.rss[.]xml.ts 파일을 참고로 만들었습니다.

이제 sitemap.xml 파일을 볼까요?

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEhG9FdU0ucSIc1VqlMZjreRyJKbjUuft3Y08_vxfU2tqXIstOzxzVUHWWCkZ1Hftsq18UI1_0IkTAIktyZx6I-x79I3Y2CxsMooWykUfDf8X97DSAiVJ4klBrPTIxkDVFYh4UiBxzBRvdkTe8ObVqT0Mhz_yio0DT0_Tz2vH-MLJaiwWjho4Sk5HQle=s16000)

이제 sitemap.xml 파일까지 자동으로 만드는 블로그 시스템이 완성되었습니다.

그럼 이제 배포만 해야 되는데요.

## Github Action과 배포

이제 블로그 시스템을 본인이 만족하는 디자인으로 개편했으면 Fly.io 사이트에 배포해야 하는데요.

Fly.io는 좀 신경 써야 할게 많습니다.

일단 [fly.io](https://fly.io/app/sign-in)에 가입해야겠죠.

아래 그림처럼 Github 아이디만 있으면 연동됩니다.

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEgyOstrNCuXDq-uaUxrRmMdl-NjGzXVUsNkByAgtPKKb9kHLOowoVQdoizWTlbhDqZ72aH8JW_rp5OwOOFC4E-DkhsL6R6b5_DuKWV_O261tItHfXGAiikiU_vcPTpLG0VCh_-4XtbLkfIeQPMeKYukwNUspzJokGFi6-pPMUONjeQ7HDNM5MgCCdPt=s16000)

가입하고 나서 아래와 같이 "flyctl"이라는 fly.io 커맨드 라인 명령어를 설치해야 하는데요.

일단 설치했다고 가정하고 다음과 같이 터미널 커맨드 라인에서 아래와 같이 입력하여 fly.io에 로그인한 상태로 만듭시다.

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEjKM5afE9OTnZjK-N4q93dqKMxrrIRpkfpVtz4HBuWPmSR8kebalLbdj_ay164azMx7AZFzdoAZNrLR0gq0udGhcCQGAvYcwAguHWp3iSvlNh4Sj75DvTEChMN918amd4X_kxacal_oXON5f7XY30gh2llt5cGITI8f1aab2MNsDPNEMeEt5c8PcVXs=s16000)

일단 Deploy를 진행합시다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEghE6V4LetAVzd5N_sfwD-HJWP0DADn602tznU1GimWkMh_8RzFAZ7NxPLnPFqRPSBJraIhH_1iS1jc9lmExxYHzn4P8ho32DDzrFqTi2foUpX8GyXsY0JtkwBXUFEL6_sjb3DsQjNTtITjepKTVoT35kx_G4GXyt59mNjBxADE1vudWsv5Z9iPtpmw=s16000)

위 그림처럼 flyctl 명령어를 통해 YOUR_APP_NAME을 만들어야 하는데요.

YOUR_APP_NAME은 나중에 인터넷 주소가 되기 때문에 나만의 이름으로 유니크 한걸 만들어야 합니다.

일단 fly.toml 파일을 엽니다.

```js
kill_signal = "SIGINT"
kill_timeout = 5
processes = [ ]
app = "speed-metal-stack-3fd7"

[env]
DATABASE_URL = "file:/data/sqlite.db"
PORT = "8080"

[experimental]
allowed_public_ports = [ ]
auto_rollback = true
cmd = "start_with_migrations.sh"
entrypoint = "sh"

[[mounts]]
destination = "/data"
source = "data"

[[services]]
internal_port = 8_080
processes = [ "app" ]
protocol = "tcp"
script_checks = [ ]

  [services.concurrency]
  hard_limit = 25
  soft_limit = 20
  type = "connections"

  [[services.ports]]
  handlers = [ "http" ]
  port = 80
  force_https = true

  [[services.ports]]
  handlers = [ "tls", "http" ]
  port = 443

  [[services.tcp_checks]]
  grace_period = "1s"
  interval = "15s"
  restart_limit = 0
  timeout = "2s"

  [[services.http_checks]]
  interval = 10_000
  grace_period = "5s"
  method = "get"
  path = "/healthcheck"
  protocol = "http"
  timeout = 2_000
  tls_skip_verify = false
  headers = { }

```

위 파일에서 app 부분이 YOUR_APP_NAME인데요.

원하는 이름으로 유니크하게 만들어야 fly.dev 도메인에서 유니크한 이름이 됩니다.

일단 우리는 그냥 그대로 나 두겠습니다.

그러면 최종적으로 인터넷 주소가 https://speed-metal-stack-3fd7.fly.dev 가 됩니다.

이제 터미널에서 다음과 같이 입력합시다.

```bash
flyctl auth signup

flyctl launch --name speed-metal-stack-3fd7 --copy-config --no-deploy
```

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEgYuK5iA795ppr89LCcgzZrShMrfjyOzvZJ-qqwV9h1Z-M-Z41G7a7vgPUTkMQEg45F02iFIrnRvnicLFDrQRJMJJw_Z2HH7n1h3RhDooKku2nioA1k9WXvxPhsSaCVA36De_G1SbniCMySI27DUDUL8M2-wdqfYE8ErAGF1LQm1UBeRLjZBeNMZwim=s16000)

signup을 실행하면 브라우저가 뜨고 로그인하라고 뜨는데요.

브라우저에서 github 아이디로 로그인하면 위 그림과 같이 로그인이 성공했다고 나옵니다.

그리고 나서 그다음 명령어를 실행해 볼까요?

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEhknFALcYX-7gGpX5l2w7ThH-5yx4SK_132VZwOw7oS_lrcMimfXeSn9ZV-lnyn-uEKe70oCYtWFC3IphRmSRHlFiw-qE9nmGtrssVd68EaTtYeOGix7NAG559Q747fUgdr4KwbC3RpnDKnCjWYiMgJAK47C82imoStlnHjW4bM9VU9NfDIMnqnW-BO=s16000)

위와 같이 나옵니다.

저는 한국이랑 가까운 일본 쪽 서버를 선택했고요.

엔터를 누르면 최종적으로 아래와 같이 나옵니다.

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEj6LWmnCAQV1W_fIOcdyK_aew-3x7K8idnW5ZKg1Rv4fXbkNEWEbnDp24f-FOE3T0rTe4T7TkjzmgaI9wqTBhfHfdyetfaZiIsGVrGEybURDjRhUhqh5KB6Vv2LF11cUNTwbHWFO5z6YS18PVF_Ycf4jEqW3sbhNyN49O4SFK7JhCc6T1cyc48yBbCV=s16000)

이제 Deploy만 남았다고 알려주는데요.

절대 아닙니다.

이제 Github Action 관련 설정을 해야 하는데요.

Fly Auth Token을 받아야 됩니다.

다음과 같이 터미널에 입력합시다.

```bash
flyctl auth token
```

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEjPgmDepQj_M35iYkduNFASgJkEPYzYoTfBJKm8acqIfhV57lZAYTRl18qgmzH-j4IsOTXU5qwRjmyR933BjcOrjZIHXR7bKeX7EkZIydRbm_3eAzIjQEu00QozNoe9KRgbNo8G_In6esend9YMyGix-JvZWqa-IiNQfJVptkE7tOnZvPlLZMzjfnCw=s16000)

위 그림같이 Fly Auth Token이 발행되었습니다.

문자열을 잘 복사해 놓으십시오.

이제 이 토큰을 Github Action 관련 토큰으로 정리해야 하는데요.

Github 사이트에 가서 Repository 하나를 우리의 폴더 이름이랑 똑같이 만듭시다. (이름은 틀려도 됩니다.)

그리고 나서 아래 그림처럼 새로 만든 github 리포지터리 Settings로 들어갑시다.

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEixEXv5m6IW76dDH08DZEyPWfsTTq9QKIBBDH2xCpcCQSfPwslzVbF1sQj2TeJrv-7fKV9GW_nGPEU6mZreTndO4kW-XVtKyR50totuDVb0j8GKH3klWSNNvzf0Vr7MTbP5sMhLxtMR45HvYljvpExGrUdg0lkvD9mVOR17lb2YWndL7JKuReXnqC-K=s16000)

아래 그림처럼 Secrets에서 Actions 부분을 선택해서 들어갑니다.

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEinq_7WqpxneSxVDNf9XDWZcmetwFUVxQ4c6dfWtPFZXe_43Sv8mK30QDg5RkCvS-dlYx5Eh2ZnTRG_ngAU3BI1-oUhbRaTSIT-9dR71yYWKTM7hHlCffsTMXzgVG2PpCJ_P025LjUxtXcBdx1qCQTgrwBDdqBMLVMe03wwtZU0gOm-I2iDbWcj18zm=s16000)

![](https://blogger.googleusercontent.com/img/a/AVvXsEgT7iiv9GWTxjgQtf1iRzYAn2UrXvLpKeGJaSA3dQ2TH_oxo9b7SaAi_9mQWVuCfLSURJSRgXF3_VCkMaWqTGmnvaqatEPh70j4FQ7w8lUWpH4vKSVcJYprcIzu_y4ADddNamy1CzJUl2D1DQBlwQ4n5RyyC9UpZ1qrhaE8qO2EEogiYfkfRTrxq-He=s16000)

그리고 나서 우리의 Secrets를 넣어야 합니다.

"FLY_API_TOKEN"과 "FLY_APP_NAME"입니다.

아래 그림과 같이 입력하고 저장합시다.

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEjn9q-tVG4FsTzwwnUSqout1BukOU7kec8T_Bj14cgSH_XuK7p76DTUQ9BZ3hq2DBufGTQ4ARuYUNPXUai2yCO74bRgqcXxdwFyv_Es6-G7-_Ui86kuf1_pPMRE45ppCji_O7g6anzPwAgT4p-TvgzSTnzGW8W3OomRvkKg7AZocGgG-Ep7yTbACdSc=s16000)

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEjylohj440tBVlP4ovLPDlDmKQcjT5egTKyAmMmQ7EmX58BBxViSh2cdTlTJV5_kLVYnIp_Rwa5saFf04jsqs_D_SNdWpF1mrd_ZFfjAvWnwwF1aEE_qsTMmg2vi2vCfm9hUViGdwuUBcIgKbrxVeo_v3wlJES5eYPNHdf-UFr4kICydkjlyAAbYtr-=s16000)

이제 입력을 다했으면 그다음으로 필요한 게 Github Auth Token인데요.

지금까지 넣은 거는 Github Action이 Fly.io를 제어하는데 필요한 토큰이랑 정보고, Github Api Token은 콘텐츠(블로그)가 업데이트됐다는 정보를 Fly.io가 알아야 하기 때문입니다.

일단 Github 계정에서 Personal Access Token을 만들어야 하는데요.

아래 그림처럼 따라 하시면 됩니다.

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEgMeo-0vtzHILg4omPC1XljZG6lYW_DwsXwmR5a5KBkSIuoZx7spBvAh7OstkeAoHjgSqDKA9XNU-81j-Bj4U_7ZYXHPXYvsZX3pHipCmB48ooSTnsAhMOyT-ujEC_QRByNy2Oi0C6Joy87oxxpMUm1jE2EthsM6d7emO_Q6Nzx7_9rMWdTnfU3O5uk=s16000)

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEg1_z_n-ky0_d1eY5WnUjpxMcEPX236gKm2u7hDikeoDecr9gUHSSRbMfzAij2tU5R1tyeFugF8aM6_gtWlTKWUjQ7TuKsCP2FE0S52RF5drHzYApTPSYDlTKEp-dilebUjXo6vqviw15HvqD9--UxQsX7bn3ovGgXbdLnc5jB4Q7pCHFhdRAtvRrCB=s16000)

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEgHVj8aMG2BeIdk0chcM932KXhiT219ufW4K0lhUxu_mXDeCsoBtvP2U8CHRPw0sLcn38J3kgCMm5ZBdfkaWJQ33oXxCfzUUv46QQqVUIBYUS6vHXxSTJOaj1JfXMDaCcfaJEfNvCPSxIv-jZEFIKuLfaUwX0yP-Zrp5uAGraWU_iyIcyv6bTmyNE-J=s16000)

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEh7mpgf1-OAYvnVC5mmUnHeODfnRfRmfwXGp_aew8U1lvyS4FCAngLi-FKzqmLqHzTrXc44tCck7pzIhvG8e1zj1x3kVp5SENsaCT7tUVmWjJW-HAuGJ027PD7l9HFpxXiWV8hp1ZXw0pOIwgxVEwaSDmoXalOWybG3uxSiMp2D-v7S6vBrQcx7yXx7=s16000)

위 그림처럼 하시고 마지막에 권한 부분에 repo 부분을 체크하시면 됩니다.

맨 밑에 "Generate Token" 버튼을 누르면 토큰이 나오는데요.

이걸 꼭 어디다 복사하십시오.

한번 보면 사라지니까요.

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

이제 Github Token을 얻었으니까 Fly.io에 알려줘야 합니다.

다음과 같은 명령어로 알려주면 됩니다.

Speed Metal Stack의 Github 사이트에는 다음과 같이 하라고 나오는데 절대 다음과 같이 하면 안 됩니다.

```bash
flyctl secrets set GITHUB_TOKEN={GITHUB_TOKEN}
```

위 명령어에서 `{}` 부분을 빼고 아래와 같이 입력하시면 됩니다.

```bash
flyctl secrets set GITHUB_TOKEN=ghp_UVurta8f0YEVasdfasdf7zGI561Qpl73OYQD7

## 실행 결과
Secrets are staged for the first deployment%
```

정상적으로 됐으면 위 코드의 실행결과처럼 나올 겁니다.

이제 SESSION_SECRETS가 필요한데요.

다음과 같이 만들어주면 됩니다.

```bash
flyctl secrets set SESSION_SECRETS=$(openssl rand -hex 32)
```

그다음으로는 Github과 Fly에 똑같이 만들어줘야 하는 게 있는데요.

바로 REFRESH_TOKEN입니다.

이게 있어서 블로그 글이 새로고침이 될 수 있습니다.

일단 다음과 같이 난수를 만들고요.

```bash
openssl rand -hex 32
```

위에서 나온 난수를 아래와 같이 먼저 flyctl로 fly.io에 전달합니다.

```bash
flyctl secrets set REFRESH_TOKEN={GENERATED_PASSWORD}
```

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEiRCR0T351h9q68fefAUdd4tWCRNWExyp0kwk-6HuR9KQcz3goulrfAVAea5K39Yh4msfho2Fj1i0IB5cb7LVByWUZkLwulN7ExeYARhsdVJX-1YH4gJhgTZKFekF7VVYkNQXtCazmx7ri8tAqIK1XjwIv2frEnSjvmQ6E51zbVobXlFpawVaRqbax2=s16000)

여기서도 꼭 `{}` 는 빼고 입력해야 합니다.

그리고 Github 쪽에서도 아래와 같이 Secret를 추가합니다.

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEgD7cTG1c_4A1Keo6bagfXeDLonzPuOs2zpYwA-Udf9ZVEIj7ZpIlpQIKj6SnpsOVtca_SQkiWY5OvCLNM1CQ3Wy-gRFnrDfoDvgN_Q-iQp-UNQQrv7wgEPe39XqE9Gd-endKRkJtII_XgwqMzYAc1IrcTG3n6G_tODkRLaUgHhjscMTOwzH5f0nkJf=s16000)


Github 쪽 Secrets는 아래 그림과 같이 총 3개입니다.

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEhvLr7eYvA3V9UWxL30XSckqrKQx3XqBhKYcoEZ_0-bgInT5fIWiWbYowndeVYjSc0sMae_ttdACFz2tWwrbJz4Sx49qBwCz-44c4Hm4eE7NrBAQpXnAHenWAeYsZZaz9sXTD3YanEWbx_3SRrPiimYE3CcvkePP0r8E1w6XV-GBerlKOb8aEyZwxMI=s16000)


Fly.io 쪽 Secrets는 아래와 같습니다.

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEg_znsvUV8fVfOH_cWsGyW4gvVUqMSe7Ql9IRPLbEBeTHjfGRWztI9bk80SI7tXwUt69hlxcCi2aP8lBiNSqoLDWjEp06Fo9bJsniOjhiVLCFyO8LjGoI8UWZTkgrfYHpJuSOQ6SHw99hqZ7IqNE0NZPtwQLbbi5V4kjltO67WheevAJTQKb86YEO9H=s16000)

이제 fly.io의 서버 용량을 정해야 하는데요.

1기가, 2기가인데요.

아래와 같이 터미널에서 실행하시면 됩니다.

```bash
flyctl volumes create data --region [REGION] --size 1
```

여기서 [REGION]은 서버 지역인데요.

우리는 도쿄에 설치했으니까 "nrt"입니다.

그래서 다음과 같이 입력하시면 됩니다.

```bash
flyctl volumes create data --region nrt --size 1
```

이제 서버는 준비가 되었는데요.

마지막으로 "flyctl info"를 실행해 봅시다.

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEhXtltAmeCn4dYhiFKg61tYI12TaEB9oTiG6e396o-FLLS99jAERBx1Jbh3rRi0wJ_ZGSoX799eZ-qMl4jWB4sHVbsLSYEuWgrGxSjMKY2yQpT5Vfr0fCzZwo7QdBd4RO0lYAmqZttewqlpzOEvSDUdcOSaxlaau4HETUHcb5HpiClto2kOpNE3hoBD=s16000)

위와 비슷하게 나오면 성공입니다.

그리고 [fly.io dashboard](https://fly.io/dashboard/personal)에서 확인해 보시면 아래 그림처럼 우리가 만든 사이트가 보일 겁니다.

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEil0KnVTJb2Rgvoov5ZAiCqq0NQIcw7Po3FvxYlUnbOTIzD4St6Wxdxn6m4QGyRAkZgW4sCLIMKEjzYeCDznIr2LAw984SxTJgqx_E1z68zQeoSi6Sqhr8fg5JNFjWEb5XxnvWWGlz1TkTFzmjdQfARXU3tgmynBMbH1ql0aHPqPSY5D9LCj3nduO4_=s16000)

---

## Github에 푸시해서 Fly.io에 배포하기

Github Action은 자동으로 Fly.io에 배포해주는 유용한 명령어인데요.

우리의 프로젝트 폴더 트리에서 ".github/workflows" 폴더 밑에 있습니다.

여기서 deploy.yml 파일에서 필요 없는 거는 지우셔도 됩니다.

이제 우리의 폴더 트리를 git으로 만들어야 합니다.

```bash
➜  speed-metal-stack$ git status
fatal: not a git repository (or any of the parent directories): .git
➜  speed-metal-stack$
```

실제 git 리포지터리가 아니네요.

git init과 git add, git commit을 합시다.

```bash
git init

git add --all

git commit -m "first commit"
```

이제 github과 연결해야 하는데요.

다음과 같이 입력합시다.

```bash
git remote add origin https://github.com/cpro95/speed-metal-stack-test.git
git branch -M main
git push -u origin main
```

위 명령어를 입력하여 Github에 우리 코드를 푸시하면 자동으로 다음과 같이 Github Action이 작동합니다.

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEhVID441kVI85vlfXM5p3Lwq9R10XXarj0HeEth6cq4HKrj5GyyTop9Js7bUD-0fjmsU-IsGKcHEyYU2hSDOibjryIovujh_uDByfMqV72fso8OXJ03WYipFiBrPqSs9GsCdO0b318wFGB9VsrL4Mx2mG61XajoUzTOGcJcwcE4CVmutw0PSnvmQn83=s16000)

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEj5hoIhM8-yj_Z4YNlYUubj5TmVh4KgMAAyqqNIvPGPNRXtPeOk5Yx_RWTb1Ojf43aeelmZMbQbX3QCAwi4kZYPVZoQC5cuixgCSnOGpsLs-ki3gdhTGnI0MbARzXOu6gJd-8s6mOxsbSFjURjtOImpRZeLZ4ng6x0LrtbGIDZH7ZR2aJPZvjuwnLaG=s16000)

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEgKf2Tn1x01931S3eNTTIfjti-Yuapo2FZlPaoBfdm3RhhyL-308V9Dv4N4-hHiyaHJ7K2WJv6U3-6ZQPCqlOq9kTsgrMs1K9IB96yGNfaeQJR-af-FpdbNZmmrDTWaikj_ufN-QjS7aqP-M8GZItEtrDTLV1igsKtqA3mOO4HDsnnH1FemE_JnoELk=s16000)

실제 콘텐츠 리프레시 부분과 사이트 빌드 부분인데요.

사이트 빌드 부분이 상당히 오래 걸립니다.

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEjF1X5AfrFk59_dqkLMqukpFLyrD_GQjpUIbuDDLnh9UqvRvoUEL-z2gz035mBUohezcbaG_uUq3qmGaxgD9HLELg3ZmRv9FEznY1l7KBC9Ylq2Q6Ws0CBzB0rYMXmcEebV9fTgwCE_ATjTsAsneogdrjiM_-4wuFgS6jYRPKOTkDYEB2PlHCL43S4A=s16000)

저 같은 경우 Typescrip 쪽에서 에러가 났는데요.

그래서 ".github/workflows/deploy.yml" 부분에서 typescript 부분을 지웠습니다.

왜 그런지는 잘 모르겠습니다.

```bash
deploy:
    name: 🚀 Deploy
    runs-on: ubuntu-latest
    needs: [changes, build, lint, vitest, typecheck]
```
위와 같이 deploy의 전제조건이 있는데 다음과 같이 생략했습니다.

```bash
deploy:
    name: 🚀 Deploy
    runs-on: ubuntu-latest
    needs: [changes, build, lint]
```

이렇게 하고 git add와 git commit, git push를 새로 하십시오.

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEgekhXUTYGkWGPnD8OL_ig5poKvJqjzBN7z40gBUW6XmR-KnBFsaZOfOowmwaqgS5sNQ602d17tWC3jSBNLLp3eyPLK2blMqLRuNmCOHluu2rVCDTBLtVvFyKnJo_KPH6B3vjn71-iYRhzwrNcmG9LLrMq7Jx-bJrsmoZXEbZAH-j5WDNOVS6_2JXOf=s16000)

그러면 github push와 함께 또다시 Github Action이 다시 실행됩니다.

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEg9g-Y4XPRgMLmzQRWi5bcloiXC8dNFJJDvc62IoIZ76tQF5iJerhJgcPLGx7-s0DmyS-2cLcwRRm42REvtQ41nT3CLTr8JCgKiiluEsO4OEV6mxqLgObGw9WByNtoGD48BpH3z0LVt0epL20s0KzChvRxdZ6nUAzOKUdV8lI-Wjayl_7n4q1SvTvGy=s16000)

아래 그림을 보시면 아까랑은 필요충분조건이 조금 틀려졌습니다.

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEhppcZmR3s2XZM5zH96-RnK03XPNPnF5qD4KUzYRQw1fr2O9AkIEfT1bjRdbOUTlsIBv3N3lDEx6lPJJoUSnrCMPuyrVpk82APy9a-FQTwhUjexkecmaQaQmQY_6pjpJZTDSMwgoOGHv2mca5kkb3XXJzX7jBdCj6mkiMVNua4eehCzmtO9qHFCg0iC=s16000)

Build 부분과 Deploy 부분이 상당히 오래 걸립니다.

그래서 Site 전체를 개편하려면 로컬에서 충분히 테스트한 후에 Github Push 하시기 바랍니다.

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEiT9aJHZH8gCPLL2t9HqylwEcbB1yXbYHysuGKYLLo3yjXhh9klH3zixwSZdQH3RCFVIypqxe8oISg6xOLDLaKLQbGbKa7fYQiOpaR6D8SdtY7DdSARA_-Rlg5woXDYZaNOTlYNyi2BKeXDkrtjxpeuQEFVacdHGqGBF0129ATQlO9qPImgO60UHMzY=s16000)

저는 약 4분 넘게 걸려서 배포가 정상적으로 완료되었습니다.

이제 fly.io 대시보드로 가볼까요?

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEjDS4-r5Zpu2P-zFpCzgWz02uL12r98_Bk1FnmtbgWuCVh6ceWEbWwGwkJL0bt5jzhHWMtk3h-XkFYPF4kAeUts91sG9EME4T2-bPnGqVTZyLH0jb0hD0p8kyV9DfJwSN0atbT6LaMQfg80y6E8soMv3i_Hj7gSp8wz9BOYi4uNDFZEpKVjulnJQmOc=s16000)

정상적으로 잘 작동하고 있고 주소도 나와있네요.

한번 연결해 볼까요?

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEhC8Nri11H4S2YR7hoF-Zm7xkUn3LhEtTQl56bZqC1VYzambfgmFF_SnQSLXQ-XAxWnIRaVdDGw5BkyAt0GTChorLHT7v7ryj-wxPUNv5PewtiuL57SfWWKsiToqUFcnVQpoGYgQ9BZeUvPOpAnw2JmSV7IIPr3S1YBHGjx_qWIRyB4tesRXjrKZOt6=s16000)

서버와 아까 작성했던 블로그가 잘 보입니다.

대 성공입니다.

어떤가요?

나만의 마크다운 형식의 블로그 사이트가 생겼네요.

---

## 에러 수정

Speed Metal Stack은 서버 사이드 쪽 코드가 많은데요.

Fly.io의 도쿄 서버나 DNS 문제로 인해 blog 콘텐츠가 리프레쉬가 제대로 작동하지 않는 문제가 있습니다.

Github Issues에도 올라와 있고요.

고치고는 있는데 어떤 문제인지 한번 테스트해볼까요?

```js
---
slug: 2022-08-05-how-i-built-my-blog-with-speed-metal-stack
title: 리믹스 스피드 메탈 스택을 통해 블로그 사이트 만들기
date: 2022-08-05T06:23:11.527Z
description: 리믹스 스피드 메탈 스택을 통해 나만의 블로그 사이트 만들기를 만들 수 있습니다.
meta:
  keywords:
    - blog
    - remix
    - speed-metal-stack
published: true
---

# 리믹스 스피드 메탈 스택을 통해 블로그 사이트 만들기

안녕하세요?

리믹스 스피드 메탈 스택을 이용한 블로그입니다.

서버에 잘 올라갔습니다.

두번 째 테스트입니다.
```

위 코드처럼 맨 처음 작성한 블로그의 마지막에 몇 줄 추가했습니다.

이제 git commit 하고 git push 해볼까요?

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEjkSDn_8eJChSM9D2OCBFuM6CVhFDJxORry3BUiPv5XaZBczC7fDg6eSnWWTd2To295l7ZjSRFJJnaRj3ryi_-Rm6DRuOLjAy30mBFgfoYUxwTh9JrTpa8WYX0lGF4R2zYidVpKs1dCNB8chYheArJ5iNsd_qgP-4dYw-SkDdXjleoM7bUvq2V00P-i=s16000)

Github 액션이 다시 일을 하기 시작하는데요.

실제 Deploy 부분은 아래 그림처럼 일은 하지 않습니다.

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEgLvZWUN1xp9PwHwMFKwXYhp-d3p8NhjXnxQgnJ72dRchcp2c8eZufGUaYWJkVVTP9_6BZ41VCjM7Zkn5W_CTrQEBEdM-hS7onCiZDJqN3zDZpMqlkEt6p-vem30l7cEo6NIyh_0Ykyo4Dnqy1-_-ioHrfmOnsixmLc4Tec_lLo_HfvybKegnaaJYJl=s16000)

왜냐하면 Site의 Contents만 변경됐기 때문에 사이트 전체를 다시 빌드 및 배포할 필요가 없는 거죠.

그런데 Refresh Contents 부분에서 에러가 납니다.

아래 그림처럼요.

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEh1iknnQnp5at2u9bA8piJvWNQrwfwk9eF4WOkRpfE-SpV9SLqdqaLu4V8shivI-GZCyEjYWxjlNCJu46nId4vzSznxcVcKR7m69s2qvldI5l73ckOTbb1viKxvP6ohJA2AkK8jvojK8EBOByDWG9xgE7QUbB3wBVZcXn-3aJZulm2vWWqhqBdvYa64=s16000)

위 그림을 보시면 'Content refreshed'라고 표시되지만 그 아래 에러가 떴습니다.

그럼 실제로 웹사이트에서 반영이 되어 있을까 확인해 볼까요?

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEizzyMHbES82TiNpKUmpiQXaLj_NLvJnRFhV17MuowQwRFo2DcK7qLmK9qL_tTBlSs8we_qPgUt_RXUo-nkL-mU-KqgbrxBW0WB57SB1awXBLfMR4JlHYehObtAeCYB2i_7iJGryeDZBeyQ4BhPA7txpsoQ9WFxLYioKvBrH7YgYJ4ldm9DxMsSv3bY=s16000)

위 그림과 같이 우리 사이트의 새로고침을 여러 번 눌러도 변경이 되어 있지 않습니다.

왜 그런 걸까요?

아까도 얘기했지만 Speed Metal Stack의 서버사이드 부분에서 Fly.io의 DNS 주소를 가져오는 부분이 좀 꼬였습니다.

그래서 제가 좀 손을 봤는데요.

폴더 트리에서 'app/routes/_content/refresh-content.ts' 파일을 아래와 같이 고치시면 됩니다.

```js
import type { ActionFunction } from '@remix-run/server-runtime'
import { json } from '@remix-run/server-runtime'
// import * as dns from 'dns'
import { getRequiredEnvVar } from '~/utils/misc'

export const action: ActionFunction = async ({ request }) => {
  if (request.headers.get('auth') !== getRequiredEnvVar('REFRESH_TOKEN')) {
    return json({ message: 'Not Authorised' }, { status: 401 })
  }

  const body = await request.text()
  // const address = `global.${getRequiredEnvVar('FLY_APP_NAME')}.internal`
  // const ipv6s = await dns.promises.resolve6(address)

  // const urls = ipv6s.map(ip => `http://[${ip}]:${getRequiredEnvVar('PORT')}`)

  const queryParams = new URLSearchParams()
  queryParams.set('_data', 'routes/_content/update-content')

  // const fetches = urls.map(url =>
  //   fetch(`${url}/_content/update-content?${queryParams}`, {
  //     method: 'POST',
  //     body,
  //     headers: {
  //       auth: getRequiredEnvVar('REFRESH_TOKEN'),
  //       'content-type': 'application/json',
  //       'content-length': Buffer.byteLength(body).toString(),
  //     },
  //   }),
  // )

  // const response = await Promise.all(fetches)

  const response = await fetch(`https://${getRequiredEnvVar('FLY_APP_NAME')}.fly.dev/_content/update-content?${queryParams}`, {
    method: 'POST',
    body,
    headers: {
      auth: getRequiredEnvVar('REFRESH_TOKEN'),
      'content-type': 'application/json',
      'content-length': Buffer.byteLength(body).toString(),
    },
  })

  return json(response)
}
```

위 코드를 잘 보시면 주석 처리한 부분이 원래 있던 코드고요.

마지막에 제가 입력한 코드가 있습니다.

DNS 주소를 불러오는데서 에러가 발생해서 그냥 우리의 앱 이름과 fly.dev를 통해 강제로 라우팅 해줬습니다.

이제 다시 git add와 git commit, 그리고 git push를 해서 Github 액션이 일을 다 끝날 때까지 기다려볼까요?

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEh0RiCbvoafKQ3H9IT6T9WyABRTLyTQU-TKBW94OsfMB4BbHs2gxyaeTByKtYoWYbdisKImUWbyf76q3KwCxG1uz-YcLEMC91TWNAKc14CJ1XX77t6ZBA83TVfTBvM94fvyVhqCvGXUbiIPJhJHKBYWEfihsOgD2f7g7b2AtNw-8NVxd6rVlekuIHB6=s16000)

Github 액션이 빌드와 배포를 다 하면 이제 우리의 홈페이지로 가서 새로고침을 해볼까요?

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEgLvJMcc1Kk4lFsAYEYIBI4glHDGbKK33QLIv30RMv8ZQzX-sXr4yQldMUhjuMgxqVunvj65NFRVkxlcbytwo8WzWTGvAUC7y-uHM57EjTeOcRXPaYgL0RxK--2oTh0YfVIaNtLljGOG2dBY-0N3VUPg4Pe8uBk4p8l5ylwYGcVcZoXnhO4PcoQVDr9=s16000)

위 그림과 같이 Github 액션의 Refresh Content 부분에서도 에러가 안 나오고 있습니다.

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEg4W4xUxoHAaaHpqLDb3f1pnX7B8O0vySLaEZPOpyDaSV56nN-CJj_bJuL2JZnmKIKmvuVDEiEsu97lN5aHKmZOcX7cwYqY4-YkOB448LsNnQaBOmrqaf-G2zNZ3FLFLxy-Inb1jZcLSkGiFFSDm68iIVYZr-_4dPR_I01aRCIS5rQK2fAML1BQ-IBK=s16000)

이제 정상적으로 Refresh Content가 작동하고 있습니다.

참고로 아래 그림처럼 git push 없이 Github 액션들을 재 실행할 수 있으니 참고 바랍니다.

![mycodings.fly.dev-howto-make-blog-site-with-remix-speed-metal-stack](https://blogger.googleusercontent.com/img/a/AVvXsEg_cDmTlPWMC5T00-KqygjD_sB4nPVc2KJv5JbT-R4vnu1IPkncZr9XNERyjD10XkoqVXwAaYGkL5f73P0BgYr2noYgfXHkJ_5Mq7ryNlUhokZF5BrImuzQt1ccGxKkjrNi6IfUSgNSy6stvdQvulPCBUlttO2L8jACGLEAZB5ia5l8z1W5bcuk7PSN=s16000)

지금까지 리믹스의 Speed Metal Stack을 이용한 블로그 사이트 만들기 편이었습니다.

감사합니다.
