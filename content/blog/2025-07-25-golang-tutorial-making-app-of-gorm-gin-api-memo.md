---
slug: 2025-07-25-golang-tutorial-making-app-of-gorm-gin-api-memo
title: Golang, GORM, Gin으로 만드는 API 기반 메모 애플리케이션 완전 정복
date: 2025-07-26 11:22:05.943000+00:00
summary: Golang의 웹 프레임워크 Gin과 GORM을 사용하여 SQLite 데이터베이스와 연동되는 고성능 메모 애플리케이션 API 서버를 구축하는 방법을 단계별로 상세히 설명합니다.
tags: ["golang", "Golang", "Gin", "GORM", "go", "SQLite"]
contributors: []
draft: false
---

API 개발의 세계는 끊임없이 진화하고 있으며, 그 중심에서 Go 언어(Golang)는 탁월한 성능과 간결함으로 많은 개발자의 사랑을 받고 있습니다.

Go의 표준 라이브러리만으로도 충분히 강력한 웹 서버를 만들 수 있지만, 프로젝트의 규모가 커지고 기능이 복잡해질수록 라우팅, 요청 데이터 처리, 오류 관리 등에서 코드의 양이 늘어나고 유지보수가 어려워지는 문제에 직면하게 됩니다.<br />

이러한 문제를 해결하기 위해 등장한 것이 바로 '웹 프레임워크'입니다.

이번 포스트에서는 Go 생태계에서 가장 인기 있는 웹 프레임워크 중 하나인 'Gin'을 도입하여, 기존에 표준 라이브러리로 작성되었을 법한 메모 애플리케이션 API를 어떻게 더 효율적이고 구조적으로 개선할 수 있는지 상세히 다루어 보겠습니다.<br />

Gin과 함께 강력한 ORM 라이브러리인 'GORM'을 사용하여 데이터베이스 작업을 추상화하고, 최종적으로는 실제 운영 환경에서도 충분히 사용 가능한 견고한 API 서버를 구축하는 전 과정을 안내합니다.

이 글을 통해 여러분은 Gin이 제공하는 개발 생산성의 향상을 직접 체감하고, 클린 아키텍처의 기초가 되는 구조화된 프로젝트를 설계하는 방법을 배우게 될 것입니다.<br />

## 왜 Gin 프레임워크를 선택해야 할까요
Gin은 Go 언어에서 가장 널리 사용되는 고성능 웹 프레임워크 중 하나입니다.

표준 라이브러리의 `net/http`를 기반으로 하면서도 개발 편의성을 극대화하는 다양한 기능을 제공합니다.<br /> Gin을 사용함으로써 얻을 수 있는 핵심적인 장점은 다음과 같습니다.<br />

**간결하고 직관적인 라우팅**<br />

Gin을 사용하면 `router.GET`, `router.POST`, `router.DELETE`와 같은 메서드를 통해 HTTP 메서드와 URL 경로에 따른 핸들러를 매우 직관적으로 연결할 수 있습니다.<br /> 덕분에 코드가 훨씬 간결해지고 가독성이 높아집니다.<br />

**강력한 JSON 바인딩**<br />

API 서버는 클라이언트와 JSON 형식으로 데이터를 주고받는 것이 일반적입니다.<br /> Gin의 컨텍스트(`*gin.Context`)는 `c.ShouldBindJSON(&target)` 한 줄만으로 요청 본문의 JSON 데이터를 Go 구조체로 손쉽게 변환해 줍니다.<br /> 응답을 보낼 때도 `c.JSON()` 메서드를 사용하여 간단하게 처리할 수 있습니다.<br />

**확장성을 위한 미들웨어**<br />

미들웨어는 요청 처리 과정의 전후에 공통적인 기능을 추가할 수 있는 강력한 도구입니다.<br /> Gin은 로깅, 인증, CORS 처리, 오류 복구 등 다양한 기본 미들웨어를 제공하며, 필요에 따라 커스텀 미들웨어를 손쉽게 추가하여 기능 확장을 유연하게 할 수 있습니다.<br />

**압도적인 성능**<br />

Gin은 Radix Tree 기반의 라우터를 사용하여 매우 빠른 라우팅 성능을 자랑합니다.<br /> 표준 라이브러리의 장점을 살리면서 필요한 기능만을 효율적으로 추가했기 때문에, 오버헤드가 적고 수많은 상용 서비스에서 채택될 만큼 뛰어난 처리 속도를 보여줍니다.<br />

이러한 장점들 덕분에 개발자는 반복적인 작업에서 벗어나 비즈니스 로직 구현에 더욱 집중할 수 있는 환경을 만들 수 있습니다.<br />

## 본격적인 개발에 앞서 알아야 할 핵심 개념

튜토리얼을 진행하기 전에, 이번 프로젝트의 핵심 구성 요소인 GORM과 API 엔드포인트 설계에 대해 간단히 짚고 넘어가겠습니다.<br />

**GORM 이란 무엇인가**<br />

GORM(Go-Object Relational Mapping)은 Go 언어를 위한 ORM 라이브러리입니다.<br />

