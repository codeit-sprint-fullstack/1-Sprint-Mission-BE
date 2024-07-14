document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('form')) {
        document.querySelector('form').addEventListener('submit', handleLogin);
    }
});

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const user = USER_DATA.find(user => user.email === email);

    if (!user || user.password !== password) {
        showAlert('비밀번호가 일치하지 않습니다.');
    } else {
        window.location.href = './items.html';
    }
}
