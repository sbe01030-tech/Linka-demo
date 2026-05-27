# 02. TSX 코드 읽는 법

> 목표: `.tsx` 파일을 열었을 때 "어디가 뭐 하는 부분"인지 즉시 알아볼 수 있게 합니다.
> 시간: 약 30분.
> 같이 열어둘 파일: [src/screens/auth/WelcomeScreen.tsx](../../src/screens/auth/WelcomeScreen.tsx) — 본인이 어제 카피 수정한 그 파일.

---

## 큰 구조 한눈에

대부분의 `XxxScreen.tsx` 파일은 **3개 영역** 으로 이루어져 있습니다.

```
┌─────────────────────────────────────┐
│  ① import 영역  (위)                 │  ← 다른 파일에서 가져오는 것들
│                                      │
├─────────────────────────────────────┤
│  ② 컴포넌트 함수  (가운데)           │  ← 화면 본체. 우리가 가장 많이 만짐
│                                      │
├─────────────────────────────────────┤
│  ③ 스타일 영역  (아래)               │  ← 색·여백·폰트 같은 디자인 값
└─────────────────────────────────────┘
```

이 3개를 구분할 수 있으면 절반은 끝났어요.

---

## ① import 영역

WelcomeScreen 맨 위:

```tsx
import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, Dimensions, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius } from '../../constants/colors';
import { useLanguageStore } from '../../store/languageStore';
```

**해석법** — 각 줄은 "**A 라는 것을 B에서 가져온다**" 라는 뜻입니다.

| 형태 | 뜻 |
|---|---|
| `import { A, B } from 'C'` | C 라는 라이브러리/파일에서 A·B를 빌려온다 |
| `import D from 'E'` | E의 대표 묶음을 D로 받는다 |
| `'react-native'` | 라이브러리 이름 (npm으로 설치된 것) |
| `'../../constants/colors'` | 우리 프로젝트 안 파일 (점 두 개는 "두 단계 위 폴더") |

**기억할 것**: 새로 쓰는 컴포넌트·함수가 있으면 import에 한 줄 추가해줘야 합니다. 안 그러면 "이거 누구야?" 에러가 납니다.

---

## ② 컴포넌트 함수 — 화면 본체

함수 하나가 화면 하나입니다. 형태:

```tsx
export default function WelcomeScreen() {
  // ← 여기에 변수·로직
  return (
    <View>
      {/* ← 여기에 화면에 그려질 모양 */}
    </View>
  );
}
```

**3개 키워드 의미:**
| 키워드 | 뜻 |
|---|---|
| `export default` | "이 파일의 대표는 이거야" — 다른 파일이 import 할 때 가져가는 것 |
| `function 이름()` | 함수 정의. 컴포넌트 이름은 항상 **대문자로 시작** |
| `return ( ... )` | 함수가 돌려주는 결과. 이 안에 적힌 게 화면에 그려짐 |

---

## ③ JSX/TSX 본문 — 화면에 그려지는 부분

`return ( ... )` 안의 내용을 **JSX** 라고 합니다. HTML처럼 보이지만 React용입니다.

### 패턴 1 — 태그

```tsx
<View>
  <Text>안녕</Text>
</View>
```

- 여는 태그 `<View>` + 내용 + 닫는 태그 `</View>`
- 안에 다른 태그를 또 넣을 수 있음 (둥지처럼 중첩)
- HTML의 `<div>` ≈ React Native의 `<View>` (네모 영역)
- HTML의 `<p>` ≈ React Native의 `<Text>` (글자)
- 모든 텍스트는 반드시 `<Text>` 안에 들어가야 함 — RN의 첫 번째 함정!

### 패턴 2 — 속성 (props)

```tsx
<TouchableOpacity onPress={handleLogin} style={s.button}>
  <Text>로그인</Text>
</TouchableOpacity>
```

태그 안의 `onPress=...`, `style=...` 같은 게 **속성(props)** 입니다. "이 컴포넌트야, 이런 식으로 동작해" 라는 지시.

| 속성 예시 | 뜻 |
|---|---|
| `onPress={handleLogin}` | 눌렀을 때 handleLogin 함수 실행 |
| `style={s.button}` | s.button 스타일 적용 |
| `disabled={true}` | 비활성 상태 |

### 패턴 3 — 중괄호 `{ }` 안엔 JavaScript

JSX 안에서 `{ }` 를 만나면 **그 안은 JS 코드** 입니다.

