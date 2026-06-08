
$(document).ready(function() {

  const $ddlDistrict = $('#ddlDistrict');
  const $ddlTehsil = $('#ddlTehsil');
  const $ddlVillage = $('#ddlVillage');
  const $ddlKhasra = $('#ddlKhasra');

  // Init select2
  $ddlDistrict.add($ddlTehsil).add($ddlVillage).add($ddlKhasra).select2({
    theme: 'bootstrap-5',
    width: '100%'
  });

  // Initial values (edit mode)
  const districtId = $ddlDistrict.val();
  const tehsilId = $ddlTehsil.val();
  const villageId = $ddlVillage.val();
  const khasraId = $ddlKhasra.val();

  if (districtId) {
    loadTehsil(districtId, tehsilId, villageId, khasraId);
  }
});

// 🔁 District change
$(document).on('change', '#ddlDistrict', function () {
  const districtId = $(this).val();

  resetDropdown($('#ddlTehsil'), '-- Select Tehsil --');
  resetDropdown($('#ddlVillage'), '-- Select Village --');
  resetDropdown($('#ddlKhasra'), '-- Select Khasra Number --');

  if (!districtId) return;
  loadTehsil(districtId, null, null, null);
});

// 🔁 Tehsil change
$(document).on('change', '#ddlTehsil', function () {
  const districtId = $('#ddlDistrict').val();
  const tehsilId = $(this).val();

  resetDropdown($('#ddlVillage'), '-- Select Village --');
  resetDropdown($('#ddlKhasra'), '-- Select Khasra Number --');

  if (!districtId || !tehsilId) return;
  loadVillage(districtId, tehsilId, null, null);
});

// 🔁 Village change → Load Khasra
$(document).on('change', '#ddlVillage', function () {
  const villageId = $(this).val();

  resetDropdown($('#ddlKhasra'), '-- Select Khasra Number --');

  if (!villageId) return;
  loadKhasra(villageId, null);
});

// ==========================
// AJAX
// ==========================

function loadTehsil(districtId, selectedTehsilId, selectedVillageId, selectedKhasraId) {
  $.get('/Common/Bind_Tehsil', { districtId })
    .done(function (res) {
      fillDropdown($('#ddlTehsil'), res, selectedTehsilId);

      if (selectedTehsilId) {
        loadVillage(districtId, selectedTehsilId, selectedVillageId, selectedKhasraId);
      }
    })
    .fail(function (e) {
      console.error('Bind_Tehsil failed', e);
    });
}

function loadVillage(districtId, tehsilId, selectedVillageId, selectedKhasraId) {
  $.get('/Common/Bind_Village', { districtId, tehsilId })
    .done(function (res) {
      fillDropdown($('#ddlVillage'), res, selectedVillageId);

      if (selectedVillageId) {
        loadKhasra(selectedVillageId, selectedKhasraId);
      }
    })
    .fail(function (e) {
      console.error('Bind_Village failed', e);
    });
}

function loadKhasra(villageId, selectedKhasraId) {
  $.get('/Common/Bind_Khasra', { villageId })
    .done(function (res) {

      // Normalize response (filter out placeholders like value "0")
      const items = Array.isArray(res)
        ? res.filter(x => x && x.value && x.value !== '0')
        : [];

      // Fill dropdown
      fillDropdown($('#ddlKhasra'), items, selectedKhasraId);

      const hasKhasra = items.length > 0;

      if (!hasKhasra) {
        // ❌ No records → show manual + dropdown NOT required, manual REQUIRED
        $('#divkhsra, #divRakba').removeClass('d-none');

        $('#ddlKhasra')
          .removeClass('required')
          .val('')
          .trigger('change.select2');

        $('#txtkhsra, #txtrkba')
          .addClass('required');
      } else {
        // ✅ Records exist → hide manual + dropdown REQUIRED, manual NOT required
        $('#divkhsra, #divRakba').addClass('d-none');

        $('#ddlKhasra')
          .addClass('required')
          .attr('required', 'required');

        $('#txtkhsra, #txtrkba')
          .removeClass('required')
          .val('');
      }
    })
    .fail(function () {
      // ❌ API error → treat as no records (force manual entry)
      fillDropdown($('#ddlKhasra'), [], null);

      $('#divkhsra, #divRakba').removeClass('d-none');

      $('#ddlKhasra')
        .removeClass('required')
        .val('')
        .trigger('change.select2');

      $('#txtkhsra, #txtrkba')
        .addClass('required')
        .attr('required', 'required');
    });
}




