export const createSidebar = () => {
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

  const sidebar = document.createElement("aside");
  sidebar.innerHTML = `
    <div class="sidebar-header">
    </div>
    <div class="sidebar-item" id="dashboardItem">
      ${homeIcon.outerHTML}
      <p>
        Dashboard
      </p>
    </div>
    <div class="sidebar-item" id="revenuesItem">
      ${fileTextIcon.outerHTML}
      <p>
        Receitas
      </p>
    </div>
    <div class="sidebar-item" id="ingredientsItem">
      ${tabelIcon.outerHTML}
      <p>
        Ingredientes
      </p>
    </div>
    <div class="sidebar-item" id="equipamentsItem">
      ${airPlayIcon.outerHTML}
      <p>
        Equipamentos
      </p>
    </div>
  `;
  sidebar.classList.add("dashboard-side-menu");

  const dashboardItem = sidebar.querySelector("#dashboardItem");
  const revenuesItem = sidebar.querySelector("#revenuesItem");
  const ingredientsItem = sidebar.querySelector("#ingredientsItem");
  const equipamentsItem = sidebar.querySelector("#equipamentsItem");

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

  return sidebar;
};
