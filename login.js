document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const password = document.getElementById("loginPassword");
  const toggle = document.getElementById("togglePassword");
  const message = document.getElementById("loginMessage");
  if (!form || !password || !toggle || !message) return;

  toggle.addEventListener("click", () => {
    const showPassword = password.type === "password";
    password.type = showPassword ? "text" : "password";
    toggle.textContent = showPassword ? "Hide" : "Show";
    toggle.setAttribute(
      "aria-label",
      showPassword ? "Hide password" : "Show password",
    );
    toggle.setAttribute("aria-pressed", String(showPassword));
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    message.textContent =
      "Sign-in is not available yet because this demo has no account service. Your details have not been sent or saved.";
  });
});
