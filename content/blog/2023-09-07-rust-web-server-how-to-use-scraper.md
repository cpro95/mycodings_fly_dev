---
slug: 2023-09-07-rust-web-server-how-to-use-scraper
title: Rust 웹 서버 만들기 3편. scraper를 이용해서 러스트로 웹 스크래핑하기
date: 2023-09-07 13:45:21.053000+00:00
summary: reqwest로 요청해서 얻어온 HTML에서 scraper로 데이터 뽑아내기
tags: ["scraper", "rust", "reqwest", "web server", "web application"]
contributors: []
draft: false
---

안녕하세요?

지난 시간에 이어 다시 Rust로 웹 서버 만들기 강좌를 이어 나가도록 하겠습니다.

지난 시간까지의 글 목록입니다.

[Rust 웹 서버 만들기 1편. Actix Web 그리고 Fly.io에 배포하기](https://mycodings.fly.dev/blog/2023-09-04-howto-rust-web-server-web-application-with-actix-web)

[Rust 웹 서버 만들기 2편. Rust에서 Reqwest를 이용해서 HTTP 요청(Request)하기](https://mycodings.fly.dev/blog/2023-09-04-how-to-use-rust-reqwest-http-get-post)

---

지난 시간에는 reqwest로 HTTP 요청하는 방법에 대해 알아봤는데요,

오늘은 HTTP 요청으로 얻은 데이터를 가공하는 방법에 대해 알아보겠습니다.

보통 이런 걸 웹 스크래핑이라고 하는데요.

NodeJS 진영에서는 Puppeteer가 아주 유명합니다.

파이선 진영에서는 Playwright가 유명하고요.

우리는 러스트 언어에서 구현해야 하므로 러스트 언어에는 웹 스크래핑 라이브러리가 없나 검색하던중 구글에서 바로 Scraper를 추천해 줬습니다.

오늘은 이 Scraper로 웹 스크래핑하는 방법에 주안점을 두고 글을 써 나가겠습니다.

---

## 웹 스크래핑하고자 하는 목표 설정

제가 만든 사이트가 [myopenvpn.fly.dev](https://myopenvpn.fly.dev) 사이트인데요.

이 사이트는 vpngate.net 사이트에서 openvpn 설정 파일을 손쉽게 구현하고자 제가 만들었던 사이트인데요.

불필요한 정보는 과감히 삭제해서 간략화했으며,

또한, 모바일에서도 잘 볼 수 있게 반응형 UI로 만들었습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiXsRF2BTLaoKveL3ZcjW8TiVdG9pyInymVKywbGEUbmVbPMJA7PHqM19uQa_i4jrVzjCCceF6C5WFiObZqMv_REjx8VICI1NP1MFlTbquu6uoPWaPr9yqgxa-ax4S7gnjYC1tHUs_9oDonJWzSo4iB6qfvB8-38xYoClOHL7PYX057YxCvv1iv8G51mfk)

위 그림이 최종 버전입니다.

그러면 vpngate.net의 어떤 정보를 받아와야 할까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEiN1Hoz-vUuUIHFZRvP7TJIdmcPIBxxm6VXdrMdUX89ww7NUZvlDcIcOq9wrLsrMan0StN8osqz4r0Ncy-pfRnaKNelR03zWkHvgLA9TSTycvMiJpJu_4yIqacQe__2vY0MRBcrWzqInIfk9xr4sqn7D-UXT-91onlHwSRRNIznXSOjE-8IkJSQ993ynw4)

바로 위와 같이 한국 서버의 openvpn config file 링크인데요.

이 링크는 아래와 같은 형식으로 되어 있습니다.

`https://www.vpngate.net/en/do_openvpn.aspx?fqdn=vpn928076402.opengw.net&ip=106.254.53.22&tcp=995&udp=1195&sid=1694094150392&hid=20750467`

이 주소의 URL을 파싱해서 ip, tcp, udp, sid, hid 정보를 얻어와야 합니다.

그러면 실제로 이 정보를 이용해서 직접 다운받는 링크를 만들 수 있습니다.

다운받는 URL 주소를 볼까요?

`https://www.vpngate.net/common/openvpn_download.aspx?sid=1694094150392&tcp=1&host=106.254.53.22&port=995&hid=20750467&/vpngate_106.254.53.22_tcp_995.ovpn`

제가 테스트해 본 결과, ip, tcp, udp, sid, hid 값만 있으면 바로 위와 같이 만들 수 있습니다.

그래서 우리의 최종목표는 이 주소에서 데이터를 추출하는 게 목적인데요.

그러면 이 데이터가 위치한 곳을 찾아야 하는데요.

가만히 보시면 table입니다.

크롬에서 검사를 눌러 실제 html 파일을 보면 다음과 같은 id를 이용하는 걸 볼 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhBG9om-KFmlcMGODHw2DI67p_qPRlL18vGYbt3nusDeW40_grOOikO3Ief8GkuhTxzJq1JMi-tHPgwpSCJSZ8J8EFTiJV1HkZYGOsVfruzUkKmbuavje4n5aJssu8Jp_epXBbQ319Rwf7mKsKWtlNbuiOIqme1jtHRZpsUQqmuzf-bb1pEiH8OMtpLHrY)

