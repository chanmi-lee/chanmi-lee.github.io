---
layout: post
title: "JavaScript Function"
excerpt: "#JavaScript #Function"
categories: [글또, JavaScript]
share: true
comments: true
---

자바스크립트에서 가장 중요한 개념 중 하나는 함수이다.
자바스크립트에서 함수는 Arrays 등의 다른 일반 객체처럼 값으로 취급되며 속성 및 메서드를 가질 수 있어 일급(first-class) 객체이다.
다른 객체와 달리 함수는 호출될 수 있으며, 기본값(`this` or `undefined`) 이외의 값을 반환하는 경우 `return` 문으로 값을 지정하여 반환한다.

### 함수 정의 

자바스크립트에서 함수를 생성하는 방법은 3가지가 있다.
각 방식에 따른 결과는 모두 동일한 함수이지만, 각 방식에 따라 함수 동작에 미묘한 차이가 있다.

- 함수 선언문(`function statement`)
- 함수 표현식(`function expression`)
- `Function()` 생성자 함수

```js
// 1. 함수 선언문
function add(x, y) {
    return x + y;
}

// 2. 함수 표현식
var add = function (x, y) {
    return x + y;
}

// 3. Function() 생성자 함수
new Function (arg1, arg2, ... argN, functionBody)

```

자바스크립트에서 함수는 일반 객체처럼 값으로 취급되기 때문에, 객체 리터럴 방식으로 일반 객체를 생성할 수 있는 것처럼 `함수 리터럴`을 이용해 함수를 생성할 수 있다.

**함수 선언문 방식**은 C/C++에서 사용하는 함수 정의 방법과 유사하지만, `function` 이라는 키워드를 명시적으로 사용하고 리턴값과 매개변수로 넘기는 값에 변수 타입(ex- int, char)을 기술하지 않는다는 점에서 차이가 있다.

**함수 표현식 방식**은 함수 리터럴로 하나의 함수를 만들고, 이를 변수에 할당하여 함수를 생성하는 방식이다.
함수 선언문 문법과 거의 유사하나, 함수 표현식 방식에서는 함수 이름이 선택 사항이며 보통 사용하지 않는다.
이렇게 이름이 없는 함수 형태를 자바스크립트에서는 익명함수(`anonymous function`)라고 부른다.

**Function() 생성자 함수**는 `Function()`이라는 기본 내장 생성자 함수로부터 생성된 객체이다.
앞에서 설명한 두 방식이 함수 리터럴 방식으로 함수를 생성하지만, 내부적으로는 Function() 생성자 함수로 함수가 생성된다.
하지만 일반적으로 Function() 생성자 함수를 사용한 함수 생성 방법은 권장되지 않는다.

![function-in-javascript]({{ site.url }}/assets/img/posts/function-in-javascript.png){: width="40%" height="40%"}

### 일급 객체

자바스크립트에서 함수는 C나 자바와 같은 다른 언어의 함수의 기능과 거의 비슷하다.
입력한 값을 인수로 받아 처리하고 그 결과를 반환하는 구조이다.
이러한 기본적인 기능 외에도 자바스크립트에서 함수는 일급 객체이며 이는 일반 객체처럼 값으로 취급된다고 할 수 있는데, 여기서 일급 객체는 무엇일까?
일급 객체가 가지는 특성은 아래와 같다.

- 리터럴에 의해 생성
- 변수나 배열의 요소, 객체의 프로퍼티 등에 할당 가능
- 함수의 인자로 전달 가능
- 함수의 리턴값으로 리턴 가능
- 동적으로 프로퍼티를 생성 및 할당 가능

예제와 함께 좀 더 자세히 살펴보자.

```js
// 함수는 숫자나 문자열처럼 변수나 프로퍼티의 값으로 할당될 수 있다
var foo = 100;
var bar = function () { 
    return 100;
}

var obj = {};
obj.baz = function () {
    return 200;
}

// 함수는 다른 함수의 인자로 전달 가능하다
var foo = function (func) {
    func();
}

foo(function () {
    console.log('Function can be used as the argument');
}

// 함수는 다른 함수의 리턴값으로도 활용할 수 있다
var foo = function () {
    return function () {
        console.log('Function can be used as the return value');
    }
}
```

### 함수의 다양한 형태

> 콜백 함수 (Callback function)

자바스크립트 함수 표현식에서 함수 이름은 선택사항이며, 이름이 없는 함수는 익명 함수라고 앞서 설명했다.
이러한 익명 함수의 대표적인 용도가 바로 **콜백 함수**이다
대표적인 콜백 함수의 사용 예로는 자바스크립트에서의 이벤트 핸들러 처리가 있다. 웹 페이지가 로드 되거나 키보드 입력 등의 DOM 이벤트가 발생하는 경우, 브라우저는 DOM 이벤트에 해당하는 이벤트 핸들러를 실행한다.

```js
window.onload = function() {
    alert('This is the callback function');
}
```

> 즉시 실행 함수 (Immediate function)

즉시 실행 함수는 익명 함수를 응용한 형태로, 함수를 정의함과 동시에 바로 실행하는 함수를 의미한다.
이 함수는 같은 함수를 다시 호출할 수 없기 때문에, 최초 한 번의 실행만을 필요로 하는 초기화 코드 등에 사용할 수 있다.

```js
(function (name) {
    console.log('This is the immediate function', name);
})();

// ES6
((name) => console.log('This is the immediate function', name))();
```

> 내부 함수 (Inner function)

