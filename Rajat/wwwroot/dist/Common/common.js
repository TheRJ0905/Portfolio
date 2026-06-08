/* ==========================================================
   common.js - Global JS for REV / AdminLTE 3 Projects
   ========================================================== */

(function () {
  "use strict";

  // ------------------ Utilities ------------------
  window.isNullOrEmpty = function (val) {
    return val === undefined || val === null || val.toString().trim() === "";
  };

  window.onlyNumbers = function (evt) {
    var ch = evt.which ? evt.which : evt.keyCode;
    if (ch >= 48 && ch <= 57) return true;
    evt.preventDefault();
    return false;
  };

  window.onlyAlphaNumeric = function (evt) {
    var ch = evt.which ? evt.which : evt.keyCode;
    if ((ch >= 48 && ch <= 57) || (ch >= 65 && ch <= 90) || (ch >= 97 && ch <= 122)) return true;
    evt.preventDefault();
    return false;
  };

  // ------------------ SweetAlert Success ------------------
  window.popupSuccessHtml = function(html, title) {
    Swal.fire({
      icon: 'success',
      title: title || 'Success',
      html: html,

      width: '420px',
      padding: '1.5em',

      background: 'rgba(40, 167, 69, 0.65)',
      backdrop: `
            rgba(0,0,0,0.6)
            blur(10px)
        `,

      color: '#ffffff',
      iconColor: '#ffffff',

      // ✅ Icon inside button
      confirmButtonText: '<i class="fas fa-check-circle"></i> OK',

      customClass: {
        popup: 'glass-popup',
        confirmButton: 'glass-ok-btn',
        title: 'swal-white-text',
        htmlContainer: 'swal-white-text'
      },

      buttonsStyling: false
    });
  };


  // ------------------ SweetAlert Error ------------------
  window.popupErrorHtml = function(html, title) {
    Swal.fire({
      icon: 'error',
      title: title || 'Error',
      html: html,

      width: '420px',
      padding: '1.5em',

      background: 'rgba(220, 53, 69, 0.65)',
      backdrop: `
            rgba(0,0,0,0.6)
            blur(10px)
        `,

      color: '#ffffff',
      iconColor: '#ffffff',

      confirmButtonText: '<i class="fas fa-times-circle"></i> OK',

      customClass: {
        popup: 'glass-popup',
        confirmButton: 'glass-ok-btn',
        title: 'swal-white-text',
        htmlContainer: 'swal-white-text'
      },

      buttonsStyling: false
    });
  };


  // ------------------ SweetAlert Info ------------------
  window.popupInfoHtml = function(html, title) {
    Swal.fire({
      icon: 'info',
      title: title || 'Info',
      html: html,

      width: '420px',
      padding: '1.5em',

      background: 'rgba(23, 162, 184, 0.65)',
      backdrop: `
            rgba(0,0,0,0.6)
            blur(10px)
        `,

      color: '#ffffff',
      iconColor: '#ffffff',

      confirmButtonText: '<i class="fas fa-info-circle"></i> OK',

      customClass: {
        popup: 'glass-popup',
        confirmButton: 'glass-ok-btn',
        title: 'swal-white-text',
        htmlContainer: 'swal-white-text'
      },

      buttonsStyling: false
    });
  };

  // ------------------ Error UI Helpers ------------------
  window.showError = function (input, message) {
    if (!input) return;

    input.classList.add("is-invalid");
    input.classList.remove("is-valid");

    let group = input.closest(".form-group") || input.parentNode;
    let span = group.querySelector(".invalid-feedback");

    if (!span) {
      span = document.createElement("div");
      span.className = "invalid-feedback";
      group.appendChild(span);
    }

    span.innerText = message;
  };

  window.clearError = function (input) {
    if (!input) return;

    input.classList.remove("is-invalid");
    input.classList.add("is-valid");

    let group = input.closest(".form-group") || input.parentNode;
    let span = group.querySelector(".invalid-feedback");

    if (span) span.remove();
  };

  window.clearAllErrors = function (form) {
    if (!form) return;

    form.querySelectorAll(".is-invalid, .is-valid").forEach(el => {
      el.classList.remove("is-invalid", "is-valid");
    });

    form.querySelectorAll(".invalid-feedback").forEach(el => el.remove());
  };

  // ------------------ Validators ------------------
  function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }

  function isValidDate(val) {
    return !isNaN(Date.parse(val));
  }

  function validateFile(input, maxMB, allowedTypes) {
    if (!input.files || input.files.length === 0) return true;

    var file = input.files[0];
    var maxSize = (maxMB || 5) * 1024 * 1024;

    if (file.size > maxSize) {
      showError(input, "File size must be less than " + (maxMB || 5) + " MB");
      return false;
    }

    if (allowedTypes && allowedTypes.length) {
      var ext = file.name.split('.').pop().toLowerCase();
      if (allowedTypes.indexOf(ext) === -1) {
        showError(input, "Allowed file types: " + allowedTypes.join(", "));
        return false;
      }
    }

    clearError(input);
    return true;
  }

  // ------------------ Main Form Validation ------------------
  window.formValidate = function (sectionId, formId) {
    var isValid = true;
    var form = formId ? document.getElementById(formId) : document.querySelector("form");

    if (!form) return true;

    // 🔥 If sectionId is passed, validate only inside that section
    var container = sectionId
      ? document.getElementById(sectionId)
      : form;

    if (!container) return true;

    clearAllErrors(container);

    container.querySelectorAll(".required").forEach(function (el) {
      var msg = el.getAttribute("MsgText") || "This field is required";

      // ✅ Radio / Checkbox (validate group once)
      if (el.type === "checkbox" || el.type === "radio") {
        var group = container.querySelectorAll(`[name='${el.name}']:checked`);
        if (!group.length) {
          showError(el, msg);
          isValid = false;
        } else {
          clearError(el);
        }
        return;
      }

      // ✅ Select
      if (el.tagName === "SELECT") {
        if (isNullOrEmpty(el.value) || el.value === "-1") {
          showError(el, msg);
          isValid = false;
        } else {
          clearError(el);
        }
        return;
      }

      // ✅ Input/Textarea
      if (isNullOrEmpty(el.value)) {
        showError(el, msg);
        isValid = false;
      } else {
        clearError(el);
      }
    });

    // 🔹 Email validation (only inside section)
    container.querySelectorAll("[data-validate='email']").forEach(function (el) {
      if (!isNullOrEmpty(el.value) && !isValidEmail(el.value)) {
        showError(el, "Invalid email");
        isValid = false;
      }
    });

    // 🔹 Date validation (only inside section)
    container.querySelectorAll("[data-validate='date']").forEach(function (el) {
      if (!isNullOrEmpty(el.value) && !isValidDate(el.value)) {
        showError(el, "Invalid date");
        isValid = false;
      }
    });

    // 🔹 File validation (only inside section)
    container.querySelectorAll("input[type='file']").forEach(function (el) {
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

  // ------------------ DataTables (AdminLTE 3 Perfect UI) ------------------
  window.initDataTable = function (selector) {
    if (!window.$ || !$.fn.DataTable) return;
    if ($.fn.DataTable.isDataTable(selector)) return;

    $(selector).DataTable({
      responsive: true,
      lengthChange: true,
      autoWidth: false,
      paging: true,
      searching: true,
      ordering: true,
      info: true,
      pageLength: 10,

      dom:
        "<'row mb-2'<'col-sm-12 col-md-6 d-flex align-items-center'<'mr-3'l><'dt-buttons btn-group'B>>" +
        "<'col-sm-12 col-md-6 text-right'f>>" +
        "<'row'<'col-12'tr>>" +
        "<'row mt-2'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7 d-flex justify-content-end'p>>",

      buttons: [
        { extend: 'excelHtml5', className: 'btn btn-success btn-sm mr-2', text: '<i class="fas fa-file-excel mr-1"></i> Excel' },
        { extend: 'csvHtml5', className: 'btn btn-info btn-sm mr-2', text: '<i class="fas fa-file-csv mr-1"></i> CSV' },
        { extend: 'pdfHtml5', className: 'btn btn-danger btn-sm mr-2', text: '<i class="fas fa-file-pdf mr-1"></i> PDF', orientation: 'landscape' },
        { extend: 'print', className: 'btn btn-primary btn-sm mr-2', text: '<i class="fas fa-print mr-1"></i> Print' },
        { extend: 'colvis', className: 'btn btn-dark btn-sm', text: '<i class="fas fa-columns mr-1"></i> Columns' }
      ]
    });
  };

  $(function () {
    $(".datatable").each(function () {
      initDataTable(this);
    });
  });

})();
function DivShowSection(ids) {
  if (!ids) return;

  ids.split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;

      el.classList.remove('d-none');

      if (el.style && el.style.display === 'none') {
        el.style.display = '';
      }
    });
}

