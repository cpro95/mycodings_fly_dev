---
slug: 2023-03-16-react-18-new-way-of-data-fetching
title: 리액트(React)에서의 데이터 가져오기(data fetching) 변천사
date: 2023-03-16 11:28:53.443000+00:00
summary: 리액트(React)에서의 데이터 가져오기(data fetching) 변천사
tags: ["react", "fetch", "use-hook", "suspense"]
contributors: []
draft: false
---

리액트(React)에서 최근 새로운 데이터 페칭(data fetching) 훅(hook)을 소개했는데요.

이 훅(hook)을 살펴보기 전에 예전에는 어떤 방식을 썼는지, 그리고 버전 업이 되면서 어떻게 변했는지 살펴보겠습니다.

데이터 가져오기에서 훅(hook)의 도입으로 좀 더 간결해졌는데요.

useState, useEffect을 사용하는 방식이 지금도 계속 이어져 오고 있습니다.

가장 일반적이고 고전적인 방식이라고도 할 수 있는 예제를 한번 볼까요?

React 16+ 버전의 경우입니다.

```js
const Post = () => {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        axios
        .get('https://jsonplaceholder.typicode.com/posts/1')
        .then((res) => {
            setPost(res.data);
            setLoading(false);
        })
        .catch((err) => {
            console.log(err);
            setLoading(false);
        });
    }, []);
    return (
        <div>
        {loading ? (
            <div>Loading...</div>
        ) : (
            <div>
            <h1>{post.title}</h1>
            <p>{post.body}</p>
            </div>
        )}
        </div>
    );
};
// Parent component
<Post />
```

예제를 보시면 useState와 useEffect을 이용한 가장 일반적인 데이터 가져오기 예제입니다.

Loading 상태를 직접 체크하고 제어해 주는 코드도 들어있네요.

그런데 요즘은 이렇게 안 하죠?

React 18 버전에서는 다음과 같이 Suspense를 이용하는 방식으로 바뀌었습니다.

```js
const Post = () => {
    const [post, setPost] = useState(null);
    useEffect(() => {
        axios
        .get('https://jsonplaceholder.typicode.com/posts/1')
        .then((res) => {
            setPost(res.data);
        })
        .catch((err) => {
            console.log(err);
        });
    }, []);
    return (
        <div>
            <h1>{post.title}</h1>
            <p>{post.body}</p>
        </div>
    );
};

// Parent component
<Suspense fallback="Loading...">
    <Post />
</Suspense>
```

뭔가 훨씬 더 간결해졌네요.

그래도 여전히 useEffect 훅은 사용해야 하네요.

그래서 최근 React 팀에서 개발 중인 새로운 훅인 'use' 훅을 보면 완전히 새로운 방식입니다.

'use' 훅을 이용한 방법을 한번 볼까요?

```js
const Post = () => {
    const { data } = use(axios.get('https://jsonplaceholder.typicode.com/posts/1'));
    return (
        <div>
            <h1>{data.title}</h1>
            <p>{data.body}</p>
        </div>
    );
};

// Parent component
<ErrorBoundary fallback="Error">
  <Suspense fallback="Loading...">
      <Post hasError />
  </Suspense>
</ErrorBoundary>
```

React 18의 Error 바운더리까지 사용하는 수준으로 올라왔습니다.

'use' 훅을 사용하는 것만으로도 useState 훅과 useEffect 훅을 사용하지도 않고 데이터 가져오기가 되는데요.

정말 신세계네요.

하지만 아직 'use' 훅은 개발 단계여서 사용하기는 좀 그렇다고 하네요.

좀 더 안정판이 나올 때까지 기다려 볼 수밖에 없네요.

그럼.
