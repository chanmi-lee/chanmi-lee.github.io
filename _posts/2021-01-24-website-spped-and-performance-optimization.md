---
layout: post
title: "웹 성능 분석 및 최적화 기법 (with Chrome Developer Tools)"
date: 2021-01-24
categories: [WebPerformance, Optimize, DeveloperTools, WebVitals]
disqus_comments: true
toc:
  sidebar: left
---

{% include figure.liquid loading="eager" path="/assets/img/posts/web-performance.png" class="img-fluid rounded z-depth-1" %}

### 웹 성능 분석 및 최적화 기법 (with Chrome Developer Tools)

웹의 성능 최적화 방법은 크게 로딩 성능과 렌더링 성능을 최적화하는 방법으로 나누어 생각할 수 있습니다.

여기에서 `로딩 성능`은 **얼마나 빠르게 리소스를 로드하는지** 를 의미하며, `렌더링 성능`은 **얼마나 빠르게 화면을 렌더링하고 있는가** 를 의미합니다.
웹의 성능은 사용자 경험에 상당한 영향을 끼치는 항목으로, 프론트엔드 개발 시 반드시 고려해야 하는 중요한 내용입니다.

다양한 성능 최적화 방법이 있지만,
그 중에서도 크롬 개발자도구를 활용하여 웹 사이트의 로딩 성능과 렌더링 성능과 관련된 지표들을 살펴보고 이를 통해 어떻게 성능을 개선할 수 있는지 살펴보겠습니다.

#### Lighthouse(Audit)로 분석하기

먼저 분석하고자 하는 사이트에 들어가 개발자 도구의 `Lighthouse` 패널을 열고 `Generate report`를 누르면, 아래와 같이 분석 결과를 확인할 수 있습니다.

{% include figure.liquid loading="eager" path="/assets/img/posts/lighthouse-for-web-performance.gif" class="img-fluid rounded z-depth-1" %}

최상단에서 현재 웹 페이지를 `Performance`, `Accessibility`, `Best Practices`, `SEO`, `PWA`의 다섯가지 기준에 따라 분석 점수를 확인할 수 있습니다.

{% include figure.liquid loading="eager" path="/assets/img/posts/web-performance-of-us.png" class="img-fluid rounded z-depth-1" %}

(~~거의 0에 수렴하는 performance 점수.. (눈물)~~)

아래 구글의 점수와 비교해보면 그 차이를 바로 체감할 수 있습니다.

{% include figure.liquid loading="eager" path="/assets/img/posts/web-performance-of-google.png" class="img-fluid rounded z-depth-1" %}

이 중에서 Performance의 점수는 현재 페이지의 성능을 측정한 점수이며, 이는 Metrics 지표의 세부 항목을 기준으로 측정됩니다.

- First Contentful Paint
- Time to Interactive
- Speed Index
- Total Blocking Time
- Largest Contentful Paint
- Commulative Layout Shift

`Oppertunities`와 `Dignostics`는 현재 웹페이지의 문제점과 성능 최적화를 위한 가이드를 제시해주는 부분입니다.

`Opportunities`는 로딩 성능과 관련된 내용으로 어떻게 리소스를 더 빠르게 로딩할 수 있는지의 관점에서 개선 포인트를 나열해주고 있습니다. 
`Dignostics`는 렌더링 성능과 관련된 내용으로 그 개선점을 나열해주고 있습니다.

각 항목의 상세 정보를 통해 리소스 별로 차지하는 비중을 확인할 수 있습니다.
예를 들어, `Opportunities`의 `Remove unused JavaScript` 항목을 선택하면, 어떤 리소스를 로딩하는데 오래 걸리는지, 각 사이즈는 어느정도인지 알 수 있습니다.
그러나 해당 리소스의 어느 부분이 문제가 되는지, 어떻게 개선해야 하는지 등에 관한 구체적인 정보는 제공되지 않습니다. (이어지는 `Performance` 패널을 통해 조금 더 구체적으로 확인이 가능합니다)

마지막의 `Runtime Settings`에서는 검사를 실행한 환경에 대한 정보를 확인할 수 있습니다.

{% include figure.liquid loading="eager" path="/assets/img/posts/runtime-setting-in-lighthouse.png" class="img-fluid rounded z-depth-1" %}

#### Performance로 분석하기

