import { sessionLogout } from "../assets/js/session-controller.js";
import { validateLogin } from "../assets/js/validate-login.js";
import { createSidebar } from "../components/sidebar.js";

validateLogin();

const loader = document.getElementById("loader");

const btGoToSalesHistory = document.getElementById("btGoToSalesHistory");
const logoutButton = document.getElementById("logoutButton").parentElement;

btGoToSalesHistory.addEventListener("click", () => {
  const { pathname } = window.location;
  window.location.href = `${
    pathname.search("/frontend-projeto-fatec-pti") === 0
      ? "/frontend-projeto-fatec-pti/historico-das-vendas"
      : "/historico-das-vendas"
  }`;
});

logoutButton.addEventListener("click", () => {
  loader.style.display = "block";

  sessionLogout(() => {
    loader.style.display = "none";
  });
});

window.addEventListener("load", async () => {
  const createdSidebar = await createSidebar("management");
  sidebar.appendChild(createdSidebar);
});
