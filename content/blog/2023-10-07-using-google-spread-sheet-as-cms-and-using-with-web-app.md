---
slug: 2023-10-07-using-google-spread-sheet-as-cms-and-using-with-web-app
title: 구글 스프레드 시트를 CMS 같은 데이터베이스로 활용하기
date: 2023-10-07 10:12:07.140000+00:00
summary: 구글 스프레드 시트의 Apps Script를 활용하여 CMS 같은 DB로 활용하기
tags: ["google sheet", "cms", "apps script", "google script", "database"]
contributors: []
draft: false
---

안녕하세요?

오늘은 구글 스프레드 시트를 이용해서 웹 앱(Web App)을 만들 때 데이터베이스처럼 활용하는 방법에 대해 살짝 살펴보겠습니다.

먼저, 구글 스프레드 시트로 들어가서 아래와 같이 더미 데이터를 만듭시다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhzp3AWthfOEN3DzTgdjHJqxbt0MpD93nt9Ilq3IOlLfKSM94IHE_uSPpoYoxQHnrCmvCMY8gfflfbShKCPJn1APvehsjPqgh3xDlq5X_boXHnsm2qjlKi7OaumNiYgloKJN9Yey58UEHc47O3LL-CB77sbDEN_t-7PQpIrt2M3xD_qaKjvQfxFpBxtgDs)

참고로 간단한 예를 들어 본 거지, 실제로는 맞지 않는 데이터입니다. ^^

구글 스프레드 시트를 웹상에서 데이터베이스로 활용하기 위해서는 코드를 작성해 줘야 하는데요.

이제 메뉴에서 확장 프로그램으로 들어가서 Apps Script 부분을 선택합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhVQY-KamVLTzmLGT8WLUE-50c6T8wNO_HPR0f8jierWwdG_I7mqx-b7OHseOj9XhhBP2dxx0SWSfTIUQsblJENvvNDfTYGlmryWptWnvcagS8PH5m6hyovYrpR5PGDL8YEEL_nHGcZju4NemPeDaxng5_9WPTGoq6lsjsuY0PF4f-P-0nHoSCoT8I7bN8)

위와 같이 선택하면 새로운 탭이 뜨면서 아래와 같이 나타납니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEideT7lTdF31l5c-7oc5KxZY5TbSZboCmuXidCElh8IsJgdLmsr2xWNqJbJpl3PWBTI8c6tPg03s__OqHAgeJyntZsIJWPr5SRhwmIGw2qAsWyF5IRRK_3ODCehDzdwwn2Y4-P24oIJ_9vJqEMzW4teq3zkj5Vd9h-7kSkft65Ixh57GGK4N_vP1wef8q8)

function을 만들면 되는데요.

Google Script라고 자바스크립트하고 아주 비슷합니다.

이제 우리가 만들 함수는 웹상에서 API 같은 거기 때문에 이름을 doGet으로 지어야 합니다.

즉, Get Request에 대응한다는 뜻이죠.

```js
function doGet() {
  const doc = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = doc.getSheetByName('idols');
  const values = sheet.getRange(3, 1, 4, 2).getDisplayValues();
  console.log(values)
  const result = values.map((data) => {
    return {
      name: data[0],
      height: data[1]
    }
  });
  // console.log(result);

  return ContentService.createTextOutput(JSON.stringify({ data: result })).setMimeType(ContentService.MimeType.JSON)
}
```

위와 같이 코드를 작성하면 됩니다.

현재 같은 브라우저에서 구글 스프레드 시트가 열려 있어야 하고,

그다음 시트 이름이 'idols'여야 합니다.

그리고 getRange 를 통해 데이터를 읽어와야 하는데요.

이 부분이 많이 헷갈립니다.

구글에서 제공하는 문서를 보시면 아래와 같습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEg4W224la2rmEGeRWSThvaErusA4eSY3c_ZpkEpjzwSR7xuPlVXYz7IcEA1mIJSPaWCagWKSM6tKIzxU6tAwT7k96_FhjPfxtGaXVrnNIxEC_4LtzTVSDf4yVms_10oMJBseAHzbiJsFoaglhuDLAaJRO-NTOdyEUAyfsLZY6Qwx117M7yJ5mREhCoIQWo)\

위와 같이 처음 두 인자는 row, column이고 세 번째, 네 번째가 가져오고 싶을 만큼의 row 숫자와 column 숫자입니다.

헷갈리시면 안 됩니다.

그리고 실행버튼을 누르면 아래와 같이 console.log(values) 명령어 의해 아래와 같이 출력되는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEj1He6mpi7g2njdPhoWBoiV97yAYqG01db9qPKegqGnApUDos2RUrfIArIlBXgcdbxrkIJ5jTNYdhbaIpt58SuUrdXxZEgIyH4HRQNb5ZabhU_MtGgo79obkDs6pVWOh74CcPnNNxiArjW_BYz7VmjYSmWcG7tqaHYXGaPMlDoX1mReo82-lqZVfuH_0FI)

