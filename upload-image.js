var ___uploadImage = function ($ele, options) {
  this.ele = $ele;
  let self = this;
  this.currentTime = new Date().getTime();

  this.settings = $.extend(
    {
      type: "common",
      label: "Tải hình ảnh",
      name: "upload_image_" + new Date().getTime(),
      error: "Vui lòng nhập hình ảnh",
      required: false,
      value: null,
      height: 100,
      multiple: false,
      max: 5,
    },
    options
  );

  this.iconImage = $(
    `<div style="margin:auto">${feather.icons["image"].toSvg({
      width: 30,
      height: 30,
    })}</div>`
  );
  this.addIconImage = $(
    `<div class="icon-add-label __add-more-imge" style="margin:auto" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Thêm hình ảnh">${feather.icons[
      "plus"
    ].toSvg({ width: 30, height: 30 })}</div>`
  );
  this.iconRemoveImage = $(
    `<div style="margin:auto">${feather.icons["x"].toSvg({
      width: 20,
      height: 20,
    })}</div>`
  );
  this.iconDownloadImage = $(
    `<div style="margin:auto">${feather.icons["download"].toSvg({
      width: 20,
      height: 20,
    })}</div>`
  );
  this.iconUpload = $(
    `<div class="icon-upload" style="margin:auto">${feather.icons[
      "upload-cloud"
    ].toSvg({ width: 30, height: 30 })}</div>`
  );
  this.placeholder = $(
    `<div class="placeholder __add-more-imge" style="display: grid;cursor: pointer !important;width: 100%;align-items: center;justify-content: center;height: 100%;margin:-10px;">`
  )
    .append(this.iconUpload)
    .append(
      `<label style="text-decoration:underline" for="${this.currentTime}">${this.settings.label}</label>`
    );
  this.validateAlert = $(
    `<div class="invalid-feedback">${this.settings.error}</div>`
  );

  // Get value default
  this.value = this?.settings?.value ?? null;

  if (this.settings.required)
    this.input = $(
      `<input type="file" style="display: none" name="${
        this.settings.name
      }" id="${this.settings.name}${this.currentTime}" ${
        this.settings.multiple ? "multiple" : ""
      } accept="image/*" required>`
    );
  else
    this.input = $(
      `<input type="file" style="display: none" name="${
        this.settings.name
      }" id="${this.settings.name}${this.currentTime}" ${
        this.settings.multiple ? "multiple" : ""
      } accept="image/*">`
    );

  this.ele.on("change", this.input, (e) => {
    self.onChange(e);
  });

  this.ele.on("click", ".__add-more-imge", (e) => {
    self.input.click();
  });

  this.settings.multiple ? this.renderMultiple() : this.render();
};