// ==========================
// Utils
// ==========================

function resetDropdown($ddl, placeholder) {
  $ddl
    .empty()
    .append(new Option(placeholder, ''))
    .val('')
    .trigger('change.select2');
}

function fillDropdown($ddl, data, selectedValue) {
  $ddl
    .empty()
    .append(new Option('-- Select --', ''));

  if (Array.isArray(data)) {
    data.forEach(item => {
      $ddl.append(new Option(item.text, item.value));
    });
  }

  if (selectedValue && $ddl.find(`option[value="${selectedValue}"]`).length) {
    $ddl.val(selectedValue).trigger('change.select2');
  } else {
    $ddl.trigger('change.select2');
  }
}
$(document).ready(function () {

  if ($('#ddlDistrict_Applicant').val()) {
    $('#ddlDistrict_Applicant').trigger('change');
  }

});

// 🔁 District change → load Tehsil (Applicant)
$(document).on('change', '#ddlDistrict_Applicant', function () {

  const districtId = $(this).val();
  const selectedTehsil = $('#selectedApplicantTehsil').val();

  const $ddlTehsil = $('#ddlTehsil_Applicant');

  // Reset Tehsil
  $ddlTehsil.empty().append('<option value="">-- Select Tehsil --</option>');

  if (!districtId) return;

  $.ajax({
    url: '/Common/Bind_Tehsil',
    type: 'GET',
    data: { districtId: districtId },
    success: function (res) {

      $.each(res, function (i, item) {
        $ddlTehsil.append(`<option value="${item.value}">${item.text}</option>`);
      });

      // ✅ Set selected value
      if (selectedTehsil) {
        $ddlTehsil.val(selectedTehsil);
      }

      // Refresh Select2
      $ddlTehsil.trigger('change.select2');
    },
    error: function (e) {
      console.error('Bind_Tehsil (Applicant) failed', e);
      alert('Tehsil load failed – check console');
    }
  });

});
$(document).ready(function () {

  if ($('#ddlDistrict_Non_Applicant').val()) {
    $('#ddlDistrict_Non_Applicant').trigger('change');
  }

});

// 🔁 District change → load Tehsil (Applicant)
$(document).on('change', '#ddlDistrict_Non_Applicant', function () {

  const districtId = $(this).val();
  const selectedTehsil = $('#Non_Applicant_selectedTehsil').val();

  const $ddlTehsil = $('#ddlTehsil_NonApplicant');

  // Reset Tehsil
  $ddlTehsil.empty().append('<option value="">-- Select Tehsil --</option>');

  if (!districtId) return;

  $.ajax({
    url: '/Common/Bind_Tehsil',
    type: 'GET',
    data: { districtId: districtId },
    success: function (res) {

      $.each(res, function (i, item) {
        $ddlTehsil.append(`<option value="${item.value}">${item.text}</option>`);
      });

      // ✅ Set selected value
      if (selectedTehsil) {
        $ddlTehsil.val(selectedTehsil);
      }

      // Refresh Select2
      $ddlTehsil.trigger('change.select2');
    },
    error: function (e) {
      console.error('Bind_Tehsil (Applicant) failed', e);
      alert('Tehsil load failed – check console');
    }
  });

});