id는 바로 "vg_hosts_table_id"입니다.

이걸 이용해서 scraper를 이용해 봅시다.

먼저, Cargo.toml파일에 설치할 패키지를 설정하겠습니다.

```bash
[dependencies]
actix-web = "4.4"
reqwest = "0.11"
tokio = { version = "1", features = ["full"] }
scraper = "0.17"
url = "2.4"
serde = { version = "1", features = ["derive"] }
serde_json = "1"
env_logger = "0.10.0"
```

---

## 테스트를 위한 코드 구축

저는 println! 문을 이용해서 단계별로 내가 짠 코드를 테스트하길 원하거든요.

그래야 안심이 됩니다.

일단 완성품을 작성하기 전에 컴파일되면서 데이터를 출력할 수 있게 임시로 main.rs 파일을 만들겠습니다.

```rust
mod my_scrape_lib;
use my_scrape_lib::scrape_vpn_info;

use actix_web::{ get, App, HttpResponse, HttpServer, Responder };

#[get("/")]
async fn get_vpn_info() -> impl Responder {
    let vpn_info_result = scrape_vpn_info().await;

    match vpn_info_result {
        Ok(vpn_info_vec) => { HttpResponse::Ok().body("Hello world!") }
        Err(err) => {
            eprint!("Error: {}", err);
            HttpResponse::InternalServerError().body(format!("Error: {}", err))
        }
    }
}

#[get("/healthcheck")]
async fn healthcheck() -> impl Responder {
    HttpResponse::Ok().body("Health Check Completed!")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("Rust Actix-web server started at 127.0.0.1:8080");

    HttpServer::new(|| {
        App::new()
            .service(get_vpn_info)
            .service(healthcheck)
    })
        .bind(("127.0.0.1", 8080))?
        // .bind(("0.0.0.0", 8080))?
        .run().await
}
```

get_vpn_info 함수를 서버의 루트 인덱스로 사용했으며,

get_vpn_info 함수는 scrape_vpn_info 함수를 실행하는 역할만 합니다.

나중에 최종본이 완성되면 scrape_vpn_info 함수에서 얻은 벡터 정보를 JSON 형태로 브라우저에 전달하는 API를 만들 예정입니다.

일단 scrape_vpn_info 함수가 있는 my_scrape_lib 모듈을 만들어야 하는데요.

my_scrape_lib.rs 파일을 만들어도 되고, my_scrape_lib 폴더에 그리고 그 안에 mod.rs 파일을 만들어도 됩니다.

러스트에서는 파일, 폴더를 모두 모듈로 인식하기 때문입니다.

저는 my_scrape_lib 폴더에 mod.rs 파일을 만들었는데요.

