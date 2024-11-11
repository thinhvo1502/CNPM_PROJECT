// Lấy giá trị của của object với key là một chuổi được phân cách bởi dấu .
// ví dụ: key là a.b.c.d
const __getProperty = function (obj, key, prefix = "") {
  key = key.replace(prefix, "");

  var parts = key.split("."),
    last = parts.pop(),
    l = parts.length,
    i = 1,
    current = parts[0];

  if (parts.length === 0) {
    return obj[key];
  }

  while ((obj = obj[current]) && i < l) {
    current = parts[i];
    i++;
  }

  if (obj) {
    return obj[last];
  }
};

const __togglePresent = function (arr, value) {
  var idx = arr.indexOf(value);
  if (idx >= 0) {
    arr.splice(idx, 1);
  } else {
    arr.push(value);
  }
};

const __settingSaveChangeContainer = (eleTable) => {
  eleTable &&
    $(window).scroll(function () {
      if (
        $(window).scrollTop() + $(window).height() > eleTable.offset().top &&
        $(window).scrollTop() + $(window).height() >
          eleTable.height() + eleTable.offset().top + 200
      ) {
        $("#buttom-save-container").addClass("stop");
      } else {
        $("#buttom-save-container").removeClass("stop");
      }
    });
};

const __CopyToClipboard = (text) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand("copy");
  } catch (err) {
    console.error("Unable to copy to clipboard", err);
  }
  document.body.removeChild(textArea);
};

// class xử lý modal chỉnh sửa một ô trong bảng
const __modalEditCell = function (modal, form, submit) {
  //@TODO: check đầu vào

  // Modal
  this.modal = modal;

  // Instance modal của boostrap
  this.modalInstance =
    bootstrap.Modal.getInstance(modal) || new bootstrap.Modal(modal, null);

  // Form chỉnh sửa hoặc thêm
  this.form = form;

  // Nút dùng để nhấn submit data
  this.submit = submit;

  // Các function xử lý các sự kiện
  this.__openModalForm = null;
  this.__closeModalForm = null;
  this.__submitModalForm = null;

  // cell đang chỉnh sửa của bảng tabulator
  this.cell = null;

  this.init = function () {
    let self = this;

    this.modal.addEventListener("shown.bs.modal", function (e) {
      typeof self.__openModalForm === "function" &&
        self.__openModalForm(e, self);
    });

    this.modal.addEventListener("hide.bs.modal", function (e) {
      typeof self.__closeModalForm === "function" &&
        self.__closeModalForm(e, self);

      // Reset lại function xử lý
      self.__openModalForm = null;
      self.__closeModalForm = null;
      self.__submitModalForm = null;
      self.cell = null;
      self.form.reset();
      self.form.classList.remove("was-validated");
    });

    $(this.submit).click((e) => {
      if (typeof self.__submitModalForm === "function") {
        self.__submitModalForm(e, self);
      }
    });
  };

  this.setCell = function (cell) {
    if (!cell) throw "Cell phải là một đối tượng cell của tabulator";
    this.cell = cell;
  };

  /**
   * Mở modal và bắt đầu chỉnh sửa
   * @param cell
   * @param __submitModalForm: Function sau khi submit
   * @param __openModalForm: Function khi mở
   * @param __closeModalForm: Function sau khi đóng
   */
  this.showModal = function (
    cell,
    { __submitModalForm, __openModalForm, __closeModalForm }
  ) {
    if (typeof __submitModalForm !== "undefined")
      this.__submitModalForm = __submitModalForm;

    if (typeof __openModalForm !== "undefined")
      this.__openModalForm = __openModalForm;

    if (typeof __closeModalForm !== "undefined")
      this.__closeModalForm = __closeModalForm;

    this.cell = cell;

    this.modalInstance && this.modalInstance.show();
  };
  this.init();
};

// Định nghĩa cho phần chỉnh sửa ô
const common_editors = {
  uppercaseInput: function (cell, onRendered, success, cancel, editorParams) {
    //create and style input
    var cellValue = cell.getValue().toUpperCase(),
      input = document.createElement("input");

    input.setAttribute("type", "text");

    input.style.padding = "4px";
    input.style.width = "100%";
    input.style.boxSizing = "border-box";

    input.value = cellValue;

    onRendered(function () {
      input.focus();
      input.style.height = "100%";
    });

    function onChange(e) {
      if (input.value !== cellValue) {
        success(input.value.toUpperCase());
      } else {
        cancel();
      }
    }

    //submit new value on blur or change
    input.addEventListener("change", onChange);
    input.addEventListener("blur", onChange);

    //submit new value on enter
    input.addEventListener("keydown", function (e) {
      if (e.keyCode === 13) {
        success(input.value);
      }

      if (e.keyCode === 27) {
        cancel();
      }
    });

    return input;
  },
  date: function (cell, onRendered, success, cancel, editorParams) {
    let data = cell.getData();

    if (editorParams && typeof editorParams["checkEdit"] === "function") {
      if (!editorParams["checkEdit"](cell)) return false;
    }

    //create and style input
    var cellValue = cell.getValue(),
      input = document.createElement("input");

    input.style.padding = "4px";
    input.style.width = "100%";
    input.style.boxSizing = "border-box";

    input.value = cellValue ? new Date(cellValue).toISOString() : "";

    onRendered(function () {
      flatpickr(input, {
        allowInput: true,
        enableTime: false,
        dateFormat: "d/m/Y",
        locale: "vn",
        onOpen: function (selectedDates, dateStr, instance) {
          instance.set("defaultDate", new Date());
        },
        onClose: (selectedDates, dateStr, instance) => {
          if (selectedDates.length === 0) {
            cancel();
            return false;
          }
          let dateChoose = new Date(
            new Date(selectedDates[0]).setHours(23, 59, 59, 999)
          );
          if (
            new Date(selectedDates[0]).toISOString() !==
            new Date(cell.getValue()).toISOString()
          ) {
            success(dateChoose.getTime());
          } else cancel();
          instance.destroy();
        },
      });
      input.focus();
      input.style.height = "100%";
    });

    return input;
  },
  dateInput: function (cell, onRendered, success, cancel, editorParams) {
    //create and style input
    var cellValue = cell.getValue(),
      input = document.createElement("input");

    input.setAttribute("type", "text");

    input.style.padding = "4px";
    input.style.width = "100%";
    input.style.boxSizing = "border-box";

    input.value = cellValue;

    onRendered(function () {
      input.focus();
      input.style.height = "100%";
    });

    function checkBirthdayValue(str, max) {
      if (str.charAt(0) !== "0" || str === "00") {
        let num = parseInt(str);
        if (isNaN(num) || num <= 0 || num > max) num = 1;
        if (
          num > parseInt(max.toString().charAt(0)) &&
          num.toString().length === 1
        ) {
          str = "0" + num;
        } else {
          str = num.toString();
        }
      }
      return str;
    }

    function onChange(e) {
      if (input.value !== cellValue) {
        success(input.value.toUpperCase());
      } else {
        cancel();
      }
    }

    //submit new value on blur or change
    input.addEventListener("change", onChange);
    input.addEventListener("blur", onChange);
    input.addEventListener("input", function (e) {
      let currentYear = new Date().getFullYear();
      let input = this.value;
      if (/\D\/$/.test(input)) input = input.substr(0, input.length - 3);

      let values = input.split("/").map(function (v) {
        return v.replace(/\D/g, "");
      });
      if (values[0]) values[0] = checkBirthdayValue(values[0], 31); // day check
      if (values[1]) values[1] = checkBirthdayValue(values[1], 12); // month check
      if (values[1]) values[1] = checkBirthdayValue(values[1], currentYear); // year check
      let output = values.map(function (v, i) {
        return v.length === 2 && i < 2 ? v + "/" : v;
      });
      this.value = output.join("").substr(0, 10);
    });

    //submit new value on enter
    input.addEventListener("keydown", function (e) {
      if (e.keyCode === 13) {
        success(input.value);
      }

      if (e.keyCode === 27) {
        cancel();
      }
    });

    return input;
  },
  editValuePriceItem: function (
    cell,
    onRendered,
    success,
    cancel,
    editorParams
  ) {
    let path = cell.getField().split(".");
    path.pop();
    path[2] = "is_check";
    if (
      __getProperty(
        cell.getData().price_items,
        path.join("."),
        "price_items."
      ) ||
      true
    ) {
      //create and style editor
      var input = document.createElement("input");

      input.setAttribute("type", "number");
      input.value = cell.getValue();
      //create and style input
      input.style.padding = "3px";
      input.style.width = "100%";
      input.style.boxSizing = "border-box";

      onRendered(function () {
        input.focus();
        input.style.css = "100%";
      });

      //when the value has been set, trigger the cell to update
      function successFunc() {
        success(input.value === "" ? 0 : parseInt(input?.value ?? 0));
      }

      input.addEventListener("change", successFunc);
      input.addEventListener("blur", cancel);

      //return the editor element
      return input;
    }
    return false;
  },
  select(cell, onRendered, success, cancel, editorParams) {
    var editor = $("<select>");

    let list = editorParams?.values;

    if (typeof editorParams.hookGetData === "function") {
      list = editorParams.hookGetData(list, cell);
    }

    if (Array.isArray(list)) {
      if (editorParams?.filter && typeof editorParams?.filter === "function") {
        list = editorParams?.filter(list, cell, editorParams);
      }

      editor.html("");

      list?.length > 0 &&
        list.map((item) => {
          if (typeof item === "object") {
            if (item.value === cell.getValue())
              editor.append(
                `<option value="${item.value}" selected>${item.label}</option>`
              );
            else
              editor.append(
                `<option value="${item.value}">${item.label}</option>`
              );
          }
        });
    } else if (typeof list === "object") {
      editor.html("");
      Object.keys(list).map((item, key) => {
        if (typeof item === "object") {
          if (item.value === cell.getValue())
            editor.append(
              `<option value="${item.value}" selected>${item.label}</option>`
            );
          else
            editor.append(
              `<option value="${item.value}">${item.label}</option>`
            );
        }
      });
    } else {
      alert("Không tìm thấy dữ liệu để chọn!");
      return false;
    }

    editor.css({
      padding: "3px",
      width: "100%",
      "box-sizing": "border-box",
    });

    //Set value of editor to the current value of the cell
    editor.val(cell.getValue());

    //set focus on the select box when the editor is selected (timeout allows for editor to be added to DOM)
    onRendered(function () {
      editor.focus();
    });

    //when the value has been set, trigger the cell to update
    editor.on("change blur", function (e) {
      success(
        typeof editorParams["isNumber"] !== "undefined"
          ? parseInt(editor.val())
          : editor.val()
      );
    });

    //return the editor element
    return editor.get(0);
  },
  birthday: function (cell, onRendered, success, cancel, editorParams) {
    //create and style input
    var cellValue = cell.getValue(),
      input = document.createElement("input");

    input.style.padding = "4px";
    input.style.width = "100%";
    input.style.boxSizing = "border-box";

    input.value = new Date(cellValue).toISOString();

    onRendered(function () {
      flatpickr(input, {
        allowInput: true,
        enableTime: false,
        dateFormat: "d/m/Y",
        locale: "vn",
        onClose: (selectedDates, dateStr, instance) => {
          if (selectedDates.length === 0) {
            cancel();
            return false;
          }
          let dateChoose = new Date(
            new Date(selectedDates[0]).setHours(23, 59, 59, 999)
          );
          if (
            new Date(selectedDates[0]).toISOString() !==
            new Date(cell.getValue()).toISOString()
          ) {
            success(dateChoose.getTime());
          } else cancel();
          instance.destroy();
        },
      });
      input.focus();
      input.style.height = "100%";
    });

    return input;
  },
};

