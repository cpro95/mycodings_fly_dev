---
slug: 2022-08-07-complete-introduction-of-oracle-cloud-free-tier
title: 오라클 클라우드(Oracle Cloud)로 무료로 웹 서버 구축하기
date: 2022-08-07 02:56:45.308000+00:00
summary: 오라클 클라우드 Free Tier로 월 1TB 트래픽의 무료 가상 머신 구축하기
tags: ["oracle_cloud", "free_tier", "web_server"]
contributors: []
draft: false
---

안녕하세요?

오늘은 나만의 가상 서버 구축을 해볼 건데요.

바로 오라클 클라우드(Oracle Cloud)입니다.

오라클 클라우드는 뒤늦게 가상 머신 시장에 뛰어들었는지 파격적인 Free Tier 제품을 내놨는데요.

무려 월 1TB 트래픽이 무료입니다.

그리고 저장 공간도 100GB나 되는데요.

서울이나 춘천 리전으로 개인 고정 IP도 받을 수 있어 웹 서버 구축이나 VPN 구축 등 다양한 서버 구성이 가능한데요.

저는 개인적으로 Strapi CMS를 설치하여 제 웹 애플리케이션의 백엔드 DB를 담당하게 하려고 합니다.

그럼 시작하겠습니다.

---

## 오라클 클라우드 가입

