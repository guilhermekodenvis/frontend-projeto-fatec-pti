const btNewRevenue = document.getElementById("btNewRevenue");
const drawerNewRevenue = document.getElementById("drawerNewRevenue");
const closeButton = document.getElementById("closeButton");
const glass = document.getElementById("glass");
const drawerHeader = document.getElementById("drawerHeader");
const btCancel = document.getElementById("btCancel");
const descartIngredientButton = document.getElementById(
  "descartIngredientButton"
);
const descartEquipamentButton = document.getElementById(
  "descartEquipamentButton"
);
const totalCost = document.getElementById("totalCost");
const suggestedPrice = document.getElementById("suggestedPrice");

const toggleDrawer = () => {
  totalCost.innerText = (0).toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });
  suggestedPrice.innerText = (0).toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });
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

descartIngredientButton.addEventListener("click", () => {
  const formAddIngredientToRevenue = document.getElementById(
    "formAddIngredientToRevenue"
  );
  const selectIngredients = document.getElementById("selectIngredients");
  const quantity = document.getElementById("quantity");
  const quantityMeasurementUnity = document.getElementById(
    "quantityMeasurementUnity"
  );

  selectIngredients.value = "null";
  quantity.value = "";
  quantityMeasurementUnity.innerText = "";

  formAddIngredientToRevenue.style.display = "none";
});

descartEquipamentButton.addEventListener("click", () => {
  const formAddEquipamentToRevenue = document.getElementById(
    "formAddEquipamentToRevenue"
  );
  const selectEquipaments = document.getElementById("selectEquipaments");
  const minutes = document.getElementById("minutes");

  selectEquipaments.value = "null";
  minutes.value = "";

  formAddEquipamentToRevenue.style.display = "none";
});
