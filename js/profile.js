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
          myProfileImg.src = 'http://localhost:8080' + data.profileImage;
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

// 프로필 수정 API (multipart/form-data)
async function updateMyProfile({ statusMessage, profileImageFile }) {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    alert('로그인이 필요합니다.');
    window.location.href = 'index.html';
    return;
  }

  try {
    const formData = new FormData();
    if (statusMessage !== undefined) {
      formData.append('statusMessage', statusMessage);
    }
    if (profileImageFile) {
      formData.append('profileImage', profileImageFile);
    }

    const response = await fetch('http://localhost:8080/api/v1/users/me', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.ok) {
      alert('프로필이 수정되었습니다.');
      await getMyProfile();
    } else if (response.status === 301 || response.status === 403) {
      alert('인증이 만료되었습니다. 다시 로그인해주세요.');
      localStorage.clear();
      window.location.href = 'index.html';
    } else {
      const errorData = await response.json();
      alert(errorData.message || '프로필 수정에 실패했습니다.');
    }
  } catch (error) {
    console.error('네트워크 오류: ', error);
    alert('네트워크 오류가 발생했습니다.');
  }
}

// 프로필 수정 모달
const profileModal = document.querySelector('#profile-edit-modal');
const profileEditImage = document.querySelector('#profile-edit-image');
const profileEditStatus = document.querySelector('#profile-edit-status');
const profileEditImg = document.querySelector('#profile-edit-img');

function openProfileModal() {
  if (!profileModal) return;
  // 현재 값을 입력 필드에 채워넣기
  profileEditStatus.value = myProfileStatus ? myProfileStatus.innerText : '';
  profileEditImage.value = '';
  profileEditImg.src = myProfileImg ? myProfileImg.src : './image/a.jpg';
  profileModal.classList.add('profile-modal--open');
}

function closeProfileModal() {
  if (!profileModal) return;
  profileModal.classList.remove('profile-modal--open');
}

// 프로필 영역 클릭 시 모달 열기
const userComponent = document.querySelector('.user-component');
if (userComponent) {
  userComponent.style.cursor = 'pointer';
  userComponent.addEventListener('click', openProfileModal);
}

// 취소 버튼 / 오버레이 클릭 시 닫기
const modalClose = document.querySelector('#profile-modal-close');
const modalOverlay = document.querySelector('.profile-modal__overlay');
if (modalClose) modalClose.addEventListener('click', closeProfileModal);
if (modalOverlay) modalOverlay.addEventListener('click', closeProfileModal);

// 이미지 파일 선택 시 미리보기
if (profileEditImage) {
  profileEditImage.addEventListener('change', () => {
    const file = profileEditImage.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        profileEditImg.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });
}

// 저장 버튼 클릭
const modalSave = document.querySelector('#profile-modal-save');
if (modalSave) {
  modalSave.addEventListener('click', async () => {
    await updateMyProfile({
      statusMessage: profileEditStatus.value,
      profileImageFile: profileEditImage.files[0] || null,
    });
    closeProfileModal();
  });
}

getMyProfile();
