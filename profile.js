// فنكشن اللي بتظهر نموزج التعديل
function toggleEditMode() {
    const editModal = document.getElementById('edit-modal');
    editModal.style.display = editModal.style.display === 'none' || !editModal.style.display ? 'block' : 'none';
    if (editModal.style.display === 'block') {
        document.getElementById('edit-name').value = document.getElementById('user-name').textContent;
        document.getElementById('edit-email').value = document.getElementById('user-email').textContent;
        document.getElementById('edit-id').value = document.getElementById('user-id').textContent;
    }
}

// فنكشن تعديلل وحفظ البيانات
function saveData() {
    const name = document.getElementById('edit-name').value;
    const email = document.getElementById('edit-email').value;
    const id = document.getElementById('edit-id').value;

    // ده اللي هيظهر التعديلات علي الصفحه
    document.getElementById('user-name').textContent = name || 'Name';
    document.getElementById('user-email').textContent = email || 'Email';
    document.getElementById('user-id').textContent = id || 'ID';

    toggleEditMode();
}
//فنكشن تحميل الصوره من الجهاز
function loadImage(event) {
    const image = document.getElementById('profile-image');
    image.src = URL.createObjectURL(event.target.files[0]);
    image.onload = () => {
        URL.revokeObjectURL(image.src);
    };
}