$.extend(___uploadImage.prototype, {
  // Render cho một hình ảnh
  render: function () {
    this.ele.html("");
    let container_upload = $('<div class="container-upload">');
    let eleImage = this.getEleImage();

    if (eleImage) {
      this.ele.addClass("has_image");
      this.ele.css({
        height: this.settings.height,
      });
      container_upload.append(eleImage);
    } else {
      this.ele.removeClass("has_image");
      this.ele.css({
        height: this.settings.height,
      });
    }
    this.ele
      .append(this.input)
      .append(
        container_upload
          .append(this.placeholder)
          .append(this.validateAlert)
          .append($(`<div class="loading-image">Đang tải hình ảnh....</div>`))
      );
  },

  // Render cho nhiều hình ảnh
  renderMultiple: function () {
    this.ele.html("");
    let container_upload = $('<div class="container-upload">');
    let eleImages = this.getEleImages();

    if (eleImages) {
      this.ele.addClass("has_image");
      container_upload.append(
        eleImages.append(
          $(`<div class="image image-ele-item">`).append(this.addIconImage)
        )
      );
    } else {
      this.ele.removeClass("has_image");
    }
    this.ele
      .append(this.input)
      .append(
        container_upload
          .append(this.placeholder)
          .append(this.validateAlert)
          .append($(`<div class="loading-image">Đang tải hình ảnh....</div>`))
      );
  },

  // Khi input chọn ảnh thay đổi
  onChange: function (e) {
    if (e?.target?.files?.length === 0) {
      Swal.fire({
        title: "Thông báo!",
        text: `Vui lòng chọn một hình ảnh để tải ảnh`,
        icon: "error",
        confirmButtonText: "Đã hiểu",
      });
      return false;
    }

    let dataSend = this?.settings?.multiple
      ? {
          image_type: this?.settings?.type ?? "common",
          images: e.target.files,
        }
      : {
          image_type: this?.settings?.type ?? "common",
          image: e.target.files[0],
        };

    if (
      (this?.value ?? []).length + e.target.files.length >
      this.settings.max
    ) {
      Swal.fire({
        title: "Thông báo!",
        text: `Bạn chỉ được phép thêm tối ta ${this.settings.max} ảnh`,
        icon: "error",
        confirmButtonText: "Đã hiểu",
      });
      return false;
    }

    let service = this.ele.data("service");

    $.transferImage({
      loadingEle: this.ele.find(".loading-image"),
      data: dataSend,
      multiple: this?.settings?.multiple ?? false,
      service: service ?? "owner",
      success: (res) => {
        if (this?.settings?.multiple) {
          this.value = (this.value ?? []).concat(res.data);
          this.renderMultiple();
        } else {
          this.value = res.data;
          this.render();
        }
        this.input.val("");
      },
      fail: (res) => {
        Swal.fire({
          title: "Thông báo!",
          text: res.message,
          icon: "error",
          confirmButtonText: "Đã hiểu",
        });
      },
      error: (e) => {
        Swal.fire({
          title: "Thông báo!",
          text: e,
          icon: "error",
          confirmButtonText: "Đã hiểu",
        });
      },
    });
  },

  getEleImage: function () {
    return this?.value?.url_full
      ? $(
          `<div class="image">
                <a href="${this.value.url_full}" target="_bank">
                    <img style="object-fit: cover;" height="100%" width="100%" alt="" src="${this.value.url_full}">
                </a>
            </div>`
        ).append(
          $(
            `<label class="icon-label __add-more-imge" for="${this.currentTime}">`
          ).append(this.iconImage)
        )
      : null;
  },

  getEleImages: function () {
    if (!this?.value || this?.value?.length === 0) return null;
    let self = this;
    let container_item_images = $('<div class="container-item-images">');
    this.value.map((image, index) => {
      container_item_images.append(
        $(
          `<div class="image image-ele-item">
                        <a href="${image.url_full}" target="_bank">
                            <img style="object-fit: cover;" height="100%" width="100%" alt="" src="${image.url_full}">
                        </a>
                    </div>`
        )
          .append(
            $(`<div class="icon-remove-label" for="${this.currentTime}">`)
              .append(this.iconRemoveImage.clone())
              .click((e) => {
                e.preventDefault();

                self.value.splice(index, 1);
                self.renderMultiple();
                return false;
              })
          )
          .append(
            $(`<div class="icon-download-label" for="${this.currentTime}">`)
              .append(this.iconDownloadImage.clone())
              .click((e) => {
                e.preventDefault();
                const downloadLink = $("<a></a>");
                downloadLink.attr("href", image.url_full);
                downloadLink.attr("download", image.file_name);
                $("body").append(downloadLink);
                downloadLink[0].click();
                downloadLink.remove();
              })
          )
      );
      return null;
    }) ?? null;

    return container_item_images;
  },

  // Gán giá trị cho option
  setOption: function (key, value) {
    if (typeof this.settings[key] === "undefined")
      throw key + " Không tồn tại option";

    this.settings[key] = value;

    this.settings.multiple ? this.renderMultiple() : this.render();
  },

  // Kiểm tra object image có đúng định dạng hay không?
  checkValueItem: (image) => {
    console.log(this);
  },

  // Gán giá trị cho input
  setValue: function (value) {
    this.value = value;

    if (this.settings.multiple) {
      this?.value &&
        this?.value?.length !== 0 &&
        this.value.map((item) => {
          if (typeof item.url_full === "undefined") {
            throw "Giá trị không hợp lệ";
          }
        });

      this.renderMultiple();
    } else {
      if (value && typeof value.url_full === "undefined") {
        throw "Giá trị không hợp lệ";
      }

      this.render();
    }
  },
});

$.fn.uploadImageSimple = function (options) {
  let $this = $(this),
    uploadImageData = $this.data("uploadImageData");

  if (typeof options === "object") {
    if (!uploadImageData) {
      uploadImageData = new ___uploadImage($this, options);
      $this.data("uploadImageData", uploadImageData);
    }
  } else {
    alert("Option is require!");
  }

  return uploadImageData;
};
