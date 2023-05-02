

export const drawPieChart = (dataset1, dataset2) => {
    const showsByTechnique = dataset2.loc({rows: [":"], columns:['Title', 'Technique']})
    console.log("showsbytech")
    console.log(showsByTechnique)
    const set1Json = dfd.toJSON(showsByTechnique)
    console.log("set1json");
    console.log(set1Json);
    var fc = flashCount(set1Json);
    var tc = traditionalCount(set1Json);
    var cc = cgiCount(set1Json);
    var oc = oCount(set1Json);
    // var oc = 2477 - fc - tc - cc;  //total number of Techniques used = 2477 , oc =2 for dataset2

    




    const chartWrapper = d3.select('#pie_chart_wrapper');
    const CANVAS_DIMENSIONS = {
        width: parseInt(chartWrapper.style('width').replace('px', '')),
        height: parseInt(chartWrapper.style('height').replace('px', ''))
    }
    console.log("printing canvas dimens")
    console.log(CANVAS_DIMENSIONS)
  


    const PIE_SVG = chartWrapper.append('svg')
        .attr('width', CANVAS_DIMENSIONS.width)
        .attr('height', CANVAS_DIMENSIONS.height)

    

    const radius = Math.min(CANVAS_DIMENSIONS.width, CANVAS_DIMENSIONS.height)/2 -75
    console.log("printing radius")
    console.log(radius);
    
    const PIE_1 = PIE_SVG.append("g")
                .attr('transform', `translate(${CANVAS_DIMENSIONS.width/2}, ${CANVAS_DIMENSIONS.height/2})`)

    var finalData = {Flash: fc, Traditional: tc, CGI: cc, OTHERS: oc};
    console.log("Finaldata");
    console.log(finalData)

    const color = d3.scaleOrdinal(d3.schemePastel1);
    console.log("pringint pie")
    const pie = d3.pie()
    .value(d=> d[1])
    
    
    

    var data_ready = pie(Object.entries(finalData))
    console.log("printing dataready")
    console.log(data_ready)
    
    const arcGenerator = d3.arc()
        .innerRadius(0)
        .outerRadius(radius)

    
    PIE_1.selectAll('slices')
    .data(data_ready)
    .join('path')
    .attr('d', arcGenerator)
    .attr('fill', d => color(d.data[0]))
    .attr("stroke", "black")
    .style("stroke-width", "0.25px")
    .style('opacity', 1)
    .on('mouseover', function (d,i ){
    
        d3.select(this).transition()
            .duration('5')
            .style('opacity', '1')
            .style("stroke-width", "2px")

          
        
            //filtering data_ready to show only the mouse hovered data
          var d2 =  data_ready.filter(function(el){
                return (el.index===i.index)
               
            
              })
              console.log("printing d2")
              console.log(d2);
            PIE_1
            .selectAll('slices')
            .data(d2)
            .enter()
            .append('text')
            .text(function(d){ return d.data[0]+":" + d.data[1]})
            .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
            .style("text-anchor", "middle")
            .style("font-size", "5")
                            

       
        
        

        })
    .on('mouseout',function(d,i){
        PIE_1.selectAll('text').remove()
        PIE_1.selectAll('path').style('stroke-width','0.25px')
    })
    
    

    
    
         





}
function flashCount(set1Json){
    var count = 0;
    console.log("printing set1json on flashcou t ")
    console.log(set1Json);
    for(var i =0; i<set1Json.length; i++)
    {
        if(set1Json[i].Technique.includes('Flash'))
        {
            count++;
        }
    }
    
    console.log(set1Json[0].Technique);
    console.log(set1Json[1].Technique);
    console.log(set1Json[2].Technique);
    console.log(count);
   
    return count;

}
function traditionalCount(set1Json){
    var count = 0;
    for(var i =0; i<set1Json.length; i++)
    {
        if(set1Json[i].Technique.includes('Traditional'))
        {
            count++;
        }
    }
    /*
    console.log(set1Json[0].Technique);
    console.log(set1Json[1].Technique);
    console.log(set1Json[2].Technique);
    console.log(count);
    */
    console.log(count);
    return count;

}
function cgiCount(set1Json){
    var count = 0;
    for(var i =0; i<set1Json.length; i++)
    {
        if(set1Json[i].Technique.includes('CGI'))
        {
            count++;
        }
    }
    
    console.log(count);
    return count;

}

function oCount(set1Json){
    var count = 0;
    for(var i =0; i<set1Json.length; i++)
    {
        if(!(set1Json[i].Technique.includes('Traditional')||set1Json[i].Technique.includes('Flash')||set1Json[i].Technique.includes('CGI')))
        {
            count++;
        }
    }
    console.log(count);
    return count;
}
