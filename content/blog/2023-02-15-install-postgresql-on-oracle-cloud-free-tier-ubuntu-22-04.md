---
slug: 2023-02-15-install-postgresql-on-oracle-cloud-free-tier-ubuntu-22-04
title: 오라클 클라우드 Free Tier에 PostgreSQL 서버 설치하기(Ubuntu 22.04)
date: 2023-02-15 13:39:31.335000+00:00
summary: 평생 공짜인 오라클 Free Tier에 PostgreSQL 서버 설치, 우분투 22.04 버전
tags: ["postgresql", "oracle_cloud", "free_tier", "ubuntu"]
contributors: []
draft: false
---

안녕하세요?

작년쯤인가 아랫글을 작성했었는데요.

[오라클 클라우드(Oracle Cloud)로 무료로 웹 서버 구축하기](https://mycodings.fly.dev/blog/2022-08-07-complete-introduction-of-oracle-cloud-free-tier)

평생 무료 서버 구축해 놓고 쓰고 있지 않아서 아까웠는데요.

원래는 Strapi 서버를 구축하려고 했는데 좀 더 좋은 PostgreSQL 서버가 좀 더 나은 선택이라 결론지었습니다.

그래서 오늘은 퇴근 후 많은 시간을 투자해서 PostgreSQL 서버를 구축했습니다.

제가 나중에 잊어버리지 않게 이 글을 노트 삼아 작성할 예정이오니 참고 바랍니다.

---

## 오라클 클라우드에 PostgreSQL 포트 오픈시키기

PostgreSQL 서버를 오라클 클라우드에서 작동시키려면 외부에서 접속할 수 있는 포트를 열어야 하는데요.

예전 글을 잘 살펴보시면 포트 추가하는 곳이 나옵니다.

간략히 큰 메뉴에서 설명하자면,

"네트워킹 - 가상 클라우드 네트워크"를 선택한 다음

예전에 구획을 main, sub 두 개를 나누었었는데요.

원하는 구획을 선택하고 VCN을 클릭해서 들어갑니다.

그러면 아래와 같이 나오는데요.

먼저, 왼쪽 리소스 메뉴 밑에 "보안 목록(2개)"를 눌러야지 오른쪽 화면이 아래 그림과 같이 바뀝니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEi0GeI9zJfdY5q9lmnca44lsxznwRD5OQEDwQUtKBQskmYtuV_kByrqgQwUHLEWGNrwcsOHKL4V1shx1FA3juSOFJ23tY0baRK43C9hFXjU2x8CXZoAC6WDzm0n1LbzhlpuUHCXVpnEeB-tXx9QVkzByqf5LHbTZnhTizy0LKpuzCc_vE6w6qCfTxmy)

이제 그림에서 "Default Security List for main-VCN"을 선택한 다음 아래 그림과 같이 수신 규칙을 하나 추가합니다.

아래는 PostgreSQL 포트인 5432 포트를 추가하는 예제입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEg2WVzHa8wNUoDrjQfTrB0lLK5MCKK48uuH7ujiQr_Edb7FOVgVU1dQ0Zn9rofdOaH2ffNsAGgVGXRLTsiGn5I_x3a02FR6o5ohGkmeAa1yruvs0G-HiFz_Rj9-lZyqcqZoXmdzq6odWvlZFc5Oh0iOgdwgZvsDSMF3wKNQ5nM_QGp_Mf4EXfPN3sKq)

이제 포트까지 열었으니까 상위 메뉴에서 인스턴스로 가서 main 구획이 있는 인스턴스를 클릭한 다음 재부팅을 해야 합니다.

그런데, 재부팅은 조금 있다 하시고요.

---

## SSH로 오라클 서버로 접속 및 PostgreSQL 설치

```bash
ssh -i oracle-server-ssh.key ubuntu@222.222.222.222
```

위 코드는 오라클 서버로 접속하는 ssh 접속 명령어입니다.

주소는 예전에 저장해 놨을 거고, 접속 key도 저장해 놨을 텐데요.

일단 접속하시면 ubuntu 콘솔 창이 나옵니다.

여기서 이제 PostgreSQL 설치를 해야 합니다.

```bash
sudo apt update

sudo apt install postgresql postgresql-contrib
```

