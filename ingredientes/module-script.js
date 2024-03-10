import {
  showDangerToast,
  showSuccessToast,
  showWarningToast,
} from "./../assets/js/toast.js";
import { db } from "./../assets/js/firebase-module.js";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import {
  getAuth,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { formatNumberToBRLCurrency } from "../assets/js/format-number-to-brl-currency.js";
import { sessionLogout } from "../assets/js/session-controller.js";
import { createSidebar } from "../components/sidebar.js";
import { showMesurementUnity } from "../assets/js/show-mesurement-unity.js";

const formCreateNewIngredient = document.getElementById(
  "formCreateNewIngredient"
);
const tableIngredients = document.getElementById("tableIngredients");
const loader = document.getElementById("loader");
const noDataFound = document.getElementById("noDataFound");
const btAddIngredient = document.getElementById("btAddIngredient");
const ingredientEditingId = document.getElementById("ingredientEditingId");
const logoutButton = document.getElementById("logoutButton");

const editIngredient = (ingredientId) => {
  loader.style.display = "block";
  const drawerHeader = document.getElementById("drawerHeader");
  const description = document.getElementById("description");
  const measurementUnity = document.getElementById("measurementUnity");
  const price = document.getElementById("price");
  const quantityInItem = document.getElementById("quantityInItem");

  drawerHeader.innerText = "Editar ingrediente 🍫";

  ingredientEditingId.value = ingredientId;

  const ingredientRef = doc(db, "ingredients", ingredientId);
  getDoc(ingredientRef)
    .then((doc) => {
      if (doc.exists()) {
        const ingredient = doc.data();
        description.value = ingredient.description;
        measurementUnity.value = ingredient.measurementUnity;
        price.value = ingredient.price;
        quantityInItem.value = ingredient.quantityInItem;

        btAddIngredient.click();
      } else {
        showDangerToast("Ingrediente não encontrado.");
      }
      loader.style.display = "none";
    })
    .catch((error) => {
      loader.style.display = "none";
      console.error("Error getting document:", error);
      showDangerToast("Erro interno no servidor. Tente novamente mais tarde.");
    });
};

const deleteIngredient = (ingredientId) => {
  loader.style.display = "block";
  deleteDoc(doc(db, "ingredients", ingredientId))
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

const getEditButton = (ingredientId) => {
  const editSvg = feather.icons["edit"].toSvg({
    id: `editIngredient-${ingredientId}`,
  });
  const parser = new DOMParser();
  return parser.parseFromString(editSvg, "image/svg+xml").querySelector("svg");
};

const getTrashButton = (ingredientId) => {
  const trashSvg = feather.icons["trash-2"].toSvg({
    id: `deleteIngredient-${ingredientId}`,
  });
  const parser = new DOMParser();
  return parser.parseFromString(trashSvg, "image/svg+xml").querySelector("svg");
};

formCreateNewIngredient.addEventListener("submit", function (event) {
  event.preventDefault();

  loader.style.display = "block";

  const description = event.target.elements.description.value;
  const measurementUnity = event.target.elements.measurementUnity.value;
  const price = Number(event.target.elements.price.value);
  const quantityInItem = Number(event.target.elements.quantityInItem.value);

  if (ingredientEditingId.value) {
    const ingredientRef = doc(db, "ingredients", ingredientEditingId.value);
    setDoc(ingredientRef, {
      description,
      measurementUnity,
      price,
      quantityInItem,
    })
      .then(() => {
        loader.style.display = "none";
        showSuccessToast("Ingrediente editado com sucesso!");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((error) => {
        loader.style.display = "none";
        console.error(error);
        showDangerToast(
          "Erro ao editar um ingrediente. Tente novamente mais tarde."
        );
      });

    return;
  }

  addDoc(collection(db, "ingredients"), {
    description,
    measurementUnity,
    price,
    quantityInItem,
  })
    .then(() => {
      loader.style.display = "none";

      showSuccessToast("Ingrediente criado com sucesso!");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    })
    .catch((error) => {
      loader.style.display = "none";

      console.error(error);
      showDangerToast("Erro ao criar um usuário. Tente novamente mais tarde.");
    });
});

logoutButton.addEventListener("click", () => {
  loader.style.display = "block";

  const auth = getAuth();
  signOut(auth)
    .then(() => {
      sessionLogout();
      loader.style.display = "none";
    })
    .catch((error) => {
      loader.style.display = "none";
      console.error(error);
      showDangerToast("Erro ao deslogar. Tente novamente mais tarde.");
    });
});

window.addEventListener("load", () => {
  const createdSidebar = createSidebar();
  sidebar.appendChild(createdSidebar);
});

window.addEventListener("load", async function () {
  loader.style.display = "block";
  const querySnapshot = await getDocs(collection(db, "ingredients"));

  if (querySnapshot.empty) {
    loader.style.display = "none";
    noDataFound.style.display = "block";
    tableIngredients.style.display = "none";
    return;
  }

  querySnapshot.forEach((doc) => {
    const ingredient = doc.data();
    const row = tableIngredients.insertRow(-1);

    const editButton = getEditButton(doc.id);
    const trashButton = getTrashButton(doc.id);

    row.innerHTML = `
      <td>${ingredient.description}</td>
      <td>${ingredient.quantityInItem}${showMesurementUnity(
      ingredient.measurementUnity
    )}</td>
      <td>${formatNumberToBRLCurrency(ingredient.price)}</td>
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

  const allDeleteButtons = document.querySelectorAll(
    "[id^='deleteIngredient-']"
  );

  const allEditButtons = document.querySelectorAll("[id^='editIngredient-']");

  allDeleteButtons.forEach((button) => {
    const ingredientId = button.id.split("-")[1];
    button.parentNode.addEventListener("click", () => {
      deleteIngredient(ingredientId);
    });
  });

  allEditButtons.forEach((button) => {
    const ingredientId = button.id.split("-")[1];
    button.parentNode.addEventListener("click", () => {
      editIngredient(ingredientId);
    });
  });

  loader.style.display = "none";
});
