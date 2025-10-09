---
slug: 2022-07-23-how-to-insert-google-analytics-into-remix-framework
title: Remix Framework에 구글 애널리틱스 적용하기
date: 2022-07-23 06:19:31.406000+00:00
summary: Remix Framework에 구글 애널리틱스 적용하기
tags: ["remix", "google analytics", "ga4", "react"]
contributors: []
draft: false
---

안녕하세요?

새로운 블로그를 오픈하면서 구글 애널리틱스 적용을 시도해 보았습니다.

제가 쓰는 블로그 시스템은 Remix Framework으로 만든 Speed Metal Stack인데요.

기본 뼈대는 Remix라서 일단 구글링을 해보고 테스트해봤는데 정상적으로 작동하더라고요.

이제 어떻게 구글 애널리틱스를 Remix 프레임워크에 적용시키는지 알아보도록 합시다.

먼저, 구글 애널리틱스 계정이 있어야겠죠.

자신의 계정에 들어가서 아래 그림처럼 왼쪽 아래 관리 버튼을 클릭하도록 합시다.

![mycodings.fly.dev-howto-attach-google-analytics-to-remix](https://blogger.googleusercontent.com/img/a/AVvXsEgH1b7U51Ej4RKXkB_W1IsB9Rcv31TwhFsqiwQ0DuRgCyKh9tNkbM29zXAiqdFyBCJxFTLt2pEOh49qQMS86t5dMaKLa3cVGk7e9ctoJSnu4l7vlDk4gTLvyc6UAcmq_dSIOkhhoHKYpm3sn8akMVusMEfTm-NNcRT2S6Dr0j33Vn4KIkA5dPsgYBCD)

그러면 아래 그림처럼 계정 만들기와 속성 만들기가 나오는데요.

계정은 당연히 있을 거고, 추가로 속성을 만들면 됩니다.

![mycodings.fly.dev-howto-attach-google-analytics-to-remix](https://blogger.googleusercontent.com/img/a/AVvXsEiwpchaCthgI8PGw4NGIalHWFfb3bDfmQZVhTbEvq5-4lWbVgfkwqSTRZzbIr6zG9OSskX-hUhaCSmu-n15mpislRxVIvSLTYGUv723HoWctAYb6nDGv28UcscMntbj08rsPy1aCGnVjlV6cLl2UN45ihdDjCqyQtmV2lAGVS31lly1PrZr2DeqmRFD)

아래 그림처럼 속성 이름을 적어놓고 맨 밑에 다음 버튼을 누릅시다.

속성 이름은 보통 쉽게 이해할 수 있도록 자기가 추적하고자 하는 사이트 이름을 적는 게 좋습니다.

![mycodings.fly.dev-howto-attach-google-analytics-to-remix](https://blogger.googleusercontent.com/img/a/AVvXsEjVYwEv64wEsWi8mhtfsNSojSUmCpLLjBqH1CGs0qv4zBF-aNfNxcZDYVTxZ0XiEwWAox7vQ6w8OeAZW_HbJby7dP5q--Wgf1w5qIAERN1lz962WuocKdsVfW2QNegveo7ljdGnWl4KBhDa2BfAbThbWbVy25aM6ndLNstSrdvDLyawQOSC0RUqo1S3)

다음으로 간단한 설문 조사가 나오는데요.

대충 선택하면 됩니다.

![mycodings.fly.dev-howto-attach-google-analytics-to-remix](https://blogger.googleusercontent.com/img/a/AVvXsEijmYS95bdnd9W2xgQxnwVOWrs3G_LdR7JM3OCMX8FZWDoIETVlO-loRUJfbvTB1fSHJcjcbeJwMkSZ3gB44lqMMcdM7NknidD_7OpMUtkB0-1ctlLowYy8el18if8DQ1s-0Ty1KY9RsXfvH1UqncOZjrTie4ntZJCbuuUzk_QiLDrxlxNMx1C4rFhA)

다음 단계가 중요한데요.

데이터 수집을 위한 플랫폼을 선택해야 합니다.

우리는 당연히 웹이겠죠.

![mycodings.fly.dev-howto-attach-google-analytics-to-remix](https://blogger.googleusercontent.com/img/a/AVvXsEi6zEJSUcsJUTHkM9Z2uvy2nGBNKE8Am_8q4h1j1ZxdT7RD9rgpRTbHqoWnwv62OlsL6bMbqwwXldW_8Hw4_iRVJYsiARS5V8KArHEF3LhDih5QP0FaWPTdP4nT8b1J9_XsklAvLx33qsMjso9OSqqN5ww7G9JGSD-4fhFLpCT4M3a-WZnSqcnY8fn8)

다음으로 위에서 웹을 선택했으니까 실제 웹사이트 주소를 넣어줘야 합니다.

![mycodings.fly.dev-howto-attach-google-analytics-to-remix](https://blogger.googleusercontent.com/img/a/AVvXsEgLxAo8yszAJWiIrzRtG0tdaD7b3WG4109S6Y7ehDSO2bgwWezbYBtEQBmU3tOqQ1ozLT3mR0zVzDJEF76tSCrhqrjIMLcoWmEnJKaZ4f5ObNn-5klUHRfTL38iv9cwBFyToqvU_ByuZoLdKar_bLMgUapJ6uzi6GDh0kv1uwDlKtjCk-uIN64y3MSr)

그리고 나서 스트림 만들기 버튼을 눌러주세요.

참고로 지금까지 만들었던 속성을 지우려면 아래 그림처럼 속성 설정에서 오른쪽 위에 "휴지통으로 이동" 버튼을 눌러 삭제하면 됩니다.

![mycodings.fly.dev-howto-attach-google-analytics-to-remix](https://blogger.googleusercontent.com/img/a/AVvXsEj1GD13EX6nO09le5YQulPWrqY2N3x35TwLDHzDE91bYnwnN6EzHGGIOhrazSF3PS1G556hJim7w-mpxgFRCuc6wHMAMARezlziHVSSBUSIZb__i3ngUBqli2jugSCtNpL-SMeYTSlSetcHs6u8H7m8-AWWM60VjgDCHSmQnuOwjm1cRMqmn7I5QqCh)

이제 데이터 스트림 관련하여 코드를 우리의 사이트에 적용해야 합니다.

위 그림에서 왼쪽에 데이터 스트림 버튼을 눌러주면 아래와 같이 나옵니다.

![mycodings.fly.dev-howto-attach-google-analytics-to-remix](https://blogger.googleusercontent.com/img/a/AVvXsEjnhTH48IBoUfSmpZSt1fj_mL-YgeVqmyWPQqCY2LzXnZ8DQAulmkODaOW8ZZInOjDFt6ql2pVGpjyhLQ8Uho2kOccDk4q3Wv2ltJ8t1Sl1YFSOGP_3_AiERlY5FAmmznM05HOAqFje4a6wTUkqJ26ALAgKt5TX0akgoPk9x6VtcxVn5GspZVsmauZ6)

위 그림에서 보듯이 구글 애널리틱스 관련 중요 정보가 나오는데요.

우리가 필요한 정보는 바로 측정 ID입니다.

그리고 우리가 삽입할 자바스크립트 코드는 아래와 같이 나오는데요.

![mycodings.fly.dev-howto-attach-google-analytics-to-remix](https://blogger.googleusercontent.com/img/a/AVvXsEhY6UQXaJLk-n8x9D2AbO0EEEEJ14iti7AnrHk5-6I_N5mxq2WIxCo7JIMazqhBNsMGUAEMd3be7GJPALBYAEjEREHTK2vQNhiVHGx_AOSmT19vI5ZeDL49S1EdpUFRC8d3tCxYdilr9ybrIcMIZIHV30jksxS4XUDmyBoCA0taHRMdFcUjIvIDFzxD)

이 코드를 참고해서 실제 Remix 코드에 삽입해 보겠습니다.

## Remix 코드에 gtag 적용하기

구글 애널리틱스에서 만든 gtag는 타입스크립트가 아니기 때문에 타입을 별도로 만들어 줘야 하는데요.

일단 app 폴더 밑에 utils 폴더를 만들어서 거기에 아래 이름으로 파일을 하나 만듭니다.

```js
/app/utils/gtags.client.ts
```

Remix 프레임워크에서 파일 이름에 client가 붙으면 이 파일은 무조건 client에서만 작동되게 됩니다.

반대로 server라는 이름이 붙으면 이 코드는 무조건 서버 사이드 쪽에서 작동하게 됩니다.

아래는 gtags.client.ts 파일의 내용입니다.

```js
declare global {
    interface Window {
      gtag: (
        option: string,
        gaTrackingId: string,
        options: Record<string, unknown>
      ) => void;
    }
  }
  
  /**
   * @example
   * https://developers.google.com/analytics/devguides/collection/gtagjs/pages
   */
  export const pageview = (url: string, trackingId: string) => {
    if (!window.gtag) {
      console.warn(
        "window.gtag is not defined. This could mean your google analytics script has not loaded on the page yet."
      );
      return;
    }
    window.gtag("config", trackingId, {
      page_path: url,
    });
  };
  
  /**
   * @example
   * https://developers.google.com/analytics/devguides/collection/gtagjs/events
   */
  export const event = ({
    action,
    category,
    label,
    value,
  }: Record<string, string>) => {
    if (!window.gtag) {
      console.warn(
        "window.gtag is not defined. This could mean your google analytics script has not loaded on the page yet."
      );
      return;
    }
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  };
```

코드를 보시면 글로벌하게 Window 객체를 지정했고 우리가 필요한 pageview 함수를 설정했습니다.

왜냐하면 구글 애널리틱스가 pageview를 카운트할 수 있도록 강제로 실행해야 하기 때문입니다.

이제 app 폴더 밑에 root.tsx 파일을 열어보도록 합시다.

이 root.tsx 파일이 Remix 프레임워크의 가장 근본이 되는 시작 페이지입니다.

Next.js에서 _app.js 와 _document.js 파일을 두 개 합쳐놓은 거라고 보시면 됩니다.

이제 root.tsx 파일에 아래 코드를 적절한 위치에 삽입하시면 됩니다.

```js
....
import * as gtag from '~/utils/gtags.client'
import { useEffect } from 'react'
...

function App() {
  const [theme] = useTheme()
  const location = useLocation()
  useEffect(() => {
    gtag.pageview(location.pathname, 'G-711DBPQNDX')
  }, [location])

  return (
    <html lang='en' className={`h-full ${theme ? theme : 'dark'}`}>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <ThemeMeta />
        <Meta />
        <Links />
        {/* <!-- Global site tag (gtag.js) - Google Analytics --> */}
        <script
          async
          src='https://www.googletagmanager.com/gtag/js?id=G-711DBPQNDX'
        ></script>
        <script
          async
          id='gtag-init'
          dangerouslySetInnerHTML={{
            __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-711DBPQNDX', {
                  page_path: window.location.pathname,
                });
              `,
          }}
        />
      </head>
      <body className='h-full bg-white dark:bg-slate-800'>
        <SkipNavLink className='bg-gray-700'>Skip to content</SkipNavLink>
        <div className='flex h-full flex-col'>
          <Nav />
          <main className='flex-1 px-6'>
            <SkipNavContent />
            <Outlet />
          </main>
          <Footer />
        </div>
        <SsrTheme serverTheme={!!theme} />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

export default function AppProviders() {
  const { theme } = useLoaderData<LoaderData>()

  return (
    <ThemeProvider ssrTheme={theme}>
      <App />
    </ThemeProvider>
  )
}

```

위 코드는 제 블로그 시스템인데요.

`<head>` 태그 안에 gtag 소스 링크와 구글 애널리틱스 코드를 삽입했습니다.

그리고 useLocation 훅으로 위치가 바뀔 때마다 useEffect 함수를 이용해서 gtag.pageview 함수를 실행하도록 했습니다.

이제 구글 애널리틱스를 Remix 프레임워크에 적용하는 방법은 다 끝났습니다.

웹에 배포(Deploy)하고 이제 구글 애널리틱스 페이지에서 제대로 작동되는지 볼까요?

![mycodings.fly.dev-howto-attach-google-analytics-to-remix](https://blogger.googleusercontent.com/img/a/AVvXsEiJ8ZtRO_pckEOjnrHhnhItYx1Zp49R8qvorowkpZ-lXsE0xiyqpvk4-0hW-QOO-FhGOBJ82weYjY23sG5_TebSA1drGx_jh-qxjBtmgRCqbc8bxVRW0eCzvP27RMxY7lzh-PvzhO8OySSH04aKbd_xrmKHP3QY3f00GreJi1oCVeNdj7lTncIMGhWi)

위 그림처럼 South Korea에서 접속한 사용자 이력이 정상적으로 나오네요.

지금까지 Remix 프레임워크에서 구글 애널리틱스 적용하는 방법에 대해 알아봤습니다.

그럼.