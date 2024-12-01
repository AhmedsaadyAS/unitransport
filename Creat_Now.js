document.getElementById('submit-btn').addEventListener('click', function () {
    // جلب القيم من الحقول
    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;

    // عرض رسالة تأكيد
    if (from && to && date && time) {
        const confirmationMessage = `هل انت متاكد من البيانات التالية \n\nfrom: ${from}\nto: ${to}\ndate: ${date}\ntime: ${time}`;
        if (confirm(confirmationMessage)) {
            alert("تم تاكيد الحجز");
            // هنا يمكن إضافة كود لمعالجة البيانات أو إرسالها للسيرفر
        } else {
            alert("تم الغاء الحجز");
        }
    } else {
        alert("يرجي ملء جميع البيانات قبل الحجز");
    }
});