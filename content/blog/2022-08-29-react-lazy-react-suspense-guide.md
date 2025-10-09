---
slug: 2022-08-29-react-lazy-react-suspense-guide
title: React.lazy와 React.Suspense 완벽 가이드
date: 2022-08-29 03:51:00.296000+00:00
summary: React의 lazy, Suspense 완벽 사용 가이드
tags: ["react", "lazy", "suspense"]
contributors: []
draft: false
---

안녕하세요?

오늘은 React의 신기능 중 하나인 lazy와 Suspense에 대해 알아보겠습니다.

lazy와 Suspense가 정확히 어떤 기능이 있는지는 예제를 보면서 살펴보는 게 가장 좋을 듯한데요.

create-react-app을 이용해서 간단한 React 앱을 만들어 보겠습니다.

```bash
npx create-react-app lazy-test
```

![mycodings.fly.dev-react-lazy-react-suspense-guide](https://blogger.googleusercontent.com/img/a/AVvXsEjD71cu90hDWm0ZfbCuL31IGkWfRk4kzRFxkbKKViMXZJO57uf4nnbQSnKX57x6jZIzQsNFnwQYgDQ480hJT7MF860McYIQbp-9R7nlElXanTzK6ka74H4XZC9XeNYEZ3QVUxwjG9majRDmoMDcmjVTB6c7AOhLOOX9o0pM3u0LP-n2M2ffft140gi4)

이제 React Router가 필요하니 아래 패키지를 설치할 겁니다.

또한 오늘 테스트에 필요한 웹 에디터인 TinyMCE도 설치할 겁니다.

```bash
npm i react-router-dom @tinymce/tinymce-react
```

이제 App.js파일을 우리의 테스트 용도에 맞게 수정해 볼까요?

```js
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home'
import TinyMce from './TinyMce'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/edit' element={<TinyMce />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
```

React Router Dom을 이용해서 라우팅을 설정했는데요.

Home과 TinyMce 컴포넌트를 각각 주소 "/"와 "/edit"에 할당했습니다.

![mycodings.fly.dev-react-lazy-react-suspense-guide](https://blogger.googleusercontent.com/img/a/AVvXsEgKWbRnVxAe-RW0R6lVjIcUeFwdmL5Zj2OHppIYu7IrVWVF5CVy64rsnY52roDarAReumcc4vEVbPCl6VSStLWL0-tHZpEvZ8ioTkZVrWPFDcf3wgPnhIDXMG62CXLSopssucIZEXOknmISBXRUSo3mAxcpLN64ZFKFgS3gTHg3eFdwksZbLfIKVtrT)

![mycodings.fly.dev-react-lazy-react-suspense-guide](https://blogger.googleusercontent.com/img/a/AVvXsEjSOWLFfRb2QVP6hwDxICb1MGMBzd2AR3UsfpN_Aa2Mk1NhvWtZBwFskQBOh7iQ5D4DUDr1U0uGLic4giULvHqtwCyDufbDnadL64OXVypQezB_05hH5ZVzR0G3D6TTwd4uVqcmKBwBJzLp_X33lS6-poYVQ_mQdqweihXoIJW6qsaga_R-zclHxBC3)

일단은 해당 라우팅에 대해 잘 실행되는 게 보이실 겁니다.

그럼 Home 컴포넌트와 TinyMce 컴포넌트도 만들어야 하는데요.

/src/Home.jsx

```js
import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div>
      <h1>Home</h1>
      <Link to='/edit'>goto Edit</Link>
    </div>
  )
}

export default Home
```

Home 컴포넌트는 별거 없습니다.

TinyMce 컴포넌트를 볼까요?

/src/TinyMce.jsx

```js
import React, { Suspense } from 'react'
import { Link } from 'react-router-dom'
import { Editor } from '@tinymce/tinymce-react'

function TinyMce() {
  return (
    <div>
      <h1>TinyMce Editor</h1>
      <Link to='/'>goto Home</Link>
      <div>
        <Editor
          apiKey='qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc'
          textareaName='body'
        />
      </div>
    </div>
  )
}

export default TinyMce
```

TinyMce의 react 버전인 Editor를 불러와서 화면에 보여주는 컴포넌트입니다.

자바스크립트의 웹 에디터 중에 여러 가지가 있는데 오늘 테스트에 쓰일 거는 바로 TinyMce인데요.

쉽게 웹에서 글을 쓸 수 있게 해주는 Editor입니다.

그러면 오늘 주제인 React.lazy와 React.Suspense를 위해서 TinyMce를 준비한 이유가 바로 TinyMce가 조금 무거운 라이브러리란 점입니다.

우리의 React 앱을 보면 App.js에서 라우팅으로 Home 컴포넌트와 TinyMce 컴포넌트를 불어왔는데요.

실제, "/" 경로로 리퀘스트가 들어오면 React앱은 Home 컴포넌트와 TinyMce 컴포넌트도 그 즉시 불러오게 되는데요.

아직, "/edit" 경로로 가지 않았는데도 TinyMce 컴포넌트가 로딩되는 거는 사실 불필요한데요.

이럴 때 쓰이는 게 React.lazy입니다.

![mycodings.fly.dev-react-lazy-react-suspense-guide](https://blogger.googleusercontent.com/img/a/AVvXsEitCZvmiIe9MqA1zklaGz3nSHg7bqX-0_iQMD2jmsDFzebRp8_obKnOeYtC1cJvlTt4_U4BUbmzJUUu1t3fhj8CW7_zPvvsNyeMTtKc5axa6NU-STzTU69TgTMn9-1gg5PklgfvqYFnY8rqSph1gmgO1QCY4tu9kcHMDh4SRBS252m7SnMJ_ijrUBVD)

위 스크린숏을 보시면 React Dev 서버에서 불러오는 bundle.js 파일의 크기가 391kb인데요.

이제 React.lazy를 적용해 볼까요?

React.lazy 사용법입니다.

```js
const Editor = React.lazy(() => import('@tinymce/tinymce-react'))
```

일단 위와 같이 사용하는 게 React.lazy 사용법인데요.

여기서 주의할 점이 바로 우리가 import 하려고 하는 컴포넌트가 default export 되었는가?

아니면 named export 되었는가인데요.

우리가 자바스크립트에서 "export default Home"이라고 export 하면 이건 default export가 됩니다.

그리고 named export는 "export Home"이라고 default를 빼고 export 한 건데요.

React.lazy는 우리가 import 하려는 컴포넌트가 default export 되었다고 전제하고 있습니다.

그러면 named export 일 경우 어떻게 해야 할까요?

바로 아래처럼 하면 됩니다.

```js
const Editor = React.lazy(() =>
  import('@tinymce/tinymce-react').then(module => ({
    default: module.Editor,
  })),
)
```

위와 같이 Promise의 then을 이용해서 module의 항목을 지정해 주는 방식이 있습니다.

그럼 우리의 TinyMce React 패키지는 named export이기 때문에 다음과 같이 수정하면 됩니다.

```js
import React, { Suspense } from 'react'
import { Link } from 'react-router-dom'
// import { Editor } from '@tinymce/tinymce-react'

const Editor = React.lazy(() =>
  import('@tinymce/tinymce-react').then(module => ({
    default: module.Editor,
  })),
)

function TinyMce() {
  return (
    <div>
      <h1>TinyMce Editor</h1>
      <Link to='/'>goto Home</Link>
      <div>
        <Editor
          apiKey='qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc'
          textareaName='body'
        />
      </div>
    </div>
  )
}

export default TinyMce
```

이렇게 React.lazy로 로딩하면 어떻게 될까요?

![mycodings.fly.dev-react-lazy-react-suspense-guide](https://blogger.googleusercontent.com/img/a/AVvXsEhXlpF8fpEUT0_WBohLCS9U3dg3H0IoDSLVzs0QEF2a01tolYY_EUG0a9I4Djb3juvVv4mGXFwvs9Qio7veBOUn8Y7Bp3udCl6q5o3jhL4jgzjK52UhnryI11pI1AviAUPW1u2F1Os66PQQjFJ7h_EudSJfg3JgyQ2bMEYhkLKVxHq_ciN-c85JpFx_)

위 스크린숏을 보면 377kb로 나타납니다.

무언가 자바스크립트 로딩 양이 줄어든 게 느껴지는데요.

React.lazy는 해당 lazy 컴포넌트가 있는 컴포넌트가 리퀘스트(방문)될 때 비동기식으로 import 해서 필요할 때 불러오게 됩니다.

그럼 React.Suspense는 어디에 쓰는 걸까요?

바로 React.lazy가 비동기식으로 불러올 때 잠깐 동안(네트워크 사정에 따라 빈 화면이 보일 수 있습니다) 화면이 비어 보이게 되는데요.

이때 뭔가 로딩되고 있다고 유저에게 알려줄 때 쓰입니다.

이제 코드를 다음과 같이 바꿔 볼까요?

```js
import React, { Suspense } from 'react'
import { Link } from 'react-router-dom'
// import { Editor } from "@tinymce/tinymce-react";

const Editor = React.lazy(() =>
  import('@tinymce/tinymce-react').then(module => ({
    default: module.Editor,
  })),
)

function TinyMce() {
  return (
    <div>
      <h1>TinyMce Editor</h1>
      <Link to='/'>goto Home</Link>
      <div>
        <Suspense fallback='Loading edtor...'>
          <Editor
            apiKey='qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc'
            textareaName='body'
          />
        </Suspense>
      </div>
    </div>
  )
}

export default TinyMce
```

위와 같이 하면 lazy 하게 import 하는 Editor 컴포넌트가 로딩이 완료되기 전에 fallback에 할당한 문구가 화면에 보이게 됩니다.

![mycodings.fly.dev-react-lazy-react-suspense-guide](https://blogger.googleusercontent.com/img/a/AVvXsEjFrurk0od1oNLW3KJz_N3H2mH0728j7bk3GNNy4wo9jdhBZzCsiEJ48impp_pYOgVtr5-yTSnkkgPNbo-B9RY24ClMER6LcVGu9yt7DYoIO9BxML4N4l9H-RoFCPBwmZzcUZIlAjh_4r7D1taOPIyoohWXGqzmk2XihEfPlr96tnma5XqhosEu4kLq)

위 스크린숏을 보시면 Loading... 이란 문구가 보이시죠.

이제 React.lazy와 React.Suspense로 좀 더 빠른 앱을 만들 수 있을 겁니다.

그럼.

