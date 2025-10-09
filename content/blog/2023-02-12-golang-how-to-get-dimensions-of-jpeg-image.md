---
slug: 2023-02-12-golang-how-to-get-dimensions-of-jpeg-image
title: Go 언어로 이미지 폭과 높이 정보 알아내기
date: 2023-02-12 08:43:40.163000+00:00
summary: Golang 으로 이미지(jpeg, png,gif) 폭(width), 높이(height) 정보 알아내기
tags: ["width", "height", "golang", "go"]
contributors: []
draft: false
---

안녕하세요?

오래간만에 Go 언어 강좌인데요.

Golang(고랭)언어의 image 패키지에 보면 DecodeConfig 함수가 있습니다.

이걸 이용할 건데요.

```go
package main

import (
	"fmt"
	"image"
	_ "image/gif"
	_ "image/jpeg"
	_ "image/png"
	"os"
)

func main() {
	imagePath := "physical-100.jpeg"

	file, err := os.Open(imagePath)
	defer file.Close()

	if err != nil {
		fmt.Fprintf(os.Stderr, "%v\n", err)
	}

	image, img_format, err := image.DecodeConfig(file)
	if err != nil {
		fmt.Fprintf(os.Stderr, "%s: %v\n", imagePath, err)
	}

  fmt.Printf("Image format: %s\n", img_format)
  fmt.Println("Width:", image.Width, "Height:", image.Height)
}
```

image.DecodeConfig는 이미지의 Config 구조체 정보와 이미지 포맷을 리턴해 줍니다.

Config 구조체에 보면 바로 우리가 원하는 정보인 Width, Height 속성이 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEh0rUE0YwK324ALPdY1XXT7FCmsiu5AFax-fozXR4kOaG6yNHddTvsRD_Jd-NDCzX9YQrViGd48UYFEqjws2fCudGSyGcgJKulmS1qfVoMVxZCI_-TKW8VWWTcIPGlxmJtuMvkC6b0eROT0SIEKmFzE48p-0uTnCY02se4v-s1_ujmLAcdcLCKvZo50)

그럼 터미널에서 실행해 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEgsmhHByQZB1kKh35elpDXo6-nr8XhBfU2ON2YzhCdhXkA3LIa5QkgD-HQN9AShmTpyMSzJL53Ks3pL0il31BUVrs4z6mmcG99fK2X5fcK7oXgwDPQm2OgGwF2vkKm6WpQ8kyqSYSB2NIAK1CERXp52v9JVT23qAwEMEAodfNc7EjVO9Z1Ho8qlT4Cc)

아주 잘 작동하네요.
