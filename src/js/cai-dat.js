function deleteGroup(button) {
    // Xóa hàng chứa nút đã nhấn
    let row = button.closest("tr");
    row.remove();
    // Bạn có thể thêm logic để xóa nhóm từ cơ sở dữ liệu nếu cần
}