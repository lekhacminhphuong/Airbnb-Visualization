const measurements = {
    width: 1200,
    height: 850
}

// apend svg to the body
const svg = d3.select("body").append('svg')
    .attr('width', measurements.width)
    .attr('height', measurements.height)

// append g to the svg
var neighborhoods = svg.append('g')

d3.json('nygeo.json').then(function (data) {

    d3.csv('data.csv').then(function (locationData) {

        // create NY map
        const albersProj = d3.geoAlbers()
            .scale(110000)
            .rotate([74.0060, 0])
            .center([0, 40.7128])
            .translate([measurements.width / 2, measurements.height / 2]);

        // albersProj does:
        let locationPoint = locationData[0]
        albersProj([locationPoint['long'], locationPoint['lat']])

        // create path
        const geoPath = d3.geoPath()
            .projection(albersProj)

        neighborhoods.selectAll('path')
            .data(data.features)
            .enter()
            .append('path')
            .attr('fill', '#ccc')
            .attr('d', geoPath)
            .on("mouseenter", function (d) {
                d3.select(this)
                    .style("stroke-width", 1.5)
                    .style("stroke-dasharray", 0)

                d3.select("#popup")
                    .transition()
                    .style("opacity", 1)
                    .style("left", (d3.event.pageX + 10) + "px")
                    .style("top", (d3.event.pageY) + "px")
                    .text(d.properties.name)

            })
            .on("mouseleave", function (d) {
                d3.select(this)
                    .style("stroke-width", .25)
                    .style("stroke-dasharray", 1)

                d3.select("#cpopupountyText")
                    .transition()
                    .style("opacity", 0);
            });

        // plots locations' circles on the NY map
        neighborhoods.selectAll('.circle')
            .data(locationData)
            .enter()
            .append('circle')
            .attr('cx', function (d) {
                let points = albersProj([d['longitude'], d['latitude']])
                return points[0]
            })
            .attr('cy', function (d) {
                let points = albersProj([d['longitude'], d['latitude']])
                return points[1]
            })
            .attr('r', 8)
            .attr("opacity", 0.45)
            .attr('fill', '#FF5A5F')

            // User Interaction: clicking on the location circles -> circles are disappeared
            .on("click", function () {
                d3.select(this)
                    .attr("opacity", 0.5)
                    .transition()
                    .duration(50)
                    .attr("opacity", 0)
            })
    })
})
