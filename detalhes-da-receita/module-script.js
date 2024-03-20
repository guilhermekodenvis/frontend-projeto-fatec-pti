import { db } from "../assets/js/firebase-module.js";
import { showMesurementUnity } from "../assets/js/show-mesurement-unity.js";
import { formatNumberToBRLCurrency } from "../assets/js/format-number-to-brl-currency.js";
import { createSidebar } from "../components/sidebar.js";
import {
  getDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import {
  sessionGetUser,
  sessionLogout,
} from "../assets/js/session-controller.js";
import { validateLogin } from "../assets/js/validate-login.js";
import { showNumberAsBrlNumber } from "../assets/js/show-number-as-brl-number.js";

validateLogin();

const loader = document.getElementById("loader");
const revenueInfo = document.getElementById("revenueInfo");
const noDataFound = document.getElementById("noDataFound");
const description = document.getElementById("description");
const ingredients = document.getElementById("ingredients");
const equipaments = document.getElementById("equipaments");
const preparingMode = document.getElementById("preparingMode");
const revenueCost = document.getElementById("revenueCost");
const priceWithMargin = document.getElementById("priceWithMargin");
const salePrice = document.getElementById("salePrice");
const logoutButton = document.getElementById("logoutButton").parentElement;

logoutButton.addEventListener("click", () => {
  loader.style.display = "block";

  sessionLogout(() => {
    loader.style.display = "none";
  });
});

window.addEventListener("load", async () => {
  const createdSidebar = await createSidebar("revenues");
  sidebar.appendChild(createdSidebar);
});

window.addEventListener("load", async () => {
  loader.style.display = "block";
  const revenueId = window.location.href.split("/").pop().replace("?id=", "");

  const { uid } = sessionGetUser();
  const userRef = doc(db, "users", uid);

  const { bakeryName } = (await getDoc(userRef)).data();

  const bakeryNameElement = document.getElementById("bakeryName");
  bakeryNameElement.innerHTML = bakeryName;

  const revenueRef = doc(db, "revenues", revenueId);
  const querySnapshot = await getDoc(revenueRef);

  if (!querySnapshot.exists()) {
    loader.style.display = "none";
    noDataFound.style.display = "block";
    revenueInfo.style.display = "none";
    return;
  }

  const revenueData = querySnapshot.data();

  description.innerHTML = revenueData.description;

  const ulIngredients = document.createElement("ul");

  revenueData.ingredients.forEach((ingredient, index) => {
    const li = document.createElement("li");
    li.classList.add("line");
    li.innerHTML = `${showNumberAsBrlNumber(
      ingredient.quantity
    )} ${showMesurementUnity(ingredient.measurementUnity)} de ${
      ingredient.description
    }${index === revenueData.ingredients.length - 1 ? "." : ";"}`;

    ulIngredients.appendChild(li);
  });

  ingredients.appendChild(ulIngredients);

  const ulEquipaments = document.createElement("ul");

  revenueData.equipaments.forEach((equipament, index) => {
    const li = document.createElement("li");
    li.classList.add("line");
    li.innerHTML = `${showNumberAsBrlNumber(equipament.minutes)} minutos de ${
      equipament.description
    }${index === revenueData.equipaments.length - 1 ? "." : ";"}`;

    ulEquipaments.appendChild(li);
  });

  equipaments.appendChild(ulEquipaments);

  preparingMode.innerHTML = revenueData.preparingMode;
  revenueCost.innerHTML = formatNumberToBRLCurrency(revenueData.revenueCost);
  priceWithMargin.innerHTML = formatNumberToBRLCurrency(
    revenueData.priceWithMargin
  );
  salePrice.innerHTML = formatNumberToBRLCurrency(revenueData.salePrice);

  loader.style.display = "none";
});