// Định nghĩa định dạng ô
const common_formatters = {
  iconFirst: function (cell, formatterParams) {
    let data = cell.getData();
    let note = data?.contract?.note ?? data?.note ?? null;
    let icons = {
      bill: `${feather.icons["clipboard"].toSvg({ width: 20, height: 20 })}`,
      room: `<img width="20px" src="/images/icons/room.png" />`,
      contract: `<img width="20px" src="/images/icons/room.png" />`,
      user: `${feather.icons["user"].toSvg({ width: 20, height: 20 })}`,
    };
    if (
      typeof formatterParams["icon"] !== "undefined" &&
      icons[formatterParams["icon"]]
    )
      return `<div class="icon-first" ${
        note
          ? 'data-bs-toggle="tooltip" data-bs-placement="right" title="' +
            note +
            '"'
          : ""
      } style="background-color:${data?.status_color ?? "#dc3545"};">
                        ${
                          note
                            ? '<span class="icon-note-on-list">' +
                              feather.icons["message-square"].toSvg({
                                width: 13,
                                heigh: 13,
                              }) +
                              "</span>"
                            : ""
                        }
                        ${icons[formatterParams["icon"]]}
                    </div>`;
    return `<div style="background-color: #dc3545; border-radius: 100%; padding: 3px; text-align: center; cursor: pointer; width: 30px;height: 30px;color:#fff;margin: auto;">${feather.icons[
      "clipboard"
    ].toSvg({
      width: 20,
      height: 20,
    })}</div>`;
  },
  collapseIcon: (cell, formatterParams, onRendered) => {
    if (cell.getValue() === true) {
      return "<svg width='10' height='5' viewBox='0 0 10 5'><path d='M0 0l5 4.998L10 0z'></path></svg>";
    } else {
      return "<svg width='10' height='5' viewBox='0 0 10 5'><path d='M0 5L5 .002 10 5z'></path></svg>";
    }
  },
  bold: function (cell, formatterParams) {
    return "<strong>" + cell.getValue() + "</strong>"; //make the contents of the cell bold
  },
  uppercase: function (cell, formatterParams) {
    return cell.getValue().toUpperCase(); //make the contents of the cell uppercase
  },
  currency: function (cell, formatterParams) {
    return cell.getValue() >= 0
      ? `<b>${__format.currency(cell.getValue())}</b>`
      : `<b>${formatterParams["default_text"] ?? 0}</b>`;
  },
  room_amount: function (cell, formatterParams) {
    let data = cell.getData();
    let room_amount = (text =
      cell.getValue() >= 0
        ? `<b>${__format.currency(cell.getValue())}</b>`
        : `<b>${formatterParams["default_text"] ?? 0}</b>`);
    if (data?.room_amount_date_from && data?.room_amount_date_to)
      text = `<div>${room_amount}</div><div style="font-size: 10px; color: #238f2f">[${
        data?.room_amount_date_from_format +
        " - " +
        data?.room_amount_date_to_format
      }]</div>`;

    if (data?.contract?.bills_count) {
      text += `<div style="font-size: 11px;">Đã có: ${data?.contract?.bills_count} hóa đơn</div>`;
    } else {
      text += `<div style="color:red;font-size: 11px;">Chưa thu lần nào</div>`;
    }

    return `<div>${text}</div>`;
  },
  bill_room_amount_currency: function (cell, formatterParams) {
    let data = cell.getData();
    let room_amount = (text =
      cell.getValue() >= 0
        ? `<b>${__format.currency(cell.getValue())}</b>`
        : `<b>${formatterParams["default_text"] ?? 0}</b>`);
    if (data?.date_from && data?.date_to)
      text = `<div>${room_amount}</div><div style="font-size: 10px; color: #238f2f">[${
        data?.date_from_format + " - " + data?.date_to_format
      }]</div>`;

    return `<div>${text}</div>`;
  },
  negative_currency: function (cell, formatterParams) {
    return cell.getValue()
      ? `<b>${__format.currency(cell.getValue())}</b>`
      : `<b>${formatterParams["default_text"] ?? 0}</b>`;
  },
  phone: function (cell, formatterParams) {
    return cell.getValue() ? `<b>${__format.phone(cell.getValue())}</b>` : "";
  },
  additionCurrency: function (cell, formatterParams) {
    if (cell.getValue() < 0) {
      cell.getElement().classList.add("warning-text");
    } else {
      cell.getElement().classList.remove("warning-text");
    }
    return `<b>${__format.currency(cell.getValue())}</b>`;
  },
  status: function (cell, formatterParams) {
    var data = cell.getData();
    return `<span class="badge" style="background-color: ${
      data.status_color
    }">${cell.getValue()}</span>`;
  },
  list: function (cell, formatterParams) {
    let list =
      typeof formatterParams["list"] !== undefined
        ? formatterParams["list"]
        : [];
    if (typeof formatterParams["hookGetData"] === "function") {
      list = formatterParams["hookGetData"](list, cell);
    }

    let findData = __helper.array.findObjectInArray(
      cell.getValue(),
      "id",
      list
    );
    if (findData?.name !== "undefined") {
      return `${findData.name}`;
    }
    return "Không xác định";
  },
  list_badge: function (cell, formatterParams) {
    if (typeof formatterParams["list"][cell.getValue()] !== "undefined") {
      return `<span class="badge ${
        formatterParams["list"][cell.getValue()]["class"] ?? ""
      }" style="background-color: ${
        formatterParams["list"][cell.getValue()]["color"]
      }; white-space: break-spaces;">${
        formatterParams["list"][cell.getValue()]["name"]
      }</span>`;
    }
    return "Không xác định";
  },
  action: function (cell, formatterParams) {
    return `<div class="icon-menu-action">${feather.icons[
      "more-vertical"
    ].toSvg({
      width: 22,
      height: 22,
    })}</div>`;
  },
  delete: function (cell, formatterParams) {
    return `<div style="background-color: #dc3545;
        color: #fff;
        border-radius: 100%;
        cursor: pointer;
        width: 35px;
        height: 35px;
        display: flex;
        justify-content: center;
        align-items: center;">${feather.icons["trash"].toSvg({
          width: 20,
          height: 20,
        })}</div>`;
  },

  edit: function (cell, formatterParams) {
    return `<div style="background-color: #dc3545;
        color: #fff;
        border-radius: 100%;
        cursor: pointer;
        width: 35px;
        height: 35px;
        display: flex;
        justify-content: center;
        align-items: center;">${feather.icons["edit"].toSvg({
          width: 20,
          height: 20,
        })}</div>`;
  },

  checkEdit: function (cell, formatterParams) {
    let data = cell.getData();
    if (formatterParams["key"] && !data[formatterParams["key"]]) {
      cell.getElement().classList.add("warning");
      cell.getElement().classList.add("edit_disable");
      cell.getElement().classList.remove("edit_enable");
    }
    return cell.getValue();
  },
  day: function (cell, formatterParams) {
    if (cell.getValue()) {
      return `Ngày ${cell.getValue()}`;
    }
  },
  circle_month: function (cell, formatterParams) {
    let data = cell.getData();
    if (cell.getValue()) {
      let text = `${cell.getValue()} tháng`;
      if (data.circle_month > 1)
        text = `<strong style="color: red">${cell.getValue()} tháng</strong>`;
      return `<div>${text}</div>`;
    }
  },
  total_customer: function (cell, formatterParams) {
    if (formatterParams["key"] && formatterParams["key"] === "total")
      return `<div>${feather.icons["user"].toSvg({
        width: 18,
        height: 18,
      })} ${cell.getValue()} người</div>`;

    return `<div>${feather.icons["user"].toSvg({
      width: 18,
      height: 18,
    })} ${cell.getValue()?.length ?? 0}/${
      cell.getData()?.customer_count
    } người</div>`;
  },
  area: function (cell, formatterParams) {
    if (cell.getValue()) {
      return `${cell.getValue()} m2`;
    }
  },
  date: function (cell, formatterParams) {
    if (formatterParams && typeof formatterParams["setCss"] === "function") {
      formatterParams["setCss"](cell);
    }

    return cell.getValue()
      ? new Date(new Date(cell.getValue()) - 0).toLocaleDateString("vi", {
          year: "numeric",
          month: "2-digit",
          day: "numeric",
        })
      : `<span>${formatterParams["default_text"] ?? "Không xác định"}</span>`;
  },
  priceItems: function (cell, formatterParams) {
    if (cell?.getData()?.price_items?.length === 0) {
      return "không có dịch vụ";
    }
    return cell
      .getData()
      .price_items.map((item, index) => {
        return item.name;
      })
      .join(", ");
  },
  image: function (cell, formatterParams) {
    if (cell.getValue())
      return `<img src="${cell.getValue()}" style="height: 50px; width: 50px;">`;
    else
      return `<div class="no-image" style="width: 100px;height: 50px;padding: 10px;border-radius: 10px;background-color: rgb(238, 238, 238);color: rgb(153, 153, 153);text-align: center;">No image</div>`;
  },
  reason_admin: function (cell, formatterParams) {
    var data = cell.getValue();
    if (data?.reason_text && data.type !== "approve") {
      return `${data.reason_text}`;
    }

    return "";
  },
};

