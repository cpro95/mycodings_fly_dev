---
slug: 2025-01-11-nextjs-supabase-tutorial-5-sending-confirm-email-without-domain
title: Next.js 15, Supabase 강좌 5편. 도메인 없이 Supabase에서 컨펌 이메일 보내기
date: 2025-01-11 10:09:36.292000+00:00
summary: Next.js와 Supabase를 이용해서 도메인 없이 Brevo를 이용해서 컨펌 Email을 보내는 로직을 테스트해 보겠습니다.
tags: ["next.js", "auth", "supabase", "email password login", "confirm email", "brevo"]
contributors: []
draft: false
---

** 목  차 **

- [Next.js 15, Supabase 강좌 5편. 도메인 없이 Supabase에서 이메일 컨펌 구현하기](#nextjs-15-supabase-강좌-5편-도메인-없이-supabase에서-이메일-컨펌-구현하기)
  - [이메일 전송을 위한 커스텀 SMTP 설정 요약](#이메일-전송을-위한-커스텀-smtp-설정-요약)
    - [제한 사항](#제한-사항)
  - [Brevo 가입하기와 설정하기](#brevo-가입하기와-설정하기)
  - [이메일 템플릿 수정하기](#이메일-템플릿-수정하기)
  - [Brevo에서 결과 보기](#brevo에서-결과-보기)

---

안녕하세요?

Next.js 15, Supabase 강좌 5편입니다.

참고로, 지난 시간 강좌 리스트입니다.

[Next.js 15, Supabase 강좌 1편. 유저 인증(Auth)을 위한 Next.js 15와 Supabase 템플릿 만들기](https://mycodings.fly.dev/blog/2024-12-29-nextjs-supabase-tutorial-1-making-template-and-omit-middleware)


[Next.js 15, Supabase 강좌 2편. Google OAuth를 이용한 로그인 구현](https://mycodings.fly.dev/blog/2025-01-01-nextjs-supabase-tutorial-2-login-with-google-id-oauth)

[Next.js 15, Supabase 강좌 3편. Github OAuth를 이용한 로그인 구현](https://mycodings.fly.dev/blog/2025-01-01-nextjs-supabase-tutorial-3-login-with-github-id-oauth)

[Next.js 15, Supabase 강좌 4편. email, password를 이용한 로그인 구현](https://mycodings.fly.dev/blog/2025-01-04-nextjs-supabase-tutorial-4-login-with-email-and-password-and-useactionstate)

---

지난 시간에는 패스워드와 이메일을 이용해서 가입하기 그리고 로그인하기에 대해 알아봤는데요.

지난 시간에는 Supabase에서 제공해 주는 옵션인 Confirm email 기능을 아래와 같이 끄고 사용했었습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgqrGBGGikAkGqUlJ01zOxyXAoHF-2XTBq8sjTIdWWivqlZt6-m3F5AhF3cD_CiL1gASSToJwqvtPr54pz0sEDHSrqWZj6EwNnaBwtVJhSLg4s2yDocHtBpapwE4WOIZGcAnJFMOLuMRMgVn-xXG_hnaGQNBt3HlgsLcDBCrBt8fpGr1pXX1nfPrzXK7ms)

Subapase에서 제공해 주는 기능을 묵히는 것 같아, 오늘은 Confirm email 기능을 활용하는 법을 알아 보겠습니다.

먼저, 아래와 같이 Confirm email 기능을 켜 놓읍시다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEigSc2nSidULHoKfoGlXK5aMwP3QgJYYWdrbG0qQILSxOx0Jt9SdRXQNFx8XtRt4eOfdcojqYoYQwIRuBFpoyHqi_WTvosKLrxTqnikBSmOBYK-9iMrfd3CyPzxZ3nUJGxYIUvztiZ357Fqx5YtxaI8VyweLdPnXHB4BlqDCZ1pFPgcRqqYVvkim_TxOJo)

그리고 개발서버를 돌려 가입하기에서 가입을 진행시켜보는데 실제 이메일을 받을 수 있는 이메일 주소로 가입하기를 진행해 봅시다.

가입을 완료하면 화면은 아래와 같이 바뀝니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhghU0sGvVF6EgO3Fwr_kf-UX7sZrhr8jKwQYxa-mFKESg7x_Z90h3mEtfZR0XBM0EGSbDA08GQ_iLTwGvEpOar--hyMO-gb2WguD1McvgSdh4X4bD_5xebd3XLb6ZQSc5Teh6X-IO5Pez3v9T61JHwTpQQDKc66XQteXh9r-jrUd2oNjZp8l_72A-cO3I)

위 그림을 잘 보시면 주소창에 파라미터로 code 값이 보이는데요.

나중에 이걸 이용해서 로그인을 구현하면 됩니다.

일단 현 상태는 개발 서버의 홈("/") 라우팅으로 돌아갔는데 로그인이 안된 겁니다.

Supabase 대시보드에 가보면 아래 그림과 같이 "Waiting for verification" 상태가 되는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjecIKYip5_dYJFqj-hCpdPR5UWHo-iAoknaGgH79-isF2KdZ9q6oowl4DbJTd-864i7ETRoaLmYYW7BEWfUvl3ZTNQE7jDP2ryC1d1RQeCZ2CMmdYKb8Zr6Yst1vJ0UdzbNR4fC8LKkyq5YcDl-BQlS4ju-HS5tKyIf5tjBthCIkoWhEpyIOnK8hhh2_0)

이게 바로 Confirm email 기능입니다.

그러면 제가 쓰는 이메일로 가보면 아래와 같이 Supabase 에서 이메일을 보낸게 있을 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgBjMYGW1nRQVSz5IAnRrWjx2PPe1doSNI8EAyRNgNUrdsNp6l1_RO9r_l191teNcQHwfcRGjvWGKD0qx6KGVo__6zneXcSZhmgD92NHBGLKx0STfGAwRFb7wKZmXvbDJnTsklKKHdOY7aBClxOFOwAw6tLsxH8KeTdQpDL-fVEyIDC8rcXZIQSxfAeXzk)

이메일에서 컨펌링크를 누르면 가입하기가 완료되는데요.

컴펀링크의 실제 주소는 아래와 같습니다.

```sh
https://lricgtqtchaizkuwbmzw.supabase.co/auth/v1/verify?token=pkce_1acacdde821905537d2c2932cf523a41ef409c5f14c586f54070e1e3&type=signup&redirect_to=http://localhost:3000
```

redirect_to 주소는 우리가 현재 쓰고 있는 개발서버 주소네요.

이제 이메일 verification이 끝났는데요.

아래 그림과 같이 Supabase 대시보드에 "Waiting for verification"가 없어졌습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhcFHP4Ta6dRWcvtA_zqRXNYpfRiudcVtbgGaL65kX-vt3dvuatKVvT7yQBcKSuqC-7Sbl6uhEBkb-jmXmMcrBQhrPcP7en2jV_vq2_MJSNRbgkEHA1IFX1r84oShLOEJcnyYrwTSAFWEmi9pj7EkOQ_oK78EJgb9QPZDo3nn8BCYQ-26ukjEw3Oo33sxQ)

이제 다시 로그인 해보면 아래와 같이 제가 사용하는 이메일로 정상적으로 로그인 되는 걸 볼 수 있을 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgH_nDy724dn-XfTQhz5EDNo7ha6PHgiulSXyp3i69QEUnH2fwKATdRVtY6D8TVuaXQtfXYFHy7HHfnvAAFGoAG_mUoKvjdWlbEqjeJeZA1ZdBsk2yZ5iDGtYtGD96cFx0wQhtj8PbpbLOq6ZrJm5O7sYJ63LY8BdrPLn9fSASlVIuQlbfGuLtO-O5UaOw)

어떤가요?

아주 쉽죠.

그러면 왜 Confirm email 기능을 처음부터 끄고 사용했을까요?

일단 Supabase 공식 문서에서 아래와 같이 얘기해주고 있는데, Supabase는 이메일서버까지 따로 돌리기는 부담스럽고 해서 직접 외부 이메일 서버를 이용해서 구현하라고 합니다.

---

## 이메일 전송을 위한 커스텀 SMTP 설정 요약

Supabase 공식 문서에서는 특정 경우의 경우 Supabase Auth를 사용할 경우, **커스텀 SMTP 서버**를 설정해야 한다고 합니다.

그 특정 경우는 아래와 같은 경우인데요.

- 이메일 및 비밀번호 계정
- 이메일로 전송되는 OTP(일회용 비밀번호), 매직 링크, 초대를 사용하는 패스워드 없는 계정
- 사용자 초대를 위한 이메일 (Users 페이지 또는 Auth 관리 API에서)
- 소셜 로그인 시 이메일 확인

그러면 아까 테스트 해 본 결과 Supabase도 이메일을 제공해 주는데, 왜 이렇게 공식문서에서 얘기해 주는 걸까요?

왜냐하면, Supabase는 테스트용으로 간단한 SMTP 서버를 제공하지만, 이 서버는 몇가지 **제한 사항**이 있으며 **프로덕션 환경**에서는 절대 사용하지 말라고 권하고 있습니다.

### 제한 사항

아래와 같이 3가지 제한 사항이 있는데요.

1. **허가된 이메일 주소로만 전송 가능**  
   - 프로젝트 팀원의 이메일 주소로만 메시지를 보낼 수 있습니다.  
   - 예: `person-a@example.com`, `person-b@example.com` 등의 팀원 이메일로만 전송 가능하며, 다른 이메일은 "Email address not authorized" 오류가 발생합니다.  
   - 팀원 관리는 조직 설정의 **Team 탭**에서 가능합니다.

2. **전송 속도 제한**  
   - 기본 SMTP는 프로젝트당 시간당 **2개의 메시지**만 전송 가능하며, 이 제한은 예고 없이 변경될 수 있습니다.

3. **서비스 품질 보장 없음**  
   - 기본 SMTP 서버는 메시지 전송 및 서버 가동 시간에 대한 SLA(서비스 수준 보장)가 없습니다.

결론적으로 위와 같은 제한사항때문에 Confirm email 같은 기능을 사용하려면 반드시 **커스텀 SMTP 서버**를 설정해야 합니다.

그리고 아래와 같이 Supabase에서 외부 커스텀 SMTP 이메일 서버를 추천해 주고 있는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiPeQ66vVaVgJy7wtF21x3b_gtZ4La14-mT3Yl0uflQZu3PXtFVd7E9ieLCYkYMJSALSE6qz8uLPk7i89DMrwwYwtL6_kJ73W2MiZDJTOOiOfQ2qSiGLVSivVF81G3hnr1W8HYCnDxelrx2q1UHL4rgjzQkazmp_bzpUN6IcPlxVCnl4wCZEFgo8xn-j7Y)

위 여러 서비스 중 Free Tier가 있는 건 바로 Resend와 Brevo입니다.

그런데 Resend는 도메인 네임이 있어야 하는데요.

나만의 도메인 네임을 이용해서 메일을 보내기 때문에 나만의 도메인이 없으면 Resend로 이메일을 보내는게 불가능합니다.

Resend를 사용하려면 도메인 주소를 사야하는데, 있으신 분은 Resend를 사용하면 됩니다.

저 같은 경우 따로 도메인 주소없이 이렇게 블로그 앱도 운영하고 있는데요.

그래서 도메인 없이 이메일을 보낼 수 있는 Brevo API를 설정하는 법을 알아 보겠습니다.

---

## Brevo 가입하기와 설정하기

먼저, [Brevo](https://onboarding.brevo.com/account/register)로 가서 가입하기를 하면 됩니다.

가입은 Google과 Apple 아이디로 가능합니다.

Brevo 한달에 3000건의 이메일을 무료로 보낼 수 있어 저처럼 소규모 개발자들 한테 딱 맞는 서비스입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhJANVCTI7Ez_YT9pSIvYeEACKt_R08KwEeWM4HLgYUHk1thaIG_8ZTIjTogrOELhfXjYNSYmV_7yrqt_5DK5Es2BCcJxSTVz-py7Kj8erQbeBum8wyT3b846HYG09tEvWoVZc_B0wdtObhzl7J_vLHcfVBV4wF3RrwcCGeBrtUiptRXLbnjon5U4cy3Ww)

가입이 완료되면 화면 오른쪽 위쪽에 자기 아이디를 클릭하고 아래와 같이 SMTP & API 관련 메뉴를 선택하면 되는데요ㅣ.

![](https://blogger.googleusercontent.com/img/a/AVvXsEg3fXxEP4l_xlOLCz9mBNDxHh0sPmd5BI2O9FhFIO0mZvncPiGHF6qO6vXWaFMf9uvio6WllaBi2vRNDx2BU03JQNOidConG3Owx4xuieYoEIOq9gPCiSB9ahjS1pC37J2WW1fG8LiNSa-y7nUkyB2KWzYDvvP8NRaKyzQ2WxCJtZ5vn7rY9RXV8ES01TM)

우리가 필요한 건 아래와 같이 새로운 SMTP Key가 있어야 합니다.

아래와 같이 "Generate a new SMTP Key" 버튼을 누릅시다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhvhjptsoROegfKG7GidErjgk6hstd6IVkWN1dJMQcNALp1AwR9qqbFEwzae3dOu0k29FlXlBssMF8sCAHq79P4pejpdfbhOgw2Xhm20JqkxhgN9JP06p5hSc7N7VX8HPVF42Nlu9n-ZCTMHafq2SfcwI89NRp0rv93zaaE0xEi_M0UBwI0UdadcLRTz5o)

그 밑에 있는 Master password는 건들지 마십시요.

프로젝트에 맞게 새로 만들어 사용하는 걸 추천드립니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEir19-3_bLzHcCtQhYe4yMcx8iPsfJbaXghMaCemtFjjVmBdcc95gFIvgQ4dV18Ds1u2CYXqRKwNXaZYyf5HJae1NLliiBiEwPo5oV2X2P0-ikKCNolSFWmQdwKOORSbfsza7I-lyhGovVCaeLAeEPjIvfICDjJYKk4DjQJJxy0-ZZ4IhZv3vJC2lNTSAw)

![](https://blogger.googleusercontent.com/img/a/AVvXsEgct9Uq2e54m_rj4KUEp9epoPBZsUUO0U8q07QNjARu8kVNW4gBrbxKEEs392Ay0aeS2cuS17DJObU3ftdvKXg8uD3qRyKIICGglrkS9eirSoAOFGh7iSczh1EALDiBHYllnhRVNBAwTttUEZDFqC3EZoy5Ud13K9RCOyjHigJgsPVgNVSRbpo6Zr-vek0)

![](https://blogger.googleusercontent.com/img/a/AVvXsEiqHAuxybI_wGOqARWnCqur8rRJVhHYPQvrnIzo2OpwgJUB3Yh3piMN8r0NZ-v328NnQWikgkx32M7ysU6qHrsjeHEfeXIvlGpuyN4qZINU-rcBkzB1BzVNRbnN8aQbcfG58MSssQj7vGul2tybQBj7jimxOgEhseTYszEgUdxspoVgo3-cXA6KMr1GdLc)

위 그림과 같이 새로운 키를 만들었으면 설정이 끝납겁니다.

우리가 필요로하는 정보는 위와 같이 만든 SMTP Key와 아래 그림에 있는 건데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhvhjptsoROegfKG7GidErjgk6hstd6IVkWN1dJMQcNALp1AwR9qqbFEwzae3dOu0k29FlXlBssMF8sCAHq79P4pejpdfbhOgw2Xhm20JqkxhgN9JP06p5hSc7N7VX8HPVF42Nlu9n-ZCTMHafq2SfcwI89NRp0rv93zaaE0xEi_M0UBwI0UdadcLRTz5o)

SMTP Server, Port, Login 정보값입니다.

이 값과 아까 만든 SMTP Key 값을 Supabase 세팅란에 넣어야 Brevo 와 Supabase가 연동되는 겁니다.

이제 Supabase 대시보드로 갑니다.

Project Settings 에서 Configuration 쪽에 있는 Authentication 부분을 누르면 아래쪽에 아래와 같이 SMTP Settings 부분이 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgaTH-sHEba_4lw7MjA4csLYIEy9cPbylPjJf3xJRLRwThGOj2yc4htjAj_cJQL9V7eYfwZpmCedfH0VgZs3uiPgN64e1BAZEFXESK1sEsoDlMKGK4lZWNIrfDwIsI9bqQT8Pk9UJiIpuP-bS8mXDvIITIbUARmR_6TDJrYycbQTaCxO6A3-ybpByoagtw)

위와 같이 Enable Custom SMTP 칸을 활성화 시키고 두 개의 값을 입력해야 하는데요.

여기서 중요한게 Sender email입니다.

Sender email에는 꼭 Brevo에 가입한 이메일을 적어야 합니다.

Brevo에 가시면 세팅쪽에 가보시면 아래와 같이 Senders 쪽에 가입된 이메일이 Verified 된 상태라고 나와야합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEi4obXd0HDuuo2tfHh6ZLHgdSCp8KiYKIQ3GLZdnCZGy5xDAXAzz1mOmLWRTgJ_cOwwoFv8y27T1mwEsFqoV-ZvYj83InOoS_npsXj2cT4n66a40k-TzyhFxJP7JaOKwY5L-fK9YRdEwAwHoCVeOKT-Uv3xjpTw8jnR8DjCz_27O3nGj11EI95OdnIM2PA)

