---
layout: post
title: "Frontend 상태 관리 가이드"
excerpt: "#state #statemanagement #redux #context #hooks #tanstackquery"
categories: [statemanagement, redux, context, hooks, tanstackquery]
share: true
comments: true
---

---

# 프론트엔드 상태 관리: 데이터를 어디에 둘 것인가

상태의 종류와 역사, "데이터를 어디에 둘 것인가"를 정하는 기준, 그리고 실전 패턴(검색 필터·테마·로그인)을 코드와 함께 알아봅니다.

## 1. 핵심 질문: "이 데이터는 어디에 있어야 할까?"

웹 앱을 만들다 보면 화면에 보여줄 값, 사용자가 입력한 값, 서버에서 받아온 값처럼 끊임없이 변하는 데이터를 다루게 된다. 이렇게 시간에 따라 변하는 데이터를 흔히 **상태(state)** 라고 부르고, 이 상태를 어디에 담아두고 어떻게 꺼내 쓸지를 정하는 일을 **상태 관리(State Management)** 라고 한다.

상태 관리에서 자주 빠지는 함정은, 이것을 "어떤 라이브러리를 사용하여 관리할까?"의 문제로만 받아들이는 것이다. Redux가 좋을까, Context로 충분할까, 혹은 Zustand가 인기라던데… 와 같은 식의 접근이다.

하지만 가장 중요한 질문은 **"이 데이터는 어떤 성격이고, 그래서 어디에 있어야 할까?"** 의 관점에서 바라보는 것이다. 즉, 상태 관리는 데이터마다 알맞은 자리를 정해주는 일이다.

URL, localStorage, Redux, Context는 데이터가 있어야 할 자리를 두고 서로 경쟁하는 도구가 아니라, 서로 다른 종류의 상태를 담당하는 도구들이다. 예를 들면, 검색 필터는 URL에, 다크모드 설정은 localStorage에, 로그인 정보는 store나 Context에 두는 식으로, 데이터의 성격이 그 데이터가 어디에 있어야 할지 자리를 정해준다. 단순히 무작정 외우기보다 데이터를 분류하는 눈을 먼저 기르는 것이 핵심이다.

가장 흔한 실수는 "그냥 Redux 하나에 다 넣고 관리하자"는 접근인데, 당장은 한 곳에 모여 편해 보이지만 컴포넌트 하나만 쓰는 값이나 서버에서 받아온 데이터까지 전부 전역 store에 밀어 넣으면 코드는 금세 복잡해지고 쓸데없는 상태까지 저장하거나, 중복된 상태 관리로 이어지게 된다.

이 문서에서는 상태의 성격별 분류를 기준으로, 상태에 어떤 종류가 있는지와 어떤 흐름 속에서 지금의 상태 관리 구조로 정리되었는지, 그리고 실제로 데이터를 마주했을 때 어디에 둘지 어떤 기준으로 판단하는지를 실전 예제와 함께 알아보고자 한다.

## 2. 상태의 다섯 종류

| 종류 | 담당 도구 | 예시 | 성격 |
| --- | --- | --- | --- |
| 로컬 상태 | `useState`, `useReducer` | 입력 중 텍스트, 모달 열림 여부, 토글 | 메모리(런타임) |
| 글로벌 / 공유 상태 | Context, Redux, Zustand, Jotai, Recoil | 로그인 정보, 테마 | 메모리(런타임) |
| 서버 상태 | React Query(TanStack), SWR | API 응답, 목록·상세 데이터 | 원격 데이터의 캐시 |
| URL 상태 | query param, path | 검색어, 필터, 페이지 번호 | 주소창(공유·북마크 등) |
| 브라우저 저장소 | localStorage, sessionStorage, cookie | 토큰, 테마 설정값 | JS 바깥에 영속 |

### 종류별 요점

**로컬 상태** — 그 컴포넌트만 알면 되는 값. 가장 중요한 원칙은 "필요한 만큼만 위로 올린다(lift state up)"이고, 대부분의 상태는 로컬로 남아도 된다.

**글로벌 / 공유 상태** — 여러 컴포넌트가 함께 보는 값.

- **Context API**: React 내장. props drilling을 해결하지만, 값이 바뀌면 구독하는 모든 하위 컴포넌트가 리렌더링되므로 자주 안 바뀌는 값에 적합하다.
- **Redux**: 단일 store + 단방향 흐름(action → reducer → state). 예측 가능·강력한 디버깅이 장점이나 보일러플레이트가 많았다. 현재는 이를 줄인 Redux Toolkit이 공식 권장.

> **보일러플레이트(Boilerplate)** 는 "실제 로직은 별로 없는데, 기능을 동작시키기 위해 형식적으로 반복해서 써야 하는 코드"를 말한다.

고전적인 Redux에서는 상태(state)나 동작(action) 하나를 추가하려 해도 ① 액션 타입 상수, ② 액션 생성자, ③ 리듀서를 따로 작성해야 했고, 이들이 `actions/`, `reducers/`, `constants/` 등 여러 파일에 흩어져서 관리되었다.

카운터를 예로 들면 아래와 같은데,

```js
// 1) 액션 타입 상수
const INCREMENT = 'counter/INCREMENT';
const DECREMENT = 'counter/DECREMENT';
const INCREMENT_BY = 'counter/INCREMENT_BY';

// 2) 액션 생성자 (action creator)
const increment = () => ({ type: INCREMENT });
const decrement = () => ({ type: DECREMENT });
const incrementBy = (amount) => ({ type: INCREMENT_BY, payload: amount });

// 3) reducer
const initialState = { value: 0 };
function counterReducer(state = initialState, action) {
  switch (action.type) {
    case INCREMENT:
      return { ...state, value: state.value + 1 };
    case DECREMENT:
      return { ...state, value: state.value - 1 };
    case INCREMENT_BY:
      return { ...state, value: state.value + action.payload };
    default:
      return state;
  }
}
```

여기에 더해 컴포넌트에서는 `connect()` + `mapStateToProps` / `mapDispatchToProps`로 일일이 연결해야 했고(Hooks 이전), 비동기 처리를 하려면 `redux-thunk` 같은 미들웨어를 또 얹어야 했다.

이를 현재는 공식 권장 방식인 Redux Toolkit의 `createSlice`를 쓰면, 위의 세 가지(액션 타입·생성자·리듀서)가 하나로 합쳐진다. 액션 타입과 생성자는 리듀서 키에서 자동 생성되고, 내부의 Immer 덕분에 상태를 "직접 바꾸듯" 써도 불변성이 알아서 처리된다.

