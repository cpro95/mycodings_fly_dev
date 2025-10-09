---
slug: 2024-10-21-origin-of-daemon-in-computing-history
title: "컴퓨터 속 'Daemon'의 기원 - 맥스웰의 데몬에서 유닉스의 배경 프로세스까지"
date: 2024-10-21 14:15:14.113000+00:00
summary: "컴퓨터 과학에서 사용되는 'Daemon'의 기원은 물리학의 맥스웰의 데몬에서 유래되었습니다. 이 용어는 오늘날 시스템에서 백그라운드 프로세스를 의미하는 중요한 개념으로 자리 잡았습니다."
tags: ["Daemon 기원", "맥스웰의 데몬", "Unix 세계", "시스템 프로세스", "Daemon vs Demon", "백그라운드 프로세스"]
contributors: []
draft: false
---

![](https://blogger.googleusercontent.com/img/a/AVvXsEguSyNtFIyMQREAnr-7QaBowkRGZt8hqDS8xQHjA6GDMJH0hAG0OLo3Bem6bP5-aOakQPkeL3xIOMJC6JmigGadwAgF0OkzAdSN2luVDHil75tz7PeimZ37Rv1mJsV_1P25TI-JGuRERJEdbe0h70dUGdNC6xhDbMyQZAr-SKBvwUw-ciphGGpPRQbn7hY)

안녕하세요?

컴퓨터 과학에서 흔히 사용하는 용어 중 하나인 **‘daemon’**은 시스템에서 백그라운드 작업을 수행하는 프로세스를 의미합니다.

이 용어는 맥스웰의 데몬이라는 물리학 개념에서 유래된 것으로 알려져 있는데요.

하지만 이 용어의 기원과 그 의미에 대해 많은 사람들이 혼란스러워하고 있습니다.

오늘은 커뮤니티에서 제기된 다양한 의견을 통해 'daemon'의 의미와 기원을 더 깊이 있게 알아보겠습니다.

### 1. **Daemon의 기원: 맥스웰의 데몬에서 유닉스까지**

![](https://blogger.googleusercontent.com/img/a/AVvXsEjEuFczxNjoJGdDfOmCJHz6q8hn3X-60InNkIpkfCPl56szkPhUdOHEclUHt34VQY763UuPmyDh2kirHZKrnVoJuo4rEMbs1OIkNkJsqp9aMSTJ_YIk6r4InET0Li11FjTSV-SGinwMRLHQKluKQZMcF-k41SbADPkGN6Dt9zjo-rGC9yB2FKEDZpiZ1oM)

'Daemon'이라는 용어는 **맥스웰의 데몬(Maxwell's Demon)**에서 유래한 것으로 알려져 있습니다.

맥스웰의 데몬은 열역학에서 고안된 가상 개체로, 두 개의 방 사이에서 분자들이 통과하는 속도를 제어하는 역할을 했습니다.

이 데몬은 분자의 속도를 관찰하고, 이를 바탕으로 빠른 분자는 한 방으로, 느린 분자는 다른 방으로 보냈습니다.

이 과정에서 데몬은 열역학 법칙을 위반하지 않으면서도 온도를 조절할 수 있었습니다.

컴퓨터 과학자들은 이 개념을 차용하여 **백그라운드에서 조용히 작업을 수행하는 시스템 프로세스**를 'daemon'이라고 부르기 시작했습니다.

이는 맥스웰의 데몬이 분자들을 무리 없이 분류했던 것처럼, 컴퓨터 시스템에서 'daemon'이 사용자에게 보이지 않게 다양한 작업을 수행하는 것과 유사하기 때문입니다.

한 커뮤니티 유저는 "Daemon은 살아 있는 작은 악마처럼 보이지 않게 일하는 프로세스 같다"고 설명하며, 이 용어가 어떻게 컴퓨터 시스템에 적용되었는지에 대해 이야기했습니다.

### 2. **Daemon을 둘러싼 잘못된 해석들**

그러나 'daemon'의 기원에는 여러 가지 잘못된 해석도 존재하는데요.

예를 들어, 일부 사람들은 'daemon'이 **Disk And Executive MONitor**의 약자라고 잘못 알고 있기도 합니다.

하지만 이 해석은 정확하지 않은 것으로 밝혀졌습니다.

실제로 이 해석은 나중에 만들어진 '백크로님(backronym)'이라는 의견이 많으며, 원래의 'daemon'은 맥스웰의 데몬에서 비롯되었다는 것이 더 정확한 설명입니다.

한 유저는 "‘Disk And Executive MONitor’라는 설명은 멋지긴 하지만, 이는 나중에 만들어진 약자일 가능성이 크다"고 지적했습니다.

### 3. **Unix 세계의 다크하지만 재미있는 용어들**

컴퓨터 과학에서 'daemon'뿐만 아니라, 유닉스(Unix) 환경에서는 많은 흥미로운 용어들이 사용되고 있습니다.

예를 들어, **새 파일은 666 권한(읽기, 쓰기 권한)을 부여받고**, 부모 프로세스는 자식 프로세스를 '죽이고', 때로는 좀비 프로세스도 '죽여야' 합니다.

이러한 다소 다크하지만 재미있는 용어들은 시스템이 어떻게 동작하는지에 대한 흥미로운 통찰을 제공합니다.

한 유저는 "유닉스 세계는 어두운 용어들로 가득하다.

좀비는 이미 죽었기 때문에 죽일 수 없고, 부모 프로세스는 자식을 죽이고 자신도 죽는다"고 언급하며, 이러한 용어들이 시스템에서 어떻게 사용되는지에 대해 설명했습니다.

### 4. **Daemon과 Demon의 차이**

![](https://blogger.googleusercontent.com/img/a/AVvXsEjxyiFniXuMaltJGA3-oQXGwKd4sBbkw5Y_u_XJ1dx_sGQsA9QBJX7yBDTXtUediJCqo2InwuX6yiSnYA3iyIdxm8ubpWlMJd2XcDYetH-oppoRXWt9YvFTvpGIdzgU3AUve6HEL-MHnImWa6WLU3NAbqNCY-7nuboO7w9gqDtfv3c81w5rA94t5OO_SWU)

‘daemon’이라는 단어는 종종 'demon(악마)'과 혼동되곤 합니다.

하지만 이 둘은 엄연히 다른 의미를 가지고 있습니다.

'Daemon'은 고대 그리스어에서 유래된 단어로, **신과 인간 사이의 중간 존재**를 의미합니다.

반면, 'demon'은 성경에서 악한 영혼을 의미하는 단어로 사용되었습니다.

한 커뮤니티 유저는 "Daemon은 악한 영혼이 아닌, 중간 존재나 수호령을 의미한다"고 설명하며, 두 단어의 차이를 강조했습니다.

또한, 'daemon'의 발음에 대해서도 의견이 갈렸습니다.

일부는 'day-mon'으로 발음해야 한다고 주장하는 반면, 다른 사람들은 'demon'과 동일하게 발음한다고 말합니다.

한 유저는 "나는 'day-mon'으로 발음하지만, 대부분의 사람들이 'demon'과 동일하게 발음한다"고 말하며, 발음 문제에 대한 논쟁을 소개했습니다.

### 결론

'Daemon'이라는 용어는 맥스웰의 데몬에서 유래하여, 오늘날 컴퓨터 시스템에서 백그라운드 작업을 수행하는 프로세스를 의미하게 되었습니다.

이 용어는 물리학의 개념에서 차용되어 컴퓨터 과학에 적용된 흥미로운 사례 중 하나입니다.

또한, Unix 세계에서는 'daemon' 외에도 다양한 다크하면서도 재미있는 용어들이 사용되고 있어, 시스템의 동작 방식을 이해하는 데 큰 도움이 됩니다.

---