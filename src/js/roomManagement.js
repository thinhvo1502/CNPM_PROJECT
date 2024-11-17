
var tableData = [
    // {room: "Phòng 101", group: "Nhóm A", status: "Đang thuê", price: "3,000,000đ", deposit: "1,000,000đ", debt: "0đ", 
    //  occupants: 2, area: "30m2", startDate: "01/01/2024", endDate: "01/01/2025", roomType: "Thường", 
    //  note: "Không", tenant: "Nguyễn Văn A"},
    // {room: "Phòng 101", group: "Nhóm A", status: "Đang thuê", price: "3,000,000đ", deposit: "1,000,000đ", debt: "0đ", 
    //  occupants: 2, area: "30m2", startDate: "01/01/2024", endDate: "01/01/2025", roomType: "Thường", 
    //  note: "Không", tenant: "Nguyễn Văn A"},
    //  {room: "Phòng 101", group: "Nhóm A", status: "Đang thuê", price: "3,000,000đ", deposit: "1,000,000đ", debt: "0đ", 
    //     occupants: 2, area: "30m2", startDate: "01/01/2024", endDate: "01/01/2025", roomType: "Thường", 
    //     note: "Không", tenant: "Nguyễn Văn A"},
    // {room: "Phòng 101", group: "Nhóm A", status: "Đang thuê", price: "3,000,000đ", deposit: "1,000,000đ", debt: "0đ", 
    //     occupants: 2, area: "30m2", startDate: "01/01/2024", endDate: "01/01/2025", roomType: "Thường", 
    //     note: "Không", tenant: "Nguyễn Văn A"},
    //     {room: "Phòng 101", group: "Nhóm A", status: "Đang thuê", price: "3,000,000đ", deposit: "1,000,000đ", debt: "0đ", 
    //         occupants: 2, area: "30m2", startDate: "01/01/2024", endDate: "01/01/2025", roomType: "Thường", 
    //         note: "Không", tenant: "Nguyễn Văn A"},
    //         {room: "Phòng 101", group: "Nhóm A", status: "Đang thuê", price: "3,000,000đ", deposit: "1,000,000đ", debt: "0đ", 
    //             occupants: 2, area: "30m2", startDate: "01/01/2024", endDate: "01/01/2025", roomType: "Thường", 
    //             note: "Không", tenant: "Nguyễn Văn A"},
    //             {room: "Phòng 101", group: "Nhóm A", status: "Đang thuê", price: "3,000,000đ", deposit: "1,000,000đ", debt: "0đ", 
    //                 occupants: 2, area: "30m2", startDate: "01/01/2024", endDate: "01/01/2025", roomType: "Thường", 
    //                 note: "Không", tenant: "Nguyễn Văn A"},
    //                 {room: "Phòng 101", group: "Nhóm A", status: "Đang thuê", price: "3,000,000đ", deposit: "1,000,000đ", debt: "0đ", 
    //     occupants: 2, area: "30m2", startDate: "01/01/2024", endDate: "01/01/2025", roomType: "Thường", 
    //     note: "Không", tenant: "Nguyễn Văn A"},
];
// Định nghĩa định dạng tùy chỉnh
var printIcon = function(cell, formatterParams, onRendered) {
    return "<i class='fa fa-print'></i>"; // Trả về mã HTML cho biểu tượng in
};

// Khởi tạo bảng Tabulator
var table = new Tabulator("#room-table", {
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
        {title: "Tên Phòng", field: "room", hozAlign: "center", width: 150,editor: "input"}, 
        {title: "Tầng/dãy", field: "group", hozAlign: "center", editor: "input"},
        {title: "Trạng Thái", field: "status", hozAlign: "center", editor: "select", editorParams: {values: ["Đang thuê", "Trống"]}},
        {title: "Giá Phòng", field: "price", hozAlign: "right", editor: "number"},
        {title: "Tiền Cọc", field: "deposit", hozAlign: "right", editor: "number"},
        {title: "Tiền Nợ", field: "debt", hozAlign: "right", editor: "number"},
        {title: "Số Người Ở", field: "occupants", hozAlign: "center", editor: "number"},
        {title: "Diện Tích", field: "area", hozAlign: "center", editor: "input"},
        {title: "Ngày Thuê", field: "startDate", hozAlign: "center", editor: "input"},
        {title: "Ngày Hết Hạn", field: "endDate", hozAlign: "center", editor: "input"},
        {title: "Loại Phòng", field: "roomType", hozAlign: "center", editor: "input"},
        {title: "Ghi Chú", field: "note", hozAlign: "center", editor: "textarea"},
        {title: "Khách Thuê", field: "tenant", hozAlign: "center", editor: "input"},
    ],
    rowHeader:{formatter: printIcon, width: 40, hozAlign: "center"},
    rowContextMenu: [
        {
            label:"Xóa",
            action:function(e, row){
                document.getElementById("deleteConfirmationForm").style.display = "flex";
                document.getElementById("overlay").style.display = "block";

                // xử lý xóa
            document.getElementById("confirm-delete").onclick = function(){
                row.delete();
                document.getElementById("deleteConfirmationForm").style.display = "none";
                document.getElementById("overlay").style.display = "none";
            }
            // xử lý hủy trong modal
            document.getElementById("cancel-delete").onclick = function(){
                document.getElementById("deleteConfirmationForm").style.display = "none";
                document.getElementById("overlay").style.display = "none";
            }
            }

            
        }
    ]
});
// Mở form
document.getElementById("openFormBtn").onclick = function() {
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


