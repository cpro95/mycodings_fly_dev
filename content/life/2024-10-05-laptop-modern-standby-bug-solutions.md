---
slug: 2024-10-05-laptop-modern-standby-bug-solutions
title: 노트북 배터리 문제? Modern Standby 버그를 해결하는 방법
date: 2024-10-05 12:42:35.112000+00:00
summary: 노트북의 Modern Standby 버그로 인한 배터리 소모와 과열 문제를 해결하는 방법을 알아봅니다. Hibernate 모드와 BIOS 설정을 통해 안전하게 노트북을 사용할 수 있는 팁을 제공합니다.
tags: ["Modern Standby", "노트북 과열", "Hibernate 모드", "배터리 소모", "Windows", "BIOS"]
contributors: []
draft: false
---

![](https://blogger.googleusercontent.com/img/a/AVvXsEgJGDnYgbPSNgiNustV-yFhtpKAVEn6t1ZmWqenZO8gw8_g9UjSdshRtvOv_OvOMHjxJoyDZgQVt3KlK3XwpYSMlUmG46kxePZlXcGdoLzJypufXE4njnYI6KpRdyVroHcqmtcrM5EzKb1GhSFW3elCs5LMvNEKVC__Fve7UhIXTWLAa7fGIwYhDKIC3A8)

노트북을 가방에서 꺼냈을 때, 배터리가 완전히 방전되고 노트북이 극도로 뜨거워져 있었던 경험이 있으신가요?

이른바 **Modern Standby** 버그로 인해 발생하는 문제일 수 있는데요.

이 문제는 **Windows** 노트북에서 주로 발생하며, 특히 고성능 노트북이나 **게이밍 노트북**에서 더욱 심각하게 나타납니다.

이번 글에서는 이 Modern Standby 버그의 원인과 해결 방법을 커뮤니티에서 제기된 다양한 의견을 바탕으로 알아보겠습니다.

참고로 Linus Tech Tips 유튜브 채널에 Modern Standby 버그 관련 좋은 영상이 있습니다.

아래 링크를 참고 바랍니다.

[Linus Tech Tips - Microsoft is Forcing me to Buy MacBooks - Windows Modern Standby](https://www.youtube.com/watch?v=OHKKcd3sx2c)

### 1. Modern Standby 버그란?

![](https://blogger.googleusercontent.com/img/a/AVvXsEhSgVFd9_M8okMAtxtPZ2dx8qPr8DL-rSJV0YmmFJrdz7iFo8EPQVmCC9Sb7MTSPmPQ71cLWyJ9mBrd9ycQcWdXrLb0je7ozntNOG8rMoLE8nIT2cmseP7L2PyLnIsSqjubvHKvdjf4QR7O0_8VHRu0WQCmqcPZ1dF-9YnQUpwJAd_xZFI1X83tluseN9w)

**Modern Standby**는 **Microsoft**가 노트북에서도 **스마트폰**처럼 빠르게 시스템을 깨어나게 하기 위해 도입한 기능인데요.

이 기능은 노트북이 **Sleep 모드**에 들어가도 완전히 꺼지지 않고, **백그라운드 작업**을 계속 수행하게 만듭니다.

예를 들어, 이메일을 받거나 업데이트를 다운로드하는 작업들이 계속 진행되죠.

하지만 문제는, 노트북이 Sleep 모드에 들어가도 실제로는 계속해서 **전력을 소모**하고, 가방 속처럼 통풍이 안 되는 환경에서는 과열되기 쉽다는 점입니다.

한 커뮤니티 유저는 **가방 속에서 노트북이 계속 작동해 너무 뜨거워져서 SSD가 고장 났다**고 말하며, 이 문제의 심각성을 언급했습니다.

이처럼 Modern Standby는 특히 고성능 CPU를 탑재한 기기에서 큰 문제로 다가올 수 있습니다.

### 2. 해결 방법은?

그렇다면 이 문제를 어떻게 해결할 수 있을까요?

커뮤니티에서는 몇 가지 해결책을 제시했는데요.

1. **노트북을 완전히 종료하기**: 가장 확실한 방법은 노트북을 Sleep 모드로 두지 않고 **완전히 종료하는 것**입니다. 한 유저는 **노트북을 가방에 넣기 전에 항상 완전히 종료한다**고 말하며, 이 방법이 문제를 예방하는 데 가장 효과적이라고 강조했습니다.

2. **Hibernate 모드 사용**: **Hibernate**(**최대 절전 모드**)를 사용하는 것도 좋은 대안입니다. Hibernate 모드는 **RAM**의 내용을 **SSD**에 저장하고, 노트북을 완전히 전력 차단 상태로 만들기 때문에 배터리가 소모되지 않습니다. 한 유저는 **Hibernate 모드 덕분에 배터리 소모 없이 노트북을 장시간 보관할 수 있었다**며 이 방법을 추천했는데요. 특히, 최신 **NVMe SSD**를 사용하는 경우 Hibernate에서 복귀하는 시간도 매우 빠릅니다.

3. **Modern Standby 비활성화**: 일부 노트북에서는 BIOS 설정에서 **Modern Standby** 기능을 비활성화할 수 있습니다. 이를 통해 노트북이 전통적인 **S3 Sleep 모드**로 돌아가게 만들 수 있는데요. S3 모드는 모든 백그라운드 작업을 중지하고, 전력 소모를 최소화합니다. 커뮤니티에서는 **Modern Standby를 비활성화하고 나서야 문제가 해결됐다**는 의견이 많이 나왔습니다.

### 3. 그 외 고려 사항

이 문제는 단순히 **Windows**에만 국한된 것이 아니라, **BIOS** 설정과 결합된 문제라는 의견도 있었습니다.

일부 유저들은 "**Linux**도 이 문제에 영향을 받는다"고 말했지만, **Linux**의 경우 Modern Standby 기능을 기본적으로 사용하지 않기 때문에 상대적으로 덜 영향을 받는다고 합니다.

또한, 특정 제조사의 BIOS 설정이 문제를 악화시킬 수 있으므로, BIOS 업데이트도 고려할 필요가 있습니다.

### 4. 결론: Modern Standby 버그 해결을 위한 최선의 방법

Modern Standby는 노트북을 더 빠르고 스마트하게 만들기 위한 시도였지만, 예상치 못한 부작용을 일으킬 수 있습니다.

배터리 소모와 과열 문제를 피하기 위해서는 **노트북을 완전히 종료**하거나, **Hibernate 모드**를 사용하는 것이 좋습니다.

또한, BIOS 설정에서 Modern Standby를 비활성화하는 것도 문제 해결에 도움이 될 수 있습니다.

결국, 노트북을 안전하게 사용하고 배터리 수명을 유지하기 위해서는 이러한 해결책들을 잘 활용하는 것이 중요합니다.

노트북을 가방에 넣기 전, 항상 한 번 더 확인하는 습관을 들여보는 건 어떨까요?

---

