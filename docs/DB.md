## DB schema

## 사용자 관련 DB

### User (user)

#### id

- PK
- type : varchar
- 참고 : int는 아무리 생각해봐도 제한치가 너무 작아서 uuid를 사용

#### name

- description : 사용자 이름
- type : varchar
- require : true
- unique : false
- space : 문자열 마지막의 공백은 인정 안함
- max-length : 255
- 참고 : 다국어로 이름을 적을 때 length가 50~100자도 가능할 것으로 예상. 넉넉하게 255로 제한

#### nickname

- description : 사용자 별명. 프로필에 노출
- type : varchar
- require : true
- unique : true
- space : 문자열 마지막의 공백은 인정 안함
- max-length : 50
- 참고 : 다국어 고려. 50자도 너무 길어서 FE에서 nickname 관련 tag max-length 설정을 통해 디자인이 무너지지 않도록 해야함

#### password

- description : 사용자 비밀번호. bcrypt 해시 data 저장
- type : varchar
- require : true
- unique : false
- space : 문자열 마지막의 공백은 인정 안함
- max-length : 60
- 참고 : max-length는 네이버가 16. 구글은 100. 중간은 아니지만 8~24자 제한으로 하되 저장은 bcrypt 해시 data가 들어가서 60자로 제한

#### email

- description : 사용자 이메일
- type : varchar
- require : true
- unique : true
- space : 문자열 마지막의 공백은 인정 안함
- max-length : 255
- 참고 : 이메일의 국제 표준(Internet Email Format, RFC 5321)에 따르면, 전체 이메일 주소는 최대 254자까지 허용

#### iamge

- description : 사용자 프로필 이미지
- type : varchar
- require : false
- unique : false
- space : 문자열 마지막의 공백은 인정 안함
- max-length : 2048
- 참고 : URL의 길이는 보통 최대 2048자까지 허용

## 상품 관련 DB

### Product (product)

#### id

- PK
- type : varchar
- 참고 : int는 아무리 생각해봐도 제한치가 너무 작아서 uuid를 사용

#### userId (user_id)

- FK : User
- type : varchar

#### name

- description : 상품 이름
- type : varchar
- require : true
- unique : false
- space : 문자열 마지막의 공백은 인정 안함
- max-length : 50
- 참고 : UI 디자인 때문에 다국어로 쓴다고 해도 보여주는데 한계가 있음

#### description

- description : 상품 설명
- type : varchar
- require : true
- unique : false
- space : 문자열 마지막의 공백은 인정 안함
- max-length : 1024
- 참고 : 임시로 1024정도면 다국어도 처리 가능하다고 추정

#### price

- description : 상품 가격
- type : int
- require : true
- unique : false
- 참고 : middleware로 양수 검증 예정

#### price

- description : 상품 가격
- type : int
- require : true
- unique : false
- 참고 : middleware로 양수 검증 예정

#### favoriteCount (favorite_count)

- description : 좋아요 수
- type : int
- require : false
- unique : false
- default : 0
- 참고 : 생성시 default값으로 생성. FavoriteProduct 로 value 결정

#### images

#### tags

### ProductImg (product_img)

#### id

- PK
- type : varchar
- 참고 : int는 아무리 생각해봐도 제한치가 너무 작아서 uuid를 사용

#### productId (product_id)

- FK : Product
- type : varchar

#### image

- description : 상품 이미지
- type : varchar
- require : false
- unique : false
- space : 문자열 마지막의 공백은 인정 안함
- max-length : 2048
- 참고 : 임시로 상품당 최대 5개의 이미지 등록 가능. middleware로 최대 수 검증 예정. URL의 길이는 보통 최대 2048자까지 허용

### ProductTag (product_tag)

#### id

- PK
- type : varchar
- 참고 : int는 아무리 생각해봐도 제한치가 너무 작아서 uuid를 사용

#### productId (product_id)

- FK : Product
- type : varchar

#### tag

- description : 상품 태그
- type : varchar
- require : false
- unique : false
- space : 문자열 마지막의 공백은 인정 안함
- max-length : 50
- 참고 : 임시로 상품당 최대 5개의 이미지 등록 가능. middleware로 최대 수 검증 예정. 한 단어로 태그를 구성할 예정이라 length를 50으로 제한

### ProductComment

#### id

- PK
- type : varchar
- 참고 : int는 아무리 생각해봐도 제한치가 너무 작아서 uuid를 사용

#### productId (product_id)

- FK : Product
- type : varchar

#### content

- description : 상품 댓글
- type : varchar
- require : true
- unique : false
- space : 문자열 마지막의 공백은 인정 안함
- max-length : 500
- 참고 : 임시로 500 설정

### FavoriteProduct (favorite_product)

#### id

- PK
- type : varchar
- 참고 : int는 아무리 생각해봐도 제한치가 너무 작아서 uuid를 사용

#### userId (user_id)

- FK : User
- type : varchar

#### productId (product_id)

- FK : Product
- type : varchar

## 게시글 관련 DB

### Post (post)

#### id

- PK
- type : varchar
- 참고 : int는 아무리 생각해봐도 제한치가 너무 작아서 uuid를 사용

#### userId (user_id)

- FK : User
- type : varchar

#### title

- description : 게시글 제목
- type : varchar
- require : true
- unique : false
- space : 문자열 마지막의 공백은 인정 안함
- max-length : 50
- 참고 : UI 디자인 때문에 다국어로 쓴다고 해도 보여주는데 한계가 있음

#### content

- description : 게시글 내용
- type : varchar
- require : true
- unique : false
- space : 문자열 마지막의 공백은 인정 안함
- max-length : 1024
- 참고 : 임시로 1024정도면 다국어도 처리 가능하다고 추정

#### favoriteCount (favorite_count)

- description : 좋아요 수
- type : int
- require : false
- unique : false
- default : 0
- 참고 : 생성시 default값으로 생성. FavoritePost 로 value 결정

### postImg (post_img)

#### id

- PK
- type : varchar
- 참고 : int는 아무리 생각해봐도 제한치가 너무 작아서 uuid를 사용

#### postId (post_id)

- FK : Post
- type : varchar

#### image

- description : 게시글 이미지
- type : varchar
- require : false
- unique : false
- space : 문자열 마지막의 공백은 인정 안함
- max-length : 2048
- 참고 : 임시로 게시글당 최대 5개의 이미지 등록 가능. middleware로 최대 수 검증 예정. URL의 길이는 보통 최대 2048자까지 허용

### PostComment (post_comment)

#### id

- PK
- type : varchar
- 참고 : int는 아무리 생각해봐도 제한치가 너무 작아서 uuid를 사용

#### postId (post_id)

- FK : Post
- type : varchar

#### content

- description : 게시글 댓글
- type : varchar
- require : true
- unique : false
- space : 문자열 마지막의 공백은 인정 안함
- max-length : 500
- 참고 : 임시로 500 설정

### FavoritePost (favorite_post)

#### id

- PK
- type : varchar
- 참고 : int는 아무리 생각해봐도 제한치가 너무 작아서 uuid를 사용

#### userId (user_id)

- FK : User
- type : varchar

#### postId (post_id)

- FK : Post
- type : varchar
