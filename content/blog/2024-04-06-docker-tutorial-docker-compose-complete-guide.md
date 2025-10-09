---
slug: 2024-04-06-docker-tutorial-docker-compose-complete-guide
title: Docker 강좌 6편. Docker Compose 완벽 가이드
date: 2024-04-06 12:05:41.692000+00:00
summary: Docker Compose 완벽 가이드
tags: ["docker", "docker-compose"]
contributors: []
draft: false
---

안녕하세요?

여섯번째 Docker 강좌입니다.

전체적인 강좌 리스트입니다.

1. [Docker 강좌 1편. 가상화와 Docker 기초 개념 이해하기](https://mycodings.fly.dev/blog/2024-04-06-docker-tutorial-understanding-virtualization-and-docker)

2. [Docker 강좌 2편. 실무에서 쓰이는 Docker 컨테이너 완벽 가이드](https://mycodings.fly.dev/blog/2024-04-06-docker-tutorial-docker-container-comprehensive-guide)

3. [Docker 강좌 3편. Docker 이미지 및 Dockerfile 기초](https://mycodings.fly.dev/blog/2024-04-06-docker-tutorial-understanding-docker-image-and-dockerfile)

4. [Docker 강좌 4편. Docker 볼륨 (Volume) 사용 방법과 원리](https://mycodings.fly.dev/blog/2024-04-06-docker-volume-usage-and-principles)

5. [Docker 강좌 5편. Docker 바인드 마운트와 포트 publish](https://mycodings.fly.dev/blog/2024-04-06-docker-tutorial-understanding-bind-mount-and-port-publish)

6. [Docker 강좌 6편. Docker Compose 완벽 가이드](https://mycodings.fly.dev/blog/2024-04-06-docker-tutorial-docker-compose-complete-guide)

---

** 목 차 **

- [Docker Compose란?](#docker-compose란)
  - [**개요**](#개요)
  - [**특징**](#특징)
    - [**YAML 파일을 통한 설정**](#yaml-파일을-통한-설정)
    - [**여러 컨테이너 일괄 관리**](#여러-컨테이너-일괄-관리)
    - [**네트워크 및 볼륨 관리**](#네트워크-및-볼륨-관리)
  - [**장점**](#장점)
    - [**환경 구축 효율화**](#환경-구축-효율화)
    - [**복잡한 애플리케이션 관리**](#복잡한-애플리케이션-관리)
    - [**이식성 향상**](#이식성-향상)
  - [**단점**](#단점)
    - [**학습 비용**](#학습-비용)
    - [**성능 영향**](#성능-영향)
    - [**지원 플랫폼 제한**](#지원-플랫폼-제한)
  - [Docker Compose와 일반적인 Docker 사용의 차이](#docker-compose와-일반적인-docker-사용의-차이)
  - [**Docker Compose의 베스트 프랙티스**](#docker-compose의-베스트-프랙티스)
    - [**환경 변수 관리를 위한 .env 파일 사용**](#환경-변수-관리를-위한-env-파일-사용)
    - [**마이크로서비스 아키텍처 채택**](#마이크로서비스-아키텍처-채택)
    - [**데이터 지속성을 위한 볼륨 사용**](#데이터-지속성을-위한-볼륨-사용)
    - [**네트워크 세그멘테이션**](#네트워크-세그멘테이션)
    - [**문서화와 버전 관리**](#문서화와-버전-관리)
  - [Docker Compose를 사용하는 방법](#docker-compose를-사용하는-방법)
    - [애플리케이션 실행하기](#애플리케이션-실행하기)
    - [애플리케이션 종료하기](#애플리케이션-종료하기)
    - [애플리케이션을 다시 시작하고 싶을 때](#애플리케이션을-다시-시작하고-싶을-때)
    - [이미지가 업데이트되면](#이미지가-업데이트되면)
    - [실행 중인 컨테이너에 접근하고 싶을 때](#실행-중인-컨테이너에-접근하고-싶을-때)
    - [실행 중인 컨테이너의 로그를 확인하고 싶을 때](#실행-중인-컨테이너의-로그를-확인하고-싶을-때)
    - [컨테이너의 애플리케이션이 DB 등의 서비스에 연결해야 할 때](#컨테이너의-애플리케이션이-db-등의-서비스에-연결해야-할-때)
  - [`docker-compose.yml`에 대해 더 자세히 알아보기](#docker-composeyml에-대해-더-자세히-알아보기)
  - [로컬 볼륨 삭제 방법](#로컬-볼륨-삭제-방법)
  - [사용하지 않는 컨테이너 삭제 방법](#사용하지-않는-컨테이너-삭제-방법)
  - [사용하지 않는 볼륨 삭제 방법](#사용하지-않는-볼륨-삭제-방법)
  - [사용하지 않는 이미지 삭제 방법](#사용하지-않는-이미지-삭제-방법)
  - [삭제할 수 없는 네트워크 문제](#삭제할-수-없는-네트워크-문제)
  - [Docker Compose Sample 이해](#docker-compose-sample-이해)
    - [설정 항목 확인](#설정-항목-확인)
    - [네트워크에 대한 고려 사항](#네트워크에-대한-고려-사항)
  - [마무리](#마무리)

---

# Docker Compose란?

## **개요**

Docker Compose는 여러 개의 컨테이너화된 애플리케이션을 일괄적으로 관리하고 실행하기 위한 도구입니다.

Docker는 컨테이너 기술을 활용하여 애플리케이션을 패키징, 배포 및 실행하는 플랫폼으로, 개발 환경 및 프로덕션 환경에서 애플리케이션을 쉽게 배포할 수 있도록 합니다.

## **특징**

### **YAML 파일을 통한 설정**

Docker Compose는 YAML 파일(일반적으로 `docker-compose.yml`이라는 이름)에 컨테이너 설정 및 관련 서비스 정보를 기록합니다.

이를 통해 프로젝트 구성을 명시적으로 기술하고 다른 개발자와 공유하기 쉬워집니다.
  
### **여러 컨테이너 일괄 관리**

Docker Compose를 사용하면 여러 컨테이너를 한 번에 빌드, 실행, 중지, 삭제할 수 있습니다.

이를 통해 복잡한 애플리케이션에서 여러 서비스나 데이터베이스를 효율적으로 관리할 수 있습니다.
  
### **네트워크 및 볼륨 관리**

Docker Compose는 컨테이너 간의 네트워크 연결 및 데이터 지속성을 위한 볼륨을 자동으로 관리합니다.

이로써 수동으로 네트워크나 볼륨 설정을 할 필요가 없어집니다.

## **장점**

### **환경 구축 효율화**

설정 파일을 공유함으로써 개발자 간의 환경 구축이 용이해지며 개발 효율이 향상됩니다.

### **복잡한 애플리케이션 관리**

여러 컨테이너와 서비스가 관련된 애플리케이션을 쉽게 관리할 수 있습니다.

### **이식성 향상**

Docker Compose 파일을 사용하여 환경에 독립적으로 애플리케이션을 구축하고 배포할 수 있습니다.

## **단점**

### **학습 비용**

Docker 및 Docker Compose의 개념과 작업 방법을 익히는 데 시간이 필요합니다.

### **성능 영향**

컨테이너화로 인해 일부 애플리케이션에서 성능에 영향을 줄 수 있습니다.

그러나 대부분의 경우 컨테이너화의 이점이 이를 상쇄합니다.

### **지원 플랫폼 제한**

Docker Compose는 Docker Engine이 작동하는 플랫폼에 제한됩니다. 따라서 일부 플랫폼에서는 사용할 수 없을 수 있습니다.

## Docker Compose와 일반적인 Docker 사용의 차이

Docker Compose는 여러 개의 컨테이너를 일괄적으로 관리하기 위한 기능을 제공합니다.

반면, 일반적인 Docker 사용에서는 개별 컨테이너에 대해 개별적으로 작업해야 합니다.

또한, 일반적인 Docker에서는 컨테이너 간 네트워크 및 볼륨 설정을 수동으로 해야 하지만, Docker Compose는 YAML 파일을 통해 이러한 설정을 자동으로 관리합니다.

Docker Compose는 여러 개의 관련된 컨테이너로 구성된 애플리케이션을 효율적으로 구축하고 배포할 때 유용합니다.

Docker Compose를 사용하면 애플리케이션 관리가 용이해지며, 개발자 간에 환경 구축을 쉽게 공유할 수 있습니다.

다만, Docker Compose를 사용할 때는 Docker 및 Docker Compose의 개념과 작업 방법을 익히는 것이 필요합니다.

## **Docker Compose의 베스트 프랙티스**

Docker Compose를 효과적으로 활용하기 위한 몇 가지 베스트 프랙티스를 소개하겠습니다.

### **환경 변수 관리를 위한 .env 파일 사용**

환경 설정을 환경 변수로 다루면 설정 변경이 용이해집니다.

`.env` 파일을 사용하여 환경 변수를 정의하고, `docker-compose.yml` 파일 내에서 참조할 수 있습니다.

### **마이크로서비스 아키텍처 채택**

Docker Compose는 마이크로서비스 아키텍처를 채택할 때 특히 효과적입니다.

각 마이크로서비스를 독립된 컨테이너로 관리하고, 이를 `docker-compose.yml` 파일에서 정의함으로써 전체 애플리케이션 구성을 쉽게 관리할 수 있습니다.

### **데이터 지속성을 위한 볼륨 사용**

데이터베이스나 파일 스토리지와 같은 데이터를 지속성 있게 관리하기 위해 Docker 볼륨을 사용하는 것이 권장됩니다.

`docker-compose.yml` 파일 내에서 볼륨을 정의하고, 컨테이너와 연결하여 데이터를 지속시킬 수 있습니다.

### **네트워크 세그멘테이션**

애플리케이션 내의 컨테이너를 여러 네트워크로 분할하여 보안 및 성능을 향상시킬 수 있습니다.

`docker-compose.yml` 파일 내에서 네트워크를 정의하고, 각 컨테이너에 적절한 네트워크를 할당할 수 있습니다.

### **문서화와 버전 관리**

`docker-compose.yml` 파일이나 관련 설정 파일을 적절하게 문서화하고, 버전 관리 시스템(예: Git)으로 관리함으로써 팀 내에서 공유하거나 변경 이력을 추적하기 쉬워집니다.

이러한 베스트 프랙티스를 적용하여 Docker Compose를 효과적으로 활용하면 애플리케이션 구축, 배포, 운영을 효율적으로 수행할 수 있습니다.

Docker Compose는 여러 컨테이너가 관련된 애플리케이션을 효율적으로 구축, 배포, 운영하기 위한 도구입니다.

이러한 베스트 프랙티스를 적용하여 Docker Compose의 장점을 최대한 활용하면 개발자는 애플리케이션 개발 프로세스를 크게 개선하고 효율화할 수 있습니다.

지속적인 학습과 실습을 통해 Docker Compose의 기능을 더 깊게 이해하고 효과적인 개발 환경을 구축할 수 있습니다.

이렇게 Docker Compose를 활용하여 애플리케이션 개발의 생산성과 품질을 향상시킬 수 있습니다.

---

## Docker Compose를 사용하는 방법

요즘 다양한 회사에서 Docker를 사용하고 있으며, 아마도 많은 사람들이 어느 정도 사용하고 있을 것입니다.

그래서 업무 등에서 사용하는 명령어와 설명을 적어보려고 합니다.

### 애플리케이션 실행하기

기본적으로 Docker Compose를 사용하는 프로젝트에서 각 컨테이너를 실행하려면 먼저 docker-compose.yml 파일이 어디에 있는지 확인해야 합니다.

docker-compose.yml 파일의 위치를 확인한 후 해당 디렉토리로 이동하여 다음 명령으로 실행할 수 있습니다.

```bash
$ docker compose up -d
```

`-d` 옵션은 Detached 모드로, 백그라운드에서 컨테이너를 실행합니다.

이 옵션을 사용하지 않으면 로그가 지속적으로 표시됩니다.

### 애플리케이션 종료하기

애플리케이션의 각 컨테이너를 종료하려면 docker compose down을 사용합니다.

```bash
$ docker compose down
```

docker compose stop이라는 명령도 있지만, 여기서는 컨테이너를 삭제하지 않고 유지하는 명령입니다.

그러나 docker-compose.yml이 업데이트되는 경우에는 down이 더 좋습니다.

down의 경우 컨테이너를 종료하지만 이미지는 삭제하지 않습니다.

기본적으로 이미지가 삭제되지 않는 한 up `-d`를 실행할 때 빌드되지 않으므로 속도 등을 고려할 필요가 없습니다.

> 다만, ENTRYPOINT 내용이 시간이 오래 걸리는 경우 stop을 사용하는 것이 좋습니다. ENTRYPOINT는 컨테이너를 시작할 때마다 호출됩니다.

### 애플리케이션을 다시 시작하고 싶을 때

애플리케이션을 다시 시작하려면 `restart`라는 명령어를 사용할 수 있습니다.

```bash
$ docker compose restart
```

`restart` 명령은 마운트된 서버 설정 등은 업데이트되지만 컨테이너 자체는 업데이트되지 않습니다.

(Dockerfile이 업데이트되었다 하더라도 해당 변경사항은 반영되지 않습니다.)

컨테이너를 업데이트하려면 아래에서 설명하는 이미지 업데이트 방법을 참조하시기 바랍니다.

### 이미지가 업데이트되면

일부 회사에서는 전용 Docker 이미지를 사용하는 경우가 있습니다.

만약 Docker 이미지가 업데이트되면 다음 단계를 통해 새 이미지를 가져올 수 있습니다.

```bash
$ docker compose down
$ docker compose build --pull 서비스명
$ docker compose up -d
```

### 실행 중인 컨테이너에 접근하고 싶을 때

실행 중인 컨테이너에 접근하려면 `docker compose exec`를 사용합니다.

```bash
$ docker compose exec 서비스명 명령어
$ docker compose exec php-fpm /bin/bash
```

### 실행 중인 컨테이너의 로그를 확인하고 싶을 때

로그를 확인하려면 `docker compose logs`를 사용할 수 있습니다.

기본적으로 `--tail` 옵션을 사용하여 뒤에서부터 특정 줄 수만큼의 로그를 표시하고 확인하는 것이 일반적입니다.

로그를 확인하는 방법은 다양하며, 로그를 웹에서 확인할 수 있는 `dozzle`과 같은 애플리케이션도 있습니다.

```bash
docker compose logs --tail=5 필요하다면 서비스명
```

서비스명을 지정하지 않으면 `docker-compose.yml`에 정의된 모든 서비스의 로그가 표시됩니다.

### 컨테이너의 애플리케이션이 DB 등의 서비스에 연결해야 할 때

컨테이너 내의 애플리케이션이 DB 등의 서비스에 연결해야 하는 경우가 있을 것입니다.

IP를 직접 지정하는 방법도 있지만, 컨테이너가 다시 시작되면 IP가 변경되기 때문에 좋은 방법은 아닙니다.

이럴 때는 호스트 이름 부분에 서비스명을 작성하면 됩니다.

예를 들어 아래의 `docker-compose.yml` 예시에서는 호스트 이름 부분에 `mysql`이라는 문자열을 설정하여 접근할 수 있습니다.

> 과거에는 서비스에 대해 `links`라는 항목을 정의해야 했지만, 현재는 자동으로 접근할 수 있습니다.

## `docker-compose.yml`에 대해 더 자세히 알아보기

먼저, 샘플로 작성된 `docker-compose.yml` 파일을 살펴보겠습니다.

각 부분에 주석이 달려 있습니다.

```yaml
version: "3.9" # 사용할 docker-compose.yml 버전. 버전에 따라 작성 가능한 항목이 약간 다릅니다.
services: # 각 서비스 정의
  nginx: # 서비스 이름을 nginx로 정의하고, 이것이 컨테이너가 됩니다.
    image: nginx:alpine # 가져올 이미지. 도메인 이름이 없는 경우 Docker Hub의 이미지입니다. /도 없는 경우 Docker 공식 이미지입니다.
    volumes: # 공유 볼륨 설정
      - ./:/app # 호스트:컨테이너[:옵션] 순으로 작성합니다.
      - ./docker-assets/nginx/default.conf:/etc/nginx/conf.d/default.conf:cached
    ports: # 포트 포워딩 설정
      - "8080:80" # 호스트 측:컨테이너 측으로 작성합니다.
      
  php-fpm:
    build: ./docker-assets/php-fpm/ # build가 작성된 경우 로컬에 Dockerfile이 있습니다. 해당 위치에 Dockerfile이라는 파일이 있는지 확인해보세요.
    volumes:
      - ./:/app

  mysql:
    image: mysql:5.7 # : 뒤에 작성된 것은 가져올 태그입니다. 이미지에 태그가 지정되어 있습니다.
    environment: # 환경 변수. 기본적으로 빌드할 때 사용됩니다.
      MYSQL_DATABASE: ${DB_DATABASE} # ${이름}과 같이 작성한 경우 .env 파일을 찾아 해당 키의 값을 할당합니다.
      MYSQL_USER: user # 문자열 그대로 지정할 수도 있습니다.
      MYSQL_PASSWORD: ${DB_PASSWORD:-passtext} # .env에 작성되지 않은 경우 passtext라는 문자열이 설정됩니다.
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
    volumes:
      - db-data:/var/lib/mysql # 호스트 아래에 정의된 볼륨인 경우도 있습니다.
volumes: # 볼륨 정의. 컨테이너가 사라져도 유지해야 하는 데이터 등이 있는 경우 정의합니다.
  db-data: # db-data라는 로컬 볼륨을 정의하고 있습니다.
```

현재 주류 버전은 2.x 또는 3.x입니다. 주로 2.x를 사용해야 하는 경우는 volumes_from으로 작성된 경우입니다.

busybox 등에서 공유를 일괄적으로 작성하는 서비스가 있으면 3.x에서는 양쪽 서비스 모두 volumes를 지정해야 했습니다.

> 메이저 버전만(3 등)으로 작성하고 마이너 버전을 지정하지 않는 경우 3.0과 같이 .0 버전이 되므로 특정 버전 이후에 추가된 항목을 사용하려면 마이너 버전까지 지정해야 합니다.

또한 최근 버전에서는 이 version 작성이 필요하지 않아 반드시 버전이 작성되어 있는 것은 아닙니다.

기타 설정 가능한 항목에 대해서는 공식 문서를 참조하세요.

## 로컬 볼륨 삭제 방법

가끔 로컬 볼륨을 삭제해야 할 때가 있습니다.

이럴 때는 `-v` 옵션을 사용하세요.

```bash
$ docker compose rm -v 서비스명
```

서비스명을 지정하지 않으면 `docker-compose.yml`에 기록된 모든 서비스가 삭제됩니다.

또한, 기본적으로 로컬 볼륨은 `프로젝트명_볼륨명` 형식으로 생성됩니다. 따라서,

```bash
$ docker volume ls
```

를 통해 볼륨 목록을 확인하고,

```bash
$ docker volume rm 프로젝트명_볼륨명
```

를 통해 삭제할 수도 있습니다.

## 사용하지 않는 컨테이너 삭제 방법

중지된 컨테이너를 삭제하려면 다음과 같이 `-v` 옵션을 사용하세요.

```bash
$ docker container prune
```

## 사용하지 않는 볼륨 삭제 방법

`docker container ls` 명령으로 연결되지 않은 볼륨을 모두 삭제할 수 있습니다.

```bash
$ docker volume prune
```

## 사용하지 않는 이미지 삭제 방법

위에서 볼륨을 삭제하는 방법과 동일합니다.

```bash
$ docker image prune
```

## 삭제할 수 없는 네트워크 문제

가끔씩 `docker network`를 삭제할 수 없는 상황이 발생할 수 있습니다.

```bash
$ docker network rm 네트워크명
```

이럴 때는 해당 네트워크를 사용하는 컨테이너를 찾아서 중지시키는 것이 좋습니다.

```sh
$ docker network inspect 네트워크명
$ docker down 컨테이너명
```

---

## Docker Compose Sample 이해

```bash
version: "3.8"

services:
  db:
    image: mariadb:latest
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: mysql_root_paswsword
      MYSQL_PORT: 3306
    ports:
      - 3306:3306
    volumes:
      - ./mysql-data:/var/lib/mysql
  web:
    image: httpd:latest
    restart: always
    volumes:
      - ./webapp:/webapp
    ports:
      - "8080:80"
    depends_on:
      - db
```

### 설정 항목 확인

설정 항목은 들여쓰기를 사용하여 계층적으로 기술하며, volumes 및 ports와 같은 외부 연결 관련 항목은 "왼쪽(로컬) : 오른쪽(컨테이너)" 관계로 기술됩니다.

- **version** (첫 번째 계층)
    - `docker-compose.yml`의 버전을 선언합니다. 2021년 6월 11일 기준으로 최신 버전은 3.8입니다.

- **services** (첫 번째 계층)
    - 여기에서 서비스(컨테이너)를 기술합니다.

- **db** (두 번째 계층)
    - 서비스 이름인 "db"는 사용자가 자유롭게 지정할 수 있으며, 네트워크 연결 시 별칭으로도 사용됩니다.

- **image** (세 번째 계층)
    - Docker Hub 이미지를 사용하는 경우 이미지 이름을 지정합니다.

- **restart** (세 번째 계층)
    - `no`: 컨테이너를 다시 시작하지 않음 (기본값)
    - `always`: 컨테이너가 중지되면 항상 다시 시작됨 (Docker는 시작 및 중지를 반복하므로 이 경우 `always`를 지정합니다.)

- **environment** (세 번째 계층)
    - 컨테이너에 설정되는 환경 변수입니다. Docker Hub 이미지에 따라 설정 가능한 환경 변수가 다르므로 해당 이미지의 환경 변수 설명을 확인하는 것이 좋습니다.

- **ports** (세 번째 계층)
    - 외부와 포트 포워딩하여 연결할 수 있습니다. localhost:8080에 연결하면 컨테이너의 80 포트로 포워딩됩니다.

- **volumes** (세 번째 계층)
    - 컨테이너에 마운트할 디렉토리를 지정합니다. 컨테이너를 중지하면 정보가 손실되므로 지속성 및 파일 조작을 위해 사용됩니다.

- **depends_on** (세 번째 계층)
    - 컨테이너의 시작 순서를 지정합니다. 여기에 기술한 서비스가 먼저 시작됩니다.


### 네트워크에 대한 고려 사항

`docker-compose.yml`에 기술된 컨테이너는 로컬 네트워크에 연결되어 상호 통신이 가능합니다.

이 때 서비스 이름을 사용하여 연결할 수 있습니다.

IP 주소가 아닌 서비스 이름으로 연결하면 재사용이 용이하므로 추천드립니다.

## 마무리

이번에는 최소한의 설정 방법에 대해 정리한 내용이었습니다.

Docker 환경 설정에는 Dockerfile과 docker-compose가 있으며, 어떤 이미지를 사용해야 하는지 결정하기도 어려운 경우가 많습니다.

특히 네트워크 설정은 고민거리일 수 있습니다.

LAMP 구성이나 WORDPRESS와 같은 좋은 느낌의 `docker-compose.yml`을 한 번 만들어두면 사용자 정의하여 활용할 수 있으므로, 최소한의 항목으로 작동하는 상태에서 추가해 나가는 것이 좋습니다.

이상이 "docker-compose.yml의 작성 방법 정리"였습니다.