```tsx
<Text>{userName}</Text>
<Text>{1 + 2}</Text>
<Text>{lang === 'ko' ? '안녕' : 'Hello'}</Text>
```

| 형태 | 뜻 |
|---|---|
| `{변수명}` | 변수 값 표시 |
| `{함수()}` | 함수 결과 표시 |
| `{조건 ? A : B}` | 조건이 참이면 A, 아니면 B |
| `{condition && <X/>}` | 조건이 참일 때만 `<X/>` 그림 |

### 패턴 4 — 다국어 (Linka 패턴)

본인 코드에서 자주 보이는 이거:

```tsx
headline={tx('더 빠르게. 더 안전하게.',
             'Faster. Safer.',
             'Lebih cepat. Lebih aman.')}
```

`tx`는 우리가 만든 함수로, 현재 언어가 ko/en/id 중 뭐냐에 따라 셋 중 하나를 골라 반환합니다.
순서: **한국어, 영어, 인도네시아어**.

→ 화면 텍스트 바꿀 때 **세 언어 모두 같이 바꿔주는 게 원칙**.

### 패턴 5 — 리스트 (배열 .map)

```tsx
{items.map((item) => (
  <Text key={item.id}>{item.name}</Text>
))}
```

배열의 각 항목마다 `<Text>` 하나씩 만듭니다. `key`는 React가 항목을 구분하기 위한 ID — 깜빡하면 노란 경고가 떠요.

---

## ④ 스타일 영역

파일 맨 아래쯤 보면:

```tsx
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#000' },
  button: { padding: 12, borderRadius: 8 },
});
```

**해석:**
- `s` 라는 스타일 묶음을 정의
- 위에서 `style={s.title}` 처럼 골라서 사용
- CSS와 **거의 비슷하지만 다름**:
  - 단위 없음 (그냥 숫자 → pt)
  - 속성명은 카멜케이스 (`background-color` 아니고 `backgroundColor`)
  - 색은 `#fff`, `'rgba(...)'`, 또는 `Colors.accent` 같은 상수 사용

---

## 자주 보는 헷갈리는 것들

### `()` vs `{}` vs `<>`

| 기호 | 뜻 |
|---|---|
| `( )` | JS 표현식 그룹화 (return 문 줄바꿈, 화살표 함수 인자 등) |
| `{ }` | JSX 안에서 JS 코드 / JS 안에서 객체 |
| `< >` | JSX 태그 |

### 화살표 함수

```tsx
onPress={() => navigation.navigate('Login')}
```

`() => ...` 모양이 **익명 함수** 입니다. "이 버튼 눌리면 이거 실행해" 라는 한 회용 함수를 즉석에서 만든 것.

### 콘솔 로그 (디버깅 시 자주 씀)

```tsx
console.log('현재 언어:', lang);
```

코드 동작 중간에 값을 확인하고 싶을 때 사용. 시뮬레이터/Expo 개발자 도구 콘솔에 출력됩니다.

---

## 직접 해보기

### 미션 1 — 영역 구분
[WelcomeScreen.tsx](../../src/screens/auth/WelcomeScreen.tsx) 를 열고 다음 줄들이 어느 영역인지 맞춰보세요:
- 12번째 줄 (`import React, ...`)
- 130번째 줄 (`<Text style={s.headline}>`)
- 200번째 줄 (`const s = StyleSheet.create({`)

### 미션 2 — 텍스트 바꿔보기
[WelcomeScreen.tsx:138](../../src/screens/auth/WelcomeScreen.tsx#L138) 의 `'작은 연결.'` 을 다른 한국어로 바꿔보세요. (영어·인니어도 같이!) 저장 후 앱이 어떻게 변하는지 확인.

### 미션 3 — 자기 분류
다음 코드 조각을 보고 "이건 무슨 패턴이지?" 맞춰보세요:

```tsx
{lang === 'ko' && <Text>한국어 사용자 전용</Text>}
```

**힌트**: 패턴 3과 4 사이 어딘가.

---

## 한 줄 요약

> **TSX = HTML처럼 보이는 JS 코드. `{}` 안에선 JS, 그 외는 화면 그리기.**

이거 하나만 기억하셔도 95% 다 됩니다.

---

## 다음 모듈

→ 03 — 컴포넌트 / Props / State 개념 (작성 예정)

여기서 "왜 화면이 여러 작은 부품으로 쪼개져 있는지" 의 핵심 이유를 다룹니다.
