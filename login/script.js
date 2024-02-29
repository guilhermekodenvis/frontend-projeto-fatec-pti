const formLogin = document.getElementById("formLogin")
const btCreateNewAccount = document.getElementById("btCreateNewAccount")

formLogin.addEventListener("submit", async (e) => {
  e.preventDefault()
  
  const email = e.target.elements.email.value
  const password = e.target.elements.password.value
  
  const data = { email, password }
  console.log(data)
  // const response = await fetch("/login", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify(data),
  // })
  // if (response.status === 200) {
    window.location.href = "/dashboard"
  // } else {
  //   const error = await response.json()
  //   document.getElementById("error").innerText = error.message
  // }
})

btCreateNewAccount.addEventListener("click", () => {
  window.location.href = "/criar-nova-conta"
})

const togglePassword = () => {
  const password = document.getElementById('password')
  const eye = document.getElementById('eye')
  if (password.type === "password") {
    password.type = "text"
    const eyeOffSvg = feather.icons['eye-off'].toSvg({ class: 'icon-button', onclick: 'togglePassword()', id: 'eye' });
    const parser = new DOMParser();
    const eyeOffSvgElement = parser.parseFromString(eyeOffSvg, 'image/svg+xml').querySelector('svg');
    eye.replaceWith(eyeOffSvgElement);
  } else {
    password.type = "password"
    const eyeSvg = feather.icons['eye'].toSvg({ class: 'icon-button', onclick: 'togglePassword()', id: 'eye' });
    const parser = new DOMParser();
    const eyeSvgElement = parser.parseFromString(eyeSvg, 'image/svg+xml').querySelector('svg');
    eye.replaceWith(eyeSvgElement);
  }
}