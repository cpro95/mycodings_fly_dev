---
slug: 2023-09-11-enhanced-tutorial-of-react-hook-form
title: React Hook Form 사용법 완결판 - 고급편
date: 2023-09-10 13:07:22.669000+00:00
summary: React Hook  Form 고급 사용 방법
tags: ["react-hook-form", "react"]
contributors: []
draft: false
---

안녕하세요?

react-hook-form 두 번째 강좌인 고급편입니다.

지난 시간 강좌는 아래 링크입니다.

[React Hook Form 사용법 완결판 - 초급편](https://mycodings.fly.dev/blog/2023-09-10-all-in-one-about-react-hook-form)

** 목차 **

1. [useForm 함수의 defaultValues 알아보기](#1-useform-함수의-defaultvalues-알아보기)
2. [FormValues 항목에 중첩된 객체가 있는 경우](#2-formvalues-항목에-중첩된-객체가-있는-경우)
3. [FormValues 항목에 배열이 있는 경우](#3-formvalues-항목에-배열이-있는-경우)
4. [useFieldArray 함수로 즉석에서 FormValues 항목 늘리고 줄이기](#4-usefieldarray-함수로-즉석에서-formvalues-항목-늘리고-줄이기)
5. [FormValues 항목에서 문자열이 아닌 number 타입이나 date 타입 사용하기](#5-formvalues-항목에서-문자열이-아닌-number-타입이나-date-타입-사용하기)
6. [watch를 이용해서 실시간으로 FormValues 감시하기](#6-watch를-이용해서-실시간으로-formvalues-감시하기)
7. [getValues, setValue 함수로 자바스크립트에서 FormValues 직접 제어하기](#7-getvalues-setvalue-함수로-자바스크립트에서-formvalues-직접-제어하기)
8. [touchedFields, dirtyFields, isDirty 함수 알아 보기](#8-touchedfields-dirtyfields-isdirty-함수-알아-보기)
9. [폼 항목 disable 하기](#9-폼-항목-disable-하기)
10. [handleSubmit 에러 발생시](#10-handlesubmit-에러-발생시)
11. [폼 Submit disabled 시키기](#11-폼-submit-disabled-시키기)
12. [폼 Submission 상태 값과 reset 함수](#12-폼-submission-상태-값과-reset-함수)
13. [유효성 검증(Validation)의 심화 방식](#13-유효성-검증validation의-심화-방식)
14. [외부 라이브러리와의 조합](#14-외부-라이브러리와의-조합)
---

## 1. useForm 함수의 defaultValues 알아보기

우리가 만들려고 하는 폼의 input 칸에 기본 값을 넣는 방법이 있습니다.

바로 defaultValues 값을 넣어주면 되는데요.

```js
const {
  register,
  control,
  handleSubmit,
  formState: { errors },
} = useForm <
FormValues >
{
  defaultValues: {
    username: 'IU',
    email: '',
    password: '',
  },
}
```

이와 같은 방식으로 넣으면 됩니다

defaultValues 항목에 다른 서버에서 얻은 값을 넣으려면 어떻게 할까요?

defaultValues 항목에 async 함수를 넣어 주면 됩니다.

"jsonplaceholder.typicode.com"의 FAKE REST API를 이용해 보겠습니다.

```js
const {
  register,
  control,
  handleSubmit,
  formState: { errors },
} = useForm <
FormValues >
{
  defaultValues: async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/users/1')
    const data = await response.json()
    return {
      username: data.username,
      email: data.email,
      password: '',
    }
  },
}
```

실행 결과를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEjtdl0o9ZqsOG9IoZs147CikHCrP1zT8VH6E_xmBQsVqiChjNIZw3Fhy97Qa0qbol7tqPJ7Fm0wifH1uADYkATvyozrhIV8aNGbGcCCPgyz5u_MVUN-DimhIHk2YXY0So5XRqKwD7dW8Yn0utzjWFcJ1QMjdEl4oWmBhB4Zq2zS17id7E6fkf9fvNkrZVc)

아주 좋습니다.

---

## 2. FormValues 항목에 중첩된 객체가 있는 경우

우리가 폼으로 입력받고 싶은 항목을 FormValues 타입으로 정의했었는데요.

어떨 경우는 FormValues 타입에 중첩된 객체(Nested Object)를 사용해야 할 경우가 있습니다.

이런 경우 어떻게 사용하는지 살펴보겠습니다.

코드의 간편함을 위해 password 항목을 삭제하겠습니다.

```js
type FormValues = {
  username: string;
  email: string;
  social: {
    github: string;
    twitter: string;
  };
};

export default function MyForm() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      username: "IU",
      email: "",
      social: {
        github: "",
        twitter: "",
      },
    },
  });

...
...
}
```

위와 같이 defaultValues를 설정했고, HTML 코드는 아래와 같이 작성합니다.

```js
...
...
<p>{errors.email?.message}</p>
<label htmlFor="github">Github</label>
<input
  type="text"
  id="github"
  {...register("social.github", {
    required: "Github account is required!",
  })}
/>
<p>{errors.social?.github?.message}</p>
<label htmlFor="twitter">Twitter</label>
<input
  type="text"
  id="twitter"
  {...register("social.twitter", {
    required: "Twitter account is required!",
  })}
/>
<p>{errors.social?.twitter?.message}</p>
<button>Submit</button>
...
...
```

Validation에 required를 줬습니다.

실행결과를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEjDX35PsEehiGMuXl8B6KtEfUKV59bE9Qhg5hTLEMEJKAzfLqcHM8tJvVh1XpcG7ghHB8rgz_MT819AfCR18EBbepq_A68UD-MrBvq02GfbOlQXTDG1raTXer71JFGnk4L6OXIFi-SuUUFnyBZLZeL5ajsLpjYSTJ3cMyOTaMUQXB4nJVfKuVY0rK23fKU)

![](https://blogger.googleusercontent.com/img/a/AVvXsEj7ZXgikRx8lbD8WZ6HCAGFJ2NCdFlsTdIC99s2cIHzn7ZS7jEqpQwZ983U0lPWO0bOwVI5_5ULJ9JVpAQR8ojBJXlU7tO2Qgl5kLyuiAnRssjc6jdfe3PyZ0jJ_vN_fn7BLrqQZgROrADLdipOusdVtLiyY6cHmr6MbtkhWpPO2sFqNJKjcEE7R_aN5PE)

두 번째 그림에서 콘솔창을 보면 social이란 객체가 있고, 그 안에 github, twitter 항목에 우리가 입력한 값이 잘 저장되어 있습니다.

---

## 3. FormValues 항목에 배열이 있는 경우

우리가 얻고자 하는 폼에 관련 정보가 유사성이 있으면 객체 말고 배열로 받고 싶은 경우가 있습니다.

전화번호가 대표적인데요.

유선, 무선 전화번호를 phoneNumbers라는 항목으로 배열로 지정하여 코드를 작성해 보겠습니다.

```js
type FormValues = {
  username: string;
  email: string;
  social: {
    github: string;
    twitter: string;
  };
  phoneNumbers: string[];
};

export default function MyForm() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      username: "IU",
      email: "",
      social: {
        github: "",
        twitter: "",
      },
      phoneNumbers: ["", ""],
    },
  });
...
...
}
```

위와 같이 phoneNumbers라는 배열을 지정했고, 배열에 저장할 정보의 개수는 빈 따옴표 개수로 정해집니다.

우리는 2개만 지정했네요.

이제 JSX 코드를 볼까요?

코드의 간결함을 위해 social과 phoneNumbers 부분에서 errors 관련 부분은 빼겠습니다.

```
<p>{errors.email?.message}</p>

<label htmlFor="github">Github</label>
<input type="text" id="github" {...register("social.github")} />

<label htmlFor="twitter">Twitter</label>
<input type="text" id="twitter" {...register("social.twitter")} />

<label htmlFor="wired">Wired phone</label>
<input type="text" id="wired" {...register("phoneNumbers.0")} />

<label htmlFor="wireless">Wireless</label>
<input type="text" id="wireless" {...register("phoneNumbers.1")} />

<button>Submit</button>
```

"phoneNumbers.0" 과 "phoneNumbers.1" 처럼 ".0", ".1" 방식으로 배열의 첫 번째 항목, 두 번째 항목을 지정했습니다.

실행 결과는 아래와 같습니다.

크롬 콘솔 창 내용입니다.

```bash
Form submitted.
{username: 'IU', email: '', social: {…}, phoneNumbers: Array(2)}
email: ""
phoneNumbers: (2) ['02', '010']
social: {github: 'aaa', twitter: 'aaa'}
username: "IU"
[[Prototype]]: Object
```

배열 항목에 phoneNumbers 값이 잘 들어가 있네요.

---

## 4. useFieldArray 함수로 즉석에서 FormValues 항목 늘리고 줄이기

phoneNumbers는 딱 2개만 입력받을 수 있게 지정했는데요.

React-Hook-Form에는 useFieldArray라는 강력한 함수를 제공해 줍니다.

UI상에서 가변적으로 입력 항목을 늘리고 줄일 수 있는데요.

phNumbers라는 항목으로 예제를 만들어 보겠습니다.

```js
type FormValues = {
  username: string;
  email: string;
  social: {
    github: string;
    twitter: string;
  };
  phoneNumbers: string[];
  phNumbers: {
    number: string;
  }[];
};

export default function MyForm() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      username: "IU",
      email: "",
      social: {
        github: "",
        twitter: "",
      },
      phoneNumbers: ["", ""],
      phNumbers: [{ number: "" }],
    },
  });
```

위와 같이 phNumbers 항목을 객체의 배열로 지정했고, defaultValues 안에는 한개만 명시했습니다.

defaultValues안에는 최소 한 개는 명시되어 있어야 합니다.

defaultValues까지 지정했으면 useFieldArray 훅을 실행해야 하는데요.

```js
import { useForm, useFieldArray } from "react-hook-form";

export default function MyForm() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      username: "IU",
      email: "",
      social: {
        github: "",
        twitter: "",
      },
      phoneNumbers: ["", ""],
      phNumbers: [{ number: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "phNumbers",
    control: control,
  });

  ...
  ...
  ...
}
```

useFieldArray 훅에는 FormValues의 name 값과, React-Hook-Form의 컨트롤 값이 control을 넘겨줘야 합니다.

useFieldArray가 리턴하는 객체에는 fields, append, remove 항목이 있는데요.

JSX 부분을 작성하면서 알아보겠습니다.

JSX 부분에서는 즉석에서 추가, 삭제하는 로직이 들어갑니다.

wireless 부분 다음에 위치합니다.

```js
<label htmlFor="wireless">Wireless</label>
<input type="text" id="wireless" {...register("phoneNumbers.1")} />

<div>
  <label>List of Phone Numbers</label>
  <div>
    {fields.map((field, index) => {
      return (
        <div key={field.id}>
          <input
            type="text"
            {...register(`phNumbers.${index}.number`)}
          />
          {index > 0 && (
            <button type="button" onClick={() => remove(index)}>
              Remove
            </button>
          )}
        </div>
      );
    })}
    <button type="button" onClick={() => append({ number: "" })}>
      Add phone number
    </button>
  </div>
</div>

<button>Submit</button>
```

코드를 조금 살펴보면 useFieldArray가 제공해주는 fields 라는 배열을 이용해서 map으로 iterate한 다음에,

각 iterate된 항목에 input 태그를 넣어 줬습니다.

넣어준 input 태그에는 register 함수를 사용해서 react-hook-form에 등록을 시켰는데요.

`phNumbers.${index}.number` 형식으로 진행했습니다.

그리고 맨 밑에 "Add phone number" 버튼을 만들었는데요.

이 버튼을 누르면 useFieldArray 훅이 리턴 하는 append 함수를 작동시킵니다.

append 함수는 말 그대로 fields 배열에 항목을 하나 추가한다는 뜻입니다.

브라우저에서 보면 아래 그림처럼 계속 input 태그가 늘어나는 걸 볼 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjROpGl7vPlozhfn871OTyHdMzvY7scdSCIdhk4-v0W8PH0I2_hSzhEVI-yRIxoukPJka9D6UilH5lKrpTI-V9CtFHjLYZXe6P6Eo3M6NlZCwLHpb5YrgpMltxZMP1OqZszBcGqSZA-jehwPuqhjjVg-MEiuJ4yiA0RKkP55lk42gt_OKiZQyo8iOQS4Ig)

그리고 useFieldArray 가 리턴 하는 remove 함수도 적용했는데요.

remove 함수에는 index 숫자를 넣어주면 해당 index의 항목을 fields 배열에서 삭제하게 됩니다.

최종 실행 결과입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEi-M38oCB6oCM-csSdoS2dIH9tuMTrkKYTYcP6PSKHbWZWSv2E3ZJ8QrRJBbOQOH_REuDmkgJa5NTajE02pHoFoWVvwfcHKbxji_gOH9flVN0i1wEmmzXdG8qCpHdd0u4ywO1FMfHZQVZJ7Cx9McJqfhIx1kBLE3FIh3f4bh73PgJsCoDKEszaqZ0EjgoA)

useFieldArray 훅은 정말 강력한 기능을 수행할 수 있네요.

---

## 5. FormValues 항목에서 문자열이 아닌 number 타입이나 date 타입 사용하기

지금까지 FormValues 항목에는 전부 string 즉, 문자열 타입만 작성했는데요.

이제는 number 타입이나 date 타입도 작성해 보겠습니다.

코드의 간결함을 위해 불필요한 거는 주석 처리 하겠습니다.

```js
import { useForm, useFieldArray } from 'react-hook-form'
import { DevTool } from '@hookform/devtools'

let renderCount = 0

type FormValues = {
  username: string,
  age: number,
  dob: Date,
}

export default function MyForm() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm <
  FormValues >
  {
    defaultValues: {
      username: 'IU',
      age: 0,
      dob: new Date(),
    },
  }

  const onSubmit = (data: FormValues) => {
    console.log('Form submitted.', data)
  }

  renderCount++
  return (
    <div className='w-full p-4'>
      <h1 className='mb-5 text-2xl'> Render count : {renderCount / 2}</h1>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className='w-1/3'>
          <label htmlFor='username'>Username</label>
          <input
            type='text'
            id='username'
            {...register('username', {
              required: 'Username is required.',
            })}
          />
          <p>{errors.username?.message}</p>
          <label htmlFor='age'>Age</label>
          <input
            type='number'
            id='age'
            {...register('age', {
              required: 'Age is required.',
            })}
          />

          <label htmlFor='dob'>Date of birth</label>
          <input
            type='date'
            id='dob'
            {...register('dob', {
              required: 'Date of birth is required.',
            })}
          />
          <button>Submit</button>
        </div>
      </form>
      <DevTool control={control} />
    </div>
  )
}
```

age 항목에는 input type을 number라고 지정했고, dob 항목에는 date라고 지정했습니다.

결과를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEhPXPRenj6u7Rd5IKhniRCV2UbWm8KZF63qiO0aJosvD99fLmoKSTa4dnxjJjAZ8PKcyIukyQmhoaAyemBXorOesscK_EkebKcnni581R-AVGicjC12RHg_uwpFyYYik4oFOrRwdKiRjR14XQQcaJi-Pem0H79e_VEqjK0_zvOsJoB0A1qeMXYETADGZck)

위와 같이 콘솔창에는 age, dob가 모두 문자열로 나옵니다.

input type 항목만으로는 number, date 타입이 작동하지 않습니다.

register 함수의 두 번째 인자에 주어지는 객체에 valueAsNumber 항목과 valueAsDate 항목을 추가하고 true라고 명기해야 합니다.

```js
<label htmlFor="age">Age</label>
<input
  type="number"
  id="age"
  {...register("age", {
    valueAsNumber: true,
    required: "Age is required.",
  })}
/>

<label htmlFor="dob">Date of birth</label>
<input
  type="date"
  id="dob"
  {...register("dob", {
    valueAsDate: true,
    required: "Date of birth is required.",
  })}
/>
```

이제 실행 결과는 아래와 같이 age는 숫자 타입, dob는 Date 타입으로 입력받게 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgJPMd0MhAATULjdbEWCNhRy3zsnZEmoI2P6hB6bnyT9fsfvV9DNtcwme8fzIA-F_pG9DAxrSflIiRdOmTMLAMLM0_DzI82Lu65Nakx8X1lqaSi5btD52XwAp6qMEBZXdAURCawlZZ5wTFYzaUkFNdhIpr03eQq_1_NgrjuSoPZUmym-r8ughmrJ9fuxe4)

---

## 6. watch를 이용해서 실시간으로 FormValues 감시하기

useForm() 함수에는 watch 함수를 제공해 주는데요.

이 watch 함수를 이용하면 사용자가 현재 입력하고 있는 값을 실시간으로 감시할 수 있습니다.

```js
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      username: "IU",
      age: 0,
      dob: new Date(),
    },
  });

  const watchForm = watch("username");
  const watchForm2 = watch("age");

  renderCount++;
  return (
    <div className="w-full p-4">
      <h1 className="text-2xl mb-5"> Render count : {renderCount / 2}</h1>
      <h2 className="text-xl mb-5">
        watch value : {watchForm} and {watchForm2}
      </h2>
    ...
    ...
    ...
  )
}
```

위와 같이 작성했습니다.

실행 결과는 아래와 같습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjy5p6kXYm9RxJUgDcoEx3DQIAioJcdkwlSPzYJq-xZbWAdtNbVCmnIIXcTVItbFxK4HqrnF30Y-7P894zozJ3ZwIkvS1270zCs2AHMIvv2bSg3bwKioQC_-S9FDQI_asb74kOToWtYSWpV1lSViG-fekuoCPjWddMDaKxkHtSy6Cx_QNNmFL4yPTNnBtc)

위에서 username은 문자열이고 age는 숫자라서 watch 함수를 두 개 사용했는데요.

만약 email 항목이 있다면 watch("username", "email") 이렇게 같이 작성할 수 있습니다.

그리고 watch() 함수 안에 아무것도 넣지 않으면 Form 전체를 가리킵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjWij5oI8KckMy50nmjBOVjN8Qn1amt7HFkz0XeW4T5FPBofnDSc5BJP1gGTdCjFC2aEaGQgDcGSPe4LsXRTsvvx7_hbvfSK7kduP5qvDZa6CqTCCdGPVUVv0BT1i8nCP-DxXrvWofC6aSKHO67qrz-mdKfDeIZxme4CV7teNDgA53NaSQmjsfJEp-XOA8)

위 그림을 보시면 리액트가 리렌더링 되는 게 심상치 않습니다.

그래서 보통 watch 함수는 useEffect 함수 안에 subscription, unsubscribe 방식으로 작성해야 합니다.

```js
import { useEffect } from 'react'

const {
  register,
  control,
  handleSubmit,
  watch,
  formState: { errors },
} = useForm <
FormValues >
{
  defaultValues: {
    username: 'IU',
    age: 0,
    dob: new Date(),
  },
}

useEffect(() => {
  const subscription = watch(value => {
    console.log(value)
  })

  return () => subscription.unsubscribe()
}, [watch])

// const watchForm = watch();
// const watchForm2 = watch("age");
```

실행 결과를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEgXxSA1hhCxhNGZwtPFMpl24q_yOMnG_zy0qAy7DZpl-tHgKbhpp56Ktw3dD2KDGLocczMXOcrEPWCvRlqX8e2YI_xRhbEeBinGAX8WUrqBkoPAdMoo_RchIAEe6J2_0DURQ6Is4KA9EDfnuTDgPh8ZxV8u-ShZ9BwC85g_ZUtrh4MEDBTkl1imJpfEsSw)

위 그림과 같이 콘솔 창에 실시간으로 watch 함수가 폼 데이터를 보여주고 있지만 리 렌더링이 전혀 일어나지 않고 있습니다.

---

## 7. getValues, setValue 함수로 자바스크립트에서 FormValues 직접 제어하기

React-Hook-Form의 useForm 함수는 여러 가지 기능을 제공하는데요.

getValues(), setValue() 함수도 제공합니다.

```js
const {
  register,
  control,
  handleSubmit,
  watch,
  getValues,
  setValue,
  formState: { errors },
} = useForm <FormValues >
{
  defaultValues: {
    username: 'IU',
    age: 0,
    dob: new Date(),
  },
}

const handleGetValues = () => {
  console.log("Values", getValues());
}

const handleSetValue = () => {
    setValue("username", "", {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
}

...
...

return (
...
...
<button>Submit</button>
<button type="button" onClick={handleGetValues}>getValues</button>
<button type="button" onClick={handleSetValue}>setValue</button>
...
...
)
```

위 코드처럼 button을   만들었고 각각 getValues(), setValue() 함수가 작동하게 했고, 그 결과를 

![](https://blogger.googleusercontent.com/img/a/AVvXsEhE99V3zAE6L5zGHIUgF8o7lowuBtrx3cpGtJFBla-PY2uVC7Ke007AlGGomfBCO6mPZ7Onoy8xuP0VFq7_-0mpOdEi272hW8-0hlYioTOpFuZOgiZ-baCaJ_JnwskmBELS_CTXZJEC6gSbWXjDzqM7n9QGdjpohlu9dBGwYuBXxABNAuX0osjsQXwKNUo)
위 그림은 getValues 버튼을 누른 결과입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEilNzQM0T8Wm9DqJzICwOsdhSH1XogpahWR5i60SBuAPvMejBZ5X2MLMY8flxVwTmIXFWxD4kCHH16TNeJyQUOBfhglYmNUcXaUwYpCgEEl9n7qiw3P4eUoigWgegP7OE-QbL56w9I6-9E7i23D2VTUOg9FyFLwEuuaXHY3xMDAUlxIasfjpyj-7m821B0)

위 그림은 setValue 버튼을 누른 결과인데요.

setValue 함수에는 세 번째 인자로 객체를 넣을 수 있고, shouldDirty, shouldTouch, shouldValidate 항목을 지정할 수 있습니다.

그래서 위 그림과 같이 오른쪽 DevTool에서 보면 Touch, Dirty등이 바뀐 게 보일 거고, shouldValidate 항목이 true 값이라서 Validation 작업도 이루어졌습니다.

---

## 8. touchedFields, dirtyFields, isDirty 함수 알아 보기

아까 setValue 함수에서 shouldDirty, shouldTouch, shouldValidate 항목에 true, false 값을 넣을 수  있다고 했었는데요.

Touched , Dirty 의 뜻이 뭘까요?

사용자가 폼의 input에 포커스를 한 번이라도 가져갔다면 TouchhedFields 항목에 포함됩니다.

그리고 dirtyFields에는 defaultValues와 다른 값이라면 그 항목은 dirtyFields 항목에 포함되죠.

그리고 isDirty는 현재의 Dirty 상태를 나타내 주죠.

사용 방법은 formState에서 각각의 항목을 디스트럭쳐링 해서 써야 합니다.

```js
const {
    register,
    control,
    handleSubmit,
    watch,
    getValues, setValue,
    formState: { errors, touchedFields, dirtyFields, isDirty },
  } = useForm<FormValues>({
    defaultValues: {
      username: "IU",
      age: 0,
      dob: new Date(),
    },
  });

  console.log({touchedFields, dirtyFields, isDirty});
```

실행 결과를 볼까요?

아래와 같이 username 부분에 뭘 추가했습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhAV-txYK37RHPWXz_RSA_EN6MmpyFg-jRVpSlJRqBPUZJpDDJt6m64zzcHAl0IcUhcGx5x-AA_nuTMdaMoCMo0WQbbN13-BxmfVECqHRnMSGADCeN5mNHxPgBlfQzJRVMk8dCo2N1RZbXP7jp9MyznsQ3EI6UCLWO7dnKuxc3LvhKaXdSS3t4a3k9pBKU)

그러면 아래와 같이 콘솔 창에 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhiJazLqoyRg56IQru21561IAOXem_Na7Cs8AVfGO0jGC_NWeUog-O53Ad4YaFgeJzON3LOqaAVJeRZ2e8O6_UPydgpyy8NRkmT8ccfmus0GrqMKRIUr3TU3alpLxVymdaLQtvApn1KAvyf-cD37XfkTpHm1UVCHr6bvVsACdPNw6RBkuJK5QxWWUfK5to)

dirtyFields에 usename 항목이 true로 들어가 있고, 당연히 touchedFields 에도 들어가 있습니다.

isDirty는 당연히 true입니다.

이제, username 부분을 defaultValues 값인 "IU"라고 바꾸겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEh4kfg9rUUNQWskvyAJ-61SbOR6r-HaeP6AMd2snldgqX_9-kz1MSjph7aupCtJKOg-bblg55xzJYyVbTadYepFgUqpl4cGwRohRnyktQbmRLvxa7nVeI9CuLFdEtRGwW-iHon-by7gJWvzCtAEa6D6ncpJjUb_n-F_a--W4I80hfFQZFnp8oWrqE_SFHA)

그러면 아래와 같이 콘솔 창에 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiErZVuIfoZ9xUcWwTxbQLYGkPAbs6T-XJw0DNiI6Ft1NPDRrWma61aymWedbJ53DzJwxNM-nI-paVTbma6wgPjOLnf8U_ojJuULZ8YiNtYyDJYbjCndZwRuBSpqC99GCfbCszyKuvBxM9MWIEV9B1FnTTEbB9Bv-pUlbsajmLsxjr8zE40q9AxJM6-qeY)

touchedFields는 계속 그 상태이고, dirtyFields와 isDirty 값이 변했네요.

이제 구분이 되실 겁니다.

---

## 9. 폼 항목 disable 하기

HTML 태그에는 disabled 항목이 있는데요.

버튼에 disabled 항목이 추가되면 입력이 안 됩니다.

React-Hook-Form에도 disabled 항목이 있는데요.

이 항목이 true이면, 입력도 안되고 해당 항목은 undefined가 됩니다.

그리고 해당 항목에 지정되어 있던 validation도 적용이 되지 않습니다.

그리고 disabled를 watch함수와 같이 쓸 수 있는데요.

코드를 보겠습니다.

```js
<input
  type="number"
  id="age"
  {...register("age", {
    disabled: watch("username") === "",
    valueAsNumber: true,
    required: "Age is required.",
  })}
/>
```

usename 항목이 비어있다면 true가 될 거고, 그러면 disabled 항목이 true가 되면서 결국 "age" 항목은 입력이 안되게 됩니다.

disabled 항목 사용법은 wach 함수와 응용해서 사용하시면 됩니다.

---

## 10. handleSubmit 에러 발생시

useForm() 함수가 리턴 하는 handleSubmit 함수를 이용해서 폼의 Submit 핸들링을 담당하는 함수를 지정했었습니다.

그런데, Submit이 실패했을 때도 핸들링할 수 있는 함수를 제공하는데요.

handleSubmit 함수에 두 번째 인자가 폼 Submit이 실패했을 때 실행되는 콜백함수입니다

```js
<form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
```

위 코드와 같이 onSubmit 함수는 우리가 Submit이 성공했을 때 작동되도록 만든 함수이고,

onError 함수는 Submit이 실패했을 때 작동되도록 만들 예정인 함수입니다

```js
import { useForm, useFieldArray, FieldErrors } from "react-hook-form";

  const onError = (errors: FieldErrors<FormValues>) => {
    console.log("Form errors", errors)
  }
```
위와 같이 FieldErrors 항목을 import 하고 errors에 대한 타입을 위와 같이 지정해 주면 됩니다.

onError 함수는 폼의 Validation 에러가 나도 작동됩니다.

아래 그림을 보시면 username을 빈칸으로 한 다음  submit 버튼을 눌렀을 때 콘솔창입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhoz6Y4L59D97ZecRzs_BAYGpz1Ms-TOxu-H9JErRy_TvhKr76xDSOQCOCV0c3sTc16fl73uSYNtB28_5Vkrqsfp7COT5ttC2gZJOxdwUN4_IYkgOXBZbHZevLTVTORYeuz37S9Ly6wj9LsUj1XG-7ZMPSVUcgt5nSaeARXCRy6sH_mtNSWpMLgn8pwxy4)

이렇게 onError 함수는 에러 발생 시 좀 더 커스텀하게 에러 메시지를 핸들링하기 위한 함수입니다.

---

## 11. 폼 Submit disabled 시키기

폼의 Submit 버튼을 조건에 따라 disabled 시키는 방법입니다.

필요한 함수는 isDirty 값과 isValid 값인데요.

```js
formState: { errors, touchedFields, dirtyFields, isDirty, isValid },
```

formState에서 가져오시면 됩니다

그리고 아래 Submit 버튼이 있는 HTML에서 아래와 같이 고치면 됩니다.

```js
<button disabled={!isDirty || !isValid}>Submit</button>
```

즉, 유저가 폼에 한 번도 접근 안 했을 경우 Submit 버튼을 disabled 한다는 뜻이고,

isValid는 Validation 통과를 얘기하니까 통과 안 됐을 때 disabled 한다는 뜻입니다.

---

## 12. 폼 Submission 상태 값과 reset 함수

React-Hook-Form의 formState에는 폼 Submission 상태 값이 4개가 있는데요.

```js
isSubmitting,
isSubmitted,
isSubmitSuccessful,
submitCount
```

요렇게 4가지인데요.

사용 방법은 formState에서 가져오면 됩니다.

```js
const {
    register,
    control,
    handleSubmit,
    watch,
    getValues,
    setValue,
    formState: {
      errors,
      touchedFields,
      dirtyFields,
      isDirty,
      isValid,
      isSubmitting,
      isSubmitted,
      isSubmitSuccessful,
      submitCount,
    },
  } = useForm<FormValues>({
    defaultValues: {
      username: "IU",
      age: 0,
      dob: new Date(),
    },
  });
```

isSubmitting 상태는 submit 버튼을 눌렀을 때고,

isSubmitted 상태는 submit이 눌러져서 벌써 액션이 취해졌을 때입니다.

그리고 isSubmitSuccessful은 submit이 성공적으로 작동했을 때를 나타내고,

submitCount는 성공적인 submit의 갯수를 나타냅니다.

그래서 Submit 버튼의 disabled 코드는 아래와 같이 확장할 수 있습니다.

```js
<button disabled={!isDirty || !isValid || isSubmitting}>Submit</button>
```

그리고, 가장 중요한 reset 함수가 있는데요.

말 그대로 reset 함수는 폼의 입력 값을 defaultValues 값으로 바꾸는 함수입니다.

이 reset 함수가 언제 유용하게 쓰이냐면 Submit이 성공했을 때 폼 값을 초기화하는 거죠.

아니면 직접 reset 버튼을 눌러 유저가 Clear 버튼 누르듯 지금까지 입력한 값을 지울 때 사용하면 됩니다.

```js
const {
    register,
    control,
    handleSubmit,
    watch,
    getValues,
    setValue,
    reset,
    formState: {
      errors,
      touchedFields,
      dirtyFields,
      isDirty,
      isValid,
      isSubmitting,
      isSubmitted,
      isSubmitSuccessful,
      submitCount,
    },
  } = useForm<FormValues>({
    defaultValues: {
      username: "IU",
      age: 0,
      dob: new Date(),
    },
  });
```

Clear 버튼을 Submit 버튼 다음에 만들겠습니다.

```js
<button disabled={!isDirty || !isValid || isSubmitting}>Submit</button>
<button type="button" onClick={()=>reset()}>Clear</button>
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEj6lO-SNlM8QXxBOR17Hy-AkgLGUjMXgcTUAGqd817KSp2me5f1rHXFiyvu-D41PsU0rKWaSoy0fP9MqEJ3vjWlD7JCav280-9lbAdLtSfC975wuAoWCl1o9lDwe9aJ_SGJZKuVeFeu73e-FezVYe6CxRMh25JZsC-xhIxzUEvlTpEwH2HfVZSiYiOuXoE)

위와 같이 Clear 버튼을 직접 만들어도 됩니다.

아니면 Submit 버튼이 눌러졌을 때 reset() 함수를 실행해도 됩니다.

onSubmit 함수 안에 넣으면 될 거 같은데요. 아닙니다.

이럴 경우 useEffect 훅을 이용해야 합니다.

그리고 isSubmitSuccessful 상태값과 같이 사용해야 합니다.

```js
useEffect(()=>{
  if(isSubmitSuccessful) { 
    reset()
  }
},[isSubmitSuccessful, reset])
```

위와 같이 해야 합니다.

이제 Submit 버튼을 누르면 reset 함수에 의해 초기화 될겁니다.

---

## 13. 유효성 검증(Validation)의 심화 방식

우리가 React-Hook-Form을 쓰는 이유는 클라이언트 상에서 유효성 검증을 쉽게 하기 위해서 인데요.

그래서 React-Hook-Form은 유효성 검증에서 다음과 같은 3가지의 심화된 방식도 제공합니다.

첫 번째, 비동기식 유효성 검증입니다.

간혹 커스텀 Validation할 때 외부 사이트에서 정보를 가져와서 비교할 때가 있는데요.

비동기식(async,await) 방식도 지원합니다.

이메일 부분에 지난 시간에 만든 커스텀 Validation이 2개가 있었는데요.

한 개를 추가해 보겠습니다.

이 Validation은 비동기식으로 통신해서 얻은 결과를 비교하게 됩니다.

코드의 간결성을 위해 username과 email만 남기겠습니다.

```js
type FormValues = {
  username: string;
  email: string;
};

export default function MyForm() {
  const {
    register,
    control,
    handleSubmit,
    watch,
    getValues,
    setValue,
    reset,
    formState: {
      errors,
      touchedFields,
      dirtyFields,
      isDirty,
      isValid,
      isSubmitting,
      isSubmitted,
      isSubmitSuccessful,
      submitCount,
    },
  } = useForm<FormValues>({
    defaultValues: {
      username: "IU",
      email: "",
    },
  });

...
...
...

<label htmlFor="email">E-mail</label>
<input
  type="email"
  id="email"
  {...register("email", {
    pattern: {
      value:
        /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
      message: "Email is invalid.",
    },
    validate: {
      noAdmin: (fieldValue) => {
        return (
          fieldValue !== "admin@fly.dev" ||
          "You can not use admin@fly.dev!"
        );
      },
      noBlackList: (fieldValue) => {
        return (
          !fieldValue.endsWith("daum.net") ||
          "This domain is not supported."
        );
      },
      emailCheck: async (fieldValue) => {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/users?email=${fieldValue}`
        );
        const data = await response.json();
        return data.length == 0 || "Email already exists";
      },
    },
  })}
/>
<p>{errors.email?.message}</p>

...
...
...
}
```

위와 같이 emailCheck이란 커스텀 Validation을 추가했습니다.

REST API는 기존처럼 jsonplaceholder를 사용했고요.

해당 이메일이 있으면 즉, 배열의 갯수가 0이 아니라면 "Email already exists" 문구를 에러 메시지로 내보냅니다.

테스트를 위해 아래 button submit의 disabled  항목에서 isValid 부분만 지우겠습니다.

```js
<button disabled={!isDirty || isSubmitting}>Submit</button>
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEgFndXXhCW-OjAb8t6r-ArPk-pwZcwdhRajgxiTN6o76fZq9ibI5e5uzrW03dT0vocl_i9ahzvXf_rFGjBblpXlJ_QItv8AIcU1sUYDEWAUFa9_wZLUeqs-E2lA-LFniheRgJChqEtG73GjWF6VdSMjTQWQPDxx4wspZrMcLMeR-dzjVj-fmi6tsmQcIA0)

실행 결과는 위와 같습니다.

기존에 이메일 있다고 에러가 나오네요.

두 번째, Validation 모드를 제공해 줍니다.

React-Hook-Form은 Validation을 언제 시행할 지도 옵션으로 제공해 주는데요.

다음 그림처럼 총 5가지가 있습니다.

all, onBlur, onChange, onSubmit, onTouched

![](https://blogger.googleusercontent.com/img/a/AVvXsEjUiaG52AclYdjJlrERtT2A5I0bDY2zJBfps4RuTC0SGF4Ilpq0Fji7g-Rf8yPr3h9wtaPxUgTz-ETKjkzuhBq4yIR-CpWQ1jmtcXqEQgEtp1qn4lp4NE7Evr83sMq_xLf-lvsxV2-WFwSuC0ET2ztu7mVtPlVTD8gwwaYPqXy0aGy4Z0d-YvIIv-OA_J8)

모드를 지정하는 방법은 

```js
const {
    register,
    control,
    handleSubmit,
    watch,
    getValues,
    setValue,
    reset,
    formState: {
      errors,
      touchedFields,
      dirtyFields,
      isDirty,
      isValid,
      isSubmitting,
      isSubmitted,
      isSubmitSuccessful,
      submitCount,
    },
  } = useForm<FormValues>({
    defaultValues: {
      username: "IU",
      email: "",
    },
    mode: 'onSubmit'
  });
```

위 코드에서 지정하면 됩니다.

디폴트는 'onSubmit'입니다.

submit 버튼을 눌렀을 때 Validation 행위가 일어나는 겁니다.

onBlur 는 커서를 input에 위치시켰다가 다시 input 폼을 벗어난 곳에 클릭하게 되면 이때 Validation 행위가 일어나게 됩니다.

만약, email 부분에 required 항목을 추가했다고 합시다.

그러면, email에 커서를 놓았다고 다시 화면 밖을 클릭하면 폼을 벗어난게 되어서 onBlur에  의해 Validation 행위가 일어나며 Email 부분에 에러 메시지가 뜨게 됩니다.

세 번째, onTouched 는 onBlur 방식을 일부 빌린겁니다.

onBlur 방식이 커서가 input 태그를 벗어났을 때 Validation 행위가 일어나는 거라면, onTouched 방식은 첫 번째 blur Event에 실행되며, 그 이후로는 아무 변화(onChange)에도 반응합니다.

onChange 방식은 한 글자 한 글자 칠 때마다 Validation 행위가 일어나는 겁니다.

마지막으로 all 방식은 onBlur + onChange 방식을 조합한 방식입니다.

Validation mode는 브라우저의 과부하를 유발할 수 있으니 주의하여 선택 하시기 바랍니다.

세 번째, 수동으로 Validation 행위를 하라고 지시할 수 있습니다.

trigger 함수를 불러오면 되는데요.

```js
const {
    register,
    control,
    handleSubmit,
    watch,
    getValues,
    setValue,
    reset,
    trigger // 여기
    formState: {
      errors,
      touchedFields,
      dirtyFields,
      isDirty,
      isValid,
      isSubmitting,
      isSubmitted,
      isSubmitSuccessful,
      submitCount,
    },
  } = useForm<FormValues>({
    defaultValues: {
      username: "IU",
      email: "",
    },
    mode: 'onSubmit'
  });
```

그리고, 맨 밑에 버튼을 추가해 봅시다.

```js
<button type="button" onClick={() => trigger()}>
  Validate
</button>
```

위와 같이 작성하면 이 버튼을 누를 때마다 수동으로 Validation 행위를 일으킬 수 있습니다.

아니면 필요한 부분만 일으킬 수 도 있는데요.

```js
<button type="button" onClick={() => trigger("email")}>
  Validate
</button>
```

여러 개를 넣고 싶으면 문자열의 배열 방식으로 쓰시면 됩니다.

---

## 14. 외부 라이브러리와의 조합

React-Hook-Form은 외부 라이브러리와의 조합도 지원하는데요.

Typescript에서 타입 체크하는 라이브러리는 Yup와 Zod가 유명합니다.

이 2개 모두 지원하는데요.

```bash
npm install yup zod @hookform/resolvers
```

yup을 이용한 코드 작성을 위해 NewForm 을 새로 만들겠습니다.

```js
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

let renderCount = 0;

const schema = yup.object({
  username: yup.string().required("username is required"),
  email: yup.string().email("email is not valid").required("email is required"),
});

type FormValues = {
  username: string;
  email: string;
};

export default function NewForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      username: "",
      email: "",
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted.", data);
  };

  renderCount++;
  return (
    <div className="w-full p-4">
      <h1 className="text-2xl mb-5"> Render count : {renderCount / 2}</h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="w-1/3">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" {...register("username")} />
          <p>{errors.username?.message}</p>
          <label htmlFor="email">E-mail</label>
          <input type="email" id="email" {...register("email")} />
          <p>{errors.email?.message}</p>

          <button>Submit</button>
        </div>
      </form>
    </div>
  );
}
```

실행해 보시면 잘 작동할 겁니다.

두 번째, zod 연결 부분입니다.

```js
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';

let renderCount = 0;

const schema = z.object({
  username: z.string().nonempty("username is required"),
  email: z.string().nonempty("email is required").email("email is not valid")
});

type FormValues = {
  username: string;
  email: string;
};

export default function NewForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      username: "",
      email: "",
    },
    resolver: zodResolver(schema),
  });
```

zod는 email 부분에서 nonempty 메서드가 먼저 나와야 합니다.

테스트해 보시면 잘 작동할 겁니다.

나머지 코드는 yup과 똑같습니다.

세 번째, Material-UI 같은 라이브러리와 어떻게 조합이 될까요?

먼저, Material-UI를 설치하겠습니다.

```bash
npm install @mui/material @emotion/react @emotion/styled
```

```js
import { TextField, Button, Stack } from "@mui/material";
import { useForm } from "react-hook-form";

type FormValues = {
  email: string;
  password: string;
};
export default function MUIForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted.", data);
  };

  return (
    <>
      <h1 className="text-4xl my-8">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2} width={400}>
          <TextField
            label="Email"
            type="email"
            {...register("email", {
              required: "Email is required",
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            label="Password"
            type="password"
            {...register("password", { required: "password is required" })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button type="submit" variant="contained" color="primary">
            Login
          </Button>
        </Stack>
      </form>
    </>
  );
}
```

MUI를 이용한 React-Hook-Form도 아래 그림과 같이 아주 잘 작동하네요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgyI1gfJEiLu546sOfelHxYZ4j3lQVPyj1HZ1GLVRQDSu9TY-98tjgOgmtJ55NiQaJBwqO8ITTXE7Vy9yLBMzqdij272I9KyQbklxfiQWjol5rdF_tqV4w28PRs3ML0WIpuuKVJwGKA3YPOmRgZWoAR7VOei_HpPxMbePirVRL3eZOQJl7lpSJDY4cDJnk)

![](https://blogger.googleusercontent.com/img/a/AVvXsEjdKiRsBKKQJKtU4U761bzviKnjpij8u7wWn_EKcWQhG0Vp-qlMdCa7ZQ6I5rXPW_V_WX8C6YvtFwNElEk433zQvhAHeEAZlD4gT12rpbHQ-DfCX4ysrdgGhPqc1rkwoJnWp47J5lX02kBClT6mvm6V5v-k7qj-JXOWJsgExdMwSDLxJVKQiwsLPX1aEEc)

---

지금까지 React-Hook-Form의 사용법 완결판 - 고급판이었습니다.

많은 도움이 되었으면 합니다.

그럼.
