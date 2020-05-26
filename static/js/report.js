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
        var accordion = document.getElementById('redirect');
        accordion.hidden = false;
        send_data = {
            'Data': `${localStorage.getItem("state_name")}`
        }
        get_data('__get_state_data_for_report__', send_data).then(function (response) {
            if (response.status !== 200) {
                show_alert(`alert-wrapper`, `Some error occured. Please reload the page.`, `alert-danger`);
                return false;
            } else if (response.status === 200) {
                response.json().then(function (data) {
                    state_report = data['data_state']
                    delta_data = state_report[0]['delta_data']
                    state_data = state_report[0]['state_data']
                    var state = document.getElementById('state');
                    var confirmed = document.getElementById('confirmed');
                    var active = document.getElementById('active');
                    var recovered = document.getElementById('recovered');
                    var deaths = document.getElementById('deaths');
                    var text = document.createTextNode(`State: ${state_data['state']}`);
                    state.appendChild(text);
                    text = document.createTextNode(`Confirmed: ${state_data['confirmed']}`);
                    confirmed.appendChild(text);
                    text = document.createTextNode(`Active: ${state_data['active']}`);
                    active.appendChild(text);
                    text = document.createTextNode(`Recovered: ${state_data['recovered']}`);
                    recovered.appendChild(text);
                    text = document.createTextNode(`Deaths: ${state_data['deceased']}`);
                    deaths.appendChild(text);
                    var tableRef = document.getElementById('today_update').getElementsByTagName('tbody')[0];
                    for (i in delta_data['delta']) {
                        var newRow = tableRef.insertRow();
                        var number = newRow.insertCell(0);
                        var district = newRow.insertCell(1);
                        confirmed = newRow.insertCell(2);
                        recovered = newRow.insertCell(3);
                        deaths = newRow.insertCell(4);
                        text = document.createTextNode(`${parseInt(i) + 1}`);
                        number.appendChild(text);
                        text = document.createTextNode(`${delta_data['delta'][i]['district']}`);
                        district.append(text);
                        text = document.createTextNode(`${delta_data['delta'][i]['delta']['confirmed']}`);
                        confirmed.append(text);
                        text = document.createTextNode(`${delta_data['delta'][i]['delta']['recovered']}`);
                        recovered.append(text);
                        text = document.createTextNode(`${delta_data['delta'][i]['delta']['deceased']}`);
                        deaths.append(text);
                    }
                    resource_report = data['data_resource'];
                    var tableRef = document.getElementById('resources').getElementsByTagName('tbody')[0];
                    for (i in resource_report) {
                        var newRow = tableRef.insertRow();
                        number = newRow.insertCell(0);
                        var category = newRow.insertCell(1);
                        var city = newRow.insertCell(2);
                        var name_of_organization = newRow.insertCell(3);
                        var phone_number = newRow.insertCell(4);
                        var contact = newRow.insertCell(5);
                        text = document.createTextNode(`${parseInt(i) + 1}`);
                        number.appendChild(text);
                        text = document.createTextNode(`${resource_report[i]['category']}`);
                        category.appendChild(text);
                        text = document.createTextNode(`${resource_report[i]['city']}`);
                        city.appendChild(text);
                        text = document.createTextNode(`${resource_report[i]['nameoftheorganisation']}`);
                        name_of_organization.appendChild(text);
                        text = document.createTextNode(`${resource_report[i]['phonenumber']}`);
                        phone_number.appendChild(text);
                        var contact_link = document.createElement("a");
                        contact_link.setAttribute("href", `${resource_report[i]['contact']}`);
                        contact_link.setAttribute("target", "_blank");
                        contact_link.className = "text-center text-success";
                        var linkText = document.createTextNode(`${resource_report[i]['contact']}`);
                        contact_link.appendChild(linkText);
                        contact.appendChild(contact_link);
                    }
                });
            } else {
                show_alert(`alert-wrapper`, `Opps! It's our fault.`, `alert-danger`);
                return false;
            }
        });
        localStorage.removeItem("state_name");
    } else {
        // alert("Hello");
    }
});