위 그림을 잘 보시면 Free Domain은 추천하지 않는다는 주의사항도 있고 한데요.

Gmail로는 Brevo가 이메일을 보낼 수 있으니 걱정 않으셔도 됩니다.

그리고 Supabase 대시보드쪽에 아래로 가서 SMTP 서버 관련 코드를 마저 넣어야 합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiJt_oFxQbbQE2y1xjR5gfZ0XTRYHJEr4XyQaXyPcOZcLqeHgFqNcLBsh3ZDAoIwfALRuLWEJ7kFKUQmAJ_EzRMFXyihfrzs3i6BCBqYUnqpzgsGBkNBW-zhVEO_sJusxcPPGHsXUMPlrONnlYXsOkwaL3ZPlKJyiGw7QT5PCZWi3dAb3S_rS38suB3vwM)

위와 같이 Brevo에서 얻은 정보를 넣으면 되는데요.

Host 칸에는 Brevo 에서 얻은 "SMTP Server" 값을 넣으면 되고, Port는 Port 값을 넣고, Username쪽에는 Brevo에서 얻은 Login 값을 넣으면 됩니다.

그리고 마지막으로 Password에는 SMTP Key를 넣으면 끝입니다.

여기서 주의사항 대시보드를 자세히 보시면 조금 아래 "Save" 버튼이 있습니다.

