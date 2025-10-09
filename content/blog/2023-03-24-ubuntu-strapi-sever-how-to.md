---
slug: 2023-03-24-ubuntu-strapi-sever-how-to
title: 오라클 클라우드 Free Tier에 Strapi 서버 설치하기
date: 2023-03-24 10:38:38.786000+00:00
summary: 오라클 클라우드 Free Tier에 Strapi 서버 설치하기
tags: ["strapi", "ubuntu", "oracle"]
contributors: []
draft: false
---

안녕하세요?

오랜만에 포스팅하네요.

요즘은 계속 사이드 프로젝트로 시간을 보내느라 블로그 글 쓸 시간이 없네요.

잠깐 시간을 내어 Strapi 서버 설치하는 법을 블로깅하려 합니다.

사실 제가 나중에 보려고 만드는 거니까 이해해 주십시오.

## 리모트 서버에 설치하자

일단 일전에 만들었던 무료 클라우드 서버인 오라클 클라우드에 설치할 예정입니다.

오라클 클라우드에 가상 머신이 2개나 있는데요.

한 개는 저번에 PostgreSQL을 설치했었고요.

좀 더 쉬운 Strapi Headless CMS 툴은 다른 한 곳에 설치할 예정입니다.

일단 오라클 가상 머신에 ssh 접속하시고요.

홈 디렉터리에서 다음과 같이 strapi 서버를 npm install 하시면 됩니다.

```bash
npx create-strapi-app@latest my-project
```

다 설치가 되셨으면 이제 오라클 서버의 Port를 개방해야 하는데요.

Strapi 서버는 1337 포트를 사용합니다.

Port 여는 방법은 아래 그림을 보시면 이해하실 수 있는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgDyWq-WkPR7XSaMsnNPkWj5LPn3290L5K9Xjunejat31mxQ8lEb_ZBolm77fQjtdUrTe6il0G1wUV9W9xCe7W87XtVwg2GUEOir1J3BctvlcYbHiv__6c_fgdmBO0TfDLxE5kQWnedHxCXnWbrtlUMpnvvEu21t47wCRrJTsmMZV1HdDqII16IAqmp)

![](https://blogger.googleusercontent.com/img/a/AVvXsEhOJAwKr9M_Q5eWR0N7Xx24drlfoxPEUlfBRkrLHGVgc97lC2exxPgN37ZxvQiKm4CeOGIlYnvG056yYkUHoqntB6QoUAji48oaaN44LtJyNSkbai5lYnvNF6bVUvrmgEkI0qI8b4NyTMNOcJHOUe26BmRCoNjbx_W_8Ma0YieYFRNv-aqh6pVj82yt)

예전 PostgreSQL 설치할 때 자세히 설명해 놨으니 링크로 대체하겠습니다.

[https://mycodings.fly.dev/blog/2023-02-15-install-postgresql-on-oracle-cloud-free-tier-ubuntu-22-04](https://mycodings.fly.dev/blog/2023-02-15-install-postgresql-on-oracle-cloud-free-tier-ubuntu-22-04)

---

## 실행해 보기

이제 설치가 됐으면 먼저 한번 빌드를 해야 합니다.

```bash
cd my-project
npm run build
```

제가 build 안 하고 제 맥에서 접속했었는데 계속 에러가 난 겁니다.

다시 설치해 보고 여러 고생을 했는데, 결론은 맨 처음 한 번은 빌드를 해줘야 한다는 거였습니다.

이제 다음과 같이 개발 서버를 돌려 봅시다.

```bash
npm run develop
```

그리고 로컬 컴퓨터에서 오라클 서버의 1337 포트로 접속해 볼까요?

맨 처음에 접속하면 admin으로 가라고 클릭을 유도하는데요.

클릭하면 아래와 같이 수퍼 유저 아이디를 만들라고 합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgdrolgQqM-o36tdiouS-3EQ2CgPj3nqkP7DRrH8JDW9eSZHMxACzeNKpCdTx44HO5hvtDcXcc99CcrqUxE7h7D5DlsxaUIoe3XU-uHxRRDbqqSAIKeoCeKPdtJ3kpdBY2Zgp60jfE9XgGdPnd8c1uQTeQEbw5Zjep9p7UTtAXCduHEb-xePQEMs4Gw)

다음부터 로그인할 때 쓰셔야 되니까 꼭 중요한 비밀번호로 설정 바랍니다.

사용자를 만들었으면 아래와 같이 로그인하시구요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjQu6O2gSxI_ueiinUrDzm4X92mgrBZBCFk3KycWFUeaCqgOsOAIZBBS-yOr7MobPmSe3FI4PL-YNcWgQULkXvUIQnKbfaBjvW2YOAlH90fMMo2qNi7TR_3rw9iCHfHfn1hnmlvrSCgwp48iY6FsJWJG_WI9dr4XGnaMW3A03pbj_GlOVxREYRkTqlD)