// Dịnh nghĩa accessor
const common_accessor = {
  list: function (value, data, type, accessorParams) {
    if (typeof accessorParams["list"][value] !== "undefined") {
      return accessorParams["list"][value]["name"];
    }
    return "không xác định";
  },
  date: function (value, data, type, accessorParams) {
    return value
      ? new Date(new Date(value) - 0).toLocaleDateString("vi", {
          year: "numeric",
          month: "2-digit",
          day: "numeric",
        })
      : accessorParams["default_text"] ?? "";
  },
  currency: function (value, data, type, accessorParams) {
    return value ? value : accessorParams["default_text"] ?? 0;
  },
  customer: function (value, data, type, accessorParams) {
    return (value?.length ?? 0) + " người";
  },
  area: function (value, data, type, accessorParams) {
    return (value ?? 0) + " m2";
  },
  stringNumber: function (value, data, type, accessorParams) {
    return value ?? "";
  },
  sex: function (value, data, type, accessorParams) {
    if (value === -1) return "Chưa ghi nhận";

    return value === 1 ? "Nam " : "Nữ";
  },
  address_job: function (value, data, type, accessorParams) {
    return (
      (data?.address_component?.address
        ? "Địa chỉ: " + data.address_component.address + " ."
        : "") + (data?.job ? "Nghề nghiệp: " + data.job : "")
    );
  },
  image_identity: function (value, data, type, accessorParams) {
    return (
      (data?.image_identity_after
        ? "Hình mặt sau: " + data.image_identity_after.url_full
        : "") +
      (data?.image_identity_before
        ? " Hình mặt trước: " + data.image_identity_before.url_full
        : "")
    );
  },

  day: function (value, data, type, accessorParams) {
    return value ? "Ngày " + value : "";
  },

  circle_month: function (value, data, type, accessorParams) {
    return value ? value + " tháng" : "";
  },
  input: function (value, data, type, accessorParams) {
    return value ? value : "";
  },
};

// Định nghĩa validator (Kiểm tra dữ liệu nhập khi chỉnh sửa)
const common_validators = {};

