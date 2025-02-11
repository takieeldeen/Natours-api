const profileDataForm = document.querySelector(
  ".form.form-user-data"
) as HTMLFormElement;

const changePasswordForm = document.querySelector(
  "form.form-user-settings"
) as HTMLFormElement;

// const

const changeProfileData = async (e: SubmitEvent) => {
  try {
    const name: string | undefined = e?.target?.[0]?.value;
    const email: string | undefined = e?.target?.[1]?.value;
    await axios.patch("/api/v1/users/updateCurrentUser", { name, email });
  } catch (err) {
    alert(err);
  }
};

const changeUserPassword = async (e: SubmitEvent) => {
  try {
    e.preventDefault();
    const oldPassword: string | undefined = e?.target?.[0]?.value;
    const newPassword: string | undefined = e?.target?.[1]?.value;
    const confirmPassword: string | undefined = e?.target?.[2]?.value;
    await axios.patch("/api/v1/users/changePassword", {
      oldPassword,
      newPassword,
      confirmPassword,
    });
  } catch (err) {
    alert(err);
  }
};

if (changePasswordForm)
  changePasswordForm.addEventListener("submit", changeUserPassword);

if (profileDataForm)
  profileDataForm.addEventListener("submit", changeProfileData);
