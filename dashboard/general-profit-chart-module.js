import { db } from "../assets/js/firebase-module.js";
import {
  collection,
  getDocs,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { formatNumberToBRLCurrency } from "../assets/js/format-number-to-brl-currency.js";

const loader = document.getElementById("loader");

const convertDateToShow = (data) => {
  const [year, month] = data.split("-");
  const months = [
    "jan",
    "fev",
    "mar",
    "abr",
    "mai",
    "jun",
    "jul",
    "ago",
    "set",
    "out",
    "nov",
    "dez",
  ];
  const monthName = months[parseInt(month) - 1];
  return `${monthName}/${year}`;
};

const getRevenueSaleProfit = ({ revenueCost, salePrice, quantity }) => {
  return (salePrice - revenueCost) * quantity;
};

window.addEventListener("load", async () => {
  loader.style.display = "block";
  const salesByMonth = {};
  const profitsByMonth = {};

  const today = new Date();
  const sixMonthsAgo = new Date(today);
  sixMonthsAgo.setMonth(today.getMonth() - 6);

  const sixMonthsAgoString = sixMonthsAgo.toISOString().slice(0, 10);

  const q = query(
    collection(db, "sales"),
    where("date", ">=", sixMonthsAgoString)
  );

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    loader.style.display = "none";
    generalProfitChart.style.display = "none";
    return;
  }

  querySnapshot.forEach((doc) => {
    const sale = doc.data();
    const { revenues } = sale;
    const saleProfit = revenues.reduce((acc, revenue) => {
      return acc + getRevenueSaleProfit(revenue);
    }, 0);

    const month = sale.date.slice(0, 7);

    if (salesByMonth[month]) {
      salesByMonth[month] += sale.totalCost;
    } else {
      salesByMonth[month] = sale.totalCost;
    }

    if (profitsByMonth[month]) {
      profitsByMonth[month] += saleProfit;
    } else {
      profitsByMonth[month] = saleProfit;
    }
  });

  const salesByMonthArray = Object.entries(salesByMonth).sort((a, b) =>
    a[0].localeCompare(b[0])
  );
  const profitsByMonthArray = Object.entries(profitsByMonth).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  const months = salesByMonthArray.map(([month]) => convertDateToShow(month));
  const salesByMonthData = salesByMonthArray.map(([, totalCost]) => totalCost);
  const profitsByMonthData = profitsByMonthArray.map(
    ([, totalProfit]) => totalProfit
  );

  const data = {
    labels: months,
    datasets: [
      {
        label: "Lucro total",
        data: profitsByMonthData,
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        cubicInterpolationMode: "monotone",
        tension: 0.4,
        fill: true,
        pointStyle: "circle",
        pointRadius: 4,
        pointHoverRadius: 8,
        pointBorderWidth: 2,
      },
      {
        label: "Total vendido",
        data: salesByMonthData,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        cubicInterpolationMode: "monotone",
        tension: 0.4,
        fill: true,
        pointStyle: "circle",
        pointRadius: 4,
        pointHoverRadius: 8,
        pointBorderWidth: 2,
      },
    ],
  };

  const config = {
    type: "line",
    data: data,
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
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.dataset.label;
              const value = context.parsed.y;
              return `${label}: ${formatNumberToBRLCurrency(value)}`;
            },
          },
        },
      },
    },
  };

  const generalProfitChart = document.getElementById("generalProfitChart");
  new Chart(generalProfitChart, config);

  loader.style.display = "none";
});
