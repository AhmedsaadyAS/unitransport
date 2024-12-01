function change(button) {
    if (button.classList.contains('add')) {
        button.classList.remove('add');
        button.classList.add('cencel');
        button.textContent = "cencel";
    } else {
        button.classList.remove('cencel');
        button.classList.add('add');
        button.textContent = "add";
    }
}