$(document).ready(function () {

  if ($('#ddlDistrict_Sanrakshk').val()) {
    $('#ddlDistrict_Sanrakshk').trigger('change');
  }

});

$(document).on('change', '#ddlDistrict_Sanrakshk', function () {

  const districtId = $(this).val();
  

  const selectedTehsil = $('#selectedTehsil').val();

  const $ddlTehsil = $('#ddlTehsil_Sanrakshk');

  $ddlTehsil.empty().append('<option value="">-- Select Tehsil --</option>');

  if (!districtId) {
    return;
  }

  $.ajax({
    url: '/Common/Bind_Tehsil',
    type: 'GET',
    data: { districtId: districtId },
    success: function (res) {


      $.each(res, function (i, item) {
        $ddlTehsil.append(`<option value="${item.value}">${item.text}</option>`);
      });

      // Set selected value
      if (selectedTehsil) {

        $ddlTehsil.val(selectedTehsil);
      }



      // Refresh Select2 UI
      $ddlTehsil.trigger('change.select2');
    },
    error: function (e) {
      console.error('Bind_Tehsil AJAX failed:', e);
    }
  });

});
$(document).ready(function () {

  if ($('#ddlDistrict_SanrakshkNonApplicant').val()) {
    $('#ddlDistrict_SanrakshkNonApplicant').trigger('change');
  }

});

$(document).on('change', '#ddlDistrict_SanrakshkNonApplicant', function () {

  const districtId = $(this).val();
  
  const selectedTehsil = $('#Non_Applicant_selectedApplicantTehsil').val();

  const $ddlTehsil = $('#ddlTehsil_SanrakshkNonApplicant');

  $ddlTehsil.empty().append('<option value="">-- Select Tehsil --</option>');

  if (!districtId) {
    return;
  }

  $.ajax({
    url: '/Common/Bind_Tehsil',
    type: 'GET',
    data: { districtId: districtId },
    success: function (res) {


      $.each(res, function (i, item) {
        $ddlTehsil.append(`<option value="${item.value}">${item.text}</option>`);
      });

      // Set selected value
      if (selectedTehsil) {

        $ddlTehsil.val(selectedTehsil);
      }



      // Refresh Select2 UI
      $ddlTehsil.trigger('change.select2');
    },
    error: function (e) {
      console.error('Bind_Tehsil AJAX failed:', e);
    }
  });

});

$(document).ready(function () {

  // 🔁 Bind when District or Court changes
  $('#lawsuitddlDistrict, #dllCourt').on('change', function () {
    bindRevenueCourt();
  });

  // 🔥 Page load (edit mode)
  bindRevenueCourt();
});

function bindRevenueCourt() {

  let districtCode = $('#lawsuitddlDistrict').val();
  let officeTypeCode = $('#dllCourt').val();   // Court dropdown

  const $ddl = $('#dllRevenueCourt');
  $ddl.empty().removeClass('readonly'); // reset readonly first

  // ❌ Call API only when BOTH selected
  if (!districtCode || !officeTypeCode) {
    $ddl.addClass('readonly');           // 🔒 lock when incomplete
    $ddl.trigger('change.select2');
    return;
  }

  $.getJSON('/Common/Bind_Office', {
    districtcode: districtCode,
    office_type_code: officeTypeCode
  }, function (data) {

    $.each(data, function (i, item) {
      $ddl.append(`<option value="${item.value}">${item.text}</option>`);
    });

    // 🔒 Make Revenue Court readonly after binding
    $ddl.addClass('readonly');

    $ddl.trigger('change.select2');
  });
}

$(document).ready(function () {

  // 🔁 Bind when Act dropdown OR VaadType radio changes
  $('#dllAct').on('change', bindRelevant_Sections);
  $(document).on('change', 'input[name="Case_Avaden_Type"]', bindRelevant_Sections);

  // 🔥 Optional: bind on page load (edit mode)
  bindRelevant_Sections();
});

