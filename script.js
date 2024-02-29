const btLogin = document.getElementById("btLogin");
const btCreateNewAccount = document.getElementById("btCreateNewAccount");

btLogin.addEventListener("click", () => {
  window.location.href = "login"
})

btCreateNewAccount.addEventListener("click", () => {
  window.location.href = "criar-nova-conta"
})