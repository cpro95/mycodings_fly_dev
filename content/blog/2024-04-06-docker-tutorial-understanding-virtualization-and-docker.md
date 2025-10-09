---
slug: 2024-04-06-docker-tutorial-understanding-virtualization-and-docker
title: Docker 강좌 1편. 가상화와 Docker 기초 개념 이해하기
date: 2024-04-06 04:23:41.914000+00:00
summary: 가상화와 Docker의 기본 개념 이해하기
tags: ["docker"]
contributors: []
draft: false
---

안녕하세요?

새롭게 Docker 강좌를 시작해 볼까 합니다.

전체적인 강좌 리스트입니다.

1. [Docker 강좌 1편. 가상화와 Docker 기초 개념 이해하기](https://mycodings.fly.dev/blog/2024-04-06-docker-tutorial-understanding-virtualization-and-docker)

2. [Docker 강좌 2편. 실무에서 쓰이는 Docker 컨테이너 완벽 가이드](https://mycodings.fly.dev/blog/2024-04-06-docker-tutorial-docker-container-comprehensive-guide)

3. [Docker 강좌 3편. Docker 이미지 및 Dockerfile 기초](https://mycodings.fly.dev/blog/2024-04-06-docker-tutorial-understanding-docker-image-and-dockerfile)

4. [Docker 강좌 4편. Docker 볼륨 (Volume) 사용 방법과 원리](https://mycodings.fly.dev/blog/2024-04-06-docker-volume-usage-and-principles)

5. [Docker 강좌 5편. Docker 바인드 마운트와 포트 publish](https://mycodings.fly.dev/blog/2024-04-06-docker-tutorial-understanding-bind-mount-and-port-publish)

6. [Docker 강좌 6편. Docker Compose 완벽 가이드](https://mycodings.fly.dev/blog/2024-04-06-docker-tutorial-docker-compose-complete-guide)

---

** 목 차 **

- [1. 가상화](#1-가상화)
  - [**서버 가상화란?**](#서버-가상화란)
  - [**호스트형 가상화**](#호스트형-가상화)
  - [**하이퍼바이저형 가상화**](#하이퍼바이저형-가상화)
  - [**컨테이너형 가상화**](#컨테이너형-가상화)
  - [**컨테이너형 가상화의 특징**](#컨테이너형-가상화의-특징)
    - [**장점**](#장점)
      - [**빠른 구동**](#빠른-구동)
      - [**컨테이너형 가상화의 배포 용이성**](#컨테이너형-가상화의-배포-용이성)
    - [**주의사항**](#주의사항)
      - [**컨테이너에 OS는 포함되어 있지 않지만, 있는 것처럼 보임**](#컨테이너에-os는-포함되어-있지-않지만-있는-것처럼-보임)
      - [**컨테이너의 커널은 호스트 기계의 Linux 커널입니다**](#컨테이너의-커널은-호스트-기계의-linux-커널입니다)
      - [**호스트 OS의 차이가 컨테이너에 영향을 줍니다**](#호스트-os의-차이가-컨테이너에-영향을-줍니다)
  - [요약](#요약)
- [2. Docker](#2-docker)
  - [Docker란?](#docker란)
  - [Docker Engine이란?](#docker-engine이란)
  - [Docker CLI란?](#docker-cli란)
  - [Docker Desktop이란?](#docker-desktop이란)
  - [설치와 계정 관련](#설치와-계정-관련)
  - [Docker Compose란?](#docker-compose란)
  - [Docker Hub란?](#docker-hub란)
  - [ECS / GKE란?](#ecs--gke란)
  - [ECR / GCR이란?](#ecr--gcr이란)
  - [Kubernetes란?](#kubernetes란)
  - [Docker Desktop 유료화에 대하여](#docker-desktop-유료화에-대하여)
  - [요약](#요약-1)
- [Docker 기본 개념](#docker-기본-개념)
  - [기본 요소는 3가지입니다.](#기본-요소는-3가지입니다)
    - [컨테이너란?](#컨테이너란)
    - [**이미지란?**](#이미지란)
    - [**Dockerfile이란?**](#dockerfile이란)
  - [**기본 명령어 3가지**](#기본-명령어-3가지)
    - [**컨테이너 실행하기**](#컨테이너-실행하기)
    - [**이미지 생성하기**](#이미지-생성하기)
    - [**컨테이너 조작하기**](#컨테이너-조작하기)
  - [**명령어의 형태를 의식하기**](#명령어의-형태를-의식하기)
    - ["무엇"을 "어떻게" 하는지](#무엇을-어떻게-하는지)
  - [**새로운 명령어와 이전 명령어에 대해**](#새로운-명령어와-이전-명령어에-대해)
  - [**Docker와 주변 도구 구분하기**](#docker와-주변-도구-구분하기)
    - [1. **Docker Compose**](#1-docker-compose)
    - [2. **Kubernetes**](#2-kubernetes)

---

# 1. 가상화

## **서버 가상화란?**

서버 가상화는 컴퓨터 리소스를 관리하기 위한 다양한 기술을 말합니다.

예를 들어, 하나의 서버 안에 네트워크나 스토리지를 가상으로 준비하여, 여러 개의 다른 서버가 동작하는 것처럼 보이게 하는 기술입니다.

서버 가상화는 물리적인 서버와 소프트웨어 사이에 가상화 소프트웨어를 끼워 넣음으로써 실현됩니다.

가상화 소프트웨어를 어디에 설치할지, 가상화 소프트웨어가 무엇을 관리할지에 따라 몇 가지 패턴으로 분류됩니다.

- 호스트형 가상화
- 하이퍼바이저형 가상화
- 컨테이너형 가상화

간단히 각각에 대해 설명하겠습니다.

## **호스트형 가상화**

호스트형 가상화를 실현하는 가상화 소프트웨어는 호스트 OS에 설치되며, 게스트 OS를 관리합니다.

다음 그램에서 노란색 박스가 바로 '가상 서버'입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhwDzr1tMafzHFtUbpK9xVUWI3TRyC6PpptpmLS31yrCUFxt6a5PTH3Mt72C3J2D2ViAL7NjmNuVJeydP9FzFR_Hvnzer4_0NW9InZWLSlRy18SojvuYMwa7NDMkXVwBy5Qve796RbFUn6ZOy6-SmTim9NK7BdjYN8pTaQpbZ-gBT-WJ7-qkSLEmlgjMyg)

호스트형 가상화에는 다음과 같은 특징이 있습니다.

- 이미 사용 중인 기계에 가상 서버를 구축하는 경우 등에 유용
- 호스트 OS가 있기 때문에 브라우저나 에디터도 평소처럼 계속 사용할 수 있음

호스트형 가상화를 실현하는 가상화 소프트웨어의 대표적인 예로는 Oracle VM VirtualBox나 VMware Fusion 등이 있습니다.

## **하이퍼바이저형 가상화**

하이퍼바이저형 가상화를 구현하는 가상화 소프트웨어는 일반적으로 하드웨어에 설치되어 게스트 OS를 관리합니다.

호스트형 가상화와 마찬가지로, 다음 그림의 박스 친 부분이 바로 '가상 서버'입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgG4Drg-NQVpsqdqcgNWZ3PZLsuGH5PPlHU_lcsl_Ov7AQBaFhLOGiuV3zbhLqN0kJ25cha1f4Q4JUg_RCtgP1w77tAvlD29nenticYdSGiCT-oHCML67BevoMDXEgE1L88KpgeJrFvDBUcDk47sh3vvPmcJslBvUdbNhWc7vWdyIV-tTRugT0GFExDh70)

하이퍼바이저형 가상화의 특징은 다음과 같습니다:
- 호스트 OS의 부팅을 기다리거나 리소스를 할당할 필요가 없습니다
- 게스트 OS 이외는 작동하지 않습니다
- 하이퍼바이저형 가상화를 구현하는 가상화 소프트웨어의 대표적인 예로는 Windows의 Hyper-V나 Linux의 KVM 등이 있습니다.
- Microsoft Hyper-V 등에서 연상할 수 있듯이, 호스트 OS 위에서 하이퍼바이저형 가상화 소프트웨어를 작동시킬 수도 있습니다.

## **컨테이너형 가상화**

컨테이너형 가상화를 구현하는 가상화 소프트웨어는 호스트 OS에 설치되어 애플리케이션을 관리합니다.

다음 그림이 바로 '컨테이너'입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiVP2rywaYyqmxoBlPjgmxVAVaKrYREhMcygpuRCZqGH1oBMFpY8-lH0bTqb21VFKvueimEIT6h5tmqkJ0PkEfMMNLKOj_n9GRyhfFBWNlPvCplb9e4X8OHn1U91idcSjLYJFu8HC2hfDyUx-8soBECwfho5-pKKzAutUKzVgY4641XSDsxh-GaviheQiA)

컨테이너형 가상화의 특징은 다음과 같습니다:
- 게스트 OS가 존재하지 않아, 부팅의 비용이 크게 줄어듭니다
- 서버가 아니기 때문에, 하나의 컨테이너에 여러 애플리케이션을 설치하지 않습니다
- 호스트 OS가 있기 때문에 브라우저나 에디터도 평소처럼 계속 사용할 수 있습니다
- 컨테이너형 가상화를 구현하는 가상화 소프트웨어의 대표적인 예로는 Docker 등이 있습니다.

## **컨테이너형 가상화의 특징**

호스트형 가상화와 하이퍼바이저형 가상화를 비교하면서 컨테이너형 가상화의 특징을 살펴보겠습니다.

### **장점**

#### **빠른 구동**

가장 크게 체감할 수 있는 특징 중 하나는 게스트 OS의 구동이 필요 없기 때문에 앱 구동이 압도적으로 빠르다는 점입니다.

서버 전체가 아닌 각 애플리케이션별로 구동할 수 있다는 점도 앱 구동이 빨라지는 이유 중 하나입니다.

다음 그림에서 'App A'를 실행하기 위해 앱 구동 시간을 비교해보면 얼마나 가벼운지 상상할 수 있습니다.

매우 단순하게 말하자면 가상 OS의 PC 재시작 대비 'App A' 실행 정도의 차이가 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhFytgTYNWluuiYPRHC4zTKJsFgSK4ocKCYRLBf2iKhcJYmwHTmavoWG_HRt5lPSJ0Mk2n7bGHrPXDRGT039zv7UBza2deHOjs7tz_LyNGahYxpL8zPkXKrCF74BQABrOC2hThGa1o2eX5vtMnHzJugXqbyx3DFqzR-Cz5FlzWydek-tMBFIRVXPQJoSfM)

이러한 이유로 컨테이너 구축의 시행착오가 쉬워지고, 컨테이너를 쉽게 중지하거나 시작할 수 있습니다.

이러한 편리함을 활용하여 '테스트를 실행하는 컨테이너를 준비해두고, 테스트 중에만 시작하여 몇 분 만에 폐기하는' 작은 사이클에 통합할 수 있습니다.

#### **컨테이너형 가상화의 배포 용이성**

호스트형 가상화로 로컬 개발을 하고 있고, 배포 대상 서버에서 하이퍼바이저형 가상화가 이루어지고 있다면, 로컬에서 시작하는 것과 서버에 배포하는 것이 일치하기 때문에 배포는 어느 정도 간단합니다.

그러나 대부분의 경우, 배포 대상 서버는 가상화되어 있지 않고 로컬에서만 가상화를 진행하는 형태가 많을 것입니다.

가상화가 로컬에서만 이루어져도, 개발자의 환경을 통일하기 쉬운 등의 장점이 충분히 있기 때문에, 이 자체는 문제가 되지 않습니다.

그러나 이 경우 로컬에서 시작하는 것과 서버에 배포하는 것이 달라지는 문제가 발생합니다.

예를 들어 '메일(mail) 서버가 독립 시스템으로 운영되고 있으므로 실제 환경에서는 해당 서버로 연결한다'는 구성을 상상하기 쉽습니다.

이러한 차이는 '배포 대상의 PHP 버전이(설정이) 달라서'라는 위험과 '.php만 배포하는 시스템을 만들어야 한다'는 비용으로 이어집니다.

컨테이너형 가상화라면 로컬에서 시작하는 것과 서버에 배포하는 것이 일치하기 때문에 쉽게 배포할 수 있습니다.

물론 배포 대상이 컨테이너형 가상화가 되어 있지 않다면 같은 문제가 발생하지만, 최근에는 다음과 같은 이미지 레지스트리나 관리되는 컨테이너의 배포 대상이 있기 때문에, 실제 운영도 로컬 개발도 컨테이너형 가상화를 전제로 구축하는 것이 많아지고 있습니다.

- **이미지 레지스트리**
  - Docker Hub
  - Amazon Elastic Container Registry (ECR)
  - Google Container Registry (GCR)
- **컨테이너의 배포 대상**
  - Amazon Elastic Container Service (ECS)
  - Google Kubernetes Engine (GKE)
  - (이에 대해서는 '1부: Docker란?'에서 간단히 설명합니다)

결과적으로는 호스트형 가상화에서 예로 든 로컬 개발과 실제 운영의 격차는 느껴지기 어렵다고 할 수 있습니다.

배포 대상이 컨테이너형 가상화가 아닌 경우는 차이가 발생하지만, 가상 서버가 아니므로 컨테이너는 작다는 장점은 남아 있습니다.

호스트형 가상화에서 게스트 OS를 시작하면, 모든 기능이 같은 Ubuntu에 탑재되어 있어 설정 파일 등이 혼합되기 쉽습니다.

이 경우 PHP만을 배포하려고 할 때 '어떤 설정 파일이 있는데, 이게 PHP용인가요? 메일 시스템용인가요?' '어, 서버 안의 그런 곳에도 설정 파일이 있었다는 걸 몰랐어요...'와 같은 상황을 초래합니다.

반면에 컨테이너형 가상화는 기능별로 컨테이너를 시작하기 때문에, 메일 시스템용 설정이 PHP 컨테이너에 혼입되는 일은 없습니다.

### **주의사항**

#### **컨테이너에 OS는 포함되어 있지 않지만, 있는 것처럼 보임**

컨테이너형 가상화는 게스트 OS를 시작하지 않지만, Docker에 의해 마치 Linux가 시작된 것처럼 보입니다.

따라서 컨테이너 내에서는 평범하게 /etc와 같은 디렉토리가 있거나 ls나 cd 명령어를 사용할 수 있습니다.

실제 사용감은 Ubuntu나 CentOS 등을 조작하는 것과 크게 다르지 않을 것입니다.

가상 서버만큼 완전한 분리나 에뮬레이트는 이루어지지 않습니다.

#### **컨테이너의 커널은 호스트 기계의 Linux 커널입니다**

Ubuntu나 CentOS처럼 보이지만 실제로 OS가 시작되지 않기 때문에, 컨테이너의 커널은 호스트 기계의 Linux 커널이 됩니다.

이는 가상 서버처럼 하드웨어를 에뮬레이트하지 않으며, 호스트 OS(또는 그 위의 Linux)와의 분리도가 낮다는 점에 주의가 필요합니다.

또한, Docker 컨테이너는 Linux의 커널과 기능을 사용하여 작동하기 때문에, 컨테이너의 OS도 필연적으로 Linux로 제한됩니다.

예를 들어, Ubuntu 컨테이너와 Windows Server 컨테이너는 공존할 수 없습니다.

#### **호스트 OS의 차이가 컨테이너에 영향을 줍니다**

컨테이너에는 게스트 OS가 포함되어 있지 않고 호스트 기계 위의 Linux 커널을 사용하기 때문에, 호스트 OS의 차이가 컨테이너에 영향을 줄 수 있습니다.

예를 들어, 최근 M1 Mac에서 Docker가 작동하지 않는 문제가 종종 보고되는데, 이는 호스트 기계의 Linux 커널 차이 때문입니다.

Linux 커널은 호스트 OS와 동일한 것을 설치하게 되므로, 결과적으로 호스트 OS가 다르면 시작하는 컨테이너도 다를 수 있습니다.

**컨테이너는 가상화 기술이지만, 호스트 OS의 영향을 완전히 받지 않는 것은 아닙니다**

컨테이너는 가상화 기술이지만, 호스트 OS의 영향을 완전히 받지 않는 것은 아니므로 이 점을 기억해야 합니다.

## 요약

길어진 설명을 간단히 요약하겠습니다.

호스트 기반 가상화는 호스트 OS에 설치되어 게스트 OS를 관리합니다.

하이퍼바이저 기반 가상화는 하드웨어에 설치되어 게스트 OS를 관리합니다.

컨테이너 기반 가상화는 호스트 OS에 설치되어 애플리케이션을 관리합니다.

컨테이너 기반 가상화의 장점은 다음과 같습니다:
- 부팅이 빠릅니다.
- 배포가 쉽습니다.

컨테이너 기반 가상화의 주의점은 다음과 같습니다:
- 다른 방법들보다 완전히 분리되어 있지 않습니다.
- 호스트 OS의 차이가 컨테이너에 영향을 줍니다.

---


# 2. Docker

![](https://blogger.googleusercontent.com/img/a/AVvXsEhpyZHekG_f2VujwTl_RXN16V-01JQdANFKj9LTVj4AO-xMK8N0gt8aY5PpW637z7eoUPotJCcz8pI6GHTsJajAoAoVvhQqPTtYPYwOHr1v8pfTDahGQ_MNGRBL_1DhcN8cGr1IyYU4-Gp16QSHkH-QidW34HVFpfzUMN2LiXwld5GfkSb39LpmiK-SQT0)

가상화 기술에 대해 공부했으므로, 이 페이지에서는 그 중 하나인 Docker에 대해 배워보겠습니다.

이 페이지에서는 Docker Engine, Docker Desktop 등 Docker Xxx 라는 명칭의 것들을 정리하겠습니다.

Docker 초보자 분들은 갑자기 Docker 관련 용어가 나와서 조금 힘들 수도 있겠지만, 앞으로 나올 주요 Docker Engine을 올바르게 이해하기 위해 노력해 보시기 바랍니다.

Docker에 대해 조사해보면 자주 듣게 되는 "컨테이너", "이미지", "Dockerfile"에 대해서는 다음에 계속 설명하도록 하겠습니다.

## Docker란?

Docker는 컨테이너 기반 가상화를 사용하여 애플리케이션의 개발과 배포를 수행하는 Docker 사의 개발 플랫폼입니다.

2013년 릴리스 당시 "Docker"는 단일 애플리케이션을 지칭하는 용어였던 것 같지만, 표준화와 발전에 따라 다양한 구성 요소를 포함하게 되었고, 현재는 "Docker"가 플랫폼을 의미하는 것으로 여겨집니다.

"Docker"라는 단어가 무엇을 지칭하는지는 꽤 애매모호한 편이지만, 이 글에서는 플랫폼을 의미하는 것으로 사용하겠습니다.

이 페이지에서는 이 플랫폼에 포함된 Docker Xxx 라는 이름의 요소들에 대해 핵심 사항만 간단히 정리하겠습니다.

- Docker Engine
- Docker CLI
- Docker Desktop
- Docker Compose
- Do cker Hub

그리고 다음 요소들은 이 글에서 다루지 않으므로, 여기서 간단히 언급하고 지금은 학습 범위에 포함되지 않음을 표시해두겠습니다.

- ECS / GKE
- ECR / GCR
- Kubernetes

## Docker Engine이란?

![](https://blogger.googleusercontent.com/img/a/AVvXsEjouW_KwzGht3tR7LylB0KvPCtmwQaoIJfDQObHVOq-pp7N7icqru7HuzoDJIltpv5lZKC5EThmXzvyZx4nxJ1P7tCp3aaFx2BAyYj3_JIu9Ggy1D15191C-tSCoATAyTdEO0mUrtSq4QdFZ2B4qk1ft3JugCcaroAA9qHq67XAJtg5LushQ9cVdB_KoDA)

Docker Engine은 앞에서 설명한 "가상화"에서 소개한 컨테이너 기반 가상화 소프트웨어의 부분입니다.

이를 통해 애플리케이션을 컨테이너로 다룰 수 있게 됩니다.

Docker 컨테이너는 리눅스 커널과 기능을 사용하여 동작하기 때문에, Docker Engine은 리눅스에서만 동작합니다.

요약하자면 컨테이너를 올리는 부분이며, 리눅스에서 동작하는 소프트웨어입니다.

## Docker CLI란?

![](https://blogger.googleusercontent.com/img/a/AVvXsEhyq89hfJa7tt1SkepQ5Y43-moAIZ7zWyUFAr6j-s9g8qO3RQyDdvh4Ft120U-76-sND1WFpKg-oxHuH_E_zJ1Se1a5sW7FU_KeQFMtOjHEA3aoXZrKopFMbiE4ZueRZ5SJpQyTsJoVcUtth0B9pnGFK8VVaFLQpU17la8D73y6QEOWlBVl5B7C93ZjHd0)

Docker Engine에 제공되는 것으로, docker run, docker build와 같은 docker로 시작하는 명령어로 Docker에 명령할 수 있습니다.

요약하자면 명령어를 다루는 것이며, 평소에 가장 많이 보고 상상하기 쉬운 부분일 것입니다.

## Docker Desktop이란?

![](https://blogger.googleusercontent.com/img/a/AVvXsEiRDIqIA98xMfxH2GYr-K-lsELlVQOqf710ilVMyI5pZDg6WKEJelrTe4zPDY_3SlcbVTOuj-n2IE4pmcRqjYL-BPz4tmQJxa_Rb03YY6LhOmX3TxsHJQ4IU65UjjqAXMuxtkcyf7MZmt3ktqg_CereVdsYws5HBPsEjf0UxhKk3Skgm-foTsitEdy7cDU)

Docker Desktop은 Windows나 Mac에서 Docker를 사용하기 위한 GUI 애플리케이션입니다.

Docker CLI 대신 GUI로 컨테이너 등을 확인하거나 중지할 수 있습니다.

Docker Desktop에는 Docker Engine과 리눅스 커널이 포함되어 있어, 리눅스 이외의 OS에서도 Docker Engine을 동작시킬 수 있게 됩니다.

일반적으로 "Windows나 Mac에 호스트 머신에 Docker를 설치한다"는 것은 "Docker Desktop 애플리케이션을 설치한다"는 뜻이 될 것입니다.

요약하자면 Windows나 Mac에서 Docker를 사용하고자 할 때 설치하는 Docker 일체가 포함된 GUI 애플리케이션입니다.

Docker Desktop에는 Docker Compose와 Kubernetes도 포함되어 있습니다.

## 설치와 계정 관련

Docker Desktop은 문서 사이트를 읽다 보면 Docker Hub에서 다운로드할 수 있습니다.

문서에는 "Docker for Windows"나 "Docker for Mac"이라고 되어 있지만, 이는 모두 Docker Desktop을 의미하니 안심하셔도 됩니다.

이후 이 글에서는 Docker Desktop이 설치되어 있다고 가정하고 진행하겠습니다.

Docker Desktop에는 Docker ID를 사용하여 Sign in 할 수 있지만, 계정을 만들지 않아도 충분히 활용할 수 있습니다.

Sign in 하는 이점에 대해서는 다운로드 속도 제한 등을 참고해 보시기 바랍니다.

## Docker Compose란?

![](https://blogger.googleusercontent.com/img/a/AVvXsEhxuEO7U_rx4jaVYb1vOrZ8kxurgkuFRM50UWSN07VxOCX-EpC_BmrYnlWbSHU_N93APGIarYcpSOpEVn8jBxebHi8qPjzoQPvNoEQP3rllKHu4Qj74LgdXjWDB9y2m-wfTDp4pe8Dhi94yt6X3ePtUtXONb9d-skAuuHjGP_jz689aAtr7w93eR4dMoVY)

Docker Compose는 Docker CLI를 일괄 실행해주는 편리한 도구로, docker compose up과 같은 docker compose로 시작하는 명령어를 제공합니다.

"2개의 컨테이너를 시작하고" "각각의 네트워크를 구축하고" "컨테이너의 데이터를 호스트 머신과 공유하는" 등의 복잡한 명령어를 YAML 파일을 작성함으로써 실현할 수 있는 도구입니다.

요약하자면 docker 명령어를 일괄 실행해주는 것과 같은 것입니다.

Docker Compose를 도입하면 극히 간단하게 동일한 구성을 재현할 수 있게 됩니다.

이 글에서는 계속해서 Docker CLI로만 구축한 환경을 Docker Compose로 대체해 보는 경험까지 해볼 수 있는데요, 
아마 그 편리함에 놀랄 것입니다.

## Docker Hub란?

![](https://blogger.googleusercontent.com/img/a/AVvXsEiH-0e8DoO3cnFp-oBtKhyzP1dvz9JSJjyv3AxI8AvLycxN718KegMWOiOXQxR6-SLtGS66yBoPXxxcS6xyCXsW6ai_MGAgf5_MqS4ZKXxNpiYLk96IzdNfAV-LmA11QMAGF_HsAQqUSL1OQFSk_Y-kTmcZCORV0Bn4F9RElV5GDSDy7-hM9nlmzaDzzsw)

Docker Hub는 Docker의 이미지 레지스트리인 SaaS 서비스입니다.

공개된 이미지를 git pull하거나, 구축한 이미지를 git push할 수 있는 곳으로 이해하시면 됩니다.

요약하자면 이미지의 GitHub과 같은 것입니다.

Docker Hub에서 이미지를 가져오는 데에는 계정이나 로그인이 필요하지 않습니다.

## ECS / GKE란?

Amazon Elastic Container Service(ECS)와 Google Kubernetes Engine(GKE)는 컨테이너 관리 서비스입니다.

요약하자면 Docker Engine이 들어간 리눅스로, 로컬 개발에 사용한 컨테이너를 그대로 배포할 수 있는 장소입니다.

로컬 개발 환경 구축에 한정한다면 필요 없으므로, 이 글에서는 이러한 컨테이너 관리 서비스는 사용하지 않습니다.

## ECR / GCR이란?

Amazon Elastic Container Registry(ECR)와 Google Container Registry(GCR)는 비공개 이미지의 레지스트리입니다.

요약하자면 프라이빗 Docker Hub와 같은 것이며, "상용 서비스의 이미지를 Docker Hub에 공개하고 싶지 않지만, 레지스트리에 등록하지 않으면 배포할 수 없다"와 같은 경우에 사용하게 됩니다.

로컬 개발 환경 구축에 한정한다면 GitHub과 Dockerfile로 충분하므로, 이 글에서는 이러한 비공개 레지스트리는 사용하지 않습니다.

## Kubernetes란?

![](https://blogger.googleusercontent.com/img/a/AVvXsEixmiMNC5QgK6r5OYExSUI3nk60qn7_uhNfQxb9869pSP0DSJK7Kdczq0wGoMzvPp3hpBdz1hRsj3wGeYqtQxgGQ-aO1web7ebR_SDIZlpg_lS4fHAwmSMfgvBzghMTw1oqMb6gC7z-UIhYOllxI0N45q8HjlX5_-wySX-BBIxdivm3SGRxIrke3PzH65k)

Kubernetes(약자로 k8s라고도 함)는 다수의 컨테이너를 관리하는 오케스트레이션 소프트웨어로, kubectl apply와 같은 kubectl로 시작하는 명령어를 제공해 줍니다.

오케스트레이션을 통해 로드밸런서 생성, 접속 집중 시 확장 등을 쉽게 실현할 수 있게 됩니다.

요약하자면 컨테이너를 운영하기 위한 도구입니다.

Kubernetes도 Docker Desktop에 포함되어 있지만, 개발 환경 구축에 여기까지 필요하게 되는 경우는 거의 없으므로, 이 글에서는 Kubernetes는 사용하지 않습니다.

참고로 오케스트레이션 도구는 docker 명령어가 아니라 dockerd나 containerd를 직접 사용합니다.

## Docker Desktop 유료화에 대하여

2021/08/31에 Docker 사가 Docker Desktop의 유료화를 발표했습니다.

간단히 말하면 내용은 다음과 같습니다.

- Docker Desktop은 다음의 경우를 제외하고 유료화한다.
  - 스몰 비즈니스(직원 250명 미만, 연 매출 1000만 달러 미만)
  - 개인 사용, 교육 사용, 비상업적 사용
  - 오픈 소스
- 새로운 이용 약관은 2021/08/31(발표일)부터 유효하다.
- 2022/01/31까지는 유예 기간을 제공한다.
- Docker Engine이나 Docker CLI 등의 기능은 변함없다.
- 유료 플랜에서는 새로운 기능을 제공할 예정이다.
  - 예) Docker Hub에서 프라이빗 리포지토리 생성
  - 예) 이미지 취약점 스캔 기능
  - 예) Docker Hub에서 팀, 역할 생성, 감사 로그 수집 등

유료 플랜에 대응할 경우 Docker ID를 사용하여 Docker Hub에 로그인하면 됩니다.

대규모 기업이지만 유료 플랜에 계약하지 않는 경우 "Podman과 같은 Docker 호환 가능한 컨테이너 가상화 소프트웨어 사용" 또는 "WSL이나 Lima와 같은 가상 Linux를 실행하여 Docker Desktop 없이 Docker Engine을 직접 사용"과 같은 대응이 필요할 것 같습니다.

어쨌든 유료화 대상은 Docker Desktop 사용 대기업일 뿐, Docker 전체를 사용할 수 없게 되는 것은 아니므로 여전히 Docker를 공부할 가치가 있습니다.

## 요약

글이 조금 길어져 버렸는데 간단히 요약하겠습니다.

- Docker Engine은 컨테이너를 탑재하는 소프트웨어
- Docker CLI는 컨테이너 등을 조작하는 명령어
- Docker Desktop은 리눅스 커널과 Docker 일체가 포함된 GUI 애플리케이션
- Docker Compose는 명령어를 일괄 실행해주는 도구
- Docker Hub는 이미지 레지스트리의 SaaS 서비스
- ECS / GKE는 Docker Engine이 들어간 컨테이너 관리 서비스
- ECR / GCR은 비공개 이미지 레지스트리
- Kubernetes는 실행 중인 컨테이너를 관리해주는 소프트웨어

참고 
1. Windows에서 Hyper-V를 사용할 수 없는 경우 VirtualBox를 사용하여 Docker를 실행하는 Docker Toolbox라는 것도 있지만, 여기서는 다루지 않습니다.

2. Linux나 Windows의 WSL에서는 Linux 커널을 별도로 설치할 필요가 없기 때문에, 일반적으로 Docker Desktop을 사용하지 않습니다.

---

# Docker 기본 개념

Docker에 대해 자세히 들어가기 전에, Docker를 올바르게 이해하고 결과적으로 빨리 습득하기 위해 매우 중요한 포인트 4가지를 먼저 확인하겠습니다.


- 기본 요소는 3가지입니다.
- 기본 명령어도 3가지입니다.
- 명령어 형식을 인식합니다.
- Docker와 주변 도구를 구분합니다.

Docker를 명령어 목록이나 옵션 목록에서 이해하려고 해도, 단순히 지식을 모으는 것만으로는 기본을 제대로 이해하고 활용할 수 없습니다.

단순히 많은 명령어를 따라 실행하고 "흐음...??"이 되는 것보다는, 먼저 조금의 시간을 내어 기본을 탄탄히 이해하는 것이 더 중요합니다.

## 기본 요소는 3가지입니다.

개발 환경을 Docker로 구축할 때, 실제로 필요한 요소는 그리 많지 않습니다.

이 글에서는 다음 3가지를 기본 요소로 간주합니다.

- 컨테이너
- 이미지
- Dockerfile

이 글의 후반부에서는 컨테이너 데이터를 호스트 머신과 공유하기 위해 볼륨을 생성하거나, 컨테이너간 통신을 위해 네트워크를 생성하는 등의 작업을 합니다만, 이러한 요소들은 기본 요소를 보충하는 것으로 간주될 수 있습니다.

따라서 먼저 이 3가지의 기본 요소를 하나씩 이해해 보겠습니다.

### 컨테이너란?

컨테이너는 특정 명령을 실행하기 위해 호스트 머신 상에서 격리된 영역입니다.

컨테이너는 호스트 머신에서 실행 중인 가상 OS처럼 느껴질 수 있지만, 컨테이너의 본질은 Linux의 Namespace라는 기능에 의해 다른 것들과 분리된 단순한 프로세스일 뿐입니다.

Linux의 Namespace는 이미 20년 가까이 된 기술이며, Docker는 이를 컨테이너나 이미지 같은 개념을 사용하여 쉽게 다룰 수 있도록 만든 기술입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiHoDOa5Aoef-zLjv9QHTCdGrIFhHN3Hau7chMjzII9ocORkAZrIAeYWohQGalaWsvXJjHlhb76fPJDZp5yODSVzXHvIrV3LqbiBDaHkrYB2W7cE0ENup8hRPO3VEuyg1yCVyaINacw5KocPDqSkkdcJ1gHeAFuTulEaX1h08SiaCIbKn1VmXx0ywA1dR8)

호스트 머신 및 각 컨테이너에는 프로세스 ID 1과 /etc/hosts 등의 파일이 중복되어 있지만, Namespace에 의해 격리된 영역을 매핑하여 충돌을 피하고 있습니다.

이 Namespace를 이미지로부터 생성하여 서로 다른 OS처럼 보이도록 하거나, Namespace를 쉽게 생성하거나 삭제할 수 있는 명령을 제공하는 것이 Docker입니다.

이를 고려하면 이 글의 초반부인 "가상화"에서 설명한 것처럼 "컨테이너 형 가상화에는 OS가 포함되어 있지 않고, 호스트 머신의 커널을 사용한다"는 것이 이해하기 쉬울 것입니다.

컨테이너는 결국 호스트 머신의 단순한 프로세스이며, 가상 서버가 아닙니다.

컨테이너의 특징은 다음과 같습니다.

- 컨테이너는 이미지를 기반으로 생성됩니다.
- Docker의 CLI 또는 API를 사용하여 생성, 시작 및 중지할 수 있습니다.
- 여러 컨테이너는 서로 독립적이며 영향을 미치지 않고 독립적으로 작동합니다.
- Docker Engine 위에서 로컬 머신이든 가상 머신이든 클라우드 환경이든 어디서든 실행할 수 있습니다.

### **이미지란?**

이미지는 컨테이너를 실행하는 데 필요한 패키지로, 파일 및 메타 정보를 모아놓은 것입니다.

이미지는 여러 레이어로 구성된 정보를 의미하며, 호스트 머신의 어느 곳에도 .img와 같은 구체적인 단일 파일이 존재하지 않습니다.

이미지에는 다음과 같은 정보가 레이어별로 포함되어 있습니다.

1. **베이스 이미지**: 어떤 기반이 되는지
2. **설치된 내용**: 어떤 소프트웨어나 패키지가 설치되어 있는지
3. **환경 변수**: 어떤 환경 변수가 설정되어 있는지
4. **설정 파일**: 어떤 설정 파일이 구성되어 있는지
5. **기본 명령어**: 기본적으로 실행되는 명령어가 무엇인지

이미지는 **Docker Hub**에서 공개되어 있습니다. (Docker Hub에 공개된 것은 Dockerfile이 아닙니다.)

### **Dockerfile이란?**

**Dockerfile**은 기존 이미지에 추가적인 레이어를 쌓기 위한 텍스트 파일입니다.

인터넷에서 공개된 이미지에 설치된 명령이 부족한 경우, **Dockerfile**을 작성하여 자신만의 편리한 이미지를 만들 수 있습니다.

이미지를 만드는 것이 어려워 보일 수 있지만, 공개된 이미지에 **Dockerfile**로 레이어를 추가하는 것만으로도 OS에서 구축하는 번거로움 없이 간단하게 가능합니다.

**Dockerfile**은 주로 GitHub와 같은 곳에서 공유됩니다. (Git으로 관리되는 것은 이미지가 아닙니다.)

## **기본 명령어 3가지**

이 3가지 요소를 중심으로 생각하면, 명령어의 기본 형태도 3가지로 분류할 수 있습니다.

1. **컨테이너 실행**: 컨테이너를 시작합니다.
2. **이미지 생성**: 이미지를 만듭니다.
3. **컨테이너 조작**: 컨테이너를 조작합니다.

그림으로 표현하면 이 정도입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhBgEkFuV682qs6ChWMH3vvJ5CSiL-V7hxgAxuZW_TPbaxyW-sUOgXrD892BnptqgkJC0-hvRYCykQCAymTjxifLrzrpRqwyNWZPXPWjI5ldAVW2nxonbbDAFkLd4eHYjdY-k5B-6-6mmcqe2bXFshia6U2ZbOSie3GC5rc84JF44hlWHoc3UYxGRlackk)

이 3가지 기본 명령어를 하나씩 이해해보겠습니다.
(각각의 자세한 내용은 다음 페이지에서 다시 설명하겠습니다.)

### **컨테이너 실행하기**

`container run`은 이미지로부터 컨테이너를 시작하는 명령입니다.

`container run`에는 많은 옵션이 있으며, 컨테이너의 목적에 따라 다양한 옵션을 사용해야 합니다.

그러나 기본적으로 이미지로부터 컨테이너를 하나 생성하는 명령어라는 점을 잊지 마세요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiOM40PSJUJBZKRYBCsIA7Uhm-VRvM3q3Wfis46fhMx2Kuonkmg1wdZ0s1ZuYlk5WmB6NC9HdjiYafI9PClHn7-80y-UEDnvdvjLJ2k9SwXGH616U0oAk3Xz4CzIYpB-F02nAUjjtobUZfch0yCtVKK2wxSn50_vz-8Ic0w4jVR_Jcved8NZxRUl7INJHw)

이 글에서도 많은 옵션을 설명하겠지만, 옵션이 정말 많기 때문에 강제로 기억하려고 하지 말고 필요한 옵션을 스스로의 타이밍에 하나씩 이해하는 것이 충분합니다.

또한, 사실 `container run`은 다음 명령을 한 번에 수행하는 편리한 명령어입니다.

그러나 이 글에서는 개별 명령어를 설명하지 않고 `container run`으로 설명하겠습니다.

- `image pull`
- `container create`
- `container start`

### **이미지 생성하기**

`image build`는 **Dockerfile**로부터 이미지를 생성하는 명령입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgPq-y9mRwkc_e3cGqzEX4-1pqwqMzVPcgV_FlCbfxYKX4lTs0t8H0qOiNpcvan1YpANUCHyreZ4tFe5WE7GP-hoDfAjUrSi0eHrCbAbRSlRby_hZ5ndTI8V6eK94B_GRBX7AsfBPyv_WfVte70jSAStUrm2AF31NNqGvIvdMs2V39YkiKy8lmYjnf22Xs)

이미 설명한 대로, **Dockerfile**은 기본 이미지를 지정하고, "명령 설치" 또는 "설정 파일 배치"와 같은 레이어를 쌓아 새로운 이미지를 만드는 데 사용됩니다.

이렇게 직접 만든 이미지는 다른 이미지와 완전히 동일하게 `container run`으로 사용할 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgXzHeX8LE6vvryq2mbRUTIX71qCNk7cIImXhyki7nYHsrnT76WEqZfIVACuCYvSz2zrSfa5HTt8oPT7zXsenhKScdPpQfUVAyrukNmjS2tqMO_WQ0JbLwmhU1wU7MKHk7LR6owQtXPg1M6FzOOScFyzHzjTPAYSiLD3Cm0vc1HVyiPsJz6XPkii2qaCuE)

### **컨테이너 조작하기**

예를 들어 `container exec`는 컨테이너에 명령을 보내는 명령입니다.

대상이 컨테이너이므로 필연적으로 `container run` 이후에 사용하는 명령입니다.

이미지나 Dockerfile에는 명령을 내릴 수 없습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgo9yXGWBBFTuE7yRByKjSBcJ1R4oTh4KfC8918vWy2WW8j8aev0rUggzlhPxyGeAUnoz_U3ZHCULb_ny-1kOmhzBL1k7FucvdWbY-2S7SFeOE-ruPp3VLIZEvl7C5mJSFkXn_0C5KBrJF6c5o5nHb1WJ23EP22u27aYvSfpcNyne8qhKZ5p610D5aQA8M)

`container exec`를 통해 "로그를 보여줘", "컴파일해봐", "테스트 실행해봐"와 같은 명령을 실행하여 실행 중인 컨테이너에 다양한 작업을 수행할 수 있습니다.

또한, `container stop`과 같이 컨테이너를 중지하는 명령을 포함하여 컨테이너를 대상으로 하는 다양한 명령이 있습니다.

## **명령어의 형태를 의식하기**

기본 요소 3가지와 기본 명령어 3가지를 이해했다면, 이 기초를 최대한 활용하기 위해 "명령이 무엇을 어떻게 하는지"를 항상 고려하는 습관을 만들어보세요.

처음에는 어려울 수 있고 힘들게 느껴질 수 있겠지만, 무작위로 명령어를 외우는 것과 이 습관을 계속하는 것 사이에는 이해의 속도와 깊이에서 엄청난 차이가 있습니다.

이 습관을 편안하게 수행할 수 있게 되면 "Docker를 이해했다는 느낌"의 문이 열리는 순간이 될 것입니다.

### "무엇"을 "어떻게" 하는지

기본 요소 3가지와 기본 명령어 3가지를 이해했다면, 전체적인 그림을 다시 확인해보겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjoYXr9XfjCC-inUQVDlTomHpT3pWmCM1K6FEVxz887q_OPt_OZ669oYvuUR7SNko8jD8jyZVB7-cWUbXuIQJkiDxmGGyru1G-qUhUjNZBf_1Rkndv0f41zwmc4tqhX93C3d3_i3gLR6pBD8oQHZQfc385TOgTcHjDPfsQ4Oq26-6cAVWho3tlFAXyDy4g)

화살표의 끝이 컨테이너라면 `container xxx`로, 화살표의 끝이 이미지라면 `image xxx`로 되어 있을 것입니다.

이것이 "무엇"의 부분입니다.

그리고 `run`이나 `build`와 같은 부분이 "어떻게"의 부분입니다.

`docker container run`이나 `docker image build`는 `docker 무엇 (을) 어떻게`로 해석됩니다.

각 명령을 실행할 때마다 머릿속에 (물론 종이에도) 이 그림을 그릴 수 있다면 이해가 빠르게 깊어질 것입니다.

## **새로운 명령어와 이전 명령어에 대해**

일반적으로 Docker를 사용하시는 분들은 이미 알고 계실 것이지만, 이 글에서는 `docker run`이 아닌 `docker container run`을 사용하고 있습니다.

실제로 Docker의 명령어는 2017년 1월에 출시된 v1.13에서 큰 변화가 있었으며, `docker run`은 이전 명령어이고 `docker container run`은 새로운 명령어로 변경되었습니다.

이는 `docker run`이나 `docker build`와 같은 Docker 하위 명령어가 너무 많아져서 무엇이 무엇인지 혼동되기 때문입니다.

따라서 v1.13부터는 명시적으로 대상을 지정할 수 있는 서브커맨드 형식을 사용하는 것이 권장됩니다.

보통 보시는 명령어는 아마도 `docker run`이나 `docker build`와 같은 이전 명령어가 많을 것으로 생각됩니다.

저 또한 간단하고 편리하기 때문에 일상적으로 이전 명령어를 사용하지만, 이 책에서는 명확한 새로운 명령어를 사용하여 설명하겠습니다.

타이핑 수는 많아질 수 있지만, 어떤 것이 이해하기 쉬운지는 한눈에 알 수 있을 것입니다.

| 이전 명령어 | 새로운 명령어 |
|------------|--------------|
| `docker build` | `docker image build` |
| `docker run` | `docker container run` |
| `docker pull` | `docker image pull` |
| `docker create` | `docker container create` |
| `docker start` | `docker container start` |
| `docker images` | `docker image ls` |
| `docker ps` | `docker container ls` |

---

## **Docker와 주변 도구 구분하기**

Docker를 사용하는 데 있어 몇 가지 전제 조건이 있으므로 초보자는 이를 Docker 자체와 혼동하지 않도록 주의해야 합니다.

### 1. **Docker Compose**

- **Docker Compose**는 Yaml 파일을 작성하여 여러 컨테이너를 함께 시작하거나 관리하는 도구입니다.
- **Docker Compose**는 Docker Desktop에 포함되어 있으며, `docker compose xxx`와 같은 명령어 체계를 사용합니다.
- Docker CLI만 사용하여 환경을 구축하려면 많은 복잡한 명령을 반복적으로 실행해야 하므로 Docker 명령어 매뉴얼이 필요합니다.
- 이 문제를 "Docker Compose를 사용하여 모든 상세 명령을 Yaml에 작성하고 GitHub에서 공유"하는 방법으로 해결할 수 있습니다.
- 소프트웨어 엔지니어로서 Docker를 사용하여 개발 환경을 구축하는 경우 **Docker Compose**는 필수 기술입니다.
- 이 책에서는 "Docker를 올바르게 이해하기" → "Docker를 사용하여 환경 구축하기" → "Docker Compose로 간편하게 전환하기"라는 순서로 소개하며, 최종적으로는 `compose up` 명령만으로 복잡한 구성을 즉시 시작할 수 있는 상태를 목표로 합니다.

### 2. **Kubernetes**

**Kubernetes** (K8s로도 알려짐)는 컨테이너화된 애플리케이션을 자동으로 배포, 스케일링 및 관리하는 오픈소스 시스템입니다. 애플리케이션을 구성하는 컨테이너들을 논리적인 단위로 그룹화하여 쉽게 관리하고 발견할 수 있도록 합니다.

![image](https://kubernetes.io/images/kubernetes-horizontal-color.png)

**Kubernetes**는 Google에서 15년간 프로덕션 워크로드를 운영한 경험을 기반으로 구축되었으며, 커뮤니티에서 제공한 최상의 아이디어와 방법들이 결합되어 있습니다. 다음은 **Kubernetes**의 주요 특징입니다:

1. **행성 규모 확장성**: Google은 일주일에 수십억 개의 컨테이너를 운영하게 해준 원칙들에 따라 **Kubernetes**는 운영팀의 규모를 늘리지 않고도 확장될 수 있습니다.
2. **무한한 유연성**: 지역적인 테스트든 글로벌 기업 운영이든 상관없이 **Kubernetes**의 유연성은 사용자의 복잡한 니즈를 모두 수용할 수 있습니다.
3. **자가 치유**: 실패한 컨테이너를 재시작하고, 노드가 죽는 경우 컨테이너를 교체하며, 사용자가 정의한 상태 체크에 응답하지 않는 컨테이너를 종료시킵니다.
4. **스토리지 오케스트레이션**: 로컬 스토리지부터 퍼블릭 클라우드 공급자의 스토리지 시스템까지 다양한 스토리지 시스템을 자동으로 마운트합니다.
5. **시크릿과 구성 관리**: 사용자의 이미지를 다시 빌드하거나 스택 구성의 시크릿을 노출하지 않고 시크릿과 애플리케이션 구성을 배포하고 업데이트합니다.
6. **자동 빈 패킹 (bin packing)**: 리소스 요구 사항과 기타 제약 조건에 따라 컨테이너를 자동으로 배치하면서 가용성은 그대로 유지합니다.
7. **배치 실행**: 배치와 CI 워크로드를 관리할 수 있으며, 실패한 컨테이너를 교체할 수 있습니다.

