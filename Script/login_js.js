import * as valid from "./validation_login.js";

document.addEventListener("DOMContentLoaded", () => {
  const emailInput = document.getElementById("Email");
  const passwordInput = document.getElementById("Password");
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

  const emailErrorMessage = valid.createErrorMessage("잘못된 이메일입니다");
  emailInput.parentNode.appendChild(emailErrorMessage);

  const passwordErrorMessage =
    valid.createErrorMessage("비밀번호를 8자 이상 입력해주세요");
  passwordInput.parentNode.appendChild(passwordErrorMessage);

  emailInput.addEventListener("input", valid.ValidMail);
  passwordInput.addEventListener("input", valid.ValidPassword);



  loginButton.addEventListener("click", (event) => {
    const confirmedEmail =
      /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(
        emailInput.value.trim()
      );
    const confirmedPassword = passwordInput.value.trim().length >= 8;

    if (!confirmedEmail || !confirmedPassword) {
      event.preventDefault();

      if (!confirmedEmail && !confirmedPassword) {
        showModal("올바른 이메일 및 비밀번호를 입력해주세요");
      } else if (!confirmedEmail) {
        showModal("올바른 이메일 양식이 아닙니다");
      } else if (!confirmedPassword) {
        showModal("올바른 비밀번호 양식이 아닙니다");
      }
    } else {
      valid.ValueChecker(
        emailInput.value.trim(),
        passwordInput.value.trim(),
        event
      );
    }
  });
});

const passwordInput = document.getElementById("Password");
const toggleImage = document.getElementById("togglePassword");

toggleImage.addEventListener("click", togglePasswordVisibility);

function togglePasswordVisibility() {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);

    // 이미지 경로 설정
    if (type === "password") {
        toggleImage.src = "../TheEye.png"; // 비밀번호 보이기 이미지
    } else {
        toggleImage.src = "../TheEyeOpen.png"; // 비밀번호 감추기 이미지
    }
}