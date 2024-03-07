const btNewRevenue = document.getElementById("btNewRevenue");
const drawerNewRevenue = document.getElementById("drawerNewRevenue");
const closeButton = document.getElementById("closeButton");
const glass = document.getElementById("glass");
const drawerHeader = document.getElementById("drawerHeader");
const btCancel = document.getElementById("btCancel");

const toggleDrawer = () => {
  drawerNewRevenue.classList.toggle("drawer-close");
  drawerNewRevenue.classList.toggle("drawer-open");
  glass.classList.toggle("glass-close");
  glass.classList.toggle("glass-open");
};

const closeDrawer = () => {
  // const ingredientEditingId = document.getElementById("ingredientEditingId");
  // const description = document.getElementById("description");
  // const measurementUnity = document.getElementById("measurementUnity");
  // const price = document.getElementById("price");
  // const quantityInItem = document.getElementById("quantityInItem");

  // ingredientEditingId.value = "";
  // description.value = "";
  // measurementUnity.value = "null";
  // price.value = "";
  // quantityInItem.value = "";
  drawerHeader.innerText = "Registrar venda 💸";

  toggleDrawer();
};

btNewRevenue.addEventListener("click", toggleDrawer);

glass.addEventListener("click", closeDrawer);

closeButton.addEventListener("click", closeDrawer);

btCancel.addEventListener("click", closeDrawer);
