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

// 비동기(async/await)를 활용한 백엔드 로그인 API 연동
async function logIn(event) {
  event.preventDefault();

  const email = loginFormId.value;
  const password = loginFormPassword.value;

  // 빈 값 검증
  if (email === '' || password === '') {
    alert('이메일과 비밀번호를 모두 입력해주세요.');
    return;
  }

  try {
    // 백엔드 로그인 API로 POST 요청 전송
    const response = await fetch('http://localhost:8080/api/v1/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    if (response.ok) {
      // 응답 상태가 200 OK일 경우 JSON 데이터 파싱
      const data = await response.json();

      // 발급받은 JWT 토큰 및 사용자 정보를 localStorage에 저장
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('nickname', data.nickname);

      alert(`${data.nickname}님 환영합니다!`);
      window.location.href = 'friends.html'; // 성공 시 친구 목록 페이지로 이동
    } else {
      // 서버에서 에러 응답(400 등)을 보낸 경우
      // (비밀번호 불일치, 가입되지 않은 이메일 등)
      alert('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  } catch (error) {
    // 네트워크 오류 등으로 서버와 통신 실패 시
    console.error('Login Error:', error);
    alert('서버와 통신하는 중 오류가 발생했습니다.');
  }
}

btnLogin.addEventListener('click', logIn);
btnShowSignup.addEventListener('click', toggleSignupMode);