로그인하시면 아래와 같이 Strapi 대시보드가 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiTEzGpkz6GrYYZI9HVsuWoZUjbNJSrPMyTiT2N1O8fK5PuGRgLRGIP73UhgWHZaXUo9DnmPQ_ihYiRGTFavNGslrINNpf79Rh6xa-_JCsS3xt75e62Y7VDGoE_n5_4LfggXJgHDPxtC0m_kn-lsyf6Ij4L11ToIiAifKMDDy39k1ZM57D2kSM4Ewea)

이제 여기서 본인만의 데이터베이스를 만들면 됩니다.

기본으로 sqlite3를 사용하는데요.

기존에 만들었던 PostgreSQL 서버를 연결할 수도 있습니다.

## DB 만들기

대시보드에서 Content-Type Builder를 클릭해서 컬렉션 타입(Collection Types)을 만들어야 하는데요.

용어가 헷갈리는데 사실 SQL의 Table입니다.

DB는 기본으로 만들어졌고요. Strapi에서는 컬렉션 타입이라고 해서 테이블만 만들 수 있습니다.

저는 Shop이라고 만들었고요.

아래와 같이 만들었습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEimOSbJJsFtqB8g7Ybx5jNdwpNA7ZhpS_SzvZawTtbUJ4wat2UI8GYn8QVHwKpYWRYtndfTLoYByMyzgzIK5o73PK9cgNf0D7ZFj9HtbWtyFUCQRLOVA11yO_quV2Q1hbxINOuxzsOo3CY0PJeKeByyN3olp9cP3gpqc9p-HQEir5_gPTFcwYtnmhKF)

제가 지도 관련 웹앱을 만들고 있어서 위와 같이 만들었습니다.

일단 컬렉션 타입을 만들었으면 왼쪽 맨 위 Content Manager를 클릭해서 아까 우리가 만들었던 Shop 테이블에 데이터를 추가할 수 있습니다.

데이터를 여러 개 아무거나 입력해 보세요.

더미 데이터를 입력했으면 이제 Headless CMS의 진짜 목적인 API 서버를 사용해야 하는데요.

## API 열기

먼저 대시보드 Settings 항목으로 가서 아래 그림처럼 USERS & PERMISSION PLUGIN 밑에 있는 Roles를 클릭합니다.

그러면 아래 그림처럼 나오는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEisQeyFHPptCTftc8mxrG5UavKJmjmYmHe-ddsa1aAJ6fM8HjyaZujw-jc_1-KvW_h2mHqmLg8Lmfl3NHZL2MkuFJpYMA3Q7oBdzprwMFgj9fx7TaKoqzX8qulUvf5PkE8uaQzoVGj6iMYhp9gdTCrQUWE_qRNXhRk7p9By8DCtaFgJ6n6QCy_ZzuE1)

여기서 Public를 고르면 됩니다.

Authenticated 방식은 토큰을 주고받는 방식인데요.

나중에 이것도 공부해 보고 블로깅 해 보겠습니다.

일단 Public을 클릭한 다음, Permissions 부분에서 아까 만들었던 컬렉션 타입인 Shop을 다시 한번 클릭하시면 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiqztglf3PtA_N1Z3DnWRDyJUny6ldC5g2hrjWfVpojAoeX_SvfAxjYqj7rgEcu91CoToylL8jaqUpMMnG-9DP5yCwGFoxLPJyQC01DuEMIkq2oMHAwA_tXX-XEXLbTVVc4IyqurCc3d3nwsbhftEB5nb2xkEfwKt5I-RAqFXnca_eAQQs5O0s4gZaT)

이렇게 해줘야 외부에 API가 오픈되는 겁니다.

이걸 해주지 않으면 API가 접근할 수 없습니다.

## API 사용해 보기

API의 주소는 본인의 오라클 가상 머신의 고정 IP 주소인데요.

주소는 http 방식이고, `http://111.222.333.444:1337/api/shops` 방식을 씁니다.

한번 써보세요.

그럼 브라우저 JSON 데이터가 나타날 겁니다.

리턴된 객체는 아래와 같이 data와 meta 객체를 포함하고 있습니다.

```js
{
  data: [

  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 54,
      "total": 1341
    }
  }
}
```

PRISMA로 Full Stack 개발을 할 때는 findMany 같은 걸로 SQL 명령어 비슷하게 자료를 뽑으면 되는데요.

Strapi 서버는 HTTP의 GET 방식으로 JSON 데이터를 되받아치기 방식으로 진행됩니다.

그래서 POSTMAN 같은 API 테스터 프로그램에서 하는 걸 추천해 드립니다.

## 본격적인 API 사용법

Strapi 서버의 API 사용 방법은 Strapi 홈페이지에 나와 있는데요.

영어라서 제가 간단히 알려드리겠습니다.

