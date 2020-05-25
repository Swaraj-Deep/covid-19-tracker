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
        send_data = {
            'Data': `${localStorage.getItem("state_name")}`
        }
        get_data('__get_state_data_for_report__', send_data).then(function (response) {
            if (response.status !== 200) {
                show_alert(`alert-wrapper`, `Some error occured. Please reload the page.`, `alert-danger`);
                return false;
            } else if (response.status === 200) {
                response.json().then(function (data) {
                    // state_report = data['data_state']
                    // delta_data = state_report[0]['delta_data']
                    // state_data = state_report[0]['state_data']
                    // console.log(state_data);
                    // for (i in delta_data['delta']) {
                    //     console.log(delta_data['delta'][i]);
                    // }
                    resource_report = data['data_resource']
                    for (i in resource_report) {
                        console.log (resource_report[i]);
                    }
                });
            } else {
                show_alert(`alert-wrapper`, `Opps! It's our fault.`, `alert-danger`);
                return false;
            }
        });
        // localStorage.removeItem("state_name");
    } else {
        alert("Hello");
    }
});