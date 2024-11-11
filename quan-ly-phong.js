var tableData = [
    {room: "Phòng 101", group: "Nhóm A", status: "Đang thuê", price: "3,000,000đ", deposit: "1,000,000đ", debt: "0đ", 
     occupants: 2, area: "30m2", startDate: "01/01/2024", endDate: "01/01/2025", roomType: "Thường", 
     note: "Không", tenant: "Nguyễn Văn A"},
    {room: "Phòng 101", group: "Nhóm A", status: "Đang thuê", price: "3,000,000đ", deposit: "1,000,000đ", debt: "0đ", 
     occupants: 2, area: "30m2", startDate: "01/01/2024", endDate: "01/01/2025", roomType: "Thường", 
     note: "Không", tenant: "Nguyễn Văn A"},
];
var table = new Tabulator("#room-table", {
    data: tableData,
    layout: "fitColumns",
    columns: [
        {title: "Tên Phòng", field: "room", hozAlign: "center", cellClick:function(e, cell){console.log("cell click")},},
        {title: "Nhóm Phòng", field: "group", hozAlign: "center"},
        {title: "Trạng Thái", field: "status", hozAlign: "center"},
        {title: "Giá Phòng", field: "price", hozAlign: "right"},
        {title: "Tiền Cọc", field: "deposit", hozAlign: "right"},
        {title: "Tiền Nợ", field: "debt", hozAlign: "right"},
        {title: "Số Người Ở", field: "occupants", hozAlign: "center"},
        {title: "Diện Tích", field: "area", hozAlign: "center"},
        {title: "Ngày Thuê", field: "startDate", hozAlign: "center"},
        {title: "Ngày Hết Hạn", field: "endDate", hozAlign: "center"},
        {title: "Loại Phòng", field: "roomType", hozAlign: "center"},
        {title: "Ghi Chú", field: "note", hozAlign: "center"},
        {title: "Khách Thuê", field: "tenant", hozAlign: "center"},
        {
            title: "Hành Động", field: "actions", hozAlign: "center", formatter: function(cell, formatterParams){
                // Trả về HTML chứa hai nút
                return "<button class='edit-btn' style='background-color: green; color: white;'>Chỉnh sửa</button>" + 
                       "<button class='delete-btn' style='background-color: red; color: white;'>Xóa</button>";
            },
            cellClick: function(e, cell) {
                // Xử lý khi nhấn vào các nút
                if(e.target.classList.contains('edit-btn')){
                    // Hành động chỉnh sửa
                    console.log("Chỉnh sửa", cell.getRow().getData());
                } else if(e.target.classList.contains('delete-btn')){
                    // Hành động xóa
                    console.log("Xóa", cell.getRow().getData());
                }
            }
        },
    ]
});



