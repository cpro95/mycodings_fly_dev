---
slug: 2022-07-30-javascript-map-type-in-a-nutshell
title: 자바스크립트 Map 타입 완벽하게 이해하기
date: 2022-07-30 13:35:10.034000+00:00
summary: 자바스크립트(타입스크립트) Map 총정리 - 개요, 배열(객체)로 변환, 정렬 등
tags: ["javascript", "map"]
contributors: []
draft: false
---

안녕하세요?

오늘은 엊그제 블로그 최다 키워드 추출 및 정렬에 있어 Map 타입으로 간단히 해결하게 된 사연도 있고 해서,

자바스크립트 또는 타입스크립트의 Map Type에 대해 알아보겠습니다.

Map 타입은 ES6에 도입되었는데요, key-value라는 간단한 구조로 되어 있습니다.

객체나 어떤 primitive values라도 key 또는 value 값으로 들어갈 수 있습니다.

자바스크립트 Map은 컬렉션이라고 부르는데요.

컬렉션이기 때문에 사이즈도 있고 순서도 있고, 각 아이템을 탐색할 수도 있습니다.

본격적으로 기초부터 시작해 보겠습니다.

---

## Map 생성

Map type을 new 키워드로 해서 Map을 만들면 됩니다.

### 빈 Map 만들기
```js
// typescript
let myMap = new Map<string, number>();

// javascript
let myMap = new Map();
```

편의상 타입스크립트로 진행하겠습니다.

위 코드를 보시면 타입스크립트로 명확하게 key-value에 해당하는 타입을 지정했습니다.

key는 string 타입이고 value는 number 타입입니다.

### 초기화 값을 지닌 Map 만들기

Map을 만들 때 아래처럼 Map constructor에 배열로 key-value 값을 지정해 주면 초기화 값을 지닌 Map을 만들 수 있습니다.

```js
let myMap = new Map<string, string>([
        ["key1", "value1"],
        ["key2", "value2"]
    ]);
```

## Map 엔트리의 추가, 참조, 삭제

가장 기본이 되는 추가, 참조, 삭제에 대한 방법입니다.

1. map.set(key, value)

  -- 새로운 엔트리를 map에 추가

2. map.get(key)

  -- map에서 key에 해당하는 value를 참조

3. mas.has(key)

  -- map에서 key에 해당하는 value가 존재하는지 true or false로 리턴

4. map.size

  -- Map의 엔트리 개수를 리턴

5. map.delete(key)

  -- map에서 key값에 해당하는 엔트리를 삭제하고 성공하면 true를 리턴, 그렇지 않으면 false를 리턴

6. map.clear()

  -- map에서 모든 엔트리를 삭제

### 예제

```js
let nameAgeMapping = new Map<string, number>();

//1. Add entries
nameAgeMapping.set("Lokesh", 37);
nameAgeMapping.set("Raj", 35);
nameAgeMapping.set("John", 40);

//2. Get entries
let age = nameAgeMapping.get("John");		// age = 40

//3. Check entry by Key
nameAgeMapping.has("Lokesh");		        // true
nameAgeMapping.has("Brian");		        // false

//4. Size of the Map
let count = nameAgeMapping.size; 	        // count = 3

//5. Delete an entry
let isDeleted = nameAgeMapping.delete("Lokesh");	        // isDeleted = true

//6. Clear whole Map
nameAgeMapping.clear();				//Clear all entries
```

## 맵 Iterating

Map 엔트리는 삽입된 순서로 Iterating 됩니다.

for-each loop은 [key, value] 짝의 배열을 리턴합니다.

'for...of' 연산자는 각각 keys, values, entries를 iterating 할 수 있습니다.

1. map.keys()

  -- map keys로 iterating

2. map.values()

  -- map values로 iterating

3. map.entries()

  -- map entries로 iterating

4. map

  -- map entries를 iterating 하기 위해 객체 디스트럭쳐링 사용

### 예제

```js
let nameAgeMapping = new Map<string, number>();
 
nameAgeMapping.set("Lokesh", 37);
nameAgeMapping.set("Raj", 35);
nameAgeMapping.set("John", 40);

//1. Iterate over map keys

for (let key of nameAgeMapping.keys()) {
    console.log(key);                   //Lokesh Raj John
}

//2. Iterate over map values
for (let value of nameAgeMapping.values()) {
    console.log(value);                 //37 35 40
}

//3. Iterate over map entries
for (let entry of nameAgeMapping.entries()) {
    console.log(entry[0], entry[1]);    //"Lokesh" 37 "Raj" 35 "John" 40
}

//4. Using object destructuring
for (let [key, value] of nameAgeMapping) {
    console.log(key, value);            //"Lokesh" 37 "Raj" 35 "John" 40
}
```