ORM은 객체 지향 프로그래밍의 '객체'와 관계형 데이터베이스의 '데이터'를 자동으로 연결(매핑)해주는 기술입니다.<br />

GORM을 사용하면 복잡한 SQL 쿼리문을 직접 작성하지 않고도, Go 구조체를 통해 데이터베이스의 테이블을 생성하고 데이터를 조회, 추가, 수정, 삭제(CRUD)할 수 있습니다.<br />

이는 개발 생산성을 높이고, 데이터베이스 종류가 변경되더라도 코드 수정을 최소화할 수 있는 유연성을 제공합니다.<br />

**API 엔드포인트 설계**<br />

우리가 만들 메모 애플리케이션은 다음과 같은 세 가지 핵심 기능을 제공하는 API 엔드포인트를 가집니다.<br />
1. `POST /memos` : 새로운 메모를 생성하는 엔드포인트입니다.<br /> 클라이언트는 생성할 메모의 내용을 JSON 형식으로 요청 본문에 담아 전송합니다.<br />
2. `GET /memos` : 저장된 모든 메모의 목록을 조회하는 엔드포인트입니다.<br />
3. `DELETE /memos/:id` : 특정 ID를 가진 메모를 삭제하는 엔드포인트입니다.<br /> `:id` 부분은 동적으로 변경되는 경로 파라미터입니다.<br />

## 개발 환경 설정 및 프로젝트 구조화
본격적인 코드 작성에 앞서, 필요한 라이브러리를 설치하고 확장성을 고려한 프로젝트 구조를 설계하겠습니다.<br />

'필요한 라이브러리 설치'<br />

터미널에서 아래 명령어를 실행하여 Gin과 GORM, 그리고 SQLite 드라이버를 설치합니다.<br />

```bash
go get -u github.com/gin-gonic/gin
go get -u gorm.io/gorm
go get -u gorm.io/driver/sqlite
```
<br />

'확장성을 고려한 프로젝트 구조'<br />

작은 예제에서는 모든 코드를 `main.go` 파일 하나에 작성할 수 있지만, 실제 애플리케이션에서는 기능별로 코드를 분리하는 것이 유지보수와 협업에 매우 유리합니다.<br />

우리는 다음과 같은 구조로 프로젝트를 구성할 것입니다.<br />

```
/memo-api
├── main.go         # 서버 실행, 라우터 설정 등 애플리케이션의 진입점
├── models/         # 데이터베이스 모델(구조체) 정의
│   └── memo.go
├── handlers/       # HTTP 요청을 직접 처리하는 핸들러 함수
│   └── memo_handler.go
└── database/       # 데이터베이스 연결 및 초기화 관리
    └── database.go
```
<br />
이러한 구조는 각 부분의 역할과 책임을 명확히 분리하여 코드를 훨씬 더 체계적으로 관리할 수 있게 도와줍니다.<br />

## 데이터베이스 연결 및 모델 정의

먼저 데이터베이스 연결을 설정하고, 메모 데이터를 표현할 Go 구조체를 정의합니다.<br />

'데이터베이스 모델 정의 (`models/memo.go`)'<br />

`models` 디렉터리 아래에 `memo.go` 파일을 생성하고 다음과 같이 `Memo` 구조체를 정의합니다.<br /> 

`gorm` 태그는 GORM이 이 구조체를 어떻게 데이터베이스 테이블과 매핑할지 알려주는 역할을 하며, `json` 태그는 JSON으로 변환될 때 사용될 필드 이름을 지정합니다.<br />

```go
package models

type Memo struct {
	ID      uint   `gorm:"primaryKey" json:"id"`
	Content string `gorm:"not null" json:"content"`
}
```
<br />

'데이터베이스 연결 설정 (`database/database.go`)'<br />

`database` 디렉터리 아래에 `database.go` 파일을 생성하여 데이터베이스 연결을 초기화하는 코드를 작성합니다.<br />

이 함수는 애플리케이션이 시작될 때 한 번만 호출될 것입니다.<br />

```go
package database

import (
	"log"
	"memo-api/models"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	var err error
	// SQLite 데이터베이스에 연결합니다. 파일이 없으면 자동으로 생성됩니다.
	DB, err = gorm.Open(sqlite.Open("memo.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("데이터베이스 연결에 실패했습니다: ", err)
	}

	// Memo 모델을 기반으로 데이터베이스 테이블을 자동으로 생성(마이그레이션)합니다.
	err = DB.AutoMigrate(&models.Memo{})
	if err != nil {
		log.Fatal("데이터베이스 마이그레이션에 실패했습니다: ", err)
	}

	log.Println("데이터베이스 연결 및 마이그레이션 성공!")
}
```
<br />

## API 핸들러 구현

이제 각 엔드포인트의 실제 로직을 담당할 핸들러 함수들을 `handlers/memo_handler.go` 파일에 작성합니다.<br />

