import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { sessionLogin } from "./../assets/js/session-controller.js";
import { showDangerToast } from "../assets/js/toast.js";
import { validateLogin } from "../assets/js/validate-login.js";

validateLogin();

const formLogin = document.getElementById("formLogin");

formLogin.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = e.target.elements.email.value;
  const password = e.target.elements.password.value;

  const loader = document.getElementById("loader");
  loader.style.display = "block";

  const auth = getAuth();
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      sessionLogin(user);
      loader.style.display = "none";
    })
    .catch((error) => {
      console.error(error);
      showDangerToast(
        "Ocorreu um erro ao autenticar. Verifique suas credenciais e tente novamente."
      );
      loader.style.display = "none";
    });
});
