$(document).ready(function () {

    var width = 900;
    var height = 550;

    // Div for tool tip hover effect
    var tooltip_div = d3.select("#tooltip")
        .attr("class", "tooltip-data")
        .style("opacity", 0);

    var svg = d3.select("#India_map")
        .attr("width", width)
        .attr("height", height);

    var projection = d3.geoMercator()
        .scale(70)
        .center([0, 0])
        .translate([width / 2, height / 2]);

    var path = d3.geoPath().projection(projection);

    function show_alert(id, message, alert_type) {
        console.log("HI");
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

    let data = {
        'data': 'Send Map Data'
    };
    var state_data = []
    get_data('__get_map_data__', data).then(function (response) {
        if (response.status !== 200) {
            show_alert(`alert-wrapper`, `Some error occured. Please reload the page.`, `alert-danger`);
            return false;
        } else if (response.status === 200) {
            response.json().then(function (data) {
                state_data = data["data"];
                d3.json("/static/js/india_map.json", function (err, geojson) {
                    if (err) { console.log("Some Error Occured"); }
                    projection.fitSize([width, height], geojson);
                    var country = geojson["features"];
                    for (states of country.values()) {
                        var state_name = states["properties"]["name"];
                        var active = get_active_status(state_name);
                        var deceased = get_deceased_status(state_name);
                        var recovered = get_recovered_status(state_name);
                        var confirmed = get_confirmed_status(state_name);
                        svg.append("path")
                            .attr("d", path(states))
                            .attr("statename", state_name)
                            .attr("active", active)
                            .attr("deceased", deceased)
                            .attr("recovered", recovered)
                            .attr("confirmed", confirmed)
                            .on("mouseover", function () {
                                d3.selectAll(".states")
                                    .transition()
                                    .duration(200)
                                    .style("opacity", .5)
                                d3.select(this)
                                    .transition()
                                    .duration(200)
                                    .style("opacity", .65)
                                    .style("stroke", "black");
                                div_tooltip = d3.select(".tooltip-data");
                                var message_div = d3.select(this);
                                var message = "<p>" + message_div.attr("statename") + "<br> Active Cases: " + message_div.attr("active") + "<br>Recovered: " + message_div.attr("recovered") + "<br>Deaths: " + message_div.attr("deceased") + "<br>" + "</p>";
                                div_tooltip.transition()
                                    .duration(50)
                                    .style("opacity", 1);
                                div_tooltip.html(message);
                                    // .style("left", (min (d3.event.pageX, 0) + 5) + "px")
                                    // .style("top", (d3.event.pageY - 28) + "px");
                            })
                            .on("mouseleave", function () {
                                d3.selectAll(".states")
                                    .style("opacity", .95)
                                    .transition()
                                    .duration(200)
                                d3.select(this)
                                    .transition()
                                    .duration(200)
                                    .style("stroke", "#fff")
                                    .style("opacity", .95);
                                div_tooltip = d3.select(".tooltip-data");
                                div_tooltip.transition()
                                    .duration('50')
                                    .style("opacity", 0);
                            })
                            .style("opacity", .95)
                            .style("fill", get_color(active))
                            .style("stroke-width", "2");
                    }
                });
            });
        } else {
            show_alert(`alert-wrapper`, `Opps! It's our fault.`, `alert-danger`);
            return false;
        }
    });

    // Code for responsiveness
    var aspect = width / height,
        chart = d3.select('#India_map');
    d3.select(window)
        .on("resize", function () {
            var targetWidth = chart.node().getBoundingClientRect().width;
            chart.attr("width", targetWidth);
            chart.attr("height", targetWidth / aspect);
        });

    // Function for filling the data
    function get_active_status(state_name) {
        for (i in state_data) {
            if (state_data[i]["state"] == state_name) {
                return state_data[i]["active"];
            }
        }
    };
    function get_deceased_status(state_name) {
        for (i in state_data) {
            if (state_data[i]["state"] == state_name) {
                return state_data[i]["deceased"];
            }
        }
    };
    function get_recovered_status(state_name) {
        for (i in state_data) {
            if (state_data[i]["state"] == state_name) {
                return state_data[i]["recovered"];
            }
        }
    };
    function get_confirmed_status(state_name) {
        for (i in state_data) {
            if (state_data[i]["state"] == state_name) {
                return state_data[i]["confirmed"];
            }
        }
    };
    function get_color(active_cases) {
        var cases = parseInt(active_cases, 10);
        if (cases >= 0 && cases <= 30) {
            return "#F19CBB"
        } else if (cases >= 31 && cases <= 1000) {
            return "#CD5C5C";
        } else if (cases >= 1001 && cases <= 3000) {
            return "#DC143C";
        } else if (cases >= 3001 && cases <= 8000) {
            return "#FF4500";
        } else if (cases >= 8001 && cases <= 15000) {
            return "#B22222";
        } else {
            return "#800000";
        }
    }
});
