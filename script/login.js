import { eyeIconShow, eyeIconUse, validateEmail, validatePassword, closeDlg } from "./sign-common.js";

const eyeCloseIcon = document.querySelector("#eye-close-icon");
const eyeShowIcon = document.querySelector('#eye-show-icon');

const emailInput = document.querySelector('#email-input');
const passwordInput = document.querySelector('#password-input');
const useBtn = document.querySelector('#button');

const errorMsg = document.querySelector('#error-message');

const dlgBtn = document.querySelector('#dialog-button');

const USER_DATA = [
  { email: 'codeit1@codeit.com', password: "codeit101!" },
  { email: 'codeit2@codeit.com', password: "codeit202!" },
  { email: 'codeit3@codeit.com', password: "codeit303!" },
  { email: 'codeit4@codeit.com', password: "codeit404!" },
  { email: 'codeit5@codeit.com', password: "codeit505!" },
  { email: 'codeit6@codeit.com', password: "codeit606!" },
];

// 조건 불일치, 마우스 커서는 일반
useBtn.style.cursor = 'default';
// 초기화면에서 버튼을 눌렀을 때, 실행되는 것을 막기 위해 함수호출
canUseLoginBtn();

// 조건 만족시 버튼 활성화(로그인)
export function canUseLoginBtn() {
  if (emailInput.value.match(/^[A-Za-z\._\-0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/) && passwordInput.value.length > 7){
    useBtn.disabled = false;
    useBtn.style.backgroundColor = 'var(--blue)';
    useBtn.style.cursor = 'pointer';
  } else {
    useBtn.disabled = true;
    useBtn.style.backgroundColor = '';
    useBtn.style.cursor = 'default';
  }
}

// USER_DATA와 입력값 비교 후 로그인 성공 / 실패 
function loginSuccess() {
  const emailValue = emailInput.value;
  const passwordValue =passwordInput.value;

  const user = USER_DATA.find((el) => emailValue === el.email && passwordValue === el.password);

  if (user) {
    document.location.href = 'items.html';
  } else {
    loginErrorDlg.style.display = 'flex';
    errorMsg.innerHTML = '비밀번호가 일치하지 않습니다.';
    loginErrorDlg.showModal();
  }
}

passwordInput.addEventListener('input', eyeIconShow);
eyeCloseIcon.addEventListener('click', eyeIconUse);
eyeShowIcon.addEventListener('click', eyeIconUse);

emailInput.addEventListener('focusout', validateEmail);
passwordInput.addEventListener('focusout', validatePassword);

emailInput.addEventListener('input', canUseLoginBtn);
passwordInput.addEventListener('input', canUseLoginBtn);

useBtn.addEventListener('click', loginSuccess);

dlgBtn.addEventListener('click', closeDlg);