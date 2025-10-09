---
slug: 2022-07-12-new-blog-site-open
title: 새로운 블로그 사이트 오픈
date: 2022-07-12 13:52:31.261000+00:00
summary: Remix Framework을 이용한 새로운 블로그 사이트 오픈
tags: ["blog", "remix"]
contributors: []
draft: false
---

안녕하세요?

기존 [티스토리 블로그](https://cpro95.tistory.com)를 이용하다가 이번에 나만의 블로그를 만들기 위해 Remix Framework를 이용해서 새로 만들었습니다.

Remix Framework에는 여러 가지 Stack을 제공해 주는데요.

제가 이용한 Stack은 바로 [Speed Metal Stack](https://github.com/Girish21/speed-metal-stack)입니다.

Speed Metal Stack은 Kent C. Dodds 님의 블로그 사이트를 개편한 건데요.

Github Repository를 블로그 내용의 저장소로 쓰고,

MDX-bundler를 이용해서 mdx 파일이 새로 생기면 그걸 컴파일해서 fly.io의 자체 DB인 SQLITE3에 저장합니다.

수정사항이 없는 mdx 파일은 새로 컴파일하지 않기 때문에 전체적인 Build 타임이 상당히 줄어드는데요.

한 가지 불편한 점은 블로그 파일을 만들 때 이미지 파일을 별도의 이미지 CDN에 올려 링크를 일일이 달아줘야 하는 게 번거롭습니다.

그것만 빼고는 Fly.io가 상당히 빠른데요.

서버(Regions)는 한국과 가까운 일본 쪽으로 선택했습니다.

Fly.io는 CloudFlare를 사용해서 상당히 빠른 속도를 자랑합니다.

나중에 전체적인 블로그 만들기 편도 올릴 예정이니 그때 찾아뵙기로 하겠습니다.

그럼.
