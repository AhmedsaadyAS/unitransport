
document.forms[0].onsubmit = function (event) {
    event.preventDefault();
    loading();
};

function loading() {
    setTimeout(function () {
        window.location.href = "h.html";
    });
}


document.getElementById('Form').onsubmit = function (ev) {
    let mainpass = document.getElementById('pass0').value;
    let password = document.getElementById('pass1').value;
    if (password != mainpass) {
        document.getElementById('message').style.display = "block";
        ev.preventDefault();
        return false;
    }

    loading();
}


