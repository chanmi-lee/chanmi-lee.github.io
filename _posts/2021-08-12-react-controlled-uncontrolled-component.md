---
layout: post
title: "[React] Controlled vs Uncontrolled Component"
date: 2021-08-12
categories: [react, component, controlledcomponent, uncontrolledcomponent]
disqus_comments: true
pretty_table: true
toc:
  sidebar: left
---

## 🎯 React 제어 컴포넌트 vs 비제어 컴포넌트

React에서 폼을 다룰 때 가장 먼저 부딪히는 개념 중 하나가 바로 제어(Controlled) 컴포넌트와 비제어(Uncontrolled) 컴포넌트입니다. 이 두 방식은 입력값을 어떻게 관리하느냐에 따라 나뉘며, 각각 장단점과 사용 목적이 다릅니다.

이번 포스팅에서는 이 두 가지 개념을 정의, 차이점, 코드 예시를 통해 쉽게 이해해보겠습니다.

---

### 제어 컴포넌트 (Controlled Component)

정의: 입력 요소의 상태(value)를 React 컴포넌트의 state로 관리하는 방식입니다.
즉, 입력값의 소유권이 React에 있습니다.

#### 특징

- 모든 값은 useState나 this.state로 관리됨
- onChange 이벤트 핸들러를 통해 state를 업데이트
- React가 폼의 상태를 전적으로 제어

예제

{% highlight javascript linenos%}
import React, { useState } from 'react';

function ControlledForm() {
const [name, setName] = useState('');

const handleChange = (e) => {
setName(e.target.value);
};

const handleSubmit = (e) => {
e.preventDefault();
alert(`입력한 이름: ${name}`);
};

return (
<form onSubmit={handleSubmit}>
<input type="text" value={name} onChange={handleChange} />
<button type="submit">제출</button>
</form>
);
}
{% endhighlight%}

---

### 비제어 컴포넌트 (Uncontrolled Component)

정의: 입력 요소의 상태를 DOM이 직접 관리하는 방식입니다.
즉, 입력값의 소유권이 실제 HTML 요소에 있습니다.

특징

- ref를 사용해 DOM 요소에 직접 접근
- 상태를 직접 추적하지 않아 코드가 간단할 수 있음
- 외부 라이브러리 또는 레거시 코드와 호환성이 좋음

예제

{% highlight javascript linenos%}
import React, { useRef } from 'react';

function UncontrolledForm() {
const nameRef = useRef(null);

const handleSubmit = (e) => {
e.preventDefault();
alert(`입력한 이름: ${nameRef.current.value}`);
};

return (
<form onSubmit={handleSubmit}>
<input type="text" ref={nameRef} />
<button type="submit">제출</button>
</form>
);
}
{% endhighlight %}

---

### Summary

| 항목         | 제어 컴포넌트             | 비제어 컴포넌트                |
| ------------ | ------------------------- | ------------------------------ |
| 상태 관리    | React `state`             | DOM 자체                       |
| 접근 방식    | `value`와 `onChange` 사용 | `ref`를 통한 DOM 접근          |
| 폼 동기화    | 가능 (일관된 상태 유지)   | 어려움                         |
| 초기 값 설정 | `useState`로 직접 설정    | `defaultValue` 속성 사용       |
| 적합한 상황  | 복잡한 폼, 유효성 검사    | 간단한 입력, 빠른 프로토타이핑 |

---

#### 📝 어떤 걸 써야 할까?

- 제어 컴포넌트: 대부분의 경우 추천. 특히 유효성 검사, 조건부 렌더링, 실시간 폼 제어가 필요할 때.
- 비제어 컴포넌트: 간단한 입력, 퍼포먼스에 민감하거나 외부 라이브러리 연동 시 유용.

#### 💬 마무리

React에서 폼 데이터를 다루는 방법은 다양하지만, 그 핵심은 제어와 비제어의 차이를 이해하는 데 있습니다. 어떤 방식이 더 좋다고 단정할 수는 없으며, 상황에 맞는 선택이 중요합니다.

여러분은 어떤 방식이 더 익숙한가요? 댓글로 여러분의 경험을 공유해주세요! 😊
