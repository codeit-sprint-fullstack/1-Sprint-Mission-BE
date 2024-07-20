import { eyeIconShow, eyeIconUse, validateEmail, validatePassword, closeDlg } from "./sign-common.js";

const eyeCloseIcon = document.querySelector("#eye-close-icon");
const eyeShowIcon = document.querySelector('#eye-show-icon');
const rePwEyeCloseIcon = document.querySelector('#re-eye-close-icon');
const rePwEyeShowIcon = document.querySelector('#re-eye-show-icon');

const emailInput = document.querySelector('#email-input');
const passwordInput = document.querySelector('#password-input');
const passwordReInput = document.querySelector('#password-repeat-input');
const passwordReError = document.querySelector('#password-repeat-error');
const nicknameInput = document.querySelector('#nickname');
const nicknameError = document.querySelector('#nickname-error')
const useBtn = document.querySelector('#button');

const signUpErrorDlg = document.querySelector('#password-error-dlg');
const dlgBtn = document.querySelector('#dialog-button');
const errorMsg = document.querySelector('#error-message');

const USER_DATA = [
  { email: 'codeit1@codeit.com', password: "codeit101!" },
  { email: 'codeit2@codeit.com', password: "codeit202!" },
  { email: 'codeit3@codeit.com', password: "codeit303!" },
  { email: 'codeit4@codeit.com', password: "codeit404!" },
  { email: 'codeit5@codeit.com', password: "codeit505!" },
  { email: 'codeit6@codeit.com', password: "codeit606!" },
];

// 비밀번호 입력시 re-eye-show-icon 보여주기
function rePwEyeIconShow() {
  if(passwordReInput.value !== '') {
    rePwEyeShowIcon.classList.add('show');
  } else {
    rePwEyeShowIcon.classList.remove('show');
  }
}

// 클릭시 비밀번호 확인 type 전환 (text <-> password)
function rePwEyeIconUse() {
  if(passwordReInput.type == "password"){
    passwordReInput.type = "text";
    rePwEyeShowIcon.classList.remove('show');
    rePwEyeCloseIcon.classList.add('show');
  } else {
    passwordReInput.type = "password";
    rePwEyeCloseIcon.classList.remove('show');
    rePwEyeShowIcon.classList.add('show');
  }
}
// 조건엔 딱히 제시된 것이 없지만, 닉네임 기재를 안하고 회원가입 가능은 아니라 생각해서 닉네임 에러도 추가하였습니다!
// "닉네임을 입력해주세요." 에러 메시지 출력
function validateNickname() {
  if (nicknameInput.value === '') {
    nicknameError.classList.add('show');
    nicknameError.innerHTML = '닉네임을 입력해주세요.';
    nicknameInput.style.outline = '1px solid var(--red)';
  } else {
    nicknameError.classList.remove('show');
    nicknameInput.style.outline = '';
  }
}

// "비밀번호가 일치하지 않습니다." 에러 메시지 출력
function correctPassword() {
  if(passwordInput.value !== passwordReInput.value) {
    passwordReError.classList.add('show');
    passwordReError.innerHTML = '비밀번호가 일치하지 않습니다.';
    passwordReInput.style.outline = '1px solid var(--red)';
  } else {
    passwordReError.classList.remove('show');
    passwordReInput.style.outline = '';
  }
}

// 조건 만족시 버튼 활성화(회원가입)
useBtn.style.cursor = 'default';
// 초기화면에서 버튼을 눌렀을 때, 실행되는 것을 막기 위해 함수호출
canUseSignUpBtn();   

function canUseSignUpBtn() {
  if (emailInput.value.match(/^[A-Za-z\._\-0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/) && 
  passwordInput.value.length > 7 && passwordInput.value === passwordReInput.value && nicknameInput.value !== '') {
    useBtn.disabled = false;
    useBtn.style.backgroundColor = 'var(--blue)';
    useBtn.style.cursor = 'pointer';
  } else {
    useBtn.disabled = true;
    useBtn.style.backgroundColor = '';
    useBtn.style.cursor = 'default';
  }
}

// 이메일 존재 여부 확인 후 회원가입 성공 / 실패
function SignUpSuccess() {
  const emailValue = emailInput.value;
  const passwordValue = passwordInput.value;
  const passwordReValue = passwordReInput.value;

  const user = USER_DATA.find((el) => emailValue === el.email);

  if (user) {
    signUpErrorDlg.style.display = 'flex';
    errorMsg.innerHTML = '사용 중인 이메일입니다.';
    signUpErrorDlg.showModal();
  } else {
    document.location.href = 'login.html';
  }
}


passwordInput.addEventListener('input', eyeIconShow);
eyeCloseIcon.addEventListener('click', eyeIconUse);
eyeShowIcon.addEventListener('click', eyeIconUse);

passwordReInput.addEventListener('input', rePwEyeIconShow);
rePwEyeCloseIcon.addEventListener('click', rePwEyeIconUse);
rePwEyeShowIcon.addEventListener('click', rePwEyeIconUse);

emailInput.addEventListener('focusout', validateEmail);
nicknameInput.addEventListener('focusout', validateNickname);
passwordInput.addEventListener('focusout', validatePassword);
passwordReInput.addEventListener('focusout', correctPassword);

emailInput.addEventListener('input', canUseSignUpBtn);
nicknameInput.addEventListener('input', canUseSignUpBtn);
passwordInput.addEventListener('input', canUseSignUpBtn);
passwordReInput.addEventListener('input', canUseSignUpBtn);

useBtn.addEventListener('click', SignUpSuccess);

dlgBtn.addEventListener('click', closeDlg);