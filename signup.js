document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm");
  const password = document.getElementById("signupPassword");
  const confirmation = document.getElementById("confirmPassword");
  const message = document.getElementById("signupMessage");
  if (!form || !password || !confirmation || !message) return;

  const validatePasswordMatch = () => {
    confirmation.setCustomValidity(
      confirmation.value && confirmation.value !== password.value
        ? "Passwords must match."
        : "",
    );
  };

  password.addEventListener("input", validatePasswordMatch);
  confirmation.addEventListener("input", validatePasswordMatch);

  form.querySelectorAll("[data-password-toggle]").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const field = document.getElementById(toggle.dataset.passwordToggle);
      if (!field) return;
      const showPassword = field.type === "password";
      field.type = showPassword ? "text" : "password";
      toggle.textContent = showPassword ? "Hide" : "Show";
      toggle.setAttribute(
        "aria-label",
        showPassword ? "Hide password" : "Show password",
      );
      toggle.setAttribute("aria-pressed", String(showPassword));
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    validatePasswordMatch();
    if (!form.reportValidity()) return;
    message.textContent =
      "Account registration is not available yet because this demo has no account service. Your details have not been sent or saved.";
  });
});
