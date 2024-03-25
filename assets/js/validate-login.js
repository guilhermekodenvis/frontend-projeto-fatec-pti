import { sessionGetUser, sessionLogout } from "./session-controller.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

export const validateLogin = () => {
  const localUser = sessionGetUser();
  const { pathname } = window.location;

  if (pathname.search("/frontend-projeto-fatec-pti") === 0) {
    if (
      pathname === "/frontend-projeto-fatec-pti/" ||
      pathname === "/frontend-projeto-fatec-pti/login/" ||
      pathname === "/frontend-projeto-fatec-pti/criar-nova-conta/" ||
      pathname === "/frontend-projeto-fatec-pti/esqueci-minha-senha/"
    ) {
      if (localUser) {
        window.location.href = "/frontend-projeto-fatec-pti/dashboard";
      }
      return;
    }
  
    if (!localUser) {
      window.location.href = "/frontend-projeto-fatec-pti/";
    }
  } else {
    if (
      pathname === "/" ||
      pathname === "/login/" ||
      pathname === "/criar-nova-conta/" ||
      pathname === "/esqueci-minha-senha/"
    ) {
      if (localUser) {
        window.location.href = "/dashboard";
      }
      return;
    }
  
    if (!localUser) {
      window.location.href = "/";
    }
  }

  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      sessionLogout(() => {}, "Sua sessão expirou. Faça login novamente.");
    }
  });
};