[Oracle Cloud Free Tier](https://www.oracle.com/kr/cloud/free/)에서 가입하시면 됩니다.

아래 그림처럼 "무료로 시작하기" 버튼을 누르면 가입이 되는데요.

![mycodings.fly.dev-complete-introduction-of-oracle-cloud-free-tier](https://blogger.googleusercontent.com/img/a/AVvXsEiMyPUHuBF2Uwiar8tSNmIsH1wpxKAAfSUqqbuFc_bWYZx7_mtIphZlv1HujpAbqT-0482Ohx8OfewdwTpl39eOAnNbnxF5NyJxa05Fc3mtojyLZNIV_QFJiJNy2r_RnHs8v0TmmviyovbUPQ-2qnbg7cQlwRGRo7O4pWBRyBvUShr2-ceDafkoCDeQ=s16000)

전자메일 확인하는 부분이 있습니다.

![mycodings.fly.dev-complete-introduction-of-oracle-cloud-free-tier](https://blogger.googleusercontent.com/img/a/AVvXsEiTSkfYtef7PifDsq7207mBBWwF4tZEJpscDK2A2duRB9EpkNjKSwfagQViZe7pXFfYGqxiO2OpbTr5AYzWR9vpAKDHtZW1HpMSDqX6HfRF7UCuh3IXk88XHDP-o221P0zS6-JWToWvcgbg2-bHqAKXvlhmXmeTqtsogZFYllgFcigoY0UddGXUPPzN=s16000)

계속 진행하다 보면 확인 이메일이 오는데요.

본인 이메일 열어서  "Verify email" 버튼 클릭하고 다시 진행하면 됩니다.

가입 관련해서는 리전(region)을 선택하라고 하는데요.

오라클 클라우드는 서울과 춘천에 서버가 있습니다.

원하시는 곳을 선택하시고요.

그리고 해외 결제가 가능한 카드를 요구합니다.

무료 티어고 용량이 충분해서 과금될 위험이 없으니까 해외 카드를 넣어주시고요.

그러면 싱가포르 오라클에서 얼마를 승인하고 바로 취소합니다.

제대로 된 카드인지 확인하는 거죠.

다 되었으면 아래와 같이 가입 완료되었다는 이메일이 옵니다.

![mycodings.fly.dev-complete-introduction-of-oracle-cloud-free-tier](https://blogger.googleusercontent.com/img/a/AVvXsEgMjR_inepTtUPro1_WkMxFjhka2I1a-hYZ70y2xYxLE6nB3BNBhGkpN_v3ezzyamEHauIGHyGbVIO7aigUCsx303IKJ5GtA-IVJusL8e7PchS-J8Ox1Haw1CxtpV61pUMEAqKAKNONphHKHWvrGGxqBZgVAKMrT9VhRcQYMZ9g1D8X_pyW-8boTSFu=s16000)

이메일로 계정 가입이 끝나면 드디어 "Start my free trial" 버튼을 눌러 오라클 클라우드 Free Tier를 사용할 수 있는데요.

시간이 조금 지나면 아래 그림처럼 Free Tier에 대해 즉, 오라클 클라우드에 대해 완전하게 사용할 수 있다고 이메일이 옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEidSmT8nANitr8GTzSUpQfEbX44sx6KsXstof24nqy96u5wLisWZdFkRWa7PN6TDLIcztjfx5ljgiCraBJWgfCv30n1GIh9y5U9THq3Gw14nwrtXWTDN3ETaOzFp02Pv79cwkKWL1F19zdkXnlLt5x8Bn4p1V5NL7K205b8El0RLHlwEDWeSiFK5f0J=s16000)

위 이메일이 올 때까지 저는 10분도 안 걸렸는데요.

경우에 따라서는 며칠 걸릴 수도 있으니까 차분히 기다리시면 됩니다.

---

## 오라클 클라우드 설정

### 구획 설정

오라클 클라우드에 위에서 가입된 정보로 로그인하고 나서 왼쪽 탑 부분의 햄버거 메뉴를 고르면 아래와 같이 전체적인 메뉴가 나오는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhFqRx9YM7OdR-IdT6_e_LJhwGoG4uq90285g4Qnj7xIRrfLQttDblTdzsY1irfBDMpGqRzhesYabCQ9fqGhyQJZ5DF1UGnnx_ER15bIj4oSjAS48YgHl3On8IBC-tCywOtrf3SHuvDEL4v3qYVM10upVpNp5TneOEtehZv5CX3GmSDdkf-OCtzPWKm=s16000)

제일 처음으로 할게 바로 구획 설정입니다.

구획은 영문으로는 Compartment라고 하는데요.

구획의 의미는 자신의 계정 하나에 여러 개의 구획을 만들어서 관리할 수 있게 해 줍니다.

예를 들어, 1번 구획은 Strapi 서버, 2번 구획은 메일 서버, 3번 구획은 Nginx 웹 서버 등 각각 다른 IP로 세팅이 가능합니다.

그래서 보통 2개의 구획을 만드는데요.

위 그림처럼 "ID & 보안 > 구획"을 클릭하면 

![](https://blogger.googleusercontent.com/img/a/AVvXsEhPSYgZhNaHAeZGnWCJ3cq39htgnK-0RyoYBnZFG8nXfWD2-dRR7A39vhoTkQbrNlhgXaRMvmjnVs-qztX7hufAVKPu_ZyZBzd1MR9U0DEnPbT-SCg109OXnBvu1dWqR-OuabTleVQFAXV-bQ773Nix1s946Br6dyjpAZFOCTAeDbSXtGyOoE8l8S2c=s16000)

위 그림과 같이 현재 구획 상태가 나오는데요.

제일 상위(root) 구획인 제 아이디가 나오네요.

그럼 일단 첫 번째 구획을 만들겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEin7fPme7bxVi6GWsAs4g_je8JmiUitoVrU6f4sXqMDi7aFpWJyffXM83HJnM4FIPP7NN9zYmZy6co4d7ldHdhNcn-rId3xa7gOLI0FfA1ndoujVUyJTDxnzYBPBGoJLj8m11PO5Rgrx1Gtqr-RQimTy9wsOKO7ujyuNvuyi0TyLyDc4Ngoh1KLxIH1=s16000)

위 그림과 같이 이름과 설명에 알맞게 작성해서 넣은 후 구획 생성 버튼을 누릅니다.

한 개의 구획을 생성했으면 두 번째 구획도 생성 바랍니다.

최종적으로 아래 그림처럼 저는 cpro95-main과 cpro95-sub 구획이 생성되었습니다.

최상위 구획은 cpro95이고 그 아래 cpro95-main과 cpro95-sub 구획이 있는 거죠.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgaF9-A3Mvb2lOAB3HD_6CxhQfkMF1SCmhJTO_X1nLi8ZrnSQs4tQwA8MWjV_seN4LEPMRQK1y06rmj99kK4o11PduUs-Y73exci-e4ONtm1lOZhLGyUtR78gCXOQdY7hZslAMjH5LL_QxicKo-5Qhrsf42dmH-osxQA-FtQjA-nSR-D66Ju4fnb2fo=s16000)

---

## 구획 내 가상 클라우드 컴퓨터 설정(VCN)

이제 구획을 두 개 만들었으니 본격적인 서버 설정부터 해야 하는데요.

이제 가상 클라우드 컴퓨터를 만들어야 합니다.

오라클 클라우드에서는 이걸 VCN이라고 부르고 있고요.

우리가 만들었던 2개의 구획에 각각 VCN을 만들어야 합니다.

왜냐하면 1개의 구획 자체가 하나의 서버가 되기 때문입니다.

일단 맨 왼쪽 상단의 햄버거 메뉴를 누른 다음, 아래와 같이 이동합니다.

네트워킹 > 가상 클라우드 네트워크를 골라줍니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhf3DF5r-20MiexTzvfNaSBg_HKCXLS1GRq_zjHsoTgU9CNxNEra5PgNFdRHRLtYiZ5hM-G86M2LiKrTfdEDYpFh2BeScRn4qfHF2Ntsv_VMQl31hithSaWSMlPVB58IhJchA8wC7Ir-bbXKRlbAnb2OEBcSySfp5HgDEx2rU83Vzz4kQbrgUPELm40=s16000)

