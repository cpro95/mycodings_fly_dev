---
slug: 2025-07-25-tutorial-gorm-gin-api-app-pathc-put-and-howto-jwt-authentication
title: Golang, Gin, GORM 실전 API 개발 2편 - 사용자 인증과 데이터 수정 기능 구현
date: 2025-07-26 12:54:59.645000+00:00
summary: 1편에 이어 Golang, Gin, GORM을 사용하여 기존 메모 API에 PATCH를 이용한 데이터 수정 기능과 JWT 기반의 안전한 사용자 인증 미들웨어를 추가하는 방법을 다룹니다.
tags: ["Golang", "Gin", "GORM", "JWT", "API", "인증", "미들웨어", "백엔드", "튜토리얼", "bcrypt"]
contributors: []
draft: false
---

지난 1편에서는 Golang, Gin, GORM을 활용하여 기본적인 CRUD 기능을 갖춘 메모 애플리케이션 API의 뼈대를 성공적으로 구축했습니다.<br />

하지만 실제 서비스로 발전하기 위해서는 두 가지 중요한 과제가 남아있습니다.<br />

바로 '데이터를 수정하는 기능'과 '사용자를 식별하고 권한을 관리하는 인증 시스템'입니다.<br />

이번 2편에서는 1편에서 만든 프로젝트를 기반으로, API를 한 단계 더 발전시키는 심화 과정을 다루고자 합니다.<br />

먼저, `PATCH` 메서드를 사용하여 특정 메모의 내용을 효율적으로 수정하는 기능을 구현할 것입니다.<br /> 

이어서, 현대적인 웹 서비스의 필수 요소인 'JWT(JSON Web Token)'를 도입하여 사용자 등록 및 로그인 시스템을 구축하고, 오직 인증된 사용자만이 자신의 메모에 접근할 수 있도록 안전한 API 환경을 만드는 전 과정을 상세히 안내하겠습니다.<br />

이 튜토리얼을 마치고 나면, 여러분의 API 서버는 단순히 데이터를 저장하고 보여주는 것을 넘어, 실제 사용자 데이터를 안전하게 관리하는 '다중 사용자 서비스'의 견고한 기반을 갖추게 될 것입니다.<br />

## 1. 메모 수정 기능 추가 (PATCH 메서드 활용)

데이터를 수정하는 HTTP 메서드에는 `PUT`과 `PATCH`가 있습니다.<br />

`PUT`은 리소스 전체를 교체하는 개념인 반면, `PATCH`는 리소스의 일부만 수정하는 데 사용됩니다.<br /> 

메모의 내용만 바꾸는 경우에는 전체 데이터를 보낼 필요 없이 변경할 필드만 보내는 `PATCH`가 더 효율적이고 의미상 적합합니다.<br />

'프로젝트 구조 업데이트'<br />

먼저, 기존 `handlers/memo_handler.go` 파일에 메모 수정을 위한 새로운 핸들러 함수를 추가하고, `main.go`에서 해당 라우트를 연결해 줄 것입니다.<br />

'메모 업데이트 핸들러 구현 (`handlers/memo_handler.go`에 추가)'<br />

기존 `memo_handler.go` 파일 맨 아래에 다음 `UpdateMemoHandler` 함수를 추가합니다.<br />

```go
// 메모 수정 핸들러
func UpdateMemoHandler(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "유효하지 않은 ID입니다."})
		return
	}

	// 먼저 해당 ID의 메모가 존재하는지 확인합니다.
	var memo models.Memo
	if err := database.DB.First(&memo, id).Error; err != nil {
		// gorm.ErrRecordNotFound 는 데이터가 없다는 오류입니다.
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "해당 ID의 메모를 찾을 수 없습니다."})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "데이터베이스 오류입니다."})
		return
	}
	
	// 요청 본문에서 업데이트할 데이터를 바인딩합니다.
	// 이 경우, content 필드만 업데이트할 것입니다.
	var updatedData struct {
		Content string `json:"content"`
	}

	if err := c.ShouldBindJSON(&updatedData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "잘못된 요청 데이터입니다."})
		return
	}

	// 데이터베이스에서 메모 내용을 업데이트합니다.
	// GORM의 Updates 메서드는 0값이나 nil이 아닌 필드만 업데이트해줍니다.
	if err := database.DB.Model(&memo).Updates(updatedData).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "메모 업데이트에 실패했습니다."})
		return
	}

	c.JSON(http.StatusOK, memo)
}
```
<br />

'라우터에 PATCH 엔드포인트 등록 (`main.go` 수정)'<br />

`main.go` 파일의 라우팅 부분에 `PATCH` 메서드를 사용하는 새로운 경로를 추가합니다.<br />

```go
// ... main.go 파일의 기존 코드 ...
	router.POST("/memos", handlers.AddMemoHandler)
	router.GET("/memos", handlers.ListMemosHandler)
	router.DELETE("/memos/:id", handlers.DeleteMemoHandler)
	// 아래 라우트를 추가합니다.
	router.PATCH("/memos/:id", handlers.UpdateMemoHandler)
// ...
```
<br />

