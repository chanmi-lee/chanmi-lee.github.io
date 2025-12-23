---
layout: post
title: "Hooks in React"
date: 2020-07-19
categories: [React, hooks]
disqus_comments: true
toc:
  sidebar: left
---

### Hooks 개요

Hooks은 **리액트 16.8** 부터 새롭게 추가된 내용입니다.
Hooks을 사용하면 클래스를 작성하지 않고도 state 및 다른 리액트 기능들을 사용할 수 있습니다.

Hooks은 이전 리액트 버전과 호환됩니다. 아래 내용이 다소 빠르다고 느끼거나 리액트에 친숙하지 않다면, 아래 페이지를 참고해주세요:

> 왜 리액트는 Hooks을 새롭게 추가하였을까? ([Link](https://reactjs.org/docs/hooks-intro.html#motivation))

### 📌 State Hook

아래 예제는 카운터를 렌더링합니다. 버튼을 클릭하면, 값이 증가합니다:

{% highlight javascript linenos%}
import React, { useState } from 'react'

function Example() {
  // count라는 이름의 state 변수를 선언합니다.
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  )
}
{% endhighlight%}

여기서 `useState`가 Hook입니다.
함수 컴포넌트 내에서 이를 호출하여 로컬 상태를 추가합니다.
리액트가 컴포넌트를 다시 랜더링하는 동안에도 이 state는 그대로 보존됩니다.
`useState`는 현재 state 값과 이를 업데이트 할 수 있는 함수 쌍을 반환합니다.
이벤트 핸들러나 혹은 어디서든 이 함수를 호출 할 수 있습니다.

이는 클래스에서의 `this.setState`와 비슷하지만, 이전 state와 새로운 state를 병합하지 않는다는 점에 차이가 있습니다.
([Hooks state](https://reactjs.org/docs/hooks-state.html) 에서 `useState`와 `this.state`를 비교하는 예제를 확인하실 수 있습니다.)

`useState`의 유일한 인수는 initial state입니다. 위의 예제를 살펴보면, 카운터는 0부터 시작하기 때문에 initial state 값은 0입니다.
`this.state`와 달리, state는 객체일 필요는 없습니다. initial state argument는 초기 렌더링에만 사용됩니다.

### 다수의 state 변수 선언하기

한 컴포넌트에서 State Hook를 여러 번 사용할 수도 있습니다.

{% highlight javascript linenos%}
function ExampleWithManyStates() {
  // Declare multiple state variables!
  const [age, setAge] = useState(42)
  const [fruit, setFruit] = useState('banana')
  const [todos, setTodos] = useState([{ text: 'Learn Hooks' }])
  // ...
}
{% endhighlight%}

배열 디컨스트러링을 통해 useState를 사용하여 state 변수에 다른 이름을 사용할 수 있습니다.
이 이름들은 useState API의 일부는 아닙니다만, 리액트는 useState가 여러번 호출되면, 모든 랜더링 중에 동일한 순서로 수행한다고 가정하게 됩니다.
이와 같이 작동하는 이유와 언제 이것이 유용한지는 추후에 살펴보겠습니다.

### Hook의 정의와 용도

**Hooks은 함수로 리액트 state와 함수 컴포넌트의 라이프사이클 기능을 연결합니다.**
Hooks은 클래스 내에서는 동작하지 않습니다. (기존 클래스 컴포넌트를 다시 작성하는 것은 추천하지 않지만 원하는 경우 새로운 컴포넌트에서 Hook을 사용할 수 있습니다.)

리액트는 useState처럼 몇가지의 **내장 Hooks을 제공** 합니다.
또한 서로 다른 컴포넌트간의 stateful behavior을 재사용하기위한 자체 Hooks (또는 custom Hooks) 을 생성할 수도 있습니다.
먼저 내장 Hooks을 살펴보겠습니다.

### ⚡️ Effect Hook

데이터 가져오기, 구독, 또는 리액트 컴포넌트로부터 DOM을 변경한 적이 있나요?
이러한 작업은 다른 컴포넌트에 영향을 끼칠 수도 있고 렌더링하는 동안 수행할 수 없기 때문에 `연쇄 작용 (또는 효과 - 원문에는 side effect)`라고 합니다.

`useEffect`은 함수 컴포넌트로부터 이러한 부작용을 수행하는 기능을 추가합니다.
`useEffect`는 리액트 클래스의 `componentDidMount`, `componentDidUpdate`, `componentWillUnmount`와 동일한 용도로 사용되지만 하나의 API로 통합되었습니다.
몇 가지 예제를 통해 `useEffect`와 라이프사이클 메소드를 비교해보겠습니다.

예를 들어, 이 컴포넌트는 리액트가 DOM을 업데이트 한 뒤에 문서의 제목을 지정합니다:

{% highlight javascript linenos%}
import React, { useState, useEffect } from 'react'

function Example() {
  const [count, setCount] = useState(0)

  // componentDidMount, componentDidUpdate와 유사:
  useEffect(() => {
    // browser API 를 사용하여 문서 제목을 업데이트
    document.title = `You clicked ${count} times`
  })

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  )
}
{% endhighlight%}

`useEffect`를 호출하면, DOM의 변경된 부분을 비운 뒤 effect 함수를 실행합니다.
effect는 컴포넌트 내부에 선언되며 따라서 컴포넌트의 props와 state에 접근할 수 있습니다.
기본적으로, 첫 번째 랜더링을 포함하여 매번 랜더링 한 뒤에 effect가 실행됩니다.
([Using the Effect Hook](https://reactjs.org/docs/hooks-effect.html)에서 클래스 라이프사이클과 조금 더 자세히 비교해봅니다.)

Effects는 또한 함수를 '정리'하여 반환하는 방법이기도 합니다.
예를 들어, 이 컴포넌트를 사용하여 친구의 온라인 상태를 구독하거나 구독을 취소하며 정리합니다.

{% highlight javascript linenos%}
import React, { useState, useEffect } from 'react'

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null)

  function handleStatusChange(status) {
    setIsOnline(status.isOnline)
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange)
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange)
    }
  })

  if (isOnline === null) {
    return 'Loading...'
  }
  return isOnline ? 'Online' : 'Offline'
}
{% endhighlight%}

