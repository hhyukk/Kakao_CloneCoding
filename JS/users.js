const loginForm = document.querySelector("#login-form");
const loginFormSignUpButton = document.querySelector(
  "#login-form input:nth-child(4)"
);
const loginFormLogInButton = document.querySelector(
  "#login-form input:nth-child(3)"
);
const loginFormId = document.querySelector("#login-form input:first-child");
const loginFormPassword = document.querySelector(
  "#login-form input:nth-child(2)"
);

function checkUserInformation(event) {
  if (localStorage.getItem(loginFormId.value) == null) {
    if (loginFormId.value === "") {
      alert("아이디를 확인해주세요");
    } else if (loginFormPassword.value === "") {
      alert("비밀번호를 확인해주세요.");
    } else {
      localStorage.setItem(loginFormId.value, loginFormPassword.value);
      alert("회원가입이 완료되었습니다.");
    }
  } else {
    alert("이미 있는 아이디입니다.");
  }
}

loginFormSignUpButton.addEventListener("click", checkUserInformation);

function logIn(event) {
  // event.preventDefault();
  if (localStorage.getItem(loginFormId.value) !== loginFormPassword.value) {
    alert("아이디 혹은 비밀번호가 다릅니다.");
  } else {
    loginForm.action = "friends.html";
    loginFormLogInButton.addEventListener("submit");
  }
}
loginFormLogInButton.addEventListener("click", logIn);
