---
slug: 2025-08-27-building-excel-formula-engine-with-typescript-from-scratch
title: 타입스크립트로 Excel 수식 엔진 직접 만들기 (ANTLR, 스택 VM)
date: 2025-08-31 05:12:09.007000+00:00
summary: 수천 개의 의존성을 가진 복잡한 Excel 수식이 느려지는 문제를 해결하기 위해, 타입스크립트를 이용해 파싱부터 실행까지 직접 수식 엔진을 만들어 본 경험을 공유합니다. ANTLR, 역폴란드 표기법(RPN), 스택 VM의 원리를 파헤쳐 봅니다.
tags: ["타입스크립트", "Excel", "수식 엔진", "ANTLR", "역폴란드 표기법", "스택 VM", "컴파일러"]
contributors: []
draft: false
---

안녕하세요, 여러분.<br /><br /> 오늘은 좀 재미있는 주제를 가져왔는데요.<br /><br /> 바로 타입스크립트로 'Excel 수식 엔진'을 처음부터 끝까지 만들어보는 여정입니다.<br /><br />
'굳이 그걸 왜 만들어?' 싶으실 수도 있거든요.<br /><br /> 저희가 개발하는 서비스 중 하나가 Excel 파일을 그대로 웹에서 사용할 수 있게 해주는 기능인데, 셀 참조나 수식의 의존성이 5,000개를 넘어가는 순간 엄청나게 느려지는 문제가 있었습니다.<br /><br />
기존에는 `math.js` 같은 라이브러리를 사용해 수식을 계산했는데요.<br /><br /> 유연성은 정말 좋지만, 계산할 때마다 매번 수식을 분석하고 평가하는 방식이라 어쩔 수 없는 성능 저하가 있었습니다.<br /><br />
이 문제를 해결하려면 결국 계산 한 번 한 번의 속도를 올리는 수밖에 없다는 결론에 이르렀거든요.<br /><br /> 그래서 직접 수식 엔진을 만들기로 결심했고, 그 결과는 놀라웠습니다.<br /><br /> 무려 '100배'나 빨라졌으니까요.<br /><br />
그런데 만들다 보니 이 과정이 마치 하나의 작은 프로그래밍 언어를 설계하는 것 같아 너무 흥미로웠는데요.<br /><br /> 오늘은 그 핵심 원리를 사칙연산과 `IF` 함수를 예로 들어 최대한 쉽게 풀어보려고 합니다.<br /><br />

## 전체 그림 그려보기

가장 먼저 전체적인 동작 흐름부터 살펴보는 게 좋겠네요.<br /><br /> 우리가 만들 수식 엔진은 크게 세 가지 단계를 거쳐 동작하는데요.<br /><br />

1.  **구문 분석 (Parsing)**: `ANTLR`라는 도구를 사용해서 "=A1+B1*2" 같은 수식 문자열을 컴퓨터가 이해할 수 있는 '구문 트리(Parse Tree)' 구조로 변환합니다.<br /><br />
2.  **RPN 변환 (Conversion)**: 이 구문 트리를 '역폴란드 표기법(RPN)'이라는 특별한 형태로 바꾸어 중간 표현(IR)을 생성합니다.<br /><br />
3.  **실행 (Execution)**: 마지막으로 '스택 가상 머신(Stack VM)'이 이 RPN 코드를 읽어서 최종 결과값을 계산해냅니다.<br /><br />

말로만 들으면 조금 복잡하게 느껴질 수 있는데요.<br /><br /> 아래 그림을 보시면 바로 감이 오실 겁니다.<br /><br />

```
"=A1+B1*2"  (수식 문자열)
     ↓
[구문 분석기 ANTLR]  →  문자열을 조각내고(토큰화) 구조를 파악
     ↓
       [+] (구문 트리)
      /   \
   [A1]   [*]
          / \
       [B1] [2]
     ↓
[RPN 변환기]  →  컴퓨터가 계산하기 쉬운 순서로 재배열
     ↓
   RPN: ["A1", "B1", "2", "*", "+"]
     ↓
[스택 VM 실행]  →  스택에 값을 쌓아가며 순서대로 계산
     ↓
   [10] [3] [2]  →  [10] [6]  →  [16]
     ↓
   결과: 16
```