function DivHideSection(ids) {
  if (!ids) return;

  ids.split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;

      // Add Bootstrap hide class
      el.classList.add('d-none');

      // Also force inline display:none (for non-Bootstrap cases)
      el.style.display = 'none';
    });
}


   // ---------------- Master icon list  ----------------

const iconList = [
  "fas fa-home", "fas fa-search", "fas fa-calendar-alt", "fas fa-unlink",
  "fas fa-gavel", "fas fa-balance-scale",
  "fas fa-file", "fas fa-file-alt", "fas fa-file-circle-plus","fas fa-file-medical", "fas fa-folder", "fas fa-folder-open",
  "fas fa-chart-bar", "fas fa-chart-line", "fas fa-database",
  "fas fa-plus", "fas fa-minus", "fas fa-edit", "fa fa-trash-alt", "fas fa-eye", "fas fa-print", "fas fa-download", "fas fa-upload",
  "fas fa-user", "fas fa-users",
  "fas fa-cog", "fas fa-gear", "fas fa-lock", "fas fa-unlock",
  "fas fa-bell", "fas fa-info-circle", "fas fa-check", "fas fa-times",
  "far fa-circle"
];

// Format name
function formatIconName(iconClass) {
  return iconClass.split(" ")[1].replace("fa-", "");
}

