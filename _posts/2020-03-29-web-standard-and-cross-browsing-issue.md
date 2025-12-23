---
layout: post
title: "웹 표준과 크로스 브라우징 이슈"
date: 2020-03-29
description: Web Standard and Cross Browsing issue
tags: writing, webstandard, crossbrowsing, browsercapability
categories: [WebStandard, CrossBrowsing, BrowserCompatibility]
disqus_comments: true
thumbnail: /assets/img/posts/cross-browsing.png
toc:
  sidebar: left
---

{% include figure.liquid loading="eager" path="/assets/img/posts/cross-browsing.png" class="img-fluid rounded z-depth-1" %}

## 웹 표준 (Web Standard)

빠르게 변하는 기술의 영향으로, PC와 모바일, 태블릿 등 유저가 사용하는 기기의 종류와 IE, Chrome, Firefox, Safari 등 기기에서 사용하는 웹 브라우저도 다양해지고 있습니다.

`W3C`의 정의에 따르면, **웹 표준**(`Web Standard`)은 _접근성, 사생활 보호, 보안, 국제화의 측면_ 에서 고려해야 한다고 합니다. 이 중 접근성을 흔히 **웹 접근성**(`Web Accessibility or A11y`)이라 하며, 신체적 차이나 장애 여부와 상관없이 누구나 원활하게 웹 페이지를 이용할 수 있어야 함을 의미합니다. 키보드만으로도 이용이 가능하도록 하는 `Skip navigation`, 텍스트가 아닌 콘텐츠 인식을 위한 `대체 텍스트 제공(alt)` 등의 기능을 대표적인 예로 들 수 있습니다.

웹 사이트나 웹 페이지가 **웹 표준**(`Web Standard`)을 준수한다는 것은, 일반적으로 _올바른 HTML, CSS, JavaScript를 사이트나 페이지가 가지고 있다_ 는 것을 뜻합니다.

여기서의 **올바른** 이라는 말은, 달리 해석하면 `웹 표준을 따르는-` 이라는 말로 해석이 가능하며, HTML과 CSS의 표준을 정하는 `W3C`와 JavaScript의 표준을 정하는 `ECMA International`의 공식 문서를 필수 레퍼런스로 참조하여야 함을 뜻한다- 라고 이해해보았습니다.

그렇다면 구체적으로 프론트엔드 개발 시 어떤 점을 고려해야 할까 고민해보았습니다.

- 특정 브라우저에서만 사용되는 비 표준화된 기술은 배제하고 `W3C`, `ECMA`의 권고에 따른 것을 택한다
- 다수의 유저가 사용하는 환경 정보를 기반으로 `지원 브라우저 범위를 파악`한다
- <del>거의</del> 모든 환경에서 지원해야 한다면, <del>사실 크게 추천하고 싶진 않지만</del> 브라우저마다 동작 할 수 있는 코드를 작성하거나 혹은 `범용성 있는 라이브러리`를 택한다 (ex- Polyfill, Transpiler)

---

## Cross Browsing, 어디까지 맞춰야 할까?

> Cross Browsing의 목표는 완벽한 호환성에 두는 것이 아니라, 이종 웹브라우저에서 사용되는 비호환 및 비표준 구현 방식과 기법들을 가능한 표준안에서 수용할 수 있는 방법을 찾는 것이다.
> <Cross Browsing 가이드 - 한국소프트웨어진흥원 공개SW지원센터>

