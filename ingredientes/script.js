const btAddIngredient = document.getElementById("btAddIngredient");
const drawerIngredient = document.getElementById("drawerIngredient");
const glass = document.getElementById("glass");
const closeButton = document.getElementById("closeButton");
const drawerHeader = document.getElementById("drawerHeader");
const btCancel = document.getElementById("btCancel");

const toggleDrawer = () => {
  drawerIngredient.classList.toggle("drawer-close");
  drawerIngredient.classList.toggle("drawer-open");
  glass.classList.toggle("glass-close");
  glass.classList.toggle("glass-open");
};

const closeDrawer = () => {
  const ingredientEditingId = document.getElementById("ingredientEditingId");
  const description = document.getElementById("description");
  const measurementUnity = document.getElementById("measurementUnity");
  const price = document.getElementById("price");
  const quantityInItem = document.getElementById("quantityInItem");

  ingredientEditingId.value = "";
  description.value = "";
  measurementUnity.value = "null";
  price.value = "";
  quantityInItem.value = "";
  drawerHeader.innerText = "Novo ingrediente 🍫";

  toggleDrawer();
};

btAddIngredient.addEventListener("click", toggleDrawer);

glass.addEventListener("click", closeDrawer);

closeButton.addEventListener("click", closeDrawer);

btCancel.addEventListener("click", closeDrawer);