```js
// Redux Toolkit - 같은 기능을 slice 하나로 처리
import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value += 1 }, // 직접 변경처럼 보이지만
    decrement: (state) => { state.value -= 1 }, // Immer가 불변성을 처리
    incrementBy: (state, action) => { state.value += action.payload }
  }
});

export const { increment, decrement, incrementBy } = counterSlice.actions;
```

**서버 상태** — 진짜 "상태"라기보다 서버 데이터의 임시 사본. 원본이 내 통제 밖(서버)에 있어 낡을(stale) 수 있고, 캐싱·재요청·로딩/에러·중복요청 제거 같은 고유 문제를 동반한다. 그래서 범용 store가 아닌 전용 라이브러리(TanStack Query, SWR)로 분리한다.

**URL 상태** — "새로고침해도 유지되고 링크로 공유하고 싶은" 값. URL에 두면 브라우저가 뒤로가기·북마크·공유를 처리해준다.

**브라우저 저장소** — 앱이 종료된 후에도 남아야 하는 값. localStorage(영구) / sessionStorage(탭 닫으면 소멸) / cookie(서버 자동 전송).

## 3. 상태 관리의 역사

한 문장으로 요약하면 **"상태를 어떻게 예측 가능하게 만들 것인가"** 의 역사다.

| 시기 | 흐름 | 의미 |
| --- | --- | --- |
| ~2010 | DOM이 곧 상태 (jQuery) | 데이터와 화면이 뒤섞여 추적 불가 |
| 2010~ | MVC / AngularJS (1.x), Backbone.js | Model·View 분리, 그러나 양방향 바인딩의 복잡함 노출 |
| 2014 | Flux (Facebook) | 단방향 데이터 흐름 패턴 → "예측 가능한 상태"의 시작 |
| 2015 | Redux | Flux 단순화(단일 store, 시간여행 디버깅) → 사실상 표준 |
| 2018~2019 | Context API & Hooks | React 내장 도구, 외부 라이브러리 없이 처리 가능한 경우 증가 |
| 2019~ | 서버 상태 분리 & 경량화 | React Query/SWR로 서버 상태 분리, Zustand·Jotai·Recoil 등 가벼운 대안 |

양방향 데이터 바인딩은 모델과 화면이 서로를 자동으로 갱신하기 때문에, "언제·무엇이·무엇 때문에 바뀌었는지" 추적이 어려웠다.

Flux/Redux로 대표되는 단방향 데이터 바인딩으로의 전환은 이에 반해, "데이터는 한 방향으로만 흐른다"를 강제하여 추적 가능성을 되찾으려 한 시도였다. `dispatch(action)` → reducer → 새 state 순서로 액션을 dispatch 하면 store가 reducer를 실행하여 새 state를 반환하는 구조이다.

- **action**: "무슨 일이 일어났다"를 기술한 객체
- **dispatch**: 그 action을 store로 보내는 함수로, `dispatch(action)`과 같이 호출되며 상태(state)를 바꾸는 유일한 입구이다.
- **reducer**: `(기존 state, action) => 새 state`와 같은 형태의 순수 함수로, dispatch를 받은 store에 의해 실행된다.
- **store**: 상태(state)를 보관하고, 바뀌면 이를 구독 중인 화면에 알려 리렌더링시킨다.

```js
// 1) action: "무슨 일이 일어났는지" 기술한 객체
const increment = { type: 'counter/INCREMENT' };

// 2) dispatch
store.dispatch(increment);

// 3) reducer
const initialState = {
  value: 0
};
function counterReducer(state = initialState, action) {
  switch (action.type) {
    case 'counter/INCREMENT':
      return { value: state.value + 1 }; // 새 state 반환 (직접 변경 X)
    default:
      return state;
  }
}
```

"단방향 데이터 흐름"의 핵심은, **화면이 state를 직접 변경할 수 없다**는 점이다. 화면은 state를 읽기만 하고, 변경하고 싶으면 반드시 action을 dispatch 해서 "이런 일이 일어났어요"라고 요청만 할 수 있다. 즉, 상태가 바뀌는 경로가 `dispatch(action)` → reducer로만 고정되므로, 결과적으로 "이 state는 이 action 때문에 이렇게 바뀌었다"를 되짚을 수 있게 되어 양방향에서 잃어버렸던 추적 가능성을 시간 흐름에 따라 되찾을 수 있게 되었다.

```
[화면의 사용자 이벤트]
      │  (바꾸고 싶으면 액션을 보낸다)
      ▼
   dispatch(action)
      ▼
   store가 reducer 실행 → 새 state
      ▼
   화면 리렌더링            ──┐
      ▲                      │ (화면은 state를 "읽기"만 함)
      └──────────────────────┘
```

Context API는 React 16.3(18년 3월), Hooks(`useState`, `useEffect`, `useContext`, `useReducer` 등)은 React 16.8(19년 2월)에 정식 도입되었다.

Context API & Hooks의 등장 이후 가장 큰 변화는 **함수 컴포넌트가 상태를 가질 수 있게 되었다**는 점이다.

Hooks 이전에는 상태(`this.state`)와 생명주기(`componentDidMount`, `componentDidUpdate` 등)를 다루기 위해서는 반드시 클래스 컴포넌트여야 했다. 함수 컴포넌트는 props만 받아 그리는 데 의의가 있었다.

Hooks 이후로는 함수 컴포넌트에서 `useState`로 상태를, `useEffect`로 사이드 이펙트(Side effect)를 다룰 수 있게 되면서 클래스 컴포넌트가 사실상 필요 없어지게 된다.

### 사이드 이펙트 (Side Effect)?

React 컴포넌트는 본래 순수(pure)해야 한다. 즉, props와 state를 받아와 렌더링하여 JSX를 반환하는 것이 전부이며 같은 입력이면 같은 화면을 반환하고 그 과정에서 "바깥"은 건드리지 않는다.

사이드 이펙트(Side Effect)는 이 순수한 계산 "바깥"의 일, 즉 컴포넌트가 외부 세계와 주고받는 행위를 말한다. 즉 반환값(JSX)이 아니라, 렌더의 부수적인 결과로 일어나는 일들을 의미한다. 예를 들면,