// Load dropdown
function loadIconDropdown(selectId, selectedValue = null) {

  const $dropdown = $("#" + selectId);
  $dropdown.empty();

  iconList.forEach(icon => {
    const name = formatIconName(icon);
    const option = new Option(name, icon, false, icon === selectedValue);
    $dropdown.append(option);
  });

  $dropdown.select2({
    width: '100%',
    templateResult: formatIconOption,
    templateSelection: formatIconOption,
    escapeMarkup: function (markup) { return markup; }
  });
}

// Icon rendering inside dropdown
function formatIconOption(iconClass) {
  if (!iconClass.id) return iconClass.text;

  return `
        <span>
            <i class="${iconClass.id}" style="margin-right:10px;"></i>
            ${iconClass.text}
        </span>
    `;
}


document.querySelectorAll('.hindi-only').forEach(input => {
  input.addEventListener('input', function () {
    this.value = this.value.replace(/[^\u0900-\u097F\s]/g, '');
    clearError(this);
  });
});

// 🔹 Only Number
document.querySelectorAll('.onlynumber').forEach(input => {
  input.addEventListener('input', function () {
    this.value = this.value.replace(/\D/g, '');
    clearError(this);
  });
});

// 🔹 Mobile Number (10 digits)
document.querySelectorAll('.mobilenumber').forEach(input => {
  input.addEventListener('input', function () {
    this.value = this.value.replace(/\D/g, '').slice(0, 10);
    clearError(this);
  });
});

// 🔹 Email Validation (basic)
document.querySelectorAll('.email').forEach(input => {
  input.addEventListener('blur', function () {
    if (!this.value) {
      clearError(this);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.value)) {
      showError(this, this.getAttribute('MsgText') || 'Invalid Email');
    } else {
      clearError(this);
    }
  });
});

function showError(el, msg) {
  clearError(el);

  const span = document.createElement('span');
  span.className = 'text-danger small validation-error';
  span.innerText = msg;

  el.classList.add('border-danger');

  // add error span just after input
  el.insertAdjacentElement('afterend', span);
}

function clearError(el) {
  el.classList.remove('border-danger');
  const err = el.parentElement.querySelector('.validation-error');
  if (err) err.remove();
}
document.addEventListener('DOMContentLoaded', function () {
  if (!window.tempusDominus || !window.tempusDominus.TempusDominus) return;

  document.querySelectorAll('.td-picker').forEach(el => {
    // Prevent double init
    if (el._tdInstance) return;

    el._tdInstance = new tempusDominus.TempusDominus(el, {
      localization: {
        format: 'dd/MM/yyyy'
      },
      display: {
        icons: {
          previous: 'fas fa-chevron-left',
          next: 'fas fa-chevron-right',
          today: 'fas fa-calendar-day',
          clear: 'fa fa-trash-alt',
          close: 'fas fa-times'
        },
        components: {
          calendar: true,
          clock: false
        }
      }
    });
  });
});

