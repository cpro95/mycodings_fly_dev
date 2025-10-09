---
slug: 2024-01-10-how-to-run-batch-file-as-admin-privilege-on-windows-system
title: 윈도우에서 배치 파일을 관리자 권한으로 실행하는 방법
date: 2024-01-10 12:15:42.357000+00:00
summary: 윈도우에서 배치 파일을 관리자 권한으로 실행하는 방법
tags: ["admin", "windows", "batch", "bat"]
contributors: []
draft: false
---

안녕하세요?

맥이나 리눅스 같은 POSIX 시스템에서는 관리자 권한으로 명령을 실행하는 게 무척 쉬운데요.

앞에 'sudo'만 붙히면 됩니다.

심지어 shell script 같은 윈도우 시스템으로 보자면 배치파일에서도 손쉽게 관리자 모드로 실행 할 수 있습니다.

그런데, 윈도우즈에서는 관리자 모드가 꼭 오른쪽 버튼을 눌러 일일이 선택해 줘야 하는데요.

이게 무척 번거로운 작업이 아닐 수 없는데요.

오늘은 제가 구글링해서 얻은 관리자 보드 배치파일 실행 방법에 대해 알아보겠습니다.

--

## 관리자 모드 배치파일을 위한 템플릿

윈도우즈에서 배치파일의 확장자는 '.bat' 파일인데요.

관리자 모드로 실행하고자 하는 '.bat' 파일을 만들고 아래 명령어 전체를 '.bat' 파일 도입부에 삽입하면 됩니다.

```bash
 :: BatchGotAdmin
 :-------------------------------------
 REM  --> Check for permissions
 >nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"

REM --> If error flag set, we do not have admin.
 if '%errorlevel%' NEQ '0' (
     echo Requesting administrative privileges...
     goto UACPrompt
 ) else ( goto gotAdmin )

:UACPrompt
     echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
     echo UAC.ShellExecute "%~s0", "", "", "runas", 1 >> "%temp%\getadmin.vbs"

    "%temp%\getadmin.vbs"
     exit /B

:gotAdmin
     if exist "%temp%\getadmin.vbs" ( del "%temp%\getadmin.vbs" )
     pushd "%CD%"
     CD /D "%~dp0"
```

이 템플릿을 사용하면 원하는 명령어를 실행할 때 권한 요청 과정을 자동으로 처리할 수 있습니다. 마지막 줄에는 여러분이 실행하고자 하는 명령어를 넣으면 됩니다.

예를 들어, 아래와 같이 사용할 수 있습니다:

```bash
 :: BatchGotAdmin
 :-------------------------------------
 REM  --> Check for permissions
 >nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"

REM --> If error flag set, we do not have admin.
 if '%errorlevel%' NEQ '0' (
     echo Requesting administrative privileges...
     goto UACPrompt
 ) else ( goto gotAdmin )

:UACPrompt
     echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
     echo UAC.ShellExecute "%~s0", "", "", "runas", 1 >> "%temp%\getadmin.vbs"

    "%temp%\getadmin.vbs"
     exit /B

:gotAdmin
     if exist "%temp%\getadmin.vbs" ( del "%temp%\getadmin.vbs" )
     pushd "%CD%"
     CD /D "%~dp0"

REM --> 여기서부터 여러분의 코드가 오면 됩니다.
cd \users\myid\withadmin
startWithAdmin.bat
```

이렇게 함으로써 'startWithAdmin.bat' 파일은 관리자 권한으로 실행됩니다. 이 템플릿은 윈도우 사용자들에게 효율적이고 편리한 관리자 권한 실행 경험을 제공합니다. 여러분의 업무나 스크립트 작업을 더욱 원활하게 진행하시길 바랍니다.

위 방식은 진짜 저도 정말 많이 써먹는 윈도우즈 관련 유용한 팁입니다.

많은 도움이 되셨으면 합니다.

