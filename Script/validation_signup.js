import { USER_DATA } from "./data.js";

document.getElementById("Email").addEventListener("input", ValidMail);
document.getElementById("Password").addEventListener("input", ValidPassword);
document
  .getElementById("Password_con")
  .addEventListener("input", ValidPasswordConfirm);
document
  .querySelector(".login_button")
  .addEventListener("click", function (event) {
    const email = document.getElementById("Email").value.trim();
    const password = document.getElementById("Password").value.trim();
    ValueChecker(email, password, event);
  });

export function ValidMail() {
  const emailInput = document.getElementById("Email");
  const emailErrorMessage = emailInput.parentNode.querySelector("span");
  if (!emailErrorMessage) {
    emailErrorMessage = createErrorMessage("유효한 이메일을 입력해주세요.");
    emailInput.parentNode.appendChild(emailErrorMessage);
  }
  const emailLen = emailInput.value.trim();
  const emailRegex = /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  const email_confirm = emailRegex.test(emailLen);

  if (emailLen === "") {
    emailErrorMessage.style.display = "none";
    emailInput.style.border = "none";
  } else if (email_confirm) {
    emailErrorMessage.style.display = "none";
    emailInput.style.border = "none";
  } else {
    emailErrorMessage.style.display = "block";
    emailInput.style.border = "1px solid #F74747";
    emailInput.style.borderRadius = "12px";
  }
  InputValid();
}

export function ValidPassword() {
  const passwordInput = document.getElementById("Password");
  const passwordErrorMessage = passwordInput.parentNode.querySelector("span");
  if (!passwordErrorMessage) {
    passwordErrorMessage = createErrorMessage(
      "비밀번호는 8자리 이상이어야 합니다."
    );
    passwordInput.parentNode.appendChild(passwordErrorMessage);
  }

  if (passwordInput.value.trim() === "") {
    passwordErrorMessage.style.display = "none";
    passwordInput.style.border = "none";
  } else if (passwordInput.value.trim().length >= 8) {
    passwordErrorMessage.style.display = "none";
    passwordInput.style.border = "none";
  } else {
    passwordErrorMessage.style.display = "block";
    passwordInput.style.border = "1px solid #F74747";
    passwordInput.style.borderRadius = "12px";
  }
  InputValid();
}

export function ValidPasswordConfirm() {
  const passwordInput = document.getElementById("Password");
  const passwordConInput = document.getElementById("Password_con");
  const passwordConErrorMessage =
    passwordConInput.parentNode.querySelector("span");
  if (!passwordConErrorMessage === passwordInput) {
    passwordConErrorMessage =
      createErrorMessage("비밀번호가 일치하지 않습니다");
    passwordConInput.parentNode.appendChild(passwordErrorMessage);
  } else if (passwordConInput.value.trim() === "") {
    passwordConErrorMessage.style.display = "none";
    passwordConInput.style.border = "none";
  } else if (passwordInput.value.trim() === passwordConInput.value.trim()) {
    passwordConErrorMessage.style.display = "none";
    passwordConInput.style.border = "none";
  } else {
    passwordConErrorMessage.style.display = "block";
    passwordConInput.style.border = "1px solid #F74747";
    passwordConInput.style.borderRadius = "12px";
  }
  InputValid();
}

export function InputValid() {
  const emailInput = document.getElementById("Email");
  const passwordInput = document.getElementById("Password");
  const passwordConInput = document.getElementById("Password_con");
  const nicknameInput = document.getElementById("Nickname");
  const loginButton = document.querySelector(".login_button");

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const confirmPassword = passwordConInput.value.trim();
  const nickname = nicknameInput.value.trim();

  const confirmedEmail =
    /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email);
  const confirmedPassword = password.length >= 8;
  const confirmedConfirmPassword = password === confirmPassword;
  const confirmedNickname = nickname.length > 0;

  if (
    confirmedEmail &&
    confirmedPassword &&
    confirmedConfirmPassword &&
    confirmedNickname
  ) {
    loginButton.style.backgroundColor = "#3692FF";
    loginButton.style.border = "none";
    loginButton.style.cursor = "pointer";
    loginButton.disabled = false;
  } else {
    loginButton.style.backgroundColor = "#ccc";
    loginButton.style.border = "1px solid #ccc";
    loginButton.style.cursor = "auto";
    loginButton.disabled = true;
  }
}

export function ValueChecker(email, password, event) {
  const userData = USER_DATA.find(
    (user) => user.email === email && user.password === password
  );

  if (!userData) {
    event.preventDefault();
    showModal("비밀번호가 일치하지 않습니다");
  } else {
    window.location.href = "../items.html";
  }
}

export function createErrorMessage(message) {
  const errorMessage = document.createElement("span");
  errorMessage.textContent = message;
  errorMessage.style.color = "#F74747";
  errorMessage.style.fontSize = "15px";
  errorMessage.style.fontWeight = "600";
  errorMessage.style.marginTop = "8px";
  errorMessage.style.marginLeft = "16px";
  errorMessage.style.display = "none";
  return errorMessage;
}

const showModal = (message) => {
  const modal = document.getElementById("customModal");
  const modalMessage = document.getElementById("modalMessage");
  modalMessage.textContent = message;
  modal.style.display = "flex";
};

document.getElementById("closeModalBtn").addEventListener("click", () => {
  document.getElementById("customModal").style.display = "none";
});
