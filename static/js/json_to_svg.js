$(document).ready(function () {

    var width = 800;
    var height = 500;

    // Div for tool tip hover effect
    var tooltip_div = d3.select("body").append("div")
        .attr("class", "tooltip-donut")
        .style("opacity", 0);
    // .style("left","30px")
    // .style("top", "35px");

    var svg = d3.select("#India_map")
        .attr("width", width)
        .attr("height", height);

    var projection = d3.geoMercator()
        .scale(70)
        .center([0, 0])
        .translate([width / 2, height / 2]);

    var path = d3.geoPath().projection(projection);

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

    let data = {
        'data': 'Send Titles'
    };
    var state_data = []
    get_data('__get_map_data__', data).then(function (response) {
        if (response.status !== 200) {
            show_alert(`alert-wrapper`, `Some error occured. Please reload the page.`, `alert-danger`);
            return false;
        } else if (response.status === 200) {
            response.json().then(function (data) {
                state_data = data["data"]
                console.log(state_data);
                d3.json("/static/js/india_map.json", function (err, geojson) {
                    if (err) { console.log("Some Error Occured"); }
                    projection.fitSize([width, height], geojson);
                    var country = geojson["features"];
                    for (states of country.values()) {
                        svg.append("path")
                            .attr("d", path(states))
                            .attr("statename", states["properties"]["name"])
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
                                var div_tooltip = d3.select(".tooltip-donut");
                                var message_div = d3.select(this);
                                var message = "<p>" + message_div.attr("statename") + "<br>" + message_div.attr("active") + "<br>" + message_div.attr("recovered") + "</p>";
                                div_tooltip.transition()
                                    .duration(50)
                                    .style("opacity", 1);
                                div_tooltip.html(message)
                                    .style("left", (d3.event.pageX + 10) + "px")
                                    .style("top", (d3.event.pageY - 15) + "px");
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
                                var div_tooltip = d3.select(".tooltip-donut");
                                div_tooltip.transition()
                                    .duration('50')
                                    .style("opacity", 0);
                            })
                            .style("opacity", .95)
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

});