그러면 현재 기준 PostgreSQL 버전 14가 설치되는데요.

이제 PostgreSQL 초기 세팅을 해줘야 합니다.

## PostgreSQL 세팅

일단 설치를 했으면 잘 실행되는지 테스트해 봐야 하는데요.

```bash
ubuntu@main-instance:~$ sudo -i -u postgres
postgres@main-instance:~$
```

위와 같이 postgres 아이디로 사용자를 바꾸고,

```bash
postgres@main-instance:~$ psql
```

psql 명령어를 입력해 봅니다.

그러면 다음과 같이 나오는데요.

```bash
postgres@main-instance:~$ psql
psql (14.6 (Ubuntu 14.6-0ubuntu0.22.04.1))
Type "help" for help.

postgres=# \q
```

잘 실행되네요.

postgres 프로그램에서 나오려면 `\q`를 입력하면 됩니다.

### Creating a New Role

postgres 는 디폴트 사용자라서 보통 다른 사용자를 추가하는데요.

postgres 사용자로 전환했다고 가정하고 아래와 같이 해야 합니다.

```bash
postgres@main-instance:~$ createuser --interactive
Enter name of role to add: test
Shall the new role be a superuser? (y/n)
```

그러면 이름하고 superuser로 지정하겠냐고 묻는데요.

이름은 본인 아이디로 하시고 superuser는 Y를 선택합시다.

### Creating a New Database

PostgreSQL은 user 이름과 똑같은 데이터베이스를 디폴트로 불러오는데요.

그래서 유저 이름과 같은 데이터베이스를 만드는 게 좋습니다.

```bash
postgres@main-instance:~$ createdb test
```

저는 이름을 test로 했는데, 본인 아이디로 하시든가 프로젝트 이름으로 하시든가 마음대로 하면 됩니다.

### User 추가하기

PostgreSQL 로그인 방법 중에 ident based authentication 이란게 있는데요.

이건 리눅스 서버 유저 이름과 PostgreSQL Role 이름과 DB 이름이 같다고 전제하는 방식입니다.

그래서 오라클 리눅스 서버에 아까 만들었던 PostgreSQL Role 이름과 똑같은 유저를 생성해야 합니다.

```bash
$ sudo adduser test
```

이제 새로 만든 유저 이름으로 전환해서 psql 명령어를 실행해 봅시다.

```bash
sudo -i -u test
psql
```

```bash
test=# \conninfo
```

위 명령어는 connection info 라는 명령어인데요.

```bash
test=# \conninfo
You are connected to database "test" as user "test" via socket in "/var/run/postgresql" at port "5432".
```

위와 같이 나올 겁니다.

여기서 중요한 게 나중에 pgAdmin이란 프로그램으로 외부에서 접속할 때 비밀번호를 물어보거든요.

그래서 아래와 같이 한번 입력해 주십시오.

```bash
test=# ALTER USER test PASSWORD 'myPassword';
```

위 명령어는 test 유저의 PASSWORD를 'myPassword'로 바꾼다는 뜻입니다.

위 명령어가 성공적으로 작동된다면 "ALTER ROLE"이라는 문구가 나올 겁니다.

이제 PostgreSQL 서버 설치는 끝났는데요.

설정 부분만 남았습니다.

---

## 외부 접속이 가능하게끔 PostgreSQL 설정 파일 고치기

먼저, 오라클 클라우드 서버에 접속하셨으면 아래와 같이 입력합니다.

```bash
sudo vim /etc/postgresql/14/main/pg_hba.conf

또는

sudo nano /etc/postgresql/14/main/pg_hba.conf
```

편집기를 이용해서 아래와 같이 고치면 됩니다.

```bash
# Database administrative login by Unix domain socket
local   all             postgres                                peer

# TYPE  DATABASE        USER            ADDRESS                 METHOD

# "local" is for Unix domain socket connections only
local   all             all                                     scram-sha-256
# IPv4 local connections:
#host    all             all             127.0.0.1/32            scram-sha-256
host    all             all             0.0.0.0/0               scram-sha-256
# IPv6 local connections:
host    all             all             ::1/128                 scram-sha-256
# Allow replication connections from localhost, by a user with the
# replication privilege.
#local   replication     all                                     peer
#host    replication     all             127.0.0.1/32            scram-sha-256
#host    replication     all             ::1/128                 scram-sha-256
```

