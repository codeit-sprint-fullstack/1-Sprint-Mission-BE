# pandamarket ( 진행중: 2024.06.20 ~ )

## 배포: https://hellopandamarket.netlify.app/


# `Mission-01 ` - 프론트엔드 레파지토리

## 주요 변경 사항
- 첫 화면 구성

# `Mission-02` - 프론트엔드 레파지토리
## 주요 변경 사항
-  로그인, 회원가입 화면 구성


# `Mission03 ` - 프론트엔드 레파지토리

## 주요 변경 사항
- mission1+2 refactor (파일 구조 분리, 눈 모양 아이콘 invisbe, visible 나눠서 분리, login-signup css 공통 파일 분리)
-  랜딩페이지, 로그인 페이지, 회원가입 페이지 반응형 적용
- 랜딩 페이지, 로그인 페이지, 회원가입 페이지 오류 메세지
- 로그인페이지, 회원가입 alert 메세지
- 메타 태그
- login-signup js 공통 파일 분리


# `Mission-04 : API 요구사항 체크리스트`

## 공통

- [X] Github에 스프린트 미션 PR을 만들어 주세요.
## ‘[https://sprint-mission-api.vercel.app/articles’](https://sprint-mission-api.vercel.app/articles%E2%80%99) API를 이용하여 아래 함수들을 구현해 주세요.

- [X] getArticleList() : GET 메서드를 사용해 주세요.
- [X] page, pageSize, keyword 쿼리 파라미터를 이용해 주세요.
- [X] getArticle() : GET 메서드를 사용해 주세요.
- [X] createArticle() : POST 메서드를 사용해 주세요.
- [X] request body에 title, content, image 를 포함해 주세요.
- [X] patchArticle() : PATCH 메서드를 사용해 주세요.
- [X] deleteArticle() : DELETE 메서드를 사용해 주세요.
- [X] fetch를 이용해 주세요.
- [X] 응답의 상태 코드가 2XX가 아닐 경우, 에러메시지를 콘솔에 출력해 주세요.
- [X] .then() 메서드를 이용하여 비동기 처리를 해주세요.
- [X] .catch() 를 이용하여 오류 처리를 해주세요.

##  ‘[https://sprint-mission-api.vercel.app/products’](https://sprint-mission-api.vercel.app/products%E2%80%99) API를 이용하여 아래 함수들을 구현해 주세요.
- [X] getProductList() : GET 메서드를 사용해 주세요.
- [X] page, pageSize, keyword 쿼리 파라미터를 이용해 주세요.
- [X] getProduct() : GET 메서드를 사용해 주세요.
- [X] createProduct() : POST 메서드를 사용해 주세요.
- [X] request body에 name, description, price, tags, images 를 포함해 주세요.
- [X] patchProduct() : PATCH 메서드를 사용해 주세요.
- [X] deleteProduct() : DELETE 메서드를 사용해 주세요.
- [X] axios를 이용해 주세요.
- [X] async/await 을 이용하여 비동기 처리를 해주세요.
- [X] try/catch 를 이용하여 오류 처리를 해주세요.
- [X] 구현한 함수들을 아래와 같이 파일을 분리해 주세요.
- [X] export를 활용해 주세요.
- [X] ProductService.js 파일 Product API 관련 함수들을 작성해 주세요.
- [X] ArticleService.js 파일에 Article API 관련 함수들을 작성해 주세요.
- [X] 이외의 코드들은 모두 main.js 파일에 작성해 주세요.
- [X] import를 활용해 주세요.
- [X] 각 함수를 실행하는 코드를 작성하고, 제대로 동작하는지 확인해 주세요.

## 주요 변경사항
- `getArticleList()`
- `getArticle()`
- `createArticle()`
- `patchArticle()`
- `deleteArticle()`
- `getProductList()`
- `getProduct()`
- `createProduct()`
- `patchProduct()`
- `deleteProduct()`

## 스크린샷
### getArticleList()
![96AD15B3-ECA2-4156-9BC7-02FEEF750311](https://github.com/user-attachments/assets/b9601880-0e74-40c7-aeb4-2743350f4045)

### getArticle()
![65639833-811B-483D-AFE2-2AC78DE24B9A](https://github.com/user-attachments/assets/8b15f241-0b95-45a4-b972-85aa78c90727)

### createArticle()
![8FB942EB-B5E8-41CF-9B25-A5464FF3BEAC](https://github.com/user-attachments/assets/9a9e63de-51a9-4379-b348-e437e861fed3)

### patchArticle()
![36A6C53E-3D09-4055-8AAA-B451851D746B](https://github.com/user-attachments/assets/f4564b2d-d1a1-4536-a09a-f21a14b5888e)

### deleteArticle()
![855DF9A0-14EA-4C65-A50B-594F13DE1461_4_5005_c](https://github.com/user-attachments/assets/520c4f45-d68a-4b27-a18f-1b19f60b6897)

### getProductList()
![FE2D48A8-3E1A-48F8-862A-E7BF51FD885D](https://github.com/user-attachments/assets/af6208e8-cdc8-4ccb-bf4d-d69d4ffef705)

### getProduct()
![292F60AE-25F9-459F-8645-985D188213AE](https://github.com/user-attachments/assets/90780137-58b5-4776-bce5-7d7f986b6dae)

### createProduct()
![E9F239FB-61E8-4F9C-A717-E26DBA97CBB4](https://github.com/user-attachments/assets/ac8e3263-9c40-451c-bb4d-dcb46ef9bb2c)

### patchProduct()
![B1D380E4-6ACF-41D8-8F55-37431C228DF1](https://github.com/user-attachments/assets/bc955104-4f8f-4e8b-9f69-3218def25f2a)

### deleteProduct()
![818C38CD-FC92-4EB4-BEFA-00B2F607B713_4_5005_c](https://github.com/user-attachments/assets/b20b138f-8dc7-46eb-a66d-f7b66a327816)