그리고 나서 아래 그림처럼 구획을 지정합니다.

우리가 지정할 구획은 cpro95-main 구획입니다.

이거 지정 안 하면 cpro95(루트) 구획에 VCN을 설치할 수 도 있으니 꼭 구획을 정확히 골라줘야 합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEizc9AXiTC_CnS0iLF0AL9QRJD4D-qxEXhGc-pqZFXZaq0DvK7VoDyty7n71o4C5QX9zt7zG1baqp-mOtkv1Yv8ilvW8jPNnXMtmO0eINnYgwdY5trz7pUu8AUq5Oz3oDDWTR7hug-ekZNMTPWQ4UmpQkFNIUv1uEgTaiMCylN9m9Sj-fs2XAvlK9Aj=s16000)

![](https://blogger.googleusercontent.com/img/a/AVvXsEh4zHfdeFc5p3be3DBzr1hg9NcEsGmzPkpHhCPPvVVbTgIYbKwHQjTZU8fYBSLjTfEmvGqRblLWSj8zHSnGj1LorktSsqXm1rvRdEsef9m2K4ozZg9J0VrFmnd2X627ReuIkkzFerEa_pP1HxA7Fv89yTqrJTpv8UNx5IaHXxRZZFxxFrcOrKAiNaLn=s16000)

위의 두 개의 그림을 보시면 화면 왼쪽에서 구획을 골랐고, 그다음 화면에 첫 번째 main 구획이 나왔는지 확인하고, 그다음에 VCN 마법사 시작 버튼을 눌러 VCN을 생성합시다.

마법사 시작 버튼을 누르면 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhTNZOD8Beb8MbpZehzfXMdG1XX8TGaD3QC-lE9aZu-kKacwnXwFs64hNGkW3Ff5AjqNrBJnXdmgnJW5urwEtUTFWn0SfljIDUHRwb_HnQ3LKJHcrE5ubSgTkbfCmxmAj_gVvMSi5i80zigVQucZTe8rm2h3wLDudz1WDyMYnpLLotudTWouHv29573=s16000)

VCN 이름에 저는 main-VCN이라고 했고, 이어서 맨 아래 다음 버튼을 누르고 그다음 생성 버튼을 눌러주면 됩니다.

가상 클라우드 네트워크가 정상적으로 생성되면 아래 그림과 같이 main-VCN이 보일 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhxqf0Gbh9V5Dhc6fcTUSW3qo5Xx2VT2JXBWoNpCXsIsxcrh972MzMZVMS4NhTRrYCKd5gRXMNIEolXvFjdvuG9AWFcDuGEZnX_M5u7s7EuWln3_C0oW5BirwpvkWneY7XWzZmAJIebxdnqrTL1JZ_ErQjpD30nop5FHjyUbopLBPb2Q8SHk_zImWy-=s16000)

똑같은 방식으로 2번째 구획에도 VCN을 생성합시다.

이제 가상 클라우드의 포트를 열어줘야 하는데요.

포트는 http와 https 프로토콜을 위한 80번과 443번 포트를 열어줄 겁니다.

일단 아래 그림처럼 main-VCN을 클릭해서 main-VCN을 선택합시다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhTURRTGLr6lJ5imDFXczjaktJ3nCjuoDAqiYWptknfX2Xw99K7Y3whr3zehk1sYDt_JT6DbkkmLTYT2XNtIe-KkWFNFoZd6mQ30dbgyaLyPy9G0uRXrEahpAVgnUkQAbIxP3Tam_6N7PUHraO8yMWHk4lFJron0hjpXMbm_SjCY1pUuwnVFdedzyy4=s16000)

그리고 이 상태에서 왼쪽 메뉴 중에 "보안 목록"을 클릭합시다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjJV0XBz2HEdeKS9NDDJVvsRIgR5qncfwTO0HShh31OGkpgm71tOfQsw_QAvB2UIz4QVYDIUIwXvUR9gsS-MJfEGwATf-t3vB7UgSE_49hvha2OWUC5buSXUgso3tDjsSQ4XJ-xFsxmY7bpfW2eNsvEo2vAs5Y3zkLXbg6eZnafR2NG6W3r8Yadokvh=s16000)

