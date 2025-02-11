// import axios from "./axios";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// import axios from "axios";
const logoutButton = document.querySelector(".nav__el--logout");
const login = (e) => __awaiter(this, void 0, void 0, function* () {
    var _a;
    try {
        e.preventDefault();
        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");
        const email = emailInput.value;
        const password = passwordInput.value;
        yield axios
            .post("/api/v1/users/signin", { email, password })
            .then((res) => {
            window.location.pathname = "/";
        });
    }
    catch (err) {
        alert((_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.data);
    }
});
const logout = () => __awaiter(this, void 0, void 0, function* () {
    var _a;
    try {
        yield axios
            .post("/api/v1/users/signout")
            .then((res) => (window.location.pathname = "/"));
    }
    catch (err) {
        alert((_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.data);
    }
});
if (logoutButton)
    logoutButton.addEventListener("click", logout);
document.querySelector(".form.form__login").addEventListener("submit", login);
//# sourceMappingURL=login.js.map