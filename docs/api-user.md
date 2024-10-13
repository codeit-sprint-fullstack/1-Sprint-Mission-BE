## PATCH /users/me

- description : 사용자 프로필 이미지 / 닉네임 변경 api(단일 속성 변경 가능)
- path : /users/me
- type : PATCH
- header
  - Authorization : Bearer {accessToken}
- body
  - nickname : 사용자 닉네임
  - image : 사용자 프로필 이미지 path(web)

### req example

- header
  Authorization : Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImM5YTllNzFjLWM1ODYtNGEwYS1hNTgzLTBiMTIxOGM0YzQwNiIsImlhdCI6MTcyODI3NDg2MCwiZXhwIjoxNzI4Mjc1NDYwfQ.lP544ozyKHmMrRW4k9LeNw7aMaGVwMgRl1-JJqGMxVs
- body : {nickname : "뉴별명"}

### res example

- data : {
  "id": "c9a9e71c-c586-4a0a-a583-0b1218c4c406",
  "email": "codeit01@codeit.com",
  "name": "이진우",
  "nickname": "뉴별명",
  "image": null,
  "createdAt": "2024-10-07T01:34:00.205Z"
  }