"Save" 버튼을 꼭 눌러 저장해야 합니다.

---

## 이메일 템플릿 수정하기

SMTP 서버 등 Brevo 설정이 끝났으면 컨펌 이메일에 대한 템플릿을 다시 구성해 줘야 하는데요.

이 글의 처음에는 이런 설정이 없이 Supabase가 설정한 템플릿으로 이메일이 전송됐습니다.

하지만 커스텀 SMTP 서버의 경우 꼭 컨펌 이메일 템플릿을 다시 구성해 줘야 하는데요.

왜냐하면 토큰값과 같이 컨펌 이메일 링크를 설정해 줘야 합니다.

이 템플릿도 Supabase Doc 부분에 나와있는데요.

공식 문서에 나오는 템플릿은 아래와 같습니다.

```js
<h2>Confirm your signup</h2>

<p>Follow this link to confirm your user:</p>
<p>
  <a
    href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next={{ .RedirectTo }}"
    >Confirm your email</a
  >
</p>
```

아주 간단하죠.

여기서는 ".TokenHash"가 중요합니다.

이 값을 Supabase 대시보드에서 Authentication 탭에 가보면 Configuration 쪽에 있는 Email Templates 부분으로 가서 "Confirm signup" 부분에다가 넣고 저장하시면 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEh3LYSCPpcfwT_P7Bx1gsHJMif_ltit3JqJugc6mWd1vckoSQufT6Lav0gwq4C6uyxk1KyTel6Ti_CTNZBE1ppoWgvZDWsrbFG0hVBaiqCHoYVHINtTx3qnXiJadGiYZ0lreYQd0Q6WP0yvn3Z7gTqNZPMQyD9px5YfcK6D2GDytQUQuDZRpU2LyahLAFc)

