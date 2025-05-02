---
layout: post
title: "[Node.js] renderToString vs renderToNodeStream vs renderToPipeableStream"
excerpt: "#NodeJS #renderToString #renderToNodeStream #renderToPipeableStream"
categories: [NodeJS, SSR]
share: true
comments: true
---

### renderToString와 renderToNodeStream

renderToString과 renderToNodeStream은 React SSR 서버를 Node.js에서 직접 구성할 때 핵심으로,
renderToString과 renderToNodeStream은 둘 다 서버 측에서 HTML을 생성하는 데 사용되지만, 렌더링 방식과 성능 특성이 크게 다릅니다.

### 🧑‍💻 예제 비교
▶️ renderToString 사용 예시
```
// ✅ 전체 렌더링 완료 후 HTML을 문자열로 받은 다음 클라이언트에 한 번에 전달
import { renderToString } from 'react-dom/server';
import App from './App';

app.get('/', (req, res) => {
  const html = renderToString(<App />);
  res.send(`
    <!DOCTYPE html>
    <html>
      <body>
        <div id="root">${html}</div>
        <script src="/bundle.js"></script>
      </body>
    </html>
  `);
});
```

▶️ renderToNodeStream 사용 예시
```
// ✅ 초기 HTML을 클라이언트로 전송해, 사용자 입장에서 더 빠른 체감 속도(FCP)를 제공
import { renderToNodeStream } from 'react-dom/server';
import App from './App';

app.get('/', (req, res) => {
  res.write('<!DOCTYPE html><html><body><div id="root">');
  const stream = renderToNodeStream(<App />);
  stream.pipe(res, { end: false });
  stream.on('end', () => {
    res.write('</div><script src="/bundle.js"></script></body></html>');
    res.end();
  });
});
```

renderToString은 React 트리를 한 번에 문자열로 렌더링해 응답하기 때문에 구현은 간단하지만, 페이지가 복잡하거나 무거우면 초기 응답이 늦어질 수 있습니다.
반면 renderToNodeStream은 React 요소를 스트리밍 방식으로 클라이언트에 보내기 때문에 초기 HTML 일부라도 먼저 전달할 수 있어, FCP 개선이나 퍼포먼스 향상에 유리하다는 장점이 있습니다.


### ⚡️ renderToPipeableStream (React 18~) ⚡️


`renderToString`은 전체 HTML을 한 번에 생성했기 때문에 초기 응답이 늦고, 큰 페이지에서는 성능 병목이 발생했습니다.

`renderToNodeStream`은 스트리밍이 가능해지면서 초기 응답은 빨라졌지만, React의 Suspense나 fallback 렌더링은 지원하지 않았습니다.

React 18에서 도입된 `renderToPipeableStream`은 이를 해결한 API로, Suspense boundary 단위로 부분 렌더링이 가능하고, 타임아웃 설정 및 오류 fallback 처리도 유연하게 제어할 수 있어 대규모, 고성능 SSR에서 가장 권장되는 방식입니다.


▶️ renderToPipeableStream 사용 예시

```
import { renderToPipeableStream } from 'react-dom/server';

const { pipe, abort } = renderToPipeableStream(<App />, {
  onShellReady() {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    pipe(res); // HTML 일부부터 스트리밍 시작
  },
  onError(err) {
    console.error(err);
  },
  onAllReady() {
    // suspense 영역까지 렌더 완료 시점
  }
});

// 타임아웃 후 중단도 가능
setTimeout(() => abort(), 5000);
```


▶️ Suspense + renderToPipeableStream 사용 예시

```
- server.js
- App.tsx
- components/
  - ProductList.tsx
  - ProductListSkeleton.tsx
```


🧱 components/ProductList.tsx
```
import React from 'react';

export default function ProductList() {
  const products = getProducts(); // 서버 비동기 호출로 가정
  return (
    <ul>
      {products.map(p => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
}
```

🧱 App.tsx
```
import React, { Suspense } from 'react';
import ProductList from './components/ProductList';
import ProductListSkeleton from './components/ProductListSkeleton';

export default function App() {
  return (
    <div>
      <h1>상품 목록</h1>
      <Suspense fallback={<ProductListSkeleton />}>
        <ProductList />
      </Suspense>
    </div>
  );
}
```


