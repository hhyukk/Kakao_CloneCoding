const myProfileImg = document.querySelector('#my-profile-img');
const myProfileName = document.querySelector('#my-profile-name');
const myProfileStatus = document.querySelector('#my-profile-status');

async function getMyProfile() {
  // localStorage에서 JWT 토큰 가져오기
  const token = localStorage.getItem('accessToken');

  // 로그인 안 되어 있으면 튕겨내기
  if (!token) {
    alert('로그인이 필요합니다.');
    window.location.href = 'index.html';
    return;
  }

  try {
    // 내 프로필 조회 API
    const response = await fetch('http://localhost:8080/api/v1/users/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      const data = await response.json();

      // 닉네임 변경
      if (myProfileName) {
        myProfileName.innerText = data.nickname;
      }

      // 상태 메시지 변경
      if (myProfileStatus) {
        if (data.statusMessage) {
          myProfileStatus.innerText = data.statusMessage;
          myProfileStatus.computedStyleMap.display = 'block'; // 상태메시지가 있으면 보여줌
        } else {
          myProfileStatus.computedStyleMap.display = 'none'; // 상태메시지 없으면 숨김
        }
      }

      // 프로필 이미지 변경
      if (myProfileImg) {
        if (data.profileImage) {
          myProfileImg.src = data.profileImage;
        } else {
          myProfileImg.src = './image/a.jpg'; // 기본 프로필 이미지 경로
        }
      }
    } else {
      // 에러 처리
      if (response.status === 301 || response.status === 403) {
        alert('인증이 만료되었습니다. 다시 로그인해주세요.');
        localStorage.clear(); // 만료된 토큰 삭제
        window.location.href = 'index.html'; // 로그인 창으로 이동
      } else {
        console.error('프로필 조회 실패: ', response.status);
      }
    }
  } catch (error) {
    console.error('네트워크 오류: ', error);
  }
}

getMyProfile();
