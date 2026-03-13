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

// 비동기(async/await)을 활용한 실제 백엔드 회원가입 API 통신 함수
async function handleSignup(event) {
  event.preventDefault(); // 폼 기본 제출 방지

  const email = loginFormId.value;
  const password = loginFormPassword.value;
  const nickname = signupNickname.value;

  // 빈 값 검증
  if (email === '' || password === '' || nickname === '') {
    alert('모든 정보를 입력해주세요.');
    return;
  }

  try {
    // POST 요청 전송
    const response = await fetch('http://localhost:8080/api/v1/users/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // JSON 형태로 보냄을 명시
      },
      body: JSON.stringify({
        email: email,
        password: password,
        nickname: nickname,
      }), // JS 객체를 JSON 문자열로 변환
    });

    if (response.ok) {
      // HTTP 상태 코드 200번대 응답 시 성공 처리
      alert(`${nickname}님, 회원가입이 완료되었습니다.`);
      window.location.reload();
    } else {
      // 서버에서 400등 에러 반환 시
      const errorText = await response.text();
      alert(`회원가입 실패: ${errorText}`);
    }
  } catch (error) {
    // 네트워크 오류 등으로 서버와 통신 실패 시
    console.error('Error:', error);
    alert('서버와 통신하는 중 오류가 발생했습니다.');
  }
}

// 기존 로그인 처리 로직
function logIn(event) {
  event.preventDefault();

  // TODO: 추후 백엔드 로그인 API 연동
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
