---
slug: 2023-06-08-how-to-nextjs-nextauth-naver-login
title: NextAuth 사용법 7편 - NextAuth로 네이버 아이디 로그인 만들기
date: 2023-06-08 09:17:18.903000+00:00
summary: NextAuth 사용법 7편 - NextAuth로 네이버 아이디 로그인 만들기
tags: ["next.js", "nextauth", "naver", "login"]
contributors: []
draft: false
---

안녕하세요?

NextAuth 사용법이 벌써 7편까지 왔네요.

지난 시간에 카카오 로그인을 했는데, 네이버 로그인을 안 하면 좀 그래서 간단하게 적어 보겠습니다.

먼저, [네이버 디벨로퍼](https://developers.naver.com/main/)에 가입하고 아래 그림처럼 네이버 로그인을 클릭하면 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEieGFeqKzEexbyPtnFnAXj5wx85VUtgw-0gTAiJVQLj6PUslgB4xKVF9grZ-LE-hvBrPYE37cGBgwI2fkGM9N8IEhmRcYb3jyZhTYvF8aOtvE7NWMM5CjDxV0A00gbxlRemex2AVPU-XCIvYdJ0LVIKFLafuYDR-1aj5rqQ4fj7QWI3WHy91WJilyNO=w640-h218)

그러면 아래와 같이 "오픈 API 이용 신청" 버튼이 보입니다. 클릭하십시오.

![](https://blogger.googleusercontent.com/img/a/AVvXsEj5xEBjkr0ptR0gZYT7Ncy0UXdECxxkwYqrV1WhjP7Yv7DucNSZvnmK6d3Sxad90VwfqT4WgXYfJ_HMKPJyw4C_xme_Vx8fXCQK5QSU49UBC_yKPg1TkdpF7MziGkaLxakXkE1-xF5azjcL8Y9WsFhqH_5XurLwBzDf4qCROOTwXkMA11d9cGBgxaXE=w640-h535)

그러면 아래와 같이 애플리케이션 이름과 네이버 로그인에서 가져올 항목을 선택하는 화면이 보이는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjfwMnNgngpdNjRWUT4HVOb5Y56ZIoeprAzJicGgUXGoSdvdjWhcLvpt1muf0xZzwh_Ta_ilgz46s2YLvPxhHMvIuLfwIJtypPjLJpXIM6ZnK5ppUxJl0kUa2vBiaB941cDBPniH-Vl5WJBms3jCXVnLNKAtN400Jam2WOrVfd1K1xAtLTW-UXIJgZs=w640-h522)

간단하게 별명과 프로필 사진을 선택하시면 됩니다.

그리고 아래와 같이 환경 추가 옵션창을 선택해서 PC웹을 선택해 줍니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjVq3nLceubBqhu0Fz7XjiO34OpievekhwuqlPZoJZuoP3pXJ9RE7K_jABTLGFVg_6QuyowffWI3KejNKk7ySO7b0xv19BTXoq7TAwPMhdYS1UQ89oQ26j9pTBINjQcjIyxWiX1FBWLY_e08OBQKuMVyN-Mw2x9MkbxVKB3iNNtaw9TbR6eQEh5-oUg=w600-h640)

그러면 위와 같이 서비스 URL을 넣는 칸이 보이고 또 Callback URL을 넣는 곳이 나옵니다.

NextAuth의 콜백 URL은 일정한 규칙이 있습니다.

아래와 같습니다.

```js
http://localhost:3000/api/auth/callback/naver
```

이제 맨 밑에 등록하기 버튼을 누르면 애플리케이션이 등록되는데요.

아래와 같이 애플리케이션 정보가 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjBl9JcTgsib2LX9-qlz0-RY1pwUfMtIJcs1f4eCoV2EOtgGIxcZkJWB4DK0m8UHedklohWQSy9Ak3MMlc8mTV3uX1OCVrNBWYT2mjTdwb6DRLEEaZ5CNe5fw1EWRotBCbleDbub45dmf6IkdBGR3cQT9vJkDkZx731yR0sY4n703rydOGoAh9qGpSU=w640-h545)

여기서 중요한 게 Client ID와 Client Secret입니다.

카카오 아이디로 로그인하기에서는 Client Secret가 본인이 아무렇게나 적으면 됐었는데, 네이버에서는 아예 ID와 Secret를 명확하게 지정해 주네요.

---

## NextAuth에 NaverProvider 추가하기

NaverProvider 추가하기는 아주 간단합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEi1U9BKxt2fPsN_Dtv1ysUsNXXk22C8SIwrsJaAcangNcPVV6pDzbnvklFyxCFUrIVdaOusksLls_kr_A5UhGgdR7YBrKx2gnge5H_CC4qQWRYCq83-vqP4o1HRfhNKD_kIse5nYOjFNh0seoH1sUp4UOADpSXxflWYxxwEvOHri_oZl6RkoaHb1m6_=w640-h326)