실제 우리가 JSON 타입으로 전환해서 돌려주는 게 훨씬 편합니다.

그래서, 위 코드에서처럼 map 함수를 써서 직접 name, height 부분을 지정한 거죠.

console.log(result) 부분을 주석을 처리하고 실행해 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEgdv3XzSZSj6CKrE62KTa-fmuxyqTsrg-AUSjTn9_vFNhT5AUQKe-eYo-RMnzJyJoXsWwt12FZvuLT3YKRqMAMsjY0gI0rqa3P13Gt-qxof3Qbc-8LvFZ8BAVVI4Jnted2i676_sjzUjIPi9zfqCySJEjnlhE3EEsVNpYIB1PaPuDOUbaWOThRroln_cKM)

위와 같이 JSON 형태로 출력되고 있습니다.

그리고 마지막으로 웹 API같이 JSON 형태로 Response 해주기 위해서는 ContentService 함수를 이용하면 됩니다.

---

## 배포하기

코드를 완벽하게 작성했으니 실제 인터넷상에서 배포할 일만 남았는데요.

Apps Script 화면에서 오른쪽 상단의 "배포"라는 버튼을 누르면 됩니다.

그러면 유형 선택을 해야 하는데요.

왼쪽 톱니바퀴를 눌러서 웹 앱을 선택해 주시면 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjewLhTes3fZrHbFyG0W7T0xAA8aPEacJIul5iG9jyl-qZmZcSu7hfDRKvy1Ah585AQiH5I4zYe09dBuL9kDn_eQ66qfFoLZywB01shaaSIjkOxuM6MEs9wpffY7DERCb45Fjckru5EfCEbhR4MN0cwVgw4LSCcSbg3bqBzG5QTMjTceBusXPfGB43SjIs)

그리고 위와 같이 웹앱에 대한 권한을 설정해 줘야 하는데요.

꼭 위와 같이 "나" - "모든 사용자"라고 해줘야 합니다.

그래서 구글 계정 없이 웹상에서 누구나 JSON 정보를 얻을 수 있기 때문입니다.

아래와 같이 하시면 구글 아이디로 로그인해야지만 정보를 볼 수 있게 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiPW2HkxbO4a6siN0GNnMRp7vmhWlei0ml-Qkj1BFZMVSjSSxJEXxSUrKFA3OtSHpmyNgCENi49iMB-FrnneH98SOQjCNOTNmJVL9agMixKDeGvg9UesktnxA98w2mI3lFZxbwdah7Kh46nseDM73R7D5uzT3dnT75HkhvbZRx6gGgstqEpE6luelssw9M)

꼭, "나" -"모든 사용자" 형식으로 설정해야 합니다.

그리고 배포를 누르면 권한을 줘야 한다고 나오는데요.

일단 아래 그림처럼 나옵니다.

여기서 왼쪽 밑에 "고급"을 누르고 계속 진행하면 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjj1FElf8l16qSee-W4Qxu9R4J8siK2QugDYF-M4yAZDKiACMQNq2C_J0R3wXhWQf6PCGWu-AIKAI4eJCANOVwLNXHVLAnr4muFYkp6IPG2hPWd81W_eM8zDY_iOPRjL8p8m2qwHvUnhwGLsp26hvditTJ9P-zc1sxM7SficPLLqS9_PKX6ZVxkL4H2QdY)

![](https://blogger.googleusercontent.com/img/a/AVvXsEhvwLcjUKmobaOw2DvtMcZiB9UGKzCq4-BMzpN2s9AqoVoO3LN-59_enQJlq1eHGVx2TiaO_pG-nkKK9xWELgs_ina_lTEw9eUIFR9_g96wlXaAjq-X5HTfkd7J7Ukb7Fo0w4aBYch0LxVXPcN97T_StC4d2FO0yC5AZLZO3mWgUkWj-OQW0iGw4z_E5bk)

![](https://blogger.googleusercontent.com/img/a/AVvXsEihLkJQRG97wR2KK2WG5il81eg7vwg1T-Tzm8un7cMIUV6OGQfedMzAsavMZ_FwREfZYCUVVRJ2B8jet8qvaa202bRQTt4J1O4lHXKgAu_CFu5t8YOErxPOkWZBY1UXDFCSS-Wnbj-YHzDoX19ThFiPZj8Q2kcOqVCXsA9WL_DAAuyRMnTUqX-zQ0sJSdo)

이 절차가 필요한 이유는 우리가 만든 코드가 일종의 구글 프로젝트인데, 이 구글 프로젝트의 코드가 내 구글 스프레드 시트에 있는 데이터를 열람할 수 있는 권한을 준다는 얘기입니다.

일단 우리가 DB 같은 데이터베이스를 만들려는 구글 스프레드 시트에는 민감한 개인 정보가 없으면 되겠죠.

배포를 마치면 URL을 주는데요.

웹 앱 URL이 필요합니다.

다시 배포 버튼을 눌러 "배포 관리"에 들어가도 웹 앱 URL을 볼 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgqm1xu6nG1cPl3RxerS94t7KTL_-706h8j_h4YlVb1NykK4UnwDBG9K2B3x5tl5AMlTax77pqB8Nhjr8deB0MwYvAbTUOWiYt7k7RQwEIeKQ7B2sBqpYEfVNUS9j3FOJMJPi2u4yeyWmqKJfSVTSZlnDy-cIKcvKeFeBcIxM8ICaDZygdDMn2NC6O8VM4)

위와 같이 웹 앱 URL을 복사해서 지금 사용하고 있는 브라우저 말고, 구글 아이디가 로그인되어 있지 않은 다른 브라우저에서 열어 보십시요.

저는 아래와 같이 파이어폭스에서 열어봤습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgYbAXSlTDZz4kkaarHOyoXrOqbqua617ZZjp9UsUHO3sJRefSxXY6rJ2VMxcAjSwjz6atfwVt9VdZtsL0Lh74-A3Ue8J-7nGp5ekdWOdcFMN0EU-641naP7-AiaG2e5sZXSarh1XGLf7g-KIWFhNKNFU7iQAi8uY1h7FMbd4SQcVSatXdOyypTuJnYCN4)

