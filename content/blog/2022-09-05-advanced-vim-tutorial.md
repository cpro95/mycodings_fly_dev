---
slug: 2022-09-05-advanced-vim-tutorial
title: 고급 VIM 강좌 with VIM Text Objects
date: 2022-09-05 06:26:54.536000+00:00
summary: VIM Text Objects를 활용한 고급 VIM 강좌
tags: ["vim"]
contributors: []
draft: false
---

안녕하세요?

오늘은 VIM의 기초와 함께 VIM Text Objects를 사용한 VIM 고급 기술에 대해 알아보겠습니다.

VIM의 명령어는 다음과 같은 형태로 이루어져 있습니다.

`<number><command><text object or motion>`

제일 처음에 있는 number는 명령어의 횟수를 의미하고,

두 번째 command는 행위의 주체 즉, 명령어 자체를 나타내고,

마지막 형태인 text object or motion이 오늘 우리가 배울 내용입니다.

예를 들어 3줄을 삭제하고 싶으면 '3dd'라고 입력하면 세줄이 삭제되는데요.

'3dd'의 각각이 위에서 얘기한 number, command, text object or motion입니다.

그럼 VIM에서 말하는 Text Objects에 대해 더 알아보겠습니다.

### Words

단어 단위의 작업을 할 때 쓰는 Text Objects입니다.

- aw - 한 개의 단어(단어 앞 뒤의 공백 문자 포함)
- iw - 한 개의 단어(단어 앞 뒤의 공백 문자 미포함)

w는 words를 나타내는 약자이고, a와 i가 궁금할 건데요.

a는 around라고 생각하시면 되고, i는 inner라고 생각하시면 됩니다.

a는 around로써 단어 앞 뒤의 공백 문자를 포함하고, i는 inner로써 공백 문자를 미포함한다고 생각하시면 됩니다.

aw와 iw를 언제 쓰냐면 아래와 같이 예를 들어 알아보겠습니다.

```html
Lorem ipsum dolor sit amet...
```

위와 같은 상태에서 우리가 ipsum이라는 단어를 삭제하고 싶으면 "d"라는 명령어를 사용합니다.

보통은 "dw" = "delete word"라는 명령어를 쓰죠.

근데, 고급 VIM 기술에는 "daw"와 "diw" 명령어를 쓸 수 있습니다.

