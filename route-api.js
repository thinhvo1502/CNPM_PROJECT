const __routeApi = {
  /* User path Api */
  checkOtpAndAction: "/check-otp-and-action",
  sendOtp: "/send-otp",
  register: "/register",
  registerSocial: "/register-social",
  login: "/login",
  loginSocial: "/login-social",
  checkPhone: "/check-phone",
  checkVerifyPhone: "/check-verify-phone",
  verifyPhone: "/verify-phone",
  getUser: "/user/get",
  logout: "/logout",

  guides: "/guide/list",
  guide: "/guide/show/:id",
  news: "/news",

  logBillZns: "/log-bill-zns-list",

  // Contact
  contactGroup: "/:block_id/contact-list-group",
  downloadContact: "/:block_id/export-customer",
  showHtml: "/contract/show/html/:contract_id",

  //contract template
  createContractTemplate: "/contract-template/create",
  deleteContractTemplate: "/contract-template/delete/:template_id",
  updateContractTemplate: "/contract-template/update/:template_id",

  //totol report
  reportcontracts: "/report-contracts",

  // Nhập liệu từ file
  importDataFromFile: "/import-excel",
  downloadTemplateExcel: "/download-template-excel",
  checkDataFromFile: "/check-data-import-excel",

  /* user/householder path Api */
  user: {
    get: "/show",
    notifications: "/notification-setting",
    addBank: "/add-bank",
    updateNotification: "/update-notification-setting",
    updatePrint: "/update-print",
    updateBank: "/update-bank",
    updateRating: "/update-rating",
    updateOrCreateInfo: "/update-or-create-info",
    deleteBank: "/delete-bank/:id",
    deposit: "/deposit",
    quit: "/quit",
    balance: "/balance/list",
    meta: "/meta",
  },

  company: {
    create: "/company/create",
    update: "/company/update/:company_id",
    delete: "/company/delete/:company_id",
    lock: "/company/lock/:company_id",
    unlock: "/company/unlock/:company_id",
    updateOrCreateInfo: "/company/update-or-create-info/:company_id",
    addBank: "/company/add-bank",
    updateBank: "/company/update-bank",
    deleteBank: "/company/delete-bank/:id",
  },

  companyUser: {
    list: "/company-user/list/:company_id",
    create: "/company-user/create/:company_id",
    update: "/company-user/update/:id",
    lock: "/company-user/lock/:id",
    unlock: "/company-user/unlock/:id",
    delete: "/company-user/delete/:id",
  },

  companyRole: {
    list: "/company-role/list/:company_id",
    create: "/company-role/create/:company_id",
    update: "/company-role/update/:company_id/:id",
    delete: "/company-role/delete/:id",
    defaultPermissions: "/company-role/default-permissions",
  },

  agent: {
    list: "/agent/list",
    create: "/agent/create",
    update: "/agent/update/:id",
    lock: "/agent/lock/:id",
    unlock: "/agent/unlock/:id",
    delete: "/agent/delete/:id",
  },
  /* priceItem path Api */
  priceItem: {
    init: "/price-item/:block_id/info",
    show: "/price-item/:block_id/show/:id",
    update: "/price-item/update/:id",
    addToBlock: "/block/:block_id/price-item/store",
    removeFromBlock: "/block/:block_id/price-item/remove",
    listOfBlock: "/block/:block_id/price-item/list",
  },

  /* Localtion path Api */
  location: {
    init: "/location/init",
    provinces: "/location/provinces",
    showProvince: "/location/province/show/:id",
    showDistrict: "/location/district/show/:id",
    convertPositionToDatabase: "/location/convert-position-to-database",
    convertTextToDatabase: "/location/convert-text-to-database",
  },

  /* Upload to server */
  uploadImage: "/transfer/uploadimage",

  notification: {
    all: "/notifications/:page",
    read: "/read-notification/:id",
    delete: "/notification/delete/:id",
  },

  device: {
    register: "/device/register",
    unregister: "/device/unregister",
  },

  /* Block path Api */
  block: {
    info: "/block/info",
    list: "/block/list",
    show: "/block/show/:id",
    create: "/block/create",
    update: "/block/update/:block_id",
    updateSetting: "/block/setting-update/:block_id",
    delete: "/block/delete/:block_id",
    priceItem: "/block/:block_id/price-item",
    customerUse: "/block/:block_id/report-customer-use",
    reportReceiptExpense: "/block/report-receipt-expense",
    increasePrice: "/block/:block_id/increase-price",
    report: "/block/:block_id/report",
    deleteGroup: "/block/delete-group/:block_id",
  },

  /* Room path Api */
  room: {
    create: "/room/create/:block_id",
    updateSeries: "/room/update-series/:block_id",
    update: "/room/update/:room_id",
    moveToOther: "/room/move-to-other/:block_id",
    list: "/room/list/:block_id",
    show: "/room/show/:id",
    delete: "/room/delete/:id",
    deleteSeries: "/room/delete",
    openLinkCustomer: "/room/open-link-customer/:id",
    addCar: "/room/add-car/:id",
    updateCar: "/room/update-car/:id",
  },

  customer: {
    list: "/customer/list/:block_id",
    add: "/customer/add/:room_id",
    update: "/customer/update/:room_id",
    updateSeries: "/customer/update-series",
    delete: "/customer/delete/:customer_id",
    showHtml: "/customer/show/html/:room_id",
    search: "/customer/search/:search",
  },

  /* Post path Api */
  post: {
    list: "/post/list",
    create: "/post/create",
    update: "/post/update/:id",
    show: "/post/show/:id",
  },

  bookingSeller: {
    updatePushSale: "/post/booking-seller/update/:id",
    cancelPushSale: "/post/booking-seller/cancel/:id",
  },

  /* Post path Api */
  potential: {
    list: "/customer/potential/list",
    show: "/customer/potential/list/show/:id",
  },

  /* Bill path Api */
  bill: {
    store: "/room/:room_id/bill/store",
    update: "/room/bill/update/:id",
    prepareStore: "/room/:room_id/bill/prepare-store",
    listSeries: "/:block_id/bill/series/list",
    billSeriesAdd: "/:block_id/bill/series/add",
    updateSeries: "/:block_id/bill/series/update",
    cancel: "/room/bill/:id/cancel",
    delete: "/room/bill/:id/delete",
    show: "/room/bill/show/:id",
    showHtml: "/room/bill/show/html/:id",
    showHtmlList: "/room/bill/show-html-list",
    listByRoom: "/room/:room_id/bill/list",
    listByBlock: "/:block_id/bill/list",
    listDepositByRoom: "/room/:room_id/bill-deposit/list",
    getCurrentOfRoom: "/room/:room_id/bill",
    sendToApp: "/room/bill/send-to-app/:id",
    sendToZalo: "/room/bill/send-to-zalo/:id",
    resendToZalo: "/room/bill/resend-to-zalo/:log_id",
    shortColumn: "/:block_id/bill/short-column-excel",
  },

  /* terminate path Api */
  terminate: {
    store: "/room/:room_id/terminate/store",
    getData: "/room/:room_id/terminate/data",
    tasks: "/room/:room_id/terminate/tasks",
    cancel: "/room/:room_id/terminate/cancel/:id",
  },

  /* deposit path Api */
  deposit: {
    get_all: "/room/:room_id/deposit/list",
    get_active: "/room/:room_id/deposit/list",
    store: "/room/:room_id/deposit/store",
    show: "/room/:room_id/deposit/show",
    return: "/room/:room_id/deposit/return/:deposit_id",
  },

  /* contract path Api */
  contract: {
    show: "/room/contract/show/:id",
    store: "/room/contract/store/:room_id",
    update: "/room/contract/update/:contract_id",
    listByBlock: "/block/:block_id/contract/list",
    updateSeries: "/block/:block_id/contract/update-series",
    extend: "/block/:block_id/contract/extend",
    disconnect: "/room/contract/disconnect/:contract_id",
    updateNote: "/room/contract/update-note/:contract_id",
    showOld: "/contract/old-contract/:contract_id",
  },

  /* receiptsExpenses path Api */
  receiptsExpenses: {
    list: "/receipt-expense/list/:block_id",
    show: "/receipt-expense/show/:id",
    delete: "/receipt-expense/delete/:id",
    create: "/receipt-expense/create",
    update: "/receipt-expense/update/:id",
    updateSeries: "/receipt-expense/update-series",
    addCategory: "/receipt-expense/add/category/:block_id",
    editCategory: "/receipt-expense/edit/category/:category_id",
    disableCategory: "/receipt-expense/disable/category/:category_id",
    categories: "/receipt-expense/category/:block_id",
    expenseCategories: "/receipt-expense/expense/category/:block_id",
    receiptCategories: "/receipt-expense/receipt/category/:block_id",
    showHtml: "/receipt-expense/show-html/:id",
    showHtmlList: "/receipt-expense/show-html-list",
  },

  /* billPay path Api */
  billPay: {
    store: "/room/bill/:bill_id/pay/store",
    show: "/room/pay-bill/show/:id",
  },

  /* task path Api */
  task: {
    store: "/block/:block_id/task/store",
    update: "/block/task/update/:id",
    show: "/block/task/show/:id",
    listOfBlock: "/block/:block_id/task",
    listOfRoom: "/room/:room_id/task",
  },

  history: {
    list: "/room/:room_id/history",
  },

  /* asset path Api */
  asset: {
    create: "/asset/create/:block_id",
    list: "/asset/list/:block_id",
    updateSeries: "/asset/update-series/:block_id",
    delete: "/asset/delete/:id",
  },
};
