// 비밀번호 표시하기/숨기기
const password = document.querySelector('.password');
const passIcon = document.querySelector('.pass_icon');

function showHide(b,a) {
  if (b.type === 'password') {
    b.setAttribute('type','text');
    a.setAttribute('src', '../img/eyeopen.png');
  } else {
    b.setAttribute('type', 'password');
    a.setAttribute('src', '../img/eyeclose.png');
  }
};

export { password, passIcon, showHide };