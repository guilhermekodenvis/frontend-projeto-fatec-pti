const goToLogin = () => {
  const { pathname } = window.location;
  window.location.href = `${pathname.search("/frontend-projeto-fatec-pti") === 0 ? "/frontend-projeto-fatec-pti/login" : "/login"}`;
}