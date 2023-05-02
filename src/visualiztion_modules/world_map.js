


export const drawWorldMap = (dataset1, dataset2) => {

    let div = d3.select('#world_map_tooltip').style("opacity", 0)
    let data_map = {}
    let filtered_data={}
    let country_map={"United States" : "USA" , "US" : "USA", "United Kingdom" : "England", "UK" : "England"}
    const showsByCountry1 = dataset1.loc({rows: [":"], columns:['Country', 'Premiere Year', 'Final Year']})
    let set1Json = dfd.toJSON(showsByCountry1)
   // console.log("printing json")
   // console.log(set1Json)
    
    set1Json = set1Json.map(x => {
        if(country_map[x.Country]!= undefined)
        return{
            "Country":country_map[x.Country], "Premiere Year": x["Premiere Year"], "Final Year": x["Final Year"]

        }
        else
        {
            return x 
        }
        
    })
    //console.log(set1Json)

    
    for(var i =0; i<=set1Json.length; i++)
    {
         if(set1Json[i] != undefined)
         {
            let premiere_year = Number(set1Json[i]["Premiere Year"])
            let final_year = Number(set1Json[i]["Final Year"])
            let country = set1Json[i]["Country"].split(",")
            for( var j=premiere_year ; j<=final_year; j++)
            {
                if(data_map[j]!= undefined)
                {
                    data_map[j]=[...data_map[j],...country]
                }
                else
                {
                    data_map[j] = country
                }
                
            }

         }
        
        

    }
    const showsByCountry2 = dataset2.loc({rows: [":"], columns:['Country', 'Premiere Year', 'Final Year']})
    let set2Json = dfd.toJSON(showsByCountry2)
    // console.log("printing json")
    // console.log(set2Json)
    
    set2Json = set2Json.map(x => {
        if(country_map[x.Country]!= undefined)
        return{
            "Country":country_map[x.Country], "Premiere Year": x["Premiere Year"], "Final Year": x["Final Year"]

        }
        else
        {
            return x 
        }
        
    })
    // console.log(set2Json)

    
    for(var i =0; i<=set2Json.length; i++)
    {
         if(set2Json[i] != undefined)
         {
            let premiere_year = Number(set2Json[i]["Premiere Year"])
            let final_year = Number(set2Json[i]["Final Year"])
            let country = set2Json[i]["Country"].split(",")
            for( var j=premiere_year ; j<=final_year; j++)
            {
                if(data_map[j]!= undefined)
                {
                    data_map[j]=[...data_map[j],...country]
                }
                else
                {
                    data_map[j] = country
                }
                
            }

         }
        
        

    }
    filtered_data = data_map
    // console.log("printing datamap")
    // console.log(data_map)


    const holyDF = new dfd.DataFrame(set1Json)




    const groupedCountries2 = holyDF.groupby(['Country'])
    const showCountsByCountry2 = groupedCountries2.col(['Country']).count
    // console.log("printing showcounts")
    // console.log(showCountsByCountry2)

    const chartWrapper = d3.select('#world_chart_wrapper');
    const CANVAS_DIMENSIONS = {
        width: parseInt(chartWrapper.style('width').replace('px', '')),
        height: parseInt(chartWrapper.style('height').replace('px', ''))
    }

    const worldMap_SVG = chartWrapper.append('svg')
    .attr('width', CANVAS_DIMENSIONS.width)
    .attr('height', CANVAS_DIMENSIONS.height)


// Map and projection
const projection = d3.geoNaturalEarth1()
    .scale(CANVAS_DIMENSIONS.width / 2 / Math.PI)
    .translate([CANVAS_DIMENSIONS.width / 2, CANVAS_DIMENSIONS.height /4])

const map_svg = worldMap_SVG.append('g')
// var ySlide=d3.select('#map-y-slider').property('value');
// console.log("printing yslider")
// console.log(ySlide)
// Load external data and boot
console.log("pritning slider val")
let slider = document.getElementById("map-y-slider")
slider.oninput = function(){
    filtered_data = {}
    for(let year in data_map)
    {
        if(year <= this.value)
        {
            filtered_data[year] = data_map[year]
        }
    }


}


d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then( function(data) {

    // Draw the map
    map_svg
        .selectAll("path")
        .data(data.features)
        .join("path")
            .attr("fill", "#69b3a2")
            .attr("d", d3.geoPath()
            .projection(projection)
            )
            .style("stroke", "#fff")
            .on('mouseover', function (d,i ){
                
                const country_name = i.properties.name
                let country_count=0

                for(let year in filtered_data)
                {
                   country_count += filtered_data[year].filter(x => x==country_name).length
                    
                }
                console.log(country_name, country_count)
                console.log(d)
                div.html("Country:" + country_name + "<br/>" + "Count: "+ country_count)
                .style("opacity", 1)
                .style("left", (d.pageX) + "px")
                .style("top", (d.pageY - 28) + "px");
                






            })
            .on("mouseleave", function(d) {
                div//.transition()
                    //.duration(25)
                    .style("opacity", 0);
                })

        

})
    
  


    
    
    

    
       
        
        

        }
    
    
    

    
    
         






