import * as valid from "./validation_signup.js";
import { USER_DATA } from "./data.js";

document.addEventListener("DOMContentLoaded", () => {
  const emailInput = document.getElementById("Email");
  const nicknameInput = document.getElementById("Nickname");
  const passwordInput = document.getElementById("Password");
  const passwordConInput = document.getElementById("Password_con");
  const loginButton = document.querySelector(".login_button");
  const modal = document.getElementById("customModal");
  const modalMessage = document.getElementById("modalMessage");
  const closeModalBtn = document.getElementById("closeModalBtn");

  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  const showModal = (message) => {
    modalMessage.textContent = message;
    modal.style.display = "flex";
  };

  const emailErrorMessage = 
  valid.createErrorMessage("잘못된 이메일입니다");

  const nicknameErrorMessage =
    valid.createErrorMessage("닉네임을 입력해 주세요");

  const passwordErrorMessage =
    valid.createErrorMessage("비밀번호를 8자 이상 입력해주세요");

  const passwordConErrorMessage =
    valid.createErrorMessage("비밀번호가 일치하지 않습니다");

  emailInput.parentNode.appendChild(emailErrorMessage);
  nicknameInput.parentNode.appendChild(nicknameErrorMessage);
  passwordInput.parentNode.appendChild(passwordErrorMessage);
  passwordConInput.parentNode.appendChild(passwordConErrorMessage);

  emailInput.addEventListener("input", valid.ValidMail);
  passwordInput.addEventListener("input", valid.ValidPassword);
  passwordConInput.addEventListener("input", valid.ValidPasswordConfirm);


// 로그인 시도시 검사
  loginButton.addEventListener("click", (event) => {
    const confirmedEmail =
      /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(
        emailInput.value.trim()
      );
    const confirmedNickname = nicknameInput.value.trim().length > 0;
    const confirmedPassword = passwordInput.value.trim().length >= 8;
    const confirmedConfirmPassword =
      passwordInput.value.trim() === passwordConInput.value.trim();

    if (
      !confirmedEmail ||
      !confirmedPassword ||
      !confirmedConfirmPassword ||
      !confirmedNickname
    ) {
      event.preventDefault();

      if (!confirmedEmail || !confirmedPassword) {
        showModal("올바른 이메일 및 비밀번호를 입력해주세요");
      } else if (!confirmedConfirmPassword) {
        showModal("비밀번호가 일치하지 않습니다");
      } else if (!confirmedNickname) {
        showModal("닉네임을 입력해주세요");
      }
    } else {
      const newUser = {
        email: emailInput.value.trim(),
        nickname: nicknameInput.value.trim(),
        password: passwordInput.value.trim(),
      };

      if (isEmailAlreadyExist(newUser.email)) {
        showModal("사용 중인 이메일입니다.");
        return;
      }

      USER_DATA.push(newUser);
      showModal("회원가입이 완료되었습니다!");
      setTimeout(() => {
        window.location.href = "/login.html";
      }, 1500);
    }
  });

  function isEmailAlreadyExist(email) {
    return USER_DATA.some((user) => user.email === email);
  }
});

// 비밀번호란 토글
const passwordInput = document.getElementById("Password");
const toggleImage = document.getElementById("togglePassword");

toggleImage.addEventListener("click", togglePasswordVisibility);

function togglePasswordVisibility() {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);

    if (type === "password") {
        toggleImage.src = "../TheEye.png";
    } else {
        toggleImage.src = "../TheEyeOpen.png";
    }
}


// 비밀번호 확인란 토글
const passwordInputCon = document.getElementById("Password_con");
const toggleImageCon = document.getElementById("togglePassword_con");

toggleImageCon.addEventListener("click", togglePasswordVisibilityCon);

function togglePasswordVisibilityCon() {
    const type = passwordInputCon.getAttribute("type") === "password" ? "text" : "password";
    passwordInputCon.setAttribute("type", type);

    if (type === "password") {
        toggleImageCon.src = "../TheEye.png";
    } else {
        toggleImageCon.src = "../TheEyeOpen.png";
    }
}