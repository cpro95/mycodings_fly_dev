---
slug: 2023-01-29-howto-javascript-array-map-async-await
title: 자바스크립트에서 Array.map 함수에서 async, await 사용하기
date: 2023-01-29 09:33:13.309000+00:00
summary: 자바스크립트 배열에서 map 함수 사용 시 비동기 async,await 사용하는 방법
tags: ["javascript", "array", "map", "async", "await", "promise"]
contributors: []
draft: false
---

안녕하세요?

오늘은 자바스크립트 비동기 프로그래밍에서 가장 헷갈릴 수 있는 forEach, map 함수에서 async, await 함수 사용에 대해 알아보겠습니다.

결론적으로 말하면

**비동기 함수에 있어 Array.map 이나 forEach 함수에서 async, await를 사용하면 안 됩니다.**

그럼 어떻게 구현해야 할까요?

---

예를 들어 볼까요?

제가 개인 프로젝트로 유튜브 API를 사용하고 있는데요.

Prisma를 통해 만들었던 Video 테이블에는 youtube_id가 있습니다.

그럼, Video 테이블에 있는 youtube_id를 배열로 얻었고 다시 유튜브 API를 이용해서 youtube_id를 Array.map 함수를 사용해서 해당 비디오의 정보를 가져오는 함수를 만들고 싶은데요.

단순하게 다음과 같이 하면 되겠다 싶은데요.

```js
let youtubeInfo: YoutubeInfo[]

youtubeInfo = myVideo.map(
  async video => await getYoutubeInfoById(video.youtube_id),
)

// return 결과는?
// [
//   {}, {}, {}, {}, {},
//   {}, {}, {}, {}, {}
// ]
```

위 코드의 리턴 결과를 잘 보시면 map 함수와 async, await는 절대 같이 실행되지 않습니다.

그럼 어떻게 해야 할까요?

---

MDN 에서 추천하는 방식은 Promise.all 입니다.

가장 기본이 되는 형식은 아래와 같은데요.

```js
await Promise.all(
    arr.map(async (element) => {
        ....
    })
)
```

Array.map 함수가 필요하면 그걸 전부 Promise.all로 감싸면 됩니다.

그럼 제 사이드 프로젝트에서는 어떻게 했을까요?

바로 다음 코드를 보십시오.

```js
let youtubeInfos: YoutubeInfo[]
if (!allYoutubeId) {
  return json({})
}
youtubeInfos = await Promise.all(
  allYoutubeId.map(
    async (item): Promise<YoutubeInfo> =>
      await getYoutubeInfoById(item.youtube_id),
  ),
)

return json(youtubeInfos)
```

제가 원하는 데이터는 youtubeInfos라는 배열 데이터입니다.

이 배열에 원하는 allYoutubeId 배열의 정보를 이용해서 유튜브 정보를 하나씩 추가하면 되는데요.

작동 원리는 다음과 같은데요.

Promise.all에 map 함수를 돌리면 map 함수가 하나씩 실행되는 게 전부 Promise가 된다는 전제에서 map함수와 async, await를 같이 쓸 수 있다는 겁니다.

그래서 위 코드에서도 map 함수 안에 리턴 되는 타입도 `Promise<YoutubeInfo>`처럼 Promise로 처리했습니다.

이러면 async await를 map 함수에서 돌릴 수 있는데요.

실행 결과는 아주 만족스러웠습니다.

앞으로 배열을 map으로 async, await 하고 싶으면 Promise.all을 이용하면 됩니다.

그럼.