- API 호출 (data fetching)
- DOM 직접 조작 (ex - `document.title` 변경, 포커스 주기 등)
- 타이머 (`setTimeout`, `setInterval`)
- localStorage에 저장

즉, "화면을 그리는 일"과는 별개로 외부에 영향을 주거나 외부에서 읽어오는 일이다.

예를 들어, 만약 `useEffect` 없이 컴포넌트 본문에 그냥 사이드 이펙트를 유발하는 행위를(fetch, setTimeout 등) 선언하게 되면, 매 렌더마다 실행되어 무한 루프, 중복 요청, 메모리 누수 등과 같은 버그가 발생하게 된다.

그래서 "화면이 실제로 그려진 다음에, 정해진 조건에서만 이 작업을 해라"라고 말할 전용 장소가 필요한데, 그게 `useEffect`다.

### `useEffect`가 하는 일

`useEffect(이펙트함수, 의존성배열)`은 세 가지를 제어한다.

```js
useEffect(() => {
  document.title = `count: ${count}`; // side effect: 바깥(문서 제목)을 건드림
}, [count]); // 의존성: count가 바뀐 렌더 뒤에만 실행
```

1. **실행 시점**: 렌더가 화면에 반영(commit)된 뒤에 실행한다.
2. **재실행 조건(의존성 배열)**: `[]`은 마운트 직후 한 번만 실행, `[count]`은 마운트 후 count가 바뀔 때마다 실행한다.
3. **정리(cleanup)**: 이펙트가 함수를 반환하면, React가 다음 이펙트 실행 전과 언마운트 시에 그 함수를 실행한다.(예: 타이머 정리, 구독 해제 등)

```js
useEffect(() => {
  const id = setInterval(() => console.log('tick'), 1000);
  return () => clearInterval(id); // cleanup
}, []);
```

### 이전과의 차이

클래스 시절에는 이 일을 생명주기 메서드가 담당했다. 마운트 후 작업은 `componentDidMount`, 업데이트 후 작업은 `componentDidUpdate`, 뒷정리는 `componentWillUnmount`에 각각 선언하였다. 그래서 "타이머를 설정하고 이를 해제한다"는 하나의 관심사가 세 메서드에 흩어졌다.

`useEffect`는 이를 한 곳에 묶고, 재실행 조건까지 의존성 배열로 함께 표현한다. 그리고 이를 함수 컴포넌트에서 쓸 수 있게 한다. `useEffect`는 컴포넌트의 순수한 렌더(JSX 반환)와 분리해서, 외부 세계와 상호작용하는 작업을 "언제 실행하고 어떻게 정리할지"를 정의하고 표현한다는 점에서 사이드 이펙트를 다룰 수 있게 되었다고 말할 수 있다.

```jsx
// 이전: 클래스 + 생명주기 메서드
class Counter extends React.Component {
  state = { count: 0 };

  componentDidMount() {
    document.title = `count: ${this.state.count}`;
  }
  componentDidUpdate() {
    document.title = `count: ${this.state.count}`;
  } // 중복

  render() {
    return (
      <button onClick={() => this.setState({ count: this.state.count + 1 })}>
        {this.state.count}
      </button>
    );
  }
}

// 이후: 함수 + Hooks
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `count: ${count}`;
  }, [count]); // 한 곳에 모임

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

여기에서 세 가지 의미가 따라온다.

**첫째, 로직 재사용이 쉬워졌다.**

이전에는 상태가 있는 로직을 공유하려면 HOC(고차 컴포넌트)나 render props를 써야 했는데, 겹겹이 쌓이면 wrapper hell이라 불리는 깊은 중첩 트리 구조가 되게 된다. Hooks에서는 이를 함수로 분리하면 된다. 즉, 커스텀 훅으로 상태 로직을 떼어내 어디서든 재사용할 수 있게 되었다.

**둘째, 관련 로직이 한 곳에 모인다.**

이전에는 한 가지 기능이 `componentDidMount`, `componentDidUpdate`, `componentWillUnmount` 등의 여러 생명주기 함수에 흩어져 있었는데, 이제는 관심사별로 `useEffect` 하나에 묶이게 된다.

**셋째, Context 사용이 간결해졌다.**

React 16.3 버전 당시, Context는 처음엔 render props 방식이라 중첩이 심했다.

```jsx
// 이전 (React 16.3): Consumer (render prop) — 중첩이 깊어짐
<ThemeContext.Consumer>
  {theme => (
    <UserContext.Consumer>
      {user => <div className={theme}>{user.name}</div>}
    </UserContext.Consumer>
  )}
</ThemeContext.Consumer>
```

React 16.8 버전부터 Hooks가 지원됨에 따라, `useContext`로 Context를 소비하는 패턴으로 아래처럼 간결하게 변경되었다.

```jsx
// 이후: useContext — 한 줄
function Profile() {
  const theme = useContext(ThemeContext);
  const user  = useContext(UserContext);
  return <div className={theme}>{user.name}</div>;
}
```

### 핵심 전환 두 가지

1. **Redux를 너무 많이 썼다는 반성** — 컴포넌트 하나만 쓰는 상태까지 전역에 올려 복잡해졌다.
2. **store에 넣던 데이터의 상당수가 사실 서버 데이터였다** — 이를 React Query/SWR로 떼어내자, "남은 진짜 글로벌 상태"는 생각보다 적다는 게 드러났다.

## 4. 데이터를 어디에 둘지 결정하기

데이터 하나를 두고 순서대로 질문한다.

```
1) 서버에 원본이 있는 데이터인가?        → 예: 서버 상태 (React Query / SWR)
                  │ 아니오
2) 한 컴포넌트만 쓰는가?                → 예: 로컬 상태 (useState / useReducer)
                  │ 아니오
3) 링크로 공유·북마크해야 하나?          → 예: URL (query param / path)
                  │ 아니오
4) 앱을 꺼도 남아야 하나?               → 예: 브라우저 저장소 (localStorage / sessionStorage)
                  │ 아니오
   └────────────────────────────────→ 전역 store / Context (Zustand · Jotai · Context)