이 예제에서, 리액트는 컴포넌트가 언마운트 될 때와 렌더링으로 인해 효과가 다시 실행되기 전에, Chat API을 통해 구독을 취소합니다.
(원한다면, ChatAPI에 전달한 `props.friend.id`가 변하지 않은 경우 재구독을 건너뛰게 하는 방법도 있습니다.)

`useState`처럼, 컴포넌트에서 하나 이상의 effect를 사용할 수 있습니다.

{% highlight javascript linenos%}
function FriendStatusWithCounter(props) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    document.title = `You clicked ${count} times`
  })

  const [isOnline, setIsOnline] = useState(null)
  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange)
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange)
    }
  })

  function handleStatusChange(status) {
    setIsOnline(status.isOnline)
  }
  // ...
}
{% endhighlight%}

Hooks을 사용하면 라이프사이클 메소드에 기반한 분할을 강요하지 않고, 관련된 부분 (예: 구독 추가 및 제거)에 따라 컴포넌트의 side effects을 구성할 수 있습니다.

#### Hooks의 법칙들

Hooks는 자바스크립트 함수지만, 두 가지 추가적인 법칙을 따릅니다.

- Hooks는 **최상위 레벨에서만 호출**합니다. 루프나, 조건문 또는 중첩 함수 내에서 사용하지 않습니다.
- Hooks는 **리액트 함수 컴포넌트에서만 호출**합니다. 일반적인 자바스크립트 함수에서 사용하지 않습니다. (단, Custom Hooks은 예외로 하며 이에 대해선 이어서 살펴봅니다.)

