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
    // {type: "Tiền cọc",roomName: "Chung Cư Đảo Kim Cương", tenantName: "Nguyễn Thiên Khiêm", roomBill: "300,000,000", electronicBill: "300,000,000đ", waterBill: "500,000,000đ", total: "800,000,000đ",status: "Đã thu 10 năm"},
    // {type: "Tiền phòng", roomName: "Chung Cư Đảo Kim Cương", tenantName: "Nguyễn Thiên Khiêm", roomBill: "300,000,000", electronicBill: "300,000,000đ", waterBill: "500,000,000đ", total: "800,000,000đ",status: "Đã thu 10 năm"}

];

// Định nghĩa định dạng tùy chỉnh
var printIcon = function(cell, formatterParams, onRendered) {
    // return "<i class='fa-solid fa-wallet'></i>"; // Trả về mã HTML cho biểu tượng in
    return "<i class='fa-solid fa-file-invoice'></i>"
};

function showContextMenu(event, button, rowData) {
    // Tạo hoặc lấy menu popup
    let popupMenu = document.getElementById("popupMenu");
    // if (!popupMenu) {
    //     popupMenu = document.createElement("div");
    //     popupMenu.id = "popupMenu";
    //     popupMenu.className = "popup-menu";
    //     popupMenu.innerHTML = `
    //         <div class="bill-menu-item">Xem chi tiết hóa đơn</div>
    //         <div class="bill-menu-item">Thu tiền</div>
    //         <div class="bill-menu-item">Chỉnh sửa</div>
    //         <div class="bill-menu-item">In hóa đơn</div>
    //         <div class="bill-menu-item">Gửi hóa đơn</div>
    //         <div class="bill-menu-item cancel">Hủy hóa đơn</div>
    //     `;
    //     document.body.appendChild(popupMenu);
    // }

    // Hiển thị menu bên cạnh nút
    popupMenu.style.display = "block";
    popupMenu.style.top = `${event.clientY}px`;
    popupMenu.style.left = `${event.clientX}px`;

    // Xử lý sự kiện click cho từng mục
    popupMenu.querySelectorAll(".bill-menu-item").forEach(item => {
        item.addEventListener("click", () => {
            console.log("Mục được chọn:", item.textContent, rowData);
            popupMenu.style.display = "none"; // Ẩn menu sau khi chọn
        });
    });

    // Đóng menu khi click ra ngoài
    document.addEventListener("click", function hideMenu(e) {
        if (!popupMenu.contains(e.target) && e.target !== button) {
            popupMenu.style.display = "none";
            document.removeEventListener("click", hideMenu);
        }
    });
}


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
        {title: "Loại hóa đơn",field: "type"},
        {title: "Tên Phòng", field: "roomName", width: 200}, 
        {title: "Tên Khách Thuê", field: "tenantName"},
        {title: "Tiền phòng", field: "roomBill"},
        {title: "Tiền điện", field: "electronicBill", editor: "select", editorParams: {values: ["Đang thuê", "Trống"]}},
        {title: "Tiền nước", field: "waterBill"},
        {title: "Tổng cộng", field: "total"},
        {title: "Trạng thái", field: "status"},
         {
            title: "",
            field: "actions",
            width: 45,
            formatter: function() {
                return '<button id = "actionBtn"class="action-btn">⋮</button>';
            },
            hozAlign: "center",
            cellClick: function(e, cell) {
                const button = e.target; // Nút được click
            const row = cell.getRow(); // Dòng hiện tại
            const rowData = row.getData(); // Dữ liệu dòng hiện tại

            // Hiển thị context menu hoặc xử lý logic khác
            console.log("Nút đã được click trong dòng:", rowData);

            // Ví dụ: Hiển thị context menu bên cạnh button
            showContextMenu(e, button, rowData);
            }
        }
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


document.getElementById("openFormBtn").onclick = function(){
    document.getElementById("invoiceForm").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}
document.getElementById("extButton").onclick = function(){
    document.getElementById("invoiceForm").style.display = "none";
    document.getElementById("overlay").style.display = "none"
}


// Các hàm xử lý context menu
function editBill(type) {
    alert(`Chỉnh sửa hóa đơn loại: ${type}`);
}

function deleteRow(type) {
    alert(`Xóa dòng với loại: ${type}`);
}

// xoá dịch vụ
