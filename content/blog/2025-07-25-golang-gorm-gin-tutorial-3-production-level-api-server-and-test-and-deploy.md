---
slug: 2025-07-25-golang-gorm-gin-tutorial-3-production-level-api-server-and-test-and-deploy
title: Golang, Gin, GORM 실전 API 개발 3편 - 프로덕션 서버 구축하기 설정, 테스트, 그리고 배포
date: 2025-07-26 13:00:48.181000+00:00
summary: 2편에 이어 Golang API 서버를 프로덕션 수준으로 끌어올리는 방법을 다룹니다. 환경 변수를 이용한 안전한 설정 관리, 유닛 테스트 작성, Docker를 이용한 컨테이너화까지 실전 배포 기술을 마스터합니다.
tags: ["Golang", "Docker", "유닛 테스트", "CI/CD", "배포", "환경 변수", "API", "백엔드", "튜토리얼"]
contributors: []
draft: false
---

<br />

지금까지 우리는 1편과 2편에 걸쳐 Golang, Gin, GORM으로 메모 애플리케이션의 핵심 기능을 구현하고, JWT 기반의 사용자 인증 시스템까지 도입하며 견고한 API의 기틀을 마련했습니다.<br />

이제 여러분의 애플리케이션은 기능적으로는 완성되었지만, '실제 운영 환경'에 배포하기 위해서는 몇 가지 중요한 단계를 더 거쳐야 합니다.<br />

개발자의 컴퓨터에서 잘 동작하는 것과, 안정적으로 서비스를 제공하는 것은 전혀 다른 차원의 이야기이기 때문입니다.<br />

이번 3편에서는 여러분의 API 서버를 '취미 프로젝트'에서 '프로페셔널 프로덕션 애플리케이션'으로 격상시키는 세 가지 핵심 기술을 다룰 것입니다.<br />

첫째, 민감한 정보를 코드로부터 분리하는 '환경 변수를 이용한 설정 관리'를 통해 보안을 강화합니다.<br />

둘째, 코드 변경이 기존 기능을 망가뜨리지 않도록 보장하는 '유닛 테스트'를 작성하여 애플리케이션의 신뢰성을 확보합니다.<br />

마지막으로, 어떤 환경에서든 동일하게 동작하도록 애플리케이션을 패키징하는 'Docker 컨테이너화'를 통해 배포 준비를 마칩니다.<br />

이 과정을 통해 여러분은 비로소 안정적이고 확장 가능하며, 배포 준비가 완료된 진정한 의미의 백엔드 개발자로 거듭나게 될 것입니다.<br />

## 1. 환경 변수를 이용한 안전한 설정 관리

현재 우리 코드에는 아주 위험한 부분이 존재합니다.<br />

바로 JWT 시크릿 키와 같은 민감한 정보가 코드 안에 그대로 노출되어 있다는 점입니다.<br />

이러한 정보가 Git과 같은 버전 관리 시스템에 올라가면 심각한 보안 사고로 이어질 수 있습니다.<br />

'환경 변수'는 이러한 설정 값들을 코드 외부에서 주입하는 방식으로, 이 문제를 해결하는 가장 표준적인 방법입니다.<br />

'개발 환경 구성을 위한 .env 도입'<br />

개발 시에는 `.env` 파일을 통해 환경 변수를 쉽게 관리할 수 있도록 도와주는 `godotenv` 라이브러리를 사용하겠습니다.<br />

'라이브러리 설치'<br />
```bash
go get -u github.com/joho/godotenv
```
<br />

'프로젝트 루트에 .env 파일 생성'<br />

프로젝트의 최상위 디렉터리에 `.env` 파일을 만들고 다음과 같이 민감한 정보를 옮깁니다.<br />

```
# .env

JWT_SECRET_KEY="your_very_secret_key_that_is_long_and_secure"
DATABASE_URL="memo.db"
```
<br />

'.gitignore에 .env 추가'<br />

이 파일이 Git에 커밋되지 않도록 `.gitignore` 파일에 반드시 `.env`를 추가해야 합니다.<br />

```
# .gitignore

/memo-api # 컴파일된 바이너리
*.db
.env # 이 라인을 추가합니다.
```
<br />

'애플리케이션에 환경 변수 로더 적용 (`main.go`)'<br />

