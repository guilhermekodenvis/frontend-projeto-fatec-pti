import { createSidebar } from "../components/sidebar.js";

window.addEventListener("load", () => {
  const createdSidebar = createSidebar();
  sidebar.appendChild(createdSidebar);
});