```rust
use serde::{ Deserialize, Serialize };

#[derive(Serialize, Deserialize, Debug)]
pub struct VpnInfo {
    country: String,
    ip: String,
    tcp: String,
    udp: String,
    sid: String,
    hid: String,
}

async fn request_with_retry(url: &str) -> Result<String, reqwest::Error> {
    let client: reqwest::Client = reqwest::Client
        ::builder()
        .timeout(std::time::Duration::from_secs(10))
        .build()?;

    loop {
        let response = client.get(url).send().await?;
        if response.status().is_success() {
            return Ok(response.text().await?);
        }
    }
}

pub async fn scrape_vpn_info() -> Result<Vec<String>, Box<dyn std::error::Error>> {
    match request_with_retry("https://www.vpngate.net/en/").await {
        Ok(body) => {
            let document = scraper::Html::parse_document(&body);
            println!("{:?}", document);

            let my_table_selector = scraper::Selector::parse("#vg_hosts_table_id").unwrap();
            println!("{:?}",my_table_selector);
             }
        Err(err) => {
            eprint!("Failed to fetch data: {}", err);
            return Err(Box::new(err));
        }
    }

    let imsi = Vec::new();
    Ok(imsi)
}
```

위 코드를 찬찬히 설명해 보자면, 일단 VpnInfo 구조체로 우리가 얻을 자료의 구조체를 정의했습니다.

그리고 request_with_retry 함수를 만들었는데요.

이 함수는 reqwest::get 요청이 성공할 때까지 계속 요청하라는 함수인데요.

왜 이렇게 했냐 하면 제가 만들었던 사이트가 간혹 vpngate.net의 서버 응답이 없으면 전혀 작동하지 않아서, 무조건 vpngate.net의 응답이 올 때까지 기다린 후 작업을 이어 나가도록 했습니다.

이제 핵심 함수인 scrape_vpn_info 함수를 볼까요?

request_with_retry 함수의 리턴타입이 Resutl라서 위와 같이 match와 Ok, Err을 이용해서 뼈대를 구성했습니다.

request_with_retry 함수가 가져오는 값은 전체 HTML 코드인데요.

우리는 이걸 직접 파싱 하기보다는 scraper이란 툴을 이용해서 파싱 할 겁니다.

```rust
let document = scraper::Html::parse_document(&body);
```

위 코드에서 reqwest가 받아온 html을 scraper가 인식할 수 있는 document로 만드는 방법입니다.

그리고 다음 코드가 우리가 찾고자 하는 table의 id를 이용해서 찾는 명령어입니다.

```rust
let my_table_selector = scraper::Selector::parse("#vg_hosts_table_id").unwrap();
```

여기까지 테스트해 볼까요?

이 프로그램은 웹 서버니까요, 브라우저에서 새로고침 한번 하시면 됩니다.

그러면 웹 서버가 vpngate.net에 접속해서 데이터를 가져오고 그걸 화면에 뿌려줄 겁니다.

출력결과는 아래와 같습니다.

너무 많아서 조금 줄였습니다.