그리고 나서 보안 목록에서 "Default Security List for main-VCN"를 클릭합시다.

그러면 수신 규칙 추가하기가 나오는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgsi_dp1BBTmYPUuWGv0gIxoYAUODgEGmLghqqIVWZMWB5Z4OKAfUtHuA_X7qF3_-ebzDwzLbH6VgqkT5SaD059z82M5HSDSaZEIP1Vd5iRGbN_XDWfYJaBmRE6Z-ZMpd_AwCzzGlixR6DMwvrwJjH4B_LoYl4yCE0ucIEDW5DUkc5YHFsSYH1SyikE=s16000)

수신 규칙 추가 버튼을 눌러 아래 그림과 같이 포트를 추가합시다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhN86VpOdTcFVG5GXhotIdcZXi9CYYKWJ2urpYO69Ogi6j3bYbDsxpsp0O2M2IeB3UxYvRMn47vYxfr21qeWpRTnu6FYaJ63SSymGzp0OCHjVpqdcNpdeoxUrRcQfQWuTm977jjGIWgjtJr2bANGYsWZ-F4L0qeA3TaC47ZbUaO1VCs3bTtdUvdebw7=s16000)

추가가 완료되면 아래 그림처럼 TCP 80, 443 Port에 대한 수신 규칙이 추가된 게 보일 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiESudpMDZF5f3y_6EBLcr-6EebjaqoPFQNsCEm-7s3GxpQQBhAkYwI_I4hj4MzDny4XD912pJ6HSz4sGl6NljdB_ZSLe7aIYt2R_ICCucDpRClYOzu5AE_AV3vB_rPBnfGuzEctd167EbpKTT6780XHSUc9nQAOxspNCTX2BlWIOzax-d1j_lEtlPY=s16000)

---

## 예약된 공용 IP 얻기

기본적으로 오라클 클라우드 가상 네트워크는 변동 IP를 제공해 줍니다.

공용 IP라고 이름이 지어졌는데요, 우리는 이걸 예약해서 특정 IP 번호를 내 것으로 만들 수 있습니다.

그래서 이름이 예약된 공용 IP인데요.

이렇게 예약된 공용 IP는 서비스가 지속되는 동안 IP주소가 바뀌지 않습니다.

그래서 고정 IP를 얻는 것과 같은 것이 되죠.

다시 오라클 클라우드 햄버거 메뉴에서 네트워킹 > 예약된 공용 IP로 이동합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEh5fiGO-Af_RSu6_CH9aiQkMH0iws5xZrGvKcETk9HSoRAwCPxmamts42l2Job02gsezgPVgr5uHyG6dj3S1OVITxTCWkKQRsG7Ff09bfPQvtWdKjxQP9onsHUdOwYgCJ7Ds-6feI8pMuDPAEQ6M8nu7AqaVRhkxOImIRbtEw9xABCr9ppc36Bug-R8=s16000)

그리고 나서 아래와 같이 현재 구획을 잘 선택하고 예약된 공용 IP를 눌러 신청합시다.

이름에 main-ip라고 적고 생성하면 다시 아래 그림처럼 예약된 공용 IP가 나오는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEg9vsu6WVOuVBEZFKHsPry4nC6HZDF-uQ1ty1cr8jbq9G80dHUiTdbO6plIZJSA0tgsFsTi4YfSasOG4inQ5QC33qYhKJWpk8K4ILA8UQKenYWS451L9SMJEqBPlIERYIZvCDRgEOSh31ZPgTyfpZcAG99To7QAL1Bzq5Oq-QdpvvL0VMkQfAmTNs8c=s16000)

위와 같이 나오면 IP 주소가 확보가 된 겁니다.

이 방식으로 두 번째 구획에도 똑같이 작업하여 예약된 공용 IP를 확보 바랍니다.

---

## 가상 컴퓨터 인스턴스 생성

이제 네트워크 부분도 마무리가 됐으니까 실제 가성 서버를 만들어야겠죠.

햄버거 메뉴를 클릭 후 컴퓨트 > 인스턴스를 클릭합시다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhApPPiBZOEbBvpujf6X8ZfmQ4INSfOUcEmdiUYL5379NOEDEvV2Opm5gyXJTSEKQvkGofqrQ5PyoCtxDkUUTPGleyk_DvEmJjJyL6CHBVu7GV7e4dTVS_RaNpoImm_E6YGZGQUr0cCcQeKWx-nMbccykh_ywueNwvNMdTM7qDPsR9t1gr76HlxHbUg=s16000)

