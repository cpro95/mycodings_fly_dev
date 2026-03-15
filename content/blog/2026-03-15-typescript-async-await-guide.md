---
slug: 2026-03-15-typescript-async-await-guide
title: "타입스크립트 비동기 프로그래밍 완벽 가이드"
summary: "타입스크립트의 프로미스와 async/await 문법을 기초부터 심화 패턴까지 완벽하게 정리했습니다. 실무에서 바로 적용 가능한 에러 처리 및 동시성 제어 기법을 확인해 보세요."
date: 2026-03-14T03:15:38.394Z
draft: false
weight: 50
tags: ["typescript", "async", "await", "비동기프로그래밍", "promise", "자바스크립트", "에러처리"]
contributors: []
---

# 타입스크립트 비동기 프로그래밍 완벽 가이드

비동기 프로그래밍은 서로 독립적으로 작업을 수행할 수 있게 해주는 코드 작성 방식인데요.


하나의 작업이 끝날 때까지 기다리지 않고 다른 작업을 시작할 수 있는 아주 유용한 개념입니다.


비동기 프로그래밍이라고 하면 보통 멀티태스킹과 효율적인 시간 관리를 떠올리시면 되거든요.


자바스크립트 환경에서 비동기 프로그래밍에 어느 정도 익숙하신 분들이라면, 타입스크립트에서는 이것이 어떻게 작동할지 궁금하실 겁니다.


이번 가이드에서는 바로 그 부분을 깊이 있게 파헤쳐 보려고 하는데요.


단순한 번역을 넘어 실무에서 자주 마주치는 패턴까지 꼼꼼하게 다루어 보겠습니다.



# 자바스크립트와 타입스크립트의 비동기 동작 원리
본격적으로 코드를 보기 전에 '이벤트 루프'와 '마이크로태스크 큐'라는 개념을 짚고 넘어가는 것이 좋은데요.


타입스크립트는 결국 자바스크립트로 변환되어 실행되기 때문에 이 엔진의 동작 방식을 이해하는 것이 필수적입니다.


싱글 스레드 기반인 자바스크립트는 메인 스레드가 멈추지 않도록 무거운 네트워크 요청 등을 백그라운드로 넘기거든요.


그리고 그 작업이 완료되면 마이크로태스크 큐라는 대기열에 결과를 올려두고 순차적으로 메인 콜스택으로 불러와 실행하게 됩니다.


이러한 흐름을 제어하기 위해 등장한 객체가 바로 우리가 앞으로 다룰 프로미스인데요.


이 배경지식을 머릿속에 넣어두시면 이어지는 비동기 제어 기법들이 훨씬 입체적으로 다가오실 겁니다.



# 타입스크립트에서 프로미스 이해하기
비동기 문법인 async와 await를 살펴보기 전에 프로미스가 타입스크립트 비동기 프로그래밍의 토대라는 점을 먼저 짚고 넘어가야 하는데요.


프로미스는 당장 사용할 수는 없지만 미래의 어느 시점에 해결될 수 있는 값을 나타내는 객체입니다.


하나의 프로미스는 대기, 이행, 거부라는 세 가지 상태 중 하나를 가지게 되거든요.


대기 상태는 아직 아무것도 완료되지 않은 초기 상태를 의미합니다.


이행 상태는 작업이 성공적으로 완료되었음을 나타내는데요.


거부 상태는 작업 중 오류가 발생해 실패했음을 뜻합니다.


타입스크립트에서 프로미스를 안전하게 생성하고 다루는 방법은 다음과 같은데요.



```typescript
// Type-safe Promise creation
interface ApiResponse {
  data: string;
  timestamp: number;
}

const fetchData = new Promise<ApiResponse>((resolve, reject) => {
  try {
    // Simulating API call
    setTimeout(() => {
      resolve({
        data: "Success!",
        timestamp: Date.now()
      });
    }, 1000);
  } catch (error) {
    reject(error);
  }
});
```
이처럼 제네릭 문법을 통해 프로미스가 최종적으로 반환할 데이터의 타입을 명확하게 지정할 수 있습니다.


프로미스는 성공적인 작업을 위한 then 메서드와 에러 처리를 위한 catch 메서드를 연결하여 체이닝할 수 있거든요.