```

## 5. 종류별 구체적 예시

### 서버 상태 (React Query, SWR)

- 예: 상품 목록·상세, 사용자 프로필, 댓글·게시글, 검색 결과, 알림 목록 등 서버에 원본이 있는 데이터
- **판단 기준**: 원본이 서버에 있어 캐싱·로딩/에러·재요청 관리가 필요한가?
- Redux 같은 범용 store에 직접 넣지 말고 전용 라이브러리에 맡긴다.

### 로컬 상태 (useState)

- 예: 입력 중인 텍스트(제출 전), 모달·드롭다운·아코디언 열림 여부, 호버/포커스, 폼 검증 에러 메시지, "더보기" 토글, 단순 탭 인덱스.
- **판단 기준**: 이 값이 사라지면 곤란한 대상이 이 컴포넌트 말고 또 있나?

### URL (query param / path)

- 예: 검색어(`?q=노트북`), 필터(`?category=laptop&price=0-100`), 정렬(`?sort=price_asc`), 페이지 번호(`?page=3`), 날짜 범위, 지도 좌표·줌, 상세 ID(`/products/123`).
- **판단 기준**: 이 화면 링크를 보냈을 때 상대도 같은 화면을 봐야 하나?

### 브라우저 저장소

- **localStorage(영구)**: 다크모드·언어 설정, "다시 보지 않기" 배너, 비로그인 장바구니, 최근 본 상품.
- **sessionStorage(탭 닫으면 소멸)**: 멀티스텝 폼 중간값, 결제 진행 중 임시 데이터.
- **판단 기준**: 브라우저를 껐다 켜도 기억해야 하나?
- 단, 인증 토큰 저장 위치는 보안(XSS·CSRF)과 얽혀 신중해야 한다(httpOnly 쿠키 등).

### 전역 store 또는 React Context

- 예: 로그인 사용자 정보·인증 상태, 토스트·알림 큐, 전역 모달, 웹소켓 연결 상태, 사이드바 열림 상태(여러 컴포넌트가 함께 볼 때).
- 자주 안 바뀌면 Context, 더 복잡·성능 중요하면 Zustand·Jotai.
- 이 값들은 JS 메모리(런타임)에 있어 새로고침·앱 종료 시 사라진다.

## 6. 가장 중요한 포인트: "한 데이터가 한 곳에만 있는 것은 아니다"

지금까지는 데이터를 한 곳에만 정해 넣는 것처럼 설명했지만, 실무에서는 한 데이터가 여러 곳에 걸쳐 저장되는 경우가 더 많다. 저장소는 데이터를 "어디에 보관할지" 정하는 곳이고, store나 Context는 그 값을 "화면에서 어떻게 꺼내 쓸지(런타임에 어떻게 접근하느냐)"라서 둘은 배타적이지 않다. 예를 들면,

- **테마**: 사용자가 고른 다크/라이트 값은 localStorage(영속)에 저장해 다음 방문에도 유지하고, 런타임엔 Context나 store로 꺼내 쓴다.(예를 들면, 앱이 처음 켜질 때 localStorage 값을 읽어와 store의 초기값으로 초기화)
- **장바구니**: 로그인하지 않은 사용자가 담은 상품들을 localStorage에 담아두고, 로그인하면 서버 상태로 동기화한다. 같은 장바구니라도 상황에 따라 보관 위치가 달라진다.
- **인증**: 토큰 자체는 저장소(또는 쿠키)에 두지만, "지금 로그인된 상태인가"라는 판단(상태)은 그 토큰을 바탕으로 store에서 만들어 쓴다.

정리하면, 데이터를 굳이 한 곳에서만 관리하려 애쓸 필요 없다. 오래 남겨야 하는 데이터라면 저장소에, 여러 화면이 함께 봐야 하는 경우(런타임 공유)라면 store나 Context에, 즉 필요에 따라 여러 저장소에 저장될 수 있기도 하다.

## 7. 실전 패턴 1 — 검색 필터 ↔ URL 동기화

> **핵심 원칙**: URL을 단일 진실 공급원(single source of truth)으로 삼는다. 필터마다 `useState`를 따로 두지 않고 URL에서 읽는다.

### 7.1 필터 읽기·쓰기 (react-router)

```jsx
import { useSearchParams } from 'react-router-dom';

function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  // URL이 곧 상태 — 별도의 useState를 두지 않는다
  const query    = searchParams.get('q') ?? '';
  const category = searchParams.get('category') ?? 'all';
  const sort     = searchParams.get('sort') ?? 'latest';
  const page     = Number(searchParams.get('page') ?? '1');

  // 일부 필터만 갱신하는 헬퍼 (나머지 param은 유지)
  const updateFilter = (patch) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(patch).forEach(([key, value]) => {
        if (value === '' || value == null || value === 'all') {
          next.delete(key);      // 기본값/빈 값은 URL에서 제거 → 주소가 깔끔해짐
        } else {
          next.set(key, String(value));
        }
      });
      next.set('page', '1');     // 필터가 바뀌면 1페이지로 리셋
      return next;
    });
  };

  return (
    <div>
      <select value={category} onChange={(e) => updateFilter({ category: e.target.value })}>
        <option value="all">전체</option>
        <option value="laptop">노트북</option>
      </select>
      <select value={sort} onChange={(e) => updateFilter({ sort: e.target.value })}>
        <option value="latest">최신순</option>
        <option value="price_asc">가격 낮은순</option>
      </select>
      {/* 목록 렌더링 ... */}
    </div>
  );
}
```

### 7.2 디바운스를 커스텀 훅으로 추출

검색어는 글자마다 URL을 바꾸면 히스토리가 더럽혀지고 매 키 입력마다 요청이 나간다. 디바운스가 필요한데, URL을 전혀 모르는 범용 커스텀 훅으로 분리한다.

> **디바운스(Debounce)** 는 이벤트를 그룹화하여 특정 시간이 지난 후 하나의 이벤트만 발생하도록 하는 것을 의미한다.

```js
// hooks/useDebounce.js
import { useState, useEffect } from 'react';

export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id); // 값이 또 바뀌면 이전 타이머 취소
  }, [value, delay]);

  return debounced;
}
```

### 7.3 입력창: 로컬 상태 + URL

```jsx
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from '../hooks/useDebounce';

