const formForgotPassword = document.getElementById("formForgotPassword")

const goToLogin = () => {
  window.location.href = "/login"
}

formForgotPassword.addEventListener("submit", async (e) => {
  e.preventDefault()

  const email = e.target.elements.email.value

  const data = { email }
  console.log(data)
  // const response = await fetch("/login", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify(data),
  // })
  // if (response.status === 200) {
    window.location.href = "/login"
  // } else {
  //   const error = await response.json()
  //   document.getElementById("error").innerText = error.message
  // }
})