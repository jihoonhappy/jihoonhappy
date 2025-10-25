# 가위바위보 게임 - Frontend

React + TypeScript + Vite로 구축된 가위바위보 게임 프론트엔드입니다.

## 기술 스택

- **React 18** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Vite** - 빠른 빌드 도구
- **TailwindCSS** - 유틸리티 기반 CSS
- **Zustand** - 상태 관리
- **React Router** - 라우팅
- **Firebase SDK** - 인증 및 Firestore

## 시작하기

### 1. 환경 변수 설정

`.env.example`를 복사하여 `.env.local` 파일을 생성하고 Firebase 설정을 입력하세요:

```bash
cp .env.example .env.local
```

`.env.local` 파일을 열고 Firebase 프로젝트 정보를 입력:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=dain-happy.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=dain-happy
VITE_FIREBASE_STORAGE_BUCKET=dain-happy.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:5173 을 엽니다.

### 4. 빌드

```bash
npm run build
```

빌드된 파일은 `dist/` 디렉토리에 생성됩니다.

## 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── common/         # 공통 컴포넌트 (Button, Card 등)
│   ├── game/           # 게임 관련 컴포넌트
│   └── layout/         # 레이아웃 컴포넌트 (Header 등)
├── pages/              # 페이지 컴포넌트
│   ├── Auth/           # 로그인/회원가입
│   ├── Dashboard/      # 메인 대시보드
│   ├── PvC/            # Player vs Computer
│   ├── PvP/            # Player vs Player
│   ├── CvC/            # Computer vs Computer (베팅)
│   └── Profile/        # 프로필/전적
├── hooks/              # Custom React Hooks
├── services/           # Firebase 서비스 래퍼
├── store/              # Zustand 상태 관리
├── types/              # TypeScript 타입 정의
├── utils/              # 유틸리티 함수
└── config/             # 설정 파일
```

## 현재 구현 상태

### ✅ 완료
- [x] 프로젝트 초기화 및 설정
- [x] TailwindCSS 설정
- [x] Firebase 설정 및 연동
- [x] TypeScript 타입 정의
- [x] Zustand 상태 관리 스토어
- [x] 인증 서비스 (로그인/회원가입)
- [x] 공통 컴포넌트 (Button, Card, LoadingSpinner)
- [x] 레이아웃 컴포넌트 (Header)
- [x] 로그인/회원가입 페이지
- [x] 대시보드 페이지

### 🚧 진행 예정
- [ ] PvC 게임 페이지
- [ ] PvP 게임 페이지 (매칭 시스템)
- [ ] CvC 관람 및 베팅 페이지
- [ ] 프로필 페이지
- [ ] 게임 히스토리
- [ ] 리더보드

## 사용 가능한 스크립트

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview

# ESLint 검사
npm run lint
```

## Firebase 설정 확인사항

Firebase 콘솔에서 다음 사항을 확인하세요:

1. **Authentication** 활성화
   - Email/Password 로그인 방식 활성화

2. **Firestore Database** 생성
   - 테스트 모드로 시작 (나중에 보안 규칙 적용)

3. **Hosting** 설정 (선택사항)
   - Firebase CLI로 배포 가능

## 다음 단계

1. Firebase 프로젝트에서 API 키 획득
2. `.env.local` 파일 설정
3. 개발 서버 실행 및 테스트
4. PvC 게임 기능 구현
5. PvP 매칭 시스템 구현
6. CvC 베팅 시스템 구현

## 문의 및 이슈

문제가 발생하면 이슈를 등록해주세요.