---

## forEach()를 이용한 Map 타입의 filtering

Map 타입을 필터링하려면 일단 Array.from() 메서드로 Map 타입을 배열로 가져와야 합니다.

아래처럼 Map 타입을 Array.from() 메서드로 배열로 전환할 수 있는데요.
```js
const map1 = new Map([
  ['num1', 1],
  ['num2', 2],
  ['num3', 3],
]);

// 👇️ [['num1', 1], ['num2', 2], ['num3', 3]]
console.log(Array.from(map1));
```

그다음으로 배열 디스트럭쳐링을 이해하여야 합니다.

배열 디스트럭쳐링은 아래 코드를 보시면 쉽게 이해할 수 있습니다.

```js
const [key, value] = ['num1', 1];
console.log(key); // 👉️ num1
console.log(value); // 👉️ 1
```

아래 코드가 최종적인 맵 타입의 필터링입니다.

```js
const map1 = new Map([
  ['num1', 1],
  ['num2', 2],
  ['num3', 3],
]);

map1.forEach((value, key) => {
  if (value > 1) {
    map1.delete(key);
  }
});

// 👇️ {'num1' => 1}
console.log(map1);
```

map1의 value 값이 1 초과하는 엔트리를 map1.delete 함수로 삭제하는 코드입니다.

iterating을 위해 forEach() method가 쓰였고요.

위와 같이 필터링하는 방법도 있고 맵을 배열로 변환해서 배열의 filter 메서드를 사용하는 방법도 있습니다

```js
const map1 = new Map([
  ['num1', 1],
  ['num2', 2],
  ['num3', 3],
]);

const filtered = new Map(
  Array.from(map1).filter(([key, value]) => {
    if (value > 1) {
      return true;
    }

    return false;
  }),
);

// 👇️ {'num2' => 2, 'num3' => 3}
console.log(filtered);

```

---

## 객체(Object)를 맵(Map) 타입으로 변환하기

객체를 맵 타입으로 변환하기 위해서는 객체가 맵 타입처럼 key-value 형식의 관계를 맺고 있으면 가능합니다.

Object.entries() 메서드를 쓰면 객체의 key-value 형식의 배열을 얻을 수 있는데 그걸 Map() 컨스트럭터에 넣으면 됩니다.

아래 코드처럼 Object.entries 메서드는 객체의 항목을 key-value 항목으로 변환해서 배열로 리턴합니다.

```js
// 👇️ [['id', 456], ['name', 'Gihun']]
console.log(Object.entries({id: 456, name: 'Gihun'}));
```

위 코드처럼 Object.entries() 메서드를 거친 배열의 첫 번째 항목도 배열인데, 순차적으로 배열을 Map Constructor에 넣어서 Map을 생성하면 됩니다.

```js
const obj = {
  id: 456,
  name: 'Gihun',
};

const map1 = new Map(Object.entries(obj));
console.log(map1); // 👉️ {'id' => 456, 'name' => 'Gihun'}
```

#### **반대로, Map 형식을 다시 Object 형식으로 변환시키려면 어떻게 하면 될까요?**

여기서도 다시 Object.fromEntries() 메서드를 쓰면 됩니다.

```js
// 👇️ {id: 456, name: 'Gihun'}
console.log(
  Object.fromEntries([
    ['id', 456],
    ['name', 'Gihun'],
  ]),
);
```

Object.fromEntries() 메서드는 꼭 iterating 할 수 있는 Map 형식이나 배열을 받아야 하는데요.

Iterating 할 수 있는 key-value 형식이어야 하는 건 당연해야 합니다.

전체적인 코드를 보면 쉽게 이해할 수 있을 겁니다.

```js
const obj = {
  id: 456,
  name: 'Gihun',
};

// ✅ Convert Object to Map
const map1 = new Map(Object.entries(obj));
console.log(map1); // 👉️ {'id' => 456, 'name' => 'Gihun'}

// ✅ Convert Map to Object
const objAgain = Object.fromEntries(map1);
console.log(objAgain); // 👉️ {id: 456, name: 'Gihun'}

```

---

## 맵(Map) 병합하기

맵을 병합하기 위해서는 자바스크립트의 스프레드 연산자(...)를 써서 배열로 만들어서 합치고 그걸 다시 맵의 Constructor에 넣어서 다시 만들면 됩니다.

