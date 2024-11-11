const isIsoDate = function (str) {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
  const d = new Date(str);
  return d instanceof Date && !isNaN(d) && d.toISOString() === str; // valid date
};

const __countStatus = (data, status, prefix = "status") => {
  if (!data || !Array.isArray(data) || data.length === 0) return 0;

  return data.reduce((count, obj) => {
    if (obj[prefix] === status) {
      count++;
    }
    return count;
  }, 0);
};

const __convertData = function (value, type, isFormat = false) {
  switch (type) {
    case "numeric":
      // Nên nhớ đầu vào là chuẩn việt nam: dấu chấm là hàng ngàn dấu phẩy là thập phân.
      if (typeof value === "string")
        value = !isFormat
          ? value
            ? Number(value.replaceAll(".", "") ?? 0)
            : null
          : (value
              ? Number(value.replaceAll(".", "") ?? 0)
              : null
            ).toLocaleString("vi-VN");

      if (typeof value === "number" && isFormat) {
        value = Number(value ?? 0).toLocaleString("vi-VN");
      }
      break;
    case "stringNumber":
      value = !isFormat
        ? __helper.getNumericFromString(value) ?? null
        : __format.phone(value);
      break;

    case "int":
      value = parseInt(__helper.getNumericFromString(value) ?? 0) ?? 0;
      break;

    case "float":
      value = parseFloat(value ?? 0);
      break;

    case "boolean":
      value = !value || value === "false" || value === "0" ? 0 : 1;
      break;

    case "object":
      if (typeof value === "string") {
        value = JSON.parse(value);
      }
      break;

    case "date":
      let pattern = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
      if (typeof value === "string" && value.match(pattern)) {
        const [day, month, year] = value.split("/");
        value = new Date(`${year}-${month}-${day}`).getTime();

        if (isFormat) {
          value = new Date(value).toISOString();
        }
      } else if (isIsoDate(value)) {
        value = new Date(value).getTime();
        if (isFormat) {
          value = new Date(value).toISOString();
        }
      } else if (typeof value === "number") {
        value = value;
        if (isFormat) {
          value = new Date(value).toISOString();
        }
      } else {
        value = null;
      }
      break;
  }
  return value;
};

const __setValueForForm = function (ele, value) {
  if (ele.attr("type") === "checkbox") {
    ele.prop("checked", Boolean(value));
  } else if (ele.attr("type") === "radio") {
    ele.length > 0 &&
      ele.map((index, itemEle) => {
        if ($(itemEle).val() === value || $(itemEle).val() == value) {
          $(itemEle).prop("checked", true);
        }
      });
  } else {
    if (ele.attr("type") !== "file") ele.val(value);
  }

  // Triger cho các ele có sự kiện change.
  if (
    ele.prop("name") === "select" ||
    ele.attr("type") === "checkbox" ||
    ele.attr("type") === "radio"
  ) {
    ele.change();
  }
};

// Chuyển form value thành object
$.fn.getObjectOfForm = function () {
  let _ = {};
  let self = this;
  $.map(this.serializeArray(), function (n) {
    let value = n.value;

    const keys = n.name.match(/[a-zA-Z0-9_]+|(?=\[\])/g);
    const type = $(self).find(`*[name="${n.name}"]`).data("format");

    value = __convertData(value, type);

    if (keys.length > 1) {
      let tmp = _;
      pop = keys.pop();

      for (let i = 0; i < keys.length, (j = keys[i]); i++) {
        (tmp[j] = !tmp[j] ? (pop === "" ? [] : {}) : tmp[j]), (tmp = tmp[j]);
      }

      if (pop === "") (tmp = !Array.isArray(tmp) ? [] : tmp), tmp.push(value);
      else tmp[pop] = value;
    } else {
      _[keys.pop()] = value;
    }
  });
  return _;
};

// Chuyển object tới form
$.fn.setObjectToForm = function (data) {
  let formEle = $(this);
  Object.keys(data).map((name) => {
    if (typeof data[name] === "object") {
      if (data[name] !== null && data[name] !== [] && data[name] !== {}) {
        eles = formEle.find(`*[name^="${name}"]`).filter(function (idx, ele) {
          return new RegExp(`^${name}\\[(.*?)\\]$`).test(ele.name);
        });

        // Radio và select không hỗ trợ kiểu dữ liệu object or array
        if (
          eles.length > 0 &&
          eles.attr("type") !== "radio" &&
          eles.prop("name") !== "select"
        ) {
          // Đếm các tên giống nhau. Trường hợp dùng cho các tên là danh sách mã ví dụ: item[]
          let countNameTheSame = {};
          eles.each(function (idx, ele) {
            ele = $(ele);
            if (ele.attr("type") === "checkbox") {
              if (Array.isArray(data[name])) {
                let value = __convertData(ele.val(), ele.data("format"), false);
                let hasValue = data[name].includes(value);
                //console.log(value, data[name], hasValue);
                __setValueForForm(ele, hasValue);
              } else {
                // Kiểm tra tên của input có trong data(object) đầu vào hay k ?
                let nameData =
                  `data['${name}']` +
                  ele.attr("name").replace(/(.*?)\[(.*?)\]/g, "['$2']");

                if (typeof ele[ele] !== "undefined") {
                  ele[nameData]["count"] = ele[nameData]["count"] + 1;
                  ele[nameData]["name"] = nameData;
                } else {
                  ele[nameData] = {
                    name: nameData,
                    count: 0,
                  };
                }

                if (
                  nameData.includes("['']") &&
                  typeof ele[nameData]["count"] !== "undefined"
                ) {
                  nameData = nameData.replace(
                    "['']",
                    `[${ele[nameData]["count"]}]`
                  );
                }

                try {
                  let value = __convertData(
                    eval(nameData),
                    ele.data("format"),
                    false
                  );
                  __setValueForForm(ele, ele.val() == value);
                } catch (error) {
                  console.log(
                    `${nameData}: Không tìm thấy trong data đầu vào!`
                  );
                }
              }
            } else {
              let nameData =
                `data['${name}']` +
                ele.attr("name").replace(/(.*?)\[(.*?)\]/g, "['$2']");

              if (typeof ele[ele] !== "undefined") {
                ele[nameData]["count"] = ele[nameData]["count"] + 1;
                ele[nameData]["name"] = nameData;
              } else {
                ele[nameData] = {
                  name: nameData,
                  count: 0,
                };
              }

              if (
                nameData.includes("['']") &&
                typeof ele[nameData]["count"] !== "undefined"
              ) {
                nameData = nameData.replace(
                  "['']",
                  `[${ele[nameData]["count"]}]`
                );
              }

              try {
                let value = __convertData(
                  eval(nameData),
                  ele.data("format"),
                  false
                );
                //console.log(nameData, eval(nameData), value, ele);
                __setValueForForm(ele, value);
              } catch (error) {
                __setValueForForm(ele, JSON.stringify(data[name]));
              }
            }
          });
        }
      }
    } else {
      let ele = formEle.find(`*[name="${name}"]`);
      if (ele.length > 0) {
        let value = null;
        if (ele.attr("type") === "checkbox") {
          value =
            ele.val() == __convertData(data[name], ele.data("format"), false);
        } else if (
          ele.prop("name") === "select" ||
          ele.attr("type") === "radio"
        ) {
          value = __convertData(data[name], ele.data("format"), false);
        } else {
          value = __convertData(data[name], ele.data("format"), true);
        }
        __setValueForForm(ele, value);
      }
    }
  });
};

