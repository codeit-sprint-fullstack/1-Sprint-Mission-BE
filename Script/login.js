import * as valid from "/script/validation_login.js";

document.addEventListener("DOMContentLoaded", () => {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  const emailErrorMessage = valid.createErrorMessage("잘못된 이메일입니다");
  emailInput.parentNode.appendChild(emailErrorMessage);

  const passwordErrorMessage =
    valid.createErrorMessage("비밀번호를 8자 이상 입력해주세요");
  passwordInput.parentNode.appendChild(passwordErrorMessage);

  emailInput.addEventListener("input", valid.ValidMail);
  passwordInput.addEventListener("input", valid.ValidPassword);
});

const passwordInput = document.getElementById("password");
const toggleImage = document.getElementById("togglePassword");

toggleImage.addEventListener("click", togglePasswordVisibility);

function togglePasswordVisibility() {
  const type =
    passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);

  // 이미지 경로 설정
  if (type === "password") {
    toggleImage.src = "/images/TheEye.png"; // 비밀번호 보이기 이미지
  } else {
    toggleImage.src = "/images/TheEyeOpen.png"; // 비밀번호 감추기 이미지
  }
}