```bash
 { parent: Some(NodeId(38)), prev_sibling: Some(NodeId(10576)), next_sibling: Some(NodeId(10578)), children: None, value: Text("\n") }, Node { parent: Some(NodeId(38)), prev_sibling: Some(NodeId(10577)), next_sibling: Some(NodeId(10579)), children: None, value: Element(<script async="" src="https://www.googletagmanager.com/gtag/js?id=UA-117138093-1">) }, Node { parent: Some(NodeId(38)), prev_sibling: Some(NodeId(10578)), next_sibling: Some(NodeId(10580)), children: None, value: Text("\n") }, Node { parent: Some(NodeId(38)), prev_sibling: Some(NodeId(10579)), next_sibling: Some(NodeId(10582)), children: Some((NodeId(10581), NodeId(10581))), value: Element(<script>) }, Node { parent: Some(NodeId(10580)), prev_sibling: None, next_sibling: None, children: None, value: Text("\n  window.dataLayer = window.dataLayer || [];\n  function gtag(){dataLayer.push(arguments);}\n  gtag('js', new Date());\n\n  gtag('config', 'UA-117138093-1');\n") }, Node { parent: Some(NodeId(38)), prev_sibling: Some(NodeId(10580)), next_sibling: Some(NodeId(10583)), children: None, value: Text("\n\n") }, Node { parent: Some(NodeId(38)), prev_sibling: Some(NodeId(10582)), next_sibling: Some(NodeId(10585)), children: Some((NodeId(10584), NodeId(10584))), value: Element(<script type="text/javascript">) }, Node { parent: Some(NodeId(10583)), prev_sibling: None, next_sibling: None, children: None, value: Text("\n\n\tvar _gaq = _gaq || [];\n\t_gaq.push(['_setAccount', 'UA-26766422-7']);\n\t_gaq.push(['_trackPageview']);\n\n\t(function () {\n\t\tvar ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;\n\t\tga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';\n\t\tvar s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);\n\t})();\n\n") }, Node { parent: Some(NodeId(38)), prev_sibling: Some(NodeId(10583)), next_sibling: None, children: None, value: Text("\n\n\n\t\t\t") }, Node { parent: Some(NodeId(34)), prev_sibling: Some(NodeId(36)), next_sibling: None, children: None, value: Text("\n\t\t") }, Node { parent: Some(NodeId(32)), prev_sibling: Some(NodeId(34)), next_sibling: None, children: None, value: Text("\n\t") }, Node { parent: Some(NodeId(31)), prev_sibling: Some(NodeId(32)), next_sibling: None, children: None, value: Text("\n") }, Node { parent: Some(NodeId(21)), prev_sibling: Some(NodeId(29)), next_sibling: None, children: None, value: Text("\n") }, Node { parent: Some(NodeId(19)), prev_sibling: Some(NodeId(21)), next_sibling: None, children: None, value: Text("\n\n\n") }] } }
Selector { selectors: [Selector(#vg_hosts_table_id, specificity = 0x100000, flags = SelectorFlags(0x0))] }
```

마지막에 Selector이 보이는데 이게 my_table_selector이고, 그리고 그 위에 있는 게 document입니다.

html 코드를 scraper가 scraper가 인식하기 편하게 바꾼 겁니다. 즉, 파싱(parsing)했다는 뜻입니다.

이제, 웹 스크래핑 준비가 끝났는데요.

원하는 데이터를 추출하러 가 볼까요?

---

## vg_hosts_table_id의 테이블이 3개가 있습니다.

vpngate.net의 html을 잘 보시면 주요 데이터는 거의 테이블인데요.

vg_hosts_table_id 이름으로 된 게 3개나 됩니다.

그리고 제가 원하는 테이블은 3번째이거든요.

이걸 구현해 보겠습니다.

```rust
pub async fn scrape_vpn_info() -> Result<Vec<String>, Box<dyn std::error::Error>> {
    match request_with_retry("https://www.vpngate.net/en/").await {
        Ok(body) => {
            let document = scraper::Html::parse_document(&body);
            // println!("{:?}", document);

            let my_table_selector = scraper::Selector::parse("#vg_hosts_table_id").unwrap();
            // println!("{:?}", my_table_selector);

            let mut table_count = 0;
            for table in document.select(&my_table_selector) {
                table_count += 1;
                if table_count == 3 {
                    println!("{:?}", table);
                }
            }
        }
        Err(err) => {
            eprint!("Failed to fetch data: {}", err);
            return Err(Box::new(err));
        }
    }

    let imsi = Vec::new();
    Ok(imsi)
}
```

마지막 table만 println! 문구를 이용해서 출력하라고 했습니다.

