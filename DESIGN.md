# 가위바위보 네트워크 게임 - 시스템 설계서

## 1. 프로젝트 개요

### 1.1 목적
실시간 네트워크 기반 가위바위보 게임 플랫폼

### 1.2 주요 기능
- **사용자 vs 컴퓨터**: 즉시 AI와 대결
- **사용자 vs 사용자**: 실시간 매칭 및 대결
- **컴퓨터 vs 컴퓨터**: 경기 관람 및 승부 예측 (포인트 베팅)

### 1.3 사용자 시나리오
1. 회원가입/로그인 (이메일 + 패스워드)
2. 게임 모드 선택
3. 게임 플레이
4. 전적 및 포인트 관리

---

## 2. 기술 스택 제안

### 2.1 추천 아키텍처 (Firebase 기반)

#### 프론트엔드
- **Framework**: React + TypeScript
- **상태관리**: Zustand 또는 React Context
- **UI Library**: TailwindCSS
- **실시간 통신**: Firebase Realtime Database / Firestore
- **호스팅**: Firebase Hosting

#### 백엔드
- **Authentication**: Firebase Authentication
- **Database**: Firestore (NoSQL)
- **Functions**: Firebase Cloud Functions (Node.js/TypeScript)
- **실시간**: Firestore realtime listeners

#### 대안 아키텍처 (전통적인 방식)

**프론트엔드**: 동일

**백엔드**:
- **Server**: Node.js + Express + TypeScript
- **실시간**: Socket.io
- **Database**: MongoDB (Atlas) 또는 MariaDB
- **호스팅**: 별도 서버 필요 (AWS, GCP, 등)

### 2.2 추천: Firebase 아키텍처
**이유**:
- Firebase는 호스팅과 DB가 이미 준비되어 있음
- 실시간 기능이 내장되어 구현이 간단
- 인증 시스템이 내장되어 있음
- 서버리스로 초기 비용이 낮음
- 확장성이 자동으로 처리됨

---

## 3. 시스템 아키텍처

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (React)                   │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐ │
│  │  Login   │  │   Game    │  │  Betting/Watch    │ │
│  │  Screen  │  │  Modes    │  │     Screen        │ │
│  └──────────┘  └──────────┘  └───────────────────┘ │
└─────────────────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────┐
│              Firebase Services                       │
│  ┌──────────────┐  ┌─────────────┐  ┌────────────┐ │
│  │ Authentication│  │  Firestore  │  │  Functions │ │
│  │ (Email/Pass) │  │  (Realtime) │  │  (Logic)   │ │
│  └──────────────┘  └─────────────┘  └────────────┘ │
└─────────────────────────────────────────────────────┘
```

---

## 4. 데이터베이스 스키마 (Firestore)

### 4.1 Users Collection
```typescript
users/{userId}
{
  email: string;
  displayName: string;
  createdAt: timestamp;
  points: number;           // 베팅용 포인트
  stats: {
    totalGames: number;
    wins: number;
    losses: number;
    draws: number;
  }
}
```

### 4.2 Games Collection
```typescript
games/{gameId}
{
  gameType: 'pvp' | 'pvc' | 'cvc';
  status: 'waiting' | 'in_progress' | 'completed';
  players: {
    player1: {
      userId: string;
      choice: 'rock' | 'paper' | 'scissors' | null;
      isBot: boolean;
    }
    player2: {
      userId: string;
      choice: 'rock' | 'paper' | 'scissors' | null;
      isBot: boolean;
    }
  };
  result: {
    winner: string | 'draw' | null;
    player1Choice: string;
    player2Choice: string;
  };
  createdAt: timestamp;
  completedAt: timestamp | null;
  round: number;            // 현재 라운드 (3판 2선승제 등)
  maxRounds: number;
}
```

### 4.3 Bets Collection (컴퓨터 vs 컴퓨터)
```typescript
bets/{betId}
{
  gameId: string;
  userId: string;
  prediction: 'player1' | 'player2' | 'draw';
  amount: number;           // 베팅 포인트
  payout: number | null;    // 결과 배당금
  status: 'pending' | 'won' | 'lost';
  createdAt: timestamp;
}
```

### 4.4 Matchmaking Queue
```typescript
matchmaking/{userId}
{
  userId: string;
  createdAt: timestamp;
  gameType: 'pvp';
}
```

---

## 5. 게임 로직

### 5.1 가위바위보 승부 판정
```typescript
type Choice = 'rock' | 'paper' | 'scissors';

function determineWinner(p1: Choice, p2: Choice): 'player1' | 'player2' | 'draw' {
  if (p1 === p2) return 'draw';

  const winConditions = {
    rock: 'scissors',
    scissors: 'paper',
    paper: 'rock'
  };

  return winConditions[p1] === p2 ? 'player1' : 'player2';
}
```

### 5.2 게임 모드별 로직

#### A. 사용자 vs 컴퓨터
1. 사용자가 게임 시작
2. 컴퓨터가 랜덤 선택 (서버에서 생성)
3. 즉시 결과 표시
4. 전적 업데이트

#### B. 사용자 vs 사용자
1. 매칭 큐에 등록
2. 다른 사용자 매칭 (FIFO)
3. 게임 룸 생성
4. 양쪽 모두 선택 시 결과 공개
5. 3판 2선승제 진행
6. 승자 결정 후 전적 업데이트

#### C. 컴퓨터 vs 컴퓨터
1. 30초마다 자동 게임 생성
2. 베팅 기간 (20초)
3. 게임 진행 (애니메이션)
4. 결과 공개 및 배당금 지급

### 5.3 포인트 시스템
- 회원가입 시: 1000 포인트 지급
- PVP 승리: +100 포인트
- PVC 승리: +10 포인트
- CVC 베팅 성공: 2배 배당
- CVC 무승부 예측 성공: 3배 배당

---

## 6. API 설계 (Cloud Functions)

### 6.1 인증
- Firebase Authentication 사용 (자동 제공)
- `POST /signup` - 이메일/패스워드 회원가입
- `POST /login` - 로그인

### 6.2 게임 관련
```typescript
// PVC 게임 시작
POST /api/games/pvc/start
Request: { userId: string }
Response: { gameId: string }