`main.go` 파일의 `main` 함수 시작 부분에서 `.env` 파일을 로드하는 코드를 추가합니다.<br />

```go
package main

import (
	"log"
	"memo-api/database"
	"memo-api/handlers"
	"memo-api/middleware"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv" // 라이브러리 임포트
)

func main() {
	// .env 파일로부터 환경 변수를 로드합니다.
	err := godotenv.Load()
	if err != nil {
		log.Println("환경 변수 파일을 찾을 수 없습니다. 기본 설정을 사용합니다.")
	}

	database.ConnectDatabase() // 이제 ConnectDatabase 내부에서 환경 변수를 사용합니다.
    
    // ... 기존 코드 ...

    // 아래 라우팅 코드에서 하드코딩된 os.Setenv는 제거합니다.
	// os.Setenv("JWT_SECRET_KEY", "...") // 이 줄을 삭제합니다.

    // ...
}
```
<br />
이제 `database/database.go`와 `handlers/user_handler.go` 등에서 `os.Getenv("변수명")`을 사용하여 안전하게 설정 값을 불러올 수 있습니다.<br />

## 2. 유닛 테스트로 애플리케이션 신뢰성 확보

좋은 코드는 테스트 코드와 함께 완성됩니다.<br />

'유닛 테스트'는 코드의 가장 작은 단위(함수, 메서드)가 의도대로 정확히 동작하는지 검증하는 과정입니다.<br /> 

이를 통해 새로운 기능을 추가하거나 코드를 리팩토링할 때 발생할 수 있는 예기치 않은 오류(회귀 버그)를 사전에 방지하여 애플리케이션의 안정성을 극대화할 수 있습니다.<br />

'테스트 환경 설정'<br />

테스트는 실제 운영 데이터베이스가 아닌, '격리된 테스트용 데이터베이스'를 사용해야 합니다.<br />

이를 위해 테스트가 시작될 때 테스트 DB를 설정하고, 테스트가 끝나면 깨끗하게 정리하는 로직이 필요합니다.<br />

'로그인 핸들러 테스트 작성 (`handlers/user_handler_test.go`)'<br />

`handlers` 디렉터리에 `user_handler_test.go` 파일을 새로 생성하고 로그인 기능에 대한 테스트 코드를 작성해 보겠습니다.<br />

```go
package handlers

import (
	"bytes"
	"encoding/json"
	"memo-api/database"
	"memo-api/models"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"golang.org/x/crypto/bcrypt"
)

// 테스트를 위한 메인 셋업 함수
func setupTestRouter() *gin.Engine {
	// 테스트 모드로 Gin 설정
	gin.SetMode(gin.TestMode)

	// 테스트용 데이터베이스 연결
	database.DB, _ = gorm.Open(sqlite.Open("test_memo.db"), &gorm.Config{})
	database.DB.AutoMigrate(&models.User{}, &models.Memo{})

	router := gin.Default()
	router.POST("/login", LoginHandler)
	
	// 테스트 종료 후 데이터베이스 파일 삭제
	os.Remove("test_memo.db")

	return router
}

// 테스트 종료 후 데이터베이스 정리
func teardownTestDatabase() {
	sqlDB, _ := database.DB.DB()
	sqlDB.Close()
	os.Remove("test_memo.db")
}

func TestLoginHandler(t *testing.T) {
	// 테스트 환경 설정
	router := setupTestRouter()
	defer teardownTestDatabase() // 테스트가 끝나면 반드시 DB 정리

	// 1. 테스트용 사용자 생성
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	testUser := models.User{Username: "testuser", Password: string(hashedPassword)}
	database.DB.Create(&testUser)

	// 2. 로그인 요청 데이터 준비
	loginCredentials := map[string]string{
		"username": "testuser",
		"password": "password123",
	}
	requestBody, _ := json.Marshal(loginCredentials)

	// 3. HTTP 요청 시뮬레이션
	req, _ := http.NewRequest("POST", "/login", bytes.NewBuffer(requestBody))
	req.Header.Set("Content-Type", "application/json")

	// 4. 응답 기록
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	// 5. 결과 검증
	// 상태 코드가 200 OK 인지 확인
	assert.Equal(t, http.StatusOK, w.Code)

	var response map[string]string
	json.Unmarshal(w.Body.Bytes(), &response)
	
	// 응답에 'token' 필드가 존재하는지 확인
	assert.Contains(t, response, "token", "응답 본문에 토큰이 포함되어야 합니다.")
}
```
<br />
이제 터미널에서 `go test ./...` 명령을 실행하면 프로젝트 내의 모든 테스트 코드가 실행됩니다.<br />

