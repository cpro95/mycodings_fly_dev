---
slug: 2024-02-15-understanding-go-xml
title: Go 언어 프로그래밍 공부 - XML 사용법
date: 2024-02-15 14:21:29.317000+00:00
summary: Go 언어의 XML 사용법을 정리해 보았습니다.
tags: ["go", "xml"]
contributors: []
draft: false
---

안녕하세요?

오늘은 Go 언어 공부중에 XML 관련 사용법을 정리해 보았습니다.

나중에 찾아볼 요령으로 공부한 내용 복습차원에서 블로그에 남겨 봅니다.

** 목 차 **

- [Go 언어 프로그래밍 공부 - XML 사용법](#go-언어-프로그래밍-공부---xml-사용법)
  - [기본적인 사용법](#기본적인-사용법)
  - [예제1: XML의 Marshal과 Unmarshal](#예제1-xml의-marshal과-unmarshal)
  - [구조체 필드 태그](#구조체-필드-태그)
  - [예제2: 다양한 구조체 필드 태그](#예제2-다양한-구조체-필드-태그)
  - [xml.Marshaler와 xml.Unmarshaler 인터페이스](#xmlmarshaler와-xmlunmarshaler-인터페이스)
  - [예제 3: 자신의 MarshalXML, UnmarshalXML 메소드를 정의하기](#예제-3-자신의-marshalxml-unmarshalxml-메소드를-정의하기)
  - [동적인 XML 다루기](#동적인-xml-다루기)
  - [예제 4 map의 key-value XML 요소에 매핑하기](#예제-4-map의-key-value-xml-요소에-매핑하기)
    - [MarshalXML](#marshalxml)
    - [UnmarshalXML](#unmarshalxml)

---

## 기본적인 사용법

먼저 기본적인 사용법입니다.

encoding/xml을 사용하면, Go의 구조체를 XML 문서로 변환(Marshal)하거나 그 반대(Unmarshal)로 작업할 수 있습니다.

예를 들어 Person 이라는 구조체로 XML을 이용해서 Marshal/Unmarshal할 수 있죠.

## 예제1: XML의 Marshal과 Unmarshal

```go
package main

import (
  "encoding/xml"
  "fmt"
)

type Name struct {
  First, Last string
}

type Person struct {
  Name   Name
  Gender string
  Age    int
}

func main() {

  // Marshal의 예
  john := Person{Name{"John", "Doe"}, "Male", 20}
  buf, _ := xml.MarshalIndent(john, "", "  ")
  fmt.Println(string(buf))

  // Unmarshal의 예
  xmldoc := []byte(`
  <Person>
    <Name><First>John</First><Last>Doe</Last></Name>
    <Gender>Male</Gender>
    <Age>20</Age>
  </Person>`)
  p := Person{}
  xml.Unmarshal(xmldoc, &p)
  fmt.Println(p)
}

```

실제 출력되는 형식은 아래와 같이 나옵니다.

```xml
<Person>
  <Name>
    <First>John</First>
    <Last>Doe</Last>
  </Name>
  <Gender>Male</Gender>
  <Age>20</Age>
</Person>
{{John Doe} Male 20}
```

## 구조체 필드 태그

기본 사용법은 의외로 쉽습니다.

하지만, XML 요소의 이름이 구조체 멤버의 이름에 따라야 하거나, XML 속성이 출력되지 않거나, 등등 여러가지 불편합니다.

그래서 구조체 태그를 사용하면, 다음과 같은 것들이 가능해집니다.

- 구조체 멤버와 XML 요소를 다른 이름으로 하기

- 구조체 멤버를 XML 요소가 아니라 XML 속성에 대응시키기

- 구조체 멤버를 XML에 출력하지 않기

- 구조체 멤버를 XML 주석에 대응시키기 등등

구조체 필드 태그의 자세한 사양에 대해서는 [xml - The Go Programming Language](https://pkg.go.dev/encoding/xml) 를 한번 읽어보시는 걸 추천드립니다.

## 예제2: 다양한 구조체 필드 태그

```go
package main

import "fmt"
import "encoding/xml"

func main() {
    type Person struct {
        XMLName xml.Name `xml:"person"`   // Person 타입의 XML 요소명을 person으로 한다
        Name    string
        Gender  string `xml:"attr"`       // XML 속성으로 한다
        Age     int    `xml:"age"`        // XML 요소명을 age로 한다
        ID      int    `xml:"-"`          // XML 요소로 하지 않는다
        Note    string `xml:",omitempty"` // 비어 있을 때 XML 요소를 만들지 않는다
        Comment string `xml:",comment"`   // XML 주석으로 한다
    }

    // Marshal의 예
    john := Person{Name: "John Doe", Gender: "Male", Age: 20, ID: 1, Note: "", Comment: "none"}
    buf, _ := xml.MarshalIndent(john, "", "  ")
    fmt.Println(string(buf))

    // Unmarshal의 예
    var p Person
    xml.Unmarshal(buf, &p)
    fmt.Printf("%+v", p)
}

```

실행결과는 아래와 같이 출력됩니다.

```xml
<person>
  <Name>John Doe</Name>
  <attr>Male</attr>
  <age>20</age>
  <!--none-->
</person>
{XMLName:{Space: Local:person} Name:John Doe Gender:Male Age:20 ID:0 Note: Comment:none}%
```

## xml.Marshaler와 xml.Unmarshaler 인터페이스

그러나, 구조체 태그를 사용해도, XML에 출력하고 싶은 값은 모두 구조체의 멤버 값으로서 보유하고 있어야 합니다.

예를 들어 다음과 같은 경우 즉, 변수와 XML의 구조에 차이가 있는 경우에 문제가 됩니다.

- 구조체는 time.Time형으로 생일을 가지고 있지만, XML에는 생년만 출력하고 싶다
- xmlns 속성과 같은 로직과 관련 없는 요소나 속성을 XML에 출력하고 싶다
- 구조체는 소문자의 멤버를 가지고 있지만, XML에 출력하고 싶다(보통 소문자의 멤버는 무시됩니다)

이러한 요구사항을 구현하기 위해서는 어떻게 해야 할까요?

언뜻 생각해 보면 XML 출력용으로, BirthYear나 xmlns 멤버를 가진 구조체(UserInfoForXML)를 정의하고, 원래의 구조체에서 복사하여 Marshal하는 방식일까요?

그러나 실제로는 생각보다 힘듭니다.

이럴 때는, 구조체에 xml.Marshaler, xml.Unmarshaler 인터페이스를 구현함으로써, 그러한 구조체와 XML의 변환 로직을 MarshalXML / UnmarshalXML 메소드 안에서 스마트하게 기술하는게 좋습니다.

```go
// xml.Marshaler인터페이스의 정의
type Marshaler interface {
MarshalXML(e *Encoder, start StartElement) error
}

// xml.Unmarshaler인터페이스의 정의
type Unmarshaler interface {
UnmarshalXML(d *Decoder, start StartElement) error
}
```

## 예제 3: 자신의 MarshalXML, UnmarshalXML 메소드를 정의하기

구체적으로는 다음과 같이 구현합니다.

이 예제에서는 XML과 구조체를 상호 변환합니다.

둘 사이에는 다음과 같은 차이점이 있습니다.

- XML에는 xmlns 요소가 있다
- 구조체의 소문자 요소를 XML에 출력한다
- 구조체에서 생년월일인 BirthTime 중 생년만 XML에 출력한다

```go
type User struct {
  Name string
  gender string
  BirthTime time.Time
}
```

```go
<User xmlns=“http://www.w3.org/2001/XMLSchema-instance”>
  <Name>Alice</Name>
  <Gender>Female</Gender>
  <BirthYear>2002</BirthYear>
</User>
```

```go
package main

import (
    "encoding/xml"
    "errors"
    "fmt"
    "time"
)

type User struct {
    Name      string
    gender    string
    BirthTime time.Time
}

func (u User) MarshalXML(e *xml.Encoder, start xml.StartElement) error {
    // xml.Encoder에 먹일 대리 구조체의 정의와 초기화
    uu := struct {
        Xmlns        string `xml:"xmlns,attr"`
        Name, Gender string
        BirthYear    int
    }{
        "http://www.w3.org/2001/XMLSchema-instance",
        u.Name,
        u.gender,
        u.BirthTime.Year(),
    }
    return e.EncodeElement(uu, start)
}

func (u *User) UnmarshalXML(d *xml.Decoder, start xml.StartElement) error {
    // xml.Decoder에 먹일 대리 구조체의 정의와 초기화
    uu := struct {
        Xmlns        string `xml:"xmlns,attr"`
        Name, Gender string
        BirthYear    int
    }{}
    if err := d.DecodeElement(&uu, &start); err != nil {
        return err
    }
    // 입력값의 검증도 가능. 에러를 던지면 Unmarshal 처리가 중단된다
    if uu.Gender != "Male" && uu.Gender != "Female" {
        return errors.New("Invalid Gender parameter")
    }
    *u = User{uu.Name, uu.Gender, time.Date(uu.BirthYear, time.January, 1, 0, 0, 0, 0, time.UTC)}
    return nil
}

func main() {
    u := User{"Alice", "Female", time.Date(2002, time.November, 10, 23, 0, 0, 0, time.UTC)}

    buf, _ := xml.MarshalIndent(u, "", " ")
    fmt.Println(string(buf))

    u2 := User{}
    xml.Unmarshal(buf, &u2)
    fmt.Printf("%+v\n", u2)
}
```

실행 결과는 아래와 같이 나옵니다.

```bash
<User xmlns="http://www.w3.org/2001/XMLSchema-instance">
 <Name>Alice</Name>
 <Gender>Female</Gender>
 <BirthYear>2002</BirthYear>
</User>
{Name:Alice gender:Female BirthTime:2002-01-01 00:00:00 +0000 UTC}
```

코드를 상세히 해설해 보자면,

xmlns의 사용법이 잘못되었지만, 좋은 예제가 떠오르지 않았습니다…

MarshalXML의 리시버는 값, UnmarshalXML의 리시버는 포인터인 것에 주의하히구요.

MarshalXML에서는 메소드 내에서 XML 레이아웃에 대응하는 익명 구조체를 정의하고, 리시버인 User 타입의 값을 사용하여 초기화한 것을 xml.Encoder.EncodeElement()로 XML에 인코딩하고 있습니다.

반면 UnmarshalXML에서는 메소드 내에서 XML 레이아웃에 대응하는 익명 구조체를 정의하고, xml.Decoder.DecodeElement()로 디코딩한 익명 구조체에서, 리시버인 User 타입에 값을 대입하고 있습니다.

---

## 동적인 XML 다루기

마지막으로, 동적으로 변화하는 XML 문서를 Marshal/Unmarshal하는 방법을 알아봅시다.

예를 들어, map의 key-value 구조를 가지는 XML 요소로 출력할 수 있습니다.

## 예제 4 map의 key-value XML 요소에 매핑하기

이 예제에서는, 문자열 ID와 map의 멤버를 가진 구조체와, 그것을 매핑한 XML의 변환을 다룹니다.

ID는 XML 속성으로 처리됩니다.

```go
type UserInfo struct {
    ID    string
    Extra map[string]string
}
```

```xml
<User id="0001">
  <Name>Charley</Name>
  <Gender>Male</Gender>
  <County>Japan</County>
  <BloodType>A</BloodType>
  <Hobby>Internet</Hobby>
</User>
```

```go
package main

import (
    "encoding/xml"
    "fmt"
)

type UserInfo struct {
    ID    string
    Extra map[string]string
}

func (u UserInfo) MarshalXML(e *xml.Encoder, start xml.StartElement) error {
    start.Name.Local = "User"
    start.Attr = []xml.Attr{{Name: xml.Name{Local: "id"}, Value: u.ID}}
    e.EncodeToken(start)
    for k, v := range u.Extra {
        e.EncodeElement(v, xml.StartElement{Name: xml.Name{Local: k}})
    }
    e.EncodeToken(start.End())
    return nil
}

func (u *UserInfo) UnmarshalXML(d *xml.Decoder, start xml.StartElement) error {
    u.Extra = make(map[string]string)

    // start 태그의 속성을 순회
    for _, attr := range start.Attr {
        if attr.Name.Local == "id" {
            u.ID = attr.Value
        }
    }

    // Decoder.Token()으로 자식 Token의 순회
    for {
        token, err := d.Token()
        if token == nil {
            break
        }
        if err != nil {
            return err
        }
        if t, ok := token.(xml.StartElement); ok {
            var data string
            if err := d.DecodeElement(&data, &t); err != nil {
                return err
            }
            u.Extra[t.Name.Local] = data
        }
    }
    return nil
}

func main() {
    u := UserInfo{
        ID: "0001",
        Extra: map[string]string{
            "Name":      "Charley",
            "Gender":    "Male",
            "County":    "Japan",
            "BloodType": "A",
            "Hobby":     "Internet",
        },
    }
    buf, _ := xml.MarshalIndent(u, "", "  ")
    fmt.Println(string(buf))

    u2 := UserInfo{}
    if err := xml.Unmarshal(buf, &u2); err != nil {
        fmt.Println(err.Error())
    }
    fmt.Printf("%#v\n", u2)
}
```

실행 결과는 아래와 같이 출력됩니다.

```xml
<User id="0001">
  <Name>Charley</Name>
  <Gender>Male</Gender>
  <County>Japan</County>
  <BloodType>A</BloodType>
  <Hobby>Internet</Hobby>
</User>
main.UserInfo{ID:"0001", Extra:map[string]string{"BloodType":"A", "County":"Japan", "Gender":"Male", "Hobby":"Internet", "Name":"Charley"}}
```

### MarshalXML

마샬링 처리는 start라는 MarshalXML 메소드에 StartElement가 열린 태그의 토큰이 전달되므로,

- `e.EncodeToken(start)`로 열린 태그의 토큰을 인코딩
- `e.EncodeElement(v, xml.StartElement{Name: [xml.Name](http://xml.name/){Local: k}})`로 XML 요소(열린 태그-콘텐츠-닫힌 태그가 세트로 된 것)을 인코딩
- `e.EncodeToken(start.End())`로 닫힌 태그의 토큰을 인코딩

위와 같은 흐름이 됩니다.

### UnmarshalXML

언마샬링 처리는 Decoder.Token() 메소드로 하나씩 토큰을 꺼내고, 열린 태그(StartElement)이라면 Decoder.DecodeElement(&data, &t)로 값을 꺼내는 흐름이 됩니다.

---

어떠셨나요?

표준 encoding/xml도 꽤 유용하다는 사실을 알 수 있을텐데요.

Go로 XML을 다룰 때 도움이 되었으면 좋겠습니다.

그럼.