위 그림 부분에 아래와 같이 넣으면 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhtWXFJZxLcPa90hj53OG203_IcaVaVn0jJXwgmNDFo-gmsRJcEtXX6b6NmKPmY-Bw4CJOENQcvOwIYHAYAh10Ft8Pr5Zyz5gCOuHoY3qf-TzmO3D5DfhqI1rDME_ZlRjt517m4hTrx43KLSSiDztcYhlmUNy7PVsxZbUP01ENTybc5V5f0gLqYmAUqRec)

이제 테스트를 위해 "cpro95@hotmail.com" 이메일 이름으로 가입하기를 진행해 보겠습니다.

가입하기가 완료되면 라우팅은 Home("/")으로 이동하는데요.

사용한 이메일로 가보면 아래와 같이 이메일이 온 게 있을 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgWAYz_8vaiAMDv0gjkTaDZTHM8OuxJ7HLIzlHSH-WBf_-9Hvbz4w8VJZsnAHp4So-pp53CYI2xbpJxcYXUE-3MQ95QOe9NVUlQNXlQFxlqpgldo1in_ufI3pt3xFuYCGqEuIjgXf-AwHFsJB-EB9_DuH37O8F_PnXfv2H89nHkfnx4tzNmcRvp64sQe5k)

이메일에 컨펌을 클릭하면 브라우저로 이동하면서 아래와 같이 나오는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjNWU7sovhLR4AVwaY6Md-tLlxM9mztUSUVfbwT9Dld-zi4zr31RCPzukAsRIivd7lbSs0KoB7cOscMZHMhxhsxMBfJiZBGgNcHpjkVj49FeqySe1jSZTKkc7G8ZD88YzY3tVmOWFXPOHIxGcWrZIOzquFLAKyUECeJbwnmaPJdc2Un4EENxuStpGwJpdc)