`TestLoginHandler`가 성공적으로 통과한다면, 로그인 기능이 기대한 대로 동작함을 보증할 수 있습니다.<br />

## 3. Docker를 이용한 컨테이너화 및 배포 준비

'Docker'는 애플리케이션과 그 실행에 필요한 모든 환경(라이브러리, 시스템 도구 등)을 '컨테이너'라는 격리된 공간에 패키징하는 기술입니다.<br />

이를 통해 "제 컴퓨터에서는 잘 되는데..."와 같은 고질적인 문제를 해결하고, 개발, 테스트, 운영 환경 어디에서나 동일한 실행을 보장하여 배포 과정을 획기적으로 단순화하고 안정화합니다.<br />

'Dockerfile 작성'<br />

프로젝트 루트 디렉터리에 `Dockerfile`이라는 이름의 파일을 생성합니다.<br />

우리는 Go 애플리케이션에 최적화된 '멀티 스테이지 빌드' 방식을 사용할 것입니다.<br />

이는 최종 이미지의 크기를 최소화하고 보안을 강화하는 매우 효과적인 방법입니다.<br />

```
# Dockerfile

# --- 1단계: 빌드 환경 ---
# Go 공식 이미지를 빌더로 사용합니다.
FROM golang:1.21-alpine AS builder

# 작업 디렉터리 설정
WORKDIR /app

# Go 모듈 의존성 먼저 복사 및 다운로드 (레이어 캐싱 활용)
COPY go.mod go.sum ./
RUN go mod download

# 소스 코드 전체 복사
COPY . .

# 애플리케이션 빌드. CGO 비활성화 및 정적 바이너리 생성
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o memo-api .

# --- 2단계: 최종 실행 환경 ---
# 매우 가벼운 Alpine Linux 이미지를 기반으로 합니다.
FROM alpine:latest

# 작업 디렉터리 설정
WORKDIR /root/

# 빌드 환경(builder)에서 컴파일된 바이너리만 복사
COPY --from=builder /app/memo-api .

# .env 파일을 컨테이너에 복사할 수 있지만,
# 실제 운영에서는 docker run 시 -e 옵션이나 docker-compose로 주입하는 것이 더 안전합니다.
# COPY .env . 

# 컨테이너가 8080 포트를 외부에 노출함을 명시
EXPOSE 8080

# 컨테이너 시작 시 실행될 명령어
CMD ["./memo-api"]
```
<br />

'.dockerignore 파일 작성'<br />
Docker 이미지를 만들 때 불필요한 파일이 포함되지 않도록 `.dockerignore` 파일을 생성합니다.<br /> 이는 빌드 속도를 높이고 이미지 용량을 줄여줍니다.<br />

```
# .dockerignore

.git
.gitignore
.env
*.db
Dockerfile
```
<br />

'Docker 이미지 빌드 및 컨테이너 실행'<br />

이제 터미널에서 아래 명령어를 사용하여 이미지를 빌드하고 컨테이너를 실행할 수 있습니다.<br />

'1. Docker 이미지 빌드'<br />

```bash
docker build -t memo-api-app .
```
<br />
'2. Docker 컨테이너 실행'<br />

`--env-file` 옵션으로 로컬의 `.env` 파일을 컨테이너에 주입합니다.<br />

```bash
docker run -p 8080:8080 --env-file .env memo-api-app
```
<br />

이제 여러분의 Go 애플리케이션은 완벽하게 격리된 컨테이너 안에서 실행되고 있으며, `http://localhost:8080`으로 이전과 동일하게 접속할 수 있습니다.<br />

이 Docker 이미지만 있으면, Docker가 설치된 어떤 서버에서든 단 몇 초 만에 애플리케이션을 배포할 수 있습니다.<br />

## 마무리

총 3편에 걸친 튜토리얼을 통해, 우리는 단순한 아이디어에서 출발하여 실제 서비스로 배포 가능한 견고하고 전문적인 API 서버를 완성했습니다.<br />

