---
layout: post
title: "Refs in React"
date: 2020-04-12
categories: [React, useRef]
disqus_comments: true
toc:
  sidebar: left
---

### Refs and the DOM

Refs는 `render` 메소드를 통해 생성된 DOM node 혹은 React 요소에 접근하는 방법입니다.

React의 데이터 흐름에서, `props`는 부모 컴포넌트와 자식 컴포넌트가 소통하는 유일한 방법입니다. 자식 컴포넌트에 영향을 주기 위해, 새로운  `props`를 통해 이를 re-render 할 수 있습니다.

예외적으로, 이러한 일반적인 데이터 흐름과 달리 자식 컴포넌트에 직접적인 접근을 해야하는 몇 가지 사례가 있습니다.
- input / textarea 등에 포커스를 줄 때
- 특정 DOM과 관련된 정보 (크기, 위치 등)를 가져오거나 설정을 해야할 때
- DOM과 관련된 외부 라이브러리를 사용할 때
등이 있습니다.

---

### Refs 생성하기

Refs는 `React.createRef()`를 통해 생성되며, `ref` 속성을 통해 React 요소와 결합됩니다. Ref는 일반적으로 구성 요소가 생성될 때 해당 요소의 속성으로 지정되므로, 전체에서 참조될 수 있습니다.

{% highlight javascript linenos%}
class MyComponent extends React.Component {
  constructor(props) {
    super(props)
    this.myRef = React.createRef()
  }
  render() {
    return <div ref={this.myRef} />
  }
}
{% endhighlight %}

---

### Refs 접근하기

Refs가 `render` 메소드를 통해 전달될 때, 해당 요소에의 접근은 ref의 `current` 속성에 의해 가능합니다.

`const node = this.myRef.current`

ref의 값은 노드 타입에 따라 달라집니다.

- ref 속성이 HTML element에 사용될 때, 생성자에 의해 생성된 ref는 해당 HTML element 하위의 요소를 `current`로 받아옵니다.
- ref 속성이 custom class component에 생성될 때, ref 객체는 mount된 컴포넌트 자체를 `current`로 받아옵니다.
- ref 속성은 함수형 컴포넌트에서는 사용할 수 없습니다.

> HTML element에 ref 추가하기

{% highlight javascript linenos%}
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props)
    // create a ref to store the textInput DOM element
    this.textInput = React.createRef()
    this.focusTextInput = this.focusTextInput.bind(this)
  }

  focusTextInput() {
    // Explicitly focus the text input using the raw DOM API
    // Note: we're accessing "current" to get the DOM node
    this.textInput.current.focus()
  }

  render() {
    // tell React that we want to associate the <input> ref
    // with the `textInput` that we created in the constructor
    return (
      <div>
        <input
          type="text"
          ref={this.textInput} />
        <input
          type="button"
          value="Focus the text input"
          onClick={this.focusTextInput}
        />
      </div>
    )
  }
}
{% endhighlight %}

CustomTextInput 컴포넌트가 mount 될 때, 리액트는 해당 DOM element에 `current` 속성을 부여하며, unmount 될 때 이를 `null`로 되돌려줍니다. ref 업데이트는 `componentDidMount` 혹은 `componentDidUpdate` lifecycle 메소드 전에 발생합니다.


> Class component에 ref 추가하기

위에서 생성한 CustomTextInput 컴포넌트를 mount 된 직후 클릭된 것처럼 감싸고 싶다면, 아래와 같이 ref를 사용하면 됩니다.

{% highlight javascript linenos%}
class AutoFocusTextInput extends React.Component {
  constructor(props) {
    super(props)
    this.textInput = React.createRef()
  }

  componentDidMount() {
    this.textInput.current.focusTextInput()
  }

  render() {
    return (
      <CustomTextInput ref={this.textInput} />
    )
  }
}
{% endhighlight %}

> Refs와 함수형 컴포넌트

기본적으로, 함수형 컴포넌트에서는 ref 속성을 사용할 수 없습니다.

{% highlight javascript linenos%}
function MyFunctionComponent() {
  return <input />
}

class Parent extends React.Component {
  constructor(props) {
    super(props)
    this.textInput = React.createRef()
  }
  render() {
    // This will *not* work!
    return (
      <MyFunctionComponent ref={this.textInput} />
    )
  }
}
{% endhighlight %}

함수형 컴포넌트에서 ref를 사용하고 싶다면, `forwardRef`를 대신 사용하거나 ([useImperativeHandle](https://reactjs.org/docs/hooks-reference.html#useimperativehandle)과 함께 사용), 함수형 컴포넌트를 클래스 컴포넌트로 전환하길 권장합니다.

또는, 함수형 컴포넌트가 DOM element 혹은 클래스 컴포넌트를 참조하는 경우에 한하여, ref 속성을 사용할 수도 있습니다.

{% highlight javascript linenos%}
function CustomTextInput(props) {
  // textInput must be declared here so the ref can refer to it
  const textInput = useRef(null)

  function handleClick() {
    textInput.current.focus()
  }

  return (
    <div>
      <input
        type="text"
        ref={textInput} />
      <input
        type="button"
        value="Focus the text input"
        onClick={handleClick}
      />
    </div>
  )
}
{% endhighlight %}

---

🔗 참조

📌 [Refs and the DOM](https://reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs)

📌 [Hook API Tutorial - useImerativeHandle](https://reactjs.org/docs/hooks-reference.html#useimperativehandle)