Performance 패널에서는 `Timeline`을 기준으로 페이지가 로드되면서 실행되는 작업들에 관한 정보를 그래프와 화면들의 스냅샷으로 확인할 수 있습니다.

{% include figure.liquid loading="eager" path="/assets/img/posts/performance-for-web-page.gif" class="img-fluid rounded z-depth-1" %}

> Frames

`Screenshots` 옵션을 활성화 한 경우 확인 가능하며, `Timeline`에 따른 렌더링 과정을 `스냅샷`을 통해 확인할 수 있습니다.

> Timings

DCL, FP, FCP, LCP, L 등의 순서를 확인할 수 있으며 각각의 의미는 다음과 같습니다.

- DCL (DOMContentLoaded event) : HTML과 CSS parsing이 완료되는 시점으로 렌더 트리를 구성할 준비가 된 (DOM 및 CSSOM 구성이 끝난) 상황을 의미
- FP (First Paint) : 화면에 무언가 처음으로 그려지기 시작하는 순간
- FCP (First Contentful Paint) : 화면에 텍스트나 이미지가 출력되기 시작하는 순간
- FMP (First Meaningful Paint) : 사용자에게 의미있는 콘텐츠가 그려지기 시작하는 첫 순간으로, 콘텐츠 노출에 필요한 리소스(css, JavaScript file) 로드가 시작되고 스타일이 적용된 시점
- L (onload event) : HTML 상에 필요한 모든 리소스가 로드된 시점

이 중 FMP의 시점이 가장 중요한데, `사용자에게 필요한 컨텐츠가 노출`되는 시점, 즉 웹 사이트에 대한 사용자의 첫 인상이 결정되는 순간이기 때문입니다.
때문에 FMP 시점을 앞당기는게 사용자 기준의 성능 최적화의 지표로 삼을 수 있습니다.
이 과정에서 어떤 컨텐츠가 가장 먼저 노출되어야 하는가에 대한 논의가 필요하며 개발 과정에 반영되어야 합니다.

> Tips: `DOMContentLoaded event` 와 `onload event`는 `Network` 패널 하단에서도 확인할 수 있습니다.

{% include figure.liquid loading="eager" path="/assets/img/posts/DCL-and-onload-in-network.png" class="img-fluid rounded z-depth-1" %}

> Main

`Timeline`에 따른 이벤트와 그에 따른 부작업을 확인할 수 있습니다.

각각의 막대는 이벤트를 나타내며, 폭이 넓을 수록 오래 걸린 이벤트입니다.
각 이벤트 아래쪽의 이벤트들은 상단의 이벤트로부터 파생된 이벤트입니다.

{% include figure.liquid loading="eager" path="/assets/img/posts/main-in-performance.gif" class="img-fluid rounded z-depth-1" %}

#### Network로 분석하기

`Network`는 `Performance` 패널과 함께 레코딩되며, `웹 페이지가 로딩되는 동안 요청된 리소스 정보들`을 확인할 수 있습니다.
이 때 리소스 목록은 시간순으로 정렬되며, 아래와 같이 각 리소스의 서버 요청 대기 시간을 확인할 수 있습니다.

{% include figure.liquid loading="eager" path="/assets/img/posts/resource-detail-in-network.png" class="img-fluid rounded z-depth-1" %}

- Queuing : 대기열에 쌓아둔 시간
- Stalled : 요청을 보내기 전의 대기 시간, 즉 서버와 커넥션을 맺기까지의 시간
- Waiting (TTFB) : 초기 응답(Time To First Byte)을 받기까지 소비한 시간, 즉 서버 왕복 시간
- Content Download : 리소스 다운에 소요된 시간

#### 성능 최적화 방법들

❗ **최대한 적게 요청하고, 최대한 빠르게 받아오기**

앞에서 웹 성능 최적화는 크게 로딩 성능과 렌더링 성능로 분리하여 생각해볼 수 있다고 하였습니다.
로딩 성능과 렌더링 성능 각각의 관점에서 구체적인 최적화 방안들은 다음과 같습니다.

> 로딩 성능 최적화