```bash
Some(NodeId(10597)), prev_sibling: None, next_sibling: None, children: None, value: Text("\n\n\tvar _gaq = _gaq || [];\n\t_gaq.push(['_setAccount', 'UA-26766422-7']);\n\t_gaq.push(['_trackPageview']);\n\n\t(function () {\n\t\tvar ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;\n\t\tga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';\n\t\tvar s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);\n\t})();\n\n") }, Node { parent: Some(NodeId(38)), prev_sibling: Some(NodeId(10597)), next_sibling: None, children: None, value: Text("\n\n\n\t\t\t") }, Node { parent: Some(NodeId(34)), prev_sibling: Some(NodeId(36)), next_sibling: None, children: None, value: Text("\n\t\t") }, Node { parent: Some(NodeId(32)), prev_sibling: Some(NodeId(34)), next_sibling: None, children: None, value: Text("\n\t") }, Node { parent: Some(NodeId(31)), prev_sibling: Some(NodeId(32)), next_sibling: None, children: None, value: Text("\n") }, Node { parent: Some(NodeId(21)), prev_sibling: Some(NodeId(29)), next_sibling: None, children: None, value: Text("\n") }, Node { parent: Some(NodeId(19)), prev_sibling: Some(NodeId(21)), next_sibling: None, children: None, value: Text("\n\n\n") }] }, node: Node { parent: Some(NodeId(216)), prev_sibling: Some(NodeId(685)), next_sibling: Some(NodeId(10445)), children: Some((NodeId(689), NodeId(690))), value: Element(<table id="vg_hosts_table_id" cellspacing="0" cellpadding="4" border="1">) } } }
```

실행결과는 대 성공입니다.

즉, 3번째 table을 골랐다는 뜻인데요.

제가 원하는 데이터는 아래 그림과 같이 한 개의 TR로 구성되어 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiN1Hoz-vUuUIHFZRvP7TJIdmcPIBxxm6VXdrMdUX89ww7NUZvlDcIcOq9wrLsrMan0StN8osqz4r0Ncy-pfRnaKNelR03zWkHvgLA9TSTycvMiJpJu_4yIqacQe__2vY0MRBcrWzqInIfk9xr4sqn7D-UXT-91onlHwSRRNIznXSOjE-8IkJSQ993ynw4)

그리고 TR의 첫 번째 TD에서 이미지 말고 텍스트값이 "Korea Republic of"입니다.

즉, 우리나라의 TR에서 7번째 TD에 있는 a 태그의 href 값을 가져오면 되는 거죠.

```rust
pub async fn scrape_vpn_info() -> Result<Vec<String>, Box<dyn std::error::Error>> {
    match request_with_retry("https://www.vpngate.net/en/").await {
        Ok(body) => {
            let document = scraper::Html::parse_document(&body);
            // println!("{:?}", document);

            let my_table_selector = scraper::Selector::parse("#vg_hosts_table_id").unwrap();
            // println!("{:?}", my_table_selector);

            let mut table_count = 0;
            for table in document.select(&my_table_selector) {
                table_count += 1;
                if table_count == 3 {
                    // println!("{:?}", table);
                    let my_tbody_selector = scraper::Selector::parse("tbody").unwrap();
                    if let Some(tbody) = table.select(&my_tbody_selector).next() {
                        let my_tr_selector = scraper::Selector::parse("tr").unwrap();
                        for tr in tbody.select(&my_tr_selector) {
                            let my_td_selector = scraper::Selector::parse("td").unwrap();
                            if let Some(first_td) = tr.select(&my_td_selector).next() {
                                let country_text = first_td.text().collect::<String>();
                                if country_text == "Korea Republic of" {
                                    if let Some(seventh_td) = tr.select(&my_td_selector).nth(6) {
                                        let my_a_selector = scraper::Selector::parse("a").unwrap();
                                        if let Some(a) = seventh_td.select(&my_a_selector).next() {
                                            if let Some(href) = a.value().attr("href") {
                                                println!("{:?}", href);

                                            }
                                        }
                                    }
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
        Err(err) => {
            eprint!("Failed to fetch data: {}", err);
            return Err(Box::new(err));
        }
    }

    let imsi = Vec::new();
    Ok(imsi)
}
```

위 코드에서 break 문구를 이용한 이유는 데이터를 너무 많이 찾지 말고 한 개만 찾으라는 의미입니다.

실행 결과는 아래와 같습니다.

