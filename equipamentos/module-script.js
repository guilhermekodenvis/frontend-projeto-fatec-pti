import { db } from "../assets/js/firebase-module.js";
import { showResourceName } from "../assets/js/show-resource-name.js";
import { createSidebar } from "../components/sidebar.js";
import {
  showDangerToast,
  showSuccessToast,
  showWarningToast,
} from "./../assets/js/toast.js";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const tableEquipaments = document.getElementById("tableEquipaments");
const loader = document.getElementById("loader");
const noDataFound = document.getElementById("noDataFound");
const logoutButton = document.getElementById("logoutButton");
const formAddEquipament = document.getElementById("formAddEquipament");
const equipamentEditingId = document.getElementById("equipamentEditingId");
const btAddEquipament = document.getElementById("btAddEquipament");

const getEditButton = (equipamentId) => {
  const editSvg = feather.icons["edit"].toSvg({
    id: `editEquipament-${equipamentId}`,
  });
  const parser = new DOMParser();
  return parser.parseFromString(editSvg, "image/svg+xml").querySelector("svg");
};

const getTrashButton = (equipamentId) => {
  const trashSvg = feather.icons["trash-2"].toSvg({
    id: `deleteEquipament-${equipamentId}`,
  });
  const parser = new DOMParser();
  return parser.parseFromString(trashSvg, "image/svg+xml").querySelector("svg");
};

const editEquipament = (equipamentId) => {
  loader.style.display = "block";
  const drawerHeader = document.getElementById("drawerHeader");
  const description = document.getElementById("description");
  const resourceUsed = document.getElementById("resourceUsed");

  drawerHeader.innerText = "Editar equipamento🍴";

  equipamentEditingId.value = equipamentId;

  const equipamentsRef = doc(db, "equipaments", equipamentId);
  getDoc(equipamentsRef)
    .then((doc) => {
      if (doc.exists()) {
        const equipament = doc.data();
        description.value = equipament.description;
        resourceUsed.value = equipament.resourceUsed;

        btAddEquipament.click();
      } else {
        showDangerToast("Equipamento não encontrado.");
      }
      loader.style.display = "none";
    })
    .catch((error) => {
      loader.style.display = "none";
      console.error("Error getting document:", error);
      showDangerToast("Erro interno no servidor. Tente novamente mais tarde.");
    });
};

const deleteEquipament = (equipamentId) => {
  loader.style.display = "block";
  deleteDoc(doc(db, "equipaments", equipamentId))
    .then(() => {
      loader.style.display = "none";
      showDangerToast("Equipamento deletado com sucesso!");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    })
    .catch((error) => {
      loader.style.display = "none";
      console.error(error);
      showDangerToast(
        "Erro ao deletar um equipamento. Tente novamente mais tarde."
      );
    });
};

formAddEquipament.addEventListener("submit", function (event) {
  event.preventDefault();

  loader.style.display = "block";

  const description = event.target.elements.description.value;
  const resourceUsed = event.target.elements.resourceUsed.value;

  if (equipamentEditingId.value) {
    const ingredientRef = doc(db, "equipaments", equipamentEditingId.value);
    setDoc(ingredientRef, {
      description,
      resourceUsed,
    })
      .then(() => {
        loader.style.display = "none";
        showSuccessToast("Equipamento editado com sucesso!");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((error) => {
        loader.style.display = "none";
        console.error(error);
        showDangerToast(
          "Erro ao editar um equipamento. Tente novamente mais tarde."
        );
      });

    return;
  }

  addDoc(collection(db, "equipaments"), {
    description,
    resourceUsed,
  })
    .then(() => {
      loader.style.display = "none";

      showSuccessToast("Equipamento criado com sucesso!");
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

window.addEventListener("load", async () => {
  const createdSidebar = await createSidebar("equipaments");
  sidebar.appendChild(createdSidebar);
});

window.addEventListener("load", async function () {
  loader.style.display = "block";
  const querySnapshot = await getDocs(collection(db, "equipaments"));

  if (querySnapshot.empty) {
    loader.style.display = "none";
    noDataFound.style.display = "block";
    tableEquipaments.style.display = "none";
    return;
  }

  querySnapshot.forEach((doc) => {
    const equipament = doc.data();
    const row = tableEquipaments.insertRow(-1);

    const editButton = getEditButton(doc.id);
    const trashButton = getTrashButton(doc.id);

    row.innerHTML = `
      <td>${equipament.description}</td>
      <td>${showResourceName(equipament.resourceUsed)}</td>
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
    "[id^='deleteEquipament-']"
  );

  const allEditButtons = document.querySelectorAll("[id^='editEquipament-']");

  allDeleteButtons.forEach((button) => {
    const ingredientId = button.id.split("-")[1];
    button.parentNode.addEventListener("click", () => {
      deleteEquipament(ingredientId);
    });
  });

  allEditButtons.forEach((button) => {
    const ingredientId = button.id.split("-")[1];
    button.parentNode.addEventListener("click", () => {
      editEquipament(ingredientId);
    });
  });

  loader.style.display = "none";
});