function SearchBox() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') ?? '';
  const [input, setInput] = useState(urlQuery);     // 입력 중인 값 (로컬, 즉각 반응)
  const debouncedQuery = useDebounce(input, 300);   // 멈춘 뒤 확정된 값

  // 확정된 검색어를 URL에 반영
  useEffect(() => {
    if (debouncedQuery === urlQuery) return;  // 이미 같으면 건너뜀 → 무한 루프 방지
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      debouncedQuery ? next.set('q', debouncedQuery) : next.delete('q');
      next.set('page', '1');
      return next;
    }, { replace: true });  // 타이핑마다 히스토리가 쌓이지 않게 replace
  }, [debouncedQuery, urlQuery, setSearchParams]);

  // 뒤로가기 등 외부에서 URL이 바뀌면 입력창 동기화
  useEffect(() => {
    setInput(urlQuery);
  }, [urlQuery]);

  return (
    <input
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder="검색어 입력"
    />
  );
}
```

> **분담 구조**: 입력 중인 글자 = 로컬 상태(반응성), 확정된 검색어 = URL(공유·영속).

### 7.4 서버 상태와 연결

URL에서 읽은 값을 React Query의 `queryKey`에 넣으면, URL이 바뀔 때마다 자동 재요청된다.

```js
const { data } = useQuery({
  queryKey: ['products', { query, category, sort, page }],
  queryFn: () => fetchProducts({ query, category, sort, page }),
});
```

> **흐름**: URL(공유 가능한 상태) → queryKey → 서버 상태.

## 8. 실전 패턴 2 — 테마 = localStorage + Context

다크모드 같은 테마 설정에는 두 가지 요구를 고려해야 한다. 하나는 사용자가 한 번 고른 값을 다음 방문에도 기억해야 한다는 것이고(그래서 영속 저장소인 localStorage가 필요하다), 다른 하나는 헤더·사이드바·버튼처럼 화면 곳곳의 컴포넌트가 그 값을 함께 봐야 한다는 것이다(그래서 런타임에 값을 나눠 주는 Context가 필요하다).

앞서 언급한 "한 데이터가 한 곳에만 있는 것은 아니다"를 보여주는 사례로, localStorage(영속)와 Context(런타임 공유)가 함께 필요하다.

### 8.1 성능 최적화: state / dispatch Context 분리

가장 단순한 방법은 테마 값과 변경 함수를 한 Context에 같이 담는 것이다. 그런데, 이때 `value={{ theme, toggleTheme }}`처럼 객체를 통째로 넘기면, 컴포넌트가 렌더링될 때마다 이 객체가 새로 만들어진다. Context는 value의 참조가 바뀌면 그것을 구독하는 컴포넌트를 모두 다시 그리기 때문에, 테마가 한 번 바뀌면 이를 구독하는 모든 컴포넌트가 리렌더링된다.

이를 해결하기 위해서는 값을 읽는 Context와 값을 변경하는 Context를 둘로 나누는 것이다. 핵심은 `useReducer`가 돌려주는 `dispatch`의 성질에 있다. dispatch는 컴포넌트가 몇 번을 다시 렌더링하든 참조가 그대로 유지되므로, 따로 메모이즈하지 않아도 값이 변하지 않는다. 그래서 dispatch만 구독하는 컴포넌트는 테마가 변경되어도 "구독하는 값이 그대로"이므로 리렌더링되지 않는다.

```jsx
// ThemeContext.jsx
import { createContext, useContext, useReducer, useEffect } from 'react';

const ThemeStateContext = createContext(null);
const ThemeDispatchContext = createContext(null);
const STORAGE_KEY = 'theme';

function getInitialTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'light' || saved === 'dark') return saved;

  // 저장값이 없으면 OS 설정을 따른다
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function themeReducer(theme, action) {
  switch (action.type) {
    case 'toggle': return theme === 'dark' ? 'light' : 'dark';
    case 'set':    return action.theme;
    default: throw new Error(`알 수 없는 액션: ${action.type}`);
  }
}

export function ThemeProvider({ children }) {
  // 세 번째 인자가 lazy initializer — 최초 1회만 localStorage 접근
  const [theme, dispatch] = useReducer(themeReducer, undefined, getInitialTheme);

  // theme이 바뀔 때마다: localStorage 저장 + DOM 반영
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, theme);
    document.documentElement.dataset.theme = theme; // CSS: [data-theme="dark"] { ... }
  }, [theme]);

  return (
    // dispatch는 useReducer가 반환하는 고정 참조 → 메모이즈 불필요
    <ThemeDispatchContext.Provider value={dispatch}>
      <ThemeStateContext.Provider value={theme}>
        {children}
      </ThemeStateContext.Provider>
    </ThemeDispatchContext.Provider>
  );
}

// useThemeValue와 useThemeDispatch 커스텀 훅들은
// Provider 바깥에서 잘못 호출하는 실수를 방지하기 위하여 곧바로 에러로 잡아주는 안전 장치
export function useThemeValue() {
  const ctx = useContext(ThemeStateContext);
  if (ctx === null) throw new Error('useThemeValue는 ThemeProvider 안에서만 쓸 수 있습니다');
  return ctx;
}

export function useThemeDispatch() {
  const ctx = useContext(ThemeDispatchContext);
  if (ctx === null) throw new Error('useThemeDispatch는 ThemeProvider 안에서만 쓸 수 있습니다');
  return ctx;
}
```

### 8.2 사용하는 쪽

트리 최상단을 `ThemeProvider`로 감싸두면, 그 아래 어느 깊이의 컴포넌트든 두 훅(`useThemeValue`, `useThemeDispatch`) 중 필요한 것을 골라 쓸 수 있다.

```jsx
// App.jsx — 트리 최상단을 Provider로 감싼다
function App() {
  return (
    <ThemeProvider>
      <Header />
      <MainContent />
    </ThemeProvider>
  );
}

// 값을 읽는 컴포넌트 — theme이 바뀌면 리렌더링 (정상이고 필요한 동작)
function ThemeLabel() {
  const theme = useThemeValue();
  return <span>현재 테마: {theme}</span>;
}