```rust
Rust Actix-web server started at 127.0.0.1:8080
"do_openvpn.aspx?fqdn=vpn115620030.opengw.net&ip=211.46.22.50&tcp=1752&udp=1320&sid=1694096944399&hid=19512800"
```

href 값이 나왔네요.

그러면 여기서 우리가 원하는 ip, tcp, udp, sid, hid 값을 얻으면 됩니다.

위 href 텍스트를 자세히 보면 URL인데요.

URL params 규칙을 따르고 있습니다.

그래서 이걸 앞에 주소를 붙여 정식 URL로 만들고 러스트의 url 라이브러리로 파싱 하면 될 거 같네요.

```rust
pub async fn scrape_vpn_info() -> Result<Vec<String>, Box<dyn std::error::Error>> {
    match request_with_retry("https://www.vpngate.net/en/").await {
        Ok(body) => {
            let document = scraper::Html::parse_document(&body);
            // println!("{:?}", document);

            let my_table_selector = scraper::Selector::parse("#vg_hosts_table_id").unwrap();
            // println!("{:?}", my_table_selector);

            let mut table_count = 0;
            for table in document.select(&my_table_selector) {
                table_count += 1;
                if table_count == 3 {
                    // println!("{:?}", table);
                    let my_tbody_selector = scraper::Selector::parse("tbody").unwrap();
                    if let Some(tbody) = table.select(&my_tbody_selector).next() {
                        let my_tr_selector = scraper::Selector::parse("tr").unwrap();
                        for tr in tbody.select(&my_tr_selector) {
                            let my_td_selector = scraper::Selector::parse("td").unwrap();
                            if let Some(first_td) = tr.select(&my_td_selector).next() {
                                let country_text = first_td.text().collect::<String>();
                                if country_text == "Korea Republic of" {
                                    if let Some(seventh_td) = tr.select(&my_td_selector).nth(6) {
                                        let my_a_selector = scraper::Selector::parse("a").unwrap();
                                        if let Some(a) = seventh_td.select(&my_a_selector).next() {
                                            if let Some(href) = a.value().attr("href") {
                                                println!("{:?}", href);
                                                let complete_url =
                                                    format!("https://vpngate.net/en/{}", href);

                                                if let Ok(parsed_url) =
                                                    url::Url::parse(&complete_url)
                                                {
                                                    let mut vpn_info = VpnInfo {
                                                        country: country_text,
                                                        ip: String::new(),
                                                        tcp: String::new(),
                                                        udp: String::new(),
                                                        sid: String::new(),
                                                        hid: String::new(),
                                                    };

                                                    for (key, value) in parsed_url.query_pairs() {
                                                        match key.as_ref() {
                                                            "ip" => {
                                                                vpn_info.ip = value.to_string();
                                                            }
                                                            "tcp" => {
                                                                vpn_info.tcp = value.to_string();
                                                            }
                                                            "udp" => {
                                                                vpn_info.udp = value.to_string();
                                                            }
                                                            "sid" => {
                                                                vpn_info.sid = value.to_string();
                                                            }
                                                            "hid" => {
                                                                vpn_info.hid = value.to_string();
                                                            }
                                                            _ => {}
                                                        }
                                                    }
                                                    println!("{:?}", vpn_info);
                                                    if !vpn_info.ip.is_empty()
                                                        && !vpn_info.tcp.is_empty()
                                                        && !vpn_info.udp.is_empty()
                                                        && !vpn_info.sid.is_empty()
                                                        && !vpn_info.hid.is_empty()
                                                    {
                                                        let json_output =
                                                            serde_json::to_string(&vpn_info)?;
                                                        println!("{:?}", json_output);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
        Err(err) => {
            eprint!("Failed to fetch data: {}", err);
            return Err(Box::new(err));
        }
    }

    let imsi = Vec::new();
    Ok(imsi)
}
```

그리고 마지막으로 vpn_info를 serde_json으로 JSON 화 했습니다.
실행 결과를 볼까요?

