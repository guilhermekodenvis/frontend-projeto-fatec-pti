const btLogin = document.getElementById("btLogin");
const btCreateNewAccount = document.getElementById("btCreateNewAccount");
const { pathname } = window.location;

btLogin.addEventListener("click", () => {
  window.location.href = `${pathname.search("/frontend-projeto-fatec-pti") === 0 ? "/frontend-projeto-fatec-pti/login" : "/login"}`;
});

btCreateNewAccount.addEventListener("click", () => {
  window.location.href = `${pathname.search("/frontend-projeto-fatec-pti") === 0 ? "/frontend-projeto-fatec-pti/criar-nova-conta" : "/criar-nova-conta"}`;
});