기존 `math.js`가 수식 문자열을 받아서 바로 해석하고 실행하는 '인터프리터' 방식이었다면, 이번에 저희가 만든 건 미리 계산 가능한 형태로 번역해두는 '컴파일러' 방식에 가깝습니다.<br /><br /> 이렇게 한 단계 거치는 게 오히려 실행 속도를 극적으로 끌어올리는 비결이거든요.<br /><br />
자, 그럼 이제 각 단계를 하나씩 자세히 들여다볼 시간입니다.<br /><br />

## 1단계 구문 분석 ANTLR로 언어의 뼈대 세우기

첫 단계는 수식이라는 문자열을 컴퓨터가 이해할 수 있는 구조로 만들어주는 '구문 분석'인데요.<br /><br /> 저희는 이 작업을 위해 `ANTLR`라는 아주 강력한 '파서 생성기'를 활용했습니다.<br /><br />
ANTLR는 '언어의 문법'을 미리 정의해두면, 그 문법에 맞춰 문자열을 분석하는 '어휘 분석기(Lexer)'와 '구문 분석기(Parser)' 코드를 자동으로 만들어주는 도구거든요.<br /><br /> 마치 언어의 '청사진'을 그려주는 것과 같습니다.<br /><br />
아래가 바로 사칙연산, `SUM`, `IF` 함수, 그리고 셀 참조를 처리하기 위해 저희가 정의한 문법 파일(`Formula.g4`)의 일부인데요.<br /><br /> 처음 보면 낯설 수 있지만, 아래쪽부터 읽어 올라가면 이해하기 훨씬 수월합니다.<br /><br />

```sh
// Formula.g4: 사칙연산, SUM, IF, 셀 참조 문법 정의
grammar Formula;

// 시작 규칙: 수식은 등호(=)로 시작할 수도 있고, 표현식(expr)으로 구성됨
formula: EQ? expr EOF;

// 표현식 규칙: 덧셈/뺄셈 식에 비교 연산자가 붙는 형태
expr: additiveExpr ( (GT | LT | GTEQ | LTEQ | EQ | NEQ) additiveExpr )?;

// 덧셈/뺄셈 규칙: 덧셈/뺄셈 식 뒤에 곱셈/나눗셈 식이 오거나, 곱셈/나눗셈 식만 올 수 있음
additiveExpr
    : additiveExpr (PLUS | MINUS) multiplicativeExpr
    | multiplicativeExpr
    ;

// 곱셈/나눗셈 규칙: 곱셈/나눗셈 식 뒤에 단항 식이 오거나, 단항 식만 올 수 있음
multiplicativeExpr
    : multiplicativeExpr (MUL | DIV) unaryExpr
    | unaryExpr
    ;

// ... (중략) ...

// ===== Lexer 규칙들 (토큰 정의) =====
IF  : [Ii] [Ff] ; // 'IF' 또는 'if'는 IF 토큰
SUM : [Ss] [Uu] [Mm] ; // 'SUM' 또는 'sum'은 SUM 토큰

EQ   : '=' ;      // '='는 EQ 토큰
PLUS : '+' ;      // '+'는 PLUS 토큰
MUL  : '*' ;      // '*'는 MUL 토큰

CELL_REF : [A-Z]+ [1-9][0-9]* ; // 'A1', 'B12' 등은 CELL_REF 토큰
NUMBER   : [0-9]+ ('.' [0-9]+)? ; // 숫자는 NUMBER 토큰

WS : [ \t\r\n]+ -> skip ; // 공백은 무시
```

여기서 정말 중요한 부분이 바로 `additiveExpr`와 `multiplicativeExpr` 규칙인데요.<br /><br /> `additiveExpr` 규칙 안에 `multiplicativeExpr`가 포함된 구조로 정의함으로써, 곱셈/나눗셈이 덧셈/뺄셈보다 '연산자 우선순위'가 높다는 것을 자연스럽게 표현한 겁니다.<br /><br />
이 문법 파일을 빌드하면 `FormulaParser`, `FormulaVisitor` 등의 클래스가 생성되거든요.<br /><br /> 이제 이 클래스들을 이용해서 실제 파싱을 진행하는 코드를 한번 보시죠.<br /><br />