## 2. JWT 기반 사용자 인증 시스템 도입

이제 이 API를 여러 사용자가 함께 사용하는 서비스로 만들기 위해 사용자 인증 시스템을 도입하겠습니다.<br /> 

사용자를 관리할 `User` 모델을 만들고, 비밀번호는 암호화하여 저장하며, 로그인이 성공하면 JWT를 발급하여 이후의 요청을 인증하는 흐름으로 구현합니다.<br />

'필요한 라이브러리 설치'<br />

JWT 생성 및 검증을 위한 라이브러리와 비밀번호 해싱을 위한 `bcrypt` 라이브러리를 설치합니다.<br />

```bash
go get -u github.com/golang-jwt/jwt/v4
go get -u golang.org/x/crypto/bcrypt
```
<br />

'프로젝트 구조 대규모 개편'<br />

인증 기능이 추가되면서 프로젝트 구조에 큰 변화가 필요합니다.<br />

1.  `models/user.go`: 사용자 정보를 담을 `User` 모델을 새로 정의합니다.<br />
2.  `models/memo.go`: 기존 `Memo` 모델에 '누가 작성했는지'를 나타내는 `UserID` 필드를 추가합니다.<br />
3.  `handlers/user_handler.go`: 사용자 '가입'과 '로그인'을 처리할 핸들러를 새로 만듭니다.<br />
4.  `middleware/auth.go`: JWT를 검증하여 인증된 요청인지 확인하는 '미들웨어'를 새로 만듭니다.<br />

'1단계: 모델 업데이트'<br />

'User 모델 생성 (`models/user.go`)'<br />

```go
package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Username string `gorm:"unique;not null" json:"username"`
	Password string `gorm:"not null" json:"-"` // json:"-" 태그는 JSON 응답에 포함되지 않도록 합니다.
}
```
<br />
'Memo 모델 수정 (`models/memo.go`)'<br />

`Memo`가 어떤 `User`에 속하는지 연결하기 위해 `UserID` 필드를 추가합니다.<br />

```go
package models

import "gorm.io/gorm"

type Memo struct {
	gorm.Model // gorm.Model은 ID, CreatedAt, UpdatedAt, DeletedAt을 포함합니다.
	Content string `gorm:"not null" json:"content"`
	UserID  uint   `gorm:"not null" json:"user_id"`
	User    User   `gorm:"foreignKey:UserID" json:"-"` // 관계 정의
}
```
<br />

`database/database.go`와 `main.go`의 마이그레이션 부분도 `User` 모델을 포함하도록 수정해야 합니다.<br />

`database.go` 수정: `DB.AutoMigrate(&models.Memo{}, &models.User{})`<br />

'2단계: 사용자 가입 및 로그인 핸들러 구현'<br />

`handlers/user_handler.go` 파일을 새로 생성하고 다음 코드를 작성합니다.<br />

```go
package handlers

import (
	"memo-api/database"
	"memo-api/models"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/crypto/bcrypt"
)

// JWT 서명에 사용할 시크릿 키입니다. 실제 운영 환경에서는 환경 변수 등으로 안전하게 관리해야 합니다.
var jwtKey = []byte(os.Getenv("JWT_SECRET_KEY"))

// 사용자 가입 핸들러
func RegisterHandler(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "잘못된 요청입니다."})
		return
	}

	// 비밀번호를 bcrypt로 해싱합니다.
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "비밀번호 해싱에 실패했습니다."})
		return
	}
	user.Password = string(hashedPassword)

	// 데이터베이스에 사용자 생성
	if err := database.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "사용자 생성에 실패했습니다."})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "회원가입이 성공적으로 완료되었습니다."})
}

// 로그인 핸들러
func LoginHandler(c *gin.Context) {
	var creds models.User
	if err := c.ShouldBindJSON(&creds); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "잘못된 요청입니다."})
		return
	}

	var user models.User
	if err := database.DB.Where("username = ?", creds.Username).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "사용자 이름 또는 비밀번호가 잘못되었습니다."})
		return
	}

	// 저장된 해시와 입력된 비밀번호를 비교합니다.
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(creds.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "사용자 이름 또는 비밀번호가 잘못되었습니다."})
		return
	}

	// JWT 클레임 설정 (토큰에 담을 정보)
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &jwt.RegisteredClaims{
		Subject:   user.Username,
		ExpiresAt: jwt.NewNumericDate(expirationTime),
		ID:        strconv.FormatUint(uint64(user.ID), 10),
	}

	// 토큰 생성
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "토큰 생성에 실패했습니다."})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": tokenString})
}
```
<br />
'3단계: 인증 미들웨어 구현'<br />

`middleware` 디렉터리를 만들고, 그 안에 `auth.go` 파일을 생성합니다.<br />

이 미들웨어는 메모 관련 API에 접근하기 전에 실행되어, 요청 헤더의 JWT가 유효한지 검사합니다.<br />

