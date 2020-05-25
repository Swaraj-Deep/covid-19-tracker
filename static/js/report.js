$(document).ready(function () {
    function show_alert(id, message, alert_type) {
        $(`#${id}`).html(`<div class="alert ${alert_type} alert-dismissable">${message}<button class="close" type="button" aria-hidden="true" data-dismiss="alert">&times;</button></div>`);
        $(".alert").fadeTo(5000, 500).slideUp(500, function () {
            $(".alert").remove();
        });
    }

    function get_data(url, data) {
        return fetch(`${window.origin}/${url}`, {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(data),
            cache: "no-cache",
            headers: new Headers({
                "content-type": "application/json"
            })
        });
    }
    if (localStorage.getItem("state_name")) {

        localStorage.removeItem("state_name");
    } else {
        alert("Hello");
    }
});