```typescript
fetchData
  .then(response => {
    console.log(response.data); // TypeScript knows response has ApiResponse type
    return response.timestamp;
  })
  .then(timestamp => {
    console.log(new Date(timestamp).toISOString());
  })
  .catch(error => {
    console.error('Error:', error);
  });
```
이러한 프로미스의 체이닝 개념은 나중에 비동기 작업을 병렬로 실행하는 방법을 논의할 때 다시 다루어 볼 예정입니다.


타입스크립트가 응답 값의 타입을 완벽하게 추론해 주기 때문에 런타임 에러를 사전에 방지할 수 있는데요.



# 타입스크립트의 async await 소개
타입스크립트는 자바스크립트의 슈퍼셋이기 때문에 async와 await 문법이 동일하게 작동하면서도 정적 타이핑이라는 강력한 이점을 제공합니다.


비동기 결과물의 형태를 정의하고 강제할 수 있어 컴파일 단계에서 타입 오류를 잡고 버그를 일찍 발견하도록 도와주거든요.


근본적으로 async와 await는 프로미스 위에 얹혀진 문법적 설탕이라고 볼 수 있습니다.


비동기 함수는 반환 타입을 명시적으로 지정하지 않더라도 항상 프로미스를 반환하게 되는데요.


내부적으로 컴파일러가 여러분을 위해 반환된 값을 해결된 프로미스로 감싸주기 때문입니다.


간단한 예시를 통해 두 가지 방식이 어떻게 같은 결과를 내는지 확인해 보려고 하거든요.



```typescript
// Snippet 1
const myAsyncFunction = async <T>(url: string): Promise<T> => {
  const response = await fetch(url)
  return (await response.json()) as T
}

// Snippet 2
const immediatelyResolvedPromise = <T>(url: string): Promise<T> => {
  return fetch(url).then(res => res.json() as Promise<T>)
}
```
생김새는 다르지만 위의 두 코드 스니펫은 사실상 동일한 역할을 수행하는데요.


async와 await 문법은 단순히 코드를 더 동기적으로 작성할 수 있게 해주고 같은 줄에서 프로미스를 자동으로 풀어줍니다.


이는 복잡한 비동기 패턴을 다룰 때 코드의 가독성을 극적으로 높여주는 강력한 도구이거든요.


이 문법을 최대한 활용하려면 앞서 설명한 프로미스에 대한 기본적인 이해가 필수적입니다.



# 타입스크립트 프로미스 자세히 살펴보기
앞서 설명했듯이 프로미스는 미래에 어떤 일이 일어날 것이라는 기대를 나타내는데요.


앱이 그 미래 이벤트의 결과를 사용하여 다른 후속 작업을 트리거할 수 있도록 해줍니다.


이를 더 구체적으로 이해하기 위해 현실 세계의 예시를 의사 코드로 변환한 다음 실제 타입스크립트 구현을 살펴볼 거거든요.


예를 들어 제가 잔디를 깎아야 하는 상황이라고 가정해 봅니다.


잔디 깎는 업체에 연락했더니 몇 시간 후에 잔디를 깎아주겠다고 약속을 하는데요.


그에 대한 대가로 저는 잔디가 제대로 깎이기만 한다면 직후에 돈을 지불하겠다고 약속합니다.


여기서 아주 중요한 패턴을 하나 발견할 수 있거든요.


두 번째 이벤트인 결제는 전적으로 첫 번째 이벤트인 잔디 깎기에 달려 있다는 사실입니다.


첫 번째 프로미스가 이행되면 다음 프로미스가 실행되는 구조인데요.


만약 첫 번째 약속이 지켜지지 않는다면 흐름은 거부되거나 계속 대기 상태로 남아있게 됩니다.



```typescript
// I send a request to the company. This is synchronous
// company replies with a promise
const angelMowersPromise = new Promise<string>((resolve, reject) => {
    // a resolved promise after certain hours
    setTimeout(() => {
        resolve('We finished mowing the lawn')
    }, 100000) // resolves after 100,000ms
    reject("We couldn't mow the lawn")
})

const myPaymentPromise = new Promise<Record<string, number | string>>((resolve, reject) => {
    // a resolved promise with an object of 1000 Euro payment
    // and a thank you message
    setTimeout(() => {
        resolve({
            amount: 1000,
            note: 'Thank You',
        })
    }, 100000)
    // reject with 0 Euro and an unstatisfatory note
    reject({
        amount: 0,
        note: 'Sorry Lawn was not properly Mowed',
    })
})
```
위의 코드에서 우리는 업체의 약속과 저의 약속을 모두 선언해 두었거든요.


