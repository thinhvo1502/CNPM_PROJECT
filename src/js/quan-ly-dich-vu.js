var tableData = [
    // {room: "Phòng 1", electricityOld: 0, electricityNew: 5, electricityAmount: "8.500 ₫", waterOld: 0, waterNew: 4, waterAmount: "450.000 ₫", wifiUsed: 2, wifiAmount: "200.000 ₫"},
    // {room: "Phòng 2", electricityOld: 0, electricityNew: 12, electricityAmount: "20.400 ₫", waterOld: 0, waterNew: 21, waterAmount: "378.000 ₫", wifiUsed: 2, wifiAmount: "200.000 ₫"},
];

var table = new Tabulator("#tenant-service-table", {
    data: tableData,
    layout: "fitColumns", // Điều chỉnh chiều rộng các cột tự động lấp đầy bảng
    placeholder:"No data available",
    columns: [
        {title: "Tên phòng", field: "room"},
        {
            title: "Tiền điện (KWh)", columns: [
                {title: "Số cũ", field: "electricityOld"},
                {title: "Số mới", field: "electricityNew"},
                {title: "Thành tiền", field: "electricityAmount", formatter: "html"},
            ]
        },
        {
            title: "Tiền nước (Khối)", columns: [
                {title: "Số cũ", field: "waterOld"},
                {title: "Số mới", field: "waterNew"},
                {title: "Thành tiền", field: "waterAmount", formatter: "html"},
            ]
        },
        {
            title: "Tiền wifi (Tháng)", columns: [
                {title: "Sử dụng", field: "wifiUsed"},
                {title: "Thành tiền", field: "wifiAmount", formatter: "html"},
            ]
        },
    ],
});


document.getElementById("export-excel").addEventListener("click", function(){
    table.download("csv", "dich_vu_khach_thue.csv");
});

document.getElementById("openFormBtn").onclick = function() {
    console.log(12)
    document.getElementById("addRoomForm").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

// Đóng form
function closeForm() {
    document.getElementById("addRoomForm").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

// Hàm thêm phòng (tùy chỉnh theo yêu cầu)
function addRoom() {
    alert("Phòng đã được thêm!");
    closeForm();
}

// form xóa dịch vụ

document.getElementById("deleteBtn").onclick = function (){
    document.getElementById("deleteConfirmForm").style.display = "flex";
}

