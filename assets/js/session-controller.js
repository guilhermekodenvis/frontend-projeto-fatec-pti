import { showSuccessToast, showWarningToast } from "./toast.js";
import {
  getAuth,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const { pathname } = window.location;

export const sessionLogin = (user) => {
  sessionStorage.setItem("CaaS@user", JSON.stringify(user));
  showSuccessToast("Bem-vindo de volta!");
  setTimeout(() => {
    window.location.href = `${
      pathname.search("/frontend-projeto-fatec-pti") === 0
        ? "/frontend-projeto-fatec-pti/gestao"
        : "/gestao"
    }`;
  }, 2000);
};

export const sessionLogout = (stopLoader, logoutMessage) => {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      sessionStorage.removeItem("CaaS@user");
      showWarningToast(logoutMessage || "Até mais! Volte sempre.");
      setTimeout(() => {
        window.location.href = `${
          pathname.search("/frontend-projeto-fatec-pti") === 0
            ? "/frontend-projeto-fatec-pti/"
            : "/"
        }`;
      }, 2000);
      stopLoader();
    })
    .catch((error) => {
      stopLoader();
      console.error(error);
      showDangerToast("Erro ao deslogar. Tente novamente mais tarde.");
    });
};

export const sessionGetUser = () => {
  return JSON.parse(sessionStorage.getItem("CaaS@user"));
};

export const getUserId = () => {
  const user = sessionGetUser();
  return user ? user.uid : null;
};
