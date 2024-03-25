import { db } from "../assets/js/firebase-module.js";
import { formatNumberToBRLCurrency } from "../assets/js/format-number-to-brl-currency.js";
import { numberMaskInput } from "../assets/js/number-mask-input.js";
import { saveNumberStringAsNumber } from "../assets/js/save-number-string-as-number.js";
import { sessionLogout } from "../assets/js/session-controller.js";
import { showSuccessToast } from "../assets/js/toast.js";
import { validateLogin } from "../assets/js/validate-login.js";
import { createSidebar } from "../components/sidebar.js";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

validateLogin();

const loader = document.getElementById("loader");
const selectRevenues = document.getElementById("selectRevenues");
const btRegisterSale = document.getElementById("btRegisterSale");
const descartRevenueButton = document.getElementById("descartRevenueButton");
const addRevenueButton = document.getElementById("addRevenueButton");
const tableRevenues = document.getElementById("tableRevenues");
const finalSalePrice = document.getElementById("finalSalePrice");
const formRegisterNewSale = document.getElementById("formRegisterNewSale");
const quantity = document.getElementById("quantity");
const drawerRegisterSale = document.getElementById("drawerRegisterSale");
const closeButton = document.getElementById("closeButton");
const glass = document.getElementById("glass");
const drawerHeader = document.getElementById("drawerHeader");
const btCancel = document.getElementById("btCancel");
const btGoToSalesHistory = document.getElementById("btGoToSalesHistory");
const logoutButton = document.getElementById("logoutButton").parentElement;
const formAddRevenueToSale = document.getElementById("formAddRevenueToSale");
let addedRevenues = [];
let salesCost = 0;

const getTrashRevenueButton = (revenueId) => {
  const trashSvg = feather.icons["trash-2"].toSvg({
    id: `deleteRevenue-${revenueId}`,
  });
  const parser = new DOMParser();
  return parser.parseFromString(trashSvg, "image/svg+xml").querySelector("svg");
};

const deleteRevenue = (revenueId) => {
  const revenueIndex = addedRevenues.findIndex(
    (revenue) => revenue.id === revenueId
  );
  const revenue = addedRevenues[revenueIndex];

  const revenueCost = revenue.salePrice * revenue.quantity;
  salesCost -= revenueCost;
  finalSalePrice.innerText = salesCost.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });

  addedRevenues.splice(revenueIndex, 1);
  const revenueRow = document.getElementById(`revenueRow-${revenueId}`);
  revenueRow.remove();
};

const toggleDrawer = () => {
  drawerRegisterSale.classList.toggle("drawer-close");
  drawerRegisterSale.classList.toggle("drawer-open");
  glass.classList.toggle("glass-close");
  glass.classList.toggle("glass-open");
};

const closeDrawer = () => {
  drawerHeader.innerText = "Registrar venda 💸";

  selectRevenues.value = "null";
  selectRevenues.innerHTML = "<option value='null'>Selecione</option>";
  quantity.value = "";
  tableRevenues.innerHTML = `
    <tr>
      <th>Qtd.</th>
      <th>Descrição</th>
      <th>Preço</th>
      <th>Ação</th>
    </tr>
  `;
  addedRevenues = [];
  salesCost = 0;
  finalSalePrice.innerText = "R$ 0,00";
  formAddRevenueToSale.style.display = "none";

  toggleDrawer();
};

btGoToSalesHistory.addEventListener("click", () => {
  const { pathname } = window.location;
  window.location.href = `${pathname.search("/frontend-projeto-fatec-pti") === 0 ? "/frontend-projeto-fatec-pti/historico-das-vendas" : "/historico-das-vendas"}`;
});

btRegisterSale.addEventListener("click", toggleDrawer);

glass.addEventListener("click", closeDrawer);

closeButton.addEventListener("click", closeDrawer);

btCancel.addEventListener("click", closeDrawer);

quantity.addEventListener("input", (e) => {
  numberMaskInput(e);
});

logoutButton.addEventListener("click", () => {
  loader.style.display = "block";

  sessionLogout(() => {
    loader.style.display = "none";
  });
});

formRegisterNewSale.addEventListener("submit", async (e) => {
  e.preventDefault();
  loader.style.display = "block";

  const date = new Date().toISOString().split("T")[0];

  const sale = {
    revenues: addedRevenues,
    totalCost: salesCost,
    date,
  };

  addDoc(collection(db, "sales"), sale)
    .then(() => {
      loader.style.display = "none";

      showSuccessToast("Venda registrada com sucesso!");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    })
    .catch((error) => {
      loader.style.display = "none";

      console.error(error);
      showDangerToast(
        "Erro ao registrar uma venda. Tente novamente mais tarde."
      );
    });
});

selectRevenues.addEventListener("change", async (e) => {
  const revenueId = e.target.value;

  if (revenueId === "null") {
    formAddRevenueToSale.style.display = "none";
    return;
  }

  formAddRevenueToSale.style.display = "block";
});

btRegisterSale.addEventListener("click", async () => {
  loader.style.display = "block";
  const querySnapshot = await getDocs(collection(db, "revenues"));

  if (querySnapshot.empty) {
    loader.style.display = "none";
    return;
  }

  querySnapshot.forEach((doc) => {
    const revenue = doc.data();

    const newRevenueOption = document.createElement("option");
    newRevenueOption.text = revenue.description;
    newRevenueOption.value = doc.id;

    selectRevenues.appendChild(newRevenueOption);
  });

  finalSalePrice.innerText = salesCost.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });

  loader.style.display = "none";
});

descartRevenueButton.addEventListener("click", () => {
  const selectRevenues = document.getElementById("selectRevenues");
  const quantity = document.getElementById("quantity");

  selectRevenues.value = "null";
  quantity.value = "";

  formAddRevenueToSale.style.display = "none";
});

window.addEventListener("load", async () => {
  const createdSidebar = await createSidebar("dashboard");
  sidebar.appendChild(createdSidebar);
});

addRevenueButton.addEventListener("click", async () => {
  const quantity = document.getElementById("quantity");

  if (quantity.value === "") {
    alert("Por favor, o campo quantidade deve ser preenchido.");
    return;
  }

  const selectRevenues = document.getElementById("selectRevenues");

  const revenueId = selectRevenues.value;
  const revenue = await getDoc(doc(db, "revenues", revenueId));
  const revenueData = revenue.data();

  addedRevenues.push({
    ...revenueData,
    quantity: saveNumberStringAsNumber(quantity.value),
    id: revenueId,
  });

  const newRevenueRow = document.createElement("tr");
  newRevenueRow.id = `revenueRow-${revenueId}`;
  newRevenueRow.innerHTML = `
    <td>${quantity.value}</td>
    <td>${revenueData.description}</td>
    <td>${formatNumberToBRLCurrency(revenueData.salePrice)}</td>
    <td>
      <div class="btn-icon">
        ${getTrashRevenueButton(revenueId).outerHTML}
      </div>
    </td>
  `;

  tableRevenues.appendChild(newRevenueRow);

  const allDeleteButtons = document.querySelectorAll("[id^='deleteRevenue-']");

  allDeleteButtons.forEach((button) => {
    const revenueId = button.id.split("-")[1];
    button.parentNode.addEventListener("click", () => {
      deleteRevenue(revenueId);
    });
  });

  const revenueCost =
    revenueData.salePrice * saveNumberStringAsNumber(quantity.value);
  salesCost += revenueCost;
  finalSalePrice.innerText = salesCost.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });

  selectRevenues.value = "null";
  quantity.value = "";
  formAddRevenueToSale.style.display = "none";
});
