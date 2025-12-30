---
layout: post
title: "웹 성능 분석 및 최적화 기법 (with Chrome Developer Tools)"
date: 2021-01-24
categories: [WebPerformance, Optimize, DeveloperTools, WebVitals]
disqus_comments: true
typograms: true
toc:
  sidebar: left
---

{% include figure.liquid loading="eager" path="/assets/img/posts/web-performance.png" class="img-fluid rounded z-depth-1" %}

## 웹 성능 분석 및 최적화 기법 (with Chrome Developer Tools)

웹의 성능 최적화 방법은 크게 로딩 성능과 렌더링 성능을 최적화하는 방법으로 나누어 생각할 수 있습니다.

여기에서 `로딩 성능`은 **얼마나 빠르게 리소스를 로드하는지** 를 의미하며, `렌더링 성능`은 **얼마나 빠르게 화면을 렌더링하고 있는가** 를 의미합니다.
웹의 성능은 사용자 경험에 상당한 영향을 끼치는 항목으로, 프론트엔드 개발 시 반드시 고려해야 하는 중요한 내용입니다.

다양한 성능 최적화 방법이 있지만,
그 중에서도 크롬 개발자도구를 활용하여 웹 사이트의 로딩 성능과 렌더링 성능과 관련된 지표들을 살펴보고 이를 통해 어떻게 성능을 개선할 수 있는지 살펴보겠습니다.

---

### Lighthouse(Audit)로 분석하기

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

---

### Performance로 분석하기

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
- LCP (Largest Contentful Paint) : 뷰포트 내에서 가장 큰 이미지나 텍스트 블록이 렌더링되는 시점
- L (onload event) : HTML 상에 필요한 모든 리소스가 로드된 시점
  > **LCP vs L (onload)**
  >
  > - **LCP (사용자 경험 중심)**: 사용자가 "페이지 로딩이 완료되었다"고 느끼는 시점. 화면 내 가장 큰 컨텐츠가 떴는지 확인합니다.
  > - **L (기술적 중심)**: 브라우저가 모든 리소스(이미지, 스크립트 등)를 다 다운로드하고 처리를 끝낸 시점.

이 중 과거에는 FMP(First Meaningful Paint)가 중요했지만, 측정 기준의 모호함으로 인해 현재는 **LCP(Largest Contentful Paint)**가 더 중요한 지표로 간주됩니다.

LCP는 사용자가 페이지의 메인 콘텐츠를 볼 수 있는 시점을 명확하게 나타내므로, 사용자 경험(UX) 최적화의 핵심 기준으로 삼아야 합니다.
이 과정에서 어떤 컨텐츠가 가장 먼저 노출되어야 하는가에 대한 논의가 필요하며 개발 과정에 반영되어야 합니다.

> Tips: `DOMContentLoaded event` 와 `onload event`는 `Network` 패널 하단에서도 확인할 수 있습니다.

{% include figure.liquid loading="eager" path="/assets/img/posts/DCL-and-onload-in-network.png" class="img-fluid rounded z-depth-1" %}

> Main

`Timeline`에 따른 이벤트와 그에 따른 부작업을 확인할 수 있습니다.

각각의 막대는 이벤트를 나타내며, 폭이 넓을 수록 오래 걸린 이벤트입니다.
각 이벤트 아래쪽의 이벤트들은 상단의 이벤트로부터 파생된 이벤트입니다.

{% include figure.liquid loading="eager" path="/assets/img/posts/main-in-performance.gif" class="img-fluid rounded z-depth-1" %}

---

### Network로 분석하기

`Network`는 `Performance` 패널과 함께 레코딩되며, `웹 페이지가 로딩되는 동안 요청된 리소스 정보들`을 확인할 수 있습니다.
이 때 리소스 목록은 시간순으로 정렬되며, 아래와 같이 각 리소스의 서버 요청 대기 시간을 확인할 수 있습니다.

{% include figure.liquid loading="eager" path="/assets/img/posts/resource-detail-in-network.png" class="img-fluid rounded z-depth-1" %}

- Queuing : 대기열에 쌓아둔 시간
- Stalled : 요청을 보내기 전의 대기 시간, 즉 서버와 커넥션을 맺기까지의 시간
- Waiting (TTFB) : 초기 응답(Time To First Byte)을 받기까지 소비한 시간, 즉 서버 왕복 시간
- Content Download : 리소스 다운에 소요된 시간

