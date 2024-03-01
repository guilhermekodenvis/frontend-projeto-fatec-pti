import { getAuth, createUserWithEmailAndPassword  } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js'
import { doc, setDoc  } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js'
import { db } from './../assets/js/firebase-module.js'
import { sessionLogin } from '../assets/js/session-controller.js'
import { showDangerToast } from '../assets/js/toast.js'

const formCreateAccount = document.getElementById("formCreateAccount")

formCreateAccount.addEventListener("submit", async (e) => {
  e.preventDefault()

  const name = e.target.elements.name.value
  const bakeryName = e.target.elements.bakeryName.value
  const email = e.target.elements.email.value
  const password = e.target.elements.password.value

  const auth = getAuth();
  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    setDoc(doc(db, "users", user.uid), {
      name,
      bakeryName,
      email
    })
    .then(() => {
      sessionLogin(user)
    })
    .catch((error) => {
      console.error(error)
      showDangerToast("Erro ao criar um usuário. Tente novamente mais tarde.")
    });
  })
  .catch((error) => {
    console.error(error)
    showDangerToast("Erro ao criar um usuário. Tente novamente mais tarde.")
  }); 
})