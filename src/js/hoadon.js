// Thêm sự kiện click để chọn tháng
document.querySelectorAll('.month-item').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelector('.month-item.active').classList.remove('active');
        this.classList.add('active');
    });
});

// Khởi tạo biến lưu trữ năm hiện tại
let currentYear = new Date().getFullYear();

// Hàm cập nhật danh sách tháng
function updateMonthList(year) {
    const monthItems = document.querySelectorAll('.month-item small'); // Lấy các năm
    // Cập nhật từng tháng theo năm mới
    monthItems.forEach((month) => {
        month.innerText = year;   // hiểu đơn giản là nội dung
    });

}

// Hàm xử lý nút Năm trước
document.getElementById('prev-year').addEventListener('click', function () {
    currentYear--; // Giảm năm
    // document.getElementById('current-year').innerText = currentYear; // Cập nhật hiển thị năm
    updateMonthList(currentYear); // Cập nhật danh sách tháng
});

// Hàm xử lý nút Năm tới
document.getElementById('next-year').addEventListener('click', function () {
    currentYear++; // Tăng năm
    // document.getElementById('current-year').innerText = currentYear; // Cập nhật hiển thị năm
    updateMonthList(currentYear); // Cập nhật danh sách tháng
});

// Gọi hàm updateMonthList lần đầu tiên để hiển thị các tháng cho năm hiện tại
// updateMonthList(currentYear);

var tableData = [
    {roomName: "Chung Cư Đảo Kim Cương", tenantName: "Nguyễn Thiên Khiêm", electronicBill: "300,000,000đ", waterBill: "500,000,000đ", total: "800,000,000đ",status: "Đã thu 10 năm"},
    {roomName: "Chung Cư Đảo Kim Cương", tenantName: "Nguyễn Thiên Khiêm", electronicBill: "300,000,000đ", waterBill: "500,000,000đ", total: "800,000,000đ",status: "Đã thu 10 năm"}

];

// Định nghĩa định dạng tùy chỉnh
var printIcon = function(cell, formatterParams, onRendered) {
    // return "<i class='fa-solid fa-wallet'></i>"; // Trả về mã HTML cho biểu tượng in
    return "<i class='fa-solid fa-file-invoice'></i>"
};

// Khởi tạo bảng Tabulator
var table = new Tabulator("#tenant-bill", {
    // responsiveLayout: true, // giảm độ rộng các cột để vừa với chiều rộng pt
    height: "100%",
    rowHeight:40, //set rows to 40px height
    data: tableData,
    layout: "fitColumns",
    layoutColumnsOnNewData:true, // adjust columns width when load data.
    // resizableRows:true, // this option takes a boolean value (default = false)
    placeholder:"No Data Available", //display message to user on empty table
    // footerElement:"<button>Custom Button</button>", //add a custom button to the footer element
    columns: [
        // {title:"Name", field:"name", frozen:true}, //frozen column on left of table
        {title: "Tên Phòng", field: "roomName", hozAlign: "center", width: 200}, 
        {title: "Tên Khách Thuê", field: "tenantName", hozAlign: "center"},
        {title: "Tiền điện", field: "electronicBill", hozAlign: "center", editor: "select", editorParams: {values: ["Đang thuê", "Trống"]}},
        {title: "Tiền nước", field: "waterBill", hozAlign: "right", editor: "number"},
        {title: "Tổng cộng", field: "total", hozAlign: "right", editor: "number"},
        {title: "Trạng thái", field: "status", hozAlign: "center", editor: "number"},
    ],
    rowHeader:{formatter: printIcon, width: 30, hozAlign: "center"},
    rowContextMenu: [
        {
            label:"Xóa",
            action:function(e, row){
                // Xóa hàng
                row.delete();
            }
        }
    ]
});