```js
const map1 = new Map([['name', 'Tom']]);

// 👇️ [ ['name', 'Tom'] ]
console.log([...map1]);
```

위 코드처럼 map1이라는 맵을 스프레드 연산자(...)를 이용해서 언팩(unpack)했습니다.

병합하고자 하는 Map 여러 개를 스프레드 연산자(...)로 언팩하고 나서

```js
const map3 = new Map([['name', 'Tom'], ['age', 30]])
```

위 코드처럼 새로운 Map을 만들면 됩니다.

전체적인 코드를 보면 이해하기 더 쉬울 겁니다.

```js
const map1 = new Map([['name', 'Tom']]);
const map2 = new Map([['age', 30]]);
const map3 = new Map([['country', 'Chile']]);

const map4 = new Map([...map1, ...map2, ...map3]);
// 👇️ {'name' => 'Tom', 'age' => 30, 'country' => 'Chile'}
console.log(map4);
```

---

## Map의 key 순서대로 Map 정렬하기

Map을 정렬하기 위해서는 sort() 함수가 필요한데요.

Map 타입은 sort() 함수가 없습니다.

그래서 sort() 함수가 있는 배열로 변환해서 sort() 함수로 순서를 정렬하고 다시 Map 형식으로 되돌리면 쉽게 정렬할 수 있습니다.

Map 타입은 데이터가 삽입된 순서를 기억하고 있습니다.

그래서 배열로 변환돼서도 순서가 그대로입니다.

여기서도 스프레드 연산자(...)가 중요하게 쓰입니다.

```js
// ✅ When Keys are STRINGS
const map1 = new Map([
  ['z', 'three'],
  ['a', 'one'],
  ['b', 'two'],
]);

// 👇️ {'z' => 'three', 'a' => 'one', 'b' => 'two'}
console.log(map1);

// ✅ Sort Ascending (low to high)
const sortedAsc = new Map([...map1].sort());
```

반대로 정렬하려면 어떻게 할까요?

sort().reverse() 함수를 쓰면 됩니다.

```js
// ✅ When Keys are STRINGS
const map1 = new Map([
  ['z', 'three'],
  ['a', 'one'],
  ['b', 'two'],
]);

// ✅ Sort Descending (high to low)
const sortedDesc = new Map([...map1].sort().reverse());

console.log(sortedDesc); // 👉️ {'z' => 'three', 'b' => 'two', 'a' => 'one'}
```

여기까지는 Map의 Key 타입이 문자열(string) 일 때만 가능한데요.

문자열은 아스키코드로 정렬이 되기 때문에 개발자가 신경 안 써도 되지만,

만약에 Map의 Key 타입이 숫자(number) 일 때는 sort() 함수를 만들어서 지정해 줘야 합니다.

```js
const map2 = new Map([
  [3, 'three'],
  [1, 'one'],
  [2, 'two'],
]);

// ✅ Sort Ascending (low to high)
const sortNumAsc = new Map([...map2].sort((a, b) => a[0] - b[0]));

// 👇️ {1 => 'one', 2 => 'two', 3 => 'three'}
console.log(sortNumAsc);
```

### Map의 key로 정렬하기 전체 코드입니다.

```js
// ✅ When Keys are STRINGS
const map1 = new Map([
  ['z', 'three'],
  ['a', 'one'],
  ['b', 'two'],
]);

// 👇️ {'z' => 'three', 'a' => 'one', 'b' => 'two'}
console.log(map1);

// ✅ Sort Ascending (low to high)
const sortedAsc = new Map([...map1].sort());

// 👇️ {'a' => 'one', 'b' => 'two', 'z' => 'three'}
console.log(sortedAsc);

// ✅ Sort Descending (high to low)
const sortedDesc = new Map([...map1].sort().reverse());

console.log(sortedDesc); // 👉️ {'z' => 'three', 'b' => 'two', 'a' => 'one'}

// ---------------------------------------------------------

// ✅ When keys are NUMBERS

const map2 = new Map([
  [3, 'three'],
  [1, 'one'],
  [2, 'two'],
]);

// ✅ Sort Ascending (low to high)
const sortNumAsc = new Map([...map2].sort((a, b) => a[0] - b[0]));

// 👇️ {1 => 'one', 2 => 'two', 3 => 'three'}
console.log(sortNumAsc);

// ✅ Sort Descending (high to low)
const sortedNumDesc = new Map([...map2].sort((a, b) => b[0] - a[0]));

// 👇️ {3 => 'three', 2 => 'two', 1 => 'one'}
console.log(sortedNumDesc);
```

