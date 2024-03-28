import { validateLogin } from "../assets/js/validate-login.js";
import { createSidebar } from "../components/sidebar.js";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { showSuccessToast } from "../assets/js/toast.js";
import { saveNumberStringAsNumber } from "../assets/js/save-number-string-as-number.js";
import { formatNumberToBRLCurrency } from "../assets/js/format-number-to-brl-currency.js";
import { db } from "../assets/js/firebase-module.js";
import { numberMaskInput } from "../assets/js/number-mask-input.js";
import { getUserId } from "../assets/js/session-controller.js";
import { showNumberAsBrlNumber } from "../assets/js/show-number-as-brl-number.js";

validateLogin();

const selectRevenues = document.getElementById("selectRevenues");
const finalSalePrice = document.getElementById("finalSalePrice");
const formRegisterNewSale = document.getElementById("formRegisterNewSale");
const btRegisterSale = document.getElementById("btRegisterSale");
const drawerRegisterSale = document.getElementById("drawerRegisterSale");
const closeButton = document.getElementById("closeButton");
const glass = document.getElementById("glass");
const drawerHeader = document.getElementById("drawerHeader");
const btCancel = document.getElementById("btCancel");
const addRevenueButton = document.getElementById("addRevenueButton");
const loader = document.getElementById("loader");
const descartRevenueButton = document.getElementById("descartRevenueButton");
const tableRevenues = document.getElementById("tableRevenues");
const logoutButton = document.getElementById("logoutButton").parentElement;
const formAddRevenueToSale = document.getElementById("formAddRevenueToSale");
const quantity = document.getElementById("quantity");
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

const getTrashButton = (saleId) => {
  const trashSvg = feather.icons["trash-2"].toSvg({
    id: `deleteSale-${saleId}`,
  });
  const parser = new DOMParser();
  return parser.parseFromString(trashSvg, "image/svg+xml").querySelector("svg");
};

const getSaleDescription = (sale) => {
  let description = "";

  sale.revenues.forEach((revenue) => {
    description += `${showNumberAsBrlNumber(revenue.quantity)}x ${
      revenue.description
    }, `;
  });

  description = description.slice(0, -2);

  return description;
};

const getProfit = (sale) => {
  let profit = 0;
  let totalRevenueCost = 0;

  sale.revenues.forEach((revenue) => {
    totalRevenueCost += revenue.revenueCost * revenue.quantity;
  });

  profit = sale.totalCost - totalRevenueCost;

  return profit;
};

glass.addEventListener("click", closeDrawer);

closeButton.addEventListener("click", closeDrawer);

btCancel.addEventListener("click", closeDrawer);

btRegisterSale.addEventListener("click", toggleDrawer);

quantity.addEventListener("input", (e) => {
  numberMaskInput(e);
});

logoutButton.addEventListener("click", () => {
  loader.style.display = "block";

  sessionLogout(() => {
    loader.style.display = "none";
  });
});

btRegisterSale.addEventListener("click", async () => {
  loader.style.display = "block";

  const ingredientsRef = collection(db, "revenues");
  const userId = getUserId();

  const q = query(ingredientsRef, where("userId", "==", userId));

  const querySnapshot = await getDocs(q);

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

selectRevenues.addEventListener("change", async (e) => {
  const revenueId = e.target.value;

  if (revenueId === "null") {
    formAddRevenueToSale.style.display = "none";
    return;
  }

  formAddRevenueToSale.style.display = "block";
});

formRegisterNewSale.addEventListener("submit", async (e) => {
  e.preventDefault();
  loader.style.display = "block";

  const date = new Date().toISOString().split("T")[0];

  const userId = getUserId();

  const sale = {
    revenues: addedRevenues,
    totalCost: salesCost,
    date,
    userId,
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

descartRevenueButton.addEventListener("click", () => {
  const selectRevenues = document.getElementById("selectRevenues");
  const quantity = document.getElementById("quantity");

  selectRevenues.value = "null";
  quantity.value = "";

  formAddRevenueToSale.style.display = "none";
});

window.addEventListener("load", async () => {
  loader.style.display = "block";
  const today = new Date().toISOString().split("T")[0];

  const userId = getUserId();

  const q = query(
    collection(db, "sales"),
    where("date", "==", today),
    where("userId", "==", userId)
  );

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    loader.style.display = "none";
    noDataFound.style.display = "block";
    tableSales.style.display = "none";
    return;
  }

  querySnapshot.forEach((doc) => {
    const sale = doc.data();
    const row = tableSales.insertRow(-1);

    const trashButton = getTrashButton(doc.id);

    row.innerHTML = `
      <td>${getSaleDescription(sale)}</td>
      <td>${formatNumberToBRLCurrency(sale.totalCost)}</td>
      <td>${formatNumberToBRLCurrency(getProfit(sale))}</td>
      <td>
        <div class="action-buttons-group">
          <div class="btn-icon">
            ${trashButton.outerHTML}
          </div>
        </div>
      </td>
    `;
  });

  const allDeleteButtons = document.querySelectorAll("[id^='deleteSale-']");

  allDeleteButtons.forEach((button) => {
    const saleId = button.id.split("-")[1];
    button.parentNode.addEventListener("click", () => {
      deleteSale(saleId);
    });
  });

  loader.style.display = "none";
});

window.addEventListener("load", async () => {
  const createdSidebar = await createSidebar("pos");
  sidebar.appendChild(createdSidebar);
});
