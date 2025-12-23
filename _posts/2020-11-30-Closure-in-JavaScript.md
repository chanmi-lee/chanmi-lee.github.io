---
layout: post
title: "Closure in JavaScript"
date: 2020-11-30
categories: [JavaScript, closure]
disqus_comments: true
toc:
  sidebar: left
---

### 클로저란?

`클로저`란 함수 내부에 정의된 함수이며, 내부함수가 외부함수의 맥락(context)에 접근할 수 있는 것을 의미합니다.

다른 프로그래밍 언어들과 마찬가지로, 자바스크립트는 어휘적 유효범위 (lexical scoping)을 사용합니다.
어휘적 유효범위 (lexical scoping)는 정적 유효범위 (static scoping)으로도 번역되며, 함수가 선언된 시점에서의 유효범위를 의미합니다.

개념적으로 모든 자바스크립트 함수는 클로저인데, 자바스크립트에서 함수는 객체이고 함수 자신과 관련된 유효범위 체인을 가지고 있기 때문입니다.
자바스크립트 함수가 호출될 때마다, 해당 호출과 관련된 지역 변수를 보관하는 객체가 생성되며 이 객체는 함수의 유효범위 체인에 추가됩니다.
함수가 반환된다면 반대로 객체와 바인딩된 변수는 유효범위 체인에서 제거됩니다.

간단한 예제와 함께 살펴보겠습니다.

### 📌 클로저 예제

{% highlight javascript linenos%}
var closure = (function getCounter() {  // 함수를 정의하고 바로 호출합니다.
    var counter = 0;
    return function() { return counter++; };
}());
{% endhighlight %}

위에서 정의한 `getCounter` 함수는 함수를 반환하고, 반환된 함수는 내부에서 선언된 변수 `counter`를 참조하고 있습니다.
또한 `getCounter` 함수의 반환 결과는 `closure` 변수에 할당됩니다.

`counter`와 같은 내부 변수는 여러 클로저가 공유할 수 있습니다.
이는 같은 함수 안에 정의된 중첩 함수들이 같은 유효범위 체인을 공유하기 때문입니다.

아래 예제와 함께 조금 더 자세히 살펴보겠습니다.

{% highlight javascript linenos%}
function counter() {
    var n = 0;
    return {
        count: function() { return n++; },
        reset: function() { n = 0; }
    };
}

var c = counter(), d = counter();   // 두 개의 카운터를 생성합니다.
c.count();      // => 0
d.count();      // => 0 : c와 d는 서로 독립적입니다.
c.reset();      // reset() 메서드와 count() 메서드는 상태를 공유합니다. 즉 같은 유효범위 체인을 공유합니다.
c.count();      // => 0 : c를 reset하였기 때문에 0을 반환합니다.
d.count();      // => 1 : d는 reset되지 않았기 때문에 1을 반환합니다.
{% endhighlight %}

위의 예제에서 함수 `counter`를 호출할 때마다 새로운 유효범위 체인과 새로운 내부 변수가 생성됩니다.
때문에 `counter`를 호출하는 서로 다른 객체 c, d를 생성하면 이들은 각각 독립적인 유효범위를 가지며,
예제에서처럼 객체 c의 `count()`, `reset()`를 호출하는 것은 객체 d에게는 아무런 영향을 주지 않게 됩니다.

> 내부 변수는 외부에서는 직접 접근할 수 없으며, 클로저를 통해서만 사용할 수 있습니다.
> 이는 객체지향언어의 private 멤버 변수와 같은 역할을 합니다.

너무나 유명한 반복문 클로저 예제도 함께 살펴보겠습니다.

{% highlight javascript linenos%}
function count() {
    var i;
    for (i = 1; i <= 10; i++) {
        setTimeout(function timer() {
            console.log(i);
        }, i * 100);
    }
}
count();
{% endhighlight %}

0.1초마다 1부터 10까지 출력하고자 하였지만, 실제로 코드를 실행해보면 결과는 10이 10번 출력됩니다.

`timer`는 항상 상위 스코프인 `count`에게 내부 변수인 `i` 값을 요청하지만, 0.1초 후에 호출됩니다.
그런데 처음 0.1초가 지날 동안 이미 `i`값은 10이 되어버리고 이를 계속해서 참조하기 때문에 결국 본래 의도와 달리 10만 10번 출력하게 됩니다.

{% highlight javascript linenos%}
function count() {
    var i;
    for (i = 1; i <= 10; i++) {
        (function(innerCounting) {
            setTimeout(function timer() {
                console.log(innerCounting);
            }, i * 100);
        })(i);
    }
}
count();
{% endhighlight %}

위의 예제와 같이 새로운 스코프를 추가해주면, 독립적인 환경에 값을 따로 저장하게 됩니다.

> 모든 함수는 함수가 생성된 곳의 어휘적 유효범위 (lexical scoping)을 기억합니다.
> 함수는 [[Environment]]라 불리는 프로퍼티를 갖는데, 여기에 어휘적 유효범위에 대한 참조가 저장됩니다.
> [[Environment]]는 함수가 생성될 때 값이 세팅되며 이 값은 불변합니다.

혹은 아래와 같이 ES6에서 추가된 블록 스코프 방식, 즉 `let` 키워드를 이용할 수도 있습니다.

{% highlight javascript linenos%}
function count() {
    'use strict';
    for (let i = 1; i <= 10; i++) {
        setTimeout(function timer() {
            console.log(i);
        }, i * 100);
    }
}
count();
{% endhighlight %}

---

🔗 참조

📌 [MDN - Closure](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Closures)

📌 [TOAST - 자바스크립트의 스코프와 클로저](https://meetup.toast.com/posts/86)

📌 [생활코딩 - 클로저](https://opentutorials.org/course/743/6544)