문제는 이 작업들을 어떻게 순차적이고 동기적으로 실행할 수 있느냐는 것입니다.


바로 그 지점에서 then 키워드가 중요한 역할을 하는데요.


이 키워드가 없다면 함수들은 그저 각자 해결되는 순서대로 중구난방 실행되고 맙니다.



# then을 이용한 순차적 실행
프로미스를 체이닝하면 then 키워드를 사용하여 일련의 작업들을 순서대로 실행할 수 있거든요.


이것은 마치 사람이 말하는 것처럼 자연스럽게 읽힙니다.


아래 예시에서 첫 번째 작업이 먼저 실행되고 성공하면 결제 작업이 이어지는데요.


어느 한쪽이라도 실패하면 catch 블록에서 에러를 잡아내게 됩니다.



```typescript
angelMowersPromise
    .then(() => myPaymentPromise.then(res => console.log(res)))
    .catch(error => console.log(error))
```
이제 프론트엔드 프로그래밍에서 흔히 볼 수 있는 네트워크 요청 예시를 살펴볼 거거든요.


원격 서버에서 직원 목록을 가져와서 응답하는 일반적인 작업 패턴입니다.



```typescript
const api =  'http://dummy.restapiexample.com/api/v1/employees'
   fetch(api)
    .then(response => response.json())
    .then(employees => employees.forEach((employee: any) => console.log(employee.id))) // logs all employee id
    .catch(error => console.log(error.message)) // logs any error from the promise
```
때로는 수많은 프로미스를 병렬이나 순차적으로 실행해야 할 때가 있는데요.


이럴 때는 Promise.all이나 Promise.race 같은 구조가 아주 유용하게 쓰입니다.



# 비동기 대기 문법의 이해
async와 await 문법은 자바스크립트에서 프로미스를 다루는 방식을 훨씬 단순하게 만들어주거든요.


프로미스를 마치 동기적인 코드처럼 읽고 쓸 수 있는 직관적인 인터페이스를 제공합니다.


async 키워드가 붙은 함수는 명시하지 않아도 항상 프로미스를 반환하게 되는데요.


컴파일러가 함수를 즉시 해결되는 프로미스로 감싸주기 때문에 수많은 비동기 함수를 다룰 때 매우 편리합니다.


이름에서 알 수 있듯이 이 두 키워드는 항상 실과 바늘처럼 함께 다니거든요.


즉 async 함수 내부에서만 await를 사용할 수 있다는 뜻입니다.



```typescript
const myAsync = async (): Promise<Record<string, number | string>> => {
    await angelMowersPromise
    const response = await myPaymentPromise
    return response
}
```
코드를 보시면 아시겠지만 이전 방식보다 훨씬 가독성이 좋고 동기적으로 보이는데요.


우리는 컴파일러에게 첫 번째 작업의 실행을 먼저 기다린 후 결제 응답을 반환하도록 지시한 것입니다.


그런데 여기서 에러 처리 부분이 빠져있다는 것을 눈치채셨을 텐데요.


프로미스 체이닝에서는 catch 블록을 썼지만 이 문법에서는 try catch 구문을 활용하게 됩니다.



# try catch를 활용한 에러 처리
네트워크 요청은 실패할 확률이 높기 때문에 앞서 보았던 직원 데이터 호출 예시로 에러 처리를 살펴보려 하거든요.


서버가 다운되었거나 요청 자체가 잘못되었을 때 애플리케이션이 멈추는 것을 막으려면 우아하게 에러를 잡아내야 합니다.



```typescript
interface Employee {
    id: number
    employee_name: string
    employee_salary: number
    employee_age: number
    profile_image: string
}

const fetchEmployees = async (): Promise<Array<Employee> | string> => {
    const api = 'http://dummy.restapiexample.com/api/v1/employees'
    try {
        const response = await fetch(api)
        const { data } = await response.json()
        return data
    } catch (error: any) {
        if (error) {
            return error.message
        }
        return 'Unknown error occurred'
    }
}
```
함수를 비동기로 정의했고 직원 배열이나 에러 메시지 문자열을 반환할 것으로 기대하는데요.