내부 함수는 말 그대로 함수 내부에 정의된 함수를 의미한다.
내부 함수의 예로 클로저의 생성을 들 수 있다.

```js
function addSquare(a, b) {
    function square(x) {
        return x * x;
    }
    return square(a) + square(b);
}

a = addSquare(2, 3);    // return 13
b = addSquare(3, 4);    // return 25
```

> 화살표 함수 (Arrow function)

### 함수 객체의 속성과 메서드

`Function` 객체는 자신만의 메서드 또는 속성이 없다.
그러나, 그 자체로 함수이기에 `Function.prototype` 에서 프로토타입 체인을 통해 일부 메서드 및 속성을 상속받는다.

> 참고: `프로토타입(prototype)` 이란?
> 자바스크립트의 모든 객체는 또 다른 자바스크립트 객체와 연관되어 있고, 이 객체 (=프로토타입)으로부터 프로퍼티들을 상속 받는다.
> 객체 리터럴로 생성된 모든 객체는 프로토타입 객체가 같으며, 자바스크립트에서 이 프로토타입 객체는 최상위 객체인 `Object.prototype` 으로 참조할 수 있다.
> 예를 들어 Date.prototype나 Array.prototype은 모두 Object.prototype의 프로퍼티들을 상속받는다.

> 참고: `프로토타입 체인(prototype chain)` 이란?
> 자바스크립트에서 객체의 속성이나 메서드를 참조하게 되면, 가장 먼저 자신 안에 해당 멤버가 정의되어 있는지 찾는다.
> 만약 발견하지 못한다면 자신의 프로토타입으로 이동하여 해당 프로토타입 객체 내에서 멤버를 찾는다.
> 이 과정은 최상위 객체인 Object의 프로토타입까지 연결되어 있으며 멤버를 찾거나 혹은 찾지 못하고 null을 반환하게 되는데, 이러한 객체들의 연쇄를 `프로토타입 체인`이라 한다.

#### 속성
- `arguments` : 현재 실행중인 함수에 전달된 인수를 포함하는 배열 같은 객체 (Array-like Object)
> 참고: Array-like Object란?
> `arguments`가 `length`속성과 더불어 0부터 인덱스 된 다른 속성을 가지고 있지만, `Array`의 `foreach`, `map`과 같은 내장 메서드를 가지고 있지 않음을 의미한다.
- `caller` : 현재 실행 중인 함수를 호출한 함수
- `name` : 함수의 이름을 나타내며, 만약 이름이 없는 익명 함수라면 빈 문자열이 된다
- `length` : ECMAScript에서 정한 모든 함수가 가져야 하는 표준 프로퍼티로, 함수가 정상적으로 실행될 때 기대되는 인자의 개수
- `_proto_` : 모든 자바스크립트의 객체는 자신의 프로토타입을 가리키는 [[Prototype]]이라는 내부 프로퍼티를 가지고 있다. 크롬 브라우저에서는 [[Prototype]]이라는 내부 프로퍼티가 `_proto_`로 구현되어 있어, 같은 개념이라고 생각하면 된다.
- `prototype` : 모든 함수는 `Function` 객체이며 `Function.prototype`에서 메서드 및 속성을 상속받는다.
앞서 언급한 모든 객체의 부모를 나타내는 내부 프로퍼티인 [[Prototype]]과 혼동하지 말아야 한다.
두 프로퍼티 모두 **프로토타입 객체**를 가리킨다는 점에서는 공통점이 있다.
그러나, [[Prototype]]은 객체 입장에서 자신의 부모 역할을 하는 프로토타입 객체를 가리키는 반면,
함수 객체가 가지는 prototype 프로퍼티는 함수가 생성될 때 만들어지며, 단지 constructor 프로퍼티 하나만 있는 객체를 가리킨다.

#### 메서드

**Function.prototype.apply()**

```js
func.apply(thisArg [, argsArray])

// example
// array literal
func.apply(this, ['eat', 'bananas']);

// Array object
func.apply(this, new Array('eat', 'bananas'));
```

첫 번째 인자인 `thisArg`는 호출 컨텍스트이며 `this` 키워드의 값이 된다.
기본적으로 `this`는 웹 브라우저에서는 전역 객체인 `window`를 참조하나,
대부분의 경우 함수 내부, 객체 메서드 호출시, new 키워드와 함께 생성자 호출시 등 함수를 호출한 방법에 의해 결정된다.

**Function.prototype.call()**

```js
func.call(thisArg [, arg1, arg2, ... argN])
```

> `apply()`와 `call()`는 어떤 함수를 다른 객체에 메서드인것 처럼 간접적으로 호출한다는 점에선 비슷하다.
> 그러나 `apply()`는 인수 배열 하나를, `call()`은 인수 목록을 받는다는 차이가 있다.

**Function.prototype.bind()**

```js
func.bind(thisArg [, arg1, arg2, ... argN])
```

`bind()`는 새로운 함수를 생성하는데 사용된다.
첫 번째 인자인 `thisArg`는 역시 `this` 키워드의 값이 되고, 이어지는 인자들은 바인드된 함수의 인수에 제공된다.

---

🔗 참조

📌 [JavaScript Function :: MDN](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Functions)

📌 [Function Statement :: MDN](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/function)

📌 [Function Object :: MDN](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Function)

📌 [Function.prototype.apply() :: MDN](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)

📌 [Function.prototype.call() :: MDN](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Function/call)

📌 [proto vs prototype in javascript :: Stackoverflow](https://stackoverflow.com/questions/9959727/proto-vs-prototype-in-javascript)