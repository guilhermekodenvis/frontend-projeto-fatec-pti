import { showSuccessToast, showWarningToast } from "./toast.js";

export const sessionLogin = (user) => {
  sessionStorage.setItem("CaaS@user", JSON.stringify(user))
  showSuccessToast("Bem-vindo de volta!")
  setTimeout(() => {
    window.location.href = "/dashboard"
  }, 2000);
}

export const sessionLogout = () => {
  sessionStorage.removeItem("CaaS@user")
  showWarningToast("Até mais! Volte sempre.")
  setTimeout(() => {
    window.location.href = "/"
  }, 2000);
}

export const sessionGetUser = () => {
  return JSON.parse(sessionStorage.getItem("CaaS@user"))
}