따라서 함수의 반환 타입은 유니온 타입을 사용하여 명확하게 지정해 줍니다.


모든 일이 예상대로 진행되면 try 블록 안의 코드가 실행되거든요.


에러가 발생하면 실행 흐름이 즉시 catch 블록으로 넘어가 에러 객체의 메시지를 반환하게 됩니다.



# 고차 함수를 이용한 에러 처리 추상화
전통적인 try catch 블록이 지역적인 에러를 잡는 데는 효과적이지만 너무 자주 사용하면 메인 비즈니스 로직이 지저분해질 수 있는데요.


바로 이럴 때 고차 함수를 도입하면 코드를 훨씬 깔끔하게 관리할 수 있습니다.


고차 함수란 하나 이상의 함수를 인수로 받거나 함수를 반환하는 함수를 말하거든요.


비동기 함수를 감싸서 발생할 수 있는 모든 에러를 처리하는 래퍼 함수를 만들면 핵심 로직과 에러 처리를 분리할 수 있습니다.



```typescript
// Async function to fetch employee data
async function fetchEmployeesData(apiUrl: string): Promise<Employee[]> {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
}

// 고차 함수를 이용한 래퍼
const handleAsyncErrors = async <T>(fn: (...args: any[]) => Promise<T>, ...args: any[]): Promise<T | null> => {
    try {
        return await fn(...args);
    } catch (error) {
        console.error("Caught error:", error);
        return null;
    }
};

const safeFetchEmployees = (url: string) => handleAsyncErrors(fetchEmployeesData, url);

const api = 'http://dummy.restapiexample.com/api/v1/employees';

safeFetchEmployees(api)
    .then(data => {
        if (data) {
            console.log("Fetched employee data:", data);
        } else {
            console.log("Failed to fetch employee data.");
        }
    })
    .catch(err => {
        console.error("Error in safeFetchEmployees:", err);
    });
```
이 예시에서 안전한 호출 함수는 고차 함수를 사용하여 원본 페치 함수를 감싸고 있는데요.


이 구조는 API 호출 중 발생하는 에러를 자동으로 처리하여 로그를 남기고 실패 시 null을 반환합니다.


이러한 패턴은 반복적인 에러 처리 코드를 줄여주어 유지보수성을 크게 높여주는 장점이 있거든요.



# Promise.all을 활용한 동시 실행
앞서 언급했듯이 여러 프로미스를 병렬로 실행해야 하는 상황은 실무에서 아주 빈번하게 발생합니다.


모든 직원을 조회하고 각 직원의 이름을 가져온 뒤 이메일을 생성하는 시나리오를 생각해 볼 수 있는데요.


이 작업들은 순차적으로 진행되어야 하지만 서로를 차단하지 않도록 병렬로도 실행되어야 하거든요.


이럴 때 여러 비동기 작업을 동시에 시작하고 모든 작업이 끝날 때까지 기다려주는 Promise.all을 사용하게 됩니다.



```typescript
const baseApi = 'https://reqres.in/api/users?page=1'
const userApi = 'https://reqres.in/api/user'

const fetchAllEmployees = async (url: string): Promise<Employee[]> => {
    const response = await fetch(url)
    const { data } = await response.json()
    return data
}

const fetchEmployee = async (url: string, id: number): Promise<Record<string, string>> => {
    const response = await fetch(`${url}/${id}`)
    const { data } = await response.json()
    return data
}

const generateEmail = (name: string): string => {
    return `${name.split(' ').join('.')}@company.com`
}

const runAsyncFunctions = async () => {
    try {
        const employees = await fetchAllEmployees(baseApi)
        await Promise.all(
            employees.map(async user => {
                const userName = await fetchEmployee(userApi, user.id)
                const emails = generateEmail(userName.employee_name || 'user')
                return emails
            })
        )
    } catch (error) {
        console.log(error)
    }
}
runAsyncFunctions()
```
여기서 가장 중요한 개념은 await 키워드를 통해 비동기 함수 내에서 코드를 한 줄씩 순차적으로 실행한다는 점인데요.


