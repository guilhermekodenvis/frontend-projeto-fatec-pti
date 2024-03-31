import { db } from "../assets/js/firebase-module.js";
import { getUserId, sessionLogout } from "../assets/js/session-controller.js";
import { showResourceName } from "../assets/js/show-resource-name.js";
import { validateLogin } from "../assets/js/validate-login.js";
import { createSidebar } from "../components/sidebar.js";
import { showDangerToast, showSuccessToast } from "./../assets/js/toast.js";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  getDoc,
  setDoc,
  query,
  where,
  orderBy,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

validateLogin();

const tableEquipaments = document.getElementById("tableEquipaments");
const loader = document.getElementById("loader");
const noDataFound = document.getElementById("noDataFound");
const logoutButton = document.getElementById("logoutButton").parentElement;
const formAddEquipament = document.getElementById("formAddEquipament");
const equipamentEditingId = document.getElementById("equipamentEditingId");
const btAddEquipament = document.getElementById("btAddEquipament");
const descriptionOrderIcon = document.getElementById("descriptionOrderIcon");
const resourceOrderIcon = document.getElementById("resourceOrderIcon");
const searchEquipamentButton = document.getElementById(
  "searchEquipamentButton"
);

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

const getEquipamentsOrderedByDescription = async (order) => {
  loader.style.display = "block";
  const equipamentsRef = collection(db, "equipaments");
  const userId = getUserId();

  const q = query(
    equipamentsRef,
    where("userId", "==", userId),
    orderBy("description", order),
    orderBy("resourceUsed", "asc")
  );

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    loader.style.display = "none";
    noDataFound.style.display = "block";
    tableEquipaments.style.display = "none";
    return;
  } else {
    noDataFound.style.display = "none";
    tableEquipaments.style.display = "table";
  }

  const tbody = tableEquipaments.getElementsByTagName("tbody")[0];

  tbody.innerHTML = "";

  querySnapshot.forEach((doc) => {
    const equipament = doc.data();

    const row = tbody.insertRow(-1);

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
};

const getEquipamentsOrderedByResource = async (order) => {
  loader.style.display = "block";
  const equipamentsRef = collection(db, "equipaments");
  const userId = getUserId();

  const q = query(
    equipamentsRef,
    where("userId", "==", userId),
    orderBy("resourceUsed", order),
    orderBy("description", "asc")
  );

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    loader.style.display = "none";
    noDataFound.style.display = "block";
    tableEquipaments.style.display = "none";
    return;
  } else {
    noDataFound.style.display = "none";
    tableEquipaments.style.display = "table";
  }

  const tbody = tableEquipaments.getElementsByTagName("tbody")[0];

  tbody.innerHTML = "";

  querySnapshot.forEach((doc) => {
    const equipament = doc.data();

    const row = tbody.insertRow(-1);

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
};

searchEquipamentButton.addEventListener("click", () => {
  loader.style.display = "block";

  const searchEquipament = document.getElementById("searchEquipament").value;
  console.log(searchEquipament);

  if (searchEquipament === "") {
    console.log("searchEquipament === ''");
    getEquipamentsOrderedByDescription("asc");
    return;
  }

  const userId = getUserId();

  const equipamentsRef = collection(db, "equipaments");

  const q = query(equipamentsRef, where("userId", "==", userId));

  getDocs(q)
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        loader.style.display = "none";
        noDataFound.style.display = "block";
        tableEquipaments.style.display = "none";
        return;
      } else {
        noDataFound.style.display = "none";
        tableEquipaments.style.display = "table";
      }

      const tbody = tableEquipaments.getElementsByTagName("tbody")[0];

      tbody.innerHTML = "";

      querySnapshot.forEach((doc) => {
        const equipament = doc.data();
        if (
          !equipament.description
            .toUpperCase()
            .includes(searchEquipament.toUpperCase())
        ) {
          return;
        }

        const row = tbody.insertRow(-1);

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

      const allEditButtons = document.querySelectorAll(
        "[id^='editEquipament-']"
      );

      allDeleteButtons.forEach((button) => {
        const equipamentId = button.id.split("-")[1];
        button.parentNode.addEventListener("click", () => {
          deleteEquipament(equipamentId);
        });
      });

      allEditButtons.forEach((button) => {
        const equipamentId = button.id.split("-")[1];
        button.parentNode.addEventListener("click", () => {
          editEquipament(equipamentId);
        });
      });

      loader.style.display = "none";
    })
    .catch((error) => {
      loader.style.display = "none";
      console.error("Error getting documents: ", error);
      showDangerToast("Erro interno no servidor. Tente novamente mais tarde.");
    });
});

descriptionOrderIcon.parentElement.addEventListener("click", () => {
  loader.style.display = "block";

  console.log(descriptionOrderIcon.style.visibility);

  if (
    descriptionOrderIcon.style.visibility === "hidden" ||
    descriptionOrderIcon.style.visibility === ""
  ) {
    descriptionOrderIcon.style.visibility = "visible";
    resourceOrderIcon.style.visibility = "hidden";
    descriptionOrderIcon.style.transform = "rotate(0deg)";

    getEquipamentsOrderedByDescription("asc");

    return;
  }

  if (descriptionOrderIcon.style.transform === "rotate(180deg)") {
    descriptionOrderIcon.style.transform = "rotate(0deg)";

    getEquipamentsOrderedByDescription("asc");
  } else {
    descriptionOrderIcon.style.transform = "rotate(180deg)";

    getEquipamentsOrderedByDescription("desc");
  }

  loader.style.display = "none";
});

resourceOrderIcon.parentElement.addEventListener("click", () => {
  loader.style.display = "block";

  if (
    resourceOrderIcon.style.visibility === "hidden" ||
    resourceOrderIcon.style.visibility === ""
  ) {
    resourceOrderIcon.style.visibility = "visible";
    descriptionOrderIcon.style.visibility = "hidden";
    resourceOrderIcon.style.transform = "rotate(0deg)";

    getEquipamentsOrderedByResource("asc");
  }

  if (resourceOrderIcon.style.transform === "rotate(180deg)") {
    resourceOrderIcon.style.transform = "rotate(0deg)";

    getEquipamentsOrderedByResource("asc");
  } else {
    resourceOrderIcon.style.transform = "rotate(180deg)";

    getEquipamentsOrderedByResource("desc");
  }

  loader.style.display = "none";
});

logoutButton.addEventListener("click", () => {
  loader.style.display = "block";

  sessionLogout(() => {
    loader.style.display = "none";
  });
});

formAddEquipament.addEventListener("submit", function (event) {
  event.preventDefault();
  const userId = getUserId();

  loader.style.display = "block";

  const description = event.target.elements.description.value;
  const resourceUsed = event.target.elements.resourceUsed.value;

  if (equipamentEditingId.value) {
    const ingredientRef = doc(db, "equipaments", equipamentEditingId.value);
    setDoc(ingredientRef, {
      description,
      resourceUsed,
      userId,
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
    userId,
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

window.addEventListener("load", async () => {
  const createdSidebar = await createSidebar("equipaments");
  sidebar.appendChild(createdSidebar);
});

window.addEventListener("load", async function () {
  getEquipamentsOrderedByDescription("asc");
});
