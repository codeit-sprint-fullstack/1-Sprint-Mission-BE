//fetch 이용
import {
  getArticleList,
  getArticle,
  createArticle,
  patchArticle,
  deleteArticle
} from './ArticleService.js';

// axios 이용
import {
  getProductList,
  getProduct,
  createProduct,
  patchProduct,
  deleteProduct,
} from './ProductService.js';

// list 표시
// - // - // Article
const aRe = document.querySelector('.aList');
const aNext = document.getElementById("aNext");
const aPrev = document.querySelector('#aPre');
// - // - // Product
const pRe = document.querySelector('.pList');
const pNext = document.getElementById("pNext");
const pPrev = document.querySelector('#pPre');

function putList(list,listResult) {
  for (let i of list) {
    const span = document.createElement('span');
    span.setAttribute('id', `span${i.id}`);

    const checkBox = document.createElement('input');
    checkBox.setAttribute('type', 'checkbox');
    checkBox.setAttribute('id', `checkBox${i.id}`);
    span.append(checkBox);
    if(listResult == aRe){
      checkBox.setAttribute('class', 'checkboxA');
      span.innerHTML += i.title + ' : ' + i.content + ',' + i.image + ' -> ' + i.likeCount + '<br>';
    } else {
      checkBox.setAttribute('class', 'checkboxP');
      span.innerHTML += i.name + ' : ' + i.description + ', ' + i.price + '원 #' + i.tags + '<br>';
    }
    listResult.appendChild(span)
  }
}

// - // - // A
// const aDataFirst = await getArticleList(1, 10, '');
// const aEntireList = await getArticle();
const articleList = getArticleList(1, 10, '');
const article = getArticle();
// - // - // P
// const pDataFirst = await getProductList(1, 10, '');
// const pEntireList = await getProduct();
const productList = getProductList(1, 10, '');
const product = getProduct();
const [aDataFirst, aEntireList, pDataFirst, pEntireList] = await Promise.all([articleList, article,productList,product])

// - // - // A
putList(aDataFirst,aRe);
aPrev.disabled = true;

if (aEntireList.length < 10) {
  aNext.disabled = true;
}
// - // - // P
putList(pDataFirst,pRe);
pPrev.disabled = true;

if (pEntireList.length < 10) {
  pNext.disabled = true;
}

// - // 버튼에 따라 list 목록 변경
// - // - // A
var aPageNum = 1;
// - // - // P
var pPageNum = 1;

async function show(entireList,prev, next, pageNum) {
  if (pageNum <= 1) {
    pageNum = 1;
    prev.disabled = true;
  } else if (pageNum >= (entireList.length / 10)) {
    pageNum = Math.floor(entireList.length / 10) + 1;
    if (pageNum >= (entireList.length / 10)) {
      if ((entireList.length % 10) == 0) {
        pageNum = Math.floor(entireList.length / 10)
      }
    }
    next.disabled = true;
  }

  if(entireList == aEntireList) {
    var data1 = await getArticleList(pageNum, 10, '');
    putList(data1,aRe)
  } else {
    var data1 = await getProductList(pageNum, 10, '');
    putList(data1,pRe)
  }
};

// - // - // A
aNext.addEventListener('click', () => {
  aPageNum += 1;
  aRe.innerHTML = '';
  show(aEntireList,aPrev,aNext, aPageNum);
  aPrev.disabled = false;
})

aPrev.addEventListener('click', () => {
  aPageNum -= 1;
  aRe.innerHTML = '';
  show(aEntireList,aPrev,aNext, aPageNum);
  aNext.disabled = false;
})
// - // - // P
pNext.addEventListener('click', () => {
  pPageNum += 1;
  pRe.innerHTML = '';
  show(pEntireList,pPrev,pNext, pPageNum);
  pPrev.disabled = false;
})

pPrev.addEventListener('click', () => {
  pPageNum -= 1;
  pRe.innerHTML = '';
  show(pEntireList,pPrev,pNext, pPageNum);
  pNext.disabled = false;
})

// - //검색 시 해당 아이템 출력
// - // - // A
const aSearchInput = document.querySelector('#aSearch');
const aSearchhBtn = document.querySelector('#aSearchBtn');
// - // - // P
const pSearchhInput = document.querySelector('#pSearch');
const pSearchhBtn = document.querySelector('#pSearchBtn');

async function search(searchInput,listResult) {
  listResult.innerHTML = '';
  var searchVal = searchInput.value;

  if(searchInput == aSearchInput){
    var dataSearch = await getArticleList(1, 10, searchVal);
  } else {
    var dataSearch = await getProductList(1, 10, searchVal);
  }
  putList(dataSearch,listResult)
}

// - // - // A
aSearchhBtn.addEventListener('click', () => {
  search(aSearchInput,aRe);
})
// - // - // P
pSearchhBtn.addEventListener('click', () => {
  search(pSearchhInput,pRe);
})

// data 생성
// - // - // A
const titleInput = document.querySelector('#aTitle');
const contentInput = document.querySelector('#aContent');
const aImagesInput = document.querySelector('#aImage');
const putArticletBtn = document.querySelector('#aPutBtn');

putArticletBtn.addEventListener('click', async () => {
  var titleValue = titleInput.value;
  var contentValue = contentInput.value;
  var aImagesValue = aImagesInput.value;

  await createArticle({
    title: titleValue,
    content: contentValue,
    image: aImagesValue
  });
})