그리고 여기서도 왼쪽 아래 구획을 잘 선택해야 합니다.

저의 첫 번째 구획인 cpro95-main 구획을 선택하고 중간에 인스턴스 생성 버튼을 누릅니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgX0-t41DOn8gdJ2FYjJIQC7sTjW_4Lv-SfhVJnVDQDq733X_Pp__PifewdBOyg6hHwJ-5Jux4raubWPO60HK-sxOh0nDMncO0MFvJWySr5h4oi1d66JsP_ynoFTLfI4bgTV-R7ySXtWxOYDDXVtwJgZ5ugKK7p1YRlZ2rSLNVirnTgZK-gzKE2bu3E=s16000)

인스턴스 생성 시 가장 먼저 바꿀게 바로 이미지 변경인데요.

아래 그림처럼 리눅스 버전이 Oracle Linux 8이 선택되어 있습니다.

옆의 이미지 버튼을 클릭하여 우분투 22.04 버전으로 바꿉시다.

우분투가 훨씬 더 편하기 때문이죠.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiB8MX-9GK2nyPgQHQxec_P-UtNN6_TKaudKSKiM76LWPm9OmLtmG6JuCWcF2JAvfB69BkABMR2yYkP8gHw9YryEmBmL4orZ9w5s8X3ZLr3_7fK6juHmSyk3YnCUEmhYLzeg7fNrIZbqAgHLYpFXUfLA7115GjmcFcORgLvT1UBsbbm4XNPYz56mn5-=s16000)

그리고 나중에 가상 서버에 원격으로 SSH 접속을 하기 위해 아래 그림과 같이 전용 키 저장 버튼을 눌러 ssh.key 파일을 본인의 컴퓨터에 저장합시다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhI-J2uZ1D4XbQIA_a-cZ5Air35_PU5PYw06vDKrJVjYToeooSPSpM8gsh-_g3S8WjUqdYJFChLYtxzvAov8yjNHxF4SYs4JI0U9IaOYPFogjz-CwRrevr4wk0pomP5QtXd-qqoAPJLsmJEAHsAhVCP7_lCoXgUMuOFncONuDZPX_m3XFD4vYZUJTJd=s16000)

![](https://blogger.googleusercontent.com/img/a/AVvXsEjgZDspvkeD8hKhjRKHoz9ULaPBW70VkYK8NNHV2OvqDAdKCDRUn6kSRRloFGvUVISbckzDtaS_5m2wcoIut91USAhYVu4elOVO5gHsD_fsjCMN32dpNv8qwiuWhELr_crQht6ZzIF3kUSYwIcYQl5VvWoNljHmXg2AYX42soIxz4SWsQucV32CANwT=s16000)

이제 부트 볼륨 조정인데요.

우리는 구획이 2개니까 50기가씩 합시다.

아래 그림처럼 선택 바랍니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEh8XJTF9PEeU7T2UEjIzgpCZDYovFh82zy9b9Mye1LAGqtTQncBgqAHDktkpxGbu33rfWaqf3nep9CbzMJcH-hTrijz_GL80wbvsszrkhfm38679_yF01FAiiZy868CpjZx5b_UjOruHawEfHyVgXYpzttcD7Q3-Sr71CzU1KAvBee9FF0O6YOj2m-k=s16000)

다 됐으면 인스턴스를 생성하고 나면 아래 그림처럼 나올 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjHscUsJxLjulmQM4ldK3RCeYxLlxa_GAFAOG4hruQSKjMOTw1LeDr0X9vW1BeuFxEwxBby5Dasop1kzkzuxHjZhJfHKVCEnti1mmJVJ3wL6PXHqhzErFT0e4pCAZtC02UMeeSenrQvsP_hekzDtw1IpjQsEkM2idpPYwV0CWfjGPaJNKDtW3dTcleK=s16000)

여기서 중요하게 봐야 할게 공용 IP 주소와 사용자 이름인데요.

사용자 이름은 기본적으로 ubuntu입니다. 우분투를 선택했기 때문이죠.

