import {Chart} from "../chart.js";

export const drawAreaChart = (dataset1, dataset2) => {
    var yearTechnique = [];
    for(let i=1987;i<2023;i++){
        yearTechnique.push({year: i, Traditional: 0, Flash: 0, CGI: 0, Other: 0});
    } //build empty array of years to fill later


    for(let i=0;i<dataset2['$data'].length;i++){ //only using second year range because first doesn't include relevant data
        var rowTemp=dataset2['$data'][i];  //process row by row
        if(rowTemp[5]=="Present"||rowTemp[5]=="present"){
            rowTemp[5]=2022; //replace any String 'present' with int of current year 2022
        }
        else{
            rowTemp[5]=+rowTemp[5];
        }

        var index;


        for(let j=rowTemp[4];j<rowTemp[5]+1;j++){ //for each year between start and end of show:
            index=yearTechnique.findIndex(x => x.year==j);

            //use this version of the conditional block to count each show only once, and count shows with multiple animation styles as "Other"
            // if(rowTemp[7]=="Traditional"){
            //     yearTechnique[index].Traditional++;
            // }
            // else if(rowTemp[7]=="Flash"){
            //     yearTechnique[index].Flash++;
            // }
            // else if(rowTemp[7]=="CGI"){
            //     yearTechnique[index].CGI++;
            // }
            // else{ 
            //     yearTechnique[index].Other++;
            // } //increment the count of shows with that animation type by 1

            //use this version of the conditional block to count each show with multiple styles for each animation style it uses
            if(rowTemp[7].includes("Traditional")||rowTemp[7].includes("Flash")||rowTemp[7].includes("CGI")){
                if(rowTemp[7].includes("Traditional")){
                    yearTechnique[index].Traditional++;
                }
                if(rowTemp[7].includes("Flash")){
                    yearTechnique[index].Flash++;
                }
                if(rowTemp[7].includes("CGI")){
                    yearTechnique[index].CGI++;
                }
            }
            else{ 
                yearTechnique[index].Other++;
            } //increment the count of shows with that animation type by 1
        }

    }

    // console.log(yearTechnique);


    const stackedData = d3.stack() //convert yearTechnique array to stackedData using d3.stack()
        .keys(["Traditional","Flash","CGI","Other"])
        (yearTechnique)





    const chartWrapper = d3.select('#area_chart_wrapper');



    const chartWidth = parseInt(chartWrapper.style('width').replace('px', ''))
    const chartHeight = parseInt(chartWrapper.style('height').replace('px', ''))
    const chartManager = new Chart('area_chart', chartWidth, chartHeight)
    chartManager.setChartData(yearTechnique)

    const color = d3.scaleOrdinal() //simple color assignation since small number of categories shown
    .domain(['CGI','Flash','Traditional','Other'])
    .range(d3.schemeSet2);

    const xScale=d3.scaleLinear()
        .domain(d3.extent(yearTechnique, function(d) { return d.year; }))
        .range([0,chartManager.dimensions.width])

    const yScale=d3.scaleLinear()
        .domain([0,550])
        .range([chartManager.dimensions.height, 0])
   

    var xAxis=chartManager.rootSVG.append('g')
        .attr('transform', `translate(${chartManager.dimensions.margins.left}, ${chartManager.dimensions.margins.top+chartManager.dimensions.height})`)
        .attr('class','areaXAxis')

        .call(d3.axisBottom(xScale))
    
    chartManager.rootSVG.append('text')
        .attr('class','axis-label')
        .attr('text-anchor','middle')
        .attr('x',chartManager.dimensions.width/2+chartManager.dimensions.margins.left)
        .attr('y',chartManager.dimensions.height+70)
        .text('Year')  

    chartManager.rootSVG.append('text')
        .attr('transform','rotate(-90)')  
        .attr('class','axis-label')
        .attr('text-anchor','middle')
        .attr('y',chartManager.dimensions.margins.left/2)
        .attr('x',-chartManager.dimensions.height/2+chartManager.dimensions.margins.top)
        .text('Number of Shows')

    var yAxis=chartManager.rootSVG.append('g')
        .call(d3.axisLeft(yScale))
        .attr('transform', `translate(${chartManager.dimensions.margins.left}, ${chartManager.dimensions.margins.top})`)
        .selectAll('text')
        .attr('dx','5px')
        .attr('dy','2px')
        .attr('transform', 'rotate(-15)' );


    const clip = chartManager.rootSVG.append("defs").append("svg:clipPath") //heavily drawn from https://d3-graph-gallery.com/graph/stackedarea_template.html
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", chartManager.dimensions.width )
        .attr("height", chartManager.dimensions.height )
        .attr("x", 0)
        .attr("y", 0);

    const brush = d3.brushX()          //heavily drawn from https://d3-graph-gallery.com/graph/stackedarea_template.html
        .extent( [ [0,0], [chartManager.dimensions.width,chartManager.dimensions.height] ] ) 
        .on("end", updateChart)

    // const CHART = AREA_SVG.append('g')
    //     .attr('transform', `translate(${MARGINS.left}, ${MARGINS.top})`)
    //     .attr("clip-path", "url(#clip)")


  
        
    const area = d3.area()
        .x(function(d) { return xScale(d.data.year); })
        .y0(function(d) { return yScale(d[0]); })
        .y1(function(d) { return yScale(d[1]); })

    chartManager.CHART.selectAll('mylayers')
        .data(stackedData)
        .join('path')
            .attr("class", function(d) { return "myArea " + d.key })
            .style("fill", function(d) { return color(d.key); })
            .attr("d", area)

            .on('mouseover', highlight)
            .on('mouseout', unhighlight)

    chartManager.CHART.append('g')
        .attr("class", "brush")
        .call(brush);

    chartManager.rootSVG.selectAll('myRect') //legend largely adapted from https://d3-graph-gallery.com/graph/stackedarea_template.html
        .data(stackedData)
        .enter()
        .append("rect")
            .attr("y", 10)
            .attr("x", function(d,i){ return chartManager.dimensions.margins.left + i*(chartManager.dimensions.width/4)})
            .attr("width", 20)
            .attr("height", 20)
            .style("fill", function(d){ return color(d.key)})

    chartManager.rootSVG.selectAll('legendText')
        .data(stackedData)
        .enter()
        .append("text")
            .attr("y", chartManager.dimensions.margins.top-12)
            .attr("x", function(d,i){ return chartManager.dimensions.margins.left + 25 + i*(chartManager.dimensions.width/4)})
            .text(function(d){return d.key})

    var idleTimeout
    function idled() { idleTimeout = null; }
        
    function updateChart(event,d) { //heavily drawn from https://d3-graph-gallery.com/graph/stackedarea_template.html

        var extent = event.selection
        console.log(extent)
    
        // If no selection, back to initial coordinate. Otherwise, update X axis domain
        if(!extent){
            if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
            xScale.domain(d3.extent(yearTechnique, function(d) { return d.year; }))
        }else{
            xScale.domain([ xScale.invert(extent[0]), xScale.invert(extent[1]) ])
            chartManager.CHART.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done

        }
    
        // Update axis and area position
        xAxis.transition().duration(1000).call(d3.axisBottom(xScale).ticks(5))
        chartManager.CHART.selectAll('path')
            .transition().duration(1000)
            .attr("d", area)
        }

        var highlight = function(d){ //highlighting funtion taken from https://d3-graph-gallery.com/graph/stackedarea_template.html
            console.log(d)
            // reduce opacity of all groups
            d3.selectAll(".myArea").style("opacity", .1)
            // expect the one that is hovered
            d3.select("."+d).style("opacity", 1)
        }
        var unhighlight = function(d){
            d3.selectAll(".myArea").style("opacity", 1)
        }

    
    return chartManager

}
            