🧱 server.js (Express + renderToPipeableStream)
```
import express from 'express';
import { renderToPipeableStream } from 'react-dom/server';
import App from './App';

const app = express();

app.get('*', (req, res) => {
  const { pipe, abort } = renderToPipeableStream(<App />, {
    onShellReady() {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.write(`<!DOCTYPE html><html><body><div id="root">`);
      pipe(res);
    },
    onAllReady() {
      res.write(`</div><script src="/bundle.js"></script></body></html>`);
      res.end();
    },
    onError(err) {
      console.error('SSR error', err);
    }
  });

  // 비정상 지연 시 중단
  setTimeout(() => abort(), 5000);
});

app.listen(3000, () => {
  console.log('SSR server on http://localhost:3000');
});
```


> 📌 Next.js의 getServerSideProps와의 차이점

| 항목 |	renderToPipeableStream |	getServerSideProps (Next.js) |
|---|---|---|
| 프레임워크 |	Express + React (커스텀 SSR)	| Next.js 내장 |
| 렌더링 방식	| 서버 렌더링 + 점진적 스트리밍 |	SSR, 정적 HTML 완성 후 전달 |
| Suspense 지원 |	✅ React 18 기준 완전 지원	| ❌ 서버 측 Suspense 미지원 |
| 유연성	| 매우 높음 (직접 제어) |	Next.js 규칙 내에서만 가능 |
| 데이터 페칭 |	자유로운 위치에서 가능 |	페이지 단위에서만 작동 |
| 초기 데이터 주입 |	<script>window.__INITIAL_DATA__ 등 수동 삽입 |	자동 props 전달 (context 제공) |

🔍 정리:
- `getServerSideProps`는 **Next.js의 SSR 페이지 전용 함수**로,
  - 요청마다 데이터를 서버에서 받아와 HTML을 완성한 후 클라이언트에 전달
  - 완성된 HTML만 보냄 → **스트리밍이나 Suspense는 불가**
- 반면, `renderToPipeableStream`은 **서버 자체에서 React 렌더링을 스트리밍으로 직접 제어**할 수 있음
  - React 18 기준 Suspense 사용 가능, HTML을 점진적으로 보내 성능 개선



### SSR 렌더링 방식 비교

```
┌─────────────────────────────┐
│         요청 수신             │
└─────────────────────────────┘
                ↓
────────────────────────────────────────────
          SSR 방식별 처리 흐름 비교
────────────────────────────────────────────

(1) renderToString
┌──────────────┐
│ 전체 렌더링     │ ← 모든 React 트리를 메모리 내에서 동기 렌더링
└──────┬───────┘
       ↓
┌──────────────┐
│ HTML 완성 후   │ ← 완료되기 전까지 사용자 대기
└──────┬───────┘
       ↓
┌──────────────┐
│  응답 전송     │
└──────────────┘

(2) renderToNodeStream
┌──────────────┐
│  React 트리   │
│  스트리밍 렌더  │ ← React 16에서 도입
└──────┬───────┘
       ↓
┌──────────────┐
│ HTML 일부 전송 │ ← 초기 사용자 반응 빨라짐
└──────────────┘

(3) renderToPipeableStream (React 18)
┌──────────────┐
│ Suspense 지원 │
│ 점진 렌더링     │ ← fallback → 실제 콘텐츠 순차 렌더
└──────┬───────┘
       ↓
┌──────────────┐
│  Shell 전송   │ ← 초기 HTML부터 빠르게 응답
└──────┬───────┘
       ↓
┌──────────────┐
│  데이터 도착 후 │
│ 본 콘텐츠 렌더  │ ← onAllReady()
└──────────────┘
```


### Summary

| 항목 |	renderToString |	renderToNodeStream | renderToPipeableStream (React 18+) |
|---|---|---|---|
| 도입 시기 |	React 16 | React 16 |	React 18 |
| 렌더링 방식	| 동기 (문자열 전체 생성) |	스트리밍 (Node.js Stream) |	스트리밍 (pipeable, more control) |
| 응답 시점 |	전체 렌더링 완료 후 |	일부부터 전송 가능	 | 더 빠르게, 더 유연하게 전송 가능 |
| Suspense 지원 |	❌ |	❌	| ✅ 완전 지원 |
| 에러 fallback |	전체 실패 |	전송 중단 또는 수동 처리	| 부분 fallback 처리 가능 (Suspense boundary) |
| 중단 및 타임아웃 제어 |	❌	| ❌ |	✅ abort() 가능 |
| 추천 용도 |	단순한 SSR	| 대용량 콘텐츠 초기 응답 최적화	| 최신 React + 점진적 렌더링 필요 시 |

---

🔗 참조

📌 [renderToPipeableStream :: React Official Docs](https://react.dev/reference/react-dom/server/renderToPipeableStream)
