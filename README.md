## seed.js

npx prisma db seed

## start

node index.js

## test

postman (http://localhost:5432)

**중고마켓 게시글**

GET /products

GET /products/:id

POST /products

PATCH /products/:id

DELETE /products/:id

**중고마켓 댓글**

GET /productComments/:productId

POST /productComments/:productId

PATCH /productComments/:id

DELETE /productComments/:id

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
