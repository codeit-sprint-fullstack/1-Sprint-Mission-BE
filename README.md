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

GET /products/:mongoProductId/comments

GET /products/:mongoProductId/comments/:id

POST /products/:mongoProductId/comments

PATCH /products/:mongoProductId/comments/:id

DELETE /products/:mongoProductId/comments/:id

**자유게시판**

GET /articles

GET /articles/:id

POST /articles

PATCH /articles/:id

DELETE /articles/:id

**자유게시판 댓글**

GET /articleComments

GET /articleComments/:id

POST /articleComments

PATCH /articleComments/:id

DELETE /articleComments/:id
