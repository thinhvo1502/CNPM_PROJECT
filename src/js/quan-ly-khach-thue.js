var tableData = [];

var table = new Tabulator("#tenant-table",{
    data: tableData,
    layout: "fitColumns",
    placeholder:"No data available",
    columns: [
        {title: "Tên khách hàng", field: "name", hozAlign: "center"},
        {title: "Số điện thoại", field: "phoneNumber", hozAlign: "right"},
        {title: "Ngày Sinh", field: "birthday", hozAlign: "right"},
        {title: "Giới Tính", field: "gender", hozAlign: "center"},
        {title: "Địa Chỉ", field: "address", hozAlign: "center"},
        {title: "Số CNMD/CCCD", field: "identifier", hozAlign: "center"},
        {title: "Tên phòng thuê", field: "room", hozAlign: "center"}
    ]
    
})
document.getElementById("openFormBtn").onclick = function() {
    console.log(12)
    document.getElementById("addTenantForm").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

// Đóng form
function closeForm() {
    document.getElementById("addTenantForm").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

// Hàm thêm phòng (tùy chỉnh theo yêu cầu)
function addRoom() {
    alert("Phòng đã được thêm!");
    closeForm();
}

