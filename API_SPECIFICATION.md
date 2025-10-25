# API 명세서

## 개요

이 문서는 가위바위보 게임의 모든 API 엔드포인트를 정의합니다.

Firebase 기반과 Express 기반 두 가지 방식을 모두 문서화합니다.

---

## 1. Firebase Cloud Functions API

### 1.1 인증 (Firebase Authentication 자동 제공)

Firebase SDK를 사용하여 클라이언트에서 직접 처리:

```typescript
// 회원가입
const userCredential = await createUserWithEmailAndPassword(
  auth,
  email,
  password
);

// 로그인
const userCredential = await signInWithEmailAndPassword(
  auth,
  email,
  password
);

// 로그아웃
await signOut(auth);
```

### 1.2 사용자 관리

#### `onCreateUser` (Trigger)
사용자 생성 시 자동 실행

**Type**: `auth.onCreate` trigger

**동작**:
```typescript
// Firestore에 사용자 문서 생성
users/{userId} {
  email: string,
  displayName: string,
  points: 1000,
  stats: {
    totalGames: 0,
    wins: 0,
    losses: 0,
    draws: 0
  },
  createdAt: timestamp
}
```

#### `getUserProfile`
사용자 프로필 조회

**Endpoint**: `functions.httpsCallable('getUserProfile')`

**Request**:
```typescript
{
  userId: string
}
```

**Response**:
```typescript
{
  user: {
    id: string,
    email: string,
    displayName: string,
    points: number,
    stats: UserStats,
    createdAt: string
  }
}
```

#### `updateDisplayName`
사용자 이름 변경

**Endpoint**: `functions.httpsCallable('updateDisplayName')`

**Request**:
```typescript
{
  displayName: string
}
```

**Response**:
```typescript
{
  success: boolean,
  displayName: string
}
```

---

### 1.3 PvC (Player vs Computer) 게임

#### `createPvCGame`
컴퓨터와 게임 시작

**Endpoint**: `functions.httpsCallable('createPvCGame')`

**Request**:
```typescript
{
  maxRounds?: number  // 기본값: 1 (1판제)
}
```

**Response**:
```typescript
{
  gameId: string,
  game: {
    id: string,
    gameType: 'pvc',
    status: 'in_progress',
    players: {
      player1: {
        userId: string,
        choice: null,
        isBot: false
      },
      player2: {
        userId: 'BOT',
        choice: null,
        isBot: true
      }
    },
    round: 1,
    maxRounds: number,
    createdAt: string
  }
}
```

#### `playPvCRound`
가위/바위/보 선택

**Endpoint**: `functions.httpsCallable('playPvCRound')`

**Request**:
```typescript
{
  gameId: string,
  choice: 'rock' | 'paper' | 'scissors'
}
```

**Response**:
```typescript
{
  result: {
    winner: 'player1' | 'player2' | 'draw',
    player1Choice: Choice,
    player2Choice: Choice,
    round: number
  },
  game: {
    status: 'in_progress' | 'completed',
    currentRound: number,
    // 게임 종료 시
    finalWinner?: 'player1' | 'player2' | 'draw',
    pointsAwarded?: number
  }
}
```

**Error Codes**:
- `game-not-found`: 게임을 찾을 수 없음
- `game-already-completed`: 이미 종료된 게임
- `invalid-choice`: 잘못된 선택

---

### 1.4 PvP (Player vs Player) 게임

#### `joinMatchmaking`
매칭 대기열 참가

**Endpoint**: `functions.httpsCallable('joinMatchmaking')`

**Request**:
```typescript
{
  maxRounds?: number  // 기본값: 3 (3판 2선승)
}
```

**Response**:
```typescript
{
  status: 'waiting' | 'matched',
  matchmakingId?: string,  // waiting 상태
  gameId?: string          // matched 상태
}
```

**실시간 리스닝** (클라이언트):
```typescript
// 매칭 발견 시 자동 업데이트
firestore
  .collection('matchmaking')
  .doc(userId)
  .onSnapshot((doc) => {
    if (doc.exists && doc.data().gameId) {
      // 매칭 완료!
      navigateToGame(doc.data().gameId);
    }
  });
```

#### `leaveMatchmaking`
매칭 대기열 나가기

**Endpoint**: `functions.httpsCallable('leaveMatchmaking')`

**Request**: 없음 (인증된 사용자)

**Response**:
```typescript
{
  success: boolean
}
```

#### `playPvPRound`
PVP 라운드 플레이

**Endpoint**: `functions.httpsCallable('playPvPRound')`

**Request**:
```typescript
{
  gameId: string,
  choice: 'rock' | 'paper' | 'scissors'
}
```

