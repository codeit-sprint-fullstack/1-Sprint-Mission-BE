export const USER_DATA = [
    { email: 'codeit1@codeit.com', password: "codeit101!" },
    { email: 'codeit2@codeit.com', password: "codeit202!" },
    { email: 'codeit3@codeit.com', password: "codeit303!" },
    { email: 'codeit4@codeit.com', password: "codeit404!" },
    { email: 'codeit5@codeit.com', password: "codeit505!" },
    { email: 'codeit6@codeit.com', password: "codeit606!" },
]

export const ValidMail = function checkEmail() {
    const emailLen = emailInput.value.trim()
    const emailRegex = /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    const email_confirm = emailRegex.test(emailLen);
    if (emailLen === "") {
        emailErrorMessage.style.display = 'none';
        emailInput.style.border = 'none'
    }
    else if (email_confirm) {
        emailErrorMessage.style.display = 'none';
        emailInput.style.border = 'none'
    } else {
        emailErrorMessage.style.display = 'block';
        emailInput.style.border = '1px solid #F74747';
        emailInput.style.borderRadius = '12px'
    }
    InputCheck();
}

export const ValidPassword = function checkPassword() {
    if (passwordInput.value.trim() == "") {
        passwordErrorMessage.style.display = 'none';
        passwordInput.style.border = 'none'
    }
    else if (passwordInput.value.trim().length >= 8) {
        passwordErrorMessage.style.display = 'none';
        passwordInput.style.border = 'none'
    } else {
        passwordErrorMessage.style.display = 'block';
        passwordInput.style.border = '1px solid #F74747';
        passwordInput.style.borderRadius = '12px'
    }
    InputCheck();
}

export const ValidInput = function InputCheck() {
    const confirmedEmail = /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(emailInput.value.trim());
    const confirmedPassword = passwordInput.value.trim().length >= 8;

    if (confirmedEmail && confirmedPassword) {
        loginButton.style.backgroundColor = '#3692FF';
        loginButton.style.border = 'none';
    } else {
        loginButton.style.backgroundColor = '#ccc';
        loginButton.style.border = '1px solid #ccc';      
    }
}