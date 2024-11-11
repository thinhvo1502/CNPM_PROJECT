const ENV = __environment;

const domain = {
  local: "http://chutro.lozido.local",
  demo: "https://demo.quanlytro.me",
  production: "https://quanlytro.me",
};

const domain_image = {
  local: "http://cdn.lozido.local",
  demo: "https://cdn.quanlytro.me",
  production: "https://cdn.quanlytro.me",
};

const domain_renter_api = {
  local: "http://timtronhanh.local",
  demo: "https://demo.lozido.com",
  production: "https://lozido.com",
};

const domain_renter_image = {
  local: "http://cdn.lozido.local",
  demo: "https://cdn.lozido.com",
  production: "https://cdn.lozido.com",
};

const ServiceConfig = {
  URL: `${domain[ENV]}`,

  API_URL: `${domain[ENV]}/api/householder-admin/v1`,
  API_URL_RENTER: `${domain_renter_api[ENV]}/api/owner/v1`,

  IMAGE_URL: `${domain_image[ENV]}`,
  IMAGE_URL_RENTER: `${domain_renter_image[ENV]}`,

  BILL_LINK_PUBLIC: `${domain[ENV]}/bill/:bill_id`,
};

const fetchImageAPI = function (url, body = null, service = "owner") {
  let headers = {
    Accept: "application/json",
  };

  if (__helper.getCookie("access_token")) {
    headers.Authorization = "Bearer " + __helper.getCookie("access_token");
  }

  let apiUrl = ServiceConfig.IMAGE_URL + url;
  if (service === "renter") {
    apiUrl = ServiceConfig.IMAGE_URL_RENTER + url;
  }

  let request = fetch(apiUrl, {
    method: "POST",
    body: body,
    headers: headers,
  });

  return request
    .then((response) => {
      return response.json().then((json) => ({
        status: response.status,
        statusType: response.statusType,
        json,
      }));
    })
    .then(({ status, statusType, json }) => {
      return json;
    })
    .catch((e) => {
      return Promise.reject(`${e}`);
    });
};

/**
 * Thực hiện đệ quy để format theo new FormData()
 * @param formData
 * @param data
 * @param parentKey
 * @returns {boolean}
 */
const __buildFormData = function (formData, data, parentKey) {
  if (
    data &&
    typeof data === "object" &&
    !(data instanceof Date) &&
    !(data instanceof File)
  ) {
    Object.keys(data).forEach((key) => {
      __buildFormData(
        formData,
        data[key],
        parentKey ? `${parentKey}[${key}]` : key
      );
    });
  } else {
    if (data === null || typeof data === "undefined") {
      return false;
    }
    formData.append(parentKey, data);
  }
};

/**
 * Chuẩn bị dữ liệu ForrmData()
 * @param data
 * @returns {FormData}
 */
const __convertJsonToFormData = function (data) {
  const formData = new FormData();
  __buildFormData(formData, data);
  return formData;
};

const __specialCode = [
  400,
  401, // Không có quyền truy cập
  406,
  503, // Sever bị lỗi
  -2,
  -3,
  -4,
];

const processSpecialCode = function (res) {
  if (__specialCode.includes(res.code)) {
    if (res.code === 419) {
      Swal.fire({
        title: "Thông báo!",
        text: "Bạn đã hết thời gian truy cập. Vui lòng tải lại trang để tiếp tục!",
        icon: "error",
        confirmButtonText: "Tải lại trang",
      }).then((result) => {
        location.reload();
      });
    }
    if (res.code === 400) {
      Swal.fire({
        title: "Thông báo!",
        text:
          res?.message ??
          "Đã có 1 lỗi xảy ra! Vui lòng liên hệ chuyên viên kỹ thuật LOZIDO hỗ trợ.",
        icon: "error",
        confirmButtonText: "Đã hiểu",
      });
    }
    if (res.code === 401) {
      Swal.fire({
        title: "Thông báo!",
        text: "Bạn không có quyền tuy cập vào trang này!",
        icon: "error",
        confirmButtonText: "Đã hiểu",
      });
    }
    if (res.code === 406) {
      Swal.fire({
        title: "Thông báo!",
        text: res.message,
        icon: "error",
        confirmButtonText: "Đã hiểu",
      });
    }
    if (res.code === -2) {
      Swal.fire({
        title: "Thông báo!",
        text: "Tài khoản của bạn chưa được xác minh vui lòng xác minh trước khi tiếp tục quản lý!",
        icon: "error",
        confirmButtonText: "Đã hiểu",
      });
    }
    if (res.code === -3) {
      Swal.fire({
        title: "Thông báo!",
        text:
          res?.data?.message ??
          "Tài khoản của bạn đã bị khóa! Vui lòng liên hệ chuyên viên để được tư vấn",
        icon: "error",
        confirmButtonText: "Đã hiểu",
      });
    }
    if (res.code === 503) {
      Swal.fire({
        title: "Thông báo!",
        text: "Hệ thống đang bảo trì. Vui lòng quay lại sau",
        icon: "error",
        confirmButtonText: "Đã hiểu",
      });
    }
    return true;
  }
  return false;
};