**Response**:
```typescript
{
  status: 'waiting' | 'completed',
  // 상대가 선택 전
  waiting: {
    message: '상대방을 기다리는 중...'
  },
  // 상대도 선택 완료 시
  result?: {
    winner: 'player1' | 'player2' | 'draw',
    player1Choice: Choice,
    player2Choice: Choice,
    round: number,
    scores: {
      player1: number,
      player2: number
    }
  },
  gameStatus?: 'in_progress' | 'completed'
}
```

**실시간 리스닝** (클라이언트):
```typescript
// 게임 상태 실시간 업데이트
firestore
  .collection('games')
  .doc(gameId)
  .onSnapshot((doc) => {
    const game = doc.data();
    // UI 업데이트
  });
```

---

### 1.5 CvC (Computer vs Computer) 게임

#### `getActiveCvCGames`
진행 중인 CVC 게임 목록

**Endpoint**: `functions.httpsCallable('getActiveCvCGames')`

**Request**: 없음

**Response**:
```typescript
{
  games: Array<{
    id: string,
    status: 'waiting' | 'betting' | 'in_progress',
    bettingEndsAt: string,
    startsAt: string,
    totalBets: number,
    odds: {
      player1: number,
      player2: number,
      draw: number
    }
  }>
}
```

**실시간 리스닝**:
```typescript
firestore
  .collection('games')
  .where('gameType', '==', 'cvc')
  .where('status', 'in', ['betting', 'in_progress'])
  .onSnapshot((snapshot) => {
    // 게임 목록 업데이트
  });
```

#### `placeBet`
CVC 게임에 베팅

**Endpoint**: `functions.httpsCallable('placeBet')`

**Request**:
```typescript
{
  gameId: string,
  prediction: 'player1' | 'player2' | 'draw',
  amount: number  // 베팅 포인트
}
```

**Response**:
```typescript
{
  betId: string,
  bet: {
    id: string,
    gameId: string,
    userId: string,
    prediction: string,
    amount: number,
    potentialPayout: number,
    status: 'pending',
    createdAt: string
  },
  remainingPoints: number
}
```

**Error Codes**:
- `insufficient-points`: 포인트 부족
- `betting-closed`: 베팅 시간 종료
- `game-not-found`: 게임을 찾을 수 없음
- `already-bet`: 이미 베팅함

#### `getUserBets`
사용자의 베팅 내역

**Endpoint**: `functions.httpsCallable('getUserBets')`

**Request**:
```typescript
{
  limit?: number,    // 기본값: 20
  status?: 'pending' | 'won' | 'lost'
}
```

**Response**:
```typescript
{
  bets: Array<{
    id: string,
    gameId: string,
    prediction: string,
    amount: number,
    payout: number | null,
    status: 'pending' | 'won' | 'lost',
    createdAt: string,
    game?: {
      result: GameResult
    }
  }>
}
```

---

### 1.6 전적 및 통계

#### `getGameHistory`
사용자 게임 기록

**Endpoint**: `functions.httpsCallable('getGameHistory')`

**Request**:
```typescript
{
  userId?: string,   // 없으면 본인
  limit?: number,    // 기본값: 50
  gameType?: 'pvp' | 'pvc'
}
```

**Response**:
```typescript
{
  games: Array<{
    id: string,
    gameType: 'pvp' | 'pvc',
    result: {
      winner: string,
      player1Choice: Choice,
      player2Choice: Choice
    },
    opponent?: {
      id: string,
      displayName: string
    },
    pointsAwarded: number,
    createdAt: string,
    completedAt: string
  }>
}
```

#### `getLeaderboard`
리더보드

**Endpoint**: `functions.httpsCallable('getLeaderboard')`

**Request**:
```typescript
{
  limit?: number,  // 기본값: 100
  orderBy?: 'wins' | 'points'  // 기본값: 'points'
}
```

**Response**:
```typescript
{
  leaderboard: Array<{
    rank: number,
    userId: string,
    displayName: string,
    points: number,
    stats: {
      totalGames: number,
      wins: number,
      losses: number,
      draws: number,
      winRate: number
    }
  }>
}
```

---

## 2. Express REST API (대안)

### Base URL
```
https://api.rps-game.com/v1
```

### 인증
모든 요청은 JWT 토큰 필요 (로그인/회원가입 제외)

**Header**:
```
Authorization: Bearer <JWT_TOKEN>
```

### 2.1 인증

#### `POST /auth/signup`
회원가입

**Request**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "displayName": "Player1"
}
```

**Response**: `201 Created`
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "displayName": "Player1"
  },
  "token": "jwt_token"
}
```

#### `POST /auth/login`
로그인

