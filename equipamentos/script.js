const btAddEquipament = document.getElementById("btAddEquipament");
const drawerAddEquipament = document.getElementById("drawerAddEquipament");
const closeButton = document.getElementById("closeButton");
const glass = document.getElementById("glass");
const drawerHeader = document.getElementById("drawerHeader");
const btCancel = document.getElementById("btCancel");

const toggleDrawer = () => {
  drawerAddEquipament.classList.toggle("drawer-close");
  drawerAddEquipament.classList.toggle("drawer-open");
  glass.classList.toggle("glass-close");
  glass.classList.toggle("glass-open");
};

const closeDrawer = () => {
  const equipamentEditingId = document.getElementById("equipamentEditingId");
  const description = document.getElementById("description");
  const resourceUsed = document.getElementById("resourceUsed");

  equipamentEditingId.value = "";
  description.value = "";
  resourceUsed.value = "null";
  drawerHeader.innerText = "Novo equipamento🍴";

  toggleDrawer();
};

btAddEquipament.addEventListener("click", toggleDrawer);

glass.addEventListener("click", closeDrawer);

closeButton.addEventListener("click", closeDrawer);

btCancel.addEventListener("click", closeDrawer);