위 그림과 같이 JSON API가 잘 작동하네요.

이제 리액트나 Astro 같은 웹 프레임워크에서 작업해 볼까요?

```js
---
interface IdolsProp {
  name: string;
  height: string;
}

const res = await fetch(
  "https://script.google.com/macros/s/AKfycbw0V_iAdqyq9n7RKJQJpzTVXU8rh7qZAH8fmeeWdVthGrSWMK57IKOvBcU1PHaMqrazIA/exec"
);

const data = await res.json();
const idolsData: IdolsProp[] = data.data;

console.log(idolsData);
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width" />
    <meta name="generator" content={Astro.generator} />
    <title>Astro</title>
  </head>
  <body>
    <h1>How to handle data in Astro!</h1>
    <ul>
      {
        idolsData.map((idol) => (
          <li>
            {idol.name} - {idol.height}
          </li>
        ))
      }
    </ul>
  </body>
</html>
```

저는 Astro 프레임워크에서 위와 같이 테스트했습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiG4SeOIlBOzVWirteh-jsDDzJ2hSv-hC4YEGf8DqoAgxDg1qO5TTvH0_JLAVmV_ejJSuMZTDp1PXNjXOlJSkfPzHr8ap4C4kUaxUB7uu-CG_bDScNPUrxdaPiB6PVMPNVhSeDlNmN6HEDjpwQHW7d2EnU8vEVO2MPxlpbay2qrM08IX3zg-gglqF3FReg)

위와 같이 웹상에서도 잘 작동합니다.

이제, 구글 스프레드시트에서 "IVE"의 Height 값을 165로 바꿔 볼까요?

그리고, Astro 개발 서버를 새로 고침 해봅시다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhhXRUEfySKIS8lt_MKpk2SxzaUTE34CU6PjIq_Z6z5YGl65cn0xqWa2QNMFVtt3msWbVmDd96GNRmoPTmi4vDigWbOrDwsHgVgPO3fEYg3MSYISbGXFEWLNACcx-qSXBbm1NpX-37CGJVx3EyweAcCUjuB1JX4zcc4h1L2EK5ODihc_H1kLKnSt6AseOk)

![](https://blogger.googleusercontent.com/img/a/AVvXsEgSGiidz7fXYPBtY8kSsuNJ0pRVuulXX07Crjpn9rJyTjyEvj5Tnzu28zbKAu7SZzOw0_q2PEHwMqWgyzkBBlruUjecPrmCaRtJNotDOA6IQ8PVpRfmiiVRgR6nAnXFV9Nck4RQMA5XbD_RlnyJRdq-yvU2TSpJToK5v75qkZnEYR_RhRVGlegK7wjDR9I)

위와 같이 실시간으로 API가 작동하네요.

이 방식을 이용하면 구글 스프레드 시트에 원하는 데이터를 만들고 이 데이터를 오픈 API 방식으로 만들면 CMS 같은 즉, Content Management System 같은 걸 만들 수 있게 됩니다.

그리고, 데이터베이스로도 활용할 수 있는 거죠.

지금까지 알아본 거는 아주 간단한 예인데요.

실제 구글 API 설명서를 살펴보면 doPost 함수 즉, Post 관련 코드도 제공합니다.

실제로는 우리가 DB를 이용하기 위한 CRUD(Create, Read, Update, Delete) 기능을 모두 제공합니다.

시간 나시면 실제 DB를 이용한 CRUD 앱을 위한 API도 만들어 보시기 바랍니다.

그럼.



