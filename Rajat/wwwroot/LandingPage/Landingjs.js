let currentSlide = 0;

function showSlide(index) {
    const slides = document.querySelectorAll('.slide');
    slides.forEach((s, i) => {
        s.classList.toggle('active', i === index);
    });
}

function nextSlide() {
    const slides = document.querySelectorAll('.slide');
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function prevSlide() {
    const slides = document.querySelectorAll('.slide');
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

// Auto-slide every 5 seconds
document.addEventListener("DOMContentLoaded", function () {
    showSlide(currentSlide);
    setInterval(() => {
        nextSlide();
    }, 5000);
});

// ------------------ Main Form Validation ------------------
window.formValidate = function (action, formId) {
  var isValid = true;
  var form = formId ? document.getElementById(formId) : document.querySelector("form");

  if (!form) return true;

  clearAllErrors(form);

  form.querySelectorAll(".required").forEach(function (el) {
    var msg = el.getAttribute("Msgtext") || "This field is required";

    if (el.type === "checkbox" || el.type === "radio") {
      if (!el.checked) { showError(el, msg); isValid = false; }
      else clearError(el);
      return;
    }

    if (el.tagName === "SELECT") {
      if (isNullOrEmpty(el.value) || el.value === "0") { showError(el, msg); isValid = false; }
      else clearError(el);
      return;
    }

    if (isNullOrEmpty(el.value)) { showError(el, msg); isValid = false; }
    else clearError(el);
  });

  form.querySelectorAll("[data-validate='email']").forEach(function (el) {
    if (!isNullOrEmpty(el.value) && !isValidEmail(el.value)) { showError(el, "Invalid email"); isValid = false; }
  });

  form.querySelectorAll("[data-validate='date']").forEach(function (el) {
    if (!isNullOrEmpty(el.value) && !isValidDate(el.value)) { showError(el, "Invalid date"); isValid = false; }
  });

  form.querySelectorAll("input[type='file']").forEach(function (el) {
    var maxMB = el.getAttribute("data-maxmb") || 5;
    var types = el.getAttribute("data-types");
    var allowedTypes = types ? types.split(",") : null;
    if (!validateFile(el, maxMB, allowedTypes)) isValid = false;
  });

  return isValid;
};

// ------------------ Live Fix (remove red when user corrects) ------------------
document.addEventListener("input", function (e) {
  if (e.target.classList.contains("required") && e.target.value.trim() !== "") {
    clearError(e.target);
  }
});

document.addEventListener("change", function (e) {
  if (e.target.classList.contains("required") && e.target.value !== "" && e.target.value !== "0") {
    clearError(e.target);
  }
});

$(document).on("change", ".select2", function () {
  if ($(this).val()) {
    clearError(this);
    $(this).next(".select2-container").find(".select2-selection")
      .removeClass("is-invalid").addClass("is-valid");
  }
});


function DivShowSection(ids) {
  if (!ids) return;
  ids.split(',').map(s => s.trim()).filter(Boolean).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('d-none');
  });
}

function DivHideSection(ids) {
  if (!ids) return;
  ids.split(',').map(s => s.trim()).filter(Boolean).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('d-none');
  });
}