여기서 중요한 게 바로 아래와 같이 두 부분인데요.

```bash
local   all             all                                     scram-sha-256
host    all             all             0.0.0.0/0               scram-sha-256
```

scram-sha-256 방식은 인증 방식인데요.

인증 방식은 PostgreSQL 공식 문서에 보면 3가지가 나오는데요.

가장 좋은 게 바로 scram-sha-256 방식입니다.

간략하게 설명서를 보여드리겠습니다.

| 인증방식      | 설명                                                                                                                                                                                                                                               |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| peer          | 피어(peer) 인증 방법은 클라이언트의 운영 체제 사용자 이름을 커널로부터 획득하고, 허용된 데이터베이스 사용자 이름으로 사용함으로써 작동된다 (선택적 사용자 이름 매핑 사용 ex: all, postgres 등으로 사용자 매핑 ) 이 방법은 로컬 연결에만 지원된다.  |
| md5           | 암호 스니핑을 방지하고 일반 텍스트로 서버에 암호를 저장하는 것을 방지(암호화)하지만 공격자가 서버에서 암호 해시를 훔치는 경우 보호 기능을 제공하지 않는다. 또한 MD5 해시 알고리즘은 이제 더 이상 결정된 공격에 대해 안전한 것으로 간주되지 않는다. |
| scram-sha-256 | 신뢰할 수없는 연결에서 암호 스니핑을 방지하고 안전한 것으로 간주되는 암호화 해시 된 형식으로 서버에 암호를 저장하는 것을 지원하는 시도 응답 체계다. 이것은 현재 제공되는 방법 중 가장 안전하지만 이전 클라이언트 라이브러리에서는 지원되지 않는다. |


이제, 두 번째 설정 파일을 고쳐야 하는데요.

```bash
sudo vim /etc/postgresql/14/main/postgresql.conf

또는

sudo nano /etc/postgresql/14/main/postgresql.conf
```

이 파일에서는 다음과 같이 바꾸면 됩니다.

```bash
#------------------------------------------------------------------------------
# CONNECTIONS AND AUTHENTICATION
#------------------------------------------------------------------------------

# - Connection Settings -
listen_addresses = '*'
#listen_addresses = 'localhost'         # what IP address(es) to listen on;
```

listen_addresses 를 '*'로 지정한다는 뜻은 어느 IP에서든 접속을 허락한다는 뜻입니다.

이제 PostgreSQL 서버를 재시작하고 상태를 살펴볼까요?

```bash
ubuntu@main-instance:~$ sudo systemctl restart postgresql

ubuntu@main-instance:~$ sudo systemctl status postgresql
● postgresql.service - PostgreSQL RDBMS
     Loaded: loaded (/lib/systemd/system/postgresql.service; enabled; vendor preset: enabled)
     Active: active (exited) since Wed 2023-02-15 22:19:49 KST; 59min ago
    Process: 2892 ExecStart=/bin/true (code=exited, status=0/SUCCESS)
   Main PID: 2892 (code=exited, status=0/SUCCESS)
        CPU: 1ms

Feb 15 22:19:49 main-instance systemd[1]: Starting PostgreSQL RDBMS...
Feb 15 22:19:49 main-instance systemd[1]: Finished PostgreSQL RDBMS.
```

systemctl로 재시작하고 상태도 살펴봤는데 잘 실행되고 있네요.

그런데 여기서 끝이 아닙니다.

---

## 외부접속을 위한 방화벽, iptables 설정하기

오라클 클라우드 서버는 방화벽이 기본 설정되어 있어서 풀어줘야 합니다.

다음과 같이 하시면 됩니다.

```bash
sudo firewall-cmd --permanent --add-port=5432/tcp

sudo firewall-cmd --reload
```

방화벽에 5432/tcp 포트를 열어 두는 겁니다.

```bash
ubuntu@main-instance:~$ sudo firewall-cmd --list-all
public
  target: default
  icmp-block-inversion: no
  interfaces:
  sources:
  services: dhcpv6-client ssh
  ports: 5432/tcp
  protocols:
  forward: yes
  masquerade: no
  forward-ports:
  source-ports:
  icmp-blocks:
  rich rules:
ubuntu@main-instance:~$
```