```rust
Rust Actix-web server started at 127.0.0.1:8080
"do_openvpn.aspx?fqdn=vpn115620030.opengw.net&ip=211.46.22.50&tcp=1752&udp=1320&sid=1694096423632&hid=19512800"
VpnInfo { country: "Korea Republic of", ip: "211.46.22.50", tcp: "1752", udp: "1320", sid: "1694096423632", hid: "19512800" }
"{\"country\":\"Korea Republic of\",\"ip\":\"211.46.22.50\",\"tcp\":\"1752\",\"udp\":\"1320\",\"sid\":\"1694096423632\",\"hid\":\"19512800\"}"
```

어떤가요?

vpngate.net 사이트에서 우리가 원하는 데이트를 웹 스크래핑하는 데 성공했습니다.

이제 아까 한 개만 찾으라는 break 를 없애고 한국 서버 전체를 찾게끔 해야 하는데요.

그러면 데이터를 저장하기 위한 벡터가 필요합니다.

```rust
pub async fn scrape_vpn_info() -> Result<Vec<String>, Box<dyn std::error::Error>> {
    let mut vpn_info_vec = Vec::new();

```

위와 같이 scrape_vpn_info 함수의 시작 부분에 mutable 형식의 vpn_info_vec 이라는 빈 벡터를 만듭니다.

그리고 아래와 같이 해줍니다.

```rust
if !vpn_info.ip.is_empty()
    && !vpn_info.tcp.is_empty()
    && !vpn_info.udp.is_empty()
    && !vpn_info.sid.is_empty()
    && !vpn_info.hid.is_empty()
{
    let json_output =
        serde_json::to_string(&vpn_info)?;
    // println!("{:?}", json_output);

    // 아래와 같이 추가 벡터에 저장하는 코드를 작성합니다.
    vpn_info_vec.push(json_output);
}

}
}
}
// 밑에 break문을 없애야 합니다.
// 안 그러면 한 줄의 데이터만 뽑아내기 때문이죠.
//break;

```

마지막으로 break문을 주석처리해 주거나 아예 없애버리면 됩니다.

마지막으로 리턴값을 아래와 같이 벡터로 지정해 줍니다.

```rust
// let imsi = Vec::new();
// Ok(imsi)

 Ok(vpn_info_vec)
```

이제 main.rs 파일에서 리턴값을 손보면 됩니다.

```rust
#[get("/")]
async fn get_vpn_info() -> impl Responder {
    let vpn_info_result = scrape_vpn_info().await;

    match vpn_info_result {
        Ok(vpn_info_vec) => {
            let mut response = Vec::new();
            for vpn_info_json in &vpn_info_vec {
                if let Ok(parsed_json) = serde_json::from_str::<Value>(&vpn_info_json[..]) {
                    response.push(parsed_json);
                } else {
                    eprintln!("Failed to parse JSON data: {}", vpn_info_json);
                }
            }
            HttpResponse::Ok().json(response)
        }
        Err(err) => {
            eprintln!("Error: {}", err);
            HttpResponse::InternalServerError().body(format!("Error: {}", err))
        }
    }
}
```

get_vpn_info 함수를 위와 같이 바꿉니다.

브라우저에 JSON을 보내주는 코드입니다.

실행 결과를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEjwMS9jfGWvK9XU2l5_rUzUOMlHvzRpFaSNcjRPpUM9K5bK_O-e-q_9A6TwwO2-K1L6WzzA5wzIMwqu7XFZxt99Hn4dzYCCm1jkGVquMKiG7caBV3eH3ncJ-A5rmch-ojh-upPOUqzHaYKId7P-d42iTJZfKtaVTAawgAoz5WqpBBfmkv53KMf8J9xUdmg)

데이터가 아주 많이 로드되기 때문에 fetch에서 timeout이 날 수 있습니다.

몇 번의 새로 고침 만에 위와 같이 원하는 데이터를 JSON 형태로 완벽하게 받을 수 있었네요.

최종적으로 vpngate.net 사이트의 vpn 정보를 얻는 API를 완성한 형태가 되었습니다.