편의상 앞에 주소는 빼고 api 뒷부분만 적을 거니 참고 바랍니다.

`api/shops?fields=name`

이렇게 shops 컬렉션 타입 뒤에 ? 를 쓰고 그 뒤에 fields 라고 쓰고 다시 = 표시 후 name이라는 컬럼 이름을 적었습니다.

딱 봐도 shops 컬렉션에서 컬럼 값이 name인 것만 뽑으라는 얘기입니다.

shops 뒤에 아무것도 없으면 모든 값을 뽑습니다.

그럼 fields 값을 여러 개 해야 할 때는 어떻게 할까요?

`api/shops?fields[0]=id&fields[1]=name&fields[2]=address`

이런 식으로 무한정 확장할 수 있습니다.

그럼 찾기는 어떻게 할까요?

`api/shops?filters[id][$eq]=1`

위와 같이 filters를 사용하는데요. 첫 번째에 id를 넣었고 두 번째에 $eq 라는 equal 이라는 뜻을 넣었습니다.

id = 1 인 자료를 찾는다는 얘기죠.

filters도 & 를 계속 사용하여 여려 개 작성할 수 있습니다.

그럼, 관계형 데이터일 경우는 어떻게 할까요?

`api/shops?populates=city`

위와 같이 사용하시면 됩니다.

즉, shops 컬렉션에 city 카테고리를 연결했을 때 기본적으로 shops 불러오면 city 값은 나오지 않는데요.

위와 같이 populates 방식을 사용하면 됩니다.

`api/shops?filters[city][id][$eq]=3&populate=city`

위와 같이 shops 컬렉션에서 city id 값을 조건 검색할 수도 있습니다.

## 개발 서버를 PM2로 백그라운드로 돌리기

pm2는 예전에 제가 티스토리에 썼던 글이 있거든요.

[여기](https://cpro95.tistory.com/468) 참고하시면 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjbc9d9qtU0rhtjupsmLxA9t5QEAiuuBcw3TxR-7YEzkIK4CtFmInw3eAPJq6nBKT52boovg9HeMvKyhQpLxFDbr2SjQaO4DrYoA7WsdqypPNKTR6B1DFuU_x7NW_8RnSYj4-cw3Pr8ai0x7sJOA1zVCaBPLWRXho27356aiYMp9WCdLS92f9_yAfMT)

위 그림처럼 잘 실행되네요.

참고로 'npm run develop'로 strapi-dev 서버를 돌리고 개발해야 합니다.

'npm start'로 strapi 서버를 돌리면 대시보드에서 수정하기가 안됩니다.

## Strapi 서버의 사용 목적

다른 Headless CMS 서버처럼 Strapi도 사실은 Next.js로 웹앱을 개발할 때 정적 사이트 작성용의 백 데이터 저장용으로 사용하는 게 좋습니다.

본인이 직접 돌리는 Strapi 서버를 실시간으로 데이터를 불러오고 하면 서버 과부하로 전체적인 홈페이지의 속도가 느려집니다.

그러면 로컬 머신에 Strapi 서버를 돌리면서 Next.js로 정적 사이트 만들 때만 켜면 되는 거 아니냐고 생각하실 수 있는데요.

오라클 클라우드에 설치한 이유는 Cron Job으로 일정 시간마다 웹 스크래핑해서 데이터 수집하고 다시 그걸 Sqlite3 db에 접속해서 DB에  파이썬 코드를 이용해서 insert 하는 즉, 백 데이터 업데이트를 자동화하기 위한 목적입니다.

그래서 제가 Strapi 서버를 만들었거든요.

## 오라클 클라우드의 http 통신 문제

만약 Next.js 앱을 Cloudflare로 배포했을 때 getServerSideProps로 실시간 통신을 한다면 아래와 같이 에러가 발생할 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhmqExY7ygfx7lSlspVUz0hsbg2P3IywX9UdA2BCqFClkPvX8jnCtHTnWgy7rIvwz9SgsUB7Y4T4wnpUraHmJy-K9U93bVtoNmuuQeDL0rJ9AJRtJ-w7mIsnjEsS8V1eKxlOWZL2MEn9G8S7RsBbJhhzSvwnyLEJVREB4GQ60WFMWyrkLKMTlcorP1d)

이 에러는 오라클은 http 방식이고, Cloudflare는 https 방식이라서 그렇습니다.

그럼 getStaticSideProps 방식으로 정적 사이트를 만들 때는 이 에러가 발생하지 않는 건가요?

맞습니다.

Next.js Build 시는 서버 즉 우분투에서 작동되기 때문에 http에서 데이터를 받아 올 수 있습니다.

그리고 나중에 ISR 방식으로 데이터가 업데이트되었을 때 다시 빌드시키면 되는 거죠.

그래서 Next.js가 위대한 프레임웤이라고 생각합니다.

그럼.