// dispatch만 쓰는 컴포넌트 — theme이 바뀌어도 리렌더링되지 않음
function ThemeToggleButton() {
  const dispatch = useThemeDispatch();
  return <button onClick={() => dispatch({ type: 'toggle' })}>테마 전환</button>;
}
```

`ThemeToggleButton`은 `useThemeDispatch`만 구독하므로 사용자가 테마를 아무리 끄고 켜더라도 이 버튼 자체는 다시 그려지지 않는다. 반대로 값을 실제로 보여주는 `ThemeLabel`만 리렌더링된다.

### 8.3 주의점

**초기값은 lazy initializer로 한 번만 읽기**: `useReducer`(또는 `useState`)에 초기값을 줄 때, `getInitialTheme()`처럼 함수를 호출한 결과를 넘기면(`useState(getInitialTheme())`) 매 렌더링마다 localStorage를 읽게 된다. 대신, `getInitialTheme`처럼 함수 자체만 넘기면(예시 코드의 `useReducer`의 세 번째 인자로 전달) React가 최초 마운트 시 딱 한 번만 실행해준다. localStorage 접근은 비교적 비싼 작업이라 이 차이가 의미가 있다.

**SSR(Next.js 등) 환경에서는 초기화에 주의**: Next.js처럼 서버에서 먼저 렌더링하는 환경에는 서버에 `window`·`localStorage`가 없다. 위 코드를 그대로 두면 서버에서 에러가 나거나, 서버가 그린 화면과 클라이언트가 그린 화면이 달라 hydration mismatch 경고가 발생한다. 이런 경우에는 초기값을 서버/클라이언트 일치하게 처리하거나, next-themes 같은 검증된 라이브러리를 쓴다. 반대로 순수 CSR(Vite 기반 SPA 등)이라면 위 코드를 그대로 써도 된다.

### 8.4 최적화의 한계

다만 이 패턴이 모든 경우에 적용되는 것은 아니다. 테마처럼 자주 바뀌지 않는 값에서는 분리의 실제 이득이 크지 않다. 효과가 뚜렷하게 나타나는 건 상태가 자주 바뀌거나, 그 값을 바꾸기만 하는 소비자가 많거나, 영향을 받는 컴포넌트 트리가 클 때다.

또한, 분리는 어디까지나 "값을 읽느냐, 바꾸느냐" 수준에서만 나눠줄 뿐, 하나의 상태 객체 안에서 특정 필드만 골라 구독하게 해주지는 못한다. 예를 들어, 전역 상태가 큰 객체이고 컴포넌트마다 그 중 다른 필드 하나씩만 필요하다면 state/dispatch 분리만으로는 부족하다. 큰 객체에서 필드별 구독이 필요하면 use-context-selector나 Zustand·Jotai(셀렉터 단위 구독 기본 제공) 같은 도구로 넘어갈 신호다.

## 9. 실전 패턴 3 — 로그인 관련 값 저장과 접근

로그인은 한 데이터가 여러 곳에 걸쳐 저장되는 패턴이 가장 뚜렷하게 드러나는 예시이다. "로그인 관련 값"이라고 뭉뚱그리기 쉽지만, 실제로는 성격이 전혀 다른 세 가지가 섞여 있다. 이를 세 가지로 나누어 보면,

- **토큰** — 인증을 증명하는 값. 어디에 저장하느냐가 곧 보안 문제(XSS·CSRF)로 직결되므로 가장 신중하게 다뤄야 한다.
- **인증 상태** — "지금 로그인했는가 / 누구인가" 같은 런타임 값 → store / Context
- **사용자 데이터** — 프로필·권한 등 서버에 원본이 있는 값 → 서버 상태(React Query)

가장 흔한 실수가 이 셋을 구분하지 않고 "로그인 정보를 통째로 localStorage에 다 넣는 것"인데, 이것이 곧 보안 사고의 원인이 된다.

### 9.1 토큰을 어디에 저장할까

| 저장 위치 | XSS(스크립트 주입) | CSRF | 새로고침 유지 | 비고 |
| --- | --- | --- | --- | --- |
| localStorage | 취약 (JS가 그대로 읽음) | 안전 | O | 가장 간단하지만 토큰 탈취 위험 |
| sessionStorage | 취약 | 안전 | 탭 한정 | localStorage와 동일 위험 |
| 메모리(JS 변수/store) | 상대적 안전(영속 안 됨) | 안전 | X | access token에 적합 |
| httpOnly 쿠키 | 안전(JS가 못 읽음) | 취약 → SameSite로 완화 | O | refresh token에 적합 |

localStorage에 토큰을 넣으면 XSS 한 방에 통째로 털린다. XSS에 의해 페이지에 악성 스크립트가 실행되면(예 - `localStorage.getItem('token')`) 토큰을 그대로 읽어갈 수 있기 때문이다.

그래서 권장 조합은, 토큰을 종류에 따라 나누어 수명이 짧은 access token은 메모리에, 수명이 긴 refresh token은 httpOnly 쿠키에 두는 조합을 쓴다.

- **access token**: JS 메모리에만 둔다.
- **refresh token**: httpOnly + Secure + SameSite 속성을 가진 쿠키로 둔다. httpOnly라 JS가 읽을 수 없어 XSS로 탈취 불가하며, 요청 시 브라우저가 알아서 함께 보낸다.
- 새로고침으로 메모리의 access token이 날아가면, 앱 시작 시 refresh 쿠키로 조용히 재발급받아 복원한다.

### 9.2 토큰 저장 (메모리)

```js
// auth/tokenStore.js — access token은 메모리에만 보관
let accessToken = null;

export const tokenStore = {
  get: () => accessToken,
  set: (t) => { accessToken = t; },
  clear: () => { accessToken = null; },
};
```

여기서 핵심은 의도적으로 localStorage를 쓰지 않는 것이다. 이렇게 메모리에만 두면, 브라우저 탭을 닫으면 토큰도 자연히 사라진다.

### 9.3 API 클라이언트 (토큰 부착 + 자동 재발급)

access token이 메모리에만 있으니, 모든 요청에 이를 꺼내 붙여 줄 공통 창구가 필요하다.

아래 `apiClient`는 두 가지 역할을 한다. 요청에 access token을 자동으로 붙이고, 토큰이 만료되어 서버가 401을 돌려주면 refresh로 새 토큰을 받아 그 요청을 한 번 다시 시도한다. 이때 여러 요청이 거의 동시에 만료됨(401)을 응답받을 수 있는데, 그때마다 refresh를 따로 호출하지 않도록 refresh는 한 번만 돌도록 묶어 둔다.

```js
// auth/apiClient.js
import { tokenStore } from './tokenStore';

let refreshPromise = null;

