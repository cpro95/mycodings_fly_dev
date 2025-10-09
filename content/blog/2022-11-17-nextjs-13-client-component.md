---
slug: 2022-11-17-nextjs-13-client-component
title: Next.js 13의 Client Component 살펴보기
date: 2022-11-17 13:01:30.860000+00:00
summary: Next.js 13의 Client Component 살펴보기
tags: ["next.js", "client component"]
contributors: []
draft: false
---

![](https://blogger.googleusercontent.com/img/a/AVvXsEimNTZae_0VPdkLTHLn29SuTWCB0KdexrpaVhqbDUkXvjnoFzoXmusY7ZjO64-6UjxKGSbZubaGn0dK1aEEZ5yP8_N9NJjg6YAxz6Ax_o_SE9k12r5Xe2n-IerYo6eM-oNlGzaPDWVty0CShde9RmCT-_XtNkpJWnDU_GNb2MGiHCQh4HO5PuGTA7lV=s16000)

안녕하세요?

오늘은 지난 시간에 이어 Next.js에 대해 좀 더 알아보겠습니다.

지금까지 우리는 Next.js가 버전 13이 되면서 모든 컴포넌트가 서버사이드라고 배웠는데요.

클라이언트 사이드 쪽 컴포넌트는 어떻게 만들 수 있는지 알아보겠습니다.

Next.js 공식 홈페이지에 가면 아래와 같이 언제 서버 컴포넌트를 쓰고 언제 클라이언트 컴포넌트를 사용해야 하는지 명확히 구분해 주고 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEh2Z5RLFc5Z24xhKXsiAqyI7667FgmKhIAu4qDugXkKh4LB3qgEbYFQo8o343_PTDuR5LxTTNqhDz2W_XGPmhS-_8xEf0NiL6lTqaTXYaL-44hTMmzN00KWom9PFDEp4vCwXtH0yfpiOCG6SrCu1-R-Q7chtJnGA1bk_ESNjXovrvNtO6ReVi0wHHwe=s16000)

위 그림을 보시면 대충 React 관련 기능을 쓰려면 클라이언트 컴포넌트로 작성해야 된다고 알 수 있습니다.

Next.js에서는 컴포넌트가 클라이언트에서 작동하라고 지정하는 디렉티브를 쓰는데요.

파일 첫 줄에 'use client'라고 입력하면 그 파일은 클라이언트 컴포넌트로 취급되고 컴파일됩니다.

<hr />
## 예제를 통해 클라이언트 컴포넌트 작성

그럼 Search 기능을 이용해서 클라이언트 예제를 작성해 보겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhvdFLaLJClCmY9MjZE5SdeqPY32Hy54pkjtStQU492ZZPAIruGn1vMaYiZr8xymoykZkUkAdpl9cFDaXJ2bPnT54S4-PiCZfHLO3PKR1tnhRNsktJbTWIw-Cbk0bt4qsJMun-3nsiBEKG2jie7joUsLCLKT7F-KGE_Hpg4shhPIW0qwNZLbcMV-_I7=s16000)

위 그림이 우리가 만들 최종본인데요.

먼저, app 폴더 밑에 search 폴더를 만들고 page.tsx 파일을 만들어 봅시다.

/app/search/page.tsx이라 주소 경로는 /search가 됩니다.

```js
import React from 'react'

type Props = {}

function SearchHome({}: Props) {
  return <div>Plese Search whatever you want to search!</div>
}

export default SearchHome
```

만약에 위 코드에서 useState를 쓴다고 했을 때 어떻게 될까요?

```js
import React, { useState } from 'react'

type Props = {}

function SearchHome({}: Props) {
  const [search, setSearch] = useState('')
  return <div>Plese Search whatever you want to search!</div>
}

export default SearchHome
```

위 코드처럼 useState를 쓰고 파일을 저장하면 개발서버가 에러를 뿜어낼 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgQdCLCRai8PWx1wDM5SKoUyklPi_PJVJSP7UaSWt_4O33uiXa0RWtgwt4YlqTt_-o8R8Y1lc6n11h4BWjbe7UzBFOnkT75zW6xmnXglCYC1j3XV6ubMqTACnOQffZaDQJCwc0z2gXPCR1i0fNyhvwuoYj24amMR9PN1_tAnm7YbrIciH4CZNu4ySlO=s16000)

위 그림처럼 Next.js 13 버전이 친절하게 클라이언트 컴포넌트를 쓰려면 'use client' 디렉티브를 지정하라고 나옵니다.

그럼 다시 useState 부분은 삭제하고 다시 진행하겠습니다.

Next.js 13 버전은 클라이언트와 서버 컴포넌트를 효율적으로 섞어 쓰도록 권장하는데요.

