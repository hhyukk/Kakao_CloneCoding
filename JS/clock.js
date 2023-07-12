const clock = document.querySelector(".status-bar__column:nth-child(2) span");

function getClock() {
  const time = new Date();
  clock.innerText = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
}

getClock();
setInterval(getClock, 1000);
