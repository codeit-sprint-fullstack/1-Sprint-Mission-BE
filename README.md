# 📑 스프린트 미션6 BE | 

스프린트 미션 6(BE)은 MongoDB를 활용하여 API를 구현하고, 데이터베이스 작업을 처리하도록 구현하였습니다.

### 👨‍👩‍👧‍👦 요구사항 

### 백엔드 구현 요구사항

#### 중고마켓

- [x]  Product 스키마를 작성해 주세요.

  - [x] id, name, description, price, tags, createdAt, updatedAt필드를 가집니다.

  - [x] 필요한 필드가 있다면 자유롭게 추가해 주세요.

- [x]  상품 등록 API를 만들어 주세요.

  - [x] name, description, price, tags를 입력하여 상품을 등록합니다.
- [x]  상품 상세 조회 API를 만들어 주세요.

  - [x] id, name, description, price, tags, createdAt를 조회합니다.

- [x]  상품 수정 API를 만들어 주세요.

  - [x] PATCH 메서드를 사용해 주세요.
  
- [x]  상품 삭제 API를 만들어 주세요.

- [x]  상품 목록 조회 API를 만들어 주세요.

  - [x] id, name, price, createdAt를 조회합니다.
  
  - [x] offset 방식의 페이지네이션 기능을 포함해 주세요.
  - [x] 최신순(recent)으로 정렬할 수 있습니다.
  - [x] name, description에 포함된 단어로 검색할 수 있습니다.
- [x]  각 API에 적절한 에러 처리를 해 주세요.

- [x]  각 API 응답에 적절한 상태 코드를 리턴하도록 해 주세요.

- [x]  . env 파일에 환경 변수를 설정해 주세요.

- [x]  CORS를 설정해 주세요.

- [x]  render.com로 배포해 주세요.

- [x]  MongoDB를 활용해 주세요.

### 🔨 서버 설정

#### 1. 환경 설정
- 필요한 패키지 설치 : 
```
npm install
```
- React 개발 서버를 실행 :
```
npm start
```

#### 2. 환경 변수 설정
1. 프로젝트 루트 디렉토리에 .env 파일을 생성
2. .env 파일에 다음과 같이 설정

- `DATABASE_URL`: MongoDB 데이터베이스 연결 URI

-  DATABASE_URL=mongodb+srv://<username>:<password>@<cluster-address>/<database>?retryWrites=true&w=majority

### ⏰ 개발 기간

- 2024,08,05 ~ 

### ⚙ 기술 스택
- Back

    * JavaScript
    * Node.js
    * Express.js
    * MongoDB
    * Mongoose
    * dotenv
    * CORS

### 오류 처리

- 400 Bad Request: 잘못된 요청
- 404 Not Found: 요청한 리소스를 찾을 수 없음
- 500 Internal Server Error: 서버 오류

### 🎈 배포

- 배포 플랫폼: render.com
- 배포 URL: https://one-sprint-mission-be-7s66.onrender.com

