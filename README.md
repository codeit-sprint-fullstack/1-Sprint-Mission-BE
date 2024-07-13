# pandamarket ( 진행중: 2024.06.20 ~ )

## 배포: https://hellopandamarket.netlify.app/

<br>

# **Mission-01 : 첫 화면 요구사항 체크리스트**

- [X] React와 같은 UI 라이브러리를 사용하지 않고 진행합니다
- [X]  PC사이즈만 고려해 주어진 디자인으로 구현합니다.
- [X]  HTML, CSS 파일을 [Netlify](https://www.netlify.com/)로 배포해 주세요.
- [X]  랜딩 페이지의 url path는 루트(‘/’)로 설정합니다.
- [X]  title은 “판다마켓”로 설정합니다.
- [X]  “판다마켓” 로고 클릭 시 루트 페이지(‘/’)로 이동합니다.
- [X]  '로그인' 버튼 클릭 시 로그인 페이지(‘/login’)로 이동합니다 (빈 페이지)
- [X]  “구경하러 가기”버튼 클릭 시(’/items’)로 이동합니다. (빈 페이지)
- [X]  “Privacy Policy”, “FAQ”는 클릭 시 각각 Privacy 페이지(‘/privacy’), FAQ 페이지(‘/faq’)로 이동합니다.(모두 빈 페이지)
- [X]  페이스북, 트위터, 유튜브, 인스타그램 아이콘을 클릭 시 각각의 홈페이지로 새로운 창이 열리면서 이동합니다.
- [X]  아래로 스크롤해도 “판다 마켓” 로고와 “로그인” 버튼이 있는 상단 내비게이션 바(Global Navigation Bar)가 최상단에 고정되게 해 주세요.
- [X]  화면의 너비가 1920px 이상이면 하늘색 배경색은 너비를 꽉 채우도록 채워지고, 내부 요소들의 위치는 고정되고, 여백만 커지도록 합니다.
- [X]  화면의 너비가 1920px 보다 작아질 때, “판다마켓” 로고의 왼쪽 여백 200px, “로그인" 버튼의 오른쪽 여백 200px이 유지되고, 화면의 너비가 작아질수록 두 요소 간 거리가 가까워지도록 설정합니다.
- [X]   화면의 너비가 1920px 이상이면 내부에 있는 요소 간 동일한 간격을 유지하며 가운데 정렬해야 합니다.
- [X]  화면의 너비가 1920px 보다 작아질 때, 최하단에 있는 “codeit-2024”의 왼쪽 여백 200px과 SNS 아이콘들의 오른쪽 여백 200px을 유지하면서 가운데 있는 “Privacy Policy”, “FAQ” 요소와 각각 동일한 간격을 유지하며 가까워져야 합니다.
- [X]   클릭으로 기능이 동작해야 하는 경우, 사용자가 클릭할 수 있는 요소임을 알 수 있도록 CSS 속성 cursor: pointer로 설정합니다.

## 주요 변경 사항
- 첫 화면 구성

<br><br>

# **Mission-02 : 로그인 / 회원가입 화면 요구사항 체크리스트**

- [X]   README.md 파일을 작성해 주세요.
- [X]   마크다운 언어를 숙지하여 작성해 주세요.
 내용은 자유롭게 작성해 주세요.
- [X]    본인 브랜치(ex)part1-홍길동)에 스프린트 미션을 업로드해 주세요.
- [X]   적절한 커밋 메시지를 남겨 주세요.
- [X]   1-Sprint-Mission 레포지토리를 fork 합니다.
- [X]   GitHub에 PR(Pull Request)을 생성해 upstream의 본인 브랜치(ex)part1-홍길동)에 미션을 제출합니다.
- [X]    PR 코멘트에 아래 내용들을 포함해 주세요.
- [X]   스프린트 미션 요구사항 체크리스트
- [X]   아래 예시 사진과 같이 완료한 만큼 체크 표시를 해 주세요. 참고
- [X]    주요 변경사항
- [X]    멘토님에게 남길 메시지
- [X]   Git 활용 과정에서 유닉스 커맨드를 활용해 주세요.
- [X]   HTML, CSS 파일을 Netlify로 배포합니다.

