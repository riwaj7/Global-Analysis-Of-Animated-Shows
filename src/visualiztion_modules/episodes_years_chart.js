import {getCanonicalName} from "../global_utilities.js";
import {Chart} from "../chart.js";

export const drawScatterChart = (dataset1, dataset2) => {
    const showsByYears = [];
    for(let i=0;i<dataset1['$data'].length;i++){
        var rowTemp=dataset1['$data'][i];
        rowTemp[2]=getCanonicalName(rowTemp[2]);
        if(rowTemp[4]=="Present"||rowTemp[4]=="present"){
            rowTemp[4]=2022;
        }
        if(Number.isInteger(+rowTemp[1])&&rowTemp[1]!=''){ //filter out shows with no number of episodes given, or a non-numeric value for episodes
            showsByYears.push({Title: rowTemp[0], Episodes: +rowTemp[1], Country: rowTemp[2], Years: (rowTemp[4]-rowTemp[3]+1), Seasons: 0, StartYear: rowTemp[3]});
        }
    }
    for(let i=0;i<dataset2['$data'].length;i++){
        var rowTemp=dataset2['$data'][i];
        rowTemp[3].split(',');
        rowTemp[3]=getCanonicalName(rowTemp[3]);
        if(rowTemp[5]=="Present"||rowTemp[5]=="present"){
            rowTemp[5]=2022;
        }
        if(Number.isInteger(+rowTemp[2])&&rowTemp[2]!=''){ //filter out shows with no number of episodes given
            showsByYears.push({Title: rowTemp[0], Episodes: +rowTemp[2], Country: rowTemp[3], Years: (Math.abs(rowTemp[5]-rowTemp[4])+1), Seasons: +rowTemp[1], StartYear: rowTemp[4]});
        }

    }


    const chartWrapper = d3.select('#scatter_chart_wrapper');


    const scatterTip = d3.select('#scatter_tooltip')

    const nameLabel = scatterTip.append('div').attr('class', 'ps-2')
    const episodesLabel = scatterTip.append('div').attr('class', 'ps-2')
    const lengthLabel = scatterTip.append('div').attr('class', 'ps-2')



    const chartWidth = parseInt(chartWrapper.style('width').replace('px', ''))
    const chartHeight = parseInt(chartWrapper.style('height').replace('px', ''))
    const chartManager = new Chart('scatter_chart', chartWidth, chartHeight)
    chartManager.setChartData(showsByYears)


    const colorYear=d3.scaleLinear()
        .domain(d3.extent(showsByYears, function(d) { return d.StartYear; }))
        .range(['blue','red'])


    const xScale = d3.scaleLinear()
        .domain([0,1+d3.max(showsByYears, function(d) { return d.Years; })])
        .range([0,chartManager.dimensions.width])


    const yScale = d3.scaleLinear()
        .domain([0,100+d3.max(showsByYears, function(d) { return d.Episodes; })])
        .range([chartManager.dimensions.height, 0])



    var xAxis=chartManager.rootSVG.append('g')
        .attr('transform', `translate(${chartManager.dimensions.margins.left}, ${chartManager.dimensions.margins.top+chartManager.dimensions.height})`)
        .attr('class','scatterXAxis')
        .call(d3.axisBottom(xScale))


    var yAxis=chartManager.rootSVG.append('g')
        .call(d3.axisLeft(yScale))
        .attr('class','scatterYAxis')
        .attr('transform', `translate(${chartManager.dimensions.margins.left}, ${chartManager.dimensions.margins.top})`)
        .selectAll('text')
            .attr('dx','12px')
            .attr('dy','-5px')
            .attr('transform', 'rotate(-60)' );

    chartManager.rootSVG.append('text')
        .attr('class','axis-label')
        .attr('text-anchor','middle')
        .attr('x',chartManager.dimensions.width/2+chartManager.dimensions.margins.left)
        .attr('y',chartManager.dimensions.height+70)
        .text('Years Aired')  

    chartManager.rootSVG.append('text')
        .attr('transform','rotate(-90)')  
        .attr('class','axis-label')
        .attr('text-anchor','middle')
        .attr('y',chartManager.dimensions.margins.left/2)
        .attr('x',-chartManager.dimensions.height/2+chartManager.dimensions.margins.top)
        .text('Number of Episodes')

    const clip = chartManager.rootSVG.append("defs").append("svg:clipPath") //adapted from https://d3-graph-gallery.com/graph/stackedarea_template.html
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", chartManager.dimensions.width )
        .attr("height", chartManager.dimensions.height )
        .attr("x", 0)
        .attr("y", 0);

    const brush = d3.brush()          //adapted from https://d3-graph-gallery.com/graph/stackedarea_template.html
        .extent( [ [0,0], [chartManager.dimensions.width,chartManager.dimensions.height] ] ) 
        .on("end", updateChart)


    chartManager.CHART.append('g')
        .attr("class", "brush")
        .call(brush)


    chartManager.CHART.selectAll('.episodeCircle')
        .data(showsByYears)
        .join('circle')
            .attr('cx', row=>xScale(row['Years']))
            .attr('cy', row=>yScale(row['Episodes']))
            .attr('r',3)
            // .attr('fill', d=>color_country(d))
            .attr('fill', d=>color_year(d))
            .attr('class',function(d){
                if(d['Years']<20&&d['Episodes']<500){
                    return 'episodeCircle youngCircle'
                }
                else{
                    return 'episodeCircle oldCircle'
                }
            })


        .on('mouseover', function(d,i){

            var mouseX=d.clientX;
            var mouseY=d.layerY;
            scatterTip.style('opacity', 1)
            nameLabel.text(i.Title)
            episodesLabel.text('Episodes: '+i.Episodes)
            lengthLabel.text('Years: '+i.Years)

            scatterTip.style('left',`${mouseX}px`)
            scatterTip.style('top',`${mouseY}px`)
            scatterTip.style('display','block')

        })
        .on('mouseout', function(d,i){
            scatterTip.style('display','none')
        })


    const svgDefs=chartManager.rootSVG.append('defs') //gradient implementation from https://www.freshconsulting.com/insights/blog/d3-js-gradients-the-easy-way/
        .attr('id', 'mainGradient');

    var gradient = svgDefs.append("linearGradient") 
        .attr("id", "svgGradient")
        .attr("x1", "100%")
        .attr("x2", "0%")
        .attr("y1", "0%")
        .attr("y2", "0%");

    gradient.append("stop")
        .attr('class', 'start')
        .attr("offset", "0%")
        .attr("stop-color", "red")
        .attr("stop-opacity", 1);
        
    gradient.append("stop")
        .attr('class', 'end')
        .attr("offset", "100%")
        .attr("stop-color", "blue")
        .attr("stop-opacity", 1);

    chartManager.rootSVG
        .append('rect')
            .attr('x',chartManager.dimensions.margins.left+50)
            .attr('y',chartManager.dimensions.margins.top-15)
            .attr('width',chartManager.dimensions.width-chartManager.dimensions.margins.left-chartManager.dimensions.margins.left)
            .attr('height',10)
            .style('fill',"url(#svgGradient)")
    chartManager.rootSVG
        .append('text')
            .attr('x',chartManager.dimensions.margins.left)
            .attr('y',chartManager.dimensions.margins.top-5)
            .text('Older')
    chartManager.rootSVG
        .append('text')
            .attr('x',chartManager.dimensions.width)
            .attr('y',chartManager.dimensions.margins.top-5)
            .text('Newer')


    var idleTimeout
    function idled() { idleTimeout = null; }


    function updateChart(event,d) { //heavily drawn from https://d3-graph-gallery.com/graph/stackedarea_template.html

        var extent = event.selection
        console.log(extent)
    
        // If no selection, back to initial coordinate. Otherwise, update X axis domain

        var x1=55
        var x2=0

        if(!extent){
            if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
            xScale.domain([0,1+d3.max(showsByYears, function(d) { return d.Years; })])
            yScale.domain([0,100+d3.max(showsByYears, function(d) { return d.Episodes; })])
            
        }else{
            xScale.domain([ xScale.invert(extent[0][0]), xScale.invert(extent[1][0]) ])
            yScale.domain([yScale.invert(extent[1][1]), yScale.invert(extent[0][1])])
            chartManager.CHART.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
            x1=xScale.invert(extent[0][0])
            x2=xScale.invert(extent[1][0])
        }
    
        // Update axis and area position
        xAxis.transition().duration(1000).call(d3.axisBottom(xScale).ticks(5))
        yAxis.transition().duration(1000).call(d3.axisLeft(yScale))
        chartManager.CHART.selectAll('circle')
            .transition().duration(1000)
            // .attr("d", area)
            .attr('cx', row=>xScale(row['Years']))
            .attr('cy', row=>yScale(row['Episodes']))
            .attr('r',3+Math.round(55/(x2-x1)/4)) //increase size of dots as xScale shrinks
    }

    function color_year(r){
        return colorYear(r.StartYear)
    }

    return chartManager

}