```typescript
import { CharStream, CommonTokenStream } from "antlr4";
import FormulaLexer from "./antlr/generated/FormulaLexer";
import FormulaParser from "./antlr/generated/FormulaParser";

// ...

// 1. 수식 문자열을 입력 스트림으로 만듭니다.
const inputStream = new CharStream(formula);

// 2. Lexer가 문자열을 토큰 단위로 쪼갭니다. ("=", "A1", "+", "B1", ...)
const lexer = new FormulaLexer(inputStream);
const tokenStream = new CommonTokenStream(lexer);

// 3. Parser가 토큰 스트림을 읽어 구문 트리를 생성합니다.
const parser = new FormulaParser(tokenStream);
const tree = parser.formula();

// 이제 'tree'라는 결과물을 가지고 다음 단계로 넘어갑니다.
```

이렇게 해서 얻은 `tree` 객체가 바로 저희가 원했던 '구문 분석 트리'인데요.<br /><br /> 이제 이 트리를 컴퓨터가 계산하기 가장 좋은 형태인 '역폴란드 표기법(RPN)'으로 변환할 차례입니다.<br /><br />

## 2단계 RPN 변환 계산을 위한 최적의 레시피 만들기

'역폴란드 표기법', 줄여서 RPN은 연산자를 숫자 뒤에 놓는 표기법을 말하는데요.<br /><br /> 예를 들어 `10 + (20 * 30)` 이라는 수식은 RPN으로 바꾸면 `10 20 30 * +` 가 됩니다.<br /><br />
굳이 이렇게 복잡하게 바꾸는 이유가 있거든요.<br /><br /> 바로 RPN이 '스택(Stack)' 자료구조를 이용해서 계산하기에 정말 완벽한 형태이기 때문입니다.<br /><br /> 앞에서부터 순서대로 읽다가 숫자는 스택에 넣고, 연산자를 만나면 스택에서 숫자 두 개를 꺼내 계산한 뒤 다시 결과를 넣기만 하면 되거든요.<br /><br /> 복잡한 괄호나 연산자 우선순위를 전혀 신경 쓸 필요가 없어지는 겁니다.<br /><br />
이 변환 작업은 ANTLR가 만들어준 `Visitor` 패턴을 사용하면 아주 우아하게 구현할 수 있는데요.<br /><br /> 구문 트리의 각 노드(덧셈 노드, 숫자 노드 등)를 방문하면서 RPN 토큰을 차곡차곡 쌓아나가는 방식입니다.<br /><br />

```typescript
// FormulaToRPNConverter.ts

export class FormulaToRPNConverter extends FormulaVisitor<void> {
  private tokens: RPNToken[] = [];
  private dependencies: Set<string> = new Set();

  // ...

  // 덧셈/뺄셈 노드를 방문했을 때 호출됩니다.
  visitAdditiveExpr = (ctx: AdditiveExprContext): void => {
    const additiveExpr = ctx.additiveExpr();
    const multiplicativeExpr = ctx.multiplicativeExpr();

    if (additiveExpr && multiplicativeExpr) {
      // 1. 왼쪽 식을 먼저 방문해서 처리합니다. (재귀 호출)
      this.visit(additiveExpr);
      // 2. 오른쪽 식을 방문해서 처리합니다.
      this.visit(multiplicativeExpr);

      // 3. 마지막으로 연산자 토큰을 추가합니다.
      if (ctx.PLUS()) {
        this.tokens.push({ type: TokenType.ADD });
      } else if (ctx.MINUS()) {
        this.tokens.push({ type: TokenType.SUBTRACT });
      }
    } else if (multiplicativeExpr) {
      this.visit(multiplicativeExpr);
    }
  };

  // 셀 참조 노드를 방문했을 때
  visitCellRef = (ctx: CellRefContext): void => {
    const ref = ctx.getText();
    this.dependencies.add(ref); // 의존성 목록에 추가
    this.tokens.push({ type: TokenType.CELL_REF, value: ref });
  };

  // 숫자 노드를 방문했을 때
  visitNumberExpr = (ctx: NumberExprContext): void => {
    const value = parseFloat(ctx.getText());
    this.tokens.push({ type: TokenType.NUMBER, value });
  };

  // ...
}
```

`visitAdditiveExpr`를 보시면, 왼쪽과 오른쪽 자식 노드를 먼저 `visit`하고 마지막에 연산자를 추가하는 것을 볼 수 있는데요.<br /><br /> 이런 '후위 순회(Post-order traversal)' 방식이 바로 구문 트리를 RPN으로 변환하는 핵심 원리입니다.<br /><br />