// PVC 게임 플레이
POST /api/games/pvc/:gameId/play
Request: { choice: Choice }
Response: { result: GameResult }

// PVP 매칭 시작
POST /api/games/pvp/matchmaking
Request: { userId: string }
Response: { status: 'waiting' | 'matched', gameId?: string }

// PVP 선택 제출
POST /api/games/pvp/:gameId/choice
Request: { choice: Choice }
Response: { status: 'waiting' | 'completed', result?: GameResult }

// CVC 게임 관람
GET /api/games/cvc/active
Response: { games: Game[] }

// CVC 베팅
POST /api/bets
Request: { gameId: string, prediction: string, amount: number }
Response: { betId: string }
```

### 6.3 사용자 정보
```typescript
GET /api/users/:userId
Response: { user: User }

GET /api/users/:userId/stats
Response: { stats: UserStats }

GET /api/users/:userId/history
Response: { games: Game[] }
```

---

## 7. 실시간 기능 (Firestore Listeners)

### 7.1 PVP 매칭
```typescript
// 프론트엔드에서 리스닝
firestore.collection('matchmaking')
  .where('userId', '==', currentUserId)
  .onSnapshot(handleMatchFound);
```

### 7.2 게임 상태 업데이트
```typescript
firestore.collection('games')
  .doc(gameId)
  .onSnapshot(handleGameUpdate);
```

### 7.3 CVC 게임 진행
```typescript
firestore.collection('games')
  .where('gameType', '==', 'cvc')
  .where('status', '==', 'in_progress')
  .onSnapshot(handleLiveGames);
```

---

## 8. 보안 고려사항

### 8.1 Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 사용자는 자신의 데이터만 수정 가능
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }

    // 게임은 읽기만 가능 (쓰기는 Cloud Functions에서만)
    match /games/{gameId} {
      allow read: if request.auth != null;
      allow write: if false; // Functions only
    }

    // 베팅은 본인 것만 읽기/쓰기 가능
    match /bets/{betId} {
      allow read: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid == request.resource.data.userId;
      allow update, delete: if false;
    }
  }
}
```

### 8.2 게임 무결성
- 사용자의 선택은 암호화하여 저장 (상대가 볼 수 없도록)
- 모든 게임 로직은 서버(Cloud Functions)에서 실행
- 클라이언트는 선택만 전송, 결과는 서버에서 계산

---

## 9. UI/UX 화면 구성

### 9.1 주요 페이지
1. **로그인/회원가입 페이지**
   - 이메일/패스워드 입력
   - Firebase Auth 연동

2. **메인 대시보드**
   - 포인트 표시
   - 전적 표시
   - 게임 모드 선택 버튼 3개

3. **PVC 게임 화면**
   - 가위/바위/보 선택 버튼
   - 결과 애니메이션
   - 다시하기 버튼

4. **PVP 게임 화면**
   - 매칭 대기 화면
   - 상대 정보 표시
   - 라운드 진행 표시
   - 타이머

5. **CVC 관람/베팅 화면**
   - 진행 중인 게임 목록
   - 베팅 UI
   - 실시간 게임 진행 애니메이션
   - 베팅 내역

6. **마이페이지**
   - 전적 상세
   - 게임 히스토리
   - 포인트 내역

---

## 10. 개발 단계 제안

### Phase 1: 기본 인프라 (1-2일)
- Firebase 프로젝트 설정
- React 프로젝트 초기화
- 인증 시스템 구현
- 기본 UI 레이아웃

### Phase 2: PVC 게임 (1-2일)
- 게임 로직 구현
- UI 구현
- Firestore 연동
- 전적 시스템

### Phase 3: PVP 게임 (2-3일)
- 매칭 시스템 구현
- 실시간 게임 로직
- UI 구현
- 라운드 시스템

### Phase 4: CVC 베팅 (2-3일)
- 자동 게임 생성 시스템
- 베팅 로직
- 포인트 시스템
- 실시간 관람 UI

### Phase 5: 최적화 및 배포 (1-2일)
- 성능 최적화
- UI/UX 개선
- Firebase Hosting 배포
- 테스트

---

## 11. 예상 비용 (Firebase 무료 플랜)

Firebase Spark (무료) 플랜으로 시작 가능:
- Firestore: 1GB 저장, 50K reads/day, 20K writes/day
- Hosting: 10GB 전송/월
- Authentication: 무제한

소규모 사용자(~100명)는 무료로 충분

---

## 12. 다음 단계

설계를 검토하신 후:
1. Firebase 프로젝트 생성 (또는 기존 프로젝트 정보 제공)
2. 기술 스택 확정 (Firebase 추천 vs 전통적 방식)
3. 구현 시작

Firebase 사용을 추천드리지만, MariaDB나 MongoDB를 선호하신다면
백엔드 서버(Express + Socket.io) 방식으로도 진행 가능합니다.

**어떤 방식으로 진행하시겠습니까?**
