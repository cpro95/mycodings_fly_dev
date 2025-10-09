---
slug: 2023-08-21-how-to-avoid-my-fly-io-app-sleep-issue
title: SvelteKit 실전 예제 6편 - Fly.io에 배포한 앱을 영구히 잠들지 않게 하는 방법
date: 2023-08-21 09:18:44.705000+00:00
summary: Fly.io에 배포한 앱을 영구히 잠들지 않게 하는 방법
tags: ["fly.io", "sveltekit", "sveltejs"]
contributors: []
draft: false
---

안녕하세요?

얼마 전에 끝났던 SvelteKit 실전 예제에서 만든 앱을 Fly.io에 배포했었는데요.

**-지난 시간 강좌 보기-**

[SvelteKit 실전 예제 - Fly.io에 배포(deploy)하기 with 서버 사이드 렌더링](https://mycodings.fly.dev/blog/2023-08-03-how-to-deploy-sveltekit-to-fly-io-with-server-side-rendering)

[SvelteKit 실전 예제 2편 - 서버 사이드 렌더링 풀 스택 무비 앱 만들기](https://mycodings.fly.dev/blog/2023-08-05-sveltekit-server-side-full-stack-example-and-fly-io-deploy)

[SvelteKit 실전 예제 3편 - Github Action으로 자동 배포하기(Auto Deploy)](https://mycodings.fly.dev/blog/2023-08-07-sveltekit-auto-deploy-with-github-action-to-fly-io)

[SvelteKit 실전 예제 4편 - Prisma 설치 후 백엔드 DB 세팅 및 클라우드에 자동 배포하기](https://mycodings.fly.dev/blog/2023-08-07-sveltekit-with-prisma-and-deploy-to-fly-io)

[SvelteKit 실전 예제 5편 - SvelteKit으로 유저 로그인 구현하기(유저 인증)](https://mycodings.fly.dev/blog/2023-08-09-user-authentication-system-in-svetlekit)


그냥 기본값으로 배포했던 테스트 앱이 일정 시간 동안 사용자가 접속하지 않자 잠자기 모드로 돌입하게 되었습니다.

실제 Fly.io에서 설명하기로는 앱이 Firecracker VM이라서 300ms 만에 다시 작동한다고 하는데요.

실제로는 꽤 오랜 시간이 지나야 접속이 되더라고요.

그래서, 오늘은 Fly.io에서 공식적으로 제공해 주는 방식으로 잠자기 모드로 들어가지 않도록 할 예정입니다.

---

## Fly.toml 세팅 파일 손보기

공식 홈페이지에 다음과 같이 부분이 있습니다.

```bash
  [[services.http_checks]]
    interval = 10000
    grace_period = "5s"
    method = "get"
    path = "/"
    protocol = "http"
    timeout = 2000
    tls_skip_verify = false
    [services.http_checks.headers]
```

VM(가상머신) 관련 세팅인데요.

http_checks라는 의미에서도 알 수 있듯이 interval 마다 즉, 일정 시간마다 VM(가상머신)의 http 연결 커넥션을 체크할 수 있습니다.

10000ms면 10초네요.

여기서 path라는 부분이 커넥션 테스트할 경로인데요.

이제 이 코드를 우리가 만든 부분에 적용하겠습니다.

일단 우리 프로젝트에 있는 fly.toml 파일에 아래 내용을 추가하도록 하겠습니다.

```bash
# fly.toml app configuration file generated for my-svelteki-test2 on 2023-08-03T22:20:33+09:00
#
# See https://fly.io/docs/reference/configuration/ for information about how to use this file.
#

app = "my-svelteki-test2"

...
...
...

[http_service]
  internal_port = 3000
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0
  processes = ["app"]

[[http_service.checks]]
  grace_period = "10s"
  interval = "30s"
  method = "GET"
  timeout = "5s"
  path = "/healthcheck"
```

저는 경로명을 healthcheck 이라고 지정했습니다.

그러면 우리 앱 주소가 'https://my-svelteki-test2.fly.dev/'이기 때문에 healthcheck 주소는 다음과 같습니다.

'https://my-svelteki-test2.fly.dev/healthcheck'

그러면 이 healthcheck 이라는 route를 만들어야 하는데요.

일단 src/routes 폴더 밑에 healthcheck 폴더를 만들고 그 밑에 +server.ts 파일을 만듭니다.

```js
import { db } from "$lib/database";

export async function GET({ request }: { request: Request }) {
  const host =
    request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");

  try {
    const url = new URL("/", `http://${host}`);
    // if we can connect to the database and make a simple query
    // and make a HEAD request to ourselves, then we're good.
    await Promise.all([
      db.user.count(),
      fetch(url.toString(), { method: "HEAD" }).then((r) => {
        if (!r.ok) return Promise.reject(r);
      }),
    ]);
    return new Response("OK");
  } catch (error: unknown) {
    console.log("healthcheck ❌", { error });
    return new Response("ERROR", { status: 500 });
  }
}
```

이 코드는 우리 앱이 호스팅 된 서버에 접속해서 DB 부분이 잘 작동하는지 그리고 인터넷 연결이 되고 있는지를 체크하는 로직인데요.

서버사이드 로직입니다.

Promise.all 부분에 잘 보시면 db.user.count() 문구가 있는데 이 부분은 Prisma가 제대로 작동하고 있는지 체크하는 부분이고, 그 밑은 그냥 인터넷 연결을 체크하는 부분입니다.

다 만들었으면 실제 연결해 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEgD8dvkIqTtVUFimTeMy9YSTFU1CfnhGmuhoTeK9VYgzYApdljLMDGDlk08n_E74gBpsGEdOry_e7gvJyGISZ_MuAVidFq5cYjXwF9GymNHg98Tz6DGnCl-octSQw83FammjuoltoBMdoHzXPdx7JYWJ3sZ1FjdAOymrSO29gvz2m_RG0BdFdfr0gFpy4w)

위 그림과 같이 OK라고 표시됩니다.

인터넷 커넥션이 정상이고 DB도 정상 작동한다는 얘기죠.

이제 git commit 하면 Github Action에 의해 Fly.io에 다시 Deploy가 될 겁니다.

앞으로는 우리 앱이 잠자는 경우가 없을 겁니다.

그럼.