### 로그인 페이지, 회원가입 페이지 공통

 - [X]   “판다마켓" 로고 클릭 시 루트 페이지(“/”)로 이동합니다.
 - [X]   로그인 페이지, 회원가입 페이지 모두 로고 위 상단 여백이 동일합니다.
 - [X]   SNS 아이콘들은 클릭 시 각각 “[https://www.google.com/”](https://www.google.com/%E2%80%9D), “[https://www.kakaocorp.com/page/”](https://www.kakaocorp.com/page/%E2%80%9D) 으로 이동합니다.
- [X]    input 요소에 focus in 일 때, 테두리 색상은 ##3692FF입니다.
- [X]   input 요소에 focus out 일 때, 테두리는 없습니다.

### 로그인 페이지

- [X]   “회원가입”버튼 클릭 시 “/signup” 페이지로 이동합니다.

### 회원가입 페이지

- [X]   “로그인”버튼 클릭 시 “/login” 페이지로 이동합니다.

## 심화
### Mission-01 : 첫 화면

- [X]   reset.css를 설정해 주세요.
- [X]   사용자의 브라우저 설정에 따라 기본 폰트 크기 설정이 변화함에 따라서 페이지의 요소 간 간격, 요소의 크기, font-size 등 모든 크기와 관련된 값이 크고 작아지도록 설정해 주세요.

### Mission-02 : 로그인 / 회원가입 화면

- [X]    palette에 있는 color값들을 css 변수로 등록해서 사용합니다.
- [X]   사용자의 브라우저가 크고 작아짐에 따라 페이지의 요소 간 간격, 요소의 크기, font-size 등 모든 크기와 관련된 값이 크고 작아지도록 설정해 주세요.
- [X]   구글 애널리틱스로 방문자 수 확인하기 할 수 있도록 설정합니다.
- [X]   로그인 페이지, 회원가입 페이지 공통
- [X]   비밀번호, 비밀번호 확인 input 요소 오른쪽에 비밀번호를 확인할 수 있는 눈 모양 아이콘을 추가합니다.

## 스크린샷

### index.html
![image](https://github.com/codeit-sprint-fullstack/1-Sprint-Mission-FE/assets/101076926/9287b6d0-7305-4191-b741-e8c8c101667a)

### login.html
![image](https://github.com/codeit-sprint-fullstack/1-Sprint-Mission-FE/assets/101076926/1b6004f5-ade9-4df2-b8d8-376d079fd117)

### signup.html
![image](https://github.com/codeit-sprint-fullstack/1-Sprint-Mission-FE/assets/101076926/db9c956d-d0e9-4acf-be73-e2fa6a49a18e)

### google_analytics
![77F420B4-274D-46EC-A19A-6D80E1E1C63F_1_201_a](https://github.com/codeit-sprint-fullstack/1-Sprint-Mission-FE/assets/101076926/de317c61-5d6e-4dfb-8b71-db2eee3ce1a5)

## 주요 변경 사항
- 로그인, 회원가입 화면 구성

<br><br>

# **Mission03 요구사항 체크리스트**

## 공통

- [X] Github에 스프린트 미션 PR을 만들어 주세요.

### 로그인, 회원가입 페이지 공통
 - [X] 로그인 및 회원가입 페이지의 이메일, 비밀번호, 비밀번호 확인 input에 필요한 유효성 검증 함수를 만들고 적용해 주세요.
 - [X] 이메일 input에서 focus out 할 때, 값이 없을 경우 input에 빨강색 테두리와 아래에 “이메일을 입력해주세요.” 빨강색 에러 메세지를 보입니다.
 - [X] 이메일 input에서 focus out 할 때, 이메일 형식에 맞지 않는 경우 input에 빨강색 테두리와 아래에 “잘못된 이메일 형식입니다” 빨강색 에러 메세지를 보입니다.
 - [X] 비밀번호 input에서 focus out 할 때, 값이 없을 경우 아래에 “비밀번호를 입력해주세요.” 에러 메세지를 보입니다
 - [X] 비밀번호 input에서 focus out 할 때, 값이 8자 미만일 경우 아래에 “비밀번호를 8자 이상 입력해주세요.” 에러 메세지를 보입니다.
 - [X] input 에 빈 값이 있거나 에러 메세지가 있으면 ‘로그인’ 버튼은 비활성화 됩니다.
 - [X] Input 에 유효한 값을 입력하면 ‘로그인' 버튼이 활성화 됩니다.
 - [X] 활성화된 ‘로그인’ 버튼을 누르면 “/items” 로 이동합니다

const USER_DATA = [
{ email: '[codeit1@codeit.com](mailto:codeit1@codeit.com)', password: "codeit101!" },
{ email: '[codeit2@codeit.com](mailto:codeit2@codeit.com)', password: "codeit202!" },
{ email: '[codeit3@codeit.com](mailto:codeit3@codeit.com)', password: "codeit303!" },
{ email: '[codeit4@codeit.com](mailto:codeit4@codeit.com)', password: "codeit404!" },
{ email: '[codeit5@codeit.com](mailto:codeit5@codeit.com)', password: "codeit505!" },
{ email: '[codeit6@codeit.com](mailto:codeit6@codeit.com)', password: "codeit606!" },
];

### 로그인 페이지
- [X] 이메일과 비밀번호를 입력하고 로그인 버튼을 누른 후, 다음 조건을 참조하여 로그인 성공 여부를 alert 메시지로 출력합니다.
- 만약 입력한 이메일이 데이터베이스(USER_DATA)에 없거나, 이메일은 일치하지만 비밀번호가 틀린 경우, '비밀번호가 일치하지 않습니다.'라는 메시지를 alert로 표시합니다
- 만약 입력한 이메일이 데이터베이스에 존재하고, 비밀번호도 일치할 경우, “/items”로 이동합니다.

### 회원가입
- [X] 회원가입을 위해 이메일, 닉네임, 비밀번호, 비밀번호 확인을 입력한 뒤, 회원가입 버튼을 클릭하세요. 그 후에는 다음 조건에 따라 회원가입 가능 여부를 alert로 알려주세요.
- 입력한 이메일이 이미 데이터베이스(USER_DATA)에 존재하는 경우, '사용 중인 이메일입니다'라는 메시지를 alert로 표시합니다.
- 입력한 이메일이 데이터베이스(USER_DATA)에 없는 경우, 회원가입이 성공적으로 처리되었으므로 로그인 페이지(”/login”)로 이동합니다.

## 심화 요구사항
### 공통
- [X] 페이스북, 카카오톡, 디스코드, 트위터 등 SNS에서 판다마켓 랜딩 페이지(“/”) 공유 시 미리보기를 볼 수 있도록 랜딩 페이지 메타 태그를 설정합니다.
- [X] 미리보기에서 제목은 “판다마켓”, 설명은 “일상에서 모든 물건을 거래해보세요”로 설정합니다.
- [X] 주소와 이미지는 자유롭게 설정하세요.
- [ ] 로그인, 회원가입 페이지에 공통으로 사용하는 로직이 있다면, 반복하지 않고 공통된 로직을 모듈로 분리해 사용해 주세요.

### 랜딩 페이지
- [X] 브라우저에 현재 보이는 화면의 영역(viewport) 너비를 기준으로 분기되는 반응형 디자인을 적용합니다.
PC: 1200px 이상
Tablet: 744px 이상 ~ 1199px 이하
Mobile: 375px 이상 ~ 743px 이하
375px 미만 사이즈의 디자인은 고려하지 않습니다
- [X] Tablet 사이즈로 작아질 때 최소 좌우 여백이 “판다마켓” 로고의 왼쪽에 여백 24px, “로그인” 버튼 오른쪽 여백 24px을 유지할 수 있도록 “판다마켓” 로고와 “로그인" 버튼의 간격이 가까워집니다.
- [X] Mobile 사이즈로 작아질 때 최소 좌우 여백이 “판다마켓” 로고의 왼쪽에 여백 16px, “로그인” 버튼 오른쪽 여백 16px을 유지할 수 있도록 “판다마켓” 로고와 “로그인" 버튼의 간격이 가까워집니다.
- [X] PC, Tablet 사이즈의 이미지 크기는 고정값을 사용합니다.
- [X] Mobile 사이즈의 이미지는 좌우 여백 32px을 제외하고 이미지 영역이 꽉 차게 구현합니다. (이때 가로가 커지는 비율에 맞춰 세로도 커져야 합니다.)
- [X] Mobile 사이즈 너비가 커지면, “Privacy Policy”, “FAQ”, “codeit-2023”이 있는 영역과 SNS 아이콘들이 있는 영역의 사이 간격이 커집니다.

### 로그인, 회원가입 페이지 공통
- [X] Tablet 사이즈에서 내부 디자인은 PC사이즈와 동일합니다.
- [X] Mobile 사이즈에서 좌우 여백 16px 제외하고 내부 요소들이 너비를 모두 차지합니다.
- [X] Mobile 사이즈에서 내부 요소들의 너비는 기기의 너비가 커지는 만큼 커지지만 400px을 넘지 않습니다.
- [X] 오류 메시지 모달을 구현합니다. 모달 내 내용은 alert 메시지와 동일합니다.

## 스크린샷
### 랜딩 페이지 태블릿 사이즈
![image](https://github.com/user-attachments/assets/394b05bb-fb53-442f-9374-07d8f2a9da71)

### 랜딩 페이지 모바일 사이즈
![image](https://github.com/user-attachments/assets/8eda2c9c-7217-47fd-aa88-29b6ee2a8c48)

### 로그인 페이지 태블릿 사이즈
![image](https://github.com/user-attachments/assets/1820ccbb-f4c2-42ab-b62c-68dce4366af9)

### 로그인 페이지 모바일 사이즈
![image](https://github.com/user-attachments/assets/5c58e3c9-80c3-48a1-a54c-52265dd92fb5)

### 회원가입 페이지 태블릿 사이즈
![image](https://github.com/user-attachments/assets/db3aa592-5787-4576-aaa2-d6d0e6fc77c9)

### 회원가입 모바일 사이즈
![image](https://github.com/user-attachments/assets/e6b02b45-1a66-4853-98c6-02b4aa52ffc4)

### 로그인 페이지 유효성 검사
![image](https://github.com/user-attachments/assets/e97267cc-ffc1-4304-9e23-3cf3952245ef)

### 회원가입 페이지 유효성 검사
![image](https://github.com/user-attachments/assets/5d9b8596-996b-476d-b77f-37acf29de5ea)

### 로그인 페이지 alert 메세지
![image](https://github.com/user-attachments/assets/23269b89-0877-4485-a534-4b90f6e6a075)

### 회원가입 페이지 alert 메세지
![image](https://github.com/user-attachments/assets/0a5a0b96-ff07-4edd-aca0-9bac676bd536)

## 주요 변경 사항
- mission1+2 refactor (파일 구조 분리, 눈 모양 아이콘 invisbe, visible 나눠서 분리, login-signup 공통파일 분리중..)
-  랜딩페이지, 로그인 페이지, 회원가입 페이지 반응형 적용
- 랜딩 페이지, 로그인 페이지, 회원가입 페이지 오류 메세지
- 로그인페이지, 회원가입 alert 메세지
- 메타 태그