각 브라우저마다 지원하는 함수, 메소드, 그리고 기능에는 차이가 있습니다. ES2015에서는 이전과 달리 많은 문법과 기능 (ex- [Class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), [Module](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), [Template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Text_formatting#Multi-line_template_literals), [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Meta_programming#Proxies), ...) 이 추가되었습니다. 그러나 일부 브라우저에서는 해당 기능을 지원하지 않고, 모든 사용자들이 항상 최신버전의 브라우저를 사용한다는 보장 또한 없습니다.

{% include figure.liquid loading="eager" path="/assets/img/posts/class-browser-compatibility.jpg" class="img-fluid rounded z-depth-1" %}

이처럼 피할 수 없는 `Cross Browsing issue`를 어디까지 맞춰야 할까? 라는 질문에는 사실 명확한 답보단 각 상황에 맞는 답이 있다고 생각합니다. `우리 사이트는 IE10 버전 이상만 지원합니다!` 혹은 `크롬에 최적화되어 있습니다!` 라는 메시지를 노출하는 소극적인 대처 방안도 있겠지만, 가능하다면 **모든 환경에서 동일한 내용과 기능이 구현될 수 있도록 대응하는 점진적인 노력** 이 수반되어야 하지 않을까 싶습니다.

---

### 흔히 마주하는 오류들과 그 해결방안

최신 브라우저에만 맞춰 개발하고 싶은 욕구가 있음에도 그럴 수 없는 현실적인 이유는, 그 서비스를 사용하는 사용자들의 욕구-저는 왜 IE에서 A사 서비스 일부 기능을 이용할 수 없나요? 해결해주세요!-와 일치하지 않기 때문이겠죠.

> 저는 잘 되는데 왜 Kate님 자리에서는 안될까요?

QA 혹은 갑작스러운 CS 건이 들어올 때마다 항상 우선으로 **문제가 되는 사용자의 환경** (`ex- 계정, 기기, 브라우저 정보 등`)을 요청하는데, 이는 조금 더 빨리 문제를 해결할 수 있는 중요한 단서가 됩니다.

사소해보이나 가장 빈번하게 나오는 오류 중 하나는 _특정 브라우저_ <del>(라고 쓰고 주로 IE라고 읽는)</del> _에서는 지원되지 않는 함수_ 임을 알려주는 경고 메시지입니다.

{% include figure.liquid loading="eager" path="/assets/img/posts/does-not-support-includes.jpg" class="img-fluid rounded z-depth-1" %}

IE에서는 Array.prototype.includes (or String.prototype.includes)를 지원하지 않기 때문에 보통 다음의 두 가지 방법으로 해결할 수 있습니다.

- indexOf 사용

{% highlight javascript linenos%}
const pets = ['cat', 'dog', 'goose', 'lion']

console.log(pets.indexOf('cat') > -1)
// expected output: true
{% endhighlight %}

- Polyfill 사용

{% highlight javascript linenos%}
if (!String.prototype.includes) {
String.prototype.includes = function(search, start) {
'use strict';

    if (search instanceof RegExp) {
      throw TypeError('first argument must not be a RegExp');
    }
    if (start === undefined) { start = 0; }
    return this.indexOf(search, start) !== -1;

};
}
{% endhighlight %}

모든 것을 다 기억하고 구글링 없이도 완-벽하게 개발해낼 수 있는 슈퍼 개발자가 아니기에, 또한 나와 비슷한 고민을 했거나 같은 종류의 삽질을 했던 누군가가 이미 물어본 흔적은 이렇게나 쉽게 찾아볼 수 있기도 합니다.

{% include figure.liquid loading="eager" path="/assets/img/posts/ie-does-not-support-method.jpg" class="img-fluid rounded z-depth-1" %}

또한 구글링 외에도, [MDN](https://developer.mozilla.org/)이나 [Can I use](https://caniuse.com/)에서 확인을 원하는 함수를 키워드로 검색해보면 한 눈에 각 브라우저 버전별 호환성을 확인할 수 있습니다.

{% include figure.liquid loading="eager" path="/assets/img/posts/can-i-use-includes.jpg" class="img-fluid rounded z-depth-1" %}

---

🔗 참조

📌 [웹 표준 - Wikipedia](https://ko.wikipedia.org/wiki/%EC%9B%B9_%ED%91%9C%EC%A4%80)

📌 [JavaScript Guide - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

📌 [Can I use](https://caniuse.com/)

📌 [Cross Browsing 가이드 - 한국소프트웨어진흥원 공개SW지원센터](http://www.mozilla.or.kr/docs/web-developer/standard/crossbrowsing.pdf)