지금까지 러스트로 웹서버 만들기를 해봤는데요.

다음 시간에는 우리가 얻은 이 JSON 형태의 데이터를 브라우저에 보기 좋게 보여주는 작업을 해 보겠습니다.

참고로 아래는 my_scrape_lib/mod.rs 파일의 전체 코드입니다.

```rust
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct VpnInfo {
    country: String,
    ip: String,
    tcp: String,
    udp: String,
    sid: String,
    hid: String,
}

async fn request_with_retry(url: &str) -> Result<String, reqwest::Error> {
    let client: reqwest::Client = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(10))
        .build()?;

    loop {
        let response = client.get(url).send().await?;
        if response.status().is_success() {
            return Ok(response.text().await?);
        }
    }
}

pub async fn scrape_vpn_info() -> Result<Vec<String>, Box<dyn std::error::Error>> {
    let mut vpn_info_vec = Vec::new();

    match request_with_retry("https://www.vpngate.net/en/").await {
        Ok(body) => {
            let document = scraper::Html::parse_document(&body);
            // println!("{:?}", document);

            let my_table_selector = scraper::Selector::parse("#vg_hosts_table_id").unwrap();
            // println!("{:?}", my_table_selector);

            let mut table_count = 0;
            for table in document.select(&my_table_selector) {
                table_count += 1;
                if table_count == 3 {
                    // println!("{:?}", table);
                    let my_tbody_selector = scraper::Selector::parse("tbody").unwrap();
                    if let Some(tbody) = table.select(&my_tbody_selector).next() {
                        let my_tr_selector = scraper::Selector::parse("tr").unwrap();
                        for tr in tbody.select(&my_tr_selector) {
                            let my_td_selector = scraper::Selector::parse("td").unwrap();
                            if let Some(first_td) = tr.select(&my_td_selector).next() {
                                let country_text = first_td.text().collect::<String>();
                                if country_text == "Korea Republic of" {
                                    if let Some(seventh_td) = tr.select(&my_td_selector).nth(6) {
                                        let my_a_selector = scraper::Selector::parse("a").unwrap();
                                        if let Some(a) = seventh_td.select(&my_a_selector).next() {
                                            if let Some(href) = a.value().attr("href") {
                                                println!("{:?}", href);
                                                let complete_url =
                                                    format!("https://vpngate.net/en/{}", href);

                                                if let Ok(parsed_url) =
                                                    url::Url::parse(&complete_url)
                                                {
                                                    let mut vpn_info = VpnInfo {
                                                        country: country_text,
                                                        ip: String::new(),
                                                        tcp: String::new(),
                                                        udp: String::new(),
                                                        sid: String::new(),
                                                        hid: String::new(),
                                                    };

                                                    for (key, value) in parsed_url.query_pairs() {
                                                        match key.as_ref() {
                                                            "ip" => {
                                                                vpn_info.ip = value.to_string();
                                                            }
                                                            "tcp" => {
                                                                vpn_info.tcp = value.to_string();
                                                            }
                                                            "udp" => {
                                                                vpn_info.udp = value.to_string();
                                                            }
                                                            "sid" => {
                                                                vpn_info.sid = value.to_string();
                                                            }
                                                            "hid" => {
                                                                vpn_info.hid = value.to_string();
                                                            }
                                                            _ => {}
                                                        }
                                                    }
                                                    // println!("{:?}", vpn_info);
                                                    if !vpn_info.ip.is_empty()
                                                        && !vpn_info.tcp.is_empty()
                                                        && !vpn_info.udp.is_empty()
                                                        && !vpn_info.sid.is_empty()
                                                        && !vpn_info.hid.is_empty()
                                                    {
                                                        let json_output =
                                                            serde_json::to_string(&vpn_info)?;
                                                        println!("{:?}", json_output);
                                                        vpn_info_vec.push(json_output);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        Err(err) => {
            eprint!("Failed to fetch data: {}", err);
            return Err(Box::new(err));
        }
    }

    Ok(vpn_info_vec)
}
```

그럼.