```go
package handlers

import (
	"memo-api/database"
	"memo-api/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// 메모 추가 핸들러
func AddMemoHandler(c *gin.Context) {
	var memo models.Memo
	// 요청 본문의 JSON을 Memo 구조체로 바인딩합니다.
	if err := c.ShouldBindJSON(&memo); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "잘못된 요청입니다."})
		return
	}

	// 데이터베이스에 새로운 메모를 생성합니다.
	if err := database.DB.Create(&memo).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "메모 생성에 실패했습니다."})
		return
	}

	// 성공적으로 생성된 메모 정보를 201 Created 상태와 함께 반환합니다.
	c.JSON(http.StatusCreated, memo)
}

// 모든 메모 조회 핸들러
func ListMemosHandler(c *gin.Context) {
	var memos []models.Memo
	// 데이터베이스에서 모든 메모를 찾아 memos 슬라이스에 담습니다.
	if err := database.DB.Find(&memos).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "메모를 불러오는 데 실패했습니다."})
		return
	}

	// 조회된 메모 목록을 200 OK 상태와 함께 반환합니다.
	c.JSON(http.StatusOK, memos)
}

// 특정 메모 삭제 핸들러
func DeleteMemoHandler(c *gin.Context) {
	// URL 경로에서 id 파라미터를 가져옵니다.
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "유효하지 않은 ID입니다."})
		return
	}

	// 해당 ID를 가진 메모를 데이터베이스에서 삭제합니다.
	result := database.DB.Delete(&models.Memo{}, id)
	
	// 삭제 과정에서 오류가 발생했거나, 삭제된 행이 없는 경우(ID가 존재하지 않음)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "메모 삭제에 실패했습니다."})
		return
	}
	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "해당 ID의 메모를 찾을 수 없습니다."})
		return
	}

	// 삭제 성공 메시지를 200 OK 상태와 함께 반환합니다.
	c.JSON(http.StatusOK, gin.H{"message": "메모가 성공적으로 삭제되었습니다."})
}
```
<br />

여기서 주목할 점은 '오류 처리'와 'HTTP 상태 코드' 관리입니다.<br />

`c.ShouldBindJSON`으로 요청 데이터의 유효성을 검사하고, 데이터베이스 작업의 성공 여부를 확인한 뒤, 각 상황에 맞는 적절한 HTTP 상태 코드(예: `201 Created`, `400 Bad Request`, `404 Not Found`, `500 Internal Server Error`)와 명확한 메시지를 클라이언트에 반환하는 것이 중요합니다.<br />

## 라우팅 및 서버 실행

마지막으로, 프로젝트의 진입점인 `main.go` 파일에서 지금까지 만든 모든 구성 요소를 하나로 합쳐 서버를 실행합니다.<br />

```go
package main

import (
	"log"
	"memo-api/database"
	"memo-api/handlers"

	"github.com/gin-gonic/gin"
)

func main() {
	// 데이터베이스 연결 초기화
	database.ConnectDatabase()

	// Gin 라우터 초기화. Default()는 로거와 복구 미들웨어를 기본으로 탑재합니다.
	router := gin.Default()

	// API 엔드포인트와 핸들러 함수를 연결(라우팅)합니다.
	router.POST("/memos", handlers.AddMemoHandler)
	router.GET("/memos", handlers.ListMemosHandler)
	router.DELETE("/memos/:id", handlers.DeleteMemoHandler)

	// 서버를 8080 포트에서 실행합니다.
	log.Println("서버가 8080 포트에서 실행됩니다.")
	if err := router.Run(":8080"); err != nil {
		log.Fatal("서버 실행에 실패했습니다: ", err)
	}
}
```
<br />

## API 동작 확인 및 테스트

서버가 준비되었으니, `curl`과 같은 도구를 사용하여 API가 정상적으로 동작하는지 확인해 보겠습니다.<br /> 

터미널에서 `go run main.go` 명령어로 서버를 실행한 뒤, 다른 터미널 창을 열어 아래 명령어들을 실행합니다.<br />

'1. 새로운 메모 추가 (POST /memos)'<br />
`-X POST`는 POST 요청을, `-H`는 헤더를, `-d`는 요청 본문을 의미합니다.<br />

```bash
curl -X POST http://localhost:8080/memos -H "Content-Type: application/json" -d '{"content": "오늘 회의 내용 정리하기"}'
```
<br />
성공 시, 서버는 다음과 같은 JSON 응답을 반환합니다.<br />

```json
{"id":1,"content":"오늘 회의 내용 정리하기"}
```
<br />

'2. 모든 메모 목록 조회 (GET /memos)'<br />

```bash
curl http://localhost:8080/memos
```
<br />
성공 시, 현재까지 저장된 모든 메모가 배열 형태로 반환됩니다.<br />

```json
[{"id":1,"content":"오늘 회의 내용 정리하기"}]
```
<br />

'3. 특정 메모 삭제 (DELETE /memos/:id)'<br />
ID가 1인 메모를 삭제해 보겠습니다.<br />

```bash
curl -X DELETE http://localhost:8080/memos/1
```
<br />
성공 시, 다음과 같은 메시지가 반환됩니다.<br />

```json
{"message":"메모가 성공적으로 삭제되었습니다."}
```

---
