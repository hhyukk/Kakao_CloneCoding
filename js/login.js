const loginForm = document.querySelector('#login-form');
const loginFormId = document.querySelector('#login-form input:first-child');
const loginFormPassword = document.querySelector('#login-form input:nth-child(2)');

const signupNickname = document.querySelector('#signup-nickname');
const btnLogin = document.querySelector('#btn-login');
const btnShowSignup = document.querySelector('#btn-show-signup');

// 회원가입 폼으로 전환하는 함수 추가
function toggleSignupMode() {
  event.preventDefault();

  signupNickname.style.display = 'block'; // 닉네임 입력 칸 표시
  btnLogin.style.display = 'none'; // 로그인 버튼 숨김
  btnShowSignup.value = 'Create Account'; // 버튼 텍스트 변경
  btnShowSignup.type = 'submit'; // 폼 제출용 버튼으로 변경

  // 기존 이벤트 리스너 제거 후 회원가입 로직으로 연결
  btnShowSignup.removeEventListener('click', toggleSignupMode);
  btnShowSignup.addEventListener('click', handleSignup);
}

// 회원가입 처리 로직 (닉네임 포함)
function handleSignup(event) {
  event.preventDefault(); // 기본 폼 제출 방지

  if (loginFormId.value === '' || loginFormPassword.value === '' || signupNickname.value === '') {
    alert('모든 정보를 입력해주세요.');
    return;
  }

  if (localStorage.getItem(loginFormId.value) == null) {
    // 임시로 localStorage에 저장 (이후 Spring Boot 연동 시 fetch API로 대체)
    localStorage.setItem(loginFormId.value, loginFormPassword.value);
    localStorage.setItem(`${loginFormId.value}_nickname`, signupNickname.value);
    alert(`${signupNickname.value}님, 회원가입이 완료되었습니다.`);
    window.location.reload(); // 초기 화면으로 복귀
  } else {
    alert('이미 존재하는 아이디입니다.');
  }
}

// 기존 로그인 처리 로직
function logIn(event) {
  event.preventDefault();
  if (localStorage.getItem(loginFormId.value) === null) {
    alert('아이디가 틀렸습니다.');
  } else if (localStorage.getItem(loginFormId.value) !== loginFormPassword.value) {
    alert('비밀번호가 다릅니다.');
  } else {
    // 성공 시 페이지 이동
    window.location.href = 'friends.html';
  }
}

btnLogin.addEventListener('click', logIn);
btnShowSignup.addEventListener('click', toggleSignupMode);