![](https://blogger.googleusercontent.com/img/a/AVvXsEg8u1O0yuuyFgl9xauw-F0cueVkAQrotAX12CNPRRr_rlbgn6rdYY0jgCqUuOjNM6Ao36L1s2Wreh54NTlX0PUG8E5kR8vGkElsq90w6I3n7dL1mNdPwqS67I9J6fS8WCnbVIvkywQSjEMfySZlcb0xEiJSDf36EUVylbEotGfIjwxDRvrQUrgNbyvE=s16000)

그런데 공용 IP 주소라고 뜨는 게 우리가 아까 전에 예약한 공용 IP가 아닙니다.

이제 이걸 우리가 예약한 공용 IP로 바뀌어져야 고정 IP 효과가 나는데요.

우리가 만든 인스턴스 상세화면에서 아래와 같이 왼쪽 메뉴 중에 "연결된 VNIC"를 클릭해 줍니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEg1VJulmQkZ7ZB598kl2Y8JerCQrLY4aVOJPC8q1TaSKO-hHIv9l_ZXblC0iOg9wiKWKiUOaUBZgOO4QYa8h4HboCqZBWbGOXpRvOFyxMJ9iXNsUpuXIx_1WBom_Fz-MSVQk6cc6crhDTaDqjm8UJlRp3w-D6fqnLWjDCjarpqtgkfQETuoxQ9NFHwz=s16000)

그리고 화면 아래에 있는 main-instance(기본 VNIC)를 클릭합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjAmaaNs3eVYEciVN6CcgHN6yVUqWERQMby_M6wRH2_rdLB6hQEv2pHdZEONGDSrzKPfpSFSQVeZcCvcFTaVtUki-8qCAeY_thPis2VNT7x9hnUeXwe_K63ADfGRU66sGBgPWNa4OQCWnxihzC6ID7w_zDNwQiirlW5xanV1OoPCODPdbl3LnEbum73=s16000)

위 그림처럼 VNICd에 들어왔으면 아래 그림에서 처럼 IPv4 주소를 클릭합시다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEixzggblFt32UovKev6r4f0260VrA335JDLG8qqcSl4f4InwJG_jAU106v1WVS4uvoemHLPayy6TYvGJOmNqcQHpgxV29UMa6R00AWsQ6kQXCQBcCqAmoQRO0XxVoxN8XeJ29A190jO7Yc2luPXr5g8ONvgNcbysYorqA-Lr4KyAZt4vZ8WMpM1hjsj=s16000)

그리고 아래 그림처럼 오른쪽에 점 세 개 버튼을 눌러서 편집을 선택합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjmbSsqqwcZl89Wge6_WxRPtOJBAX1DjmbRn3dX8EHQ2IOcLPlxMzSNOH74emuts9msIj9joBTleMIj5lr54067t_hgMZdwF8j1eGR4DpL1hUeFFzg4lMKhq-w7l2Z1D9DciXlQgBoRLLpoDk2eHIxe-kOVtVmOzgAof9x3lABLSZheUn1vhTRBpEvX=s16000)

그다음 아래 그림처럼 공용 IP 없음을 선택하고 업데이트를 누릅니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjfUu0LJH9uWhNhXKd0Rdtm1sN2aGQ9HshqcKRzMmLY-Ybrod5k0mT2zCWmuG83cNCh6dNjQoyIg3YCFEGkig3xML-SN5J2J9tKrwc3AzdU1t0lJYHTCH8ETMir8IBTjuY4opW4wi3B4FOW_W_GaCifxX2gtAhRMfCwHUghydQ72JvoyxB_y41X1y0u=s16000)

그러면 아래 그림처럼 공용 IP가 없어진 걸로 변하는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjbL2uIDb5zQEz0euxwNA_myyESZG1SeMurFfmkEo_nPbbyKYWrMa2jXhZGaXatv5d-StRzGeS5BfjVRZNnUHRST4zCttt1hPwHHfMoVx8Fb1fgvwXz93R7GWpwkcBg8-5G51thTl4vsHAly7RHM1mqXmR5xJKziqKpzNed4ZvfYgAx-bgcPDZoUNue=s16000)

다시 오른쪽 점 세 개 버튼을 눌러 편집을 고릅니다.

그리고 아래 그림과 같이 기존에 예약된 IP 주소를 클릭해서 우리가 만들었던 main-ip를 선택합시다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhGK7MzDwnt1bsWNyXzTRlDHbx0D0WInMs_xbNMcL1cZTRtqzS8FF2j1ka1mxsF7709PMZZnCXwwTFxTLunmINDeoalqVdFT9nIJrwemqq06hpByCINAc3GGMj_QaLkgNZjGmllJcstQvl9KXEC3-KtAYaKbmsrfKRRtlZkXzSYobFIH6g_hfA9lb0B=s16000)

업데이트를 누르고 나서 다시 나오면 최종적으로 아래와 같이 나타날 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgBUj1Mvk_t8xp4ewzcnAXLWSJcF5hsNSvSzi-gTScCizI70V1SoTKEWK0_oZf8q1nyPLk23vAHTdXaW22y3ReUqK1GXj4gRaPBdhmlKM5cqt2MejScHp5UfNBpshcQiwPDo2Yr5SfLVZiqbvZqo5ni49sYsqZljx5pToNQmpWPfZCEOVBOSrka-sDf=s16000)