### IF 함수 단순한 함수를 넘어선 제어문

RPN 변환 과정에서 가장 흥미로운 부분은 바로 `IF` 함수 처리인데요.<br /><br /> `IF(조건, 참일_때_값, 거짓일_때_값)`은 단순히 값을 계산하는 걸 넘어서 프로그램의 '흐름을 제어'해야 하기 때문입니다.<br /><br />
만약 조건이 `참`이라면 '거짓일_때_값' 부분은 아예 계산조차 하지 않는 게 효율적이거든요.<br /><br /> 이걸 구현하기 위해 저희는 '점프(JUMP)'라는 특별한 명령어를 도입했습니다.<br /><br />

```typescript
// visitIfFunction의 일부

visitIfFunction = (ctx: IfFunctionContext): void => {
  // ...

  // 1. 조건식을 먼저 평가하도록 RPN 토큰을 생성합니다.
  this.visit(exprs[0]);

  // 2. '조건이 거짓이면 점프하라'는 명령어를 일단 넣어둡니다. (목적지는 미정)
  const jumpToElseIndex = this.tokens.length;
  this.tokens.push({ type: TokenType.JUMP_IF_FALSE, offset: 0 });

  // 3. '참일_때_값'에 대한 RPN 토큰을 생성합니다.
  this.visit(exprs[1]);

  // 4. '참' 브랜치 실행 후 '거짓' 브랜치를 건너뛸 '무조건 점프' 명령어를 넣습니다.
  const jumpToEndIndex = this.tokens.length;
  this.tokens.push({ type: TokenType.JUMP, offset: 0 });

  // 5. '거짓' 브랜치가 시작될 위치를 기록합니다.
  const elseStartIndex = this.tokens.length;

  // 6. '거짓일_때_값'에 대한 RPN 토큰을 생성합니다.
  this.visit(exprs[2]);

  // 7. 이제 모든 위치가 정해졌으니, 아까 넣어뒀던 점프 명령어들의 목적지(offset)를 채워줍니다.
  this.tokens[jumpToElseIndex].offset = elseStartIndex - jumpToElseIndex - 1;
  this.tokens[jumpToEndIndex].offset = this.tokens.length - jumpToEndIndex - 1;
}
```

조금 복잡해 보이지만 핵심은 간단한데요.<br /><br /> `JUMP_IF_FALSE`는 조건식의 결과가 `거짓`일 때 특정 위치로 실행 순서를 건너뛰게 만드는 명령어입니다.<br /><br /> 덕분에 불필요한 계산을 원천적으로 차단할 수 있었고, 이게 성능 향상에 아주 큰 도움이 됐습니다.<br /><br />
자, 이제 계산을 위한 완벽한 레시피, RPN 토큰들이 준비되었습니다.<br /><br /> 마지막으로 이 레시피를 요리할 주방장, '스택 VM'을 만나볼 차례입니다.<br /><br />

## 3단계 실행 스택 VM으로 최종 결과값 계산하기

스택 VM은 RPN 토큰을 실행하기 위해 만든 아주 작은 가상 머신인데요.<br /><br /> 세상에서 가장 단순한 계산기라고 생각하시면 편합니다.<br /><br /> 이 계산기가 가진 건 값을 임시로 저장하는 '스택'과, 다음에 실행할 명령어를 가리키는 '프로그램 카운터(PC)'가 전부이거든요.<br /><br />
동작 원리는 정말 간단합니다.<br /><br /> 프로그램 카운터를 하나씩 증가시키면서 RPN 토큰을 순서대로 읽고, 토큰의 종류에 따라 정해진 작업을 수행할 뿐입니다.<br /><br />

