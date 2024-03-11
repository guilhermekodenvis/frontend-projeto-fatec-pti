import { db } from "../assets/js/firebase-module.js";
import { formatNumberToBRLCurrency } from "../assets/js/format-number-to-brl-currency.js";
import { showSuccessToast } from "../assets/js/toast.js";
import { createSidebar } from "../components/sidebar.js";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const loader = document.getElementById("loader");
const selectRevenues = document.getElementById("selectRevenues");
const btRegisterSale = document.getElementById("btRegisterSale");
const descartRevenueButton = document.getElementById("descartRevenueButton");
const addRevenueButton = document.getElementById("addRevenueButton");
const tableRevenues = document.getElementById("tableRevenues");
const finalSalePrice = document.getElementById("finalSalePrice");
const formRegisterNewSale = document.getElementById("formRegisterNewSale");
const addedRevenues = [];
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
  const formAddRevenueToSale = document.getElementById("formAddRevenueToSale");

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
  const formAddRevenueToSale = document.getElementById("formAddRevenueToSale");
  const selectRevenues = document.getElementById("selectRevenues");
  const quantity = document.getElementById("quantity");

  selectRevenues.value = "null";
  quantity.value = "";

  formAddRevenueToSale.style.display = "none";
});

window.addEventListener("load", () => {
  const createdSidebar = createSidebar();
  sidebar.appendChild(createdSidebar);
});

addRevenueButton.addEventListener("click", async () => {
  const quantity = document.getElementById("quantity");

  if (quantity.value === "") {
    alert("Por favor, o campo quantidade deve ser preenchido.");
    return;
  }

  const formAddRevenueToSale = document.getElementById("formAddRevenueToSale");
  const selectRevenues = document.getElementById("selectRevenues");

  const revenueId = selectRevenues.value;
  const revenue = await getDoc(doc(db, "revenues", revenueId));
  const revenueData = revenue.data();

  addedRevenues.push({
    ...revenueData,
    quantity: quantity.value,
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

  const revenueCost = revenueData.salePrice * quantity.value;
  salesCost += revenueCost;
  finalSalePrice.innerText = salesCost.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });

  selectRevenues.value = "null";
  quantity.value = "";
  formAddRevenueToSale.style.display = "none";
});