async function refreshAccessToken() {
  // refresh 토큰은 httpOnly 쿠키 → JS가 직접 다루지 않고 credentials로 자동 전송
  const res = await fetch('/api/auth/refresh', {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('refresh 실패');

  const { accessToken } = await res.json();
  tokenStore.set(accessToken);

  return accessToken;
}

// 진행 중인 refresh가 있으면 재사용 → 동시 401을 한 번의 refresh로 합침
function refreshOnce() {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

export async function apiFetch(url, options = {}) {
  const token = tokenStore.get();
  let res = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  // access token 만료면 한 번만 재발급 후 재시도
  if (res.status === 401 && tokenStore.get()) {
    try {
      const newToken = await refreshOnce();
      res = await fetch(url, {
        ...options,
        credentials: 'include',
        headers: { ...options.headers, Authorization: `Bearer ${newToken}` },
      });
    } catch (e) {
      tokenStore.clear();
      window.dispatchEvent(new Event('auth:logout')); // 전역 로그아웃
      throw e;
    }
  }
  return res;
}
```

### 9.4 인증 상태 (Context, state/dispatch 분리)

토큰을 어디에 둘지와는 별개로, "지금 로그인되어 있는가, 로그인된 사용자는 누구인가"라는 런타임 상태는 화면 곳곳에서 함께 봐야 하는 값이므로 Context에 둔다.

토큰이 인증의 증거라면, 이 상태는 그 증거로부터 만들어내는 판단이라고 이해할 수 있다. 앞서 테마 예제에서 만든 state/dispatch 분리 패턴을 그대로 가져다 쓰되, state에 `loading`, `authenticated`, `unauthenticated` 세 단계를 두어 구분한다.

여기에서 핵심은 마운트 시점의 `useEffect`이다. 새로고침 직후에는 메모리에 access token이 없으므로, `apiFetch('/api/me')`를 호출하면 그 안에서 401 → refresh 쿠키로 재발급 → 재시도 순으로 진행되며 로그인 세션이 조용히 복원된다. 성공하면 `login`, 실패하면 `logout`으로 상태를 확정한다. 또한 apiClient가 refresh에 끝내 실패한 경우 `auth:logout` 이벤트도 함께 받아서, 토큰이 만료되어 세션이 끊긴 경우에도 인증 상태를 안전하게 내려 준다.

```jsx
// auth/AuthContext.jsx
import { createContext, useContext, useReducer, useEffect } from 'react';
import { tokenStore } from './tokenStore';
import { apiFetch } from './apiClient';

const AuthStateContext = createContext(null);
const AuthDispatchContext = createContext(null);

// status: 'loading' | 'authenticated' | 'unauthenticated'
const initialState = { user: null, status: 'loading' };

function authReducer(state, action) {
  switch (action.type) {
    case 'login':  return { user: action.user, status: 'authenticated' };
    case 'logout': return { user: null, status: 'unauthenticated' };
    default: throw new Error(`알 수 없는 액션: ${action.type}`);
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // 앱 시작 시: 메모리엔 토큰이 없으므로 refresh 쿠키로 세션 복원을 시도
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await apiFetch('/api/me'); // 401이면 내부에서 refresh 시도
        if (!res.ok) throw new Error();
        const user = await res.json();
        if (alive) dispatch({ type: 'login', user });
      } catch {
        if (alive) dispatch({ type: 'logout' });
      }
    })();

    // apiClient가 보내는 전역 로그아웃 신호 수신
    const onLogout = () => dispatch({ type: 'logout' });
    window.addEventListener('auth:logout', onLogout);
    return () => { alive = false; window.removeEventListener('auth:logout', onLogout); };
  }, []);

  return (
    <AuthDispatchContext.Provider value={dispatch}>
      <AuthStateContext.Provider value={state}>
        {children}
      </AuthStateContext.Provider>
    </AuthDispatchContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthStateContext);
  if (ctx === null) throw new Error('useAuth는 AuthProvider 안에서만 쓸 수 있습니다');
  return ctx;
}

export function useAuthDispatch() {
  const ctx = useContext(AuthDispatchContext);
  if (ctx === null) throw new Error('useAuthDispatch는 AuthProvider 안에서만 쓸 수 있습니다');
  return ctx;
}
```

로그인과 로그아웃은 이 흐름에 맞춰, 토큰 저장(메모리)과 상태 갱신(Context)을 한 번에 처리한다.

```js
export async function login(dispatch, credentials) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    credentials: 'include', // 서버가 refresh 토큰을 httpOnly 쿠키로 내려줌
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) throw new Error('로그인 실패');
  const { accessToken, user } = await res.json();
  tokenStore.set(accessToken);          // access token은 메모리에만
  dispatch({ type: 'login', user });    // 인증 상태 갱신
}

export async function logout(dispatch) {
  await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
  tokenStore.clear();
  dispatch({ type: 'logout' });
}
```

### 9.5 세션 복원

앞서 9.4에서 `loading` 상태를 따로 둔 이유가 있다. 앱이 막 켜진 직후에는 세션 복원이 아직 끝나지 않아 "로그인 여부를 모르는" 구간이 존재한다. 이때 단순히 "로그인 안됨"으로 간주하면 실제로는 로그인된 사용자가 새로고침할 때마다 잠깐 로그인 페이지로 튕겼다가 다시 돌아오게 되는 현상이 생기게 된다. 그래서 `loading` 상태를 두고 로딩 화면을 보여주는 등 로그인 세션이 복원되고 있는 구간을 따로 두고 복원이 끝나 상태가 확정되고 난 뒤 로그인 페이지로 돌려보낼지 여부를 정한다.

```jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';

