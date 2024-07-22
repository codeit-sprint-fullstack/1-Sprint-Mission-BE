const eyeCloseIcon = document.querySelector("#eye-close-icon");
const eyeShowIcon = document.querySelector('#eye-show-icon');

const emailInput = document.querySelector('#email-input');
const emailError = document.querySelector('#email-error');
const passwordInput = document.querySelector('#password-input');
const passwordError = document.querySelector('#password-error');

const loginErrorDlg = document.querySelector('#password-error-dlg');



// 비밀번호 입력시 eye-show-icon 보여주기
export function eyeIconShow() {
  if(passwordInput.value !== '') {
    eyeShowIcon.classList.add('show');
  } else {
    eyeShowIcon.classList.remove('show');
  }
}

// 클릭시 비밀번호 type 전환 (text <-> password)
export function eyeIconUse() {
  if(passwordInput.type == "password"){
    passwordInput.type = "text";
    eyeShowIcon.classList.remove('show');
    eyeCloseIcon.classList.add('show');
  } else {
    passwordInput.type = "password";
    eyeCloseIcon.classList.remove('show');
    eyeShowIcon.classList.add('show');
  }
}

// "이메일을 입력해주세요." / "잘못된 이메일 형식입니다." 에러 메시지 표시
export function validateEmail() {
  if (emailInput.value === '') {
    emailError.classList.add('show');
    emailError.innerHTML = "이메일을 입력해주세요.";
    emailInput.style.outline = '1px solid var(--red)';
  } else if (!emailInput.value.match(/^[A-Za-z\._\-0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/)) {
    emailError.classList.add('show');
    emailError.innerHTML = "잘못된 이메일 형식입니다.";
    emailInput.style.outline = '1px solid var(--red)';
  } else {
    emailError.classList.remove('show');
    emailInput.style.outline = '';
  }
}

// "비밀번호를 입력해주세요." / "비밀번호를 8자 이상 입력해주세요." 에러 메시지 표시
export function validatePassword() {
  if(passwordInput.value === '') {
    passwordError.classList.add('show');
    passwordError.innerHTML = '비밀번호를 입력해주세요.';
    passwordInput.style.outline = '1px solid var(--red)';
  } else if (passwordInput.value.length < 8) {
    passwordError.classList.add('show'); 
    passwordError.innerHTML = '비밀번호를 8자 이상 입력해주세요.';
    passwordInput.style.outline = '1px solid var(--red)';
  } else{
    passwordError.classList.remove('show');
    passwordInput.style.outline = '';
  }
}



// dialog 확인 버튼 클릭 시, 모달 창 닫기
export function closeDlg(){
  loginErrorDlg.style.display = '';
  loginErrorDlg.close();
}