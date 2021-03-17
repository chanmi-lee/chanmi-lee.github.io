---
layout: post
title: "[번역] Lodash를 대체하는 순수 자바스크립트 함수"
excerpt: "#JavaScript #vanillaJavaScript #lodash"
categories: [글또, JavaScript, lodash]
share: true
comments: true
---

> 이 글은 원저자 [RC](https://medium.com/@rcdexta) 의 허락을 받아 [Pure JavaScript Functions as a Replacement for Lodash](https://blog.bitsrc.io/you-dont-need-lodash-or-how-i-started-loving-javascript-functions-3f45791fa6cd) 을 번역한 글입니다

![queue](https://miro.medium.com/max/1400/1*zbJmSCECXK13rS7-4CsRzQ.png){: width="50%" height="50%"}

JavaScript와 함께 사용되는 유틸리티 함수들의 종류는 매우 다양합니다.
이 중 가장 일반적으로 사용되는 [Lodash](https://lodash.com)와 [Underscore.js](https://underscorejs.org)의 기능과 순수 자바스크립트 함수를 비교해보고자 합니다.
예제로 주어지는 함수들 중 일부는 ES5을 지원하지만 일부는 ES6의 지원이 필요하기도 합니다.

Lodash나 Underscore.js 등의 라이브러리의 핵심 디자인 원칙은 **함수형 프로그래밍**으로 설명할 수 있습니다.
여기에서, **함수형 프로그래밍**이란 무엇일까요?

함수형 프로그래밍을 설명하는데는 여러 방법이 있지만, 다음과 같이 정의해볼 수 있습니다.
> 함수형 프로그래밍은 **계산을 수학적 함수의 조합으로 생각하는 방식**을 의미합니다.
프로그래밍이 실행될 때 전역 상태를 변경하는 명령문으로 구성된 **명령형 프로그래밍과 대조되는 개념**으로 이해할 수 있습니다.
명령형 프로그래밍에서는 일반적인 프로그래밍 언어에서 함수가 특정 동작을 수행하는 역할을 담당하지만,
함수형 프로그래밍에서는 일반적으로 전역 변수와 같은 변경 가능한(mutable) 상태의 사용을 피하고, **불변(immutable) 데이터**와 **side effect이 없는 함수**, 즉 함수의 실행이 외부에 영향을 끼치지 않는 함수를 사용하는 것을 지향합니다.

여기서 중요한 것은, 사이드 이펙트가 없어야 한다는 점이며 이는 함수 내부에 상태가 존재하지 않고 함수의 출력 값은 항상 함수의 입력 값의 영향만 받는다는 것을 의미합니다.
덕분에 테스트, 유지 관리가 쉽고 무엇보다도 예측 가능합니다.

간단한 예제와 함께 순수 자바스크립트 함수와 라이브러리 함수를 좀 더 자세히 비교해보겠습니다.

### TIP: 필요한 기능만 Bit 컴포넌트로 설치해주세요

[Bit](https://github.com/teambit/bit) 을 사용하면 라이브러리의 함수, 컴포넌트, 모듈을 별도의 리팩토링 없이 재사용 가능하게 나눌 수 있습니다.
Lodash에 대한 내용은 [여기](https://bit.dev/lodash/lodash) 를 참고해주세요!

#### find

첫 번째로 `find`을 살펴보겠습니다. `find`는 컬렉션에서 주어진 조건을 충족하는 첫 번째 요소를 반환합니다.

```javascript
const users = [
  { 'user': 'joey',  'age': 32 },
  { 'user': 'ross',    'age': 41 },
  { 'user': 'chandler', 'age': 39 }
]

// Native
users.find(function (o) { return o.age < 40; })

//lodash
_.find(users, function (o) { return o.age < 40; })
```

위의 간단한 예제 코드를 통해, 네이티브 자바스크립트와 Lodash 각각의 성능을 살펴보겠습니다.

![queue](https://miro.medium.com/max/1400/1*aw5pv3HKxsHsV1jh434UYg.png)*find의 성능이 _.find 보다 높은 결과를 보였다*{: width="50%" height="50%"}

하지만, 이 통계만 보고 순수 자바스크립트의 기능이 항상 Lodash의 것보다 성능이 좋다는 결론을 내릴 순 없습니다.
다만, 네이티브 함수인 [find](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find) 이 lodash의 [find](https://lodash.com/docs/4.17.15#find) 보다 더 간결하고 읽기 쉽다는 장점이 있음은 분명해보입니다.


#### filter

다음으로 `filter` 를 살펴보겠습니다.
`filter`는 컬렉션에서 특정 조건을 충족하는 요소를 반환하는데 주로 사용됩니다.

```javascript
const numbers = [10, 40, 230, 15, 18, 51, 1221]       

_.filter(numbers, num => num % 3 === 0)
numbers.filter(num => num % 3 === 0)
```

![queue](https://miro.medium.com/max/1400/1*lstVPT2qm3OesKxOm3OoGg.png){: width="50%" height="50%"}*_.filter vs array.filter*

이번에도 [`Array.prototype.filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)가 동일 연산을 처리하는데 좀 더 빠르다는 결과를 얻을 수 있습니다.

#### each

반대로 lodash 함수를 사용할 때 유익한 경우도 있습니다.
아래 예제는 내장된 이터레이터인 [Array.prototype.forEach](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) 보다 lodash의 [_.forEach](https://lodash.com/docs/4.17.15#forEach) 를 사용하는 것이 좋음을 보여주고 있습니다.

```javascript
_.each([1, 2, 3], (value, index) => {
  console.log(value)
})

[1, 2, 3].forEach((value, index) => {
  console.log(value)
})

_.forEach({ 'a': 1, 'b': 2 }, (value, key) => {
  console.log(key);
});

({ 'a': 1, 'b': 2 }).forEach((value, key) => { // !error
  console.log(key); 
});
```

![queue](https://miro.medium.com/max/1400/1*sqlnG7flP2igrYUnt7YSzA.png){: width="50%" height="50%"}*_.each vs forEach vs map*

`_.each`는 브라우저 별로 구현을 달리 하기 때문에 네이티브 함수보다 훨씬 빠른 결과를 얻을 수 있습니다.

> Lodash 개발자에 따르면, 네이티브 forEach 함수는 브라우저에 따라 상대적인 속도가 상이하다고 합니다.
> 이는 forEach가 네이티브 함수이기 때문에 `for` 혹은 `while`로 생성된 루프보다 빠르다는 것을 의미하지 않습니다.
> 또한 forEach는 콜백 함수를 사용하기 때문에, 함수 호출 시 (잠재적인) 오버헤드가 존재합니다.

#### every

`every`는 배열의 모든 요소를 순회하며 특정 조건을 충족하는지 여부를 테스트합니다.


```javascript
const elements = ["cat", "dog", "bat"]

_.every(elements, el => el.length == 3)
elements.every(el => el.length == 3) //true
```

![queue](https://miro.medium.com/max/1400/1*_CJMbz8wzHiv6R2SP7h9Gw.png){: width="50%" height="50%"}*_.every vs array.every*

이번에도 [Array.prototype.every](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every) 가 `_.every`보다 훨씬 빠르다는 결과를 얻었습니다. 

#### some

`some`은 배열의 요소 중 하나 이상이 특정 조건을 충족하는지 여부를 확인하는데 사용합니다.

```javascript
const elements = ["cat", "dog", "bat"]

_.some(elements, el => el.startsWith('c'))
elements.some(el => el.startsWith('c'))
```

![queue](https://miro.medium.com/max/1400/1*EBznqoWTqNjrARQE_yJpTw.png){: width="50%" height="50%"}*array.some vs _.some*

[Array.prototype.some](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some) 의 결과가 우세함을 알 수 있습니다.

#### includes

`includes`는 배열에 특정 요소가 포함되어 있는지 여부를 반환합니다.

```javascript
const primes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,97]

_.includes(primes, 47)
primes.includes(79)
```
![queue](https://miro.medium.com/max/1400/1*WW2NTx8Ka4PKul6gPPvOuQ.png){: width="50%" height="50%"}*array.includes vs _.includes*

#### uniq

`uniq`는 배열에서 고유한 요소를 찾는데 사용됩니다.
자바스크립트의 `Set` 데이터 타입을 활용하여 배열을 집합으로 변환하고, 스프레드 연산자(...)를 사용하여 이를 다시 배열로 변환합니다.
이러한 두 번의 전환 과정을 거치는 것이 실제로 도움이 되는지 살펴봅시다.

```javascript
var elements = [1,2,3,1,2,4,2,3,5,3]

_.uniq(elements)
[...new Set(elements)]
```

![queue](https://miro.medium.com/max/1400/1*GOx7k9e6DFast8jPSmPKpQ.png){: width="50%" height="50%"}*_.uniq vs Set*

`_.uniq`의 성능이 조금 더 우세함을 확인할 수 있습니다.

또는 아래와 같은 방식도 고려해볼 수 있습니다.

```javascript
elements.filter((value, index, array) => array.indexof(value) === index)
```

#### compact

`compact`는 배열에서 거짓(false) 혹은 정의되지 않은(undefined) 값을 제거하는데 유용합니다.

```javascript
var array = [undefined, 'cat', false, 434, '', 32.0]

_.compact(array)
array.filter(Boolean)
// same as writing: (a.k.a Syntactic sugar)
// array.filter(function (x) { return Boolean(x); });
```

---

지금까지 여러 예제들을 통해 네이티브 함수의 유용성을 살펴보았습니다.
Lodash 등의 유틸리티 라이브러리 대신 네이티브 함수를 선택할 때 고려해야 할 사항은 다음과 같습니다.

- 반드시 필요한 모듈만 `import`합니다.
- lodash의 경우 CommonJS 형태로 번들링되어 배포되기 때문에 webpack의 기본 설정으로는 lodash를 [트리 쉐이킹](https://webpack.js.org/guides/tree-shaking/) 할 수 없다.
  이 경우, [babel-plugin-lodash](https://github.com/lodash/babel-plugin-lodash) 를 사용하길 추천합니다.
- 프로젝트에 더 적은 종속성이 요구되거나 대상 브라우저를 명확하게 알고 있다면, lodash/underscore.js와 같은 외부 유틸을 지양하고 네이티브 함수를 사용합니다.

---

🔗 참조

📌 [Pure JavaScript Functions as a Replacement for Lodash](https://blog.bitsrc.io/you-dont-need-lodash-or-how-i-started-loving-javascript-functions-3f45791fa6cd)

📌 [You Dont Need Lodash Underscore](https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore)