import { db } from "../assets/js/firebase-module.js";
import { formatNumberToBRLCurrency } from "../assets/js/format-number-to-brl-currency.js";
import { showMesurementUnity } from "../assets/js/show-mesurement-unity.js";
import { showDangerToast, showSuccessToast } from "../assets/js/toast.js";
import { createSidebar } from "../components/sidebar.js";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  deleteDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

let revenueCost = 0;
let priceWithMargin = 0;
const btNewRevenue = document.getElementById("btNewRevenue");
const loader = document.getElementById("loader");
const selectIngredients = document.getElementById("selectIngredients");
const selectEquipaments = document.getElementById("selectEquipaments");
const addIngredientButton = document.getElementById("addIngredientButton");
const addEquipamentButton = document.getElementById("addEquipamentButton");
const addedIngredients = [];
const addedEquipaments = [];
const tableRevenues = document.getElementById("tableRevenues");
const noDataFound = document.getElementById("noDataFound");
const tableIngredients = document.getElementById("tableIngredients");
const tableEquipaments = document.getElementById("tableEquipaments");
const formNewRevenue = document.getElementById("formNewRevenue");
const totalCost = document.getElementById("totalCost");
const suggestedPrice = document.getElementById("suggestedPrice");
const editingRevenueId = document.getElementById("editingRevenueId");

const getPriceWithMargin = (cost) => {
  return cost * 2.2;
};

const deleteIngredient = (ingredientId) => {
  const ingredientIndex = addedIngredients.findIndex(
    (ingredient) => ingredient.id === ingredientId
  );
  const ingredient = addedIngredients[ingredientIndex];

  const ingredientCost = getIngredientCost(ingredient, ingredient.quantity);
  revenueCost -= ingredientCost;
  totalCost.innerText = revenueCost.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });

  const ingredientWithMargin = getPriceWithMargin(ingredientCost);
  priceWithMargin -= ingredientWithMargin;
  suggestedPrice.innerText = priceWithMargin.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });

  addedIngredients.splice(ingredientIndex, 1);
  const ingredientRow = document.getElementById(
    `ingredientRow-${ingredientId}`
  );
  ingredientRow.remove();
};

const deleteEquipament = (equipamentId) => {
  const equipamentIndex = addedEquipaments.findIndex(
    (equipament) => equipament.id === equipamentId
  );
  const equipament = addedEquipaments[equipamentIndex];
  addedEquipaments.splice(equipamentIndex, 1);
  const equipamentRow = document.getElementById(
    `equipamentRow-${equipamentId}`
  );
  equipamentRow.remove();

  const equipamentCost = getEquipamentCost(equipament, equipament.minutes);
  revenueCost -= equipamentCost;
  totalCost.innerText = revenueCost.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });

  const equipamentWithMargin = getPriceWithMargin(equipamentCost);
  priceWithMargin -= equipamentWithMargin;
  suggestedPrice.innerText = priceWithMargin.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });
};

const getTrashIngredientButton = (ingredientId) => {
  const trashSvg = feather.icons["trash-2"].toSvg({
    id: `deleteIngredient-${ingredientId}`,
  });
  const parser = new DOMParser();
  return parser.parseFromString(trashSvg, "image/svg+xml").querySelector("svg");
};

const getTrashEquipamentButton = (equipamentId) => {
  const trashSvg = feather.icons["trash-2"].toSvg({
    id: `deleteEquipament-${equipamentId}`,
  });
  const parser = new DOMParser();
  return parser.parseFromString(trashSvg, "image/svg+xml").querySelector("svg");
};

const getIngredientCost = (ingredient, quantity) => {
  const cost = ingredient.price / ingredient.quantityInItem;
  return cost * quantity;
};

const getEquipamentCost = (equipament, minutes) => {
  switch (equipament.resourceUsed) {
    case "el":
      return 0.05 * minutes;
    case "ga":
      return 0.1 * minutes;
    case "ag":
      return 0.7 * minutes;
    default:
      return 0;
  }
};

const getEditButton = (revenueId) => {
  const editSvg = feather.icons["edit"].toSvg({
    id: `editRevenue-${revenueId}`,
  });
  const parser = new DOMParser();
  return parser.parseFromString(editSvg, "image/svg+xml").querySelector("svg");
};

const getTrashButton = (revenueId) => {
  const trashSvg = feather.icons["trash-2"].toSvg({
    id: `deleteRevenue-${revenueId}`,
  });
  const parser = new DOMParser();
  return parser.parseFromString(trashSvg, "image/svg+xml").querySelector("svg");
};

const deleteRevenue = (revenueId) => {
  loader.style.display = "block";
  deleteDoc(doc(db, "revenues", revenueId))
    .then(() => {
      loader.style.display = "none";
      showDangerToast("Ingrediente deletado com sucesso!");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    })
    .catch((error) => {
      loader.style.display = "none";
      console.error(error);
      showDangerToast(
        "Erro ao deletar um ingrediente. Tente novamente mais tarde."
      );
    });
};

const editRevenue = (revenueId) => {
  loader.style.display = "block";
  const drawerHeader = document.getElementById("drawerHeader");
  const description = document.getElementById("description");
  const preparingMode = document.getElementById("preparingMode");
  const salePrice = document.getElementById("salePrice");

  drawerHeader.innerText = "Editar receita 🧁";

  editingRevenueId.value = revenueId;

  const revenueRef = doc(db, "revenues", revenueId);
  getDoc(revenueRef)
    .then((doc) => {
      if (doc.exists()) {
        const revenue = doc.data();
        description.value = revenue.description;
        preparingMode.value = revenue.preparingMode;
        salePrice.value = revenue.salePrice;

        revenue.ingredients.forEach((ingredient) => {
          addedIngredients.push(ingredient);

          const newIngredientRow = document.createElement("tr");
          newIngredientRow.id = `ingredientRow-${ingredient.id}`;
          newIngredientRow.innerHTML = `
          <td>${ingredient.description}</td>
          <td>${ingredient.quantity}${showMesurementUnity(
            ingredient.measurementUnity
          )}</td>
          <td>
            <div class="btn-icon">
              ${getTrashIngredientButton(ingredient.id).outerHTML}
            </div>
          </td>
        `;

          tableIngredients.appendChild(newIngredientRow);

          const allDeleteButtons = document.querySelectorAll(
            "[id^='deleteIngredient-']"
          );

          allDeleteButtons.forEach((button) => {
            const ingredientId = button.id.split("-")[1];
            button.parentNode.addEventListener("click", () => {
              deleteIngredient(ingredientId);
            });
          });

          const ingredientCost = getIngredientCost(
            ingredient,
            ingredient.quantity
          );
          revenueCost += ingredientCost;
          totalCost.innerText = revenueCost.toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL",
          });

          const ingredientWithMargin = getPriceWithMargin(ingredientCost);
          priceWithMargin += ingredientWithMargin;
          suggestedPrice.innerText = priceWithMargin.toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL",
          });
        });

        revenue.equipaments.forEach((equipament) => {
          addedEquipaments.push(equipament);

          const newEquipamentRow = document.createElement("tr");
          newEquipamentRow.id = `equipamentRow-${equipament.id}`;
          newEquipamentRow.innerHTML = `
          <td>${equipament.description}</td>
          <td>${equipament.minutes}</td>
          <td>
            <div class="btn-icon">
              ${getTrashEquipamentButton(equipament.id).outerHTML}
            </div>
          </td>
        `;

          tableEquipaments.appendChild(newEquipamentRow);

          const allDeleteButtons = document.querySelectorAll(
            "[id^='deleteEquipament-']"
          );

          allDeleteButtons.forEach((button) => {
            const equipamentId = button.id.split("-")[1];
            button.parentNode.addEventListener("click", () => {
              deleteEquipament(equipamentId);
            });
          });

          const equipamentCost = getEquipamentCost(
            equipament,
            equipament.minutes
          );
          revenueCost += equipamentCost;
          totalCost.innerText = revenueCost.toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL",
          });

          const equipamentWithMargin = getPriceWithMargin(equipamentCost);
          priceWithMargin += equipamentWithMargin;
          suggestedPrice.innerText = priceWithMargin.toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL",
          });
        });

        btNewRevenue.click();
      } else {
        showDangerToast("Receita não encontrada.");
      }

      loader.style.display = "none";
    })
    .catch((error) => {
      loader.style.display = "none";
      console.error("Error getting document:", error);
      showDangerToast("Erro interno no servidor. Tente novamente mais tarde.");
    });
};

addIngredientButton.addEventListener("click", async () => {
  const quantity = document.getElementById("quantity");

  if (quantity.value === "") {
    alert("Por favor, o campo quantidade deve ser preenchido.");
    return;
  }

  const formAddIngredientToRevenue = document.getElementById(
    "formAddIngredientToRevenue"
  );
  const selectIngredients = document.getElementById("selectIngredients");

  const ingredientId = selectIngredients.value;
  const ingredient = await getDoc(doc(db, "ingredients", ingredientId));
  const ingredientData = ingredient.data();

  addedIngredients.push({
    ...ingredientData,
    quantity: quantity.value,
    id: ingredientId,
  });

  const newIngredientRow = document.createElement("tr");
  newIngredientRow.id = `ingredientRow-${ingredientId}`;
  newIngredientRow.innerHTML = `
    <td>${ingredientData.description}</td>
    <td>${quantity.value}${showMesurementUnity(
    ingredientData.measurementUnity
  )}</td>
    <td>
      <div class="btn-icon">
        ${getTrashIngredientButton(ingredientId).outerHTML}
      </div>
    </td>
  `;

  tableIngredients.appendChild(newIngredientRow);

  const allDeleteButtons = document.querySelectorAll(
    "[id^='deleteIngredient-']"
  );

  allDeleteButtons.forEach((button) => {
    const ingredientId = button.id.split("-")[1];
    button.parentNode.addEventListener("click", () => {
      deleteIngredient(ingredientId);
    });
  });

  const ingredientCost = getIngredientCost(ingredientData, quantity.value);
  revenueCost += ingredientCost;
  totalCost.innerText = revenueCost.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });

  const ingredientWithMargin = getPriceWithMargin(ingredientCost);
  priceWithMargin += ingredientWithMargin;
  suggestedPrice.innerText = priceWithMargin.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });

  selectIngredients.value = "null";
  quantityMeasurementUnity.innerText = "";
  quantity.value = "";
  formAddIngredientToRevenue.style.display = "none";
});

addEquipamentButton.addEventListener("click", async () => {
  const minutes = document.getElementById("minutes");

  if (minutes.value === "") {
    alert("Por favor, o campo minutos deve ser preenchido.");
    return;
  }

  const formAddEquipamentToRevenue = document.getElementById(
    "formAddEquipamentToRevenue"
  );
  const selectEquipaments = document.getElementById("selectEquipaments");

  const equipamentId = selectEquipaments.value;
  const equipament = await getDoc(doc(db, "equipaments", equipamentId));
  const equipamentData = equipament.data();

  addedEquipaments.push({
    ...equipamentData,
    minutes: minutes.value,
    id: equipamentId,
  });

  const newEquipamentRow = document.createElement("tr");
  newEquipamentRow.id = `equipamentRow-${equipamentId}`;
  newEquipamentRow.innerHTML = `
    <td>${equipamentData.description}</td>
    <td>${minutes.value}</td>
    <td>
      <div class="btn-icon">
        ${getTrashEquipamentButton(equipamentId).outerHTML}
      </div>
    </td>
  `;

  tableEquipaments.appendChild(newEquipamentRow);

  const allDeleteButtons = document.querySelectorAll(
    "[id^='deleteEquipament-']"
  );

  allDeleteButtons.forEach((button) => {
    const equipamentId = button.id.split("-")[1];
    button.parentNode.addEventListener("click", () => {
      deleteEquipament(equipamentId);
    });
  });

  const equipamentCost = getEquipamentCost(equipamentData, minutes.value);
  revenueCost += equipamentCost;
  totalCost.innerText = revenueCost.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });

  const equipamentWithMargin = getPriceWithMargin(equipamentCost);
  priceWithMargin += equipamentWithMargin;
  suggestedPrice.innerText = priceWithMargin.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });

  selectEquipaments.value = "null";
  minutes.value = "";
  formAddEquipamentToRevenue.style.display = "none";
});

selectIngredients.addEventListener("change", async (e) => {
  const ingredientId = e.target.value;
  const formAddIngredientToRevenue = document.getElementById(
    "formAddIngredientToRevenue"
  );
  const quantityMeasurementUnity = document.getElementById(
    "quantityMeasurementUnity"
  );

  if (ingredientId === "null") {
    formAddIngredientToRevenue.style.display = "none";
    return;
  }

  const ingredientRef = doc(db, "ingredients", ingredientId);
  const ingredientDoc = await getDoc(ingredientRef);
  const ingredient = ingredientDoc.data();

  quantityMeasurementUnity.innerText = ` (${showMesurementUnity(
    ingredient.measurementUnity
  )})`;

  formAddIngredientToRevenue.style.display = "block";
});

selectEquipaments.addEventListener("change", async (e) => {
  const equipamentId = e.target.value;
  const formAddEquipamentToRevenue = document.getElementById(
    "formAddEquipamentToRevenue"
  );

  if (equipamentId === "null") {
    formAddEquipamentToRevenue.style.display = "none";
    return;
  }

  formAddEquipamentToRevenue.style.display = "block";
});

btNewRevenue.addEventListener("click", async () => {
  loader.style.display = "block";
  const querySnapshot = await getDocs(collection(db, "ingredients"));

  if (querySnapshot.empty) {
    loader.style.display = "none";
    return;
  }

  querySnapshot.forEach((doc) => {
    const ingredient = doc.data();

    const newIngredientOption = document.createElement("option");
    newIngredientOption.text = ingredient.description;
    newIngredientOption.value = doc.id;

    selectIngredients.appendChild(newIngredientOption);
  });

  loader.style.display = "none";
});

btNewRevenue.addEventListener("click", async () => {
  loader.style.display = "block";
  const querySnapshot = await getDocs(collection(db, "equipaments"));

  if (querySnapshot.empty) {
    loader.style.display = "none";
    return;
  }

  querySnapshot.forEach((doc) => {
    const equipament = doc.data();

    const newEquipamentOption = document.createElement("option");
    newEquipamentOption.text = equipament.description;
    newEquipamentOption.value = doc.id;

    selectEquipaments.appendChild(newEquipamentOption);
  });

  loader.style.display = "none";
});

formNewRevenue.addEventListener("submit", async (e) => {
  e.preventDefault();
  loader.style.display = "block";

  const description = e.target.description.value;
  const preparingMode = e.target.preparingMode.value;
  const salePrice = e.target.salePrice.value;
  const editingRevenueId = e.target.editingRevenueId.value;

  const revenue = {
    description,
    ingredients: addedIngredients,
    equipaments: addedEquipaments,
    preparingMode,
    revenueCost,
    priceWithMargin,
    salePrice,
  };

  console.log(editingRevenueId);

  if (editingRevenueId) {
    const revenueRef = doc(db, "revenues", editingRevenueId);
    setDoc(revenueRef, revenue)
      .then(() => {
        loader.style.display = "none";
        showSuccessToast("Receita editada com sucesso!");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((error) => {
        loader.style.display = "none";
        console.error(error);
        showDangerToast(
          "Erro ao editar a receita. Tente novamente mais tarde."
        );
      });

    return;
  }

  addDoc(collection(db, "revenues"), revenue)
    .then(() => {
      loader.style.display = "none";

      showSuccessToast("Receita criada com sucesso!");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    })
    .catch((error) => {
      loader.style.display = "none";

      console.error(error);
      showDangerToast("Erro ao criar uma receita. Tente novamente mais tarde.");
    });
});

window.addEventListener("load", async () => {
  const createdSidebar = await createSidebar("revenues");
  sidebar.appendChild(createdSidebar);
});

window.addEventListener("load", async function () {
  loader.style.display = "block";
  const querySnapshot = await getDocs(collection(db, "revenues"));

  if (querySnapshot.empty) {
    loader.style.display = "none";
    noDataFound.style.display = "block";
    tableRevenues.style.display = "none";
    return;
  }

  querySnapshot.forEach((doc) => {
    const revenues = doc.data();
    const row = tableRevenues.insertRow(-1);

    const editButton = getEditButton(doc.id);
    const trashButton = getTrashButton(doc.id);

    row.innerHTML = `
      <td>${revenues.description}</td>
      <td>${formatNumberToBRLCurrency(revenues.revenueCost)}</td>
      <td>${formatNumberToBRLCurrency(revenues.priceWithMargin)}</td>
      <td>${formatNumberToBRLCurrency(revenues.salePrice)}</td>
      <td>
        <div class="action-buttons-group">
          <div class="btn-icon">
            ${editButton.outerHTML}
          </div>
          <div class="btn-icon">
            ${trashButton.outerHTML}
          </div>
        </div>
      </td>
    `;
  });

  const allDeleteButtons = document.querySelectorAll("[id^='deleteRevenue-']");

  const allEditButtons = document.querySelectorAll("[id^='editRevenue-']");

  allDeleteButtons.forEach((button) => {
    const revenueId = button.id.split("-")[1];
    button.parentNode.addEventListener("click", () => {
      deleteRevenue(revenueId);
    });
  });

  allEditButtons.forEach((button) => {
    const revenueId = button.id.split("-")[1];
    button.parentNode.addEventListener("click", () => {
      editRevenue(revenueId);
    });
  });

  loader.style.display = "none";
});