**Request**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response**: `200 OK`
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "displayName": "Player1",
    "points": 1000
  },
  "token": "jwt_token"
}
```

### 2.2 PvC 게임

#### `POST /games/pvc`
게임 시작

**Request**:
```json
{
  "maxRounds": 1
}
```

**Response**: `201 Created`
```json
{
  "gameId": "uuid",
  "status": "in_progress"
}
```

#### `POST /games/pvc/:gameId/play`
라운드 플레이

**Request**:
```json
{
  "choice": "rock"
}
```

**Response**: `200 OK`
```json
{
  "result": {
    "winner": "player1",
    "player1Choice": "rock",
    "player2Choice": "scissors",
    "pointsAwarded": 10
  },
  "gameStatus": "completed"
}
```

### 2.3 PvP 게임

#### `POST /matchmaking`
매칭 시작

**Response**: `200 OK`
```json
{
  "status": "waiting",
  "matchmakingId": "uuid"
}
```

#### `GET /matchmaking/:id`
매칭 상태 확인

**Response**: `200 OK`
```json
{
  "status": "matched",
  "gameId": "uuid"
}
```

#### `DELETE /matchmaking/:id`
매칭 취소

**Response**: `204 No Content`

### 2.4 WebSocket 이벤트

#### Connection
```typescript
const socket = io('wss://api.rps-game.com', {
  auth: {
    token: 'jwt_token'
  }
});
```

#### Events

**Client → Server**

```typescript
// 매칭 참가
socket.emit('matchmaking:join', { maxRounds: 3 });

// 게임 룸 입장
socket.emit('game:join', { gameId: 'uuid' });

// 선택 제출
socket.emit('game:choice', {
  gameId: 'uuid',
  choice: 'rock'
});
```

**Server → Client**

```typescript
// 매칭 완료
socket.on('matchmaking:matched', (data) => {
  // { gameId: 'uuid', opponent: {...} }
});

// 상대 선택 완료
socket.on('game:opponent_ready', () => {
  // 상대가 선택 완료
});

// 라운드 결과
socket.on('game:round_result', (data) => {
  // { winner, choices, scores }
});

// 게임 종료
socket.on('game:completed', (data) => {
  // { winner, finalScores, pointsAwarded }
});

// CVC 게임 시작
socket.on('cvc:game_started', (data) => {
  // { gameId, bettingEndsAt }
});

// CVC 게임 결과
socket.on('cvc:game_result', (data) => {
  // { gameId, winner, choices }
});
```

---

## 3. 에러 응답 형식

### Firebase Functions
```typescript
{
  code: string,
  message: string,
  details?: any
}
```

### Express
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {}
  }
}
```

### 공통 에러 코드

| Code | HTTP Status | 설명 |
|------|-------------|------|
| `unauthenticated` | 401 | 인증 필요 |
| `permission-denied` | 403 | 권한 없음 |
| `not-found` | 404 | 리소스 없음 |
| `already-exists` | 409 | 중복 |
| `invalid-argument` | 400 | 잘못된 요청 |
| `resource-exhausted` | 429 | Rate limit |
| `internal` | 500 | 서버 오류 |

### 게임 특정 에러

| Code | 설명 |
|------|------|
| `game-not-found` | 게임을 찾을 수 없음 |
| `game-already-completed` | 이미 종료된 게임 |
| `invalid-choice` | 잘못된 선택 |
| `insufficient-points` | 포인트 부족 |
| `betting-closed` | 베팅 시간 종료 |
| `already-bet` | 이미 베팅함 |
| `matchmaking-error` | 매칭 오류 |

---

## 4. Rate Limiting

### Firebase
Cloud Functions 자동 제한:
- 초당 1000 요청
- 동시 실행 1000개

### Express
커스텀 Rate Limit:
- 일반 API: 100 req/분
- 게임 플레이: 10 req/분
- 베팅: 5 req/분

---

## 5. 데이터 검증

모든 입력값은 다음과 같이 검증:

```typescript
// Choice 검증
const VALID_CHOICES = ['rock', 'paper', 'scissors'];

// 포인트 검증
const MIN_BET = 10;
const MAX_BET = 10000;

// 이메일 검증
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 비밀번호 검증
const MIN_PASSWORD_LENGTH = 6;
```

---

## 6. API 사용 예제

### 6.1 Firebase SDK 사용

```typescript
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();

// PVC 게임 시작
const createPvCGame = httpsCallable(functions, 'createPvCGame');
const result = await createPvCGame({ maxRounds: 1 });

// 선택 제출
const playPvCRound = httpsCallable(functions, 'playPvCRound');
const playResult = await playPvCRound({
  gameId: result.data.gameId,
  choice: 'rock'
});
```

### 6.2 Express API 사용 (axios)

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.rps-game.com/v1',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// PVC 게임 시작
const { data } = await api.post('/games/pvc', {
  maxRounds: 1
});

// 선택 제출
const result = await api.post(`/games/pvc/${data.gameId}/play`, {
  choice: 'rock'
});
```

---

## 7. 다음 단계

API 설계를 검토하신 후:
1. 기술 스택 확정 (Firebase vs Express)
2. 프로젝트 초기화
3. API 구현 시작

어떤 방식으로 진행하시겠습니까?