![mycodings.fly.dev-advanced-vim-tutorial](https://blogger.googleusercontent.com/img/a/AVvXsEg4s5Wf-5uIaDyRDYPvheanAHBBGOxpfX3xMpquzL_b5JWkMGdyEYtVbHcq89J5H6Lpy-q6fOIYE5N1ePfLFCqavxwaOupzauDhr_P6D-BHlZEer3mFyDBNWX8pNtSNuW_Dxogd2VqSzpT2Rt3NxfK0jAN1r_Z7tNUdxrccXPNoHaYr_wrcCfvaDNyn)

위 GIF 그림에서 보시면 ipsum 단어의 "s"자에 커서를 놓은 상태에서 "daw" 명령어를 쳤습니다.

그러면 delete word 명령어가 delete around word 명령어가 되는 거죠.

그래서 단어 앞 뒤로 여백까지 delete가 되었습니다.

그럼 "diw" 명령어로 삭제하면 어떻게 될까요?

아래 그림을 보십시오.

![mycodings.fly.dev-advanced-vim-tutorial](https://blogger.googleusercontent.com/img/a/AVvXsEh_wAoNENVYjesxkXyCz7O98qP1O88eewdVNUXuIDhReyQxSmoxsbrH8HBYqzJR0zQzlUV0lSk1ywMTKFHvfb5SuOqR47BJ7KXDqarXYZoPGaEt9suzRPt6f37Z9WhBfpWZEGMEk_7lmZtf2QQeVPlsvpXBhb91P9g_yPvLJUMxx3NFKONsp5kxGeH8)

"diw" 명령어를 입력하면 "delete inner word"가 되어 ipsum 단어의 앞뒤 공백은 그대로 나 두고 단어만 삭제되었습니다.

이제 VIM에서 말하는 Text Objects에 대해 조금은 이해가 되셨는지요?

Vim의 Text Objects는 word 말고 다른 것도 많습니다.

두 번째로, Sentences가 있는데요.

- as - 한 문장(Sentence)인데 앞뒤 공백 포함
- is - 한 문장(Sentence)인데 앞뒤 공백 미포함

Sentence에도 똑같이 적용됩니다.

![mycodings.fly.dev-advanced-vim-tutorial](https://blogger.googleusercontent.com/img/a/AVvXsEjfqGPtLTNp7rPPPEaMQt6CIbnNoxiwgwlQmNL5CHInNJmNK2hwzuuUwRBQXJe7sbWQ1A0Dy4PU44szBBNDasitYx2euFMLN82p1DVJOphEUBiGOtAzHVHEBqdZAdLiGTWGlEN0tPrcfvU_LhfnF-CyG3ND3n2hJuZBZuwv_fZ3zKp-aliI_xsgpwci)

위 GIF 그림을 보시면 "das" 명령어를 입력하고 그다음 undo 명령어를 실행했고, 마지막으로 "dis" 명령어를 실행한 결과입니다.

앞뒤 공백을 포함하느냐, 안 하느냐가 차이인 겁니다.

세 번째로, Paragraphs가 있습니다.

- ap - 한 단락(paragraphs)인데 앞뒤 공백 포함
- ip - 한 단락(paragraphs)인데 앞뒤 공백 미포함

"dap" 명령어와 "dip" 명령어의 차이는 그림을 따로 보여주지 않아도 쉽게 그 차이를 이해할 수 있을 겁니다.

### 프로그래밍 언어에도 적용

VIM은 프로그래밍 언어에서도 사용할 수 있는 Text Objects를 제공해 주는데요.

- a"
- i"
- a'
- i'
- a`
- i`

around의 'a'와 inner의 'i'에 대해서 각각 더블 쿼트(""), 싱글 쿼트(''), 백 틱(``)을 제공해 줍니다.

만약에 아래와 같은 코드가 있다고 하면,

```js
puts 'Hello "World"'
```

커서를 World 단어 안에 높인 상태에서 World를 고치고 싶고, 더블 쿼트("")는 그대로 두고 싶다면 아래와 같이

ci"라고 입력하면 됩니다.

`ci"`의 뜻을 풀이해 보면 change inner ""라는 뜻입니다.

여기서 inner를 쓴 이유는 만약에 `ca"`라고 입력하면 around가 되기 때문에 ""까지 없어집니다.

그래서, 프로그래밍에서는 inner 명령어를 자주 씁니다.

만약에 `ci'`라고 싱글 쿼트를 입력해 주면 'Hello "World"'가 ''상태로 변하게 됩니다.

change inner ''라는 명령어이기 때문입니다.

이와 같은 형태의 명령어는 다음과 같이 괄호 중괄호, 대괄호 모두에도 적용됩니다.

- a)
- i)
- a}
- i}
- a]
- i]
- a[
- i[

```js
const arr = [1,2,3,4,5]
```
위와 같은 코드가 있을 때 [] 사이에 커서를 놓은 상태에서 "ci[" 또는 "ci]" 명령어를 입력하면 [] 안에 있는 게 다 지워진 상태에서 편집할 수 있는 상태가 됩니다.

### 마크업 랭귀지 태그에도 적용

VIM의 Text Objects는 HTML이나 JSX 같은 마크업 랭귀지에도 적용되는데요.

- at : 태그 블록 앞뒤 여백 포함
- it : 태그 블록 앞뒤 여백 미포함

만약에 다음과 같은 HTML 코드가 있다고 치면

```html
<h1>Test</h1>
```

이 상태에서 Test 부분만 고치고 싶으면 "cit"라고 입력하면 됩니다.

그러면 `<h1></h1>` 태그는 살아 있는 상태에서 안의 내용만 지워진 상태에서 편집할 수 있습니다.

그리고 `<h1>`자체를 지우고 다시 쓰려면 "cat"이라고 입력하면 됩니다.

마크업 랭귀지의 두 번째 활용으로 다음과 같이도 할 수 있습니다.

```js
- a> : 커서가 있는 쪽 한쪽 태그만 편집하는데 한쪽 태그를 다 지움
- i> : 커서가 있는 쪽 한쪽 태그만 편집하는데 브래킷은 유지
```

```js
<div id="content"></div>
```
첫 번째 태그 안에 커서를 위치해 둔 상태에서 "di>" 명령어를 치면 다음과 같이 됩니다.

```js
<></div>
```

지금까지 VIM의 고급 편집 기술에 대해 알아보았는데요.

"ci[" 같이 프로그래밍할 때 수정하기 쉬운 명령어인 "ci" 명령어를 꼭 외워두시면 훨씬 쉽게 코딩할 수 있을 겁니다.

--- 

참고로 아래 마크다운 자로는 제가 VIM 명령어가 헷갈릴 때 항상 찾아보는 Cheat Sheet입니다.

--- 

## VIM Cheat Sheet

```js
## Essentials
### Cursor movement (Normal/Visual Mode)
- h j k l - Arrow keys
- w / b - Next/previous word
- W / B - Next/previous word (space seperated)
- e / ge - Next/previous end of word
- 0 / $ - Start/End of line
- ^ - First non-blank character of line (same as 0w)

### Editing text
- i / a - Start insert mode at/after cursor
- I / A - Start insert mode at the beginning/end of the line
- o / O - Add blank line below/above current line
- Esc or Ctrl+[ - Exit insert mode
- d - Delete
- dd - Delete line
- c - Delete, then start insert mode
- cc - Delete line, then start insert mode

### Operators
- Operators also work in Visual Mode
- d - Deletes from the cursor to the movement location
- c - Deletes from the cursor to the movement location, then starts insert mode
- y - Copy from the cursor to the movement location
- > - Indent one level
- < - Unindent one level
- You can also combine operators with motions. Ex: d$ deletes from the cursor to the end of the line.

### Marking text (visual mode)
- v - Start visual mode
- V - Start linewise visual mode
- Ctrl+v - Start visual block mode
- Esc or Ctrl+[ - Exit visual mode

### Clipboard
- yy - Yank (copy) a line
- p - Paste after cursor
- P - Paste before cursor
- dd - Delete (cut) a line
- x - Delete (cut) current character
- X - Delete (cut) previous character
- d / c - By default, these copy the deleted text

### Exiting
- :w - Write (save) the file, but don’t quit
- :wq - Write (save) and quit
- :q - Quit (fails if anything has changed)
- :q! - Quit and throw away changes

### Search/Replace
- /pattern - Search for pattern
- ?pattern - Search backward for pattern
- n - Repeat search in same direction
- N - Repeat search in opposite direction
- :%s/old/new/g - Replace all old with new throughout file (gn is better though)
- :%s/old/new/gc - Replace all old with new throughout file with confirmations

### General
- u - Undo
- Ctrl+r - Redo

---

## Advanced
### Cursor movement
- Ctrl+d - Move down half a page
- Ctrl+u - Move up half a page
- } - Go forward by paragraph (the next blank line)
- { - Go backward by paragraph (the next blank line)
- gg - Go to the top of the page
- G - Go the bottom of the page
- : [num] [enter] - Go to that line in the document
- ctrl+e / ctrl+y - Scroll down/up one line

### Character search
- f [char] - Move forward to the given char
- F [char] - Move backward to the given char
- t [char] - Move forward to before the given char
- T [char] - Move backward to before the given char
- ; / , - Repeat search forwards/backwards

### Editing text
- J - Join line below to the current one
- r [char] - Replace a single character with the specified char (does not use Insert mode)

### Visual mode
- O - Move to other corner of block
- o - Move to other end of marked area

### File Tabs
- :e filename - Edit a file
- :tabe - Make a new tab
- gt - Go to the next tab
- gT - Go to the previous tab
- :vsp - Vertically split windows
- ctrl+ws - Split windows horizontally
- ctrl+wv - Split windows vertically
- ctrl+ww - Switch between windows
- ctrl+wq - Quit a window

### Marks
- Marks allow you to jump to designated points in your code.
- m{a-z} - Set mark {a-z} at cursor position
- A capital mark {A-Z} sets a global mark and will work between files
- '{a-z} - Move the cursor to the start of the line where the mark was set
- '' - Go back to the previous jump location

### Text Objects
- Say you have def (arg1, arg2, arg3), where your cursor is somewhere in the middle of the parenthesis.
- di( deletes everything between the parenthesis. That says “change everything inside the nearest parenthesis”. Without text objects, you would need to do T(dt).

### General
- . - Repeat last command
- Ctrl+r + 0 in insert mode inserts the last yanked text (or in command mode)
- gv - reselect (select last selected block of text, from visual mode)
- % - jumps between matching () or {}
```

--- 