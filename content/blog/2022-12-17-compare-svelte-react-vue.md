---
slug: 2022-12-17-compare-svelte-react-vue
title: Svelte 알아보기 - React, Vue와 비교하여
date: 2022-12-17 09:50:52.578000+00:00
summary: Svelte 알아보기 - React, Vue와 비교하여
tags: ["svelte", "sveltejs"]
contributors: []
draft: false
---

안녕하세요?

오늘은 SvelteKit 1.0 버전이 나온 기념으로 SvelteJS에 대해 알아보고자 합니다.

기존에 이 분야 최고인 React와 Vue를 이용하여 비교하면 좀 더 Svelte에 대해 이해하기 쉬울 거 같아 비교 코드로 진행해 볼 생각입니다.

SvelteJs는 Rich Harris 이란 분이 만들었는데요.

React, Vue가 UI Library 같은 개념이라면 Svelte는 UI 컴파일러라는 느낌이 강합니다.

왜냐하면 React나 Vue는 최종적으로 브라우저에서 React, Vue 코드를 로드해야 하는데요.

Svelte는 로드할 Svelte 라이브러리가 없습니다.

왜냐하면 Svelte는 Svelte 문법으로 짠 코드를 순수 자바스크립트 코드로 컴파일해 주기 때문입니다.

그래서 Build 했을 때 나오는 코드는 그냥 자바스크립트 코드입니다.

이걸 그냥 브라우저에서 로드하면 됩니다.

그래서 VirtualDOM 같은 것도 없습니다.

그럼 Svelte에 대해 좀 더 상세하게 알아보겠습니다.

---
## 형식

React는 확장자가 .jsx 또는 .tsx 라는 이름을 쓰는데요.

Vue는 .vue 확장자를 쓰고요.

Svelte도 비슷하게 .svelte  확장자를 씁니다.

Svelte는 .svelte 확장자인 파일 안에 script 부분과 HTML 부분, CSS 부분까지 한 번에 작성합니다.

```js
<script>
  // Component logic goes here
</script>

<!-- HTML goes here -->

<style>
  /* CSS goes here (scoped by default!) */
</style>
```

그러면 먼저, UI 라이브러리의 가장 기본인 버튼을 만들어 볼까요?

먼저, Svelte입니다.
```js
<!-- CounterButton.svelte -->
<script>
  let count = 0

  const incrementCount = () => {
    count++
  }
</script>

<button on:click={incrementCount}>
  Number of clicks: {count}
</button>
```

그다음으로 React코드입니다.
```js
// CounterButton.jsx
import React, { useState } from 'react'

export const CounterButton = () => {
  const [count, setCount] = useState(0)

  const handleClick = () => {
    setCount(count + 1)
  }

  return (
    <button onClick={handleClick}>
      Number of clicks: {count}
    </button>
  )
}
```

Vue 2 버전입니다.
```js
<!-- CounterButton.vue -->
<script>
  export default {
    data: () => ({
      count: 0
    }),

    methods: {
      incrementCount() {
        this.count++
      }
    }
  }
</script>

<​template>
  <button @click="incrementCount">
    Number of clicks: {{ count }}
  </button>
</template>
```

Vue 3.2 버전입니다.
```js
<!-- CounterButton.vue 3.2 -->
<script setup>
  import { ref } from 'vue'

  const count = ref(0)

  const incrementCount = () => {
    count.value++
  }
</script>

<​template>
  <button @click="incrementCount">
    Number of clicks: {{ count }}
  </button>
</template>
```

위 코드를 비교해 보셨다면 느끼셨겠지만, Svelte 코드는 정말 명확하고 간략합니다.

리액티비티를 위해서 React는 useState를 써야 하고, Vue도 비슷한 걸 써야 하는데요.

Svelte에서는 모든 변수가 기본적으로 리액티비티합니다.

즉, 변수로 선언만 하고 그 변수 값이 변하면 해당 부분이 변한다는 뜻입니다.

정말 신기한데요.

---
## 좀 더 복잡한 버튼 예제

이번에는 조건에 따라 렌더링하는 방식과 computed values에 대해 살펴볼까요?

먼저, Svelte입니다.
```js
<!-- ToggleButton.svelte -->
<script>
  let isTextShown = false
  
  const toggleIsTextShown = () => {
    isTextShown = !isTextShown
  }

  $: buttonText = isTextShown ? 'Show less' : 'Show more'
</script>

<p>
  Svelte is a JavaScript framework.
  
  {#if isTextShown}
    Though actually, if you want to get technical...
  {/if}
</p>

<button on:click={toggleIsTextShown}>
  {buttonText}
</button>
```

그다음은 React 코드입니다.
```js
// ToggleButton.jsx
import React, { useState } from 'react'

export const ToggleButton = () => {
  const [isTextShown, setIsTextShown] = useState(false)

  const handleClick = () => {
    setIsTextShown(!isTextShown)
  }

  const buttonText = isTextShown ? 'Show less' : 'Show more'

  return (
    <div>
      <p>
        Svelte is a JavaScript framework.
        
        {isTextShown && 
          `Though actually, if you want to get technical...`
        }
      </p>

      <button onClick={handleClick}>
        {buttonText}
      </button>
    </div>
  )
}
```

