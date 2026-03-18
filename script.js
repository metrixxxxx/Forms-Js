document.addEventListener("DOMContentLoaded", function() {
  // =====================
  // REGEX
  // =====================
  const nameRegex = /^[A-Za-z]+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  // =====================
  // ELEMENTS
  // =====================
  const form = document.getElementById("registrationForm");
  const firstName = document.getElementById("firstName");
  const middleName = document.getElementById("middleName");
  const lastName = document.getElementById("lastName");
  const course = document.getElementById("course");
  const gender = document.getElementsByName("gender");
  const terms = document.getElementById("terms");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");
  const submitBtn = form.querySelector("button[type='submit']");

  const meter = document.getElementById("strengthMeter");
  const strengthText = document.getElementById("strengthText");

  // =====================
  // HELPERS
  // =====================
  function formatName(input) {
    input.value = input.value
      .toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase());
  }

  function showError(input, message) {
    const formGroup = input.closest(".form-group");
    formGroup.querySelector(".error").textContent = message;
  }

  function clearErrors() {
    document.querySelectorAll(".error").forEach(e => (e.textContent = ""));
  }

  // =====================
  // PASSWORD STRENGTH
  // =====================
  function updatePasswordStrength() {
    const val = password.value;
    let strength = 0;

    if (!val) {
      meter.className = "";
      meter.style.width = "0";
      strengthText.textContent = "";
      return;
    }

    if (val.length >= 8) strength++;
    if (/[A-Z]/.test(val)) strength++;
    if (/\d/.test(val)) strength++;
    if (/[@$!%*?&]/.test(val)) strength++;

    meter.className = ""; // reset previous class

    if (strength <= 1) {
      meter.classList.add("weak");
      strengthText.textContent = "Weak";
      strengthText.style.color = "red";
      meter.style.width = "30%";
    } else if (strength <= 3) {
      meter.classList.add("medium");
      strengthText.textContent = "Medium";
      strengthText.style.color = "orange";
      meter.style.width = "65%";
    } else {
      meter.classList.add("strong");
      strengthText.textContent = "Strong";
      strengthText.style.color = "green";
      meter.style.width = "100%";
    }
  }

  // =====================
  // VALIDATION FUNCTIONS
  // =====================
  function validatePassword() {
    const error = password.closest(".form-group").querySelector(".error");
    if (!password.value) { error.textContent = ""; return; }
    if (!passwordRegex.test(password.value)) {
      error.textContent = "Min 8 chars, 1 uppercase, 1 number, 1 special char";
    } else { error.textContent = ""; }
  }

  function validateConfirmPassword() {
    const error = confirmPassword.closest(".form-group").querySelector(".error");
    if (!confirmPassword.value) { error.textContent = ""; return; }
    if (password.value !== confirmPassword.value) {
      error.textContent = "Passwords do not match";
    } else { error.textContent = ""; }
  }

  // =====================
  // PASSWORD TOGGLE
  // =====================
  window.togglePassword = function(id, icon) {
    const input = document.getElementById(id);
    if (input.type === "password") {
      input.type = "text";
      icon.textContent = "🙈";
    } else {
      input.type = "password";
      icon.textContent = "👁️";
    }
  }

  // =====================
  // MODAL HANDLING
  // =====================
  const modal = document.getElementById("successModal");
  const closeBtn = modal.querySelector(".close");
  const okBtn = document.getElementById("modalOkBtn");

  function openModal() { modal.style.display = "flex"; }
  function closeModal() { modal.style.display = "none"; }

  closeBtn.onclick = closeModal;
  okBtn.onclick = closeModal;
  window.onclick = function(event) { if (event.target === modal) closeModal(); };

  // =====================
  // LIVE EVENT LISTENERS
  // =====================
  password.addEventListener("input", () => {
    validatePassword();
    validateConfirmPassword();
    updatePasswordStrength();
  });

  confirmPassword.addEventListener("input", () => {
    validateConfirmPassword();
    updatePasswordStrength();
  });

  form.addEventListener("input", () => {
    submitBtn.disabled = !form.checkValidity();
  });

  // =====================
  // FORM SUBMISSION
  // =====================
  form.addEventListener("submit", function(e) {
    e.preventDefault();
    let isValid = true;
    clearErrors();

    formatName(firstName);
    formatName(middleName);
    formatName(lastName);

    if (!nameRegex.test(firstName.value)) { showError(firstName,"Only letters allowed"); isValid = false; }
    if (middleName.value && !nameRegex.test(middleName.value)) { showError(middleName,"Only letters allowed"); isValid = false; }
    if (!nameRegex.test(lastName.value)) { showError(lastName,"Only letters allowed"); isValid = false; }

    if (!course.value) { showError(course,"Please select a course"); isValid = false; }
    if (!passwordRegex.test(password.value)) { showError(password,"Invalid password format"); isValid = false; }
    if (password.value !== confirmPassword.value) { showError(confirmPassword,"Passwords do not match"); isValid = false; }

    let genderSelected = false;
    gender.forEach(g => { if (g.checked) genderSelected = true; });
    if (!genderSelected) { showError(gender[0],"Select gender"); isValid = false; }

    if (!terms.checked) { showError(terms,"You must accept terms"); isValid = false; }

    if (isValid) {
      openModal();
      form.reset();
      meter.className = "";
      meter.style.width = "0";
      strengthText.textContent = "";
    }
  });
});