// - // - // P
const nameInput = document.querySelector('#pName');
const descriptionInput = document.querySelector('#pDescription');
const priceInput = document.querySelector('#pPrice');
const tagsInput = document.querySelector('#pTags');
const imagesInput = document.querySelector('#pImages');
const putProductBtn = document.querySelector('#pPutBtn');

putProductBtn.addEventListener('click', async () => {
  var nameValue = nameInput.value;
  var descriptionValue = descriptionInput.value;
  var priceValue = Number(priceInput.value);
  var tagsValue = tagsInput.value;
  var imagesValue = imagesInput.value;

  var requestBody = {
    name: nameValue,
    description: descriptionValue,
    price: priceValue,
    tags: [
      tagsValue
    ],
    images: [
      imagesValue
    ]
  }
  await createProduct(requestBody);
})

// Product 수정
// - // 체크박스 활성화, 비활성화, 체크된 값 확인
function check(Select) {
  var j = 0;
  for (let i = 0; i < Select.length; i++) {
    if (Select[i].checked) {
      j = i;
      for (let i = 0; i < Select.length; i++) {
        Select[i].disabled = true;
        Select[j].disabled = false;
      }
    }
  }

  if (!Select[j].checked) {
    for (let i = 0; i < Select.length; i++) {
      Select[i].disabled = false;
    }
  } else {
    return Select[j];
  }
}

// - // 체크된 값 input에 표시
// - // - // A
const aListPage = document.querySelector('.aList');
const aModifyBtn = document.querySelector('#aModifyBtn');
// - // - // P
const pListPage = document.querySelector('.pList');
const pModifyBtn = document.querySelector('#pModifyBtn');

function showSelected(selected) {
  if(selected == selectedArticle){
    titleInput.value = selected.title;
    contentInput.value = selected.content;
    aImagesInput.value = selected.image;
  } else if (selected == selectedProduct) {
      nameInput.value = selected.name;
      descriptionInput.value = selected.description;
      priceInput.value = selected.price;
      tagsInput.value = selected.tags;
      imagesInput.value = selected.images;
  } else if(selected == 'noA'){
      titleInput.value = '';
      contentInput.value = '';
      aImagesInput.value = '';
  } else {
      nameInput.value = '';
      descriptionInput.value = '';
      priceInput.value = '';
      tagsInput.value = '';
      imagesInput.value = '';
  }
}

// - // 체크된 값 정보 가져오기
var checkedId;
var selectedArticle;
var selectedProduct;

async function takeId(distinction){
  if(distinction == 0){
    var Select = document.querySelectorAll('.checkboxA');
  
    var checkedBox = check(Select);
    if (checkedBox) {
      aModifyBtn.disabled = false;
      aDeleteBtn.disabled = false;
      checkedId = Number(checkedBox.id.substr(8));
      selectedArticle = await getArticle(checkedId);
      showSelected(selectedArticle)
    } else {
      showSelected('noA')
      aModifyBtn.disabled = true;
      aDeleteBtn.disabled = true;
    }
  }else if(distinction == 1){
    var Select = document.querySelectorAll('.checkboxP');
  
    var checkedBox = check(Select);
    if (checkedBox) {
      pModifyBtn.disabled = false;
      pDeleteBtn.disabled = false;
      checkedId = Number(checkedBox.id.substr(8));
      selectedProduct = await getProduct(checkedId);
      showSelected(selectedProduct)
    } else {
      showSelected('noP')
      pModifyBtn.disabled = true;
      pDeleteBtn.disabled = true;
    }
  }
}

// - // 수정된 값 저장하기
// - // - // A
async function modifyArticle() {
  var titleValue = titleInput.value;
  var contentValue = contentInput.value;
  var aImagesValue = aImagesInput.value;

  var requestBody = {
    title: titleValue,
    content: contentValue,
    image: aImagesValue
  }
  await patchArticle(checkedId, requestBody);
}
// - // - // P
async function modifyProduct() {
  var nameValue = nameInput.value;
  var descriptionValue = descriptionInput.value;
  var priceValue = Number(priceInput.value);
  var tagsValue = tagsInput.value;
  var imagesValue = imagesInput.value;

  var requestBody = {
    name: nameValue,
    description: descriptionValue,
    price: priceValue,
    tags: [
      tagsValue
    ],
    images: [
      imagesValue
    ]
  }
  await patchProduct(checkedId, requestBody);
}

// - // 체크된 값이 있어야 버튼 활성화
// - // - // A
aListPage.addEventListener('change', () => {
  takeId(0);
  aModifyBtn.addEventListener('click', modifyArticle)
})
// - // - // P
pListPage.addEventListener('change', () => {
  takeId(1);
  pModifyBtn.addEventListener('click', modifyProduct)
})

// product 삭제
// - // - // A
const aDeleteBtn = document.querySelector('#aDeleteBtn')
// - // - // P
const pDeleteBtn = document.querySelector('#pDeleteBtn')

// - // 값 삭제하기
async function deleteyArticle() {
  await deleteArticle(checkedId);
}

async function deleteyProduct() {
  await deleteProduct(checkedId);
}
// - // 체크된 값이 있어야 버튼 활성화
// - // - // A
aListPage.addEventListener('change', () => {
  takeId();
  aDeleteBtn.addEventListener('click', deleteyArticle)
})
// - // - // P
pListPage.addEventListener('change', () => {
  takeId();
  pDeleteBtn.addEventListener('click', deleteyProduct)
})
