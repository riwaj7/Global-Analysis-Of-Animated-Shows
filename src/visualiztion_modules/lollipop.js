var all_channels = [];
var unique_channels = [];
var channel_count = {};
var temp = [];

export const lollipop = () => {
    d3.csv('../../data/cleanup-channels - 1987 - 2022.csv').then(data =>
    {
        data.forEach(d =>
        {
            d.channel = d["Original Channel"];
            d.channel2 = d["Channel2"];
            d.channel3 = d["Channel3"];
            d.channel4 = d["Channel4"];
            d.channel5 = d["Channel5"];
            all_channels.push(d["Original Channel"]);
            all_channels.push(d["Channel2"]);
            all_channels.push(d["Channel3"]);
            all_channels.push(d["Channel4"]);
            all_channels.push(d["Channel5"]);
        })

        //remove "" values
        all_channels = all_channels.filter(item => item);

        //filter duplicates, each channel name appears once
        unique_channels = [...new Set(data.map(d => d.channel))];
        unique_channels.push(...new Set(data.map(d => d.channel2)));
        unique_channels.push(...new Set(data.map(d => d.channel3)));
        unique_channels.push(...new Set(data.map(d => d.channel4)));
        unique_channels.push(...new Set(data.map(d => d.channel5)));

        //remove "" values
        unique_channels = unique_channels.filter(item => item);

        //go through all unique channels and create a value for it in channel_count
        for(var i = 0; i < unique_channels.length; i++)
        {
            //console.log(unique_channels[i]);
            channel_count[unique_channels[i]] = 0;
        }

        //go through all channels and count how many times they appear in channel_count
        for(var i = 0; i < all_channels.length; i++)
        {
            channel_count[all_channels[i]] ++;
        }

        //draw chart
        drawLolliPopChart();
        drawLolliPopChartTop();
    })
}

function drawLolliPopChart()
{
    //margins
    var margin = { top: 50, bottom: 100, left: 50, right: 50};
    var width = 8100 - margin.left - margin.right;
    var height = 350 - margin.top - margin.bottom;

    //x-axis
    const xScale = d3.scaleBand()
        .domain(Object.keys(channel_count))
        .range([0, width]);

    //y-axis
    const yScale = d3.scaleLinear()
        .domain([0, 180])
        .range([height, 0]);

    //svg for chart
    var svg = d3.select("#chart1")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //add x-axis
    var x_axis = d3.axisBottom().scale(xScale);
    svg.append("g")
        .attr("transform", "translate(0, " + height + ")")
        .call(x_axis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("transform", "rotate(-65)");

    //make x-axis label
    svg.append("text")
        .attr("x", width/2)
        .attr("y", height + 120)
        .attr("font-weight", 500)
        .text("Channel")

    //add y-axis
    var y_axis = d3.axisLeft().scale(yScale);
    svg.append("g")
        .call(y_axis);

    //make y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height/2 - 50)
        .attr("y", -35)
        .attr("font-weight", 500)
        .text("Number of Shows");

    //draw lines
    svg.selectAll("#chart1")
        .data(unique_channels)
        .enter()
        .append("line")
        .attr("x1", function (d) {return xScale(d);})
        .attr("x2", function (d) {return xScale(d);})
        .attr("y1", function (d) {return yScale(channel_count[d]);})
        .attr("y2", yScale(0))
        .attr("transform", "translate(21, " + 0 + ")")
        .attr("stroke-width", 1)
        .attr("stroke", "green");

    //draw circles
    svg.selectAll("body")
        .data(unique_channels)
        .enter()
        .append("circle")
        .attr("cx", function (d) {return xScale(d);})
        .attr("cy", function (d) {return yScale(channel_count[d]);})
        .attr("transform", "translate(21, " + 0 + ")")
        .attr("r", "2")
        .attr("fill", "green")
        .attr("stroke", "green");
}

function drawLolliPopChartTop()
{
    var topChannels = ['Cartoon Network', 'Netflix', 'Teletoon', 'Syndication', 'Nickelodeon',
                       'YTV', 'YouTube', 'Adult Swim', 'CBeebies', 'Disney Channel'];

    //margins
    var margin = { top: 50, bottom: 100, left: 50, right: 50};
    var width = 1200 - margin.left - margin.right;
    var width = 1000 - margin.left - margin.right;
    var height = 350 - margin.top - margin.bottom;

    //x-axis
    const xScale = d3.scaleBand()
    .domain(topChannels)
    .range([0, width]);

    //y-axis
    const yScale = d3.scaleLinear()
    .domain([0, 150])
    .domain([0, 180])
    .range([height, 0]);

    //svg for chart
    var svg = d3.select("#chart2")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    //add x-axis
    var x_axis = d3.axisBottom().scale(xScale);
    svg.append("g")
    .attr("transform", "translate(0, " + height + ")")
    .call(x_axis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("transform", "rotate(-65)");
    //make x-axis label
    svg.append("text")
    .attr("x", width/2 - 30)
    .attr("y", height + 190)
    .attr("y", height + 60)
    .attr("font-weight", 500)
    .text("Channel")

    //add y-axis
    var y_axis = d3.axisLeft().scale(yScale);
    svg.append("g")
    .call(y_axis);
    //make y-axis label
    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height/2 - 50)
    .attr("y", -35)
    .attr("font-weight", 500)
    .text("Number of Shows");

    //draw lines
    svg.selectAll("#chart1")
    .data(topChannels)
    .enter()
    .append("line")
    .attr("x1", function (d) {return xScale(d);})
    .attr("x2", function (d) {return xScale(d);})
    .attr("y1", function (d) {return yScale(channel_count[d]);})
    .attr("y2", yScale(0))
    .attr("transform", "translate(15, " + 0 + ")")
    .attr("transform", "translate(45, " + 0 + ")")
    .attr("stroke-width", 1)
    .attr("stroke", "green");

    //draw circles
    svg.selectAll("body")
    .data(topChannels)
    .enter()
    .append("circle")
    .attr("cx", function (d) {return xScale(d);})
    .attr("cy", function (d) {return yScale(channel_count[d]);})
    .attr("transform", "translate(15, " + 0 + ")")
    .attr("transform", "translate(45, " + 0 + ")")
    .attr("r", "2")
    .attr("fill", "green")
    .attr("stroke", "green");

    //add values
    svg.selectAll("body")
    .data(topChannels)
    .enter()
    .append("text")
    .text(function(d) { return channel_count[d]; })
    .attr("x", function(d) { return xScale(d) + 35; })
    .attr("y", function(d) { return yScale(channel_count[d] + 10); })
    .attr("font-weight", 450)
    .attr("font-size", 15)
    .style("fill", 'green')
    ;

}
