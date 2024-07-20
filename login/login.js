import { USER_DATA } from '../script/userData.js';
import { password, passIcon, showHide } from '../script/showHide.js';
import { emailErrorMessageOne, emailErrorMessageTwo, input, userEmail } from '../script/emailValidation.js';
import { pattern } from '../script/regex.js'
import focusIn from '../script/focus.js';

// 비밀번호 숨기기/표시하기
passIcon.addEventListener('click', () => showHide(password,passIcon));

// 이메일 유효성 검사
userEmail.addEventListener('focusout', () => {
  if (userEmail.value === '') {
    emailErrorMessageOne.classList.remove('hide');
    emailErrorMessageTwo.classList.add('hide');
    input.classList.add('invalid-value');
    input.classList.remove('valid-value');
  } else if (!pattern.test(userEmail.value)) {      
    emailErrorMessageOne.classList.add('hide');
    emailErrorMessageTwo.classList.remove('hide');
    input.classList.add('invalid-value');
    input.classList.remove('valid-value');
  }
});
userEmail.addEventListener('keyup', () => {
  if (pattern.test(userEmail.value)) {
      emailErrorMessageOne.classList.add('hide');
      emailErrorMessageTwo.classList.add('hide');
      userEmail.classList.remove('invalid-value');
      userEmail.classList.add('valid-value');
    }
});

// 비밀번호 유효성 검사
const passwordErrorMessageOne = document.querySelector('.password-error-message1');
const passwordErrorMessageTwo = document.querySelector('.password-error-message2');

password.addEventListener('focusout', () => {
  if (password.value === '') {
    passwordErrorMessageOne.classList.remove('hide');
    passwordErrorMessageTwo.classList.add('hide');
    password.classList.add('invalid-value');
    password.classList.remove('valid-value');
  } else if (password.value.length < 8) {
    passwordErrorMessageOne.classList.add('hide');
    passwordErrorMessageTwo.classList.remove('hide');
    password.classList.add('invalid-value');
    password.classList.remove('valid-value');
    }
});

password.addEventListener('keyup', () => {
  if (password.value.length >= 8) {
      passwordErrorMessageOne.classList.add('hide');
      passwordErrorMessageTwo.classList.add('hide');
      password.classList.remove('invalid-value');
      password.classList.add('valid-value');
    }
});

// 버튼 활성화
const loginBtn = document.querySelector('.login_btn');

function btnActivate() {
  switch((pattern.test(userEmail.value)) && password.value.length >= 8) {
    case false : 
      loginBtn.disabled = true; 
      loginBtn.classList.remove('loginBtn_activate')
      break;
    
    case true :
      loginBtn.disabled = false;
      loginBtn.classList.add('loginBtn_activate')   
      break;
  }
}

userEmail.addEventListener('keyup', btnActivate);
password.addEventListener('keyup', btnActivate);

// 유저 데이터 베이스, 모달
const modalCloseButton = document.getElementById('modalCloseButton');
const modal = document.getElementById('modalContainer');


loginBtn.addEventListener('click', () => {
  const user = USER_DATA.find(userData => userData.email === userEmail.value.trim())
  if (!user) {
    modal.classList.remove('hidden') 
  } else if (user.password === password.value) {
    window.location.href = '/items'
  } else {
    modal.classList.remove('hidden') 
  }
});

modalCloseButton.addEventListener('click', () => {
  modal.classList.add('hidden')
});

// 인풋 포커스
userEmail.addEventListener('focusin', () => {focusIn(input)});
password.addEventListener('focusin', () => {focusIn(password)});