저는 주소를 지웠는데요.

주소 옆에 "예약됨"이라고 나오는 주소가 바로 여러분의 가상 서버의 고정 IP가 되는 겁니다.

잘 메모하여 기억해 두면 됩니다.

이제 두 번째 인스턴스에서도 똑같이 예약된 공용 IP를 지정하면 됩니다.

---

## 가상 서버에 SSH 원격 접속하기

터미널 창을 하나 엽니다.

윈도 사용자라면 WSL 추천드립니다.

일단 위에서 우리가 예약한 IP가 고정 IP가 되는 거고, 아까 받았던 SSH 키가 비밀번호 같은 게 되는 겁니다.

```bash
ssh -i ssh-key-2022-08-07.key ubuntu@111.222.33.444
```

위와 같이 하면 SSH 전용키로 원격 접속하는 명령어인데요.

"yes"를 입력하면 처음에는 에러가 뜰 겁니다.

전용키는 무조건 본인만 읽을 수 있게 권한이 설정되어야 하거든요.

다음과 같이 접근 권한을 조정합시다.

```bash
chmod 600 ssh-key-2022-08-07.key
```

위와 같이 하면 아래 그림처럼 접근 권한이 본인만 가지게 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhnM05Z8x7DdzqGuEZH5oGJLWoNoTOIH1PJtOViX5zQswKUWNnY7XvIGAvrX8kCLHsgcJs-n-Mg886qWNR2Utn1ZX0ve3auhkvz2vtNoJakqSeIbz46h8ngQkomwyxWTNhTu8_dMIZX2vAhkjPHqM7m47kINhhL5OiY2V7qa0X1rWrkRXbUBqwLUkjQ=s16000)

이제 다시 명령어로 원격 접속해봅시다.

```bash
ssh -i ssh-key-2022-08-07.key ubuntu@111.222.33.444
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEgNoDtl9P1HI8yAHxSFcvykUBZk0c2Gx_nqk53JAVhLz4kAxy_7Wiye-dJgD3ZtupbTAXKGWSio0SHvqW-wtCQZsXHNgMSK_rDI7JHpg06KNtsjPazYiiN-bR4SleWM31AbJe_niUK3zsQY0PnKW0EsefTtf44wQuqKrni07tkMsEzVRY0iJRrbLIQt=s16000)

위와 같이 정상적으로 가상 서버인 우분투 22.04에 접속하는데요.

리전이 서울이다 보니까 속도도 빠르고 가상 서버치고는 메모리도 1GB나 됩니다.

디스크 용량도 무료 44GB나 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhbqBq06AYT7P48NPYkkuG3bZzeTTScjDtFWsO1_Hu0oiQPZZRPElohiDlgCx8n5Vmn2P1dRk-Ibky4jAIxS1UJRLONIdbL-IkTOoUdDwOhg7XQQMtE60bGj96Q_wR-vSumId48CFaKeiU8pDWGTft57sjJzMskKJXE76skLKOtNuGDzrmqENpcMgsH=s16000)

일단 아래 명령어로 우분투를 업데이트 업그레이드합시다.

마지막에는 nano라는 텍스트 에디터를 설치하라고 추가한 겁니다.

```bash
sudo apt update && sudo apt -y upgrade & sudo apt install -y nano
```

꽤 시간이 오래 걸리는데요.

아래 그림처럼 Process triggers for initramfs-tools 가 나오면 엔터키를 누릅니다.

그러면 아래와 같이 프로세스가 정지하는데요.

여기서 fg를 입력하고 엔터키를 치면 다시 작업이 이어집니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiXeinhVfwvAfZfcGIHsn-iMJmSHtpkp1-1SOatebzf2E0sRHvjJ4dnEU_6l8z_pxlVvWK0SbTaNEUlN9qgzHjeFipyWcgsRtgEqE1rRxNDxsfadwzm0q1ngi330H2mGiesFZ0zEnL9Olw97MJ7bn2JOEOBObaFzdVNkoSBDao4AJXW4fYZ8bQ_xjSx=s16000)

계속하다 보면 화면이 바뀌는데 우분투 서버판이라 그렇습니다.

별다른 옵션 없이 OK만 선택하면 됩니다.

---

## 스왑 메모리 확보하기

이제 가상 서버에 스왑 메모리를 확보할 예정인데요.

왜 스왑 메모리가 필요하냐면 메모리 1GB로는 웹 서버로써 부족할 거 같아 만일의 사태에 대비하기 위해 스왑 메모리를 설정할 예정입니다.

일단 아래와 같이 터미널 명령어를 계속 수행해 나가면 됩니다.

```bash
sudo fallocate -l 2G /swapfile

