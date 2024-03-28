import {
  getDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { db } from "../assets/js/firebase-module.js";
import { sessionGetUser } from "../assets/js/session-controller.js";

export const createSidebar = async (active) => {
  const pieChartSvg = feather.icons["pie-chart"].toSvg();
  const pieChartIcon = new DOMParser()
    .parseFromString(pieChartSvg, "image/svg+xml")
    .querySelector("svg");

  const dollarSignSvg = feather.icons["dollar-sign"].toSvg();
  const dollarSignIcon = new DOMParser()
    .parseFromString(dollarSignSvg, "image/svg+xml")
    .querySelector("svg");

  const fileTextSvg = feather.icons["file-text"].toSvg();
  const fileTextIcon = new DOMParser()
    .parseFromString(fileTextSvg, "image/svg+xml")
    .querySelector("svg");

  const packageSvg = feather.icons["package"].toSvg();
  const packageIcon = new DOMParser()
    .parseFromString(packageSvg, "image/svg+xml")
    .querySelector("svg");

  const dropletSvg = feather.icons["droplet"].toSvg();
  const dropletIcon = new DOMParser()
    .parseFromString(dropletSvg, "image/svg+xml")
    .querySelector("svg");

  const { pathname } = window.location;

  const { uid } = sessionGetUser();
  const userRef = doc(db, "users", uid);

  const userData = (await getDoc(userRef)).data();

  const sidebar = document.createElement("aside");
  sidebar.innerHTML = `
    <div class="sidebar-header">
      <h2>CaaS</h2>
    </div>
    <div class="sidebar-item ${
      active === "management" ? "sidebar-item-active" : ""
    }" id="managementItem">
      ${pieChartIcon.outerHTML}
      <p>
        Gestão
      </p>
    </div>
    <div class="sidebar-item ${
      active === "pos" ? "sidebar-item-active" : ""
    }" id="posItem">
      ${dollarSignIcon.outerHTML}
      <p>
        Caixa
      </p>
    </div>
    <div class="sidebar-item ${
      active === "revenues" ? "sidebar-item-active" : ""
    }" id="revenuesItem">
      ${fileTextIcon.outerHTML}
      <p>
        Receitas
      </p>
    </div>
    <div class="sidebar-item ${
      active === "ingredients" ? "sidebar-item-active" : ""
    }" id="ingredientsItem">
      ${dropletIcon.outerHTML}
      <p>
        Ingredientes
      </p>
    </div>
    <div class="sidebar-item ${
      active === "equipaments" ? "sidebar-item-active" : ""
    }" id="equipamentsItem">
      ${packageIcon.outerHTML}
      <p>
        Equipamentos
      </p>
    </div>
    <div class="sidebar-footer">
      <div class="user" id="userProfileInfo">
        <img
          src="${userData.avatar || "../assets/img/avatar-placeholder.svg"}"
          alt="user"
        />
        <div class="user-info">
          <p>Olá, ${userData.name.split(" ")[0]}</p>
          <span>${userData.bakeryName}</span>
        </div>
      </div>
    </div>
  `;
  sidebar.classList.add("dashboard-side-menu");

  const managementItem = sidebar.querySelector("#managementItem");
  const posItem = sidebar.querySelector("#posItem");
  const revenuesItem = sidebar.querySelector("#revenuesItem");
  const ingredientsItem = sidebar.querySelector("#ingredientsItem");
  const equipamentsItem = sidebar.querySelector("#equipamentsItem");
  const userProfileInfo = sidebar.querySelector("#userProfileInfo");

  managementItem.addEventListener("click", () => {
    window.location.href = `${
      pathname.search("/frontend-projeto-fatec-pti") === 0
        ? "/frontend-projeto-fatec-pti/gestao"
        : "/gestao"
    }`;
  });

  posItem.addEventListener("click", () => {
    window.location.href = `${
      pathname.search("/frontend-projeto-fatec-pti") === 0
        ? "/frontend-projeto-fatec-pti/caixa"
        : "/caixa"
    }`;
  });

  revenuesItem.addEventListener("click", () => {
    window.location.href = `${
      pathname.search("/frontend-projeto-fatec-pti") === 0
        ? "/frontend-projeto-fatec-pti/receitas"
        : "/receitas"
    }`;
  });

  ingredientsItem.addEventListener("click", () => {
    window.location.href = `${
      pathname.search("/frontend-projeto-fatec-pti") === 0
        ? "/frontend-projeto-fatec-pti/ingredientes"
        : "/ingredientes"
    }`;
  });

  equipamentsItem.addEventListener("click", () => {
    window.location.href = `${
      pathname.search("/frontend-projeto-fatec-pti") === 0
        ? "/frontend-projeto-fatec-pti/equipamentos"
        : "/equipamentos"
    }`;
  });

  userProfileInfo.addEventListener("click", () => {
    window.location.href = `${
      pathname.search("/frontend-projeto-fatec-pti") === 0
        ? "/frontend-projeto-fatec-pti/editar-perfil"
        : "/editar-perfil"
    }`;
  });

  return sidebar;
};
