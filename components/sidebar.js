import {
  getDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { db } from "../assets/js/firebase-module.js";
import { sessionGetUser } from "../assets/js/session-controller.js";

export const createSidebar = async (active) => {
  const homeSvg = feather.icons["home"].toSvg();
  const homeIcon = new DOMParser()
    .parseFromString(homeSvg, "image/svg+xml")
    .querySelector("svg");
  const fileTextSvg = feather.icons["file-text"].toSvg();
  const fileTextIcon = new DOMParser()
    .parseFromString(fileTextSvg, "image/svg+xml")
    .querySelector("svg");
  const airPlaySvg = feather.icons["airplay"].toSvg();
  const airPlayIcon = new DOMParser()
    .parseFromString(airPlaySvg, "image/svg+xml")
    .querySelector("svg");
  const tableSvg = feather.icons["table"].toSvg();
  const tabelIcon = new DOMParser()
    .parseFromString(tableSvg, "image/svg+xml")
    .querySelector("svg");

  const { uid } = sessionGetUser();
  const userRef = doc(db, "users", uid);

  const userData = (await getDoc(userRef)).data();

  const sidebar = document.createElement("aside");
  sidebar.innerHTML = `
    <div class="sidebar-header">
      <h2>CaaS</h2>
    </div>
    <div class="sidebar-item ${
      active === "dashboard" ? "sidebar-item-active" : ""
    }" id="dashboardItem">
      ${homeIcon.outerHTML}
      <p>
        Dashboard
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
      ${tabelIcon.outerHTML}
      <p>
        Ingredientes
      </p>
    </div>
    <div class="sidebar-item ${
      active === "equipaments" ? "sidebar-item-active" : ""
    }" id="equipamentsItem">
      ${airPlayIcon.outerHTML}
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

  const dashboardItem = sidebar.querySelector("#dashboardItem");
  const revenuesItem = sidebar.querySelector("#revenuesItem");
  const ingredientsItem = sidebar.querySelector("#ingredientsItem");
  const equipamentsItem = sidebar.querySelector("#equipamentsItem");
  const userProfileInfo = sidebar.querySelector("#userProfileInfo");

  dashboardItem.addEventListener("click", () => {
    window.location.href = "/dashboard";
  });

  revenuesItem.addEventListener("click", () => {
    window.location.href = "/receitas";
  });

  ingredientsItem.addEventListener("click", () => {
    window.location.href = "/ingredientes";
  });

  equipamentsItem.addEventListener("click", () => {
    window.location.href = "/equipamentos";
  });

  userProfileInfo.addEventListener("click", () => {
    window.location.href = "/editar-perfil";
  });

  return sidebar;
};
