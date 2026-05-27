# 브랜치 작업 메모

> 새 브랜치로 작업 시작할 때마다 추가. 나중에 "그때 거기 어떻게 가지?" 잊었을 때 보는 용도.

---

## 현재 브랜치: `feat/category-icons-phosphor`

**생성일**: 2026-05-20
**분기점**: `backup/welcome-copy-20260427` 의 커밋 `054dc89` ("snapshot: welcome 카피 작업 중간 저장")
**작업 내용**: 홈 카테고리 8개 아이콘을 Phosphor SVG로 교체

---

## 🔙 이전 작업본으로 돌아가는 법

**브랜치 이동**:
```bash
git checkout backup/welcome-copy-20260427
```

→ 이전 작업 상태로 워킹 디렉토리가 바뀝니다. (앱 코드·문서 등)

**다시 이 브랜치로 돌아오기**:
```bash
git checkout feat/category-icons-phosphor
```

---

## 📜 브랜치 히스토리

| 브랜치 | 용도 | 마지막 커밋 |
|---|---|---|
| `main` | 메인 (제일 처음 만든 브랜치) | first commit 등 |
| `backup/welcome-copy-20260427` | 환영 화면 카피 작업 중간 저장 + 그동안의 모든 작업 누적 | `054dc89` |
| **`feat/category-icons-phosphor`** ← 지금 | 홈 카테고리 Phosphor 아이콘 교체 | 작업 중 |

---

## ⚠️ 주의

- 새 브랜치(`feat/category-icons-phosphor`)에서 한 변경이 마음에 안 들면:
  ```bash
  git checkout backup/welcome-copy-20260427
  ```
  로 돌아가면 이전 상태 그대로. 새 브랜치는 그대로 남아있음 (지우려면 별도 작업).

- 새 브랜치 작업물이 마음에 들면 나중에 main에 머지할 수 있음.

---

## 💡 자주 쓰는 git 명령

```bash
git branch                      # 브랜치 목록 보기 (* 가 현재 브랜치)
git branch --show-current       # 현재 브랜치만 보기
git log --oneline -10           # 최근 커밋 10개
git status                      # 현재 변경된 파일들
git checkout <브랜치명>          # 브랜치 이동
git checkout -b <새브랜치명>     # 새 브랜치 만들고 이동
```