```go
package middleware

import (
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
)

var jwtKey = []byte(os.Getenv("JWT_SECRET_KEY"))

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "인증 헤더가 필요합니다."})
			c.Abort()
			return
		}

		// "Bearer <token>" 형식에서 토큰 부분만 추출합니다.
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Bearer 토큰이 필요합니다."})
			c.Abort()
			return
		}

		claims := &jwt.RegisteredClaims{}
		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "유효하지 않은 토큰입니다."})
			c.Abort()
			return
		}

		// 클레임에서 추출한 사용자 ID를 컨텍스트에 저장하여
		// 이후의 핸들러에서 사용할 수 있도록 합니다.
		c.Set("userID", claims.ID)
		c.Next()
	}
}
```
<br />

'4단계: 라우터 및 메모 핸들러 수정'<br />

`main.go`를 수정하여 새로운 라우트를 추가하고, 기존 메모 관련 라우트 그룹에 인증 미들웨어를 적용합니다.<br />

```go
// ... main.go 상단 import 부분에 middleware 추가
// "memo-api/middleware"

func main() {
    // ... 데이터베이스 연결 ...
    
    // JWT_SECRET_KEY 환경 변수 설정 (실제로는 .env 파일 등을 사용)
	os.Setenv("JWT_SECRET_KEY", "your_very_secret_key_that_is_long_and_secure")

    router := gin.Default()

    // 공개 라우트 (인증 불필요)
    router.POST("/register", handlers.RegisterHandler)
    router.POST("/login", handlers.LoginHandler)

    // 인증이 필요한 API 그룹
    authorized := router.Group("/memos")
    authorized.Use(middleware.AuthMiddleware())
    {
        authorized.POST("", handlers.AddMemoHandler)
        authorized.GET("", handlers.ListMemosHandler)
        authorized.GET("/:id", handlers.GetMemoHandler) // 특정 메모 조회 핸들러(새로 추가)
        authorized.PATCH("/:id", handlers.UpdateMemoHandler)
        authorized.DELETE("/:id", handlers.DeleteMemoHandler)
    }

    // ... 서버 실행 ...
}
```
<br />
마지막으로, 모든 메모 핸들러(`Add`, `List`, `Update`, `Delete` 등)가 이제 '자신의 메모'만 처리하도록 수정해야 합니다.<br />

미들웨어에서 `c.Set("userID", ...)`로 저장한 사용자 ID를 가져와 데이터베이스 쿼리에 `WHERE user_id = ?` 조건을 추가하면 됩니다.<br />

예시: `ListMemosHandler` 수정<br />

```go
// 모든 메모 조회 핸들러
func ListMemosHandler(c *gin.Context) {
    userID, exists := c.Get("userID")
    if !exists {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "사용자 정보가 없습니다."})
        return
    }

	var memos []models.Memo
    // 자신의 user_id를 가진 메모만 조회합니다.
	if err := database.DB.Where("user_id = ?", userID).Find(&memos).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "메모를 불러오는 데 실패했습니다."})
		return
	}
	c.JSON(http.StatusOK, memos)
}
```
<br />
다른 모든 메모 핸들러(`Add`, `Update`, `Delete`)에도 이와 같이 `userID`를 가져와 쿼리에 적용하는 로직을 추가해야 합니다.<br />

## 3. 새로운 기능 테스트

'1. 사용자 가입'<br />

```bash
curl -X POST http://localhost:8080/register -H "Content-Type: application/json" -d '{"username": "testuser", "password": "password123"}'
```
<br />
'2. 로그인 및 토큰 획득'<br />

```bash
curl -X POST http://localhost:8080/login -H "Content-Type: application/json" -d '{"username": "testuser", "password": "password123"}'
```
<br />
성공 시 `{"token":"ey..."}`과 같은 JWT를 응답으로 받게 됩니다.<br /> 이 토큰을 복사해 두세요.<br />

'3. 토큰을 사용하여 메모 생성'<br />

`<YOUR_JWT_TOKEN>` 부분을 위에서 복사한 토큰으로 교체합니다.<br />

```bash
curl -X POST http://localhost:8080/memos -H "Authorization: Bearer <YOUR_JWT_TOKEN>" -H "Content-Type: application/json" -d '{"content": "나의 첫 번째 비밀 메모"}'
```
<br />
'4. 토큰을 사용하여 메모 수정'<br />

ID가 1인 메모의 내용을 수정합니다.<br />

```bash
curl -X PATCH http://localhost:8080/memos/1 -H "Authorization: Bearer <YOUR_JWT_TOKEN>" -H "Content-Type: application/json" -d '{"content": "수정된 나의 비밀 메모"}'
```
<br />
이제 토큰 없이 메모 API에 접근하려고 하면 `401 Unauthorized` 오류가 발생하는 것을 확인할 수 있습니다.<br />

## 마무리

이번 2편에서는 1편에서 구축한 기본 API에 살을 붙여, 데이터를 수정하는 `PATCH` 엔드포인트와 JWT 기반의 강력한 사용자 인증 시스템을 성공적으로 도입했습니다.<br />