$.transferData = function ({
  service = "owner",
  url,
  data = null,
  method = "GET",
  textLoading = "Đang tải dữ liệu...",
  loadingEle = $("#app_loading"),
  success,
  fail,
  error,
}) {
  textLoading &&
    loadingEle &&
    loadingEle.find(".loading_text").length > 0 &&
    loadingEle.find(".loading_text").text(textLoading);

  let csrf_token = document.querySelector('meta[name="csrf-token"]').content;
  if (csrf_token) {
    if (method !== "GET" && data) {
      data._token = csrf_token;
    } else {
      url = __helper.url.queryUrl(url, {
        _token: csrf_token,
      });
    }
  }

  let apiUrl = `${ServiceConfig.API_URL}${url}`;
  if (service === "renter") {
    apiUrl = `${ServiceConfig.API_URL_RENTER}${url}`;
  }

  return new Promise((resolve, reject) =>
    $.ajax({
      type: method,
      url: apiUrl,
      data: data ? JSON.stringify(data) : null,
      contentType: "application/json; charset=UTF-8",

      beforeSend: function (xhr) {
        loadingEle && $(loadingEle).fadeIn();

        xhr.setRequestHeader(
          "Authorization",
          `Bearer ${__helper.getCookie("access_token")}`
        );
      },
      complete: function () {
        loadingEle && $(loadingEle).fadeOut();
      },
      success: function (res) {
        loadingEle && $(loadingEle).fadeOut();

        if (typeof res !== "object") {
          Swal.fire({
            title: "Thông báo lỗi!",
            text: "Thao tác thất bại! Dữ liệu trả về không đúng như mong đợi.",
            icon: "error",
            confirmButtonText: "Đã hiểu",
          });
          reject("Đã có lỗi!");
        }

        if (!processSpecialCode(res)) {
          res.status === "success" &&
            typeof success === "function" &&
            success(res);
          res.status === "fail" && typeof fail === "function" && fail(res);
          res.status === "error" &&
            typeof error === "function" &&
            error(res.message) &&
            reject(res.message);
          resolve(res);
        }
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        loadingEle && $(loadingEle).fadeOut();

        Swal.fire({
          title: "Thông báo lỗi!",
          text: "Đã có lỗi xảy ra - " + errorThrown,
          icon: "error",
          confirmButtonText: "Đã hiểu",
        });
        typeof error === "function" && error(errorThrown);
        reject("Đã có lỗi!");
      },
    })
  );
};

