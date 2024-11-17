document.querySelectorAll('.formattedNumberInput').forEach(function(input) {
    input.addEventListener('input', function (e) {
        // Loại bỏ dấu chấm hoặc ký tự không phải số khi người dùng nhập
        let value = this.value.replace(/\./g, '').replace(/\D/g, '');
        
        // Chuyển số thành chuỗi với dấu chấm phân cách hàng nghìn
        this.value = new Intl.NumberFormat('de-DE').format(value);
    });
});

// đóng form 
