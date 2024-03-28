import { db } from "../assets/js/firebase-module.js";
import {
  doc,
  getDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import {
  getAuth,
  updateEmail,
  sendEmailVerification,
  updatePassword,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";
import { sessionGetUser } from "../assets/js/session-controller.js";
import { createSidebar } from "../components/sidebar.js";
import { showDangerToast, showSuccessToast } from "../assets/js/toast.js";

const loader = document.getElementById("loader");
const editProfile = document.getElementById("editProfile");
const getVerifyLinkAnchor = document.getElementById("getVerifyLinkAnchor");
const editPassword = document.getElementById("editPassword");
const cameraButton = document.getElementById("cameraButton");
const avatarInput = document.getElementById("avatarInput");
const auth = getAuth();

const getVerifyLink = () => {
  loader.style.display = "block";
  sendEmailVerification(auth.currentUser)
    .then(() => {
      loader.style.display = "none";
      showSuccessToast("Email de verificação enviado com sucesso!");
    })
    .catch((error) => {
      loader.style.display = "none";
      console.error(error);
      showDangerToast("Erro interno no servidor. Tente novamente mais tarde.");
    });
};

cameraButton.addEventListener("click", () => {
  avatarInput.click();
});

avatarInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onloadend = () => {
    const avatar = reader.result;
    const { uid } = sessionGetUser();
    const userRef = doc(db, "users", uid);

    const storage = getStorage();
    const storageRef = ref(storage, `users/${uid}/avatar.jpg`);

    uploadString(storageRef, avatar, "data_url")
      .then((snapshot) => {
        const { fullPath } = snapshot.ref;

        getDownloadURL(storageRef).then((url) => {
          document.getElementById("avatar").src = url;
          document.querySelector("#userProfileInfo img").src = url;

          setDoc(userRef, { avatar: url }, { merge: true })
            .then(() => {
              showSuccessToast("Imagem de perfil alterada com sucesso!");
            })
            .catch((error) => {
              console.error(error);
              showDangerToast(
                "Erro interno no servidor. Tente novamente mais tarde."
              );
            });
        });
      })
      .catch((error) => {
        console.error(error);
        showDangerToast(
          "Erro interno no servidor. Tente novamente mais tarde."
        );
      });
  };

  reader.readAsDataURL(file);
});

getVerifyLinkAnchor.addEventListener("click", getVerifyLink);

editPassword.addEventListener("submit", (event) => {
  event.preventDefault();

  loader.style.display = "block";

  const newPassword = event.target.elements.newPassword.value;
  const confirmPassword = event.target.elements.confirmPassword.value;

  if (newPassword !== confirmPassword) {
    loader.style.display = "none";
    showDangerToast("As senhas não coincidem.");
    return;
  }

  const user = auth.currentUser;

  updatePassword(user, newPassword)
    .then(() => {
      loader.style.display = "none";
      showSuccessToast("Senha alterada com sucesso!");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    })
    .catch((error) => {
      loader.style.display = "none";
      console.error(error);

      if (error.message.includes("(auth/weak-password)")) {
        showDangerToast("Senha fraca. Tente uma senha mais forte.");
        return;
      }

      if (error.message.includes("(auth/requires-recent-login)")) {
        showDangerToast(
          "Faça login no sistema para alterar a senha e tente novamente."
        );
        return;
      }

      showDangerToast(
        "Erro ao alterar a senha. Faça login novamente, se o erro persistir tente uma senha mais forte."
      );
    });
});

editProfile.addEventListener("submit", (event) => {
  event.preventDefault();

  loader.style.display = "block";

  const { uid } = sessionGetUser();

  const name = event.target.elements.name.value;
  const email = event.target.elements.email.value;
  const bakeryName = event.target.elements.bakeryName.value;
  const avatarUrl = document.getElementById("avatar").src;

  console.log(auth.currentUser.email);

  const userRef = doc(db, "users", uid);
  setDoc(userRef, {
    name,
    bakeryName,
    email: auth.currentUser.email,
    avatar: avatarUrl,
  })
    .then(() => {
      showSuccessToast("Perfil editado com sucesso!");

      if (email !== auth.currentUser.email) {
        updateEmail(auth.currentUser, email)
          .then(() => {
            loader.style.display = "none";

            setDoc(userRef, {
              name,
              bakeryName,
              email,
              avatar: avatarUrl,
            })
              .then(() => {
                showSuccessToast("Email alterado com sucesso!");
              })
              .catch((error) => {
                loader.style.display = "none";
                console.error(error);
                showDangerToast("Ocorreu um erro interno no servidor.");
              });

            setTimeout(() => {
              window.location.reload();
            }, 2000);
          })
          .catch((error) => {
            setTimeout(() => {
              window.location.reload();
            }, 2000);
            loader.style.display = "none";
            console.error("error => ", error.message);
            if (
              error.message.includes(
                "Firebase: Please verify the new email before changing email"
              )
            ) {
              showDangerToast(
                "Você precisa verificar seu email anterior para poder alterar-lo. Verifique sua caixa de entrada e spam."
              );
              return;
            }
            showDangerToast(
              "Ocorreu um erro ao alterar o email. Tente novamente mais tarde."
            );
          });

        return;
      }

      loader.style.display = "none";
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    })
    .catch((error) => {
      loader.style.display = "none";
      console.error(error);
      showDangerToast("Erro interno no servidor. Tente novamente mais tarde.");
    });
  return;
});

window.addEventListener("load", async () => {
  const createdSidebar = await createSidebar("management");
  sidebar.appendChild(createdSidebar);
});

window.addEventListener("load", async () => {
  loader.style.display = "block";
  const name = document.getElementById("name");
  const avatar = document.getElementById("avatar");
  const email = document.getElementById("email");
  const bakeryName = document.getElementById("bakeryName");

  const { uid } = sessionGetUser();

  const userRef = doc(db, "users", uid);
  getDoc(userRef)
    .then((doc) => {
      if (doc.exists()) {
        const user = doc.data();
        name.value = user.name;
        email.value = user.email;
        bakeryName.value = user.bakeryName;

        if (!auth.currentUser.emailVerified) {
          console.log(auth.currentUser);
          document.getElementById("notVerifiedEmail").style.display = "block";
        } else {
          document.getElementById("notVerifiedEmail").style.display = "none";
        }

        if (user.avatar) {
          avatar.src = user.avatar;
        }
      } else {
        showDangerToast("Erro interno no servidor. Tente novamente.");
      }
      loader.style.display = "none";
    })
    .catch((error) => {
      loader.style.display = "none";
      console.error("Error getting document:", error);
      showDangerToast("Erro interno no servidor. Tente novamente mais tarde.");
    });
});
