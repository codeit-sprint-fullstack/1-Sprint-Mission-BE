document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('confirm-password')) {
        document.getElementById('confirm-password').addEventListener('focusout', validateConfirmPassword);
    }
    if (document.querySelector('form')) {
        document.querySelector('form').addEventListener('submit', handleSignup);
    }
});

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