/**
 * Lấy các giá trị mặc định theo từng loại dịch vụ
 * @param item
 * @param initValue
 * @returns {[string]|[string]}
 */

const unitDefault = ["thang", "lan", "cai"];
const unitPeople = "nguoi";
const unitCar = "chiec";

const __getDefaultPriceItemsValue = (item, initValue) => {
  let valueDefault = unitDefault.includes(item?.unit) ? [1] : [""];

  if (item?.unit === unitPeople && !item?.subtraction) {
    valueDefault = [
      initValue?.customer_count ??
        (initValue?.customers ? initValue.customers.length : 1),
    ];
  }

  if (item?.unit === unitCar && !item?.subtraction) {
    valueDefault = [initValue?.car ? initValue.car.length : 1];
  }

  if (item?.subtraction) {
    valueDefault = [0, 0];

    if (
      Array.isArray(item?.value) &&
      item?.value?.length === 2 &&
      item?.subtraction
    )
      valueDefault = [parseInt(item?.value[0]), parseInt(item?.value[1])];
  }

  if (
    Array.isArray(item?.value) &&
    item?.value?.length === 1 &&
    !item?.subtraction
  ) {
    valueDefault = [parseInt(item.value[0])];
  }

  return valueDefault;
};

/**
 * prepare data price items
 * @param data
 * @param initValue
 */
const __preparePriceItems = (data, initValue) => {
  Array.isArray(data) &&
    data.length > 0 &&
    data.map((item, index) => {
      // Get default
      let valueDefault = __getDefaultPriceItemsValue(item, initValue);

      item.value = item?.value ?? valueDefault;

      if (item?.unit === unitPeople && item?.value && item.value.length === 1) {
        // Khi đơn vị là người thì ưu tiên lấy số lượng được set ở room
        if (parseInt(item?.value[0]) !== parseInt(valueDefault[0]))
          item.value = valueDefault;
      }
      return item;
    });
  return data;
};

// class xử lý modal chỉnh sửa
const __modalForm = function (modal, form = null, submit = null) {
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
  this.option = null;

  this.init = function () {
    let self = this;
    this.modal.addEventListener("shown.bs.modal", function (e) {
      typeof self.__openModalForm === "function" &&
        self.__openModalForm(e, self);

      feather.replace();

      if (self.form) {
        // Format các input là tiền tệ
        $(self.form).find('input.currency[type="text"]')?.length > 0 &&
          $(self.form)
            .find('input.currency[type="text"]')
            .map((index, input) => {
              $(input).val(__format.currencyInput($(input).val()));
            });

        $(self.form).find('input.phone[type="text"]')?.length > 0 &&
          $(self.form)
            .find('input.phone[type="text"]')
            .map((index, input) => {
              $(input).val(__format.phone($(input).val()));
            });
      }
    });

    this.modal.addEventListener("hide.bs.modal", function (e) {
      typeof self.__closeModalForm === "function" &&
        self.__closeModalForm(e, self);

      if (self?.form) {
        self.form.reset();
        self.form.classList.remove("was-validated");
      }
      feather.replace();
    });

    this?.submit &&
      $(this.submit).click((e) => {
        if (typeof self.__submitModalForm === "function") {
          self.__submitModalForm(e, self);
        }
        feather.replace();
      });
  };

  /**
   * Mở modal và bắt đầu chỉnh sửa
   * @param option
   * @param __submitModalForm: Function sau khi submit
   * @param __openModalForm: Function khi mở
   * @param __closeModalForm: Function sau khi đóng
   */
  this.start = function (
    option,
    { __openModalForm, __submitModalForm, __closeModalForm }
  ) {
    this.option = option;

    if (typeof __submitModalForm !== "undefined")
      this.__submitModalForm = __submitModalForm;

    if (typeof __openModalForm !== "undefined")
      this.__openModalForm = __openModalForm;

    if (typeof __closeModalForm !== "undefined")
      this.__closeModalForm = __closeModalForm;
  };
  this.init();
};
