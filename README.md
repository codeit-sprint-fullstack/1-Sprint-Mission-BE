## start

node index.js

## seed.js

npx prisma db seed

## test

postman (http://localhost:5432)

**중고마켓 게시글**

GET /products

GET /products/:id

POST /products

PATCH /products/:id

DELETE /products/:id

**중고마켓 댓글**

GET /products/:mongoProductId

POST /products/:mongoProductId

PATCH /products/:mongoProductId/:id

DELETE /products/:mongoProductId/:id

**자유게시판**

GET /articles

GET /articles/:id

POST /articles

PATCH /articles/:id

DELETE /articles/:id

**자유게시판 댓글**

GET /articleComments/:articleId

POST /articleComments/:articleId

PATCH /articleComments/:id

DELETE /articleComments/:id
