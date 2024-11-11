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
    {room: "hihi",phoneNumber: "0121313213", status: "no cap",month: "10/2024",sendingTime: "11/2025", state: "Thành công",paymentDate: "12/12/1212"}
];
var table = new Tabulator("#zalo-table", {
    // responsiveLayout: true, // giảm độ rộng các cột để vừa với chiều rộng pt
    height: "100%",
    rowHeight:40, //set rows to 40px height
    data: tableData,
    layout: "fitColumns",
    layoutColumnsOnNewData:true, // adjust columns width when load data.
    // resizableRows:true, // this option takes a boolean value (default = false)
    placeholder:"No Data Available", //display message to user on empty table
    // footerElement:"<button>Custom Button</button>", //add a custom button to the footer element
    vertAlign: "middle",
    hozAlign: "center",
    columns: [
        // {title:"Name", field:"name", frozen:true}, //frozen column on left of table
        {title: "Phòng", field: "room", hozAlign: "center", width: 150,editor: "input"}, 
        {title: "Số điện thoại", field: "phoneNumber", hozAlign: "center", width:150, editor: "input"},
        {title: "Mô tả", field: "status", hozAlign: "center", width: 900, editor: "select", editorParams: {values: ["Đang thuê", "Trống"]}},
        {title: "Tháng", field: "month", hozAlign: "right", editor: "number"},
        {title: "Thời gian gửi", field: "sendingTime", hozAlign: "right", editor: "number"},
        {title: "Trạng thái", field: "state", hozAlign: "right", width: 100, editor: "number"},
        {title: "Ngày thanh toán", field: "paymentDate", hozAlign: "center", editor: "number"},
        {title: "Thao tác", field: "behaviors", hozAlign: "center", width: 100,formatter: function(cell, formatterParams){
            return "<button class='retry-btn' >Gửi lại</button>";
        }},
        
    ],
    // rowHeader:{formatter: printIcon, width: 40, hozAlign: "center"},

});

// Đăng ký sự kiện cho nút sau khi bảng đã tải
document.addEventListener("DOMContentLoaded", function() {
    // Xử lý sự kiện cho nút "Gửi lại"
    document.querySelector("#zalo-table").addEventListener("click", function(e) {
        if(e.target && e.target.classList.contains("retry-btn")) {
            alert("Gửi lại hóa đơn!");
            // Thêm logic để gửi lại hóa đơn ở đây
        }
    });
});