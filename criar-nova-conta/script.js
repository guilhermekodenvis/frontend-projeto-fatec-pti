const btGoToLogin = document.getElementById("btGoToLogin")

btGoToLogin.addEventListener("click", () => {
  const { pathname } = window.location;
  window.location.href = `${pathname.search("/frontend-projeto-fatec-pti") === 0 ? "/frontend-projeto-fatec-pti/login" : "/login"}`;
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