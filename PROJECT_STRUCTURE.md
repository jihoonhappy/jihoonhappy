# 프로젝트 디렉토리 구조

## Firebase 기반 아키텍처

```
jihoonhappy/
│
├── frontend/                          # React 프론트엔드
│   ├── public/
│   │   ├── index.html
│   │   └── assets/
│   │       ├── images/
│   │       └── sounds/
│   │
│   ├── src/
│   │   ├── components/               # 재사용 가능한 컴포넌트
│   │   │   ├── common/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   └── LoadingSpinner.tsx
│   │   │   │
│   │   │   ├── game/
│   │   │   │   ├── ChoiceButton.tsx  # 가위/바위/보 버튼
│   │   │   │   ├── GameResult.tsx
│   │   │   │   ├── RoundIndicator.tsx
│   │   │   │   └── Timer.tsx
│   │   │   │
│   │   │   └── layout/
│   │   │       ├── Header.tsx
│   │   │       ├── Footer.tsx
│   │   │       └── Sidebar.tsx
│   │   │
│   │   ├── pages/                    # 페이지 컴포넌트
│   │   │   ├── Auth/
│   │   │   │   ├── Login.tsx
│   │   │   │   └── Signup.tsx
│   │   │   │
│   │   │   ├── Dashboard/
│   │   │   │   └── Dashboard.tsx     # 메인 화면
│   │   │   │
│   │   │   ├── PvC/
│   │   │   │   └── PvCGame.tsx
│   │   │   │
│   │   │   ├── PvP/
│   │   │   │   ├── Matchmaking.tsx
│   │   │   │   └── PvPGame.tsx
│   │   │   │
│   │   │   ├── CvC/
│   │   │   │   ├── CvCLobby.tsx
│   │   │   │   ├── BettingPanel.tsx
│   │   │   │   └── LiveGame.tsx
│   │   │   │
│   │   │   └── Profile/
│   │   │       ├── MyPage.tsx
│   │   │       ├── GameHistory.tsx
│   │   │       └── Stats.tsx
│   │   │
│   │   ├── hooks/                    # Custom Hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useGame.ts
│   │   │   ├── useMatchmaking.ts
│   │   │   ├── useBetting.ts
│   │   │   └── useFirestore.ts
│   │   │
│   │   ├── services/                 # Firebase 서비스 래퍼
│   │   │   ├── auth.service.ts
│   │   │   ├── game.service.ts
│   │   │   ├── user.service.ts
│   │   │   └── betting.service.ts
│   │   │
│   │   ├── store/                    # 상태 관리 (Zustand)
│   │   │   ├── authStore.ts
│   │   │   ├── gameStore.ts
│   │   │   └── userStore.ts
│   │   │
│   │   ├── types/                    # TypeScript 타입 정의
│   │   │   ├── game.types.ts
│   │   │   ├── user.types.ts
│   │   │   └── betting.types.ts
│   │   │
│   │   ├── utils/                    # 유틸리티 함수
│   │   │   ├── gameLogic.ts          # 가위바위보 로직
│   │   │   ├── validators.ts
│   │   │   └── formatters.ts
│   │   │
│   │   ├── config/                   # 설정 파일
│   │   │   ├── firebase.config.ts
│   │   │   └── constants.ts
│   │   │
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   │
│   ├── .env.local                    # 환경 변수
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── functions/                         # Firebase Cloud Functions
│   ├── src/
│   │   ├── index.ts                  # Functions 엔트리포인트
│   │   │
│   │   ├── game/
│   │   │   ├── pvc.functions.ts      # PVC 게임 로직
│   │   │   ├── pvp.functions.ts      # PVP 게임 로직
│   │   │   ├── cvc.functions.ts      # CVC 게임 생성 및 실행
│   │   │   └── matchmaking.functions.ts
│   │   │
│   │   ├── betting/
│   │   │   ├── bet.functions.ts
│   │   │   └── payout.functions.ts
│   │   │
│   │   ├── user/
│   │   │   ├── onCreate.functions.ts # 사용자 생성 시 초기화
│   │   │   └── stats.functions.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── gameLogic.ts
│   │   │   ├── validators.ts
│   │   │   └── helpers.ts
│   │   │
│   │   └── types/
│   │       └── index.ts
│   │
│   ├── package.json
│   └── tsconfig.json
│
├── firestore.rules                   # Firestore 보안 규칙
├── firestore.indexes.json            # Firestore 인덱스
├── firebase.json                     # Firebase 설정
├── .firebaserc                       # Firebase 프로젝트 설정
│
├── docs/                             # 문서
│   ├── DESIGN.md
│   ├── API.md
│   └── DEPLOYMENT.md
│
├── .gitignore
├── README.md
└── package.json
```