위 브라우저를 보시면 "/auth/confirm"라우팅에서 "token_hash" 값을 전달하고 있습니다.

그렇습니다.

우리가 설정해줘야할 코드는 "/auth/confirm" 라우팅까지 설정해 줘야 합니다.

이 부분도 공식 Supabase Doc에 있는데요.

"src/app/auth" 폴더 밑에 "confirm" 폴더를 만들고 그 밑에 "route.ts" 파일을 아래와 같이 만듭시다.

```ts
import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";

import { createClientForServer } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  if (token_hash && type) {
    const supabase = await createClientForServer();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      // redirect user to specified redirect URL or root of app
      redirect(next);
    }
  }

  // redirect the user to an error page with some instructions
  redirect("/auth/auth-code-error");
}
```

이제 가입하기를 새로 시도해 보면 유저 가입이 정상적으로 된 걸 볼 수 있을 겁니다.

아래 그림은 Supabase 대시보드에서 가입된 유저리스트입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEi4-bLpgmGgdXsgpt53oXEHzFnpdtkPxF3_05MRGWkjZy123NNWYezS1h828z4Wlc6_TFHMuoeZdiFfnxq3-HpWhJjk-0owo1o4aIYk6KRCFA2WGXU5Brb9CL6SNQ8YhDK3RauCjMJrWaSUpB0_HQe-UWcYXAbPfMxsPtPkRL3-tdeuD4oBjunwBhFivMc)

