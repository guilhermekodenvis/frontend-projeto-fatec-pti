import {
  getAuth,
  sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { showDangerToast, showSuccessToast } from "../assets/js/toast.js";
import { validateLogin } from "../assets/js/validate-login.js";

validateLogin();

const formForgotPassword = document.getElementById("formForgotPassword");
const loader = document.getElementById("loader");

formForgotPassword.addEventListener("submit", async (event) => {
  event.preventDefault();

  loader.style.display = "block";

  const email = formForgotPassword.email.value;

  const auth = getAuth();
  sendPasswordResetEmail(auth, email)
    .then(() => {
      loader.style.display = "none";
      showSuccessToast(
        "Email de recuperação de senha enviado com sucesso. Verifique sua caixa de entrada."
      );
      formForgotPassword.email.value = "";
    })
    .catch((error) => {
      loader.style.display = "none";
      console.error(error);
      showDangerToast(
        "Ocorreu um erro ao enviar o email de recuperação de senha. Verifique se o email está correto e tente novamente."
      );
    });
});