---

## Map의 value 값 순서대로 Map 정렬하기

Map의 key 순서대로 Map 정렬하기와 똑같습니다.

틀린 점은 Map을 배열로 가져올 때 key로 정렬할 때는 배열의 첫 번째 인자, 즉, a[0], b[0]을 비교했지만,

value로 정렬할 때는 배열의 두 번째 인자인 a[1], b[1]을 비교하면 됩니다.

Map이 배열로 전환될 때 [key, value] 형식의 배열로 저장되기 때문입니다.

결국 좀 전에 배웠던 key 순서대로 정렬하기와 코드는 똑같습니다.

```js
// ✅ When VALUES are NUMBERS
const map2 = new Map([
  ['three', 3],
  ['one', 1],
  ['two', 2],
]);

// ✅ Sort by Value Ascending (low to high)
const sortNumAsc = new Map([...map2].sort((a, b) => a[1] - b[1]));

// 👇️ {'one' => 1, 'two' => 2, 'three' => 3}
console.log(sortNumAsc);

// ✅ Sort by Value Descending (high to low)
const sortedNumDesc = new Map([...map2].sort((a, b) => b[1] - a[1]));

// 👇️ {'three' => 3, 'two' => 2, 'one' => 1}
console.log(sortedNumDesc);

// ✅ When VALUES are STRINGS
const map1 = new Map([
  ['three', 'c'],
  ['one', 'a'],
  ['two', 'b'],
]);

// ✅ Sort  by Value Ascending (low to high)
const sortedAsc = new Map([...map1].sort((a, b) => (a[1] > b[1] ? 1 : -1)));

// 👇️ {'one' => 'a', 'two' => 'b', 'three' => 'c'}
console.log(sortedAsc);

// ✅ Sort by Value Descending (high to low)
const sortedDesc = new Map([...map1].sort((a, b) => (a[1] > b[1] ? -1 : 1)));

// 👇️ {'three' => 'c', 'two' => 'b', 'one' => 'a'}
console.log(sortedDesc);
```

---

## Map에서 key, value 중 한 개만 가져와서 배열 만들기

이 방법도 똑같이 Array.from() 메서드를 쓰면 됩니다.

key만 가져오는 코드입니다.

```js
const map = new Map();

map.set('name', 'John');
map.set('age', 30);

const keys = Array.from(map.keys());

console.log(keys); // 👉️ ['name', 'age']
console.log(keys.length); // 👉️ 2
```

value만 가져오는 코드입니다.

```js
const map = new Map();
map.set('name', 'John');
map.set('age', 30);

const values = Array.from(map.values());

console.log(values); // 👉️ ['John', 30]
console.log(values.length); // 👉️ 2

const keys = Array.from(map.keys()); // 👉️ ['name', 'age']
```

위 2개의 코드에서는 각각 map.keys() 메서드와 map.values() 메서드를 써서 Array.from()으로 전달했는데요.

그럼, key, value 모두 전달하는 방법은 어떻게 할까요?

```js
const map = new Map();

map.set('name', 'Bob');
map.set('country', 'Chile');

const arr = Array.from(map, ([key, value]) => {
  return {[key]: value};
});

// 👇️ [{name: 'Bob'}, {country: 'Chile'}]
console.log(arr);

```

Array.from() 메소드에 두 번째 인자로 익명 함수를 넣었습니다.

만약에 Array.from() 메소드에 두 번째 인자를 안 넣고 그냥 첫 번째 인자로 map을 넣는다면,

Array.from()은 아래처럼 배열의 배열을 반환할 겁니다.

```js
const map = new Map();

map.set('name', 'Bob');
map.set('country', 'Chile');

// 👇️ [['name', 'Bob'], ['country', 'Chile']]
const arr = Array.from(map);
console.log(arr);
```

그래서 Array.from() 메서드가 배열의 배열을 반환한 걸 두 번째 인자인 익명 함수에서 처리하는 거죠.

두 번째 인자인 익명 함수는 배열 디스트럭쳐링 방식이 쓰인 겁니다.

아래처럼요.

```js
const [a, b] = ['hello', 'world'];

console.log(a); // 👉️ hello
console.log(b); // 👉️ world
```

마지막으로 객체를 만들기 위해
```js
return {[key]: value}
```
형식을 써서 객체를 반환하게 했습니다.

---

지금까지 자바스크립트의 Map 타입에 대해 알아보았는데요.

정말 많은 도움이 되었으면 합니다.



