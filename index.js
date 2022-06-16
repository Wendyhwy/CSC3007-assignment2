var data = {
    resource_id: '83c21090-bd19-4b54-ab6b-d999c251edcf', // the resource id
};
$.ajax({
url: 'https://data.gov.sg/api/action/datastore_search',
data: data,

success: function(data) {
    var data = data;
    var ref_div_id = "#my_dataviz";
    records = data.result.records.filter(record => record.year == "2020")
    console.log(records);
    plot(data, ref_div_id);

}
});

    // create tooltip
    var tooltip = d3.select("#my_dataviz")
        .append("div")
        .attr("class", "tooltip");

    var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

function update_graph (svg,year,i,x,y,height) {
// variable u: map data to existing bars
    var u = svg.selectAll("rect")
    .data(year.get(i))

    // update bars
    u
    .enter()
    .append("rect")
    .on("mouseover", onMouseOver) //Add listener for the mouseover event
    .on("mouseout", onMouseOut)   //Add listener for the mouseout event
    .merge(u)
    .transition()
    .duration(1000)
        .attr("x", function(d) { 
            return x(d.level_2);
        })
        .attr("y", function(d) { 
            return y(d.value);
        })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { 
            return height - y(d.value);
        })
        .attr("fill", "steelblue")
        
}

function plot (data, ref_div_id){
    var data_obj = data.result.records

    // set dimensions and margins of graph
    var margin = { top: 60, right: 20, bottom: 20, left: 60 }, 
        width = 1200 - margin.left - margin.right,
        height = 650 - margin.top - margin.bottom;
        
    // append svg object to the body of page
    var svg = d3.select(ref_div_id)
        .append('svg')
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append('g')
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); 
    
    // y label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x",  0 - margin.top)
        .attr("y", -50)
        .attr("dy", ".35em")
        .attr("font-size", "18px")
        .style("text-anchor", "middle")
        .text("Number of Cases")

    let nestedData = d3.group(data_obj, d => d.level_2)

    // scale and draw X,Y axis
    var x = d3.scaleBand()
            .range([0, width])
            .domain(Array.from(nestedData.keys()))
            .padding(0.3),
        y = d3.scaleLinear()
            .range([height, 0])
            .domain([0, 2500]);

    var x_axis = svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x)), 
        y_axis = svg.append("g")
            .attr("class", "Y_axis")
            .call(d3.axisLeft(y));

    // // Set the button texts
    let year = d3.group(data_obj, d => d.year)

    update_graph(svg,year,"2019",x,y,height)

}

    //mouseover event handler function
    function onMouseOver(d, i) {
        d3.select(this).attr('class', 'highlight');
        d3.select(this)
          .transition()     // adds animation
          .duration(400)
          .attr('width', x.bandwidth() + 5)
          .attr("y", function(d) { return y(d.value) - 10; })
          .attr("height", function(d) { return height - y(d.value) + 10; });

        g.append("text")
         .attr('class', 'val') 
         .attr('x', function() {
             return x(d.level_2);
         })
         .attr('y', function() {
             return y(d.value) - 15;
         })
         .text(function() {
             return [ 'Total:' +d.value];  // Value of the text
         });
    }

    //mouseout event handler function
    function onMouseOut(d, i) {
        // use the text label class to remove label on mouseout
        d3.select(this).attr('class', 'bar');
        d3.select(this)
          .transition()     // adds animation
          .duration(400)
          .attr('width', x.bandwidth())
          .attr("y", function(d) { return y(d.value); })
          .attr("height", function(d) { return height - y(d.value); });

        d3.selectAll('.val')
          .remove()
    }

