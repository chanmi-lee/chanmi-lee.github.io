---
layout: post
title: "HOC in React"
date: 2020-04-27
categories: [React, HOC, HigherOrderComponent, DRY, DoNotRepeatYourself]
disqus_comments: true
toc:
  sidebar: left
---

### Higher-Order Component?

HOC는 컴포넌트 로직을 사용하기 위한 React의 고급 기법입니다.
HOC는 그 자체로 React API는 아닙니다.
React의 구성 방식으로부터 파생된 패턴이라고 이해할 수 있습니다.

구체적으로 HOC는 컴포넌트를 파라미터로 받아 이를 새로운 컴포넌트로 돌려주는 하나의 함수라고 이해할 수 있습니다.

```jsx
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```

HOC를 통하여 컴포넌트에 특정 기능을 부여할 수 있습니다.
컴포넌트는 props를 변형하여 UI에 넘기는 것과 달리, HOC는 컴포넌트를 변형하여 이를 또 다른 컴포넌트에 넘겨줍니다.
HOC는 3rd party 라이브러리에서 흔히 찾아볼 수 있는데 대표적인 예로는 Redux의 [connect](https://github.com/reduxjs/react-redux/blob/master/docs/api/connect.md#connect)와 Relay의 [createFragmentContainer](http://facebook.github.io/relay/docs/en/fragment-container.html)가 있습니다.

이제부터는 HOC가 유용한 이유와 어떻게 HOC를 작성할 수 있는지 알아보고자 합니다.

---

### HOC의 유용성

> 이전에는 관심사의 분리(cross-cutting concerns)을 다루기 위한 방법으로 `mixins`을 사용하길 권장하였습니다.
> 그러나, 이 방법이 다소 많은 문제점을 야기한다는 것을 알게 되었습니다.
> [링크](https://reactjs.org/blog/2016/07/13/mixins-considered-harmful.html) 를 참고하시면, 왜 우리가 mixins를 지양해야하며 어떻게 기존 컴포넌트를 변화시킬 수 있는지 이해하는데 도움이 될 것입니다.

React에서 컴포넌트는 코드를 재사용하는 주요한 코드의 단위입니다.
그러나, 다음의 패턴들은 일반적으로 컴포넌트를 사용하는데 맞지 않음을 알 수 있습니다.

예를 들어, 댓글 목록을 렌더링하기 위해 외부 리소스를 subscribe하는 `CommentList`라는 컴포넌트가 있다고 합시다.

{% highlight javascript linenos%}
class CommentList extends React.Component {
constructor(props) {
super(props)
this.handleChange = this.handleChange.bind(this)
this.state = {
// "DataSource" is some global data source
comments: DataSource.getComments()
}
}

    componentDidMount() {
      // Subscribe to changes
      DataSource.addChangeListener(this.handleChange)
    }

    componentWillUnmount() {
      // Clean up listener
      DataSource.removeChangeListener(this.handleChange)
    }

    handleChange() {
      // Update component state whenever the data source changes
      this.setState({
        comments: DataSource.getComments()
      })
    }

    render() {
      return (
        <div>
          {this.state.comments.map((comment) => (
            <Comment comment={comment} key={comment.id} />
          ))}
        </div>
      )
    }

}
{% endhighlight %}

또한, 같은 패턴을 가지며 하나의 포스트를 위한 `BlogPost`라는 이름 컴포넌트를 작성합니다.

{% highlight javascript linenos%}
class BlogPost extends React.Component {
constructor(props) {
super(props)
this.handleChange = this.handleChange.bind(this)
this.state = {
blogPost: DataSource.getBlogPost(props.id)
}
}

componentDidMount() {
DataSource.addChangeListener(this.handleChange)
}

componentWillUnmount() {
DataSource.removeChangeListener(this.handleChange)
}

handleChange() {
this.setState({
blogPost: DataSource.getBlogPost(this.props.id)
})
}

render() {
return <TextBlock text={this.state.blogPost} />
}
}
{% endhighlight %}

`CommentList`와 `BlogPost`는 써로 다른 DataSource를 참조하는 메소드를 호출한다는 점과 다른 결과물을 렌더링한다는 점에서는 완전히 동일하지는 않습니만,
다음의 공통점이 있습니다.

- 마운트될 때(componentDidMount), DataSource로의 change listener를 추가한다.
- 리스너 내부에, 데이터가 변경될 때마다 setState를 호출한다 (handleChange).
- 언마운트될 때(componentWillUnmount), change listener를 제거한다.

---

### HOC 작성하기

HOC의 이름을 만들 땐, `with____` 형식으로 짓습니다.

HOC의 원리는 파라미터로 컴포넌트를 받아오고 함수 내부에서 새 컴포넌트를 만든 다음에 해당 컴포넌트 안에서 파라미터로 받아온 컴포넌트를 렌더링하는 것입니다.
그리고 자신이 받아온 props들은 그대로 파라미터로 받아온 컴포넌트에게 다시 주입해주고 필요에 따라 추가 props도 넣어줍니다.

우선 HOC의 틀을 작성해보겠습니다.

{% highlight javascript linenos%}
const CommentListWithSubscription = withSubscription(
CommentList,
(DataSource) => DataSource.getComments()
)

const BlogPostWithSubscription = withSubscription(
BlogPost,
(DataSource, props) => DataSource.getBlogPost(props.id)
)
{% endhighlight %}

`CommentList`와 `BlogPost`와 같이 DataSource를 참조하는 컴포넌트를 생성하는 함수를 작성하였습니다.
이 함수는 참조하는 데이터를 props로 컴포넌트에 전달하며 이를 함수의 인자(argument)로 받습니다.

첫 번째 파라미터는 감싸진 컴포넌트(Wrapped component) 입니다.
두 번째 파라미터는 우리가 알고자 하는 데이터로 이를 DataSource로 받아와 props로 넘겨줍니다.

{% highlight javascript linenos%}
// This function takes a component...
function withSubscription(WrappedComponent, selectData) {
// ...and returns another component...
return class extends React.Component {
constructor(props) {
super(props)
this.handleChange = this.handleChange.bind(this)
this.state = {
data: selectData(DataSource, props)
}
}

    componentDidMount() {
      // ... that takes care of the subscription...
      DataSource.addChangeListener(this.handleChange)
    }

    componentWillUnmount() {
      DataSource.removeChangeListener(this.handleChange)
    }

    handleChange() {
      this.setState({
        data: selectData(DataSource, this.props)
      })
    }

    render() {
      // ... and renders the wrapped component with the fresh data!
      // Notice that we pass through any additional props
      return <WrappedComponent data={this.state.data} {...this.props} />
    }

}
}
{% endhighlight %}

> HOC는 다른 컴포넌트를 감싸는 컴포넌트일 뿐입니다.

HOC는 원래의 컴포넌트를 변형하지 않을 뿐 아니라, 상속을 사용하여 컴포넌트의 동작을 복제하지 않습니다.
오히려, HOC는 원본 컴포넌트를 컨테이너 컴포넌트와 같이 감싸는 컴포넌트일 뿐입니다. HOC는 순수 함수로써 아무런 사이드 이펙트가 없습니다.

그게 다입니다!

감싸진 컴포넌트는 컨테이너의 모든 props를 받아와 새로운 props (위의 예시에서는 data)와 함께 새로운 결과를 렌더링합니다.
HOC는 어떻게 혹은 왜 데이터가 쓰이는지 관심이 없고 감싸진 컴포넌트는 데이터가 어디로부터 오는지 직접 알 필요가 없습니다.

---

💡 Caveats

HOC를 사용할 때 아래의 내용을 주의해야 합니다.

> render 메소드 내에서 HOC를 사용하지 말 것

React의 diffing algorithm (혹은 reconciliation라고 불린다) 은 기존의 컴포넌트를 그대로 사용할 지 혹은 새로 마운트 할 지 결정하는데 사용됩니다.
`render` 메소드로 반환된 컴포넌트가 기존의 것과 동일하다면, React는 재귀적으로 subtree를 업데이트 합니다. 만약 동일하지 않다면, 기존의 subtree를 완전히 날려버립니다.

일반적으로 이 내용에 대해 고민할 필요는 없습니다. 하지만 컴포넌트의 render 메소드에 HOC를 사용하는 경우는 다릅니다.

{% highlight javascript linenos%}
render() {
// A new version of EnhancedComponent is created on every render
// EnhancedComponent1 !== EnhancedComponent2
const EnhancedComponent = enhance(MyComponent)
// That causes the entire subtree to unmount/remount each time!
return <EnhancedComponent />
}
{% endhighlight %}

여기서 문제는 단순히 성능에만 있지 않습니다. 컴포넌트를 remount할 때 컴포넌트의 state와 모든 자식 컴포넌트 또한 영향을 받습니다.

대신 컴포넌트의 밖에 HOC를 적용하면 결과적으로 컴포넌트는 단 한 번만 생성됩니다.
드문 경우지만 HOC를 동적으로 적용할 필요가 있는 경우, 컴포넌트의 생명 주기 메소드 혹은 생성자(constructor)에 적용하는 방법도 있습니다.

> Static method는 복제된다

가끔 컴포넌트에 static method를 정의하는 것이 유용할 때가 있습니다.

컴포넌트에 HOC를 적용할 때, 기존의 컴포넌트는 컨테이너 컴포넌트에 의해 감싸집니다.
이는 새로운 컴포넌트는 기존 컴포넌트가 가진 어떠한 static method도 가지지 못함을 의미합니다.

{% highlight javascript linenos%}
// Define a static method
WrappedComponent.staticMethod = function() {/_..._/}
// Now apply a HOC
const EnhancedComponent = enhance(WrappedComponent)

// The enhanced component has no static method
typeof EnhancedComponent.staticMethod === 'undefined' // true
{% endhighlight %}

이를 해결하기 위해서는, 기존의 컴포넌트를 돌려주기 전에 컨테이너 컴포넌트에서 메소드를 복제해줘야 합니다.

{% highlight javascript linenos%}
function enhance(WrappedComponent) {
class Enhance extends React.Component {/_..._/}
// Must know excatly which method(s) to copy :(
Enhance.staticMethod = WrappedComponent.staticMethod
return Enhance
}
{% endhighlight %}

그러나 이는 정확히 어떤 메소드를 복제해줘야 할 지 알아야 함을 의미합니다.
`hoist-non-react-statics` 를 사용하면 자동으로 모든 non-React static method를 복제할 수도 있습니다.

{% highlight javascript linenos%}
import hoistNonReactStatic from 'hoist-non-react-statics'
function enhance(WrappedComponent) {
class Enhance extends React.Component {/_..._/}
hoistNonReactStatic(Enhance, WrappedComponent)
return Enhance
}
{% endhighlight %}

또 다른 방법으로는 컴포넌트로부터 별도로 static method를 export하는 방법도 있습니다.

{% highlight javascript linenos%}
// Instead of...
MyComponent.someFunction = someFunction
export default MyComponent

// ...export the method separately...
export { someFunction }

// ...and in the consuming module, import both
import MyComponent, { someFunction } from './MyComponent.js'
{% endhighlight %}

> Refs는 전달되지 않는다

HOC는 WrappedComponent에 모든 props를 전달하지만, refs는 전달되지 않습니다.
`ref`는 실제로 prop가 아니기 때문입니다. (React에서 `key`와 같이 특별하게 다뤄지는 속성이라고 이해할 수 있습니다.)

이를 해결하기 위한 방법으로 `React.forwardRef` API (React 16.3 버전 이후 지원)을 사용할 수 있습니다.

- [ForwardRef](https://reactjs.org/docs/forwarding-refs.html)

---

🔗 참조

📌 [Higher Order Component in React](https://reactjs.org/docs/higher-order-components.html)
