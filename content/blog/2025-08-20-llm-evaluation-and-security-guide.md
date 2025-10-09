---
slug: 2025-08-20-llm-evaluation-and-security-guide
title: NDC Oslo 2025 - LLM 그냥 쓰면 큰일나요? 모델 성능 측정과 보안 A to Z
date: 2025-08-22 13:51:16.142000+00:00
summary: LLM을 프로덕션에 도입하기 전 꼭 알아야 할 성능 측정 방법과 보안 위협 방지 기술을 알아봅니다. RAG 평가부터 에이전트 테스트까지 실용적인 예제와 함께 설명합니다.
tags: ["LLM 평가", "RAG", "LLM 보안", "딥이벌", "프롬프트퓨", "LLM 가드"]
contributors: []
draft: false
---

![](https://img.youtube.com/vi/VP2OlIXVMa0/maxresdefault.jpg)
[NDC Oslo 2025 유튜브 링크](https://www.youtube.com/watch?v=VP2OlIXVMa0)

여기 아주 좋은 유튜브 강연이 있는데요, 이 강연의 핵심만 전체적으로 살펴볼까 힙니다.<br /><br />
LLM을 이용해 뭔가를 만들어내는 건 정말 쉬워졌습니다.<br /><br />
API 한 번 호출하는 것만으로도 놀라운 결과물을 얻을 수 있거든요.<br /><br />
발표자도 구글 클라우드의 Vertex AI를 사용해서 비디오를 분석하는 데모를 보여주더라고요.<br /><br />
리우데자네이루의 아름다운 풍경이 담긴 영상을 넣고, "이 비디오를 챕터별로 나누고 핵심 이벤트를 JSON 형식으로 정리해 줘"라고 요청하는 거죠.<br /><br />
코드를 보면 정말 별게 없습니다.<br /><br />

```python
# 파이썬 코드 예시입니다. C# 등 다른 언어로도 가능하죠.
client = generative_models.GenerativeModel("gemini-1.5-pro-preview-0409") # 클라이언트 생성

video = Part.from_uri(
    "gs://cloud-samples-data/generative-ai/video/rio.mp4", mime_type="video/mp4"
) # 비디오 파일 지정

prompt = """
Please chapterize the video for me.
Break down the key events and highlights.
Give me this information in a JSON format.
""" # 프롬프트 작성

contents = [video, prompt] # 비디오와 프롬프트를 함께 전달

response = client.generate_content(contents) # API 호출!
print(response.text)
```

클라이언트를 만들고, 비디오 파일 경로를 알려주고, 프롬프트를 작성해서 `generate_content` 딱 한 번 호출하면 끝나는 구조입니다.<br /><br />
정말 간단하죠?<br /><br />
하지만 진짜 어려운 문제는 여기서부터 시작됩니다.<br /><br />
과연 LLM이 뱉어낸 결과물이 '좋은' 결과물인지 어떻게 알 수 있을까요?<br /><br />
'좋다'는 건 또 무슨 의미일까요?<br /><br />
어떤 사람은 특정 'JSON 구조'를 원할 수도 있고, 어떤 사람은 내용의 '정확성'을 중요하게 생각할 수도 있습니다.<br /><br />
또 내가 물어본 질문과 '관련성'이 높은 답변을 원할 수도 있고, 내가 제공한 '내부 데이터'에 기반해서만 답변하기를 바랄 수도 있죠.<br /><br />
이처럼 '좋은 결과'의 기준은 상황에 따라 완전히 달라지기 때문에, 이걸 정량적으로 측정하는 건 정말 어려운 일이거든요.<br /><br />

## 구조화된 출력 이제는 기본이죠

사실 몇 년 전만 해도 LLM이 항상 우리가 원하는 형태로 결과물을 주지는 않았습니다.<br /><br />
어떨 땐 일반 텍스트, 어떨 땐 마크다운, 운이 좋으면 JSON을 줬는데 그마저도 문법 오류가 있어서 파싱이 안 되는 경우가 허다했죠.<br /><br />
하지만 다행히도 이 문제는 거의 해결되었습니다.<br /><br />
최신 모델들은 대부분 '구조화된 출력(Structured Outputs)' 기능을 지원하는데요.<br /><br />
이건 우리가 원하는 데이터 구조를 클래스로 미리 정의해두면, LLM이 그 구조에 딱 맞춰서 JSON을 생성해주는 기능입니다.<br /><br />
예를 들어 파이썬의 Pydantic 라이브러리로 이렇게 클래스를 정의할 수 있죠.<br /><br />

```python
from vertexai.generative_models import GenerativeModel, Part, Tool
import vertexai.generative_models as generative_models

class Recipe(generative_models.Tool):
    """A class representing a recipe."""
    name: str
    description: str
    ingredients: list[str]
```

'Recipe'라는 클래스를 만들고, 이름(name), 설명(description), 재료(ingredients) 필드를 정의했습니다.<br /><br />
그리고 LLM을 호출할 때 이 클래스를 출력 스키마로 지정해주면 되는 거예요.<br /><br />

```python
# ... (앞부분 생략)
response = model.generate_content(
    "Some popular cookie recipes",
    tools=[Recipe], # 우리가 정의한 Recipe 클래스를 도구로 지정
)
```

이렇게 하면 LLM은 우리가 정의한 'Recipe' 클래스 구조를 완벽하게 따르는 JSON을 생성해줍니다.<br /><br />
덕분에 이제 출력 형식이 깨질 걱정은 안 해도 되죠.<br /><br />

## 진짜 문제는 내용의 '질'을 측정하는 것

형식은 해결됐지만, 내용의 질은 어떻게 측정할까요?<br /><br />
이때 사용하는 것이 바로 'LLM 평가 프레임워크'입니다.<br /><br />
구글 클라우드에는 'Vertex AI Evaluation Service'가 있고, 오픈소스로는 'DeepEval', 'Ragas', 'Promptfoo' 같은 것들이 있는데요.<br /><br />
이런 프레임워크들은 다양한 '평가 지표(Metrics)'를 제공합니다.<br /><br />
그런데 이 지표들이 또 두 가지 종류로 나뉘더라고요.<br /><br />

### 1. 통계 기반의 결정론적 지표 (Statistical/Deterministic Metrics)

이건 아주 단순하고 고전적인 방식입니다.<br /><br />
LLM이 생성한 텍스트와 우리가 미리 준비한 '정답' 텍스트를 비교해서 점수를 매기는 거죠.<br /><br />
예를 들어 'BLEU'나 'ROUGE' 같은 점수가 여기에 해당합니다.<br /><br />
발표자가 보여준 예시를 한번 볼까요?<br /><br />

```python
# ... (데이터셋 설정)
responses = ["hello how are you", "I'm good", "the cat lay on the mat"]
references = ["hello how are you", "I am good", "the cat sat on the mat"]

# ... (평가 실행)
# 결과:
# 1. hello how are you vs hello how are you -> exact_match: 1.0, bleu: 1.0, rougeL: 1.0
# 2. I'm good vs I am good -> exact_match: 0.0, bleu: 0.18, rougeL: 0.66
# 3. the cat lay on the mat vs the cat sat on the mat -> exact_match: 0.0, bleu: 0.48, rougeL: 0.83
```

첫 번째 예시는 완벽하게 일치하니까 모든 점수가 1.0으로 나왔습니다.<br /><br />
하지만 두 번째를 보세요.<br /><br />
"I'm good"과 "I am good"은 사람이 보기엔 완전히 똑같은 의미인데요.<br /><br />
정확히 일치하지 않는다는 이유로 'exact_match'는 0점, 'BLEU' 점수도 18%로 처참하게 나왔죠.<br /><br />
세 번째 예시 "lay(누웠다)"와 "sat(앉았다)"는 의미가 살짝 다르지만, 'ROUGE' 점수는 83%나 됩니다.<br /><br />
이처럼 통계 기반 지표들은 언어의 미묘한 의미 차이를 전혀 잡아내지 못하는 한계가 명확하죠.<br /><br />

### 2. 모델 기반 평가 지표 (Model-based Metrics)

그래서 등장한 것이 바로 '모델 기반 평가'입니다.<br /><br />
이건 다른 LLM을 '심판'으로 데려와서, 원래 LLM의 답변을 평가하게 만드는 방식인데요.<br /><br />
"한 LLM을 다른 LLM으로 평가하는 걸 믿을 수 있나?" 하는 의문이 들 수 있죠.<br /><br />
그런데 한 연구에 따르면, 명확한 평가 기준과 채점 방식을 제공하면 심판 LLM이 내리는 평가가 인간과 약 80% 수준으로 일치한다고 하더라고요.<br /><br />
꽤 신뢰할 만한 수준입니다.<br /><br />
발표자는 'Promptfoo'와 'DeepEval' 두 가지 프레임워크를 예시로 보여줬습니다.<br /><br />
'Promptfoo'는 YAML 파일에 평가 케이스를 정의하는 방식인데요.<br /><br />

```yaml
# promptfoo 예시
# ...
tests:
  - description: '런던 날씨에 대한 유사성 검사'
    vars:
      input: '런던 날씨는 보통 어때?'
    assert:
      - type: 'similar'
        value: '온화하고 비가 많이 와'
        threshold: 0.7 # 70% 이상 유사해야 통과
```

런던 날씨를 물었을 때 "온화하고 비가 많이 와(mild and rainy)"라는 의미와 70% 이상 유사한 답변이 나와야 테스트를 통과시킨다는 규칙입니다.<br /><br />
'DeepEval'은 파이썬 코드로 유닛 테스트처럼 작성할 수 있어서 개발자에게 더 친숙하더라고요.<br /><br />

```python
# deepeval 예시
from deepeval import assert_test
from deepeval.metrics import AnswerRelevancyMetric
from deepeval.test_case import LLMTestCase

# ... (모델 설정)

prompt = "Why is the sky blue?"
output = llm.get_response(prompt) # LLM으로부터 답변 받기

test_case = LLMTestCase(input=prompt, actual_output=output)
metric = AnswerRelevancyMetric(threshold=0.8) # 질문과 답변의 관련성이 80% 이상이어야 함

assert_test(test_case, [metric])
```

"하늘은 왜 파래?"라는 질문에 대한 답변이 질문의 의도와 얼마나 관련이 있는지를 측정하는 코드입니다.<br /><br />
이렇게 하면 단순히 키워드가 일치하는지를 넘어, 의미적인 '관련성'을 평가할 수 있게 되죠.<br /><br />

## RAG 시스템은 어떻게 평가할까?

요즘 LLM 애플리케이션의 대세는 'RAG(Retrieval-Augmented Generation)'인데요.<br /><br />
이건 우리 회사의 내부 문서나 PDF 같은 데이터를 LLM에게 '참고 자료'로 줘서, 그 내용을 기반으로 답변하게 만드는 기술입니다.<br /><br />
RAG 시스템은 크게 두 부분으로 나뉩니다.<br /><br />
사용자 질문과 관련된 문서를 찾아오는 '검색(Retrieval)' 단계와, 찾아온 문서를 바탕으로 답변을 생성하는 '생성(Generation)' 단계죠.<br /><br />
그래서 평가도 이 두 단계를 나눠서 해야 합니다.<br /><br />
하지만 좀 더 실용적으로는 'RAG 트라이어드(RAG Triad)'라는 세 가지 지표를 통해 시스템 전체를 한 번에 평가하는 방법이 많이 쓰이더라고요.<br /><br />
1.  **Context Relevance (문맥 관련성)**: 질문에 대해 찾아온 문서(context)가 얼마나 관련이 있는가?
2.  **Groundedness/Faithfulness (근거 충실성)**: LLM의 답변이 주어진 문서 내용에 얼마나 충실하게 기반하고 있는가? (환각 방지)
3.  **Answer Relevance (답변 관련성)**: 최종 답변이 사용자의 원래 질문과 얼마나 관련이 있는가?

이 세 가지를 측정하면 우리 RAG 시스템이 얼마나 잘 작동하는지 꽤 정확하게 파악할 수 있습니다.<br /><br />
물론 'DeepEval' 같은 프레임워크에서 이 지표들을 모두 제공하죠.<br /><br />

## 에이전트와 도구 평가는 더 복잡하죠

최근에는 LLM이 단순히 텍스트만 생성하는 것을 넘어, 외부 API를 호출하는 '도구(Tool)'를 사용하거나 여러 도구를 조합해 복잡한 작업을 수행하는 '에이전트(Agent)'로 발전하고 있습니다.<br /><br />
이런 시스템은 평가하기가 한층 더 까다로운데요.<br /><br />
예를 들어, "런던 날씨 알려줘"라는 요청을 처리하는 에이전트는 다음과 같은 단계를 거칠 거예요.<br /><br />
1.  '런던'이라는 위치를 위도/경도로 변환하는 `location_to_latlon` 도구를 호출한다.<br /><br />
2.  받아온 위도/경도 값으로 날씨 정보를 조회하는 `latlon_to_weather` 도구를 호출한다.<br /><br />
이때 우리는 "정확한 순서로, 올바른 인자 값을 가지고 도구들이 호출되었는가?"를 검증해야 합니다.<br /><br />
이런 도구 호출의 순서와 흐름을 '궤적(Trajectory)'이라고 부르는데요.<br /><br />
이 궤적이 우리가 의도한 대로 흘러갔는지를 측정하는 지표들이 필요하게 되는 거죠.<br /><br />

## 보안은 아무리 강조해도 지나치지 않습니다

마지막으로, 성능만큼이나 중요한 것이 바로 '보안'입니다.<br /><br />
사용자가 악의적인 프롬프트를 입력해서 시스템을 속이거나, LLM이 개인정보 같은 민감한 내용을 유출하면 큰일 나니까요.<br /><br />
발표자는 'Promptfoo'와 'LLM Guard'라는 두 가지 보안 프레임워크를 소개했습니다.<br /><br />
'Promptfoo'는 '레드팀 테스트' 기능을 제공하는데요.<br /><br />
마치 해커처럼 시스템의 취약점을 공격하는 테스트 케이스를 자동으로 생성해서 실행해 줍니다.<br /><br />
예를 들어 개인정보 유출을 유도하는 프롬프트, 시스템 설정을 탈취하려는 프롬프트 등을 자동으로 만들어 우리 시스템이 잘 방어하는지 테스트해 주는 거죠.<br /><br />
'LLM Guard'는 우리 애플리케이션과 LLM 사이에 위치하는 일종의 방화벽입니다.<br /><br />
사용자 입력(Input)과 LLM의 출력(Output)을 중간에서 가로채서 검사하는 역할을 하는데요.<br /><br />
예를 들어 사용자가 프롬프트에 코드를 삽입하면 차단하거나, '정치' 같은 특정 주제의 대화를 금지할 수 있습니다.<br /><br />
특히 유용한 기능은 '익명화(Anonymize)' 기능이더라고요.<br /><br />
사용자가 "내 이름은 홍길동, 이메일은 gildong@example.com이야. 이 정보로 SQL insert 문을 만들어줘"라고 요청했다고 해보죠.<br /><br />
이 개인정보를 그대로 LLM에게 보내는 건 위험합니다.<br /><br />
이때 'LLM Guard'가 중간에서 이름과 이메일을 `[PERSON]`, `[EMAIL_ADDRESS]` 같은 토큰으로 바꾼 뒤 LLM에게 전달하는 거죠.<br /><br />
LLM은 이 토큰을 이용해 SQL 문을 생성해서 돌려주고, 'LLM Guard'는 다시 이 토큰을 원래의 개인정보로 복원해서 최종 사용자에게 보여줍니다.<br /><br />
이렇게 하면 민감한 정보가 LLM 서버로 넘어가지 않으니 훨씬 안전해지겠죠.<br /><br />

## 마무리하며

LLM을 사용하는 것은 쉽지만, '잘' 사용하는 것은 전혀 다른 차원의 문제입니다.<br /><br />
프로덕션 환경에서 안정적으로 LLM 애플리케이션을 운영하려면, 오늘 살펴본 것처럼 출력물의 품질을 정량적으로 '측정'하고, 잠재적인 보안 위협을 체계적으로 '방어'하는 과정이 반드시 필요하거든요.<br /><br />
이 분야는 아직도 빠르게 발전하고 있지만, 오늘 소개된 프레임워크와 개념들이 훌륭한 출발점이 되어줄 거라고 생각합니다.<br /><br />
이 글이 여러분의 LLM 애플리케이션을 한 단계 더 발전시키는 데 도움이 되었으면 좋겠습니다.<br /><br />
