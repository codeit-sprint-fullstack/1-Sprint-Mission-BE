// 에러 핸들러 미들웨어 파일

const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // 에러 발생 위치와 원인을 확인하기 위한 로그

  // 클라이언트의 입력값이 유효성 검사를 통과하지 못했을 때
  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }

  // 상태 코드가 지정된 에러 처리
  if (err.status) {
    return res.status(err.status).json({ error: err.message });
  }

  // 그 외의 일반적인 서버 오류 처리
  res.status(500).json({ error: "서버 오류가 발생했습니다." });
};

export default errorHandler;