function ProtectedRoute({ children }) {
  const { status } = useAuth();
  if (status === 'loading') return <FullPageSpinner />;          // 복원 대기
  if (status === 'unauthenticated') return <Navigate to="/login" replace />;
  return children;
}
```

### 9.6 로그인 관련 값들은 어디에 무엇을 두는가?

- **refresh token** → httpOnly 쿠키 (JS 접근 불가, XSS 방어)
- **access token** → 메모리(tokenStore) (영속 안 됨, 짧은 수명)
- **인증 상태(로그인 여부·user)** → Context / store (런타임 공유, 토큰에서 파생)
- **사용자 프로필·권한 등** → 서버 상태(React Query)
- **로그인 후 돌아갈 경로 같은 일회성 값** → URL(`?redirect=/dashboard`)이나 sessionStorage

### 9.7 꼭 알아둘 보안 단서

어떤 클라이언트 저장소도 XSS를 완벽히 막지는 못한다. httpOnly 쿠키는 토큰이 탈취되는 것을 막아주지만, XSS로 페이지 안에서 코드를 실행할 수 있으면 토큰을 직접 빼내지 못하더라도 사용자인 척 요청을 보낼 수 있다. 때문에 토큰 저장 위치를 고르는 일은 어디까지나 한 겹의 방어일 뿐, 진짜 방어를 위해서는 XSS 자체를 막는 것이다.(입력 검증·escape, CSP(Content Security Policy) 헤더 설정, 신뢰할 수 없는 데이터를 `dangerouslySetInnerHTML`로 회피 등)

로그인은 보안 요구 수준과 백엔드 구조에 따라 답이 달라지는 영역이므로, 위의 예시 패턴을 기본으로 삼되 구체적 선택은 현실적인 상황에 맞춰 조정한다.

마지막으로, 더 높은 수준의 보안이 필요하다면, 토큰을 프론트에서 아예 다루지 않고 모든 토큰을 httpOnly 쿠키로 처리하거나, 별도 BFF(Backend-for-Frontend) 서버를 두는 구성도 고려할 만하다.

토큰을 httpOnly 쿠키에 담으면, 토큰은 브라우저의 쿠키 저장소에 물리적으로 존재한다. 다만 httpOnly 속성 때문에 JS가 `document.cookie`로 읽을 수 없다. 때문에 아래 세 가지 내용이 프론트에서 사라지게 된다.

- **토큰 읽기**: 프론트 코드가 토큰 값을 볼 수 없다.
- **토큰 저장**: 어디에 둘지, 언제 지울지 정할 필요가 없다. 브라우저가 쿠키 수명에 따라 알아서 관리한다.
- **요청 시 토큰 전달**: Authorization 헤더에 토큰을 실어 보낼 필요가 없다. 요청 시 브라우저가 자동으로 보낸다.

때문에 위의 예시에서 `tokenStore`, Authorization 헤더에 토큰을 추가하거나 401 재발급 로직이 프론트에서 모두 없어진다. 토큰을 다루는 주체가 프론트가 아니라 브라우저(실행 환경)로 옮겨간 것이라고 이해하면 된다.

Vite 기반의 CSR은 그대로 두고, 앞단에 별도 BFF 서버(Node 등)를 두는 구성이라면, 토큰은 서버에만 보관하고 브라우저엔 의미 없는 세션 ID(예 - `sid`)만 전달한다. 이 경우, 토큰이 프론트와 브라우저에 아예 도달하지 않고 BFF에만 존재하게 된다.

**Node.js (Express) BFF 예시**

```js
// bff/server.js — 프론트와 "같은 오리진"으로 노출되는 별도 Node 서버
import express from 'express';
import cookieParser from 'cookie-parser';
import crypto from 'node:crypto';

const app = express();
app.use(express.json());
app.use(cookieParser());

// 서버 측 세션 저장소 (예시는 메모리 — 실제로는 Redis 등을 쓴다)
const sessions = new Map(); // sid -> { accessToken, refreshToken, user }

const AUTH_API = 'https://auth.example.com';
const RESOURCE_API = 'https://api.example.com';

// 1) 로그인: 자격증명 → 토큰 교환 → 서버 세션에 보관 → 브라우저엔 세션 쿠키만
app.post('/auth/login', async (req, res) => {
  const r = await fetch(`${AUTH_API}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body),
  });
  if (!r.ok) return res.status(401).json({ error: 'login failed' });

  const { accessToken, refreshToken, user } = await r.json();

  const sid = crypto.randomUUID();
  sessions.set(sid, { accessToken, refreshToken, user }); // 토큰은 여기, 서버에만 머문다

  // 브라우저로는 "세션 ID(sid)"만 전달 (httpOnly)
  res.cookie('sid', sid, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
  res.json({ user }); // 프론트엔드엔 사용자 정보 정도만 돌려준다
});

// 2) 현재 사용자 — 프론트가 로그인 여부를 알 수 있도록
app.get('/auth/me', (req, res) => {
  const session = sessions.get(req.cookies.sid);
  if (!session) return res.status(401).json({ error: 'unauthenticated' });
  res.json({ user: session.user });
});

// 3) 로그아웃
app.post('/auth/logout', (req, res) => {
  sessions.delete(req.cookies.sid);
  res.clearCookie('sid');
  res.status(204).end();
});

// 4) API 프록시 — 세션에서 토큰을 꺼내 실제 API로 붙여 전달
app.use('/api', async (req, res) => {
  const session = sessions.get(req.cookies.sid);
  if (!session) return res.status(401).json({ error: 'unauthenticated' });

  const upstream = await fetch(`${RESOURCE_API}${req.url}`, {
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.accessToken}`, // 토큰은 BFF에서 관리하여 요청 시 전달한다
    },
    body: ['GET', 'HEAD'].includes(req.method) ? undefined : JSON.stringify(req.body),
  });

  // 로그인이 만료된 경우 (401) 이면 session.refreshToken으로 재발급 후 로그인 재시도하고,
  // 실패 시 세션을 폐기한다 — refresh 로직 전체도 프론트에서 BFF로 넘어온다

  res.status(upstream.status).send(await upstream.text());
});

app.listen(8080);
```

이 경우, 프론트는 같은 origin의 `/api`만 호출하면 된다.

```js
// 프론트엔드 (예: Vite CSR) — 토큰을 전혀 다루지 않는다
async function apiFetch(path, options = {}) {
  return fetch(`/api${path}`, {
    ...options,
    credentials: 'include',                 // 세션 쿠키(sid)만 자동 전송
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
}

// 로그인도 BFF 엔드포인트만 호출
await fetch('/auth/login', {
  method: 'POST',
  credentials: 'include', // BFF -> API 호출 시, 쿠키가 자동 전송되도록 여전히 필요
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});
```

## 10. Summary

상태 관리의 합리적인 기본 전략:

1. 가능하면 로컬 상태로 둔다.
2. 서버 데이터는 React Query 같은 전용 도구에 맡긴다.
3. 공유·북마크가 필요하면 URL에 둔다.
4. 영속이 필요하면 저장소에 둔다.
5. 그러고도 남는 진짜 전역 클라이언트 상태(테마, 인증 등)만 Context 또는 가벼운 store로 관리한다.
6. 로그인은 토큰(저장 위치 = 보안)·인증 상태(런타임 store/Context)·사용자 데이터(서버 상태)를 분리하고, access token은 메모리·refresh token은 httpOnly 쿠키에 둔다.

이렇게 성격별로 분리하면 "모든 걸 Redux에 넣던" 시절보다 코드가 훨씬 단순해진다.