function bindRelevant_Sections() {

  let actCode = $('#dllAct').val();
  let vaadType = $('input[name="Case_Avaden_Type"]:checked').val();

  const $ddl = $('#dllRelevant_Sections');
  $ddl.empty();

  // ⭐ get hidden selected values
  let selectedSections = $('input[name="relevant_section"]').val();

  if (!actCode || vaadType === undefined) {
    $ddl.trigger('change.select2');
    return;
  }

  $.getJSON('/Common/Bind_Relevant_Sections', {
    actCode: actCode,
    vaadType: vaadType
  }, function (data) {

    $.each(data, function (i, item) {
      $ddl.append(`<option value="${item.value}">${item.text}</option>`);
    });

    // ⭐ if hidden field has value then select
    if (selectedSections) {

      // convert string to array
      let selectedArray = selectedSections.split(',');

      $ddl.val(selectedArray).trigger('change.select2');
    }
    else {
      $ddl.trigger('change.select2');
    }

  });
}


$(document).ready(function () {

  // 🔥 read selected value from hidden input
  const selectedRevenueCourt = $('#Selected_Subordinate_Revenue_Court_code').val();

  // bind change
  $('#SubordinateddlDistrict, #dllSubordinateCourt').on('change', function () {
    SubordinatebindRevenueCourt(null);
  });

  // page load
  SubordinatebindRevenueCourt(selectedRevenueCourt);

});


function SubordinatebindRevenueCourt(selectedVal = null) {

  let districtCode = $('#SubordinateddlDistrict').val();
  let officeTypeCode = $('#dllSubordinateCourt').val();

  const $ddl = $('#dllSubordinateRevenueCourt');

  $ddl.empty().removeClass('readonly');

  $ddl.append('<option value="">-- Select Revenue Court --</option>');

  if (!districtCode || !officeTypeCode) {
    $ddl.trigger('change.select2');
    return;
  }

  $.getJSON('/Common/Bind_Office', {
    districtcode: districtCode,
    office_type_code: officeTypeCode
  }, function (data) {


    $.each(data, function (i, item) {

      let selected = (selectedVal && selectedVal == item.value) ? 'selected' : '';

      $ddl.append(`<option value="${item.value}" ${selected}>${item.text}</option>`);

    });

    // refresh select2
    $ddl.trigger('change.select2');

  });

}



$("#SelectedMonth, #SelectedYear").change(function () {
  console.log("Dropdown changed");
    var month = $("#SelectedMonth").val();
  var year = $("#SelectedYear").val();

  if (month !== "" && year !== "") {

    $.ajax({
      url: '/Reports/GetCaseNoByMonthYear',
      type: 'POST',
      data: {
        SelectedMonth: month,
        SelectedYear: year
      },
      success: function (data) {
        console.log("Server Response:", data);
        var ddl = $("#SelectedCaseNo");
        ddl.empty();

        ddl.append('<option value="">--Select Case No--</option>');

        $.each(data, function (i, item) {

          ddl.append('<option value="' + item.value + '">' + item.text + '</option>');

        });
      }
    });

    }

});

$("#SelectedCaseNo").change(function () {

  var caseno = $(this).val();

  if (caseno !== "") {

    $.ajax({
      url: '/Report/GetNoticeNo',
      type: 'POST',
      data: { caseno: caseno },

      success: function (data) {

        var ddl = $("#SelectedNoticeNo");
        ddl.empty();

        ddl.append('<option value="">--Select Notice No--</option>');

        $.each(data, function (i, item) {

          ddl.append('<option value="' + item.value + '">' + item.text + '</option>');

        });

      }
    });

  }

});

  // ✅ ALWAYS WORKS (even after partial reload / select2 reinit)
  $(document).on('select2:select', '#dllCase', function(e) {

    let caseNo = e.params.data.id;
    loadCaseDetails(caseNo);
  });