---

## 성능 최적화 방법들

> ❗ **최대한 적게 요청하고, 최대한 빠르게 받아오기**

앞에서 웹 성능 최적화는 크게 로딩 성능과 렌더링 성능로 분리하여 생각해볼 수 있다고 하였습니다.
로딩 성능과 렌더링 성능 각각의 관점에서 구체적인 최적화 방안들은 다음과 같습니다.

---

### CSS, JS 최적화

- **CSS**는 렌더링 차단 리소스이므로 HTML 문서 최상단(`<head>` 아래)에 배치합니다.
- **JS**는 파싱과 렌더링을 차단할 수 있으므로 HTML 문서 최하단(`</body>` 직전)에 작성하거나, `<script>` 태그의 `defer`, `async` 속성을 활용하여 비동기적으로 로드합니다.

{% highlight html linenos%}

<head>
  <link href="style.css" rel="stylesheet" />
</head>
<body>
    <div>...</div>
    <!-- </body> 직전에 위치시키거나 defer/async 속성 활용 -->
    <script src="app.js" type="text/javascript" defer></script>
</body>
{% endhighlight%}

**Why?**

> 렌더 트리를 구성하기 위해서는 `DOM 트리`와 `CSSOM 트리`가 필요합니다.
> DOM 트리는 파싱 중 태그를 발견할 때마다 순차적 구성이 가능하나, CSSOM 트리는 CSS를 모두 해석해야 구성이 가능합니다.
> 때문에 CSS는 렌더링 차단 리소스라고 하며, 렌더링이 되지 않도록 항상 `<head>` 아래에 작성해야 합니다.

또한, 외부 스타일시트를 가져올 때는 `@import`문을 지양해야합니다. `@import`문을 사용하면 브라우저는 스타일시트를 병렬로 다운로드 할 수 없기 때문에 로드 시간이 늘어날 수 있습니다.

{% highlight javascript linenos%}
/_ test.css _/
@import url("style.css")
{% endhighlight %}

내부 스타일시트를 사용할 때에도 `<head>` 태그에 추가하여 사용합니다.

{% highlight javascript linenos%}

<head>
  <style type="text/css">
    .container {
      background-color: black;   
    }
  </style>
</head>
{% endhighlight %}

### 번들러 (webpack)를 통한 js, css 번들링 최적화

webpack과 같은 모듈 번들러를 사용하면 여러 개의 js, css를 하나의 번들 파일로 묶어 파일 요청 수를 줄일 수 있습니다. 더 나아가 **Code Splitting(코드 분할)** 을 통해 초기 로딩 시 필요한 파일만 로드하게 하거나, **Minification(압축)** 을 통해 파일 크기를 최소화하는 것이 중요합니다.

**Code Splitting**은 번들 파일을 여러 개의 청크(Chunk)로 나누어, 현재 페이지에 필요한 코드만 로드하고 나머지는 나중에 로드하도록 합니다. 이는 초기 로딩 속도를 비약적으로 향상시킬 수 있습니다.

{% highlight javascript linenos%}
// webpack.config.js 예시
module.exports = {
// ...
optimization: {
splitChunks: {
chunks: 'all', // 공통 의존성을 별도 청크로 분리하여 캐싱 효율 증대
},
minimize: true, // 프로덕션 모드에서 자동으로 코드 압축 및 난독화 수행
},
};
{% endhighlight %}

### Tree-shaking

외부 라이브러리에서 import를 할 때 모든 함수를 가져오지 않고 필요한 함수만 가져와서 사용할 수 있습니다.

{% highlight javascript linenos%}
// before
import \_ from 'lodash';

_.map(...);
_.filter(...);

// after
import { map, filter } from 'lodash';

map(...);
filter(...);
{% endhighlight %}

### 이미지 사이즈 최적화