sudo chmod 600 /swapfile

sudo mkswap /swapfile
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEhv3CKnkxixLWe9deCtbNrSaiP_rSFCj1AFmz3XRKi07pHcxN62O-HO6K5ZkdfmVwnHzjH6V8RvCQbdqE24YFoOGO811qCScaFLNqaO0ZBZudLBC7xp5E0nyJVaeFwCycV9y7RwvQX_k7VQoi1du7jbFBvxDQYoKuGveEtHXK-t5dNKaD5TjpXAlMh3=s16000)

위와 같이 나오면 스왑 파일이 성공적으로 생성된 겁니다.

이제 다음 명령어를 추가로 내립시다.

```bash
sudo swapon /swapfile

sudo swapon --show
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEiyhvtSFgjUc0OfGkpdYAj78StOxbHQezf-9Hx5Nqoi6N2uxzzuyzpDJJI6_dDerkY3jtF80M6Q2dSMnATQF3qXh7jbf4f7RvCWRT9h78aig5AR6DKxkmImYxXyT1iO47VPR_pnYPTHlFo5Q2w9ijj7UrsE_9uRIr0wSS16SNY6Wd55qzDIfeIL1hUi=s16000)

위와 같이 나오면 정상입니다.

이제 아래 명령어로 정확한 양을 한번 체크해 봅시다.

```bash
free -h
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEjIQb9xnr8C_qc59ooDTbsatxgaw6SYrJVEqL3sULpkMAmDAWDCDoWcE-EJf9RjZV_XkPsluzCiHomXNzr4qrWUdXolZWGVAeGRZbdr6EGjtjw4Q9HDFT4XsLQh80sXgdr6b-ZN9HZgFASpWTA0LFsnqwHBifAxZT3YFPCgAnAL1quvl9EU2TKRoNpO=s16000)

위와 같이 2기가 바이트가 스왑 파일로 설정되었네요.

이렇게 하면 스왑 파일 설정이 끝난 게 아닌데요.

왜냐하면 서버가 재부팅되면 위와 같은 스왑 파일 설정이 다 날아가기 때문입니다.

그래서 그걸 방지하기 위해 아래와 작업을 해야 합니다.

```bash
sudo nano /etc/fstab
```

fstab은 서버가 부팅될 때 자동으로 디스크를 마운트 시키는 역할을 하는데요.

아래 그림과 같이 nano 편집기로 수정 바랍니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEj_PFGWe7eHg0F4KL4d-FP0bCXg4sy-Q00EbfGi5OKq1BbqOqV-P4z9j5QmdQ8oi9xEaBC99m4nI2_LEb8caxRcKe6-0Z31uIx9LaOf6vlqD42a9ypCHFN5GjY86kEH3hzyKkSKqMyo34pMQfazJ-Uri4dsjY4g1TE1q4068KHoZArRwy5DRQQk65HS=s16000)

```bash
/swapfile swap swap defaults 0 0
```

위와 같은 내용을 nano 편집기로 탭으로 구분하여 적어 넣으면 됩니다.

nano 편집기로 편집이 끝나면 컨트롤 + O 버튼을 눌러 저장하고, 다시 컨트롤 + X로 나가면 됩니다.

이제 스왑 파일 설정이 완료되었고요.

그다음으로 시간 설정을 해야 합니다.

```bash
sudo timedatectl set-timezone Asia/Seoul

timedatectl
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEiLN_Q5fRHNOyKMVeME_llgimtn_yPHmw0RgWB29LdIL5wKDA1wsfoluAowIcebyjX6biAXFgq9m0wYWAtuqGgDEGduEzjvYVvxXLE1cFdNXxDiBJ6BtZzKd12woLB0WneRcD_vhPmuz8PTLLOqqjrAAiEWc3KmjwuTF3kPB6gZou8D4I3xYfrDJ74A=s16000)

이제 가상 서버 세팅이 완료되었습니다.

---

지금까지 첫 번째 구획인 cpro95-main의 가상 서버 세팅인데요.

두 번째 구획인 cpro95-sub의 가상 서버도 똑같이 세팅해 주시면 가상 서버 2개가 생기는 결과가 됩니다.

본인이 원하는 서버를 구축할 수 있으니 많은 도움이 될 겁니다.

그럼.