---

## Brevo에서 결과 보기

Brevo 사이트에도 대시보드가 있는데요.

왼쪽 메뉴에 Transactional 부분에 Email 밑에 Statistics 쪽에 보면 현재까지 이메일이 전송된 횟수와 성공여부를 볼 수 있을 겁니다.

아래 두 그림을 보시면 성공 실패의 로그가 보이는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEh57SlNLv0_AlVWrG3hZ9u09te5RlnHRKzl3nxIYfOAruOTaSGWXSeVhddX_tsoqemiF33QnI6DE197OtAOl0_J-PsQwMoIZNKCYRVeyFB1f_jniPyYQzTjFSB9EK4MU17aGvakGuyKljnorX4LQEBlEg5CEn54HeiJmMozEGZXIoH2B8YpLJSM8oG1m-c)

![](https://blogger.googleusercontent.com/img/a/AVvXsEhy9FGO0GZs0mE4XyEmYbTxGdaVzeKfVgwKODhKlCy5PHjvwPNJTq20AEVZ-Hh-8Rnsbu5pcy91hWaAYuIFFABpjJWCOmih6ni3Tnn1l6YKR-soPnpjmoZD2-2iWTCt-sHUCtNkpCfpwmecurGoPLSkXrvQCuoc1uFMlsNqJcz5hJZYxYbEwaYRy4phzbw)

아까도 그랬듯이 아주 중요한 점은 Supabase 설정에서 Sender를 꼭 Brevo 가입한 이메일로 해야한다는 겁니다.

그렇지 않으면 계속 에러가 나오니 꼭 유념하시길 바랍니다.

그럼.




