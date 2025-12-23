---
layout: post
title: '[리뷰] "Learning React"를 읽고'
date: 2021-07-25
categories: [React]
disqus_comments: true
thumbnail: /assets/img/posts/learning-react.jpg
toc:
  sidebar: left
---

>      "한빛미디어 <나는 리뷰어다> 활동으로, 책을 제공받아 작성된 서평입니다."

{% include figure.liquid loading="eager" path="/assets/img/posts/learning-react.jpg" class="img-fluid rounded z-depth-1" %}

### Learning React 리뷰

이 책은 ES6 이후의 최신 자바스크립트 문법과 함수형 프로그래밍으로부터 시작하여,
함수 컴포넌트를 만드록 합성하는 방법과 다양한 Hook을 사용하고 정의하는 방법, 비동기 데이터 처리 등 실무에서 리액트를 사용할 때 필요한 개념 지식을 예제와 함께 설명해주고 있다.
뿐만 아니라, 리액트의 토대가 되는 상태 관리, 리액트 라우터, 여러가지 테스트 기법, 서버 사이드 랜더링 등에 대해서도 다루고 있다.

리액트 입문자에게는 학습 로드맵을 제사함으로써 배우는 과정에서의 혼란을 최소화하도록 도와준다.
또한, 현재 실무에서 리액트를 사용하는 개발자에게도 좀 더 리액트스러운 개발 방향을 차근차근 안내해주고 있다.

### 책의 구성

책의 초반부에는 최신 자바스크립트 기술과 리액트 탄생의 바탕이 된 패러다임인 함수형 프로그래밍의 개념과 예시로 시작한다.
리액트를 통해 컴포넌트를 생성하고 이를 관리할 때, 가독성, 재사용성, 테스트 가능성이 좋은 패턴을 더 많이 활용할 수 있도록 구체적인 예시 코드를 제공해주어 이해를 돕고 있다.
JSX를 통해 자바스크립트 코드 안에서 태그 기반의 구문을 써서 간편하게 리액트 앨리먼트를 생성하는 방법을 예제와 함께 제시해준다.

이어서, 상태(State)를 가진 컴포넌트를 만드는 방법과 컴포넌트간의 상태를 전달하는 방법, 그리고 상태가 있는 컨텍스트 프로바이더(Stateful context provider)를 통해 리액트 애플리케이션에서 관심사를 분리하는 방법을 다루고 있다.

- 상태를 리액트 함수 컴포넌트에 넣을 때는 훅스(Hooks)라고 부르는 리액트 기능을 사용한다. (리액트 v16.8.0 이전에는 클래스 컴포넌트를 사용하여 컴포넌트에 상태를 추가하였다.)
- 리액트에서 제공하는 useState, useEffect, useRef, useContext 외에도 커스텀 훅을 예제와 함께 제시한다. (불필요한 중복을 추상화하여 제거하거나, 렌더링 성능을 개선하는 훅스 등이 있다.)

> Hooks 사용 시 규칙

- Hooks는 컴포넌트 영역 안에서만 호출해야 한다.
- 기능을 가능한 작은 단위의 여러 훅으로 나누면 좋다.
- 리액트 함수의 최상위 수준에서만 훅을 사용해야 한다. (즉, 조건문이나 루프 등에서 훅을 사용하면 안된다.)

{% highlight javascript linenos%}
// Good: 훅 안에 if문 등의 조건문을 사용해야 하는 경우는 아래와 같은 방식으로 훅을 사용한다
function Counter() {
const [count, setCount] = useState(0);
const [checked, toggle] =
useState(
count => (count < 5)
? undefind
: !c,
(count < 5) ? undefined
);
}

// Bad: count > 5일 때만 훅이 호출되어야 하는 뜻으로 아래와 같이 작성하면, 이로 인해 배열의 값이 사라지게 된다.
// count > 5 : [count, checked, DependencyArray, 0, DependecyArray]
// count <= 5 : [count, DependencyArray, 1]
function Counter() {
const [count, setCount] = useState(0);
if (count > 5) {
count [checked, toggle] = useState(false);
}
}
{% endhighlight%}

대부분의 프로그래밍 언어가 코드를 실행하기 전에 컴파일 단계를 거치는데 언어마다 상당히 엄격한 규칙이 있고, 이를 지키지 않는 코드는 컴파일되지 않는다.
반면 자바스크립트는 그런 규칙이 적고 컴파일러를 사용하지 않아 런타임 환경에서 오류를 마주하는 경우가 상대적으로 빈번하다.
이를 보완하기 위해, 작성한 코드를 분석해서 구체적인 규칙을 따르도록 도와주는 도구로 JSHint, JSLint를 소개하고 CRA 프로젝트에서 ESLint, Prettier를 설정하고 규칙을 테스트하는 방법을 보여준다.

리액트 앱에서 타입 검사를 수행하기 위해 대표적인 prop-type 라이브러리, flow, TypeScript를 사용하는 세 가지 방법도 이어서 설명한다.
또한, 프로덕션 배포 시 모듈 번들러인 웹팩의 장점과 설정 방법들도 코드와 함께 설명해준다.
웹팩을 사용하면 의존 관계가 있는 여러 파일들을 (ex- JavaScript, LESS, CSS, JSX 등) 받아서 한 파일로 묶어주는데, 브라우저는 이 번들 파일을 한 번만 읽기 때문에 **네트워크 성능이 개선**된다는 장점이 있다.

---

🔗 참조

📌 [한빛출판사: Learning React](https://www.hanbit.co.kr/store/books/look.php?p_code=B3942115529)
