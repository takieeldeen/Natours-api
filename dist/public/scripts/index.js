var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const profileDataForm = document.querySelector(".form.form-user-data");
const changePasswordForm = document.querySelector("form.form-user-settings");
// const
const changeProfileData = (e) => __awaiter(this, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const name = (_b = (_a = e === null || e === void 0 ? void 0 : e.target) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value;
        const email = (_d = (_c = e === null || e === void 0 ? void 0 : e.target) === null || _c === void 0 ? void 0 : _c[1]) === null || _d === void 0 ? void 0 : _d.value;
        yield axios.patch("/api/v1/users/updateCurrentUser", { name, email });
    }
    catch (err) {
        alert(err);
    }
});
const changeUserPassword = (e) => __awaiter(this, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    try {
        e.preventDefault();
        const oldPassword = (_b = (_a = e === null || e === void 0 ? void 0 : e.target) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value;
        const newPassword = (_d = (_c = e === null || e === void 0 ? void 0 : e.target) === null || _c === void 0 ? void 0 : _c[1]) === null || _d === void 0 ? void 0 : _d.value;
        const confirmPassword = (_f = (_e = e === null || e === void 0 ? void 0 : e.target) === null || _e === void 0 ? void 0 : _e[2]) === null || _f === void 0 ? void 0 : _f.value;
        yield axios.patch("/api/v1/users/changePassword", {
            oldPassword,
            newPassword,
            confirmPassword,
        });
    }
    catch (err) {
        alert(err);
    }
});
if (changePasswordForm)
    changePasswordForm.addEventListener("submit", changeUserPassword);
if (profileDataForm)
    profileDataForm.addEventListener("submit", changeProfileData);
//# sourceMappingURL=index.js.map