즉, Nested Layout 형태로 쓰는 게 가장 좋습니다.

즉, 우리가 만들려고 하는 Search 화면에서 input 부분은 클라이언트 컴포넌트로 작성하고,

Search 결과가 나타나는 곳은 Nested 형태로 Layout을 가져가서 데이터를 Streaming 한다는 개념으로 접근하라는 건데요.

우리가 지난 시간에 배웠던 중첩 구조를 여기서도 작성해야 합니다.

/app/search/layout.tsx 파일을 작성해야 하는데요.

search 폴더 밑에 layout.tsx 파일을 만들겠다는 거는 search 폴더 밑으로 같은 layout을 적용하겠다는 얘기입니다.

일단 /app/search/layout.tsx 파일을 다음과 같이 만듭시다.

```js
import React from 'react'
import Search from './Search'

type Props = {
  children: React.ReactNode,
}

function SearchLayout({ children }: Props) {
  return (
    <div className='flex divide-x-2 p-5'>
      <div>
        <h1>Search</h1>
      </div>
      <div className='flex-1 pl-5'>
        <Search />
        <div className='w-full'>{children}</div>
      </div>
    </div>
  )
}

export default SearchLayout
```

위 코드는 flex를 이용해서 왼쪽에 "Search"라고 제목을 나타내는 부분과 오른쪽에 Search 컴포넌트와 그 밑에 children을 넣었습니다.

즉, children 부분에 중첩 레이아웃이 적용되는데요.

/app/search 폴더 밑에 있는 모든 주소는 바로 이 children 자리에 오게 됩니다.

우리는 나중에 /app/search/[searchTerm]/page.tsx 파일을 만들건대요.

이 컴포넌트가 children 자리에 오게 됩니다.

자 그러면 여기서 클라이언트 컴포넌트가 뭐가 될까요?

바로 Search 컴포넌트가 클라이언트 컴포넌트가 됩니다.

왜냐하면 input에 쿼리를 넣고 그 쿼리를 이용해서 데이터를 가져오게 할 수 있게 하는 UI 부분이기 때문입니다.

여기서 Remix Framework과의 차이가 나오는데요.

Remix에서는 라우팅이 예전 php처럼 form을 실제 submit 해서 그걸 action 함수에서 form 데이터를 처리하는 형태를 가지지만,

Next.js 13에서는 form을 실제로 submit 하는게 아니라 그걸 React의 handleSubmit 같은 방식으로 쿼리 값을 가로채서 처리하는 형태입니다.

Next.js 13 버전의 form 핸들링은 현재 우리가 사용하는 React의 form 핸들링을 쓰는 거죠.

그럼 우리 앱에서 유일한 클라이언트 컴포넌트인 Search 컴포넌트를 작성해 볼까요?

/app/search/Search.tsx

```js
'use client'

import React, { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

type Props = {}

function Search({}: Props) {
  const [search, setSearch] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSearch('')
    router.push(`/search/${search}`)
  }
  return (
    <div>
      <form onSubmit={handleSubmit} className='ml-4'>
        <input
          className='mr-4 px-4 py-2'
          type='text'
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder='Input your Search'
        />
        <button
          type='submit'
          className='rounded-lg bg-slate-400 px-4 py-2 text-white'
        >
          Search
        </button>
      </form>
    </div>
  )
}

export default Search
```

위 파일을 보시면 첫 줄에 이 컴포넌트는 클라이언트 컴포넌트라고 디렉티브를 이용해서 명시했습니다.

그러면 이 컴포넌트에서는 useState, useEffect 같은 걸 쓸 수 있는거죠.

코드의 설명은 쉽습니다.

form 부분에서 input submit 한 쿼리를 handleSubmit 에서 처리합니다.

전부 async 함수로 작성해야 하는데요.

나중에 입력한 쿼리를 바탕으로 실제 데이터를 찾는 라우팅으로 router.push 를 합니다.

useRouter 는 Next.js 13 버전에 나오는 'next/navigation'에서 불러왔습니다.

그럼 router.push 하는 주소인 /search/[searchTerm]을 만들어 볼까요?

/app/search 폴더 밑에 /app/search/[searchTerm] 폴더를 만들고 거기에 page.tsx파일을 만듭시다.

이름에서 알 수 있듯이 동적 라우팅이고, 우리가 Search 컴포넌트에서 router.push 를 통해 입력한 쿼리 값을 넘겨주고 있습니다.