개별 이미지 대신 이미지 스프라이트 사용 ([CSS Image Sprites](https://www.w3schools.com/css/css_image_sprites.asp))

여러 개의 이미지를 합쳐 하나의 이미지로 제공하여 한 번 요청하고, 필요한 부분은 CSS의 background-position 속성을 사용하여 보여줍니다.

### 이미지 CDN을 통한 최적화

이미지 CDN(Content Delivery Network)을 사용하면 사용자와 가까운 서버에서 이미지를 서빙하여 로딩 속도를 높일 수 있습니다. 또한, CDN 서비스들은 실시간 이미지 처리(리사이징, 포맷 변환 등) 기능을 제공하여 기기에 최적화된 이미지를 전송하는 데 유용합니다.

- **자동 포맷 변환**: 브라우저 지원 여부에 따라 WebP, AVIF 등 차세대 포맷으로 자동 변환
- **리사이징 & 크롭**: URL 파라미터로 필요한 크기만큼만 요청하여 전송 데이터 절약

{% highlight html linenos%}

<!-- 원본 이미지 (용량이 큼) -->
<img src="https://mysite.com/images/hero.jpg" alt="Hero" />

<!-- CDN을 통해 최적화된 이미지 (리사이징 + WebP 변환) -->
<!-- width=800, quality=auto, format=webp 옵션 적용 예시 -->
<img src="https://cdn.mysite.com/images/hero.jpg?w=800&q=auto&f=webp" alt="Hero" />
{% endhighlight %}

### 이미지 Preload & Lazy load

**Preload**는 현재 페이지에서 필요한 리소스(이미지, 스크립트, CSS 등)를 빠르게 로딩하기 위해 브라우저에게 우선순위를 알리는 방법입니다. 주로 LCP(Largest Contentful Paint)에 영향을 주는 메인 이미지나 폰트 파일 등을 미리 로드할 때 사용합니다.

{% highlight html linenos%}

<head>
  <!-- 이미지 프리로드 예시 -->
  <link rel="preload" as="image" href="hero-image.jpg">
</head>
{% endhighlight %}

**Lazy Load**는 페이지 초기 로딩 시점에 필요하지 않은 리소스(스크롤해야 볼 수 있는 이미지 등)의 로딩을 지연시키는 기술입니다. 사용자가 해당 위치에 도달했을 때 리소스를 로드하여 초기 로딩 속도를 높이고 데이터 소모를 줄일 수 있습니다.
최신 브라우저에서는 `img` 태그의 `loading` 속성을 통해 간단하게 구현할 수 있습니다.

{% highlight html linenos%}

<!-- 브라우저 네이티브 Lazy Load -->
<img src="example.jpg" loading="lazy" alt="example" />
{% endhighlight %}

물론, `Intersection Observer API`를 사용하여 직접 구현하는 방법도 있습니다.

### 컴포넌트 Preloading

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

### `repaint`, `reflow` 줄이기

브라우저는 렌더링 과정에서 레이아웃(Reflow)과 페인트(Repaint) 단계를 거칩니다. DOM이나 스타일이 변경되면 이 과정이 다시 발생하는데, 특히 **Reflow**는 전체 레이아웃을 다시 계산해야 하므로 비용이 큽니다.

- **Reflow 발생 최소화**: 레이아웃에 영향을 주는 속성(`width`, `height`, `margin` 등) 변경을 최소화합니다.
- **Repaint만 발생시키는 속성 사용**: 레이아웃 변경 없이 스타일만 바꾸는 `color`, `background-color`, `visibility` 등을 활용합니다.
- **GPU 가속 활용 (Composite)**: `transform`, `opacity` 속성을 사용하면 Reflow/Repaint 없이 합성(Composite) 단계만 수행하므로 애니메이션 성능이 크게 향상됩니다.

{% highlight css linenos%}
// Reflow 발생 (비효율적)
.box {
left: 10px;
width: 100px;
}

// GPU 가속 활용 (효율적)
.box {
transform: translateX(10px);
opacity: 0.5;
}
{% endhighlight %}

---

요약하자면, 웹 성능 최적화를 위해서는 먼저

(1) **브라우저 렌더링 과정**을 이해하고

```typograms
+-------------------+
| Resource Download |
+---------+---------+
          |
          v
+---------+---------+
| HTML & CSS Parse  |
+---------+---------+
          |
          v
+---------+---------+
| Style (RenderTree)|
+---------+---------+
          |
          v
+---------+---------+
|      Layout       |
+---------+---------+
          |
          v
+---------+---------+
|       Paint       |
+---------+---------+
          |
          v
+---------+---------+
|     Composite     |
+-------------------+
```

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

📌 [MDN : HTTP Caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching)