직원들의 데이터를 맵핑하면서 각각의 독립적인 조회 작업들을 Promise.all로 묶어 동시에 처리합니다.


에러가 발생할 경우에는 실패한 단일 프로미스에서 전체로 전파되어 catch 블록에서 한 번에 잡히게 되거든요.



# Promise.allSettled로 부분적 성공 다루기
모든 작업이 성공해야만 할 때는 Promise.all이 훌륭하지만 실제 애플리케이션에서는 일부가 실패해도 나머지는 처리해야 할 때가 많습니다.


여러 직원의 기록을 일괄 업데이트할 때 네트워크 문제로 몇 개가 실패하더라도 성공한 것들은 반영되어야 하는 상황이 그렇거든요.


이럴 때 유용하게 사용할 수 있는 것이 바로 Promise.allSettled 입니다.


하나라도 실패하면 전체를 멈추는 방식과 달리 이것은 성공과 실패 여부에 상관없이 모든 프로미스가 끝날 때까지 기다려주는데요.



```typescript
interface UpdateResult {
    id: number;
    success: boolean;
    message: string;
}

const updateEmployee = async (employee: Employee): Promise<UpdateResult> => {
    const api = `${userApi}/${employee.id}`;
    try {
        const response = await fetch(api, {
            method: 'PUT',
            body: JSON.stringify(employee),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        return {
            id: employee.id,
            success: true,
            message: 'Update successful'
        };
    } catch (error) {
        return {
            id: employee.id,
            success: false,
            message: error instanceof Error ? error.message : 'Update failed'
        };
    }
};

const bulkUpdateEmployees = async (employees: Employee[]) => {
    const updatePromises = employees.map(emp => updateEmployee(emp));

    const results = await Promise.allSettled(updatePromises);

    const summary = results.reduce((acc, result, index) => {
        if (result.status === 'fulfilled') {
            acc.successful.push(result.value);
        } else {
            acc.failed.push({
                id: employees[index].id,
                error: result.reason
            });
        }
        return acc;
    }, {
        successful: [] as UpdateResult[],
        failed: [] as Array<{id: number; error: any}>
    });

    return summary;
};
```
마치 프로젝트 매니저가 여러 작업을 추적하는 것과 비슷한 이치라고 생각하시면 됩니다.


하나의 태스크가 실패했다고 모든 것을 엎는 대신 전체 태스크를 끝까지 모니터링하고 성공과 실패에 대한 종합 리포트를 제공해 주거든요.



# for await of를 활용한 데이터 스트림 처리
대량의 데이터를 청크나 페이지 단위로 처리해야 할 때는 메모리 과부하를 막기 위한 특별한 접근 방식이 필요합니다.


이때 사용하는 for await of 루프는 특히 최신 AI 개발 프레임워크에서 점점 더 그 중요성이 커지고 있는데요.


OpenAI나 Claude 같은 언어 모델에서 생성된 텍스트를 스트리밍할 때 이 패턴이 아주 유용하게 쓰이거든요.



```typescript
async function fetchAllUsers() {
const users: any[] = []
  let page = 1

  async function* userPages() {
    while (true) {
      const response = await fetch(`/api/users?page=${page}`)
      const data = await response.json()
      if (data.users.length === 0) break
      yield data.users
      page++
    }
  }

  for await (const pageUsers of userPages()) {
    users.push(...pageUsers)
    console.log(`Loaded ${users.length} users so far...`)
  }
  return users
}
```
공장의 컨베이어 벨트처럼 모든 제품이 완성될 때까지 기다리지 않고 벨트에서 내려오는 대로 바로바로 포장하는 방식과 같습니다.


메모리 효율성이 뛰어나고 사용자에게 즉각적인 피드백을 보여줄 수 있어 사용자 경험 측면에서도 엄청난 이점을 가져다 주거든요.



# AbortController를 이용한 비동기 흐름 제어
무거운 AI 모델 호출이나 긴 데이터 처리 과정에서 더 이상 필요 없는 작업을 취소해야 하는 기능은 현대 웹 개발에서 필수적입니다.


