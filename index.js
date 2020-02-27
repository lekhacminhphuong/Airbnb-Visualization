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

// neighborhoods.json taken from rat map example
d3.json('nygeo.json').then(function (data) {

    d3.csv('data.csv').then(function (pointData) {

        // create NY map
        const albersProj = d3.geoAlbers()
            .scale(110000)
            .rotate([74.0060, 0])
            .center([0, 40.7128])
            .translate([measurements.width / 2, measurements.height / 2]);

        // this code shows what albersProj really does
        let point = pointData[0]
        let arr = [point['long'], point['lat']]
        albersProj(arr)

        // create path
        const geoPath = d3.geoPath()
            .projection(albersProj)

        neighborhoods.selectAll('path')
            .data(data.features)
            .enter()
            .append('path')
            .attr('fill', '#ccc')
            .attr('d', geoPath)

        // plots circles on the boston map
        neighborhoods.selectAll('.circle')
            .data(pointData)
            .enter()
            .append('circle')
            .attr('cx', function (d) {
                let scaledPoints = albersProj([d['longitude'], d['latitude']])
                return scaledPoints[0]
            })
            .attr('cy', function (d) {
                let scaledPoints = albersProj([d['longitude'], d['latitude']])
                return scaledPoints[1]
            })
            .attr('r', 7)
            .attr("opacity", 0.5)
            .attr('fill', '#FF5A5F')

            // user interaction: clicking on the location points -> points are disappeared
            .on("click", function () {
                d3.select(this)
                    .attr("opacity", 0.5)
                    .transition()
                    .duration(50)
                    .attr("opacity", 0)
            })
    })
})
