// 이메일 정규식패턴
const pattern = /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]{2,3}$/;

// 닉네임 정규식패턴
const nickNamePattern =  /^(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{2,}$/;

export { pattern, nickNamePattern };