Vue 2 버전입니다.
```js
<!-- ToggleButton.vue -->
<script>
  export default {
    data: () => ({
      isTextShown: false
    }),

    methods: {
      toggleIsTextShown() {
        this.isTextShown = !this.isTextShown
      }
    },

    computed: {
      buttonText() {
        return this.isTextShown ? 'Show less' : 'Show more'
      }
    }
  }
</script>

<​template>
  <div>
    <p>
      Svelte is a JavaScript framework.
    
      <​template v-if="isTextShown">
        Though actually, if you want to get technical...
      </template>
    </p>

    <button @click="toggleIsTextShown">
      {{ buttonText }}
    </button>
  </div>
</template>
```

마지막으로 Vue 3.2 버전입니다.
```js
<!-- ToggleButton.vue -->
<script setup>
  import { ref, computed } from 'vue'

  const isTextShown = ref(0)

  const toggleIsTextShown = () => {
    isTextShown.value = !isTextShown.value
  }

  const buttonText = computed(() => (
    isTextShown.value ? 'Show less' : 'Show more'
  ))
</script>

<​template>
  <p>
    Svelte is a JavaScript framework.
  
    <​template v-if="isTextShown">
      Though actually, if you want to get technical...
    </template>
  </p>

  <button @click="toggleIsTextShown">
    {{ buttonText }}
  </button>
</template>
```

쭉 코드를 훑어보셨을 텐데 어떠신가요?

Svelte의 간략화에 놀라셨겠죠?

Vue 3.2 버전도 예전 2.0 버전보다 훨씬 간략해졌지만 그래도 Svelte에는 안되네요.

---
## FORM 바인딩

이번에는 슬라이더에 값을 바인딩하는 에제를 살펴볼까요?

먼저, Svelte입니다.
```js
<!-- VolumeControl.svelte -->
<script>
  let volume = 0
</script>


<label for="volume-control">
  Volume: {volume}%
</label>

<input 
  id="volume-control"
  type="range"
  min="0"
  max="100"
  bind:value={volume}
/>
```

두 번째는 React 코드입니다.
```js
// VolumeControl.jsx
import React, { useState } from 'react'

const VolumeControl = () => {
  const [volume, setVolume] = useState(0)
  
  return (
    <div>
      <input 
        id="colume-control"
        type="range"
        min="0"
        max="100"
        value={volume}
        onChange={(e) => setVolume(e.target.value)} 
      />

      <label for="colume-control">
        Volume: {volume}%
      </label>
    </div>
  )
}
```

Vue 2 버전입니다.
```js
<!-- VolumeControl.vue -->
<script>
  export default {
    data: () => ({
      volume: 0
    })
  }
</script>

<​template>
  <div>
    <label for="volume-control">
      Volume: {{ volume }}%
    </label>

    <input 
      id="volume-control"
      type="range"
      min="0"
      max="100"
      v-model="volume"
    />
  </div>
</template>
```

마지막으로 Vue 3.2 버전입니다.
```js
<!-- VolumeControl.vue -->
<script setup>
  import { ref } from 'vue'

  const volume = ref(0)
</script>

<​template>
  <label for="volume-control">
    Volume: {{ volume }}%
  </label>

  <input 
    id="volume-control"
    type="range"
    min="0"
    max="100"
    v-model="volume"
  />
</template>
```

역시나 Svelte가 간결한 느낌을 지울 수 없습니다.

---
## 비교 로직

이번에는 비교 로직인데요.

먼저, Svelte입니다.
```js
{#if isUserLoggedIn}
  <WelcomeBanner />
{:else}
  <LoginForm />
{/if}
```

두 번째, React 코드입니다.
```js
{
{
  isUserLoggedIn 
    ? <WelcomeBanner />
    : <LoginForm />
}
}
```

마지막으로 Vue 코드입니다.
```js
  <WelcomeBanner v-if="isUserLoggedIn" />
  <LoginForm v-else />
```

비교 로직은 React가 가장 자바스크립트 같은데요.

Vue는 정말 이해하기 어려운 문법을 가지고 있네요.

---
## Loop 알아보기

먼저, Svelte입니다.
```js
{#each posts as post}
  <h2>
    <a href={post.link}>
      {post.title}
    </a>
  </h2>

  <p>{post.excerpt}</p>
{/each}
```

두 번째 React 코드입니다.
```js
posts.map(post => (
  <div key={post.link}>
    <h2>
      <a href={post.link}>
        {post.title}
      </a>
    </h2>

    <p>{post.excerpt}</p>
  </div>
))
```

마지막으로 Vue 코드입니다.
```js
<div v-for="post in posts" :key="post.link">
  <h2>
    <a :href="post.link">
      {{ post.title }}
    </a>
  </h2>

  <p>{{ post.excerpt }}</p>
</div>
```

