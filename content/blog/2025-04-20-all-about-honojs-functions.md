---
slug: 2025-04-20-all-about-honojs-functions
title: Hono.js 튜토리얼 - 모든 핵심 함수 사용법 가이드
date: 2025-04-20 12:41:54.514000+00:00
summary: Hono는 빠르고 가벼운 웹 프레임워크로, 다양한 JavaScript 런타임에서 작동합니다. 이 글에서는 Hono에서 제공하는 주요 함수들의 사용법을 자세히 설명합니다
tags: ["hono", "honojs"]
contributors: []
draft: false
---

Hono는 빠르고 가벼운 웹 프레임워크로, 다양한 JavaScript 런타임에서 작동합니다.

이 글에서는 Hono에서 제공하는 주요 함수들의 사용법을 자세히 설명합니다.

---

## **1. 기본 설정**

### **Hono 앱 생성**

```ts
import { Hono } from 'hono'

const app = new Hono()
```

### **라우팅**

```ts
app.get('/', (c) => c.text('Hello Hono!'))
app.post('/submit', (c) => c.text('Submitted!'))
app.put('/update', (c) => c.text('Updated!'))
app.delete('/remove', (c) => c.text('Deleted!'))
```

### **미들웨어 적용**

```ts
app.use('*', async (c, next) => {
  console.log('Middleware executed!')
  await next()
})
```

---

## **2. 요청 처리**

### **쿼리 파라미터 & 경로 파라미터**

```ts
app.get('/user/:id', (c) => {
  const id = c.req.param('id') // `/user/123` → `id = "123"`
  const query = c.req.query('name') // `/user/123?name=John` → `query = "John"`
  return c.text(`User: ${id}, Name: ${query}`)
})
```

### **요청 바디 파싱**
```ts
app.post('/submit', async (c) => {
  const body = await c.req.json() // JSON 데이터
  const formData = await c.req.parseBody() // FormData
  return c.json({ body, formData })
})
```

### **헤더 & 쿠키**

```ts
app.get('/headers', (c) => {
  const userAgent = c.req.header('User-Agent')
  return c.text(`Your User-Agent: ${userAgent}`)
})

app.get('/set-cookie', (c) => {
  c.cookie('session', 'abc123', { secure: true })
  return c.text('Cookie set!')
})

app.get('/get-cookie', (c) => {
  const session = c.req.cookie('session')
  return c.text(`Session: ${session}`)
})
```

---

## **3. 응답 처리**

### **텍스트, JSON, HTML 응답**

```ts
app.get('/text', (c) => c.text('Plain Text'))
app.get('/json', (c) => c.json({ message: 'Hello JSON!' }))
app.get('/html', (c) => c.html('<h1>Hello HTML!</h1>'))
```

### **리디렉션**

```ts
app.get('/old', (c) => c.redirect('/new'))
```

### **파일 다운로드**

```ts
app.get('/download', (c) => {
  return new Response('File content', {
    headers: { 'Content-Disposition': 'attachment; filename="file.txt"' },
  })
})
```

### **스트리밍 응답**

```ts
import { streamText } from 'hono/streaming'

app.get('/stream', (c) => {
  return streamText(c, async (stream) => {
    for (let i = 0; i < 5; i++) {
      await stream.write(`Line ${i}\n`)
      await new Promise((r) => setTimeout(r, 1000))
    }
  })
})
```

---

## **4. 미들웨어**

### **기본 인증 (Basic Auth)**

```ts
import { basicAuth } from 'hono/basic-auth'

app.use(
  '/admin/*',
  basicAuth({
    username: 'admin',
    password: 'secret',
  })
)

app.get('/admin', (c) => c.text('You are authorized!'))
```

### **CORS 설정**

```ts
import { cors } from 'hono/cors'

app.use('/api/*', cors())
```

### **JWT 인증**

```ts
import { jwt } from 'hono/jwt'

app.use('/secure/*', jwt({ secret: 'my-secret-key' }))

app.get('/secure/data', (c) => {
  const payload = c.get('jwtPayload')
  return c.json({ data: 'Protected!', user: payload })
})
```

### **정적 파일 제공**

```ts
import { serveStatic } from 'hono/bun' // Bun 전용
// import { serveStatic } from 'hono/cloudflare-workers' // Cloudflare Workers 전용

app.get('/static/*', serveStatic({ root: './public' }))
```

---

## **5. 에러 처리**

### **404 처리**

```ts
app.notFound((c) => c.text('Not Found!', 404))
```

### **전역 에러 핸들링**

```ts
app.onError((err, c) => {
  console.error(err)
  return c.text('Internal Server Error', 500)
})
```

### **커스텀 에러**

```ts
app.get('/error', (c) => {
  throw new Error('Something went wrong!')
})
```

---

## **6. 환경 변수 & 바인딩**

### **Cloudflare Workers 환경 변수**

```ts
type Bindings = {
  DB: D1Database
  SECRET: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/env', (c) => {
  const db = c.env.DB
  const secret = c.env.SECRET
  return c.json({ db, secret })
})
```

---

## **7. 배포**

### **Cloudflare Workers**

```ts
export default app
```

### **Bun**
```ts
Bun.serve({
  fetch: app.fetch,
  port: 3000,
})
```

### **Node.js**

```ts
import { serve } from '@hono/node-server'

serve(app, (info) => {
  console.log(`Listening on http://localhost:${info.port}`)
})
```

---

## **마무리**

Hono는 빠르고 가벼운 웹 프레임워크로, 다양한 기능을 제공합니다.

이 가이드를 통해 주요 함수들을 익히고, 효율적으로 사용해 보세요!

더 자세한 내용은 공식 문서 ([hono.dev](https://hono.dev))를 참고하세요.