$(document).ready(function () {
  $('.select2').each(function () {
    $(this).select2({
      theme: 'bootstrap-5',
      width: '100%',
      placeholder: $(this).data('placeholder')
    });
  });


    $('.summernote').summernote({
      height: 200,
      placeholder: 'यहाँ विवरण लिखें...',
      toolbar: [
        ['style', ['bold', 'italic', 'underline', 'clear']],
        ['font', ['fontsize', 'color']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['insert', ['link']],
        ['view', ['codeview']]
      ]
    });

  
});
// ✅ 1️⃣ Create Toast FIRST (FORCEFUL + Attractive)
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 5000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;

    // 🔥 Force base styles (beat AdminLTE overrides)
    const forceBaseStyles = () => {
      toast.style.setProperty('border-radius', '14px', 'important');
      toast.style.setProperty('box-shadow', '0 12px 30px rgba(0,0,0,0.25)', 'important');
      toast.style.setProperty('padding', '12px 16px', 'important');
      toast.style.setProperty('backdrop-filter', 'blur(6px)', 'important');

      const title = toast.querySelector('.swal2-title');
      if (title) {
        title.style.setProperty('color', '#ffffff', 'important');
        title.style.setProperty('font-size', '14px', 'important');
        title.style.setProperty('font-weight', '700', 'important');
        title.style.setProperty('line-height', '1.35', 'important');
      }

      const content = toast.querySelector('.swal2-html-container');
      if (content) {
        content.style.setProperty('color', '#ffffff', 'important');
        content.style.setProperty('font-size', '13px', 'important');
      }
    };

    // Apply immediately + re-apply to beat late CSS
    forceBaseStyles();
    setTimeout(forceBaseStyles, 0);
    setTimeout(forceBaseStyles, 50);
  }
});

function showSuccessToast(message) {
    Toast.fire({
      icon: 'success',
      title: message,

      background: 'rgba(40, 167, 69, 0.65)',
      color: '#ffffff',
      iconColor: '#ffffff',

      customClass: {
        popup: 'glass-toast',
        title: 'swal-white-text'
      }
    });
  }

  function showErrorToast(message) {
    Toast.fire({
      icon: 'error',
      title: message,

      background: 'rgba(220, 53, 69, 0.65)',
      color: '#ffffff',
      iconColor: '#ffffff',

      customClass: {
        popup: 'glass-toast',
        title: 'swal-white-text'
      }
    });
  }


function setHiddenValueBeforeSubmit(hiddenId, value) {
  const hiddenField = document.getElementById(hiddenId);
  if (!hiddenField) {
    console.warn(`Hidden field with id "${hiddenId}" not found!`);
    return true; // allow form submission anyway
  }
  hiddenField.value = value;
  return true; // continue normal form submit
}
document.addEventListener("blur", function (e) {

  if (e.target.classList.contains("minage18")) {

    let value = parseInt(e.target.value);

    if (!isNaN(value) && value < 18) {

      Swal.fire({
        icon: 'warning',
        title: 'Invalid Age',
        text: 'Age must be 18 or above',
        confirmButtonColor: '#3085d6'
      }).then(() => {
        e.target.focus();
      });

    }

  }

}, true);

//$(document).ready(function () {

//  $('select.select2[multiple]').each(function () {

//    let $this = $(this);
//    let msg = $this.attr('Msgtext') || "Select option";

//    // Ensure placeholder option exists
//    if ($this.find('option[value=""]').length === 0) {
//      $this.prepend('<option value=""></option>');
//    }

//    $this.select2({
//      placeholder: msg,
//      allowClear: true,
//      width: '100%',

//      // Hide empty option from dropdown list
//      templateResult: function (data) {
//        if (!data.id) {
//          return null;
//        }
//        return data.text;
//      }

//    });

//  });

//});
//================ Dynamic Pdf Viewer ==============
function openPdfViewer(appId, fileName, type) {

    const url =
        `/Common/PdfViewer?appId=${appId}&fileName=${fileName}&type=${type}`;

    window.open(url, '_blank');
}
function printPage() {

    // find all collapse buttons
    var buttons = document.querySelectorAll('[data-card-widget="collapse"]');

    buttons.forEach(function (btn) {

        var card = btn.closest('.card');

        // if card is collapsed then click button to open
        if (card.classList.contains('collapsed-card')) {
            btn.click();
        }

    });

    // wait for animation to complete
    setTimeout(function () {
        window.print();
    }, 500);
}

function printDiv(divId) {
  var content = document.getElementById(divId).innerHTML;

  var myWindow = window.open('', '', 'width=900,height=700');

  myWindow.document.write(`
        <html>
        <head>
            <title>Print</title>

            <!-- ✅ Import existing page styles -->
            <link rel="stylesheet" href="/css/site.css">
            <link rel="stylesheet" href="/lib/bootstrap/dist/css/bootstrap.min.css">

        </head>
        <body onload="window.print(); window.close();">
            ${content}
        </body>
        </html>
    `);

  myWindow.document.close();
}
