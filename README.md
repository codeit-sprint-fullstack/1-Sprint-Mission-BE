# 📑 스프린트 미션7 BE | 

스프린트 미션 7은 PostgreSQL을 사용하여 프론트엔드와 주고받을 자유게시판과 댓글 관련 API를 구현하였습니다.

### 👨‍👩‍👧‍👦 요구사항 

#### 기본 요구사항

#### 중고마켓
- [x] mongoDB에서 PostgreSQL을 사용하도록 코드를 마이그레이션 해주세요.
-----------------

#### 공통

- [x] PostgreSQL를 이용해 주세요.
- [x] 데이터 모델 간의 관계를 고려하여 onDelete를 설정해 주세요.
- [x] 데이터베이스 시딩 코드를 작성해 주세요.
- [x] 각 API에 적절한 에러 처리를 해 주세요.
- [x] 각 API 응답에 적절한 상태 코드를 리턴하도록 해 주세요.

-----------

#### 자유게시판

- [x] Article 스키마를 작성해 주세요.
  - [x] id, title, content, createdAt, updatedAt 필드를 가집니다.
- [x] 게시글 등록 API를 만들어 주세요.
  - [x] title, content를 입력해 게시글을 등록합니다.
- [x] 게시글 조회 API를 만들어 주세요.
  - [x] id, title, content, createdAt를 조회합니다.
- [x] 게시글 수정 API를 만들어 주세요.
- [x] 게시글 삭제 API를 만들어 주세요.
- [x] 게시글 목록 조회 API를 만들어 주세요.
  - [x] id, title, content, createdAt를 조회합니다.
- [x] offset 방식의 페이지네이션 기능을 포함해 주세요.
- [x] 최신순(recent)으로 정렬할 수 있습니다.
- [x] title, content에 포함된 단어로 검색할 수 있습니다.

#### 댓글

- [x] 댓글 등록 API를 만들어 주세요.
  - [x] content를 입력하여 댓글을 등록합니다.
- [x] 중고마켓, 자유게시판 댓글 등록 API를 따로 만들어 주세요.
- [x] 댓글 수정 API를 만들어 주세요.
  - [x] PATCH 메서드를 사용해 주세요.
- [x] 댓글 삭제 API를 만들어 주세요.
- [x] 댓글 목록 조회 API를 만들어 주세요.
  - [x] id, content, createdAt 를 조회합니다.
- [x] cursor 방식의 페이지네이션 기능을 포함해 주세요.
- [x] 중고마켓, 자유게시판 댓글 목록 조회 API를 따로 만들어 주세요.

### ✅ 환경 변수 설정

- `DATABASE_URL`: PostgreSQL 데이터베이스 연결 URL

- .env 파일에 추가(예시) : DATABASE_URL="postgresql://postgres:비밀번호@localhost:5432/데이터베이스명?schema=public"

### ⏰ 개발 기간

- 2024,08,11 ~ 

### ⚙ 기술 스택
- Back

    * JavaScript
    * Node.js
    * Express.js
    * MongoDB
    * Mongoose
    * dotenv
    * CORS

### 🖐🏻 오류 처리

- 400 Bad Request: 잘못된 요청
- 404 Not Found: 요청한 리소스를 찾을 수 없음
- 500 Internal Server Error: 서버 오류