```typescript
// StackVM.ts

export class StackVM {
  private stack: unknown[] = [];
  private pc = 0; // 프로그램 카운터

  evaluate(tokens: RPNToken[], context: EvaluationContext): unknown {
    this.stack = [];
    this.pc = 0;

    while (this.pc < tokens.length) {
      const token = tokens[this.pc];

      switch (token.type) {
        case TokenType.NUMBER:
          this.stack.push(token.value);
          break;

        case TokenType.CELL_REF:
          // context에서 셀 값을 가져와 스택에 넣습니다.
          const value = context.dependencies.get(token.value as string);
          this.stack.push(value);
          break;

        case TokenType.ADD:
          const b = this.popNumber();
          const a = this.popNumber();
          this.stack.push(a + b);
          break;
        
        // ... 다른 연산자들도 비슷하게 처리 ...

        case TokenType.JUMP_IF_FALSE:
          const condition = this.stack.pop();
          if (!condition) {
            // 조건이 거짓이면 프로그램 카운터를 offset만큼 점프시킵니다.
            this.pc += token.offset;
          }
          break;
        
        case TokenType.JUMP:
          this.pc += token.offset;
          break;
      }

      this.pc++; // 다음 명령어로 이동
    }

    return this.stack[0]; // 최종 결과는 스택에 남은 마지막 값
  }
}
```
`IF(A1 > 1, 1+1, 2+2)` 수식을 `A1=0` (거짓) 조건으로 실행하는 과정을 한번 따라가 볼까요?<br /><br />

1.  `A1` 값(0)과 `1`을 스택에 넣고, `GREATER_THAN` 연산자로 비교합니다.<br /><br /> 결과는 `false`가 되고, 이 값이 스택에 들어갑니다.<br /><br />
2.  다음 명령어는 `JUMP_IF_FALSE`인데요.<br /><br /> 스택에서 `false`를 꺼내보고, 조건이 거짓이므로 프로그램 카운터(PC)를 `offset` 만큼 점프시킵니다.<br /><br />
3.  점프한 결과 `1+1` 계산 로직은 완전히 건너뛰고, 곧바로 `2+2`를 계산하는 위치로 이동하게 됩니다.<br /><br />
4.  결국 `4`라는 최종 결과가 스택에 남게 되는 것이죠.<br /><br />

바로 이 점프 로직 덕분에 불필요한 연산을 건너뛸 수 있었던 겁니다.<br /><br />

## 여기서 한 걸음 더 나아간다면?

물론 오늘 만든 엔진은 핵심 원리를 보여주기 위한 간소화된 버전인데요.<br /><br /> 실제 Excel처럼 동작하려면 몇 가지 더 넘어야 할 산들이 있습니다.<br /><br />
`SUM(A1:B5)`처럼 셀 '범위'를 다루는 기능이나, `A1=B1`, `B1=A1`처럼 서로를 참조하는 '순환 참조' 오류를 감지하는 로직도 필요하거든요.<br /><br /> 특히 순환 참조는 계산을 시작하기 전에 의존성 그래프를 만들고 '위상 정렬(Topological Sort)'을 통해 찾아내는 과정이 필수적입니다.<br /><br />
`#DIV/0!`이나 `#NAME?` 같은 다양한 에러 처리 역시 실제 제품 수준에서는 아주 중요한 부분이고요.<br /><br />

## 마무리하며

오늘은 Excel 수식 엔진을 직접 만들어보면서 그 내부 동작 원리를 깊숙이 들여다봤는데요.<br /><br /> 문자열을 파싱해서 컴퓨터가 이해하는 구조로 만들고, 그걸 다시 가장 효율적인 실행 코드로 변환한 뒤, 가상 머신 위에서 실행하는 전체 과정이 정말 하나의 언어 컴파일러를 만드는 축소판 같았습니다.<br /><br />
특히 기존 `math.js`에서는 구현하기 까다로웠던 `IF` 함수의 조건부 실행을 점프 명령어로 깔끔하게 구현했을 때 개인적으로 정말 뿌듯했거든요.<br /><br />
이번 프로젝트를 진행하면서 AI의 도움도 정말 많이 받았는데요.<br /><br /> 이런 이론이 잘 정립된 분야는 AI가 정말 초안 코드를 빠르게 잘 짜주는 것 같습니다.<br /><br /> 물론 AI가 준 코드가 한 번에 완벽하게 돌아가지는 않기 때문에, 그걸 이해하고 디버깅하며 우리 시스템에 맞게 수정하는 개발자의 역할은 여전히, 그리고 앞으로도 중요할 거라는 생각을 다시 한번 하게 됐습니다.<br /><br />
이번 이야기가 프로그래밍 언어의 동작 원리나 컴파일러에 관심 있는 분들께 작은 재미와 영감을 드렸으면 좋겠네요.<br /><br />
