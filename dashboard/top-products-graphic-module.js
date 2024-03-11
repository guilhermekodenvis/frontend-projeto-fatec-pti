import { db } from "../assets/js/firebase-module.js";
import {
  collection,
  getDocs,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { formatNumberToBRLCurrency } from "../assets/js/format-number-to-brl-currency.js";

const loader = document.getElementById("loader");

window.addEventListener("load", async () => {
  loader.style.display = "block";

  const revenuesMap = {};

  const today = new Date();
  const ninetyDaysAgo = new Date(today);
  ninetyDaysAgo.setDate(today.getDate() - 90);
  const ninetyDaysAgoString = ninetyDaysAgo.toISOString().slice(0, 10);

  const q = query(
    collection(db, "sales"),
    where("date", ">=", ninetyDaysAgoString)
  );

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    loader.style.display = "none";
    topProductsChart.style.display = "none";
    return;
  }

  querySnapshot.forEach((doc) => {
    const sale = doc.data();

    sale.revenues.forEach(({ description, quantity }) => {
      if (revenuesMap[description]) {
        revenuesMap[description] += Number(quantity);
      } else {
        revenuesMap[description] = Number(quantity);
      }
    });
  });

  const revenuesArray = Object.entries(revenuesMap).sort((a, b) => b[1] - a[1]);

  const topFiveProducts = revenuesArray.slice(0, 5);

  const labels = topFiveProducts.map(([description]) => description);
  const data = topFiveProducts.map(([, quantity]) => quantity);

  const dataConfig = {
    labels,
    datasets: [
      {
        label: "Quantidade vendida",
        data,
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(153, 102, 255)",
        ],
      },
    ],
  };

  const config = {
    type: "pie",
    data: dataConfig,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
          align: "start",
          labels: {
            color: "#130132",
            font: {
              size: 16,
              family: "Poppins",
            },
          },
        },
        title: {
          display: false,
        },
      },
    },
  };

  const topProductsChart = document.getElementById("topProductsChart");

  new Chart(topProductsChart, config);

  loader.style.display = "none";
});
