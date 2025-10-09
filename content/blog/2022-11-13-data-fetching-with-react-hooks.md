---
slug: 2022-11-13-data-fetching-with-react-hooks
title: React 훅(Hook)을 이용한 Data Fetching 알아보기
date: 2022-11-13 11:37:57.146000+00:00
summary: axios를 React 훅(Hook)에 적용하여 Data Fetching 모듈 만들기
tags: ["react", "hook", "javascript", "axios"]
contributors: []
draft: false
---

![mycodings_fly_dev_data_fetching_with_react_hooks](https://blogger.googleusercontent.com/img/a/AVvXsEhAkUYNBkqeTlIUHJFQD0iT9dHEczyiT0V2HD1kVPkAppyF6LZZL83_YiyF3mzIGevhhXQ561iRi4y-hpSHDFfYj7FPrMtKXWX02mB9ZFTVo23eIkN_Xt9abqJqF7gQq3PvCaentGFmVv5wJ0IJUn33zVXZy1g76eRaUAYvgL5H98Zy6Oso_kVrQNHF)

안녕하세요?

오늘은 React 코드를 작성할 때 가장 많이 접하는 Data Fetching을 React Hook을 이용한 방법에 대해 알아보겠습니다.

먼저, 테스트 코드를 위해 create-react-app을 하나 작성해 봅시다.

```bash
npx create-react-app data-fetching-with-hooks

npm init react-app data-fetching-with-hooks

yarn create react-app data-fetching-with-hooks
```

그리고 data fetching을 위해 axios 패키지를 설치하겠습니다.

```bash
npm install axios
```

## React hook 없이 Data Fetching 하기

먼저, 훅(hook)을 이용하지 않고 Data Fetching 하는 방법을 알아보겠습니다.

참고로 Data Fetching을 위한 backend servers는 공개 api인 [JSONPlaceholder](https://jsonplaceholder.typicode.com/) 서비스를 이용하겠습니다.

기본 create-react-app에 있는 App.js 파일만 고쳐서 사용해 보겠습니다.

```js
import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'

function App() {
  const [requestState, setRequestState] = useState({
    data: [],
    loading: true,
    error: null,
  })

  const fetchData = async () => {
    try {
      const { data: fetchData } = await axios.get(
        'https://jsonplaceholder.typicode.com/posts',
      )

      setRequestState(prev => ({
        ...prev,
        data: fetchData,
      }))
    } catch (err) {
      setRequestState(prev => ({
        ...prev,
        error: err,
      }))
    } finally {
      setRequestState(prev => ({
        ...prev,
        loading: false,
      }))
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className='App'>
      {requestState.loading ? (
        <p>Data is currently loading...</p>
      ) : requestState.error ? (
        <p>There was an issue loading the articles.</p>
      ) : (
        requestState?.data.map(article => (
          <div className='article' key={article.id}>
            <h3>{article.title}</h3>
            <p>{article.body}</p>
          </div>
        ))
      )}
    </div>
  )
}

export default App
```

위 코드를 보시면 axios를 이용해서 Data Fetching 하는 가장 기본적인 방법입니다.

try, catch, finally를 이용해서 에러 핸들링도 처리해 줬고, loading 변수도 지정할 수 있습니다.

실제 페이지 새로 고침을 해보면 처음에 loading 부분이 나타납니다.

실행 결과를 한번 볼까요?

![mycodings_fly_dev_data_fetching_with_react_hooks](https://blogger.googleusercontent.com/img/a/AVvXsEiEdrmKjhkQu0lNIVXxlt3WvzjVqBQf1uUcbTMIlLh1xBA2DIGYhKQrQPsnVjp0sOQq2s5xo_xokkeFBLrUKiS35VaGxce77XKny9M4cg7t4EnuD5o95xh6sWPbaPfBIjwFQKkbGIDbtJnxUlb6QZDrSv7P8cRRsb6vZ7dkBinP8kcEz1dSf0w2dfp4)

처음에 loading 하는 부분도 잘 보입니다.

![mycodings_fly_dev_data_fetching_with_react_hooks](https://blogger.googleusercontent.com/img/a/AVvXsEgCIP1FjcwAvJ3Gun-vqJhQgcYEZ680jMJlrTEQBiwWxJZtU14LFmo1GUwm0m-B5vQnGemz5lRzkMyQqzBuS245oOKN5rpyovAxidrcAG57vJ0Fiatgp8LQtEkFbtgaA9y_k2D4yyrob_SxXFhMLkz1glXP4knHbXFAVnQ97f_bj3aNEfcvnveOMAT6)

Data Fetching이 잘 되고 있습니다.

axios를 이용해서 데이터 가져오는 가장 일반적인 방법인데요.

그런데 이 방식에는 문제가 있습니다.

다른 페이지에서도 데이터 가져오기를 하기 위해서는 위와 같이 useState와 useEffect 코드를 또 작성해야 합니다.

코드 작성에 있어 중복 작성이 가장 비효율적인데요.

React에서는 이 같은 경우를 위해서 Hook을 제공해 줍니다.

그럼 우리가 직접 Hook을 이용해서 재사용 가능한 데이터 가져오는 함수를 만들어 볼까요?

<hr />

## React hook을 이용해서 재 사용 가능한 Data Fetch 함수 만들기

hooks 폴더를 만들고 우리가 만들려는 함수인 useFetchData.js 파일을 만듭시다.

```js
import axios from 'axios'
import { useState, useEffect } from 'react'

const useFetchData = requestConfig => {
  const localRequestConfig = requestConfig || {}

  const [state, setState] = useState({
    loading: true,
    data: null,
    error: null,
  })

  if (!localRequestConfig?.method) {
    localRequestConfig.method = 'GET'
  }

  useEffect(() => {
    if (localRequestConfig.url) {
      axios(localRequestConfig)
        .then(res => {
          setState(prev => ({
            ...prev,
            data: res.data,
          }))
        })
        .catch(err => {
          setState(prev => ({
            ...prev,
            error: err,
          }))
        })
        .finally(() => {
          setState(prev => ({
            ...prev,
            loading: false,
          }))
        })
    } else {
      setState(prev => ({
        ...prev,
        loading: false,
        error: new Error('No URL provided!'),
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestConfig])

  return state
}

export default useFetchData
```

우리가 만든 Hook을 보면 기본적으로 useState를 이용해서 state를 저장하고 그걸 리턴하는 함수입니다.

작동 방식은 똑같은데요.

한 가지 틀린 점은 axios.get과 axios.post 등 여러 가지 method를 적용하기 위해 기본 method 부분을 'GET'으로 지정하는 부분이 있습니다.

그래서 useEffect 함수에서는 axios.get 방식이 아니라 axios를 그냥 호출할 수 있는 겁니다.

그럼 이 커스텀 훅을 사용하는 App.js 파일을 다시 만들어 볼까요?

```js
import './App.css'
import useFetchData from './hooks/useFetchData'

function App() {
  const requestConfig = {
    url: 'https://jsonplaceholder.typicode.com/posts',
  }
  const { data = [], loading, error } = useFetchData(requestConfig)
  return (
    <div className='App'>
      {loading ? (
        <p>Data is currently loading...</p>
      ) : error ? (
        <p>There was an issue loading the articles.</p>
      ) : (
        data.map(article => (
          <div className='article' key={article.id}>
            <h3>{article.title}</h3>
            <p>{article.body}</p>
          </div>
        ))
      )}
    </div>
  )
}

export default App
```

이제 useFetchData 훅을 이용하면 코드 재사용이 가능하게끔 사용이 가능합니다.

requestConfig에 원하는 url만 적어서 useFetchData 훅을 호출하면 원하는 data, loading, error 변수를 얻을 수 있습니다.

실행 결과도 확인해 보시면 같은 결과를 확인할 수 있을 겁니다.

지금까지 React Data Fetching을 React Hook을 이용해서 코드 재사용이 가능한 방법에 알아보았습니다.

많은 도움이 되셨으면 합니다.

그럼.