```js
import React from 'react'

type Props = {
  params: {
    searchTerm: string,
  },
}

type SearchDataType = {
  place_id: 298418871,
  licence: string,
  osm_type: string,
  osm_id: number,
  boundingbox: Array<string>,
  lat: string,
  lon: string,
  display_name: string,
  class: string,
  type: string,
  importance: number,
  icon: string,
}
const search = async (searchTerm: string) => {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${searchTerm}&format=json`,
  )
  if (!res) return null
  const data: SearchDataType[] = await res.json()
  return data
}

async function SearchResult({ params: { searchTerm } }: Props) {
  const searchResults = await search(searchTerm)
  // console.log(searchResults);

  return (
    <div className='ml-4 border-2 border-yellow-400'>
      you entered :<span className='ml-4'>{searchTerm}</span>
      <ol className='space-y-5 p-5'>
        {searchResults?.map(result => (
          <li key={result.place_id} className='border border-cyan-400'>
            <p>{result.display_name}</p>
            <p>
              lat: {result.lat} / lon: {result.lon}
            </p>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default SearchResult
```

동적 라우팅의 params을 찾는 방법은 지난 시간에 배웠듯이 그냥 서버사이드 컴포넌트에서 params을 가져오기만 하면 됩니다.

위 코드를 보시면 params를 search 함수를 통해 데이터를 불러오는데요.

제가 search 함수에 쓴 무료 API는 openstreetmap API입니다.

Data Type에서도 알 수 있듯이 우리가 입력한 곳의 정보를 json 형태로 제공해 줍니다.

최종적으로 데이터를 search 함수를 통해 얻으면 그걸 화면에 뿌려주는 형태입니다.

실행결과를 한번 볼가요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEhX_rn0wCnsjpDCTXcMXOe5K_psIxDY37I6eoP9JN_ASaKpkGHLmdSamYfscx-JB3a9Kxye-Aw4qHnCMiotOqNyo1TKYYH6hFDzie_3QdpOWXrFbavmM3uku3PO55ao5AHrm0cPA9D1KVuvrGiNeIkJjlr4rVUcYSReL1G5JDpgRpRQdIZZ-R83EECm=w640-h586)

아까 /app/search/layout.tsx 파일에서 지정한 children 부분에 결과물이 위치하는 걸 알 수 있습니다.

노란색으로 테투리를 쳐서 구별하기 쉽게 했습니다.

input search 칸에 다른 쿼리를 넣고 엔터키를 누르면 맨 아래쪽만 리 렌더링 되는 구조입니다.

Nested Layout에 의해 우리에게 필요한 부분만 변경되고 있는 거죠.

<hr />
## loading 컴포넌트 작성하기

우리가 여기서 생각해 보아야 할게 바로 search(searchTerm)인데요.

이 함수가 openstreetmap의 API를 불러오는 함수인데요.

여기가 Bottle-Neck 이 됩니다.

여기서 시간이 잠깐 허비되는데요.

사용자는 뭐가 일어나는지 모르기 때문에 우리는 여기서 loading..... 같이 로딩 중이라는 정보를 알려줘야 합니다.

이 부분은 Next.js 13 버전에서는 쉽게 해결할 수 있습니다.

바로 /app/search/[searchTerm]/loading.tsx 파일을 만들면 되는데요.

loading이라는 이름은 Next.js 13에 의해 예약된 파일 이름입니다.

이 파일을 작성하면 해당 주소(라우팅)에서 Bottle-Neck이 발생하면 loading 컴포넌트를 보여주게 됩니다.

```js
import React from 'react'

type Props = {}

function Loading({}: Props) {
  return <div>Loading.............</div>
}

export default Loading
```

input 칸에 다른 쿼리를 넣고 search 버튼을 누르면 실제 loading... 부분이 보일 겁니다.

<hr />

## 에러 핸들링

Next.js 13에서 도입된 Nested Layout이 좋은 점은 에러가 발생했을 때도 그 에러의 처리를 중첩된 위치에서 처리할 수 있습니다.

/app/search/[searchTerm]/page.tsx 파일에서 실제 API 부분을 가져오는 부분에서 강제로 에러 코드를 만들어 볼까요?

```js
....
....

const search = async (searchTerm: string) => {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${searchTerm}&format=json`
  );

  throw new Error("NOOOOO! Error happened!");  // 강제로 에러 생성

  if (!res) return null;
  const data: SearchDataType[] = await res.json();
  return data;
};

....
....
```

throw new Error를 통해 강제로 에러를 발생시켰습니다.

이제 실행해 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEh6sYXyB-m1R8cxZrOMdqzfRotrOQd9aSMsgpM3OR_eHCf6U0xDI1_EZOcB9mCpLwfBPuvUywUTA51v0-eWUJSmaOYQyhNWo9029y5tgRZ37l8c1deTwH6tRv1wcdeHLv2SSb6x7b3rfooygV4C2j9MmApBnRMEnxwGQffaZIV1G1K4UMK9KD7Cu5RG=w640-h312)

위 그림과 같이 나옵니다.

에러 부분에 우리가 지정한 문구가 나오고 있네요.

위와 같이 에러가 표시된다면 사용자들은 별로 반가워하지 않을 겁니다.

그래서 Next.js에서는 error.tsx 파일을 예약해 뒀는데요.

아까 loading.tsx 파일처럼 같은 위치에 error.tsx 파일을 작성해 봅시다.

```js
'use client';

// 'use client' marks this page as a Client Component
// https://beta.nextjs.org/docs/rendering/server-and-client-components

import { useEffect } from 'react';

export default function Error({ error, reset }: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div>
      <p>Something went wrong!</p>
      <button onClick={() => reset()}>Reset error boundary</button>
    </div>
  );
}
```

위 코드는 Next.js 13에서 제공하는 가장 기본적인 코드입니다.

위 코드를 보시면 첫 줄에 'use client'라고 쓰여 있는 걸 볼 수 있는데요.

에러를 표시하는 화면은 서버사이드로 처리할 필요가 없는 거죠.

대부분 클라이언트 쪽에 에러를 보여줘야 하니까요?

이제 다시 실행 결과를 볼까요?

개발 서버를 돌리고 있다면 아까 위와 같은 에러 화면이 뜨고 잠시 후에 다시 아래와 같이 나타날 건데요.

배포된 서버에서는 바로 아래와 같이 나오니 걱정하지 않으셔도 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhMls_3GMk8kYiAkwkDHEWV_Gr3fbY1qaeIbrHqa8i8jYU4aFLArt5I_5wPr4btsgwwohTxSVcqrGdsHD7G8-qNLk2nRi-eypMI588guyIuNYZ94NzlOt90IDQrNijhqIkQldXMH_U9fA-WQAiAG0ZNWEtsJcu7H9s9ar-wPbTsGbAD42ApDrLaIn1k=w640-h274)

어떤가요?

에러 메시지도 Nested Layout에 정확히 안착해서 보이고 있죠!

사실 이런 기능은 Remix Framework에서 다 구현한 기능입니다.

Next.js 13 버전이 Remix를 많이 차용한 것 같네요.

지금까지 Next.js 13 버전의 클라이언트 컴포넌트를 어떻게 작성하는지 살펴보았는데요.

Remix에서 form으로 처리하던걸 여기서는 React 방식으로 처리한다고 보시면 됩니다.

물론 Remix에서도 React 방식으로 클라이언트상에서 처리할 수 있습니다.

제가 다시 한번 말씀드리는 거지만 여러분도 꼭 Remix를 한번 써보는 걸 추천드립니다.

정말 Next.js 정적 사이트보다도 빠릅니다.

<hr />

## head.tsx 파일로 title과 같은 메타 데이터 변경하기

Next.js 13 버전에서 예약된 파일 이름 중에 head.tsx 파일이 있습니다.

이 파일의 목적은 HTML에서 header 부분인데요.

여기에 title과 각종 메타정보를 넣을 수 있습니다.

각 라우팅에 head.tsx 파일을 작성하면 그 라우팅에서 창 제목을 정할 수 있습니다.

실제 /app/head.tsx 에는 아래와 같이 작성했는데요.

```js
export default function Head() {
  return (
    <>
      <title>Nextjs 13 Example</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <link rel="icon" href="/favicon.ico" />
    </>
  )
}
```
위 head파일은 가장 디폴트 값인데요.

각 페이지마다 다르게 설정할 수 있습니다.

그러면 다른 라우팅(주소)에 만들어 볼까요?

/app/search/head.tsx 파일을 작성해서 주소가 /search 일 경우 title이 보이도록 해보겠습니다.

```js
import React from "react";

type Props = {};

function Head({}: Props) {
  return (
    <>
      <title>Search Page</title>
    </>
  );
}

export default Head;

```

![](https://blogger.googleusercontent.com/img/a/AVvXsEgMk1lel49LtS-EHFmf9CtJl3UmwGQHsUj_stB2165zLWCaewp3tB_T6oOm0CtPagZ7Gyaferbx9jRXVmnRrIf469sHRB5QA16sraCSf_VXOD89lBmfJTOl0HwZSRppr_f7tEY9qFi4KBPyr3BfaQCbBkc8jdKjFzHbh9GI3wTHpYBRKUJJsQvehgpP=w400-h234)

위 그림을 보시면 타이틀 제목이 우리가 지정했던 것과 동일하다는 것을 알 수 있습니다.

그럼, 다음 시간에도 Next.js 13 버전에 대해 더 알아보도록 하겠습니다.