- 리소스 최적화
    - 텍스트 압축
    - 이미지 사이즈 최적화
        - 개별 이미지 대신 이미지 스프라이트 사용 ([CSS Image Sprites](https://www.w3schools.com/css/css_image_sprites.asp))
        - 이미지 CDN을 통한 최적화
    - 리소스 캐싱 ([MDN : HTTP Caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching))
    - 이미지 Preload & Lazy load
    - webpack 등의 번들러를 통한 번들된 리소스 활용
    - 컴포넌트 Preloading

{% highlight javascript linenos%}
import React, { useState, useEffect, Suspense, lazy } from 'react'

// factory pattern
function lazyWithPreload(lazyImport) {
  const Component = React.lazy(lazyImport)
  Component.preload = lazyImport
  return Component
}

// lazyLoad 대상이 되는 컴포넌트들을 선언
const lazyModal = lazyWithPreload(() => import('./components/ImageModal'))

function App() {
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
      lazyModal.preload()
      // factory pattern을 사용하지 않는다면 아래와 같이 직접 import
      const imageModal = import('./component/ImageModal')
  })
  
  render (
      <div className="App">
        <Header />
            ...
        <Footer />
        <Suspense fallback={<div>Loading...</div>}>
            {showModal ? <LazyModal closeModal={() => setShowModal(false)} /> : ''}
        </Suspense>
      </div>
  )
}
{% endhighlight %}
    
> 렌더링 성능 최적화

- css는 HTML 문서 최상단(`<head>` 아래), script 태그는 HTML 문서 최하단(`</body>` 직전)에 작성

{% highlight html linenos%}
<head>
  <link href="style.css" rel="stylesheet" />
</head>
<body>
    <div>...</div>
    <script src="app.js" type="text/javascript"></script>
</body>
{% endhighlight%}

**Why?**
> 렌더 트리를 구성하기 위해서는 `DOM 트리`와 `CSSOM 트리`가 필요합니다.
DOM 트리는 파싱 중 태그를 발견할 때마다 순차적 구성이 가능하나, CSSOM 트리는 CSS를 모두 해석해야 구성이 가능합니다.
때문에 CSS는 렌더링 차단 리소스라고 하며, 렌더링이 되지 않도록 항상 `<head>` 아래에 작성해야 합니다.

- `<script>`의 `defer`,`async` 속성 활용
    - 단, 브라우저별로 지원 범위가 상이함 (**[can I use](https://caniuse.com)** 에서 확인)
- 병목 코드 개선
    - 반복 호출 제거
    - 중복 코드 제거
    - 만능 유틸 사용을 지양하고 필요한 기능만 활용
      - ex) lodash 사용 시 필요한 함수만 부분적으로 사용 혹은 직접 필요한 모듈 구현하기
{% highlight javascript linenos%}
// instead of 
import _ from 'lodash'
// use
import { get, reduce } from 'lodash'
{% endhighlight %}
- `repaint`, `reflow` 줄이기
    - DOM 및 스타일 변경 최소화
    - 불필요한 마크업 사용 지양
    - ...

---

요약하자면, 웹 성능 최적화를 위해서는 먼저

(1) **브라우저 렌더링 과정**을 이해하고

`(리소스 다운로드 -> HTML & CSS 파싱 -> 스타일 (DOM, CSSOM를 조합한 렌더 트리 구성) -> 레이아웃 -> 페인트 -> 합성)`

(2) 개발자 도구에서 제공하는 여러가지 지표들을 통해 **병목 구간**을 찾아내고

(3) 이를 **점진적으로 개선**하는 노력이 필요합니다.

개발자 도구 외에도 [source-map-explorer](https://create-react-app.dev/docs/analyzing-the-bundle-size/), [webpack-bundle-analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer), [cra-bundle-analyzer](https://github.com/svengau/cra-bundle-analyzer) (CRA에서 `eject` 없이 사용할 수 있어 앞의 두 방법에 비해 추천!) 등의 라이브러리를 활용하거나
아래 사이트를 참고하는 방안도 고려해봄직 합니다.

- [WEB PAGE TEST](https://www.webpagetest.org/)
- [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/)
- [web.dev - Measure](https://web.dev/measure/)

---

🔗 참조

📌 [Chrome DevTools - Performance](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance)

📌 [web.dev - Fase load times](https://web.dev/fast)

📌 [MDN - Web Performance](https://developer.mozilla.org/en-US/docs/Learn/Performance)

📌 [TOAST - 성능 최적화](https://ui.toast.com/fe-guide/ko_PERFORMANCE)

📌 [DEVIEW2018 - 웹 성능 최적화에 필요한 브라우저의 모든 것](https://tv.naver.com/v/4578425)
