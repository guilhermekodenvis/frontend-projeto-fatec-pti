import { formatNumberToBRLCurrency } from "../assets/js/format-number-to-brl-currency.js";
import { sessionLogout } from "../assets/js/session-controller.js";
import { showDangerToast } from "../assets/js/toast.js";
import { validateLogin } from "../assets/js/validate-login.js";
import { createSidebar } from "../components/sidebar.js";
import { db } from "./../assets/js/firebase-module.js";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  where,
  query,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

validateLogin();

const tableSales = document.getElementById("tableSales");
const loader = document.getElementById("loader");
const noDataFound = document.getElementById("noDataFound");
const dateFilter = document.getElementById("dateFilter");
const logoutButton = document.getElementById("logoutButton").parentElement;

const getSaleDescription = (sale) => {
  let description = "";

  sale.revenues.forEach((revenue) => {
    description += `${revenue.quantity}x ${revenue.description}, `;
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

const getTrashButton = (saleId) => {
  const trashSvg = feather.icons["trash-2"].toSvg({
    id: `deleteSale-${saleId}`,
  });
  const parser = new DOMParser();
  return parser.parseFromString(trashSvg, "image/svg+xml").querySelector("svg");
};

const deleteSale = (saleId) => {
  loader.style.display = "block";
  deleteDoc(doc(db, "sales", saleId))
    .then(() => {
      loader.style.display = "none";
      showDangerToast("Venda deletada com sucesso!");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    })
    .catch((error) => {
      loader.style.display = "none";
      console.error(error);
      showDangerToast("Erro ao deletar a venda. Tente novamente mais tarde.");
    });
};

const getSaleRows = (querySnapshot) => {
  tableSales.innerHTML = `
    <tr>
      <th>Descrição</th>
      <th>Valor cobrado</th>
      <th>Lucro</th>
      <th>Ações</th>
    </tr>
  `;

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
};

logoutButton.addEventListener("click", () => {
  loader.style.display = "block";

  sessionLogout(() => {
    loader.style.display = "none";
  });
});

dateFilter.addEventListener("change", async (e) => {
  loader.style.display = "block";

  const selectedDate = e.target.value;

  const q = query(collection(db, "sales"), where("date", "==", selectedDate));

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    loader.style.display = "none";
    noDataFound.style.display = "block";
    tableSales.style.display = "none";
    return;
  }

  noDataFound.style.display = "none";
  tableSales.style.display = "table";

  getSaleRows(querySnapshot);
});

window.addEventListener("load", async function () {
  loader.style.display = "block";
  const today = new Date().toISOString().split("T")[0];

  const q = query(collection(db, "sales"), where("date", "==", today));

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    loader.style.display = "none";
    noDataFound.style.display = "block";
    tableSales.style.display = "none";
    return;
  }

  getSaleRows(querySnapshot);
});

window.addEventListener("load", async () => {
  const createdSidebar = await createSidebar("dashboard");
  sidebar.appendChild(createdSidebar);
});

window.addEventListener("load", () => {
  const today = new Date().toISOString().split("T")[0];
  dateFilter.value = today;
});