이때 AbortController와 AbortSignal API를 활용하면 실행 중인 비동기 작업을 아주 우아하게 중단할 수 있는데요.


사용자가 페이지를 이탈하거나 타임아웃이 발생했을 때 리소스를 절약하기 위한 최적의 도구입니다.



```typescript
async function fetchWithTimeout(url: string, timeoutMs: number = 5000) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, {
      signal: controller.signal,
    })
    return await response.json()
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timed out after ${timeoutMs}ms`)
    }
    throw error
  } finally {
    clearTimeout(timeoutId)
  }
}
```
네트워크 대역폭을 낭비하지 않고 실패를 빠르게 처리하는 이러한 기법은 성능 최적화의 핵심적인 요소인데요.



# 최상위 대기 활용하기
과거에는 await를 사용하려면 반드시 async 함수 안에서만 작성해야만 하는 제약이 존재합니다.


최신 타입스크립트와 Node 환경에서는 모듈의 최상위 레벨에서 곧바로 await를 사용할 수 있는 기능이 추가되었는데요.


이 기능 덕분에 데이터베이스 연결 초기화나 환경 설정 파일을 불러오는 스크립트를 작성할 때 불필요한 래퍼 함수를 만들지 않아도 됩니다.


코드가 훨씬 간결해지고 모듈 초기화 과정에서의 비동기 제어가 매우 직관적으로 변했거든요.



# 구조적 동시성의 이해
자바스크립트 생태계에 구조적 동시성이 내장되어 있지는 않지만 이 개념을 도입하면 비동기 작업을 훨씬 체계적으로 관리할 수 있습니다.


부모 작업은 모든 자식 작업이 끝날 때까지 완료되지 않으며 취소 명령이 계층을 따라 올바르게 전파되는 구조를 의미하는데요.


앞서 배운 AbortController와 프로미스 관리를 결합하면 타입스크립트에서도 이러한 패턴을 직접 구현할 수 있습니다.


하나의 하위 작업이 실패하면 즉시 형제 작업들을 취소시켜 불필요한 리소스 낭비를 막는 안전장치를 마련하는 셈인데요.



# 고차 함수와 비동기 배열 메서드의 결합
배열 데이터를 다룰 때 map 함수 내부에 비동기 콜백을 넣으면 프로미스 배열이 반환된다는 점을 주의해야 합니다.


이때는 반드시 Promise.all로 감싸서 해결해야 하며 filter나 reduce를 사용할 때도 프로미스 특성을 고려한 별도의 처리가 필요하거든요.


또한 자주 호출되는 비동기 함수의 결과를 임시로 저장해두는 캐싱 고차 함수를 만들면 성능을 비약적으로 끌어올릴 수 있습니다.


동일한 데이터 요청을 단시간에 여러 번 보낼 때 네트워크 왕복을 줄여주는 아주 스마트한 기법인데요.



# Awaited 유틸리티 타입
타입스크립트에서는 중첩된 프로미스의 껍질을 벗겨내고 최종적인 데이터 타입만 추출해 주는 Awaited라는 유틸리티 타입을 제공합니다.


이 타입은 비동기 함수 내에서 await 연산자가 수행하는 동작을 타입 시스템 수준에서 완벽하게 모델링한 것인데요.



```typescript
type MyPromise = Promise<string>;
type AwaitedType = Awaited<MyPromise>; // AwaitedType will be 'string'
```
then 체이닝 안에서 복잡하게 얽힌 응답 값의 타입을 유추할 때 명시적인 타입 선언 없이도 컴파일러가 알아서 타입을 추론하도록 돕는 역할을 합니다.



# 마무리
타입스크립트에서 async와 await를 마스터하는 것은 현대적이고 반응성이 뛰어난 애플리케이션을 구축하기 위한 핵심 열쇠인데요.


이번 글에서는 프로미스의 기초부터 시작해 에러 처리와 고급 제어 기법까지 폭넓게 다루어 볼 수 있습니다.


타입스크립트의 강력한 타입 안정성과 이러한 비동기 도구들을 잘 결합하면 유지보수와 디버깅이 수월한 견고한 코드를 작성하실 수 있을 거거든요.


여러분의 프로젝트에도 이 멋진 패턴들을 적극적으로 도입해 보시기를 권장합니다.