// Định nghĩa khi click vào menu của bảng
const commonClickMenu = {
  bill_action_click: (e, cell) => {
    let menu = [
      {
        label: `${feather.icons["arrow-right-circle"].toSvg({
          width: 20,
          height: 20,
        })} Xem chi tiết hóa đơn`,
        action: (e, cell) => {
          window.open(`/bill/${cell.getData().id}`, "_blank").focus();
        },
      },
    ];

    if (__permission_block === null || __permission_block.bill_pay.create) {
      if (["new", "customer_debt"].includes(cell.getData().status)) {
        menu.push({
          label: `<span class="text-success">${feather.icons[
            "dollar-sign"
          ].toSvg({
            width: 20,
            height: 20,
          })} Thu tiền</span>`,
          action: (e, cell) => {
            var billPay =
              bootstrap.Modal.getInstance(document.getElementById("billPay")) ??
              new bootstrap.Modal(document.getElementById("billPay"), null);
            billPay.show({ cell });
          },
        });
      }
    }

    if (cell.getData().status === "new") {
      if (__permission_block === null || __permission_block.bill.update) {
        menu.push({
          label: `${feather.icons["edit-3"].toSvg({
            width: 20,
            height: 20,
          })} Chỉnh sửa`,
          action: (e, cell) => {
            var addBill =
              bootstrap.Modal.getInstance(
                document.getElementById("editBill")
              ) ??
              new bootstrap.Modal(document.getElementById("editBill"), null);
            addBill.show({ cell });
          },
        });
      }
    }

    if (__permission_block === null || __permission_block.bill.view) {
      menu.push({
        label: `${feather.icons["printer"].toSvg({
          width: 20,
          height: 20,
        })} In hóa đơn`,
        action: (e, cell) => {
          $.transferData({
            url: __helper.url.urlPattern(__routeApi.bill.showHtml, {
              id: cell.getData().id,
            }),
            textLoading: "Đang tải hóa đơn...",
            success: (res) => {
              w = window.open();
              w.document.write(res.data);
            },
            fail: (res) => {},
          });
        },
      });

      menu.push({
        label: `${feather.icons["share"].toSvg({
          width: 20,
          height: 20,
        })} Chia sẻ hóa đơn`,
        action: (e, cell) => {
          let __url = window.location.origin + `/bill/${cell.getData().id}`;
          __CopyToClipboard(__url);
          Swal.fire({
            title: "Thông báo!",
            text: "Đã sao chép liên kết chi tiết hóa đơn!",
            icon: "success",
            timer: 3000,
          });
        },
      });
    }

    if (__permission_block === null || __permission_block.bill.update) {
      menu.push({
        label: `${feather.icons["navigation"].toSvg({
          width: 20,
          height: 20,
        })} Gửi hóa đơn qua App`,
        action: (e, cell) => {
          $.transferData({
            url: __helper.url.urlPattern(__routeApi.bill.sendToApp, {
              id: cell.getData().id,
            }),
            textLoading: "Đang gửi hóa đơn...",
            success: function (res) {
              Swal.fire({
                title: "Thành công!",
                text: res.message,
                icon: "success",
                confirmButtonColor: "#3c9e47",
                confirmButtonText: "Đóng",
              });
            },
            fail: (res) => {
              Swal.fire({
                title: "Thông báo!",
                text: res.message,
                icon: "error",
                confirmButtonColor: "#3c9e47",
                confirmButtonText: "Đã hiểu",
              });
            },
          });
        },
      });

      menu.push({
        label: `<img width="20px" src="/images/icons/icon-zalo.png" /> Gửi hóa đơn qua Zalo`,
        action: (e, cell) => {
          $.transferData({
            url: __helper.url.urlPattern(__routeApi.bill.sendToZalo, {
              id: cell.getData().id,
            }),
            method: "POST",
            textLoading: "Đang gửi hóa đơn qua zalo...",
            success: function (res) {
              Swal.fire({
                title: "Thành công!",
                text: res.message,
                icon: "success",
                confirmButtonColor: "#3c9e47",
                confirmButtonText: "Đóng",
              });
            },
            fail: (res) => {
              Swal.fire({
                title: "Thông báo!",
                text: res.message,
                icon: "error",
                confirmButtonColor: "#3c9e47",
                confirmButtonText: "Đã hiểu",
              });
            },
          });
        },
      });
    }

    if (__permission_block === null || __permission_block.bill.delete) {
      if (!["cancel", "done"].includes(cell.getData().status)) {
        menu.push({
          label: `<span class="text-danger">${feather.icons["x"].toSvg({
            width: 20,
            height: 20,
          })} Hủy hóa đơn</span>`,
          action: (e, cell) => {
            Swal.fire({
              title: "Thông báo!",
              text: "Bạn có chắc chắn muốn hủy hóa đơn?",
              icon: "warning",
              showCancelButton: true,
              cancelButtonColor: "#d33",
              confirmButtonColor: "#3085d6",
              confirmButtonText: "Vâng! tôi muốn hủy",
              cancelButtonText: "Không! Tôi không muốn",
            }).then((result) => {
              if (result.isConfirmed) {
                $.transferData({
                  url: __helper.url.urlPattern(__routeApi.bill.cancel, {
                    id: cell.getData().id,
                  }),
                  textLoading: "Đang hủy hóa đơn...",
                  success: function (res) {
                    Swal.fire({
                      title: "Thành công!",
                      text: res.message,
                      icon: "success",
                      confirmButtonColor: "#3c9e47",
                      confirmButtonText: "Đóng",
                    }).then((result) => {
                      res?.data && cell && cell.getRow().update(res.data);
                    });
                  },
                  fail: (res) => {
                    Swal.fire({
                      title: "Thông báo!",
                      text: res.message,
                      icon: "error",
                      confirmButtonColor: "#3c9e47",
                      confirmButtonText: "Đã hiểu",
                    });
                  },
                });
              }
            });
          },
        });
      }

      if (["cancel", "done"].includes(cell.getData().status)) {
        menu.push({
          label: `<span class="text-danger">${feather.icons["trash-2"].toSvg({
            width: 20,
            height: 20,
          })} Xóa hóa đơn</span>`,
          action: (e, cell) => {
            Swal.fire({
              title: "Thông báo!",
              text: "Bạn có chắc chắn muốn xóa hóa đơn?",
              icon: "warning",
              showCancelButton: true,
              cancelButtonColor: "#d33",
              confirmButtonColor: "#3085d6",
              confirmButtonText: "Vâng! tôi muốn xóa",
              cancelButtonText: "Không! Tôi không muốn",
            }).then((result) => {
              if (result.isConfirmed) {
                $.transferData({
                  url: __helper.url.urlPattern(__routeApi.bill.delete, {
                    id: cell.getData().id,
                  }),
                  textLoading: "Đang xóa hóa đơn...",
                  success: function (res) {
                    cell.getRow().delete();
                    Swal.fire({
                      title: "Thành công!",
                      text: res.message,
                      icon: "success",
                      confirmButtonColor: "#3c9e47",
                      confirmButtonText: "Đóng",
                    });
                  },
                  fail: (res) => {
                    Swal.fire({
                      title: "Thông báo!",
                      text: res.message,
                      icon: "error",
                      confirmButtonColor: "#3c9e47",
                      confirmButtonText: "Đã hiểu",
                    });
                  },
                });
              }
            });
          },
        });
      }
    }
    return menu;
  },
  room_action_click: (e, cell) => {
    let menu = [
      {
        label: `${feather.icons["arrow-right-circle"].toSvg({
          width: 20,
          height: 20,
        })} Chi tiết ${__current_block?.room_type_name ?? "phòng"}`,
        action: (e, cell) => {
          if (Object.keys(cell.getTable().getEditedCells()).length > 0) {
            Swal.fire({
              title: "Thông báo!",
              text: `Bạn đã chỉnh sửa dữ liệu bạn muốn ở lại hay tiếp tục! Nếu tới chi tiết ${
                __current_block?.room_type_name ?? "phòng"
              } các dữ liệu chỉnh sửa sẽ bị mất.`,
              icon: "warning",
              showCancelButton: true,
              cancelButtonColor: "#d33",
              confirmButtonColor: "#3c9e47",
              confirmButtonText: "Vâng! tôi muốn tiếp tục",
              cancelButtonText: "Không! Tôi muốn ở lại",
            }).then((result) => {
              if (result.isConfirmed) {
                window
                  .open(
                    `/quan-ly/${cell.getData().id}/chi-tiet-phong`,
                    "_blank"
                  )
                  .focus();
              }
            });
          } else {
            window
              .open(`/quan-ly/${cell.getData().id}/chi-tiet-phong`, "_blank")
              .focus();
          }
        },
      },
    ];

    if (cell.getData().can_new_section) {
      if (__permission_block === null || __permission_block.contract.create) {
        // Thêm hợp đồng
        menu.push({
          label: `<span class="text-success">${feather.icons["book"].toSvg({
            width: 20,
            height: 20,
          })} Hợp đồng mới</span>`,
          action: (e, cell) => {
            var addNewContract =
              bootstrap.Modal.getInstance(
                document.getElementById("addNewContract")
              ) ??
              new bootstrap.Modal(
                document.getElementById("addNewContract"),
                null
              );
            addNewContract.show({ cell });
          },
        });
      }
    }

    if (cell.getData().can_deposit) {
      if (!cell?.getData()?.deposit) {
        if (
          __permission_block === null ||
          __permission_block.room_deposit.create
        ) {
          menu.push({
            label: `${feather.icons["anchor"].toSvg({
              width: 20,
              height: 20,
            })} Cọc giữ chỗ`,
            action: (e, cell) => {
              var addDepositTemp =
                bootstrap.Modal.getInstance(
                  document.getElementById("addDepositTemp")
                ) ??
                new bootstrap.Modal(
                  document.getElementById("addDepositTemp"),
                  null
                );
              addDepositTemp.show({ cell });
            },
          });
        }
      } else {
        if (
          __permission_block === null ||
          __permission_block.room_deposit.view
        ) {
          menu.push({
            label: `${feather.icons["eye"].toSvg({
              width: 20,
              height: 20,
            })} Xem cọc giữ chỗ`,
            action: (e, cell) => {
              var viewDepositTemp =
                bootstrap.Modal.getInstance(
                  document.getElementById("viewDepositTemp")
                ) ??
                new bootstrap.Modal(
                  document.getElementById("viewDepositTemp"),
                  null
                );
              viewDepositTemp.show({ cell });
            },
          });
        }

        if (
          __permission_block === null ||
          __permission_block.room_deposit.delete
        ) {
          menu.push({
            label: `<span class="text-danger">${feather.icons["x-circle"].toSvg(
              {
                width: 20,
                height: 20,
              }
            )} Hủy cọc giữ chỗ</span>`,
            action: (e, cell) => {
              var cancelDepositTemp =
                bootstrap.Modal.getInstance(
                  document.getElementById("addDepositTemp")
                ) ??
                new bootstrap.Modal(
                  document.getElementById("addDepositTemp"),
                  null
                );
              cancelDepositTemp.show({ cell });
            },
          });
        }
      }
    }

    if (__permission_block === null || __permission_block.bill.create) {
      if (cell.getData().can_bill) {
        // Lập hóa đơn
        menu.push({
          label: `${feather.icons["dollar-sign"].toSvg({
            width: 20,
            height: 20,
          })} Lập hóa đơn`,
          action: (e, cell) => {
            var addBill =
              bootstrap.Modal.getInstance(document.getElementById("addBill")) ??
              new bootstrap.Modal(document.getElementById("addBill"), null);
            addBill.show({ cell });
          },
        });
      }
    }

    if (__permission_block === null || __permission_block.bill_pay.create) {
      if (["has_bill", "debt_bill"].includes(cell.getData().active_status)) {
        menu.push({
          label: `${feather.icons["dollar-sign"].toSvg({
            width: 20,
            height: 20,
          })} Thu tiền`,
          action: (e, cell) => {
            var room_id = cell.getData().id;
            var billPay =
              bootstrap.Modal.getInstance(
                document.getElementById("billDebt")
              ) ??
              new bootstrap.Modal(document.getElementById("billDebt"), null);
            billPay.show({ room_id });
          },
        });
      }
    }

    if (cell.getData().can_terminate) {
      if (__permission_block === null || __permission_block.customer.view) {
        if (cell?.getData()?.customers?.length > 0)
          // Danh sách khách thuê
          menu.push({
            label: `${feather.icons["user"].toSvg({
              width: 20,
              height: 20,
            })} Danh sách khách thuê`,
            action: (e, cell) => {
              var customerView =
                bootstrap.Modal.getInstance(
                  document.getElementById("customer-view")
                ) ??
                new bootstrap.Modal(
                  document.getElementById("customer-view"),
                  null
                );
              customerView.show({ cell });
            },
          });
      }

      // Thao tác chuyển giường, chuyển phòng
      if (__permission_block === null || __permission_block.room.update) {
        menu.push({
          label: `${feather.icons["refresh-ccw"].toSvg({
            width: 20,
            height: 20,
          })} Chuyển ${__current_block?.room_type_name ?? "phòng"}`,
          action: (e, cell) => {
            var roomsSelectOneModal =
              bootstrap.Modal.getInstance(
                document.getElementById("_rooms_list_modal")
              ) ??
              new bootstrap.Modal(
                document.getElementById("_rooms_list_modal"),
                null
              );
            roomsSelectOneModal.show({
              title: `Danh sách ${__current_block?.room_type_name ?? "phòng"}`,
              description: `Chọn ${
                __current_block?.room_type_name ?? "phòng"
              } để chuyển`,
              status: "is_empty",
              callback: function (room) {
                $.transferData({
                  method: "POST",
                  url: __helper.url.urlPattern(__routeApi.room.moveToOther, {
                    block_id: parseInt(__current_block.id),
                  }),
                  data: {
                    room_from: cell.getData().id,
                    room_to: room.id,
                  },
                  textLoading: `Đang chuyển...`,
                  success: (res) => {
                    location.reload();
                  },
                  fail: (res) => {
                    Swal.fire({
                      title: "Thông báo!",
                      text: "Đã có lỗi xảy ra! " + res.message,
                      icon: "error",
                      confirmButtonColor: "#3c9e47",
                      confirmButtonText: "Đã hiểu",
                    });
                  },
                  error: (e) => {
                    Swal.fire({
                      title: "Thông báo!",
                      text: "Đã có lỗi xảy ra! " + e,
                      icon: "error",
                      confirmButtonColor: "#3c9e47",
                      confirmButtonText: "Đã hiểu",
                    });
                  },
                });
                roomsSelectOneModal.hide();
              },
            });
          },
        });
      }
    }

    if (__permission_block === null || __permission_block.room.update) {
      menu.push({
        label: `${feather.icons["settings"].toSvg({
          width: 20,
          height: 20,
        })} Cài đặt dịch vụ`,
        action: (e, cell) => {
          var settingPriceItem =
            bootstrap.Modal.getInstance(
              document.getElementById("priceItemSelect")
            ) ??
            new bootstrap.Modal(
              document.getElementById("priceItemSelect"),
              null
            );
          settingPriceItem.show({
            cell,
            page_use: "rooms",
          });
        },
      });

      menu.push({
        label: `${feather.icons["trello"].toSvg({
          width: 20,
          height: 20,
        })} Thiết lập tài sản`,
        action: (e, cell) => {
          var settingAsset =
            bootstrap.Modal.getInstance(
              document.getElementById("assetSelect")
            ) ??
            new bootstrap.Modal(document.getElementById("assetSelect"), null);
          settingAsset.show({
            cell,
            page_use: "rooms",
          });
        },
      });

      if (cell.getData().contract_id) {
        menu.push({
          label: `${feather.icons["truck"].toSvg({
            width: 20,
            height: 20,
          })} Quản lý xe`,
          action: (e, cell) => {
            var car =
              bootstrap.Modal.getInstance(
                document.getElementById("car-view")
              ) ??
              new bootstrap.Modal(document.getElementById("car-view"), null);
            car.show({ cell });
          },
        });
      }
    }

    if (cell.getData().contract_id) {
      if (__permission_block === null || __permission_block.contract.delete) {
        if (cell.getData().can_cancel_terminate) {
          //hủy báo kết thúc hợp đồng
          menu.push({
            label: `<span class="text-danger">${feather.icons["x-circle"].toSvg(
              {
                width: 20,
                height: 20,
              }
            )} Hủy báo kết thúc hợp đồng</span>`,
            action: (e, cell) => {
              var terminateCancelModal =
                bootstrap.Modal.getInstance(
                  document.getElementById("terminateCancelModal")
                ) ??
                new bootstrap.Modal(
                  document.getElementById("terminateCancelModal"),
                  null
                );
              terminateCancelModal.show({ cell });
            },
          });
        }

        if (cell.getData().can_create_terminate) {
          //Báo kết thúc hợp đồng
          menu.push({
            label: `${feather.icons["bell"].toSvg({
              width: 20,
              height: 20,
            })} Báo kết thúc hợp đồng ${
              __current_block?.room_type_name ?? "phòng"
            }`,
            action: (e, cell) => {
              var terminateTicketModal =
                bootstrap.Modal.getInstance(
                  document.getElementById("terminateTicketModal")
                ) ??
                new bootstrap.Modal(
                  document.getElementById("terminateTicketModal"),
                  null
                );
              terminateTicketModal.show({ cell });
            },
          });
        }

        menu.push({
          label: `${feather.icons["log-out"].toSvg({
            width: 20,
            height: 20,
          })} Kết thúc hợp đồng ${__current_block?.room_type_name ?? "phòng"}`,
          action: (e, cell) => {
            var terminateModal =
              bootstrap.Modal.getInstance(
                document.getElementById("terminateModal")
              ) ??
              new bootstrap.Modal(
                document.getElementById("terminateModal"),
                null
              );
            terminateModal.show({ cell });
          },
        });
      }

      if (__permission_block === null || __permission_block.contract.update) {
        if (cell.getData().can_extend_contract) {
          menu.push({
            label: `<span class="text-success">${feather.icons[
              "external-link"
            ].toSvg({
              width: 20,
              height: 20,
            })} Gia hạn hợp đồng</span>`,
            action: (e, cell) => {
              var extendModal =
                bootstrap.Modal.getInstance(
                  document.getElementById("extendModal")
                ) ??
                new bootstrap.Modal(
                  document.getElementById("extendModal"),
                  null
                );
              extendModal.show({ cell });
            },
          });
        }

        menu.push({
          label: `<span class="text-success">${feather.icons["edit-3"].toSvg({
            width: 20,
            height: 20,
          })} Ghi chú</span>`,
          action: (e, cell) => {
            var noteModal =
              bootstrap.Modal.getInstance(
                document.getElementById("noteModal")
              ) ??
              new bootstrap.Modal(document.getElementById("noteModal"), null);
            noteModal.show({ cell });
          },
        });
      }

      if (__permission_block === null || __permission_block.contract.update) {
        if (cell.getData().contract.can_connect) {
          menu.push({
            label: `${feather.icons["share-2"].toSvg({
              width: 20,
              height: 20,
            })} Chia sẻ mã kết nối`,
            action: (e, cell) => {
              __CopyToClipboard(cell.getData().contract.code_connect);
              Swal.fire({
                title: "Thông báo!",
                text: `Đã sao mã kết nối thành công`,
                icon: "success",
                confirmButtonColor: "#3c9e47",
                confirmButtonText: "Đã hiểu",
                timer: 5000,
              });
            },
          });
        } else {
          menu.push({
            label: `<span class="text-danger">${feather.icons[
              "x-octagon"
            ].toSvg({
              width: 20,
              height: 20,
            })} Ngắt kết nối với ứng dụng khách thuê</span>`,
            action: (e, cell) => {
              Swal.fire({
                title: "Thông báo!",
                text: `Bạn có chắc chắn muốn ngắt kết nối với phòng này`,
                icon: "warning",
                showCancelButton: true,
                cancelButtonColor: "#d33",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Vâng! tôi muốn ngắt kết nối",
                cancelButtonText: "Không! Tôi không muốn",
              }).then((result) => {
                if (result.isConfirmed) {
                  $.transferData({
                    method: "GET",
                    url: __helper.url.urlPattern(
                      __routeApi.contract.disconnect,
                      { contract_id: parseInt(cell.getData().contract_id) }
                    ),
                    success: function (res) {
                      Swal.fire({
                        title: "Thành công!",
                        text: res.message,
                        icon: "success",
                        confirmButtonColor: "#3c9e47",
                        confirmButtonText: "Đóng",
                      });
                    },
                    fail: (res) => {
                      Swal.fire({
                        title: "Thông báo!",
                        text: res.message,
                        icon: "success",
                        confirmButtonColor: "#3c9e47",
                        confirmButtonText: "Đóng",
                      });
                    },
                    error: (e) => {
                      Swal.fire({
                        title: "Thông báo!",
                        text: "Đã có lỗi xảy ra! " + e,
                        icon: "error",
                        confirmButtonColor: "#3c9e47",
                        confirmButtonText: "Đã hiểu",
                      });
                    },
                  });
                }
              });
            },
          });
        }
      }

      if (__permission_block === null || __permission_block.contract.view)
        menu.push({
          label: `${feather.icons["arrow-right-circle"].toSvg({
            width: 20,
            height: 20,
          })} Xem văn bản hợp đồng`,
          action: (e, cell) => {
            window.open(
              `/contract-preview/${cell.getData().contract.id}`,
              "_blank"
            );
          },
        });

      if (__permission_block === null || __permission_block.contract.view)
        menu.push({
          label: `${feather.icons["printer"].toSvg({
            width: 20,
            height: 20,
          })} In văn bản hợp đồng`,
          action: (e, cell) => {
            $.transferData({
              url: __helper.url.urlPattern(__routeApi.showHtml, {
                contract_id: cell.getData().contract.id,
              }),
              textLoading: "Đang tải hợp đồng...",
              success: (res) => {
                w = window.open();
                w.document.write(res.data);
                w.print();
                w.close();
              },
              fail: (res) => {},
            });
          },
        });

      if (__permission_block === null || __permission_block.contract.view)
        menu.push({
          label: `${feather.icons["share"].toSvg({
            width: 20,
            height: 20,
          })} Chia sẻ văn bản hợp đồng`,
          action: (e, cell) => {
            let __url = `${window.location.origin}/contract-preview/${
              cell.getData().contract.id
            }`;
            __CopyToClipboard(__url);
            Swal.fire({
              title: "Thông báo!",
              text: `Đã sao chép liên kết hợp đồng! Bạn có thể chia sẻ cho bên thứ ba. \n ${__url}`,
              icon: "success",
              showCancelButton: true,
              cancelButtonColor: "#000",
              confirmButtonColor: "#3c9e47",
              confirmButtonText: "Đi đến dường dẫn",
              cancelButtonText: "Đóng",
              timer: 6000,
            }).then((result) => {
              if (result.isConfirmed) {
                window.open(
                  `/contract-preview/${cell.getData().contract.id}`,
                  "_blank"
                );
              }
            });
          },
        });
    }

    if (__permission_block === null || __permission_block.room.delete) {
      menu.push({
        label: `<span class="text-danger">${feather.icons["trash-2"].toSvg({
          width: 20,
          height: 20,
        })} Xóa ${__current_block?.room_type_name ?? "phòng"}</span>`,
        action: (e, cell) => {
          Swal.fire({
            title: "Thông báo!",
            text: `Bạn có chắc chắn muốn xóa ${
              __current_block?.room_type_name ?? "phòng"
            }`,
            icon: "warning",
            showCancelButton: true,
            cancelButtonColor: "#d33",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Vâng! tôi muốn xóa",
            cancelButtonText: "Không! Tôi không muốn",
          }).then((result) => {
            if (result.isConfirmed) {
              $.transferData({
                method: "POST",
                url: __routeApi.room.deleteSeries,
                data: { ids: [cell.getData().id] },
                success: function (res) {
                  cell.getRow().delete();
                  Swal.fire({
                    title: "Thành công!",
                    text: res.message,
                    icon: "success",
                    confirmButtonColor: "#3c9e47",
                    confirmButtonText: "Đóng",
                  });
                },
                fail: (res) => {
                  if (
                    ["is_deposit_temp", "is_deposit_temp_terminate"].includes(
                      cell.getData().status
                    )
                  ) {
                    Swal.fire({
                      title: "Thông báo!",
                      text: `${
                        __current_block?.room_type_name ?? "phòng"
                      } đã có cọc giữ chỗ trước đó. Bạn phải hủy cọc giữ chổ trước khi xóa ${
                        __current_block?.room_type_name ?? "phòng"
                      }!`,
                      icon: "question",
                      confirmButtonColor: "#dc3545",
                      confirmButtonText: "Vâng! tôi muốn hủy cọc giữ chỗ",
                      showCancelButton: true,
                      cancelButtonText: "Không! tôi không muốn xóa",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        var depositModal =
                          bootstrap.Modal.getInstance(
                            document.getElementById("addDepositTemp")
                          ) ??
                          new bootstrap.Modal(
                            document.getElementById("addDepositTemp"),
                            null
                          );
                        depositModal.show({ cell });
                      }
                    });
                  } else {
                    Swal.fire({
                      title: "Thông báo!",
                      text:
                        res.message +
                        "Bạn có muốn kết thúc hợp đồng trước khi xóa?",
                      icon: "question",
                      confirmButtonColor: "#dc3545",
                      confirmButtonText: "Vâng! tôi muốn kết thúc hợp đồng",
                      showCancelButton: true,
                      cancelButtonText: "Không! tôi không muốn xóa",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        var terminateModal =
                          bootstrap.Modal.getInstance(
                            document.getElementById("terminateModal")
                          ) ??
                          new bootstrap.Modal(
                            document.getElementById("terminateModal"),
                            null
                          );
                        terminateModal.show({ cell });
                      }
                    });
                  }
                },
                error: (e) => {
                  Swal.fire({
                    title: "Thông báo!",
                    text: "Đã có lỗi xảy ra! " + e,
                    icon: "error",
                    confirmButtonColor: "#3c9e47",
                    confirmButtonText: "Đã hiểu",
                  });
                },
              });
            }
          });
        },
      });
    }

    menu.push({
      label: `<span class="close-menu-action">${feather.icons["x-circle"].toSvg(
        { width: 20, height: 20 }
      )} Đóng menu</span>`,
      action: (e, cell) => {},
    });

    return menu;
  },
  contract_action_click: (e, cell) => {
    let menu = [];

    if (__permission_block === null || __permission_block.contract.view)
      menu.push({
        label: `${feather.icons["arrow-right-circle"].toSvg({
          width: 20,
          height: 20,
        })} Xem văn bản hợp đồng`,
        action: (e, cell) => {
          window.open(`/contract-preview/${cell.getData().id}`, "_blank");
        },
      });

    menu.push({
      label: `${feather.icons["trello"].toSvg({
        width: 20,
        height: 20,
      })} Thiết lập tài sản`,
      action: (e, cell) => {
        var settingAsset =
          bootstrap.Modal.getInstance(document.getElementById("assetSelect")) ??
          new bootstrap.Modal(document.getElementById("assetSelect"), null);
        settingAsset.show({
          cell,
          page_use: "contract",
        });
      },
    });

    if (__permission_block === null || __permission_block.contract.view)
      menu.push({
        label: `${feather.icons["printer"].toSvg({
          width: 20,
          height: 20,
        })} In văn bản hợp đồng`,
        action: (e, cell) => {
          $.transferData({
            url: __helper.url.urlPattern(__routeApi.showHtml, {
              contract_id: cell.getData().id,
            }),
            textLoading: "Đang tải hợp đồng...",
            success: (res) => {
              w = window.open();
              w.document.write(res.data);
              w.print();
              w.close();
            },
            fail: (res) => {},
          });
        },
      });

    if (__permission_block === null || __permission_block.contract.view)
      menu.push({
        label: `${feather.icons["share"].toSvg({
          width: 20,
          height: 20,
        })} Chia sẻ văn bản hợp đồng`,
        action: (e, cell) => {
          let __url = `${window.location.origin}/contract-preview/${
            cell.getData().id
          }`;
          __CopyToClipboard(__url);
          Swal.fire({
            title: "Thông báo!",
            text: `Đã sao chép liên kết hợp đồng! Bạn có thể chia sẻ cho bên thứ ba. \n ${__url}`,
            icon: "success",
            showCancelButton: true,
            cancelButtonColor: "#000",
            confirmButtonColor: "#3c9e47",
            confirmButtonText: "Đi đến dường dẫn",
            cancelButtonText: "Đóng",
            timer: 6000,
          }).then((result) => {
            if (result.isConfirmed) {
              window.open(`/contract-preview/${cell.getData().id}`, "_blank");
            }
          });
        },
      });

    if (__permission_block === null || __permission_block.contract.update)
      menu.push({
        label: `${feather.icons["share-2"].toSvg({
          width: 20,
          height: 20,
        })} Chia sẻ mã kết nối`,
        action: (e, cell) => {
          __CopyToClipboard(cell.getData().code_connect);
          Swal.fire({
            title: "Thông báo!",
            text: `Đã sao mã kết nối thành công`,
            icon: "success",
            confirmButtonColor: "#3c9e47",
            confirmButtonText: "Đã hiểu",
            timer: 5000,
          });
        },
      });

    return menu;
  },
  customer_action_click: (e, cell) => {
    let menu = [];

    if (__permission_block === null || __permission_block.customer.view)
      menu.push({
        label: `${feather.icons["arrow-right-circle"].toSvg({
          width: 20,
          height: 20,
        })} Xem mẫu văn bản tạm trú `,
        action: (e, cell) => {
          window.open(`/customer-preview/${cell.getData().id}`, "_blank");
        },
      });

    if (__permission_block === null || __permission_block.customer.view)
      menu.push({
        label: `${feather.icons["printer"].toSvg({
          width: 20,
          height: 20,
        })} In mẫu văn bản tạm trú`,
        action: (e, cell) => {
          $.transferData({
            url: __helper.url.urlPattern(__routeApi.customer.showHtml, {
              room_id: cell.getData().id,
            }),
            textLoading: "Đang tải khách thuê...",
            success: (res) => {
              w = window.open();
              w.document.write(res.data);
              w.print();
              w.close();
            },
            fail: (res) => {},
          });
        },
      });

    if (__permission_block === null || __permission_block.customer.view)
      menu.push({
        label: `${feather.icons["share"].toSvg({
          width: 20,
          height: 20,
        })} Chia sẻ mẫu văn bản tạm trú`,
        action: (e, cell) => {
          let __url = `${window.location.origin}/customer-preview/${
            cell.getData().id
          }`;
          __CopyToClipboard(__url);
          Swal.fire({
            title: "Thông báo!",
            text: `Đã sao chép liên kết văn bản tạm trú! Bạn có thể chia sẻ cho bên thứ ba. \n ${__url}`,
            icon: "success",
            showCancelButton: true,
            cancelButtonColor: "#000",
            confirmButtonColor: "#3c9e47",
            confirmButtonText: "Đi đến dường dẫn",
            cancelButtonText: "Đóng",
            timer: 5000,
          }).then((result) => {
            if (result.isConfirmed) {
              window.open(`/customer-preview/${cell.getData().id}`, "_blank");
            }
          });
        },
      });

    if (__permission_block === null || __permission_block.customer.view)
      menu.push({
        label: `${feather.icons["link"].toSvg({
          width: 20,
          height: 20,
        })} Khách thuê tự nhập`,
        action: (e, cell) => {
          $.transferData({
            method: "POST",
            url: __helper.url.urlPattern(__routeApi.room.openLinkCustomer, {
              id: cell.getData().room_id,
            }),
            data: {
              status: 1,
            },
            textLoading: "Đang mở đường dẫn...",
            success: (res) => {
              let __url = `${window.location.origin}/room/${
                cell.getData().room_id
              }/customer/add/${new Date(
                cell.getData().room.date_join
              ).getTime()}`;
              __CopyToClipboard(__url);
              Swal.fire({
                title: "Thông báo!",
                text: `Đã sao chép liên kết! Bạn có thể chia sẻ cho bên thứ ba. \n ${__url}`,
                icon: "success",
                showCancelButton: true,
                cancelButtonColor: "#000",
                confirmButtonColor: "#3c9e47",
                confirmButtonText: "Đi đến dường dẫn",
                cancelButtonText: "Đóng",
                timer: 6000,
              }).then((result) => {
                if (result.isConfirmed) {
                  window.open(`${__url}`, "_blank");
                }
              });
            },
            fail: (res) => {
              Swal.fire({
                title: "Cảnh báo!",
                text: "Chúng tôi không mở được dẫn cho khách thuê nhập!",
                icon: "warning",
              });
            },
            error: (e) => {
              Swal.fire({
                title: "Cảnh báo!",
                text: "Đã có lỗi xảy ra. Vui lòng liên hệ chuyên viên để được hỗ trợ!",
                icon: "warning",
              });
            },
          });
        },
      });

    if (__permission_block === null || __permission_block.customer.delete)
      menu.push({
        label: `<span class="text-danger">${feather.icons["trash-2"].toSvg({
          width: 20,
          height: 20,
        })} Xóa khách thuê</span>`,
        action: (e, cell) => {
          if (parseInt(cell.getData().is_contract) === 1) {
            Swal.fire({
              title: "Cảnh báo!",
              text: "Khách thuê này là người đại diện hợp đồng. Bạn không thể xóa",
              icon: "warning",
            });
          } else {
            Swal.fire({
              title: "Cảnh báo!",
              text: "Bạn có chắc chắn muốn xóa khách thuê này?",
              icon: "warning",
              showCancelButton: true,
              cancelButtonColor: "#d33",
              confirmButtonColor: "#3085d6",
              confirmButtonText: "Vâng! tôi muốn xóa",
              cancelButtonText: "Không xóa",
            }).then((result) => {
              if (result.isConfirmed) {
                $.transferData({
                  method: "POST",
                  url: __helper.url.urlPattern(__routeApi.customer.delete, {
                    customer_id: parseInt(cell.getData().id),
                  }),
                  success: (res) => {
                    Swal.fire({
                      title: "Thông báo!",
                      text: res.message,
                      icon: "success",
                      confirmButtonText: "Đóng",
                    }).then((result) => {
                      cell.getRow().delete();
                    });
                  },
                  fail: (res) => {
                    Swal.fire({
                      title: "Thông báo!",
                      text: res.message,
                      icon: "warning",
                    });
                  },
                });
              }
            });
          }
        },
      });

    menu.push({
      label: `${feather.icons["x-circle"].toSvg({
        width: 20,
        height: 20,
      })} Đóng menu`,
      action: (e, cell) => {},
    });

    return menu;
  },
  receip_expense_action_click: (e, cell) => {
    let menu = [
      {
        label: `${feather.icons["printer"].toSvg({
          width: 20,
          height: 20,
        })} In hóa đơn`,
        action: (e, cell) => {
          $.transferData({
            url: __helper.url.urlPattern(__routeApi.receiptsExpenses.showHtml, {
              id: cell.getData().id,
            }),
            textLoading: "Đang tải hóa đơn...",
            success: (res) => {
              w = window.open();
              w.document.write(res.data);
              w.print();
              w.close();
            },
            fail: (res) => {},
          });
        },
      },
    ];

    if (cell.getData().images) {
      menu.push({
        label: `<span class="close-menu-action">${feather.icons["file"].toSvg({
          width: 20,
          height: 20,
        })} Xem hình ảnh chứng từ</span>`,
        action: (e, cell) => {
          window.open(`${cell.getData().images[0].url_full}`, "_blank");
        },
      });
    }

    if (
      __permission_block === null ||
      __permission_block.receipts_expenses.delete
    ) {
      menu.push({
        label: `<span class="text-danger">${feather.icons["trash-2"].toSvg({
          width: 20,
          height: 20,
        })} Xóa</span>`,
        action: (e, cell) => {
          Swal.fire({
            title: "Thông báo!",
            text: "Bạn có chắc chắn muốn xóa phiếu thu/chi này?",
            icon: "warning",
            showCancelButton: true,
            cancelButtonColor: "#d33",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Vâng! tôi muốn xóa",
            cancelButtonText: "Không! Tôi không muốn",
          }).then((result) => {
            if (result.isConfirmed) {
              $.transferData({
                url: __helper.url.urlPattern(
                  __routeApi.receiptsExpenses.delete,
                  {
                    id: parseInt(cell.getData().id),
                  }
                ),
                textLoading: "Đang xóa hóa đơn...",
                success: function (res) {
                  let __el = {
                    table: $("#table"),
                    count_filter: $("#filter-count"),
                    total_receipt: $(
                      ".report-receipt-expense .receipt .value .total"
                    ),
                    total_expense: $(
                      ".report-receipt-expense .expense .value .total"
                    ),
                    total_profit: $(
                      ".report-receipt-expense .profit .value .total"
                    ),
                  };

                  Swal.fire({
                    title: "Thông báo!",
                    text: res.message,
                    icon: "success",
                    confirmButtonText: "Đóng",
                  }).then((result) => {
                    let total_receipt = __el.total_receipt.data("total") ?? 0;
                    let total_expense = __el.total_expense.data("total") ?? 0;
                    if (cell.getData().type === "receipts") {
                      total_receipt -= cell.getData().amount;
                    } else {
                      total_expense -= cell.getData().amount;
                    }
                    let total_profit = total_receipt - total_expense;

                    __el.total_receipt
                      .data("total", total_receipt)
                      .text(__format.currency(total_receipt));
                    __el.total_expense
                      .data("total", total_expense)
                      .text(__format.currency(total_expense));
                    __el.total_profit
                      .data("total", total_profit)
                      .text(__format.currency(total_profit));
                    __el.count_filter.text(
                      parseInt(__el.count_filter.text) - 1
                    );

                    cell.getRow().delete();
                  });

                  // Swal.fire({
                  //     title: 'Thành công!',
                  //     text: res.message,
                  //     icon: 'success',
                  //     confirmButtonColor: '#3c9e47',
                  //     confirmButtonText: 'Đóng'
                  // });
                },
                fail: (res) => {
                  Swal.fire({
                    title: "Thông báo!",
                    text: res.message,
                    icon: "error",
                    confirmButtonColor: "#3c9e47",
                    confirmButtonText: "Đã hiểu",
                  });
                },
              });
            }
          });
        },
      });
    }

    return menu;
  },
  post_action_click: (e, cell) => {
    let menu = [
      {
        label: `<span class="close-menu-action">${feather.icons["edit-3"].toSvg(
          { width: 20, height: 20 }
        )} Chỉnh sửa tin đăng</span>`,
        action: (e, cell) => {
          var editPostModal =
            bootstrap.Modal.getInstance(document.getElementById("addPost")) ??
            new bootstrap.Modal(document.getElementById("addPost"), null);
          editPostModal.show({ cell });
        },
      },
    ];

    return menu;
  },
  asset_action_click: (e, cell) => {
    let menu = [
      {
        label: `<span class="text-danger">${feather.icons["trash-2"].toSvg({
          width: 20,
          height: 20,
        })} Xóa tài sản</span>`,
        action: (e, cell) => {
          Swal.fire({
            title: "Thông báo!",
            text: `Bạn có chắc chắn muốn xóa tài sản này`,
            icon: "warning",
            showCancelButton: true,
            cancelButtonColor: "#d33",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Vâng! tôi muốn xóa",
            cancelButtonText: "Không! Tôi không muốn",
          }).then((result) => {
            if (result.isConfirmed) {
              $.transferData({
                url: __helper.url.urlPattern(__routeApi.asset.delete, {
                  id: cell.getData().id,
                }),
                success: function (res) {
                  cell.getRow().delete();
                  Swal.fire({
                    title: "Thành công!",
                    text: res.message,
                    icon: "success",
                    confirmButtonColor: "#3c9e47",
                    confirmButtonText: "Đóng",
                  });
                },
                fail: (res) => {
                  Swal.fire({
                    title: "Thông báo!",
                    text: res.message,
                    icon: "error",
                    confirmButtonColor: "#3c9e47",
                    confirmButtonText: "Đã hiểu",
                  });
                },
                error: (e) => {
                  Swal.fire({
                    title: "Thông báo!",
                    text: "Đã có lỗi xảy ra! " + e,
                    icon: "error",
                    confirmButtonColor: "#3c9e47",
                    confirmButtonText: "Đã hiểu",
                  });
                },
              });
            }
          });
        },
      },
    ];

    return menu;
  },
};

// Định nghĩa các hàm khi click vào ô
const commonCellClick = {
  select_row: function (e, cell) {
    if (!cell.getRow().isSelected()) {
      cell.getRow().select();
      return;
    }
    cell.getRow().deselect();
  },
  collapse: (e, cell) => {
    var cellEl = cell.getElement();
    if ($(cellEl).hasClass("show")) {
      $(cell.getRow().getElement()).find(".children").first().fadeOut();
      $(cellEl).removeClass("show");
    } else {
      $(cell.getRow().getElement()).find(".children").first().fadeIn();
      $(cellEl).addClass("show");
    }
  },
};