$.transferForm = function ({
  service = "owner",
  url,
  data = null,
  method = "POST",
  textLoading = "Đang tải dữ liệu...",
  loadingEle = $("#app_loading"),
  success,
  fail,
  error,
}) {
  textLoading &&
    loadingEle &&
    loadingEle.find(".loading_text").length > 0 &&
    loadingEle.find(".loading_text").text(textLoading);

  let csrf_token = document.querySelector('meta[name="csrf-token"]').content;
  if (csrf_token) {
    if (method !== "GET" && data) {
      data._token = csrf_token;
    } else {
      url = __helper.url.queryUrl(url, {
        _token: csrf_token,
      });
    }
  }

  data = __convertJsonToFormData(data);

  let apiUrl = `${ServiceConfig.API_URL}${url}`;
  if (service === "renter") {
    apiUrl = `${ServiceConfig.API_URL_RENTER}${url}`;
  }

  return new Promise((resolve, reject) => {
    if (!data) {
      typeof error === "function" &&
        error(
          "Đã có lỗi xảy ra khi xử lý dữ liệu gửi lên! Lỗi này của hệ thống chúng tôi, báo cho chuyên viên để được hỗ trợ"
        );

      reject(
        "Đã có lỗi xảy ra khi xử lý dữ liệu gửi lên! Lỗi này của hệ thống chúng tôi, báo cho chuyên viên để được hỗ trợ"
      );
      return false;
    }

    try {
      $.ajax({
        type: method,
        url: `${apiUrl}`,
        data: data,
        processData: false,
        contentType: false,
        beforeSend: function (xhr) {
          loadingEle && $(loadingEle).fadeIn();

          xhr.setRequestHeader(
            "Authorization",
            `Bearer ${__helper.getCookie("access_token")}`
          );
        },
        complete: function () {
          loadingEle && $(loadingEle).fadeOut();
        },
        success: function (res) {
          loadingEle && $(loadingEle).fadeOut();

          if (typeof res !== "object") {
            Swal.fire({
              title: "Thông báo lỗi!",
              text: "Thao tác thất bại! Dữ liệu trả về không đúng như mong đợi.",
              icon: "error",
              confirmButtonText: "Đã hiểu",
            });
            reject("Đã có lỗi!");
          }

          if (!processSpecialCode(res)) {
            res.status === "success" &&
              typeof success === "function" &&
              success(res);
            res.status === "fail" && typeof fail === "function" && fail(res);
            res.status === "error" &&
              typeof error === "function" &&
              error(res.message) &&
              reject(res.message);
            resolve(res);
          }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          loadingEle && $(loadingEle).fadeOut();

          Swal.fire({
            title: "Thông báo lỗi!",
            text: "Đã có lỗi xảy ra - " + errorThrown,
            icon: "error",
            confirmButtonText: "Đã hiểu",
          });

          typeof error === "function" && error(errorThrown);
          reject("Đã có lỗi!");
        },
      });
    } catch (e) {
      typeof error === "function" && error(e);
      reject("Đã có lỗi! " + e);
    }
  });
};

$.transferImage = function ({
  service = "owner",
  data = null,
  textLoading = "Đang tải dữ liệu...",
  loadingEle = $("#app_loading"),
  multiple = false,
  success,
  fail,
  error,
}) {
  textLoading &&
    loadingEle &&
    loadingEle.find(".loading_text").length > 0 &&
    loadingEle.find(".loading_text").text(textLoading);

  return new Promise((resolve, reject) => {
    data = __convertJsonToFormData(data);

    if (!data) {
      typeof error === "function" &&
        error(
          "Đã có lỗi xảy ra khi xử lý dữ liệu gửi lên! Lỗi này của hệ thống chúng tôi, báo cho chuyên viên để được hỗ trợ"
        );

      reject(
        "Đã có lỗi xảy ra khi xử lý dữ liệu gửi lên! Lỗi này của hệ thống chúng tôi, báo cho chuyên viên để được hỗ trợ"
      );
      return false;
    }

    loadingEle && $(loadingEle).fadeIn();

    //@TODO: làm cho phần gửi form từ các format dữ liệu khác
    fetchImageAPI(
      multiple ? "/api/upload/images" : "/api/upload/image",
      data,
      service
    )
      .then((res) => {
        loadingEle && $(loadingEle).fadeOut();

        if (typeof res !== "object") {
          Swal.fire({
            title: "Thông báo lỗi!",
            text: "Thao tác thất bại! Dữ liệu trả về không đúng như mong đợi.",
            icon: "error",
            confirmButtonText: "Đã hiểu",
          });
          reject("Đã có lỗi!");
        }

        if (!processSpecialCode(res)) {
          res.status === "success" &&
            typeof success === "function" &&
            success(res);
          res.status === "fail" && typeof fail === "function" && fail(res);
          res.status === "error" &&
            typeof error === "function" &&
            error(res.message) &&
            reject(res.message);
          resolve(res);
        }
      })
      .catch((e) => {
        loadingEle && $(loadingEle).fadeOut();

        Swal.fire({
          title: "Thông báo lỗi!",
          text: "Đã có lỗi xảy ra" + e,
          icon: "error",
          confirmButtonText: "Đã hiểu",
        });

        typeof error === "function" && error(e);
        reject("Đã có lỗi! " + e);
      });
  });
};
