// import axios from "./axios";

// import axios from "axios";

const logoutButton = document.querySelector(".nav__el--logout");

const login = async (e: SubmitEvent) => {
  try {
    e.preventDefault();
    const emailInput = document.getElementById("email") as HTMLInputElement;
    const passwordInput = document.getElementById(
      "password"
    ) as HTMLInputElement;
    const email: string = emailInput.value;
    const password = passwordInput.value;
    await axios
      .post("/api/v1/users/signin", { email, password })
      .then((res) => {
        window.location.pathname = "/";
      });
  } catch (err) {
    alert(err?.response?.data);
  }
};

const logout = async () => {
  try {
    await axios
      .post("/api/v1/users/signout")
      .then((res) => (window.location.pathname = "/"));
  } catch (err) {
    alert(err?.response?.data);
  }
};
if (logoutButton) logoutButton.addEventListener("click", logout);

document.querySelector(".form.form__login").addEventListener("submit", login);