역시 Svelte가 가장 간결하고 이해가 쉽네요.

대신에 React는 자바스크립트 본연의 특성을 가장 잘 이용한 코드가 아닌가 싶네요.

---
## Svelte 의 장점

위에서 살펴본 코드를 비교해 봤을 때 Svelte가 간략하고 직관적이라고 볼 수 있는데요.

그 외에도 Svelte가 좋은 점이 더 있습니다.

1. 모든게 .svelte 파일 하나에 다 들어갑니다.
2. CSS 적용도 한 개의 파일에 Scoped 됩니다.
3. Transition, Anaimation 기능이 Svelte에 기본으로 내장되어 있습니다.
4. Redux 같은 data sotre가 기본적으로 장착되어 있습니다.
5. 축약 표현을 쓸 수 있어 코드 개발이 빠르고 이해도가 쉽습니다.

---
## CSS 살펴보기

조건부 CSS 스타일 적용에 대해 알아보겠습니다.

먼저, Svelte입니다.
```js
<script>
  let enabled = false
</script> 

<input class={enabled ? 'enabled' : ''} />
```

또는 다음과 같이 쓸 수 있습니다.

```js
<script>
  let enabled = false
</script> 

<input class={enabled && 'enabled'} />
```

더 간략하게 다음과 같이 표현할 수도 있습니다.
```js
<script>
  let enabled = false
</script> 

<input class:enabled={enabled} />
```

마지막으로 위 코드는 ES6 객체 속성 값 축약법에 의해 아래와 같이 간략하게 쓸 수 있습니다.
```js
<script>
  let enabled = false
</script> 

<input class:enabled />
```

어떤가요?

CSS 부분에서도 정말 간략하지 않나요?

Svelte는 처음부터 코드의 명확성, 간략함 등을 목표로 개발됐으니까요.

참고로 Svelte에서는 CSS 부분의 클래스를 아래와 같이 여러 개 가질 수 있습니다.
```js
<div
  class="layout"
  class:logged-in={isLoggedIn}
  class:darkMode
  class:reduceMotion
>
  <!-- ...Content here -->
</div>
```

---
## Scoped vs global 스타일

기본적으로 Svelte에서의 CSS 스코프는 지역 한정인데요.

아래와 같이 하면 전역 스타일을 적용할 수 있습니다.
```js
<style>
  ul {
    /* This CSS applies ONLY to the component */

    :global(li) {
      /* These styles are global */
    }
  }
</style>
```

또는 아래와 같이 해도 전역 스타일이 됩니다.
```js
<style global>
  /* All CSS here is global */
</style>
```

---
## 컴포넌트에 props 전달하기

Svelte의 강점은 바로 컴포넌트의 props 전달에 있는데요.

Svelte에서는 변수 앞에 export 예약어를 붙이면 그게 바로 외부에서 온 props가 됩니다.

여기서 쓰이는 export 문법도 사실 자바스크립트 고유 기능이라고 합니다.

즉, 원래부터 있던 기능이라고 하네요.

그럼, 코드를 비교해 볼까요?

먼저, Svelte입니다.
```js
<!-- PageHeading.svelte -->
<script>
  export let pageTitle
  export let pageSubtitle = ''
</script>

<h1>
  {pageTitle}
  {#if pageSubtitle}
    <small>{pageSubtitle}</small>
  {/if}
</h1>
```

두 번째 React 코드입니다.
```js
// PageHeading.jsx
const PostPreview = ({ pageTitle, pageSubtitle }) => {
  return (
    <h1>
      {pageTitle}
      {pageSubtitle &&
        <small>{pageSubtitle}</small>
      }
    </h1>
  )
}
```

세 번째는 Vue 2 버전입니다.
```js
<!-- PageHeading.vue -->
<script>
  export default {
    props: {
      pageTitle: {
        required: true
      },
      pageSubtitle: {
        default: ''
      }
    }
  }
</script>

<​template>
  <h1>
    {{ pageTitle }}
    <small v-if="pageSubtitle">
      {{ pageSubtitle }}
    </small>
  </h1>
</template>
```

마지막으로 Vue 3.2 버전입니다.
```js
<!-- PageHeading.vue -->
<script setup>
  const props = defineProps({
    pageTitle: {
      required: true
    },
    pageSubtitle: {
      default: ''
    }
  })
</script>

<​template>
  <h1>
    {{ pageTitle }}
    <small v-if="pageSubtitle">
      {{ pageSubtitle }}
    </small>
  </h1>
</template>
```

위와 같이 코드를 비교해 봤을 때 Vue 2.0 버전은 정말 코드가 기네요.

이에 비해 Svelte는 정말 간결합니다.

지금까지 Svelte와 React, Vue에 대해 코드 비교를 통해 Svelte의 간결함, 명확함에 대해 알아보았는데요.

사실 Svelte Community가 React 커뮤니티보다 크기가 작아서 그렇지 점점 더 사용자가 많아지고 있는 UI 라이브러리니까 꼭 한 번 배워 두는 것도 좋을 듯합니다.

그럼.