---

## 대안: Express + MongoDB/MariaDB 아키텍처

```
jihoonhappy/
│
├── client/                           # React 프론트엔드
│   └── [위와 동일한 구조]
│
├── server/                           # Express 백엔드
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts           # DB 연결 설정
│   │   │   ├── socket.ts             # Socket.io 설정
│   │   │   └── env.ts
│   │   │
│   │   ├── models/                   # DB 모델 (Mongoose 또는 Sequelize)
│   │   │   ├── User.model.ts
│   │   │   ├── Game.model.ts
│   │   │   └── Bet.model.ts
│   │   │
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── game.controller.ts
│   │   │   ├── user.controller.ts
│   │   │   └── betting.controller.ts
│   │   │
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── game.service.ts
│   │   │   ├── matchmaking.service.ts
│   │   │   └── betting.service.ts
│   │   │
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── validation.middleware.ts
│   │   │   └── error.middleware.ts
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── game.routes.ts
│   │   │   ├── user.routes.ts
│   │   │   └── betting.routes.ts
│   │   │
│   │   ├── socket/
│   │   │   ├── gameSocket.ts
│   │   │   ├── matchmakingSocket.ts
│   │   │   └── cvcSocket.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── gameLogic.ts
│   │   │   ├── validators.ts
│   │   │   └── helpers.ts
│   │   │
│   │   ├── types/
│   │   │   └── index.ts
│   │   │
│   │   └── app.ts                    # Express 앱
│   │
│   ├── package.json
│   └── tsconfig.json
│
├── docker-compose.yml                # MongoDB/MariaDB 컨테이너
├── .env.example
└── README.md
```

---

## 주요 파일 설명

### Frontend

#### `src/types/game.types.ts`
```typescript
export type Choice = 'rock' | 'paper' | 'scissors';
export type GameType = 'pvp' | 'pvc' | 'cvc';
export type GameStatus = 'waiting' | 'in_progress' | 'completed';

export interface Game {
  id: string;
  gameType: GameType;
  status: GameStatus;
  players: {
    player1: Player;
    player2: Player;
  };
  result?: GameResult;
  createdAt: Date;
  completedAt?: Date;
}
```

#### `src/utils/gameLogic.ts`
```typescript
export function determineWinner(
  p1: Choice,
  p2: Choice
): 'player1' | 'player2' | 'draw';
```

### Backend (Functions)

#### `functions/src/game/pvc.functions.ts`
```typescript
export const createPvCGame = functions.https.onCall(async (data, context) => {
  // PVC 게임 생성 로직
});

export const playPvCRound = functions.https.onCall(async (data, context) => {
  // 라운드 실행 로직
});
```

#### `functions/src/game/matchmaking.functions.ts`
```typescript
export const joinMatchmaking = functions.https.onCall(async (data, context) => {
  // 매칭 큐 참가
});

export const onMatchmakingWrite = functions.firestore
  .document('matchmaking/{userId}')
  .onCreate(async (snap, context) => {
    // 매칭 로직
  });
```

---

## 환경 변수 설정

### `.env.local` (Frontend)
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your_app_id
```

### `functions/.env` (Cloud Functions)
```env
INITIAL_USER_POINTS=1000
CVC_GAME_INTERVAL=30000
BETTING_DURATION=20000
```

---

## Git 브랜치 전략

```
main (production)
  │
  ├── develop (개발)
  │   │
  │   ├── feature/auth           # 인증 기능
  │   ├── feature/pvc-game       # PVC 게임
  │   ├── feature/pvp-game       # PVP 게임
  │   ├── feature/cvc-betting    # CVC 베팅
  │   └── feature/ui-design      # UI 디자인
  │
  └── hotfix/*                   # 긴급 수정
```

---

## 다음 단계

1. **Firebase 프로젝트 설정** 또는 **DB 선택 확정**
2. 프론트엔드 프로젝트 초기화 (React + Vite + TypeScript)
3. Firebase Functions 초기화 (또는 Express 서버)
4. 기본 디렉토리 구조 생성

어떤 아키텍처로 진행하시겠습니까?
