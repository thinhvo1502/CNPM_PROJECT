var tableData = [];

var table = new Tabulator("#tenant-contract-table",{
    data: tableData,
    layout: "fitColumns",
    placeholder: "<div><img src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAS4AAACnCAMAAACYVkHVAAAAJ1BMVEX09PTa2trc3Nz29vbj4+Pg4ODv7+/Y2Njy8vLt7e3q6urm5ubn5+eHk7pVAAAEMklEQVR4nO2ci46jMAxFSZw3/P/3ru0QFtoppSPtUsn3rDSLmFaCIycxjplpAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPxzSLj7Ir4b8UPdU6lL8MvdF/TtiKjSQnQ5O+cClbsv6OvQEddDKrEo7xTPuAhdeySUivgqqc5xmBq6+MfdF/hVSFxRSYuEVGY93j/ocunuS/wCxujjsTeLKOe3aFJlfMKHJfDJXK2vjUVNldpCl7SLJvXlY2hJBmiSs4vlXGJM596tpvxel+OQSrt0S05Gk7aKGuhjT91sAbUeSUhNx7SUIv8i3nXFt8KiJKTyELVN5jz2ZhY1PSfwNMnk5S0mEhT6JL4be1kjqhZN4Pkj5dELURO5xeBopPnvbJXV1CKz+ekzIesSu8mirjrCSseemprerXmUOCDdbFAXJwWsK3ZR178VOXXdL4125jGJrjBUlbKWHd4QZSXYn7j3Hv4fPSn48HYpcHTtl8ZkJbxUlx/B5a+yJWcrVuZ9muXOR1LgfosZXVXutkLXNahwQp9HKfmQ20PXT4igsB6LrvgZIZrSJXO9H7VR0RXW1OBSRkHr5GdHVxBdayIgh+GTO2dhwZSuadHb7cerrpKuMpnTlTLPXm3U/USXrJZZGf+/pE7WdBWpR8xHXb6vkMctjWe8QV381Ohz/FlXCKfpg0ldUl5Yl8ajrkWWvvkkvizq4kyAh1xfGg+65t4XMUPXHi0l57407nR5N61Pkg+Zvl//GdXFSyPfb9PDva5RpiB/mO99f1Cyq0sfrHty+l4X/6ZuFWuTuki2GPu24WEw1j531d1glNJW5QefmvvOtkldum2oh4ep3nddx+abntDyfGdVF1GT7F3n9aMu30ppx4nLz9p2UihY1aVL41ohfEhTnxKHv8/fFMzqKnLDywVduz0Q0iK/RV0TbSbe6OLPbNGl+yA2dUlPiS6Np7rysYuEik1dWrLqj0Gnuh57biiZHIxEC1vSx6DXurzLz92oNVdz5cHRVyIJ1Ul0/dSMSnMzqEtmbacVwidd+cyWtv4a1CUVQu2oOejiTCGUIM3O2buXjc4GdfFTo1QIy0N0xUaFmqajy0sdFnVJhdCnH8qD8irLItu2L1tsLOpqWvKS9F51ScEwbsOP0nzSj2RRl75YMG+6qne7zdly2rRrUBcvjU4rhCO6fDv00Z991aIubbmMI7okni7fvkVda1/J0PXcS3/yVXu6aJr1DdjwcUuJSV3T1NzY3IGuCyS3vbf4WcOSSV2l9N0x+Rnef3yHxUdsJm4t4D58grVmyw6F0Goqr2r0J/QvGNM19TenPnW1YU1Xz7Sg6yL9di+/5PII/kwCeMsv/1JLmSy+aQwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABjiD11yHkXgwpzGAAAAAElFTkSuQmCC' alt = 'No Data Image'><br>Không tìm thấy dữ liệu! </div>",
    columns: [
        {title: "Tên phòng", field: "name", hozAlign: "center"},
        {title: "Tên khách thuê", field: "tenantName", hozAlign: "right"},
        {title: "Số điện thoại khách thuê", field: "tenantName", hozAlign: "center"},
        {title: "Giá thuê", field: "rent", hozAlign: "right"},
        {title: "Tiền cọc", field: "deposit", hozAlign: "center"},
        {title: "Ngày lập", field: "created_at", hozAlign: "center"},
        {title: "Ngày bắt đầu", field: "startDate", hozAlign: "center"},
        {title: "Ngày kết thúc", field: "endDate", hozAlign: "center"}
    ]
    
})

// mở form thêm hợp đồng
document.getElementById("addContract").onclick = function (){
    document.getElementById("contract-form").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}
// đóng form thêm
function closeForm() {
    document.getElementById("contract-form").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}