이 법칙을 자동으로 강제하기 위해 [`linter plugin`](https://www.npmjs.com/package/eslint-plugin-react-hooks) 을 제공합니다.
처음에는 이 법칙들이 제한적이거나 혼란스럽게 느껴질 수 있지만, 이는 Hooks이 잘 동작하도록 하는데 필수입니다.

> 좀 더 자세한 설명은 [Rules of Hooks](https://reactjs.org/docs/hooks-rules.html) 에서 확인할 수 있습니다.

#### Custom Hooks 만들기

때로는 컴포넌트 간에 상태 저장 로직을 재사용하고 싶을 때도 있을 것입니다.
일반적으로, 이런 경우 다음의 두 가지 방법이 사용됩니다: [`higher-order components`](https://reactjs.org/docs/higher-order-components.html) 와 [`render props`](https://reactjs.org/docs/render-props.html)
Custom Hooks을 사용하면, 더 많은 컴포넌트를 트리에 추가하지 않고도 이 작업을 수행할 수 있습니다.

초반에, `FriendStatus` 컴포넌트를 소개하며 친구들의 온라인 상태를 구독하는 `useState`와 `useEffect` Hooks을 호출하는 방법을 살펴보았습니다.
이 로직을 다른 컴포넌트에서 재사용하려면 어떻게 해야할까요?

먼저, 이 로직을 `useFriendStatus`라는 Custom Hooks으로 분리합니다.

{% highlight javascript linenos%}
import React, { useState, useEffect } from 'react'

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null)

  function handleStatusChange(status) {
    setIsOnline(status.isOnline)
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange)
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange)
    }
  })

  return isOnline
}
{% endhighlight%}

`useFriendStatus`는 `friendID`를 인수로 받아, 친구의 온라인 여부를 반환해줍니다.
이를 아래의 컴포넌트들에서 사용할 수도 있습니다.

{% highlight javascript linenos%}
function FriendStatus(props) {
  const isOnline = useFriendStatus(props.friend.id)

  if (isOnline === null) {
    return 'Loading...'
  }
  return isOnline ? 'Online' : 'Offline'
}
{% endhighlight%}

{% highlight javascript linenos%}
function FriendListItem(props) {
  const isOnline = useFriendStatus(props.friend.id)

  return (
    <li style={%raw%}{{ color: isOnline ? 'green' : 'black' }}{%endraw%}>
      {props.friend.name}
    </li>
  )
}
{% endhighlight%}

이 컴포넌트들의 state는 완전히 독립적입니다. Hooks는 상태 저장 로직을 재사용하는 하나의 방법일 뿐, state 그 자체는 아닙니다.
사실, 각각의 Hooks 호출은 완전히 별개의 state를 가지므로 하나의 컴포넌트에서 같은 custom Hooks을 두 번 사용할 수도 있습니다.

**Custom Hooks은 하나의 기능이라기 보다 규칙에 좀 더 가깝습니다.**
만약 함수의 이름이 `use`로 시작하고 다른 Hooks을 호출한다면, 우리는 이를 custom Hook이라 합니다.
`useSomething` 이름 규칙은 linter plugin이 Hooks를 사용하여 코드에서 버그를 찾는 방법입니다.

폼 핸들링, 애니메이션, 선언적 구독, 타이머 및 그 외 좀 더 광범위한 사용 사례를 포함하는 custom Hooks을 작성할 수도 있습니다.
리액트 커뮤니티가 어떤 custom Hooks을 만들어낼 지 기대됩니다.

> [Building Your Own Hooks](https://reactjs.org/docs/hooks-custom.html) 에서 custom Hooks에 대해 좀 더 자세히 알아볼 수 있습니다.

#### 내장 Hooks 사례들

일반적으로 사용되진 않지만, 유용한 내장 Hooks들도 있습니다.
예를 들어, `useContext`를 사용하면 중첩 없이도 React 컨텍스트를 구독할 수 있습니다.

{% highlight javascript linenos%}
function Example() {
  const locale = useContext(LocaleContext)
  const theme = useContext(ThemeContext)
  // ...
}
{% endhighlight%}

또한, `useRender`를 사용하면 복잡한 컴포넌트의 로컬 state를 관리할 수 있습니다.

{% highlight javascript linenos%}
function Todos() {
  const [todos, dispatch] = useReducer(todosReducer)
  // ...
}
{% endhighlight%}

> [Hooks API Reference](https://reactjs.org/docs/hooks-reference.html) 에서 내장 Hooks에 대한 자세한 내용을 확인 할 수 있습니다.


---

🔗 참조

📌 [Hook overview :: React Official Docs](https://reactjs.org/docs/hooks-overview.html)