위 그림처럼 간단하게 추가할 수 있습니다.

그리고 .env 파일에 각각 NAVER_CLIENT_ID와 NAVER_CLIENT_SECRET 값에 아까 네이버 디벨로퍼에서 등록한 애플리케이션 정보에 나오는 값으로 저장하시면 됩니다.

제 .env 파일은 아래와 같습니다.

```js
NEXTAUTH_SECRET=qerkasjhfkauiqeywrhkasjhfksajfh
NEXTAUTH_URL=http://localhost:3000
SECRET_KEY=dkasdhfjahsdfjhskdfhaksdhfakjs
KAKAO_CLIENT_ID=700-----------------
KAKAO_CLIENT_SECRET=dkasdhfjahsdfjhskdfhaksdhfakjsdddddssaa
NAVER_CLIENT_ID=tEy-----------
NAVER_CLIENT_SECRET=Nb------------

DATABASE_URL="file:./dev.db"
```

'[...nextauth]/route.ts' 파일을 수정해 볼까요?

```js
import KakaoProvider from "next-auth/providers/kakao";
import NaverProvider from "next-auth/providers/naver";\

...
...
...

    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),

    NaverProvider({
    clientId: process.env.NAVER_CLIENT_ID!,
    clientSecret: process.env.NAVER_CLIENT_SECRET!
  })

...
...
...  
```

기존 코드는 같습니다.

---

## Login 화면에 네이버 로그인 추가하기

'app/sigin/page.tsx' 파일에 네이버 로그인 추가하기 버튼을 추가합니다.

```js
...
...
...

      <div className="space-y-4">
        <button
          className="w-full transform rounded-md bg-gray-700 px-4 py-2 tracking-wide text-white transition-colors duration-200 hover:bg-gray-600 focus:bg-gray-600 focus:outline-none"
          onClick={() => signIn("kakao", { redirect: true, callbackUrl: "/" })}
        >
          kakao login
        </button>
        <button
          className="w-full transform rounded-md bg-gray-700 px-4 py-2 tracking-wide text-white transition-colors duration-200 hover:bg-gray-600 focus:bg-gray-600 focus:outline-none"
          onClick={() => signIn("naver", { redirect: true, callbackUrl: "/" })}
        >
          naver login
        </button>
      </div>

...
...
...
```

어떤가요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEi7HrtMcK9z0RdME5WuwDT7KdriiJRtVIqSg52H9BA2vSXY4Es378Nf88tnwRP7lANs_hnu3f1Riys-g2SSBTOxPArpIhMagHj7mQ131bDO7_XaEoH1lBD1BdCf0Cj1vqTU54_jc-2lgrwIoUkp16ptZHTMFspTCUXBSuZQZFlVFrYQ6WY-lGXIh6Yr=w517-h640)

위 그림과 같이 naver login 버튼이 보입니다.

이제 클릭해 볼까요?

그럼 아래와 같이 PC에서 네이버 로그인하는 화면이 보이는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEi2bTa61iXqIVkEDn6-R9Huin7Q-YlEjQFsyM8PwZTqzbQc28TUX7X3DhOb1hTtu3qtw0IncADEq_KYCE3Jd991YCzt4y7NVOttGBzs6Qa-QJpGkiq3H38-5Pi8jEqlTGjc-XsyM4jBQJOUkdU-J82aORsMgTwkHNG-QYItCB3wc5wQbIv5Ocgr76xR=w565-h640)

처음 로그인하게 되면 아래와 같이 동의를 요구하는 화면이 나옵니다. 동의하시면 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiy-ugNwZTOLu_4P2mI9SsHoJMyGTPWUUpMFbTYuwJVv9gzX3s8pqoJYWgp2gBtRwWFqoluTxYjrspM39o5V1gXGUJIJOXIJdU7USWcVB9I0jj4Is6mf5N7urr99BGyXuM0GqhUoiWkgQN-2fBC56CkiR8lGTt0koIHj1M3LeDPJ0HF2FyFf8Yg_R2r=w640-h640)

이제 성공했습니다.

콘솔에 log 한 세션 정보를 한번 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEjGpq7uSFUUKALrMG3BBmqx-mh6Hc4DRJKFxhxkcOMcDDGT3r6MfPcRl29hDdIirN-v63YFBLUxFl0n8xL7DZ5Ud5TpVw1fN-OaUzM5kx0HNPhQIZW21pNO6r4LVP_nS5ItbVb2NOxM6kB5aD1E-1ekGXkCSjuZKeXtv8QNUWWbQOb_GKuE1e7e07cz=w640-h204)

위 그림과 같이 제 네이버 별명과 프로파일 사진이 아주 잘 나옵니다.

---

NextAuth에서는 카카오 아이디 로그인과 네이버 아이디 로그인에 대해 버전 3보다 버전 4에서 정말 잘 구현해 놨습니다.

여러분도 쉽게 NextJS 앱에 소셜 로그인 기능을 추가하실 수 있습니다.

그럼.