위와 같이 나오면 잘되고 있는 겁니다.

이제 패킷 관련 iptables을 건들어야 합니다.

```bash
sudo iptables -I INPUT -p tcp --dport 5432 -j ACCEPT
```

이제 완료되었습니다.

그럼, 아까 맨 위에서 재부팅 나중에 하라고 했던 그 부분으로 가서 오라클 클라우드 서버를 재부팅 합시다.

## pgAdmin으로 접속하기

PostgreSQL 관련 가장 좋은 Client Tool은 바로 pgAdmin 앱인데요.

[pgAdmin 홈페이지](https://www.pgadmin.org/) 

여기서 다운로드하시면 됩니다.

받아서 설치하고 실행하면 마스터 패스워드를 물어보는데요.

pgAdmin 프로그램의 마스터 패스워드라서 잘 선택하고 외우시기를 바랍니다.

이제 오라클 PostgreSQL 서버에 접속해 볼까요?

왼쪽 Browser에서 Servers를 고르신 후 오른쪽 버튼을 누르면 아래와 같이 나오는데요.

여기서 아래와 같이 Register Server를 선택합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjNbtWUyn8AaKMUOHlxAUN_kzMw4qD4KtiGjWB_Ltuoll5z-_t1s0F7vle3bHXGIoFuEg7VuD5cfTCb_sdhJxroFaWfpwQEdO_4tdhV1baKbJ01g8tR5XhHIzMrY4jLCGlQj2tb3TKQyXEOhDyy9HKNHai6Pstyh17F8aq-RN2np_t-J5AMSV-ByxUa)

그리고 아래와 같이 General 탭에서는 적당한 이름을 적어주시고

![](https://blogger.googleusercontent.com/img/a/AVvXsEhxBmShO6n_HMjL_imIfq7CV2xF4mrdFNM6aZVUhpDQs7RXMKbKLkJ7smqVxq6Ov2HQ3DR-GCauQUYOn0dnh3HfvVZEgdBkGdGvqcRx-bpfmjKC6YQ3qrgG1-tV2tyRyY6ufyPDWAxXrKPyv_ZQ7HxKqIWrX3gNbcRs-Nst9XoRL5IAIIHbsdjtC8RX)

아래와 같이 서버 주소, 포트, 사용자 아이디, 그리고 패스워드도 넣어줍니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEi4qPjS7zt6qQrZvpjqh0rHVdCX2OCsM_1IbMmgZBtwngqSPJcpBniNWJm3yx0lwM6fHyPET6evzI08eLAflEw2VqcjYpPY9mEjz96PJhA3_0f_4AU5of78eBugucFIujXCKq8lr2clEXOE43Qz57Ui8mAqlv0vvaXPr9kq6GDoL6AAm9Yfbsj9iFl3)

Username과 함께 Password 가 필요한 이유가 우리가 위에서 선택한 scram-sha-256 방식입니다.

password를 설정 안 했다면 이 글 중간쯤에 ALTER USER 관련 패스워드 변경 방법이 나옵니다.

아래처럼요.

```bash
test=# ALTER USER test PASSWORD 'myPassword';
```

패스워드가 생각나신다면 적으시고 이제 맨 아래 오른쪽 Save 버튼을 누르면 성공입니다.

화면에 서버이름이 잘 나오네요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjX8hrPXtBxq_mwQDSp5djTXKmNcVADaKqO6QKBIoyh1Dkdsr_tzIrHRkP_4YcmxIpwRI7LqKMfGokHRiDL98PoQL8f8aMW_8B_6wTut-FWe57F9jqxCyEEB0yz3Y0N_0Aoiv93Tv_ofgN-eMePxztwmVhL9l5upFlz2FfHq-fmso5NePFoKY_ClwHf)

위와 같이 나온다면 완성입니다.

지금까지 오라클 클라우드 프리 티어에 PostgreSQL 서버를 설치하는 방법에 대해 설명드렸는데요.

이제 웹 개발할 때 위에서 설치한 서버를 이용해서 DB 관련 작업을 하면 될 거 같네요.

그럼.



