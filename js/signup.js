document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('email').addEventListener('focusout', validateEmail);
    document.getElementById('password').addEventListener('focusout', validatePassword);
    document.getElementById('confirm-password').addEventListener('focusout', validateConfirmPassword);
    document.querySelector('form').addEventListener('submit', handleSignup);
});

const USER_DATA = [
    { email: 'codeit1@codeit.com', password: "codeit101!" },
    { email: 'codeit2@codeit.com', password: "codeit202!" },
    { email: 'codeit3@codeit.com', password: "codeit303!" },
    { email: 'codeit4@codeit.com', password: "codeit404!" },
    { email: 'codeit5@codeit.com', password: "codeit505!" },
    { email: 'codeit6@codeit.com', password: "codeit606!" },
];

function validateEmail() {
    const email = document.getElementById('email');
    const emailError = document.getElementById('email-error');
    const emailGroup = email.closest('.form-group');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    emailGroup.classList.remove('error');
    emailError.textContent = '';

    if (!email.value) {
        emailGroup.classList.add('error');
        emailError.textContent = '이메일을 입력해주세요.';
    } else if (!emailPattern.test(email.value)) {
        emailGroup.classList.add('error');
        emailError.textContent = '잘못된 이메일 형식입니다.';
    }
}

function validatePassword() {
    const password = document.getElementById('password');
    const passwordError = document.getElementById('password-error');
    const passwordGroup = password.closest('.form-group');

    passwordGroup.classList.remove('error');
    passwordError.textContent = '';

    if (!password.value) {
        passwordGroup.classList.add('error');
        passwordError.textContent = '비밀번호를 입력해주세요.';
    } else if (password.value.length < 8) {
        passwordGroup.classList.add('error');
        passwordError.textContent = '비밀번호를 8자 이상 입력해주세요.';
    }
}

function validateConfirmPassword() {
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm-password');
    const confirmPasswordError = document.getElementById('confirm-password-error');
    const confirmPasswordGroup = confirmPassword.closest('.form-group');

    confirmPasswordGroup.classList.remove('error');
    confirmPasswordError.textContent = '';

    if (confirmPassword.value !== password.value) {
        confirmPasswordGroup.classList.add('error');
        confirmPasswordError.textContent = '비밀번호가 일치하지 않습니다.';
    }
}

function handleSignup(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const emailExists = USER_DATA.some(user => user.email === email);

    if (emailExists) {
        showAlert('사용 중인 이메일입니다.');
    } else {
        window.location.href = './login.html';
    }
}

function showAlert(message) {
    const alertBox = document.createElement('div');
    alertBox.className = 'alert-box';
    alertBox.innerHTML = `
        <div class="alert-content">
            <p>${message}</p>
            <button onclick="closeAlert()">확인</button>
        </div>
    `;
    document.body.appendChild(alertBox);
}

function closeAlert() {
    const alertBox = document.querySelector('.alert-box');
    if (alertBox) {
        alertBox.remove();
    }
}
